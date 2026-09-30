import { FROZEN } from "./data-frozen.js";
import { $, $$, markLive } from "./living-core.js";
import { initHonestyLegend } from "./honesty-legend.js";
import { initBliss3d } from "./sat-3d.js";

const CYCLE = [
  { tech: "Bicycles", race: "Prestige / novelty", sat: "Reliable personal transport", commodity: "Utility / recreation kit", soft: true },
  { tech: "Cars", race: "HP & brand theater", sat: "Trip reliability", commodity: "Mass mobility", soft: true },
  { tech: "Planes", race: "Speed / heroics", sat: "Schedule + safety", commodity: "Seat + fuel math", soft: true },
  { tech: "TVs", race: "Spec arms race", sat: "“Good enough” fidelity", commodity: "Panel + content pipe", soft: true },
  { tech: "Cell phones", race: "Spec sheets", sat: "Always-reachable", commodity: "Pocket utility computer", soft: true },
  { tech: "AI (digital chores)", race: "Frontier / seats / agents", sat: "Chore closed without theater", commodity: "Bundled / free-at-margin synthesis", soft: true },
];

const RULES = [
  { id: "R-S6", text: "Split meters: pre-done J vs post-done J", tag: "Design-not-empiric" },
  { id: "R-S7", text: "Segment TAM: satiating chores vs non-satiating races", tag: "Design-not-empiric" },
  { id: "R-S8", text: "Treat engagement KPIs as hostile in care/work unless proven aligned", tag: "Design-not-empiric" },
  { id: "R-S9", text: "Care: optimize handoff integrity / safe-state time, not session length", tag: "Design-not-empiric" },
  { id: "R-S10", text: "When citing Landauer/Horowitz, state measurement tier A/B/C", tag: "Design-not-empiric" },
  { id: "R-S11", text: "Jevons naming is a warning, not growth excuse for uncapped agents", tag: "Design-not-empiric" },
  { id: "R-S12", text: "Kill criteria K-S1–K-S5 remain binding (blueprint §9)", tag: "Design-not-empiric" },
];

const STEELMAN = [
  { counter: "Status goods", steelman: "Veblen / positional demand never satiates; “best model” is a trophy", reply: "True for status. False for invoice filing. Segment markets." },
  { counter: "Creative unbounded", steelman: "Art, research ideation, entertainment want more novelty", reply: "Partially true. Still often has project-level done." },
  { counter: "Military / security", steelman: "Adversary sets the ceiling; arms races lack bliss points", reply: "True. Commit/safety gates still bind; satiation thesis does not apply cleanly." },
  { counter: "Open-ended R&D / AGI race", steelman: "Better science tools raise ambition", reply: "True for frontier labs. Does not rescue TAM math for satiated SaaS chores." },
  { counter: "Jevons on AI", steelman: "Cheaper inference ⇒ vastly more inference", reply: "Often true globally; can coexist with per-chore satiation. Meter both." },
];

const SCARCITY = {
  scarce: [
    "Joules / thermodynamic cost",
    "Matter, actuators, clinic/floor time",
    "Irreversible commit / liability",
    "Auditable certificates + refuse taxonomy",
    "Honest meters (OpenIE joules)",
  ],
  commodity: [
    "Generic text synthesis for closed chores",
    "Spec-sheet “AI features” without completion",
    "Soft moats that were only temporary synthesis scarcity",
    "Confidence strings as safety",
    "Seat licenses with no ledger",
  ],
};

function initLenses() {
  const root = $("#sat-inf-01");
  if (!root) return;
  const panel = root.querySelector("[data-lens-panel]");
  root.querySelectorAll("[data-lens]").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll("[data-lens]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (!panel) return;
      if (btn.dataset.lens === "engagement") {
        panel.innerHTML = `<div class="card"><h3>Engagement KPI lens</h3><p>Optimize session length, tokens, seats, re-prompts. Divergence risk: busy-ness after work/care is already complete.</p></div>`;
      } else {
        panel.innerHTML = `<div class="card"><h3>Economic-done lens</h3><p>Optimize time-to-done / refuse rate after completeness. Further synthesis past the finish line ≈ noise + cost.</p></div>`;
      }
    });
  });
  markLive("sat-inf-01");
}

