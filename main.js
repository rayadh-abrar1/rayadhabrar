/* ============================================================
   main.js — EEE Student Portfolio
   Handles: cursor, navbar, scroll reveal, typing, counters,
            project filter, mobile menu, contact form
   ============================================================ */

'use strict';

/* ── CUSTOM CURSOR (desktop only) ────────────────────────── */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

if (cursor && cursorFollower && window.matchMedia('(pointer:fine)').matches) {
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animFollower() {
    fx += (mx - fx) * 0.11;
    fy += (my - fy) * 0.11;
    cursorFollower.style.left = fx + 'px';
    cursorFollower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  // Grow cursor on interactive elements
  const hoverTargets = 'a, button, .filter-btn, .proj-card, .blog-card, .tuition-card, .chip, .skill-pill';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform         = 'translate(-50%,-50%) scale(2)';
      cursorFollower.style.transform = 'translate(-50%,-50%) scale(1.4)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform         = 'translate(-50%,-50%) scale(1)';
      cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}


/* ── NAVBAR SCROLL BEHAVIOUR ─────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });


/* ── MOBILE NAVIGATION MENU ──────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  const spans  = navToggle.querySelectorAll('span');
  navToggle.setAttribute('aria-expanded', isOpen);

  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});


/* ── SCROLL REVEAL ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.revealDelay || '0');
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Stagger siblings within the same parent container
document.querySelectorAll('.reveal').forEach(el => {
  const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .reveal'));
  const idx      = siblings.indexOf(el);
  el.dataset.revealDelay = idx * 75;
  revealObserver.observe(el);
});


/* ── COUNTER ANIMATION ───────────────────────────────────── */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const target = parseInt(el.dataset.target, 10);
    let current  = 0;
    const step   = target / 55;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 18);

    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));


/* ── TYPING EFFECT ───────────────────────────────────────── */
const typedPhrases = [
  'power systems research',
  'renewable energy integration',
  'IEEE leadership',
  '5G & signal processing',
  'startup innovation',
  'high-voltage transmission',
];

const typedEl = document.getElementById('typedText');
let   pIdx = 0, cIdx = 0, deleting = false;

function runTyper() {
  if (!typedEl) return;

  const phrase = typedPhrases[pIdx];

  if (deleting) {
    typedEl.textContent = phrase.slice(0, cIdx - 1);
    cIdx--;
  } else {
    typedEl.textContent = phrase.slice(0, cIdx + 1);
    cIdx++;
  }

  let delay = deleting ? 45 : 85;

  if (!deleting && cIdx === phrase.length) {
    delay    = 2200;
    deleting = true;
  } else if (deleting && cIdx === 0) {
    deleting = false;
    pIdx     = (pIdx + 1) % typedPhrases.length;
    delay    = 350;
  }

  setTimeout(runTyper, delay);
}

// Start after a brief pause so page renders first
setTimeout(runTyper, 800);


/* ── PROJECT FILTER ──────────────────────────────────────── */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.proj-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;

      if (show) {
        card.style.display  = '';
        card.style.opacity  = '0';
        card.style.transform = 'translateY(16px)';
        // Force reflow so transition fires
        void card.offsetWidth;
        card.style.transition = 'opacity .3s ease, transform .3s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'none';
      } else {
        card.style.display = 'none';
      }
    });
  });
});


/* ── ACTIVE NAV LINK HIGHLIGHT ───────────────────────────── */
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinkEls.forEach(link => {
      link.classList.toggle(
        'active-link',
        link.getAttribute('href') === '#' + entry.target.id
      );
    });
  });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));


/* ── CONTACT FORM ────────────────────────────────────────── */
/*
  This form uses Formspree for free email delivery.

  SETUP (takes 2 minutes):
  1. Go to https://formspree.io → sign up for free
  2. Click "New Form" → give it a name → copy the form ID
  3. Replace 'YOUR_FORM_ID' below with your actual ID
  4. That's it — messages will arrive in your email inbox!
*/
const FORMSPREE_ID = 'YOUR_FORM_ID'; // ✏️ Replace with your Formspree form ID

const contactForm = document.getElementById('contactForm');
const btnLabel    = document.getElementById('btnLabel');
const formNote    = document.getElementById('formNote');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();

  btnLabel.textContent = 'Sending…';

  try {
    if (FORMSPREE_ID === 'YOUR_FORM_ID') {
      // Demo mode — no real ID set yet
      await new Promise(r => setTimeout(r, 1200));
      showSuccess();
    } else {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(contactForm),
      });

      if (res.ok) {
        showSuccess();
      } else {
        throw new Error('Server error');
      }
    }
  } catch {
    btnLabel.textContent = '✕ Failed — try emailing directly';
    setTimeout(() => { btnLabel.textContent = 'Send Message'; }, 4000);
  }
});

function showSuccess() {
  btnLabel.textContent = '✓ Message Sent!';
  formNote.textContent = 'Thank you! I\'ll be in touch soon.';
  formNote.style.color = 'var(--accent)';
  contactForm.reset();
  setTimeout(() => {
    btnLabel.textContent = 'Send Message';
    formNote.textContent = '⚡ I usually reply within 24 hours.';
    formNote.style.color = '';
  }, 4000);
}


/* ── HERO NAME GLITCH EFFECT (subtle) ───────────────────── */
const heroName = document.getElementById('heroName');

if (heroName) {
  setInterval(() => {
    heroName.style.textShadow = `0 0 60px rgba(0,229,255,.5),
      2px 0 0 rgba(255,0,80,.25), -2px 0 0 rgba(0,255,200,.25)`;
    setTimeout(() => {
      heroName.style.textShadow = '0 0 48px rgba(0,229,255,.28)';
    }, 100);
  }, 5000);
}


/* ── SKILL PILLS — stagger entrance ─────────────────────── */
const pillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const pills = entry.target.querySelectorAll('.skill-pill');
    pills.forEach((p, i) => {
      p.style.opacity    = '0';
      p.style.transform  = 'translateY(12px)';
      setTimeout(() => {
        p.style.transition = 'opacity .4s ease, transform .4s ease';
        p.style.opacity    = '1';
        p.style.transform  = 'none';
      }, 100 + i * 55);
    });
    pillObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

const skillCloud = document.querySelector('.skill-cloud');
if (skillCloud) pillObserver.observe(skillCloud);


/* ── SMOOTH ANCHOR SCROLL (fallback for old browsers) ───── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
