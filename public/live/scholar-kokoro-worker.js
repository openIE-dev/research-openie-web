// Sovereign Tier-C Local Voice Worker (`/__ASSET_REV__/scholar-kokoro-worker.js`)
// Runs `Kokoro-82M v1.0` on WebGPU (`onnxruntime-web` 1.30) + mandatory `Perth` STFT neural watermark
// (`32 kHz` Float32 PCM out) persisted in OPFS (`navigator.storage.getDirectory()`).
// Founder Rule (2026-10-12): Device robotic Web Speech TTS is NEVER used, and no speech leaves
// this worker without the cryptographic/perceptual Perth synthetic-speech mark.

const MARK_RATE = 32000;
const N = 2048;
const HOP = 320;
const BINS = N / 2 + 1;
const MIN_DB = -180;
const RANGE_DB = 195;
const WINDOW = Float64Array.from({ length: N }, (_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N));

// ── 1. Perth STFT / ISTFT & Neural Watermark (`perth.ts`) ──────────────────
const fft = (() => {
  const bits = Math.log2(N);
  const rev = Uint32Array.from({ length: N }, (_, i) => {
    let r = 0;
    for (let b = 0; b < bits; b++) r = (r << 1) | ((i >> b) & 1);
    return r;
  });
  const cos = Float64Array.from({ length: N / 2 }, (_, k) => Math.cos((2 * Math.PI * k) / N));
  const sin = Float64Array.from({ length: N / 2 }, (_, k) => Math.sin((2 * Math.PI * k) / N));
  return (re, im, inverse) => {
    for (let i = 0; i < N; i++) {
      const j = rev[i];
      if (j > i) {
        [re[i], re[j]] = [re[j], re[i]];
        [im[i], im[j]] = [im[j], im[i]];
      }
    }
    for (let size = 2; size <= N; size *= 2) {
      const half = size / 2;
      const step = N / size;
      for (let start = 0; start < N; start += size) {
        for (let j = 0; j < half; j++) {
          const wr = cos[j * step];
          const wi = inverse ? sin[j * step] : -sin[j * step];
          const a = start + j;
          const b = a + half;
          const tr = re[b] * wr - im[b] * wi;
          const ti = re[b] * wi + im[b] * wr;
          re[b] = re[a] - tr;
          im[b] = im[a] - ti;
          re[a] += tr;
          im[a] += ti;
        }
      }
    }
    if (inverse) {
      for (let i = 0; i < N; i++) {
        re[i] /= N;
        im[i] /= N;
      }
    }
  };
})();

function stft(x) {
  const pad = N / 2;
  const at = (i) => {
    const k = i < 0 ? -i : i >= x.length ? 2 * (x.length - 1) - i : i;
    return x[Math.min(Math.max(k, 0), x.length - 1)];
  };
  const frames = 1 + Math.floor(x.length / HOP);
  const re = new Float32Array(BINS * frames);
  const im = new Float32Array(BINS * frames);
  const fr = new Float64Array(N);
  const fi = new Float64Array(N);
  for (let t = 0; t < frames; t++) {
    for (let i = 0; i < N; i++) {
      fr[i] = at(t * HOP + i - pad) * WINDOW[i];
      fi[i] = 0;
    }
    fft(fr, fi, false);
    for (let f = 0; f < BINS; f++) {
      re[f * frames + t] = fr[f];
      im[f * frames + t] = fi[f];
    }
  }
  return { frames, re, im };
}

function magspec({ re, im }) {
  const out = new Float32Array(re.length);
  for (let i = 0; i < re.length; i++) {
    const mag = Math.max(Math.hypot(re[i], im[i]), 1e-9);
    out[i] = (20 * Math.log10(mag) - MIN_DB) / RANGE_DB;
  }
  return out;
}

