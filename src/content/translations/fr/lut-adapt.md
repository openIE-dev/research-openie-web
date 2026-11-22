---
title: "Compilation descendante vers LUT6 dans une cascade Mixture of Limits : tissus booléens routés par Beneš, portes d'éveil conformes et diffusion NVMe Sparse-MoE de pointe"
deck: "Une cascade Mixture of Limits qui tente d'abord des circuits de table de correspondance à 6 entrées (LUT6) paginés, sans opération en virgule flottante (FLOP), diffuse les modèles hybrides et clairsemés Mixture-of-Experts (MoE) de fin 2026, en précision 4 bits via Non-Volatile Memory Express (NVMe), allant jusqu'à 34,66 milliards de paramètres, uniquement en cas d'échec de la voie précédente. Elle valide les écritures par des vérificateurs déterministes et compile les éveils certifiés, en descendant, vers des pages de RAM par blocs de 36 Kbit (RAMB36E2) routées par des réseaux de Beneš. Les durées réelles, les volumes d'octets lus sans tampon par Darwin F_NOCACHE (lecture de fichier sans tampon), la mémoire vive active, les cumuls de deltas du contrôleur de gestion de l'énergie (PMU) de l'ensemble du système macOS, ainsi que les simulations au niveau transfert entre registres (RTL) Yosys/Verilator sur xck26 sont rapportés à partir du commit a5e9bc1 de openIE-dev/lut-adapt-ai. Les énergies par tâche sont des estimations analytiques est_j ; aucune puissance mesurée sur le rail d'une carte isolée n'a été relevée."
lang: "fr"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*Révision 30613ef, 22 novembre 2026. Implémentation de référence et artefacts : [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) à [`a5e9bc1de280f973bc9051b4cc58942820a67eeb`](https://github.com/openIE-dev/lut-adapt-ai/tree/a5e9bc1de280f973bc9051b4cc58942820a67eeb). Résumé des données : [/data/#lut-adapt](/data/#lut-adapt). PDF LaTeX : [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([source](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Aperçu

Cette étude examine comment un système informatique peut compiler un travail neuronal répétitif vers le bas en consultations rapides de tables booléennes sans perdre l’exactitude de parité de sortie ni promouvoir des conjectures non vérifiées en règles de confiance. Elle rapporte des mesures logicielles, une synthèse au niveau transfert de registres et des simulations de cycles, ainsi que des estimations analytiques d’énergie étiquetées (`est_j`). Aucun moniteur de joules mural ou sur rail n’a été connecté dans ce dépôt (`measured_j` est non défini ; `board_metered` est faux).

**En termes simples**

1. La plupart des entrées qu’un système déployé rencontre répètent des motifs déjà résolus, de sorte qu’exécuter un réseau neuronal complet en virgule flottante à chaque étape gaspille calcul et bande passante mémoire.
2. La référence place un étage de consultation de table de vérité reconfigurable à 6 entrées (`LUT6`) en amont des modèles d’espace d’états en flux et des modèles de fondation, et compile les réponses vers le bas en pages de mémoire de consultation seulement après qu’une vérification explicite les ait certifiées.
3. Lorsque les modèles de langage hybrides et à mélange clairsemé d’experts de fin 2026 jusqu’à `34.66B` paramètres diffusent des poids 4 bits depuis un stockage à semi-conducteurs, les lectures d’experts clairsemés par routeur associées à ce brouillon `LUT6` à zéro FLOP réduisent les lectures disque jusqu’à `12.30×` (`6.50×` de débit de jetons plus rapide) dans `2.53` gigaoctets de mémoire active sans aucun changement des jetons de sortie ; le code de porte s’engage derrière une vérification déterministe surpasse la précision autonome de `35B` avec `0.00%` de commits cassés admis et accélère les tâches cristallisées de Wave-3 par `35,590×`.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termes, acronymes et étiquettes de mesure

<ul id="terms">
<li>MoL : Mixture of Limits, la règle en cascade provenant de Metered Commit Gates Part II [same house]</li>
<li>LA : préfixe de revendication et de falsificateur (LA-1 à LA-11, LA-F1 à LA-F11) utilisé dans cette étude</li>
<li>LUT, LUT6, INIT : table de correspondance, primitive booléenne Xilinx UltraScale+ à 6 entrées, et son masque d'initialisation de table de vérité 64 bits</li>
<li>BRAM, RAMB36E2, URAM : RAM de bloc, primitive UltraScale+ à double port de 36 Kbit (144 sur xck26), et UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260 : bloc logique configurable, bascule, tranche de traitement du signal numérique, et carte AMD Kria KV260 (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL : field-programmable gate array, application-specific integrated circuit, register-transfer level, cycles per lookup, place-and-route, worst negative slack, et Field-Programmable Logic conference</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU : Advanced eXtensible Interface, système de traitement Zynq, logique programmable, system-on-module, circuit intégré de surveillance d'alimentation embarqué, rail d'alimentation, Intel Running Average Power Limit, NVIDIA Management Library, et unité de gestion d'énergie macOS</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG : State Space Duality, state-space model, multiple-input multiple-output, rotary position embedding, gated linear unit activation, grouped-query attention, key-value cache, byte-pair encoding, large language model(s), Mixture-of-Experts, multilayer perceptron, et context-free grammar</li>
<li>HC, SOINN, WNN, DWN : hierarchy-context Self-Organizing Incremental Neural Network, weightless neural network, et Differentiable Weightless Neural Network</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC : Joint-Embedding Predictive Architecture, Energy-Based Reasoning Model, Adaptive Conformal Inference, out-of-distribution, area under the receiver operating characteristic, maximum softmax probability, et Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF : Prompt Lookup Decoding, Retrieval-Based Speculative Decoding, Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LFM2.5-350M et LFM2.5-8B-A1B), Liquid Foundation Model 3 (oct. 2026 LiquidAI/LFM3-1.7B), et HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR : singular value decomposition, Iterative Quantization Procrustes hypercube rotation, sign-value-independent decomposition, quantization-aware training, post-training quantization, perplexity, et signal-to-noise ratio</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB : Non-Volatile Memory Express storage, Darwin F_NOCACHE unbuffered file flag, Portable Operating System Interface, random-access memory, dynamic RAM, static RAM, input/output, kilobyte, megabyte, et gigabyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, FP16, FP32, INT4 : opération(s) en virgule flottante, millions de FLOP, opération(s) de multiplication-accumulation, instruction unique données multiples, différenciation automatique, différence finie, bits par octet, virgule flottante 16/32 bits et entier 4 bits</li>
<li>RCE, WCA, VC, SWE : Reality Code Engine [même maison], Wise Computer Automation [même maison], achèvement vérifié et préfixe de banc d’essai en génie logiciel</li>
<li>CLI, HTTP, SSE, API, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW : interface en ligne de commande, protocole de transfert hypertexte, événements envoyés par le serveur, interface de programmation d’application, lieux académiques d’informatique et de génie, système d’exploitation, unité centrale/unité de traitement graphique et logiciel</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XNOR : réseau local virtuel (IEEE 802.1Q), sécurité de la couche de transport, inspection profonde de paquets, arbre syntaxique abstrait, notation objet JavaScript, valeurs séparées par des virgules, algorithme de hachage sécurisé, contrôle de redondance cyclique, mode de transfert asynchrone (CRC-8/ATM), demande de commentaires, langage de requête structuré, encodage DWARF base-128 petit-boutiste signé, mémoire adressable par le contenu et NON-EXCLUSIF</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, DSP48E2, URAM288, AMD : port de débogage du groupe d’action de test conjoint, débogueur en ligne de commande Xilinx Software, port d’accès au débogage, bus série universel, Future Technology Devices International et son circuit intégré FT2232C pont double UART/FIFO, récepteur-émetteur asynchrone universel, tampon premier entré premier sorti, circuit intégré, automatisation de la conception électronique, mode de synthèse hors contexte, architecture de bus de microcontrôleur avancée, interconnexion AXI4-Lite/AXI4-Stream, bloc d’entrée/sortie, tampons d’entrée/sortie, bascules D à réinitialisation/préréglage synchrone, tables de correspondance UltraScale+ à 1 à 5 entrées, multiplexeurs UltraScale+ à 7/8 entrées, chaîne de retenue rapide 4 bits, tranche DSP UltraScale+, UltraRAM de 288 Kbit et Advanced Micro Devices</li>
</ul>

Trois classes de preuves restent séparées dans chaque tableau ci-dessous :

| Étiquette de preuve | Signification dans cette étude |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Comptes d’octets exacts lus ou écrits via `os.pread` sous Darwin `F_NOCACHE`, allocations de mémoire résidente, secondes d’horloge murale, énergie cumulative du `PMU` macOS complet (`AppleSmartBattery.PowerTelemetryData`) sur Apple M5 Max, et accord exact bit/jeton. `measured_j` est non défini (`None`). |
| **`Simulated (RTL)`** | Comptes de netlist structurels provenant de Yosys `0.71+` (`synth_xilinx -family xcup` ciblant Kria KV260 `xck26`) et comptes de cycles (`CPI = 1`) provenant de Verilator `5.054`. Pas de clôture de timing Vivado et pas d’énergie de carte (`board_metered = false`). |
| **`Estimated (est_j)`** | Joules analytiques calculés à partir des comptes d’opérations ou de substituts temporels de puissance thermique (`joule_meter.py`) lorsqu’il n’y a pas de compteurs matériels `RAPL`/`NVML` sur macOS. Comparables uniquement entre les branches d’une même formule ; jamais des watts silicium. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Contexte architectural et contributions

Dans [Portes d'engagement mesurées](/papers/gates/) `[same house]`, la Partie II définit **Mixture of Limits** : essayez les engrenages par ordre décroissant de probabilité de passage par joule $p_i / c_i$ (Simon et Kadane, 1975), arrêtez-vous dès que le prédicat d'achèvement de tâche $C(z) = 1$ devient vrai, et interdisez le renforcement de la sortie `ModelGenerated` en `Deterministic`. Un niveau de recherche statique, toutefois, ne couvre que les entrées écrites avant le déploiement. Inversement, les réseaux neuronaux à tables de recherche existants, LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022), et Differentiable Weightless Neural Networks (Bacellar et al., 2024), figent la connectivité des fils dans le routage FPGA statique, nécessitant un placement-et-routage du fournisseur à chaque déplacement de la distribution d’entrée.

La référence `lut-adapt-ai` ferme la boucle entre le sommet et la base de la cascade via **compilation en ligne descendante `LUT6`** :

- **Rung 0 (Lookup, Beneš paginé + `LUT6`)** : Évalue des masques de tables de vérité de 64 bits acheminés via un commutateur multicast **Beneš-Copy-Beneš** non bloquant $512 \times 512$ et mis en cache sur $81 \times \texttt{RAMB36E2}$ mémoires à blocs double-port (`0` opérations en virgule flottante, commutation de page en un cycle dans la simulation Verilator).
- **Rung 1 (Stream, `Mamba-3` Complex MIMO State Space Duality)** : Gère les ratés qui dépendent de l'historique de séquence en utilisant un état récurrent de taille constante $O(1)$ (`48 KB` mémoire épinglée dans la référence `14.3M`-paramètre), évitant une croissance du cache clé-valeur $O(L)$.
- **Rung 2 (Topology, `HC-SOINN`)** : Maintient en ligne la topologie de prototypes sur les embeddings latents, en isolant les frontières de régime et en déclenchant un disjoncteur (`Refuse` / escalade) lorsqu'un décalage de distribution non étiquetée survient.
- **Rung 3 (Model last, `JEPA-EBRM`, `AirMoL`, and `Expert-AirMoL` 4-Bit NVMe Streaming)** : Invoque une vérification latente basée sur l'énergie ou diffuse des modèles de fondation hybrides et Sparse-MoE pré-entraînés fin-2026 (`LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it`, `LiquidAI/LFM2.5-8B-A1B`, et `Qwen/Qwen3.6-35B-A3B`, ainsi que `LiquidAI/LFM2.5-350M` et `Qwen/Qwen3.5-0.8B-Base`) uniquement lorsque les échelons moins coûteux s’abstiennent ou nécessitent une vérification cible exacte.
- **Downward `SleepCrystallizer`** : Extrait les traces d'éveil récurrentes à l'aide de démarrages à chaud spectraux Walsh-Hadamard, de tables de vérité de mintermes en mode joint, et de plannings de commutateurs Waksman, en basculant les banques de mémoire bloc ombrées sans interrompre l’inférence ni lancer le placement-et-routage FPGA.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Contributions

1. **Condition de compilation descendante amortie** : Étend l'ordonnancement $p_i/c_i$ de Simon-Kadane par un coût explicite de compilation $E_{\text{compile}}$ sur un horizon stationnaire $\Delta T$.
2. **Architecture Beneš-Copy-Beneš non bloquante $512 \times 512$ et `81`-`RAMB36E2` RTL** : Élimine à la fois le débordement logique `102.0%` Kria KV260 des crossbars plats (`119,478` LUTs) et l'explosion à `926,619` LUTs des multiplexeurs de pages à bascules, pour une synthèse à `41,186` CLB LUTs UltraScale+ (`35.2%` de `xck26`), `81` blocs `RAMB36E2` (`56.2%`), et `0` tranches `DSP48` avec commutation de page en `1` cycle (`4.0 ns` à `250 MHz` nominal) en simulation.
3. **Synthèse universelle de mintermes en mode joint pour $\le 64$ bits** : Montre que la consultation de mintermes en mode joint domine l'arrondi DiffLogic marginal par plan de bits sur les branches corrélées et compacte $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ jetons de sous-mots dans un mot `uint64` (`16b × 4 = 64b` pour `|V| = 65,536` ; `17b × 3 = 51b` pour `|V| = 128,000` ; `18b × 3 = 54b` pour `|V| = 248,320`).
4. **Porte de cristallisation Split-Conformal + ACI en ligne sans oracle** : Associe un score de non-conformité latent `JEPA-EBRM` régularisé radialement à une calibration Split Conformal et à l'Adaptive Conformal Inference (Gibbs et Candès, 2021), enregistrant un risque de fausse cristallisation de `0.00%` et un AUROC OOD de `1.0000` sur du trafic décalé où les lignes de base softmax et MC-Dropout enregistrent un risque faux de `17.62%-24.28%`.
5. **`AirMoL` et `Expert-AirMoL` diffusion NVMe 4 bits jusqu'à `34.66B` Sparse-MoE** : Combine le partitionnement 4 bits `F_NOCACHE` `os.pread` de Darwin, les lectures d'experts à pas d'octet indexées par routeur `.experts.pack4`, le rollback d'état hybride et la spéculation en rafale de jetons-`LUT6` en ligne sur `LiquidAI/LFM3-1.7B` d'octobre 2026 (`2.74×` de réduction NVMe dans `3.79%` de la RAM FP32), `LiquidAI/LFM2.5-8B-A1B` (`8.47B` ; `6.90×` de réduction NVMe) et `Qwen/Qwen3.6-35B-A3B` (`34.66B` ; **`12.30×` de réduction NVMe**, **`2,530.7 MB` de RAM = `3.83%` de FP16**, **`6.50×` d'accélération**) à une parité exacte de jetons de `100.0%`.
6. **`Sub1Bit-LUT6` à zéro-MAC contre `LittleBit` et cascade de codage de pointe fin 2026 à vérification contrôlée** : Remplace les `1.98M` MAC binaires à l'exécution de `LittleBit-1 / LittleBit-2` (`0.576` bit par poids ; Lee et al., 2025 ; Lee et Kim, 2026) par une consultation de somme partielle `LUT6` à `6` entrées sans MAC (`< 4 × 10⁻⁶` d'erreur, `100.0%` de parité sous vérification `MoL` cible en `0` époque QAT), et surpasse les modèles autonomes `LittleBit-2 0.55bpw`, `LFM3-1.7B`, `Gemma-4-E2B-it`, `LFM2.5-8B-A1B`, `Qwen3.6-35B-A3B` et `RouteLLM` sur un benchmark de codage à `48` tâches (`16` spécifications × `3` vagues) (`43.75%` contre `0.00%-33.33%`) avec **`0.00%` de commits cassés admis** et **`35,590×` d'accélération de compétence cristallisée en vague 3**, soutenu par une vérification polyglotte en cinq langages.

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

