// Living figure planet-04: the whole planet in WebGPU (PLN-031).
//
// Exact zone: every vertex is an integer point in metres from sphere.js; the
// camera is held in integer micrometres (BigInt). Tolerance zone: everything
// sent to the GPU. Each tile is drawn relative to its own centre, offset from
// the camera by a difference computed exactly and only then rounded to a
// 32-bit float. The "planet-centred" mode does what a naive engine does
// instead (32-bit world positions minus a 32-bit camera), to show the jitter.
import * as SP from '../sphere.js';

const $ = (id) => document.getElementById(id);
const SEED = 1234;
const N = 32;                 // quads per tile side
const MAX_LEVEL = 18;          // face edge / 2^18 is about 38 m per tile, 1.2 m per quad
const FACE_M = (Math.PI * SP.RADIUS_M) / 2;
const SKIRT_M = 40;
const GEN_BUDGET_MS = 12;      // tile generation per frame
// ?debug=clear paints the background red, to tell 'nothing drawn' from 'nothing captured'.
// ?offscreen renders into a texture and never configures the canvas. Headless Chromium on
// SwiftShader loses its GPU instance once a WebGPU canvas is configured, so checks use this.
const OFFSCREEN = new URLSearchParams(location.search).has('offscreen');
const CLEAR = new URLSearchParams(location.search).get('debug') === 'clear' ? { r: 1, g: 0, b: 0, a: 1 } : { r: 0.01, g: 0.015, b: 0.04, a: 1 };

// ---------------------------------------------------------------- small vector helpers (f64, view only)
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const norm = (a) => { const l = len(a); return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

// ---------------------------------------------------------------- camera (exact position in micrometres)
const cam = { lon: 0.35, lat: 0.45, alt: 2.5e7, tilt: 0, creep: false, creepUm: 0n };
let camUm = [0n, 0n, 0n];     // exact camera position, micrometres
let camM = [0, 0, 0];         // the same in f64 metres (view decisions only)

function dirOf(lon, lat) { return [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)]; }

// Elevation in metres under direction d (the exact function; the f64 direction only picks the point).
function elevationUnder(d) {
  const sea = d.map((c) => Math.round(c * SP.RADIUS_M));
  return SP.elevationMm(SEED, sea[0], sea[1], sea[2]) / 1000;
}
const groundUnder = (d) => Math.max(0, elevationUnder(d));

// Start over a coastline: walk east along the starting latitude until land meets sea.
function findCoast() {
  let prev = elevationUnder(dirOf(cam.lon, cam.lat)) > 0;
  for (let k = 1; k < 2000; k++) {
    const lon = cam.lon + k * 0.003, land = elevationUnder(dirOf(lon, cam.lat)) > 0;
    if (land !== prev) { cam.lon = lon; return; }
    prev = land;
  }
}

function updateCamera() {
  const d = dirOf(cam.lon, cam.lat);
  const r = SP.RADIUS_M + groundUnder(d) + cam.alt;
  const east = norm(cross([0, 1, 0], d)), north = cross(d, east);
  let p = scale(d, r);
  if (cam.creep) p = add(p, scale(east, Number(cam.creepUm) / 1e6));
  camM = p;
  camUm = p.map((c) => BigInt(Math.round(c * 1e6)));
  return { d, east, north };
}

// ---------------------------------------------------------------- tiles

const tiles = new Map();      // key -> { ready, centre:[m], centreUm:[BigInt], vbuf, radius }
const key = (f, l, x, y) => `${f}/${l}/${x}/${y}`;

function faceUV(level, ix, iy, i, j) {
  const span = (2 * SP.FACE_HALF) / 2 ** level; // exact: FACE_HALF is a power of two
  return [-SP.FACE_HALF + ix * span + (i * span) / N, -SP.FACE_HALF + iy * span + (j * span) / N];
}

function colourFor(e, y) { // e in metres, y in metres
  const lat = Math.abs(y) / SP.RADIUS_M;
  if (e <= 0) { const d = Math.min(1, -e / 4000); return [0.05 + 0.05 * (1 - d), 0.18 + 0.2 * (1 - d), 0.35 + 0.25 * (1 - d)]; }
  if (lat > 0.88 || e > 3800) return [0.92, 0.94, 0.97];
  if (e < 60) return [0.76, 0.70, 0.50];
  if (e < 1400) return [0.22 + e / 6000, 0.42, 0.16];
  return [0.45, 0.38, 0.30];
}