function istft(re, im, frames) {
  const total = N + HOP * (frames - 1);
  const out = new Float64Array(total);
  const norm = new Float64Array(total);
  const fr = new Float64Array(N);
  const fi = new Float64Array(N);
  for (let t = 0; t < frames; t++) {
    for (let f = 0; f < BINS; f++) {
      fr[f] = re[f * frames + t];
      fi[f] = im[f * frames + t];
    }
    fi[0] = 0;
    fi[BINS - 1] = 0;
    for (let f = 1; f < BINS - 1; f++) {
      fr[N - f] = fr[f];
      fi[N - f] = -fi[f];
    }
    fft(fr, fi, true);
    for (let i = 0; i < N; i++) {
      out[t * HOP + i] += fr[i] * WINDOW[i];
      norm[t * HOP + i] += WINDOW[i] * WINDOW[i];
    }
  }
  const y = new Float32Array(HOP * (frames - 1));
  for (let i = 0; i < y.length; i++) {
    const k = i + N / 2;
    y[i] = norm[k] > 1e-11 ? out[k] / norm[k] : out[k];
  }
  return y;
}

async function applyPerthMark(x, encode) {
  if (x.length < N) {
    const padded = new Float32Array(N + HOP);
    padded.set(x);
    x = padded;
  }
  const spec = stft(x);
  const marked = await encode(magspec(spec), spec.frames);
  if (marked.length !== spec.re.length) throw new Error('Perth mark shape mismatch');
  const re = new Float32Array(spec.re.length);
  const im = new Float32Array(spec.im.length);
  for (let i = 0; i < re.length; i++) {
    const mag = 10 ** Math.min((marked[i] * RANGE_DB + MIN_DB) / 20, 10);
    const orig = Math.hypot(spec.re[i], spec.im[i]);
    re[i] = orig > 0 ? (mag * spec.re[i]) / orig : mag;
    im[i] = orig > 0 ? (mag * spec.im[i]) / orig : 0;
  }
  const y = istft(re, im, spec.frames);
  const out = new Float32Array(x.length);
  out.set(y.subarray(0, Math.min(y.length, x.length)));
  if (y.length < x.length) out.set(x.subarray(y.length), y.length);
  return out;
}

// ── 2. Blackman Windowed-Sinc Resampler (`24 kHz -> 32 kHz`, `resample.ts`) ─
function resample(x, from, to) {
  if (from === to) return x;
  const step = from / to;
  const half = Math.ceil(16 * Math.max(1, step));
  const width = 2 * half;
  const fc = (0.475 * Math.min(from, to)) / from;
  const phases = 256;
  const table = new Float32Array(phases * width);
  for (let p = 0; p < phases; p++) {
    let sum = 0;
    for (let k = 0; k < width; k++) {
      const d = k - half + 1 - p / phases;
      const sinc = d === 0 ? 2 * fc : Math.sin(2 * Math.PI * fc * d) / (Math.PI * d);
      const w = 0.42 + 0.5 * Math.cos((Math.PI * d) / half) + 0.08 * Math.cos((2 * Math.PI * d) / half);
      table[p * width + k] = sinc * w;
      sum += sinc * w;
    }
    for (let k = 0; k < width; k++) table[p * width + k] /= sum;
  }
  const n = Math.round((x.length * to) / from);
  const y = new Float32Array(n);
  for (let j = 0; j < n; j++) {
    const t = j * step;
    const c = Math.floor(t);
    const row = Math.floor((t - c) * phases) * width;
    const base = c - half + 1;
    let acc = 0;
    for (let k = 0; k < width; k++) {
      const i = base + k;
      if (i >= 0 && i < x.length) acc += x[i] * table[row + k];
    }
    y[j] = acc;
  }
  return y;
}

