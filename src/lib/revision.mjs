// The revision of a page's source, read from git at build time (or from a
// pre-captured git-revisions.json snapshot when building on an isolated remote
// host where .git is omitted), so no page carries a hand-typed version number.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const REPO = 'https://github.com/openIE-dev/research-openie-web';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

let snapshotCache = null;
function loadSnapshot() {
  if (snapshotCache !== null) return snapshotCache;
  try {
    const p = path.join(ROOT, 'src/data/git-revisions.json');
    snapshotCache = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
  } catch {
    snapshotCache = {};
  }
  return snapshotCache;
}

// { hash, date, history } of the last commit that changed `file` (a path
// relative to the repository root, or absolute).
export function revisionOf(file) {
  const rel = path.relative(ROOT, path.resolve(ROOT, file)).split(path.sep).join('/');
  let out = '';
  if (fs.existsSync(path.join(ROOT, '.git'))) {
    try {
      out = execFileSync('git', ['log', '-1', '--format=%h %cs', '--', rel], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {
      out = '';
    }
  }
  if (!out) {
    const snap = loadSnapshot();
    if (snap && typeof snap[rel] === 'string') out = snap[rel];
  }
  if (!out) return { hash: 'uncommitted', date: 'not yet committed', history: `${REPO}/commits/main` };
  const [hash, iso] = out.split(' ');
  const [y, m, d] = iso.split('-').map(Number);
  return { hash, date: `${d} ${MONTHS[m - 1]} ${y}`, history: `${REPO}/commits/main/${rel}` };
}

// "revision 9d6cb52, 30 October 2026" for the paper with this id.
export function paperRevisionText(id) {
  const r = revisionOf(`src/content/papers/${id}.md`);
  return `revision ${r.hash}, ${r.date}`;
}
