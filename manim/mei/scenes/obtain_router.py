"""mei-diag-02 — J(m|q) obtain router.

Math + ledger teaching figure. Ledger Wh/answer bands are estimates.
Not board measured_j. board_synth_claimed=false.
"""
from manim import *


class ObtainRouterJmQ(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("mei-diag-02 · Obtain router J(m|q)", font_size=26, color="#93c5fd")
        title.to_edge(UP, buff=0.32)
        honesty = Text(
            "calculation + looked-up · Estimated · not board measured_j",
            font_size=15,
            color="#64748b",
        )
        honesty.to_edge(DOWN, buff=0.28)

        zones = [
            ("Lookup", "#34d399"),
            ("Formula", "#60a5fa"),
            ("Solver", "#a78bfa"),
            ("Model LAST", "#f472b6"),
            ("Guess", "#fb7185"),
        ]
        boxes = VGroup()
        for name, color in zones:
            card = RoundedRectangle(
                corner_radius=0.12,
                width=2.15,
                height=1.05,
                stroke_color=color,
                stroke_width=3,
                fill_color="#111827",
                fill_opacity=0.95,
            )
            label = Text(name, font_size=20, color=color, weight=BOLD)
            label.move_to(card.get_center())
            boxes.add(VGroup(card, label))
        boxes.arrange(RIGHT, buff=0.18).shift(UP * 0.55)

        arrows = VGroup()
        for i in range(len(boxes) - 1):
            a = Arrow(
                boxes[i].get_right() + RIGHT * 0.02,
                boxes[i + 1].get_left() + LEFT * 0.02,
                buff=0.04,
                stroke_width=3,
                color="#475569",
                max_tip_length_to_length_ratio=0.28,
            )
            arrows.add(a)

        formula = Text(
            "m* = argmin  J(m|q) = E_m + λ · ½ · S_q² · var_m(t)",
            font_size=20,
            color="#e2e8f0",
        )
        formula.next_to(boxes, DOWN, buff=0.55)

        rule = Text(
            "Price the obtain zone. Open Model last. Stop when VoI is spent.",
            font_size=18,
            color="#fbbf24",
        )
        rule.next_to(formula, DOWN, buff=0.35)

        self.play(FadeIn(title), FadeIn(honesty))
        for i, box in enumerate(boxes):
            self.play(FadeIn(box, shift=RIGHT * 0.12), run_time=0.35)
            if i < len(arrows):
                self.play(GrowArrow(arrows[i]), run_time=0.2)
        self.play(Write(formula))
        self.play(Write(rule))
        self.play(
            boxes[-2][0].animate.set_stroke(width=6, color="#fb7185"),
            run_time=0.6,
        )
        self.wait(1.1)
