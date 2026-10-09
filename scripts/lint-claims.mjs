#!/usr/bin/env node
// Pre-publish status lint. Status words may appear in public copy only where
// the claim ledger (src/data/claim-ledger.json) licenses them. Each ledger
// entry names a status, a reason, the files it covers, and a pattern; a
// status word is licensed when it lies inside a match of a covering entry.
// Unlicensed status words fail the build.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/claim-ledger.json'), 'utf8'));
const WORDS = new RegExp(ledger.status_words, 'g');

const TARGETS = [
  'src/content', 'src/includes', 'src/pages', 'src/layouts', 'src/components',
  'src/data/studies.json', 'public/llms.txt', 'public/webmcp-tools.js',
];
const EXT = /\.(md|astro|json|txt|js|ts)$/;

function walk(p, out) {
  const abs = path.join(ROOT, p);
  if (!fs.existsSync(abs)) return;
  const st = fs.statSync(abs);
  if (st.isDirectory()) {
    for (const f of fs.readdirSync(abs)) walk(path.join(p, f), out);
  } else if (EXT.test(p)) out.push(p.split(path.sep).join('/'));
}

function globToRe(g) {
  return new RegExp('^' + g.split('**').map((part) =>
    part.split('*').map((x) => x.replace(/[.+^${}()|[\]\\?]/g, '\\$&')).join('[^/]*')
  ).join('.*') + '$');
}

const entries = ledger.entries.map((e) => ({
  ...e,
  fileRes: (e.files || ['**']).map(globToRe),
  re: new RegExp(e.pattern, 'g' + (e.flags || '')),
}));

const files = [];
for (const t of TARGETS) walk(t, files);

let bad = 0;
const used = new Set();
for (const f of files) {
  const lines = fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n');
  const mine = entries.filter((e) => e.fileRes.some((r) => r.test(f)));
  lines.forEach((line, i) => {
    const hits = [...line.matchAll(WORDS)];
    if (!hits.length) return;
    const spans = [];
    for (const e of mine) {
      e.re.lastIndex = 0;
      for (const m of line.matchAll(e.re)) {
        spans.push([m.index, m.index + m[0].length, e.id]);
      }
    }
    for (const h of hits) {
      const a = h.index, b = h.index + h[0].length;
      const lic = spans.find(([s, t]) => s <= a && b <= t);
      if (lic) { used.add(lic[2]); continue; }
      bad++;
      const ctx = line.slice(Math.max(0, a - 70), Math.min(line.length, b + 70)).trim();
      console.error(`${f}:${i + 1}: unlicensed "${h[0]}"  …${ctx}…`);
    }
  });
}
const unused = entries.filter((e) => !used.has(e.id)).map((e) => e.id);
if (unused.length) console.warn(`claim lint: ledger entries with no match: ${unused.join(', ')}`);
if (bad) {
  console.error(`claim lint: ${bad} status word(s) not licensed by src/data/claim-ledger.json`);
  process.exit(1);
}
console.log(`claim lint: ${files.length} files clean against ${entries.length} ledger entries`);
