// 64-bit positions in micrometres, as pairs of 32-bit words (PLN-030).
//
// WGSL has no 64-bit integer type, so a position coordinate is a vec2<u32>
// (lo, hi) holding a two's-complement 64-bit integer. Add, subtract and signed
// compare are exact and wrap modulo 2^64; they belong to the exact zone and must
// match BigInt bit for bit. Converting a camera-relative difference to a 32-bit
// float in metres is the tolerance zone: it feeds drawing only.
//
// The JavaScript functions below use the same 32-bit steps as the WGSL ones, so
// the CPU and GPU paths are the same algorithm; BigInt is the independent check.

import { mix32 } from './core.js';

// ---------------------------------------------------------------- JavaScript, word by word

export function add64(alo, ahi, blo, bhi) {
  const lo = (alo + blo) >>> 0;
  const carry = lo < (alo >>> 0) ? 1 : 0;
  return [lo, (ahi + bhi + carry) >>> 0];
}

export function sub64(alo, ahi, blo, bhi) {
  const lo = (alo - blo) >>> 0;
  const borrow = (alo >>> 0) < (blo >>> 0) ? 1 : 0;
  return [lo, (ahi - bhi - borrow) >>> 0];
}

export function lt64(alo, ahi, blo, bhi) { // signed
  if (ahi !== bhi) return (ahi | 0) < (bhi | 0);
  return (alo >>> 0) < (blo >>> 0);
}

// Camera-relative metres as a 32-bit float, the way the shader computes it.
// The low word is read as signed and its sign carried into the high word, so a
// small negative difference (high word -1, low word near 2^32) converts as a small
// number instead of as 2^32 minus a small number, which a 32-bit float can only
// hold to the nearest 512 micrometres.
export function relMetresF32(dlo, dhi) {
  const f = Math.fround;
  const loS = dlo | 0;
  const hiS = (dhi + (dlo >>> 31)) | 0;
  return f(f(f(hiS) * 4294967296) + f(loS)) * f(1e-6);
}

// ---------------------------------------------------------------- BigInt reference

export const toBig = (lo, hi) => BigInt.asIntN(64, (BigInt(hi >>> 0) << 32n) | BigInt(lo >>> 0));
export const fromBig = (v) => { const u = BigInt.asUintN(64, v); return [Number(u & 0xffffffffn), Number(u >> 32n)]; };

// ---------------------------------------------------------------- test vectors

// Pairs (a, b) covering carries, sign changes, extremes, and camera offsets of
// set sizes. Offsets are |b - a| in micrometres, grouped by bucket for the
// tolerance measurement.
export const BUCKETS_M = [1, 100, 1000, 4000, 8000, 16000, 100000];

export function testVectors(n = 65536) {
  const v = [];
  const edge = [0, 1, 0x7fffffff, 0x80000000, 0xfffffffe, 0xffffffff];
  for (const alo of edge) for (const ahi of edge) for (const blo of edge) for (const bhi of [0, 1, 0x7fffffff, 0x80000000, 0xffffffff]) {
    v.push({ a: [alo, ahi], b: [blo, bhi], bucket: -1 });
  }
  let h = 0x51ed2705;
  for (let i = 0; v.length < n; i++) {
    h = mix32(h + i);
    const a = [mix32(h ^ 1), mix32(h ^ 2) & 0x3fffffff]; // |a| up to about 2^62 um
    if (mix32(h ^ 3) & 1) a[1] = (~a[1]) >>> 0; // negative half
    const bucket = i % BUCKETS_M.length;
    const span = BigInt(BUCKETS_M[bucket]) * 1000000n; // metres -> micrometres
    const r = BigInt(mix32(h ^ 4)) * BigInt(mix32(h ^ 5));
    let off = r % (2n * span + 1n) - span;
    const b = fromBig(toBig(a[0], a[1]) + off);
    v.push({ a, b, bucket });
  }
  return v;
}

// ---------------------------------------------------------------- WGSL

export const WGSL64 = /* wgsl */ `
struct Pair { a: vec2<u32>, b: vec2<u32> }
struct Out { sum: vec2<u32>, diff: vec2<u32>, lt: u32, rel: f32 }
@group(0) @binding(0) var<storage, read> pairs: array<Pair>;
@group(0) @binding(1) var<storage, read_write> outs: array<Out>;

fn add64(a: vec2<u32>, b: vec2<u32>) -> vec2<u32> {
  let lo = a.x + b.x;
  let carry = select(0u, 1u, lo < a.x);
  return vec2<u32>(lo, a.y + b.y + carry);
}
fn sub64(a: vec2<u32>, b: vec2<u32>) -> vec2<u32> {
  let lo = a.x - b.x;
  let borrow = select(0u, 1u, a.x < b.x);
  return vec2<u32>(lo, a.y - b.y - borrow);
}
fn lt64(a: vec2<u32>, b: vec2<u32>) -> bool {
  if (a.y != b.y) { return bitcast<i32>(a.y) < bitcast<i32>(b.y); }
  return a.x < b.x;
}
fn relMetres(d: vec2<u32>) -> f32 {
  let loS = bitcast<i32>(d.x);
  let hiS = bitcast<i32>(d.y + (d.x >> 31u));
  return (f32(hiS) * 4294967296.0 + f32(loS)) * 1e-6;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;
  if (i >= arrayLength(&pairs)) { return; }
  let p = pairs[i];
  let d = sub64(p.b, p.a);
  outs[i] = Out(add64(p.a, p.b), d, select(0u, 1u, lt64(p.a, p.b)), relMetres(d));
}
`;

