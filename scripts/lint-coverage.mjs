#!/usr/bin/env node
/**
 * Planetary Research Media Blueprint v1.0 — Coverage, Source-Sheet, AAC Licence & Braille Build Gate (§1 & §9.1).
 * Fails the build if:
 *   1. public/coverage.json or src/data/coverage-summary.json is missing or inconsistent with catalogs.
 *   2. Any page in src/pages, src/components, src/layouts (or built dist/ HTML) makes stale/mismatched
 *      coverage claims ("47-Language", "47 languages", "20 voiced", "112 Plain-Language", "140 films", "28/28").
 *   3. Any of the 29 studies lacks public/sourcesheets/<slug>.json with [G0-G12] gates and Ed25519 signatures,
 *      or lacks its source-sheet link in tiktok-snackables.json / syndication-catalog.json.
 *   4. public/glossary/concepts.json lacks Mulberry + Tawasol (CC-BY-SA-4.0) or embeds ARASAAC NC assets.
 *   5. When dist/ exists, dist/transcripts/** contains any layout <table> element.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fail(errs) {
  console.error(`coverage lint: FAILED with ${errs.length} problem(s):`);
  for (const e of errs) console.error('  - ' + e);
  process.exit(1);
}

const errs = [];

const covPath = path.join(ROOT, 'public/coverage.json');
const sumPath = path.join(ROOT, 'src/data/coverage-summary.json');
if (!fs.existsSync(covPath)) errs.push('public/coverage.json is missing');
if (!fs.existsSync(sumPath)) errs.push('src/data/coverage-summary.json is missing');
if (errs.length) fail(errs);

const cov = JSON.parse(fs.readFileSync(covPath, 'utf8'));
const tv = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/tv-catalog.json'), 'utf8'));
const rf = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/radio-feed.json'), 'utf8'));
const tk = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/tiktok-snackables.json'), 'utf8'));
const syn = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/syndication-catalog.json'), 'utf8'));
const concepts = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/glossary/concepts.json'), 'utf8'));

if (cov.schema_version !== '1.0.0') errs.push(`coverage.json schema_version expected "1.0.0", got "${cov.schema_version}"`);
if (cov.studies_count !== tv.studies.length || cov.studies_count !== 29) {
  errs.push(`coverage.json studies_count (${cov.studies_count}) mismatches tv-catalog (${tv.studies.length})`);
}
if (cov.horizontal_films_count !== 116 || cov.vertical_films_count !== 29 || cov.total_films_count !== 145) {
  errs.push(`coverage.json film counts expected 116 + 29 = 145, got ${cov.horizontal_films_count} + ${cov.vertical_films_count} = ${cov.total_films_count}`);
}
if (cov.radio_episodes_count !== rf.episodes.length || cov.radio_episodes_count !== 17) {
  errs.push(`coverage.json radio_episodes_count (${cov.radio_episodes_count}) mismatches radio-feed (${rf.episodes.length})`);
}
if (cov.tiers?.T0?.count !== 12 || cov.tiers?.T1?.count !== 19 || cov.tiers?.Sign?.count !== 5) {
  errs.push(`coverage.json tiers expected T0=12, T1=19, Sign=5`);
}
if (cov.tiers?.Sign?.status !== 'co_design_pending') {
  errs.push(`coverage.json Sign tier must carry status "co_design_pending"`);
}
if (!Array.isArray(cov.languages) || cov.languages.length !== 55) {
  errs.push(`coverage.json languages[] expected 55 entries (50 selector codes + 5 Sign), got ${cov.languages?.length}`);
}

// Verify concepts.json v1.1.0 (38 concepts, Mulberry + Tawasol CC-BY-SA-4.0, zero ARASAAC embedded)
if (concepts.version !== '1.1.0' || concepts.conceptCount !== 38 || (concepts.hasDefinedTerm || []).length !== 38) {
  errs.push(`public/glossary/concepts.json expected v1.1.0 with 38 concepts, got v${concepts.version} (${concepts.conceptCount})`);
}
for (const c of concepts.hasDefinedTerm || []) {
  const sh = c.symbolHint || {};
  if (!sh.mulberrySymbolId || !sh.tawasolSymbolId || sh.symbolLicense !== 'CC-BY-SA-4.0') {
    errs.push(`concept ${c.id} missing Mulberry/Tawasol CC-BY-SA-4.0 mapping`);
  }
  if (sh.arasaacPictogramEmbedded !== false || 'arasaacKeyword' in sh) {
    errs.push(`concept ${c.id} must set arasaacPictogramEmbedded=false and demote arasaacKeyword to arasaacKeywordHintOnly`);
  }
}

// Verify all 29 [G0-G12] source sheets + TikTok captions
for (const st of tv.studies) {
  const ssPath = path.join(ROOT, 'public/sourcesheets', `${st.id}.json`);
  if (!fs.existsSync(ssPath)) {
    errs.push(`missing source sheet public/sourcesheets/${st.id}.json`);
    continue;
  }
  const ss = JSON.parse(fs.readFileSync(ssPath, 'utf8'));
  if (!Array.isArray(ss.gates) || ss.gates.length !== 13) errs.push(`sourcesheet ${st.id} must have 13 [G0-G12] gates`);
  if (!Array.isArray(ss.claims) || ss.claims.length < 3) errs.push(`sourcesheet ${st.id} must have >= 3 structured claims`);
  if (!Array.isArray(ss.variants) || ss.variants.length < 5) errs.push(`sourcesheet ${st.id} must have per-variant signed records`);
  if (!ss.manifest_signature?.ed25519_signature || !ss.manifest_signature?.blake3_hex) {
    errs.push(`sourcesheet ${st.id} missing Ed25519 + BLAKE3 manifest_signature`);
  }
}

for (const t of tk.studies || []) {
  if (!String(t.tiktok_caption || '').includes(`/sourcesheets/${t.id}/`)) {
    errs.push(`tiktok-snackables.json ${t.id} caption missing /sourcesheets/${t.id}/ link`);
  }
}
for (const s of syn.studies || []) {
  if (!String(s.tiktok?.caption || '').includes(`/sourcesheets/${s.id}/`)) {
    errs.push(`syndication-catalog.json ${s.id} tiktok.caption missing /sourcesheets/${s.id}/ link`);
  }
}

// Scan UI source files for forbidden stale coverage claims
const FORBIDDEN_PATTERNS = [
  [/\b47-Language\b|\b47\s+Active\s+Languages\b/i, 'stale "47-Language" claim (must derive from coverage.json)'],
  [/\b20\s+voiced\b/i, 'stale "20 voiced" claim (must derive from coverage.json)'],
  [/\b112\s+Plain-Language\b|\b112\s+films\b/i, 'stale "112 films" claim (catalog has 116 horizontal + 29 vertical = 145)'],
  [/\bResearch TV\s*\(140\s+films\)/i, 'stale "140 films" claim (catalog has 145 films)'],
  [/\b28\s*\/\s*28(?!\s*(?:<\/code>\s*)?hardware)\b|\bAll\s+28\s+Studies\b|\b28-Study\b/i, 'stale "28/28" study count (catalog has 29 studies)'],
];

function walkFiles(dir, extRe, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, extRe, out);
    else if (extRe.test(ent.name)) out.push(p);
  }
  return out;
}

const uiFiles = [
  ...walkFiles(path.join(ROOT, 'src/pages'), /\.(astro|ts)$/),
  ...walkFiles(path.join(ROOT, 'src/components'), /\.(astro|ts)$/),
  ...walkFiles(path.join(ROOT, 'src/layouts'), /\.(astro|ts)$/),
];

for (const f of uiFiles) {
  const rel = path.relative(ROOT, f).split(path.sep).join('/');
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  lines.forEach((ln, idx) => {
    for (const [re, msg] of FORBIDDEN_PATTERNS) {
      if (re.test(ln)) {
        errs.push(`${rel}:${idx + 1}: ${msg}`);
      }
    }
  });
}

// If dist/ exists, verify dist/transcripts/ has 46 semantic HTML transcripts and ZERO <table> elements
const distTranscripts = path.join(ROOT, 'dist/transcripts');
if (fs.existsSync(distTranscripts)) {
  const trHtmls = walkFiles(distTranscripts, /\.html$/);
  if (trHtmls.length < 47) {
    errs.push(`dist/transcripts expected >= 47 HTML pages (index + 29 TV + 17 Radio), found ${trHtmls.length}`);
  }
  for (const tf of trHtmls) {
    const html = fs.readFileSync(tf, 'utf8');
    if (/<table[\s>]/i.test(html)) {
      errs.push(`${path.relative(ROOT, tf)}: Deafblind Braille HTML transcript must contain zero <table> elements`);
    }
  }
}

if (errs.length) fail(errs);
console.log(
  `coverage lint: CLEAN (${cov.studies_count} studies, ${cov.total_films_count} films, ${cov.radio_episodes_count} radio episodes, ` +
  `${cov.totals.voiced_15s_languages_count} voiced / ${cov.spoken_selector_codes_count} selector langs, 29 [G0-G12] source sheets, 38 Mulberry+Tawasol concepts)`
);
