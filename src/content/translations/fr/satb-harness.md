---
title: "Satiation Benchmark : harnais de référence, adaptateurs et attribution télémétrique"
deck: "Un harnais de référence séquentiel en Rust à exécution fixe (Lane B), un pont d'adaptateurs unique contrôlé par proxy (formes D, M, H et I), une suite de conformité à douze vérifications (C1 à C12) et un moteur d'attribution télémétrique sans privilèges à cinq niveaux (L0 à L4, croisés avec les étiquettes A1 à N). Ces éléments ont été vérifiés empiriquement sur cinq archétypes matériels : Apple M5 Max (IOReport arm64 sous macOS et reported_j issu de proc_pid_rusage), Tegra aarch64 Jetson Thor (measured_j physique à l'échelle de la carte entière et mesure de courant par shunt séparée par rail sur trois canaux), Framework Desktop Strix Halo (énergie du package x86-64 sous Linux reported_j, isolée par le groupe 0440 root:energy, avec suivi de la puissance du package graphique), Intel Core i9-13900H Raptor Lake (reported_j de plateforme L1 et du package 0 L2 sous x86-64 Linux) et Intel Core i7-1165G7 Tiger Lake associé à une GeForce 2060 sous Windows 11 (reported_j cumulatif du GPU discret L2 sans privilèges, build 26300, Win32 Job Object et comptabilité des cycles, ainsi que l'étiquette N du package processeur). Les canaux bruts measured_j, reported_j et les canaux logiques L4 restent strictement séparés et ne sont jamais additionnés. Les charges concurrentes ayant été exécutées sur les hôtes partagés (dedicated_host est faux), l'attribution nette de placement A2 est retenue conformément au Falsifier 6."
lang: "fr"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*Révision af57f48, 22 novembre 2026. Résumé des données et du digest : [/data/#satb-harness](/data/#satb-harness). Figures interactives en direct : [/living/satb-harness/](/living/satb-harness/). Jumeau archivistique LaTeX : [/pdfs/latex/satb-harness.pdf](/pdfs/latex/satb-harness.pdf) ([source](/pdfs/latex/satb-harness.tex)).

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Vue d'ensemble

Lorsque deux évaluations d'agents rapportent des taux de réussite des tâches ou des chiffres énergétiques différents, l'écart provient souvent de la manière dont le modèle a été encapsulé et de l'attribution des compteurs matériels de l'hôte, plutôt que du modèle lui-même. La seule modification du harnais environnant a fait varier de `17` points de pourcentage la résolution des tâches de `Gemini 2.5 Pro` sur `Terminal-Bench 2`, tandis que la soustraction d'une ligne de base à vide dérivée, ou la répartition d'un rail électrique silicium partagé au prorata du temps processeur, peuvent fausser l'attribution énergétique de plus de `30 %`.

Cette étude spécifie et vérifie empiriquement le contrat d'évaluation **Satiation Benchmark (`SATB`)** : un harnais de référence Rust séquentiel et fixe (**`Lane B`**), un pont d'adaptateurs isolé par mandataire (**`Shapes D, M, H, and I`**) pour les contrôles sans modèle, les points d'accès bruts de modèles, les harnais externes en ligne de commande et les solveurs de benchmarks publics, une empreinte cryptographique du système sous test (`SUT`) en cinq blocs, douze contrôles de conformité obligatoires, et un moteur télémétrique sans privilèges à cinq niveaux. Plutôt que de laisser la conception non mesurée, nous exécutons en conditions réelles des benchmarks de conformité et de falsification sur cinq archétypes matériels couvrant `macOS`, `Linux` et `Windows 11` : une station de travail `Apple M5 Max` (`128` gigaoctets de mémoire unifiée, `macOS 27.2.1`, `IOReport` intégré à la puce et `proc_pid_rusage` du noyau pour `reported_j`), un kit de développement Tegra `aarch64` (`Jetson Thor`, `Linux 6.8.12-1021-tegra`, mesure physique `measured_j` par shunts de courant Texas Instruments sur la carte entière et sur trois canaux de rails séparés), une station de travail `Framework` Desktop `Strix Halo` (`Ryzen Max+ 395`, `Linux 7.0.0-43-generic x86-64`, énergie de paquet `reported_j` isolée par groupe `0440 root:energy` plus suivi de puissance du paquet `amdgpu`), une station de travail `Raptor Lake` (`Intel Core i9-13900H`, `Linux 7.0.0-43-generic x86-64`, énergie de plateforme et de paquet `reported_j`), et une station de travail `Windows 11` nue (`Intel Core i7-1165G7` plus `GeForce 2060`, `Windows 11` build `26300` `x86-64`, `reported_j` cumulé du GPU discret sans privilèges, confinement Win32 par Job Object, et énergie du paquet processeur sans privilèges strictement marquée `not_available`), ainsi que l'énergie d'un serveur cloud fermé (`not_available`).

**En termes simples**

1. La boucle de prompt d'un agent, sa règle d'élagage de contexte et son bac à sable d'outils peuvent faire varier les scores de benchmark autant que le remplacement du modèle sous-jacent ; ainsi `Lane B` maintient l'enveloppe complètement fixe en Rust déterministe tandis que `Lane O` impose les enveloppes externes via un unique proxy audité.

2. Les canaux d'énergie sont enregistrés bruts à leur véritable frontière physique (prise murale entière, entrée de carte, boîtier de puce, estimation de processus du système d'exploitation ou registre logique de jetons) et ne sont jamais fusionnés en un unique nombre sans étiquette, additionnés entre classes de preuves (`measured_j` vs. `reported_j` vs. `est_j`), ni complétés par des moyennes de durabilité de flotte.

3. Des essais en direct sur cinq plates-formes silicium et systèmes d'exploitation (`macOS`, `Linux` et `Windows 11`) vérifient le déterminisme exact de `Shape D` à mémoire projetée de million d'enregistrements (`15027705736`) et de relecture `C9` (`149747 B`, `0` différence de nouvelle ligne ou d'octet), le nettoyage du processus noyau en `0,87-9,54 ms` (`2,46 ms` via les objets Job Win32 sur `Windows 11`), le non-déterminisme cloud à `temperature = 0` chez trois fournisseurs, les plafonds de cadence des capteurs matériels (`24,3-45,4 µs` pour les lectures de compteur Linux à `94-97 Hz` contre `1,17 ms` pour les lectures de compteur graphique en processus Windows à `64,6 Hz` contre `2,95 ms` pour les lectures de shunt sur bus série à `66,6 Hz` sur `Jetson Thor` contre `~8 Hz` pour `macmon` `IOReport`), une erreur de `32,59 % à 89,88 %` lors de la séparation des phases séquentielles de calcul et de stockage par temps processeur (`Falsifier 3`), ainsi que la séparation physique des rails de shunt graphique versus processeur conjointement au contrôle de dérive d'hôte partagé de `Falsifier 6` (`dedicated_host = false`).

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## Termes, acronymes et étiquettes d'attribution

<ul id="terms">
<li>SATB, SUT, PFRK, OQ, SPEC, BUNDLE, SUBMIT, REFUSE, STOP : spécification du harnais et de l'attribution du Satiation Benchmark, système sous test, issues des tentatives à quatre voies (réussite, échec, refus, interruption forcée), question ouverte résolue de la spécification, document de spécification normative, fichier de lot de tâches, appel terminal de soumission de la réponse, appel terminal de refus, et jeton d'arrêt de la boucle séquentielle</li>
<li>ACI, SWE, CLI, MCP, SDK, ACP, ARC, AGI, GUI : interface agent-ordinateur, préfixe de benchmark en génie logiciel, interface en ligne de commande, Model Context Protocol, kit de développement logiciel, Agent Client Protocol, Abstraction and Reasoning Corpus, suite de benchmarks d'intelligence artificielle générale, et interface graphique utilisateur</li>
<li>IO, JSON, JSONL, RPC, JCS, UTF, HTTP, SSE, URL : protocole d'entrée/sortie, JavaScript Object Notation, JSON délimité par des lignes, appel de procédure distante, JSON Canonicalization Scheme (RFC 8785), Unicode Transformation Format, Hypertext Transfer Protocol, Server-Sent Events, et Uniform Resource Locator</li>
<li>POSIX, MMAP, DNULLMM1, SHA, SIGKILL, ESRCH, EACCES, EOF, NT, NTFS, CRLF, MSVC, UCRT, FFI, DLL : Portable Operating System Interface, interface de fichiers mappés en mémoire, format binaire d'index Deterministic Null mappé en mémoire, Secure Hash Algorithm (SHA-256), signal de terminaison de processus POSIX non interceptable, statut noyau d'absence de processus, statut d'erreur POSIX de permission refusée, marqueur de fin de fichier (EOF) pour heredoc, noyau Windows New Technology (`Windows NT`), New Technology File System, séquence de fin de ligne retour chariot suivi d'un saut de ligne (`\r\n`), compilateur Microsoft Visual C++ (`cl.exe`), Windows Universal C Runtime (`ucrtbase.dll`), interface de fonctions étrangères et bibliothèque à liaison dynamique</li>
<li>AI, ML, LLM, MLX, GGUF, KV, TP, ENERGY : intelligence artificielle, apprentissage automatique, grand modèle de langage, cadre Apple d'array pour l'inférence locale, poids quantifiés GGUF (GPT-Generated Unified Format), cache clé-valeur, parallélisme de tenseurs, et consortium ML.ENERGY de référence pour la mesure de la consommation électrique des GPU</li>
<li>CPU, GPU, APU, ANE, SoC, ALU, ISA, IPC, PID, UID, GID, OS, VM, EC, GB, TGL, RTX : unité centrale de traitement, processeur graphique, unité de traitement accélérée, Apple Neural Engine, système sur puce, unité arithmétique et logique, architecture de jeu d'instructions, instructions par cycle, identifiant de processus, identifiant d'utilisateur, identifiant de groupe, système d'exploitation, machine virtuelle, contrôleur embarqué, gigaoctets, architecture mobile Intel Tiger Lake et famille de GPU dédiés NVIDIA GeForce RTX</li>
<li>RAM, DRAM, SLC, NVMe, PSU, PDU, AC, DC, DVFS, MSR, MMIO, RDTSC, HVCI, WMI, EMI, SRUM : mémoire vive à accès aléatoire, RAM dynamique, cache de niveau système, Non-Volatile Memory Express, bloc d'alimentation, unité de distribution d'énergie, courant alternatif, courant continu, mise à l'échelle dynamique de la tension et de la fréquence, registre spécifique au modèle, entrée/sortie mappée en mémoire, instruction x86 Read Time-Stamp Counter, Windows Hypervisor-Protected Code Integrity, Windows Management Instrumentation, Windows Energy Metering Interface (`\\.\EnergyMeter`) et Windows System Resource Usage Monitor</li>
<li>RAPL, NVML, PPT, TI, I2C, ADC, INA, INA238, INA3221, AGX, VDD, SOC, MSS, VIN, SYS, PLATYPUS : Running Average Power Limit d'Intel/AMD, NVIDIA Management Library, AMD Package Power Tracking, Texas Instruments, bus Inter-Integrated Circuit, convertisseur analogique-numérique, famille de moniteurs de courant et de puissance Texas Instruments (`INA238`, `INA3221`), niveau de module NVIDIA Jetson AGX, rail de tension d'alimentation de drain, rail de tension du système sur puce, rail du sous-système mémoire, rail de tension d'entrée du système, et Power Leakage Attacks: Targeting Your Processor Using Software</li>
<li>API, USD, CNCF, AISI, UK, AMD, NVIDIA : interface de programmation d'application, dollars des États-Unis, Fondation pour l'informatique native du cloud, Institut de sécurité de l'IA, Royaume-Uni, Advanced Micro Devices, et NVIDIA Corporation</li>
<li>RCE, MoL, WCA, LUT6 : Moteur de code de réalité [même maison], Mélange de limites [même maison], Automatisation informatique sage [même maison], et table de correspondance booléenne à 6 entrées</li>
</ul>

Pour les niveaux de télémétrie L0 à L4, chaque canal consigné dans un reçu `SATB` porte à la fois sa frontière physique et l'une de quatre classes de preuve strictes :

| Classe de preuve | Portée dans les reçus et tableaux `SATB` |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | Condensés canoniques `SHA-256` et `JCS` (`RFC 8785`) des lots de tâches, des empreintes `SUT` à cinq blocs et des transcriptions de rejeu ; décomptes de jetons de prompt, de cache, de raisonnement et de complétion journalisés par le proxy ; durées en temps réel (horloge murale) ; et prix catalogue `API` datés, en `USD`. |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | Renseigné uniquement à partir d'un analyseur `AC` externe calibré, placé sur la prise murale (`L0`), ou d'un moniteur de courant à shunt physique sur la carte (`L1`/`L2`). Vérifié en conditions réelles sur `NVIDIA Jetson AGX Thor` via `TI` `INA238` (`hwmon6` `VIN`, `L1`) et `INA3221` (`hwmon5` `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS`, `ch3 VIN_SYS_5V0`, `L2`/`L1` ; `board_metered = true`). Comme un co-locataire actif occupait `VDD_GPU` pendant la capture (`dedicated_host = false`), la valeur brute `measured_j` du rail est conservée tandis que l'attribution nette de placement `A2` est suspendue ; `measured_j` reste `None` sur `Apple M5 Max`, `AMD Strix Halo`, `Intel Raptor Lake` et `Windows 11` (`i7-1165G7` + `RTX 2060`), et la puissance `L0` à la prise murale n'est renseignée nulle part. |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | Compteurs de télémétrie embarqués accessibles sans privilèges (`Apple M5 Max` `IOReport` `sys_power` à `L1` et `chip_power`/`cpu_power`/`gpu_power` à `L2` via `macmon` ; `Intel Raptor Lake` `RAPL` `psys` à `L1` et `package-0`/`core`/`uncore` à `L2` ; `Framework AMD Strix Halo` `RAPL` `package-0`/`core` à `L2` ainsi que les watts `amdgpu` `PPT` ; `Windows 11` `NVML` sans privilèges `nvmlDeviceGetTotalEnergyConsumption`, en `mJ` cumulés, sur `NVIDIA GeForce RTX 2060` à `L2`) et estimations par processus modélisées par l'`OS` (`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` à `L3`, étiquette `D`). Jamais additionnés à `measured_j` ni à `est_j`. |
| **`Provider-Attested (P) vs. Not Available (N)`** | L'énergie des serveurs distants des `API` fermées (ainsi que l'énergie du paquet `CPU` en mode utilisateur sous Windows 11, là où les pilotes `MSR` `RAPL` en ring 0 sont interdits) n'est inscrite comme `P` que lorsqu'un fournisseur renvoie, pour chaque requête, une valeur d'énergie accompagnée de sa méthodologie textuelle ; sinon, elle est consignée littéralement comme `"not_available"` (étiquette `N`). Les soustractions de référence dérivées qui dépassent la borne de dérive de `5.0%` (`Falsifier 6`) ou échouent à la vérification de somme de l'étape `Step 7` sont automatiquement écartées, tandis que les canaux bruts demeurent intacts. |

