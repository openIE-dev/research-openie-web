---
title: "Compilation descendante vers LUT6 dans une cascade Mixture of Limits : tissus booléens routés par Beneš, portes d'éveil conformes et diffusion NVMe Sparse-MoE de pointe"
deck: "Une cascade Mixture of Limits qui essaie d'abord des circuits de table de correspondance à 6 entrées paginés sans opération en virgule flottante (FLOP), diffuse des modèles hybrides et épars de type Mixture-of-Experts (MoE) de fin 2026 à 4-bit Non-Volatile Memory Express (NVMe) jusqu’à 34.66B paramètres via des shaders Apple Metal Shading Language (MSL) personnalisés uniquement en cas de défaut, contrôle les engagements via des vérificateurs déterministes, et compile les réveils certifiés en descente vers des Block RAM de 36-Kbit (RAMB36E2) routés par Beneš et des pages de compétences canoniques. Les temps d’horloge murale, les comptes d’octets non tamponnés Darwin F_NOCACHE (lecture de fichier non tamponnée), la mémoire vive active (RAM jusqu’à 970.0 megabytes = 1.47 % des poids en virgule flottante 16 bits sur 34.66B), les compteurs d’énergie sur puce à double canal Apple M5 Max (reported_j), les estimations d’énergie analytiques (est_j), et les simulations register-transfer-level (RTL) Yosys/Verilator xck26 sont rapportés depuis openIE-dev/lut-adapt-ai au commit af152ba ; aucune mesure d’alimentation isolée de la carte n’a été effectuée (measured_j unset)."
lang: "fr"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*Révision ff18890, 22 novembre 2026. Implémentation de référence et artefacts : [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) à [`af152ba2e63b5c55bcfad9b2fa41e675e8e3946c`](https://github.com/openIE-dev/lut-adapt-ai/tree/af152ba2e63b5c55bcfad9b2fa41e675e8e3946c). Résumé des données : [/data/#lut-adapt](/data/#lut-adapt). PDF LaTeX : [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([source](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Vue d'ensemble

Cette étude examine comment un système informatique peut compiler, de manière descendante, un travail répété de modèle neuronal vers des recherches booléennes rapides dans des tables et vers des compétences canoniques certifiées, sans perdre la parité exacte des sorties ni promouvoir des suppositions non vérifiées au rang de règles de confiance. Elle rapporte des mesures logicielles et d'entrées/sorties sans tampon, des synthèses au niveau transfert de registres et des simulations de cycles, des relevés de compteurs d'énergie à double canal (système d'exploitation / énergie sur puce) (`reported_j` sur Apple M5 Max et compteurs Linux Running Average Power Limit), ainsi que des estimations analytiques d'énergie étiquetées (`est_j`). Aucun wattmètre secteur ou de rail n'était connecté dans ce dépôt (`measured_j` n'est pas renseigné ; `board_metered` vaut faux).

**En termes simples**

1. La plupart des entrées qu'un système déployé observe répètent des motifs qu'il a déjà résolus, de sorte qu'exécuter un réseau neuronal complet en virgule flottante à chaque étape gaspille calcul et bande passante mémoire.
2. La référence place un étage de consultation de table de vérité à 6 entrées reconfigurable (`LUT6`) en amont des modèles d'espace d'états en flux et des modèles de fondation, et compile les réponses vers le bas dans des pages de mémoire de consultation seulement après qu'une vérification explicite les ait certifiées.
3. Lorsque les modèles de langage hybrides et à mélange clairsemé d'experts de fin 2026 jusqu'à `34.66B` paramètres diffusent des poids 4 bits depuis un stockage à semi-conducteurs via des nuanceurs Apple Metal fusionnés personnalisés, les lectures d'experts clairsemés par routeur associées à ce brouillon `LUT6` à zéro FLOP réduisent les lectures disque jusqu'à `12.30×` et maintiennent `Qwen/Qwen3.6-35B-A3B` dans `970.0` mégaoctets de mémoire de poids active (`1.47%` de son empreinte virgule flottante 16 bits de `66.11` gigaoctets) à `6.773 J/tok` sur puce `reported_j` sans aucun changement des jetons de sortie ; le code de portillon et les commits de dépôt git multi-fichiers derrière des vérifications déterministes `pytest` atteignent un **taux de passage vérifié de `87.50%`** à travers à la fois un concours de codage de pointe à `48` tâches (`16` spécifications × `3` vagues) et un banc d'essai de correction de dépôt à `16` tâches (`8` dépôts git × `2` vagues) avec **`0.00%` de commits cassés admis**, accélérant les résolutions cristallisées de la Vague-3 par **`15,401×`** (`2.89 ms`, `0.0424 J` `reported_j`).

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termes, acronymes et étiquettes de mesure

<ul id="terms">
<li>MoL : Mixture of Limits, la règle en cascade provenant de Metered Commit Gates Part II [same house]</li>
<li>LA : préfixe de revendication et de falsification (LA-1 à LA-14, LA-F1 à LA-F14) utilisé dans cette étude</li>
<li>LUT, LUT6, INIT : table de correspondance, primitive booléenne Xilinx UltraScale+ à 6 entrées, et son masque d'initialisation de table de vérité 64 bits</li>
<li>BRAM, RAMB36E2, URAM : RAM de bloc, primitive UltraScale+ à double port de 36 Kbit (144 sur xck26), et UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260 : bloc logique configurable, bascule, tranche de traitement du signal numérique, et carte AMD Kria KV260 (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL : field-programmable gate array, application-specific integrated circuit, register-transfer level, cycles per lookup, place-and-route, worst negative slack, et Field-Programmable Logic conference</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU, SMC, L2, L3 : Interface eXtensible Avancée, système de traitement Zynq, logique programmable, système sur module, circuit intégré de surveillance d’alimentation embarqué, rail d’alimentation, Limite de Puissance Moyenne d’Exécution Intel, Bibliothèque de Gestion NVIDIA, unité de gestion d’alimentation macOS, Contrôleur de Gestion Système Apple, compteur d’énergie du sous-système niveau-2 (Apple IOReport GPU Energy), et compteur d’énergie CPU par processus niveau-3 (Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj)</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG : State Space Duality, state-space model, multiple-input multiple-output, rotary position embedding, gated linear unit activation, grouped-query attention, key-value cache, byte-pair encoding, large language model(s), Mixture-of-Experts, multilayer perceptron, et context-free grammar</li>
<li>HC, SOINN, WNN, DWN : hierarchy-context Self-Organizing Incremental Neural Network, weightless neural network, et Differentiable Weightless Neural Network</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC : Joint-Embedding Predictive Architecture, Energy-Based Reasoning Model, Adaptive Conformal Inference, out-of-distribution, area under the receiver operating characteristic, maximum softmax probability, et Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF : Prompt Lookup Decoding, Retrieval-Based Speculative Decoding, Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LFM2.5-350M et LFM2.5-8B-A1B), Liquid Foundation Model 3 (oct. 2026 LiquidAI/LFM3-1.7B), et HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR : singular value decomposition, Iterative Quantization Procrustes hypercube rotation, sign-value-independent decomposition, quantization-aware training, post-training quantization, perplexity, et signal-to-noise ratio</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB, GiB : stockage Non-Volatile Memory Express, indicateur de fichier non mis en mémoire tampon F_NOCACHE de Darwin, Interface Portable du Système d’Exploitation, mémoire à accès aléatoire, RAM dynamique, RAM statique, entrée/sortie, kilooctet, mégaoctet, gigaoctet et gibioctet</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, BF16, FP16, FP32, INT4, ULP, MSL, MPS : opération(s) en virgule flottante, millions de FLOP, opération(s) de multiplication-accumulation, instruction unique sur données multiples, différentiation automatique, différence finie, bits par octet, brain float 16, virgule flottante IEEE 16/32 bits, entier sur 4 bits, unité du dernier rang, Apple Metal Shading Language et PyTorch Metal Performance Shaders</li>
<li>RCE, WCA, VC, SWE : Reality Code Engine [même maison], Wise Computer Automation [même maison], achèvement vérifié et préfixe de banc d’essai en génie logiciel</li>
<li>CLI, HTTP, GET, POST, SSE, API, MCP, RPC, IDE, SDK, CORS, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW, TDP : interface en ligne de commande, protocole de transfert hypertexte et ses méthodes de requête GET/POST, événements envoyés par le serveur, interface de programmation d'application, Model Context Protocol, appel de procédure à distance (JSON-RPC 2.0), environnement de développement intégré, kit de développement logiciel, partage des ressources entre origines multiples, conférences académiques en informatique et ingénierie, système d'exploitation, processeur central/processeur graphique, logiciel et puissance thermique de conception</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XNOR, JWT, HMAC, DAG, CIDR, LRU, TTL, WAL, ETL : réseau local virtuel (IEEE 802.1Q), sécurité de la couche transport, inspection approfondie des paquets, arbre syntaxique abstrait, JavaScript Object Notation, valeurs séparées par des virgules, algorithme de hachage sécurisé, contrôle de redondance cyclique, mode de transfert asynchrone (CRC-8/ATM), demande de commentaires (Request for Comments), langage de requête structuré, encodage DWARF en base 128 signé little-endian, mémoire adressable par contenu, NON-OU exclusif, jeton web JSON, code d'authentification de message à base de hachage, graphe orienté acyclique, routage interdomaine sans classes, cache à éviction du moins récemment utilisé, expiration par durée de vie, journal d'écriture anticipée et chaîne d'extraction, transformation et chargement</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, CARRY8, DSP48E2, URAM288, VCCINT, DS925, VCD, SDP, CE, XPE, CLAI, AMD : groupe d’action de test conjoint, débogueur de l’outil en ligne de commande Xilinx (XSDB), port d’accès de débogage, bus série universel, Future Technology Devices International et son pont IC FT2232C double UART/FIFO, récepteur-émetteur asynchrone universel, tampon premier-entrée-premier-sortie, circuit intégré, automatisation de la conception électronique, mode de synthèse hors-contexte, architecture de bus microcontrôleur avancée, interconnexion AXI4-Lite/AXI4-Stream, bloc d’entrée-sortie, tampons d’entrée-sortie, bascules D à réinitialisation ou mise à jour synchrones, tables de correspondance UltraScale+ à 1-5 entrées, multiplexeurs UltraScale+ à 7/8 entrées, chaînes de retenue rapides 4/8 bits, tranche DSP UltraScale+, UltraRAM de 288 Kbits, rail d’alimentation interne du cœur (0,72 V sur -2LV), fiche technique des caractéristiques de commutation DC et AC du Zynq UltraScale+ d’AMD DS925, trace d’onde Value Change Dump, mode Block RAM à double port simple, activation d’horloge synchrone, estimateur de puissance Xilinx, identifiant magique du registre du sous-système (« CLAI »), et Advanced Micro Devices</li>
</ul>

Quatre classes de preuve restent séparées dans chaque tableau ci-dessous :

| Étiquette de preuve | Signification dans cette étude |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Comptages exacts d’octets lus ou écrits via `os.pread` sous Darwin `F_NOCACHE`, allocations mémoire résidentes, secondes d’horloge murale, énergie cumulative du `PMU` macOS complet (`AppleSmartBattery.PowerTelemetryData`) sur Apple M5 Max, et accord exact de bits/jetons. `measured_j` n’est pas défini (`None`). |
| **`Reported (OS / On-Chip Counter, reported_j)`** | Compteurs de télémétrie non privilégiés du système d’exploitation et sur puce : sur Apple M5 Max (`joule_meter.py`), double canal `libIOReport.dylib` « Energy Model » `'GPU Energy'` (`L2` résolution nanoseconde `nJ`) plus `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3` CPU par processus `nJ`) ; sur Linux `x86-64` (dans l’audit de synthèse EDA `xck26` ci-dessous), joules `RAPL` `package-0`. Jamais fusionné avec `measured_j` (`None`). |
| **`Simulated (RTL)`** | Comptages de netlist structurels issus de Yosys `0.71+` (`synth_xilinx -family xcup` ciblant Kria KV260 `xck26`) et comptages de cycles (`CPI = 1`) provenant de Verilator `5.054`. Pas de clôture de timing Vivado et pas d’alimentation de carte (`board_metered = false`). |
| **`Estimated (est_j)`** | Joules analytiques calculés à partir des comptages d’opérations, des substituts temporels de puissance de conception thermique (`joule_meter.py`), ou de l’activité de commutation du taux de bascule VCD Verilator associée aux limites de capacité logique AMD `DS925` `xck26-2LV` (`0.72 V`) et `RAMB36E2` (§ 4.16). Comparable uniquement entre les bras à l’intérieur de la même formule ; jamais des watts silicium. |

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
2. **Architecture Beneš-Copy-Beneš non bloquante $512 \times 512$ et RTL `81`-`RAMB36E2`** : Élimine à la fois le débordement logique de `102,0 %` des barres croisées plates sur Kria KV260 (`119 478` LUT) et l'explosion à `926 619` LUT des multiplexeurs de pages à bascules, pour une synthèse à `41 186` LUT CLB UltraScale+ (`35,2 %` de `xck26`), `81` blocs `RAMB36E2` (`56,2 %`) et `0` tranche `DSP48`, avec commutation de page en `1` cycle (`4,0 ns` à `250 MHz` nominal) en simulation.
3. **Synthèse universelle de mintermes en mode joint pour $\le 64$ bits** : Montre que la recherche de mintermes en mode joint domine l'arrondi DiffLogic marginal par plan de bits sur les branches corrélées et compacte $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ jetons de sous-mots dans un mot `uint64` (`16b × 4 = 64b` pour `|V| = 65 536` ; `17b × 3 = 51b` pour `|V| = 128 000` ; `18b × 3 = 54b` pour `|V| = 248 320`).
4. **Porte de cristallisation Split-Conformal + ACI en ligne sans oracle** : Associe un score de non-conformité latent `JEPA-EBRM` régularisé radialement à une calibration Split Conformal et à l'Adaptive Conformal Inference (Gibbs et Candès, 2021), enregistrant un risque de fausse cristallisation de `0,00 %` et un AUROC OOD de `1,0000` sur du trafic décalé où les lignes de base softmax et MC-Dropout enregistrent un risque faux de `17,62 %-24,28 %`.
5. **Nuanceurs Apple Metal `INT4` Sparse-MoE et `GatedDeltaNet` sur mesure + `AirMoL` / `Expert-AirMoL` jusqu'à `34,66B`** : Combine le partitionnement 4 bits Darwin `F_NOCACHE` `os.pread`, des nuanceurs de calcul `MSL` `q4_moe_*` (`43,45×` plus rapides) et `gated_delta_recurrent_k128` (`20,66×` plus rapides) sur mesure, des `pread` parallèles de profondeur de file d'attente `8`, et une spéculation en rafale `BenesLUT6` sur les modèles `LiquidAI/LFM3-1.7B` d'octobre 2026 (`2,74×` de réduction NVMe dans `3,79 %` de RAM FP32), `LiquidAI/LFM2.5-8B-A1B` (`500,0 Mo` de RAM, `3,493 J/tok` `reported_j`) et `Qwen/Qwen3.6-35B-A3B` (`34,66B` ; **`12,30×` de réduction NVMe**, **`970,0 Mo` de RAM = `1,47 %` de FP16**, **`6,773 J/tok` `reported_j`**, **`15,7 tok/s`** `Q4` à mémoire unifiée) à `100,0 %` d'exacte parité de jetons.
6. **LUT6 `Sub1Bit` sans MAC contre `LittleBit`, codage frontière à vérification par porte de `87,50 %` et cascades de dépôt git `SWE-Mini`, et `mol-agent` OpenAI / `MCP`** : Remplace les `1,98 M` MAC binaires à l'exécution de `LittleBit-1 / LittleBit-2` (`0,576` bit par poids ; Lee et al., 2025 ; Lee et Kim, 2026) par une recherche de somme partielle `LUT6` à `6` entrées sans MAC (`< 4 × 10^{-6}` d'erreur, `100,0 %` de parité sous vérification cible `MoL` en `0` époque QAT), atteint un **`87,50 %` (`42 / 48`) de passes vérifiées** (`0,00 %` de commits cassés, `22,92 %` d'appels `35B`, `2,89 ms` / `0,0424 J` `reported_j` de relecture cristallisée Wave-3 = `15 401×` plus rapide que `35B`) sur un banc d'essai de codage de `48` tâches fin 2026 et un **`87,50 %` (`14 / 16`)** (`0,00 %` de correctifs cassés) sur un banc d'essai `SWE-Mini` `pytest` de `16` tâches (`8` dépôts git multi-fichiers × `2` vagues), et expose un serveur `mol-agent` prêt à l'emploi OpenAI `/v1/chat/completions` + `MCP` (`JSON-RPC 2.0`) (`26 / 26` tests `pytest` passant).

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

`src/clai/service/openai_mcp_agent.py` et `scripts/mol_agent_server.py` (`mol-agent` point d’entrée CLI) exposent la cascade aux outils de codage `IDE` et aux terminaux (`Cursor`, `Continue.dev`, `Claude Code`, `Antigravity`, OpenAI `SDK`) sans aucune dépendance web tierce : (i) compatibilité OpenAI avec `GET /v1/models` et `POST /v1/chat/completions` (`stream: true/false` `SSE`, en-têtes CORS, vérificateur déterministe optionnel `x_mol_contract`, et rapport `x_mol_receipt` incluant `skill_id`, `est_j`, `reported_j`, `measured_j: null`) ; et (ii) Protocole de Contexte de Modèle (`MCP` `JSON-RPC 2.0` via `--mcp-stdio` et `POST /mcp`) exposant `mol_synthesize_verified_function`, `mol_repair_repo_pytest`, `mol_lookup_crystallized_skill` et `mol_energy_telemetry` soutenus par les fichiers persistants `.mol/skills_v1.json` + `.mol/benes_lut6_router.npz` (`26 / 26` tests `pytest` réussis).

<div id="415-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.15 Décomposition complète des primitives du sous-système `xck26-sfvc784-2LV-c`, profondeur topologique et sonde matérielle `Vivado 2026.1`

Afin d'auditer à la fois le cœur spéculatif autonome de `512` pages (`clai_benes_paged_hotswap_core` dans `hw/kv260/rtl/clai_benes_hotswap_core.sv`) et le sous-système complet Rung-0 à bus AMBA `AXI4-Lite` + `AXI4-Stream` (`clai_kv260_axi_top` dans `hw/kv260/rtl/clai_kv260_axi_top.sv`, `clai_engram_streamer.sv`, `clai_rung0_hotswap_core.sv` et `artifacts/clai_rung0_kv260.v` au commit `a5e9bc1de280`, inchangé dans `af152ba`) face à la référence exacte AMD Kria KV260 (`xck26-sfvc784-2LV-c` : `117,120` LUT CLB, `234,240` bascules CLB, `144` blocs `RAMB36E2`, `64` blocs UltraRAM de 288 Kbit (`URAM288`), `1 248` tranches de traitement du signal UltraScale+ (`DSP48E2`) et `189` blocs d'entrée/sortie utilisateur (`IOB`)), trois vérifications matérielles et de conception assistée par ordinateur pour l'électronique (`EDA`) ont été exécutées sur une station de travail Intel Core i9-13900H (Linux 7.0.0-43-generic x86-64) :

