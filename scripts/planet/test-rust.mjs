#!/usr/bin/env node
// PLN-020: the Rust reference of the planet core, run natively (debug build,
// overflow checks on) and as WebAssembly, against core.js. Compares the state
// hash at every tick under the same fuzzed edit logs, and the generator over
// large grids.
//
//   node scripts/planet/test-rust.mjs          # builds with cargo, writes docs/planet/results/rust-wasm.json
//   node scripts/planet/test-rust.mjs --no-build
//
// Copies the built module to public/living/planet/core.wasm.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CRATE = path.join(ROOT, 'experiments/planet-core');
const C = await import(pathToFileURL(path.join(ROOT, 'public/living/planet/core.js')).href);
const { fuzzLog } = await import(pathToFileURL(path.join(ROOT, 'scripts/planet/divergence.mjs')).href);

const SEEDS = [1, 7, 1234, 99991], TICKS = 1000;
const WASM_OUT = path.join(ROOT, 'public/living/planet/core.wasm');

if (!process.argv.includes('--no-build')) {
  execFileSync('cargo', ['test', '-q'], { cwd: CRATE, stdio: 'inherit' });
  execFileSync('cargo', ['build', '-q', '--release', '--target', 'wasm32-unknown-unknown', '--lib'], { cwd: CRATE, stdio: 'inherit' });
  execFileSync('cargo', ['build', '-q', '--bin', 'hashes'], { cwd: CRATE, stdio: 'inherit' });
  fs.copyFileSync(path.join(CRATE, 'target/wasm32-unknown-unknown/release/planet_core.wasm'), WASM_OUT);
}
const NATIVE = path.join(CRATE, 'target/debug/hashes');
const rustc = execFileSync('rustc', ['--version']).toString().trim();

const { instance } = await WebAssembly.instantiate(fs.readFileSync(WASM_OUT), {});
const X = instance.exports;
const hex = (a, b) => (a >>> 0).toString(16).padStart(8, '0') + (b >>> 0).toString(16).padStart(8, '0');
const OPS = Object.fromEntries(C.OPS.map((o, i) => [o, i]));

let failures = 0;
const result = { generated: new Date().toISOString(), node: process.version, rustc, platform: `${os.platform()} ${os.arch()}`, wasmBytes: fs.statSync(WASM_OUT).size, seeds: {} };

for (const seed of SEEDS) {
  const s0 = C.initState(seed);
  const log = fuzzLog(C, seed, TICKS, s0.W, s0.H);

  // JavaScript reference, hash at every tick.
  const js = [];
  let s = C.initState(seed);
  const refusedJs = [];
  for (let t = 0; t < TICKS; t++) { s = C.advance(s, log, refusedJs); js.push(C.hashState(s)); }

  // WebAssembly, in lockstep.
  X.world_init(seed, 192, 96);
  const ptr = X.alloc(log.length * 5 * 4);
  new Int32Array(X.memory.buffer, ptr, log.length * 5).set(log.flatMap((e) => [e.t, e.x, e.y, OPS[e.op], e.k]));
  X.world_set_log(ptr, log.length);
  let wasmFirst = -1, refusedWasm = 0;
  for (let t = 0; t < TICKS; t++) {
    refusedWasm += X.world_advance(1);
    if (wasmFirst < 0 && hex(X.world_hash_hi(), X.world_hash_lo()) !== js[t]) wasmFirst = t + 1;
  }

  // Native debug build (overflow checks on).
  const logFile = path.join(os.tmpdir(), `planet-log-${seed}-${process.pid}.txt`);
  fs.writeFileSync(logFile, log.map((e) => `${e.t} ${e.x} ${e.y} ${OPS[e.op]} ${e.k}`).join('\n') + '\n');
  const lines = execFileSync(NATIVE, [String(seed), String(TICKS), logFile]).toString().trim().split('\n');
  fs.unlinkSync(logFile);
  const refusedNative = Number(lines.pop().split(' ')[1]);
  let nativeFirst = -1;
  lines.forEach((l, t) => { if (nativeFirst < 0 && l.split(' ')[1] !== js[t]) nativeFirst = t + 1; });

  const r = {
    edits: log.length, ticks: TICKS, finalHash: js[TICKS - 1],
    refused: { js: refusedJs.length, wasm: refusedWasm, native: refusedNative },
    firstMismatchTick: { wasm: wasmFirst, native: nativeFirst },
  };
  const ok = wasmFirst < 0 && nativeFirst < 0 && refusedJs.length === refusedWasm && refusedWasm === refusedNative;
  if (!ok) failures++;
  result.seeds[seed] = r;
  console.log(`seed ${seed}: ${ok ? 'ok  ' : 'FAIL'} JS, Wasm and native agree at all ${TICKS} ticks` + (ok ? '' : ` ${JSON.stringify(r.firstMismatchTick)}`));
}

