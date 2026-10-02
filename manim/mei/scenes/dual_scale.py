"""mei-diag-01 — Dual-scale budget in → best answer out.

Teaching diagram only. No measured_j / board watts.
board_synth_claimed=false. Water/power plants not required by design
is a design consequence, not liters saved.
"""
from manim import *


class DualScaleBudget(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("mei-diag-01 · Dual scale", font_size=28, color="#5eead4")
        title.to_edge(UP, buff=0.35)
        honesty = Text(
            "teaching diagram · board_synth_claimed=false · no board meters",
            font_size=15,
            color="#64748b",
        )
        honesty.to_edge(DOWN, buff=0.28)

        def scale_card(heading, budget, actuators, plant, color):
            card = RoundedRectangle(
                corner_radius=0.15,
                width=4.4,
                height=2.6,
                stroke_color=color,
                stroke_width=3,
                fill_color="#111827",
                fill_opacity=0.95,
            )
            h = Text(heading, font_size=24, color=color, weight=BOLD)
            b = Text(budget, font_size=18, color="#e2e8f0")
            a = Text(actuators, font_size=15, color="#94a3b8")
            p = Text(plant, font_size=15, color="#fbbf24")
            g = VGroup(h, b, a, p).arrange(DOWN, buff=0.18)
            g.move_to(card.get_center())
            return VGroup(card, g)

        edge = scale_card(
            "EDGE / TAG",
            "Budget B ≈ µW",
            "heater · sleep · enzyme",
            "coin-cell plant",
            "#34d399",
        )
        lean = scale_card(
            "LEAN CENTRAL",
            "Budget B = MW cap",
            "pause · speed · route",
            "grid-following",
            "#60a5fa",
        )
        center = RoundedRectangle(
            corner_radius=0.15,
            width=3.2,
            height=1.5,
            stroke_color="#5eead4",
            stroke_width=3,
            fill_color="#0f172a",
            fill_opacity=0.98,
        )
        c1 = Text("BUDGET IN", font_size=22, color="#5eead4", weight=BOLD)
        c2 = Text("best answer under B", font_size=16, color="#e2e8f0")
        cg = VGroup(c1, c2).arrange(DOWN, buff=0.15)
        cg.move_to(center.get_center())
        mid = VGroup(center, cg)

        row = VGroup(edge, mid, lean).arrange(RIGHT, buff=0.35).shift(UP * 0.2)

        takeaway = Text(
            "Edge + resource-optimized central. Not uncapped hyperscale.",
            font_size=18,
            color="#fde68a",
        )
        takeaway.next_to(row, DOWN, buff=0.45)

        self.play(FadeIn(title), FadeIn(honesty))
        self.play(FadeIn(edge, shift=RIGHT * 0.15), run_time=0.5)
        self.play(FadeIn(mid, shift=UP * 0.1), run_time=0.45)
        self.play(FadeIn(lean, shift=LEFT * 0.15), run_time=0.5)
        self.play(Write(takeaway))
        self.wait(1.2)
