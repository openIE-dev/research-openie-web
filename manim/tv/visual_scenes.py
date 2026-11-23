#!/usr/bin/env python3
"""
OpenIE Research TV v3.0 — Plain-Words First Documentary Visual Engine.
Renders 1280x720 @ 30fps frames in pycairo:
  - Opens every film (and every poster) with the 1 · 2 · 3 Plain-Words Bullets
  - Adds vivid Everyday Analogy & Contrast Spotlight scenes
  - Eliminates acronym soup and cryptic labels on screen
"""
import math
import os
import cairo
from PIL import Image

W, H = 1280, 720
PAL = {
    "bg": (11 / 255, 16 / 255, 32 / 255),
    "panel": (18 / 255, 26 / 255, 48 / 255),
    "border": (48 / 255, 64 / 255, 98 / 255),
    "white": (0.97, 0.98, 1.00),
    "slate": (162 / 255, 178 / 255, 204 / 255),
    "dim": (98 / 255, 116 / 255, 146 / 255),
    "amber": (245 / 255, 158 / 255, 11 / 255),
    "cyan": (34 / 255, 211 / 255, 238 / 255),
    "emerald": (16 / 255, 185 / 255, 129 / 255),
    "rose": (244 / 255, 63 / 255, 94 / 255),
}
TIER_NAMES = {
    "15s": "15S · 3 PLAIN POINTS",
    "45s": "45S · PLAIN + EXAMPLE",
    "90s": "90S · FULL BRIEFING",
    "180s": "3M · DEEP CUT · 3D",
}


def ease_out(u: float) -> float:
    u = max(0.0, min(1.0, u))
    return 1.0 - (1.0 - u) ** 3


def round_rect(ctx, x, y, w, h, r=12):
    ctx.new_sub_path()
    ctx.arc(x + w - r, y + r, r, -math.pi / 2, 0)
    ctx.arc(x + w - r, y + h - r, r, 0, math.pi / 2)
    ctx.arc(x + r, y + h - r, r, math.pi / 2, math.pi)
    ctx.arc(x + r, y + r, r, math.pi, 3 * math.pi / 2)
    ctx.close_path()


def draw_pill(ctx, x, y, text, col_rgb, font_mono="Menlo", size=12, filled=False):
    ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(size)
    ext = ctx.text_extents(text)
    pw, ph = ext.width + 20, size + 12
    round_rect(ctx, x, y, pw, ph, 6)
    ctx.set_source_rgba(*col_rgb, 0.22 if filled else 0.12)
    ctx.fill_preserve()
    ctx.set_source_rgba(*col_rgb, 0.72)
    ctx.set_line_width(1.2)
    ctx.stroke()
    ctx.set_source_rgb(*col_rgb)
    ctx.move_to(x + 10, y + size + 2)
    ctx.show_text(text)
    return pw


def wrap_text(ctx, text, x, y, max_w, line_h, max_lines=4):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        cand = f"{cur} {w}".strip()
        if ctx.text_extents(cand).width <= max_w or not cur:
            cur = cand
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    for i, ln in enumerate(lines[:max_lines]):
        ctx.move_to(x, y + i * line_h)
        ctx.show_text(ln)
    return len(lines[:max_lines])


def load_cutaway_surfaces(cutaway_dir: str, cutaway_name: str):
    folder = os.path.join(cutaway_dir, cutaway_name)
    surfaces = []
    if not os.path.isdir(folder):
        return surfaces
    for fn in sorted(f for f in os.listdir(folder) if f.endswith(".png")):
        surfaces.append(cairo.ImageSurface.create_from_png(os.path.join(folder, fn)))
    return surfaces


def eval_curve(kind: str, x: float) -> float:
    if kind == "tempo_peak":
        return 3.4 * x * math.exp(-2.8 * x) + 0.08
    if kind == "cascade_drop":
        return 0.88 * math.exp(-4.2 * x) + 0.10
    if kind == "zipf_decay":
        return 0.92 / ((1.0 + 7.0 * x) ** 0.85)
    if kind == "hill_switch":
        xn = (x * 2.2) ** 4
        return 0.08 + 0.84 * (xn / (1.0 + xn))
    if kind == "hellman_tradeoff":
        return 0.90 / ((0.32 + x) ** 1.45) * 0.22
    if kind == "lyapunov_line":
        return min(0.92, 0.10 + 0.82 * x)
    if kind == "payback_cross":
        return 0.22 + 0.65 * (1.0 - math.exp(-3.5 * x))
    return min(0.84, 0.12 + 1.35 * x) if x < 0.53 else 0.84


