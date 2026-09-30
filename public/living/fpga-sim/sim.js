/**
 * Stage B living figure: load Rust WASM decision core, paint with WebGPU.
 * Decision results always come from WASM. GPU path is visualization only.
 * GPU time is not joules. board_synth_claimed stays false.
 */
import init, {
  runSeed1,
  lutTableBytes,
  lutMemSha256,
  boardSynthClaimed,
} from "./pkg/wca_fpga_sim.js";

const $ = (id) => document.getElementById(id);

function fmtJ(j) {
  if (typeof j !== "number" || Number.isNaN(j)) return String(j);
  return j.toExponential(6);
}

function fillMetrics(bundle) {
  const a = bundle.agreement;
  const okEl = $("m-ok");
  okEl.textContent = a.ok ? "PASS (bit-agree with Stage A seed-1)" : "FAIL";
  okEl.className = a.ok ? "ok" : "bad";
  $("m-c").textContent = `${a.committed} (expected ${a.expected_committed})`;
  $("m-r").textContent = `${a.refused} (expected ${a.expected_refused})`;
  $("m-eo").textContent = `${a.energy_only} (expected ${a.expected_energy_only})`;
  $("m-j").textContent = fmtJ(a.episode_joules);
  $("m-dj").textContent = fmtJ(a.joules_abs_err);
  $("m-cs").textContent = a.commit_step == null ? "none" : String(a.commit_step);
  $("m-ops").textContent =
    `bram=${a.ops_bram} lut_reads=${a.ops_lut_reads} lut6_toggles=${a.ops_lut6_toggles} ph_muls=${a.ops_ph_muls} ph_adds=${a.ops_ph_adds}`;
  $("m-mask").textContent = String(a.allow_mask);
  $("m-hash").textContent = a.lut_mem_sha256;
  $("m-board").textContent = String(a.board_synth_claimed);
}

function fillTrace(steps) {
  const tb = $("trace").querySelector("tbody");
  tb.innerHTML = "";
  for (const s of steps) {
    const tr = document.createElement("tr");
    const cls = s.commit ? "commit-yes" : "commit-no";
    tr.innerHTML = `
      <td>${s.i}</td>
      <td>${s.lut_allow}</td>
      <td>${s.energy_ok}</td>
      <td class="${cls}">${s.commit}</td>
      <td>0b${s.bits.toString(2).padStart(4, "0")}</td>
      <td>${s.u.toFixed(3)}</td>
      <td>${s.theta.toFixed(4)}</td>
      <td>${s.omega.toFixed(4)}</td>
      <td>${s.vdot_q}</td>`;
    tb.appendChild(tr);
  }
}