// Run the vectors on a GPU device and return the raw outputs (6 words per pair).
export async function runOnGpu(device, vectors, code = WGSL64) {
  const n = vectors.length;
  const inData = new Uint32Array(n * 4);
  vectors.forEach((p, i) => inData.set([p.a[0], p.a[1], p.b[0], p.b[1]], i * 4));
  const module = device.createShaderModule({ code });
  const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module, entryPoint: 'main' } });
  const inBuf = device.createBuffer({ size: inData.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
  device.queue.writeBuffer(inBuf, 0, inData);
  const outBytes = n * 24; // Out = vec2 + vec2 + u32 + f32, 24 bytes with vec2 alignment 8
  const outBuf = device.createBuffer({ size: outBytes, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC });
  const read = device.createBuffer({ size: outBytes, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
  const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
    { binding: 0, resource: { buffer: inBuf } }, { binding: 1, resource: { buffer: outBuf } },
  ] });
  const enc = device.createCommandEncoder();
  const pass = enc.beginComputePass();
  pass.setPipeline(pipeline); pass.setBindGroup(0, bind); pass.dispatchWorkgroups(Math.ceil(n / 64)); pass.end();
  enc.copyBufferToBuffer(outBuf, 0, read, 0, outBytes);
  device.queue.submit([enc.finish()]);
  await read.mapAsync(GPUMapMode.READ);
  const buf = read.getMappedRange().slice(0);
  read.unmap();
  for (const b of [inBuf, outBuf, read]) b.destroy();
  return { u32: new Uint32Array(buf), f32: new Float32Array(buf) };
}

// Compare GPU (or, with gpu = null, the word-by-word JavaScript) against BigInt.
// Integer results must match exactly; the float conversion is measured in millimetres
// against the exact difference, per bucket of camera distance.
export function compare(vectors, gpu) {
  let intMismatch = 0, first = null;
  const err = BUCKETS_M.map(() => ({ maxMm: 0, n: 0 }));
  vectors.forEach((p, i) => {
    const A = toBig(...p.a), B = toBig(...p.b);
    const want = { sum: fromBig(A + B), diff: fromBig(B - A), lt: A < B ? 1 : 0 };
    let got;
    if (gpu) {
      const o = i * 6;
      got = { sum: [gpu.u32[o], gpu.u32[o + 1]], diff: [gpu.u32[o + 2], gpu.u32[o + 3]], lt: gpu.u32[o + 4], rel: gpu.f32[o + 5] };
    } else {
      const d = sub64(p.b[0], p.b[1], p.a[0], p.a[1]);
      got = { sum: add64(p.a[0], p.a[1], p.b[0], p.b[1]), diff: d, lt: lt64(p.a[0], p.a[1], p.b[0], p.b[1]) ? 1 : 0, rel: relMetresF32(d[0], d[1]) };
    }
    const same = got.sum[0] === want.sum[0] && got.sum[1] === want.sum[1] && got.diff[0] === want.diff[0] && got.diff[1] === want.diff[1] && got.lt === want.lt;
    if (!same) { intMismatch++; if (!first) first = { i, a: p.a, b: p.b, want, got }; }
    if (p.bucket >= 0) {
      const exactM = Number(B - A) / 1e6; // |B - A| < 2^53 here, so this is exact to well under a micrometre
      const e = Math.abs(got.rel - exactM) * 1000;
      const b = err[p.bucket];
      b.n++; if (e > b.maxMm) b.maxMm = e;
    }
  });
  return {
    pairs: vectors.length, intMismatch, first,
    relErrorMm: BUCKETS_M.map((m, k) => ({ withinMetres: m, pairs: err[k].n, maxErrorMm: Number(err[k].maxMm.toPrecision(3)) })),
  };
}

export async function checkPos64({ n = 65536 } = {}) {
  const vectors = testVectors(n);
  const cpu = compare(vectors, null);
  if (!globalThis.navigator?.gpu) return { ran: false, reason: 'WebGPU is not available', cpu };
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) return { ran: false, reason: 'no WebGPU adapter', cpu };
  const device = await adapter.requestDevice();
  const gpu = compare(vectors, await runOnGpu(device, vectors));
  // Sensitivity: a shader whose carry is dropped must be caught.
  const broken = WGSL64.replace('return vec2<u32>(lo, a.y + b.y + carry);', 'return vec2<u32>(lo, a.y + b.y);');
  const bad = compare(vectors, await runOnGpu(device, vectors, broken));
  const sensitivity = { change: 'carry dropped from add64', intMismatch: bad.intMismatch, detected: bad.intMismatch > 0 };
  const info = adapter.info || {};
  device.destroy();
  return { ran: true, adapter: { vendor: info.vendor || '', architecture: info.architecture || '', description: info.description || '' }, cpu, gpu, sensitivity };
}

