import assert from 'node:assert/strict';
import {CLASSES} from '../public/catalog.js';
import {newRoom,newPlayer,advance,reset} from '../worker/engine.mjs';
function fixture(classId){let now=1000;const s=newRoom('CLASSES',now);s.players=[newPlayer('a','x','A',0,now),newPlayer('b','y','B',1,now)];s.players[0].classId=classId;reset(s,now);s.phase='playing';const [a,b]=s.players;a.x=100;b.x=140;return {s,a,b,step(seconds=1/60){const until=now+seconds*1000;while(now<until){now=Math.min(until,now+1000/60);for(const p of s.players)p.seen=now;advance(s,now);}}};}
for(const [id,profile] of Object.entries(CLASSES)){
 const f=fixture(id);assert.equal(f.a.hp,profile.hp);assert.equal(f.a.speed,profile.speed);f.a.input.move=1;f.step(.1);assert(Math.abs(f.a.x-(100+profile.speed*.1))<.001);
 for(let i=0;i<3;i++){
  const f=fixture(id);f.a.input.fire[i]=true;f.step();f.a.input.fire[i]=false;
  if(profile.abilities[i].kind==='dash'){assert(f.a.x<120,'dash starts without teleport');f.step(.35);assert(f.a.x>200);assert.equal(f.b.hp,100);}
  else{f.step(.9);assert(f.b.hp<100,id+' skill '+i+' deals damage');}
 }
}
for(const [id,skills] of [['knight',[0,1,2]],['rogue',[0,2]]])for(const i of skills){const f=fixture(id);f.b.input.parry=true;f.a.input.fire[i]=true;f.step();f.a.input.fire[i]=false;f.step(.1);assert.equal(f.b.hp,100,id+' skill '+i+' can be parried');}
{
 const front=fixture('rogue');front.b.dir=-1;front.a.input.fire[2]=true;front.step();assert.equal(front.b.hp,58);
 const back=fixture('rogue');back.b.dir=1;back.a.input.fire[2]=true;back.step();assert.equal(back.b.hp,40);
 const f=fixture('knight');f.a.hp=0;f.a.respawn=.05;f.step(.1);assert.equal(f.a.hp,130,'respawn uses class health');
 const far=fixture('knight');far.b.x=300;far.a.input.fire[0]=true;far.step();assert.equal(far.b.hp,100,'melee range enforced');
 const edge=fixture('rogue');edge.a.x=450;edge.a.input.fire[1]=true;edge.step(.4);assert.equal(edge.a.x,462,'dash stays inside arena');
}
console.log('PASS: all class stats, movement, 9 abilities, melee range, backstab bonus, dash bounds, respawn, parry against new attacks');
