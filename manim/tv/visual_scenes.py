#!/usr/bin/env python3
"""
OpenIE Research TV — 3Blue1Brown + Huge-If-True Vector & 3D Compositing Engine.
Renders 1280x720 @ 30fps frames in pycairo using OpenIE's 4-color visual algebra:
  #0b1020 obsidian · #f59e0b amber (joules) · #22d3ee cyan (signal/form)
  #10b981 emerald (verified gate) · #f43f5e rose (drift/fault/falsifier)
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
    "slate": (152 / 255, 168 / 255, 194 / 255),
    "dim": (94 / 255, 112 / 255, 142 / 255),
    "amber": (245 / 255, 158 / 255, 11 / 255),
    "cyan": (34 / 255, 211 / 255, 238 / 255),
    "emerald": (16 / 255, 185 / 255, 129 / 255),
    "rose": (244 / 255, 63 / 255, 94 / 255),
}
TIER_NAMES = {"5s": "5S FLASH", "30s": "30S ELEVATOR", "60s": "60S BRIEFING", "90s": "90S LAB CUT"}


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


def draw_pill(ctx, x, y, text, col_rgb, font_mono="Menlo", size=13, filled=False):
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
    ctx.set_source_rgba(*PAL["amber"], 0.042)
    for gx in range(0, W, 40):
        ctx.move_to(gx, 0)
        ctx.line_to(gx, H)
    for gy in range(0, H, 40):
        ctx.move_to(0, gy)
        ctx.line_to(W, gy)
    ctx.stroke()

    g = cairo.RadialGradient(960, 260, 40, 960, 260, 520)
    g.add_color_stop_rgba(0.0, *PAL["cyan"], 0.09)
    g.add_color_stop_rgba(1.0, *PAL["bg"], 0.0)
    ctx.set_source(g)
    ctx.paint()

    # Top Studio Header
    ctx.set_source_rgba(8 / 255, 12 / 255, 24 / 255, 0.90)
    ctx.rectangle(0, 0, W, 62)
    ctx.fill()
    ctx.set_source_rgba(*PAL["border"], 0.55)
    ctx.move_to(0, 62)
    ctx.line_to(W, 62)
    ctx.stroke()

    px = 36
    px += draw_pill(ctx, px, 17, "OPENIE RESEARCH TV", PAL["amber"], font_mono, 12, True) + 10
    px += draw_pill(ctx, px, 17, TIER_NAMES.get(tier, tier.upper()), PAL["cyan"], font_mono, 12, True) + 12
    ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(16)
    ctx.set_source_rgb(*PAL["white"])
    ctx.move_to(px, 37)
    ctx.show_text(study["short_title"][:46])

    rx = W - 36
    e_col = PAL["emerald"] if "measured_j" in study["energy_tier"] else (PAL["cyan"] if "reported_j" in study["energy_tier"] else PAL["amber"])
    ew = ctx.text_extents(study["energy_tier"]).width + 26
    rx -= int(ew) + 8
    draw_pill(ctx, rx, 17, study["energy_tier"].upper(), e_col, font_mono, 11, False)
    for tag in reversed(study["epistemic_tags"]):
        rx -= 40
        draw_pill(ctx, rx, 17, f"[{tag}]", PAL["emerald"] if tag in ("T", "E") else PAL["amber"], font_mono, 11, False)

    # Footer Progress & Honest Metering Disclosure
    ctx.set_source_rgba(8 / 255, 12 / 255, 24 / 255, 0.92)
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
    ctx.show_text(f"AI-Synthesized Studio Voiceover · {study['energy_disclosure'][:96]}")
    ctx.set_source_rgb(*PAL["cyan"])
    tc = f"SCENE {sc_idx + 1}/{n_sc}  ·  {t_sec:04.1f}s / {total_dur:04.1f}s"
    ctx.move_to(W - 245, H - 19)
    ctx.show_text(tc)


def render_scene_body(ctx, study, kind: str, heading: str, submetric: str, u: float, frame_idx: int, cutaways, font_sans="Avenir Next", font_mono="Menlo"):
    eu = ease_out(min(1.0, u * 2.4))
    # Scene Title Banner
    ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(13)
    ctx.set_source_rgb(*PAL["amber"])
    ctx.move_to(48, 102)
    ctx.show_text(study["category"].upper())

    ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(34)
    ctx.set_source_rgba(*PAL["white"], eu)
    ctx.move_to(48, 142)
    ctx.show_text(heading)

    ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(17)
    ctx.set_source_rgba(*PAL["cyan"], eu)
    ctx.move_to(48, 172)
    ctx.show_text(submetric)

    if kind == "flash_kinetic":
        round_rect(ctx, 48, 202, 700, 420, 16)
        ctx.set_source_rgba(*PAL["panel"], 0.92)
        ctx.fill_preserve()
        ctx.set_source_rgba(*PAL["amber"], 0.65)
        ctx.set_line_width(2.0)
        ctx.stroke()

        ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.set_font_size(14)
        ctx.set_source_rgb(*PAL["emerald"])
        ctx.move_to(80, 250)
        ctx.show_text("VERIFIED HEADLINE RECEIPT")

        ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.set_font_size(36)
        ctx.set_source_rgb(*PAL["amber"])
        wrap_text(ctx, study["headline_metric"], 80, 304, 636, 46, 2)

        ctx.set_font_size(22)
        ctx.set_source_rgb(*PAL["white"])
        wrap_text(ctx, study["tiers"]["5s"]["hook"], 80, 418, 636, 32, 4)

        # Right side 3D hero or animated waveform
        if cutaways:
            surf3d = cutaways[frame_idx % len(cutaways)]
            ctx.save()
            ctx.translate(770, 165)
            ctx.scale(0.74, 0.74)
            ctx.set_source_surface(surf3d, 0, 0)
            ctx.paint()
            ctx.restore()
        return

    if kind == "hook_contrast":
        cards = [
            ("CONVENTIONAL BOTTLENECK", study["nodes"][0][0], study["nodes"][0][1], PAL["rose"], 48),
            ("OPENIE VERIFIED ARCHITECTURE", study["nodes"][-1][0], study["headline_metric"], PAL["emerald"], 656),
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
            ctx.set_font_size(31)
            ctx.set_source_rgba(*PAL["white"], appear)
            wrap_text(ctx, big, cx + 28, 312, 520, 38, 2)
            ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
            ctx.set_font_size(18)
            ctx.set_source_rgba(*col, appear)
            wrap_text(ctx, desc, cx + 28, 396, 520, 28, 3)
            # Animated pulse dots at bottom of card
            for d in range(10):
                ph = (u * 3.0 + d * 0.1) % 1.0
                ctx.arc(cx + 42 + d * 50, 560, 5 + 3 * math.sin(ph * math.pi), 0, 2 * math.pi)
                ctx.set_source_rgba(*col, 0.25 + 0.65 * math.sin(ph * math.pi))
                ctx.fill()
        return

    if kind == "state_cascade":
        nodes = study["nodes"]
        nw, nh, y0 = 258, 210, 255
        xs = [48 + i * 298 for i in range(4)]
        for i in range(3):
            x1, x2 = xs[i] + nw, xs[i + 1]
            ym = y0 + nh / 2
            ctx.set_source_rgba(*PAL["cyan"], 0.45)
            ctx.set_line_width(3.0)
            ctx.move_to(x1, ym)
            ctx.line_to(x2, ym)
            ctx.stroke()
            pkt = (u * 2.2 - i * 0.25) % 1.0
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
            draw_pill(ctx, xs[i] + 18, y0 + 18, f"STAGE 0{i + 1}", col, font_mono, 11, True)
            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            ctx.set_font_size(22)
            ctx.set_source_rgba(*PAL["white"], act)
            wrap_text(ctx, ntitle, xs[i] + 18, y0 + 82, nw - 36, 28, 2)
            ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
            ctx.set_font_size(14.5)
            ctx.set_source_rgba(*PAL["slate"], act)
            wrap_text(ctx, nsub, xs[i] + 18, y0 + 148, nw - 36, 21, 2)
        round_rect(ctx, 48, 505, 1184, 112, 12)
        ctx.set_source_rgba(*PAL["panel"], 0.85)
        ctx.fill_preserve()
        ctx.set_source_rgba(*PAL["emerald"], 0.5)
        ctx.stroke()
        ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.set_font_size(16)
        ctx.set_source_rgb(*PAL["emerald"])
        ctx.move_to(74, 545)
        ctx.show_text(f"VERIFIED TARGET: {study['headline_metric']}")
        ctx.set_font_size(14)
        ctx.set_source_rgb(*PAL["slate"])
        ctx.move_to(74, 582)
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
        ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.set_font_size(23)
        ctx.set_source_rgb(*PAL["amber"])
        ctx.move_to(76, 246)
        ctx.show_text(eq_str[:76])
        ctx.set_font_size(14)
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
            by = 224 + i * 126
            grow = ease_out((u - i * 0.12) * 2.2)
            round_rect(ctx, 48, by, 1184, 104, 12)
            ctx.set_source_rgba(*PAL["panel"], 0.88)
            ctx.fill_preserve()
            ctx.set_source_rgba(*PAL["border"], 0.45)
            ctx.set_line_width(1.2)
            ctx.stroke()

            ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            ctx.set_font_size(20)
            ctx.set_source_rgb(*PAL["white"])
            ctx.move_to(72, by + 36)
            ctx.show_text(blabel)

            ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
            ctx.set_font_size(17)
            ctx.set_source_rgb(*col)
            ctx.move_to(720, by + 36)
            ctx.show_text(btxt)

            bw_max = 1136
            bw = max(18.0, bw_max * (max(3, bval) / 100.0) * grow)
            round_rect(ctx, 72, by + 54, bw_max, 26, 7)
            ctx.set_source_rgba(*PAL["bg"], 0.85)
            ctx.fill()
            round_rect(ctx, 72, by + 54, bw, 26, 7)
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
        draw_pill(ctx, 68, 214, "BLENDER 5.3 EEVEE 3D CUTAWAY", PAL["cyan"], font_mono, 11, True)
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
            ctx.show_text(clab)
            ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
            ctx.set_font_size(15.5)
            ctx.set_source_rgb(*PAL["white"])
            ctx.move_to(720, cy + 68)
            ctx.show_text(cval)
        return

    # falsifier_audit or horizon_slate
    f_title, f_l1, f_l2, f_pill = study["falsifier"]
    accent = PAL["emerald"] if kind == "horizon_slate" else PAL["rose"]
    round_rect(ctx, 48, 206, 1184, 240, 16)
    ctx.set_source_rgba(*PAL["panel"], 0.92)
    ctx.fill_preserve()
    ctx.set_source_rgba(*accent, 0.68)
    ctx.set_line_width(2.0)
    ctx.stroke()
    draw_pill(ctx, 76, 232, f_pill, PAL["emerald"], font_mono, 13, True)
    ctx.select_font_face(font_sans, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(28)
    ctx.set_source_rgb(*PAL["white"])
    ctx.move_to(76, 300)
    ctx.show_text(f_title)
    ctx.set_font_size(20)
    ctx.set_source_rgb(*PAL["slate"])
    wrap_text(ctx, f_l1, 76, 344, 1120, 28, 2)
    ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(15.5)
    ctx.set_source_rgb(*PAL["amber"])
    wrap_text(ctx, f_l2, 76, 408, 1120, 24, 2)

    round_rect(ctx, 48, 472, 1184, 148, 14)
    ctx.set_source_rgba(*PAL["panel"], 0.88)
    ctx.fill_preserve()
    ctx.set_source_rgba(*PAL["cyan"], 0.5)
    ctx.stroke()
    ctx.select_font_face(font_mono, cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
    ctx.set_font_size(15)
    ctx.set_source_rgb(*PAL["cyan"])
    ctx.move_to(76, 512)
    ctx.show_text(f"PAPER: research.openie.dev{study['paper_url']}   ·   FIGURES: {study['figures_url']}")
    ctx.set_font_size(19)
    ctx.set_source_rgb(*PAL["emerald"])
    ctx.move_to(76, 554)
    ctx.show_text(f"HEADLINE: {study['headline_metric']}")
    ctx.set_font_size(14)
    ctx.set_source_rgb(*PAL["slate"])
    ctx.move_to(76, 592)
    ctx.show_text(f"METERING: {study['energy_disclosure'][:104]}")


def render_poster_jpg(study, cutaways, out_jpg: str):
    surf = cairo.ImageSurface(cairo.FORMAT_RGB24, W, H)
    ctx = cairo.Context(surf)
    draw_chrome(ctx, study, "90s", 0, 1, 0.0, 90.0)
    render_scene_body(ctx, study, "flash_kinetic", study["short_title"].upper(), study["category"], 1.0, 22, cutaways)
    im = Image.frombuffer("RGBA", (W, H), surf.get_data(), "raw", "BGRa", 0, 1).convert("RGB")
    im.save(out_jpg, "JPEG", quality=91, optimize=True)
