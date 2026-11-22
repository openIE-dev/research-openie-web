---
title: "Nul déterministe : une expérience témoin pré-enregistrée pour les substrats neuronaux et agentiques"
deck: "Une boucle de cas en entiers 64 bits sans appel de modèle (Shape D : N0 strict et N1 cristallisé en dev) implémentée en Rust, Go, Python, C++20 et Julia, verrouillée par des preuves de calendrier Bitcoin OpenTimestamps avant les tours d'aléa drand de la League of Entropy, et comparée aux modèles de langage de pointe en nuage et locaux à poids ouverts sur 4,030 instances réservées et 6 dépôts multi-fichiers. Les compteurs sur puce Apple Silicon IOReport et rusage du noyau sont enregistrés comme reported_j ; aucun wattmètre ou joulemètre externe sur prise ou rail n'a été branché (board_metered vaut false ; measured_j n'est pas défini)."
lang: "fr"
source: "deterministic-null"
complete: true
---

<div id="deterministic-null-a-pre-registered-control-experiment-for-neural-and-agentic-substrates" class="anchor-alias" aria-hidden="true"></div>

*Révision 7eb0ad5, 22 novembre 2026. Résumé des données et empreintes : [/data/#deterministic-null](/data/#deterministic-null). Figures interactives vivantes : [/living/deterministic-null/](/living/deterministic-null/). Jumeau d'archive LaTeX : [/pdfs/latex/deterministic-null.pdf](/pdfs/latex/deterministic-null.pdf) ([source](/pdfs/latex/deterministic-null.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Vue d'ensemble

Les évaluations empiriques de l'intelligence artificielle agentique comparent systématiquement un modèle de langage stochastique à un autre, laissant non mesurée la part de l'achèvement de la tâche qui exige un substrat neuronal au moment de la décision plutôt qu'une procédure entière fixe opérant sur une mémoire explicite de cas antérieurs vérifiés. Cette étude construit, fige et audite ce témoin manquant, le **Nul déterministe (`Shape D`)**, et teste par classe l'hypothèse nulle $H_{0,k}: \Delta_k = p_{\text{model},k} - p_{\text{null},k} \le \delta$ à la marge $\delta = 0.05$ (`5.0` points de pourcentage) à travers deux expériences confirmatoires pré-enregistrées cryptographiquement (`4,030` instances réservées post-balise au total) ainsi qu'une étude multi-tours de réparation de bogues sur dépôts (`6` dépôts Python multi-fichiers). Les compteurs d'énergie locaux sur Apple M5 Max (`IOReport` et `proc_pid_rusage`) sont enregistrés comme valeurs `reported_j` du système d'exploitation et de la puce ; l'énergie des serveurs distants des modèles fermés est enregistrée strictement comme `not_available` ; aucun appareil de mesure matérielle sur rail d'alimentation ou prise murale n'a été raccordé (`board_metered = false`, `measured_j = None`).

**En termes simples**

1. La plupart des bancs d'essai d'agents comparent un modèle A à un modèle B sans demander quelle part du problème résout déjà une boucle de consultation sans appel de modèle sur des exemples antérieurs vérifiés.
2. Sur `2,840` instances tirées de familles bornées algébriques, de preuves formelles et de transactions structurées (`exp-001`, Track-A), une table de cas entière figée (`0` appel de modèle au moment de la décision) égale les modèles de pointe en nuage sur `9` cellules classe-palier sur `10`, n'échouant que sur `12` tournures idiomatiques clients en texte libre non indexées (`+36.40` points de pourcentage pour `Claude Opus 5.5`).
3. Sur `1,190` instances uniques issues de bancs d'essai publics rédigés en externe (`exp-002`, Track-B : Berkeley Function-Calling Leaderboard `v3`, Sierra `tau-bench` Retail, `BigCodeBench v0.1.3` et `SWE` (génie logiciel)-bench Verified) ainsi que `6` dépôts multi-fichiers inédits, la synthèse neuronale apporte `+52.80` à `+95.00` points de pourcentage partout où la masse de clés inédites reste élevée ; pourtant, sur des formules uniques de satisfiabilité ternaire (`3-satisfiability`) à la transition de phase, les modèles de langage à tour unique s'effondrent (`0.0%-5.2%`) en dessous à la fois de la table entière bornée (`69.6%`) et de l'apprentissage de clauses guidé par les conflits autonome avec vérification de preuves clausales (`100.0%`), et sous des flux zipfiens récurrents la cristallisation en ligne réduit de `3.59×` les appels de modèle et l'énergie sans perte d'achèvement de la tâche.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termes, acronymes et étiquettes de mesure

<ul id="terms">
<li>AI, ML, LLM, LLMs, MoE, E4B, A3B: intelligence artificielle, apprentissage automatique, grand(s) modèle(s) de langage, mélange d'experts (Mixture-of-Experts), architecture à 4 milliards de paramètres effectifs et routage à 3 milliards de paramètres actifs</li>
<li>OBSERVE, REDUCE, FUZZ, LOOKUP, ACT, VERIFY, MUTATE, WRITE: les huit étapes séquentielles de la boucle de décision entière du Nul déterministe</li>
<li>SATB, SUT, SUTs, PFRK, TH2, DOSSIER: contrat du banc d'essai Satiation Benchmark, système(s) sous test, résultats de tentative à quatre issues (succès, échec, refus, interrompu), menace d'équipe rouge 2 (aucun solveur caché dans les primitives d'action) et dossier d'état de l'art et d'équipe rouge du projet</li>
<li>DNULLMM1, FT, LCB: format binaire d'index de mémoire projetée en mémoire, table de fonctions par classe et borne inférieure de confiance de Hoeffding</li>
<li>DRAT, RUP, CDCL, CNF, SAT, UNSAT: tautologie asymétrique de résolution avec suppression (Deletion Resolution Asymmetric Tautology), propagation unitaire inverse (Reverse Unit Propagation), apprentissage de clauses guidé par les conflits (Conflict-Driven Clause Learning), forme normale conjonctive, satisfiable et insatisfiable</li>
<li>BV, AST, XOR, IEEE, UC: vecteur de bits modulaire de largeur fixe, arbre syntaxique abstrait, OU exclusif bit à bit, Institute of Electrical and Electronics Engineers (norme à virgule flottante IEEE-754) et University of California</li>
<li>BFCL, BCB, SWE, SQL, DB, SAVEPOINT: Berkeley Function-Calling Leaderboard, BigCodeBench, préfixe de banc d'essai de génie logiciel, Structured Query Language, base de données relationnelle et point de sauvegarde transactionnel avec retour arrière</li>
<li>API, CLI, MCP, HTTP, JSON, JSONL, UTF: interface de programmation applicative, interface en ligne de commande, Model Context Protocol, Hypertext Transfer Protocol, JavaScript Object Notation, JSON délimité par lignes et Unicode Transformation Format</li>
<li>POSIX, MMAP, SHA, OTS: Portable Operating System Interface, entrées/sorties de fichiers projetés en mémoire, Secure Hash Algorithm (SHA-256) et preuve de calendrier Bitcoin OpenTimestamps</li>
<li>BCa, CI, CIs, UCL: bootstrap corrigé du biais et accéléré, intervalle(s) de confiance et borne supérieure de confiance de Wilson</li>
<li>CPU, GPU, ANE, SoC, PID, OS, RAM, DRAM, NVMe, PSU, AC: unité centrale de traitement, processeur graphique, Apple Neural Engine, système sur puce, identifiant de processus, système d'exploitation, mémoire vive, mémoire vive dynamique, Non-Volatile Memory Express, bloc d'alimentation et alimentation murale en courant alternatif</li>
<li>RAPL, NVML, KV, GGUF, RPM, RPD, USD, EDA: Intel Running Average Power Limit, NVIDIA Management Library, cache clé-valeur, poids quantifiés au format GPT-Generated Unified Format, requêtes par minute, requêtes par jour, dollars des États-Unis et automatisation de la conception électronique</li>
<li>RCE, MoL, WCA, JEPA, LUT6: Reality Code Engine [même maison], Mixture of Limits (mélange de limites) [même maison], Wise Computer Automation [même maison], Joint-Embedding Predictive Architecture et table de correspondance booléenne à 6 entrées</li>
</ul>

À travers les niveaux de télémétrie L0 à L4, quatre classes de mesure restent strictement séparées dans l'ensemble des tableaux et des figures de cette étude :

| Étiquette de mesure | Signification dans cette étude |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | Empreintes de mémoire en virgule fixe 64 bits identiques au bit près (`SHA-256`), preuves de calendrier `.ots` OpenTimestamps, tours de balise `drand` de la League of Entropy, décomptes de tokens et d'appels capturés par `satb-proxy`, et prix catalogue d'API datés en dollars (`USD`). |
| **`Reported (reported_j: L2 & L3 Counters)`** | Joules de fenêtre sur puce Apple Silicon sans privilèges root via `IOReport` (`macmon`, niveau de télémétrie `L2`, étiquette d'hôte partagé `A2`) et compteur noyau macOS par PID `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3`, étiquette `D`). Il ne s'agit pas d'un instrument physique sur rail matériel (`measured_j = None`, `board_metered = false`). |
| **`Not Available (label N)`** | Énergie des serveurs distants d'API fermées (`Claude Opus 5.5`, `Claude Sonnet 5.5`, `Gemini 2.5 Flash`) et énergie à la prise murale en courant alternatif `L0`. Les médianes de flotte et les multiplicateurs issus de la littérature ne sont jamais substitués dans les reçus. |
| **`Invalidated Derived (Falsifier 6)`** | La soustraction nette au-dessus du repos (`derived_marginal_j`) est automatiquement écartée dès que des processus colocataires sur l'hôte partagé induisent une dérive de la ligne de base au repos avant/après `> 5.0%` sur les niveaux de télémétrie L0 à L4, tout en conservant intacts les compteurs bruts `reported_j`. |

<div id="11-lineage-prior-art-boundaries-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Filiation, frontières de l'état de l'art et divulgation de même maison

Aucune nouveauté n'est revendiquée pour la boucle de décision elle-même. Les cycles de raisonnement à partir de cas extraire-réutiliser-réviser-retenir remontent à Stanfill et Waltz (1986) ainsi qu'à Aamodt et Plaza (1994) ; l'équilibrage tabulaire de pendule inversé remonte à Michie et Chambers (1968) ; les tables de règles floues remontent à Mamdani et Assilian (1975) ainsi qu'à Wang et Mendel (1992) ; la journalisation de preuves de satisfiabilité via `RUP/DRAT` remonte à Goldberg et Novikov (2003) ainsi qu'à Wetzler, Heule et Hunt (2014). Les travaux antérieurs d'Open Interface Engineering ([Portes de validation mesurées](/papers/gates/), [Satiété de la tâche contre effet rebond agrégé](/papers/satiation/), [Le Reality Code Engine](/papers/rce/) et [Compilation descendante vers LUT6](/papers/lut-adapt/)) sont des travaux compagnons `[same house]` cités pour le contexte architectural, jamais comme confirmation indépendante.

Un audit de l'état de l'art portant sur 69 sources et une revue d'équipe rouge à 36 constats (`docs/DOSSIER.md`) ont mis en évidence une lacune précise dans la littérature d'évaluation des agents de 2024-2026 : les bancs d'essai d'agents existants omettent dans leur immense majorité tout témoin non neuronal, les références non neuronales existantes sont dépourvues de gels pré-enregistrés de mémoires sur ensembles réservés, et les études énergétiques existantes sur les agents à modèles de langage n'incluent aucun bras témoin sans appel de modèle sur le même hôte.

<figure class="my-8">
  <img src="/figures/deterministic-null/dnull-control-protocol.svg" alt="Verrouillage pré-balise en quatre étapes du Nul déterministe et protocole d'évaluation appariée." />
  <figcaption>Figure 1. Pré-enregistrement avant balise (<code>Gate G1</code> + OpenTimestamps + <code>drand</code>) et protocole d'évaluation appariée entre <code>Shape D</code> (<code>N0</code>, <code>N1</code>) et les substrats neuronaux (<code>B3</code>, <code>B6</code>, <code>Shape H</code>). Schéma de protocole, et non lecture matérielle sur rail.</figcaption>
</figure>

---

<div id="2-machine-specification-arms-and-five-language-conformance" class="anchor-alias" aria-hidden="true"></div>

## 2. Spécification de la machine, bras expérimentaux et conformité en cinq langages

<div id="21-the-eight-step-integer-loop-and-complexity-caps" class="anchor-alias" aria-hidden="true"></div>

### 2.1 La boucle entière en huit étapes et les plafonds de complexité

Chaque bras nul `Shape D` exécute une boucle en entiers signés 64 bits à huit étapes (mise à l'échelle en virgule fixe `Q = 1,000,000`, zéro instruction à virgule flottante IEEE-754, zéro appel neuronal au moment de la décision) :

$$\texttt{OBSERVE} \;\to\; \texttt{REDUCE} \;\to\; \texttt{FUZZ} \;\to\; \texttt{LOOKUP} \;\to\; \texttt{ACT} \;\to\; \texttt{VERIFY} \;\to\; \texttt{MUTATE} \;\to\; \texttt{WRITE}.$$

Durant la construction sur `dev`, `WRITE` ajoute les enregistrements vérifiés (`src` étiqueté `lit:`, `human:`, `mut:` ou `llm:`) à un journal `JSONL` canonique et compile une table de hachage binaire à adressage ouvert projetée sans copie par `POSIX mmap` (`DNULLMM1` : en-tête de 64 octets plus emplacements de 48 octets). Avant l'évaluation sur `test`, la mémoire de cas est figée en lecture seule par empreinte `SHA-256` ; `VERIFY`, `MUTATE` et `WRITE` n'exécutent aucune mise à jour au moment du test, et l'identité octet par octet des empreintes avant et après évaluation est vérifiée par assertion. Afin d'empêcher l'introduction subreptice d'un solveur général dans le code spécifique à une classe (`TH2`), la table de fonctions de chaque classe (`REDUCE` + `ACT`) est plafonnée à `<= 4,096` octets compressés par gzip et à `<= 50,000` opérations primitives par appel (`S-3`), et aucun réducteur appris en langage naturel n'est autorisé (`S-4`).

<div id="22-operational-permutations-under-comparison" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Permutations opérationnelles comparées

| Bras | Définition | Appels LLM à la décision | Provenance de construction |
| :--- | :--- | :--- | :--- |
| **`B0` (Plancher)** | Émet inconditionnellement l'action par défaut de la classe ; applique la porte de sensibilité du dosage en test $> 2\delta$ (`10.0` points de pourcentage). | `0` | Aucune |
| **`B1` (Classique)** | Solveur déductif autonome sans mémoire de cas (`CDCL+DRAT`, Houdini sur noyau de traces, Buchberger-Gröbner rationnel). | `0` | Algorithme classique |
| **`B2` (Amorçage seul)** | Mémoire amorcée par la littérature avec mutation `dev` désactivée. | `0` | `lit:` uniquement |
| **`N0` (Nul strict)** | Boucle entière fixe remplie sur `dev` sans aucun enregistrement, correctif ni code par classe issu d'un modèle (`0` entrée de provenance `llm:`). | `0` | `lit:`, `human:`, `mut:` |
| **`N1` (Nul primaire)** | Boucle entière fixe remplie sur `dev` admettant des entrées vérifiées de toute provenance, tous les appels de modèle sur `dev` étant imputés à $C_{N1}$. | `0` | Toute entrée vérifiée (`C_N1` imputé) |
| **`B5` (`code-once`)** | Un LLM de pointe rédige une unique politique Python déterministe à partir des spécifications `dev` ; figée avant l'existence de `test_seed`. | `0` | `1` appel LLM `dev` / classe |
| **`B3` (Nuage de pointe)** | Évaluation par instance d'un modèle en nuage (`Claude Opus 5.5` principal, `Claude Sonnet 5.5` secondaire, sonde `Gemini 2.5 Flash`). | `>= 1` / instance | API en nuage pré-entraînée |
| **`B6` (Local à poids ouverts)** | Inférence locale sur le même hôte (`Alibaba Qwen 3.6 35B-A3B` et `Google Gemma 4 E4B-it` via `llama-server` sur GPU Metal d'Apple M5 Max). | `>= 1` / instance | `reported_j` local |
| **`Shape H` (Boîte de harnais)** | CLI externe `Claude Code 2.1.330` dans `/work` avec `--strict-mcp-config` routé à 100% via `satb-proxy`. | Multi-tours | Teste le plancher `Lane B` (Réfutateur 8) |

<div id="23-gate-g2-five-language-conformance-and-positive-controls" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Conformité en cinq langages Gate G2 et témoins positifs

Des vecteurs de référence indépendants générés via `/usr/bin/bc` et `openssl` vérifient une concordance exacte au bit près entre cinq langages (`Gate G2`), aux côtés de trois témoins positifs isolés (`ctl.setpoint` : `B0 = 0.110 -> N0 = 1.000` ; `ctl.mamdani` : `B0 = 0.525 -> N0 = 1.000` ; `ctl.cartpole` : `B0 = 0.000 -> N0 = 0.805`, exclus de tout énoncé portant sur les agents) :

| Implémentation | Empreinte `SHA-256` de la mémoire figée | Montage `DNULLMM1` à `1M` d'entrées | Latence moyenne de sonde | Somme de contrôle sur `10k` sondes |
| :--- | :--- | ---: | ---: | ---: |
| **Rust** (Référence + `SATB`) | `0da4df8d9ccbce1e...4485781` | `44.67 µs` | `582.57 ns` | `15027705736` |
| **C++20** (`clang++ -O3`) | `0da4df8d9ccbce1e...4485781` | `41.58 µs` | `388.43 ns` | `15027705736` |
| **Go `1.25`** | `0da4df8d9ccbce1e...4485781` | `60.63 µs` | `417.05 ns` | `15027705736` |
| **Julia `1.12`** | `0da4df8d9ccbce1e...4485781` | `125.92 µs` | `350.07 ns` | `15027705736` |
| **Python `3.13`** (`mmap`) | `0da4df8d9ccbce1e...4485781` | `8,655.58 µs` | `633.87 ns` | `15027705736` |

---

<div id="3-confirmatory-experiment-1-exp-001-track-a-bounded-template-stratum" class="anchor-alias" aria-hidden="true"></div>

## 3. Expérience confirmatoire 1 (`exp-001`, strate de patrons bornés Track-A)

<div id="31-pre-beacon-registration-reg-exp-001" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Pré-enregistrement avant balise (`reg-exp-001`)

Cinq classes (`m = 5` : `formal.bv_superopt`, `formal.hoare_inv`, `formal.poly_ideal`, `formal.open_drat_synth` et `tool.tau2_sqlite`) ont été remplies sur $J = 5$ permutations d'épisodes `dev` (`966.2 J` `L2` `reported_j` sur l'ensemble des tentatives de remplissage formel ; coût `dev` `Opus 5.5` de `$0.00955` imputé à `N1` sur `tool.tau2_sqlite`). Les tailles d'échantillon (`n = [420, 250, 250, 250, 250] = 1,420` par palier ; `2,840` au total) ont été dimensionnées à une puissance de `90%` pour des intervalles appariés `BCa` à `10,000` rééchantillonnages ajustés pour la multiplicité à `99.0%` ($1 - 0.05/5$). Le manifeste `cffb564cd9ad...` et la preuve OpenTimestamps `suite/manifest.json.ots` (`172 B`) ont été validés sous `git tag reg-exp-001` (`e5007a4`) au tour `drand` `6663731`, strictement avant le tour cible `6663734` (`test_seed_u64 = 5861262844585529273`). La totalité des `750/750` trajectoires échantillonnées ont franchi avec succès les audits indépendants de vérificateurs `DRAT` et `SQLite SAVEPOINT` (`0` faille exploitée).

<div id="32-track-a-confirmatory-results-2840-instances" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Résultats confirmatoires Track-A (`2,840` instances)

| Palier et classe de tâche | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Qwen36}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | CI BCa `99.0%` | `Qwen` `reported_j`/succès | Verdict ($\delta = +0.05$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | ---: | :--- |
| **Palier 1** `formal.bv_superopt` | `420` | `0.000` | `1.000` | `1.000` | `0.998` | `0.836` | `-0.24 pts` | `[-1.43, +0.00]` | `14.17 J` | **Pertinence exclue** |
| **Palier 1** `formal.hoare_inv` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.508` | `+0.00 pts` | `[+0.00, +0.00]` | `23.32 J` | **Pertinence exclue** |
| **Palier 1** `formal.poly_ideal` | `250` | `0.348` | `1.000` | `1.000` | `0.996` | `1.000` | `-0.40 pts` | `[-2.80, +0.00]` | `7.26 J` | **Pertinence exclue** |
| **Palier 1** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.352` | `+0.00 pts` | `[+0.00, +0.00]` | `69.00 J` | **Pertinence exclue** |
| **Palier 1** `tool.tau2_sqlite` | `250` | `0.188` | `0.624` | `1.000` | `1.000` | `0.940` | `+0.00 pts` | `[+0.00, +0.00]` | `7.11 J` | **Pertinence exclue** |
| **Palier 2** `formal.bv_superopt` (`16b`) | `420` | `0.000` | `1.000` | `1.000` | `0.983` | `1.000` | `-1.67 pts` | `[-3.81, -0.48]` | `7.87 J` | **Pertinence exclue** |
| **Palier 2** `formal.hoare_inv` (`6b`) | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.600` | `+0.00 pts` | `[+0.00, +0.00]` | `16.41 J` | **Pertinence exclue** |
| **Palier 2** `formal.poly_ideal` ($k\in[7,15]$) | `250` | `0.376` | `1.000` | `1.000` | `1.000` | `1.000` | `+0.00 pts` | `[+0.00, +0.00]` | `6.74 J` | **Pertinence exclue** |
| **Palier 2** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.376` | `+0.00 pts` | `[+0.00, +0.00]` | `53.59 J` | **Pertinence exclue** |
| **Palier 2** `tool.tau2_sqlite` (paraphrase) | `250` | `0.224` | `0.516` | `0.636` | `1.000` | `0.916` | **`+36.40 pts`** | **`[+28.80, +44.80]`** | `7.15 J` | **Pertinence démontrée** (`12` non remplis) |

**Audit de portée de Track-A.** Si `exp-001` a nettement séparé la vérification formelle canonisée (`9/9` cellules exclues, économisant `$27.25` de dépenses d'API ou `31,619.9 J` de `reported_j` locaux) des paraphrases de surface inédites (`+36.40` points sur `tool.tau2_sqlite` au Palier 2, au coût de `23.38 J` par succès supplémentaire sur `Qwen 3.6`), un audit post-exécution a identifié une limitation structurelle majeure : les générateurs de Track-A puisaient dans des familles de patrons modulo `6` à modulo `12` ($K_{\text{eff}} = 6\text{-}12$), ce qui permettait à un budget `dev` de `120` épisodes de saturer intégralement les cellules de caractéristiques.

---

<div id="4-confirmatory-experiment-2-exp-002-track-b-external-public-benchmarks-keffn" class="anchor-alias" aria-hidden="true"></div>

## 4. Expérience confirmatoire 2 (`exp-002`, bancs d'essai publics externes Track-B, $K_{\text{eff}} = n$)

<div id="41-course-corrected-unique-instance-design-and-registration-reg-exp-002" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Protocole corrigé à instances uniques et pré-enregistrement (`reg-exp-002`)

Pour évaluer `Shape D` sans menus de patrons synthétiques, Track-B (`exp-002`) a intégré quatre bancs d'essai publics rédigés en externe (artefacts amont épinglés par `SHA-256`) aux côtés d'instances aléatoires `3-SAT` à la transition de phase structurellement uniques (`12` variables, `50` clauses, rapport clauses/variables de `4.17`), produisant `1,190` instances réservées `test` uniques ($K_{\text{eff}} = n = 1,190$) :

1. **`formal.unique_3sat_drat` (`n = 250`)** : formules `3-CNF` uniques à `12` variables et `50` clauses ; `Shape D` recourt à une propagation polynomiale de littéraux échoués à 1 niveau et à une marche locale de `45` basculements (`3,108 B` de FT compressée par gzip), tandis qu'un solveur `CDCL` autonome à 2 littéraux surveillés avec vérification de preuves `RUP/DRAT` sert de référence classique `B1`.
2. **`external.bfcl_v3_live` (`n = 250` tirées d'un vivier de `1,292`)** : UC Berkeley Gorilla Function-Calling Leaderboard `v3` (schémas multi-outils `live_multiple` soumis par des utilisateurs, entrelacés avec des tâches d'abstention `irrelevance` ; `1,381 B` de FT compressée par gzip).
3. **`external.tau_bench_retail` (`n = 220` tirées d'un vivier de `635`)** : suite Sierra Research `tau-bench` de politiques de commerce de détail et de mutations de base de données relationnelle (`500` utilisateurs, `1,000` commandes, `50` produits ; `1,298 B` de FT compressée par gzip).
4. **`external.bigcodebench_exec` (`n = 220` tirées d'un vivier exécutable vérifié localement de `487`)** : spécifications de programmation Python multi-bibliothèques `BigCodeBench v0.1.3` notées par exécution `unittest` isolée (`286 B` de FT compressée par gzip ; `100%` des tâches du vivier vérifiées hors ligne pour valider les solutions canoniques et rejeter `return None`).
5. **`external.swebench_verified` (`n = 250` tirées d'un vivier de `500`)** : tickets GitHub validés humainement `princeton-nlp/SWE-bench_Verified`, évalués sur la localisation de défauts à `12` choix `(file_path :: symbol)` au sein du dépôt (`718 B` de FT compressée par gzip).

Le manifeste `5fe640f00298...` (`355` appels `dev` à `Opus 5.5` = `$7.1902` imputés à $C_{N1}$) et le reçu OpenTimestamps `suite_exp002/manifest.json.ots` (`207 B`) ont été validés sous `git tag reg-exp-002` (`d6bfae5`) au tour `drand` `6664086`, strictement avant le tour cible `6664089` (`test_seed_u64 = 9069507899917430179`). Un unique amendement mécanique du banc d'essai (`amendment_01_b6_slot_ctx.json`) a porté le contexte total de `llama-server` de `-c 16384` (`4,096` tokens répartis sur `4` emplacements, ce qui renvoyait `HTTP 400` sur les schémas `BFCL`/`tau-bench` de `10k-13.7k` tokens) à `-c 81920` (`20,480` tokens par emplacement), laissant inchangés l'ensemble des mémoires figées, invites, vérificateurs, tailles d'échantillon et le tour `drand` `6664089`. La totalité des `515/515` trajectoires échantillonnées ont franchi la contre-vérification indépendante du notateur (`0` faille exploitée).

<div id="42-track-b-multi-vendor-confirmatory-results-1190-unique-instances" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Résultats confirmatoires multi-fournisseurs Track-B (`1,190` instances uniques)

L'ensemble des `1,190` évaluations `Shape D` (`N0`, `N1`), `B0` et `B1` (`CDCL+DRAT`) se sont achevées en **`0.9213 s`** (`35.72 J` `L2` `reported_j`, `0.36 J` `GPU`, `2.58 J` `L3` `ri_energy_nj`, `6.57 × 10^9` instructions, dérive de repos avant/après `3.09% <= 5.0%`).

| Classe à instances uniques | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Sonnet}}$ | $p_{\text{Qwen36}}$ | $p_{\text{Gemma4}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | CI BCa `99.0%` | Verdict ($\delta = +0.05$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | :--- |
| `formal.unique_3sat_drat` ($p_{B1}=1.000$) | `250` | `0.000` | **`0.696`** | **`0.696`** | `0.052` | `0.008` | `0.000` | `0.000` | **`-64.40 pts`** | `[-72.00, -56.00]` | **Non évaluable** ($p_{\text{LLM}} < 2\delta$) |
| `external.bfcl_v3_live` | `250` | `0.180` | `0.200` | `0.228` | `0.828` | **`0.840`** | `0.804` | `0.720` | **`+60.00 pts`** | `[+51.20, +68.40]` | **Pertinence démontrée** (`28` non remplis) |
| `external.tau_bench_retail` | `220` | `0.005` | `0.396` | `0.259` | **`0.864`** | `0.805` | `0.755` | `0.623` | **`+60.45 pts`** | `[+51.82, +68.64]` | **Pertinence démontrée** (`14` non remplis) |
| `external.bigcodebench_exec` | `220` | `0.000` | `0.000` | `0.000` | **`0.950`** | `0.836` | `0.473` | `0.391` | **`+95.00 pts`** | `[+90.00, +97.73]` | **Pertinence démontrée** (`218` non remplis) |
| `external.swebench_verified` | `250` | `0.096` | **`0.460`** | `0.456` | **`0.984`** | `0.952` | `0.900` | `0.812` | **`+52.80 pts`** | `[+44.40, +60.40]` | **Pertinence démontrée** (`4` non remplis) |

*(Une sonde directe en nuage de 15 appels sur `Google Gemini 2.5 Flash`, dans la limite du plafond gratuit `20 RPD` d'AI Studio, a enregistré `0/3`, `3/3`, `2/3`, `1/3` et `3/3` sur les cinq classes dans le même ordre.)*

Trois constats empiriques ressortent de la Section 4.2 :

1. **Falaise combinatoire déductive (`formal.unique_3sat_drat`)** : lorsque les menus de patrons sont retirés de la satisfiabilité formelle (`K_eff = 250` formules `3-CNF` uniques à la transition de phase), les modèles neuronaux à tour unique échouent presque intégralement (`Opus 5.5` à `5.2%` pour `$13.55`, `Sonnet 5.5` à `0.8%` pour `$8.17`, `Qwen 3.6` à `0.0%` pour `7,588 J`, `Gemma 4` à `0.0%` pour `4,698 J`), alors que la table de cas polynomiale sans appel de modèle résout `69.6%` (`174/250`) et que le solveur classique autonome `CDCL+DRAT` (`B1`) résout **`100.0%` (`250/250`)**. Parce que `Opus 5.5` lui-même n'a pas dépassé `B0` de $2\delta = 10.0$ points de pourcentage (`BCa` à `95%` : `[+2.80, +8.40]` points), la règle de décision pré-enregistrée s'abstient de prononcer la pertinence exclue (`"Relevance excluded"`) et classe strictement la cellule comme non évaluable (**`Not assessable`**).
2. **Niveaux de base sans modèle non triviaux aux côtés de gains neuronaux authentiques** : même avec zéro paramètre neuronal (`N0`), des règles de cas lexicales et de schéma résolvent **`46.0%`** de la localisation de défauts à `12` choix de `SWE-bench Verified` (contre un plancher de `9.6%`) et **`39.6%`** des mutations de politique commerciale de `tau-bench` (contre un plancher de `0.5%`). Sur `tau-bench`, l'extraction gloutonne de bigrammes sur `dev` dans `N1` a en réalité sur-appris des formulations clients bruitées (`25.9%` contre `39.6%` pour `N0`), confirmant l'importance de rapporter le `N0` strict aux côtés de `N1` (`S4`). Néanmoins, sur l'ensemble des quatre bancs d'essai publics, les modèles de pointe et les modèles locaux à poids ouverts produisent des gains amples et statistiquement décisifs (`+46.82` à `+95.00` points de pourcentage au-dessus tant de `N0` que de `N1`).
3. **Coût `reported_j` à double canal du gain local (`B6`)** : sur l'hôte partagé Apple M5 Max (où une synthèse `yosys-abc` concurrente a déclenché le Réfutateur 6 sur `4` fenêtres pluriminutes sur `5`, invalidant proprement `derived_marginal_j` tout en préservant les compteurs bruts `L2` `IOReport` et `L3` `ri_energy_nj` par PID), chaque tâche supplémentaire achevée par `Qwen 3.6 35B-A3B` au-delà de `N1` a coûté **`49.90 J`** (`SWE-bench`), **`70.33 J`** (`BFCL v3`), **`238.80 J`** (`BigCodeBench`) et **`407.12 J`** (`tau-bench` Retail) en `reported_j` bruts de niveau `L2`.

---

<div id="5-goodturing-unseen-mass-multi-turn-work-repair-and-online-crystallization" class="anchor-alias" aria-hidden="true"></div>

## 5. Masse inédite de Good-Turing, réparation multi-tours dans `/work` et cristallisation en ligne

<figure class="my-8">
  <img src="/figures/deterministic-null/s3-good-turing-regimes.svg" alt="Deux régimes séparés par la masse de clés inédites de Good-Turing N1(t)/t et la cristallisation en ligne zipfienne." />
  <figcaption>Figure 2. La masse de clés inédites de Good-Turing <em>N</em><sub>1</sub>(<em>t</em>) / <em>t</em> prédit les régimes où <code>Shape D</code> figé sature par opposition à ceux où la synthèse neuronale ou la cristallisation en ligne est requise (<code>measured_j = None</code>).</figcaption>
</figure>

<div id="51-goodturing-unseen-mass-n1tt-across-the-five-track-b-streams" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Masse inédite de Good-Turing ($N_1(t)/t$) sur les cinq flux Track-B

Le long de chaque flux de tâches `dev + cal` $t = 1 \dots T$, le rapport de singletons de Good-Turing $N_1(t)/t$ estime la probabilité que la prochaine clé entrante soit inédite :

| Classe de tâche (flux `dev + cal`) | Longueur du flux $T$ | Cellule grossière $N_1(T)/T$ | Schéma/instance fin $N_1(T)/T$ | Achèvement réservé `N0` / `N1` |
| :--- | ---: | ---: | ---: | ---: |
| `formal.unique_3sat_drat` | `270` | `0.0000` | `1.0000` | `69.6%` / `69.6%` |
| `external.swebench_verified` | `250` | `0.0080` | `0.5960` | `46.0%` / `45.6%` |
| `external.tau_bench_retail` | `285` | `0.0035` | `0.6386` | `39.6%` / `25.9%` |
| `external.bfcl_v3_live` | `300` | `0.0233` | `0.4033` | `20.0%` / `22.8%` |
| `external.bigcodebench_exec` | `240` | **`0.9917`** | **`0.9917`** | **`0.0%` / `0.0%`** |

Même après que `N1` a cristallisé `108` solutions Python de `Claude Opus 5.5` validées par tests unitaires sur l'ensemble `dev` de `BigCodeBench`, $N_1(T)/T = 0.9917$ prédisait un recouvrement de clés quasi nul sur des spécifications de programmation compositionnelles inédites, en accord exact avec le taux d'achèvement de `0.0%` observé sur l'ensemble réservé `test` (`218` clés non remplies).

<div id="52-multi-turn-work-software-engineering-repair-6-multi-file-repositories" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Réparation logicielle multi-tours dans `/work` (`6` dépôts multi-fichiers)

Pour vérifier que les invites à tour unique de la Section 4 ne pénalisaient ni ne faussaient les harnais de programmation à étapes multiples, six dépôts Python multi-fonctions et multi-fichiers de correction de bogues (`config-defaults` couvrant `loader.py` + `schema.py`, `interval-merge`, `pagination`, `precedence` couvrant `calc.py` + `lexer.py`, `rate-window` couvrant `window.py` + `limiter.py` et `retry-backoff`) ont été évalués dans des bacs à sable `/work` isolés (`max_turns = 10`), en écrasant `test_*.py` à partir de copies amont intactes avant la notation par `pytest -q` :

| Voie du harnais multi-tours `/work` | Dépôts réussis | `SATB` `P/F/R/K` | Appels de modèle | Appels d'outil | `USD` API / `reported_j` local |
| :--- | ---: | :---: | ---: | ---: | :--- |
| **`Shape D` à froid inédit (`t = 1`)** | `0 / 6` (`0.0%`) | `0/6/0/0` | `0` | `0` | `$0.0000` / `< 1 J` |
| **`Lane B` (`Claude Opus 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `28` | `29` | `$0.3613` (`not_available`) |
| **`Lane B` (`Claude Sonnet 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `31` | `34` | `$0.2080` (`not_available`) |
| **`Shape H` (`Claude Code 2.1.330` + `Opus 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `30` | `MCP` | `$0.2646` (`not_available` ; Réfutateur 8 validé) |
| **`Lane B` Local (`Qwen 3.6 35B-A3B`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `42` | `42` | **`2,342.0 J`** `L2` (`390.3 J`/dépôt) |
| **`Shape D` Rejeu en ligne (flux `t = 2`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `0` | `0` | `$0.0000` (rejeu de correctifs vérifiés) |

<div id="53-online-crystallization-on-recurring-zipfian-traffic-bigcodebench" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Cristallisation en ligne sur trafic zipfien récurrent (`BigCodeBench`)

Sur la piste secondaire en ligne (`600` requêtes tirées selon une loi de Zipf d'exposant $0.85$ sur les `220` tâches de test uniques de `BigCodeBench`, où `Shape D` n'invoque `B3`/`B6` qu'en cas de défaut sur une clé inédite et met en cache les solutions qui franchissent `unittest`), l'achèvement de la tâche égale l'usage pur par requête de `Opus 5.5` (**`98.0%` contre `98.0%`**) tandis que `155` fonctions vérifiées se cristallisent dans la mémoire, réduisant le cumul d'appels LLM de **`72.17%` (`167` contre `600`)**, la dépense d'API de **`$7.33` à `$2.04` (`3.59×`)** et la dépense locale `reported_j` de `Qwen 3.6` de **`67,729.6 J` à `18,851.4 J` (`3.59×`)**.

---

<div id="6-limitations-falsifiers-and-unfinished-work" class="anchor-alias" aria-hidden="true"></div>

## 6. Limites, réfutateurs et travaux inachevés

1. **Absence de wattmètre physique sur rail ou prise murale en courant alternatif (`board_metered = false`, `measured_j = None`)** : toutes les valeurs énergétiques de cette étude proviennent des compteurs `reported_j` sur puce Apple Silicon `IOReport` (`L2`) et noyau `ri_energy_nj` (`L3`) relevés sur un hôte exécutant des tâches concurrentes ; les mesures `L0` à la prise murale en courant alternatif (`Shelly`/`Yokogawa`, capturant les pertes du bloc d'alimentation, de la DRAM et du stockage NVMe) sur une machine cible mise au repos restent à réaliser.
2. **Sélection auto-administrée des bancs d'essai face à un Palier 3 externe humain** : bien que Track-B (`exp-002`) ait remplacé les patrons synthétiques par quatre bancs d'essai publics rédigés en externe et verrouillés avant le tour `drand` `6664089`, un banc d'essai scellé de Palier 3 rédigé et conservé sous séquestre par un tiers humain indépendant n'a pas encore été exécuté.
3. **Non-nécessité à budget fini** : chaque verdict de pertinence démontrée (`"Relevance shown"`) s'entend strictement relativement à l'échantillon `dev` déclaré (`100-150` instances) et au plafond de table de fonctions de `4,096 B` ; une clé non remplie atteste d'une couverture non atteinte dans les limites de ce budget, et jamais de l'impossibilité mathématique d'une procédure non neuronale.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Références

<ol data-refs>
<li>Aamodt, A., &amp; Plaza, E. (1994). Case-based reasoning: Foundational issues, methodological variations, and system approaches. <em>AI Communications</em>, 7(1), 39-59.</li>
<li>Efron, B. (1987). Better bootstrap confidence intervals. <em>Journal of the American Statistical Association</em>, 82(397), 171-185.</li>
<li>Goldberg, E., &amp; Novikov, Y. (2003). Verification of proofs of unsatisfiability for CNF formulas. <em>DATE 2003</em>, 886-891.</li>
<li>Good, I. J. (1953). The population frequencies of species and the estimation of population parameters. <em>Biometrika</em>, 40(3-4), 237-264.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., &amp; Narasimhan, K. (2024). SWE-bench: Can language models resolve real-world GitHub issues? <em>ICLR 2024</em>.</li>
<li>Mamdani, E. H., &amp; Assilian, S. (1975). An experiment in linguistic synthesis with a fuzzy logic controller. <em>International Journal of Man-Machine Studies</em>, 7(1), 1-13.</li>
<li>Michie, D., &amp; Chambers, R. A. (1968). BOXES: An experiment in adaptive control. <em>Machine Intelligence</em>, 2, 137-152.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Patil, S. G., Mao, H., Cheng-Jie Ji, C., Yan, F., Suresh, V., Stoica, I., &amp; Gonzalez, J. E. (2024). Gorilla: Large language model connected with massive APIs (Berkeley Function-Calling Leaderboard). <em>NeurIPS 2024</em>.</li>
<li>Simon, H. A., &amp; Kadane, J. B. (1975). Optimal problem-solving search: All-or-none solutions. <em>Artificial Intelligence</em>, 6(3), 235-247.</li>
<li>Stanfill, C., &amp; Waltz, D. (1986). Toward memory-based reasoning. <em>Communications of the ACM</em>, 29(12), 1213-1228.</li>
<li>Wang, L.-X., &amp; Mendel, J. M. (1992). Generating fuzzy rules by learning from examples. <em>IEEE Transactions on Systems, Man, and Cybernetics</em>, 22(6), 1414-1427.</li>
<li>Wetzler, N., Heule, M. J. H., &amp; Hunt, W. A. (2014). DRAT-trim: Efficient checking and trimming using expressive clausal proofs. <em>SAT 2014</em>, 422-429.</li>
<li>Yao, S., Shinn, N., Razavi, P., &amp; Narasimhan, K. (2024). tau-bench: A benchmark for tool-agent-user interaction in real-world domains. <em>arXiv:2406.12045</em>.</li>
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2025). BigCodeBench: Benchmarking code generation with diverse function calls and complex instructions. <em>ICLR 2025</em>.</li>
</ol>