// ── 3. Single-Word Carrier & CMUdict/Rule G2P (`carrier.ts` + `g2p.ts`) ─────
const MAX_PHONEMES = 500;
const LETTERS = {
  a: 'ˈeɪ', b: 'bˈi', c: 'sˈi', d: 'dˈi', e: 'ˈi', f: 'ˈɛf', g: 'ʤˈi', h: 'ˈeɪʧ', i: 'ˈaɪ', j: 'ʤˈeɪ',
  k: 'kˈeɪ', l: 'ˈɛl', m: 'ˈɛm', n: 'ˈɛn', o: 'ˈoʊ', p: 'pˈi', q: 'kjˈu', r: 'ˈɑɹ', s: 'ˈɛs', t: 'tˈi',
  u: 'jˈu', v: 'vˈi', w: 'dˈʌbəlju', x: 'ˈɛks', y: 'wˈaɪ', z: 'zˈi',
};
const DIGITS = ['zˈiɹoʊ', 'wˈʌn', 'tˈu', 'θɹˈi', 'fˈɔɹ', 'fˈaɪv', 'sˈɪks', 'sˈɛvən', 'ˈeɪt', 'nˈaɪn'];
const VOICELESS = /[ptkfθsʃʧ]$/;
const PUNCT = new Set([',', '.', '!', '?', ';', ':', '—', '…', '(', ')', '“', '”', '"']);

