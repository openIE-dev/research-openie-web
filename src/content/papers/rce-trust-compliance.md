---
title: "The Trust & Compliance layer — SOC2, and usable in every sector"
deck: "25 Nov 2026. 'we must also ensure that we can pass all the SOC2 and compliance that builds and"
id: rce-trust-compliance
status: "Research note · open topic"
author: "David Charlot, Open Interface Engineering"
figures: ""
pdf: ""
board_metered: false
---

# The Trust & Compliance layer — SOC2, and usable in every sector

*25 Nov 2026. "we must also ensure that we can pass all the SOC2 and compliance that builds and
garners trust… so we can be used in all areas of the planet (government, military, industrial,
enterprise, consumer, hobbyist, maker, tinker)." Built `trust.rs` + tests, merged to
openIE-dev/rce main. The Cleanroom business pitch is a separate artifact (cleanroom-pitch.html).*

## Why trust is the moat

For Cleanroom to serve government/military/enterprise through hobbyist/maker, it must carry
verifiable trust. RCE already embodies the hard part of SOC2 **Processing Integrity**: every output
is replay-verified before use, every figure carries provenance (Modelled/Reported/Measured, never a
fabricated 0), and the audit log is hash-chained (tamper-evident). The trust layer makes this
explicit as compliance evidence.

## The SOC2 control map (`trust.rs`)

| Criterion | Control | RCE mechanism | Built |
|---|---|---|---|
| Security (CC) | CC6.1 logical access | admission gate: only replay-verified competence enters | ✓ |
| Security | CC7.2 audit trail | hash-chained log; any edit breaks the chain | ✓ |
| Security | CC7.3 anomaly detection | forged/non-reproducing record refused at border | ✓ |
| Availability (A) | A1.2 recoverable execution | exact replay + CALM federation + tiered store | ✓ |
| Processing Integrity (PI) | PI1.1 correct & complete | replay gate + spectests, no vacuous pass | ✓ |
| Processing Integrity | PI1.2 provenance | D.11 tagging | ✓ |
| Confidentiality (C) | C1.1 protect code/data | private Cleanroom; name-free keys | ✓ |
| Confidentiality | C1.2 encryption at rest/transit | TLS + at-rest encryption | **gap** |
| Security | CC6.3 RBAC / least privilege | role-based access over catalog | **gap** |
| Privacy (P) | P3.1 no PII | name-free behavior hashes; retention/prune | ✓ |

`TrustLayer` records a tamper-evident audit chain, admits only verified acts, and `report()` returns
per-criterion satisfaction; `gaps()` lists the honest to-implement controls (encryption, RBAC).

## Falsifiers (tests/trust.rs)

- audit chain tamper-evident (edit breaks it);
- verified-only admission + Processing Integrity satisfied;
- honest gap list (C1.2, CC6.3);
- control map covers all five criteria.

## The business case (Cleanroom)

`cleanroom-pitch.html` (artifact): plain language, minimal points, max infographic — the $1T race
re-guessing known code; the inversion (AI at the airlock, 99.9% deterministic fab); wholesale cost
reduction (debug/test/eval eliminated by the gate); trust everywhere (SOC2); the investment ask
(fund the developers, own the substrate, win the race).

## Honest open items

Encryption at rest/in transit and RBAC (the two flagged SOC2 gaps); trained FormJEPA/FormEBM at
scale; a production tracing JIT. These are engineering scale, documented, not faked.

## Sources / grounding
- live: competence-catalog trust.rs + tests/trust.rs; SOC2 Trust Services Criteria (CC/A/PI/C/P).
- cleanroom-pitch.html artifact.