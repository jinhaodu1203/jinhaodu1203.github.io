const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
function closeMenu() { navLinks.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = navLinks.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.getElementById('year').textContent = new Date().getFullYear();

// Keep decorative motion optional, and stop drawing when the tab is hidden.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.getElementById('motionToggle');
let paused = motionPreference.matches;
let frameId = 0;
function updateMotion() {
  document.body.classList.toggle('motion-paused', paused);
  motionToggle.textContent = paused ? 'Enable effects' : 'Pause effects';
  motionToggle.setAttribute('aria-pressed', String(paused));
  if (paused || document.hidden) { cancelAnimationFrame(frameId); frameId = 0; }
  else if (!frameId) frameId = requestAnimationFrame(drawStars);
}
motionToggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
motionPreference.addEventListener('change', event => { paused = event.matches; updateMotion(); });
document.addEventListener('visibilitychange', updateMotion);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.about > div, .cap-grid article, .section-head, .timeline, .case, .toolkit-grid, .contact h2').forEach(element => {
  element.classList.add('reveal'); revealObserver.observe(element);
});

const progress = document.querySelector('.reading-progress i');
function updateProgress() {
  const remaining = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${remaining > 0 ? scrollY / remaining : 0})`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
const glow = document.querySelector('.cursor-glow');
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.addEventListener('pointermove', event => {
    if (!paused) glow.style.transform = `translate(${event.clientX - 180}px, ${event.clientY - 180}px)`;
  }, { passive: true });
  document.querySelectorAll('.visual:not(.game)').forEach(panel => {
    panel.addEventListener('pointermove', event => {
      if (paused) return;
      const box = panel.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      panel.style.transform = `perspective(1100px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-3px)`;
    });
    panel.addEventListener('pointerleave', () => { panel.style.transform = ''; });
  });
}

const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
const hero = document.getElementById('home');
let stars = [], width = 0, height = 0;
function resizeStars() {
  width = hero.clientWidth; height = hero.clientHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * dpr; canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  stars = Array.from({ length: width < 650 ? 24 : 55 }, () => ({ x: Math.random() * width, y: Math.random() * height, r: Math.random() + 0.3, speed: Math.random() * 0.12 + 0.04 }));
}
function drawStars() {
  frameId = 0;
  if (paused || document.hidden) return;
  if (hero.getBoundingClientRect().bottom > 0) {
    ctx.clearRect(0, 0, width, height);
    stars.forEach((star, index) => {
      star.y -= star.speed; if (star.y < 0) star.y = height;
      ctx.fillStyle = index % 4 === 0 ? '#b5a8ff80' : '#8beee780';
      ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2); ctx.fill();
      if (index % 5 === 0 && width > 650) {
        const next = stars[(index + 1) % stars.length];
        if (Math.hypot(star.x - next.x, star.y - next.y) < 130) {
          ctx.strokeStyle = '#76eee114'; ctx.beginPath(); ctx.moveTo(star.x, star.y); ctx.lineTo(next.x, next.y); ctx.stroke();
        }
      }
    });
  }
  frameId = requestAnimationFrame(drawStars);
}
window.addEventListener('resize', resizeStars);
resizeStars(); updateMotion();

const dialog = document.getElementById('demoDialog');
const modalVideo = document.getElementById('modalVideo');
const inlineVideo = document.getElementById('gameVideo');
const openDemo = document.querySelector('[data-open-demo]');
function closeDemo() { dialog.close(); }
openDemo.addEventListener('click', () => {
  inlineVideo.pause(); dialog.showModal();
  document.body.style.overflow = 'hidden';
  modalVideo.play().catch(() => { /* Native controls remain available. */ });
});
document.getElementById('closeDemo').addEventListener('click', closeDemo);
dialog.addEventListener('click', event => { if (event.target === dialog) { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDemo(); } });
dialog.addEventListener('close', () => { modalVideo.pause(); document.body.style.overflow = ''; openDemo.focus(); });
