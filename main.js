const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
const motionButton = document.querySelector('#motion-toggle');
function syncMotion(){document.body.classList.toggle('paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?'播放動畫':'暫停動畫');motionButton.innerHTML=paused?'Play motion <span>▷</span>':'Pause motion <span>Ⅱ</span>';}
motionButton.addEventListener('click',()=>{paused=!paused;syncMotion();});
reduced.addEventListener('change',e=>{paused=e.matches;syncMotion();});syncMotion();
function clock(){document.querySelector('#clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date());}clock();setInterval(clock,1000);
const projectData=[
  {
    "title": "YOLOv8 · OCR Pipeline",
    "description": "先找到欄位，再讀取文字。把整張證件辨識拆成可控制、可驗證的處理流程。",
    "idea": "以 YOLOv8 定位欄位並裁切，依欄位選擇 OCR 與格式驗證策略，降低版面與背景的干擾。",
    "experience": "將影像品質、定位、文字辨識與驗證分層處理；遇到不確定結果時，進入重試、替代模型或人工確認。",
    "url": "https://hackmd.io/@jungkang/H13pVO4Jee"
  },
  {
    "title": "LINE Auto · AI Agent",
    "description": "把散落在 LINE 對話、圖片與影片中的商品資訊，整理進既有商品後台。",
    "idea": "先由地端 OCR、Local LLM 與 Multimodal 清洗資料，再建立 Task，保留前一步已整理的資訊。",
    "experience": "AI Agent 透過 MCP 領取工作，按需取得上下文。確認商品歸屬後，由 JEV 填入既有後台；仍不明確的情況交給人工。",
    "url": "https://hackmd.io/@jungkang/B15S3AXqMx"
  },
  {
    "title": "n8n · Workflow Systems",
    "description": "當流程越來越多，如何把重複工作拆成可以共同使用的能力？",
    "idea": "重新整理散落在多個 Workflow 裡的 OCR、AI 呼叫、Validation 與狀態處理。",
    "experience": "以可重用的工作邊界，連接前端任務來源、AI Agent、模型服務與既有系統，讓流程更容易擴充與維護。",
    "url": "https://hackmd.io/@jungkang/SkOdPDF5Ge"
  }
];
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.project),p=projectData[i];document.querySelector('#project-title').textContent=p.title;document.querySelector('#project-number').textContent=String(i+1).padStart(2,'0');document.querySelector('#project-description').textContent=p.description;document.querySelector('#project-idea').textContent=p.idea;document.querySelector('#project-experience').textContent=p.experience;document.querySelector('#project-source').href=p.url;document.querySelector('#project-dialog').showModal();}));
document.querySelectorAll('[data-contact]').forEach(b=>b.addEventListener('click',()=>document.querySelector('#contact-dialog').showModal()));
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('[data-close]').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
const pointer={x:0,y:0};document.querySelector('.hero').addEventListener('pointermove',e=>{const r=e.currentTarget.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;});document.querySelector('.hero').addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0;});
const canvases=[...document.querySelectorAll('canvas:not(#robot-art)')].map(el=>({el,ctx:el.getContext('2d'),w:0,h:0,visible:true}));
const resize=new ResizeObserver(entries=>{for(const entry of entries){const s=canvases.find(x=>x.el===entry.target),d=Math.min(devicePixelRatio||1,2);s.w=entry.contentRect.width;s.h=entry.contentRect.height;s.el.width=Math.round(s.w*d);s.el.height=Math.round(s.h*d);s.ctx.setTransform(d,0,0,d,0,0);draw(s,time);}});
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{const s=canvases.find(x=>x.el===e.target);s.visible=e.isIntersecting;});});
let time=0,last=0,smoothX=0,smoothY=0;
canvases.forEach(s=>{resize.observe(s.el);observer.observe(s.el);});
function draw(s,t){const {ctx:c,w,h,el}=s;if(!w||!h)return;c.clearRect(0,0,w,h);c.lineWidth=.65;
if(el.id==='hero-art'){
 const rows=36,cols=52,scale=Math.min(w*.44,h*.4),rotation=t*.14+smoothX*.85,tilt=.55+smoothY*.55;
 const project=(u,v)=>{let radius=1+.21*Math.sin(3*v+t*.45)+.16*Math.cos(4*u+t*.3);let x=radius*Math.cos(u)*Math.sin(v),y=1.38*radius*Math.cos(v),z=radius*Math.sin(u)*Math.sin(v);let xx=x*Math.cos(rotation)-z*Math.sin(rotation),zz=x*Math.sin(rotation)+z*Math.cos(rotation);let yy=y*Math.cos(tilt)-zz*Math.sin(tilt);return [w*.53+xx*scale,h*.48+yy*scale,zz];};
 c.strokeStyle='#333a2c';for(let i=0;i<rows;i++){c.beginPath();for(let j=0;j<=cols;j++){const p=project(j/cols*Math.PI*2,i/(rows-1)*Math.PI);j?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.globalAlpha=.34;c.stroke();}
 for(let j=0;j<cols;j++){c.beginPath();for(let i=0;i<rows;i++){const p=project(j/cols*Math.PI*2,i/(rows-1)*Math.PI);i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]);}c.globalAlpha=.28;c.stroke();}c.globalAlpha=1;
}else if(el.dataset.art==='garden'){
 c.strokeStyle='#a9edae';for(let k=0;k<38;k++){c.beginPath();for(let j=0;j<=150;j++){const a=j/150*Math.PI*2,r=Math.min(w,h)*(.27+k*.005)*(1+.16*Math.sin(5*a+t*.25+k*.035)),x=w*.57+Math.cos(a+t*.09+k*.03)*r,y=h*.52+Math.sin(a)*r*1.35;c.globalAlpha=.17+.16*Math.sin(k*.1)**2;j?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}c.globalAlpha=1;
}else if(el.dataset.art==='human'){
 c.strokeStyle='#592b21';c.globalAlpha=.3;for(let k=0;k<27;k++){c.beginPath();for(let j=0;j<=60;j++){let y=j/60*h,x=k/26*w+Math.sin(y/h*7+t*.3+k*.12)*w*.08;j?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}c.globalAlpha=1;
}else{
 c.strokeStyle='#c9ec9b';c.globalAlpha=.42;for(let k=0;k<50;k++){c.beginPath();for(let j=0;j<=65;j++){const x=j/65*w,y=h*.3+k*5+Math.sin(x/w*5+t*.32+k*.06)*h*.17+Math.cos(x/w*3+k*.08)*h*.14;j?c.lineTo(x,y):c.moveTo(x,y);}c.stroke();}c.globalAlpha=1;
}}
function frame(now){if(now-last>32){const delta=Math.min((now-last)/1000,.05);last=now;if(!paused&&!document.hidden){time+=delta;smoothX+=(pointer.x-smoothX)*.055;smoothY+=(pointer.y-smoothY)*.055;canvases.forEach(s=>{if(s.visible)draw(s,time);});}}requestAnimationFrame(frame);}requestAnimationFrame(frame);
