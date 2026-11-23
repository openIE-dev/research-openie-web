---
title: "Compilation descendante vers LUT6 dans une cascade Mixture of Limits : tissus booléens routés par Beneš, portes d'éveil conformes et diffusion NVMe Sparse-MoE de pointe"
deck: "Une cascade Mixture of Limits dotée de 27 théorèmes Lean 4.36.0 vérifiés par six noyaux (con-leche et con-ron --verified, zéro sorry, durcie contre Common Vulnerabilities and Exposures (CVE)-2026-72844) qui essaie d'abord des circuits paginés de table de correspondance à 6 entrées (LUT6) sans opération en virgule flottante (FLOP) (0.154 milliseconde dans le binaire unique Rust mol-agent-rs), n'escalade vers des modèles hybrides et épars Mixture-of-Experts (MoE) de fin 2026 en 4 bits sur Non-Volatile Memory Express (NVMe) jusqu'à 120B paramètres (12B actifs) qu'en cas d'échec, contrôle les validations via des vérificateurs déterministes sur 4 dépôts amont Verified d'ingénierie logicielle, et compile les éveils certifiés de manière descendante vers des Block RAM de 36 Kbit (RAMB36E2) routées par Beneš avec activation d'horloge contrôlée et vers des pages de compétences canoniques. Les temps d'horloge murale, les comptages d'octets Darwin F_NOCACHE non mis en mémoire tampon (lecture de fichier sans tampon), la mémoire vive active (RAM abaissée à 970.0 mégaoctets sur 34.66B et 58.08 gigaoctets de mémoire unifiée résidente à 22.17 tokens par seconde sur 120B-A12B), les compteurs d'énergie sur puce à double canal Apple M5 Max (reported_j), les estimations énergétiques analytiques (est_j) et les simulations register-transfer-level (RTL) Yosys/Verilator sur xck26 (cœur pipeliné à 4 étages et 13 niveaux à 250 mégahertz avec réduction de 4.10x de la puissance au repos par gating d'horloge) sont rapportés depuis openIE-dev/lut-adapt-ai au commit 86d0ab5 ; aucune puissance isolée sur rail de carte n'a été mesurée (measured_j non renseigné)."
lang: "fr"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*Révision ff18890, 23 novembre 2026. Implémentation de référence et artefacts : [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) à [`86d0ab5299c03a537639762ea2f430d7da358f26`](https://github.com/openIE-dev/lut-adapt-ai/tree/86d0ab5299c03a537639762ea2f430d7da358f26). Résumé des données : [/data/#lut-adapt](/data/#lut-adapt). PDF LaTeX : [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([source](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Vue d'ensemble

Cette étude examine comment un système informatique peut compiler, de manière descendante, un travail répété de modèle neuronal vers des recherches booléennes rapides dans des tables et vers des compétences canoniques certifiées, sans perdre la parité exacte des sorties ni promouvoir des suppositions non vérifiées au rang de règles de confiance. Elle rapporte des mesures logicielles et d'entrées/sorties sans tampon, des synthèses au niveau transfert de registres et des simulations de cycles, des relevés de compteurs d'énergie à double canal (système d'exploitation / énergie sur puce) (`reported_j` sur Apple M5 Max et compteurs Linux Running Average Power Limit), ainsi que des estimations analytiques d'énergie étiquetées (`est_j`). Aucun wattmètre secteur ou de rail n'était connecté dans ce dépôt (`measured_j` n'est pas renseigné ; `board_metered` vaut faux).

**En termes simples**

1. La plupart des entrées qu'un système déployé observe répètent des motifs qu'il a déjà résolus, de sorte qu'exécuter un réseau neuronal complet en virgule flottante à chaque étape gaspille calcul et bande passante mémoire.
2. La référence place un étage de consultation de table de vérité à 6 entrées reconfigurable (`LUT6`) en amont des modèles d'espace d'états en flux et des modèles de fondation, et compile les réponses vers le bas dans des pages de mémoire de consultation seulement après qu'une vérification explicite les ait certifiées.
3. Lorsque des modèles de langage hybrides et à mélange parcimonieux d'experts de fin 2026 jusqu'à `120B` paramètres (`12B` actifs) s'exécutent localement sur Apple Silicon via des shaders Apple Metal fusionnés sur mesure, des shaders portables Rust `Burn 0.22.1 / CubeCL` et le binaire unique Rust `mol-agent-rs` (`0.154` milliseconde par consultation de compétence), les lectures d'experts parcimonieuses pilotées par le routeur associées à ce proposant `LUT6` à zéro FLOP réduisent les lectures disque jusqu'à `12.30×` sur `Qwen/Qwen3.6-35B-A3B` (`970.0` mégaoctets de mémoire de poids active) et maintiennent `22.17` tokens par seconde sur `nvidia/Nemotron-3-Super-120B-A12B` dans `58.08` gigaoctets de mémoire unifiée ; placer les validations de code et de dépôts derrière des vérifications déterministes `unittest` et `pytest` atteint **`91.67%` de taux de réussite vérifié (`93.75%` sur la Vague 2 et la Vague 3)** sur le banc d'essai algorithmique à `48` tâches, **`90.62%` (`93.75%` sur les paraphrases humaines de la Vague 2)** sur le benchmark officiel `BigCodeBench v0.1.3`, **`50.00%`** sur les arbres de travail git mono-dépôt `SymPy`, **`20.83%` (`2.50×` les modèles autonomes `24B` et `35B`)** sur `4` dépôts amont Verified de `princeton-nlp` (`django`, `pytest`, `requests` et `sympy`), et **`62.50%`** sur la suite frontière difficile `120B` avec **`0.00%` de validations défectueuses admises**.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termes, acronymes et étiquettes de mesure

<ul id="terms">
<li>MoL : Mixture of Limits, la règle en cascade provenant de Metered Commit Gates Part II [same house]</li>
<li>LA : préfixe de revendication et de falsification (LA-1 à LA-23, LA-F1 à LA-F23) utilisé dans cette étude</li>
<li>LUT, LUT6, INIT : table de correspondance, primitive booléenne Xilinx UltraScale+ à 6 entrées, et son masque d'initialisation de table de vérité 64 bits</li>
<li>BRAM, RAMB36E2, URAM : RAM de bloc, primitive UltraScale+ à double port de 36 Kbit (144 sur xck26), et UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260 : bloc logique configurable, bascule, tranche de traitement du signal numérique, et carte AMD Kria KV260 (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL : field-programmable gate array, application-specific integrated circuit, register-transfer level, cycles per lookup, place-and-route, worst negative slack, et Field-Programmable Logic conference</li>
<li>AXI, AXIS, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU, SMC, L2, L3 : Interface eXtensible Avancée, préfixe d'enveloppe AXI4-Stream, système de traitement Zynq, logique programmable, système sur module, circuit intégré de surveillance d'alimentation embarqué, rail d'alimentation, Intel Running Average Power Limit, NVIDIA Management Library, unité de gestion d'alimentation macOS, contrôleur de gestion système Apple, compteur d'énergie de sous-système de niveau 2 (Apple IOReport GPU Energy), et compteur d'énergie CPU par processus de niveau 3 (Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj)</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG : State Space Duality, state-space model, multiple-input multiple-output, rotary position embedding, gated linear unit activation, grouped-query attention, key-value cache, byte-pair encoding, large language model(s), Mixture-of-Experts, multilayer perceptron, et context-free grammar</li>
<li>HC, SOINN, WNN, DWN : hierarchy-context Self-Organizing Incremental Neural Network, weightless neural network, et Differentiable Weightless Neural Network</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC : Joint-Embedding Predictive Architecture, Energy-Based Reasoning Model, Adaptive Conformal Inference, out-of-distribution, area under the receiver operating characteristic, maximum softmax probability, et Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF : Prompt Lookup Decoding, Retrieval-Based Speculative Decoding, Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LFM2.5-350M et LFM2.5-8B-A1B), Liquid Foundation Model 3 (oct. 2026 LiquidAI/LFM3-1.7B), et HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR : singular value decomposition, Iterative Quantization Procrustes hypercube rotation, sign-value-independent decomposition, quantization-aware training, post-training quantization, perplexity, et signal-to-noise ratio</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, RSS, GGUF, IO, KB, MB, GB, GiB : stockage Non-Volatile Memory Express, indicateur de fichier sans tampon Darwin F_NOCACHE, Portable Operating System Interface, mémoire à accès aléatoire, RAM dynamique, RAM statique, taille d'ensemble résident en mémoire unifiée physique, fichier de modèle quantifié GPT-Generated Unified Format, entrée/sortie, kilooctet, mégaoctet, gigaoctet et gibioctet</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, BF16, FP16, FP32, INT4, ULP, MSL, MPS, CUDA, ROC, SPIR, PTX, HIP, LLVM : opération(s) en virgule flottante, millions de FLOP, opération(s) de multiplication-accumulation, instruction unique sur données multiples, différentiation automatique, différence finie, bits par octet, brain float 16, virgule flottante IEEE 16/32 bits, entier sur 4 bits, unité du dernier rang, Apple Metal Shading Language, PyTorch Metal Performance Shaders, NVIDIA Compute Unified Device Architecture, exécutif AMD ROCm, Standard Portable Intermediate Representation (Vulkan SPIR-V), Parallel Thread Execution, Heterogeneous-Compute Interface for Portability, et dorsal de compilation Low Level Virtual Machine</li>
<li>RCE, WCA, VC, BCB, SWE, OSA, DP : Reality Code Engine [same house], Wise Computer Automation [same house], achèvement vérifié, banc d'essai BigCodeBench v0.1.3, préfixe de banc d'essai en génie logiciel, alignement optimal de chaînes, et programmation dynamique</li>
<li>CLI, HTTP, GET, POST, SSE, API, MCP, RPC, IDE, SDK, CORS, URL, ORM, IDNA, CADE, LNCS, NVIDIA, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW, TDP : interface en ligne de commande, protocole de transfert hypertexte et ses méthodes de requête GET/POST, événements envoyés par le serveur, interface de programmation d'application, Model Context Protocol, appel de procédure à distance (JSON-RPC 2.0), environnement de développement intégré, kit de développement logiciel, partage des ressources entre origines multiples, localisateur uniforme de ressource (Uniform Resource Locator), mappeur objet-relationnel, noms de domaine internationalisés dans les applications, Conference on Automated Deduction, Lecture Notes in Computer Science, NVIDIA Corporation, conférences académiques en informatique et ingénierie, système d'exploitation, processeur central/processeur graphique, logiciel et puissance thermique de conception</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XOR, XNOR, JWT, HMAC, DAG, CIDR, LRU, TTL, WAL, ETL : réseau local virtuel (IEEE 802.1Q), sécurité de la couche transport, inspection approfondie des paquets, arbre syntaxique abstrait, JavaScript Object Notation, valeurs séparées par des virgules, algorithme de hachage sécurisé, contrôle de redondance cyclique, mode de transfert asynchrone (CRC-8/ATM), demande de commentaires (Request for Comments), langage de requête structuré, encodage DWARF en base 128 signé little-endian, mémoire adressable par contenu, OU exclusif, NON-OU exclusif, jeton web JSON, code d'authentification de message à base de hachage, graphe orienté acyclique, routage interdomaine sans classes, cache à éviction du moins récemment utilisé, expiration par durée de vie, journal d'écriture anticipée et chaîne d'extraction, transformation et chargement</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, CARRY8, DSP48E2, URAM288, VCCINT, DS925, VCD, SDP, CE, ENARDEN, XPE, CLAI, AMD : groupe d'action de test conjoint, débogueur de l'outil en ligne de commande Xilinx (XSDB), port d'accès de débogage, bus série universel, Future Technology Devices International et son circuit intégré pont FT2232C double UART/FIFO, récepteur-émetteur asynchrone universel, tampon premier entré premier sorti, circuit intégré, automatisation de la conception électronique, mode de synthèse hors contexte, architecture de bus microcontrôleur avancée, interconnexion AXI4-Lite/AXI4-Stream, bloc d'entrée-sortie, tampons d'entrée-sortie, bascules D à réinitialisation ou mise à un synchrones, tables de correspondance UltraScale+ à 1-5 entrées, multiplexeurs UltraScale+ à 7/8 entrées, chaînes de retenue rapides 4/8 bits, tranche DSP UltraScale+, UltraRAM de 288 Kbits, rail d'alimentation interne du cœur (0,72 V sur -2LV), fiche technique des caractéristiques de commutation DC et AC du Zynq UltraScale+ d'AMD DS925, trace d'onde Value Change Dump, mode Block RAM à double port simple, activation d'horloge synchrone, broche de lecture/activation d'horloge du port A de RAMB36E2, estimateur de puissance Xilinx, identifiant magique des registres du sous-système (« CLAI »), et Advanced Micro Devices</li>
<li>CVE, CWE, FRO, GMP, RAG, WHNF, ZFC, CIC, FFI : vulnérabilités et expositions communes (Common Vulnerabilities and Exposures), énumération des faiblesses communes (Common Weakness Enumeration), Lean Focused Research Organization, bibliothèque arithmétique multiprécision GNU (GNU Multiple Precision Arithmetic Library), génération augmentée par récupération, forme normale de tête faible, théorie des ensembles de Zermelo-Fraenkel avec l'axiome du choix, calcul des constructions inductives, et interface de fonctions étrangères</li>
</ul>

Quatre classes de preuve restent séparées dans chaque tableau ci-dessous :

| Étiquette de preuve | Signification dans cette étude |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Comptages exacts d’octets lus ou écrits via `os.pread` sous Darwin `F_NOCACHE`, allocations mémoire résidentes, secondes d’horloge murale, énergie cumulative du `PMU` macOS complet (`AppleSmartBattery.PowerTelemetryData`) sur Apple M5 Max, et accord exact de bits/jetons. `measured_j` n’est pas défini (`None`). |
| **`Reported (OS / On-Chip Counter, reported_j)`** | Compteurs de télémétrie non privilégiés du système d’exploitation et sur puce : sur Apple M5 Max (`joule_meter.py`), double canal `libIOReport.dylib` « Energy Model » `'GPU Energy'` (`L2` résolution nanoseconde `nJ`) plus `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3` CPU par processus `nJ`) ; sur Linux `x86-64` (dans l’audit de synthèse EDA `xck26` ci-dessous), joules `RAPL` `package-0`. Jamais fusionné avec `measured_j` (`None`). |
| **`Simulated (RTL)`** | Comptages de netlist structurels issus de Yosys `0.71+` (`synth_xilinx -family xcup` ciblant Kria KV260 `xck26`) et comptages de cycles (`CPI = 1`) provenant de Verilator `5.054`. Pas de clôture de timing Vivado et pas d’alimentation de carte (`board_metered = false`). |
| **`Estimated (est_j)`** | Joules analytiques calculés à partir des comptages d’opérations, des substituts temporels de puissance de conception thermique (`joule_meter.py`), ou de l’activité de commutation du taux de bascule VCD Verilator associée aux limites de capacité logique AMD `DS925` `xck26-2LV` (`0.72 V`) et `RAMB36E2` (§4.22, §4.25). Comparable uniquement entre les bras à l’intérieur de la même formule ; jamais des watts silicium. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Contexte architectural et contributions

Dans [Portes d'engagement mesurées](/papers/gates/) `[same house]`, la Partie II définit **Mixture of Limits** : essayez les engrenages par ordre décroissant de probabilité de passage par joule $p_i / c_i$ (Simon et Kadane, 1975), arrêtez-vous dès que le prédicat d'achèvement de tâche $C(z) = 1$ devient vrai, et interdisez le renforcement de la sortie `ModelGenerated` en `Deterministic`. Un niveau de recherche statique, toutefois, ne couvre que les entrées écrites avant le déploiement. Inversement, les réseaux neuronaux à tables de recherche existants, LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022), et Differentiable Weightless Neural Networks (Bacellar et al., 2024), figent la connectivité des fils dans le routage FPGA statique, nécessitant un placement-et-routage du fournisseur à chaque déplacement de la distribution d’entrée.

La référence `lut-adapt-ai` ferme la boucle entre le sommet et la base de la cascade via **compilation en ligne descendante `LUT6`** :

- **Échelon 0 (Recherche, Beneš paginé + `LUT6`)** : Évalue des masques de table de vérité 64 bits acheminés via un commutateur multicast **Beneš-Copy-Beneš** non bloquant $512 \times 512$ et mis en cache sur $81 \times \texttt{RAMB36E2}$ mémoires blocs double-port (`0` opérations en virgule flottante, commutation de page en un cycle dans la simulation Verilator).  
- **Échelon 1 (Flux, dualité d’espace d’états MIMO complexe `Mamba-3`)** : Gère les manques dépendant de l’historique de séquence à l’aide d’un état récurrent de taille constante $O(1)$ (`48 KB` mémoire épinglée dans la référence à `14.3M` paramètres), évitant la croissance $O(L)$ du cache clé-valeur.  
- **Échelon 2 (Topologie, `HC-SOINN`)** : Maintient la topologie prototype en ligne sur des embeddings latents, isolant les frontières de régime et déclenchant un disjoncteur (`Refuse` / escalade) lorsqu’un décalage de distribution non étiqueté survient.  
- **Échelon 3 (Modèle final, `JEPA-EBRM`, `AirMoL` et `Expert-AirMoL` Metal-Fusionné diffusion NVMe 4-bits)** : Invoque la vérification énergétique latente ou diffuse des modèles de fondation hybrides et Sparse-MoE pré-entraînés fin 2026 (`LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it`, `LiquidAI/LFM2.5-8B-A1B`, et `Qwen/Qwen3.6-35B-A3B`, ainsi que `LiquidAI/LFM2.5-350M` et `Qwen/Qwen3.5-0.8B-Base`) via des shaders de calcul Apple Metal `MSL` personnalisés uniquement lorsque les échelons inférieurs sont insuffisants ou requièrent une vérification exacte de la cible.  
- **`SleepCrystallizer` descendant** : Extrait les traces d’éveil récurrentes à l’aide d’amorçages spectraux Walsh-Hadamard, de tables de vérité minterm en mode joint, de compétences AST canoniques et de plannings de commutateur Waksman, en inversant les banques de mémoire bloc d’ombre sans interrompre l’inférence ni exécuter le placement-et-routage FPGA.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Contributions

