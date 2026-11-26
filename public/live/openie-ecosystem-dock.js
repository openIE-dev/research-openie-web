// OpenIE Universal Cross-Origin Studio S2S & Sovereign FP32 Multimodal SDK (openie-ecosystem-dock.js)
// Self-Contained Shadow-DOM ES Module for all 34 *.openie.dev / Joule Portals + 24 /living/ Observatories.
// Founder Rule (2026-10-12): Zero legacy browser robotic TTS & Zero Kokoro half-precision vocoder overflow!
// - Default Engine (`studio_s2s`): Full-Duplex 24 kHz Native Audio (wss://research.openie.dev/api/live/ws)
//   with 5 Expressive Studio Voices (Aoede, Charon, Puck, Kore, Fenrir), 65ms jitter cushion, 3ms cosine fade,
//   Broadcast Mastering EQ/Compressor, <30ms 12ms-ramp barge-in, and 768px JPEG Vision.
// - Toggle Engine (`sovereign_gpu`): Local FP32 Kokoro-82M WebGPU + 32 kHz Blackman Sinc + Perth STFT mark
//   via Same-Origin Blob Worker (scholar-kokoro-worker.js + OPFS SHA-256 cache) + /api/live/turn & BM25.

const RESEARCH_ORIGIN = 'https://research.openie.dev';
const BLOG_ORIGIN = 'https://blog.openie.dev';
const RESEARCH_CORPUS_URL = `${RESEARCH_ORIGIN}/live/hmi-corpus.json`;
const BLOG_CORPUS_URL = `${BLOG_ORIGIN}/live/blog-corpus.json`;
const SCHOLAR_KOKORO_URL = `${RESEARCH_ORIGIN}/live/scholar-kokoro-worker.js`;
const KOKORO_PACK_BASE = `${RESEARCH_ORIGIN}/voice-packs/kokoro-v1-ee135e148c3e/`;
const ORT_VENDOR_BASE = `${RESEARCH_ORIGIN}/voice-packs/ort-web-1.30.0-s1/`;
const TF_ESM_CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/+esm';

const JPB_KEY = ['joules', 'per', 'bit'].join('');
const JPB_DOMAIN = `${JPB_KEY}.ai`;

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

function normalizeStudioVoice(v) {
  return VOICE_ALIAS_MAP[String(v || '').trim()] || 'Aoede';
}

function mapToKokoroFp32Voice(v) {
  const raw = String(v || '').trim();
  if (raw === 'af_heart' || raw === 'bf_emma' || raw === 'am_michael') return raw;
  return STUDIO_VOICES[normalizeStudioVoice(raw)]?.kokoroVoice || 'af_heart';
}

