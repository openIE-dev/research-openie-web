# Educational video voice references

Inventory date: 2026-10-01 (ET)

## Scope

Searched `/Users/dcharlot/data-share/vibe-coding/` on Mac `4e1505fa-e469-4612-9792-38d478ba57e6`. The second requested root, `/Users/dcharlot/vibe-coding/`, is absent. Counted the 15 top-level educational `*-video` trees below. `_wt-wai-video` was present but is an engineering worktree (WAI/Joule components, not a course-pack tree), so it is listed as excluded rather than treated as an education pack.

## 1. Pack inventory

### compute-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/compute-video/`
- **Key sources:** no README; `production_manifest.json`; `manifest_modules_01_04.json`; `manifest_modules_05_12.json`; `v2/production_plan.py`; `v2/assemble_video.py`; `v2/generate_backgrounds_from_plan.py`; `v2/narration_timing.py`; `narration/generate_all.py`; `v2/scenes/lesson_01.py` through `lesson_10.py`.
- **Visible text samples:** “Every operation has a thermodynamic cost level.” / “Set by physics. Not engineering.” / “Bennett Decomposition” / “FREE PHASE” / “PAID PHASE”.
- **Pipeline notes:** ElevenLabs narration; Manim vector overlays; BFL stills; ffmpeg assembly and concatenation; timing is measured from MP3s with ffprobe. Minimal amber overlays, small annotations, labels, and callouts; stills carry the hero image.
- **Voice:** George, warm storyteller; short explanatory beats that define a primitive, show the gap, then give the takeaway. The pack contains many joule claims; do not carry them into living pages without ledger support.

### corridor-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/corridor-video/`
- **Key sources:** `production_manifest.json`; `v2/production_plan.py`; `v2/assemble_video.py`; `v2/review.py`; `v2/make_outro_card.py`; `narration/generate_all.py`; `sync_to_web.sh`.
- **Visible/scripted lines:** “JOULE CORRIDOR” / “AN OPENIE PROJECT” / “Every American mile already has infrastructure in the ground.” / “Energy, compute, and communications — all from one install.” / “The corridor stops being a load and becomes an asset.”
- **Pipeline notes:** Mostly BFL cinematography plus narration; optional Manim overlays; Ken Burns motion; ffmpeg trims overlays to narration and concatenates lessons; poster extraction uses ffmpeg. Review HTML checks that image and narration agree.
- **Voice:** George, warm storyteller. Concrete place-first writing, then a simple system claim; closing cards are brief and declarative.

### cycle-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/cycle-video/`
- **Key sources:** `v2/production_plan.py`; `v2/assemble_video.py`; `v2/generate_backgrounds_from_plan.py`; `v2/review.py`; `v2/make_outro_card.py`; `narration/generate_all.py`; `sync_to_web.sh`.
- **Visible/scripted lines:** “Joule Cycle produces water at the point of demand.” / “Seven sources under one platform.” / “Every village well.” / “Every island desalination point.” / “OpenIE. Energy-optimized compute for every liter on Earth.”
- **Pipeline notes:** Same corridor-style BFL plus optional Manim and ffmpeg pipeline; narration-driven review pages; generated posters and web sync.
- **Voice:** George; repeated short sentences make a distributed system easy to follow. Use the same cadence, but replace unsupported quantitative claims with sourced prose.

### dpb-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/dpb-video/`
- **Key sources:** `README.md`; `manifest.json`; `assemble.py`; `generate_narration.py`; `scenes/module_00.py` through `module_10.py`.
- **Visible text samples:** “AuraSense DPB” / “Movement, measured.” / “UPDRS Score Sheet” / “MDS-UPDRS Part III” / “3-Stage Pipeline” / “Stage 1: Triage”.
- **Pipeline notes:** Manifest is the narration source of truth; ElevenLabs George, model `eleven_flash_v2_5`; Manim scenes are paired to narration; ffmpeg loops/fits scene video, muxes audio, and renders posters.
- **Voice:** README says calm, confident, about 150 wpm, with about 0.5 seconds between segments. Strong teaching pattern: name the problem, show the stage, give the measurable output.

