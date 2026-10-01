"""sat-inf-01 — Engagement KPI vs economic-done lenses.

Two lenses on the same loop. Engagement can rise after completeness.
Illustrative only. No meters. No Epoch curve points.
"""
from manim import *


class EngagementVsDone(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("sat-inf-01  Two lenses on one loop", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        footer = Text(
            "illustrative  ·  board_synth_claimed=false  ·  no invented joules",
            font_size=15,
            color="#64748b",
        )
        footer.to_edge(DOWN, buff=0.28)

        left = RoundedRectangle(
            corner_radius=0.14,
            width=5.4,
            height=3.4,
            stroke_color="#fb7185",
            stroke_width=3,
            fill_color="#111827",
            fill_opacity=0.95,
        )
        right = RoundedRectangle(
            corner_radius=0.14,
            width=5.4,
            height=3.4,
            stroke_color="#34d399",
            stroke_width=3,
            fill_color="#111827",
            fill_opacity=0.95,
        )
        panels = VGroup(left, right).arrange(RIGHT, buff=0.35).shift(UP * 0.25)

        left_h = Text("Engagement KPI", font_size=24, color="#fb7185", weight=BOLD)
        left_h.next_to(left.get_top(), DOWN, buff=0.25)
        left_lines = VGroup(
            Text("time on task", font_size=18, color="#e2e8f0"),
            Text("tokens and seats", font_size=18, color="#e2e8f0"),
            Text("can rise after done", font_size=18, color="#fca5a5"),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.18)
        left_lines.next_to(left_h, DOWN, buff=0.35)

        right_h = Text("Economic done", font_size=24, color="#34d399", weight=BOLD)
        right_h.next_to(right.get_top(), DOWN, buff=0.25)
        right_lines = VGroup(
            Text("written completeness C", font_size=18, color="#e2e8f0"),
            Text("extra synthesis does not raise C", font_size=18, color="#e2e8f0"),
            Text("stop is a typed refuse", font_size=18, color="#6ee7b7"),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.18)
        right_lines.next_to(right_h, DOWN, buff=0.35)

        teach = Text(
            "Engagement is not completeness. Design the stop to the predicate you wrote.",
            font_size=17,
            color="#fde68a",
        )
        teach.next_to(panels, DOWN, buff=0.35)

        self.play(FadeIn(title), FadeIn(footer))
        self.play(FadeIn(left), FadeIn(left_h), LaggedStart(*[FadeIn(t) for t in left_lines], lag_ratio=0.12))
        self.play(FadeIn(right), FadeIn(right_h), LaggedStart(*[FadeIn(t) for t in right_lines], lag_ratio=0.12))
        self.play(Write(teach))
        self.wait(1.2)
