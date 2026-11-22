---
title: "L'« IA » lit l'humain : l'encodage en langage humain à la vitesse de la machine et son coût énergétique"
deck: "Travail en cours. Pourquoi une grande part de ce que les machines échangent est écrite pour des humains, ce que cela coûte en octets, en jetons, en temps et en énergie consommée par processus sur Apple Silicon (reported_j, rusage noyau) à travers 34 charges de travail d'analyse syntaxique et de tokenisation, et pourquoi l'énergie mesurée par un wattmètre externe (measured_j) demeure une question ouverte."
lang: "fr"
source: "ai-reads-human"
complete: true
---

<div id="ai-reads-human-human-language-encoding-at-machine-speed-and-the-energy-cost" class="anchor-alias" aria-hidden="true"></div>

*Travaux en cours, révision af57f48, 22 novembre 2026. Observatoire interactif, données, code et registre de lecture : [research.openie.dev/living/ai-reads-human/](/living/ai-reads-human/). Termes partagés : [glossaire](/glossary/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

Les agents logiciels échangent des données dans des formats conçus pour être lus par des humains, comme JSON, YAML, Markdown, XML et CSV. Cette étude nomme le travail supplémentaire que cela engendre, la **taxe d'impédance**, la définit avec ses unités et en mesure trois composantes sur un corpus semé de 20 000 enregistrements : le temps d'analyse, le nombre de jetons pour cinq tokenizers ouverts, et les compteurs `reported_j` à double canal (système d'exploitation et puce) d'Apple M5 Max pour l'ensemble des 34 charges de travail d'analyse et de `tiktoken` (section 5c). Une première tentative non isolée, à l'échelle de la puce entière, sur deux ordinateurs portables occupés, n'a pas permis de séparer l'analyse de la dérive due aux cohabitants en arrière-plan (section 5b). En isolant chaque charge de travail dans un sous-processus de travail dédié, à l'aide de `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` du noyau macOS par processus (`L3`, étiquette `D`), on obtient un écart d'énergie d'analyse de `2 053,8×`, allant de `280,4 nJ/enregistrement` pour le binaire à largeur fixe (`struct.iter_unpack`) à `2 212,1 nJ/enregistrement` pour le JSON de la bibliothèque standard (`7,89×`), `69 922,1 nJ/enregistrement` pour le `libyaml` en C (`249,4×`), et `575 799,3 nJ/enregistrement` pour le YAML en Python pur (`2 053,8×`). Il montre également que la tokenisation en `cl100k_base` d'un JSON compact (`27 679,2 nJ/enregistrement`, soit `98,7×` le binaire à largeur fixe) consomme `12,5×` le `reported_j` de la puce à lui seul par rapport à `json.loads()`. Parallèlement, l'`IOReport` à l'échelle de la puce entière (`L2`, étiquette `A2`) a déclenché le Falsificateur 6 (dérive de la ligne de base au repos avant/après `> 5,0 %`) sur `109` des `170` fenêtres de mesure sur hôte partagé, ce qui confirme pourquoi la soustraction de l'énergie du boîtier (package) non isolée échoue sur les hôtes actifs. Aucune sonde de puissance externe en ligne ni aucun wattmètre n'était connecté (`measured_j = None`, `board_metered = false`), et les joules de préremplissage et de décodage du modèle GPU restent planifiés (M4).

**En clair**

1. Les ordinateurs et les humains utilisent souvent le même format écrit. Ce format est facile à lire pour un humain, mais l'ordinateur doit faire un travail supplémentaire pour le relire.
2. Sur notre corpus de test de 20 000 enregistrements, la lecture d'un binaire à largeur fixe (`struct.iter_unpack`) a coûté `280,4 nJ/enregistrement` selon le `ri_energy_nj` du noyau par processus de l'Apple M5 Max (`reported_j`), contre `2 212 nJ/enregistrement` (`7,89×`) pour le lecteur JSON intégré de Python, `69 922 nJ/enregistrement` (`249,4×`) pour le YAML accéléré en C, et `575 799 nJ/enregistrement` (`2 053,8×`) pour le YAML en Python pur.
3. La tokenisation d'un JSON compact pour un modèle d'IA avec `tiktoken` (`cl100k_base`) a coûté `27 679 nJ/enregistrement` (`1,69×` la tokenisation CSV et `12,5×` l'analyse `json.loads()` elle-même), avant même que le modèle de langage n'effectue la moindre multiplication matricielle. Toutes les valeurs énergétiques de cette page sont des compteurs `reported_j` du noyau et de la puce (`measured_j = None`, `board_metered = false`) ; l'énergie de préremplissage et de décodage du modèle GPU ainsi que les sondes de puissance matérielles externes restent planifiées.

> **Statut : travail en cours, appelé à s'enrichir.** Les sections marquées *Planifié* (notamment les compteurs de préremplissage et de décodage GPU M4, les corpus en langage naturel M6 et les analyseurs C/Rust multilingues M8) ne sont pas achevées. Chaque valeur de cette page est recalculée à partir de fichiers téléchargeables sous `/living/ai-reads-human/`. Les compteurs d'énergie de la puce sont strictement des `reported_j` (`measured_j = None`, `board_metered = false`).

<div id="1-background-formats-written-for-people" class="anchor-alias" aria-hidden="true"></div>

## 1. Contexte : formats rédigés pour les humains

La plupart des données que les agents échangent aujourd’hui circulent dans des formats dont les spécifications placent les personnes avant les machines. Les passages cités ci-dessous ont été lus pour cette page ; le statut de lecture de chaque source (COMPLET, PARTIEL ou INDISPONIBLE) figure dans le [registre de lecture](/living/ai-reads-human/READ_LEDGER.md).

- **TeX** a débuté en 1982 : le fichier source `tex.web` (en-tête, 19 000 premiers octets lus ; PARTIAL) indique que la version 0 a été publiée en septembre 1982 et date les versions ultérieures à partir de 3.0 (mars 1990) inclus.
- **Markdown** a été développé par John Gruber avec l’aide d’Aaron Swartz et publié en 2004 sous forme de description syntaxique et d’un script Perl qui convertit en HTML ; la spécification CommonMark (version 0.31.2, 28 janvier 2024) indique que la description « ne spécifie pas la syntaxe de façon non ambiguë » et énumère les questions qu’elle laisse ouvertes (CommonMark 0.31.2, sections 1.1 et 1.2).
- **CSV** a été documenté en octobre 2005 par la RFC 4180, une RFC *informationnelle* qui stipule « il n’existe aucune spécification formelle » et décrit ce que la plupart des implémentations semblent faire.
- **JSON** est défini par la RFC 8259 (décembre 2017, abrogeant la RFC 7159) comme « un format d’échange de données léger, basé sur du texte, indépendant du langage ». La RFC 7493 (mars 2015, I-JSON) le restreint pour les protocoles.
- **Formes canoniques et binaires** existent également dans le registre des normes : la RFC 8785 (juin 2020) définit un schéma de canonicalisation JSON, et la RFC 8949 (décembre 2020, abrogeant la RFC 7049) définit CBOR, un format de données binaire comportant une section sur l’encodage déterministe (section 4.2) que les protocoles peuvent adopter.
- **YAML** version 1.2.2 (1 octobre 2021) indique ses objectifs de conception « par ordre décroissant de priorité », le plus élevé étant « YAML doit être facilement lisible par les humains » (section 1.1).

![Chronologie des spécifications datées lues pour ce sujet](/living/ai-reads-human/charts/format-timeline.svg)

*Figure 1. Dates imprimées dans les documents listés dans le registre de lecture. Généré par `scripts/make_charts.py`.*

Ces faits ne prétendent pas que les formats lisibles par l’homme soient des erreurs. Ils affirment que la lisibilité pour les personnes était un objectif de conception explicite, et que le coût de leur relecture par une machine n’était pas l’élément à minimiser. Lorsque d’autres travaux atteignent des formes orientées machine (CBOR, JSON canonique, Protocol Buffers, Avro, safetensors, GGUF), cette étude les consigne comme une observation de convergence : plusieurs communautés ont abouti à des encodages fixes ou déterministes pour l’échange machine tout en conservant du texte pour les humains.

<div id="2-the-impedance-tax-defined" class="anchor-alias" aria-hidden="true"></div>

## 2. La taxe d'impédance, définition

Soit un ensemble d'enregistrements R portant une information dont un consommateur machine a besoin. Soit F un format muni d'un encodeur enc_F et d'un décodeur dec_F, et soit M une forme machine canonique : une seule chaîne d'octets valide par valeur.

| Symbole | Signification | Unité |
|---|---|---|
| B_F | taille encodée de R dans le format F | octet |
| N | nombre d'enregistrements | 1 |
| k | un tokeniseur | s. o. |
| T_{F,k} | jetons produits par k sur l'encodage de R | jeton |
| d_{F,k} = B_F / T_{F,k} | octets par jeton | octet/jeton |
| t_parse(F) | temps d'horloge pour décoder R en valeurs en mémoire | s |
| P | puissance moyenne pendant une opération | W = J/s |
| E | énergie d'une opération, E = ∫ P dt, approximativement P_moy · t | J |
| e_prefill | énergie du modèle par jeton d'entrée | J/jeton |

La **taxe d'impédance** de F relativement à M est l'énergie supplémentaire qu'un consommateur dépense parce que l'information lui parvient en F :

Formellement, Z(F) = E_enc(F) + E_parse(F) + E_tok(F,k) + e_prefill · T_{F,k} + E_ctx(F)

Ainsi, τ(F) = Z(F) − Z(M) (en joules) et θ(F) = Z(F) / Z(M) (sans dimension).

E_ctx(F) est le surcoût de décodage qu'entraîne un contexte plus long ; son coefficient dépend du modèle et constitue une cible de mesure (M4 ci-dessous). La section 5c mesure `E_parse(F)` et `E_tok(F,k)` en `reported_j` noyau par processus (`ri_energy_nj`) sur Apple M5 Max.

Trois rapports sans dimension peuvent être mesurés sans aucun compteur d'énergie :

- rapport d'octets β_F = B_F / B_ref
- rapport de jetons κ_{F,k} = T_{F,k} / T_{ref,k}
- rapport de temps d'analyse π_F = t_parse(F) / t_parse(ref)

et ils sont reliés par une identité que respectent les nombres de jetons ci-dessous :

κ_F = β_F · (d_ref / d_F)

de sorte qu'un format peut coûter plus de jetons parce qu'il a plus d'octets, parce que ses octets se découpent en plus de morceaux, ou pour les deux raisons.

![Où la taxe d'impédance est payée : encodage, transport, analyse, tokenisation, lecture par le modèle](/living/ai-reads-human/charts/impedance-pipeline.svg)

*Figure 2. Les termes de Z(F). Sans modèle sur le trajet (machine à machine), seuls l'encodage, le transport et l'analyse s'appliquent. Lorsqu'un modèle lit du texte, la tokenisation et la lecture s'y ajoutent.*

<div id="21-physical-scale-and-what-this-page-does-not-claim" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Échelle physique, et ce que cette page ne prétend pas

La limite thermodynamique minimale pour effacer un bit à la température T est la limite de Landauer, E = k_B T ln 2. Avec k_B = 1.380649e-23 J/K (valeur exacte selon la définition du SI de 2019 ; la valeur a été vérifiée le 18 octobre 2026 par rapport à la page NIST CODATA 2022 pour la constante de Boltzmann) et T = 300 K, on obtient **2.871e-21 J** par bit, valeur recalculée dans `scripts/verify_numbers.py`. Huit bits représentent 2.297e-20 J. Il s'agit d'une borne inférieure pour la logique irréversible, et non d'une estimation du coût de l'analyse syntaxique : les logiciels réels consomment plusieurs ordres de grandeur de plus, en trafic mémoire, en exécution d'instructions et en refroidissement. Cette page n'utilise pas cette limite pour prédire une quelconque valeur.

Les chiffres énergétiques relatifs à l'inférence des modèles proviennent de mesures réalisées par d'autres auteurs sur leur propre matériel. Ils ne constituent qu'un contexte de référence, et non une mesure de notre part :

- Samsi et al., « From Words to Watts: Benchmarking the Energy Costs of Large Language Model Inference » (arXiv:2310.03003), définissent l'énergie par jeton de sortie comme l'énergie totale du GPU divisée par le nombre de jetons de sortie décodés. Ils rapportent environ 3 à 4 J par jeton de sortie pour un modèle LLaMA de 65 milliards de paramètres, avec une longueur de génération maximale de 512, mesuré à l'aide de NVIDIA DCGM sur leur installation MIT SuperCloud (GPU V100 pour les exécutions à 8, 16 et 32 fragments). Cet article ne distingue pas l'énergie de la phase de préremplissage (prefill) de celle de la phase de décodage.
- Luccioni, Jernite et Strubell, « Power Hungry Processing: Watts Driving the Cost of AI Deployment? » (ACM FAccT 2024, DOI 10.1145/3630106.3658542), mesurent l'énergie pour 1 000 inférences par tâche à l'aide de CodeCarbon sur un nœud à 8 GPU A100. Leur tableau 2 rapporte une moyenne de 0.002 kWh pour la classification de texte et de 0.047 kWh pour la génération de texte. Ces valeurs ont été vérifiées par rapport à la version corrigée et définitive de l'ACM, V1.1 (6 novembre 2024), qui donne les mêmes valeurs au tableau 2 et le même dispositif expérimental (8 GPU A100 80 Go sur AWS, CodeCarbon). Il faut citer la V1.1 : l'article indique qu'une version antérieure utilisait 0.012 kWh dans une comparaison. Le reste de l'article n'a été lu qu'en partie.

Un chiffre d'énergie de lecture DRAM par mot (640 pJ par lecture de 32 bits, souvent cité) **n'est pas utilisé sur cette page**. La source qui lui est attribuée, Horowitz (2014), a été consultée : l'article donne environ 1 à 2 nJ par accès DRAM, et les diapositives de la conférence plénière donnent 1.3 à 2.6 nJ par accès de 64 bits ; le chiffre de 640 pJ n'apparaît que dans des diapositives ultérieures qui le citent. La section 9 consigne ce statut.

<div id="3-what-was-measured" class="anchor-alias" aria-hidden="true"></div>

## 3. Ce qui a été mesuré

Les mesures initiales de temps d’analyse syntaxique et de comptage de jetons ont été effectuées sur une machine virtuelle Intel Xeon (8 vCPU, Linux 6.12, Python 3.13.5), qui n’expose aucun compteur d’énergie RAPL (`/sys/class/powercap` est absent), avant les campagnes de mesure énergétique sur Apple M5 Max rapportées dans les sections 5b et 5c. Le corpus est synthétique et amorcé (`scripts/gen_corpus.py`, graine 20261016) : 20 000 enregistrements, chacun comportant un identifiant, un nom de trois mots, un score flottant, un booléen, trois étiquettes et un entier de 31 bits.

![Un enregistrement dans cinq encodages](/living/ai-reads-human/charts/one-record-five-ways.svg)

*Figure 3. Enregistrement 0 en CSV, JSON compact, YAML, XML et une disposition binaire fixe de 23 octets. La disposition binaire stocke chaque mot sous forme d’un indice d’un octet dans une liste partagée de 24 mots, de sorte que sa relecture nécessite cette liste. Les comptages d’octets des formes textuelles incluent le saut de ligne.*

<div id="31-parse-time" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Temps d’analyse syntaxique

![Temps d’analyse syntaxique par enregistrement : binaire fixe 116 ns, JSON stdlib 904 ns, YAML libyaml 85300 ns](/living/ai-reads-human/charts/parse-time-headline.svg)

*Figure 4. Minimum de 9 répétitions sur 20 000 enregistrements sur la base de référence Linux Xeon. Source : `/living/ai-reads-human/data/parse_time.tsv`, colonne `ns_per_record`. Échelle logarithmique.*

| Format et analyseur | ns par enregistrement (Xeon) | rapport au binaire fixe |
|---|---|---|
| Binaire fixe, `struct.iter_unpack` | 116 | 1,0 |
| JSON, bibliothèque standard Python | 904 | 7,8 |
| YAML, PyYAML avec libyaml | 85 300 | 735,3 |

YAML a pris 94,4 fois plus de temps que le JSON de la bibliothèque standard sur les mêmes enregistrements sur l’hôte Xeon (et `22 404 ns` contre `570 ns` = `39,3×` pour le C `libyaml`, ou `161 227 ns` = `282,9×` pour le YAML pur Python, sur Apple M5 Max dans la section 5c). Le tableau complet Xeon de tous les formats et analyseurs essayés figure à la Figure 5.

![Temps d’analyse syntaxique par enregistrement, tous les formats testés](/living/ai-reads-human/charts/parse-time-all.svg)

*Figure 5. Toutes les lignes de `data/parse_time.tsv` sauf la ligne numpy sans copie, qui ne construit aucun objet et n’est pas comparable.*

**Limites de cette mesure.** (a) Les analyseurs n’effectuent pas le même travail : le lecteur binaire fixe renvoie des n-uplets, JSON et YAML construisent des objets Python typés, CSV renvoie des chaînes, et les lignes XML et Markdown construisent des arbres ou des flux de jetons sans convertir les valeurs ; les rapports comparent donc le comportement complet des bibliothèques, et non le coût intrinsèque de chaque format. (b) Un seul environnement d’exécution (CPython 3.13). (c) Le corpus est synthétique et pauvre en identifiants. (d) Le temps seul n’est pas l’énergie : la section 5c mesure donc directement le `ri_energy_nj` (`reported_j`) du noyau par processus sur l’ensemble des 34 charges de travail d’analyse syntaxique et de tokenisation.

<div id="32-tokens" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Jetons

Un modèle de langage lit des jetons (tokens), et non des octets. Les mêmes enregistrements, comptés avec le tokenizer `cl100k_base` sur les 2 000 premiers enregistrements de chaque vue (et vérifiés sur l'ensemble des 20 000 enregistrements de la section 5c) :

![Jetons par enregistrement par rapport au CSV](/living/ai-reads-human/charts/tokens-vs-csv.svg)

*Figure 6. κ = nombre de jetons par enregistrement de la vue divisé par le nombre de jetons par enregistrement du CSV. Source : `/living/ai-reads-human/data/tokens.tsv`.*

| Vue | jetons par enregistrement | κ (par rapport au CSV) |
|---|---|---|
| CSV | 22,9 | 1,00 |
| JSON, compact | 36,2 | 1,58 |
| YAML | 51,4 | 2,24 |
| JSON, mis en forme (indentation de 2) | 65,6 | 2,86 |

L'identité de la section 2 se vérifie sur ces données : pour le JSON compact, β = 1,912 et d_CSV/d_JSON = 0,826, soit κ = 1,58 ; pour le YAML, 2,028 × 1,107 = 2,24 ; pour le JSON mis en forme, 3,056 × 0,936 = 2,86. Le JSON compact coûte davantage de jetons principalement parce qu'il comporte environ 1,9 fois plus d'octets que le CSV, et le JSON mis en forme pour la même raison, à laquelle s'ajoute l'indentation. Le YAML cumule davantage d'octets et des jetons plus courts.

![Rapport de jetons par rapport au CSV selon cinq tokenizers](/living/ai-reads-human/charts/tokens-five-tokenizers.svg)

*Figure 7. Le même rapport selon les tokenizers `cl100k_base`, `o200k_base`, GPT-2, Mistral-7B-v0.1 et Qwen2.5-0.5B. L'ordre se maintient dans les cinq cas ; l'ampleur de l'écart, elle, varie (le JSON mis en forme représente 3,66 fois le CSV avec GPT-2 et 2,22 fois avec Qwen2.5). Aucun tokenizer commercial fermé n'a été testé.*

![Octets encodés par enregistrement](/living/ai-reads-human/charts/bytes-per-record.svg)

*Figure 8. Octets par enregistrement. La figure de 23 octets pour le format binaire ne tient pas compte de la liste de mots partagée ; toute affirmation rigoureuse sur la taille d'une forme binaire doit nommer la liste (ou le dictionnaire) dont elle dépend, en précisant sa version et son empreinte (hash).*

**Un résultat négatif à énoncer.** Écrire la disposition binaire sous forme de texte à destination d'un modèle ne supprime pas la taxe : en base64, elle représente 20,3 jetons par enregistrement (κ = 0,89), et en hexadécimal 22,7 (κ = 0,99), soit à peu près autant que le CSV, car un modèle textuel a besoin d'une vue textuelle. Le gain pour un modèle provient de l'envoi de moins de champs, mieux choisis, et non du changement de codage de ce qui est envoyé. Cette affirmation relève du statut Planifié (M7) et n'a pas été mesurée.

<div id="4-why-the-hazards-come-with-the-readability" class="anchor-alias" aria-hidden="true"></div>

## 4. Pourquoi les risques accompagnent la lisibilité

Les formats conçus pour les humains et pour les programmes faiblement couplés permettent qu’une même entrée signifie différentes choses pour différents lecteurs. Le tableau répertorie les risques constatés dans les spécifications lues, ainsi que dans les tests exécutés sur les versions de bibliothèques nommées (Python 3.13.5, Node v20.19.2, jq 1.7, PyYAML 6.0.2, lxml 6.1.3). Les lignes de test (codes T, U, X, Y, C) se trouvent dans `tests-formats/RESULTS.txt` et décrivent uniquement ces versions. "Spec" désigne le texte du document cité.

| Classe | Format | Danger | Preuve |
|---|---|---|---|
| Ambiguïté | JSON | Les noms de membres dupliqués produisent un comportement « imprévisible » ; les implémentations renvoient le dernier, tous, ou échouent. Trois outils testés ont conservé la dernière valeur. | RFC 8259 section 4 ; T1 |
| Ambiguïté | Markdown | La description originale ne spécifie pas la syntaxe de manière non ambiguë ; les dialectes ont divergé. | CommonMark 0.31.2 section 1.2 |
| Différentiel d’analyseur | Nombres JSON | 9007199254740993 est exact en Python et est arrondi à …992 dans Node. | RFC 8259 section 6 ; T2 et N2 |
| Différentiel d’analyseur | JSON | Le `json` de Python accepte les `NaN` et `Infinity` nus, ce que la spécification interdit. | RFC 8259 section 6 ; T6 |
| Formes non canoniques | JSON | `1`, `1.0`, `1e0`, `10E-1`, `0.1e1` représentent un même nombre écrit de cinq façons, et deux types Python. | U3 |
| Formes non canoniques | JSON | L’ordre des membres ne change pas la signification mais modifie les octets et tout hachage de ceux-ci. | T8 |
| Ordre | Canonicalisation JSON | Le tri par unités de code UTF-16 diffère de l’ordre par point de code pour U+1F600 par rapport à U+FFEE. | RFC 8785 section 3.2.3 ; U2 |
| Formes non canoniques | CBOR | L’encodage déterministe est un profil optionnel que les protocoles peuvent adopter ; il n’est pas activé par défaut. | RFC 8949 section 4.2 |
| Formes non canoniques | Protocol Buffers | « Ne supposez pas que la sortie d’octets d’un message sérialisé est stable. » | Guide d’encodage Protobuf, « Implications » |
| Dangers liés aux nombres | JSON | Les implémentations peuvent limiter la plage et la précision ; la plage d’entiers exactement représentables est ±(2^53)−1. | RFC 8259 sections 6 et 9 ; RFC 7493 section 2.2 |
| Dangers liés aux nombres | JSON | `1e400` devient `inf` dans Python et Node ; `-0` est traité différemment. | T3, N3, T4, N4 |
| Dangers liés aux nombres | Résolveur YAML 1.1 | Dans PyYAML, `010` vaut 8, `12:30:45` vaut 45045 et `country: NO` vaut `{country: False}`. | Lignes Y |
| Dangers liés aux nombres | TOML | La spécification indique qu’un entier ne pouvant être stocké sans perte est une erreur ; le `tomllib` de Python a accepté 2^63. | TOML 1.0.0 ; lignes T |
| Unicode | JSON | `"\uDEAD"` (substitut isolé) est autorisé par la grammaire ; il est analysé puis échoue à l’encodage UTF-8. | RFC 8259 section 8.2 ; T5 |
| Unicode | JSON | Les formes NFC et NFD d’un même texte constituent des clés distinctes. | U1 |
| Injection | CSV | Une cellule commençant par `=` est une donnée brute pour l’analyseur et une formule pour certains tableurs. | OWASP CSV Injection ; ligne C |
| Injection | XML | Avec la résolution d’entités activée, lxml a lu un fichier local via une entité externe. | Lignes X |
| Explosion de ressources | YAML | 166 octets d’alias ont été étendus en 59 049 feuilles logiques. | Test d’alias Y |
| Explosion de ressources | XML | 202 octets d’entités internes ont été étendus en 10 000 caractères (49,5 fois). | Lignes X |
| Explosion de ressources | JSON | Les limites de profondeur sont définies par l’implémentation ; Python a levé une `RecursionError` à 100 000 niveaux d’imbrication. | RFC 8259 section 9 ; T9 |
| Totalité | Tout analyseur | Les exceptions des bibliothèques constituent un flux de contrôle extérieur au type de retour de la fonction. | T5, T9 |

Aucune de ces raisons ne constitue un motif d'éviter ces formats pour les humains. Chacune constitue en revanche un motif de ne pas utiliser le même texte comme unique référence faisant autorité entre machines.

<div id="5-planned-measuring-energy" class="anchor-alias" aria-hidden="true"></div>

## 5. Prévu : mesure de l'énergie

La feuille de route de mesure sépare les compteurs `reported_j` de l'analyse et de la tokenisation terminés des inférences GPU ouvertes et des sondes de puissance matérielles externes :

| ID | Mesure | Statut |
|---|---|---|
| M1, M2, M3 | Temps d'analyse, jetons, débit du tokeniseur | **Terminé** (`data/parse_time.tsv`, `data/tokens.tsv`, `data/tokenize_time.tsv`) |
| M5 | Énergie d'analyse et de `tiktoken` sur les 34 charges de travail via le `reported_j` double canal Apple M5 Max (`L3` par processus `ri_energy_nj` + `L2` puce entière `IOReport` avec filtrage de dérive au repos Falsifier 6) | **Terminé pour `reported_j`** (section 5c ; `data/energy_reported_j.tsv` ; `measured_j = None`, `board_metered = false`) |
| M4 | Énergie de préremplissage et énergie de décodage par jeton en fonction de la longueur du contexte, même modèle, GPU avec un compteur d'énergie matériel ou une sonde de rail/paroi externe | Prévu (nécessite un compteur GPU dédié ou une sonde de puissance en ligne) |
| M6 | Un second corpus : documentation en langage naturel et journaux face à la télémétrie riche en identifiants | Prévu |
| M7 | Niveau tâche : jetons dont un agent a besoin pour répondre à un ensemble de questions fixe à partir d'une projection des champs dont il a besoin par rapport au document complet | Prévu |
| M8 | Autres analyseurs par format (simdjson, rapidyaml, libxml2 C, pulldown-cmark) pour borner les effets du langage d'exécution | Prévu |

Les relevés de puissance externe par prise murale ou sonde de puissance USB-C en ligne (`measured_j`) restent non collectés ; la section 5c rapporte strictement les compteurs `reported_j` du système d'exploitation/sur puce.

<div id="5b-measured-energy-no-net-effect-resolved" class="anchor-alias" aria-hidden="true"></div>

## 5b. Énergie mesurée : aucun effet net résolu

*Première tentative de soustraction au niveau de la puce entière, exécutée le 2026-10-18 sur deux ordinateurs portables Apple M5 Max (48 Go sur batterie, 128 Go sur secteur), macOS 27.0.1, Python 3.13.16, compteur de puissance macmon 0.10.0 (48 Go) et 0.9.0 (128 Go), lecture du `IOReport` de l'ensemble du SoC et des capteurs SMC (`all_power` et `sys_power`). Neuf charges de travail d'analyse sur les mêmes 20 000 enregistrements, chacune bouclée pendant 10 s sur un fil d'exécution, 10 séries entrelacées, avec une fenêtre d'inactivité de 10 s avant et après chaque série. Fichiers : `/living/ai-reads-human/data/energy_joules.tsv` et échantillons bruts dans `/living/ai-reads-human/data/energy_raw_m5max48/` et `energy_raw_m5max128/`.*

**Résultat de la tentative non isolée au niveau de la puce entière : la soustraction du paquet net au-dessus de l'inactivité n'a pas permis de résoudre l'analyse sur un seul fil d'exécution sur un hôte occupé.** Sur les deux ordinateurs portables (moyenne de charge d'une minute de 41 à 68), la ligne de base d'inactivité avant/après s'est déplacée de 2 à 7 W entre les fenêtres tandis qu'un fil d'exécution d'analyse n'ajoutait que 1 à 5 W à une puce consommant 18 à 36 W, laissant chaque moyenne nette à moins de 1,5 erreur-type de zéro (plusieurs négatives). Cet échec a motivé le protocole à deux canaux de la section 5c : appariement de l'`IOReport` de la puce entière (`L2`, filtré par le Falsificateur 6 de sorte que les soustractions nettes dérivées sont automatiquement rejetées) avec le `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` par PID du noyau macOS (`L3`), qui attribue l'énergie du CPU strictement au sous-processus de travail dédié exécutant chaque charge de travail.

<div id="5c-dual-channel-apple-m5-max-reported_j-across-all-34-parse-and-tokenize-workloads" class="anchor-alias" aria-hidden="true"></div>

## 5c. `reported_j` à double canal sur Apple M5 Max pour les 34 charges de travail d'analyse et de tokenisation

*Exécuté le 2026-11-22 (de `16:44:52` à `16:53:22 UTC`) sur Apple M5 Max (`128 GB` de RAM, `macOS 27.2.1` `arm64`, `Python 3.13.14`, `macmon 0.12.0`), corpus à graine `20261016` (`20,000` enregistrements répartis dans 12 fichiers épinglés par SHA-256), `5` tours entrelacés et mélangés × `34` charges de travail = `170` fenêtres de sous-processus worker dédiés. Fichiers : [`/living/ai-reads-human/data/energy_reported_j.tsv`](/living/ai-reads-human/data/energy_reported_j.tsv) et [`/living/ai-reads-human/data/energy_reported_j_summary.json`](/living/ai-reads-human/data/energy_reported_j_summary.json). Explorateur interactif : [`/living/ai-reads-human/`](/living/ai-reads-human/).*

<div id="telemetry-channels-and-falsifier-6-demonstration" class="anchor-alias" aria-hidden="true"></div>

### Canaux de télémétrie et démonstration du Falsifier 6

Chaque fenêtre de mesure a enregistré simultanément deux canaux de télémétrie sans privilèges tout en maintenant `measured_j = None` et `board_metered = false` :

1. **`L3` par processus `reported_j` (étiquette d’hôte partagé `D`, isolé entre co-locataires)** : `proc_pid_rusage(worker_pid, RUSAGE_INFO_V6).ri_energy_nj`, intégré par le noyau XNU uniquement sur les threads programmés dans le sous-processus travailleur dédié pour ce seul passage de format/tokeniseur.  
2. **`L2` Whole-SoC `reported_j` (étiquette d’hôte partagé `A2`, déclenché par Falsifier 6)** : `macmon pipe` échantillonnant le `IOReport` `chip_power` d’Apple Silicon conjointement avec des bases d’inactivité pré- et post-fenêtre de `0.8 s`. Sous **Falsifier 6**, toute fenêtre dont la base d’inactivité pré/post dérive de `> 5.0%` a son `derived_marginal_j` automatiquement invalidé plutôt que rapporté. Sur cet hôte partagé (moyenne de charge sur 1 minute `12.92`, consommation de puce au repos `30.5-35.4 W`), Falsifier 6 a invalidé **`109` sur `170` fenêtres (`64.1%`)** parmi les 34 charges de travail (`61 / 170` valides, `0 / 34` charges de travail passant toutes les réplicas `5 / 5`), reproduisant quantitativement le diagnostic de la section 5b tandis que `L3` `ri_energy_nj` a résolu proprement chaque charge de travail.

<div id="parse-stage-l3-reported_j-16-workloads-20000-records" class="anchor-alias" aria-hidden="true"></div>

### Étape d'analyse `L3` `reported_j` (`16` charges de travail, `20 000` enregistrements)

| Format et analyseur | Octets du corpus | Temps paroi ms / `20k` (moyenne ± écart-type) | `L3` `nJ / enregistrement` (moyenne ± écart-type) | `L3` `nJ / octet` | Instructions / enr. | Rapport énergétique `L3` vs binaire |
|---|---:|---:|---:|---:|---:|---:|
| Binaire fixe (`numpy.frombuffer`, vue sans copie) | `460 000` | `0,0002 ± 0,0000` | `0,04 ± 0,01` | `0,002` | `0,3` | `0,00×` (vue seule) |
| **Binaire fixe (`struct.iter_unpack`, référence)** | `460 000` | `1,359 ± 0,351` | **`280,36 ± 111,38`** | `12,19` | `1 397,4` | **`1,00×`** |
| JSON (`orjson`, SIMD C/Rust) | `2 325 428` | `7,053 ± 1,359` | **`1 405,93 ± 372,34`** | `12,09` | `6 187,0` | **`5,01×`** |
| CSV (`csv`, bibliothèque standard Python) | `1 205 469` | `8,804 ± 1,309` | **`1 798,22 ± 435,28`** | `29,83` | `8 812,4` | **`6,41×`** |
| MessagePack (`msgpack`) | `1 660 773` | `10,817 ± 3,321` | **`1 802,46 ± 593,84`** | `21,71` | `9 593,3` | **`6,43×`** |
| **JSON (`json.loads`, bibliothèque standard Python)** | `2 325 428` | `11,396 ± 1,219` | **`2 212,12 ± 409,29`** | `19,03` | `12 700,6` | **`7,89×`** |
| JSON indenté (`json.loads`, indentation 2) | `3 685 429` | `11,716 ± 2,225` | **`2 648,45 ± 669,32`** | `14,37` | `13 433,3` | **`9,45×`** |
| CBOR (`cbor2`) | `1 660 877` | `15,286 ± 1,250` | **`2 719,58 ± 365,78`** | `32,75` | `14 514,3` | **`9,70×`** |
| XML (`lxml`, bibliothèque C) | `2 885 487` | `22,204 ± 2,392` | **`3 800,46 ± 331,49`** | `26,34` | `19 521,4` | **`13,56×`** |
| XML (`xml.etree.ElementTree`) | `2 885 487` | `26,354 ± 0,750` | **`6 029,30 ± 370,65`** | `41,79` | `27 495,7` | **`21,51×`** |
| JSON Lines (`json.loads` par ligne) | `2 325 427` | `22,729 ± 1,481` | **`6 130,27 ± 946,08`** | `52,72` | `27 414,8` | **`21,87×`** |
| Tableau Markdown (`markdown-it-py`, jetons) | `1 525 499` | `115,160 ± 7,576` | **`22 824,50 ± 2 464,64`** | `299,24` | `115 255,0` | **`81,41×`** |
| TOML (`tomllib`, bibliothèque standard Python) | `2 505 426` | `298,582 ± 60,674` | **`57 803,43 ± 16 269,64`** | `461,43` | `260 140,9` | **`206,17×`** |
| **YAML (`PyYAML` avec `libyaml` C)** | `2 445 427` | `448,071 ± 95,009` | **`69 922,12 ± 13 405,09`** | `571,86` | `371 347,0` | **`249,40×`** |
| Liste Markdown (`markdown-it-py`, jetons) | `1 925 427` | `417,700 ± 54,289` | **`99 595,04 ± 17 044,11`** | `1 034,52` | `377 878,0` | **`355,23×`** |
| **YAML (`PyYAML`, Python pur)** | `2 445 427` | `3 224,548 ± 375,725` | **`575 799,27 ± 56 674,36`** | `4 709,19` | `2 706 372,9` | **`2 053,75×`** |

<div id="tokenization-stage-l3-reported_j-18-tiktoken-workloads-20000-records" class="anchor-alias" aria-hidden="true"></div>

### Étape de tokenisation : `reported_j` de `L3` (`18` charges `tiktoken`, `20 000` enregistrements)

Lorsqu'un modèle de langage ingère du texte plutôt que de la mémoire structurée, la tokenisation par paires d'octets (`E_tok(F,k)` en section 2) domine le coût CPU de décodage pour les formats compacts :

| Tokenizer et vue | Tokens / `20k` | Temps mural ms / `20k` (moyenne ± écart-type) | `L3` `nJ / enregistrement` (moyenne ± écart-type) | `L3` `nJ / token` | Ratio vs CSV (`même tok`) | Ratio vs analyse binaire fixe |
|---|---:|---:|---:|---:|---:|---:|
| `cl100k_base` · CSV (`recs.csv`) | `459,916` | `73.442 ± 20.454` | **`16,384.84 ± 4,362.40`** | `712.51` | `1.000×` | `58.44×` |
| `cl100k_base` · Tableau Markdown | `569,973` | `105.364 ± 18.819` | **`23,385.73 ± 5,597.57`** | `820.59` | `1.427×` | `83.41×` |
| `cl100k_base` · Liste Markdown | `649,947` | `105.199 ± 11.723` | **`26,749.70 ± 4,445.05`** | `823.13` | `1.633×` | `95.41×` |
| `cl100k_base` · JSONL (`recs.jsonl`) | `753,109` | `154.114 ± 43.130` | **`26,983.02 ± 9,347.95`** | `716.58` | `1.647×` | `96.24×` |
| **`cl100k_base` · JSON compact (`recs.json`)** | `733,111` | `124.295 ± 7.051` | **`27,679.19 ± 2,697.37`** | `755.12` | **`1.689×`** | **`98.73×`** (`12.51×` `json.loads`) |
| `cl100k_base` · XML (`recs.xml`) | `1,046,596` | `171.844 ± 21.381` | **`36,730.51 ± 6,968.26`** | `701.90` | `2.242×` | `131.01×` |
| `cl100k_base` · TOML (`recs.toml`) | `933,109` | `178.111 ± 23.760` | **`38,499.73 ± 6,633.02`** | `825.19` | `2.350×` | `137.32×` |
| `cl100k_base` · YAML (`recs.yaml`) | `1,029,947` | `208.434 ± 33.837` | **`51,880.14 ± 12,381.40`** | `1,007.43` | `3.166×` | `185.05×` |
| **`cl100k_base` · JSON pretty (`recs_pretty.json`)** | `1,313,111` | `266.827 ± 21.754` | **`70,590.45 ± 10,239.93`** | `1,075.16` | **`4.308×`** | **`251.78×`** (`26.65×` `json.loads` pretty) |
| `o200k_base` · CSV (`recs.csv`) | `464,995` | `51.864 ± 5.906` | **`9,570.91 ± 1,012.53`** | `411.66` | `1.000×` | `34.14×` |
| `o200k_base` · JSON compact (`recs.json`) | `754,794` | `93.277 ± 8.521` | **`15,125.65 ± 1,287.77`** | `400.79` | `1.580×` | `53.95×` (`6.84×` `json.loads`) |
| `o200k_base` · Tableau Markdown / Liste | `574,818` / `654,792` | `68.091` / `68.666` | **`15,693.90`** / **`17,362.58`** | `546.05` / `530.32` | `1.640×` / `1.814×` | `55.98×` / `61.93×` |
| `o200k_base` · JSONL / XML / TOML | `774.8k` / `1,054.8k` / `934.8k` | `83.02` / `114.79` / `106.68` | **`21,530.58`** / **`22,997.48`** / **`25,307.32`** | `555.78` / `436.05` / `541.45` | `2.250×`-`2.644×` | `76.79×`-`90.27×` |
| `o200k_base` · YAML (`recs.yaml`) | `1,034,792` | `141.338 ± 24.980` | **`29,401.44 ± 7,308.15`** | `568.26` | `3.072×` | `104.87×` |
| `o200k_base` · JSON pretty (`recs_pretty.json`) | `1,314,794` | `193.648 ± 18.210` | **`37,070.18 ± 3,651.35`** | `563.89` | `3.873×` | `132.22×` |

Trois constats se dégagent de la campagne de `170` fenêtres :

1. **La tokenisation du JSON coûte un ordre de grandeur davantage de CPU `reported_j` que son analyse** : `tiktoken` (`cl100k_base`, implémenté en Rust compilé) consomme `27,679.2 nJ/record` (`0.554 J` par `20,000` enregistrements, `129,192` instructions/record) sur du JSON compact, **`12.51×` le `json.loads()` de Python (`2,212.1 nJ/record`)**, **`19.69×` `orjson.loads()` (`1,405.9 nJ/record`)**, et **`98.73×` `struct.iter_unpack` (`280.4 nJ/record`)**. L’indentation du JSON (`indent=2`) augmente l’énergie de tokenisation de `cl100k_base` d’un facteur supplémentaire de `2.55×` à `70,590.5 nJ/record` (`4.31×` la tokenisation CSV) simplement pour parcourir les séquences d’espaces.  

2. **Les rapports d’énergie de parsing suivent de près les rapports d’instructions, avec une variation mineure de puissance effective (`3.28-5.65 W` par PID worker)** : la bibliothèque C `libyaml` consomme `3.31 W` de puissance effective par worker (`249.4×` `reported_j` binaire vs `329.8×` temps d'exécution), tandis que le `jsonl` ligne-par-ligne et le `tiktoken` JSON joliment formaté consomment `5.37-5.46 W` (`21.87×` et `251.78×` `reported_j` vs `16.73×` et `196.37×` temps d'exécution), confirmant pourquoi les compteurs `ri_energy_nj` par processus direct sont préférables à la multiplication du temps d'exécution par une estimation constante de puissance.  

3. **Limite de provenance** : `ri_energy_nj` est un compteur du système d’exploitation/firmware (`reported_j`, niveau de télémétrie `L3`), pas un shunt matériel externe ni un analyseur d’alimentation mural (`measured_j = None`, `board_metered = false`), et il couvre toujours le travail CPU/mémoire de l’hôte avant les passes avant du réseau de neurones (`e_prefill · T_{F,k}` dans M4).

<div id="6-where-a-canonical-machine-form-fits" class="anchor-alias" aria-hidden="true"></div>

## 6. Où une forme machine canonique s'intègre

Une réponse à la taxe consiste à conserver une forme machine canonique pour le stockage et l'échange, et à n'émettre du texte humain qu'à la demande d'une personne qui souhaite le lire. Plusieurs projets ont emprunté cette voie pour des parties du problème : CBOR déterministe, JSON canonique, formats binaires liés à un schéma. Les propriétés qu'une telle forme devrait posséder sont testables : une chaîne d'octets valide unique par valeur, une version déclarée, un schéma clos, des bornes de taille et de profondeur énoncées avant le décodage, ainsi qu'une revendication de taille qui nomme le dictionnaire dont elle dépend.

<div id="61-an-open-design-question" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Une question de conception ouverte

Le choix de la meilleure forme canonique d'échange n'est pas tranché ici. Le JSON canonique (RFC 8785) conserve une forme textuelle, mais nécessite des règles de formatage des nombres et d'ordre des clés. Le CBOR déterministe (RFC 8949, section 4.2) est binaire (`2,719.6 nJ/record` dans `cbor2` en Python, `9.70×` pour le binaire à largeur fixe), mais laisse certains choix à chaque protocole. Une forme binaire à préfixe de longueur ou à pas fixe (`280.4 nJ/record` avec `struct.iter_unpack`, ou `0.04 nJ/record` pour une vue zéro-copie sur tampon) supprime presque tout le travail d'analyse entre machines, alors qu'un modèle textuel exige toujours une vue textuelle projetée (`16,384.8 nJ/record` pour le CSV contre `70,590.5 nJ/record` pour le JSON indenté sous `cl100k_base`). Reste ouverte la question de savoir quel compromis de bout en bout l'emporte une fois pris en compte le préremplissage du modèle sur GPU (`M4`) et les tâches de projection de champs (`M7`).

<div id="7-reproduce-this-page" class="anchor-alias" aria-hidden="true"></div>

## 7. Reproduire cette page

Tout le nécessaire se trouve sous `/living/ai-reads-human/` sur ce site :

- `data/parse_time.tsv`, `data/tokens.tsv`, `data/tokenize_time.tsv`, `data/ENV.txt`, `data/SUMMARY.txt`: les références temporelles et de jetons Linux Xeon.
- `data/energy_reported_j.tsv` et `data/energy_reported_j_summary.json`: le jeu de données `reported_j` à 34 charges de travail, 170 fenêtres, Apple M5 Max à double canal (`L3` `ri_energy_nj` + `L2` `IOReport` Falsifier 6) (`data/energy_joules.tsv` conserve la précédente exécution nulle du chipset complet d’octobre 2026, non isolée).
- `scripts/gen_corpus.py` (corpus semé), `bench_parse.py`, `bench_tokens.py`, `bench_tokenize_time.py`, `summarize.py`: les mesures.
- `scripts/make_charts.py`: reconstruit chaque graphique à partir des fichiers de résultats et vérifie les valeurs principales.
- `scripts/verify_numbers.py`: recompute chaque nombre cité dans le texte; sort avec un code de sortie non nul en cas de divergence.
- `tests-formats/`: les scripts à l’origine des lignes de test de sûreté.

```
python3 -m venv --system-site-packages venv
venv/bin/pip install tiktoken tokenizers msgpack cbor2 orjson ruamel.yaml markdown-it-py psutil
venv/bin/python scripts/gen_corpus.py 20000
venv/bin/python scripts/bench_parse.py 9 > results/parse_time.tsv
venv/bin/python scripts/bench_tokens.py 2000 > results/tokens.tsv
venv/bin/python scripts/make_charts.py charts && venv/bin/python scripts/verify_numbers.py
```

Les vocabulaires de tokeniseurs pour GPT-2, Mistral-7B-v0.1 et Qwen2.5-0.5B sont téléchargés depuis un hub de modèles par `bench_tokens.py`. Les chronométrages et les compteurs `ri_energy_nj` dépendent du processeur hôte et du système d'exploitation ; on s'attend à ce que l'ordre de grandeur multiple entre les formats soit conservé, tandis que les valeurs absolues en nanosecondes et en nanojoules varient selon le matériel.

<div id="8-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## 8. Menaces à la validité

- Le compteur `ri_energy_nj` du noyau (`L3`, `reported_j`) est un compteur du système d'exploitation Apple Silicon fondé sur un modèle, et non un compteur inline sur le rail continu ni un wattmètre branché sur le secteur alternatif (`measured_j = None`, `board_metered = false`). De plus, les joules de préremplissage et de décodage du modèle GPU (`M4`) ne sont pas encore mesurés ici.
- Sur les hôtes partagés, la soustraction « net au-dessus de l'inactivité » de `IOReport` à l'échelle de tout le SoC (`L2`) est vulnérable à la dérive due aux colocataires (`109 / 170` fenêtres invalidées par le Falsifier 6 à la section 5c ; résultat nul à la section 5b).
- Le surcoût d'allocation d'objets Python pèse sur plusieurs lignes d'analyse (les analyseurs compilés en C/Rust de `M8` borneront le surcoût d'exécution ; notons que `orjson` et `tiktoken` exécutent déjà du code natif compilé).
- Un seul corpus synthétique, pauvre en identifiants (`seed = 20261016`) ; les journaux en langage naturel et de télémétrie restent non testés (`M6`).
- Les tokeniseurs testés sont ouverts ; les tokeniseurs commerciaux fermés ne sont pas testés.
- La disposition binaire de 23 octets dépend d'un dictionnaire partagé de 24 mots (`SHA-256` épinglé dans `data/energy_reported_j_summary.json`) que les chiffres d'octets par enregistrement ne répètent pas.

<div id="9-read-ledger-and-references" class="anchor-alias" aria-hidden="true"></div>

## 9. Lecture du registre et des références

Status per source is in the [registre de lecture](/living/ai-reads-human/READ_LEDGER.md) (FULL, PARTIAL, UNAVAILABLE). Cité : RFC 8259, RFC 7493, RFC 8785, RFC 8949, RFC 4180, CommonMark 0.31.2, YAML 1.2.2 (section 1.1), TOML 1.0.0, Protocol Buffers encoding guide, OWASP CSV Injection, `tex.web` (header only, PARTIAL), Samsi et al. arXiv:2310.03003, Luccioni et al. DOI 10.1145/3630106.3658542. HTML sources were read as tag-stripped text, so figures in them were not read.

**Non lu (paywall ou indisponible), listé avec identifiants et non cité pour aucune affirmation :**  

| Élément | Identifiant |
|---|---|
| ISO 32000-1:2008, Format de Document Portable | catalogue ISO (paywall) |
| ISO/IEC 29500, Office Open XML | ISO/IEC 29500 (équivalent gratuit ECMA-376 uniquement partiellement lu) |
| ISO/IEC 26300, OpenDocument | ISO/IEC 26300 (lecture gratuite de OASIS ODF 1.3 Part 1) |
| IEEE 754-2019, Floating-Point Arithmetic | DOI 10.1109/IEEESTD.2019.8766229 |
| Sennrich, Haddow, Birch, "Neural Machine Translation of Rare Words with Subword Units" | DOI 10.18653/v1/P16-1162 |
| The Unicode Standard and UAX #15 | unicode.org (non récupéré) |
| ECMA-262 (number serialisation referenced by RFC 8785) | non récupéré |
| The TeXbook, printed edition | ISBN 978-0-201-13447-6 |
| Horowitz, "Computing's energy problem", source attribuée de la citation 640 pJ par lecture DRAM 32 bits | **lu ; 640 pJ introuvable dans le papier ou les diapos de séance plénière (ils donnent 1 à 2 nJ, et 1,3 à 2,6 nJ par accès 64 bits) ; non utilisé** |
| Strubell et al. 2019 ; Patterson et al. 2021 et 2022 ; Wu et al. 2021 | cité uniquement dans les articles de Samsi et Luccioni ; non lu, aucune affirmation faite |

<div id="10-what-will-be-added" class="anchor-alias" aria-hidden="true"></div>

## 10. Ce qui sera ajouté

Extensions prévues, sans ordre fixe : énergie par jeton de préremplissage et de décodage pour les modèles GPU (`M4`) et validation externe par compteur mural en ligne (`measured_j`) ; analyseurs natifs compilés en C/Rust (`M8`) ; un corpus en langage naturel et en journal structuré (`M6`) ; comptages de jetons par tâche pour les charges de travail d'agent à projection de champs (`M7`) ; davantage de formats issus du registre (PDF 2.0, C2PA, dialectes Markdown, LaTeX) avec leurs risques ; et une comparaison détaillée des projections binaires canoniques pour les modèles.

*© 2026 Open Interface Engineering, Inc. Texte, figures, données et scripts : MIT ou Apache-2.0, à votre choix.*