### 4.8 Revendication LA-8 : serveur de streaming CLI et HTTP/SSE en direct (`mol_code_cli.py`)

`scripts/mol_code_cli.py` sert `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` et `--air-nvme` via les points d'accès CLI et SSE (`/v1/health`, `/v1/complete`, `/v1/crystallize`), faisant progresser la résidence du slot `RAMB36E2` de `438/512` à `460/512` en direct avec `22/22` tests réussis dans `tests/`.

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

### 4.11 Revendication LA-11 : `48`-tâches (`16` spécifications × `3` vagues) concours de codage de pointe fin-2026

| Arm système fin-2026 (`48` tâches = `16` spécifications × `3` vagues) | V1 Froide | V2 Adapt | V3 Chaude | Réussite globale | Commits brisés | V3 `Rung 0/1` Part | `35B` Appels | Latence moyenne V3 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT (`1`-Shot) | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `19,946 ms` |
| `B` `LiquidAI/LFM3-1.7B` (Oct 2026 Tri-Hybrid, `1`-Shot) | `18.75%` | `6.25%` | `6.25%` | `10.42%` | `89.58%` | `0.00%` | `0.0%` | `3,561 ms` |
| `C` `google/gemma-4-E2B-it` (`2026` Hybrid, `1`-Shot) | `6.25%` | `0.00%` | `0.00%` | `2.08%` | `97.92%` | `0.00%` | `0.0%` | `8,886 ms` |
| `D` `LiquidAI/LFM2.5-8B-A1B` (`8.47B` MoE, `1`-Shot) | `18.75%` | `12.50%` | `12.50%` | `14.58%` | `85.42%` | `0.00%` | `0.0%` | `14,221 ms` |
| `E` `Qwen/Qwen3.6-35B-A3B` (`34.66B` `Expert-AirMoL`, `1`-Shot) | `37.50%` | `31.25%` | `31.25%` | `33.33%` | `66.67%` | `0.00%` | `100.0%` | `98,435 ms` |
| `F` `RouteLLM` Confidence Router (`LFM3` $\to$ `Gemma4` $\to$ `8B`) | `18.75%` | `6.25%` | `6.25%` | `10.42%` | `89.58%` | `0.00%` | `0.0%` | `3,561 ms` |
| **`G` `MoL` `VerifiedCodeCascade` (Reference)** | **`43.75%`** | **`43.75%`** | **`43.75%`** | **`43.75%`** | **`0.00%`** | **`43.75%`** | **`62.5%`** | **`143,649 ms` (`2.54 ms` solved)** |