1. **Sonde JTAG (Joint Test Action Group) et USB (Universal Serial Bus) en lecture seule (`Xilinx hw_server v2026.1` + outil en ligne de commande Xilinx Software (`XSDB`))** : Bien que `lsusb` ait signalé un pont FTDI (Future Technology Devices International) `0403:6010` (circuit intégré `FT2232C/D/H` à double émetteur-récepteur asynchrone universel (`UART`) / mémoire tampon premier entré, premier sorti (`FIFO`)) raccordé, l'inspection des chaînes de fabricant et de produit USB du sous-système `sysfs` de Linux (`idVendor = 0403`, `idProduct = 6010`) a identifié le périphérique comme `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"`, et non comme une carte porteuse Kria KV260. L'interrogation de `hw_server v2026.1` (build du 29 mai 2026) via `xsdb` (`connect; jtag targets; targets`) a renvoyé **`0` périphérique JTAG Xilinx et `0` cible de port d'accès au débogage (`DAP`)** (`board_metered = false`, `measured_j = None`).
2. **Synthèse par lots `Vivado 2026.1` et verrou de licence (`SW Build 6511674`)** : Un script par lots non projet, à faible empreinte et reproductible (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, ciblant `xck26-sfvc784-2LV-c` à `250.0 MHz` / `4.000 ns` en mode hors contexte (`OOC`)) a été préparé pour `/tools/Xilinx/2026.1/Vivado/bin/vivado`. Le lancement de `vivado v2026.1` en mode par lots s'est interrompu avant `synth_design` (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`), car `Vivado 2025.1+` / `2026.1` d'AMD exige un fichier `.lic` Standard/Enterprise généré par l'utilisateur (`~/.Xilinx/Xilinx.lic` ou `XILINXD_LICENSE_FILE`), même pour les composants `xck26` de niveau Standard, et aucun fichier `.lic` n'était installé sur la station de travail. Conformément aux règles de mesure strictes, le `WNS` après routage, la fréquence d'horloge maximale après placement et routage, ainsi que `report_power` en mode sans vecteurs (`est_j`) restent consignés à `not_available` tant qu'un fichier `.lic` Standard n'a pas été fourni.
3. **Décomposition en primitives `xcup` du sous-système UltraScale+ complet, budget d'`IOB` et audit topologique des niveaux logiques (`Yosys 0.71+`)** : La synthèse de `clai_benes_paged_hotswap_core` et de `clai_kv260_axi_top` via `synth_xilinx -family xcup` et `ltp -noff` (en consignant strictement le `reported_j` du `RAPL package-0` de l'hôte comme coût de compilation `EDA` `x86-64` $E_{\text{compile}}$, et jamais comme puissance du silicium FPGA) a permis d'établir le nombre exact de cellules et les profondeurs combinatoires du chemin critique :

