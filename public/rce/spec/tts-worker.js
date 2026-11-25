// Runs Kokoro-82M off the main thread using WASM q8 (never WebGPU half-precision, which
// overflows 16-bit floats inside SineGen / iSTFT vocoder layers on Apple Silicon Metal).
// Supports 4 staged voices (af_heart, af_bella, am_adam, bm_george) and speed.
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
  } catch {}
}

async function load(base) {
  const resolvedBase = base || (self.location.origin + '/rce/spec/');
  self.KOKORO_VOICE_BASE = resolvedBase + 'tts/voices/';
  const { KokoroTTS, env } = await import(resolvedBase + 'tts/kokoro.web.js');
  const tf = env.transformers;
  tf.allowLocalModels = false;
  tf.remoteHost = resolvedBase + 'tts/models/';
  tf.remotePathTemplate = '{model}/';
  env.wasmPaths = resolvedBase + 'tts/ort/';
  const threads = self.crossOriginIsolated
    ? Math.max(1, Math.min(8, (self.navigator.hardwareConcurrency || 4) - 1))
    : 1;
  tf.backends.onnx.wasm.numThreads = threads;
  tf.backends.onnx.logLevel = 'error';
  const device = 'wasm';
  const dtype = 'q8';
  const t0 = performance.now();
  const model = await KokoroTTS.from_pretrained('Kokoro-82M-v1.0-ONNX', {
    dtype,
    device,
    session_options: { logSeverityLevel: 3 },
    progress_callback: emitProgress,
  });
  info = {
    device,
    dtype,
    threads,
    isolated: self.crossOriginIsolated,
    loadMs: Math.round(performance.now() - t0),
    voices: Array.from(STAGED_VOICES),
    fellBack: null,
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
  const { id, base, text, voice, speed } = e.data || {};
  try {
    modelP ||= load(base);
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
