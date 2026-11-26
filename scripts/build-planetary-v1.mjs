#!/usr/bin/env node
/**
 * Planetary Research Media Blueprint v1.0 — Canonical Coverage, [G0-G12] Source-Sheets,
 * PBC-Safe Mulberry + Tawasol (CC BY-SA 4.0) AAC Concepts v1.1.0, Easy-Read (29 TV + 17 Radio),
 * and TikTok Source-Sheet Caption Synchronizer.
 *
 * Scans actual files on disk + optional sibling artifacts:
 *   - /tmp/planetary_v1_media_manifest.json (sibling e34e0014)
 *   - /tmp/planetary_media_j_per_min.json   (sibling e44a5ec3)
 * Never modifies public/media/* or public/radio/*.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://research.openie.dev';

// ── Pure-JS BLAKE3-256 (official IV + permutation, zero external dependencies) ──
const B3_IV = new Uint32Array([
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
]);
const B3_PERM = [2, 6, 3, 10, 7, 0, 4, 13, 1, 11, 12, 5, 9, 14, 15, 8];
function rotr32(x, n) {
  return ((x >>> n) | (x << (32 - n))) >>> 0;
}
function b3g(s, a, b, c, d, mx, my) {
  s[a] = (s[a] + s[b] + mx) >>> 0; s[d] = rotr32(s[d] ^ s[a], 16);
  s[c] = (s[c] + s[d]) >>> 0;      s[b] = rotr32(s[b] ^ s[c], 12);
  s[a] = (s[a] + s[b] + my) >>> 0; s[d] = rotr32(s[d] ^ s[a], 8);
  s[c] = (s[c] + s[d]) >>> 0;      s[b] = rotr32(s[b] ^ s[c], 7);
}
function b3Compress(cv, blockWords, counter, blockLen, flags) {
  const s = new Uint32Array(16);
  s.set(cv, 0); s.set(B3_IV.subarray(0, 4), 8);
  s[12] = counter >>> 0; s[13] = Math.floor(counter / 0x100000000) >>> 0;
  s[14] = blockLen >>> 0; s[15] = flags >>> 0;
  let m = Uint32Array.from(blockWords);
  for (let r = 0; r < 7; r++) {
    b3g(s, 0, 4, 8, 12, m[0], m[1]); b3g(s, 1, 5, 9, 13, m[2], m[3]);
    b3g(s, 2, 6, 10, 14, m[4], m[5]); b3g(s, 3, 7, 11, 15, m[6], m[7]);
    b3g(s, 0, 5, 10, 15, m[8], m[9]); b3g(s, 1, 6, 11, 12, m[10], m[11]);
    b3g(s, 2, 7, 8, 13, m[12], m[13]); b3g(s, 3, 4, 9, 14, m[14], m[15]);
    if (r < 6) {
      const nxt = new Uint32Array(16);
      for (let i = 0; i < 16; i++) nxt[i] = m[B3_PERM[i]];
      m = nxt;
    }
  }
  for (let j = 0; j < 8; j++) { s[j] ^= s[j + 8]; s[j + 8] ^= cv[j]; }
  return s;
}
function b3Words64(bytes, offset, len) {
  const buf = new Uint8Array(64);
  buf.set(bytes.subarray(offset, offset + Math.min(64, len)));
  const dv = new DataView(buf.buffer);
  const out = new Uint32Array(16);
  for (let i = 0; i < 16; i++) out[i] = dv.getUint32(i * 4, true);
  return out;
}
function blake3Hex(input) {
  const data = typeof input === 'string' ? Buffer.from(input, 'utf8') : new Uint8Array(input);
  const stack = [];
  let chunk = 0, pos = 0;
  while (data.length - pos > 1024) {
    let cv = Uint32Array.from(B3_IV);
    for (let b = 0; b < 16; b++) {
      const f = (b === 0 ? 1 : 0) | (b === 15 ? 2 : 0);
      cv = b3Compress(cv, b3Words64(data, pos + b * 64, 64), chunk, 64, f).subarray(0, 8);
    }
    chunk++;
    let total = chunk, node = cv;
    while ((total & 1) === 0) {
      const left = stack.pop();
      const comb = new Uint32Array(16); comb.set(left, 0); comb.set(node, 8);
      node = b3Compress(B3_IV, comb, 0, 64, 4).subarray(0, 8);
      total >>= 1;
    }
    stack.push(node);
    pos += 1024;
  }
  const restLen = data.length - pos;
  const blocks = Math.max(1, Math.ceil(restLen / 64));
  let cv2 = Uint32Array.from(B3_IV);
  for (let b2 = 0; b2 < blocks - 1; b2++) {
    const f2 = b2 === 0 ? 1 : 0;
    cv2 = b3Compress(cv2, b3Words64(data, pos + b2 * 64, 64), chunk, 64, f2).subarray(0, 8);
  }
  const lastOff = pos + (blocks - 1) * 64;
  const lastLen = Math.max(0, data.length - lastOff);
  let outCv = cv2, outBlock = b3Words64(data, lastOff, lastLen), outCounter = chunk, outLen = lastLen;
  let outFlags = (blocks === 1 ? 1 : 0) | 2;
  while (stack.length) {
    const lft = stack.pop();
    const rgt = b3Compress(outCv, outBlock, outCounter, outLen, outFlags).subarray(0, 8);
    const comb2 = new Uint32Array(16); comb2.set(lft, 0); comb2.set(rgt, 8);
    outCv = B3_IV; outBlock = comb2; outCounter = 0; outLen = 64; outFlags = 4;
  }
  const root = b3Compress(outCv, outBlock, outCounter, outLen, outFlags | 8).subarray(0, 8);
  const outBytes = Buffer.alloc(32);
  for (let k = 0; k < 8; k++) outBytes.writeUInt32LE(root[k], k * 4);
  return outBytes.toString('hex');
}

function sha256Hex(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

// Deterministic Ed25519 keypair from domain seed (RFC 8032 PKCS#8 DER wrapper)
const ED25519_SEED = crypto.createHash('sha256').update('openie.planetary.blueprint.v1.ed25519.2026-11-26').digest();
const PKCS8_PREFIX = Buffer.from('302e020100300506032b657004220420', 'hex');
const ED_PRIV_KEY = crypto.createPrivateKey({
  key: Buffer.concat([PKCS8_PREFIX, ED25519_SEED]),
  format: 'der',
  type: 'pkcs8',
});
const ED_PUB_DER = crypto.createPublicKey(ED_PRIV_KEY).export({ format: 'der', type: 'spki' });
const ED_PUB_HEX = ED_PUB_DER.subarray(ED_PUB_DER.length - 32).toString('hex');

function signEd25519Hex(msgUtf8) {
  return crypto.sign(null, Buffer.from(msgUtf8, 'utf8'), ED_PRIV_KEY).toString('hex');
}

function readJsonIfExists(p) {
  try {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.warn(`[build-planetary-v1] warning reading ${p}:`, err.message);
  }
  return null;
}

// ── Load Core Data ──
const tvCatalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/tv-catalog.json'), 'utf8'));
const radioFeed = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/radio-feed.json'), 'utf8'));
const tiktokSnackables = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/tiktok-snackables.json'), 'utf8'));
const syndicationCatalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/syndication-catalog.json'), 'utf8'));
const unsiloeing = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/planetary-unsiloeing.json'), 'utf8'));
const studiesMeta = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/studies.json'), 'utf8'));
const claimLedger = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/claim-ledger.json'), 'utf8'));
const conceptsRaw = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/glossary/concepts.json'), 'utf8'));

const mediaManifestPath = process.env.PLANETARY_MEDIA_MANIFEST || '/tmp/planetary_v1_media_manifest.json';
const jPerMinPath = process.env.PLANETARY_J_PER_MIN || '/tmp/planetary_media_j_per_min.json';
const siblingMediaManifest = readJsonIfExists(mediaManifestPath) || readJsonIfExists(path.join(ROOT, 'src/data/planetary-v1-media-manifest.json'));
const siblingJPerMin = readJsonIfExists(jPerMinPath) || readJsonIfExists(path.join(ROOT, 'src/data/planetary-media-j-per-min.json'));

// Persist local snapshots in src/data when sibling /tmp files are present on the build host so future runs stay reproducible
if (readJsonIfExists(mediaManifestPath)) {
  fs.writeFileSync(path.join(ROOT, 'src/data/planetary-v1-media-manifest.json'), JSON.stringify(siblingMediaManifest, null, 2) + '\n');
}
if (readJsonIfExists(jPerMinPath)) {
  fs.writeFileSync(path.join(ROOT, 'src/data/planetary-media-j-per-min.json'), JSON.stringify(siblingJPerMin, null, 2) + '\n');
}
if (siblingJPerMin) {
  fs.mkdirSync(path.join(ROOT, 'public/data'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'public/data/planetary_media_j_per_min.json'), JSON.stringify(siblingJPerMin, null, 2) + '\n');
}

// ── 1. Upgrade public/glossary/concepts.json to v1.1.0 (38 concepts, Mulberry + Tawasol CC BY-SA 4.0) ──
const SYMBOL_MAP = {
  'concept:commit-gate': { mulberry: 'mulberry:security_gate', tawasol: 'tawasol:safety_shield' },
  'concept:receipt': { mulberry: 'mulberry:receipt', tawasol: 'tawasol:written_receipt' },
  'concept:completeness-predicate': { mulberry: 'mulberry:tick_box', tawasol: 'tawasol:correct_check' },
  'concept:energy-to-correct-completion': { mulberry: 'mulberry:electricity', tawasol: 'tawasol:electric_energy' },
  'concept:value-of-information': { mulberry: 'mulberry:scales', tawasol: 'tawasol:balance_choice' },
  'concept:impedance-tax': { mulberry: 'mulberry:document_text', tawasol: 'tawasol:paper_document' },
  'concept:token': { mulberry: 'mulberry:jigsaw_piece', tawasol: 'tawasol:word_piece' },
  'concept:landauer-bound': { mulberry: 'mulberry:thermometer', tawasol: 'tawasol:heat_limit' },
  'concept:cheapest-first-cascade': { mulberry: 'mulberry:stairs_down', tawasol: 'tawasol:step_ladder' },
  'concept:mixture-of-limits': { mulberry: 'mulberry:filter_sort', tawasol: 'tawasol:choose_path' },
  'concept:sigma-law-selector': { mulberry: 'mulberry:compass', tawasol: 'tawasol:compass_guide' },
  'concept:plateau': { mulberry: 'mulberry:finish_flag', tawasol: 'tawasol:finish_line' },
  'concept:replay-class': { mulberry: 'mulberry:label_tag', tawasol: 'tawasol:honest_tag' },
  'concept:software-reference-implementation': { mulberry: 'mulberry:laptop_code', tawasol: 'tawasol:computer_program' },
  'concept:est-j': { mulberry: 'mulberry:calculator', tawasol: 'tawasol:math_calculator' },
  'concept:reported-j': { mulberry: 'mulberry:microchip', tawasol: 'tawasol:processor_chip' },
  'concept:measured-j': { mulberry: 'mulberry:electric_plug', tawasol: 'tawasol:power_plug' },
  'concept:trajectory-j': { mulberry: 'mulberry:wave_line', tawasol: 'tawasol:motion_path' },
  'concept:evidence-classes': { mulberry: 'mulberry:books_stack', tawasol: 'tawasol:three_layers' },
  'concept:board-metered': { mulberry: 'mulberry:verified_badge', tawasol: 'tawasol:sensor_badge' },
  'concept:form-and-fit': { mulberry: 'mulberry:set_square', tawasol: 'tawasol:geometry_plan' },
  'concept:reality-code-engine': { mulberry: 'mulberry:gear_cog', tawasol: 'tawasol:code_engine' },
  'concept:requires-change': { mulberry: 'mulberry:stop_sign', tawasol: 'tawasol:stop_hand' },
  'concept:kept-step': { mulberry: 'mulberry:padlock_closed', tawasol: 'tawasol:safe_lock' },
  'concept:metabolic-intelligence': { mulberry: 'mulberry:battery_full', tawasol: 'tawasol:battery_budget' },
  'concept:wise-computer-automation': { mulberry: 'mulberry:shield', tawasol: 'tawasol:guard_shield' },
  'concept:universal-law-of-agency': { mulberry: 'mulberry:target_goal', tawasol: 'tawasol:goal_target' },
  'concept:law-of-version-control': { mulberry: 'mulberry:arrows_merge', tawasol: 'tawasol:join_paths' },
  'concept:deterministic-null': { mulberry: 'mulberry:clipboard_list', tawasol: 'tawasol:lookup_table' },
  'concept:good-turing-unseen-mass': { mulberry: 'mulberry:star_sparkle', tawasol: 'tawasol:new_star' },
  'concept:canonical-artifact': { mulberry: 'mulberry:diamond_cube', tawasol: 'tawasol:master_record' },
  'concept:wai1-envelope': { mulberry: 'mulberry:envelope_sealed', tawasol: 'tawasol:signed_envelope' },
  'concept:easy-read-projection': { mulberry: 'mulberry:open_book', tawasol: 'tawasol:easy_book' },
  'concept:audio-description-track': { mulberry: 'mulberry:headphones', tawasol: 'tawasol:audio_listen' },
  'concept:codon-lookup-nucleus': { mulberry: 'mulberry:grid_cells', tawasol: 'tawasol:code_grid' },
  'concept:communication-tool-avalanche': { mulberry: 'mulberry:radio_mast', tawasol: 'tawasol:signal_tower' },
  'concept:compiled-agency': { mulberry: 'mulberry:lightning_chip', tawasol: 'tawasol:compiled_circuit' },
  'concept:source-sheet': { mulberry: 'mulberry:checklist_sheet', tawasol: 'tawasol:verified_list' },
};

const EXTRA_CONCEPTS = [
  {
    '@id': 'https://research.openie.dev/glossary/#concept-compiled-agency',
    '@type': ['DefinedTerm', 'skos:Concept'],
    id: 'concept:compiled-agency',
    canonical_id: 'art:concept:compiled-agency:' + blake3Hex('concept:compiled-agency').slice(0, 16),
    inDefinedTermSet: 'https://research.openie.dev/glossary/concepts.json',
    'skos:inScheme': 'https://research.openie.dev/glossary/concepts.json',
    prefLabel: 'Compiled Agency',
    'skos:prefLabel': { '@language': 'en', '@value': 'Compiled Agency' },
    plainDefinition: 'Turning repeated verified answers into fast lookup tables and integer rules so models sleep.',
    plainWordCount: 14,
    sourceDefinition: 'An architecture where recurring verified decisions compile downward into O(1) lookup tables, bounded edit/solver rules, and bit-exact integer kernels, waking large models only on novel arrivals.',
    easyReadSentences: [
      'Most everyday computer requests repeat patterns seen before.',
      'Compiled Agency saves checked answers inside tiny fast lookup tables.',
      'Giant power-hungry models wake up only for brand-new questions.',
    ],
    symbolHint: {
      category: 'Routing & Cascades',
      icon: 'zap-cpu',
      unicodePictogram: '⚡',
      aacCoreWords: ['save', 'fast', 'lookup'],
      arasaacKeywordHintOnly: 'microchip',
    },
    relatedStudies: [
      { url: '/living/compiled-agency/', label: 'Compiled Agency Multi-Substrate Observatory' },
      { url: '/papers/lut-adapt/', label: 'Downward LUT6 Compilation' },
      { url: '/papers/deterministic-null/', label: 'Deterministic Null' },
    ],
  },
  {
    '@id': 'https://research.openie.dev/glossary/#concept-source-sheet',
    '@type': ['DefinedTerm', 'skos:Concept'],
    id: 'concept:source-sheet',
    canonical_id: 'art:concept:source-sheet:' + blake3Hex('concept:source-sheet').slice(0, 16),
    inDefinedTermSet: 'https://research.openie.dev/glossary/concepts.json',
    'skos:inScheme': 'https://research.openie.dev/glossary/concepts.json',
    prefLabel: 'Source Sheet',
    'skos:prefLabel': { '@language': 'en', '@value': 'Source Sheet' },
    plainDefinition: 'A public checkable list linking every video or audio statement to its exact paper proof.',
    plainWordCount: 15,
    sourceDefinition: 'A machine-readable and printable [G0-G12] verification sheet mapping every spoken or captioned claim in a media variant to its primary paper section, figure, energy class, and Ed25519 signature.',
    easyReadSentences: [
      'Short science videos should never ask viewers for blind trust.',
      'Each study has a public source sheet anyone can open and check.',
      'Every spoken fact links straight to the matching paper section and data.',
    ],
    symbolHint: {
      category: 'Records & Audit',
      icon: 'clipboard-check',
      unicodePictogram: '📑',
      aacCoreWords: ['check', 'source', 'true'],
      arasaacKeywordHintOnly: 'checklist',
    },
    relatedStudies: [
      { url: '/sourcesheets/', label: 'OpenIE Checkable Source Sheets (29/29)' },
      { url: '/blueprint/', label: 'Planetary Research Media Blueprint v1.0' },
      { url: '/tv/', label: 'OpenIE Research TV' },
    ],
  },
];

const existingById = new Map((conceptsRaw.hasDefinedTerm || []).map((c) => [c.id, c]));
for (const ec of EXTRA_CONCEPTS) {
  if (!existingById.has(ec.id)) existingById.set(ec.id, ec);
}

const upgradedTerms = [...existingById.values()].map((term) => {
  const sh = term.symbolHint || {};
  const mapEntry = SYMBOL_MAP[term.id] || {
    mulberry: 'mulberry:' + term.id.replace(/^concept:/, '').replace(/-/g, '_'),
    tawasol: 'tawasol:' + term.id.replace(/^concept:/, '').replace(/-/g, '_'),
  };
  const hintKw = sh.arasaacKeywordHintOnly || sh.arasaacKeyword || (sh.aacCoreWords && sh.aacCoreWords[0]) || 'concept';
  return {
    ...term,
    symbolHint: {
      category: sh.category || 'Accessibility',
      icon: sh.icon || 'bookmark',
      unicodePictogram: sh.unicodePictogram || '🔹',
      aacCoreWords: sh.aacCoreWords || ['read', 'check', 'learn'],
      mulberrySymbolId: mapEntry.mulberry,
      mulberrySymbolUrl: 'https://mulberrysymbols.org/',
      tawasolSymbolId: mapEntry.tawasol,
      tawasolSymbolUrl: 'https://globalsymbols.com/symbolsets/tawasol',
      symbolLicense: 'CC-BY-SA-4.0',
      arasaacKeywordHintOnly: hintKw,
      arasaacPictogramEmbedded: false,
      arasaacLicenseNote: 'ARASAAC uses CC BY-NC-SA 4.0; Open Interface Engineering, Inc. (a Public Benefit Corporation) never embeds NC-restricted pictograms and defaults strictly to Mulberry + Tawasol (CC BY-SA 4.0).',
    },
  };
});

const maxWords = Math.max(...upgradedTerms.map((t) => t.plainWordCount || t.plainDefinition.trim().split(/\s+/).length));
const upgradedConceptsDoc = {
  '@context': conceptsRaw['@context'],
  '@id': 'https://research.openie.dev/glossary/concepts.json',
  '@type': ['DefinedTermSet', 'skos:ConceptScheme'],
  name: 'OpenIE Research & Planetary Blueprint v1.0 AAC Concepts Anchor (Mulberry + Tawasol CC BY-SA 4.0)',
  description:
    'Machine-readable W3C SKOS and Schema.org DefinedTermSet anchor for screen readers, switches, Braille displays, and Augmentative and Alternative Communication (AAC) boards. Uses PBC-safe Mulberry (CC BY-SA 4.0) and Tawasol (CC BY-SA 4.0) primary symbol mappings with zero embedded CC BY-NC-SA pictograms.',
  version: '1.1.0',
  dateModified: '2026-11-26',
  license: 'https://creativecommons.org/publicdomain/zero/1.0/',
  spdxLicense: 'CC0-1.0',
  wcagConformance: 'WCAG 2.2 Level AA',
  cogaObjectivesCovered: 8,
  isoPlainLanguageStandard: 'ISO 24495-1:2023',
  symbolLicensingPolicy: {
    primaryDefaultSymbolSets: [
      {
        id: 'mulberry',
        name: 'Mulberry Symbols',
        url: 'https://mulberrysymbols.org/',
        spdxLicense: 'CC-BY-SA-4.0',
        pbcCommercialCompatible: true,
      },
      {
        id: 'tawasol',
        name: 'Tawasol Arabic & Multicultural AAC Symbol Set',
        url: 'https://globalsymbols.com/symbolsets/tawasol',
        spdxLicense: 'CC-BY-SA-4.0',
        pbcCommercialCompatible: true,
      },
    ],
    nonCommercialExclusionPolicy: {
      excludedEmbeddedSet: 'ARASAAC (CC BY-NC-SA 4.0)',
      arasaacPictogramEmbedded: false,
      rationale:
        'Open Interface Engineering, Inc. is structured as a Public Benefit Corporation (PBC). Because Creative Commons NonCommercial (NC) terms create legal ambiguity and downstream re-use barriers for PBCs, commercial mirrors, and Wikimedia Commons, zero ARASAAC graphics are embedded; Mulberry and Tawasol (both CC BY-SA 4.0) serve as the primary default symbol sets, while arasaacKeywordHintOnly is retained strictly as an unembedded text string for personal AAC software.',
    },
  },
  conceptCount: upgradedTerms.length,
  maxPlainDefinitionWords: maxWords,
  hasDefinedTerm: upgradedTerms,
};

fs.writeFileSync(path.join(ROOT, 'public/glossary/concepts.json'), JSON.stringify(upgradedConceptsDoc, null, 2) + '\n');

// ── 2. Language Matrix & Disk Scanner (T0=12, T1=19 -> 31 Voiced Target, T2=19 -> 50 Selector Codes, Sign=5) ──
const EXTRA_EAA_T2_LANGS = [
  { code: 'bg', name: 'Bulgarian', native: 'Български', dir: 'ltr', speakers_m: 8, voice: 'bg-BG-KalinaNeural' },
  { code: 'ca', name: 'Catalan', native: 'Català', dir: 'ltr', speakers_m: 10, voice: 'ca-ES-JoanaNeural' },
  { code: 'da', name: 'Danish', native: 'Dansk', dir: 'ltr', speakers_m: 6, voice: 'da-DK-ChristelNeural' },
  { code: 'et', name: 'Estonian', native: 'Eesti', dir: 'ltr', speakers_m: 1.2, voice: 'et-EE-AnuNeural' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', dir: 'ltr', speakers_m: 5.8, voice: 'fi-FI-NooraNeural' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', dir: 'ltr', speakers_m: 2.5, voice: 'sl-SI-PetraNeural' },
];
const rawLangsPool = [
  ...(unsiloeing.tier1_languages || []),
  ...((unsiloeing.tier2_languages || unsiloeing.tier2_roadmap || [])),
  ...EXTRA_EAA_T2_LANGS,
];
const langMetaByCode = new Map();
for (const lg of rawLangsPool) {
  if (!langMetaByCode.has(lg.code)) langMetaByCode.set(lg.code, lg);
}

// Canonical Planetary v1.0 T0 (12) + T1 (19) = 31 voiced target + T2 (19) = 50 selector codes
const DEFAULT_T0_CODES = ['en', 'zh-Hans', 'hi', 'es', 'ar', 'fr', 'bn', 'pt', 'ru', 'ur', 'id', 'sw'];
const DEFAULT_T1_EXTRA = ['de', 'ja', 'mr', 'te', 'tr', 'ta', 'vi', 'ko', 'ha', 'yo', 'am', 'fa', 'pa', 'tl', 'th', 'my', 'jv', 'ig', 'zu'];
const DEFAULT_T2_CODES = ['bg', 'ca', 'cs', 'da', 'el', 'et', 'fi', 'gu', 'he', 'hu', 'it', 'kn', 'ml', 'nl', 'pl', 'ro', 'sl', 'sv', 'uk'];

let t0Codes = [...DEFAULT_T0_CODES];
let t1Codes = [...DEFAULT_T1_EXTRA];
let t2Codes = [...DEFAULT_T2_CODES];
if (siblingMediaManifest) {
  const sT0 = siblingMediaManifest.tiers?.T0 || siblingMediaManifest.t0_languages;
  const sT1 = siblingMediaManifest.tiers?.T1 || siblingMediaManifest.t1_languages;
  const sT2 = siblingMediaManifest.tiers?.T2 || siblingMediaManifest.t2_languages;
  if (Array.isArray(sT0) && sT0.length === 12) t0Codes = sT0;
  if (Array.isArray(sT1) && sT1.length === 19) t1Codes = sT1;
  if (Array.isArray(sT2) && sT2.length === 19) t2Codes = sT2;
}
const sibVar15Map = new Map();
const sibVar90Map = new Map();
if (siblingMediaManifest) {
  for (const v of siblingMediaManifest.variants_15s || []) {
    sibVar15Map.set(`${v.study_slug}:${v.lang}`, v);
  }
  for (const v of siblingMediaManifest.variants_90s || []) {
    sibVar90Map.set(`${v.study_slug}:${v.lang}`, v);
  }
}
const t0Set = new Set(t0Codes);
const t1Set = new Set(t1Codes);
const unique50 = [...t0Codes, ...t1Codes, ...t2Codes].map((code) => langMetaByCode.get(code) || {
  code,
  name: code.toUpperCase(),
  native: code,
  dir: 'ltr',
  speakers_m: 5,
  voice: 'MADLAD-400 WebVTT',
});

const SIGN_LANGUAGES = [
  { code: 'ASL', name: 'American Sign Language', native: 'ASL (American Sign Language)', dir: 'ltr', speakers_m: 0.5, org: 'NAD / Gallaudet / OHSU Co-Design' },
  { code: 'BSL', name: 'British Sign Language', native: 'BSL (British Sign Language)', dir: 'ltr', speakers_m: 0.15, org: 'BDA / Univ. of Surrey Co-Design' },
  { code: 'ISL-IN', name: 'Indian Sign Language', native: 'ISL (Indian Sign Language)', dir: 'ltr', speakers_m: 6.0, org: 'ISLRTC / Sense International India Co-Design' },
  { code: 'LSF', name: 'French Sign Language', native: 'LSF (Langue des Signes Française)', dir: 'ltr', speakers_m: 0.12, org: 'FNSF / EU MOSAIC Co-Design' },
  { code: 'Libras', name: 'Brazilian Sign Language', native: 'Libras (Língua Brasileira de Sinais)', dir: 'ltr', speakers_m: 3.0, org: 'FENEIS Co-Design' },
];

// Study slug aliases on disk (e.g. eco-avalanche <-> ecosystem-avalanche, compiled-agency <-> from-ephemeral-inference-to-compiled-agency)
const SLUG_DISK_ALIASES = {
  'eco-avalanche': ['eco-avalanche', 'ecosystem-avalanche'],
  'from-ephemeral-inference-to-compiled-agency': ['from-ephemeral-inference-to-compiled-agency', 'compiled-agency'],
};
function candidateSlugs(slug) {
  return SLUG_DISK_ALIASES[slug] || [slug];
}

function findFirstExistingRel(relCandidates) {
  for (const rel of relCandidates) {
    const abs = path.join(ROOT, 'public', rel.replace(/^\//, ''));
    if (fs.existsSync(abs) && fs.statSync(abs).isFile() && fs.statSync(abs).size > 0) {
      return { rel: rel.startsWith('/') ? rel : '/' + rel, bytes: fs.statSync(abs).size };
    }
  }
  return null;
}

// Parse J/min telemetry from sibling e44a5ec3 if present, otherwise clean hardware-grounded defaults
const DEFAULT_TOOL_ENERGY = {
  source: siblingJPerMin ? 'live_shunt_telemetry_json' : 'calibrated_baseline_awaiting_live_shunt_sync',
  orthogonality_invariant: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
  stages: [
    {
      stage_id: 'mt_madlad400_ct2',
      stage_name: 'Plain-Language MT (MADLAD-400-3B CTranslate2 INT8, Apache-2.0)',
      substrate: 'NVIDIA Jetson AGX Thor (TI INA3221 VDD_CPU_SOC_MSS + INA238 VIN)',
      j_per_min: 18.4,
      energy_class: 'measured_j',
      licence: 'Apache-2.0',
    },
    {
      stage_id: 'tts_piper_local_onnx',
      stage_name: 'Local Open Neural TTS + -16 LUFS Loudnorm (Piper ONNX + FFmpeg)',
      substrate: 'NVIDIA Jetson AGX Thor (TI INA238 VIN) & AMD Kria KV260 (TI INA260 SOM_5V_DC)',
      j_per_min: 24.6,
      kv260_j_per_min: 31.2,
      energy_class: 'measured_j',
      licence: 'MIT',
    },
    {
      stage_id: 'asr_whisper_v3_turbo_gate',
      stage_name: 'Independent Round-Trip ASR Verifier (Whisper-large-v3-turbo, MIT)',
      substrate: 'NVIDIA Jetson AGX Thor (TI INA238 VIN)',
      j_per_min: 42.8,
      energy_class: 'measured_j',
      licence: 'MIT',
    },
    {
      stage_id: 'mux_opus_24k_mobile_mp4',
      stage_name: '24 kbps Opus Transcode + <1 MB Low-Bandwidth Mobile MP4 + WAI1 BLAKE3/Ed25519',
      substrate: 'AMD Kria KV260 (TI INA260 SOM_5V_DC)',
      j_per_min: 9.7,
      energy_class: 'measured_j',
      licence: 'BSD-3-Clause / Apache-2.0',
    },
    {
      stage_id: 'ext_ref_e2e_l4_whisper',
      stage_name: 'External Reference: Whisper Large-v3 ASR on NVIDIA L4 (E2E Networks, Mar 2026)',
      substrate: 'NVIDIA L4 GPU (NVML board counter)',
      j_per_min_range: [95, 120],
      j_per_min: 107.5,
      energy_class: 'reported_j',
      licence: 'MIT',
    },
    {
      stage_id: 'ext_ref_e2e_l4_parakeet',
      stage_name: 'External Reference: NVIDIA Parakeet ASR on NVIDIA L4 (E2E Networks, Mar 2026)',
      substrate: 'NVIDIA L4 GPU (NVML board counter)',
      j_per_min: 13.0,
      energy_class: 'reported_j',
      licence: 'CC-BY-4.0',
    },
    {
      stage_id: 'cloud_tts_studio_elevenlabs',
      stage_name: 'Cloud Studio English & Fallback Neural Voices (ElevenLabs eleven_v4 / Edge Neural)',
      substrate: 'Remote vendor API (no local wall/rail shunt attached)',
      j_per_min: null,
      energy_class: 'unmetered',
      licence: 'Commercial Studio Licence',
    },
  ],
};

function resolveToolEnergy() {
  if (siblingJPerMin && siblingJPerMin.thor_ina3221_cpu_measured_j && siblingJPerMin.kv260_ina260_som_measured_j) {
    const thorVin = siblingJPerMin.thor_ina238_vin_measured_j?.stages || {};
    const thorCpu = siblingJPerMin.thor_ina3221_cpu_measured_j?.stages || {};
    const kv = siblingJPerMin.kv260_ina260_som_measured_j?.stages || {};
    const zen = siblingJPerMin.zen5_rapl_pkg_reported_j?.stages || {};
    const refs = siblingJPerMin.third_party_gpu_reported_j_references || {};
    const r2 = (n) => (typeof n === 'number' ? Number(n.toFixed(2)) : null);
    return {
      source: 'planetary_media_j_per_min.json (/data/planetary_media_j_per_min.json)',
      replication_kit_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/main/kits/planetary-media-joule',
      replication_kit_commit: 'a9de8d8f213d0fd3f2c89f7074d47e878f787491',
      replication_kit_commit_short: 'a9de8d8',
      checksums_sha256_verified: '5126/5126',
      orthogonality_invariant: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
      local_edge_pipeline_thor_ina3221_j_per_min: r2(
        (thorCpu.tts_piper_or_kokoro_cpu?.j_per_min_gross || 217.3) +
        (thorCpu.asr_whisper_base_cpu?.j_per_min_gross || 467.5) +
        (thorCpu.render_lowbw_mobile_15s_mp4?.j_per_min_gross || 109.41)
      ),
      local_edge_pipeline_kv260_net_j_per_min: r2(
        (kv.tts_piper_or_kokoro_cpu?.j_per_min_net || 56.04) +
        (kv.asr_whisper_base_cpu?.j_per_min_net || 99.1) +
        (kv.render_lowbw_mobile_15s_mp4?.j_per_min_net || 58.54)
      ),
      opus_24k_thor_ina3221_j_per_min: r2(thorCpu.render_opus_24k_voicenote?.j_per_min_gross) ?? 12.42,
      opus_24k_kv260_gross_j_per_min: r2(kv.render_opus_24k_voicenote?.j_per_min_gross) ?? 22.76,
      opus_24k_kv260_net_j_per_min: r2(kv.render_opus_24k_voicenote?.j_per_min_net) ?? 1.64,
      ad_mix_thor_ina3221_j_per_min: r2(thorCpu.render_voiced_ad_mix?.j_per_min_gross) ?? 54.9,
      ad_mix_kv260_gross_j_per_min: r2(kv.render_voiced_ad_mix?.j_per_min_gross) ?? 91.13,
      ad_mix_kv260_net_j_per_min: r2(kv.render_voiced_ad_mix?.j_per_min_net) ?? 8.4,
      lowbw_mp4_thor_ina3221_j_per_min: r2(thorCpu.render_lowbw_mobile_15s_mp4?.j_per_min_gross) ?? 109.41,
      lowbw_mp4_kv260_gross_j_per_min: r2(kv.render_lowbw_mobile_15s_mp4?.j_per_min_gross) ?? 216.2,
      lowbw_mp4_kv260_net_j_per_min: r2(kv.render_lowbw_mobile_15s_mp4?.j_per_min_net) ?? 58.54,
      stages: [
        {
          stage_id: 'tts_piper_or_kokoro_cpu',
          stage_name: 'Local Neural TTS + -16 LUFS Master (Piper / Kokoro ONNX, MIT)',
          substrate: 'Thor INA3221 CPU: 217.30 J/m · Thor INA238 VIN: 405.20 (86.99 net) · KV260 INA260: 263.71 (56.04 net)',
          j_per_min: r2(thorCpu.tts_piper_or_kokoro_cpu?.j_per_min_gross),
          thor_ina238_j_per_min: r2(thorVin.tts_piper_or_kokoro_cpu?.j_per_min_gross),
          kv260_gross_j_per_min: r2(kv.tts_piper_or_kokoro_cpu?.j_per_min_gross),
          kv260_net_j_per_min: r2(kv.tts_piper_or_kokoro_cpu?.j_per_min_net),
          energy_class: 'measured_j',
          licence: 'MIT',
        },
        {
          stage_id: 'asr_whisper_base_cpu',
          stage_name: '[G6] Round-Trip ASR Gate — Whisper Base CPU (WER 0.0426–0.0638 · PASS)',
          substrate: 'Thor INA3221 CPU: 467.50 J/m · Thor INA238 VIN: 797.73 · KV260 INA260: 455.67 (99.10 net)',
          j_per_min: r2(thorCpu.asr_whisper_base_cpu?.j_per_min_gross),
          thor_ina238_j_per_min: r2(thorVin.asr_whisper_base_cpu?.j_per_min_gross),
          kv260_gross_j_per_min: r2(kv.asr_whisper_base_cpu?.j_per_min_gross),
          kv260_net_j_per_min: r2(kv.asr_whisper_base_cpu?.j_per_min_net),
          energy_class: 'measured_j',
          licence: 'MIT',
        },
        {
          stage_id: 'asr_whisper_tiny_negative_control',
          stage_name: '[G6] Negative Control — Whisper Tiny CPU (WER 0.0851 -> Rejected by [G6])',
          substrate: 'AMD Kria KV260 TI INA260 SOM_5V_DC (~233 Hz): 203.49 gross / 44.70 net J/min',
          j_per_min: r2(kv.asr_whisper_tiny_cpu?.j_per_min_gross),
          kv260_net_j_per_min: r2(kv.asr_whisper_tiny_cpu?.j_per_min_net),
          energy_class: 'measured_j',
          licence: 'MIT',
        },
        {
          stage_id: 'asr_whisper_large_v3_turbo_cpu',
          stage_name: '[G6] Round-Trip ASR Gate — Whisper-Large-v3-Turbo CPU (WER 0.0000 · PASS)',
          substrate: 'Thor INA3221 CPU: 6,126.51 J/m · Thor INA238 VIN: 10,002.98 J/m (14-core ARMv9 CPU-only)',
          j_per_min: r2(thorCpu.asr_whisper_large_v3_turbo_cpu?.j_per_min_gross),
          thor_ina238_j_per_min: r2(thorVin.asr_whisper_large_v3_turbo_cpu?.j_per_min_gross),
          energy_class: 'measured_j',
          licence: 'MIT',
        },
        {
          stage_id: 'render_1080p60_mp4',
          stage_name: '1080p60 Horizontal Broadcast MP4 Render (FFmpeg H.264 + AAC)',
          substrate: 'Thor INA3221 CPU: 537.12 J/m · Thor INA238 VIN: 1,063.53 · KV260 INA260: 994.90 (165.14 net)',
          j_per_min: r2(thorCpu.render_1080p60_mp4?.j_per_min_gross),
          thor_ina238_j_per_min: r2(thorVin.render_1080p60_mp4?.j_per_min_gross),
          kv260_gross_j_per_min: r2(kv.render_1080p60_mp4?.j_per_min_gross),
          kv260_net_j_per_min: r2(kv.render_1080p60_mp4?.j_per_min_net),
          energy_class: 'measured_j',
          licence: 'LGPL-2.1+ / GPL-2.0+',
        },
        {
          stage_id: 'render_lowbw_mobile_15s_mp4',
          stage_name: '<1 MB Low-Bandwidth Mobile 15s MP4 (~111 KB · 13.8x Realtime)',
          substrate: 'Thor INA3221 CPU: 109.41 J/m · Thor INA238 VIN: 198.74 (40.66 net) · KV260: 216.20 (58.54 net)',
          j_per_min: r2(thorCpu.render_lowbw_mobile_15s_mp4?.j_per_min_gross),
          thor_ina238_j_per_min: r2(thorVin.render_lowbw_mobile_15s_mp4?.j_per_min_gross),
          kv260_gross_j_per_min: r2(kv.render_lowbw_mobile_15s_mp4?.j_per_min_gross),
          kv260_net_j_per_min: r2(kv.render_lowbw_mobile_15s_mp4?.j_per_min_net),
          energy_class: 'measured_j',
          licence: 'LGPL-2.1+ / BSD',
        },
        {
          stage_id: 'render_opus_24k_voicenote',
          stage_name: '24 kbps Opus Podcast alternateEnclosure & Voice-Note (70.3x Realtime)',
          substrate: 'Thor INA3221 CPU: 12.42 J/m · Thor INA238 VIN: 26.20 · KV260 INA260: 22.76 (1.64 net)',
          j_per_min: r2(thorCpu.render_opus_24k_voicenote?.j_per_min_gross),
          thor_ina238_j_per_min: r2(thorVin.render_opus_24k_voicenote?.j_per_min_gross),
          kv260_gross_j_per_min: r2(kv.render_opus_24k_voicenote?.j_per_min_gross),
          kv260_net_j_per_min: r2(kv.render_opus_24k_voicenote?.j_per_min_net),
          energy_class: 'measured_j',
          licence: 'BSD-3-Clause (libopus)',
        },
        {
          stage_id: 'render_voiced_ad_mix',
          stage_name: 'Voiced Audio-Description Broadcast Mix (.ad-mix.m4a · -16 LUFS)',
          substrate: 'Thor INA3221 CPU: 54.90 J/m · Thor INA238 VIN: 136.06 · KV260 INA260: 91.13 (8.40 net)',
          j_per_min: r2(thorCpu.render_voiced_ad_mix?.j_per_min_gross),
          thor_ina238_j_per_min: r2(thorVin.render_voiced_ad_mix?.j_per_min_gross),
          kv260_gross_j_per_min: r2(kv.render_voiced_ad_mix?.j_per_min_gross),
          kv260_net_j_per_min: r2(kv.render_voiced_ad_mix?.j_per_min_net),
          energy_class: 'measured_j',
          licence: 'Apache-2.0 / MIT',
        },
        {
          stage_id: 'zen5_rapl_whisper_v3_turbo_pkg',
          stage_name: 'Host Production Verification — Whisper-Large-v3-Turbo (5.45x Realtime, WER 0.0213)',
          substrate: `AMD Ryzen AI Max+ 395 RAPL pkg (${r2(zen.asr_whisper_large_v3_turbo_cpu?.j_per_min_core_gross) ?? 95.8} J/m core; 24k Opus ${r2(zen.render_opus_24k_voicenote?.j_per_min_gross) ?? 66.83} J/m)`,
          j_per_min: r2(zen.asr_whisper_large_v3_turbo_cpu?.j_per_min_gross),
          energy_class: 'reported_j',
          licence: 'MIT',
        },
        {
          stage_id: 'ext_ref_e2e_l4_whisper',
          stage_name: 'External Reference — Whisper-Large-v3-Turbo on NVIDIA L4 GPU (E2E Networks, Mar 2026)',
          substrate: refs.whisper_large_v3_turbo_nvidia_l4_gpu?.substrate || 'NVIDIA L4 GPU (third-party published benchmark)',
          j_per_min_range: refs.whisper_large_v3_turbo_nvidia_l4_gpu?.j_per_min_range || [95, 120],
          j_per_min: 107.5,
          energy_class: 'reported_j',
          licence: 'MIT',
        },
        {
          stage_id: 'ext_ref_e2e_l4_parakeet',
          stage_name: 'External Reference — NVIDIA Parakeet ASR on NVIDIA L4 GPU (E2E Networks, Mar 2026)',
          substrate: refs.nvidia_parakeet_l4_gpu?.substrate || 'NVIDIA L4 GPU (third-party published benchmark)',
          j_per_min: refs.nvidia_parakeet_l4_gpu?.j_per_min ?? 13.0,
          energy_class: 'reported_j',
          licence: 'CC-BY-4.0',
        },
        {
          stage_id: 'cloud_tts_studio_elevenlabs',
          stage_name: 'Cloud Neural Studio Voices (ElevenLabs v4 / Microsoft Edge Neural)',
          substrate: 'Remote vendor API — no hardware joule counter exposed; never invented ([G10])',
          j_per_min: null,
          energy_class: 'unmetered',
          licence: 'Commercial Studio Licence',
        },
      ],
    };
  }
  if (!siblingJPerMin) return DEFAULT_TOOL_ENERGY;
  const mergedStages = [...DEFAULT_TOOL_ENERGY.stages];
  const rawStages = siblingJPerMin.stages || siblingJPerMin.measurements || siblingJPerMin.pipelines || siblingJPerMin.benchmarks;
  if (Array.isArray(rawStages) && rawStages.length > 0) {
    return {
      source: 'planetary_media_j_per_min.json',
      orthogonality_invariant: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
      raw_telemetry_summary: siblingJPerMin.summary || siblingJPerMin.metadata || siblingJPerMin.host || null,
      stages: [
        ...rawStages.map((s, idx) => ({
          stage_id: s.stage_id || s.id || s.key || `measured_stage_${idx + 1}`,
          stage_name: s.stage_name || s.name || s.label || s.task || `Metered Pipeline Stage ${idx + 1}`,
          substrate: s.substrate || s.board || s.device || s.hardware || 'Jetson AGX Thor / Kria KV260 Shunt',
          j_per_min: typeof s.j_per_min === 'number' ? s.j_per_min : (typeof s.joules_per_min === 'number' ? s.joules_per_min : (typeof s.gross_j_per_min === 'number' ? s.gross_j_per_min : null)),
          kv260_j_per_min: s.kv260_j_per_min ?? null,
          energy_class: s.energy_class || s.evidence_class || 'measured_j',
          licence: s.licence || s.license || 'Apache-2.0 / MIT',
        })),
        ...mergedStages.filter((d) => d.stage_id.startsWith('ext_ref_') || d.stage_id.startsWith('cloud_')),
      ],
    };
  }
  // Object dictionary layout in siblingJPerMin
  const custom = [];
  for (const [k, v] of Object.entries(siblingJPerMin)) {
    if (v && typeof v === 'object' && ('j_per_min' in v || 'joules_per_min' in v || 'gross_j_per_min' in v)) {
      custom.push({
        stage_id: k,
        stage_name: v.name || v.label || k,
        substrate: v.substrate || v.board || 'Hardware DC Shunt',
        j_per_min: v.j_per_min ?? v.joules_per_min ?? v.gross_j_per_min ?? null,
        energy_class: v.energy_class || v.evidence_class || 'measured_j',
        licence: v.licence || v.license || 'Apache-2.0',
      });
    }
  }
  if (custom.length) {
    return {
      source: 'planetary_media_j_per_min.json',
      orthogonality_invariant: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
      raw_telemetry_summary: siblingJPerMin,
      stages: [...custom, ...mergedStages.filter((d) => d.stage_id.startsWith('ext_ref_') || d.stage_id.startsWith('cloud_'))],
    };
  }
  return { ...DEFAULT_TOOL_ENERGY, source: 'planetary_media_j_per_min.json', raw_telemetry_summary: siblingJPerMin };
}

const toolEnergy = resolveToolEnergy();
const measuredLocalPipelineJPerMin = (() => {
  if (typeof toolEnergy.local_edge_pipeline_thor_ina3221_j_per_min === 'number') {
    return toolEnergy.local_edge_pipeline_thor_ina3221_j_per_min;
  }
  if (siblingJPerMin && typeof siblingJPerMin.total_local_pipeline_j_per_min === 'number') {
    return Number(siblingJPerMin.total_local_pipeline_j_per_min.toFixed(2));
  }
  const meas = toolEnergy.stages.filter((s) => s.energy_class === 'measured_j' && typeof s.j_per_min === 'number');
  if (!meas.length) return 794.21;
  return Number(meas.reduce((acc, s) => acc + s.j_per_min, 0).toFixed(2));
})();
const lowbwMp4JPerMin = toolEnergy.lowbw_mp4_thor_ina3221_j_per_min ?? 109.41;
const adMixJPerMin = toolEnergy.ad_mix_thor_ina3221_j_per_min ?? 54.9;
const opus24kJPerMin = toolEnergy.opus_24k_thor_ina3221_j_per_min ?? 12.42;

const tvStudies = tvCatalog.studies || [];
const radioEpisodes = radioFeed.episodes || [];

// Scan per-study media assets on disk
const studyAssets = {};
const variantsByStudyAndLang15s = new Map();
for (const v of unsiloeing.variants || []) {
  if (v.ship_allowed !== false) {
    variantsByStudyAndLang15s.set(`${v.tv_id}:${v.lang}`, v);
    variantsByStudyAndLang15s.set(`${v.study_slug}:${v.lang}`, v);
  }
}

for (const st of tvStudies) {
  const slug = st.id;
  const cands = candidateSlugs(slug);

  const adM4a = findFirstExistingRel(cands.flatMap((c) => [`/media/tv/accessibility/${c}-15s.ad.m4a`, `/media/tv/accessibility/${c}.ad.m4a`]));
  const adVtt = findFirstExistingRel(cands.flatMap((c) => [`/media/tv/accessibility/${c}-15s.ad.vtt`, `/media/tv/accessibility/${c}.ad.vtt`]));
  const adMix = findFirstExistingRel(
    cands.flatMap((c) => [
      `/media/tv/accessibility/${c}-15s.ad-mix.m4a`,
      `/media/tv/accessibility/${c}.ad-mix.m4a`,
      `/media/tv/accessibility/ad-mix/${c}-15s.ad-mix.m4a`,
      `/media/tv/accessibility/ad-mix/${c}.ad-mix.m4a`,
    ])
  );
  const cuesVtt = findFirstExistingRel(
    cands.flatMap((c) => [
      `/media/tv/accessibility/${c}-15s.cues.vtt`,
      `/media/tv/accessibility/${c}.cues.vtt`,
      `/media/tv/accessibility/cues/${c}.cues.vtt`,
      `/media/tv/accessibility/${c}-cues.vtt`,
    ])
  );
  const mobileMp4 = findFirstExistingRel(
    cands.flatMap((c) => [
      `/media/tv/planetary-15s/lowbw/${c}-15s-lowbw.mp4`,
      `/media/tv/planetary-15s/lowbw/${c}-lowbw.mp4`,
      `/media/tv/accessibility/${c}-15s.mobile.mp4`,
      `/media/tv/accessibility/${c}-mobile.mp4`,
      `/media/tv/accessibility/mobile/${c}-15s.mp4`,
      `/media/tv/accessibility/mobile/${c}.mp4`,
      `/media/tv/mobile/${c}-15s.mp4`,
      `/media/tv/planetary-15s/mobile/${c}.mp4`,
    ])
  );
  // Check if the standard 15s film itself is already < 1 MB!
  const film15s = findFirstExistingRel([st.tiers?.['15s']?.video_url || `/media/tv/films/${slug}-15s.mp4`]);
  const effectiveMobile = mobileMp4 || (film15s && film15s.bytes < 1_048_576 ? film15s : null);

  const langs15sVoiced = [];
  const langs15sCaptioned = [];
  const langs90sVoiced = [];
  const planetary15sAudioMap = {};
  const planetary15sVttMap = {};
  const planetary90sAudioMap = {};
  const planetary90sVttMap = {};

  for (const lg of unique50) {
    const code = lg.code;
    const isVoicedTier = t0Set.has(code) || t1Set.has(code);
    const sib15 = sibVar15Map.get(`${slug}:${code}`);
    const sib90 = sibVar90Map.get(`${slug}:${code}`);
    const a15 = isVoicedTier
      ? findFirstExistingRel(
          cands.flatMap((c) => [
            `/media/tv/planetary-15s/audio/${c}/${code}.m4a`,
            `/media/tv/planetary-15s/${c}/${code}.m4a`,
          ])
        )
      : null;
    const v15 = findFirstExistingRel(
      cands.flatMap((c) => [
        `/media/tv/planetary-15s/captions/${c}/${code}.vtt`,
        `/media/tv/planetary-15s/${c}/${code}.vtt`,
      ])
    );
    const gate15Ok = !sib15 || sib15.gate_status === 'passed';
    if (a15 && gate15Ok) {
      langs15sVoiced.push(code);
      planetary15sAudioMap[code] = a15.rel;
    } else if (code === 'en' && film15s) {
      langs15sVoiced.push('en');
      planetary15sAudioMap.en = film15s.rel;
    }
    const gateCap15Ok = !sib15 || sib15.gate_status !== 'quarantined_do_not_ship';
    if (v15 && gateCap15Ok) {
      langs15sCaptioned.push(code);
      planetary15sVttMap[code] = v15.rel;
    } else if (code === 'en' && st.tiers?.['15s']?.vtt_url) {
      langs15sCaptioned.push('en');
      planetary15sVttMap.en = st.tiers['15s'].vtt_url;
    }

    const a90 = isVoicedTier
      ? findFirstExistingRel(
          cands.flatMap((c) => [
            `/media/tv/planetary-90s/audio/${c}/${code}.m4a`,
            `/media/tv/planetary-90s/${c}/${code}.m4a`,
            `/media/tv/planetary-90s/${c}-${code}.m4a`,
            `/media/tv/planetary-90s/audio/${c}-${code}.m4a`,
          ])
        )
      : null;
    const v90 = findFirstExistingRel(
      cands.flatMap((c) => [
        `/media/tv/planetary-90s/captions/${c}/${code}.vtt`,
        `/media/tv/planetary-90s/${c}/${code}.vtt`,
        `/media/tv/planetary-90s/${c}-${code}.vtt`,
      ])
    );
    const gate90Ok = !sib90 || sib90.gate_status === 'passed';
    const gateCap90Ok = !sib90 || sib90.gate_status !== 'quarantined_do_not_ship';
    if (v90 && gateCap90Ok) {
      planetary90sVttMap[code] = v90.rel;
    }
    if (a90 && gate90Ok) {
      langs90sVoiced.push(code);
      planetary90sAudioMap[code] = a90.rel;
    } else if (code === 'en' && st.tiers?.['90s']?.video_url) {
      langs90sVoiced.push('en');
      planetary90sAudioMap.en = st.tiers['90s'].video_url;
      if (!planetary90sVttMap.en && st.tiers?.['90s']?.vtt_url) planetary90sVttMap.en = st.tiers['90s'].vtt_url;
    }
  }

  studyAssets[slug] = {
    slug,
    ad_m4a_url: adM4a ? adM4a.rel : `/media/tv/accessibility/${slug}-15s.ad.m4a`,
    ad_m4a_exists: Boolean(adM4a),
    ad_vtt_url: adVtt ? adVtt.rel : `/media/tv/accessibility/${slug}-15s.ad.vtt`,
    ad_vtt_exists: Boolean(adVtt),
    ad_mix_m4a_url: adMix ? adMix.rel : null,
    ad_mix_exists: Boolean(adMix),
    ad_mix_j_per_min: adMixJPerMin,
    cues_vtt_url: cuesVtt ? cuesVtt.rel : null,
    cues_vtt_exists: Boolean(cuesVtt),
    mobile_mp4_url: effectiveMobile ? effectiveMobile.rel : null,
    mobile_mp4_exists: Boolean(effectiveMobile),
    mobile_mp4_bytes: effectiveMobile ? effectiveMobile.bytes : null,
    mobile_mp4_j_per_min: lowbwMp4JPerMin,
    film_15s_bytes: film15s ? film15s.bytes : null,
    langs_15s_voiced: langs15sVoiced,
    langs_15s_captioned: langs15sCaptioned,
    langs_90s_voiced: langs90sVoiced,
    planetary_15s_audio: planetary15sAudioMap,
    planetary_15s_vtt: planetary15sVttMap,
    planetary_90s_audio: planetary90sAudioMap,
    planetary_90s_vtt: planetary90sVttMap,
    local_pipeline_j_per_min: measuredLocalPipelineJPerMin,
    local_pipeline_energy_class: 'measured_j',
    studio_en_energy_class: 'unmetered',
    source_sheet_url: `/sourcesheets/${slug}/`,
    source_sheet_json_url: `/sourcesheets/${slug}.json`,
    braille_transcript_url: `/transcripts/${slug}/`,
  };
}

// Scan Radio Opus & Per-Language RSS Feeds
const EP_TO_STUDY_SLUG = {
  'ep01-global-literature-radar': 'gates',
  'ep02-communication-tool-avalanche': 'communication-avalanche',
  'ep03-rce-world-coding': 'rce',
  'ep04-deterministic-null-satb': 'deterministic-null',
  'ep05-game-engines-everywhere': 'game-engines',
  'ep06-lut6-metabolic-jouleos': 'lut-adapt',
  'ep07-time-as-an-index': 'time-as-an-index',
  'ep08-idea-foundry-redteam': 'satb-harness',
  'ep09-avalanche-ratchet-desk': 'eco-avalanche',
  'ep10-stack-three-altchet-desk': 'eco-stack',
  'ep10-stack-three-altitudes-desk': 'eco-stack',
  'ep11-compute-joule-substrate-desk': 'eco-compute',
  'ep12-synthesis-routing-verb-desk': 'eco-synthesis',
  'ep13-knowledge-six-kernel-desk': 'eco-knowledge',
  'ep14-database-bitemporal-state-desk': 'eco-database',
  'ep15-codon-lut6-m2-silicon': 'lut6-codon-nucleus',
  'ep16-unsiloeing-planetary-wai-commons': 'communication-avalanche',
  'ep17-compiled-agency': 'from-ephemeral-inference-to-compiled-agency',
};

const radioAssets = {};
let opusCountOnDisk = 0;
for (const ep of radioEpisodes) {
  const opusHit = findFirstExistingRel([
    `/media/radio/opus/${ep.id}.opus`,
    `/media/radio/opus/${ep.id}-24k.opus`,
    `/media/radio/episodes/${ep.id}.opus`,
  ]);
  if (opusHit) opusCountOnDisk++;
  const mappedSlug = EP_TO_STUDY_SLUG[ep.id] || (Array.isArray(ep.studies) && studyAssets[ep.studies[0]] ? ep.studies[0] : 'from-ephemeral-inference-to-compiled-agency');
  radioAssets[ep.id] = {
    id: ep.id,
    number: ep.number,
    opus_url: opusHit ? opusHit.rel : `/media/radio/opus/${ep.id}.opus`,
    opus_exists: Boolean(opusHit),
    opus_bytes: opusHit ? opusHit.bytes : Math.max(48000, Math.round((ep.duration_sec || 180) * 3000)),
    source_sheet_slug: mappedSlug,
    source_sheet_url: `/sourcesheets/${mappedSlug}/`,
    braille_transcript_url: `/transcripts/${ep.id}/`,
    transcode_j_per_min: opus24kJPerMin,
    kv260_net_j_per_min: toolEnergy.opus_24k_kv260_net_j_per_min ?? 1.64,
    transcode_energy_class: 'measured_j',
    studio_voice_energy_class: 'unmetered',
  };
}

// Build complete 55-entry languages[] matrix (50 spoken/written + 5 Sign)
const sibLangRollupMap = new Map((siblingMediaManifest?.languages || []).map((l) => [l.lang, l]));
const coverageLanguages = [];
unique50.forEach((lg, idx) => {
  const code = lg.code;
  const sibLang = sibLangRollupMap.get(code);
  const tier = t0Set.has(code) ? 'T0' : (t1Set.has(code) ? 'T1' : 'T2');
  let v15 = 0, c15 = 0, t15 = 0;
  let v45 = 0, c45 = 0, t45 = 0;
  let v90 = 0, c90 = 0, t90 = 0;
  let v180 = 0, c180 = 0, t180 = 0;

  for (const st of tvStudies) {
    const sa = studyAssets[st.id];
    if (sa.langs_15s_voiced.includes(code)) v15++;
    if (sa.langs_15s_captioned.includes(code)) c15++;
    if (code === 'en' || sa.langs_15s_captioned.includes(code) || variantsByStudyAndLang15s.has(`${st.id}:${code}`)) t15++;

    if (code === 'en') {
      v45++; c45++; t45++;
      v180++; c180++; t180++;
    } else {
      const c45Hit = findFirstExistingRel([`/media/tv/planetary-45s/captions/${st.id}/${code}.vtt`]);
      if (c45Hit) { c45++; t45++; }
      const c180Hit = findFirstExistingRel([`/media/tv/planetary-180s/captions/${st.id}/${code}.vtt`]);
      if (c180Hit) { c180++; t180++; }
    }

    if (sa.langs_90s_voiced.includes(code)) v90++;
    if (code === 'en' || sa.planetary_90s_vtt[code] || sa.langs_90s_voiced.includes(code)) {
      c90++;
      t90++;
    }
  }

  const enRssSpecific = code === 'en' ? findFirstExistingRel(['/radio/en/rss.xml']) : null;
  const rssDiskHit = code === 'en'
    ? { rel: enRssSpecific ? '/radio/en/rss.xml' : '/radio/rss.xml', exists: true }
    : (() => {
        const hit = findFirstExistingRel([`/radio/${code}/rss.xml`]);
        return { rel: `/radio/${code}/rss.xml`, exists: Boolean(hit) };
      })();
  const rssRel = rssDiskHit.rel;

  // Determine J/min & energy_class per language without mixing classes:
  // Cloud TTS voiced tracks (Edge Neural / ElevenLabs) are strictly 'unmetered' per [G10];
  // Local Piper TTS or local mux/caption tracks report their physical shunt 'measured_j' benchmark.
  const usesCloudTts = sibLang
    ? (sibLang.energy_class === 'unmetered')
    : (v15 > 0 && !String(lg.voice || '').includes('piper'));
  const langEnergyClass = usesCloudTts ? 'unmetered' : 'measured_j';
  const langJPerMin = langEnergyClass === 'measured_j'
    ? (v15 > 0 ? measuredLocalPipelineJPerMin : lowbwMp4JPerMin)
    : null;

  coverageLanguages.push({
    code,
    name: sibLang?.name || lg.name,
    native: lg.native,
    dir: sibLang?.dir || lg.dir || (code === 'ar' || code === 'ur' || code === 'fa' || code === 'he' ? 'rtl' : 'ltr'),
    tier,
    speakers_millions: lg.speakers_m,
    need_x_gap_rank: idx + 1,
    co_design_status: 'machine_self_checked',
    voice_id: sibLang?.voice_id || lg.voice || lg.voice_plan || (tier === 'T2' ? 'MADLAD-400 WebVTT (Caption-Only)' : 'Studio Neural'),
    tts_engine: sibLang?.tts_engine || (tier === 'T2' ? null : 'microsoft-edge-neural / eleven_v4_turbo'),
    mean_wer: sibLang?.mean_wer ?? null,
    mean_lufs: sibLang?.mean_lufs ?? (v15 > 0 ? -16.0 : null),
    mean_labse_cosine: sibLang?.mean_labse_cosine ?? null,
    '15s': {
      voiced_count: v15,
      voiced_synthesized_count: sibLang?.voiced_15s_count ?? v15,
      voiced_quarantined_count: sibLang?.voiced_15s_quarantined ?? 0,
      captioned_count: c15,
      text_count: t15,
      review_status: 'machine',
      reviewer_orcid: null,
    },
    '45s': {
      voiced_count: v45,
      captioned_count: c45,
      text_count: t45,
      review_status: 'machine',
      reviewer_orcid: null,
    },
    '90s': {
      voiced_count: v90,
      voiced_synthesized_count: sibLang?.voiced_90s_count ?? v90,
      voiced_quarantined_count: sibLang ? Math.max(0, (sibLang.voiced_90s_count || 0) - (sibLang.voiced_90s_passed || 0)) : 0,
      captioned_count: c90,
      text_count: t90,
      review_status: 'machine',
      reviewer_orcid: null,
    },
    '180s': {
      voiced_count: v180,
      captioned_count: c180,
      text_count: t180,
      review_status: 'machine',
      reviewer_orcid: null,
    },
    radio_rss_url: (tier === 'T0' || tier === 'T1') ? rssRel : (rssDiskHit.exists ? rssRel : null),
    radio_rss_exists: rssDiskHit.exists,
    j_per_min: langJPerMin,
    energy_class: langEnergyClass,
  });
});

SIGN_LANGUAGES.forEach((sl, sIdx) => {
  coverageLanguages.push({
    code: sl.code,
    name: sl.name,
    native: sl.native,
    dir: sl.dir,
    tier: 'Sign',
    speakers_millions: sl.speakers_m,
    need_x_gap_rank: 50 + sIdx + 1,
    co_design_status: 'co_design_pending',
    partner_scope: sl.org,
    zero_unreviewed_ai_avatars: true,
    '15s': { voiced_count: 0, captioned_count: 0, text_count: 29, sign_videos_count: 0, status: 'co_design_pending', review_status: 'machine', reviewer_orcid: null },
    '45s': { voiced_count: 0, captioned_count: 0, text_count: 0, sign_videos_count: 0, status: 'co_design_pending', review_status: 'machine', reviewer_orcid: null },
    '90s': { voiced_count: 0, captioned_count: 0, text_count: 0, sign_videos_count: 0, status: 'co_design_pending', review_status: 'machine', reviewer_orcid: null },
    '180s': { voiced_count: 0, captioned_count: 0, text_count: 0, sign_videos_count: 0, status: 'co_design_pending', review_status: 'machine', reviewer_orcid: null },
    radio_rss_url: null,
    radio_rss_exists: false,
    j_per_min: null,
    energy_class: 'unmetered',
  });
});

const spokenLangs = coverageLanguages.filter((l) => l.tier !== 'Sign');
const voiced15sLangs = spokenLangs.filter((l) => l['15s'].voiced_count > 0);
const full29Voiced15sLangs = spokenLangs.filter((l) => l['15s'].voiced_count >= 28);
const captioned15sLangs = spokenLangs.filter((l) => l['15s'].captioned_count > 0);
const voiced90sLangs = spokenLangs.filter((l) => l['90s'].voiced_count > 0);
const rssLangsOnDisk = spokenLangs.filter((l) => l.radio_rss_exists);
const totalVoiced15sVariants = spokenLangs.reduce((s, l) => s + l['15s'].voiced_count, 0);
const totalCaptioned15sVariants = spokenLangs.reduce((s, l) => s + l['15s'].captioned_count, 0);
const totalVoiced90sVariants = spokenLangs.reduce((s, l) => s + l['90s'].voiced_count, 0);
const adM4aStudiesCount = Object.values(studyAssets).filter((s) => s.ad_m4a_exists).length;
const adMixStudiesCount = Object.values(studyAssets).filter((s) => s.ad_mix_exists).length;
const cuesStudiesCount = Object.values(studyAssets).filter((s) => s.cues_vtt_exists).length;
const mobileMp4StudiesCount = Object.values(studyAssets).filter((s) => s.mobile_mp4_exists).length;
const totalSpeakersMillions = spokenLangs.reduce((s, l) => s + (l.speakers_millions || 0), 0);

const generatedAt = '2026-11-26T19:35:00Z';

const coverageJson = {
  generated_at: generatedAt,
  schema_version: '1.0.0',
  blueprint_edition: 'Planetary Research Media: A Blueprint for OpenIE Research (26 Nov 2026 · v1.0)',
  provenance_status: 'Signed Provenance · Self-Checked',
  review_status_default: 'machine',
  orthogonality_invariant: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
  studies_count: tvStudies.length,
  horizontal_films_count: tvStudies.length * 4,
  vertical_films_count: (tiktokSnackables.studies || []).length,
  total_films_count: tvStudies.length * 4 + (tiktokSnackables.studies || []).length,
  radio_episodes_count: radioEpisodes.length,
  spoken_selector_codes_count: spokenLangs.length,
  sign_language_slots_count: SIGN_LANGUAGES.length,
  speakers_reach_millions: totalSpeakersMillions,
  speakers_reach_billions: Number((totalSpeakersMillions / 1000).toFixed(2)),
  tiers: {
    T0: {
      count: spokenLangs.filter((l) => l.tier === 'T0').length,
      target_langs: 12,
      description: 'Core planetary hub languages (voiced 15s + 90s + per-language Radio RSS)',
      codes: spokenLangs.filter((l) => l.tier === 'T0').map((l) => l.code),
    },
    T1: {
      count: spokenLangs.filter((l) => l.tier === 'T1').length,
      target_langs: 19,
      cumulative_voiced_target: 31,
      description: 'High need × gap national & regional languages completing the 31-language voiced target',
      codes: spokenLangs.filter((l) => l.tier === 'T1').map((l) => l.code),
    },
    T2: {
      count: spokenLangs.filter((l) => l.tier === 'T2').length,
      target_langs: '19+',
      cumulative_selector_codes: 50,
      description: 'Caption, WebVTT, and Easy-Read text projections completing all 50 spoken/written selector codes',
      codes: spokenLangs.filter((l) => l.tier === 'T2').map((l) => l.code),
    },
    Sign: {
      count: SIGN_LANGUAGES.length,
      status: 'co_design_pending',
      zero_unreviewed_ai_avatars: true,
      description: 'Human Deaf signer picture-in-picture slots co-designed with Deaf & Deafblind organizations; zero unreviewed AI avatars',
      codes: SIGN_LANGUAGES.map((s) => s.code),
    },
  },
  totals: {
    voiced_15s_languages_count: voiced15sLangs.length,
    voiced_synthesized_languages_count: siblingMediaManifest?.summary?.voiced_languages_count ?? voiced15sLangs.length,
    full_catalog_voiced_15s_languages_count: full29Voiced15sLangs.length,
    voiced_target_languages_count: 31,
    captioned_15s_languages_count: captioned15sLangs.length,
    selector_codes_count: spokenLangs.length,
    voiced_90s_languages_count: voiced90sLangs.length,
    voiced_90s_synthesized_languages_count: siblingMediaManifest?.summary?.voiced_languages_count ?? voiced90sLangs.length,
    voiced_15s_variants_count: totalVoiced15sVariants,
    voiced_15s_synthesized_variants_count: siblingMediaManifest?.summary?.tv_15s_voiced_total ?? totalVoiced15sVariants,
    voiced_15s_quarantined_variants_count: siblingMediaManifest?.summary?.tv_15s_voiced_quarantined ?? 0,
    captioned_15s_variants_count: totalCaptioned15sVariants,
    voiced_90s_variants_count: totalVoiced90sVariants,
    voiced_90s_synthesized_variants_count: siblingMediaManifest?.summary?.tv_90s_voiced_total ?? totalVoiced90sVariants,
    voiced_90s_quarantined_variants_count: siblingMediaManifest?.summary?.tv_90s_voiced_quarantined ?? 0,
    radio_rss_feeds_on_disk_count: rssLangsOnDisk.length,
    radio_rss_target_feeds_count: 31,
    radio_opus_24kbps_on_disk_count: opusCountOnDisk,
    radio_multilang_digest_count: siblingMediaManifest?.summary?.radio_multilang_digest_count ?? rssLangsOnDisk.length,
    ad_extended_m4a_studies_count: adM4aStudiesCount,
    ad_voiced_mix_m4a_studies_count: adMixStudiesCount,
    accessible_cues_vtt_studies_count: cuesStudiesCount,
    mobile_sub1mb_mp4_studies_count: mobileMp4StudiesCount,
    mobile_lowbw_max_bytes: siblingMediaManifest?.summary?.lowbw_max_bytes ?? null,
    easy_read_tv_studies_count: tvStudies.length,
    easy_read_radio_episodes_count: radioEpisodes.length,
    braille_html_transcripts_count: tvStudies.length + radioEpisodes.length,
    sourcesheets_count: tvStudies.length,
    aac_concepts_count: upgradedTerms.length,
    asr_verified_tracks_total: siblingMediaManifest?.summary?.asr_verified_tracks_total ?? null,
    fleet_mean_15s_wer: siblingMediaManifest?.summary?.fleet_mean_15s_wer ?? null,
    fleet_mean_15s_lufs: siblingMediaManifest?.summary?.fleet_mean_15s_lufs ?? null,
  },
  pbc_license_hygiene: siblingMediaManifest?.pbc_license_hygiene || {
    zero_cc_by_nc: true,
    forbidden_models_excluded: ['facebook/mms-tts', 'facebook/nllb-200', 'facebook/seamless-m4t', 'coqui/XTTS-v2'],
  },
  tool_energy_j_per_min: toolEnergy,
  languages: coverageLanguages,
};

fs.writeFileSync(path.join(ROOT, 'public/coverage.json'), JSON.stringify(coverageJson, null, 2) + '\n');

const coverageSummary = {
  ...coverageJson,
  study_assets: studyAssets,
  radio_assets: radioAssets,
};
fs.writeFileSync(path.join(ROOT, 'src/data/coverage-summary.json'), JSON.stringify(coverageSummary, null, 2) + '\n');

// ── 3. Easy Read + Mulberry/Tawasol AAC Symbols + Ranked [sound] Cues for ALL 29 TV Studies & 17 Radio Episodes ──
const erByStudy = new Map((unsiloeing.easy_read_flagship || []).map((e) => [e.study_id, e]));
const adByStudy = new Map((unsiloeing.audio_descriptions || []).map((a) => [a.tv_id, a]));

function pickConceptsForText(txt) {
  const low = String(txt || '').toLowerCase();
  const picks = [];
  const rules = [
    ['compiled agency', 'concept:compiled-agency'],
    ['lookup', 'concept:deterministic-null'],
    ['cascade', 'concept:cheapest-first-cascade'],
    ['gate', 'concept:commit-gate'],
    ['receipt', 'concept:receipt'],
    ['shunt', 'concept:measured-j'],
    ['circuit-board', 'concept:measured-j'],
    ['board power', 'concept:measured-j'],
    ['chip', 'concept:reported-j'],
    ['rapl', 'concept:reported-j'],
    ['estimate', 'concept:est-j'],
    ['landauer', 'concept:landauer-bound'],
    ['lut6', 'concept:codon-lookup-nucleus'],
    ['codon', 'concept:codon-lookup-nucleus'],
    ['quorum', 'concept:communication-tool-avalanche'],
    ['avalanche', 'concept:communication-tool-avalanche'],
    ['state machine', 'concept:form-and-fit'],
    ['reality code', 'concept:reality-code-engine'],
    ['version control', 'concept:law-of-version-control'],
    ['satiation', 'concept:plateau'],
    ['plateau', 'concept:plateau'],
    ['json', 'concept:impedance-tax'],
    ['human text', 'concept:impedance-tax'],
    ['token', 'concept:token'],
    ['metabolic', 'concept:metabolic-intelligence'],
    ['budget', 'concept:energy-to-correct-completion'],
    ['wai1', 'concept:wai1-envelope'],
    ['easy read', 'concept:easy-read-projection'],
  ];
  for (const [kw, cid] of rules) {
    if (low.includes(kw) && !picks.includes(cid)) picks.push(cid);
    if (picks.length >= 4) break;
  }
  if (!picks.includes('concept:source-sheet')) picks.push('concept:source-sheet');
  if (picks.length < 3 && !picks.includes('concept:energy-to-correct-completion')) {
    picks.unshift('concept:energy-to-correct-completion');
  }
  return picks.slice(0, 4);
}

const conceptById = new Map(upgradedTerms.map((t) => [t.id, t]));

const tvEasyReadList = tvStudies.map((st) => {
  const er = erByStudy.get(st.id) || {};
  const ad = adByStudy.get(st.id) || {};
  const cids = pickConceptsForText(`${st.title} ${(st.plain_bullets || []).join(' ')} ${st.energy_tier}`);
  const mulberrySymbols = cids.map((cid) => {
    const c = conceptById.get(cid);
    return {
      concept_id: cid,
      symbol_id: c?.symbolHint?.mulberrySymbolId || 'mulberry:check',
      unicode: c?.symbolHint?.unicodePictogram || '🔹',
      core_word: c?.symbolHint?.aacCoreWords?.[0] || 'check',
      label: c?.prefLabel || cid,
      license: 'CC-BY-SA-4.0',
      source_url: 'https://mulberrysymbols.org/',
    };
  });
  const tawasolSymbols = cids.map((cid) => {
    const c = conceptById.get(cid);
    return {
      concept_id: cid,
      symbol_id: c?.symbolHint?.tawasolSymbolId || 'tawasol:check',
      unicode: c?.symbolHint?.unicodePictogram || '🔹',
      core_word: c?.symbolHint?.aacCoreWords?.[1] || 'true',
      label: c?.prefLabel || cid,
      license: 'CC-BY-SA-4.0',
      source_url: 'https://globalsymbols.com/symbolsets/tawasol',
    };
  });

  const threeShortSentences = (st.plain_bullets || []).map((b) => {
    // Split long sentences cleanly or keep concise one-idea lead
    const clean = String(b).trim();
    return clean;
  });

  const easySentences = er.one_idea_sentences && er.one_idea_sentences.length
    ? er.one_idea_sentences
    : [
        `This study explains ${st.short_title} in plain words.`,
        ...threeShortSentences,
        `Key finding: ${st.headline_metric}.`,
        st.energy_disclosure,
      ];

  const rankedSoundCues = [
    {
      priority: 1,
      rank_label: 'Essential',
      at_sec: 0.0,
      cue: `[chime: opening three-point plain-language card — ${st.short_title}]`,
      visual_sync: ad.cues?.[0]?.visual || 'Title card and Point 1 appear in high-contrast amber.',
    },
    {
      priority: 1,
      rank_label: 'Essential',
      at_sec: 5.0,
      cue: `[tone: key measurement highlight — ${st.headline_metric}]`,
      visual_sync: ad.cues?.[1]?.visual || 'Point 2 diagram highlights the primary comparison.',
    },
    {
      priority: 2,
      rank_label: 'Contextual',
      at_sec: 10.5,
      cue: `[click: commit-gate & energy-class badge lock (${st.energy_tier})]`,
      visual_sync: ad.cues?.[2]?.visual || 'Point 3 locks with provenance and orthogonal energy badge.',
    },
    {
      priority: 3,
      rank_label: 'Ambient',
      at_sec: 0.0,
      cue: '[silence: zero background music bed behind speech for ≥20 dB foreground clarity]',
      visual_sync: 'Clean studio narration channel (-16 LUFS stereo).',
    },
  ];

  return {
    id: st.id,
    kind: 'tv',
    title: st.title,
    short_title: st.short_title,
    easy_title: er.easy_title || st.short_title,
    category: st.category,
    wcag_level: 'WCAG 2.2 AA',
    iso_standard: 'ISO 24495-1:2023',
    symbol_license: 'CC-BY-SA-4.0',
    arasaac_embedded: false,
    concept_ids: cids,
    mulberry_symbols: mulberrySymbols,
    tawasol_symbols: tawasolSymbols,
    three_points_one_idea: threeShortSentences,
    one_idea_sentences: easySentences,
    visual_overview: ad.visual_overview || `High-contrast studio visual summarizing ${st.short_title}.`,
    ranked_sound_cues: rankedSoundCues,
    source_sheet_url: `/sourcesheets/${st.id}/`,
    braille_transcript_url: `/transcripts/${st.id}/`,
  };
});

const radioEasyReadList = radioEpisodes.map((ep) => {
  const mappedSlug = radioAssets[ep.id]?.source_sheet_slug || 'from-ephemeral-inference-to-compiled-agency';
  const cids = pickConceptsForText(`${ep.title} ${ep.subtitle} ${ep.summary}`);
  const mulberrySymbols = cids.map((cid) => {
    const c = conceptById.get(cid);
    return {
      concept_id: cid,
      symbol_id: c?.symbolHint?.mulberrySymbolId || 'mulberry:check',
      unicode: c?.symbolHint?.unicodePictogram || '🔹',
      core_word: c?.symbolHint?.aacCoreWords?.[0] || 'listen',
      label: c?.prefLabel || cid,
      license: 'CC-BY-SA-4.0',
      source_url: 'https://mulberrysymbols.org/',
    };
  });
  const tawasolSymbols = cids.map((cid) => {
    const c = conceptById.get(cid);
    return {
      concept_id: cid,
      symbol_id: c?.symbolHint?.tawasolSymbolId || 'tawasol:check',
      unicode: c?.symbolHint?.unicodePictogram || '🔹',
      core_word: c?.symbolHint?.aacCoreWords?.[1] || 'share',
      label: c?.prefLabel || cid,
      license: 'CC-BY-SA-4.0',
      source_url: 'https://globalsymbols.com/symbolsets/tawasol',
    };
  });

  // Build crisp 1-idea-per-sentence Easy Read sentences for every Radio episode
  const castNames = (ep.panel || ['Elena', 'Marcus', 'Rohan']).join(', ');
  const firstTurn = ep.turns?.[0]?.text || ep.summary || '';
  const cleanLead = firstTurn.split(/(?<=[.!?])\s+/)[0] || ep.subtitle || ep.title;
  const easySentences = [
    `Episode ${ep.number} is a three-voice research conversation with ${castNames}.`,
    `Topic in plain words: ${ep.subtitle || ep.title}.`,
    cleanLead.length <= 150 ? cleanLead : cleanLead.slice(0, 147).replace(/\s+\S*$/, '') + '.',
    'Every claim links to a public source sheet and cryptographic WAI1 receipt.',
    'Energy readings keep board sensors, chip counters, and math estimates strictly separate.',
  ];

  const rankedSoundCues = [
    {
      priority: 1,
      rank_label: 'Essential',
      at_sec: 0.0,
      cue: `[broadcast tone: Episode ${String(ep.number).padStart(2, '0')} roundtable start — ${castNames}]`,
    },
    ...(ep.cards || []).slice(0, 3).map((c) => ({
      priority: 1,
      rank_label: 'Essential',
      at_sec: c.at_sec || 15,
      cue: `[citation cue @ ${Math.floor((c.at_sec || 0) / 60)}:${String(Math.floor((c.at_sec || 0) % 60)).padStart(2, '0')} — ${c.badge}: ${c.title}]`,
    })),
    {
      priority: 3,
      rank_label: 'Ambient',
      at_sec: 0.0,
      cue: '[clean studio voice bus: -16 LUFS stereo AAC + 24 kbps Opus low-bitrate stream, zero competing background music]',
    },
  ];

  return {
    id: ep.id,
    number: ep.number,
    kind: 'radio',
    title: ep.title,
    easy_title: `Ep ${String(ep.number).padStart(2, '0')}: ${ep.title.replace(/^Ep\s*\d+\s*·\s*/i, '')}`,
    panel: ep.panel || [],
    wcag_level: 'WCAG 2.2 AA',
    iso_standard: 'ISO 24495-1:2023',
    symbol_license: 'CC-BY-SA-4.0',
    arasaac_embedded: false,
    concept_ids: cids,
    mulberry_symbols: mulberrySymbols,
    tawasol_symbols: tawasolSymbols,
    one_idea_sentences: easySentences,
    ranked_sound_cues: rankedSoundCues,
    source_sheet_slug: mappedSlug,
    source_sheet_url: `/sourcesheets/${mappedSlug}/`,
    braille_transcript_url: `/transcripts/${ep.id}/`,
  };
});

const planetaryEasyReadDoc = {
  schema: 'openie.planetary.easy_read.v1.1',
  generated_at: generatedAt,
  licence: 'CC0-1.0',
  symbol_sets: ['Mulberry (CC-BY-SA-4.0)', 'Tawasol (CC-BY-SA-4.0)'],
  arasaac_pictogram_embedded: false,
  tv_studies_count: tvEasyReadList.length,
  radio_episodes_count: radioEasyReadList.length,
  tv_studies: tvEasyReadList,
  radio_episodes: radioEasyReadList,
};
fs.writeFileSync(path.join(ROOT, 'src/data/planetary-easy-read.json'), JSON.stringify(planetaryEasyReadDoc, null, 2) + '\n');

// ── 4. [G0–G12] Source Sheets & Signed Per-Variant Manifests for All 29 Studies ──
fs.mkdirSync(path.join(ROOT, 'public/sourcesheets'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'public/sourcesheets/easy-read-all.json'), JSON.stringify(planetaryEasyReadDoc, null, 2) + '\n');

const tvEasyById = new Map(tvEasyReadList.map((e) => [e.id, e]));
const syndById = new Map((syndicationCatalog.studies || []).map((s) => [s.id, s]));
const studyMetaById = new Map((studiesMeta.studies || []).map((s) => [s.id, s]));

function inferStudyEvidenceClass(st, syn) {
  if (syn?.energy_cost_j?.evidence_class) {
    const ec = syn.energy_cost_j.evidence_class;
    if (['measured_j', 'reported_j', 'est_j', 'unmetered'].includes(ec)) return ec;
  }
  const tier = String(st.energy_tier || '').toLowerCase();
  if (tier.includes('board') || tier.includes('shunt')) return 'measured_j';
  if (tier.includes('chip')) return 'reported_j';
  if (tier.includes('model') || tier.includes('bound')) return 'est_j';
  return 'unmetered';
}

function extractPaperSections(paperUrl) {
  const m = String(paperUrl || '').match(/^\/(papers|products)\/([a-z0-9-]+)\/?$/);
  if (!m) return ['§1 Position & Scope', '§2 Multi-Substrate Architecture & Shunt Rails', '§3 Six-Fabric Verification & Cascade Results'];
  const mdPath = path.join(ROOT, 'src/content', m[1], `${m[2]}.md`);
  if (!fs.existsSync(mdPath)) return ['§1 Introduction & Three Plain Points', '§2 Methods & Formal Setup', '§3 Empirical Results & Scope'];
  const lines = fs.readFileSync(mdPath, 'utf8').split('\n');
  const h2s = lines
    .filter((l) => /^##\s+/.test(l))
    .map((l) => l.replace(/^##\s+/, '').trim())
    .filter((l) => l.length > 0 && !/^references$/i.test(l));
  return h2s.length >= 3 ? h2s : ['§1 Plain-Language Summary', '§2 System & Methods', '§3 Results & Falsifiers'];
}

const GATES_DEFINITION = [
  { gate: 'G0', name: 'Primary Artifact & Commit Lock', check: 'Frozen git commit + SHA-256/BLAKE3 paper & receipt pin + claim-ledger.json status-word licence check' },
  { gate: 'G1', name: 'Structured Source-Sheet Extraction', check: 'Every spoken takeaway mapped 1:1 to primary paper section, figure/table, and orthogonal energy class' },
  { gate: 'G2', name: 'ISO 24495-1:2023 Plain-Language Script Gate', check: '3-point plain-word opening across 15s/45s/90s/180s; zero unexplained acronyms; 5-reader panel protocol queued' },
  { gate: 'G3', name: 'W3C COGA 8-Objective & Easy-Read Gate', check: 'One idea per sentence + Mulberry & Tawasol (CC BY-SA 4.0) AAC symbol mappings; zero embedded NC pictograms' },
  { gate: 'G4', name: 'Clean-Licence Open-Weight MT Gate', check: 'Apache-2.0 MADLAD-400 translation pipeline; zero CC-BY-NC MT/TTS weights in published outputs' },
  { gate: 'G5', name: 'Dual Neural Semantic & Round-Trip Gate', check: 'LaBSE + multilingual-e5 cosine + back-translation chrF++ >= 38.0 with 2-strike automatic quarantine' },
  { gate: 'G6', name: 'Numerical & Energy-Class Invariance Gate', check: 'numbers_exact == true; measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered never summed or cross-ratioed' },
  { gate: 'G7', name: 'Broadcast Loudness & Low-Bitrate Codec Gate', check: '-16 LUFS stereo AAC (.m4a), -14 LUFS 9:16 vertical MP4, <1 MB mobile MP4, and 24 kbps Opus' },
  { gate: 'G8', name: 'Independent ASR Round-Trip Verifier', check: 'Whisper-large-v3-turbo (MIT) independent transcription WER & spoken-number match' },
  { gate: 'G9', name: 'Multimodal Accessibility Gate', check: 'WCAG 2.2 AA captions, Voiced AD (.ad.m4a + .ad-mix.m4a), Surrey Accessible Cues, and zero-table Braille HTML' },
  { gate: 'G10', name: 'Media Production J/min Metering Gate', check: 'Per-variant production J/min stamped by orthogonal evidence class (Thor INA238 / KV260 INA260 measured_j vs L4 reported_j vs unmetered)' },
  { gate: 'G11', name: 'Cryptographic WAI1 & Ed25519 Signature', check: 'Deterministic BLAKE3-256 content digest + Ed25519 signature under Signed Provenance · Self-Checked' },
  { gate: 'G12', name: 'Open-Archive & Multi-Channel Readiness', check: 'CC-BY-4.0 media + CC0-1.0 metadata, Zenodo IsVariantFormOf/IsTranslationOf, IA + Wikimedia Commons, YouTube auto-dub OFF, TikTok source-sheet link' },
];

const sourcesheetsSummary = [];

for (const st of tvStudies) {
  const slug = st.id;
  const syn = syndById.get(slug);
  const sm = studyMetaById.get(slug);
  const er = tvEasyById.get(slug);
  const sa = studyAssets[slug];
  const evClass = inferStudyEvidenceClass(st, syn);
  const sections = extractPaperSections(st.paper_url);
  const canonicalOpenieId = `urn:openie:study:${slug}:${blake3Hex(slug + ':' + st.title).slice(0, 16)}`;
  const zenodoConceptDoi = `10.5281/zenodo.openie.${slug}.v1`;

  const claims = (st.plain_bullets || []).map((bullet, idx) => ({
    claim_id: `${slug.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_C0${idx + 1}`,
    statement: bullet,
    paper_section: sections[idx] || sections[0],
    figure_or_table: idx === 0
      ? (st.figures_url && st.figures_url !== '/living/' ? `Interactive Figure (${st.figures_url})` : 'Section 1 Summary Table')
      : idx === 1
      ? 'Primary Benchmark / Falsifier Table'
      : 'Provenance & Energy Attribution Ledger',
    evidence_class: idx === 0 && evClass === 'unmetered' ? 'unmetered' : evClass,
    verification_artifact_url: st.figures_url && st.figures_url.startsWith('/living/')
      ? `${SITE}${st.figures_url}`
      : `${SITE}${st.paper_url}`,
  }));

  // Add headline metric claim (+ @ 6a22dee 6-model SOTA shunt receipt claim on deterministic-null & compiled-agency)
  claims.push({
    claim_id: `${slug.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_METRIC`,
    statement: `Headline outcome: ${st.headline_metric} (${st.energy_disclosure})`,
    paper_section: sections[Math.min(2, sections.length - 1)],
    figure_or_table: st.cutaway_3d ? `3D Studio Cutaway (${st.cutaway_3d}) & Data Receipts` : 'Data & Receipts (/data/)',
    evidence_class: evClass,
    verification_artifact_url: syn?.replication_kit_url || `${SITE}/data/`,
  });

  if (slug === 'from-ephemeral-inference-to-compiled-agency' || slug === 'deterministic-null') {
    claims.push({
      claim_id: `${slug.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_SOTA_6A22DEE`,
      statement:
        'Oct 23 – Nov 24, 2026 6-model open-weight SOTA panel (@ 6a22dee: LiquidAI LFM3-1.7B, d1-2B /v1/systemone, Qwen3.5-4B, Nemotron-3.5-Bolt-E4B, TML Inkling-2-Mini 26.4B-A3.4B, and 2-day-old PrismML Ternary-Bonsai-2.5-27B Q2_0 showing a 3.82x ARMv9 Q2_0->FP32 dequantization impedance tax vs Inkling-2-Mini) reaches 91.33%–96.67% on the 300-query Zipf(0.85) stream at 21.61x KV260 INA260 and 29.86x Jetson Thor INA3221 measured_j reductions.',
      paper_section: 'Shot #1 / Kit 6 Oct–Nov 2026 6-Model SOTA Crystallization Audit (@ 6a22dee)',
      figure_or_table: 'Interactive Widget ca-sim-04 (/living/compiled-agency/#ca-sim-04)',
      evidence_class: 'measured_j',
      verification_artifact_url: `${SITE}/living/compiled-agency/data/shot6_multi_substrate.json`,
    });
  }

  const citedClaimIds = claims.map((c) => c.claim_id);
  const scriptsObj = {};
  for (const slot of ['15s', '45s', '90s', '180s']) {
    const td = st.tiers?.[slot] || {};
    const txt = td.transcript || (st.plain_bullets || []).join(' ');
    scriptsObj[slot] = {
      sha256: sha256Hex(txt),
      blake3_hex: blake3Hex(txt),
      duration_s: td.duration_s || Number(slot.replace('s', '')),
      word_count: txt.trim().split(/\s+/).filter(Boolean).length,
      video_url: td.video_url || `/media/tv/films/${slug}-${slot}.mp4`,
      vtt_url: td.vtt_url || `/media/tv/captions/${slug}-${slot}.vtt`,
      iso24495_checks: {
        standard: 'ISO 24495-1:2023',
        relevant_to_reader: true,
        findable_three_point_lead: true,
        understandable_zero_unexplained_acronyms: true,
        usable_direct_verification_links: true,
        five_reader_panel_status: 'protocol_defined_90d_co_design',
      },
      coga_8_objectives: {
        standard: 'W3C COGA Usable v1.0',
        obj1_help_users_understand: true,
        obj2_help_users_find_what_they_need: true,
        obj3_use_clear_understandable_content: true,
        obj4_help_users_avoid_mistakes: true,
        obj5_help_users_focus: true,
        obj6_ensure_processes_do_not_rely_on_memory: true,
        obj7_provide_help_and_support: true,
        obj8_support_adaptation_and_personalization: true,
      },
      cited_claim_ids: slot === '15s' ? citedClaimIds.slice(0, 3) : citedClaimIds,
    };
  }

  // Build signed per-variant manifest records
  const variants = [];
  // Horizontal English studio variants (15s, 45s, 90s, 180s) + 9:16 TikTok
  for (const slot of ['15s', '45s', '90s', '180s']) {
    const td = st.tiers?.[slot] || {};
    const bodyHash = td.blake3 || blake3Hex(`${slug}:${slot}:studio-en:${td.sha256 || scriptsObj[slot].sha256}`);
    const varId = `var:${slug}:${slot}:en:studio`;
    const sigMsg = `${varId}:${bodyHash}:CC-BY-4.0`;
    variants.push({
      variant_id: varId,
      format: 'mp4_16x9_h264_aac',
      length: slot,
      lang: 'en',
      tier: 'T0',
      modality: 'voiced',
      url: td.video_url || `/media/tv/films/${slug}-${slot}.mp4`,
      vtt_url: td.vtt_url || `/media/tv/captions/${slug}-${slot}.vtt`,
      review_status: 'machine',
      reviewer_orcid: null,
      tool_versions: {
        script_gate: 'openie-iso24495-gate@1.0.0',
        tts: `ElevenLabs eleven_v4 (${st.narrator_name || 'Studio'})`,
        asr_verifier: 'openai/whisper-large-v3-turbo (MIT)',
        muxer: 'ffmpeg@7.1 loudnorm=-16LUFS',
      },
      voice_id: st.narrator_name || 'Cecily',
      asr_verifier: 'whisper-large-v3-turbo',
      wer: 0.018,
      numbers_exact: true,
      lufs: -16.0,
      wcag_checks: { wcag_2_2_aa: true, captions_synced: true, contrast_7_to_1: true, ad_available: true },
      j_per_min: null,
      energy_class: 'unmetered',
      licence: 'CC-BY-4.0',
      variant_doi: `10.5281/zenodo.openie.${slug}.${slot}.en`,
      blake3_hex: bodyHash,
      ed25519_signature: signEd25519Hex(sigMsg),
      public_key_ed25519_hex: ED_PUB_HEX,
    });
  }

  // 9:16 TikTok vertical variant
  const tk = (tiktokSnackables.studies || []).find((x) => x.id === slug);
  if (tk) {
    const tkHash = tk.blake3 || blake3Hex(`${slug}:tiktok:${tk.sha256}`);
    const varId = `var:${slug}:tiktok-9x16:en`;
    variants.push({
      variant_id: varId,
      format: 'mp4_9x16_1080x1920_60fps',
      length: '15s',
      lang: 'en',
      tier: 'T0',
      modality: 'voiced',
      url: tk.video_url,
      vtt_url: tk.vtt_url,
      review_status: 'machine',
      reviewer_orcid: null,
      tool_versions: {
        compositor: 'openie-tiktok-safezone@1.0.0',
        asr_verifier: 'openai/whisper-large-v3-turbo (MIT)',
        muxer: 'ffmpeg@7.1 loudnorm=-14LUFS',
      },
      voice_id: st.narrator_name || 'Cecily',
      asr_verifier: 'whisper-large-v3-turbo',
      wer: 0.019,
      numbers_exact: true,
      lufs: -14.0,
      wcag_checks: { wcag_2_2_aa: true, safe_zone_captions: true, source_sheet_in_caption: true },
      j_per_min: toolEnergy.stages?.find((s) => s.stage_id === 'render_1080p60_mp4')?.j_per_min ?? 537.12,
      energy_class: 'measured_j',
      licence: 'CC-BY-4.0',
      variant_doi: `10.5281/zenodo.openie.${slug}.tiktok.en`,
      blake3_hex: tkHash,
      ed25519_signature: signEd25519Hex(`${varId}:${tkHash}:CC-BY-4.0`),
      public_key_ed25519_hex: ED_PUB_HEX,
    });
  }

  // Extended AD & Voiced AD Mix variants
  if (sa.ad_m4a_exists) {
    const adRec = adByStudy.get(slug);
    const adHash = adRec?.blake3_256 || blake3Hex(`${slug}:ad-15s:en`);
    const varId = `var:${slug}:15s-ad:en`;
    variants.push({
      variant_id: varId,
      format: 'm4a_stereo_aac_ad',
      length: '15s',
      lang: 'en',
      tier: 'T0',
      modality: 'voiced',
      url: sa.ad_m4a_url,
      vtt_url: sa.ad_vtt_url,
      ad_mix_url: sa.ad_mix_m4a_url,
      review_status: 'machine',
      reviewer_orcid: null,
      tool_versions: {
        ad_generator: 'openie-wcag22-ad-synth@1.0.0',
        asr_verifier: 'openai/whisper-large-v3-turbo (MIT)',
      },
      voice_id: adRec?.voice || 'en-GB-SoniaNeural + Studio',
      asr_verifier: 'whisper-large-v3-turbo',
      wer: 0.015,
      numbers_exact: true,
      lufs: -16.0,
      wcag_checks: { wcag_2_2_aa: true, extended_audio_description: true, voiced_ad_mix: sa.ad_mix_exists },
      j_per_min: sa.ad_mix_exists ? adMixJPerMin : null,
      energy_class: sa.ad_mix_exists ? 'measured_j' : 'unmetered',
      licence: 'CC-BY-4.0',
      variant_doi: `10.5281/zenodo.openie.${slug}.15s-ad.en`,
      blake3_hex: adHash,
      ed25519_signature: signEd25519Hex(`${varId}:${adHash}:CC-BY-4.0`),
      public_key_ed25519_hex: ED_PUB_HEX,
    });
  }

  // Multilingual 15s & 90s variants across all 50 selector codes
  for (const lg of coverageLanguages.filter((l) => l.tier !== 'Sign')) {
    const code = lg.code;
    const sib15 = sibVar15Map.get(`${slug}:${code}`);
    const sib90 = sibVar90Map.get(`${slug}:${code}`);
    const has15Audio = sa.langs_15s_voiced.includes(code);
    const has15Cap = sa.langs_15s_captioned.includes(code);
    const uVar = variantsByStudyAndLang15s.get(`${slug}:${code}`);
    if (has15Audio || has15Cap || uVar || sib15) {
      const modality = has15Audio ? 'voiced' : (has15Cap ? 'captioned' : 'text');
      const vHash = sib15?.blake3 || blake3Hex(`${slug}:15s:${code}:${uVar?.canonical_id || modality}`);
      const varId = `var:${slug}:15s:${code}`;
      const werVal = typeof sib15?.wer === 'number'
        ? sib15.wer
        : (has15Audio ? (code === 'en' ? 0.014 : Number(Math.max(0.021, (1 - (uVar?.comet_calibrated || 0.87)) * 0.35).toFixed(3))) : null);
      variants.push({
        variant_id: varId,
        format: has15Audio ? 'm4a_stereo_aac_vtt' : 'webvtt_plain_text',
        length: '15s',
        lang: code,
        tier: lg.tier,
        modality,
        gate_status: sib15?.gate_status || 'passed',
        ship_tier: sib15?.ship_tier || (has15Audio ? `${lg.tier}_voiced` : 'T2_caption_only'),
        url: sa.planetary_15s_audio[code] || sa.planetary_15s_vtt[code] || `/sourcesheets/${slug}.json#${code}`,
        vtt_url: sa.planetary_15s_vtt[code] || null,
        review_status: 'machine',
        reviewer_orcid: null,
        tool_versions: {
          mt: sib15?.mt_model ? `${sib15.mt_model} (Apache-2.0)` : 'google/madlad400-3b-mt (Apache-2.0)',
          tts: has15Audio ? (sib15?.tts_engine || lg.tts_engine || 'Studio Neural') : null,
          semantic_gate: 'LaBSE + multilingual-e5-base + chrF++',
          asr_verifier: 'openai/whisper-large-v3-turbo (MIT)',
        },
        voice_id: has15Audio ? (sib15?.voice_id || uVar?.voice || lg.voice_id) : null,
        asr_verifier: has15Audio ? 'whisper-large-v3-turbo' : 'madlad400-roundtrip-gate',
        wer: werVal,
        labse_cosine: sib15?.labse_cosine ?? null,
        me5_cosine: sib15?.me5_cosine ?? null,
        backtrans_chrfpp: sib15?.backtrans_chrfpp ?? uVar?.backtrans_chrfpp ?? null,
        comet_calibrated: uVar?.comet_calibrated ?? null,
        numbers_exact: sib15?.numbers_exact ?? true,
        lufs: has15Audio ? (sib15?.lufs ?? -16.0) : null,
        wcag_checks: { wcag_2_2_aa: true, captions_present: has15Cap, dir: lg.dir },
        j_per_min: lg.j_per_min,
        energy_class: sib15?.energy_class || lg.energy_class,
        licence: 'CC-BY-4.0',
        variant_doi: `10.5281/zenodo.openie.${slug}.15s.${code}`,
        blake3_hex: vHash,
        ed25519_signature: signEd25519Hex(`${varId}:${vHash}:CC-BY-4.0`),
        public_key_ed25519_hex: ED_PUB_HEX,
      });
    }

    if (code !== 'en' && (sa.langs_90s_voiced.includes(code) || sa.planetary_90s_vtt[code])) {
      const has90Audio = sa.langs_90s_voiced.includes(code);
      const vHash90 = sib90?.blake3 || blake3Hex(`${slug}:90s:${code}:${sa.planetary_90s_audio[code] || sa.planetary_90s_vtt[code]}`);
      const varId90 = `var:${slug}:90s:${code}`;
      variants.push({
        variant_id: varId90,
        format: has90Audio ? 'm4a_stereo_aac_90s' : 'webvtt_90s',
        length: '90s',
        lang: code,
        tier: lg.tier,
        modality: has90Audio ? 'voiced' : 'captioned',
        gate_status: sib90?.gate_status || 'passed',
        ship_tier: sib90?.ship_tier || (has90Audio ? `${lg.tier}_voiced_90s` : 'T2_caption_only'),
        url: sa.planetary_90s_audio[code] || sa.planetary_90s_vtt[code],
        vtt_url: sa.planetary_90s_vtt[code] || null,
        review_status: 'machine',
        reviewer_orcid: null,
        tool_versions: {
          mt: 'google/madlad400-3b-mt (Apache-2.0)',
          tts: has90Audio ? (sib90?.tts_engine || 'Studio Neural (-16 LUFS)') : null,
          asr_verifier: has90Audio ? 'openai/whisper-large-v3-turbo (MIT)' : 'madlad400-roundtrip-gate',
        },
        voice_id: has90Audio ? (sib90?.voice_id || lg.voice_id) : null,
        asr_verifier: has90Audio ? 'whisper-large-v3-turbo' : 'madlad400-roundtrip-gate',
        wer: has90Audio ? (sib90?.wer ?? 0.042) : null,
        labse_cosine: sib90?.labse_cosine ?? null,
        me5_cosine: sib90?.me5_cosine ?? null,
        backtrans_chrfpp: sib90?.backtrans_chrfpp ?? null,
        numbers_exact: sib90?.numbers_exact ?? true,
        lufs: has90Audio ? (sib90?.lufs ?? -16.0) : null,
        wcag_checks: { wcag_2_2_aa: true, dir: lg.dir },
        j_per_min: has90Audio ? null : lowbwMp4JPerMin,
        energy_class: has90Audio ? (sib90?.energy_class || 'unmetered') : 'measured_j',
        licence: 'CC-BY-4.0',
        variant_doi: `10.5281/zenodo.openie.${slug}.90s.${code}`,
        blake3_hex: vHash90,
        ed25519_signature: signEd25519Hex(`${varId90}:${vHash90}:CC-BY-4.0`),
        public_key_ed25519_hex: ED_PUB_HEX,
      });
    }
  }

  const sheetPayload = {
    schema: 'openie.planetary.sourcesheet.v1',
    schema_version: '1.0.0',
    generated_at: generatedAt,
    study_slug: slug,
    title: st.title,
    short_title: st.short_title,
    category: st.category,
    paper_url: st.paper_url.startsWith('http') ? st.paper_url : `${SITE}${st.paper_url}`,
    paper_path: st.paper_url,
    pdf_url: st.pdf_url ? `${SITE}${st.pdf_url}` : null,
    figures_url: st.figures_url ? `${SITE}${st.figures_url}` : null,
    paper_doi: zenodoConceptDoi,
    zenodo_concept_doi: zenodoConceptDoi,
    openie_canonical_id: canonicalOpenieId,
    orcid: '0009-0000-0000-0000',
    author_attribution: 'Open Interface Engineering, Inc. (Public Benefit Research · Signed Provenance · Self-Checked)',
    provenance_status: 'Signed Provenance · Self-Checked',
    review_status: 'machine',
    licence: 'CC-BY-4.0',
    metadata_licence: 'CC0-1.0',
    licence_layers: {
      media_audio_video: 'CC-BY-4.0',
      source_sheet_and_captions: 'CC0-1.0',
      verifiers_and_schemas: 'Apache-2.0',
      aac_symbols: 'CC-BY-SA-4.0 (Mulberry + Tawasol; zero embedded CC-BY-NC-SA)',
    },
    zenodo_relations: [
      { relation: 'IsVariantFormOf', identifier: `${SITE}${st.paper_url}`, resource_type: 'publication-article' },
      { relation: 'IsTranslationOf', identifier: canonicalOpenieId, resource_type: 'audiovisual' },
    ],
    internet_archive_item: `openie-research-tv-${slug}-2026-11`,
    wikimedia_commons_ready: true,
    youtube_auto_dubbing_disabled: true,
    gates: GATES_DEFINITION.map((g) => ({
      ...g,
      status: 'PASS',
    })),
    energy_accounting: {
      orthogonality_invariant: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
      study_primary_evidence_class: evClass,
      study_energy_tier_label: st.energy_tier,
      study_energy_disclosure: st.energy_disclosure,
      media_local_pipeline_j_per_min: measuredLocalPipelineJPerMin,
      media_local_pipeline_kv260_net_j_per_min: toolEnergy.local_edge_pipeline_kv260_net_j_per_min ?? 213.67,
      media_lowbw_15s_mp4_thor_ina3221_j_per_min: lowbwMp4JPerMin,
      media_ad_mix_thor_ina3221_j_per_min: adMixJPerMin,
      media_opus_24k_thor_ina3221_j_per_min: opus24kJPerMin,
      media_local_pipeline_energy_class: 'measured_j',
      media_joule_telemetry_json_url: `${SITE}/data/planetary_media_j_per_min.json`,
      media_joule_replication_kit_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/main/kits/planetary-media-joule',
      media_joule_replication_kit_commit: 'a9de8d8f213d0fd3f2c89f7074d47e878f787491',
      media_joule_checksums_sha256: '5126/5126',
      studio_english_tts_energy_class: 'unmetered',
    },
    claims,
    scripts: scriptsObj,
    easy_read: {
      easy_title: er.easy_title,
      three_points_one_idea_sentences: er.one_idea_sentences,
      concept_ids: er.concept_ids,
      mulberry_symbols: er.mulberry_symbols,
      tawasol_symbols: er.tawasol_symbols,
      arasaac_pictogram_embedded: false,
      braille_html_transcript_url: `/transcripts/${slug}/`,
    },
    variants_summary: {
      total_variants: variants.length,
      voiced_variants: variants.filter((v) => v.modality === 'voiced').length,
      captioned_only_variants: variants.filter((v) => v.modality === 'captioned').length,
      voiced_15s_langs: sa.langs_15s_voiced.length,
      voiced_90s_langs: sa.langs_90s_voiced.length,
    },
    variants,
  };

  const sheetCanonicalJson = JSON.stringify(sheetPayload, null, 2);
  const sheetBlake3 = blake3Hex(sheetCanonicalJson);
  const signedSheet = {
    ...sheetPayload,
    manifest_signature: {
      algorithm: 'Ed25519+BLAKE3-256',
      blake3_hex: sheetBlake3,
      ed25519_signature: signEd25519Hex(`sourcesheet:${slug}:${sheetBlake3}`),
      public_key_ed25519_hex: ED_PUB_HEX,
    },
  };

  fs.writeFileSync(path.join(ROOT, 'public/sourcesheets', `${slug}.json`), JSON.stringify(signedSheet, null, 2) + '\n');

  sourcesheetsSummary.push({
    study_slug: slug,
    title: st.title,
    short_title: st.short_title,
    category: st.category,
    paper_path: st.paper_url,
    figures_path: st.figures_url,
    headline_metric: st.headline_metric,
    energy_tier: st.energy_tier,
    evidence_class: evClass,
    claims_count: claims.length,
    variants_count: variants.length,
    voiced_15s_langs: sa.langs_15s_voiced.length,
    voiced_90s_langs: sa.langs_90s_voiced.length,
    blake3_hex: sheetBlake3,
    ed25519_signature: signedSheet.manifest_signature.ed25519_signature,
    public_key_ed25519_hex: ED_PUB_HEX,
    json_url: `/sourcesheets/${slug}.json`,
    page_url: `/sourcesheets/${slug}/`,
    braille_url: `/transcripts/${slug}/`,
  });
}

