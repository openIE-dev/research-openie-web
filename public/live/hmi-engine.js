// OpenIE Research SOTA Multimodal Live Call, Vision & Co-Pilot Engine (hmi-engine.js)
// Dual-Engine Architecture (Founder Rule 2026-10-12: Zero legacy browser robotic TTS):
// 1. studio_s2s (Default): Full-Duplex 24 kHz Native Speech-to-Speech (wss://research.openie.dev/api/live/ws)
//    with 65ms jitter cushion, 3ms raised-cosine fade-in, 3-stage Broadcast Mastering EQ/Compressor,
//    <30ms smooth 12ms gain-ramp barge-in, and motion-gated 768px JPEG Camera/Screen Vision.
// 2. sovereign_gpu (1-Click Toggle): 100% Local FP32 Kokoro-82M WebGPU + 32 kHz Blackman Sinc + Perth STFT
//    watermark (/live/scholar-kokoro-worker.js + OPFS SHA-256 cache) paired with /api/live/turn & BM25.

const LIVE_ORIGIN =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'research.openie.dev' || window.location.hostname.endsWith('.askdavidc.ai'))
    ? window.location.origin
    : 'https://research.openie.dev';

const CORPUS_URL = '/live/hmi-corpus.json';
const SCHOLAR_KOKORO_WORKER_URL = '/live/scholar-kokoro-worker.js';
const KOKORO_PACK_BASE = `${LIVE_ORIGIN}/voice-packs/kokoro-v1-ee135e148c3e/`;
const ORT_VENDOR_BASE = `${LIVE_ORIGIN}/voice-packs/ort-web-1.30.0-s1/`;
const ASR_WORKER_URL = '/live/hmi-asr-worker.js';
const VISION_WORKER_URL = '/live/hmi-vision-worker.js';

export const STUDIO_VOICES = {
  Aoede: {
    id: 'Aoede',
    name: 'Aoede',
    role: 'Warm Studio Host',
    accent: 'US Female · 24 kHz Native S2S',
    color: '#F59E0B',
    kokoroVoice: 'af_heart',
  },
  Charon: {
    id: 'Charon',
    name: 'Charon',
    role: 'Measured Outside-Review Skeptic',
    accent: 'Deep Analytical · 24 kHz Native S2S',
    color: '#00D4AA',
    kokoroVoice: 'am_michael',
  },
  Puck: {
    id: 'Puck',
    name: 'Puck',
    role: 'Energetic Systems Architect',
    accent: 'Expressive Male · 24 kHz Native S2S',
    color: '#818CF8',
    kokoroVoice: 'am_michael',
  },
  Kore: {
    id: 'Kore',
    name: 'Kore',
    role: 'Empirical Guide',
    accent: 'Crisp Female · 24 kHz Native S2S',
    color: '#34D399',
    kokoroVoice: 'bf_emma',
  },
  Fenrir: {
    id: 'Fenrir',
    name: 'Fenrir',
    role: 'Deep Hardware Lead',
    accent: 'Resonant Baritone · 24 kHz Native S2S',
    color: '#F472B6',
    kokoroVoice: 'am_michael',
  },
};

const VOICE_ALIAS_MAP = {
  Aoede: 'Aoede',
  Charon: 'Charon',
  Puck: 'Puck',
  Kore: 'Kore',
  Fenrir: 'Fenrir',
  af_heart: 'Aoede',
  bm_george: 'Charon',
  am_adam: 'Puck',
  af_bella: 'Kore',
  bf_emma: 'Kore',
  am_michael: 'Charon',
};

export const VOICE_PERSONAS = {
  ...STUDIO_VOICES,
  af_heart: STUDIO_VOICES.Aoede,
  bm_george: STUDIO_VOICES.Charon,
  am_adam: STUDIO_VOICES.Puck,
  af_bella: STUDIO_VOICES.Kore,
};

export function normalizeStudioVoice(v) {
  return VOICE_ALIAS_MAP[String(v || '').trim()] || 'Aoede';
}

export function mapToKokoroFp32Voice(v) {
  const raw = String(v || '').trim();
  if (raw === 'af_heart' || raw === 'bf_emma' || raw === 'am_michael') return raw;
  const studio = STUDIO_VOICES[normalizeStudioVoice(raw)];
  return studio?.kokoroVoice || 'af_heart';
}

const DUPLEX_CAPTURE_WORKLET = `
class OpenIEDuplexCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Int16Array(1600);
    this.pos = 0;
    this.phase = 0;
  }
  process(inputs, outputs) {
    const outCh = outputs[0] && outputs[0][0];
    if (outCh) outCh.fill(0);
    const ch = inputs[0] && inputs[0][0];
    if (!ch || !ch.length) return true;
    const ratio = sampleRate / 16000;
    let sumSq = 0;
    for (let i = 0; i < ch.length; i++) sumSq += ch[i] * ch[i];
    const rms = Math.sqrt(sumSq / ch.length);
    while (this.phase < ch.length) {
      const idx = Math.max(0, Math.min(ch.length - 1, Math.floor(this.phase)));
      const v = Math.max(-1, Math.min(1, ch[idx]));
      this.buf[this.pos++] = v < 0 ? v * 0x8000 : v * 0x7fff;
      if (this.pos >= this.buf.length) {
        const pcm = this.buf.slice(0);
        this.port.postMessage({ pcm16: pcm.buffer, rms }, [pcm.buffer]);
        this.pos = 0;
      }
      this.phase += ratio;
    }
    this.phase = Math.max(0, this.phase - ch.length);
    if (rms > 0.02) this.port.postMessage({ rmsOnly: rms });
    return true;
  }
}
registerProcessor('openie-duplex-capture', OpenIEDuplexCapture);
`;

function abToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + step));
  }
  return btoa(bin);
}

function pcm16ChunksToWavBase64(int16Chunks, sampleRate = 16000) {
  let totalSamples = 0;
  for (const c of int16Chunks) totalSamples += c.length;
  const dataBytes = totalSamples * 2;
  const wav = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(wav);
  const writeStr = (off, s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataBytes, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataBytes, true);
  const outI16 = new Int16Array(wav, 44, totalSamples);
  let offset = 0;
  for (const c of int16Chunks) {
    outI16.set(c, offset);
    offset += c.length;
  }
  return abToBase64(wav);
}

function pcm16Base64ToFloat32(b64) {
  const bin = atob(b64);
  const len = bin.length >> 1;
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const lo = bin.charCodeAt(i * 2);
    const hi = bin.charCodeAt(i * 2 + 1);
    let s = (hi << 8) | lo;
    if (s & 0x8000) s -= 0x10000;
    out[i] = s / 32768;
  }
  return out;
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'what', 'how', 'why', 'who', 'where', 'when',
  'are', 'was', 'were', 'been', 'have', 'has', 'had', 'does', 'did', 'can', 'could', 'would', 'should',
  'about', 'into', 'across', 'over', 'under', 'between', 'through', 'like', 'tell', 'show', 'explain',
  'give', 'me', 'my', 'our', 'your', 'you', 'please', 'study', 'paper', 'openie', 'research',
]);

