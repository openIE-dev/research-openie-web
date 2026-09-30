/**
 * Frozen demo numbers from artifacts/RESULTS.md and mcp_gate_demo.json.
 * Do not invent joules — only values verified in-repo as of living-shell pass.
 */
export const FROZEN = {
  board_synth_claimed: false,
  seed1: {
    source: "artifacts/RESULTS.md (Rust SoC seed-1 16-step parity)",
    command:
      "cargo run --release --bin wca-soc-loop -- --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1",
    steps: 16,
    init_theta: 1.5,
    init_omega: 3.0,
    seed: 1,
    committed: 1,
    refused: 15,
    /* [SURROGATE] OpCounter × analytical E_* — not board watts */
    J: 8.6795e-10,
    J_display: "8.6795e-10",
    refuse_split: { lut_only: 0, energy_only: 15, both: 0 },
    sole_commit_step: 6,
    op_counters: {
      bram: 64,
      lut_reads: 16,
      lut6_toggles: 3,
      ph_muls: 64,
      ph_adds: 48,
      commits: 1,
      refuses: 15,
    },
    joule_breakdown: {
      BRAM: 6.4e-10,
      LUT: 1.6e-11,
      PH: 7.52e-11,
      "commit/refuse": 9.5e-11,
    },
    grade: "measured + [SURROGATE]",
  },
  safePh: {
    source: "artifacts/RESULTS.md (Safe PH disagreement + seed-1)",
    command:
      "cargo run --release --bin wca-soc-loop -- --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1 --safe-ph",
    false_allow: 0,
    false_refuse_v2: 79,
    grid_note: "21³ grid + 200k near-ε MC = 209261 samples (RESULTS)",
    paths: [
      { name: "Legacy Q8.8", false_allow: 30836, false_refuse: 105 },
      { name: "Safe v1", false_allow: 0, false_refuse: 42430 },
      { name: "Safe v2 (Q16.16 + residual)", false_allow: 0, false_refuse: 79 },
    ],
    seed1_safe: { committed: 1, refused: 15, J: 8.6795e-10 },
    grade: "measured (toy only)",
  },
  mcp: {
    source: "artifacts/mcp_gate_demo.json",
    command: "cargo run --release --bin wca-mcp-gate",
    board_synth_claimed: false,
    compose_default: "LutAndSafeAndCbf",
    note: "Refuse never executes. Irreversible tools require Certificate under configured compose.",
    cases: [
      {
        case: "read_only_bypass",
        classification: "read_only",
        executed: true,
        has_commit: false,
        executor_calls: null,
      },
      {
        case: "irreversible_refuse",
        classification: "irreversible",
        commit: false,
        executed: false,
        executor_calls: 0,
        reasons: ["energy_veto", "cbf_veto"],
      },
      {
        case: "irreversible_allow",
        classification: "irreversible",
        commit: true,
        executed: true,
        executor_calls: 1,
        compose: "lut_and_safe_and_cbf",
      },
      {
        case: "shell_exec_gated",
        classification: "irreversible",
        commit: true,
        executed: true,
        tool_class_str: "irreversible",
      },
    ],
    grade: "measured (demo)",
  },
  schemaRefuseExample: {
    source: "artifacts/schemas/wca.commit.v1/examples/commit_decision_refuse.json",
    decision: "refuse",
    compose: "lut_and_energy",
    plant_action: [0.0],
    reason: "energy_veto",
    board_synth_claimed: false,
  },
  composePredicates: [
    {
      id: "lut_and_energy",
      formula: "lut_allow ∧ energy_ok",
      use: "Classic SoC",
    },
    {
      id: "lut_and_safe",
      formula: "lut_allow ∧ energy_ok (Safe PH / never false-allow)",
      use: "Safe residual vs float V̇",
    },
    {
      id: "lut_and_safe_and_cbf",
      formula: "lut_allow ∧ energy_ok ∧ cbf_ok",
      use: "Dual / MCP irreversible default",
    },
  ],
  jouleTiers: [
    {
      id: "A",
      name: "Tier A",
      def: "Surrogate: OpCounter × analytical E_*. Language: “surrogate joules,” never “board watts.”",
      badge: "[SURROGATE]",
      board: false,
    },
    {
      id: "B",
      name: "Tier B",
      def: "Post-synthesis / post-P&R estimates (tool-reported). Still not DUT.",
      badge: "modelled / tool",
      board: false,
    },
    {
      id: "C",
      name: "Tier C",
      def: "Board / DUT metered joules or watts under stated workload.",
      badge: "[DUT] — not claimed",
      board: false,
    },
  ],
  epochCites: [
    {
      title: "LLM inference price trends",
      url: "https://epoch.ai/data-insights/llm-inference-price-trends",
      note: "~9–900×/yr price drops at fixed performance (Epoch AI, 2025-03-12).",
    },
    {
      title: "The plunging price of thought",
      url: "https://epoch.ai/publications/the-plunging-price-of-thought",
      note: "~47%/quarter ≈ 13×/yr cost of fixed performance since ~2023 (Emberson & Roodman / Epoch, 2026-09-22).",
    },
  ],
};

export const LINEAGE = [
  {
    who: "Iverson",
    era: "1960s+",
    cite: "Executable notation — APL; notation as a tool of thought.",
  },
  {
    who: "Engelbart",
    era: "1960s+",
    cite: "Augmenting human intellect; interactive systems as co-evolution.",
  },
  {
    who: "Kay",
    era: "1970s+",
    cite: "Dynabook / Smalltalk — personal computing as medium.",
  },
  {
    who: "Victor",
    era: "2010s",
    cite: "Media for thinking the unthinkable; direct manipulation of process.",
  },
  {
    who: "Lee",
    era: "2022",
    cite: "Notational Intelligence essay — Brahe→Kepler framing (cite generously; no punch-down).",
  },
  {
    who: "WCA",
    era: "2026",
    cite: "Commit law: Proposal → Certificate → RefuseReason → CommitDecision as runtime notation.",
  },
];

export const COMPOSE_STACK = {
  sense: "sense plant / tool request",
  propose: "propose u (TLMM / System One / agent)",
  certify: "certify: lut_allow ∧ energy_ok [∧ cbf_ok]",
  commit: "CommitDecision → plant_action = u",
  refuse: "RefuseReason → hold at zeros / no executor",
};
