const portrait=document.querySelector('#human-art'),pen=portrait.getContext('2d');
let pw=0,ph=0,lastDraw=-1,points=[],edges=[];
const humanImage=new Image();humanImage.src='images/human-wire.png';
let seed=901;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
humanImage.onload=()=>{
 const sample=document.createElement('canvas');sample.width=540;sample.height=360;const sc=sample.getContext('2d',{willReadFrequently:true});sc.drawImage(humanImage,0,0,540,360);const pixels=sc.getImageData(0,0,540,360).data;
 const buckets=new Map();
 for(let y=4;y<356;y+=3)for(let x=4;x<536;x+=3){const alpha=pixels[(y*540+x)*4+3]/255;const hand=x<270; if(alpha>.14&&random()<alpha*(hand?.68:.40)){
 const p={x:x+(random()-.5)*3,y:y+(random()-.5)*3,phase:random()*Math.PI*2,spread:hand?.8:2.8,alpha};const id=points.push(p)-1,k=`${Math.floor(x/14)},${Math.floor(y/14)}`;if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(id);
 }}
 points.forEach((p,i)=>{const bx=Math.floor(p.x/14),by=Math.floor(p.y/14),near=[];for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)for(const j of buckets.get(`${bx+dx},${by+dy}`)||[]){if(j<=i)continue;const q=points[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<18)near.push([j,d]);}near.sort((a,b)=>a[1]-b[1]);near.slice(0,p.x<270?5:4).forEach(([j])=>edges.push([i,j]));});
 // Blend breathing through the torso, extended forearm and hand.
 points.forEach(p=>{
  p.chest=Math.exp(-(((p.x-365)/115)**2+((p.y-245)/100)**2));
  p.shoulder=Math.exp(-(((p.x-335)/145)**2+((p.y-200)/80)**2));
  p.head=Math.exp(-(((p.x-358)/65)**2+((p.y-115)/90)**2));
  p.arm=1/(1+Math.exp((p.x-275)/28));
  p.hand=1/(1+Math.exp((p.x-218)/18));
 });
 drawHuman();
};
function drawHuman(){if(!pw||!ph||!humanImage.complete||!humanImage.naturalWidth)return;
 const t=time,c=pen;c.clearRect(0,0,pw,ph);const mobile=pw<650,scale=mobile?pw/560:Math.min(pw/650,ph/365),left=(pw-540*scale)/2,top=mobile?18:10;
 // A 4.8-second breath: shorter inhale, longer exhale, eased at both ends.
 const cycle=(t%4.8)/4.8;
 const breath=cycle<.4?(1-Math.cos(Math.PI*cycle/.4))/2:(1+Math.cos(Math.PI*(cycle-.4)/.6))/2;
 const lift=breath-.35,dissolve=(Math.sin(t*.38)+1)/2;
 const rendered=points.map(p=>{
  const loose=p.x>290?Math.pow(dissolve,3)*5:0;
  const expand=(p.x-365)*.038*p.chest*lift;
  const rise=-(7*p.shoulder+3*p.head)*lift;
  const sway=Math.sin(t*.34)*1.2*(p.chest+p.head*.5);
  // A small wrist rotation and shared lift connect the reaching hand to the breath.
  const angle=lift*.026*p.hand,cos=Math.cos(angle),sin=Math.sin(angle);
  const wristX=p.x-212,wristY=p.y-194;
  const handX=(wristX*(cos-1)-wristY*sin)+lift*2.5*p.arm;
  const handY=(wristX*sin+wristY*(cos-1))-lift*6*p.arm;
  return [left+(p.x+expand+sway+handX+Math.sin(t*.6+p.phase)*p.spread*.55+Math.sin(p.phase*3)*loose+smoothX*8*(1-p.y/500))*scale,top+(p.y+rise+handY+Math.cos(t*.5+p.phase)*p.spread*.55+Math.cos(p.phase*2)*loose+smoothY*5)*scale];
 });
 c.strokeStyle='#22231f';c.lineWidth=mobile?.45:.55;
 c.globalAlpha=.29+breath*.035;c.beginPath();for(const [a,b] of edges){const p=rendered[a],q=rendered[b];c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);}c.stroke();
 // Longer loose strands dissolve around the head and shoulder, not the hand.
 c.globalAlpha=.28;c.lineWidth=.6;c.beginPath();for(let i=0;i<points.length;i+=17){const p=points[i];if(p.x<290)continue;const r=rendered[i],length=(7+18*dissolve)*scale,dx=Math.sin(p.phase+t*.12)*length,dy=Math.cos(p.phase*2+t*.1)*length;c.moveTo(r[0],r[1]);c.lineTo(r[0]+dx,r[1]+dy);c.lineTo(r[0]+dx+Math.sin(p.phase)*length*.5,r[1]+dy-length*.3);}c.stroke();c.globalAlpha=1;
}
new ResizeObserver(entries=>{const r=entries[0].contentRect,d=Math.min(devicePixelRatio||1,2);pw=r.width;ph=r.height;portrait.width=Math.round(pw*d);portrait.height=Math.round(ph*d);pen.setTransform(d,0,0,d,0,0);drawHuman();}).observe(portrait);
function humanFrame(){if(time!==lastDraw){lastDraw=time;drawHuman();}requestAnimationFrame(humanFrame);}requestAnimationFrame(humanFrame);
document.querySelector('#copy-email').addEventListener('click',async()=>{const status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText('jungkang0911@gmail.com');status.textContent='Email 已複製';}catch{status.textContent='請選取上方 Email 複製';}});
