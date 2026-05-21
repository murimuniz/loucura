// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px'});
function animRing(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animRing)}
animRing();
document.querySelectorAll('a,button,.pillar,.thinker,.debate-card,.video-card,.card,.stat-box').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cursor.style.transform='translate(-50%,-50%) scale(2)';ring.style.opacity='0.3'});
  el.addEventListener('mouseleave',()=>{cursor.style.transform='translate(-50%,-50%) scale(1)';ring.style.opacity='0.5'});
});

// Progress bar
const bar=document.getElementById('progress-bar');
if(bar) window.addEventListener('scroll',()=>{bar.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+'%'});

// Navbar shadow
const nav=document.getElementById('navbar');
if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40));

// Active nav link — detecta automaticamente a página atual
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a=>{
  a.classList.remove('active');
  const href = a.getAttribute('href');
  if(href === page || (page === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});
// botão vídeo
const vbtn = document.querySelector('.nav-video-btn');
if(vbtn) {
  vbtn.classList.remove('active');
  if(page === 'videos.html') vbtn.classList.add('active');
}

// Scroll reveals
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('visible')});
},{threshold:0.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.stagger,.debate-card').forEach(el=>obs.observe(el));

// Animated counters
const cObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&!e.target.dataset.done){
      e.target.dataset.done='1';
      const target=parseInt(e.target.dataset.target),suffix=e.target.dataset.suffix||'';
      const startVal=target>100?target-100:0,dur=1500,t0=performance.now();
      const run=now=>{const p=Math.min((now-t0)/dur,1),ease=1-Math.pow(1-p,3);
        e.target.textContent=Math.round(startVal+(target-startVal)*ease)+suffix;
        if(p<1) requestAnimationFrame(run)};
      requestAnimationFrame(run);
    }
  });
},{threshold:0.5});
document.querySelectorAll('.stat-val[data-target]').forEach(el=>cObs.observe(el));

// ── Page Transition ──
(function(){
  // Criar overlay
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  for(let i=0;i<5;i++) overlay.appendChild(document.createElement('div')).className='pt-bar';
  const scanline = document.createElement('div');
  scanline.className = 'pt-scanline';
  document.body.appendChild(overlay);
  document.body.appendChild(scanline);

  // Entrada: animar saída das barras ao carregar
  window.addEventListener('load', () => {
    overlay.classList.add('enter');
    scanline.style.opacity='1';
    // pequeno delay para as barras aparecerem, depois saem
    requestAnimationFrame(()=>{
      setTimeout(()=>{
        overlay.classList.remove('enter');
        overlay.classList.add('leave');
        setTimeout(()=>{
          overlay.classList.remove('leave');
          scanline.style.opacity='0';
        }, 600);
      }, 80);
    });
  });

  // Saída: ao clicar em link interno
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if(!link) return;
    const href = link.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    e.preventDefault();
    overlay.classList.remove('leave');
    overlay.classList.add('enter');
    scanline.style.opacity='1';
    scanline.style.animation='none';
    scanline.offsetHeight; // reflow
    scanline.style.animation='';
    setTimeout(()=>{ window.location.href = href; }, 600);
  });
})();
