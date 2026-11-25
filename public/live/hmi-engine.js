// OpenIE Research SOTA Multimodal Live Call, Vision & Co-Pilot Engine.
// 100% Sovereign In-Browser Runtime: Zero Paid Cloud APIs.
// - Stage 1 Instant Pickup (<80ms BM25 + DOM Grounded Synthesis + <200ms Turn-1 Speech)
// - Stage 2 Sovereign Neural Upgrade (Kokoro-82M 4-Voice ONNX TTS, Whisper-Tiny.en ONNX STT,
//   SmolVLM / ViT-GPT2 ONNX Vision, Optional WebGPU SmolLM2-360M / Qwen2.5-1.5B LLM)
// - Full-Duplex Voice-Band (300-3400 Hz) Spectral VAD with <100ms True Barge-In
// - 60fps Canvas2D Harmonic Plasma Orb + Live Camera/Screen PiP + Visual Proof Stage Director

const CORPUS_URL = '/live/hmi-corpus.json';
const TTS_BASE = '/rce/spec/';
const TTS_WORKER_URL = '/rce/spec/tts-worker.js';
const ASR_WORKER_URL = '/live/hmi-asr-worker.js';
const VISION_WORKER_URL = '/live/hmi-vision-worker.js';
const TF_CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1';

export const VOICE_PERSONAS = {
  af_heart: {
    id: 'af_heart',
    name: 'Heart',
    role: 'Systems Host',
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
    role: 'Empirical Guide',
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
    .replace(/\b(\d+(?:\.\d+)?)\s*uJ\b/g, '$1 microjoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*mJ\b/g, '$1 millijoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*nJ\b/g, '$1 nanojoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*pJ\b/g, '$1 picojoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*kJ\b/g, '$1 kilojoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*us\b/g, '$1 microseconds')
    .replace(/\b(\d+(?:\.\d+)?)\s*ms\b/g, '$1 milliseconds')
    .replace(/\b(\d+(?:\.\d+)?)x\b/g, '$1 times')
    .replace(/\bpp\b/g, 'percentage points')
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

export class OpenIELiveHMI {
  constructor() {
    this.listeners = new Map();
    this.corpus = null;
    this.studiesById = new Map();
    this.bm25Docs = [];
    this.bm25Idf = new Map();
    this.avgDocLen = 1;
    this.corpusPromise = null;

    // Runtime state
    this.state = 'idle'; // 'idle' | 'listening' | 'thinking' | 'speaking'
    this.mode = 'call'; // 'call' | 'vision' | 'copilot' | 'debate'
    this.callActive = false;
    this.micMuted = false;
    this.activeStudyId = 'communication-avalanche';
    this.voice = 'af_heart';
    this.speed = 1.0;
    this.forceWhisper = false;
    this.llmEnabled = false;

    // Audio & VAD
    this.audioCtx = null;
    this.micStream = null;
    this.micSource = null;
    this.micAnalyser = null;
    this.micFreqBins = null;
    this.micTimeDomain = null;
    this.pcmProcessor = null;
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

    // SpeechRecognition Tier 1
    this.speechRec = null;
    this.speechRecSupported =
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    this.speechInterimText = '';
    this.speechEndpointTimer = null;

    // Workers (Kokoro TTS, Whisper ASR, Vision VLM, Optional WebGPU LLM)
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

    this.llmPipe = null;
    this.llmReady = false;
    this.llmLoading = false;
    this.llmInfo = null;

    // Vision Camera / Screen Share
    this.visionStream = null;
    this.visionSource = null; // 'camera' | 'screen' | null
    this.cameraFacing = 'environment';
    this.visionVideoEls = new Set();
    this.hiddenVisionVideo = null;
    this.offscreenCanvas = null;
    this.prevFrameLuma = null;
    this.lastVisionSnapshot = null;
    this.visionSampleTimer = null;

    // Co-Pilot & Debate state
    this.copilotStep = 0;
    this.debateTurn = 0;
    this.transcript = [];
    this.turnCounter = 0;

    // Canvas2D Plasma Orbs
    this.orbCanvases = new Set();
    this.orbRaf = null;
    this.orbPhase = 0;
    this.syntheticSpeechEnv = 0;

    if (typeof window !== 'undefined') {
      this.activeStudyId = this.detectPageStudyId();
      this._injectSpotlightStyles();
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
        console.warn('[openie-live-hmi] listener error:', err);
      }
    }
  }

  _emitState() {
    this.emit('state', this.getSnapshot());
  }

  _emitTelemetry() {
    this.emit('telemetry', this.getTelemetry());
  }

  getSnapshot() {
    return {
      state: this.state,
      mode: this.mode,
      callActive: this.callActive,
      micMuted: this.micMuted,
      activeStudyId: this.activeStudyId,
      activeStudy: this.studiesById.get(this.activeStudyId) || null,
      voice: this.voice,
      voicePersona: VOICE_PERSONAS[this.voice] || VOICE_PERSONAS.af_heart,
      speed: this.speed,
      visionActive: !!this.visionStream,
      visionSource: this.visionSource,
      cameraFacing: this.cameraFacing,
      forceWhisper: this.forceWhisper,
      llmEnabled: this.llmEnabled,
      kokoroReady: this.kokoroReady,
      whisperReady: this.whisperReady,
      visionModelReady: this.visionModelReady,
      llmReady: this.llmReady,
    };
  }

  getTelemetry() {
    let ttsBackend = 'Instant WebSpeech';
    if (this.kokoroReady && this.kokoroInfo) {
      ttsBackend = `Kokoro-82M (${this.kokoroInfo.device.toUpperCase()} ${this.kokoroInfo.dtype})`;
    } else if (this.kokoroLoading) {
      ttsBackend = 'Instant WebSpeech · Warming Kokoro-82M';
    }

    let sttBackend = this.speechRecSupported ? 'WebSpeech Interim' : 'Whisper-Tiny.en ONNX';
    if (this.forceWhisper || !this.speechRecSupported) {
      sttBackend = this.whisperReady
        ? `Whisper-Tiny.en (${(this.whisperInfo?.device || 'wasm').toUpperCase()} q8)`
        : 'Whisper-Tiny.en ONNX (Standby)';
    }

    let visionBackend = 'Standby';
    if (this.visionStream) {
      visionBackend = this.visionModelReady
        ? `Canvas2D + ${this.visionInfo?.model?.split('/').pop() || 'ONNX VLM'}`
        : 'Canvas2D Telemetry (VLM on demand)';
    }

    return {
      vadDb: Math.round(this.vadDb * 10) / 10,
      noiseFloorDb: Math.round(this.noiseFloorDb * 10) / 10,
      ttfaMs: this.ttfaMs,
      ttsBackend,
      sttBackend,
      visionBackend,
      llmBackend: this.llmReady
        ? `Local LLM (${this.llmInfo?.model || 'SmolLM2-360M'})`
        : this.llmEnabled
        ? 'Warming Local LLM...'
        : 'BM25 + DOM Grounded (<80ms)',
      estJoulesHeuristic: `${this.estJoulesHeuristic.toFixed(3)} est_j (browser heuristic — never summed with measured_j)`,
    };
  }

  _bumpBrowserHeuristic(workUnits = 0.004) {
    this.estJoulesHeuristic += workUnits;
    this._emitTelemetry();
  }

  // ---------- Corpus & BM25 Retrieval ----------
  detectPageStudyId() {
    if (typeof window === 'undefined') return 'communication-avalanche';
    const params = new URLSearchParams(window.location.search);
    const qStudy = params.get('study') || params.get('paper');
    if (qStudy) return qStudy.trim().toLowerCase();

    const p = window.location.pathname.replace(/\/+$/, '');
    const mPaper = p.match(/\/(?:papers|products|about|living)\/([a-z0-9-]+)$/i);
    if (mPaper) {
      const slug = mPaper[1].toLowerCase();
      if (slug === 'ni' || slug === 'mol') return 'gates';
      if (slug === 'fpga-sim') return 'eco-compute';
      return slug;
    }
    return 'communication-avalanche';
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
        for (const s of data.studies || []) {
          this.studiesById.set(s.id, s);
        }
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
        s.skeptic_question,
        s.architect_answer,
      ].join(' ');
      const toks = tokenize(text);
      totalLen += toks.length;
      const tf = new Map();
      for (const tok of toks) {
        tf.set(tok, (tf.get(tok) || 0) + 1);
      }
      for (const tok of tf.keys()) {
        df.set(tok, (df.get(tok) || 0) + 1);
      }
      return { study: s, tf, len: toks.length, rawLower: text.toLowerCase() };
    });

    const N = Math.max(1, studies.length);
    this.avgDocLen = Math.max(1, totalLen / N);
    this.bm25Idf.clear();
    for (const [tok, count] of df.entries()) {
      const idf = Math.log(1 + (N - count + 0.5) / (count + 0.5));
      this.bm25Idf.set(tok, idf);
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
      if (qLower.includes(doc.study.id) || (idPhrase.length > 3 && qLower.includes(idPhrase))) {
        score += 14;
      }
      if (qLower.includes(doc.study.short_title.toLowerCase())) {
        score += 12;
      }
      for (const term of doc.study.key_terms || []) {
        const tl = term.toLowerCase();
        if (tl.length > 3 && qLower.includes(tl)) score += 5;
      }
      for (const tok of qToks) {
        const f = doc.tf.get(tok) || 0;
        if (!f) continue;
        const idf = this.bm25Idf.get(tok) || 0.5;
        const denom = f + k1 * (1 - b + b * (doc.len / this.avgDocLen));
        score += idf * ((f * (k1 + 1)) / denom);
      }
      if (score > 0) scored.push({ study: doc.study, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  // ---------- Active DOM Co-Browsing & Visual Stage Director ----------
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
      .hmi-dom-spotlight {
        border-radius: 8px;
        animation: openieHmiPulse 2.6s ease-out forwards;
        transition: background-color 0.4s ease;
      }
      .hmi-inline-discuss-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin-left: 10px;
        padding: 2px 8px;
        border-radius: 9999px;
        font-family: var(--font-mono, monospace);
        font-size: 10.5px;
        font-weight: 500;
        line-height: 1.4;
        color: #00D4AA;
        background: rgba(0, 212, 170, 0.08);
        border: 1px solid rgba(0, 212, 170, 0.32);
        cursor: pointer;
        opacity: 0.72;
        vertical-align: middle;
        transition: opacity 0.2s, background 0.2s, border-color 0.2s;
      }
      .hmi-inline-discuss-btn:hover,
      .hmi-inline-discuss-btn:focus-visible {
        opacity: 1;
        background: rgba(245, 158, 11, 0.16);
        border-color: #F59E0B;
        color: #F59E0B;
      }
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
      const item = {
        slug,
        tag: h.tagName.toLowerCase(),
        text,
        snippet: snippet.slice(0, 380),
        inView,
      };
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

  // ---------- Audio Graph, Pickup Chime, & Full-Duplex Spectral VAD ----------
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
      } catch {
        // Ignore if called outside gesture
      }
    }
    return this.audioCtx;
  }

  async playPickupChime() {
    const ctx = await this._ensureAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [528, 792]; // Warm harmonic fifth (<220ms)
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.065);
      g.gain.setValueAtTime(0.0001, now + idx * 0.065);
      g.gain.exponentialRampToValueAtTime(0.085, now + idx * 0.065 + 0.02);
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
      this.emit('error', { scope: 'mic', message: 'Browser microphone API unavailable; text and voice output remain active.' });
      return false;
    }
    try {
      const ctx = await this._ensureAudioContext();
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      this.micSource = ctx.createMediaStreamSource(this.micStream);
      this.micAnalyser = ctx.createAnalyser();
      this.micAnalyser.fftSize = 1024;
      this.micAnalyser.smoothingTimeConstant = 0.65;
      this.micFreqBins = new Uint8Array(this.micAnalyser.frequencyBinCount);
      this.micTimeDomain = new Float32Array(this.micAnalyser.fftSize);
      this.micSource.connect(this.micAnalyser);

      // Capture 16 kHz mono utterances for Tier-2 Whisper ONNX STT fallback
      if (ctx.createScriptProcessor) {
        const proc = ctx.createScriptProcessor(4096, 1, 1);
        const silentGain = ctx.createGain();
        silentGain.gain.value = 0;
        proc.onaudioprocess = (ev) => {
          if (!this.callActive || this.micMuted || this.state === 'speaking') return;
          if (!this.forceWhisper && this.speechRecSupported) return;
          const ch = ev.inputBuffer.getChannelData(0);
          if (this.pcmSpeaking) {
            this.pcmChunks.push(downsampleBuffer(ch, ctx.sampleRate, 16000));
          }
        };
        this.micSource.connect(proc);
        proc.connect(silentGain);
        silentGain.connect(ctx.destination);
        this.pcmProcessor = proc;
      }

      if (!this.vadTimer) {
        this.vadTimer = setInterval(() => this._stepVad(), 25);
      }
      return true;
    } catch (err) {
      this.emit('error', {
        scope: 'mic',
        message: 'Microphone permission declined or unavailable — you can still chat by text, chips, Co-Pilot, and Dual-Host Debate.',
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

    // Estimate TTS speaker bleed margin when speaking
    let ttsBleed = 0;
    if (this.state === 'speaking' && this.ttsAnalyser && this.ttsFreqBins) {
      this.ttsAnalyser.getByteFrequencyData(this.ttsFreqBins);
      let s = 0;
      for (let i = 2; i < Math.min(48, this.ttsFreqBins.length); i++) s += this.ttsFreqBins[i] / 255;
      ttsBleed = (s / 46) * 8.5;
    }

    // Update adaptive noise floor when quiet
    if (this.state === 'listening' && db < this.noiseFloorDb + 6) {
      this.noiseFloorDb = this.noiseFloorDb * 0.96 + db * 0.04;
    } else if (db < this.noiseFloorDb) {
      this.noiseFloorDb = db;
    }

    const now = performance.now();
    // True Full-Duplex Barge-In (<100ms abort once ~140ms sustained human voice energy detected)
    if (this.callActive && this.state === 'speaking') {
      const bargeThreshold = Math.max(-33, this.noiseFloorDb + 15 + ttsBleed);
      if (db > bargeThreshold) {
        if (!this.bargeAboveSince) this.bargeAboveSince = now;
        else if (now - this.bargeAboveSince >= 140) {
          this.bargeAboveSince = 0;
          this.bargeIn('vad-voice');
        }
      } else {
        this.bargeAboveSince = 0;
      }
    }

    // Utterance endpointing for Tier-2 Whisper ONNX STT when active
    if (this.callActive && this.state === 'listening' && (this.forceWhisper || !this.speechRecSupported)) {
      const speechThresh = Math.max(-40, this.noiseFloorDb + 10);
      if (db > speechThresh) {
        if (!this.pcmSpeaking) {
          this.pcmSpeaking = true;
          this.pcmSpeechStartAt = now;
          this.pcmChunks = [];
          this.emit('interim', { text: 'Listening (Whisper ONNX)...' });
        }
        this.pcmLastVoiceAt = now;
      } else if (this.pcmSpeaking && now - this.pcmLastVoiceAt >= 680) {
        const durMs = now - this.pcmSpeechStartAt;
        const chunks = this.pcmChunks;
        this.pcmSpeaking = false;
        this.pcmChunks = [];
        if (durMs >= 380 && chunks.length > 0) {
          this._commitWhisperUtterance(chunks);
        } else {
          this.emit('interim', { text: '' });
        }
      }
    }

    this._emitTelemetry();
  }

  _startWebSpeechRecognition() {
    if (!this.speechRecSupported || this.forceWhisper) return;
    if (this.speechRec) return;
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
      const combined = (this.speechInterimText + ' ' + finalChunk).trim();
      if (finalChunk) this.speechInterimText = combined;

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
        }, finalChunk ? 380 : 680);
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
        } catch {
          // Ignore rapid restart race
        }
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
      } catch {
        // Ignore
      }
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
      const text = String(res?.text || '')
        .replace(/\[BLANK_AUDIO\]|\(blank audio\)/gi, '')
        .trim();
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

  // ---------- Sovereign Neural Workers (Kokoro TTS, Whisper STT, Vision VLM, Optional WebGPU LLM) ----------
  _ensureTtsWorker() {
    if (this.ttsWorker) return this.ttsWorker;
    const w = new Worker(TTS_WORKER_URL, { type: 'module' });
    w.onmessage = (e) => {
      const d = e.data || {};
      if (d.type === 'progress') {
        this.emit('engine-progress', { engine: 'kokoro-tts', ...d });
        return;
      }
      const p = this.ttsPending.get(d.id);
      if (!p) return;
      this.ttsPending.delete(d.id);
      if (d.error) p.rej(new Error(d.error));
      else p.res(d);
    };
    this.ttsWorker = w;
    return w;
  }

  _callTtsWorker(payload) {
    const w = this._ensureTtsWorker();
    const id = ++this.ttsReqId;
    return new Promise((res, rej) => {
      this.ttsPending.set(id, { res, rej });
      w.postMessage({
        id,
        base: window.location.origin + TTS_BASE,
        ...payload,
      });
    });
  }

  async warmupKokoro(force) {
    if (this.kokoroReady) return this.kokoroInfo;
    if (this.kokoroLoading) return null;
    this.kokoroLoading = true;
    this._emitTelemetry();
    this.emit('engine-progress', { engine: 'kokoro-tts', status: 'initializing', progress: 5 });
    try {
      const res = await this._callTtsWorker({ text: null, force });
      this.kokoroInfo = res.info;
      this.kokoroReady = true;
      this.kokoroLoading = false;
      this.emit('engine-progress', { engine: 'kokoro-tts', status: 'ready', progress: 100, info: res.info });
      this._emitState();
      this._emitTelemetry();
      return res.info;
    } catch (err) {
      this.kokoroLoading = false;
      this.emit('engine-progress', { engine: 'kokoro-tts', status: 'fallback-webspeech', progress: 0 });
      this._emitTelemetry();
      return null;
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
    if (this.whisperReady) return this.whisperInfo;
    if (this.whisperLoading) return null;
    this.whisperLoading = true;
    this._emitTelemetry();
    try {
      const res = await this._callAsrWorker({ type: 'warmup' });
      this.whisperInfo = res.info;
      this.whisperReady = true;
      this.whisperLoading = false;
      this.emit('engine-progress', { engine: 'whisper-stt', status: 'ready', progress: 100, info: res.info });
      this._emitState();
      this._emitTelemetry();
      return res.info;
    } catch (err) {
      this.whisperLoading = false;
      this.emit('error', { scope: 'whisper-stt', message: String(err) });
      return null;
    }
  }

  _ensureVisionWorker() {
    if (this.visionWorker) return this.visionWorker;
    const w = new Worker(VISION_WORKER_URL, { type: 'module' });
    w.onmessage = (e) => {
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
    this.visionWorker = w;
    return w;
  }

  _callVisionWorker(payload) {
    const w = this._ensureVisionWorker();
    const id = ++this.visionReqId;
    return new Promise((res, rej) => {
      this.visionPending.set(id, { res, rej });
      w.postMessage({ id, ...payload });
    });
  }

  async warmupVision(tier = 'auto') {
    if (this.visionModelLoading) return null;
    this.visionModelLoading = true;
    this._emitTelemetry();
    try {
      const res = await this._callVisionWorker({ type: 'warmup', tier });
      this.visionInfo = res.info;
      this.visionModelReady = true;
      this.visionModelLoading = false;
      this.emit('engine-progress', { engine: 'vision-vlm', status: 'ready', progress: 100, info: res.info });
      this._emitState();
      this._emitTelemetry();
      return res.info;
    } catch (err) {
      this.visionModelLoading = false;
      this.emit('error', { scope: 'vision-vlm', message: String(err) });
      return null;
    }
  }

  async setDeepLlm(enabled) {
    this.llmEnabled = !!enabled;
    this._emitState();
    this._emitTelemetry();
    if (!enabled || this.llmReady || this.llmLoading) return;
    this.llmLoading = true;
    this.emit('engine-progress', { engine: 'webgpu-llm', status: 'loading', progress: 8 });
    try {
      const { pipeline, env } = await import(TF_CDN);
      env.allowLocalModels = false;
      let device = 'wasm';
      if (navigator.gpu) {
        try {
          if (await navigator.gpu.requestAdapter()) device = 'webgpu';
        } catch {
          device = 'wasm';
        }
      }
      const modelId = 'HuggingFaceTB/SmolLM2-360M-Instruct';
      this.llmPipe = await pipeline('text-generation', modelId, {
        device,
        dtype: 'q4',
        progress_callback: (p) => {
          this.emit('engine-progress', {
            engine: 'webgpu-llm',
            status: p?.status || 'loading',
            file: p?.file || '',
            progress: typeof p?.progress === 'number' ? p.progress : null,
          });
        },
      });
      this.llmInfo = { model: 'SmolLM2-360M-Instruct', device };
      this.llmReady = true;
      this.llmLoading = false;
      this.emit('engine-progress', { engine: 'webgpu-llm', status: 'ready', progress: 100, info: this.llmInfo });
      this._emitState();
      this._emitTelemetry();
    } catch (err) {
      this.llmLoading = false;
      this.llmEnabled = false;
      this.emit('error', { scope: 'webgpu-llm', message: `Local LLM unavailable (${String(err)}); grounded <80ms BM25 synthesis stays active.` });
      this._emitState();
      this._emitTelemetry();
    }
  }

  // ---------- Streaming TTS Playback & <100ms Barge-In ----------
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
      } catch {
        // Ignore already stopped
      }
      this.activeBufferSource = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
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

    // Warm up Kokoro in background on first speech without blocking Turn-1 <200ms TTFA!
    if (!this.kokoroReady && !this.kokoroLoading) {
      this.warmupKokoro().catch(() => {});
    }

    this.state = 'speaking';
    this._emitState();

    // Path A: Kokoro-82M Neural ONNX with Sentence i+1 Lookahead Streaming!
    if (this.kokoroReady) {
      const ctx = await this._ensureAudioContext();
      let nextPromise = this._callTtsWorker({
        text: sentences[0],
        voice: chosenVoice,
        speed: chosenSpeed,
      });

      for (let i = 0; i < sentences.length; i++) {
        if (signal?.aborted) return;
        const curReq = nextPromise;
        if (i + 1 < sentences.length) {
          nextPromise = this._callTtsWorker({
            text: sentences[i + 1],
            voice: chosenVoice,
            speed: chosenSpeed,
          });
        }
        let gen;
        try {
          gen = await curReq;
        } catch {
          // Seamless fallback to WebSpeech if worker throws mid-stream
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

    // Path B: Instant <200ms Turn-1 WebSpeech while Kokoro-82M downloads in background!
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
        } catch {
          // Ignore
        }
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
      } catch {
        // Ignore
      }
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
        } catch {
          // Ignore
        }
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
          this.syntheticSpeechEnv = 0.35 + 0.45 * Math.abs(Math.sin(tick * 2.3) * Math.cos(tick * 1.1));
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

  // ---------- Multimodal Camera & Screen Vision ----------
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
        video: {
          facingMode: this.cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      this._activateVisionStream(stream, 'camera');
      return true;
    } catch (err) {
      this.emit('error', { scope: 'vision', message: `Camera access declined or unavailable: ${String(err.message || err)}` });
      return false;
    }
  }

  async flipCamera() {
    const next = this.cameraFacing === 'user' ? 'environment' : 'user';
    return this.startCamera(next);
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
    // Continuous 0.75 fps keyframe telemetry sampler while vision stream is live
    clearInterval(this.visionSampleTimer);
    this.visionSampleTimer = setInterval(() => {
      this.sampleVisionTelemetryOnly();
    }, 1300);

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
    for (const v of this.visionVideoEls) {
      v.srcObject = null;
    }
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

    // Sobel-like gradient edge density for diagram/text/equation detection
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
      let diffPixels = 0;
      for (let i = 0; i < n; i++) {
        if (Math.abs(luma[i] - this.prevFrameLuma[i]) > 18) diffPixels++;
      }
      motionPct = (diffPixels / n) * 100;
    }
    this.prevFrameLuma = luma;

    const sceneType =
      edgeDensity > 0.14 && contrastRms > 42
        ? 'High-edge technical diagram, code, or printed equation sheet'
        : edgeDensity > 0.08
        ? 'Structured UI, chart, or hardware bench view'
        : 'Natural ambient camera scene';

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
    this.lastVisionSnapshot = {
      dataUrl,
      metrics,
      caption: this.lastVisionSnapshot?.caption || '',
      source: this.visionSource,
      ts: Date.now(),
    };
    this._bumpBrowserHeuristic(0.002);
    this.emit('vision-frame', this.lastVisionSnapshot);
    return this.lastVisionSnapshot;
  }

  async analyzeFrameNow(prompt = '') {
    if (!this.visionStream) {
      const ok = await this.startCamera(this.cameraFacing);
      if (!ok) return null;
      await new Promise((r) => setTimeout(r, 380));
    }
    const snap = this.sampleVisionTelemetryOnly();
    if (!snap) {
      return this.ask(prompt || 'Inspect my current page section and visual stage.');
    }

    // Immediate grounded feedback + asynchronous VLM caption
    const m = snap.metrics;
    const dom = this.scanActivePageDom();
    let vlmCaption = '';
    try {
      this.state = 'thinking';
      this._emitState();
      const res = await this._callVisionWorker({
        type: 'analyze',
        dataUrl: snap.dataUrl,
        prompt: prompt || 'Describe any diagrams, text, equations, code, or hardware in this frame.',
      });
      vlmCaption = res?.caption || '';
      snap.caption = vlmCaption;
      this._bumpBrowserHeuristic(0.045);
      this.emit('vision-frame', snap);
    } catch {
      vlmCaption = '';
    }

    const study = this.studiesById.get(this.activeStudyId);
    const sourceLabel = this.visionSource === 'screen' ? 'screen share' : `${this.cameraFacing} camera`;
    const reply =
      `Inspecting your live ${sourceLabel} at ${m.width} by ${m.height}: Canvas2D edge density is ${m.edgeDensityPct}% with RMS contrast ${m.contrastRms}, classifying the frame as ${m.sceneType.toLowerCase()}. ` +
      (vlmCaption ? `In-browser neural vision reads: "${vlmCaption}". ` : '') +
      (dom.visibleSection
        ? `Alongside "${dom.visibleSection.text}" in ${study?.short_title || 'the active study'}, remember its energy tier is ${study?.evidence_class || 'unmetered'} under Signed Provenance · Self-Checked.`
        : `Connected to ${study?.short_title || 'OpenIE Research'} (${study?.evidence_class || 'unmetered'}). Ask any follow-up about what is on screen!`);

    await this._deliverAssistantTurn({
      speakerName: VOICE_PERSONAS[this.voice]?.name || 'Heart',
      speakerRole: `${VOICE_PERSONAS[this.voice]?.role || 'Systems Host'} · Vision`,
      voice: this.voice,
      text: reply,
      study,
      actions: study ? this._defaultActionsForStudy(study) : [],
    });
    return snap;
  }

  // ---------- Grounded Conversational Synthesis + Modes ----------
  _defaultActionsForStudy(study) {
    return [
      { type: 'stage', clip: '15s', studyId: study.id, label: '▶ 15s Visual Proof' },
      { type: 'stage', clip: 'tiktok', studyId: study.id, label: '📱 9:16 Reel' },
      { type: 'stage', clip: 'living', studyId: study.id, label: '🔬 /living/ Sim' },
      { type: 'link', href: study.path, label: '📄 Read Paper' },
    ];
  }

  async startCall(opts = {}) {
    await this.loadCorpus();
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
    const dom = this.scanActivePageDom();
    this.openVisualStage({ studyId: study?.id, clip: '15s' });

    if (this.mode === 'debate') {
      await this.startDebate(this.activeStudyId);
      return;
    }
    if (this.mode === 'copilot') {
      await this.startWalkthrough(this.activeStudyId);
      return;
    }
    if (this.mode === 'vision' && !this.visionStream) {
      await this.startCamera(this.cameraFacing);
    }

    const secHint =
      dom.visibleSection && dom.pathname !== '/live/' && dom.pathname !== '/live'
        ? ` I can see you are reading "${dom.visibleSection.text}".`
        : '';
    const greeting = study
      ? `OpenIE Live connected on ${study.short_title} (${study.evidence_class}).${secHint} Ask me anything, cue a visual proof film, or interrupt me mid-sentence at any time.`
      : `OpenIE Live connected across all 28 post-review studies. Ask me anything or interrupt at any time.`;

    await this._deliverAssistantTurn({
      speakerName: VOICE_PERSONAS[this.voice].name,
      speakerRole: VOICE_PERSONAS[this.voice].role,
      voice: this.voice,
      text: greeting,
      study,
      actions: study ? this._defaultActionsForStudy(study) : [],
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
    if (this.pcmProcessor) {
      try {
        this.pcmProcessor.disconnect();
      } catch {
        // Ignore
      }
      this.pcmProcessor = null;
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

  setSpeed(speed) {
    const n = Number(speed);
    if (Number.isFinite(n) && n >= 0.6 && n <= 1.8) {
      this.speed = n;
      this._emitState();
    }
  }

  setForceWhisper(enabled) {
    this.forceWhisper = !!enabled;
    if (this.forceWhisper) {
      this._stopWebSpeechRecognition();
      this.warmupWhisper().catch(() => {});
    } else if (this.callActive && !this.micMuted) {
      this._startWebSpeechRecognition();
    }
    this._emitState();
    this._emitTelemetry();
  }

  async _deliverAssistantTurn({ speakerName, speakerRole, voice, text, study, actions = [], signal }) {
    const turnItem = {
      id: `turn-${++this.turnCounter}`,
      role: 'assistant',
      speakerName,
      speakerRole,
      voice: voice || this.voice,
      text,
      studyId: study?.id || null,
      receipt: this.makeReceipt(study),
      actions,
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
    await this.loadCorpus();
    const cleanQ = String(queryText || '').trim();
    if (!cleanQ) return null;

    this.bargeIn('silent-reset');
    if (!this.lastTurnCommitAt) this.lastTurnCommitAt = performance.now();

    const userTurn = {
      id: `turn-${++this.turnCounter}`,
      role: 'user',
      speakerName: 'You',
      speakerRole: opts.fromVoice ? 'Live Voice' : 'Studio Prompt',
      text: cleanQ,
      ts: Date.now(),
    };
    this.transcript.push(userTurn);
    this.emit('turn', userTurn);

    this.state = 'thinking';
    this._emitState();
    this._bumpBrowserHeuristic(0.006);

    const qLower = cleanQ.toLowerCase();

    // 1. Direct Camera / Screen inspection intent
    if (/\b(camera|webcam|screen|frame|holding|look at|inspect my)\b/.test(qLower)) {
      if (/\bscreen\b/.test(qLower) && !this.visionStream) {
        await this.startScreenShare();
      }
      return this.analyzeFrameNow(cleanQ);
    }

    // Resolve best matching study via BM25 or fall back to active study
    const hits = this.searchStudies(cleanQ, 3);
    const matchedStudy =
      hits.length && hits[0].score >= 3.2
        ? hits[0].study
        : this.studiesById.get(this.activeStudyId) || this.corpus.studies[0];

    if (matchedStudy && matchedStudy.id !== this.activeStudyId) {
      this.activeStudyId = matchedStudy.id;
      this._emitState();
    }

    // 2. Debate / Skeptical Reviewer intent
    if (/\b(debate|skeptic|skeptical|reviewer|challenge|argue)\b/.test(qLower)) {
      this.mode = 'debate';
      this._emitState();
      return this.startDebate(matchedStudy.id);
    }

    // 3. Guided Walkthrough / Video Co-Pilot intent
    if (/\b(walk me through|walkthrough|tour|step by step|with video)\b/.test(qLower)) {
      this.mode = 'copilot';
      this._emitState();
      return this.startWalkthrough(matchedStudy.id);
    }

    // 4. Cross-study orthogonal evidence-class comparison intent
    if (
      (qLower.includes('measured_j') && qLower.includes('reported_j')) ||
      /\b(28 studies|all studies|evidence class|orthogonal|across the corpus)\b/.test(qLower)
    ) {
      const counts = this.corpus.evidence_class_counts || {
        measured_j: 7,
        reported_j: 10,
        est_j: 1,
        unmetered: 10,
      };
      const crossText =
        `Across all 28 post-review studies in the OpenIE research corpus, energy evidence is partitioned into four strictly orthogonal classes that are never summed or directly ratioed: ` +
        `${counts.measured_j} studies carry physical DC current-shunt anchors in measured_j—specifically AMD Kria KV260 TI INA260 whole-SOM readings at 11.43 nanojoules per cycle in Metered Commit Gates, and NVIDIA Jetson AGX Thor TI INA3221 and INA238 rail shunts in SATB Harness, Downward LUT6 Compilation, 4 KB LUT6 Nucleus, and Communication Tool Avalanche. ` +
        `${counts.reported_j} studies report built-in OS or chip counters in reported_j—such as Apple M5 Max ri_energy_nj and Linux RAPL in Deterministic Null, RCE, RCE-JEPA, and RCE Compile. ` +
        `${counts.est_j} study—Metabolic Intelligence—reports datasheet electro-thermal simulation in est_j with zero physical tags fabricated, and ${counts.unmetered} formal, archival, and economic studies carry unmetered status with joules equal to null.`;
      this.openVisualStage({ studyId: 'satb-harness', clip: '15s' });
      await this._deliverAssistantTurn({
        speakerName: VOICE_PERSONAS[this.voice].name,
        speakerRole: VOICE_PERSONAS[this.voice].role,
        voice: this.voice,
        text: crossText,
        study: this.studiesById.get('satb-harness') || matchedStudy,
        actions: this._defaultActionsForStudy(this.studiesById.get('satb-harness') || matchedStudy),
      });
      return crossText;
    }

    // 5. Active DOM Section / Figure Co-Browsing check
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
    if (matchedDomSec) {
      this.scrollToSection(matchedDomSec.slug);
    }

    // 6. Construct grounded response from post-review study card
    let reply = '';
    let stageClip = '15s';

    if (matchedDomSec && opts.sectionSlug) {
      reply =
        `Focusing on section "${matchedDomSec.text}" in ${matchedStudy.short_title}. ` +
        (matchedDomSec.snippet ? `Here the manuscript establishes: ${matchedDomSec.snippet.slice(0, 240)}. ` : '') +
        `Within the broader post-review audit (${matchedStudy.evidence_class}), remember the key scope boundary: ${matchedStudy.limitations_and_scope.split('.')[0]}.`;
    } else if (/\b(falsifier|limitation|negative|fail|replicate|caveat|scope|honest|collision|bsl|license)\b/.test(qLower)) {
      reply =
        `In ${matchedStudy.short_title} (${matchedStudy.evidence_class}, Signed Provenance · Self-Checked), here are the candid post-review boundaries and negative results: ${matchedStudy.limitations_and_scope}`;
      stageClip = 'living';
    } else if (/\b(method|meter|sensor|shunt|hardware|how was|sample size|baseline|compare)\b/.test(qLower)) {
      reply =
        `For ${matchedStudy.short_title}, the telemetry and methods setup is: ${matchedStudy.methods_and_meter} Regarding baselines: ${matchedStudy.baseline_comparison}`;
      stageClip = '45s';
    } else if (/\b(tiktok|vertical|reel|short)\b/.test(qLower)) {
      reply =
        `Cueing the 9 by 16 vertical edition of ${matchedStudy.short_title}. In plain words: ${(matchedStudy.plain_bullets || []).join(' ')} Key post-review metric: ${matchedStudy.headline_metric}.`;
      stageClip = 'tiktok';
    } else {
      reply =
        `${matchedStudy.short_title} (${matchedStudy.evidence_class}): ${matchedStudy.headline_claim} ` +
        `Crucial post-review scope note: ${matchedStudy.limitations_and_scope.split('.')[0]}.`;
      stageClip = '15s';
    }

    // Optional Stage-2 Local WebGPU LLM refinement (strictly grounded on the retrieved card)
    if (this.llmEnabled && this.llmReady && this.llmPipe) {
      try {
        const sysPrompt =
          `You are the OpenIE Research voice guide. Answer in 3 concise spoken sentences using ONLY these facts for ${matchedStudy.short_title}: ` +
          `Claim: ${matchedStudy.headline_claim} Methods: ${matchedStudy.methods_and_meter} Limits: ${matchedStudy.limitations_and_scope} ` +
          `Never sum across measured_j, reported_j, est_j, or unmetered.`;
        const out = await this.llmPipe(
          [
            { role: 'system', content: sysPrompt },
            { role: 'user', content: cleanQ },
          ],
          { max_new_tokens: 110, do_sample: false }
        );
        const generated = out?.[0]?.generated_text;
        const lastMsg = Array.isArray(generated) ? generated[generated.length - 1]?.content : '';
        if (lastMsg && lastMsg.trim().length > 35) {
          reply = lastMsg.trim();
          this._bumpBrowserHeuristic(0.06);
        }
      } catch {
        // Keep deterministic grounded synthesis on any local WebGPU OOM/error
      }
    }

    this.openVisualStage({ studyId: matchedStudy.id, clip: stageClip });
    await this._deliverAssistantTurn({
      speakerName: VOICE_PERSONAS[this.voice].name,
      speakerRole: VOICE_PERSONAS[this.voice].role,
      voice: this.voice,
      text: reply,
      study: matchedStudy,
      actions: this._defaultActionsForStudy(matchedStudy),
    });
    return reply;
  }

  // ---------- Mode 3: Interactive Paper & Figure Co-Pilot Walkthrough ----------
  async startWalkthrough(studyId) {
    await this.loadCorpus();
    const study = this.studiesById.get(studyId || this.activeStudyId) || this.corpus.studies[0];
    this.activeStudyId = study.id;
    this.mode = 'copilot';
    this.copilotStep = 0;
    this.bargeIn('silent-reset');
    this.lastTurnCommitAt = performance.now();
    this._emitState();

    const ctrl = new AbortController();
    this.turnAbort = ctrl;
    const dom = this.scanActivePageDom();

    const beats = [
      {
        clip: '15s',
        domIdx: 0,
        voice: 'af_bella',
        role: 'Co-Pilot · Beat 1/3 (Plain Summary & Visual Proof)',
        text: `Co-Pilot tour of ${study.short_title}. Cueing the 15-second visual proof film on stage now. In plain words: ${(study.plain_bullets || []).slice(0, 2).join(' ')} Its evidence class is ${study.evidence_class} under Signed Provenance · Self-Checked.`,
      },
      {
        clip: '45s',
        domIdx: 1,
        voice: 'am_adam',
        role: 'Hardware Architect · Beat 2/3 (Methods, Sensors & Baselines)',
        text: `Checking hardware telemetry and baselines: ${study.methods_and_meter} ${study.baseline_comparison}`,
      },
      {
        clip: 'living',
        domIdx: 2,
        voice: 'af_heart',
        role: 'Systems Host · Beat 3/3 (Falsifiers, Scope & Interactive Lab)',
        text: `Opening the interactive living simulator on stage. Before citing any headline metric, note the post-review scope and limitations: ${study.limitations_and_scope} Interrupt or ask any question to explore deeper!`,
      },
    ];

    for (let i = 0; i < beats.length; i++) {
      if (ctrl.signal.aborted) return;
      this.copilotStep = i + 1;
      const b = beats[i];
      this.openVisualStage({ studyId: study.id, clip: b.clip });
      if (dom.sections[b.domIdx] && dom.pathname.includes(study.id)) {
        this.scrollToSection(dom.sections[b.domIdx].slug);
      }
      await this._deliverAssistantTurn({
        speakerName: VOICE_PERSONAS[b.voice].name,
        speakerRole: b.role,
        voice: b.voice,
        text: b.text,
        study,
        actions: this._defaultActionsForStudy(study),
        signal: ctrl.signal,
      });
      if (ctrl.signal.aborted) return;
      await new Promise((r) => setTimeout(r, 420));
    }

    if (!ctrl.signal.aborted) {
      this.state = this.callActive ? 'listening' : 'idle';
      this._emitState();
    }
  }

  // ---------- Mode 4: Dual-Host Live Debate (af_heart vs bm_george) ----------
  async startDebate(studyId) {
    await this.loadCorpus();
    const study = this.studiesById.get(studyId || this.activeStudyId) || this.corpus.studies[0];
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
        clip: 'living',
        text: study.skeptic_followup,
      },
      {
        voice: 'af_heart',
        speakerName: 'Heart',
        speakerRole: 'Systems Lead · Closing Scope Receipt',
        clip: 'living',
        text: `${study.architect_rebuttal} You can jump in by voice or text right now to challenge either of us!`,
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
        actions: this._defaultActionsForStudy(study),
        signal: ctrl.signal,
      });
      if (ctrl.signal.aborted) return;
      await new Promise((res) => setTimeout(res, 320));
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

      // Sample audio spectrum amplitude [0..1]
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

      for (const canvas of this.orbCanvases) {
        this._drawOrb(canvas, amp);
      }
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

    // Color palette by active state & mode
    let primary = '0, 212, 170'; // Brand cyan (Listening / Ready)
    let secondary = '245, 158, 11'; // Brand amber
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

    // Outer ambient corona
    const outerR = baseR * (1.45 + amp * 0.42);
    const halo = ctx.createRadialGradient(cx, cy, baseR * 0.25, cx, cy, outerR);
    halo.addColorStop(0, `rgba(${primary}, ${0.34 + amp * 0.28})`);
    halo.addColorStop(0.55, `rgba(${secondary}, ${0.12 + amp * 0.16})`);
    halo.addColorStop(1, 'rgba(10, 10, 15, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    // 3 Harmonic Fourier Plasma Rings
    for (let ring = 0; ring < 3; ring++) {
      ctx.beginPath();
      const pts = 72;
      const rScale = baseR * (0.86 + ring * 0.13 + amp * 0.18);
      for (let i = 0; i <= pts; i++) {
        const theta = (i / pts) * Math.PI * 2;
        const w1 = Math.sin(theta * (3 + ring) + this.orbPhase * (1.4 + ring * 0.4));
        const w2 = Math.cos(theta * (5 - ring) - this.orbPhase * 1.9);
        const deform = 1 + amp * 0.22 * (0.6 * w1 + 0.4 * w2);
        const r = rScale * deform;
        const x = cx + Math.cos(theta) * r;
        const y = cy + Math.sin(theta) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle =
        ring === 0
          ? `rgba(${primary}, ${0.82})`
          : ring === 1
          ? `rgba(${secondary}, ${0.55})`
          : `rgba(255, 255, 255, ${0.22 + amp * 0.25})`;
      ctx.lineWidth = ring === 0 ? 2.2 : 1.3;
      ctx.stroke();
    }

    // Inner luminous core
    const coreR = baseR * (0.68 + amp * 0.14);
    const coreGrad = ctx.createRadialGradient(
      cx - coreR * 0.22,
      cy - coreR * 0.22,
      coreR * 0.08,
      cx,
      cy,
      coreR
    );
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)');
    coreGrad.addColorStop(0.38, `rgba(${primary}, 0.78)`);
    coreGrad.addColorStop(1, `rgba(15, 20, 25, 0.92)`);
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fill();

    // Vision Active Reticle Ring
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

  // ---------- WebMCP & Programmatic Agent Tools ----------
  async start_live_voice_call(input = {}) {
    await this.loadCorpus();
    const studyId = input.study_id || input.id || this.activeStudyId;
    const mode = input.mode || 'call';
    const voice = input.voice || this.voice;
    await this.startCall({ studyId, mode, voice });
    if (input.prompt) {
      await this.ask(String(input.prompt));
    }
    return {
      status: 'active',
      mode: this.mode,
      study_id: this.activeStudyId,
      voice: this.voice,
      telemetry: this.getTelemetry(),
    };
  }

  async open_study_copilot(input = {}) {
    await this.loadCorpus();
    const studyId = input.study_id || input.id || this.activeStudyId;
    const clip = input.clip || '15s';
    this.setStudy(studyId);
    const stage = this.openVisualStage({ studyId, clip });
    if (input.section) {
      this.scrollToSection(String(input.section));
    }
    if (input.walkthrough !== false) {
      this.startWalkthrough(studyId).catch(() => {});
    }
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

// Create global singleton & register WebMCP tools
export function getOpenIELiveHMI() {
  if (typeof window === 'undefined') return null;
  if (!window.openieLiveHMI) {
    const instance = new OpenIELiveHMI();
    window.openieLiveHMI = instance;
    if (window.openieResearchCatalog?.endpoints) {
      window.openieResearchCatalog.endpoints.research_live = 'https://research.openie.dev/live/';
      window.openieResearchCatalog.endpoints.hmi_corpus_json = 'https://research.openie.dev/live/hmi-corpus.json';
    }
    registerLiveWebMcpTools(instance);
  }
  return window.openieLiveHMI;
}

function registerLiveWebMcpTools(hmi) {
  if (typeof window === 'undefined' || !window.isSecureContext) return;
  const mc = document.modelContext || navigator.modelContext;
  if (!mc || typeof mc.registerTool !== 'function') return;
  if (window.__openieLiveHmiWebmcpRegistered) return;
  window.__openieLiveHmiWebmcpRegistered = true;

  const tools = [
    {
      name: 'start_live_voice_call',
      title: 'Start OpenIE Multimodal Live Voice & Vision Call',
      description:
        'Opens a sovereign in-browser full-duplex voice/vision session grounded on all 28 post-review OpenIE studies (Kokoro-82M neural voices, <100ms barge-in, optional prompt or debate/copilot mode).',
      inputSchema: {
        type: 'object',
        properties: {
          study_id: { type: 'string', description: 'Optional study slug (e.g. "deterministic-null", "rce-compile", "gates").' },
          mode: { type: 'string', enum: ['call', 'vision', 'copilot', 'debate'], description: 'Interaction mode.' },
          voice: { type: 'string', enum: ['af_heart', 'bm_george', 'af_bella', 'am_adam'], description: 'Kokoro-82M voice persona.' },
          prompt: { type: 'string', maxLength: 400, description: 'Optional initial question to ask immediately.' },
        },
        additionalProperties: false,
      },
      execute: (input) => hmi.start_live_voice_call(input || {}),
    },
    {
      name: 'open_study_copilot',
      title: 'Open Interactive Paper, Video & Figure Co-Pilot',
      description:
        'Focuses the OpenIE Live Co-Pilot on a specific study, cues its 15s/45s/TikTok/Living visual proof stage, optionally highlights a DOM section, and starts a guided walkthrough.',
      inputSchema: {
        type: 'object',
        properties: {
          study_id: { type: 'string', description: 'Target study id across the 28 OpenIE studies.' },
          clip: { type: 'string', enum: ['15s', '45s', '90s', 'tiktok', 'living'], description: 'Visual stage asset to open.' },
          section: { type: 'string', maxLength: 120, description: 'Optional heading slug or phrase to scroll & highlight.' },
          walkthrough: { type: 'boolean', description: 'Whether to start narrated 3-beat walkthrough (default true).' },
        },
        additionalProperties: false,
      },
      execute: (input) => hmi.open_study_copilot(input || {}),
    },
  ];

  for (const tool of tools) {
    try {
      Promise.resolve(mc.registerTool(tool)).catch(() => {});
    } catch {
      // Ignore WebMCP registration errors on unsupported browsers
    }
  }
}

if (typeof window !== 'undefined') {
  getOpenIELiveHMI();
}