def draw_chrome(ctx, study, tier: str, sc_idx: int, n_sc: int, t_sec: float, total_dur: float, font_sans="Avenir Next", font_mono="Menlo"):
    ctx.set_source_rgb(*PAL["bg"])
    ctx.paint()
    ctx.set_line_width(1.0)
    ctx.set_source_rgba(*PAL["amber"], 0.038)
    for gx in range(0, W, 40):
        ctx.move_to(gx, 0)
        ctx.line_to(gx, H)
    for gy in range(0, H, 40):
        ctx.move_to(0, gy)
        ctx.line_to(W, gy)
    ctx.stroke()

    g = cairo.RadialGradient(980, 270, 40, 980, 270, 540)
    g.add_color_stop_rgba(0.0, *PAL["cyan"], 0.085)
    g.add_color_stop_rgba(1.0, *PAL["bg"], 0.0)
    ctx.set_source(g)
    ctx.paint()

    # Top Studio Header
    ctx.set_source_rgba(8 / 255, 12 / 255, 24 / 255, 0.92)
    ctx.rectangle(0, 0, W, 62)
    ctx.fill()
    ctx.set_source_rgba(*PAL["border"], 0.55)
    ctx.move_to(0, 62)
    ctx.line_to(W, 62)
    ctx.stroke()

    px = 36
    px += draw_pill(ctx, px, 17, "OPENIE RESEARCH TV", PAL["amber"], font_mono, 11.5, True) + 10
    px += draw_pill(ctx, px, 17, TIER_NAMES.get(tier, tier.upper()), PAL["cyan"], font_mono, 11.5, True) + 12
    ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(15.5)
    ctx.set_source_rgb(*PAL["white"])
    ctx.move_to(px, 37)
    ctx.show_text(study["short_title"][:44])

    rx = W - 36
    tier_txt = study["energy_tier"].upper()
    e_col = PAL["emerald"] if "BOARD" in tier_txt else (PAL["cyan"] if "CHIP" in tier_txt else PAL["amber"])
    ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(11)
    ew = ctx.text_extents(tier_txt).width + 24
    rx -= int(ew)
    draw_pill(ctx, rx, 17, tier_txt, e_col, font_mono, 11, False)

    # Footer Progress & Plain-Language Metering Bar
    ctx.set_source_rgba(8 / 255, 12 / 255, 24 / 255, 0.94)
    ctx.rectangle(0, H - 48, W, 48)
    ctx.fill()
    prog = max(0.0, min(1.0, t_sec / max(0.1, total_dur)))
    ctx.set_source_rgba(*PAL["border"], 0.4)
    ctx.rectangle(0, H - 48, W, 3)
    ctx.fill()
    ctx.set_source_rgb(*PAL["amber"])
    ctx.rectangle(0, H - 48, W * prog, 3)
    ctx.fill()

    ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(11.5)
    ctx.set_source_rgb(*PAL["slate"])
    ctx.move_to(36, H - 19)
    narr = study.get("narrator_name", "Studio")
    ctx.show_text(f"Presenter: {narr} · {study['energy_disclosure'][:84]}")
    ctx.set_source_rgb(*PAL["cyan"])
    tc = f"PART {sc_idx + 1}/{n_sc}  ·  {t_sec:04.1f}s / {total_dur:04.1f}s"
    ctx.move_to(W - 245, H - 19)
    ctx.show_text(tc)


