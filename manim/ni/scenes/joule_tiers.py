"""ni-inf-02 — Joule tiers A / B / C. Tier C (DUT) is not claimed.

OpCounter × analytical E_* is Tier A surrogate arithmetic.
Never draw board watts as measured. board_synth_claimed=false.
"""
from manim import *


class JouleTierLadder(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("ni-inf-02  Joule tiers", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        footer = Text(
            "board_synth_claimed=false  ·  Tier C locked until a DUT meter exists",
            font_size=15,
            color="#64748b",
        )
        footer.to_edge(DOWN, buff=0.28)

        tiers = [
            ("A", "[SURROGATE]", "OpCounter × analytical E_*", "catalog math, not package joules", "#60a5fa"),
            ("B", "tool estimate", "post-synth / post-P&R report", "tool number, still not DUT", "#a78bfa"),
            ("C", "[DUT] locked", "board meter under a named load", "not claimed on this page", "#fb7185"),
        ]
        cards = VGroup()
        for letter, badge, main, sub, color in tiers:
            card = RoundedRectangle(
                corner_radius=0.14,
                width=11.5,
                height=1.05,
                stroke_color=color,
                stroke_width=3,
                fill_color="#111827",
                fill_opacity=0.95,
            )
            L = Text(f"Tier {letter}", font_size=26, color=color, weight=BOLD)
            B = Text(badge, font_size=18, color="#94a3b8")
            M = Text(main, font_size=20, color="#e2e8f0")
            S = Text(sub, font_size=15, color="#64748b")
            L.move_to(card.get_left() + RIGHT * 1.15)
            B.next_to(L, RIGHT, buff=0.35)
            M.move_to(card.get_center() + RIGHT * 1.6 + UP * 0.15)
            S.move_to(card.get_center() + RIGHT * 1.6 + DOWN * 0.28)
            cards.add(VGroup(card, L, B, M, S))
        cards.arrange(DOWN, buff=0.22).shift(UP * 0.15)

        lock = Text(
            "Say 'surrogate joules' for A. Say nothing about board watts until C is metered.",
            font_size=17,
            color="#fde68a",
        )
        lock.next_to(cards, DOWN, buff=0.35)

        self.play(FadeIn(title), FadeIn(footer))
        for c in cards:
            self.play(FadeIn(c, shift=UP * 0.1), run_time=0.4)
        self.play(
            cards[-1][0].animate.set_stroke(width=5),
            Write(lock),
        )
        self.wait(1.2)