| `xck26-sfvc784-2LV-c` Module cible | LUT CLB (`% xck26`) | Primitives LUT dominantes | Registres CLB (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | Ports supérieurs (`IBUF`+`OBUF`) | Profondeur combinatoire (`ltp`) | Synthèse hôte `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` pages) | **`41 185`** (`35,17 %`) | `19 982 LUT3`, `7 804 LUT6`, `7 714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36 464`** (`15,57 %`) | **`81`** (`56,25 %`) | **`0`** | `1 599` (`OOC` / bus interne) | **`81` niveaux** | `7 297,3 J` (`144,8 s`) |
| **`clai_kv260_axi_top`** (sous-système `AXI4` Rung-0) | **`67 366`** (`57,52 %`) | `25 557 LUT6`, `25 333 LUT5`, `7 918 LUT3`, `569 CARRY4` | **`16 619`** (`7,09 %`) | **`4`** (`2,78 %`) | **`0`** | `126` (`<= 189` `IOB` ; `PS-PL`) | **`73` niveaux** | `10 089,4 J` (`214,8 s`) |

Deux contraintes concrètes de conception physique émergent de la primitive `xcup` et de l’audit `ltp` :

- **Confinement du budget de broches (`OOC` vs. wrapper `PS-PL` `AXI`)** : parce que `clai_benes_paged_hotswap_core` expose le `CodeBitBus` brut de `512` bits et les vecteurs larges de configuration fantôme (`1 379` tampons d’entrée (`IBUF`) + `220` tampons de sortie (`OBUF`) = `1 599` ports contre `189` `IOB` de boîtier sur `xck26-sfvc784-2LV-c`), l’implémentation autonome du fournisseur doit s’exécuter avec `synth_design -mode out_of_context` ou à l’intérieur d’un wrapper `AXI4-Stream` / `zynq_ultra_ps_e` tel que `clai_kv260_axi_top` (`126` ports, `57,52 %` d’utilisation de LUT).
- **Profondeur combinatoire non pipelinée (`81` et `73` niveaux) contre fermeture à `250 MHz` (`4,000 ns`) sur `-2LV`** : bien que Verilator `5.054` vérifie un `CPI = 1,0` (`1` consultation par cycle d’horloge) cycle-exact, la traversée de `17` étages `Beneš-1` + `9` étages de copie de préfixe + `17` étages `Beneš-2` + multiplexage dynamique de tables de vérité `LUT6` + réduction majoritaire à `5` votants en un seul cycle combinatoire couvre **`81` niveaux primitifs** (`73` niveaux par module hiérarchique dans le popcount combinatoire à `64` entrées et le comparateur de marge à `8` classes de `clai_kv260_axi_top`). La fermeture à `250 MHz` (`4,000 ns`) post-placement-et-routage sur du silicium basse tension (`0,72 V`) `-2LV` favorise donc l’insertion d’étages de registres pipeline à travers $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ et la compression de la réduction popcount sur `64` fils, quantifiée analytiquement au §4.16.

