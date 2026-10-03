const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduced.matches;
const motionButton = document.querySelector('#motion-toggle');
function syncMotion(){document.body.classList.toggle('paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.setAttribute('aria-label',paused?'播放動畫':'暫停動畫');motionButton.innerHTML=paused?'Play motion <span>▷</span>':'Pause motion <span>Ⅱ</span>';}
motionButton.addEventListener('click',()=>{paused=!paused;syncMotion();});
reduced.addEventListener('change',e=>{paused=e.matches;syncMotion();});syncMotion();
function clock(){document.querySelector('#clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date());}clock();setInterval(clock,1000);
const projectData=[
  {
    "title": "OCR · 證件與文件辨識",
    "description": "從使用者拍攝的第一步開始，把證件與文件變成後續作業能用的資料。",
    "advantages": [
      [
        "拍攝有引導",
        "透過引導框協助對準證件位置，讓使用者知道怎麼拍，從輸入端改善資料品質。"
      ],
      [
        "資料與成本可掌控",
        "主要辨識採地端 OCR 與規則核對，減少逐筆模型呼叫，部署方式可配合內部環境。"
      ],
      [
        "依實際文件優化",
        "針對欄位格式、常見錯字與失敗案例持續修正，累積對特定作業的處理能力。"
      ],
      [
        "方便接續原有作業",
        "辨識結果整理成欄位資料，便於接到表單、後台或後續自動化；異常內容留給人工確認。"
      ]
    ],
    "proof": "持續改善方式：整理辨識失敗的原因，針對欄位規則、常見錯字與影像品質調整，再以一致的評估方式確認成效。",
    "idea": "把拍攝引導、影像整理、欄位辨識與規則核對串成完整流程。定位失敗原因後，針對影像、欄位或文字調整，再用一致的驗證方式確認改善，讓操作與辨識一起進步。",
    "experience": "特定證件或固定格式文件需要反覆登錄，同時重視內部部署與既有系統整合的作業，例如櫃台資料收件、內部文件建檔。導入時可先選一種文件與一段流程驗證成效。",
    "url": "https://hackmd.io/@jungkang/H13pVO4Jee"
  },
  {
    "title": "LINE · 商品上架協作",
    "description": "把聊天裡的商品線索，接成既有後台能接手的資料。",
    "advantages": [
      [
        "不用更換後台",
        "接回原本的商品管理與上架流程，保留既有操作習慣。"
      ],
      [
        "避免反覆讀取",
        "前面已整理的內容持續沿用，只在資訊不足時補查對話。"
      ],
      [
        "人力聚焦確認",
        "把找素材、比對與填寫串起來，疑義商品仍保留人工判斷。"
      ]
    ],
    "proof": "已串接的作業：LINE 訊息、圖片與影片整理 → 商品歸屬判斷 → 既有後台填寫與上架流程。完整處理方式見實作紀錄。",
    "idea": "分階段整理商品名稱、規格與價格，保留已確認的資訊。需要時再查前後對話、候選商品與既有資料，確認歸屬後填入後台。",
    "experience": "商品素材經常從 LINE 傳入，名稱、規格與價格分散在多則訊息，需要人員反覆查找與搬移資料的上架作業。",
    "url": "https://hackmd.io/@jungkang/B15S3AXqMx"
  },
  {
    "title": "流程自動化與 RPA",
    "description": "讓跨系統作業接得起來，也讓失敗的步驟找得到。",
    "advantages": [
      [
        "依系統選擇做法",
        "可串接的部分直接傳遞資料，必要的畫面操作搭配 RPA。"
      ],
      [
        "異常有處理路徑",
        "納入重試、告警與人工接手，讓中斷的工作有跡可循。"
      ],
      [
        "共通步驟能沿用",
        "整理、辨識、驗證拆成共用流程，新增任務時減少重搭。"
      ]
    ],
    "proof": "設計取捨：以流程編排與系統串接承接大部分作業，RPA 保留在需要操作畫面的環節，降低對逐步點擊的依賴。",
    "idea": "先梳理資料如何在不同系統間流動，再區分可直接串接與需要畫面操作的步驟。將共用能力與狀態處理集中管理，避免相同邏輯散落在不同流程。",
    "experience": "跨後台複製資料、反覆核對與更新，或已有自動化卻難以追蹤失敗原因、維護成本逐漸增加的作業。",
    "url": "https://hackmd.io/@jungkang/SkOdPDF5Ge"
  }
];
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.project),p=projectData[i];document.querySelector('#project-title').textContent=p.title;document.querySelector('#project-number').textContent=String(i+1).padStart(2,'0');document.querySelector('#project-description').textContent=p.description;document.querySelector('#project-idea').textContent=p.idea;document.querySelector('#project-experience').textContent=p.experience;const advantageList=document.querySelector('#project-advantages');advantageList.replaceChildren(...p.advantages.map(([title,body])=>{const item=document.createElement('div'),heading=document.createElement('h3'),text=document.createElement('p');heading.textContent=title;text.textContent=body;item.append(heading,text);return item;}));document.querySelector('#project-proof').textContent=p.proof;document.querySelector('#project-source').href=p.url;document.querySelector('#project-dialog').showModal();}));
document.querySelectorAll('[data-contact]').forEach(b=>b.addEventListener('click',()=>document.querySelector('#contact-dialog').showModal()));
document.querySelectorAll('dialog').forEach(d=>{d.querySelector('[data-close]').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
const pointer={x:0,y:0};document.querySelector('.hero').addEventListener('pointermove',e=>{const r=e.currentTarget.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width-.5;pointer.y=(e.clientY-r.top)/r.height-.5;});document.querySelector('.hero').addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0;});
const canvases=[...document.querySelectorAll('canvas:not(#human-art)')].map(el=>({el,ctx:el.getContext('2d'),w:0,h:0,visible:true}));
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
