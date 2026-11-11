'use strict';

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
if (cursor && cursorFollower && window.matchMedia('(pointer:fine)').matches) {
  let mx=0,my=0,fx=0,fy=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cursor.style.left=mx+'px';cursor.style.top=my+'px';});
  (function loop(){fx+=(mx-fx)*.11;fy+=(my-fy)*.11;cursorFollower.style.left=fx+'px';cursorFollower.style.top=fy+'px';requestAnimationFrame(loop);})();
  document.querySelectorAll('a,button,.filter-btn,.proj-card,.blog-card,.service-card,.cert-card,.chip,.skill-pill').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cursor.style.transform='translate(-50%,-50%) scale(2)';cursorFollower.style.transform='translate(-50%,-50%) scale(1.4)';});
    el.addEventListener('mouseleave',()=>{cursor.style.transform='translate(-50%,-50%) scale(1)';cursorFollower.style.transform='translate(-50%,-50%) scale(1)';});
  });
}

/* ── HIRE BAR ────────────────────────────────────────────── */
const hireBar   = document.getElementById('hireBar');
const hireClose = document.getElementById('hireBarClose');
if (hireBar) {
  document.body.classList.add('bar-visible');
  if (hireClose) {
    hireClose.addEventListener('click', () => {
      hireBar.style.display = 'none';
      document.body.classList.remove('bar-visible');
      const nb = document.getElementById('navbar');
      if (nb) nb.style.top = '0';
    });
  }
}

/* ── NAVBAR SCROLL ───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── MOBILE MENU ─────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    navToggle.setAttribute('aria-expanded', open);
    if (open) { spans[0].style.transform='rotate(45deg) translate(5px,5px)';spans[1].style.opacity='0';spans[2].style.transform='rotate(-45deg) translate(5px,-5px)'; }
    else { spans.forEach(s=>{s.style.transform='';s.style.opacity='';}); }
  });
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.querySelectorAll('span').forEach(s=>{s.style.transform='';s.style.opacity='';});
      navToggle.setAttribute('aria-expanded','false');
    });
  });
  document.addEventListener('click', e => { if (!navbar.contains(e.target)) navLinks.classList.remove('open'); });
}

/* ── SCROLL REVEAL ───────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.revealDelay||'0');
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
  el.dataset.revealDelay = siblings.indexOf(el) * 75;
  revealObs.observe(el);
});

/* ── COUNTER ANIMATION ───────────────────────────────────── */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const divide = parseInt(el.dataset.divide  || '1', 10);
    let current  = 0;
    const step   = target / 55;
    const timer  = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = (target / divide).toFixed(divide > 1 ? 1 : 0);
        clearInterval(timer);
      } else {
        el.textContent = (current / divide).toFixed(divide > 1 ? 1 : 0);
      }
    }, 18);
    counterObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num').forEach(el => counterObs.observe(el));

/* ── TYPING EFFECT ───────────────────────────────────────── */
const typedPhrases = [
  'power systems & smart grids',
  'AI & machine learning',
  'VLSI & semiconductor design',
  'cybersecurity in infrastructure',
  'IEEE leadership & strategy',
  'engineering & management',
];
const typedEl = document.getElementById('typedText');
let pIdx=0,cIdx=0,deleting=false;
function runTyper() {
  if (!typedEl) return;
  const phrase = typedPhrases[pIdx];
  if (deleting) { typedEl.textContent=phrase.slice(0,cIdx-1);cIdx--; }
  else { typedEl.textContent=phrase.slice(0,cIdx+1);cIdx++; }
  let delay = deleting ? 45 : 85;
  if (!deleting && cIdx===phrase.length) { delay=2200;deleting=true; }
  else if (deleting && cIdx===0) { deleting=false;pIdx=(pIdx+1)%typedPhrases.length;delay=350; }
  setTimeout(runTyper, delay);
}
setTimeout(runTyper, 800);

/* ── PROJECT FILTER ──────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.proj-card').forEach(card => {
      const show = filter==='all' || card.dataset.category===filter;
      if (show) {
        card.style.display='';
        void card.offsetWidth;
        card.style.transition='opacity .3s,transform .3s';
        card.style.opacity='1';card.style.transform='none';
      } else { card.style.display='none'; }
    });
  });
});

/* ── ACTIVE NAV HIGHLIGHT ────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const secObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinkEls.forEach(link => link.classList.toggle('active-link', link.getAttribute('href')==='#'+entry.target.id));
  });
}, { threshold: 0.4 });
sections.forEach(s => secObs.observe(s));

/* ── CONTACT FORM ────────────────────────────────────────── */
const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← Replace with your Formspree ID from formspree.io
const contactForm = document.getElementById('contactForm');
const btnLabel    = document.getElementById('btnLabel');
const formNote    = document.getElementById('formNote');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    btnLabel.textContent = 'Sending…';
    try {
      if (FORMSPREE_ID === 'YOUR_FORM_ID') {
        await new Promise(r=>setTimeout(r,1200));
        showFormSuccess();
      } else {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(contactForm)});
        if (res.ok) showFormSuccess(); else throw new Error();
      }
    } catch { btnLabel.textContent='✕ Failed — email me directly'; setTimeout(()=>{btnLabel.textContent='Send Message';},4000); }
  });
}
function showFormSuccess() {
  btnLabel.textContent='✓ Message Sent!';
  if (formNote) { formNote.textContent="Thank you! I'll be in touch soon.";formNote.style.color='var(--accent)'; }
  contactForm.reset();
  setTimeout(()=>{ btnLabel.textContent='Send Message'; if(formNote){formNote.textContent='⚡ I reply within 24 hours.';formNote.style.color='';} },4000);
}

/* ── HERO GLITCH ─────────────────────────────────────────── */
const heroName = document.getElementById('heroName');
if (heroName) {
  setInterval(()=>{
    heroName.style.textShadow='0 0 60px rgba(0,229,255,.5),2px 0 0 rgba(255,0,80,.25),-2px 0 0 rgba(0,255,200,.25)';
    setTimeout(()=>{ heroName.style.textShadow='0 0 48px rgba(0,229,255,.28)'; },100);
  }, 5000);
}

/* ── SKILL PILLS STAGGER ─────────────────────────────────── */
const pillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-pill').forEach((p,i) => {
      p.style.opacity='0';p.style.transform='translateY(12px)';
      setTimeout(()=>{ p.style.transition='opacity .4s,transform .4s';p.style.opacity='1';p.style.transform='none'; },100+i*55);
    });
    pillObs.unobserve(entry.target);
  });
}, { threshold: 0.3 });
const skillCloud = document.querySelector('.skill-cloud');
if (skillCloud) pillObs.observe(skillCloud);

/* ── SMOOTH SCROLL FALLBACK ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});
