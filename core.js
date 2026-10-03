const nodes=[...document.querySelectorAll('.agent-node')];
const phases=['OBSERVE / 接收訊號與上下文','REASON / 組織資訊與規劃路徑','EXECUTE / 連接工具與執行'];
const core=document.querySelector('#core-art'),ctx=core.getContext('2d');
let width=0,height=0,lastTime=-1,lastPhase=-1;
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const normalize=v=>{const n=Math.hypot(...v)||1;return v.map(x=>x/n);};
function center(u){const r=.93+.27*Math.cos(3*u);return [r*Math.cos(2*u),r*Math.sin(2*u),.43*Math.sin(3*u)];}
const frames=Array.from({length:221},(_,i)=>{const u=i/220*Math.PI*2,p=center(u),next=center(u+.001),tangent=normalize(next.map((v,j)=>v-p[j])),normal=normalize(cross(tangent,[0,0,1])),binormal=cross(tangent,normal);return {p,normal,binormal,u};});
function renderCore(){
 if(!width||!height)return;
 const c=ctx,w=width,h=height,t=time;c.clearRect(0,0,w,h);
 const yaw=t*.095+smoothX*.7,tilt=.72+smoothY*.35,scale=Math.min(w,h)*.31;
 function project(p){const [x,y,z]=p,a=x*Math.cos(yaw)+z*Math.sin(yaw),b=-x*Math.sin(yaw)+z*Math.cos(yaw),yy=y*Math.cos(tilt)-b*Math.sin(tilt),zz=y*Math.sin(tilt)+b*Math.cos(tilt),k=5/(5-zz);return [w*.5+a*scale*k,h*.49+yy*scale*k,zz];}
 function surface(f,v){const r=.19+.038*Math.sin(f.u*3+t*.32);return f.p.map((a,i)=>a+r*(Math.cos(v)*f.normal[i]+Math.sin(v)*f.binormal[i]));}
 function line(points,accent=false,weight=.65){const projected=points.map(project),depth=projected.reduce((s,p)=>s+p[2],0)/projected.length;c.beginPath();projected.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.strokeStyle=accent?'#73834e':'#292e29';c.globalAlpha=accent?.72:.27+(depth+1.5)*.085;c.lineWidth=weight;c.stroke();}
 for(let j=0;j<30;j++){const v=j/30*Math.PI*2+t*.065;line(frames.map(f=>surface(f,v)),j===4||j===19,j===4?.95:.6);}
 for(let i=0;i<220;i+=4){line(Array.from({length:37},(_,j)=>surface(frames[i],j/36*Math.PI*2)),false,.45);}
 for(let i=0;i<7;i++){const p=project(center((t*.14+i*Math.PI*2/7)%(Math.PI*2)));c.globalAlpha=.85;c.fillStyle=i%3===0?'#839653':'#424a3d';c.beginPath();c.arc(p[0],p[1],i%3===0?2.5:1.3,0,Math.PI*2);c.fill();}
 c.globalAlpha=.3;c.strokeStyle='#77816b';c.lineWidth=.6;const scan=h*(.21+((t*.035)%1)*.59);c.beginPath();c.moveTo(w*.14,scan);c.lineTo(w*.86,scan);c.stroke();
 c.globalAlpha=1;
}
new ResizeObserver(entries=>{const r=entries[0].contentRect,d=Math.min(devicePixelRatio||1,2);width=r.width;height=r.height;core.width=Math.round(width*d);core.height=Math.round(height*d);ctx.setTransform(d,0,0,d,0,0);renderCore();}).observe(core);
function animateCore(){if(time!==lastTime){lastTime=time;renderCore();const phase=Math.floor(time/3.5)%3;if(phase!==lastPhase){lastPhase=phase;nodes.forEach((n,i)=>n.classList.toggle('is-active',i===phase));document.querySelector('#agent-state').textContent=phases[phase];}}requestAnimationFrame(animateCore);}requestAnimationFrame(animateCore);
const orbits=document.querySelector('.agent-orbits');
function syncOrbits(){if(paused)orbits.pauseAnimations();else orbits.unpauseAnimations();}
motionButton.addEventListener('click',syncOrbits);reduced.addEventListener('change',syncOrbits);syncOrbits();
document.querySelector('#copy-email').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('jungkang0911@gmail.com');status.textContent='Email 已複製';}catch{status.textContent='請選取上方 Email 複製';}});