function buildTile(f, level, ix, iy) {
  // Exact sample grid in micrometres, with a one-sample border dropped by SKIRT_M (the skirt).
  const W = N + 3, pos = new Array(W * W), elev = new Array(W * W);
  const drop = BigInt(SKIRT_M) * 1000000n;
  for (let j = -1; j <= N + 1; j++) for (let i = -1; i <= N + 1; i++) {
    const ci = Math.min(N, Math.max(0, i)), cj = Math.min(N, Math.max(0, j));
    const [u, v] = faceUV(level, ix, iy, ci, cj);
    const s = SP.surfaceSample(SEED, f, u, v, ci !== i || cj !== j ? drop : 0n);
    pos[(j + 1) * W + (i + 1)] = s.surfaceUm; elev[(j + 1) * W + (i + 1)] = s.elevationMm / 1000;
  }
  const cUm = pos[(N / 2 + 1) * W + (N / 2 + 1)];          // tile centre, exact micrometres
  // Local positions relative to the centre: exact differences, then metres in f64.
  const loc = pos.map((p) => [0, 1, 2].map((k) => Number(p[k] - cUm[k]) / 1e6));
  const at = (i, j) => loc[Math.min(N + 1, Math.max(1, j)) * W + Math.min(N + 1, Math.max(1, i))]; // inner grid only
  const data = new Float32Array(W * W * 9);
  for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
    const k = j * W + i, ii = Math.min(N + 1, Math.max(1, i)), jj = Math.min(N + 1, Math.max(1, j));
    // Normals from the inner grid, so a skirt vertex shares the normal of its edge vertex.
    let n = norm(cross(sub(at(ii + 1, jj), at(ii - 1, jj)), sub(at(ii, jj + 1), at(ii, jj - 1))));
    const up = norm(cUm.map((c, q) => Number(c) / 1e6 + loc[k][q]));
    if (dot(n, up) < 0) n = scale(n, -1);
    const col = colourFor(elev[k], Number(pos[k][1]) / 1e6);
    data.set([loc[k][0], loc[k][1], loc[k][2], n[0], n[1], n[2], col[0], col[1], col[2]], k * 9);
  }
  const size = FACE_M / 2 ** level;
  return { centre: cUm.map((c) => Number(c) / 1e6), centreUm: cUm, data, size };
}

let indexBuffer, indexCount;
function makeIndices(device) {
  const W = N + 3, idx = [];
  for (let j = 0; j < W - 1; j++) for (let i = 0; i < W - 1; i++) {
    const a = j * W + i, b = a + 1, c = a + W, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  const arr = new Uint32Array(idx);
  indexBuffer = device.createBuffer({ size: arr.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST });
  device.queue.writeBuffer(indexBuffer, 0, arr);
  indexCount = arr.length;
}

// Choose the leaves to draw: split while the camera is close relative to the tile size.
function selectLeaves(fwd) {
  const out = [];
  const camDist = len(camM), horizon = Math.acos(Math.min(1, SP.RADIUS_M / camDist));
  const camDir = norm(camM);
  const visit = (f, l, x, y) => {
    const [u, v] = faceUV(l, x, y, N / 2, N / 2);
    const cdir = norm(SP.cubePoint(f, u, v));
    const size = FACE_M / 2 ** l;
    const ang = Math.acos(Math.max(-1, Math.min(1, dot(cdir, camDir))));
    if (ang > horizon + (1.2 * size) / SP.RADIUS_M + 0.02) return; // beyond the horizon
    const centre = scale(cdir, SP.RADIUS_M);
    const toNode = sub(centre, camM), dist = len(toNode);
    if (dot(toNode, fwd) < -1.5 * size) return;                       // entirely behind the camera
    if (l < MAX_LEVEL && dist < size * 2.2) {
      for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) visit(f, l + 1, 2 * x + dx, 2 * y + dy);
    } else out.push([f, l, x, y, dist]);
  };
  for (let f = 0; f < 6; f++) visit(f, 0, 0, 0);
  return out;
}

// ---------------------------------------------------------------- WebGPU

