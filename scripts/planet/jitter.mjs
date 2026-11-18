#!/usr/bin/env node
// The arithmetic under PL-H9 (public/living/planet/jitter.js), run on the GPU in
// headless Chromium. Writes docs/planet/results/jitter.json.
//
// Kill rule used for this check: the camera-relative scheme must place every vertex
// within 1 mm of its exact position at every place tried (PL-H9's 1 mm). The naive
// scheme is measured for comparison and has no pass condition.
import { runInBrowser, writeResult } from './browser.mjs';

const r = await runInBrowser(async () => (await import('/living/planet/jitter.js')).checkJitter());
r.generated = new Date().toISOString();
r.browser = 'Chromium (Playwright), headless, --enable-unsafe-webgpu';
r.scope = 'Vertex position before projection, for vertices within about 100 m of the camera. Not a rendered-image test.';
writeResult('jitter.json', r);
if (!r.ran) { console.log('not run:', r.reason); process.exit(1); }
console.log('adapter', JSON.stringify(r.adapter));
for (const x of r.results) console.log(`  ${x.place}: naive ${x.maxErrorMm.naive} mm, camera-relative ${x.maxErrorMm.relative} mm`);
const ok = r.results.every((x) => x.maxErrorMm.relative <= 1);
console.log(ok ? 'camera-relative within 1 mm everywhere tried' : 'camera-relative exceeds 1 mm somewhere');
process.exit(ok ? 0 : 1);
