---
title: "Satiation and Scarcity after Free AI"
deck: "Published price collapse for digital inference does not identify free energy, free actuation, or unbounded value after a chore is complete."
id: satiation
status: "Research study"
author: "David Charlot, Open Interface Engineering"
figures: "/living/satiation/"
pdf: "/pdfs/satiation.pdf"
board_synth_claimed: false
---

# Satiation and Scarcity after Free AI

## Abstract

Many planning models treat demand for machine intelligence as if it had no finish line. Consumer theory already contains the opposite object. Satiation, and the related bliss point, is the region in which further units of a good do not raise utility and may lower it (Andersen, 2001). This paper defines an operational cousin for work and care: a loop is economically done when a stated completeness predicate holds, and further synthesis on that loop does not increase the predicate. Engagement time, token count, and seat count are different variables. They can rise after completeness.

A second fact is about price, not physics. Epoch AI reports large declines in the price of a fixed inference performance (Epoch AI, 2025; Emberson and Roodman, 2026). This paper calls the resulting situation free at the margin for digital chores whose output is information and whose completeness test is finite. The phrase does not mean that joules are free, that a plant may move without a certificate, or that care labor has been automated away. Landauer's bound is a lower bound on erasure, not a description of current accelerators (Landauer, 1961; Horowitz, 2014).

The paper does not report a randomized trial, a done-detector error rate, or a split between energy spent before completeness and energy spent after it. Those measurements are specified and absent. What the software reference does provide is a place to put the stop: Wise Computer Automation (WCA) can refuse on a policy or budget reason, or on a physical predicate (look-up table allow and an energy check, optional control barrier function). The companion paper measures the physical predicate on toy plants. This paper states the economic predicate and the evidence that is actually published.

No field-programmable gate array (FPGA) has been synthesized or metered for this study. An Alchitry Pt V2 is the intended later device under test (DUT). A browser instrument that compiles the gate to WebAssembly (WASM) and displays it with WebGPU is shipped as Stage B at https://research.openie.dev/living/fpga-sim/ (see companion paper). It is a simulation, not a board result, and it is not a satiation measurement here. Analytical joules from the companion's OpCounter are not board power and are not evidence of satiation.

## Notation