<div id="11-lineage-design-invariants-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Filiation, invariants de conception et divulgation de même maison

`SATB` s'appuie directement sur des travaux publics d'évaluation d'agents et d'attribution de la puissance, plutôt que d'inventer des protocoles sur mesure lorsque des normes existent. L'exécution minimale et sans état de l'interpréteur de commandes suit `mini-swe-agent`. Le pont entre solveurs et interfaces en ligne de commande externes s'inspire de `UK AISI Inspect` (`react()` et `Inspect Agent Bridge`) ainsi que de `Terminal-Bench` (`Harbor` / `Terminus-2`). Les schémas d'outils utilisent `MCP`, canonisé selon `RFC 8785` (`JCS`). La discipline des compteurs cumulatifs GPU suit Chung et al. (`ML.ENERGY` / `Zeus`) et Yang et al. concernant les pièges de l'échantillonnage partiel de `nvidia-smi`. La répartition proportionnelle du `CPU` (`label C`) est évaluée par rapport au modèle `CNCF Kepler`. Enfin, l'isolation des permissions `RAPL` sous Linux suit Lipp et al. (`PLATYPUS`). Les études compagnonnes d'Open Interface Engineering, [Portes de validation mesurées](/papers/gates/), [Satiété des tâches contre effet rebond agrégé](/papers/satiation/) et [Nul déterministe](/papers/deterministic-null/), sont des travaux de `[same house]` cités strictement pour les définitions architecturales partagées :

| Axe du contrat | Invariant préservé dans toutes les voies |
| :--- | :--- |
| **Protocole de tentative** | Grille de tâches fixe ; au plus un `SUBMIT` ou `REFUSE` terminal par tentative ; un reçu `SHA-256` immuable par tentative ; issues canoniques `pass`, `fail`, `refuse`, `killed` ; aucune rétroaction du vérificateur pendant les tentatives de test. |
| **Identité du système** | Empreinte `SUT` à cinq blocs (`model` + `serving` + `sampling` + `harness` + `envelope`), hachée à `session.open` et re-hachée à `session.close`. |
| **Énergie attribuable** | Énergie brute de fenêtre de l'ensemble du `SUT` (`A2`) sur un hôte dédié et calme ; énergie du moteur d'inférence sur un rail physique exclusif (`A1`) ; énergie séquentielle des phases modèle contre outil (`B`) sous `Lane B`. |
| **Non attribuable** | Joules de serveur `API` fermé non attestés (`N`) ; parts exactes par processus de joules sur un rail `SoC` partagé ou à mémoire unifiée (`C` et `D` sont des modèles, et non des compteurs physiques de rail) ; poids du modèle dissociés des noyaux du moteur et du silicium. |

---

<div id="2-survey-of-agent-harnesses-and-why-context-policy-is-part-of-the-system" class="anchor-alias" aria-hidden="true"></div>

## 2. Étude des harnais d’agents et pourquoi la politique de contexte fait partie du système

Les harnais modernes de codage, de terminal et d’utilisation informatique diffèrent nettement dans la manière dont ils exposent les outils, contrôlent les modifications de fichiers et compactent les historiques de conversation en expansion :

| Harnais | Boucle et surface d'outils | Politique de contexte et d'historique |
| :--- | :--- | :--- |
| **`mini-swe-agent`** | `Bash` uniquement. Chaque action génère un nouveau `subprocess.run` sans état. | Historique de messages strictement linéaire en mode ajout uniquement ; aucune compactation automatique. |
| **`SWE-agent` (`ACI`)** | Visionneur de fichiers fenêtré de 100 lignes, commande d'édition filtrée par linter, recherche concise. | Le processeur d'historique replie les observations d'environnement plus anciennes en résumés bornés. |
| **`Inspect react()`** | Boucle d'outils séquentielle jusqu'à `submit()` : `bash()`, `text_editor()`, outils `MCP`. | État de message éditable avec solutions de troncature ou de compactation de l'historique modulables. |
| **`Inspect Agent Bridge`** | Enveloppe les agents `Claude Code`, `Codex CLI`, `Gemini CLI` et `SDK` personnalisés derrière un proxy local. | Délègue entièrement la gestion du contexte au harnais externe enveloppé. |
| **`Terminus-2` (`Harbor`)** | Outil unique : session terminal persistante `tmux` recevant des frappes brutes. | Résumé de contexte en trois étapes (`3-stage`) compression progressive de la transcription. |
| **`Codex CLI`** | Shell sandboxé (`Landlock`/`seccomp` ou `seatbelt`), `apply_patch` structuré, `MCP`. | Compactage natif du contexte en continu déclenché près des limites de la fenêtre du modèle. |
| **`Claude Code`** | `Bash`, outils de fichiers structurés (`Read`, `Write`, `Edit`, `Glob`, `Grep`), `MCP`. | Compactage de conversation automatique dirigé par LLM (`auto-compact`) plus mise en cache des invites. |
| **`OpenHands`** | Runtime d'événement en flux exécutant tout agent de codage `ACP` ou `CodeAct` dans des conteneurs. | Condenseur de contexte configurable (`LLM` résumé ou masquage de fenêtre). |
| **`ARC-AGI-3` runner** | Harnais standard vs. harnais d'adaptateur fournisseur sur des états de grille interactifs. | Fenêtre de trajectoire visuelle/grille bornée déclarée par piste d'adaptateur. |
| **`OSWorld run.py`** | Boucle `GUI` de bureau émettant des actions souris/clavier `pyautogui` sur des captures d'écran de VM. | Fenêtre de trajectoire glissante ne conservant que les $K$ captures d'écran et actions les plus récentes. |

Sur `Terminal-Bench 2`, `Gemini 2.5 Pro` a résolu **`17%` de tâches** de plus lorsqu'il était couplé à `Terminus-2` qu'avec `OpenHands`, en maintenant le point de contrôle du modèle sous-jacent constant. La gestion du contexte, la troncature de sortie, le linting des modifications et les règles de nouvelle tentative sont donc des composants de premier ordre du système évalué plutôt que des simples raccordements neutres. `SATB` résout cette confusion en scindant l'évaluation en deux voies explicites et en clôturant les Questions Ouvertes `OQ-1` et `OQ-2` :

1. **Maintien du wrapper constant (`Lane B`) par opposition à l'évaluation de wrappers externes (`Lane O`)** : `Lane B` (`satb-agent`) fixe une boucle Rust unique et auditable pour tous les modèles, alors que `Lane O` encapsule des harnais tiers complets (`Claude Code`, `Codex CLI`, `OpenHands`, `Terminus-2`, `Inspect`) comme des `SUT` en boîte noire. Leurs prompts internes et leurs appels de compaction sont hachés dans le bloc d'empreinte `harness`, et acheminés à 100 % via `satb-proxy`.

2. **Résolution de la politique de contexte (`OQ-1` : `ContextRule_v0`)** : interrompre immédiatement une tentative sans aucune élision confond le raisonnement en plusieurs étapes avec une sortie d'outil verbeuse. À l'inverse, la synthèse générée par un `LLM` (auto-compaction de `Claude Code`) injecte des appels stochastiques cachés au modèle, ce qui rompt le rejeu déterministe du harnais. `Lane B` adopte **`ContextRule_v0`** : lorsque la taille cumulée de la conversation dépasse **`80%`** de la fenêtre de contexte déclarée, le harnais remplace de façon déterministe les sorties d'outils les plus anciennes par `"[ELIDED_BY_CONTEXT_RULE_V0]"`, tout en conservant verbatim `system(TEMPLATE_v0)`, le message initial `user(render(bundle))` et les **8 sorties d'outils les plus récentes**, sans aucun appel de modèle. L'arrêt forcé `killed(context_ceiling)` ne se déclenche que si ces seuls messages conservés dépassent **`100%`** de la fenêtre.

