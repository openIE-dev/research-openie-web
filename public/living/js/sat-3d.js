/** sat-3d-01 — textbook bliss utility surface orbit stub. modelled (textbook). */
import { $, markLive } from "./living-core.js";
import { createOrbitCanvas, gridSegs } from "./orbit3d.js";

export function initBliss3d() {
  const root = $("#sat-3d-01");
  if (!root) return;
  const canvas = root.querySelector("[data-sat-bliss-canvas]");
  const xsEl = root.querySelector("[data-xs]");
  const ysEl = root.querySelector("[data-ys]");
  const readout = root.querySelector("[data-bliss-readout]");
  const resetBtn = root.querySelector("[data-reset-bliss]");
  if (!canvas || !xsEl || !ysEl) return;

  let xs = Number(xsEl.value);
  let ys = Number(ysEl.value);
  const a = 1;
  const b = 1;
  let api;

  function U(x, y) {
    return -a * (x - xs) * (x - xs) - b * (y - ys) * (y - ys);
  }

  function draw() {
    if (!api) return;
    api.clear("#070b14");
    api.drawSegments(gridSegs(1.4, 0.35, -1.2), "#1e293b", 1);
    api.drawAxes(1.0);
    const segs = [];
    const n = 10;
    const lo = -0.2;
    const hi = 2.2;
    const step = (hi - lo) / n;
    for (let i = 0; i <= n; i++) {
      const row = [];
      for (let j = 0; j <= n; j++) {
        const x = lo + i * step;
        const y = lo + j * step;
        const z = U(x, y);
        // map: x→x, utility→y (up), y→z
        row.push([x - 1, z, y - 1]);
      }
      for (let j = 0; j < n; j++) segs.push([row[j], row[j + 1]]);
    }
    for (let j = 0; j <= n; j++) {
      for (let i = 0; i < n; i++) {
        const x0 = lo + i * step;
        const x1 = lo + (i + 1) * step;
        const y = lo + j * step;
        segs.push([
          [x0 - 1, U(x0, y), y - 1],
          [x1 - 1, U(x1, y), y - 1],
        ]);
      }
    }
    api.drawSegments(segs, "#5eead4", 1);
    // bliss peak
    api.drawPoints([[xs - 1, 0, ys - 1]], "#fbbf24", 6);
    // MU→0 ring (small ellipse around peak in xz)
    const ring = [];
    for (let k = 0; k <= 24; k++) {
      const t = (k / 24) * Math.PI * 2;
      const rx = 0.35 * Math.cos(t);
      const rz = 0.35 * Math.sin(t);
      ring.push([xs - 1 + rx, U(xs + rx, ys + rz), ys - 1 + rz]);
    }
    api.drawPolyline(ring, "#c4b5fd", 1.5);
    if (readout)
      readout.textContent = `x*=${xs.toFixed(2)} · y*=${ys.toFixed(2)} · a=b=1 · peak U=0 (textbook)`;
  }

  api = createOrbitCanvas(canvas, {
    yaw: 0.85,
    pitch: 0.55,
    dist: 5.2,
    onOrbit: draw,
  });

  const sync = () => {
    xs = Number(xsEl.value);
    ys = Number(ysEl.value);
    draw();
  };
  xsEl.addEventListener("input", sync);
  ysEl.addEventListener("input", sync);
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      xsEl.value = "1";
      ysEl.value = "1";
      sync();
    });
  }
  draw();
  markLive("sat-3d-01");
}
