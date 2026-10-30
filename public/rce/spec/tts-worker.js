// Runs Kokoro-82M off the main thread. WebGPU with the fp32 model when the
// browser has a WebGPU adapter; otherwise WASM with the q8 model, using
// threads when the page is cross-origin isolated.
let modelP = null;
let info = null;
async function load(base, force) {
  self.KOKORO_VOICE_BASE = base + 'tts/voices/';
  const { KokoroTTS, env } = await import(base + 'tts/kokoro.web.js');
  const tf = env.transformers;
  tf.allowLocalModels = false;
  tf.remoteHost = base + 'tts/models/';
  tf.remotePathTemplate = '{model}/';
  env.wasmPaths = base + 'tts/ort/';
  let gpu = false;
  if (force !== 'wasm' && self.navigator.gpu) {
    try { gpu = !!(await self.navigator.gpu.requestAdapter()); } catch { gpu = false; }
  }
  const threads = self.crossOriginIsolated ? Math.max(1, Math.min(8, (self.navigator.hardwareConcurrency || 4) - 1)) : 1;
  tf.backends.onnx.wasm.numThreads = threads;
  let dtype = force && force !== 'wasm' && force !== 'webgpu' ? force : gpu ? 'fp32' : 'q8';
  let device = gpu ? 'webgpu' : 'wasm';
  const t0 = performance.now();
  let model, fellBack = null;
  try {
    model = await KokoroTTS.from_pretrained('Kokoro-82M-v1.0-ONNX', { dtype, device });
  } catch (err) {
    if (device !== 'webgpu') throw err;
    fellBack = String(err);
    device = 'wasm'; dtype = 'q8';
    model = await KokoroTTS.from_pretrained('Kokoro-82M-v1.0-ONNX', { dtype, device });
  }
  info = { device, dtype, threads: device === 'wasm' ? threads : null, isolated: self.crossOriginIsolated, loadMs: Math.round(performance.now() - t0), fellBack };
  return model;
}
self.onmessage = async (e) => {
  const { id, base, text, force } = e.data;
  try {
    modelP ||= load(base, force);
    const model = await modelP;
    if (text == null) { self.postMessage({ id, ready: true, info }); return; }
    const t0 = performance.now();
    const a = await model.generate(text, { voice: 'af_heart' });
    const ms = performance.now() - t0;
    self.postMessage({ id, audio: a.audio, rate: a.sampling_rate, ms, info }, [a.audio.buffer]);
  } catch (err) {
    modelP = null;
    self.postMessage({ id, error: String(err && err.stack || err) });
  }
};