Dans le cadre du protocole `48`-tâches et du banc d’essai algorithmique (arithmétique sérielle RFC 1982, lignes de balayage d’intervalles pondérées, tri topologique lexicographique sûr pour les cycles, seaux de jetons en nanosecondes, CRC-8/ATM et CRC-8 muté `0xFF`, dés-échappement `~01` du pointeur JSON RFC 6901, Bellman-Ford à sauts bornés, médianes de fenêtre exactes `>2⁵³`, Damerau-Levenshtein illimité, routage `4×4` Beneš, paramétrisation littérale SQL, somme de sous-séquence monotone-deque, DWARF SLEB128, hachage cohérent SHA-256, et quantiles conformes ; delta du système complet macOS `PMU` `126,947.30 J`), `VerifiedCodeCascade` surpasse chaque modèle autonome et chaque routeur sur chaque vague (`43.75%` contre `33.33%` pour `35B`), accepte **`0.00%` commits brisés** (vs. `66.67%-100.00%`), capte en toute sécurité les `3` recherches adverses de dérive de spécifications des Vagues 2/3 via $C(z)$, et réduit la latence moyenne de la Vague-3 pour les `7` compétences cristallisées de **`90,324.2 ms`** à **`2.54 ms` (`35,590×` accélération)**.

<div id="412-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.9 Décomposition primitive du sous-système complet `xck26-sfvc784-2LV-c`, profondeur topologique et sonde matérielle `Vivado 2026.1`

