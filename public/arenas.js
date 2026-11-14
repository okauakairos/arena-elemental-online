import {scenery} from './art.js';
const W=480,G=224;
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
const shape=(c,points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
function glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function sky(c,a,b){const g=c.createLinearGradient(0,0,0,G);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;c.fillRect(0,0,W,270);}
function floor(c,base,edge,stone){rect(c,0,G,W,46,base);rect(c,0,G,W,3,edge);for(let y=231;y<270;y+=13)for(let x=-((y-231)/13%2)*22;x<W;x+=44){rect(c,x+1,y,42,11,stone);rect(c,x+2,y+1,39,1,edge+'55');}}
function volcano(c,t,px){
 sky(c,'#160f21','#823f35');const par=(px-240)*.035;
 glow(c,245,142,125,'#ff793b45');
 for(let l=0;l<3;l++){const base=175+l*17,shift=par*(l+1);shape(c,[[-20-shift,base],[31-shift,78+l*25],[83-shift,122],[148-shift,100],[208-shift,73+l*14],[244-shift,46+l*18],[279-shift,79],[340-shift,118],[411-shift,85+l*20],[510-shift,base],[510,224],[-20,224]],['#4b3037','#392833','#2a222d'][l]);}
 shape(c,[[226-par,87],[242-par,78],[252-par,94],[245-par,111],[260-par,132],[252-par,153],[272-par,185],[251-par,185],[236-par,154],[243-par,133],[229-par,108]],'#d45d3e');
 shape(c,[[239-par,87],[245-par,91],[240-par,111],[252-par,133],[246-par,151],[263-par,182],[255-par,180],[241-par,151],[246-par,132],[235-par,110]],'#ffba65');
 for(let i=0;i<14;i++){const x=i*37+Math.sin(t*.4+i)*6,y=194+i%4*6;rect(c,x,y,19+8*Math.sin(t+i),2,'#df7444');}
 for(const x of [24,139,341,456]){const h=x===139||x===341?92:145;rect(c,x-10,G-h,20,h,'#181822');rect(c,x-10,G-h,4,h,'#514047');shape(c,[[x-15,G-h],[x-8,G-h-17],[x,G-h-8],[x+8,G-h-17],[x+15,G-h]],'#725050');for(let j=10;j<h;j+=17)rect(c,x-8,G-j,17,2,'#0d131d');glow(c,x,G-h+16,28,'#ff8f3940');rect(c,x-3,G-h+9,6,18,'#ee9554');rect(c,x-1,G-h+10,2,15,'#ffe3a1');}
 for(const x of [67,410])for(let j=0;j<13;j++){c.strokeStyle='#80615c';c.strokeRect(x+(j%2),j*8-4,4,7);}
 floor(c,'#1e1c26','#b58469','#38303a');
 for(let i=0;i<15;i++){const x=i*37%480;shape(c,[[x,247],[x+9,245],[x+5,255],[x+15,261],[x+12,262],[x+2,254]],'#bb573b');}
 for(let i=0;i<34;i++){const y=G-(t*18+i*17)%220,x=(i*97+Math.sin(t+i)*13)%W;rect(c,x,y,i%4?1:2,2,i%3?'#e58d51':'#ffd6a0');}
}
function forest(c,t,px){
 sky(c,'#101e2c','#38786e');const par=(px-240)*.04;glow(c,286,70,110,'#b5e6a62e');
 for(let l=0;l<3;l++)for(let i=0;i<8;i++){const x=i*76-29-l*13-par*(l+1),w=12+l*7;shape(c,[[x-w,G],[x-w*.3,65-l*15],[x-12,0],[x+12,0],[x+w*.35,80],[x+w,G]],['#254c51','#1d4148','#173740'][l]);shape(c,[[x,90],[x-38,48],[x-60,36],[x-31,39],[x+6,68],[x+38,34],[x+56,30],[x+22,63]],['#254c51','#1d4148','#173740'][l]);}
 for(let i=0;i<20;i++){const x=(i*71)%520-20,y=(i*17)%55;shape(c,[[x-40,y],[x-10,y-22],[x+25,y-15],[x+44,y+9],[x+12,y+27],[x-25,y+18]],i%2?'#18463d':'#205449');}
 for(let i=0;i<6;i++){const x=i*101+20;rect(c,x,192,52,2,'#5da69b66');rect(c,x+18,198,34,1,'#b1d2ac55');}
 for(const x of [47,194,427]){const y=G-5;shape(c,[[x-18,y],[x-13,y-47],[x-4,y-60],[x+12,y-54],[x+19,y]],'#304c4c');shape(c,[[x-13,y-47],[x-4,y-60],[x+1,y-5],[x-16,y]],'#61847a');glow(c,x,y-29,27,'#8affe630');c.strokeStyle='#a9ffe1';c.beginPath();c.moveTo(x-4,y-40);c.lineTo(x+4,y-34);c.lineTo(x-4,y-27);c.lineTo(x+4,y-21);c.stroke();}
 floor(c,'#162a2c','#82aa83','#2c4440');
 for(let i=0;i<95;i++){const x=i*73%W;rect(c,x,G-(i%5),1,4+i%4,i%3?'#527b55':'#9cb575');}
 for(const x of [12,113,366,465]){rect(c,x,G-8,2,8,'#b2c3b0');shape(c,[[x-5,G-8],[x-3,G-13],[x+4,G-13],[x+7,G-8]],'#9ce2bc');glow(c,x,G-10,12,'#72ffca20');}
 for(let i=0;i<27;i++){const x=(i*83+t*4)%W,y=75+(i*43)%136+Math.sin(t*1.5+i)*7;c.globalAlpha=.35+.5*(1+Math.sin(t*2+i))/2;rect(c,x,y,2,2,'#d8ffa9');}c.globalAlpha=1;
}
function glacier(c,t,px){
 sky(c,'#0d1833','#526d91');const par=(px-240)*.035;
 for(let i=0;i<50;i++)rect(c,i*97%W,i*37%115,1,1,'#c6d9f4');
 for(let band=0;band<3;band++){c.strokeStyle=['#70e2c525','#87adf326','#b6a2ed22'][band];c.lineWidth=13;for(let j=0;j<3;j++){c.beginPath();c.moveTo(-20,40+band*16+j*4);c.bezierCurveTo(120,10+Math.sin(t*.3+band)*20,240,120-band*14,500,30+band*17);c.stroke();}}
 for(let l=0;l<2;l++)shape(c,[[-20,220],[-20,169],[40-par,81+l*40],[79,134],[144-par,70+l*25],[199,146],[285-par,65+l*30],[344,130],[423-par,80],[500,166],[500,224]],l?'#314d70':'#6a83a1');
 for(const [x,h] of [[46,95],[132,135],[306,126],[405,104]]){const xx=x-par;rect(c,xx,224-h,31,h,'#29445f');shape(c,[[xx-5,224-h],[xx+15,192-h],[xx+36,224-h]],'#a0c5d6');rect(c,xx+3,226-h,3,h-2,'#7394ab');for(let j=0;j<3;j++){rect(c,xx+12,235-h+j*32,7,20,'#9ad4ea');rect(c,xx+14,236-h+j*32,2,19,'#e3ffff');}rect(c,xx-5,223-h,41,4,'#c5e1e8');}
 for(const x of [8,218,467]){shape(c,[[x-15,G],[x-9,G-71],[x,G-100],[x+12,G-67],[x+20,G]],'#a2cdd7');shape(c,[[x,G-100],[x+4,G-12],[x-15,G],[x-9,G-71]],'#689cb9');shape(c,[[x+2,G-88],[x+12,G-67],[x+17,G-9],[x+5,G-17]],'#d1f3ef');glow(c,x,G-35,25,'#89dcff30');}
 floor(c,'#24364e','#e4eef0','#3d5772');
 for(let i=0;i<15;i++){const x=i*37;shape(c,[[x,227],[x+8,227],[x+4,239+i%3*4]],'#b2d7e4');}
 for(let i=0;i<55;i++){const x=(i*73+t*(7+i%3))%W,y=(i*41+t*(12+i%7))%270;rect(c,x,y,i%4?1:2,i%4?1:2,'#e1f2f5aa');}
}
export function drawArena(c,t,px=240,id='abbey'){if(id==='volcano')volcano(c,t,px);else if(id==='forest')forest(c,t,px);else if(id==='glacier')glacier(c,t,px);else scenery(c,t,px);}

export function drawCombatFx(c,effects,dt){for(const e of effects){e.life-=dt;if(e.life<=0)continue;const progress=1-e.life/.4;c.save();c.globalAlpha=Math.min(1,e.life*4);c.lineWidth=2;
 if(e.kind==='dash'||e.kind==='charge'){const color=e.kind==='dash'?'#87ebcd':'#ffd999';for(let j=0;j<6;j++){const x=e.x+(e.to-e.x)*(j/6);c.globalAlpha=(1-j/7)*e.life*1.5;rect(c,x,e.y-32,3,26,color);}c.globalAlpha=e.life*2;rect(c,e.to-9,e.y-3,18,3,color);}
 else if(e.kind==='quake'){c.strokeStyle='#efcf8f';c.beginPath();c.ellipse(e.x,e.y-1,Math.max(1,e.range*progress),9+progress*8,0,Math.PI,Math.PI*2);c.stroke();for(let j=-3;j<=3;j++){const x=e.x+j*20*progress;shape(c,[[x-4,e.y],[x,e.y-13*(1-progress)],[x+4,e.y]],'#d4b581');}}
 else{c.translate(e.x,e.y-22);c.scale(e.dir,1);c.strokeStyle=e.kind==='backstab'?'#a8ffe0':'#ffe1a5';c.beginPath();c.arc(8,0,e.range*(.45+progress*.35),-1.1+progress*.7,1.1+progress*.7);c.stroke();c.lineWidth=1;c.strokeStyle='#ffffff';c.beginPath();c.moveTo(15,-15);c.lineTo(e.range,12);c.stroke();}c.restore();}}
