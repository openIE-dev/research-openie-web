"""mol-diag-02 — Named floors + E ≥ θ·μ with Landauer estimate label."""
from manim import *


class EnergyFloorEstimate(Scene):
    def construct(self):
        self.camera.background_color = "#0b1220"
        title = Text("mol-diag-02 · Named floors", font_size=28, color="#93c5fd")
        title.to_edge(UP, buff=0.35)
        honesty = Text(
            "Estimated only · measured_j=None · board_synth_claimed=false",
            font_size=16,
            color="#64748b",
        )
        honesty.to_edge(DOWN, buff=0.28)

        floors = ["VoI stop", "grammar", "energy (Landauer est.)", "efa_certificate", "settle_refuse", "primitive_gap"]
        chips = VGroup(*[
            Text(f"· {f}", font_size=24, color="#e2e8f0") for f in floors
        ]).arrange(DOWN, aligned_edge=LEFT, buff=0.18).shift(LEFT * 2.2 + UP * 0.2)

        # Text (not MathTex) — Mac brew manim has no LaTeX; keep equation as unicode
        eq = Text("E ≥ θ · μ", font_size=52, color="#fbbf24", weight=BOLD)
        eq.shift(RIGHT * 2.4 + UP * 0.4)
        note = Text("μ = catalog / estimate\n≠ board package joules", font_size=18, color="#94a3b8")
        note.next_to(eq, DOWN, buff=0.35)

        self.play(FadeIn(title), FadeIn(honesty))
        self.play(LaggedStart(*[FadeIn(c, shift=RIGHT * 0.15) for c in chips], lag_ratio=0.12))
        self.play(Write(eq), FadeIn(note))
        self.wait(1.2)
