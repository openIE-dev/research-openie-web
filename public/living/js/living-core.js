/** Shared living-paper helpers (vanilla ES modules). */

export function $(sel, root = document) {
  return root.querySelector(sel);
}
export function $$(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

export function setBadgeMode(figureEl, mode) {
  const measured = figureEl.querySelector('[data-badge="measured"]');
  const modelled = figureEl.querySelector('[data-badge="modelled"]');
  if (!measured || !modelled) return;
  measured.classList.toggle("on-measured", mode === "measured");
  modelled.classList.toggle("on-modelled", mode === "modelled");
  measured.classList.toggle("on-modelled", false);
  modelled.classList.toggle("on-measured", false);
  const status = figureEl.querySelector("[data-grade-status]");
  if (status) {
    status.textContent =
      mode === "measured"
        ? status.dataset.measuredLabel || "measured"
        : status.dataset.modelledLabel || "modelled / illustrative";
  }
}

export function wireBadgeToggles(root = document) {
  $$(".badge-toggle", root).forEach((tog) => {
    const fig = tog.closest("section.figure-shell") || tog.closest("figure");
    tog.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-badge]");
      if (!btn || !fig) return;
      setBadgeMode(fig, btn.dataset.badge);
    });
  });
}

export function fmtSci(n) {
  if (typeof n !== "number") return String(n);
  return n.toExponential(4);
}

export function markLive(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const chip = el.querySelector(".chip.stub, .chip.live");
  if (chip) {
    chip.classList.remove("stub");
    chip.classList.add("live");
    chip.textContent = "interactive";
  }
}

export function initNavActive() {
  const path = location.pathname;
  $$(".nav a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href && path.endsWith(href.replace(/^\.\.\//, "").replace(/^\.\//, ""))) {
      a.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireBadgeToggles();
  initNavActive();
});