Pour auditer à la fois le cœur spéculatif autonome à `512` pages (`clai_benes_paged_hotswap_core` dans `hw/kv260/rtl/clai_benes_hotswap_core.sv`) et le sous-système Rung-0 complet Advanced Microcontroller Bus Architecture (`AMBA`) `AXI4-Lite` + `AXI4-Stream` (`clai_kv260_axi_top` dans `hw/kv260/rtl/clai_kv260_axi_top.sv`, `clai_engram_streamer.sv`, `clai_rung0_hotswap_core.sv` et `artifacts/clai_rung0_kv260.v` au commit `a5e9bc1de280`) vis-à-vis de la puce AMD Kria KV260 exacte (`xck26-sfvc784-2LV-c` : `117 120` LUT CLB, `234 240` bascules CLB, `144` blocs `RAMB36E2`, `64` blocs UltraRAM (`URAM288`) de 288 Kbit, `1 248` tranches de traitement du signal numérique UltraScale+ (`DSP48E2`) et `189` blocs d'entrée/sortie utilisateur (`IOB`)), nous avons exécuté trois vérifications matérielles et d'automatisation de la conception électronique (`EDA`) sur une station de travail `Intel Core i9-13900H` (`Linux 7.0.0-43-generic x86-64`) :

1. **Sonde JTAG (Joint Test Action Group) et USB (Universal Serial Bus) en lecture seule (`Xilinx hw_server v2026.1` + Xilinx Software Command-Line Tool (`XSDB`))** : Bien que `lsusb` ait signalé la présence d'un pont Future Technology Devices International (`FTDI`) `0403:6010` (circuit intégré (`IC`) `FT2232C/D/H` à double émetteur-récepteur asynchrone universel (`UART`) / mémoire tampon premier entré, premier sorti (`FIFO`)), l'inspection des chaînes de fabricant et de produit USB du système de fichiers Linux `sysfs` (`idVendor = 0403`, `idProduct = 6010`) a identifié le dispositif comme `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"`, et non comme une carte porteuse Kria KV260. L'interrogation de `hw_server v2026.1` (build du 29 mai 2026) via `xsdb` (`connect; jtag targets; targets`) a renvoyé **`0` dispositif JTAG Xilinx et `0` cible de port d'accès au débogage (DAP)** (`board_metered = false`, `measured_j = None`).
2. **Synthèse par lots `Vivado 2026.1` et verrou de licence (`SW Build 6511674`)** : Un script par lots non projet, reproductible et à faible empreinte (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, ciblant `xck26-sfvc784-2LV-c` à `250.0 MHz` / `4.000 ns` en mode hors contexte (`OOC`)) a été préparé pour `/tools/Xilinx/2026.1/Vivado/bin/vivado`. Le lancement de `vivado v2026.1` en mode par lots s'est interrompu avant `synth_design` (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`), car AMD `Vivado 2025.1+` / `2026.1` exige un fichier `.lic` Standard/Enterprise explicitement généré par l'utilisateur (`~/.Xilinx/Xilinx.lic` ou `XILINXD_LICENSE_FILE`), même pour les composants `xck26` de niveau Standard, et qu'aucun fichier `.lic` n'était installé sur la station de travail. Conformément aux règles strictes de mesure, le `WNS` post-routage, la fréquence d'horloge maximale après placement et routage, ainsi que `report_power` sans vecteurs (`est_j`) restent enregistrés comme `not_available` tant qu'un fichier `.lic` Standard n'a pas été fourni.
3. **Décomposition primitive complète du sous-système UltraScale+ `xcup`, budget `IOB` et audit topologique des niveaux logiques (`Yosys 0.71+`)** : La synthèse de `clai_benes_paged_hotswap_core` et de `clai_kv260_axi_top` via `synth_xilinx -family xcup` et `ltp -noff` (en enregistrant le `reported_j` du `RAPL package-0` de l'hôte strictement comme coût de compilation `EDA` `x86-64` $E_{\text{compile}}$, et jamais comme puissance du silicium FPGA) a permis d'établir les nombres exacts de cellules et les profondeurs combinatoires du chemin critique.

| `xck26-sfvc784-2LV-c` Module cible | LUTs CLB (`% xck26`) | Primitifs LUT dominants | Registres CLB (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | Ports supérieurs (`IBUF`+`OBUF`) | Profondeur combinatoire (`ltp`) | Synthèse hôte `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` pages) | **`41,185`** (`35.17%`) | `19,982 LUT3`, `7,804 LUT6`, `7,714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36,464`** (`15.57%`) | **`81`** (`56.25%`) | **`0`** | `1,599` (`OOC` / bus interne) | **`81` niveaux** | `7,297.3 J` (`144.8 s`) |
| **`clai_kv260_axi_top`** (`AXI4` Rung-0 sous-système) | **`67,366`** (`57.52%`) | `25,557 LUT6`, `25,333 LUT5`, `7,918 LUT3`, `569 CARRY4` | **`16,619`** (`7.09%`) | **`4`** (`2.78%`) | **`0`** | `126` (`<= 189` `IOB`s; `PS-PL`) | **`73` niveaux** | `10,089.4 J` (`214.8 s`) |

Deux contraintes physiques concrètes de conception émergent de la primitive `xcup` et de l’audit `ltp` :
- **Confinement du budget de broches (`OOC` vs. `PS-PL` `AXI` wrapper)** : Parce que `clai_benes_paged_hotswap_core` expose le `CodeBitBus` brut de `512` bits et des vecteurs de configuration d’ombre larges (`1,379` tampons d’entrée (`IBUF`) + `220` tampons de sortie (`OBUF`) = `1,599` ports contre `189` `IOB` du package sur `xck26-sfvc784-2LV-c`), une implémentation fournisseur autonome doit être exécutée avec `synth_design -mode out_of_context` ou à l’intérieur d’un wrapper `AXI4-Stream` / `zynq_ultra_ps_e` tel que `clai_kv260_axi_top` (`126` ports, `57.52%` d’utilisation des LUT).
- **Profondeur combinatoire non pipeline (`81` et `73` niveaux) vs. fermeture `250 MHz` (`4.000 ns`) `-2LV`** : Bien que Verilator `5.054` vérifie un `CPI = 1.0` exact au cycle (`1` recherche par cycle d’horloge), le parcours de `17` étapes `Beneš-1` + `9` étapes de copie de préfixe + `17` étapes `Beneš-2` + multiplexage dynamique de table de vérité `LUT6` + réduction majoritaire à `5` votants dans un unique cycle combinatoire couvre **`81` niveaux primitifs** (`73` niveaux dans le popcount combinatoire à `64` entrées et le comparateur de marge à `8` classes de `clai_kv260_axi_top`). Fermer à `250 MHz` (`4.000 ns`) post-place-and-route sur du silicium à basse tension (`0.72 V`) `-2LV` favorise donc l’insertion de `2` à `3` étages de registre pipeline à travers $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ (et `1` étage de registre entre l’arbre popcount à `64` fils et le comparateur supérieur `2`), en préservant le débit `CPI = 1.0` (`1` contexte par horloge) sur `3`-`4` cycles de latence pipeline.

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Travaux connexes et observations de convergence

| Système | Identifiant / Lieu | Ce qu'il établit | Coût tel que rapporté | Différence dans cette référence |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Réseaux neuronaux quantifiés et parcimonieux compilés en LUT FPGA. | Synthèse FPGA des LUT et de la Fmax. | Les câblages statiques exigent un re-PAR Vivado à chaque décalage, contre un cycle `1` pour Beneš + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Réseaux différentiables de portes booléennes et de LUT sans poids. | Nombre de portes et précision. | Le routage statique tombe à `52.34%` lors d'un décalage VLAN et souffre de chimères marginales sur les plans de bits. |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Produits matriciels ternaires ou de faible précision par recherche en table sur CPU/FPGA. | Latence et puissance FPGA. | Accélère l'algèbre linéaire à l'intérieur d'un palier de modèle ; ne contourne pas l'invocation du modèle. |
| **LittleBit** (Lee et al., 2025) & **LittleBit-2** (Lee and Kim, 2026) | `arXiv:2506.13771` · `arXiv:2603.00042` | Factorisation latente binaire en moins d'un bit (`0.1-0.58` bit/poids) via `SVD` / `ITQ` et QAT de `5` époques. | Compression (`11.6×-31×`), PPL et précision QAT. | Dépaquète les bitpacks vers des MAC binaires denses à l'exécution et tombe à `0.00%` sur un codage exact (`Claim LA-11`) ; `Sub1Bit-LUT6` utilise `0` MAC binaire et `MoL` restaure une parité de `100.0%` en `0` époque QAT. |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Cascades de LLM du faible au fort et routeurs fondés sur les préférences. | Prix API en dollars vs. qualité. | Ne dispose pas d'une porte déterministe $C(z)$ (`89.58%` de commits rompus dans `Claim LA-11`) ni d'un compilateur descendant vers `LUT6`. |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Routage bandit multi-LLM et service à fréquence adaptée. | Wh GPU déclarés par les auteurs (`Zeus` / `pyNVML`). | Optimise le service GPU ; cette référence compile les éveils en pages `LUT6` à `0` FLOP (`est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Brouillons neuronaux MLP, arbres de brouillons et brouillons en cascade pour le décodage spéculatif. | Accélération en temps réel. | Exigent des FLOP de brouillon et des lectures de poids, contre des pages `LUT6` `uint64` à `0` FLOP. |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Brouillons sans FLOP par n-grammes du prompt et par arbres suffixes de magasin de données. | Accélération de latence (`0` FLOP). | `PLD` manque les jetons hors prompt ; `REST` utilise des arbres de taille variable contre des pages `RAMB36E2`. |
| **AirLLM** (lyogavin, 2023) | Diffuseur SSD open source | Diffusion des poids couche par couche depuis un SSD dans une faible quantité de RAM. | Empreinte RAM active. | `T=1` pur (`1.0 tok/balayage`) + débordement KV, contre une réduction de balayage `AirMoL` de `2.74×-2.86×`. |
| **Metered Commit Gates** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Portes de validation (lecture `11,428 pJ` du SOM KV260 `INA260`), MoL $p_i/c_i$ et `RCE-JEPA`. | `measured_j` + `est_j` du SOM KV260. | Fondement de la même maison ; étendu ici par la compilation descendante Beneš `LUT6` et `AirMoL`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. Limites, menaces à la validité, non réclamées, et falsificateurs

**Validité interne et de construction.** Sous un bruit aléatoire uniforme ou un churn adversarial par étape ($\Delta T = 1$), la Proposition 1 ne donne aucune économie de compilation descendante et retombe à `1.00 tok/sweep`. La parité sans perte (`100.0%`) garantit un accord bit-pour-bit avec le décodage greedy cible sans relever le plafond de capacité d’un point de contrôle de base `350M` ou `0.8B`.

**Validité de la mesure et non réclamé.** Les nombres en joules par tâche (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`) sont des valeurs analytiques `est_j` (`measured_j = None`), et les deltas cumulatifs du `PMU` macOS incluent l’affichage du système complet, le SSD et la charge d’arrière-plan de l’OS plutôt que des watts isolés de rail de puce. Yosys `0.71+` et Verilator `5.054` établissent une synthèse de netlist structurale `xck26` et une simulation de cycle `CPI = 1`, mais pas la fermeture temporelle post-PAR `250 MHz` de Vivado ni les watts physiques de rail KV260 (`board_metered = false`). Le leadership énergétique du silicium, la promotion des sorties `ModelGenerated` vers `Deterministic`, l’évaluation à l’échelle du dépôt complet `SWE-bench` au-delà du benchmark contractuel `48`-tâches, et les exécutions mesurées `70B` (`air_mol_nvme_baselines.csv` signale des projections analytiques `70B` au-delà des exécutions mesurées `34.66B` `Qwen3.6-35B-A3B`) ne sont pas réclamés.

| ID | Affirmation | Condition exacte de réfutation / falsification |
| :--- | :--- | :--- |
| **`LA-F1`** | `Affirmation LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` échoue à la parité Verilator à `100.0%` sur `5,120` paquets ou manque le décalage VLAN du paquet-`2,500`. |
| **`LA-F2`** | `Affirmation LA-2` (suite Polyglot) | Zig alloue `> 0` octets de tas en boucle chaude, Go rapporte `> 0 allocs/op`, ou Julia Enzyme dépasse une erreur FD de `1e-7`. |
| **`LA-F3`** | `Affirmation LA-3` (RTL paginé KV260) | `scripts/verify_paged_bram_rtl.py` dépasse `117,120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s, ou `1` cycle par commutation de page. |
| **`LA-F4`** | `Affirmation LA-4` (ACI conforme) | `scripts/run_frontier_benchmarks.py` dépasse le risque faux cible $\alpha = 0.02$ sur le trafic décalé ou marque `Deterministic`. |
| **`LA-F5`** | `Affirmation LA-5` (Spéculation d'octets) | `scripts/run_code_corpus_benchmark.py` produit une parité octet exacte `< 100.0%` par rapport à `Mamba3CodeLM` glouton sur `48` invites non vues. |
| **`LA-F6`** | `Affirmation LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` sous `F_NOCACHE` échoue à la parité `100%` ou lit plus d'octets NVMe que `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Affirmation LA-7` (`AirMoL` HF 2026) | `scripts/run_hf_lfm3_air_mol.py`, `scripts/run_hf_air_mol_pretrained.py` ou `scripts/run_hf_qwen35_air_mol.py` diverge de $\ge 1$ jeton BPE par rapport à la cible gloutonne. |
| **`LA-F8`** | `Affirmation LA-8` (Suite de régression) | `pytest -v` échoue sur l'un des `22` tests dans `tests/`. |
| **`LA-F9`** | `Affirmation LA-9` (MoE `8.5B/35B`) | `scripts/run_hf_moe_8b_35b_air_mol.py` diverge de la parité jeton à `100%` ou lit plus d'octets NVMe que `AirLLM` ou `Expert-AirLLM`. |
| **`LA-F10`** | `Affirmation LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` dépasse une erreur maximale de `1e-3` par rapport au produit matriciel binaire dense `ITQ` ou échoue à la parité vérifiée à `100%`. |
| **`LA-F11`** | `Affirmation LA-11` (Bakeoff `48`-Tâches) | `scripts/run_frontier_ai_bakeoff.py` admet `> 0%` de commits cassés ou admet une compétence Wave-1 obsolète sous mutation de spécification Wave-2. |

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

À partir d'un checkout de [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit a5e9bc1`):

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
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
```