/** WebGPU: paint LUT row (16 cells) + commit/refuse bars for the 16-step trace. */
async function paintWebGpu(lutBits, steps) {
  const canvas = $("gpu-canvas");
  const status = $("gpu-status");
  if (!navigator.gpu) {
    status.textContent =
      "WebGPU unavailable in this browser. WASM trace above remains the result. GPU path did not confirm the paint.";
    paintCanvas2dFallback(canvas, lutBits, steps);
    return { gpu: false, reason: "no_navigator_gpu" };
  }
  let adapter;
  try {
    adapter = await navigator.gpu.requestAdapter();
  } catch (e) {
    status.textContent = `WebGPU adapter request failed (${e}). WASM trace remains the result.`;
    paintCanvas2dFallback(canvas, lutBits, steps);
    return { gpu: false, reason: "adapter_fail" };
  }
  if (!adapter) {
    status.textContent =
      "No WebGPU adapter. WASM trace remains the result. GPU path did not confirm the paint.";
    paintCanvas2dFallback(canvas, lutBits, steps);
    return { gpu: false, reason: "no_adapter" };
  }
  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: "opaque" });

  // Pack RGBA8: row0 = LUT (16 cells), row1 = commit flags, rest gradient fill via shader.
  const W = 16;
  const H = 2;
  const pixels = new Uint8Array(W * H * 4);
  for (let i = 0; i < 16; i++) {
    const allow = lutBits[i] ? 1 : 0;
    const o = i * 4;
    if (allow) {
      pixels[o] = 52; pixels[o + 1] = 211; pixels[o + 2] = 153; pixels[o + 3] = 255;
    } else {
      pixels[o] = 248; pixels[o + 1] = 113; pixels[o + 2] = 113; pixels[o + 3] = 255;
    }
  }
  for (let i = 0; i < 16; i++) {
    const commit = steps[i] && steps[i].commit;
    const o = (W + i) * 4;
    if (commit) {
      pixels[o] = 94; pixels[o + 1] = 234; pixels[o + 2] = 212; pixels[o + 3] = 255;
    } else if (steps[i] && steps[i].lut_allow && !steps[i].energy_ok) {
      pixels[o] = 251; pixels[o + 1] = 191; pixels[o + 2] = 36; pixels[o + 3] = 255;
    } else {
      pixels[o] = 248; pixels[o + 1] = 113; pixels[o + 2] = 113; pixels[o + 3] = 255;
    }
  }

  const texture = device.createTexture({
    size: [W, H],
    format: "rgba8unorm",
    usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
  });
  device.queue.writeTexture({ texture }, pixels, { bytesPerRow: W * 4 }, [W, H]);

  const shader = device.createShaderModule({
    code: `
struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
};
@vertex fn vs(@builtin(vertex_index) i: u32) -> VSOut {
  var p = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0)
  );
  var o: VSOut;
  o.pos = vec4f(p[i], 0.0, 1.0);
  o.uv = vec2f(p[i].x * 0.5 + 0.5, 1.0 - (p[i].y * 0.5 + 0.5));
  return o;
}
@group(0) @binding(0) var samp: sampler;
@group(0) @binding(1) var tex: texture_2d<f32>;
@fragment fn fs(in: VSOut) -> @location(0) vec4f {
  // Nearest-style sampling of LUT (top half) and trace (bottom half)
  let uv = in.uv;
  let cell = vec2f(uv.x * 16.0, select(0.75, 0.25, uv.y < 0.5));
  return textureSample(tex, samp, vec2f(cell.x / 16.0, cell.y));
}
`,
  });

  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: shader, entryPoint: "vs" },
    fragment: {
      module: shader,
      entryPoint: "fs",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list" },
  });

  const sampler = device.createSampler({ magFilter: "nearest", minFilter: "nearest" });
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: sampler },
      { binding: 1, resource: texture.createView() },
    ],
  });

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.01, g: 0.02, b: 0.05, a: 1 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.draw(6);
  pass.end();
  device.queue.submit([encoder.finish()]);

  status.textContent =
    "WebGPU painted LUT (top: green=allow, red=refuse address) and step trace (bottom: teal=commit, amber=energy refuse, red=other refuse). GPU time is not joules. Trace values come from WASM.";
  return { gpu: true };
}

function paintCanvas2dFallback(canvas, lutBits, steps) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, w, h);
  const cellW = w / 16;
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = lutBits[i] ? "#34d399" : "#f87171";
    ctx.fillRect(i * cellW + 1, 8, cellW - 2, h / 2 - 16);
  }
  for (let i = 0; i < 16; i++) {
    const s = steps[i];
    let color = "#f87171";
    if (s && s.commit) color = "#5eead4";
    else if (s && s.lut_allow && !s.energy_ok) color = "#fbbf24";
    ctx.fillStyle = color;
    ctx.fillRect(i * cellW + 1, h / 2 + 8, cellW - 2, h / 2 - 16);
  }
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px monospace";
  ctx.fillText("Canvas 2D fallback (no WebGPU). WASM trace is authoritative.", 8, h - 8);
}

async function run() {
  const status = $("status");
  status.textContent = "Running seed-1 in WASM…";
  const t0 = performance.now();
  const bundle = runSeed1();
  const ms = performance.now() - t0;
  fillMetrics(bundle);
  fillTrace(bundle.steps);
  const lut = lutTableBytes();
  await paintWebGpu(Array.from(lut), bundle.steps);
  status.textContent = `WASM seed-1 done in ${ms.toFixed(2)} ms (wall clock in browser; not joules). agreement.ok=${bundle.agreement.ok}`;
}

async function main() {
  const status = $("status");
  try {
    await init();
    status.textContent = `WASM ready. board_synth_claimed=${boardSynthClaimed()} · LUT sha256=${lutMemSha256().slice(0, 16)}…`;
    $("btn-run").addEventListener("click", () => {
      run().catch((e) => {
        $("status").textContent = `Run failed: ${e}`;
      });
    });
    await run();
  } catch (e) {
    status.textContent = `WASM init failed: ${e}`;
    console.error(e);
  }
}

main();
