#!/usr/bin/env python3
"""
OpenIE Research TV v3.0 — Automated Plain-Language, 3-Bullet Telescoping & Anti-Acronym-Soup Linter.
Fails with exit code 1 if ANY study violates:
  1. Missing or malformed 3 Plain-Words Bullets (plain_bullets).
  2. Any tier (15s, 45s, 90s, 180s) failing to start with bullet_focus_1, bullet_focus_2, bullet_focus_3
     using identical opening spoken cues across all 4 tiers.
  3. Out-of-bounds word counts for natural documentary speech pacing.
  4. Acronym soup, internal benchmark/hypothesis IDs, or code variable names in spoken or on-screen text.
"""
import argparse
import re
import sys

ALLOWED_SCENE_KINDS = {
    "bullet_focus_1",
    "bullet_focus_2",
    "bullet_focus_3",
    "analogy_spotlight",
    "hook_contrast",
    "state_cascade",
    "equation_curve",
    "benchmark_bars",
    "cutaway_3d",
    "falsifier_audit",
    "horizon_slate",
}

# (min_words, max_words, expected_min_scenes, expected_max_scenes)
TIER_WORD_BUDGETS = {
    "15s": (34, 62, 3, 3),
    "45s": (92, 136, 5, 5),
    "90s": (188, 256, 7, 7),
    "180s": (385, 495, 10, 10),
}

# Banned internal codes, benchmark IDs, code identifiers, and unexplained technical acronyms
BANNED_PATTERNS = [
    # Internal paper/benchmark/hypothesis codes
    (r"\bGE-H\d+\b", "internal ID GE-H*"),
    (r"\bCTA-[ETM]\d+\b", "internal ID CTA-*"),
    (r"\bCA-[MH]\d+\b", "internal ID CA-*"),
    (r"\bHM0\d\b|\bHQ0\d\b|\bHY0\d\b|\bHD0\d\b", "internal roadmap code"),
    (r"\bCL\d{2}\b|\bAI\d{2}\b|\bBM\d{2}\b|\bEV\d{2}\b", "internal rung/catalog code"),
    (r"\bTrack-[AB]\b", "internal Track-A/B label"),
    (r"\bexp-00\d\b", "internal exp-00* ID"),
    (r"\bH1[0-5]\b|\bH[1-9]\b", "internal hypothesis code H1..H15"),
    (r"\bC1[0-2]\b|\bC[1-9]\b", "internal camp/check code C1..C12"),
    (r"\bFalsifier\s+\d+\b", "internal Falsifier number"),
    (r"\bLane\s+[BO]\b", "internal Lane B/O jargon"),
    (r"\bShape\s+[DMHI]\b", "internal Shape D/M/H/I jargon"),
    (r"\bRung\s+[0-9A-Za-z]+\b", "internal Rung code"),
    (r"\bGear-[012]\b|\bGear\s+[012]\b", "internal Gear-0/1/2 jargon"),
    (r"\bDES-10\b|\bJCR-1\b|\bDNULLMM1\b|\bW-MUT-1\b", "internal artifact code"),
    (r"\bFormJEPA(?:-v\d+)?\b|\bFormEBM(?:-v\d+)?\b|\bExpert-AirMoL\b", "internal model code"),
    # Raw database/code identifiers
    (r"\breported_j\b|\bmeasured_j\b|\best_j\b|\best_uj\b|\bboard_metered\b", "raw schema field name"),
    (r"\bri_energy_nj\b|\bproc_pid_rusage\b|\bF_NOCACHE\b|\bnvml\.dll\b|\bstd::\w+", "raw OS/code symbol"),
    (r"\bpytest\b|\bunittest\b|\btiktoken\b|\bcl100k_base\b|\brustc\b|\b\.rlib\b", "raw CLI/library identifier"),
    # Unexplained hardware/math/CS acronym soup
    (r"\bKV260\b|\bxck26\b|\bSTM32\w*\b|\bCR2032\b", "chip/battery part-number soup"),
    (r"\bINA260\b|\bINA238\b|\bINA3221\b", "shunt part-number soup (say 'circuit-board power sensor')"),
    (r"\bRAMB36E2\b|\bLUT6\b|\bLUT\b|\bFPGA\b|\bASIC\b|\bFRAM\b|\bPCB\b", "hardware acronym soup"),
    (r"\bRAPL\b|\bIOReport\b|\bNVML\b|\bPLATYPUS\b", "telemetry acronym soup (say 'built-in chip energy counter')"),
    (r"\bQ32\.32\b|\bFP16\b|\bINT4\b|\bIEEE\b|\bFMA\b|\bLSB\b|\bULP\b", "numeric-format acronym soup"),
    (r"\bPSPACE\b|\bD-CTC\b|\bP-CTC\b|\bCTC\b|\bCTCs\b|\b3-SAT\b|\bDRAT\b|\bAUROC\b", "complexity/stat acronym soup"),
    (r"\bPSNR\b|\bSSIM\b|\bSLOC\b|\bECS\b|\bUCRT\b|\bglibc\b|\bwgpu\b|\bWasm\b", "graphics/compiler acronym soup"),
    (r"\bBFCL\b|\bSWE-bench\b|\bSWE-Mini\b|\bBigCodeBench\b", "benchmark-acronym soup"),
    (r"\bBLAKE3\b|\bBLAKE2b\b|\bEd25519\b|\bSHA-256\b|\bCBOR\b|\bdet-CBOR\b", "crypto acronym soup (use plain words like 'digital fingerprint' or 'cryptographic signature')"),
    (r"\bJEPA\b|\bEBM\b|\bMoE\b|\bMLP\b|\bLLM\b|\bLLMs\b|\bFLOP\b|\bFLOPS\b", "ML acronym soup (say 'language model', 'mixture of specialist networks', etc.)"),
    (r"\bNVMe\b|\bAST\b|\bISA\b|\bSIMD\b|\bBFT\b|\bSSP\b|\bDAG\b|\bDAGs\b|\bMCP\b|\bJSON-RPC\b", "systems acronym soup"),
    (r"\bSATB\b|\bMEI-JCP\b|\bMEI\b|\bRCE-VC\b|\bRCE-JEPA\b|\bCpJ\b|\bECC\b|\bATP\b|\bSepJ\b|\bBCI\b|\bEV\b", "domain acronym soup (spell out in plain words)"),
]

