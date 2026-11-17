---
title: "A Planet You Can Take Apart: A Whole World as a Function and an Edit Log, Played Through the Ideas of AI"
deck: "Can a browser game let players reach every place on and inside a planet, down to the elements in its rock, and make the ideas of modern artificial intelligence the way it is played? The planet is too large to store, so it must be computed from a seed and a log of edits. It is chaotic, so that computation must be exact. Its physics, information and free-energy structure give each AI idea a mechanic a player can touch."
id: planet
status: "Research study"
author: "David Charlot, Open Interface Engineering"
figures: "/figures/planet/query.svg"
pdf: "/pdfs/planet.pdf"
board_metered: false
---

# A Planet You Can Take Apart: A Whole World as a Function and an Edit Log, Played Through the Ideas of AI

*{{revision}}.*

## Abstract

This study asks what it takes to build a game, running in a web browser, in which every place on and inside a whole planet can be visited, dug into and examined down to the chemical elements in its rock, and in which the ideas of modern artificial intelligence (AI) are the mechanics a player uses. Arithmetic settles the architecture before any source is consulted: the planet cannot be stored, so it must be a pure function of a seed plus an append-only log of player edits. Chaos settles the next step: because the simulated planet amplifies small differences, that function and its log must give bit-identical results on every machine. Inside those two constraints, physics, information theory, energy minimisation and the free energy principle each supply a working part of the engine, and each part is also a mechanic that teaches one AI idea. Nothing has been built. The study gives the arithmetic, the design, a catalogue of mechanics, a falsifier-first test plan and a list of what is infeasible.

**In plain words**

1. An Earth-sized planet at one byte per cubic metre would need about a zettabyte. No game can store that, so the planet has to be a formula that answers "what is here?" for any position, plus a list of what players changed.
2. Small changes grow on a planet with weather. If two computers compute the formula slightly differently, a tunnel dug on one opens into solid rock on the other. The formula must be exact; only the pictures may differ.
3. The same structure that makes the planet work, prediction, compression, energy and surprise, is how modern AI works. Each of those ideas becomes something the player does with their hands.

![Diagram of the proposed planet. In the exact zone at the top, a green box "Seed plus generator G" (a pure function of seed and cell, in integer or fixed-point arithmetic) and a green box "Edit log D" (append-only, keyed by cell, ordered by tick) feed a blue box "Query W of x and t", defined as the last edit at x before t, else G of seed and x, which returns a material id. The query feeds a blue "Composition table" mapping material id to the mass fraction of each element, and a green "Active region" in which only cells near players tick, appending results to D. A dashed red line separates this from the tolerance zone below: level of detail (a cube-sphere quadtree of about 24 levels from a cube face to one metre), camera-relative rendering in 32-bit offsets with reversed or logarithmic depth, and cosmetic detail such as grass, clouds and particles that gameplay never reads.](/figures/planet/query.svg)

*Figure 1. The planet as a function and a log. Above the dashed line, state is exact and identical on every machine. Below it, everything is a view of that state and nothing flows back up. Exploring "everything" means any position can be queried, not that every position is stored or simulated.*

## 1. The idea under test

The companion study [Writing a Game Once and Running It Everywhere](/papers/game-engines/) splits a game into an exact zone, judged by a hash of the state after each simulation step (tick), and a tolerance zone, judged by pixel error. It models a game as a Form of the [Reality Code Engine (RCE)](/papers/rce/), $P = (S, E, \delta, D, \lambda)$: a state set $S$, an event set $E$, a transition function $\delta : S \times E \to S$, an append-only log $D$ of every step, and an output map $\lambda$ from state to what is shown. This study scales that split up to a planet and asks four questions.

1. **Storage.** What must a planet be, if every position in it can be visited?
2. **Precision.** What number format can say where a player is, anywhere on or inside it, to the width of a hand?
3. **Chaos.** What happens to a shared planet when two machines disagree in the last bit?
4. **Meaning.** Can the parts the engine needs anyway (prediction, compression, energy, surprise) be the mechanics that teach AI, rather than a theme painted on top?

Two words are used throughout. A **cell** is the smallest addressable volume of the planet, assumed here to be a cube one metre on a side unless stated otherwise. A **material** is a named substance (a mineral, water, air, an alloy a player made) with a fixed chemical composition.

## 2. What the arithmetic forces

Every number in this section is computed from the stated inputs. Earth's mean radius is $r = 6{,}371$ km and its volume about $1.083 \times 10^{21}\ \text{m}^3$, as given by the [NASA Earth Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html) (search result only).

