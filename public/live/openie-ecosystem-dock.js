// OpenIE Universal Cross-Origin Sovereign Multimodal SDK (openie-ecosystem-dock.js)
// 100% Self-Contained Zero-Paid-API ES Module with Shadow DOM Scoped CSS for all *.openie.dev Portals.
// - Same-Origin Blob Module Workers & AudioWorklet (Kokoro-82M Neural TTS, Whisper-Tiny.en ONNX STT, SmolVLM-256M Vision)
// - Full-Duplex 300-3400 Hz Spectral VAD (<100ms True Barge-In) + 60fps Canvas2D Harmonic Plasma Orb
// - Surface-Aware Grounding: 28 Research Studies (research.openie.dev) + 57 Chronicle Entries (blog.openie.dev) + Live Sister-Page DOM
// - Scientific Honesty Contract: Signed Provenance · Self-Checked | measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered

const RESEARCH_ORIGIN = 'https://research.openie.dev';
const BLOG_ORIGIN = 'https://blog.openie.dev';
const RESEARCH_CORPUS_URL = `${RESEARCH_ORIGIN}/live/hmi-corpus.json`;
const BLOG_CORPUS_URL = `${BLOG_ORIGIN}/live/blog-corpus.json`;
const KOKORO_MODULE_URL = `${RESEARCH_ORIGIN}/rce/spec/tts/kokoro.web.js`;
const KOKORO_VOICE_BASE = `${RESEARCH_ORIGIN}/rce/spec/tts/voices/`;
const KOKORO_ORT_BASE = `${RESEARCH_ORIGIN}/rce/spec/tts/ort/`;
const KOKORO_MODELS_BASE = `${RESEARCH_ORIGIN}/rce/spec/tts/models/`;
const TF_ESM_CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/+esm';

export const VOICE_PERSONAS = {
  af_heart: {
    id: 'af_heart',
    name: 'Heart',
    role: 'Systems Lead',
    accent: 'US Female · Kokoro-82M',
    color: '#F59E0B',
    pitch: 1.04,
    lang: 'en-US',
  },
  bm_george: {
    id: 'bm_george',
    name: 'George',
    role: 'Outside-Review Skeptic',
    accent: 'UK Male · Kokoro-82M',
    color: '#00D4AA',
    pitch: 0.92,
    lang: 'en-GB',
  },
  af_bella: {
    id: 'af_bella',
    name: 'Bella',
    role: 'Empirical Co-Pilot',
    accent: 'US Female · Kokoro-82M',
    color: '#34D399',
    pitch: 1.08,
    lang: 'en-US',
  },
  am_adam: {
    id: 'am_adam',
    name: 'Adam',
    role: 'Hardware Architect',
    accent: 'US Male · Kokoro-82M',
    color: '#818CF8',
    pitch: 0.95,
    lang: 'en-US',
  },
};

export const SURFACE_PROFILES = {
  avalanche: {
    id: 'avalanche',
    name: 'OpenIE Avalanche',
    domain: 'avalanche.openie.dev',
    tagline: '9-Rung Signal Ratchet · DES-10 Multi-Paradigm Routing & Forecast',
    primaryStudyId: 'communication-avalanche',
    studyIds: ['communication-avalanche', 'eco-avalanche', 'lut-adapt', 'deterministic-null', 'rce-jepa', 'latency'],
    prompts: [
      'Walk me through this Avalanche page section by section',
      'Debate DES-10 98/100 and the 1% gate escape like a skeptic',
      'How do the 927.3 uJ Jetson Thor shunt and desktop latencies separate?',
    ],
  },
  stack: {
    id: 'stack',
    name: 'OpenIE Stack',
    domain: 'stack.openie.dev',
    tagline: 'Three Altitudes · Information, Game & Mechanism Substrate',
    primaryStudyId: 'eco-stack',
    studyIds: ['eco-stack', 'agency', 'gates', 'three-body', 'satiation', 'interface-economics'],
    prompts: [
      'Tour the active Stack sections and visual proofs',
      'Debate this portal with the Outside-Review Skeptic',
      'How are measured_j, reported_j, est_j, and unmetered kept orthogonal?',
    ],
  },
  compute: {
    id: 'compute',
    name: 'OpenIE Compute',
    domain: 'compute.openie.dev',
    tagline: '258 Primitives · LUT6 Boolean Circuits & Hardware Energy Counters',
    primaryStudyId: 'eco-compute',
    studyIds: ['eco-compute', 'rce-compile', 'satb-harness', 'lut-adapt', 'mei', 'jouleos'],
    prompts: [
      'Walk me through the Compute primitives on this page',
      'Debate LUT6 compilation vs floating-point baselines',
      'What physical shunt sensors anchor the hardware runs?',
    ],
  },
  synthesis: {
    id: 'synthesis',
    name: 'OpenIE Synthesis',
    domain: 'synthesis.openie.dev',
    tagline: 'Energy-Ordered Cascades · Mixture of Limits & Downward Compilation',
    primaryStudyId: 'eco-synthesis',
    studyIds: ['eco-synthesis', 'lut-adapt', 'rce-jepa', 'deterministic-null', 'spellcheck', 'ai-coding-market'],
    prompts: [
      'Guide me through the Synthesis cascade on this page',
      'Run a Skeptic Debate on RCE-JEPA and LUT adaptation',
      'What falsifiers and scope limits apply here?',
    ],
  },
  knowledge: {
    id: 'knowledge',
    name: 'OpenIE Knowledge',
    domain: 'knowledge.openie.dev',
    tagline: 'Seven-Axis Bitemporal Claims · Six-Kernel Lean 4.36.0 Verification',
    primaryStudyId: 'eco-knowledge',
    studyIds: ['eco-knowledge', 'time-as-an-index', 'ai-reads-human', 'three-body', 'rce', 'deterministic-null'],
    prompts: [
      'Tour the seven-axis claim architecture on this page',
      'Debate what Six-Kernel Lean checks certify vs do not certify',
      'Explain Time as an Index and anti-laundering provenance',
    ],
  },
  database: {
    id: 'database',
    name: 'OpenIE Database & Data',
    domain: 'database.openie.dev',
    tagline: '35.28M Data Cells · Bitemporal Logs, RCE-VC & Memory-Mapped Stores',
    primaryStudyId: 'eco-database',
    studyIds: ['eco-database', 'rce', 'rce-vc', 'time-as-an-index', 'deterministic-null', 'ai-reads-human', 'game-engines'],
    prompts: [
      'Walk me through this Database page and its tables',
      'Debate RCE-VC and DNULLMM1 lookup bounds',
      'What are the cold-cache vs warm-cache scope limits?',
    ],
  },
  energy: {
    id: 'energy',
    name: 'OpenIE Energy',
    domain: 'energy.openie.dev',
    tagline: 'Physical Shunt Rails · Chip Counters & Strictly Orthogonal Joule Ledgers',
    primaryStudyId: 'satb-harness',
    studyIds: ['satb-harness', 'gates', 'mei', 'jouleos', 'eco-compute', 'agency'],
    prompts: [
      'Tour the energy measurement rails on this page',
      'Debate INA260 / INA3221 shunt scope vs OS counters',
      'Why are measured_j, reported_j, est_j, and unmetered never summed?',
    ],
  },
  state: {
    id: 'state',
    name: 'OpenIE State',
    domain: 'state.openie.dev',
    tagline: '9 Axes · Deterministic State Machines, Replay & Versioned Commits',
    primaryStudyId: 'rce-vc',
    studyIds: ['rce-vc', 'rce', 'eco-database', 'game-engines', 'time-as-an-index', 'agency'],
    prompts: [
      'Walk me through the state-machine axes on this page',
      'Debate deterministic replay and commit overhead',
      'Show the 15s visual proof for RCE-VC',
    ],
  },
  communication: {
    id: 'communication',
    name: 'OpenIE Communication',
    domain: 'communication.openie.dev',
    tagline: 'Signed Binary Envelopes · Cross-Node Latency & Protocol Handoffs',
    primaryStudyId: 'communication-avalanche',
    studyIds: ['communication-avalanche', 'latency', 'eco-avalanche', 'three-body', 'rce-vc'],
    prompts: [
      'Tour the protocol and transport sections on this page',
      'Debate WAI1 binary handoffs vs prose multi-agent relays',
      'What did cross-node latency receipts measure?',
    ],
  },
  memory: {
    id: 'memory',
    name: 'OpenIE Memory',
    domain: 'memory.openie.dev',
    tagline: 'Register to NVMe Hierarchy · Sub-Microsecond Case Lookup & Recall',
    primaryStudyId: 'deterministic-null',
    studyIds: ['deterministic-null', 'rce', 'eco-database', 'lut-adapt', 'time-as-an-index'],
    prompts: [
      'Walk me through the memory hierarchy on this page',
      'Debate Deterministic Null hit rates and miss penalties',
      'Cue the 9:16 vertical reel for Deterministic Null',
    ],
  },
  agent: {
    id: 'agent',
    name: 'OpenIE Agent',
    domain: 'agent.openie.dev',
    tagline: 'Budget-Guarded Act Tuples · Selection Cascades & Replication Audit',
    primaryStudyId: 'agency',
    studyIds: ['agency', 'gates', 'communication-avalanche', 'satiation', 'eco-stack', 'rce-jepa'],
    prompts: [
      'Walk me through the agent architecture on this page',
      'Debate which budget-guard claims survived preregistered Run 2',
      'Which six falsifiers fired in the Agency replication?',
    ],
  },
  proof: {
    id: 'proof',
    name: 'OpenIE Verify & Proof',
    domain: 'proof.openie.dev',
    tagline: 'Six-Kernel Lean 4.36.0 Escalation Ladder · Zero-Sorry Audit',
    primaryStudyId: 'time-as-an-index',
    studyIds: ['time-as-an-index', 'eco-knowledge', 'rce-compile', 'communication-avalanche', 'gates', 'rce'],
    prompts: [
      'Tour the formal verification ladder on this page',
      'Debate formal theorem scope vs empirical hardware bounds',
      'What does Signed Provenance · Self-Checked certify?',
    ],
  },
};

const HOST_ALIAS_MAP = {
  avalanche: 'avalanche',
  stack: 'stack',
  openie: 'stack',
  compute: 'compute',
  silicon: 'compute',
  tei: 'energy',
  'compute-sim': 'compute',
  cad: 'compute',
  ecad: 'compute',
  synthesis: 'synthesis',
  coding: 'synthesis',
  physical: 'synthesis',
  knowledge: 'knowledge',
  horizon: 'knowledge',
  docs: 'knowledge',
  database: 'database',
  data: 'database',
  energy: 'energy',
  state: 'state',
  communication: 'communication',
  memory: 'memory',
  agent: 'agent',
  proof: 'proof',
  verify: 'proof',
  blog: 'avalanche',
  research: 'avalanche',
};

// ---------- Same-Origin Cross-Domain Blob Worker & Worklet Sources ----------

const KOKORO_BLOB_WORKER_SOURCE = `
let modelP = null;
let info = null;
let genChain = Promise.resolve();
const DEFAULT_VOICE = 'af_heart';
const STAGED_VOICES = new Set(['af_heart', 'bm_george', 'af_bella', 'am_adam']);

function emitProgress(payload) {
  try {
    self.postMessage({
      type: 'progress',
      engine: 'kokoro-tts',
      status: payload?.status || 'loading',
      file: payload?.file || '',
      progress: typeof payload?.progress === 'number' ? payload.progress : null,
      loaded: payload?.loaded ?? null,
      total: payload?.total ?? null,
    });
  } catch {}
}

async function load(force) {
  self.KOKORO_VOICE_BASE = '${KOKORO_VOICE_BASE}';
  const { KokoroTTS, env } = await import('${KOKORO_MODULE_URL}');
  const tf = env.transformers;
  tf.allowLocalModels = false;
  tf.remoteHost = '${KOKORO_MODELS_BASE}';
  tf.remotePathTemplate = '{model}/';
  env.wasmPaths = '${KOKORO_ORT_BASE}';
  const threads = self.crossOriginIsolated
    ? Math.max(1, Math.min(8, (self.navigator?.hardwareConcurrency || 4) - 1))
    : 1;
  if (tf.backends?.onnx?.wasm) {
    tf.backends.onnx.wasm.numThreads = threads;
  }
  if (tf.backends?.onnx) {
    tf.backends.onnx.logLevel = 'error';
  }
  let gpu = false;
  if (force !== 'wasm' && self.navigator?.gpu) {
    try {
      gpu = !!(await self.navigator.gpu.requestAdapter());
    } catch {
      gpu = false;
    }
  }
  let dtype = force && force !== 'wasm' && force !== 'webgpu' ? force : gpu ? 'fp16' : 'q8';
  let device = gpu ? 'webgpu' : 'wasm';
  const t0 = performance.now();
  let model = null;
  let fellBack = null;
  try {
    model = await KokoroTTS.from_pretrained('Kokoro-82M-v1.0-ONNX', {
      dtype,
      device,
      session_options: { logSeverityLevel: 3 },
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
      session_options: { logSeverityLevel: 3 },
      progress_callback: emitProgress,
    });
  }
  info = {
    device,
    dtype,
    threads: device === 'wasm' ? threads : null,
    isolated: !!self.crossOriginIsolated,
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
  const { id, text, voice, speed, force } = e.data || {};
  try {
    modelP ||= load(force);
    const model = await modelP;
    if (text == null) {
      self.postMessage({ id, ready: true, info });
      return;
    }
    const usedVoice = resolveVoice(model, voice);
    const usedSpeed = resolveSpeed(speed);
    const run = genChain.then(async () => {
      const t0 = performance.now();
      const out = await model.generate(String(text), { voice: usedVoice, speed: usedSpeed });
      const ms = Math.round(performance.now() - t0);
      self.postMessage(
        { id, audio: out.audio, rate: out.sampling_rate, voice: usedVoice, speed: usedSpeed, ms, info },
        [out.audio.buffer]
      );
    });
    genChain = run.catch(() => {});
    await run;
  } catch (err) {
    if (!info) modelP = null;
    self.postMessage({ id, error: String((err && err.stack) || err) });
  }
};
`;

const PCM_WORKLET_BLOB_SOURCE = `
class OpenIEPcmCaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch && ch.length > 0) {
      const copy = new Float32Array(ch);
      this.port.postMessage(copy, [copy.buffer]);
    }
    return true;
  }
}
registerProcessor('openie-pcm-capture', OpenIEPcmCaptureProcessor);
`;

const WHISPER_BLOB_WORKER_SOURCE = `
const TF_CDN = '${TF_ESM_CDN}';
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
    });
  } catch {}
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
  if (env.backends?.onnx) {
    env.backends.onnx.logLevel = 'error';
  }
  let useGpu = false;
  if (forceDevice !== 'wasm' && self.navigator?.gpu) {
    try {
      useGpu = !!(await self.navigator.gpu.requestAdapter());
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
      session_options: { logSeverityLevel: 3 },
      progress_callback: postProgress,
    });
  } catch (err) {
    if (device !== 'webgpu') throw err;
    fellBack = String(err);
    device = 'wasm';
    transcriber = await pipeline('automatic-speech-recognition', MODEL_ID, {
      device: 'wasm',
      dtype: { encoder_model: 'q8', decoder_model_merged: 'q8' },
      session_options: { logSeverityLevel: 3 },
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
      self.postMessage({
        id,
        text: String(out?.text || '').trim(),
        ms: Math.round(performance.now() - t0),
        info: asrInfo,
      });
    });
    transcribeChain = job.catch(() => {});
    await job;
  } catch (err) {
    if (!asrInfo) asrPromise = null;
    self.postMessage({ id, error: String((err && err.stack) || err) });
  }
};
`;