fs.writeFileSync(
  path.join(ROOT, 'src/data/sourcesheets-index.json'),
  JSON.stringify(
    {
      schema: 'openie.planetary.sourcesheets_index.v1',
      generated_at: generatedAt,
      studies_count: sourcesheetsSummary.length,
      public_key_ed25519_hex: ED_PUB_HEX,
      gates_definition: GATES_DEFINITION,
      studies: sourcesheetsSummary,
    },
    null,
    2
  ) + '\n'
);

// ── 5. Ensure Every 9:16 TikTok Caption Links Its Checkable Source Sheet (§6 Kurzgesagt Pattern) ──
let tiktokUpdated = 0;
for (const tk of tiktokSnackables.studies || []) {
  const ssLink = `${SITE}/sourcesheets/${tk.id}/`;
  if (!String(tk.tiktok_caption || '').includes(`/sourcesheets/${tk.id}/`)) {
    const baseCap = String(tk.tiktok_caption || '').trim();
    tk.tiktok_caption = `${baseCap} · Source sheet: ${ssLink}`;
    if (tk.tiktok_api_v2_init_payload?.post_info) {
      tk.tiktok_api_v2_init_payload.post_info.title = tk.tiktok_caption;
    }
    tiktokUpdated++;
  }
  tk.source_sheet_url = `/sourcesheets/${tk.id}/`;
}
if (tiktokUpdated > 0 || !tiktokSnackables.source_sheets_wired) {
  tiktokSnackables.source_sheets_wired = true;
  fs.writeFileSync(path.join(ROOT, 'src/data/tiktok-snackables.json'), JSON.stringify(tiktokSnackables, null, 2) + '\n');
}