### energy-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/energy-video/`
- **Key sources:** `production_manifest.json`; `v2/production_plan.py`; `v2/assemble_video.py`; `v2/assemble_all_v3.py`; `v2/assemble_simulator.py`; `v2/record_simulator.js`; `narration/generate_all.py`; `v2/scenes/`.
- **Visible text samples:** “Ambient Energy” / “Light · Vibration · Heat · RF” / “Forever.” / “50 mW device on harvested energy” / “You can't manage what you can't measure.”
- **Pipeline notes:** ElevenLabs George; BFL backgrounds; Manim timed overlays and simulator capture; ffmpeg composites and concatenates. Some archive scenes include data cards and big-number reveals.
- **Voice:** Moves from a concrete scene to the bottleneck, then to an intervention. It is persuasive but teachable. Numeric energy claims need explicit provenance before reuse.

### fabricator-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/fabricator-video/`
- **Key source:** `make_film.py`; `narration/`; `images/`; `segments/`; `output/`.
- **Scripted lines (no separate caption layer found):** “Every great leap in making came from one move” / “Closing the distance between a design and the thing itself.” / “The CNC mill arrived on the bench” / “A whole generation grew up turning a design into an object overnight.” / “Design and fabrication, at last, on the same bench.”
- **Pipeline notes:** Explicitly no Manim or corner overlays; BFL/FLUX cinematic backgrounds plus ElevenLabs George narration; ffmpeg Ken Burns assembly.
- **Voice:** Warm, historical, human-scale progression. It teaches through a sequence of concrete transitions rather than labels or statistics.

### flowrs-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/flowrs-video/`
- **Key sources:** `README.md`; `production_plan.py`; `narration/generate_all.py`; `narration_timing.py`; `shot_targets.py`; `capture/capture.mjs`; `scenes/*.py`; `assemble.py`.
- **Visible text samples:** “What a port declares” / “same type · different axis” / “What each layer proves” / “each layer earns one claim, and only that one” / “one binding · both views”.
- **Pipeline notes:** Tutorials capture the real editor with Playwright/WebGPU; course concepts use Manim. Measured MP3 duration drives capture targets, Manim timing, and ffmpeg assembly. README warns that a generic visual under a specific voice-over ships a lie.
- **Voice:** Bella, deliberately not George. Positive and self-standing; say what flowRS is and what the source tree proves. Do not claim open source, shipped MCP, physical bench execution, FPGA programming, or instrument counts unless verified.

### horizon-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/horizon-video/`
- **Key sources:** `v2/production_plan.py`; `v2/assemble_video.py`; `v2/generate_backgrounds_from_plan.py`; `v2/review.py`; `v2/make_outro_card.py`; `narration/generate_all.py`; `sync_to_web.sh`.
- **Scripted lines:** “Joule Horizon is one platform.” / “One deployment. Twelve capabilities.” / “Six form factors on the water.” / “Every buoy. Every pier. Every harbor and airfield the grid forgot.” / “OpenIE. Energy-optimized compute for every wave on Earth.”
- **Pipeline notes:** Same shared George/BFL/Manim/ffmpeg family as Corridor; mostly cinematic BFL plus optional overlays, with review HTML and poster generation.
- **Voice:** Scale is introduced after naming a specific place or device. Keep that order for research captions: object first, scope second, evidence limit third.

### leo-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/leo-video/`
- **Key sources:** `production_manifest.json`; `v2/production_plan.py`; `v2/assemble_video.py`; `v2/review.py`; `v2/make_outro_card.py`; `v2/scenes/leo_scenes.py`; `narration/generate_all.py`.
- **Visible text samples:** “Five compounding gains” / “System efficiency” / “That's not aspirational. That's arithmetic.” / “One stack. Four altitudes.” / “No counterparty with block interest”.
- **Pipeline notes:** George; cyan-on-black family palette; BFL plus optional Manim. `leo_scenes.py` says scenes are longer than narration and the composite trims them; ffmpeg handles overlay, audio, and concatenation.
- **Voice:** Large claims are staged through an altitude-by-altitude explanation. Avoid slogan compression in living captions; state the mechanism and then the implication.

### mathground-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/mathground-video/`
- **Key sources:** `README.md`; `v1/production_plan.py`; `v1/assemble_video.py`; `v1/generate_backgrounds_from_plan.py`; `v1/scenes/v1_scenes.py`; `narration/generate_all.py`.
- **Visible text samples:** “MATH-GROUND AI” / “built on math. for the physical world.” / “every primitive” / “closed-form” / “derived, not trained” / “picojoule receipt” / “before you ship.”
- **Pipeline notes:** README describes ElevenLabs George, BFL Flux 2 Pro, optional Manim math overlays, and ffmpeg. Manim renders on near-black and is composited with a colorkey; README calls narration the leverage point.
- **Voice:** Explain formal guarantees in plain language, then show the notation. The source uses “derived, not trained” as a useful evidence distinction; living captions should spell out what is actually measured.