const VISION_BLOB_WORKER_SOURCE = `
const TF_CDN = '${TF_ESM_CDN}';
const SMOLVLM_ID = 'HuggingFaceTB/SmolVLM-256M-Instruct';
const COMPACT_VLM_ID = 'Xenova/vit-gpt2-image-captioning';
let vlmState = null;
let vlmPromise = null;
let inferChain = Promise.resolve();

function postProgress(p) {
  try {
    self.postMessage({
      type: 'progress',
      engine: 'vision-vlm',
      status: p?.status || 'loading',
      file: p?.file || '',
      progress: typeof p?.progress === 'number' ? p.progress : null,
    });
  } catch {}
}

async function loadCompact(tf, t0, fellBack = null) {
  const pipe = await tf.pipeline('image-to-text', COMPACT_VLM_ID, {
    device: 'wasm',
    dtype: 'q8',
    session_options: { logSeverityLevel: 3 },
    progress_callback: postProgress,
  });
  return {
    kind: 'captioner',
    pipe,
    info: {
      model: COMPACT_VLM_ID,
      device: 'wasm',
      dtype: 'q8',
      loadMs: Math.round(performance.now() - t0),
      fellBack,
    },
  };
}

async function initVision(tier = 'auto') {
  const t0 = performance.now();
  const tf = await import(TF_CDN);
  const { env, AutoProcessor, AutoModelForVision2Seq, RawImage } = tf;
  env.allowLocalModels = false;
  const threads = self.crossOriginIsolated
    ? Math.max(1, Math.min(8, (self.navigator?.hardwareConcurrency || 4) - 1))
    : 1;
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.numThreads = threads;
  }
  if (env.backends?.onnx) {
    env.backends.onnx.logLevel = 'error';
  }
  let hasWebGpuFp16 = false;
  if (tier !== 'compact' && self.navigator?.gpu) {
    try {
      const adapter = await self.navigator.gpu.requestAdapter();
      hasWebGpuFp16 = !!(adapter && (tier === 'smolvlm' || adapter.features?.has('shader-f16')));
    } catch {
      hasWebGpuFp16 = false;
    }
  }
  if (tier === 'smolvlm' || (tier === 'auto' && hasWebGpuFp16)) {
    try {
      const processor = await AutoProcessor.from_pretrained(SMOLVLM_ID, {
        progress_callback: postProgress,
      });
      const model = await AutoModelForVision2Seq.from_pretrained(SMOLVLM_ID, {
        dtype: {
          embed_tokens: 'fp16',
          vision_encoder: 'q4',
          decoder_model_merged: 'q4',
        },
        device: 'webgpu',
        session_options: { logSeverityLevel: 3 },
        progress_callback: postProgress,
      });
      return {
        kind: 'smolvlm',
        processor,
        model,
        RawImage,
        info: {
          model: SMOLVLM_ID,
          device: 'webgpu',
          dtype: 'fp16/q4',
          loadMs: Math.round(performance.now() - t0),
          fellBack: null,
        },
      };
    } catch (err) {
      return loadCompact(tf, t0, String(err));
    }
  }
  return loadCompact(tf, t0, null);
}

self.onmessage = async (e) => {
  const { id, type, dataUrl, prompt, tier = 'auto' } = e.data || {};
  try {
    vlmPromise ||= initVision(tier).then((r) => {
      vlmState = r;
      return r;
    });
    const state = await vlmPromise;
    if (type === 'warmup' || !dataUrl) {
      self.postMessage({ id, ready: true, info: state.info });
      return;
    }
    const job = inferChain.then(async () => {
      const t0 = performance.now();
      let caption = '';
      if (state.kind === 'smolvlm') {
        const image = await state.RawImage.fromURL(dataUrl);
        const q = prompt || 'Describe any diagrams, charts, equations, code, or hardware visible in this frame concisely.';
        const messages = [{ role: 'user', content: [{ type: 'image' }, { type: 'text', text: q }] }];
        const chatPrompt = state.processor.apply_chat_template(messages, { add_generation_prompt: true });
        const inputs = await state.processor(chatPrompt, [image]);
        const generatedIds = await state.model.generate({
          ...inputs,
          max_new_tokens: 96,
          do_sample: false,
        });
        const trimmed = generatedIds.slice(null, [inputs.input_ids.dims.at(-1), null]);
        const decoded = state.processor.batch_decode(trimmed, { skip_special_tokens: true });
        caption = String(decoded?.[0] || '').trim();
      } else {
        const out = await state.pipe(dataUrl, { max_new_tokens: 48 });
        const raw = Array.isArray(out) ? out[0]?.generated_text : out?.generated_text;
        caption = String(raw || '').trim();
      }
      self.postMessage({ id, caption, ms: Math.round(performance.now() - t0), info: state.info });
    });
    inferChain = job.catch(() => {});
    await job;
  } catch (err) {
    if (!vlmState) vlmPromise = null;
    self.postMessage({ id, error: String((err && err.stack) || err) });
  }
};
`;

function createBlobJsUrl(source) {
  return URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
}

