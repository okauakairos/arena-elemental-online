import assert from 'node:assert/strict';
import {newRoom,newPlayer,advance,reset,snapshot} from '../worker/engine.mjs';
function fixture(){let now=1000;const s=newRoom('PARRY',now);s.players=[newPlayer('a','secret','A',0,now),newPlayer('b','secret2','B',1,now)];s.host='a';s.phase='playing';const p=s.players[1];p.x=240;return {s,p,step(seconds=1/60){const end=now+seconds*1000;while(now<end){now=Math.min(end,now+1000/60);for(const q of s.players)q.seen=now;advance(s,now);}},hit(kind){if(kind===2)s.bolts.push({owner:'a',x:p.x,t:.001});else s.shots.push({id:1,owner:'a',kind,x:p.x-10,y:p.y-23,dir:1,life:1});}};}
for(const kind of [0,1,2]){
 const f=fixture();f.p.input.parry=true;f.hit(kind);f.step();assert.equal(f.p.hp,100,'timed parry prevents damage '+kind);assert.equal(f.p.slow,0,'prevents freeze '+kind);assert(f.s.events.some(e=>e.type==='parry'));assert(!f.s.events.some(e=>e.type==='hit'));
 f.step(.4);f.hit(kind);f.step();assert(f.p.hp<100,'held Ctrl does not extend window '+kind);
 const late=fixture();late.hit(kind);late.step();const hp=late.p.hp;late.p.input.parry=true;late.step();assert.equal(late.p.hp,hp,'late parry cannot undo damage');
}
{
 const f=fixture();f.p.input.parry=true;f.step();f.step(.4);f.p.input.parry=false;f.step();f.p.input.parry=true;f.step();assert.equal(f.p.parry,0,'cooldown prevents repeated presses');f.step(1);assert.equal(f.p.parry,0,'holding through cooldown cannot auto-parry');f.p.input.parry=false;f.step();f.p.input.parry=true;f.step();assert(f.p.parry>0,'release and press allows another parry');
 reset(f.s,20000);assert.equal(f.p.parry,0);assert.equal(f.p.parryCd,0);
}
{
 const f=fixture();f.p.parryQueued=true;f.p.input.parry=false;f.hit(2);f.step();assert.equal(f.p.hp,100,'short tap survives until next simulation tick');assert.equal(f.p.parryQueued,false);
 const view=snapshot(f.s,2000).players[1];assert(!('parryQueued' in view));assert(!('parryHeld' in view));assert(!('hash' in view));
 const dead=fixture();dead.p.hp=0;dead.p.input.parry=true;dead.step();assert.equal(dead.p.parry,0,'dead player cannot parry');
}
console.log('PASS: all 3 attack types, no damage or freeze, timing, cooldown, hold protection, short tap, reset, dead player, redacted state');
