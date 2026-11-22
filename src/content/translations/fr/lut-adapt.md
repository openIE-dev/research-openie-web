---
title: "Compilation descendante vers LUT6 dans une cascade Mixture of Limits : tissus booléens routés par Beneš, portes d'éveil conformes et diffusion NVMe 4 bits par couche"
deck: "Une cascade Mixture of Limits (mélange de limites) à quatre échelons qui essaie d'abord des circuits paginés à tables de correspondance à 6 entrées (LUT6) à zéro opération en virgule flottante (FLOP), ne réveille Mamba-3 et les modèles hybrides 2026 diffusés en 4 bits via Non-Volatile Memory Express (NVMe) qu'en cas d'échec, et compile de manière descendante les éveils certifiés dans des pages de Block RAM de 36 Kbits (RAMB36E2) routées par réseau de Beneš. Les temps muraux, les nombres d'octets lus sans tampon sous Darwin F_NOCACHE (lecture de fichier non tamponnée), la mémoire vive (RAM) active et les simulations au niveau transfert de registres (RTL) Yosys/Verilator sur xck26 sont rapportés depuis openIE-dev/lut-adapt-ai au commit 9dbf745. Les chiffres d'énergie sont des estimations analytiques est_j ; aucune puissance sur carte n'a été mesurée."
lang: "fr"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-4-bit-nvme-layer-streaming" class="anchor-alias" aria-hidden="true"></div>

*Révision 11dbc8c, 22 novembre 2026. Implémentation de référence et artefacts : [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) au commit [`9dbf745f6ea7aecba26a70482138e0f2d8bbe9c0`](https://github.com/openIE-dev/lut-adapt-ai/tree/9dbf745f6ea7aecba26a70482138e0f2d8bbe9c0). Synthèse des données : [/data/#lut-adapt](/data/#lut-adapt). PDF LaTeX : [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([source](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Vue d'ensemble

Cette étude examine comment un système informatique peut compiler de manière descendante le travail répété d'un modèle neuronal en consultations rapides de tables booléennes sans perdre la parité exacte des sorties ni promouvoir des conjectures non vérifiées au rang de règles de confiance. Elle rapporte des mesures logicielles, des synthèses au niveau transfert de registres et des simulations au cycle près, ainsi que des estimations analytiques d'énergie explicitement étiquetées (`est_j`). Aucun wattmètre mural ni capteur de rail en joules n'a été branché dans ce dépôt (`measured_j` n'est pas renseigné ; `board_metered` vaut `false`).

**En termes simples**

1. La plupart des entrées que reçoit un système déployé répètent des motifs qu'il a déjà résolus ; exécuter un réseau neuronal complet en virgule flottante à chaque pas gaspille donc du calcul et de la bande passante mémoire.
2. L'implémentation de référence place un échelon reconfigurable de tables de vérité à 6 entrées (`LUT6`) en amont des modèles d'espace d'états en flux et des modèles de fondation, et ne compile de manière descendante les réponses vers des pages mémoire de consultation qu'après qu'une vérification explicite les a certifiées.
3. Lorsqu'un modèle de langage hybride de 2026 diffuse ses poids couche par couche depuis un disque SSD, ce rédacteur préliminaire `LUT6` à zéro FLOP propose des rafales de plusieurs tokens que le modèle cible vérifie en un seul balayage disque, réduisant les lectures disque de près de `3×` sans aucune modification des tokens produits.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termes, acronymes et étiquettes de mesure

