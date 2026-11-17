// Living figure planet-01 and planet-02. Tolerance zone: this file only draws
// and collects edits. All state changes go through core.js and the edit logs.
import * as C from './core.js';

const $ = (id) => document.getElementById(id);
const MAT_RGB = [[40, 90, 160], [70, 72, 80], [214, 196, 140], [190, 186, 160], [150, 120, 110], [235, 242, 250], [120, 60, 50], [240, 190, 40]];

let A, B, logA, logB, diffSeries, playing = false;

function reset() {
  const seed = Number($('seed').value) >>> 0;
  A = C.initState(seed); B = C.cloneState(A);
  logA = []; logB = []; diffSeries = [];
  $('replayStatus').textContent = ''; $('editStatus').textContent = '';
  draw();
}

function tick(n) {
  for (let k = 0; k < n; k++) {
    A = C.advance(A, logA); B = C.advance(B, logB);
    diffSeries.push(C.divergence(A, B).cells);
  }
}

// ---------------------------------------------------------------- drawing

function paintMap(canvas, s) {
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(s.W, s.H);
  const view = $('view').value;
  for (let i = 0; i < s.g.length; i++) {
    let r, g, b;
    if (view === 'heat') {
      const t = Math.min(1, s.T[i] / 1400);
      r = 255 * t; g = 80 + 120 * (1 - Math.abs(t - 0.5) * 2); b = 255 * (1 - t);
    } else if (view === 'vapour') {
      const v = Math.min(1, s.q[i] / 200);
      r = g = b = 20 + 235 * v;
    } else if (view === 'material') {
      [r, g, b] = MAT_RGB[s.m[i]];
    } else if (s.w[i] > 2) {
      const d = Math.min(1, s.w[i] / 160);
      r = 30 - 20 * d; g = 110 - 60 * d; b = 200 - 60 * d;
    } else {
      const shade = 0.55 + 0.45 * Math.min(1, Math.max(0, (s.g[i] - C.SEA) / 400));
      [r, g, b] = MAT_RGB[s.m[i]].map((c) => c * shade);
    }
    img.data.set([r, g, b, 255], i * 4);
  }
  ctx.putImageData(img, 0, 0);
}

function paintDiff(canvas, a, b) {
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(a.W, a.H);
  for (let i = 0; i < a.g.length; i++) {
    const d = Math.abs(a.g[i] - b.g[i]) * 8 + Math.abs(a.w[i] - b.w[i]) + Math.abs(a.q[i] - b.q[i]) + Math.abs(a.T[i] - b.T[i]);
    const v = d ? Math.min(1, 0.25 + Math.log10(1 + d) / 3) : 0;
    img.data.set([255 * v, 180 * v * v, 60 * v, 255], i * 4);
  }
  ctx.putImageData(img, 0, 0);
}

function paintChart() {
  const c = $('chart'), dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth, h = c.clientHeight;
  c.width = w * dpr; c.height = h * dpr;
  const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
  ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, w, h);
  const max = Math.log10(A.g.length), pad = 26;
  ctx.strokeStyle = '#1e293b'; ctx.fillStyle = '#94a3b8'; ctx.font = '10px monospace';
  for (let e = 0; e <= 4; e++) {
    const y = h - 8 - (e / max) * (h - 16);
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w, y); ctx.stroke();
    ctx.fillText(e === 0 ? '1' : '1e' + e, 2, y + 3);
  }
  const n = diffSeries.length;
  if (!n) return;
  ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.5; ctx.beginPath();
  for (let k = 0; k < n; k++) {
    const x = pad + (k / Math.max(1, n - 1)) * (w - pad - 4);
    const v = diffSeries[k];
    const y = h - 8 - (v ? Math.log10(v) / max : 0) * (h - 16);
    if (v === 0) { ctx.moveTo(x, h - 8); continue; }
    k && diffSeries[k - 1] ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
  ctx.fillStyle = '#94a3b8'; ctx.fillText(`${n} ticks`, w - 60, 12);
}

function fmt(n) { return n.toLocaleString('en-US'); }

