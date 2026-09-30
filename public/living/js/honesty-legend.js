/** shared-inf-02 — interactive honesty tag legend (PAPER_ARCHITECTURE §10). */
import { $, markLive } from "./living-core.js";

export const HONESTY_COPY = {
  SURROGATE:
    "[SURROGATE] — OpCounter × analytical energy; sim-only. Never label axes as board W / FPGA watts.",
  DUT: "[DUT] — Device-under-test metered joules/watts under a stated workload (tier C).",
  VENDOR: "[VENDOR] — Vendor self-bench (tok/s, tokens/J). Not a scientific scoreboard win for WCA.",
  UNVERIFIED: "[UNVERIFIED] — Claim not fetch-checked in this evidence window.",
  SOFT: "[SOFT] — Historical or metaphorical analogy; not a hard empirical row.",
  MIRROR: "[MIRROR] — Secondary PDF mirror of a primary work; cite primary when possible.",
  BOARD:
    "board_synth_claimed=false — Software reference (Rust + Icarus). Flip only with Vivado/Quartus + meter.",
};

export function initHonestyLegend() {
  const root = $("#shared-inf-02");
  if (!root) return;
  const detail = root.querySelector("[data-tag-detail]");
  root.querySelectorAll("[data-tag]").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll("[data-tag]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (detail) detail.textContent = HONESTY_COPY[btn.dataset.tag] || btn.dataset.tag;
    });
  });
  markLive("shared-inf-02");
}