3. **Résolution de la surface d'outils (`OQ-2` : `TOOLS_v0`)** : une surface reposant uniquement sur `exec` (à la manière de `mini`) oblige les modèles à échapper en shell les correctifs de code source multilignes et les preuves algébriques (`cat << 'EOF'`). Cela introduit des échecs de quotage shell, orthogonaux au raisonnement de la tâche, et complique la mise en bac à sable sans privilèges portable sur `macOS`, `Linux` et `Windows`. `Lane B` fixe **`TOOLS_v0`** : quatre outils d'espace de travail (`exec`, `read_file`, `write_file`, `list_dir`) et deux outils terminaux (`submit`, `refuse`), canonicalisés via `JCS` en `tools_hash` (`d5b102...`).

---

<div id="3-reference-harness-lane-b-contextrule_v0-and-satb-io-protocol" class="anchor-alias" aria-hidden="true"></div>

## 3. Harnais de référence (`Lane B`), `ContextRule_v0` et protocole `SATB-IO`

<figure class="my-8">
  <img src="/figures/satb-harness/satb-lane-b-architecture.svg" alt="Topologie d'isolation des composants de Lane B du Satiation Benchmark et cycle de vie déterministe des sessions." />
  <figcaption>Figure 1. À gauche : isolation des composants de <code>Lane B</code> séparant <code>satb-meter</code> (sans privilèges root), <code>satb-supervisor</code>, <code>satb-agent</code>, <code>satb-sandbox</code> (sans accès réseau), <code>satb-proxy</code> (détenteur des identifiants) et le <code>Verifier</code> externe, inaccessible. À droite : séquence déterministe des sessions et des tentatives <code>SATB-IO</code>.</figcaption>
</figure>

<div id="31-sequential-execution-loop-and-fixed-versus-configurable-split" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Boucle d'exécution séquentielle et séparation fixe versus configurable

Dans `satb-agent`, chaque tentative exécute une boucle monogène strictement séquentielle sans threads d'outil en arrière-plan qui se chevauchent, sans vote `best-of-k`, et sans retour d'oracle du vérificateur :

```text
msgs <- [system(TEMPLATE_v0), user(render(bundle))]
loop:
  ContextRule_v0(msgs)        # >= 80% window -> elide oldest tool outputs; keep last 8; 0 model calls
  r <- proxy.chat(msgs, TOOLS_v0)   # missing usage -> immediate killed(usage_missing)
  if no tool calls: append CONTINUE_v0; continue
  for call in r.tool_calls (sequential):
    submit | refuse -> attempt.close; ignore trailing calls (C4); STOP
    exec | read_file | write_file | list_dir -> fresh sandboxed process in /work,
      Truncate_v0 (8 KiB head + 8 KiB tail), no network egress (C6)
  envelope ceiling reached -> killed(wall_ceiling | token_ceiling | turn_ceiling | context_ceiling)
```

Chaque exécution de `Lane B` sépare les constantes fixes du benchmark (hachées dans `harness_id`) des paramètres déclarés du `SUT` (hachés dans `sut_fingerprint_sha256`) :

| Constantes fixes pour toutes les exécutions de `Lane B` (`harness_id`) | Paramètres configurables par `SUT` (`sut_fingerprint_sha256`) |
| :--- | :--- |
| Invite `TEMPLATE_v0`, moteur de rendu du paquet et incitation `CONTINUE_v0` | `model_id`, date de l'instantané du fournisseur, ou `GGUF`/safetensors `SHA-256` local |
| Schémas `TOOLS_v0` (somme de contrôle `JCS` de `tools/list`) et répartition séquentielle | Paramètres d'échantillonnage : `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `reasoning_effort` |
| `ContextRule_v0` (seuil de `80 %`, conservation des `8` derniers) et `Truncate_v0` (`8 + 8 KiB`) | Moteur de service (`llama.cpp`, `MLX`, `vLLM`, `API` nuage) et indicateurs de lot/cache |
| Tentative unique (`attempts = 1`), zéro retour du vérificateur, zéro vote interne | Plafonds d'enveloppe : `wall_ms`, `max_total_tokens`, `max_turns` |
| `satb-sandbox` : confinement dans `/work`, environnement épuré, zéro sortie réseau | Quotas `CPU`/`RAM` du bac à sable, silicium hôte, noyau `OS` et niveau d'isolation |

<div id="32-canonical-four-way-outcome-mapping-oq-3" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Correspondance canonique à quatre issues (`OQ-3`)

Pour éviter que les benchmarks écartent silencieusement les exécutions interrompues, ou qu'ils confondent une mauvaise réponse volontaire avec un dépassement de délai d'infrastructure, `SATB` fait correspondre les codes de complétion historiques à cinq états sur **`{pass, fail, refuse, killed}`** (`PFRK`) sans perte d'information, en conservant le `sub_reason` exact dans chaque reçu :

1. **`completed` $\to$ `pass` (`sub_reason: "verified"`, score `1`)** : le `SUT` a appelé `submit(bytes)` avant l'expiration du plafond, et le `Verifier` externe a accepté `bytes` après `attempt.close`.
2. **`incorrect` $\to$ `fail` (`sub_reason: "incorrect"`, score `0`)** : le `SUT` a appelé `submit(bytes)` normalement ; le `Verifier` externe a rejeté le candidat.
3. **`malformed` $\to$ `fail` (`sub_reason: "malformed_submission"`, score `0`)** : le `SUT` a volontairement appelé `submit(bytes)` avec un contenu non analysable ou non conforme au schéma. Une soumission invalide produite par le `SUT` constitue un échec de précision, et jamais une interruption d'infrastructure.
4. **`refused` $\to$ `refuse` (`sub_reason: "policy" | "capability" | "other"`, score `0`)** : le `SUT` a explicitement invoqué `refuse(reason)`.
5. **`no_submission` $\to$ `killed` (`sub_reason: "wall_ceiling" | "token_ceiling" | "turn_ceiling" | "context_ceiling" | "usage_missing" | "exec_timeout_killed" | "process_crash"`, score `0`)** : `satb-supervisor` a interrompu la tentative avant l'arrivée de tout appel d'outil terminal. Ces quatre issues restent intégrées au dénominateur $n$.

---

<div id="4-adapter-bridge-shapes-d-m-h-i-five-block-sut-fingerprint-and-c1c12-conformance" class="anchor-alias" aria-hidden="true"></div>

## 4. Pont d'adaptateur (`Shapes D, M, H, I`), Empreinte en cinq blocs du `SUT`, et conformité `C1-C12`

<div id="41-four-adapter-shapes-behind-one-supervisor-and-proxy" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Quatre formes d'adaptateurs derrière un superviseur et un proxy unique

Tout système extérieur à `Lane B` se connecte à `satb-supervisor` via l’une des quatre formes d’adaptateur :

| Forme d'adaptateur | Systèmes cibles | Contrat d'exécution et d'isolation | Normes réutilisées |
| :--- | :--- | :--- | :--- |
| **`Shape D` (`dnull` control)** | Null déterministe (`N0` strict sans modèle et `N1` cristallisé en développement) sur des magasins `DNULLMM1` `mmap` gelés | S'exécute dans `/work` sous des règles `TOOLS_v0` et `Verifier` identiques avec **`0` appels de modèle proxy** au moment de la décision. | `POSIX mmap` / Win32 `MapViewOfFile`, boucle d'entiers 64 bits `SPEC v0.4` |
| **`Shape M` (Model endpoint)** | Serveurs open-weight locaux et `API` cloud fermées | Exécute l'agent `satb-agent` de la `Lane B` sur `Chat Completions` ou `Messages` avec appels d'outils et `usage` obligatoire, routé à 100 % via `satb-proxy`. | `API` compatible OpenAI (`llama.cpp`, `mlx_lm`, `vLLM`) ; traducteurs `Anthropic`, `Gemini`, `xAI` |
| **`Shape H` (Harness in a box)** | `Claude Code`, `Codex CLI`, `Gemini CLI`, `OpenHands`, `Terminus-2` | Tâche écrite dans `/work/task/BUNDLE.md`. `URL` de base pointée vers `satb-proxy` (`127.0.0.1:<port>`) ; clés `API` réelles retenues hors de `/work` ; fin via `submit` ou `refuse` de `MCP` ; zéro autre sortie. | Variables d'environnement du pont de bac à sable `Inspect` ; `MCP` avec `--strict-mcp-config` ; `ACP` optionnel |
| **`Shape I` (`Inspect` agent)** | Solveurs `Inspect` publics existants de benchmarks | Enveloppe le paquet de tâche `SATB` avec les outils `submit` et `refuse` à `attempts = 1`, en routant les appels de modèle via `satb-proxy`. | Interface `Task` et `Solver` de `UK AISI Inspect` |

<div id="42-five-block-sut-fingerprint-and-session-validity" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Empreinte `SUT` en cinq blocs et validité de session

Avant que `attempt.start` ne se déclenche, l'adaptateur renvoie une structure JSON en cinq blocs dont le condensé `SHA-256` canonique au format `JCS` définit le `SUT`. Les champs inconnus ou non observables doivent être écrits littéralement sous la forme `"not_available"`, sans jamais être omis ni devinés :