<ul id="terms">
<li>MoL: Mixture of Limits (mélange de limites), la règle de cascade issue de Portes de validation mesurées, Partie II [same house]</li>
<li>LA: préfixe des affirmations et des réfutateurs (LA-1 à LA-8, LA-F1 à LA-F8) utilisé dans cette étude</li>
<li>LUT, LUT6, INIT: table de correspondance (look-up table), primitive booléenne à 6 entrées Xilinx UltraScale+, et son masque d'initialisation de table de vérité sur 64 bits</li>
<li>BRAM, RAMB36E2, URAM: Block RAM, la primitive Block RAM double port de 36 Kbits d'UltraScale+ (144 sur xck26), et UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: bloc logique configurable, bascule (flip-flop), tranche de traitement numérique du signal, et carte AMD Kria KV260 (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: réseau de portes programmables in situ, circuit intégré spécifique à une application, niveau transfert de registres, cycles par consultation, placement-routage, pire marge négative (worst negative slack), et conférence Field-Programmable Logic</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML: Advanced eXtensible Interface, système de traitement Zynq, logique programmable, système sur module, circuit intégré de surveillance de puissance embarqué, rail d'alimentation, Intel Running Average Power Limit, et NVIDIA Management Library</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: dualité d'espace d'états (State Space Duality), modèle d'espace d'états, entrées multiples sorties multiples, encodage positionnel rotatif, activation par unité linéaire à porte, attention à requêtes groupées, cache clé-valeur, encodage par paires d'octets, grand(s) modèle(s) de langage, mélange d'experts (Mixture-of-Experts), perceptron multicouche, et grammaire hors contexte</li>
<li>HC, SOINN, WNN, DWN: réseau neuronal incrémental auto-organisateur à contexte hiérarchique (hierarchy-context Self-Organizing Incremental Neural Network), réseau neuronal sans poids, et réseau neuronal sans poids différentiable (Differentiable Weightless Neural Network)</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: architecture prédictive à plongement conjoint (Joint-Embedding Predictive Architecture), modèle de raisonnement à base d'énergie (Energy-Based Reasoning Model), inférence conforme adaptative (Adaptive Conformal Inference), hors distribution, aire sous la courbe caractéristique de fonctionnement du récepteur, probabilité softmax maximale, et Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, HF: Prompt Lookup Decoding, décodage spéculatif fondé sur la recherche documentaire (Retrieval-Based Speculative Decoding), Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LiquidAI/LFM2.5-350M), et HuggingFace</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB: stockage Non-Volatile Memory Express, indicateur de fichier non tamponné Darwin F_NOCACHE, Portable Operating System Interface, mémoire vive, RAM dynamique, RAM statique, entrées/sorties, kilo-octet, mégaoctet, et gigaoctet</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, SIMD, AD, FD, BPB, FP16, FP32, INT4: opération(s) en virgule flottante, million(s) de FLOPs, multiplication-accumulation, instruction unique données multiples, différentiation automatique, différences finies, bits par octet, virgule flottante 16/32 bits, et entier 4 bits</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house], Wise Computer Automation [same house], achèvement vérifié (verified completion), et préfixe de banc d'essai de génie logiciel</li>
<li>CLI, HTTP, SSE, API, ACL, OS, CPU, GPU, SW: interface en ligne de commande, Hypertext Transfer Protocol, Server-Sent Events, interface de programmation d'applications, Association for Computational Linguistics, système d'exploitation, unité centrale ou graphique de traitement, et logiciel</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CAM, XNOR: réseau local virtuel (IEEE 802.1Q), Transport Layer Security, inspection approfondie des paquets, arbre syntaxique abstrait, JavaScript Object Notation, valeurs séparées par des virgules, Secure Hash Algorithm, mémoire adressable par le contenu, et NON-OU exclusif</li>
</ul>

Trois classes de preuves restent strictement séparées dans chaque tableau ci-dessous :

| Étiquette de preuve | Signification dans cette étude |
| :--- | :--- |
| **`Measured (SW / NVMe I/O)`** | Nombres exacts d'octets lus ou écrits via `os.pread` sous Darwin `F_NOCACHE`, allocations mémoire résidente, temps mural en secondes sur Apple M5 Max et concordance exacte au bit ou au token près. `measured_j` n'est pas renseigné (`None`). |
| **`Simulated (RTL)`** | Comptages de listes d'interconnexions structurelles issus de Yosys `0.71+` (`synth_xilinx -family xcup` ciblant la carte Kria KV260 `xck26`) et nombres de cycles (`CPI = 1`) issus de Verilator `5.054`. Il ne s'agit ni d'une clôture temporelle Vivado ni d'une puissance mesurée sur carte (`board_metered = false`). |
| **`Estimated (est_j)`** | Joules analytiques calculés à partir de comptages d'opérations ou de substituts temporels d'enveloppe thermique (`joule_meter.py` en repli lorsque les compteurs matériels `RAPL`/`NVML` sont absents sous macOS). Comparables uniquement entre variantes soumises à la même formule ; jamais assimilables à des watts sur silicium. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Contexte architectural et contributions

