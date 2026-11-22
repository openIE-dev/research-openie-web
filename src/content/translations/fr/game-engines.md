---
title: "Écrire un jeu une seule fois et l'exécuter partout : où s'arrête le rejeu exact et où commence la tolérance"
deck: "Peut-on écrire un jeu une seule fois sous forme de machine à états vérifiée et le projeter vers plusieurs moteurs, jeux d'instructions et piles graphiques ? Exécuté sur 25 cellules cibles × hôtes multi-ISA pendant 100 000 ticks sous physique entière Q32.32 (GE-H1 : 0 / 20 500 discordances SHA-256 sur arm64 macOS, aarch64 Linux et AMD/Intel x86_64 Linux), 25 000 ticks en virgule flottante inter-ISA (GE-H2 : t_div = 10 Apple libm contre GNU glibc sin/cos, t_div = 406 x86_64 FMA contre arm64 fmadd sans -ffast-math) et 4 GPU physiques sur Metal et Vulkan (GE-H3 : dérive LSB pixel de 1,3 % à 9,3 %, Δ_max ≤ 2, PSNR 64,2-72,1 dB, SSIM ≥ 0,99983), associé à un prototype jouable WebXR/Canvas sous contrainte énergétique en Q32.32."
lang: "fr"
source: "game-engines"
complete: true
---

<div id="writing-a-game-once-and-running-it-everywhere-where-exact-replay-ends-and-tolerance-begins" class="anchor-alias" aria-hidden="true"></div>

