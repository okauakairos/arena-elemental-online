import {posed,READY} from './vendor/pixelfx/src/core/index.js';
const W=480,H=270,G=224,cache=new Map();
const poly=(c,pts,color)=>{c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
const box=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function arch(c,x,y,w,h,color){c.fillStyle=color;c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+w*.65);c.quadraticCurveTo(x,y+w*.18,x+w/2,y);c.quadraticCurveTo(x+w,y+w*.18,x+w,y+w*.65);c.lineTo(x+w,y+h);c.closePath();c.fill();}
export function scenery(c,t,px){
 const sky=c.createLinearGradient(0,0,0,G);sky.addColorStop(0,'#0b1527');sky.addColorStop(.55,'#233747');sky.addColorStop(1,'#4a5e60');c.fillStyle=sky;c.fillRect(0,0,W,H);
 for(let i=0;i<85;i++){c.globalAlpha=.3+.3*Math.sin(t*.5+i);box(c,(i*127)%W,(i*61)%143,1,1,'#c0ced5');}c.globalAlpha=1;
 glow(c,329,67,85,'#bddec428');c.fillStyle='#c4d4c0';c.beginPath();c.arc(329,67,27,0,7);c.fill();c.fillStyle='#9bab9a40';for(let i=0;i<9;i++){c.beginPath();c.arc(312+i*4,58+Math.sin(i*9)*12,2+i%4,0,7);c.fill();}
 const par=(px-240)*.025;
 for(let l=0;l<3;l++){c.save();c.translate(-par*(l+1),0);poly(c,[[0,185],[0,136+l*15],[50,114+l*18],[94,146],[132,112+l*15],[181,142],[236,93+l*16],[284,133],[343,115+l*14],[389,145],[450,98+l*20],[510,145],[510,230]],['#263e49','#23353f','#1d2d36'][l]);c.restore();}
 // Distant abbey, broken rooflines and tall lancet windows.
 c.save();c.translate(-par,0);for(const [x,h,w] of [[65,100,40],[110,65,65],[177,129,38],[225,75,62],[289,87,42],[345,122,33]]){box(c,x,210-h,w,h,'#20313a');poly(c,[[x-5,210-h],[x+w/2,190-h],[x+w+5,210-h]],'#263943');for(let k=0;k<3;k++)arch(c,x+7+k*10,225-h,5,29,'#567078');box(c,x-3,208-h,w+6,3,'#425762');}c.restore();
 // Three open stone arches: sky remains visible through the opening.
 for(const x of [-23,143,309]){const top=91,h=133,w=116;c.save();c.translate(-par*2,0);arch(c,x,top,w,h,'#1b252e');arch(c,x+13,top+15,w-26,h,'#33454c');arch(c,x+17,top+20,w-34,h,'#263a44');c.globalCompositeOperation='source-over';
 // Opening is painted with a distant mist gradient, not a solid wall.
 const fog=c.createLinearGradient(0,top,0,G);fog.addColorStop(0,'#2e4650');fog.addColorStop(1,'#526365');c.fillStyle=fog;c.beginPath();c.moveTo(x+20,G);c.lineTo(x+20,top+60);c.quadraticCurveTo(x+20,top+38,x+w/2,top+23);c.quadraticCurveTo(x+w-20,top+38,x+w-20,top+60);c.lineTo(x+w-20,G);c.fill();
 for(let j=0;j<8;j++){box(c,x,top+42+j*13,17,1,'#101c25');box(c,x+w-17,top+42+j*13,17,1,'#101c25');box(c,x+1,top+43+j*13,2,10,'#526067');box(c,x+w-16,top+43+j*13,2,10,'#45565d');}
 for(let a=0;a<9;a++){const ang=Math.PI+a*Math.PI/8,cx=x+w/2,cy=top+58;poly(c,[[cx+Math.cos(ang)*58,cy+Math.sin(ang)*58],[cx+Math.cos(ang+.07)*58,cy+Math.sin(ang+.07)*58],[cx+Math.cos(ang+.07)*43,cy+Math.sin(ang+.07)*43],[cx+Math.cos(ang)*43,cy+Math.sin(ang)*43]],'#75808055');}box(c,x-5,G-10,27,10,'#35444b');box(c,x+w-22,G-10,27,10,'#35444b');c.restore();}
 // Weathered broken foreground piers and vines.
 for(const x of [10,126,296,458]){const ht=x===296?67:94;box(c,x-7,G-ht,14,ht,'#19242c');box(c,x-7,G-ht,3,ht,'#59666a');poly(c,[[x-9,G-ht],[x-6,G-ht-7],[x,G-ht-2],[x+5,G-ht-12],[x+9,G-ht],[x+10,G-ht+6],[x-10,G-ht+6]],'#647173');for(let j=0;j<ht;j+=13){box(c,x-6,G-j,12,1,'#0c1922');box(c,x-4,G-j-9,3,6,'#33444a');}for(let j=0;j<28;j++){const y=G-ht+j*2;box(c,x+Math.sin(j)*3,y,2,3,j%3?'#3a5650':'#69856a');}}
 for(let i=0;i<7;i++){c.globalAlpha=.055;const x=((i*100+t*4)%(W+150))-100;const g=c.createRadialGradient(x,202-i*4,0,x,202-i*4,90);g.addColorStop(0,'#c5e2cf');g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-90,160,180,60);}c.globalAlpha=1;
 box(c,0,G,W,H-G,'#18242c');box(c,0,G,W,3,'#83908b');box(c,0,G+3,W,4,'#3d514f');for(let y=G+8;y<H;y+=13)for(let x=-(y%2)*18;x<W;x+=37){box(c,x+1,y,35,11,'#283840');box(c,x+2,y+1,34,1,'#46565c');box(c,x+2,y+3,1,7,'#35454c');box(c,x+9+(x*x%13),y+6,8,1,'#1b2931');}
 for(let i=0;i<100;i++){const x=(i*73)%W;box(c,x,G-1-(i%4),1,2+i%4,i%3?'#536e59':'#82906a');}
 for(const x of [47,429]){glow(c,x,G-39,49,'#fcb35230');box(c,x-2,G-37,4,37,'#181d25');box(c,x-5,G-11,10,3,'#6c6555');poly(c,[[x-8,G-34],[x-5,G-27],[x+5,G-27],[x+8,G-34]],'#85735b');for(let j=0;j<5;j++){const q=t*9+j*2;poly(c,[[x-5+j*2,G-34],[x-4+j*2+Math.sin(q)*2,G-47-j%3*3],[x+j*2-2,G-34]],j%2?'#ffd889':'#cb663a');}for(let j=0;j<7;j++){const k=(t*11+j*6)%36;box(c,x+Math.sin(k*.3+j)*6,G-40-k,1,1,'#f9c179');}}
}
function rig(c,q,x,y,dir,tint,scale,flash){const r=posed(q),key=JSON.stringify(q)+tint+flash;let tile=cache.get(key);if(!tile){const cv=document.createElement('canvas');cv.width=100;cv.height=100;const z=cv.getContext('2d'),im=z.createImageData(100,100);for(let i=0;i<r.n;i++){const at=((r.ys[i]+75)*100+r.xs[i]+50)*4,col=r.color[i],lum=col&255;const rgb=tint==='gold'?[1,.78,.55]:tint==='red'?[.85,.39,.39]:tint==='teal'?[.4,.85,.83]:[.63,.78,1];im.data[at]=flash?230:Math.min(255,lum*rgb[0]);im.data[at+1]=flash?255:Math.min(255,((col>>>8)&255)*rgb[1]);im.data[at+2]=flash?255:Math.min(255,((col>>>16)&255)*rgb[2]);im.data[at+3]=255;}z.putImageData(im,0,0);tile=cv;if(cache.size>600)cache.clear();cache.set(key,tile);}c.save();c.translate(Math.round(x),Math.round(y));c.scale(dir*scale,scale);c.imageSmoothingEnabled=false;c.drawImage(tile,-50,-75);c.restore();}
export function character(c,entity,t,hero=false){const e=entity,dir=hero?e.dir:e.dir||1,type=hero?'hero':e.type||'knight',scale=type==='guard'?1.25:1,clock=Math.floor((e.freeze?0:t)*(hero?30:12))/(hero?30:12),cycle=Math.sin(clock*(type==='guard'?7:11)),moving=hero?e.moving:!e.freeze&&!e.attack;let y=hero?e.y:G;const cast=hero&&e.cast>0,attack=!hero&&e.attack>0;let q={...READY};
 if(moving){q={...q,lean:3,crouch:2+Math.abs(cycle),ffx:cycle*8,fbx:-cycle*8,ffy:-4-Math.max(0,-cycle)*5,fby:-4-Math.max(0,cycle)*5,fx:-cycle*8,fy:-20,bx:cycle*7,by:-20};}
 if(hero&&y<G){q={...READY,y:-10,ffx:8,ffy:-8,fbx:-9,fby:-10,fx:-8,fy:-27,bx:11,by:-29,lean:-2};}
 if(cast){const progress=Math.max(0,Math.min(1,1-e.cast/.42)),swing=Math.sin(Math.PI*progress),reach=Math.sin(Math.PI*Math.min(1,progress*1.4));
  if(e.classId==='knight')q={...READY,lean:e.element===2?-3*swing:7*swing,crouch:e.element===2?7*swing:2*swing,fx:7+15*reach,fy:e.element===2?-25-19*swing:-25-8*Math.sin(progress*Math.PI*2),bx:-10,by:-24,ffx:6+4*swing,fbx:-7-3*swing};
  else if(e.classId==='rogue')q={...READY,lean:9*swing,crouch:3*swing,fx:5+20*reach,fy:-25-5*swing,bx:-8-7*swing,by:-22,ffx:7+5*swing,fbx:-8-5*swing};
  else q={...READY,lean:-4+9*reach,fx:20*reach,fy:e.element===2?-27-16*swing:-26,bx:-8,by:-22,ffx:9,fbx:-9};
 }
 if(e.burst){const progress=Math.min(1,e.burst.elapsed/e.burst.duration),weight=Math.sin(Math.PI*progress),rogue=e.classId==='rogue';q={...q,lean:4+(rogue?12:8)*weight,crouch:2+(rogue?8:4)*weight,ffx:9+6*weight,fbx:-9-8*weight,ffy:-4,fby:-5,fx:rogue?-12:13,fy:rogue?-17:-26,bx:rogue?-18:-7,by:-23};}
 if(attack)q={...READY,lean:e.attack>.22?-6:9,fx:e.attack>.22?-8:20,fy:e.attack>.22?-40:-26,ffx:10,fbx:-8};
 if(e.flash>0)q={...q,lean:-9,crouch:5,fx:-8,fy:-30};
 if(type==='wraith')y=G-4+Math.sin(clock*4)*3;
 c.fillStyle='#080d16aa';c.beginPath();c.ellipse(e.x,G+2,type==='guard'?18:12,3,0,0,7);c.fill();c.save();c.translate(Math.round(e.x),Math.round(y));c.scale(dir,1);
 if((hero&&e.classId!=='knight')||type==='wraith'){const sway=Math.sin(clock*8)*3;poly(c,[[-3,-31],[-12,-28],[-17-sway,-6],[-8,-10],[-4,0],[2,-10],[4,-29]],hero?(e.classId==='rogue'?'#194b47':'#293f6d'):'#1b4f55');poly(c,[[-10,-25],[-13-sway,-8],[-7,-12],[-4,-4],[-2,-27]],hero?(e.classId==='rogue'?'#397e68':'#466391'):'#367c7b');}
 c.restore();rig(c,q,e.x,y,dir,type==='guard'?'gold':type==='wraith'?'teal':hero?(e.tint||'blue'):'red',scale,e.flash>0);
 c.save();c.translate(Math.round(e.x),Math.round(y));c.scale(dir*scale,scale);
 if(!hero){poly(c,[[-7,-34],[-11,-44],[-5,-40],[-2,-34]],type==='guard'?'#ccba85':'#a28a91');poly(c,[[4,-35],[8,-43],[9,-34]],'#635364');box(c,1,-33,5,2,e.freeze?'#b9ffff':type==='wraith'?'#83f7d6':'#ffba78');if(type==='guard'){poly(c,[[-13,-28],[-5,-29],[-3,-12],[-9,-6],[-16,-15]],'#7d705b');poly(c,[[-12,-25],[-7,-26],[-6,-14],[-10,-11],[-13,-17]],'#b8a57a');}if(type==='knight'){const ax=attack&&e.attack<.22?20:10;box(c,ax,-26,2,27,'#70594b');poly(c,[[ax-5,-26],[ax-5,-35],[ax+4,-39],[ax+6,-29]],'#a0a5aa');}if(type==='wraith'){glow(c,12,-25,12,'#5effc54f');box(c,10,-27,4,4,'#acffe0');}}
 else {
 if(e.classId==='knight'){
  poly(c,[[-9,-33],[-8,-42],[4,-45],[10,-37],[7,-32]],'#9daab3');box(c,0,-37,9,3,'#293440');box(c,3,-37,5,1,'#ffe4a0');poly(c,[[-14,-30],[-6,-32],[-3,-24],[-11,-21]],'#b5b9ac');
  poly(c,[[-15,-27],[-5,-28],[-3,-12],[-10,-5],[-18,-14]],'#7b6544');poly(c,[[-13,-25],[-7,-25],[-6,-14],[-10,-10],[-15,-16]],'#ddc386');box(c,-11,-24,2,11,'#f4dfab');
  c.save();const swing=cast?Math.sin(Math.PI*Math.max(0,1-e.cast/.42)):0;c.translate(13+7*swing,-24-3*swing);c.rotate(e.burst?.kind==='charge'?1.1:.2+1.6*swing);box(c,-1,-24,3,26,'#c8d8df');box(c,1,-24,1,26,'#fff3cd');box(c,-5,1,11,3,'#d8ad6c');box(c,0,4,2,7,'#674c42');c.restore();
 }else if(e.classId==='rogue'){
  poly(c,[[-9,-34],[-7,-43],[0,-46],[8,-40],[9,-32],[3,-35]],'#285e54');poly(c,[[-3,-39],[6,-38],[5,-33],[-3,-33]],'#102d31');box(c,3,-37,4,1,'#a7ffe0');
  const reach=e.burst?8:13+(cast?10*Math.sin(Math.PI*Math.max(0,1-e.cast/.42)):0);shapeBlade(c,reach,-24,cast&&!e.burst);shapeBlade(c,-10,-19,false);
 }else if(e.classId==='mage'){box(c,13,-39,2,39,'#766855');glow(c,14,-42,9,'#b0a0ff33');poly(c,[[10,-42],[14,-49],[18,-42],[14,-36]],'#adc8ff');}
 box(c,3,-34,4,1,'#cef6ff');poly(c,[[-6,-29],[-2,-26],[-5,-22],[-9,-26]],'#c0a475');if(cast&&(!e.classId||e.classId==='mage'))glow(c,e.element===2?0:19,e.element===2?-45:-26,13,['#ffa35166','#94ecff66','#c9b0ff66'][e.element||0]);}c.restore();
 if(e.freeze){c.strokeStyle='#99e5e799';c.lineWidth=1;c.strokeRect(Math.round(e.x-13),G-43,26,43);glow(c,e.x,G-16,25,'#65bddd25');}if(attack&&e.attack>.22){c.fillStyle='#ffc28c';c.font='bold 10px monospace';c.textAlign='center';c.fillText('!',e.x,G-55);}
}
export function foreground(c,t){for(const x of [0,477]){poly(c,[[x-9,270],[x+8,270],[x+5,218],[x-3,211]],'#0b151e');for(let i=0;i<8;i++)poly(c,[[x,246-i*4],[x+(i%2?16:-14),232-i*4],[x+2,252-i*4]],'#16272c');}const v=c.createRadialGradient(240,150,110,240,150,280);v.addColorStop(0,'transparent');v.addColorStop(1,'#070c1866');c.fillStyle=v;c.fillRect(0,0,W,H);}

function shapeBlade(c,x,y,forward){poly(c,[[x,y],[x+(forward?17:3),y-12],[x+5,y+1]],'#c8f4e2');box(c,x-2,y,7,2,'#6f9b7e');}