Dans [Portes de validation mesurées](/papers/gates/) `[same house]`, la Partie II définit **Mixture of Limits (mélange de limites)** : essayer les engrenages par ordre décroissant de probabilité de réussite par joule $p_i / c_i$ (Simon et Kadane, 1975), s'arrêter dès que le prédicat de complétude de la tâche $C(z) = 1$ est vérifié, et interdire tout renforcement d'une sortie `ModelGenerated` en `Deterministic`. Un échelon de consultation statique ne couvre toutefois que les entrées qui y ont été inscrites avant le déploiement. Inversement, les réseaux neuronaux existants à tables de correspondance, tels que LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022) et les Differentiable Weightless Neural Networks (Bacellar et al., 2024), figent l'interconnexion des fils dans un routage FPGA statique, ce qui exige un nouveau placement-routage constructeur chaque fois que la distribution des entrées dérive.

L'implémentation de référence `lut-adapt-ai` referme la boucle entre le sommet et la base de la cascade au moyen d'une **compilation descendante en ligne vers `LUT6`** :

- **Échelon 0 (Consultation - Beneš paginé + `LUT6`)** : évalue des masques de tables de vérité sur 64 bits routés à travers un commutateur multidiffusion non bloquant $512 \times 512$ **Beneš-Copy-Beneš** et mis en cache dans $81 \times \texttt{RAMB36E2}$ mémoires bloc double port (`0` opération en virgule flottante, commutation de page en un seul cycle en simulation Verilator).
- **Échelon 1 (Flux - Dualité d'espace d'états MIMO complexe `Mamba-3`)** : traite les défauts de consultation qui dépendent de l'historique séquentiel grâce à un état récurrent de taille constante $O(1)$ (`48 KB` de mémoire épinglée dans la référence à `14.3M` paramètres), évitant la croissance en $O(L)$ du cache clé-valeur.
- **Échelon 2 (Topologie - `HC-SOINN`)** : maintient en ligne une topologie de prototypes sur les plongements latents, isolant les frontières de régime et déclenchant un disjoncteur (`Refuse` / escalade) lorsqu'un changement de distribution non étiqueté survient.
- **Échelon 3 (Modèle en dernier recours - `JEPA-EBRM` et diffusion NVMe 4 bits `AirMoL`)** : n'invoque la vérification latente à base d'énergie ou les modèles de fondation préentraînés de 2026 diffusés couche par couche (`LiquidAI/LFM2.5-350M` et `Qwen/Qwen3.5-0.8B-Base`) que lorsque les échelons moins coûteux s'abstiennent ou exigent une vérification exacte par le modèle cible.
- **`SleepCrystallizer` descendant** : extrait les traces d'éveil récurrentes au moyen d'initialisations spectrales de Walsh-Hadamard, de tables de vérité de mintermes en mode conjoint et de programmes de commutation de Waksman, en basculant des banques de mémoire bloc fantômes sans interrompre l'inférence ni relancer le placement-routage FPGA.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Contributions

1. **Condition de compilation descendante amortie** : prolonge l'ordonnancement $p_i/c_i$ de Simon-Kadane par un coût explicite de compilation $E_{\text{compile}}$ sur un horizon stationnaire $\Delta T$.
2. **Architecture RTL non bloquante $512 \times 512$ Beneš-Copy-Beneš et `81` `RAMB36E2`** : élimine à la fois le dépassement logique de `102.0%` sur la carte Kria KV260 causé par les matrices d'interconnexion plates (`119,478` LUT) et l'explosion à `926,619` LUT des multiplexeurs de pages à bascules, en se synthétisant en `41,186` CLB LUT UltraScale+ (`35.2%` du `xck26`), `81` blocs `RAMB36E2` (`56.2%`) et `0` tranche `DSP48`, avec une commutation de page en `1` cycle (`4.0 ns` à `250 MHz` nominal) en simulation.
3. **Synthèse universelle de mintermes en mode conjoint sur $\le 64$ bits** : démontre que la consultation de mintermes en mode conjoint domine l'arrondi marginal par plans binaires de DiffLogic sur des branches corrélées et compacte $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ tokens sous-mots dans un seul mot `uint64` (`16b × 4 = 64b` pour `|V| = 65,536` ; `18b × 3 = 54b` pour `|V| = 248,320`).
4. **Porte de cristallisation sans oracle Split-Conformal + ACI en ligne** : associe un score de non-conformité latent `JEPA-EBRM` à régularisation radiale au calibrage conforme scindé (Split Conformal) et à l'inférence conforme adaptative (Gibbs et Candès, 2021), enregistrant un risque de fausse cristallisation de `0.00%` et une AUROC OOD de `1.0000` sur du trafic décalé là où les références softmax et MC-Dropout enregistrent un risque d'erreur de `17.62%-24.28%`.
5. **Diffusion NVMe 4 bits `AirMoL` sans balayage supplémentaire sur modèles hybrides 2026** : combine la diffusion couche par couche quantifiée par groupes sur 4 bits via `os.pread` sous Darwin `F_NOCACHE`, la restauration d'état hybride en RAM et la spéculation en ligne par rafales de tokens sur `LUT6` appliquées à `LiquidAI/LFM2.5-350M` (mars 2026) et `Qwen/Qwen3.5-0.8B-Base` (février 2026), réduisant les lectures disque NVMe d'un facteur `2.86×` et `2.74×` avec `100.0%` de parité exacte des tokens tout en maintenant la RAM active dédiée aux poids entre `8.45%-9.47%` de la taille FP32 du modèle.
6. **Suite système polyglotte et serveur de diffusion HTTP/SSE en direct** : vérifie de manière croisée la cascade à travers Python/PyTorch/Triton, Rust `Burn 0.22.1 / CubeCL` Metal, Zig `0.17.1`, Go `1.27.4` SIMD, Julia `1.13.4` Enzyme et `mol_code_cli.py`.

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