| Term | Definition in this paper |
|------|--------------------------|
| Open Interface Engineering (OpenIE) | The organization maintaining the software reference and these two studies. |
| Satiation | In the cited theory, a fall of marginal utility to zero or below. In this paper's operational clause, further synthesis does not increase a stated completeness predicate. |
| Bliss point | A bundle at which additional quantity of the good reduces utility. A textbook object. Not estimated here. |
| Economic done | The event that the completeness predicate becomes true. Orthogonal to model scale. |
| Work completeness | A stated work stop: ticket closed, patch merged, report filed, ledger reconciled, or an equivalent written test. |
| Care completeness | A stated care stop: assessment finished, medications reconciled, receiving party notified, person in a safe state, or an equivalent written test. |
| Free at the margin | Marginal price of a digital synthesis step trends toward bundled or negligible money price. Joules and commits stay costly. |
| Wise Computer Automation (WCA) | The commit-and-refuse reference defined in the companion paper. |
| Energy-First Architecture (EFA) | The choice to keep an energy predicate inside permission. |
| Look-up table (LUT) | Discrete allow map used by the reference gate. |
| Control barrier function (CBF) | Set-invariance certificate, optional conjunct (Ames et al., 2019). |
| Model Context Protocol (MCP) | Tool transport. Not a detector of economic done. |
| System One | Typed software decisions for known option sets. A proposer, not a completeness proof. |
| Artificial general intelligence (AGI) | A broad capability target. Not a price observation and not a result of this paper. |
| Device under test (DUT) | Metered hardware under a stated workload. None reported. |
| Field-programmable gate array (FPGA) | Reconfigurable logic. Not synthesized here. |
| WebAssembly (WASM) | Browser compilation target for the shipped Stage B emulator of the gate (https://research.openie.dev/living/fpga-sim/). |
| WebGPU | Browser GPU API named for display of that emulator. Not a power meter. |
| Alchitry Pt V2 | Intended later board (vendor: Artix-7 XC7A100T). Not measured. |
| Analytical energy estimate | Operation count times a named constant. Modeled. Not board-measured. |
| Direct rebound | Extra use of a service when its effective price falls, on the same service (Gillingham, Rapson, and Wagner). |
| Modeled / simulated / board-measured | Formula, program execution, or meter. This paper's new numbers are none of the three; its empirical content is citation of published series and documents. |

Scope. Section 2 reviews satiation theory, task automation, attention markets, technology-cycle evidence, and inference prices. Section 3 writes predicates and says which were not estimated. Section 4 lists claims that rest on citations or on the companion's software demo, and separates them from design rules. Section 5 answers rebound, care costs, and military demand. Section 6 lists threats to validity. The commit mechanics and toy measurements live in the companion paper, "Notational Intelligence as Commit Law."

## 1. Introduction

A demand curve with constant positive slope in "intelligence" will recommend more seats, more tokens, and more agents after a job is finished. That recommendation is a modeling choice. It is not a theorem about work. Standard consumer theory allows marginal utility to decline and to cross zero. If a chore has a completeness predicate, the relevant question is whether more model output changes that predicate. If it does not, extra output is a cost with no increment on the objective that was written down.

The recent price evidence points the other way from scarcity of synthesis. Epoch's series show the money price of a given benchmark performance falling quickly. Open weights and typed decision procedures, including System One, are additional routes by which a previously scarce generation step becomes cheap. Teams that price a closed chore as if synthesis were still scarce are using a stale constraint.

The constraints that do not follow from a price series are physical and institutional. Computation dissipates energy. Horowitz (2014) documents that data movement and memory dominate practical CMOS energy, at scales far above Landauer's ideal erasure bound. An actuator is not a token. A signature, a clinical handoff, and a payment are not reversed by sampling another paragraph. Baumol (1967) showed how sectors with weak productivity growth can absorb a rising share of expenditure. Acemoglu and Restrepo (2019) model automation as task displacement plus the possible creation of new tasks. None of these results says that a language model ends cost disease. They do say that "more capability" is not a sufficient description of value.

This paper's positive claim is definitional and bibliographic. Satiation is a coherent object. Published prices for inference have fallen sharply. Engagement metrics are not completeness metrics. The software reference can represent a refuse for "do not spend" and a refuse for "do not move" as different reason codes on one decision. The negative claim is equally important. This paper does not identify a structural demand system, does not estimate rebound, and does not report board energy.

## 2. Related work

### 2.1 Satiation and bliss points

Andersen (2001) treats satiation inside an evolutionary model of structural change, not as a verbal preference. The durable element for this paper is the economic one: marginal valuation of a good can reach zero. Textbook bliss points make the geometry explicit. For a bundle `x*`, utility does not increase in a coordinate past `x*`, and a smooth representation can have negative marginal utility there. A quadratic illustration, `U(x) = -a (x - x*)^2` for `a > 0`, has a maximum at `x*` and a negative derivative beyond it. That function is a model used to teach the definition. It is not fitted to agent logs in this study. No coefficient `a` is reported.

The operational translation requires a predicate the model does not know unless someone states it. Let `C(z) = 1` when the written completeness test for episode `z` holds, else 0. Satiation on that episode means there exists a time `t*` such that `C` is 1 at `t*` and additional model calls after `t*` leave `C` unchanged. Economic done is the event `C` becomes 1. This is a definition. It becomes an empirical claim only with a labeled set of episodes and a detector whose errors are counted. Section 4 does not contain that count.

### 2.2 Tasks, displacement, and cost disease

Baumol (1967) analyzes unbalanced growth. If one sector's productivity rises and another's does not, the relative cost of the stagnant sector rises, and it can dominate expenditure even when its quantity grows slowly. Health care, education, and live performance are the usual examples. Later health-economics papers dispute magnitudes and mechanisms. This paper uses Baumol for a negative instruction: do not infer, from a fall in token price, that care has become a software good. Care remains dependent on time, trust, and liability in the ordinary institutional sense. A documentation model can increase recorded activity, which is a Baumol-relevant ambiguity: measured output can move while the care predicate does not.

The labor literature associated with David Autor decomposes jobs into tasks that machines may or may not perform. This archive does not pin a single Autor article as the source, so this paper does not attribute a quotation or a table to a specific Autor paper. The pinned statement is Acemoglu and Restrepo (2019), "Automation and New Tasks: How Technology Displaces and Reinstates Labor," Journal of Economic Perspectives 33(2), https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3. They argue that displacement reduces labor's task share and that new tasks can restore it. A completeness-oriented stop is closer to finishing a task than to creating a new engagement task. An agent loop with no stop can raise activity measures without a productivity gain. That possibility is consistent with their warning about weak automation. It is not a parameter estimated here.

### 2.3 Attention and engagement

Wu's book "The Attention Merchants" (publisher page: https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/) describes businesses that harvest attention and resell it. The Center for Humane Technology's overview of the attention economy (https://www.humanetech.com/youth/the-attention-economy) is an advocacy summary of the same pattern, not a trial. The inference used here is limited. If a product's objective is time on task, then a session that continues after `C = 1` can look successful. If the objective is `C`, the same session is waste or harm. The two objectives are not observationally equivalent in a token log. No experiment in this paper estimates the welfare gap.

### 2.4 Historical cycles

Technology markets often show a speculative phase, a use phase, and a later commodity phase. The evidence is uneven, and this paper does not treat the sequence as a law of nature.

Quinn (2019), "Technological revolutions and speculative finance: evidence from the British Bicycle Mania," Cambridge Journal of Economics 43(2), 271-294, https://doi.org/10.1093/cje/bey029, studies cycle-share prices from 1895 to 1900. Prices rose by over 200 percent and then fell by more than 75 percent. The paper's result is about speculative finance and fundamentals, not about a measured "enough bicycle" predicate for households. Using it as a picture of race-phase finance is supported. Using it as a proof of transport satiation is not. Earlier notes in this project sometimes said "Quinn and Turner" for this episode. The verified article above is Quinn (2019). A different Quinn article on cornering risk thanks John Turner in the acknowledgments. That is not coauthorship of the Cambridge Journal paper. This paper cites the article that was checked.

Cars, scheduled aviation, and television have commodity-like markets in the everyday sense: used vehicles, yield-managed seats, and panels sold as inputs to content. This paper does not cite a single identification study that pins a bliss point for each of those goods. The rows are historical orientation. They are not regressions. Airline yield management after deregulation is a pricing institution for a seat, which is evidence of a commodity market in seats, not evidence that passengers' demand for travel is globally satiated.

Pew Research Center's mobile fact sheet (https://www.pewresearch.org/internet/fact-sheet/mobile/) is the saturation source used for phones. The project archive records U.S. smartphone ownership near 91 percent in the 2024 and 2025 fact-sheet readings. A reader who quotes the figure should open the live sheet, because fact sheets are revised. High ownership is evidence of diffusion. It is not, by itself, evidence that marginal value of another phone camera is zero.

The digital-chore row is the one this paper defends with a price series rather than with an analogy. See Section 4.2.

### 2.5 Inference prices and open weights

Epoch AI (2025), "LLM inference price trends," https://epoch.ai/data-insights/llm-inference-price-trends, reports price declines at fixed performance on the order of 9 to 900 times per year across benchmarks in that note. Emberson and Roodman for Epoch AI (2026), "The plunging price of thought," https://epoch.ai/publications/the-plunging-price-of-thought, report about a 47 percent decline per quarter in the cost of a given performance since about 2023, summarized as about 13 times per year, faster near the frontier. These are the authors' summaries of their data. This paper does not re-estimate the index. The economic reading is narrow: the money price of synthesis for a fixed measured performance has been falling fast. A falling supply price shifts quantity demanded if demand is elastic. It does not create a new completeness predicate, and it does not set the energy price to zero.

System One-class tools are relevant as a mechanism for a further price cut on decision problems with a known option set. The Laya product page describes that product class. It is not a completeness evaluation.

A planning rule of thumb that frontier competence reaches cheaper devices in about six months is not a measured constant in this archive. This paper does not use it as a law. Distillation, quantization, and table-lookup inference (Ma et al., 2024; Wei et al., 2024) are published mechanisms by which a given competence can move to cheaper hardware. The speed is an empirical question per model pair.

### 2.6 Physical cost

Landauer (1961) bounds erasure. Bennett (1973) shows reversible computation can avoid that bound in theory. Horowitz (2014) is the practical CMOS statement: energy per operation and energy of data movement set the design constraint, at many orders of magnitude above `kT ln 2` for irreversible CMOS logic. The companion paper's OpCounter implements `J = sum count * E` with constants such as `E_LUT_READ = 1e-12` joule. Those constants are a model. The companion states the seed-1 analytical total, 8.6795e-10 joule, for a toy episode. Importing that number into a demand paper would not show that post-done spend is large. It would show only that the toy gate's model returned that total. This paper therefore does not treat the companion's joule as a satiation measurement.

Goldman Sachs published a research note titled "Gen AI: Too Much Spend, Too Little Benefit?" (https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit). The existence of a major sell-side note that questions infrastructure spend relative to benefit is a document fact. Dollar figures inside the note are not quoted here. They were not re-read from the primary PDF for this draft, and sell-side estimates are not a scientific energy account.

### 2.7 Commit records as the interface, not the demand estimate

The companion paper specifies proposal, certificate, refuse reason, and commit decision. Compose modes include LUT allow and energy, with an optional CBF. Refuse reasons include `policy` and `budget_exceeded` as well as `energy_veto`. That taxonomy can represent economic done and physical refusal as different codes. Representation is not identification. A code that fires does not prove that a human was at a bliss point. It proves that the runtime classified the step under a rule someone installed.

## 3. Definitions and methods

### 3.1 Predicates

Let an episode be a sequence of model or tool calls `z_1, ..., z_T` together with a human-facing state. A completeness predicate `C` maps the episode prefix to `{0, 1}`. Examples that can be written without a model score:

- Work: tests pass and the change is merged; or the ledger discrepancy is zero; or the required fields of a report are filled and the report is filed.
- Care: the medication list matches the source, the receiving clinician has the note, and the safety checklist items that the institution marked critical are true.

`C` is not a probability. A detector that outputs a score still needs a threshold and an error table before it is a predicate in the sense of Section 4's missing experiment.

Economic done at time `t*` means `C = 0` on the prefix before `t*` and `C = 1` at `t*`, for the chosen test. Satiation relative to model calls means that for all `t > t*`, extra calls do not flip any clause of `C` from false to true. Calls that undo `C` are harm, not value. The definition does not say humans always know `t*`. It says that if no `C` is written, the satiation claim is not yet a statement about that product.

Free at the margin is a statement about money price. Let `p_t(q)` be the price of synthesis service `q` at date `t`. The archival price evidence is that `p_t` for fixed benchmark performance has fallen at the rates Epoch reports. Free at the margin means `p_t` is low enough that a seat license is a weak explanation of cost for that chore. It does not mean the integral of power over time is zero.

Refuse reasons in the reference:

```text
physical:  lut_veto, energy_veto, cbf_veto
economic:  budget_exceeded, policy
```

The set-union in words is: the runtime refuses if the economic rule fires or the physical rule fires. The implementation is a certificate, not a sentence. Details of the physical conjunct are in the companion, including the seed-1 simulation and the Safe fixed-point residual.

### 3.2 What was done in this study

This study is a structured reading. Sources are the citation spine checked in the project on 29 to 30 September 2026, the satiation notes, and the companion's software record. No new price index was built. No chore corpus was labeled. No agent was instrumented. No FPGA was synthesized. Methods that would make the operational definition empirical are listed in Section 3.3 so they are not confused with results.

Design rules in Section 4.4 are recommendations conditional on the definitions. They are not estimated treatment effects. A reader can reject a rule without rejecting Epoch's price series, and can accept the price series without accepting a product recommendation.

### 3.3 Measurements specified and not taken

1. Split account. For each episode, sum analytical or, later, board-measured energy on calls with `t <= t*` and on calls with `t > t*`. Direct rebound on that chore is visible only if the post-done integral is estimated. The repository does not contain this split.
2. Detector errors. On a labeled corpus, false done (predicate declared true when a clause is false) and false continue (`C` true and the system keeps calling). No rates are published here.
3. Care handoff. Time to safe state and a handoff checklist, contrasted with session length. Not measured.
4. Segment table. Which products have a short `C` and which are open-ended research or adversarial races. Not estimated. The military case is excluded from the satiation claim in Section 5 rather than forced into it.
5. Board energy. Stage C in Appendix B. Not done.

Until those exist, sentences about "overkill joules" are hypotheses. Sentences about Epoch prices are citations.

### 3.4 Illustrative episodes, not data

Support desk. Completeness: the customer's issue is resolved, the reply is sent, and the ticket state is Done. Further drafts do not change `C`. A token counter can still increment. The episode is a constructed example to show the variables. It is not a sample from a help desk.

Care handoff. Completeness: critical fields filled, medication list reconciled, receiving party confirmed, person in a safe state. Session length is a different variable. The episode is constructed. No hospital dataset was analyzed.

Coding chore. Completeness: the artifact matches a written oracle (tests, or a bit-exact check). Regenerating a passing artifact does not raise `C`. The companion's LUT check is an instance of a written oracle for a gate, not an instance of economic satiation.

### 3.5 Instrument path for the physical residual

When a claim is about joules, the measurement class has to be named. The companion defines three stages.

Stage A, existing: Rust simulation and Icarus Verilog simulation. Analytical energy only.

Stage B, shipped: WASM compilation of the decision core and a WebGPU view of the LUT and the commit trace, at https://research.openie.dev/living/fpga-sim/. WebGPU time is not energy. Acceptance is agreement with stage A on published episodes (seed-1: committed 1, refused 15, analytical J 8.6795e-10).

Stage C, board programmed for the companion's commit-gate demo; energy still unmetered. The Alchitry Pt V2 has no onboard joule meter. UART decision agreement is not a watt reading. Vendor specifications on SparkFun's page (XC7A100T-2FGG84I, 101,440 logic cells, 240 DSP48E1 slices, 4,860 Kb block RAM, 256 MB DDR3L) are not DUT energy results. Metering methods: companion guide [/living/fpga-sim/alchitry/#energy](https://research.openie.dev/living/fpga-sim/alchitry/#energy).

This paper adds a mapping, not a fourth stage. Economic done, if encoded as `policy` or `budget_exceeded`, should appear in the same trace as `energy_veto`, so a future split (Section 3.3) can group reason codes. The browser view would make that grouping readable. It would not create the missing corpus. We have not synthesized or metered the FPGA board.


### 2.8 Fidelity criteria and stop rules

Shannon (1959) defines a rate-distortion function: the least description rate that holds expected distortion at or below a chosen fidelity. The object is communication under a constraint the user states. It is not a demand curve for intelligence. The resemblance to this paper is only structural. A completeness predicate `C` is a hard fidelity: either the stated clauses hold, or they do not. A language-model loss is closer to an average distortion on a training distribution. Falling loss, and falling price at a fixed benchmark, can be read as movement along a rate-resource curve of the kind Kaplan et al. (2020) and Hoffmann et al. (2022) estimate for training. That movement does not choose `C` for a particular chore. Confusing benchmark distortion with chore completeness is the category error behind unbounded-seat plans for closed work.

Cover and Thomas (2006) is the textbook path into rate-distortion if a reader wants the formal development. This paper does not estimate an `R(D)` for any agent. It uses the existence of the fidelity concept to keep two numbers apart: a score that can always be improved by a fraction, and a predicate that is already true.

### 2.9 Rebound taxonomy, without a new estimate

The rebound survey of Gillingham, Rapson, and Wagner separates channels that a single slogan collapses. Direct rebound is additional use of the same service when its effective cost falls. Indirect rebound is spending of saved resources on other services. Economy-wide rebound runs through prices and growth. The survey's policy domain is energy efficiency, not tokens. The taxonomy still transfers as a warning about identification. A measured fall in `p_t` (claim S-2) identifies none of the three channels by itself. Direct rebound on a chore with `C` already true requires that buyers still pay for calls that do not change `C`. Indirect and economy-wide channels can be large when new tasks appear (Acemoglu and Restrepo, 2019). A paper that reported one elasticity and called it "the rebound" would be under-specified. This paper reports no elasticity.

## 3.6 Protocol for a done-detector study (not executed)

The following protocol is a method for a future measurement. No step has been run. It is written so the missing result has an exit criterion rather than a slogan.

Population. Episodes drawn from one product surface, not a mix of open-ended research and ticket closure. Each episode has a written `C` with finitely many clauses, each clause observable by a person who did not operate the model. Target size is a design choice; this paper does not pretend a power calculation was done. A first usable table needs enough positives and negatives that a rate is not a single anecdote. The archive does not contain that table.

Label. Two annotators mark each clause true or false at the time the system first declares done, and again at the end of the session. Disagreements are adjudicated and counted. The detector's decision is recorded separately from the label.

Primary rates.

- False done: system declares `C = 1` while any critical clause is false.
- False continue: all critical clauses are true and the system issues further model or tool calls.
- Session length and call count are covariates, not endpoints.

Secondary split, only if an energy account exists. Sum energy, analytical or board-measured, on calls before the adjudicated `t*` and after it. State the measurement class in the same sentence as the number. An analytical OpCounter total is not a substitute for a meter and is not comparable to Horowitz's tables.

Exclusion. Episodes with no written `C` are not labeled "unsatiated." They are out of scope. Adversarial episodes are out of scope for the satiation endpoint and may still be scored for physical refuse if a certificate is present.

Failure of the protocol. If annotators cannot agree on clauses, the predicate was not written. If the system has no declare-done event, false continue is not identified. Publishing a model leaderboard instead of the two rates would not execute this protocol.

### 3.7 A numerical illustration of a bliss point (model, not a fit)

Let one coordinate `x` be the count of model calls on a single chore, and set

```text
U(x) = -(x - 4)^2
```

for a chore whose constructed maximum is at four calls. Then `U(0) = -16`, `U(4) = 0`, `U(8) = -16`. Marginal utility is `dU/dx = -2(x - 4)`, which is positive before 4, zero at 4, and negative after. The illustration uses integers so the sign change is visible without a fit. No dataset was used to choose 4. Replacing 4 with another integer moves the peak and does not change the definition. A product metric equal to `x` ranks `x = 8` above `x = 4`. A product metric equal to `U` does the reverse. Claim S-3 is this non-identity, here in a fully specified toy function, and in Section 3.4 in constructed episodes. Neither is a welfare estimate for a firm.

Token price can be attached without confusing units. Suppose a call costs `p` in money and the buyer pays `p * x` while value follows `U`. The buyer's surplus proxy `U(x) - p x` still has a finite maximizer for any `p >= 0`. A fall in `p` moves the maximizer, which is the rebound logic on this toy, and the maximizer remains finite. The toy does not say where the maximizer sits for any real buyer. It blocks the inference that a lower `p` removes the maximum.

### 3.8 Reason codes as a partition, not a welfare function

Let `R` be the set of refuse codes on a trace. Partition `R` into `R_econ = {policy, budget_exceeded}` and `R_phys = {lut_veto, energy_veto, cbf_veto}`, matching the schema's taxonomy. Other codes, if added later, have to be assigned in writing before they are counted. A trace interval contributes to post-done economic refuse only if `C` is already 1 and the code is in `R_econ`. It contributes to physical refuse if the code is in `R_phys`, whether or not `C` is 1. An unsafe action after done is in both stories and should be counted in both columns, not averaged. The MCP demo's irreversible refuse is a physical example: energy and barrier codes, executor calls 0. It is not an `R_econ` example. A future episode with `policy` after a merged patch would be the economic example. The repository does not include that episode. The partition is how it would be scored.


## 4. Evidence

### 4.1 Claim S-1. Satiation is a defined economic object

Andersen (2001), https://doi.org/10.1007/PL00003852, and the textbook bliss construction in Section 2.1 support S-1. The claim is theoretical. It is not a measured utility function for any user population in this study.

### 4.2 Claim S-2. Published inference prices fell sharply at fixed performance

Supported by Epoch AI (2025) and Emberson and Roodman (2026), with the magnitudes those notes state (Section 2.5). The claim is about price indices those authors publish. It is not a claim that every organization's invoice fell by 13 times, and it is not a claim about watts.

### 4.3 Claim S-3. Engagement variables are not the completeness predicate

Supported by the definitions in Section 3.1 and by the attention literature's description of time-on-task objectives (Wu; Center for Humane Technology overview). No causal estimate of welfare loss is claimed. The logical claim is non-identity of the variables: token count can increase while `C` stays constant. The constructed episodes in Section 3.4 are illustrations of non-identity, not datasets.

### 4.4 Claim S-4. Bicycle-mania prices detached from a simple fundamental story

Supported by Quinn (2019): rises over 200 percent and subsequent falls over 75 percent in cycle shares, 1895 to 1900, not fully explained by fundamentals or by a simple risk shift in that paper's tests. The claim stops there. It does not quantify household satiation for bicycles.

### 4.5 Claim S-5. U.S. smartphone ownership is high in the cited fact sheet

The project archive's reading of Pew's mobile fact sheet is ownership near 91 percent for the 2024 and 2025 rows. The claim used in this paper is diffusion at that order, conditional on the live sheet matching the archive. It is a saturation fact about ownership, not a bliss-point estimate.

### 4.6 Claim S-6. Care is not priced as a pure software good by the Baumol framework

Baumol (1967) supplies the framework. Acemoglu and Restrepo (2019) supply the task language. The claim is that these frameworks do not imply an end to care's labor, trust, or liability requirements when token prices fall. The claim is not a forecast of health-care expenditure.

### 4.7 Claim S-7. A sell-side note questions spend versus benefit

The Goldman Sachs page named in Section 2.6 exists and frames the question in its title. No numeric extract is a result of this paper.

### 4.8 Claim S-8. The reference can encode both stop types

Schema and demo evidence are in the companion. `policy` and `budget_exceeded` are reason codes in the refuse taxonomy. `energy_veto` is demonstrated in `artifacts/mcp_gate_demo.json` and in `commit_decision_refuse.json`, where a true LUT allow still refuses and sets plant action to zero. The MCP refuse case does not call the executor. Those are software facts about the reference. They do not show that any firm has reduced post-done spend.

### 4.9 Claim S-9. Physical law is not priced to zero by Epoch

Landauer (1961) and Horowitz (2014) support a permanent gap between an ideal erasure bound and CMOS practice. The companion's analytical model is a third object, neither the bound nor a board. S-9 says only that a citation of Epoch does not discharge a citation of Landauer. No numerical ratio of accelerator energy to `kT ln 2` is computed in this paper, because that ratio would require a stated device, workload, and temperature, which were not measured.

### 4.10 Design rules, marked as design

These rules follow if one accepts the definitions and wants a product that optimizes `C` rather than tokens. They are not effects.

1. Write `C` before adding model capacity.
2. Treat a synthesis price moat as temporary when Epoch-type series and open weights apply to that chore.
3. Do not describe stage A analytical joules, stage B WASM traces, or an unmetered FPGA as free energy.
4. Prefer a detector of `C` with an error table over an unlabeled increase in model size, once the chore is the product.
5. Keep physical permission on the certificate defined in the companion whenever the call is irreversible.
6. Report pre-done and post-done energy separately when the split exists. It does not exist yet.
7. Do not apply the satiation predicate to adversarial or military races (Section 5.3).
8. If the product's objective is attention, say so. The completeness claims then do not apply.

Kill tests for a roadmap, also design: a plan that assumes unbounded appetite for a chore with a short `C`; a price that requires permanent synthesis scarcity and no physical or liability wedge; a safety story that uses only a confidence string; a "free" claim that deletes joules; an agent loop with no `C`.

### 4.11 What would be a result and is not

A table of false-done and false-continue rates. A time series of calls after `t*`. A meter reading on the Alchitry Pt V2. A structural rebound estimate. An AGI price premium estimated on a satiated chore. None of these appear in Section 4's supported claims.


### 4.12 Non-identity, stated as a comparison of objectives

Let `x` be call count, `s` session length, `J_pre` and `J_post` energy before and after adjudicated done, and `C` the predicate. The following implications are definitional.

| Observation | Does not imply |
|-------------|----------------|
| `x` increased | `C` increased |
| `s` increased | welfare increased |
| `p` fell (S-2) | `J_post = 0` |
| `C = 1` | the detector's error rate is known |
| physical refuse fired (S-8) | the chore was economically done |
| ownership of phones is high (S-5) | marginal value of another model call is zero |
| cycle-share prices boomed and busted (S-4) | households reached a transport bliss point |

The right-hand column is the list of inferences this paper refuses. Each left-hand observation is either a citation in Section 4 or a variable in Section 3. The table is the discussion compressed into a check. A draft that asserts a right-hand sentence has left the evidence.

### 4.13 Companion quantities that stay in the companion

For cross-reading only, the companion reports a seed-1 pendulum simulation: 1 commit, 15 refuses, analytical energy 8.6795e-10 joule, and a Safe check with zero false allows on its stated grid. Those quantities answer a control question. They are simulated. They use the analytical constants in the companion. They are listed here so a reader does not import them as S-claims. Satiation would use them only inside the unexecuted split of Section 3.3, and only with the measurement class written beside the number.


## 5. Discussion

### 5.1 Rebound

Gillingham, Rapson, and Wagner survey rebound from energy-efficiency policy. The mechanism is residual demand elasticity. If the money price of synthesis falls, use rises where buyers still value another unit. At a bliss point for a closed chore, the direct derivative of value with respect to more synthesis on that chore is not positive, so direct rebound on that chore is not implied. Indirect rebound, new tasks, and attention shifting can remain. Acemoglu and Restrepo's new-task margin is one place quantity can reappear. Claim S-2 therefore does not imply a global cap on compute. It implies a cap only relative to a stated `C`. Denying global rebound would require the split in Section 3.3 and a demand system. This paper does not deny global rebound. It refuses to treat "Jevons" as a reason to avoid writing `C`.

### 5.2 Status and creative goods

Some goods are valued because they are not finished: status, open-ended art, research whose `C` is not a finite checklist. The definition in Section 3.1 does not force a bliss point onto those goods. It forces a segmentation. A finite chore and an open-ended practice can be sold by the same firm and should not share a demand assumption. Pricing a finite chore as if it were an open-ended capability race is a category error, not a finding about AGI.

### 5.3 Adversarial demand

If the other party's gain is this party's loss, "enough" is not defined by a local checklist. Arms races and some security contests are in that class. This paper does not claim satiation there. Physical commit constraints can still apply: an unsafe action can be refused while the strategic demand remains open. Scope is part of the claim, not a footnote that cancels it.

### 5.4 Incomplete knowledge of done

People misjudge completion. Detectors will false-done and false-continue. That is an argument for measuring detector error, which Section 3.3 lists as missing. It is not an argument that session length is a substitute for `C` in a domain where a missed handoff has a liable party. Where no predicate can be written, this paper's operational claim is silent.

### 5.5 Baumol is not solved

A model that drafts a note faster can raise throughput of notes and leave examination, judgment, and responsibility with a person. Expenditure shares can still move as Baumol described if the human residual does not speed up. Saying otherwise would be a forecast this bibliography does not contain. The permitted statement is S-6.

### 5.6 Free synthesis is not free actuation

Stage A joules are modeled. Stage B would be simulated in a browser. Stage C would be board-measured and is future. An actuator command is the companion's commit bit. Epoch prices sit on a different axis from all three. Collapsing them into "free AI" deletes the measurement class. The WASM and WebGPU path is useful because it lets a third party replay the decision trace without owning the Alchitry board. Usefulness as a replica is not a watt.

### 5.7 Confidence is not a certificate

A high score can order proposals. The companion's refuse examples show a passing LUT bit with a failing energy predicate and a plant action of zero. That is the physical half of the union. The economic half is a `policy` or budget reason when `C` is already 1. Neither half is a softmax entry.

### 5.8 Sell-side skepticism is not a measurement

S-7 prevents a literature review from ignoring a major public doubt about spend and benefit. It does not let a research note replace a meter or a demand estimate. If the note's figures are quoted later, the primary PDF has to be the source, and the label is sell-side estimate.


### 5.9 What a structural demand estimate would require

S-2 is a supply-price fact from secondary published series. A demand estimate is a different regression. At minimum it needs a quantity (calls, tasks closed, or both), a price, and a way to separate movement along a demand curve from movement of the curve. Epoch's benchmark price is not a firm-level invoice, and a firm's invoice is not `C`. Linking them requires a panel this study does not have: accounts that record price paid, calls made, and an adjudicated completeness label on the same episode. Without that panel, the slope of demand after `t*` is not identified. The toy surplus in Section 3.7 shows only that a quadratic bliss point keeps a finite optimum as `p` falls. It is not the missing regression.

Segmentation belongs in the same design. Code each product as finite-`C` or open-ended before pooling. Pooling a ticket desk with an open research tool averages two demand regimes and can manufacture an appearance of unbounded appetite. The military exclusion in Section 5.3 is the same rule applied to a domain where the opponent's objective prevents a local bliss point. A table with those codes, even with no prices yet, would be more informative than a single total-addressable-market number. The table was not built.

### 5.10 Why no multiple of `kT ln 2` is stated

Landauer's result is an inequality for an idealized erasure at temperature `T`. Horowitz (2014) reports energies for particular CMOS operations and for memory traffic, in picojoules, under the assumptions of that tutorial. Dividing one by the other produces a number only after someone chooses the operation, the activity factor, the temperature, and the device. None of those choices was measured on an OpenIE workload. The companion's constants, beginning at `1e-12` joule per LUT read, are not Horowitz's numbers and are not a count of erased bits. Stating a fold above the Landauer bound would pretend those choices had been made. The scientific statement is the inequality direction: practical irreversible CMOS in Horowitz's account sits far above the bound, and a price index does not move a device onto the bound.


## 6. Limits and threats to validity

Construct validity. Operational satiation depends on `C`. A hostile or vague `C` makes the predicate arbitrary. The paper's defense is to require `C` to be written in observable clauses. Many real products do not have that writing yet. For those products the theory does not yet apply empirically.

Internal validity of the price claim. S-2 inherits whatever identification Epoch used (quality adjustment, benchmark choice, posted prices versus realized invoices). This paper did not audit the microdata. A revision of Epoch's series would revise S-2's magnitudes and might not revise the direction. S-2 should be re-read against the primary pages before it is used as an executive figure.

External validity. Work and care, as defined, exclude military rivalry and may exclude research. Phone ownership does not transfer to agent products. Bicycle share prices do not transfer to software margins. The constructed episodes are not a sample.

Measurement validity. No split joules, no detector confusion matrix, no DUT. The companion's false-allow counts are about a pendulum oracle, not about economic done. Importing them as evidence of satiation would be a category error. Vendor FPGA specifications are not energy.

Omitted variable. New tasks can absorb spending released by cheap synthesis. Section 5.1 states this. A roadmap that treats per-chore satiation as a forecast of aggregate compute demand is not licensed by this paper.

Publication bias and document type. Wu is a book. The Humane Technology page is advocacy. Goldman Sachs is sell-side. Quinn and Epoch and Baumol and Acemoglu and Restrepo and Landauer and Horowitz are the load-bearing citations, and they support different sentences. The paper's structure is an attempt to keep those sentences from being averaged into a mood.

Falsifiers. S-1 fails if the cited theory does not contain a zero marginal-utility region. It does. S-2 fails if the primary Epoch pages do not report declines of that kind. S-8 fails if the schema has no economic reason codes or if the cited JSON does not refuse. A future labeled corpus in which extra calls after a correct `C` systematically raise an independently specified value would falsify satiation for that corpus. One such corpus would not falsify the definition. It would bound its domain.



The same discipline applies to vendor FPGA specifications. SparkFun lists logic cells, DSP slices, block RAM, and DRAM capacity for the Alchitry Pt V2. Those quantities describe a catalog part. They do not describe switching activity, static power, or the energy of a commit trace. A later DUT report has to name the bitstream, the clock, the workload, the meter, and the duration. Until that report exists, the board is a planned instrument, and the browser emulator is a planned replica of the software decision, not a preview of the meter.

## 7. Conclusion

Satiation is a standard object in the theory cited, and it has a narrow operational form: a written completeness predicate that extra synthesis does not advance. Epoch's published series document a sharp fall in the money price of fixed-performance inference. That fall supports a free-at-the-margin description of digital chores and does not support free joules, free plant motion, or the end of care's cost structure. Bicycle share prices, smartphone diffusion, and attention markets are weaker and stronger in the specific ways Section 4 states. The commit reference can store an economic refuse and a physical refuse as different reasons. The physical side is simulated in the companion and is not board-measured. A WASM and WebGPU emulator replicates the trace in a browser at https://research.openie.dev/living/fpga-sim/ and remains a simulation. An Alchitry Pt V2 meter would be a different, later measurement. The missing scientific objects are a labeled done detector, a pre-done versus post-done energy split, and a demand estimate that can see rebound. Until they exist, the paper's empirical content is the cited record, and its formal content is the predicate.

## References

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Acemoglu, D., and Restrepo, P. Automation and new tasks: how technology displaces and reinstates labor. Journal of Economic Perspectives 33(2), 2019. https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3

Ames, A. D., et al. Control barrier functions: theory and applications. ECC 2019. https://doi.org/10.23919/ECC.2019.8796030

Andersen, E. S. Satiation in an evolutionary model of structural economic dynamics. Journal of Evolutionary Economics, 2001. https://doi.org/10.1007/PL00003852

Baumol, W. J. Macroeconomics of unbalanced growth: the anatomy of urban crisis. American Economic Review 57, 415-426, 1967.

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Center for Humane Technology. The attention economy. https://www.humanetech.com/youth/the-attention-economy

Emberson, L., and Roodman, D. / Epoch AI. The plunging price of thought. 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

Epoch AI. LLM inference price trends. 12 March 2025. https://epoch.ai/data-insights/llm-inference-price-trends

Gillingham, K., Rapson, D., and Wagner, G. The rebound effect and energy efficiency policy. Review of Environmental Economics and Policy. Working text: https://gwagner.com/wp-content/uploads/Gillingham-Rapson-Wagner-2015-Rebound-Effect.pdf

Goldman Sachs. Gen AI: too much spend, too little benefit? https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit

Horowitz, M. Computing's energy problem (and what we can do about it). ISSCC 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models. https://laya-ai.com/system-one-models

Ma, S., et al. The era of 1-bit LLMs. arXiv:2402.17764.

Pew Research Center. Mobile fact sheet. https://www.pewresearch.org/internet/fact-sheet/mobile/

Quinn, W. Technological revolutions and speculative finance: evidence from the British Bicycle Mania. Cambridge Journal of Economics 43(2), 271-294, 2019. https://doi.org/10.1093/cje/bey029

SparkFun. Alchitry Pt V2. https://www.sparkfun.com/alchitry-pt-v2.html

Wei, J., et al. T-MAC. arXiv:2407.00088.

Wu, T. The Attention Merchants. Knopf. https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/

Companion measurement record: Charlot, "Notational Intelligence as Commit Law," this repository. Software logs: `artifacts/RESULTS.md`, `artifacts/mcp_gate_demo.json`, `artifacts/schemas/wca.commit.v1/`.

## Appendix A. Decision rules and non-results

| Id | Statement | Class |
|----|-----------|-------|
| R1 | Write the completeness predicate before adding capacity. | Design |
| R2 | Expect synthesis price moats to erode where Epoch-type evidence applies. | Design, conditional on S-2 |
| R3 | Do not claim free energy or free actuation. | Constraint from S-9 |
| R4 | Separate economic reason codes from physical reason codes. | Software fact, S-8, plus design |
| R5 | Publish detector error rates before treating a stop as accurate. | Not yet a result |
| R6 | Split energy before and after done. | Not yet a result |
| R7 | Keep adversarial races outside the satiation claim. | Scope |
| R8 | Re-read Pew and Epoch primaries before quoting a finer magnitude. | Method |

No row above is a board measurement.

## Appendix B. Reproducibility and the emulator

This paper has no independent binary. Reproduction of cited software facts:

```text
cargo run --release --bin wca-mcp-gate -- --demo
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

Expect, from the companion's recorded logs: demo refuse with executor calls 0; seed-1 committed 1, refused 15, analytical energy 8.6795e-10 joule. Those outputs do not estimate satiation.

Browser instrument, shipped as Stage B at https://research.openie.dev/living/fpga-sim/, shared with the companion's Appendix B. The decision core runs in WASM. WebGPU paints the LUT image and the commit trace. Diff the trace against the Rust JSON. Do not convert GPU timestamps to joules. Do not mark the Alchitry Pt V2 as measured. Vendor page: https://www.sparkfun.com/alchitry-pt-v2.html. Synthesis plus a meter is Stage C, a later study.

Factual repository flag: `board_synth_claimed=false`.

## Appendix C. Claim map

Supported now: S-1 through S-9, with the scope sentences in Section 4.

Not supported: an end to Baumol cost disease; free plant motion; satiation of military demand; a numerical global rebound of zero; Landauer-scale operation of a language model; board watts; an AGI price as a fact about satiated chores; a universal distillation lag; silicon performance leadership.

Open measurements: Section 3.3.
