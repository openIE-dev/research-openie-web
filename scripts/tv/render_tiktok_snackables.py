#!/usr/bin/env python3
"""
OpenIE Research TV — Deterministic 9:16 (1080x1920 @ 60fps) TikTok / Shorts / Reels Producer.

Composes broadcast-grade vertical snackable films from `src/data/tv-catalog.json`
and the 15s studio masters (`public/media/tv/films/<id>-15s.mp4`):
  - Enforces strict TikTok UI safe zones (`x: 56..924`, `y: 164..1485`).
  - Top Header Strip (`y: 168..230`) with badge, category pill, synced `POINT k OF 3`
    indicator, and 60fps chaptered progress bar.
  - Instant `0.0s` Scroll-Stopper Hook Card (`y: 244..448`) with `short_title` and
    `headline_metric` pill.
  - 3D & Animated Visual Stage (`y: 468..1116`, `868x648`) compositing the clean
    3D turntable cutaway from `<id>-15s.mp4` with frame blending and smooth
    `1.00x -> 1.04x` Ken-Burns motion.
  - Kinetic Burned-In Safe-Zone Captions (`y: 1138..1410`) at `44px-46px` ExtraBold
    (`<= 32` chars/line, max 3 lines per card) synced to exact voiceover cues.
  - Honest Energy & Primary Source Pill (`y: 1422..1482`).
  - Two-pass EBU R128 / ITU-R BS.1770 loudness normalization (`-14.0 LUFS`, `-1.0 dBTP`,
    `AAC 192k`, `48000 Hz`, stereo), companion `1080x1920` JPEG cover at `t = 1.5s`,
    WebVTT captions, and TikTok Content Posting API v2 manifest.
"""
from __future__ import annotations

import argparse
import concurrent.futures as cf
import hashlib
import json
import math
import os
import pathlib
import re
import subprocess
import sys
import time
from typing import Any

import blake3
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT_W = 1080
OUT_H = 1920
FPS = 60
SS = 2  # 2x supersampling (2160x3840) for razor-sharp vector cards & typography

SAFE_X0 = 56
SAFE_X1 = 924
SAFE_W = SAFE_X1 - SAFE_X0  # 868
SAFE_Y0 = 164
SAFE_Y1 = 1485

PAL = {
    "bg_top": (8, 12, 24),
    "bg_mid": (11, 17, 34),
    "bg_bot": (8, 12, 24),
    "card": (16, 24, 46),
    "card_deep": (13, 20, 38),
    "stage_bg": (16, 27, 47),
    "border": (52, 70, 108),
    "white": (248, 250, 252),
    "slate": (166, 182, 208),
    "dim": (104, 122, 154),
    "amber": (245, 158, 11),
    "amber_bright": (252, 201, 56),
    "cyan": (34, 211, 238),
    "emerald": (16, 185, 129),
}

POINT_COLORS = [PAL["amber"], PAL["cyan"], PAL["emerald"]]

CATEGORY_HASHTAGS = {
    "Foundations & Thermodynamics": ["#openscience", "#physics", "#thermodynamics", "#ai", "#computerscience"],
    "Reality Code Engine": ["#openscience", "#computerscience", "#softwareengineering", "#compilers", "#ai"],
    "Null & Benchmarks": ["#openscience", "#ai", "#machinelearning", "#benchmarks", "#computerscience"],
    "Communication Avalanche & Bio": ["#openscience", "#biology", "#ai", "#neuroscience", "#computerscience"],
    "Hardware, Silicon & OS": ["#openscience", "#hardware", "#silicon", "#systems", "#computerscience"],
    "Economics & Cadence": ["#openscience", "#economics", "#ai", "#software", "#computerscience"],
}

SHORT_CATEGORY = {
    "Foundations & Thermodynamics": "THERMODYNAMICS",
    "Reality Code Engine": "REALITY CODE ENGINE",
    "Null & Benchmarks": "NULL & BENCHMARKS",
    "Communication Avalanche & Bio": "AVALANCHE & BIO",
    "Hardware, Silicon & OS": "HARDWARE & SILICON",
    "Economics & Cadence": "ECONOMICS & CADENCE",
}


class FontBank:
    def __init__(self, fonts_dir: pathlib.Path | None) -> None:
        self.fonts_dir = fonts_dir
        self._cache: dict[tuple[str, str, int], ImageFont.FreeTypeFont] = {}

    def _resolve_path(self, family: str) -> tuple[str, bool]:
        if self.fonts_dir is not None:
            mapping = {
                "display": "space-grotesk-latin.woff2",
                "sans": "inter-latin.woff2",
                "mono": "jetbrains-mono-latin.woff2",
            }
            cand = self.fonts_dir / mapping.get(family, "inter-latin.woff2")
            if cand.is_file():
                return str(cand), True
        dejavu_dir = pathlib.Path("/usr/share/fonts/truetype/dejavu")
        if family == "mono" and (dejavu_dir / "DejaVuSansMono-Bold.ttf").is_file():
            return str(dejavu_dir / "DejaVuSansMono-Bold.ttf"), False
        if (dejavu_dir / "DejaVuSans-Bold.ttf").is_file():
            return str(dejavu_dir / "DejaVuSans-Bold.ttf"), False
        raise RuntimeError(f"Could not locate font assets for family={family}")

    def get(self, family: str, weight: str, size_px: int) -> ImageFont.FreeTypeFont:
        key = (family, weight, size_px)
        if key in self._cache:
            return self._cache[key]
        path, is_var = self._resolve_path(family)
        font = ImageFont.truetype(path, size_px)
        if is_var and hasattr(font, "get_variation_names"):
            try:
                names = [n.decode("utf-8", "ignore") if isinstance(n, bytes) else str(n) for n in font.get_variation_names()]
                if weight in names:
                    font.set_variation_by_name(weight)
                elif "Bold" in names and weight in ("ExtraBold", "Black", "SemiBold"):
                    font.set_variation_by_name("Bold")
            except Exception:
                pass
        self._cache[key] = font
        return font