La Figure 1 illustre la cascade à quatre échelons et la boucle descendante `SleepCrystallizer` dans `src/clai/`.

![Figure 1. Compilation descendante à travers une cascade Mixture of Limits à quatre échelons.](/figures/lut-adapt/mol-downward-cascade.svg)

*Figure 1. Compilation descendante à travers une cascade Mixture of Limits à quatre échelons. Schéma d'architecture, et non mesure de puissance sur carte. [PNG](/figures/lut-adapt/mol-downward-cascade.png) · [Explorateur interactif](/living/lut-adapt/#la-diag-01).*

Cinq implémentations système dans `openIE-dev/lut-adapt-ai` vérifient la cascade par recoupement : Python/PyTorch/Triton (`src/clai/`), Rust `Burn 0.22.1 / CubeCL` Metal (`sys/rust/`), Zig `0.17.1` (`sys/zig/`), Go `1.27.4` SIMD (`sys/go/`) et Julia `1.13.4` Enzyme (`sys/julia/`).

La Figure 2 illustre le chemin de données RTL de la carte Kria KV260 (`xck26`) dans `hw/kv260/rtl/clai_benes_hotswap_core.sv`, qui répartit `512` pages `LUT6` résidentes (`5,120` bits `INIT` + étiquette de contexte de `48` bits + bit de validité) sur `81` mémoires double port `RAMB36E2` en parallèle afin d'assurer une commutation de contexte en un cycle (`4.0 ns` à `250 MHz` nominal, `CPI = 1.0`).

![Figure 2. Tissu multidiffusion Beneš-Copy-Beneš et cache de pages LUT6 en BRAM à commutation en un cycle.](/figures/lut-adapt/benes-paged-silicon.svg)