def _draw_three_bullets_scene(ctx, study, active_idx: int, u: float, frame_idx: int, cutaways, font_sans="Avenir Next", font_mono="Menlo"):
    bullets = study["plain_bullets"]
    card_w = 812 if cutaways else 1184
    ys = [194, 336, 478]
    card_h = 128

    for idx in range(3):
        by = ys[idx]
        is_active = idx == active_idx
        is_done = idx < active_idx
        if is_active:
            col = PAL["amber"] if idx == 0 else (PAL["cyan"] if idx == 1 else PAL["emerald"])
            alpha_txt = 1.0
            border_a = 0.92
            fill_a = 0.96
            badge_txt = f"KEY POINT {idx + 1} OF 3"
        elif is_done:
            col = PAL["emerald"]
            alpha_txt = 0.82
            border_a = 0.48
            fill_a = 0.84
            badge_txt = f"✓ POINT {idx + 1}"
        else:
            col = PAL["border"]
            alpha_txt = 0.46
            border_a = 0.30
            fill_a = 0.65
            badge_txt = f"POINT {idx + 1}"

        round_rect(ctx, 48, by, card_w, card_h, 14)
        ctx.set_source_rgba(*PAL["panel"], fill_a)
        ctx.fill_preserve()
        ctx.set_source_rgba(*col, border_a)
        ctx.set_line_width(2.4 if is_active else 1.3)
        ctx.stroke()

        # Left accent bar on active bullet
        if is_active:
            bar_h = max(12.0, (card_h - 24) * ease_out(min(1.0, u * 1.8)))
            round_rect(ctx, 54, by + 12, 6, bar_h, 3)
            ctx.set_source_rgb(*col)
            ctx.fill()

        draw_pill(ctx, 72, by + 14, badge_txt, col if (is_active or is_done) else PAL["slate"], font_mono, 11, is_active)

        ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD if is_active else cairo.FONT_WEIGHT_NORMAL)
        ctx.set_font_size(20.5 if cutaways else 22.0)
        ctx.set_source_rgba(*(PAL["white"] if is_active else PAL["slate"]), alpha_txt)
        wrap_text(ctx, bullets[idx], 74, by + 66, card_w - 48, 26.5, 3)

    if cutaways:
        round_rect(ctx, 882, 194, 350, 412, 16)
        ctx.set_source_rgba(*PAL["panel"], 0.78)
        ctx.fill_preserve()
        ctx.set_source_rgba(*PAL["border"], 0.5)
        ctx.set_line_width(1.4)
        ctx.stroke()
        draw_pill(ctx, 902, 212, "3D MODEL PREVIEW", PAL["cyan"], font_mono, 10.5, False)
        surf3d = cutaways[frame_idx % len(cutaways)]
        ctx.save()
        ctx.translate(876, 232)
        ctx.scale(0.56, 0.56)
        ctx.set_source_surface(surf3d, 0, 0)
        ctx.paint()
        ctx.restore()
        ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.set_font_size(13)
        ctx.set_source_rgb(*PAL["amber"])
        wrap_text(ctx, study["headline_metric"], 902, 558, 312, 19, 2)


