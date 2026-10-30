import test from 'node:test';
import assert from 'node:assert/strict';
import { scanText, scanTree } from './lint-private.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

test('the original leaked sentence is caught', () => {
  const s = 'The path named in the brief (<code>/workspace/rce-jepa/exp</code>) was not reachable; the same bundle was read from the owner\'s machine.';
  const labels = scanText(s).map((h) => h.label);
  assert.ok(labels.includes('working path /workspace/'));
  assert.ok(labels.includes('reference to a private brief'));
  assert.ok(labels.includes("reference to the owner's machine"));
  assert.ok(labels.includes('tool-access narration'));
});

test('markers: TODO, NOTE:, local paths, private dir names', () => {
  for (const s of ['TODO fix', 'NOTE: remove', '/Users/someone/x', '/home/bob/y', 'see rce-jepa-blueprint/LEDGER.md', 'writer note: cut']) {
    assert.ok(scanText(s).length > 0, s);
  }
});

test('ordinary public prose is not flagged', () => {
  for (const s of ['Several firms do not publish the second figure.', 'https://people.math.harvard.edu/~ctm/home/text/x.pdf', 'The gate refuses a bad Form.']) {
    assert.equal(scanText(s).length, 0, s);
  }
});

test('scanTree finds a leak in a built html file', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'lp-'));
  fs.mkdirSync(path.join(d, 'dist'));
  fs.writeFileSync(path.join(d, 'dist', 'a.html'), '<p>fine</p>\n<p>NOTE: private draft</p>');
  const r = scanTree(d, ['dist'], /\.html$/);
  assert.equal(r.hits.length, 1);
  assert.equal(r.hits[0].line, 2);
});