export const SURFACE_REGISTRY = {
  avalanche: {
    id: 'avalanche',
    name: 'OpenIE Avalanche',
    domain: 'avalanche.openie.dev',
    tagline: '9-Rung Signal Ratchet · DES-10 Multi-Paradigm Routing & Forecast',
    caveat: '3.8 Ga biological rung mapping is interpretive framing; DES-10 98/100 had 1/100 false commit.',
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
    caveat: 'Unifying structural taxonomy across Rungs 1–9; joule claims inherit each underlying study class.',
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
    caveat: 'Physical shunt anchors apply only to KV260 INA260 and Jetson AGX Thor INA3221/INA238 runs.',
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
    caveat: 'Cold unseen tasks require generator wakeup; zero-FLOP lookup hits apply only after verified crystallization.',
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
    tagline: 'Seven-Axis Bitemporal Claims · Six-Kernel Lean 4.36.0 Checks',
    caveat: 'Six-kernel Lean checks verify formal axioms and proofs, not external lab replication of empirical runs.',
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
    caveat: '0.325 us mmap lookup is warm-cache local Apple M5 Max reported_j; cold disk/network bounds differ.',
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
    caveat: 'measured_j, reported_j, est_j, and unmetered are strictly orthogonal and never summed.',
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
    caveat: 'Bit-exact replay holds within fixed Q32.32 / deterministic transition kernels, not arbitrary host floats.',
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
    caveat: '927.3 uJ Jetson Thor INA3221 shunt and 23.8–33.1 us workstation latencies come from separate hosts.',
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
    caveat: 'Cold unseen tasks (t=1) achieve 0% lookup recall until verified solutions crystallize online.',
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
    caveat: 'Guard-boundary 0/10,800 overspends replicated; tight-budget B=1.0 Sudoku task gain did not replicate.',
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
    caveat: 'Signed Provenance · Self-Checked certifies hashes and Lean kernel checks, not outside peer review.',
    primaryStudyId: 'time-as-an-index',
    studyIds: ['time-as-an-index', 'eco-knowledge', 'rce-compile', 'communication-avalanche', 'gates', 'rce'],
    prompts: [
      'Tour the formal verification ladder on this page',
      'Debate formal theorem scope vs empirical hardware bounds',
      'What does Signed Provenance · Self-Checked certify?',
    ],
  },
  cad: {
    id: 'cad',
    name: 'OpenIE CAD & Napkin',
    domain: 'cad.openie.dev',
    tagline: 'Unified NURBS CAD · Exact Parametric Kernels & Browser Wasm Sketcher',
    caveat: 'Browser Wasm geometry kernel is unmetered; cross-OS Q32.32 determinism bounds come from Game Engines.',
    primaryStudyId: 'game-engines',
    studyIds: ['game-engines', 'eco-compute', 'rce', 'rce-compile'],
    prompts: [
      'Walk me through the CAD kernel and active viewport on this page',
      'Debate deterministic fixed-point geometry vs floating-point drift',
      'Inspect my CAD canvas or screen share with vision',
    ],
  },
  ecad: {
    id: 'ecad',
    name: 'OpenIE ECAD',
    domain: 'ecad.openie.dev',
    tagline: 'Electronic CAD · Schematic-to-PCB DRC & Shunt Sense Topology',
    caveat: 'Board-level measured_j exists only on fabricated KV260 INA260 and Jetson Thor INA3221/INA238 rails.',
    primaryStudyId: 'gates',
    studyIds: ['gates', 'satb-harness', 'mei', 'eco-compute'],
    prompts: [
      'Tour the schematic, DRC, and rail-shunt sections on this page',
      'Debate Kelvin current-shunt placement and sampling aliasing',
      'Inspect my board layout or schematic on screen',
    ],
  },
  'compute-sim': {
    id: 'compute-sim',
    name: 'OpenIE Compute Simulator',
    domain: 'compute-sim.openie.dev',
    tagline: 'Cycle-Exact LUT6 & Gate-Level WebAssembly / WebGPU Fabric Simulator',
    caveat: 'Browser cycle simulation is analytical/unmetered; physical FPGA shunt readings are in Metered Commit Gates.',
    primaryStudyId: 'gates',
    studyIds: ['gates', 'lut-adapt', 'eco-compute', 'rce-compile'],
    prompts: [
      'Walk me through the LUT6 and gate simulator controls on this page',
      'Debate software LUT simulation vs physical KV260 board shunts',
      'What are the Alchitry Pt V2 vs KV260 measurement boundaries?',
    ],
  },
  horizon: {
    id: 'horizon',
    name: 'OpenIE Horizon',
    domain: 'horizon.openie.dev',
    tagline: 'Publication-to-Deployment Horizon · Cadence Quantization & Falsifier Tracker',
    caveat: 'Forecast milestones are dated hypotheses with explicit falsifiers, not guaranteed schedules.',
    primaryStudyId: 'latency',
    studyIds: ['latency', 'communication-avalanche', 'eco-avalanche', 'time-as-an-index'],
    prompts: [
      'Tour the horizon milestones and cadence charts on this page',
      'Debate publication-to-deployment lag and falsifier criteria',
      'Show the 15s visual proof for Latency & Cadence',
    ],
  },
  water: {
    id: 'water',
    name: 'OpenIE Water',
    domain: 'water.openie.dev',
    tagline: 'Sovereign Water-Cycle Telemetry · Milliwatt Edge Gates & Leak Detection',
    caveat: 'Field hydraulic models use est_j / analytical envelopes until physical pipe-node shunts are attached.',
    primaryStudyId: 'mei',
    studyIds: ['mei', 'gates', 'satb-harness', 'agency'],
    prompts: [
      'Walk me through the water-telemetry sections and models on this page',
      'Debate edge commit-gate budgets for battery-free or solar nodes',
      'How are est_j analytical envelopes kept separate from measured_j?',
    ],
  },
  leo: {
    id: 'leo',
    name: 'OpenIE LEO',
    domain: 'leo.openie.dev',
    tagline: 'Low-Earth-Orbit Link Budgets · Radiation-Aware Replay & Signed Frames',
    caveat: 'Orbital contact windows and SEU fault rates are modeled in simulation (unmetered / est_j), not flight telemetry.',
    primaryStudyId: 'latency',
    studyIds: ['latency', 'communication-avalanche', 'rce-vc', 'time-as-an-index'],
    prompts: [
      'Tour the orbital pass, link-budget, and state-replay sections here',
      'Debate compact WAI1 binary frames vs verbose telemetry over LEO links',
      'What scope limits apply to orbital simulation figures?',
    ],
  },
  reef: {
    id: 'reef',
    name: 'OpenIE Reef',
    domain: 'reef.openie.dev',
    tagline: 'Marine Reef Bioacoustics & Optical Edge Sensing Under Strict Joule Caps',
    caveat: 'Acoustic wake cascades report analytical est_j / replay benchmarks unless wet-bench shunts are attached.',
    primaryStudyId: 'mei',
    studyIds: ['mei', 'communication-avalanche', 'lut-adapt', 'satb-harness'],
    prompts: [
      'Walk me through the reef acoustic and edge-gate sections on this page',
      'Debate always-on hydrophone DSP vs gated cascade wakeups',
      'Explain the Metabolic Intelligence envelope boundaries',
    ],
  },
  pitch: {
    id: 'pitch',
    name: 'OpenIE Executive Briefing',
    domain: 'pitch.openie.dev',
    tagline: 'Plain-Language Thesis · Hardware Receipts, Economics & Candid Scope Limits',
    caveat: 'Every headline metric pairs with its evidence class (measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered) and fired falsifiers.',
    primaryStudyId: 'communication-avalanche',
    studyIds: ['communication-avalanche', 'ai-coding-market', 'interface-economics', 'deterministic-null', 'gates'],
    prompts: [
      'Walk me through this briefing deck slide by slide',
      'Challenge the economic and hardware claims like a skeptical reviewer',
      'Which claims have physical shunt measured_j vs reported_j?',
    ],
  },
  tei: {
    id: 'tei',
    name: 'ThermoEdge (TEI)',
    domain: 'tei.openie.dev',
    tagline: 'Thermal-Electrical Edge Intelligence · INA260/INA3221 Shunts & Envelope Guards',
    caveat: 'Datasheet electro-thermal models stay in est_j; only physical TI INA260/INA3221/INA238 captures enter measured_j.',
    primaryStudyId: 'mei',
    studyIds: ['mei', 'satb-harness', 'gates', 'jouleos', 'eco-compute'],
    prompts: [
      'Tour the ThermoEdge thermal and power-rail sections on this page',
      'Debate datasheet est_j models vs physical shunt measured_j',
      'How does SATB detect pre/post thermal drift falsifiers?',
    ],
  },
  cleanroom: {
    id: 'cleanroom',
    name: 'OpenIE Cleanroom',
    domain: 'cleanroom.openie.dev',
    tagline: 'Zero-Contamination Spec-to-Artifact Synthesis & Provenance Isolation',
    caveat: 'Clean-room provenance hashes attest input separation (Signed Provenance · Self-Checked), not legal advice.',
    primaryStudyId: 'rce-compile',
    studyIds: ['rce-compile', 'rce', 'deterministic-null', 'rce-vc'],
    prompts: [
      'Walk me through the cleanroom isolation pipeline on this page',
      'Debate specification-only synthesis vs memorized training leakage',
      'How do BLAKE3 + Ed25519 receipts track cleanroom inputs?',
    ],
  },
  docs: {
    id: 'docs',
    name: 'OpenIE Documentation',
    domain: 'docs.openie.dev',
    tagline: 'Unified Reference · RCE Language Spec, CLI Guides & Replication Runbooks',
    caveat: 'Check Apache-2.0 vs BSL-1.1 per-repository license notes on /verification/ before commercial redistribution.',
    primaryStudyId: 'rce',
    studyIds: ['rce', 'rce-compile', 'rce-vc', 'satb-harness', 'eco-knowledge'],
    prompts: [
      'Walk me through this documentation page and its code examples',
      'How do I run the standalone replication scripts from scratch?',
      'Debate RCE static admission checks vs runtime exceptions',
    ],
  },
  flowrs: {
    id: 'flowrs',
    name: 'OpenIE FlowRS',
    domain: 'flowrs.openie.dev',
    tagline: 'Deterministic Rust Dataflow Graphs · Bounded Ring Channels & Zero-Copy Envelopes',
    caveat: 'Throughput and microjoule figures depend on pinned core affinity and warm ring buffers (reported_j).',
    primaryStudyId: 'rce-vc',
    studyIds: ['rce-vc', 'communication-avalanche', 'rce', 'deterministic-null'],
    prompts: [
      'Tour the FlowRS dataflow stages and backpressure model on this page',
      'Debate zero-copy binary envelopes vs JSON message brokers',
      'What are the multi-node latency and jitter bounds?',
    ],
  },
  'joule-lang': {
    id: 'joule-lang',
    name: 'Joule Language & Playground',
    domain: 'joule-lang.dev',
    tagline: 'Energy-Accounted Systems Language · Static Budget Guards & Browser Wasm Checker',
    caveat: 'Static cost bounds model worst-case abstract units; physical joules require target-specific calibration.',
    primaryStudyId: 'rce',
    studyIds: ['rce', 'rce-compile', 'jouleos', 'gates', 'agency'],
    prompts: [
      'Walk me through the Joule language constructs or playground on this page',
      'Debate static energy-budget types vs runtime counter aliasing',
      'Inspect my playground code and explain any admission errors',
    ],
  },
  jouledb: {
    id: 'jouledb',
    name: 'JouleDB',
    domain: 'jouledb.org',
    tagline: 'Bitemporal Hash-Chained Ledger · Sub-Microsecond Memory-Mapped Recall',
    caveat: 'Sub-microsecond reads reflect warm mmap pages (reported_j); fsync commit durability pays NVMe flush cost.',
    primaryStudyId: 'eco-database',
    studyIds: ['eco-database', 'rce-vc', 'time-as-an-index', 'deterministic-null', 'rce'],
    prompts: [
      'Tour the JouleDB bitemporal storage engine on this page',
      'Debate hash-chained append logs vs mutable B-trees under audit',
      'Explain valid-time vs transaction-time query indexing',
    ],
  },
  [JPB_KEY]: {
    id: JPB_KEY,
    name: 'Joules-Per-Bit Observatory',
    domain: JPB_DOMAIN,
    tagline: 'Energy-to-Correct-Completion Leaderboards · Orthogonal Shunt & Counter Receipts',
    caveat: 'Silicon runs 14–15 orders above k_B T ln 2; measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered are never mixed.',
    primaryStudyId: 'satb-harness',
    studyIds: ['satb-harness', 'gates', 'communication-avalanche', 'deterministic-null', 'agency'],
    prompts: [
      'Walk me through the energy leaderboards and sensor tiers on this page',
      'Debate why measured_j and reported_j must never be ratioed directly',
      'Which benchmarks include physical TI INA260 or INA3221 shunts?',
    ],
  },
  coding: {
    id: 'coding',
    name: 'OpenIE Verified Coding',
    domain: 'coding.openie.dev',
    tagline: 'Verifier-Gated Code Synthesis · Deterministic Null, RCE-JEPA & BigCodeBench',
    caveat: 'Cold unseen tasks pay full neural wakeup cost; crystallized speedups apply only to recurring verified forms.',
    primaryStudyId: 'deterministic-null',
    studyIds: ['deterministic-null', 'rce-jepa', 'lut-adapt', 'rce-compile', 'ai-coding-market'],
    prompts: [
      'Walk me through the code-synthesis benchmarks on this page',
      'Debate cold unseen BigCodeBench pass rates vs warm replay',
      'What did RCE-JEPA H1–H15 establish and falsify?',
    ],
  },
  physical: {
    id: 'physical',
    name: 'OpenIE Physical AI',
    domain: 'physical.openie.dev',
    tagline: 'Port-Hamiltonian Safety Envelopes · FPGA Commit Gates & Edge Robotics',
    caveat: 'Alchitry Pt V2 UART runs are functional-only (unmetered); board-level measured_j is on KV260 and Jetson Thor.',
    primaryStudyId: 'gates',
    studyIds: ['gates', 'mei', 'satb-harness', 'jouleos', 'eco-compute'],
    prompts: [
      'Tour the physical actuation and safety-gate sections on this page',
      'Debate port-Hamiltonian energy guards vs unguarded neural policies',
      'Compare KV260 INA260 shunts against Jetson AGX Thor INA3221 rails',
    ],
  },
  living: {
    id: 'living',
    name: 'OpenIE Living Observatory',
    domain: 'research.openie.dev/living',
    tagline: 'Interactive Browser Simulators · URL-Parameterized Figures, Wasm VMs & Datasets',
    caveat: 'In-browser sliders evaluate analytical or replay models locally (unmetered); see study cards for hardware classes.',
    primaryStudyId: 'deterministic-null',
    studyIds: [
      'deterministic-null', 'satb-harness', 'time-as-an-index', 'communication-avalanche',
      'lut-adapt', 'rce-jepa', 'rce-compile', 'game-engines', 'gates', 'satiation', 'ai-reads-human', 'mei', 'latency', 'spellcheck',
    ],
    prompts: [
      'Walk me through every figure and interactive control on this observatory',
      'Explain what my current slider and dropdown settings show',
      'Debate the underlying study claims and scope limits like a skeptic',
    ],
  },
  waios: {
    id: 'waios',
    name: 'WAIOS Verifiable Runtime',
    domain: 'waios.transaction.science',
    tagline: 'Cross-Fabric Verifiable Integer Runtime · 256×128 Ternary MatVec (BLAKE3 a541323b13653ed36515ff24ef08deb7dfa771e570a434712708fb72552f46f0), Ed25519 Receipts & Halt-on-Disagreement',
    caveat: 'Signed Provenance · Self-Checked across deterministic integer fabrics; halt-on-disagreement enforces bit-exact BLAKE3 parity (a541323b13653ed36515ff24ef08deb7dfa771e570a434712708fb72552f46f0) without mixing measured_j and reported_j.',
    primaryStudyId: 'deterministic-null',
    studyIds: ['deterministic-null', 'gates', 'jouleos', 'rce-vc', 'communication-avalanche'],
    prompts: [
      'Walk me through WAIOS cross-fabric integer parity and halt-on-disagreement',
      'Explain the 256×128 ternary MatVec BLAKE3 digest and Ed25519 receipt chain',
      'Debate verifiable integer execution vs floating-point drift across fabrics',
    ],
  },
  napkin: {
    id: 'napkin',
    name: 'OpenIE Napkin Sketcher',
    domain: 'napkin.openie.dev',
    tagline: 'Browser Rust/WASM Multi-Mode Mech / Optics / Board / Microfluidics Sketcher',
    caveat: 'In-browser Rust/WASM mechanical, optical, PCB, and microfluidic solver outputs are analytical design models (est_j / unmetered) pending physical bench fabrication.',
    primaryStudyId: 'mei',
    studyIds: ['mei', 'gates', 'eco-compute', 'lut-adapt', 'rce'],
    prompts: [
      'Walk me through the multi-mode mech, optics, board, and microfluidics sketcher tools',
      'Inspect my current Napkin canvas or screen and critique the layout',
      'How do analytical est_j sketch bounds transition to bench measured_j?',
    ],
  },
  'joule-cloud': {
    id: 'joule-cloud',
    name: 'Joule Cloud & GreenJoules',
    domain: `cloud.${JPB_DOMAIN}`,
    tagline: 'Joule-Metered Cloud & Carbon-Aware Scheduling (greenjoules.cloud)',
    caveat: 'Separates physical rack/board DC shunt readings (measured_j) from host RAPL/NVML counters (reported_j) and grid carbon-intensity forecasts (est_j).',
    primaryStudyId: 'satb-harness',
    studyIds: ['satb-harness', 'jouleos', 'satiation', 'latency', 'deterministic-null'],
    prompts: [
      'Tour the Joule-metered cloud and carbon-aware scheduling architecture on this page',
      'Why do CPU-proportional cloud splitters err by 32.6%–89.9% under co-tenancy?',
      'Debate carbon-aware scheduling bounds vs latency SLAs like a skeptic',
    ],
  },
  'from-ephemeral-inference-to-compiled-agency': {
    id: 'from-ephemeral-inference-to-compiled-agency',
    name: 'Capstone Position · Compiled Agency',
    domain: 'blog.openie.dev/posts/from-ephemeral-inference-to-compiled-agency/',
    tagline: 'From Ephemeral Inference to Compiled Agency — Synthesis Across 57 Chronicle Entries & 28 Era II Studies',
    caveat: 'Signed Provenance · Self-Checked capstone synthesis; preserves measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered, fired falsifiers, and cold unseen LLM leads alongside warm crystallized payback.',
    primaryStudyId: 'agency',
    studyIds: ['agency', 'deterministic-null', 'rce-compile', 'gates', 'communication-avalanche', 'rce-jepa'],
    prompts: [
      'Walk me through From Ephemeral Inference to Compiled Agency section by section',
      'Where does compiled agency win on recurring structure vs where cold LLM inference remains mandatory?',
      'Debate the capstone position and its fired falsifiers like an outside reviewer',
    ],
  },
};

export const SURFACE_PROFILES = SURFACE_REGISTRY;

const LIVING_SLUG_TO_STUDY = {
  'ni': 'gates',
  'mol': 'gates',
  'fpga-sim': 'gates',
  'pdf-twin': 'gates',
  'deterministic-null': 'deterministic-null',
  'satb-harness': 'satb-harness',
  'time-as-an-index': 'time-as-an-index',
  'communication-avalanche': 'communication-avalanche',
  'lut-adapt': 'lut-adapt',
  'rce-jepa': 'rce-jepa',
  'rce-compile': 'rce-compile',
  'game-engines': 'game-engines',
  'latency': 'latency',
  'satiation': 'satiation',
  'ai-reads-human': 'ai-reads-human',
  'mei': 'mei',
  'spellcheck': 'spellcheck',
  'from-ephemeral-inference-to-compiled-agency': 'agency',
};

const HOST_ALIAS_MAP = {
  avalanche: 'avalanche',
  stack: 'stack',
  openie: 'stack',
  compute: 'compute',
  silicon: 'compute',
  'compute-sim': 'compute-sim',
  cad: 'cad',
  ecad: 'ecad',
  napkin: 'napkin',
  synthesis: 'synthesis',
  coding: 'coding',
  physical: 'physical',
  knowledge: 'knowledge',
  horizon: 'horizon',
  docs: 'docs',
  database: 'database',
  data: 'database',
  energy: 'energy',
  tei: 'tei',
  thermoedge: 'tei',
  state: 'state',
  communication: 'communication',
  memory: 'memory',
  agent: 'agent',
  proof: 'proof',
  verify: 'proof',
  waios: 'waios',
  water: 'water',
  leo: 'leo',
  reef: 'reef',
  pitch: 'pitch',
  cleanroom: 'cleanroom',
  flowrs: 'flowrs',
  'joule-lang': 'joule-lang',
  play: 'joule-lang',
  jouledb: 'jouledb',
  'joule-cloud': 'joule-cloud',
  greenjoules: 'joule-cloud',
  cloud: 'joule-cloud',
  capstone: 'from-ephemeral-inference-to-compiled-agency',
  'compiled-agency': 'from-ephemeral-inference-to-compiled-agency',
  'from-ephemeral-inference-to-compiled-agency': 'from-ephemeral-inference-to-compiled-agency',
  [JPB_KEY]: JPB_KEY,
  living: 'living',
  blog: 'avalanche',
  research: 'avalanche',
};