// Rotation (an option, off by default): JS, Wasm and native must agree with it on too.
result.rotation = {};
for (const [seed, rot] of [[1234, 64], [7, 200]]) {
  const s0 = C.initState(seed);
  const log = fuzzLog(C, seed, 400, s0.W, s0.H);
  const js = [];
  let s = C.initState(seed, 192, 96, { rot });
  for (let t = 0; t < 400; t++) { s = C.advance(s, log); js.push(C.hashState(s)); }
  X.world_init(seed, 192, 96); X.world_set_rot(rot);
  const ptr = X.alloc(Math.max(1, log.length) * 20);
  new Int32Array(X.memory.buffer, ptr, log.length * 5).set(log.flatMap((e) => [e.t, e.x, e.y, OPS[e.op], e.k]));
  X.world_set_log(ptr, log.length);
  let wasmFirst = -1;
  for (let t = 0; t < 400; t++) { X.world_advance(1); if (wasmFirst < 0 && hex(X.world_hash_hi(), X.world_hash_lo()) !== js[t]) wasmFirst = t + 1; }
  const logFile = path.join(os.tmpdir(), `planet-rot-${seed}-${process.pid}.txt`);
  fs.writeFileSync(logFile, log.map((e) => `${e.t} ${e.x} ${e.y} ${OPS[e.op]} ${e.k}`).join('\n') + '\n');
  const lines = execFileSync(NATIVE, [String(seed), '400', logFile, String(rot)]).toString().trim().split('\n');
  fs.unlinkSync(logFile); lines.pop();
  let nativeFirst = -1;
  lines.forEach((l, t) => { if (nativeFirst < 0 && l.split(' ')[1] !== js[t]) nativeFirst = t + 1; });
  const differsFromRot0 = js[399] !== (() => { let z = C.initState(seed); for (let t = 0; t < 400; t++) z = C.advance(z, log); return C.hashState(z); })();
  const ok = wasmFirst < 0 && nativeFirst < 0 && differsFromRot0;
  if (!ok) failures++;
  result.rotation[`${seed}/rot${rot}`] = { firstMismatchTick: { wasm: wasmFirst, native: nativeFirst }, differsFromRot0 };
  console.log(`rotation ${rot} on seed ${seed}: ${ok ? 'ok  ' : 'FAIL'} JS, Wasm and native agree for 400 ticks; differs from no rotation: ${differsFromRot0}`);
}

// Sensitivity: the comparison must notice one missing edit. Drop the first edit the
// JavaScript run admitted and run Wasm again; the hashes must differ.
{
  const seed = 1234, s0 = C.initState(seed);
  const log = fuzzLog(C, seed, TICKS, s0.W, s0.H);
  let s = C.initState(seed), drop = -1;
  for (let t = 0; t < TICKS && drop < 0; t++) {
    log.forEach((e, k) => { if (drop < 0 && e.t === s.t && !C.checkEdit(s, e)) drop = k; });
    s = C.advance(s, log);
  }
  const cut = log.filter((_, k) => k !== drop);
  let ref = C.initState(seed);
  for (let t = 0; t < 300; t++) ref = C.advance(ref, log);
  X.world_init(seed, 192, 96);
  const ptr = X.alloc(cut.length * 5 * 4);
  new Int32Array(X.memory.buffer, ptr, cut.length * 5).set(cut.flatMap((e) => [e.t, e.x, e.y, OPS[e.op], e.k]));
  X.world_set_log(ptr, cut.length);
  X.world_advance(300);
  const detected = hex(X.world_hash_hi(), X.world_hash_lo()) !== C.hashState(ref);
  result.sensitivity = { seed, droppedEdit: log[drop], ticks: 300, detected };
  if (!detected) failures++;
  console.log(`sensitivity: dropping one admitted edit ${detected ? 'is detected' : 'is NOT detected'}`);
}

// Generator parity over large grids.
{
  const W = 1024, H = 512, n = W * H;
  let cells = 0, mismatches = 0;
  for (const seed of SEEDS) {
    const out = X.alloc(n * 4);
    X.gen_packed(seed, W, H, out);
    const wasm = new Uint32Array(X.memory.buffer, out, n);
    const ref = C.generatePacked(seed, W, H);
    for (let i = 0; i < n; i++) if (wasm[i] !== ref[i]) mismatches++;
    cells += n;
  }
  result.generator = { cells, mismatches };
  if (mismatches) failures++;
  console.log(`generator: ${mismatches} of ${cells} cells differ between Wasm and JS`);
}

result.failures = failures;
fs.mkdirSync(path.join(ROOT, 'docs/planet/results'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs/planet/results/rust-wasm.json'), JSON.stringify(result, null, 1) + '\n');
console.log(failures ? `${failures} failure(s)` : 'all checks passed');
process.exit(failures ? 1 : 0);