*Figure 2. Tissu multidiffusion `512×512` Beneš-Copy-Beneš et cache de pages `LUT6` en un cycle sur `81 × RAMB36E2` ciblant la carte AMD Kria KV260 (`xck26`) en simulation Yosys `0.71+` et Verilator `5.054` (`board_metered = false`). [PNG](/figures/lut-adapt/benes-paged-silicon.png) · [Explorateur interactif](/living/lut-adapt/#la-diag-02).*

La Figure 3 présente `AirMoL` (`src/clai/frontier/air_mol_streamer.py` et `hf_air_mol_pretrained.py`), qui diffuse des fragments quantifiés par groupes sur 4 bits via `os.pread` sous Darwin `F_NOCACHE`, vérifie `[last_tok, d_1..d_K]` en un unique balayage et capture en RAM des instantanés compacts d'états hybrides (`Short-Conv/SSM` ou `Gated DeltaNet` + recadrage KV clairsemé `GQA` sur `6` couches) de sorte que les rejets partiels de brouillons n'exigent **aucun balayage NVMe supplémentaire**.

![Figure 3. Diffusion NVMe 4 bits par couche AirMoL avec spéculation universelle de tokens LUT6 sur 64 bits.](/figures/lut-adapt/airmol-nvme-speculation.svg)

*Figure 3. Diffusion NVMe 4 bits par couche sans balayage supplémentaire `AirMoL` avec spéculation universelle de tokens `LUT6` sur `≤64` bits appliquée à `LiquidAI/LFM2.5-350M` et `Qwen/Qwen3.5-0.8B-Base`. [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [Explorateur interactif](/living/lut-adapt/#la-run-01).*

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

<div id="47-claim-la-7-pretrained-2026-hybrid-models-under-airmol-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 Affirmation LA-7 : modèles hybrides préentraînés de 2026 sous `AirMoL` (`LFM2.5-350M` et `Qwen3.5-0.8B-Base`)

| Point de contrôle 2026 et variante | Parité | Tok / Balayage | Car. / Balayage | Balayages | Lecture NVMe | RAM active crête (`% FP32`) | `tok/s` | Classe de preuve |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Mesuré (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4 bits (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Mesuré (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4 bits + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Mesuré (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` `LUT6` à froid** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Mesuré (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` post-éveil** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Mesuré (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4 bits (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Mesuré (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4 bits + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Mesuré (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` `LUT6` à froid** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Mesuré (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` post-éveil** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Mesuré (`F_NOCACHE`)** |

On notera le compromis explicitement préservé sur les invites inédites à froid de `Qwen3.5-0.8B-Base` : `AirMoL` réduit les lectures disque NVMe de `12.674 GB` à `8.581 GB`, mais la vérification par lot de `4` tokens sur CPU dans Gated DeltaNet abaisse le débit en temps mural (`0.32` contre `0.53 tok/s`) jusqu'à ce que la cristallisation en ligne des éveils vers `LUT6` porte l'acceptation à `2.74 tok/sweep` (`4.621 GB` lus, `1.11 tok/s`).

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 Affirmation LA-8 : CLI en direct et serveur de diffusion HTTP/SSE (`mol_code_cli.py`)

`scripts/mol_code_cli.py` expose `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b}` et `--air-nvme` via CLI et points de terminaison SSE (`/v1/health`, `/v1/complete`, `/v1/crystallize`), faisant progresser en direct l'occupation des emplacements `RAMB36E2` de `438/512` à `460/512` avec `18/18` suites `pytest` réussies.

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Travaux connexes et observations de convergence

| Système | Identifiant / Conférence | Ce qu'il établit | Coût tel que rapporté | Différence dans cette référence |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Couches neuronales quantifiées clairsemées compilées en LUT FPGA. | Synthèse LUT FPGA et Fmax. | Les fils statiques exigent un re-PAR Vivado en cas de dérive, contre Beneš + `RAMB36E2` en `1` cycle. |
| **DiffLogic** (Petersen et al., 2022) et **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Réseaux différentiables de portes booléennes et de LUT sans poids. | Nombres de portes et précision. | Le routage statique chute à `52.34%` lors d'un basculement VLAN et souffre de chimères marginales par plans binaires. |
| **T-MAC** (Wei et al., 2024) et **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Produits matriciels ternaires ou à faible nombre de bits par consultation de tables sur CPU/FPGA. | Latence et puissance FPGA. | Accélère l'algèbre linéaire à l'intérieur d'un engrenage modèle ; ne contourne pas l'appel de modèle. |
| **FrugalGPT** (Chen et al., 2023) et **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Cascades LLM du plus faible au plus fort et routeurs par préférences. | Prix API en dollars contre qualité. | Routage de modèle à modèle uniquement ; aucun plancher de consultation `LUT6` ni compilation descendante. |
| **GreenServ** (2026) et **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Routage multi-LLM par bandits et service à mise à l'échelle de fréquence. | Wh GPU des auteurs (`Zeus` / `pyNVML`). | Optimise le service GPU ; la présente référence compile les éveils en pages `LUT6` à `0` FLOP (`est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Rédacteurs spéculatifs neuronaux à MLP, arbre de brouillon et cascade. | Accélération en temps mural. | Exigent des FLOPs de brouillon et des lectures de poids, contre des pages `LUT6` `uint64` à `0` FLOP. |
| **PLD** (Saxena, 2023) et **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Rédacteurs à zéro FLOP par n-grammes d'invite et trie de suffixes sur base documentaire. | Accélération en latence (`0` FLOP). | `PLD` manque les tokens hors invite ; `REST` utilise des tries de taille variable plutôt que des pages `RAMB36E2`. |
| **AirLLM** (lyogavin, 2023) | Diffuseur SSD open source | Diffusion des poids depuis SSD couche par couche dans une petite RAM. | Empreinte RAM active. | Pur `T=1` (`1.0 tok/sweep`) + débordement KV, contre une réduction des balayages de `2.74×-2.86×` avec `AirMoL`. |
| **Portes de validation mesurées** et **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Portes de validation (relevé SOM `INA260` KV260 à `11,428 pJ`), MoL $p_i/c_i$ et `RCE-JEPA`. | `measured_j` SOM KV260 + `est_j`. | Socle interne prolongé ici par la compilation descendante Beneš `LUT6` et par `AirMoL`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. Limites, menaces à la validité, hors périmètre revendiqué et réfutateurs

**Validité interne et de construit.** Sous un bruit aléatoire uniforme ou un renouvellement antagoniste à chaque pas ($\Delta T = 1$), la Proposition 1 donne une économie nulle pour la compilation descendante et le système se replie sur `1.00 tok/sweep`. La parité sans perte (`100.0%`) garantit une concordance bit à bit avec le décodage glouton du modèle cible sans relever le plafond de capacité d'un point de contrôle de base de `350M` ou `0.8B` paramètres.

**Validité des mesures et hors périmètre revendiqué.** Chaque valeur en joules de cette étude est une estimation analytique `est_j` (`measured_j = None`). Yosys `0.71+` et Verilator `5.054` établissent la synthèse structurelle de liste d'interconnexions sur `xck26` et la simulation au cycle près à `CPI = 1`, mais ni la clôture temporelle Vivado après placement-routage à `250 MHz` ni la puissance physique des rails de la carte KV260 (`board_metered = false`). Aucune suprématie énergétique sur silicium, aucune promotion de sorties `ModelGenerated` au statut `Deterministic` et aucune exécution mesurée sur modèle `70B` (`air_mol_nvme_baselines.csv` ne rapporte que des projections analytiques `70B`) ne sont revendiquées.

| ID | Affirmation | Condition exacte de réfutation |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` n'atteint pas `100.0%` de parité Verilator sur `5,120` paquets ou manque la bascule VLAN au paquet `2,500`. |
| **`LA-F2`** | `Claim LA-2` (Suite polyglotte) | Zig alloue `> 0` octet sur le tas dans la boucle critique, Go rapporte `> 0 allocs/op`, ou Julia Enzyme dépasse une erreur DF de `1e-7`. |
| **`LA-F3`** | `Claim LA-3` (RTL paginé KV260) | `scripts/verify_paged_bram_rtl.py` dépasse `117,120` LUT, `144` `RAMB36E2`, `0` `DSP48`, ou `1` cycle par commutation de page. |
| **`LA-F4`** | `Claim LA-4` (ACI conforme) | `scripts/run_frontier_benchmarks.py` dépasse le risque cible de fausse cristallisation $\alpha = 0.02$ sur trafic décalé ou appose l'étiquette `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Spéculation à l'octet) | `scripts/run_code_corpus_benchmark.py` obtient `< 100.0%` de parité exacte à l'octet face au décodage glouton de `Mamba3CodeLM` sur `48` invites inédites. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` sous `F_NOCACHE` échoue à maintenir `100%` de parité ou lit davantage d'octets NVMe que `AirLLM` 4 bits `T=1`. |
| **`LA-F7`** | `Claim LA-7` (`AirMoL` HF 2026) | `scripts/run_hf_air_mol_pretrained.py` ou `scripts/run_hf_qwen35_air_mol.py` diverge d'au moins $\ge 1$ token BPE par rapport au décodage glouton cible. |
| **`LA-F8`** | `Claim LA-8` (Suite de régression) | `pytest -v` échoue sur l'une quelconque des `18` suites de tests dans `tests/`. |

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
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455-1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094-1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026). <code>LiquidAI/LFM2.5-350M</code> Open-Weights Hybrid Model Card (March 2026). <a href="https://huggingface.co/LiquidAI/LFM2.5-350M">huggingface.co/LiquidAI/LFM2.5-350M</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
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

À partir d'une copie locale du dépôt [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit 9dbf745`) :

```bash
PYTHONPATH=src .venv/bin/pytest -v
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
```
