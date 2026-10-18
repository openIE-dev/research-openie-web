// Drafts are never published. An entry is a draft when its status is "In preparation", either on
// its studies.json entry or in the frontmatter of src/content/papers/<id>.md or src/content/products/<id>.md.
// Used by the study listings, the build step that strips draft output from dist, and lint-private.
import fs from 'node:fs';
import path from 'node:path';

export const DRAFT_STATUS = 'In preparation';
const norm = (v) => String(v ?? '').trim().toLowerCase();

function frontmatterStatus(file) {
  if (!fs.existsSync(file)) return null;
  const head = fs.readFileSync(file, 'utf8').split(/^---\s*$/m)[1] ?? '';
  const m = head.match(/^status:\s*"?([^"\n]*)"?\s*$/m);
  return m ? m[1] : null;
}

export function isDraftStatus(s) { return norm(s) === norm(DRAFT_STATUS); }

export function draftIds(root = process.cwd()) {
  const ids = new Set();
  const data = JSON.parse(fs.readFileSync(path.join(root, 'src/data/studies.json'), 'utf8'));
  for (const s of data.studies) if (isDraftStatus(s.status)) ids.add(s.id);
  for (const dir of ['papers', 'products']) {
    const d = path.join(root, 'src/content', dir);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      if (f.endsWith('.md') && isDraftStatus(frontmatterStatus(path.join(d, f)))) ids.add(f.replace(/\.md$/, ''));
    }
  }
  return [...ids];
}

// Every place a study can be emitted in dist, relative to dist/.
export function draftOutputs(id, langs = []) {
  return [
    `papers/${id}`, `about/${id}`, `products/${id}`, `pdfs/${id}.pdf`, `living/${id}`, `figures/${id}`,
    ...langs.map((l) => `${l}/papers/${id}`),
  ];
}
