#!/usr/bin/env node
// Walk dist/ HTML and fail if an internal href or src has no file in dist.
// External http(s), mailto, data, javascript, and hash-only links are skipped.
// Same-page hashes are checked against id or name attributes when present.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://research.openie.dev';

if (!fs.existsSync(DIST)) {
  console.error('dist/ is missing; run pnpm build first');
  process.exit(1);
}

function* walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) yield* walk(p);
    else if (ent.isFile() && ent.name.endsWith('.html')) yield p;
  }
}

function attrs(html, name) {
  const out = [];
  const re = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'gi');
  let m;
  while ((m = re.exec(html))) out.push(m[2] ?? m[3] ?? '');
  return out;
}

function ids(html) {
  const set = new Set();
  const re = /\b(?:id|name)\s*=\s*("([^"]*)"|'([^']*)')/gi;
  let m;
  while ((m = re.exec(html))) {
    const v = m[2] ?? m[3] ?? '';
    if (v) set.add(v);
  }
  return set;
}

function existsInDist(rel) {
  const clean = rel.split('?')[0];
  if (!clean || clean === '/') {
    return fs.existsSync(path.join(DIST, 'index.html'));
  }
  const candidates = [
    clean,
    clean.replace(/\/$/, '') + '.html',
    path.join(clean, 'index.html'),
    clean.replace(/\/$/, ''),
  ];
  return candidates.some((c) => {
    const abs = path.join(DIST, c.replace(/^\//, ''));
    const resolved = path.resolve(abs);
    if (!resolved.startsWith(DIST + path.sep) && resolved !== DIST) return false;
    return fs.existsSync(resolved);
  });
}

const missing = [];
let checked = 0;

for (const file of walk(DIST)) {
  const html = fs.readFileSync(file, 'utf8');
  const pageIds = ids(html);
  const pageUrl = '/' + path.relative(DIST, file).split(path.sep).join('/');
  const pageDir = path.posix.dirname(pageUrl);

  for (const raw of [...attrs(html, 'href'), ...attrs(html, 'src')]) {
    const href = raw.trim();
    if (!href || href === '#') continue;
    const lower = href.toLowerCase();
    if (
      lower.startsWith('mailto:') ||
      lower.startsWith('javascript:') ||
      lower.startsWith('data:') ||
      lower.startsWith('tel:')
    ) {
      continue;
    }

    let pathname;
    let hash = '';
    if (href.startsWith('#')) {
      pathname = pageUrl;
      hash = href.slice(1);
    } else if (href.startsWith(SITE)) {
      const u = new URL(href);
      pathname = u.pathname;
      hash = u.hash.replace(/^#/, '');
    } else if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
      continue; // other schemes, including external https
    } else if (href.startsWith('//')) {
      continue;
    } else {
      const cut = href.split('#');
      const bare = cut[0].split('?')[0];
      hash = (cut[1] || '').split('?')[0];
      pathname = bare.startsWith('/')
        ? bare
        : path.posix.normalize(path.posix.join(pageDir, bare));
    }

    checked += 1;
    if (!existsInDist(pathname)) {
      missing.push(`${pageUrl}: ${href} -> ${pathname}`);
      continue;
    }
    if (hash) {
      let targetHtml = null;
      const rel = pathname.replace(/^\//, '');
      const tries = [
        path.join(DIST, rel),
        path.join(DIST, rel.replace(/\/$/, '') + '.html'),
        path.join(DIST, rel, 'index.html'),
      ];
      for (const t of tries) {
        if (fs.existsSync(t) && fs.statSync(t).isFile() && t.endsWith('.html')) {
          targetHtml = t;
          break;
        }
      }
      const targetIds = targetHtml
        ? (targetHtml === file ? pageIds : ids(fs.readFileSync(targetHtml, 'utf8')))
        : null;
      if (targetIds && !targetIds.has(hash)) {
        missing.push(`${pageUrl}: ${href} -> missing #${hash} on ${pathname}`);
      }
    }
  }
}

if (missing.length) {
  console.error(`Internal link check failed: ${missing.length} of ${checked} links`);
  for (const line of missing) console.error('  ' + line);
  process.exit(1);
}
console.log(`Internal link check passed: ${checked} links`);