1. **Condition de compilation descendante amortie** : Étend l'ordonnancement $p_i/c_i$ de Simon-Kadane par un coût explicite de compilation $E_{\text{compile}}$ sur un horizon stationnaire $\Delta T$.
2. **Sous-système RTL Beneš-Copy-Beneš $512 \times 512$ non bloquant, cache de pages `81`-`RAMB36E2` et `P4-AXIS` pipeliné sur `4` étages à `250 MHz`** : Élimine à la fois le débordement logique de `102.0%` des matrices d'interconnexion plates sur Kria KV260 (`119,478` LUT) et l'explosion à `926,619` LUT des multiplexeurs de pages à bascules (`41,186` LUT CLB UltraScale+ = `35.2%` de `xck26`, `81` blocs `RAMB36E2` = `56.2%`, `0` tranche `DSP48` en OOC à `1` cycle), tandis qu'une enveloppe `AXI4-Stream` pipelinée à `4` étages respectant les `IOB` (`clai_benes_axi_stream_250mhz_top`) réduit de **`4.00×`** la profondeur logique synchrone par cycle, de `52` à **`13` niveaux**, tient dans **`170 <= 189` `IOB` de `xck26`** (`41,459` LUT = `35.40%`), et valide **`256 / 256` battements sans bulle (`CPI = 1.00`)** de parité de flux sous Verilator.
3. **Synthèse universelle de mintermes en mode joint pour $\le 64$ bits** : Montre que la recherche de mintermes en mode joint domine l'arrondi DiffLogic marginal par plan de bits sur les branches corrélées et compacte $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ jetons de sous-mots dans un mot `uint64` (`16b × 4 = 64b` pour `|V| = 65 536` ; `17b × 3 = 51b` pour `|V| = 128 000` ; `18b × 3 = 54b` pour `|V| = 248 320`).
4. **Porte de cristallisation Split-Conformal + ACI en ligne sans oracle** : Associe un score de non-conformité latent `JEPA-EBRM` régularisé radialement à une calibration Split Conformal et à l'Adaptive Conformal Inference (Gibbs et Candès, 2021), enregistrant un risque de fausse cristallisation de `0,00 %` et un AUROC OOD de `1,0000` sur du trafic décalé où les lignes de base softmax et MC-Dropout enregistrent un risque faux de `17,62 %-24,28 %`.
5. **Shaders sur mesure Apple Metal et Rust multiplateforme `CubeCL` `INT4` Sparse-MoE / `GatedDeltaNet` + `AirMoL` / `Expert-AirMoL` jusqu'à `34.66B`** : Combine le partitionnement 4 bits Darwin `F_NOCACHE` `os.pread`, des shaders de calcul sur mesure `MSL` (`43.45×` MoE, `20.66×` `GatedDeltaNet`) et portables Rust `Burn 0.22.1 / CubeCL` (`35.09×` Metal / `2.67×` `LLVM` `CPU` MoE, `69.20×` Metal / `14.87×` `LLVM` `CPU` `GatedDeltaNet`), des lectures `pread` parallèles de profondeur de file `8`, et la spéculation en rafale `BenesLUT6` sur les modèles d'octobre 2026 `LiquidAI/LFM3-1.7B` (`2.74×` de réduction NVMe dans `3.79%` de la RAM FP32), `LiquidAI/LFM2.5-8B-A1B` (`500.0 MB` de RAM, `3.493 J/tok` `reported_j`) et `Qwen/Qwen3.6-35B-A3B` (`34.66B` ; **`12.30×` de réduction NVMe**, **`970.0 MB` de RAM = `1.47%` de FP16**, **`6.773 J/tok` `reported_j`**, **`15.7 tok/s`** en `Q4` mémoire unifiée) avec `100.0%` de parité exacte des tokens.
6. **`Sub1Bit-LUT6` sans MAC face à `LittleBit`, plafond `91.67%` de l'`Échelon 3d` `<think>`, `BigCodeBench v0.1.3` officiel + `SWE-bench Verified` amont via `MCP`, et `mol-agent` OpenAI / `MCP`** : Remplace les `1.98M` MAC binaires à l'exécution de `LittleBit-1 / LittleBit-2` (`0.576` bit par poids ; Lee et al., 2025 ; Lee et Kim, 2026) par une consultation de sommes partielles `LUT6` à `6` entrées sans MAC (`< 4 × 10⁻⁶` d'erreur, `100.0%` de parité sous vérification cible `MoL` en `0` époque QAT), porte le banc d'essai de codage de fin 2026 à `48` tâches de `87.50%` à **`91.67%` (`44 / 48` ; `93.75%` en Vague 2 et Vague 3)** grâce à l'`Échelon 3d` `<think>` borné à poids ouverts, atteint **`90.62%` (`29 / 32`, `93.75%` en Vague 2)** sur le benchmark officiel `BigCodeBench v0.1.3` (contre `78.12%` sur `35B` autonome) et **`50.00%` (`8 / 16`)** sur les arbres de travail git amont `SWE-bench Verified` `sympy/sympy` (contre `25.00%` sur `35B`) avec **`0.00%` de validations défectueuses admises**, et sert les compétences persistantes `.mol/` via OpenAI `/v1/chat/completions` et `MCP` (`JSON-RPC 2.0`).
7. **Formalisation Lean `4.36.0` paranoïaque à six noyaux (durcie contre `CVE-2026-72844`), localisation par graphe d'appels `SWE-bench Verified` sur `4` dépôts, sommet MoE hybride `120B` mesuré, puissance `VCD` à gating `CE`, et binaire unique Rust `mol-agent-rs` (`Affirmations LA-19` à `LA-23`)** : Vérifie les `27` théorèmes de la Section 2 à travers **six vérificateurs de preuves indépendants** (`con-leche --verified` [`58,683` décl.], `con-ron --verified` [`58,683` décl.], `lean4lean` [`58,685` décl.], `nanoda`, `leanchecker --paranoid` et Lean `4.36.0` ; `0` `sorry`, `0` axiome personnalisé, `0` `Lean.ofReduceBool` ; Moura et Ullrich, 2021), étend l'évaluation sans fuite de `SWE-bench Verified` à **`4` dépôts amont (`django`, `pytest`, `requests`, `sympy`, `24` évaluations)** à **`20.83%` au global / `25.00%` en Vague 2 (`2.50×` les modèles autonomes `24B` et `35B`)** avec `0.00%` de correctifs défectueux, mesure le modèle de classe **`120B` `nvidia/Nemotron-3-Super-120B-A12B`** (`58,075.4 MB` de `RSS`, **`22.17 tok/s`**, **`62.50%` de réussite vérifiée** contre `43.75%` sur `120B-A12B` autonome et `31.25%` sur `Devstral-Small-2-24B`), réduit de **`4.10×`** la puissance dynamique au repos de `P4-AXIS` à `250 MHz` (`63.99` à **`15.59 est_mW`**) via le gating de `ENARDEN` et des bulles de validité `CE`, et livre le serveur Rust à binaire unique sans Python `mol-agent-rs` (`0.1540 ms/req` `MCP`, **`17.21×` plus rapide** que `mol-agent` Python, `35 / 35` tests `pytest` réussis).

<div id="13-same-house-disclosure-and-provenance-boundaries" class="anchor-alias" aria-hidden="true"></div>

### 1.3 Divulgation interne et frontières de provenance

Les études antérieures d'Open Interface Engineering, à savoir [Portes de validation mesurées](/papers/gates/), [Satiété de la tâche contre effet rebond agrégé dans la demande d'IA](/papers/satiation/), [Le Reality Code Engine](/papers/rce/), [RCE-JEPA](/papers/rce-jepa/) et [RCE Compile](/papers/rce-compile/), sont des travaux `[same house]` cités à des fins de transparence et de continuité architecturale, et jamais à titre de confirmation externe. Deux invariants s'imposent d'un bout à l'autre :

- **Non-renforcement de la provenance (`ModelGenerated ↛ Deterministic`)** : les tables compilées à partir d'une vérification de spécification `RCE` déterministe portent l'étiquette `Check-safe` sur les ensembles réservés vérifiés (protégées en ligne par un disjoncteur `HC-SOINN` / `RCE`). Les tables cristallisées sous la porte conforme sans oracle `JEPA-EBRM` portent une borne statistique à échantillon fini (`Conformal-bounded`, $1-\alpha$) et ne sont jamais promues au statut `Deterministic`.
- **Proposant contre autorité (`The drafter proposes; the target decides`)** : en décodage spéculatif, `PagedBenesLUT6` agit strictement comme un proposant à zéro FLOP ; chaque octet ou token émis est vérifié face au décodage glouton du modèle cible (`100.0%` de parité sans perte).

---

<div id="2-mathematical-formulations-and-four-results" class="anchor-alias" aria-hidden="true"></div>

## 2. Formulations mathématiques et quatre résultats

<div id="21-result-1-cascade-ordering-with-amortized-downward-compilation" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Résultat 1 : ordonnancement de cascade avec compilation descendante amortie

Considérons des engrenages $i \in \{0, 1, 2, 3\}$ essayés séquentiellement sur une entrée $x$. L'engrenage $i$ satisfait $C(z) = 1$ avec la probabilité $p_i$ pour une énergie analytique espérée $c_i > 0$. D'après Simon et Kadane (1975), la dépense espérée

$$\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j < k} \bigl(1 - p_{\sigma(j)}\bigr)$$

est minimisée si et seulement si les engrenages sont exécutés par ordre décroissant au sens large de $p_{\sigma(k)} / c_{\sigma(k)}$. Supposons qu'un régime stationnaire $\mathcal{D}_r$ persiste pendant $\Delta T$ requêtes restantes au cours desquelles le chemin d'éveil conclut avec $p_{\text{wake}} = 1$ au coût $c_{\text{wake}}$. Dépenser une énergie ponctuelle de compilation $E_{\text{compile}}$ après $N_{\text{wake}}$ éveils certifiés produit une page `LUT6` à l'Échelon 0 ayant un taux de succès certifié $p_0' \in (0, 1]$ et un coût de consultation $c_0 \ll c_{\text{wake}}$.

**Proposition 1 (Condition énergétique nette de la cristallisation descendante).** *La compilation descendante réduit la dépense analytique cumulée espérée sur l'horizon $\Delta T$ si et seulement si*

$$\Delta T \cdot \bigl(p_0' c_{\text{wake}} - c_0\bigr) > E_{\text{compile}}, \qquad \text{and} \qquad \frac{p_0'}{c_0} > \frac{1}{c_{\text{wake}}}.$$

*Démonstration.* Sans cristallisation, $\Delta T$ requêtes coûtent $\Delta T \cdot c_{\text{wake}}$. Avec une cristallisation au coût $E_{\text{compile}}$, l'Échelon 0 précède le chemin d'éveil dès que $p_0'/c_0 > 1/c_{\text{wake}} \iff c_0 < p_0' c_{\text{wake}}$, et chaque requête coûte $c_0 + (1 - p_0') c_{\text{wake}}$, économisant $p_0' c_{\text{wake}} - c_0 > 0$ par pas. En sommant sur $\Delta T$ pas, l'économie nette vaut $\Delta T(p_0' c_{\text{wake}} - c_0) - E_{\text{compile}} > 0$. En cas de renouvellement rapide ($\Delta T \le \Delta T^*$), la compilation perd de l'énergie, ce qui justifie le tampon minimal d'éveils $N_{\text{wake}}$ de `SleepCrystallizer` ainsi que sa porte sur ensemble réservé $\tau_{\text{agree}} = 0.985$. $\blacksquare$

<div id="22-result-2-non-blocking-512512-benešcopybeneš-multicast-routing" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Résultat 2 : routage multidiffusion $512 \times 512$ Beneš-Copy-Beneš non bloquant

Une banque d'Échelon 0 composée de $G = 80$ cellules `LUT6` dynamiques requiert $M = 6G = 480$ broches d'entrée sélectionnées parmi un bus de $N = 512$ bits avec une sortance (fan-out) arbitraire. Un réseau de permutation bijectif de Beneš ne peut pas répliquer des fils à forte sortance, tandis que des matrices plates de multiplexeurs $512:1$ débordent la capacité de la KV260 (`119,478` CLB LUT dès `384` ports).

**Théorème 2 (Multidiffusion sans contention via Beneš-Copy-Beneš).** *Pour $N = 2^n$ ($n=9, N=512$) et $M \le N$ ($M=480$), toute application de multidiffusion plusieurs-vers-un $\phi: \{0, \dots, M-1\} \to \{0, \dots, N-1\}$ se route sans contention à travers $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ en*

$$D(N) = 2(2\log_2 N - 1) + \log_2 N = 5\log_2 N - 2 = 43 \text{ stages}$$

*de $N/2 = 256$ commutateurs $2 \times 2$ configurés par SRAM ($11,008$ bits de configuration), calculés en temps $O(N \log N)$ avec zéro placement-routage FPGA.*

*Démonstration.* Soit $U = \{s_1, \dots, s_r\}$ l'ensemble des entrées actives distinctes de sortances $\sum_{j=1}^r m_j = M \le N$ et de sommes partielles $S_0 = 0, S_j = \sum_{i=1}^j m_i$. L'étage de concentration $\mathcal{B}_1$ ($17$ étages) applique $\pi_1(s_j) = S_{j-1}$ par bicoloration bipartie de Waksman (Beneš, 1965 ; Waksman, 1968). Le réseau de copie $\mathcal{C}$ ($9$ étages papillon) réplique chaque $S_{j-1}$ sur l'intervalle monotone disjoint $[S_{j-1}, S_j - 1]$ sans contention de lien grâce à la construction de copie monotone de Thompson (Thompson, 1978 ; Lee, 1988). Le réseau de Beneš de sortie $\mathcal{B}_2$ ($17$ étages) permute bijectivement $[S_{j-1}, S_j - 1]$ sur $\phi^{-1}(s_j)$. $\blacksquare$

<div id="23-result-3-joint-mode-minterm-synthesis-vs-marginal-coordinate-argmax" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Résultat 3 : synthèse de mintermes en mode conjoint contre argmax marginal par coordonnée

Des couches DiffLogic à plans binaires indépendants prédisent des rafales multi-bits $\mathbf{Y} = (Y_1, \dots, Y_B)$ par arrondi coordonnée par coordonnée $\hat{y}_b(c) = \mathbb{I}[\Pr(Y_b = 1 \mid c) > 1/2]$, ce qui fusionne des branches corrélées en tokens **chimères** invalides.

**Proposition 3 (Dominance et propriété sans chimère des mintermes en mode conjoint).** *Pour un contexte discret $\psi(X) = c$ et un espace de rafales $\mathcal{Y}$ de $B \le 64$ bits, la table du mode conjoint $T^*(c) = \arg\max_{\mathbf{y} \in \mathcal{Y}} \Pr(\mathbf{Y} = \mathbf{y} \mid c)$ vérifie $\Pr[\mathbf{Y} = T^*(\psi(X))] \ge \Pr[\mathbf{Y} = \hat{\mathbf{y}}^{\text{marg}}(\psi(X))]$, demeure à l'intérieur du support $\operatorname{supp}(\mathbf{Y} \mid c)$ et évite les chimères marginales (là où des masses de probabilité $0.40, 0.35, 0.25$ sur $(1,1,0), (1,0,1), (0,1,1)$ s'arrondissent marginalement au vecteur invalide $(1,1,1)$ avec `0%` de correspondance exacte contre `40%` pour $T^*$). Pour un vocabulaire $|V|$ exigeant $b_V = \lceil \log_2 |V| \rceil$ bits, un unique mot `uint64` compacte $K = \lfloor 64 / b_V \rfloor$ tokens BPE (`16b × 4 = 64b` sur `LFM2.5-350M` ; `18b × 3 = 54b` sur `Qwen3.5-0.8B-Base`).* $\blacksquare$

<div id="24-result-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Résultat 4 : porte sans oracle `JEPA-EBRM` latente Split-Conformal + ACI en ligne

Afin d'empêcher toute auto-distillation hallucinée lorsqu'aucune vérification `RCE` déterministe n'est disponible, l'implémentation de référence évalue les paires candidates à l'aide d'une énergie latente à régularisation radiale :

$$E_\phi(x, y) = \frac{1}{2}\|f_\theta(x) - \mu_y\|_2^2 + \frac{\lambda_r}{2}\|f_\theta(x)\|_2^2 + \psi_\phi(f_\theta(x), y), \qquad \lambda_r > 0, \quad |\psi_\phi| \le C_\psi.$$

Le calibrage conforme scindé sur un ensemble réservé fixe $\hat{Q}_{1-\alpha}$, et l'inférence conforme adaptative en ligne met à jour $\alpha_{t+1} = \alpha_t + \gamma(\alpha - \text{err}_t)$ (Gibbs et Candès, 2021), n'admettant $(x, \hat{y})$ dans `SleepCrystallizer` que lorsque $|\mathcal{C}_t(x)| = |\{y : E_\phi(x,y) \le \hat{Q}_{1-\alpha_t}\}| = 1$ (`Conformal-bounded`). D'après Vovk et al. (2005) et Gibbs et Candès (2021), la couverture marginale sous échangeabilité est d'au moins $1-\alpha$, le défaut de couverture à long terme sous dérive converge vers $\alpha$, et toute demi-droite hors variété dépassant le rayon $R(\alpha_t) = \sqrt{2(\hat{Q}_{1-\alpha_t} + C_\psi)/\lambda_r}$ produit $\mathcal{C}_t(x) = \emptyset$ (`Refuse` / abstention).

---

<div id="3-reference-architecture-polyglot-suite-and-kv260-rtl" class="anchor-alias" aria-hidden="true"></div>

## 3. Architecture de référence, suite polyglotte et RTL KV260

La figure 1 présente la cascade à quatre niveaux et la boucle descendante `SleepCrystallizer` dans `src/clai/`.

![Figure 1. Compilation descendante à travers une cascade Mixture of Limits à quatre niveaux.](/figures/lut-adapt/mol-downward-cascade.svg)