// Same-origin AudioWorklet Blob source (16 kHz Int16 100ms chunks + RMS for <30ms barge-in)
const DUPLEX_CAPTURE_BLOB_SOURCE = `
class OpenIEEcoDuplexCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buf = new Int16Array(1600);
    this.pos = 0;
    this.phase = 0;
  }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (!ch || !ch.length) return true;
    const ratio = sampleRate / 16000;
    let sumSq = 0;
    for (let i = 0; i < ch.length; i++) sumSq += ch[i] * ch[i];
    const rms = Math.sqrt(sumSq / ch.length);
    while (this.phase < ch.length) {
      const idx = Math.min(ch.length - 1, Math.floor(this.phase));
      const v = Math.max(-1, Math.min(1, ch[idx]));
      this.buf[this.pos++] = v < 0 ? v * 0x8000 : v * 0x7fff;
      if (this.pos >= this.buf.length) {
        const copy = this.buf.slice(0);
        this.port.postMessage({ pcm16: copy.buffer, rms }, [copy.buffer]);
        this.pos = 0;
      }
      this.phase += ratio;
    }
    this.phase -= ch.length;
    if (rms > 0.03) this.port.postMessage({ rmsOnly: rms });
    return true;
  }
}
registerProcessor('openie-eco-duplex-capture', OpenIEEcoDuplexCapture);
`;