function draw() {
  paintMap($('mapA'), A); paintMap($('mapB'), B); paintDiff($('mapD'), A, B); paintChart();
  const tA = C.totals(A), tB = C.totals(B), d = C.divergence(A, B);
  const hA = C.hashState(A), hB = C.hashState(B);
  $('metrics').innerHTML = `
    <dt>tick</dt><dd>${A.t}</dd>
    <dt>hash A</dt><dd>${hA}</dd>
    <dt>hash B</dt><dd>${hB} <span class="${hA === hB ? 'ok' : 'bad'}">${hA === hB ? 'same' : 'differs'}</span></dd>
    <dt>cells differing</dt><dd>${fmt(d.cells)} of ${fmt(A.g.length)}</dd>
    <dt>ground total A, B</dt><dd>${fmt(tA.ground)}, ${fmt(tB.ground)}</dd>
    <dt>water total A, B</dt><dd>${fmt(tA.water)}, ${fmt(tB.water)}</dd>
    <dt>inventory B</dt><dd>rock ${fmt(B.R)}, water ${fmt(B.V)}</dd>`;
  const legend = { terrain: 'Blue: water depth. Land: material colour, lighter with height.', heat: 'Blue cold to red hot.', vapour: 'Brighter: more vapour.', material: 'basalt grey · sand tan · limestone pale · granite rose · ice white · magnetite ore brown · gold vein yellow' };
  $('legend').textContent = legend[$('view').value];
  const li = (e) => `<li>tick ${e.t}: ${e.op} ${e.k} at (${e.x}, ${e.y})</li>`;
  $('logA').innerHTML = logA.slice(-30).map(li).join('');
  $('logB').innerHTML = logB.slice(-30).map(li).join('');
}

// ---------------------------------------------------------------- interaction

function cellAt(canvas, ev) {
  const r = canvas.getBoundingClientRect();
  const x = Math.floor(((ev.clientX - r.left) / r.width) * A.W);
  const y = Math.floor(((ev.clientY - r.top) / r.height) * A.H);
  return { x: Math.min(A.W - 1, Math.max(0, x)), y: Math.min(A.H - 1, Math.max(0, y)) };
}

function inspect(s, x, y, label) {
  const c = C.cellElements(s, x, y);
  const total = Object.values(c.elements).reduce((a, b) => a + b, 0) || 1;
  const rows = Object.entries(c.elements).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
    .map(([el, v]) => `<tr><td>${el}</td><td class="num">${(100 * v / total).toFixed(v / total < 0.001 ? 4 : 2)}%</td></tr>`).join('');
  $('inspect').innerHTML = `<dl class="metrics">
      <dt>cell</dt><dd>(${x}, ${y}) in ${label}</dd>
      <dt>material</dt><dd>${c.material.name}</dd>
      <dt>minerals</dt><dd>${c.material.mix}</dd>
      <dt>ground</dt><dd>${c.ground}</dd><dt>water</dt><dd>${c.water}</dd>
      <dt>vapour</dt><dd>${c.vapour}</dd><dt>heat</dt><dd>${c.heat}</dd></dl>
    <div class="legend">Elements by mass in the ground and water of this cell</div>
    <table class="el">${rows}</table>`;
}

function onMapClick(which) {
  return (ev) => {
    const { x, y } = cellAt(ev.currentTarget, ev);
    const tool = $('tool').value;
    if (tool === 'inspect') { inspect(which === 'A' ? A : B, x, y, `branch ${which}`); return; }
    const k = Math.max(1, Math.min(1000, Math.floor(Number($('amount').value) || 1)));
    const edit = { t: A.t, x, y, op: tool, k };
    const targets = $('target').value === 'both' ? [['A', A, logA], ['B', B, logB]] : [['B', B, logB]];
    const msgs = [];
    for (const [name, s, log] of targets) {
      // Check against the state as it will be when the edit applies, including edits already queued this tick.
      const probe = C.cloneState(s);
      for (const e of log) if (e.t === s.t && !C.checkEdit(probe, e)) C.applyEdit(probe, e);
      const why = C.checkEdit(probe, edit);
      if (why) msgs.push(`${name}: refused, ${why}`);
      else { log.push({ ...edit }); msgs.push(`${name}: ${tool} ${k} at (${x}, ${y}) logged for tick ${edit.t}`); }
    }
    $('editStatus').textContent = msgs.join(' · ');
    if (!playing) { tick(1); }
    draw();
  };
}

