"""mol-tab-01 — MoL ≠ MoE contrast."""
from manim import *


class MolNotMoe(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("mol-tab-01 · MoL ≠ MoE", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        honesty = Text(
            "estimated_j labeled · measured_j=None soft-ref · board_synth_claimed=false",
            font_size=15,
            color="#64748b",
        )
        honesty.to_edge(DOWN, buff=0.28)

        left = RoundedRectangle(
            corner_radius=0.15,
            width=5.2,
            height=3.4,
            stroke_color="#fb7185",
            stroke_width=3,
            fill_color="#111827",
            fill_opacity=1,
        )
        right = RoundedRectangle(
            corner_radius=0.15,
            width=5.2,
            height=3.4,
            stroke_color="#34d399",
            stroke_width=3,
            fill_color="#111827",
            fill_opacity=1,
        )
        cols = VGroup(left, right).arrange(RIGHT, buff=0.45).shift(DOWN * 0.05)
        lh = Text("MoE / model↔model", font_size=22, color="#fb7185", weight=BOLD)
        rh = Text("MoL", font_size=22, color="#34d399", weight=BOLD)
        lh.next_to(left.get_top(), DOWN, buff=0.2)
        rh.next_to(right.get_top(), DOWN, buff=0.2)
        lb = Text(
            "Mixture INSIDE\nthe generator\n\nRoute which model\nanswers\n\nEscalate → larger",
            font_size=18,
            color="#e2e8f0",
            line_spacing=0.9,
        )
        rb = Text(
            "Mixture OUTSIDE\ngeneration\n\nRoute which TIER\ncloses\n\nRefuse is first-class",
            font_size=18,
            color="#e2e8f0",
            line_spacing=0.9,
        )
        lb.move_to(left.get_center() + DOWN * 0.15)
        rb.move_to(right.get_center() + DOWN * 0.15)

        self.play(FadeIn(title), FadeIn(honesty))
        self.play(FadeIn(cols), FadeIn(lh), FadeIn(rh))
        self.play(FadeIn(lb), FadeIn(rb))
        self.wait(1.4)