<div id="416-gate-level-xcup-primitive--verilator-vcd-switching-activity-datasheet-audit-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.16 Primitif `xcup` Niveau-gate & Audit de la Fiche Technique d'Activité de Commutation `Verilator` `VCD` (`est_j`)

Parce que AMD `Vivado 2026.1` était bloqué par un fichier `.lic` manquant et `0` cartes physiques `xck26` étaient attachées (§4.15), un tracé `Verilator 5.054` `--trace` pré-enregistré et un audit `Yosys 0.71+` aplati `synth_xilinx -family xcup` (`PREREG_xck26_vcd.json`, SHA-256 `c64505d177515c47…`) ont extrait les transitions de signaux exactes par cycle depuis `openIE-dev/lut-adapt-ai` (`af152ba`) à travers quatre phases opérationnelles (`idle_quiescent`, `steady_lut6_eval_2048_cycles`, `single_cycle_page_switch_512_burst` et `shadow_page_stream_write`, `0` erreurs de co-simulation sur `3 072` recherches paginées et tous les rafales de paquets `AXI4-Lite`/`AXI4-Stream`). Tous les nombres de puissance et d’énergie dans cette sous-section sont strictement une estimation analytique de commutation dynamique (**`est_j` / `est_pJ/cycle` / `est_mW`**, **`measured_j = None`**, **`reported_j = None`**, **`board_metered = false`**), excluant les fuites statiques du silicium et ne remplaçant jamais un `Vivado report_power` placé-et-routé ou les lectures de rails KV260 `INA260`.

