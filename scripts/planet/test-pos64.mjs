#!/usr/bin/env node
// CPU check of the 64-bit position words against BigInt (no GPU needed; runs in CI).
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const P = await import(pathToFileURL(path.join(ROOT, 'public/living/planet/pos64.js')).href);
const r = P.compare(P.testVectors(), null);
const within16km = r.relErrorMm.filter((b) => b.withinMetres <= 16000).every((b) => b.maxErrorMm < 1);
console.log(`pos64: ${r.intMismatch} of ${r.pairs} integer results differ from BigInt; camera-relative error under 1 mm within 16 km: ${within16km}`);
process.exit(r.intMismatch === 0 && within16km ? 0 : 1);
