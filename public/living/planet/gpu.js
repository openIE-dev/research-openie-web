// Planet generator G on the GPU (WGSL, 32-bit integers only), and a parity check
// against the exact reference in core.js. Hypothesis PL-H1 of the study: the
// integer generator gives identical cells on every target. WGSL specifies that
// integer overflow wraps modulo 2^32 and that >> on i32 is arithmetic, which are
// the same semantics core.js uses.
import { generatePacked, SEA } from './core.js';

export const WGSL = /* wgsl */ `
struct Params { seed: u32, W: u32, H: u32, sea: u32 }
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> outBuf: array<u32>;

fn mix32(h0: u32) -> u32 {
  var h = h0;
  h ^= h >> 16u; h *= 0x7feb352du;
  h ^= h >> 15u; h *= 0x846ca68bu;
  h ^= h >> 16u;
  return h;
}
fn hash3(seed: u32, x: u32, y: u32) -> u32 {
  let h = mix32(seed ^ (x * 0x9e3779b1u));
  return mix32(h ^ (y * 0x85ebca77u));
}
fn octSeed(seed: u32, k: u32) -> u32 { return mix32(seed ^ ((k + 1u) * 0x27d4eb2du)); }
fn smooth8(t: i32) -> i32 { return (t * t * (768 - 2 * t)) >> 16u; }
fn lerp8(a: i32, b: i32, s: i32) -> i32 { return a + (((b - a) * s) >> 8u); }

fn valueNoise(seed: u32, x: u32, y: u32, k: u32, W: u32) -> i32 {
  let nx = W >> k;
  let lx = x >> k; let ly = y >> k;
  let mask = (1u << k) - 1u;
  let sx = smooth8(i32(((x & mask) << 8u) >> k));
  let sy = smooth8(i32(((y & mask) << 8u) >> k));
  let ax = lx % nx; let bx = (lx + 1u) % nx;
  let v00 = i32(hash3(seed, ax, ly) & 0xffffu);
  let v10 = i32(hash3(seed, bx, ly) & 0xffffu);
  let v01 = i32(hash3(seed, ax, ly + 1u) & 0xffffu);
  let v11 = i32(hash3(seed, bx, ly + 1u) & 0xffffu);
  return lerp8(lerp8(v00, v10, sx), lerp8(v01, v11, sx), sy);
}

fn elevation(seed: u32, x: u32, y: u32, W: u32) -> u32 {
  var sum = 0u;
  sum += u32(valueNoise(octSeed(seed, 6u), x, y, 6u, W)) * 16u;
  sum += u32(valueNoise(octSeed(seed, 5u), x, y, 5u, W)) * 8u;
  sum += u32(valueNoise(octSeed(seed, 4u), x, y, 4u, W)) * 4u;
  sum += u32(valueNoise(octSeed(seed, 3u), x, y, 3u, W)) * 2u;
  sum += u32(valueNoise(octSeed(seed, 2u), x, y, 2u, W));
  return sum / 31u;
}

fn material(seed: u32, x: u32, y: u32, e: u32, W: u32, H: u32) -> u32 {
  let g = i32(e >> 6u);
  let sea = i32(P.sea);
  let lat = abs(2 * i32(y) - (i32(H) - 1));
  let polar = lat * 6 >= (i32(H) - 1) * 5;
  if (g < sea - 40) { return select(1u, 5u, polar); }
  if (polar) { return 5u; }
  if (g < sea + 6) { return 2u; }
  let ore = hash3(octSeed(seed, 20u), x, y) & 0xffffu;
  if (ore < 20u) { return 7u; }
  if (ore < 400u) { return 6u; }
  let rock = valueNoise(octSeed(seed, 21u), x, y, 4u, W);
  if (rock > 32768 && g < sea + 150) { return 3u; }
  return 4u;
}

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;
  if (i >= P.W * P.H) { return; }
  let x = i % P.W; let y = i / P.W;
  let e = elevation(P.seed, x, y, P.W);
  outBuf[i] = e | (material(P.seed, x, y, e, P.W, P.H) << 16u);
}
`;

