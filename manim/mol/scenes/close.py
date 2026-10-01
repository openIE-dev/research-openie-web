"""mol-diag-03 — propose → certify → commit|refuse → receipt."""
from manim import *


class CloseReceipt(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("mol-diag-03 · Close / receipt", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        honesty = Text(
            "refuse = lawful success + receipt · measured_j only if Metered",
            font_size=16,
            color="#64748b",
        )
        honesty.to_edge(DOWN, buff=0.28)

        steps = [
            ("propose", "#60a5fa"),
            ("certify", "#a78bfa"),
            ("commit | refuse", "#34d399"),
            ("receipt", "#fbbf24"),
        ]
        boxes = VGroup()
        for name, color in steps:
            r = RoundedRectangle(0.12, 2.8, 0.85, stroke_color=color, stroke_width=3, fill_color="#111827", fill_opacity=1)
            t = Text(name, font_size=22, color=color)
            boxes.add(VGroup(r, t.move_to(r)))
        boxes.arrange(RIGHT, buff=0.32).shift(UP * 0.25)
        arrows = VGroup(*[
            Arrow(boxes[i].get_right(), boxes[i + 1].get_left(), buff=0.06, stroke_width=3, color="#475569")
            for i in range(len(boxes) - 1)
        ])
        ban = Text("ModelGenerated ↛ Deterministic", font_size=20, color="#fb7185")
        ban.next_to(boxes, DOWN, buff=0.55)

        self.play(FadeIn(title), FadeIn(honesty))
        for i, b in enumerate(boxes):
            self.play(FadeIn(b), run_time=0.35)
            if i < len(arrows):
                self.play(GrowArrow(arrows[i]), run_time=0.2)
        self.play(Write(ban))
        self.wait(1.2)