### 2.1 Storage: the planet must be computed, not stored

At one byte per one-metre cell, the solid planet needs

$$V \cdot 1\ \text{B/m}^3 \approx 1.08 \times 10^{21}\ \text{B} \approx 1.1\ \text{ZB}.$$

Even the surface alone, $4\pi r^2 \approx 5.1 \times 10^{14}\ \text{m}^2$, is about 510 TB at one byte per square metre. For comparison, press coverage of Microsoft Flight Simulator (2020) reports "over two petabytes" of map data streamed from servers to render Earth's surface ([Gamepressure](https://www.gamepressure.com/newsroom/microsoft-flight-simulators-world-will-take-up-petabytes-of-data/zacf1); search result only), and that covers the surface, not the interior. A planet whose interior can be dug must therefore be a function. Write it as

$$W(x, t) = \begin{cases} m & \text{if the last edit at cell } x \text{ before tick } t \text{ set material } m,\\ G(\sigma, x) & \text{otherwise,} \end{cases}$$

where $\sigma$ is a seed and $G$ a pure generator: the same $(\sigma, x)$ always gives the same material. This is the RCE log $D$ applied to a world. Games already work this way in part. Minecraft generates chunks of $16 \times 16$ blocks on demand from a seed and stores only the chunks that exist, regenerating a deleted chunk from the seed ([Minecraft Wiki, region file format](https://minecraft.fandom.com/wiki/Region_file_format); search result only). No Man's Sky addresses its planets by a 64-bit seed, giving the "over 18 quintillion" planets its developer described ([Gematsu, 2014](https://www.gematsu.com/2014/08/mans-sky-18-quintillion-planets); search result only).

**The edit log is small.** *Illustrative estimate:* an edit record of 32 bytes (three 64-bit coordinates, a 16-bit material, a 16-bit operation, a 32-bit tick), written once a second for 100 hours of play, is $32 \times 360{,}000 \approx 11.5$ MB. The log grows with play, not with the planet.

### 2.2 Precision: where a 32-bit float stops being able to say where you are

A floating-point number has a fixed count of significant bits, so the gap between adjacent representable positions grows with distance from the origin. That gap is one unit in the last place (ULP). For the 32-bit format that graphics processors (GPUs) use by default, the ULP at Earth's radius is

$$\text{ULP}_{32}(6.371 \times 10^6\ \text{m}) = 2^{\lfloor \log_2 r \rfloor - 23}\ \text{m} = 2^{22-23}\ \text{m} = 0.5\ \text{m}.$$

A player standing on the surface, in coordinates centred on the planet, can only be placed on a half-metre grid. For the 64-bit format the same gap is $2^{22-52}\ \text{m} \approx 9.3 \times 10^{-10}$ m. A 64-bit integer counting micrometres has a constant 1 µm step out to $2^{63}\ \mu\text{m} \approx 9.2 \times 10^{12}$ m, about 62 astronomical units (AU), which reaches past Neptune.

![Log-log chart of the smallest step between representable positions against distance from the coordinate origin, from one metre to ten to the thirteen metres. The 32-bit float curve rises in stair steps from about ten to the minus seven metres at one metre to 0.5 metres at Earth's radius (marked with a dot) and beyond a kilometre near Neptune's distance. The 64-bit float curve runs about nine decades lower. A flat green line at one micrometre marks a 64-bit integer in micrometre units, ending at 9.2 times ten to the twelve metres, about 62 AU. Dashed amber lines mark one millimetre and one centimetre.](/figures/planet/precision.svg)

*Figure 2. Position step against distance from the origin, computed from IEEE 754 spacing by `scripts/figures/planet_figures.py`. A 32-bit float loses hand-scale detail within a few kilometres of its origin; a 64-bit integer in micrometres keeps it across the solar system.*

Two consequences follow, and engines already apply both. Gameplay positions are stored in 64-bit form, and the GPU receives small 32-bit offsets measured from the camera. Chris Thorne named the second technique the floating origin in 2005, after observing that motion "becomes jittery and lacking in realism when far from the world's origin" ([Thorne, Cyberworlds 2005](https://researchr.org/publication/Thorne05); search result only). Godot offers a double-precision build for the first and warns that it "comes with a performance and memory usage penalty" ([Godot documentation](https://docs.godotengine.org/en/4.4/tutorials/physics/large_world_coordinates.html); search result only). Kerbal Space Program moved its orbit "reframing maths" to double precision "to remove jitter from the orbit splines" and shifts its origin with the active vessel (KSP 0.17 readme and the [Krakensbane API page](https://wiki.kerbalspaceprogram.com/wiki/API:Krakensbane); search results only). Kaufmann, Franzin, Menegais and Pozzer note that in multiplayer simulation "origin shifting does not work", because there is no single camera to centre on ([GRAPP 2021, doi:10.5220/0010194501350142](https://www.scitepress.org/Papers/2021/101945/101945.pdf); search result only). This study therefore keeps the exact state in integers and uses the floating origin only for drawing.

### 2.3 Level of detail: about 24 halvings from a planet to a hand

Covering a sphere with the six faces of a cube and subdividing each face as a quadtree is the common route to level of detail on a planet. A cube face spans about a quarter of a great circle, $\pi r / 2 \approx 1.0 \times 10^7$ m. Halving it down to one metre takes $\lceil \log_2 (1.0 \times 10^7) \rceil = 24$ levels, and down to one centimetre 30 levels. The terrain methods this rests on are chunked level of detail, which hides seams between levels with vertical skirts ([Ulrich, SIGGRAPH 2002 course notes](https://masters.donntu.ru/2011/fknt/liseenko/library/article1.htm)); continuous distance-dependent level of detail (CDLOD), whose level is "based on the precise three-dimensional distance between the observer and the terrain" ([Strugar, doi:10.1080/2151237X.2009.10129287](https://github.com/fstrugar/CDLOD)); and geometry clipmaps, which compress a "40GB height map of the United States" by "a remarkable factor of 100" ([Losasso and Hoppe, SIGGRAPH 2004](https://hhoppe.com/proj/geomclipmap/)). All three are search results only. All three are for height fields, which cannot represent a cave or a tunnel. A planet that can be dug needs a volume: a sparse voxel octree ([Laine and Karras, I3D 2010](https://www.nvidia.com/docs/IO/88889/laine2010i3d_paper.pdf)), surfaces extracted with dual contouring, which keeps sharp features ([Ju, Losasso, Schaefer and Warren, SIGGRAPH 2002](https://graphics.stanford.edu/courses/cs164-10-spring/Handouts/paper_p339-ju.pdf)), and Lengyel's Transvoxel tables, which fill the seams between levels of a voxel mesh ([repository](https://github.com/EricLengyel/Transvoxel); read; the seam-filling purpose is from a search result).

### 2.4 Elements: a table per material, not a vector per cell

To let a player ask what any rock is made of, down to the element, each cell holds one material id, and a composition table maps each material to its mass fraction of each element. The table has one row per material (a few hundred minerals and alloys), not one per cell, so the cost per cell stays one id. Oxygen is the most abundant element in Earth's crust at about 46% by mass ([Abundance of elements in Earth's crust](https://en.wikipedia.org/wiki/Abundance_of_elements_in_Earth%27s_crust), CRC-based column; search result only). The core is mostly iron with some nickel ([McDonough and Sun 1995, doi:10.1016/0009-2541(94)00140-4](https://doi.org/10.1016/0009-2541(94)00140-4); second-hand table only).

Rare elements set a design rule. *Illustrative model:* take a trace element at an assumed four parts per billion by mass, of the order often quoted for gold in crustal rock but not checked for this study. One cubic metre of rock at 2,700 kg then holds $2{,}700 \times 4 \times 10^{-9}\ \text{kg} \approx 11$ mg of it. Mixing rare elements evenly through every cell makes them invisible to play. They must be concentrated by the generator into deposits whose placement follows geology (veins, placers, the iron-rich core), so that the average over the planet is right and the local value is findable.

## 3. The butterfly effect: why the planet must be exact

Edward Lorenz found in a twelve-variable weather model that solutions of deterministic equations can be nonperiodic and sensitive to their starting values ("Deterministic Nonperiodic Flow," *Journal of the Atmospheric Sciences* 20(2):130–141, 1963; [copy](https://scispace.com/pdf/deterministic-nonperiodic-flow-1k20vjsax3.pdf); search result only). His 1972 talk to the American Association for the Advancement of Science gave the effect its name: "Predictability: Does the Flap of a Butterfly's Wings in Brazil Set Off a Tornado in Texas?" ([Physics Today 77(5):30, 2024](https://physicstoday.aip.org/article/77/5/30/3283589); search result only). The same article reports that errors in large weather systems "double roughly every three days." Zhang and co-authors put the practical limit of midlatitude weather prediction at "around 10 days," and found that cutting the initial error tenfold extends useful forecasts "by up to 5 days" ([*J. Atmos. Sci.* 76(4):1077–1091, 2019, doi:10.1175/JAS-D-18-0269.1](https://dspace.mit.edu/handle/1721.1/124726); search result only).

A planet with weather is therefore a machine that amplifies differences. The companion study gives the time for a difference $\delta_0$ to grow to a visible size $\Delta$ as $t^{*} = \Lambda^{-1} \ln(\Delta/\delta_0)$, where $\Lambda$ is the growth rate. Writing the growth as a doubling time $T_d = \ln 2 / \Lambda$ gives

$$t^{*} = T_d \log_2 \frac{\Delta}{\delta_0}.$$

*Illustrative model, not a measurement:* a last-bit disagreement in a 32-bit value is a relative difference of about $\delta_0 = 6 \times 10^{-8}$. Growing it to an order-one difference ($\Delta = 1$) takes $\log_2(1/\delta_0) \approx 24$ doublings. If the game's weather doubled errors every three simulated days, as Earth's large systems do, and one game day lasted 24 real minutes, two machines would disagree about the weather after $24 \times 3 \times 24$ minutes, about 29 real hours. The logarithm decides the matter: no precision short of exact is enough for a world that runs for months. Agreement "within tolerance" holds for a while and then fails.

**Exactness turns the butterfly effect into gameplay.** When $W$ is exact, two runs that share a seed and a log are identical forever, so any difference between two runs is caused by the edits that differ between their logs and by nothing else. A player can fork the log, change one edit (divert a stream, fell a forest, build a dam), replay both branches, and watch the consequences spread. The difference map between the branches is the butterfly effect, made attributable. Without exactness the same map would mix the player's cause with numerical noise, and the lesson would be false.

Exactness is required only where state feeds back. Weather that moves sediment, waters crops or floods a tunnel is gameplay and sits in the exact zone. Cloud shapes drawn from that weather are a view and sit in the tolerance zone.

## 4. Four lenses, each a working part of the engine

Each lens below supplies a part the engine needs anyway. Section 5 then turns each part into a mechanic.

### 4.1 Physics: constraints solved as energy minimisation

Extended position-based dynamics (XPBD) treats each constraint $C(x)$ on positions $x$ as an elastic potential $U(x) = \tfrac{1}{2} C(x)^{\top} \alpha^{-1} C(x)$ with compliance $\alpha$, and solves each step by minimising it. This removes the dependence of stiffness on iteration count and time step that earlier position-based methods had ([Macklin, Müller and Chentanez, MIG 2016, doi:10.1145/2994258.2994272](https://doi.org/10.1145/2994258.2994272); search result only). Game physics in this design is therefore already energy minimisation. Two further physical rules become machine checks on the log:

- **Conservation of matter.** Every edit that removes a material from a cell must place the same mass, element by element, somewhere else: in another cell, in an inventory, or in a declared source or sink (a volcano, a meteorite, space). Using the composition table of Section 2.4, a checker can verify this for every edit before it enters $D$.
- **An energy budget.** Sunlight enters each tick, radiation leaves, and every action a player or creature takes is paid for from a stored balance. The balance is part of $S$, so it is exact and replayable.

Iterative solvers in fixed-point arithmetic are possible but slower; the cost is untested.

### 4.2 Information: the planet holds less than it seems

Claude Shannon defined the information of a source as its entropy, $H = -\sum_i p_i \log_2 p_i$ bits ("A Mathematical Theory of Communication," *Bell System Technical Journal* 27, 1948; search result only). A related bound applies to the planet. Everything in it at tick $t$ is determined by the generator program, the seed and the log, so the shortest description of the planet, its algorithmic information $K$, satisfies

$$K(\text{planet at } t) \le |G| + |\sigma| + |D_t| + c,$$

where $|\cdot|$ is length in bits and $c$ a constant for the replay procedure. With a generator of a few hundred kilobytes, an 8-byte seed and the 11.5 MB log of Section 2.1, a planet of $10^{21}$ cells holds at most about 12 MB of information. Everything else is structure. Exploring the planet is decompression, and doing science inside it means recovering the structure of $G$, which is the same quantity the [RCE-JEPA](/papers/rce-jepa/) study measures as a description-length ratio.

Information also has a physical price. Rolf Landauer argued that erasing information dissipates heat "of the order of kT for each irreversible function" ("Irreversibility and Heat Generation in the Computing Process," *IBM Journal of Research and Development* 5(3):183–191, 1961; search result only). The bound is usually stated as $k_B T \ln 2$ per bit, where $k_B$ is Boltzmann's constant and $T$ the temperature, which is $2.87 \times 10^{-21}$ J at 300 K. Bérut and co-authors measured the heat of erasing one bit stored in a trapped colloidal bead and found it approaching, but never going below, that bound ([*Nature* 483:187–189, 2012, doi:10.1038/nature10872](https://doi.org/10.1038/nature10872); search result only). In the game, undoing an action means erasing part of the log, and it costs energy from the budget of Section 4.1. The in-game price is a design constant, not Landauer's number.

### 4.3 Energy minimisation: memory and inference as settling

John Hopfield described a network of binary units with an energy function whose minima are stored memories: a "content-addressable memory" that "correctly yields an entire memory from any subpart of sufficient size" ([*PNAS* 79(8):2554–2558, 1982, doi:10.1073/pnas.79.8.2554](https://doi.org/10.1073/pnas.79.8.2554); search result only). Hopfield and Geoffrey Hinton received the 2024 Nobel Prize in Physics "for foundational discoveries and inventions that enable machine learning with artificial neural networks" ([background](https://kva.se/app/uploads/2024/11/sciback_fy_en_24.pdf); search result only). Energy-based models (EBMs) generalise the idea: a model assigns "a scalar energy to each configuration of the variables," and inference sets the observed variables and finds values of the rest "that minimize the energy" ([LeCun, Chopra, Hadsell, Ranzato and Huang, "A Tutorial on Energy-Based Learning," 2006](https://cs.nyu.edu/~yann/2011f-G22-2565-001/diglib/lecun-06.pdf); search result only).

Many planetary processes the generator needs are relaxations of the same kind: slopes settling towards a stable angle, water finding the lowest path, sediment filling basins. Whenever such a relaxation changes gameplay state, it runs for a fixed number of iterations in integer arithmetic, so that it settles to the same result on every machine.

### 4.4 The free energy principle: creatures that minimise surprise

Karl Friston's free energy principle proposes that self-organising systems, brains among them, act and perceive so as to minimise a variational free energy that bounds their surprise ([*Nature Reviews Neuroscience* 11(2):127–138, 2010, doi:10.1038/nrn2787](https://www.fil.ion.ucl.ac.uk/~karl/NRN.pdf); search result only). For hidden states $s$, observations $o$, a generative model $p(o, s)$ and an approximate belief $q(s)$,

$$F = \mathbb{E}_{q}\big[\ln q(s) - \ln p(o, s)\big] = D_{\mathrm{KL}}\big[q(s) \,\|\, p(s \mid o)\big] - \ln p(o) \;\ge\; -\ln p(o),$$

where $D_{\mathrm{KL}}$ is the Kullback–Leibler divergence. The bound is tight when the belief equals the exact posterior. Active inference extends this to action: an agent picks the actions it expects to lower free energy in future ([Parr, Pezzulo and Friston, *Active Inference*, MIT Press, 2022, doi:10.7551/mitpress/12441.001.0001](https://doi.org/10.7551/mitpress/12441.001.0001); open access; search result only).

In this design, every creature on the planet is a small active-inference agent over a discrete state space: it holds a belief about food, threat and weather, updates it from what it senses, and moves to where it expects the least surprise. Because its beliefs are part of $S$, a player can open any creature and read them. Whether the principle is the correct account of brains is a claim this study does not test. It is used here as a method for building agents whose inner state is explicit and inspectable.

## 5. Modern AI, one mechanic per idea

Each row pairs one idea from modern AI research with a mechanic built from a part of Section 4, so the idea is something the player does rather than something the game describes. The catalogue is a starting set, not a complete account of the field.

| # | Idea | Source | Mechanic | What the player learns |
|---|---|---|---|---|
| 1 | Learned world models | Ha and Schmidhuber, "World Models" ([arXiv:1803.10122](https://arxiv.org/abs/1803.10122)) | A scanner trained on the cells the player has already seen predicts what lies behind a rock face before the player digs | Prediction from experience, and its errors where experience runs out |
| 2 | Prediction in representation space | LeCun, "A Path Towards Autonomous Machine Intelligence," 2022 ([OpenReview](https://openreview.net/pdf?id=BZ5a1r-kVsf)), the Joint Embedding Predictive Architecture (JEPA) | The scanner predicts a summary (ore or not, water or not) rather than every cell | Predicting what matters is cheaper than predicting everything |
| 3 | Planning with a learned model | Schrittwieser et al., MuZero ([*Nature* 588:604–609, 2020](https://doi.org/10.1038/s41586-020-03051-4)) | Fork the log, try several plans in replay, commit one (Section 3) | Search over imagined futures, and the price of searching |
| 4 | Generative interactive worlds | Bruce et al., Genie ([arXiv:2402.15391](https://arxiv.org/abs/2402.15391)) | A "dream" mode lets a learned model invent terrain ahead of the player; the exact $W$ then shows where the dream was wrong | Plausible is not the same as true; a checker tells them apart |
| 5 | Physics-informed learning | Raissi, Perdikaris and Karniadakis, physics-informed neural networks ([*J. Comput. Phys.* 378:686–707, 2019](https://doi.org/10.1016/j.jcp.2018.10.045)) | A flood forecaster is penalised whenever it breaks conservation of water; the player sets the penalty weight | Built-in physics trades flexibility for fewer absurd answers |
| 6 | Learned weather forecasting and its limit | Lam et al., GraphCast ([*Science*, 2023, doi:10.1126/science.adi2336](https://doi.org/10.1126/science.adi2336)): ten-day forecasts at 0.25° "in under 1 minute"; Zhang et al. 2019 (Section 3) | Forecasting contests on the planet's own weather; every forecaster, learned or physical, fails past the predictability horizon | Some limits are in the world, not the model |
| 7 | Energy-based memory | Hopfield 1982; LeCun et al. 2006 (Section 4.3) | Memory stones: a grid of stones that, given part of a stored pattern, settles into the whole one | Recall as rolling downhill in an energy landscape |
| 8 | Active inference | Friston 2010; Parr, Pezzulo and Friston 2022 (Section 4.4) | Creatures whose beliefs can be read; the player can surprise them, calm them or teach them | Perception and action as two ways to reduce surprise |
| 9 | Compression as understanding | Shannon 1948; the algorithmic-information bound (Section 4.2) | A field notebook scored by how much it compresses what the player has observed | A good theory is a short description that still predicts |
| 10 | Energy cost of thinking | Landauer 1961; Bérut et al. 2012; the [agency study](/papers/agency/) | Every plan, forecast and undo is paid from the energy budget; scores are progress per joule | Intelligence is not free; it has a price per decision |
| 11 | Specification gaming | Krakovna et al., "Specification gaming: the flip side of AI ingenuity" ([DeepMind blog, 2020](https://deepmind.google/discover/blog/specification-gaming-the-flip-side-of-ai-ingenuity/)), which defines it as behaviour "that satisfies the literal specification of an objective without achieving the intended outcome" and lists around 60 examples | The player writes the reward for a team of helper drones; the drones satisfy the reward's wording and miss its intent | Writing an objective is harder than it looks |
| 12 | A measure that becomes a target | Strathern's phrasing of Goodhart's observation, "When a measure becomes a target, it ceases to be a good measure" (*European Review* 5(3):305–321, 1997, [doi:10.1017/S1062798700002660](https://doi.org/10.1017/S1062798700002660)) | A settlement rewarded for its count of trees plants a monoculture that the next drought kills | Proxies drift away from what they stood for |
| 13 | Side effects, safe exploration, distributional shift | Amodei et al., "Concrete Problems in AI Safety" ([arXiv:1606.06565](https://arxiv.org/abs/1606.06565)) | Branch diffs (Section 3) show a plan's side effects downstream; drones trained in one biome are sent to another | Impact travels further than intent; behaviour learned in one place breaks in another |
| 14 | Scalable oversight by debate | Irving, Christiano and Amodei, "AI safety via debate" ([arXiv:1805.00899](https://arxiv.org/abs/1805.00899)): on handwritten digits, a judge shown 6 pixels rose from 59.4% to 88.9% accuracy with debate | Two advisors argue over whether a plan is safe; the player may inspect only a few cells before ruling | Judging an argument can be easier than checking every fact |
| 15 | Orthogonality and instrumental convergence | Bostrom, "The Superintelligent Will" ([*Minds and Machines* 22(2):71–85, 2012](https://nickbostrom.com/superintelligentwill.pdf)): agents with "a wide range of final goals will pursue similar intermediary goals" | A rival agent with an arbitrary goal (collect blue crystals) still gathers energy, claims land and protects itself | Capability and goals are separate; very different goals share the same means |
| 16 | Commit gates | The [gates study](/papers/gates/): act only after a check passes | Irreversible actions (detonations, dams, releasing a species) run only through a gate whose check the player designs | Undo is what makes mistakes affordable; where there is none, check first |
| 17 | Superintelligence as faster search | Rows 3, 15 and 16 combined | The rival of row 15 can replay counterfactual branches many times faster than the player; the player cannot out-plan it and can only constrain it through gates and oversight | Against a better planner, the levers that remain are the rules it must pass |

Rows 1 to 10 make the engine's own parts visible. Rows 11 to 17 come from AI safety research and need the exact replay of Section 3 to work: a side effect, a gamed reward or a rival's plan can only be shown fairly if a branch replays identically.

## 6. What runs where in a browser

WebGPU is the browser interface to the GPU, with its own shading language, the WebGPU Shading Language (WGSL). The World Wide Web Consortium (W3C) published WebGPU as a Candidate Recommendation in December 2024 (search result only). The [implementation status page](https://github.com/gpuweb/gpuweb/wiki/Implementation-Status) (read) records that Chromium shipped it in version 113 on Mac, Windows and ChromeOS, on Android in 121 and on Linux with Intel Gen12 or later in 144; Firefox in 141 on Windows and on macOS from 145; and Safari in the version 26 releases of macOS, iOS, iPadOS and visionOS. The same page says "Mozilla expects to ship on Linux in 2026."

Three facts from the specifications decide what can run where. All three are from the editor's drafts of the [WebGPU](https://github.com/gpuweb/gpuweb/blob/main/spec/index.bs) and [WGSL](https://github.com/gpuweb/gpuweb/blob/main/wgsl/index.bs) specifications (read).

1. **Integer arithmetic is exact; floating point is not.** WGSL states that integer "expressions on concrete integer types that overflow produce a result that is modulo 2^bitwidth," so 32-bit integer arithmetic gives the same bits on every GPU. The companion study quotes the same specification leaving the floating-point rounding mode unspecified and permitting reassociation and fused operations. A generator written in WGSL integer arithmetic (integer hashes for noise, fixed-point interpolation) can therefore sit in the exact zone. A floating-point one cannot.
2. **There is no 64-bit integer type.** "The integer scalar types are AbstractInt, i32, and u32," and AbstractInt exists only while a shader is created. The 64-bit micrometre positions of Section 2.2 must be emulated as pairs of 32-bit words on the GPU, at a cost not yet measured.
3. **The default limits fit planet bricks exactly.** The default workgroup storage is 16,384 bytes, which holds a $16^3$ brick of 4-byte cells. The default storage-buffer binding is 128 MiB, which holds $512^3$ one-byte cells: a 512-metre cube of the active region in one binding. The default maximum of 256 invocations per workgroup (128 in compatibility mode) sets the brick shape for dispatch.

The resulting split:

| Part | Where it runs | Zone | Why |
|---|---|---|---|
| Generator $G$, reference version | WebAssembly (Wasm), integer arithmetic | Exact | The version every other version is checked against |
| Generator $G$, fast version | WGSL compute shaders, 32-bit integers only | Exact, if the first test of Section 7 passes | Integer arithmetic is specified to wrap identically |
| Edit log $D$, conservation and gate checks | Wasm | Exact | Checks must never depend on the GPU |
| Gameplay physics (XPBD) and creatures | Wasm, fixed point | Exact | Their results enter $S$ |
| Coarse planetary weather | Wasm or integer WGSL, at about 0.25° (1,038,240 columns, GraphCast's grid) | Exact | It drives gameplay through the butterfly effect |
| Meshing, level of detail, lighting, atmosphere, particles | WGSL, 32-bit floats, camera-relative | Tolerance | Views only; nothing flows back |
| Learned models of Section 5 (scanner, forecasters, dream mode) | WGSL or Wasm | Tolerance, with their outputs logged | A model's output enters $S$ only as a logged event, as player input does |

The last row matters for honesty: a learned model running on different GPUs may give slightly different outputs. Treating each output as a logged event, like a key press, keeps replay exact without requiring the model itself to be exact.

## 7. Falsifier-first test plan

Each hypothesis is listed with the result that would withdraw it.

| ID | Hypothesis | Test | Measure | Kill criterion |
|---|---|---|---|---|
| PL-H1 | The integer generator gives identical cells on every target | $G$ in Wasm and in integer WGSL on three GPU vendors and three browsers | Hash over $10^9$ sampled cells | Any mismatch |
| PL-H2 | A floating-point generator does not | The same $G$ written with 32-bit floats | Hash over the same cells | No mismatch on any pair, in which case the integer requirement is withdrawn as unnecessary |
| PL-H3 | Identical logs never diverge; logs differing by one edit do | Pairs of branches over $10^6$ ticks of coarse weather | State hash per tick | Any divergence between identical logs |
| PL-H4 | Divergence between branches grows exponentially with a stable doubling time | The branch pairs of PL-H3 | Fit of $\ln$ separation against ticks | No linear region in the fit, or a doubling time that varies more than tenfold between seeds |
| PL-H5 | The edit log stays small | Playtest sessions of 100 hours | Log size | Median over 50 MB |
| PL-H6 | Conservation checks catch every unbalanced edit | Fuzzed edit streams with injected mass errors | Detection rate | Any injected error accepted |
| PL-H7 | Exact physics and creatures fit the frame | Fixed-point XPBD and 1,000 active-inference creatures in Wasm | Time per 60 Hz tick | Over 8 ms on a mid-range laptop |
| PL-H8 | The active region regenerates fast enough to walk through | Integer WGSL over a $512^3$ region | Time to regenerate one $16^3$ brick, and bricks per frame | Fewer bricks per frame than walking at 10 m/s requires |
| PL-H9 | Positions hold hand-scale detail everywhere | Camera at the surface, the core and lunar distance | Visible jitter | Over 1 mm anywhere |
| PL-H10 | The mechanics teach the ideas | Players before and after an hour with rows 1 to 17, against a group that reads the same material | Score on a concept test | No gain over the reading group |
| PL-H11 | Specification gaming arises without being scripted | Player-written rewards for drones in playtests | Share of rewards the drones game | None gamed, which would mean the drones are too weak to teach row 11 |

## 8. Infeasibility flags

1. **Storing the planet: infeasible.** About 1.1 ZB at one byte per cubic metre (Section 2.1).
2. **Simulating every cell every tick: infeasible.** At one nanosecond per cell, one tick of $1.08 \times 10^{21}$ cells would take about $1.08 \times 10^{12}$ s, roughly 34,000 years. Only the active region and the coarse weather grid tick; every other cell stays as $G$ and $D$ left it.
3. **Exact floating-point generation on GPUs: infeasible portably.** WGSL leaves rounding unspecified and permits reassociation (Section 6).
4. **Native 64-bit integers in WGSL: absent.** Emulation is required, at an unmeasured cost.
5. **Forecasting beyond the predictability horizon: infeasible for any forecaster.** The design uses this as a mechanic (row 6) rather than hiding it.
6. **Shared floating-point worlds that run for months: infeasible.** Under the model of Section 3, last-bit differences reach order one after about 24 doublings.
7. **"Every concept of AI": not claimed.** Section 5 is a finite catalogue of 17 ideas, and the field adds more each year.
8. **Every browser: not yet.** The status page read for this study lists Firefox on Linux as still to ship.

## 9. What is new here, and what is not

Each part exists somewhere already: seeds (No Man's Sky, Minecraft), the floating origin (Thorne), volume terrain (sparse voxel octrees, dual contouring, Transvoxel), stored edits (Minecraft region files), constraint physics (XPBD), and every idea in Section 5. *Opinion:* three things are new in the combination.

1. **Exactness as the condition for an attributable butterfly effect.** Exact replay is usually argued for multiplayer synchronisation. Here it is argued for meaning: without it, a branch diff cannot say what an edit caused.
2. **Element-level conservation checked on the log.** A composition table and a checker over $D$ make "every element can be explored" a property that can be verified, not a texture.
3. **Engine parts that are mechanics.** The predictor, the energy budget, the creatures and the gates are parts the engine needs. Making them visible teaches the AI ideas they come from, without a separate tutorial layer.

## 10. Sources and limits

Read in full for this study: the WebGPU and WGSL editor's drafts and the WebGPU implementation status page (through raw.githubusercontent.com), and the Transvoxel repository README. Every other external source was checked only against search results, not against its full text. Quotation marks around a phrase from such a source mean the phrase appeared in the search result. It has not been checked against the full text, and each one should be before the study leaves draft. The citation details of Lorenz 1963 come from search results, and those of Lam et al. 2023 are limited to the identifier given.

Not used as evidence although found: the No Man's Sky terrain-edit limits reported by players, which disagree with each other; the Genie 2 and Genie 3 press coverage, which has no primary paper; and an exact energy function for Hopfield's network, which could not be confirmed.

No engine code has been written and no hypothesis has been run. The illustrative models in Sections 2.4 and 3 use assumed values, labelled where they appear.
