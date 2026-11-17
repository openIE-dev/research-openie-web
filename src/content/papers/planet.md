---
title: "A Planet You Can Take Apart: A Whole World as a Function and an Edit Log, Played Through the Ideas of AI"
deck: "Can a browser game let players reach every place on and inside a planet, down to the elements in its rock, and make the ideas of modern artificial intelligence the way it is played? The planet is too large to store, so it must be computed from a seed and a log of edits. It is chaotic, so that computation must be exact. Its physics, information and free-energy structure give each AI idea a mechanic a player can touch."
id: planet
status: "In preparation"
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

Every number in this section is computed from the stated inputs. Earth's mean radius is $r = 6{,}371$ km and its volume about $1.083 \times 10^{21}\ \text{m}^3$, as given by the [NASA Earth Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html) (search result only; see Section 10).

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

PLACEHOLDER-3

## 4. Four lenses, each a working part of the engine

PLACEHOLDER-4

## 5. Modern AI, one mechanic per idea

PLACEHOLDER-5

## 6. What runs where in a browser

PLACEHOLDER-6

## 7. Falsifier-first test plan

PLACEHOLDER-7

## 8. Infeasibility flags

PLACEHOLDER-8

## 9. What is new here, and what is not

PLACEHOLDER-9

## 10. Sources and limits

PLACEHOLDER-10
