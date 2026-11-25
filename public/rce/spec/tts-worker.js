// Runs Kokoro-82M off the main thread. WebGPU with the fp32 model when the
// browser has a WebGPU adapter; otherwise WASM with the q8 model, using
// threads when the page is cross-origin isolated.
// Supports 4 staged sovereign voices (af_heart, af_bella, am_adam, bm_george)
// and configurable speech speed while staying 100% backward-compatible with notebook.js.
let modelP = null;
let info = null;
let genChain = Promise.resolve();

const DEFAULT_VOICE = 'af_heart';
const STAGED_VOICES = new Set(['af_heart', 'af_bella', 'am_adam', 'bm_george']);

function emitProgress(payload) {
  try {
    self.postMessage({
      type: 'progress',
      status: payload?.status || 'loading',
      file: payload?.file || '',
      progress: typeof payload?.progress === 'number' ? payload.progress : null,
      loaded: payload?.loaded ?? null,
      total: payload?.total ?? null,
    });
  } catch {
    // Ignore progress serialization errors
  }
}

async function load(base, force) {
  const resolvedBase = base || (self.location.origin + '/rce/spec/');
  self.KOKORO_VOICE_BASE = resolvedBase + 'tts/voices/';
  const { KokoroTTS, env } = await import(resolvedBase + 'tts/kokoro.web.js');
  const tf = env.transformers;
  tf.allowLocalModels = false;
  tf.remoteHost = resolvedBase + 'tts/models/';
  tf.remotePathTemplate = '{model}/';
  env.wasmPaths = resolvedBase + 'tts/ort/';
  let gpu = false;
  if (force !== 'wasm' && self.navigator.gpu) {
    try { gpu = !!(await self.navigator.gpu.requestAdapter()); } catch { gpu = false; }
  }
  const threads = self.crossOriginIsolated ? Math.max(1, Math.min(8, (self.navigator.hardwareConcurrency || 4) - 1)) : 1;
  tf.backends.onnx.wasm.numThreads = threads;
  let dtype = force && force !== 'wasm' && force !== 'webgpu' ? force : gpu ? 'fp16' : 'q8';
  let device = gpu ? 'webgpu' : 'wasm';
  const t0 = performance.now();
  let model, fellBack = null;
  try {
    model = await KokoroTTS.from_pretrained('Kokoro-82M-v1.0-ONNX', {
      dtype,
      device,
      progress_callback: emitProgress,
    });
  } catch (err) {
    if (device !== 'webgpu') throw err;
    fellBack = String(err);
    device = 'wasm';
    dtype = 'q8';
    model = await KokoroTTS.from_pretrained('Kokoro-82M-v1.0-ONNX', {
      dtype,
      device,
      progress_callback: emitProgress,
    });
  }
  info = {
    device,
    dtype,
    threads: device === 'wasm' ? threads : null,
    isolated: self.crossOriginIsolated,
    loadMs: Math.round(performance.now() - t0),
    voices: Array.from(STAGED_VOICES),
    fellBack,
  };
  return model;
}

function resolveVoice(model, requested) {
  if (!requested || typeof requested !== 'string') return DEFAULT_VOICE;
  const clean = requested.trim();
  if (STAGED_VOICES.has(clean)) return clean;
  if (model?.voices && Object.prototype.hasOwnProperty.call(model.voices, clean)) return clean;
  return DEFAULT_VOICE;
}

function resolveSpeed(requested) {
  const n = Number(requested);
  if (!Number.isFinite(n) || n <= 0) return 1.0;
  return Math.min(2.0, Math.max(0.5, n));
}

self.onmessage = async (e) => {
  const { id, base, text, voice, speed, force } = e.data || {};
  try {
    modelP ||= load(base, force);
    const model = await modelP;
    if (text == null) {
      self.postMessage({ id, ready: true, info });
      return;
    }
    const usedVoice = resolveVoice(model, voice);
    const usedSpeed = resolveSpeed(speed);
    const run = genChain.then(async () => {
      const t0 = performance.now();
      const a = await model.generate(String(text), { voice: usedVoice, speed: usedSpeed });
      const ms = performance.now() - t0;
      self.postMessage(
        { id, audio: a.audio, rate: a.sampling_rate, voice: usedVoice, speed: usedSpeed, ms, info },
        [a.audio.buffer]
      );
    });
    genChain = run.catch(() => {});
    await run;
  } catch (err) {
    if (!info) modelP = null;
    self.postMessage({ id, error: String((err && err.stack) || err) });
  }
};