function createBlobModuleWorker(source) {
  const url = createBlobJsUrl(source);
  const worker = new Worker(url, { type: 'module' });
  return { worker, url };
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'what', 'how', 'why', 'who', 'where', 'when',
  'are', 'was', 'were', 'been', 'have', 'has', 'had', 'does', 'did', 'can', 'could', 'would', 'should',
  'about', 'into', 'across', 'over', 'under', 'between', 'through', 'like', 'tell', 'show', 'explain',
  'give', 'me', 'my', 'our', 'your', 'you', 'please', 'study', 'paper', 'openie', 'research', 'page',
]);

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9_+.-]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeForSpeech(text) {
  return String(text || '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/⊥/g, ' orthogonal to ')
    .replace(/<=/g, ' at most ')
    .replace(/>=/g, ' at least ')
    .replace(/!=/g, ' not equal to ')
    .replace(/\bmeasured_j\b/g, 'measured jay')
    .replace(/\breported_j\b/g, 'reported jay')
    .replace(/\best_j\b/g, 'estimated jay')
    .replace(/\b(\d+(?:\.\d+)?)\s*(?:uJ|µJ)\b/g, '$1 microjoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*mJ\b/g, '$1 millijoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*nJ\b/g, '$1 nanojoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*pJ\b/g, '$1 picojoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*kJ\b/g, '$1 kilojoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*(?:us|µs)\b/g, '$1 microseconds')
    .replace(/\b(\d+(?:\.\d+)?)\s*ms\b/g, '$1 milliseconds')
    .replace(/\b(\d+(?:\.\d+)?)x\b/g, '$1 times')
    .replace(/\[([TEMS])\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text) {
  const clean = normalizeForSpeech(text);
  if (!clean) return [];
  const raw = clean.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) || [clean];
  const merged = [];
  for (const part of raw) {
    const s = part.trim();
    if (!s) continue;
    if (merged.length && merged[merged.length - 1].length < 48) {
      merged[merged.length - 1] += ' ' + s;
    } else {
      merged.push(s);
    }
  }
  return merged;
}

function downsampleBuffer(buffer, inputRate, targetRate = 16000) {
  if (inputRate === targetRate) return new Float32Array(buffer);
  const ratio = inputRate / targetRate;
  const outLen = Math.max(1, Math.round(buffer.length / ratio));
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const start = Math.floor(i * ratio);
    const end = Math.min(buffer.length, Math.ceil((i + 1) * ratio));
    let sum = 0;
    let count = 0;
    for (let j = start; j < end; j++) {
      sum += buffer[j];
      count++;
    }
    out[i] = count > 0 ? sum / count : 0;
  }
  return out;
}

function absResearchUrl(pathOrUrl) {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${RESEARCH_ORIGIN}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

function absBlogUrl(pathOrUrl) {
  if (!pathOrUrl) return BLOG_ORIGIN;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${BLOG_ORIGIN}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function detectOpenIESurface(explicitSurface) {
  if (explicitSurface) {
    const clean = String(explicitSurface).trim().toLowerCase().replace(/\.openie\.dev$/, '');
    if (SURFACE_PROFILES[clean]) return SURFACE_PROFILES[clean];
    if (HOST_ALIAS_MAP[clean] && SURFACE_PROFILES[HOST_ALIAS_MAP[clean]]) {
      return SURFACE_PROFILES[HOST_ALIAS_MAP[clean]];
    }
  }
  if (typeof document !== 'undefined') {
    const scriptEl = document.querySelector('script[data-openie-surface]');
    const attrVal = scriptEl?.getAttribute('data-openie-surface')?.trim().toLowerCase();
    if (attrVal) {
      if (SURFACE_PROFILES[attrVal]) return SURFACE_PROFILES[attrVal];
      if (HOST_ALIAS_MAP[attrVal] && SURFACE_PROFILES[HOST_ALIAS_MAP[attrVal]]) {
        return SURFACE_PROFILES[HOST_ALIAS_MAP[attrVal]];
      }
    }
  }
  if (typeof window !== 'undefined') {
    const host = (window.location.hostname || '').toLowerCase();
    const sub = host.endsWith('.openie.dev') ? host.slice(0, -'.openie.dev'.length) : host.split('.')[0];
    if (SURFACE_PROFILES[sub]) return SURFACE_PROFILES[sub];
    if (HOST_ALIAS_MAP[sub] && SURFACE_PROFILES[HOST_ALIAS_MAP[sub]]) {
      return SURFACE_PROFILES[HOST_ALIAS_MAP[sub]];
    }
  }
  return SURFACE_PROFILES.avalanche;
}

export class OpenIEEcosystemSDK {
  constructor(opts = {}) {
    this.listeners = new Map();
    this.surface = detectOpenIESurface(opts.surface);
    this.researchCorpus = null;
    this.blogCorpus = null;
    this.studiesById = new Map();
    this.blogById = new Map();
    this.bm25Docs = [];
    this.bm25Idf = new Map();
    this.avgDocLen = 1;
    this.corpusPromise = null;

    this.state = 'idle';
    this.mode = 'call';
    this.callActive = false;
    this.micMuted = false;
    this.activeStudyId = this.surface.primaryStudyId || 'communication-avalanche';
    this.voice = 'af_heart';
    this.speed = 1.0;
    this.forceWhisper = false;

    this.audioCtx = null;
    this.micStream = null;
    this.micSource = null;
    this.micAnalyser = null;
    this.micFreqBins = null;
    this.pcmWorkletNode = null;
    this.pcmWorkletBlobUrl = null;
    this.pcmChunks = [];
    this.pcmSpeaking = false;
    this.pcmLastVoiceAt = 0;
    this.pcmSpeechStartAt = 0;

    this.ttsGain = null;
    this.ttsAnalyser = null;
    this.ttsFreqBins = null;
    this.activeBufferSource = null;
    this.turnAbort = null;
    this.vadTimer = null;
    this.bargeAboveSince = 0;
    this.noiseFloorDb = -56;
    this.vadDb = -60;
    this.lastTurnCommitAt = 0;
    this.ttfaMs = null;
    this.estJoulesHeuristic = 0;

    this.speechRec = null;
    this.speechRecSupported =
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    this.speechInterimText = '';
    this.speechEndpointTimer = null;

    this.ttsWorker = null;
    this.ttsReqId = 0;
    this.ttsPending = new Map();
    this.kokoroReady = false;
    this.kokoroLoading = false;
    this.kokoroInfo = null;

    this.asrWorker = null;
    this.asrReqId = 0;
    this.asrPending = new Map();
    this.whisperReady = false;
    this.whisperLoading = false;
    this.whisperInfo = null;

    this.visionWorker = null;
    this.visionReqId = 0;
    this.visionPending = new Map();
    this.visionModelReady = false;
    this.visionModelLoading = false;
    this.visionInfo = null;

    this.visionStream = null;
    this.visionSource = null;
    this.cameraFacing = 'environment';
    this.visionVideoEls = new Set();
    this.hiddenVisionVideo = null;
    this.offscreenCanvas = null;
    this.prevFrameLuma = null;
    this.lastVisionSnapshot = null;
    this.visionSampleTimer = null;

    this.copilotStep = 0;
    this.debateTurn = 0;
    this.transcript = [];
    this.turnCounter = 0;
    this.domIndex = { title: '', sections: [], tables: [], simulators: [] };

    this.orbCanvases = new Set();
    this.orbRaf = null;
    this.orbPhase = 0;
    this.syntheticSpeechEnv = 0;

    if (typeof document !== 'undefined') {
      this._injectHostSpotlightCss();
      this.refreshLiveDomIndex();
    }
  }

  on(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    this.listeners.get(event)?.delete(fn);
  }

  emit(event, payload) {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const fn of set) {
      try {
        fn(payload);
      } catch (err) {
        console.warn('[openie-ecosystem-sdk]', err);
      }
    }
  }

  _emitState() {
    const snap = this.getSnapshot();
    this.emit('state', snap);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openie:live-call-state', { detail: snap }));
    }
  }

  _emitTelemetry() {
    this.emit('telemetry', this.getTelemetry());
  }

  getSnapshot() {
    const study = this.studiesById.get(this.activeStudyId) || null;
    const blogEntry = this.blogById.get(this.activeStudyId) || null;
    return {
      surface: this.surface,
      state: this.state,
      mode: this.mode,
      callActive: this.callActive,
      micMuted: this.micMuted,
      activeStudyId: this.activeStudyId,
      activeStudy: study,
      activeBlogEntry: blogEntry,
      voice: this.voice,
      voicePersona: VOICE_PERSONAS[this.voice] || VOICE_PERSONAS.af_heart,
      speed: this.speed,
      visionActive: !!this.visionStream,
      visionSource: this.visionSource,
      cameraFacing: this.cameraFacing,
      forceWhisper: this.forceWhisper,
      kokoroReady: this.kokoroReady,
      whisperReady: this.whisperReady,
      visionModelReady: this.visionModelReady,
      domSectionCount: this.domIndex.sections.length,
      blogCount: this.blogById.size,
      studyCount: this.studiesById.size,
    };
  }

  getTelemetry() {
    let ttsBackend = 'Instant WebSpeech (<200ms)';
    if (this.kokoroReady && this.kokoroInfo) {
      ttsBackend = `Kokoro-82M (${this.kokoroInfo.device.toUpperCase()} ${this.kokoroInfo.dtype})`;
    } else if (this.kokoroLoading) {
      ttsBackend = 'WebSpeech · Warming Kokoro-82M';
    }
    let sttBackend = this.speechRecSupported && !this.forceWhisper
      ? 'WebSpeech Interim'
      : this.whisperReady
      ? `Whisper-Tiny.en (${(this.whisperInfo?.device || 'wasm').toUpperCase()} q8)`
      : 'Whisper-Tiny.en ONNX';
    let visionBackend = 'Standby';
    if (this.visionStream) {
      visionBackend = this.visionModelReady
        ? `Canvas2D + ${(this.visionInfo?.model || 'SmolVLM').split('/').pop()}`
        : 'Canvas2D Optical + SmolVLM Ready';
    }
    return {
      vadDb: Math.round(this.vadDb * 10) / 10,
      noiseFloorDb: Math.round(this.noiseFloorDb * 10) / 10,
      ttfaMs: this.ttfaMs,
      ttsBackend,
      sttBackend,
      visionBackend,
      estJoulesHeuristic: `${this.estJoulesHeuristic.toFixed(3)} est_j (browser heuristic ⊥ measured_j)`,
    };
  }

  _bumpBrowserHeuristic(u = 0.004) {
    this.estJoulesHeuristic += u;
    this._emitTelemetry();
  }

  // ---------- Host Live DOM Indexing & Smooth Section Spotlighting ----------
  _injectHostSpotlightCss() {
    if (document.getElementById('openie-eco-dom-spotlight-css')) return;
    const st = document.createElement('style');
    st.id = 'openie-eco-dom-spotlight-css';
    st.textContent = `
      @keyframes openieEcoSpotlightPulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.7), inset 0 0 0 2px rgba(245, 158, 11, 0.85); background-color: rgba(0, 212, 170, 0.10); }
        60% { box-shadow: 0 0 0 14px rgba(0, 212, 170, 0), inset 0 0 0 1.5px rgba(245, 158, 11, 0.5); background-color: rgba(245, 158, 11, 0.07); }
        100% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0); background-color: transparent; }
      }
      .openie-eco-dom-spotlight {
        border-radius: 10px;
        animation: openieEcoSpotlightPulse 2.8s ease-out forwards;
        transition: background-color 0.4s ease;
      }
    `;
    document.head.appendChild(st);
  }

  refreshLiveDomIndex() {
    if (typeof document === 'undefined') return this.domIndex;
    const vh = window.innerHeight || 800;
    const sections = [];
    const seenEls = new Set();

    const candidates = document.querySelectorAll('main section[id], section[id], main h1, main h2, main h3, article h1, article h2, article h3, h1, h2, h3');
    let secSeq = 0;
    candidates.forEach((el) => {
      if (el.closest('#openie-ecosystem-dock-host') || el.closest('#openie-live-dock-root') || el.closest('nav') || el.closest('footer')) {
        return;
      }
      const headingEl = el.tagName === 'SECTION' ? el.querySelector('h1, h2, h3') || el : el;
      if (seenEls.has(headingEl)) return;
      seenEls.add(headingEl);

      const headingText = (headingEl.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140);
      if (!headingText || headingText.length < 3) return;

      const anchorId = el.id || headingEl.id || headingEl.closest('section[id]')?.id || '';
      const domKey = anchorId || `openie-sec-${++secSeq}`;
      if (!el.getAttribute('data-openie-dom-key')) {
        el.setAttribute('data-openie-dom-key', domKey);
      }

      let snippet = '';
      const container = el.tagName === 'SECTION' ? el : headingEl.parentElement;
      if (el.tagName === 'SECTION') {
        snippet = (el.textContent || '').replace(headingText, '').replace(/\s+/g, ' ').trim().slice(0, 420);
      } else {
        let sib = headingEl.nextElementSibling;
        let hops = 0;
        while (sib && hops < 4 && snippet.length < 380) {
          if (/^H[1-3]$/.test(sib.tagName)) break;
          const t = (sib.textContent || '').replace(/\s+/g, ' ').trim();
          if (t) snippet += (snippet ? ' ' : '') + t;
          sib = sib.nextElementSibling;
          hops++;
        }
        if (!snippet && container) {
          snippet = (container.textContent || '').replace(headingText, '').replace(/\s+/g, ' ').trim().slice(0, 360);
        }
      }

      const rect = el.getBoundingClientRect();
      const inView = rect.top >= -100 && rect.top <= vh * 0.75;
      sections.push({
        key: domKey,
        id: anchorId,
        tag: headingEl.tagName.toLowerCase(),
        heading: headingText,
        snippet,
        inView,
      });
    });

    const tables = [];
    document.querySelectorAll('table').forEach((tbl, idx) => {
      if (tbl.closest('#openie-ecosystem-dock-host')) return;
      const key = tbl.id || `openie-tbl-${idx + 1}`;
      tbl.setAttribute('data-openie-dom-key', key);
      const headers = Array.from(tbl.querySelectorAll('th'))
        .map((th) => (th.textContent || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .slice(0, 8)
        .join(' | ');
      const cap = (tbl.querySelector('caption')?.textContent || '').replace(/\s+/g, ' ').trim();
      const sampleRow = (tbl.querySelector('tbody tr')?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 200);
      if (headers || cap || sampleRow) {
        tables.push({ key, caption: cap, headers, sampleRow });
      }
    });

    const simulators = [];
    document.querySelectorAll('[data-sim], [data-interactive], [data-simulator], canvas:not(#dock-orb-canvas), input[type="range"]').forEach((node, idx) => {
      if (node.closest('#openie-ecosystem-dock-host') || node.closest('#openie-live-dock-root')) return;
      const box = node.closest('section, figure, .card, .glass-card, div') || node;
      const label = (
        box.querySelector('h2, h3, h4, figcaption, label')?.textContent ||
        node.getAttribute('aria-label') ||
        'Interactive Simulator'
      ).replace(/\s+/g, ' ').trim().slice(0, 120);
      if (!simulators.some((s) => s.label === label)) {
        const key = box.id || `openie-sim-${idx + 1}`;
        box.setAttribute('data-openie-dom-key', key);
        simulators.push({ key, label });
      }
    });

    this.domIndex = {
      title: (document.title || this.surface.name).trim(),
      pathname: window.location.pathname,
      hostname: window.location.hostname,
      visibleSection: sections.find((s) => s.inView) || sections[0] || null,
      sections: sections.slice(0, 32),
      tables: tables.slice(0, 12),
      simulators: simulators.slice(0, 10),
    };
    return this.domIndex;
  }

  spotlightDomElement(keyOrQuery) {
    if (typeof document === 'undefined' || !keyOrQuery) return null;
    const raw = String(keyOrQuery).replace(/^#/, '').trim();
    let target =
      document.getElementById(raw) ||
      document.querySelector(`[data-openie-dom-key="${CSS.escape ? CSS.escape(raw) : raw}"]`);
    if (!target) {
      const q = raw.toLowerCase();
      for (const sec of this.domIndex.sections) {
        if (sec.heading.toLowerCase().includes(q) || sec.key.toLowerCase() === q) {
          target =
            (sec.id && document.getElementById(sec.id)) ||
            document.querySelector(`[data-openie-dom-key="${sec.key}"]`);
          if (target) break;
        }
      }
    }
    if (!target) return null;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.remove('openie-eco-dom-spotlight');
    void target.offsetWidth;
    target.classList.add('openie-eco-dom-spotlight');
    setTimeout(() => target.classList.remove('openie-eco-dom-spotlight'), 2900);
    const heading = (target.querySelector?.('h1, h2, h3')?.textContent || target.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 110);
    this.emit('dom-spotlight', { key: raw, heading });
    return { key: raw, heading };
  }

  // ---------- Cross-Origin Dual Corpus Loader (28 Studies + 57 Chronicle Entries + Live DOM) ----------
  async loadCorpora() {
    if (this.researchCorpus) return { research: this.researchCorpus, blog: this.blogCorpus };
    this.corpusPromise ||= Promise.allSettled([
      fetch(RESEARCH_CORPUS_URL, { mode: 'cors', credentials: 'omit' }).then((r) => {
        if (!r.ok) throw new Error(`Research corpus HTTP ${r.status}`);
        return r.json();
      }),
      fetch(BLOG_CORPUS_URL, { mode: 'cors', credentials: 'omit' }).then((r) => {
        if (!r.ok) throw new Error(`Blog corpus HTTP ${r.status}`);
        return r.json();
      }),
    ]).then(([resStudy, resBlog]) => {
      if (resStudy.status === 'fulfilled' && resStudy.value) {
        this.researchCorpus = resStudy.value;
        this.studiesById.clear();
        for (const s of resStudy.value.studies || []) {
          this.studiesById.set(s.id, s);
        }
      }
      if (resBlog.status === 'fulfilled' && resBlog.value) {
        this.blogCorpus = resBlog.value;
        this.blogById.clear();
        for (const e of resBlog.value.entries || []) {
          this.blogById.set(e.id, e);
        }
      }
      if (!this.studiesById.has(this.activeStudyId)) {
        const preferred = (this.surface.studyIds || []).find((id) => this.studiesById.has(id));
        this.activeStudyId = preferred || (this.researchCorpus?.studies?.[0]?.id ?? 'communication-avalanche');
      }
      this.refreshLiveDomIndex();
      this._buildUnifiedBm25Index();
      this.emit('corpus-ready', {
        studyCount: this.studiesById.size,
        blogCount: this.blogById.size,
        domSections: this.domIndex.sections.length,
      });
      this._emitState();
      return { research: this.researchCorpus, blog: this.blogCorpus };
    });
    return this.corpusPromise;
  }

  _buildUnifiedBm25Index() {
    const rawDocs = [];
    const surfaceSet = new Set(this.surface.studyIds || []);

    for (const s of this.studiesById.values()) {
      const blog = this.blogById.get(s.id);
      const text = [
        s.id,
        s.id.replace(/-/g, ' '),
        s.title,
        s.short_title,
        s.category,
        s.evidence_class,
        (s.key_terms || []).join(' '),
        s.headline_metric,
        s.headline_claim,
        (s.plain_bullets || []).join(' '),
        s.methods_and_meter,
        s.baseline_comparison,
        s.limitations_and_scope,
        blog?.primaryClaim || '',
        blog?.errataSummary || '',
      ].join(' ');
      rawDocs.push({
        kind: 'study',
        id: s.id,
        study: s,
        blog: blog || null,
        surfaceBoost: surfaceSet.has(s.id) ? 2.4 : 0,
        text,
      });
    }

    for (const b of this.blogById.values()) {
      if (this.studiesById.has(b.id)) continue;
      const text = [
        b.id,
        b.id.replace(/-/g, ' '),
        b.title,
        b.shortTitle || '',
        b.description || '',
        b.energyClass || '',
        b.headlineMetric || '',
        b.primaryClaim || '',
        (b.keyClaims || []).join(' '),
        b.limitationsSummary || '',
        (b.tags || []).join(' '),
      ].join(' ');
      rawDocs.push({
        kind: 'blog',
        id: b.id,
        study: null,
        blog: b,
        surfaceBoost: 0.5,
        text,
      });
    }

    const df = new Map();
    let totalLen = 0;
    this.bm25Docs = rawDocs.map((d) => {
      const toks = tokenize(d.text);
      totalLen += toks.length;
      const tf = new Map();
      for (const tok of toks) tf.set(tok, (tf.get(tok) || 0) + 1);
      for (const tok of tf.keys()) df.set(tok, (df.get(tok) || 0) + 1);
      return { ...d, tf, len: Math.max(1, toks.length) };
    });

    const N = Math.max(1, this.bm25Docs.length);
    this.avgDocLen = Math.max(1, totalLen / N);
    this.bm25Idf.clear();
    for (const [tok, count] of df.entries()) {
      this.bm25Idf.set(tok, Math.log(1 + (N - count + 0.5) / (count + 0.5)));
    }
  }

  searchKnowledge(query, topK = 4) {
    if (!this.bm25Docs.length) return [];
    const qLower = String(query || '').toLowerCase();
    const qToks = tokenize(qLower);
    const k1 = 1.5;
    const b = 0.75;
    const scored = [];

    for (const doc of this.bm25Docs) {
      let score = doc.surfaceBoost;
      const idWords = doc.id.replace(/-/g, ' ');
      if (qLower.includes(doc.id) || (idWords.length > 3 && qLower.includes(idWords))) {
        score += 14;
      }
      const shortTitle = (doc.study?.short_title || doc.blog?.shortTitle || '').toLowerCase();
      if (shortTitle && shortTitle.length > 3 && qLower.includes(shortTitle)) {
        score += 12;
      }
      for (const term of doc.study?.key_terms || doc.blog?.tags || []) {
        const tl = term.toLowerCase();
        if (tl.length > 3 && qLower.includes(tl)) score += 4.5;
      }
      for (const tok of qToks) {
        const f = doc.tf.get(tok) || 0;
        if (!f) continue;
        const idf = this.bm25Idf.get(tok) || 0.5;
        score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + b * (doc.len / this.avgDocLen))));
      }
      if (score > doc.surfaceBoost) scored.push({ doc, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  findBestDomSection(query) {
    this.refreshLiveDomIndex();
    const qLower = String(query || '').toLowerCase();
    const qToks = tokenize(qLower);
    let best = null;
    let bestScore = 0;
    for (const sec of this.domIndex.sections) {
      const hay = `${sec.heading} ${sec.snippet}`.toLowerCase();
      let s = 0;
      if (sec.heading.length > 4 && qLower.includes(sec.heading.toLowerCase())) s += 10;
      for (const t of qToks) {
        if (sec.heading.toLowerCase().includes(t)) s += 3;
        else if (hay.includes(t)) s += 1.2;
      }
      if (s > bestScore) {
        bestScore = s;
        best = sec;
      }
    }
    return bestScore >= 2.4 ? best : null;
  }

  makeReceipt(study, blogEntry) {
    const evClass = study?.evidence_class || blogEntry?.energyClass || 'unmetered';
    const tags = study?.claim_tags || blogEntry?.claimTags || ['[E]'];
    return {
      studyId: study?.id || blogEntry?.id || this.activeStudyId,
      shortTitle: study?.short_title || blogEntry?.shortTitle || this.surface.name,
      evidence_class: evClass,
      claim_tags: tags,
      provenance: 'Signed Provenance · Self-Checked',
      orthogonality: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
      blogUrl: blogEntry?.url ? absBlogUrl(blogEntry.url) : BLOG_ORIGIN,
      paperUrl: study?.path ? absResearchUrl(study.path) : `${RESEARCH_ORIGIN}/`,
    };
  }

  openVisualStage({ studyId, clip = '15s' } = {}) {
    const study = this.studiesById.get(studyId || this.activeStudyId) || this.studiesById.get(this.surface.primaryStudyId);
    if (!study) return null;
    if (study.id !== this.activeStudyId) {
      this.activeStudyId = study.id;
      this._emitState();
    }
    let url = absResearchUrl(study.tv15s);
    let kind = 'video';
    let label = '15s Visual Proof';
    if (clip === '45s') {
      url = absResearchUrl(study.tv45s);
      label = '45s Real-World Example';
    } else if (clip === '90s') {
      url = absResearchUrl(study.tv90s);
      label = '90s Studio Briefing';
    } else if (clip === 'tiktok') {
      url = absResearchUrl(study.tiktokMp4);
      kind = 'tiktok';
      label = '9:16 Vertical Reel (60fps)';
    }
    const payload = {
      studyId: study.id,
      shortTitle: study.short_title,
      clip,
      kind,
      label,
      url,
      poster: absResearchUrl(clip === 'tiktok' ? study.tiktokPoster || study.poster : study.poster),
      paperUrl: absResearchUrl(study.path),
      tvUrl: `${RESEARCH_ORIGIN}/tv/?study=${encodeURIComponent(study.id)}&tier=${encodeURIComponent(clip)}`,
    };
    this.emit('stage', payload);
    return payload;
  }

  // ---------- WebAudio Graph, Chimes, AudioWorklet Blob & <100ms Spectral VAD ----------
  async _ensureAudioContext() {
    if (typeof window === 'undefined') return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!this.audioCtx) {
      this.audioCtx = new Ctx();
      this.ttsGain = this.audioCtx.createGain();
      this.ttsGain.gain.value = 1.0;
      this.ttsAnalyser = this.audioCtx.createAnalyser();
      this.ttsAnalyser.fftSize = 512;
      this.ttsAnalyser.smoothingTimeConstant = 0.78;
      this.ttsFreqBins = new Uint8Array(this.ttsAnalyser.frequencyBinCount);
      this.ttsGain.connect(this.ttsAnalyser);
      this.ttsAnalyser.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      try {
        await this.audioCtx.resume();
      } catch {}
    }
    return this.audioCtx;
  }

  async playPickupChime() {
    const ctx = await this._ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [528, 792].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);
      g.gain.setValueAtTime(0.0001, now + idx * 0.065);
      g.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.065 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.065 + 0.17);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.18);
    });
  }

  _playBargeTick() {
    if (!this.audioCtx || this.audioCtx.state !== 'running') return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const g = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, now);
    g.gain.setValueAtTime(0.04, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(g);
    g.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  async _startMicrophoneAndVad() {
    if (this.micStream) return true;
    if (!navigator.mediaDevices?.getUserMedia) {
      this.emit('error', { scope: 'mic', message: 'Microphone API unavailable; text, Co-Pilot, and Dual-Host Debate remain active.' });
      return false;
    }
    try {
      const ctx = await this._ensureAudioContext();
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      this.micSource = ctx.createMediaStreamSource(this.micStream);
      this.micAnalyser = ctx.createAnalyser();
      this.micAnalyser.fftSize = 1024;
      this.micAnalyser.smoothingTimeConstant = 0.65;
      this.micFreqBins = new Uint8Array(this.micAnalyser.frequencyBinCount);
      this.micSource.connect(this.micAnalyser);

      if (ctx.audioWorklet && typeof AudioWorkletNode !== 'undefined') {
        try {
          if (!ctx.__openieEcoPcmLoaded) {
            this.pcmWorkletBlobUrl ||= createBlobJsUrl(PCM_WORKLET_BLOB_SOURCE);
            await ctx.audioWorklet.addModule(this.pcmWorkletBlobUrl);
            ctx.__openieEcoPcmLoaded = true;
          }
          const workletNode = new AudioWorkletNode(ctx, 'openie-pcm-capture', {
            numberOfInputs: 1,
            numberOfOutputs: 0,
            channelCount: 1,
          });
          workletNode.port.onmessage = (ev) => {
            if (!this.callActive || this.micMuted || this.state === 'speaking') return;
            if (!this.forceWhisper && this.speechRecSupported) return;
            const ch = ev.data;
            if (this.pcmSpeaking && ch && ch.length > 0) {
              this.pcmChunks.push(downsampleBuffer(ch, ctx.sampleRate, 16000));
            }
          };
          this.micSource.connect(workletNode);
          this.pcmWorkletNode = workletNode;
        } catch {}
      }

      if (!this.vadTimer) {
        this.vadTimer = setInterval(() => this._stepVad(), 25);
      }
      if (!this.speechRecSupported) {
        this.warmupWhisper().catch(() => {});
      }
      return true;
    } catch {
      this.emit('error', {
        scope: 'mic',
        message: 'Microphone permission declined — text prompts, Page Co-Pilot, and Skeptic Debate work without mic.',
      });
      return false;
    }
  }

  _stepVad() {
    if (!this.micAnalyser || !this.audioCtx || this.micMuted) {
      this.vadDb = -60;
      return;
    }
    this.micAnalyser.getByteFrequencyData(this.micFreqBins);
    const binHz = this.audioCtx.sampleRate / this.micAnalyser.fftSize;
    const bStart = Math.max(1, Math.floor(300 / binHz));
    const bEnd = Math.min(this.micFreqBins.length - 1, Math.ceil(3400 / binHz));

    let energySum = 0;
    let count = 0;
    for (let i = bStart; i <= bEnd; i++) {
      const norm = this.micFreqBins[i] / 255;
      energySum += norm * norm;
      count++;
    }
    const rms = Math.sqrt(energySum / Math.max(1, count));
    const db = Math.max(-65, 20 * Math.log10(Math.max(rms, 1e-4)));
    this.vadDb = db;

    let ttsBleed = 0;
    if (this.state === 'speaking' && this.ttsAnalyser && this.ttsFreqBins) {
      this.ttsAnalyser.getByteFrequencyData(this.ttsFreqBins);
      let s = 0;
      for (let i = 2; i < Math.min(48, this.ttsFreqBins.length); i++) s += this.ttsFreqBins[i] / 255;
      ttsBleed = (s / 46) * 8.5;
    }

    if (this.state === 'listening' && db < this.noiseFloorDb + 6) {
      this.noiseFloorDb = this.noiseFloorDb * 0.96 + db * 0.04;
    } else if (db < this.noiseFloorDb) {
      this.noiseFloorDb = db;
    }

    const now = performance.now();
    // <100ms full-duplex spectral VAD barge-in once sustained voice energy crosses adaptive threshold
    if (this.callActive && this.state === 'speaking') {
      const bargeThreshold = Math.max(-33, this.noiseFloorDb + 15 + ttsBleed);
      if (db > bargeThreshold) {
        if (!this.bargeAboveSince) this.bargeAboveSince = now;
        else if (now - this.bargeAboveSince >= 95) {
          this.bargeAboveSince = 0;
          this.bargeIn('vad-voice');
        }
      } else {
        this.bargeAboveSince = 0;
      }
    }

    // Whisper-Tiny ONNX utterance endpointing for browsers without SpeechRecognition
    if (this.callActive && this.state === 'listening' && (this.forceWhisper || !this.speechRecSupported)) {
      const speechThresh = Math.max(-40, this.noiseFloorDb + 10);
      if (db > speechThresh) {
        if (!this.pcmSpeaking) {
          this.pcmSpeaking = true;
          this.pcmSpeechStartAt = now;
          this.pcmChunks = [];
          this.emit('interim', { text: 'Listening (Whisper-Tiny ONNX)...' });
        }
        this.pcmLastVoiceAt = now;
      } else if (this.pcmSpeaking && now - this.pcmLastVoiceAt >= 650) {
        const durMs = now - this.pcmSpeechStartAt;
        const chunks = this.pcmChunks;
        this.pcmSpeaking = false;
        this.pcmChunks = [];
        if (durMs >= 360 && chunks.length > 0) {
          this._commitWhisperUtterance(chunks);
        } else {
          this.emit('interim', { text: '' });
        }
      }
    }

    this._emitTelemetry();
  }

  _startWebSpeechRecognition() {
    if (!this.speechRecSupported || this.forceWhisper || this.speechRec) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event) => {
      if (!this.callActive || this.micMuted) return;
      let interim = '';
      let finalChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalChunk += res[0].transcript + ' ';
        else interim += res[0].transcript;
      }
      if (finalChunk) {
        this.speechInterimText = (this.speechInterimText + ' ' + finalChunk).trim();
      }
      const preview = (this.speechInterimText + ' ' + interim).trim();
      if (preview && this.state === 'speaking' && preview.split(/\s+/).length >= 2) {
        this.bargeIn('speech-interim');
      }
      this.emit('interim', { text: preview });

      if (preview) {
        clearTimeout(this.speechEndpointTimer);
        this.speechEndpointTimer = setTimeout(() => {
          const committed = (this.speechInterimText || preview).trim();
          this.speechInterimText = '';
          this.emit('interim', { text: '' });
          if (committed.length >= 2 && this.callActive) {
            this.lastTurnCommitAt = performance.now();
            this.ask(committed, { fromVoice: true });
          }
        }, finalChunk ? 360 : 660);
      }
    };

    rec.onerror = (ev) => {
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
        this.speechRec = null;
      }
    };

    rec.onend = () => {
      if (this.callActive && !this.micMuted && !this.forceWhisper && this.speechRec === rec) {
        try {
          rec.start();
        } catch {}
      }
    };

    try {
      rec.start();
      this.speechRec = rec;
    } catch {
      this.speechRec = null;
    }
  }

  _stopWebSpeechRecognition() {
    clearTimeout(this.speechEndpointTimer);
    if (this.speechRec) {
      const r = this.speechRec;
      this.speechRec = null;
      try {
        r.stop();
      } catch {}
    }
  }

  async _commitWhisperUtterance(chunks) {
    let total = 0;
    for (const c of chunks) total += c.length;
    const merged = new Float32Array(total);
    let offset = 0;
    for (const c of chunks) {
      merged.set(c, offset);
      offset += c.length;
    }
    this.emit('interim', { text: 'Transcribing locally via Whisper-Tiny.en ONNX...' });
    try {
      const res = await this._callAsrWorker({ type: 'transcribe', audio: merged });
      this.emit('interim', { text: '' });
      const text = String(res?.text || '').replace(/\[BLANK_AUDIO\]|\(blank audio\)/gi, '').trim();
      if (text.length >= 2 && this.callActive) {
        this.lastTurnCommitAt = performance.now();
        this._bumpBrowserHeuristic(0.035);
        await this.ask(text, { fromVoice: true });
      }
    } catch (err) {
      this.emit('interim', { text: '' });
      this.emit('error', { scope: 'whisper-stt', message: String(err) });
    }
  }

  // ---------- Same-Origin Blob Workers (Kokoro TTS, Whisper STT, SmolVLM Vision) ----------
  _ensureTtsWorker() {
    if (this.ttsWorker) return this.ttsWorker;
    const { worker } = createBlobModuleWorker(KOKORO_BLOB_WORKER_SOURCE);
    worker.onmessage = (e) => {
      const d = e.data || {};
      if (d.type === 'progress') {
        this.emit('engine-progress', d);
        return;
      }
      const p = this.ttsPending.get(d.id);
      if (!p) return;
      this.ttsPending.delete(d.id);
      if (d.error) p.rej(new Error(d.error));
      else p.res(d);
    };
    this.ttsWorker = worker;
    return worker;
  }

  _callTtsWorker(payload) {
    const w = this._ensureTtsWorker();
    const id = ++this.ttsReqId;
    return new Promise((res, rej) => {
      this.ttsPending.set(id, { res, rej });
      w.postMessage({ id, ...payload });
    });
  }

  async warmupKokoro(force) {
    if (this.kokoroReady) return this.kokoroInfo;
    if (this.kokoroLoading) return null;
    this.kokoroLoading = true;
    this._emitTelemetry();
    try {
      const res = await this._callTtsWorker({ text: null, force });
      this.kokoroInfo = res.info;
      this.kokoroReady = true;
      this.kokoroLoading = false;
      this._emitState();
      this._emitTelemetry();
      return res.info;
    } catch {
      this.kokoroLoading = false;
      this._emitTelemetry();
      return null;
    }
  }

  _ensureAsrWorker() {
    if (this.asrWorker) return this.asrWorker;
    const { worker } = createBlobModuleWorker(WHISPER_BLOB_WORKER_SOURCE);
    worker.onmessage = (e) => {
      const d = e.data || {};
      if (d.type === 'progress') {
        this.emit('engine-progress', d);
        return;
      }
      const p = this.asrPending.get(d.id);
      if (!p) return;
      this.asrPending.delete(d.id);
      if (d.error) p.rej(new Error(d.error));
      else p.res(d);
    };
    this.asrWorker = worker;
    return worker;
  }

  _callAsrWorker(payload) {
    const w = this._ensureAsrWorker();
    const id = ++this.asrReqId;
    return new Promise((res, rej) => {
      this.asrPending.set(id, { res, rej });
      const transfer = payload.audio instanceof Float32Array ? [payload.audio.buffer] : [];
      w.postMessage({ id, ...payload }, transfer);
    });
  }

  async warmupWhisper() {
    if (this.whisperReady || this.whisperLoading) return this.whisperInfo;
    this.whisperLoading = true;
    this._emitTelemetry();
    try {
      const res = await this._callAsrWorker({ type: 'warmup' });
      this.whisperInfo = res.info;
      this.whisperReady = true;
      this.whisperLoading = false;
      this._emitState();
      this._emitTelemetry();
      return res.info;
    } catch {
      this.whisperLoading = false;
      this._emitTelemetry();
      return null;
    }
  }

  _ensureVisionWorker() {
    if (this.visionWorker) return this.visionWorker;
    const { worker } = createBlobModuleWorker(VISION_BLOB_WORKER_SOURCE);
    worker.onmessage = (e) => {
      const d = e.data || {};
      if (d.type === 'progress') {
        this.emit('engine-progress', d);
        return;
      }
      const p = this.visionPending.get(d.id);
      if (!p) return;
      this.visionPending.delete(d.id);
      if (d.error) p.rej(new Error(d.error));
      else p.res(d);
    };
    this.visionWorker = worker;
    return worker;
  }

  _callVisionWorker(payload) {
    const w = this._ensureVisionWorker();
    const id = ++this.visionReqId;
    return new Promise((res, rej) => {
      this.visionPending.set(id, { res, rej });
      w.postMessage({ id, ...payload });
    });
  }

  // ---------- Streaming Neural TTS + Instant Turn-1 WebSpeech Fallback ----------
  bargeIn(reason = 'manual') {
    const wasSpeakingOrThinking = this.state === 'speaking' || this.state === 'thinking';
    if (this.turnAbort) {
      this.turnAbort.abort(reason);
      this.turnAbort = null;
    }
    if (this.activeBufferSource) {
      try {
        this.activeBufferSource.stop(0);
        this.activeBufferSource.disconnect();
      } catch {}
      this.activeBufferSource = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.syntheticSpeechEnv = 0;
    if (wasSpeakingOrThinking && reason !== 'silent-reset') {
      this._playBargeTick();
    }
    this.state = this.callActive ? 'listening' : 'idle';
    this._emitState();
  }

  async speakStream(rawText, { voice, speed, signal } = {}) {
    const sentences = splitSentences(rawText);
    if (!sentences.length) return;
    const chosenVoice = voice || this.voice || 'af_heart';
    const chosenSpeed = speed || this.speed || 1.0;

    if (!this.kokoroReady && !this.kokoroLoading) {
      this.warmupKokoro().catch(() => {});
    }

    this.state = 'speaking';
    this._emitState();

    if (this.kokoroReady) {
      const ctx = await this._ensureAudioContext();
      let nextReq = this._callTtsWorker({ text: sentences[0], voice: chosenVoice, speed: chosenSpeed });
      for (let i = 0; i < sentences.length; i++) {
        if (signal?.aborted) return;
        const curReq = nextReq;
        if (i + 1 < sentences.length) {
          nextReq = this._callTtsWorker({ text: sentences[i + 1], voice: chosenVoice, speed: chosenSpeed });
        }
        let gen;
        try {
          gen = await curReq;
        } catch {
          await this._speakWebSpeechFallback(sentences.slice(i).join(' '), chosenVoice, chosenSpeed, signal);
          return;
        }
        if (signal?.aborted) return;
        this._bumpBrowserHeuristic(0.022);
        if (i === 0 && this.lastTurnCommitAt > 0) {
          this.ttfaMs = Math.round(performance.now() - this.lastTurnCommitAt);
          this.lastTurnCommitAt = 0;
          this._emitTelemetry();
        }
        await this._playFloat32Pcm(ctx, gen.audio, gen.rate || 24000, signal);
      }
      return;
    }

    await this._speakWebSpeechFallback(sentences.join(' '), chosenVoice, chosenSpeed, signal);
  }

  _playFloat32Pcm(ctx, pcm, sampleRate, signal) {
    if (!ctx || !pcm?.length || signal?.aborted) return Promise.resolve();
    return new Promise((resolve) => {
      const buf = ctx.createBuffer(1, pcm.length, sampleRate);
      buf.getChannelData(0).set(pcm);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(this.ttsGain || ctx.destination);
      this.activeBufferSource = src;

      const onAbort = () => {
        try {
          src.stop(0);
          src.disconnect();
        } catch {}
        resolve();
      };
      if (signal) signal.addEventListener('abort', onAbort, { once: true });
      src.onended = () => {
        if (signal) signal.removeEventListener('abort', onAbort);
        if (this.activeBufferSource === src) this.activeBufferSource = null;
        resolve();
      };
      src.start(0);
    });
  }

  _speakWebSpeechFallback(text, voiceId, speed, signal) {
    if (typeof window === 'undefined' || !window.speechSynthesis || signal?.aborted) {
      return Promise.resolve();
    }
    const persona = VOICE_PERSONAS[voiceId] || VOICE_PERSONAS.af_heart;
    return new Promise((resolve) => {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      const u = new SpeechSynthesisUtterance(text);
      u.rate = Math.min(1.8, Math.max(0.7, speed));
      u.pitch = persona.pitch || 1.0;
      u.lang = persona.lang || 'en-US';
      const voices = window.speechSynthesis.getVoices?.() || [];
      if (voices.length) {
        const wantGb = persona.lang === 'en-GB';
        const wantMale = voiceId.startsWith('bm_') || voiceId.startsWith('am_');
        const picked =
          voices.find(
            (v) =>
              v.lang?.startsWith(wantGb ? 'en-GB' : 'en-US') &&
              (wantMale
                ? /daniel|george|alex|fred|arthur|oliver|aaron|guy/i.test(v.name)
                : /samantha|ava|allison|victoria|karen|serena|aria/i.test(v.name))
          ) || voices.find((v) => v.lang?.startsWith('en'));
        if (picked) u.voice = picked;
      }

      let envTimer = null;
      const cleanup = () => {
        clearInterval(envTimer);
        this.syntheticSpeechEnv = 0;
        resolve();
      };
      const onAbort = () => {
        try {
          window.speechSynthesis.cancel();
        } catch {}
        cleanup();
      };
      if (signal) signal.addEventListener('abort', onAbort, { once: true });

      u.onstart = () => {
        if (this.lastTurnCommitAt > 0) {
          this.ttfaMs = Math.round(performance.now() - this.lastTurnCommitAt);
          this.lastTurnCommitAt = 0;
          this._emitTelemetry();
        }
        let tick = 0;
        envTimer = setInterval(() => {
          tick += 0.35;
          this.syntheticSpeechEnv = 0.34 + 0.45 * Math.abs(Math.sin(tick * 2.3) * Math.cos(tick * 1.1));
        }, 40);
      };
      u.onend = () => {
        if (signal) signal.removeEventListener('abort', onAbort);
        cleanup();
      };
      u.onerror = () => {
        if (signal) signal.removeEventListener('abort', onAbort);
        cleanup();
      };
      window.speechSynthesis.speak(u);
    });
  }

  // ---------- Mode 2: Camera & Screen Share Vision + SmolVLM Blob Worker ----------
  attachVisionVideo(videoEl) {
    if (!videoEl) return;
    this.visionVideoEls.add(videoEl);
    if (this.visionStream) {
      videoEl.srcObject = this.visionStream;
      videoEl.play().catch(() => {});
    }
  }

  async startCamera(facingMode) {
    if (facingMode) this.cameraFacing = facingMode;
    this.stopVision();
    if (!navigator.mediaDevices?.getUserMedia) {
      this.emit('error', { scope: 'vision', message: 'Camera API unavailable in this browser context.' });
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      this._activateVisionStream(stream, 'camera');
      return true;
    } catch (err) {
      this.emit('error', { scope: 'vision', message: `Camera unavailable: ${String(err.message || err)}` });
      return false;
    }
  }

  async flipCamera() {
    return this.startCamera(this.cameraFacing === 'user' ? 'environment' : 'user');
  }

  async startScreenShare() {
    this.stopVision();
    if (!navigator.mediaDevices?.getDisplayMedia) {
      this.emit('error', { scope: 'vision', message: 'Screen sharing is unavailable on this browser/device.' });
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      stream.getVideoTracks()[0]?.addEventListener('ended', () => this.stopVision());
      this._activateVisionStream(stream, 'screen');
      return true;
    } catch (err) {
      this.emit('error', { scope: 'vision', message: `Screen share cancelled: ${String(err.message || err)}` });
      return false;
    }
  }

  _activateVisionStream(stream, source) {
    this.visionStream = stream;
    this.visionSource = source;
    if (!this.hiddenVisionVideo && typeof document !== 'undefined') {
      const v = document.createElement('video');
      v.muted = true;
      v.playsInline = true;
      this.hiddenVisionVideo = v;
    }
    if (this.hiddenVisionVideo) {
      this.hiddenVisionVideo.srcObject = stream;
      this.hiddenVisionVideo.play().catch(() => {});
    }
    for (const v of this.visionVideoEls) {
      v.srcObject = stream;
      v.play().catch(() => {});
    }
    clearInterval(this.visionSampleTimer);
    this.visionSampleTimer = setInterval(() => this.sampleVisionTelemetryOnly(), 1300);
    this._emitState();
    this._emitTelemetry();
  }

  stopVision() {
    clearInterval(this.visionSampleTimer);
    this.visionSampleTimer = null;
    if (this.visionStream) {
      this.visionStream.getTracks().forEach((t) => t.stop());
      this.visionStream = null;
    }
    this.visionSource = null;
    this.prevFrameLuma = null;
    for (const v of this.visionVideoEls) v.srcObject = null;
    this._emitState();
    this._emitTelemetry();
  }

  sampleVisionTelemetryOnly() {
    const vid = this.hiddenVisionVideo;
    if (!this.visionStream || !vid || vid.videoWidth < 8) return null;
    const w = 320;
    const h = Math.max(180, Math.round((vid.videoHeight / vid.videoWidth) * w));
    if (!this.offscreenCanvas) this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = w;
    this.offscreenCanvas.height = h;
    const ctx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(vid, 0, 0, w, h);
    const img = ctx.getImageData(0, 0, w, h).data;

    const n = w * h;
    const luma = new Float32Array(n);
    let sum = 0;
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      const y = 0.2126 * img[p] + 0.7152 * img[p + 1] + 0.0722 * img[p + 2];
      luma[i] = y;
      sum += y;
    }
    const meanLuma = sum / n;
    let varSum = 0;
    for (let i = 0; i < n; i++) {
      const d = luma[i] - meanLuma;
      varSum += d * d;
    }
    const contrastRms = Math.sqrt(varSum / n);

    let edgeHits = 0;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const gx = Math.abs(luma[idx + 1] - luma[idx - 1]);
        const gy = Math.abs(luma[idx + w] - luma[idx - w]);
        if (gx + gy > 42) edgeHits++;
      }
    }
    const edgeDensity = edgeHits / Math.max(1, (w - 2) * (h - 2));

    let motionPct = 0;
    if (this.prevFrameLuma && this.prevFrameLuma.length === n) {
      let diff = 0;
      for (let i = 0; i < n; i++) {
        if (Math.abs(luma[i] - this.prevFrameLuma[i]) > 18) diff++;
      }
      motionPct = (diff / n) * 100;
    }
    this.prevFrameLuma = luma;

    const sceneType =
      edgeDensity > 0.14 && contrastRms > 42
        ? 'High-edge technical diagram, table, or code view'
        : edgeDensity > 0.08
        ? 'Structured portal interface, chart, or bench view'
        : 'Ambient camera scene';

    const metrics = {
      width: vid.videoWidth,
      height: vid.videoHeight,
      meanLuma: Math.round(meanLuma),
      contrastRms: Math.round(contrastRms),
      edgeDensityPct: Math.round(edgeDensity * 1000) / 10,
      motionPct: Math.round(motionPct * 10) / 10,
      sceneType,
    };
    const dataUrl = this.offscreenCanvas.toDataURL('image/jpeg', 0.82);
    this.lastVisionSnapshot = { dataUrl, metrics, source: this.visionSource, ts: Date.now() };
    this._bumpBrowserHeuristic(0.002);
    this.emit('vision-frame', this.lastVisionSnapshot);
    return this.lastVisionSnapshot;
  }

  async analyzeFrameNow(prompt = '') {
    await this.loadCorpora();
    if (!this.visionStream) {
      const ok = await this.startCamera(this.cameraFacing);
      if (!ok) return null;
      await new Promise((r) => setTimeout(r, 380));
    }
    const snap = this.sampleVisionTelemetryOnly();
    if (!snap) return this.ask(prompt || 'Summarize the visible section on this portal.');

    const m = snap.metrics;
    let vlmCaption = '';
    try {
      this.state = 'thinking';
      this._emitState();
      const res = await this._callVisionWorker({
        type: 'analyze',
        dataUrl: snap.dataUrl,
        prompt: prompt || 'Describe any diagrams, charts, equations, code, or hardware visible in this frame concisely.',
      });
      vlmCaption = res?.caption || '';
      this.visionInfo = res?.info || this.visionInfo;
      this.visionModelReady = true;
      this._bumpBrowserHeuristic(0.045);
      this._emitTelemetry();
    } catch {
      vlmCaption = '';
    }

    const study = this.studiesById.get(this.activeStudyId);
    const blog = this.blogById.get(this.activeStudyId);
    const srcLabel = this.visionSource === 'screen' ? 'screen share' : `${this.cameraFacing} camera`;
    const reply =
      `Inspecting your live ${srcLabel} (${m.width} by ${m.height}): Sobel edge density is ${m.edgeDensityPct}% with RMS contrast ${m.contrastRms} and luminance ${m.meanLuma}, indicating a ${m.sceneType.toLowerCase()}. ` +
      (vlmCaption ? `In-browser vision reads: "${vlmCaption}". ` : '') +
      `On ${this.surface.name}, this connects to ${study?.short_title || this.surface.tagline} (${study?.evidence_class || 'unmetered'}, Signed Provenance · Self-Checked).`;

    await this._deliverAssistantTurn({
      speakerName: VOICE_PERSONAS[this.voice]?.name || 'Heart',
      speakerRole: `${VOICE_PERSONAS[this.voice]?.role || 'Systems Lead'} · Vision`,
      voice: this.voice,
      text: reply,
      study,
      blog,
    });
    return snap;
  }

  // ---------- Call Lifecycle, Mode 3 (Page Co-Pilot) & Mode 4 (Skeptic Debate) ----------
  async startCall(opts = {}) {
    await this.loadCorpora();
    if (opts.studyId && this.studiesById.has(opts.studyId)) {
      this.activeStudyId = opts.studyId;
    }
    if (opts.mode) this.mode = opts.mode;
    if (opts.voice && VOICE_PERSONAS[opts.voice]) this.voice = opts.voice;

    this.callActive = true;
    this.lastTurnCommitAt = performance.now();
    this._emitState();

    await this.playPickupChime();
    this.warmupKokoro().catch(() => {});
    await this._startMicrophoneAndVad();
    if (!this.micMuted) this._startWebSpeechRecognition();

    const study = this.studiesById.get(this.activeStudyId);
    const blog = this.blogById.get(this.activeStudyId);
    const dom = this.refreshLiveDomIndex();
    this.openVisualStage({ studyId: study?.id, clip: '15s' });

    if (this.mode === 'debate') {
      await this.startDebate(this.activeStudyId);
      return;
    }
    if (this.mode === 'copilot') {
      await this.startPageCoPilot(this.activeStudyId);
      return;
    }
    if (this.mode === 'vision' && !this.visionStream) {
      await this.startCamera(this.cameraFacing);
    }

    const secHint = dom.visibleSection ? ` I see "${dom.visibleSection.heading}" on ${this.surface.domain}.` : '';
    const greeting =
      `Connected to ${this.surface.name} Live Co-Pilot, grounded in ${this.studiesById.size || 28} research studies and ${this.blogById.size || 57} Chronicle entries.${secHint} ` +
      (study ? `Active study: ${study.short_title} (${study.evidence_class}). ` : '') +
      `Ask anything, tour this page, run a Skeptic Debate, or interrupt me mid-sentence.`;

    await this._deliverAssistantTurn({
      speakerName: VOICE_PERSONAS[this.voice].name,
      speakerRole: `${VOICE_PERSONAS[this.voice].role} · ${this.surface.id}`,
      voice: this.voice,
      text: greeting,
      study,
      blog,
    });
  }

  endCall() {
    this.bargeIn('silent-reset');
    this.callActive = false;
    this._stopWebSpeechRecognition();
    if (this.vadTimer) {
      clearInterval(this.vadTimer);
      this.vadTimer = null;
    }
    if (this.pcmWorkletNode) {
      try {
        this.pcmWorkletNode.disconnect();
      } catch {}
      this.pcmWorkletNode = null;
    }
    if (this.micStream) {
      this.micStream.getTracks().forEach((t) => t.stop());
      this.micStream = null;
    }
    this.stopVision();
    this.state = 'idle';
    this.emit('interim', { text: '' });
    this._emitState();
    this._emitTelemetry();
  }

  toggleMute() {
    this.micMuted = !this.micMuted;
    if (this.micStream) {
      this.micStream.getAudioTracks().forEach((t) => {
        t.enabled = !this.micMuted;
      });
    }
    if (this.micMuted) this._stopWebSpeechRecognition();
    else if (this.callActive) this._startWebSpeechRecognition();
    this._emitState();
    return this.micMuted;
  }

  setMode(mode) {
    if (!['call', 'vision', 'copilot', 'debate'].includes(mode)) return;
    this.bargeIn('silent-reset');
    this.mode = mode;
    this._emitState();
  }

  setStudy(studyId) {
    if (!this.studiesById.has(studyId)) return;
    this.activeStudyId = studyId;
    this.copilotStep = 0;
    this.debateTurn = 0;
    this.openVisualStage({ studyId, clip: '15s' });
    this._emitState();
  }

  setVoice(voiceId) {
    if (!VOICE_PERSONAS[voiceId]) return;
    this.voice = voiceId;
    this._emitState();
  }

  async _deliverAssistantTurn({ speakerName, speakerRole, voice, text, study, blog, signal }) {
    const turnItem = {
      id: `eco-turn-${++this.turnCounter}`,
      role: 'assistant',
      speakerName,
      speakerRole,
      voice: voice || this.voice,
      text,
      studyId: study?.id || blog?.id || this.activeStudyId,
      receipt: this.makeReceipt(study, blog),
      ts: Date.now(),
    };
    this.transcript.push(turnItem);
    this.emit('turn', turnItem);

    const ctrl = signal ? null : new AbortController();
    if (ctrl) this.turnAbort = ctrl;
    const activeSignal = signal || ctrl.signal;

    await this.speakStream(text, {
      voice: voice || this.voice,
      speed: this.speed,
      signal: activeSignal,
    });

    if (!activeSignal.aborted) {
      this.state = this.callActive ? 'listening' : 'idle';
      this._emitState();
    }
  }

  async ask(queryText, opts = {}) {
    await this.loadCorpora();
    const cleanQ = String(queryText || '').trim();
    if (!cleanQ) return null;

    this.bargeIn('silent-reset');
    if (!this.lastTurnCommitAt) this.lastTurnCommitAt = performance.now();

    const userTurn = {
      id: `eco-turn-${++this.turnCounter}`,
      role: 'user',
      speakerName: 'You',
      speakerRole: opts.fromVoice ? 'Live Voice' : this.surface.domain,
      text: cleanQ,
      ts: Date.now(),
    };
    this.transcript.push(userTurn);
    this.emit('turn', userTurn);

    this.state = 'thinking';
    this._emitState();
    this._bumpBrowserHeuristic(0.006);

    const qLower = cleanQ.toLowerCase();

    if (/\b(camera|webcam|screen|frame|holding|look at|inspect my)\b/.test(qLower)) {
      if (/\bscreen\b/.test(qLower) && !this.visionStream) {
        await this.startScreenShare();
      }
      return this.analyzeFrameNow(cleanQ);
    }

    const hits = this.searchKnowledge(cleanQ, 3);
    const bestDoc = hits[0]?.score >= 3.0 ? hits[0].doc : null;
    const matchedStudy =
      bestDoc?.study ||
      this.studiesById.get(this.activeStudyId) ||
      this.studiesById.get(this.surface.primaryStudyId) ||
      this.researchCorpus?.studies?.[0];
    const matchedBlog = bestDoc?.blog || (matchedStudy ? this.blogById.get(matchedStudy.id) : null);

    if (matchedStudy && matchedStudy.id !== this.activeStudyId) {
      this.activeStudyId = matchedStudy.id;
      this._emitState();
    }

    if (/\b(debate|skeptic|skeptical|reviewer|challenge|argue)\b/.test(qLower)) {
      this.mode = 'debate';
      this._emitState();
      return this.startDebate(matchedStudy?.id);
    }

    if (/\b(walk me through|walkthrough|tour|step by step|section by section|co-pilot|copilot)\b/.test(qLower)) {
      this.mode = 'copilot';
      this._emitState();
      return this.startPageCoPilot(matchedStudy?.id);
    }

    if (
      (qLower.includes('measured_j') && qLower.includes('reported_j')) ||
      /\b(evidence class|orthogonal|never summed|across the corpus|28 studies|57 entries)\b/.test(qLower)
    ) {
      const counts = this.researchCorpus?.evidence_class_counts || {
        measured_j: 7,
        reported_j: 10,
        est_j: 1,
        unmetered: 10,
      };
      const text =
        `Across the 28 OpenIE research studies and 57 Chronicle entries, energy claims follow strict non-mixing orthogonality (measured_j orthogonal to reported_j orthogonal to est_j orthogonal to unmetered): ` +
        `${counts.measured_j} studies carry physical DC current-shunt readings in measured_j (AMD Kria KV260 TI INA260 and NVIDIA Jetson AGX Thor TI INA3221/INA238), ` +
        `${counts.reported_j} report chip or OS counters in reported_j (Apple ri_energy_nj, Linux RAPL, NVML), ` +
        `${counts.est_j} reports electro-thermal simulation in est_j, and ${counts.unmetered} formal or archival studies remain unmetered with joules equal to null.`;
      const satb = this.studiesById.get('satb-harness') || matchedStudy;
      this.openVisualStage({ studyId: satb?.id, clip: '15s' });
      await this._deliverAssistantTurn({
        speakerName: VOICE_PERSONAS[this.voice].name,
        speakerRole: VOICE_PERSONAS[this.voice].role,
        voice: this.voice,
        text,
        study: satb,
        blog: satb ? this.blogById.get(satb.id) : matchedBlog,
      });
      return text;
    }

    const domSec = this.findBestDomSection(cleanQ);
    if (domSec) {
      this.spotlightDomElement(domSec.key);
    }

    let reply = '';
    let clip = '15s';

    if (domSec && /\b(this page|section|table|simulator|here|heading)\b/.test(qLower)) {
      reply =
        `On ${this.surface.domain}, spotlighting "${domSec.heading}". ` +
        (domSec.snippet ? `${domSec.snippet.slice(0, 230)}. ` : '') +
        (matchedStudy
          ? `In the underlying study ${matchedStudy.short_title} (${matchedStudy.evidence_class}), note the scope boundary: ${matchedStudy.limitations_and_scope.split('.')[0]}.`
          : '');
    } else if (/\b(falsifier|limitation|negative|fail|replicate|caveat|scope|errata|escape)\b/.test(qLower) && matchedStudy) {
      reply =
        `Post-review scope and errata for ${matchedStudy.short_title} (${matchedStudy.evidence_class}, Signed Provenance · Self-Checked): ${matchedStudy.limitations_and_scope}`;
      clip = '45s';
    } else if (/\b(method|meter|sensor|shunt|hardware|baseline|sample size)\b/.test(qLower) && matchedStudy) {
      reply =
        `Methods and telemetry for ${matchedStudy.short_title}: ${matchedStudy.methods_and_meter} ${matchedStudy.baseline_comparison}`;
      clip = '45s';
    } else if (/\b(tiktok|vertical|reel|9:16)\b/.test(qLower) && matchedStudy) {
      reply =
        `Playing the 9 by 16 vertical edition of ${matchedStudy.short_title}. ${(matchedStudy.plain_bullets || []).join(' ')} Headline result: ${matchedStudy.headline_metric}.`;
      clip = 'tiktok';
    } else if (matchedStudy) {
      const domLead = domSec ? `Alongside "${domSec.heading}" on this page: ` : '';
      reply =
        `${domLead}${matchedStudy.short_title} (${matchedStudy.evidence_class}): ${matchedStudy.headline_claim} ` +
        `Scope note: ${matchedStudy.limitations_and_scope.split('.')[0]}.`;
      clip = '15s';
    } else if (matchedBlog) {
      reply =
        `From the OpenIE Chronicle entry "${matchedBlog.shortTitle || matchedBlog.title}" (${matchedBlog.energyClass || 'unmetered'}): ${matchedBlog.primaryClaim || matchedBlog.description}`;
    } else {
      reply =
        `You are exploring ${this.surface.name} (${this.surface.domain}): ${this.surface.tagline}. Ask about any section, table, or study claim on this page.`;
    }

    if (matchedStudy) this.openVisualStage({ studyId: matchedStudy.id, clip });
    await this._deliverAssistantTurn({
      speakerName: VOICE_PERSONAS[this.voice].name,
      speakerRole: VOICE_PERSONAS[this.voice].role,
      voice: this.voice,
      text: reply,
      study: matchedStudy,
      blog: matchedBlog,
    });
    return reply;
  }

  async startPageCoPilot(studyId) {
    await this.loadCorpora();
    const dom = this.refreshLiveDomIndex();
    const study =
      this.studiesById.get(studyId || this.activeStudyId) ||
      this.studiesById.get(this.surface.primaryStudyId) ||
      this.researchCorpus?.studies?.[0];
    const blog = study ? this.blogById.get(study.id) : null;
    if (study) this.activeStudyId = study.id;

    this.mode = 'copilot';
    this.copilotStep = 0;
    this.bargeIn('silent-reset');
    this.lastTurnCommitAt = performance.now();
    this._emitState();

    const ctrl = new AbortController();
    this.turnAbort = ctrl;

    const topSections = dom.sections.slice(0, 3);
    const clips = ['15s', 'tiktok', '45s'];
    const voices = ['af_bella', 'am_adam', 'af_heart'];

    const beats = topSections.length
      ? topSections.map((sec, idx) => {
          const extraSim = idx === 1 && dom.simulators[0] ? ` Interactive module detected: "${dom.simulators[0].label}".` : '';
          const extraTbl = idx === 1 && dom.tables[0]?.headers ? ` Table columns: ${dom.tables[0].headers}.` : '';
          const studyTie =
            idx === 0 && study
              ? ` Cueing the 15-second Research TV proof for ${study.short_title} (${study.evidence_class}).`
              : idx === 1 && study
              ? ` Cueing the 9 by 16 vertical clip; key metric: ${study.headline_metric}.`
              : idx === 2 && study
              ? ` Scope boundary under Signed Provenance · Self-Checked: ${study.limitations_and_scope.split('.')[0]}.`
              : '';
          return {
            domKey: sec.key,
            clip: clips[idx % clips.length],
            voice: voices[idx % voices.length],
            role: `Page Co-Pilot · Section ${idx + 1}/${topSections.length}`,
            text:
              `Section ${idx + 1} on ${this.surface.domain}: "${sec.heading}". ` +
              (sec.snippet ? `${sec.snippet.slice(0, 200)}.` : '') +
              extraSim +
              extraTbl +
              studyTie,
          };
        })
      : [
          {
            domKey: null,
            clip: '15s',
            voice: 'af_bella',
            role: `Page Co-Pilot · ${this.surface.name}`,
            text: `${this.surface.name} (${this.surface.domain}): ${this.surface.tagline}. ${study ? (study.plain_bullets || []).join(' ') : ''}`,
          },
          {
            domKey: null,
            clip: 'tiktok',
            voice: 'af_heart',
            role: 'Systems Lead · Scope & Provenance',
            text: study
              ? `For ${study.short_title} (${study.evidence_class}), ${study.methods_and_meter} Scope limit: ${study.limitations_and_scope.split('.')[0]}.`
              : 'All energy evidence classes remain strictly orthogonal.',
          },
        ];

    for (let i = 0; i < beats.length; i++) {
      if (ctrl.signal.aborted) return;
      this.copilotStep = i + 1;
      const b = beats[i];
      if (b.domKey) this.spotlightDomElement(b.domKey);
      if (study) this.openVisualStage({ studyId: study.id, clip: b.clip });
      await this._deliverAssistantTurn({
        speakerName: VOICE_PERSONAS[b.voice].name,
        speakerRole: b.role,
        voice: b.voice,
        text: b.text,
        study,
        blog,
        signal: ctrl.signal,
      });
      if (ctrl.signal.aborted) return;
      await new Promise((r) => setTimeout(r, 380));
    }

    if (!ctrl.signal.aborted) {
      this.state = this.callActive ? 'listening' : 'idle';
      this._emitState();
    }
  }

  async startDebate(studyId) {
    await this.loadCorpora();
    const study =
      this.studiesById.get(studyId || this.activeStudyId) ||
      this.studiesById.get(this.surface.primaryStudyId) ||
      this.researchCorpus?.studies?.[0];
    if (!study) return;
    const blog = this.blogById.get(study.id) || null;
    this.activeStudyId = study.id;
    this.mode = 'debate';
    this.debateTurn = 0;
    this.bargeIn('silent-reset');
    this.lastTurnCommitAt = performance.now();
    this._emitState();

    const ctrl = new AbortController();
    this.turnAbort = ctrl;

    const rounds = [
      {
        voice: 'bm_george',
        speakerName: 'George',
        speakerRole: 'Outside-Review Skeptic · Round 1',
        clip: '15s',
        text: study.skeptic_question,
      },
      {
        voice: 'af_heart',
        speakerName: 'Heart',
        speakerRole: 'Systems Lead · Round 1 Response',
        clip: '45s',
        text: study.architect_answer,
      },
      {
        voice: 'bm_george',
        speakerName: 'George',
        speakerRole: 'Outside-Review Skeptic · Round 2 Follow-Up',
        clip: 'tiktok',
        text: study.skeptic_followup,
      },
      {
        voice: 'af_heart',
        speakerName: 'Heart',
        speakerRole: 'Systems Lead · Closing Scope Receipt',
        clip: 'tiktok',
        text: `${study.architect_rebuttal} Jump in by voice or text anytime to press either of us further.`,
      },
    ];

    for (let i = 0; i < rounds.length; i++) {
      if (ctrl.signal.aborted) return;
      this.debateTurn = i + 1;
      const r = rounds[i];
      if (i === 0 || i === 2) {
        this.openVisualStage({ studyId: study.id, clip: r.clip });
      }
      await this._deliverAssistantTurn({
        speakerName: r.speakerName,
        speakerRole: r.speakerRole,
        voice: r.voice,
        text: r.text,
        study,
        blog,
        signal: ctrl.signal,
      });
      if (ctrl.signal.aborted) return;
      await new Promise((res) => setTimeout(res, 300));
    }

    if (!ctrl.signal.aborted) {
      this.state = this.callActive ? 'listening' : 'idle';
      this._emitState();
    }
  }

  // ---------- 60fps Canvas2D Harmonic Plasma Orb ----------
  attachOrbCanvas(canvas) {
    if (!canvas) return () => {};
    this.orbCanvases.add(canvas);
    if (!this.orbRaf) this._startOrbLoop();
    return () => {
      this.orbCanvases.delete(canvas);
      if (!this.orbCanvases.size && this.orbRaf) {
        cancelAnimationFrame(this.orbRaf);
        this.orbRaf = null;
      }
    };
  }

  _startOrbLoop() {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    const tick = () => {
      if (!this.orbCanvases.size) {
        this.orbRaf = null;
        return;
      }
      this.orbPhase += reduced ? 0.005 : 0.032;
      let amp = 0.08;
      if (this.state === 'speaking') {
        if (this.ttsAnalyser && this.ttsFreqBins && this.activeBufferSource) {
          this.ttsAnalyser.getByteFrequencyData(this.ttsFreqBins);
          let s = 0;
          for (let i = 2; i < 48; i++) s += this.ttsFreqBins[i] / 255;
          amp = 0.16 + (s / 46) * 0.84;
        } else {
          amp = Math.max(0.18, this.syntheticSpeechEnv);
        }
      } else if (this.state === 'listening' && this.micAnalyser && this.micFreqBins && !this.micMuted) {
        this.micAnalyser.getByteFrequencyData(this.micFreqBins);
        let s = 0;
        for (let i = 4; i < 52; i++) s += this.micFreqBins[i] / 255;
        amp = 0.1 + (s / 48) * 0.85;
      } else if (this.state === 'thinking') {
        amp = 0.28 + 0.18 * Math.sin(this.orbPhase * 3.2);
      }

      for (const c of this.orbCanvases) this._drawOrb(c, amp);
      this.orbRaf = requestAnimationFrame(tick);
    };
    this.orbRaf = requestAnimationFrame(tick);
  }

  _drawOrb(canvas, amp) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssW = canvas.clientWidth || 76;
    const cssH = canvas.clientHeight || 76;
    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssW, cssH);

    const cx = cssW / 2;
    const cy = cssH / 2;
    const baseR = Math.min(cssW, cssH) * 0.29;

    let primary = '0, 212, 170';
    let secondary = '245, 158, 11';
    if (this.state === 'speaking') {
      primary = this.mode === 'debate' && this.debateTurn % 2 === 1 ? '0, 212, 170' : '245, 158, 11';
      secondary = '129, 140, 248';
    } else if (this.state === 'thinking') {
      primary = '129, 140, 248';
      secondary = '0, 212, 170';
    } else if (!this.callActive) {
      primary = '148, 163, 184';
      secondary = '0, 212, 170';
    }

    const outerR = baseR * (1.45 + amp * 0.42);
    const halo = ctx.createRadialGradient(cx, cy, baseR * 0.25, cx, cy, outerR);
    halo.addColorStop(0, `rgba(${primary}, ${0.34 + amp * 0.28})`);
    halo.addColorStop(0.55, `rgba(${secondary}, ${0.12 + amp * 0.16})`);
    halo.addColorStop(1, 'rgba(10, 10, 15, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    for (let ring = 0; ring < 3; ring++) {
      ctx.beginPath();
      const pts = 64;
      const rScale = baseR * (0.86 + ring * 0.13 + amp * 0.18);
      for (let i = 0; i <= pts; i++) {
        const theta = (i / pts) * Math.PI * 2;
        const w1 = Math.sin(theta * (3 + ring) + this.orbPhase * (1.4 + ring * 0.4));
        const w2 = Math.cos(theta * (5 - ring) - this.orbPhase * 1.9);
        const r = rScale * (1 + amp * 0.22 * (0.6 * w1 + 0.4 * w2));
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle =
        ring === 0
          ? `rgba(${primary}, 0.85)`
          : ring === 1
          ? `rgba(${secondary}, 0.55)`
          : `rgba(255, 255, 255, ${0.22 + amp * 0.25})`;
      ctx.lineWidth = ring === 0 ? 2.0 : 1.2;
      ctx.stroke();
    }

    const coreR = baseR * (0.68 + amp * 0.14);
    const coreGrad = ctx.createRadialGradient(cx - coreR * 0.2, cy - coreR * 0.2, coreR * 0.08, cx, cy, coreR);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
    coreGrad.addColorStop(0.4, `rgba(${primary}, 0.78)`);
    coreGrad.addColorStop(1, 'rgba(11, 16, 29, 0.94)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fill();

    if (this.visionStream) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-this.orbPhase * 0.35);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.78)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 1.28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }
}

