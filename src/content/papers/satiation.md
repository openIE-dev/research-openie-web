---
title: "Human Satiation & Completeness in AI Economics — Research Study"
deck: "Capability scales. Appetite does not. Design to done."
id: satiation
status: "Research study · draft"
author: "David Charlot · Open Interface Engineering"
figures: "/living/satiation/"
pdf: "/pdfs/satiation.pdf"
board_synth_claimed: false
---

# Human Satiation & Completeness in AI Economics — Research Study

**Author / lane:** David Charlot · Open Interface Engineering (OpenIE) · WCA / EFA Commit Gate  
**Status:** Research study · draft (not a final journal PDF)  
**Public:** https://research.openie.dev/papers/satiation/ · PDF https://research.openie.dev/pdfs/satiation.pdf  
**Date:** Tue Sep 29–Wed Sep 30, 2026 (America/New_York / EDT)  
**Role:** Comprehensive research layer backing Medium #2 (MEDIUM_SATIATION) and a future whitepaper; decision rules already in SATIATION_BLUEPRINT (research archive).  
**Honesty:** No fabricated citations. Soft historical analogies labeled **[SOFT]**. Unverified or vendor claims marked **[UNVERIFIED]** / **[VENDOR]** / **[SURROGATE]**. Stack remains software reference: `board_synth_claimed=false`.

**Companion artifacts:** PRODUCT_LANDSCAPE, NOTATIONAL_INTELLIGENCE_RESEARCH, PRODUCT, SYSTEM_ONE_TO_WCA (research archive).

---

## 0. Executive synthesis

**Thesis (Charlot).** Mainstream AI economics often treats demand for intelligence like demand for oil: elastic, unbounded, forever hungry. For **work and care**, that is the wrong physics. Humans **satiate**. When a loop is *done*—invoice filed, child picked up, patient assessed, pipeline green—extra synthesis does not create human value. It creates noise, cost, and overkill. Capability can scale. Appetite cannot.

**Five findings (evidence-weighted).**

1. **Satiation is a real economic object**, not a soft preference. Classical consumer theory already admits **bliss points** where more of a good reduces utility (see §1). Engagement KPIs (tokens, seats, time-on-task) systematically diverge from **economic done**.
2. **Tech cycles really do race → satiate → commodity**, but the analogies are strongest as **[SOFT]** pattern recognition, not law. Verifiable cases (1890s bicycle boom/bust; U.S. smartphone ownership flat at ~91%; LCD panels as commodity; airline seats as yield-managed commodities) support the narrative where labeled.
3. **Digital AI is already on a free-at-margin arc** for many chores. Epoch AI documents extreme inference price declines for fixed performance (~9–900×/yr in Mar 2025 insight; ~47%/quarter ≈ 13×/yr in Sep 2026 “plunging price of thought” report). Open weights and System One–style typed decisions further cannibalize synthesis scarcity (§4). This is **not** free joules—physics still meters energy.
4. **Care and work completeness** are where satiation is most obvious and most ignored. Baumol’s cost disease literature shows why labor-intensive care resists pure productivity theater; Autor / Acemoglu–Restrepo task frameworks show automation displaces *tasks*, not “infinite appetite.” More AI after done can harm (§5). Steelman counters (status, creative unbounded demand, military/R&D) are real and scoped (§5.4).
5. **What does not discount:** physics (Landauer lower bound; Horowitz CMOS energy reality), actuators/matter, liability, and **commit**. OpenIE meters joules; WCA refuse-to-commit makes economic done ∪ physical unsafe both refuse (§6–7).

**Deck line (unchanged from blueprint):** Capability scales. Appetite does not. Design to done.

**Product one-liner:** Sell completion. Meter joules. Refuse after the finish line—and refuse before the plant moves without a certificate.

---

## 1. Definitions

### 1.1 Satiation

**Economic satiation** (standard): the more of a good one already has, the less one is willing to give up for more—driven by diminishing (and eventually zero / negative) marginal utility. Wikipedia’s summary and Andersen (2001) frame this as a structural feature of preference dynamics, not merely “taste.”

**Bliss point (textbook consumer theory):** a bundle \((x^*, y^*)\) at which further increases in consumption *reduce* utility. Indifference curves become closed around the bliss point; the usual monotonicity (“more is better”) fails. If the bliss point is affordable, the consumer stops there and may not spend all income. See Varian-adjacent textbook treatments (e.g. LibreTexts / *Introduction to Economic Analysis* §12.4 examples on pizza–beer bliss points).

**Operational (this study / OpenIE–WCA):** A task or care loop is **satiated** when additional synthesis, tooling, tokens, or “AI features” do not increase **human-valued completeness** (work closed / care closed). Past that threshold, more AI ≈ noise + cost + attention tax.