// Generate a W x H grid on the GPU. Returns a Uint32Array of packed cells.
export async function generateOnGpu(device, seed, W, H, code = WGSL) {
  const n = W * H;
  const module = device.createShaderModule({ code });
  const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module, entryPoint: 'main' } });
  const params = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  device.queue.writeBuffer(params, 0, new Uint32Array([seed >>> 0, W, H, SEA]));
  const out = device.createBuffer({ size: n * 4, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC });
  const read = device.createBuffer({ size: n * 4, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
  const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
    { binding: 0, resource: { buffer: params } }, { binding: 1, resource: { buffer: out } },
  ] });
  const enc = device.createCommandEncoder();
  const pass = enc.beginComputePass();
  pass.setPipeline(pipeline); pass.setBindGroup(0, bind);
  const groups = Math.ceil(n / 64);
  const maxX = device.limits.maxComputeWorkgroupsPerDimension;
  if (groups > maxX) throw new Error(`grid too large for one dispatch: ${groups} workgroups`);
  pass.dispatchWorkgroups(groups);
  pass.end();
  enc.copyBufferToBuffer(out, 0, read, 0, n * 4);
  device.queue.submit([enc.finish()]);
  await read.mapAsync(GPUMapMode.READ);
  const data = new Uint32Array(read.getMappedRange().slice(0));
  read.unmap();
  for (const b of [params, out, read]) b.destroy();
  return data;
}

export async function getDevice() {
  if (!globalThis.navigator?.gpu) return { error: 'WebGPU is not available in this browser' };
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) return { error: 'no WebGPU adapter' };
  const device = await adapter.requestDevice();
  const info = adapter.info || {};
  return { device, adapter: { vendor: info.vendor || '', architecture: info.architecture || '', device: info.device || '', description: info.description || '' } };
}

// Compare GPU and reference output over several seeds. Returns a plain object
// suitable for JSON: cells compared, mismatches, first mismatch, adapter info.
export async function checkParity({ seeds = [1, 7, 1234, 99991], W = 1024, H = 512, onProgress } = {}) {
  const got = await getDevice();
  if (got.error) return { ran: false, reason: got.error };
  const runs = [];
  let cells = 0, mismatches = 0, first = null;
  for (const seed of seeds) {
    const t0 = performance.now();
    const gpu = await generateOnGpu(got.device, seed, W, H);
    const t1 = performance.now();
    const ref = generatePacked(seed, W, H);
    const t2 = performance.now();
    let mm = 0;
    for (let i = 0; i < ref.length; i++) if (gpu[i] !== ref[i]) {
      mm++;
      if (!first) first = { seed, x: i % W, y: Math.floor(i / W), gpu: gpu[i], ref: ref[i] };
    }
    cells += ref.length; mismatches += mm;
    runs.push({ seed, W, H, mismatches: mm, gpuMs: Math.round(t1 - t0), referenceMs: Math.round(t2 - t1) });
    onProgress?.(runs[runs.length - 1]);
  }
  // Mutation check: a one-bit change to a hash constant must be caught, or the
  // comparison above proves nothing.
  const mutant = WGSL.replace('0x846ca68bu', '0x846ca68au');
  const mg = await generateOnGpu(got.device, seeds[0], W, H, mutant);
  const mr = generatePacked(seeds[0], W, H);
  let mutationMismatches = 0;
  for (let i = 0; i < mr.length; i++) if (mg[i] !== mr[i]) mutationMismatches++;
  got.device.destroy();
  return { ran: true, adapter: got.adapter, userAgent: navigator.userAgent, cells, mismatches, first, runs, mutationCheck: { change: 'mix32 constant 0x846ca68b -> 0x846ca68a', cells: mr.length, mismatches: mutationMismatches, detected: mutationMismatches > 0 } };
}
