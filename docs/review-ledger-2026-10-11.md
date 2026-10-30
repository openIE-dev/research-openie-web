# Ledger: David's site review of research.openie.dev (11 October 2026)

Status key: **Fixed** (where) · **Partly fixed** (what was done, what's left) · **Rejected** (reason) · **Work to finish** (needs a run, hardware, a public release, or David's approval to publish outside the site; stated in the papers as a protocol where it applies).

Site version 1.1. Every paper now has a version line, and /changelog/ lists the changes.

## Verdict / risks
| # | Point | Status |
|---|---|---|
| R1 | RCE 20/20 reads as leakage | **Fixed (disclosure); held-out run is work to finish.** The repo history confirms the concern: corpus locked at `4f1054ca4` (00:16 EDT); first run 10/20 with 31 model calls at 00:33; tiered G1 templates committed at 05:16 (`6eff4d73c`), after that run. RCE §6.1 now says this, calls corpus20 a development set and 20/20 a development result, and adds n = 20 with a 95% Wilson interval (84% to 100%). §8.4 is a held-out protocol with rules frozen first (Multi-SWE-bench Rust/Python, BugsInPy, dedup). Falsifiers RCE-F1 to F4 are in §10. The essay §6 now treats it as pilot-scale development evidence. |
| R2 | No `measured_j` on the site | **Fixed (wording); meter is work to finish.** Glossary has one definition and says no paper has a `measured_j` figure yet. Hero now reads "a lab protocol written for a real meter". KV260 relabeled SOM-level. RCE gives gross RAPL beside net and states that idle subtraction isn't well defined. Buying and fitting the meter needs hardware. |
| R3 | Thesis overreaches | **Partly rejected.** The thesis sentence is David's, so it stays, but it's stated once on the catalog (the duplicate is gone). Agency §1 now reads it through the gate: capability is the gate, and the sentence applies among systems that pass it. That paragraph answers Burnell 2023, Zhou 2025 and Laber 2026, and credits SPECpower, Cost-of-Pass and Intelligence per Watt as existing gated rankings. The paper's claim is now the joule form plus refusal plus a hindsight derivative. Reason for keeping the sentence: those papers compare systems that don't all pass the same predicate, so they don't contradict a gated ranking. |
| R4 | Prior art thin | **Fixed and argued in the text**, with no "related work" or "who else" sections (David's rule). Gates: runtime enforcement and cascade lineage. RCE: APR, overfitting, benchmark bias. Satiation: rebound canon. Essay: McKinsey, Goldman, Sequoia, Gartner, productivity RCTs. Spell Check: the 500M line is gone. |
| R5 | Shell lags | **Fixed:** nav, footer papers and PDFs, glossary, About count. **Rejected in part:** the RCE figure link works. It's absolute (`/figures/rce/intent-entropy.svg`) and returned HTTP 200 when re-checked. `/living/` isn't part of this repo's pages, so it's work to finish in the living-site project. |

## Five things first
| # | Point | Status |
|---|---|---|
| F1 | Rule dates, held-out run, baselines | Dates **fixed** (RCE §6.1). Held-out run and baselines are **work to finish**, with protocols in RCE §8.4 and §8.5 (cargo fix/clippy, Sorald/TBar, Agentless local, remote agent; cost-of-pass in J and $). |
| F2 | Wall meter, INA226 | **Work to finish** (hardware). Protocols: RCE §8.3; Gates SOM/PL note. |
| F3 | Reword thesis | **Partly rejected** (see R3). |
| F4 | Related Work sections; Spell Check 7B/500M | **Fixed**, as argument inside existing sections. 500M replaced by "the few who can pay a scarcity price". The 7B+ framing is kept as the population access aims at, with ITU's 5.5B online and GSMA's 4.7B mobile internet as current reach. |
| F5 | Shell, dates, repo URL, DOIs | Nav, footer, glossary, counts, versions and changelog **fixed**. Public repo, Zenodo/arXiv DOIs and BibTeX are **work to finish**: they publish code and register DOIs outside the site, so they need David's go-ahead. |

## Site-level table
| Item | Status |
|---|---|
| Nav omits RCE/AI-coding | **Fixed** (Layout.astro nav) |
| Footer papers and PDFs | **Fixed** (Layout.astro footer, both lists) |
| RCE figure link | **Rejected**: the link is absolute and returns 200 |
| Hero "real meter" | **Fixed** (index.astro) |
| About count | **Fixed**: "Three research papers, an economics companion paper, two essays" (about/index.astro) |
| Glossary terms; two measured_j definitions | **Fixed**: 9 terms added (est_j, trajectory_j, σ-law selector, WCA, EPU, MathGround, flowG, task completion, Universal Law of Agency (proposed)); one measured_j definition, which reported_j now points to |
| Terminology drift (Notational Intelligence, MoL) | **Fixed** for Notational Intelligence (glossary: gate plus receipt, stated by Gates, read by Agency). MoL is stated as threshold convergence in the Gates cascade-lineage paragraph. A separate canonical-definitions page is **work to finish**; the glossary does that job for now. |
| /living/ hub | **Work to finish** (not in this repo) |
| Satiation 2.8 to 2.10 after 3.5 | **Fixed**: renumbered to 3.6 to 3.11, old anchors kept, in-text section refs updated |
| RCE: no Limitations, Falsifiers, Conclusion | **Fixed** as §10 Falsifiers, §11 Work to finish, §12 Conclusion. "Limitations" is renamed per David's rule that open items are work to finish, not limits. |
| Dates and versions | **Fixed**: version line on every paper, plus /changelog/ |
| Cite: DOI/BibTeX/arXiv | **Work to finish** (external registration) |
| Code and data page | **Work to finish** (needs a public repo; RCE §11 item 6) |
| PDFs as print-CSS | **Work to finish** (LaTeX pipeline) |
| Repetition of thesis | **Fixed** on the catalog (duplicate removed). Abstract label lines are kept on purpose because the label discipline is per paper. |
| Badges | **Work to finish** (needs a badge component) |
| Translations, hreflang | **Work to finish** |
| Spell Check title | **Fixed**: "Spell Check is Global: The Future of Computer Intelligence in the Hands of the Many (7B+), Not the Few", updated in every surface (studies, WebMCP, llms.txt, JSON-LD, cards, about) |

## Cross-cutting
1. Law vs protocol: **partly rejected** (R3).
2. No measured joule: **fixed** (wording, R2).
3. Evidence scale: **fixed** in RCE (n and interval; "development corpus" in the deck) and in the essay ("The evidence is at pilot scale"). Agency already gives n.
4. Re-derived named things: **fixed** as argument. The gate is a security automaton (Schneider, Ligatti); MoL comes from anytime and cascade work; H2 is Khazzoom's direct rebound; G1 is the Getafix/Sorald line; "bundling beat selling" sits next to Spolsky, Nalebuff and Adams-Yellen.
5. Lexicon: **partly fixed**. "Klere is the hardware" is out of the research section of the catalog. Glossary entries were added. Cutting coined terms in each paper is **work to finish**.
6. Multilingual: **partly fixed**. The essay cites DeepSeek (zh) and GitHub Japan (ja); RCE §2.1 already had zh/ja/ru/pt sources. A shared bibliography page with a search log is **work to finish**.
- Agency restructure (contributions first): **Rejected for now.** It's a structural rewrite of a 320-source paper; the venue step can do it. Contributions are already listed in §1.

## Agency
| # | Point | Status |
|---|---|---|
| 1 | Run doesn't meet Definition 2 | **Fixed** (§8.11 energy label): the grid is inside the wall, so the run tests kinematics and ranking, not the definition. Second-process protocol named. |
| 2 | ι is a ratio of two unmeasured quantities | **Already in the paper** (§2.1 says X and ι are upper bounds; reported_j label). The card isn't changed. |
| 3 | F2 fired, not in summary | **Fixed** (§5.2 lists R-F1, R-F2 (36/5,400; 9 and 7 at B = 1.0), R-F3, R-F5, R-F6) |
| 4 | Landauer critics | **Fixed**: new §3.0 "Objections to the floor" (Norton, Maroney, Sagawa, López-Suárez et al., Wolpert et al.), answered through (R1) to (R4) |
| 5 | Prediction 1 not new in kind | **Fixed**: "Against the closest work" (Paneru 2018, Panizon 2026, Rolandi 2026); the −1/2 slope is the distinctive falsifier |
| 6 | TUR and Margolus-Levitin | **Fixed**: K3 cites Koyuk-Seifert 2020; §3.0 cites Jordan 2017 and scopes K5 |
| 7 | MI estimator | **Fixed**: NSB named as the replacement; the schema is to record the estimator (work to finish) |
| 8 | Finite-time reset forms | **Work to finish**: Zhen 2021 and Lee 2022 weren't verified this pass |
| Fixes 1, 2 | Meter rerun; grid out of process | **Work to finish** |

## Metered Commit Gates
| # | Point | Status |
|---|---|---|
| 1 | Prior art | **Fixed**: runtime-enforcement paragraph in I.2 (Schneider, Ligatti-Bauer-Walker, Falcone, Bauer-Leucker-Schallhart, GuardAgent, AgentSpec, PolicyGuide, sagas, seL4) |
| 2 | KV260 is whole-SOM | **Fixed**: SOM-level with a device-tree link; table relabeled `VCC_SOM`; seed fabric marked inconclusive. Sample counts and drift are **work to finish** (need the raw logs). |
| 3 | Efficiency context | **Fixed** in part: Kuon-Rose and Horowitz reference points. The vendor report_power cross-check is **work to finish**. |
| 4 | MoL restates known results | **Fixed**: "II. The cascade lineage" (Dean-Boddy, Viola-Jones, Varshney-Baral, Leviathan, Mixture-of-Depths, Chen 2024, Sui 2025). MoL is stated as threshold convergence, with Prop. 9 as the optimality condition. |
| 5 | "Proof spine" | **Fixed**: II.3 is now "Cost model", old anchors kept |
| 6 | Unsigned receipts | **Work to finish** (signing) |
| 7 | Test ≠ proof on the card | **Fixed** in the I.2 text; the card wording is unchanged |
| Fix 4 (move Periodic Stack), Fix 5 (finish Part II) | **Unchanged for now.** Part II continues past the point the reviewer could fetch (§II.8 related work, §II.10 open questions, §II.11 roadmap, II. References). A dedicated Part II results and limits section is work to finish. |

## Task Satiation
| # | Point | Status |
|---|---|---|
| 1 | Rebound canon | **Fixed** (§3.7: Khazzoom, Brookes, Saunders, Sorrell-Dimitropoulos, Brockway 2021 at "more than half") |
| 2 | C(z) endogenous | **Fixed** (§3.3, Witt 2001; freeze the predicate before a price change) |
| 3 | H1 already measured | **Fixed** (§3.3: Chen, Cuadron, Bai; exploratory post hoc read named as the next measurement) |
| 4 | DiD has no clean treatment | **Fixed** (§5.1: Gundlach, Du, Anthropic −0.29; a market-level design is needed) |
| 5 | Tokens vs joules | **Fixed** (§3.3, Masanet 2020) |
| 6 | Bicycles weak; lighting | **Fixed** (lighting added: Fouquet-Pearson, Tsao 2010). Bicycles kept as the bubble-pricing case. |
| 7 | Useful data | Anthropic **fixed**. Chatterji, Tomlinson, OpenRouter and Ramp are **work to finish** (not verified this pass). |
| 8 | Numbering, genre label | **Fixed** (renumbered; label "Economics companion paper" on both catalog and About) |
| Non-English (UBA, Shift Project, zh, ru, ja) | **Work to finish** (not verified this pass) |

## RCE
| # | Point | Status |
|---|---|---|
| 1 | Leakage | **Fixed** (disclosure, §6.1; held-out protocol §8.4) |
| 2 | Plausible-patch trap | **Fixed** (§6.1 "What the gate does and does not certify": Qi, Smith, Le, Xiong, Durieux, Liu). Byte identity is named as the stronger evidence. |
| 3 | ASM misapplied | **Fixed** (§3.1 scope paragraph: Blass-Gurevich, Blass-Dershowitz-Gurevich, Moschovakis, Vardi; the Form is a modelling choice with Elm, Temporal and Flo precedents) |
| 4 | Energy not interpretable | **Fixed**: gross beside net (380.7 vs 84.2; 3,086.4 vs 712.4; gold 12.7 vs 2.0); negative-row count; one pass, no interval; RAPL scope (Khan 2018); host described. **Rejected in part:** "remote-model energy is off the meter" doesn't apply here. The earlier run's model server was local, pinned to the same package, so its energy is in the reading. |
| 4b | Rename jetson-hub | **Partly fixed**: the heading is now "on an x86 laptop" and the text says it's not a Jetson. The hostname stays in artifact paths so logs still match. |
| 5 | Baselines | **Work to finish**, protocol in §8.5 |
| 6 | Corpus scale | **Fixed** (development set, n, interval; Allamanis dedup and Ray unnaturalness in §7). Scale-up is §8.4. |
| 7 | Differential testing | **Fixed** (§5.1 renamed, with Csmith, Pnueli and coverage stated; Ruler in §5.2) |
| 8 | 626 survey | **Partly fixed**: the caption says it's unpublished and the author's count, to be published with method (§11 item 5). The number is kept because it's David's survey and is labeled as such. |
| 9 | No Limitations, Falsifiers, Conclusion | **Fixed** (§10 to §12) |
| Non-English APR schools | **Work to finish** (not verified this pass) |

## AI-Coding Market
| # | Point | Status |
|---|---|---|
| 1 | Coverage fraction | **Fixed** as Proposition E5 with a merged-PR sampling protocol (518.7M merged PRs, Octoverse). The first estimate is **work to finish**. |
| 2 | $100k/dev contested; 30M devs | **Fixed**: §2.7 productivity table (Peng +55.8% toy task, Paradis about 21%, METR −19%, METR 2026 "unreliable signal"); GitHub 180M+; text says both factors are soft. DORA, GitClear, Uplevel and Stack Overflow numbers weren't verified this pass (work to finish). |
| 3 | Bundling by the platform owner | **Fixed** (§6: Copilot usage-based billing from 1 June 2026, Cursor repricing, Spolsky, Nalebuff, Adams-Yellen; who holds the gate) |
| 4 | Decline 1 is competition | **Fixed** (§2.5: Epoch 9 to 900×, LLMflation 10×, DeepSeek >50% cut; "needs no energy accounting") |
| 5 | Jevons both ways | **Fixed** (§7: elasticity −0.29, cross-sectional, inelastic) |
| 6 | Capex commitments | **Fixed** in part: Stargate $500B, Gartner $1.5T, Sequoia $600B question; "hardware rent" stated. OpenAI-NVIDIA/AMD and MIT NANDA are work to finish. |
| 7 | Omitted projections | **Fixed**: McKinsey $2.6T to $4.4T and SE 20% to 45%; Goldman 7% GDP; Gartner. The 2024 Gartner 75% figure and Stanford AI Index are work to finish. |
| 8 | Microsoft $4.1B; Cursor repricing | **Fixed**: $4.1B pre-tax equity-method plus $3.1B net income ($0.41 EPS), per the MS IR page; Cursor row added |
| Conclusion conditional | **Fixed** ("What survives") |

## Spell Check
| # | Point | Status |
|---|---|---|
| 1 | Premium tier still sold | **Fixed** ("base layer cannot be sold; the premium moved up a layer": Grammarly, Antidote, ATOK) |
| 2 | 500M false | **Fixed** (the few are a price class; the earlier number is disclosed and withdrawn) |
| 3 | 7B not reach | **Partly rejected**: 7B+ is kept as the people access is built for (the thesis), with ITU 5.5B online and GSMA 4.7B mobile internet as current reach. |
| 4 | Bundling as exclusion | **Fixed** ("Bundling as strategy" paragraph before §2.10) |
| 5 | Larger model claim | **Partly rejected**: §4.10's claim is scoped to the isolated-word token, where it holds. For context-dependent correction, GECToR and Rothe 2021 now show larger models do correct better, and Luccioni 2024 gives the energy trade-off. |
| 6, 7 | Pre-1995 history; non-English | ATOK **fixed**. The rest (SpellStar, Proximity/Franklin, Inso/L&H, ORFO, Yandex, Sogou, Duden, Zemberek) is **work to finish** (not verified this pass). |

## Product white papers
- "Klere is the hardware" out of research surfaces: **fixed** on the catalog research section. It stays on the product-section line and the MEI card.
- JouleOS "~10⁵×": **Rejected**. It isn't in any abstract or summary. It appears once, in the JouleOS claims table, labeled "Project claim (README only)".
- "Internal" labels and the intermittent-computing and TEE lineage: **work to finish**.

## Appendix B errata
Every row is handled above. Two remain: "Gates I.4.9 disclose samples and drift" and "RCE §6.2 rerun on idle machine" are **work to finish**, and the rest are **fixed**. The spot-checks that passed weren't re-checked.

## Checks
- Claim lint: 47 files clean (2 status words reworded; Du's "super-Moore's law" title licensed in the claim ledger).
- KaTeX errors: 0. Internal anchors: 0 broken.
- New external links: 93 checked. Every DOI resolves in Crossref (one wrong Vardi DOI was found and corrected before use). The 403 and 000 results are publisher bot blocks (ACM, Science, IAEE, Gartner, OpenAI, Microsoft, McKinsey); those pages were confirmed by fetch or search.
- No em or en dashes in added text.
