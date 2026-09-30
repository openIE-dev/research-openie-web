import { FROZEN, LINEAGE, COMPOSE_STACK } from "./data-frozen.js";
import { $, $$, fmtSci, markLive } from "./living-core.js";
import { initHonestyLegend } from "./honesty-legend.js";
import { initPlant3d } from "./ni-3d.js";

function initLineage() {
  const root = $("#ni-inf-01");
  if (!root) return;
  const rail = root.querySelector("[data-timeline]");
  const cite = root.querySelector("[data-cite]");
  if (!rail) return;
  rail.innerHTML = LINEAGE.map(
    (n, i) =>
      `<div class="node" data-i="${i}" tabindex="0" role="button">
        <div class="who">${n.who}</div>
        <div class="era">${n.era}</div>
      </div>`
  ).join("");
  const select = (i) => {
    $$(".node", rail).forEach((el) => el.classList.toggle("selected", +el.dataset.i === i));
    if (cite) {
      cite.textContent = LINEAGE[i].cite;
      cite.classList.add("visible");
    }
  };
  rail.addEventListener("click", (e) => {
    const node = e.target.closest(".node");
    if (node) select(+node.dataset.i);
  });
  select(LINEAGE.length - 1);
  markLive("ni-inf-01");
}

function initComplement() {
  ["ni-diag-01", "shared-diag-01"].forEach((id) => {
    const root = document.getElementById(id);
    if (!root) return;
    const detail = root.querySelector("[data-layer-detail]");
    const layers = {
      "system-one": {
        title: "System One (proposers)",
        owns: "Cheap proposals in software; TLMM / agent / LLM branches.",
        not: "Does not own irreversible plant commit or typed RefuseReason.",
      },
      tlmm: {
        title: "TLMM / Proposal path",
        owns: "Proposal u + latents; estimated surrogate J on proposal path.",
        not: "Never self-commits; gate may refuse.",
      },
      gate: {
        title: "WCA Commit Gate",
        owns: "Certificate · RefuseReason · CommitDecision; compose predicates.",
        not: "Does not replace upstream proposers; does not claim board watts.",
      },
      plant: {
        title: "Plant / irreversible tools",
        owns: "Actuators / MCP irreversible tools — run only on allow.",
        not: "No soft confidence-as-permission; hold at zeros on refuse.",
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
}

function initComposeToggle() {
  const root = $("#ni-diag-02");
  if (!root) return;
  const formula = root.querySelector("[data-formula]");
  const flow = root.querySelector("[data-stack-flow]");
  const sel = root.querySelector("[data-compose-select]");
  const render = (id) => {
    const p = FROZEN.composePredicates.find((x) => x.id === id) || FROZEN.composePredicates[0];
    if (formula) formula.textContent = p.formula + "  ·  " + p.use;
    if (flow) {
      flow.innerHTML = `<span class="muted">${COMPOSE_STACK.sense}</span>
<span class="muted">→</span> <span>${COMPOSE_STACK.propose}</span>
<span class="muted">→</span> <span class="gate">${COMPOSE_STACK.certify}</span>
<span class="muted">→</span> <span class="allow">${COMPOSE_STACK.commit}</span>
<span class="muted">|</span> <span class="refuse">${COMPOSE_STACK.refuse}</span>
<div class="small" style="margin-top:0.5rem">Active compose: <strong>${p.id}</strong></div>`;
    }
  };
  if (sel) {
    sel.innerHTML = FROZEN.composePredicates
      .map((p) => `<option value="${p.id}">${p.id}</option>`)
      .join("");
    sel.addEventListener("change", () => render(sel.value));
    render(sel.value);
  }
  markLive("ni-diag-02");
}

function initSchemaFigure() {
  const root = $("#ni-fig-01");
  if (!root) return;
  const view = root.querySelector("[data-json-view]");
  const chips = root.querySelector("[data-field-chips]");
  const ex = FROZEN.schemaRefuseExample;
  const obj = {
    schema_version: "wca.commit.v1",
    decision: ex.decision,
    commit: false,
    compose: ex.compose,
    plant_action: ex.plant_action,
    certificate: {
      decision: "refuse",
      lut_allow: true,
      energy_ok: false,
      reasons: [{ code: ex.reason }],
      board_synth_claimed: false,
    },
    board_synth_claimed: false,
    _source: ex.source,
  };
  if (view) view.textContent = JSON.stringify(obj, null, 2);
  const fields = [
    "Proposal",
    "Certificate",
    "RefuseReason",
    "CommitDecision",
    "board_synth_claimed",
  ];
  if (chips) {
    chips.innerHTML = fields
      .map((f) => `<button type="button" class="atom" data-field="${f}">${f}</button>`)
      .join("");
    const detail = root.querySelector("[data-field-detail]");
    const tips = {
      Proposal: "Cheap proposed action u + state. Never self-commits.",
      Certificate: "Gate-owned allow/refuse: lut_allow ∧ energy_ok [∧ cbf_ok].",
      RefuseReason: "Typed veto codes (lut_veto, energy_veto, cbf_veto, budget_exceeded, policy).",
      CommitDecision: "Envelope → plant_action = u or zeros; executor only on allow.",
      board_synth_claimed: "Honesty flag locked false until Vivado/Quartus + DUT meter.",
    };
    chips.addEventListener("click", (e) => {
      const b = e.target.closest("[data-field]");
      if (!b) return;
      $$(".atom", chips).forEach((x) => x.classList.toggle("selected", x === b));
      if (detail) detail.textContent = tips[b.dataset.field] || "";
    });
  }
  markLive("ni-fig-01");
}

function initSeed1Runner() {
  const root = $("#ni-run-01");
  if (!root) return;
  const s = FROZEN.seed1;
  const board = root.querySelector("[data-scoreboard]");
  const cmd = root.querySelector("[data-cmd]");
  const note = root.querySelector("[data-run-note]");
  const fill = () => {
    if (board) {
      board.innerHTML = `
        <div class="metric"><div class="label">committed</div><div class="value allow">${s.committed}</div></div>
        <div class="metric"><div class="label">refused</div><div class="value refuse">${s.refused}</div></div>
        <div class="metric"><div class="label">J [SURROGATE]</div><div class="value warn">${s.J_display}</div></div>
        <div class="metric"><div class="label">sole commit step</div><div class="value">${s.sole_commit_step}</div></div>`;
    }
    if (cmd) cmd.textContent = s.command;
    if (note)
      note.textContent = `Frozen from ${s.source}. board_synth_claimed=${FROZEN.board_synth_claimed}. Not board watts.`;
  };
  fill();
  root.querySelector("[data-run]")?.addEventListener("click", () => {
    fill();
    if (note)
      note.textContent =
        `Showing frozen golden (browser stub). Re-verify with: ${s.command}`;
  });
  root.querySelector("[data-reset]")?.addEventListener("click", fill);
  markLive("ni-run-01");
}

function initSafePhRunner() {
  const root = $("#ni-run-02");
  if (!root) return;
  const s = FROZEN.safePh;
  const table = root.querySelector("[data-fa-table]");
  const chip = root.querySelector("[data-fa-chip]");
  const cmd = root.querySelector("[data-cmd]");
  if (table) {
    table.innerHTML = `<thead><tr><th>Path</th><th>false_allow</th><th>false_refuse</th></tr></thead><tbody>` +
      s.paths
        .map(
          (p) =>
            `<tr><td>${p.name}</td><td><strong>${p.false_allow}</strong></td><td>${p.false_refuse}</td></tr>`
        )
        .join("") +
      `</tbody>`;
  }
  if (chip) chip.textContent = `false-allow = ${s.false_allow}`;
  if (cmd) cmd.textContent = s.command;
  const toggle = root.querySelector("[data-safe-toggle]");
  const seed = root.querySelector("[data-seed-safe]");
  toggle?.addEventListener("change", () => {
    if (seed) {
      seed.textContent = toggle.checked
        ? `Safe --safe-ph seed-1: committed=${s.seed1_safe.committed} refused=${s.seed1_safe.refused} J=${fmtSci(s.seed1_safe.J)} [SURROGATE]`
        : "Toggle Safe-PH to show seed-1 parity row.";
    }
  });
  markLive("ni-run-02");
}

function initMcpRunner() {
  const root = $("#ni-run-03");
  if (!root) return;
  const s = FROZEN.mcp;
  const list = root.querySelector("[data-mcp-cases]");
  const detail = root.querySelector("[data-mcp-detail]");
  const counter = root.querySelector("[data-executor-calls]");
  let calls = 0;
  if (list) {
    list.innerHTML = s.cases
      .map(
        (c, i) =>
          `<button type="button" class="atom" data-case="${i}">${c.case}</button>`
      )
      .join("");
    list.addEventListener("click", (e) => {
      const b = e.target.closest("[data-case]");
      if (!b) return;
      $$(".atom", list).forEach((x) => x.classList.toggle("selected", x === b));
      const c = s.cases[+b.dataset.case];
      if (c.executor_calls != null) calls = c.executor_calls;
      if (counter) counter.textContent = String(calls);
      if (detail) {
        detail.textContent = JSON.stringify(c, null, 2);
      }
    });
  }
  const cmd = root.querySelector("[data-cmd]");
  if (cmd) cmd.textContent = s.command;
  markLive("ni-run-03");
}

function initJouleTiers(ids) {
  ids.forEach((id) => {
    const root = document.getElementById(id);
    if (!root) return;
    const ladder = root.querySelector("[data-tier-ladder]");
    const detail = root.querySelector("[data-tier-detail]");
    const flag = root.querySelector("[data-board-flag]");
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
    if (flag)
      flag.textContent = `board_synth_claimed=${FROZEN.board_synth_claimed}`;
    markLive(id);
  });
}

function initSharedInf01() {
  const root = $("#shared-inf-01");
  if (!root) return;
  root.querySelectorAll("[data-steelman]").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll("[data-steelman]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const panel = root.querySelector("[data-steelman-panel]");
      if (!panel) return;
      const key = btn.dataset.steelman;
      const copy = {
        hooker:
          "Hardware Lottery (Hooker): ideas win when they fit chips/kernels — steelman the wave’s silicon center; OpenIE still bets on commit law.",
        kaplan:
          "Kaplan / Hoffmann scaling: capability tracks compute & tokens/$ — admit this; commit certificates are a different product axis.",
        epoch:
          "Epoch price collapse: digital chore cost plunges; never equate free-at-margin synthesis with free joules or free plant motion.",
      };
      panel.textContent = copy[key] || "";
    });
  });
  markLive("shared-inf-01");
}

function initAtomStrip() {
  const root = $("#shared-fig-01");
  if (!root) return;
  const detail = root.querySelector("[data-atom-detail]");
  const tips = {
    Proposal: "Cheap u — never self-commits.",
    Certificate: "lut_allow ∧ energy_ok [∧ cbf_ok].",
    RefuseReason: "Typed veto taxonomy.",
    CommitDecision: "plant_action = u or hold zeros.",
  };
  root.querySelectorAll("[data-atom]").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll("[data-atom]").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      if (detail) detail.textContent = tips[btn.dataset.atom] || "";
    });
  });
  markLive("shared-fig-01");
}

function initSharedTab01() {
  markLive("shared-tab-01");
}

document.addEventListener("DOMContentLoaded", () => {
  initLineage();
  initComplement();
  initComposeToggle();
  initSchemaFigure();
  initSeed1Runner();
  initSafePhRunner();
  initMcpRunner();
  initJouleTiers(["ni-inf-02", "shared-tab-01"]);
  initSharedInf01();
  initHonestyLegend();
  initAtomStrip();
  initSharedTab01();
  initPlant3d();
});
