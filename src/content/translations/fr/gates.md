---
title: "Portes de validation mesurées : énergie jusqu'à l'achèvement correct pour les systèmes agentiques"
deck: "Une porte qui permet à un agent d'agir uniquement après la réussite d'une vérification, une cascade qui essaie d'abord la méthode la moins coûteuse, et les mesures énergétiques des deux, étiquetées selon la manière dont chacune a été obtenue."
lang: "fr"
source: "gates"
complete: true
---

<div id="notational-intelligence-as-commit-law" class="anchor-alias" aria-hidden="true"></div>
<div id="metered-commit-gates-energy-to-correct-completion-for-agentic-systems" class="anchor-alias" aria-hidden="true"></div>

*Révision db13599, 5 novembre 2026. Données et code: [research.openie.dev/data/](/data/#gates). LaTeX PDF: [/pdfs/latex/gates.pdf](/pdfs/latex/gates.pdf) ([source](/pdfs/latex/gates.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Vue d'ensemble

Ce document définit une porte qui ne permet à une machine d’agir qu’après qu’une vérification soit réussie, ainsi qu’une règle qui essaie d’abord la méthode la moins coûteuse. Il rapporte des résultats logiciels et une mesure d’énergie au niveau d’une carte, chacune étiquetée selon la façon dont elle a été obtenue.

**En termes simples**

1. Un ordinateur ne doit pas effectuer une action irréversible tant qu’une vérification simple n’a pas indiqué qu’elle est sûre.
2. Il doit d’abord tenter la façon la moins chère d’accomplir une tâche et n’utiliser un grand modèle d’IA que si aucune solution moins coûteuse ne fonctionne.
3. Chaque décision est consignée avec l’énergie qu’elle a consommée, de sorte que quiconque puisse la vérifier ultérieurement.

Ce document comporte deux parties qui partagent une même règle : la correction constitue la porte, et les joules servent de critère de classement. La partie I est la porte de validation. Une proposition ne peut pas s’autoriser elle‑même. Un acte irréversible s’exécute uniquement derrière un certificat, et chaque décision, validation ou refus, est écrite dans un reçu. La partie II est le Mélange de limites : une tâche nécessite une énergie attendue minimale pour se clôturer, et l’énergie dépensée après la fin de la tâche n’achète aucun progrès vérifié. Son instance standard est une cascade qui essaie d’abord le mécanisme le moins cher : Recherche, puis Formule, puis Solveur, puis Modèle. La cascade s’arrête dès que le prédicat d’achèvement de la tâche $C(z)$ est vrai, et elle refuse avec un reçu lorsque le mécanisme suivant dépasserait le budget. Parmi les systèmes qui terminent correctement la tâche, celui qui nécessite le moins de joules obtient le meilleur rang.

Une mesure sur carte ancre le tissu de la porte. Sur un AMD Kria KV260, l’INA260 embarqué a lu des différences A/B/A au niveau du SOM de 11 428 pJ par cycle de porte (erreur standard 129 pJ, N = 4) pour le tissu de porte WCA, et de 98,0 pJ par cycle de graine (erreur standard 30,8 pJ, N = 4) pour le tissu de graine. L’INA260 est alimenté par `VCC_SOM`, qui alimente le système de traitement, la logique programmable, la mémoire DDR et les régulateurs du module ([KV260 device tree, `ina260@40`](https://gbmc.googlesource.com/linux/+/ccd1cdca5cd433c8a5dff78b69a79b31d9b77ee1/arch/arm64/boot/dts/xilinx/zynqmp-sck-kv-g-revB.dtso)), il s’agit donc de différences pour l’ensemble du module, et non d’une valeur uniquement pour le rail du cœur ou de la PL (Section I.3.7). La différence du tissu de graine dans le tableau de la Section I.4.9 est de +0,0098 W (erreur standard 0,0031 W), soit 9,8 mW, équivalente aux 98,0 pJ par cycle de graine à environ 100 MHz. Avec l’alimentation de 5 V indiquée pour cette comparaison, cela correspond à 1,96 mA, proche de la résolution de courant de 1,25 mA du composant, et la différence est déclarée non concluante tant qu’un compteur de rail PL et au moins dix passes ne sont pas réalisés.

<div id="01-contributions" class="anchor-alias" aria-hidden="true"></div>

### 0.1 Contributions

Une enveloppe de validation : proposition, puis certificat, puis validation ou refus, puis reçu. Le certificat est conjonctif : recherche autorisée ET un prédicat énergétique, éventuellement ET une fonction de barrière de contrôle. Les raisons de refus sont typées. Une implémentation de référence logicielle en Rust, Wise Computer Automation (WCA), l’exécute (Part I).

Un invariant de provenance typé. La sortie étiquetée `ModelGenerated` ne peut jamais être promue en `Deterministic` (Parts I and II).

Une cascade avec des refus nommés, et la condition selon laquelle le plus économique d’abord est optimal en joules attendus, qui découle du résultat d’ordre de Simon et Kadane pour la recherche séquentielle : essayer les engrenages dans l’ordre décroissant de $p_i / c_i$, où $p_i$ est la probabilité que l’engrenage $i$ clôture la tâche et $c_i$ son énergie attendue en joules (Simon et Kadane, 1975) (Part II).

Énergie pour une complétion correcte comme classement, définie dans la Section 0.2.

Les reçus comme instrument. Chaque reçu contient le hachage de prédiction et son horodatage avant l’action, le résultat, la correspondance, les joules par niveau (mesurés, rapportés, estimés, jamais additionnés) et la raison du refus.

<div id="02-energy-to-correct-completion" class="anchor-alias" aria-hidden="true"></div>

### 0.2 Énergie jusqu'à l'achèvement correct

Soit $C(z)$ le prédicat d’achèvement de tâche, avec toute échéance inscrite dedans. Pour un système $S$ doté de politiques $\pi$ et d’un taux d’échec autorisé $\delta$,

$$
J^*(S) = \min_{\pi} \; \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta .
$$

La justesse et les échéances sont des contraintes. Parmi les systèmes qui franchissent le portail, les joules seuls les ordonnent. Ordonner les systèmes selon le nombre réel $J^*$ constitue un pré‑ordre total, puisque toute paire de réels se compare. Si chaque lecture comporte une erreur de mesure maximale de $\epsilon$ joules, deux systèmes dont les $J^*$ diffèrent de plus de $2\epsilon$ conservent leur ordre. MLPerf Power place chaque résultat de puissance derrière un objectif de précision. $J^*$ a la même forme.

<div id="03-how-to-read-this-paper" class="anchor-alias" aria-hidden="true"></div>

### 0.3 Comment lire cet article

Les sections de la Partie I sont numérotées I.n et les sections de la Partie II sont numérotées II.n. Chaque partie possède sa propre liste de références. Deux figures illustrent les idées principales : la Figure 1 (Section I.1) représente le commit gate, et la Figure 2 (Section II.1) représente le plancher et le plateau du Mixture of Limits. Les prix et la demande ne sont pas discutés ici.

<div id="part-i" class="anchor-alias" aria-hidden="true"></div>
<div id="part-i-the-commit-gate" class="anchor-alias" aria-hidden="true"></div>

## Part I. La porte de validation

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="i-abstract" class="anchor-alias" aria-hidden="true"></div>

## I. Résumé

Les agents proposent des actions. Le travail irréversible ne commence que lorsqu’une action est autorisée à s’exécuter. Cet article traite cette étape d’autorisation comme un objet formel. L’intelligence notationnelle de Linus Lee est l’observation qu’un changement de symboles peut rendre certaines pensées bon marché et d’autres exprimables. L’affirmation ici est plus restreinte. Pour les machines qui peuvent déplacer de la matière ou appeler un outil irréversible, la notation utile est une loi d’exécution : une proposition ne peut pas s’autoriser elle‑même. La référence logicielle, Wise Computer Automation (WCA), consigne la loi sous forme de quatre objets selon le schéma `wca.commit.v1` : une proposition, un certificat, une raison de refus typée et une décision de validation. Le certificat utilisé dans la référence est conjonctif. Une table de recherche (LUT) « allow bit » doit être vraie, et un prédicat d’énergie doit être vrai. Une fonction de barrière de contrôle (CBF) optionnelle peut être ajoutée. Les appels en lecture seule peuvent contourner la porte. Les appels irréversibles ne le peuvent pas.

Les valeurs d’énergie dans cet article sont le produit du nombre d’opérations et de constantes d’énergie analytiques (un modèle OpCounter). Elles ne représentent pas la puissance du tableau. Le comportement des circuits logiques programmables (FPGA) se décline en trois classes ici. La simulation Icarus Verilog vérifie la logique de transfert de registre émise. Un Alchitry Pt V2 exécute la porte en boucle fermée et concorde avec le logiciel sur chaque décision. Il ne possède pas de compteur, son énergie est donc non mesurée. Un AMD Kria KV260 exécute le tissu de la porte sous son moniteur d’alimentation INA260 embarqué. En arrêtant et en exécutant le même flux de bits, en alternant A/B/A, on obtient une différence mesurée au niveau du tableau de 11 428 pJ par cycle de porte (erreur standard 129 pJ, N = 4) pour huit évaluations parallèles de LUT allow, du prédicat d’énergie et de la barrière à 25 MHz. Le tissu de semence plus petit donne 98,0 pJ par cycle de semence (erreur standard 30,8 pJ, N = 4). Ce sont les `measured_j` au niveau du tableau. Il ne s’agit pas de lectures sur le rail du cœur ni d’un coût en joules d’une plante en boucle fermée (Section I.3.7). L’étape B est disponible comme instrument de navigateur à https://research.openie.dev/living/fpga-sim/. Il compile la même porte Rust en WebAssembly (WASM) et montre l’état de la LUT ainsi que les traces de validation via l’API WebGPU. Cet instrument est une émulation. Il ne s’agit pas d’une mesure d’appareil sous test (DUT) et il ne représente pas la puissance du tableau Alchitry.

Les résultats logiciels mesurés sont bornés. Sur un épisode de pendule de 16 étapes avec la semence 1, la référence valide 1 étape et refuse 15. L’énergie analytique de l’épisode est de 8,6795e‑10 joule. Sur le contrôle port‑Hamiltonien à point fixe Safe déclaré, les autorisations fausses contre l’oracle d’énergie continue `Vdot <= epsilon` sont nulles sur les maillages indiqués, et le coût est de 79 refus faux sur 209 261 décisions (Section I.4.3). C’est la paire de sécurité et de vivacité sur cet ensemble de tests (Section I.4.10). Une démonstration Model Context Protocol (MCP) refuse un appel d’outil irréversible sans invoquer l’exécuteur. Une comparaison ludique avec une barrière à ensemble d’énergie et un bouclier discret montre un désaccord selon les définitions de sécurité. Aucun de ces résultats ne constitue une affirmation de leadership énergétique en silicium, de performance de contrôle industriel, ou de mesure sur le rail du cœur.

<div id="notation" class="anchor-alias" aria-hidden="true"></div>
<div id="i-notation" class="anchor-alias" aria-hidden="true"></div>

## I. Notation

Les termes sont définis lors de leur première utilisation scientifique ci‑dessous et rassemblés ici afin que les sections ultérieures puissent employer la forme courte.

| Terme | Définition dans cet article |
|------|--------------------------|
| Intelligence notationnelle | L'affirmation de Lee selon laquelle de meilleures notations peuvent augmenter ce qu'une personne ou un système peut faire de façon fiable, au-delà de l'ajout d'outils seuls. |
| Portail de validation | Une règle d'exécution qui applique soit une action proposée, soit la refuse. Le proposeur ne dispose pas d'un second canal informel. |
| Automatisation informatique sage (WCA) | La référence logicielle qui implémente le portail de validation à la frontière entre une proposition et un effet irréversible. |
| Architecture énergie‑d'abord (EFA) | Le choix de conception consistant à placer un prédicat d'énergie à l'intérieur de l'enregistrement d'autorisation, et non seulement dans un rapport ultérieur. |
| Proposition | Une action candidate `u`, un état, et des indices analytiques d'énergie optionnels. Elle ne peut pas être validée. |
| Certificat | L'enregistrement du portail : autorisation LUT, prédicat d'énergie, prédicat CBF optionnel, raisons et métriques. |
| Raison de refus | Un code typé tel que `lut_veto`, `energy_veto`, `cbf_veto`, `budget_exceeded` ou `policy`. |
| Décision de validation | L'enveloppe qui fixe l'action de la plante à `u` ou à zéro. |
| Table de correspondance (LUT) | Une fonction discrète d'un code compact vers autoriser ou refuser. |
| Multiplicateur matriciel ternaire de table de correspondance (TLMM) | Le chemin de proposition à faible coût basé sur la table ternaire de la référence. |
| Fonction de barrière de contrôle (CBF) | Un certificat d'invariance d'ensemble lorsque son inégalité est satisfaite (Ames et al., 2019). |
| Protocole de contexte de modèle (MCP) | Un transport d'appel d'outil. Dans cet article il s'agit d'un adaptateur en cours de test, pas d'un certificat de plante. |
| Système Un | Procédures de décision typées (classe Laya / Jev) qui choisissent parmi des options connues dans le logiciel. Elles sont des proposeurs. |
| Port-Hamiltonien | Un modèle énergétique structuré utilisé ici pour une vérification de style passivité sur des plantes factices. |
| Vérification d'exécution (RV) | Vérification d'une propriété sur une trace en cours d'exécution. Liée, mais pas identique, à l'enregistrement de validation. |
| Dispositif sous test (DUT) | Matériel mesuré sous une charge de travail déclarée avec un compteur déclaré. Les exécutions KV260 de la Section I.3.7 sont les seules mesures DUT de cet article. |
| Réseau de portes logiques programmable (FPGA) | Logique reconfigurable. Cet article rapporte une simulation Verilog, un Alchitry Pt V2 programmé avec énergie non mesurée, et des relevés de compteur au niveau de la carte KV260 (Section I.3.7). |
| WebAssembly (WASM) | Une cible de compilation portable pour le navigateur. L'émulateur FPGA WASM de l'étape B est disponible à https://research.openie.dev/living/fpga-sim/. |
| WebGPU | L'API GPU du navigateur nommée comme le chemin d'affichage et d'évaluation de grille pour cet émulateur. |
| Alchitry Pt V2 | La documentation du vendeur identifie un Xilinx Artix-7 XC7A100T. FPGA programmé (chargé en SRAM) avec le portail de validation en boucle fermée ; énergie non mesurée (Section I.3.7). |
| DiffLogic | Réseaux de portes logiques différentiables entraînés vers une structure booléenne (Petersen et al., 2022). |
| Estimation analytique d'énergie | `J = sum_op count_op * E_op` avec des constantes nommées. Pas la puissance de la carte. |
| Modeled | Une quantité obtenue à partir d’une formule indiquée ou d’une structure ajustée. |
| Simulated | Une quantité obtenue en exécutant le logiciel ou le modèle Verilog. |
| Board-measured | Une quantité provenant d’un compteur sur un dispositif et une charge de travail indiqués. Seules les lectures KV260 de NI-9 appartiennent à cette classe. |
| Oracle-safe | Accord avec l’oracle d’énergie continue `Vdot <= epsilon` sur la plante indiquée. |
| Check-safe | Le résidu fixe discret Safe / Q16.16 qui approxime cet oracle dans la porte. |
| Set-safe | Invariance d’ensemble sous un prédicat de barrière ou de bouclier (par exemple un CBF d’ensemble d’énergie), qui peut être en désaccord avec oracle-safe. |

<div id="terms-used-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i-terms-used-here" class="anchor-alias" aria-hidden="true"></div>

### I. Termes utilisés ici

Ce document distingue déjà trois prédicats de sécurité. **Oracle-safe** signifie l’oracle continu `Vdot <= epsilon`. **Check-safe** désigne le résidu discret Safe Q16.16 qui suit cet oracle dans la porte. **Set-safe** signifie l’invariance d’ensemble sous une barrière ou un bouclier. NI-4 montre que check-safe et set-safe peuvent diverger. La référence logicielle est l’implémentation Rust qui produit chaque résultat simulé ici. Les classes de preuve sont définies dans le tableau Notation : modeled, simulated, board-measured. Le drapeau de page `board_metered` est vrai en raison des seules lectures KV260.

**Analytical constants.** `E_LUT_READ = 1e-12` J et les autres constantes OpCounter de la Section I.3.4 sont des substituts d’ingénierie pour la comparaison relative à l’intérieur de ce modèle. Elles ne sont pas des mesures calibrées sur la carte. Ne les interprétez pas comme des joules de silicium. Le compte zero-false-allows contre l’oracle nommé reste tel que rapporté.

**Living figures.** Commit stack : [/living/ni/#ni-diag-02](/living/ni/#ni-diag-02). Seed-1 runner : [/living/ni/#ni-run-01](/living/ni/#ni-run-01). Safe false-allow=0 : [/living/ni/#ni-run-02](/living/ni/#ni-run-02). Stage B simulator : [/living/fpga-sim/](/living/fpga-sim/).

**Scope of Part I.** La Section I.2 place l’enregistrement de commit par rapport à la recherche de notation, à la théorie de l’information, aux résultats d’échelle, aux réseaux LUT, aux certificats de contrôle et à l’application en temps réel. La Section I.3 définit les objets, les plantes, le modèle analytique d’énergie, l’instrument de navigation et les cartes. La Section I.4 ne rapporte que les quantités produites par la référence logicielle, par les cartes ou par une source externe citée. La Section I.5 répond aux objections qui ont une forme publiée. La Section I.6 indique ce qui falsifierait les affirmations et ce qui n’a pas été mesuré.

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>
<div id="i1-introduction" class="anchor-alias" aria-hidden="true"></div>

## I.1. Introduction

Un modèle de langage peut classer des actions. Le classement n’est pas une autorisation. Le mode d’échec qui importe pour une usine, une coquille, un paiement ou une étape de laboratoire destructive est un commit : l’action s’exécute. Les scores souples restent utiles en amont. Ils sont du mauvais type à la branche irréversible, car une probabilité ne nomme pas quel prédicat a échoué, et elle ne force pas la commande de l’actionneur à zéro.

Lee (2022) expose clairement une affirmation antérieure. La notation n’est pas une décoration. Une notation qui rend une opération exécutable change les erreurs qui peuvent être consignées et celles qui peuvent être cachées. Iverson (1980) a fait le même constat pour les langages de tableaux : la notation est un outil de pensée. Engelbart (1962) a considéré le langage, les artefacts, les méthodes et la formation comme un seul système. Kay (1972) et Victor (2013 ; 2012 talk) ont soutenu que les représentations doivent garder les conséquences proches de l’idée éditée. Matuschak et Nielsen se sont demandé pourquoi les outils de pensée s’arrêtent en tant que produits. Cette littérature porte sur la cognition et les médias. Elle ne spécifie pas, en soi, un enregistrement qu’une machine doit respecter avant de se déplacer.

Le centre industriel de l’intelligence artificielle récente est l’échelle. Kaplan et al. (2020) et Hoffmann et al. (2022) rapportent une mise à l’échelle de la perte avec les paramètres, les données et le calcul. Hooker (2021) soutient que les idées se diffusent lorsqu’elles s’ajustent au matériel et aux noyaux disponibles. Ces résultats décrivent comment la capacité d’un proposeur croît avec les ressources qui y sont consacrées. Ils ne définissent pas un prédicat de commit.

La contribution de cet article est une référence logicielle pour ce prédicat, ainsi qu’un rapport de ce que la référence réalise réellement sur des plantes factices. La contribution est compositionnelle. Les boucliers LUT booléens, les certificats d’énergie, la recherche ternaire dans une table et les transports d’outils existent déjà dans des travaux antérieurs. La référence les relie en une décision auditable : proposition, puis certificat, puis refus typé ou commit. L’affirmation porte sur l’existence et le comportement de cette référence, pas sur la priorité.

Trois énoncés de mesure contraignent chaque nombre ultérieur. Premièrement, les joules calculés par l’OpCounter sont des estimations analytiques. Deuxièmement, les résultats Verilog sont des simulations. Troisièmement, les seuls joules de carte sont les différences au niveau de la carte KV260 de la Section I.3.7, enregistrées comme `measured_j` avec le compteur nommé. Le drapeau de résultat de carte est vrai uniquement pour ces exécutions KV260. Le Pt V2 reste non mesuré. Un lecteur doit pouvoir distinguer le modélisé, le simulé et le mesuré sur carte à partir de la clause de méthode rattachée au nombre.

Figure 1 illustre la porte de commit.

![Flow diagram: propose, then certify against the predicate and certificate, then either commit an act on the world or refuse with no act. Both outcomes write a receipt with a hash, joules and a reason.](/figures/gates/commit-gate.svg)

*Figure 1. La porte de commit. Diagramme de proposer, certifier, commettre ou refuser, et reçu, tel que défini dans la Section I.3. Une [PNG copy](/figures/gates/commit-gate.png) est fournie.*

<div id="i2-related-work" class="anchor-alias" aria-hidden="true"></div>

## I.2. Travaux connexes

<div id="21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>
<div id="i21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>

### I.2.1 Notation et outils de réflexion

Lee (2022) soutient que l’invention de notations peut être plus importante que l’invention d’outils automatisés supplémentaires, car une notation modifie les pensées qui sont peu coûteuses. Le compte‑rendu d’entretien avec The Gradient est cohérent avec cet essai et ne constitue pas un résultat empirique indépendant. Iverson (1980), conférence du prix Turing, est l’énoncé classique en informatique : la notation est un outil de pensée, et l’exécutabilité fait partie du test. Engelbart (1962) situe l’intelligence dans un système humain‑plus‑artefact, et non dans un cerveau nu. Kay (1972) spécifie un médium dynamique personnel. Les ouvrages de Victor, « Media for Thinking the Unthinkable » et « Inventing on Principle », soutiennent que les créateurs ont besoin de représentations dont les conséquences sont visibles pendant que l’idée se forme encore. Matuschak et Nielsen, « How can we develop transformative tools for thought? », documentent l’adoption et les modes d’échec institutionnels de tels outils.

Ce document utilise cette lignée pour une inférence limitée. Si une notation est exécutable, certains échecs deviennent des données ordinaires plutôt que des accidents non représentés. Un motif de refus typé en est une instance. Cela ne soutient pas l’affirmation forte de Sapir‑Whorf selon laquelle la langue détermine la pensée. L’affirmation forte est rejetée dans la Section I.5. L’affirmation faible, qui est celle d’Iverson, est qu’une notation exécutable modifie le coût des opérations et la représentabilité des erreurs.

Chollet (2019) définit l’intelligence comme l’efficacité d’acquisition de compétences et fonde cette définition sur la théorie de l’information algorithmique. Cette définition porte sur l’apprentissage de nouvelles compétences, et non sur le commit.

<div id="22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>
<div id="i22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### I.2.2 Information, longueur de description et coût physique

Shannon (1948) définit l'entropie et la capacité de canal. Shannon (1959) définit la distorsion de taux : la quantité de description requise pour une fidélité donnée. Kolmogorov (1965) définit la longueur de description par la taille du programme. Solomonoff (1964) définit l'inférence inductive par un mélange sur les programmes. Chaitin (1977) développe la complexité de taille de programme. Cover et Thomas (2006) constitue la colonne vertébrale du manuel. Jaynes (1957) utilise l'entropie maximale comme règle pour les distributions sous contraintes. Brillouin (1956) relie l'information à la néguentropie physique dans la ligne du démon de Maxwell.

L'entraînement par cross-entropie d'un modèle de langage est un objectif information‑théorique sur une distribution de données. La conférence de Sutskever en 2023 au Simons Institute, qui est une conférence et non un article, discute de l'apprentissage non supervisé comme compression. Ce fait ne fournit pas de certificat de Kolmogorov pour une chaîne particulière, et il ne fournit pas de bit de validation. La compression statistique d'une distribution d'entraînement n'est pas le même objet qu'un ensemble d'autorisation d'exécution sous une contrainte de plante.

Landauer (1961) démontre une borne inférieure : l'effacement logiquement irréversible dissipe au moins `kT ln 2` par bit dans le modèle idéal. Bennett (1973) montre que le calcul logiquement réversible peut éviter ce coût d'effacement à la limite. Horowitz (2014) rapporte une énergie CMOS pratique à l'échelle du picojoule pour les opérations et le déplacement de mémoire, bien au‑dessus de la borne de Landauer, et considère l'énergie plutôt que le nombre de transistors comme contrainte. Mead (1990) représente l'argument neuromorphique pour l'efficacité analogique. Sandberg (2016) avertit qu'une puissance cérébrale proche de 20 watt ne borne pas l'énergie d'un système ingénieré entraîné de zéro. Un préprint de partitionnement cortical (arXiv:2102.06273) avertit davantage contre le traitement de toute cette puissance biologique comme une puissance de calcul comparable. Cet article utilise Landauer et Horowitz comme bornes et tables pratiques. Il ne prétend pas qu'aucun modèle de la référence fonctionne près de `kT ln 2`.

<div id="23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-and-hardware-fit" class="anchor-alias" aria-hidden="true"></div>

### I.2.3 Échelle et adéquation matérielle

Hestness et al. (2017), Kaplan et al. (2020) et Hoffmann et al. (2022) documentent l’escalade empirique de la perte en apprentissage profond. Amodei et Hernandez (2018), un article de blog OpenAI, décrivent la croissance rapide du calcul d’entraînement pour des résultats de référence. La page est un essai de fournisseur. Cet article ne dépend pas d’un temps de doublement spécifique provenant de celui‑ci. Sutton (2019) soutient que les méthodes générales qui utilisent le calcul ont surpassé les systèmes qui codent le contenu du savoir humain comme des caractéristiques fixes. L’essai n’est pas un argument contre chaque contrainte. Un prédicat de validation est une contrainte sur l’action, pas une caractéristique d’échecs construite à la main. Hooker (2021) explique pourquoi les alternatives échouent lorsque la base installée de puces et de bibliothèques favorise la multiplication matricielle dense.

Cet article classe par joules pour une complétion correcte et sépare le coût de la proposition de l’autorisation. Un prix n’est pas un terme dans aucun des deux.

<div id="24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>
<div id="i24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>

### I.2.4 Réseaux `LUT6`, recherche ternaire et logique différentiable

Umuroglu et al. (2020) cartographient les réseaux à faible précision et parcimonieux vers des tables de vérité FPGA (LogicNets). Petersen et al. (2022) entraînent des réseaux de portes logiques avec des relâchements différentiables (DiffLogic). Bacellar et al. (2024) entraînent des réseaux sans poids de LUT (réseaux neuronaux sans poids différentiables). Ma et al. (2024) étudient les modèles de langage à poids ternaires (BitNet b1.58). Wei et al. (2024) implémentent la multiplication matricielle à faible précision par recherche dans des tables sur CPU (T-MAC). La ligne TeLLMe (arXiv:2504.16266) est une conception de multiplication matricielle ternaire de LUT destinée à l’exécution sur FPGA. Ces systèmes montrent que les tables et les portes constituent un véritable substrat de calcul. Ils n’ajoutent pas, dans les articles cités, de veto énergie port-Hamiltonien ni d’enveloppe de validation typée à un exécuteur d’outil.

La référence utilise DiffLogic comme une table d’autorisation mince sur des caractéristiques factices, et TLMM comme un chemin de proposition. Il s’agit d’un travail différent de l’utilisation d’un réseau logique comme classificateur complet, ce qui constitue l’évaluation habituelle de DiffLogic (benchmarks de vision, grands nombres de portes). La section I.6 consigne l’écart de capacité.

<div id="25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>
<div id="i25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>

### I.2.5 Certificats, boucliers et surveillance à l'exécution

Ames et al. (2019) passent en revue les fonctions barrière de contrôle comme certificats d’invariance d’ensemble, généralement appliquées par un filtre ou un programme quadratique. Alshiekh et al. (2018 preprint arXiv:1708.08611) introduisent des boucliers qui remplacent les actions dangereuses par des actions sûres, de façon minimale lorsque cela est possible. Dawson, Gao et Fan (2022) passent en revue les certificats de Lyapunov et de barrière appris ainsi que les modes d’échec liés à la considération d’un réseau de neurones comme certificat sans vérification. Manek et Kolter (2020) apprennent des dynamiques stables avec une structure de Lyapunov. Greydanus, Dzamba et Yosinski (2019) apprennent des réseaux de neurones hamiltoniens. Roth et al. (2025) étudient les réseaux de neurones port-Hamiltoniens stables. Yu, Zikelic et Henzinger (2024) réparent les certificats neuronaux à l’aide de moniteurs d’exécution. Leung et Paré (arXiv:2512.24493) donnent des garanties de sécurité bayésiennes pour les systèmes port-Hamiltoniens avec des fonctions d’énergie apprises. Leur énergie est l’Hamiltonien physique de la plante. Ce n’est pas l’énergie de calcul. Le chemin sûr de cette référence utilise l’énergie dans ce même sens physique. Les joules de calcul constituent un compte séparé (Section I.3.4). Sanchez et al. (2018) passent en revue les taxonomies de vérification à l’exécution.

**The gate is a Simplex.** L’architecture Simplex de Sha exécute un contrôleur haute performance non vérifié à côté d’un contrôleur de sécurité vérifié, et un module de décision transfère le contrôle au contrôleur de sécurité avant que la plante ne quitte la région dont il peut se remettre (Sha 2001). « A proposal may not authorize itself » est cette règle, transposée des boucles de contrôle aux appels d’outils et aux actionneurs. L’assurance à l’exécution est son nom dans l’avionique et la robotique. Trois résultats plus anciens complètent le reste de la forme. Saltzer et Schroeder ont nommé la médiation complète : chaque accès est vérifié par rapport à l’autorité, à chaque fois (1975). Un moniteur de référence est le mécanisme qui effectue la vérification. Le commit en deux phases de Gray sépare la préparation de la validation, de sorte qu’aucun participant ne valide seul (1978). Le code porteur de preuve de Necula expédie une preuve que l’hôte vérifie avant l’exécution du code non fiable (1997). L’enregistrement de validation ici est un moniteur de référence devant les effets irréversibles, avec un commutateur Simplex vers le refus et un certificat que l’hôte vérifie, comme dans le code porteur de preuve. Ce que la référence ajoute à cette lignée est un conjonctif et un registre : un prédicat énergétique à l’intérieur du certificat, et les joules sur le même enregistrement que la décision.

La référence ne remplace pas cette mathématique. Le chemin sûr est un test conservateur de point fixe d’une identité énergétique connue sur un pendule, `V = (1/2)(g theta^2 + omega^2)` avec `Vdot = omega * u`. La CBF utilisée dans le concours de démonstration est une inégalité d’ensemble énergétique sur le même `V`, pas une affirmation d’avoir résolu le programme quadratique d’Ames sur un manipulateur. La structure de Lyapunov apprise sur un cart-pole est un second exemple, rapporté dans la Section I.4, et ne constitue pas un théorème de région d’attraction pour des plantes arbitraires.

<div id="26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>
<div id="i26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>

### I.2.6 Modèles du monde, décisions typées et transport d'outils

Ha et Schmidhuber (2018) et Hafner et al. (DreamerV3, arXiv:2301.04104) montrent que les modèles appris peuvent proposer des actions à partir de trajectoires imaginées. Les essais JEPA de LeCun (blog de recherche Meta) plaident en faveur de modèles mondiaux prédictifs. LeCun et al. (2006) constitue le tutoriel antérieur sur l’apprentissage basé sur l’énergie. L’erreur de prédiction n’est pas identiquement nulle dans ces systèmes. Un prédicteur peut se placer en amont d’une porte. Il ne peut pas remplacer la porte à moins que ses prédictions soient parfaites et que le modèle de la plante soit la plante elle‑même. Cet article ne concurrence pas ces systèmes sur les bancs d’essai de prédiction.

Les modèles System One renvoient une réponse typée et une probabilité pour chaque option autorisée en un seul passage avant, sans texte libre. TypeSafe AI a nommé la catégorie avec son modèle hébergé Jev (15 septembre 2026). Des modèles ouverts ont suivi, parmi eux Laya de Convai Innovations, un encodeur avec têtes de décision. Ils réduisent le coût de génération lorsque l’ensemble d’options est typé et connu. L’annonce du Protocol de Contexte de Modèle d’Anthropic précise la découverte et le transport pour les outils. Le transport délivre un appel. Il n’évalue pas `Vdot`. Dans l’adaptateur MCP de la référence, les outils irréversibles nécessitent un certificat avant que l’exécuteur ne s’exécute. Il s’agit d’une affirmation d’ingénierie concernant cet adaptateur, testée par la démonstration dans la Section I.4, et non d’une affirmation concernant chaque serveur MCP en production.

<div id="27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>
<div id="i27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>

### I.2.7 Ce qu'apporte la composition

Les boucliers refusent les actions dangereuses mais ne sont pas, dans les articles cités, exportés comme l’enregistrement de validation à quatre champs de la référence avec un compte analytique en joules. DiffLogic et les réseaux LUT calculent des fonctions. Ils ne constituent pas, dans ces articles, un veto devant un proposeur distinct et un exécuteur d’outil. Les filtres de barrière sensibles à l’énergie sont continus. Le bit d’autorisation de la référence est un tableau. L’affirmation compositionnelle est le câblage : autorisation LUT et prédicat énergétique et barrière optionnelle, enregistrés avec une raison typée, appliqués avant un effet irréversible, avec l’énergie analytique maintenue distincte de la puissance de la carte. La section I.4 indique quelles parties de ce câblage ont été exécutées.

<div id="28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-2025-to-2026" class="anchor-alias" aria-hidden="true"></div>

### I.2.8 Pairs certifier / valider (2025 à 2026)

Plusieurs systèmes récents imposent une décision avant l’exécution d’un outil irréversible.

Shi et al., **Progent** (arXiv:[2504.11703](https://arxiv.org/abs/2504.11703)), vérifient chaque appel d’outil par rapport à des règles symboliques de moindre privilège et utilisent un solveur SMT de sorte que le privilège ne puisse se restreindre qu’avec approbation (confinement monotone). Chen, Kang et Li, **ShieldAgent** (ICML 2025; [proceedings.mlr.press/v267/chen25ae.html](https://proceedings.mlr.press/v267/chen25ae.html)), imposent des circuits de politique de sécurité vérifiables sur les trajectoires d’action de l’agent avant le blindage. Yu, Žikelić et Henzinger (AAAI 2025; [doi:10.1609/aaai.v39i25.34840](https://doi.org/10.1609/aaai.v39i25.34840)) réparent les certificats neuronaux via une surveillance en temps réel. Une ligne compagnon vérifie les certificats de barrière de contrôle ReLU en ligne sur une région de prévision (arXiv:[2507.11987](https://arxiv.org/abs/2507.11987)).

**Ce que la Partie I ajoute.** Ces pairs sont des objets de politique, de blindage ou de réparation de certificat. Cette référence fournit une enveloppe de validation à quatre champs (`proposal` → `certificate` → `commit|refuse` → receipt) avec un bit LUT conjonctif autorisé et un prédicat d’énergie, des raisons de refus typées, et des joules analytiques maintenus distincts de la puissance de la carte. Le transport (MCP) reste une proposition. Les joules de la carte n’existent que pour les exécutions KV260 de la Section I.3.7, au niveau de la carte.

<div id="i29-runtime-enforcement" class="anchor-alias" aria-hidden="true"></div>

### I.2.9 Application à l'exécution

Le portail est un automate de sécurité. Schneider a montré que les moniteurs d’exécution imposent exactement les propriétés de sûreté [Schneider 2000](https://doi.org/10.1145/353323.353382), et Ligatti, Bauer et Walker ont étendu le moniteur aux automates d’édition qui suppriment ou insèrent des actions [Ligatti et al. 2005](https://doi.org/10.1007/s10207-004-0046-8). Falcone a indiqué quand il faut appliquer plutôt que vérifier [Falcone 2010](https://doi.org/10.1007/978-3-642-16612-9_9), et Bauer, Leucker et Schallhart ont proposé des verdicts d’exécution à trois valeurs [Bauer et al. 2011](https://doi.org/10.1145/2000799.2000800), qui correspondent à autoriser, refuser et `settle_refuse`. Ce que cet article ajoute à cette lignée, c’est le prédicat d’énergie dans le certificat et le reçu. Les gardes d’agents de 2024 à 2026 ont la même forme, une vérification entre un appel d’outil proposé et son effet : GuardAgent [arXiv:2406.09187](https://arxiv.org/abs/2406.09187) et AgentSpec [arXiv:2503.18666](https://arxiv.org/abs/2503.18666). PolicyGuide soutient qu’une vérification de chaque action ne peut pas orienter un flux de travail à plusieurs étapes [arXiv:2608.19861](https://arxiv.org/abs/2608.19861); c’est pourquoi la Partie II place l’arrêt sur le prédicat de tâche $C(z)$ plutôt que sur l’acte unique. Un travail irréversible à plusieurs étapes nécessite également une compensation, que les sagas fournissent [Garcia-Molina and Salem 1987](https://doi.org/10.1145/38713.38742), et « une proposition ne peut pas s’autoriser elle‑même » est le principe de moniteur de référence que les noyaux de capacité tels que seL4 appliquent par preuve [Klein et al. 2009](https://doi.org/10.1145/1629575.1629596). L’analyse 0-false-allow de la Section I.4 est un test sur une grille, pas une preuve ; la Section I.6 indique cette limite, et elle s’applique à chaque résumé du résultat.

<div id="i210-reference-points-for-the-board-figure" class="anchor-alias" aria-hidden="true"></div>

### I.2.10 Points de référence pour la figure de la carte

On s’attend à ce qu’une implémentation FPGA d’une fonction consomme plus d’énergie qu’un ASIC ; Kuon et Rose ont mesuré l’écart de puissance dynamique [Kuon and Rose 2007](https://doi.org/10.1109/TCAD.2006.884574), et Horowitz fournit l’énergie CMOS par opération qui encadre de telles valeurs [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323). Une estimation de puissance fournie par le vendeur pour le même flux binaire, en plus de la lecture SOM, fait partie du protocole PL-rail.

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>
<div id="i3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## I.3. Définitions et méthodes

<div id="31-objects" class="anchor-alias" aria-hidden="true"></div>
<div id="i31-objects" class="anchor-alias" aria-hidden="true"></div>

### I.3.1 Objets

Fixez un état `x` et une action candidate `u` dans un ensemble `U`. Une proposition est un tuple

```text
Proposal = (u, x, hints)
```

Les `hints` peuvent inclure des quantités d’énergie analytiques. Une proposition n’a aucune interprétation comme permission.

Un certificat est un tuple

```text
Certificate = (lut_allow, energy_ok, cbf_ok, reasons, metrics)
```

`lut_allow` et `energy_ok` sont des booléens. `cbf_ok` est un booléen lorsque le mode de composition sélectionné l’exige, et est absent sinon. `reasons` est une liste de raisons de refus. `metrics` comprend le compte d’énergie analytique et le drapeau de résultat du tableau.

Les modes de composition dans le README du schéma sont :

```text
lut_and_energy        : commit <=> lut_allow AND energy_ok
lut_and_safe          : commit <=> lut_allow AND safe_energy_ok
lut_and_safe_and_cbf  : commit <=> lut_allow AND safe_energy_ok AND cbf_ok
```

Des ablations `energy_only` et `lut_only` existent afin qu’une comparaison puisse supprimer un conjonctif. Elles ne sont pas les valeurs par défaut pour les outils irréversibles.

Une décision de validation est

```text
if commit then plant_action = u else plant_action = 0
```

avec le certificat joint. L’exécuteur pour un outil irréversible n’est appelé que dans la première branche.

Enregistrement de travail. Le fichier `artifacts/schemas/wca.commit.v1/examples/commit_decision_refuse.json` stocke un refus dans lequel `lut_allow` est vrai et `energy_ok` est faux. Le code de raison est `energy_veto`. La chaîne de détail du point fixe est `Vdot_q=1461 > eps_q=13`. `plant_action` est `[0.0]`. L’enregistrement fixe le drapeau de résultat du tableau à faux. Un conjonctif vrai ne valide pas.

<div id="32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>
<div id="i32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>

### I.3.2 Plantes et oracles

La plante principale est un pendule. Les quantités de référence continues utilisées par la vérification Safe sont `g = 9.81`, `epsilon = 0.05`, `V = (1/2)(g theta^2 + omega^2)`, et `Vdot = omega * u`. `energy_ok` dans l’oracle continu signifie `Vdot <= epsilon`.

La vérification discrète héritée est une approximation en point fixe Q8.8, correspondance bit à bit avec le module Verilog `wca_ph_energy.v` en simulation. La vérification Safe (`SafeFixedPointPHCertificate`) utilise Q16.16 et un résidu entier exact. Le prédicat rapporté est

```text
energy_ok <=> 4*omega_q*u_q + 2*(abs(omega_q)+abs(u_q)) + 1
              <= floor(4*epsilon*S^2)
```

avec l’argument d’arrondi donné dans `artifacts/RESULTS.md` : sous arrondi au plus proche avec une erreur au plus d’une demi‑bit de poids faible, `Vdot` est borné par `(prod + (1/2) abs + 1/4) / S^2`. L’objectif de conception est unilatéral. Si le prédicat Safe autorise, l’oracle continu autorise. Le contraire n’est pas requis. Les refus supplémentaires sont un coût mesuré, pas une contradiction de la direction de sécurité.

Une seconde plante, chariot‑pôle, est utilisée uniquement dans la simulation apprise‑Lyapunov. L’état est `[x, xdot, theta, thetadot]`, avec `g = 9.81`, masse du chariot 1.0, masse du pôle 0.1, longueur 0.5. `V` est une forme quadratique `xi^T P xi / 2` avec `P` définie positive par une construction de Cholesky plus un multiple de l’identité. L’ajustement est une descente de gradient stochastique sur une charnière de `Vdot + alpha V` sous une politique linéaire, graine 42, 400 itérations, lot 32, `alpha = 0.15`, comme enregistré dans `RESULTS.md`. La porte continue est `Vdot <= 0.05`. La règle discrète Safe ajoute une marge de Lipschitz fois une demi‑bit de poids faible. Il s’agit d’une simulation d’une seule forme quadratique ajustée sur une boîte. Ce n’est pas une preuve pour d’autres plantes.

<div id="33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>
<div id="i33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>

### I.3.3 Chemin d'autorisation `LUT` et de proposition

LUT autorisé dans les épisodes rapportés est une exportation DiffLogic avec le masque `21887` sur quatre caractéristiques : theta absolu, omega absolu, `u` absolu, et un bit d’énergie, sauf indication contraire dans une section. TLMM est une recherche de table ternaire groupée utilisée comme proposeur. L’iso-correctitude signifie un accord avec un produit matriciel ternaire naïf dans une tolérance absolue de 1e-12, ce que `RESULTS.md` consigne comme mesuré en logiciel. Le comportement d’échelle est ce que `wca-tlmm-scale` écrit sous un budget analytique avant déclaré. Le budget par défaut discuté dans les résultats est de 2e-10 joule par avant, analytique, pas électrique.

<div id="34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>
<div id="i34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>

### I.3.4 Modèle énergétique analytique

`RESULTS.md` sépare deux faits. Les comptes d’opérations sont exacts dans l’OpCounter. Les joules sont les comptes multipliés par les constantes :

| Constante | Valeur (joule) | Rôle |
|----------|----------------|------|
| `E_LUT_READ` | 1e-12 | lecture LUT |
| `E_BRAM_WORD` | 1e-11 | mot BRAM |
| `E_BITMASK_OP` | 5e-14 | opération de masque de bits |
| `E_ADD` | 5e-13 | addition |
| `E_PACK` | 2e-13 | empaquetage |
| `E_COMMIT_BASE` | 2e-11 | surcharge de validation |
| `E_REFUSE_OVERHEAD` | 5e-12 | surcharge de refus |

`J = sum count_op * E_op`. Ces constantes sont des substituts d’ingénierie, pas des mesures. Les compteurs de structure tels que les hits BRAM partagés sont rapportés et ne sont pas facturés à moins qu’ils ne modifient une lecture comptée. Modifier une constante redimensionne chaque joule analytique de façon synchronisée. C’est pourquoi les nombres ne peuvent pas être comparés aux jetons par joule d’un fournisseur, à l’énergie MLPerf Tiny, ou à une mesure de rail. Ils peuvent être comparés entre modes au sein du même modèle.

L’utilité dans les tables internes est le nombre de validations. Le nombre de validations n’est pas une récompense de tâche. Une politique qui valide davantage peut obtenir une utilité plus élevée par joule tout en violant l’oracle énergétique. La section I.4 ne considère donc pas l’utilité par joule comme une métrique de sécurité.

<div id="35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>
<div id="i35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>

### I.3.5 Adaptateur d'outil

`wca-mcp-gate` classe les outils. Les outils en lecture seule peuvent s'exécuter sans un enregistrement de commit. Les outils inconnus sont traités comme irréversibles. Les outils irréversibles nécessitent un certificat sous le mode compose configuré, par défaut `lut_and_safe_and_cbf` dans `artifacts/mcp_gate_demo.json`. En cas de refus, `executed` est false et `executor_calls` est 0. L'exécuteur de démonregistre les appels et n'effectue aucune entrée ou sortie hôte. La chaîne de méthode dans le fichier de démon est `rust_mcp_commit_gate_v1`.

<div id="36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>
<div id="i36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>

### I.3.6 Simulation de Verilog

Le dépôt génère du Verilog et des images mémoire pour le LUT d’autorisation et la porte de validation (`artifacts/fpga/`). `wca-rtl-verify` et Icarus Verilog vérifient le comportement bit‑exact de ces modèles par rapport à l’oracle logiciel. Icarus exécute une simulation. Il ne place pas, ne route pas et ne mesure pas une puce. Vivado ne signale des entrées que pour les exécutions KV260 de la Section I.3.7, en tant qu’utilisation et clôture de timing. Les estimations de puissance de Vivado ne constituent pas des résultats.

<div id="37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>
<div id="i37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>

### I.3.7 Instrument navigateur et cartes

Le chemin de complétude pour la réplication comporte trois étapes. Les étapes A et B existent. L’étape C possède deux cartes : une pour l’accord de décision et une pour les joules.

Étape A, présente. Les binaires Rust dans `wca-commit` exécutent l’épisode, la vérification Safe, la démonstration d’outil et le compte analytique des joules. Icarus simule le Verilog émis sur une station de travail.

Étape B, livrée. Le cœur de décision pur (proposition en, certificat sorti, étape de plante, mise à jour analytique des joules) se compile en `wasm32` (`crates/wca-fpga-sim`). Une page statique à https://research.openie.dev/living/fpga-sim/ charge le module. WebGPU conserve les mots LUT et un tampon de trace de `(step, lut_allow, energy_ok, cbf_ok, decision)` pour l’affichage. Les horodatages WebGPU ne sont pas des joules. Sur seed-1 (16 étapes, theta 1.5, omega 3.0) l’épisode WASM rapporte 1 engagé, 15 refusés, joule analytique 8.6795e-10, correspondant à l’étape A. Le module WASM est une émulation des mêmes fonctions que la crate Rust exécute. Ce n’est pas un modèle cycle‑précis d’un Artix‑7, ni un modèle de puissance d’activité de commutation, et ce n’est pas un substitut à Icarus sur le Verilog. L’étape B ne revendique pas de DUT Alchitry Pt V2.

Étape C, carte programmée, énergie non mesurée. Un Alchitry Pt V2 a été détecté et chargé (SRAM) avec un flux de bits de porte d’engagement WCA en boucle fermée : dynamique de plante pendule seed-1 sur le tissu, proposition TLMM, autorisation LUT, résidu port‑Hamiltonien Safe Q16.16, et fonction barrière de contrôle d’énergie de type Ames (CBF). L’engagement du tissu est `lut_allow ∧ energy_ok ∧ cbf_ok`. L’UART à 115200 8N1 a concordé avec le composite logiciel d’or sur autoriser/refuser/engager (1 engagement, 15 refus, seul engagement à l’étape 6). Sur cet épisode en boucle fermée seed-1, le conjonctif CBF n’a pas modifié la trace autoriser/refuser par rapport au LUT et au PH Safe seuls (l’engagement PH unique a u=0, donc la vérification Lie du CBF tient). **Boucle fermée** ici signifie que l’état de la plante évolue à partir des engagements et refus de porte sur le tissu ; ce n’est pas une ROM de stimulus diffusée d’état plante/proposition. Le Pt V2 n’a **aucun compteur de joules embarqué**. Aucun compteur USB en ligne ou shunt n’a été connecté. Les estimations de puissance Vivado / post‑PAR ne sont pas des lectures du DUT. La page produit SparkFun indique le FPGA XC7A100T-2FGG84I et répertorie 101 440 cellules logiques, 240 tranches DSP48E1, 4 860 Kb de RAM bloc, et 256 MB de DDR3L (https://www.sparkfun.com/alchitry-pt-v2.html) ; ces données restent des spécifications du vendeur. Méthodes de mesure du constructeur : [/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy)

Stage C, carte mesurée. Un AMD Kria KV260 possède un moniteur d’alimentation INA260 intégré (`ina260_u14`). Trois séries ont été exécutées le 30 septembre 2026, chacune sous forme d’interleavings A/B/A avec N = 4, stabilisation 15 s et échantillonnage 25 s à environ 4 Hz. La série 1 compare un tissu de graines en exécution libre (439 LUT) au flux de bits de référence de la carte. Elle ne fournit que des watts, sans compte d’opérations, donc aucun joule par opération. La série 2 s’arrête et exécute un flux de bits de graine (975 LUT) à environ 100 MHz sous un compteur d’opérations intégré. La différence est de +0.0098 W (erreur standard 0.0031 W), soit 98,0 pJ par cycle de graine (erreur standard 30,8 pJ). La série 3 s’arrête et exécute le flux de bits de porte : huit voies, chacune la conjonction du LUT d’autorisation, du résidu d’énergie Safe Q16.16 et du résidu de barrière, en 6 370 LUT et 128 tranches DSP, timing fermé à 25 MHz. La différence est de +0.2857 W (erreur standard 0.0032 W). À 2.4999 × 10⁷ cycles de porte par seconde cela représente 11 428 pJ par cycle de porte (erreur standard 129 pJ), soit environ 1,43 nJ par décision de voie. La dérive A2 moins A1 était de +0.0047 W (erreur standard 0.0040 W). Les hachages et journaux du flux de bits se trouvent dans l’artifact `wca-kv260-meter` de la référence.

Ce que le compteur peut et ne peut pas voir. L’INA260 spécifie un décalage maximal de 5 mA et une erreur de gain système maximale de 0,15 %, avec un pas de courant de 1,25 mA (fiche technique TI INA260). Le décalage est commun à A et B sur la même carte et rail, de sorte que la différence arrêt‑vers‑exécution l’annule. L’erreur de gain fait varier la différence d’au plus 0,15 %. Le compteur mesure la puissance de la carte, ainsi la différence inclut l’arbre d’horloge et le routage commutés par l’activation, pas uniquement la logique de porte. La différence de la série 2 est d’environ trois erreurs standards de zéro. Celle de la série 3 est d’environ quatre‑vingt‑dix. Le protocole suivant est fixe : lire le rail cœur (VCCINT) via la télémétrie du régulateur du module ou une unité source‑mesure ; au moins 30 paires A/B interleavées aléatoires ; au moins 10⁹ évaluations de porte par bloc ; température du die enregistrée avec une ligne de base au repos avant chaque bloc ; valeurs brutes et soustraites toutes deux rapportées ; l’estimation de puissance Vivado rapportée à côté de la lecture avec l’écart. La série 3 n’est pas un coût joule d’une plante en boucle fermée, et les constantes analytiques de la Section I.3.4 ne sont pas calibrées par celle‑ci.

La raison scientifique du stade B est la réplication et l’inspection, pas une nouvelle affirmation physique. Un lecteur avec un navigateur exécute le même épisode seed‑1 et lit le même bit d’autorisation et les mêmes codes de raison que la caisse imprime. L’accord avec le stade A constitue le test d’acceptation pour le stade B, et il réussit sur seed 1. L’accord des décisions constitue le test d’acceptation pour le Pt V2, et il réussit sur seed 1. Une lecture du compteur sur une charge de travail déclarée constitue le test d’acceptation pour le KV260, et les séries 2 et 3 le remplissent au niveau de la carte.

<div id="38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>
<div id="i38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>

### I.3.8 Ce qui n'est pas une méthode de cet article

Pas d'étude sur des sujets humains. Aucun affirmation concernant la relativité linguistique au‑delà du rejet dans la Section I.5. Aucun extrapolation de formation‑calcul. Aucun identification de la satiation économique. Aucun optimisation contre le débit de Groq, Etched ou Taalas. Aucun benchmark de modèle du monde.

<div id="4-results" class="anchor-alias" aria-hidden="true"></div>
<div id="i4-results" class="anchor-alias" aria-hidden="true"></div>

## I.4. Résultats

Toutes les quantités de cette section sont simulées dans la référence logicielle, sauf si une phrase cite un article externe. Les joules analytiques utilisent la Section I.3.4. Seul NI-9 est mesuré sur la carte.

<div id="41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>
<div id="i41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>

### I.4.1 Affirmation NI-1. L'enregistrement de validation existe en tant que schéma et type Rust

Les schémas `Proposal`, `Certificate`, `RefuseReason` et `CommitDecision` se trouvent dans `artifacts/schemas/wca.commit.v1/`. Les types Rust se trouvent dans `crates/wca-commit/src/schema.rs`. Les tests de cycle complet sont `cargo test -p wca-commit`. Il s'agit d'un résultat d'existence concernant la référence, version `wca.commit.v1`. Ce n'est pas un théorème d'unicité.

<div id="42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>
<div id="i42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>

### I.4.2 Affirmation NI-2. Épisode de pendule Seed-1

```text
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

Résultat signalé : engagé = 1, refusé = 15, énergie de l’épisode analytique = 8.6795e-10 joule. Les mêmes comptes d’engagés et de refusés ainsi que la même énergie analytique sont rapportés pour `--safe-ph` sur ce germe. `RESULTS.md` indique que le seul engagement correspond à l’étape 6. Note de la chaîne d’outils dans ce fichier : Rust 1.98. Relancer le binaire constitue la reproduction. L’énergie n’est pas une mesure d’une puce.

<div id="43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>
<div id="i43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>

### I.4.3 Affirmation NI-3. Autorisations erronées de la vérification énergétique sûre

`wca-ph-tighten` compare les décisions discrètes à l’oracle continu `Vdot <= epsilon`. Sur une grille de 21³ plus 200 000 échantillons Monte Carlo proches du seuil (209 261 décisions) :

| Chemin | Autorisations fausses | Refus faux | Autorisations les deux | Refus les deux |
|------|-------------|--------------|------------|-------------|
| Legacy Q8.8 | 30836 | 105 | 104711 | 73609 |
| Safe v1 (sur‑approximation Q8.8) | 0 | 42430 | 62386 | 104445 |
| Safe v2 (résidu Q16.16) | 0 | 79 | 104737 | 104445 |

`RESULTS.md` indique également qu’une grille plus dense de 41³ plus 50 000 échantillons Monte Carlo, vérifiée dans `cargo test`, affirme que les autorisations fausses sont égales à 0. Safe v2 réduit les refus faux de 42 430 à 79 par rapport à Safe v1 tout en maintenant les autorisations fausses à 0. Legacy Q8.8 n’est pas sûr selon cette définition : il enregistre 30 836 autorisations fausses. Ces décomptes sont des propriétés du test numérique, pas d’un pendule physique.

<div id="44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>
<div id="i44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>

### I.4.4 Affirmation NI-4. Comparaison de barrière jouet, aucune définition ne domine

`wca-cbf-bakeoff` exécute les graines 0 à 4, 40 pas, pas de temps 0.05, échelle d’action 2.5, démon partagé TLMM et masque DiffLogic `21887`. La barrière du jeu d’énergie utilise `h = 18 - V` et autorise lorsque `h >= 0` et `omega * u <= kappa * h` avec `kappa = 0.05`. Le bouclier discret autorise un pas qui reste à l’intérieur de theta absolu au plus 2 et d’omega absolu au plus 4. La boucle fermée diffère parce que les trajectoires divergent. Le fichier rapporte les moyennes par épisode pour les engagements et les sommes pour les comptes de violations. Lignes sélectionnées :

| Filtre | Engagement | Refus | J analytique | Fausse autorisation vs PH | `h < 0` | `Vdot > epsilon` |
|--------|------------|-------|--------------|---------------------------|---------|------------------|
| `lut_and_safe_ph` | 1 | 38 | 2.153e-09 | 0 | 4 | 0 |
| `cbf_energy_set` | 1 | 38 | 2.056e-09 | 3 | 0 | 3 |
| `shield_discrete` | 18 | 21 | 2.306e-09 | 90 | 38 | 90 |
| `lut_only` | 40 | 0 | 2.544e-09 | 194 | 220 | 194 |

Sur cette plante et cet oracle, `lut_and_safe_ph` n’a aucune violation `Vdot` et quatre événements `h < 0`. La barrière du jeu d’énergie n’a aucun événement `h < 0` et trois violations `Vdot`. Le bouclier s’engage davantage et viole souvent l’oracle d’énergie. `lut_only` correspond à `always_allow` sur les violations dans le tableau rapporté. Un accord hors ligne sur un flux toujours‑autorisé partagé de 200 pas donne 4 désaccords entre `lut_and_safe_ph` et `cbf_energy_set`, et 70 contre le bouclier.

Interprétation dans le test : la passivité et l’invariance d’ensemble sont des prédicats différents. La porte LUT‑et‑énergie n’est pas équivalente à un filtre Ames, et elle ne gagne pas chaque colonne. Une ligne de base de programme quadratique complet sur une plante plus riche n’est pas dans ce tableau. Cette comparaison reste ouverte. Le résultat disponible est le désaccord, qui constitue une preuve contre la fusion des deux certificats en un seul terme.

<div id="45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>
<div id="i45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>

### I.4.5 Affirmation NI-5. Simulation Lyapunov sûre du cart-pole

Dans l’audit décrit à la Section I.3.2 (grille n = 7 plus 20 000 échantillons de frontière à l’intérieur de la boîte de Lipschitz, 26 487 décisions), Safe a appris le Lyapunov par rapport à l’oracle continu `Vdot` qui enregistre fausses autorisations 0, fausses refus 3, autorisations communes 15 925, refus communs 10 559. En boucle fermée, sur cinq graines : `lut_and_safe_lyap` engage 11, refuse 28, J analytique 2.719e-09, et n’enregistre aucune fausse autorisation contre cet oracle. La barrière du niveau‑set sur le même `V` engage 14 et enregistre 15 violations de l’oracle d’énergie. Le bouclier discret engage 29 et enregistre 95. Même schéma que le pendule : le conjonctif Safe suit son propre oracle ; un certificat différent suit un autre oracle ; la permissivité sans l’oracle n’est pas une sécurité.

Il s’agit d’une plante simulée supplémentaire. Elle ne constitue pas la porte d’engagement sur les dynamiques industrielles.

<div id="46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>
<div id="i46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>

### I.4.6 Affirmation NI-6. Démonstration `MCP`

`artifacts/mcp_gate_demo.json` enregistre quatre cas. Le drapeau board-result dans le fichier est false.

| Cas | Classe | Exécuté | Appels de l’exécuteur | Commit |
|------|-------|----------|----------------|--------|
| `read_only_bypass` | lecture‑seule | true | (aucun enregistrement de commit) | absent |
| `irreversible_refuse` | irréversible | false | 0 | false |
| `irreversible_allow` | irréversible | true | 1 | true |
| `shell_exec_gated` | irréversible | true | (gated) | true |

Le cas de refus répertorie `energy_veto` (`vdot` 6.0 contre `eps` 0.05) et `cbf_veto`. L’action de la plante pour ce cas est `[0.0]`. Le cas d’autorisation utilise compose `lut_and_safe_and_cbf` et l’action de la plante `[-0.02]`. La note dans le fichier indique que le refus ne s’exécute jamais. Il s’agit d’une démonstration de l’adaptateur, pas d’une étude de terrain sur les agents d’utilisation d’ordinateurs.

<div id="47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>
<div id="i47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>

### I.4.7 Affirmation NI-7. `TLMM` sous un budget analytique

`RESULTS.md` rapporte une configuration de démon 2 par 4, groupe 2 proche de 4,24e-11 joule analytique, sous le budget avant. Les plus grandes configurations qui restent sous le budget avant de 2e-10 s’arrêtent à 64 paramètres. Les largeurs 8 par 16 et supérieures dépassent ce budget même après l’optimiseur. L’iso-correctitude par rapport à l’arithmétique ternaire naïve est une comparaison logicielle à une tolérance de 1e-12. Ces affirmations ne disent pas que le design correspond au débit TeLLMe ou à l’énergie de la carte.

<div id="48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>
<div id="i48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>

### I.4.8 Affirmation NI-8. Autorisation DiffLogic versus un enseignant énergétique, jouet uniquement

Sur le benchmark à porte multi‑graine dure dans `RESULTS.md`, après calibration du seuil et étiquettes plus denses, DiffLogic atteint le même niveau que l’enseignant énergétique sur le taux de refus de 50,0 ± 15,9 pour cent, la précision au seuil de 0,890 ± 0,067, et le rappel de 0,802 ± 0,076. Une référence à masque de bits refuse davantage (71,0 ± 14,9 pour cent) et rappelle moins (0,454 ± 0,266). Avant calibration, le taux de refus de DiffLogic était de 57,5 ± 14,1 pour cent avec un rappel de 0,724 ± 0,163. La correspondance porte sur ce dispositif d’étiquetage factice. Il ne s’agit pas d’un résultat ImageNet ou d’une suite de contrôle. L’utilité interne par joule augmente pour la porte calibrée (3,570e9 contre 3,212e9 avant) selon le modèle analytique. Comme le stipule la Section I.3.4, ce ratio utilise le nombre de commits comme utilité.

<div id="49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>
<div id="i49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>

### I.4.9 Affirmation NI-9. Joules au niveau de la carte du tissu de portes

| Échelon | Structure | Horloge | Différence (W) | Opération | Joules par opération | Étiquette |
|---|---|---|---|---|---|---|
| 1 | Seed freerun vs board baseline | n/a | −0.8212 (SE 0.0024) | none | none | `measured_j`, watts only |
| 2 | Seed, halt vs run | about 100 MHz | +0.0098 (SE 0.0031) | one seed cycle | 98.0 pJ (SE 30.8) | `measured_j`, INA260, SOM rail (`VCC_SOM`) |
| 3 | Gate, 8 lanes, halt vs run | 25 MHz | +0.2857 (SE 0.0032) | one gate cycle, 8 decisions | 11,428 pJ (SE 129) | `measured_j`, INA260, SOM rail (`VCC_SOM`) |

N = 4 passes entrelacés A/B/A par échelon. Le signe négatif de l'échelon 1 indique que le flux de bits seed consomme moins que le flux de bits de référence du tableau. Cela ne signifie pas que le seed est gratuit. La section I.3.7 donne les limites d’une lecture au niveau du tableau.

<div id="410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>
<div id="i410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>

### I.4.10 Sûreté et vivacité

Zero faux autorisations est sécuritaire. Une porte qui refuse tout est également sûre, et inutile. La vivacité est l’autre axe : le faux refuse, et la part des tâches que l’agent filtré accomplit. NI-3 rend compte des deux sur la grille Safe. Safe v2 réduit les faux refus de 42 430 à 79 à zéro faux autorisations. L’épisode seed-1 engage 1 pas de 16, et ce compte seul ne indique pas si la plante a atteint son objectif. Le rapport requis est une frontière par plante : taux d’accomplissement des tâches versus taux de fausses autorisations, un point par mode de composition de NI-4 (`lut_only`, `shield_discrete`, `cbf_energy_set`, `lut_and_safe_ph`), chaque point avec ses graines et sa diffusion. Sur les charges de travail des agents, la même frontière utilise une suite d’attaque pour les fausses autorisations et une suite de tâches bénignes pour l’accomplissement. Une porte est jugée sur la frontière, pas sur un seul axe.

<div id="411-what-the-scan-supports" class="anchor-alias" aria-hidden="true"></div>
<div id="i411-what-the-literature-search-supports" class="anchor-alias" aria-hidden="true"></div>

### I.4.11 Ce que la recherche bibliographique soutient

Une recherche bibliographique en septembre 2026 (Sections I.2.4 à I.2.9) n’a trouvé aucun système publié qui compose un LUT booléen appris, un prédicat énergétique port-Hamiltonien ou de Lyapunov, et une proposition de LUT ternaire comme une seule frontière de validation avec simulation RTL bit‑exacte et un compte analytique du joule. Les voisins les plus proches sont les boucliers, les filtres à barrière sensibles à l’énergie, les réseaux logiques en tant que modèle complet, et les conceptions TLMM sans certificat énergétique. La recherche soutient une déclaration d’écart concernant la littérature qui a été examinée. Elle ne soutient pas une revendication de priorité sur un travail non publié, et elle ne soutient pas une revendication de leadership énergétique.

<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>
<div id="i5-discussion" class="anchor-alias" aria-hidden="true"></div>

## I.5. Discussion

<div id="51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>
<div id="i51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>

### I.5.1 L'échelle ne répond pas à la question de validation

Kaplan, Hoffmann, Hooker et Sutton décrivent comment la perte et la capacité de proposition évoluent à l’échelle. Un proposeur plus grand peut encore émettre une action qui échoue `Vdot <= epsilon`. Placer ce proposeur derrière le certificat utilise l’échelle où les preuves indiquent que l’échelle fonctionne, et utilise le prédicat là où l’échelle est silencieuse. La Leçon amère s’oppose aux caractéristiques humaines figées qui bloquent l’apprentissage. Elle n’implique pas la suppression d’un prédicat de sécurité. Si un résultat futur montre qu’une politique non contrainte satisfait le même test de fausse‑autorisation à un coût analytique inférieur et avec une erreur de tâche égale, la préférence d’ingénierie de NI-3 pour la porte serait affaiblie sur cette installation. La distinction logique entre proposition et permission resterait.

<div id="52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>
<div id="i52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>

### I.5.2 Le langage naturel et `MCP` sont transport et proposition

MCP résout la découverte et la forme d’appel. Le système One résout certaines décisions sans génération libre. Aucun des deux objets n’est `energy_ok`. La démonstration dans NI-6 montre un refus qui n’appelle pas l’exécuteur. Un déploiement en production pourrait contourner l’adaptateur. L’affirmation n’est pas que le protocole rend le contournement impossible. L’affirmation est que l’autorisation doit constituer un enregistrement séparé si les effets irréversibles doivent être audités.

<div id="53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>
<div id="i53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>

### I.5.3 Le déterminisme linguistique fort n'est pas l'affirmation

L'hypothèse forte selon laquelle le langage détermine la pensée n'est pas une prémisse. L'énoncé opérationnel est local. Dans ce schéma, un commit sans certificat de passage n'est pas un enregistrement réussi. Une chaîne de confiance non typée peut être stockée à côté d'un drapeau de succès et laisser la raison non énoncée. L'énumération élimine cette ambiguïté particulière. Elle ne décrit pas la cognition humaine.

<div id="54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>
<div id="i54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>

### I.5.4 Le formalisme peut être coûteux ; ce prédicat est petit

Exiger une preuve de l’ensemble de l’agent à chaque étape dominerait le budget. La référence formalise une frontière. Les appels en lecture seule contournent cette contrainte. Le résidu Safe est une inégalité à point fixe, pas une requête SMT générale. L’énergie d’épisode analytique de NI-2 est de 8.6795e-10 joule sous les constantes indiquées. Elle ne peut pas être exprimée comme une fraction de l’énergie du tableau d’un modèle génératif, car cette comparaison n’a pas été mesurée. Une répartition entre les joules de proposition et les joules de porte sur une charge de travail d’agent réel n’apparaît pas dans les résultats. Tant que cela ne sera pas le cas, l’objection de coût est résolue pour cette porte factice et demeure ouverte pour les certificats de grande taille.

<div id="55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>
<div id="i55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>

### I.5.5 Un modèle erroné avec un feu vert est un véritable échec

Si `V` n'est pas l'énergie de l'installation, `energy_ok` peut être vrai alors que l'installation n'est pas sûre. La mitigation présente dans la référence est un jumeau continu sur les jouets, un code de raison séparé, et un refus de traiter une probabilité comme un certificat. La mitigation absente est la stabilité d'entrée-à-état perturbée, une région d'attraction vérifiée, ou un budget de crédibilité bayésien du type étudié par Leung et Paré. NI-4 est la preuve que deux certificats respectables sont en désaccord. Ce désaccord est une raison de nommer le prédicat, pas une raison de faire confiance à l'un ou l'autre en dehors de son test.

<div id="56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>

### I.5.6 La théorie des certificats antérieure n'est pas reproduite ici

Ames, Alshiekh, Dawson et les articles sur la surveillance en temps réel définissent déjà les filtres et les moniteurs. L'ajout de NI-1 est l'enregistrement du produit et la composition avec une exportation de LUT et un exécuteur d'outil dans une seule référence. Lorsque la barrière factice l'emporte sur l'invariance d'ensemble, l'article le indique (NI-4, NI-5). La composition est `cbf_ok` comme autre conjonctif lorsque ce prédicat est celui requis. Ce n'est pas une affirmation selon laquelle la LUT calcule le programme quadratique d'Ames.

<div id="57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>
<div id="i57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>

### I.5.7 Prédicteurs et puces d'inférence spécialisées

Les modèles du monde réduisent une partie de l’erreur de prédiction et laissent un résidu. Les dispositifs d’inférence spécialisés modifient le coût des propositions. Les chiffres de débit des fournisseurs sont des rapports de fournisseurs jusqu’à ce qu’un compteur indépendant les reproduise. Le rôle de la porte est la branche irréversible. Si l’unique interface d’un dispositif est un flux de jetons, l’enregistrement de validation doit encore résider quelque part avant que les actionneurs ou les outils irréversibles ne s’exécutent.

<div id="58-analytical-joules-are-not-a-costume-for-watts" class="anchor-alias" aria-hidden="true"></div>
<div id="i58-analytical-joules-are-not-watts" class="anchor-alias" aria-hidden="true"></div>

### I.5.8 Les joules analytiques ne sont pas des watts

Les constantes de la Section I.3.4 sont des nombres d’ingénierie. Elles rendent les décomptes comparables au sein du dépôt. Elles ne sont pas calibrées sur un rail Artix-7. Les présenter comme des watts de carte serait un rapport de mesure erroné. Le rapport correct est celui fourni : les décomptes d’opérations sont calculés ; les joules analytiques sont modélisés ; les joules de carte proviennent uniquement du compteur KV260 et sont classés séparément. L’étape B de la Section I.3.7 rend le même modèle inspectable dans un navigateur à l’adresse https://research.openie.dev/living/fpga-sim/. Cela ne modifie pas la classe de mesure. Les échelons KV260 le font, pour le tissu qu’ils ont exécuté.

<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>
<div id="i6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## I.6. Limites et menaces à la validité

Validité interne. Seed-1 est une condition initiale. La grille Safe est grande mais reste une boîte choisie et un epsilon choisi. Les échantillons Monte Carlo près du seuil sollicitent la frontière que les concepteurs ont choisi de solliciter. Un epsilon différent ou une identité de plante différente invalide la revendication numérique jusqu’à une nouvelle exécution. Le CBF dans le bake‑off est une inégalité d’ensemble d’énergie implémentée dans le même crate, et non un solveur codé indépendamment à partir d’une implémentation de référence Ames. Le désaccord est informatif. Un classement absolu par rapport au code de la littérature n’est pas établi.

Validité de construction. Le nombre de commits en tant qu’utilité ne mesure pas le succès de la tâche. Le faux « allow » est défini par rapport à un oracle nommé. Un système peut être sûr vis‑à‑vis de l’oracle et sûr lors de la vérification (zéro faux « allow » contre `Vdot <= epsilon`) et échouer néanmoins à être sûr au niveau de l’ensemble (`h >= 0`), comme le montre NI‑4. Les lecteurs qui traitent « safe » comme un seul mot interpréteront mal le tableau.

Validité externe. Les deux plantes sont des jouets. Il n’y a ni manipulateur, ni quadrotor, ni essai humain‑dans‑la‑boucle. La démonstration MCP n’appelle pas de réseau. Le Verilog est simulé. L’instrument du navigateur est fourni comme simulation de l’étape B. L’Alchitry Pt V2 concorde sur les décisions et n’est pas mesuré. La lecture KV260 est au niveau de la carte et en boucle ouverte. Les comptes de cellules logiques du fournisseur ne sont pas confirmés ici.

Validité de mesure. Les constantes analytiques peuvent être modifiées à n’importe quelle échelle. Les comparaisons aux tables picojoule de Horowitz, à la limite de Landauer, ou aux jetons du fournisseur par joule ne sont pas valides avec ces constantes. Les échelons KV260 sont un compteur au niveau de la carte sous une charge de travail déclarée. Une lecture du rail central pendant l’épisode en boucle fermée est la mesure manquante. La puissance de l’outil post‑place‑and‑route constituerait une troisième classe, toujours pas un compteur, et n’est pas rapportée comme résultat.

Rapport statistique. Lorsque `RESULTS.md` fournit une moyenne et un écart type, cet article les copie. Il n’ajoute pas d’intervalles de confiance qui n’ont pas été calculés. La couverture multi‑seed comprend cinq graines dans les bake‑offs et les écarts rapportés du benchmark de la porte dure. Ce n’est pas une affirmation basée sur un grand échantillon.

Non revendiqué. Les éléments suivants ne sont pas des résultats : leadership en joules de silicium ; fonctionnement près de la limite de Landauer ; puissance équivalente à celle du cerveau ; une victoire sur System One en latence ; une victoire sur les benchmarks de modèle du monde ; un déterminisme linguistique fort ; identification de « intelligence » avec le nombre de commits.

Falsificateurs. NI‑2 est faux si la commande indiquée sur la révision du crate indiquée n’imprime pas ces comptes. NI‑3 est faux si le test Safe v2 signale un faux « allow » sur la grille indiquée. NI‑6 est faux si le cas de refus dans le fichier de démonstration s’exécute. NI‑1 est faux si le schéma et le runtime divergent. Un émulateur de l’étape B qui diverge de l’étape A sur la graine 1 échoue à son propre test d’acceptation. Un futur compteur qui attribue l’énergie de la carte au nombre analytique sans étude de calibration ne confirme pas le modèle analytique.

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>
<div id="i7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## I.7. Conclusion

Le papier a défini une décision de validation comme un certificat conjonctif sur un bit d’autorisation LUT et un prédicat d’énergie, avec une barrière optionnelle, et a présenté une référence logicielle qui émet la décision avant un effet irréversible. Sur les tests de pendule rapportés, la règle de point fixe Safe n’a généré aucun faux autorisation par rapport à son oracle continu `Vdot <= epsilon` sur l’ensemble de tests indiqué, au prix de 79 refus erronés sur 209 261 décisions. Dans les comparaisons rapportées, cet oracle n’est pas identique à l’invariance d’ensemble. L’énergie d’épisode analytique pour l’exécution seed‑1 est de 8,6795e‑10 joule selon les constantes publiées. Le refus d’outil dans la démonstration MCP n’appelle pas l’exécuteur. Les vérifications Verilog sont des simulations. L’instrument WASM et WebGPU du navigateur est disponible à https://research.openie.dev/living/fpga-sim/ afin que la même décision puisse être inspectée sans carte. Il reste une simulation, pas un résultat DUT. L’Alchitry Pt V2 concorde avec le logiciel sur chaque décision du seed 1 et reste non mesuré. Le KV260 mesure le tissu de porte au niveau de la carte : 11 428 pJ par cycle de porte à huit voies à 25 MHz. La référence est un artefact logiciel mesuré et un tissu mesuré sur carte. Le joule du puce en boucle fermée constitue la prochaine mesure.

<div id="references" class="anchor-alias" aria-hidden="true"></div>
<div id="i-references" class="anchor-alias" aria-hidden="true"></div>

## I. Références

Simon, H. A., and Kadane, J. B. Optimal problem-solving search: all-or-none solutions. Artificial Intelligence 6(3), 235-247, 1975. https://doi.org/10.1016/0004-3702(75)90002-8

Alshiekh, M., Bloem, R., Ehlers, R., Konighofer, B., Niekum, S., and Topcu, U. Safe reinforcement learning via shielding. arXiv:1708.08611.

Ames, A. D., Coogan, S., Egerstedt, M., Notomista, G., Sreenath, K., and Tabuada, P. Control barrier functions: theory and applications. European Control Conference, 2019. https://doi.org/10.23919/ECC.2019.8796030

Amodei, D., and Hernandez, D. AI and compute. OpenAI, 2018. https://openai.com/index/ai-and-compute/

Anthropic. Introducing the Model Context Protocol. https://www.anthropic.com/news/model-context-protocol

Bacellar, A., et al. Differentiable weightless neural networks. arXiv:2410.11112.

Bauer, A., Leucker, M., and Schallhart, C. Runtime verification for LTL and TLTL. ACM Transactions on Software Engineering and Methodology 20(4), 14, 2011. https://doi.org/10.1145/2000799.2000800

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Brillouin, L. Science and Information Theory. Academic Press, 1956.

Chaitin, G. J. Algorithmic information theory. IBM Journal of Research and Development, 1977. https://doi.org/10.1147/rd.214.0350

Chen, Z., Kang, M., and Li, B. ShieldAgent: Shielding Agents via Verifiable Safety Policy Reasoning. ICML 2025 (PMLR v267). arXiv:2503.22738. https://proceedings.mlr.press/v267/chen25ae.html

Chollet, F. On the measure of intelligence. arXiv:1911.01547.

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Dawson, C., Gao, S., and Fan, C. Safe control with learned certificates: a survey of neural Lyapunov, barrier, and contraction methods. arXiv:2202.11762.

Engelbart, D. C. Augmenting human intellect: a conceptual framework. 1962. https://www.dougengelbart.org/pubs/augment-3906-Framework.html

Falcone, Y. You should better enforce than verify. Runtime Verification (RV 2010), Lecture Notes in Computer Science 6418, 89-105. Springer, 2010. https://doi.org/10.1007/978-3-642-16612-9_9

Garcia-Molina, H., and Salem, K. Sagas. Proceedings of ACM SIGMOD 1987, 249-259. https://doi.org/10.1145/38713.38742

Gray, J. Notes on data base operating systems. In Operating Systems: An Advanced Course, Lecture Notes in Computer Science 60, 393-481. Springer, 1978. https://doi.org/10.1007/3-540-08755-9_9

Greydanus, S., Dzamba, M., and Yosinski, J. Hamiltonian neural networks. arXiv:1906.01563.

Ha, D., and Schmidhuber, J. World models. arXiv:1803.10122.

Hafner, D., Pasukonis, J., Ba, J., and Lillicrap, T. Mastering diverse domains through world models. arXiv:2301.04104.

Henzinger, T. A., Kueffner, K., and Yu, E. Formal verification of neural certificates done dynamically. arXiv:2507.11987. https://arxiv.org/abs/2507.11987

Hestness, J., et al. Deep learning scaling is predictable, empirically. arXiv:1712.00409.

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Hooker, S. The hardware lottery. arXiv:2009.06489. Communications of the ACM, 2021. https://doi.org/10.1145/3467017

Horowitz, M. Computing's energy problem (and what we can do about it). IEEE International Solid-State Circuits Conference, 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Iverson, K. E. Notation as a tool of thought. Communications of the ACM, 1980. https://dl.acm.org/doi/10.1145/358896.358899

Jaynes, E. T. Information theory and statistical mechanics. Physical Review 106, 620, 1957. https://doi.org/10.1103/PhysRev.106.620

Kang, S., Yu, T., and Hwang, S. J. PolicyGuide: from guarding one action to guiding the whole workflow for policy-compliant LLM agents. arXiv:2608.19861. https://arxiv.org/abs/2608.19861

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Kay, A. A personal computer for children of all ages. 1972. https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf

Klein, G., et al. seL4: formal verification of an OS kernel. Proceedings of SOSP 2009, 207-220. https://doi.org/10.1145/1629575.1629596

Kolmogorov, A. N. Three approaches to the quantitative definition of information. 1965. English: International Journal of Computer Mathematics, 1968. https://doi.org/10.1080/00207166808803030

Kuon, I., and Rose, J. Measuring the gap between FPGAs and ASICs. IEEE Transactions on Computer-Aided Design 26(2), 203-215, 2007. https://doi.org/10.1109/TCAD.2006.884574

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

LeCun, Y. Path towards autonomous machine intelligence / JEPA discussion. Meta AI blog. https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/

LeCun, Y., Chopra, S., Hadsell, R., Ranzato, M., and Huang, F. J. A tutorial on energy-based learning. 2006. http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf

Lee, L. Notational intelligence. 2022. https://thesephist.com/posts/notation/

Leung, C. H., and Paré, P. E. Bayesian safety guarantees for port-Hamiltonian systems with learned energy functions. arXiv:2512.24493.

Levy, W. B., and Calvert, V. G. Cerebral cortical communication overshadows computational energy-use, but these combine to predict synapse number. arXiv:2102.06273.

Ligatti, J., Bauer, L., and Walker, D. Edit automata: enforcement mechanisms for run-time security policies. International Journal of Information Security 4, 2-16, 2005. https://doi.org/10.1007/s10207-004-0046-8

Ma, S., et al. The era of 1-bit LLMs: all large language models are in 1.58 bits. arXiv:2402.17764.

Manek, G., and Kolter, J. Z. Learning stable deep dynamics models. arXiv:2001.06116.

Matuschak, A., and Nielsen, M. How can we develop transformative tools for thought? https://numinous.productions/ttft/

Mead, C. Neuromorphic electronic systems. Proceedings of the IEEE, 1990. https://doi.org/10.1109/5.58356

Necula, G. C. Proof-carrying code. Proceedings of the 24th ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL '97), 106-119, 1997. https://doi.org/10.1145/263699.263712

Petersen, F., et al. Deep differentiable logic gate networks. arXiv:2210.08277.

Qiao, Y., Chen, Z., Zhang, Y., Wang, Y., et al. TeLLMe: an energy-efficient ternary LLM accelerator for prefilling and decoding on edge FPGAs. arXiv:2504.16266.

Roth, F., et al. Stable port-Hamiltonian neural networks. arXiv:2502.02480.

Saltzer, J. H., and Schroeder, M. D. The protection of information in computer systems. Proceedings of the IEEE 63(9), 1278-1308, 1975. https://doi.org/10.1109/PROC.1975.9939

Sanchez, C., et al. A survey of challenges for runtime verification from advanced application domains. arXiv:1811.06740.

Sandberg, A. Energetics of the brain and AI. arXiv:1602.04019.

Schneider, F. B. Enforceable security policies. ACM Transactions on Information and System Security 3(1), 30-50, 2000. https://doi.org/10.1145/353323.353382

Sha, L. Using simplicity to control complexity. IEEE Software 18(4), 20-28, 2001. https://doi.org/10.1109/MS.2001.936213

Shannon, C. E. A mathematical theory of communication. Bell System Technical Journal, 1948. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Shi, T., He, J., Wang, Z., et al. Progent: Securing AI Agents with Privilege Control. arXiv:2504.11703. https://arxiv.org/abs/2504.11703

Solomonoff, R. J. A formal theory of inductive inference, parts I and II. Information and Control, 1964.

SparkFun. Alchitry Pt V2 product page. https://www.sparkfun.com/alchitry-pt-v2.html

Sutskever, I. An observation on generalization. Simons Institute talk, 2023. https://www.youtube.com/watch?v=AKMuA_TVz3A

Sutton, R. The bitter lesson. 13 March 2019. http://www.incompleteideas.net/IncIdeas/BitterLesson.html

Texas Instruments. INA260 precision digital current and power monitor, data sheet. https://www.ti.com/lit/ds/symlink/ina260.pdf

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Umuroglu, Y., et al. LogicNets. arXiv:2004.03021.

Victor, B. Inventing on principle. 2012. https://www.youtube.com/watch?v=PUv66718DII

Victor, B. Media for thinking the unthinkable. https://worrydream.com/MediaForThinkingTheUnthinkable/

Wang, H., Poskitt, C. M., and Sun, J. AgentSpec: customizable runtime enforcement for safe and reliable LLM agents. arXiv:2503.18666. https://arxiv.org/abs/2503.18666

Wei, J., et al. T-MAC. arXiv:2407.00088.

Xiang, Z., Zheng, L., Li, Y., Hong, J., et al. GuardAgent: safeguard LLM agents by a guard agent via knowledge-enabled reasoning. arXiv:2406.09187. https://arxiv.org/abs/2406.09187

Yu, E., Žikelić, Đ., and Henzinger, T. A. Neural control and certificate repair via runtime monitoring. AAAI 2025. https://doi.org/10.1609/aaai.v39i25.34840 (arXiv:2412.12996).

Local measurement record: `artifacts/RESULTS.md` in the `wca-lut-edge` software reference. KV260 meter record: `artifacts/stage-c/wca-kv260-meter/` (protocol, claim status, A/B/A logs and summaries). Schema examples: `artifacts/schemas/wca.commit.v1/examples/`. Demo: `artifacts/mcp_gate_demo.json`.

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## I. Annexe A. Reproductibilité

Chemin de la station de travail utilisé pour générer les journaux cités : l’arbre `wca-lut-edge`, Rust 1.98 tel qu’enregistré dans `RESULTS.md`. Commandes quotidiennes :

```text
cargo test -p wca-commit
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1 --safe-ph
cargo run --release --bin wca-ph-tighten -- --grid 21 --out artifacts/ph_tighten_report.json
cargo run --release --bin wca-cbf-bakeoff -- --out artifacts/cbf_bakeoff_report.json
cargo run --release --bin wca-lyap-plant -- --out artifacts/lyap_plant_report.json
cargo run --release --bin wca-mcp-gate -- --demo
cargo run --release --bin wca-tlmm-scale -- --out artifacts/tlmm_scale_report.json
```

Icarus Verilog était en version 12.0 dans la note d’environnement de `RESULTS.md`. Les vérifications RTL sont des simulations. Ne pas interpréter les joules analytiques comme puissance de la carte.

Le drapeau board-result est vrai uniquement pour les échelons 1 à 3 du KV260 Stage C (Section I.3.7), au niveau de la carte. Tous les autres résultats de cet article sont des simulations ou des analyses.

<div id="appendix-b-browser-fpga-emulator-architecture-to-build" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-b-browser-fpga-emulator-architecture" class="anchor-alias" aria-hidden="true"></div>

## I. Annexe B. Émulateur FPGA navigateur : architecture

Cette annexe décrit l'architecture de l'émulateur Stage B, qui s'exécute à l'adresse https://research.openie.dev/living/fpga-sim/. Les nombres d'accord Seed-1 ci‑dessous proviennent de l'exécution WASM contre le golden Stage A.

Modules.

1. `decision_core`. Fonctions pures déjà représentées par le certificat Rust, l'étape de la plante et l'accumulateur de joules. Aucun système de fichiers et aucun thread requis. Cible `wasm32-unknown-unknown`.
2. `lut_image`. La même image mémoire que le chemin Verilog charge (`artifacts/fpga/wca_allow_lut.mem` et successeurs). La copie du navigateur doit correspondre par hachage au fichier utilisé pour la vérification Icarus.
3. `trace`. Schéma fixe : indice d'étape, état, `u`, `lut_allow`, `energy_ok`, `cbf_ok`, codes de raison, incrément analytique de joule, action de la plante. Noms de champs identiques à `wca.commit.v1` afin qu'un vidage puisse être comparé au JSON de la crate.
4. `webgpu_view`. Appareil, file d’attente et tampon de stockage pour le LUT et la trace. Un shader dessine les autorisations et les refus. Un second dispatch peut mapper le résidu Safe sur une grille. Les tampons sont destinés à l’inspection. Ils ne constituent pas un modèle de puissance.
5. `workstation_oracle`. Icarus reste l’oracle RTL. Le navigateur ne le remplace pas. Un désaccord entre le WASM et le binaire Rust entraîne l’échec de la construction. Un désaccord entre le WASM et Icarus sur l’image LUT partagée entraîne également l’échec de la construction. Aucune comparaison ne mentionne les watts.

Tests d’acceptation. Le test Seed-1 réussit (Section I.3.7). Les autres sont les vérifications spécifiées pour le module.

- Seed-1, 16 étapes, theta initial 1.5, omega 3.0 : engagé 1, refusé 15, joule analytique 8.6795e-10, correspondant à NI-2.
- Fumée de grille Safe : autorisation fausse 0 sur un sous‑ensemble publié du test de décision 209,261, correspondant à la direction NI-3.
- Vecteur de refus MCP : nombre d’appels à l’exécuteur 0, correspondant à NI-6.
- Un test unitaire où la lecture du tampon WebGPU est égale à la trace WASM. Si la lecture n’est pas disponible, la page doit indiquer que le chemin GPU n’a pas confirmé la trace, et la trace CPU WASM reste le résultat.

Suivi physique pour les **joules** de la carte. Le Stage C a déjà programmé une porte de validation en boucle fermée sur l’Alchitry Pt V2 avec accord de décision UART ; la carte ne possède toujours aucun compteur de joules embarqué. Un compteur de puissance USB en ligne ou un shunt plus oscilloscope sur le rail 5 V, sur une charge de travail déclarée, serait nécessaire pour obtenir un joule mesuré sur la carte. Les estimations Vivado / post‑PAR ne constituent pas ce compteur. Les chiffres de cellules logiques et de mémoire du fournisseur restent ceux du fournisseur. Voir [/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy).

Hors de portée pour l’émulateur : formation DiffLogic dans le navigateur et estimation de la puissance dynamique Artix‑7 à partir d’un shader.

<div id="part-ii" class="anchor-alias" aria-hidden="true"></div>
<div id="mixture-of-limits-navigation-law-for-computer-intelligence" class="anchor-alias" aria-hidden="true"></div>
<div id="part-ii-the-cascade-mixture-of-limits" class="anchor-alias" aria-hidden="true"></div>

## Part II. La cascade (Mixture of Limits)

<div id="mol-abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="ii1-the-rule" class="anchor-alias" aria-hidden="true"></div>

## II.1. La règle

Une tâche est définie par un prédicat de complétude $C(z) \in \{0, 1\}$ sur son état $z$. Un **engrenage** est un mécanisme qui peut clôturer la tâche : Recherche (lecture d’une valeur stockée et vérifiée), Formule (évaluation d’une forme close), Solveur (exécution d’une recherche, d’un optimiseur ou obtention d’un certificat), ou Modèle (exécution d’un générateur appris). L’engrenage $i$ possède une probabilité de passage $p_i$, la probabilité qu’il atteigne $C(z) = 1$ sur la classe de tâche, et une énergie attendue $c_i$ en joules (J).

Le **plancher** d’une tâche est la plus petite énergie attendue à laquelle une certaine politique sur les engrenages atteint $C(z) = 1$ avec une probabilité d’échec au plus $\delta$. Il équivaut à $J^*$ de la Section 0.2. Le **plateau** est la région de dépense au‑delà du plancher : une fois $C(z) = 1$, aucun calcul supplémentaire ne peut augmenter $C$, de sorte que des joules additionnels n’apportent rien à l’objectif indiqué.

**Mélange de Limites** est la règle : essayer les engrenages dans un ordre qui minimise l’énergie attendue jusqu’à la première clôture, s’arrêter au premier engrenage qui clôture $C(z)$, et refuser avec un reçu lorsque l’engrenage suivant dépasserait le budget ou ne pourrait pas changer la décision. Recherche → Formule → Solveur → Modèle est l’ordre standard. Il est optimal uniquement sous la condition dérivée dans la Section II.2. Chaque clôture passe par l’enregistrement de la Partie I : proposer, certifier, valider ou refuser, reçu.

**Où se situe le modèle.** Modèle en dernier est un ordre d’essai, pas un verdict sur ce que les modèles peuvent faire. Snell et al. (2024) ont montré qu’un planning optimal en calcul de temps d’inférence dépasse le meilleur‑sur‑N de plus de 4 fois en efficacité, et que sur certains problèmes le calcul de temps d’inférence peut remplacer un modèle plus grand. Ce résultat concerne le planning à l’intérieur de l’engrenage Modèle, qui est tarifé en joules comme tout autre engrenage. L’engrenage Modèle s’ouvre chaque fois que les engrenages moins chers ne peuvent pas clôturer $C(z)$, et il s’ouvre en premier lorsque ceux‑ci passent trop rarement pour couvrir leurs échecs.

Figure 2 représente le plancher et le plateau pour une tâche.

![Diagram of verified progress against spend for one task. Progress rises in steps as the cascade escalates from Lookup to Formula to Solver; the Solver closes the task, marking the floor. Past the floor the Model stage adds spend with no further verified progress, the plateau where value of information is zero.](/figures/gates/mol-plateau.svg)

*Figure 2. Mélange de Limites sur une tâche. Diagramme, pas une mesure. Une [PNG copy](/figures/gates/mol-plateau.png) est fournie.*

**Mélange de Limites n’est pas Mélange d’Experts.** Le routage Mélange‑d’Experts (MoE) sélectionne des paramètres à l’intérieur d’un seul modèle génératif (Shazeer et al., 2017; Fedus et al., 2022). Le Mélange de Limites choisit si et où dépenser parmi les engrenages, et un modèle MoE peut servir d’engrenage Modèle.

| | MoE | Mélange de Limites |
|---|---|---|
| Lieu de la décision | À l’intérieur d’un modèle | Parmi les engrenages, avant tout exécution de modèle |
| Objet choisi | Quels paramètres s’exécutent | Quel engrenage clôture, ou refus |
| Succès | Vraisemblance du token suivant | $C(z) = 1$, un engagement certifié, et un reçu |
| Refus | Pas un résultat natif | Un résultat typé avec un reçu |

<div id="ii2-expected-energy-of-a-cascade-and-the-optimal-order" class="anchor-alias" aria-hidden="true"></div>

## II.2. Énergie attendue d'une cascade et ordre optimal

**Deux engrenages.** Soit une petite engrenage L avec une probabilité de passage $q_L$ et une énergie $c_L$ précédant une grosse engrenage H qui passe toujours, avec une énergie $c_H$. Essayer L en premier coûte $c_L + (1 - q_L)\,c_H$ en moyenne. Essayer H en premier coûte $c_H$. Ainsi L en premier est moins cher si et seulement si

$$
c_L + (1 - q_L)\,c_H < c_H \iff c_L < q_L\, c_H .
$$

Par exemple, une recherche coûtant $c_L = 10^{-9}$ J qui passe sur $q_L = 0.3$ des tâches devant un appel de modèle coûtant $c_H = 10$ J économise $q_L c_H - c_L \approx 3$ J par tâche en moyenne. Si $q_L$ tombe en dessous de $c_L / c_H = 10^{-10}$, l’ordre s’inverse.

**De nombreuses engrenages.** Pour $n$ engrenages essayés en séquence jusqu’au premier passage, avec des issues indépendantes, l’énergie attendue de l’ordre $\sigma$ est

$$
\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j<k} \bigl(1 - p_{\sigma(j)}\bigr).
$$

Échanger deux engrenages adjacents $a$ puis $b$ modifie cette somme d’un facteur commun aux deux termes fois $(c_a + (1-p_a)c_b) - (c_b + (1-p_b)c_a) = c_a p_b - c_b p_a$. Ainsi $a$ doit précéder $b$ si et seulement si $p_a / c_a > p_b / c_b$, et l’ordre optimal trie les engrenages par décroissance de $p_i / c_i$ (Simon et Kadane, 1975). Le plus bon d’abord est optimal exactement lorsque les engrenages moins chers ont également la plus haute probabilité de passage par joule. Lorsque cela échoue, la cascade commence à une engrenage plus lourde. Sous un budget contraignant, les joules des tentatives légères échouées restent dépensés, de sorte qu’un sélecteur qui estime $p_i / c_i$ par tâche peut fermer des tâches qu’un ordre fixe ne peut pas.

**Plancher physique.** Toute engrenage qui efface $n$ bits de façon irréversible à la température $T$ dissipe au moins

$$
E_{\text{Landauer}}(n, T) = n\, k_B T \ln 2, \qquad k_B = 1.380649 \times 10^{-23}\ \text{J/K},
$$

ce qui correspond à $2.87 \times 10^{-21}$ J par bit à 300 K (Landauer, 1961 ; Bennett, 1973, pour la limite réversible). Les opérations CMOS mesurées coûtent environ 0,9 pJ pour une addition en virgule flottante 32 bits à 45 nm et environ 1 à 2 nJ pour un accès DRAM (Horowitz, 2014, texte de l’article ; les diapositives plénières donnent 1,3 à 2,6 nJ pour un accès 64 bits), huit à douze ordres de grandeur au-dessus de ce plancher. Le chiffre souvent cité de 640 pJ par lecture DRAM 32 bits ne figure ni dans cet article ni dans ses diapositives et n’est pas utilisé ici. La valeur de Landauer sur un reçu est donc une borne inférieure étiquetée, jamais une mesure.

**Modèle de coût du catalogue.** Avant qu’une engrenage ne s’exécute, le logiciel la référence comme

$$
E_{\text{est}}(x) = \theta(D)\,\mu(S, V),
$$

où $\theta(D)$ (sans dimension) varie avec la classe de difficulté $D$ de l’action $x$ et $\mu(S, V)$ (J) est une énergie catalogue pour le primitive $S$ sur la vue matérielle $V$. Les deux sont des constantes catalogue, de sorte que $E_{\text{est}}$ est une estimation utilisée pour ordonner les engrenages. Elle n’est pas dérivée de la physique, et elle n’est jamais rapportée comme une mesure. Le classement parmi les systèmes qui ferment la tâche utilise les joules mesurés (Section 0.2).

<div id="ii3-stopping-conditions" class="anchor-alias" aria-hidden="true"></div>

## II.3. Conditions d'arrêt

**Valeur de l'information.** Soit $B$ le gain d’une décision, $x$ l’état d’information actuel, $y$ une observation ou un calcul supplémentaire, $c(y)$ son énergie, et $\lambda$ le taux de conversion entre gain et joules. La valeur nette est

$$
\Delta(x, y) = \mathbb{E}[B \mid x, y] - \mathbb{E}[B \mid x] - \lambda\, c(y)
$$

(Howard, 1966; Russell and Wefald, 1991). La règle refuse l’escalade lorsque $\Delta \le 0$. Une fois $C(z) = 1$, les deux premiers termes sont égaux pour toute $y$ supplémentaire sur la tâche, ainsi $\Delta = -\lambda c(y) < 0$ et l’arrêt s’ensuit.

**Couverture grammaticale.** Soit $G$ l’ensemble des dérivations vérifiées disponibles pour Lookup, Formula et Solver. Une requête $q$ est couverte lorsqu’une dérivation $q \vdash_G a$ existe. Lorsque $q$ est couvert, l’engrenage Model n’est pas ouvert, car un engrenage couvert passe avec une probabilité 1 à une énergie inférieure à celle de l’engrenage Model, de sorte que, selon l’inégalité à deux engrenages de la Section II.2, il passe en premier et clôt la tâche. Lorsque $q$ n’est pas couvert et que la politique interdit l’engrenage Model, la règle refuse.

**Refus de stabilisation.** Un engrenage Solver qui recherche une configuration à faible énergie atteint soit un point fixe certifié (commit), soit signale qu’il ne pourra pas se stabiliser dans le cadre de son budget (refuse).

Raisons de refus nommées dans la référence logicielle :

| Raison | Condition |
|---|---|
| `voi` | $\Delta \le 0$ pour chaque prochaine étape disponible |
| `grammar` | Non couvert et l’engrenage Model n’est pas autorisé |
| `energy` | L’estimation du prochain engrenage dépasse le budget restant |
| `efa_certificate` | La vérification du certificat échoue avant le commit |
| `settle_refuse` | Le Solver ne se stabilise pas dans le cadre de son budget |
| `primitive_gap` | Une primitive requise est absente du catalogue |
| `safety` | Une vérification de capacité refuse l’action |

<div id="ii4-provenance-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## II.4. Provenance et reçus

Chaque réponse comporte une classe de relecture indiquant comment elle a été produite : `Deterministic` (Lookup, Formula ou un Solver certifié), `RetrievedCited`, `Composed` ou `ModelGenerated`. Le système de types interdit le renforcement d’une classe : `ModelGenerated` ne peut pas être réécrit en `Deterministic`. L’énergie sur un reçu porte l’une des trois étiquettes : **Estimated** (catalogue, figure Landauer ou instruction-fuel), **Unmetered** (aucune lecture), ou **Metered** (un compteur nommé a renvoyé une lecture). La référence logicielle laisse `measured_j` non défini sauf si un compteur renvoie une valeur. Le catalogue des primitives que la référence parcourt, regroupées en familles, est appelé le Periodic Stack dans cet article ; chaque cellule est Present (implémentée) ou Gap (absente).

<div id="ii5-software-reference" class="anchor-alias" aria-hidden="true"></div>

## II.5. Référence logicielle

Le référentiel logiciel `mixture-of-limits` (Apache-2.0 ou MIT) possède un harnais, `cargo run -p mol-cli -- prove`, qui affiche `VERIFIED` pour chaque critère et se termine avec le code 0. La suite de tests de l’espace de travail (`cargo test --workspace`) réussit (P0), et le harnais se termine avec le code 0 (P1). Un critère marqué vérifié signifie qu’une implémentation existe et satisfait la spécification indiquée. Ce n’est pas un théorème, ni une réplication indépendante, ni une mesure d’énergie. Au moment de l’exécution du 2 octobre 2026, le harnais affiche 43 critères `VERIFIED` (cela remplace le compte antérieur d’environ 29) ; le tableau ci‑dessous détaille les critères P2 à P24, et la section II.5.1 à II.5.3 décrit les critères d’écart produit A11 à A14 qui ont été ajoutés par la suite. Les autres critères ne sont pas détaillés dans cet article et se trouvent dans le `PLAN.md` du référentiel logiciel ainsi que dans `product/ACCEPTANCE`.

<div id="6-prove--claim-map" class="anchor-alias" aria-hidden="true"></div>

| Preuve # | Critère | ID de réclamation | Réclamation | Note de portée | Mesure |
|---|---|---|---|---|---|
| Prove # | Critère (PLAN) | ID de la revendication papier | Revendication (une phrase) | Référence logicielle / note de portée | Mesure |
|---|---|---|---|---|---|
| P2 | Fermeture déterministe (double exécution) | `claim.mol.deterministic_close` | Les mêmes requêtes produisent le même commit/refuse + identifiant de limite. | none | Non mesuré |
| P3 | Fermeture formule/recherche sans modèle | `claim.mol.formula_lookup_no_model` | Landauer / conversion d'unité ferme COMMIT lors de la recherche ou de la formule ; le modèle n'a jamais répondu. | none | Non mesuré / Estimé (plancher Landauer sur le reçu) |
| P4 | Refus VoI lorsque `!allow_model` | `claim.mol.voi_refuse` | Demande libre forme → REFUSE `voi`. | none | Non mesuré |
| P5 | Commit de règlement + refus de règlement | `claim.mol.settle_ternary` | Règlement ternaire → COMMIT ; `will not settle` → REFUSE `settle_refuse`. | Stub de règlement référencé logiciel ; pas de VM / FPGA | Non mesuré |
| P6 | Refus de certificat en cas de divergence | `claim.mol.efa_certificate_refuse` | Formule + `diverge` → REFUSE `efa_certificate`. | Certificat intégré | Non mesuré |
| P7 | Capacité défaut-refus mutation | `claim.mol.capability_deny_mutate` | `AutomateGate::default().gate(Mutate)` → Refuser. | none | Non mesuré |
| P8 | Étiquettes de reçu | `claim.mol.receipt_honesty` | Réf logiciel : `measured_j=None`, estimation étiquetée (`EstimateKind`). | Fermeture par défaut Live RAPL/NVML HORS PÉRIMÈTRE | Non mesuré / Estimé |
| P9 | `ModelGenerated` ↛ `Deterministic` | `claim.mol.replay_no_strengthen` | `TypedAnswer::weaken_to` renvoie `ReplayCoercion`. | none | none |
| P10 | Navigation périodique du catalogue en direct de la pile | `claim.mol.stack_live_catalog` | Famille + présent + échelle → COMMIT lors de la recherche ; 258 engrenages de recherche/formule/solveur/navigation en direct. | Calibration μ + matériel silicium HORS PÉRIMÈTRE ; référence logicielle simulations Gap dans la preuve | Non mesuré |
| P11 | `primitive_gap` via sonde de registre | `claim.mol.primitive_gap` | Marqueur Gap `physical_settle` + nom absent → REFUSE `primitive_gap` (pas seulement chaîne). | none | Non mesuré |
| P12 | Catalogue μ / impédance | `claim.mol.mu_catalog` | Les reçus estampillent `mu_source=catalog`, `mu`, `landauer_floor_ratio` ; `E≈θ·μ` (estimation du catalogue, pas RAPL/`measured_j`). | Corpus de calibration μ **calib** HORS PÉRIMÈTRE | Estimé |
| P13 | Relecture de la transcription du reçu | `claim.mol.receipt_replay` | Relecture JSONL/en mémoire reproduit commit/refuse + identifiant de limite ; le modèle n'a jamais répondu. | none | Non mesuré |
| P14 | Z2 récupérer+citer | `claim.mol.z2_retrieve_cite` | Résultat factuel semé → COMMIT `RetrievedCited` + identifiants de citation ; inconnu → REFUSE `claim_unknown` (pas d'invention). | Corpus de semence uniquement intégré | Non mesuré |
| P15 | Z1 composer/synthèse | `claim.mol.z1_compose` | ≥2 revendications citées → COMMIT `Composed` + `synthesis.composed_from` ; manquante → REFUSE `compose_missing` ; jamais lavé comme Deterministic/RetrievedCited seul. | none | Non mesuré |
| P16 | Boucle boîte aux lettres de l'agent | `claim.mol.agent_mailbox` | Objectif/Message/Action → fermer → valider\|refuser + reçu dans la transcription; la démo atteint formule/citer/composer COMMIT et voi/settle_refuse REFUSE; modèle froid; les indicateurs de mesure restent. | aucune | Non mesuré |
| P17 | État bitemporal + mémoire | `claim.mol.bitemporal_memory` | Écrit uniquement sur Mélange de Limites fermer COMMIT; Muter refuser / libre-forme se souvenir → REFUSE; rappeler → `RetrievedCited` + `memory:` citer; inconnu → `memory_unknown`. | aucune | Non mesuré |
| P18 | Routage de tissu + inventaire de référence logicielle | `claim.mol.fabric_soft_ref` | Inventaire hors ligne valide (`source=software_ref`, Cpu toujours); Recherche/Formule→Cpu; Règlement→ThermoSettle\|Cpu; Modèle→Gpu* ou REFUSE `fabric_unavailable`; détecter ≠ joules mesurés. | Présence wgpu en direct optionnelle / non requise pour la preuve | Non mesuré |
| P19 | Shell de bureau sans tête | `claim.mol.desktop_headless` | `ShellSession` demander/fermer → vue du reçu (zone/fabric/limit/estimated_j/`measured_j=None`); registre de joules; VoI refuser; GUI non requis. | GUI egui optionnelle | Non mesuré / Estimé |
| P20 | Étiquettes de compteur OS | `claim.mol.os_meter_honesty` | Fonction désactivée / VM / aucune permission → `measured_j=None`, composants vides, `measure_source=unavailable`; les fixtures tamponnent les sources étiquetées; la fermeture par défaut reste non mesurée. | Probe en direct optionnelle (`energy-meter`) | Non mesuré (par défaut) / Mesuré uniquement lorsque la sonde renvoie |
| P21 | Certification de capsule WASM | `claim.mol.wasm_capsule` | `add.wasm` sous runtime stub; carburant → uniquement estimated_j; FS/net accorder / carburant dépasser / partage-hôte → REFUSE; fermer tamponne la capsule. | Fonction `wasmtime` optionnelle | Non mesuré / Estimé (carburant) |
| P22 | Chemin de session Agent Lane | `claim.mol.agent_lane` | Partitions de voie; `host_invoke` sans provenance refuse; mot-clé confirmer insuffisant; besoin de `GrantReceipt`; autoriser les tampons `AgentLaneReceipt`. | aucune | Non mesuré |
| P23 | Reçu de calcul multi-tissu | `claim.mol.fabric_compute_receipt` | Inventaire de référence logicielle; `ComputeFabric` / `ScheduleDecision` / `ComputeStepReceipt` avec `fabric_id`; tampons en cascade `fabric:route`; Formule CPU COMMIT; le résidu du modèle peut `fabric_unavailable`; `measured_j=None` sur le chemin de référence logicielle. | aucune | Non mesuré |
| P23b | Tissu souple en direct | `claim.mol.fabric_live_soft` | Fonction désactivée reste software_ref; mock/live Metal peut tamponner `gpu_metal`; Formule reste Cpu; Gpu* manquant échoue-fermé; la preuve ne nécessite pas de GPU; `measured_j=None` sauf si Mesuré. | Souple / détection optionnelle | Non mesuré |
| P23c | wgpu / Metal tiny kernel | `claim.mol.kernel_vector_add` | Addition de vecteurs WGSL en salle blanche; stub logiciel hors ligne (même somme de contrôle); Gpu* appose les tampons `kernel:vector_add` + `execution_proof`; le compteur optionnel chevauchant peut apposer le paquet `measured_j` avec `energy_honesty=measured` (nom du champ); aucun joule de paquet rail-sum. | Metal en direct optionnel; dispositif OK pour la preuve | Non mesuré (par défaut) / Mesuré uniquement si le compteur renvoie |
| P24 | Ecosystem e2e certify (one receipt) | `claim.mol.ecosystem_e2e` | Voie → tissu (référence logicielle CPU) → WASM → étiquettes d’énergie (carburant estimé; échantillon de compteur optionnel) → l’hôte invoque uniquement avec `GrantReceipt` → valider\|refuser sur **un** reçu; refus-sans-grant → `grant_receipt_required`. | aucune | Non mesuré / Estimé |

En dehors du harnais : compteurs d'énergie en temps réel (RAPL, NVML) comme fermeture par défaut, détection GPU en temps réel, matériel de certificat sur l'appareil, poids de modèle entraîné et compteurs silicium pour les cellules Gap. Aucun n'est réclamé.

<div id="ii51-phase-1-micro-perception-on-the-arena-a11-a14" class="anchor-alias" aria-hidden="true"></div>

### II.5.1 Micro-perception de phase 1 sur l'arène (A11, A14)

L’arène évalue la cascade sur des tâches typées (décision, clôture de ticket, risque) par rapport à une référence toujours‑modèle et à une petite référence feuille. Les références typées s’exécutent avec `phase1=false`. Avec `phase1=true`, une chaîne de ticket, de risque ou de décision non structurée passe d’abord par le transducteur d’AST de règle en‑arbre (`mol phase1`) avant d’entrer dans la cascade ; les entrées non reconnues sont refusées, de sorte que le transducteur n’est jamais utilisé comme modèle et Model LAST reste en dernier. Dans l’exécution de référence logicielle du 2 octobre 2026 (n = 36, America/New_York), la cascade a correctement clôturé 36 sur 36 et a refusé 5 sur 5 cas de satiation, tandis que la référence toujours‑modèle et la référence feuille ont chacune obtenu 28 sur 36 et 0 sur 5 sur la satiation. L’estimation moyenne des joules était d’environ 2,1e-11 pour la cascade, 5,0e-1 pour la référence toujours‑modèle et 2,5e-4 pour la référence feuille. Il s’agit d’estimations de catalogue ; `measured_j` n’est pas défini, et les chiffres proviennent du tableau publié par la référence elle‑même, et non d’une nouvelle exécution pour cet article.

<div id="ii52-tier-1-os-meters-a13" class="anchor-alias" aria-hidden="true"></div>

### II.5.2 Compteurs OS de niveau 1 (A13)

Une fonctionnalité de construction optionnelle ajoute des sondes au niveau du paquet afin que `measured_j` ne soit rempli qu'à partir d'une lecture réelle : Linux RAPL (delta `energy_uj` de powercap), NVIDIA (`nvidia-smi` puissance multipliée par la fenêtre, ou un delta d'énergie consommée, en tant qu'énergie GPU totale du dispositif) et macOS (watts `PSTR` du SMC multipliés par la fenêtre, sans sudo, le canal du paquet Energy Model n'est pas utilisé et les rails ne sont jamais additionnés). Le harnais s'exécute avec la fonctionnalité désactivée, de sorte que `measured_j` reste non défini dans ce cas. Le critère A13 valide les fixations RAPL, NVML et SMC et interdit l'invention d'une valeur à partir d'un pourcentage d'utilisation. Aucune figure de la Partie II n'est une lecture provenant de ces sondes.

<div id="ii53-primitive-distillation-a12" class="anchor-alias" aria-hidden="true"></div>

### II.5.3 Distillation primitive (A12)

Après un commit certifié Model LAST, `mol distill` ajoute une entrée Lookup ou Formula à un magasin avec une relecture déterministe ; une proposition non certifiée n’est jamais distillée. Un second passage sur le motif distillé ferme alors au niveau Lookup ou Formula sans ouvrir Model LAST (A12). Les reçus conservent `estimated_j` étiqueté comme une estimation.

Reproduire : `cargo run -p mol-cli -- prove` (43 critères incluant A1 à A14), `-- arena`, `-- phase1 "please close ticket as R-OK"`, `-- distill "ticket summary" --gear lookup --store product/fixtures/distill_store.json`. Code : [openIE-dev/mixture-of-limits](https://github.com/openIE-dev/mixture-of-limits).

<div id="ii6-related-work" class="anchor-alias" aria-hidden="true"></div>

## II.6. Travaux connexes

**Cascades et métaraisonnement.** Viola et Jones (2001) ont exécuté une cascade de classificateurs boostés dans laquelle des étapes bon marché rejettent la plupart des entrées. Russell et Wefald (1991) ont évalué chaque calcul par sa valeur attendue pour le réseau de décision de son coût et ont arrêté le processus lorsqu’aucune n’avait une valeur nette positive. Horvitz (1987) a fixé le même compromis pour le raisonnement borné. Les algorithmes « anytime » échangent calcul contre qualité avec un arrêt interruptible (Dean et Boddy, 1988; Zilberstein, 1996). Le chaînage de modèles envoie une entrée à un modèle plus grand uniquement lorsqu’un plus petit est incertain (Varshney et Baral, 2022), et FrugalGPT s’arrête lorsqu’un scoreur appris accepte la réponse (Chen, Zaharia et Zou, 2023). Mixture of Limits diffère sur trois points : les engrenages incluent des mécanismes non neuronaux avant tout modèle ; l’arrêt est le prédicat $C(z)$, pas un score appris ; et le coût est mesuré en joules sur un reçu, pas en dollars ou en latence.

**Dépenser au‑delà de la réponse.** Les modèles de raisonnement dépensent des tokens après leur première réponse correcte sans la modifier (Chen et al., 2024), et une enquête recense les méthodes qui s’arrêtent plus tôt (Sui et al., 2025). Le décodage spéculatif (Leviathan et al., 2023), Mixture‑of‑Depths (Raposo et al., 2024), la quantification (Frantar et al., 2022; Lin et al., 2024) et les caches KV paginés (Kwon et al., 2023) réduisent l’énergie d’un engrenage de Modèle une fois qu’il s’exécute. Ils ne décident pas s’il doit s’exécuter.

**Récupération de formules.** AI Feynman (Udrescu et Tegmark, 2020), SINDy (Brunton et al., 2016) et PySR (Cranmer, 2023) récupèrent des formes fermées à partir de données ; AlphaGeometry (Trinh et al., 2024) et AlphaProof (Hubert et al., 2025) associent un proposeur à un vérificateur symbolique ou Lean. Chaque méthode produit des engrenages Formula ou Solver certifiés qui clôturent les tâches couvertes avec moins d’énergie qu’un générateur.

**Routage entre modèles.** Ces systèmes choisissent quel modèle répond. Aucun n’essaie d’abord un engrenage non neuronal ou ne refuse avec une raison typée.

| Système | Titre | ID | Classe | Ce qu’il route ou accélère | Énergie ou coût tel que rapporté | Différence |
|---|---|---|---|---|---|---|
| **RouteLLM** | *RouteLLM : Apprendre à router les LLMs avec des données de préférence* (arXiv); le titre du venue ICLR 2025 utilise *from Preference Data* | arXiv:[2406.18665](https://arxiv.org/abs/2406.18665) · ICLR 2025 | Routeur de préférence (LLM fort↔faible) | Requête → LLM fort ou faible | Coût / qualité (API \$) ; rapporté par les auteurs | Modèle↔modèle ; pas de plancher Lookup/Formula ; pas de refus de commit typé |
| **PEARL** (routing) | *PEARL : Routage performant et conscient de l'énergie pour les LLMs* | DOI:[10.1016/j.future.2025.108218](https://doi.org/10.1016/j.future.2025.108218) · FGCS 176:108218 | Routeur multi-LLM conscient de l'énergie | Requête → LLM sous plafond énergétique (EMM prédit l'énergie) | Les auteurs rapportent un routage conscient de l'énergie (GPU/infra) | Choisit toujours un modèle ; le Mélange de Limites peut refuser avant tout modèle |
| **GreenServ** | *GreenServ : Routage dynamique conscient du contexte et écoénergétique pour l'inférence LLM multi-modèle* | arXiv:[2601.17551](https://arxiv.org/abs/2601.17551) · ICPE 2026 | Routeur multi-LLM bandit contextuel | Caractéristiques de la requête → LLM ; précision vs **mesure d'énergie GPU** (Zeus) | **Mesuré** (GPU Wh des auteurs via Zeus) sur leur pool de LLM | Routage du pool de modèles ; la cascade du Mélange de Limites est d'abord non-neurale |
| **VoltanaLLM** | *VoltanaLLM : Service LLM désagrégé écoénergétique et conscient des SLO via contrôle adaptatif de fréquence et routage espace d'états* | arXiv:[2509.04827](https://arxiv.org/abs/2509.04827) | Service désagrégé P/D + fréquence + routage espace d'états | Instances de préremplissage/décodage + fréquence GPU sous SLO TTFT/ITL | **Mesuré** (auteurs ; pyNVML sur A100/GH200) jusqu'à ~36,3% d'énergie GPU de bout en bout vs référence fréquence maximale (résultat de service sur le terrain) | Routage **d'instances de la même pile générative** ; le Mélange de Limites peut ne jamais ouvrir le décodage |
| **HCSpec** | *HCSpec : Décodage spéculatif en cascade horizontale à deux niveaux pour une inférence de grand modèle de langage à haute efficacité* | DOI:[10.18653/v1/2026.acl-long.353](https://doi.org/10.18653/v1/2026.acl-long.353) · ACL 2026 | Décodage spéculatif (brouillon↔cible) | Cascade de brouillons spécialisées par position → vérification cible | Accélération de latence (vs EAGLE-3 / AR) | Accélère la génération ; ne refuse pas la génération sur les planchers |
| **CAS-Spec** | *CAS-Spec : Décodage auto-spéculatif adaptatif en cascade pour l'accélération d'inférence sans perte en temps réel des LLMs* | arXiv:[2510.26843](https://arxiv.org/abs/2510.26843) · NeurIPS 2025 | Cascade auto-spéculative (brouillons DSIA) | Étapes de brouillon depuis la cible (sparsité/quant) + DyTC | Accélération de latence ~1,1×-2,3× AR (auteurs) ; tokens sans perte | Hiérarchie de brouillons interne au modèle ≠ planchers du Mélange de Limites |
| **GCD** | *Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning* | arXiv:[2305.13971](https://arxiv.org/abs/2305.13971) · DOI:[10.18653/v1/2023.emnlp-main.674](https://doi.org/10.18653/v1/2023.emnlp-main.674) · EMNLP 2023 | Décodage LLM contraint par la grammaire | Masquer les logits selon la GFC | Non mesuré / métriques de qualité | Contraint **tokens** ; le Mélange de Limites contraint **commit** |

<div id="ii7-baselines-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## II.7. Références de base et falsificateurs

Une réclamation en cascade est testée sur un ensemble de tâches typées comme une frontière de joules par tâche par rapport au taux de clôture. Les bras sont : toujours le grand modèle ; toujours le petit modèle ; un routeur appris (Ong et al., 2024) ; une cascade notée (Chen, Zaharia et Zou, 2023) ; un sélecteur qui estime $p_i / c_i$ par tâche ; et un oracle qui connaît l’équipement suffisant le moins cher pour chaque tâche. L’ordre fixe Recherche → Formule → Solveur → Modèle affirme la frontière uniquement lorsque sa courbe se situe en dessous de chaque bras. L’ordre est falsifié sur une classe de tâches où le $p_i / c_i$ mesuré ne diminue pas le long de celle‑ci, selon la dérivation de la Section II.2. Les réclamations du harnais sont falsifiées si `mol prove` ne quitte pas 0 sur la révision indiquée.

<div id="ii8-limits" class="anchor-alias" aria-hidden="true"></div>

## II.8. Limites

Le harnais est une existence constructive dans le logiciel. Aucune figure de la Partie II n’est une lecture de compteur : les énergies du catalogue et de Landauer sont des estimations, et `measured_j` n’est pas définie sur le chemin du harnais. Le résultat d’ordre optimal suppose des issues d’engrenage indépendantes ; les pannes corrélées modifient l’énergie attendue et nécessitent la somme complète de la Section II.2 avec des probabilités conditionnelles. Les probabilités de passage $p_i$ doivent être estimées par classe de tâche, et l’erreur d’estimation modifie l’ordre. La comparaison de frontière de la Section II.7 n’a pas été exécutée.

<div id="ii-references" class="anchor-alias" aria-hidden="true"></div>

## II. Références

Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development* 17(6):525-532. https://doi.org/10.1147/rd.176.0525

Brunton, S. L., Proctor, J. L., and Kutz, J. N. (2016). Discovering governing equations from data by sparse identification of nonlinear dynamical systems. *PNAS* 113(15):3932-3937. https://doi.org/10.1073/pnas.1517384113

Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. arXiv:2305.05176.

Chen, X., et al. (2024). Do NOT Think That Much for 2+3=? On the Overthinking of o1-Like LLMs. arXiv:2412.21187.

CAS-Spec (2025). Cascade Adaptive Self-Speculative Decoding. NeurIPS. arXiv:2510.26843.

Cranmer, M. (2023). Interpretable Machine Learning for Science with PySR and SymbolicRegression.jl. arXiv:2305.01582.

Dean, T., and Boddy, M. (1988). An analysis of time-dependent planning. AAAI-88, 49-54.

Fedus, W., Zoph, B., and Shazeer, N. (2022). Switch Transformers. *JMLR* 23(120).

Frantar, E., et al. (2022). GPTQ. arXiv:2210.17323.

Geng, S., et al. (2023). Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning. EMNLP. https://doi.org/10.18653/v1/2023.emnlp-main.674

GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. ICPE. arXiv:2601.17551.

HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. ACL. https://doi.org/10.18653/v1/2026.acl-long.353

Horowitz, M. (2014). Computing's energy problem (and what we can do about it). ISSCC. https://doi.org/10.1109/ISSCC.2014.6757323

Horvitz, E. J. (1987). Reasoning about beliefs and actions under computational resource constraints. UAI. arXiv:1304.2759.

Howard, R. A. (1966). Information value theory. *IEEE Transactions on Systems Science and Cybernetics* 2(1):22-26. https://doi.org/10.1109/TSSC.1966.300074

Hubert, T., et al. (2025). Olympiad-level formal mathematical reasoning with reinforcement learning. *Nature*. https://doi.org/10.1038/s41586-025-09833-y

Kwon, W., et al. (2023). Efficient Memory Management for Large Language Model Serving with PagedAttention. arXiv:2309.06180.

Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development* 5(3):183-191. https://doi.org/10.1147/rd.53.0183

Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. ICML.

Lin, J., et al. (2024). AWQ. MLSys. arXiv:2306.00978.

Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. arXiv:2406.18665.

PEARL (2025). Performance and energy aware routing for LLMs. *Future Generation Computer Systems* 176:108218. https://doi.org/10.1016/j.future.2025.108218

Raposo, D., et al. (2024). Mixture-of-Depths. arXiv:2404.02258.

Russell, S., and Wefald, E. (1991). Principles of metareasoning. *Artificial Intelligence* 49:361-395. https://doi.org/10.1016/0004-3702(91)90015-C

Shazeer, N., et al. (2017). Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer. ICLR. arXiv:1701.06538.

Simon, H. A., and Kadane, J. B. (1975). Optimal problem-solving search: all-or-none solutions. *Artificial Intelligence* 6(3):235-247. https://doi.org/10.1016/0004-3702(75)90002-8

Snell, C., Lee, J., Xu, K., and Kumar, A. (2024). Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters. arXiv:2408.03314.

Sui, Y., et al. (2025). Stop Overthinking: A Survey on Efficient Reasoning for Large Language Models. arXiv:2503.16419.

Trinh, T. H., et al. (2024). Solving olympiad geometry without human demonstrations. *Nature* 625:476-482. https://doi.org/10.1038/s41586-023-06747-5

Udrescu, S.-M., and Tegmark, M. (2020). AI Feynman. *Science Advances* 6(16). https://doi.org/10.1126/sciadv.aay2631

Varshney, N., and Baral, C. (2022). Model cascading. EMNLP. https://doi.org/10.18653/v1/2022.emnlp-main.756

Viola, P., and Jones, M. (2001). Rapid object detection using a boosted cascade of simple features. CVPR. https://doi.org/10.1109/CVPR.2001.990517

VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. arXiv:2509.04827.

Zilberstein, S. (1996). Using anytime algorithms in intelligent systems. *AI Magazine* 17(3).

<div id="ii-appendix-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## II. Annexe. Reproductibilité

```bash
cargo test --workspace
cargo run -p mol-cli -- prove   # expect 43 VERIFIED lines (A1 to A14 included), exit 0
cargo run -p mol-cli -- arena   # refresh the arena table from a real run only
```