*Révision af57f48, 22 novembre 2026. Explorateur interactif, inspecteur multi-GPU et arène jouable `Q32.32` Chrono-Budget : [research.openie.dev/living/game-engines/](/living/game-engines/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

Cette étude se demande si un jeu peut être écrit une fois comme une machine d'états vérifiée, puis projeté à travers les langages, les architectures d'ensemble d'instructions du processeur central (CPU) (ISAs), et les back ends du processeur graphique (GPU). Les spécifications étudiées et les trois suites empiriques de falsificateurs exécutées donnent une frontière nette : **oui** pour les règles du jeu et la simulation sous arithmétique entière à point fixe épinglée (`(GE-H1)`: `0 / 20,500` Secure Hash Algorithm 256-bit (`SHA-256`) discordances de points de contrôle sur `100,000` ticks d'une arène 2D à 16 corps projetée sur `25` cellules cible × hôte sur `arm64` `macOS 27.2.1`, `aarch64` `Linux 6.8`, et Advanced Micro Devices (`AMD`) Zen 5 et Intel Raptor Lake `x86_64` `Linux 7.0`, s'étendant de `0.073 J` à `13.60 J` dans macOS par processus `reported_j` et de `1.89 J` à `181.87 J` dans Linux Running Average Power Limit (`RAPL`) package `reported_j`) ; **non** lorsque des transcendantales en virgule flottante non épinglées ou la réduction fused multiply-add (`FMA`) introduisent des collisions caotiques multi-corps (`(GE-H2)`: même *sans* `-ffast-math`, Apple `libSystem` `libm` contre Linux system `glibc` `std::sin`/`std::cos` diverge au tick `10`, cross-ISA `x86_64` `-mavx2 -mfma` contre `arm64` `fmadd` diverge au tick `406`, et V8 `Math.sin` diverge entre ISA au tick `66`) ; et **non** pour des pixels bit-exactes entre fournisseurs GPU, mais **oui** sous une porte de tolérance unidirectionnelle bornée (`(GE-H3)`: à travers Apple `Metal`, `AMD` Mesa Radeon Vulkan (`RADV`), Nvidia Vulkan (`NVIDIA`), et Intel Mesa Vulkan (`ANV`) à `512×512` `RGBA8Unorm`, `24 / 24` paires de trames cross-GPU diffèrent en `SHA-256` brut sur `1.30%`-`9.34%` des pixels, tout en maintenant une erreur maximale par canal $\Delta_{\max} \le 2 / 255$, un rapport signal-bruit (`PSNR`) `64.16`-`72.06 dB`, et une similarité structurelle (`SSIM`) `0.99983`-`0.99999`, avec `measured_j = None` et `board_metered = false`).

**En termes simples**

1. **Une simulation exacte entre puces et langages fonctionne lorsque l'arithmétique est fixée en entiers.** Sur `100,000` ticks (`20,500` points de contrôle `SHA-256` vérifiés), Rust natif, C++20 (`Clang` et la collection de compilateurs (`GCC`)), WebAssembly (`Wasm`), `BigInt` de JavaScript et Python rejouent exactement le même état de 732 octets, bit à bit, sur Apple Silicon (`arm64`), NVIDIA Jetson Thor (`aarch64`), AMD Zen 5 (`x86_64`) et Intel Raptor Lake (`x86_64`), sans aucune divergence.
2. **La physique en virgule flottante standard dérive selon les systèmes d'exploitation et les familles de processeurs, même sans `-ffast-math`.** Les opérations algébriques pures `+`, `-`, `*`, `/` et `sqrt`, avec `FMA` désactivé (`-ffp-contract=off`), concordent entre `x86_64` et `arm64` sur les `25,000` ticks testés. En revanche, l'appel à `std::sin`/`std::cos` entre la `libm` de macOS et la `glibc` de Linux fait basculer un bit dès le tick `10` (`0.17 s` à `60 Hz`) et désynchronise les scores de jeu dès le tick `9,798` (`163.3 s`). Enfin, l'activation de la contraction `FMA` par défaut (`-ffp-contract=fast`) fait diverger `x86_64` et `arm64` au tick `406`, et désynchronise le jeu au tick `11,205`.
3. **Les cartes graphiques ne produisent pas des bits identiques ; le rendu doit donc se situer en aval d'une porte de tolérance à sens unique.** Sur Apple `Metal`, AMD `RADV` Vulkan, NVIDIA Vulkan et Intel `ANV` Vulkan, `1.3%` à `9.3%` des pixels diffèrent de `1` à `2` bits de poids faible (`LSB`). Cela fait échouer les contrôles `SHA-256` naïfs sur le tampon d'image, tout en réussissant les tests de tolérance perceptuelle (`PSNR > 64 dB`, `SSIM > 0.9998`), car aucune valeur produite par le GPU ne remonte jamais dans l'état de la simulation.

![Schéma du découpage proposé. Une boîte en haut contient la Forme P égale S, E, delta, D, lambda, avec des schémas d'interface typés et un vérificateur strict. Des flèches mènent à quatre projections : simulation (Rust, WebAssembly, XState, SCXML, Python) et scripts (Rhai, Lua, Luau) à gauche, dans la zone exacte, jugées par un hachage d'état par tick ; scène (de type BSN, glTF, OpenUSD) et rendu (Slang, WGSL, WESL) à droite, dans la zone de tolérance, jugées par erreur par pixel. Une ligne verticale en pointillés marque la frontière du déterminisme. Une bande en bas recense les effets de l'hôte, qui n'entrent que sous forme d'événements journalisés : entrées, horloge, audio, réseau, entrées et sorties d'actifs, dessins GPU, physique cosmétique.](/figures/game-engines/architecture.svg)

*Figure 1. Découpage proposé. Une seule Form alimente quatre projections. La simulation et les scripts se situent dans la zone exacte, jugés par des hachages d'état par tick. La scène et le rendu se situent dans la zone de tolérance, jugés par erreur par pixel. Les effets de l'hôte n'entrent que sous forme d'événements journalisés.*

![Grille dont les lignes sont onze représentations existantes (Slang, Naga, WGSL et WESL, glTF, OpenUSD, BSN, SCXML et XState, VGDL, GameRule, nAIVE, SpacetimeDB) et dont les colonnes sont sept capacités (comportement, scène, shader, ordre d'exécution, multi-cible, journal de rejeu, vérification inter-couches). Les cellules vertes indiquent une capacité documentée, les ambres une capacité partielle, les grises une capacité absente ou non documentée. La colonne de vérification inter-couches est grise, sauf pour les marques partielles de Slang et nAIVE.](/figures/game-engines/coverage.svg)

*Figure 2. Couverture des représentations existantes, évaluée uniquement à partir des documents lus pour cette étude. Vert : capacité documentée. Ambre : partielle. Gris : absente ou non documentée. La colonne la plus à droite, la vérification inter-couches, est presque vide.*

<div id="1-terms-notation-and-the-idea-under-test" class="anchor-alias" aria-hidden="true"></div>

## 1. Terminologie, notation et idée mise à l'épreuve

<ul id="terms">
<li>RCE, IR, ECS, FSM, SDF : Reality Code Engine [même maison], représentation intermédiaire, système de composants d'entités, machine à états finis et champ de distance signée</li>
<li>CPU, GPU, ISA, ISAs, SIMD, AVX2, NEON, SFU, ROP, RPL : unité centrale de traitement, unité de traitement graphique, architecture(s) de jeu d'instructions, instruction unique données multiples, Advanced Vector Extensions 2, Arm Advanced SIMD, unité de fonctions spéciales, pipeline d'opérations de rastérisation et architecture mobile Intel Raptor Lake</li>
<li>IEEE, FMA, VFMADD, VFNMADD, FMADD, FMSUB, ULP, LSB, SHA, MAE, RMSE, PSNR, SSIM, SD, RGBA8 : Institute of Electrical and Electronics Engineers (comme dans IEEE 754 à virgule flottante), multiplication-addition fusionnée, opcodes vectoriels x86_64 de multiplication-addition fusionnée et de multiplication-addition négative, opcodes scalaires AArch64 de multiplication-addition fusionnée et de multiplication-soustraction, unité en dernier lieu, bit de poids faible, Secure Hash Algorithm (`SHA-256`), erreur absolue moyenne, erreur quadratique moyenne, rapport signal sur bruit de crête, indice de similarité structurelle, écart-type et format de tampon d'image rouge-vert-bleu-alpha à 8 bits par canal</li>
<li>WGSL, WESL, SPIR-V, GLSL, HLSL, MSL, D3D11, D3D12, CUDA : WebGPU Shading Language, WebGPU Extended Shading Language, Standard Portable Intermediate Representation V, OpenGL Shading Language, High-Level Shading Language, Metal Shading Language, Direct3D 11, Direct3D 12 et Compute Unified Device Architecture</li>
<li>RADV, ANV, LLVM, GNU, GCC, PE, OS, API, APIs, WebXR, WebMCP, URL, JSON, YAML, README, MB, CS0246, RE, ENGINE, DFU : pilote Mesa Radeon Vulkan, pilote Mesa Intel Vulkan, infrastructure de compilation Low Level Virtual Machine, projet GNU's Not Unix, GNU Compiler Collection, Windows Portable Executable, système d'exploitation, interface(s) de programmation d'applications, Web Extended Reality API, Web Model Context Protocol, Uniform Resource Locator, JavaScript Object Notation, YAML Ain't Markup Language, fichier de documentation README du dépôt, mégaoctets, diagnostic de compilateur C# de type manquant CS0246, Capcom RE ENGINE (marque « Reach for the Moon » / « RE neXt ») et préfixe DOI de Dagstuhl Follow-Ups</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG : State Chart XML, Game Description Language, Video Game Description Language, Bevy Scene Notation, Boldsea Semantic Language, Multi-Level Intermediate Representation, transactions atomiques/cohérentes/isolées/durables, bibliothèque de réseau de rollback Good Game Peace Out, Graphics Language Transmission Format (ISO/IEC 12113:2022), Open Universal Scene Description, Universal Scene Description, réseau local, intelligence artificielle et Computational Intelligence and Games</li>
<li>SATB, RAPL, MSR, PID, RUSAGE, V6, AMD, NVIDIA, V100, GH200, CTC : Satiation Tiered Benchmark, niveaux de télémétrie (`L2` compteur de socket/paquet, `L3` compteur noyau par processus) [même maison], Running Average Power Limit (limite de puissance à moyenne glissante), registre spécifique au modèle, identifiant de processus, `proc_pid_rusage` (`RUSAGE_INFO_V6`), Advanced Micro Devices, NVIDIA Corporation, processeur graphique Volta V100, superpuce Grace Hopper GH200, et courbe temporelle fermée</li>
</ul>

Pour rendre les références avant-dans le texte transparentes de haut en bas, la Section 1 définit la notation Form, la Section 2 passe en revue les représentations de jeu existantes, la Section 3 analyse la divergence en virgule flottante, la Section 4 tabule les représentations intermédiaires, la Section 5 énonce la scission de couche proposée, la Section 6 rend compte des exécutions du falsificateur multi-ISA et multi-GPU, la Section 7 liste les indicateurs d’infaisabilité, et la Section 8 documente les sources et limites.

Le [Moteur de Code Réalité (RCE)](https://research.openie.dev/about/rce/) considère un programme comme une machine d’états appelée Form, écrite $P = (S, E, \delta, D, \lambda)$ :

- $S$ : l’ensemble des états ;
- $E$ : l’ensemble des événements (entrées) ;
- $\delta : S \times E \to S$ : la fonction de transition ;
- $D$ : un journal en écriture seule de chaque pas effectué ;
- $\lambda$ : la fonction de sortie de l’état vers la sortie observable.

Un vérificateur strict accepte soit une Form, soit indique la règle qu’elle enfreint. Les émetteurs projettent alors la Form acceptée vers Rust, Python, JavaScript et Scala. XState (une bibliothèque de diagrammes d’états JavaScript et TypeScript), SCXML (une recommandation du World Wide Web Consortium) et WebAssembly (`Wasm`) ne font pas partie des cibles des émetteurs ; cette étude les considère comme des projections candidates. Comme chaque étape est enregistrée dans $D$, toute exécution peut être rejouée.

Un moteur de jeu est une machine beaucoup plus grande. Il exécute une simulation à pas fixe, une couche de script, une description de scène et un pipeline de rendu sur un GPU. Les Sections 1 à 8 s’interrogent sur les couches qui peuvent subsister dans une Form, celles qui doivent rester à l’extérieur comme effets d’hôte, et où l’exactitude doit céder la place à la tolérance.

L’idée possède une longue lignée. La [spécification du Game Description Language (GDL)](http://ggp.stanford.edu/readings/gdl_spec.pdf) de Stanford couvre « finite, discrete, deterministic multi-player games of complete information » et observe que le modèle sous-jacent naturel de tels jeux « is a finite state machine ». Ce qui est nouveau dans un moteur de jeu n’est pas la machine d’états mais tout ce qui l’entoure : la physique en virgule flottante, les scripts, les scènes et les GPU.

<div id="2-what-the-landscape-shows" class="anchor-alias" aria-hidden="true"></div>

## 2. Ce que le paysage révèle

<div id="21-game-logic-as-data-already-works-on-one-backend" class="anchor-alias" aria-hidden="true"></div>

### 2.1 La logique de jeu comme donnée, déjà fonctionnelle sur un seul backend

GameRule ([Multimedia Systems 32:564, 2026](https://doi.org/10.1007/s00530-026-02629-8)) exprime le comportement sous forme de règles *quand-faire* propres à chaque acteur, portant sur 14 actions de création, lecture, mise à jour et suppression, et sur 6 conditions. Son contrat déterministe est précis : un ordonnanceur central s'exécute depuis un unique FixedUpdate dans l'ordre de déclaration, la dernière écriture l'emporte, et les créations et suppressions sont différées à la fin du parcours. Les auteurs justifient ce contrat en citant le manuel d'Unity, qui indique que l'ordre d'exécution des scripts « n'est pas garanti entre les builds, les machines ou les versions d'Unity ». Sur trois jeux d'exemple d'Unity (Haunted Jaunt, Survival Shooter, Tanks), le code de comportement passe de 572 à 107 lignes (−81,3 %).

Le coût est mesuré. L'interprétation des règles coûte environ $c \approx 65\ \mu\text{s}$ par acteur et par pas. Avec un budget par pas $T = 20$ ms, le plafond d'acteurs est

$$N_{\max} = \frac{T}{c} = \frac{20\ \text{ms}}{65\ \mu\text{s}} \approx 308,$$

ce qui concorde avec l'observation des auteurs selon laquelle le budget est dépassé entre 200 et 350 acteurs (23,872 ms pour 350). Seul un backend Unity existe, si bien que la portabilité entre moteurs est argumentée mais non démontrée.

<div id="22-order-of-execution-can-be-made-deterministic-by-construction" class="anchor-alias" aria-hidden="true"></div>

### 2.2 L'ordre d'exécution peut être rendu déterministe par construction

Le motif ECS stocke l'état du jeu sous forme de composants attachés à des identifiants d'entités et exécute les comportements sous forme de systèmes opérant sur ceux-ci. Redmond, Castello, Calderón Trilla et Kuper lui donnent un modèle formel, Core ECS ([arXiv:2508.15264](https://arxiv.org/abs/2508.15264)). Ils prouvent qu'un ordonnancement dans lequel chaque paire concurrente de mutations commute est déterministe, et que deux sous-ordonnancements écrivant des ensembles disjoints d'étiquettes de composants peuvent s'exécuter en parallèle sans modifier le résultat. En examinant Bevy ECS, EnTT, Flecs, Specs et apecs, ils constatent qu'aucun ne permet d'attacher un nouveau composant concurremment avec une autre mutation ; de tels changements structurels sont différés et appliqués séquentiellement. Tasnim et Zhao ([SAC 2026, doi:10.1145/3748522.3779910](https://doi.org/10.1145/3748522.3779910)) ajoutent une sémantique opérationnelle et un système de types pour l'archétype ECS qui suit les ensembles de lecture et d'écriture par système, et rapportent sur une simulation de Tower Defense où une disposition parallèle par archétypes a atteint 109,54 images par seconde contre 36,13 pour une base orientée objet. Le spawn et la suppression différés de GameRule relèvent de la même discipline, atteinte indépendamment.

<div id="23-compiling-is-not-the-same-as-being-right" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Compiler n'est pas synonyme d'avoir raison

Le benchmark Mage ([arXiv:2605.07342](https://arxiv.org/abs/2605.07342)) a réalisé 858 tentatives de génération sur 26 motifs de mécaniques Unity. Sans IR, 43 % des sorties ont réussi à l'exécution, mais le F1 de mécanismes (accord entre les mécaniques demandées et celles effectivement implémentées) n'atteignait qu'environ 0,12. Conditionner la génération sur une IR a fait tomber le taux de réussite à l'exécution à 14 % à 21 %, mais a porté le F1 de mécanismes à 0,82 à 1,00. Le taux de compilation était anticorrélé à la correction fonctionnelle : l'erreur de type manquant CS0246 est apparue 469 fois sous conditionnement par IR, et zéro fois sans. Une IR ne décrivant que le comportement et une IR couvrant la scène complète étaient statistiquement indiscernables (test de McNemar, p = 1,0). La leçon pour RCE : un vérificateur qui se contente de prouver que « ça compile » mesure la mauvaise grandeur. Les vérifications d'interface doivent donc être comportementales.

<div id="24-public-benchmarks-with-replayable-traces-exist" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Existent des bancs d'essai publics avec des traces rejouables

GameCraft-Bench ([arXiv:2606.17861](https://arxiv.org/abs/2606.17861); [dépôt](https://github.com/FreedomIntelligence/gamecraft-bench)) propose 140 tâches bidimensionnelles sous Godot 4 réparties en 15 familles. Les soumissions comprennent des traces d’entrée rejouables. L’agent le plus performant présenté dans l’article a atteint 41,46 %, et le dépôt rapporte plus tard 65,70 %. Ce banc ne couvre pas Unity, Unreal, la 3D, le multijoueur, ni les scènes physiques de grande taille. [Summer Engine](https://www.summerengine.com/templates) publie 17 modèles de jeux en source ouverte (rally, plateforme, tower-defense, metroidvania, survivants, tir à la première personne, multijoueur LAN, voxel, etc.). Le cadre General Video Game AI et son VGDL ([arXiv:1802.10363](https://arxiv.org/abs/1802.10363)) fournissent 120 jeux solo et 60 jeux à deux joueurs définis par des ensembles de sprites, d’interactions, de conditions de terminaison et de cartographie de niveaux.

<div id="25-convergence-across-industry-and-research" class="anchor-alias" aria-hidden="true"></div>

### 2.5 Convergence entre l’industrie et la recherche

Plusieurs efforts convergent vers la même forme : des fichiers déclaratifs de scènes et de pipelines, une couche de script isolée, un langage de shader moderne et un journal d’événements.

- [nAIVE](https://github.com/poro/nAIVE) est implémenté en Rust sur `wgpu` avec un ECS (hecs), des scènes, matériaux et pipelines de rendu en YAML, Lua 5.4 avec isolation par entité, des shaders Slang compilés croisée vers WGSL, Rapier pour la physique, un bus d’événements avec validation de schéma YAML et un exécuteur de tests sans affichage. Son [site](https://naive.dev/) présente un fichier YAML de 92 lignes qui déclare un pipeline différé en cinq passes. Son README décrit également une simulation GPU par calcul qui pilote plus de 50 000 entités, choix qui place cette simulation du côté tolérance de la frontière tracée plus loin.
- Capcom décrit REX (« RE neXt Engine ») comme une évolution progressive de RE ENGINE impliquant environ 200 ingénieurs ([Capcom IR](https://www.capcom.co.jp/ir/english/data/oar/2025/re-engine.html)). La couverture de presse ([PC Gamer](https://www.pcgamer.com/gaming-industry/game-development/capcom-announces-plans-to-transform-its-re-engine-into-an-ai-generation-game-engine/)) mentionne six programmes, dont Re:Dox, qui traduit différents types de données en un ensemble commun de règles, et RE:Flows, qui convertit les idées de mécaniques de jeu en un langage de programmation standardisé ; elle indique également que plus de 2 000 personnes utilisent RE Engine.
- La proposition BSN de Bevy ([discussion 14437](https://github.com/bevyengine/bevy/discussions/14437)) définit les scènes comme des valeurs composables `Patch`, `EntityPatch` et `DynamicScene` avec une macro `bsn!` et un format d’actif, tout en laissant les gestionnaires d’événements non résolus.
- [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) exécute la logique de jeu sous forme de réducteurs qui s’exécutent comme des transactions ACID sur des tables et rejoue un journal de commits, qui n’est autre que le journal RCE $D$ sous un autre nom.
- Les ontologies exécutables ([doi:10.48550/arXiv.2601.07964](https://doi.org/10.48550/arXiv.2601.07964)) modélisent le comportement du jeu en BSL sur un graphe d’événements immuable et append-only. L’article recommande une approche hybride dans laquelle la physique, le rendu et l’animation conservent les approches traditionnelles à haute fréquence tandis que les quêtes et les décisions s’exécutent sur le graphe d’événements, reliés par des événements agrégés. Il s’agit du même découpage en couches que celui proposé ici.

<div id="3-the-physics-of-divergence-why-exactness-is-binary" class="anchor-alias" aria-hidden="true"></div>

## 3. La physique de la divergence : pourquoi l'exactitude est binaire

L'addition en virgule flottante n'est pas associative. Sur un matériel parallèle, l'ordre d'une réduction varie d'une exécution à l'autre. Une étude de la non-associativité de la virgule flottante sur matériel parallèle ([arXiv:2408.05148](https://arxiv.org/abs/2408.05148)) définit la variabilité scalaire

$$V_s = 1 - \left| \frac{f_{nd}}{f_d} \right|,$$

où $f_d$ est une réduction déterministe et $f_{nd}$ une réduction non déterministe. La permutation d'une somme de $10^6$ valeurs en double précision distribuées normalement a modifié le résultat jusqu'à environ $4.26 \times 10^{-13}$, et le $|V_s|$ maximal croissait comme $\sqrt{n}$. Une réduction arborescente déterministe a coûté environ 0,2 % de plus qu'une accumulation atomique sur un NVIDIA V100, et jusqu'à 7,8 % sur un GH200. Sur 1 000 exécutions d'entraînement de réseaux de graphes, chaque exécution a produit des poids distincts.

Un jeu transforme ces différences infimes en différences visibles. La dynamique de contact des corps rigides et celle des systèmes à nombreux corps sont typiquement chaotiques. Sous un exposant de Lyapunov local $\Lambda$, une perturbation croît selon

$$\delta(t) = \delta_0 \, e^{\Lambda t},$$

de sorte que le temps nécessaire pour qu'elle atteigne une taille $\Delta$ visible en jeu est

$$t^{*} = \frac{1}{\Lambda} \ln\frac{\Delta}{\delta_0}.$$

*Modèle illustratif :* prenons $\delta_0 \approx 6 \times 10^{-8}$ (un ULP de simple précision, relatif), $\Delta = 1$ (un objet situé de l'autre côté d'un mur) et un $\Lambda = 2\ \text{s}^{-1}$ supposé. On obtient alors $t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ s. C'est le logarithme qui est déterminant : réduire $\delta_0$ d'un facteur un million ne rapporte qu'environ 6,9 secondes supplémentaires. Un accord approximatif ne peut donc pas sauver la simulation. Soit l'état est identique bit à bit, soit il finit par diverger, une prédiction testée directement sur 25 000 ticks de collision multi-ISA présentés plus bas (`GE-H2`).

La pratique confirme ce constat. [Gaffer On Games](https://gafferongames.com/post/floating_point_determinism/) indique que le déterminisme inter-machines exige le même compilateur et le même jeu d'instructions, que Battlezone 2 a rencontré des différences entre AMD et Intel dans les fonctions transcendantes, et que les rejeux de MotoGP ne pouvaient pas être partagés entre Xbox et ordinateurs personnels. Il cite le conseil de Markstein d'interdire la contraction FMA et la réassociation. Le [guide de Rapier](https://rapier.rs/docs/user_guides/rust/determinism/) présente une voie fonctionnelle : le déterminisme multiplateforme n'est garanti qu'avec sa fonctionnalité `enhanced-determinism` (incompatible avec `simd8`), sur des cibles conformes à IEEE 754-2008 (Wasm en fait partie), et en utilisant des fonctions transcendantes logicielles.

Pour le rendu, la [spécification WGSL](https://www.w3.org/TR/WGSL/) indique que « WGSL autorise parfois plusieurs comportements possibles pour une fonctionnalité donnée. C’est un risque de portabilité. » Sa section sur les nombres à virgule flottante va plus loin : « WGSL ne spécifie pas de mode d’arrondi » ; « Une implémentation peut réassocier les opérations » ; elle « peut fusionner des opérations si l’expression transformée est au moins aussi précise que l’originale » ; les entrées et sorties sous-normales de nombreuses opérations « peuvent être réduites à zéro » ; et le builtin `fma` « peut s’étendre à une multiplication ordinaire ... et une addition ». Les pixels sont donc spécifiés pour différer d’une implémentation à l’autre. La [spécification SPIR-V](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) propose un outil plus restreint : sa décoration NoContraction marque une instruction arithmétique qui « ne peut pas être combinée avec une autre instruction pour former une opération unique », et de telles opérations « ne sont pas autorisées à se réassocier ». Il s’agit d’une garde par instruction sur un backend, et non d’une garantie portable pour l’ensemble d’un shader.

<div id="4-the-ir-table" class="anchor-alias" aria-hidden="true"></div>

## 4. Le tableau IR

| Représentation | Couche | Propriété la plus forte (documentée) | Ce qui lui manque pour être une Forme |
|---|---|---|---|
| [Slang](https://shader-slang.org/) | Nuances | IR modulaire ; backends pour D3D12, Vulkan, Metal, D3D11, OpenGL, CUDA, WebGPU, CPU ; système de capacités | Pas d'état de jeu, pas d'événements, pas de garantie de sémantique exacte pour les flottants |
| [Naga](https://github.com/gfx-rs/wgpu/tree/trunk/naga) | Nuances | IR validé ; WGSL, SPIR-V et GLSL en entrée ; SPIR-V, WGSL, MSL, HLSL et GLSL en sortie | Idem ; pas de lien avec un schéma de scène |
| [WGSL](https://www.w3.org/TR/WGSL/) / [WESL](https://wesl-lang.dev/) | Nuances | Analyse d'uniformité ; WESL ajoute les imports, la compilation conditionnelle, les paquets, `wgsl-test` | Permet la réassociation, la fusion et le flush-to-zero ; pas de types côté hôte |
| [SPIR-V](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) | IR binaire de nuance | La décoration NoContraction interdit la fusion et la réassociation par instruction | Seulement par instruction ; pas de sémantique de jeu |
| [MLIR](https://mlir.llvm.org/) | Infrastructure de compilation | Dialectes multi-niveaux pour l'abaissement | Pas un modèle de jeu ; sémantique laissée à chaque dialecte |
| [glTF 2.0](https://www.khronos.org/gltf/) (ISO/IEC 12113:2022) | Ressources et scène | Norme d'échange entre outils | Pas de comportement, pas d'ordre d'exécution |
| [OpenUSD](https://openusd.org/release/intro.html) | Scène | Arcs de composition, chemins d'espace de noms | Se décrit elle-même comme « Not a rigging system » ; pas de sémantique de simulation |
| [BSN](https://github.com/bevyengine/bevy/discussions/14437) | Scène | Correctifs typés sur les composants, imports versionnés | Gestionnaires d'événements non résolus ; Bevy uniquement |
| [SCXML](https://www.w3.org/TR/scxml/) / [XState](https://stately.ai/docs/xstate) | Comportement | Sémantique des micro-pas et macro-pas, priorité selon l'ordre du document, régions parallèles sérielles | Le modèle de données est spécifique à la plateforme ; pas de discipline numérique, pas de scène ni de nuance |
| [GDL](http://ggp.stanford.edu/readings/gdl_spec.pdf) | Règles | Description logique de jeux finis, discrets et déterministes | Pas de physique continue, pas de rendu |
| [VGDL](https://arxiv.org/abs/1802.10363) | Règles | Jeux compacts en grille 2D, grand corpus public | Grille 2D uniquement ; pas de fidélité de rendu ni de physique |
| [Core ECS](https://arxiv.org/abs/2508.15264) | Ordre d'exécution | Théorème donnant une condition pour des ordonnancements concurrents déterministes | Un modèle formel, pas un format de moteur ; pas de scène ni de nuance |
| [GameRule](https://doi.org/10.1007/s00530-026-02629-8) | Règles | Contrat d'ordonnanceur déterministe, économies de code mesurées | Unity uniquement ; environ 65 µs par acteur ; pas de vérificateur formel |
| [nAIVE](https://github.com/poro/nAIVE) | Moteur complet | Scènes et pipelines YAML, Lua, Slang, validation de schéma d'événements | Pas de sémantique formelle publiée ni de vérification de types inter-couches |
| [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) | Logique serveur | Réducteurs comme transactions, rejeu du journal des commits | Côté serveur uniquement ; pas de rendu client ni de scène |

<div id="5-proposed-architecture" class="anchor-alias" aria-hidden="true"></div>

## 5. Architecture proposée

<div id="51-layer-split" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Séparation en couches

1. **Forme de simulation (exacte).** $S$ contient des valeurs à virgule fixe ou strictement IEEE 754, avec FMA et réassociation désactivés et les fonctions transcendantes implémentées par des routines entières ou logicielles épinglées. $E$ contient les événements de tick et les entrées journalisées. $\delta$ utilise la sémantique de macro-étape SCXML : à chaque tick, traiter les événements dans l'ordre de la file, résoudre les conflits par ordre du document, exécuter les régions parallèles de manière sérielle. Les collections itèrent dans un ordre déclaré, conformément au contrat de GameRule (ordre de déclaration, dernière écriture l'emporte, modifications structurelles reportées à la fin du tick). Lorsque le parallélisme est souhaité, le vérificateur n'admet que les ordonnancements satisfaisant la condition de disjointement du Core ECS.
2. **Projection de script (exacte).** Les scripts du concepteur se compilent en gardes et actions sur $S$, émis sous forme de [Rhai](https://rhai.rs/book/about/features.html) (bac à sable, avec garantie « Don't Panic », support no-std et Wasm), Lua ou [Luau](https://luau.org/) (bac à sable par défaut, avec types progressifs). Les scripts ne peuvent appeler $\delta$ que par l'intermédiaire d'actions déclarées. Ils ne peuvent pas lire directement les horloges, les sources aléatoires ou les résultats GPU.
3. **Projection de scène (tolérance en aval).** $\lambda$ associe $S$ à un arbre de patch de type BSN dont le schéma des composants fait partie de la Forme. glTF et OpenUSD servent de cibles d'exportation pour les ressources.
4. **Projection de rendu (tolérance).** Les matériaux et les passes sont rédigés en Slang ou WGSL, et émis via Slang ou Naga vers les backends Metal et Vulkan. Le rendu est une fonction pure de $\lambda(s)$. Aucun résultat GPU ne remonte jamais dans $S$.

<div id="52-inside-the-form-versus-host-effects" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Effets à l'intérieur de la forme versus effets de l'hôte

À l'intérieur : état, transitions, ordre des règles, physique à point fixe pour les corps pertinents pour le jeu, générateur aléatoire avec sa graine dans $S$, schémas d'interface. À l'extérieur, sous forme d'événements journalisés : entrée du dispositif, temps d'horloge murale, paquets réseau, sortie audio, entrée et sortie d'assets, dessins GPU, et toute physique tierce utilisée pour des effets cosmétiques. Le rejeu réinjecte $D$ à travers $\delta$ plutôt que de toucher les dispositifs. Le coût de stockage est modeste. À une fréquence de ticks $f_{\text{tick}} = 60$ Hz et $b = 16$ octets d'entrée par tick, le journal croît à $f_{\text{tick}} \cdot b = 960$ o/s, soit environ 3,5 Mo par heure.

<div id="53-determinism-boundary" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Frontière du déterminisme

- **Critère de la zone exacte :** pour les cibles A et B et chaque tick $t$, $H(s_t^A) = H(s_t^B)$, où $H$ est une fonction de hachage cryptographique appliquée à une sérialisation canonique de $S$.
- **Critère de la zone de tolérance :** pour les images rendues $I^A$ et $I^B$ d'un même $s_t$, la fraction de pixels dont l'erreur par canal dépasse $\varepsilon$ ne doit pas excéder $p_{\max}$, couplée à des seuils bornés de similarité structurelle (`SSIM`) et de rapport signal sur bruit de crête (`PSNR`). La section 6.3 met en œuvre cette calibration sur quatre architectures GPU (`Metal`, `RADV` Vulkan, `NVIDIA` Vulkan et `ANV` Vulkan).
- Le réseau à reprise (rollback) de type [GGPO](https://github.com/pond3r/ggpo), qui repose sur la prédiction des entrées et l'exécution spéculative, n'est valide que du côté exact de cette frontière.

<div id="54-cross-layer-interface-checking" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Vérification d'interface inter-couche

Le vérificateur valide quatre arêtes typées avant toute émission : (a) script vers simulation : chaque action désigne une transition déclarée dont les types d'arguments correspondent ; (b) simulation vers scène : la sortie de $\lambda$ correspond au schéma du composant ; (c) scène vers rendu : chaque liaison de matériau correspond à une ressource Slang ou WGSL de type, groupe et indice de liaison compatibles ; (d) couverture des événements : chaque événement auquel un script s'abonne est générable par une transition ou une source hôte. La constatation de Mage (Section 2.3) explique pourquoi les vérifications d'arêtes sont évaluées à l'aide de traces de comportement, et non par le succès de la compilation.

<div id="6-falsifier-first-test-plan-and-executed-multi-isa--cross-gpu-results" class="anchor-alias" aria-hidden="true"></div>

## 6. Plan de test falsifier-first et résultats multi-ISA / cross-GPU exécutés

Chaque hypothèse est listée avec son critère d'élimination. Si le critère est satisfait, la revendication est retirée. Les sous-sections 6.1 à 6.4 rapportent les trois suites empiriques de falsificateur exécutées (`GE-H1` rejouage multi-ISA `Q32.32` sur 25 cellules cible × hôte, `GE-H2` dérive en virgule flottante cross-ISA sur `x86_64` et `arm64`/`aarch64`, et `GE-H3` tolérance de rendu headless `wgpu` cross-GPU sur Apple `Metal` ainsi que AMD, NVIDIA et Intel `Vulkan`), ainsi qu’un prototype interactif `Q32.32` à budget joule (`GE-H4` à `GE-H9` restent ouverts).

| ID | Hypothèse | Corpus de test | Mesure | Critère d'élimination | Statut |
|---|---|---|---|---|---|
| GE-H1 | Les projections de simulation sont identiques bit à bit entre langages, systèmes d'exploitation et ISA de CPU | Arène 2D à 16 corps Form (`Q32.32` en virgule fixe, état de `732` octets) sur `arm64` macOS, `aarch64` Linux, et AMD/Intel `x86_64` Linux | $H(s_t)$ entre Rust, Wasm32, C++20 (`Clang`/`GCC`), Node.js `BigInt`, Python 3 pendant $10^5$ ticks (`25` cellules) | Toute discordance de hachage à un point de contrôle quelconque sur une cellule `(hôte, cible)` | **Exécuté (`0 / 20 500` discordances, Section 6.1)** |
| GE-H2 | Mode strict contre dérive aux frontières en virgule flottante inter-ISA et dans les bibliothèques/FMA | Arène chaotique 2D à 16 corps (`25 000` ticks sur `arm64` macOS, `aarch64` Linux, et AMD/Intel `x86_64` Linux) | Ticks de divergence exacts `t_div` entre `f64` strict, `libm` `sin/cos` inter-OS, FMA inter-ISA, V8 `Math.sin` et `f32` | Discordance inattendue sous arithmétique algébrique épinglée, ou dérive silencieuse imprévue | **Exécuté sur `arm64`, `aarch64` et `x86_64` (Section 6.2)** |
| GE-H3 | Le rendu inter-GPU reste dans une tolérance bornée (`wgpu` / WGSL) | 4 états canoniques `Q32.32` (`t = 0, 250, 1k, 10k`) rendus à `512×512` `RGBA8Unorm` sur 4 GPU physiques (`Metal`, `RADV`, `NVIDIA`, `ANV`) + `llvmpipe` + `CPU Q16.16` | `SHA-256` du framebuffer, `%` de pixels différents, $\Delta_{\max}$, MAE, RMSE, `PSNR` et `SSIM` | Toute paire de GPU physiques ne satisfaisant pas `PSNR > 40 dB`, `SSIM > 0.999` ou $p(\Delta > 8) \le 0.001$ | **Exécuté (`24/24` passage : `PSNR 64,2-72,1 dB`, `SSIM ≥ 0.99983`, Section 6.3)** |
| GE-H4 | Les règles encodées en Form réduisent le code autant que GameRule | Comportements de Haunted Jaunt, Survival Shooter, Tanks | Lignes de code de comportement | Réduction inférieure à 50 % (GameRule atteignait 81,3 %) | Ouvert |
| GE-H5 | L'exécution de Form dépasse le plafond de GameRule | Mise à l'échelle synthétique d'acteurs | Temps d'étape contre $N$ | Temps d'étape supérieur à 20 ms en dessous de $N = 350$ | Ouvert |
| GE-H6 | Les vérifications d'interface détectent les défauts réels | 26 motifs de Mage ; fautes de liaison et de schéma injectées | Taux de détection ; F1 du mécanisme | Taux de détection inférieur à 90 % des fautes injectées, ou F1 non supérieur au 0,12 sans IR | Ouvert |
| GE-H7 | Balayage complet de la pente $\ln(\Delta/\delta_0)$ sur les modèles de Summer Engine | Modèles de Summer Engine à forte composante physique réexprimés en Forms | Temps de divergence contre $\delta_0$ injecté | Pente de $t^{*}$ contre $\ln(1/\delta_0)$ non distinguishable de zéro | Ouvert |
| GE-H8 | Le rejeu est complet | Sessions enregistrées d'une heure | Hachage final reproduit à partir de $D$ seul | Tout rejeu nécessitant un état absent de $D$ | Ouvert |
| GE-H9 | Parité des performances | 140 tâches de GameCraft-Bench via un émetteur Form-to-Godot | Taux de passage par rapport aux soumissions natives Godot | Taux de passage inférieur sur des entrées identiques en comportement | Ouvert |

<img src="/figures/game-engines/cross-gpu-tolerance.svg" alt="Résumé empirique en deux panneaux de part et d'autre de la frontière de déterminisme. Le panneau de gauche présente la zone exacte GE-H1 (0 non-concordance sur 20 500 points de contrôle SHA-256 répartis sur 25 cellules, sur macOS arm64, Linux aarch64 et Linux x86_64 AMD/Intel) ainsi que les graduations de divergence f64 inter-ISA GE-H2 (t_div = 10 pour libm d'Apple contre sin/cos de GNU glibc, t_div = 406 pour VFMADD x86_64 contre FMADD arm64 sans -ffast-math). Le panneau de droite présente les barres de PSNR minimal de la zone de tolérance GE-H3 pour les 6 paires de GPU physiques (Apple Metal, AMD RADV Vulkan, Intel ANV Vulkan, NVIDIA Vulkan), comprises entre 64,2 et 72,1 dB, nettement au-dessus du seuil de 40 dB, avec 1,3 % à 9,3 % de pixels différant de 1 à 2 LSB.">

*Figure 3. Frontière empirique entre `GE-H1`, `GE-H2` et `GE-H3`. L'état de simulation amont `Q32.32` (`S`) présente `0 / 20 500` non-concordances de points de contrôle `SHA-256` sur cinq machines et trois ISA, alors que les `f64` `sin/cos` et `FMA` non épinglés divergent aux frontières OS/ISA dans un intervalle de `10` à `406` ticks. En aval de $\lambda(s_t)$, les quatre architectures GPU produisent des empreintes `SHA-256` `RGBA8Unorm` distinctes (différences de pixels de `1,3 %` à `9,3 %` de `1` à `2` LSB), tout en restant strictement au-dessus de `64,1 dB` de `PSNR` et de `0,99983` de `SSIM` (`measured_j = None`, `board_metered = false`).

<div id="61-ge-h1-multi-isa-and-multi-os-100000-tick-determinism-q3232-integer-physics" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `GE-H1`: Déterminisme de 100 000 ticks multi-ISA et multi-OS (`Q32.32` physique entière)

*Pré-enregistré sous `PREREG_wave3_multi_isa_wgpu.json` (`SHA-256: 1721e5bdffaf...`). La télémétrie sépare strictement les niveaux `SATB` `L2` et `L3` `reported_j` (`L2` : Linux `/sys/class/powercap/intel-rapl:0/energy_uj` compteurs socket/paquet et cœur ; `L3` : macOS par-PID `proc_pid_rusage(child_pid, RUSAGE_INFO_V6).ri_energy_nj`; `measured_j = None`, `board_metered = false`). Explorateur interactif et JSON brut : [`/living/game-engines/`](/living/game-engines/) ([`results.json`](/living/game-engines/results.json)).*

Un Form d'arène à collision élastique 2D contenant 16 corps + 4 objets à ramasser et un FSM de refroidissement (`Q32.32` coordonnées signées 64 bits à virgule fixe dans `[-64, +64]`, produits intermédiaires de `128` bits, racine carrée entière à plancher `isqrt_u128`, respawn différé des objets structuraux, vecteur d'état canonique little-endian de `732` octets) a été exécuté pendant `100,000` ticks sur **cinq machines, trois ISA (`arm64`/`AArch64`, `x86_64`, `wasm32`), deux systèmes d'exploitation (`macOS 27.2.1`, `Ubuntu Linux 6.8 / 7.0`) et six projections langage/compilateur (`25` cibles × cellules hôte)** :

| Hôte (`ISA` · `OS`) | Projection cible | ms paroi / `100k` (moyenne ± ET) | `ns / tick` | Canal de télémétrie (`reported_j`) | `reported_j` / `100k` (J) | Points de contrôle `SHA-256` vérifiés |
|---|---|---:|---:|---|---:|:---:|
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_native` (`rustc 1.100 -O`) | `22.333 ± 5.043` | `223.3` | `L3` par-PID `ri_energy_nj` | **`0.1028 ± 0.0247`** | `100 / 100` (`pas 1 000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `cpp20_clang_o3` (`Apple Clang 21`) | `21.022 ± 1.657` | `210.2` | `L3` par-PID `ri_energy_nj` | **`0.1090 ± 0.0134`** | `100 / 100` (`pas 1 000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_wasm32_node` (`Node v26.13`) | `84.300 ± 11.334` | `843.0` | `L3` par-PID `ri_energy_nj` | **`0.4480 ± 0.0881`** | `100 / 100` (`pas 1 000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `javascript_bigint_node` (`ES2024`) | `717.955 ± 36.304` | `7 179.6` | `L3` par-PID `ri_energy_nj` | **`4.4021 ± 0.4048`** | `100 / 100` (`pas 1 000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `python_3_13` (`CPython 3.13.14`) | `2 945.816 ± 284.033` | `29 458.2` | `L3` par-PID `ri_energy_nj` | **`13.5999 ± 1.9086`** | `100 / 100` (`pas 1 000`) |
| **Apple M3 Ultra** (`arm64` · `macOS 27.2.1`) | `rust_native` / `cpp20_clang_o3` | `32.711` / `33.727` | `327.1` / `337.3` | `L3` par-PID `ri_energy_nj` | **`0.0729` / `0.0755`** | `2 × 1 000 / 1 000` (`pas 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `21.793` / `23.061` / `26.677` | `217.9` - `266.8` | `L2` AMD RAPL pkg (cœur `0.13`-`0.21 J`) | **`1.958` / `2.349` / `2.932`** | `3 × 1 000 / 1 000` (`pas 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `145.29` / `1 347.80` / `2 546.42` | `1 452.9` - `25 464.2` | `L2` AMD RAPL pkg (cœur `1.01`-`12.23 J`) | **`14.44` / `115.81` / `181.87`** | `3 × 1 000 / 1 000` (`pas 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `39.718` / `36.868` / `58.792` | `368.7` - `587.9` | `L2` Intel RAPL pkg (cœur `1.64`-`2.68 J`) | **`2.062` / `1.888` / `3.026`** | `3 × 1 000 / 1 000` (`pas 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `158.35` / `1 390.46` / `3 375.07` | `1 583.5` - `33 750.7` | `L2` Intel RAPL pkg (cœur `5.65`-`124.90 J`) | **`6.89` / `60.79` / `149.48`** | `3 × 1 000 / 1 000` (`pas 100`) |
| **NVIDIA Jetson Thor** (`Armv9-A` `aarch64` · `Linux 6.8`) | `rust_native` / `clang` / `gcc` / `wasm32` / `js` / `py3.12` | `39.28` (`GCC`) - `4 407.89` (`Py`) | `392.8` - `44 078.9` | CPU uniquement (`reported_j = null`, GPU non sollicité) | `null` | `6 × 1 000 / 1 000` (`pas 100`) |

- **Verdict** : **`PASS_ZERO_MISMATCHES` (`0 / 20,500` points de contrôle `SHA-256` vérifiés ; `0 / 190,000` comparaisons par paires au pas de `100` sur les `20` cellules de traces complètes de la vague 3)**. Chaque cible sur chaque hôte a produit `2683c3f7cb8b...` au tick `100`, `21fa688e4ee8...` au tick `1,000`, `ea01ba793841...` au tick `50,000` et `82e404df6475d64d...` au tick `100,000`.
- **Portée de la télémétrie et couverture des systèmes d'exploitation** : Il convient de noter que les valeurs `reported_j` de `L2` et de `L3` ne doivent jamais être confondues. L'attribut `ri_energy_nj` de `L3` sous Apple impute l'énergie des cœurs CPU exclusivement au PID de l'enfant benchmarké (`0.073`-`0.109 J` pour du Rust et du C++ natifs), tandis que `/sys/class/powercap/intel-rapl:0` (`L2`) sous Linux intègre la puissance du boîtier (package) de l'ensemble du socket, y compris celle de tous les démons d'arrière-plan (`1.89`-`2.06 J` pour le package contre `0.13`-`1.83 J` pour le sous-domaine `core`). La compilation croisée via `x86_64-w64-mingw32-g++` et `wine64` a été vérifiée et s'est révélée absente sur les exécuteurs Linux partagés, et l'hôte Windows `x86_64` sur matériel nu était éteint pendant l'exécution. L'exécution des fichiers PE Windows reste donc non vérifiée sur matériel nu, bien que la cible indépendante du système d'exploitation `wasm32-unknown-unknown` ait donné des résultats identiques sous macOS et Linux, sur `arm64` comme sur `x86_64`.

<div id="62-ge-h2-cross-isa-and-cross-os-25000-tick-floating-point-drift-ieee-754-f64" class="anchor-alias" aria-hidden="true"></div>

### 6.2 `GE-H2` : Cross-ISA et cross-OS dérive à virgule flottante sur 25 000 ticks (`IEEE 754` `f64`)

Pour vérifier si les simulations `IEEE 754` `binary64` (`f64`) restent synchronisées entre `x86_64` et `arm64`/`aarch64` lorsque `-ffast-math` est *interdit*, l’arène chaotique identique à 16 corps a été avancée pendant `25,000` ticks (`~6.94` minutes à `60 Hz`), en hachant les bits canoniques `IEEE 754` (`t_div_ieee_bits`), les positions quantifiées à `10^-3` unité-d’arène (`t_div_macro_1e3`), et l’état de jeu discret (`t_div_gameplay`) à chaque tick :

| Hôte / Cible A | Hôte / Cible B | Mécanisme de perturbation | `t_div_ieee_bits` | `t_div_macro_1e3` | `t_div_gameplay` |
|---|---|---|---:|---:|---:|
| `arm64` macOS `Clang 21` (`f64_strict`) | AMD Zen 5 & Intel RPL `x86_64` Linux `Clang 21` / `GCC 15.2` | Cross-ISA et Cross-OS algébrique `f64` + `sqrt`, `FMA` désactivé (`-ffp-contract=off`, pas de trig) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| `x86_64` Linux `glibc 2.43` (`f64_trig`) | `aarch64` Linux `glibc 2.39` (`f64_trig`) | Cross-ISA Linux GNU `glibc` `std::sin/cos` (`-ffp-contract=off`, pas de `-ffast-math`) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| **Apple `arm64` macOS (`f64_trig`, `-ffp-contract=off`)** | **AMD/Intel `x86_64` & Thor `aarch64` Linux (`f64_trig`, `-ffp-contract=off`)** | **Cross-OS standard `libm` `std::sin/cos` (`Apple libSystem` vs `GNU glibc`, pas de `-ffast-math`)** | **`10`** (`0.17 s`) | **`5,900`** | **`9,798`** (`163.3 s`) |
| **`x86_64` Linux (`-O3 -mavx2 -mfma -ffp-contract=fast`)** | **Apple `arm64` & Thor `aarch64` (`-O3 -ffp-contract=fast`)** | **Réduction `FMA` Cross-ISA (`x86_64 VFMADD/VFNMADD` vs `AArch64 FMADD/FMSUB`, uniquement algébrique, pas de `-ffast-math`)** | **`406`** (`6.77 s`) | **`7,422`** | **`11,205`** (`186.8 s`) |
| **`x86_64` Linux `Node v22.22` (`f64_trig`)** | **`aarch64` Linux `Node v24.22` (`f64_trig`)** | **Node.js V8 `Math.sin/cos` Cross-ISA (`x86_64` vs `aarch64`)** | **`66`** (`1.10 s`) | **`7,617`** | **`10,093`** (`168.2 s`) |
| **`cpp_f64_strict` (`-ffp-contract=off`)** | **`cpp_f64_fma` / `-ffast-math`** | **Contraction `FMA` même hôte (`-ffp-contract=off` vs `-ffp-contract=fast`)** | **`192`** (`3.20 s`) | **`5,927`-`6,576`** | **`8,869`-`10,093`** |
| **`cpp_f64_strict` / `trig`** | **`cpp_f32_strict` / `trig`** | **Réduction de précision (`binary64` `f64` vs `binary32` `f32`)** | **`1`** | **`8`-`9`** | **`1,370`-`2,240`** |

Trois résultats inter-ISA nets émergent :

1. **Les opérations IEEE 754-2008 `+`, `-`, `*`, `/` et `sqrt` avec `FMA` désactivé (`-ffp-contract=off`) sont portables bit à bit entre `x86_64` et `arm64`/`aarch64`** (`0` discordance sur `25 000` pas de simulation à travers `Clang`, `GCC`, `Rustc` et `V8`), car les cinq opérations sont tenues d'arrondir à `0,5` ULP.
2. **Le `std::sin`/`std::cos` standard du C++ rompt le déterminisme inter-OS dès le pas de simulation `10` (`0,17 s`) même avec `-ffp-contract=off -fno-fast-math`** : la `libm` de `libSystem` d'Apple et la `glibc` de GNU arrondissent une impulsion de pilotage différemment de `1` ULP au pas `10`, ce que les collisions chaotiques à `16` corps amplifient en une erreur de position `> 10^-3` au pas `5 900` et en une désynchronisation discrète du score/ramassage au pas `9 798` (`163,3 s`).
3. **La contraction `FMA` par défaut du compilateur (`-ffp-contract=fast`, sans `-ffast-math` ni aucune trigonométrie) rompt le déterminisme inter-ISA au pas `406` (`6,77 s`)** : alors qu'AMD Zen 5 et Intel Raptor Lake s'accordent bit à bit sur `x86_64` (`844172b5...`), et qu'Apple M3 Ultra et Jetson Thor s'accordent bit à bit sur `AArch64` (`deeb446c...`), LLVM abaisse les expressions de soustraction-multiplication négative différemment entre `x86_64` (`AVX2` `VFMADD`/`VFNMADD`) et `AArch64` (`NEON` `FMADD`/`FMSUB`), désynchronisant le jeu au pas `11 205`.

<div id="63-ge-h3-cross-gpu-headless-wgpu-metal--vulkan-rendering-tolerance" class="anchor-alias" aria-hidden="true"></div>

### 6.3 `GE-H3` : tolérance du rendu `wgpu` headless inter-GPU (`Metal` / `Vulkan`)

Pour tester empiriquement le côté droit de la Figure 1, un benchmark `wgpu` headless autonome en Rust (`v22.1.0`), nommé `ge_h3_wgpu_bench`, a rendu quatre instantanés canoniques de simulation en `Q32.32` (`ticks 0, 250, 1,000, 10,000`) dans des framebuffers `512×512` en `RGBA8Unorm` (`262,144` pixels, `1,048,576` octets par image). Le rendu repose sur un pipeline WGSL en deux passes : un fond procédural trigonométrique de type radar/grille, puis `20` entités SDF et sphères/tores 3D éclairés par Blinn-Phong, composées par mélange alpha `SrcAlpha / OneMinusSrcAlpha` dans l'ordre de déclaration. Ce rendu est comparé à un rastériseur logiciel de référence entier `CPU Q16.16`, sans aucune opération en virgule flottante.

| Adaptateur A (`API` · Pilote) | Adaptateur B (`API` · Pilote) | Pixels différents moyens (`%`) | Max $|\Delta|$ (`0..255`) | MAE moyenne (`u8`) | RMSE moyenne (`u8`) | `PSNR` minimal (`dB`) | `SSIM` minimal | Porte `GE-H3` |
|---|---|---:|---:|---:|---:|---:|---:|:---:|
| **Apple M3 Ultra (`Metal` 4)** | **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | `1.301%` | `2` | `0.00386` | `0.06215` | **`72.06`** | **`0.999986`** | **Réussi** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **Apple M3 Ultra (`Metal` 4)** | `3.103%` | `1` | `0.00788` | `0.08876` | **`69.09`** | **`0.999956`** | **Réussi** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | `3.774%` | `2` | `0.01022` | `0.10116` | **`67.97`** | **`0.999951`** | **Réussi** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `6.553%` | `2` | `0.01735` | `0.13179` | **`65.64`** | **`0.999874`** | **Réussi** |
| **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `8.280%` | `2` | `0.02149` | `0.14667` | **`64.79`** | **`0.999844`** | **Réussi** |
| **Apple M3 Ultra (`Metal` 4)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `9.337%` | `2` | `0.02467` | `0.15720` | **`64.16`** | **`0.999833`** | **Réussi** |
| GPU physiques (`4` fournisseurs) | `Mesa llvmpipe` (`LLVM 21.1.8` CPU `Vulkan`) | `1.541%` - `9.633%` | `2` - `3` | `0.00477` - `0.02601` | `0.06895` - `0.16173` | `63.86` - `70.87` | `0.999828` - `0.999984` | **Réussi** |
| GPU physiques (`4` fournisseurs) | Référence entière sans flottant `CPU Q16.16` | `20.400%` - `27.626%` | `2` | `0.05612` - `0.07864` | `0.23689` - `0.28068` | `59.13` - `60.58` | `0.999556` - `0.999693` | **Réussi** |

- **Exactitude binaire réfutée, tolérance bornée confirmée (`24 / 24` paires de trames GPU physiques)** : Chaque paire GPU physique a produit des hachages bruts `RGBA8` `SHA-256` distincts (`0 / 24` accords bit à bit) en raison des approximations du SFU matériel `sin`/`cos`/`pow` et de l’arrondi du mélange ROP `unorm8`, pourtant **aucun pixel sur aucune paire GPU physique ne différait de plus de `2 / 255`** ($p(|\Delta| > 8) = 0.000000 \le 0.001$), le `PSNR` dépassait `64.16 dB` (`> 40.0 dB` seuil), et le `SSIM` dépassait `0.999833` (`> 0.999` seuil) à `0.31`-`2.80 ms` par trame.  
- **Contraste du rasteriseur logiciel** : Le rasteriseur logiciel entier `CPU Q16.16` à virgule fixe a obtenu `0` divergences `SHA-256` du tampon d'image sur `Apple M3 Ultra` (`arm64`), `AMD Zen 5` (`x86_64`) et `Intel Raptor Lake` (`x86_64`) (`9c693a38...` au tick `0`, `ce3b2cec...` au tick `10,000`), et `Mesa llvmpipe` (`LLVM 21.1.8`) a correspondu bit à bit entre les hôtes AMD et Intel `x86_64` (`ccb291f6...` au tick `0`), illustrant que la divergence des pixels provient spécifiquement de la variabilité du matériel GPU shader/ROP plutôt que de la projection de scène $\lambda(s_t)$.

<div id="64-playable-joule-native-q3232-chrono-budget-arena-livinggame-engines" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Arène de chrono-budget `Q32.32` joule-native jouable (`/living/game-engines/`)

En associant le contrat de rejeu exact `Q32.32` de cette étude aux mécaniques temporelles natives de l’énergie de [Le temps comme indice](/papers/time-as-an-index/) (section 9.2), l’instrument 4 de [`/living/game-engines/`](/living/game-engines/) fournit un mini-jeu jouable de navigation orbitale et de défense par ramassage, déterministe à `60 Hz` et s’exécutant en JavaScript `BigInt` (`0` opération en virgule flottante à l’intérieur de la simulation) :

- **Bande d’état `SHA-256` en direct et rejeu déterministe** : Chaque tick met à jour un condensat d’état `SHA-256` roulant et enregistre des événements d’entrée du joueur compacts d’un octet dans $D$ ; cliquer sur `Rejouer et vérifier le SHA-256` réexécute l’intégralité de la partie à partir de `(seed, D)` et vérifie l’égalité bitwise des hachages (`replayed_sha256 === live_sha256`).
- **Prévision temporelle et rembobinage budgétés en joules (modèle de conception `est_j`)** : Interroger des trajectoires futures (`Aperçu de branche Hellman`, simulation de `3` branches de pilotage candidates `K` ticks en avant) ou rembobiner jusqu’à un point de contrôle causal persistant débite une batterie explicite en microjoules (`µJ`) (`step_cost_uj` par tick spéculatif plus coût d’effacement de branche de Landauer lorsque les futurs non choisis ou les lignes temporelles rembobinées sont abandonnés), jouable au clavier, à la souris/tactile et avec des contrôleurs `WebXR` / `Gamepad` (y compris le navigateur Meta Quest).

<div id="7-infeasibility-flags" class="anchor-alias" aria-hidden="true"></div>

## 7. Indicateurs d'infaisabilité

1. **Rendu matériel bit-exact entre GPU : infaisable (`0 / 24` correspondances `SHA-256` entre `Metal`, `RADV`, `NVIDIA` et `ANV` dans `GE-H3`), alors qu'une tolérance perceptuelle bornée (`PSNR > 64 dB`, `SSIM > 0.9998`, $\Delta_{\max} \le 2$) tient lorsque les sorties GPU ne réinjectent jamais dans $S$.**
2. **Physique exacte multiplateforme avec les réglages flottants par défaut : infaisable.** Même *sans* `-ffast-math`, les `std::sin`/`std::cos` inter-OS (`Apple libm` contre `GNU glibc`) divergent dès le tick `10`, et la contraction `FMA` inter-ISA (`x86_64` contre `arm64`, `-ffp-contract=fast`) diverge au tick `406`, avec une propagation vers une désynchronisation du gameplay en `9 798` à `11 205` ticks (`GE-H2`).
3. **Calcul GPU à l'intérieur de la simulation : infaisable en exact ; faisable uniquement avec des réductions déterministes**, à un coût mesuré d'environ 0,2 % à 7,8 % sur le matériel cité, et toujours soumis à la contraction du compilateur sauf à être protégé instruction par instruction (SPIR-V NoContraction) sur chaque cible.
4. **Comportement portable entre moteurs : non démontré dans aucune source externe lue ; démontré au niveau du noyau de physique 2D dans `GE-H1` sur `25` cellules cible × hôte (`5` machines, `3` ISA, `6` environnements d'exécution ou compilateurs), tandis que les projections vers des moteurs complets (`GE-H4`, `GE-H9`) restent ouvertes.**
5. **Règles interprétées à grand nombre d'acteurs : contraintes.** La mesure GameRule implique un plafond proche de 300 acteurs à 20 ms (`GE-H1` montre en outre que les `int` Python coûtent `73×` à `132×` le `reported_j` d'un Rust natif sur Intel, AMD et Apple Silicon) ; une projection native compilée ou WebAssembly est requise à grande échelle.
6. **Moteurs propriétaires et cibles Windows bare-metal comme cibles exactes : non vérifié.** Le manuel d'Unity, tel que cité par GameRule, exclut toute garantie d'ordonnancement ; les catalogues de modèles Unity et Unreal n'ont pas pu être lus (leurs pages sont rendues côté client), aucune source sur l'ordre d'exécution d'Unreal n'a été lue, et l'exécution `PE` Windows bare-metal n'était pas active dans le parc de runners Linux/macOS de la vague 3.

<div id="8-sources-and-limits" class="anchor-alias" aria-hidden="true"></div>

## 8. Sources et limites

Toutes les sources ci-dessus ont été lues intégralement aux passages cités, sauf : l'article GameCraft-Bench (résumé et README du dépôt lus), la page « about » de RCE (page de synthèse lue) et l'article de presse Capcom (un seul article). Les études maison citées pour les niveaux de télémétrie (`SATB`) et les mécaniques temporelles de jeu budgétées en joules sont [Le temps comme indice](/papers/time-as-an-index/) et le [Banc d'essai hiérarchisé de satiation](/papers/satb-harness/) (`[same house]`). Sources consultées mais non citées comme preuves : le [portail Ludii](https://ludii.games/), qui décrit les jeux comme des ensembles structurés de ludèmes ; le dépôt amateur Game Grammar ; et les README de [PlayCanvas](https://github.com/playcanvas/engine), [Babylon.js](https://github.com/BabylonJS/Babylon.js) et [three.js](https://github.com/mrdoob/three.js), qui décrivent des bibliothèques de rendu plutôt que des formats de description de jeux.

Non lues, payantes ou autrement indisponibles : T. Schaul, « A Video Game Description Language for Model-based or Interactive Learning », IEEE CIG 2013, doi:10.1109/CIG.2013.6633610 ; J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845. M. Ebner et al., « Towards a Video Game Description Language », doi:10.4230/DFU.Vol6.12191.85, est en libre accès mais n'a pas été lu pour cette étude.

Dans la section 6, `GE-H1`, `GE-H2` et `GE-H3` laissent `measured_j = None` et `board_metered = false` sur toutes les exécutions (séparant le `ri_energy_nj` par processus macOS `L3` du `reported_j` `RAPL` socket/cœur Linux `L2`, et en maintenant les mécaniques `est_j` de l'Arène Chrono-Budget strictement analytiques). L'exécution bare-metal Windows `PE`, le rendu Direct3D 12 `wgpu` et les émetteurs multi-moteurs (`GE-H4`-`GE-H9`) restent des travaux ouverts.
