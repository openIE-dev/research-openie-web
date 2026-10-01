"""ni-diag-02 — Commit stack + compose predicates (LUT ∧ energy ∧ CBF).

Sense → propose → certify → commit | refuse.
Proposal never self-commits. No board watts.
"""
from manim import *


class CommitStackCompose(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("ni-diag-02  Commit stack", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        footer = Text(
            "Compose predicates only  ·  measured_j=None  ·  board_synth_claimed=false",
            font_size=15,
            color="#64748b",
        )
        footer.to_edge(DOWN, buff=0.28)

        steps = [
            ("sense", "#94a3b8", "plant / tool request"),
            ("propose", "#60a5fa", "u from TLMM / agent"),
            ("certify", "#a78bfa", "LUT ∧ energy [∧ CBF]"),
            ("commit | refuse", "#34d399", "gate owns the branch"),
        ]
        boxes = VGroup()
        for name, color, sub in steps:
            card = RoundedRectangle(
                corner_radius=0.12,
                width=2.7,
                height=1.25,
                stroke_color=color,
                stroke_width=3,
                fill_color="#111827",
                fill_opacity=0.95,
            )
            label = Text(name, font_size=22, color=color, weight=BOLD)
            hint = Text(sub, font_size=13, color="#94a3b8")
            label.move_to(card.get_center() + UP * 0.2)
            hint.move_to(card.get_center() + DOWN * 0.28)
            boxes.add(VGroup(card, label, hint))
        boxes.arrange(RIGHT, buff=0.22).shift(UP * 0.55)

        arrows = VGroup(
            *[
                Arrow(
                    boxes[i].get_right(),
                    boxes[i + 1].get_left(),
                    buff=0.05,
                    stroke_width=3,
                    color="#475569",
                    max_tip_length_to_length_ratio=0.25,
                )
                for i in range(len(boxes) - 1)
            ]
        )

        preds = VGroup(
            Text("lut_and_energy          lut_allow ∧ energy_ok", font_size=18, color="#e2e8f0"),
            Text("lut_and_safe            same, Safe-PH residual", font_size=18, color="#e2e8f0"),
            Text("lut_and_safe_and_cbf    + cbf_ok  (MCP default)", font_size=18, color="#fbbf24"),
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.12)
        preds.next_to(boxes, DOWN, buff=0.4)

        teach = Text(
            "A proposal never commits itself. Refuse is a typed success with a receipt.",
            font_size=17,
            color="#fde68a",
        )
        teach.next_to(preds, DOWN, buff=0.35)

        self.play(FadeIn(title), FadeIn(footer))
        for i, box in enumerate(boxes):
            self.play(FadeIn(box, shift=RIGHT * 0.12), run_time=0.35)
            if i < len(arrows):
                self.play(GrowArrow(arrows[i]), run_time=0.2)
        self.play(LaggedStart(*[FadeIn(p, shift=RIGHT * 0.1) for p in preds], lag_ratio=0.15))
        self.play(Write(teach))
        self.wait(1.2)
