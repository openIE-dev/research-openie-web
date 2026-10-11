<div id="satiation-and-scarcity-after-free-ai" class="anchor-alias" aria-hidden="true"></div>

*Version 1.1, 11 octobre 2026. Données et code : [research.openie.dev/data/](/data/#economics). PDF LaTeX : [/pdfs/latex/satiation.pdf](/pdfs/latex/satiation.pdf) ([source](/pdfs/latex/satiation.tex)).*

*Le compagnon économique de [Bornes thermodynamiques et tempo optimal pour des agents qui tiennent un but](/papers/agency/) et de [Portes de validation mesurées](/papers/gates/). La théorie qu'il utilise reste là-bas : la forme de la porte et $J^*$ dans [Agentivité, Section 1](/papers/agency/#1-thesis), l'arrêt machine dans [Portes de validation mesurées, Section II.5](/papers/gates/#ii5-stop-bridge-satiation), et le registre de validation dans la [Partie I](/papers/gates/#part-i-the-commit-gate-notational-intelligence). Les lectures de marché et de prix de ces articles sont rassemblées en Section 8. Son cas d'application à la programmation est [Le marché promis à mille milliards de dollars de la programmation par IA](/papers/ai-coding-market/).*

## Résumé

De nombreux modèles de planification traitent la demande d'intelligence artificielle comme si elle n'avait pas de ligne d'arrivée. La théorie du consommateur contient déjà l'objet inverse. La satiété, et le point de félicité qui lui est lié, est la région dans laquelle des unités supplémentaires d'un bien n'augmentent pas l'utilité et peuvent la diminuer (Andersen, 2001). Cet article définit un cousin opérationnel pour le travail et le soin : une boucle atteint l'achèvement de la tâche lorsqu'un prédicat de complétude énoncé est vrai, que les appels suivants ne font passer aucune clause de ce prédicat de faux à vrai, et que les appels qui défont le prédicat sont un dommage, pas une valeur. Le temps d'engagement, le nombre de tokens et le nombre de licences sont des variables différentes. Ils peuvent augmenter après la complétude.

Deux affirmations doivent rester séparées. La satiété au niveau de la tâche vaut par définition : une fois que le prédicat de complétude d'une tâche est vrai, davantage de synthèse sur cette tâche n'achète rien. La satiété agrégée est une affirmation sur la demande totale, et elle n'est pas impliquée. Une synthèse moins chère peut ouvrir de nouvelles tâches (Acemoglu et Restrepo, 2019) et augmenter l'usage total, comme un charbon moins cher a augmenté l'usage total du charbon (Jevons, 1865). Chaque corvée peut être rassasiée pendant que la demande totale de corvées croît sans limite. Cet effet rebond est le problème central d'identification de l'article. La Section 5.1 énonce deux hypothèses testables et les données qui les identifieraient.

Un second fait concerne le prix, pas la physique. Epoch AI fait état de fortes baisses du prix d'une performance d'inférence fixée (Epoch AI, 2025 ; Emberson et Roodman, 2026). Cet article appelle la situation qui en résulte gratuit à la marge, pour les corvées numériques dont le produit est de l'information et dont le test de complétude est fini. L'expression ne signifie pas que les joules sont gratuits, qu'une installation peut bouger sans certificat, ni que le travail de soin a été automatisé. La borne de Landauer est une borne inférieure sur l'effacement, pas une description des accélérateurs actuels (Landauer, 1961 ; Horowitz, 2014).

L'article ne présente ni essai randomisé, ni taux d'erreur d'un détecteur de fin, ni répartition entre l'énergie dépensée avant la complétude et l'énergie dépensée après. Ces mesures sont spécifiées et absentes. Ce que la référence logicielle fournit, c'est un endroit où placer l'arrêt : Wise Computer Automation (WCA) peut refuser pour un motif de politique ou de budget, ou sur un prédicat physique (autorisation par une table de correspondance et une vérification d'énergie, avec une fonction barrière de contrôle facultative). L'article compagnon mesure le prédicat physique sur des installations jouets. Cet article énonce le prédicat économique et les éléments de preuve effectivement publiés.

Aucun réseau de portes programmables in situ (FPGA) n'a été synthétisé ou mesuré pour cette étude. Une Alchitry Pt V2 est le dispositif sous test (DUT) prévu ultérieurement. Un instrument de navigateur qui compile la porte en WebAssembly (WASM) et l'affiche avec WebGPU est livré comme Étape B à https://research.openie.dev/living/fpga-sim/ (voir l'article compagnon). C'est une simulation, pas un résultat sur carte, et ce n'est pas ici une mesure de satiété. Les joules analytiques de l'OpCounter du compagnon ne sont pas une puissance mesurée sur carte et ne sont pas une preuve de satiété.

## Notation

| Terme | Définition dans cet article |
|------|--------------------------|
| Open Interface Engineering (OpenIE) | L'organisation qui maintient la référence logicielle et ces deux études. |
| Satiété | Dans la théorie citée, une chute de l'utilité marginale à zéro ou en dessous. Dans la clause opérationnelle de cet article, après la complétude, les appels suivants ne font passer aucune clause de `C` de faux à vrai ; les appels qui défont `C` sont un dommage, pas une valeur (Section 3.1). |
| Point de félicité | Un panier pour lequel une quantité supplémentaire du bien réduit l'utilité. Un objet de manuel. Non estimé ici. |
| Achèvement de la tâche | L'événement où le prédicat de complétude devient vrai. Orthogonal à l'échelle du modèle. |
| Complétude du travail | Un arrêt de travail énoncé : ticket fermé, correctif fusionné, rapport déposé, grand livre rapproché, ou un test écrit équivalent. |
| Complétude du soin | Un arrêt de soin énoncé : évaluation terminée, traitements rapprochés, partie destinataire informée, personne dans un état sûr, ou un test écrit équivalent. |
| Gratuit à la marge | Le prix marginal d'une étape de synthèse numérique tend vers un prix monétaire groupé ou négligeable. Les joules et les validations restent coûteux. |
| Wise Computer Automation (WCA) | La référence de validation et de refus définie dans l'article compagnon. |
| Energy-First Architecture (EFA) | Le choix de garder un prédicat d'énergie à l'intérieur de l'autorisation. |
| Table de correspondance (LUT) | Carte discrète d'autorisation utilisée par la porte de référence. |
| Fonction barrière de contrôle (CBF) | Certificat d'invariance d'ensemble, conjoint facultatif (Ames et al., 2019). |
| Model Context Protocol (MCP) | Transport d'outils. Pas un détecteur d'achèvement de la tâche. |
| System One | Décisions logicielles typées pour des ensembles d'options connus. Un proposant, pas une preuve de complétude. |
| Intelligence artificielle générale (AGI) | Un objectif large de capacité. Ni une observation de prix ni un résultat de cet article. |
| Dispositif sous test (DUT) | Matériel mesuré sous une charge de travail énoncée. Aucun n'est rapporté. |
| Réseau de portes programmables in situ (FPGA) | Logique reconfigurable. Non synthétisée ici. |
| WebAssembly (WASM) | Cible de compilation du navigateur pour l'émulateur de la porte livré en Étape B (https://research.openie.dev/living/fpga-sim/). |
| WebGPU | API GPU du navigateur, citée pour l'affichage de cet émulateur. Pas un wattmètre. |
| Alchitry Pt V2 | Carte prévue ultérieurement (fabricant : Artix-7 XC7A100T). Non mesurée. |
| Estimation analytique de l'énergie | Nombre d'opérations multiplié par une constante nommée. Modélisée. Non mesurée sur carte. |
| Effet rebond direct | Usage supplémentaire d'un service lorsque son prix effectif baisse, sur le même service (Gillingham, Rapson et Wagner). |
| Modélisé / simulé / mesuré sur carte | Formule, exécution de programme ou compteur. Les nouveaux chiffres de cet article n'appartiennent à aucune des trois classes ; son contenu empirique est la citation de séries et de documents publiés. |

### Termes utilisés ici

Le prédicat de complétude `C`, l'achèvement de la tâche, gratuit à la marge et les codes de motif de refus sont définis dans le tableau ci-dessus et en Section 3.1. La référence logicielle, la valeur de l'information, les classes de preuve et l'indicateur de résultat sur carte figurent dans le [glossaire](/glossary/) commun.

Portée. La Section 2 passe en revue la théorie de la satiété, l'automatisation des tâches, les marchés de l'attention, les éléments sur les cycles technologiques et les prix de l'inférence. La Section 3 écrit les prédicats et indique lesquels n'ont pas été estimés. La Section 4 liste les affirmations qui reposent sur des citations ou sur la démonstration logicielle du compagnon, et les sépare des règles de conception. La Section 5 répond sur l'effet rebond, les coûts du soin et la demande militaire. La Section 6 liste les menaces à la validité. La mécanique de validation et les mesures jouets se trouvent dans l'article compagnon, « Portes de validation mesurées, Partie I (Notational Intelligence) ».

## 1. Introduction

Une courbe de demande à pente positive constante en « intelligence » recommandera plus de licences, plus de tokens et plus d'agents une fois un travail terminé. Cette recommandation est un choix de modélisation. Ce n'est pas un théorème sur le travail. La théorie standard du consommateur permet à l'utilité marginale de décroître et de passer sous zéro. Si une corvée a un prédicat de complétude, la question pertinente est de savoir si davantage de sortie du modèle change ce prédicat. Si ce n'est pas le cas, la sortie supplémentaire est un coût sans gain sur l'objectif qui a été écrit.

Les éléments récents sur les prix vont à l'inverse d'une rareté de la synthèse. Les séries d'Epoch montrent que le prix monétaire d'une performance donnée sur un benchmark baisse rapidement. Les poids ouverts et les procédures de décision typées, dont System One, sont d'autres voies par lesquelles une étape de génération auparavant rare devient bon marché. Les équipes qui tarifient une corvée close comme si la synthèse était encore rare utilisent une contrainte périmée.

Les contraintes qui ne découlent pas d'une série de prix sont physiques et institutionnelles. Le calcul dissipe de l'énergie. Horowitz (2014) documente que le déplacement des données et la mémoire dominent l'énergie pratique du CMOS, à des échelles bien supérieures à la borne idéale d'effacement de Landauer. Un actionneur n'est pas un token. Une signature, une transmission clinique et un paiement ne s'annulent pas en échantillonnant un paragraphe de plus. Baumol (1967) a montré comment des secteurs à faible croissance de la productivité peuvent absorber une part croissante des dépenses. Acemoglu et Restrepo (2019) modélisent l'automatisation comme un déplacement de tâches plus la création possible de nouvelles tâches. Aucun de ces résultats ne dit qu'un modèle de langage met fin à la maladie des coûts. Ils disent en revanche que « plus de capacité » n'est pas une description suffisante de la valeur.

L'affirmation positive de cet article est définitionnelle et bibliographique. La satiété est un objet cohérent. Les prix publiés de l'inférence ont fortement baissé. Les métriques d'engagement ne sont pas des métriques de complétude. La référence logicielle peut représenter un refus pour « ne pas dépenser » et un refus pour « ne pas bouger » comme des codes de motif différents sur une même décision. L'affirmation négative est tout aussi importante. Cet article n'identifie pas de système de demande structurel, n'estime pas l'effet rebond et ne rapporte pas d'énergie mesurée sur carte.

<div id="companion-laws" class="anchor-alias" aria-hidden="true"></div>

### Articles compagnons

Cette étude est l'arrêt d'**achèvement de la tâche** dans la triade du catalogue de recherche.

| Rôle | Étude | Responsable de |
|---|---|---|
| **Navigation** | [Mixture of Limits](https://research.openie.dev/papers/gates/#part-ii-the-cascade-mixture-of-limits) | Recherche → Formule → Solveur → Modèle ; planchers, dont la valeur de l'information (VoI). |
| **Validation** | [Portes de validation mesurées, Partie I (Notational Intelligence)](https://research.openie.dev/papers/gates/) | proposer → certifier → valider\|refuser → reçu ; autorisation physique sur la porte. |
| **Achèvement de la tâche** | Cet article | Prédicat de complétude `C(z)` ; arrêt lorsque la VoI est nulle sur ce prédicat, ou lorsqu'un refus de budget ou de politique se déclenche. |
| **Budget d'énergie** | [Metabolic Intelligence](https://research.openie.dev/products/mei/) | Enveloppe du budget / actionneurs au niveau de l'étiquette et du campus. |
| **Voie d'automatisation** | [La correction orthographique est mondiale](https://research.openie.dev/papers/spellcheck/) | Une preuve d'existence qu'une partie de l'intelligence informatique se banalise jusqu'à un prix nul groupé : le coût marginal de la correction orthographique est tombé à environ zéro, et elle a complété le matériel et les éditeurs que les gens possèdent déjà. Un cadrage de l'accès, pas un recensement : le plus grand nombre (plus de 7 milliards), pas les quelques-uns qui louent des centres de données de frontière (moins de 500 millions). |

Mixture of Limits navigue. Notational Intelligence est responsable de la validation irréversible. Cet article est responsable de l'achèvement de la tâche après une inférence numérique gratuite à la marge. [Metabolic Intelligence](/products/mei/) est responsable de l'enveloppe du budget d'énergie et des actionneurs. Dans [La correction orthographique est mondiale](/papers/spellcheck/), une fois qu'un token est conservé, les candidats orthographiques supplémentaires ont une valeur de l'information nulle sur ce prédicat. Gratuit à la marge ne veut pas dire joules gratuits.

## 2. Travaux connexes

### 2.1 Satiété et points de félicité

Andersen (2001) traite la satiété dans un modèle évolutionniste du changement structurel, pas comme une préférence verbale. L'élément durable pour cet article est économique : l'évaluation marginale d'un bien peut atteindre zéro. Les points de félicité des manuels rendent la géométrie explicite. Pour un panier `x*`, l'utilité n'augmente pas dans une coordonnée au-delà de `x*`, et une représentation lisse peut y avoir une utilité marginale négative. Une illustration quadratique, `U(x) = -a (x - x*)^2` pour `a > 0`, a un maximum en `x*` et une dérivée négative au-delà. Cette fonction est un modèle utilisé pour enseigner la définition. Elle n'est pas ajustée à des journaux d'agents dans cette étude. Aucun coefficient `a` n'est rapporté.

La traduction opérationnelle exige un prédicat que le modèle ne connaît pas tant que quelqu'un ne l'énonce pas. Soit `C(z) = 1` lorsque le test de complétude écrit pour l'épisode `z` est vrai, sinon 0. La satiété sur cet épisode signifie qu'il existe un instant `t*` tel que `C` vaut 1 en `t*` et que, pour tous les appels ultérieurs, aucune clause de `C` ne passe de faux à vrai. Les appels qui défont `C` sont un dommage, pas une valeur. La Section 3.1 énonce la même règle. L'événement interne **fini économique** survient lorsque `C` devient 1 ; cet article appelle cet événement l'achèvement de la tâche. C'est une définition. Elle ne devient une affirmation empirique qu'avec un ensemble étiqueté d'épisodes et un détecteur dont les erreurs sont comptées. La Section 4 ne contient pas ce décompte.

Keynes a tracé la même ligne en 1930. Il divisait les besoins en besoins absolus, ressentis quoi que possèdent les autres, et besoins relatifs, ressentis parce que les satisfaire nous élève au-dessus des autres. Il soutenait que les besoins absolus pouvaient être satisfaits. Le prédicat de complétude est le besoin absolu d'une tâche, mis par écrit. Les désirs relatifs et ouverts n'ont pas de tel prédicat, et la Section 5.2 les tient hors de l'affirmation.

### 2.2 Tâches, déplacement et maladie des coûts

Baumol (1967) analyse la croissance déséquilibrée. Si la productivité d'un secteur augmente et pas celle d'un autre, le coût relatif du secteur stagnant augmente, et il peut dominer les dépenses même lorsque sa quantité croît lentement. La santé, l'éducation et le spectacle vivant sont les exemples habituels. Des travaux ultérieurs d'économie de la santé contestent les ordres de grandeur et les mécanismes. Cet article utilise Baumol pour une consigne négative : ne pas inférer, d'une baisse du prix du token, que le soin est devenu un bien logiciel. Le soin reste dépendant du temps, de la confiance et de la responsabilité au sens institutionnel ordinaire. Un modèle de documentation peut augmenter l'activité enregistrée, ce qui est une ambiguïté pertinente pour Baumol : la production mesurée peut bouger alors que le prédicat de soin ne bouge pas.

La littérature du travail associée à David Autor décompose les emplois en tâches que les machines peuvent ou non accomplir. L'énoncé de référence est Acemoglu et Restrepo (2019), « Automation and New Tasks: How Technology Displaces and Reinstates Labor », Journal of Economic Perspectives 33(2), https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3. Ils soutiennent que le déplacement réduit la part des tâches du travail et que de nouvelles tâches peuvent la rétablir. Un arrêt orienté vers la complétude est plus proche de l'achèvement d'une tâche que de la création d'une nouvelle tâche d'engagement. Une boucle d'agent sans arrêt peut faire monter les mesures d'activité sans gain de productivité. Cette possibilité est cohérente avec leur mise en garde contre l'automatisation faible.

### 2.3 Attention et engagement

Le livre de Wu « The Attention Merchants » (page de l'éditeur : https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/) décrit des entreprises qui récoltent l'attention et la revendent. La présentation de l'économie de l'attention par le Center for Humane Technology (https://www.humanetech.com/youth/the-attention-economy) est un résumé militant du même schéma, pas un essai. L'inférence utilisée ici est limitée. Si l'objectif d'un produit est le temps passé sur la tâche, une session qui se poursuit après `C = 1` peut paraître réussie. Si l'objectif est `C`, la même session est un gaspillage ou un dommage. Les deux objectifs ne sont pas équivalents du point de vue de l'observation dans un journal de tokens. Aucune expérience de cet article n'estime l'écart de bien-être.

### 2.4 Cycles historiques

Les marchés technologiques montrent souvent une phase spéculative, une phase d'usage et une phase ultérieure de banalisation. Les éléments sont inégaux.

Quinn (2019), « Technological revolutions and speculative finance: evidence from the British Bicycle Mania », Cambridge Journal of Economics 43(2), 271-294, https://doi.org/10.1093/cje/bey029, étudie les cours des actions de fabricants de bicyclettes de 1895 à 1900. Les cours ont monté de plus de 200 pour cent puis baissé de plus de 75 pour cent. Le résultat de l'article porte sur la finance spéculative et les fondamentaux, pas sur un prédicat mesuré de « bicyclette suffisante » pour les ménages. L'utiliser comme image de la finance en phase de course est fondé. L'utiliser comme preuve d'une satiété dans le transport ne l'est pas. Des notes antérieures de ce projet indiquaient parfois « Quinn et Turner » pour cet épisode. L'article vérifié ci-dessus est Quinn (2019). Un autre article de Quinn sur le risque d'accaparement remercie John Turner dans les remerciements. Ce n'est pas une cosignature de l'article du Cambridge Journal. Cet article cite l'article qui a été vérifié.

Les voitures, l'aviation régulière et la télévision ont des marchés de type marchandise au sens courant : véhicules d'occasion, sièges gérés par le yield management et panneaux vendus comme intrants pour le contenu. Les lignes servent d'orientation historique. Ce ne sont pas des régressions. Le yield management des compagnies aériennes après la déréglementation est une institution de tarification d'un siège, ce qui prouve l'existence d'un marché de marchandise pour les sièges, pas que la demande de voyage des passagers soit globalement rassasiée.

La fiche d'information sur le mobile du Pew Research Center (https://www.pewresearch.org/internet/fact-sheet/mobile/) est la source de saturation utilisée pour les téléphones. L'archive du projet enregistre une possession de smartphones aux États-Unis proche de 91 pour cent dans les lectures des fiches de 2024 et 2025. Qui cite le chiffre devrait ouvrir la fiche en ligne, car les fiches sont révisées. Une possession élevée est un indice de diffusion. Ce n'est pas, à elle seule, la preuve que la valeur marginale d'un autre appareil photo de téléphone est nulle.

La ligne de la corvée numérique est celle que cet article défend par une série de prix plutôt que par une analogie. Voir la Section 4.2.

### 2.5 Prix de l'inférence et poids ouverts

Epoch AI (2025), « LLM inference price trends », https://epoch.ai/data-insights/llm-inference-price-trends, fait état de baisses de prix à performance fixée de l'ordre de 9 à 900 fois par an sur les benchmarks de cette note. Emberson et Roodman pour Epoch AI (2026), « The plunging price of thought », https://epoch.ai/publications/the-plunging-price-of-thought, font état d'une baisse d'environ 47 pour cent par trimestre du coût d'une performance donnée depuis environ 2023, résumée comme environ 13 fois par an, plus rapide près de la frontière. Ce sont les résumés des auteurs sur leurs données. Cet article ne réestime pas l'indice. La lecture économique est étroite : le prix monétaire de la synthèse pour une performance mesurée fixée a baissé vite. Une baisse du prix d'offre déplace la quantité demandée si la demande est élastique. Elle ne crée pas de nouveau prédicat de complétude, et elle ne fixe pas le prix de l'énergie à zéro.

Les outils de la classe System One sont pertinents comme mécanisme d'une nouvelle baisse de prix sur des problèmes de décision à ensemble d'options connu. Un modèle System One renvoie une réponse typée et une probabilité pour chaque option autorisée en une seule passe avant, sans texte libre. TypeSafe AI a nommé la catégorie avec son modèle hébergé Jev (15 septembre 2026). Des modèles ouverts ont suivi, parmi lesquels Laya de Convai Innovations. Un modèle System One propose. Ce n'est pas une évaluation de complétude.

Une règle empirique de planification selon laquelle la compétence de frontière atteint des appareils moins chers en environ six mois n'est pas une constante mesurée dans cette archive. La distillation, la quantification et l'inférence par consultation de table (Ma et al., 2024 ; Wei et al., 2024) sont des mécanismes publiés par lesquels une compétence donnée peut passer à un matériel moins cher. La vitesse est une question empirique pour chaque paire de modèles.

### 2.6 Coût physique

Landauer (1961) borne l'effacement. Bennett (1973) montre que le calcul réversible peut éviter cette borne en théorie. Horowitz (2014) est l'énoncé pratique pour le CMOS : l'énergie par opération et l'énergie du déplacement des données fixent la contrainte de conception, à de nombreux ordres de grandeur au-dessus de `kT ln 2` pour la logique CMOS irréversible. L'OpCounter de l'article compagnon implémente `J = sum count * E` avec des constantes comme `E_LUT_READ = 1e-12` joule. Ces constantes sont un modèle. Le compagnon donne le total analytique de la graine 1, 8.6795e-10 joule, pour un épisode jouet. Importer ce nombre dans un article sur la demande ne montrerait pas que la dépense après la fin est grande. Cela montrerait seulement que le modèle de la porte jouet a renvoyé ce total. Cet article ne traite donc pas le joule du compagnon comme une mesure de satiété.

Goldman Sachs a publié une note de recherche intitulée « Gen AI: Too Much Spend, Too Little Benefit? » (https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit). L'existence d'une note importante du côté vendeur qui interroge la dépense d'infrastructure au regard du bénéfice est un fait documentaire. Les montants en dollars de la note ne sont pas cités ici. Ils n'ont pas été relus dans le PDF primaire pour ce texte, et les estimations du côté vendeur ne sont pas une comptabilité scientifique de l'énergie.

### 2.7 Les registres de validation comme interface, pas comme estimation de la demande

L'article compagnon spécifie la proposition, le certificat, le motif de refus et la décision de validation. Les modes de composition incluent l'autorisation par LUT et l'énergie, avec une CBF facultative. Les motifs de refus incluent `policy` et `budget_exceeded` ainsi que `energy_veto`. Cette taxonomie peut représenter l'achèvement de la tâche et le refus physique comme des codes différents. Représenter n'est pas identifier. Un code qui se déclenche ne prouve pas qu'un humain se trouvait à un point de félicité. Il prouve que l'environnement d'exécution a classé l'étape selon une règle que quelqu'un a installée.

## 3. Définitions et méthodes

### 3.1 Prédicats

Soit un épisode une suite d'appels de modèles ou d'outils `z_1, ..., z_T` accompagnée d'un état tourné vers les personnes. Un prédicat de complétude `C` envoie le préfixe de l'épisode sur `{0, 1}`. Exemples qui peuvent s'écrire sans score de modèle :

- Travail : les tests passent et la modification est fusionnée ; ou l'écart du grand livre est nul ; ou les champs obligatoires d'un rapport sont remplis et le rapport est déposé.
- Soin : la liste des traitements correspond à la source, le clinicien destinataire a la note, et les éléments de la liste de sécurité que l'établissement a marqués comme critiques sont vrais.

`C` n'est pas une probabilité. Un détecteur qui produit un score a encore besoin d'un seuil et d'une table d'erreurs avant d'être un prédicat au sens de l'expérience manquante de la Section 4.

L'événement interne **fini économique** à l'instant `t*` signifie `C = 0` sur le préfixe avant `t*` et `C = 1` en `t*`, pour le test choisi. Cet article appelle la couche du catalogue **achèvement de la tâche**. La satiété relativement aux appels de modèle signifie que pour tout `t > t*`, les appels supplémentaires ne font passer aucune clause de `C` de faux à vrai. Les appels qui défont `C` sont un dommage, pas une valeur. La définition ne dit pas que les humains connaissent toujours `t*`. Elle dit que, si aucun `C` n'est écrit, l'affirmation de satiété n'est pas encore un énoncé sur ce produit.

Gratuit à la marge est un énoncé sur le prix monétaire. Soit `p_t(q)` le prix du service de synthèse `q` à la date `t`. Les éléments de prix archivés indiquent que `p_t` pour une performance fixée sur un benchmark a baissé aux rythmes rapportés par Epoch. Gratuit à la marge signifie que `p_t` est assez bas pour qu'une licence par poste explique mal le coût de cette corvée. Cela ne signifie pas que l'intégrale de la puissance dans le temps est nulle.

Motifs de refus dans la référence :

```text
physical:  lut_veto, energy_veto, cbf_veto
economic:  budget_exceeded, policy
```

L'union d'ensembles, en mots : l'environnement d'exécution refuse si la règle économique se déclenche ou si la règle physique se déclenche. L'implémentation est un certificat, pas une phrase. Les détails du conjoint physique sont dans le compagnon, y compris la simulation de la graine 1 et le résidu de point fixe de Safe.

### 3.2 Ce qui a été fait dans cette étude

Cette étude est une lecture structurée. Les sources sont la colonne de citations vérifiée dans le projet du 29 au 30 septembre 2026, les notes sur la satiété et le registre logiciel du compagnon. La Section 3.3 nomme les mesures qui rendraient empirique la définition opérationnelle.

Les règles de conception de la Section 4.4 sont des recommandations conditionnelles aux définitions. Ce ne sont pas des effets de traitement estimés. Un lecteur peut rejeter une règle sans rejeter la série de prix d'Epoch, et accepter la série de prix sans accepter une recommandation de produit.

### 3.3 Mesures spécifiées et non réalisées

**Le prédicat est endogène.** Witt (2001) soutient que les désirs s'apprennent, de sorte que le prédicat de complétude $C(z)$ peut se resserrer à mesure que le prix baisse. Une étude de la satiété à travers un changement de prix doit donc figer $C(z)$ dans son préenregistrement avant le changement et rapporter tout changement de prédicat comme un traitement distinct.

**H1 peut se lire dès maintenant dans des données publiques.** Chen et ses collègues (2024) mesurent les tokens dépensés après la première réponse correcte ; Cuadron et ses collègues (2025) notent la surréflexion dans des trajectoires d'agents ; Bai, Huang et Wang (2026) constatent que l'usage de tokens pour une même tâche en programmation agentique varie jusqu'à 30 fois d'une exécution à l'autre. Appliquer a posteriori le $C(z)$ de cet article à ces trajectoires donne une estimation exploratoire de H1, étiquetée comme exploratoire. C'est la prochaine mesure.

**Tokens et joules.** H1 et H2 sont énoncées en tokens ; la thèse est en joules. Masanet et ses collègues (2020) ont constaté que le calcul des centres de données a été multiplié par environ six de 2010 à 2018 tandis que l'énergie augmentait beaucoup moins ; une élasticité en tokens n'est donc pas une élasticité en énergie. Chaque hypothèse doit être rapportée dans les deux unités, en nommant l'unité que les données identifient.

1. Compte scindé. Pour chaque épisode, sommer l'énergie analytique ou, plus tard, mesurée sur carte des appels avec `t <= t*` et des appels avec `t > t*`. L'effet rebond direct sur cette corvée n'est visible que si l'intégrale après la fin est estimée. Le dépôt ne contient pas cette scission.
2. Erreurs du détecteur. Sur un corpus étiqueté, faux terminé (prédicat déclaré vrai alors qu'une clause est fausse) et faux continuer (`C` vrai et le système continue d'appeler). Aucun taux n'est publié ici.
3. Transmission de soin. Temps jusqu'à l'état sûr et liste de transmission, mis en regard de la durée de session. Non mesuré.
4. Tableau des segments. Quels produits ont un `C` court et lesquels sont de la recherche ouverte ou des courses adverses. Non estimé. Le cas militaire est exclu de l'affirmation de satiété en Section 5 plutôt que d'y être forcé.
5. Énergie sur carte. Étape C en Annexe B. Non réalisée.

Tant que ces éléments n'existent pas, les phrases sur les « joules en trop » sont des hypothèses. Les phrases sur les prix d'Epoch sont des citations.

### 3.4 Épisodes illustratifs, pas des données

Service d'assistance. Complétude : le problème du client est résolu, la réponse est envoyée et l'état du ticket est Done. Les brouillons supplémentaires ne changent pas `C`. Un compteur de tokens peut continuer d'augmenter. L'épisode est un exemple construit pour montrer les variables. Ce n'est pas un échantillon tiré d'un service d'assistance.

Transmission de soin. Complétude : champs critiques remplis, liste des traitements rapprochée, partie destinataire confirmée, personne dans un état sûr. La durée de la session est une autre variable. L'épisode est construit. Aucun jeu de données hospitalier n'a été analysé.

Corvée de programmation. Complétude : l'artefact correspond à un oracle écrit (des tests, ou une vérification au bit près). Régénérer un artefact qui passe déjà n'augmente pas `C`. La vérification par LUT du compagnon est une instance d'oracle écrit pour une porte, pas une instance de satiété économique.

### 3.5 Chemin instrumental pour le résidu physique

Lorsqu'une affirmation porte sur des joules, la classe de mesure doit être nommée. Le compagnon définit trois étapes.

Étape A, existante : simulation en Rust et simulation Icarus Verilog. Énergie analytique seulement.

Étape B, livrée : compilation WASM du cœur de décision et vue WebGPU de la LUT et de la trace de validation, à https://research.openie.dev/living/fpga-sim/. Le temps WebGPU n'est pas de l'énergie. Le critère d'acceptation est l'accord avec l'étape A sur les épisodes publiés (graine 1 : 1 validé, 15 refusés, J analytique 8.6795e-10).

Étape C : carte programmée pour la démonstration de porte de validation du compagnon (pendule en boucle fermée avec autorisation par LUT, Safe PH et CBF de l'ensemble d'énergie d'Ames) ; énergie toujours non mesurée. L'Alchitry Pt V2 n'a pas de joulemètre embarqué. L'accord des décisions par UART n'est pas une lecture en watts. Les spécifications du fabricant sur la page de SparkFun (XC7A100T-2FGG84I, 101,440 cellules logiques, 240 tranches DSP48E1, 4,860 Kb de block RAM, 256 MB de DDR3L) ne sont pas des résultats d'énergie d'un DUT. Méthodes de mesure : guide du compagnon [/living/fpga-sim/alchitry/#energy](https://research.openie.dev/living/fpga-sim/alchitry/#energy).

Cet article ajoute une correspondance, pas une quatrième étape. L'achèvement de la tâche, s'il est codé comme `policy` ou `budget_exceeded`, devrait apparaître dans la même trace que `energy_veto`, afin qu'une scission future (Section 3.3) puisse regrouper les codes de motif. La vue du navigateur rendrait ce regroupement lisible. Elle ne créerait pas le corpus manquant. Nous n'avons ni synthétisé ni mesuré la carte FPGA.


<div id="28-fidelity-criteria-and-stop-rules" class="anchor-alias" aria-hidden="true"></div>

### 3.6 Critères de fidélité et règles d'arrêt

Shannon (1959) définit une fonction débit-distorsion : le plus petit débit de description qui maintient la distorsion attendue au niveau d'une fidélité choisie ou en dessous. L'objet est la communication sous une contrainte que l'utilisateur énonce. Ce n'est pas une courbe de demande d'intelligence. La ressemblance avec cet article est seulement structurelle. Un prédicat de complétude `C` est une fidélité dure : soit les clauses énoncées sont vraies, soit elles ne le sont pas. Une perte de modèle de langage est plus proche d'une distorsion moyenne sur une distribution d'entraînement. Une perte qui baisse, et un prix qui baisse à benchmark fixé, peuvent se lire comme un mouvement le long d'une courbe débit-ressource du type que Kaplan et al. (2020) et Hoffmann et al. (2022) estiment pour l'entraînement. Ce mouvement ne choisit pas `C` pour une corvée particulière. Confondre la distorsion d'un benchmark avec la complétude d'une corvée est l'erreur de catégorie qui se cache derrière les plans de licences illimitées pour un travail clos.

Cover et Thomas (2006) est la voie du manuel vers la théorie débit-distorsion si le lecteur veut le développement formel. L'article utilise l'existence du concept de fidélité pour tenir à part deux nombres : un score qui peut toujours être amélioré d'une fraction, et un prédicat qui est déjà vrai.

<div id="29-rebound-taxonomy-without-a-new-estimate" class="anchor-alias" aria-hidden="true"></div>

### 3.7 Taxonomie de l'effet rebond, sans nouvelle estimation

Le canon de l'effet rebond est le cadre de H2. Khazzoom (1980) a montré qu'une efficacité imposée peut augmenter l'usage du service, Brookes (1990) a soutenu la même chose à l'échelle de l'économie, et Saunders (1992) a dérivé les conditions dans la croissance néoclassique. Sorrell et Dimitropoulos (2008) ont donné les définitions microéconomiques et leurs limites. Brockway, Sorrell, Semieniuk, Heun et Court (2021) ont passé en revue les éléments et constaté que l'effet rebond à l'échelle de l'économie peut éroder plus de la moitié des économies d'énergie attendues. La satiété de la tâche ne contredit pas ce constat. C'est un arrêt par tâche, et l'effet rebond agrégé de H2 est l'endroit où s'appliquent les éléments du canon. L'éclairage est le cas historique contre lequel la tester : Fouquet et Pearson (2006) retracent sept siècles du prix et de l'usage de la lumière au Royaume-Uni, et Tsao et ses collègues (2010) constatent que l'usage de la lumière a augmenté avec l'efficacité, un service rassasiable avec un fort effet rebond.

La revue de l'effet rebond de Gillingham, Rapson et Wagner sépare des canaux qu'un slogan unique confond. L'effet rebond direct est l'usage supplémentaire du même service lorsque son coût effectif baisse. L'effet rebond indirect est la dépense des ressources économisées sur d'autres services. L'effet rebond à l'échelle de l'économie passe par les prix et la croissance. Le domaine de politique de la revue est l'efficacité énergétique, pas les tokens. La taxonomie se transfère néanmoins comme avertissement sur l'identification. Une baisse mesurée de `p_t` (affirmation S-2) n'identifie à elle seule aucun des trois canaux. Un effet rebond direct sur une corvée dont `C` est déjà vrai exige que les acheteurs continuent de payer des appels qui ne changent pas `C`. Les canaux indirect et à l'échelle de l'économie peuvent être importants lorsque de nouvelles tâches apparaissent (Acemoglu et Restrepo, 2019). Un article qui rapporterait une seule élasticité et l'appellerait « l'effet rebond » serait sous-spécifié. Cet article ne rapporte aucune élasticité.

Le schéma est ancien. Jevons soutenait en 1865 que des machines à vapeur plus efficaces augmenteraient, au lieu de la réduire, la consommation totale de charbon de la Grande-Bretagne. Alcott retrace cet argument et le débat qui a suivi (*Ecological Economics* 54(1), 2005). Nordhaus a mesuré le prix du calcul sur plus d'un siècle et constaté qu'il baissait de nombreux ordres de grandeur tandis que le calcul total augmentait (*Journal of Economic History* 67(1), 2007). Les charges de travail d'agents montrent déjà le côté de l'usage. L'équipe d'ingénierie d'Anthropic a rapporté, pour son propre système, que les agents utilisent environ 4 fois les tokens d'une interaction de chat et les systèmes multi-agents environ 15 fois (13 juin 2025). Ce chiffre est rapporté par l'opérateur, non audité. Il est cohérent avec un appétit par tâche qui augmente à mesure que les tâches changent de forme, ce que le compte scindé de la Section 3.3 doit précisément séparer du gaspillage après l'achèvement.

<div id="210-scarce-joules-and-the-economic-stop-20252026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="210-scarce-joules-and-the-economic-stop-2025-to-2026-peers" class="anchor-alias" aria-hidden="true"></div>

### 3.8 Joules rares et arrêt économique (travaux de 2025 à 2026)

Les séries de prix d'Epoch (S-2) montrent que la synthèse devient moins chère en argent. Des publications récentes sur l'énergie montrent que les joules restent rares, et souvent en croissance dans l'agrégat.

Chung, Wu, Ma et Chowdhury (arXiv:[2601.22076](https://arxiv.org/abs/2601.22076), 2026) diagnostiquent l'énergie d'inférence sur 1,858 configurations : le type de tâche à lui seul peut faire varier l'énergie d'un LLM par réponse d'environ 25× ; la génération vidéo peut dépasser l'énergie de l'image de deux ordres de grandeur. L'article de *Joule* « Energy use of AI inference, efficiency pathways, and test-time scaling » ([cell.com/joule/fulltext/S2542-4351(26)00114-5](https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5), en ligne le 22 avr. 2026) estime les requêtes optimisées à l'échelle de la frontière dans une plage médiane inférieure au wattheure, tout en rapportant que le raisonnement long et les requêtes agentiques peuvent augmenter l'énergie de plus d'un ordre de grandeur ; des gains d'efficacité de 8 à 20× sont en vue, ce ne sont pas des joules gratuits. Luccioni, Strubell et Crawford (FAccT 2025) ([doi:10.1145/3715275.3732007](https://doi.org/10.1145/3715275.3732007)) avertissent que l'efficacité sans arrêt peut amplifier la dépense totale (Jevons). La présentation de l'énergie par Epoch AI ([epoch.ai/publications/ai-energy](https://epoch.ai/publications/ai-energy), mise à jour en juil. 2026) sépare des coûts par requête modestes d'une puissance agrégée des centres de données qui double rapidement.

**Lecture pour cet article.** Gratuit à la marge est un énoncé sur le prix monétaire. Les joules rares sont un énoncé physique. L'arrêt opérationnel est l'achèvement de la tâche : lorsque `C(z) = 1`, davantage de synthèse n'élève pas l'objectif écrit, et un refus `policy` / `budget_exceeded` est un succès. [Notational Intelligence](/papers/gates/) est responsable du certificat physique. [Mixture of Limits](/papers/gates/#part-ii-the-cascade-mixture-of-limits) navigue parmi les engrenages suffisants les moins chers. [Metabolic Intelligence](/products/mei/) est responsable des actionneurs de l'enveloppe. Estimations ≠ `measured_j` mesuré sur carte.

<div id="36-protocol-for-a-done-detector-study-not-executed" class="anchor-alias" aria-hidden="true"></div>

### 3.9 Protocole pour une étude du détecteur de fin (non exécuté)

Le protocole suivant est une méthode pour une mesure future. Aucune étape n'a été exécutée. Il est écrit pour que le résultat manquant ait un critère de sortie plutôt qu'un slogan.

Population. Des épisodes tirés d'une seule surface de produit, pas un mélange de recherche ouverte et de clôture de tickets. Chaque épisode a un `C` écrit avec un nombre fini de clauses, chaque clause observable par une personne qui n'a pas utilisé le modèle. La taille visée est un choix de conception ; cet article ne prétend pas qu'un calcul de puissance a été fait. Un premier tableau utilisable a besoin d'assez de positifs et de négatifs pour qu'un taux ne soit pas une simple anecdote. L'archive ne contient pas ce tableau.

Étiquette. Deux annotateurs marquent chaque clause comme vraie ou fausse au moment où le système déclare pour la première fois avoir fini, puis de nouveau à la fin de la session. Les désaccords sont arbitrés et comptés. La décision du détecteur est enregistrée séparément de l'étiquette.

Taux primaires.

- Faux terminé : le système déclare `C = 1` alors qu'une clause critique est fausse.
- Faux continuer : toutes les clauses critiques sont vraies et le système émet d'autres appels de modèle ou d'outil.
- La durée de session et le nombre d'appels sont des covariables, pas des critères d'évaluation.

Scission secondaire, seulement si une comptabilité de l'énergie existe. Sommer l'énergie, analytique ou mesurée sur carte, des appels avant le `t*` arbitré et après lui. Énoncer la classe de mesure dans la même phrase que le nombre. Un total analytique de l'OpCounter ne remplace pas un compteur et n'est pas comparable aux tableaux de Horowitz.

Exclusion. Les épisodes sans `C` écrit ne sont pas étiquetés « non rassasiés ». Ils sont hors du champ. Les épisodes adverses sont hors du champ pour le critère de satiété et peuvent tout de même être notés pour un refus physique si un certificat est présent.

Échec du protocole. Si les annotateurs ne peuvent pas s'accorder sur les clauses, le prédicat n'était pas écrit. Si le système n'a pas d'événement de déclaration de fin, le faux continuer n'est pas identifié. Publier un classement de modèles au lieu des deux taux n'exécuterait pas ce protocole.

<div id="37-a-numerical-illustration-of-a-bliss-point-model-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

### 3.10 Une illustration numérique d'un point de félicité (modèle, pas un ajustement statistique)

Soit une coordonnée `x` le nombre d'appels de modèle sur une seule corvée, et posons

```text
U(x) = -(x - 4)^2
```

pour une corvée dont le maximum construit est à quatre appels. Alors `U(0) = -16`, `U(4) = 0`, `U(8) = -16`. L'utilité marginale est `dU/dx = -2(x - 4)`, positive avant 4, nulle en 4 et négative après. L'illustration utilise des entiers pour que le changement de signe soit visible sans ajustement statistique. Aucun jeu de données n'a servi à choisir 4. Remplacer 4 par un autre entier déplace le pic et ne change pas la définition. Une métrique de produit égale à `x` classe `x = 8` au-dessus de `x = 4`. Une métrique de produit égale à `U` fait l'inverse. L'affirmation S-3 est cette non-identité, ici dans une fonction jouet entièrement spécifiée, et en Section 3.4 dans des épisodes construits. Ni l'une ni l'autre n'est une estimation du bien-être pour une entreprise.

Un prix du token peut être ajouté sans confondre les unités. Supposons qu'un appel coûte `p` en argent et que l'acheteur paie `p * x` tandis que la valeur suit `U`. L'indicateur du surplus de l'acheteur `U(x) - p x` a encore un maximiseur fini pour tout `p >= 0`. Une baisse de `p` déplace le maximiseur, c'est la logique de l'effet rebond sur ce jouet, et le maximiseur reste fini. Le jouet ne dit pas où se situe le maximiseur pour un acheteur réel. Il bloque l'inférence selon laquelle un `p` plus bas supprime le maximum.

<div id="38-reason-codes-as-a-partition-not-a-welfare-function" class="anchor-alias" aria-hidden="true"></div>

### 3.11 Les codes de motif comme partition, pas comme fonction de bien-être

Soit `R` l'ensemble des codes de refus d'une trace. On partitionne `R` en `R_econ = {policy, budget_exceeded}` et `R_phys = {lut_veto, energy_veto, cbf_veto}`, conformément à la taxonomie du schéma. D'autres codes, s'ils sont ajoutés plus tard, doivent être affectés par écrit avant d'être comptés. Un intervalle de la trace contribue au refus économique après la fin seulement si `C` vaut déjà 1 et que le code est dans `R_econ`. Il contribue au refus physique si le code est dans `R_phys`, que `C` vaille 1 ou non. Une action dangereuse après la fin relève des deux récits et devrait être comptée dans les deux colonnes, pas moyennée. Le refus irréversible de la démonstration MCP est un exemple physique : codes d'énergie et de barrière, 0 appel à l'exécutant. Ce n'est pas un exemple de `R_econ`. Un épisode futur avec `policy` après un correctif fusionné serait l'exemple économique. Le dépôt ne contient pas cet épisode. La partition indique comment il serait noté.


## 4. Éléments de preuve

### 4.1 Affirmation S-1. La satiété est un objet économique défini

Andersen (2001), https://doi.org/10.1007/PL00003852, et la construction du point de félicité des manuels en Section 2.1 étayent S-1. L'affirmation est théorique. Ce n'est pas une fonction d'utilité mesurée pour une quelconque population d'utilisateurs dans cette étude.

### 4.2 Affirmation S-2. Les prix publiés de l'inférence ont fortement baissé à performance fixée

Étayée par Epoch AI (2025) et Emberson et Roodman (2026), avec les ordres de grandeur que ces notes énoncent (Section 2.5). L'affirmation porte sur des indices de prix que ces auteurs publient. Elle n'affirme pas que la facture de chaque organisation a été divisée par 13, et ce n'est pas une affirmation sur des watts.

### 4.3 Affirmation S-3. Les variables d'engagement ne sont pas le prédicat de complétude

Étayée par les définitions de la Section 3.1 et par la description, dans la littérature sur l'attention, des objectifs de temps passé sur la tâche (Wu ; présentation du Center for Humane Technology). Aucune estimation causale d'une perte de bien-être n'est revendiquée. L'affirmation logique est la non-identité des variables : le nombre de tokens peut augmenter pendant que `C` reste constant. Les épisodes construits de la Section 3.4 illustrent la non-identité, ce ne sont pas des jeux de données.

### 4.4 Affirmation S-4. Les cours de la bicyclomanie se sont détachés d'une histoire simple de fondamentaux

Étayée par Quinn (2019) : hausses de plus de 200 pour cent et baisses ultérieures de plus de 75 pour cent des actions de bicyclettes, de 1895 à 1900, qui ne s'expliquent entièrement ni par les fondamentaux ni par un simple déplacement du risque dans les tests de cet article. L'affirmation s'arrête là. Elle ne quantifie pas la satiété des ménages en bicyclettes.

### 4.5 Affirmation S-5. La possession de smartphones aux États-Unis est élevée dans la fiche citée

La lecture par l'archive du projet de la fiche sur le mobile de Pew est une possession proche de 91 pour cent pour les lignes 2024 et 2025. L'affirmation utilisée dans cet article est une diffusion de cet ordre, à condition que la fiche en ligne corresponde à l'archive. C'est un fait de saturation sur la possession, pas une estimation d'un point de félicité.

### 4.6 Affirmation S-6. Le cadre de Baumol ne tarifie pas le soin comme un pur bien logiciel

Baumol (1967) fournit le cadre. Acemoglu et Restrepo (2019) fournissent le langage des tâches. L'affirmation est que ces cadres n'impliquent pas la fin des exigences de travail, de confiance ou de responsabilité du soin lorsque les prix des tokens baissent. L'affirmation n'est pas une prévision des dépenses de santé.

### 4.7 Affirmation S-7. Une note du côté vendeur interroge la dépense au regard du bénéfice

La page de Goldman Sachs nommée en Section 2.6 existe et pose la question dans son titre.

### 4.8 Affirmation S-8. La référence peut coder les deux types d'arrêt

Les éléments relatifs au schéma et à la démonstration sont dans le compagnon. `policy` et `budget_exceeded` sont des codes de motif de la taxonomie des refus. `energy_veto` est démontré dans `artifacts/mcp_gate_demo.json` et dans `commit_decision_refuse.json`, où une autorisation LUT vraie refuse tout de même et met l'action de l'installation à zéro. Le cas de refus MCP n'appelle pas l'exécutant. Ce sont des faits logiciels sur la référence. Ils ne montrent pas qu'une entreprise ait réduit sa dépense après la fin.

### 4.9 Affirmation S-9. Epoch ne tarifie pas la loi physique à zéro

Landauer (1961) et Horowitz (2014) étayent un écart permanent entre une borne idéale d'effacement et la pratique CMOS. Le modèle analytique du compagnon est un troisième objet, ni la borne ni une carte. S-9 dit seulement qu'une citation d'Epoch ne dispense pas d'une citation de Landauer.

### 4.10 Règles de conception, marquées comme conception

Ces règles découlent des définitions si on les accepte et qu'on veut un produit qui optimise `C` plutôt que les tokens. Ce ne sont pas des effets.

1. Écrire `C` avant d'ajouter de la capacité de modèle.
2. Traiter comme temporaire un fossé fondé sur le prix de la synthèse lorsque des séries de type Epoch et des poids ouverts s'appliquent à cette corvée.
3. Ne pas décrire comme énergie gratuite les joules analytiques de l'étape A, les traces WASM de l'étape B ou un FPGA non mesuré.
4. Préférer un détecteur de `C` avec une table d'erreurs à une augmentation non étiquetée de la taille du modèle, dès lors que la corvée est le produit.
5. Garder l'autorisation physique sur le certificat défini dans le compagnon chaque fois que l'appel est irréversible.
6. Rapporter séparément l'énergie avant et après la fin lorsque la scission existe. Elle n'existe pas encore.
7. Ne pas appliquer le prédicat de satiété aux courses adverses ou militaires (Section 5.3).
8. Si l'objectif du produit est l'attention, le dire. Les affirmations de complétude ne s'appliquent alors pas.

Tests éliminatoires pour une feuille de route, également de conception : un plan qui suppose un appétit illimité pour une corvée à `C` court ; un prix qui exige une rareté permanente de la synthèse et aucun coin physique ou de responsabilité ; un récit de sécurité qui n'utilise qu'une chaîne de confiance ; une affirmation de « gratuité » qui supprime les joules ; une boucle d'agent sans `C`.

### 4.11 Ce qui serait un résultat et n'en est pas un

Un tableau des taux de faux terminé et de faux continuer. Une série temporelle des appels après `t*`. Une lecture de compteur sur l'Alchitry Pt V2. Une estimation structurelle de l'effet rebond. Une prime de prix de l'AGI estimée sur une corvée rassasiée. Rien de tout cela ne figure parmi les affirmations étayées de la Section 4.


### 4.12 La non-identité, énoncée comme une comparaison d'objectifs

Soit `x` le nombre d'appels, `s` la durée de session, `J_pre` et `J_post` l'énergie avant et après la fin arbitrée, et `C` le prédicat. Les implications suivantes sont définitionnelles.

| Observation | N'implique pas |
|-------------|----------------|
| `x` a augmenté | `C` a augmenté |
| `s` a augmenté | le bien-être a augmenté |
| `p` a baissé (S-2) | `J_post = 0` |
| `C = 1` | le taux d'erreur du détecteur est connu |
| un refus physique s'est déclenché (S-8) | le prédicat de complétude était vrai |
| la possession de téléphones est élevée (S-5) | la valeur marginale d'un autre appel de modèle est nulle |
| les cours des actions de bicyclettes ont flambé puis chuté (S-4) | les ménages ont atteint un point de félicité dans le transport |

La colonne de droite est la liste des inférences que cet article refuse. Chaque observation de gauche est soit une citation de la Section 4, soit une variable de la Section 3. Le tableau est la discussion comprimée en une vérification. Un texte qui affirme une phrase de droite a quitté les éléments de preuve.

### 4.13 Les grandeurs du compagnon qui restent dans le compagnon

Pour la lecture croisée seulement, le compagnon rapporte une simulation de pendule avec la graine 1 : 1 validation, 15 refus, énergie analytique 8.6795e-10 joule, et une vérification Safe avec zéro fausse autorisation face à l'oracle `Vdot <= epsilon` sur sa grille énoncée, au prix de 79 faux refus sur 209,261 décisions. Ces grandeurs répondent à une question de commande. Elles sont simulées. Elles utilisent les constantes analytiques du compagnon. Elles sont listées ici pour qu'un lecteur ne les importe pas comme affirmations S. La satiété ne les utiliserait qu'à l'intérieur de la scission non exécutée de la Section 3.3, et seulement avec la classe de mesure écrite à côté du nombre.


## 5. Discussion

### 5.1 L'effet rebond : le problème central d'identification

Trois résultats limitent l'expérience naturelle. Gundlach et ses collègues (2025) constatent que les prix à performance fixée sur un benchmark baissent vite alors que les prix de frontière ne baissent pas, et Du (2026) trouve une rupture structurelle et une prime au raisonnement dans l'évolution des prix, de sorte que les baisses de prix arrivent groupées avec des changements de modèle. L'Economic Index d'Anthropic (septembre 2025) rapporte qu'à travers les tâches, chaque hausse de 1% du coût est associée à une baisse de 0.29% de la fréquence d'usage, un chiffre transversal inélastique, pas une variation de prix dans le temps. Un dispositif au niveau d'un fournisseur ne peut pas identifier l'effet rebond au niveau du marché ; le dispositif a besoin de prix et de quantités au niveau du marché.

Gillingham, Rapson et Wagner passent en revue l'effet rebond des politiques d'efficacité énergétique. Le mécanisme est l'élasticité résiduelle de la demande. Si le prix monétaire de la synthèse baisse, l'usage augmente là où les acheteurs valorisent encore une unité de plus. À un point de félicité pour une corvée close, la dérivée directe de la valeur par rapport à davantage de synthèse sur cette corvée n'est pas positive, de sorte que l'effet rebond direct sur cette corvée n'est pas impliqué. L'effet rebond indirect, les nouvelles tâches et les déplacements de l'attention peuvent subsister. La marge des nouvelles tâches d'Acemoglu et Restrepo est un endroit où la quantité peut réapparaître. L'affirmation S-2 n'implique donc pas de plafond global au calcul. Elle n'implique un plafond que relativement à un `C` énoncé. Nier l'effet rebond global exigerait la scission de la Section 3.3 et un système de demande. Cet article ne nie pas l'effet rebond global. Il refuse de traiter « Jevons » comme une raison de ne pas écrire `C`.

Deux hypothèses rendent la question testable.

- **H1. Dépense après l'achèvement.** La fraction du calcul d'agents dépensée après `C(z) = 1`, joules ou appels avec `t > t*` rapportés à l'ensemble des joules ou appels de l'épisode, est mesurablement supérieure à zéro. H1 est le gaspillage direct que supprime l'arrêt par complétude. Elle est estimable à partir de journaux d'agents avec un `t*` étiqueté par épisode (Section 3.3, point 1).
- **H2. Jevons dans les tâches.** H2 est l'élasticité de l'effet rebond direct de Khazzoom (1980), énoncée pour les tâches. Lorsque le prix de la synthèse baisse, l'élasticité du nombre de tâches exécutées dépasse la baisse de la dépense par tâche. La dépense totale augmente alors alors même que chaque tâche est rassasiée. H2 est l'effet rebond agrégé.

**Identification.** H1 n'a pas besoin de variation de prix : un corpus étiqueté, les taux d'erreur du détecteur de la Section 3.3, point 2, et le compte scindé. H2 a besoin de variations de prix exogènes. Les baisses de prix des fournisseurs à qualité de modèle fixée, annoncées à une date connue, sont des expériences naturelles. Le dispositif est un panel de comptes avec le prix payé, les tâches ouvertes, les appels par tâche et une étiquette de complétude par épisode, avant et après chaque baisse. Comparer les comptes sur un modèle dont le prix a changé avec les comptes sur des modèles dont le prix n'a pas bougé donne une estimation en différence de différences de l'élasticité du nombre de tâches et, séparément, de la réponse de la dépense par tâche. La dépense par tâche peut baisser pendant que le nombre de tâches augmente. Les deux nombres sont nécessaires. L'arrêt par complétude est une affirmation sur le premier. Jevons est une affirmation sur le second. Aucun n'a été estimé ici.

### 5.2 Biens de statut et biens créatifs

Certains biens sont valorisés parce qu'ils ne sont pas finis : le statut, l'art ouvert, la recherche dont le `C` n'est pas une liste finie. La définition de la Section 3.1 n'impose pas de point de félicité à ces biens. Elle impose une segmentation. Une corvée finie et une pratique ouverte peuvent être vendues par la même entreprise et ne devraient pas partager une hypothèse de demande. Tarifer une corvée finie comme s'il s'agissait d'une course ouverte à la capacité est une erreur de catégorie, pas un constat sur l'AGI.

### 5.3 Demande adverse

Si le gain de l'autre partie est la perte de celle-ci, « assez » n'est pas défini par une liste locale. Les courses aux armements et certaines compétitions de sécurité appartiennent à cette classe. Les contraintes physiques de validation peuvent tout de même s'appliquer : une action dangereuse peut être refusée pendant que la demande stratégique reste ouverte. La portée fait partie de l'affirmation, ce n'est pas une note de bas de page qui l'annule.

### 5.4 Connaissance incomplète de la fin

Les gens jugent mal l'achèvement. Les détecteurs produiront des faux terminés et des faux continuer. C'est un argument pour mesurer l'erreur du détecteur, que la Section 3.3 liste comme manquante. Ce n'est pas un argument pour que la durée de session remplace `C` dans un domaine où une transmission manquée a une partie responsable. Là où aucun prédicat ne peut être écrit, l'affirmation opérationnelle de cet article se tait.

### 5.5 Baumol n'est pas résolu

Un modèle qui rédige une note plus vite peut augmenter le débit de notes et laisser l'examen, le jugement et la responsabilité à une personne. Les parts de dépense peuvent continuer de bouger comme Baumol l'a décrit si le résidu humain n'accélère pas. Dire le contraire serait une prévision que cette bibliographie ne contient pas. L'énoncé permis est S-6.

### 5.6 La synthèse gratuite n'est pas un actionnement gratuit

Les joules de l'étape A sont modélisés. L'étape B serait simulée dans un navigateur. L'étape C serait mesurée sur carte et relève de l'avenir. Une commande d'actionneur est le bit de validation du compagnon. Les prix d'Epoch se situent sur un autre axe que les trois. Les fondre dans une « IA gratuite » supprime la classe de mesure. La voie WASM et WebGPU est utile parce qu'elle permet à un tiers de rejouer la trace de décision sans posséder la carte Alchitry. L'utilité en tant que réplique n'est pas un watt.

### 5.7 La confiance n'est pas un certificat

Un score élevé peut ordonner des propositions. Les exemples de refus du compagnon montrent un bit LUT qui passe avec un prédicat d'énergie qui échoue et une action de l'installation nulle. C'est la moitié physique de l'union. La moitié économique est un motif `policy` ou de budget lorsque `C` vaut déjà 1. Aucune des deux moitiés n'est une entrée de softmax.

### 5.8 Le scepticisme du côté vendeur n'est pas une mesure

S-7 empêche une revue de la littérature d'ignorer un doute public majeur sur la dépense et le bénéfice. Elle ne permet pas à une note de recherche de remplacer un compteur ou une estimation de la demande. Si les chiffres de la note sont cités plus tard, le PDF primaire doit être la source, et l'étiquette est estimation du côté vendeur.


### 5.9 Ce qu'exigerait une estimation structurelle de la demande

S-2 est un fait sur le prix d'offre tiré de séries publiées secondaires. Une estimation de la demande est une autre régression. Elle exige au minimum une quantité (appels, tâches closes, ou les deux), un prix et un moyen de séparer un mouvement le long d'une courbe de demande d'un déplacement de la courbe. Le prix de benchmark d'Epoch n'est pas une facture au niveau d'une entreprise, et la facture d'une entreprise n'est pas `C`. Les relier exige un panel que cette étude n'a pas : des comptes qui enregistrent le prix payé, les appels effectués et une étiquette de complétude arbitrée sur le même épisode. Sans ce panel, la pente de la demande après `t*` n'est pas identifiée. Le surplus jouet de la Section 3.10 montre seulement qu'un point de félicité quadratique conserve un optimum fini lorsque `p` baisse. Ce n'est pas la régression manquante.

La segmentation appartient au même dispositif. Coder chaque produit comme `C` fini ou ouvert avant de regrouper. Regrouper un service de tickets avec un outil de recherche ouvert fait la moyenne de deux régimes de demande et peut fabriquer une apparence d'appétit illimité. L'exclusion militaire de la Section 5.3 est la même règle appliquée à un domaine où l'objectif de l'adversaire empêche un point de félicité local. Un tableau avec ces codes, même sans prix pour l'instant, serait plus informatif qu'un seul chiffre de marché total adressable. Le tableau n'a pas été construit.

### 5.10 Pourquoi aucun multiple de `kT ln 2` n'est énoncé

Le résultat de Landauer est une inégalité pour un effacement idéalisé à la température `T`. Horowitz (2014) rapporte des énergies pour des opérations CMOS particulières et pour le trafic mémoire, en picojoules, sous les hypothèses de ce tutoriel. Diviser l'une par l'autre ne produit un nombre qu'après que quelqu'un a choisi l'opération, le facteur d'activité, la température et le composant. Aucun de ces choix n'a été mesuré sur une charge de travail OpenIE. Les constantes du compagnon, à commencer par `1e-12` joule par lecture de LUT, ne sont pas les nombres de Horowitz et ne sont pas un décompte de bits effacés. Énoncer un multiple au-dessus de la borne de Landauer reviendrait à prétendre que ces choix ont été faits. L'énoncé scientifique est le sens de l'inégalité : le CMOS irréversible pratique, dans le récit de Horowitz, se situe très au-dessus de la borne, et un indice de prix ne déplace aucun composant jusqu'à la borne.


## 6. Limites et menaces à la validité

Validité de construit. La satiété opérationnelle dépend de `C`. Un `C` hostile ou vague rend le prédicat arbitraire. La défense de l'article consiste à exiger que `C` soit écrit en clauses observables. Beaucoup de produits réels n'ont pas encore cette écriture. Pour ces produits, la théorie ne s'applique pas encore empiriquement.

Validité interne de l'affirmation de prix. S-2 hérite de l'identification utilisée par Epoch (ajustement de la qualité, choix des benchmarks, prix affichés contre factures réalisées). Cet article n'a pas audité les microdonnées. Une révision des séries d'Epoch réviserait les ordres de grandeur de S-2 et pourrait ne pas en réviser le sens. S-2 devrait être relue à la lumière des pages primaires avant d'être utilisée comme chiffre de direction.

Validité externe. Le travail et le soin, tels que définis, excluent la rivalité militaire et peuvent exclure la recherche. La possession de téléphones ne se transfère pas aux produits d'agents. Les cours des actions de bicyclettes ne se transfèrent pas aux marges du logiciel. Les épisodes construits ne sont pas un échantillon.

Validité de la mesure. Pas de joules scindés, pas de matrice de confusion du détecteur, pas de DUT. Les décomptes de fausses autorisations du compagnon portent sur un oracle de pendule, pas sur l'achèvement de la tâche. Les importer comme preuve de satiété serait une erreur de catégorie. Les spécifications de FPGA du fabricant ne sont pas de l'énergie.

Variable omise. De nouvelles tâches peuvent absorber la dépense libérée par une synthèse bon marché. La Section 5.1 l'énonce. Une feuille de route qui traite la satiété par corvée comme une prévision de la demande agrégée de calcul n'est pas autorisée par cet article.

Biais de publication et type de document. Wu est un livre. La page de Humane Technology relève du plaidoyer. Goldman Sachs relève du côté vendeur. Quinn, Epoch, Baumol, Acemoglu et Restrepo, Landauer et Horowitz sont les citations porteuses, et elles étayent des phrases différentes. La structure de l'article est une tentative d'empêcher que ces phrases soient moyennées en une humeur.

Réfutateurs. S-1 échoue si la théorie citée ne contient pas de région d'utilité marginale nulle. Elle en contient une. S-2 échoue si les pages primaires d'Epoch ne rapportent pas de baisses de ce type. S-8 échoue si le schéma n'a pas de codes de motif économiques ou si le JSON cité ne refuse pas. Un futur corpus étiqueté dans lequel des appels supplémentaires après un `C` correct élèvent systématiquement une valeur spécifiée indépendamment réfuterait la satiété pour ce corpus. Un tel corpus ne réfuterait pas la définition. Il en bornerait le domaine.



La même discipline s'applique aux spécifications de FPGA du fabricant. SparkFun liste les cellules logiques, les tranches DSP, la block RAM et la capacité de DRAM de l'Alchitry Pt V2. Ces grandeurs décrivent une pièce de catalogue. Elles ne décrivent ni l'activité de commutation, ni la puissance statique, ni l'énergie d'une trace de validation. Un rapport ultérieur sur le DUT doit nommer le bitstream, l'horloge, la charge de travail, le compteur et la durée. Tant que ce rapport n'existe pas, la carte est un instrument prévu, et l'émulateur du navigateur est une réplique prévue de la décision logicielle, pas un aperçu du compteur.

## 7. Conclusion

La satiété est un objet standard dans la théorie citée, et elle a une forme opérationnelle étroite : un prédicat de complétude écrit que la synthèse supplémentaire ne fait pas avancer. Les séries publiées d'Epoch documentent une forte baisse du prix monétaire de l'inférence à performance fixée. Cette baisse étaye une description des corvées numériques comme gratuites à la marge et n'étaye ni des joules gratuits, ni un mouvement gratuit de l'installation, ni la fin de la structure de coûts du soin. Les cours des actions de bicyclettes, la diffusion des smartphones et les marchés de l'attention sont plus faibles et plus forts de la manière précise qu'énonce la Section 4. La référence de validation peut stocker un refus économique et un refus physique comme des motifs différents. Le côté physique est simulé dans le compagnon et n'est pas mesuré sur carte. Un émulateur WASM et WebGPU reproduit la trace dans un navigateur à https://research.openie.dev/living/fpga-sim/ et reste une simulation. Un compteur sur l'Alchitry Pt V2 serait une mesure différente et ultérieure. Les objets scientifiques manquants sont un détecteur de fin étiqueté, une scission de l'énergie avant et après la fin, et une estimation de la demande capable de voir l'effet rebond. Tant qu'ils n'existent pas, le contenu empirique de l'article est le corpus cité, et son contenu formel est le prédicat.

## 8. Prix et marchés tirés des articles de théorie

Les articles de théorie classent par joules jusqu'à l'achèvement correct et gardent les prix hors du classement. Leurs lectures de marché et de prix sont rassemblées ici, et les sections d'origine y restent comme ancres.

### 8.1 Séries de prix

*Tiré de [Portes de validation mesurées, Section I.2.3](/papers/gates/#i23-scale-and-hardware-fit).* Epoch AI (2025) rapporte des baisses du prix de l'inférence de l'ordre de 9 à 900 fois par an à performance fixée sur un benchmark, selon le benchmark. Emberson et Roodman (2026) rapportent une baisse trimestrielle d'environ 47 pour cent du coût d'une performance donnée depuis environ 2023, qu'ils résument comme environ 13 fois par an, avec une baisse plus rapide près de la frontière. Ce sont les résumés publiés d'Epoch. Ce sont des éléments sur le prix. Ce ne sont pas des preuves que les joules ou les validations irréversibles sont devenus gratuits. Portes de validation mesurées les utilise seulement pour séparer le coût de la proposition de l'autorisation. Cet article utilise les mêmes séries pour l'argument de demande des Sections 2.5 et 4.2.

### 8.2 L'arrêt économique

*Tiré de [Portes de validation mesurées, Section II.5](/papers/gates/#ii5-stop-bridge-satiation).* Les prix de l'inférence numérique peuvent tendre vers la gratuité à la marge sans impliquer une énergie gratuite, un actionnement gratuit ou une valeur illimitée une fois une corvée accomplie. Cet article définit la satiété comme un arrêt sur un prédicat de complétude écrit et cite les séries de prix publiées. Mixture of Limits fournit l'arrêt machine qui correspond à cette intuition économique.

### 8.3 Dépense de plateau et dollar par appareil

*Tiré de [Portes de validation mesurées, Section II.8.12](/papers/gates/#ii812-hardware-plateau-spend-on-real-devices).* Le logiciel est de l'ingénierie humaine appliquée sous motivation économique et de survie, pas un domaine détaché du coût, du rendement de fabrication et des joules. Les marchés récompensent la dépense de plateau qui extrait plus de travail par dollar d'appareil : algorithmes optimisés, routage par mélange d'experts, co-conception des systèmes d'entraînement et astuces d'inférence sur des accélérateurs plus anciens ou moins chers. Mixture of Limits est la règle de navigation qui lie cette dépense à des planchers lorsque davantage de travail n'achète rien.

### 8.4 La tendance des prix dans la thèse commune

*Tiré de la thèse commune, qui n'énonce plus que la forme de la porte.* Une tendance des prix est une affirmation distincte, étiquetée comme telle. Epoch AI rapporte que le coût d'un niveau donné de performance de l'IA a baissé d'environ 47 pour cent par trimestre depuis 2023, soit environ 13 fois par an (Emberson et Roodman, *The plunging price of thought*, 22 septembre 2026). Si cette tendance se poursuit, l'énergie devient le coût marginal dominant de l'inférence. C'est une tendance citée assortie d'une condition, pas un effondrement mesuré. [La correction orthographique est mondiale](/papers/spellcheck/) est une preuve d'existence qu'une partie de l'intelligence informatique se banalise jusqu'à un prix nul groupé.

### 8.5 Tarification des succès de cache

*Tiré de [Portes de validation mesurées, Section II.8.13.1](/papers/gates/#ii8131-transmission-attention-kv-cache-and-interconnect-cost).* L'API publique de DeepSeek tarifie `deepseek-flash` (servi en tant que DeepSeek-V4.1-Flash) avec un grand écart entre l'entrée en succès de cache et l'entrée en échec de cache (p. ex. succès de cache en heure de pointe \$0.006 contre échec de cache \$0.3 par 1M de tokens d'entrée ; [api-docs.deepseek.com/quick_start/pricing](https://api-docs.deepseek.com/quick_start/pricing)). Une discussion sur Hacker News relève des sessions qui perdent le cache de préfixe vers ~60% d'une fenêtre de contexte et paient soudain ~50× plus ([news.ycombinator.com/item?id=49735410](https://news.ycombinator.com/item?id=49735410)). C'est une anecdote d'opérateur, pas une mesure OpenIE. Lien avec Mixture of Limits : la réutilisation bon marché du cache est la transmission suffisante la moins chère ; lorsque la réutilisation se rompt, la dépense escaladée reste un coût du corridor génératif, pas un refus certifié. Une longue session est tarifée selon que son préfixe survit, pas selon que sa tâche est achevée. Le prix peut sauter alors que le prédicat de complétude reste faux, et il n'achète rien une fois le prédicat vrai.

## Références

## Annexe A. Règles de décision et non-résultats

| Id | Énoncé | Classe |
|----|-----------|-------|
| R1 | Écrire le prédicat de complétude avant d'ajouter de la capacité. | Conception |
| R2 | S'attendre à ce que les fossés fondés sur le prix de la synthèse s'érodent là où s'appliquent des éléments de type Epoch. | Conception, conditionnelle à S-2 |
| R3 | Ne pas revendiquer d'énergie gratuite ni d'actionnement gratuit. | Contrainte tirée de S-9 |
| R4 | Séparer les codes de motif économiques des codes de motif physiques. | Fait logiciel, S-8, plus conception |
| R5 | Publier les taux d'erreur du détecteur avant de traiter un arrêt comme exact. | Pas encore un résultat |
| R6 | Scinder l'énergie avant et après la fin. | Pas encore un résultat |
| R7 | Garder les courses adverses hors de l'affirmation de satiété. | Portée |
| R8 | Relire les sources primaires de Pew et d'Epoch avant de citer un ordre de grandeur plus fin. | Méthode |

Aucune ligne ci-dessus n'est une mesure sur carte.

## Annexe B. Reproductibilité et émulateur

Cet article n'a pas de binaire propre. Reproduction des faits logiciels cités :

```text
cargo run --release --bin wca-mcp-gate -- --demo
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

Résultat attendu, d'après les journaux enregistrés du compagnon : refus de la démonstration avec 0 appel à l'exécutant ; graine 1 avec 1 validé, 15 refusés, énergie analytique 8.6795e-10 joule. Ces sorties n'estiment pas la satiété.

Instrument de navigateur, livré comme Étape B à https://research.openie.dev/living/fpga-sim/, partagé avec l'Annexe B du compagnon. Le cœur de décision s'exécute en WASM. WebGPU peint l'image de la LUT et la trace de validation. Comparer la trace au JSON de Rust. Ne pas convertir les horodatages GPU en joules. Ne pas marquer l'Alchitry Pt V2 comme mesurée. Page du fabricant : https://www.sparkfun.com/alchitry-pt-v2.html. La synthèse plus un compteur constitue l'Étape C, une étude ultérieure.

Indicateur factuel du dépôt : aucun résultat sur carte FPGA revendiqué.

## Annexe C. Carte des affirmations

Étayées maintenant : S-1 à S-9, avec les phrases de portée de la Section 4.

Non étayées : une fin de la maladie des coûts de Baumol ; un mouvement gratuit de l'installation ; la satiété de la demande militaire ; un effet rebond global numérique nul ; un fonctionnement d'un modèle de langage à l'échelle de Landauer ; des watts sur carte ; un prix de l'AGI comme fait sur des corvées rassasiées ; un délai universel de distillation ; un leadership de performance du silicium.

Mesures ouvertes : Section 3.3.