// Dig one unit in B at a wet cell near a coast, where the weather is most sensitive.
$('demo').addEventListener('click', () => {
  let h = C.hash3(B.seed, B.t, 5), i = -1;
  for (let tries = 0; tries < 20000; tries++) {
    const j = h % B.g.length; h = C.mix32(h);
    if (B.g[j] >= C.SEA - 10 && B.g[j] > 0 && B.w[j] > 0 && B.w[j] < 40) { i = j; break; }
  }
  if (i < 0) { $('editStatus').textContent = 'No wet coastal cell found; try another seed.'; return; }
  const edit = { t: B.t, x: i % B.W, y: Math.floor(i / B.W), op: 'dig', k: 1 };
  if (C.checkEdit(B, edit)) return;
  logB.push(edit);
  $('editStatus').textContent = `B: dig 1 at (${edit.x}, ${edit.y}) logged for tick ${edit.t}. Press Play.`;
  if (!playing) tick(1);
  draw();
});

$('mapA').addEventListener('click', onMapClick('A'));
$('mapB').addEventListener('click', onMapClick('B'));
$('mapD').addEventListener('click', onMapClick('B'));
$('reset').addEventListener('click', () => { playing = false; $('play').textContent = 'Play'; reset(); });
$('view').addEventListener('change', draw);
$('step').addEventListener('click', () => { tick(10); draw(); });
$('fork').addEventListener('click', () => {
  B = C.cloneState(A); logB = logA.map((e) => ({ ...e }));
  diffSeries.push(0); $('editStatus').textContent = 'B is now a copy of A, log included.'; draw();
});
$('play').addEventListener('click', () => {
  playing = !playing; $('play').textContent = playing ? 'Pause' : 'Play';
  if (playing) requestAnimationFrame(loop);
});
function loop() {
  if (!playing) return;
  tick(Number($('speed').value)); draw();
  requestAnimationFrame(loop);
}

$('replay').addEventListener('click', () => {
  const t0 = performance.now();
  const r = C.replay(A.seed, logA, A.t, A.W, A.H);
  const same = C.hashState(r) === C.hashState(A);
  $('replayStatus').innerHTML = `${A.t} ticks and ${logA.length} edits replayed in ${Math.round(performance.now() - t0)} ms: <span class="${same ? 'ok' : 'bad'}">${same ? 'identical to the live state' : 'differs from the live state'}</span>`;
});

$('gpu').addEventListener('click', async () => {
  const out = $('gpuOut');
  out.innerHTML = '<dt>status</dt><dd>running…</dd>';
  try {
    const { checkParity } = await import('./gpu.js');
    let first = true;
    const r = await checkParity({ onProgress: (p) => {
      if (first) { out.innerHTML = ''; first = false; }
      out.innerHTML += `<dt>seed ${p.seed}</dt><dd>${p.mismatches} mismatches (GPU ${p.gpuMs} ms, reference ${p.referenceMs} ms)</dd>`;
    } });
    if (!r.ran) { out.innerHTML = `<dt>status</dt><dd class="bad">not run: ${r.reason}</dd>`; return; }
    const a = r.adapter;
    out.innerHTML += `
      <dt>adapter</dt><dd>${[a.vendor, a.architecture, a.description].filter(Boolean).join(' · ') || 'not reported'}</dd>
      <dt>result</dt><dd class="${r.mismatches ? 'bad' : 'ok'}">${fmt(r.mismatches)} of ${fmt(r.cells)} cells differ</dd>
      <dt>mutation check</dt><dd class="${r.mutationCheck.detected ? 'ok' : 'bad'}">${fmt(r.mutationCheck.mismatches)} of ${fmt(r.mutationCheck.cells)} cells differ after a one-bit change (${r.mutationCheck.detected ? 'the check can fail' : 'not detected'})</dd>`;
  } catch (e) {
    out.innerHTML = `<dt>status</dt><dd class="bad">error: ${String(e.message || e)}</dd>`;
  }
});

reset();