const SHADER = /* wgsl */ `
struct Frame { viewProj: mat4x4<f32>, sun: vec4<f32>, camPlanet: vec4<f32>, mode: vec4<u32> }
@group(0) @binding(0) var<uniform> F: Frame;
// Per tile: xyz = exact (centre - camera) in metres, rounded once; w unused.
// planet.xyz = the centre in planet coordinates as f32, for the naive mode.
struct Tile { rel: vec4<f32>, planet: vec4<f32> }
@group(0) @binding(1) var<storage, read> T: array<Tile>;

struct VOut { @builtin(position) pos: vec4<f32>, @location(0) n: vec3<f32>, @location(1) c: vec3<f32> }

@vertex fn vs(@location(0) local: vec3<f32>, @location(1) n: vec3<f32>, @location(2) c: vec3<f32>,
              @builtin(instance_index) inst: u32) -> VOut {
  let t = T[inst];
  var p: vec3<f32>;
  if (F.mode.x == 0u) {
    p = t.rel.xyz + local;                         // camera-relative
  } else {
    p = (t.planet.xyz + local) - F.camPlanet.xyz;  // planet-centred, as a naive engine does
  }
  var o: VOut;
  o.pos = F.viewProj * vec4<f32>(p, 1.0);
  o.n = n; o.c = c;
  return o;
}

@fragment fn fs(i: VOut) -> @location(0) vec4<f32> {
  let l = max(dot(normalize(i.n), F.sun.xyz), 0.0);
  return vec4<f32>(i.c * (0.12 + 0.88 * l), 1.0);
}
`;

// The adapter is kept for the page's lifetime: if it is garbage-collected, Chromium can lose
// the GPU instance under the device ("A valid external Instance reference no longer exists").
let offTex, gpuAdapter, device, context, pipeline, frameBuf, tileBuf, bindGroup, depthTex, format;
const MAX_DRAW = 4096;

async function initGpu() {
  if (!navigator.gpu) throw new Error('WebGPU is not available in this browser');
  gpuAdapter = await navigator.gpu.requestAdapter();
  if (!gpuAdapter) throw new Error('no WebGPU adapter');
  device = await gpuAdapter.requestDevice();
  device.addEventListener('uncapturederror', (e) => console.error('WebGPU error:', e.error.message));
  device.lost.then((i) => console.error('WebGPU device lost:', i.reason, i.message));
  const info = gpuAdapter.info || {};
  $('adapter').textContent = [info.vendor, info.architecture, info.description].filter(Boolean).join(' · ') || 'not reported';
  format = navigator.gpu.getPreferredCanvasFormat();
  if (!OFFSCREEN) {
    context = $('view').getContext('webgpu');
    context.configure({ device, format, alphaMode: 'opaque' });
  }
  const module = device.createShaderModule({ code: SHADER });
  pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: { module, entryPoint: 'vs', buffers: [{ arrayStride: 36, attributes: [
      { shaderLocation: 0, offset: 0, format: 'float32x3' },
      { shaderLocation: 1, offset: 12, format: 'float32x3' },
      { shaderLocation: 2, offset: 24, format: 'float32x3' }] }] },
    fragment: { module, entryPoint: 'fs', targets: [{ format }] },
    primitive: { topology: 'triangle-list', cullMode: 'none' },
    depthStencil: { format: 'depth32float', depthWriteEnabled: true, depthCompare: 'greater' }, // reversed Z
  });
  frameBuf = device.createBuffer({ size: 112, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  tileBuf = device.createBuffer({ size: MAX_DRAW * 32, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
  bindGroup = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [
    { binding: 0, resource: { buffer: frameBuf } }, { binding: 1, resource: { buffer: tileBuf } }] });
  makeIndices(device);
}

function resize() {
  const c = $('view'), dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.floor(c.clientWidth * dpr)), h = Math.max(1, Math.floor(c.clientHeight * dpr));
  if (c.width !== w || c.height !== h || !depthTex) {
    c.width = w; c.height = h;
    depthTex?.destroy();
    depthTex = device.createTexture({ size: [w, h], format: 'depth32float', usage: GPUTextureUsage.RENDER_ATTACHMENT });
    if (OFFSCREEN) { offTex?.destroy(); offTex = device.createTexture({ size: [w, h], format, usage: GPUTextureUsage.RENDER_ATTACHMENT }); }
  }
}

// Column-major view-projection: camera rotation (no translation: positions are already
// camera-relative) and an infinite reversed-Z perspective.
function viewProj(fwd, up, aspect, near) {
  const z = scale(fwd, -1), x = norm(cross(up, z)), y = cross(z, x);
  const f = 1 / Math.tan((55 * Math.PI) / 360);
  const V = [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, 0, 0, 0, 1];
  const P = [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, 0, -1, 0, 0, near, 0];
  const M = new Array(16).fill(0);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) M[c * 4 + r] += P[k * 4 + r] * V[c * 4 + k];
  return M;
}

// ---------------------------------------------------------------- frame loop

let lastList = [], pendingCapture = null;