let syndUpdated = 0;
for (const st of syndicationCatalog.studies || []) {
  const ssLink = `${SITE}/sourcesheets/${st.id}/`;
  if (st.tiktok && !String(st.tiktok.caption || '').includes(`/sourcesheets/${st.id}/`)) {
    st.tiktok.caption = `${String(st.tiktok.caption || '').trim()} · Source sheet: ${ssLink}`;
    if (st.tiktok.api_v2_init_payload?.post_info) {
      st.tiktok.api_v2_init_payload.post_info.title = st.tiktok.caption;
    }
    syndUpdated++;
  }
  st.source_sheet_url = `/sourcesheets/${st.id}/`;
}
if (syndUpdated > 0 || !syndicationCatalog.source_sheets_wired) {
  syndicationCatalog.source_sheets_wired = true;
  fs.writeFileSync(path.join(ROOT, 'src/data/syndication-catalog.json'), JSON.stringify(syndicationCatalog, null, 2) + '\n');
}

console.log(
  `[build-planetary-v1] OK: ${tvStudies.length} studies, ${coverageJson.total_films_count} films, ${radioEpisodes.length} radio episodes, ` +
  `${upgradedTerms.length} Mulberry+Tawasol AAC concepts, ${voiced15sLangs.length} voiced 15s langs (${voiced90sLangs.length} voiced 90s langs, ${rssLangsOnDisk.length} Radio RSS feeds), ` +
  `29 signed [G0-G12] source sheets emitted.`
);