// ---------- Shadow DOM Scoped Styles & UI Mount ----------

const SHADOW_CSS = `
  :host {
    all: initial;
    position: fixed;
    right: 18px;
    bottom: 18px;
    z-index: 2147483000;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #F8FAFC;
    line-height: 1.45;
  }
  *, *::before, *::after { box-sizing: border-box; }
  .hidden { display: none !important; }

  .pill-btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 10px 16px;
    border-radius: 9999px;
    background: rgba(11, 16, 29, 0.94);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(52, 211, 153, 0.48);
    color: #F8FAFC;
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 212, 170, 0.14);
    cursor: pointer;
    transition: transform 0.16s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .pill-btn:hover {
    transform: translateY(-1px);
    border-color: #F59E0B;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.65), 0 0 18px rgba(245, 158, 11, 0.22);
  }
  .pill-btn:focus-visible, button:focus-visible, select:focus-visible, input:focus-visible, a:focus-visible {
    outline: 2px solid #F59E0B;
    outline-offset: 2px;
  }
  .dot-wrap { position: relative; width: 10px; height: 10px; display: inline-flex; }
  .dot-ping {
    position: absolute; inset: 0; border-radius: 9999px;
    background: #34D399; opacity: 0.72;
    animation: oePing 1.9s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  .dot-core { position: relative; width: 10px; height: 10px; border-radius: 9999px; background: #34D399; }
  @keyframes oePing {
    75%, 100% { transform: scale(2.1); opacity: 0; }
  }
  .pill-label {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
    font-weight: 600;
    color: #6EE7B7;
    letter-spacing: -0.01em;
  }
  .pill-kbd {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.09);
    color: #94A3B8;
  }

  .panel {
    width: min(425px, calc(100vw - 24px));
    max-height: min(760px, calc(100dvh - 36px));
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    background: rgba(10, 15, 28, 0.97);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(0, 212, 170, 0.38);
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.72);
    overflow: hidden;
  }
  .hdr {
    padding: 10px 13px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(255, 255, 255, 0.025);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .hdr-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .hdr-brand {
    display: flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
  }
  .hdr-title {
    font-weight: 700;
    font-size: 12.5px;
    color: #FFFFFF;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .badge-prov {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9.5px;
    padding: 2px 6px;
    border-radius: 5px;
    background: rgba(245, 158, 11, 0.14);
    border: 1px solid rgba(245, 158, 11, 0.36);
    color: #FBBF24;
    white-space: nowrap;
  }
  .hdr-links {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    flex-wrap: wrap;
  }
  .qlinks { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
  .qlink {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    padding: 2px 7px;
    border-radius: 5px;
    text-decoration: none;
    border: 1px solid rgba(0, 212, 170, 0.34);
    color: #5EEAD4;
    background: rgba(0, 212, 170, 0.07);
    transition: background 0.15s, border-color 0.15s;
  }
  .qlink:hover { background: rgba(0, 212, 170, 0.18); border-color: #00D4AA; }
  .qlink-amber {
    border-color: rgba(245, 158, 11, 0.38);
    color: #FCD34D;
    background: rgba(245, 158, 11, 0.08);
  }
  .qlink-amber:hover { background: rgba(245, 158, 11, 0.2); border-color: #F59E0B; }
  .close-btn {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 6px;
    border: 1px solid rgba(148, 163, 184, 0.26);
    background: transparent;
    color: #94A3B8;
    cursor: pointer;
  }
  .close-btn:hover { color: #FFFFFF; border-color: #94A3B8; }

  .body {
    padding: 11px 12px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 9px;
    flex: 1;
  }
  .modes {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 5px;
  }
  .mode-btn {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10.5px;
    padding: 6px 4px;
    border-radius: 7px;
    border: 1px solid rgba(148, 163, 184, 0.22);
    background: rgba(255, 255, 255, 0.025);
    color: #94A3B8;
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
  }
  .mode-btn.active {
    border-color: rgba(0, 212, 170, 0.72);
    background: rgba(0, 212, 170, 0.16);
    color: #FFFFFF;
    font-weight: 600;
  }

  .selectors { display: flex; gap: 6px; }
  .sel {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    padding: 6px 8px;
    border-radius: 8px;
    background: #060A13;
    border: 1px solid rgba(148, 163, 184, 0.25);
    color: #F8FAFC;
    min-width: 0;
  }
  .sel-study { flex: 1; }
  .sel-voice { color: #FBBF24; width: 130px; flex-shrink: 0; }

  .orb-deck {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 9px 10px;
    border-radius: 12px;
    background: rgba(6, 10, 19, 0.9);
    border: 1px solid rgba(148, 163, 184, 0.2);
  }
  .orb-btn {
    width: 76px;
    height: 76px;
    padding: 0;
    border: none;
    border-radius: 9999px;
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
  }
  .orb-canvas { width: 76px; height: 76px; display: block; }
  .orb-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .state-line {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    color: #2DD4BF;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ctrl-row { display: flex; flex-wrap: wrap; gap: 5px; }
  .cbtn {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10.5px;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid rgba(148, 163, 184, 0.28);
    background: rgba(255, 255, 255, 0.04);
    color: #E2E8F0;
    cursor: pointer;
  }
  .cbtn-start {
    background: #34D399;
    border-color: #34D399;
    color: #05120E;
    font-weight: 700;
  }
  .cbtn-end {
    background: #F43F5E;
    border-color: #F43F5E;
    color: #FFFFFF;
    font-weight: 700;
  }
  .cbtn-barge {
    border-color: rgba(245, 158, 11, 0.48);
    background: rgba(245, 158, 11, 0.12);
    color: #FBBF24;
  }
  .interim {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    color: #6EE7B7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .vision-box {
    border-radius: 11px;
    border: 1px solid rgba(52, 211, 153, 0.45);
    background: #000;
    overflow: hidden;
  }
  .vision-bar {
    padding: 5px 9px;
    background: rgba(16, 185, 129, 0.14);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    color: #6EE7B7;
  }
  .vision-video { width: 100%; height: 118px; object-fit: cover; display: block; }

  .stage-box {
    border-radius: 11px;
    border: 1px solid rgba(148, 163, 184, 0.22);
    background: rgba(6, 10, 19, 0.85);
    overflow: hidden;
  }
  .stage-sum {
    padding: 6px 10px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10.5px;
    color: #FBBF24;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
  }
  .stage-sum::-webkit-details-marker { display: none; }
  .stage-inner {
    padding: 8px;
    border-top: 1px solid rgba(148, 163, 184, 0.18);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .stage-video { width: 100%; max-height: 180px; border-radius: 7px; background: #000; }

  .transcript {
    display: flex;
    flex-direction: column;
    gap: 7px;
    max-height: 195px;
    overflow-y: auto;
    padding-right: 3px;
  }
  .turn-user {
    margin-left: 22px;
    padding: 7px 10px;
    border-radius: 9px;
    border: 1px solid rgba(0, 212, 170, 0.32);
    background: rgba(0, 212, 170, 0.09);
    font-size: 11.5px;
    color: #FFFFFF;
  }
  .turn-ai {
    padding: 8px 10px;
    border-radius: 9px;
    border: 1px solid rgba(148, 163, 184, 0.22);
    background: rgba(255, 255, 255, 0.03);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .turn-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9.5px;
  }
  .turn-spk { color: #FBBF24; font-weight: 700; }
  .ev-badge {
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    color: #CBD5E1;
    background: rgba(255, 255, 255, 0.05);
  }
  .ev-measured_j { border-color: rgba(52, 211, 153, 0.45); color: #6EE7B7; background: rgba(16, 185, 129, 0.14); }
  .ev-reported_j { border-color: rgba(0, 212, 170, 0.45); color: #5EEAD4; background: rgba(0, 212, 170, 0.14); }
  .ev-est_j { border-color: rgba(245, 158, 11, 0.45); color: #FCD34D; background: rgba(245, 158, 11, 0.14); }
  .turn-txt { font-size: 11.5px; color: #E2E8F0; line-height: 1.45; }
  .turn-orth {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9px;
    color: #64748B;
  }

  .chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .chip {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 10px;
    padding: 3px 8px;
    border-radius: 9999px;
    border: 1px solid rgba(148, 163, 184, 0.24);
    background: rgba(255, 255, 255, 0.025);
    color: #CBD5E1;
    cursor: pointer;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chip:hover { border-color: #F59E0B; color: #FFFFFF; }

  .ftr {
    padding: 9px 12px;
    border-top: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(6, 10, 19, 0.96);
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .ask-form { display: flex; gap: 6px; }
  .ask-inp {
    flex: 1;
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 8px;
    border: 1px solid rgba(148, 163, 184, 0.28);
    background: #0C1220;
    color: #FFFFFF;
  }
  .ask-btn {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 12px;
    border-radius: 8px;
    border: none;
    background: #F59E0B;
    color: #090D16;
    cursor: pointer;
  }
  .tel-line {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 9.2px;
    color: #64748B;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

function wireTriggerButtons(openFn, sdk) {
  if (typeof document === 'undefined' || window.__openieEcoTriggerBound) return;
  window.__openieEcoTriggerBound = true;

  document.addEventListener('click', async (ev) => {
    const btn = ev.target?.closest?.('[data-openie-live-trigger]');
    if (!btn) return;
    ev.preventDefault();
    const reqMode = btn.getAttribute('data-openie-live-mode') || btn.getAttribute('data-openie-live-trigger') || 'call';
    const reqStudy = btn.getAttribute('data-openie-live-study') || '';
    const reqPrompt = btn.getAttribute('data-openie-live-prompt') || '';
    const autostart = btn.getAttribute('data-openie-live-autostart') !== 'false';

    openFn(true);
    if (!sdk) return;
    await sdk.loadCorpora();
    if (reqStudy && sdk.studiesById.has(reqStudy)) {
      sdk.setStudy(reqStudy);
    }
    const cleanMode = ['call', 'vision', 'copilot', 'debate'].includes(reqMode) ? reqMode : 'call';
    sdk.setMode(cleanMode);
    if (reqPrompt) {
      sdk.ask(reqPrompt);
    } else if (autostart) {
      sdk.startCall({ studyId: sdk.activeStudyId, mode: cleanMode });
    }
  });
}

export function mountOpenIEEcosystemDock(options = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;

  // Auto-skip mounting floating UI if a host dock already exists on the page
  if (!options.force) {
    if (
      document.getElementById('openie-live-dock') ||
      document.getElementById('openie-live-dock-root') ||
      document.getElementById('ai-assistant-root') ||
      document.getElementById('openie-ecosystem-dock-host')
    ) {
      wireTriggerButtons(
        () => {
          window.openieLiveDock?.open?.();
          window.dispatchEvent(new CustomEvent('openie:open-live-dock'));
        },
        window.openieLiveHMI || null
      );
      return window.openieEcosystemDock || null;
    }
    const cleanPath = window.location.pathname.replace(/\/+$/, '');
    if (window.location.hostname === 'research.openie.dev' && cleanPath === '/live') {
      return null;
    }
  }

  const sdk = new OpenIEEcosystemSDK(options);
  if (!window.openieLiveHMI) {
    window.openieLiveHMI = sdk;
  }

  const host = document.createElement('div');
  host.id = 'openie-ecosystem-dock-host';
  host.setAttribute('data-openie-surface', sdk.surface.id);
  const shadow = host.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = SHADOW_CSS;
  shadow.appendChild(styleEl);

  const wrap = document.createElement('nav');
  wrap.setAttribute('aria-label', `${sdk.surface.name} Live Voice, Vision & Page Co-Pilot`);
  wrap.innerHTML = `
    <button id="oe-pill" class="pill-btn" type="button" aria-expanded="false" aria-controls="oe-panel" title="Open Live Voice, Camera & Page Co-Pilot (Cmd/Ctrl + Shift + V)">
      <span class="dot-wrap"><span class="dot-ping"></span><span class="dot-core"></span></span>
      <span class="pill-label">📞 Live Call · Video</span>
      <kbd class="pill-kbd">⌘⇧V</kbd>
    </button>
    <div id="oe-panel" class="panel hidden" role="dialog" aria-label="${escHtml(sdk.surface.name)} Multimodal Co-Pilot"></div>
  `;
  shadow.appendChild(wrap);
  document.body.appendChild(host);

  const pill = shadow.getElementById('oe-pill');
  const panel = shadow.getElementById('oe-panel');
  let isOpen = false;
  let panelMounted = false;

  function mountPanel() {
    if (panelMounted) return;
    panelMounted = true;
    const prompts = sdk.surface.prompts || SURFACE_PROFILES.avalanche.prompts;

    panel.innerHTML = `
      <div class="hdr">
        <div class="hdr-top">
          <div class="hdr-brand">
            <span class="dot-core"></span>
            <span class="hdr-title">${escHtml(sdk.surface.name)} · Live Co-Pilot</span>
            <span class="badge-prov" title="Signed Provenance · Self-Checked (not external peer review)">Self-Checked</span>
          </div>
          <button id="oe-close" class="close-btn" type="button" aria-label="Minimize dock">✕</button>
        </div>
        <div class="hdr-links">
          <div class="qlinks">
            <a id="oe-link-studio" class="qlink" href="${RESEARCH_ORIGIN}/live/?study=${encodeURIComponent(sdk.activeStudyId)}" target="_blank" rel="noopener">Full Studio ↗</a>
            <a id="oe-link-chronicle" class="qlink qlink-amber" href="${BLOG_ORIGIN}" target="_blank" rel="noopener">Chronicle (57) ↗</a>
            <a id="oe-link-verify" class="qlink" href="${BLOG_ORIGIN}/verification/" target="_blank" rel="noopener">Verification ↗</a>
          </div>
        </div>
      </div>

      <div class="body">
        <div class="modes" role="tablist" aria-label="Interaction mode">
          <button type="button" class="mode-btn active" data-mode="call">📞 Live Call</button>
          <button type="button" class="mode-btn" data-mode="vision">📹 Vision</button>
          <button type="button" class="mode-btn" data-mode="copilot">🧭 Co-Pilot</button>
          <button type="button" class="mode-btn" data-mode="debate">🎙 Debate</button>
        </div>

        <div class="selectors">
          <select id="oe-study-sel" class="sel sel-study" aria-label="Active research study">
            <option value="${escHtml(sdk.activeStudyId)}">Loading 28 studies + 57 Chronicle entries...</option>
          </select>
          <select id="oe-voice-sel" class="sel sel-voice" aria-label="Neural voice persona">
            <option value="af_heart">Heart (Lead)</option>
            <option value="bm_george">George (Skeptic)</option>
            <option value="af_bella">Bella (Co-Pilot)</option>
            <option value="am_adam">Adam (Hardware)</option>
          </select>
        </div>

        <div class="orb-deck">
          <button id="oe-orb-btn" class="orb-btn" type="button" aria-label="Start live voice call or interrupt speaker">
            <canvas id="oe-orb-canvas" class="orb-canvas"></canvas>
          </button>
          <div class="orb-meta">
            <div id="oe-state" class="state-line">READY · ${escHtml(sdk.surface.domain.toUpperCase())}</div>
            <div class="ctrl-row">
              <button id="oe-call-btn" type="button" class="cbtn cbtn-start">📞 Start</button>
              <button id="oe-barge-btn" type="button" class="cbtn cbtn-barge" title="Interrupt speaker (<100ms)">✋ Barge-In</button>
              <button id="oe-mute-btn" type="button" class="cbtn" title="Mute/unmute microphone">🎙</button>
              <button id="oe-cam-btn" type="button" class="cbtn" title="Live camera vision">📷</button>
              <button id="oe-scr-btn" type="button" class="cbtn" title="Live screen share vision">🖥</button>
            </div>
            <div id="oe-interim" class="interim hidden"></div>
          </div>
        </div>

        <div id="oe-vision-box" class="vision-box hidden">
          <div class="vision-bar">
            <span id="oe-vision-meta">Camera / Screen Active</span>
            <div class="ctrl-row">
              <button id="oe-snap-btn" type="button" class="cbtn cbtn-start">📸 Inspect</button>
              <button id="oe-flip-btn" type="button" class="cbtn" title="Flip camera">🔄</button>
              <button id="oe-vis-close" type="button" class="cbtn">✕</button>
            </div>
          </div>
          <video id="oe-vision-video" class="vision-video" autoplay muted playsinline></video>
        </div>

        <details id="oe-stage" class="stage-box">
          <summary class="stage-sum">
            <span id="oe-stage-title">🎬 Research TV Clip Stage (15s · 45s · 9:16)</span>
            <span>▾</span>
          </summary>
          <div class="stage-inner">
            <div class="ctrl-row">
              <button type="button" class="cbtn" data-clip="15s">15s Plain</button>
              <button type="button" class="cbtn" data-clip="45s">45s Story</button>
              <button type="button" class="cbtn" data-clip="tiktok">📱 9:16 Reel</button>
              <a id="oe-tv-deeplink" class="qlink" href="${RESEARCH_ORIGIN}/tv/" target="_blank" rel="noopener">Open TV ↗</a>
            </div>
            <video id="oe-stage-video" class="stage-video" controls muted playsinline preload="none"></video>
          </div>
        </details>

        <div id="oe-transcript" class="transcript">
          <div class="turn-ai">
            <div class="turn-hdr">
              <span class="turn-spk">${escHtml(sdk.surface.name)}</span>
              <span class="ev-badge">Signed Provenance · Self-Checked</span>
            </div>
            <div class="turn-txt">
              Grounded in <strong>${escHtml(sdk.surface.domain)}</strong> live DOM (${sdk.domIndex.sections.length} sections), 28 Research studies, and 57 Chronicle entries. Start a voice call, tour this page, or launch a 2-voice Skeptic Debate.
            </div>
            <div class="turn-orth">measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered</div>
          </div>
        </div>

        <div class="chips">
          ${prompts.map((p) => `<button type="button" class="chip" data-prompt="${escHtml(p)}">${escHtml(p)}</button>`).join('')}
        </div>
      </div>

      <div class="ftr">
        <form id="oe-form" class="ask-form">
          <input id="oe-input" class="ask-inp" type="text" placeholder="Ask about this page, study, or claim..." aria-label="Ask OpenIE Co-Pilot" />
          <button type="submit" class="ask-btn">Ask</button>
        </form>
        <div id="oe-tel" class="tel-line">VAD -60dB · Instant WebSpeech + Kokoro-82M · measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered</div>
      </div>
    `;

    const orbCanvas = shadow.getElementById('oe-orb-canvas');
    const visionVideo = shadow.getElementById('oe-vision-video');
    const studySel = shadow.getElementById('oe-study-sel');
    const voiceSel = shadow.getElementById('oe-voice-sel');
    const callBtn = shadow.getElementById('oe-call-btn');
    const muteBtn = shadow.getElementById('oe-mute-btn');
    const stateEl = shadow.getElementById('oe-state');
    const interimEl = shadow.getElementById('oe-interim');
    const visionBox = shadow.getElementById('oe-vision-box');
    const visionMeta = shadow.getElementById('oe-vision-meta');
    const stageEl = shadow.getElementById('oe-stage');
    const stageTitle = shadow.getElementById('oe-stage-title');
    const stageVideo = shadow.getElementById('oe-stage-video');
    const tvDeepLink = shadow.getElementById('oe-tv-deeplink');
    const studioLink = shadow.getElementById('oe-link-studio');
    const chronicleLink = shadow.getElementById('oe-link-chronicle');
    const transcriptEl = shadow.getElementById('oe-transcript');
    const telEl = shadow.getElementById('oe-tel');

    sdk.attachOrbCanvas(orbCanvas);
    sdk.attachVisionVideo(visionVideo);

    function populateStudies() {
      if (!sdk.studiesById.size || !studySel) return;
      const surfaceIds = new Set(sdk.surface.studyIds || []);
      const ordered = [
        ...Array.from(sdk.studiesById.values()).filter((s) => surfaceIds.has(s.id)),
        ...Array.from(sdk.studiesById.values()).filter((s) => !surfaceIds.has(s.id)),
      ];
      studySel.innerHTML = ordered
        .map(
          (s) =>
            `<option value="${escHtml(s.id)}" ${s.id === sdk.activeStudyId ? 'selected' : ''}>${surfaceIds.has(s.id) ? '★ ' : ''}${escHtml(s.short_title)} [${escHtml(s.evidence_class)}]</option>`
        )
        .join('');
    }

    sdk.loadCorpora().then(populateStudies).catch(() => {});
    sdk.on('corpus-ready', populateStudies);

    sdk.on('state', (snap) => {
      if (studySel && studySel.value !== snap.activeStudyId) studySel.value = snap.activeStudyId;
      if (voiceSel && voiceSel.value !== snap.voice) voiceSel.value = snap.voice;
      if (studioLink) {
        studioLink.href = `${RESEARCH_ORIGIN}/live/?study=${encodeURIComponent(snap.activeStudyId)}&surface=${encodeURIComponent(sdk.surface.id)}`;
      }
      if (chronicleLink) {
        chronicleLink.href = snap.activeBlogEntry?.url ? absBlogUrl(snap.activeBlogEntry.url) : BLOG_ORIGIN;
      }
      if (stateEl) {
        stateEl.textContent = `${snap.state.toUpperCase()} · ${snap.activeStudy?.evidence_class || sdk.surface.id}`;
      }
      if (callBtn) {
        callBtn.textContent = snap.callActive ? '⏹ End' : '📞 Start';
        callBtn.className = snap.callActive ? 'cbtn cbtn-end' : 'cbtn cbtn-start';
      }
      if (muteBtn) {
        muteBtn.textContent = snap.micMuted ? '🔇' : '🎙';
      }
      if (visionBox) visionBox.classList.toggle('hidden', !snap.visionActive);
      panel.querySelectorAll('[data-mode]').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-mode') === snap.mode);
      });
    });

    sdk.on('telemetry', (tel) => {
      if (!telEl) return;
      const ttfa = tel.ttfaMs != null ? `${tel.ttfaMs}ms` : '<200ms';
      telEl.textContent = `VAD ${tel.vadDb.toFixed(0)}dB · TTFA ${ttfa} · ${tel.ttsBackend} · ${tel.estJoulesHeuristic}`;
    });

    sdk.on('interim', ({ text }) => {
      if (!interimEl) return;
      interimEl.textContent = text ? `"${text}"` : '';
      interimEl.classList.toggle('hidden', !text);
    });

    sdk.on('vision-frame', (snap) => {
      if (visionMeta && snap?.metrics) {
        visionMeta.textContent = `${snap.metrics.width}×${snap.metrics.height} · Sobel ${snap.metrics.edgeDensityPct}%`;
      }
    });

    sdk.on('stage', (st) => {
      if (!isOpen || !st) return;
      if (stageEl) stageEl.open = true;
      if (stageTitle) stageTitle.textContent = `🎬 ${st.shortTitle} · ${st.clip}`;
      if (tvDeepLink) tvDeepLink.href = st.tvUrl;
      if (stageVideo && stageVideo.getAttribute('src') !== st.url) {
        stageVideo.poster = st.poster || '';
        stageVideo.src = st.url;
        stageVideo.muted = true;
        stageVideo.play().catch(() => {});
      }
    });

    sdk.on('turn', (turn) => {
      if (!transcriptEl) return;
      const el = document.createElement('div');
      if (turn.role === 'user') {
        el.className = 'turn-user';
        el.textContent = turn.text;
      } else {
        const r = turn.receipt || {};
        const evCls = `ev-${r.evidence_class || 'unmetered'}`;
        el.className = 'turn-ai';
        el.innerHTML = `
          <div class="turn-hdr">
            <span class="turn-spk">${escHtml(turn.speakerName)} · ${escHtml(turn.speakerRole || '')}</span>
            <span class="ev-badge ${escHtml(evCls)}">${escHtml(r.evidence_class || 'unmetered')} ${(r.claim_tags || []).map(escHtml).join('')}</span>
          </div>
          <div class="turn-txt">${escHtml(turn.text)}</div>
          <div class="turn-orth">${escHtml(r.provenance || 'Signed Provenance · Self-Checked')} · ${escHtml(r.orthogonality || 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered')}</div>
        `;
      }
      transcriptEl.appendChild(el);
      transcriptEl.scrollTop = transcriptEl.scrollHeight;
    });

    shadow.getElementById('oe-close')?.addEventListener('click', () => setOpen(false));
    shadow.getElementById('oe-orb-btn')?.addEventListener('click', () => {
      if (!sdk.callActive) sdk.startCall();
      else if (sdk.state === 'speaking' || sdk.state === 'thinking') sdk.bargeIn('orb');
    });
    callBtn?.addEventListener('click', () => {
      if (sdk.callActive) sdk.endCall();
      else sdk.startCall();
    });
    shadow.getElementById('oe-barge-btn')?.addEventListener('click', () => sdk.bargeIn('btn'));
    muteBtn?.addEventListener('click', () => sdk.toggleMute());
    shadow.getElementById('oe-cam-btn')?.addEventListener('click', () => sdk.startCamera());
    shadow.getElementById('oe-scr-btn')?.addEventListener('click', () => sdk.startScreenShare());
    shadow.getElementById('oe-snap-btn')?.addEventListener('click', () => sdk.analyzeFrameNow());
    shadow.getElementById('oe-flip-btn')?.addEventListener('click', () => sdk.flipCamera());
    shadow.getElementById('oe-vis-close')?.addEventListener('click', () => sdk.stopVision());

    studySel?.addEventListener('change', () => sdk.setStudy(studySel.value));
    voiceSel?.addEventListener('change', () => sdk.setVoice(voiceSel.value));

    panel.querySelectorAll('[data-mode]').forEach((b) => {
      b.addEventListener('click', () => {
        const m = b.getAttribute('data-mode');
        sdk.setMode(m);
        if (m === 'debate') sdk.startDebate(sdk.activeStudyId);
        else if (m === 'copilot') sdk.startPageCoPilot(sdk.activeStudyId);
        else if (m === 'vision' && !sdk.visionStream) sdk.startCamera();
      });
    });

    panel.querySelectorAll('[data-clip]').forEach((b) => {
      b.addEventListener('click', () => {
        sdk.openVisualStage({ studyId: sdk.activeStudyId, clip: b.getAttribute('data-clip') });
      });
    });

    panel.querySelectorAll('[data-prompt]').forEach((b) => {
      b.addEventListener('click', () => {
        const p = b.getAttribute('data-prompt');
        if (p) sdk.ask(p);
      });
    });

    shadow.getElementById('oe-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = shadow.getElementById('oe-input');
      const val = inp?.value?.trim();
      if (!val) return;
      inp.value = '';
      sdk.ask(val);
    });
  }

  function setOpen(next) {
    isOpen = !!next;
    if (isOpen) {
      sdk.refreshLiveDomIndex();
      mountPanel();
    }
    pill.setAttribute('aria-expanded', String(isOpen));
    pill.classList.toggle('hidden', isOpen);
    panel.classList.toggle('hidden', !isOpen);
  }

  pill.addEventListener('click', () => setOpen(!isOpen));

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      setOpen(!isOpen);
    } else if (e.key === 'Escape' && isOpen) {
      setOpen(false);
    }
  });

  wireTriggerButtons(setOpen, sdk);

  const controller = {
    sdk,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!isOpen),
    startCall: (opts) => {
      setOpen(true);
      return sdk.startCall(opts);
    },
  };
  window.openieEcosystemDock = controller;
  return controller;
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mountOpenIEEcosystemDock(), { once: true });
  } else {
    mountOpenIEEcosystemDock();
  }
}
