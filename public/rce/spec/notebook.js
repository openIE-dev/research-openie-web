// RCE spec notebook: editable cells checked by rce-check (Rust, compiled to wasm32),
// and read-aloud of the plain-language text with Kokoro-82M running in the browser.
const BASE = '/rce/spec/';
const KW = new Set(JSON.parse(document.getElementById('rce-keywords')?.textContent || '[]'));
const TYPES = new Set(['bool','i8','i16','i32','i64','u8','u16','u32','u64','usize','f64','f32','text','List','Map','Set','Box']);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Highlighting: the RCE tree-sitter grammar compiled to WebAssembly (web-tree-sitter).
// Until it has loaded, or if it cannot load, a keyword tokenizer is used.
let tsParser = null;
const tsReady = (async () => {
  try {
    const { Parser, Language } = await import(BASE + 'ts/web-tree-sitter.js');
    await Parser.init({ locateFile: () => BASE + 'ts/web-tree-sitter.wasm' });
    const lang = await Language.load(BASE + 'ts/tree-sitter-rce.wasm');
    const p = new Parser();
    p.setLanguage(lang);
    tsParser = p;
    return true;
  } catch (e) {
    console.warn('tree-sitter highlighter unavailable, using the keyword tokenizer', e);
    return false;
  }
})();
function gapHtml(t) {
  return t.split(/(#[^\n]*)/).map((x, i) => (i % 2 ? `<span class="t-com">${esc(x)}</span>` : esc(x))).join('');
}
function tsHighlight(src) {
  // The tree-sitter port's scanner needs a final newline (the spec's layout pass adds one at end of file, 2.6).
  const tree = tsParser.parse(src.endsWith('\n') ? src : src + '\n');
  const leaves = [];
  const walk = (n, inErr) => {
    const err = inErr || n.type === 'ERROR' || n.isMissing;
    if (n.childCount === 0) { leaves.push([n, err]); return; }
    for (let i = 0; i < n.childCount; i++) walk(n.child(i), err);
  };
  walk(tree.rootNode, false);
  let out = '', pos = 0;
  for (const [n, err] of leaves) {
    if (n.startIndex < pos || n.endIndex <= n.startIndex) continue;
    out += gapHtml(src.slice(pos, n.startIndex));
    const text = src.slice(n.startIndex, n.endIndex);
    const par = n.parent?.type || '', gp = n.parent?.parent?.type || '';
    let cls = '';
    if (n.type === 'STRING') cls = 't-str';
    else if (n.type === 'INT' || n.type === 'FLOAT') cls = 't-num';
    else if (n.type === 'NAME') cls = par === 'path' && /type/.test(gp) ? 't-ty' : TYPES.has(text) ? 't-ty' : /^[A-Z]/.test(text) ? 't-name' : '';
    else if (/^[a-z_]+$/.test(n.type) || /^[A-Z]+$/.test(n.type) && n.type !== 'NAME') cls = /^[a-z]/.test(text) ? 't-kw' : '';
    if (err) cls += ' t-err';
    out += cls.trim() ? `<span class="${cls.trim()}">${esc(text)}</span>` : esc(text);
    pos = n.endIndex;
  }
  out += gapHtml(src.slice(pos));
  tree.delete();
  return out;
}
function highlight(src) {
  if (tsParser) { try { return tsHighlight(src); } catch (e) { /* fall through */ } }
  return kwHighlight(src);
}
function kwHighlight(src) {
  const re = /(#[^\n]*)|("(?:\\.|[^"\\\n])*"?)|(\b0x[0-9a-fA-F_]+\b|\b0b[01_]+\b|\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([^A-Za-z_0-9#"]+)/g;
  let out = '', m;
  while ((m = re.exec(src))) {
    if (m[1]) out += `<span class="t-com">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="t-str">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="t-num">${esc(m[3])}</span>`;
    else if (m[4]) {
      const w = m[4];
      out += KW.has(w) ? `<span class="t-kw">${w}</span>` : TYPES.has(w) ? `<span class="t-ty">${w}</span>` : /^[A-Z]/.test(w) ? `<span class="t-name">${w}</span>` : w;
    } else out += esc(m[5]);
  }
  return out;
}

// ---------- checker ----------
let checkerP = null;
function checker() {
  checkerP ||= import(BASE + 'wasm/rce_spec_check_wasm.js').then(async (m) => { await m.default({ module_or_path: BASE + 'wasm/rce_spec_check_wasm_bg.wasm' }); return m; });
  return checkerP;
}

function renderResult(cell, r) {
  const want = cell.dataset.expect;
  const wantRule = cell.dataset.expectRule || '';
  const got = r.ok ? 'accepted' : 'refused';
  let h = '';
  if (r.ok) h += `<p class="nb-badge ok">Accepted. It parses, type-checks, and every example and check in it holds.</p>`;
  else {
    const stage = { parse: 'parsing', check: 'type and well-formedness checking', admit: 'admission (examples, checks, comptime and constants are evaluated)' }[r.stage] || r.stage;
    h += `<p class="nb-badge bad">Refused during ${esc(stage)}.</p><ul class="nb-errs">`;
    for (const e of r.errors) h += `<li>${e.rule ? `<code class="nb-rule">${esc(e.rule)}</code> ` : ''}${esc(e.msg)}</li>`;
    h += '</ul>';
  }
  if (want) {
    const firstRule = r.errors[0]?.rule || '';
    const same = want === got && (want === 'accepted' || !wantRule || wantRule === firstRule);
    h += `<p class="nb-match ${same ? 'ok' : 'bad'}">${same ? 'Matches the expected result.' : `Differs from the expected result (${esc(want)}${wantRule ? ' by ' + esc(wantRule) : ''}).`}</p>`;
  }
  if (r.examples?.length) {
    h += '<div class="nb-traces"><p class="nb-sub">Examples evaluated event by event (state after each event):</p>';
    for (const ex of r.examples) {
      h += `<table class="nb-trace"><caption>example on line ${ex.line}</caption><thead><tr><th scope="col">event</th><th scope="col">result</th></tr></thead><tbody>`;
      for (const s of ex.steps) {
        const st = s.state ? Object.entries(s.state).map(([rg, fs]) => `${esc(rg)} { ${Object.entries(fs).map(([k, v]) => `${esc(k)}: ${esc(v)}`).join(', ')} }`).join('; ') : `refused: ${esc(s.refused)}`;
        h += `<tr${s.refused ? ' class="refused"' : ''}><td><code>${esc(s.event)}</code></td><td>${st}</td></tr>`;
      }
      h += '</tbody></table>';
    }
    h += '</div>';
  }
  if (r.form) {
    h += `<details class="nb-json nb-form"><summary>Form JSON: P = (S, E, δ, D, λ) of this program (spec 6.1)</summary><pre>${esc(JSON.stringify(r.form, null, 2))}</pre></details>`;
  }
  cell.querySelector('.nb-out').innerHTML = h;
}

async function run(cell) {
  const out = cell.querySelector('.nb-out');
  out.innerHTML = '<p class="nb-busy">Checking with rce-check (WebAssembly)...</p>';
  try {
    const m = await checker();
    const t0 = performance.now();
    const r = JSON.parse(m.check_with(cell.querySelector('textarea').value, cell.dataset.known || ''));
    renderResult(cell, r);
    out.insertAdjacentHTML('beforeend', `<p class="nb-time">rce-check ran in ${(performance.now() - t0).toFixed(1)} ms in this browser.</p>`);
  } catch (e) {
    out.innerHTML = `<p class="nb-badge bad">The checker could not run here: ${esc(String(e))}</p>`;
  }
}

for (const cell of document.querySelectorAll('.nb-code')) {
  const ta = cell.querySelector('textarea');
  const code = cell.querySelector('.nb-hl code');
  const sync = () => {
    code.innerHTML = highlight(ta.value) + '\n';
    ta.rows = ta.value.split('\n').length;
  };
  let escaped = false;
  ta.addEventListener('input', sync);
  ta.addEventListener('scroll', () => { cell.querySelector('.nb-hl').scrollLeft = ta.scrollLeft; });
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { escaped = true; return; }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(cell); return; }
    if (e.key === 'Tab' && !escaped && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart: a, selectionEnd: b } = ta;
      ta.setRangeText('    ', a, b, 'end');
      sync();
    }
    escaped = false;
  });
  cell.querySelector('.nb-run').addEventListener('click', () => run(cell));
  cell.querySelector('.nb-reset').addEventListener('click', () => { ta.value = ta.defaultValue; sync(); cell.querySelector('.nb-out').innerHTML = ''; });
}

