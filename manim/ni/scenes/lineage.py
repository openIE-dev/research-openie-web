"""ni-inf-01 — Notational lineage: Iverson → … → Lee → WCA commit law.

Teacher short. No board meters. board_synth_claimed=false.
Text only (no MathTex / LaTeX).
"""
from manim import *


class NotationalLineage(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("ni-inf-01  Notation lineage", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        footer = Text(
            "Notation becomes the allow/refuse gate  ·  board_synth_claimed=false",
            font_size=15,
            color="#64748b",
        )
        footer.to_edge(DOWN, buff=0.28)

        nodes = [
            ("Iverson", "1960s+", "executable notation"),
            ("Engelbart", "1960s+", "augment intellect"),
            ("Kay", "1970s+", "personal medium"),
            ("Victor", "2010s", "think by seeing"),
            ("Lee", "2022", "notational intel."),
            ("WCA", "2026", "commit / refuse"),
        ]
        group = VGroup()
        for name, era, verb in nodes:
            color = "#f472b6" if name == "WCA" else "#60a5fa"
            circ = Circle(
                radius=0.52,
                stroke_color=color,
                stroke_width=3,
                fill_color="#111827",
                fill_opacity=1,
            )
            n = Text(name, font_size=18, color=color, weight=BOLD)
            e = Text(era, font_size=12, color="#94a3b8")
            v = Text(verb, font_size=12, color="#64748b")
            n.move_to(circ.get_center() + UP * 0.08)
            e.next_to(circ, DOWN, buff=0.08)
            v.next_to(e, DOWN, buff=0.04)
            group.add(VGroup(circ, n, e, v))
        group.arrange(RIGHT, buff=0.28).shift(UP * 0.45)

        links = VGroup()
        for i in range(len(group) - 1):
            links.add(
                Arrow(
                    group[i][0].get_right(),
                    group[i + 1][0].get_left(),
                    buff=0.06,
                    stroke_width=2.5,
                    color="#334155",
                    max_tip_length_to_length_ratio=0.2,
                )
            )

        teach = Text(
            "Notation stops being a note. It becomes the gate that allows or refuses.",
            font_size=18,
            color="#e2e8f0",
        )
        teach.next_to(group, DOWN, buff=0.85)

        self.play(FadeIn(title), FadeIn(footer))
        for i, node in enumerate(group):
            self.play(FadeIn(node, scale=0.9), run_time=0.32)
            if i < len(links):
                self.play(GrowArrow(links[i]), run_time=0.18)
        self.play(Indicate(group[-1], color="#f472b6"), Write(teach))
        self.wait(1.2)
