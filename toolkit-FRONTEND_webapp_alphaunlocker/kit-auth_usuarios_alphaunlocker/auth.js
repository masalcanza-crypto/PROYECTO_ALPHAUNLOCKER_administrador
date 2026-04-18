const UNLOCK_STEP_DELAY_MS = 700;
const UNLOCK_FAILURE_RATE = 0.15;
const INITIAL_CREDITS = 150;
const MAX_LOG_ENTRIES = 6;
const TOAST_DURATION_MS = 3000;

const UNLOCK_MESSAGES = [
  'Conectando con servidor remoto...',
  'Verificando IMEI en base de datos...',
  'Autenticando con operador...',
  'Generando código de desbloqueo...',
  'Procesando solicitud...'
];

// CANVAS
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);
const PARTS = [];
for (let i = 0; i < 100; i++) { PARTS.push({ x: Math.random()*1920, y: Math.random()*1080, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, r: Math.random()*1.6+0.4, a: Math.random()*0.7+0.2, life: Math.random()*300+150, age: 0 }); }
function resetP(p) { p.x=Math.random()*W; p.y=Math.random()*H; p.vx=(Math.random()-0.5)*0.4; p.vy=(Math.random()-0.5)*0.4; p.r=Math.random()*1.6+0.4; p.a=Math.random()*0.7+0.2; p.life=Math.random()*300+150; p.age=0; }
const SSTARS = [];
for (let i=0;i<8;i++) SSTARS.push({x:0,y:0,vx:0,vy:0,len:0,a:0,life:0,age:0,w:0,gold:false});
function resetStar(s) { s.x=Math.random()*W; s.y=Math.random()*H*0.6; s.vx=(Math.random()*5+3)*(Math.random()<0.5?1:-1); s.vy=(Math.random()*1.2)-0.6; s.len=Math.random()*100+50; s.a=Math.random()*0.5+0.3; s.life=Math.random()*50+30; s.age=0; s.w=Math.random()*1.5+0.5; s.gold=Math.random()<0.35; }
SSTARS.forEach(resetStar);
const KSTREAMS = [];
const KATA='アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
for (let i=0;i<10;i++) { KSTREAMS.push({ x:Math.random()*1920, chars:Array.from({length:14},(_,j)=>({y:j*30,v:Math.random()*1.5+0.8,c:KATA[Math.floor(Math.random()*KATA.length)],a:Math.random()*0.15+0.03})) }); }
function drawHex(x,y,r,a) { ctx.beginPath(); for(let i=0;i<6;i++){const ang=i*Math.PI/3-Math.PI/6; if(i===0)ctx.moveTo(x+r*Math.cos(ang),y+r*Math.sin(ang)); else ctx.lineTo(x+r*Math.cos(ang),y+r*Math.sin(ang));} ctx.closePath(); ctx.strokeStyle=`rgba(0,245,255,${a})`; ctx.lineWidth=0.4; ctx.stroke(); }
let isTabVisible=true, animationId=null;
document.addEventListener('visibilitychange',()=>{ isTabVisible=!document.hidden; if(isTabVisible&&!animationId) animationId=requestAnimationFrame(draw); });
let frame=0,pulse=0;
function draw() {
  if(!isTabVisible){animationId=null;return;}
  ctx.clearRect(0,0,W,H); frame++; pulse+=0.013;
  const hs=52, maxDim=Math.max(W,H);
  const bg=ctx.createRadialGradient(W*.5,H*.38,0.1,W*.5,H*.38,maxDim*.85);
  bg.addColorStop(0,'rgba(3,12,32,1)'); bg.addColorStop(0.6,'rgba(2,6,16,1)'); bg.addColorStop(1,'rgba(1,2,8,1)');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  for(let row=-1;row<Math.ceil(H/(hs*1.732))+2;row++){for(let col=-1;col<Math.ceil(W/(hs*1.5))+2;col++){const hx=col*hs*1.5,hy=row*hs*1.732+(col%2)*hs*0.866,d=Math.hypot(hx-W*.5,hy-H*.38)/(maxDim*.65),a=Math.max(0,0.05-0.04*d+0.01*Math.sin(pulse+col*.35+row*.25));if(a>0.002)drawHex(hx,hy,hs*.48,a);}}
  ctx.lineWidth=0.4;
  for(let x=0;x<W;x+=90){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,245,255,0.012)';ctx.stroke();}
  for(let y=0;y<H;y+=90){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle='rgba(0,245,255,0.012)';ctx.stroke();}
  if(frame%2===0){ctx.font='11px monospace';KSTREAMS.forEach(s=>{s.chars.forEach(c=>{c.y+=c.v;if(c.y>H+20)c.y=-20;if(Math.random()<0.015)c.c=KATA[Math.floor(Math.random()*KATA.length)];ctx.fillStyle=`rgba(0,245,255,${c.a})`;ctx.fillText(c.c,s.x,c.y);});});}
  for(let i=0;i<4;i++){const r=((pulse*70+(i*170))%(maxDim*.9)),a=Math.max(0,0.07*(1-r/(maxDim*.9)));ctx.beginPath();ctx.arc(W*.5,H*.35,r,0,Math.PI*2);ctx.strokeStyle=i%2===0?`rgba(0,245,255,${a})`:`rgba(255,215,0,${a*.4})`;ctx.lineWidth=0.8;ctx.stroke();}
  PARTS.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.age++;if(p.age>p.life||p.x<-5||p.x>W+5||p.y<-5||p.y>H+5)resetP(p);});
  for(let i=0;i<PARTS.length;i++){for(let j=i+1;j<PARTS.length;j++){const dx=PARTS[i].x-PARTS[j].x,dy=PARTS[i].y-PARTS[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<110){ctx.beginPath();ctx.moveTo(PARTS[i].x,PARTS[i].y);ctx.lineTo(PARTS[j].x,PARTS[j].y);ctx.strokeStyle=`rgba(0,245,255,${(1-d/110)*.09})`;ctx.lineWidth=0.5;ctx.stroke();}}}
  PARTS.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(0,245,255,${p.a*Math.min(1,(p.life-p.age)/20)})`;ctx.fill();});
  SSTARS.forEach(s=>{s.x+=s.vx;s.y+=s.vy;s.age++;if(s.age>s.life||s.x<-300||s.x>W+300)resetStar(s);const tx=s.x-s.vx*(s.len/Math.abs(s.vx)),ty=s.y-s.vy*(s.len/Math.abs(s.vx)),gr=ctx.createLinearGradient(tx,ty,s.x,s.y),c=s.gold?'255,215,0':'0,245,255';gr.addColorStop(0,`rgba(${c},0)`);gr.addColorStop(1,`rgba(${c},${s.a*(1-s.age/s.life)})`);ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(s.x,s.y);ctx.strokeStyle=gr;ctx.lineWidth=s.w;ctx.stroke();});
  const sl=(Date.now()/16)%(H+80)-40,slg=ctx.createLinearGradient(0,sl-25,0,sl+25);slg.addColorStop(0,'rgba(0,245,255,0)');slg.addColorStop(0.5,'rgba(0,245,255,0.035)');slg.addColorStop(1,'rgba(0,245,255,0)');ctx.fillStyle=slg;ctx.fillRect(0,sl-25,W,50);
  animationId=requestAnimationFrame(draw);
}
animationId=requestAnimationFrame(draw);

// RELOJ
function tick() {
  const now=new Date();
  const t=[now.getHours(),now.getMinutes(),now.getSeconds()].map(v=>String(v).padStart(2,'0')).join(':');
  document.getElementById('clock').textContent=t;
  const lt=document.getElementById('live-time');
  if(lt) lt.textContent=t;
}
tick();
setInterval(tick,1000);

// TOAST
function showToast(message) {
  const toast=document.getElementById('toast');
  toast.textContent=message;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),TOAST_DURATION_MS);
}

// LOGIN — conecta con el backend Node.js
async function doLogin() {
  const username=document.getElementById('user').value.trim();
  const password=document.getElementById('pass').value;
  const errorMsg=document.getElementById('err-msg');
  try {
    const res=await fetch('http://localhost:3000/api/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({user:username,pass:password})
    });
    const data=await res.json();
    if(data.ok){
      errorMsg.style.display='none';
      document.getElementById('section-login').style.display='none';
      document.getElementById('section-dashboard').style.display='flex';
      showToast('Bienvenido, Admin Master — Acceso concedido');
    } else {
      errorMsg.style.display='flex';
      document.getElementById('pass').value='';
    }
  } catch(error) {
    console.error('Error al conectar con el servidor:',error);
    errorMsg.style.display='flex';
  }
}

function doLogout() {
  document.getElementById('section-dashboard').style.display='none';
  document.getElementById('section-login').style.display='flex';
  document.getElementById('user').value='';
  document.getElementById('pass').value='';
  document.getElementById('err-msg').style.display='none';
  showToast('Sesión cerrada correctamente');
}

document.getElementById('btn-login').addEventListener('click',doLogin);
document.getElementById('btn-logout').addEventListener('click',doLogout);
document.getElementById('pass').addEventListener('keydown',(e)=>{if(e.key==='Enter')doLogin();});

// IMEI
function isValidIMEI(imei) {
  if(!/^\d{15}$/.test(imei))return false;
  let sum=0;
  for(let i=0;i<15;i++){let d=parseInt(imei[i],10);if(i%2===1){d*=2;if(d>9)d-=9;}sum+=d;}
  return sum%10===0;
}

// UNLOCK
let credits=INITIAL_CREDITS;
function runUnlock() {
  const carrier=document.getElementById('t-carrier').value;
  const service=document.getElementById('t-svc').value;
  const imei=document.getElementById('t-imei').value.trim();
  const resultBox=document.getElementById('result-box');
  if(carrier==='Seleccionar...'||service==='Seleccionar...'||!imei){resultBox.className='result-box error';resultBox.innerHTML='<i class="fas fa-triangle-exclamation"></i> Complete todos los campos antes de ejecutar';return;}
  if(!isValidIMEI(imei)){resultBox.className='result-box error';resultBox.innerHTML='<i class="fas fa-triangle-exclamation"></i> IMEI inválido — Debe tener 15 dígitos numéricos válidos';return;}
  let step=0;
  resultBox.className='result-box active';
  resultBox.innerHTML='<i class="fas fa-spinner fa-spin"></i> Iniciando proceso de desbloqueo...';
  const interval=setInterval(()=>{
    if(step<UNLOCK_MESSAGES.length){resultBox.innerHTML=`<i class="fas fa-spinner fa-spin"></i> ${UNLOCK_MESSAGES[step]}`;step++;}
    else {
      clearInterval(interval);
      const ok=Math.random()>UNLOCK_FAILURE_RATE;
      if(ok){const code=Math.random().toString(36).slice(2,10).toUpperCase();resultBox.className='result-box success';resultBox.innerHTML=`<i class="fas fa-check-circle"></i> ÉXITO — Código: <strong style="color:var(--gold);letter-spacing:3px;margin-left:8px">${code}</strong> — Crédito deducido: 1cr`;credits--;document.getElementById('credit-display').innerHTML=credits+'<span>cr</span>';addLogEntry(service,carrier,imei,true);}
      else{resultBox.className='result-box error';resultBox.innerHTML='<i class="fas fa-xmark-circle"></i> Servicio no disponible para este dispositivo — Sin cargo de créditos';addLogEntry(service,carrier,imei,false);}
    }
  },UNLOCK_STEP_DELAY_MS);
}

function addLogEntry(service,carrier,imei,ok) {
  try {
    const logList=document.getElementById('log-list');
    const entry=document.createElement('div');entry.className='log-item';
    const iconDiv=document.createElement('div');iconDiv.className=ok?'log-icon ok':'log-icon fail';
    const iconI=document.createElement('i');iconI.className=ok?'fas fa-check':'fas fa-xmark';
    iconDiv.appendChild(iconI);
    const textDiv=document.createElement('div');textDiv.className='log-text';
    const titleDiv=document.createElement('div');titleDiv.className='lt';titleDiv.textContent=`${service} — ${carrier}`;
    const subDiv=document.createElement('div');subDiv.className='ls';subDiv.textContent=`IMEI: ${imei.slice(0,6)}••••••••• // ahora`;
    textDiv.appendChild(titleDiv);textDiv.appendChild(subDiv);
    const badge=document.createElement('div');badge.className=ok?'log-badge ok':'log-badge fail';badge.textContent=ok?'ÉXITO':'FALLIDO';
    entry.appendChild(iconDiv);entry.appendChild(textDiv);entry.appendChild(badge);
    logList.insertBefore(entry,logList.firstChild);
    while(logList.children.length>MAX_LOG_ENTRIES)logList.removeChild(logList.lastChild);
  } catch(e){console.error('Error log:',e);}
}

document.getElementById('btn-unlock').addEventListener('click',runUnlock);
document.getElementById('btn-recargar').addEventListener('click',()=>showToast('Redirigiendo a recarga de créditos...'));
document.querySelectorAll('.svc').forEach(el=>{el.addEventListener('click',()=>showToast(`${el.querySelector('.svc-name').textContent} activado`));});