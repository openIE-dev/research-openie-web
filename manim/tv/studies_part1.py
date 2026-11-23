#!/usr/bin/env python3
"""
OpenIE Research TV v3.0 — Plain-Words First, Telescoping Depth, Zero Acronym Soup (Part 1: Studies 1–7).
Covers: agency, gates, deterministic-null, satb-harness, time-as-an-index,
        communication-avalanche, lut-adapt.
"""

_AGENCY_OPENING = [
    (
        "bullet_focus_1",
        "WHAT COUNTS AS AN AGENT",
        "Key Point 1 of 3 · In Plain Words",
        "First, an agent must aim at a goal, act on the world, and stay within an energy budget.",
    ),
    (
        "bullet_focus_2",
        "NATURE PRICES EVERY DECISION",
        "Key Point 2 of 3 · In Plain Words",
        "Second, physics prices every decision, creating one optimal pace between slow idle drain and frantic switching waste.",
    ),
    (
        "bullet_focus_3",
        "FINISH RIGHT, SPEND LESS",
        "Key Point 3 of 3 · In Plain Words",
        "Third, among systems that finish a task correctly, the smarter one is whichever spent less energy.",
    ),
]

_GATES_OPENING = [
    (
        "bullet_focus_1",
        "CHECK BEFORE IRREVERSIBLE ACTS",
        "Key Point 1 of 3 · In Plain Words",
        "First, a computer should not take an irreversible action until an independent check confirms it is safe.",
    ),
    (
        "bullet_focus_2",
        "TRY THE CHEAPEST METHOD FIRST",
        "Key Point 2 of 3 · In Plain Words",
        "Second, it should try the cheapest method first and wake a large AI model only when simpler tools miss.",
    ),
    (
        "bullet_focus_3",
        "EVERY DECISION LEAVES A RECEIPT",
        "Key Point 3 of 3 · In Plain Words",
        "Third, every decision is written to a receipt with the energy it used, so anyone can audit it later.",
    ),
]

_DNULL_OPENING = [
    (
        "bullet_focus_1",
        "THE MISSING CONTROL GROUP",
        "Key Point 1 of 3 · In Plain Words",
        "First, most AI benchmarks skip a zero-model control group that tests what simple lookup already solves.",
    ),
    (
        "bullet_focus_2",
        "NINE OF TEN STRUCTURED TIES",
        "Key Point 2 of 3 · In Plain Words",
        "Second, on bounded math and database tasks, a frozen lookup table matched cloud AI on nine of ten tests.",
    ),
    (
        "bullet_focus_3",
        "WHERE BIG MODELS TRULY SHINE",
        "Key Point 3 of 3 · In Plain Words",
        "Third, on open coding tasks AI leaped ahead, while caching verified answers cut repeat energy three point six times.",
    ),
]

_SATB_OPENING = [
    (
        "bullet_focus_1",
        "THE WRAPPER CHANGES THE SCORE",
        "Key Point 1 of 3 · In Plain Words",
        "First, changing the wrapper around an AI model can swing scores as much as swapping the model.",
    ),
    (
        "bullet_focus_2",
        "ONE IDENTICAL EXAM FOR ALL",
        "Key Point 2 of 3 · In Plain Words",
        "Second, this test harness locks prompts, memory trimming, and tools so every AI takes the exact same exam.",
    ),
    (
        "bullet_focus_3",
        "HONEST POWER ACROSS FIVE HOSTS",
        "Key Point 3 of 3 · In Plain Words",
        "Third, across five computer types, it separates real board sensors from chip counters and blocks noisy power estimates.",
    ),
]

_TIME_OPENING = [
    (
        "bullet_focus_1",
        "IF TIME LOOPS EXISTED",
        "Key Point 1 of 3 · In Plain Words",
        "First, inside a mathematical time loop, almost every digital lock would break at once except a one-time secret pad.",
    ),
    (
        "bullet_focus_2",
        "NO BACKWARD SIGNALS IN PHYSICS",
        "Key Point 2 of 3 · In Plain Words",
        "Second, in known physics, no quantum trick, analog circuit, or reported anomaly sends readable answers backward in time.",
    ),
    (
        "bullet_focus_3",
        "EVERY SHORTCUT IS PAID UPFRONT",
        "Key Point 3 of 3 · In Plain Words",
        "Third, every fast lookup of a future answer is work paid upfront, which fresh random values defeat immediately.",
    ),
]

_AVALANCHE_OPENING = [
    (
        "bullet_focus_1",
        "HOW COLLECTIVE MINDS SCALE",
        "Key Point 1 of 3 · In Plain Words",
        "First, from ancient microbes to modern AI, groups scale by sharing signals across strict thresholds and safety gates.",
    ),
    (
        "bullet_focus_2",
        "QUIET WAKEUPS, VERIFIED HANDOFFS",
        "Key Point 2 of 3 · In Plain Words",
        "Second, event-driven wakeups and signed checks block bad edits and deliver far more verified work per joule.",
    ),
    (
        "bullet_focus_3",
        "TEN AI METHODS, CONSENT FIRST",
        "Key Point 3 of 3 · In Plain Words",
        "Third, ten AI approaches unite through tiny compiled routines, while future brain links stay grounded in strict consent.",
    ),
]

_LUT_OPENING = [
    (
        "bullet_focus_1",
        "STOP RE-SOLVING OLD PATTERNS",
        "Key Point 1 of 3 · In Plain Words",
        "First, most requests repeat solved patterns, so running a giant neural network every time wastes memory and energy.",
    ),
    (
        "bullet_focus_2",
        "TINY TABLES FIRST, STREAM ON MISS",
        "Key Point 2 of 3 · In Plain Words",
        "Second, this cascade checks tiny truth tables first and streams specialist model slices from storage only when needed.",
    ),
    (
        "bullet_focus_3",
        "CERTIFY ONCE, REPLAY IN MILLISECONDS",
        "Key Point 3 of 3 · In Plain Words",
        "Third, once an automated test certifies a new answer, it compiles downward into a reusable millisecond skill.",
    ),
]


