import assert from 'node:assert/strict';
import {WebSocket} from 'ws';
import {randomUUID} from 'node:crypto';
import {createArena} from '../realtime/server.mjs';
const arena=createArena({allowedOrigins:['http://allowed.test']});
await new Promise(resolve=>arena.server.listen(0,'127.0.0.1',resolve));
const url=`ws://127.0.0.1:${arena.server.address().port}/ws`,clients=[];
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function client(){const ws=new WebSocket(url,{origin:'http://allowed.test'});await new Promise((resolve,reject)=>{ws.once('open',resolve);ws.once('error',reject);});let serial=0;const calls=new Map();const c={ws,room:null,token:randomUUID(),request(action,body={}){return new Promise((resolve,reject)=>{const requestId=++serial;const timer=setTimeout(()=>{calls.delete(requestId);reject(Error('timeout'));},3000);calls.set(requestId,{resolve,reject,timer});ws.send(JSON.stringify({action,requestId,...body}));});}};ws.on('message',raw=>{const data=JSON.parse(raw);if(data.room)c.room=data.room;if(data.type==='reply'){const p=calls.get(data.requestId);if(p){clearTimeout(p.timer);calls.delete(data.requestId);data.error?p.reject(Object.assign(Error(data.error),{status:data.status})):p.resolve(data);}}});c.heartbeat=setInterval(()=>{if(ws.readyState===1)ws.send(JSON.stringify({action:'ping',time:Date.now()}));},500);clients.push(c);return c;}
try{
 const a=await client(),b=await client(),c=await client(),d=await client();
 const made=await a.request('create',{name:'Ana',token:a.token});a.id=made.id;const code=made.room.code;
 await b.request('join',{name:'Bruno',token:b.token,code});const joined=await c.request('join',{name:'Clara',token:c.token,code});
 await assert.rejects(d.request('join',{name:'Quarto',token:d.token,code}),e=>e.status===409);
 await assert.rejects(b.request('start'),e=>e.status===403);
 await assert.rejects(a.request('input',{seq:1,input:{move:99,jump:false,fire:[false,false,false]}}),e=>e.status===400);
 await assert.rejects(b.request('configure',{mapId:'forest'}),e=>e.status===403);
 await assert.rejects(a.request('configure',{classId:'knight',mapId:'invalid'}),e=>e.status===400);
 assert.equal(a.room.players[0].classId,'mage','invalid map cannot partially apply a class');
 await assert.rejects(b.request('configure',{classId:'toString'}),e=>e.status===400);
 await a.request('configure',{mapId:'forest'});await b.request('configure',{classId:'knight'});await pause(80);assert.equal(c.room.mapId,'forest');assert.equal(c.room.players[1].maxHp,130);
 await a.request('start');await pause(3200);await assert.rejects(b.request('configure',{classId:'rogue'}),e=>e.status===409);await assert.rejects(a.request('configure',{mapId:'volcano'}),e=>e.status===409);assert.equal(a.room.phase,'playing');
 const x=a.room.players[0].x;a.ws.send(JSON.stringify({action:'input',seq:2,input:{move:1,jump:false,fire:[false,false,false]},hp:999,x:999}));await pause(350);a.ws.send(JSON.stringify({action:'input',seq:3,input:{move:0,jump:false,fire:[false,false,false]}}));await pause(100);
 assert(a.room.players[0].x>x+20);assert(a.room.players[0].x<200);assert.equal(a.room.players[0].hp,100);assert(Math.abs(a.room.players[0].x-b.room.players[0].x)<6);
 assert(!JSON.stringify(a.room).includes(a.token));assert(!('hash' in a.room.players[0]));
 c.ws.close();await pause(100);const re=await client();await re.request('join',{name:'Clara',token:c.token,id:joined.id,code});assert.equal(re.room.players.length,3);assert.equal(re.room.mapId,'forest');assert.equal(re.room.players[1].classId,'knight');
 a.ws.close();await pause(100);assert.equal(b.room.host,b.room.players[1].id,'host transfers immediately');
 await b.request('leave');await pause(100);assert.equal(re.room.waiting,true);assert.equal(re.room.host,joined.id);
 const denied=await new Promise(resolve=>{const bad=new WebSocket(url,{origin:'https://evil.test'});bad.on('unexpected-response',(_r,res)=>{resolve(res.statusCode);bad.terminate();});bad.on('error',()=>{});});assert.equal(denied,403);
 console.log('PASS: 3 players, limit, host permissions, validated inputs, authoritative movement/HP, synchronized snapshots, token redaction, reconnect, host transfer, origin restriction');
}finally{for(const c of clients){clearInterval(c.heartbeat);c.ws.terminate();}await arena.close();}
