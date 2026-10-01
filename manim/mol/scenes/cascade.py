"""mol-diag-01 — Cascade Lookup → Formula → Solver → Model LAST.

Honesty: illustrative navigation law only. No measured_j / board watts.
"""
from manim import *


class CascadeLast(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("mol-diag-01 · Cascade", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        honesty = Text(
            "illustrative · board_synth_claimed=false · no fake meters",
            font_size=16,
            color="#64748b",
        )
        honesty.to_edge(DOWN, buff=0.28)

        tiers = [
            ("Lookup", "#34d399", "table / LUT hit"),
            ("Formula", "#60a5fa", "closed form / SINDy-class"),
            ("Solver", "#a78bfa", "settle when physics needs it"),
            ("Model LAST", "#f472b6", "open generator only if needed"),
        ]
        boxes = VGroup()
        for name, color, sub in tiers:
            card = RoundedRectangle(
                corner_radius=0.15,
                width=2.55,
                height=1.35,
                stroke_color=color,
                stroke_width=3,
                fill_color="#111827",
                fill_opacity=0.95,
            )
            label = Text(name, font_size=26, color=color, weight=BOLD)
            hint = Text(sub, font_size=14, color="#94a3b8")
            g = VGroup(card, label, hint)
            label.move_to(card.get_center() + UP * 0.22)
            hint.move_to(card.get_center() + DOWN * 0.32)
            boxes.add(g)
        boxes.arrange(RIGHT, buff=0.28).shift(UP * 0.15)

        arrows = VGroup()
        for i in range(len(boxes) - 1):
            a = Arrow(
                boxes[i].get_right() + RIGHT * 0.02,
                boxes[i + 1].get_left() + LEFT * 0.02,
                buff=0.05,
                stroke_width=3,
                color="#475569",
                max_tip_length_to_length_ratio=0.25,
            )
            arrows.add(a)

        rule = Text(
            "Grammar covered  ⇒  do not open the Model",
            font_size=22,
            color="#fbbf24",
        )
        rule.next_to(boxes, DOWN, buff=0.55)

        self.play(FadeIn(title), FadeIn(honesty))
        for i, box in enumerate(boxes):
            self.play(FadeIn(box, shift=RIGHT * 0.2), run_time=0.45)
            if i < len(arrows):
                self.play(GrowArrow(arrows[i]), run_time=0.25)
        self.play(Write(rule))
        # Emphasize Model LAST as last resort
        self.play(
            boxes[-1][0].animate.set_stroke(width=6, color="#fb7185"),
            Flash(boxes[-1], color="#fb7185", flash_radius=0.9),
            run_time=0.8,
        )
        self.wait(1.2)
