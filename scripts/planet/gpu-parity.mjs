#!/usr/bin/env node
// Run the planet GPU parity check (PL-H1) in headless Chromium and record which
// adapter actually ran it.
//
//   node scripts/planet/gpu-parity.mjs   # writes docs/planet/results/gpu-parity.json
//
// In a container without a GPU, Chromium's adapter is SwiftShader (a CPU
// implementation of Vulkan): one device, not a GPU vendor. The results file says so.
import { runInBrowser, writeResult } from './browser.mjs';

const result = await runInBrowser(async () => {
  const gpu = await import('/living/planet/gpu.js');
  return gpu.checkParity({ onProgress: (r) => console.log(JSON.stringify(r)) });
});
result.generated = new Date().toISOString();
result.browser = 'Chromium (Playwright), headless, --enable-unsafe-webgpu';
result.note = 'One adapter only. PL-H1 asks for three GPU vendors and three browsers; this file is one data point.';
writeResult('gpu-parity.json', result);
console.log(JSON.stringify({ ran: result.ran, adapter: result.adapter, cells: result.cells, mismatches: result.mismatches, mutationCheck: result.mutationCheck, reason: result.reason }));
process.exit(result.ran && result.mismatches === 0 && result.mutationCheck?.detected ? 0 : 1);