# Catch any stray ALL-CAPS acronym >= 3 chars in spoken prose (excluding natural words or Roman numerals)
ALLOWED_CAPS_IN_SPOKEN = {"AI", "3D", "TV", "PC", "OS", "DNA", "RNA", "GPS", "USB", "CPU", "GPU", "RAM", "PDF", "ONE", "TWO", "ALL"}


def check_text_clean(sid: str, loc: str, text: str, errors: list[str], is_heading: bool = False):
    for pat, reason in BANNED_PATTERNS:
        m = re.search(pat, text)
        if m:
            errors.append(f"[{sid}] {loc}: banned {reason} '{m.group(0)}' in -> {text!r}")
    if not is_heading:
        for tok in re.findall(r"\b[A-Z][A-Z0-9-]{2,}\b", text):
            if tok not in ALLOWED_CAPS_IN_SPOKEN:
                errors.append(f"[{sid}] {loc}: unexplained ALL-CAPS acronym '{tok}' in -> {text!r}")


def lint_study(st: dict) -> list[str]:
    errs: list[str] = []
    sid = st.get("id", "<missing>")

    # 1. Plain bullets check
    pbs = st.get("plain_bullets")
    if not isinstance(pbs, list) or len(pbs) != 3:
        errs.append(f"[{sid}] plain_bullets must be a list of exactly 3 strings")
        return errs
    for i, b in enumerate(pbs, 1):
        wc = len(b.split())
        if not (9 <= wc <= 28):
            errs.append(f"[{sid}] plain_bullets[{i}] has {wc} words (expected 9..28): {b!r}")
        check_text_clean(sid, f"plain_bullets[{i}]", b, errs)

    # 2. Analogy check
    an = st.get("analogy")
    if not isinstance(an, tuple) or len(an) != 5:
        errs.append(f"[{sid}] analogy must be a 5-tuple (left_title, left_body, right_title, right_body, takeaway)")
    else:
        for j, part in enumerate(an):
            check_text_clean(sid, f"analogy[{j}]", part, errs, is_heading=(j in (0, 2)))

    # 3. Visual fields check
    check_text_clean(sid, "headline_metric", st.get("headline_metric", ""), errs, is_heading=True)
    check_text_clean(sid, "energy_tier", st.get("energy_tier", ""), errs, is_heading=True)
    check_text_clean(sid, "energy_disclosure", st.get("energy_disclosure", ""), errs)

    for idx, (nt, ns, _) in enumerate(st.get("nodes", [])):
        check_text_clean(sid, f"nodes[{idx}].title", nt, errs, is_heading=True)
        check_text_clean(sid, f"nodes[{idx}].sub", ns, errs)

    eq = st.get("equation", ("", "", ""))
    check_text_clean(sid, "equation[0]", eq[0], errs, is_heading=True)
    check_text_clean(sid, "equation[1]", eq[1], errs)

    for idx, (bl, _, bt, _) in enumerate(st.get("bars", [])):
        check_text_clean(sid, f"bars[{idx}].label", bl, errs, is_heading=True)
        check_text_clean(sid, f"bars[{idx}].text", bt, errs, is_heading=True)

    for idx, (cl, cv, _) in enumerate(st.get("cutaway_labels", [])):
        check_text_clean(sid, f"cutaway_labels[{idx}].label", cl, errs, is_heading=True)
        check_text_clean(sid, f"cutaway_labels[{idx}].val", cv, errs)

    fals = st.get("falsifier", ("", "", "", ""))
    check_text_clean(sid, "falsifier.title", fals[0], errs, is_heading=True)
    check_text_clean(sid, "falsifier.l1", fals[1], errs)
    check_text_clean(sid, "falsifier.l2", fals[2], errs)
    check_text_clean(sid, "falsifier.pill", fals[3], errs, is_heading=True)

    # 4. Tiers & telescoping 3-bullet check
    tiers = st.get("tiers", {})
    opening_cues_ref = None
    for tname, (wmin, wmax, smin, smax) in TIER_WORD_BUDGETS.items():
        if tname not in tiers:
            errs.append(f"[{sid}] missing tier '{tname}'")
            continue
        tspec = tiers[tname]
        check_text_clean(sid, f"tiers[{tname}].hook", tspec.get("hook", ""), errs)
        scenes = tspec.get("scenes", [])
        if not (smin <= len(scenes) <= smax):
            errs.append(f"[{sid}] tiers[{tname}] has {len(scenes)} scenes (expected {smin}..{smax})")
            continue

        # Must start with bullet_focus_1, bullet_focus_2, bullet_focus_3
        kinds = [sc[0] for sc in scenes[:3]]
        if kinds != ["bullet_focus_1", "bullet_focus_2", "bullet_focus_3"]:
            errs.append(f"[{sid}] tiers[{tname}] first 3 scenes must be bullet_focus_1..3, got {kinds}")

        cues3 = [sc[3] for sc in scenes[:3]]
        if opening_cues_ref is None:
            opening_cues_ref = cues3
        elif cues3 != opening_cues_ref:
            errs.append(f"[{sid}] tiers[{tname}] opening 3 spoken bullet cues must match 15s tier exactly for telescoping + cache reuse")

        total_words = 0
        for s_idx, (kind, head, sub, spoken) in enumerate(scenes):
            if kind not in ALLOWED_SCENE_KINDS:
                errs.append(f"[{sid}] tiers[{tname}] scene {s_idx}: unknown kind {kind!r}")
            check_text_clean(sid, f"tiers[{tname}].sc[{s_idx}].heading", head, errs, is_heading=True)
            check_text_clean(sid, f"tiers[{tname}].sc[{s_idx}].sub", sub, errs, is_heading=True)
            check_text_clean(sid, f"tiers[{tname}].sc[{s_idx}].spoken", spoken, errs, is_heading=False)
            total_words += len(spoken.split())

        if not (wmin <= total_words <= wmax):
            errs.append(f"[{sid}] tiers[{tname}] total spoken words = {total_words} (expected {wmin}..{wmax})")

    return errs


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--part", type=int, choices=[0, 1, 2, 3], default=0, help="0 = all parts, or 1/2/3")
    args = ap.parse_args()

    studies = []
    if args.part in (0, 1):
        from studies_part1 import STUDIES_PART1
        studies.extend(STUDIES_PART1)
    if args.part in (0, 2):
        from studies_part2 import STUDIES_PART2
        studies.extend(STUDIES_PART2)
    if args.part in (0, 3):
        from studies_part3 import STUDIES_PART3
        studies.extend(STUDIES_PART3)

    all_errs = []
    for st in studies:
        all_errs.extend(lint_study(st))

    if all_errs:
        print(f"CLARITY LINT FAILED ({len(all_errs)} issue(s) across {len(studies)} studies):")
        for e in all_errs[:60]:
            print("  -", e)
        if len(all_errs) > 60:
            print(f"  ... and {len(all_errs) - 60} more")
        sys.exit(1)

    print(f"CLARITY LINT PASSED: {len(studies)} studies, {len(studies)*4} films — 0 acronym-soup hits, 100% 3-bullet telescoping verified!")


if __name__ == "__main__":
    main()
