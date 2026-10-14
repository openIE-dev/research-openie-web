// Lightweight figure lightbox: tap or click a figure to view it full screen.
// Pinch or wheel to zoom, drag to pan, double tap to toggle zoom, Esc or the
// close button to exit. No dependencies.
function init() {
  const figs = Array.from(document.querySelectorAll('main figure img, main a.fig-zoom img, main img[src^="/figures/"]'));
  if (!figs.length) return;

  const dlg = document.createElement('dialog');
  dlg.className = 'lb';
  dlg.setAttribute('aria-label', 'Figure viewer');
  dlg.innerHTML =
    '<div class="lb-stage"><img class="lb-img" alt="" draggable="false"></div>' +
    '<div class="lb-bar"><p class="lb-cap"></p><div class="lb-btns">' +
    '<button type="button" class="lb-btn" data-z="out" aria-label="Zoom out">&minus;</button>' +
    '<button type="button" class="lb-btn" data-z="reset" aria-label="Reset zoom">1:1</button>' +
    '<button type="button" class="lb-btn" data-z="in" aria-label="Zoom in">+</button>' +
    '<a class="lb-btn lb-open" target="_blank" rel="noopener">Open full size</a>' +
    '<button type="button" class="lb-btn lb-close" aria-label="Close figure viewer">&times;</button>' +
    '</div></div>';
  document.body.appendChild(dlg);
  const stage = dlg.querySelector('.lb-stage');
  const big = dlg.querySelector('.lb-img');
  const cap = dlg.querySelector('.lb-cap');
  const open = dlg.querySelector('.lb-open');
  let s = 1, x = 0, y = 0, opener = null;
  const pts = new Map();
  let pinch = null, drag = null, lastTap = 0;

  const fit = () => {
    const r = stage.getBoundingClientRect();
    const nw = big.naturalWidth || 1, nh = big.naturalHeight || 1;
    const k = Math.min((r.width - 16) / nw, (r.height - 16) / nh);
    big.style.width = Math.round(nw * k) + 'px'; big.style.height = Math.round(nh * k) + 'px';
  };
  big.addEventListener('load', fit);
  window.addEventListener('resize', () => { if (dlg.open) fit(); });
  const apply = () => { big.style.transform = `translate(${x}px, ${y}px) scale(${s})`; };
  const zoomAt = (ns, cx, cy) => {
    ns = Math.min(8, Math.max(1, ns));
    const r = stage.getBoundingClientRect();
    const ox = cx - r.left - r.width / 2, oy = cy - r.top - r.height / 2;
    x = ox - (ox - x) * (ns / s); y = oy - (oy - y) * (ns / s); s = ns;
    if (s === 1) { x = 0; y = 0; }
    apply();
  };
  const center = () => { const r = stage.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  function show(img) {
    const a = img.closest('a.fig-zoom');
    const fig = img.closest('figure');
    const src = (a && a.getAttribute('href')) || img.currentSrc || img.src;
    big.src = src; big.alt = img.alt || '';
    const fc = fig && fig.querySelector('figcaption');
    let t = fc ? fc.cloneNode(true) : null;
    if (t) t.querySelectorAll('.fig-links').forEach((n) => n.remove());
    cap.textContent = t ? t.textContent.trim() : (img.alt || '');
    open.href = src;
    s = 1; x = 0; y = 0; apply();
    opener = document.activeElement;
    dlg.showModal();
    if (big.complete) fit();
    document.documentElement.classList.add('lb-lock');
    dlg.querySelector('.lb-close').focus();
  }
  function hide() { if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', () => { document.documentElement.classList.remove('lb-lock'); if (opener && opener.focus) opener.focus(); });

  figs.forEach((img) => {
    let trigger = img.closest('a.fig-zoom');
    if (!trigger) {
      // Astro-page figures: make the image itself a button.
      const parentLink = img.closest('a');
      if (parentLink) trigger = parentLink;
      else { img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', 'Enlarge figure: ' + (img.alt || '').slice(0, 80)); trigger = img; }
      img.classList.add('fig-img');
    }
    trigger.classList.add('lb-trigger');
    trigger.addEventListener('click', (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); show(img); });
    if (trigger === img) img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(img); } });
  });

  dlg.querySelector('.lb-close').addEventListener('click', hide);
  dlg.querySelectorAll('[data-z]').forEach((b) => b.addEventListener('click', () => {
    const [cx, cy] = center();
    const z = b.dataset.z;
    zoomAt(z === 'in' ? s * 1.5 : z === 'out' ? s / 1.5 : 1, cx, cy);
  }));
  dlg.addEventListener('keydown', (e) => {
    const [cx, cy] = center();
    if (e.key === '+' || e.key === '=') zoomAt(s * 1.5, cx, cy);
    else if (e.key === '-') zoomAt(s / 1.5, cx, cy);
    else if (e.key === '0') zoomAt(1, cx, cy);
  });
  stage.addEventListener('click', (e) => { if (e.target === stage && s === 1) hide(); });
  stage.addEventListener('wheel', (e) => { e.preventDefault(); zoomAt(s * Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); }, { passive: false });
  stage.addEventListener('pointerdown', (e) => {
    stage.setPointerCapture(e.pointerId);
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 2) {
      const [a, b] = [...pts.values()];
      pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), s }; drag = null;
    } else if (pts.size === 1) {
      drag = { x0: e.clientX - x, y0: e.clientY - y };
      const now = Date.now();
      if (now - lastTap < 300) { zoomAt(s > 1 ? 1 : 2.5, e.clientX, e.clientY); drag = null; }
      lastTap = now;
    }
  });
  stage.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && pts.size === 2) {
      const [a, b] = [...pts.values()];
      zoomAt(pinch.s * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
    } else if (drag && s > 1) { x = e.clientX - drag.x0; y = e.clientY - drag.y0; apply(); }
  });
  const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; if (!pts.size) drag = null; };
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