La synthèse aplatie `xcup` mappe `clai_benes_paged_hotswap_core` (`512` pages) à **`41 623` CLB LUTs** (`35.54 %` de `xck26`, contre `41 185` hiérarchiques §4.15 ; `19 982 LUT3`, `7 853 LUT6`, `7 738 LUT5`, `3 380 LUT4`, `2 670 LUT2`, `36 MUXF7`, `18 MUXF8`), `36 464` `FDRE` (`15.57 %`), et `81` `RAMB36E2` (`56.25 %`) sur `27 157` réseaux `VCD` uniques (`90 124` bits internes : `64 218` combinatoires, `20 767` séquentiels), et mappe `clai_kv260_axi_top` à **`66 881` CLB LUTs** (`57.10 %` de `xck26`, contre `67 366` hiérarchiques §4.15 ; `25 402 LUT6`, `25 313 LUT5`, `7 909 LUT3`, `5 303 LUT4`, `2 879 LUT2`, `75 LUT1`, `569 CARRY4` $\equiv$ `285 CARRY8`), `16 619` `FDRE`/`FDSE` (`7.09 %`), et `4` `RAMB36E2` (`2.78 %`) sur `3 825` réseaux `VCD` uniques (`128 486` bits internes : `108 582` combinatoires, `19 901` séquentiels). L’énergie de commutation dynamique à `VCCINT = 0.72 V` (`xck26-sfvc784-2LV-c`, `250.0 MHz`, limites `AMD DS925` / `XPE` 16 nm FinFET `[low, nom, high]`) modélise la logique commutée + les nœuds d’interconnexion locale à $C_{\text{node}} = [2.6, 4.5, 7.2]\text{ fF}$ ($\frac{1}{2} C V^2 = [0.674, 1.166, 1.866]\text{ fJ/transition}$, pondéré par `2.02` primitives `xcup` par bit combinatoire `VCD` dans le cœur Beneš), les broches d’horloge des `FDRE`/`FDSE` à `[1.5, 2.2, 3.0] fF` (`2` fronts/cycle = `1.141 fJ/FF/cycle` nominal) plus `[3.5, 5.5, 8.0] fF` par transition `Q`, et le `RAMB36E2` (`SDP` `64b`/`72b`) à `[2.90, 3.80, 4.80] pJ` par lecture d’adresse variable, `[1.90, 2.47, 3.12] pJ` par cycle d’activation d’adresse constante (`ENARDEN = 1`, $\alpha_{\text{addr}} = 0$), `[3.30, 4.30, 5.40] pJ` par écriture, et `[0.04, 0.08, 0.14] pJ/cycle` lorsqu’il est désactivé (`EN = 0`).

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

