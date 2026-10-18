# Overlap check against existing OpenIE economics articles

Read in the repo (src/content/papers/*.md, src/data/studies.json, 11 studies): interface-economics, ai-coding-market, satiation, spellcheck, gates. Abstracts, section lists and notation tables read in full; bodies of satiation, spellcheck and gates read at section level.

| Existing article | What it covers | Where the latency study touches it | Why it is distinct |
|---|---|---|---|
| interface-economics (2,945 words) | Accounted, modeled and surveyed costs of interface failures; technical debt as an interface account | Shares the habit of labeling number kinds; this study adds a three-class evidence label | Different object: cost of failures at handoffs vs. time between a capability existing and being sold |
| ai-coding-market (3,897) | Projections of an AI-coding market and their assumptions; cost of a correct task | Cites market projections and price per token | No time-lag object, no cadence, no model; this study does not forecast any market size |
| satiation (8,638) | Task-level satiation vs aggregate rebound (Jevons); price declines at fixed performance | Both cite price decline per fixed performance (Epoch) | Satiation asks how much demand remains once cost falls. Latency asks when cost reductions reach buyers and what sets that date. Demand is held fixed (linear) in the model here; rebound is not modeled |
| spellcheck (16,068) | Premium-then-bundled-free path of spell check; hardware access; dated prices | Uses bundling and marginal-cost ideas and prices over time | Spellcheck is one existence proof of price collapse; latency study is a general lag and a calendar model across methods. Switching friction s is the only overlap with bundling and is treated as a parameter |
| gates (14,992) | Metered commit gates, energy to correct completion | Joules per task as unit of account | Gates is an engineering mechanism with measured fabric; the latency study has no mechanism and no board measurement |
| other studies in studies.json (agency, rce, game-engines, three-body, mei, jouleos) | Physics, language, engines, budget-native compute, OS study | None beyond energy as metric | Different subject |

Statement of the check: no section of the new article reuses an existing paragraph; the existing economics papers contain no definition of capability frontier, deployed frontier, latency, or a reporting or funding cadence model, and no forcing-function proposition. Searched with grep for: latency, cadence, quarterly, earnings, funding, forcing, diffusion, adoption lag across src/content/papers (see run output in the repo commit message).

Additional overlap noted on grep: ai-coding-market and spellcheck cite bundling as an entry barrier (Nalebuff 2004; Adams and Yellen 1976). The latency study's switching friction s plays a related role as a parameter, but cites none of those works and makes no bundling claim. grep for latency, cadence, forcing, diffusion, adoption lag over the five economics papers returned no definitional overlap (only incidental uses of quarterly in spellcheck unit counts and earnings-call citations of installed bases).