function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9_+.-]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
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
    .replace(/\bpp\b/g, 'percentage points')
    .replace(/\[([TEMS])\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export class OpenIELiveHMI {
  constructor() {
    this.listeners = new Map();
    this.corpus = null;
    this.studiesById = new Map();
    this.bm25Docs = [];
    this.bm25Idf = new Map();
    this.avgDocLen = 1;
    this.corpusPromise = null;

    this.engineMode = 'studio_s2s'; // 'studio_s2s' (24 kHz Native S2S) | 'sovereign_gpu' (Kokoro FP32 32 kHz)
    this.state = 'idle'; // 'idle' | 'listening' | 'thinking' | 'speaking'
    this.mode = 'call'; // 'call' | 'vision' | 'copilot' | 'debate'
    this.callActive = false;
    this.micMuted = false;
    this.activeStudyId = 'communication-avalanche';
    this.voice = 'Aoede';
    this.speed = 1.0;
    this.forceWhisper = false;
    this.llmEnabled = false;
    this.contextSummary = '';
    this.mediaContext = null;

    // WebSocket S2S state
    this.ws = null;
    this.wsReadyPromise = null;
    this.wsSessionId = null;
    this.wsModel = 'gemini-live-2.5-flash-native-audio';
    this.streamingUserTurn = null;
    this.streamingAssistantTurn = null;

    // WebAudio Mastering Chain & Jitter Buffer
    this.audioCtx = null;
    this.masterInput = null;
    this.ttsGain = null;
    this.ttsAnalyser = null;
    this.ttsFreqBins = null;
    this.activeSources = new Set();
    this.nextPlayTime = 0;
    this.turnAbort = null;

    // Mic & VAD
    this.micStream = null;
    this.micSource = null;
    this.micAnalyser = null;
    this.micFreqBins = null;
    this.workletNode = null;
    this.bargeFrames = 0;
    this.micRms = 0;
    this.vadTimer = null;
    this.noiseFloorDb = -56;
    this.vadDb = -60;
    this.lastTurnCommitAt = 0;
    this.ttfaMs = null;
    this.estJoulesHeuristic = 0;

    // Sovereign Kokoro-82M FP32 + Perth 32 kHz Worker
    this.kokoroWorker = null;
    this.kokoroReady = false;
    this.kokoroLoading = false;
    this.kokoroSayId = 1;
    this.kokoroPending = new Map();
    this.kokoroInfo = null;

    // SpeechRecognition / Whisper STT (for sovereign_gpu mode)
    this.speechRec = null;
    this.speechRecSupported =
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    this.pcmChunks = [];
    this.pcmSpeaking = false;
    this.pcmLastVoiceAt = 0;
    this.pcmSpeechStartAt = 0;
    this.asrWorker = null;
    this.asrReqId = 0;
    this.asrPending = new Map();
    this.whisperReady = false;
    this.whisperLoading = false;
    this.whisperInfo = null;

    // Vision Worker & Stream
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
    this.lastLumaSig = null;
    this.lastFrameB64 = null;
    this.lastVisionSnapshot = null;
    this.visionSampleTimer = null;

    this.copilotStep = 0;
    this.debateTurn = 0;
    this.transcript = [];
    this.turnCounter = 0;

    this.orbCanvases = new Set();
    this.orbRaf = null;
    this.orbPhase = 0;

    if (typeof window !== 'undefined') {
      this.mediaContext = window.__openieActiveMediaContext || null;
      this.activeStudyId = this.detectPageStudyId();
      this._injectSpotlightStyles();
      window.addEventListener('openie:live-context', (ev) => {
        if (ev?.detail) {
          this.mediaContext = ev.detail;
          if (!this.callActive && ev.detail.studyId && this.studiesById.has(ev.detail.studyId)) {
            this.activeStudyId = ev.detail.studyId;
            this._emitState();
          }
        }
      });
    }
  }

  // ---------- Event Bus ----------
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
        console.warn('[openie-live-hmi]', err);
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
    const persona = STUDIO_VOICES[this.voice] || STUDIO_VOICES.Aoede;
    return {
      engineMode: this.engineMode,
      state: this.state,
      mode: this.mode,
      callActive: this.callActive,
      micMuted: this.micMuted,
      activeStudyId: this.activeStudyId,
      activeStudy: this.studiesById.get(this.activeStudyId) || null,
      voice: this.voice,
      voicePersona: persona,
      speed: this.speed,
      visionActive: !!this.visionStream,
      visionSource: this.visionSource,
      cameraFacing: this.cameraFacing,
      forceWhisper: this.forceWhisper,
      llmEnabled: this.llmEnabled,
      kokoroReady: this.kokoroReady,
      whisperReady: this.whisperReady,
      visionModelReady: this.visionModelReady,
      wsConnected: !!(this.ws && this.ws.readyState === WebSocket.OPEN),
    };
  }

  getTelemetry() {
    let ttsBackend =
      this.engineMode === 'studio_s2s'
        ? `Studio Live 24 kHz S2S (${this.voice})`
        : this.kokoroReady
        ? 'Kokoro-82M FP32 WebGPU (32 kHz + Perth)'
        : this.kokoroLoading
        ? 'Caching Kokoro-82M FP32 to OPFS...'
        : 'Kokoro-82M FP32 WebGPU (Standby)';

    let sttBackend =
      this.engineMode === 'studio_s2s'
        ? '16 kHz Native Duplex AudioWorklet'
        : this.forceWhisper || !this.speechRecSupported
        ? this.whisperReady
          ? 'Whisper-Tiny.en ONNX'
          : 'Whisper-Tiny.en (Standby)'
        : 'Browser Speech Endpointing';

    let visionBackend = 'Standby';
    if (this.visionStream) {
      visionBackend =
        this.engineMode === 'studio_s2s'
          ? '768px Motion-Gated JPEG S2S + Canvas2D'
          : this.visionModelReady
          ? `Canvas2D + ${this.visionInfo?.model?.split('/').pop() || 'ONNX VLM'}`
          : 'Canvas2D + /api/live/turn Vision';
    }

    return {
      engineMode: this.engineMode,
      vadDb: Math.round(this.vadDb * 10) / 10,
      noiseFloorDb: Math.round(this.noiseFloorDb * 10) / 10,
      ttfaMs: this.ttfaMs,
      ttsBackend,
      sttBackend,
      visionBackend,
      llmBackend: this.engineMode === 'studio_s2s' ? 'Commons 216k + 7 Live Tools' : 'Grounded /api/live/turn + BM25',
      estJoulesHeuristic: `${this.estJoulesHeuristic.toFixed(3)} est_j (never summed with measured_j)`,
    };
  }

  _bumpBrowserHeuristic(workUnits = 0.004) {
    this.estJoulesHeuristic += workUnits;
    this._emitTelemetry();
  }

  // ---------- Corpus & Grounding Context ----------
  detectPageStudyId() {
    if (typeof window === 'undefined') return 'communication-avalanche';
    const params = new URLSearchParams(window.location.search);
    const qStudy = params.get('study') || params.get('paper');
    if (qStudy) return qStudy.trim().toLowerCase();

    const p = window.location.pathname.replace(/\/+$/, '');
    if (p === '/tv') {
      if (window.openieTV && typeof window.openieTV.getActive === 'function') {
        const act = window.openieTV.getActive();
        if (act?.study_id) return act.study_id;
      }
      const h = (window.location.hash || '').replace(/^#/, '').split(':')[0];
      if (h && h !== 'ecosystem-channels') return h.trim().toLowerCase();
    }
    if (p === '/radio' && window.__openieActiveMediaContext?.studyId) {
      return window.__openieActiveMediaContext.studyId;
    }
    const mPaper = p.match(/\/(?:papers|products|about|living|posts|medium)\/([a-z0-9-]+)$/i);
    if (mPaper) {
      const slug = mPaper[1].toLowerCase();
      if (slug === 'ni' || slug === 'mol') return 'gates';
      if (slug === 'fpga-sim') return 'eco-compute';
      if (slug === 'compiled-agency') return 'from-ephemeral-inference-to-compiled-agency';
      return slug;
    }
    return 'from-ephemeral-inference-to-compiled-agency';
  }

  buildCompactSiteDescriptor() {
    const hostPath =
      typeof window !== 'undefined'
        ? `${window.location.hostname}${window.location.pathname}`
        : 'research.openie.dev/live/';
    const study = this.studiesById.get(this.activeStudyId);
    const rCtx = typeof window !== 'undefined' ? window.__openieActiveMediaContext || this.mediaContext : this.mediaContext;
    const studyLine = study
      ? `${study.short_title} [${study.evidence_class}]: ${(study.headline_metric || '').slice(0, 95)}`
      : '29 OpenIE Self-Checked studies';
    const caveatLine = study
      ? (study.limitations_and_scope || '').split('.')[0].slice(0, 110)
      : 'Finite-sample replication bounds apply';
    const mediaBit =
      rCtx?.surface === 'radio'
        ? ` Radio Ep ${rCtx.episodeNumber}: ${(rCtx.episodeTitle || '').slice(0, 55)}.`
        : this.contextSummary
        ? ` ${this.contextSummary.slice(0, 65)}.`
        : '';
    const raw =
      `${hostPath} | You are OpenIE Live (warm, simplest-first voice co-pilot). Lead in plain everyday words (2-3 crisp sentences, zero acronym soup) and offer technical metrics/proofs only if asked. Active: ${studyLine}. Caveat: ${caveatLine}.${mediaBit} ` +
      `Rules: say 'Signed Provenance · Self-Checked' (never 'Verified'); never mix measured_j, reported_j, est_j, unmetered; never say ${'Landauer'} Bit-Equivalents.`;
    return raw.slice(0, 595);
  }

  async loadCorpus() {
    if (this.corpus) return this.corpus;
    this.corpusPromise ||= fetch(CORPUS_URL, { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} loading ${CORPUS_URL}`);
        return res.json();
      })
      .then((data) => {
        this.corpus = data;
        this.studiesById.clear();
        for (const s of data.studies || []) this.studiesById.set(s.id, s);
        if (!this.studiesById.has(this.activeStudyId) && data.studies?.length) {
          this.activeStudyId = data.studies[0].id;
        }
        this._buildBm25Index(data.studies || []);
        this.emit('corpus-ready', { corpus: data });
        this._emitState();
        return data;
      })
      .catch((err) => {
        this.corpusPromise = null;
        this.emit('error', { scope: 'corpus', message: String(err) });
        throw err;
      });
    return this.corpusPromise;
  }

  _buildBm25Index(studies) {
    const df = new Map();
    let totalLen = 0;
    this.bm25Docs = studies.map((s) => {
      const text = [
        s.id, s.id.replace(/-/g, ' '), s.title, s.short_title, s.category, s.evidence_class,
        (s.key_terms || []).join(' '), s.headline_metric, s.headline_claim,
        (s.plain_bullets || []).join(' '), s.methods_and_meter, s.baseline_comparison,
        s.limitations_and_scope, s.skeptic_question, s.architect_answer,
      ].join(' ');
      const toks = tokenize(text);
      totalLen += toks.length;
      const tf = new Map();
      for (const tok of toks) tf.set(tok, (tf.get(tok) || 0) + 1);
      for (const tok of tf.keys()) df.set(tok, (df.get(tok) || 0) + 1);
      return { study: s, tf, len: toks.length };
    });
    const N = Math.max(1, studies.length);
    this.avgDocLen = Math.max(1, totalLen / N);
    this.bm25Idf.clear();
    for (const [tok, count] of df.entries()) {
      this.bm25Idf.set(tok, Math.log(1 + (N - count + 0.5) / (count + 0.5)));
    }
  }

  searchStudies(query, topK = 4) {
    if (!this.bm25Docs.length) return [];
    const qLower = String(query || '').toLowerCase();
    const qToks = tokenize(qLower);
    const k1 = 1.5;
    const b = 0.75;
    const scored = [];
    for (const doc of this.bm25Docs) {
      let score = 0;
      const idPhrase = doc.study.id.replace(/-/g, ' ');
      if (qLower.includes(doc.study.id) || (idPhrase.length > 3 && qLower.includes(idPhrase))) score += 14;
      if (qLower.includes(doc.study.short_title.toLowerCase())) score += 12;
      for (const term of doc.study.key_terms || []) {
        const tl = term.toLowerCase();
        if (tl.length > 3 && qLower.includes(tl)) score += 5;
      }
      for (const tok of qToks) {
        const f = doc.tf.get(tok) || 0;
        if (!f) continue;
        const idf = this.bm25Idf.get(tok) || 0.5;
        score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + b * (doc.len / this.avgDocLen))));
      }
      if (score > 0) scored.push({ study: doc.study, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  // ---------- Active DOM Co-Browsing & Visual Stage ----------
  _injectSpotlightStyles() {
    if (document.getElementById('openie-hmi-spotlight-css')) return;
    const st = document.createElement('style');
    st.id = 'openie-hmi-spotlight-css';
    st.textContent = `
      @keyframes openieHmiPulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.65), inset 0 0 0 1px rgba(245, 158, 11, 0.7); background-color: rgba(0, 212, 170, 0.11); }
        60% { box-shadow: 0 0 0 12px rgba(0, 212, 170, 0), inset 0 0 0 1px rgba(245, 158, 11, 0.45); background-color: rgba(245, 158, 11, 0.08); }
        100% { box-shadow: 0 0 0 0 rgba(0, 212, 170, 0); background-color: transparent; }
      }
      .hmi-dom-spotlight { border-radius: 8px; animation: openieHmiPulse 2.6s ease-out forwards; }
      .hmi-inline-discuss-btn {
        display: inline-flex; align-items: center; gap: 4px; margin-left: 10px; padding: 2px 8px;
        border-radius: 9999px; font-family: var(--font-mono, monospace); font-size: 10.5px; font-weight: 500;
        line-height: 1.4; color: #00D4AA; background: rgba(0, 212, 170, 0.08);
        border: 1px solid rgba(0, 212, 170, 0.32); cursor: pointer; opacity: 0.75; vertical-align: middle;
      }
      .hmi-inline-discuss-btn:hover { opacity: 1; background: rgba(245, 158, 11, 0.16); border-color: #F59E0B; color: #F59E0B; }
    `;
    document.head.appendChild(st);
  }

  scanActivePageDom() {
    if (typeof document === 'undefined') {
      return { pathname: '/', title: '', visibleSection: null, sections: [], figures: [] };
    }
    const sections = [];
    const headings = document.querySelectorAll('.paper-prose h2, .paper-prose h3, main h1, main h2');
    let visibleSection = null;
    const vh = window.innerHeight || 800;

    headings.forEach((h, idx) => {
      if (h.closest('#openie-live-dock-root')) return;
      const rect = h.getBoundingClientRect();
      const slug = h.id || `sec-${idx}`;
      const clone = h.cloneNode(true);
      clone.querySelectorAll('.hmi-inline-discuss-btn').forEach((b) => b.remove());
      const text = (clone.textContent || '').trim();
      if (!text) return;

      let snippet = '';
      let sib = h.nextElementSibling;
      let hops = 0;
      while (sib && hops < 3 && snippet.length < 340) {
        if (/^H[1-3]$/.test(sib.tagName)) break;
        const t = (sib.textContent || '').replace(/\s+/g, ' ').trim();
        if (t) snippet += (snippet ? ' ' : '') + t;
        sib = sib.nextElementSibling;
        hops++;
      }
      const inView = rect.top >= -80 && rect.top <= vh * 0.72;
      const item = { slug, tag: h.tagName.toLowerCase(), text, snippet: snippet.slice(0, 380), inView };
      sections.push(item);
      if (!visibleSection && inView) visibleSection = item;
    });

    const figures = [];
    document.querySelectorAll('.paper-prose figure, .paper-prose .fig, .paper-prose table').forEach((el, idx) => {
      const id = el.id || `fig-block-${idx + 1}`;
      if (!el.id) el.id = id;
      const cap = el.querySelector('figcaption, caption, th');
      const label = (cap ? cap.textContent : el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 180);
      if (label) figures.push({ id, tag: el.tagName.toLowerCase(), label });
    });

    return {
      pathname: window.location.pathname,
      title: document.title.replace(/\s*\|\s*OpenIE Research.*$/, '').trim(),
      visibleSection: visibleSection || sections[0] || null,
      sections,
      figures,
    };
  }

  scrollToSection(slugOrHeading) {
    if (typeof document === 'undefined' || !slugOrHeading) return false;
    const q = String(slugOrHeading).trim().toLowerCase().replace(/^#/, '');
    let target = document.getElementById(slugOrHeading.replace(/^#/, ''));
    if (!target) {
      const candidates = document.querySelectorAll('.paper-prose h2, .paper-prose h3, .paper-prose figure, .paper-prose table, main h2, main h3');
      for (const el of candidates) {
        if (el.closest('#openie-live-dock-root')) continue;
        const txt = (el.textContent || '').toLowerCase();
        if ((el.id && el.id.toLowerCase() === q) || txt.includes(q)) {
          target = el;
          break;
        }
      }
    }
    if (!target) return false;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.remove('hmi-dom-spotlight');
    void target.offsetWidth;
    target.classList.add('hmi-dom-spotlight');
    setTimeout(() => target.classList.remove('hmi-dom-spotlight'), 2700);
    this.emit('dom-highlight', {
      slug: target.id || q,
      headingText: (target.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
    });
    return true;
  }

  openVisualStage({ studyId, clip = '15s' } = {}) {
    const id = studyId || this.activeStudyId;
    const study = this.studiesById.get(id);
    if (!study) return null;
    if (study.id !== this.activeStudyId) {
      this.activeStudyId = study.id;
      this._emitState();
    }
    let url = study.tv15s;
    let vttUrl = study.tv15sVtt || '';
    let kind = 'video';
    let label = '15s Plain-Words Visual Proof';
    if (clip === '45s') {
      url = study.tv45s;
      vttUrl = study.tv45sVtt || '';
      label = '45s Real-World Example Film';
    } else if (clip === '90s') {
      url = study.tv90s;
      vttUrl = study.tv90sVtt || '';
      label = '90s Full Studio Briefing';
    } else if (clip === '180s') {
      url = study.tv180s || study.tv90s;
      vttUrl = '';
      label = '3m Deep Cut · 3D Architecture';
    } else if (clip === 'tiktok') {
      url = study.tiktokMp4;
      vttUrl = '';
      kind = 'tiktok';
      label = '9:16 Vertical Edition (60fps)';
    } else if (clip === 'living') {
      url = study.livingPath || '/living/';
      vttUrl = '';
      kind = 'living';
      label = 'Interactive /living/ Simulator';
    }
    const payload = {
      studyId: study.id,
      shortTitle: study.short_title,
      clip,
      kind,
      label,
      url,
      vttUrl,
      poster: clip === 'tiktok' ? study.tiktokPoster || study.poster : study.poster,
      paperPath: study.path,
      livingPath: study.livingPath,
      pdfPath: study.pdfPath,
    };
    this.emit('stage', payload);
    if (typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') === '/tv') {
      window.dispatchEvent(
        new CustomEvent('openie:tv-select-study', {
          detail: { studyId: study.id, tier: clip === 'living' ? null : clip, autoplay: false },
        })
      );
    }
    return payload;
  }

  makeReceipt(study) {
    if (!study) {
      return {
        evidence_class: 'unmetered',
        claim_tags: ['[M]', '[S]'],
        provenance: 'Signed Provenance · Self-Checked',
        orthogonality: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
      };
    }
    return {
      studyId: study.id,
      shortTitle: study.short_title,
      evidence_class: study.evidence_class,
      claim_tags: study.claim_tags || ['[E]'],
      provenance: study.provenance_badge || 'Signed Provenance · Self-Checked',
      orthogonality: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
    };
  }

  _defaultActionsForStudy(study) {
    return [
      { type: 'stage', clip: '15s', studyId: study.id, label: '▶ 15s Visual Proof' },
      { type: 'stage', clip: 'tiktok', studyId: study.id, label: '📱 9:16 Reel' },
      { type: 'stage', clip: 'living', studyId: study.id, label: '🔬 /living/ Sim' },
      { type: 'link', href: study.path, label: '📄 Read Paper' },
    ];
  }

  // ---------- Broadcast Mastering WebAudio Chain & Zero-Click Jitter Buffer ----------
  async _ensureAudioContext() {
    if (typeof window === 'undefined') return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!this.audioCtx) {
      const ctx = new Ctx({ latencyHint: 'interactive' });
      this.audioCtx = ctx;

      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 55;

      const presence = ctx.createBiquadFilter();
      presence.type = 'highshelf';
      presence.frequency.value = 3200;
      presence.gain.value = 1.5;

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 2.4;
      comp.attack.value = 0.004;
      comp.release.value = 0.12;

      this.ttsGain = ctx.createGain();
      this.ttsGain.gain.value = 1.0;

      this.ttsAnalyser = ctx.createAnalyser();
      this.ttsAnalyser.fftSize = 512;
      this.ttsAnalyser.smoothingTimeConstant = 0.78;
      this.ttsFreqBins = new Uint8Array(this.ttsAnalyser.frequencyBinCount);

      hp.connect(presence);
      presence.connect(comp);
      comp.connect(this.ttsGain);
      this.ttsGain.connect(this.ttsAnalyser);
      this.ttsAnalyser.connect(ctx.destination);
      this.masterInput = hp;
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
    [528, 792].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.065);
      g.gain.setValueAtTime(0.0001, now + idx * 0.065);
      g.gain.exponentialRampToValueAtTime(0.075, now + idx * 0.065 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.065 + 0.17);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.18);
    });
  }

  enqueuePcmPlayback(float32Samples, sampleRate = 24000) {
    if (!float32Samples || !float32Samples.length || !this.audioCtx) return;
    if (this.bargeSuppressUntil && performance.now() < this.bargeSuppressUntil && !this.streamingAssistantTurn) {
      return;
    }
    const ctx = this.audioCtx;
    const startingFromSilence =
      this.activeSources.size === 0 || this.nextPlayTime <= ctx.currentTime + 0.005;

    const pcm = startingFromSilence ? new Float32Array(float32Samples) : float32Samples;
    if (startingFromSilence) {
      // 3 ms raised-cosine fade-in on first chunk from silence eliminates DC/onset click
      const fadeSamples = Math.min(Math.round(sampleRate * 0.003), pcm.length);
      for (let i = 0; i < fadeSamples; i++) {
        pcm[i] *= 0.5 * (1 - Math.cos((Math.PI * i) / fadeSamples));
      }
      if (this.lastTurnCommitAt > 0) {
        this.ttfaMs = Math.round(performance.now() - this.lastTurnCommitAt);
        this.lastTurnCommitAt = 0;
        this._emitTelemetry();
      }
    }

    const buf = ctx.createBuffer(1, pcm.length, sampleRate);
    buf.getChannelData(0).set(pcm);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.masterInput || ctx.destination);

    // 65 ms jitter cushion on stream start; phase-continuous gapless scheduling thereafter
    const startAt = startingFromSilence ? ctx.currentTime + 0.065 : this.nextPlayTime;
    this.nextPlayTime = startAt + buf.duration;

    if (this.state !== 'speaking') {
      this.state = 'speaking';
      this.ttsStartedAt = performance.now();
      this._emitState();
    }

    this.activeSources.add(src);
    src.onended = () => {
      this.activeSources.delete(src);
      if (this.activeSources.size === 0 && this.state === 'speaking') {
        this.state = this.callActive ? 'listening' : 'idle';
        this._emitState();
      }
    };
    src.start(startAt);
  }

  // <30 ms Smooth 12 ms Gain-Ramp Barge-In
  bargeIn(reason = 'manual') {
    if (this.turnAbort) {
      this.turnAbort.abort(reason);
      this.turnAbort = null;
    }
    const ctx = this.audioCtx;
    const sourcesToStop = Array.from(this.activeSources);
    this.activeSources.clear();
    this.nextPlayTime = ctx ? ctx.currentTime : 0;

    if (ctx && this.ttsGain && sourcesToStop.length > 0) {
      const now = ctx.currentTime;
      this.ttsGain.gain.cancelScheduledValues(now);
      this.ttsGain.gain.setValueAtTime(Math.max(0.0001, this.ttsGain.gain.value), now);
      this.ttsGain.gain.linearRampToValueAtTime(0.0001, now + 0.012);
      setTimeout(() => {
        for (const s of sourcesToStop) {
          try {
            s.stop(0);
            s.disconnect();
          } catch {}
        }
        if (this.ttsGain && this.audioCtx) {
          const t = this.audioCtx.currentTime;
          this.ttsGain.gain.cancelScheduledValues(t);
          this.ttsGain.gain.setValueAtTime(1.0, t);
        }
      }, 15);
    } else {
      for (const s of sourcesToStop) {
        try {
          s.stop(0);
          s.disconnect();
        } catch {}
      }
    }

    if (reason !== 'silent-reset' && reason !== 'ws-interrupted' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'interrupt' }));
      } catch {}
    }

    this.sealStreamingTurns();
    this.state = this.callActive ? 'listening' : 'idle';
    this._emitState();
  }

  // ---------- Full-Duplex Microphone Capture (`openie-duplex-capture` AudioWorklet) ----------
  async _startMicrophoneAndVad() {
    if (this.micStream) return true;
    if (!navigator.mediaDevices?.getUserMedia) {
      this.emit('error', { scope: 'mic', message: 'Browser microphone unavailable; text, Co-Pilot, and Vision remain active.' });
      return false;
    }
    try {
      const ctx = await this._ensureAudioContext();
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });
      this.micSource = ctx.createMediaStreamSource(this.micStream);
      this.micAnalyser = ctx.createAnalyser();
      this.micAnalyser.fftSize = 1024;
      this.micAnalyser.smoothingTimeConstant = 0.65;
      this.micFreqBins = new Uint8Array(this.micAnalyser.frequencyBinCount);
      // Connect ONLY to analyser & AudioWorklet (NEVER to ctx.destination!)
      this.micSource.connect(this.micAnalyser);

      if (ctx.audioWorklet && typeof AudioWorkletNode !== 'undefined') {
        if (!ctx.__openieDuplexWorkletLoaded) {
          const blobUrl = URL.createObjectURL(new Blob([DUPLEX_CAPTURE_WORKLET], { type: 'text/javascript' }));
          await ctx.audioWorklet.addModule(blobUrl);
          URL.revokeObjectURL(blobUrl);
          ctx.__openieDuplexWorkletLoaded = true;
        }
        // Connect through a zero-gain sink to ctx.destination so Safari/WebKit & Chromium pull every render quantum
        const wn = new AudioWorkletNode(ctx, 'openie-duplex-capture', {
          numberOfInputs: 1,
          numberOfOutputs: 1,
          outputChannelCount: [1],
          channelCount: 1,
        });
        const silentSink = ctx.createGain();
        silentSink.gain.value = 0;
        wn.connect(silentSink);
        silentSink.connect(ctx.destination);
        this.micSilentSink = silentSink;

        wn.port.onmessage = (ev) => {
          if (!this.callActive || this.micMuted) return;
          const d = ev.data || {};
          if (typeof d.rms === 'number') this.micRms = d.rms;
          if (typeof d.rmsOnly === 'number') this.micRms = d.rmsOnly;

          // Echo-guarded Acoustic Barge-In: ignore initial 320 ms TTS onset, require 3 sustained speech chunks
          const sinceTtsOnset = performance.now() - (this.ttsStartedAt || 0);
          if (this.state === 'speaking' && sinceTtsOnset > 320 && this.micRms > 0.068) {
            this.bargeFrames++;
            if (this.bargeFrames >= 3) {
              this.bargeFrames = 0;
              this.bargeSuppressUntil = performance.now() + 260;
              this.bargeIn('vad-voice');
            }
          } else if (d.pcm16) {
            this.bargeFrames = 0;
          }

          if (d.pcm16 && this.engineMode === 'studio_s2s') {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(JSON.stringify({ type: 'audio', pcm16_b64: abToBase64(d.pcm16) }));
            } else if (!this.wsReadyPromise) {
              this._scheduleWsReconnect(80);
            }
            if (this.s2sSpeaking || this.micRms > 0.018) {
              if (!this.s2sPcm16Chunks) this.s2sPcm16Chunks = [];
              if (this.s2sPcm16Chunks.length < 250) {
                this.s2sPcm16Chunks.push(new Int16Array(d.pcm16.slice(0)));
              }
            }
          }

          if (d.pcm16 && this.engineMode === 'sovereign_gpu' && (this.forceWhisper || !this.speechRecSupported) && this.pcmSpeaking) {
            const i16 = new Int16Array(d.pcm16);
            const f32 = new Float32Array(i16.length);
            for (let i = 0; i < i16.length; i++) f32[i] = i16[i] / 32768;
            this.pcmChunks.push(f32);
          }
        };
        this.micSource.connect(wn);
        this.workletNode = wn;
      }

      if (!this.vadTimer) {
        this.vadTimer = setInterval(() => this._stepVadTelemetry(), 40);
      }
      return true;
    } catch {
      this.emit('error', {
        scope: 'mic',
        message: 'Microphone permission declined — text prompts, Co-Pilot, and Skeptic Debate remain active.',
      });
      return false;
    }
  }

  _stepVadTelemetry() {
    if (!this.micAnalyser || !this.audioCtx || this.micMuted) {
      this.vadDb = -60;
      return;
    }
    this.micAnalyser.getByteFrequencyData(this.micFreqBins);
    const binHz = this.audioCtx.sampleRate / this.micAnalyser.fftSize;
    const bStart = Math.max(1, Math.floor(300 / binHz));
    const bEnd = Math.min(this.micFreqBins.length - 1, Math.ceil(3400 / binHz));
    let sum = 0;
    let count = 0;
    for (let i = bStart; i <= bEnd; i++) {
      const v = this.micFreqBins[i] / 255;
      sum += v * v;
      count++;
    }
    const rms = Math.sqrt(sum / Math.max(1, count));
    const db = Math.max(-65, 20 * Math.log10(Math.max(rms, 1e-4)));
    this.vadDb = db;
    if (this.state === 'listening' && db < this.noiseFloorDb + 6) {
      this.noiseFloorDb = this.noiseFloorDb * 0.96 + db * 0.04;
    } else if (db < this.noiseFloorDb) {
      this.noiseFloorDb = db;
    }

    // Client-side VAD endpointing + zero-stall `/api/live/turn` (`audio_wav_b64`) safety net in `studio_s2s`
    if (this.callActive && this.engineMode === 'studio_s2s' && !this.micMuted && this.state !== 'speaking') {
      const now = performance.now();
      const s2sThresh = Math.max(-42, this.noiseFloorDb + 8.5);
      const voiceDetected = db > s2sThresh || this.micRms > 0.022;
      if (voiceDetected) {
        if (!this.s2sSpeaking) {
          this.s2sSpeaking = true;
          this.s2sSpeechStartAt = now;
          this.s2sPcm16Chunks = [];
          if (this.s2sTurnWatchdog) {
            clearTimeout(this.s2sTurnWatchdog);
            this.s2sTurnWatchdog = null;
          }
          if (!this.streamingUserTurn) {
            this.emit('interim', { text: '🎙 Listening — hearing your voice…' });
          }
        }
        this.s2sLastVoiceAt = now;
      } else if (this.s2sSpeaking && now - this.s2sLastVoiceAt >= 720) {
        const dur = now - this.s2sSpeechStartAt;
        const captured = (this.s2sPcm16Chunks || []).slice();
        this.s2sSpeaking = false;
        this.s2sPcm16Chunks = [];
        if (dur >= 360 && captured.length >= 3) {
          this._commitStudioS2sUtteranceEnd(captured);
        } else if (!this.streamingUserTurn) {
          this.emit('interim', { text: '' });
        }
      }
    }

    // Whisper utterance endpointing when in sovereign_gpu mode without SpeechRecognition
    if (
      this.callActive &&
      this.engineMode === 'sovereign_gpu' &&
      this.state === 'listening' &&
      (this.forceWhisper || !this.speechRecSupported)
    ) {
      const now = performance.now();
      const thresh = Math.max(-40, this.noiseFloorDb + 10);
      if (db > thresh) {
        if (!this.pcmSpeaking) {
          this.pcmSpeaking = true;
          this.pcmSpeechStartAt = now;
          this.pcmChunks = [];
          this.emit('interim', { text: 'Listening (Whisper-Tiny ONNX)...' });
        }
        this.pcmLastVoiceAt = now;
      } else if (this.pcmSpeaking && now - this.pcmLastVoiceAt >= 680) {
        const dur = now - this.pcmSpeechStartAt;
        const chunks = this.pcmChunks;
        this.pcmSpeaking = false;
        this.pcmChunks = [];
        if (dur >= 380 && chunks.length) this._commitWhisperUtterance(chunks);
        else this.emit('interim', { text: '' });
      }
    }
    this._emitTelemetry();
  }

  _scheduleWsReconnect(delayMs = 450) {
    if (!this.callActive || this.engineMode !== 'studio_s2s' || this.wsReconnectTimer) return;
    if ((this.wsReconnectAttempts || 0) >= 5) return;
    this.wsReconnectTimer = setTimeout(() => {
      this.wsReconnectTimer = null;
      if (!this.callActive || this.engineMode !== 'studio_s2s') return;
      this.wsReconnectAttempts = (this.wsReconnectAttempts || 0) + 1;
      this.ensureStudioWebSocket().catch(() => {});
    }, delayMs);
  }

  _clearTurnWatchdogs() {
    if (this.s2sTurnWatchdog) {
      clearTimeout(this.s2sTurnWatchdog);
      this.s2sTurnWatchdog = null;
    }
    if (this.thinkingWatchdog) {
      clearTimeout(this.thinkingWatchdog);
      this.thinkingWatchdog = null;
    }
  }

  _commitStudioS2sUtteranceEnd(int16Chunks) {
    const speechEndedAt = performance.now();
    this.lastTurnCommitAt = speechEndedAt;
    if (!this.streamingUserTurn) {
      this.emit('interim', { text: 'Processing spoken turn…' });
    }
    // Flush 600 ms of clean digital zero PCM16 frames so upstream Gemini Live VAD immediately closes the user turn
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const zeroB64 = abToBase64(new Int16Array(1600).buffer);
      for (let i = 0; i < 6; i++) {
        try {
          this.ws.send(JSON.stringify({ type: 'audio', pcm16_b64: zeroB64 }));
        } catch {
          break;
        }
      }
    } else {
      this._fallbackAudioTurnHttp(int16Chunks);
      return;
    }
    if (this.s2sTurnWatchdog) clearTimeout(this.s2sTurnWatchdog);
    this.s2sTurnWatchdog = setTimeout(() => {
      this.s2sTurnWatchdog = null;
      if (!this.callActive || this.state === 'speaking') return;
      if ((this.s2sLastServerActivityAt || 0) < speechEndedAt) {
        this._fallbackAudioTurnHttp(int16Chunks);
      }
    }, 3400);
  }

  async _fallbackAudioTurnHttp(int16Chunks) {
    if (!this.callActive || !int16Chunks || !int16Chunks.length) return;
    this.emit('interim', { text: 'Grounded audio recovery active…' });
    this.state = 'thinking';
    this._emitState();

    const activeStudy = this.studiesById.get(this.activeStudyId);
    const wavB64 = pcm16ChunksToWavBase64(int16Chunks, 16000);
    const ctrl = new AbortController();
    this.turnAbort = ctrl;
    let spokenReply = '';
    let citations = [];

    try {
      const r = await fetch(`${LIVE_ORIGIN}/api/live/turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: '',
          audio_wav_b64: wavB64,
          register: 'pi',
          site: this.buildCompactSiteDescriptor(),
          jpeg_b64: this.visionStream ? this.lastFrameB64 || null : null,
        }),
        signal: ctrl.signal,
      });
      if (r.ok) {
        const d = await r.json();
        spokenReply = String(d.spoken_text || '').trim();
        citations = d.citations || [];
        if (d.witness_clip) this._emitWitnessTurn(d.witness_clip);
      }
    } catch {}

    this.emit('interim', { text: '' });
    if (ctrl.signal.aborted || !this.callActive) return;

    if (!this.streamingUserTurn) {
      const uTurn = {
        id: `turn-${++this.turnCounter}`,
        role: 'user',
        speakerName: 'You',
        speakerRole: '16 kHz Voice Turn',
        text: '🎙 [Spoken question]',
        ts: Date.now(),
      };
      this.transcript.push(uTurn);
      this.emit('turn', uTurn);
    } else {
      this.sealStreamingTurns();
    }

    if (!spokenReply && activeStudy) {
      const plainLead =
        (activeStudy.plain_bullets && activeStudy.plain_bullets[0]) || activeStudy.headline_claim || activeStudy.short_title;
      spokenReply = `In plain words on ${activeStudy.short_title}: ${plainLead} Ask if you want the technical metrics or formal proof.`;
    }
    if (!spokenReply) spokenReply = 'I heard you — ask about any study on this page in plain words.';

    // If Studio S2S WebSocket reconnected cleanly, speak through native 24 kHz S2S; otherwise speak via Kokoro-82M FP32
    if (this.engineMode === 'studio_s2s') {
      try {
        const ws = await this.ensureStudioWebSocket();
        ws.send(
          JSON.stringify({
            type: 'text',
            text: `Read this grounded answer naturally and verbatim in 2 crisp sentences: ${spokenReply}`,
          })
        );
        return;
      } catch {}
    }

    const persona = STUDIO_VOICES[this.voice] || STUDIO_VOICES.Aoede;
    const aiTurn = {
      id: `turn-${++this.turnCounter}`,
      role: 'assistant',
      speakerName: persona.name,
      speakerRole: `${persona.role} · Kokoro FP32`,
      voice: this.voice,
      text: spokenReply,
      citations,
      studyId: activeStudy?.id || null,
      receipt: this.makeReceipt(activeStudy),
      actions: activeStudy ? this._defaultActionsForStudy(activeStudy) : [],
      ts: Date.now(),
    };
    this.transcript.push(aiTurn);
    this.emit('turn', aiTurn);

    await this.speakSovereignKokoro(spokenReply, { voice: this.voice, speed: this.speed, signal: ctrl.signal });
    if (!ctrl.signal.aborted && this.activeSources.size === 0) {
      this.state = this.callActive ? 'listening' : 'idle';
      this._emitState();
    }
  }

  // ---------- Tier-A Default: `studio_s2s` Full-Duplex 24 kHz Native Audio WebSocket ----------
  async ensureStudioWebSocket() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return this.ws;
    if (this.wsReadyPromise) return this.wsReadyPromise;

    await this._ensureAudioContext();
    await this.loadCorpus().catch(() => {});

    const wsProto = LIVE_ORIGIN.startsWith('https') ? 'wss:' : 'ws:';
    const hostPart = LIVE_ORIGIN.replace(/^https?:/, '');
    const wsUrl = `${wsProto}${hostPart}/api/live/ws`;

    this.wsReadyPromise = new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl);
      this.ws = ws;
      let settled = false;

      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          this.wsReadyPromise = null;
          reject(new Error('Studio Live S2S connection timeout'));
        }
      }, 9000);

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'start',
            voice: this.voice,
            register: 'pi',
            site: this.buildCompactSiteDescriptor(),
          })
        );
      };

      ws.onmessage = (ev) => {
        let msg;
        try {
          msg = JSON.parse(ev.data);
        } catch {
          return;
        }
        if (msg.type === 'ready') {
          this.wsSessionId = msg.session_id || 'live';
          this.wsModel = msg.model || this.wsModel;
          this.wsReconnectAttempts = 0;
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            this.wsReadyPromise = null;
            resolve(ws);
          }
          this.emit('engine-progress', {
            engine: 'kokoro-tts',
            status: 'ready',
            progress: 100,
            info: { device: 'studio-s2s', dtype: '24kHz-native' },
          });
          this._emitState();
          this._emitTelemetry();
        } else if (msg.type === 'audio' && msg.pcm24_b64) {
          this.s2sLastServerActivityAt = performance.now();
          this._clearTurnWatchdogs();
          this.emit('interim', { text: '' });
          this.enqueuePcmPlayback(pcm16Base64ToFloat32(msg.pcm24_b64), msg.sample_rate || 24000);
        } else if (msg.type === 'transcript' && msg.text) {
          if (msg.role !== 'user') {
            this.s2sLastServerActivityAt = performance.now();
            this._clearTurnWatchdogs();
          }
          this._handleStreamingTranscript(msg.role === 'user' ? 'user' : 'assistant', msg.text, !!msg.finished);
        } else if (msg.type === 'citations' && Array.isArray(msg.items)) {
          this.sealStreamingTurns();
          this._emitCitationsTurn(msg.query, msg.items);
        } else if (msg.type === 'witness_clip' && msg.clip) {
          this.emit('witness-clip', msg.clip);
          this._emitWitnessTurn(msg.clip);
        } else if (msg.type === 'interrupted') {
          this.bargeIn('ws-interrupted');
        } else if (msg.type === 'turn_complete') {
          this.s2sLastServerActivityAt = performance.now();
          this._clearTurnWatchdogs();
          this.sealStreamingTurns();
          if (typeof msg.joules_est === 'number') this._bumpBrowserHeuristic(msg.joules_est);
          if (this.activeSources.size === 0) {
            this.state = this.callActive ? 'listening' : 'idle';
            this._emitState();
          }
        } else if (msg.type === 'error') {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            this.wsReadyPromise = null;
            reject(new Error(msg.message || 'Studio WebSocket error'));
          }
          this.emit('error', { scope: 'studio-s2s', message: msg.message || 'Switching to Sovereign GPU fallback.' });
        }
      };

      ws.onerror = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          this.wsReadyPromise = null;
          reject(new Error('WebSocket transport error'));
        }
      };

      ws.onclose = () => {
        if (this.ws === ws) {
          this.ws = null;
          this.wsReadyPromise = null;
          this._emitState();
          if (this.callActive && this.engineMode === 'studio_s2s') {
            const backoff = Math.min(2500, 450 * Math.pow(1.6, this.wsReconnectAttempts || 0));
            this._scheduleWsReconnect(backoff);
          }
        }
      };
    });

    return this.wsReadyPromise;
  }

  _handleStreamingTranscript(role, chunkText, finished) {
    if (role === 'user') {
      this.emit('interim', { text: finished ? '' : chunkText });
      if (!this.streamingUserTurn) {
        this.streamingUserTurn = {
          id: `turn-${++this.turnCounter}`,
          role: 'user',
          speakerName: 'You',
          speakerRole: 'Studio Live Duplex',
          text: chunkText,
          streaming: !finished,
          ts: Date.now(),
        };
        this.transcript.push(this.streamingUserTurn);
        this.emit('turn', this.streamingUserTurn);
      } else {
        this.streamingUserTurn.text += chunkText;
        this.streamingUserTurn.streaming = !finished;
        this.emit('turn-update', this.streamingUserTurn);
      }
      if (finished) {
        this.lastTurnCommitAt = performance.now();
        this.streamingUserTurn = null;
      }
      return;
    }

    const study = this.studiesById.get(this.activeStudyId);
    const persona = STUDIO_VOICES[this.voice] || STUDIO_VOICES.Aoede;
    if (!this.streamingAssistantTurn) {
      this.streamingAssistantTurn = {
        id: `turn-${++this.turnCounter}`,
        role: 'assistant',
        speakerName: persona.name,
        speakerRole: `${persona.role} · 24 kHz S2S`,
        voice: this.voice,
        text: chunkText,
        studyId: study?.id || null,
        receipt: this.makeReceipt(study),
        actions: study ? this._defaultActionsForStudy(study) : [],
        streaming: !finished,
        ts: Date.now(),
      };
      this.transcript.push(this.streamingAssistantTurn);
      this.emit('turn', this.streamingAssistantTurn);
    } else {
      this.streamingAssistantTurn.text += chunkText;
      this.streamingAssistantTurn.streaming = !finished;
      this.emit('turn-update', this.streamingAssistantTurn);
    }
    if (finished) this.streamingAssistantTurn = null;
  }

  sealStreamingTurns() {
    if (this.streamingUserTurn) {
      this.streamingUserTurn.streaming = false;
      this.emit('turn-update', this.streamingUserTurn);
      this.streamingUserTurn = null;
    }
    if (this.streamingAssistantTurn) {
      this.streamingAssistantTurn.streaming = false;
      this.emit('turn-update', this.streamingAssistantTurn);
      this.streamingAssistantTurn = null;
    }
    this.emit('interim', { text: '' });
  }

  _emitCitationsTurn(query, items) {
    const study = this.studiesById.get(this.activeStudyId);
    const summary = items
      .slice(0, 4)
      .map((it, idx) => `[${idx + 1}] ${it.title || it.work_id || 'Source'}${it.year ? ` (${it.year})` : ''}`)
      .join(' · ');
    const turnItem = {
      id: `turn-${++this.turnCounter}`,
      role: 'assistant',
      speakerName: 'Commons Grounding',
      speakerRole: `${items.length} Source(s)`,
      voice: this.voice,
      text: `Grounded sources${query ? ` for "${query}"` : ''}: ${summary}`,
      citations: items,
      studyId: study?.id || null,
      receipt: this.makeReceipt(study),
      actions: items
        .filter((it) => it.url)
        .slice(0, 3)
        .map((it) => ({ type: 'link', href: it.url, label: `↗ ${(it.title || 'Source').slice(0, 28)}` })),
      ts: Date.now(),
    };
    this.transcript.push(turnItem);
    this.emit('turn', turnItem);
  }

  _emitWitnessTurn(clip) {
    const study = this.studiesById.get(this.activeStudyId);
    const turnItem = {
      id: `turn-${++this.turnCounter}`,
      role: 'assistant',
      speakerName: `Primary Witness · ${clip.speaker || clip.title || 'Archive'}`,
      speakerRole: clip.locator || 'Audio/Video Witness',
      voice: this.voice,
      text: `"${String(clip.quote || '').slice(0, 240)}"`,
      witnessClip: clip,
      studyId: study?.id || null,
      receipt: this.makeReceipt(study),
      actions: clip.url ? [{ type: 'link', href: clip.url, label: '🎧 Open Witness Source' }] : [],
      ts: Date.now(),
    };
    this.transcript.push(turnItem);
    this.emit('turn', turnItem);
  }

  // ---------- Tier-C Toggle: `sovereign_gpu` Local Kokoro-82M FP32 + Perth 32 kHz ----------
  async ensureKokoroWorker() {
    if (this.kokoroWorker) return this.kokoroWorker;
    const w = new Worker(SCHOLAR_KOKORO_WORKER_URL, { type: 'module', name: 'openie-kokoro-fp32' });
    w.onmessage = (ev) => {
      const m = ev.data || {};
      if (m.type === 'progress') {
        const pct = Math.round((m.done / Math.max(1, m.total)) * 100);
        this.emit('engine-progress', {
          engine: 'kokoro-tts',
          status: `OPFS SHA-256 caching (${pct}%)`,
          progress: pct,
        });
      } else if (m.type === 'downloaded') {
        w.postMessage({ type: 'load', base: KOKORO_PACK_BASE, vendor: ORT_VENDOR_BASE });
      } else if (m.type === 'loaded') {
        this.kokoroReady = true;
        this.kokoroLoading = false;
        this.kokoroInfo = { device: 'webgpu-fp32', dtype: 'fp32-32kHz-perth', loadMs: m.ms };
        this.emit('engine-progress', { engine: 'kokoro-tts', status: 'ready', progress: 100, info: this.kokoroInfo });
        this._emitState();
        this._emitTelemetry();
      } else if (m.type === 'said') {
        const pend = this.kokoroPending.get(m.id);
        if (pend) {
          this.kokoroPending.delete(m.id);
          pend.res(m);
        }
        if (m.pcm && m.pcm.length) {
          this.enqueuePcmPlayback(m.pcm, m.sampleRate || 32000);
        }
      } else if (m.type === 'error') {
        if (m.id && this.kokoroPending.has(m.id)) {
          const pend = this.kokoroPending.get(m.id);
          this.kokoroPending.delete(m.id);
          pend.rej(new Error(m.message || 'Kokoro error'));
        }
        this.kokoroLoading = false;
        this.emit('error', { scope: 'sovereign-kokoro', message: m.message || 'Kokoro FP32 worker error' });
      }
    };
    this.kokoroWorker = w;
    return w;
  }

  async warmupKokoro() {
    if (this.kokoroReady) return this.kokoroInfo;
    if (this.kokoroLoading) return null;
    this.kokoroLoading = true;
    this._emitTelemetry();
    try {
      const w = await this.ensureKokoroWorker();
      const st = await new Promise((resolve) => {
        const onMsg = (ev) => {
          if (ev.data?.type === 'status' || ev.data?.type === 'error') {
            w.removeEventListener('message', onMsg);
            resolve(ev.data);
          }
        };
        w.addEventListener('message', onMsg);
        w.postMessage({ type: 'status', base: KOKORO_PACK_BASE });
      });
      if (st?.state === 'ready') {
        w.postMessage({ type: 'load', base: KOKORO_PACK_BASE, vendor: ORT_VENDOR_BASE });
      } else {
        w.postMessage({ type: 'download', base: KOKORO_PACK_BASE });
      }
      return st;
    } catch (err) {
      this.kokoroLoading = false;
      this.emit('error', { scope: 'sovereign-kokoro', message: String(err) });
      return null;
    }
  }

  async speakSovereignKokoro(rawText, { voice, speed, signal } = {}) {
    const clean = normalizeForSpeech(rawText);
    if (!clean || signal?.aborted) return;
    await this._ensureAudioContext();
    if (!this.kokoroReady) {
      await this.warmupKokoro();
      // Wait briefly if OPFS cache is already loading
      let waited = 0;
      while (!this.kokoroReady && this.kokoroLoading && waited < 12000 && !signal?.aborted) {
        await new Promise((r) => setTimeout(r, 150));
        waited += 150;
      }
    }
    if (!this.kokoroReady || !this.kokoroWorker || signal?.aborted) return;
    const id = this.kokoroSayId++;
    const kokoroVoice = mapToKokoroFp32Voice(voice || this.voice);
    await new Promise((res, rej) => {
      this.kokoroPending.set(id, { res, rej });
      this.kokoroWorker.postMessage({
        type: 'say',
        id,
        text: clean,
        speed: speed || this.speed || 1.04,
        voice: kokoroVoice,
      });
    }).catch(() => {});
  }

  _startSovereignSpeechRec() {
    if (this.engineMode !== 'sovereign_gpu' || !this.speechRecSupported || this.forceWhisper || this.speechRec) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onresult = (ev) => {
      if (!this.callActive || this.micMuted || this.engineMode !== 'sovereign_gpu') return;
      const last = ev.results[ev.results.length - 1];
      if (!last) return;
      const txt = last[0].transcript.trim();
      this.emit('interim', { text: last.isFinal ? '' : txt });
      if (last.isFinal && txt.length >= 2) {
        if (this.state === 'speaking') this.bargeIn('speech-rec');
        this.lastTurnCommitAt = performance.now();
        this.ask(txt, { fromVoice: true });
      }
    };
    rec.onerror = () => {};
    rec.onend = () => {
      if (this.callActive && !this.micMuted && this.engineMode === 'sovereign_gpu' && !this.forceWhisper && this.speechRec === rec) {
        try {
          rec.start();
        } catch {}
      }
    };
    try {
      rec.start();
      this.speechRec = rec;
    } catch {}
  }

  _stopSovereignSpeechRec() {
    if (this.speechRec) {
      const r = this.speechRec;
      this.speechRec = null;
      try {
        r.stop();
      } catch {}
    }
  }

  _ensureAsrWorker() {
    if (this.asrWorker) return this.asrWorker;
    const w = new Worker(ASR_WORKER_URL, { type: 'module' });
    w.onmessage = (e) => {
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
    this.asrWorker = w;
    return w;
  }

  async warmupWhisper() {
    if (this.whisperReady || this.whisperLoading) return this.whisperInfo;
    this.whisperLoading = true;
    const w = this._ensureAsrWorker();
    const id = ++this.asrReqId;
    try {
      const res = await new Promise((resolve, reject) => {
        this.asrPending.set(id, { res: resolve, rej: reject });
        w.postMessage({ id, type: 'warmup' });
      });
      this.whisperInfo = res.info;
      this.whisperReady = true;
      this.whisperLoading = false;
      this.emit('engine-progress', { engine: 'whisper-stt', status: 'ready', progress: 100, info: res.info });
      this._emitState();
      this._emitTelemetry();
      return res.info;
    } catch {
      this.whisperLoading = false;
      return null;
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
    const w = this._ensureAsrWorker();
    const id = ++this.asrReqId;
    try {
      const res = await new Promise((resolve, reject) => {
        this.asrPending.set(id, { res: resolve, rej: reject });
        w.postMessage({ id, type: 'transcribe', audio: merged }, [merged.buffer]);
      });
      this.emit('interim', { text: '' });
      const text = String(res?.text || '').replace(/\[BLANK_AUDIO\]|\(blank audio\)/gi, '').trim();
      if (text.length >= 2 && this.callActive) {
        this.lastTurnCommitAt = performance.now();
        await this.ask(text, { fromVoice: true });
      }
    } catch {
      this.emit('interim', { text: '' });
    }
  }

  async warmupVision(tier = 'auto') {
    if (this.visionModelLoading) return null;
    this.visionModelLoading = true;
    if (!this.visionWorker) {
      this.visionWorker = new Worker(VISION_WORKER_URL, { type: 'module' });
      this.visionWorker.onmessage = (e) => {
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
    }
    const id = ++this.visionReqId;
    try {
      const res = await new Promise((resolve, reject) => {
        this.visionPending.set(id, { res: resolve, rej: reject });
        this.visionWorker.postMessage({ id, type: 'warmup', tier });
      });
      this.visionInfo = res.info;
      this.visionModelReady = true;
      this.visionModelLoading = false;
      this.emit('engine-progress', { engine: 'vision-vlm', status: 'ready', progress: 100, info: res.info });
      this._emitState();
      this._emitTelemetry();
      return res.info;
    } catch {
      this.visionModelLoading = false;
      return null;
    }
  }

  setDeepLlm(enabled) {
    this.llmEnabled = !!enabled;
    this._emitState();
    this._emitTelemetry();
  }

  // ---------- Vision Stream & 768px Motion-Gated S2S Frame Push ----------
  attachVisionVideo(videoEl) {
    if (!videoEl) return;
    this.visionVideoEls.add(videoEl);
    if (this.visionStream) {
      videoEl.srcObject = this.visionStream;
      videoEl.play().catch(() => {});
    }
  }

  detachVisionVideo(videoEl) {
    this.visionVideoEls.delete(videoEl);
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
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { width: { ideal: 1440 }, height: { ideal: 900 } }, audio: false });
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
    this.visionSampleTimer = setInterval(() => {
      this.sampleAndPushVisionFrame(false);
    }, 950);
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
    this.lastLumaSig = null;
    for (const v of this.visionVideoEls) v.srcObject = null;
    this._emitState();
    this._emitTelemetry();
  }

  sampleAndPushVisionFrame(force = false) {
    const vid = this.hiddenVisionVideo;
    if (!this.visionStream || !vid || vid.videoWidth < 8) return null;
    const scale = Math.min(1, 768 / Math.max(vid.videoWidth, vid.videoHeight));
    const w = Math.max(64, Math.round(vid.videoWidth * scale));
    const h = Math.max(64, Math.round(vid.videoHeight * scale));
    if (!this.offscreenCanvas) this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = w;
    this.offscreenCanvas.height = h;
    const ctx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(vid, 0, 0, w, h);

    // 64x36 perceptual luma signature for motion gating + Canvas2D edge telemetry
    const tw = Math.min(w, 64);
    const th = Math.min(h, 36);
    const img = ctx.getImageData(0, 0, tw, th).data;
    const n = tw * th;
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
    for (let y = 1; y < th - 1; y++) {
      for (let x = 1; x < tw - 1; x++) {
        const idx = y * tw + x;
        if (Math.abs(luma[idx + 1] - luma[idx - 1]) + Math.abs(luma[idx + tw] - luma[idx - tw]) > 40) edgeHits++;
      }
    }
    const edgeDensity = edgeHits / Math.max(1, (tw - 2) * (th - 2));

    let diff = 999;
    let motionPct = 0;
    if (this.lastLumaSig && this.lastLumaSig.length === n) {
      let s = 0;
      let moved = 0;
      for (let i = 0; i < n; i++) {
        const d = Math.abs(luma[i] - this.lastLumaSig[i]);
        s += d;
        if (d > 18) moved++;
      }
      diff = s / n;
      motionPct = (moved / n) * 100;
    }
    this.lastLumaSig = luma;

    const dataUrl = this.offscreenCanvas.toDataURL('image/jpeg', 0.76);
    const jpegB64 = dataUrl.split(',')[1] || '';
    this.lastFrameB64 = jpegB64;

    const sceneType =
      edgeDensity > 0.14 && contrastRms > 40
        ? 'High-edge technical diagram, code, or equation sheet'
        : edgeDensity > 0.08
        ? 'Structured UI, chart, or hardware bench view'
        : 'Natural camera scene';

    this.lastVisionSnapshot = {
      dataUrl,
      jpegB64,
      diff,
      metrics: {
        width: vid.videoWidth,
        height: vid.videoHeight,
        meanLuma: Math.round(meanLuma),
        contrastRms: Math.round(contrastRms),
        edgeDensityPct: Math.round(edgeDensity * 1000) / 10,
        motionPct: Math.round(motionPct * 10) / 10,
        sceneType,
      },
      source: this.visionSource,
      ts: Date.now(),
    };
    this.emit('vision-frame', this.lastVisionSnapshot);

    if ((force || diff >= 6.5) && this.ws && this.ws.readyState === WebSocket.OPEN && jpegB64) {
      this.ws.send(JSON.stringify({ type: 'vision', jpeg_b64: jpegB64, source: this.visionSource || 'camera' }));
    }
    return this.lastVisionSnapshot;
  }

  async analyzeFrameNow(prompt = '') {
    if (!this.visionStream) {
      const ok = await this.startCamera(this.cameraFacing);
      if (!ok) return null;
      await new Promise((r) => setTimeout(r, 380));
    }
    const snap = this.sampleAndPushVisionFrame(true);
    const inspectPrompt =
      prompt ||
      'Look at the visual frame I just shared and explain the key equations, charts, code, or hardware components concisely.';
    await this.sendGroundedPrompt(inspectPrompt, { userDisplayText: prompt || '📸 Inspect current frame' });
    return snap;
  }

  // ---------- Unified Engine Controls (`studio_s2s` Default + `sovereign_gpu` Toggle) ----------
  async setEngineMode(mode) {
    if (mode !== 'studio_s2s' && mode !== 'sovereign_gpu') return;
    if (this.engineMode === mode) return;
    const wasActive = this.callActive;
    this.bargeIn('silent-reset');
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
      this.wsReadyPromise = null;
    }
    this._stopSovereignSpeechRec();
    this.engineMode = mode;
    if (mode === 'sovereign_gpu') {
      this.warmupKokoro().catch(() => {});
    }
    this._emitState();
    this._emitTelemetry();
    if (wasActive) {
      await this.startCall({ studyId: this.activeStudyId, mode: this.mode });
    }
  }

  async setVoice(voiceId) {
    const clean = normalizeStudioVoice(voiceId);
    if (this.voice === clean) return;
    this.voice = clean;
    this._emitState();
    this._emitTelemetry();

    // Reconnect active studio_s2s WebSocket seamlessly so the new 24 kHz Studio Voice takes effect immediately
    if (this.engineMode === 'studio_s2s' && this.ws) {
      this.bargeIn('silent-reset');
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
      this.wsReadyPromise = null;
      if (this.callActive) {
        try {
          await this.ensureStudioWebSocket();
        } catch {}
      }
    }
  }

  setSpeed(speed) {
    const n = Number(speed);
    if (Number.isFinite(n) && n >= 0.6 && n <= 1.8) {
      this.speed = n;
      this._emitState();
    }
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

  setForceWhisper(enabled) {
    this.forceWhisper = !!enabled;
    if (this.forceWhisper) {
      this._stopSovereignSpeechRec();
      this.warmupWhisper().catch(() => {});
    } else if (this.callActive && !this.micMuted && this.engineMode === 'sovereign_gpu') {
      this._startSovereignSpeechRec();
    }
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
    if (this.micMuted) this._stopSovereignSpeechRec();
    else if (this.callActive && this.engineMode === 'sovereign_gpu') this._startSovereignSpeechRec();
    this._emitState();
    return this.micMuted;
  }

  // ---------- Send Grounded Turn over Studio 24 kHz S2S or Sovereign Kokoro FP32 ----------
  async sendGroundedPrompt(groundedPrompt, { userDisplayText = null, study = null } = {}) {
    await this._ensureAudioContext();
    await this.loadCorpus().catch(() => {});
    const activeStudy = study || this.studiesById.get(this.activeStudyId);
    this.sealStreamingTurns();

    if (userDisplayText) {
      const uTurn = {
        id: `turn-${++this.turnCounter}`,
        role: 'user',
        speakerName: 'You',
        speakerRole: this.engineMode === 'studio_s2s' ? 'Studio Live' : 'Sovereign GPU',
        text: userDisplayText,
        ts: Date.now(),
      };
      this.transcript.push(uTurn);
      this.emit('turn', uTurn);
    }

    this.lastTurnCommitAt = performance.now();
    this.state = 'thinking';
    this._emitState();

    // Path 1: Default Studio Live 24 kHz Native S2S WebSocket
    if (this.engineMode === 'studio_s2s') {
      try {
        const ws = await this.ensureStudioWebSocket();
        if (this.visionStream) this.sampleAndPushVisionFrame(true);
        const sentAt = performance.now();
        ws.send(JSON.stringify({ type: 'text', text: groundedPrompt }));
        if (this.thinkingWatchdog) clearTimeout(this.thinkingWatchdog);
        this.thinkingWatchdog = setTimeout(() => {
          this.thinkingWatchdog = null;
          if (this.state === 'thinking' && (this.s2sLastServerActivityAt || 0) < sentAt) {
            this.state = this.callActive ? 'listening' : 'idle';
            this._emitState();
          }
        }, 7000);
        return;
      } catch (err) {
        this.emit('error', {
          scope: 'studio-s2s',
          message: `${String(err.message || err)} — falling back to /api/live/turn + Sovereign Kokoro FP32.`,
        });
      }
    }

    // Path 2: Sovereign Local GPU (Kokoro-82M FP32 32 kHz + /api/live/turn grounded synthesis)
    const ctrl = new AbortController();
    this.turnAbort = ctrl;
    let spokenReply = '';
    let citations = [];

    try {
      const r = await fetch(`${LIVE_ORIGIN}/api/live/turn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: groundedPrompt,
          register: 'pi',
          site: this.buildCompactSiteDescriptor(),
          jpeg_b64: this.visionStream ? this.lastFrameB64 || null : null,
        }),
        signal: ctrl.signal,
      });
      if (r.ok) {
        const d = await r.json();
        spokenReply = d.spoken_text || '';
        citations = d.citations || [];
        if (d.witness_clip) this._emitWitnessTurn(d.witness_clip);
      }
    } catch {}

    if (!spokenReply && activeStudy) {
      const plainLead =
        (activeStudy.plain_bullets && activeStudy.plain_bullets[0]) || activeStudy.headline_claim || activeStudy.short_title;
      spokenReply =
        `In plain words on ${activeStudy.short_title}: ${plainLead} ` +
        `Want the technical metrics or formal proof?`;
    }

    const persona = STUDIO_VOICES[this.voice] || STUDIO_VOICES.Aoede;
    const aiTurn = {
      id: `turn-${++this.turnCounter}`,
      role: 'assistant',
      speakerName: persona.name,
      speakerRole: `${persona.role} · Kokoro FP32`,
      voice: this.voice,
      text: spokenReply || 'Ready.',
      citations,
      studyId: activeStudy?.id || null,
      receipt: this.makeReceipt(activeStudy),
      actions: activeStudy ? this._defaultActionsForStudy(activeStudy) : [],
      ts: Date.now(),
    };
    this.transcript.push(aiTurn);
    this.emit('turn', aiTurn);

    if (spokenReply && !ctrl.signal.aborted) {
      await this.speakSovereignKokoro(spokenReply, { voice: this.voice, speed: this.speed, signal: ctrl.signal });
    }
    if (!ctrl.signal.aborted && this.activeSources.size === 0) {
      this.state = this.callActive ? 'listening' : 'idle';
      this._emitState();
    }
  }

  // ---------- Call Lifecycle, Ask, Walkthrough & Debate ----------
  async startCall(opts = {}) {
    await this.loadCorpus();
    const rCtx = typeof window !== 'undefined' ? window.__openieActiveMediaContext || this.mediaContext : this.mediaContext;
    if (opts.studyId && this.studiesById.has(opts.studyId)) {
      this.activeStudyId = opts.studyId;
    } else if (rCtx?.studyId && this.studiesById.has(rCtx.studyId)) {
      this.activeStudyId = rCtx.studyId;
    }
    if (opts.contextSummary) this.contextSummary = String(opts.contextSummary);
    if (opts.mode) this.mode = opts.mode;
    if (opts.voice) this.voice = normalizeStudioVoice(opts.voice);
    if (opts.engineMode) this.engineMode = opts.engineMode;

    this.callActive = true;
    this.lastTurnCommitAt = performance.now();
    this._emitState();

    await this.playPickupChime();
    await this._startMicrophoneAndVad();

    const study = this.studiesById.get(this.activeStudyId);
    const dom = this.scanActivePageDom();
    this.openVisualStage({ studyId: study?.id, clip: '15s' });

    if (this.mode === 'vision' && !this.visionStream) {
      await this.startCamera(this.cameraFacing);
    }

    if (this.engineMode === 'sovereign_gpu') {
      await this.warmupKokoro();
      if (!this.micMuted) this._startSovereignSpeechRec();
    } else {
      await this.ensureStudioWebSocket().catch(() => {});
    }

    if (this.mode === 'debate') {
      await this.startDebate(this.activeStudyId);
      return;
    }
    if (this.mode === 'copilot') {
      await this.startWalkthrough(this.activeStudyId);
      return;
    }

    const isRadio = typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') === '/radio' && rCtx;
    let greetInstruction;
    if (isRadio) {
      const epNum = String(rCtx.episodeNumber || 1).padStart(2, '0');
      greetInstruction =
        `Greet the live caller warmly in 2 plain, everyday spoken sentences (zero acronym soup) as the OpenIE Research Radio Studio host for Episode ${epNum} ("${rCtx.episodeTitle || ''}"). ` +
        `Mention they called in right as ${rCtx.activeSpeaker || 'the panel'} discussed ${study?.short_title || 'this topic'}, summarize the core everyday idea in one crisp phrase, and ask what they would like to explore.`;
    } else {
      const plainHook = (study?.plain_bullets && study.plain_bullets[0]) ? ` Plain idea: ${study.plain_bullets[0]}` : '';
      greetInstruction =
        `Greet the listener warmly in 2 crisp, everyday spoken sentences with zero acronym soup. Share the core everyday idea of ${study?.short_title || 'OpenIE Research'} in plain human words (${plainHook}), and end with: "Ask anything in plain words, or say the word if you want the technical metrics or formal proof."`;
    }

    await this.sendGroundedPrompt(greetInstruction, { userDisplayText: null, study });
  }

  endCall() {
    this.bargeIn('silent-reset');
    this.callActive = false;
    this.s2sSpeaking = false;
    this.s2sPcm16Chunks = [];
    this._clearTurnWatchdogs();
    if (this.wsReconnectTimer) {
      clearTimeout(this.wsReconnectTimer);
      this.wsReconnectTimer = null;
    }
    this._stopSovereignSpeechRec();
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
      this.wsReadyPromise = null;
    }
    if (this.vadTimer) {
      clearInterval(this.vadTimer);
      this.vadTimer = null;
    }
    if (this.workletNode) {
      try {
        this.workletNode.disconnect();
      } catch {}
      this.workletNode = null;
    }
    if (this.micSilentSink) {
      try {
        this.micSilentSink.disconnect();
      } catch {}
      this.micSilentSink = null;
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

  async ask(queryText, opts = {}) {
    await this.loadCorpus();
    const cleanQ = String(queryText || '').trim();
    if (!cleanQ) return null;

    this.bargeIn('silent-reset');
    const qLower = cleanQ.toLowerCase();

    // 0. Interactive Talk Radio Studio Voice Commands on /radio/
    if (typeof window !== 'undefined' && window.location.pathname.replace(/\/+$/, '') === '/radio') {
      const epMatch = qLower.match(/\b(?:play|tune|switch to|load)?\s*episode\s*(\d{1,2})\b/);
      if (epMatch) {
        const epNum = parseInt(epMatch[1], 10);
        window.dispatchEvent(new CustomEvent('openie:radio-command', { detail: { action: 'select-episode', number: epNum } }));
        await new Promise((r) => setTimeout(r, 80));
        const rCtx = window.__openieActiveMediaContext || this.mediaContext;
        if (rCtx?.studyId && this.studiesById.has(rCtx.studyId)) this.setStudy(rCtx.studyId);
        const st = this.studiesById.get(this.activeStudyId);
        await this.sendGroundedPrompt(
          `Confirm in 2 concise spoken sentences that we switched the Research Radio console to Episode ${epNum} ("${rCtx?.episodeTitle || ''}"), grounded in ${st?.short_title || 'OpenIE Research'} (${st?.evidence_class || 'unmetered'}).`,
          { userDisplayText: cleanQ, study: st }
        );
        return cleanQ;
      }
      if (/\b(next episode|skip episode)\b/.test(qLower)) {
        window.dispatchEvent(new CustomEvent('openie:radio-command', { detail: { action: 'next-episode' } }));
        await new Promise((r) => setTimeout(r, 80));
        const rCtx = window.__openieActiveMediaContext || this.mediaContext;
        if (rCtx?.studyId && this.studiesById.has(rCtx.studyId)) this.setStudy(rCtx.studyId);
        const st = this.studiesById.get(this.activeStudyId);
        await this.sendGroundedPrompt(
          `Confirm briefly that we advanced to Radio Episode ${rCtx?.episodeNumber || ''}: "${rCtx?.episodeTitle || ''}", and summarize its core claim in 1 sentence.`,
          { userDisplayText: cleanQ, study: st }
        );
        return cleanQ;
      }
      if (/\b(previous episode|prev episode|prior episode)\b/.test(qLower)) {
        window.dispatchEvent(new CustomEvent('openie:radio-command', { detail: { action: 'prev-episode' } }));
        await new Promise((r) => setTimeout(r, 80));
        const rCtx = window.__openieActiveMediaContext || this.mediaContext;
        if (rCtx?.studyId && this.studiesById.has(rCtx.studyId)) this.setStudy(rCtx.studyId);
        const st = this.studiesById.get(this.activeStudyId);
        await this.sendGroundedPrompt(
          `Confirm briefly that we stepped back to Radio Episode ${rCtx?.episodeNumber || ''}: "${rCtx?.episodeTitle || ''}".`,
          { userDisplayText: cleanQ, study: st }
        );
        return cleanQ;
      }
      if (/\b(resume radio|continue radio|back to broadcast|unpause radio)\b/.test(qLower)) {
        this.endCall();
        window.dispatchEvent(new CustomEvent('openie:radio-command', { detail: { action: 'resume-radio' } }));
        return cleanQ;
      }
      if (/\b(open study paper|open the paper|read study paper)\b/.test(qLower)) {
        const st = this.studiesById.get(this.activeStudyId);
        window.open(st?.path || '/#catalog', '_blank', 'noopener');
        await this.sendGroundedPrompt(
          `Let the listener know in 1 sentence that we opened the manuscript for ${st?.short_title || 'the active study'}.`,
          { userDisplayText: cleanQ, study: st }
        );
        return cleanQ;
      }
    }

    // 1. Vision inspection intent
    if (/\b(camera|webcam|screen|frame|holding|look at|inspect my)\b/.test(qLower)) {
      if (/\bscreen\b/.test(qLower) && !this.visionStream) await this.startScreenShare();
      return this.analyzeFrameNow(cleanQ);
    }

    // 2. Match study via BM25
    const hits = this.searchStudies(cleanQ, 3);
    const matchedStudy =
      hits.length && hits[0].score >= 3.2
        ? hits[0].study
        : this.studiesById.get(this.activeStudyId) || this.corpus.studies[0];
    if (matchedStudy && matchedStudy.id !== this.activeStudyId) {
      this.activeStudyId = matchedStudy.id;
      this._emitState();
    }

    if (/\b(debate|skeptic|skeptical|reviewer|challenge|argue)\b/.test(qLower)) {
      this.mode = 'debate';
      this._emitState();
      return this.startDebate(matchedStudy.id);
    }

    if (/\b(walk me through|walkthrough|tour|step by step|with video)\b/.test(qLower)) {
      this.mode = 'copilot';
      this._emitState();
      return this.startWalkthrough(matchedStudy.id);
    }

    // 3. Stage & DOM Synchronization
    let stageClip = '15s';
    if (/\b(tiktok|vertical|reel|short)\b/.test(qLower)) stageClip = 'tiktok';
    else if (/\b(180s|3m|3-minute|3 minute|three minute|deep cut)\b/.test(qLower)) stageClip = '180s';
    else if (/\b(90s|90-second|90 second|full briefing)\b/.test(qLower)) stageClip = '90s';
    else if (/\b(method|meter|sensor|shunt|hardware|baseline)\b/.test(qLower)) stageClip = '45s';
    else if (/\b(falsifier|limitation|negative|fail|replicate|caveat|scope)\b/.test(qLower)) stageClip = 'living';

    const dom = this.scanActivePageDom();
    let matchedDomSec = null;
    if (opts.sectionSlug) {
      matchedDomSec = dom.sections.find((s) => s.slug === opts.sectionSlug) || null;
    } else if (dom.sections.length) {
      matchedDomSec =
        dom.sections.find((s) => {
          const st = s.text.toLowerCase();
          return st.length > 4 && (qLower.includes(st) || tokenize(cleanQ).some((t) => t.length > 4 && st.includes(t)));
        }) || null;
    }
    if (matchedDomSec) this.scrollToSection(matchedDomSec.slug);
    this.openVisualStage({ studyId: matchedStudy.id, clip: stageClip });

    const wantsDeepTech = /\b(formal|theorem|proof|lean|equation|formula|math|shunt|ina260|ina3221|ina238|rapl|measured_j|reported_j|est_j|clopper|raw metric|technical)\b/i.test(cleanQ);
    const styleDirective = wantsDeepTech
      ? `The user asked for technical/formal detail: answer accurately in 2 to 4 crisp spoken sentences with exact measurement labels (${matchedStudy.evidence_class}, Signed Provenance · Self-Checked): ${cleanQ}`
      : `Answer FIRST in 2 to 3 plain, concrete everyday spoken sentences with zero acronym soup so a smart non-specialist gets the core idea immediately, then end with a brief optional offer ("Want the technical metrics or formal proof?"): ${cleanQ}`;

    const groundingContext =
      `[Grounded Context — Study: ${matchedStudy.short_title} (${matchedStudy.evidence_class}, Signed Provenance · Self-Checked). ` +
      `Plain Points: ${(matchedStudy.plain_bullets || []).join(' ')} Claim: ${matchedStudy.headline_claim} Methods: ${matchedStudy.methods_and_meter} Scope/Limits: ${matchedStudy.limitations_and_scope}` +
      (matchedDomSec ? ` Active Page Section "${matchedDomSec.text}": ${matchedDomSec.snippet.slice(0, 200)}` : '') +
      `] Without reading brackets aloud — ${styleDirective}`;

    await this.sendGroundedPrompt(groundingContext, {
      userDisplayText: opts.fromVoice ? null : cleanQ,
      study: matchedStudy,
    });
    return cleanQ;
  }

  async startWalkthrough(studyId) {
    await this.loadCorpus();
    const study = this.studiesById.get(studyId || this.activeStudyId) || this.corpus.studies[0];
    this.activeStudyId = study.id;
    this.mode = 'copilot';
    this.bargeIn('silent-reset');
    this._emitState();

    const dom = this.scanActivePageDom();
    if (dom.sections[0] && dom.pathname.includes(study.id)) {
      this.scrollToSection(dom.sections[0].slug);
    }
    this.openVisualStage({ studyId: study.id, clip: '15s' });

    const tourPrompt =
      `Deliver a warm, jargon-free 3-sentence plain-language walkthrough of ${study.short_title}: ` +
      `Sentence 1 (Everyday setup & problem): ${(study.plain_bullets || [])[0] || study.headline_claim} ` +
      `Sentence 2 (What we built & what we measured in plain words): ${(study.plain_bullets || []).slice(1).join(' ')} ` +
      `Sentence 3 (How someone could test or challenge it, plus optional offer: "Want the technical metrics or formal proof?"): ${(study.limitations_and_scope || '').split('.')[0]}.`;

    await this.sendGroundedPrompt(tourPrompt, {
      userDisplayText: `🧭 Co-Pilot Tour: ${study.short_title}`,
      study,
    });
  }

  async startDebate(studyId) {
    await this.loadCorpus();
    const study = this.studiesById.get(studyId || this.activeStudyId) || this.corpus.studies[0];
    this.activeStudyId = study.id;
    this.mode = 'debate';
    this.bargeIn('silent-reset');
    this._emitState();

    this.openVisualStage({ studyId: study.id, clip: '45s' });

    const debatePrompt =
      `Host a brisk, incisive Outside-Review Skeptic vs Systems Lead exchange on ${study.short_title} (${study.evidence_class}, Signed Provenance · Self-Checked). ` +
      `First voice the Skeptic's sharpest critique: "${study.skeptic_question}" and "${study.skeptic_followup}". ` +
      `Then give the Systems Lead's candid post-review answer with exact finite-sample bounds and non-mixing rules: "${study.architect_answer}" and "${study.architect_rebuttal}". ` +
      `End by inviting the listener to jump in and challenge either side.`;

    await this.sendGroundedPrompt(debatePrompt, {
      userDisplayText: `🎙 Skeptic Debate: ${study.short_title}`,
      study,
    });
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
      if (this.state === 'speaking' && this.ttsAnalyser && this.ttsFreqBins) {
        this.ttsAnalyser.getByteFrequencyData(this.ttsFreqBins);
        let s = 0;
        for (let i = 2; i < 48; i++) s += this.ttsFreqBins[i] / 255;
        amp = 0.16 + (s / 46) * 0.84;
      } else if (this.state === 'listening' && this.micAnalyser && this.micFreqBins && !this.micMuted) {
        this.micAnalyser.getByteFrequencyData(this.micFreqBins);
        let s = 0;
        for (let i = 4; i < 52; i++) s += this.micFreqBins[i] / 255;
        amp = 0.1 + (s / 48) * 0.85;
      } else if (this.state === 'thinking') {
        amp = 0.28 + 0.18 * Math.sin(this.orbPhase * 3.2);
      }

      for (const canvas of this.orbCanvases) this._drawOrb(canvas, amp);
      this.orbRaf = requestAnimationFrame(tick);
    };
    this.orbRaf = requestAnimationFrame(tick);
  }

  _drawOrb(canvas, amp) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cssW = canvas.clientWidth || 240;
    const cssH = canvas.clientHeight || 240;
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
      primary = '245, 158, 11';
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
      const pts = 72;
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
          ? `rgba(${primary}, 0.82)`
          : ring === 1
          ? `rgba(${secondary}, 0.55)`
          : `rgba(255, 255, 255, ${0.22 + amp * 0.25})`;
      ctx.lineWidth = ring === 0 ? 2.2 : 1.3;
      ctx.stroke();
    }

    const coreR = baseR * (0.68 + amp * 0.14);
    const coreGrad = ctx.createRadialGradient(cx - coreR * 0.22, cy - coreR * 0.22, coreR * 0.08, cx, cy, coreR);
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
    coreGrad.addColorStop(0.38, `rgba(${primary}, 0.78)`);
    coreGrad.addColorStop(1, 'rgba(15, 20, 25, 0.92)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fill();

    if (this.visionStream) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-this.orbPhase * 0.35);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.72)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 1.28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  // ---------- WebMCP Tools ----------
  async start_live_voice_call(input = {}) {
    await this.loadCorpus();
    const studyId = input.study_id || input.id || this.activeStudyId;
    const mode = input.mode || 'call';
    const voice = input.voice || this.voice;
    await this.startCall({ studyId, mode, voice });
    if (input.prompt) await this.ask(String(input.prompt));
    return { status: 'active', engine: this.engineMode, mode: this.mode, study_id: this.activeStudyId, voice: this.voice };
  }

  async open_study_copilot(input = {}) {
    await this.loadCorpus();
    const studyId = input.study_id || input.id || this.activeStudyId;
    const clip = input.clip || '15s';
    this.setStudy(studyId);
    const stage = this.openVisualStage({ studyId, clip });
    if (input.section) this.scrollToSection(String(input.section));
    if (input.walkthrough !== false) this.startWalkthrough(studyId).catch(() => {});
    const study = this.studiesById.get(studyId);
    return {
      status: 'copilot_opened',
      study_id: studyId,
      evidence_class: study?.evidence_class || 'unmetered',
      provenance: 'Signed Provenance · Self-Checked',
      stage,
    };
  }
}