| Bloc d'empreinte | Champs requis (les valeurs non disponibles sont écrites littéralement sous la forme `"not_available"`) |
| :--- | :--- |
| **`model`** | `provider`, `model_id`, `snapshot_date`, `weights_sha256`, `quantisation`, `tokenizer_hash`, `chat_template_hash`, `context_window`, `system_fingerprint` |
| **`serving`** | `engine`, `version`, `commit`, `binary_hash`, `flags_hash` (`cache_prompt`, `slots`, `batch_invariance`, `TP`), `drivers`, `devices` |
| **`sampling`** | `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `stop`, `reasoning_effort`, `tool_choice` |
| **`harness`** | `name`, `version`, `commit`, `binary_hash`, `prompt_hash`, `tools_hash`, `context_policy`, `internal_voting`, `sub_agents`, `config_hash` |
| **`envelope`** | `hardware`, `os_kernel`, `isolation_tier`, `cgroup_limits`, `cpuset`, `network_policy`, `ceilings`, `telemetry_config_hash` |

**Invalidation de session et témoins (canaries) de début et de fin.** Toute modification du condensé d'un bloc constatée à `session.close`, toute notification `tools/list_changed` du protocole `MCP`, tout redémarrage du moteur d'inférence, toute remise à zéro d'un compteur `NVML`, toute modification du champ `model` ou `system_fingerprint` renvoyé en cours de session, ou toute mise à jour du système d'exploitation ou des pilotes, marque **chaque reçu de la session comme `void`**. Les reçus `void` restent dans l'archive publique afin de garantir l'auditabilité, mais sont exclus du classement du benchmark. Comme un fournisseur cloud peut remplacer les poids ou la quantification derrière un `model_id` fixe sans mettre à jour `system_fingerprint`, chaque session encadre également l'évaluation par un palier témoin déterministe à `session.open` et à `session.close`.

<div id="43-mandatory-c1c12-adapter-conformance-suite" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Suite d’obligation de conformité des adaptateurs `C1-C12`

Aucun adaptateur ni harnais n’entre en évaluation tant qu’il n’a pas réussi les douze vérifications de conformité (`C1` à `C12`) :

| Contrôle | Exigence de réussite |
| :--- | :--- |
| **`C1` Aller-retour du bundle** | L'adaptateur renvoie à l'identique le condensé `SHA-256` JCS du bundle de tâche d'entrée. |
| **`C2` Chemin de soumission** | Le `Verifier` externe reçoit la séquence d'octets exacte consignée dans la capture du terminal `satb-proxy` / `MCP`. |
| **`C3` Chemin de refus** | Un refus demandé arrive proprement sous la forme `refuse` (`sub_reason = "other"`, `completion_score = 0`). |
| **`C4` Un seul appel terminal** | Tout appel d'outil ou de terminal émis après le premier `submit` ou `refuse` est ignoré et comptabilisé. |
| **`C5` Absence d'oracle** | Les répertoires, sockets et chemins parents (`..`) de `Verifier` et de `satb-supervisor` sont inaccessibles depuis `/work`. |
| **`C6` Sortie réseau** | Seul `satb-proxy` (`127.0.0.1:<port>`) est joignable pour le trafic des modèles ; les sous-processus de `/work` n'ont aucun accès réseau externe et aucune clé `API` amont. |
| **`C7` Présence de l'usage** | Chaque appel de modèle transporte `usage` (`missing -> killed(usage_missing)`) ; les totaux de jetons du proxy correspondent exactement aux comptages du moteur amont. |
| **`C8` Stabilité de l'empreinte** | L'empreinte `SHA-256` à cinq blocs du `SUT` est identique avant et après une exécution à blanc de 3 tentatives. |
| **`C9` Rejeu du harnais** | Le rejeu des réponses enregistrées de `satb-proxy` reproduit une transcription identique octet par octet (`0` différence d'octet ou de `CRLF` ; obligatoire pour `Lane B`). |
| **`C10` Chemin d'arrêt** | L'arbre de processus de `/work` en fuite (groupe de processus `POSIX` ou Win32 Job Object, y compris les processus enfants détachés) est récupéré en `< 2,000 ms` et consigné comme `killed`. |
| **`C11` Poignée de main télémétrique** | Les compteurs de processus `L3` sans privilège (`cgroup v2`, `proc_pid_rusage`, ou Win32 `GetProcessTimes`/`QueryProcessCycleTime`) sont lisibles, les marqueurs de phase arrivent et le décalage entre horloge monotone et horloge murale est consigné. |
| **`C12` Sonde de déterminisme** | `8` requêtes identiques sont exécutées et le nombre de sorties distinctes est consigné comme propriété empirique du `SUT`. |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. Attribution télémétrique à cinq niveaux (`L0-L4 × A1-N`), cartes des canaux de la plate-forme et ce qui ne peut pas être attribué

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="Limites d’attribution télémétrique à cinq niveaux L0 à L4 croisées avec les étiquettes A1 à N et le pipeline de vérification de somme brute en sept étapes." />
  <figcaption>Figure 2. À gauche : niveaux télémétriques physiques et logiques <code>L0</code>-<code>L4</code> mis en correspondance avec les étiquettes d’attribution <code>A1</code>-<code>N</code>. À droite : discipline de compteur brute en sept étapes imposant les bornes de dérive de référence pré/post (<code>Falsifier 6</code>) et la vérification de somme de l’<code>Étape 7</code>.</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Frontières de télémétrie (`L0-L4`) et étiquettes d'attribution (`A1-N`)

Les capteurs d'énergie et d'activité se situent à cinq limites distinctes, qui mesurent des grandeurs physiquement différentes et qui ne doivent jamais être additionnées ni confondues :

| Niveau | Frontière physique / logique | Capteurs représentatifs | Ce que le canal peut honnêtement attribuer |
| :--- | :--- | :--- | :--- |
| **`L0` wall** | `AC` à la prise murale | Prise intelligente ou `PDU` (`Shelly` `apower`, `aenergy` ; `Yokogawa` analyseur) | Machine entière y compris chaleur de conversion de l'`PSU`, ventilateurs, `DRAM` et `NVMe` ; cadence de `~1 s`. |
| **`L1` platform** | Rail d'entrée `DC` de la carte | Porteur `Jetson Thor INA238` ; `Mac sys_power` ; `RAPL psys` | Ordinateur entier du côté `DC` en aval de la brique d'alimentation ou de l'`PSU`. |
| **`L2` package / SoC** | Rails du boîtier `CPU`, `GPU` et `SoC` | `RAPL pkg` ; `macmon IOReport` sans privilèges ; `Thor INA3221` ; `amdgpu hwmon` ; énergie cumulée `NVML` (`mJ`) | `SUT` entier sur `SoC` (`A2`), ou moteur d'inférence seul lorsqu'un rail est physiquement exclusif (`A1`). |
| **`L3` process / cgroup** | Arbre de processus unique du `OS` | `Linux cgroup v2` (`cpu.stat`, `memory.peak`, `io.stat`), `perf` ; `macOS proc_pid_rusage` `ri_energy_nj` ; Win32 `GetProcessTimes` + `QueryProcessCycleTime` | Parts d'activité des ressources (`C`), ou modèle énergétique interne par processus du noyau `OS` (`D`). |
| **`L4` logical** | Conversation du modèle/outil | Comptages de jetons et latences d'appel de `satb-proxy` ; tours du harnais, appels d'outil et élisions de `ContextRule_v0` | Comptages exacts sur chaque `SUT` sans exception, y compris les `API` fermées de nuage. |

Chaque valeur énergétique figurant dans un reçu porte l'une des sept étiquettes d'attribution suivantes :

- **`A1` (Rail physique exclusif)** : Un capteur de rail matériel touché exclusivement par une partition pendant la fenêtre de mesure (par ex., `Jetson Thor INA3221 ch1 VDD_GPU` lorsqu’unique le moteur d’inférence local possède l’accès au dispositif `GPU`).
- **`A2` (Limite dédiée du système complet)** : Un compteur à l’échelle de la machine entière (`L0`/`L1`) ou du paquet complet (`L2`) sur une machine dédiée mise en pause (`SUT` plus plancher `OS` inactif). **Selon `OQ-4`, l’énergie brute de la fenêtre du `SUT` complet à `A2` constitue la métrique énergétique physique principale pour le placement**, empêchant les modèles minces de déléguer une recherche brute non comptabilisée vers les sous-processus `/work` et empêchant la soustraction `actif - inactif` d’embellir les exécutions lentes.
- **`B` (Division temporelle de phase)** : Différences de compteurs entre des fenêtres temporelles non chevauchantes délimitées par des marqueurs de phase séquentiels (`model_call` vs. `tool_call` dans `Lane B`).
- **`C` (Part proportionnelle, le modèle `Kepler`)** : Un compteur matériel partagé partitionné selon $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ ou l’utilisation du `GPU` lorsque des processus parallèles se chevauchent (`Lane O` `Shape H`).
- **`D` (Estimation modélisée par l’`OS`)** : Le modèle énergétique interne du noyau, par processus (`macOS ri_energy_nj`). Isole un arbre de processus des co-locataires `CPU`, mais demeure un modèle firmware/noyau plutôt qu’une lecture physique de dérivation.
- **`P` (Attesté par le fournisseur)** : Un nombre d’énergie serveur par requête fourni par un prestataire de cloud accompagné de sa méthodologie de mesure verbatim.
- **`N` (`not_available`)** : Non observé et **jamais estimé**.

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Discipline du compteur en sept étapes, collecte sans racine (`OQ-5`), et cartes de plateforme

`satb-meter` traite chaque tentative selon sept étapes ordonnées :
1. **Lire les compteurs cumulatifs à chaque frontière d'événement** (`attempt.start`, chaque `model_call` et `tool_call`, `attempt.close`, ainsi qu'une graduation de référence de `100 ms`) afin que l'énergie de fenêtre soit une différence exacte de compteurs $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$.
2. **Écrire d'abord les canaux bruts** : enregistrer la frontière, le capteur, les lectures de début et de fin, les débordements de compteur et le nombre d'échantillons ; marquer les fenêtres plus courtes que `10` périodes de capteur avec `"below_resolution"` et le matériel absent avec `"not_available"`.
3. **Séparer les phases séquentielles (`B`)** : dans `Lane B`, l'inférence du modèle et les appels d'outils `/work` ne se chevauchent jamais ; les harnais parallèles de `Lane O` remplacent la séparation des phases par `C` ou `N`.
4. **Isoler `engine_resident_during_tools`** : pendant l'exécution d'un outil `/work`, un serveur de modèle local (`llama-server`, `vLLM`) maintient les poids résidents sur le `GPU`/la `DRAM`. Sa consommation à vide pendant la fenêtre de l'outil est placée dans `engine_resident_during_tools` et n'est imputée ni à l'inférence active du modèle ni à l'exécution de l'outil.
5. **Répartir proportionnellement (`C`) uniquement là où les partitions se recouvrent** : appliquer les rapports $\Delta \text{CPU}$ strictement comme solution de repli de caractérisation, en reconnaissant que les états `C`, le `DVFS` en mode turbo et les blocages de `DRAM`/stockage violent la proportionnalité.
6. **Stocker les lignes de base comme canaux dérivés** : encadrer les sessions par des lignes de base de résidence avant et après ; si la puissance à vide avant/après dérive au-delà de `5.0%` (`Falsifier 6`), abandonner les valeurs nettes au-dessus du repos tout en conservant intacts les canaux bruts.
7. **Exécuter la vérification de somme (`Falsifier 2`)** : vérifier que les composantes de phase dérivées se recomposent en la différence brute du compteur de tentative à un quantum de capteur près (`1 mJ`) ; sinon, abandonner la répartition dérivée et ne conserver que le canal brut.

**Règle de collecte sans privilèges (`OQ-5`).** Les benchmarks ne doivent jamais exécuter l'orchestration du `SUT` en tant que `root` ni charger de pilotes personnalisés en anneau 0. Sous `macOS`, `satb-meter` utilise `macmon` sans privilèges (abonnement `IOReport`) et `proc_pid_rusage(RUSAGE_INFO_V6)` de `libSystem`, sans jamais recourir à `sudo` ni à `powermetrics`. Sous `Linux` (où `/sys/class/powercap/intel-rapl` est devenu accessible au seul `root` dans le noyau `5.10`, à la suite de `PLATYPUS`), une règle `udev` d'administration, appliquée une seule fois, accorde un accès en lecture à un groupe dédié `satb-meter` ne contenant **que l'`UID` de `satb-supervisor`**. Ainsi, les processus du bac à sable `/work` ne peuvent ni exploiter un canal auxiliaire sur `RAPL`, ni lire leur propre compteur d'énergie. Sous `Windows 11` (`NT 10.0.26300`), les jetons non privilégiés de type Basic User (`0x20000`) lisent directement l'énergie cumulée du `GPU` discret (`mJ`) via `nvml.dll` (`nvmlDeviceGetTotalEnergyConsumption`) ainsi que les cycles de processus du `L3` via `QueryProcessCycleTime` de Win32. En revanche, le registre `MSR` `0x611` de l'Intel `RAPL` exige un pilote noyau en anneau 0, interdit par `OQ-5` et par `HVCI`. L'énergie du boîtier `CPU` sous Windows est donc strictement placée en `"not_available"`, avec le libellé `N`.

| Plateforme cible | Canaux `L0` / `L1` du système complet | Canaux `L2` paquet / `SoC` | Canaux `L3` processus et `L4` logiques | Statut de vérification clé |
| :--- | :--- | :--- | :--- | :--- |
| **Mac Apple Silicon** (`M5 Max` vérifié) | `L0` : `Shelly` `PDU` (`not_available` si débranché) ; `L1` : `macmon sys_power` (`reported_j`) | `macmon IOReport` : `chip_power`, `cpu_power`, `gpu_power`, `ane_power`, `ram_power` (`reported_j`) | `L3` : `proc_pid_rusage` `ri_energy_nj` (`D`), `ri_instructions`, `ri_diskio_*` ; `L4` : `satb-proxy` | `L1` à `L4` sans privilèges root vérifiés en conditions réelles sur `Apple M5 Max` ; branchement `L0` en attente. |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`, `Linux x86-64` vérifié) | `L0` : `Shelly` `PDU` (`not_available` si débranché) ; `L1` : `cros_ec` (attributs de puissance à `0`) | `RAPL package-0` et `core` (`udev` `0440 root:energy`) `reported_j` + `amdgpu` `PPT` `power1_input` (`0444` ; `energy1_input` absent) | `L3` : `cgroup v2` / `getrusage` (parts d'activité `C`) ; `L4` : `satb-proxy` | Vérifié en conditions réelles (isolation `0440 root:energy` `PLATYPUS` ; `amdgpu PPT` `0444`). |
| **Intel Raptor Lake** (`Core i9-13900H`, `Linux x86-64` vérifié) | `L0` : `not_available` ; `L1` : `RAPL psys` (`intel-rapl:1/energy_uj`, `0444` `reported_j`) | `RAPL package-0`, `core` et `uncore` (`MSR` + `MMIO` `energy_uj`, `0444` `reported_j`) | `L3` : `cgroup v2` / `getrusage` (parts d'activité `C`) ; `L4` : `satb-proxy` | Vérifié en conditions réelles (résiduel `0 µJ` à l'étape 7 sur `psys` `L1` et `package-0` `L2`). |
| **NVIDIA Jetson AGX Thor** (Tegra `Linux aarch64` vérifié) | `L1` : `TI INA238` (`hwmon6` `VIN`, `0444` `measured_j`) + `INA3221 ch3 VIN_SYS_5V0` (`0444` `measured_j`) | `INA3221 ch1 VDD_GPU` (`0444` `measured_j`, `A1` en mode exclusif) ; `ch2 VDD_CPU_SOC_MSS` (`0444` `measured_j`) ; `NVML` (`non vérifié`) | `L3` : `cgroup v2` / `getrusage` (parts d'activité `C`) ; `L4` : `satb-proxy` | Vérifié en conditions réelles (`INA238` + `INA3221 ch1-ch3` `0444` sans privilèges root ; `NVML` GPU en attente sous verrou de cotenant). |
| **Windows 11 `x86-64` + `RTX` discrète** (`i7-1165G7` + `RTX 2060`, `NT 26300` vérifié) | `L0` : `not_available` ; `L1` : `WMI` `EMI` `PowerMeter` (`0` instance -> `not_available`) | `RTX 2060` : `nvml.dll` cumulé en `mJ` sans privilèges root (`reported_j`) ; `RAPL` CPU `MSR 0x611` : **`N` (`not_available` sans pilote en anneau 0)** | `L3` : Win32 `GetProcessTimes` + `QueryProcessCycleTime` (parts `C` ; `SRUM` grossier en arrière-plan de l'OS exclu) ; `L4` : `satb-proxy` | Vérifié en conditions réelles avec le jeton Basic User `0x20000` (résiduel `0 mJ` à l'étape 7 ; arrêt via Job Object en `2,46 ms`). |
| **API cloud fermée** (`Anthropic`, `xAI`, `Cerebras`, `OpenAI`, `Google`) | Mesure `L0`-`L1` locale de l'hôte client uniquement (exclue de l'inférence serveur) | Serveur distant `L2` : strictement **`N` (`not_available`)** ou **`P`** par requête (`OQ-6`) | `/work` local `L3` (`D`/`C`) pour les outils de bac à sable ; `L4` : jetons, appels et `USD` **exacts** via `satb-proxy` | Vérifié en conditions réelles sur `Anthropic`, `Cerebras` et `xAI` via `satb-proxy`. |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Huit pièges de mesure matérielle et sept quantités non attribuables

Les raccourcis standards de mesure de puissance échouent systématiquement sur les `SoC` et les `GPU` modernes :

| Écueil de télémétrie matérielle | Mitigation `SATB` |
| :--- | :--- |
| **La puissance au repos dérive avec la température de la puce, les ventilateurs, `DVFS` et le turbo** | Attendre le refroidissement du `GPU` (`<= 1.5 W`), encadrer chaque fenêtre avec des repères pré/post, enregistrer la température maximale du `GPU`, et invalider les joules nets dérivés au-de-hors d’un glissement de `5.0%` (`Falsifier 6`). |
| **Ambiguïté entre l’état d’inactivité à froid de la machine et l’inactivité avec les poids en mémoire** | Mesurer et étiqueter les deux explicitement à l’étape `6` plutôt que de soustraire silencieusement l’un de l’autre. |
| **La soustraction `Active - idle` favorise les exécutions lentes** | L’énergie brute de la fenêtre `SUT` complet (`A2`) demeure la figure principale de placement (`OQ-4`). |
| **Les fenêtres de sous-périodes sont lues comme zéro, négatives ou bruit de quantification** | Marquer toute fenêtre plus courte que `10` périodes de capteur comme `"below_resolution"` (p. ex., `< 1.2 s` à `~8 Hz` `macmon` ou `< 10 s` sur une prise intelligente `1 Hz`). |
| **Les collecteurs de télémétrie à haut débit consomment une puissance `CPU` notable** | Lire les compteurs cumulatifs aux limites d’événement (`0.011 mW` à `0 Hz`) plus un tick de `100 ms` ; enregistrer le repère `observer_only`. |
| **Le capteur de puissance instantanée `NVML` sur `A100`/`H100` ne prélève que `~25%` du temps d’exécution** | Lire le cumulatif `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) via un `FFI` en-processus (`1.17 ms` sur `RTX 2060` vs. `43.88 ms` processus `nvidia-smi`), jamais le sondage instantané `nvmlDeviceGetPowerUsage` (Chung et al.; Yang et al.). |
| **La prise murale externe `L0` fonctionne avec une horloge non synchronisée** | Émettre un impulse de charge de calibration à facteur d’occupation déterministe `50%` lors de `session.open` et `session.close` et recouper les horodatages par corrélation croisée. |
| **Démons de fond partagés ou travaux de co-locataire** | Consigner la liste des processus, réduire les soustractions dérivées `L2` partagées via `Falsifier 6`, et enregistrer le `ri_energy_nj` `L3` isolé-co-locataire (`D`) en parallèle du `L2` brut. |

Par conséquent, **sept grandeurs ne peuvent pas être attribuées de manière honnête** et sont exclues des affirmations `SATB` : (1) l'énergie serveur non attestée d'une `API` fermée (`N` ou `P` uniquement) ; (2) les joules physiques exacts par processus sur un rail `SoC` ou à mémoire unifiée partagée (`C` et `D` sont des modèles) ; (3) les poids du modèle isolés des noyaux de service, de la quantification, du traitement par lots et du silicium ; (4) l'appartenance du plancher d'inactivité de l'`OS` et la puissance des poids résidant dans la `DRAM` (rapportées comme canaux autonomes) ; (5) les événements individuels plus courts que la période du capteur (comme un appel d'outil de `30 ms` sous une prise de `1 s`) ; (6) les `VM` cloud partagées ou les domaines `CPU` Windows non privilégiés dépourvus de compteurs matériels en mode utilisateur ; et (7) les changements silencieux de poids chez le fournisseur en cours de session (signalés par des témoins de début et de fin, sans jamais être écartés a priori). En particulier (`OQ-6`), **les déclarations de durabilité des fournisseurs sont des médianes de flotte et non des mesures par requête, et n'entrent jamais dans un reçu `SATB`**, y compris la médiane de `0.24 Wh` par invite de Google pour `Gemini Apps`, le chiffre de `0.34 Wh` publié par OpenAI sans méthodologie, et les `1.14 gCO2e` par réponse de `400` jetons annoncés par Mistral.

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. Résultats mesurés de conformité, de déterminisme, d'effet d'observation et d'attribution multi-hôtes

Afin de remplacer des hypothèses de conception non mesurées par des justificatifs vérifiables, nous avons exécuté la suite complète de conformité `SATB` ainsi que le harnais de falsification (`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`, durée totale `175.69 s`) sur une station de travail `Apple M5 Max` (`arm64`, mémoire unifiée de `128 GB`, `macOS 27.2.1`, `macmon 0.12.0`), parallèlement à un audit inter-études portant sur `188` fenêtres et à des exécutions multi-silicium en direct sous `Linux` et `Windows 11`.

<div id="61-c1c12-conformance-c9-deterministic-replay-and-c10-process-tree-cleanup" class="anchor-alias" aria-hidden="true"></div>

### 6.1 conformité `C1-C12`, relecture déterministe `C9` et nettoyage de l'arbre de processus `C10`

All **`12 / 12` Rust reference conformance checks** (`dnull_cli satb-conformance`) and all extended operating-system checks passed:

- **Vérifications de bundle, terminal, confinement et empreinte (`C1`-`C8`, `C11`)** : `C1` a renvoyé le hachage canonique du bundle `455e941f51f8ffef`; `C2` a livré des charges utiles `submit` exactement identiques octet à octet via `satb-proxy` vers `Verifier`; `C3` a mappé les refus vides/instrués vers `refuse:other`; `C4` a ignoré les appels d'outil post-`submit` en fin de chaîne (`ignored_trailing_calls = 1`); `C5` a bloqué les échappées `../`, `/etc/passwd` et `verifier_oracle/*`; `C6` a retiré les variables d'environnement proxy/identifiants dans `/work` (`NP=*|HTTP=`) tout en renvoyant `HTTP 404` pour les chemins proxy non répertoriés; `C7` a interrompu immédiatement les réponses d'utilisation manquante comme `killed(usage_missing)`; `C8` a conservé l'empreinte de cinq blocs identique octet à octet `8b741c27bf364e5d` lors des exécutions à sec tout en signalant les permutations simulées de `system_fingerprint` avec `session_void = true`; et `C11` a vérifié la visibilité du compteur `RUSAGE_INFO_V6` sans élévation (`sudo_invoked = false`).

- **Relecture étendue `C9` multi-tour `ContextRule_v0` + `Truncate_v0`** : Sur une trace de `14` tours générant `24 KiB` de lectures de fichiers brutes par tour (`14` sorties tronquées à `8,192 B + 8,192 B` par `Truncate_v0`) dans une fenêtre de `48,000` jetons (`80%` seuil = `38,400` jetons), `ContextRule_v0` a éliminé de façon déterministe les **`5` sorties d'outil les plus anciennes** avec **`0` appels de modèle supplémentaires**, produisant une transcription canonique de `149,747` octets (`SHA-256` `d697ed1476129939...`) avec **`0` différence d'octet** à travers des relectures indépendantes de `/work`. Répéter la trace identique sous une fenêtre stricte de `16,000` jetons (où `8` sorties conservées de `16 KiB` dépassent `100%`) déclenchait de façon déterministe `killed(context_ceiling)`.

- **Nettoyage multi-processus `C10` `SIGKILL` étendu (`< 2,000 ms` plafond de spécification)** : Sur `5` essais engendrant un arbre de `4` processus (`sh` parent plus `3` veilleurs Python d'arrière-plan détachés dans un groupe de processus isolé), la délivrance de `SIGKILL` et le ramassage par le noyau se sont achevés en moyenne de **`2.073 ms`** (`1.429 ms` min, `2.571 ms` max, **`778×` en dessous** du plafond de `2,000 ms`) avec **`0` `PID` survivants** et le résultat `killed(wall_ceiling)`.

<div id="62-live-c12-eight-request-determinism-probes-across-four-model-substrates" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Sondes de déterminisme en direct `C12` à huit requêtes sur quatre substrats de modèles

Le routage de `8` requêtes identiques de synthèse algébrique par modèle (`32` appels nuage en direct plus `8` exécutions locales `Shape D`) via `satb-proxy` a vérifié une parité exacte à `100%` du nombre de jetons `C7` (`32/32` appels) et a mis en évidence trois régimes distincts de déterminisme :

| `SUT` / Point d'entrée via `satb-proxy` | Prévol `temperature = 0` | `sampling.temperature` enregistré | Sorties brutes distinctes (`/ 8`) | Formes algébriques distinctes (`/ 8`) | `system_fingerprint` | Latence moyenne |
| :--- | :---: | :--- | :---: | :---: | :--- | ---: |
| **`Shape D` : `dnull N1`** (Rust local) | `Exact i64` | `0 (exact_i64_q1e6)` | **`1 / 8`** | **`1 / 8`** | `0da4df8d9ccbce1e…` | `1,474.0 ms` |
| **`Anthropic claude-opus-5-5`** | **`HTTP 400`** | `not_available` (déprécié) | **`8 / 8`** | **`4 / 8`** | `not_available` | `3,389.1 ms` |
| **`Anthropic claude-sonnet-5-5`** | **`HTTP 400`** | `not_available` (déprécié) | **`8 / 8`** | **`2 / 8`** | `not_available` | `2,914.3 ms` |
| **`Cerebras gpt-oss-120b`** | `HTTP 200` | `0.0 (seed=42)` | **`2 / 8`** | **`2 / 8`** | `fp_fd4dff7eed92aaf38281` | `484.2 ms` |
| **`xAI grok-4.20-0309-non-reasoning`** | `HTTP 200` | `0.0 (seed=42)` | **`8 / 8`** | **`1 / 8`** | `fp_9974b11849` | `942.7 ms` |

1. **Dépréciation par les fournisseurs de `temperature = 0`** : Les deux modèles `claude-opus-5-5` et `claude-sonnet-5-5` ont rejeté `"temperature": 0.0` avec **`HTTP 400` (`"temperature` est déprécié pour ce modèle."`)**, validant empiriquement la règle de `SATB` selon laquelle les contrôles d'échantillonnage indisponibles doivent être normalisés en `"not_available"` plutôt que d'être silencieusement supposés égaux à zéro. Sur `8` appels identiques, `claude-opus-5-5` (`1,047` jetons de pensée adaptative) a émis `8` textes bruts distincts couvrant `4` identités bitvectorielles algébriquement distinctes (`(x | y) - (x & y)`, `(x | y) & ~(x & y)`, `(x & ~y) | (~x & y)` et `(x + y) - ((x & y) + (x & y))`).
2. **Non-déterminisme résiduel sous `temperature = 0, seed = 42`** : Même lorsque `temperature = 0.0` et `seed = 42` étaient acceptés (`HTTP 200`) avec un `system_fingerprint` stable, `Cerebras gpt-oss-120b` (`2,976` jetons de raisonnement) a produit `2` sorties distinctes sur `8` appels identiques, tandis que `xAI grok-4.20-0309-non-reasoning` s'est stabilisé sur `1` formule algébrique (`(x | y) & ~(x & y)`) pour l'ensemble des `8` appels tout en faisant varier sa phrase de preuve en prose sur les `8/8` réponses. Séparer le **déterminisme du harnais compte tenu des réponses enregistrées (`C9`)** de la **dispersion mesurée des sorties du `SUT` (`C12`)** est donc essentiel.

<div id="63-falsifier-5-observer-effect-benchmark-across-telemetry-cadences-10-s-windows" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Falsificateur 5 : benchmark de l'effet observateur selon les cadences de télémétrie (fenêtres de `10 s`)

La mesure combinée de l'échantillonneur (`Python` et le tube `IOReport` du processus fils `macmon`) portant sur le temps `CPU`, l'énergie `ri_energy_nj` de `L3` (`reported_j` de l'observateur seul) et le `reported_j` de `L2` pour l'ensemble du `SoC`, sur des fenêtres de `10.0 s` entrelacées, sur `Apple M5 Max`, a permis de quantifier précisément la surcharge de l'observateur :

| Cadence d'échantillonnage | Fréquence atteinte | Temps `CPU` de l'échantillonneur / `10 s` | `reported_j` de l'observateur `L3` | Puissance de l'observateur (`mW`) | Part de la fenêtre `L2` | Fenêtre `L2` de l'ensemble du `SoC` (`reported_j`) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`0 Hz` uniquement aux frontières** (`2` appels système `rusage`) | `0.20 Hz` | **`0.004 ms`** | **`0.000108 J`** | **`0.011 mW`** | **`0.0000%`** | `-` (aucun démon `IOReport`) |
| **`1 Hz` (tick de `1,000 ms`)** | `0.90 Hz` | `9.323 ms` | `0.194237 J` | `19.371 mW` | `0.0521%` | `372.769 J` (`37.17 W`) |
| **`10 Hz` (tick de référence `SATB` de `100 ms`)** | `8.12 Hz` | `36.434 ms` | `0.666596 J` | **`66.439 mW`** | **`0.1770%`** | `376.603 J` (`37.53 W`) |
| **`100 Hz` (falsificateur de stress de `10 ms`)** | `7.44 Hz` | `35.636 ms` | `0.598721 J` | `58.971 mW` | `0.1618%` | `369.926 J` (`36.44 W`) |

Deux faits matériels ressortent directement de cette mesure :
1. **Perturbation négligeable (`< 0.18%`)** : les lectures `proc_pid_rusage` effectuées uniquement aux frontières consomment `108 µJ` (`0.011 mW`), soit **`6,040×` moins de puissance** que l'interrogation `IOReport` à `10 Hz` (`66.44 mW`). Même le tick de référence de `100 ms` ne représente que **`0.177%`** de l'énergie de la fenêtre de l'ensemble du `SoC` (écart total de `0.76%` sur la fenêtre `L2` entre `-i 10` et `-i 1000`, ce qui satisfait le `Falsificateur 5`).
2. **Plafond de cadence d'abonnement `IOReport` (`~8 Hz`)** : la demande de `-i 10` (`100 Hz`) à `macmon 0.12.0` n'a atteint que **`7.44 Hz`** (`75.5` échantillons en `10.15 s`), car chaque cycle d'abonnement `IOReport` sans privilèges bloque pendant `~120 ms` dans l'espace utilisateur de macOS. En conséquence, le seuil `below_resolution` de `10` périodes de l'`Étape 2` correspond physiquement à **`~1.2 s`** sur les fenêtres `L2` de `macmon`, tandis que les opérations de moins d'une seconde doivent s'appuyer sur les compteurs `ri_energy_nj` de `L3` lus uniquement aux frontières (`0 Hz`) ou sur des fenêtres regroupées.

<div id="64-falsifier-3--step-7-b-temporal-boundary-vs-c-proportional-kepler-attribution" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Falsificateur 3 & Étape 7 : `B` frontière temporelle vs. attribution proportionnelle (`Kepler`) `C`

Sur `3` réplications sur `Apple M5 Max`, un seul `SUT` a exécuté **Phase 1** (`2.50 s` burst de hachage `SHA-256` dense en ALU : `29.27 ms` temps moyen `CPU`, `38.63 mJ` par `CPU`-ms) suivi séquentiellement par **Phase 2** (`2.51 s` `192 MiB` balayage de cache-miss `DRAM` + vidages de disque synchrones `fsync` et attentes `I/O` de `8 ms` : `15.94 ms` temps moyen `CPU`, `27.73 mJ` par `CPU`-ms) aux côtés d’un processus d’arrière-plan à cycle d’activité constant :

| Vérification d'attribution (`n = 3` réplications séquentielles bi-phase + co-locataires) | Phase 1 (`Compute` `2.50 s`) | Phase 2 (`DRAM + fsync I/O` `2.51 s`) | Falsificateur / Verdict Step-7 |
| :--- | ---: | ---: | :--- |
| **Delta exact de la frontière temporelle `B` `L3` (`reported_j`)** | `1.1272 J` (`1,127,172 µJ`) | `0.4433 J` (`443,317 µJ`) | **`Step 7` résiduel `<= 1 µJ` (`3/3` réussite)** |
| **`C` (`Kepler` $\Delta\text{CPU}$ part : `64.58%` vs. `35.42%`) sur `L3`** | `1.0145 J` (`-10.00%`) | `0.5560 J` (**`+25.21%` err moyenne**) | `DRAM`/stall énergie/ms $\ne$ `ALU` énergie/ms |
| **Delta exact de la fenêtre temporelle `B` `L2` du `SoC` complet (`reported_j`)** | `82.246 J` | `90.975 J` | `DRAM`, `NVMe`, et la consommation de l'hôte persiste pendant l'attente `I/O` |
| **`C` (`Kepler` $\Delta\text{CPU}$ part) appliqué à la fenêtre `L2`** | `111.758 J` (**`+35.86%` err**) | `61.464 J` (**`-32.59%` err**) | **`Falsifier 3` déclenché (`> 20%` erreur)** |

Alors que la vérification de somme de `Step 7` restait dans la plage `0-1 µJ` (`100.0%` des essais) sous les différences de compteur de frontière (`B`), l'attribution proportionnelle au temps `CPU` (`C`) a surévalué le burst de calcul de **`+35.86%`** et sous-évalué la phase mémoire-et-`fsync` de **`-32.59%`** sur le `L2` partagé (et a présenté une erreur de **`25.21%`** même sur le `L3` par processus), confirmant empiriquement pourquoi `SATB` restreint `C` aux harnais parallèles qui se chevauchent (`Shape H`) et signale une divergence séquentielle de `> 20%` via `Falsifier 3`.

<div id="65-multi-session-falsifier-6-audit-188-windows-and-falsifier-8-harness-floor-check" class="anchor-alias" aria-hidden="true"></div>

### 6.5 Audit multi-sessions `Falsifier 6` (`188` fenêtres) et vérification du plancher du harnais `Falsifier 8`

L'audit de **`188` fenêtres `IOReport` `L2` réelles**, collectées au cours de trois campagnes expérimentales sur l'hôte partagé `Apple M5 Max` ainsi que de deux évaluations appariées `Lane B` et `Shape H` (`Claude Code 2.1.330`), confirme les deux garde-fous au niveau des sessions :

1. **Audit de dérive de la référence `Falsifier 6` (`188` fenêtres)** : Sur `exp-001` (`11` fenêtres : `1` dans la limite de `5.0%`, `10` dérivant jusqu'à `44.5%`), `exp-002` et la session multi-tours (`7` fenêtres : `2` dans la limite de `5.0%`, avec le lot `dnull` de `1 190` instances à une dérive de `3.09%` et `BigCodeBench` sur `Qwen 3.6` à une dérive de `1.02%`, ainsi que `5` fenêtres dérivant de `12.16%` à `65.11%` sous synthèse concurrente `yosys-abc`), et `ai-reads-human` (`170` fenêtres à `loadavg_1m = 12.92` : `61` dans la limite de `5.0%`, `109` en dérive), **`64 / 188` fenêtres (`34.04%`)** ont conservé un `derived_marginal_j` valide, tandis que **`124 / 188` (`65.96%`)** ont automatiquement invalidé la soustraction de la consommation nette au-dessus du repos, sans perdre une seule lecture brute `reported_j` `L2` ou `L3` par `PID` (`188 / 188 = 100.0%` de conservation des données brutes).
2. **`Falsifier 8` (`Lane B` contre `Shape H` `Claude Code 2.1.330`)** : Sur `24` lots appariés de politiques formelles et `SQLite` `/work`, `Lane B` a atteint **`24 / 24` (`100.0%`)** avec `Claude Opus 5.5` (`44` appels de modèle, `63 568` jetons prompt+cache, `\$0.5477`) et avec `Claude Sonnet 5.5` (`43` appels, `60 284` jetons, `\$0.3413`). Il égale ainsi `Shape H` (`Claude Code 2.1.330` : **`24 / 24`**, `89` appels et `218 449` jetons sur `Opus 5.5` ; `83` appels et `196 128` jetons sur `Sonnet 5.5`), tout en réduisant le trafic de jetons prompt+cache d'un facteur **`3.44×` et `3.25×`**. Sur `6` dépôts Python multi-fichiers inédits de réparation de bogues (`config-defaults`, `interval-merge`, `pagination`, `precedence`, `rate-window`, `retry-backoff`), `Lane B` (`Opus 5.5` : `28` appels et `52 045` jetons ; `Sonnet 5.5` : `31` appels ; `Qwen 3.6 35B-A3B` local : `42` appels et `2 342.05 J` `L2`) égale de nouveau `Shape H` (`Claude Code 2.1.330` avec `Opus 5.5` : **`6 / 6`**, `30` appels et `86 744` jetons, soit `1.67×` plus de jetons), ce qui confirme que `Lane B` n'est **pas** un plancher de harnais dégradé.

<div id="66-multi-platform-hardware-attribution-across-five-silicon-and-os-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 Attribution matérielle multi-plateforme à travers cinq archétypes de silicium et de systèmes d’exploitation

Pour vérifier que la conformité `SATB`, le déterminisme en virgule fixe de la `forme D`, les frontières de permissions sans racine `PLATYPUS` / `HVCI`, et l’attribution par dérivation physique ou cumulative `NVML` se maintiennent sur `macOS`, `Linux` et `Windows 11`, nous avons exécuté `run_multi_host_satb.py` (`multi_host_satb_receipts.json`) et `run_windows_suite.py` (`windows_satb_receipts.json`) sur quatre archétypes matériels supplémentaires sous `Linux` et `Windows 11` en complément du `Apple M5 Max` :

| Archétype matériel et noyau `OS` | Frontière racine du capteur et classe de preuve | `Forme D` `1M` `DNULLMM1` (`10k` sondes) | Moyenne de relecture `C9` et d’arrêt d’arbre `C10` | Latence de lecture unique et `100 Hz` atteint | Résidu de l’`étape 7` et `Falsificateur 3` (`C` vs. `B`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`** (`arm64`, `128 GB`, `macOS 27.2.1`) | `IOReport` `L1`/`L2` + `rusage` `L3` (`reported_j` ; `measured_j = None`) | `15027705736` (`388.43 ns` `C++`, `582.57 ns` Rust) | `149,747 B` (`0` diffs) · `2.073 ms` (`0` `PID`s) | `~120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`** Phase 2 (`+35.86%` Ph. 1) |
| **`NVIDIA Jetson AGX Thor`** (`aarch64`, `122.9 GiB`, `Linux 6.8.12-1021-tegra`) | `TI INA238` (`hwmon6` `VIN` `L1`) + `INA3221` (`hwmon5` `ch1-ch3` `L2`/`L1`, `0444` **`measured_j`**) | `15027705736` (`984.86 ns` `C -O3`, `2,489.4 ns` Py) | `149,747 B` (`0` diffs) · `9.544 ms` (`0` `PID`s) | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2` (`-67.02%` `VIN`) |
| **`Framework AMD Ryzen AI Max+ 395`** (`x86-64`, `122.8 GiB`, `Linux 7.0.0-43`) | `RAPL package-0` & `core` (`0440 root:energy` **`reported_j`**) + `amdgpu PPT` (`0444` ; `measured_j = None`) | `15027705736` (`376.61 ns` `C -O3`, `1,341.7 ns` Py) | `149,747 B` (`0` diffs) · `0.868 ms` (`0` `PID`s) | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0` (`-63.34%` `core`) |
| **`Intel Core i9-13900H`** (`x86-64`, `14.7 GiB`, `Linux 7.0.0-43`) | `RAPL psys` (`L1`) + `package-0`, `core`, `uncore` (`L2`, `0444` **`reported_j`** ; `measured_j = None`) | `15027705736` (`420.93 ns` `C -O3`, `863.6 ns` Py) | `149,747 B` (`0` diffs) · `1.120 ms` (`0` `PID`s) | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0` (`-73.62%` `psys`) |
| **`Intel Core i7-1165G7 + RTX 2060`** (`x86-64`, `63.7 GiB`, `Windows 11 26300`) | `nvml.dll` `RTX 2060` cumulatif `mJ` (`L2` **`reported_j`**) + Win32 `L3` ; `CPU RAPL` = `N` (`measured_j = None`) | `15027705736` (`1,474.22 ns` `MSVC /O2`, `2,885.6 ns` Py) | `149,747 B` (`0` `CRLF`) · `2.458 ms` JobObj (`0` `PID`s) | `1,174.2 µs` `NVML` · **`64.64 Hz`** (`NT` tick) | `0 mJ` · **`-89.88%`** temps (`-77.05%` `RDTSC`) |

Cinq constats matériels et systèmes d’exploitation multi-plateformes émergent de ces reçus en direct :

1. **Invariance bit-à-bit du rejeu `Shape D` et `Lane B` sur `macOS`, `Linux` et `Windows 11` (`arm64`/`aarch64` et `x86-64`)** : Les cinq hôtes, y compris l'implémentation Win32 `CreateFileMappingA` + `MapViewOfFile` compilée avec `MSVC 19.44 /O2` et les E/S fichier `NTFS` sous `Windows 11` (`NT 10.0.26300`), ont produit la somme de contrôle exacte `DNULLMM1` de `10,000` sondes, **`15027705736`**, le condensat figé exact de `test.setpoint`, `0da4df8d9ccbce1e...4485781`, et la transcription `C9` exacte de `149,747` octets (`SHA-256` `d697ed1476129939...`, avec **`0` écart d'octets `CRLF` `NTFS`**). Dans le même temps, des arbres de processus incontrôlés de `4` `PID` ont été éliminés en `0.868 ms` à `9.544 ms` via des primitives noyau (`SIGKILL` sur `macOS`/`Linux`, et Win32 `TerminateJobObject` avec une **moyenne de `2.458 ms`** sur `Windows 11`). Cette dernière est **`50.0×` plus rapide** que le lancement de `taskkill.exe /F /T /PID`, dont la moyenne est de `122.817 ms`, et `> 200×` sous le plafond de spécification de `2,000 ms`.

2. **Séparation physique des shunts `INA238` / `INA3221` et `Falsifier 6` sous co-location `GPU` active sur `NVIDIA Jetson AGX Thor`** : Sous `Linux 6.8.12-1021-tegra`, `hwmon6` (`ti,ina238` à `i2c@c600000/ina238@44`, entrée `DC` globale de la carte `VIN` à `~27.97 V`) et les trois canaux de `hwmon5` (`ina3221@40` : `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS` et `ch3 VIN_SYS_5V0`) sont lisibles par tous (`0444`) sans `sudo`. Pendant notre sonde strictement `CPU` (`dedicated_host = false`), un co-locataire indépendant `llama-server` détenait le verrou `GPU` de l'hôte.

| Canal de shunt physique `Jetson AGX Thor` (`sysfs` sans privilèges, `0444`) | Frontière | Référence préalable (`W`) | Phase 1 Calcul (`measured_j` / `W`) | Phase 2 `DRAM+fsync` (`measured_j` / `W`) | Référence postérieure (`W`) | Dérive (`F6`) et erreur Phase-2 de `C` de `Kepler` |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`** (module + entrée du support) | **`L1`** | `100.70 W` | `122.12 J` (`101.66 W`) | `99.02 J` (`81.94 W`) | `97.21 W` | `3.47%` (`A2` retenu : co-locataire) · **`-67.02%`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`** (co-locataire `LLM`) | **`L2`** | `29.26 W` | `40.29 J` (`33.54 W`) | `26.00 J` (`21.52 W`) | `28.13 W` | Co-locataire `GPU` externe (variation de `-36.1%` dans `F5`) |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36.68 W` | `45.73 J` (`38.07 W`) | `44.37 J` (`36.71 W`) | `36.08 W` | `1.64%` (domaine `CPU`/`SoC`/`MSS`) · **`-70.01%`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`** (rail `5.08 V`) | **`L1`** | `14.89 W` | `18.66 J` (`15.53 W`) | `16.82 J` (`13.92 W`) | `13.98 W` | **`6.13% > 5.0%` (`F6` déclenché)** · **`-68.85%`** |

À travers les quatre fenêtres de cadence de `Falsifier 5`, les requêtes fluctuantes de co-locataire `LLM` ont fait passer `ch1 VDD_GPU` de `35.36 J` à `22.60 J` (`-36.1 %`), tirant l'`INA238 VIN` (`L1`) de la carte entière de `107.48 J` à `81.73 J` (`-24.0 %`) même si `ch2 VDD_CPU_SOC_MSS` est resté dans l'intervalle `35.76-39.31 J`. Parce que `dedicated_host = false` (et `ch3 VIN_SYS_5V0` a dépassé une dérive de `5.0 %` à `6.13 %`), `SATB` retient les affirmations de placement net de l'ensemble-`SUT` pour `A2` tout en préservant les `measured_j` séparés par rail exacts (`L1` et `L2` ne sont jamais additionnés).

3. **Isolation `PLATYPUS` `0440 root:energy` et vérification du domaine `APU` `Strix Halo` sur `Framework` `AMD`** : Sur `Framework` Desktop (`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`, `Linux 7.0.0-43-generic`), la règle `udev` `90-energy-read.rules` positionne `/sys/class/powercap/intel-rapl:0/energy_uj` (`package-0`) et `intel-rapl:0:0/energy_uj` (`core`) en mode **`0440` (`root:energy`, `world_readable = false`)** : les `UID` du bac à sable `/work` non groupés reçoivent `EACCES` (bloquant les canaux latéraux de `PLATYPUS`), tandis que le `GID` superviseur (`energy`) lit les microjoules cumulés sans racine à une latence médiane de `24.34 µs` (`0 µJ` résiduel à l'`Étape 7`). L'inspection de `hwmon9` (`amdgpu`) a en outre résolu un détail de spécification ouvert : le `Radeon 8060S` intégré de `Strix Halo` expose en lecture mondiale (`0444`) la puissance `PPT` (`power1_input` / `power1_average` en `µW`, `75.38 W` Phase 1 / `69.72 W` Phase 2) plutôt qu'un compteur séparé `energy1_input`, alors que `cros_ec` (`hwmon8`) n'expose que les ventilateurs et les thermiques de carte.

4. **Limite racine sans privilège bare-metal `Windows 11` (`0x20000` Basic User `NVML` contre bloc `RAPL` ring-0) et aliasing d'horloge `NT` à `15.625 ms`** : Sous un jeton Basic User explicitement désélevé (`runas.exe /trustlevel:0x20000`, `IsUserAnAdmin() == false`) sur `Windows 11 Pro` (`NT 10.0.26300`, `Intel Core i7-1165G7` + `NVIDIA GeForce RTX 2060`), les appels `FFI` intra-processus vers `nvml.dll` `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) et `nvmlDeviceGetPowerUsage` (`mW`) réussissent sans racine en **`1 174.15 µs` médian** (**`37.4×` plus rapide** que le lancement de `nvidia-smi.exe` à `43.88 ms` par appel), effaçant l'`Étape 7` avec un résiduel de **`0 mJ`** (`8.769 J + 8.816 J = 17.585 J`, dérive pré/post de `3.0 %`). Par contraste, les lectures en mode utilisateur non privilégié du `RAPL` Intel `MSR 0x611` sont bloquées par le noyau `Windows NT` sans pilote ring-0 signé (interdit par `OQ-5` et `HVCI`), et `WMI` `EMI` (`\\.\EnergyMeter` / `Win32_PerfRawData_Counters_PowerMeter`) expose `0` instance, plaçant le paquet `CPU` `L2` de Windows strictement dans l'étiquette `N` (`"not_available"`). En outre, parce que les mises à jour non ajustées de `Windows NT` actualisent `GetProcessTimes` sur des interruptions d'horloge d'environ `15.625 ms`, les rafales de sommeil de `8 ms` plus `FlushFileBuffers` en Phase 2 ont été aliasées à `62.5 ms` (part `CPU` de `5.06 %` contre `1 171.9 ms` en Phase 1), faisant errer l'attribution `Kepler` `C` de **`-89.88 %`** (`-77.05 %` même en utilisant les cycles `RDTSC` `QueryProcessCycleTime` sous-tic à une part de `11.48 %`).

5. **Physique du bus capteurs et de la cadence du minuteur `OS` sur les cinq plateformes** : alors que les lectures `sysfs` de `powercap` sur Linux `x86-64` s'achèvent en `24.34-45.37 µs` (`94.28-97.12 Hz` atteints à `100 Hz`), le quantum de sommeil par défaut de `Windows NT`, égal à `15.625 ms`, limite les boucles `NVML` non ajustées à `10 ms` à **`64.64 Hz`**, tout en fournissant proprement **`9.45 Hz`** au pas de référence de `SATB` à `100 ms` (`10 Hz`). Ce résultat correspond au plafond `I2C` de shunt de `Jetson AGX Thor` à `66.55 Hz` (`9.49 Hz` à la référence de `100 ms`) et contraste avec le plafond `IOReport` de `macmon` à `7.44 Hz`. Sur **`5 / 5`** architectures matérielles et `OS`, le fractionnement proportionnel au `CPU` (`C`) a sous-estimé la phase de `DRAM` de `192 MiB` et de synchronisation disque de **`32.59%` à `89.88%`**, ce qui confirme de manière universelle la raison pour laquelle `SATB` restreint `C` aux exécutions parallèles qui se recouvrent.

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. Vérification matérielle ouverte et limitations

| Falsificateur de session | Conséquence lorsqu'il est déclenché | Statut empirique dans cette étude |
| :--- | :--- | :--- |
| **`F1` Discordance de relecture (`C9`)** | Le harnais de référence est non déterministe | **Éliminé sur `5/5` hôtes (`0` octet/`CRLF` diffs sur `149,747 B`, `14` tours)** |
| **`F2` Échec du contrôle de somme sur `> 5 %` des tentatives** | Fractionnement d'attribution rompu sur l'hôte | **Éliminé sur `5/5` hôtes (`0 µJ` Linux ; `0 mJ` Win11 `NVML` ; `<= 1 µJ` `M5 Max`)** |
| **`F3` `B` et `C` divergent de `> 20 %` séquentiellement** | `C` (`Kepler`) marqué non fiable sur l'hôte | **Déclenché sur `5/5` hôtes (erreur `32,59 %-89,88 %`) ; `C` restreint** |
| **`F4` Charge impulsionnelle connue hors précision du capteur** | Capteur dégradé pour la session | **Ouvert (`L0` banc d'essai à impulsion de synchronisation sur prise intelligente non encore attaché)** |
| **`F5` Décalages de tick `10 ms` vs. `1 s` modifient l'énergie de la fenêtre** | Effet observateur de télémétrie | **Éliminé (`0,76 %` delta `M5 Max` `L2` ; `9,45-10,48 Hz` atteint à `100 ms` ref)** |
| **`F6` Dérive des lignes de base résidentes pré/post `> 5,0 %`** | Canaux nets dérivés invalidés | **Actif (`124/188` fenêtres `M5 Max` + dérives de co-locataire Linux proprement filtrées)** |
| **`F7` L'adaptateur passe `C1`-`C12`, échoue au canari** | Conformité insuffisante ; session `void` | **Vérifié en simulation (`session_void = true` lors de l'échange)** |
| **`F8` `Lane B` se place en dessous de harnais `Lane O` forts** | `Lane B` rapporté strictement comme un plancher | **Éliminé (`24/24` et `6/6` parité vs. `Claude Code 2.1.330`)** |

Trois éléments concrets de matériel et d'adaptateur restent ouverts (`OQ-5`) :
1. **Sessions `A2` quiescentes dédiées et étalonnage de prise murale `AC` `L0`** : Bien que les rails de shunt `measured_j` physiques `TI INA238` (`L1`) et `INA3221` (`L2`/`L1`) soient désormais vérifiés en direct sur `NVIDIA Jetson AGX Thor` parallèlement aux compteurs rootless `reported_j` sur `Apple M5 Max`, `Framework AMD Strix Halo`, `Intel Raptor Lake` et `Windows 11` (`RTX 2060` `NVML`), les cinq machines de banc d'essai ont exécuté des services partagés ou des charges de co-locataires (`dedicated_host = false`), ce qui empêche les affirmations de placement `A2` sur `SUT` entier ; l'attachement d'un compteur `AC` `L0` à impulsion de synchronisation (`Shelly` / `Yokogawa`) sur un hôte dédié quiescent est l'étape suivante.
2. **Vérification du compteur `NVML` sur `GPU` intégré de `Jetson AGX Thor`** : Alors que le compteur `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) sur `GPU` discret est désormais vérifié de manière rootless via `nvml.dll` sur `NVIDIA GeForce RTX 2060` (`Windows 11`), le sondage de l'énergie cumulée `NVML` sur le `GPU` Tegra unifié de `Jetson AGX Thor` parallèlement à son shunt vérifié `0444` `INA3221 ch1 VDD_GPU` attend une fenêtre d'inactivité lorsque le verrou `GPU` partagé est libre.
3. **Liste active plus large des formes `Shape H` et `Shape I`** : Les exécutions de harnais externe en direct dans cette étude ont exercé `Shape H` sur `Claude Code 2.1.330` parallèlement à `Lane B` et `Shape D` ; l'exécution en direct de la certification `C1-C12` sur les solveurs `Codex CLI`, `OpenHands`, `Terminus-2` et `Shape I` `Inspect` est l'étape suivante.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Références

<ol data-refs>
<li>Anthropic (2026). Claude Code sandboxing and MCP configuration documentation. <a href="https://docs.anthropic.com/en/docs/claude-code/security">https://docs.anthropic.com/en/docs/claude-code/security</a></li>
<li>ARC Prize Foundation (2026). ARC-AGI-3 interactive benchmarking and adapter harness specification. <a href="https://github.com/arcprize/">https://github.com/arcprize/</a></li>
<li>Chung, J.-W., Gu, Y., Jang, I., Meng, L., Bansal, N., &amp; Chowdhury, M. (2024). Zeus / ML.ENERGY: Understanding and optimizing GPU energy consumption of DNN training and inference. <em>NSDI 2023 / ML.ENERGY</em>. <a href="https://ml.energy/">https://ml.energy/</a></li>
<li>Cloud Native Computing Foundation (2025). Kepler (Kubernetes-based Efficient Power Level Exporter): Proportional CPU/GPU power attribution model. <a href="https://github.com/sustainable-computing-io/kepler">https://github.com/sustainable-computing-io/kepler</a></li>
<li>gerganov, g., &amp; contributors (2026). <code>llama.cpp</code> HTTP server and prompt-cache determinism documentation. <a href="https://github.com/ggml-org/llama.cpp">https://github.com/ggml-org/llama.cpp</a></li>
<li>Kwon, W., Li, Z., Zhuang, S., Sheng, Y., Zheng, L., Yu, C. H., et al. (2023/2026). Efficient memory management for large language model serving with PagedAttention and vLLM batch invariance notes. <em>SOSP 2023 / vLLM Docs</em>. <a href="https://docs.vllm.ai/">https://docs.vllm.ai/</a></li>
<li>Lipp, M., Kogler, A., Oswald, D., Schwarz, M., Easdon, C., Canella, C., &amp; Gruss, D. (2021). PLATYPUS: Software-based power side-channel attacks on x86. <em>IEEE Symposium on Security and Privacy (SP)</em>, 355-371. <a href="https://platypusattack.com/">https://platypusattack.com/</a></li>
<li>Luccioni, A. S., Jernite, Y., &amp; Strubell, E. (2024/2026). Power hungry processing and comparative disclosures of commercial AI energy figures. <em>FAccT / Hugging Face Blog</em>. <a href="https://huggingface.co/blog">https://huggingface.co/blog</a></li>
<li>Model Context Protocol (2025). MCP specification: Tools (`tools/list`, `tools/call`, and `tools/list_changed`). <a href="https://modelcontextprotocol.io/specification">https://modelcontextprotocol.io/specification</a></li>
<li>NVIDIA Corporation (2025/2026). Jetson Thor series power management, INA238 carrier, and INA3221 rail monitoring guide. <a href="https://docs.nvidia.com/jetson/">https://docs.nvidia.com/jetson/</a></li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; Deterministic Null [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>OpenAI (2025/2026). Codex CLI Linux Landlock/seccomp and macOS Seatbelt sandboxing architecture. <a href="https://github.com/openai/codex">https://github.com/openai/codex</a></li>
<li>Rundgren, A., Jordan, B., &amp; Erdtman, S. (2020). JSON Canonicalization Scheme (JCS). <em>IETF RFC 8785</em>. <a href="https://www.rfc-editor.org/rfc/rfc8785">https://www.rfc-editor.org/rfc/rfc8785</a></li>
<li>Terminal-Bench Team (2025/2026). Terminal-Bench 2 and Terminus-2 (Harbor) terminal agent evaluation benchmark. <em>arXiv / GitHub</em>. <a href="https://github.com/laude-institute/terminal-bench">https://github.com/laude-institute/terminal-bench</a></li>
<li>UK AI Safety Institute (2025/2026). Inspect Evals: ReAct solver (`react()`) and Inspect Agent Bridge documentation. <a href="https://inspect.aisi.org.uk/">https://inspect.aisi.org.uk/</a></li>
<li>vladkens (2025/2026). <code>macmon</code>: Sudoless Apple Silicon power and performance monitoring CLI over <code>IOReport</code>. <a href="https://github.com/vladkens/macmon">https://github.com/vladkens/macmon</a></li>
<li>Wang, X., Li, B., Song, Y., Xu, F. F., Tang, X., Zhuge, M., et al. (2025). OpenHands: An open platform for AI software developers as generalist agents. <em>ICLR 2025</em>.</li>
<li>Xie, T., Zhang, D., Chen, J., Li, X., Zhao, S., Cao, R., et al. (2024). OSWorld: Benchmarking multimodal agents for open-ended tasks in real computer environments. <em>NeurIPS 2024</em>.</li>
<li>Yang, J., Jimenez, C. E., Wettig, A., Lieret, K., Yao, S., Narasimhan, K., &amp; Press, O. (2024/2025). SWE-agent: Agent-computer interfaces enable automated software engineering, and <code>mini-swe-agent</code> reference implementation. <em>NeurIPS 2024 / GitHub</em>. <a href="https://github.com/SWE-agent/mini-swe-agent">https://github.com/SWE-agent/mini-swe-agent</a></li>
<li>Yang, Z., Adamek, K., &amp; Armour, W. (2024). Accurate and convenient energy measurements for GPUs: Detailed study of <code>nvidia-smi</code> part-time power sampling. <em>arXiv:2312.12741</em>.</li>
</ol>
