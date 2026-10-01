"""mol-inf-01 — Kepler → Newton → Shannon → Landauer lineage.

Honesty: Landauer shown as labeled thermodynamic lower-bound ESTIMATE.
board_synth_claimed=false. No measured_j / board watts.
"""
from manim import *


class LineageCompress(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("mol-inf-01 · Compression lineage", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        honesty = Text(
            "Landauer = labeled estimate · board_synth_claimed=false",
            font_size=16,
            color="#64748b",
        )
        honesty.to_edge(DOWN, buff=0.28)

        nodes = [
            ("Brahe", "enumerate", "#94a3b8"),
            ("Kepler", "compress", "#34d399"),
            ("Newton", "closed form", "#60a5fa"),
            ("Shannon", "price bits", "#a78bfa"),
            ("Landauer", "erasure est.", "#fbbf24"),
            ("MoL", "CI floors", "#f472b6"),
        ]
        group = VGroup()
        for name, verb, color in nodes:
            circ = Circle(radius=0.55, stroke_color=color, stroke_width=3, fill_color="#111827", fill_opacity=1)
            n = Text(name, font_size=20, color=color, weight=BOLD)
            v = Text(verb, font_size=13, color="#94a3b8")
            n.move_to(circ.get_center() + UP * 0.12)
            v.next_to(circ, DOWN, buff=0.12)
            group.add(VGroup(circ, n, v))
        group.arrange(RIGHT, buff=0.35).shift(UP * 0.35)

        links = VGroup()
        for i in range(len(group) - 1):
            links.add(
                Arrow(
                    group[i][0].get_right(),
                    group[i + 1][0].get_left(),
                    buff=0.08,
                    stroke_width=2.5,
                    color="#334155",
                    max_tip_length_to_length_ratio=0.2,
                )
            )

        landauer_note = Text(
            "Landauer: irreversible bit erasure — thermodynamic lower-bound ESTIMATE (not board watts)",
            font_size=16,
            color="#fde68a",
        )
        landauer_note.next_to(group, DOWN, buff=0.7)

        self.play(FadeIn(title), FadeIn(honesty))
        for i, node in enumerate(group):
            self.play(FadeIn(node, scale=0.85), run_time=0.35)
            if i < len(links):
                self.play(GrowArrow(links[i]), run_time=0.2)
        self.play(Indicate(group[4], color="#fbbf24"), Write(landauer_note))
        self.wait(1.2)
