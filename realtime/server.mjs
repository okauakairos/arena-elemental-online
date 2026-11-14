import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomBytes,randomUUID,createHash} from 'node:crypto';
import {WebSocketServer,WebSocket} from 'ws';
import {newRoom,newPlayer,reset,advance,snapshot,MAX} from '../worker/engine.mjs';

const publicDir=fileURLToPath(new URL('../public/',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const idle=()=>({move:0,jump:false,fire:[false,false,false]});
const hash=token=>createHash('sha256').update(token).digest('hex');
const fail=(message,status=400)=>{throw Object.assign(new Error(message),{status});};
export function createArena({allowedOrigins=[],maxRooms=200}={}){
 const rooms=new Map();
 const server=http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});return res.end(JSON.stringify({ok:true,transport:'websocket'}));}
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
  try{const target=path.resolve(publicDir,'.'+decodeURIComponent(url.pathname==='/'?'/pvp.html':url.pathname));if(!target.startsWith(publicDir))throw Error();const data=await readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(404);res.end('Não encontrado');}
 });
 const wss=new WebSocketServer({noServer:true,maxPayload:4096,perMessageDeflate:false});
 server.on('upgrade',(req,socket,head)=>{
  const origin=req.headers.origin;
  let sameOrigin=false;try{sameOrigin=!!origin&&new URL(origin).host===req.headers.host;}catch{socket.destroy();return;}
  if(req.url!=='/ws'||(allowedOrigins.length&&origin&&!sameOrigin&&!allowedOrigins.includes(origin))||wss.clients.size>=600){socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');socket.destroy();return;}
  wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws));
 });
 const send=(ws,data)=>{if(ws.readyState===WebSocket.OPEN&&ws.bufferedAmount<128*1024)ws.send(JSON.stringify(data));};
 function view(entry){const s=snapshot(entry.state,Date.now());s.players=s.players.map(p=>({...p,connected:entry.connections.has(p.id)}));s.waiting=s.players.filter(p=>p.connected).length<2;return s;}
 function broadcast(entry){entry.state.revision=(entry.state.revision||0)+1;const room=view(entry);for(const [id,ws] of entry.connections)send(ws,{type:'state',room,ack:entry.state.players.find(p=>p.id===id)?.seq??-1});}
 function detach(ws,remove=false){const entry=ws.entry,p=ws.player;if(!entry||entry.connections.get(p.id)!==ws)return;entry.connections.delete(p.id);entry.lastUsed=Date.now();entry.disconnected.set(p.id,Date.now());p.input=idle();p.parryQueued=false;p.parryHeld=false;p.parry=0;p.seen=0;ws.entry=ws.player=null;if(remove){entry.state.players=entry.state.players.filter(q=>q.id!==p.id);entry.disconnected.delete(p.id);}if(entry.state.host===p.id)entry.state.host=entry.connections.keys().next().value??entry.state.players[0]?.id??null;broadcast(entry);}
 wss.on('connection',ws=>{
  ws.lastMessage=Date.now();ws.window=Date.now();ws.count=0;
  ws.on('error',()=>{});
  ws.on('close',()=>detach(ws));
  ws.on('message',raw=>{
   let m;
   try{
    const now=Date.now();if(now-ws.window>1000){ws.window=now;ws.count=0;}if(++ws.count>100){ws.close(1008,'Muitas mensagens');return;}
    m=JSON.parse(raw.toString());if(!m||typeof m!=='object'||typeof m.action!=='string')fail('Mensagem inválida.');
    ws.lastMessage=now;
    let result={};
    if(m.action==='ping'){if(ws.player)ws.player.seen=now;send(ws,{type:'pong',time:m.time});return;}
    if(m.action==='create'||m.action==='join'){
     if(ws.entry)fail('Você já está em uma sala.');
     const name=typeof m.name==='string'?m.name.trim().slice(0,18):'';
     if(!name)fail('Escolha um apelido.');
     if(typeof m.token!=='string'||!/^[a-zA-Z0-9-]{24,80}$/.test(m.token))fail('Chave de sessão inválida.');
     let entry,code;
     if(m.action==='create'){
      if(rooms.size>=maxRooms)fail('Servidor cheio. Tente novamente em instantes.',503);
      do{code=randomBytes(4).toString('hex').toUpperCase();}while(rooms.has(code));
      entry={state:newRoom(code,now),connections:new Map(),disconnected:new Map(),lastUsed:now};rooms.set(code,entry);
     }else{code=String(m.code||'').toUpperCase();entry=rooms.get(code);if(!entry)fail('Sala encerrada. Crie uma nova sala.',404);}
     const secret=hash(m.token);let p=entry.state.players.find(p=>p.hash===secret);
     if(!p){if(m.id)fail('Sessão inválida.',401);if(entry.state.players.length>=MAX)fail('A sala já tem 3 jogadores.',409);if(!['lobby','finished'].includes(entry.state.phase))fail('A partida já começou.',409);const slot=[0,1,2].find(i=>!entry.state.players.some(p=>p.slot===i));p=newPlayer(randomUUID(),secret,name,slot,now);entry.state.players.push(p);entry.state.host??=p.id;}
     const prior=entry.connections.get(p.id);entry.connections.set(p.id,ws);if(prior&&prior!==ws){prior.entry=prior.player=null;prior.close(4001,'Sessão aberta em outra conexão');}
     ws.entry=entry;ws.player=p;p.seen=now;p.input=idle();entry.lastUsed=now;entry.disconnected.delete(p.id);
     result={id:p.id,token:m.token,room:view(entry)};
    }else{
     const entry=ws.entry,p=ws.player;if(!entry||!p)fail('Entre em uma sala.',401);
     p.seen=now;entry.lastUsed=now;
     if(m.action==='input'){
      const i=m.input;if(!Number.isSafeInteger(m.seq)||!i||![-1,0,1].includes(i.move)||typeof i.jump!=='boolean'||(i.parry!==undefined&&typeof i.parry!=='boolean')||!Array.isArray(i.fire)||i.fire.length!==3||!i.fire.every(v=>typeof v==='boolean'))fail('Comando inválido.');
      if(m.seq>p.seq){p.seq=m.seq;ws.lastInput=now;p.parryQueued||=i.parry===true&&!p.input.parry;p.input={move:i.move,jump:i.jump,parry:i.parry===true,fire:[...i.fire]};}return;
     }else if(m.action==='start'){
      if(entry.state.host!==p.id)fail('Só o criador pode iniciar.',403);
      if(!['lobby','finished'].includes(entry.state.phase))fail('A partida já começou.',409);
      if(entry.connections.size<2)fail('Aguarde pelo menos um amigo.');
      reset(entry.state,now);result={room:view(entry)};
     }else if(m.action==='leave'){detach(ws,true);result={ok:true};}
     else fail('Ação desconhecida.');
    }
    send(ws,{type:'reply',requestId:m.requestId,...result});if(ws.entry)broadcast(ws.entry);
   }catch(e){send(ws,{type:'reply',requestId:m?.requestId,error:e.status?e.message:'Mensagem inválida.',status:e.status||400});}
  });
 });
 const simulation=setInterval(()=>{const now=Date.now();for(const entry of rooms.values())if(entry.connections.size){for(const ws of entry.connections.values())if(now-(ws.lastInput||0)>500)ws.player.input=idle();advance(entry.state,now);}},1000/60);
 const updates=setInterval(()=>{for(const entry of rooms.values())if(entry.connections.size)broadcast(entry);},50);
 const cleanup=setInterval(()=>{const now=Date.now();for(const ws of wss.clients)if(now-ws.lastMessage>10000)ws.terminate();for(const [code,entry] of rooms){for(const [id,leftAt] of entry.disconnected)if(now-leftAt>60000){entry.state.players=entry.state.players.filter(p=>p.id!==id);entry.disconnected.delete(id);}if(!entry.connections.size&&now-entry.lastUsed>60000)rooms.delete(code);}},1000);
 async function close(){clearInterval(simulation);clearInterval(updates);clearInterval(cleanup);for(const ws of wss.clients)ws.terminate();await new Promise(resolve=>wss.close(resolve));await new Promise(resolve=>server.close(resolve));}
 return {server,close};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const arena=createArena({allowedOrigins:(process.env.ALLOWED_ORIGINS||'https://arena-elemental-pixelfx.earthy-hake-2018.chatgpt.site').split(',')});
 const port=Number(process.env.PORT)||4181;arena.server.listen(port,'0.0.0.0',()=>console.log(`Arena WebSocket: http://127.0.0.1:${port}/pvp.html`));
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>arena.close().then(()=>process.exit(0)));
}
