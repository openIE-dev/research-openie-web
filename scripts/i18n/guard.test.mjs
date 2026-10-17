import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { check, parseChecklist } from './guard.mjs';

const CL = `| paper | zh-Hans | es |\n|---|---|---|\n| rce | full | abstract |\n| agency | full | full |\n`;
function tree({ stubEs = false, dist = true } = {}) {
  const r = mkdtempSync(join(tmpdir(), 'guard-'));
  mkdirSync(join(r, 'scripts/i18n'), { recursive: true });
  writeFileSync(join(r, 'scripts/i18n/CHECKLIST.md'), CL);
  for (const [lang, slug] of [['zh-Hans', 'rce'], ['zh-Hans', 'agency'], ['es', 'agency']]) {
    mkdirSync(join(r, 'src/content/translations', lang), { recursive: true });
    const stub = stubEs && lang === 'es';
    writeFileSync(join(r, 'src/content/translations', lang, `${slug}.md`),
      `---\ncomplete: ${stub ? 'false' : 'true'}\n---\n` + (stub ? 'x'.repeat(300) : 'x'.repeat(5000)));
    if (dist) {
      mkdirSync(join(r, 'dist', lang, 'papers', slug), { recursive: true });
      writeFileSync(join(r, 'dist', lang, 'papers', slug, 'index.html'), `<html lang="${lang}">` + 'y'.repeat(stub ? 100 : 9000));
    }
  }
  return r;
}
test('parses full cells only', () => assert.equal(parseChecklist(CL).length, 3));
test('complete tree passes in src and dist', () => {
  const r = tree();
  assert.deepEqual(check('src', r).problems, []);
  assert.deepEqual(check('dist', r).problems, []);
});
test('a page marked full that is a stub is refused', () => {
  const r = tree({ stubEs: true });
  assert.equal(check('src', r).problems.length, 2);
  assert.ok(check('dist', r).problems.length >= 1);
});
test('a missing translation line (clean checkout) is refused', () => {
  const r = tree({ dist: false });
  assert.equal(check('dist', r).problems.length, 3);
});
