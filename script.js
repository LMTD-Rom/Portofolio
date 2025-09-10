// Tahun dinamis di footer
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll + trigger skill bars
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Skill bar animasi tetap jalan
      if (entry.target.classList.contains('skills')) {
        entry.target.querySelectorAll('.skill__bar span').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      }
    } else {
      entry.target.classList.remove('visible');
      // Reset skill bar jika keluar layar
      if (entry.target.classList.contains('skills')) {
        entry.target.querySelectorAll('.skill__bar span').forEach(bar => {
          bar.style.width = '0';
        });
      }
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Live animated bokeh background (canvas)
(function(){
  const canvas = document.getElementById('bokeh-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = window.innerWidth, h = window.innerHeight;
  canvas.width = w; canvas.height = h;

  // Responsive resize
  window.addEventListener('resize', () => {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w; canvas.height = h;
  });

  // Dot config
  const colors = ['#7C3AED','#06B6D4','#F472B6','#34D399','#A78BFA'];
  const dots = Array.from({length: 8}).map(() => ({
    x: Math.random()*w,
    y: Math.random()*h,
    r: 60 + Math.random()*80,
    color: colors[Math.floor(Math.random()*colors.length)],
    dx: (Math.random()-0.5)*0.5,
    dy: (Math.random()-0.5)*0.5,
    dr: (Math.random()-0.5)*0.1,
    alpha: 0.13 + Math.random()*0.09
  }));

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(const d of dots){
      ctx.save();
      ctx.globalAlpha = d.alpha;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, 2*Math.PI);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 40;
      ctx.fill();
      ctx.restore();

      // Move
      d.x += d.dx;
      d.y += d.dy;
      d.r += d.dr;
      // Bounce & size limits
      if(d.x<0||d.x>w) d.dx*=-1;
      if(d.y<0||d.y>h) d.dy*=-1;
      if(d.r<50||d.r>160) d.dr*=-1;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// --- Live morphing blob background ---
function randomBlobPoints(radius, points, variance) {
  const angleStep = (Math.PI * 2) / points;
  return Array.from({length: points}).map((_, i) => {
    const angle = i * angleStep;
    const r = radius + (Math.random() - 0.5) * variance;
    return [
      Math.cos(angle) * r,
      Math.sin(angle) * r
    ];
  });
}
function pointsToPath(points) {
  let d = '';
  for (let i = 0; i < points.length; i++) {
    const p0 = points[(i - 1 + points.length) % points.length];
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const p3 = points[(i + 2) % points.length];

    if (i === 0) {
      d += `M${p1[0]},${p1[1]}`;
    }
    // Catmull-Rom to Bezier conversion
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  d += 'Z';
  return d;
}
function animateBlob(pathId, radius, points, variance, speed) {
  const path = document.getElementById(pathId);
  if (!path) return;
  let curr = randomBlobPoints(radius, points, variance);
  let next = randomBlobPoints(radius, points, variance);
  let t = 0;
  function loop() {
    t += speed;
    if (t >= 1) {
      t = 0;
      curr = next;
      next = randomBlobPoints(radius, points, variance);
    }
    // Interpolate points
    const interp = curr.map((p, i) => [
      p[0] + (next[i][0] - p[0]) * t,
      p[1] + (next[i][1] - p[1]) * t
    ]);
    path.setAttribute('d', pointsToPath(interp));
    requestAnimationFrame(loop);
  }
  loop();
}

// Hero blob (besar, variance sedang, gerak lambat)
animateBlob('blob-hero', 200, 23, 36, 0.0045);
// Riwayat blob (lebih oval, variance kecil, sangat lambat)
animateBlob('blob-riwayat', 170, 19, 22, 0.0035);
// Skill blob (lebih banyak titik, variance sedang, lambat)
animateBlob('blob-skill', 150, 27, 28, 0.004);
// Sosmed blob (variance besar, bentuk lebih dinamis, lambat)
animateBlob('blob-sosmed', 210, 15, 44, 0.0038);
// Skill badge modal
document.querySelectorAll('.skill-badge').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.getElementById('skill-modal');
    modal.classList.add('active');
    modal.querySelector('.skill-modal__img').src = btn.dataset.img;
    modal.querySelector('.skill-modal__img').alt = btn.dataset.title;
    modal.querySelector('.skill-modal__title').textContent = btn.dataset.title;
    modal.querySelector('.skill-modal__desc').textContent = btn.dataset.desc;
    modal.setAttribute('aria-hidden', 'false');
    modal.focus();
  });
});
document.querySelector('.skill-modal__close').onclick = closeSkillModal;
document.getElementById('skill-modal').onclick = function(e) {
  if (e.target === this) closeSkillModal();
};
function closeSkillModal() {
  const modal = document.getElementById('skill-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}
window.addEventListener('keydown', function(e){
  if(e.key === "Escape") closeSkillModal();
});

// Main floating menu
const menuBtn = document.getElementById('main-menu-btn');
const menuPopup = document.getElementById('main-menu-popup');
menuBtn.onclick = function() {
  const active = menuPopup.classList.toggle('active');
  menuBtn.setAttribute('aria-expanded', active ? 'true' : 'false');
  menuPopup.setAttribute('aria-hidden', active ? 'false' : 'true');
  if (active) menuPopup.focus();
};
document.querySelectorAll('.menu-link').forEach(btn => {
  btn.onclick = function() {
    menuPopup.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuPopup.setAttribute('aria-hidden', 'true');
    const target = document.querySelector(btn.dataset.target);
    if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
  };
});
// Close menu on outside click or Escape
document.addEventListener('mousedown', e => {
  if (menuPopup.classList.contains('active') && !menuPopup.contains(e.target) && e.target !== menuBtn) {
    menuPopup.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuPopup.setAttribute('aria-hidden', 'true');
  }
});
window.addEventListener('keydown', function(e){
  if(e.key === "Escape") {
    menuPopup.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuPopup.setAttribute('aria-hidden', 'true');
  }
});