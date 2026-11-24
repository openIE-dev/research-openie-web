# OpenIE Artifact Substrate — Tri-Tier Licensing Hygiene Contract

Status: **Normative Policy (`v1.0.0`)**  
Repository License: **`Apache-2.0`** (all software, Rust crates, Python modules, JSON Schemas, `WAI1` adapters, and deterministic verification gate code in this repository).

---

## 1. Purpose

When artifacts move across formerly siloed properties—OpenIE Research Papers, Research TV, Research Radio, Interactive Tutorials, The Commons, the Free Humanoid Prior-Art Corpus, OpenLoco morphologies, and the Communication Tool Avalanche—licensing ambiguity is a structural bug. Every canonical OpenIE artifact MUST carry an explicit, machine-checked `license` field drawn from a closed three-license vocabulary:

```json
"license": "CC0-1.0" | "Apache-2.0" | "CERN-OHL-S-2.0"
```

Any artifact declaring a license outside this set, omitting `license`, or mixing incompatible license claims without explicit envelope separation is rejected at schema validation time before reaching publication.

---

## 2. The Three Sanctioned Licenses & Domain Boundaries

| SPDX Identifier | Target Artifact Classes | Rationale & Legal Effect |
| :--- | :--- | :--- |
| **`CC0-1.0`** | **Commons, Corpora, Summaries, Blueprints & Accessibility Layers**<br>• `humanoid_prior_art` (`free-humanoid-project` factual/prior-art records)<br>• `blueprint` (including the Unsiloeing Blueprint Document)<br>• `concept` (AAC Concepts, plain/Easy-Read layers, captions, audio descriptions)<br>• Factual metadata, bibliographic summaries, and public-commons media transcripts (`paper`, `tv`, `radio` commons records) | Maximizes frictionless global reuse, defensive prior-art citation, screen-reader/AAC redistribution, and multilingual adaptation without attribution stacking or share-alike lock-out. Factual prior-art metadata in `humanoid_prior_art` describes historical/public disclosures under `CC0-1.0` without claiming or granting third-party rights over underlying proprietary machines. |
| **`Apache-2.0`** | **Software, Compilers, Schemas, Benchmarks, Interactive Labs & `.WAI` Toolchains**<br>• `tutorial` interactive executable labs & benchmark harnesses<br>• Software-backed `paper` / engine artifacts (e.g., RCE, SATB, LUT-Adapt, `WAI1` container format & reference adapters)<br>• All code in `crates/openie-wai-adapter`, `crates/openie-gates`, and `python/openie_artifact` | Royalty-free copyright and explicit patent grant (Section 3) with defensive patent termination, aligning identically with the `.WAI` (`application/vnd.wai`) specification and modern open-source systems infrastructure. |
| **`CERN-OHL-S-2.0`** | **Physical Hardware, Silicon Packages, PCBs, CAD & Robot Morphologies**<br>• `humanoid_morphology` (including `free-humanoid-platform`, the 17th OpenLoco morphology: URDF/MJCF/STEP mechanical assemblies, actuator mounts, and sensor brackets)<br>• Open hardware reference designs (e.g., `MEI-JCP-Tag-v1` KiCad/Gerber/STEP packages) | CERN Open Hardware Licence Version 2 — Strongly Reciprocal ensures physical hardware designs, CAD assemblies, and actuator morphologies remain permanently open in the physical commons when modified and distributed, while keeping firmware/software interfaces cleanly separable under `Apache-2.0`. |

---

## 3. Envelope vs. Payload Separation (`WAI1` Transport Hygiene)

1. **Container Independence**: Every `WAI1` binary container (`application/vnd.wai`) is framed and decoded by `Apache-2.0` software (`openie-wai-adapter`). Encapsulating a `CC0-1.0` prior-art record or a `CERN-OHL-S-2.0` morphology inside a `WAI1` envelope is mere aggregation/transport and **never alters** the payload's license.
2. **In-Band License Binding**: Both the outer Canonical Artifact record (`license`) and the inner `WAI1` manifest (`openie_artifact.license`) carry the identical SPDX string, covered by the deterministic `BLAKE3` digest and `Ed25519` signature. Any mismatch between the outer record and inner `WAI1` manifest fails verification (`license_mismatch`).
3. **Derivative Lineage Rules**:
   - Accessibility layers (`plain_easy_read`, `audio_description`, `aac_concepts`, `captions`) and multilingual translations generated for public commons distribution carry `CC0-1.0` or inherit the parent artifact's open license without adding restrictive clauses (`NC`, `ND`, or proprietary terms are forbidden).
   - Prior-art entries documenting third-party patented or fictional robots (`humanoid_prior_art`) license **the OpenIE factual catalog entry and defensive prior-art analysis** under `CC0-1.0`, while explicitly preserving the historical `ip_status` metadata (`public-domain`, `open-permissive`, `patented`, `trade-secret`, `fictional`) inside the payload for accurate patent-landscape auditing.
   - Open hardware morphologies (`humanoid_morphology`, e.g., `free-humanoid-platform`) carry `CERN-OHL-S-2.0` for mechanical/CAD/kinematic hardware definitions, while control policies, simulation harnesses, and gate verifiers interface across clean message boundaries under `Apache-2.0`.