export function getOpenIELiveHMI() {
  if (typeof window === 'undefined') return null;
  if (!window.openieLiveHMI) {
    const instance = new OpenIELiveHMI();
    window.openieLiveHMI = instance;
    registerLiveWebMcpTools(instance);
  }
  return window.openieLiveHMI;
}

function registerLiveWebMcpTools(hmi) {
  if (typeof window === 'undefined' || !window.isSecureContext) return;
  const mc = document.modelContext || navigator.modelContext;
  if (!mc || typeof mc.registerTool !== 'function' || window.__openieLiveHmiWebmcpRegistered) return;
  window.__openieLiveHmiWebmcpRegistered = true;

  const tools = [
    {
      name: 'start_live_voice_call',
      title: 'Start OpenIE Studio 24 kHz Voice & Vision Call',
      description: 'Opens a full-duplex 24 kHz studio voice & vision session grounded in the 28 OpenIE studies.',
      inputSchema: {
        type: 'object',
        properties: {
          study_id: { type: 'string' },
          mode: { type: 'string', enum: ['call', 'vision', 'copilot', 'debate'] },
          voice: { type: 'string', enum: ['Aoede', 'Charon', 'Puck', 'Kore', 'Fenrir'] },
          prompt: { type: 'string', maxLength: 400 },
        },
        additionalProperties: false,
      },
      execute: (input) => hmi.start_live_voice_call(input || {}),
    },
    {
      name: 'open_study_copilot',
      title: 'Open Interactive Paper, Video & Figure Co-Pilot',
      description: 'Focuses the Co-Pilot on a study, cues its visual proof stage, and starts a guided walkthrough.',
      inputSchema: {
        type: 'object',
        properties: {
          study_id: { type: 'string' },
          clip: { type: 'string', enum: ['15s', '45s', '90s', '180s', 'tiktok', 'living'] },
          section: { type: 'string', maxLength: 120 },
          walkthrough: { type: 'boolean' },
        },
        additionalProperties: false,
      },
      execute: (input) => hmi.open_study_copilot(input || {}),
    },
  ];

  for (const tool of tools) {
    try {
      Promise.resolve(mc.registerTool(tool)).catch(() => {});
    } catch {}
  }
}

if (typeof window !== 'undefined') {
  getOpenIELiveHMI();
}