def sanitize_glyphs(text: str) -> str:
    """Normalize rare typographic characters to crisp Latin-1/ASCII equivalents supported by all Latin subsets."""
    return (
        text.replace("\u2014", " - ")
        .replace("\u2013", "-")
        .replace("\u2212", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u00a0", " ")
        .replace("  ", " ")
        .strip()
    )


def assert_safe_box(x0: float, y0: float, x1: float, y1: float, label: str) -> None:
    """Enforce strict TikTok safe-zone compliance in 1080x1920 coordinates."""
    tol = 1.5
    if x0 < SAFE_X0 - tol or x1 > SAFE_X1 + tol or y0 < SAFE_Y0 - tol or y1 > SAFE_Y1 + tol:
        raise ValueError(
            f"Safe-zone violation on {label}: bbox=({x0:.1f}, {y0:.1f}, {x1:.1f}, {y1:.1f}) "
            f"outside ({SAFE_X0}, {SAFE_Y0}, {SAFE_X1}, {SAFE_Y1})"
        )


def wrap_caption_lines(
    draw: ImageDraw.ImageDraw,
    text: str,
    font: ImageFont.FreeTypeFont,
    max_chars: int,
    max_width_ss: int,
) -> list[str]:
    words = sanitize_glyphs(text).split()
    lines: list[str] = []
    cur = ""
    for w in words:
        cand = f"{cur} {w}".strip() if cur else w
        bbox = draw.textbbox((0, 0), cand, font=font)
        w_px = bbox[2] - bbox[0]
        if cur and (len(cand) > max_chars or w_px > max_width_ss):
            lines.append(cur)
            cur = w
        else:
            cur = cand
    if cur:
        lines.append(cur)
    return lines


def build_tiktok_cue_cards(
    raw_cues: list[dict[str, Any]],
    total_dur: float,
    fonts: FontBank,
) -> tuple[list[dict[str, Any]], list[float]]:
    """
    Convert catalog 15s cues into mobile-legible kinetic caption cards:
      - Tracks active takeaway point (0, 1, 2) synced to 'First,', 'Second,', 'Third,' transitions.
      - Enforces <= 32 chars per line and max 3 lines per card at 44px ExtraBold.
      - Splits >3-line cues proportionally across [start, end] so zero text is ever truncated.
    """
    dummy = Image.new("RGB", (64, 64))
    draw = ImageDraw.Draw(dummy)
    cap_font = fonts.get("sans", "ExtraBold", 44 * SS)
    max_w_ss = (SAFE_W - 64) * SS  # 804px inner width

    point_idx = 0
    point_starts = [0.0, total_dur * 0.33, total_dur * 0.66]
    seen_points = {0}
    cards: list[dict[str, Any]] = []

    for cue in raw_cues:
        txt = sanitize_glyphs(cue["text"])
        t0 = float(cue["start"])
        t1 = float(cue["end"])
        low = txt.lower()
        if low.startswith("first,") or low.startswith("first "):
            point_idx = 0
            point_starts[0] = 0.0
        elif low.startswith("second,") or low.startswith("second "):
            point_idx = 1
            if 1 not in seen_points:
                point_starts[1] = t0
                seen_points.add(1)
        elif low.startswith("third,") or low.startswith("third "):
            point_idx = 2
            if 2 not in seen_points:
                point_starts[2] = t0
                seen_points.add(2)

        lines = wrap_caption_lines(draw, txt, cap_font, max_chars=32, max_width_ss=max_w_ss)
        if len(lines) <= 3:
            cards.append(
                {
                    "start": t0,
                    "end": t1,
                    "lines": lines,
                    "point_idx": point_idx,
                    "raw_text": " ".join(lines),
                }
            )
        else:
            # Balance lines across chunks of <= 3 lines (e.g., 4 -> 2+2, 5 -> 3+2, 6 -> 3+3)
            n_chunks = math.ceil(len(lines) / 3)
            base_sz = len(lines) // n_chunks
            rem = len(lines) % n_chunks
            chunks: list[list[str]] = []
            pos = 0
            for ci in range(n_chunks):
                sz = base_sz + (1 if ci < rem else 0)
                chunks.append(lines[pos : pos + sz])
                pos += sz
            char_counts = [max(1, sum(len(ln) for ln in ch)) for ch in chunks]
            tot_chars = sum(char_counts)
            cur_t = t0
            span = max(0.05, t1 - t0)
            for ci, ch in enumerate(chunks):
                dt = span * (char_counts[ci] / tot_chars)
                nxt_t = t1 if ci == n_chunks - 1 else (cur_t + dt)
                cards.append(
                    {
                        "start": round(cur_t, 3),
                        "end": round(nxt_t, 3),
                        "lines": ch,
                        "point_idx": point_idx,
                        "raw_text": " ".join(ch),
                    }
                )
                cur_t = nxt_t

    # Build continuous visual display intervals [disp_start, disp_end] so captions never flicker blank
    for i, c in enumerate(cards):
        c["disp_start"] = 0.0 if i == 0 else cards[i - 1]["disp_end"]
        if i < len(cards) - 1:
            # Switch cleanly right when the next cue begins speaking
            c["disp_end"] = cards[i + 1]["start"]
        else:
            c["disp_end"] = total_dur + 1.0

    return cards, point_starts


def format_vtt_ts(sec: float) -> str:
    sec = max(0.0, sec)
    hh = int(sec // 3600)
    mm = int((sec % 3600) // 60)
    ss = sec % 60
    return f"{hh:02d}:{mm:02d}:{ss:06.3f}"


def write_vtt(cards: list[dict[str, Any]], vtt_path: pathlib.Path) -> None:
    out = ["WEBVTT", "Kind: captions", "Language: en", ""]
    for idx, c in enumerate(cards, 1):
        out.append(str(idx))
        out.append(f"{format_vtt_ts(c['start'])} --> {format_vtt_ts(c['end'])} line:72%")
        out.extend(c["lines"])
        out.append("")
    vtt_path.write_text("\n".join(out), encoding="utf-8")


def draw_pill_ss(
    draw: ImageDraw.ImageDraw,
    x_ss: int,
    y_ss: int,
    text: str,
    col: tuple[int, int, int],
    font: ImageFont.FreeTypeFont,
    pad_x_ss: int = 20,
    pad_y_ss: int = 10,
    radius_ss: int = 14,
    fill_alpha: float = 0.18,
    bg_rgb: tuple[int, int, int] = PAL["card"],
    right_align: bool = False,
    label_for_check: str = "pill",
) -> tuple[int, int, int, int]:
    txt = sanitize_glyphs(text)
    tb = draw.textbbox((0, 0), txt, font=font)
    tw = tb[2] - tb[0]
    th = tb[3] - tb[1]
    pw = tw + 2 * pad_x_ss
    ph = th + 2 * pad_y_ss
    x0 = x_ss - pw if right_align else x_ss
    y0 = y_ss
    x1 = x0 + pw
    y1 = y0 + ph

    assert_safe_box(x0 / SS, y0 / SS, x1 / SS, y1 / SS, label_for_check)

    fill_col = tuple(int(bg_rgb[k] * (1.0 - fill_alpha) + col[k] * fill_alpha) for k in range(3))
    border_col = tuple(int(bg_rgb[k] * 0.28 + col[k] * 0.72) for k in range(3))
    draw.rounded_rectangle([x0, y0, x1, y1], radius=radius_ss, fill=fill_col, outline=border_col, width=max(2, SS))
    tx = x0 + pad_x_ss - tb[0]
    ty = y0 + pad_y_ss - tb[1]
    draw.text((tx, ty), txt, font=font, fill=col)
    return (x0, y0, x1, y1)


def make_base_background() -> np.ndarray:
    """Create 1080x1920 dark studio background with subtle architectural grid (zero text in unsafe zones)."""
    ys = np.linspace(0.0, 1.0, OUT_H, dtype=np.float32)[:, None]
    top = np.array(PAL["bg_top"], dtype=np.float32)
    mid = np.array(PAL["bg_mid"], dtype=np.float32)
    bot = np.array(PAL["bg_bot"], dtype=np.float32)
    upper = ys <= 0.5
    t_up = np.clip(ys * 2.0, 0.0, 1.0)
    t_dn = np.clip((ys - 0.5) * 2.0, 0.0, 1.0)
    grad = np.where(upper, top * (1.0 - t_up) + mid * t_up, mid * (1.0 - t_dn) + bot * t_dn)
    canvas = np.repeat(grad[:, None, :], OUT_W, axis=1)

    # Subtle 48px studio blueprint grid
    amber = np.array(PAL["amber"], dtype=np.float32)
    for gx in range(24, OUT_W, 48):
        canvas[:, gx, :] = canvas[:, gx, :] * 0.962 + amber * 0.038
    for gy in range(24, OUT_H, 48):
        canvas[gy, :, :] = canvas[gy, :, :] * 0.962 + amber * 0.038

    return np.clip(canvas, 0, 255).astype(np.uint8)


def render_cue_canvas(
    base_bg: np.ndarray,
    study: dict[str, Any],
    card: dict[str, Any],
    point_starts: list[float],
    total_dur: float,
    fonts: FontBank,
) -> np.ndarray:
    """
    Render a 2x-supersampled (2160x3840 -> 1080x1920) RGB studio canvas for one cue state.
    All text & cards strictly reside inside x: 56..924, y: 164..1485.
    """
    p_idx = int(card["point_idx"])
    accent = POINT_COLORS[p_idx]

    # Add subtle active-color radial glow behind the 3D Visual Stage (cx=490, cy=792)
    yy, xx = np.ogrid[:OUT_H, :OUT_W]
    dist2 = ((xx - 490.0) / 460.0) ** 2 + ((yy - 792.0) / 460.0) ** 2
    glow = np.clip(1.0 - dist2, 0.0, 1.0) ** 2 * 0.09
    bg_float = base_bg.astype(np.float32) + glow[:, :, None] * np.array(accent, dtype=np.float32)
    bg_ss = Image.fromarray(np.clip(bg_float, 0, 255).astype(np.uint8), mode="RGB").resize(
        (OUT_W * SS, OUT_H * SS), Image.Resampling.BILINEAR
    )
    draw = ImageDraw.Draw(bg_ss)

    x0 = SAFE_X0 * SS
    x1 = SAFE_X1 * SS

    # -------------------------------------------------------------------------
    # ZONE 1: Top Header Strip (y: 168..230, x: 56..924)
    # -------------------------------------------------------------------------
    f_hdr = fonts.get("mono", "Bold", int(12.5 * SS))
    p1_box = draw_pill_ss(
        draw,
        x0,
        169 * SS,
        "OPENIE RESEARCH · 15S SNACKABLE",
        PAL["amber"],
        f_hdr,
        pad_x_ss=16,
        pad_y_ss=9,
        radius_ss=12,
        fill_alpha=0.22,
        label_for_check="header_brand_pill",
    )
    p3_box = draw_pill_ss(
        draw,
        x1,
        169 * SS,
        f"POINT {p_idx + 1} OF 3",
        accent,
        f_hdr,
        pad_x_ss=16,
        pad_y_ss=9,
        radius_ss=12,
        fill_alpha=0.26,
        right_align=True,
        label_for_check="header_point_pill",
    )
    cat_label = SHORT_CATEGORY.get(study["category"], study["category"].upper()[:20])
    cat_x = p1_box[2] + 10 * SS
    if cat_x + 180 * SS < p3_box[0] - 8 * SS:
        draw_pill_ss(
            draw,
            cat_x,
            169 * SS,
            cat_label,
            PAL["cyan"],
            f_hdr,
            pad_x_ss=15,
            pad_y_ss=9,
            radius_ss=12,
            fill_alpha=0.14,
            label_for_check="header_category_pill",
        )

    # Progress bar track at y: 216..226, x: 56..924 (animated fill added at 60fps)
    pb_y0, pb_y1 = 216 * SS, 226 * SS
    draw.rounded_rectangle(
        [x0, pb_y0, x1, pb_y1],
        radius=5 * SS,
        fill=(20, 30, 56),
        outline=PAL["border"],
        width=max(1, SS),
    )
    for m_sec in point_starts[1:]:
        frac = max(0.05, min(0.95, m_sec / max(0.1, total_dur)))
        mx = int(x0 + (x1 - x0) * frac)
        draw.line([(mx, pb_y0), (mx, pb_y1)], fill=(110, 132, 172), width=2 * SS)

    # -------------------------------------------------------------------------
    # ZONE 2: Instant 0.0s Scroll-Stopper Hook Card (y: 244..448, x: 56..924)
    # -------------------------------------------------------------------------
    hk_y0, hk_y1 = 244 * SS, 448 * SS
    draw.rounded_rectangle(
        [x0, hk_y0, x1, hk_y1],
        radius=20 * SS,
        fill=PAL["card"],
        outline=(64, 88, 136),
        width=2 * SS,
    )
    # Top glass highlight bar
    draw.rounded_rectangle(
        [x0 + 24 * SS, hk_y0, x0 + 220 * SS, hk_y0 + 4 * SS],
        radius=2 * SS,
        fill=PAL["amber"],
    )

    short_title = sanitize_glyphs(study["short_title"])
    max_hook_w = (SAFE_W - 48) * SS  # 820px
    title_lines = [short_title]
    f_title = fonts.get("display", "Bold", 38 * SS)
    for sz in (40, 38, 36, 34, 32):
        f_try = fonts.get("display", "Bold", sz * SS)
        wrapped = wrap_caption_lines(draw, short_title, f_try, max_chars=46, max_width_ss=max_hook_w)
        if len(wrapped) <= 2:
            f_title = f_try
            title_lines = wrapped
            break

    line_h_title = int(f_title.size * 1.18)
    ty_cur = (264 if len(title_lines) == 2 else 284) * SS
    for ln in title_lines[:2]:
        tb = draw.textbbox((0, 0), ln, font=f_title)
        tx = (SAFE_X0 + 24) * SS - tb[0]
        ty = ty_cur - tb[1]
        assert_safe_box(tx / SS, ty / SS, (tx + tb[2] - tb[0]) / SS, (ty + tb[3] - tb[1]) / SS, "hook_short_title")
        draw.text((tx, ty), ln, font=f_title, fill=PAL["white"])
        ty_cur += line_h_title

    # Headline metric pill inside Hook Card (y: 382..432)
    metric_txt = sanitize_glyphs(study["headline_metric"])
    f_met = fonts.get("mono", "Bold", 18 * SS)
    for msz in (20, 19, 18, 17, 16, 15, 14):
        f_mtry = fonts.get("mono", "Bold", msz * SS)
        mb = draw.textbbox((0, 0), metric_txt, font=f_mtry)
        if (mb[2] - mb[0]) + 44 * SS <= max_hook_w:
            f_met = f_mtry
            break
    draw_pill_ss(
        draw,
        (SAFE_X0 + 24) * SS,
        384 * SS,
        metric_txt,
        PAL["amber_bright"],
        f_met,
        pad_x_ss=20,
        pad_y_ss=11,
        radius_ss=14,
        fill_alpha=0.18,
        bg_rgb=PAL["card_deep"],
        label_for_check="hook_headline_metric",
    )

    # -------------------------------------------------------------------------
    # ZONE 3: 3D & Animated Visual Stage (y: 468..1116, x: 56..924, 868x648)
    # -------------------------------------------------------------------------
    st_y0, st_y1 = 468 * SS, 1116 * SS
    st_border = tuple(int(PAL["border"][k] * 0.35 + accent[k] * 0.65) for k in range(3))
    draw.rounded_rectangle(
        [x0, st_y0, x1, st_y1],
        radius=24 * SS,
        fill=PAL["stage_bg"],
        outline=st_border,
        width=int(2.5 * SS),
    )

    # Top stage HUD badges (y: 488..524)
    f_stage_hud = fonts.get("mono", "Bold", 12 * SS)
    draw_pill_ss(
        draw,
        (SAFE_X0 + 24) * SS,
        488 * SS,
        "3D STUDIO CUTAWAY",
        PAL["cyan"],
        f_stage_hud,
        pad_x_ss=16,
        pad_y_ss=8,
        radius_ss=11,
        fill_alpha=0.15,
        bg_rgb=PAL["stage_bg"],
        label_for_check="stage_left_hud",
    )
    narrator = sanitize_glyphs(study.get("narrator_name", "Studio")).upper()
    draw_pill_ss(
        draw,
        (SAFE_X1 - 24) * SS,
        488 * SS,
        f"VOICE · {narrator}",
        PAL["slate"],
        f_stage_hud,
        pad_x_ss=16,
        pad_y_ss=8,
        radius_ss=11,
        fill_alpha=0.14,
        bg_rgb=PAL["stage_bg"],
        right_align=True,
        label_for_check="stage_right_hud",
    )

    # Subtle corner reticles framing the 3D viewport (y: 536..1040)
    ret_col = tuple(int(PAL["stage_bg"][k] * 0.55 + accent[k] * 0.45) for k in range(3))
    rx0, ry0, rx1, ry1 = (SAFE_X0 + 32) * SS, 538 * SS, (SAFE_X1 - 32) * SS, 1040 * SS
    arm = 18 * SS
    lw = 2 * SS
    for cx_r, cy_r, dx_s, dy_s in [
        (rx0, ry0, 1, 1),
        (rx1, ry0, -1, 1),
        (rx0, ry1, 1, -1),
        (rx1, ry1, -1, -1),
    ]:
        draw.line([(cx_r, cy_r), (cx_r + dx_s * arm, cy_r)], fill=ret_col, width=lw)
        draw.line([(cx_r, cy_r), (cx_r, cy_r + dy_s * arm)], fill=ret_col, width=lw)

    # Bottom stage 3-chapter status pills (y: 1058..1096)
    step_labels = ["01 · FIRST", "02 · SECOND", "03 · THIRD"]
    sx_cur = (SAFE_X0 + 24) * SS
    for s_i, s_lab in enumerate(step_labels):
        s_col = POINT_COLORS[s_i] if s_i == p_idx else (PAL["emerald"] if s_i < p_idx else PAL["dim"])
        s_alpha = 0.26 if s_i == p_idx else 0.10
        bx = draw_pill_ss(
            draw,
            sx_cur,
            1058 * SS,
            s_lab,
            s_col,
            f_stage_hud,
            pad_x_ss=15,
            pad_y_ss=8,
            radius_ss=11,
            fill_alpha=s_alpha,
            bg_rgb=PAL["stage_bg"],
            label_for_check=f"stage_step_{s_i}",
        )
        sx_cur = bx[2] + 10 * SS

    draw_pill_ss(
        draw,
        (SAFE_X1 - 24) * SS,
        1058 * SS,
        "9:16 · 60FPS",
        PAL["amber"],
        f_stage_hud,
        pad_x_ss=15,
        pad_y_ss=8,
        radius_ss=11,
        fill_alpha=0.14,
        bg_rgb=PAL["stage_bg"],
        right_align=True,
        label_for_check="stage_fps_hud",
    )

    # -------------------------------------------------------------------------
    # ZONE 4: Kinetic Burned-In Safe-Zone Captions (y: 1138..1410, x: 56..924)
    # -------------------------------------------------------------------------
    cp_y0, cp_y1 = 1138 * SS, 1410 * SS
    cp_border = tuple(int(PAL["border"][k] * 0.25 + accent[k] * 0.75) for k in range(3))
    draw.rounded_rectangle(
        [x0, cp_y0, x1, cp_y1],
        radius=22 * SS,
        fill=PAL["card_deep"],
        outline=cp_border,
        width=int(2.5 * SS),
    )
    # Left glowing vertical accent bar inside caption card
    draw.rounded_rectangle(
        [(SAFE_X0 + 14) * SS, 1156 * SS, (SAFE_X0 + 21) * SS, 1392 * SS],
        radius=3 * SS,
        fill=accent,
    )

    # Numbered Takeaway Badge (1 / 2 / 3) + header tag
    badge_x0 = (SAFE_X0 + 34) * SS
    badge_y0 = 1154 * SS
    badge_r = 16 * SS
    draw.rounded_rectangle(
        [badge_x0, badge_y0, badge_x0 + 34 * SS, badge_y0 + 32 * SS],
        radius=9 * SS,
        fill=accent,
    )
    f_num = fonts.get("mono", "ExtraBold", 17 * SS)
    num_s = str(p_idx + 1)
    nb = draw.textbbox((0, 0), num_s, font=f_num)
    draw.text(
        (badge_x0 + (34 * SS - (nb[2] - nb[0])) // 2 - nb[0], badge_y0 + (32 * SS - (nb[3] - nb[1])) // 2 - nb[1]),
        num_s,
        font=f_num,
        fill=(8, 12, 24),
    )

    f_cap_tag = fonts.get("mono", "Bold", 13 * SS)
    tag_txt = f"TAKEAWAY {p_idx + 1} OF 3 · PLAIN WORDS"
    tb_tag = draw.textbbox((0, 0), tag_txt, font=f_cap_tag)
    tx_tag = badge_x0 + 44 * SS - tb_tag[0]
    ty_tag = badge_y0 + (32 * SS - (tb_tag[3] - tb_tag[1])) // 2 - tb_tag[1]
    assert_safe_box(
        tx_tag / SS,
        ty_tag / SS,
        (tx_tag + tb_tag[2] - tb_tag[0]) / SS,
        (ty_tag + tb_tag[3] - tb_tag[1]) / SS,
        "caption_takeaway_tag",
    )
    draw.text((tx_tag, ty_tag), tag_txt, font=f_cap_tag, fill=accent)

    # Large 44px ExtraBold Kinetic Caption Lines (<= 32 chars/line, max 3 lines)
    f_cap = fonts.get("sans", "ExtraBold", 44 * SS)
    lines = card["lines"][:3]
    line_h_cap = 58 * SS
    n_ln = len(lines)
    # Vertically center 1, 2, or 3 lines cleanly inside y: 1200..1396 (196px box)
    avail_h = 194 * SS
    block_h = n_ln * line_h_cap
    cy_start = 1200 * SS + max(4 * SS, (avail_h - block_h) // 2)

    lead_re = re.compile(r"^(First,|Second,|Third,)\s*(.*)$", re.IGNORECASE)
    for li, ln in enumerate(lines):
        ly = cy_start + li * line_h_cap
        lx = (SAFE_X0 + 34) * SS
        tb_full = draw.textbbox((0, 0), ln, font=f_cap)
        assert_safe_box(
            lx / SS,
            (ly) / SS,
            (lx + tb_full[2] - tb_full[0]) / SS,
            (ly + tb_full[3] - tb_full[1]) / SS,
            f"caption_line_{li}",
        )
        m = lead_re.match(ln) if li == 0 else None
        if m:
            lead_w, rest_w = m.group(1), m.group(2)
            tb_lead = draw.textbbox((0, 0), lead_w + " ", font=f_cap)
            draw.text((lx - tb_lead[0], ly - tb_full[1]), lead_w, font=f_cap, fill=accent)
            if rest_w:
                adv = tb_lead[2] - tb_lead[0]
                draw.text((lx + adv - tb_full[0], ly - tb_full[1]), rest_w, font=f_cap, fill=PAL["white"])
        else:
            draw.text((lx - tb_full[0], ly - tb_full[1]), ln, font=f_cap, fill=PAL["white"])

    # -------------------------------------------------------------------------
    # ZONE 5: Honest Energy & Primary Source Pill (y: 1422..1482, x: 56..924)
    # -------------------------------------------------------------------------
    en_y0, en_y1 = 1422 * SS, 1482 * SS
    draw.rounded_rectangle(
        [x0, en_y0, x1, en_y1],
        radius=16 * SS,
        fill=PAL["card"],
        outline=PAL["border"],
        width=2 * SS,
    )
    e_tier = sanitize_glyphs(study["energy_tier"])
    e_up = e_tier.upper()
    e_col = PAL["emerald"] if "BOARD" in e_up else (PAL["cyan"] if "CHIP" in e_up else PAL["amber"])

    dot_cx, dot_cy, dot_r = (SAFE_X0 + 26) * SS, 1452 * SS, 6 * SS
    draw.ellipse([dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r], fill=e_col)

    f_en_left = fonts.get("sans", "Bold", 16 * SS)
    left_txt = f"Energy: {e_tier}"
    tb_el = draw.textbbox((0, 0), left_txt, font=f_en_left)
    el_x = (SAFE_X0 + 40) * SS - tb_el[0]
    el_y = 1452 * SS - (tb_el[3] - tb_el[1]) // 2 - tb_el[1]
    assert_safe_box(
        el_x / SS,
        el_y / SS,
        (el_x + tb_el[2] - tb_el[0]) / SS,
        (el_y + tb_el[3] - tb_el[1]) / SS,
        "energy_pill_left",
    )
    draw.text((el_x, el_y), left_txt, font=f_en_left, fill=PAL["white"])

    f_en_right = fonts.get("mono", "Bold", 13 * SS)
    right_txt = "Full Proof: research.openie.dev · CC0-1.0"
    tb_er = draw.textbbox((0, 0), right_txt, font=f_en_right)
    er_w = tb_er[2] - tb_er[0]
    er_x = (SAFE_X1 - 22) * SS - er_w - tb_er[0]
    er_y = 1452 * SS - (tb_er[3] - tb_er[1]) // 2 - tb_er[1]
    assert_safe_box(
        er_x / SS,
        er_y / SS,
        (er_x + er_w) / SS,
        (er_y + tb_er[3] - tb_er[1]) / SS,
        "energy_pill_right",
    )
    draw.text((er_x, er_y), right_txt, font=f_en_right, fill=PAL["cyan"])

    final_img = bg_ss.resize((OUT_W, OUT_H), Image.Resampling.LANCZOS)
    return np.asarray(final_img, dtype=np.uint8)


def make_progress_gradient_bar(width: int, height: int) -> np.ndarray:
    """Create horizontal Amber -> Cyan -> Emerald gradient bar for the 60fps header progress track."""
    xs = np.linspace(0.0, 1.0, width, dtype=np.float32)
    c0 = np.array(PAL["amber"], dtype=np.float32)
    c1 = np.array(PAL["cyan"], dtype=np.float32)
    c2 = np.array(PAL["emerald"], dtype=np.float32)
    row = np.zeros((width, 3), dtype=np.float32)
    left = xs <= 0.5
    t_l = xs[left] * 2.0
    t_r = (xs[~left] - 0.5) * 2.0
    row[left] = c0 * (1.0 - t_l[:, None]) + c1 * t_l[:, None]
    row[~left] = c1 * (1.0 - t_r[:, None]) + c2 * t_r[:, None]
    bar = np.repeat(row[None, :, :], height, axis=0)
    return np.clip(bar, 0, 255).astype(np.uint8)


def make_feather_mask(w: int, h: int, pad: int = 26) -> np.ndarray:
    """Smooth cosine feather mask so the 3D cutaway blends seamlessly into the stage slate."""
    wx = np.ones(w, dtype=np.float32)
    wy = np.ones(h, dtype=np.float32)
    ramp = 0.5 - 0.5 * np.cos(np.linspace(0.0, math.pi, pad, dtype=np.float32))
    wx[:pad] = ramp
    wx[-pad:] = ramp[::-1]
    wy[:pad] = ramp
    wy[-pad:] = ramp[::-1]
    return (wy[:, None] * wx[None, :])[:, :, None]


def probe_source_video(mp4_path: pathlib.Path) -> tuple[int, int, float, float]:
    cmd = [
        "ffprobe",
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height,r_frame_rate",
        "-show_entries",
        "format=duration",
        "-of",
        "json",
        str(mp4_path),
    ]
    out = json.loads(subprocess.check_output(cmd, text=True))
    st = out["streams"][0]
    w = int(st["width"])
    h = int(st["height"])
    num, den = st["r_frame_rate"].split("/")
    fps = float(num) / max(1.0, float(den))
    dur = float(out["format"]["duration"])
    return w, h, fps, dur


def decode_cropped_3d_frames(mp4_path: pathlib.Path, src_w: int, src_h: int) -> np.ndarray:
    """
    Extract the pure, text-free 3D Blender turntable region from `<id>-15s.mp4`.
    In 1280x720 studio coordinates, `x=888..1226, y=242..538` (`338x296`) sits strictly inside
    the 3D preview card below the '3D MODEL PREVIEW' pill and above `headline_metric`.
    """
    sx = src_w / 1280.0
    sy = src_h / 720.0
    cx = int(round(888 * sx)) // 2 * 2
    cy = int(round(242 * sy)) // 2 * 2
    cw = int(round(338 * sx)) // 2 * 2
    ch = int(round(296 * sy)) // 2 * 2

    cmd = [
        "ffmpeg",
        "-v",
        "error",
        "-i",
        str(mp4_path),
        "-vf",
        f"crop={cw}:{ch}:{cx}:{cy}",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-",
    ]
    raw = subprocess.check_output(cmd)
    frame_bytes = cw * ch * 3
    n_frames = len(raw) // frame_bytes
    if n_frames == 0:
        raise RuntimeError(f"Decoded 0 frames from {mp4_path}")
    arr = np.frombuffer(raw[: n_frames * frame_bytes], dtype=np.uint8).reshape((n_frames, ch, cw, 3))
    return arr


def master_audio_lufs14(src_mp4: pathlib.Path, out_m4a: pathlib.Path, log_path: pathlib.Path) -> None:
    """Two-pass ITU-R BS.1770 loudness normalization to -14.0 LUFS, -1.0 dBTP, LRA 9, 48kHz Stereo AAC 192k."""
    pass1_cmd = [
        "ffmpeg",
        "-hide_banner",
        "-y",
        "-i",
        str(src_mp4),
        "-af",
        "loudnorm=I=-14.0:TP=-1.0:LRA=9.0:print_format=json",
        "-f",
        "null",
        "-",
    ]
    p1 = subprocess.run(pass1_cmd, capture_output=True, text=True, check=True)
    stderr_txt = p1.stderr
    m = re.search(r"\{\s*\"input_i\"[\s\S]*?\}", stderr_txt)
    af_filter = "loudnorm=I=-14.0:TP=-1.0:LRA=9.0"
    if m:
        stats = json.loads(m.group(0))
        af_filter = (
            f"loudnorm=I=-14.0:TP=-1.0:LRA=9.0:"
            f"measured_I={stats['input_i']}:"
            f"measured_TP={stats['input_tp']}:"
            f"measured_LRA={stats['input_lra']}:"
            f"measured_thresh={stats['input_thresh']}:"
            f"offset={stats['target_offset']}:linear=true"
        )

    pass2_cmd = [
        "ffmpeg",
        "-hide_banner",
        "-y",
        "-i",
        str(src_mp4),
        "-vn",
        "-af",
        af_filter,
        "-ar",
        "48000",
        "-ac",
        "2",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        str(out_m4a),
    ]
    with log_path.open("a", encoding="utf-8") as lf:
        subprocess.run(pass2_cmd, stdout=lf, stderr=lf, check=True)


def build_tiktok_caption(study: dict[str, Any]) -> str:
    short_title = sanitize_glyphs(study["short_title"])
    metric = sanitize_glyphs(study["headline_metric"])
    bullets = [sanitize_glyphs(b) for b in study["plain_bullets"]]
    e_tier = sanitize_glyphs(study["energy_tier"])
    e_disc = sanitize_glyphs(study["energy_disclosure"])
    tags = " ".join(CATEGORY_HASHTAGS.get(study["category"], ["#openscience", "#computerscience", "#hardware", "#ai", "#physics"]))

    caption = (
        f"{short_title} - {metric}\n\n"
        f"1) {bullets[0]}\n"
        f"2) {bullets[1]}\n"
        f"3) {bullets[2]}\n\n"
        f"Energy ({e_tier}): {e_disc}\n"
        f"Full open-access proof & interactive lab: research.openie.dev · CC0-1.0\n"
        f"{tags}"
    )
    if len(caption) > 2200:
        caption = caption[:2197] + "..."
    return caption


def build_tiktok_api_v2_payload(study_id: str, caption: str) -> dict[str, Any]:
    return {
        "post_info": {
            "title": caption,
            "privacy_level": "PUBLIC_TO_EVERYONE",
            "disable_duet": False,
            "disable_comment": False,
            "disable_stitch": False,
            "video_cover_timestamp_ms": 1500,
        },
        "source_info": {
            "source": "PULL_FROM_URL",
            "video_url": f"https://research.openie.dev/media/tv/tiktok/{study_id}-tiktok.mp4",
        },
    }


def render_single_study(task: dict[str, Any]) -> dict[str, Any]:
    t_start = time.time()
    study = task["study"]
    sid = study["id"]
    src_mp4 = pathlib.Path(task["src_mp4"])
    fonts_dir = pathlib.Path(task["fonts_dir"]) if task["fonts_dir"] else None
    out_media_dir = pathlib.Path(task["out_media_dir"])
    work_dir = pathlib.Path(task["work_dir"])

    log_path = work_dir / "logs" / f"{sid}.log"
    tmp_m4a = work_dir / "tmp" / f"{sid}-audio.m4a"
    out_mp4 = out_media_dir / f"{sid}-tiktok.mp4"
    out_jpg = out_media_dir / f"{sid}-tiktok.jpg"
    out_vtt = out_media_dir / f"{sid}-tiktok.vtt"

    fonts = FontBank(fonts_dir)
    src_w, src_h, src_fps, src_dur = probe_source_video(src_mp4)
    total_frames = max(int(round(src_dur * FPS)), 1)
    exact_dur = total_frames / float(FPS)

    # 1. Build mobile-legible kinetic caption cards + WebVTT
    t15 = study["tiers"]["15s"]
    cards, point_starts = build_tiktok_cue_cards(t15["cues"], exact_dur, fonts)
    write_vtt(cards, out_vtt)

    # 2. Master -14 LUFS stereo 48kHz AAC 192k audio
    master_audio_lufs14(src_mp4, tmp_m4a, log_path)

    # 3. Pre-render 2x-supersampled cue canvases (5-8 states per study)
    base_bg = make_base_background()
    cue_canvases = [render_cue_canvas(base_bg, study, c, point_starts, exact_dur, fonts) for c in cards]

    # 4. Decode cropped 3D turntable frames from `<id>-15s.mp4`
    turntable_frames = decode_cropped_3d_frames(src_mp4, src_w, src_h)
    n_src = turntable_frames.shape[0]

    # Pre-upscale & sharpen each unique 3D source frame once to stage viewport size (584x512)
    # (~650 frames * 584x512 -> <0.4s total, making 60fps Ken-Burns + frame blending ultra-fast!)
    stage_w, stage_h = 584, 512
    stage_x0 = SAFE_X0 + (SAFE_W - stage_w) // 2  # 56 + 142 = 198..782
    stage_y0 = 534  # 534..1046 inside stage y: 468..1116
    feather = make_feather_mask(stage_w, stage_h, pad=28)
    stage_slate = np.array(PAL["stage_bg"], dtype=np.float32)

    upscaled_3d = np.empty((n_src, stage_h, stage_w, 3), dtype=np.uint8)
    # Apply subtle 1.00x -> 1.04x Ken-Burns zoom across the source sequence during pre-scaling
    src_h_3d, src_w_3d = turntable_frames.shape[1], turntable_frames.shape[2]
    for i in range(n_src):
        u_kb = i / max(1, n_src - 1)
        zoom = 1.0 + 0.04 * u_kb
        zw = int(round(stage_w * zoom))
        zh = int(round(stage_h * zoom))
        im_p = Image.fromarray(turntable_frames[i], mode="RGB").resize((zw, zh), Image.Resampling.LANCZOS)
        im_p = im_p.filter(ImageFilter.UnsharpMask(radius=1.2, percent=65, threshold=2))
        ox = (zw - stage_w) // 2
        oy = (zh - stage_h) // 2
        patch = np.asarray(im_p.crop((ox, oy, ox + stage_w, oy + stage_h)), dtype=np.float32)
        blended = patch * feather + stage_slate * (1.0 - feather)
        upscaled_3d[i] = np.clip(blended, 0, 255).astype(np.uint8)

    prog_bar = make_progress_gradient_bar(SAFE_W - 4, 6)  # 864x6 inside track y: 218..224

    # 5. Stream 60fps frames into FFmpeg libx264 encoder
    enc_cmd = [
        "ffmpeg",
        "-hide_banner",
        "-y",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{OUT_W}x{OUT_H}",
        "-r",
        str(FPS),
        "-i",
        "-",
        "-i",
        str(tmp_m4a),
        "-map",
        "0:v:0",
        "-map",
        "1:a:0",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "-r",
        str(FPS),
        "-c:a",
        "copy",
        "-shortest",
        "-movflags",
        "+faststart",
        "-threads",
        str(task["ffmpeg_threads"]),
        str(out_mp4),
    ]

    cover_frame_idx = min(total_frames - 1, int(round(1.5 * FPS)))
    cover_saved = False

    with log_path.open("a", encoding="utf-8") as lf:
        proc = subprocess.Popen(enc_cmd, stdin=subprocess.PIPE, stdout=lf, stderr=lf)
        assert proc.stdin is not None
        cue_ptr = 0
        n_cues = len(cards)
        try:
            for f_idx in range(total_frames):
                t_sec = f_idx / float(FPS)
                while cue_ptr < n_cues - 1 and t_sec >= cards[cue_ptr]["disp_end"]:
                    cue_ptr += 1

                frame = cue_canvases[cue_ptr].copy()

                # Smooth 8-frame (0.13s) caption crossfade on cue transitions (after cue 0)
                if cue_ptr > 0:
                    dt_in = t_sec - cards[cue_ptr]["disp_start"]
                    if 0.0 <= dt_in < 0.135:
                        alpha = dt_in / 0.135
                        alpha = 1.0 - (1.0 - alpha) ** 3
                        prev_cap = cue_canvases[cue_ptr - 1][1136:1412, SAFE_X0 : SAFE_X1 + 1].astype(np.float32)
                        cur_cap = frame[1136:1412, SAFE_X0 : SAFE_X1 + 1].astype(np.float32)
                        frame[1136:1412, SAFE_X0 : SAFE_X1 + 1] = np.clip(
                            prev_cap * (1.0 - alpha) + cur_cap * alpha, 0, 255
                        ).astype(np.uint8)

                # Composite 60fps interpolated 3D turntable stage
                src_pos = min(n_src - 1.0001, max(0.0, t_sec * src_fps))
                i0 = int(src_pos)
                i1 = min(n_src - 1, i0 + 1)
                frac = src_pos - i0
                if frac < 0.02 or i0 == i1:
                    patch_3d = upscaled_3d[i0]
                else:
                    patch_3d = (
                        upscaled_3d[i0].astype(np.float32) * (1.0 - frac)
                        + upscaled_3d[i1].astype(np.float32) * frac
                    ).astype(np.uint8)
                frame[stage_y0 : stage_y0 + stage_h, stage_x0 : stage_x0 + stage_w] = patch_3d

                # Composite 60fps animated progress bar (y: 218..224, x: 58..922)
                prog_w = max(6, min(SAFE_W - 4, int(round((SAFE_W - 4) * (f_idx / max(1, total_frames - 1))))))
                frame[218:224, SAFE_X0 + 2 : SAFE_X0 + 2 + prog_w] = prog_bar[:, :prog_w]

                if f_idx == cover_frame_idx and not cover_saved:
                    Image.fromarray(frame, mode="RGB").save(out_jpg, "JPEG", quality=90, optimize=True)
                    cover_saved = True

                proc.stdin.write(frame.tobytes())
        finally:
            proc.stdin.close()
            rc = proc.wait()
            if rc != 0:
                raise RuntimeError(f"FFmpeg encode failed for {sid} (exit {rc}); inspect {log_path}")

    if not cover_saved:
        Image.fromarray(cue_canvases[0], mode="RGB").save(out_jpg, "JPEG", quality=90, optimize=True)

    # 6. Probe output MP4 & compute SHA-256 + BLAKE3 digests
    out_w, out_h, out_fps, out_dur = probe_source_video(out_mp4)
    mp4_bytes = out_mp4.read_bytes()
    sha256_hex = hashlib.sha256(mp4_bytes).hexdigest()
    blake3_hex = blake3.blake3(mp4_bytes).hexdigest()

    caption = build_tiktok_caption(study)
    api_payload = build_tiktok_api_v2_payload(sid, caption)
    elapsed = time.time() - t_start

    item = {
        "id": sid,
        "short_title": study["short_title"],
        "title": study["title"],
        "category": study["category"],
        "paper_url": study["paper_url"],
        "narrator_name": study["narrator_name"],
        "video_url": f"/media/tv/tiktok/{sid}-tiktok.mp4",
        "poster_url": f"/media/tv/tiktok/{sid}-tiktok.jpg",
        "vtt_url": f"/media/tv/tiktok/{sid}-tiktok.vtt",
        "duration_s": round(out_dur, 2),
        "bytes": len(mp4_bytes),
        "sha256": sha256_hex,
        "blake3": blake3_hex,
        "hook_headline": f"{study['short_title']} · {study['headline_metric']}",
        "headline_metric": study["headline_metric"],
        "plain_bullets": study["plain_bullets"],
        "energy_tier": study["energy_tier"],
        "energy_disclosure": study["energy_disclosure"],
        "tiktok_caption": caption,
        "tiktok_api_v2_init_payload": api_payload,
    }
    return {
        "item": item,
        "elapsed_s": round(elapsed, 2),
        "probed": (out_w, out_h, round(out_fps, 2), round(out_dur, 2)),
        "cue_cards": len(cards),
    }


def parse_args() -> argparse.Namespace:
    default_root = os.environ.get("OPENIE_REPO_ROOT", ".")
    p = argparse.ArgumentParser(description="Render 28 OpenIE Research TV 9:16 TikTok snackable films.")
    p.add_argument("--repo-root", default=default_root, help="Repository root directory.")
    p.add_argument("--catalog", default=None, help="Path to tv-catalog.json.")
    p.add_argument("--films-dir", default=None, help="Directory containing <id>-15s.mp4 inputs.")
    p.add_argument("--fonts-dir", default=None, help="Directory containing WOFF2 studio web fonts.")
    p.add_argument("--out-media-dir", default=None, help="Output directory for <id>-tiktok.{mp4,jpg,vtt}.")
    p.add_argument("--out-manifest", default=None, help="Output path for tiktok-snackables.json.")
    p.add_argument("--work-dir", default=os.environ.get("OPENIE_TIKTOK_WORKDIR", "/tmp/openie_tiktok_work"), help="Scratch directory for logs and audio temp files.")
    p.add_argument("--workers", type=int, default=max(1, min(8, (os.cpu_count() or 4) // 4)), help="Parallel study workers.")
    p.add_argument("--ffmpeg-threads", type=int, default=4, help="Threads per FFmpeg encoder.")
    p.add_argument("--only", default="", help="Comma-separated subset of study IDs for quick verification.")
    return p.parse_args()


def main() -> int:
    args = parse_args()
    root = pathlib.Path(args.repo_root).resolve()
    catalog_path = pathlib.Path(args.catalog) if args.catalog else root / "src/data/tv-catalog.json"
    films_dir = pathlib.Path(args.films_dir) if args.films_dir else root / "public/media/tv/films"
    fonts_dir = pathlib.Path(args.fonts_dir) if args.fonts_dir else root / "public/fonts"
    out_media_dir = pathlib.Path(args.out_media_dir) if args.out_media_dir else root / "public/media/tv/tiktok"
    out_manifest = pathlib.Path(args.out_manifest) if args.out_manifest else root / "src/data/tiktok-snackables.json"
    work_dir = pathlib.Path(args.work_dir)

    out_media_dir.mkdir(parents=True, exist_ok=True)
    out_manifest.parent.mkdir(parents=True, exist_ok=True)
    (work_dir / "logs").mkdir(parents=True, exist_ok=True)
    (work_dir / "tmp").mkdir(parents=True, exist_ok=True)

    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    studies = catalog["studies"]
    only_set = {s.strip() for s in args.only.split(",") if s.strip()}
    if only_set:
        studies = [s for s in studies if s["id"] in only_set]
        if not studies:
            raise SystemExit(f"No studies matched --only={args.only}")

    print(f"[tiktok-studio] Rendering {len(studies)} study film(s) at {OUT_W}x{OUT_H}@{FPS}fps (workers={args.workers})")
    t_batch = time.time()

    tasks = []
    for s in studies:
        sid = s["id"]
        src_mp4 = films_dir / f"{sid}-15s.mp4"
        if not src_mp4.is_file():
            raise FileNotFoundError(f"Missing 15s film input: {src_mp4}")
        tasks.append(
            {
                "study": s,
                "src_mp4": str(src_mp4),
                "fonts_dir": str(fonts_dir) if fonts_dir.is_dir() else "",
                "out_media_dir": str(out_media_dir),
                "work_dir": str(work_dir),
                "ffmpeg_threads": args.ffmpeg_threads,
            }
        )

    results_by_id: dict[str, dict[str, Any]] = {}
    with cf.ProcessPoolExecutor(max_workers=args.workers) as pool:
        fut_map = {pool.submit(render_single_study, t): t["study"]["id"] for t in tasks}
        done_cnt = 0
        for fut in cf.as_completed(fut_map):
            sid = fut_map[fut]
            res = fut.result()
            results_by_id[sid] = res
            done_cnt += 1
            it = res["item"]
            mb = it["bytes"] / (1024 * 1024)
            print(
                f"  [{done_cnt:02d}/{len(tasks):02d}] {sid:24s} | "
                f"{it['duration_s']:5.2f}s | {mb:4.2f} MB | cards={res['cue_cards']} | {res['elapsed_s']:4.1f}s"
            )

    ordered_items = [results_by_id[s["id"]]["item"] for s in studies]
    total_bytes = sum(it["bytes"] for it in ordered_items)
    manifest = {
        "version": "1.0.0",
        "title": "OpenIE Research TV — 9:16 Snackable Vertical Editions",
        "study_count": len(ordered_items),
        "resolution": f"{OUT_W}x{OUT_H}",
        "aspect_ratio": "9:16",
        "fps": FPS,
        "loudness_lufs": -14.0,
        "safe_zone_box": {
            "x_min": SAFE_X0,
            "x_max": SAFE_X1,
            "y_min": SAFE_Y0,
            "y_max": SAFE_Y1,
        },
        "total_bytes": total_bytes,
        "total_mb": round(total_bytes / (1024 * 1024), 2),
        "studies": ordered_items,
    }
    out_manifest.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    dt_all = time.time() - t_batch
    print(
        f"[tiktok-studio] Done in {dt_all:.1f}s | count={len(ordered_items)} | "
        f"total={manifest['total_mb']:.2f} MB | manifest={out_manifest.name}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