*Figure 1. Compilation descendante à travers une cascade Mixture of Limits à quatre niveaux. Schéma de conception, et non une mesure de puissance de la carte. [PNG](/figures/lut-adapt/mol-downward-cascade.png) · [Explorateur interactif](/living/lut-adapt/#la-diag-01).*

Cinq implémentations systèmes dans `openIE-dev/lut-adapt-ai` recoupent la cascade : Python/PyTorch/Triton (`src/clai/`), Rust `Burn 0.22.1 / CubeCL` sur Metal (`sys/rust/`), Zig `0.17.1` (`sys/zig/`), Go `1.27.4` SIMD (`sys/go/`) et Julia `1.13.4` Enzyme (`sys/julia/`).

La figure 2 illustre le chemin de données RTL de la Kria KV260 (`xck26`) dans `hw/kv260/rtl/clai_benes_hotswap_core.sv`. Elle associe `512` pages `LUT6` résidentes (`5 120` bits `INIT` + étiquette de contexte de `48` bits + bit de validité) à `81` mémoires double accès `RAMB36E2` en parallèle, pour une commutation de contexte en un seul cycle (`4,0 ns` à `250 MHz` nominal, `CPI = 1,0`).

![Figure 2. Tissu multidiffusion Beneš-Copy-Beneš et cache de pages LUT6 en BRAM à cycle unique.](/figures/lut-adapt/benes-paged-silicon.svg)

*Figure 2. Tissu multidiffusion Beneš-Copy-Beneš `512×512` et cache de pages `LUT6` `81 × RAMB36E2` à cycle unique, ciblant l'AMD Kria KV260 (`xck26`) avec Yosys `0.71+` et une simulation Verilator `5.054` (`board_metered = false`). [PNG](/figures/lut-adapt/benes-paged-silicon.png) · [Explorateur interactif](/living/lut-adapt/#la-diag-02).*

La figure 3 présente `AirMoL` (`src/clai/frontier/air_mol_streamer.py` et `hf_air_mol_pretrained.py`), qui diffuse des fragments quantifiés par groupes sur 4 bits via `os.pread` avec `F_NOCACHE` sous Darwin, vérifie `[last_tok, d_1..d_K]` en un seul balayage et conserve en RAM des instantanés compacts d'états hybrides (`Short-Conv/SSM` ou `Gated DeltaNet` + cache KV `GQA` épars sur `6` couches). Ainsi, les rejets partiels de brouillons n'entraînent **aucun balayage supplémentaire du NVMe**.

![Figure 3. Diffusion NVMe sur 4 bits de couches AirMoL avec spéculation LUT6 universelle sur jetons de 64 bits au plus.](/figures/lut-adapt/airmol-nvme-speculation.svg)

*Figure 3. Diffusion NVMe sur 4 bits à balayage supplémentaire nul pour `AirMoL` avec spéculation `LUT6` universelle sur jetons de `≤64` bits, sur `LiquidAI/LFM3-1.7B`, `LiquidAI/LFM2.5-350M` et `Qwen/Qwen3.5-0.8B-Base`. [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [Explorateur interactif](/living/lut-adapt/#la-run-01).*

La Figure 4 montre `Expert-AirMoL` (`src/clai/frontier/moe_air_mol.py`) et `VerifiedCodeCascade` (`verified_code_cascade.py`). Le `AirLLM` standard déchargé sur disque balaie tous les $E$ experts par couche MoE (`32` dans `LiquidAI/LFM2.5-8B-A1B`, `256` dans `Qwen/Qwen3.6-35B-A3B`) même si le routeur n’active que $k \ll E$ experts par jeton (`4/32` et `8/256`). `Expert-AirMoL` partitionne chaque couche MoE en un fragment d’en-tête compact et un fichier NVMe `INT4` `.experts.pack4` à pas fixe, émettant des lectures `F_NOCACHE` `os.pread` uniquement pour l’union d’experts actifs $\mathcal{U}_l$ parmi les $K+1$ positions d’éclatement. Pour les tâches de synthèse nouvelles, `VerifiedCodeCascade` verrouille chaque validation à travers les Rungs `0-3c` derrière un AST borné à `0.35s`, une exécution en bac à sable et une vérification invariante de frontière $C(z) \in \{0, 1\}$, compilant des solutions certifiées dans `BenesLUT6` et des pages de compétences AST canoniques.

![Figure 4. Diffusion NVMe à 4 bits à routage parcimonieux d'`Expert-AirMoL` et `VerifiedCodeCascade` à verrouillage par vérificateur.](/figures/lut-adapt/moe-expert-cascade.svg)

*Figure 4. Diffusion NVMe à 4 bits indexée par experts `Expert-AirMoL` (`12.30×` réduction d’I/O sur `Qwen/Qwen3.6-35B-A3B`) et `VerifiedCodeCascade` à verrouillage `C(z)`. [PNG](/figures/lut-adapt/moe-expert-cascade.png) · [Explorateur interactif](/living/lut-adapt/#la-run-01).*

La Figure 5 situe la compilation descendante le long du cliquet de capacités à neuf échelons de l'intelligence informatique (étude compagnon : [L'avalanche des outils de communication](/papers/communication-avalanche/) `[same house]`). Les échelons 1 à 5 - **(1) Recherche** (`RAG`), **(2) Génération**, **(3) Raisonnement** (`<think>`), **(4) Communication** (délégation `MCP`) et **(5) Utilisation d'outils** - plafonnent sous une inférence `MAC` éphémère à démarrage à froid où l'horizon stationnaire demeure à $\Delta T \approx 1 \le \Delta T^*$ et où les modèles autonomes à `1` passe admettent `56.25%-95.83%` de correctifs défectueux (`Affirmations LA-20` et `LA-21`). Franchir le **Seuil de compilation** de la Proposition 1 ($\Delta T > \Delta T^* = E_{\text{compile}} / (p_0' c_{\text{wake}} - c_0)$ sous $C(z) = 1$, `0.00%` de validations défectueuses admises) débloque **(6) Immersion** (un état local persistant étend $\Delta T \gg \Delta T^*$), **(7) Compétence** ($p_0' \to 1$ à `62.4 pJ/cycle` `est_j` en RTL `LUT6` `xck26` à gating `CE` et `272 µJ/req` `reported_j` sous `MCP` Rust `mol-agent-rs`), **(8) Écologie** (populations d'agents Rust natifs en périphérie) et **(9) Économie** (division du travail ordonnée par le rapport $p_i / c_i$ de Simon-Kadane et des reçus en joules typés par niveau).

![Figure 5. Le cliquet d'avalanche à neuf échelons de l'intelligence informatique et le seuil de compilation.](/figures/lut-adapt/avalanche-compilation-threshold.svg)

*Figure 5. Le cliquet de capacités à neuf échelons et le seuil de compilation de la Proposition 1 ($\Delta T > \Delta T^*$), séparant `reported_j` (Apple M5 Max) et `est_j` (`AMD DS925` `VCD`) sur douze ordres de grandeur (`measured_j = None`, `board_metered = false`). [PNG](/figures/lut-adapt/avalanche-compilation-threshold.png) · [Explorateur interactif](/living/lut-adapt/#la-diag-03).*

---

<div id="4-claims-and-results" class="anchor-alias" aria-hidden="true"></div>

## 4. Affirmations et résultats

<div id="41-claim-la-1-analytical-est_jvc-reduction-on-synthetic-tasks-and-real-pcap-traffic" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Affirmation LA-1 : réduction analytique de `est_j/VC` sur tâches synthétiques et trafic `.pcap` réel

| Charge de travail et fenêtre | Part de l'Échelon 0 | Taux de réussite | `est_j / VC` analytique | Parité Verilator | Classe de preuve |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Synthétique ép. `1-512` (éveil à froid) | `0.00%` | `0.0% → 52.0%` | `2,323.18 est_j` | - | SW + `est_j` |
| Synthétique ép. `3,073-3,584` (cristallisé) | `52.73%` | `60.55%` | `2.59 est_j` (`895×`) | `100.0%` | Verilator + `est_j` |
| Paquets `.pcap` `1-512` (IPv4 à froid) | `0.00%` | `73.05%` | `3.3351 est_j` | `100.0%` | Verilator + `est_j` |
| Paquets `.pcap` `1,537-2,048` (cristallisé) | `100.00%` | `100.00%` | `0.000140 est_j` | `100.0%` | Verilator + `est_j` |
| Paquets `.pcap` `2,049-2,560` (bascule VLAN `0x8100`) | `2.73%` | `68.55%` | `3.0485 est_j` | `100.0%` | Disjoncteur + `est_j` |
| **Paquets `.pcap` `2,561-3,072` (recristallisé)** | **`100.00%`** | **`100.00%`** | **`0.000131 est_j` (`25,458×`)** | **`100.0%` (`5,120/5,120`)** | **Verilator + `est_j`** |

<div id="42-claim-la-2-five-language-polyglot-parity-and-zero-allocation-dataplanes" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Affirmation LA-2 : parité polyglotte en cinq langages et plans de données sans allocation

| Implémentation | Cible / Moteur | Résultat clé | Classe de preuve |
| :--- | :--- | :--- | :--- |
| **Rust (`sys/rust/`)** | `Burn 0.22.1` + GPU Metal `CubeCL` | `2,331.42 → 0.19 est_j/VC`, part d'Échelon 0 à `95.31%`, émet le `.v` KV260 | SW mesuré + `est_j` |
| **Zig `0.17.1` (`sys/zig/`)** | SIMD `@Vector(8, f32)` + `@popCount` | `0` octet sur le tas dans la boucle critique ; `87 ns/pkt` (`11.49M pkts/s`) | SW mesuré (M5 Max) |
| **Go `1.27.4` (`sys/go/`)** | Pool de travailleurs + `OnesCount64` | `0 B/op`, `0 allocs/op` ; `31.86 ns/op` (`31.39M evals/s`) | Mesuré (`go test`) |
| **Julia `1.13.4` (`sys/julia/`)** | AD en mode inverse `Enzyme.jl` | Écart maximal de gradient par rapport aux DF centrées : `6.11 × 10⁻¹⁰` | Vérification numérique mesurée |

<div id="43-claim-la-3-kv260-xck26-benešcopybeneš-and-ramb36e2-paged-synthesis" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Affirmation LA-3 : synthèse paginée Beneš-Copy-Beneš et `RAMB36E2` sur KV260 (`xck26`)

| Architecture RTL | Pages | Latence de comm. | CLB LUT `xcup` (`% xck26`) | `RAMB36E2` | `DSP48` | Préc. post-dérive | Classe de preuve |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `2A` Matrice plate `512:1` (`64` LUT6) | `1` | `82 cyc` | `119,478` (**dépassement `102.0%`**) | `0` | `0` | `98.44%` | Simulé (Yosys) |
| `2B` Matrice compacte (`32` LUT6) | `1` | `82 cyc` | `59,739` (`51.0%`) | `0` | `0` | `95.94%` | Simulé (Yosys) |
| `2C` DiffLogic / WNN à câblage fixe | `1` | re-PAR Vivado | `160` (`0.14%`) | `0` | `0` | **`52.34%`** | Simulé (Yosys) |
| `2D` Beneš-Copy-Beneš monopage | `1` | `82 cyc` | `40,155` (`34.3%`) | `0` | `0` | `98.44%` | Simulé (Yosys + Verilator) |
| `P2` Bascules distribuées + Mux `512:1` | `512` | `1 cyc` | `926,619` (**dépassement `791.2%`**) | `0` | `0` | `98.44%` | Simulé |
| **`P3` Beneš + `81` `RAMB36E2` (Référence)** | **`512`** | **`1 cyc` (`4.0 ns`)** | **`41,186` (`35.2%`)** | **`81` (`56.2%`)** | **`0`** | **`98.44%`** | **Simulé (Yosys + Verilator)** |

<div id="44-claim-la-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.4 Affirmation LA-4 : porte sans oracle `JEPA-EBRM` latente Split-Conformal + ACI en ligne

| Porte de cristallisation | Passes | Risque de fausse cristallisation | AUROC OOD | Couverture ID sûre | Préc. `LUT6` propre | Dérive détectée ? | Classe de preuve |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `3A` Softmax MSP ($\max p \ge 0.95$) | `1` | `17.62%` | `0.8552` | `90.93%` | `99.22%` | `False` | SW mesuré |
| `3B` Marge pondérée en température | `1` | `17.66%` | `0.8422` | `91.12%` | `98.83%` | `False` | SW mesuré |
| `3C` Énergie de logits de Helmholtz | `1` | `24.28%` | `0.8045` | `97.17%` | `99.80%` | `False` | SW mesuré |
| `3D` MC-Dropout (`5` passes) | `5` | `18.24%` | `0.8494` | `91.03%` | `99.61%` | `False` | SW mesuré |
| **`3E` `JEPA-EBRM` latent + ACI conforme** | **`1`** | **`0.00%`** | **`1.0000`** | **`95.66%`** | **`99.02%`** | **`True`** | **SW mesuré** |

<div id="45-claim-la-5-lossless-byte-level-speculative-decoding-on-520-kb-polyglot-source-code" class="anchor-alias" aria-hidden="true"></div>

### 4.5 Affirmation LA-5 : décodage spéculatif sans perte au niveau de l'octet sur `520 KB` de code source polyglotte

| Architecture | Parité exacte | Octets / Passe | Passes (`64 B`) | FLOPs de brouillon | MFLOPs / Octet | `est_mJ / Byte` | Classe de preuve |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` Transformer causal (`RoPE+SwiGLU`) | `100.0%` | `1.00` | `64.00` | `0` | `7.209` | `58.94` | SW mesuré + `est_j` |
| `B` `Mamba-3` MIMO complexe (`T=1`) | `100.0%` | `1.00` | `64.00` | `0` | `2.257` | `20.84` | SW mesuré + `est_j` |
| `C` Consultation dans l'invite `PLD` | `100.0%` | `2.13` | `29.98` | `0` | `1.322` | `11.52` | SW mesuré + `est_j` |
| `D` Trie de suffixes sur corpus `REST` | `100.0%` | `3.84` | `16.65` | `0` | `0.734` | `6.40` | SW mesuré + `est_j` |
| `E` Têtes MLP parallèles `Medusa` | `100.0%` | `2.62` | `24.44` | `428,288` | `1.241` | `9.46` | SW mesuré + `est_j` |
| `F` Arbre neuronal de brouillon `EAGLE-2` | `100.0%` | `2.75` | `23.29` | `1,122,560` | `1.435` | `9.07` | SW mesuré + `est_j` |
| **`G` `MoL` Beneš paginé `LUT6` (Référence)** | **`100.0%`** | **`3.84`** | **`16.69`** | **`0`** | **`0.736`** | **`6.41`** | **SW mesuré + `est_j`** |

<div id="46-claim-la-6-controlled-airmol-4-bit-nvme-streaming-143m-matched-pair" class="anchor-alias" aria-hidden="true"></div>

### 4.6 Affirmation LA-6 : diffusion NVMe 4 bits `AirMoL` contrôlée (paire appariée à `14.3M` paramètres)

| Architecture de diffusion déchargée | Parité | Octets / Balayage | Balayages | Lecture NVMe | Écriture NVMe | RAM crête | `ms / Byte` | Classe de preuve |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `AirLLM` Transformer FP16 + débordement KV | `100%` | `1.00` | `64.00` | `2,130.0 MB` | `407.6 MB` | `8.81 MB` | `60.64` | Mesuré (`F_NOCACHE`) |
| `2` `AirLLM` Transformer 4 bits + débordement KV | `100%` | `1.00` | `64.00` | `887.6 MB` | `407.6 MB` | `8.81 MB` | `64.87` | Mesuré (`F_NOCACHE`) |
| `3` `AirMamba-3` 4 bits + `EAGLE-2` paginé disque | `100%` | `2.86` | `22.38` | `175.3 MB` | `0.0 MB` | `7.20 MB` | `19.20` | Mesuré (`F_NOCACHE`) |
| `4` `AirMamba-3` 4 bits + $O(1)$ épinglé (`T=1`) | `100%` | `1.00` | `64.00` | `488.3 MB` | `0.0 MB` | `7.20 MB` | `37.72` | Mesuré (`F_NOCACHE`) |
| **`5` `AirMoL` 4 bits + `LUT6` à froid (Référence)** | **`100%`** | **`3.74`** | **`17.12`** | **`130.7 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.18`** | **Mesuré (`F_NOCACHE`)** |
| **`6` `AirMoL` 4 bits + post-éveil (Référence)** | **`100%`** | **`4.27`** | **`15.00`** | **`114.4 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.09`** | **Mesuré (`F_NOCACHE`)** |

<div id="47-claim-la-7-pretrained-2026-dense--tri-hybrid-models-under-airmol-lfm3-17b-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 Revendication LA-7 : Modèles denses et tri-hybrides pré-entraînés en 2026 sous `AirMoL` (`LFM3-1.7B`, `LFM2.5-350M` et `Qwen3.5-0.8B-Base`)

| Point de contrôle 2026 et architecture | Parité | Tok / Balayage | Caractères / Balayage | Balayages | Lecture NVMe | RAM active maximale (`% FP32`) | `tok/s` | Classe de preuve |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM3-1.7B` (oct. 2026) · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.30` | `24.00` | `25.045 GB` | `250.0 MB` (`3.79%`) | `0.53` | Mesurée (`F_NOCACHE`) |
| `LFM3-1.7B` (oct. 2026) · `AirLLM` 4-Bit + `PLD` | `100%` | `1.37` | `3.16` | `17.50` | `18.262 GB` | `250.0 MB` (`3.79%`) | `0.73` | Mesurée (`F_NOCACHE`) |
| **`LFM3-1.7B` (oct. 2026) · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.55`** | **`3.56`** | **`15.50`** | **`16.175 GB`** | **`250.0 MB` (`3.79%`)** | **`0.81`** | **Mesurée (`F_NOCACHE`)** |
| **`LFM3-1.7B` (oct. 2026) · `AirMoL` Post-Wake** | **`100%`** | **`2.74`** | **`6.31`** | **`8.75`** | **`9.131 GB`** | **`250.0 MB` (`3.79%`)** | **`1.32`** | **Mesurée (`F_NOCACHE`)** |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Mesurée (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Mesurée (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Mesurée (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Mesurée (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` Post-Wake** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Mesurée (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Mesurée (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Mesurée (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Mesurée (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` Post-Wake** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Mesurée (`F_NOCACHE`)** |

En octobre 2026, pour `LiquidAI/LFM3-1.7B` (`13` couches de convolution courtes + `5` couches d'attention à fenêtre glissante + `6` couches d'attention complète, `|V| = 128,000`), l'`AirMoL` post-éveil réduit le transfert NVMe de `2.74×` (`25.045 GB` à `9.131 GB`) et accroît la vitesse de décodage de `2.49×` (`0.53` à `1.32 tok/s`) avec `250.0 MB` de RAM dédiée aux poids actifs (`3.79%` de FP32), à une parité sans perte de `100.0%`. Notons le compromis conservé sur `Qwen3.5-0.8B-Base`, limité par le CPU, pour des invites inédites à froid : `AirMoL` réduit les lectures disque NVMe (`12.674 GB` à `8.581 GB`), mais la vérification par lot de `4` jetons du Gated DeltaNet sur CPU abaisse le débit en temps réel (`0.32` contre `0.53 tok/s`) jusqu'à ce que la cristallisation en ligne de l'éveil vers `LUT6` porte le taux d'acceptation à `2.74 tok/sweep` (`1.11 tok/s`).

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 Affirmation LA-8 : serveur CLI et HTTP/SSE de diffusion en direct (`mol_code_cli.py`)

`scripts/mol_code_cli.py` expose `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` et `--air-nvme` via une interface CLI et des points de terminaison SSE (`/v1/health`, `/v1/complete`, `/v1/crystallize`). Il fait passer l'occupation des emplacements `RAMB36E2` de `438/512` à `460/512` en temps réel, avec `26/26` tests réussis dans `tests/`.

<div id="49-claim-la-9-frontier-sparse-moe-expert-airmol-liquidailfm25-8b-a1b-847b--qwenqwen36-35b-a3b-3466b" class="anchor-alias" aria-hidden="true"></div>

### 4.12 Revendication LA-9 : Sparse-MoE de pointe `Expert-AirMoL` (`LiquidAI/LFM2.5-8B-A1B` `8.47B` et `Qwen/Qwen3.6-35B-A3B` `34.66B`)

| Point de contrôle Sparse-MoE et bras | Parité | Experts actifs | Tok / balayage | Lecture NVMe / Tok | Réduction d’E/S | RAM maximale (`% FP16`) | `tok/s` | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `AirLLM` Dense 4-Bit (`T=1`) | `100%` | `100.00%` | `1.00` | `4.574 GB` | `1.00×` | `1,408.3 MB` (`8.72%`) | `0.28` | `368.80` |
| `LFM2.5-8B-A1B` · `Expert-AirLLM` (`T=1`) | `100%` | `16.93%` | `1.00` | `1.200 GB` | `3.81×` | `1,408.3 MB` (`8.72%`) | `0.58` | `181.26` |
| `LFM2.5-8B-A1B` · `Expert-AirMoL` + `PLD` | `100%` | `28.82%` | `1.78` | `0.883 GB` | `5.18×` | `1,408.3 MB` (`8.72%`) | `0.79` | `132.57` |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` Cold `LUT6`** | **`100%`** | **`33.91%`** | **`1.85`** | **`1.002 GB`** | **`4.56×`** | **`1,408.3 MB` (`8.72%`)** | **`0.72`** | **`145.42`** |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` Post-Wake** | **`100%`** | **`36.46%`** | **`3.00`** | **`0.663 GB`** | **`6.90×`** | **`1,408.3 MB` (`8.72%`)** | **`1.10`** | **`95.67`** |
| `Qwen3.6-35B-A3B` · `AirLLM` Dense 4-Bit (`T=1`) | `100%` | `100.00%` | `1.00` | `18.159 GB` | `1.00×` | `3,214.7 MB` (`4.86%`) | `0.06` | `1,696.81` |
| `Qwen3.6-35B-A3B` · `Expert-AirLLM` (`T=1`) | `100%` | `6.35%` | `1.00` | `2.356 GB` | `7.71×` | `2,530.7 MB` (`3.83%`) | `0.22` | `471.87` |
| `Qwen3.6-35B-A3B` · `Expert-AirMoL` + `PLD` | `100%` | `11.58%` | `1.89` | `1.708 GB` | `10.63×` | `2,530.7 MB` (`3.83%`) | `0.32` | `326.24` |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` Cold `LUT6`** | **`100%`** | **`12.91%`** | **`2.00`** | **`1.722 GB`** | **`10.54×`** | **`2,530.7 MB` (`3.83%`)** | **`0.31`** | **`334.42`** |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` Post-Wake** | **`100%`** | **`14.97%`** | **`2.57`** | **`1.477 GB`** | **`12.30×`** | **`2,530.7 MB` (`3.83%`)** | **`0.39`** | **`267.08`** |

Sur `Qwen/Qwen3.6-35B-A3B` (`34.66B` paramètres, `66.11 GB` FP16 fragmentés en fichiers `.experts.pack4` 4-bit de `18.60 GB` ; delta `PMU` macOS du système entier `20,070.18 J`), le `Expert-AirMoL` post-éveil réduit le transfert NVMe non mis en mémoire tampon de **`12.30×`** (`18.159` à `1.477 GB/tok`) et accélère le décodage de **`6.50×`** (`0.06` à `0.39 tok/s`) dans **`2,530.7 MB` de RAM active (`3.83%` du FP16)** à une parité de jetons sans perte de `100.0%`.

<div id="410-claim-la-10-sub-1-bit-latent-factorization-littlebit-1--littlebit-2-vs-zero-mac-sub1bit-lut6" class="anchor-alias" aria-hidden="true"></div>

### 4.10 Affirmation LA-10 : factorisation latente sub-1-bit (`LittleBit-1 / LittleBit-2`) par rapport à `Sub1Bit-LUT6` à zéro MAC

| Méthode de factorisation (`LFM2.5-8B-A1B` `w1 [1792, 2048]`) | Bits / poids | SNR du poids | Similarité cosinus | Concordance Top-1 `16K` | MAC binaires / jeton | Époques QAT | Classe de preuve |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` SVD SVID non pivotée (style `LittleBit-1` PTQ) | `0.576` (`27.8×`) | `1.76 dB` | `0.5761` | `3.12%` | `1,981,440` | `0` (`5` dans l'article) | Mesuré logiciel |
| `B` SVID ITQ de Procrustes (style `LittleBit-2` PTQ) | `0.576` (`27.8×`) | `2.42 dB` | `0.6487` | `10.94%` | `1,981,440` | `0` (`5` dans l'article) | Mesuré logiciel |
| **`C` Lookup de table `Sub1Bit-LUT6` (`0` MAC, brouillon)** | **`0.576` (`27.8×`)** | **`2.42 dB`** | **`0.6487`** | **`10.94%`** | **`0`** | **`0`** | **Mesuré (`< 4e-6` par rapport à `B`)** |
| `D` Cible `INT4` par blocs de 64 `Expert-AirMoL` | `4.500` (`3.56×`) | `20.77 dB` | `0.9958` | `82.81%` | `0` (`INT4`) | `0` | Mesuré logiciel |
| **`E` `MoL` : brouillon `Sub1Bit-LUT6` + vérification par la cible** | **`0.576` brouillon** | **`148.84 dB`** | **`1.0000`** | **`100.00%`** | **`0` MAC brouillon** | **`0`** | **Parité sans perte mesurée** |

<div id="411-claim-la-11-48-task-16-specifications--3-waves-late-2026-frontier-coding-bakeoff" class="anchor-alias" aria-hidden="true"></div>

### 4.11 Revendication LA-11 : concours de codage de pointe à échéance fin 2026 à `48` tâches (`16` spécifications × `3` vagues)

| Système à bras fin 2026 (`48` tâches = `16` spéc. × `3` vagues) | W1 Froid | W2 Adaptation | W3 Chaud | Taux de réussite global | Commits cassés | Part W3 `Rung 0/1` | Appels `35B` | Moyenne W1 / W3 (`ms`) | `reported_j` / Résolution (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT (`1`-Shot) | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `22,413` / `22,708` | `8,020.13` (`32,558 est_j`) |
| `B` `LiquidAI/LFM3-1.7B` (Tri-Hybride oct. 2026, `1`-Shot) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `8,460` / `9,791` | `152.77` (`957.21 est_j`) |
| `C` `google/gemma-4-E2B-it` (Hybride `2026`, `1`-Shot) | `37.50%` | `18.75%` | `18.75%` | `25.00%` | `75.00%` | `0.00%` | `0.0%` | `18,924` / `23,578` | `5,800.68*` (`3,700.44 est_j`) |
| `D` `LiquidAI/LFM2.5-8B-A1B` (`8.47B` MoE, `1`-Shot) | `6.25%` | `6.25%` | `6.25%` | `6.25%` | `93.75%` | `0.00%` | `0.0%` | `53,123` / `53,885` | `33,415.04` (`47,196 est_j`) |
| `E` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (`1`-Shot) | `81.25%` | `75.00%` | `75.00%` | `77.08%` | `22.92%` | `0.00%` | `100.0%` | `49,887` / `44,447` | `1,069.65` (`5,701.32 est_j`) |
| `F` `RouteLLM` Routeur de confiance (`LFM3` $\to$ `Gemma4` $\to$ `8B`) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `9,735` / `11,294` | `171.09` (`1,148.96 est_j`) |
| **`G` `MoL` `VerifiedCodeCascade` (Référence)** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`87.50%`** | **`22.92%`** | **`116,626` / `44,052` (`2.89 ms` résolu)** | **`3,655.51*` (`0.0424 J` en W3)** |

À travers le protocole et le benchmark d'algorithmes de `48` tâches (arithmétique sérielle RFC 1982, balayage d'intervalles pondérés, tri topologique lexicographique à cycle sûr, seaux à jeton de nanosecondes, CRC-8/ATM et CRC-8 muté `0xFF`, dés-échappement JSON Pointer RFC 6901 `~01`, Bellman-Ford à sauts limités, médianes de fenêtres exactes `>2⁵³`, Damerau-Levenshtein sans restriction, routage Beneš `4×4`, paramétrisation littérale SQL, somme de sous-séquence de deque monotone, DWARF SLEB128, hachage cohérent SHA-256, et quantiles conformes ; delta `PMU` macOS `117,166.40 J` sur `6,646` ticks), `VerifiedCodeCascade` atteint **`87,50 %` (`42 / 48`)** sur les trois vagues, dépassant le `Qwen3.6-35B-A3B` autonome (`77,08 %`) tout en appelant `35B` uniquement sur **`22,92 %` (`11 / 48`)** des tâches (`LFM3-1.7B` résout directement `7` spécifications de la Vague-1 ; `Gemma-4-E2B-it` + réparation structurée de contre-exemple résout `3` ; `Metal-Qwen3.6-35B-A3B` résout `4` plus le `W2_01` muté). Il n’admet **`0,00 %` de commits cassés** (vs. `22,92 %-100,00 %`), détecte les deux mutations adversariales de spécification de la Vague-2 via $C(z)$ (`16` compétences certifiées dans `artifacts/.mol_verified_skills`), et réduit la moyenne des rejouements de la Vague-3 sur les **`14` résolutions cristallisées (`87,50 %`)** à **`2,89 ms`** et **`0,0424 J` `reported_j`** (`15 401×` plus rapide et `25 227×` moins d’`reported_j` que le `35B` autonome). *(Note de bas de page `*` : une invocation `W2_10` de `Gemma-4` a connu un pic de dépassement du accumulateur matériel macOS `IOReport` `'GPU Energy'` de `+59,2 kJ`, conservé tel quel dans `frontier_ai_head_to_head_bakeoff.csv` et filtré par la garde de dépassement `> 450 W` du script `joule_meter.py` lors des exécutions suivantes.)*

<div id="412-claim-la-12-native-apple-metal-msl-fused-int4-sparse-moe--gateddeltanet-shaders--dual-channel-reported_j" class="anchor-alias" aria-hidden="true"></div>

### 4.12 Affirmation LA-12 : shaders Apple Metal natifs (`MSL`) fusionnés `INT4` Sparse-MoE et `GatedDeltaNet` + `reported_j` à double canal

`src/clai/frontier/metal_moe_kernels.py` et `scripts/run_metal_moe_benchmark.py` (`artifacts/metal_moe_air_mol_speedup.csv`, `artifacts/metal_moe_air_mol_meta.json`) compilent trois noyaux `MSL` personnalisés via `torch.mps.compile_shader` : (i) `gated_delta_recurrent_k128`, qui exploite l'indépendance exacte des colonnes selon $v \in \{0, \dots, V_{\text{dim}}-1\}$ de l'état récurrent $\mathbf{S}[b, h_v, :, v]$ pour conserver 128 éléments d'état `FP32` dans les registres du GPU sur l'ensemble des $T$ jetons (**`20.66×` plus rapide** : `34.523` à `1.671 ms`, **`46.2×` de `reported_j` en moins** : `1.4989` à `0.0325 J`, erreur maximale sur l'état de `1.19 × 10⁻⁷`) ; et (ii) `q4_moe_gate_up_silu` + `q4_moe_down_weighted`, qui déquantifient directement dans les registres `simd_sum` les poids d'experts `INT4` de `4.50 bpw` en blocs de 64, sans aucune allocation de poids `FP16`/`FP32` (**`43.45×` plus rapide** : `22.408` à `0.516 ms` sur `28` experts actifs, **`29.8×` de `reported_j` en moins** : `0.3959` à `0.0133 J`, erreur maximale `FP32` de `7.2 × 10⁻⁷`, `<= 1 ULP` en `BF16`). Ces noyaux sont associés à une lecture parallèle `pread` à profondeur de file `8` et à un routeur à anticipation `BenesLUT6` fondé sur une esquisse de signe.

| Variante de point de contrôle Sparse-MoE & moteur NVMe à froid | Parité | Tok / Balayage | Lecture NVMe / Tok | RAM active de pointe | `tok/s` (`× PyTorch`) | `reported_j / tok` embarqué (`GPU` + `CPU`) | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `1` Réf. PyTorch `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | `1,408.3 MB` | `0.394` (`1.00×`) | `10.978 J` (`5.25` + `5.73`) | `266.66` |
| `LFM2.5-8B-A1B` · `2` `Expert-AirMoL` fusionné Metal (`T=1`) | `100%` | `1.00` | `1.257 GB` | **`500.0 MB`** | `0.689` (`1.75×`) | `6.979 J` (`1.30` + `5.68`) | `152.42` |
| **`LFM2.5-8B-A1B` · `3` Fusionné Metal + `BenesLUT6` (Référence)** | **`100%`** | **`2.67`** | **`0.791 GB`** | **`500.0 MB`** | **`1.671` (`4.24×`)** | **`3.493 J` (`1.22` + `2.28`)** | **`62.85`** |
| `Qwen3.6-35B-A3B` · `1` Réf. PyTorch `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | `2,434.7 MB` | `0.191` (`1.00×`) | `20.765 J` (`8.76` + `12.00`) | `549.49` |
| `Qwen3.6-35B-A3B` · `2` `Expert-AirMoL` fusionné Metal (`T=1`) | `100%` | `1.00` | `2.353 GB` | **`970.0 MB` (`1.47%`)** | `0.241` (`1.26×`) | `15.440 J` (`3.93` + `11.51`) | `436.26` |
| **`Qwen3.6-35B-A3B` · `3` Fusionné Metal + `BenesLUT6` (Référence)** | **`100%`** | **`2.67`** | **`1.447 GB`** | **`970.0 MB` (`1.47%`)** | **`0.621` (`3.25×`)** | **`6.773 J` (`2.31` + `4.47`)** | **`169.03`** |

En supprimant la dépaquetage des experts en `FP16`/`FP32`, la RAM de pointe des poids actifs en lecture NVMe à froid sur `Qwen/Qwen3.6-35B-A3B` diminue de **`2.51×`**, pour atteindre **`970.0 MB` (`1.47%` des `66.11 GB` en FP16)**, et le `reported_j / tok` en double canal est réduit de **`3.07×`** (de `20.765` à **`6.773 J/tok`**), avec une parité exacte des jetons à `100.0%`. Le débit atteint **`15.7 tok/s`** lorsque les packs d'experts `INT4` de `16.8 GB` restent épinglés en mémoire unifiée sur des stations de travail `>= 36 GiB`.

<div id="413-claim-la-13-16-task-8-multi-file-git-repositories--2-waves-swe-mini-pytest-patching-benchmark" class="anchor-alias" aria-hidden="true"></div>

### 4.13 Affirmation LA-13 : banc d’essai de correction `pytest` `SWE-Mini` à `16` tâches (`8` dépôts `git` multi-fichiers × `2` vagues)

Les fichiers `src/clai/frontier/repo_patch_cascade.py` et `scripts/run_repo_patch_benchmark.py` (`artifacts/repo_patch_swebench_mini.csv`, `artifacts/repo_patch_swebench_mini_traces.json`) évaluent la correction de bogues multi-modules dans `8` dépôts `git` isolés (`billing`, DAG `scheduler`, `auth` JWT/HMAC, `wal` CRC32, `http_client` CIDR, `semver`, `ttlcache` LRU/TTL et `etl` CSV) × `2` vagues (`16` évaluations, dont une mutation de sécurité Wave-2 sur `R03_jwt_clock_skew` ajoutant le rejet des `iat` futurs), où $C(z)$ impose l’identité octet à octet des `tests/` et exécute en sous-processus `pytest -q` :

| Bras de dépôt `git` multi-fichiers (`16` tâches = `8` dépôts × `2` vagues) | W1 Cold | W2 Warm | Taux de succès global | Correctifs défectueux | Part des `.mol/` atteints en W2 | Moyenne W1 / W2 (`ms`) | `reported_j` / Correctif (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (correctif de dépôt `1`-Shot) | `25,00 %` | `25,00 %` | `25,00 %` | `75,00 %` | `0,00 %` | `4 943` / `5 020` | `371,61 J` (`637,68 est_j`) |
| `B` `google/gemma-4-E2B-it` (correctif de dépôt `1`-Shot) | `62,50 %` | `62,50 %` | `62,50 %` | `37,50 %` | `0,00 %` | `6 865` / `7 117` | `133,48 J` (`469,79 est_j`) |
| `C` `LiquidAI/LFM2.5-8B-A1B` (correctif de dépôt `1`-Shot) | `0,00 %` | `0,00 %` | `0,00 %` | `100,00 %` | `0,00 %` | `61 430` / `61 416` | `17 882,33 J` (`54 052 est_j`) |
| `D` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (`1`-Shot) | `62,50 %` | `62,50 %` | `62,50 %` | `37,50 %` | `0,00 %` | `20 270` / `20 502` | `288,39 J` (`3 098,71 est_j`) |
| **`E` `MoL` `RepoPatchCascade` (Référence)** | **`87,50 %`** | **`87,50 %`** | **`87,50 %`** | **`0,00 %`** | **`75,00 %`** | **`59 341` / `30 663` (`594 ms` `.mol/`)** | **`692,38 J` (`1,10 J` `.mol/`)** |

`RepoPatchCascade` résout **`87,50 %` (`14 / 16`)** des bogues de dépôts multi-fichiers (`+25,0` points de pourcentage au-dessus des modèles autonomes `35B` et `Gemma 4`), commet **`0,00 %` de correctifs défectueux**, détecte la mutation de spécification Wave-2 `R03` via le sous-processus `pytest` $C(z)$ et re-cristallise `Patch#8` (`2 905 ms`), et rejoue les `6` correctifs `.mol/` récurrents de la Wave-2 en **`594,0 ms` (`1,10 J` `reported_j`, incluant `git init` + `pytest`)** contre `38 937,5 ms` (`590,38 J` `reported_j`) en Wave 1 (**`65,6×` plus rapide, `537×` plus faible `reported_j`**).

<div id="414-claim-la-14-drop-in-openai-v1chatcompletions-and-mcp-json-rpc-20-local-coding-agent-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.14 Affirmation LA-14 : Agent de codage local compatible OpenAI (`/v1/chat/completions`) et `MCP` (`JSON-RPC 2.0`)

`src/clai/service/openai_mcp_agent.py` et `scripts/mol_agent_server.py` (`mol-agent` point d’entrée CLI) exposent la cascade aux outils de codage `IDE` et aux terminaux (`Cursor`, `Continue.dev`, `Claude Code`, `Antigravity`, OpenAI `SDK`) sans aucune dépendance web tierce : (i) compatibilité OpenAI avec `GET /v1/models` et `POST /v1/chat/completions` (`stream: true/false` `SSE`, en-têtes CORS, vérificateur déterministe optionnel `x_mol_contract`, et rapport `x_mol_receipt` incluant `skill_id`, `est_j`, `reported_j`, `measured_j: null`) ; et (ii) Protocole de Contexte de Modèle (`MCP` `JSON-RPC 2.0` via `--mcp-stdio` et `POST /mcp`) exposant `mol_synthesize_verified_function`, `mol_repair_repo_pytest`, `mol_lookup_crystallized_skill` et `mol_energy_telemetry` soutenus par les fichiers persistants `.mol/skills_v1.json` + `.mol/benes_lut6_router.npz` (`30 / 30` tests `pytest` réussis).

<div id="415-claim-la-15-official-bigcodebench-v013-32-evaluations-and-upstream-swe-bench-verified-sympy-git-worktree-16-evaluations-benchmarks-via-mcp-json-rpc-20" class="anchor-alias" aria-hidden="true"></div>

### 4.15 Affirmation LA-15 : benchmarks officiels `BigCodeBench v0.1.3` (`32` évaluations) et arbres de travail git amont `SWE-bench Verified` `SymPy` (`16` évaluations) via `MCP` `JSON-RPC 2.0`

`src/clai/frontier/external_public_benchmarks.py` et `scripts/run_external_public_benchmarks.py` (`artifacts/external_public_bcb_swebench.csv`, `artifacts/external_public_bcb_swebench_traces.json`) évaluent l'agent `MoL` `MCP` (`handle_mcp_jsonrpc` + cristallisation `.mol/`) face aux modèles autonomes `LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it` et `Qwen/Qwen3.6-35B-A3B` accéléré par Metal sur deux benchmarks publics officiels HuggingFace au format Parquet vérifiés par `SHA`-256 au chargement (`bigcode/bigcodebench` `v0.1.3` : `ed5a3a39...`, `16` tâches × `2` vagues d'invites rédigées par des humains [`complete_prompt` en Vague 1 + `instruct_prompt` en Vague 2] = `32` évaluations `unittest` ; et `princeton-nlp/SWE-bench_Verified` : `a45b1fe4...`, `8` extractions réelles d'arbres de travail git `sympy/sympy` `1.11-1.12` × `2` vagues = `16` évaluations `pytest` couvrant `FAIL_TO_PASS + PASS_TO_PASS`) sous absence stricte de fuite de solution de référence (delta `PMU` macOS `59,250.43 J`) :

| Benchmark public officiel et bras | W1 Froid | W2 Paraphrase / Rétroportage | Réussite vérifiée globale | Sorties cassées admises | Voie rapide `.mol/` W2 | Appels `35B` | Moyenne W1 / W2 (`ms`) | `reported_j` / Résolution (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `BCB v0.1.3` (`32`) · `A` `LiquidAI/LFM3-1.7B` | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `0.00%` | `5,471` / `5,716` | `169.67 J` (`409.11 est_j`) |
| `BCB v0.1.3` (`32`) · `B` `google/gemma-4-E2B-it` | `31.25%` | `43.75%` | `37.50%` | `62.50%` | `0.00%` | `0.00%` | `12,187` / `9,791` | `190.91 J` (`1,230.76 est_j`) |
| `BCB v0.1.3` (`32`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `75.00%` | `81.25%` | `78.12%` | `21.88%` | `0.00%` | `100.00%` | `28,365` / `10,926` | `277.45 J` (`2,388.89 est_j`) |
| **`BCB v0.1.3` (`32`) · `D` Agent `MoL` `MCP` (Référence)** | **`87.50%`** | **`93.75%`** | **`90.62%`** | **`0.00%`** | **`81.25%`** | **`25.00%`** | **`47,321` / `6,001`** | **`263.54 J` (`1,917.44 est_j`)** |
| `SWE-bench Verified` `SymPy` (`16`) · `A` `LiquidAI/LFM3-1.7B` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `5,449` / `5,486` | `869.84 J` (`2,799.45 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `B` `google/gemma-4-E2B-it` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `8,304` / `5,040` | `1,015.22 J` (`4,483.82 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `100.00%` | `18,384` / `19,898` | `1,280.08 J` (`7,273.48 est_j`) |
| **`SWE-bench Verified` `SymPy` (`16`) · `D` Agent `MoL` `MCP` (Référence)** | **`50.00%`** | **`50.00%`** | **`50.00%`** | **`0.00%`** | **`50.00%`** | **`68.75%`** | **`131,976` / `17,215`** | **`6,130.89 J` (`0.33-0.44 J` W2 `.mol/`)** |

Sur `BigCodeBench v0.1.3` (Zhuo et al., 2024), l'agent `MoL` `MCP` surpasse `Qwen3.6-35B-A3B` autonome de **`+12.50` points de pourcentage (`90.62%` contre `78.12%`, atteignant `93.75%` [`15/16`] sur les invites paraphrasées par des humains `instruct_prompt` en Vague 2)** tout en n'invoquant `35B` que sur `25.00%` des tâches, réduisant la latence moyenne de Vague 2 d'un facteur **`7.89×`** (de `47,321` à `6,001 ms` ; `63-146 ms` et `0.09-0.13 J` `reported_j` sur `12` des `13` succès `.mol/`), et dépensant **moins de `reported_j` par résolution vérifiée (`263.54 J` contre `277.45 J`)** avec `0.00%` de sorties défectueuses admises. Sur `SWE-bench Verified` amont (Jimenez et al., 2024), la localisation sans fuite par `AST` et piles d'appels identifie les `8 / 8` fichiers cibles dans `sympy/sympy` sans lire `patch`, et `MoL` double le taux de résolution vérifié (**`50.00%` [`4/8` : `sympy-23534`, `23950`, `24066`, `24213`] contre `25.00%` [`2/8`] sur `35B` et `0.00%` sur `LFM3`/`Gemma4`**), rejouant les `4` compétences cristallisées de `git diff` unifié en Vague 2 en **`1,590-1,720 ms` (`0.33-0.44 J` `reported_j`, incluant l'extraction fraîche du `git worktree` + `pytest`)** tout en s'abstenant de manière sûre (`VERIFIER_ABSTAIN_SAFE`) sur les `4` tickets algébriques multi-blocs non résolus (`0.00%` de correctifs défectueux admis).

<div id="416-claim-la-16-4-stage-250-mhz-pipelined-kria-kv260-xck26-benešcopybeneš--81-ramb36e2-rtl-subsystem-400-logic-depth-reduction" class="anchor-alias" aria-hidden="true"></div>

### 4.16 Affirmation LA-16 : sous-système RTL Beneš-Copy-Beneš + `81-RAMB36E2` pipeliné sur `4` étages à `250 MHz` sur Kria KV260 (`xck26`) (réduction de `4.00×` de la profondeur logique)

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv` et `scripts/verify_pipelined_250mhz_rtl.py` (`artifacts/kv260_pipelined_250mhz_rtl.csv`, `artifacts/kv260_pipelined_250mhz_meta.json`) résolvent les deux contraintes de conception physique identifiées dans l'audit non pipeliné (§4.24-§4.25) en insérant trois barrières synchrones de registres de pipeline à travers `Beneš-1` (`9` étages), `Copy + Beneš-2[0..3]` + lecture parallèle d'étiquette/page `RAMB36E2`, `Beneš-2[4..8]`, et `80 × LUT6` + voteur popcount replié sur `16` bits, encapsulés dans une enveloppe `AXI4-Stream` de `64` bits respectant le budget d'`IOB` (`clai_benes_axi_stream_250mhz_top`) :

| Variante RTL KV260 (`xck26-sfvc784-2LV-c`) | Étages (`CPI`) | Profondeur sync. reg-à-reg | `IOB` sup. (`<= 189`) | CLB LUT `xcup` (`%`) | Bascules `xcup` (`%`) | `RAMB36E2` (`%`) | `DSP48E2` | Parité flux Verilator |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `U1` `clai_benes_paged_hotswap_core` (`OOC` `1` cyc) | `1` (`1.00`) | `52` niveaux | `1,600` (`No`) | `41,186` (`35.17%`) | `36,464` (`15.57%`) | `81` (`56.25%`) | `0` | `100.0%` |
| `U2` `clai_kv260_axi_top` (`AXI4` Échelon 0 non pipeliné) | `1` (`1.00`) | `60` niveaux | `127` (`Yes`) | `67,366` (`57.52%`) | `16,619` (`7.09%`) | `4` (`2.78%`) | `0` | `100.0%` |
| **`P4` `clai_benes_paged_pipelined_250mhz` (`OOC`)** | **`4` (`1.00`)** | **`13` niveaux (`4.00×`)** | `1,600` (`OOC`) | **`41,439` (`35.38%`)** | **`47,922` (`20.46%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |
| **`P4-AXIS` `clai_benes_axi_stream_250mhz_top` (Référence)** | **`5` (`1.00`)** | **`13` niveaux (`4.62×`)** | **`170` (`Yes`)** | **`41,459` (`35.40%`)** | **`48,979` (`20.91%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |

Le parcours de graphe à travers les frontières synchrones aplaties de `synth_xilinx -family xcup` (`FDRE`/`RAMB36E2`/`IBUF` vers `FDRE`/`RAMB36E2`/`OBUF`, en excluant les chaînes multi-cycles de compteurs de télémétrie `CARRY4` que `ltp -noff` de Yosys traverse via les broches d'horloge boîte noire des `FDRE`) établit que la profondeur combinatoire par cycle diminue d'un facteur **`4.00×`**, passant de `52` niveaux (`60` dans `U2`) à **`13` niveaux** pour un surcoût de seulement `+253` LUT CLB (`+0.21%` du `xck26`), respecte le budget de broches du boîtier `xck26-sfvc784-2LV-c` (**`170 <= 189` `IOB`**), et valide **`256 / 256` battements consécutifs sans bulle (`CPI = 1.00`, `0` erreur)** sous Verilator `5.054`.

<div id="417-claim-la-17-bounded-open-weights-rung-3d-native-think-ceiling-9167-overall-9375-wave-2-and-wave-3-000-broken-commits" class="anchor-alias" aria-hidden="true"></div>

### 4.17 Affirmation LA-17 : plafond natif `<think>` borné à poids ouverts de l'`Échelon 3d` (`91.67%` au global, `93.75%` en Vague 2 et Vague 3, `0.00%` de validations défectueuses)

`scripts/run_rung3d_thinking_ceiling.py` (`artifacts/frontier_ai_rung3d_ceiling.csv`, `artifacts/frontier_ai_rung3d_ceiling_traces.json`) ajoute un **échelon optionnel de raisonnement borné à poids ouverts `Rung 3d`** (`Qwen/Qwen3.6-35B-A3B` avec `enable_thinking=True` natif, budget de `1,536-2,200` tokens `<think>`, poids locaux `100%` sous licence Apache-2.0, zéro API cloud propriétaire) invoqué strictement sur les tâches résiduelles où les `Rungs 0-3c` s'abstiennent à travers le banc d'essai d'ingénierie à `48` tâches (`16` spécifications × `3` vagues) :
- **`Bras H` (`MoL + Rung 3d Qwen3.6-35B-A3B <think>`)** élève le taux de réussite vérifié de `87.50%` (`Bras G`) à **`87.50%` en W1 Froid, `93.75%` (`15 / 16`) en W2 Adaptation, `93.75%` (`15 / 16`) en W3 Chaud et `91.67%` (`44 / 48`) au global** (**`+14.59` points de pourcentage** au-dessus des `77.08%` de `Qwen3.6-35B-A3B` autonome), tout en n'appelant `35B` que sur `20.83%` des tâches (`Rung 3d` `<think>` s'éveille sur **`5 / 48 = 10.42%`** des tâches).
- Plus précisément, `Rung 3d` dérive un solveur vérifié de permutation `4×4` de Waksman à `6` commutateurs sur `W2_11_F11_benes4_route` en `2,185` tokens `<think>` et le compile dans `Skill#17`, rejouant `W3_11` en `< 3.8 ms` (`0.0351 J` de `reported_j` moyen sur les `15` résolutions cristallisées de Vague 3), tandis que `F10_true_damerau` (conflit d'a priori entre `OSA` et la `DP` sur alphabet sans restriction de Lowrance-Wagner) déclenche `VERIFIER_ABSTAIN_SAFE` (`0.00%` de validations défectueuses admises).

<div id="418-claim-la-18-zero-python-cross-platform-rust-burn-0221--cubecl-fused-int4-sparse-moe--gateddeltanet-kernels" class="anchor-alias" aria-hidden="true"></div>

### 4.18 Affirmation LA-18 : noyaux fusionnés `INT4` Sparse-MoE et `GatedDeltaNet` multiplateformes sans Python en Rust `Burn 0.22.1 / CubeCL`

`sys/rust/src/kernels/q4_moe_deltanet_cube.rs` et `sys/rust/src/bin/bench_cubecl_moe_deltanet.rs` (`artifacts/cubecl_cross_platform_moe_deltanet.csv`, `artifacts/cubecl_cross_platform_moe_deltanet_meta.json`) portent les shaders fusionnés Sparse-MoE `INT4` par blocs de 64 (`q4_moe_gate_up_silu_cube_kernel` + `q4_moe_down_weighted_cube_kernel`, dépaquetage en registres de 8 quartets `u32` sans aucun tampon de poids d'experts `FP16`/`FP32`) et `GatedDeltaNet` (`gated_delta_recurrent_k128_cube_kernel`) vers des **noyaux `#[cube]` en Rust pur sous `Burn 0.22.1 / CubeCL`**, ciblant `Metal`, `Vulkan` (`SPIR`-V), `CUDA` (`PTX`), `ROC`m (`HIP`) et `CPU` `SIMD` `LLVM` à partir d'une base de code unique :

| Noyau portable Rust `Burn 0.22.1 / CubeCL` et forme | Cible matérielle | Latence moyenne (`ms`) | Accélération vs hôte `FP32` | Erreur abs. max `FP32` | Cibles de shaders portables |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `Host_Scalar_FP32_Ref` | `27.2480 ms` | `1.00×` | `0.0` | Rust `std` |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `CubeCL_LLVM_CPU` | `10.2213 ms` | **`2.67×`** | `1.49 × 10⁻⁷` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`)** | **`CubeCL_Metal_GPU`** | **`0.7765 ms`** | **`35.09×`** | **`1.79 × 10⁻⁷`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `Host_Scalar_FP32_Ref` | `166.8918 ms` | `1.00×` | `0.0` | Rust `std` |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `CubeCL_LLVM_CPU` | `11.2224 ms` | **`14.87×`** | `1.49 × 10⁻⁸` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`)** | **`CubeCL_Metal_GPU`** | **`2.4118 ms`** | **`69.20×`** | **`2.24 × 10⁻⁸`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |

<div id="419-claim-la-19-six-kernel-paranoid-formal-proof-verification-of-section-2-27-theorems-66-independent-kernels-cve-2026-72844-hardened" class="anchor-alias" aria-hidden="true"></div>

### 4.19 Affirmation LA-19 : vérification formelle paranoïaque à six noyaux des preuves de la Section 2 (`27` théorèmes, `6/6` noyaux indépendants, durcie contre `CVE-2026-72844`)

Entre juillet et novembre 2026, les divulgations portant sur la cohérence logique et le rejeu `.olean` dans Lean 4 - `CVE-2026-72844` (`leanprover/lean4#14576`, paramètres fantômes sur des types inductifs imbriqués combinés à une confusion de projection de structure `.proj` `CWE-843` dans `<= v4.31.0`, rendue publique via un dépôt de réfutation de Collatz assistée par intelligence artificielle et corrigée par la `FRO` Lean dans `v4.32.2`), `CVE-2026-72711` (`leanprover/lean4#14484`, absence de vérification des variables locales dans `add_opaque`), omission d'entrées `.inductInfo` falsifiées par `Kernel.Environment.replay` (`#16688`), discordances entre fichiers compagnons `.olean.server` et rejeu (`#16674`, `#16675`), et contournements par apprentissage par renforcement via `native_decide` (`Lean.ofReduceBool` `FFI`, `#16693`) - ont montré que l'assurance formelle ne doit pas reposer sur un unique vérificateur C++ ni sur un rejeu `.olean` non confiné. `proofs/` (`LutAdapt/{Cascade,BenesCopy,JointMinterm,ConformalProvenance}.lean`) et `scripts/verify_lean_proofs.py` (`artifacts/lean4_formal_proofs_summary.csv`, `artifacts/lean4_six_kernel_paranoid_audit.csv`, `artifacts/lean4_formal_proofs_meta.json`) imposent zéro `sorry`, zéro `axiom` personnalisé, zéro `opaque`, zéro inductif imbriqué et zéro `Lean.ofReduceBool`, compilent proprement sous **Lean `4.36.0`** (`1,041.55 ms`, `0.3236 J` `reported_j` Darwin), et valident **`lake check --paranoid`** à la fois sur Apple Silicon (`175,798.92 ms`, `77.7477 J` `reported_j` Darwin) et dans un espace de noms Linux `bubblewrap 0.11.1` (`bwrap`) non privilégié, en lecture seule et isolé du réseau (`237,823.64 ms`, `1,461.62 J` cœur / `22,371.48 J` package `RAPL` `reported_j`, archivé dans `openie-research-experiments/lut-adapt-bwrap-paranoid/` au commit `1f50db59`) à travers **les six noyaux indépendants** (Figure 6) :

| Module Lean `4.36.0` (`proofs/LutAdapt/`) | Théorèmes vérifiés | Couverture de la Section 2 | `sorry` / Perso. / `ofReduceBool` | Empreinte d'axiomes (`#print axioms`) |
| :--- | :---: | :--- | :---: | :--- |
| **`Cascade.lean`** | `7` | Échanges adjacents et préfixes de Simon-Kadane (`p₁/c₁ > p₂/c₂`), gain net de la Proposition 1 et horizon $\Delta T^*$, refus d'agitation à taux de succès nul | `0` / `0` / `0` | `3` sans choix (`propext`, `Quot.sound`) ; `4` `ZFC` standard |
| **`BenesCopy.lean`** | `7` | Théorème 2 `512×512` Beneš-Copy-Beneš (`43` étages, `11,008` bits de commutateurs), partition à `4` étages `<= 13` niveaux, intervalles de copie disjoints, non-contention modulo de Lee | `0` / `0` / `0` | **`2` purement constructifs (`0` axiome)** ; `5` sans choix |
| **`JointMinterm.lean`** | `7` | Dominance de la Proposition 3, garantie dans le support, témoin de chimère marginale `(40,35,25)`, bijection de rafale `BPE` `uint64` (`K=4` `LFM2`, `K=3` `LFM3`/`Qwen3.6`) | `0` / `0` / `0` | **`1` purement constructif (`0` axiome)** ; `6` sans choix |
| **`ConformalProvenance.lean`** | `6` | Abstention sur demi-droite hors variété du Résultat 4, borne conforme à échantillon fini, équilibre `ACI`, treillis de provenance (`ModelGenerated ↛ Deterministic`), parité spéculative gloutonne | `0` / `0` / `0` | **`2` purement constructifs (`0` axiome)** ; `4` sans choix |
| **Total (`LutAdapt.lean`, Référence)** | **`27`** | **Les `4` résultats de la Section 2 + corollaires matériels et de provenance** | **`0` / `0` / `0`** | **`5` sans axiome ; `23/27` sans choix ; `6/6` noyaux acceptent** |

| Vérificateur de preuves indépendant (`lake check --paranoid`) | Implémentation et fondement de cohérence | Décl. vérifiées | Verdict | Classes de vulnérabilités atténuées |
| :--- | :--- | :---: | :---: | :--- |
| **`con-leche --verified`** | Noyau minimal de référence (Breitner) formellement prouvé cohérent dans la théorie des ensembles `ZFC` (ne peut pas accepter `False`) | `58,683` | **`Accepts`** | `CVE-2026-72844` (`.proj` inductif imbriqué), `CVE-2026-72711` (`add_opaque`), bogues de cache `WHNF` |
| **`con-ron --verified`** | Raffinement Rust de `con-leche` vérifié avec *Aeneas* | `58,683` | **`Accepts`** | `CVE-2026-72844`, `CVE-2026-72711`, bogues mémoire C++ et grands entiers `GMP` (`#14833`) |
| **`lean4lean`** | Vérificateur de types `CIC` indépendant Lean-en-Lean (Carneiro) | `58,685` | **`Accepts`** | Divergence d'implémentation du noyau C++ et typage des projections |
| **`nanoda`** | Vérificateur d'export Rust autonome sans exécutif Lean (`sorryAx` bloqué) | `58,685` | **`Accepts`** | Altération de sérialisation `.olean` et `sorryAx` non autorisé |
| **`leanchecker --paranoid`** | Rejeu du noyau C++ en environnement vierge sans aucune confiance envers les tactiques | `58,685` | **`Accepts`** | Mutation d'environnement par métaprogrammation et `debug.skipKernelTC` |
| **`Lean v4.36.0` (défaut)** | Noyau C++ post-`CVE` de novembre 2026 (`#print axioms` imposé) | `58,685` | **`Accepts`** | Toutes les `CVE` d'été/automne 2026 corrigées ; `0` `Lean.ofReduceBool` |

![Figure 6. Assurance formelle à six noyaux et pile compilée à trois couches.](/figures/lut-adapt/six-kernel-trust-and-stack.svg)

*Figure 6. Audit formel paranoïaque des preuves à six noyaux (`Affirmation LA-19`, à gauche) et pile compilée à trois couches couvrant le RTL `LUT6` à gating `CE`, la compilation descendante `MoL` et le serveur `MCP` Rust à binaire unique (`Affirmation LA-23`, à droite). [PNG](/figures/lut-adapt/six-kernel-trust-and-stack.png) · [Explorateur interactif](/living/lut-adapt/#la-tab-01).*

<div id="420-claim-la-20-multi-repository-upstream-swe-bench-verified-4-repositories-24-git-worktree-evaluations-with-multi-window-ast-call-graph-localization" class="anchor-alias" aria-hidden="true"></div>

### 4.20 Affirmation LA-20 : `SWE-bench Verified` amont multi-dépôts (`4` dépôts, `24` évaluations en arbre de travail git) avec localisation par graphe d'appels `AST` multi-fenêtres

`src/clai/frontier/multirepo_swebench.py` et `scripts/run_multirepo_swebench_benchmark.py` (`artifacts/multirepo_swebench_verified.csv`, `artifacts/multirepo_swebench_verified_traces.json`) étendent l'évaluation sans fuite de solution de référence sur `princeton-nlp/SWE-bench_Verified` (`SHA`-256 `a45b1fe4...`) à **`4` dépôts Python amont distincts** (`django/django` [`4`], `pytest-dev/pytest` [`3`], `psf/requests` [`2`] et `sympy/sympy` [`3`] × `2` vagues = **`24` évaluations isolées sous `git worktree`**), en ajoutant un **localisateur par graphe d'appels `AST` multi-fenêtres** qui parcourt les arêtes intra-fichier `ast.Call` (`helper(...)` / `self._helper(...)`) pour extraire `2` fenêtres `AST` sans chevauchement (`91.67%` [`11/12`] de localisation exacte du fichier de référence sans aucun accès à `patch`, `apple_pmu_system_energy_delta_j = 60,935.10 J`) :

| Bras multi-dépôts `SWE-bench Verified` (`4` dépôts, `24` évals) | W1 Froid | W2 Rétroportage | Réussite vérifiée globale | `django` / `pytest` / `requests` / `sympy` | Correctifs cassés | Voie rapide `.mol/` W2 | Moyenne W1 / W2 (`ms`) | `reported_j` / Correctif vérifié |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (`1`-Shot) | `0.00%` | `8.33%` | `4.17%` | `0%` / `0%` / `0%` / `17%` | `95.83%` | `0.00%` | `6,197` / `6,481` | `2,294.45 J` |
| `B` `google/gemma-4-E2B-it` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `10,630` / `7,359` | `845.34 J` |
| `C` `Qwen/Qwen3.6-35B-A3B` Metal (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `32,912` / `28,165` | `4,558.58 J` |
| `D` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `26,247` / `25,693` | `3,439.64 J` |
| **`E` Agent `MoL` `MCP` multi-dépôts (Référence)** | **`16.67%`** | **`25.00%`** | **`20.83%` (`2.50×`)** | **`25%` / `0%` / `50%` / `17%`** | **`0.00%`** | **`16.67%` (`100%` de W1)** | **`184,906` / `55,254`** | **`12,176.51 J` (`1.12-5.50 J` succès W2)** |

Sur `django`, `pytest`, `requests` et `sympy`, chaque modèle autonome à `1` passe (`LFM3-1.7B`, `Gemma-4-E2B`, `Qwen3.6-35B-A3B` et `Devstral-Small-2-24B`) plafonne entre `4.17%` et `8.33%` de réussite vérifiée et admet **`91.67%-95.83%` de correctifs défectueux** (agrégation `ORM`, mécanismes internes de fixtures `pytest`, traitement d'`URL` proxy `IDNA`). L'agent `MoL` `MCP` multi-dépôts atteint **`20.83%` au global (`25.00%` en Vague 2, soit `2.50×` les modèles autonomes `24B` et `35B`)** sur **`3` des `4` dépôts** (`django__django-17029` via `Gemma-4-E2B` rejoué en **`2,028.24 ms` / `5.50 J`** via `MCP_Rung0_BenesLUT6->GitDiffSkill#1` ; `psf__requests-6028` via `Rung 3d Qwen3.6-35B <think> CxRepair` rejoué en **`592.87 ms` / `1.12 J`** via `GitDiffSkill#2` là où `0%` des modèles autonomes à `1` passe ont réussi ; et `sympy__sympy-24213` via `Rung 2 LFM3-1.7B`), en admettant **`0.00%` de correctifs défectueux**.

<div id="421-claim-la-21-measured-120b-scale-open-weights-hybrid-mamba-attention-sparse-moe-nvidianemotron-3-super-120b-a12b--devstral-small-2-24b-apex-cascade" class="anchor-alias" aria-hidden="true"></div>

### 4.21 Affirmation LA-21 : cascade sommitale mesurée à l'échelle `120B` avec MoE parcimonieux hybride Mamba-Attention à poids ouverts (`nvidia/Nemotron-3-Super-120B-A12B`) et `Devstral-Small-2-24B`

`src/clai/frontier/frontier_120b_hybrid_moe.py` et `scripts/run_120b_hybrid_moe_benchmark.py` (`artifacts/frontier_120b_hybrid_moe_apex.csv`, `artifacts/frontier_120b_hybrid_moe_apex_traces.json`) remplacent la réserve de projection `70B+` de la Section 6 par l'exécution locale directe de **`nvidia/Nemotron-3-Super-120B-A12B`** (`120B` paramètres totaux / `12B` actifs en MoE parcimonieux hybride Mamba-Attention, `GGUF` `Q3_K_S` en 2 fragments de `56.9 GiB`) et de **`Devstral-Small-2-24B-Instruct`** (spécialiste `SWE` dense de `24B`, `GGUF` `Q4_K_M`) sur Apple M5 Max (`128 GiB` de mémoire unifiée) via `llama-server` sous Metal, en enregistrant `ri_resident_size` (`RSS`) enfant, `ri_phys_footprint`, `ri_energy_nj` `L3` enfant (`buf[42]`) et `GPU Energy` `IOReport` `L2` sur les `8` spécifications adversariales les plus difficiles × `2` vagues (`16` évaluations, dont `BigCodeBench/6`, `BigCodeBench/8`, `F10_true_damerau` et `F11_benes4_route`) :

| Bras frontière `24B` / `120B` mesuré (`16` évals difficiles) | Paramètres (actifs) | `RSS` résidente crête | `tok/s` moyen | W1 Dur-`8` | W2 Chaud | Réussite globale | Commits cassés | Voie rapide `.mol/` W2 | Moyenne W1 / W2 (`ms`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `24.0B` (`24.0B`) | `16,797.3 MB` | `22.37` | `37.50%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `20,734` / `17,890` |
| `B` `nvidia/Nemotron-3-Super-120B-A12B` (`1`-Shot) | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `21,831` / `23,205` |
| **`C` Cascade sommitale `MoL` `24B+120B` (Référence)** | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | **`62.50%`** | **`62.50%`** | **`62.50%`** | **`0.00%`** | **`62.50%` (`100%` de W1)** | **`53,493` / `19,642` (`5.5-70 ms` `.mol/`)** |

Parce que `Nemotron-3-Super-120B-A12B` active `12B` paramètres MoE Mamba-Attention par token (`50%` de poids actifs en moins que le modèle dense `24B`), il maintient **`22.17 tok/s`** dans `58.08 GB` de mémoire unifiée résidente (`9.67 GB` d'empreinte anonyme `KV`/`SSM`), égalant la vitesse de décodage du `24B` dense à une échelle totale de paramètres `5×` supérieure. L'association de `BenesLUT6` + `.mol/` + l'escalade par contre-exemple $C(z)$ à travers `Devstral-2-24B` et `Nemotron-3-120B-A12B` porte le taux de réussite vérifié à **`62.50%` (`+18.75` points de pourcentage au-dessus de `120B-A12B` autonome, `2.00×` le `24B` autonome)**, résout `BigCodeBench/8` (`W1_09_BigCodeBench_8_complete`), et rejoue les `5` compétences cristallisées en Vague 2 en **`5.49-69.76 ms` (`0.0118-0.0272 J` `reported_j`)** contre `10,092-40,905 ms` sur `120B` autonome (`0.00%` de validations défectueuses ; une fenêtre `W3_10` de `42.7 s` a subi un débordement d'accumulateur `IOReport` du système d'exploitation `OS` avant le resserrement du seuil de garde `TDP` de `joule_meter.py` de `450 W` à `175 W`, conservée telle quelle dans le `CSV`).

<div id="422-claim-la-22-clock-enable-ce-gated-250-mhz-p4-axis-kria-kv260-xck26-verilator-vcd-dynamic-power-audit-410-idle--269-packet-shift-reduction" class="anchor-alias" aria-hidden="true"></div>

### 4.22 Affirmation LA-22 : audit de puissance dynamique `VCD` Verilator à `250 MHz` avec activation d'horloge (`CE`) contrôlée pour `P4-AXIS` sur Kria KV260 (`xck26`) (réduction de `4.10×` au repos et de `2.69×` en décalage de paquets)

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv` (`ENABLE_CE_GATING = 1`) et `scripts/verify_ce_gated_vcd_power.py` (`artifacts/kv260_ce_gated_vcd_power.csv`, `artifacts/kv260_ce_gated_vcd_power_meta.json`) implémentent l'optimisation de gating d'horloge `ENARDEN` identifiée au §4.25 directement dans la conception `P4-AXIS` à `4` étages et `250 MHz` (`clai_uram_lut6_page_cache_ce` + gating des bulles de validité `FDRE` `S1..S4`), évaluée par extraction des transitions `VCD` sous `Verilator 5.054 --trace` + `AMD DS925` (`xck26`, `VCCINT = 0.72 V`, `250 MHz`, classe `est_j`) :

| Variante `P4-AXIS` `xck26` (`13` niveaux, `170` `IOB`, `81` `RAMB36E2`) | Charge (`Cycles`, taux de consultation) | Transitions de signaux `VCD` / cyc | `pJ / cyc` est. | `mW` dynamiques est. à `250 MHz` (`[Bas, Haut]`) | Réduction de puissance vs sans gating | Parité Verilator (`320` battements) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `idle_quiescent_256` (`0.0%`) | `0.07` | `255.96 pJ` | `63.99 mW` (`[48.00, 82.22]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Référence)** | **`idle_quiescent_256` (`0.0%`)** | **`0.07`** | **`62.37 pJ`** | **`15.59 mW` (`[10.34, 21.88]`)** | **`4.10×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `axis_beat_shift_512` (`12.5%`) | `3,852.19` | `278.47 pJ` | `69.62 mW` (`[51.84, 90.10]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Référence)** | **`axis_beat_shift_512` (`12.5%`)** | **`1,413.22` (`2.73×` moins)** | **`103.35 pJ`** | **`25.84 mW` (`[18.06, 35.00]`)** | **`2.69×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `zero_bubble_burst_256` (`100.0%`) | `12,134.41` | `392.20 pJ` | `98.05 mW` (`[72.38, 127.68]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Référence)** | **`zero_bubble_burst_256` (`100.0%`)** | **`4,451.65` (`2.73×` moins)** | **`374.15 pJ`** | **`93.54 mW` (`[69.76, 120.44]`)** | **`1.05×`** | **`100.0%`** |

L'ajout du gating `ENARDEN` et des bulles de validité `CE` n'ajoute que `+9` LUT CLB (de `41,456` à `41,465`, `0` bascule supplémentaire, conservant **`13` niveaux logiques synchrones** et **`170 <= 189` `IOB`**), préserve **`320 / 320` (`100.0%`) de parité de sortie exacte au bit près** entre `CE=0` et `CE=1`, et réduit la puissance dynamique au repos d'un facteur **`4.10×`** (de `63.99` à **`15.59 est_mW`**) ainsi que la puissance d'ingestion de paquets `AXI4-Stream` sur `64` bits (taux de consultation de `1` sur `8`) d'un facteur **`2.69×`** (de `69.62` à **`25.84 est_mW`**).

<div id="423-claim-la-23-zero-python-single-binary-native-rust-mol-agent-rs-server-0154-msreq-mcp-1721-faster-than-python-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.23 Affirmation LA-23 : serveur natif Rust à binaire unique sans Python `mol-agent-rs` (`0.154 ms/req` `MCP`, `17.21×` plus rapide que `mol-agent` Python)

`sys/rust/src/bin/mol_agent.rs` (`artifacts/rust_mol_agent_server_bench.csv`, `artifacts/rust_mol_agent_server_meta.json`) compile un binaire natif autonome en Rust (`cargo run --release --bin mol_agent`) avec **zéro interpréteur Python ni dépendance `HTTP` tierce**, servant directement OpenAI `GET /v1/models`, REST + `SSE` `POST /v1/chat/completions` et `MCP` `JSON-RPC 2.0` (`POST /mcp` + `--mcp-stdio`) sur `.mol/skills_v1.json` (`17` compétences cristallisées) + vérification `CubeCL_Metal_GPU` sous `Burn 0.22.1 / CubeCL` + télémétrie Darwin `proc_pid_rusage(RUSAGE_INFO_V6)` `ri_energy_nj` (`words[42]`) :

| Point de terminaison local de l'agent (boucle locale) | Pile d'exécution | Latence moyenne (`ms/req`) | Accélération vs `MCP` Python | `reported_j / req` Darwin `L3` | Zéro dép. Python |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `MCP` `mol_lookup_crystallized_skill` (`Python`) | Python `3.13` `http.server` | `2.6503 ms` | `1.00×` | `0.000450 J` | `false` |
| **`MCP` `mol_lookup_crystallized_skill` (Référence)** | **Rust `1.100` `std::net` + `BenesLUT6`** | **`0.1540 ms` (`154.0 µs`)** | **`17.21×`** | **`0.000272 J`** | **`true`** |
| **OpenAI `POST /v1/chat/completions` (Référence)** | **Rust `1.100` `std::net` + `BenesLUT6` (REST+`SSE`)** | **`0.1504 ms` (`150.4 µs`)** | **`17.62×`** | **`0.000272 J`** | **`true`** |
| **`MCP` `mol_cubecl_gpu_verify` (Référence)** | **Rust `1.100` + `Burn 0.22.1` `CubeCL_Metal_GPU`** | **`0.9887 ms`** | - | **`0.000272 J` (`L3` `CPU`)** | **`true`** |

<div id="424-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.24 Décomposition complète des primitives du sous-système `xck26-sfvc784-2LV-c`, profondeur topologique et sonde matérielle `Vivado 2026.1`

Afin d'auditer à la fois le cœur spéculatif autonome de `512` pages (`clai_benes_paged_hotswap_core` dans `hw/kv260/rtl/clai_benes_hotswap_core.sv`) et le sous-système complet Rung-0 à bus AMBA `AXI4-Lite` + `AXI4-Stream` (`clai_kv260_axi_top` dans `hw/kv260/rtl/clai_kv260_axi_top.sv`, `clai_engram_streamer.sv`, `clai_rung0_hotswap_core.sv` et `artifacts/clai_rung0_kv260.v` au commit `a5e9bc1de280`, inchangé dans `91a2213`) face à la référence exacte AMD Kria KV260 (`xck26-sfvc784-2LV-c` : `117,120` LUT CLB, `234,240` bascules CLB, `144` blocs `RAMB36E2`, `64` blocs UltraRAM de 288 Kbit (`URAM288`), `1 248` tranches de traitement du signal UltraScale+ (`DSP48E2`) et `189` blocs d'entrée/sortie utilisateur (`IOB`)), trois vérifications matérielles et de conception assistée par ordinateur pour l'électronique (`EDA`) ont été exécutées sur une station de travail Intel Core i9-13900H (Linux 7.0.0-43-generic x86-64) :

1. **Sonde JTAG (Joint Test Action Group) et USB (Universal Serial Bus) en lecture seule (`Xilinx hw_server v2026.1` + outil en ligne de commande Xilinx Software (`XSDB`))** : Bien que `lsusb` ait signalé un pont FTDI (Future Technology Devices International) `0403:6010` (circuit intégré `FT2232C/D/H` à double émetteur-récepteur asynchrone universel (`UART`) / mémoire tampon premier entré, premier sorti (`FIFO`)) raccordé, l'inspection des chaînes de fabricant et de produit USB du sous-système `sysfs` de Linux (`idVendor = 0403`, `idProduct = 6010`) a identifié le périphérique comme `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"`, et non comme une carte porteuse Kria KV260. L'interrogation de `hw_server v2026.1` (build du 29 mai 2026) via `xsdb` (`connect; jtag targets; targets`) a renvoyé **`0` périphérique JTAG Xilinx et `0` cible de port d'accès au débogage (`DAP`)** (`board_metered = false`, `measured_j = None`).
2. **Synthèse par lots `Vivado 2026.1` et verrou de licence (`SW Build 6511674`)** : Un script par lots non projet, à faible empreinte et reproductible (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, ciblant `xck26-sfvc784-2LV-c` à `250.0 MHz` / `4.000 ns` en mode hors contexte (`OOC`)) a été préparé pour `/tools/Xilinx/2026.1/Vivado/bin/vivado`. Le lancement de `vivado v2026.1` en mode par lots s'est interrompu avant `synth_design` (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`), car `Vivado 2025.1+` / `2026.1` d'AMD exige un fichier `.lic` Standard/Enterprise généré par l'utilisateur (`~/.Xilinx/Xilinx.lic` ou `XILINXD_LICENSE_FILE`), même pour les composants `xck26` de niveau Standard, et aucun fichier `.lic` n'était installé sur la station de travail. Conformément aux règles de mesure strictes, le `WNS` après routage, la fréquence d'horloge maximale après placement et routage, ainsi que `report_power` en mode sans vecteurs (`est_j`) restent consignés à `not_available` tant qu'un fichier `.lic` Standard n'a pas été fourni.
3. **Décomposition en primitives `xcup` du sous-système UltraScale+ complet, budget d'`IOB` et audit topologique des niveaux logiques (`Yosys 0.71+`)** : La synthèse de `clai_benes_paged_hotswap_core` et de `clai_kv260_axi_top` via `synth_xilinx -family xcup` et `ltp -noff` (en consignant strictement le `reported_j` du `RAPL package-0` de l'hôte comme coût de compilation `EDA` `x86-64` $E_{\text{compile}}$, et jamais comme puissance du silicium FPGA) a permis d'établir le nombre exact de cellules et les profondeurs combinatoires du chemin critique :

| `xck26-sfvc784-2LV-c` Module cible | LUT CLB (`% xck26`) | Primitives LUT dominantes | Registres CLB (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | Ports supérieurs (`IBUF`+`OBUF`) | Profondeur combinatoire (`ltp`) | Synthèse hôte `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` pages) | **`41 185`** (`35,17 %`) | `19 982 LUT3`, `7 804 LUT6`, `7 714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36 464`** (`15,57 %`) | **`81`** (`56,25 %`) | **`0`** | `1 599` (`OOC` / bus interne) | **`81` niveaux** | `7 297,3 J` (`144,8 s`) |
| **`clai_kv260_axi_top`** (sous-système `AXI4` Rung-0) | **`67 366`** (`57,52 %`) | `25 557 LUT6`, `25 333 LUT5`, `7 918 LUT3`, `569 CARRY4` | **`16 619`** (`7,09 %`) | **`4`** (`2,78 %`) | **`0`** | `126` (`<= 189` `IOB` ; `PS-PL`) | **`73` niveaux** | `10 089,4 J` (`214,8 s`) |

Deux contraintes concrètes de conception physique émergent de la primitive `xcup` et de l’audit `ltp` :

- **Confinement du budget de broches (`OOC` vs. wrapper `PS-PL` `AXI`)** : parce que `clai_benes_paged_hotswap_core` expose le `CodeBitBus` brut de `512` bits et les vecteurs larges de configuration fantôme (`1 379` tampons d’entrée (`IBUF`) + `220` tampons de sortie (`OBUF`) = `1 599` ports contre `189` `IOB` de boîtier sur `xck26-sfvc784-2LV-c`), l’implémentation autonome du fournisseur doit s’exécuter avec `synth_design -mode out_of_context` ou à l’intérieur d’un wrapper `AXI4-Stream` / `zynq_ultra_ps_e` tel que `clai_kv260_axi_top` (`126` ports, `57,52 %` d’utilisation de LUT).
- **Profondeur combinatoire non pipelinée (`81` et `73` niveaux) contre fermeture à `250 MHz` (`4,000 ns`) sur `-2LV`** : bien que Verilator `5.054` vérifie un `CPI = 1,0` (`1` consultation par cycle d’horloge) cycle-exact, la traversée de `17` étages `Beneš-1` + `9` étages de copie de préfixe + `17` étages `Beneš-2` + multiplexage dynamique de tables de vérité `LUT6` + réduction majoritaire à `5` votants en un seul cycle combinatoire couvre **`81` niveaux primitifs** (`73` niveaux par module hiérarchique dans le popcount combinatoire à `64` entrées et le comparateur de marge à `8` classes de `clai_kv260_axi_top`). La fermeture à `250 MHz` (`4,000 ns`) post-placement-et-routage sur du silicium basse tension (`0,72 V`) `-2LV` favorise donc l’insertion d’étages de registres pipeline à travers $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ et la compression de la réduction popcount sur `64` fils (implémentée dans l'`Affirmation LA-16` ci-dessus et quantifiée analytiquement au §4.25).

<div id="425-gate-level-xcup-primitive--verilator-vcd-switching-activity-datasheet-audit-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.25 Primitif `xcup` Niveau-gate & Audit de la Fiche Technique d'Activité de Commutation `Verilator` `VCD` (`est_j`)

Parce que AMD `Vivado 2026.1` était bloqué par un fichier `.lic` manquant et `0` cartes physiques `xck26` étaient attachées (§4.24), un tracé `Verilator 5.054` `--trace` pré-enregistré et un audit `Yosys 0.71+` aplati `synth_xilinx -family xcup` (`PREREG_xck26_vcd.json`, SHA-256 `c64505d177515c47…`) ont extrait les transitions de signaux exactes par cycle depuis `openIE-dev/lut-adapt-ai` (`af152ba`, inchangé dans `91a2213`) à travers quatre phases opérationnelles (`idle_quiescent`, `steady_lut6_eval_2048_cycles`, `single_cycle_page_switch_512_burst` et `shadow_page_stream_write`, `0` erreurs de co-simulation sur `3 072` recherches paginées et tous les rafales de paquets `AXI4-Lite`/`AXI4-Stream`). Tous les nombres de puissance et d’énergie dans cette sous-section sont strictement une estimation analytique de commutation dynamique (**`est_j` / `est_pJ/cycle` / `est_mW`**, **`measured_j = None`**, **`reported_j = None`**, **`board_metered = false`**), excluant les fuites statiques du silicium et ne remplaçant jamais un `Vivado report_power` placé-et-routé ou les lectures de rails KV260 `INA260`.

La synthèse aplatie `xcup` mappe `clai_benes_paged_hotswap_core` (`512` pages) à **`41 623` CLB LUTs** (`35.54 %` de `xck26`, contre `41 185` hiérarchiques §4.24 ; `19 982 LUT3`, `7 853 LUT6`, `7 738 LUT5`, `3 380 LUT4`, `2 670 LUT2`, `36 MUXF7`, `18 MUXF8`), `36 464` `FDRE` (`15.57 %`), et `81` `RAMB36E2` (`56.25 %`) sur `27 157` réseaux `VCD` uniques (`90 124` bits internes : `64 218` combinatoires, `20 767` séquentiels), et mappe `clai_kv260_axi_top` à **`66 881` CLB LUTs** (`57.10 %` de `xck26`, contre `67 366` hiérarchiques §4.24 ; `25 402 LUT6`, `25 313 LUT5`, `7 909 LUT3`, `5 303 LUT4`, `2 879 LUT2`, `75 LUT1`, `569 CARRY4` $\equiv$ `285 CARRY8`), `16 619` `FDRE`/`FDSE` (`7.09 %`), et `4` `RAMB36E2` (`2.78 %`) sur `3 825` réseaux `VCD` uniques (`128 486` bits internes : `108 582` combinatoires, `19 901` séquentiels). L’énergie de commutation dynamique à `VCCINT = 0.72 V` (`xck26-sfvc784-2LV-c`, `250.0 MHz`, limites `AMD DS925` / `XPE` 16 nm FinFET `[low, nom, high]`) modélise la logique commutée + les nœuds d’interconnexion locale à $C_{\text{node}} = [2.6, 4.5, 7.2]\text{ fF}$ ($\frac{1}{2} C V^2 = [0.674, 1.166, 1.866]\text{ fJ/transition}$, pondéré par `2.02` primitives `xcup` par bit combinatoire `VCD` dans le cœur Beneš), les broches d’horloge des `FDRE`/`FDSE` à `[1.5, 2.2, 3.0] fF` (`2` fronts/cycle = `1.141 fJ/FF/cycle` nominal) plus `[3.5, 5.5, 8.0] fF` par transition `Q`, et le `RAMB36E2` (`SDP` `64b`/`72b`) à `[2.90, 3.80, 4.80] pJ` par lecture d’adresse variable, `[1.90, 2.47, 3.12] pJ` par cycle d’activation d’adresse constante (`ENARDEN = 1`, $\alpha_{\text{addr}} = 0$), `[3.30, 4.30, 5.40] pJ` par écriture, et `[0.04, 0.08, 0.14] pJ/cycle` lorsqu’il est désactivé (`EN = 0`).

| Module cible & charge de travail `VCD` (`250 MHz`, `0.72 V`) | Cycles | Transitions combinatoires / Cyc ($\alpha_{\text{comb}}$) | Transitions séquentielles / Cyc ($\alpha_{\text{seq}}$) | `RAMB36E2` Utilisation (`Rd` / `Wr`) | Dynamique `est_pJ / cycle` | Dynamique `est_mW` (`[low, high]`) |
| :--- | ---: | ---: | ---: | :---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** · `idle_quiescent` | `256` | `0.00` (`0.0000`) | `0.00` (`0.0000`) | `100.0%` const-addr / `0%` | **`241.66`** (`53.74` CE-gated) | **`60.41`** (`[47.25, 76.21]`; `13.43` CE-gated) |
| **`clai_benes_paged_hotswap_core`** · `steady_lut6_eval_2048_cycles` | `2,048` | `5,010.21` (`0.0780`) | `90.97` (`0.0044`) | `100.0%` actif / `0%` | **`361.68`** | **`90.42`** (`[69.29, 116.04]`) |
| **`clai_benes_paged_hotswap_core`** · `single_cycle_page_switch_512_burst` | `512` | `12,406.84` (`0.1932`) | `269.46` (`0.0130`) | `100.0%` actif / `0%` | **`380.07`** | **`95.02`** (`[72.58, 122.60]`) |
| **`clai_benes_paged_hotswap_core`** · `shadow_page_stream_write` | `512` | `1,987.31` (`0.0310`) | `74.47` (`0.0036`) | `100.0%` lecture / `1.23%` écriture (`1/81`) | **`358.86`** | **`89.72`** (`[68.82, 114.89]`) |
| **`clai_kv260_axi_top`** · `idle_quiescent` | `256` | `0.00` (`0.0000`) | `0.00` (`0.0000`) | `0.0%` (`EN = 0`) / `0%` | **`19.55`** | **`4.89`** (`[3.26, 6.66]`) |
| **`clai_kv260_axi_top`** · `steady_lut6_eval_2048_cycles` | `2,048` | `120.31` (`0.0011`) | `15.27` (`0.0008`) | `3.12%` lecture / `0%` | **`20.40`** | **`5.10`** (`[5.04, 5.18]`) |
| **`clai_kv260_axi_top`** · `single_cycle_page_switch_512_burst` | `512` | `325.21` (`0.0030`) | `25.56` (`0.0013`) | `11.13%` lecture / `0%` | **`22.07`** | **`5.52`** (`[5.34, 5.75]`) |
| **`clai_kv260_axi_top`** · `shadow_page_stream_write` | `512` | `31.95` (`0.0003`) | `71.92` (`0.0036`) | `0.0%` lecture / `8.20%` écriture | **`21.80`** | **`5.45`** (`[5.30, 5.64]`) |

Trois constats de conception matérielle découlent directement de la décomposition de l'activité `VCD` et du modèle de retard `DS925` :

1. **Précharge inconditionnelle à vide des `RAMB36E2` via `ENARDEN` (`82.8%` de la puissance cœur au repos) et réduction `4.50×` par gating de `CE`** : bien que `clai_benes_paged_hotswap_core` présente `0.00` transition de données par cycle à l'arrêt, `clai_uram_lut6_page_cache` maintient `ENARDEN = 1'b1` en permanence sur les `81` blocs `RAMB36E2`, ce qui consomme `200.07 est_pJ/cycle` (`50.02 est_mW`) de précharge des lignes de bit, auxquels s'ajoutent `41.59 est_pJ/cycle` (`10.40 est_mW`) dans les feuilles d'horloge `FDRE` (**`60.41 est_mW`** au repos). À l'inverse, `clai_engram_streamer`, à l'intérieur de `clai_kv260_axi_top`, contrôle ses `4` blocs `RAMB36E2` par `accept_byte && s_axis_tlast` : il ne consomme que **`4.89 est_mW`** (`19.55 est_pJ/cycle`) à l'arrêt et **`5.10 est_mW`** lors de l'inférence en régime permanent de paquets `AXI4-Stream` de `31` octets (`core_bus_reg` verrouillé une fois par paquet, $\alpha_{\text{comb}} = 0.0011$). Conditionner `ENARDEN` de `clai_uram_lut6_page_cache` par `bus_valid` réduit la puissance dynamique du cœur paginé au repos d'un facteur **`4.50×`, soit `13.43 est_mW` (`53.74 est_pJ/cycle`)**, sans pénalité de latence.

2. **Amplification combinatoire des bascules de Beneš (`2.48×`) face à la puissance active dominée par les `RAMB36E2` (`+5.1%`)** : la commutation de `page_id` sur les `512` emplacements à des cycles d'horloge consécutifs (`single_cycle_page_switch_512_burst`) pilote simultanément les lignes `INIT` des `81 × 64 = 5,184` `LUT6` vers les arbres de sélection, ce qui porte les transitions combinatoires à `2.48×` (de `5,010.2` à `12,406.8` transitions/cycle, soit de `11.80` à `29.22 est_pJ/cycle`). Pourtant, la puissance dynamique totale du cœur paginé n'augmente que de `+4.60 est_mW` (de `90.42` à `95.02 est_mW`, soit `+5.1%`), car les lectures des amplificateurs de détection des `81 × RAMB36E2` (`307.80 est_pJ/cycle`) représentent `85.1%` à `80.9%` de l'énergie dynamique active (`358.86 est_pJ/cycle` soit `89.72 est_mW` pendant l'écriture concurrente `shadow_page_stream_write`).

3. **Audit du chemin critique aplati (`81` et `162` niveaux `ltp`) et budget de délai analytique `DS925` en `-2LV`** : en appliquant les délais primitifs de `AMD DS925` (`xck26-2LV`, `0.72 V`, soit `T_ILO = 0.068 ns`, `T_CKO = 0.148 ns`, `T_RCKO_DO = 1.390 ns` non pipeliné pour `RAMB36E2` contre `0.610 ns` avec `DOA_REG = 1`, plus un budget d'interconnexion de `[0.140, 0.220] ns/niveau`), le chemin non pipeliné de `81` niveaux de `clai_benes_paged_hotswap_core` atteint **`18.76-24.83 est_ns`** (`est_Fmax` analytique de `40.3-53.3 MHz`). L'aplatissement de `clai_kv260_axi_top` à travers les frontières de modules (`ltp -noff` après `-flatten`, contre `73` niveaux par module hiérarchique au §4.24) fait apparaître un chemin de **`162` niveaux** (**`34.77-46.92 est_ns`**, `21.3-28.8 MHz`) qui traverse `core_bus_reg` jusqu'à `clai_rung0_core` (`artifacts/clai_rung0_kv260.v`) et sa chaîne d'additionneurs série `pop_acc` déroulée sur `64` étapes. En activant `DOA_REG = 1` sur `RAMB36E2`, en insérant `4` à `5` coupures de registres de pipeline (`<= 18` niveaux logiques par étage, réalisé à `13` niveaux synchrones dans l'`Affirmation LA-16`) et en remplaçant la boucle de popcount série à `64` entrées par un compresseur `6` niveaux `LUT6`/Wallace, le délai analytique par étage descend sous **`3.7 est_ns` (`<= 4.000 ns` à `250 MHz`)** avec `CPI = 1.0` (`not` une clôture de timing Vivado post-PAR).

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Travaux connexes et observations de convergence

| Système | ID / Lieu de publication | Ce qui est établi | Coût rapporté | Différence dans cette référence |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Couches neuronales quantifiées et parcimonieuses compilées en LUT FPGA. | Synthèse LUT FPGA et Fmax. | Les câblages statiques nécessitent un re-PAR Vivado lors d'un décalage, contre `1` cycle pour Beneš + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Réseaux différentiables de portes booléennes et de LUT sans poids. | Nombre de portes et précision. | Le routage statique tombe à `52.34%` lors d'un décalage VLAN et souffre de chimères marginales de plans de bits. |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Produits matriciels ternaires ou à faible bit via recherche en table sur CPU/FPGA. | Latence et puissance FPGA. | Accélère l'algèbre linéaire à l'intérieur d'un rapport de modèle ; ne contourne pas l'invocation du modèle. |
| **LittleBit** (Lee et al., 2025) & **LittleBit-2** (Lee and Kim, 2026) | `arXiv:2506.13771` · `arXiv:2603.00042` | Factorisation latente binaire sub-1-bit (`0.1-0.58` bits/poids) via `SVD` / `ITQ` + QAT de `5` époques. | Compression (`11.6×-31×`), PPL et précision QAT. | Dépaquette les bitpacks vers des MAC binaires denses à l'exécution et tombe à `0.00%` sur le codage exact (`Claim LA-11`) ; `Sub1Bit-LUT6` utilise `0` MAC binaire et `MoL` restaure une parité de `100.0%` en `0` époque QAT. |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Cascades LLM du faible vers le fort et routeurs de préférences. | Prix API en dollars vs. qualité. | Ne dispose pas d'une porte déterministe $C(z)$ (`68.75%` de commits cassés dans `Claim LA-11`) et n'a pas de compilateur descendant `LUT6`. |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Routage multi-LLM par bandit et service à fréquence adaptative. | Wh GPU des auteurs (`Zeus` / `pyNVML`). | Optimise le service GPU ; cette référence compile les éveils en `LUT6` à `0` FLOP et en pages de compétences canoniques (`reported_j` / `est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Drafters spéculatifs à MLP neuronal, à arbre de brouillons et en cascade. | Accélération en temps réel. | Nécessitent des FLOP de brouillon et des lectures de poids, contre des pages `LUT6` `uint64` à `0` FLOP. |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Drafters n-gram du prompt et suffix-tries de datastore, sans FLOP. | Accélération de latence (`0` FLOP). | `PLD` manque les tokens hors prompt ; `REST` utilise des tries variables, contre des pages `RAMB36E2`. |
| **AirLLM** (lyogavin, 2023) | Streamer SSD open source | Streaming des poids SSD couche par couche dans une faible RAM. | Empreinte RAM active. | `T=1` pur (`1.0 tok/sweep`) + débordement KV, contre une réduction d'E/S `AirMoL` de `2.74×-12.30×` et une RAM Metal `INT4` de `970 MB`. |
| **Metered Commit Gates** & **RCE-JEPA** `[même maison]` | `/papers/gates/` · `/papers/rce-jepa/` | Portes de commit (lecture KV260 `INA260` SOM de `11,428 pJ`), MoL $p_i/c_i$ et `RCE-JEPA`. | KV260 SOM `measured_j` + `reported_j` / `est_j`. | Fondation de la même maison ; étendue ici par la compilation descendante Beneš `LUT6`, `Expert-AirMoL` sous Metal et `mol-agent`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. Limites, menaces à la validité, non revendiquées, et falsificateurs

**Validité interne et de construction.** Sous un bruit aléatoire uniforme ou un churn adversarial par étape ($\Delta T = 1$), la Proposition 1 ne donne aucune économie de compilation descendante et retombe à `1.00 tok/sweep`. La parité sans perte (`100.0%`) garantit un accord bit-pour-bit avec le décodage greedy cible sans relever le plafond de capacité d’un point de contrôle de base `350M` ou `0.8B`.

**Validité des mesures et non revendiqué.** Les nombres analytiques de joules et de puissance de commutation (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`, et les bornes `est_pJ/cycle` et `est_mW` issues de `Verilator` `VCD` + `AMD DS925` à `0.72 V` aux §4.22 et §4.25), les lectures de compteurs du système d'exploitation et sur puce (`reported_j` provenant d'Apple Silicon `L2` `libIOReport` `'GPU Energy'` + `L3` `proc_pid_rusage` `ri_energy_nj`, ainsi qu'un filtre de débordement de registre étroit resserré de `450 W` à `175 W`), et les deltas cumulatifs du `PMU` macOS de la machine entière sont maintenus strictement séparés des mesures physiques sur rails (`measured_j = None`). Yosys `0.71+` et Verilator `5.054` établissent la synthèse structurelle de netlist sur `xck26` (`41,465` LUT, `13` niveaux logiques par cycle et `170 <= 189` `IOB` dans `P4-AXIS` à gating `CE`), la parité `CE` `320/320`, la simulation au cycle près sans bulle `256/256` à `CPI = 1.00`, et la commutation dynamique `est_mW` fondée sur le taux de basculement `VCD` (`15.59 est_mW` au repos, hors fuites statiques), et non une clôture temporelle commerciale Vivado post-PAR à `250 MHz` ni des watts physiques sur les rails de la KV260 (`board_metered = false`). Le leadership énergétique sur silicium, la promotion des sorties `ModelGenerated` vers `Deterministic`, et l'évaluation conteneurisée complète des `500` tâches de `SWE-bench Verified` au-delà des `40` évaluations réelles en arbre de travail git amont sur `django/django`, `pytest-dev/pytest`, `psf/requests` et `sympy/sympy` (`Affirmations LA-15, LA-20`), du benchmark contractuel à `48` tâches (`Affirmations LA-11, LA-17`) et du benchmark `SWE-Mini` à `16` tâches (`Affirmation LA-13`) ne sont pas revendiqués (tandis que l'exécution réelle de `120B-A12B` est directement mesurée dans l'`Affirmation LA-21`, et que seule la ligne synthétique `70B` sur NVMe à froid dans `air_mol_nvme_baselines.csv` demeure une projection analytique).

| ID | Revendication | Condition de réfutation exacte / falsificateur |
| :--- | :--- | :--- |
| **`LA-F1`** | `Revendication LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` échoue `100.0%` de parité Verilator sur `5,120` paquets ou rate le décalage VLAN du paquet `2,500`. |
| **`LA-F2`** | `Revendication LA-2` (Polyglot suite) | Zig alloue `> 0` octets de tas hot-loop, Go signale `> 0 allocs/op`, ou Julia Enzyme dépasse l’erreur FD de `1e-7`. |
| **`LA-F3`** | `Revendication LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` dépasse `117,120` LUT, `144` `RAMB36E2`, `0` `DSP48`, ou `1` cycle par commutation de page. |
| **`LA-F4`** | `Revendication LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` dépasse le risque faux cible $\alpha = 0.02$ sur trafic décalé ou horodate `Deterministic`. |
| **`LA-F5`** | `Revendication LA-5` (Byte speculation) | `scripts/run_code_corpus_benchmark.py` produit `< 100.0%` de parité exacte d’octets contre le `Mamba3CodeLM` gourmand sur `48` invites invisibles. |
| **`LA-F6`** | `Revendication LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` sous `F_NOCACHE` échoue `100%` de parité ou lit plus d’octets NVMe que `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Revendication LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`, `scripts/run_hf_air_mol_pretrained.py` ou `scripts/run_hf_qwen35_air_mol.py` diverge de $\ge 1$ token BPE par rapport à la cible gourmande. |
| **`LA-F8`** | `Revendication LA-8` (Regression suite) | `pytest -v` échoue à l’un des `35` tests dans `tests/`. |
| **`LA-F9`** | `Revendication LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` diverge de la parité de token `100%` ou lit plus d’octets NVMe que `AirLLM` ou `Expert-AirLLM`. |
| **`LA-F10`** | `Revendication LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` dépasse l’erreur maximale `1e-3` vs. multiplication matricielle binaire dense `ITQ` ou échoue `100%` de parité vérifiée. |
| **`LA-F11`** | `Revendication LA-11` (`48`-Task Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` accepte `> 0%` de commits cassés ou accepte une compétence Wave-1 obsolète sous mutation de spécification Wave-2. |
| **`LA-F12`** | `Revendication LA-12` (Metal `INT4` MoE) | `scripts/run_metal_moe_benchmark.py` dépasse l’erreur de shader `FP32` `1e-4` ou diverge de la parité de token gourmande `100%` sur `8.5B` ou `35B`. |
| **`LA-F13`** | `Revendication LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` accepte `> 0%` de correctifs cassés, modifie `tests/`, ou rate la mutation de spécification Wave-2 `R03`. |
| **`LA-F14`** | `Revendication LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` échoue OpenAI REST/SSE, `MCP` `JSON-RPC 2.0`, rechargement `.mol/`, ou horodate `measured_j`. |
| **`LA-F15`** | `Revendication LA-15` (`BCB` + `SWE-bench`) | `scripts/run_external_public_benchmarks.py` échoue à la vérification `SHA`-256 Parquet, expose les solutions ou correctifs de référence, ou admet `> 0%` de sorties cassées. |
| **`LA-F16`** | `Revendication LA-16` (RTL `xck26` `250 MHz`) | `scripts/verify_pipelined_250mhz_rtl.py` dépasse `20` niveaux logiques par cycle, dépasse `189` `IOB` sur `P4-AXIS`, utilise `> 0` `DSP48`, ou échoue à la parité Verilator `256/256` à `CPI = 1.00`. |
| **`LA-F17`** | `Revendication LA-17` (`Échelon 3d` `<think>`) | `scripts/run_rung3d_thinking_ceiling.py` admet `> 0%` de commits cassés, appelle des API cloud, ou échoue à porter le taux de réussite vérifié au-dessus de `87.50%`. |
| **`LA-F18`** | `Revendication LA-18` (MoE Rust `CubeCL`) | `cargo run --release --bin bench_cubecl_moe_deltanet` dépasse l'erreur `FP32` de `1e-4` sur `CPU` `LLVM` ou `GPU` `Metal`, ou obtient une accélération Metal `< 25×`. |
| **`LA-F19`** | `Revendication LA-19` (`6` noyaux `Lean 4.36.0`) | `scripts/verify_lean_proofs.py` ou `lake check --paranoid` échoue sur l'un des `6` noyaux indépendants (`con-leche`, `con-ron`, `lean4lean`, `nanoda`, `leanchecker`, `lean`), contient `>= 1` `sorry` / `opaque` / `ofReduceBool`, ou ajoute `>= 1` axiome personnalisé. |
| **`LA-F20`** | `Revendication LA-20` (`SWE-bench` `4` dépôts) | `scripts/run_multirepo_swebench_benchmark.py` expose `patch`, évalue `< 4` dépôts, admet `> 0%` de correctifs cassés, ou échoue à surpasser les modèles autonomes `24B`/`35B`. |
| **`LA-F21`** | `Revendication LA-21` (MoE hybride `120B`) | `scripts/run_120b_hybrid_moe_benchmark.py` échoue à l'exécution locale de `120B-A12B`, admet `> 0%` de commits cassés, ou enregistre `0%` de succès en voie rapide `.mol/` en Vague 2. |
| **`LA-F22`** | `Revendication LA-22` (Puissance `VCD` gating `CE`) | `scripts/verify_ce_gated_vcd_power.py` échoue à la parité `CE` `320/320`, dépasse `189` `IOB`, ou obtient une réduction de puissance dynamique au repos `< 3.5×`. |
| **`LA-F23`** | `Revendication LA-23` (Rust `mol-agent-rs`) | `cargo run --release --bin mol_agent -- --self-test-bench` requiert Python pour `/v1` ou `/mcp`, échoue à `--mcp-stdio`, ou obtient une accélération `< 10×` par rapport au `MCP` Python. |

---

<div id="7-references" class="anchor-alias" aria-hidden="true"></div>

## 7. Références

<ol data-refs>
<li>Bacellar, A., et al. (2024). Differentiable Weightless Neural Networks. <em>arXiv:2410.11112</em>.</li>
<li>Beneš, V. E. (1965). <em>Mathematical Theory of Connecting Networks and Telephone Traffic</em>. Academic Press.</li>
<li>Cai, T., Li, Y., Geng, Z., Peng, H., Lee, J. D., Chen, D., and Dao, T. (2024). Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads. <em>ICML 2024</em>, <em>arXiv:2401.10774</em>.</li>
<li>Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. <em>arXiv:2305.05176</em>.</li>
<li>Dao, T., and Gu, A. (2024). Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality. <em>ICML 2024</em>, <em>arXiv:2405.21060</em>.</li>
<li>Furao, S., and Hasegawa, O. (2006). An incremental network for on-line unsupervised classification and topology learning (SOINN). <em>Neural Networks</em>, 19(1):90-106.</li>
<li>Gibbs, I., and Candès, E. (2021). Adaptive Conformal Inference Under Distribution Shift. <em>NeurIPS 2021</em>, <em>arXiv:2106.00170</em>.</li>
<li>Google Gemma Team (2026). <code>google/gemma-4-E2B-it</code> On-Device Hybrid Instruction Model Card (2026). <a href="https://huggingface.co/google/gemma-4-E2B-it">huggingface.co/google/gemma-4-E2B-it</a>.</li>
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., and Narasimhan, K. (2024). SWE-bench: Can Language Models Resolve Real-World GitHub Issues? <em>ICLR 2024</em>, <em>arXiv:2310.06770</em>.</li>
<li>Lee, H., Kim, M., Baek, S., Kim, J., Hwang, S., Shin, J., Lee, J., and Kim, E. (2025). LittleBit: Ultra Low-Bit Quantization via Latent Matrix Factorization. <em>NeurIPS 2025</em>, <em>arXiv:2506.13771</em>.</li>
<li>Lee, H., and Kim, E. (2026). LittleBit-2: Pushing the Frontier of Extreme LLMs Quantization into 0.1-Bit (<code>SamsungLabs/LittleBit</code>). <em>ICML 2026</em>, <em>arXiv:2603.00042</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455-1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094-1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026a). <code>LiquidAI/LFM2.5-350M</code> and <code>LiquidAI/LFM2.5-8B-A1B</code> Hybrid and Sparse-MoE Open-Weights Model Cards. <a href="https://huggingface.co/LiquidAI/LFM2.5-8B-A1B">huggingface.co/LiquidAI/LFM2.5-8B-A1B</a>.</li>
<li>Liquid AI (2026b). <code>LiquidAI/LFM3-1.7B</code> Tri-Hybrid Open-Weights Model Card (October 23, 2026). <a href="https://huggingface.co/LiquidAI/LFM3-1.7B">huggingface.co/LiquidAI/LFM3-1.7B</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026a). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
<li>Qwen Team (2026b). <code>Qwen/Qwen3.6-35B-A3B</code> Sparse-MoE Hybrid Gated DeltaNet + Attention Model Card (2026). <a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B">huggingface.co/Qwen/Qwen3.6-35B-A3B</a>.</li>
<li>Saxena, A. (2023). Prompt Lookup Decoding. <a href="https://github.com/apoorvumang/prompt-lookup-decoding">github.com/apoorvumang/prompt-lookup-decoding</a>.</li>
<li>Simon, H. A., and Kadane, J. B. (1975). Optimal Problem-Solving Search: All-or-None Solutions. <em>Artificial Intelligence</em>, 6(3):235-247.</li>
<li>Thompson, C. D. (1978). Generalized Connection Networks for Parallel Processor Intercommunication. <em>IEEE Trans. Comput.</em>, C-27(12):1119-1125.</li>
<li>Umuroglu, Y., Akhauri, Y., Fraser, N. J., and Blott, M. (2020). LogicNets. <em>FPL 2020</em>, <em>arXiv:2004.03021</em>.</li>
<li>VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. <em>arXiv:2509.04827</em>.</li>
<li>Vovk, V., Gammerman, A., and Shafer, G. (2005). <em>Algorithmic Learning in a Random World</em>. Springer.</li>
<li>Waksman, A. (1968). A Permutation Network. <em>Journal of the ACM</em>, 15(1):159-163.</li>
<li>Wei, J., et al. (2024). T-MAC: CPU Renaissance via Table Lookup for Low-Bit LLM Deployment. <em>arXiv:2407.00088</em>.</li>
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2024). BigCodeBench: Benchmarking Code Generation with Diverse Function Calls and Complex Instructions. <em>ICLR 2025</em>, <em>arXiv:2406.15877</em>.</li>
<li>Moura, L. de, and Ullrich, S. (2021). The Lean 4 Theorem Prover and Programming Language. <em>CADE 28</em>, <em>LNCS</em> 12699:625-635.</li>
<li>NVIDIA (2026). <code>nvidia/Nemotron-3-Super-120B-A12B</code> Hybrid Mamba-Attention Sparse-MoE Open-Weights Model Card. <a href="https://huggingface.co/nvidia/Nemotron-3-Super-120B-A12B-BF16">huggingface.co/nvidia/Nemotron-3-Super-120B-A12B-BF16</a>.</li>
<li>Mistral AI (2025). <code>mistralai/Devstral-Small-2-24B-Instruct-2512</code> Open-Weights Software Engineering Model Card. <a href="https://huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512">huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512</a>.</li>
</ol>

---

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## Annexe A. Reproductibilité

Depuis un checkout de [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit 86d0ab5`) :

```bash
PYTHONPATH=src .venv/bin/pytest -v
(cd proofs && lake build) && PYTHONPATH=src .venv/bin/python scripts/verify_lean_proofs.py
PYTHONPATH=src .venv/bin/python scripts/run_multirepo_swebench_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_120b_hybrid_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/verify_ce_gated_vcd_power.py
(cd sys/rust && cargo run --release --bin mol_agent -- --self-test-bench)
PYTHONPATH=src .venv/bin/python scripts/run_external_public_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_pipelined_250mhz_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_rung3d_thinking_ceiling.py
(cd sys/rust && cargo test --release && cargo run --release --bin bench_cubecl_moe_deltanet)
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_lfm3_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_moe_8b_35b_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_sub1bit_lut_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_metal_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
PYTHONPATH=src .venv/bin/python scripts/run_repo_patch_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/mol_agent_server.py --host 127.0.0.1 --port 8090 --mol-dir .mol
```