This operational definition is deliberately narrower than “all goods eventually satiate.” Status goods, military capability races, and open-ended R&D can remain non-satiating (§5.4). The claim is about **work & care completeness**, not about every human preference.

### 1.2 Completeness

| Term | Meaning here |
|------|----------------|
| **Work completeness** | Ticket closed, patch shipped, report filed, ledger reconciled, acceptance criteria met. |
| **Care completeness** | Assessment finished, meds reconciled, family notified, child safe, elder transfer done. |
| **Economic done** | Human-valued finish line for that loop—orthogonal to model capability ceiling. |
| **Technical capacity** | What the system *can* still generate after done. |

Completeness is a **stop condition**, not a quality score. A done detector that fires too early is under-care; one that never fires is engagement cosplay.

### 1.3 Economic done vs engagement KPIs

| Lens | Engagement / unbounded model | Satiation / completeness model |
|------|------------------------------|--------------------------------|
| Demand curve | Always more intelligence useful | Flat (or negative) after completeness |
| Product KPI | Engagement, tokens, seats, sessions | Time-to-done; refuse rate after done; joules after done |
| Pricing story | Scarcity premium forever | Commodity after satiation; premium where physics / commit bind |
| Failure mode | Under-build capacity | Overkill after closed loops |
| Human constraint | Assumed elastic attention | Finite attention, trust, hours, responsibility |
| Safety story | Soft confidence / more monitoring | Typed refuse + hold at commit boundary |