tsReady.then((ok) => {
  if (!ok) return;
  for (const cell of document.querySelectorAll('.nb-code')) {
    cell.querySelector('.nb-hl code').innerHTML = highlight(cell.querySelector('textarea').value) + '\n';
    cell.dataset.hl = 'tree-sitter';
  }
});

document.getElementById('nb-expand')?.addEventListener('click', (e) => {
  const open = e.currentTarget.getAttribute('aria-pressed') !== 'true';
  e.currentTarget.setAttribute('aria-pressed', String(open));
  e.currentTarget.textContent = open ? 'Collapse formal cells' : 'Expand formal cells';
  document.querySelectorAll('details.nb-formal').forEach((d) => (d.open = open));
});

// ---------- read aloud (Kokoro-82M, loaded only on first click) ----------
let worker = null, reqN = 0, playing = null;
const pending = new Map();
function ttsCall(text) {
  if (!worker) {
    worker = new Worker(BASE + 'tts-worker.js', { type: 'module' });
    worker.onmessage = (e) => { const p = pending.get(e.data.id); pending.delete(e.data.id); if (!p) return; e.data.error ? p.rej(new Error(e.data.error)) : p.res(e.data); };
  }
  const id = ++reqN;
  return new Promise((res, rej) => { pending.set(id, { res, rej }); worker.postMessage({ id, base: location.origin + BASE, text, force: new URLSearchParams(location.search).get('tts') || undefined }); });
}
let ready = false, ttsInfo = null;
async function tts(status) {
  if (!ready) {
    status('Loading the Kokoro-82M voice model (first time only: about 330 MB with WebGPU, 90 MB without)...');
    const r = await ttsCall(null);
    ttsInfo = r.info; ready = true;
  }
  return { info: ttsInfo, generate: (t) => ttsCall(t).then((r) => ({ audio: r.audio, sampling_rate: r.rate, ms: r.ms })) };
}

