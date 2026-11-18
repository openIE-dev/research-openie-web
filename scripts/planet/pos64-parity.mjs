#!/usr/bin/env node
// PLN-030: 64-bit micrometre positions as vec2<u32> in WGSL, against BigInt.
//
//   node scripts/planet/pos64-parity.mjs   # writes docs/planet/results/pos64.json
//
// Integer add, subtract and signed compare must match exactly. The conversion of a
// camera-relative difference to 32-bit metres is measured in millimetres by distance.
import { runInBrowser, writeResult } from './browser.mjs';

const result = await runInBrowser(async () => (await import('/living/planet/pos64.js')).checkPos64());
result.generated = new Date().toISOString();
result.browser = 'Chromium (Playwright), headless, --enable-unsafe-webgpu';
writeResult('pos64.json', result);
const g = result.gpu;
console.log(JSON.stringify({ ran: result.ran, adapter: result.adapter, reason: result.reason, cpuIntMismatch: result.cpu.intMismatch, gpuIntMismatch: g?.intMismatch, sensitivity: result.sensitivity }));
if (g) for (const b of g.relErrorMm) console.log(`  within ${b.withinMetres} m of the camera: max error ${b.maxErrorMm} mm (GPU), ${result.cpu.relErrorMm.find((c) => c.withinMetres === b.withinMetres).maxErrorMm} mm (JS)`);
process.exit(result.ran && g.intMismatch === 0 && result.cpu.intMismatch === 0 && result.sensitivity.detected ? 0 : 1);