function initBliss() {
  const root = $("#sat-fig-01");
  if (!root) return;
  const canvas = root.querySelector("canvas");
  const slider = root.querySelector("[data-bliss-x]");
  const label = root.querySelector("[data-bliss-label]");
  const note = root.querySelector("[data-mu-note]");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = (canvas.width = 560);
  const H = (canvas.height = 320);
  const draw = (bx) => {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, W, H);
    // axes
    ctx.strokeStyle = "#334155";
    ctx.beginPath();
    ctx.moveTo(40, H - 30);
    ctx.lineTo(W - 20, H - 30);
    ctx.moveTo(40, H - 30);
    ctx.lineTo(40, 20);
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px monospace";
    ctx.fillText("x (chore intensity)", W / 2 - 50, H - 8);
    ctx.save();
    ctx.translate(14, H / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("U (modelled)", 0, 0);
    ctx.restore();
    // indifference ellipses around bliss (bx, by=0.55)
    const by = 0.55;
    const a = 0.22;
    const b = 0.18;
    for (let k = 3; k >= 1; k--) {
      ctx.beginPath();
      ctx.strokeStyle = k === 1 ? "#5eead4" : "#334155";
      for (let t = 0; t <= Math.PI * 2 + 0.01; t += 0.05) {
        const px = 40 + (bx + a * k * Math.cos(t)) * (W - 70);
        const py = H - 30 - (by + b * k * Math.sin(t)) * (H - 60);
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    // bliss marker
    const mx = 40 + bx * (W - 70);
    const my = H - 30 - by * (H - 60);
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(mx, my, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("bliss x*", mx + 8, my - 8);
  };
  const sync = () => {
    const bx = slider ? +slider.value : 0.45;
    draw(bx);
    if (label) label.textContent = `x* ≈ ${bx.toFixed(2)} (drag)`;
    if (note)
      note.textContent =
        "MU→0 near bliss · U = −a(x−x*)² − b(y−y*)² · labelled modelled (textbook), not agent eval.";
  };
  slider?.addEventListener("input", sync);
  sync();
  markLive("sat-fig-01");
}

function initCycleTable() {
  const root = $("#sat-tab-01");
  if (!root) return;
  const tbody = root.querySelector("[data-cycle-body]");
  if (tbody) {
    tbody.innerHTML = CYCLE.map(
      (r, i) =>
        `<tr data-row="${i}"><td>${r.tech} <span class="chip soft">[SOFT]</span></td><td>${r.race}</td><td>${r.sat}</td><td>${r.commodity}</td></tr>`
    ).join("");
    tbody.addEventListener("click", (e) => {
      const tr = e.target.closest("tr");
      if (!tr) return;
      tr.classList.toggle("expanded");
      const detail = root.querySelector("[data-cycle-detail]");
      const r = CYCLE[+tr.dataset.row];
      if (detail && r)
        detail.textContent = `${r.tech}: race → satiation → commodity. Historical analogy tagged [SOFT]; not a causal econometric claim.`;
    });
  }
  markLive("sat-tab-01");
}

function initEpochArc() {
  const root = $("#sat-fig-02");
  if (!root) return;
  const cites = root.querySelector("[data-epoch-cites]");
  if (cites) {
    cites.innerHTML = FROZEN.epochCites
      .map(
        (c) =>
          `<div class="card"><h3><a href="${c.url}" target="_blank" rel="noopener">${c.title}</a></h3><p>${c.note}</p></div>`
      )
      .join("");
  }
  markLive("sat-fig-02");
}

function initScarcity() {
  const root = $("#sat-inf-02");
  if (!root) return;
  const scarce = root.querySelector("[data-scarce]");
  const commodity = root.querySelector("[data-commodity]");
  const detail = root.querySelector("[data-scarcity-detail]");
  if (scarce) {
    scarce.innerHTML = SCARCITY.scarce
      .map((t) => `<div class="card tile" data-kind="scarce">${t}</div>`)
      .join("");
  }
  if (commodity) {
    commodity.innerHTML = SCARCITY.commodity
      .map((t) => `<div class="card tile" data-kind="commodity">${t}</div>`)
      .join("");
  }
  root.addEventListener("click", (e) => {
    const tile = e.target.closest(".tile");
    if (!tile) return;
    root.querySelectorAll(".tile").forEach((t) => t.classList.remove("active"));
    tile.classList.add("active");
    if (detail)
      detail.textContent =
        tile.dataset.kind === "scarce"
          ? `Still scarce: ${tile.textContent}`
          : `Commodity-heading: ${tile.textContent}`;
  });
  markLive("sat-inf-02");
}

function initRefuseBridge() {
  const root = $("#sat-diag-01");
  if (!root) return;
  const detail = root.querySelector("[data-bridge-detail]");
  root.querySelectorAll("[data-branch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll("[data-branch]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (!detail) return;
      if (btn.dataset.branch === "done") {
        detail.innerHTML = `<div class="card"><h3>Economic done</h3><p>Policy / budget refuse — do not spend after completeness. Maps to RefuseReason <code>policy</code> / <code>budget_exceeded</code>.</p></div>`;
      } else {
        detail.innerHTML = `<div class="card"><h3>Physical unsafe</h3><p>Energy / LUT / CBF refuse — hold plant. Maps to <code>energy_veto</code>, <code>lut_veto</code>, <code>cbf_veto</code>.</p></div>`;
      }
    });
  });
  markLive("sat-diag-01");
}

function initRules() {
  const root = $("#sat-tab-02");
  if (!root) return;
  const tbody = root.querySelector("[data-rules-body]");
  const filter = root.querySelector("[data-rules-filter]");
  const render = (q) => {
    if (!tbody) return;
    const rows = RULES.filter(
      (r) => !q || r.id.toLowerCase().includes(q) || r.text.toLowerCase().includes(q)
    );
    tbody.innerHTML = rows
      .map(
        (r) =>
          `<tr><td><code>${r.id}</code></td><td>${r.text}</td><td><span class="chip illustrative">${r.tag}</span></td></tr>`
      )
      .join("");
  };
  filter?.addEventListener("input", () => render(filter.value.trim().toLowerCase()));
  render("");
  markLive("sat-tab-02");
}