function speakable(root) {
  const parts = [];
  for (const el of root.querySelectorAll('.tts-text h1, .tts-text h2, .tts-text h3, .tts-text p, .tts-text li, .tts-text th, .tts-text td')) {
    if (el.closest('.nb-cell, pre, .katex, .nb-receipt, .nb-out, nav, li li')) continue;
    if (el.tagName === 'TD' || el.tagName === 'TH') continue;
    const c = el.cloneNode(true);
    c.querySelectorAll('ul, ol, .katex').forEach((x) => x.remove());
    c.querySelectorAll('code').forEach((x) => { x.replaceWith(/^[A-Za-z][A-Za-z0-9 ]{0,15}$/.test(x.textContent) ? x.textContent : ''); });
    const t = c.textContent.replace(/\s+/g, ' ').replace(/\(\s*\)/g, '').trim();
    if (t) parts.push(t);
  }
  return parts.join('\n');
}
function sentences(text) {
  const out = [];
  for (const para of text.split('\n')) {
    let buf = '';
    for (const s of para.match(/[^.!?;:]+[.!?;:]*\s*/g) || []) {
      if ((buf + s).length > (out.length ? 220 : 110) && buf) { out.push(buf.trim()); buf = ''; }
      buf += s;
    }
    if (buf.trim()) out.push(buf.trim());
  }
  return out;
}

async function speak(btn) {
  const status = (m) => { const s = btn.parentElement.querySelector('.tts-status') || document.getElementById('tts-status'); if (s) s.textContent = m; };
  if (playing) { const was = playing.btn; playing.stop(); if (was === btn) return; }
  const root = document.getElementById(btn.dataset.target) || document.querySelector('main');
  const text = speakable(root);
  if (!text) { status('No plain-language text to read here.'); return; }
  let stopped = false, src = null;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  playing = { btn, stop() { stopped = true; try { src?.stop(); } catch {} ctx.close(); btn.setAttribute('aria-pressed', 'false'); btn.querySelector('.tts-l').textContent = btn.dataset.label; status(''); playing = null; } };
  btn.setAttribute('aria-pressed', 'true');
  btn.querySelector('.tts-l').textContent = 'Stop';
  try {
    const model = await tts(status);
    const chunks = sentences(text);
    let next = model.generate(chunks[0]);
    for (let i = 0; i < chunks.length && !stopped; i++) {
      status(i === 0 ? 'Generating speech...' : `Reading ${i + 1} of ${chunks.length}`);
      const audio = await next;
      status(`Reading ${i + 1} of ${chunks.length} (${model.info.device === 'webgpu' ? 'WebGPU' : 'WebAssembly' + (model.info.threads > 1 ? ', ' + model.info.threads + ' threads' : '')})`);
      if (i + 1 < chunks.length) next = model.generate(chunks[i + 1]);
      if (stopped) break;
      const buf = ctx.createBuffer(1, audio.audio.length, audio.sampling_rate);
      buf.copyToChannel(audio.audio, 0);
      await new Promise((res) => { src = ctx.createBufferSource(); src.buffer = buf; src.connect(ctx.destination); src.onended = res; src.start(); });
    }
    if (!stopped) playing?.stop();
  } catch (e) {
    status('Read-aloud could not start: ' + e);
    playing?.stop();
  }
}
for (const b of document.querySelectorAll('.tts-btn')) {
  b.dataset.label = b.querySelector('.tts-l').textContent;
  b.addEventListener('click', () => speak(b));
}
window.__rceSpec = { checker, tts, speakable, sentences };