3. **Audit du chemin critique aplati (`81` et `162` niveaux `ltp`) et budget de délai analytique `DS925` en `-2LV`** : en appliquant les délais primitifs de `AMD DS925` (`xck26-2LV`, `0.72 V`, soit `T_ILO = 0.068 ns`, `T_CKO = 0.148 ns`, `T_RCKO_DO = 1.390 ns` non pipeliné pour `RAMB36E2` contre `0.610 ns` avec `DOA_REG = 1`, plus un budget d'interconnexion de `[0.140, 0.220] ns/niveau`), le chemin non pipeliné de `81` niveaux de `clai_benes_paged_hotswap_core` atteint **`18.76-24.83 est_ns`** (`est_Fmax` analytique de `40.3-53.3 MHz`). L'aplatissement de `clai_kv260_axi_top` à travers les frontières de modules (`ltp -noff` après `-flatten`, contre `73` niveaux par module hiérarchique au §4.15) fait apparaître un chemin de **`162` niveaux** (**`34.77-46.92 est_ns`**, `21.3-28.8 MHz`) qui traverse `core_bus_reg` jusqu'à `clai_rung0_core` (`artifacts/clai_rung0_kv260.v`) et sa chaîne d'additionneurs série `pop_acc` déroulée sur `64` étapes. En activant `DOA_REG = 1` sur `RAMB36E2`, en insérant `4` à `5` coupures de registres de pipeline (`<= 18` niveaux logiques par étage) et en remplaçant la boucle de popcount série à `64` entrées par un compresseur `6` niveaux `LUT6`/Wallace, le délai analytique par étage descend sous **`3.7 est_ns` (`<= 4.000 ns` à `250 MHz`)** avec `CPI = 1.0` (`not` une clôture de timing Vivado post-PAR).

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

**Validité des mesures et non revendiqué.** Les nombres analytiques de joules et de puissance de commutation (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`, et les bornes `Verilator` `VCD` + `AMD DS925` `0.72 V` `est_pJ/cycle` et `est_mW` dans §4.16), les lectures de compteurs du système d'exploitation / sur puce (`reported_j` provenant de Apple Silicon `L2` `libIOReport` `'GPU Energy'` + `L3` `proc_pid_rusage` `ri_energy_nj`, plus un filtre de débordement de registre étroit `> 450 W` documenté dans `Claim LA-11`), et les deltas cumulatifs du `PMU` macOS de la machine entière sont strictement séparés des mesures physiques des rails (`measured_j = None`). Yosys `0.71+` et Verilator `5.054` établissent la synthèse de netliste structurelle `xck26`, la simulation de cycle `CPI = 1` et la commutation dynamique `est_mW` basée sur le taux de basculement `VCD` (à l'exclusion des fuites statiques), et non la fermeture temporelle post-PAR Vivado à `250 MHz` ni les watts rails physiques du KV260 (`board_metered = false`). Le leadership énergétique du silicium, la promotion des sorties `ModelGenerated` vers `Deterministic`, l'évaluation complète du conteneur `SWE-bench Verified` à `500` tâches au-delà du benchmark contractuel à `48` tâches (`Claim LA-11`) et du benchmark `SWE-Mini` `pytest` multi-fichiers à `16` tâches sur dépôt git (`Claim LA-13`), ainsi que les exécutions mesurées `70B` (`air_mol_nvme_baselines.csv` rapporte des projections analytiques `70B` au-delà des exécutions mesurées `34.66B` de `Qwen3.6-35B-A3B`) ne sont pas revendiqués.

| ID | Revendication | Condition de réfutation exacte / falsificateur |
| :--- | :--- | :--- |
| **`LA-F1`** | `Revendication LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` échoue `100.0%` de parité Verilator sur `5,120` paquets ou rate le décalage VLAN du paquet `2,500`. |
| **`LA-F2`** | `Revendication LA-2` (Polyglot suite) | Zig alloue `> 0` octets de tas hot-loop, Go signale `> 0 allocs/op`, ou Julia Enzyme dépasse l’erreur FD de `1e-7`. |
| **`LA-F3`** | `Revendication LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` dépasse `117,120` LUT, `144` `RAMB36E2`, `0` `DSP48`, ou `1` cycle par commutation de page. |
| **`LA-F4`** | `Revendication LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` dépasse le risque faux cible $\alpha = 0.02$ sur trafic décalé ou horodate `Deterministic`. |
| **`LA-F5`** | `Revendication LA-5` (Byte speculation) | `scripts/run_code_corpus_benchmark.py` produit `< 100.0%` de parité exacte d’octets contre le `Mamba3CodeLM` gourmand sur `48` invites invisibles. |
| **`LA-F6`** | `Revendication LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` sous `F_NOCACHE` échoue `100%` de parité ou lit plus d’octets NVMe que `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Revendication LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`, `scripts/run_hf_air_mol_pretrained.py` ou `scripts/run_hf_qwen35_air_mol.py` diverge de $\ge 1$ token BPE par rapport à la cible gourmande. |
| **`LA-F8`** | `Revendication LA-8` (Regression suite) | `pytest -v` échoue à l’un des `26` tests dans `tests/`. |
| **`LA-F9`** | `Revendication LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` diverge de la parité de token `100%` ou lit plus d’octets NVMe que `AirLLM` ou `Expert-AirLLM`. |
| **`LA-F10`** | `Revendication LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` dépasse l’erreur maximale `1e-3` vs. multiplication matricielle binaire dense `ITQ` ou échoue `100%` de parité vérifiée. |
| **`LA-F11`** | `Revendication LA-11` (`48`-Task Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` accepte `> 0%` de commits cassés ou accepte une compétence Wave-1 obsolète sous mutation de spécification Wave-2. |
| **`LA-F12`** | `Revendication LA-12` (Metal `INT4` MoE) | `scripts/run_metal_moe_benchmark.py` dépasse l’erreur de shader `FP32` `1e-4` ou diverge de la parité de token gourmande `100%` sur `8.5B` ou `35B`. |
| **`LA-F13`** | `Revendication LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` accepte `> 0%` de correctifs cassés, modifie `tests/`, ou rate la mutation de spécification Wave-2 `R03`. |
| **`LA-F14`** | `Revendication LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` échoue OpenAI REST/SSE, `MCP` `JSON-RPC 2.0`, rechargement `.mol/`, ou horodate `measured_j`. |

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
</ol>

---

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## Annexe A. Reproductibilité

Depuis un checkout de [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit af152ba`)

```bash
PYTHONPATH=src .venv/bin/pytest -v
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
