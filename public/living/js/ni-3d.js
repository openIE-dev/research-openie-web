/** ni-3d-01 — pure-canvas plant orbit stub. illustrative / modelled (toy). */
import { $, markLive } from "./living-core.js";
import { createOrbitCanvas, gridSegs } from "./orbit3d.js";

function toyGate(th, om) {
  const E = 0.5 * om * om + (1 - Math.cos(th));
  const energy_ok = E < 2.8;
  const lut_allow = Math.abs(th) < 2.2;
  return { allow: energy_ok && lut_allow, E, energy_ok, lut_allow };
}

export function initPlant3d() {
  const root = $("#ni-3d-01");
  if (!root) return;
  const canvas = root.querySelector("[data-ni-plant-canvas]");
  const thetaEl = root.querySelector("[data-theta]");
  const omegaEl = root.querySelector("[data-omega]");
  const readout = root.querySelector("[data-plant-readout]");
  const gateChip = root.querySelector("[data-gate-chip]");
  const resetBtn = root.querySelector("[data-reset-plant]");
  if (!canvas || !thetaEl || !omegaEl) return;

  let theta = Number(thetaEl.value);
  let omega = Number(omegaEl.value);
  let api;

  function draw() {
    if (!api) return;
    api.clear("#070b14");
    api.drawSegments(gridSegs(1.6, 0.4, 0), "#1e293b", 1);
    api.drawAxes(1.1);
    api.drawSegments(
      [
        [
          [-0.35, 0, 0],
          [0.35, 0, 0],
        ],
      ],
      "#64748b",
      3
    );
    const L = 1.15;
    const tip = [L * Math.sin(theta), 0.05, -L * Math.cos(theta)];
    const pivot = [0, 0.05, 0];
    const g = toyGate(theta, omega);
    const color = g.allow ? "#34d399" : "#f87171";
    api.drawSegments([[pivot, tip]], color, 3);
    api.drawPoints([pivot], "#e2e8f0", 4);
    api.drawPoints([tip], color, 5);
    const tip2 = [tip[0], Math.max(-1.2, Math.min(1.2, omega * 0.18)), tip[2]];
    api.drawSegments([[tip, tip2]], "#fbbf24", 2);
    if (readout)
      readout.textContent = `θ=${theta.toFixed(2)} · ω=${omega.toFixed(2)} · E≈${g.E.toFixed(2)} (toy)`;
    if (gateChip) {
      gateChip.textContent = g.allow ? "gate: ALLOW (toy paint)" : "gate: REFUSE (toy paint)";
      gateChip.className = "chip " + (g.allow ? "measured" : "needs");
    }
  }

  api = createOrbitCanvas(canvas, {
    yaw: 0.7,
    pitch: 0.4,
    dist: 4.5,
    onOrbit: draw,
  });

  const sync = () => {
    theta = Number(thetaEl.value);
    omega = Number(omegaEl.value);
    draw();
  };
  thetaEl.addEventListener("input", sync);
  omegaEl.addEventListener("input", sync);
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      thetaEl.value = "1.5";
      omegaEl.value = "3.0";
      sync();
    });
  }
  draw();
  markLive("ni-3d-01");
}
