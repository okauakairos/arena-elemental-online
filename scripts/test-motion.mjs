import assert from 'node:assert/strict';
import {newRoom,newPlayer,reset,advance,snapshot} from '../worker/engine.mjs';
function fixture(classId){let now=1000;const s=newRoom('MOTION',now);s.players=[newPlayer('a','x','A',0,now),newPlayer('b','y','B',1,now)];s.players[0].classId=classId;reset(s,now);s.phase='playing';const [a,b]=s.players;a.x=100;b.x=165;return {s,a,b,step(seconds=1/60){const end=now+seconds*1000;while(now<end){now=Math.min(end,now+1000/60);for(const p of s.players)p.seen=now;advance(s,now);}}};}
for(const id of ['knight','rogue']){
 const f=fixture(id);f.a.input.fire[1]=true;f.step();f.a.input.fire[1]=false;assert.equal(f.a.x,100,'no instant position change');assert.equal(f.b.hp,100,'no damage before contact');
 const positions=[f.a.x];for(let i=0;i<24;i++){f.step();positions.push(f.a.x);}
 assert.equal(f.a.x,id==='knight'?178:205);assert(new Set(positions).size>=15,'many intermediate positions');assert(Math.max(...positions.slice(1).map((x,i)=>x-positions[i]))<11,'bounded distance per frame');assert.equal(f.a.burst,null);
 assert.equal(f.b.hp,id==='knight'?70:100,'one charge hit, harmless dash');
}
{
 const f=fixture('knight');f.a.input.fire[1]=true;f.step();f.a.input.fire[1]=false;f.step(.12);assert.equal(f.b.hp,100);f.b.input.parry=true;f.step(.25);assert.equal(f.b.hp,100,'parry blocks moving charge');assert.equal(f.b.parryCd,0,'successful parry unlocks immediately');
 f.b.input.parry=false;f.step();f.b.input.parry=true;f.step();assert(f.b.parry>.25);assert(f.b.parryCd>1,'second parry allowed before original cooldown');
 f.step(.4);f.step(1);assert.equal(f.b.parry,0,'holding still cannot auto-repeat');
 const dead=fixture('rogue');dead.a.input.fire[1]=true;dead.step();dead.a.hp=0;dead.a.respawn=2.5;const x=dead.a.x;dead.step(.1);assert.equal(dead.a.x,x);assert.equal(dead.a.burst,null);
 const resetRound=fixture('knight');resetRound.a.input.fire[1]=true;resetRound.step();const view=snapshot(resetRound.s,1000);assert(!('hits' in view.players[0].burst),'internal hit list stays private');reset(resetRound.s,2000);assert.equal(resetRound.a.burst,null);
}
console.log('PASS: continuous dash/charge, gradual acceleration, damage on contact once, parry recharge, no held auto-parry, death/reset interruption');