STUDIES_PART1 = [
    {
        "id": "agency",
        "title": "Thermodynamic Bounds and an Optimal Tempo for Goal-Holding Agents",
        "short_title": "Thermodynamic Bounds & Optimal Tempo",
        "category": "Foundations & Thermodynamics",
        "paper_url": "/papers/agency/",
        "pdf_url": "/pdfs/agency.pdf",
        "figures_url": "/living/",
        "about_url": "/about/agency/",
        "tutorial_lab_id": "lab-01-quorum-sepj",
        "cutaway_3d": "07_thermodynamic_tempo_manifold",
        "epistemic_tags": ["T", "E", "M"],
        "plain_bullets": [
            "An agent must aim at a goal, act on the world, and stay within an energy budget.",
            "Physics prices every decision, creating one optimal pace between slow idle drain and frantic switching waste.",
            "Among systems that finish a task correctly, the smarter one is whichever spent less energy.",
        ],
        "analogy": (
            "Highway Fuel Trap",
            "Crawl at walking speed and baseline engine idle drains the tank; floor the pedal and wind drag burns fuel fast.",
            "One Sweet-Spot Pace",
            "Goal-holding agents face the exact same physics: baseline power punishes hesitation while rapid memory resets punish rushing.",
            "Pass the finish line first, then rank every finisher by total joules spent.",
        ),
        "headline_metric": "Finish Right First, Then Rank by Joules",
        "energy_tier": "Chip Energy Counter",
        "energy_disclosure": "Built-in laptop chip energy counters and physics bounds; no external wall meter.",
        "nodes": [
            ("Scoreboards Ignore Energy", "Raw accuracy hides massive power waste", "rose"),
            ("Predict & Act on World", "Fix a testable target before acting", "amber"),
            ("Pace at Sweet-Spot Tempo", "Balance idle drain against reset drag", "cyan"),
            ("Gate First, Rank by Joules", "Refuse over-budget runs cleanly", "emerald"),
        ],
        "equation": (
            "Progress per Joule = Task Speed / (Idle Drain + Action Drag)",
            "Efficiency peaks at the exact pace where rushing drag matches baseline idle power.",
            "tempo_peak",
        ),
        "bars": [
            ("Unguided Random Baseline", 36, "10.7 / 30 closed · cheap fast failures", "rose"),
            ("Fixed Cheapest-First Cascade", 66, "19.9 / 30 closed · 0 budget overspends", "cyan"),
            ("Threshold Selector Policy", 76, "22.7 / 30 closed · top gated finisher", "emerald"),
        ],
        "cutaway_labels": [
            ("Sweet-Spot Tempo Ridge", "Highest verified progress per joule", "amber"),
            ("Minimum Bit-Reset Floor", "Heat paid each time memory updates", "cyan"),
            ("Completion Check Gate", "Wrong or unfinished runs score zero", "emerald"),
            ("Rushing Heat Penalty", "Extra energy lost when acting too fast", "rose"),
        ],
        "falsifier": (
            "What Replicated — and What Needed Better Sensors",
            "Across two laptops and over twenty thousand runs, budget guards held overspends to zero and gated joules beat raw bit rates.",
            "Tight-budget selector gains did not replicate, and sub-millisecond steps beat built-in chip counters, requiring wall or board sensors next.",
            "HONEST BOUNDARY",
        ),
        "tiers": {
            "15s": {
                "hook": "Three plain truths about what makes a system an agent, why pace matters, and how energy ranks intelligence.",
                "scenes": list(_AGENCY_OPENING),
            },
            "45s": {
                "hook": "Why running an AI agent too slowly or too frantically wastes energy, explained through highway fuel pacing.",
                "scenes": list(_AGENCY_OPENING) + [
                    (
                        "analogy_spotlight",
                        "LIKE HIGHWAY FUEL PACING",
                        "Idle Engine Drain vs Wind Drag",
                        "Think of driving a car across a desert on one tank of fuel. Crawl at walking speed and baseline engine idle drains the tank; floor the pedal and air drag burns fuel before you arrive.",
                    ),
                    (
                        "horizon_slate",
                        "CAPABILITY IS THE GATE",
                        "Correctness First · Joules Rank Finishers",
                        "Capability means crossing the finish line at all; intelligence means how little energy that verified completion took, turning raw AI leaderboards into honest physical measurements.",
                    ),
                ],
            },
            "90s": {
                "hook": "How thermodynamics defines agency, sets an optimal action pace, and exposes a subtle trap in raw efficiency scores.",
                "scenes": list(_AGENCY_OPENING) + [
                    (
                        "analogy_spotlight",
                        "THE DESERT FUEL ANALOGY",
                        "Why Hesitation and Panic Both Lose",
                        "Picture driving across a wide desert on a strict fuel grant. Idling in traffic burns baseline power without moving you forward, while sprinting at top speed multiplies switching heat until your tank runs dry before reaching town.",
                    ),
                    (
                        "state_cascade",
                        "FOUR CLAUSES OF REAL AGENCY",
                        "Predict -> Act -> Update -> Obey Budget",
                        "To qualify as an agent, a system locks in a testable prediction before acting, changes the outside world rather than editing its own sensors, updates its internal state from the outcome, and writes a clean refusal receipt whenever the energy budget falls short.",
                    ),
                    (
                        "benchmark_bars",
                        "TWENTY THOUSAND GUARDED RUNS",
                        "Why Completion Must Come Before Joules",
                        "Across more than twenty thousand puzzle episodes on two laptops, an unguided random baseline looked great on raw bits per joule only because its fast failures were cheap, whereas gating by full task completion ranked our goal-holding selectors accurately.",
                    ),
                    (
                        "horizon_slate",
                        "THE PRACTICAL DESIGN RULE",
                        "Check Completion, Then Count Every Joule",
                        "Stop mistaking brute energy spend for intelligence. Demand a verified correct answer first, enforce hard energy budgets with transparent refusal receipts, and rank every passing system strictly by total joules spent.",
                    ),
                ],
            },
            "180s": {
                "hook": "Three-minute deep dive into thermodynamic agency bounds, the three-dimensional tempo ridge, and twenty thousand pre-registered runs.",
                "scenes": list(_AGENCY_OPENING) + [
                    (
                        "hook_contrast",
                        "WHY AI LEADERBOARDS MISLEAD",
                        "Capability Confused With Intelligence",
                        "Today's AI scoreboards celebrate whichever system gets the highest raw score, ignoring whether one answer burned a thousand watts or a thousandth of a watt. Pouring more electricity into a machine can buy capability, yet true intelligence means solving the exact same problem parsimoniously with minimal energy.",
                    ),
                    (
                        "analogy_spotlight",
                        "PACING AGAINST DRIFT AND HEAT",
                        "Balancing Standing Power Against Reset Drag",
                        "Imagine balancing an upright broomstick on your palm while walking on a strict calorie budget. Wait too long between corrections and the stick tips away while baseline metabolism drains your reserves; twitch too frantically and every rapid muscle reset dumps extra heat into the air for tiny gains.",
                    ),
                    (
                        "state_cascade",
                        "DEFINITION, PACE, AND CALCULUS",
                        "Four Strict Clauses Plus Refusal Receipts",
                        "The framework stacks three layers in a fixed order. First comes eligibility: fix a discriminating prediction beforehand, physically push on the outside world rather than editing your own sensors, update internal memory from the result, and stay inside your joule grant or log a refusal receipt. Next come speed limits, then hindsight intelligence.",
                    ),
                    (
                        "equation_curve",
                        "THE SWEET-SPOT TEMPO CURVE",
                        "Where Idle Leakage Meets Switching Drag",
                        "Every time a machine compares an outcome and resets memory over a closed cycle, physics charges a minimum heat floor per erased bit while idle circuits leak steady baseline watts. Dividing useful task velocity by both costs combined traces a smooth arch peaking at one optimal action pace where marginal drag equals baseline drain.",
                    ),
                    (
                        "cutaway_3d",
                        "INSIDE THE 3D TEMPO LANDSCAPE",
                        "Physical Floor, Completion Gate & Optimal Ridge",
                        "In this three-dimensional landscape, the flat lower plane marks nature's minimum heat price for updating a single bit of memory at room temperature. Steep walls on either side show slow idle battery drain and frantic high-speed heat waste, framing one golden ridge where verified progress per joule reaches its physical maximum.",
                    ),
                    (
                        "benchmark_bars",
                        "LAPTOP AND LINUX REPLICATIONS",
                        "Guarded Puzzle Runs Across Forty Seeds",
                        "Across pre-registered forty-seed puzzle benchmarks on two computers, moving receipt writing inside the budget guard reduced overspends to zero across ten thousand eight hundred runs. Requiring task completion first stopped a cheap-failing random baseline from gaming raw bit rates, while our threshold selector closed more tasks than a fixed cascade at loose budgets.",
                    ),
                    (
                        "falsifier_audit",
                        "WHAT FAILED AND WHAT WE LEARNED",
                        "Chip Counter Limits & Honest Boundaries",
                        "Scientific honesty requires reporting every failed check alongside every success. Tight-budget selector gains from our first exploratory run did not replicate, shared tasks used equal energy, and built-in Linux chip counters missed sub-millisecond steps completely, proving why dedicated quiet hosts and external wall or circuit-board power sensors must come next.",
                    ),
                ],
            },
        },
    },
    {
        "id": "gates",
        "title": "Metered Commit Gates: Energy-to-Correct-Completion for Agentic Systems",
        "short_title": "Metered Commit Gates",
        "category": "Foundations & Thermodynamics",
        "paper_url": "/papers/gates/",
        "pdf_url": "/pdfs/gates.pdf",
        "figures_url": "/living/ni/",
        "about_url": "/about/gates/",
        "tutorial_lab_id": "lab-02-attested-orchestrator",
        "cutaway_3d": "01_silicon_kv260_lut6",
        "epistemic_tags": ["T", "E"],
        "plain_bullets": [
            "A computer should not take an irreversible action until an independent check confirms it is safe.",
            "It should try the cheapest method first and wake a large AI model only when simpler tools miss.",
            "Every decision is written to a receipt with the energy it used, so anyone can audit it later.",
        ],
        "analogy": (
            "Apologizing After Damage",
            "Letting an AI delete files or send money first and apologizing after a mistake cannot undo real-world harm.",
            "Two-Key Safety Interlock",
            "Like a cockpit lock that blocks unsafe switches before anything moves, a commit gate checks rules and budget upfront.",
            "Proposals never authorize themselves; only verified actions cross into the real world.",
        ),
        "headline_metric": "11,428 Picojoules per Hardware Gate Check",
        "energy_tier": "Board Power Sensor",
        "energy_disclosure": "Direct circuit-board power sensor on vision module; software runs stay estimates.",
        "nodes": [
            ("Self-Approved AI Actions", "Unchecked guesses cause undoable harm", "rose"),
            ("Cheapest Method First", "Try table lookup, formula, then solver", "cyan"),
            ("Independent Safety Gate", "Check safety rule and energy budget", "amber"),
            ("Verified Commit Receipt", "11,428 picojoules per board check", "emerald"),
        ],
        "equation": (
            "Total Energy to Finish Right = All Attempt Energy / Verified Completions",
            "Failed guesses and unsafe retries count against you, rewarding cheap early checks.",
            "cascade_drop",
        ),
        "bars": [
            ("Ungated Model Retries", 90, "Repeated heavy runs + undoable side effects", "rose"),
            ("Cheapest-First Software Cascade", 24, "0 unsafe allows across 209,261 checks", "cyan"),
            ("Metered Hardware Gate Cycle", 6, "11,428 picojoules on board power sensor", "emerald"),
        ],
        "cutaway_labels": [
            ("Circuit-Board Power Sensor", "11,428 picojoules per whole-board check", "amber"),
            ("Fast Rule Lookup Table", "Checks safety rules without a big model", "cyan"),
            ("Permission Latch", "Blocks side effects unless checks pass", "emerald"),
            ("Typed Refusal Receipt", "Logs why an unsafe action was stopped", "rose"),
        ],
        "falsifier": (
            "Whole-Module Sensor vs Isolated Chip Core",
            "Direct circuit-board sensor measured 11,428 picojoules per gate cycle, and discrete checks allowed zero unsafe acts in 209,261 tests.",
            "That reading covers the whole module supply rather than an isolated logic rail, and the tiny 98-picojoule seed test stayed inconclusive.",
            "BOARD POWER VERIFIED",
        ),
        "tiers": {
            "15s": {
                "hook": "Why computers must check before taking undoable actions, start with the cheapest tool, and log every joule.",
                "scenes": list(_GATES_OPENING),
            },
            "45s": {
                "hook": "How a cockpit-style safety lock and a cheapest-first tool ladder stop undoable AI mistakes before they happen.",
                "scenes": list(_GATES_OPENING) + [
                    (
                        "analogy_spotlight",
                        "THE COCKPIT SAFETY INTERLOCK",
                        "Why Proposals Cannot Approve Themselves",
                        "When software moves money, edits records, or steers machinery, saying sorry after a bad guess cannot undo the damage. A commit gate acts like a physical cockpit lock that blocks unsafe switches before anything moves.",
                    ),
                    (
                        "horizon_slate",
                        "MEASURED IN TRILLIONTHS OF A JOULE",
                        "11,428 Picojoules per Board Gate Cycle",
                        "Measured by an onboard circuit-board power sensor, checking safety rules costs about eleven thousand picojoules per cycle while leaving a permanent, auditable receipt for every single decision.",
                    ),
                ],
            },
            "90s": {
                "hook": "Inside Metered Commit Gates: cheapest-first cascades, zero unsafe approvals across two hundred thousand checks, and board power sensors.",
                "scenes": list(_GATES_OPENING) + [
                    (
                        "analogy_spotlight",
                        "TWO KEYS BEFORE REAL ACTION",
                        "Separating Creative Proposals From Permission",
                        "Think of how a hospital pharmacy or airplane cockpit separates suggesting an action from executing it. An AI model can propose whatever clever step it likes, while an independent deterministic gate holds the sole key to external tools.",
                    ),
                    (
                        "state_cascade",
                        "CHEAPEST SUFFICIENT LADDER",
                        "Lookup -> Formula -> Solver -> Model",
                        "Instead of waking a massive neural network on routine tasks, our cascade tries table lookup first, then simple formulas, then exact solvers, and finally a model, stopping the instant a check passes or refusing cleanly when remaining budget runs low.",
                    ),
                    (
                        "benchmark_bars",
                        "ZERO UNSAFE ALLOWS & BOARD POWER",
                        "209,261 Software Checks · 11,428 Picojoules",
                        "Across more than two hundred nine thousand simulated control checks, the discrete safety gate allowed zero unsafe actions. On real programmable hardware with an inline circuit-board power sensor, one whole-module gate cycle measured eleven thousand four hundred twenty-eight picojoules.",
                    ),
                    (
                        "horizon_slate",
                        "PROVENANCE NEVER GETS FAKED",
                        "Model Guesses Stay Labeled Forever",
                        "Model-generated suggestions are never silently relabeled as guaranteed rules, and every allowed or refused step writes its exact reason and labeled energy source to a permanent receipt for later inspection.",
                    ),
                ],
            },
            "180s": {
                "hook": "Full documentary tour of commit-before-act safety gates, Simon-Kadane cheapest-first cascades, and physical circuit-board power metering.",
                "scenes": list(_GATES_OPENING) + [
                    (
                        "hook_contrast",
                        "WHEN POLITE APOLOGIES FAIL",
                        "Irreversible Side Effects Need Runtime Law",
                        "Chatbots can recover from a clumsy sentence by writing another polite paragraph, yet autonomous software tools cross real-world boundaries that cannot be rolled back once executed. Even cheap per-word AI becomes wasteful and dangerous when ten unverified guesses corrupt records, trigger expensive rollbacks, and force human cleanup afterward.",
                    ),
                    (
                        "analogy_spotlight",
                        "THE CIRCUIT BREAKER AND ESCALATOR",
                        "Routine Work Stays Local, Risk Gets Checked",
                        "Imagine a hospital pharmacy where routine refills follow an exact printed checklist, unusual prescriptions escalate to a specialist, and a physical barcode lock refuses to open the drawer if dosage or allergy limits fail. Neither raw speed nor model cleverness ever gets an informal side channel around that gate.",
                    ),
                    (
                        "state_cascade",
                        "PROPOSAL, CERTIFICATE, RECEIPT",
                        "Four Steps That Govern Every External Tool",
                        "Every irreversible action passes through four strict runtime records in our Rust reference implementation. First comes an untrusted proposal that cannot authorize itself. Second comes a joint certificate requiring table permission, energy budget headroom, and optional safety barriers. Third comes commit or typed refusal, and fourth comes a timestamped receipt.",
                    ),
                    (
                        "equation_curve",
                        "ENERGY TO CORRECT COMPLETION",
                        "Ordering Tools by Pass Chance per Joule",
                        "By classic sequential search theory, trying gears in decreasing order of pass probability divided by energy cost minimizes expected spend across every workload. Measuring total energy to correct completion penalizes every failed retry and refusal, showing clearly why spending picojoules on early deterministic checks saves whole joules of wasted model runs.",
                    ),
                    (
                        "cutaway_3d",
                        "3D HARDWARE GATE & POWER SENSOR",
                        "Eight Parallel Checks at Twenty-Five Megahertz",
                        "This three-dimensional hardware cutaway shows eight parallel safety gates checking rule tables, energy budgets, and safety barriers together at twenty-five megahertz on reconfigurable silicon, while an onboard circuit-board current sensor measures real module supply power across interleaved start-and-stop runs and matches software decisions step for step.",
                    ),
                    (
                        "benchmark_bars",
                        "SOFTWARE CHECKS AND SILICON DATA",
                        "Zero False Allows · 11,428 Picojoules",
                        "Across two hundred nine thousand two hundred sixty-one fixed-point control checks, the discrete gate recorded zero unsafe approvals and only seventy-nine cautious refusals, while blocking unsafe external tool calls before execution. Interleaved hardware board-sensor measurements recorded eleven thousand four hundred twenty-eight picojoules per gate cycle across four passes.",
                    ),
                    (
                        "falsifier_audit",
                        "STRICT HONESTY ABOUT POWER LABELS",
                        "Whole-Module Supply vs Software Estimates",
                        "Every energy figure states plainly how it was obtained and what remains unmeasured. Our eleven-thousand-picojoule hardware reading spans the whole vision module supply rather than an isolated core rail, a tiny ninety-eight-picojoule seed test stayed inconclusive near sensor resolution, and software operation counts stay clearly labeled as analytical estimates.",
                    ),
                ],
            },
        },
    },
    {
        "id": "deterministic-null",
        "title": "Deterministic Null: A Pre-Registered Control Experiment for Neural and Agentic Substrates",
        "short_title": "Deterministic Null",
        "category": "Null & Benchmarks",
        "paper_url": "/papers/deterministic-null/",
        "pdf_url": "/pdfs/deterministic-null.pdf",
        "figures_url": "/living/deterministic-null/",
        "about_url": "/about/deterministic-null/",
        "tutorial_lab_id": "lab-07-deterministic-null",
        "cutaway_3d": "08_dnull_drand_crystal",
        "epistemic_tags": ["T", "E"],
        "plain_bullets": [
            "Most AI benchmarks skip a zero-model control group that tests what simple lookup already solves.",
            "On bounded math and database tasks, a frozen lookup table matched cloud AI on nine of ten tests.",
            "On open coding tasks AI leaped ahead, while caching verified answers cut repeat energy three point six times.",
        ],
        "analogy": (
            "Drug Trials Without a Placebo",
            "Testing one giant AI model only against another hides whether a simple lookup table could solve the same problem.",
            "The Zero-Model Control Group",
            "A frozen integer lookup table locked before public randomness beacons tests exactly where neural reasoning adds real value.",
            "Use simple lookup for structured repeats, and save big models for genuinely new problems.",
        ),
        "headline_metric": "9 of 10 Bounded Ties · 3.59x Repeat Energy Cut",
        "energy_tier": "Chip Energy Counter",
        "energy_disclosure": "Built-in Apple chip energy counters; cloud server watts unavailable and unguessed.",
        "nodes": [
            ("Leaderboards Skip Controls", "No placebo baseline for giant AI models", "rose"),
            ("Lock Before Public Beacon", "Timestamp hashes before test seeds exist", "amber"),
            ("Five-Language Exact Table", "Identical integer lookup in five languages", "cyan"),
            ("Save Verified New Answers", "3.59x lower repeat calls and chip energy", "emerald"),
        ],
        "equation": (
            "True AI Gain = Model Accuracy Minus Zero-Model Control Accuracy",
            "Separates genuine open-world synthesis from routine patterns a frozen lookup table solves.",
            "zipf_decay",
        ),
        "bars": [
            ("Bounded Math & Database Suite", 10, "AI beats lookup on only 1 of 10 cells", "rose"),
            ("Multi-Turn Logic Proof Loop", 100, "50 / 50 solved · matched free by solver", "cyan"),
            ("Open Coding & Tool Benchmarks", 95, "+44 to +95 percentage points over null", "emerald"),
        ],
        "cutaway_labels": [
            ("Frozen Integer Case Table", "Bit-identical across five languages", "cyan"),
            ("Public Randomness Lock", "Anchored before 4,030 held-out tests", "amber"),
            ("Open-World Coding Gain", "Up to 95 points above lookup control", "emerald"),
            ("Online Answer Caching", "Cuts recurring energy spend 3.59 times", "amber"),
        ],
        "falsifier": (
            "Pre-Registered Timestamps & Honest Energy Labels",
            "Five languages matched bit-for-bit on one million records, and pre-registered tests cleanly split routine tasks from open coding.",
            "Local Apple chip counters are not wall power meters, and remote cloud providers do not disclose per-query server joules.",
            "5 LANGUAGES EXACT",
        ),
        "tiers": {
            "15s": {
                "hook": "Why AI benchmarks need a placebo control group, and where giant models actually beat a simple lookup table.",
                "scenes": list(_DNULL_OPENING),
            },
            "45s": {
                "hook": "Just like medicine tests new drugs against a placebo pill, we tested frontier AI models against a frozen lookup loop.",
                "scenes": list(_DNULL_OPENING) + [
                    (
                        "analogy_spotlight",
                        "MEDICINE'S PLACEBO RULE FOR AI",
                        "Model vs Model Hides Simple Baselines",
                        "Doctors never approve a new drug without testing it against a sugar pill. Yet AI leaderboards routinely pit one giant neural model against another without asking what a fast recipe book of verified examples solves.",
                    ),
                    (
                        "horizon_slate",
                        "COMBINE LOOKUP WITH SYNTHESIS",
                        "Save Big Models for Unseen Problems",
                        "Testing a zero-model baseline first separates marketing hype from real reasoning, and saving verified answers turns expensive breakthroughs into cheap instant lookups the next time they appear.",
                    ),
                ],
            },
            "90s": {
                "hook": "Across 4,030 pre-registered test cases, a five-language integer lookup loop reveals exactly when neural AI is needed.",
                "scenes": list(_DNULL_OPENING) + [
                    (
                        "analogy_spotlight",
                        "WHY AI NEEDS A PLACEBO TEST",
                        "Separating Memorized Patterns From Reasoning",
                        "If two hundred-billion-parameter models both score ninety-nine percent on a structured benchmark, did either one actually need a neural network at decision time? Without a zero-model control group on the exact same exam, nobody can tell the difference.",
                    ),
                    (
                        "state_cascade",
                        "LOCKED BEFORE TEST SEEDS EXISTED",
                        "Public Timestamps + Five-Language Table",
                        "We built an eight-step integer lookup table verified bit-for-bit across Rust, Go, Python, Julia, and C plus plus, then anchored its digital fingerprints onto public Bitcoin calendar proofs before public randomness beacons generated four thousand thirty fresh held-out problems.",
                    ),
                    (
                        "benchmark_bars",
                        "TWO CLEAR EMPIRICAL WORLDS",
                        "9 of 10 Ties vs +95 Points on Open Code",
                        "Across two thousand eight hundred forty bounded math and database problems, cloud models beat the frozen table on only unindexed customer phrasing, yet jumped forty-four to ninety-five percentage points ahead across four externally authored software engineering benchmarks.",
                    ),
                    (
                        "horizon_slate",
                        "CRYSTALLIZE VERIFIED ANSWERS",
                        "3.59x Fewer Repeat Calls & Joules",
                        "When newly verified neural fixes are written back into the lookup store, realistic skewed workloads cut recurring model calls and local chip energy by three point five nine times.",
                    ),
                ],
            },
            "180s": {
                "hook": "Complete three-minute documentary on Deterministic Null: pre-beacon registration, five-language bit-exactness, and multi-vendor cloud tests.",
                "scenes": list(_DNULL_OPENING) + [
                    (
                        "hook_contrast",
                        "THE BLIND SPOT IN AI BENCHMARKS",
                        "Comparing Models Without a Zero-Model Control",
                        "Modern AI evaluations routinely compare one language model against another, leaving a foundational scientific question unmeasured: how much task completion actually needed a neural network at decision time, and how much could a fixed integer lookup procedure over verified prior examples already solve for free?",
                    ),
                    (
                        "analogy_spotlight",
                        "A SCIENTIFIC PLACEBO FOR AGENTS",
                        "Anti-Cheating Rules and Public Randomness",
                        "Just as clinical drug trials seal their treatment protocols before patients enroll, we anchored our frozen lookup store's digital fingerprint onto Bitcoin calendar proofs before public randomness beacons existed, and capped per-task helper code at four kilobytes and fifty thousand operations so no hidden solver could sneak inside.",
                    ),
                    (
                        "state_cascade",
                        "EIGHT INTEGER STEPS, FIVE LANGUAGES",
                        "Zero Floating-Point Drift, Zero Model Calls",
                        "At test time, the control loop observes an input, reduces features using pure sixty-four-bit signed integers with zero floating-point instructions, probes a read-only memory-mapped hash table in half a microsecond, and acts with zero model calls. Rust, Go, Python, Julia, and C plus plus match bit-for-bit across one million records.",
                    ),
                    (
                        "equation_curve",
                        "WHEN UNSEEN PATTERNS RUN DRY",
                        "Unseen Pattern Rate Predicts Neural Value",
                        "Subtracting control accuracy from neural accuracy reveals a sharp boundary governed by how often genuinely unseen patterns arrive in the workload stream. Where structural templates saturate early, frozen integer lookup matches giant models at zero call cost; where open-world software recombines freely, neural synthesis shines and then seeds future instant lookups.",
                    ),
                    (
                        "cutaway_3d",
                        "3D FROZEN STORE & BEACON LATTICE",
                        "Immutable Checksums and Paired Arms",
                        "This three-dimensional crystal depicts our frozen binary lookup table locked before public randomness rounds existed. Paired evaluation lanes route every fresh test problem simultaneously to zero-model controls, classical deductive solvers, local open-weight models on Apple Silicon, and six multi-vendor cloud frontier systems under identical scoring rules.",
                    ),
                    (
                        "benchmark_bars",
                        "FOUR THOUSAND THIRTY HELD-OUT TESTS",
                        "Bounded Parity, Proof Loops & GitHub Fixes",
                        "Single-turn cloud models beat the frozen table on just one of ten bounded cells, while multi-turn clause feedback solved fifty of fifty logic formulas that a free classical solver also closed. Across public coding suites and six real upstream repository bugs—five patched and replayed at zero model calls—frontier models leaped up to ninety-five points ahead.",
                    ),
                    (
                        "falsifier_audit",
                        "STRICT ENERGY AND SCOPE HONESTY",
                        "Chip Counters Kept Separate From Cloud Servers",
                        "Every measurement boundary stays completely transparent from start to finish. Local workstation energy comes from built-in Apple chip counters rather than an external wall meter, closed cloud server watts are recorded strictly as unavailable instead of guessed from fleet averages, and busy-host baseline drift drops net subtractions automatically.",
                    ),
                ],
            },
        },
    },
    {
        "id": "satb-harness",
        "title": "Satiation Benchmark: Reference Harness, Adapters, and Telemetry Attribution",
        "short_title": "Satiation Benchmark Harness",
        "category": "Null & Benchmarks",
        "paper_url": "/papers/satb-harness/",
        "pdf_url": "/pdfs/satb-harness.pdf",
        "figures_url": "/living/satb-harness/",
        "about_url": "/about/satb-harness/",
        "tutorial_lab_id": "lab-07-deterministic-null",
        "cutaway_3d": "08_dnull_drand_crystal",
        "epistemic_tags": ["T", "E"],
        "plain_bullets": [
            "Changing the wrapper around an AI model can swing scores as much as swapping the model.",
            "This test harness locks prompts, memory trimming, and tools so every AI takes the exact same exam.",
            "Across five computer types, it separates real board sensors from chip counters and blocks noisy power estimates.",
        ],
        "analogy": (
            "Uneven Track & Fuzzy Split Bills",
            "Wrapping the same model in a different prompt loop moved scores 17 points, while splitting power by CPU time erred by 90 percent.",
            "Same Exam & Labeled Meters",
            "One locked Rust wrapper gives every model identical rules and labels board sensors separately from built-in chip counters.",
            "Fair benchmarks hold the wrapper steady and refuse to guess when background noise muddies power readings.",
        ),
        "headline_metric": "12 of 12 Checks · 5 Computers · 0 Replay Drift",
        "energy_tier": "Board Sensor + Chip Counter",
        "energy_disclosure": "Board power shunts on Tegra kit plus chip counters on four hosts; never summed.",
        "nodes": [
            ("Wrapper & Sensor Confusion", "Different wrappers shift scores 17 points", "rose"),
            ("Locked Sequential Wrapper", "Fixed memory trimming without extra AI calls", "cyan"),
            ("Single Audited Tool Proxy", "Tests raw models and external agents alike", "amber"),
            ("Honest Five-Host Metering", "12 checks pass with zero byte differences", "emerald"),
        ],
        "equation": (
            "CPU Share Power Guess Error = 32.6% to 89.9% on Mixed Workloads",
            "Splitting server energy by CPU time fails when storage or graphics run; noisy baselines get withheld.",
            "cascade_drop",
        ),
        "bars": [
            ("Naive CPU Share Power Split", 90, "32.6% to 89.9% attribution error", "rose"),
            ("Cloud Zero-Temperature Repeat", 13, "Drifted across repeated identical calls", "amber"),
            ("Locked Harness 5-Host Replay", 100, "12 / 12 checks · 0 byte differences", "emerald"),
        ],
        "cutaway_labels": [
            ("Tegra Board Power Shunts", "Direct processor and graphics rail joules", "amber"),
            ("Zero-Drift Transcript Replay", "149,747 bytes match across 3 OS families", "emerald"),
            ("Five Computer Archetypes", "macOS, Linux workstations, and Windows 11", "cyan"),
            ("Noise Withholding Guard", "Drops net power claims when hosts are busy", "rose"),
        ],
        "falsifier": (
            "Shared-Host Noise & Missing Cloud Joules Disclosed",
            "All five computers matched byte-for-byte on replay, exposed CPU share power errors up to 89.9 percent, and cleaned up tasks in milliseconds.",
            "Because background jobs shared the machines, net subtracted power is withheld, and closed cloud or locked Windows CPU watts stay blank.",
            "5 COMPUTERS AUDITED",
        ),
        "tiers": {
            "15s": {
                "hook": "How to stop agent wrappers and sloppy power estimates from distorting AI benchmark leaderboards.",
                "scenes": list(_SATB_OPENING),
            },
            "45s": {
                "hook": "Why swapping an agent's software wrapper shifted scores by 17 points, and why splitting power by CPU time errs by 90 percent.",
                "scenes": list(_SATB_OPENING) + [
                    (
                        "analogy_spotlight",
                        "SAME RUNNER, DIFFERENT TRACK",
                        "17-Point Score Swing & 90% Power Error",
                        "Giving the exact same language model a different command wrapper shifted coding scores by seventeen points, while popular cloud tools that split server power by CPU share erred by up to ninety percent.",
                    ),
                    (
                        "horizon_slate",
                        "FAIR RULES, LABELED SENSORS",
                        "Zero Replay Drift Across Five Computers",
                        "Locking the wrapper in Rust and labeling board sensors separately from chip counters makes model comparisons genuinely reproducible across macOS, Linux, and Windows machines.",
                    ),
                ],
            },
            "90s": {
                "hook": "How our open Rust harness standardizes prompts, sandboxes, and five-host power attribution across macOS, Linux, and Windows 11.",
                "scenes": list(_SATB_OPENING) + [
                    (
                        "analogy_spotlight",
                        "STOP MEASURING THE PLUMBING",
                        "Wrappers and Split Bills Distort Truth",
                        "Imagine timing sprinters on tracks of different lengths and then guessing their calorie burn by shoe size. That happens whenever AI benchmarks mix different history-trimming wrappers and split shared server watts by processor time alone.",
                    ),
                    (
                        "state_cascade",
                        "LOCKED WRAPPER AND PROXY BRIDGE",
                        "Deterministic Trimming + Five-Part Identity",
                        "Our sequential Rust harness fixes six safe workspace tools, trims old outputs above eighty percent window capacity using zero hidden model calls, hashes a five-part system fingerprint, and routes external command-line coding agents through one audited local proxy.",
                    ),
                    (
                        "benchmark_bars",
                        "TESTED LIVE ON FIVE COMPUTERS",
                        "12 Checks Pass · Cloud Drift Exposed",
                        "Across Apple Silicon, Tegra circuit-board power shunts, two Linux workstations, and bare-metal Windows eleven, replay transcripts matched to the exact byte across twelve checks, while live endpoint probes caught cloud models drifting even when temperature was locked to zero.",
                    ),
                    (
                        "horizon_slate",
                        "REFUSING DISHONEST POWER NUMBERS",
                        "Raw Channels Kept · Noisy Splits Dropped",
                        "Physical board shunt joules, built-in chip counters, and logical token counts never get blended into one fuzzy number, and automatic drift checks withhold net attribution whenever background jobs share the host.",
                    ),
                ],
            },
            "180s": {
                "hook": "Full five-computer hardware audit of the Satiation Benchmark harness, deterministic replay, and honest power attribution.",
                "scenes": list(_SATB_OPENING) + [
                    (
                        "hook_contrast",
                        "WHY TWO BENCHMARKS DISAGREE",
                        "Hidden Summarizers and Sloppy Power Math",
                        "When two engineering teams test the exact same AI model and report wildly different pass rates or energy bills, the model itself often is not the cause at all. Hidden conversation summarizers, shell-quoting failures, and uncalibrated power formulas quietly alter the exam behind the scenes without ever appearing on the public leaderboard.",
                    ),
                    (
                        "analogy_spotlight",
                        "STANDARDIZED TRACK, ITEMIZED RECEIPTS",
                        "Holding the Wrapper Constant Across Models",
                        "On a public terminal coding benchmark, changing only the surrounding wrapper shifted the very same model's task score by seventeen percentage points. Our evaluation contract holds one sequential Rust wrapper completely fixed for raw models while auditing third-party coding tools as complete systems behind one local proxy bridge.",
                    ),
                    (
                        "state_cascade",
                        "DETERMINISTIC CONTEXT AND SANDBOXING",
                        "Zero-Call Memory Trimming & Fast Cleanup",
                        "Inside every attempt, the harness executes strictly one tool call at a time inside a network-blocked workspace with eight-kilobyte head-and-tail output caps. Whenever conversation history exceeds eighty percent capacity, it deterministically replaces the oldest tool outputs while keeping the eight newest intact, terminating stray process trees cleanly inside ten milliseconds.",
                    ),
                    (
                        "equation_curve",
                        "WHY CPU SHARE POWER SPLITTING FAILS",
                        "32.6% to 89.9% Error on Real Phases",
                        "Many cloud sustainability dashboards estimate a program's energy bill by multiplying whole-server power by its processor time share. Across sequential compute-and-storage phases and Windows fifteen-millisecond clock ticks, our live hardware audit proved that shortcut misattributes energy by thirty-two point six to eighty-nine point nine percent.",
                    ),
                    (
                        "cutaway_3d",
                        "FIVE COMPUTERS, ONE EXACT CORE",
                        "Physical Rail Shunts to Rootless Counters",
                        "This three-dimensional ring connects five live computers around one deterministic core: a Tegra developer kit wired with physical whole-board and three-channel current shunts, an Apple workstation, two Linux desktops with isolated energy-group permissions, and a bare-metal Windows eleven laptop reading rootless discrete graphics counters with millisecond job cleanup.",
                    ),
                    (
                        "benchmark_bars",
                        "TWELVE CHECKS AND CLOUD DRIFT",
                        "Zero Byte Diffs · 32 Live Endpoint Probes",
                        "All five computers reproduced our million-record lookup checksum and a hundred-fifty-kilobyte fourteen-turn transcript with zero byte or newline differences across operating systems, matched external coding agent completion at up to three-times lower prompt and cache token volume, and caught repeated zero-temperature output drift across three cloud vendors.",
                    ),
                    (
                        "falsifier_audit",
                        "WHAT WE REFUSE TO CLAIM",
                        "Separating Board Shunts, Chip Counters & Blanks",
                        "Physical circuit-board shunt joules on the Tegra kit stay strictly separated from built-in chip counters on the other four machines and are never summed into one blended column. Because background services shared the hosts during capture, net subtracted claims are withheld, and unavailable cloud or unprivileged Windows CPU watts stay honestly blank.",
                    ),
                ],
            },
        },
    },
    {
        "id": "time-as-an-index",
        "title": "Time as an Index: What It Would Take to Look Up Tomorrow",
        "short_title": "Time as an Index",
        "category": "Foundations & Thermodynamics",
        "paper_url": "/papers/time-as-an-index/",
        "pdf_url": "/pdfs/time-as-an-index.pdf",
        "figures_url": "/living/time-as-an-index/",
        "about_url": "/about/time-as-an-index/",
        "tutorial_lab_id": "lab-10-time-index",
        "cutaway_3d": "06_ctc_hellman_torus",
        "epistemic_tags": ["T", "M", "S"],
        "plain_bullets": [
            "Inside a mathematical time loop, almost every digital lock would break at once except a one-time secret pad.",
            "In known physics, no quantum trick, analog circuit, or reported anomaly sends readable answers backward in time.",
            "Every fast lookup of a future answer is work paid upfront, which fresh random values defeat immediately.",
        ],
        "analogy": (
            "Looking Up Tomorrow's Answer",
            "Digital security assumes nobody can flip ahead to the last page of a calculation without running the steps in between.",
            "Cheat Sheets Paid in Advance",
            "Every real shortcut is a giant lookup table computed ahead of time, trading memory space against search time.",
            "Add a fresh random value at the start, and every pre-built cheat sheet becomes useless.",
        ),
        "headline_metric": "31 Machine-Checked Proofs · 0 Time Shortcuts",
        "energy_tier": "Physics Math Bound",
        "energy_disclosure": "Mathematical proofs and physics simulations only; no hardware power meter used.",
        "nodes": [
            ("Could Tomorrow Have an Address?", "If so, digital locks would open at once", "rose"),
            ("Quantum & Analog Limits", "No backward signals; discarded runs pile up", "cyan"),
            ("Upfront Lookup Tables", "Fast search only after full prior work", "amber"),
            ("Fresh Random Salt Wins", "0% table reuse when questions stay fresh", "emerald"),
        ],
        "equation": (
            "Lookup Time × Memory Squared = Total Search Space Squared",
            "Fast table lookups must pay the full search upfront and fail when fresh randomness arrives.",
            "hellman_tradeoff",
        ),
        "bars": [
            ("Hash Shortcut Frequency Scan", 0, "0 / 65,536 bins show hidden shortcuts", "emerald"),
            ("Salted Fresh-Challenge Reuse", 0, "0.0% precomputed table hits on 200 runs", "cyan"),
            ("Machine-Checked Math Proofs", 100, "31 / 31 Lean 4 theorems · 0 gaps", "amber"),
        ],
        "cutaway_labels": [
            ("Theoretical Time-Loop Ring", "Breaks math ciphers; spares one-time pads", "rose"),
            ("Light-Speed Causal Horizon", "Blocks backward messages in real physics", "emerald"),
            ("Precomputed Lookup Cube", "Trades memory size against lookup speed", "amber"),
            ("195 Audited Anomaly Cases", "Zero verified signals from the future", "cyan"),
        ],
        "falsifier": (
            "Formal Time Loops Separated from Laboratory Physics",
            "Thirty-one machine-checked Lean 4 proofs, 65,536 hash tests, and 195 audited reports confirm zero free shortcuts into tomorrow.",
            "This study claims zero hardware power measurements and zero harvestable vacuum energy over any closed physical cycle.",
            "31 PROOFS VERIFIED",
        ),
        "tiers": {
            "15s": {
                "hook": "What would happen to digital security if tomorrow's calculations could be looked up like a table today?",
                "scenes": list(_TIME_OPENING),
            },
            "45s": {
                "hook": "Why modern passwords and digital locks depend on tomorrow having no lookup address, and how fresh randomness protects them.",
                "scenes": list(_TIME_OPENING) + [
                    (
                        "analogy_spotlight",
                        "PRE-PRINTED PUZZLE CHEAT BOOKS",
                        "Why Fresh Dice Defeat Precomputation",
                        "You can print a giant answer book for fixed puzzles only by solving every single puzzle ahead of time. Roll fresh dice right before asking the question, and that entire pre-printed book stops working.",
                    ),
                    (
                        "horizon_slate",
                        "SECURITY BOUND TO THE PRESENT",
                        "31 Verified Proofs · Fresh Randomness Wins",
                        "Thirty-one machine-checked mathematical proofs confirm that without physical time loops, fresh random challenges and information-theoretic one-time secret pads keep future states safely unindexed.",
                    ),
                ],
            },
            "90s": {
                "hook": "Testing whether future states can be indexed across time-loop math, quantum physics, 31 Lean 4 proofs, and 195 anomaly reports.",
                "scenes": list(_TIME_OPENING) + [
                    (
                        "analogy_spotlight",
                        "FLIPPING TO THE LAST PAGE",
                        "The Hidden Premise Behind Digital Locks",
                        "Every password hash, digital signature, and time-locked puzzle assumes nature offers no index into the end of a calculation without running the steps in between. If future states had addresses, sequential brute-force security would vanish overnight.",
                    ),
                    (
                        "state_cascade",
                        "FOUR WAYS PEOPLE TRY TO SKIP TIME",
                        "Time Loops, Quantum Postselection, Analog, Tables",
                        "We audited four candidate shortcuts: mathematical time loops, quantum retrocausal circuits, analog settling hardware, and precomputed lookup tables. Outside theoretical time loops, every apparent shortcut pays upfront in discarded runs, exponential energy noise, or full prior search.",
                    ),
                    (
                        "benchmark_bars",
                        "PROOFS, SPECTRA & 195 CATALOG CASES",
                        "Zero Frequency Leaks · Zero Future Signals",
                        "Thirty-one machine-checked theorems verify our horizon bounds with zero unproven gaps, sixty-five thousand five hundred thirty-six cryptographic hash tests show zero frequency shortcuts, and auditing one hundred ninety-five anomaly and paradox reports leaves zero verified signals from tomorrow.",
                    ),
                    (
                        "horizon_slate",
                        "HOW TO LOCK WORK TO TODAY",
                        "Fresh Salts & Previous-Block Randomness",
                        "Adding a fresh random value at query time dropped precomputed table hits from thirty-four percent all the way down to zero across two hundred trials, binding computation firmly to the present moment.",
                    ),
                ],
            },
            "180s": {
                "hook": "Three-minute journey through time-loop complexity, quantum no-signalling, Hellman space-time tradeoffs, and 195 audited anomalies.",
                "scenes": list(_TIME_OPENING) + [
                    (
                        "hook_contrast",
                        "WHAT PROTECTS A DIGITAL SECRET?",
                        "Unindexed Future States vs Brute Search",
                        "Software already indexes recorded history in temporal databases and deterministic replay debuggers. So what stops a machine from indexing tomorrow's state the exact same way? If future states could be queried directly like rows in a table, public-key signatures, symmetric block ciphers, and proof-of-work puzzles would shatter in one query.",
                    ),
                    (
                        "analogy_spotlight",
                        "SELF-CONSISTENT LOOPS VS REAL LABS",
                        "Why Nature Charges Full Price Outside Loops",
                        "In formal time-loop math, forcing a classical or quantum bit sent into its own past to return unchanged creates a self-consistent fixed point that surfaces hard answers without running the search—sparing only information-theoretic one-time pads whose random keys carry zero mathematical link to the secret message.",
                    ),
                    (
                        "state_cascade",
                        "AUDITING QUANTUM AND ANALOG SHORTCUTS",
                        "No-Signalling, Postselection & Settling Costs",
                        "In real laboratory physics, quantum delayed-choice experiments obey exact marginal no-signalling so future measurement choices never shift earlier statistics. Postselected teleportation discards exponentially many failed trials—needing four thousand ninety-six runs on six-bit circuits where simple guessing needs thirty-two—while analog settling hardware shifts exponential hardness into thermal noise or frequency precision.",
                    ),
                    (
                        "equation_curve",
                        "THE SPACE-TIME PRECOMPUTATION LAW",
                        "Trading Memory Against Online Search Steps",
                        "Without physical time loops, every working fast lookup of a deterministic function is precomputation paid in advance. Online lookup steps multiplied by squared memory equals the squared state space, achieved only after paying the full exhaustive table fill upfront and dissipating nature's minimum heat floor for every erased bit.",
                    ),
                    (
                        "cutaway_3d",
                        "3D CAUSAL HORIZON & LOOKUP TORUS",
                        "Closed Loops Contrasted With Light Cones",
                        "This three-dimensional torus contrasts theoretical closed time loops along the outer ring against relativistic light-cone causal horizons and upfront lookup cubes at the center, illustrating visually why rewriting past steps incurs causal replay overhead and why no precomputed table can index a fresh random salt chosen after setup.",
                    ),
                    (
                        "benchmark_bars",
                        "31 PROOFS, HASH SCANS & 195 LEDGER ROWS",
                        "Zero Spectral Shortcuts · Zero Future Leaks",
                        "Lean four mechanically checked thirty-one horizon and paradox theorems with zero unproven placeholders or custom axioms. Sixty-five thousand five hundred thirty-six consecutive cryptographic digests showed zero anomalous frequency bins, fresh block challenges drove table reuse from thirty-four percent down to zero, and auditing one hundred ninety-five anomaly and paradox entries found zero future signals.",
                    ),
                    (
                        "falsifier_audit",
                        "CLEAR EPISTEMIC & ENERGY BOUNDARIES",
                        "Math Proofs Distinguished From Physical Claims",
                        "Every substantive claim across the study carries an explicit tag separating established physics, machine-checked theorems, testable conjectures, and debunked folklore. No hardware power sensor was attached, no real-world time loop is claimed in nature, and net vacuum energy harvest over any closed physical cycle equals strictly zero.",
                    ),
                ],
            },
        },
    },
    {
        "id": "communication-avalanche",
        "title": "The Communication Tool Avalanche: Thresholded Signal Externalization, Event-Driven Orchestration, and Coherence per Joule",
        "short_title": "The Communication Tool Avalanche",
        "category": "Communication Avalanche & Bio",
        "paper_url": "/papers/communication-avalanche/",
        "pdf_url": "/pdfs/communication-avalanche.pdf",
        "figures_url": "/living/communication-avalanche/",
        "about_url": "/about/communication-avalanche/",
        "tutorial_lab_id": "lab-04-digital-enzymatic",
        "cutaway_3d": "02_bio_sepj_neural_ratchet",
        "epistemic_tags": ["T", "E", "M", "S"],
        "plain_bullets": [
            "From ancient microbes to modern AI, groups scale by sharing signals across strict thresholds and safety gates.",
            "Event-driven wakeups and signed checks block bad edits and deliver far more verified work per joule.",
            "Ten AI approaches unite through tiny compiled routines, while future brain links stay grounded in strict consent.",
        ],
        "analogy": (
            "Open-Mic Group Rumors",
            "Chaining four unverified AI agents bloats messages nearly fourfold and lets broken code slip through eight times in sixty.",
            "Watertight Safety Bulkheads",
            "Like microbial pores that slam shut when a cell ruptures, fast cryptographic gates isolate bad signals in microseconds.",
            "Quiet event wakeups and verified handoffs turn noisy crowds into reliable collective intelligence.",
        ),
        "headline_metric": "59 of 60 Fixes · 0 Bad Commits · 98% Combined",
        "energy_tier": "Board Sensor + Chip Counter",
        "energy_disclosure": "Tegra board power shunts plus chip counters across four workstations; separated.",
        "nodes": [
            ("Noisy Unchecked Agent Chains", "Errors snowball and idle polling burns watts", "rose"),
            ("Share Above Threshold Only", "Sleep quietly until real work arrives", "amber"),
            ("Verify Every Handoff Fast", "26-microsecond signature check blocks faults", "cyan"),
            ("Lock In Reusable Routines", "98 of 100 solved across ten AI methods", "emerald"),
        ],
        "equation": (
            "Verified Work per Joule = Confirmed Fixes / (Compute + Chat + Idle Energy)",
            "Event wakeups and fast signature gates stop error snowballs and slash wasted chatter.",
            "hill_switch",
        ),
        "bars": [
            ("Unchecked 4-Agent Chat Chain", 18, "52 / 60 pass · 8 broken commits", "rose"),
            ("Single Giant Frontier Model", 48, "59 / 60 pass · 902.5 joules spent", "amber"),
            ("Gated Event-Driven Team", 98, "59 / 60 pass · 0 broken · 14.97x efficiency", "emerald"),
        ],
        "cutaway_labels": [
            ("Microbial Safety Pore", "Closes in 0.3s · saves 95% of colony", "emerald"),
            ("26-Microsecond Gate Check", "Blocks 200 of 200 corrupted messages", "cyan"),
            ("Ten-Method Compiled Bridge", "Lifts solo 49% ceiling to 98% pass", "amber"),
            ("Consent-First Brain Guard", "45 Lean 4 proofs · animal vs human split", "emerald"),
        ],
        "falsifier": (
            "Animal Models Separated from Human Brain Limits",
            "Forty-five Lean 4 proofs and five-computer tests confirm 200 of 200 fault blocks, 59 of 60 repairs, and 98 of 100 ten-method synthesis.",
            "Human brain implants read roughly 15 to 19 bits per second today, and all 16 cellular vesicle rescue studies remain preclinical animal tests.",
            "45 PROOFS · 5 HOSTS",
        ),
        "tiers": {
            "15s": {
                "hook": "One scaling rule connects ancient bacteria, multi-agent AI teams, and consent-gated brain interfaces.",
                "scenes": list(_AVALANCHE_OPENING),
            },
            "45s": {
                "hook": "Why chatty multi-agent AI teams snowball errors, and how nature's watertight safety gates fix orchestration.",
                "scenes": list(_AVALANCHE_OPENING) + [
                    (
                        "analogy_spotlight",
                        "WATERTIGHT PORES VS RUMOR CHAINS",
                        "Nature Never Shares Without a Circuit Breaker",
                        "Chaining four unchecked AI agents acts like a noisy game of telephone, letting eight broken code edits slip through out of sixty. Living cell colonies survive by slamming microscopic pores shut the instant a neighbor ruptures.",
                    ),
                    (
                        "horizon_slate",
                        "MORE VERIFIED WORK PER JOULE",
                        "59 of 60 Fixes · Zero Broken Commits",
                        "Combining quiet event wakeups with twenty-six-microsecond cryptographic checks matched a giant model's fifty-nine of sixty repairs while delivering nearly fifteen times better verified work per joule than unchecked chains.",
                    ),
                ],
            },
            "90s": {
                "hook": "Tracing nature's three-step communication ratchet across 3.8 billion years of biology, 76 years of AI, and five computer hosts.",
                "scenes": list(_AVALANCHE_OPENING) + [
                    (
                        "analogy_spotlight",
                        "ANCIENT MICROBES TO AGENT SWARMS",
                        "Quorum Thresholds and 0.3-Second Safety Plugs",
                        "Bacteria save up to ninety-nine percent of signaling energy by waiting for a chemical quorum before acting, and filamentous microbes seal damaged neighbors in zero point three seconds—saving ninety-five percent of the colony versus zero percent without gates.",
                    ),
                    (
                        "state_cascade",
                        "SHARE, GATE, AND LOCK IN GAINS",
                        "Event Wakeups + 26-Microsecond Signatures",
                        "Our orchestrator applies that exact three-phase ratchet to software agents: sleep at zero polling cost until incoming signals cross a threshold, verify signed envelopes in twenty-six microseconds, and compile solved discoveries downward into tiny reusable digital routines.",
                    ),
                    (
                        "benchmark_bars",
                        "60 CODE REPAIRS & 10 AI PARADIGMS",
                        "59/60 Verified · 98/100 Combined Synthesis",
                        "On sixty Python code repairs, gated routing hit fifty-nine passes with zero bad commits and contained all two hundred injected channel faults. Across a hundred-task suite where ten isolated AI approaches each stalled below forty-nine percent, compiled synthesis reached ninety-eight percent.",
                    ),
                    (
                        "horizon_slate",
                        "STRICT CONSENT & CLINICAL REALISM",
                        "45 Lean Proofs · Animal vs Human Evidence",
                        "Forty-five machine-checked mathematical proofs guarantee strict opt-in autonomy for future neural interfaces while clearly separating preclinical rodent cellular rescue studies from unproven human clinical treatments today.",
                    ),
                ],
            },
            "180s": {
                "hook": "Full documentary across 24 evolutionary rungs, 38 AI history milestones, five-host shunt telemetry, and consent-gated brain interfaces.",
                "scenes": list(_AVALANCHE_OPENING) + [
                    (
                        "hook_contrast",
                        "WHY BIGGER BRAINS ALONE PLATEAU",
                        "Isolated Size vs Gated Communication",
                        "Across three point eight billion years of biological evolution and seventy-six years of artificial intelligence, simply growing an isolated cell or single model hits steep metabolic walls long before complex problems are solved. Yet wiring unverified AI chatbots into an open group chat backfires badly, multiplying errors down the chain while constant polling burns watts.",
                    ),
                    (
                        "analogy_spotlight",
                        "BIOLOGY'S THREE-PHASE RATCHET",
                        "Quorum Switches, Nanopores & Flocks",
                        "Pre-registered simulations across twenty-four evolutionary transitions confirm one conserved scaling operator: bacteria save ninety-nine percent of metabolic cost behind quorum thresholds, calcium-gated pores lift colony survival from zero to ninety-five percent, topological flocks stay connected under fourfold expansion, and verified external archives preserve one hundred percent of cultural skill.",
                    ),
                    (
                        "state_cascade",
                        "EVENT WAKEUPS & DIGITAL ENZYMES",
                        "Unifying Ten Siloed AI Schools",
                        "Auditing thirty-eight AI milestones from early expert systems to modern language models reveals why isolated paradigms stall. Replacing verbose natural-language chat handoffs with twenty-six-microsecond cryptographic checks, quiet kernel event wakeups, and tiny compiled binary routines makes cross-agent handoffs more than seventy-five thousand times leaner and faster.",
                    ),
                    (
                        "equation_curve",
                        "MEASURING VERIFIED WORK PER JOULE",
                        "Counting Compute, Messaging & Idle Drain",
                        "Coherence per joule divides confirmed task completions by compute, messaging, and idle energy combined across every participant. Zero-clock event wakeups eliminate empty polls and cut Linux socket energy more than twofold compared with thousand-hertz polling, while minimum-cost flow routing automatically bypasses corrupted channels in just two point four microseconds.",
                    ),
                    (
                        "cutaway_3d",
                        "3D NANOPORE & OPT-IN NEURAL BRIDGE",
                        "Biological Circuit Breakers Meet Silicon Gates",
                        "This three-dimensional cutaway pairs a calcium-gated cyanobacterial pore assembly on the left with an opt-in multi-electrode neural bridge on the right, showing visually why reversible physical and cryptographic circuit breakers must stand in place before living cells, software agents, or future neural interfaces ever share state.",
                    ),
                    (
                        "benchmark_bars",
                        "FIVE COMPUTERS & TEN AI CAMPS",
                        "59/60 Code Fixes · 98/100 Unified Score",
                        "Tested across five computers—including direct Tegra circuit-board power shunts measuring nine hundred twenty-seven microjoules per signed kilobyte edge—gated orchestration matched fifty-nine of sixty code fixes at twice a giant model's efficiency, contained all two hundred injected faults, and lifted ten-method synthesis from forty-nine to ninety-eight percent.",
                    ),
                    (
                        "falsifier_audit",
                        "FORTY-FIVE PROOFS & MEDICAL HONESTY",
                        "Separating Shunt Joules, Chip Counters & Hype",
                        "Forty-five zero-gap Lean four theorems prove opt-in autonomy invariants that block coercive neural input without custom axioms. Tegra board shunt joules stay strictly separated from workstation chip counters, current human intracortical readout is stated honestly at fifteen to nineteen bits per second, and all sixteen cellular vesicle studies remain preclinical animal models.",
                    ),
                ],
            },
        },
    },
    {
        "id": "lut-adapt",
        "title": "Downward LUT6 Compilation in a Mixture of Limits Cascade: Beneš-Routed Boolean Fabrics, Conformal Wake Gates, and Frontier Sparse-MoE NVMe Streaming",
        "short_title": "Downward Lookup Compilation",
        "category": "Hardware, Silicon & OS",
        "paper_url": "/papers/lut-adapt/",
        "pdf_url": "/pdfs/lut-adapt.pdf",
        "figures_url": "/living/lut-adapt/",
        "about_url": "/about/lut-adapt/",
        "tutorial_lab_id": "lab-09-lut6-benes",
        "cutaway_3d": "01_silicon_kv260_lut6",
        "epistemic_tags": ["T", "E", "M"],
        "plain_bullets": [
            "Most requests repeat solved patterns, so running a giant neural network every time wastes memory and energy.",
            "This cascade checks tiny truth tables first and streams specialist model slices from storage only when needed.",
            "Once an automated test certifies a new answer, it compiles downward into a reusable millisecond skill.",
        ],
        "analogy": (
            "Reloading the Whole Library",
            "Keeping a 35-billion-parameter coding model wired in memory normally demands 66 gigabytes even for routine edits.",
            "Stream Once, Compile to Reflex",
            "Stream only the needed 4-bit specialist weights in 970 megabytes, verify the fix, and compile it into a fast table.",
            "Big models handle novel surprises while certified answers turn into instant, zero-mistake reflexes.",
        ),
        "headline_metric": "970 MB Active RAM · 91.7% Verified · 0% Broken",
        "energy_tier": "Chip Energy Counter",
        "energy_disclosure": "Built-in Apple chip counters and simulated circuit estimates; no board shunt.",
        "nodes": [
            ("66-Gigabyte Memory Wall", "Re-running giant models wastes RAM and watts", "rose"),
            ("Fast Truth-Table Rung", "0.15-millisecond Rust lookup checks first", "cyan"),
            ("Stream Specialist Slices", "35-billion model runs in 970 MB RAM", "amber"),
            ("Compile Certified Skills", "91.7% verified pass · 0% broken edits", "emerald"),
        ],
        "equation": (
            "Compile Downward When Repeat Savings Exceed One-Time Compilation Cost",
            "Streaming 4-bit specialists cuts storage reads 12.3x while certified replays take milliseconds.",
            "cascade_drop",
        ),
        "bars": [
            ("Full 16-Bit Model in Memory", 100, "66 GB RAM required continuously", "rose"),
            ("Streamed 35-Billion Specialist", 15, "970 MB RAM · 12.3x less storage traffic", "amber"),
            ("Compiled Skill Replay", 3, "0.15 ms lookup · 0% broken commits", "emerald"),
        ],
        "cutaway_labels": [
            ("81 Dual-Port Memory Blocks", "Holds hot-swappable truth-table pages", "cyan"),
            ("Non-Blocking Switch Fabric", "Routes 480 table inputs without rewiring", "amber"),
            ("4-Stage 250 MHz Pipeline", "Cuts simulated idle switching power 4.1x", "emerald"),
            ("120-Billion Scale Ceiling", "22.2 tokens/s · 62.5% verified hard suite", "amber"),
        ],
        "falsifier": (
            "Chip Counters & Circuit Simulation vs Board Power",
            "Twenty-seven Lean 4 proofs, 970 MB 35-billion streaming, 22.2 tokens/s at 120-billion scale, and 0% broken commits all held.",
            "Hardware logic figures come from cycle-accurate simulation rather than a wired circuit-board power shunt in this repository.",
            "27 PROOFS · 0% BROKEN",
        ),
        "tiers": {
            "15s": {
                "hook": "How to run giant coding models inside tiny laptop memory and turn verified answers into millisecond reflexes.",
                "scenes": list(_LUT_OPENING),
            },
            "45s": {
                "hook": "Like turning slow sheet-music reading into instant piano muscle memory, while holding a 35-billion model in 970 megabytes.",
                "scenes": list(_LUT_OPENING) + [
                    (
                        "analogy_spotlight",
                        "FROM SHEET MUSIC TO MUSCLE MEMORY",
                        "Stop Paying 66 Gigabytes for Routine Work",
                        "Learning a tough piano measure takes slow concentration once, then turns into effortless muscle memory. Yet computers usually keep sixty-six gigabytes of neural weights wired in RAM just to solve recurring coding bugs.",
                    ),
                    (
                        "horizon_slate",
                        "970 MEGABYTES & ZERO BROKEN CODE",
                        "Stream on Surprise · Replay in Milliseconds",
                        "Streaming four-bit specialist slices holds a thirty-five-billion-parameter model inside nine hundred seventy megabytes of active RAM while compiling verified fixes downward into sub-millisecond lookups with zero broken code edits.",
                    ),
                ],
            },
            "90s": {
                "hook": "Inside our four-step downward compilation cascade: truth-table lookups, 970-megabyte model streaming, and zero broken commits.",
                "scenes": list(_LUT_OPENING) + [
                    (
                        "analogy_spotlight",
                        "THINK HARD ONCE, REMEMBER FAST",
                        "Breaking Both Memory and Repeat-Compute Walls",
                        "Local developer workstations hit two steep walls at the exact same time: giant coding models normally demand tens of gigabytes of wired memory, and re-running them from scratch on repeating software bugs wastes energy over and over again.",
                    ),
                    (
                        "state_cascade",
                        "FOUR TIERS PLUS SLEEP COMPILER",
                        "Tables -> Sequence State -> Novelty Gate -> Model",
                        "Incoming requests first check a zero-multiply Boolean truth-table switch and a tiny constant-size sequence memory. A calibrated novelty detector wakes four-bit storage-streamed models up to a hundred twenty billion parameters only on unfamiliar problems, then compiles certified wins downward.",
                    ),
                    (
                        "benchmark_bars",
                        "91.7% VERIFIED & 12.3X LESS STORAGE READ",
                        "970 MB RAM on 35B · 22.2 Tokens/s on 120B",
                        "Custom Apple Metal and portable Rust GPU shaders cut unbuffered flash storage reads twelve point three times at exact token parity, reaching ninety-one point seven percent verified coding pass and fifty percent on real symbolic math repositories with zero broken commits.",
                    ),
                    (
                        "horizon_slate",
                        "PROVEN SAFE BY 27 MATH THEOREMS",
                        "Model Guesses Never Fake Guaranteed Rules",
                        "Twenty-seven machine-checked mathematical proofs guarantee lossless target verification on every emitted token and ensure statistical wake tables are never silently mislabeled as exact deterministic rules across deployments.",
                    ),
                ],
            },
            "180s": {
                "hook": "Three-minute architectural tour of non-blocking Boolean switch fabrics, 970-megabyte 35-billion streaming, 120-billion scaling, and 27 Lean proofs.",
                "scenes": list(_LUT_OPENING) + [
                    (
                        "hook_contrast",
                        "INVERTING THE AI MEMORY PYRAMID",
                        "Why Keep Billions of Weights Hot in RAM?",
                        "Running a thirty-five-billion-parameter coding model locally normally locks up sixty-six gigabytes of sixteen-bit memory even when most incoming edits repeat familiar patterns. Static hardware lookup networks hit the opposite wall: whenever real-world input traffic shifts, rewiring chip logic from scratch takes hours of vendor synthesis.",
                    ),
                    (
                        "analogy_spotlight",
                        "HOT-SWAPPABLE MUSCLE MEMORY",
                        "Specialist Paging Plus Instant Reflex Pages",
                        "Picture an experienced surgeon who checks fast laminated checklists for routine steps, pulls only the exact specialist manual chapter from storage for rare cases, and compiles every newly verified procedure into a fresh checklist card overnight without ever halting or rebuilding the operating room.",
                    ),
                    (
                        "state_cascade",
                        "FOUR RUNGS AND CONFORMAL GATING",
                        "0.15-Millisecond Rust Lookup to 120B Apex",
                        "A single-binary Rust server checks truth-table and canonical skill pages in zero point one five milliseconds—seventeen times faster than Python—then steps up to forty-eight-kilobyte state-space tracking, runs an adaptive statistical novelty gate that caught shifted traffic with zero false risk, and wakes large specialist models only last.",
                    ),
                    (
                        "equation_curve",
                        "WHEN DOWNWARD COMPILATION PAYS OFF",
                        "12.3x Less Flash Traffic · Exact Token Parity",
                        "Twenty-seven Lean four theorems prove downward compilation saves net energy whenever recurring hits over a stationary horizon outweigh one-time synthesis cost, and prove joint truth-table synthesis avoids invalid blended tokens. Unbuffered four-bit specialist streaming plus truth-table drafting cuts flash reads twelve point three times inside nine hundred seventy megabytes at exact token parity.",
                    ),
                    (
                        "cutaway_3d",
                        "3D SWITCH FABRIC & MEMORY BLOCKS",
                        "81 Dual-Port Memories · 4-Stage 250 MHz Core",
                        "This three-dimensional chip layout shows eighty-one dual-port block memories feeding eighty six-input truth tables across a forty-three-stage non-blocking multicast switch fabric that swaps shadow pages in one cycle without vendor rewiring. Clock-enable bubble gating shrinks single-cycle logic depth fourfold and cuts simulated idle switching power four point one times at two hundred fifty megahertz.",
                    ),
                    (
                        "benchmark_bars",
                        "FROM 35B STREAMING TO 120B APEX",
                        "91.7% Bakeoff · 90.6% Public Coding · 0% Broken",
                        "Gating every candidate code patch behind automated unit tests reached ninety-one point seven percent on our forty-eight-task bakeoff, ninety point six percent on public function coding, two-point-five-times standalone pass across four open-source repositories, and twenty-two point two tokens per second with sixty-two point five percent verified pass on a hundred-twenty-billion-parameter model.",
                    ),
                    (
                        "falsifier_audit",
                        "SIMULATION VS PHYSICAL BOARD POWER",
                        "Honest Boundaries on Chip Counters & Timing",
                        "Every measurement boundary stays completely explicit from software to silicon: workstation joules come from built-in Apple and Linux chip counters, hardware switching milliwatts come from cycle-accurate waveform activity rather than an isolated circuit-board power shunt or commercial post-route timing signoff in this repository, and zero broken commits ever cross the gate.",
                    ),
                ],
            },
        },
    },
]