function encodeDraw(colorView, extra) {
  const enc = device.createCommandEncoder();
  const pass = enc.beginRenderPass({
    colorAttachments: [{ view: colorView, clearValue: CLEAR, loadOp: 'clear', storeOp: 'store' }],
    depthStencilAttachment: { view: depthTex.createView(), depthClearValue: 0, depthLoadOp: 'clear', depthStoreOp: 'store' },
  });
  pass.setPipeline(pipeline); pass.setBindGroup(0, bindGroup); pass.setIndexBuffer(indexBuffer, 'uint32');
  lastList.forEach((t, i) => { pass.setVertexBuffer(0, t.vbuf); pass.drawIndexed(indexCount, 1, 0, 0, i); });
  pass.end();
  extra?.(enc);
  device.queue.submit([enc.finish()]);
}

// Render the current frame into an offscreen texture and return it as a PNG data URL.
// Headless browsers do not always capture a WebGPU canvas in screenshots; this does.
async function capture() {
  const c = $('view'), w = c.width, h = c.height;
  const tex = device.createTexture({ size: [w, h], format, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC });
  const bpr = Math.ceil((w * 4) / 256) * 256;
  const buf = device.createBuffer({ size: bpr * h, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
  encodeDraw(tex.createView(), (enc) => enc.copyTextureToBuffer({ texture: tex }, { buffer: buf, bytesPerRow: bpr }, [w, h]));
  await buf.mapAsync(GPUMapMode.READ);
  const src = new Uint8Array(buf.getMappedRange()), img = new ImageData(w, h), bgra = format.startsWith('bgra');
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * bpr + x * 4, o = (y * w + x) * 4;
    img.data[o] = src[i + (bgra ? 2 : 0)]; img.data[o + 1] = src[i + 1]; img.data[o + 2] = src[i + (bgra ? 0 : 2)]; img.data[o + 3] = 255;
  }
  buf.unmap(); buf.destroy(); tex.destroy();
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  cv.getContext('2d').putImageData(img, 0, 0);
  return cv.toDataURL('image/png');
}
function frame() {
  const t0 = performance.now();
  resize();
  if (cam.creep) cam.creepUm += 5000n; // 5 mm per frame
  const { d, north } = updateCamera();
  // Look: straight down far away; tilt towards the northern horizon near the ground.
  const tilt = (cam.tilt * Math.PI) / 180;
  const fwd = norm(add(scale(d, -Math.cos(tilt)), scale(north, Math.sin(tilt))));
  const leaves = selectLeaves(fwd);

  // Generate missing tiles nearest first, within a time budget; draw the nearest ready ancestor meanwhile.
  const missing = leaves.filter(([f, l, x, y]) => !tiles.has(key(f, l, x, y))).sort((a, b) => a[1] - b[1] || a[4] - b[4]);
  const tg = performance.now();
  for (const [f, l, x, y] of missing) {
    if (performance.now() - tg > GEN_BUDGET_MS) break;
    const t = buildTile(f, l, x, y);
    t.vbuf = device.createBuffer({ size: t.data.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST });
    device.queue.writeBuffer(t.vbuf, 0, t.data);
    t.data = null;
    tiles.set(key(f, l, x, y), t);
  }
  const draw = new Map();
  for (const [f, l, x, y] of leaves) {
    let L = l, X = x, Y = y;
    while (L > 0 && !tiles.has(key(f, L, X, Y))) { L--; X >>= 1; Y >>= 1; }
    const k = key(f, L, X, Y);
    if (tiles.has(k)) draw.set(k, tiles.get(k));
  }

  // Per-tile offsets: exact difference in micrometres, rounded to f32 metres once.
  const list = [...draw.values()].slice(0, MAX_DRAW);
  const tileData = new Float32Array(list.length * 8);
  list.forEach((t, i) => {
    const rel = t.centreUm.map((c, k) => Number(c - camUm[k]) / 1e6);
    tileData.set([rel[0], rel[1], rel[2], 0, t.centre[0], t.centre[1], t.centre[2], 0], i * 8);
  });
  device.queue.writeBuffer(tileBuf, 0, tileData);

  const up = Math.abs(dot(fwd, north)) > 0.99 ? d : north;
  const c = $('view');
  const near = Math.max(0.05, Math.min(1000, cam.alt * 0.02));
  const vp = viewProj(fwd, up, c.width / c.height, near);
  const sun = norm([0.6, 0.45, 0.66]);
  const fb = new ArrayBuffer(112);
  new Float32Array(fb, 0, 16).set(vp);
  new Float32Array(fb, 64, 8).set([sun[0], sun[1], sun[2], 0, camM[0], camM[1], camM[2], 0]);
  new Uint32Array(fb, 96, 4).set([$('mode').value === 'naive' ? 1 : 0, 0, 0, 0]);
  device.queue.writeBuffer(frameBuf, 0, fb);

  lastList = list;
  encodeDraw(OFFSCREEN ? offTex.createView() : context.getCurrentTexture().createView());
  if (pendingCapture) { const r = pendingCapture; pendingCapture = null; capture().then(r, (e) => r('error: ' + (e.message || e))); }

  const maxL = leaves.reduce((m, l) => Math.max(m, l[1]), 0);
  $('stats').innerHTML = `
    <dt>altitude</dt><dd>${fmtDist(cam.alt)}</dd>
    <dt>distance from centre</dt><dd>${fmtDist(len(camM))}</dd>
    <dt>tiles drawn</dt><dd>${list.length} (wanted ${leaves.length}, ${missing.length} still to build)</dd>
    <dt>finest level</dt><dd>${maxL} (quad about ${fmtDist(FACE_M / 2 ** maxL / N)})</dd>
    <dt>tiles in memory</dt><dd>${tiles.size}</dd>
    <dt>frame (CPU)</dt><dd>${(performance.now() - t0).toFixed(1)} ms</dd>`;
  window.__globeStats = { tiles: list.length, wanted: leaves.length, missing: missing.length, maxLevel: maxL };
  requestAnimationFrame(frame);
}

function fmtDist(m) {
  if (m >= 1e6) return `${(m / 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })} km`;
  if (m >= 1000) return `${(m / 1000).toFixed(2)} km`;
  if (m >= 1) return `${m.toFixed(2)} m`;
  return `${(m * 1000).toFixed(1)} mm`;
}

// ---------------------------------------------------------------- controls

const ALT_MIN = 1.5, ALT_MAX = 4e8;
const altFromSlider = (v) => ALT_MIN * (ALT_MAX / ALT_MIN) ** (v / 1000);
const sliderFromAlt = (a) => Math.round((1000 * Math.log(a / ALT_MIN)) / Math.log(ALT_MAX / ALT_MIN));

function setAlt(a) { cam.alt = Math.min(ALT_MAX, Math.max(ALT_MIN, a)); $('alt').value = sliderFromAlt(cam.alt); }

function bind() {
  $('alt').addEventListener('input', (e) => { cam.alt = altFromSlider(Number(e.target.value)); });
  $('tilt').addEventListener('input', (e) => { cam.tilt = Number(e.target.value); });
  $('creep').addEventListener('change', (e) => { cam.creep = e.target.checked; cam.creepUm = 0n; });
  for (const [id, alt, tilt] of [['p-space', 2.5e7, 0], ['p-orbit', 4e5, 30], ['p-ground', 2, 78], ['p-moon', 3.844e8, 0]]) {
    $(id).addEventListener('click', () => { setAlt(alt); cam.tilt = tilt; $('tilt').value = tilt; });
  }
  let drag = null;
  const c = $('view');
  c.addEventListener('pointerdown', (e) => { drag = [e.clientX, e.clientY]; c.setPointerCapture(e.pointerId); });
  c.addEventListener('pointerup', () => { drag = null; });
  c.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const k = Math.min(1.5, (cam.alt + 3000) / SP.RADIUS_M) * 0.004;
    cam.lon -= (e.clientX - drag[0]) * k / Math.max(0.2, Math.cos(cam.lat));
    cam.lat = Math.max(-1.5, Math.min(1.5, cam.lat + (e.clientY - drag[1]) * k));
    drag = [e.clientX, e.clientY];
  });
  c.addEventListener('wheel', (e) => { e.preventDefault(); setAlt(cam.alt * Math.exp(e.deltaY * 0.0015)); }, { passive: false });
}

// For headless checks: put the camera somewhere and report when tiles are built.
window.__globe = {
  set(o) { Object.assign(cam, o); if (o.alt) setAlt(o.alt); if ('tilt' in o) $('tilt').value = o.tilt; if (o.mode) $('mode').value = o.mode; },
  stats: () => window.__globeStats,
  capture: () => new Promise((r) => { pendingCapture = r; }),
  device: () => device,
};

(async () => {
  try {
    await initGpu();
    bind();
    findCoast();
    setAlt(cam.alt);
    requestAnimationFrame(frame);
  } catch (e) {
    $('fallback').hidden = false;
    $('fallback').textContent = `This figure needs WebGPU. ${e.message}. The exact-zone checks it relies on run in Node: node scripts/planet/test-sphere.mjs.`;
  }
})();