### openie-mission-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/openie-mission-video/`
- **Key sources:** `CLAUDE.md`; `production_plan.py`; `generate_narration.py`; `generate_backgrounds.py`; `assemble_video.py`; `manim_overlays.py`.
- **Visible text samples:** “1,000 TWh / year” / “and rising” / “60% wasted” / “Not invention.” / “Deployment.” / “measure” / “route” / “harvest” / “verify” / “price”.
- **Pipeline notes:** Female Sarah voice, declamatory/civic register; illustrated Eames/Kurzgesagt-style visuals in cyan and amber; Bradley Hand Manim overlays with Write animation; BFL backgrounds and ffmpeg assembly. No readable text is requested in generated background art.
- **Voice:** Civic gravitas, one idea per segment, with direct Kennedy-style cadence. The pack explicitly says the numbers trace to the existing corpus; preserve that provenance rule.

### openloco-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/openloco-video/`
- **Key sources:** `README.md`; `production_plan.py`; `narration/generate_all.py`; `scenes/openloco_scenes.py`; `v1/assemble_video.py`; `v1/generate_backgrounds.py`; `v1/plan_s3.py`; `v1/plan_s4.py`.
- **Visible text samples:** “descriptor.udd.json” / “openloco generate --all anymal_wl.udd.json” / “goal” / “motion” / `"length": 0.30` / `"length": 0.45`.
- **Pipeline notes:** George, voice-locked; cinematic morphology shots plus optional minimalist amber-on-charcoal Manim wiring diagrams; ffmpeg composites, chroma-keys, trims, and encodes. Background prompts explicitly prohibit readable labels/captions/UI text.
- **Voice:** Concrete object, then its schema or behavior, then the consequence. “One source. Five artifacts.” is an effective teaching structure, but living pages should expand the five artifacts instead of leaving it as a slogan.

### quantum-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/quantum-video/`
- **Key sources:** no README found; `assemble.py`; `assemble_module_00.sh`; `narration/generate_all.py`; `narration/module_00_script.py`; `scenes/module_00.py` through `module_10.py`; `v2/` assemblers.
- **Visible text samples:** “Qubits scale exponentially” / “Answer” / “vQPU-Edge” / “2U · 300K · 30 qubits” / “Measurement Statistics” / “same probability, different phase” / “Phase × Interference = Computation”.
- **Pipeline notes:** George ElevenLabs narration; Manim scenes plus BFL stills; ffmpeg loops/fits visuals, muxes narration, and concatenates modules. Module 00 has a dedicated shell assembler; later modules use Python assemblers.
- **Voice:** Starts from a familiar contrast (bits/qubits), visualizes one relationship, then names the abstraction. Keep equations and symbols accompanied by a sentence that says what the viewer should notice.

### reef-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/reef-video/`
- **Key sources:** `v2/production_plan.py`; `v2/assemble_video.py`; `v2/generate_backgrounds_from_plan.py`; `v2/make_outro_card.py`; `narration/generate_all.py`.
- **Visible/scripted lines:** “JOULE REEF” / “AN OPENIE PROJECT” / “Industrial chemistry runs on four conditions.” / “The ocean is already a reactor.” / “The infrastructure is the only thing missing.” / “Joule Reef. Every depth. Every pressure.”
- **Pipeline notes:** George; BFL cinematic backgrounds; mostly no Manim scene for the narrative segments, with a LogoLock close; shared ffmpeg/ Ken Burns / optional-overlay assembler.
- **Voice:** Teaches by listing conditions, showing which are supplied by the environment, and naming the remaining engineering gap. Avoid turning this cause-and-effect chain into a tagline-only caption.

### shoal-video
- **Path:** `/Users/dcharlot/data-share/vibe-coding/shoal-video/`
- **Key sources:** `README.md`; `v1/production_plan.py`; `v1/assemble_video.py`; `v1/generate_video.py`; `v1/generate_backgrounds.py`; `narration/generate_all.py`.
- **Scripted lines:** “Most of the world's water is somebody's downstream.” / “And for most of it, no one is watching.” / “Shoal is a swarm of small, soft-bodied fish.” / “The biology is the energy harvester.” / “The fish swims because the river is dirty.” / “Shoal. An open ecosystem for living water.”
- **Pipeline notes:** Hybrid generated video clips plus BFL stills; optional Manim overlays; ffmpeg time-stretches clips to narration, blends overlays, muxes audio, and encodes. Video prompts explicitly request no text/captions, so these are spoken-script samples rather than guaranteed on-screen captions.
- **Voice:** George, warm storyteller. Concrete problem -> organism/device -> mechanism -> public data -> closing line. It is a strong model for teach-first captions, provided scientific and energy claims remain sourced.