function parseDict(text) {
  const dict = new Map();
  for (const line of text.split('\n')) {
    const tab = line.indexOf('\t');
    if (tab <= 0) continue;
    const word = line.slice(0, tab);
    if (!dict.has(word)) dict.set(word, line.slice(tab + 1).trim().replace(/#.*$/, ''));
  }
  return dict;
}

function spell(word) {
  return [...word.toLowerCase()].map((ch) => LETTERS[ch] ?? (/[0-9]/.test(ch) ? DIGITS[Number(ch)] : '')).filter(Boolean).join(' ');
}

function guess(w, look) {
  const s_ = (s) => s + (VOICELESS.test(s) ? 's' : 'z');
  const d_ = (s) => s + (/[td]$/.test(s) ? 'ɪd' : VOICELESS.test(s) ? 't' : 'd');
  const endings = [
    ["'s", s_], ['s', s_], ['es', (s) => s + 'ɪz'], ['ed', d_], ['d', d_], ['ing', (s) => s + 'ɪŋ'],
    ['ly', (s) => s + 'li'], ['er', (s) => s + 'əɹ'], ['ness', (s) => s + 'nəs'], ['al', (s) => s + 'əl'],
  ];
  for (const [end, add] of endings) {
    if (w.length > end.length + 2 && w.endsWith(end)) {
      const stem = w.slice(0, -end.length);
      const base = look(stem) ?? look(stem + 'e');
      if (base) return add(base);
    }
  }
  for (let i = 3; i <= w.length - 3; i++) {
    const a = look(w.slice(0, i));
    const b = look(w.slice(i));
    if (a && b) return `${a}${b.replace(/ˈ/g, 'ˌ')}`;
  }
  return null;
}

function textToIpa(rawText, dict) {
  const look = (w) => dict.get(w) ?? null;
  const out = [];
  const tokens = rawText.normalize('NFC').replace(/[’‘]/g, "'").replace(/[–]/g, '—').match(/[A-Za-zÀ-ÿ]+(?:'[A-Za-z]+)?|[0-9]+|[,.!?;:—…()“”"]/g) ?? [];
  for (const tok of tokens) {
    if (PUNCT.has(tok)) { out.push(tok); continue; }
    if (/^[0-9]+$/.test(tok)) { out.push([...tok].map((d) => DIGITS[Number(d)]).join(' ')); continue; }
    const lower = tok.toLowerCase();
    const acronym = tok.length > 1 && tok === tok.toUpperCase() && !look(lower);
    let ipa = acronym ? null : look(lower);
    if (!ipa) ipa = (acronym ? spell(tok) : guess(lower, look)) || spell(tok);
    out.push(ipa);
  }
  let s = '';
  for (const t of out) {
    if (PUNCT.has(t) && t !== '(' && t !== '“') s = s.trimEnd() + t + ' ';
    else s += t + ' ';
  }
  return s.trim();
}

function toKokoro(ipa, vocab) {
  const pairs = [['t͡ʃ', 'ʧ'], ['d͡ʒ', 'ʤ'], ['tʃ', 'ʧ'], ['dʒ', 'ʤ'], ['eɪ', 'A'], ['aɪ', 'I'], ['aʊ', 'W'], ['oʊ', 'O'], ['əʊ', 'Q'], ['ɔɪ', 'Y'], ['ɝ', 'ɜɹ'], ['ɚ', 'əɹ'], ['ː', '']];
  let s = ipa.trim().normalize('NFC');
  for (const [a, b] of pairs) s = s.split(a).join(b);
  let kept = '';
  for (const ch of s) if (ch in vocab || /\s/.test(ch)) kept += ch;
  return kept.split(/\s+/).filter(Boolean).join(' ');
}

function chunks(phonemes, max = MAX_PHONEMES) {
  const out = [];
  let rest = phonemes;
  while ([...rest].length > max) {
    const chars = [...rest];
    let cut = -1;
    for (let i = max; i > max / 2; i--) {
      if ('.!?;:,—'.includes(chars[i - 1]) && chars[i] === ' ') { cut = i; break; }
    }
    if (cut < 0) {
      for (let i = max; i > 0; i--) {
        if (chars[i] === ' ') { cut = i; break; }
      }
    }
    if (cut < 0) cut = max;
    out.push(chars.slice(0, cut).join('').trim());
    rest = chars.slice(cut).join('').trim();
  }
  if (rest) out.push(rest);
  return out;
}

const toIds = (phonemes, vocab) => [0, ...[...phonemes].map((c) => vocab[c]).filter((x) => x !== undefined), 0];

// ── 4. OPFS SHA-256 Verified Voice Pack Store & WebGPU Inference ─────────────
const ROOT = 'scholar_kokoro_voice';
const STYLE_ROWS = 510;
const STYLE_DIM = 256;
const post = (m, transfer = []) => postMessage(m, { transfer });
const textEnc = (s) => new TextEncoder().encode(s);
const hexOf = (b) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, '0')).join('');
const nameOf = (base) => base.split('/').filter(Boolean).pop();

let ort = null;
let gpuDevice = null;
let kokoro = null;
let marker = null;
let manifest = null;
let dict = null;
let home = null;
const styles = new Map();

async function modelDir(base, create) {
  try {
    const root = await (await navigator.storage.getDirectory()).getDirectoryHandle(ROOT, { create });
    return await root.getDirectoryHandle(nameOf(base), { create });
  } catch {
    return null;
  }
}

async function readJson(dir, name) {
  try {
    return JSON.parse(await (await (await dir.getFileHandle(name)).getFile()).text());
  } catch {
    return null;
  }
}

async function writeFile(dir, name, data) {
  const fh = await dir.getFileHandle(name, { create: true });
  if (fh.createSyncAccessHandle) {
    const h = await fh.createSyncAccessHandle();
    try {
      h.truncate(0);
      h.write(data, { at: 0 });
      h.flush();
    } finally {
      h.close();
    }
  } else if (fh.createWritable) {
    const w = await fh.createWritable();
    await w.write(data);
    await w.close();
  }
}

const bytesOf = async (dir, name) => new Uint8Array(await (await (await dir.getFileHandle(name)).getFile()).arrayBuffer());
const filesOf = (m) => [m.graph, ...m.data, m.dict, m.marker, ...m.voices];

async function fetchChecked(url, p) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const b = await r.arrayBuffer();
      if (b.byteLength !== p.bytes) throw new Error(`${p.file}: ${b.byteLength} != ${p.bytes}`);
      if (hexOf(await crypto.subtle.digest('SHA-256', b)) !== p.sha256) throw new Error(`${p.file}: SHA-256 mismatch`);
      return new Uint8Array(b);
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  throw last;
}

async function status(base) {
  const gpu = !!(navigator.gpu && (await navigator.gpu.requestAdapter().catch(() => null)));
  const dir = await modelDir(base, false);
  if (dir && (await readJson(dir, 'ok.json'))) {
    const m = await readJson(dir, 'manifest.json');
    if (m) return { type: 'status', state: 'ready', done: m.bytes, total: m.bytes, gpu };
  }
  const r = await fetch(`${base}manifest.json`);
  if (!r.ok) throw new Error(`manifest HTTP ${r.status}`);
  const m = await r.json();
  const have = new Set(dir ? ((await readJson(dir, 'parts.json')) ?? []) : []);
  const done = filesOf(m).filter((p) => have.has(p.sha256)).reduce((s, p) => s + p.bytes, 0);
  return { type: 'status', state: done ? 'partial' : 'absent', done, total: m.bytes, gpu };
}

async function download(base) {
  const r = await fetch(`${base}manifest.json`);
  if (!r.ok) throw new Error(`manifest HTTP ${r.status}`);
  const m = await r.json();
  await navigator.storage.persist?.().catch(() => false);
  const dir = await modelDir(base, true);
  const have = new Set((await readJson(dir, 'parts.json')) ?? []);
  let done = 0;
  for (const p of filesOf(m)) {
    const there = have.has(p.sha256) && (await dir.getFileHandle(p.file).then((h) => h.getFile()).then((f) => f.size === p.bytes, () => false));
    if (!there) {
      await writeFile(dir, p.file, await fetchChecked(`${base}${p.file}`, p));
      have.add(p.sha256);
      await writeFile(dir, 'parts.json', textEnc(JSON.stringify([...have])));
    }
    done += p.bytes;
    post({ type: 'progress', done, total: m.bytes });
  }
  await writeFile(dir, 'manifest.json', textEnc(JSON.stringify(m)));
  await writeFile(dir, 'ok.json', textEnc(JSON.stringify({ model: m.model, bytes: m.bytes })));
  post({ type: 'downloaded', bytes: m.bytes });
}

async function load(base, vendor) {
  const t0 = performance.now();
  const jspi = typeof WebAssembly.Suspending === 'function';
  if (kokoro && marker && manifest) {
    return { type: 'loaded', ms: 0, voices: manifest.voices.map(({ id, name, lang }) => ({ id, name, lang })) };
  }
  if (!ort) {
    const runtime = await import(`${vendor}${jspi ? 'ort.jspi.bundle.min.mjs' : 'ort.webgpu.bundle.min.mjs'}`);
    runtime.env.wasm.wasmPaths = { wasm: `${vendor}ort-wasm-simd-threaded.${jspi ? 'jspi' : 'asyncify'}.wasm` };
    runtime.env.wasm.numThreads = 1;
    runtime.env.logLevel = 'error';
    ort = runtime;
  }
  const dir = await modelDir(base, false);
  const m = dir && (await readJson(dir, 'ok.json')) ? await readJson(dir, 'manifest.json') : null;
  if (!m) throw new Error('Kokoro voice pack not downloaded in OPFS yet');

  const urls = [];
  try {
    const adapter = navigator.gpu && (await navigator.gpu.requestAdapter());
    const useGpu = !!adapter;
    let epList = ['wasm'];
    if (useGpu) {
      const requiredLimits = {};
      for (const k in adapter.limits) if (typeof adapter.limits[k] === 'number') requiredLimits[k] = adapter.limits[k];
      gpuDevice = await adapter.requestDevice({ requiredFeatures: [...adapter.features], requiredLimits }).catch(() => adapter.requestDevice());
      epList = [{ name: 'webgpu', device: gpuDevice }];
    }
    const opts = { executionProviders: epList, graphOptimizationLevel: 'all', logSeverityLevel: 3 };
    const externalData = [];
    for (const d of m.data) {
      const u = URL.createObjectURL(await (await dir.getFileHandle(d.file)).getFile());
      urls.push(u);
      externalData.push({ path: d.name, data: u });
    }
    kokoro = await ort.InferenceSession.create(await bytesOf(dir, m.graph.file), { ...opts, externalData });
    marker = await ort.InferenceSession.create(await bytesOf(dir, m.marker.file), opts);
    dict = parseDict(new TextDecoder().decode(await bytesOf(dir, m.dict.file)));
    manifest = m;
    home = dir;
    return { type: 'loaded', ms: Math.round(performance.now() - t0), voices: m.voices.map(({ id, name, lang }) => ({ id, name, lang })) };
  } finally {
    for (const u of urls) URL.revokeObjectURL(u);
  }
}

async function styleOf(id) {
  const v = manifest.voices.find((x) => x.id === id) ?? manifest.voices.find((x) => x.default) ?? manifest.voices[0];
  let s = styles.get(v.id);
  if (!s) {
    const buf = await bytesOf(home, v.file);
    s = new Float32Array(buf.buffer.slice(buf.byteOffset + v.headerBytes, buf.byteOffset + buf.byteLength));
    styles.set(v.id, s);
  }
  return s;
}

async function synthChunk(phonemes, style, speed) {
  const ids = toIds(phonemes, manifest.vocab);
  const row = Math.min(Math.max([...phonemes].length, 1) - 1, STYLE_ROWS - 1);
  const out = await kokoro.run({
    input_ids: new ort.Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
    style: new ort.Tensor('float32', style.slice(row * STYLE_DIM, (row + 1) * STYLE_DIM), [1, STYLE_DIM]),
    speed: new ort.Tensor('float32', Float32Array.of(speed), [1]),
  });
  const audio = Float32Array.from(await out[kokoro.outputNames[0]].getData());
  for (const t of Object.values(out)) t.dispose?.();
  return audio;
}

async function encodeMark(mag, frames) {
  const input = new ort.Tensor('float32', mag, [1, BINS, frames]);
  const result = await marker.run({ magspec: input });
  const data = Float32Array.from(await result.out.getData());
  input.dispose?.();
  result.out.dispose?.();
  return data;
}

async function say(id, line, speedIn, voice) {
  if (!ort || !kokoro || !marker || !manifest || !dict) throw new Error('Kokoro WebGPU voice not loaded');
  const t0 = performance.now();
  const speed = Math.min(Math.max(Number(speedIn) || 1.04, 0.75), 1.35);
  const parts = chunks(toKokoro(textToIpa(line, dict), manifest.vocab));
  if (!parts.length) {
    return post({ type: 'said', id, pcm: new Float32Array(0), sampleRate: MARK_RATE, ms: 0 });
  }
  const style = await styleOf(voice);
  const pieces = [];
  for (const p of parts) pieces.push(await synthChunk(p, style, speed));
  const speech = new Float32Array(pieces.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of pieces) { speech.set(p, at); at += p.length; }
  const at32 = resample(speech, manifest.sampleRate, MARK_RATE);
  // Mandatory Perth synthetic-speech watermark — throws if mark fails.
  const pcm = await applyPerthMark(at32, encodeMark);
  post({ type: 'said', id, pcm, sampleRate: MARK_RATE, ms: Math.round(performance.now() - t0), perthMarked: true }, [pcm.buffer]);
}

let queue = Promise.resolve();
self.onmessage = (e) => {
  const m = e.data || {};
  queue = queue.then(async () => {
    try {
      if (m.type === 'status') post(await status(m.base));
      else if (m.type === 'download') await download(m.base);
      else if (m.type === 'load') post(await load(m.base, m.vendor));
      else if (m.type === 'say') await say(m.id, m.text, m.speed, m.voice);
    } catch (err) {
      post({ type: 'error', id: m.id, message: String(err?.message || err) });
    }
  });
};