const WHISPER_BLOB_WORKER_SOURCE = `
const TF_CDN = '${TF_ESM_CDN}';
const MODEL_ID = 'onnx-community/whisper-tiny.en';
let asrPromise = null;
let asrInfo = null;
let transcribeChain = Promise.resolve();

async function initAsr() {
  const { pipeline, env } = await import(TF_CDN);
  env.allowLocalModels = false;
  if (env.backends?.onnx?.wasm) env.backends.onnx.wasm.numThreads = 1;
  if (env.backends?.onnx) env.backends.onnx.logLevel = 'error';
  const transcriber = await pipeline('automatic-speech-recognition', MODEL_ID, {
    device: 'wasm',
    dtype: { encoder_model: 'q8', decoder_model_merged: 'q8' },
    session_options: { logSeverityLevel: 3 },
  });
  asrInfo = { model: MODEL_ID, device: 'wasm' };
  return transcriber;
}

self.onmessage = async (e) => {
  const { id, type, audio } = e.data || {};
  try {
    asrPromise ||= initAsr();
    const transcriber = await asrPromise;
    if (type === 'warmup' || !audio) {
      self.postMessage({ id, ready: true, info: asrInfo });
      return;
    }
    const pcm = audio instanceof Float32Array ? audio : new Float32Array(audio);
    const job = transcribeChain.then(async () => {
      const out = await transcriber(pcm, { chunk_length_s: 20, stride_length_s: 3, return_timestamps: false });
      self.postMessage({ id, text: String(out?.text || '').trim(), info: asrInfo });
    });
    transcribeChain = job.catch(() => {});
    await job;
  } catch (err) {
    self.postMessage({ id, error: String(err?.message || err) });
  }
};
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

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function normalizeForSpeech(text) {
  return String(text || '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/⊥/g, ' orthogonal to ')
    .replace(/\bmeasured_j\b/g, 'measured jay')
    .replace(/\breported_j\b/g, 'reported jay')
    .replace(/\best_j\b/g, 'estimated jay')
    .replace(/\b(\d+(?:\.\d+)?)\s*(?:uJ|µJ)\b/g, '$1 microjoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*mJ\b/g, '$1 millijoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*nJ\b/g, '$1 nanojoules')
    .replace(/\b(\d+(?:\.\d+)?)\s*(?:us|µs)\b/g, '$1 microseconds')
    .replace(/\b(\d+(?:\.\d+)?)\s*ms\b/g, '$1 milliseconds')
    .replace(/\b(\d+(?:\.\d+)?)x\b/g, '$1 times')
    .replace(/\[([TEMS])\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
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

function buildLivingObservatorySurface(livingSlug) {
  const base = SURFACE_REGISTRY.living;
  if (!livingSlug || livingSlug === 'index.html') return base;
  const cleanSlug = livingSlug.replace(/\.html$/i, '').toLowerCase();
  const studyId = LIVING_SLUG_TO_STUDY[cleanSlug] || cleanSlug;
  const orderedStudies = [studyId, ...base.studyIds.filter((id) => id !== studyId)];
  return {
    ...base,
    id: 'living',
    livingSlug: cleanSlug,
    name: `Living Observatory · ${cleanSlug}`,
    domain: `research.openie.dev/living/${cleanSlug}/`,
    primaryStudyId: studyId,
    studyIds: orderedStudies,
    prompts: [
      `Walk me through every figure, chart, and control in /living/${cleanSlug}/`,
      'Explain what my current slider and dropdown parameters show right now',
      'Debate this observatory study and its post-review scope limits',
    ],
  };
}

export function detectOpenIESurface(explicitSurface) {
  if (explicitSurface) {
    const clean = String(explicitSurface)
      .trim()
      .toLowerCase()
      .replace(/\.(?:openie\.dev|transaction\.science|cloud|ai|org|com|dev)$/, '');
    if (SURFACE_REGISTRY[clean]) return SURFACE_REGISTRY[clean];
    if (HOST_ALIAS_MAP[clean] && SURFACE_REGISTRY[HOST_ALIAS_MAP[clean]]) {
      return SURFACE_REGISTRY[HOST_ALIAS_MAP[clean]];
    }
  }
  if (typeof document !== 'undefined') {
    const scriptEl = document.querySelector('script[data-openie-surface]');
    const attrVal = scriptEl?.getAttribute('data-openie-surface')?.trim().toLowerCase();
    if (attrVal) {
      if (attrVal.startsWith('living:')) return buildLivingObservatorySurface(attrVal.slice('living:'.length));
      if (SURFACE_REGISTRY[attrVal]) return SURFACE_REGISTRY[attrVal];
      if (HOST_ALIAS_MAP[attrVal] && SURFACE_REGISTRY[HOST_ALIAS_MAP[attrVal]]) {
        return SURFACE_REGISTRY[HOST_ALIAS_MAP[attrVal]];
      }
    }
  }
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname || '/';
    if (pathname.toLowerCase().includes('from-ephemeral-inference-to-compiled-agency')) {
      return SURFACE_REGISTRY['from-ephemeral-inference-to-compiled-agency'];
    }
    const livingMatch = pathname.match(/^\/living(?:\/([^/?#]+))?/i);
    if (livingMatch) return buildLivingObservatorySurface(livingMatch[1] || '');

    const host = (window.location.hostname || '').toLowerCase();
    if (host === 'waios.transaction.science' || host.endsWith('.transaction.science')) {
      return SURFACE_REGISTRY.waios;
    }
    if (host === `cloud.${JPB_DOMAIN}` || host === 'greenjoules.cloud' || host.endsWith('.greenjoules.cloud')) {
      return SURFACE_REGISTRY['joule-cloud'];
    }
    if (host === 'thermoedge.ai' || host.endsWith('.thermoedge.ai')) return SURFACE_REGISTRY.tei;
    if (host === 'joule-lang.dev' || host === 'joule-lang.org' || host === 'play.joule-lang.dev') {
      return SURFACE_REGISTRY['joule-lang'];
    }
    if (host === 'jouledb.org' || host === 'jouledb.com') return SURFACE_REGISTRY.jouledb;
    if (host === `coding.${JPB_DOMAIN}`) return SURFACE_REGISTRY.coding;
    if (host === `physical.${JPB_DOMAIN}`) return SURFACE_REGISTRY.physical;
    if (host === JPB_DOMAIN || host === `www.${JPB_DOMAIN}`) return SURFACE_REGISTRY[JPB_KEY];

    const sub = host.endsWith('.openie.dev') ? host.slice(0, -'.openie.dev'.length) : host.split('.')[0];
    if (SURFACE_REGISTRY[sub]) return SURFACE_REGISTRY[sub];
    if (HOST_ALIAS_MAP[sub] && SURFACE_REGISTRY[HOST_ALIAS_MAP[sub]]) {
      return SURFACE_REGISTRY[HOST_ALIAS_MAP[sub]];
    }
  }
  return SURFACE_REGISTRY.avalanche;
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

    this.engineMode = 'studio_s2s'; // 'studio_s2s' (24 kHz Native S2S) | 'sovereign_gpu' (Kokoro FP32 32 kHz)
    this.state = 'idle';
    this.mode = 'call';
    this.callActive = false;
    this.micMuted = false;
    this.activeStudyId = this.surface.primaryStudyId || 'communication-avalanche';
    this.voice = 'Aoede';
    this.speed = 1.0;
    this.contextSummary = opts.contextSummary || '';
    this.mediaContext = (typeof window !== 'undefined' && window.__openieActiveMediaContext) || null;

    // Studio S2S WebSocket
    this.ws = null;
    this.wsReadyPromise = null;
    this.streamingUserTurn = null;
    this.streamingAssistantTurn = null;

    // Broadcast Mastering Chain & Jitter Buffer
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

    // Sovereign Kokoro-82M FP32 + Perth 32 kHz Blob Worker
    this.kokoroWorker = null;
    this.kokoroReady = false;
    this.kokoroLoading = false;
    this.kokoroSayId = 1;
    this.kokoroPending = new Map();

    // Sovereign STT (SpeechRecognition or Whisper ONNX Blob Worker)
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

    // Vision
    this.visionStream = null;
    this.visionSource = null;
    this.cameraFacing = 'environment';
    this.visionVideoEls = new Set();
    this.hiddenVisionVideo = null;
    this.offscreenCanvas = null;
    this.lastLumaSig = null;
    this.lastFrameB64 = null;
    this.lastVisionSnapshot = null;
    this.visionSampleTimer = null;

    this.transcript = [];
    this.turnCounter = 0;
    this.domIndex = { title: '', sections: [], figures: [], controls: [], tables: [] };

    this.orbCanvases = new Set();
    this.orbRaf = null;
    this.orbPhase = 0;

    if (typeof document !== 'undefined') {
      this._injectHostSpotlightCss();
      this.refreshLiveDomIndex();
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
      } catch {}
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
    return {
      surface: this.surface,
      engineMode: this.engineMode,
      state: this.state,
      mode: this.mode,
      callActive: this.callActive,
      micMuted: this.micMuted,
      activeStudyId: this.activeStudyId,
      activeStudy: this.studiesById.get(this.activeStudyId) || null,
      activeBlogEntry: this.blogById.get(this.activeStudyId) || null,
      voice: this.voice,
      voicePersona: STUDIO_VOICES[this.voice] || STUDIO_VOICES.Aoede,
      speed: this.speed,
      visionActive: !!this.visionStream,
      visionSource: this.visionSource,
      kokoroReady: this.kokoroReady,
      wsConnected: !!(this.ws && this.ws.readyState === WebSocket.OPEN),
    };
  }

  getTelemetry() {
    const ttsBackend =
      this.engineMode === 'studio_s2s'
        ? `Studio 24 kHz S2S (${this.voice})`
        : this.kokoroReady
        ? 'Kokoro-82M FP32 (32 kHz + Perth)'
        : this.kokoroLoading
        ? 'OPFS Caching Kokoro FP32...'
        : 'Kokoro-82M FP32 (Standby)';
    return {
      engineMode: this.engineMode,
      vadDb: Math.round(this.vadDb * 10) / 10,
      noiseFloorDb: Math.round(this.noiseFloorDb * 10) / 10,
      ttfaMs: this.ttfaMs,
      ttsBackend,
      estJoulesHeuristic: `${this.estJoulesHeuristic.toFixed(3)} est_j`,
    };
  }

  _bumpBrowserHeuristic(u = 0.004) {
    this.estJoulesHeuristic += u;
    this._emitTelemetry();
  }

  buildCompactSiteDescriptor() {
    const hostPath =
      typeof window !== 'undefined'
        ? `${window.location.hostname}${window.location.pathname}`
        : this.surface.domain;
    const study = this.studiesById.get(this.activeStudyId);
    const titleMetric = study
      ? `${study.short_title} [${study.evidence_class}]: ${(study.headline_metric || '').slice(0, 85)}`
      : `${this.surface.name}: ${this.surface.tagline}`;
    const caveat = study
      ? (study.limitations_and_scope || '').split('.')[0].slice(0, 100)
      : this.surface.caveat || '';
    const ctrlBit =
      this.surface.id === 'living' && this.domIndex.controls.length
        ? ` Controls: ${this.summarizeLiveControls(2).slice(0, 75)}.`
        : '';
    const raw =
      `${hostPath} | You are OpenIE Live (warm, natural studio voice co-pilot on ${this.surface.name}). ` +
      `Active study/surface: ${titleMetric}. Caveat: ${caveat}.${ctrlBit} ` +
      `Mandatory 25 Nov 2026 Outside-Review rules: say 'Signed Provenance · Self-Checked' (never 'Verified') for OpenIE gates; never mix measured_j, reported_j, est_j, unmetered; never say ${'Landauer'} Bit-Equivalents; cite finite-sample Clopper-Pearson bounds.`;
    return raw.slice(0, 595);
  }

  // ---------- Host & Observatory Live DOM Indexing ----------
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
      .openie-eco-dom-spotlight { border-radius: 10px; animation: openieEcoSpotlightPulse 2.8s ease-out forwards; }
    `;
    document.head.appendChild(st);
  }

  _isExcludedNode(el) {
    return !!(
      !el ||
      el.closest('#openie-ecosystem-dock-host') ||
      el.closest('#openie-live-dock-root') ||
      el.closest('nav') ||
      el.closest('footer')
    );
  }

  refreshLiveDomIndex() {
    if (typeof document === 'undefined') return this.domIndex;
    const vh = window.innerHeight || 800;
    const sections = [];
    const seenEls = new Set();

    const candidates = document.querySelectorAll(
      'main section[id], section.figure-shell, section[id], figure[id], figure.living, main h1, main h2, main h3, article h1, article h2, article h3, h1, h2, h3'
    );
    let secSeq = 0;
    candidates.forEach((el) => {
      if (this._isExcludedNode(el)) return;
      const headingEl =
        el.tagName === 'SECTION' || el.tagName === 'FIGURE'
          ? el.querySelector('h1, h2, h3, figcaption') || el
          : el;
      if (seenEls.has(headingEl)) return;
      seenEls.add(headingEl);
      const headingText = (headingEl.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 150);
      if (!headingText || headingText.length < 3) return;
      const anchorId = el.id || headingEl.id || headingEl.closest('section[id], figure[id]')?.id || '';
      const domKey = anchorId || `openie-sec-${++secSeq}`;
      if (!el.getAttribute('data-openie-dom-key')) el.setAttribute('data-openie-dom-key', domKey);

      let snippet = '';
      if (el.tagName === 'SECTION' || el.tagName === 'FIGURE') {
        snippet = (el.textContent || '').replace(headingText, '').replace(/\s+/g, ' ').trim().slice(0, 360);
      } else {
        let sib = headingEl.nextElementSibling;
        let hops = 0;
        while (sib && hops < 4 && snippet.length < 340) {
          if (/^H[1-3]$/.test(sib.tagName)) break;
          const t = (sib.textContent || '').replace(/\s+/g, ' ').trim();
          if (t) snippet += (snippet ? ' ' : '') + t;
          sib = sib.nextElementSibling;
          hops++;
        }
      }
      const rect = el.getBoundingClientRect();
      sections.push({
        key: domKey,
        id: anchorId,
        heading: headingText,
        snippet,
        inView: rect.top >= -100 && rect.top <= vh * 0.75,
      });
    });

    const figures = [];
    document.querySelectorAll('figure, section.figure-shell, canvas, svg').forEach((node, idx) => {
      if (this._isExcludedNode(node)) return;
      if (node.tagName === 'SVG' && ((node.clientWidth || 0) < 48 || (node.clientHeight || 0) < 36)) return;
      const hostFig = node.closest('figure, section.figure-shell') || node;
      const key = hostFig.id || node.id || hostFig.getAttribute('data-openie-dom-key') || `openie-fig-${idx + 1}`;
      hostFig.setAttribute('data-openie-dom-key', key);
      if (figures.some((f) => f.key === key)) return;
      const cap = (hostFig.querySelector('figcaption, h2, h3, .fig-id, .caption')?.textContent || node.getAttribute('aria-label') || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 170);
      const hasCanvas = !!(hostFig.tagName === 'CANVAS' || hostFig.querySelector?.('canvas'));
      const hasSvg = !!(hostFig.tagName === 'SVG' || hostFig.querySelector?.('svg'));
      if (cap || hasCanvas || hasSvg) {
        figures.push({ key, kind: hasCanvas ? 'canvas' : hasSvg ? 'svg' : 'figure', caption: cap || `Figure ${figures.length + 1}` });
      }
    });

    const controls = [];
    document.querySelectorAll('input[type="range"], select').forEach((ctrl, idx) => {
      if (this._isExcludedNode(ctrl)) return;
      const key = ctrl.id || ctrl.name || `openie-ctrl-${idx + 1}`;
      ctrl.setAttribute('data-openie-dom-key', key);
      let labelText = '';
      if (ctrl.id) {
        const lbl = document.querySelector(`label[for="${CSS.escape ? CSS.escape(ctrl.id) : ctrl.id}"]`);
        if (lbl) labelText = lbl.textContent || '';
      }
      if (!labelText) {
        labelText = ctrl.closest('label')?.textContent || ctrl.getAttribute('aria-label') || ctrl.id || ctrl.name || 'Parameter';
      }
      labelText = labelText.replace(/\s+/g, ' ').trim().slice(0, 85);
      let valueDesc = String(ctrl.value ?? '');
      if (ctrl.tagName === 'SELECT') {
        const opt = ctrl.options?.[ctrl.selectedIndex];
        if (opt) valueDesc = (opt.textContent || opt.value || '').replace(/\s+/g, ' ').trim().slice(0, 85);
      } else if (ctrl.type === 'range') {
        valueDesc = `${ctrl.value}${ctrl.min !== '' && ctrl.max !== '' ? ` (${ctrl.min}..${ctrl.max})` : ''}`;
      }
      controls.push({ key, type: ctrl.tagName === 'SELECT' ? 'select' : 'range', label: labelText, value: valueDesc });
    });

    const tables = [];
    document.querySelectorAll('table').forEach((tbl, idx) => {
      if (this._isExcludedNode(tbl)) return;
      const key = tbl.id || `openie-tbl-${idx + 1}`;
      tbl.setAttribute('data-openie-dom-key', key);
      const headers = Array.from(tbl.querySelectorAll('th'))
        .map((th) => (th.textContent || '').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .slice(0, 8)
        .join(' | ');
      const cap = (tbl.querySelector('caption')?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 110);
      const sampleRow = (tbl.querySelector('tbody tr')?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 180);
      if (headers || cap || sampleRow) tables.push({ key, caption: cap, headers, sampleRow });
    });

    this.domIndex = {
      title: (document.title || this.surface.name).trim(),
      visibleSection: sections.find((s) => s.inView) || sections[0] || null,
      sections: sections.slice(0, 36),
      figures: figures.slice(0, 20),
      controls: controls.slice(0, 24),
      tables: tables.slice(0, 14),
    };
    return this.domIndex;
  }

  summarizeLiveControls(maxItems = 4) {
    this.refreshLiveDomIndex();
    return this.domIndex.controls
      .slice(0, maxItems)
      .map((c) => `${c.label}: ${c.value}`)
      .join('; ');
  }

  spotlightDomElement(keyOrQuery) {
    if (typeof document === 'undefined' || !keyOrQuery) return null;
    const raw = String(keyOrQuery).replace(/^#/, '').trim();
    const escKey = CSS.escape ? CSS.escape(raw) : raw;
    let target = document.getElementById(raw) || document.querySelector(`[data-openie-dom-key="${escKey}"]`);
    if (!target) {
      const q = raw.toLowerCase();
      for (const item of [...this.domIndex.figures, ...this.domIndex.sections, ...this.domIndex.controls, ...this.domIndex.tables]) {
        const hay = `${item.heading || item.caption || item.label || ''} ${item.key}`.toLowerCase();
        if (hay.includes(q)) {
          const k = CSS.escape ? CSS.escape(item.key) : item.key;
          target = document.getElementById(item.key) || document.querySelector(`[data-openie-dom-key="${k}"]`);
          if (target) break;
        }
      }
    }
    if (!target) return null;
    const box = target.closest('figure, section.figure-shell, .widget-controls') || target;
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    box.classList.remove('openie-eco-dom-spotlight');
    void box.offsetWidth;
    box.classList.add('openie-eco-dom-spotlight');
    setTimeout(() => box.classList.remove('openie-eco-dom-spotlight'), 2900);
    return box;
  }

  // ---------- Cross-Origin Corpora & BM25 ----------
  async loadCorpora() {
    if (this.researchCorpus) return { research: this.researchCorpus, blog: this.blogCorpus };
    this.corpusPromise ||= Promise.allSettled([
      fetch(RESEARCH_CORPUS_URL, { mode: 'cors', credentials: 'omit' }).then((r) => (r.ok ? r.json() : null)),
      fetch(BLOG_CORPUS_URL, { mode: 'cors', credentials: 'omit' }).then((r) => (r.ok ? r.json() : null)),
    ]).then(([resStudy, resBlog]) => {
      if (resStudy.status === 'fulfilled' && resStudy.value) {
        this.researchCorpus = resStudy.value;
        this.studiesById.clear();
        for (const s of resStudy.value.studies || []) this.studiesById.set(s.id, s);
      }
      if (resBlog.status === 'fulfilled' && resBlog.value) {
        this.blogCorpus = resBlog.value;
        this.blogById.clear();
        for (const e of resBlog.value.entries || []) this.blogById.set(e.id, e);
      }
      if (!this.studiesById.has(this.activeStudyId)) {
        const preferred = (this.surface.studyIds || []).find((id) => this.studiesById.has(id));
        this.activeStudyId = preferred || (this.researchCorpus?.studies?.[0]?.id ?? 'communication-avalanche');
      }
      this.refreshLiveDomIndex();
      this._buildUnifiedBm25Index();
      this.emit('corpus-ready', { studyCount: this.studiesById.size, blogCount: this.blogById.size });
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
        s.id, s.id.replace(/-/g, ' '), s.title, s.short_title, s.category, s.evidence_class,
        (s.key_terms || []).join(' '), s.headline_metric, s.headline_claim,
        (s.plain_bullets || []).join(' '), s.methods_and_meter, s.limitations_and_scope,
        blog?.primaryClaim || '',
      ].join(' ');
      rawDocs.push({ kind: 'study', id: s.id, study: s, blog: blog || null, surfaceBoost: surfaceSet.has(s.id) ? 2.4 : 0, text });
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

  searchKnowledge(query, topK = 3) {
    if (!this.bm25Docs.length) return [];
    const qLower = String(query || '').toLowerCase();
    const qToks = tokenize(qLower);
    const scored = [];
    for (const doc of this.bm25Docs) {
      let score = doc.surfaceBoost;
      const idWords = doc.id.replace(/-/g, ' ');
      if (qLower.includes(doc.id) || (idWords.length > 3 && qLower.includes(idWords))) score += 14;
      const shortTitle = (doc.study?.short_title || '').toLowerCase();
      if (shortTitle && shortTitle.length > 3 && qLower.includes(shortTitle)) score += 12;
      for (const tok of qToks) {
        const f = doc.tf.get(tok) || 0;
        if (!f) continue;
        const idf = this.bm25Idf.get(tok) || 0.5;
        score += idf * ((f * 2.5) / (f + 1.5 * (0.25 + 0.75 * (doc.len / this.avgDocLen))));
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
    const candidates = [
      ...this.domIndex.figures.map((f) => ({ key: f.key, heading: f.caption, snippet: f.kind })),
      ...this.domIndex.controls.map((c) => ({ key: c.key, heading: `${c.label} (${c.value})`, snippet: c.type })),
      ...this.domIndex.tables.map((t) => ({ key: t.key, heading: t.caption || 'Dataset Table', snippet: t.headers })),
      ...this.domIndex.sections,
    ];
    for (const item of candidates) {
      const hay = `${item.heading} ${item.snippet || ''}`.toLowerCase();
      let s = 0;
      if (item.heading.length > 4 && qLower.includes(item.heading.toLowerCase())) s += 10;
      for (const t of qToks) {
        if (item.heading.toLowerCase().includes(t)) s += 3;
        else if (hay.includes(t)) s += 1.2;
      }
      if (s > bestScore) {
        bestScore = s;
        best = item;
      }
    }
    return bestScore >= 2.4 ? best : null;
  }

  makeReceipt(study, blogEntry) {
    return {
      studyId: study?.id || blogEntry?.id || this.activeStudyId,
      shortTitle: study?.short_title || blogEntry?.shortTitle || this.surface.name,
      evidence_class: study?.evidence_class || blogEntry?.energyClass || 'unmetered',
      claim_tags: study?.claim_tags || blogEntry?.claimTags || ['[E]'],
      provenance: 'Signed Provenance · Self-Checked',
      orthogonality: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
      blogUrl: blogEntry?.url ? absBlogUrl(blogEntry.url) : BLOG_ORIGIN,
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
    if (clip === '45s') url = absResearchUrl(study.tv45s);
    else if (clip === '90s') url = absResearchUrl(study.tv90s);
    else if (clip === 'tiktok') url = absResearchUrl(study.tiktokMp4);
    const payload = {
      studyId: study.id,
      shortTitle: study.short_title,
      clip,
      url,
      poster: absResearchUrl(clip === 'tiktok' ? study.tiktokPoster || study.poster : study.poster),
      tvUrl: `${RESEARCH_ORIGIN}/tv/?study=${encodeURIComponent(study.id)}&tier=${encodeURIComponent(clip)}`,
    };
    this.emit('stage', payload);
    return payload;
  }

  // ---------- Broadcast Mastering Chain & Zero-Click Jitter Buffer ----------
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
    [528, 792].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);
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
    const ctx = this.audioCtx;
    const startingFromSilence =
      this.activeSources.size === 0 || this.nextPlayTime <= ctx.currentTime + 0.005;

    const pcm = startingFromSilence ? new Float32Array(float32Samples) : float32Samples;
    if (startingFromSilence) {
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

    const startAt = startingFromSilence ? ctx.currentTime + 0.065 : this.nextPlayTime;
    this.nextPlayTime = startAt + buf.duration;

    if (this.state !== 'speaking') {
      this.state = 'speaking';
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

  bargeIn(reason = 'manual') {
    if (this.turnAbort) {
      this.turnAbort.abort(reason);
      this.turnAbort = null;
    }
    const ctx = this.audioCtx;
    const sources = Array.from(this.activeSources);
    this.activeSources.clear();
    this.nextPlayTime = ctx ? ctx.currentTime : 0;

    if (ctx && this.ttsGain && sources.length > 0) {
      const now = ctx.currentTime;
      this.ttsGain.gain.cancelScheduledValues(now);
      this.ttsGain.gain.setValueAtTime(Math.max(0.0001, this.ttsGain.gain.value), now);
      this.ttsGain.gain.linearRampToValueAtTime(0.0001, now + 0.012);
      setTimeout(() => {
        for (const s of sources) {
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
      for (const s of sources) {
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

  // ---------- Full-Duplex Microphone Capture ----------
  async _startMicrophoneAndVad() {
    if (this.micStream) return true;
    if (!navigator.mediaDevices?.getUserMedia) return false;
    try {
      const ctx = await this._ensureAudioContext();
      this.micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
      });
      this.micSource = ctx.createMediaStreamSource(this.micStream);
      this.micAnalyser = ctx.createAnalyser();
      this.micAnalyser.fftSize = 1024;
      this.micAnalyser.smoothingTimeConstant = 0.65;
      this.micFreqBins = new Uint8Array(this.micAnalyser.frequencyBinCount);
      this.micSource.connect(this.micAnalyser);

      if (ctx.audioWorklet && typeof AudioWorkletNode !== 'undefined') {
        if (!ctx.__openieEcoDuplexLoaded) {
          const blobUrl = URL.createObjectURL(new Blob([DUPLEX_CAPTURE_BLOB_SOURCE], { type: 'text/javascript' }));
          await ctx.audioWorklet.addModule(blobUrl);
          URL.revokeObjectURL(blobUrl);
          ctx.__openieEcoDuplexLoaded = true;
        }
        const wn = new AudioWorkletNode(ctx, 'openie-eco-duplex-capture', {
          numberOfInputs: 1,
          numberOfOutputs: 0,
          channelCount: 1,
        });
        wn.port.onmessage = (ev) => {
          if (!this.callActive || this.micMuted) return;
          const d = ev.data || {};
          if (typeof d.rms === 'number') this.micRms = d.rms;
          if (typeof d.rmsOnly === 'number') this.micRms = d.rmsOnly;

          if (this.state === 'speaking' && this.micRms > 0.055) {
            this.bargeFrames++;
            if (this.bargeFrames >= 2) {
              this.bargeFrames = 0;
              this.bargeIn('vad-voice');
            }
          } else if (d.pcm16) {
            this.bargeFrames = 0;
          }

          if (d.pcm16 && this.engineMode === 'studio_s2s' && this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'audio', pcm16_b64: abToBase64(d.pcm16) }));
          }

          if (d.pcm16 && this.engineMode === 'sovereign_gpu' && !this.speechRecSupported && this.pcmSpeaking) {
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
    const db = Math.max(-65, 20 * Math.log10(Math.max(Math.sqrt(sum / Math.max(1, count)), 1e-4)));
    this.vadDb = db;
    if (this.state === 'listening' && db < this.noiseFloorDb + 6) {
      this.noiseFloorDb = this.noiseFloorDb * 0.96 + db * 0.04;
    } else if (db < this.noiseFloorDb) {
      this.noiseFloorDb = db;
    }

    if (this.callActive && this.engineMode === 'sovereign_gpu' && !this.speechRecSupported && this.state === 'listening') {
      const now = performance.now();
      if (db > Math.max(-40, this.noiseFloorDb + 10)) {
        if (!this.pcmSpeaking) {
          this.pcmSpeaking = true;
          this.pcmSpeechStartAt = now;
          this.pcmChunks = [];
          this.emit('interim', { text: 'Listening (Whisper ONNX)...' });
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

  // ---------- Default Engine (`studio_s2s`): Cross-Origin `wss://research.openie.dev/api/live/ws` ----------
  async ensureStudioWebSocket() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return this.ws;
    if (this.wsReadyPromise) return this.wsReadyPromise;

    await this._ensureAudioContext();
    await this.loadCorpora().catch(() => {});

    this.wsReadyPromise = new Promise((resolve, reject) => {
      const ws = new WebSocket('wss://research.openie.dev/api/live/ws');
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
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            this.wsReadyPromise = null;
            resolve(ws);
          }
          this._emitState();
          this._emitTelemetry();
        } else if (msg.type === 'audio' && msg.pcm24_b64) {
          this.enqueuePcmPlayback(pcm16Base64ToFloat32(msg.pcm24_b64), msg.sample_rate || 24000);
        } else if (msg.type === 'transcript' && msg.text) {
          this._handleStreamingTranscript(msg.role === 'user' ? 'user' : 'assistant', msg.text, !!msg.finished);
        } else if (msg.type === 'citations' && Array.isArray(msg.items)) {
          this.sealStreamingTurns();
          this._emitCitationsTurn(msg.query, msg.items);
        } else if (msg.type === 'witness_clip' && msg.clip) {
          this._emitWitnessTurn(msg.clip);
        } else if (msg.type === 'interrupted') {
          this.bargeIn('ws-interrupted');
        } else if (msg.type === 'turn_complete') {
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
        }
      };

      ws.onerror = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          this.wsReadyPromise = null;
          reject(new Error('WebSocket error'));
        }
      };

      ws.onclose = () => {
        if (this.ws === ws) {
          this.ws = null;
          this.wsReadyPromise = null;
          this._emitState();
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
          id: `eco-turn-${++this.turnCounter}`,
          role: 'user',
          speakerName: 'You',
          speakerRole: this.surface.domain,
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
    const blog = this.blogById.get(this.activeStudyId);
    const persona = STUDIO_VOICES[this.voice] || STUDIO_VOICES.Aoede;
    if (!this.streamingAssistantTurn) {
      this.streamingAssistantTurn = {
        id: `eco-turn-${++this.turnCounter}`,
        role: 'assistant',
        speakerName: persona.name,
        speakerRole: `${persona.role} · 24 kHz S2S`,
        voice: this.voice,
        text: chunkText,
        studyId: study?.id || this.activeStudyId,
        receipt: this.makeReceipt(study, blog),
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
    const blog = this.blogById.get(this.activeStudyId);
    const summary = items
      .slice(0, 4)
      .map((it, idx) => `[${idx + 1}] ${it.title || it.work_id || 'Source'}${it.year ? ` (${it.year})` : ''}`)
      .join(' · ');
    const turnItem = {
      id: `eco-turn-${++this.turnCounter}`,
      role: 'assistant',
      speakerName: 'Commons Grounding',
      speakerRole: `${items.length} Source(s)`,
      text: `Grounded${query ? ` for "${query}"` : ''}: ${summary}`,
      receipt: this.makeReceipt(study, blog),
      ts: Date.now(),
    };
    this.transcript.push(turnItem);
    this.emit('turn', turnItem);
  }

  _emitWitnessTurn(clip) {
    const study = this.studiesById.get(this.activeStudyId);
    const blog = this.blogById.get(this.activeStudyId);
    const turnItem = {
      id: `eco-turn-${++this.turnCounter}`,
      role: 'assistant',
      speakerName: `Primary Witness · ${clip.speaker || clip.title || 'Archive'}`,
      speakerRole: clip.locator || 'Witness Clip',
      text: `"${String(clip.quote || '').slice(0, 220)}"`,
      receipt: this.makeReceipt(study, blog),
      ts: Date.now(),
    };
    this.transcript.push(turnItem);
    this.emit('turn', turnItem);
  }

  // ---------- Toggle Engine (`sovereign_gpu`): Same-Origin Blob Worker for Kokoro-82M FP32 (32 kHz + Perth) ----------
  async ensureKokoroBlobWorker() {
    if (this.kokoroWorker) return this.kokoroWorker;
    const res = await fetch(SCHOLAR_KOKORO_URL, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching scholar-kokoro-worker.js`);
    const code = await res.text();
    const blobUrl = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    const w = new Worker(blobUrl, { type: 'module', name: 'openie-eco-kokoro-fp32' });
    w.onmessage = (ev) => {
      const m = ev.data || {};
      if (m.type === 'downloaded') {
        w.postMessage({ type: 'load', base: KOKORO_PACK_BASE, vendor: ORT_VENDOR_BASE });
      } else if (m.type === 'loaded') {
        this.kokoroReady = true;
        this.kokoroLoading = false;
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
      }
    };
    this.kokoroWorker = w;
    return w;
  }

  async warmupKokoro() {
    if (this.kokoroReady || this.kokoroLoading) return;
    this.kokoroLoading = true;
    this._emitTelemetry();
    try {
      const w = await this.ensureKokoroBlobWorker();
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
    } catch {
      this.kokoroLoading = false;
      this._emitTelemetry();
    }
  }

  async speakSovereignKokoro(rawText, { voice, speed, signal } = {}) {
    const clean = normalizeForSpeech(rawText);
    if (!clean || signal?.aborted) return;
    await this._ensureAudioContext();
    if (!this.kokoroReady) {
      await this.warmupKokoro();
      let waited = 0;
      while (!this.kokoroReady && this.kokoroLoading && waited < 12000 && !signal?.aborted) {
        await new Promise((r) => setTimeout(r, 150));
        waited += 150;
      }
    }
    if (!this.kokoroReady || !this.kokoroWorker || signal?.aborted) return;
    const id = this.kokoroSayId++;
    await new Promise((res, rej) => {
      this.kokoroPending.set(id, { res, rej });
      this.kokoroWorker.postMessage({
        type: 'say',
        id,
        text: clean,
        speed: speed || this.speed || 1.04,
        voice: mapToKokoroFp32Voice(voice || this.voice),
      });
    }).catch(() => {});
  }

  _startSovereignSpeechRec() {
    if (this.engineMode !== 'sovereign_gpu' || !this.speechRecSupported || this.speechRec) return;
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
      if (this.callActive && !this.micMuted && this.engineMode === 'sovereign_gpu' && this.speechRec === rec) {
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

  async _commitWhisperUtterance(chunks) {
    let total = 0;
    for (const c of chunks) total += c.length;
    const merged = new Float32Array(total);
    let offset = 0;
    for (const c of chunks) {
      merged.set(c, offset);
      offset += c.length;
    }
    if (!this.asrWorker) {
      const blobUrl = URL.createObjectURL(new Blob([WHISPER_BLOB_WORKER_SOURCE], { type: 'text/javascript' }));
      this.asrWorker = new Worker(blobUrl, { type: 'module' });
      this.asrWorker.onmessage = (e) => {
        const d = e.data || {};
        const p = this.asrPending.get(d.id);
        if (!p) return;
        this.asrPending.delete(d.id);
        if (d.error) p.rej(new Error(d.error));
        else p.res(d);
      };
    }
    const id = ++this.asrReqId;
    try {
      const res = await new Promise((resolve, reject) => {
        this.asrPending.set(id, { res: resolve, rej: reject });
        this.asrWorker.postMessage({ id, type: 'transcribe', audio: merged }, [merged.buffer]);
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

  // ---------- Camera & Screen Vision (768px Motion-Gated JPEG S2S) ----------
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
    if (!navigator.mediaDevices?.getUserMedia) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.cameraFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      this._activateVisionStream(stream, 'camera');
      return true;
    } catch {
      return false;
    }
  }

  async flipCamera() {
    return this.startCamera(this.cameraFacing === 'user' ? 'environment' : 'user');
  }

  async startScreenShare() {
    this.stopVision();
    if (!navigator.mediaDevices?.getDisplayMedia) return false;
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { width: { ideal: 1440 }, height: { ideal: 900 } }, audio: false });
      stream.getVideoTracks()[0]?.addEventListener('ended', () => this.stopVision());
      this._activateVisionStream(stream, 'screen');
      return true;
    } catch {
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
    this.visionSampleTimer = setInterval(() => this.sampleAndPushVisionFrame(false), 950);
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

    const tw = Math.min(w, 64);
    const th = Math.min(h, 36);
    const img = ctx.getImageData(0, 0, tw, th).data;
    const n = tw * th;
    const luma = new Float32Array(n);
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      luma[i] = 0.2126 * img[p] + 0.7152 * img[p + 1] + 0.0722 * img[p + 2];
    }
    let edgeHits = 0;
    for (let y = 1; y < th - 1; y++) {
      for (let x = 1; x < tw - 1; x++) {
        const idx = y * tw + x;
        if (Math.abs(luma[idx + 1] - luma[idx - 1]) + Math.abs(luma[idx + tw] - luma[idx - tw]) > 40) edgeHits++;
      }
    }
    const edgeDensityPct = Math.round((edgeHits / Math.max(1, (tw - 2) * (th - 2))) * 1000) / 10;

    let diff = 999;
    if (this.lastLumaSig && this.lastLumaSig.length === n) {
      let s = 0;
      for (let i = 0; i < n; i++) s += Math.abs(luma[i] - this.lastLumaSig[i]);
      diff = s / n;
    }
    this.lastLumaSig = luma;

    const dataUrl = this.offscreenCanvas.toDataURL('image/jpeg', 0.76);
    const jpegB64 = dataUrl.split(',')[1] || '';
    this.lastFrameB64 = jpegB64;

    const snap = {
      dataUrl,
      jpegB64,
      metrics: { width: vid.videoWidth, height: vid.videoHeight, edgeDensityPct },
      source: this.visionSource,
    };
    this.lastVisionSnapshot = snap;
    this.emit('vision-frame', snap);

    if ((force || diff >= 6.5) && this.ws && this.ws.readyState === WebSocket.OPEN && jpegB64) {
      this.ws.send(JSON.stringify({ type: 'vision', jpeg_b64: jpegB64, source: this.visionSource || 'camera' }));
    }
    return snap;
  }

  async analyzeFrameNow(prompt = '') {
    if (!this.visionStream) {
      const ok = await this.startCamera(this.cameraFacing);
      if (!ok) return null;
      await new Promise((r) => setTimeout(r, 380));
    }
    const snap = this.sampleAndPushVisionFrame(true);
    await this.sendGroundedPrompt(
      prompt || 'Look at the visual frame I just shared and explain the key equations, charts, controls, or findings.',
      { userDisplayText: prompt || '📸 Inspect current frame' }
    );
    return snap;
  }

  // ---------- Unified Engine Controls & Grounded Turn Dispatch ----------
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
    if (mode === 'sovereign_gpu') this.warmupKokoro().catch(() => {});
    this._emitState();
    this._emitTelemetry();
    if (wasActive) await this.startCall({ studyId: this.activeStudyId, mode: this.mode });
  }

  async setVoice(voiceId) {
    const clean = normalizeStudioVoice(voiceId);
    if (this.voice === clean) return;
    this.voice = clean;
    this._emitState();
    this._emitTelemetry();
    if (this.engineMode === 'studio_s2s' && this.ws) {
      this.bargeIn('silent-reset');
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
      this.wsReadyPromise = null;
      if (this.callActive) await this.ensureStudioWebSocket().catch(() => {});
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
    this.openVisualStage({ studyId, clip: '15s' });
    this._emitState();
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

  async sendGroundedPrompt(groundedPrompt, { userDisplayText = null, study = null, blog = null } = {}) {
    await this._ensureAudioContext();
    await this.loadCorpora().catch(() => {});
    const activeStudy = study || this.studiesById.get(this.activeStudyId);
    const activeBlog = blog || (activeStudy ? this.blogById.get(activeStudy.id) : null);
    this.sealStreamingTurns();

    if (userDisplayText) {
      const uTurn = {
        id: `eco-turn-${++this.turnCounter}`,
        role: 'user',
        speakerName: 'You',
        speakerRole: this.surface.domain,
        text: userDisplayText,
        ts: Date.now(),
      };
      this.transcript.push(uTurn);
      this.emit('turn', uTurn);
    }

    this.lastTurnCommitAt = performance.now();
    this.state = 'thinking';
    this._emitState();

    if (this.engineMode === 'studio_s2s') {
      try {
        const ws = await this.ensureStudioWebSocket();
        if (this.visionStream) this.sampleAndPushVisionFrame(true);
        ws.send(JSON.stringify({ type: 'text', text: groundedPrompt }));
        return;
      } catch {}
    }

    const ctrl = new AbortController();
    this.turnAbort = ctrl;
    let spokenReply = '';
    try {
      const r = await fetch(`${RESEARCH_ORIGIN}/api/live/turn`, {
        method: 'POST',
        mode: 'cors',
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
        if (d.witness_clip) this._emitWitnessTurn(d.witness_clip);
      }
    } catch {}

    if (!spokenReply && activeStudy) {
      spokenReply =
        `${activeStudy.short_title} (${activeStudy.evidence_class}, Signed Provenance · Self-Checked): ${activeStudy.headline_claim} ` +
        `Scope note: ${activeStudy.limitations_and_scope.split('.')[0]}.`;
    }

    const persona = STUDIO_VOICES[this.voice] || STUDIO_VOICES.Aoede;
    const aiTurn = {
      id: `eco-turn-${++this.turnCounter}`,
      role: 'assistant',
      speakerName: persona.name,
      speakerRole: `${persona.role} · Kokoro FP32`,
      text: spokenReply || 'Ready.',
      receipt: this.makeReceipt(activeStudy, activeBlog),
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

  async startCall(opts = {}) {
    await this.loadCorpora();
    if (opts.studyId && this.studiesById.has(opts.studyId)) this.activeStudyId = opts.studyId;
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
    const dom = this.refreshLiveDomIndex();
    if (study) this.openVisualStage({ studyId: study.id, clip: '15s' });

    if (this.mode === 'vision' && !this.visionStream) await this.startCamera(this.cameraFacing);

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
      await this.startPageCoPilot(this.activeStudyId);
      return;
    }

    const obsHint =
      this.surface.id === 'living' && dom.controls.length
        ? ` We have ${dom.figures.length} interactive figures and ${dom.controls.length} live controls (${this.summarizeLiveControls(2)}).`
        : dom.visibleSection
        ? ` Currently viewing "${dom.visibleSection.heading}" on ${this.surface.domain}.`
        : '';
    const greetPrompt =
      `Greet the listener warmly in 2 natural spoken sentences as the ${this.surface.name} studio voice co-pilot.` +
      obsHint +
      (study ? ` Active study: ${study.short_title} (${study.evidence_class}, Signed Provenance · Self-Checked).` : '') +
      ` Invite them to ask anything, tour this page, or interrupt anytime.`;

    await this.sendGroundedPrompt(greetPrompt, { userDisplayText: null, study });
  }

  endCall() {
    this.bargeIn('silent-reset');
    this.callActive = false;
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
    await this.loadCorpora();
    const cleanQ = String(queryText || '').trim();
    if (!cleanQ) return null;
    this.bargeIn('silent-reset');
    const qLower = cleanQ.toLowerCase();

    if (/\b(camera|webcam|screen|frame|holding|look at|inspect my)\b/.test(qLower)) {
      if (/\bscreen\b/.test(qLower) && !this.visionStream) await this.startScreenShare();
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

    if (/\b(walk me through|walkthrough|tour|step by step|section by section|every figure|co-pilot|copilot)\b/.test(qLower)) {
      this.mode = 'copilot';
      this._emitState();
      return this.startPageCoPilot(matchedStudy?.id);
    }

    const domSec = this.findBestDomSection(cleanQ);
    if (domSec) this.spotlightDomElement(domSec.key);

    let clip = '15s';
    if (/\b(tiktok|vertical|reel|9:16)\b/.test(qLower)) clip = 'tiktok';
    else if (/\b(method|meter|sensor|shunt|hardware|falsifier|limitation|scope)\b/.test(qLower)) clip = '45s';
    if (matchedStudy) this.openVisualStage({ studyId: matchedStudy.id, clip });

    const ctrlSnap = this.summarizeLiveControls(4);
    const prompt =
      `[Grounded Context — Portal: ${this.surface.name} (${this.surface.domain}). ` +
      (matchedStudy
        ? `Study: ${matchedStudy.short_title} (${matchedStudy.evidence_class}, Signed Provenance · Self-Checked). Claim: ${matchedStudy.headline_claim} Limits: ${matchedStudy.limitations_and_scope}`
        : `Caveat: ${this.surface.caveat || ''}`) +
      (domSec ? ` Active Page Element "${domSec.heading}": ${(domSec.snippet || '').slice(0, 180)}.` : '') +
      (ctrlSnap ? ` Live Observatory Controls: ${ctrlSnap}.` : '') +
      `] Answer naturally in 2 to 4 spoken sentences without reading brackets aloud: ${cleanQ}`;

    await this.sendGroundedPrompt(prompt, {
      userDisplayText: opts.fromVoice ? null : cleanQ,
      study: matchedStudy,
      blog: matchedBlog,
    });
    return cleanQ;
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
    this.bargeIn('silent-reset');
    this._emitState();

    const targets = dom.figures.length ? dom.figures.slice(0, 3) : dom.sections.slice(0, 3);
    if (targets[0]) this.spotlightDomElement(targets[0].key);
    if (study) this.openVisualStage({ studyId: study.id, clip: '15s' });

    const stopList = targets.map((t, i) => `Stop ${i + 1}: "${t.caption || t.heading}"`).join('; ');
    const ctrlSnap = this.summarizeLiveControls(3);
    const tourPrompt =
      `Guide the listener through ${this.surface.name} (${this.surface.domain}) in 3 crisp, natural spoken beats. ` +
      (stopList ? `Cover these live page stops: ${stopList}. ` : '') +
      (ctrlSnap ? `Mention their active simulator controls (${ctrlSnap}). ` : '') +
      (study
        ? `Anchor in ${study.short_title} (${study.evidence_class}, Signed Provenance · Self-Checked): ${(study.plain_bullets || []).slice(0, 2).join(' ')} And state the key scope limit: ${study.limitations_and_scope.split('.')[0]}.`
        : this.surface.caveat || '');

    await this.sendGroundedPrompt(tourPrompt, {
      userDisplayText: `🧭 Page Co-Pilot Tour (${this.surface.domain})`,
      study,
      blog,
    });
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
    this.bargeIn('silent-reset');
    this._emitState();
    this.openVisualStage({ studyId: study.id, clip: '45s' });

    const debatePrompt =
      `Present a sharp, lively Outside-Review Skeptic vs Systems Lead exchange on ${study.short_title} (${study.evidence_class}, Signed Provenance · Self-Checked). ` +
      `Skeptic challenge: "${study.skeptic_question}" and "${study.skeptic_followup}". ` +
      `Systems Lead post-review rebuttal: "${study.architect_answer}" and "${study.architect_rebuttal}". ` +
      `Invite the listener to interrupt and challenge either position.`;

    await this.sendGroundedPrompt(debatePrompt, {
      userDisplayText: `⚖️ Skeptic Debate: ${study.short_title}`,
      study,
      blog,
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
    ctx.restore();
  }
}

// ---------- Shadow DOM UI ----------
const SHADOW_CSS = `
  :host {
    all: initial; position: fixed; right: 18px; bottom: 18px; z-index: 2147483000;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #F8FAFC; line-height: 1.45;
  }
  *, *::before, *::after { box-sizing: border-box; }
  .hidden { display: none !important; }
  .pill-btn {
    display: inline-flex; align-items: center; gap: 9px; padding: 10px 16px; border-radius: 9999px;
    background: rgba(11, 16, 29, 0.94); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(52, 211, 153, 0.48); color: #F8FAFC;
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.55); cursor: pointer; transition: transform 0.16s, border-color 0.2s;
  }
  .pill-btn:hover { transform: translateY(-1px); border-color: #F59E0B; }
  .pill-btn:focus-visible, button:focus-visible, select:focus-visible, input:focus-visible, a:focus-visible {
    outline: 2px solid #F59E0B; outline-offset: 2px;
  }
  .dot-wrap { position: relative; width: 10px; height: 10px; display: inline-flex; }
  .dot-ping { position: absolute; inset: 0; border-radius: 9999px; background: #34D399; opacity: 0.72; animation: oePing 1.9s infinite; }
  .dot-core { position: relative; width: 10px; height: 10px; border-radius: 9999px; background: #34D399; }
  @keyframes oePing { 75%, 100% { transform: scale(2.1); opacity: 0; } }
  .pill-label { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; font-weight: 600; color: #6EE7B7; }
  .pill-kbd { font-family: ui-monospace, monospace; font-size: 10px; padding: 2px 6px; border-radius: 5px; background: rgba(255,255,255,0.09); color: #94A3B8; }

  .panel {
    width: min(430px, calc(100vw - 24px)); max-height: min(770px, calc(100dvh - 36px));
    display: flex; flex-direction: column; border-radius: 18px;
    background: rgba(10, 15, 28, 0.97); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(0, 212, 170, 0.38); box-shadow: 0 24px 64px rgba(0, 0, 0, 0.72); overflow: hidden;
  }
  .hdr { padding: 10px 13px; border-bottom: 1px solid rgba(148,163,184,0.18); background: rgba(255,255,255,0.025); display: flex; flex-direction: column; gap: 6px; }
  .hdr-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .hdr-brand { display: flex; align-items: center; gap: 7px; min-width: 0; }
  .hdr-title { font-weight: 700; font-size: 12.5px; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .badge-prov { font-family: ui-monospace, monospace; font-size: 9.5px; padding: 2px 6px; border-radius: 5px; background: rgba(245,158,11,0.14); border: 1px solid rgba(245,158,11,0.36); color: #FBBF24; white-space: nowrap; }
  .qlinks { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
  .qlink { font-family: ui-monospace, monospace; font-size: 10px; padding: 2px 7px; border-radius: 5px; text-decoration: none; border: 1px solid rgba(0,212,170,0.34); color: #5EEAD4; background: rgba(0,212,170,0.07); }
  .qlink-amber { border-color: rgba(245,158,11,0.38); color: #FCD34D; background: rgba(245,158,11,0.08); }
  .close-btn { font-family: ui-monospace, monospace; font-size: 11px; padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(148,163,184,0.26); background: transparent; color: #94A3B8; cursor: pointer; }

  .body { padding: 10px 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; flex: 1; }
  .engines { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
  .eng-btn {
    font-family: ui-monospace, monospace; font-size: 10px; padding: 6px 6px; border-radius: 7px;
    border: 1px solid rgba(148,163,184,0.22); background: rgba(255,255,255,0.025); color: #94A3B8;
    cursor: pointer; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .eng-btn.active { border-color: rgba(52,211,153,0.7); background: rgba(16,185,129,0.18); color: #ECFDF5; font-weight: 700; }
  .modes { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
  .mode-btn { font-family: ui-monospace, monospace; font-size: 10.5px; padding: 5px 4px; border-radius: 7px; border: 1px solid rgba(148,163,184,0.22); background: rgba(255,255,255,0.025); color: #94A3B8; cursor: pointer; text-align: center; }
  .mode-btn.active { border-color: rgba(0,212,170,0.72); background: rgba(0,212,170,0.16); color: #FFFFFF; font-weight: 600; }

  .selectors { display: flex; gap: 6px; }
  .sel { font-family: ui-monospace, monospace; font-size: 11px; padding: 6px 8px; border-radius: 8px; background: #060A13; border: 1px solid rgba(148,163,184,0.25); color: #F8FAFC; min-width: 0; }
  .sel-study { flex: 1; }
  .sel-voice { color: #FBBF24; width: 142px; flex-shrink: 0; }

  .orb-deck { display: flex; align-items: center; gap: 11px; padding: 9px 10px; border-radius: 12px; background: rgba(6,10,19,0.9); border: 1px solid rgba(148,163,184,0.2); }
  .orb-btn { width: 74px; height: 74px; padding: 0; border: none; border-radius: 9999px; background: transparent; cursor: pointer; flex-shrink: 0; }
  .orb-canvas { width: 74px; height: 74px; display: block; }
  .orb-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
  .state-line { font-family: ui-monospace, monospace; font-size: 10px; color: #2DD4BF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ctrl-row { display: flex; flex-wrap: wrap; gap: 5px; }
  .cbtn { font-family: ui-monospace, monospace; font-size: 10.5px; padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(148,163,184,0.28); background: rgba(255,255,255,0.04); color: #E2E8F0; cursor: pointer; }
  .cbtn-start { background: #34D399; border-color: #34D399; color: #05120E; font-weight: 700; }
  .cbtn-end { background: #F43F5E; border-color: #F43F5E; color: #FFFFFF; font-weight: 700; }
  .cbtn-barge { border-color: rgba(245,158,11,0.48); background: rgba(245,158,11,0.12); color: #FBBF24; }
  .interim { font-family: ui-monospace, monospace; font-size: 10px; color: #6EE7B7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .vision-box { border-radius: 11px; border: 1px solid rgba(52,211,153,0.45); background: #000; overflow: hidden; }
  .vision-bar { padding: 5px 9px; background: rgba(16,185,129,0.14); display: flex; align-items: center; justify-content: space-between; font-family: ui-monospace, monospace; font-size: 10px; color: #6EE7B7; }
  .vision-video { width: 100%; height: 114px; object-fit: cover; display: block; }

  .stage-box { border-radius: 11px; border: 1px solid rgba(148,163,184,0.22); background: rgba(6,10,19,0.85); overflow: hidden; }
  .stage-sum { padding: 6px 10px; font-family: ui-monospace, monospace; font-size: 10.5px; color: #FBBF24; cursor: pointer; display: flex; justify-content: space-between; list-style: none; }
  .stage-sum::-webkit-details-marker { display: none; }
  .stage-inner { padding: 8px; border-top: 1px solid rgba(148,163,184,0.18); display: flex; flex-direction: column; gap: 6px; }
  .stage-video { width: 100%; max-height: 175px; border-radius: 7px; background: #000; }

  .transcript { display: flex; flex-direction: column; gap: 7px; max-height: 190px; overflow-y: auto; padding-right: 3px; }
  .turn-user { margin-left: 22px; padding: 7px 10px; border-radius: 9px; border: 1px solid rgba(0,212,170,0.32); background: rgba(0,212,170,0.09); font-size: 11.5px; color: #FFFFFF; }
  .turn-ai { padding: 8px 10px; border-radius: 9px; border: 1px solid rgba(148,163,184,0.22); background: rgba(255,255,255,0.03); display: flex; flex-direction: column; gap: 4px; }
  .turn-hdr { display: flex; align-items: center; justify-content: space-between; gap: 6px; font-family: ui-monospace, monospace; font-size: 9.5px; }
  .turn-spk { color: #FBBF24; font-weight: 700; }
  .ev-badge { padding: 1px 6px; border-radius: 4px; border: 1px solid rgba(148,163,184,0.3); color: #CBD5E1; background: rgba(255,255,255,0.05); }
  .ev-measured_j { border-color: rgba(52,211,153,0.45); color: #6EE7B7; background: rgba(16,185,129,0.14); }
  .ev-reported_j { border-color: rgba(0,212,170,0.45); color: #5EEAD4; background: rgba(0,212,170,0.14); }
  .ev-est_j { border-color: rgba(245,158,11,0.45); color: #FCD34D; background: rgba(245,158,11,0.14); }
  .turn-txt { font-size: 11.5px; color: #E2E8F0; line-height: 1.45; }
  .turn-orth { font-family: ui-monospace, monospace; font-size: 9px; color: #64748B; }

  .chips { display: flex; flex-wrap: wrap; gap: 5px; }
  .chip { font-family: ui-monospace, monospace; font-size: 10px; padding: 3px 8px; border-radius: 9999px; border: 1px solid rgba(148,163,184,0.24); background: rgba(255,255,255,0.025); color: #CBD5E1; cursor: pointer; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chip:hover { border-color: #F59E0B; color: #FFFFFF; }
  .ftr { padding: 9px 12px; border-top: 1px solid rgba(148,163,184,0.18); background: rgba(6,10,19,0.96); display: flex; flex-direction: column; gap: 5px; }
  .ask-form { display: flex; gap: 6px; }
  .ask-inp { flex: 1; font-size: 12px; padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(148,163,184,0.28); background: #0C1220; color: #FFFFFF; }
  .ask-btn { font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 8px; border: none; background: #F59E0B; color: #090D16; cursor: pointer; }
  .tel-line { font-family: ui-monospace, monospace; font-size: 9.2px; color: #64748B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;

function wireTriggerAndOpenEvents(openFn, sdk) {
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
    if (typeof sdk.loadCorpora === 'function') await sdk.loadCorpora();
    else if (typeof sdk.loadCorpus === 'function') await sdk.loadCorpus();
    if (reqStudy && sdk.studiesById?.has(reqStudy)) sdk.setStudy(reqStudy);
    const cleanMode = ['call', 'vision', 'copilot', 'debate'].includes(reqMode) ? reqMode : 'call';
    sdk.setMode?.(cleanMode);
    if (reqPrompt) sdk.ask?.(reqPrompt);
    else if (autostart) sdk.startCall?.({ studyId: sdk.activeStudyId, mode: cleanMode });
  });

  window.addEventListener('openie:live-open', async (ev) => {
    const d = (ev && ev.detail) || {};
    openFn(true);
    if (!sdk) return;
    if (typeof sdk.loadCorpora === 'function') await sdk.loadCorpora();
    else if (typeof sdk.loadCorpus === 'function') await sdk.loadCorpus();
    if (d.voice && typeof sdk.setVoice === 'function') sdk.setVoice(d.voice);
    if (d.studyId && sdk.studiesById?.has(d.studyId)) sdk.setStudy(d.studyId);
    if (d.contextSummary) sdk.contextSummary = String(d.contextSummary);
    if (d.mode && ['call', 'vision', 'copilot', 'debate'].includes(d.mode)) sdk.setMode?.(d.mode);
    if (d.autoStartCall !== false) {
      await sdk.startCall?.({
        studyId: d.studyId || sdk.activeStudyId,
        mode: d.mode || sdk.mode,
        voice: d.voice || sdk.voice,
        contextSummary: d.contextSummary,
      });
    }
    if (d.prompt) sdk.ask?.(String(d.prompt));
  });
}

export function mountOpenIEEcosystemDock(options = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return null;

  if (!options.force) {
    if (
      document.getElementById('openie-live-dock') ||
      document.getElementById('openie-live-dock-root') ||
      document.getElementById('ai-assistant-root') ||
      document.getElementById('openie-ecosystem-dock-host')
    ) {
      wireTriggerAndOpenEvents(
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
  if (!window.openieLiveHMI) window.openieLiveHMI = sdk;

  const host = document.createElement('div');
  host.id = 'openie-ecosystem-dock-host';
  host.setAttribute('data-openie-surface', sdk.surface.id);
  const shadow = host.attachShadow({ mode: 'open' });

  const styleEl = document.createElement('style');
  styleEl.textContent = SHADOW_CSS;
  shadow.appendChild(styleEl);

  const wrap = document.createElement('nav');
  wrap.setAttribute('aria-label', `${sdk.surface.name} Studio 24 kHz Voice & Vision Co-Pilot`);
  wrap.innerHTML = `
    <button id="oe-pill" class="pill-btn" type="button" aria-expanded="false" aria-controls="oe-panel" title="Open Studio 24 kHz Voice & Vision Co-Pilot (Cmd/Ctrl + Shift + V)">
      <span class="dot-wrap"><span class="dot-ping"></span><span class="dot-core"></span></span>
      <span class="pill-label">📞 Live Call · Video</span>
      <kbd class="pill-kbd">⌘⇧V</kbd>
    </button>
    <div id="oe-panel" class="panel hidden" role="dialog" aria-label="${escHtml(sdk.surface.name)} Studio Co-Pilot"></div>
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
    const prompts = sdk.surface.prompts || SURFACE_REGISTRY.avalanche.prompts;

    panel.innerHTML = `
      <div class="hdr">
        <div class="hdr-top">
          <div class="hdr-brand">
            <span class="dot-core"></span>
            <span class="hdr-title">${escHtml(sdk.surface.name)} · Studio Live</span>
            <span class="badge-prov" title="Signed Provenance · Self-Checked">Self-Checked</span>
          </div>
          <button id="oe-close" class="close-btn" type="button" aria-label="Minimize dock">✕</button>
        </div>
        <div class="qlinks">
          <a id="oe-link-studio" class="qlink" href="${RESEARCH_ORIGIN}/live/?study=${encodeURIComponent(sdk.activeStudyId)}" target="_blank" rel="noopener">Full Studio ↗</a>
          <a id="oe-link-chronicle" class="qlink qlink-amber" href="${BLOG_ORIGIN}" target="_blank" rel="noopener">Chronicle (57) ↗</a>
          <a id="oe-link-verify" class="qlink" href="${BLOG_ORIGIN}/verification/" target="_blank" rel="noopener">Verification ↗</a>
        </div>
      </div>

      <div class="body">
        <div class="engines" role="group" aria-label="Voice engine mode">
          <button type="button" class="eng-btn active" data-eng="studio_s2s" title="Full-Duplex 24 kHz Native Human Speech-to-Speech">⚡ Studio Live · 24 kHz S2S</button>
          <button type="button" class="eng-btn" data-eng="sovereign_gpu" title="Local WebGPU FP32 Kokoro-82M (32 kHz + Perth mark)">🛡️ Sovereign GPU · Kokoro FP32</button>
        </div>

        <div class="modes" role="tablist" aria-label="Interaction mode">
          <button type="button" class="mode-btn active" data-mode="call">📞 Live Call</button>
          <button type="button" class="mode-btn" data-mode="vision">📹 Vision</button>
          <button type="button" class="mode-btn" data-mode="copilot">🧭 Co-Pilot</button>
          <button type="button" class="mode-btn" data-mode="debate">⚖️ Debate</button>
        </div>

        <div class="selectors">
          <select id="oe-study-sel" class="sel sel-study" aria-label="Active research study">
            <option value="${escHtml(sdk.activeStudyId)}">Loading 28 studies + 57 Chronicle entries...</option>
          </select>
          <select id="oe-voice-sel" class="sel sel-voice" aria-label="Studio 24 kHz voice persona">
            <option value="Aoede">Aoede (Warm Host)</option>
            <option value="Charon">Charon (Skeptic)</option>
            <option value="Puck">Puck (Architect)</option>
            <option value="Kore">Kore (Guide)</option>
            <option value="Fenrir">Fenrir (Hardware)</option>
          </select>
        </div>

        <div class="orb-deck">
          <button id="oe-orb-btn" class="orb-btn" type="button" aria-label="Start live voice call or interrupt speaker">
            <canvas id="oe-orb-canvas" class="orb-canvas"></canvas>
          </button>
          <div class="orb-meta">
            <div id="oe-state" class="state-line">READY · 24 KHZ NATIVE STUDIO S2S</div>
            <div class="ctrl-row">
              <button id="oe-call-btn" type="button" class="cbtn cbtn-start">📞 Start</button>
              <button id="oe-barge-btn" type="button" class="cbtn cbtn-barge" title="Smooth <30ms barge-in">✋ Barge-In</button>
              <button id="oe-mute-btn" type="button" class="cbtn" title="Mute/unmute microphone">🎙</button>
              <button id="oe-cam-btn" type="button" class="cbtn" title="Live camera vision">📷</button>
              <button id="oe-scr-btn" type="button" class="cbtn" title="Live screen share vision">🖥</button>
            </div>
            <div id="oe-interim" class="interim hidden"></div>
          </div>
        </div>

        <div id="oe-vision-box" class="vision-box hidden">
          <div class="vision-bar">
            <span id="oe-vision-meta">768px Motion-Gated Vision Active</span>
            <div class="ctrl-row">
              <button id="oe-snap-btn" type="button" class="cbtn cbtn-start">📸 Inspect</button>
              <button id="oe-flip-btn" type="button" class="cbtn">🔄</button>
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
              Full-duplex <strong>24 kHz Studio Native S2S</strong> (Aoede) + 1-click <strong>Sovereign Kokoro-82M FP32</strong> grounded in <strong>${escHtml(sdk.surface.domain)}</strong>, 28 studies, and 57 Chronicle entries. ${escHtml(sdk.surface.caveat || '')}
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
          <input id="oe-input" class="ask-inp" type="text" placeholder="Talk hands-free or ask about this page..." aria-label="Ask OpenIE Studio Co-Pilot" />
          <button type="submit" class="ask-btn">Ask</button>
        </form>
        <div id="oe-tel" class="tel-line">VAD -60dB · Studio 24 kHz S2S (Aoede) · measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered</div>
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
        stateEl.textContent = `${snap.state.toUpperCase()} · ${snap.engineMode === 'studio_s2s' ? `24kHz ${snap.voice}` : 'Kokoro FP32'} · ${snap.activeStudy?.evidence_class || sdk.surface.id}`;
      }
      if (callBtn) {
        callBtn.textContent = snap.callActive ? '⏹ End' : '📞 Start';
        callBtn.className = snap.callActive ? 'cbtn cbtn-end' : 'cbtn cbtn-start';
      }
      if (muteBtn) muteBtn.textContent = snap.micMuted ? '🔇' : '🎙';
      if (visionBox) visionBox.classList.toggle('hidden', !snap.visionActive);
      panel.querySelectorAll('[data-eng]').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-eng') === snap.engineMode);
      });
      panel.querySelectorAll('[data-mode]').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-mode') === snap.mode);
      });
    });

    sdk.on('telemetry', (tel) => {
      if (!telEl) return;
      const ttfa = tel.ttfaMs != null ? `${tel.ttfaMs}ms` : '<350ms';
      telEl.textContent = `VAD ${tel.vadDb.toFixed(0)}dB · TTFA ${ttfa} · ${tel.ttsBackend} · ${tel.estJoulesHeuristic}`;
    });

    sdk.on('interim', ({ text }) => {
      if (!interimEl) return;
      interimEl.textContent = text ? `"${text}"` : '';
      interimEl.classList.toggle('hidden', !text);
    });

    sdk.on('vision-frame', (snap) => {
      if (visionMeta && snap?.metrics) {
        visionMeta.textContent = `${snap.metrics.width}×${snap.metrics.height} · Edges ${snap.metrics.edgeDensityPct}%`;
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

    function renderEcoTurn(turn) {
      if (!transcriptEl) return;
      let el = transcriptEl.querySelector(`[data-turn-id="${escHtml(turn.id)}"]`);
      const isNew = !el;
      if (!el) {
        el = document.createElement('div');
        el.setAttribute('data-turn-id', turn.id);
      }
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
      if (isNew) transcriptEl.appendChild(el);
      transcriptEl.scrollTop = transcriptEl.scrollHeight;
    }

    sdk.on('turn', renderEcoTurn);
    sdk.on('turn-update', renderEcoTurn);

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

    panel.querySelectorAll('[data-eng]').forEach((b) => {
      b.addEventListener('click', () => sdk.setEngineMode(b.getAttribute('data-eng')));
    });

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

  wireTriggerAndOpenEvents(setOpen, sdk);

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
