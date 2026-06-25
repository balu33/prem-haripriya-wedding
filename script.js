/* ============================================================
   ROYAL TELUGU WEDDING INVITATION — SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- CONFIG: WEDDING DATE ---------- */
  // Sumuhurtham: 04 July 2026, 10:34 PM, India Standard Time (UTC+5:30)
  const WEDDING_DATE = new Date('2026-07-04T22:34:00+05:30').getTime();

  /* ---------- AOS INIT ---------- */
  if (window.AOS) {
    AOS.init({ duration: 900, once: true, easing: 'ease-out-cubic', offset: 60 });
  }

  /* ============================================================
     TEMPLE GATE / LOADER
     ============================================================ */
  const templeGate = document.getElementById('templeGate');
  const gateDoors = document.querySelector('.gate-doors');
  const enterBtn = document.getElementById('enterBtn');
  const mainSite = document.getElementById('mainSite');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  function openGate() {
    // IMPORTANT: call play() synchronously inside the click handler (not after
    // a delay) — iOS Safari and some Android browsers only allow audio
    // autoplay-with-sound when play() is invoked directly inside a user
    // gesture. Doing this first, before any setTimeout, is what makes music
    // work reliably the moment a guest opens the link on their phone.
    bgMusic.volume = 0.5;
    const playPromise = bgMusic.play();
    if (playPromise && typeof playPromise.then === 'function') {
      playPromise.then(() => {
        musicToggle.classList.add('playing');
      }).catch(() => {
        // music.mp3 missing, or browser still blocked it — show a one-time nudge
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('nudge');
      });
    }

    gateDoors.classList.add('open');
    if (window.gsap) {
      gsap.to('.gate-inner', { delay: 0.9, opacity: 0, duration: 0.6 });
    }
    setTimeout(() => {
      templeGate.classList.add('hide');
      document.body.style.overflow = 'auto';
      // Trigger entrance animation for hero
      if (window.gsap) {
        gsap.fromTo('.hero-content > *', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power2.out' });
      }
    }, 1500);
  }

  enterBtn.addEventListener('click', openGate);
  // Safety: allow Enter/Space anywhere on the gate
  templeGate.addEventListener('keyup', (e) => { if (e.key === 'Enter') openGate(); });

  /* ---------- MUSIC TOGGLE ---------- */
  musicToggle.addEventListener('click', () => {
    musicToggle.classList.remove('nudge');
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
      }).catch(() => {
        musicToggle.classList.remove('playing');
        alert('Add a "music.mp3" file next to index.html to enable background music.');
      });
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
    }
  });

  /* ============================================================
     FLOATING PETALS (canvas)
     ============================================================ */
  const petalCanvas = document.getElementById('petal-canvas');
  const pctx = petalCanvas.getContext('2d');
  let petals = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resizeCanvas() {
    petalCanvas.width = window.innerWidth;
    petalCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function makePetal() {
    return {
      x: Math.random() * petalCanvas.width,
      y: -20 - Math.random() * 100,
      size: 8 + Math.random() * 10,
      speedY: 0.5 + Math.random() * 1.1,
      speedX: (Math.random() - 0.5) * 0.8,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 2,
      sway: Math.random() * Math.PI * 2,
      opacity: 0.6 + Math.random() * 0.4,
      hue: Math.random() > 0.5 ? 'gold' : 'maroon'
    };
  }

  const PETAL_COUNT = reduceMotion ? 0 : (window.innerWidth < 700 ? 14 : 26);
  for (let i = 0; i < PETAL_COUNT; i++) petals.push(makePetal());

  function drawPetal(p) {
    pctx.save();
    pctx.translate(p.x, p.y);
    pctx.rotate((p.rot * Math.PI) / 180);
    pctx.globalAlpha = p.opacity;
    const grad = pctx.createLinearGradient(-p.size, 0, p.size, 0);
    if (p.hue === 'gold') {
      grad.addColorStop(0, '#F6E2A0');
      grad.addColorStop(1, '#C9952C');
    } else {
      grad.addColorStop(0, '#9c1733');
      grad.addColorStop(1, '#7A0E27');
    }
    pctx.fillStyle = grad;
    pctx.beginPath();
    pctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
    pctx.fill();
    pctx.restore();
  }

  function animatePetals() {
    pctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
    petals.forEach((p) => {
      p.y += p.speedY;
      p.sway += 0.02;
      p.x += p.speedX + Math.sin(p.sway) * 0.5;
      p.rot += p.rotSpeed;
      if (p.y > petalCanvas.height + 20) {
        Object.assign(p, makePetal(), { y: -20 });
      }
      drawPetal(p);
    });
    requestAnimationFrame(animatePetals);
  }
  if (!reduceMotion) animatePetals();

  /* ============================================================
     GOLDEN SPARKLES
     ============================================================ */
  const sparkleLayer = document.getElementById('sparkleLayer');
  function spawnSparkle() {
    if (reduceMotion) return;
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = Math.random() * 100 + 'vh';
    sparkleLayer.appendChild(s);
    setTimeout(() => s.remove(), 2300);
  }
  if (!reduceMotion) setInterval(spawnSparkle, 700);

  /* ============================================================
     COUNTDOWN TIMERS (hero mini + full section)
     ============================================================ */
  let fireworksFired = false;

  function updateCountdown() {
    const now = Date.now();
    const diff = WEDDING_DATE - now;

    const els = {
      hcDays: document.getElementById('hc-days'),
      hcHours: document.getElementById('hc-hours'),
      hcMins: document.getElementById('hc-mins'),
      hcSecs: document.getElementById('hc-secs'),
      days: document.getElementById('cd-days'),
      hours: document.getElementById('cd-hours'),
      mins: document.getElementById('cd-mins'),
      secs: document.getElementById('cd-secs'),
    };

    if (diff <= 0) {
      Object.values(els).forEach(el => { if (el) el.textContent = '00'; });
      if (!fireworksFired) {
        fireworksFired = true;
        launchFireworks();
      }
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    const pad = (n) => String(n).padStart(2, '0');

    if (els.hcDays) els.hcDays.textContent = pad(d);
    if (els.hcHours) els.hcHours.textContent = pad(h);
    if (els.hcMins) els.hcMins.textContent = pad(m);
    if (els.hcSecs) els.hcSecs.textContent = pad(s);

    if (els.days) els.days.textContent = pad(d);
    if (els.hours) els.hours.textContent = pad(h);
    if (els.mins) els.mins.textContent = pad(m);
    if (els.secs) els.secs.textContent = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ============================================================
     FIREWORKS (canvas, fires when countdown hits zero)
     ============================================================ */
  const fwCanvas = document.getElementById('fireworksCanvas');
  const fwCtx = fwCanvas.getContext('2d');
  let fwParticles = [];
  let fwAnimating = false;

  function resizeFwCanvas() {
    const section = document.getElementById('countdown');
    if (!section) return;
    fwCanvas.width = section.offsetWidth;
    fwCanvas.height = section.offsetHeight;
  }
  window.addEventListener('resize', resizeFwCanvas);
  resizeFwCanvas();

  function createFirework(x, y) {
    const colors = ['#F6E2A0', '#C9952C', '#FBF3E3', '#9c1733', '#F0D078'];
    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50;
      const speed = 2 + Math.random() * 3;
      fwParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 60 + Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function fwLoop() {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    fwParticles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.life -= 1;
      fwCtx.globalAlpha = Math.max(p.life / 80, 0);
      fwCtx.fillStyle = p.color;
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      fwCtx.fill();
    });
    fwParticles = fwParticles.filter(p => p.life > 0);
    if (fwParticles.length > 0 || fwAnimating) {
      requestAnimationFrame(fwLoop);
    }
  }

  function launchFireworks() {
    resizeFwCanvas();
    fwAnimating = true;
    let bursts = 0;
    const burstInterval = setInterval(() => {
      createFirework(
        Math.random() * fwCanvas.width,
        fwCanvas.height * 0.3 + Math.random() * fwCanvas.height * 0.3
      );
      bursts++;
      if (bursts >= 8) {
        clearInterval(burstInterval);
        setTimeout(() => { fwAnimating = false; }, 1500);
      }
    }, 400);
    fwLoop();
  }

  /* ============================================================
     MASONRY GALLERY (placeholder tiles + lightbox)
     ============================================================ */
  const galleryData = [
    { label: 'Pre-Wedding', h: 240, img: '' },
    { label: 'Bride & Family', h: 320, img: '' },
    { label: 'Groom & Family', h: 200, img: '' },
    { label: 'Engagement Moments', h: 280, img: '' },
    { label: 'Pellikuthuru', h: 220, img: '' },
    { label: 'Family Portrait', h: 300, img: '' },
    { label: 'Temple Visit', h: 260, img: '' },
    { label: 'Together Forever', h: 230, img: '' },
  ];
  // To add a real photo: set img: 'photos/your-file.jpg' on any item above.

  const masonryGallery = document.getElementById('masonryGallery');
  galleryData.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'masonry-item';
    div.setAttribute('data-aos', 'fade-up');
    div.setAttribute('data-aos-delay', String((idx % 4) * 80));
    if (item.img) {
      div.innerHTML = `<img src="${item.img}" alt="${item.label}" style="width:100%;height:${item.h}px;object-fit:cover;display:block;">`;
    } else {
      div.innerHTML = `<div class="ph-tile" style="height:${item.h}px">${item.label}<br><small style="opacity:.7;font-size:.75rem">Photo coming soon</small></div>`;
    }
    div.addEventListener('click', () => openLightbox(item));
    masonryGallery.appendChild(div);
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(item) {
    if (item.img) {
      lightboxContent.innerHTML = `<img src="${item.img}" alt="${item.label}" style="max-width:90vw;max-height:80vh;display:block;">`;
    } else {
      lightboxContent.innerHTML = `<div class="ph-tile" style="width:min(80vw,500px);height:min(60vh,500px);font-size:1.1rem">${item.label}<br><small>Photo coming soon</small></div>`;
    }
    lightbox.classList.add('show');
  }
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('show'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('show'); });

  /* ============================================================
     RSVP FORM
     ============================================================ */
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const attendBtns = document.querySelectorAll('.attend-btn');
  const attendStatusInput = document.getElementById('attendStatus');

  attendBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      attendBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      attendStatusInput.value = btn.dataset.value;
    });
  });

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Collect response — currently stored locally only (no backend configured).
    const response = {
      name: document.getElementById('guestName').value,
      mobile: document.getElementById('guestMobile').value,
      guests: document.getElementById('guestCount').value,
      attending: attendStatusInput.value,
      submittedAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('rsvpResponses') || '[]');
      existing.push(response);
      localStorage.setItem('rsvpResponses', JSON.stringify(existing));
    } catch (err) {
      console.warn('Could not store RSVP locally:', err);
    }

    rsvpForm.style.display = 'none';
    rsvpSuccess.classList.add('show');

    // Gentle sparkle burst on success
    for (let i = 0; i < 12; i++) setTimeout(spawnSparkle, i * 80);
  });

  /* ============================================================
     WHATSAPP SHARE
     ============================================================ */
  const whatsappBtn = document.getElementById('whatsappShare');
  const shareText = encodeURIComponent(
    "శ్రీరస్తు శుభమస్తు 🙏 You're cordially invited to the wedding of Prem Kumar & Haripriya, on 04 July 2026 at Sri Veerabrahmendra Swamy Vari Devasthanam, Palukuru. " + window.location.href
  );
  whatsappBtn.href = `https://wa.me/?text=${shareText}`;

  /* ============================================================
     SIDE NAV ACTIVE STATE + SMOOTH SCROLL
     ============================================================ */
  const navDots = document.querySelectorAll('.nav-dot');
  const sections = Array.from(navDots).map(dot => document.querySelector(dot.getAttribute('href')));

  function updateActiveNav() {
    let activeIdx = 0;
    sections.forEach((sec, idx) => {
      if (sec && sec.getBoundingClientRect().top <= window.innerHeight * 0.4) {
        activeIdx = idx;
      }
    });
    navDots.forEach((dot, idx) => dot.classList.toggle('active', idx === activeIdx));
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ============================================================
     GSAP PARALLAX (subtle, respects reduced motion)
     ============================================================ */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.person-illustration').forEach((el) => {
      gsap.fromTo(el, { y: 40 }, {
        y: -40,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    gsap.utils.toArray('.event-card').forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.7, delay: (i % 3) * 0.05,
        scrollTrigger: { trigger: card, start: 'top 88%' }
      });
    });
  }

});