### Excluded worktree
- **Path:** `/Users/dcharlot/data-share/vibe-coding/_wt-wai-video/`
- **Reason:** engineering worktree with WAI, Joule, OpenPay, and conformance documentation; no course-pack narration/lesson structure comparable to the 15 packs above.

## 2. Voice rules distilled for OpenIE research living pages

1. **Teach before branding.** First say what the figure or page shows. Then explain the mechanism. Only then give the implication or CTA.
2. **One claim per sentence.** Prefer short, complete sentences over fragments joined by em-dashes, arrows, slashes, or stacked slogan nouns.
3. **Name the evidence class.** Say whether a number is metered, estimated, catalog-derived, illustrative, or unmetered. Do not let a visual imply a measurement that was not taken.
4. **No invented joules.** Keep `measured_j=None` when that is the state. Do not convert a soft reference, simulation, or `mol prove` result into board-package joules.
5. **Make the visual legible in prose.** A caption should tell the reader what to look at and what conclusion is justified; “Manim · illustrative” alone is not enough.
6. **Use calm, confident teaching cadence.** Concrete noun, action, consequence. Avoid hype words such as “revolutionary,” “forever,” or “owns the market” unless the source explicitly supports them.
7. **Keep research limits visible, but not as slogans.** Replace “no fake meters” with “No board measurement is reported here; the value is an estimate.”
8. **Prefer sentence-case headings.** Use “How the cascade works” rather than “Thesis addendum,” “Close / receipt,” or an unexplained symbol string.
9. **Preserve provenance.** Link the study, section, figure ID, or receipt field next to the claim it supports. Separate a constructive proof from an implementation result.
10. **Read aloud once.** If a caption sounds like a launch trailer, a list of labels, or a compressed status dump, split it into teaching sentences.

## 3. MoL / NI / Satiation caption rewrite checklist

### MoL phrases to rewrite
Observed in `research-openie-web/public/living/mol/index.html`:

- “Living stub — P0 figure shells.” -> “This page shows the P0 figure shells for the MoL study.”
- “Thesis addendum: bottleneck is applied math × materials/hardware embodiment — not awareness...” -> “The remaining bottleneck is applied math and hardware embodiment. The page does not claim a new awareness limit.”
- “Manim · illustrative · Landauer = labeled thermodynamic lower-bound estimate...” -> “Illustrative Manim figure. The Landauer value is a labeled lower-bound estimate, not a board measurement.”
- “Grammar covered ⇒ do not open Model” -> “When the grammar covers the request, the system stops before opening the model.”
- “Close / receipt” and “Prove ↔ claim honesty” -> “Commit or refuse, then issue a receipt” and “How proof status maps to claims.”
- “ModelGenerated ↛ Deterministic” -> “A model-generated proposal is not deterministic evidence.”
- “No fake meters” / “no invented joules” -> “No meter reading is reported here, and no board joules are asserted.”
- “MoL ≠ MoE” -> “MoL differs from MoE in the decision it makes: it asks whether generation should run at all.”

### Apply the same pass to MoL, NI, and Satiation

- Search captions and subtitles for `—`, `→`, `↔`, `↛`, `≠`, `×`, pipe-separated label strings, and unexplained slash-separated phrases.
- Replace meta-signals such as “thesis addendum,” “living stub,” “slogan,” “close,” and “legend” with descriptive teaching headers.
- Turn slogan ticks into complete sentences. Keep the short line only after the mechanism has been explained.
- For each figure, write in this order: **what is shown -> what operation happens -> what evidence supports it -> what is not claimed -> link/reference**.
- Spell out `estimated_j`, `measured_j`, `board_synth_claimed`, `settle_refuse`, and related fields once in nearby prose; leave the code field intact for machine readers.
- Do not infer joules from a paper floor, a catalog estimate, a simulation, a soft reference, or a constructive existence proof.
- Keep “illustrative,” “estimated,” and “unmetered” adjacent to the relevant claim, not buried in a generic legend.
- Use teach-first captions for NI and Satiation too: define the decision or observable before naming the research thesis.
- End with the study link or figure reference, not a slogan tick.

No MoL captions were changed, and no commit, push, or deploy was performed. The requested guide was copied to the Mac at `/Users/dcharlot/data-share/vibe-coding/research-openie-web/docs/EDU_VOICE_GUIDE.md`.
