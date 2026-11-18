// Run a function in headless Chromium against a page served from public/ on
// localhost (WebGPU needs a secure origin). Shared by the planet GPU checks.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PUB = path.join(ROOT, 'public');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.wasm': 'application/wasm' };

function loadChromium() {
  const require = createRequire(import.meta.url);
  try { return require('playwright').chromium; } catch {
    const globalRoot = execSync('npm root -g').toString().trim(); // Playwright installed globally
    return require(path.join(globalRoot, 'playwright')).chromium;
  }
}

// `fn` is serialised and run in the page; it receives `arg` and may use dynamic import().
export async function runInBrowser(fn, arg) {
  const server = http.createServer((req, res) => {
    const p = path.join(PUB, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!p.startsWith(PUB) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const browser = await loadChromium().launch({ args: ['--enable-unsafe-webgpu'] });
  try {
    const page = await browser.newPage();
    page.on('console', (m) => console.log('[page]', m.text()));
    await page.goto(`http://localhost:${server.address().port}/living/planet/core.js`);
    return await page.evaluate(fn, arg);
  } finally {
    await browser.close();
    server.close();
  }
}

export function writeResult(name, obj) {
  const out = path.join(ROOT, 'docs/planet/results');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, name), JSON.stringify(obj, null, 1) + '\n');
}
