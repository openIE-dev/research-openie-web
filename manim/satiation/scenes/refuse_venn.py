"""sat-diag-01 — Refuse = economic done union physical unsafe.

Design claim. Two refuse branches share one CommitDecision hold.
No board watts. measured_j=None.
"""
from manim import *


class RefuseDoneUnsafe(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("sat-diag-01  Two reasons to refuse", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        footer = Text(
            "design claim  ·  measured_j=None  ·  board_synth_claimed=false",
            font_size=15,
            color="#64748b",
        )
        footer.to_edge(DOWN, buff=0.28)

        done = Circle(
            radius=1.55,
            stroke_color="#34d399",
            stroke_width=4,
            fill_color="#064e3b",
            fill_opacity=0.45,
        )
        unsafe = Circle(
            radius=1.55,
            stroke_color="#fb7185",
            stroke_width=4,
            fill_color="#7f1d1d",
            fill_opacity=0.45,
        )
        done.shift(LEFT * 1.35 + UP * 0.35)
        unsafe.shift(RIGHT * 1.35 + UP * 0.35)

        done_lab = Text("Economic done", font_size=22, color="#6ee7b7", weight=BOLD)
        done_sub = Text("policy / budget", font_size=15, color="#94a3b8")
        done_lab.move_to(done.get_center() + LEFT * 0.55 + UP * 0.35)
        done_sub.next_to(done_lab, DOWN, buff=0.12)

        unsafe_lab = Text("Physical unsafe", font_size=22, color="#fda4af", weight=BOLD)
        unsafe_sub = Text("LUT / energy / CBF", font_size=15, color="#94a3b8")
        unsafe_lab.move_to(unsafe.get_center() + RIGHT * 0.55 + UP * 0.35)
        unsafe_sub.next_to(unsafe_lab, DOWN, buff=0.12)

        union = Text(
            "Refuse = done  union  unsafe",
            font_size=22,
            color="#fbbf24",
            weight=BOLD,
        )
        union_sub = Text(
            "One hold. No executor call. Receipt still issued.",
            font_size=17,
            color="#e2e8f0",
        )
        union_group = VGroup(union, union_sub).arrange(DOWN, buff=0.15)
        union_group.next_to(VGroup(done, unsafe), DOWN, buff=0.55)

        teach = Text(
            "Refuse is a typed success. Done and unsafe are different reason codes.",
            font_size=17,
            color="#fde68a",
        )
        teach.next_to(union_group, DOWN, buff=0.3)

        self.play(FadeIn(title), FadeIn(footer))
        self.play(FadeIn(done), FadeIn(done_lab), FadeIn(done_sub))
        self.play(FadeIn(unsafe), FadeIn(unsafe_lab), FadeIn(unsafe_sub))
        self.play(Write(union), FadeIn(union_sub))
        self.play(Write(teach))
        self.wait(1.2)
