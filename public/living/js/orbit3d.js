/**
 * Minimal canvas 3D orbit stubs — no Three.js / no npm.
 * Perspective projection + drag-to-orbit + wheel zoom.
 */

export function createOrbitCanvas(canvas, opts = {}) {
  const ctx = canvas.getContext("2d");
  const state = {
    yaw: opts.yaw ?? 0.55,
    pitch: opts.pitch ?? 0.35,
    dist: opts.dist ?? 4.2,
    minDist: opts.minDist ?? 2.2,
    maxDist: opts.maxDist ?? 9,
    dragging: false,
    lastX: 0,
    lastY: 0,
    cx: 0,
    cy: 0,
    cz: 0,
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 640;
    const h = canvas.clientHeight || 320;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function project(x, y, z) {
    const cy = Math.cos(state.yaw);
    const sy = Math.sin(state.yaw);
    const cp = Math.cos(state.pitch);
    const sp = Math.sin(state.pitch);
    const dx = x - state.cx;
    const dy = y - state.cy;
    const dz = z - state.cz;
    const x1 = dx * cy + dz * sy;
    const z1 = -dx * sy + dz * cy;
    const y2 = dy * cp - z1 * sp;
    const z2 = dy * sp + z1 * cp;
    const depth = z2 + state.dist;
    const f = Math.max(0.35, 2.4 / Math.max(0.2, depth));
    const w = canvas.clientWidth || 640;
    const h = canvas.clientHeight || 320;
    return {
      x: w * 0.5 + x1 * f * Math.min(w, h) * 0.22,
      y: h * 0.55 - y2 * f * Math.min(w, h) * 0.22,
      depth,
      scale: f,
    };
  }

  function clear(fill = "#0b1220") {
    const w = canvas.clientWidth || 640;
    const h = canvas.clientHeight || 320;
    ctx.fillStyle = fill;
    ctx.fillRect(0, 0, w, h);
  }

  function drawAxes(len = 1.2) {
    const O = project(0, 0, 0);
    const axes = [
      { p: project(len, 0, 0), c: "#f87171", l: "x" },
      { p: project(0, len, 0), c: "#34d399", l: "y" },
      { p: project(0, 0, len), c: "#7dd3fc", l: "z" },
    ];
    for (const a of axes) {
      ctx.strokeStyle = a.c;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(O.x, O.y);
      ctx.lineTo(a.p.x, a.p.y);
      ctx.stroke();
      ctx.fillStyle = a.c;
      ctx.font = "11px IBM Plex Mono, monospace";
      ctx.fillText(a.l, a.p.x + 4, a.p.y - 4);
    }
  }

  function drawPolyline(pts, color, width = 1.5) {
    if (!pts.length) return;
    const proj = pts.map((p) => project(p[0], p[1], p[2]));
    proj.sort((a, b) => a.depth - b.depth);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    const ordered = pts.map((p) => project(p[0], p[1], p[2]));
    ordered.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.stroke();
  }

  function drawPoints(pts, color, r = 3) {
    for (const p of pts) {
      const q = project(p[0], p[1], p[2]);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(q.x, q.y, r * (q.scale || 1), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawSegments(segs, color, width = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    for (const [a, b] of segs) {
      const p = project(a[0], a[1], a[2]);
      const q = project(b[0], b[1], b[2]);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }
  }

  canvas.addEventListener("pointerdown", (e) => {
    state.dragging = true;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointerup", () => {
    state.dragging = false;
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!state.dragging) return;
    const dx = e.clientX - state.lastX;
    const dy = e.clientY - state.lastY;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    state.yaw += dx * 0.01;
    state.pitch = Math.max(-1.2, Math.min(1.2, state.pitch + dy * 0.01));
    if (typeof opts.onOrbit === "function") opts.onOrbit(state);
  });
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      state.dist = Math.max(
        state.minDist,
        Math.min(state.maxDist, state.dist + e.deltaY * 0.004)
      );
      if (typeof opts.onOrbit === "function") opts.onOrbit(state);
    },
    { passive: false }
  );

  resize();
  window.addEventListener("resize", () => {
    resize();
    if (typeof opts.onOrbit === "function") opts.onOrbit(state);
  });

  return {
    state,
    ctx,
    project,
    clear,
    drawAxes,
    drawPolyline,
    drawPoints,
    drawSegments,
    resize,
    redraw: () => opts.onOrbit && opts.onOrbit(state),
  };
}

/** Wireframe grid on xz plane. */
export function gridSegs(half = 1.5, step = 0.5, y = 0) {
  const segs = [];
  for (let v = -half; v <= half + 1e-9; v += step) {
    segs.push([
      [v, y, -half],
      [v, y, half],
    ]);
    segs.push([
      [-half, y, v],
      [half, y, v],
    ]);
  }
  return segs;
}
