#!/usr/bin/env node
// Define-before-use check on built HTML (David's rule: readers read top to bottom, so nothing
// may be referenced before it is introduced, and numbered labels must ascend as a reader meets them).
// Usage: node scripts/lint-order.mjs [dist/path/index.html ...]  (default: the pages in PAGES)
// Checks, in rendered reading order from the page title to the end of the article:
//  1. Families H#, RJ-F#, Phase #, W#, L#, Part #, Section #, Figure #: the first mention of each
//     number must come after the first mention of every lower number in the same family that the
//     page uses (so numbers ascend as met).
//  2. Citation families [B#], [C#], [T#] (inside square brackets): same ascending rule on first
//     citation, and every cited number must exist in the page's reference list.
//  3. Bare T# outside brackets is ambiguous with [T#] citations and is an error unless preceded by
//     "theorem"/"theorems"/"RCE paper" (labels of an external paper).
//  4. Acronyms (2+ capitals) outside reference lists: the first use must be expanded inline
//     ("X (expansion)", "(X)", "X, the/a ...", "X: ...", "X is a/the ...") or listed in an element
//     with id="terms" that appears before the first use.
import fs from 'node:fs';

const PAGES = ['dist/about/rce-jepa/index.html'];
const files = process.argv.slice(2).length ? process.argv.slice(2) : PAGES;

function textOf(html) {
  let s = html;
  s = s.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/g, ' ');
  s = s.replace(/<span class="katex-mathml">[\s\S]*?<\/math><\/span>/g, ' ');
  s = s.replace(/<nav[\s\S]*?<\/nav>|<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>/g, ' ');
  // mark reference lists and the terms list so acronym checks can skip/use them
  s = s.replace(/<(ol|ul)([^>]*)data-refs([^>]*)>/g, ' \u0001REFS ');
  s = s.replace(/<\/(ol|ul)>/g, ' \u0002 ');
  s = s.replace(/<[^>]*id="terms"[^>]*>/g, ' \u0003TERMS ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
       .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'");
  return s.replace(/\s+/g, ' ');
}

const IGNORE_ACR = new Set(['II','III','IV','VI','VII','VIII','IX','XI','XII','XIII','PDF','PNG','SVG','ID','OK','US']);

