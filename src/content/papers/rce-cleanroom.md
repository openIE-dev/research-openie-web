---
title: "Cleanroom — everything that isn't coding"
deck: "25 Nov 2026. Corrected division: 'if RCE does all the coding itself, then cleanroom is taking care"
id: rce-cleanroom
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# Cleanroom — everything that isn't coding

*25 Nov 2026. Corrected division: "if RCE does all the coding itself, then cleanroom is taking care
of all of the other things that aren't coding related." **RCE = the coding engine; Cleanroom = the
controlled operational environment for everything else.** The deterministic fab is RCE's job;
Cleanroom is sovereignty, privacy, compliance, trust, ops, governance, adoption. Built pieces live
in competence-catalog + deploy, merged to openIE-dev/rce main.*

## BLUF

**RCE writes and verifies the code. Cleanroom runs the business around it** — data & software
sovereignty, privacy, compliance & trust, deployment & operations, governance, cost/FinOps,
monitoring & maintenance, and change management / adoption. A "clean room" is a controlled
environment: contamination (unverified code, data leaks, uncontrolled AI/listeners) is excluded.
RCE produces the code deterministically; Cleanroom operates it under control.

## The division

| RCE (coding) | Cleanroom (everything else) |
|---|---|
| Form IR, lift/emission, semantic bridge | data residency & sovereignty (`sovereignty.rs`) |
| gear ladder, gate, replay, crystallization | privacy: correction isolated from AI/listeners |
| world-model / JEPA inverse, RCE-SPEC | confidentiality: AES-256-GCM at rest, RBAC (`secure.rs`) |
| executor, JIT, heterogeneous placement | compliance/trust: SOC2 map, audit chain (`trust.rs`) |
| the deterministic fab (99.9% out-of-loop) | sovereign ingestion & dedup (`repo.rs`) |
| joule pricing (the cost signal) | FinOps/observability: fleet metering (`fleet.rs`) |
| — | deployment/ops: Dockerfile + compose (federated nodes) |
| — | governance, change management, adoption (strategy doc) |
| — | monitoring, maintenance, support, sector compliance |

## Context: the dark-factory inversion (why the fab is RCE's, the control is Cleanroom's)

The world's always-on agent factories (OpenAI software factory, StrongDM, Devin, Augment, Atlan)
keep the stochastic model *in* the loop as the worker, so cost scales with work. RCE inverts that:
the fab is deterministic (G0 LUT + replay-gated competence + placement), AI confined to the airlock
(intent→structure). That fab is **RCE**. **Cleanroom** is the controlled environment around it:
it excludes contamination — a model guessing in the loop, a listener exfiltrating code, an
unverified change, a non-sovereign data path — so the software and its data stay trustworthy and
owned. The code is made by RCE; the environment it lives in is Cleanroom.

## Built Cleanroom pieces (live on main)

- `sovereignty.rs` — Policy default fully isolated (no model/network/listeners); listeners blocked;
  every isolated correction audited. Data/software sovereignty + privacy.
- `secure.rs` — AES-256-GCM authenticated sealing (tamper-evident) + RBAC least privilege.
- `trust.rs` — SOC2 Trust Services Criteria map; tamper-evident audit; verified-only admission.
- `repo.rs` — sovereign repo ingestion: lift → isolated correct → dedup → admit-by-replay.
- `fleet.rs` — bare-metal metering per node + cross-node aggregation (FinOps/observability).
- `deploy/` — turnkey Dockerfile + compose (two federated nodes).
- `rce-adoption-strategy.md` — BLUF/SWOT/value-prop + change management & replacement theory
  (apathy is the killer; make the first win immediate and switching ~free).

## Sectors

government · military · industrial · enterprise · consumer · hobbyist · maker · tinker — each gets
the same controlled environment with the residency/compliance posture it requires.

## Honest open items

Production tracing JIT and trained FormJEPA/FormEBM at scale (RCE side); formal SOC2 audit
attestation and sector-specific certifications (Cleanroom side) are process/scale, not faked.

## Sources
- https://newsletter.pragmaticengineer.com/p/openai-software-factory
- https://www.augmentcode.com/guides/dark-factory-autonomous-software-delivery
- https://atlan.com/know/ai-agent/agentic-software-factory/
- https://law.stanford.edu/2026/02/08/built-by-agents-tested-by-agents-trusted-by-whom/
- live: competence-catalog {sovereignty,secure,trust,repo,fleet}.rs + deploy/; rce-adoption-strategy.md.