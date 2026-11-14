import {SERVER_URL} from './realtime-config.js';
export function createTransport({onState,onStatus,getSession,onExpired}){
 let socket=null,opening=null,serial=0,retry=null,stopped=false,lastPong=0,ready=false;
 const pending=new Map();
 const url=new URL(SERVER_URL||location.origin);url.protocol=url.protocol==='https:'?'wss:':'ws:';url.pathname='/ws';
 function send(data){if(socket?.readyState===WebSocket.OPEN&&socket.bufferedAmount<32768){socket.send(JSON.stringify(data));return true;}return false;}
 function rpc(action,body){return new Promise((resolve,reject)=>{const requestId=++serial;const timer=setTimeout(()=>{pending.delete(requestId);reject(new Error('O servidor demorou a responder.'));},8000);pending.set(requestId,{resolve,reject,timer});if(!send({action,...body,requestId})){clearTimeout(timer);pending.delete(requestId);reject(new Error('Conexão interrompida.'));}});}
 async function open(resume=true){
  if(ready&&socket?.readyState===WebSocket.OPEN)return;
  if(opening)return opening;stopped=false;
  opening=new Promise((resolve,reject)=>{
   const ws=new WebSocket(url);socket=ws;let settled=false;
   const timeout=setTimeout(()=>{ws.close();reject(new Error('O servidor está acordando. Tente novamente em alguns segundos.'));},65000);
   ws.onopen=async()=>{clearTimeout(timeout);lastPong=performance.now();try{const session=getSession();if(resume&&session){const data=await rpc('join',{...session,name:'Mago'});onState(data);}ready=true;settled=true;onStatus(true);resolve();}catch(e){settled=true;reject(e);if(e.status===401||e.status===404){onExpired(e);stopped=true;}ws.close();}};
   ws.onmessage=event=>{let data;try{data=JSON.parse(event.data);}catch{return;}
    if(data.type==='state'&&getSession())onState(data);
    if(data.type==='pong'){lastPong=performance.now();onStatus(true,Math.round(performance.now()-data.time));}
    if(data.type==='reply'){const item=pending.get(data.requestId);if(item){clearTimeout(item.timer);pending.delete(data.requestId);if(data.error)item.reject(Object.assign(new Error(data.error),{status:data.status}));else item.resolve(data);}}
   };
   ws.onerror=()=>{};
   ws.onclose=()=>{clearTimeout(timeout);ready=false;onStatus(false);for(const item of pending.values()){clearTimeout(item.timer);item.reject(new Error('Conexão interrompida.'));}pending.clear();if(!settled)reject(new Error('Não foi possível conectar. O servidor pode estar acordando.'));if(!stopped&&getSession()){clearTimeout(retry);retry=setTimeout(()=>open().catch(()=>{}),1000);}};
  }).finally(()=>{opening=null;});return opening;
 }
 setInterval(()=>{if(socket?.readyState===WebSocket.OPEN){if(performance.now()-lastPong>10000){socket.close();return;}send({action:'ping',time:performance.now()});}},1000);
 return {async request(action,body){await open(action!=='join');return rpc(action,body);},input(seq,input){return ready&&send({action:'input',seq,input});},close(){stopped=true;ready=false;clearTimeout(retry);socket?.close();}};
}