def render_scene_body(ctx, study, kind: str, heading: str, submetric: str, u: float, frame_idx: int, cutaways, font_sans="Avenir Next", font_mono="Menlo"):
    eu = ease_out(min(1.0, u * 2.4))
    ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(12.5)
    ctx.set_source_rgb(*PAL["amber"])
    ctx.move_to(48, 98)
    ctx.show_text(study["category"].upper())

    ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(32)
    ctx.set_source_rgba(*PAL["white"], eu)
    ctx.move_to(48, 136)
    ctx.show_text(heading[:58])

    ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(15.5)
    ctx.set_source_rgba(*PAL["cyan"], eu)
    ctx.move_to(48, 166)
    ctx.show_text(submetric[:84])

    if kind in ("bullet_focus_1", "bullet_focus_2", "bullet_focus_3"):
        act_idx = int(kind[-1]) - 1
        _draw_three_bullets_scene(ctx, study, act_idx, u, frame_idx, cutaways, font_sans, font_mono)
        return

    if kind == "analogy_spotlight":
        left_t, left_b, right_t, right_b, takeaway = study["analogy"]
        cards = [
            ("EVERYDAY PROBLEM", left_t, left_b, PAL["rose"], 48),
            ("THE CORE INSIGHT", right_t, right_b, PAL["emerald"], 656),
        ]
        for idx, (tag, big, desc, col, cx) in enumerate(cards):
            appear = ease_out((u - idx * 0.14) * 2.5)
            round_rect(ctx, cx, 196, 576, 312, 16)
            ctx.set_source_rgba(*PAL["panel"], 0.92 * appear)
            ctx.fill_preserve()
            ctx.set_source_rgba(*col, 0.72 * appear)
            ctx.set_line_width(2.0)
            ctx.stroke()
            draw_pill(ctx, cx + 26, 220, tag, col, font_mono, 11.5, True)
            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            ctx.set_font_size(25)
            ctx.set_source_rgba(*PAL["white"], appear)
            wrap_text(ctx, big, cx + 26, 286, 524, 32, 2)
            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
            ctx.set_font_size(19)
            ctx.set_source_rgba(*PAL["slate"], appear)
            wrap_text(ctx, desc, cx + 26, 360, 524, 27, 4)

        round_rect(ctx, 48, 526, 1184, 92, 14)
        ctx.set_source_rgba(*PAL["panel"], 0.90)
        ctx.fill_preserve()
        ctx.set_source_rgba(*PAL["amber"], 0.65)
        ctx.set_line_width(1.8)
        ctx.stroke()
        draw_pill(ctx, 72, 542, "WHY IT MATTERS", PAL["amber"], font_mono, 11, True)
        ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.set_font_size(19.5)
        ctx.set_source_rgb(*PAL["white"])
        wrap_text(ctx, takeaway, 72, 594, 1136, 25, 2)
        return

    if kind == "hook_contrast":
        cards = [
            ("COMMON BOTTLENECK", study["nodes"][0][0], study["nodes"][0][1], PAL["rose"], 48),
            ("WHAT THIS STUDY CHANGES", study["nodes"][-1][0], study["headline_metric"], PAL["emerald"], 656),
        ]
        for idx, (tag, big, desc, col, cx) in enumerate(cards):
            appear = ease_out((u - idx * 0.14) * 2.5)
            round_rect(ctx, cx, 206, 576, 410, 16)
            ctx.set_source_rgba(*PAL["panel"], 0.90 * appear)
            ctx.fill_preserve()
            ctx.set_source_rgba(*col, 0.72 * appear)
            ctx.set_line_width(2.0)
            ctx.stroke()
            draw_pill(ctx, cx + 28, 234, tag, col, font_mono, 12, True)
            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            ctx.set_font_size(29)
            ctx.set_source_rgba(*PAL["white"], appear)
            wrap_text(ctx, big, cx + 28, 312, 520, 36, 2)
            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
            ctx.set_font_size(20)
            ctx.set_source_rgba(*col, appear)
            wrap_text(ctx, desc, cx + 28, 398, 520, 28, 3)
            for d in range(10):
                ph = (u * 3.0 + d * 0.1) % 1.0
                ctx.arc(cx + 42 + d * 50, 560, 5 + 3 * math.sin(ph * math.pi), 0, 2 * math.pi)
                ctx.set_source_rgba(*col, 0.25 + 0.65 * math.sin(ph * math.pi))
                ctx.fill()
        return

    if kind == "state_cascade":
        nodes = study["nodes"]
        nw, nh, y0 = 258, 224, 244
        xs = [48 + i * 298 for i in range(4)]
        for i in range(3):
            x1, x2 = xs[i] + nw, xs[i + 1]
            ym = y0 + nh / 2
            ctx.set_source_rgba(*PAL["cyan"], 0.45)
            ctx.set_line_width(3.0)
            ctx.move_to(x1, ym)
            ctx.line_to(x2, ym)
            ctx.stroke()
            pkt = (u * 2.0 - i * 0.25) % 1.0
            px = x1 + (x2 - x1) * pkt
            ctx.arc(px, ym, 6.5, 0, 2 * math.pi)
            ctx.set_source_rgb(*PAL["amber"])
            ctx.fill()
        for i, (ntitle, nsub, cname) in enumerate(nodes):
            col = PAL.get(cname, PAL["cyan"])
            act = ease_out((u - i * 0.12) * 2.8)
            round_rect(ctx, xs[i], y0, nw, nh, 14)
            ctx.set_source_rgba(*PAL["panel"], 0.94 * act)
            ctx.fill_preserve()
            ctx.set_source_rgba(*col, (0.4 + 0.55 * act))
            ctx.set_line_width(2.2)
            ctx.stroke()
            draw_pill(ctx, xs[i] + 18, y0 + 18, f"STEP {i + 1}", col, font_mono, 11, True)
            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            ctx.set_font_size(21)
            ctx.set_source_rgba(*PAL["white"], act)
            wrap_text(ctx, ntitle, xs[i] + 18, y0 + 80, nw - 36, 27, 2)
            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
            ctx.set_font_size(15.5)
            ctx.set_source_rgba(*PAL["slate"], act)
            wrap_text(ctx, nsub, xs[i] + 18, y0 + 144, nw - 36, 22, 3)
        round_rect(ctx, 48, 502, 1184, 114, 12)
        ctx.set_source_rgba(*PAL["panel"], 0.88)
        ctx.fill_preserve()
        ctx.set_source_rgba(*PAL["emerald"], 0.5)
        ctx.stroke()
        ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.set_font_size(15)
        ctx.set_source_rgb(*PAL["emerald"])
        ctx.move_to(74, 540)
        ctx.show_text(f"KEY OUTCOME: {study['headline_metric']}")
        ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
        ctx.set_font_size(17)
        ctx.set_source_rgb(*PAL["slate"])
        ctx.move_to(74, 580)
        ctx.show_text(study["equation"][1][:105])
        return

    if kind == "equation_curve":
        eq_str, eq_cap, ckind = study["equation"]
        round_rect(ctx, 48, 198, 1184, 108, 14)
        ctx.set_source_rgba(*PAL["panel"], 0.94)
        ctx.fill_preserve()
        ctx.set_source_rgba(*PAL["amber"], 0.65)
        ctx.set_line_width(1.8)
        ctx.stroke()
        ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.set_font_size(23)
        ctx.set_source_rgb(*PAL["amber"])
        ctx.move_to(76, 244)
        ctx.show_text(eq_str[:78])
        ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
        ctx.set_font_size(17)
        ctx.set_source_rgb(*PAL["slate"])
        ctx.move_to(76, 282)
        ctx.show_text(eq_cap[:108])

        gx, gy, gw, gh = 78, 332, 1124, 282
        round_rect(ctx, 48, 322, 1184, 304, 14)
        ctx.set_source_rgba(*PAL["panel"], 0.78)
        ctx.fill()
        ctx.set_source_rgba(*PAL["border"], 0.7)
        ctx.move_to(gx, gy + gh - 24)
        ctx.line_to(gx + gw, gy + gh - 24)
        ctx.move_to(gx, gy + 12)
        ctx.line_to(gx, gy + gh - 24)
        ctx.stroke()

        n_pts = max(2, int(140 * ease_out(min(1.0, u * 1.45))))
        ctx.set_line_width(4.0)
        ctx.set_source_rgb(*PAL["cyan"])
        for i in range(n_pts):
            xv = i / 139.0
            yv = eval_curve(ckind, xv)
            px = gx + xv * (gw - 24)
            py = (gy + gh - 28) - yv * (gh - 52)
            if i == 0:
                ctx.move_to(px, py)
            else:
                ctx.line_to(px, py)
        ctx.stroke()
        xv_end = (n_pts - 1) / 139.0
        yv_end = eval_curve(ckind, xv_end)
        ex, ey = gx + xv_end * (gw - 24), (gy + gh - 28) - yv_end * (gh - 52)
        ctx.arc(ex, ey, 8, 0, 2 * math.pi)
        ctx.set_source_rgb(*PAL["emerald"])
        ctx.fill()
        return

    if kind == "benchmark_bars":
        bars = study["bars"]
        for i, (blabel, bval, btxt, bcol_name) in enumerate(bars):
            col = PAL.get(bcol_name, PAL["cyan"])
            by = 218 + i * 128
            grow = ease_out((u - i * 0.12) * 2.2)
            round_rect(ctx, 48, by, 1184, 106, 12)
            ctx.set_source_rgba(*PAL["panel"], 0.88)
            ctx.fill_preserve()
            ctx.set_source_rgba(*PAL["border"], 0.45)
            ctx.set_line_width(1.2)
            ctx.stroke()

            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            ctx.set_font_size(20)
            ctx.set_source_rgb(*PAL["white"])
            ctx.move_to(72, by + 36)
            ctx.show_text(blabel[:52])

            ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            ctx.set_font_size(16)
            ctx.set_source_rgb(*col)
            ctx.move_to(680, by + 36)
            ctx.show_text(btxt[:48])

            bw_max = 1136
            bw = max(18.0, bw_max * (max(3, bval) / 100.0) * grow)
            round_rect(ctx, 72, by + 56, bw_max, 26, 7)
            ctx.set_source_rgba(*PAL["bg"], 0.85)
            ctx.fill()
            round_rect(ctx, 72, by + 56, bw, 26, 7)
            ctx.set_source_rgba(*col, 0.88)
            ctx.fill()
        return

    if kind == "cutaway_3d":
        round_rect(ctx, 48, 198, 620, 426, 16)
        ctx.set_source_rgba(*PAL["panel"], 0.82)
        ctx.fill_preserve()
        ctx.set_source_rgba(*PAL["cyan"], 0.55)
        ctx.set_line_width(1.8)
        ctx.stroke()
        draw_pill(ctx, 68, 214, "3D ARCHITECTURE VIEW", PAL["cyan"], font_mono, 11, True)
        if cutaways:
            surf3d = cutaways[frame_idx % len(cutaways)]
            ctx.save()
            ctx.translate(68, 206)
            ctx.scale(0.88, 0.78)
            ctx.set_source_surface(surf3d, 0, 0)
            ctx.paint()
            ctx.restore()
        for i, (clab, cval, ccol) in enumerate(study["cutaway_labels"]):
            col = PAL.get(ccol, PAL["amber"])
            cy = 202 + i * 106
            round_rect(ctx, 696, cy, 536, 92, 12)
            ctx.set_source_rgba(*PAL["panel"], 0.92)
            ctx.fill_preserve()
            ctx.set_source_rgba(*col, 0.68)
            ctx.set_line_width(1.6)
            ctx.stroke()
            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            ctx.set_font_size(20)
            ctx.set_source_rgb(*col)
            ctx.move_to(720, cy + 36)
            ctx.show_text(clab[:42])
            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
            ctx.set_font_size(16.5)
            ctx.set_source_rgb(*PAL["white"])
            ctx.move_to(720, cy + 68)
            ctx.show_text(cval[:54])
        return

    # falsifier_audit or horizon_slate
    f_title, f_l1, f_l2, f_pill = study["falsifier"]
    accent = PAL["emerald"] if kind == "horizon_slate" else PAL["amber"]
    round_rect(ctx, 48, 204, 1184, 244, 16)
    ctx.set_source_rgba(*PAL["panel"], 0.92)
    ctx.fill_preserve()
    ctx.set_source_rgba(*accent, 0.68)
    ctx.set_line_width(2.0)
    ctx.stroke()
    draw_pill(ctx, 76, 228, f_pill, accent, font_mono, 12, True)
    ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(27)
    ctx.set_source_rgb(*PAL["white"])
    ctx.move_to(76, 294)
    ctx.show_text(f_title[:64])
    ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(20)
    ctx.set_source_rgb(*PAL["slate"])
    wrap_text(ctx, f_l1, 76, 338, 1120, 28, 2)
    ctx.set_font_size(18)
    ctx.set_source_rgb(*PAL["amber"])
    wrap_text(ctx, f_l2, 76, 404, 1120, 25, 2)

    round_rect(ctx, 48, 468, 1184, 152, 14)
    ctx.set_source_rgba(*PAL["panel"], 0.88)
    ctx.fill_preserve()
    ctx.set_source_rgba(*PAL["cyan"], 0.5)
    ctx.stroke()
    ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(14.5)
    ctx.set_source_rgb(*PAL["cyan"])
    ctx.move_to(76, 508)
    ctx.show_text(f"FULL STUDY: research.openie.dev{study['paper_url']}   ·   INTERACTIVE: {study['figures_url']}")
    ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(20)
    ctx.set_source_rgb(*PAL["emerald"])
    ctx.move_to(76, 550)
    ctx.show_text(f"KEY RESULT: {study['headline_metric']}")
    ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(16)
    ctx.set_source_rgb(*PAL["slate"])
    ctx.move_to(76, 590)
    ctx.show_text(f"ENERGY MEASUREMENT: {study['energy_disclosure'][:96]}")


def render_poster_jpg(study, cutaways, out_jpg: str):
    surf = cairo.ImageSurface(cairo.FORMAT_RGB24, W, H)
    ctx = cairo.Context(surf)
    draw_chrome(ctx, study, "15s", 0, 3, 0.0, 18.0)
    render_scene_body(
        ctx,
        study,
        "bullet_focus_1",
        f"{study['short_title']}: 3 Plain Points",
        "Plain-language summary for every reader",
        1.0,
        22,
        cutaways,
    )
    im = Image.frombuffer("RGBA", (W, H), surf.get_data(), "raw", "BGRa", 0, 1).convert("RGB")
    im.save(out_jpg, "JPEG", quality=91, optimize=True)
