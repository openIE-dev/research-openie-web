// Translation guard. Refuses a build or deploy of a tree that holds fewer full
// translations than scripts/i18n/CHECKLIST.md says.
//   node scripts/i18n/guard.mjs src [root]   every page marked full has a source file with complete: true and real size
//   node scripts/i18n/guard.mjs dist [root]  every page marked full is built, in its language, and not a stub
// Exit 1 on any failure. See the "Deploy rule" section of CHECKLIST.md.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const MIN_SRC_BYTES = 3000;

export function parseChecklist(text) {
  const rows = text.split('\n').filter((l) => l.trim().startsWith('|'));
  const header = rows.find((r) => /\|\s*paper\s*\|/.test(r));
  if (!header) throw new Error('CHECKLIST.md has no table header');
  const langs = header.split('|').map((s) => s.trim()).filter(Boolean).slice(1);
  const full = [];
  for (const r of rows) {
    if (r === header || /^\|\s*-/.test(r)) continue;
    const cells = r.split('|').map((s) => s.trim()).filter((_, i, a) => i > 0 && i < a.length);
    const paper = cells[0];
    langs.forEach((lang, i) => {
      if (cells[i + 1] === 'full') full.push({ paper, lang });
    });
  }
  return full;
}

export function check(mode, root) {
  const full = parseChecklist(readFileSync(join(root, 'scripts/i18n/CHECKLIST.md'), 'utf8'));
  const problems = [];
  for (const { paper, lang } of full) {
    const src = join(root, 'src/content/translations', lang, `${paper}.md`);
    if (!existsSync(src)) { problems.push(`${lang}/${paper}: marked full but source file is missing`); continue; }
    const body = readFileSync(src, 'utf8');
    const size = statSync(src).size;
    if (mode === 'src') {
      if (!/^complete:\s*true\s*$/m.test(body)) problems.push(`${lang}/${paper}: marked full but complete is not true (stub)`);
      if (size < MIN_SRC_BYTES) problems.push(`${lang}/${paper}: marked full but source is only ${size} bytes (stub)`);
    } else {
      const page = join(root, 'dist', lang, 'papers', paper, 'index.html');
      if (!existsSync(page)) { problems.push(`${lang}/${paper}: marked full but not built`); continue; }
      const html = readFileSync(page, 'utf8');
      if (statSync(page).size < size) problems.push(`${lang}/${paper}: built page (${statSync(page).size} bytes) is smaller than its source (${size}), a stub`);
      if (!new RegExp(`<html[^>]*\\blang="${lang}"`).test(html)) problems.push(`${lang}/${paper}: built page lacks lang="${lang}"`);
    }
  }
  return { checked: full.length, problems };
}

if (process.argv[1] && process.argv[1].endsWith('guard.mjs')) {
  const mode = process.argv[2];
  const root = process.argv[3] || process.cwd();
  if (mode !== 'src' && mode !== 'dist') { console.error('usage: guard.mjs src|dist [root]'); process.exit(2); }
  const { checked, problems } = check(mode, root);
  if (problems.length) {
    console.error(`translation guard (${mode}): REFUSING. ${problems.length} problem(s) in ${checked} pages marked full:`);
    for (const p of problems) console.error('  ' + p);
    console.error('Deploy only from the tree that contains the translation line (see scripts/i18n/CHECKLIST.md).');
    process.exit(1);
  }
  console.log(`translation guard (${mode}): ${checked} pages marked full, all present`);
}
