#!/usr/bin/env node
// Publish guard: fail the build when source or built HTML contains writer-note,
// working-path, or private-internals markers. Added after a writer's reading-log
// sentence ("the path named in the brief (/workspace/...) was not reachable ...")
// shipped in the RCE-JEPA page because nothing checked for it.
import fs from 'node:fs';
import path from 'node:path';
import { draftIds } from './drafts.mjs';

export const MARKERS = [
  [/\/workspace\//, 'working path /workspace/'],
  [/\/Users\/[a-z]/i, 'local home path /Users/'],
  [/(?<![\w~.\/-])\/home\/[a-z]/, 'local home path /home/'],
  [/\bnamed in the brief\b|\bthe brief\b/i, 'reference to a private brief'],
  [/owner's machine|owner’s machine/i, 'reference to the owner\'s machine'],
  [/\bwriter'?s? notes?\b/i, 'writer note'],
  [/\b(?:TODO|FIXME|XXX)\b/, 'TODO/FIXME marker'],
  [/\bNOTE:/, 'NOTE: marker'],
  [/\bnot reachable\b/i, 'tool-access narration'],
  [/DO NOT PUBLISH|INTERNAL ONLY|for internal use only|BEGIN PRIVATE/, 'privacy marker'],
  [/rce-jepa-(?:blueprint|reads)|joulesperbit/i, 'private repo or directory name'],
];

export function scanText(text, file = '<text>') {
  const out = [];
  text.split('\n').forEach((line, i) => {
    for (const [re, label] of MARKERS) {
      const m = re.exec(line);
      if (m) out.push({ file, line: i + 1, label, ctx: line.slice(Math.max(0, m.index - 40), m.index + 80).trim() });
    }
  });
  return out;
}

const SRC_EXT = /\.(md|astro|json|txt|ts|html)$/;
const SKIP_DIR = /(^|\/)(node_modules|\.git|\.astro|public\/(demos|pkg|pdfs|figures))(\/|$)/;

function walk(dir, exts, out, root) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (SKIP_DIR.test(path.relative(root, p).split(path.sep).join('/'))) continue;
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, exts, out, root);
    else if (exts.test(p)) out.push(p);
  }
}

export function scanTree(root, rels, exts = SRC_EXT, ignore = null) {
  const files = [];
  for (const r of rels) { const a = path.join(root, r); if (fs.existsSync(a)) fs.statSync(a).isDirectory() ? walk(a, exts, files, root) : files.push(a); }
  const hits = [];
  for (const f of files) {
    const rel = path.relative(root, f).split(path.sep).join('/');
    if (ignore && ignore.test(rel)) continue;
    hits.push(...scanText(fs.readFileSync(f, 'utf8'), rel));
  }
  return { count: files.length, hits };
}

// Draft studies must not appear anywhere in dist: not as a file name and not inside any text file.
export function scanDrafts(root, ids) {
  const hits = [];
  const dist = path.join(root, 'dist');
  const walkAll = (d) => {
    if (!fs.existsSync(d)) return;
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f), rel = path.relative(dist, p).split(path.sep).join('/');
      for (const id of ids) if (rel.includes(id)) hits.push({ file: rel, line: 0, label: `draft slug "${id}" in a file name`, ctx: '' });
      const st = fs.statSync(p);
      if (st.isDirectory()) walkAll(p);
      else if (/\.(html|txt|xml|js|json|css|svg|md|tsv)$/.test(f)) {
        const t = fs.readFileSync(p, 'utf8');
        for (const id of ids) { const i = t.indexOf(id); if (i >= 0) hits.push({ file: rel, line: 0, label: `draft slug "${id}"`, ctx: t.slice(Math.max(0, i - 30), i + 50).replace(/\s+/g, ' ') }); }
      }
    }
  };
  walkAll(dist);
  return hits;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const mode = process.argv[2] || 'src';
  const r = mode === 'dist'
    ? scanTree(ROOT, ['dist'], /\.html$/)
    : scanTree(ROOT, ['src/content', 'src/pages', 'src/components', 'src/includes', 'src/layouts', 'src/data'], SRC_EXT, /^src\/data\/private-markers-allow\.json$/);
  if (mode === 'dist') r.hits.push(...scanDrafts(ROOT, draftIds(ROOT)));
  for (const h of r.hits) console.error(`${h.file}:${h.line}: ${h.label}  ...${h.ctx}...`);
  if (r.hits.length) { console.error(`private lint: ${r.hits.length} marker(s) in ${mode}; the build is stopped`); process.exit(1); }
  console.log(`private lint (${mode}): ${r.count} files clean`);
}
