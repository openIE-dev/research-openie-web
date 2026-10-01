"""sat-fig-01 — Bliss-point geometry (textbook model).

Quadratic U(x) illustration only. Andersen 2001 lineage.
Not fitted to agent logs. Not an Epoch price series.
"""
from manim import *
import numpy as np


class BlissPointGeometry(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("sat-fig-01  Bliss point (textbook)", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        footer = Text(
            "modelled textbook  ·  Andersen lineage  ·  not agent eval  ·  not Epoch",
            font_size=15,
            color="#64748b",
        )
        footer.to_edge(DOWN, buff=0.28)

        axes = Axes(
            x_range=[0, 1.0, 0.25],
            y_range=[-0.2, 1.1, 0.25],
            x_length=8.5,
            y_length=3.6,
            axis_config={"color": "#475569", "stroke_width": 2},
            tips=False,
        ).shift(UP * 0.15)

        x_lab = Text("units of the good  x", font_size=16, color="#94a3b8")
        y_lab = Text("utility U", font_size=16, color="#94a3b8")
        x_lab.next_to(axes.x_axis, DOWN, buff=0.15)
        y_lab.next_to(axes.y_axis, LEFT, buff=0.1).rotate(PI / 2)

        x_star = 0.45
        a = 4.0

        def u(x):
            return 1.0 - a * (x - x_star) ** 2

        curve = axes.plot(lambda x: u(x), x_range=[0.05, 0.9], color="#60a5fa", stroke_width=4)
        peak = Dot(axes.c2p(x_star, u(x_star)), color="#fbbf24", radius=0.08)
        peak_lab = Text("x* bliss", font_size=18, color="#fbbf24", weight=BOLD)
        peak_lab.next_to(peak, UP, buff=0.18)

        past = Dot(axes.c2p(0.78, u(0.78)), color="#fb7185", radius=0.07)
        past_lab = Text("past bliss: MU can fall", font_size=15, color="#fda4af")
        past_lab.next_to(past, DOWN + RIGHT, buff=0.12)

        formula = Text(
            "U(x) = -a (x - x*)^2   teach model only. No fitted a.",
            font_size=16,
            color="#e2e8f0",
        )
        formula.next_to(axes, DOWN, buff=0.55)

        teach = Text(
            "Further units past x* do not raise utility. That is the definition, not a demand fit.",
            font_size=16,
            color="#fde68a",
        )
        teach.next_to(formula, DOWN, buff=0.22)

        self.play(FadeIn(title), FadeIn(footer))
        self.play(Create(axes), FadeIn(x_lab), FadeIn(y_lab))
        self.play(Create(curve), run_time=1.0)
        self.play(FadeIn(peak, scale=1.2), Write(peak_lab))
        self.play(FadeIn(past), FadeIn(past_lab))
        self.play(Write(formula), Write(teach))
        self.wait(1.2)