function initSteelman() {
  const root = $("#sat-fig-04");
  if (!root) return;
  const grid = root.querySelector("[data-steelman-grid]");
  if (grid) {
    grid.innerHTML = STEELMAN.map(
      (s) =>
        `<div class="card" tabindex="0">
          <h3>${s.counter}</h3>
          <p><strong>Steelman:</strong> ${s.steelman}</p>
          <p class="small"><strong>Scoped:</strong> ${s.reply}</p>
          <span class="chip illustrative">does not apply cleanly (where noted)</span>
        </div>`
    ).join("");
  }
  markLive("sat-fig-04");
}

/* Reuse shared widgets also present on satiation page */
function initSharedOnSat() {
  // Complement layers
  ["shared-diag-01"].forEach((id) => {
    const root = document.getElementById(id);
    if (!root) return;
    const detail = root.querySelector("[data-layer-detail]");
    const layers = {
      "system-one": {
        title: "System One (proposers)",
        owns: "Cheap proposals in software.",
        not: "Does not own irreversible commit.",
      },
      tlmm: {
        title: "TLMM / Proposal",
        owns: "Proposal u.",
        not: "Never self-commits.",
      },
      gate: {
        title: "WCA Gate",
        owns: "Certificate / refuse / commit.",
        not: "No board-watt claim.",
      },
      plant: {
        title: "Plant / tools",
        owns: "Irreversible acts on allow only.",
        not: "Soft confidence ≠ permission.",
      },
    };
    root.querySelectorAll("[data-layer]").forEach((btn) => {
      btn.addEventListener("click", () => {
        root.querySelectorAll("[data-layer]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const L = layers[btn.dataset.layer];
        if (detail && L) {
          detail.innerHTML = `<div class="card owns"><h3>${L.title} — owns</h3><p>${L.owns}</p></div>
            <div class="card not-owns"><h3>does not own</h3><p>${L.not}</p></div>`;
        }
      });
    });
    markLive(id);
  });

  const inf01 = $("#shared-inf-01");
  if (inf01) {
    inf01.querySelectorAll("[data-steelman]").forEach((btn) => {
      btn.addEventListener("click", () => {
        inf01.querySelectorAll("[data-steelman]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const panel = inf01.querySelector("[data-steelman-panel]");
        const copy = {
          hooker: "Hardware Lottery — steelman silicon center; bet remains commit law.",
          kaplan: "Scaling laws — admit tokens/$; certificates are another axis.",
          epoch: "Price of thought plunges ≠ free joules.",
        };
        if (panel) panel.textContent = copy[btn.dataset.steelman] || "";
      });
    });
    markLive("shared-inf-01");
  }

  const fig01 = $("#shared-fig-01");
  if (fig01) {
    const detail = fig01.querySelector("[data-atom-detail]");
    const tips = {
      Proposal: "Cheap u — never self-commits.",
      Certificate: "lut_allow ∧ energy_ok [∧ cbf_ok].",
      RefuseReason: "Typed veto taxonomy.",
      CommitDecision: "plant_action = u or hold zeros.",
    };
    fig01.querySelectorAll("[data-atom]").forEach((btn) => {
      btn.addEventListener("click", () => {
        fig01.querySelectorAll("[data-atom]").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        if (detail) detail.textContent = tips[btn.dataset.atom] || "";
      });
    });
    markLive("shared-fig-01");
  }

  const tab01 = $("#shared-tab-01");
  if (tab01) {
    const ladder = tab01.querySelector("[data-tier-ladder]");
    const detail = tab01.querySelector("[data-tier-detail]");
    const flag = tab01.querySelector("[data-board-flag]");
    if (ladder) {
      ladder.innerHTML = FROZEN.jouleTiers
        .map(
          (t) =>
            `<div class="tier locked" data-tier="${t.id}" tabindex="0" role="button">
              <span class="name">${t.name}</span>
              <span>${t.def}</span>
              <span class="flag">${t.badge}</span>
            </div>`
        )
        .join("");
      ladder.addEventListener("click", (e) => {
        const tier = e.target.closest("[data-tier]");
        if (!tier) return;
        $$(".tier", ladder).forEach((t) => t.classList.toggle("active", t === tier));
        const t = FROZEN.jouleTiers.find((x) => x.id === tier.dataset.tier);
        if (detail && t)
          detail.textContent = `${t.name}: ${t.def} board_synth_claimed=${FROZEN.board_synth_claimed}.`;
      });
    }
    if (flag) flag.textContent = `board_synth_claimed=${FROZEN.board_synth_claimed}`;
    markLive("shared-tab-01");
  }

}

document.addEventListener("DOMContentLoaded", () => {
  initLenses();
  initBliss();
  initCycleTable();
  initEpochArc();
  initScarcity();
  initRefuseBridge();
  initRules();
  initSteelman();
  initSharedOnSat();
  initHonestyLegend();
  initBliss3d();
});
