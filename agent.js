const stage=document.querySelector('.agent-stage');
const agentNodes=[...document.querySelectorAll('.agent-node')];
const states=['OBSERVING · 理解任務與上下文','PLANNING · 拆解步驟與選擇工具','ACTING · 串接工具，協作完成'];
let lastPhase=-1;
function animateAgent(){
 if(!paused&&!document.hidden){
  stage.style.setProperty('--look-x',`${smoothX*18}deg`);
  stage.style.setProperty('--look-y',`${smoothY*-10}deg`);
  const phase=Math.floor(time/3.5)%3;
  if(phase!==lastPhase){lastPhase=phase;agentNodes.forEach((n,i)=>n.classList.toggle('is-active',i===phase));document.querySelector('#agent-state').textContent=states[phase];}
 }
 requestAnimationFrame(animateAgent);
}
requestAnimationFrame(animateAgent);
// A code-drawn mesh keeps the robot in the same fine-line language as the portfolio.
const robotCanvas=document.querySelector('#robot-art'),robotContext=robotCanvas.getContext('2d');
let robotWidth=0,robotHeight=0,robotDrawTime=-1;
const signPow=(x,p)=>Math.sign(x)*Math.pow(Math.abs(x),p);
function renderRobot(){
 if(!robotWidth||!robotHeight)return;
 const c=robotContext,w=robotWidth,h=robotHeight,t=time;
 c.clearRect(0,0,w,h);
 const yaw=.22+smoothX*.62+Math.sin(t*.3)*.06,pitch=-.055+smoothY*.17,scale=Math.min(w/3.35,h/4.35);
 const project=([x,y,z])=>{const a=x*Math.cos(yaw)+z*Math.sin(yaw),b=-x*Math.sin(yaw)+z*Math.cos(yaw),d=y*Math.cos(pitch)-b*Math.sin(pitch),depth=y*Math.sin(pitch)+b*Math.cos(pitch);const perspective=7/(7-depth);return [w*.5+a*scale*perspective,h*.49+d*scale*perspective,depth];};
 function line(points,color='#353b31',alpha=.48,width=.75){c.beginPath();points.forEach((v,i)=>{const p=project(v);i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);});c.strokeStyle=color;c.globalAlpha=alpha;c.lineWidth=width;c.stroke();}
 function mesh(center,size,power=1,rotation=0,density=14){
  const point=(u,v)=>{let x=size[0]*signPow(Math.cos(u),power)*signPow(Math.sin(v),power),y=size[1]*signPow(Math.cos(v),power),z=size[2]*signPow(Math.sin(u),power)*signPow(Math.sin(v),power);return [center[0]+x*Math.cos(rotation)-y*Math.sin(rotation),center[1]+x*Math.sin(rotation)+y*Math.cos(rotation),center[2]+z];};
  for(let i=1;i<density;i++){const v=i/density*Math.PI;let pts=[];for(let j=0;j<=48;j++)pts.push(point(j/48*Math.PI*2,v));line(pts,'#32372f',.43);}
  for(let j=0;j<density*2;j++){let pts=[];for(let i=0;i<=30;i++)pts.push(point(j/(density*2)*Math.PI*2,i/30*Math.PI));line(pts,'#32372f',.35);}
 }
 // Body, articulated limbs, neck, and an oversized rounded mesh head.
 mesh([-.36,1.24,0],[.23,.48,.23],.58,-.06,9);
 mesh([.36,1.24,0],[.23,.48,.23],.58,.09,9);
 mesh([-.38,1.64,.16],[.26,.16,.38],.55,0,7);
 mesh([.39,1.64,.16],[.26,.16,.38],.55,0,7);
 mesh([0,.4,0],[.61,.61,.36],.48,0,15);
 mesh([0,-.3,0],[.18,.19,.18],1,0,7);
 mesh([-.77,.27,0],[.19,.4,.19],.8,-.23,8);
 mesh([-.89,.79,.06],[.15,.27,.18],.65,-.1,8);
 mesh([.77,.15,0],[.19,.36,.19],.8,.42,8);
 const wave=Math.sin(t*1.1)*.1;
 mesh([1.00,-.21,.08],[.16,.33,.18],.6,.32+wave,8);
 mesh([1.08,-.58,.09],[.19,.18,.14],.65,.2+wave,7);
 mesh([0,-.96,.03],[.78,.55,.43],.38,-.045,19);
 // Face inset and luminous line eyes, on the front of the head.
 const face=[];for(let i=0;i<=80;i++){let a=i/80*Math.PI*2;face.push([.63*signPow(Math.cos(a),.43),-.96+.36*signPow(Math.sin(a),.43),.477]);}line(face,'#242c1d',.85,1.2);
 for(const x of [-.27,.27]){const eye=[];for(let i=0;i<=40;i++){let a=i/40*Math.PI*2;eye.push([x+.063*Math.cos(a),-.98+.135*Math.sin(a),.493]);}line(eye,'#607b33',1,2);line([[x,-1.06,.496],[x,-.9,.496]],'#718a43',.8,1);}
 line([[-.15,-.76,.49],[0,-.73,.49],[.15,-.76,.49]],'#394431',.7,1);
 line([[.25,-1.49,0],[.32,-1.77,0]],'#333a2d',.8,1);mesh([.32,-1.82,0],[.065,.065,.065],1,0,5);
 // Chest signal: a restrained pulse, rather than a filled illustration.
 const chest=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI*2;chest.push([.125*Math.cos(a),.28+.125*Math.sin(a),.38]);}line(chest,'#658339',.75,1.2);
 c.globalAlpha=1;
}
new ResizeObserver(entries=>{const r=entries[0].contentRect,d=Math.min(devicePixelRatio||1,2);robotWidth=r.width;robotHeight=r.height;robotCanvas.width=Math.round(r.width*d);robotCanvas.height=Math.round(r.height*d);robotContext.setTransform(d,0,0,d,0,0);renderRobot();}).observe(robotCanvas);
function robotFrame(){if(time!==robotDrawTime){robotDrawTime=time;renderRobot();}requestAnimationFrame(robotFrame);}requestAnimationFrame(robotFrame);
const orbits=document.querySelector('.agent-orbits');
function syncOrbits(){if(paused)orbits.pauseAnimations();else orbits.unpauseAnimations();}
motionButton.addEventListener('click',syncOrbits);reduced.addEventListener('change',syncOrbits);syncOrbits();
document.querySelector('#copy-email').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('jungkang0911@gmail.com');status.textContent='Email 已複製';}catch{status.textContent='請選取上方 Email 複製';}});
