// Sovereign In-Browser Neural Speech-to-Text Worker (Tier 2 Fallback & Opt-In Mode).
// Runs onnx-community/whisper-tiny.en via @huggingface/transformers@3.5.1 (WebGPU or q8 WASM)
// on 16 kHz mono Float32Array utterances captured by WebAudio when SpeechRecognition is
// unavailable (e.g. Firefox / Linux Chromium) or when the user enables Neural Whisper ONNX STT.

const TF_CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1';
const MODEL_ID = 'onnx-community/whisper-tiny.en';

let asrPromise = null;
let asrInfo = null;
let transcribeChain = Promise.resolve();

function postProgress(p) {
  try {
    self.postMessage({
      type: 'progress',
      engine: 'whisper-stt',
      status: p?.status || 'loading',
      file: p?.file || '',
      progress: typeof p?.progress === 'number' ? p.progress : null,
      loaded: p?.loaded ?? null,
      total: p?.total ?? null,
    });
  } catch {
    // Ignore serialization errors
  }
}

async function initAsr(forceDevice) {
  const t0 = performance.now();
  const { pipeline, env } = await import(TF_CDN);
  env.allowLocalModels = false;
  const threads = self.crossOriginIsolated
    ? Math.max(1, Math.min(8, (self.navigator?.hardwareConcurrency || 4) - 1))
    : 1;
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.numThreads = threads;
  }

  let useGpu = false;
  if (forceDevice !== 'wasm' && self.navigator?.gpu) {
    try {
      const adapter = await self.navigator.gpu.requestAdapter();
      useGpu = !!adapter;
    } catch {
      useGpu = false;
    }
  }

  let device = useGpu ? 'webgpu' : 'wasm';
  let fellBack = null;
  let transcriber = null;

  try {
    transcriber = await pipeline('automatic-speech-recognition', MODEL_ID, {
      device,
      dtype: device === 'webgpu'
        ? { encoder_model: 'fp32', decoder_model_merged: 'q4' }
        : { encoder_model: 'q8', decoder_model_merged: 'q8' },
      progress_callback: postProgress,
    });
  } catch (err) {
    if (device !== 'webgpu') throw err;
    fellBack = String(err);
    device = 'wasm';
    transcriber = await pipeline('automatic-speech-recognition', MODEL_ID, {
      device: 'wasm',
      dtype: { encoder_model: 'q8', decoder_model_merged: 'q8' },
      progress_callback: postProgress,
    });
  }

  asrInfo = {
    model: MODEL_ID,
    device,
    threads: device === 'wasm' ? threads : null,
    loadMs: Math.round(performance.now() - t0),
    fellBack,
  };
  return transcriber;
}

self.onmessage = async (e) => {
  const { id, type, audio, forceDevice } = e.data || {};
  try {
    asrPromise ||= initAsr(forceDevice);
    const transcriber = await asrPromise;
    if (type === 'warmup' || !audio) {
      self.postMessage({ id, ready: true, info: asrInfo });
      return;
    }
    const pcm = audio instanceof Float32Array ? audio : new Float32Array(audio);
    const job = transcribeChain.then(async () => {
      const t0 = performance.now();
      const out = await transcriber(pcm, {
        chunk_length_s: 20,
        stride_length_s: 3,
        return_timestamps: false,
      });
      const text = String(out?.text || '').trim();
      const ms = Math.round(performance.now() - t0);
      self.postMessage({ id, text, ms, info: asrInfo });
    });
    transcribeChain = job.catch(() => {});
    await job;
  } catch (err) {
    if (!asrInfo) asrPromise = null;
    self.postMessage({ id, error: String((err && err.stack) || err) });
  }
};