**Attention economy contrast.** Tristan Harris / Center for Humane Technology critique engagement maximization as extracting attention rather than serving user goals ([humanetech.com](https://www.humanetech.com/youth/the-attention-economy); Harris talks / 80,000 Hours interview). Tim Wu’s *The Attention Merchants* (Penguin / Knopf lineage) frames attention as inventory sold to advertisers. **Implication for AI product:** regenerating after done is the enterprise cousin of infinite scroll—same KPI pathology, different costume.

### 1.4 Contrast with unbounded-demand AI forecasts

Unbounded-demand models treat intelligence-as-a-service like oil: more capability ⇒ more willingness-to-pay ⇒ larger TAM forever. That can be approximately true for:

- new task categories (reinstatement in Acemoglu–Restrepo sense);
- status / arms-race domains;
- frontier R&D where “better” has no finish line.

It is a **category error** for satiated digital chores (spell-check-shaped synthesis, closed tickets, closed care assessments). Goldman Sachs Research’s *Gen AI: Too Much Spend, Too Little Benefit?* (Jun 2024; overview https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit ; PDF mirrors circulated as TOM_AI 2.0) is an existence proof that serious sell-side research already doubts whether ~$1T-scale infra spend maps cleanly to economy-wide productivity. Secondary coverage (e.g. 404 Media summary of the same note) amplifies the skepticism; treat magnitudes as **[VENDOR/SELL-SIDE]** and re-check the primary PDF before quoting numbers in a whitepaper.

**Category error to avoid:** “AI gets cheaper ⇒ infinite demand.” Jevons / rebound say cheaper energy *services* can increase *use*—but only where appetite is not already at a bliss point. For closed chores, cheaper AI often means **same done, lower bill**—or **same done, more noise if loops don’t stop**.

---

## 2. Literature & adjacent fields

### 2.1 Satiation in consumer theory / utility

| Source | Claim | URL / ID |
|--------|-------|----------|
| Andersen, Esben Sloth (2001). “Satiation in an Evolutionary Model of Structural Dynamics.” *Journal of Evolutionary Economics* 11(1): 143–164 | Evolutionary / structural dynamics with satiation | DOI: [10.1007/PL00003852](https://doi.org/10.1007/PL00003852) |
| Wikipedia *Economic satiation* | Survey stub linking satiation to diminishing MU | https://en.wikipedia.org/wiki/Economic_satiation |
| LibreTexts / *Introduction to Economic Analysis* §12.4 | Bliss-point isoquants; satiation as max utility then decline | https://socialsci.libretexts.org/ (search “bliss point”) |
| Econ-Viz *Satiation (Bliss Point)* | Quadratic utility \(U=-\!a(x-x^*)^2-\!b(y-y^*)^2\); closed indifference ellipses | https://econ-viz.org/models/satiation/ |

**Takeaway for AI econ:** “More is better” is an *axiom choice*, not a law of nature. Work/care products that assume monotonicity past completeness will misprice and overbuild.

### 2.2 Jevons paradox & rebound

| Source | Claim | URL |
|--------|-------|-----|
| Jevons, W. S. (1865). *The Coal Question* | Efficiency gains can *increase* coal use (“backfire”) | Historical classic; modern reprints vary |
| Gillingham, Rapson & Wagner (2015/16). “The Rebound Effect and Energy Efficiency Policy.” *REEP* | Micro rebound often ~20–40%; little support for universal backfire; macro harder | https://gwagner.com/wp-content/uploads/Gillingham-Rapson-Wagner-2015-Rebound-Effect.pdf |
| Stern (2020 survey CAMA) | Economy-wide rebound estimates mixed; some large | https://cama.crawford.anu.edu.au/sites/default/files/publication/cama_crawford_anu_edu_au/2020-07/70_2020_stern.pdf |
| TypeSafe “Jev” naming | Explicit nod to Jevons paradox: cheaper decisions → more decisions | Product landscape context; **[VENDOR]** branding |

**Bridge to satiation thesis:** Rebound requires residual demand elasticity. At a bliss point / completeness threshold, the direct rebound on *that chore* collapses toward zero—you do not drive infinite miles once you have arrived; you do not spell-check forever once the document is correct. Rebound can still appear as **new tasks** (Acemoglu–Restrepo reinstatement) or **attention spillover** (agents inventing work). Product rule: meter post-done joules separately from pre-done joules.

### 2.3 Baumol cost disease / care economy

| Source | Claim | URL |
|--------|-------|-----|
| Baumol, W. J. (1967). “Macroeconomics of Unbalanced Growth.” *AER* 57: 415–426 | Progressive vs stagnant sectors; relative cost rise in labor-intensive services | Classic AER cite |
| Hartwig / OECD panel literature | Baumol effect statistically linked to health spending growth | e.g. Hartwig *J Health Econ* 2008 lineage |
| Colombier & Hartwig / related (2025) acute vs LTC | Baumol affects both acute and long-term care; stronger in LTC | https://link.springer.com/article/10.1007/s10754-025-09392-9 ; PMC https://pmc.ncbi.nlm.nih.gov/articles/PMC12361285/ |
| Bates & Santerre / *SSQ* | Cost disease ~15–40% of “full” effect on HCE in one instrumented design | https://onlinelibrary.wiley.com/doi/10.1111/ssqu.12384 |
| Atella et al. / *Health Economics* (2018) | Skeptical: little support for BCD once trending addressed | https://onlinelibrary.wiley.com/doi/10.1002/hec.3641 |
| Pomp & Vujić (CPB) | ~0.5% real health spend growth per 1% economy-wide productivity | https://www.cpb.nl/system/files/cpbmedia/publicaties/download/rising-health-spending-new-medical-technology-and-baumol-effect.pdf |

**Honesty:** Baumol is contested in magnitude. Consensus-enough for this study: **care remains labor-, trust-, and liability-intensive**; AI that speeds documentation without a done/refuse discipline can raise measured “activity” while missing completeness—or worse, add generative noise into clinical workflows.

### 2.4 Automation: displacement vs task completion

| Source | Claim | URL |
|--------|-------|-----|
| Acemoglu & Restrepo (2019). “Automation and New Tasks.” *JEP* 33(2): 3–30 | Automation = displacement; new tasks = reinstatement; “so-so” automation worst | https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3 ; NBER https://www.nber.org/papers/w25684 |
| Acemoglu & Restrepo (2018). “The Race between Man and Machine.” *AER* | Factor shares / employment under automation vs new tasks | https://pubs.aeaweb.org/doi/pdf/10.1257/aer.20160696 |
| Autor task literature (broader) | Polarization / routine-biased change; tasks not jobs | Multiple papers; use Autor’s survey pieces when citing in whitepaper |

**Mapping:** Completeness-oriented AI is closer to **closing a task** than to inventing engagement. Unbounded agent loops without done detectors look like “so-so automation”: costly activity, weak productivity.

### 2.5 Attention economy critiques

| Source | Claim | URL |
|--------|-------|-----|
| Center for Humane Technology | Engagement metrics extract attention; redesign incentives | https://www.humanetech.com/youth/the-attention-economy |
| Tristan Harris (80,000 Hours / talks) | Replace time-spent with time-well-spent; incentive redesign | https://80000hours.org/podcast/episodes/tristan-harris-changing-incentives-social-media/ |
| Tim Wu, *The Attention Merchants* | Attention as sold inventory | https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/ |

**AI parallel:** Token meters and seat licenses optimized for usage will fight satiation. Joule meters and done detectors align with completeness.

### 2.6 “Good enough” technology / Christensen commodity

| Source | Claim | URL |
|--------|-------|-----|
| Christensen, *The Innovator’s Dilemma* (1997) | Overshoot → customers become overserved; “good enough” wins on convenience/price | https://en.wikipedia.org/wiki/The_Innovator%27s_Dilemma ; Christensen Institute https://www.christenseninstitute.org/theory/disruptive-innovation/ |
| Christensen Institute checklist | Disruption ≠ breakthrough sustaining innovation | same |

**Mapping [SOFT]:** Frontier AI is sustaining innovation for many digital chores; open weights / small specialists / typed decision heads are “good enough” disruptors. After satiation, customers do not want louder capability—they want cheaper, quieter completion.

### 2.7 Historical tech diffusion cycles (verifiable notes)

| Cycle | Verifiable anchor | Honesty |
|-------|-------------------|---------|
| **Bicycles (1890s)** | British Bicycle Mania 1895–1900: cycle shares +>200% then −>75% (Quinn & Turner, *Cambridge Journal of Economics* 2019) | Strong on boom/bust finance; satiation-of-*use* is **[SOFT]** reading |
| | U.S. peak sales per capita ~1897 not matched until ~1965 (Dowell & Swaminathan lineage; industry structure lit) | Strong on market saturation of prestige phase |
| **Cars** | Mass mobility / used markets after horsepower theater | **[SOFT]** narrative; cite specific series in whitepaper if needed |
| **Planes / airlines** | Post-1978 U.S. deregulation → seats as perishable commodities; yield/revenue management | Strong on commodity endgame of *seats*; not on “speed records satiation” |
| **TVs** | Developed-market ownership near universal; LCD panels traded as commodities; replacement cycles | Strong on panel commodity; resolution arms race → “good enough” is **[SOFT]** |
| **Phones** | Pew: U.S. smartphone ownership **91%** in 2024 and **91%** in 2025; cellphones **98%** | Strong saturation evidence (https://www.pewresearch.org/internet/fact-sheet/mobile/) |

### 2.8 AI TAM / forecast critiques

| Source | Claim | Honesty |
|--------|-------|---------|
| Goldman Sachs *Gen AI: Too Much Spend, Too Little Benefit?* (2024) | Infra spend vs benefit skepticism | Sell-side; verify PDF numbers before whitepaper quotes |
| Epoch AI inference price work (2025–2026) | Extreme price/performance declines—consistent with commodity phase for *capability-at-price*, not with infinite WTP | Research nonprofit; strong on cost curves |
| System One wave (Jev / Laya, Sep 2026) | Typed decisions collapse generation tax; moats thin | See `PRODUCT_LANDSCAPE.md`; **[VENDOR]** multiples |

---

## 3. Cycle table deepened (race → satiation → commodity)

| Technology | Race phase | Satiation signal | Commodity endgame | Evidence notes | Honesty |
|------------|------------|------------------|-------------------|----------------|---------|
| **Bicycles** | Novelty, clubs, prestige machines; 1890s mania | “I can get there”; middle-class craze exhausts | Utility transport / recreation kit; exports of surplus | Quinn & Turner (2019) share boom/bust; U.S. ~1897 peak | Race/finance **strong**; “completeness” reading **[SOFT]** |
| **Cars** | HP wars, brand theater | Reliable trips > endless upgrades | Mass mobility, used markets | Pattern recognition across auto history | **[SOFT]** |
| **Planes** | Heroic aviation, speed records | Arrive safely on a schedule | Seats + fuel + RM math | Airline RM / deregulation literature | Seat commodity **strong**; heroics→schedule **[SOFT]** |
| **TVs** | Screen size / resolution arms race | Enough fidelity for content | Commodity panel + subscription pipe | Panel pricing reports; near-universal ownership in rich markets | Panel commodity **strong**; “enough fidelity” **[SOFT]** |
| **Cell phones / smartphones** | Spec sheets, camera Mpx | Always-reachable communication | Pocket utility computer | Pew 91% smartphone / 98% cellphone (2025) | Saturation **strong** |
| **AI (digital chores)** | Frontier seats, agents, AGI theater | Chore closed without theater | Bundled / free-at-margin synthesis | Epoch cost curves; open weights; System One | Cost collapse **strong**; satiation of *chores* is thesis (**operational**) |

**Rule (blueprint, unchanged):** If your AI wedge is still “more capability” after the user’s finish line, you are selling race-phase theater into a commodity market.

**Wildcard (~6 months frontier distill onto inferior hardware) [SOFT + emerging evidence]:** Distillation, quantization, BitNet/TeLLMe/T-MAC-class methods, and open cascades move yesterday’s frontier competence onto weaker silicon (`PRODUCT_LANDSCAPE.md` Axis B). Treat “~6 months” as a **heuristic planning horizon**, not a measured law—label **[UNVERIFIED]** as a universal constant; cite specific model/hardware pairs when claiming in whitepaper.

---

## 4. Free-at-margin arc (real cites only)

### 4.1 Spell-check → feature → air

| Stage | Pattern | Cite |
|-------|---------|------|
| Product | Standalone spelling tools / early WP features | Wikipedia *Spell checker* https://en.wikipedia.org/wiki/Spell_checking |
| Feature | WordPerfect mid-1980s integration; MS Word background check (Word 95 red underline narrative) | Same; secondary histories (e.g. Inkbot editing history piece—use as **[SECONDARY]**) |
| Air | Expected correctness layer around the text box; not sold as a seat | Lived infrastructure; hard to cite a single paper—treat as **[SOFT]** industry observation |

**Decision rule:** Do not build a seat license for air.

### 4.2 Search, maps, open internet

Search and maps followed advertising / bundling paths toward “just there” marginal access. Exact pricing histories are firm-specific; the **pattern** (scarce discovery → expected infrastructure) is **[SOFT]** but widely observed. Prefer primary company filings or academic IO papers if the whitepaper needs hard numbers.

### 4.3 Open weights & inference cost curves

| Finding | Source | URL |
|---------|--------|-----|
| Price to hit fixed LLM performance fell ~**9×–900× per year** across six benchmarks (GPT-4-level GPQA Diamond ~**40×/yr**) | Epoch AI data insight, Mar 12, 2025 | https://epoch.ai/data-insights/llm-inference-price-trends |
| Cost of given performance fell ~**47% per quarter (~13×/yr)** since ~2023; faster near SOTA | Epoch AI, *The plunging price of thought*, Sep 22, 2026 | https://epoch.ai/publications/the-plunging-price-of-thought |
| Open-weight token share rising; revenue share lagging (press summaries Aug/Sep 2026) | Tech press / gateway reports | Treat specific % as **[PRESS]** until primary dashboards cited |
| System One typed decisions: collapse generation tax for known option sets | `PRODUCT_LANDSCAPE.md`; Laya catalog | https://laya-ai.com/system-one-models ; Jev **[VENDOR]** |

**Interpretation for satiation thesis:**

- Free **at the margin** = priced like spell-check for pure information chores with clear completeness—not zero energy bill.
- Moats that were only **synthesis scarcity** get eaten by rivals, open weights, cascades, retrieval, typed heads.
- Frontier still matters for non-satiating domains (R&D, arms races, novel tasks)—do not overclaim.

### 4.4 People frontload payment [SOFT operational]

Users and firms often **prepay** (subscriptions, reserved capacity, seat licenses) while expecting AI to behave like air. That mismatch—frontloaded spend against satiating appetite—creates waste visible only if you meter **joules after done**. OpenIE’s job is to make that waste legible.

---

## 5. Care & work completeness

### 5.1 Where more AI after done harms

| Domain | Completeness test | Harm of post-done AI |
|--------|-------------------|----------------------|
| **Office / tickets** | Closed with acceptance | Re-prompt churn, latency, attention tax, shadow IT agents inventing work |
| **Coding chores** | Verified correct artifact | Regenerating lawful answers via frontier (CFC chemistry) |
| **Healthcare documentation** | Note complete, orders reconciled | Hallucinated embellishment, alert fatigue, billing narrative inflation |
| **Eldercare / childcare logistics** | Person safe, handoff done | Engagement-style chat replacing presence; false motion |
| **Clinical decision support** | Assessment + plan signed | Probability theater without liability-bearing commit |

Baumol lens: the scarce input is often **trusted human time and responsibility**, not tokens. AI that cannot stop competes with that scarce input.

### 5.2 Healthcare / eldercare / childcare — completeness first

Design principle: **care is not a funnel**. Metrics should be time-to-safe-state, handoff integrity, and refuse-on-complete—not session length.

Empirically, health spending drivers are multi-causal (Baumol + tech + income + demographics). This study does **not** claim AI “solves Baumol.” It claims AI without satiation discipline can **worsen** measured busy-ness in stagnant-sector work.

### 5.3 Office work — done detectors before louder models

Blueprint rule, reinforced: **Ship a done detector before shipping a louder model.**

Acemoglu–Restrepo: prefer automations with real productivity (not so-so), and expect new tasks—but new tasks are not an excuse for infinite loops on *old* closed tasks.

### 5.4 Steelman counterarguments (non-satiating domains)

| Counter | Steelman | Reply (scoped) |
|---------|----------|----------------|
| **Status goods** | Veblen / positional demand never satiates; “best model” is a trophy | True for status. False for invoice filing. Segment markets. |
| **Creative unbounded demand** | Art, research ideation, entertainment want more novelty | Partially true. Still often has *project-level* done (ship the album, submit the paper). |
| **Military / security** | Adversary sets the ceiling; arms races lack bliss points | True. Commit/safety gates still bind; satiation thesis does not apply cleanly. |
| **Open-ended R&D / AGI race** | Better science tools raise ambition | True for frontier labs. Does not rescue TAM math for satiated SaaS chores. |
| **Jevons on AI** | Cheaper inference ⇒ vastly more inference | Often true *globally*; can coexist with *per-chore* satiation. Meter both. |
| **Engagement is the product** | Some businesses sell attention | Then they are not in the work/care completeness business—say so honestly. |
| **Humans don’t know done** | Preferences are constructed; more features reveal demand | Sometimes. Still need stop conditions to avoid harm in care/liability domains. |

---

## 6. Scarcity residual: physics, joules, actuators, liability, commit

### 6.1 What stays scarce vs what commodities

| Still scarce | Heading commodity |
|--------------|-------------------|
| Joules / thermodynamic & CMOS energy cost | Generic text synthesis for closed chores |
| Matter, actuators, clinic/floor time | Spec-sheet “AI features” without completion |
| Irreversible commit / liability | Soft moats that were only temporary synthesis scarcity |
| Auditable certificates + refuse taxonomy | Confidence strings as safety |
| Honest meters (OpenIE joules) | Seat licenses with no ledger |

### 6.2 Landauer (honesty)

Landauer (1961), “Irreversibility and Heat Generation in the Computing Process,” *IBM Journal*: logically irreversible operations require a minimum heat generation on the order of \(kT\) per irreversible bit operation (often quoted as \(kT\ln 2\) per erased bit). PDF mirror: https://cqi.inf.usi.ch/qic/61_Landauer.pdf

**Honesty for OpenIE messaging:**

- Landauer is a **lower bound**, many orders of magnitude below practical CMOS dissipation.
- It does **not** mean today’s LLM inference is near the bound.
- It **does** mean “information is free” is false in physics—erasure and irreversible commits have a thermodynamic story.
- Do not slap Landauer on a marketing slide as if GPT inference were \(kT\ln 2\) away from free.

### 6.3 Horowitz / CMOS energy reality

Mark Horowitz, “Computing’s Energy Problem (and What We Can Do About It),” ISSCC 2014, pp. 10–14 (IEEE: DOI 10.1109/ISSCC.2014.6757323). Core message in secondary teaching notes and talks: systems are increasingly **energy-limited**; architectural specialization and reducing memory/IO energy matter more than wishing Dennard scaling back.

**Honesty:** Quote ISSCC paper carefully; vendor “X tokens/J” claims are **[VENDOR]** until DUT-metered. WCA stack: `board_synth_claimed=false`; surrogate J = OpCounter × analytical \(E_*\) (**[SURROGATE]**).

### 6.4 Actuators, liability, commit gates → OpenIE + WCA

Compose (software reference, unchanged):

```text
commit = LUT allow ∧ energy/safe ok [∧ CBF]
```

| Signal | Gate behavior |
|--------|---------------|
| Economic done (satiated chore) | Policy / budget refuse — do not spend |
| Physical unsafe / over-budget | Energy / LUT / CBF refuse — hold plant |
| Irreversible tool | No executor call until Certificate allows |

**Refuse = economic done ∪ physical unsafe** — two faces of one discipline.

OpenIE: **Measure · route · eliminate excessive waste** — meter in joules (or honest Wh), not tokens/seats/vibes as primary scarcity.

Linkage to notational intelligence research: certificates as **runtime commit law**, not soft prose (`NOTATIONAL_INTELLIGENCE_RESEARCH.md`).

---

## 7. Decision rules / product implications (extends blueprint)

### 7.1 Core rules (from blueprint, retained)

1. Design to **done**; sell completion.
2. Assume soft synthesis moats get eaten.
3. Plan for competence sliding down the device stack.
4. Compete on **meter + commit**, not chat theater.
5. Never claim “free” for energy or plant motion.
6. Ship **done detector** before louder model.
7. Probability routes; **certificates commit**.

### 7.2 Extensions from this study

| ID | Rule | Rationale |
|----|------|-----------|
| R-S6 | Split meters: **pre-done J** vs **post-done J** | Makes satiation visible; ties to rebound vs bliss-point distinction |
| R-S7 | Segment TAM: satiating chores vs non-satiating races | Avoids applying AGI blue-ocean prices to spell-check-shaped work |
| R-S8 | Treat engagement KPIs as **hostile** in care/work products unless proven aligned | Attention-economy literature |
| R-S9 | For care: optimize handoff integrity / safe-state time, not session length | Baumol + completeness |
| R-S10 | When citing Landauer/Horowitz, state measurement tier (A surrogate / B post-synth / C board) | Honesty; matches NI research memo |
| R-S11 | Jevons naming (cheaper → more) is a **warning**, not a growth excuse for uncapped agents | TypeSafe irony + rebound lit |
| R-S12 | Kill criteria K-S1–K-S5 remain binding (blueprint §9) | Strategy hygiene |

### 7.3 Anti-patterns (extended)

| Anti-pattern | Why it fails |
|--------------|--------------|
| AGI blue-ocean price on satiated chores | Appetite already flat |
| Soft confidence as plant permission | Probability ≠ certificate |
| Token/$ as only scarcity meter | Misses joules and irreversible commit |
| Infinite agent loops as “productivity” | No completeness stop |
| “Free AI” erasing energy/plant cost | Physics does not discount |
| Using rebound/Jevons to deny satiation | Rebound needs residual elasticity |
| Landauer cosplay (“we’re near kT”) | Orders of magnitude gap; **[SURROGATE]** risk |

---

## 8. Implications for whitepaper + Medium #2 revision notes

### 8.1 What Medium #2 already covers

- Unbounded-demand critique; satiation definition for work/care
- Soft cycle table (bikes→cars→planes→TVs→phones)
- Free-AI arc (spell-check → internet → free at margin)
- Care & work completeness
- Physics + commit scarcity; OpenIE meters + WCA refuse
- CFC chemistry metaphor; compose formula

### 8.2 What this study adds (do not dump wholesale into Medium)

1. **Formal definitions** linked to bliss-point / consumer theory and engagement-KPI contrast.
2. **Literature map** with real DOIs/URLs (satiation, rebound, Baumol, Acemoglu–Restrepo, Christensen, attention economy).
3. **Evidence-labeled cycle table** (Quinn & Turner; Pew; airline RM; honesty labels).
4. **Quantitative free-at-margin spine** (Epoch 2025 insight + 2026 plunging-price report).
5. **Steelman counter-table** for status / creative / military / R&D / Jevons.
6. **Landauer + Horowitz honesty** (bound vs CMOS practice; measurement tiers).
7. **Extended decision rules** R-S6–R-S12 and whitepaper outline hooks.
8. **Bibliography + method appendix**.

### 8.3 Suggested Medium #2 micro-edits (optional; do not rewrite)

1. After the cycle table sentence “Soft reading of history, deliberately,” consider adding: “Deeper sources and honesty labels live in the companion research study.”
2. Where “Landauer’s ledger” appears, a footnote-level honesty clause helps: lower bound, not a claim that LLMs are near \(kT\ln 2\).
3. Optional one-liner citing Epoch on inference price collapse (with link)—only if Medium style allows outbound research links.
4. No change needed to the compose formula or OpenIE/WCA positioning; study confirms, does not contradict.

### 8.4 Whitepaper skeleton (future)

1. Problem: AI econ without satiation  
2. Theory: bliss points, completeness, rebound scoped  
3. Empirics: cost curves + diffusion cases  
4. Care/work sector analysis  
5. Scarcity residual + commit nomenclature  
6. OpenIE + WCA reference architecture  
7. Falsifiers / kill criteria  
8. Full bibliography  

---

## 9. Bibliography (real URLs / DOIs only)

### Economics & theory

1. Andersen, E. S. (2001). Satiation in an Evolutionary Model of Structural Dynamics. *Journal of Evolutionary Economics*. https://doi.org/10.1007/PL00003852  
2. Baumol, W. J. (1967). Macroeconomics of Unbalanced Growth. *American Economic Review* 57: 415–426.  
3. Acemoglu, D. & Restrepo, P. (2019). Automation and New Tasks. *Journal of Economic Perspectives* 33(2). https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3 ; NBER https://www.nber.org/papers/w25684  
4. Acemoglu, D. & Restrepo, P. (2018). The Race between Man and Machine. *AER*. https://pubs.aeaweb.org/doi/pdf/10.1257/aer.20160696  
5. Gillingham, K., Rapson, D. & Wagner, G. (2015). The Rebound Effect and Energy Efficiency Policy. Working PDF: https://gwagner.com/wp-content/uploads/Gillingham-Rapson-Wagner-2015-Rebound-Effect.pdf  
6. Stern, D. (2020). How large is the economy-wide rebound effect? CAMA Working Paper. https://cama.crawford.anu.edu.au/sites/default/files/publication/cama_crawford_anu_edu_au/2020-07/70_2020_stern.pdf  
7. Jevons, W. S. (1865). *The Coal Question*.  

### Care / Baumol empirics

8. Colombier, C. et al. / Hartwig lineage (2025). Baumol’s cost disease in acute versus long-term care. https://link.springer.com/article/10.1007/s10754-025-09392-9 ; PMC https://pmc.ncbi.nlm.nih.gov/articles/PMC12361285/  
9. Bates, L. J. & Santerre, R. E. Drivers of Health-Care Expenditure… *Social Science Quarterly*. https://onlinelibrary.wiley.com/doi/10.1111/ssqu.12384  
10. Atella et al. (2018). Is health care infected by Baumol’s cost disease? *Health Economics*. https://onlinelibrary.wiley.com/doi/10.1002/hec.3641  
11. Pomp, M. & Vujić, S. Rising health spending… CPB. https://www.cpb.nl/system/files/cpbmedia/publicaties/download/rising-health-spending-new-medical-technology-and-baumol-effect.pdf  

### Innovation / attention / satiation refs

12. Christensen Institute — Disruptive Innovation. https://www.christenseninstitute.org/theory/disruptive-innovation/  
13. Wikipedia — *The Innovator’s Dilemma*. https://en.wikipedia.org/wiki/The_Innovator%27s_Dilemma  
14. Wikipedia — *Economic satiation*. https://en.wikipedia.org/wiki/Economic_satiation  
15. Econ-Viz — Satiation (Bliss Point). https://econ-viz.org/models/satiation/  
16. Center for Humane Technology — Attention Economy. https://www.humanetech.com/youth/the-attention-economy  
17. 80,000 Hours — Tristan Harris interview. https://80000hours.org/podcast/episodes/tristan-harris-changing-incentives-social-media/  
18. Wu, T. — *The Attention Merchants* (publisher page). https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/  

### Historical cycles / saturation

19. Quinn, W. & Turner, J. D. (2019). Technological revolutions and speculative finance: British Bicycle Mania. *Cambridge Journal of Economics*. https://ideas.repec.org/a/oup/cambje/v43y2019i2p271-294..html  
20. Pew Research Center — Mobile Fact Sheet (updated Nov 20, 2025; 2025 fielding). https://www.pewresearch.org/internet/fact-sheet/mobile/  
21. Wikipedia — *Spell checker*. https://en.wikipedia.org/wiki/Spell_checking  

### AI cost / forecasts

22. Epoch AI (2025-03-12). LLM inference prices… https://epoch.ai/data-insights/llm-inference-price-trends  
23. Epoch AI (2026-09-22). The plunging price of thought. https://epoch.ai/publications/the-plunging-price-of-thought  
24. Goldman Sachs — Gen AI: too much spend, too little benefit? https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit  
25. Laya System One catalog. https://laya-ai.com/system-one-models  

### Physics / energy

26. Landauer, R. (1961). Irreversibility and Heat Generation in the Computing Process. *IBM Journal*. PDF mirror https://cqi.inf.usi.ch/qic/61_Landauer.pdf  
27. Horowitz, M. (2014). Computing’s Energy Problem… ISSCC. IEEE DOI 10.1109/ISSCC.2014.6757323  

### Internal companions

28. `artifacts/presentations/MEDIUM_SATIATION.md`  
29. `artifacts/SATIATION_BLUEPRINT.md`  
30. `artifacts/PRODUCT_LANDSCAPE.md`  
31. `artifacts/NOTATIONAL_INTELLIGENCE_RESEARCH.md`  

---

## 10. Honesty appendix + method

### 10.1 Method

| Item | Detail |
|------|--------|
| **Dates** | Research & drafting Tue Sep 29–Wed Sep 30, 2026, America/New_York (EDT, UTC−4). Box `date` at drafting: Tue Sep 29 23:11 EDT 2026. |
| **Tools** | WebSearch, WebFetch on primary pages; read of local Medium #2, blueprint, PRODUCT_LANDSCAPE, NOTATIONAL_INTELLIGENCE_RESEARCH. |
| **Prior artifacts** | Extended, not contradicted; contradictions would be flagged—none material found. |
| **Citation rule** | Real URL/DOI or tag **[UNVERIFIED]/[VENDOR]/[SURROGATE]/[SOFT]/[PRESS]/[SECONDARY]**. |
| **Excluded** | Fabricated papers, invented statistics, silicon joule leadership claims, board synthesis claims. |

### 10.2 Label legend

| Tag | Meaning |
|-----|---------|
| **[SOFT]** | Historical / narrative analogy; pattern-helpful, not econometric law |
| **[UNVERIFIED]** | Plausible but not pinned to a primary measurement here |
| **[VENDOR]** | Company self-report or branded benchmark |
| **[SURROGATE]** | Analytical / OpCounter energy, not DUT watts |
| **[PRESS]** | News secondary; re-check primary before whitepaper |
| **[SECONDARY]** | Blog/textbook exposition, not original paper |

### 10.3 Explicit non-claims

- Does **not** claim all human demand satiates.  
- Does **not** claim Landauer binds practical LLM energy.  
- Does **not** claim WCA board joules (`board_synth_claimed=false`).  
- Does **not** claim Baumol is the sole driver of health costs.  
- Does **not** claim Epoch rates extrapolate forever.  
- Does **not** treat Goldman Sachs as gospel—sell-side critique only.

### 10.4 Falsifiers (research-facing)

| Falsifier | Would weaken thesis if… |
|-----------|-------------------------|
| F1 | Controlled studies show post-completeness generative AI raises validated care/work outcomes without added harm |
| F2 | Persistent WTP premiums for frontier synthesis on clearly closed chores despite open-weight parity |
| F3 | Inference prices stop falling *and* demand for closed-chore synthesis remains highly elastic for years |
| F4 | Commit/liability becomes cheaply insurable at scale with soft scores alone (no certificates) |

---

*End of study. Companion publish prose: Medium #2. Decision tables: SATIATION_BLUEPRINT.md. OpenIE · WCA lane.*
