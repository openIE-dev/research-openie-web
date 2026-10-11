*Version 1.1, 11 octobre 2026. Données et code : [research.openie.dev/data/](/data/#rce). PDF LaTeX : [/pdfs/latex/rce.pdf](/pdfs/latex/rce.pdf) ([source](/pdfs/latex/rce.tex)).*

*Une Forme. De nombreux ajustements. La porte est la correction, et le classement, ce sont les joules.*

La lecture économique de cet article se trouve dans son compagnon, [Le marché promis à mille milliards de dollars de la programmation par IA](/papers/ai-coding-market/). Cet article ne contient que l'ingénierie et la théorie.

## 1. Thèse

Il existe deux voies vers l'automatisation informatique autonome. Deux grandeurs les distinguent : l'énergie dépensée par résultat correct, et l'entropie que le système doit résoudre à l'exécution.

La première voie génère. Un grand modèle de langage (LLM), modèle statistique de texte, écrit chaque modification à partir de l'invite. Chaque tâche paie de nouveau la génération, et chaque sortie est un nouvel échantillon d'une distribution à forte entropie.

La seconde voie converge. Les humains ont déjà programmé l'essentiel de ce qui sera jamais programmé. Un programme est une machine à états fonctionnelle de base de données : une Forme, de nombreux ajustements. L'intention humaine est à forte entropie. Le plancher de la machine est à faible entropie. Le code converge par construction, si bien que l'essentiel du travail consiste à retrouver un ajustement existant, à l'adapter et à le prouver. Le Reality Code Engine (RCE) est construit sur la seconde voie.

Les deux voies font face à la même porte. La porte est la correction : le prédicat de complétude d'une tâche, $C(z)$, ici les tests de la tâche, une preuve ou une trace d'accord. Parmi les exécutions qui franchissent la porte, les systèmes sont classés par les joules jusqu'à l'achèvement, $J^*$. La correction est une contrainte, pas un score.

Mixture of Limits (mélange de limites) est la philosophie : il existe une quantité minimale de toute chose pour accomplir une tâche, et tout surplus est du gaspillage ([Portes de validation mesurées, Partie II](/papers/gates/#part-ii-the-cascade-mixture-of-limits)). RCE est une instance de Mixture of Limits. Ses engrenages s'exécutent du moins cher au plus cher, et le premier engrenage qui franchit la porte clôt la tâche.

flowG est un projet de langage autonome. RCE en est la première démonstration académique. Les deux restent des projets distincts.

Les chiffres d'énergie sont étiquetés selon leur source. `est_j` est une estimation analytique. `reported_j` est un compteur du système d'exploitation ou de la puce. `measured_j` est réservé à un compteur mural et il est vide dans tous les résultats présentés ici.

## 2. Deux voies vers l'autonomie

![Une phrase en entrée. Un plancher en sortie. L'intention humaine est à forte entropie ; un entonnoir de conversions de l'intention vers la spécification, vers 626 langages de surface, vers une représentation intermédiaire et vers le code machine perd de l'information à chaque frontière ; tout code aboutit à quelques formes machine ; RCE écrit le sens une seule fois dans une Forme canonique, traite chaque surface comme une projection et laisse gagner la forme correcte la moins chère.](/figures/rce/intent-entropy.svg)

*Figure 1. Entropie de l'intention et plancher de la machine. Une [copie PNG](/figures/rce/intent-entropy.png) est fournie. Sources : Shannon (1951) ; Lopes et al. (2017) ; le décompte de 626 langages provient de l'étude des chemins d'abaissement de David Charlot, non publiée ; sa liste et sa méthode seront publiées avec les données de cet article, et d'ici là le décompte est celui de l'auteur. Les résultats en Python et en C relèvent du comportement défini par la spécification du langage ; le dépassement signé en C est un comportement indéfini.*

**L'intention est à forte entropie.** « Rends le paiement plus rapide » a de nombreux sens : chargement de page plus court, moins d'étapes, validation de carte plus rapide, panier en cache, ou rapidité sur une seule classe d'appareils. Le contexte est implicite et n'est jamais écrit. Shannon a mesuré l'anglais imprimé à environ 0,6 à 1,3 bit par lettre [1]. Les lettres sont prévisibles. Le sens ne l'est pas.

**Chaque conversion perd de l'information.** L'intention devient une spécification, et le contexte est perdu. La spécification devient l'un de centaines de langages de surface, et les alternatives et les cas limites sont perdus. Le source devient une représentation intermédiaire (IR), et les noms, le style et les raisons de l'auteur sont perdus. L'IR devient du code machine : les types deviennent des tailles et les boucles des sauts.

**Le plancher est à faible entropie.** Tout programme finit en chargements, rangements, arithmétique et sauts. La destination n'admet que quelques formes, si bien que le code s'infléchit vers elles. La convergence est voulue par construction.

**Les frontières sont là où le sens diverge.** La même ligne donne des réponses différentes aux bords. En Python, `-3 % 2` vaut 1 et `-7 / 2` vaut -3.5. En C, `-3 % 2` vaut -1, `-7 / 2` vaut -3, et le dépassement signé est indéfini. Un système qui régénère du code à chaque frontière devine à chaque frontière.

**Les deux voies, énoncées comme grandeurs.**

| Voie | Ce qui s'exécute par tâche | Entropie résolue à l'exécution | Énergie par résultat correct |
|---|---|---|---|
| Générer | Un modèle échantillonne une nouvelle modification | La distribution complète de l'invite | Payée de nouveau à chaque tâche |
| Converger (RCE) | Recherche, règle, solveur ; un modèle seulement en dernier | Seulement le résidu qu'aucun ajustement stocké ne couvre | Payée une fois par cas nouveau ; ensuite, le plancher du gestionnaire |

RCE écrit le sens une seule fois, dans une Forme canonique. Chaque langage de surface est une projection de cette Forme, vérifiée pour lui correspondre. Parmi les formes équivalentes, c'est la correcte la moins chère qui s'exécute.

### 2.1 Programmer, c'est de la théorie du codage

La thèse de cette section est celle de David Charlot : toute la programmation est de la théorie du codage. Un programmeur convertit l'intention entre deux régimes entropiques. L'intention est à forte entropie, une distribution sur des sens. Le code est à faible entropie, une transition déterministe par état. Chaque étape du travail logiciel, d'une exigence à un registre, est une étape de cette conversion. La littérature l'a dit par morceaux depuis soixante-dix ans, dans de nombreuses langues. Cette section assemble les morceaux en un seul argument et y place chaque engrenage de RCE.

**La mesure.** Shannon a défini l'entropie d'une source et la capacité d'un canal [40], et mesuré l'anglais imprimé à environ 0,6 à 1,3 bit par lettre [1]. Kolmogorov, écrivant en russe dans *Problemy Peredachi Informatsii* en 1965, a donné trois approches de la quantité d'information et fait de l'approche algorithmique la première : l'information d'un objet est la longueur du plus court programme qui le produit [41]. Solomonoff avait atteint le même objet comme théorie de l'inférence inductive [42], et Chaitin a montré que la taille des programmes obéit à des identités formellement identiques à celles de Shannon [43]. Rissanen a fait de l'idée une règle de choix de modèles, la longueur de description minimale [44]. Ensemble, ils disent qu'un programme est un mot de code : une description d'un comportement, et la plus courte description correcte est le plancher. La règle d'extraction de RCE, garder l'ajustement de moindres joules parmi les ajustements équivalents (Proposition 3), est cette règle avec des joules à la place des bits.

**Le code se situe dans le régime à faible entropie, et on l'a mesuré.** Hindle, Barr, Su, Gabel et Devanbu ont trouvé que le code est « très répétitif, et même davantage que les langues naturelles », avec une entropie croisée plus faible sous les mêmes modèles de n-grammes [35]. Gabel et Su ont trouvé que la plupart des lignes d'un projet existent déjà ailleurs [34], et Lopes et al. que la plupart des fichiers sur GitHub sont des clones [33]. Tu, Su et Devanbu ont trouvé que le code est aussi local : ce qui a été écrit à proximité prédit la suite [46]. Ray et ses collègues ont trouvé que les lignes boguées sont moins naturelles, d'entropie plus élevée, et que l'entropie baisse quand le bogue est corrigé [45]. En 2025, Yang, Kolak, Hellendoorn et Martins ont utilisé la variation d'entropie qu'induit un correctif pour classer les candidats de réparation et séparer les correctifs corrects des correctifs surajustés [51]. Allamanis, Barr, Devanbu et Sutton ont passé en revue le domaine sous le nom de naturalité [47]. Le résultat n'est pas seulement anglophone. Prem Devanbu l'a exposé en conférence plénière à l'India Software Engineering Conference de 2013 [50]. Sridhara, Sinha et Mani, d'IBM Research India, ont mesuré au même endroit les artefacts en langue naturelle autour du code et trouvé que les messages de commit sont les plus réguliers et que la prose de Stack Overflow se comporte comme de l'anglais ordinaire [49]. En Chine, le *Journal of Software* (软件学报) a publié en 2022 une revue des recherches sur la naturalité du code, qui expose la mesure d'entropie croisée et le constat que le code défectueux a une entropie plus élevée [48]. Au Japon, Doi, Higo, Arima, Shimonaka et Kusumoto, de l'université d'Osaka, ont utilisé la naturalité par n-grammes, d'abord dans un rapport technique de l'IEICE en japonais puis à ICPC 2018, pour distinguer les fichiers sources générés par machine de ceux écrits par des humains [73, 74]. Le code généré se situe encore plus bas sur l'échelle d'entropie que le code humain, car un générateur est une conversion fixe. Au Brésil, la thèse de doctorat d'Arrebola a construit la suggestion de code sur des modèles de n-grammes et de thèmes segmentés par projet et par mainteneur, et l'a évaluée par l'entropie croisée, les bits nécessaires pour coder le jeton suivant [75]. Les deux régimes sont visibles dans un même dépôt : la prose autour du code est à forte entropie, et le code à faible entropie.

**La mesure compte.** Febres, Jaffé et Gershenson, depuis le Venezuela et le Mexique, ont comparé l'anglais, l'espagnol et le texte de programmes par la diversité du vocabulaire selon la longueur du message, et trouvé le texte de programmes plus divers [76]. Rahman, Palani et Rigby ont trouvé qu'une grande part de la prévisibilité par n-grammes du code vient des jetons syntaxiques, et que le code reste répétitif, moins qu'annoncé au départ, une fois ceux-ci retirés, l'usage des API étant la partie la plus répétitive [77]. Les deux résultats affinent l'affirmation au lieu de la renverser. La diversité des symboles n'est pas la prévisibilité, et le régime à faible entropie est une propriété de la distribution conditionnelle de l'étape suivante, celle que fixe une transition déterministe. C'est pourquoi le G0 de RCE indexe des formes, et non des jetons de surface.

**L'intention se situe dans le régime à forte entropie.** Zave et Jackson ont montré qu'une exigence est un énoncé sur l'environnement, une spécification un énoncé à l'interface, et que l'écart entre les deux n'est comblé que par une connaissance du domaine souvent non écrite [64]. Brooks a divisé la difficulté du logiciel en essence et accident : l'essence est la construction conceptuelle, et l'essentiel en est spécification et conception, non représentation [61]. Naur a soutenu qu'un programme est la partie visible d'une théorie détenue par ses programmeurs, et que cette théorie n'est pas entièrement récupérable à partir du texte [62]. Lus à travers Shannon, les trois disent la même chose. L'intention porte plus d'incertitude que n'importe quel programme, et écrire le programme est l'acte qui la supprime. Ce qui reste dans la tête d'un programmeur une fois le code écrit est la part de l'intention que le code n'a pas codée.

**La conversion est un raffinement, et le raffinement est un rétrécissement.** Hoare a donné aux programmes une logique où un programme est correct relativement à une précondition et une postcondition [54]. Wirth a enseigné le raffinement pas à pas : décomposer une tâche en instructions par des décisions successives, chacune fixant un choix que la spécification laissait ouvert [53]. Les commandes gardées de Dijkstra ont rendu les choix ouverts explicites sous forme de non-déterminisme, et dérivé des programmes de spécifications en le supprimant [52]. À Munich, le projet CIP de Bauer et Wössner a construit le développement de programmes comme une suite de transformations préservant la correction, de la spécification au programme [58]. En France, la méthode B d'Abrial puis Event-B ont porté le raffinement à l'échelle industrielle, avec des obligations de preuve à chaque étape [55, 56]. En Finlande, Back et von Wright ont donné au raffinement son calcul en treillis [57]. Dans chaque cas, une spécification dénote un ensemble de comportements acceptables et chaque étape de raffinement réduit l'ensemble, jusqu'à ce qu'il ne reste qu'un comportement déterministe. C'est une réduction d'entropie avec une preuve à chaque étape. La Forme de RCE est le dernier maillon de cette chaîne : une transition totale et déterministe $\delta$ sur des états de base de données, tout choix résolu ([§3.2](#32-definitions)).

**La synthèse est une recherche qui rétrécit un espace d'hypothèses.** FlashFill de Gulwani apprend un programme de chaînes à partir de quelques exemples d'entrée et de sortie en représentant l'ensemble de tous les programmes cohérents et en l'intersectant avec chaque nouvel exemple [59]. Gulwani, Polozov et Singh présentent la synthèse de programmes en général comme une recherche dans un espace de programmes contraint par l'intention [60], et le sketching de Solar-Lezama remplit les trous d'un programme partiel avec un solveur [27]. Chaque exemple ou contrainte est une mesure qui élimine des hypothèses. La mesure de Shannon compte combien de mesures de ce type sont nécessaires. Le G2 de RCE est cet engrenage.

**Ce que produit la conversion a une seule forme.** Gurevich a démontré que tout algorithme séquentiel est capturé par une machine à états abstraite à son propre niveau d'abstraction [2]. Codd a fait de l'état une relation [5], et l'event sourcing fait de l'état le repli d'un journal en ajout seul [14]. Selon Curry et Howard, une preuve est un programme et une proposition est un type [18, 72], de sorte qu'un ajustement vérifié est une preuve de sa spécification. Voilà pourquoi le régime à faible entropie a peu de formes : la destination est une machine à états sur une base de données, quel que soit le langage de surface.

**La faible entropie se dégrade sans porte.** Lehman a observé sur des décennies de grands systèmes qu'un programme en usage doit continuer à changer, et que sa complexité croît à moins qu'un travail ne soit fait pour la réduire [63]. Torres, Baltes, Treude et Wagner ont mesuré l'entropie structurelle et textuelle sur les historiques de commits de 25 projets et trouvé qu'elles augmentent ensemble [78]. L'entropie revient dans le code depuis l'environnement. Un système qui maintient le code dans le régime à faible entropie a besoin d'une porte à chaque modification, et la porte de RCE est la correction ([§4.3](#43-the-gate)).

**Les compilateurs font déjà du codage de source.** Franz et Kistler ont distribué des programmes sous forme d'arbres de syntaxe abstraite compressés et généré le code natif au chargement, ce qui est un codage de source d'un programme sur sa propre grammaire [67]. Fraser a inféré des modèles statistiques du code à partir d'un corpus pour le compresser [68]. Futamura a montré en 1971, dans la revue japonaise *Systems, Computers, Controls*, que spécialiser un interprète pour un programme donne un programme compilé, et que spécialiser le spécialiseur donne un compilateur [70]. Erchov, à Novossibirsk, a développé la même idée sous le nom de calcul mixte [71]. L'interprétation abstraite des Cousot calcule une description sûre et de moindre information de chaque comportement d'un programme [69]. L'analogie avec le codage de canal est une lecture propre à cet article, non un théorème cité : types, tests et preuves ajoutent une redondance vérifiée pour qu'un programme erroné soit détecté avant de s'exécuter, comme un contrôle de parité détecte un mot corrompu.

**L'effacement est là où vont les joules.** Landauer a montré qu'une étape logiquement irréversible, l'effacement d'un bit, dissipe au moins $k_B T \ln 2$ [65]. Bennett a montré que le calcul peut en principe être rendu logiquement réversible, de sorte que c'est l'effacement, et non le calcul, qui porte la borne [66]. Convertir une intention à forte entropie en un programme à faible entropie écarte toute alternative que l'intention permettait. Cet écart est un effacement d'information sur les alternatives, et il a un plancher thermodynamique. L'[article sur l'agentivité](/papers/agency/#1-thesis) évalue chaque bit confirmé par rapport à ce plancher. RCE paie l'écart une fois par cas nouveau et stocke le résultat, si bien qu'un cas répété n'efface rien de nouveau.

### 2.2 Comment RCE convertit, et où se place chaque engrenage

Lue comme théorie du codage, une tâche arrive comme un message dont l'incertitude restante est ce qu'aucun ajustement stocké ne résout déjà. Chaque engrenage supprime de l'incertitude à un prix différent, et les engrenages sont ordonnés selon ce prix ([§4.2](#42-the-gears)).

| Engrenage | Ce qu'il fait de l'incertitude | Filiation dans l'argument ci-dessus |
|---|---|---|
| G0 Recherche | Reconnaît que l'intention était déjà codée ; la résout par récupération, au plancher du gestionnaire | Répétitivité et clones [33, 34, 35] ; localité [46] |
| G1 Règles | Applique une réécriture gardée connue ; résout un résidu récurrent sans recherche | Transformation préservant la correction [52, 58] ; raffinement avec obligations de preuve [55, 56] |
| G2 Synthèse | Parcourt un espace d'hypothèses et le rétrécit par des exemples, des contraintes et un solveur | Synthèse de programmes comme recherche [27, 59, 60] |
| G3 à G5 Modèles | Échantillonne une distribution apprise sur le code quand aucun engrenage inférieur ne comble l'écart ; seulement comme proposeur | Modèles d'entropie croisée du code [35, 47] |
| Porte | N'accepte un candidat qu'avec des tests, une couverture et un certificat de preuve | Logique de Hoare [54] ; Curry-Howard [18, 72] |
| Promotion | Stocke l'ajustement accepté, de sorte que le même résidu coûte G0 la fois suivante | Longueur de description minimale [44] ; effacement de Landauer payé une fois [65] |

Les deux voies du tableau de la Section 2 diffèrent par l'endroit où la conversion est payée. La voie de génération échantillonne la distribution complète de l'invite à chaque tâche, et paie donc à chaque fois le côté à forte entropie. La voie de convergence ne paie que pour le résidu, et une seule fois. La lecture économique de cette différence se trouve dans [Le marché promis à mille milliards de dollars de la programmation par IA, Section 4](/papers/ai-coding-market/#4-the-theory-that-prices-the-task). La règle d'arrêt derrière l'ordre des engrenages est [Mixture of Limits](/papers/gates/#part-ii-the-cascade-mixture-of-limits), et l'arrêt par tâche est la [satiété de la tâche](/papers/satiation/).

### 2.3 Résultats par échelon de l'échelle

Une tâche de programmation est mesurée ici par les **bits d'intention** dont elle a besoin : les bits à fournir de l'extérieur de ce que le moteur détient déjà (le programme autour de la modification, les bibliothèques, les tests, l'index des corrections connues). En notant $H_{task}$ les bits qui déterminent l'artefact cible et $H_{corpus}$ les bits que le corpus fixe déjà, les bits fournis sont $I = H_{task} - H_{corpus}$. Un engrenage qui classe la bonne modification au rang $r$ parmi ses candidats a fourni $\log_2 r$ bits de recherche, et la porte fournit le reste. L'échelle ordonne les tâches par taille de modification, indicateur objectif de $I$ : un jeton (L0), une instruction (L1), un bloc (L2), plusieurs blocs dans un fichier (L3), plusieurs fichiers (L4), une fonction à partir d'une spécification ou de tests (L5), une modification au niveau d'un ticket (L6) et un programme à partir d'une spécification (L7). Les échelons, corpus, partitions et hypothèses ont été préenregistrés avant les exécutions complètes ; les fichiers sont dans le [dépôt public](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

| Échelon | Corpus de test réservé | N | Résolues | Taux | IC de Wilson à 95 % | Médiane des bits de recherche | Appels de modèle |
|---|---|---|---|---|---|---|---|
| L0 un jeton | Mutants de type PIT [109] de 9 dépôts réels à des commits fixés (Java : commons-math, commons-collections, jsoup, joda-time, gson ; Python : click, attrs, pydantic, sympy) | 520 821 | 520 541 | 0,9995 | 0,9994 à 0,9995 | 2,3 | 0 |
| L0 un jeton, dépôts jamais utilisés pour le réglage | commons-text, commons-io, more-itertools, httpx | 23 015 | 23 015 | 1,0000 | 0,9998 à 1,0000 | 2,0 | 0 |
| L1 une instruction, Java | Corrections à bloc unique de ManySStuBs4J 2.0 [107] | 24 072 | 9 288 | 0,386 | 0,380 à 0,392 | 3,5 | 0 |
| L1 une instruction, Python | TSSB-3M v1.0.0, fragments 14 et 15 [108] | 157 089 | 27 266 | 0,174 | 0,172 à 0,175 | 4,8 | 0 |

L2 à L4 sont mesurés sur l'ensemble réservé Defects4J de 288 bogues ([Section 8.1](#81-defects4j)). L5 à L7 suivent les protocoles de la [Section 8.2](#82-swe-bench-lite-offline). La Section 6 donne la méthode, la porte et l'énergie de chaque ligne.

Les taux se lisent comme des bits d'intention. En L0, les bits manquants sont presque tous sur la ligne, et un voisinage à un jeton ordonné par un a priori les fournit avec une médiane de 2,3 bits. En L1, le moteur ne voit que le bloc de 7 lignes. Il clôt les catégories dont les bits sont dans le bloc (Java : opérateur changé 91 %, littéral booléen inversé 84 %, arguments permutés 82 % ; Python : littéral booléen changé 98,8 %, arguments permutés 99,4 %) et laisse ouvertes celles dont les bits sont hors du bloc : les noms de méthodes (22 %) et les identifiants (37 %) exigent le fichier et ses types, et les nouvelles conjonctions (3 % à 7 %) et les réécritures d'instructions entières (Python, 1,2 % d'une catégorie qui représente 34 % du corpus) sont une intention nouvelle. L'intention nouvelle est ce qu'un fournisseur (une spécification, un test, une personne ou un modèle local) apporte une fois, après quoi l'ajustement est dans l'index.

## 3. La Forme

### 3.1 L'énoncé formel le plus fort de « même forme »

La portée du théorème est d'abord précisée. Les postulats séquentiels de Gurevich couvrent les algorithmes séquentiels ; les algorithmes parallèles et interactifs requièrent les postulats supplémentaires de Blass et Gurevich [3]. Blass, Dershowitz et Gurevich soutiennent qu'aucune relation d'équivalence unique entre algorithmes ne convient à tous les usages [79], et Moschovakis et Vardi exposent le débat sur ce qu'est un algorithme [80, 81]. Un gestionnaire web qui fait des entrées et sorties sort du théorème séquentiel. La Forme traite l'interaction comme le fait la ligne interactive : chaque entrée est un événement de $E$, et la machine à états avance sur lui. « Une Forme » est donc un choix de modélisation fondé sur le théorème séquentiel et étendu par convention, avec des précédents en production dans l'architecture Elm [83], les historiques d'événements des workflows durables [84] et des sémantiques de flux comme Flo [82]. Les propositions de la Section 3.4 sont énoncées pour ce choix.

Le théorème de la machine à états abstraite (ASM) de Gurevich est l'énoncé formel le plus fort selon lequel tout algorithme a une seule forme [2]. Une machine à états abstraite est une machine dont les états sont des structures du premier ordre et dont le pas est un ensemble fini de mises à jour gardées. Gurevich énonce trois postulats. Temps séquentiel : un algorithme a des états, des états initiaux et une application à un pas $\tau$. État abstrait : les états sont des structures du premier ordre sur un vocabulaire fixe, closes par isomorphisme. Exploration bornée : un ensemble fini de termes décide chaque pas. Son théorème principal (théorème 6.13) dit : « Pour tout algorithme séquentiel A, il existe une machine à états abstraite séquentielle B équivalente. » Blass et Gurevich l'étendent aux algorithmes parallèles [3]. Dershowitz et Gurevich ajoutent un quatrième axiome, la calculabilité des opérations initiales, et en dérivent la thèse de Church [4].

### 3.2 Définitions

**Définition 1 (la Forme).** Un programme est un n-uplet

$$P = (S, E, \delta, D, \lambda)$$

- $S$, l'espace d'états : des structures sur un vocabulaire fixe $\Sigma$. Chaque état est une instance de base de données au sens de Codd [5].
- $E$, l'alphabet d'événements, y compris le tic de l'horloge logique.
- $\delta : S \times E \to S$, la transition : totale, déterministe et pure, écrite comme un ensemble fini de mises à jour gardées « si $\varphi$ alors $f(\bar t) := t_0$ », chaque pas lisant un ensemble borné d'emplacements.
- $D = (s_0, L)$, le stockage durable : un état initial et un journal d'événements en ajout seul $L = e_1, \dots, e_n$.
- $\lambda : S \times E \to O$, l'application de sortie. Une machine de Mealy lit les deux arguments [6] ; une machine de Moore ne lit que l'état [7].

**Définition 2 (Forme et ajustement).** La *forme* est la structure du n-uplet avec quatre invariants : $\delta$ est déterministe et pure ; l'exploration est bornée ; le vocabulaire est fixe ; l'état est le repli du journal,

$$\mathrm{state}(D) = \mathrm{foldl}(\delta, s_0, L).$$

L'*ajustement* est la donnée qui remplit la forme : le vocabulaire $\Sigma$, les alphabets $E$ et $O$, le programme de règles $\Pi$ qui définit $\delta$, les règles de sortie qui définissent $\lambda$, et les données initiales $s_0$. Dans les termes de Gurevich, l'ajustement est le vocabulaire, le programme ASM et les structures initiales. Dans ceux de Codd, $\Sigma$ est le schéma et $s_0$ l'instance. En termes de lignes de produits, un ajustement est une sélection de caractéristiques [8]. En termes de synthèse guidée par la syntaxe (SyGuS), un ajustement est un terme d'une grammaire qui satisfait une spécification [9].

**Définition 3 (équivalence d'ajustements).** Deux ajustements sont équivalents lorsque, pour tout journal $L$, leurs suites de sorties sous $\lambda$ sont égales.

**Définition 4 (langage d'ajustements).** Une grammaire dont les termes dénotent des ajustements. Les langages de programmation, les documents SCXML, les configurations XState et les spécifications `.rce` sont des langages d'ajustements. Un langage d'ajustements est complet lorsque tout programme ASM sur $\Sigma$ y a un terme.

**Définition 5 (projection de contrôle).** On sépare $\Sigma = \Sigma_c \cup \Sigma_d$ en symboles de contrôle finis et relations de données. Le statechart de $P$ est la projection de $\delta$ sur $\Sigma_c$ : les états sont des valeurs de $\Sigma_c$, les transitions portent un événement et une garde sur $\Sigma_d$, et les actions sont des mises à jour de $\Sigma_d$. Les statecharts de Harel apportent la hiérarchie et les régions orthogonales [10].

**Définition 6 (e-graphe d'ajustements).** Pour un ajustement $F$ et un ensemble $R$ de réécritures correctes, l'e-graphe d'ajustements $EG(F, R)$ est l'e-graphe saturé des termes de règles de $F$ sous $R$ [11, 12]. Chaque e-classe contient des ajustements équivalents au sens de la Définition 3.

**Définition 7 (coût en joules).** $\mathrm{cost}_J(t)$ est l'énergie estimée (`est_j`) pour exécuter le terme $t$ une fois sur un substrat nommé, pondérée par le nombre attendu d'exécutions.

### 3.3 Pourquoi « machine à états fonctionnelle de base de données »

Une structure relationnelle finie est une instance de base de données, si bien qu'un état de Gurevich est une base de données et chaque pas une transaction bornée. *Base de données* : $S$ est une structure relationnelle. *Fonctionnelle* : $\delta$ et $\lambda$ sont pures. *Machine à états* : les exécutions sont des replis de $\delta$ sur des événements. Moseley et Marks tracent la même ligne en architecture [13]. L'event sourcing la trace dans l'état applicatif : « Capturer toutes les modifications de l'état d'une application comme une suite d'événements » [14]. Dedalus la trace en logique, où l'état mutable est une relation indexée par le temps [15].

### 3.4 Propositions

**Proposition 1 (la Forme capture tout algorithme séquentiel).** Pour tout algorithme séquentiel $A$, il existe une instance de la Forme $P$ dont les exécutions sont celles de $A$.

*Esquisse de preuve.* Le théorème 6.13 donne une ASM $B$ avec les états, les états initiaux et l'application à un pas de $A$. Posons $E = \{\varepsilon\}$, $\delta(s, \varepsilon) = \tau_B(s)$, $D = (s_0, \varepsilon^n)$ et $\lambda$ l'identité. Le repli après $n$ tics est $\tau_A^n(s_0)$. Par le corollaire 3.3 de Gurevich, $P$ et $A$ ont les mêmes exécutions. ∎

**Proposition 1b (programmes interactifs).** On étend $\Sigma$ par un symbole d'entrée d'arité nulle fixé à $e$ avant chaque pas ; alors $\delta(s, e) = \tau(s[\mathit{in} := e])$ est un algorithme séquentiel sur le vocabulaire étendu, et la Proposition 1 s'applique. La construction est la nôtre.

**Proposition 1c (calculabilité).** Sous l'axiome de Dershowitz et Gurevich, toute instance de la Forme calcule une fonction Turing-calculable [4, 16, 17]. La Forme n'ajoute aucune puissance. Elle donne à chaque programme de la classe une seule forme.

**Proposition 1d (les preuves sont des ajustements).** « Pour chaque preuve d'une proposition donnée, il existe un programme du type correspondant » [18]. Un type est une spécification et une preuve est un ajustement qui la satisfait. La porte de correction est l'existence de cette preuve ou d'un test d'acceptation réussi.

**Proposition 2 (un générateur).** Une fonction $G : \mathrm{Fit} \to \mathrm{Program}$ génère un programme exécutable pour chaque ajustement et ne lit aucun domaine. *Fondement :* tout programme est une instance de la Forme, donc $G$ émet un stockage typé, un type d'événement, des règles compilées, un journal avec un repli et un répartiteur de sorties. Les générateurs d'échafaudage comme ceux de Rails, JHipster et Yeoman sont $G$ restreinte à de petits langages d'ajustements. L'ingénierie des lignes de produits part de « la découverte et l'exploitation systématiques des points communs entre systèmes logiciels apparentés » [8] ; le point commun est la Forme.

**Proposition 3 (Mixture of Limits comme extraction).** L'extraction avec $\mathrm{cost}_J$ renvoie le terme de moindres joules que l'extracteur trouve dans l'e-classe de $F$. *Esquisse de preuve.* Les réécritures sont correctes, donc tout terme de l'e-classe a le comportement observable de $F$ et franchit la même porte. L'extraction minimise le coût, et le coût, ce sont des joules. ∎ C'est Mixture of Limits appliqué au code : garder l'ajustement minimal qui fait la tâche ; le reste est du gaspillage.

**Proposition 4 (déterminisme du rejeu).** Si $\delta$ ne lit aucune horloge murale, ordonne les mises à jour sans noms et journalise chaque entrée, deux rejeux d'un même $D$ donnent des empreintes d'état identiques à chaque pas.

**Proposition 5 (la projection en statechart est correcte).** On projette chaque état d'une exécution sur $\Sigma_c$. Le résultat est une exécution du statechart émis sous les mêmes événements.

**Proposition 6 (budget de coordination).** Les règles marquées monotones s'exécutent sur des répliques sans coordination ; seules les règles non monotones ont besoin d'un point de coordination. *Fondement :* le théorème CALM, « les programmes qui ont des implémentations distribuées cohérentes et sans coordination sont exactement les programmes exprimables en logique monotone » [19].

**Proposition 7 (l'intelligence comme dérivée en joules).** Soit $X$ le nombre de tâches qui franchissent la porte et $J$ les joules dépensés. $\iota = dX/dJ$ se lit a posteriori à partir de $D$, qui enregistre chaque événement et son `est_j`. L'extraction sous $\mathrm{cost}_J$ maintient la porte fixe et n'augmente pas $J$, donc à $X$ égal elle ne diminue pas $\iota$ ([Agentivité, Section 2.3](/papers/agency/#23-layer-3-calculus-intelligence-as-a-derivative-read-in-hindsight)).

### 3.5 Graphe, e-graphe et statechart

| Structure | Partie de la Forme | Ce qu'elle décide |
|---|---|---|
| Statechart | Gardes de $\delta$ sur $\Sigma_c$ | Quelle transition se déclenche |
| Graphe de flot de données | Dépendances de lecture et d'écriture de $\delta$ et $\lambda$ (réseaux de processus de Kahn [20]) | Ce qui s'exécute, et dans quel ordre |
| E-graphe | La classe d'équivalence de l'ajustement | Quel ajustement équivalent s'exécute |

Le statechart et le graphe décrivent un ajustement. L'e-graphe décrit tout ajustement qui lui est équivalent. L'extraction choisit parmi eux par les joules.

## 4. Le moteur : engrenages, porte et reçus

### 4.1 Le moteur est une Forme

RCE exécute le logiciel comme un graphe de petits gestionnaires déterministes. Un gestionnaire qui ne peut pas décider lève une escalade. Un résolveur répond une fois à l'escalade, et la réponse est installée comme gestionnaire permanent, de sorte que le cas suivant de même forme s'exécute sans résolveur. Le moteur satisfait chaque invariant de la Forme, chacun vérifié par un test nommé dans `tests/form_laws.rs` :

| Invariant | Ce que fait le moteur |
|---|---|
| Le rechargement est un repli vérifié | Le rechargement lit le journal tel quel, recalcule chaque empreinte et chaque lien, et replie le reste avec $\delta$. Rien n'est réhorodaté. Une chaîne rompue refuse de se charger. |
| Ordre des tics sans noms | Les gestionnaires s'exécutent dans l'ordre de rang topologique, puis selon une clé de nœud sans nom. Les sorties sont mises en attente et livrées après l'exécution de tous les gestionnaires, comme dans la sémantique ASM. Renommer tous les nœuds donne la même empreinte d'état anonyme à chaque entrée. |
| Aucune perte silencieuse | Une boîte aux lettres pleine garde le message dans une file ordonnée et journalise `Backpressure`. Avec une capacité de 1 et 10 tâches, 9 entrées `Backpressure` sont journalisées et les 10 tâches se closent. |
| Les charges utiles sont dans le journal | Entrées, tics, résultats de gestionnaires externes, installations et fautes sont des entrées du journal. L'empreinte d'état après chaque entrée correspond à un repli depuis un moteur vide, sur 1 000 journaux aléatoires. |
| Horloge logique | La vivacité compte des tics, pas du temps mural. |
| Empreintes stables | SHA-256 (Secure Hash Algorithm, 256 bits) sur du JSON canonique, clés triées à chaque niveau, pour les entrées, états, formes et identifiants de règles. |

### 4.2 Les engrenages

Chaque engrenage n'est essayé que lorsque l'engrenage inférieur ne franchit pas la porte. Cet ordre est une cascade fixe, et la cascade fixe est une instance de Mixture of Limits.

| Engrenage | Méthode | Filiation |
|---|---|---|
| G0 Recherche | Une bibliothèque partagée de gestionnaires indexée par l'empreinte SHA-256 de la forme ; pour la réparation de code, localisation sur des fonctions classées | Recherche et récupération de code [21] |
| G1 Règles | Modèles de réparation déterministes et gardés et validateurs dérivés de schémas, chacun vérifié pour sa sensibilité aux mutations | PAR, TBar, AVATAR, FixMiner [22, 23, 24, 25] ; codemods comme Coccinelle [26] |
| G2 Synthèse | Énumération sur la grammaire des gestionnaires, solveurs et e-graphes | Sketching, SyGuS, egg [27, 9, 12] |
| G3 à G5 Modèles | Un modèle de décision typé, un petit modèle local, puis un modèle distant, en dernier | Cascades de modèles [28] |

### 4.3 La porte

Un candidat n'est promu que s'il franchit la porte. La porte rejoue les entrées enregistrées du nœud, exécute le candidat en ombre sur des échantillons frais avec une borne de couverture (la règle de trois à un budget d'erreur déclaré), vérifie le schéma de sortie et exige le certificat de preuve de la Section 5. Un candidat rejeté est journalisé avec son contre-exemple.

### 4.4 Reçus

Chaque promotion, refus, report et installation est une mutation dans un journal en ajout seul chaîné par SHA-256, de sorte que falsifier une entrée passée rompt la chaîne [29, 30]. Le coût de chaque gestionnaire est évalué à partir des comptes d'opérations de l'interprète avec la table de coûts de l'hôte de FGIR, le backend de code natif de flowG, et étiqueté `est_j`. Chaque appel au contremaître porte son reçu. Les exécutions de l'échelle ajoutent un compteur d'énergie du boîtier sur un sous-échantillon, étiqueté `reported_j`.

### 4.5 Le compilateur de la Forme

`rce form` prend une spécification et son ajustement et émet cinq cibles à partir d'une IR de la Forme :

```
.rce spec + fit
  lower ─► normalize ─► egg e-graph, equality saturation (+ admitted proposals)
  ─► extract (cost = est_j) ─► Form IR (typed relations, regions, rules with SHA-256 ids)
     ├─ Rust crate (pure step, typed state, SHA-256 log and fold, tests)
     │  └─ WASM (the same crate on wasm32-wasip1)
     ├─ Python (standard library only)
     ├─ XState v5 machine
     └─ SCXML document, executed by SCION
```

L'IR fixe un comportement à chaque bord numérique : le dépassement vérifié des entiers 64 bits est une erreur et ne boucle jamais ; la `/` entière tronque vers zéro ($-7/2 = -3$) ; `%` prend le signe du dividende ($-3 \bmod 2 = -1$) ; la division par zéro est une erreur ; les flottants sont IEEE 754 binary64 et un résultat non fini est une erreur ; null et absent sont distincts ; le temps est uniquement l'horloge logique. Chaque cible est générée. Aucune n'est écrite à la main.

Un gestionnaire de processus, HTTP ou fermeture n'a pas de terme, si bien que ses résultats journalisés se compilent en un oracle enregistré indexé par le SHA-256 de l'entrée canonique. `rce scan DIR --form` élève du Rust, du Python, du TypeScript et du Go existants vers le schéma de la Forme, et chaque élément élevé est étiqueté comme élévation syntaxique.

## 5. Vérification

<div id="51-five-targets-one-trace" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Tests différentiels sur cinq cibles

`tests/form_targets.rs` pilote une spécification arithmétique à onze opérateurs avec 29 événements de bord plus 500 valeurs de bord aléatoires avec graine. Les cibles générées en Rust, Python, WASM, XState et SCXML impriment la trace de référence octet par octet, y compris les bords arithmétiques. C'est du test différentiel dans la lignée de McKeeman et de Csmith [86] : l'accord entre implémentations indépendantes sur un ensemble d'entrées déclaré. Ce n'est ni de la validation de traduction [85] ni un compilateur vérifié. Il couvre les onze opérateurs et les 529 événements du test, et ne dit rien des entrées hors de ceux-ci. Les résultats Z3 et Kani ci-dessous sont la vérification.

### 5.2 Réécritures prouvées dans Z3

Les règles de réécriture vérifiées ont une filiation. Ruler infère et vérifie des règles de réécriture par saturation d'égalités sans modèle dans la boucle [87]. Les 3 règles sur 16 proposées par le modèle et admises en Section 5.5 sont donc un énoncé sur la porte, qui en a refusé 13, et non une affirmation qu'un modèle serait la meilleure source de règles.

Chaque réécriture intégrée de l'e-graphe est prouvée dans le solveur SMT Z3 (satisfiabilité modulo théories) [31] contre un encodage sans quantificateurs de l'évaluation des termes et de l'arithmétique de la Forme : valeurs comme type de données, vecteurs de bits de 64 bits avec dépassement vérifié, division et reste signés prenant le signe du dividende, et flottants binary64. Une réécriture qui modifie le dépassement, l'ordre d'escalade ou un message n'obtient pas de preuve. Une équivalence proposée n'entre dans l'e-graphe qu'avec une preuve.

### 5.3 Preuves Kani du noyau

Le noyau du moteur (chaîne d'empreintes, repli, positions sans noms et évaluation des gestionnaires) est vérifié avec le vérificateur de modèles Kani pour Rust [32]. L'évaluation des gestionnaires est le point fixe d'un pas non récursif, et Kani prouve que ce pas est total et déterministe pour chaque constructeur, par induction structurelle. Dix harnais sont vérifiés, avec 0 échec sur 505 vérifications :

| Harnais | Propriété |
|---|---|
| `chain_appended_verifies` | Une chaîne d'empreintes étendue se vérifie |
| `chain_detects_tampering` | Une entrée modifiée rompt la chaîne |
| `fold_equals_replay` | Le repli est égal au rejeu |
| `fold_rejects_wrong_state` | Un repli en désaccord avec l'état stocké est refusé |
| `position_is_name_independent` | Les positions des règles ne dépendent pas des noms des nœuds |
| `reason_tokens_are_name_independent` | Les motifs sont indépendants des noms, par jetons entiers |
| `handler_core_leaves` | Les gestionnaires feuilles sont totaux et déterministes |
| `handler_core_validate` | La validation est totale et déterministe |
| `handler_core_pipeline` | Les pipelines sont totaux et déterministes |
| `handler_core_ifhas` | Les gardes sont totales et déterministes |

### 5.4 Porte de promotion sur le certificat de preuve

L'exécution Kani écrit un certificat dont l'empreinte est stockée dans `proofs/kani.cert`. Le moteur, le journal, les identifiants de règles et l'évaluation des gestionnaires passent par le noyau prouvé, et la promotion exige le certificat.

### 5.5 Le modèle comme proposeur derrière la vérification

Un modèle peut proposer des équivalences. Il ne peut pas les admettre. Avec un modèle local de programmation de 1,5 milliard de paramètres (Qwen2.5-Coder-1.5B sous llama.cpp) sur la spécification de démonstration, le proposeur a offert 16 équivalences. La vérification en a admis 3, par essais aléatoires et une preuve Z3, et en a rejeté 13. Un proposeur déterministe de 87 identités familières en a fait admettre 9, toutes structurelles, et chaque identité arithmétique a été rejetée pour l'ordre des fautes, des non-nombres ou un dépassement.

### 5.6 Accord avec le code existant

L'élévation lit la même machine de commande à partir de fixtures Rust, Python, TypeScript et Go, exécute le code d'origine sur 40 séquences avec graine de 30 appels, et s'accorde sur les 1 200 appels par langage. Un banc d'essai figé, préenregistré avant tout résultat, a réexprimé trois programmes existants de prospection commerciale sous forme de Formes. Les Formes s'accordent avec le code d'origine sur 4 500 des 4 500 entrées enregistrées, et l'extraction abaisse `est_j` sur chacune (par exemple de $1.69 \times 10^{-8}$ J à $1.49 \times 10^{-8}$ J).

## 6. Résultats

**Méthode.** Chaque corpus est mélangé avec une graine fixe. Les 2 000 premières positions de chaque mélange, et pour L0 trois dépôts entiers (commons-lang, requests, flask), forment la partition de développement, sur laquelle les engrenages peuvent être réglés ; les résultats de développement ne sont pas rapportés. Toute tâche restante est dans la partition de test. Avant une exécution de test, le moteur est validé dans le dépôt et son empreinte binaire enregistrée, et aucun engrenage ne change pendant l'exécution. Chaque ligne de cette section est un résultat à moteur figé sur les seules tâches de test, avec 0 appel de modèle. Le préenregistrement (`PREREG.json`), les lignes par tâche et le script de rapport sont dans le [dépôt public](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

**Porte.** En L0 et L1, l'emplacement est donné et la porte est l'identité des jetons : la ligne ou l'instruction réparée doit être égale à celle du développeur, jeton pour jeton. C'est plus strict que de réussir les tests, car un correctif peut réussir une suite de tests faible et rester faux. Qi et ses collègues ont trouvé que la plupart des correctifs que GenProg annonçait comme corrections étaient plausibles mais incorrects [92] ; le surajustement aux tests est documenté dans la réparation par recherche et par sémantique [93, 94] et traité par des tests générés [95] ; les outils obtiennent de meilleurs scores sur le banc sur lequel ils ont été réglés [96] ; et la localisation des fautes biaise les comparaisons [97]. L'identité des jetons supprime l'écart de plausibilité sur ces échelons, et donner l'emplacement supprime le terme de localisation, si bien que le taux ne mesure que les engrenages de réparation. L2 et au-delà utilisent les tests comme porte et rapportent séparément les comptes plausibles et corrects (Section 8.1).

<div id="61-track-a-a-frozen-repair-corpus" class="anchor-alias" aria-hidden="true"></div>
<div id="61-track-a-a-development-repair-corpus" class="anchor-alias" aria-hidden="true"></div>

### 6.1 L0 : fautes à un seul jeton

Le corpus L0 est l'ensemble des mutants de type PIT [109] ayant un jeton de remplacement valide dans neuf dépôts réels à des commits fixés, cinq en Java et quatre en Python : 520 821 tâches de test sur 547 448. Le moteur (commit `65571d0`, engrenages G0-T et G1-J) en restaure 520 541, un taux de 0,9995 (intervalle de Wilson à 95 % de 0,9994 à 0,9995) pour une médiane de 2,3 bits de recherche. Sur les 280 non résolues, 108 sont des chiffres mutés dans des littéraux à virgule flottante et 2 se trouvent dans des littéraux d'ensemble Python. Un engrenage pour les littéraux flottants (G0-F, commit `ecfe5a1`) est testé sur quatre dépôts jamais utilisés pour le réglage (commons-text, commons-io, more-itertools, httpx) : 23 015 tâches sur 23 015, 1,0000 (0,9998 à 1,0000), pour une médiane de 2,0 bits de recherche. Les mutants tiennent lieu de fautes réelles à un seul jeton, et Just et ses collègues ont trouvé qu'ils sont couplés aux fautes réelles [110].

<div id="62-track-b-joules-per-solved-task-on-jetson-hub" class="anchor-alias" aria-hidden="true"></div>

### 6.2 L1 : bogues à une seule instruction issus d'historiques réels

L1 utilise deux jeux de données publics de corrections réelles de bogues à une seule instruction, extraites d'historiques open source. ManySStuBs4J 2.0 [107] donne 24 072 tâches de test en Java ; le moteur (commit `f2701b7`) en résout 9 288, un taux de 0,386 (0,380 à 0,392). TSSB-3M v1.0.0 [108] donne 157 089 tâches de test en Python issues des fragments 14 et 15 ; le même moteur en résout 27 266, un taux de 0,174 (0,172 à 0,175). Le moteur ne reçoit que le bloc de 7 lignes, si bien que le taux Java est un résultat sur bloc seul ; le résultat sur fichier entier est la prochaine ligne de ce tableau. Les taux par catégorie sont en Section 2.3 et les tableaux complets par strate dans le dépôt. Ces jeux de données n'ont pas de classement publié de réparation sous cette porte (bloc seul, identité des jetons, emplacement donné), donc aucun chiffre de réparation apprise n'est placé à côté ; Defects4J, qui en a un, est comparé à TBar en Section 8.1.

### 6.3 Énergie

Chaque ligne porte `est_j`, une estimation en secondes CPU multipliées par 10 W : 0,40 J par tâche résolue en L0, 0,13 sur les dépôts nouveaux, 0,10 sur ManySStuBs4J et 0,27 sur TSSB-3M. Un sous-échantillon a été lu sur RAPL [105], le compteur de boîtier intégré au processeur, sur un portable Linux équipé d'un Intel i9-13900H (nom d'hôte `jetson-hub` ; ce n'est pas une NVIDIA Jetson). Le harnais s'est exécuté sur 4 CPU fixés, et `reported_j` est l'écart du boîtier sur toute l'exécution, pilote Python compris, moins la puissance au repos issue d'un échantillon de 10 s pris juste avant, multipliée par la durée de l'exécution. Des exécuteurs d'intégration continue étaient actifs, donc le repos était de 40 W à 44 W et l'incertitude d'environ ±1 W fois la durée, soit ±10 J sur ces totaux.

| Sous-échantillon (partition de test) | Tâches | Résolues | J bruts | `reported_j` | `reported_j` par tâche résolue | Secondes |
|---|---|---|---|---|---|---|
| L0, mutants gson (avec graine, 3 000 premiers) | 3 000 | 3 000 | 648,3 | 167,5 | 0,056 | 11,8 |
| L1, ManySStuBs4J positions 2 000 à 3 999 | 2 000 | 690 | 377,2 | 17,9 | 0,026 | 8,2 |

Le sous-échantillon L1 construit son index de projet à partir de ses seules 2 000 tâches, si bien que son taux de résolution (34,5 %) est inférieur à celui de l'exécution complète. `measured_j`, un compteur mural sur un rail nommé, est vide dans chaque ligne ; son protocole est en Section 8.3.

## 7. Preuves de réutilisation

La seconde voie repose sur un fait d'ingénierie : le code est réutilisé à toutes les échelles. Chaque méthode ci-dessous le mesure différemment.

| Méthode | Source | Constat |
|---|---|---|
| Cartographie des clones au niveau fichier | DéjàVu, Lopes et al. 2017 [33] | Sur 428 millions de fichiers dans 4,5 millions de projets GitHub non dérivés, 85 millions sont uniques : « 70 % du code sur GitHub consiste en clones de fichiers créés auparavant. » En JavaScript, 6 % des fichiers sont distincts. |
| Redondance au niveau ligne | Gabel et Su 2010 [34] | Sur 420 millions de lignes, « entre 50 % et 100 % de chaque projet est redondant » à environ une ligne. |
| Modèles statistiques de langage | Hindle et al. 2012 [35] | Le code est « très répétitif, et même davantage que les langues naturelles ». |
| Quasi-déduplication du corpus | The Stack [36] | La quasi-déduplication retire 54,7 % de The Stack v1 (de 6,4 To à 2,9 To) et 52,4 % de la v2 (de 67,5 To à 32,1 To). |
| Préservation de l'archive entière | Software Heritage | Environ 30 milliards de fichiers sources issus de 445 millions d'origines, chacun stocké une fois par l'empreinte de ses octets. |
| Motifs de correction extraits | PAR, TBar [22, 23] | PAR a trouvé « plusieurs motifs de correction courants » dans plus de 60 000 correctifs humains. Les 15 catégories de motifs de TBar corrigent correctement 43 bogues de Defects4J dans la chaîne standard, et 74 sur 101 avec une localisation parfaite des fautes, sans apprentissage. |
| Tâches multilingues | Rosetta Code | 1 360 tâches, chacune un concept implémenté dans un grand nombre de 1 009 langages connus. |

Chaque ligne est une entrée du moteur. Les clones et la déduplication disent qu'un ajustement existe généralement, c'est G0. Les corrections récurrentes disent que l'adaptation est surtout un petit catalogue de réécritures gardées, c'est G1. La redondance au niveau ligne réduit l'espace de recherche de G2. Les échelons L0 et L1 le mesurent à grande échelle sur des partitions réservées (Section 6). Deux mises en garde affinent la lecture. Les doublons gonflent les scores de récupération et des modèles s'ils ne sont pas retirés [104]. Et les lignes boguées sont moins naturelles que les lignes corrigées [45], si bien que le bogue lui-même est le cas que la recherche peut le moins prédire ; c'est la forme de la correction, non la ligne boguée, que G0 et G1 doivent indexer. La lignée d'extraction de règles qui le fait à grande échelle, de la recherche générer-et-valider de GenProg [88] et du modèle de correction appris de Prophet [89] à Getafix chez Facebook [90] et à la réparation sans modèle des violations d'analyse statique par Sorald [91], dérive des modèles d'un historique disjoint et rapporte la précision sur des cas non vus [98]. C'est le standard qu'adopte la Section 8.4.

## 8. Protocoles de mesure pour la suite

Chaque protocole est fixé avant son exécution : préenregistrement validé, graines et commit du solveur enregistrés, chaque artefact conservé. La porte d'abord, les joules ensuite, les étiquettes toujours.

### 8.1 Defects4J

Defects4J contient 854 bogues Java réels actifs, chacun avec des tests qui le reproduisent [37].

1. Développer sur un sous-ensemble de 100 bogues, hors ligne, via `defects4j checkout` ; ne rapporter que des résultats réservés, sur un ensemble disjoint de 288 bogues figé avant l'exécution (`FROZEN-heldout-v1`).
2. Exécuter G0, puis G1, puis G2, puis un modèle local en dernier. Enregistrer l'engrenage qui a clos chaque bogue.
3. Porte : les tests déclencheurs et la suite complète réussissent. Rapporter séparément les comptes plausibles et corrects ; correct signifie équivalent au correctif du développeur après revue.
4. Rapporter les appels de modèle par correction correcte et les joules par correction correcte, étiquetés.
5. Points de référence : les 43 corrections correctes de TBar et ses 74 sur 101 avec localisation parfaite.
6. Contrôle de contamination : signaler chaque bogue dont la correction apparaît telle quelle dans l'index de G0, et rapporter avec et sans les bogues signalés.

### 8.2 SWE-bench Lite, hors ligne

SWE-bench Lite est un sous-ensemble de 300 tâches issues de tickets GitHub réels résolus par des tests cachés [38].

1. Utiliser le harnais Docker officiel sans réseau.
2. Première exécution : G0 et G1 seulement, zéro appel de modèle. C'est le plancher de la résolution sans modèle.
3. Seconde exécution : ajouter un modèle local comme dernier engrenage.
4. Rapporter le taux de résolution, les appels de modèle par tâche résolue et les joules par tâche résolue, étiquetés.
5. Contrôle de contamination comme en 8.1. SWE-Bench+ a trouvé que 32,67 % des correctifs réussis avaient la solution dans le texte du ticket [39].

### 8.3 Un compteur mural

1. Brancher un compteur mural ou un compteur à shunt sur l'alimentation de l'hôte, journalisé à une fréquence déclarée et avec son horloge synchronisée sur le journal d'exécution.
2. Machine au repos : exécuteurs de CI et autres compilations arrêtés, et une porte de fenêtre de calme vérifiée avant chaque bloc et enregistrée.
3. Soustraire une ligne de base de repos mesurée, et préciser la méthode.
4. Remplir `measured_j` à partir du seul compteur. Rapporter `reported_j` (RAPL) et `est_j` à côté, dans des colonnes séparées. Ne jamais additionner entre étiquettes.
5. Répéter sous le compteur les sous-échantillons RAPL de la Section 6.3, puis l'ensemble réservé de Defects4J.

### 8.4 Une exécution réservée à engrenages figés

C'est la méthode de la Section 6, étendue à de nouveaux corpus.

1. Figer G0, G1 et G2 à un commit étiqueté, enregistrer l'empreinte binaire et publier le jeu de règles avec ses horodatages de rédaction.
2. Tirer une tranche réservée disjointe : les instances Rust et Python de Multi-SWE-bench [102] et BugsInPy [103], dédupliquées par rapport à l'index de G0 [104].
3. Préenregistrer la tranche, les graines et les hypothèses avant la première exécution.
4. Rapporter séparément les comptes résolus, plausibles et identiques octet pour octet, chacun avec un intervalle à 95 %.

### 8.5 Références de base dans le même tableau

1. Sans modèle : `cargo fix` et clippy [106], et Sorald ou un portage de TBar [91].
2. Modèle bon marché : Agentless avec un modèle local [99].
3. Modèle distant : un agent avec un modèle de pointe, son énergie estimée à partir des déclarations du fournisseur et étiquetée `est_j`.
4. Rapporter le coût par réussite [101] en joules et en dollars pour chaque ligne, avec le coût contrôlé comme l'exigent Kapoor et ses collègues [100].

<div id="63-the-soaks-converge" class="anchor-alias" aria-hidden="true"></div>
<div id="64-the-soaks-converge" class="anchor-alias" aria-hidden="true"></div>
<div id="64-model-calls-in-the-first-soak" class="anchor-alias" aria-hidden="true"></div>
<div id="65-model-calls-in-the-first-soak" class="anchor-alias" aria-hidden="true"></div>

### 8.6 Convergence des appels de modèle à grand N

La promotion est le mécanisme par lequel le modèle quitte la boucle : un résolveur est payé une fois pour un cas nouveau, la porte admet l'ajustement comme gestionnaire, et tout cas ultérieur de même forme se clôt en G0 ou G1 ([Section 4.2](#42-the-gears)). La convergence est l'affirmation que les appels de modèle par tour tombent à zéro sur une spécification fixe sous un trafic réel. Elle se mesure ainsi.

1. Tirer au moins 1 000 spécifications de dépôts publics, stratifiées par langage et par taille, et figer le moteur et le résolveur avant le premier tour.
2. Rejouer un trafic de production enregistré, au moins 10 000 événements par spécification, en tours de taille fixe.
3. Enregistrer par tour : nouvelles escalades, appels de modèle, promotions, reports et joules par tâche close, chacun étiqueté (`est_j`, `reported_j`, `measured_j`).
4. Critère principal : la part des spécifications atteignant un tour à zéro appel de modèle en 20 tours, avec un intervalle de Wilson à 95 %. Secondaires : appels de modèle par tâche close par tour, et le tour du dernier appel de modèle.
5. Rapporter les spécifications qui ne convergent jamais avec leur cause (une entrée bloquée, une dépendance manquante, une intention nouvelle), et exécuter le report des entrées bloquées comme bras préenregistré.

**Proposition 8 (approche du plancher).** À mesure que la couverture de G0 et G1 croît, les joules par tâche résolue s'approchent du plancher de référence consistant à appliquer une correction connue et à exécuter les tests. Les échelons de l'échelle et l'ensemble réservé de Defects4J sous le compteur mural la mettent à l'épreuve.

## 9. Liens avec les articles compagnons

**Mixture of Limits.** [Portes de validation mesurées, Partie II](/papers/gates/#part-ii-the-cascade-mixture-of-limits) énonce la philosophie : il faut une quantité minimale de toute chose pour accomplir une tâche, et tout surplus est du gaspillage. RCE l'applique trois fois. L'ordre des engrenages exécute d'abord l'engrenage suffisant le moins cher. La promotion paie un résolveur une fois par cas nouveau, après quoi tout appel répété serait du gaspillage. L'extraction garde l'ajustement de moindres joules parmi les ajustements équivalents (Proposition 3).

**Portes de validation mesurées.** La [Partie I](/papers/gates/) dit qu'une proposition ne peut pas s'autoriser elle-même. Dans RCE, un modèle propose et la porte valide : un candidat n'entre qu'avec des tests réussis, une borne de couverture atteinte et un certificat de preuve, et chaque décision est un reçu dans la chaîne d'empreintes.

**La Loi universelle de l'agentivité.** L'[article sur l'agentivité](/papers/agency/) définit l'intelligence comme la dérivée de l'agentivité en joules, $\iota = dX/dJ$, lue a posteriori. Le journal de RCE est cet enregistrement a posteriori : $X$ est le nombre de tâches qui franchissent la porte et $J$ leurs joules, étiquetés. Un report avec reçu est la clause de refus de la porte.

**Satiété de la tâche.** [Satiété de la tâche contre effet rebond agrégé dans la demande d'IA](/papers/satiation/) dit qu'une fois le prédicat d'achèvement d'une tâche vrai, davantage de synthèse sur cette tâche n'achète rien. RCE est une satiété par tâche au sein d'un système : une fois qu'un gestionnaire couvre un cas, l'inférence supplémentaire sur ce cas est nulle. La question de la demande agrégée relève de cet article et du [compagnon économique](/papers/ai-coding-market/).

## 10. Réfutateurs

Fixés avant l'exécution réservée de la Section 8.4.

| ID | Observation | Réfute |
|---|---|---|
| RCE-F1 | Sur la tranche réservée, G0 à G2 à règles figées résolvent moins de 10 % des tâches avec 0 appel de modèle | L'affirmation que la plupart des ajustements existent déjà pour la réparation à cette échelle |
| RCE-F2 | Les correctifs identiques octet pour octet ou équivalents représentent moins de la moitié des tâches réservées résolues | La lecture de la porte comme plus que de la plausibilité sur les tâches couvertes |
| RCE-F3 | Sous le compteur mural, les joules bruts par tâche résolue du solveur RCE dépassent ceux de la référence à modèle la moins chère sur les tâches que tous deux résolvent | L'avantage en joules de la seconde voie sur les tâches couvertes |
| RCE-F4 | Dans le protocole de convergence de la Section 8.6, moins de la moitié des spécifications sans entrée bloquée atteignent un tour à zéro appel de modèle en 20 tours | Compiler le modèle hors de la boucle |

## 11. Travail à terminer

Chaque point est un travail ouvert avec son protocole nommé.

1. Résultats réservés sur L2 à L4, l'ensemble Defects4J de 288 bogues (Section 8.1), et sur L5 à L7 (Section 8.2).
2. Références de base dans un seul tableau, coût par réussite en joules et en dollars (Section 8.5).
3. Le premier `measured_j` : un compteur mural sur un hôte au repos, au moins 10 répétitions, brut et net côte à côte (Section 8.3).
4. Le résultat L1 Java sur fichier entier, avec un index d'API indexé par types comme engrenage suivant (Section 6.2).
5. L'étude des 626 langages publiée avec sa méthode (Figure 1).
6. De nouveaux corpus réservés à engrenages figés : Multi-SWE-bench et BugsInPy (Section 8.4).
7. La convergence des appels de modèle sur au moins 1 000 spécifications (Section 8.6).

## 12. Conclusion

Un programme est une machine à états fonctionnelle de base de données, et RCE traite la programmation comme une conversion d'une intention à forte entropie vers cette Forme à faible entropie. La correction est la porte et les joules sont le classement. Sur des partitions de test réservées, moteur figé et sans appel de modèle, les engrenages réparent 99,95 % de 520 821 fautes à un seul jeton et la totalité des 23 015 dans des dépôts jamais utilisés pour le réglage, 38,6 % de 24 072 bogues Java à une seule instruction et 17,4 % de 157 089 bogues Python, pour quelques centièmes de joule rapporté par tâche résolue sur un compteur de boîtier. La couche de vérification prouve les réécritures dans Z3 et le noyau dans Kani, et les tests différentiels lient cinq cibles à une trace. Il reste les échelons supérieurs, la convergence à grand N, les références de base dans le même tableau et un compteur mural. Ces protocoles sont fixés aux Sections 8.3 à 8.6 et les réfutateurs à la Section 10.

## Références
