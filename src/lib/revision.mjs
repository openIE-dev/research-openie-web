// The revision of a page's source, read from git at build time, so no page
// carries a hand-typed version number that can fall behind its text.
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve('.');
const REPO = 'https://github.com/openIE-dev/research-openie-web';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

// { hash, date, history } of the last commit that changed `file` (a path
// relative to the repository root, or absolute).
export function revisionOf(file) {
  const rel = path.relative(ROOT, path.resolve(ROOT, file));
  let out = '';
  try {
    out = execFileSync('git', ['log', '-1', '--format=%h %cs', '--', rel], { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch {
    out = '';
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