let failures = 0;
for (const f of files) {
  if (!fs.existsSync(f)) { console.error(`order lint: missing ${f}`); failures++; continue; }
  let raw = fs.readFileSync(f, 'utf8');
  // start after the page title (<h1>): the abstract right below it defines the title's acronyms
  const h1i = raw.indexOf('</h1>'); if (h1i > 0) raw = raw.slice(h1i + 5);
  let t = textOf(raw);
  const lastRefs = t.lastIndexOf('\u0001REFS'); if (lastRefs >= 0) { const e = t.indexOf('\u0002', lastRefs); if (e > 0) t = t.slice(0, e + 1); }
  const errs = [];
  // reference-list spans
  const refSpans = []; { const re = /\u0001REFS([\s\S]*?)\u0002/g; let m; while ((m = re.exec(t))) refSpans.push([m.index, re.lastIndex]); }
  const inRefs = (i) => refSpans.some(([a, b]) => i >= a && i < b);
  const termsAt = t.indexOf('\u0003TERMS');
  let termsText = '';
  if (termsAt >= 0) { const end = t.indexOf('\u0002', termsAt); termsText = t.slice(termsAt, end > 0 ? end : termsAt + 20000); }

  const ctx = (i) => t.slice(Math.max(0, i - 60), i + 60).replace(/[\u0001-\u0004]/g, '');
  function ascend(name, re, numOf, skip) {
    const first = new Map();
    let m;
    while ((m = re.exec(t))) {
      if (skip && skip(m)) continue;
      const n = numOf(m);
      // a range "X1 to X13" introduces every number in it at once
      const rng = t.slice(m.index, m.index + 40).match(/^\S*?(\d+)\]? to \[?([A-Za-z-]*?)(\d+)/);
      if (rng && +rng[2 + 1] > n && t.slice(m.index + m[0].length).startsWith(' to')) {
        for (let k = n; k <= +rng[3]; k++) if (!first.has(k)) first.set(k, m.index);
        re.lastIndex = m.index + rng[0].length; continue;
      }
      if (!first.has(n)) first.set(n, m.index);
    }
    const order = [...first.entries()].sort((a, b) => a[1] - b[1]);
    let maxSoFar = -Infinity;
    for (const [n, i] of order) {
      if (n < maxSoFar) errs.push(`${name}${n} first met after ${name}${maxSoFar}: …${ctx(i)}…`);
      maxSoFar = Math.max(maxSoFar, n);
    }
    return first;
  }
  ascend('H', /(?<![\w-])H(\d{1,2})(?![\d\w])/g, (m) => +m[1], (m) => /H100|H200/.test(t.slice(m.index, m.index + 4)) || inRefs(m.index));
  ascend('RJ-F', /RJ-F(\d+)/g, (m) => +m[1]);
  ascend('Phase ', /\bPhase (\d+)\b/g, (m) => +m[1]);
  ascend('W', /(?<![\w-])W(\d)(?!\w)/g, (m) => +m[1]);
  ascend('L', /\(L(\d)\)|(?<![\w-])L(\d)(?=\s|,|\)| to| and)/g, (m) => +(m[1] || m[2]), (m) => inRefs(m.index));
  ascend('Part ', /\bParts? (\d)\b/g, (m) => +m[1]);
  ascend('Section ', /\bSections? (\d)\b/g, (m) => +m[1], (m) => inRefs(m.index));
  ascend('Figure ', /\bFigure (\d+)\b/g, (m) => +m[1], (m) => inRefs(m.index) || /\[[^\]]*$/.test(t.slice(Math.max(0, m.index - 30), m.index)));
  for (const fam of ['B', 'C', 'T']) {
    const first = new Map(); const listed = new Set();
    const re = /\[([^\[\]]{1,200})\]/g; let m;
    while ((m = re.exec(t))) {
      const listEntry = inRefs(m.index) && new RegExp(`^${fam}(\\d+)$`).test(m[1].trim());
      if (listEntry) { listed.add(+m[1].trim().slice(1)); continue; }
      const rr = new RegExp(`(?:^|[\\s,;])${fam}(\\d+)(?![\\w-])`, 'g'); let k;
      while ((k = rr.exec(m[1]))) { const n = +k[1]; if (!first.has(n)) first.set(n, m.index); }
    }
    const order = [...first.entries()].sort((a, b) => a[1] - b[1]);
    let mx = 0;
    for (const [n, i] of order) { if (n < mx) errs.push(`[${fam}${n}] first cited after [${fam}${mx}]: …${ctx(i)}…`); mx = Math.max(mx, n); }
    for (const n of first.keys()) if (listed.size && !listed.has(n)) errs.push(`[${fam}${n}] cited but not in a reference list`);
  }
  // bare T#
  { const re = /(?<![\w\[,;-] ?)(?<![\w-])T(\d{1,2})(?![\w\]-])/g; let m;
    while ((m = re.exec(t))) {
      const before = t.slice(Math.max(0, m.index - 200), m.index);
      if (/\[[^\]]*$/.test(before.slice(-40))) continue; // inside brackets
      if (/theorems?\s*(T\d+[\s,()a-z-]*(and|,)\s*)*$|RCE paper[^.]*$/i.test(before)) continue;
      if (inRefs(m.index)) continue;
      errs.push(`bare T${m[1]} is ambiguous with [T#] citations: …${ctx(m.index)}…`);
    } }
  // acronyms
  { const seen = new Set(); const re = /(?<![\w-])([A-Z][A-Z0-9]*[A-Z][A-Z0-9]*)(?![\w])/g; let m;
    while ((m = re.exec(t))) {
      const a = m[1]; if (seen.has(a) || IGNORE_ACR.has(a) || /^\d/.test(a)) continue;
      if (inRefs(m.index)) continue;
      seen.add(a);
      if (termsAt >= 0 && m.index > termsAt && new RegExp(`(^|[^\\w])${a}([^\\w]|$)`).test(termsText)) continue;
      const after = t.slice(m.index + a.length, m.index + a.length + 40);
      const before = t.slice(Math.max(0, m.index - 3), m.index);
      if (/^[\s-]*\w*\s?\(/.test(after) || /\($/.test(before.trim()) || /^(,| is| means| stands)\s+(the|a|an)?\s?[a-z]/i.test(after) || /^:\s/.test(after)) continue;
      errs.push(`acronym ${a} used before it is defined: …${ctx(m.index)}…`);
    } }
  if (errs.length) { failures += errs.length; console.error(`order lint: ${f}: ${errs.length} problem(s)`); for (const e of errs) console.error('  - ' + e); }
  else console.log(`order lint: ${f} clean`);
}
process.exit(failures ? 1 : 0);
