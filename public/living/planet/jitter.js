// The arithmetic under PL-H9: how far from its true place a vertex near the camera
// lands, before projection, under two ways of feeding positions to the GPU.
//
//   naive:    (f32(tile centre in planet coordinates) + local) - f32(camera)
//   relative: f32(exact tile centre - exact camera) + local      (globe.js, this design)
//
// The exact answer is (tile centre + local) - camera in integer micrometres (BigInt).
// Projection adds its own rounding on top; this isolates the part that grows with
// distance from the planet's centre.
import { mix32 } from './core.js';

export const PLACES = [
  { name: 'surface', radiusM: 6371002 },
  { name: 'inside the core, 1,000 km from the centre', radiusM: 1000000 },
  { name: 'lunar distance', radiusM: 384400000 },
  { name: "Neptune's distance from the Sun", radiusM: 4.5e12 },
];

const WGSL = /* wgsl */ `
struct Case { planetT: vec4<f32>, local: vec4<f32>, cam: vec4<f32>, relT: vec4<f32> }
struct Out { naive: vec4<f32>, rel: vec4<f32> }
@group(0) @binding(0) var<storage, read> cases: array<Case>;
@group(0) @binding(1) var<storage, read_write> outs: array<Out>;
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let i = id.x;
  if (i >= arrayLength(&cases)) { return; }
  let c = cases[i];
  outs[i] = Out(vec4<f32>((c.planetT.xyz + c.local.xyz) - c.cam.xyz, 0.0), vec4<f32>(c.relT.xyz + c.local.xyz, 0.0));
}
`;

function makeCases(place, n) {
  const out = [];
  let h = mix32(Math.floor(place.radiusM) % 2147483647);
  const rnd = () => { h = mix32(h + 0x9e3779b9); return h / 2 ** 32; };
  const R = BigInt(Math.round(place.radiusM)) * 1000000n;
  for (let i = 0; i < n; i++) {
    // Direction from a few hashed angles, then the camera at radius R plus a sub-millimetre offset.
    const lon = rnd() * 2 * Math.PI, lat = (rnd() - 0.5) * Math.PI;
    const d = [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
    const C = d.map((x) => BigInt(Math.round(x * 1e6)) * (R / 1000000n) + BigInt(Math.floor(rnd() * 1000)));
    // Tile centre: integer metres within 50 m of the camera; vertex within 40 m of the centre.
    const T = C.map((c) => (c / 1000000n + BigInt(Math.floor(rnd() * 101) - 50)) * 1000000n);
    const local = [0, 1, 2].map(() => Math.floor(rnd() * 81) - 40);
    const exactM = [0, 1, 2].map((k) => Number(T[k] + BigInt(local[k]) * 1000000n - C[k]) / 1e6);
    out.push({
      planetT: T.map((t) => Number(t / 1000000n)),
      local, cam: C.map((c) => Number(c) / 1e6),
      relT: T.map((t, k) => Number(t - C[k]) / 1e6),
      exactM,
    });
  }
  return out;
}

export async function checkJitter({ n = 4096 } = {}) {
  if (!globalThis.navigator?.gpu) return { ran: false, reason: 'WebGPU is not available' };
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) return { ran: false, reason: 'no WebGPU adapter' };
  const device = await adapter.requestDevice();
  const pipeline = device.createComputePipeline({ layout: 'auto', compute: { module: device.createShaderModule({ code: WGSL }), entryPoint: 'main' } });
  const results = [];
  for (const place of PLACES) {
    const cases = makeCases(place, n);
    const data = new Float32Array(n * 16);
    cases.forEach((c, i) => data.set([...c.planetT, 0, ...c.local, 0, ...c.cam, 0, ...c.relT, 0], i * 16));
    const inBuf = device.createBuffer({ size: data.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(inBuf, 0, data);
    const outBuf = device.createBuffer({ size: n * 32, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC });
    const read = device.createBuffer({ size: n * 32, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
    const bind = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
      { binding: 0, resource: { buffer: inBuf } }, { binding: 1, resource: { buffer: outBuf } }] });
    const enc = device.createCommandEncoder();
    const pass = enc.beginComputePass();
    pass.setPipeline(pipeline); pass.setBindGroup(0, bind); pass.dispatchWorkgroups(Math.ceil(n / 64)); pass.end();
    enc.copyBufferToBuffer(outBuf, 0, read, 0, n * 32);
    device.queue.submit([enc.finish()]);
    await read.mapAsync(GPUMapMode.READ);
    const o = new Float32Array(read.getMappedRange().slice(0));
    read.unmap();
    let naiveMax = 0, relMax = 0;
    cases.forEach((c, i) => {
      const e = (a) => 1000 * Math.hypot(a[0] - c.exactM[0], a[1] - c.exactM[1], a[2] - c.exactM[2]);
      naiveMax = Math.max(naiveMax, e([o[i * 8], o[i * 8 + 1], o[i * 8 + 2]]));
      relMax = Math.max(relMax, e([o[i * 8 + 4], o[i * 8 + 5], o[i * 8 + 6]]));
    });
    results.push({ place: place.name, distanceFromCentreM: place.radiusM, vertices: n, maxErrorMm: { naive: Number(naiveMax.toPrecision(3)), relative: Number(relMax.toPrecision(3)) } });
    for (const b of [inBuf, outBuf, read]) b.destroy();
  }
  const info = adapter.info || {};
  device.destroy();
  return { ran: true, adapter: { vendor: info.vendor || '', architecture: info.architecture || '' }, results };
}
