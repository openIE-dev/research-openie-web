#!/usr/bin/env node
// Run the planet GPU parity check (PL-H1) in headless Chromium and record which
// adapter actually ran it. Serves public/ on localhost because WebGPU needs a
// secure origin.
//
//   node scripts/planet/gpu-parity.mjs   # writes docs/planet/results/gpu-parity.json
//
// In a container without a GPU, Chromium's adapter is SwiftShader (a CPU
// implementation of Vulkan): one device, not a GPU vendor. The results file says so.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PUB = path.join(ROOT, 'public');
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  const globalRoot = execSync('npm root -g').toString().trim(); // Playwright installed globally
  ({ chromium } = require(path.join(globalRoot, 'playwright')));
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const p = path.join(PUB, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(PUB) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch({ args: ['--enable-unsafe-webgpu'] });
const page = await browser.newPage();
page.on('console', (m) => console.log('[page]', m.text()));
await page.goto(`http://localhost:${port}/living/planet/core.js`);
const result = await page.evaluate(async () => {
  const gpu = await import('/living/planet/gpu.js');
  return gpu.checkParity({ onProgress: (r) => console.log(JSON.stringify(r)) });
});
await browser.close();
server.close();

result.generated = new Date().toISOString();
result.browser = 'Chromium (Playwright), headless, --enable-unsafe-webgpu';
result.note = 'One adapter only. PL-H1 asks for three GPU vendors and three browsers; this file is one data point.';
const out = path.join(ROOT, 'docs/planet/results');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'gpu-parity.json'), JSON.stringify(result, null, 1) + '\n');
console.log(JSON.stringify({ ran: result.ran, adapter: result.adapter, cells: result.cells, mismatches: result.mismatches, mutationCheck: result.mutationCheck, reason: result.reason }));
process.exit(result.ran && result.mismatches === 0 && result.mutationCheck?.detected ? 0 : 1);
