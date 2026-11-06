---
title: "Le Reality Code Engine : une Forme sans perte pour une programmation native, vérifiée et sobre en énergie"
deck: "Un système de programmation dans lequel un programme est écrit une fois comme une machine à états et le code dans d'autres langages en est généré : sa spécification, le vérificateur de référence et ses émetteurs, les preuves en Lean et des mesures enregistrées de la dimension des programmes, avec des protocoles et des réfutateurs fixés à l'avance."
lang: "fr"
source: "rce"
complete: true
---


*Version 1.24, 28 octobre 2026. Spécification : [brouillon actuel (brouillon 0.9)](/rce/spec/), provenant de [openIE-dev/rce](https://github.com/openIE-dev/rce); les comptes des vérifications exécutées dans [§3.7](#37-the-language-one-text-costs-and-theorem-status) se trouvent dans les commits publics mentionnés là, et ceux à `e416fd0` sont enregistrés dans [`src/data/rce-facts.json`](https://github.com/openIE-dev/research-openie-web/blob/dcharlot65-openie/src/data/rce-facts.json). Données et code : [research.openie.dev/data/](/data/#rce). Terrain d'expérimentation (vérificateur de référence) : [openie-dev.github.io/rce](https://openie-dev.github.io/rce/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

Cet article décrit le Reality Code Engine (RCE), un système dans lequel un programme est écrit une seule fois sous forme d'une machine à états, appelée une Forme, et du code dans d'autres langages est généré à partir de celle-ci. Il présente la spécification écrite du langage, le vérificateur de référence qui l'implémente et génère du Rust, du Python, du JavaScript et du Scala (la sortie en Scala ne correspond pas encore au référentiel), les preuves en Lean de ses théorèmes, les mesures enregistrées de la dimension de ses programmes, la conception de l'engin qui trouve, vérifie et réutilise des solutions, et la conception par laquelle chaque langage doit être importé dans la Forme et généré à partir d'elle. Il indique comment les affirmations pourraient être prouvées fausses et les protocoles des mesures encore à effectuer.

**En mots simples**

1. Un programme est écrit une seule fois, sous une forme précise, et l'ordinateur produit aujourd'hui le même programme à partir de celle-ci en Rust, en Python et en JavaScript. La conception vise tous les langages ; les outils qui convertiraient d'autres langages ne sont pas encore construits.
2. Tout ce qu'un programme peut faire est déclaré dans sa forme, et le langage exige que chaque entrée ait un résultat déclaré, une étape ou un refus enregistré, plutôt qu'un résultat indéfini trouvé et corrigé plus tard.
3. Dans la conception de l'engin, une correction qui passe les vérifications est sauvegardée et réutilisée, afin que le même problème ne coûte pas de temps ou d'énergie deux fois.
<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. Thèse

L'automatisation informatique autonome est un espace de conception avec de nombreux points en son sein. Chaque approche se situe quelque part le long de cinq axes continus : l'énergie dépensée par résultat correct ; l'entropie que le système doit résoudre en temps d'exécution, et ainsi la déterminisme de sa sortie ; la force de la vérification qui accepte un résultat ; la distance à laquelle chaque résultat accepté est réutilisé et composé ; et la mesure dans laquelle l'approche dépend d'un modèle. Un grand modèle de langage (LLM), un modèle statistique de texte, qui écrit chaque modification à partir de la demande se trouve près d'un coin de cet espace : il dépend du modèle pour chaque tâche, tire un échantillon frais à partir d'une distribution à haute entropie à chaque fois, et paie à nouveau pour la génération à chaque tâche. La récupération, les règles, la synthèse, la vérification et le stockage occupent de nombreux autres points, et les systèmes réels les combinent.

Le moteur de code Réalité (RCE) est un point de cet espace. Cet article le décrit, et les mesures qu'il rapporte concernent son langage et les outils de ce langage. RCE modélise un programme comme une machine d'états fonctionnelle de base. Lopes et collègues ont mesuré que environ 70 % du code sur GitHub consiste en des copies de fichiers antérieurs [33], donc la conception du moteur RCE commence par la récupération d'une solution existante, l'adapte et la vérifie, et appelle un modèle uniquement lorsque rien de moins coûteux ne termine la tâche.

**La revendication centrale.** RCE est conçu comme un écosystème complet de code dans lequel les programmes sont rédigés nativement à partir d'une intention. L'intention est écrite une seule fois, sous forme de Forme : un état, un ensemble d'événements et une transition pure et totale. La Forme est une encodage sans perte de cette intention. RCE est conçu de telle sorte que chaque langue cible est une projection de la Forme, et chaque projection doit rejouer le tracé de la Forme octet par octet. Aujourd'hui, le vérificateur de référence a quatre émetteurs, pour Rust, Python, JavaScript et Scala, qui traduisent l'arbre de syntaxe vérifié d'un programme plutôt que la Forme ; les sorties Rust, Python et JavaScript passent chacune 1 459 tests de conformité avec 0 échec, et la sortie Scala ne correspond pas encore à la référence ([§4.5](#45-the-compilers)). Chaque état dans lequel un programme peut se trouver est déclaré dans sa Forme, et la langue exige que chaque entrée ait un résultat déclaré : une étape qui la prend, ou un refus par son contrat qui ne modifie pas l'état et est enregistré dans le journal (T8). Un programme qui répond à ces exigences ne peut pas s'éloigner de son intention comme un programme dans une langue commune s'éloigne de ses commentaires, ses tests ou ses autres implémentations, et il n'a pas besoin de diff après le fait ou de suivi d'erreurs. Le contrat d'entrée qui rend le vérificateur de référence respecter la deuxième exigence est listé dans [§10](#10-work-to-finish). Dans la conception du moteur, chaque solution que la porte applique est stockée et réutilisée, donc l'écosystème s'accumule à mesure qu'il grandit ([§2.4](#24-gated-verified-recursive-self-improvement)). Le code écrit dans d'autres langues est conçu pour entrer par élévation ([§6](#6-lift-entering-the-ecosystem-from-other-languages)). L'élévation publique unique aujourd'hui est une sonde pour un motif Go ; éléver chaque langue dans la Forme et émettre chaque langue à partir de celle-ci est l'objectif d'une proposition dans le dépôt de spécification, dont les niveaux d'acceptation indiquent quand une langue est considérée comme élévée ou émise ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)).

Chaque point de l'espace fait face à la même porte. La porte est la correction : le prédicat de complétude d'une tâche $C(z)$, ici les tests de la tâche, une preuve ou une trace d'accord. Parmi les exécutions qui passent la porte, les systèmes sont classés par joules jusqu'à l'achèvement, $J^*$. La correction est une contrainte, pas un score.

Dans la conception du moteur, les mécanismes de RCE, appelés engrenages, s'exécutent dans l'ordre du coût, et le premier engrenage dont le candidat passe la porte termine la tâche.

Les chiffres d'énergie sont étiquetés par leur source. `est_j` est une estimation analytique. `reported_j` est un compteur du système d'exploitation ou sur puce. `measured_j` est réservé à un mètre mural et est vide dans chaque résultat ici. RCE n'a aucun chiffre d'énergie mesuré : le vérificateur de référence ne calcule aucun joule, ses unités de budget comptent le travail et ne sont pas de l'énergie, et chaque `est_j` dans cet article est un modèle. Un coût sans modèle est étiqueté comme non tarifé et n'est jamais lu comme zéro ([§4.4](#44-receipts)).
<div id="2-the-design-space-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

## 2. L'espace de conception du codage autonome

![Une phrase en entrée. Un étage en sortie. L'intention humaine est à haute entropie ; un funicule de conversions de l'intention à la spécification à 626 langues de surface à une représentation intermédiaire à du code machine perd de l'information à chaque frontière ; tout code atteint quelques formes de machine ; RCE écrit le sens une fois dans une forme canonique, est conçu pour traiter chaque langue de surface comme une projection (aujourd'hui Rust, Python et JavaScript passent le test de conformité et Scala ne le fait pas encore) et pour permettre à la forme correcte la moins coûteuse de gagner.](/figures/rce/intent-entropy.svg)

*Figure 1. Entropie de l'intention et le sol de la machine. Une [copie PNG](/figures/rce/intent-entropy.png) est fournie. Le panneau 6 énonce la conception de RCE ; ce qui existe aujourd'hui est indiqué dans [§4.5](#45-the-compilers). Sources : Shannon (1951) ; Lopes et al. (2017) ; le décompte de 626 langues est une enquête non publiée par les auteurs d'OpenIE et ne soutient aucune revendication dans cet article. Les résultats de Python et de C sont le comportement des spécifications de langage ; le débordement signé en C est un comportement indéfini.*

**L'intention est à haute entropie.** « Rendre le paiement plus rapide » porte de nombreuses significations : une charge de page plus courte, moins d'étapes, une approbation de carte plus rapide, un panier mis en cache, ou plus rapide sur une classe d'appareils. Le contexte est implicite et jamais écrit. Shannon a mesuré l'anglais imprimé à environ 0,6 à 1,3 bits par lettre [1]. Les lettres sont prévisibles. Le sens ne l'est pas.

**Chaque conversion perd de l'information.** L'intention devient une spécification, et le contexte est perdu. La spécification devient l'une des centaines de langues de surface, et les alternatives et les cas limites sont perdus. La source devient une représentation intermédiaire (IR), et les noms, le style et les raisons de l'auteur sont perdus. L'IR devient du code machine, et les types deviennent des tailles et les boucles deviennent des sauts.

**Le sol est à faible entropie.** Chaque programme se termine par des chargements, des stockages, des opérations arithmétiques et des sauts. La destination n'a de place que pour quelques formes, donc le code se courbe vers elles. La convergence est par conception.

**Les frontières sont là où le sens diverge.** La même ligne donne des réponses différentes aux extrémités. En Python, `-3 % 2` est 1 et `-7 / 2` est -3,5. En C, `-3 % 2` est -1, `-7 / 2` est -3, et le débordement signé est indéfini. Un système qui régénère le code à chaque frontière devine à chaque frontière.

**Les axes, exprimés en termes de quantités.**

| Axe | Une extrémité | L'autre extrémité | Où se situe la conception de RCE |
|---|---|---|---|
| Énergie par résultat correct | Répayée en totalité à chaque tâche | Répayée une fois par nouveau cas, puis le sol du gestionnaire | Au sol pour les tâches couvertes |
| Entropie résolue à l'exécution, et déterminisme | La distribution complète de la demande, un échantillon frais à chaque fois | Seulement le résiduel, aucune solution stockée, une sortie déterministe | Seulement le résiduel ; chaque projection déterministe |
| Force de vérification | Sortie acceptée à l'inspection | Tests, couverture et un certificat de preuve | La porte complète sur chaque résultat |
| Réutilisation et cumul | Chaque résultat utilisé une fois | Chaque solution acceptée stockée et réutilisée | Chaque solution à laquelle la porte s'applique est stockée |
| Dépendance au modèle | Un modèle à chaque tâche | Aucun modèle | Un modèle uniquement comme dernière roue dentée |

Les approches diffèrent par degré sur chaque axe, et les axes interagissent : la réutilisation réduit l'énergie et l'entropie restante à résoudre, et une vérification forte est ce qui rend la réutilisation sûre. RCE écrit le sens une fois, dans une forme canonique. Dans sa conception, chaque langue de surface est une projection de cette forme, vérifiée pour correspondre à celle-ci, et parmi les formes équivalentes, celle qui est la moins coûteuse et correcte s'exécute ; quatre langues sont générées aujourd'hui ([§4.5](#45-the-compilers)).

La figure 2 trace les cinq axes et place les principales classes d'approches sur ceux-ci.

![Diagramme radar avec cinq axes : énergie par résultat correct, déterminisme, force de vérification, réutilisation et cumul, et indépendance des modèles. Cinq classes d'approches sont représentées sous forme de polygones. Un modèle sur chaque tâche se situe près du centre sur tous les axes. Un boucle d'agent verrouillée par des tests est plus élevée en termes de vérification. Un modèle avec récupération et mise en cache est plus élevé en termes de réutilisation. La synthèse et la réparation classiques sont élevées en termes de déterminisme et d'indépendance des modèles. RCE, marqué par des étoiles, se situe à ou près de l'anneau extérieur sur tous les cinq axes. Les positions sont qualitatives.](/figures/rce/design-space.svg)

*Figure 2. L'espace de conception du codage autonome. Diagramme qualitatif : chaque classe d'approche est placée selon la lecture du paragraphe 2 par le papier sur des niveaux ordinaux, et non par mesure. La dépendance au modèle est représentée comme l'indépendance des modèles afin que l'extérieur soit meilleur sur chaque axe. Une [copie PNG](/figures/rce/design-space.png) est fournie.*
<div id="21-programming-is-coding-theory" class="anchor-alias" aria-hidden="true"></div>

### 2.1 La programmation est la théorie du codage

La thèse de cette section est que la programmation peut être lue comme la théorie du codage. Un programmeur convertit l'intention le long d'un gradient entre deux régimes entropiques. L'intention est une haute entropie, une distribution sur les significations. Le code est une basse entropie, une transition déterministe par état. Chaque étape du travail logiciel, de la demande à un registre, est une étape de cette conversion. La littérature l'a dit en morceaux pendant soixante-dix ans, dans de nombreuses langues. Cette section assemble les morceaux en un seul argument et place chaque engrenage RCE dessus.

**La mesure.** Shannon a défini l'entropie d'une source et la capacité d'un canal [40], et a mesuré l'anglais imprimé à environ 0,6 à 1,3 bits par lettre [1]. Kolmogorov, écrivant en russe dans *Problemy Peredachi Informatsii* en 1965, a donné trois approches à la quantité d'information et a fait de l'approche algorithmique la principale : l'information dans un objet est la longueur du plus court programme qui le produit [41]. Solomonoff a atteint le même objet comme une théorie de l'inférence inductive [42], et Chaitin a montré que la taille du programme obéit à des identités formellement identiques à celles de Shannon [43]. Rissanen a transformé l'idée en une règle pour choisir des modèles, la longueur de description minimale [44]. Ensemble, ils disent qu'un programme est un mot de code : une description d'un comportement, et le plus court correct est le plancher. La règle d'extraction RCE, garder le terme le moins joule parmi les termes équivalents (Proposition 3), est cette règle avec des joules à la place des bits.

**Le code se situe dans le régime à faible entropie, et les gens l'ont mesuré.** Hindle, Barr, Su, Gabel et Devanbu ont trouvé que le code est « très répétitif, et en fait même plus que les langues naturelles », à une entropie croisée plus basse sous les mêmes modèles n-gram [35]. Gabel et Su ont trouvé que la plupart des lignes d'un projet existent déjà ailleurs [34], et Lopes et al. ont trouvé que la plupart des fichiers sur GitHub sont des clones [33]. Tu, Su et Devanbu ont trouvé que le code est aussi local : ce qui a été écrit à proximité prédit ce qui vient ensuite [46]. Ray et collègues ont trouvé que les lignes défectueuses sont moins naturelles, avec une entropie plus élevée, et que l'entropie diminue lorsque le bug est corrigé [45]. En 2025, Yang, Kolak, Hellendoorn et Martins ont utilisé le changement d'entropie induit par un patch pour classer les candidats de réparation et séparer les corrects des surajustés [51]. Allamanis, Barr, Devanbu et Sutton ont fait une revue du domaine sous le nom de naturalité [47]. Le résultat n'est pas seulement un anglophone. Prem Devanbu l'a formulé comme un discours clé à la Conférence Indienne d'ingénierie logicielle en 2013 [50]. Sridhara, Sinha et Mani à IBM Research India ont mesuré les artefacts de langage naturel autour du code au même endroit et ont trouvé que les messages de validation sont les plus réguliers et que les textes de Stack Overflow se comportent comme l'anglais ordinaire [49]. En Chine, le *Journal of Software* (软件学报) a publié une revue de la recherche sur la naturalité du code en 2022, qui indique la mesure d'entropie croisée et la découverte que le code défectueux a une entropie plus élevée [48]. Au Japon, Doi, Higo, Arima, Shimonaka et Kusumoto à l'Université d'Osaka ont utilisé la naturalité n-gram, d'abord dans un rapport technique IEICE en japonais et ensuite à ICPC 2018, pour distinguer les fichiers source générés par machine des ceux écrits par l'homme [73, 74]. Le code généré se situe même plus bas sur l'échelle d'entropie que le code humain, car un générateur est une conversion fixe. Au Brésil, la thèse doctorale d'Arrebola a construit des suggestions de code sur des modèles n-gram et des modèles de sujets segmentés par projet et mainteneur, et l'a évaluée par l'entropie croisée, les bits nécessaires pour encoder le prochain token [75]. Les deux régimes sont visibles dans un seul dépôt : le texte autour du code est à haute entropie, et le code est à basse.

**La mesure a de l'importance.** Febres, Jaffé et Gershenson, travaillant du Venezuela et du Mexique, ont comparé l'anglais, l'espagnol et le texte de programme par la diversité du vocabulaire par longueur de message et ont trouvé le texte de programme plus divers [76]. Rahman, Palani et Rigby ont trouvé que beaucoup de la prévisibilité n-gram du code vient des tokens syntaxiques, et que le code est encore répétitif, moins que d'abord rapporté, une fois ceux-ci retirés, avec l'utilisation d'API la partie la plus répétitive [77]. Les deux résultats aiguisent l'affirmation plutôt que l'inverser. La diversité des symboles n'est pas la prévisibilité, et le régime à faible entropie est une propriété de la distribution conditionnelle de l'étape suivante, ce qui est ce que fixe une transition déterministe. Dans la conception, la première engrenage RCE, la recherche (G0, [§2.2](#22-how-rce-converts-and-where-each-gear-sits)), se concentre sur les formes, pas sur le texte de surface, pour cette raison.

**L'intention se situe dans le régime à haute entropie.** Zave et Jackson ont montré qu'une exigence est une déclaration sur l'environnement, une spécification est une déclaration à l'interface, et le vide entre eux est rempli uniquement par des connaissances de domaine souvent non écrites [64]. Brooks a divisé la difficulté du logiciel en essence et accident : l'essence est la construction conceptuelle, et la plupart d'entre elles est la spécification et la conception, pas la représentation [61]. Naur a argumenté qu'un programme est la partie visible d'une théorie tenue par ses programmeurs, et que la théorie n'est pas entièrement récupérable à partir du texte [62]. Lue à travers Shannon, les trois disent la même chose. L'intention porte plus d'incertitude que tout un seul programme, et l'écriture du programme est l'acte qui l'élimine. Ce qui reste dans la tête d'un programmeur après que le code ait été écrit est la partie de l'intention que le code n'a pas encodée.

**La conversion est un raffinement, et le raffinement est un rétrécissement.** Hoare a donné aux programmes une logique dans laquelle un programme est correct par rapport à une précondition et une postcondition [54]. Wirth a enseigné le raffinement étape par étape : décomposer une tâche en instructions par des décisions successives, chacune fixant un choix que la spécification a laissé ouvert [53]. Les commandes gardées de Dijkstra ont rendu les choix ouverts explicites comme une non-déterminisme, et ont dérivé des programmes à partir des spécifications en les supprimant [52]. À Munich, le projet CIP de Bauer et Wössner a construit le développement de programme comme une séquence de transformations préservant la correction à partir de la spécification au programme [58]. En France, la méthode B d'Abrial et ensuite Event-B ont porté le raffinement à l'échelle industrielle, avec des obligations de preuve à chaque étape [55, 56]. En Finlande, Back et von Wright ont donné au raffinement son calcul théorique de treillis [57]. Dans chacun, une spécification désigne un ensemble d'acceptables comportements et chaque étape de raffinement réduit l'ensemble, jusqu'à ce qu'un comportement déterministe reste. C'est une réduction d'entropie avec une preuve à chaque étape. La Forme RCE est le dernier élément de cette chaîne : une transition totale, déterministe $\delta$ sur les états de base de données, avec chaque choix résolu ([§3.2](#32-definitions)).

**La synthèse est une recherche qui rétrécit un espace d'hypothèses.** Gulwani's FlashFill apprend un programme de chaîne à partir de quelques exemples d'entrée-sortie en représentant l'ensemble de tous les programmes cohérents et en l'intersectant avec chaque nouvel exemple [59]. Gulwani, Polozov et Singh encadrent la synthèse de programme en général comme une recherche à travers un espace de programmes contraint par l'intention [60], et Solar-Lezama's sketching remplit les trous dans un programme partiel avec un solveur [27]. Chaque exemple ou contrainte est une mesure qui élimine des hypothèses. La mesure de Shannon compte combien de telles mesures sont nécessaires. Dans la conception, la troisième engrenage RCE, la synthèse (G2, [§2.2](#22-how-rce-converts-and-where-each-gear-sits)), est cette engrenage.

**Ce que la conversion produit a une forme.** Gurevich a prouvé que chaque algorithme séquentiel est capturé par une Machine d'État Abstraite à son propre niveau d'abstraction [2]. Codd a fait de l'état une relation [5], et le sourcing d'événements fait de l'état le pli d'un journal append-only [14]. Sous Curry et Howard, une preuve est un programme et une proposition est un type [18, 72], donc un programme vérifié est une preuve de sa spécification. Ce sont les raisons pour lesquelles le régime à faible entropie a peu de formes : la destination est une machine d'états sur une base de données, quel que soit le langage de surface.

**La faible entropie se dégrade sans une porte.** Lehman a observé sur des décennies de grands systèmes qu'un programme en usage doit continuer à changer, et que sa complexité augmente à moins qu'un travail ne soit fait pour la réduire [63]. Torres, Baltes, Treude et Wagner ont mesuré l'entropie structurelle et textuelle sur les historiques de validation de 25 projets et ont trouvé que les deux augmentent ensemble [78]. L'entropie revient dans le code depuis l'environnement. Un système qui maintient le code dans le régime à faible entropie a besoin d'une porte sur chaque changement, et la porte RCE est la correction ([§4.3](#43-the-gate)).

**Les compilateurs font déjà du codage source.** Franz et Kistler ont envoyé des programmes comme des arbres syntaxiques abstraits compressés et ont généré du code natif à la charge, ce qui est un codage source d'un programme sur sa propre grammaire [67]. Fraser a inféré des modèles statistiques du code à partir d'un corpus pour le compresser [68]. Futamura a montré en 1971, dans le journal japonais *Systems, Computers, Controls*, que spécialiser un interprète pour un programme donne un programme compilé, et que spécialiser le spécialiste donne un compilateur [70]. Ershov à Novosibirsk a développé l'idée même comme calcul mixte [71]. Les Cousots' interprétation abstraite calcule une description sonore, à faible information, de chaque comportement d'un programme [69]. L'analogie avec le codage de canal est la lecture de cet article, pas un théorème cité : les types, les tests et les preuves ajoutent une redondance vérifiée afin qu'un programme incorrect soit détecté avant qu'il ne s'exécute, comme un contrôle de parité détecte un mot corrompu.

**L'effacement est là où les joules vont.** Landauer a montré qu'une étape logiquement irréversible, l'effacement d'un bit, dissipe au moins $k_B T \ln 2$ [65]. Bennett a montré que le calcul peut en principe être rendu logiquement réversible, donc l'effacement, pas le calcul, porte la borne [66]. Convertir l'intention à haute entropie en un programme à faible entropie élimine chaque alternative que l'intention permettait. Cet élimination est un effacement d'information sur les alternatives, et il a un plancher thermodynamique. Dans la conception du moteur, RCE paie l'élimination une fois par nouveau cas et stocke le résultat, donc un cas répétitif efface rien de nouveau.

**Ce que le surface coûte, mesuré.** Le résultat de naturalité a deux corrections que ce papier porte maintenant, et une troisième découverte qui touche au Form sans nom. Premièrement, le trou d'entropie brut entre le code et le texte diminue considérablement une fois les tokens syntaxiques retirés [77], et Casalnuovo, Lee, Morgan et Devanbu ont trouvé que partie de ce qui reste est un effet de familiarité : dans les projets Java et Python les mieux notés, le code original avait une surprise plus faible que les réécritures préservant le sens, et 50 juges humains ont été d'accord avec la préférence du modèle de langage 61,9 % du temps [132]. Ce qui lit comme naturel est ce que le lecteur a vu le plus, donc une Forme canonique déplace l'équilibre de cette boucle plutôt que de s'en échapper. Deuxièmement, les seules quantités qui suivent la charge de compréhension mesurée sont la taille textuelle, la taille du vocabulaire et la portée de la dépendance de flux de données : dans l'étude unique qui a testé les métriques de code contre l'activation cérébrale, ces trois ont corrélé à Kendall τ ≈ 0,4 alors que la complexité cyclomatique de McCabe a corrélé à rien (τ ≈ 0,09) [133] ; à travers 121 métriques de lisibilité et 444 évaluations, aucune seule métrique n'a atteint |τ| > 0,16 avec la compréhension mesurée [134] ; et le pretty-printing contre le layout perturbé a montré aucune différence fMRI [135], cohérent avec la découverte que le formatage est 13 à 15 % des tokens des langages à accolades et peut être retiré pour dix modèles de langage sans changement significatif en précision [136]. Troisièmement, les noms sont un canal à faible accord, à forte dépendance : deux développeurs choisissent le même nom avec une probabilité médiane de 6,9 % [137], les commentaires co-évoluent avec le code qu'ils décrivent dans 7 à 13 % des cas [138], et pourtant les modèles de pointe perdent 11 à 29 points de précision de résumé et jusqu'à 24 points de précision de prédiction d'exécution lorsque les identifiants sont retirés ou remplacés [139]. Les humains, en revanche, ne traitent pas les identifiants comme un langage au niveau neuronal : remplacer les identifiants anglais par japonais a changé la réponse du système de langage par Δβ = 0,03 [140]. La conséquence pour RCE est formulée dans [§3.8](#38-behaviour-equivalence-and-dimension) : les positions restent dans le hash (T7) et les noms restent en dehors, mais la table latérale qui les contient doit porter le *concept* qu'un nom encode, car les seuls auteurs qui compteront lisent à travers les noms et la Forme n'a pas encore montré qu'un modèle peut raisonner à partir d'une Forme sans nom.
<div id="22-how-rce-converts-and-where-each-gear-sits" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Comment RCE convertit, et où chaque engrenage s'inscrit

Lis comme en théorie de la codification, une tâche arrive comme un message dont l'incertitude résiduelle est ce que n'aucune solution stockée ne résout déjà. Dans la conception du moteur, chaque engrenage élimine l'incertitude à un prix différent, et les engrenages sont ordonnés selon ce prix ([§4.2](#42-the-gears)) ; le tableau donne cette conception engrenage par engrenage, avec la porte et la promotion.

| Engrenage | Ce qu'il fait à l'incertitude | Lignée dans l'argument ci-dessus |
|---|---|---|
| G0 Lookup | Reconnaît que l'intention était déjà encodée ; la résout par récupération, au niveau du gestionnaire | Répétitivité et clones [33, 34, 35] ; localité [46] |
| G1 Rules | Applique une réécriture gardée connue ; résout un résiduel récurrent sans recherche | Transformation préservant la correction [52, 58] ; raffinement avec des obligations de preuve [55, 56] |
| G2 Synthèse | Explore un espace d'hypothèses et le réduit par des exemples, des contraintes et un solveur | Synthèse de programme comme recherche [27, 59, 60] |
| G3 à G5 Modèles | Échantillonne une distribution apprise sur le code lorsque aucun engrenage inférieur ne comble le gap ; un proposant uniquement | Modèles de code à entropie croisée [35, 47] |
| Porte | Accepte un candidat uniquement avec des tests, une couverture et un certificat de preuve | Logique de Hoare [54] ; Curry-Howard [18, 72] |
| Promotion | Stocke la solution acceptée, afin que le même résiduel coûte G0 la prochaine fois | Longueur minimale de description [44] ; effacement de Landauer payé une seule fois [65] |

Les positions sur les axes de la Section 2 diffèrent par l'endroit où le coût de la conversion est payé. Une approche qui échantillonne la distribution complète de la demande à chaque tâche paie à nouveau le côté à haute entropie chaque fois. Une approche qui stocke et réutilise les solutions acceptées paie uniquement pour le résiduel, et une seule fois. La plupart des systèmes se situent entre ces deux extrêmes, et la conception de RCE se situe à l'extrémité de la réutilisation.

<div id="23-the-ecosystem-at-large-n" class="anchor-alias" aria-hidden="true"></div>

### 2.3 L'écosystème à grand N

L'affirmation de [§1](#1-thesis) doit être testée directement, à grand N, sous le protocole ci-dessous, enregistré avant son exécution. Un générateur semé écrit au moins 10 000 Formes, chacune étant un module du langage avec une région d'état, un événement avec des champs entiers, et une étape dont le corps est un terme arithmétique aléatoire de profondeur bornée sur un ensemble fixe d'opérateurs. Le vérificateur de référence et ses émetteurs sont figés à un commit public avant l'exécution, et aucun modèle n'est appelé. Les projections sont les quatre émetteurs de programme du vérificateur de référence : Rust, Python, JavaScript et Scala. Cinq propriétés sont vérifiées sur chaque Forme :

| Propriété | Ce qui est vérifié par Forme |
|---|---|
| Encodage sans perte | L'encodage JSON canonique de la Forme (`rce emit form`), décodé en source (`rce unform`) et encodé à nouveau, donne les mêmes octets |
| Projection déterministe | Deux émissions d'une même cible donnent les mêmes octets |
| Projection fidèle | Chaque programme émis (Rust, Python, JavaScript et Scala) imprime le tracé de référence octet par octet pour les événements semés |
| Porte à l'entrée, entrées | Les payloads malformés (un type incorrect, un champ manquant, un champ supplémentaire, une valeur imbriquée) et les événements non déclarés sont tous refusés, avec l'état inchangé et le refus enregistré |
| Porte à l'entrée, spécifications | Un module qui utilise un nom qu'il ne déclare pas est refusé avant l'émission (W-NAME-1) |

La Section 9 énonce l'observation qui contredit l'affirmation, RCE-F0 : lors d'une exécution préenregistrée de 10 000 Formes au moins, l'une des quatre projections imprime un tracé différent du tracé de référence de la Forme, ou tout input malformé est accepté. Sur le jeu de tests de conformité, la sortie Scala ne correspond pas encore à la référence ([§4.5](#45-the-compilers)), et le vérificateur public ne respecte pas encore le contrat d'entrée ([§10](#10-work-to-finish), point 15). Un cible ajouté plus tard aux émetteurs entre dans le protocole uniquement par une nouvelle inscription. Les Formes générées sont petites, donc une telle exécution mesure l'encodage, les projections et la porte. Les Formes levées à partir de programmes réels sont mesurées sous le protocole de [§8.7](#87-lift-coverage-across-languages).
<div id="24-gated-verified-recursive-self-improvement" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Amélioration récursive vérifiée par porte

Good (1965) [111] a défini la machine ultraintelligente comme une machine capable de concevoir de meilleures machines, de sorte que l'amélioration serait récursive. Yudkowsky (2013) [113] a formulé la question en termes de rendements : savoir si chaque unité d'amélioration rend l'unité suivante moins coûteuse ou plus coûteuse. La machine de Gödel de Schmidhuber (2007) [112] a donné une réponse formelle avec une garantie : un programme réécrit toute partie de lui-même, y compris sa propre recherche, uniquement après avoir prouvé que la réécriture améliore son utilité attendue. Le théorème de Löb (1955) [114] est l'obstacle que rencontre un prouveur se faisant confiance, que Yudkowsky et Herreshoff (2013) [115] ont nommé l'obstacle lobien : un système ne peut généralement pas prouver la validité d'un successeur qui utilise son propre système de preuve. Les systèmes récents abandonnent la condition de preuve et sélectionnent selon un score mesuré : STOP (Zelikman et al., 2023) [116] améliore le squelette qui améliore le code, la machine de Gödel Darwin (Zhang et al., 2025) [117] conserve un archive d'agents de codage auto-modifiés choisis selon un score de benchmark, AlphaEvolve (Novikov et al., 2025) [118] évolue les programmes sous des évaluateurs automatiques, et Voyager (Wang et al., 2023) [119] développe une bibliothèque de compétences vérifiées que les tâches ultérieures réutilisent.

RCE adopte la structure de la machine de Gödel et la bibliothèque de Voyager, avec deux différences qui évitent l'obstacle pour les objets qu'elle promeut. Premièrement, l'objet qui s'améliore n'est pas le prouveur. Dans la conception, RCE promeut des gestionnaires, des réécritures et des engrenages, et chacun est vérifié par rapport à un noyau fixe et à une règle de preuve fixe : les propriétés contre lesquelles le noyau est vérifié par modèle ([§5.3](#53-model-checking-of-the-kernel)) et l'encodage de l'arithmétique de la Forme pour un solveur SMT ([§5.2](#52-the-proof-rule-for-rewrites)) ne changent jamais par la promotion, donc aucun pas n'a besoin de faire confiance au système de preuve d'un successeur. Deuxièmement, la porte est une preuve de correction à la frontière, pas un score. Un score peut augmenter pendant qu'une hypothèse d'interface se brise ; une preuve à la frontière ne peut pas être passée par un changement qui la brise.

**Proposition R1 (correction monotone).** Si chaque changement promu passe le contrôle de sa frontière, et que les contrôles des autres frontières restent inchangés, alors toutes les propriétés établies par ces contrôles avant la promotion restent valables après.

**Proposition R2 (compounding).** Soit une charge de travail un multiensemble de tâches et soit un gestionnaire promu qui ferme chaque tâche de sa forme. Alors le nombre d'escalades dans le tour t est non croissant en t, et une correction promue avant le tour 1 réduit les escalades cumulées de chaque horizon par les escalades qu'elle ferme dans chaque tour ultérieur.

**Proposition R3 (coût décroissant).** Puisqu'un gestionnaire promu est exécuté à la place d'un appel de modèle, et que son coût est le nombre d'opérations du gestionnaire évalué par le tableau de substrat, l'énergie d'un tour tend vers l'énergie des gestionnaires seuls à mesure que les escalades tendent vers zéro.

Les projections de Futamura (1971, republication 1999) [120] et la supercompilation de Turchin (1986) [121] donnent la limite de ce processus. Spécialiser un interprète pour un programme donne un programme compilé ; spécialiser le spécialiste donne un compilateur. Dans la conception, les promotions de RCE spécialisent le chemin général d'escalade vers les formes qui surviennent effectivement, donc le moteur converge vers le programme résiduel de sa charge de travail : la partie du calcul qu'un modèle ou une personne doit encore fournir. L'amélioration récursive sous une porte est cette convergence, réalisée avec des étapes vérifiées.

<div id="3-the-form" class="anchor-alias" aria-hidden="true"></div>

## 3. La Forme

<div id="31-the-strongest-formal-statement-of-same-form" class="anchor-alias" aria-hidden="true"></div>

### 3.1 L'énoncé formel le plus fort de "même forme"

La portée du théorème est énoncée en premier. Les postulats séquentiels de Gurevich couvrent les algorithmes séquentiels ; les algorithmes parallèles et interactifs nécessitent les postulats supplémentaires de Blass et Gurevich [3]. Blass, Dershowitz et Gurevich argumentent que aucune relation d'équivalence unique sur les algorithmes ne convient à tous les usages [79], et Moschovakis et Vardi exposent le débat sur ce qu'est un algorithme [80, 81]. Un gestionnaire web qui effectue des entrées et sorties se situe en dehors du théorème séquentiel. La Forme gère l'interaction de la même manière que la ligne interactive : chaque entrée est un événement dans $E$, et la machine d'états passe dessus. Ainsi, "une Forme" est un choix de modélisation ancré dans le théorème séquentiel et étendu par convention, avec des précédents de production dans l'architecture Elm [83], les historiques d'événements de workflow durable [84] et les sémantiques de flux tels que Flo [82]. Les propositions de la Section 3.4 sont énoncées pour ce choix.

Le théorème de la machine d'état abstraite (ASM) de Gurevich est l'énoncé formel le plus fort selon lequel chaque algorithme a une forme [2]. Une machine d'état abstraite est une machine dont les états sont des structures du premier ordre et dont l'étape est un ensemble fini de mises à jour protégées. Gurevich énonce trois postulats. Temps séquentiel : un algorithme a des états, des états initiaux et une carte à un pas $\tau$. État abstrait : les états sont des structures du premier ordre sur un vocabulaire fixe, fermées sous l'isomorphisme. Exploration bornée : un ensemble fini de termes décide chaque étape. Son Théorème principal (Théorème 6.13) se lit : "Pour chaque algorithme séquentiel A, il existe une machine d'état abstraite séquentielle équivalente B." Blass et Gurevich l'ont étendu aux algorithmes parallèles [3]. Dershowitz et Gurevich ajoutent un quatrième axiome, que les opérations initiales sont calculables, et en déduisent la thèse de Church [4].
<div id="32-definitions" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Définitions

**Définition 1 (la Forme).** Un programme est un tuple

$$P = (S, E, \delta, D, \lambda)$$

- $S = \Sigma_c \times \Sigma_d$, l'espace d'états : des structures sur un vocabulaire fixe $\Sigma$, divisé en régions de contrôle $\Sigma_c$ et données $\Sigma_d$. $\Sigma_d$ contient l'horloge logique, le nombre d'entrées et les relations typées (dans la langue, également les régions déclarées). Chaque état est une instance de base de données au sens de Codd [5].
- $E$, l'alphabet des événements, incluant le battement de l'horloge logique.
- $\delta : S \times E \to S \times O^*$, la transition : totale, déterministe et pure, écrite comme un ensemble fini de mises à jour protégées "si $\varphi$ alors $f(\bar t) := t_0$", chaque étape lisant un ensemble borné de localisations. Elle retourne l'état suivant et les sorties de l'étape. Écrivez $\delta_1 = \pi_1 \circ \delta$ pour sa composante d'état.
- $D$, le journal durable : une séquence d'entrées $\{\mathit{seq}, \mathit{event}, \mathit{prev\_hash}, \mathit{state\_hash}, \mathit{hash}\}$, où $\mathit{state\_hash}$ est le SHA-256 de la JSON canonique de l'état après l'étape, $\mathit{hash}$ est le SHA-256 de la JSON canonique des quatre premiers champs, et le premier $\mathit{prev\_hash}$ est 64 zéros. Le journal est une chaîne de hachage, donc changer toute entrée passée change chaque $\mathit{hash}$ ultérieur.
- $\lambda = \pi_2 \circ \delta : S \times E \to O^*$, la carte de sortie. Une machine de Mealy lit les deux arguments [6] ; une machine de Moore lit uniquement l'état [7].

**Définition 2 (Forme et ajustement).** La *forme* est le tuple avec quatre invariants : $\delta$ est déterministe et pur ; l'exploration est bornée ; le vocabulaire est fixe ; l'état est le pli du journal,

$$\mathrm{state}(D) = \mathrm{foldl}(\delta_1, s_0, D).$$

Un journal peut également porter le résultat de chaque entrée, les sorties et l'état. Ces éléments sont dérivés : ils ne sont pas hachés, et ils doivent être égaux à la relecture (T1 et T3 de [§3.7](#37-the-language-one-text-costs-and-theorem-status)). Deux types de rejet sont distincts. Dans le profil du moteur que l'Annexe D de la spécification définit, chaque événement est appliqué, et une entrée qui échoue dans son contrat produit une sortie `reject` et une ligne d'erreur (D.6). Dans la langue, un événement refusé laisse l'état inchangé (T8) et est enregistré comme refusé.

L'*ajustement* est les données qui remplissent la forme : le vocabulaire $\Sigma$, les alphabets $E$ et $O$, le programme de règles $\Pi$ qui définit $\delta$, les règles de sortie qui définissent $\lambda$, et les données initiales $s_0$. Selon les termes de Gurevich, l'ajustement est le vocabulaire, le programme ASM et les structures initiales. Selon les termes de Codd, $\Sigma$ est le schéma et $s_0$ est l'instance. Selon les termes de la ligne de produit, un ajustement est une sélection de fonctionnalités [8]. Selon les termes de la synthèse guidée par la syntaxe (SyGuS), un ajustement est un terme d'une grammaire qui répond à une spécification [9].

**Définition 3 (équivalence d'ajustement).** Deux ajustements sont équivalents lorsque, pour toute séquence d'événements $L$, leurs séquences de sortie sous $\lambda$ sont égales.

**Définition 4 (langage d'ajustement).** Une grammaire dont les termes désignent des ajustements. Les langages de programmation, les documents de diagrammes d'états en State Chart XML (SCXML), les configurations XState et les spécifications `.rce` sont des langages d'ajustement. Un langage d'ajustement est complet lorsque tout programme ASM sur $\Sigma$ a un terme dans ce langage.

**Définition 5 (projection de contrôle).** Divisez $\Sigma = \Sigma_c \cup \Sigma_d$ en symboles de contrôle finis et relations de données. Le diagramme d'états de $P$ est la projection de $\delta$ sur $\Sigma_c$ : les états sont les valeurs de $\Sigma_c$, les transitions portent un événement et une garde sur $\Sigma_d$, et les actions sont des mises à jour de $\Sigma_d$. Les diagrammes d'états de Harel donnent la hiérarchie et les régions orthogonales [10].

**Définition 6 (e-graphe d'ajustement).** Pour un ajustement $F$ et un ensemble $R$ de réécritures sonores, l'e-graphe d'ajustement $EG(F, R)$ est l'e-graphe saturé des termes de règle de $F$ sous $R$ [11, 12]. Chaque classe e contient des ajustements équivalents selon la Définition 3.

**Définition 7 (coût en joule).** $\mathrm{cost}_J(t)$ est l'estimation de l'énergie (`est_j`) nécessaire pour exécuter une fois le terme $t$ sur un substrat nommé, pondérée par le nombre attendu d'exécutions.

<div id="33-why-database-functional-state-machine" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Pourquoi "machine d'états fonctionnelle de base de données"

Une structure relationnelle finie est une instance de base de données, donc un état de Gurevich est une base de données et chaque étape est une transaction bornée. *Base de données* : $S$ est une structure relationnelle. *Fonctionnelle* : $\delta$ et $\lambda$ sont purs. *Machine d'états* : les exécutions sont des plis de $\delta$ sur les événements. Moseley et Marks tracent la même ligne dans l'architecture [13]. Le sourcing d'événements le fait dans l'état d'application : "Capturez toutes les modifications d'un état d'application sous forme de séquence d'événements" [14]. Dedalus le fait en logique, où l'état modifiable est une relation indexée par le temps [15].
<div id="34-propositions" class="anchor-alias" aria-hidden="true"></div>

### 3.4 Propositions

**Proposition 1 (la Forme capture chaque algorithme séquentiel).** Pour chaque algorithme séquentiel $A$ il existe une instance de Forme $P$ dont les exécutions sont les exécutions de $A$.

*Esquisse de preuve.* Le théorème 6.13 donne un ASM $B$ avec les états, les états initiaux et la carte d'une étape de $A$. Définissons $E = \{\varepsilon\}$, $\delta(s, \varepsilon) = \tau_B(s)$, $D = (s_0, \varepsilon^n)$ et $\lambda$ l'identité. Le pli après $n$ ticks est $\tau_A^n(s_0)$. Selon le corollaire 3.3 de Gurevich, $P$ et $A$ ont les mêmes exécutions. ∎

**Proposition 1b (programmes interactifs).** Étendre $\Sigma$ avec un ensemble de symboles d'entrée unaire $e$ avant chaque étape ; alors $\delta(s, e) = \tau(s[\mathit{in} := e])$ est un algorithme séquentiel sur le vocabulaire étendu, et la proposition 1 s'applique. La construction est la nôtre.

**Proposition 1c (calculabilité).** Sous l'axiome de Dershowitz et Gurevich, chaque instance de Forme calcule une fonction calculable par une machine de Turing [4, 16, 17]. La Forme n'ajoute aucune puissance. Elle donne à chaque programme de la classe une forme.

**Proposition 1d (les preuves sont des ajustements).** « Pour chaque preuve d'une proposition donnée, il existe un programme du type correspondant » [18]. Un type est une spécification et une preuve est un ajustement qui la satisfait. La porte de correction est l'existence de cette preuve ou d'un test d'acceptation réussi.

**Proposition 2 (un générateur).** Une fonction $G : \mathrm{Fit} \to \mathrm{Program}$ génère un programme exécutable pour chaque ajustement et ne lit aucun domaine. *Base :* chaque programme est une instance de Forme, donc $G$ émet un magasin typé, un type d'événement, des règles compilées, un journal avec un pli et un distributeur de sortie. Des outils comme les générateurs Rails, JHipster et Yeoman sont $G$ restreint à de petits langages d'ajustement. L'ingénierie de lignes de produits commence par « la découverte et l'exploitation systématiques de la communautés entre systèmes logiciels liés » [8] ; la communautés est la Forme.

**Proposition 3 (extraction à moindre énergie).** L'extraction avec $\mathrm{cost}_J$ renvoie le terme à moindre joule que l'extracteur trouve dans la classe $e$ de $F$. *Esquisse de preuve.* Les réécritures sont correctes, donc chaque terme dans la classe $e$ a le comportement observable de $F$ et passe le même test. L'extraction minimise le coût, et le coût est en joules. ∎ C'est l'application de Mixture of Limits au code. Mixture of Limits, Partie II de l'article complémentaire [Portes de validation mesurées](/papers/gates/), indique qu'une tâche nécessite une énergie minimale attendue pour se terminer et que l'énergie dépensée après la fin de la tâche n'achète aucun progrès vérifié ; appliqué au code, cela signifie : gardez le terme minimal qui effectue la tâche, le reste est gaspillé.

**Proposition 4 (déterminisme de la relecture).** Si $\delta$ ne lit pas l'horloge murale, ordonne les mises à jour sans noms et loggue chaque entrée, deux relances d'un $D$ donnent des hachages d'état identiques à chaque étape.

**Proposition 5 (la projection du diagramme d'états est correcte).** Projeter chaque état d'une exécution sur $\Sigma_c$. Le résultat est une exécution du diagramme d'états émis sous les mêmes événements.

**Proposition 6 (budget de coordination).** Les règles marquées monotones s'exécutent sur des répliques sans coordination ; seules les règles non monotones nécessitent un point de coordination. *Base :* le théorème CALM, « les programmes qui ont des implémentations distribuées cohérentes et sans coordination sont exactement ceux qui peuvent s'exprimer en logique monotone » [19].

L'annexe D.5 de la spécification dérive le tag à partir de la règle, jamais à partir d'une déclaration, et a le vérificateur IR du profil de l'engin qui refuse une Forme dont le tag stocké diffère de celui dérivé :

| La règle a | Tag | Raison |
|---|---|---|
| aucun résolution, lecture, jointure ou scan | monotone | ses écritures n'ajoutent que des clés et augmentent les compteurs |
| une résolution | non monotone | elle supprime des lignes d'escalade |
| une lecture de son propre puits | non monotone | lecture, modification, écriture |
| une jointure indexée | non monotone | la ligne jointe peut être absente maintenant et présente plus tard, ou écrasée |
| un scan | non monotone | elle observe toute la relation, y compris ce qui est absent |

Le tag est correct mais non complet : une jointure contre une relation à insertion uniquement serait monotone, mais le profil ne prouve pas qu'une relation est à insertion uniquement, donc le tag ne le prétend pas. Une Forme est sans coordination lorsque toutes les règles sont monotones. Toute lecture, jointure et scan voit l'état à l'entrée de l'événement, donc l'état postérieur d'un événement d'entrée ne dépend pas de l'ordre dans lequel les règles pour différents puits s'exécutent ; seul l'ordre de sortie le fait, et il est fixé par le hachage du contenu.

**Proposition 7 (l'intelligence comme dérivée en joule).** Soit $X$ le nombre de tâches passant par la porte et $J$ les joules dépensés. $\iota = dX/dJ$ est lu en arrière de $D$, qui enregistre chaque événement, et, dans la conception de l'engin, à partir de ses reçus ([§4.4](#44-receipts)), chacun portant l'`est_j` d'un appel d'engrenage. L'extraction sous $\mathrm{cost}_J$ fixe la porte et ne relève pas $J$, donc à $X$ égal, elle ne réduit pas $\iota$.

<div id="35-graph-e-graph-and-statechart" class="anchor-alias" aria-hidden="true"></div>

### 3.5 Graphe, e-graphe et diagramme d'états

| Structure | Partie de la Forme | Ce qu'il décide |
|---|---|---|
| Diagramme d'états | Gardiens de $\delta$ sur $\Sigma_c$ | Quelle transition est déclenchée |
| Graphe de flux de données | Dépendances de lecture et d'écriture de $\delta$ et $\lambda$ (réseaux de processus de Kahn [20]) | Ce qui s'exécute, et dans quel ordre |
| E-graphe | La classe d'équivalence de l'ajustement | Quel ajustement équivalent s'exécute |

Le diagramme d'états et le graphe décrivent un ajustement. L'e-graphe décrit chaque ajustement équivalent à celui-ci. L'extraction choisit parmi eux en fonction des joules.
<div id="36-one-ecosystem-lossless-and-the-universality-thesis" class="anchor-alias" aria-hidden="true"></div>

### 3.6 Une écosystème, sans perte, et la thèse d'universalité

**Sans perte par construction.** Le théorème de codage source de Shannon fixe le plancher pour un code sans perte à l'entropie de la source [40]. Une Forme est un code sans perte pour l'intention au sens restreint qui peut être vérifié : la sérialisation canonique de la Forme est injective, donc deux Formes qui diffèrent dans tout état, événement ou transition ont des hachages de forme différents, et le décodage de la sérialisation donne la même Forme. Dans la conception, chaque projection vers une cible est une fonction de la Forme seule ; les émetteurs d'aujourd'hui lisent le programme vérifié plutôt que ([§4.5](#45-the-compilers)). Les transformations bidirectionnelles rendent le round trip précis. Foster, Greenwald, Moore, Pierce et Schmitt définissent une lentille comme un couple de fonctions get et put avec des conditions de round trip qui font que la vue et sa source s'accordent [122], Hofmann, Pierce et Wagner étendent les conditions aux lentilles symétriques [123], et Czarnecki et collègues survolent les mêmes conditions de cohérence à travers l'ingénierie de modèles, les bases de données et les langages de programmation [124]. La condition de round trip de RCE est la condition GetPut au niveau du programme entier : relever une projection et le hachage de forme reste inchangé.

**Correct par construction.** Dijkstra a proposé en 1968 qu'un programme et sa preuve soient développés ensemble, afin que la correction soit conçue plutôt que testée [125]. Hall et Chapman ont porté cette approche dans un système sécurisé commercial avec une spécification formelle et une raffinement à chaque étape [126]. La règle de Minsky pour le programmation fonctionnelle typée, rendre les états illégaux inreprésentables, dit la même chose au niveau du type : un type qui ne peut pas contenir une valeur mauvaise élimine le besoin de le vérifier [127]. Le programmation fonctionnel total de Turner exige que chaque fonction se termine sur chaque entrée, afin qu'un programme désigne une fonction mathématique sans échec caché [128]. La Forme de RCE est totale au sens de Turner, ses types de contrat rendent les états non déclarés inreprésentables au sens de Minsky, et la chaîne de raffinement de [§2.1](#21-programming-is-coding-theory) se termine en son sein au sens de Dijkstra. La conséquence est celle énoncée dans [§1](#1-thesis) : ce qu'un programme fait est ce que sa Forme déclare, donc il n'y a rien à diff ou à suivre après coup.

**La thèse d'universalité.** Énoncée en termes théoriques, la thèse est qu'il existe une seule Forme universelle. Les programmes sont rédigés en elle nativement, chaque langage existant est atteignable à partir d'elle comme une projection fidèle, et chaque programme existant entre en elle par élévation. La thèse de Gurevich fournit le fondement : chaque algorithme séquentiel est capturé, étape par étape, par une Machine d'État Abstrait à son propre niveau d'abstraction [2], et les algorithmes parallèles de la même manière [3]. Une Forme est une telle machine sur un état de base de données.

**Proposition U1 (capture).** Si un programme dans un langage $L$ est un algorithme séquentiel ou parallèle au sens de Gurevich, alors il existe une Forme dont la transition simule pas à pas l'algorithme au niveau d'abstraction du programme [2, 3].

**Proposition U2 (projection fidèle).** Si la projection $\pi_L$ d'une Forme vers $L$ préserve la trace de la Forme sur chaque entrée du contrat, alors la Forme et sa projection sont interchangeables pour chaque observateur de la trace, et $L$ n'ajoute rien que la Forme n'a pas.

**Proposition U3 (élévation par construction).** Chaque langage de programmation en usage a une grammaire formelle, un parseur qui produit un arbre de syntaxe concrète, un arbre de syntaxe abstraite et une sémantique fixée par sa spécification ou son implémentation de référence. Une élévation $\lambda_L$ est construite par langage en trois étapes : la grammaire, puis l'arbre de syntaxe abstraite, puis la Forme, avec chaque construction de $L$ donnant sa règle de Forme par la sémantique de $L$. Une élévation ainsi construite satisfait $\pi_L(\lambda_L(p)) \equiv p$ sur le comportement et $\lambda_L(\pi_L(F)) = F$ sur le hachage de forme, donc le couple est une lentille au sens de [122], et un programme en $L$ est conservé comme une Forme sans perte.

**Proposition U4 (remplacement).** Si U2 et U3 tiennent pour le langage $L$, alors aucun programme n'a besoin d'être écrit en $L$ : il est écrit une fois comme une Forme et émis comme $L$ là où une plateforme le requiert.

**Chaque langage comme cible et source : la conception.** La Forme ne fixe aucune borne aux cibles, et RCE est conçu pour éléver chaque langage dans la Forme et pour émettre chaque langage à partir d'elle. La conception est la proposition [`spec/proposals/rce-form.md`](https://github.com/openIE-dev/rce/blob/main/spec/proposals/rce-form.md) du dépôt de spécification. Elle fixe une encodage de la Forme, `rce-form/1`, que l'élévation et l'émission partagent, et traite un langage comme données : une grammaire fixée, une table d'élévation qui mappe la syntaxe du langage sur l'encodage, une table d'impression qui imprime l'encodage comme texte du langage, et une bibliothèque d'exécution qui déclare exactement les valeurs et les opérations intégrées du langage. Une élévation est acceptée par comparaison exacte avec l'implémentation propre du langage, et une émission par comparaison exacte de la sortie du programme émis, exécuté sous la construction propre du langage, avec la trace de référence, sur une échelle de niveaux d'acceptation allant de 0 (le langage a une ligne, avec un identifiant d'un catalogue public tel que l'Histoire des langages de programmation ou GitHub Linguist, dans le registre de langage propre à la proposition) jusqu'à 4 (sur un corpus fixé, chaque cas s'accorde octet par octet ou est conservé par l'élévation ou l'émission avec une raison nommée, au moins un cas s'accorde, aucun ne diffère, et aucun cas élévée n'est conservé pour une limite de ressources) et 5 (l'élévation et l'émission formant une lentille sur ce corpus) jusqu'à 6 (accord avec une deuxième implémentation indépendante, ou avec le propre jeu de tests du langage représentant au moins 30 % du corpus), et un niveau est publié uniquement avec les comptes des exécutions qui l'ont atteint. La proposition s'appuie sur trois précédentes : le registre d'émission (`spec/proposals/emit-targets.md`), dont les niveaux listent les systèmes, plateformes, langages dynamiques et non-von-Neumann à suivre, y compris les nouveaux entrants de 2024 à 2026 catalogués dans [§3.7](#37-the-language-one-text-costs-and-theorem-status) ; un émetteur avec une table d'impression par langage (`spec/proposals/one-emitter.md`) ; et comment la Forme tient ce qui lui est offert (`spec/proposals/compliance.md`). Dans l'encodage, chaque définition d'un programme est nommée par le hachage de ses octets, et son corps est un graphe sur cinq types de nœuds (Bind, Apply, Branch, Iterate et Halt), qui conservent les nombres donnés par le noyau de flowG ([openIE-dev/flow-g](https://github.com/openIE-dev/flow-g)), son vocabulaire de 22 primitives et 11 types de câbles ; flowG est la première passe du projet sur une forme partagée entre l'intention et le silicium et le parent de RCE. La conception n'est pas construite : la proposition indique que rien en elle n'a été construit et que aucune ligne de sa couche de forme n'existe, et le noyau typé que ses imprimeurs liraient existe uniquement sur une branche de développement du dépôt. Ce qui existe aujourd'hui est plus étroit. Le vérificateur de référence émet Rust, Python, JavaScript et Scala via quatre émetteurs manuellement écrits qui traduisent l'arbre de syntaxe vérifié d'un programme, pas la Forme ([§4.5](#45-the-compilers)). L'unique élévation d'un autre langage dans le dépôt public est la sonde `spec/lift/go/lift_go.py`, qui élève un motif Go (une structure avec une méthode de récepteur de pointeur par événement, des gardes qui retournent une erreur, et des affectations de champ) en une Forme ; sur son seul exemple, une porte, la Forme élévée a les mêmes états de contrôle et transitions qu'une Forme manuellement écrite de la même porte lorsque les deux déclarent leurs erreurs dans le même ordre. Sous `lang/`, le dépôt contient également, dans les formats de fichiers par langage de la proposition, des oracles fixés et des corpus enregistrés pour Go 1.24, Python 3.13 et JavaScript (ECMAScript 2020) contre lesquels une élévation serait jugée ; aucun éléveur n'existe, comme indiqué dans [son readme](https://github.com/openIE-dev/rce/blob/main/lang/README.md).

U1 est un théorème. U2 est vérifié pour Rust, Python et JavaScript par les tests des émetteurs de programmes ([§5.1](#51-differential-testing-of-the-program-emitters)), ne tient pas encore pour Scala, et doit être vérifié pour de grands N sous le protocole de [§2.3](#23-the-ecosystem-at-large-n). U3 est une construction à construire langage par langage à partir de la grammaire ; un motif Go est élévée par une sonde publique aujourd'hui, et [§8.7](#87-lift-coverage-across-languages) indique comment la construction est mesurée à mesure qu'elle est construite.

**Deux qualifications.** L'élévation de U3 est une construction, et son domaine est plus petit que ne le suggère la phrase ci-dessus. La Forme exige que chaque programme se termine (T2), donc l'élévation depuis tout langage Turing-complet est au mieux une carte depuis le fragment terminant de ce langage, et l'appartenance à ce fragment est indécidable (le théorème de Rice appliqué à une cible totale [141]). Sur le fragment terminant, l'élévation n'est pas encore canonique : la représentation de fermeture, qui sous-termes deviennent des états de contrôle, et l'ordre d'évaluation sont des choix libres, et l'inverse existe uniquement pour les programmes en forme défuntionnalisée [142, 143]. Donc $\lambda_L$ est une construction sur l'image d'une carte partielle dont le domaine est indécidable, les conditions de round-trip de lentille tiennent sur cette image, et « chaque programme existant entre en elle par élévation » est une déclaration sur le fragment que la construction atteint, mesuré comme [§8.7](#87-lift-coverage-across-languages) le mesure. La deuxième qualification concerne le hachage sur lequel la revendication d'injection est faite. La spécification 6.1 hache les formes positionnelles de l'état et de l'événement (régions et champs comme listes dans l'ordre de déclaration, une variante par son index, un événement par son index parmi les événements du module) ; l'entrée stockée garde son `event` et `state` lisibles, et une trace répète les formes hachées sous `hashed` (format de trace `rce-trace/2`). Le module Lean `RCE/NameFree.lean` hache les clés de De Bruijn, et `RCE/Positional.lean` modélise l'embedding positionnel (enregistrements de types déclarés comme listes de champs dans l'ordre de déclaration, variantes comme index et champs, événements par index, enregistrements non déclarés par nom) et prouve qu'elles restent inchangées sous tout renommage injectif qui fixe les noms non déclarés, ce que fait la projection sans nom, donc le hachage d'état et toute la chaîne d'entrées restent inchangés pour chaque fonction de hachage ; l'index d'événement qu'il hache est par définition l'index de déclaration du modèle de De Bruijn, donc les deux encodages s'accordent sur la composante qu'ils partagent. Le vérificateur de référence et les runtimes Python, JavaScript et Rust s'accordent sur les hachages, et un test vérifie que le programme et sa projection sans nom ont les mêmes hachages de journal, comme T7 l'indique ; à la commit publique `f2bd7222`, qui ajoute `RCE/Positional.lean`, l'audit passe à 5 052 théorèmes avec uniquement les axiomes standards. Un vérificateur de référence antérieur hachait le JSON canonique nommé, donc ses hachages de journal dépendaient des noms alors que ceux du modèle ne le faisaient pas ; le registre de propositions de la spécification enregistre cette découverte, le test qui l'a démontrée, et sa résolution comme erratum sous C.15 (l'entrée de journal est en dehors du sens d'un programme), avec les fixations de trace, les applications dorées, 130 broches de conformité et les vecteurs de flux de la bibliothèque standard régénérés.
<div id="37-the-language-one-text-costs-and-theorem-status" class="anchor-alias" aria-hidden="true"></div>

### 3.7 La langue : un texte, les coûts et le statut des théorèmes

La langue RCE est définie par une spécification écrite ([/rce/spec/](/rce/spec/); source dans le [rce repository](https://github.com/openIE-dev/rce)). Il existe une seule langue, le texte de la spécification à un commit donné, et chaque module d'un programme s'y trouve (spécification 2.7). Les sections 2 à 10 définissent le noyau ; l'annexe C définit la concurrence (`par`, `for ... par`, `with budget`, les groupes de travail, les LVars, les sessions et les superviseurs) et s'applique à chaque module ; l'annexe D définit le profil de l'engine : les spécifications et les ajustements du design de l'engine. Aucune déclaration ne sélectionne un dialecte : un commentaire `# rce-version:` en première ligne est une étiquette de version qui nomme le commit de la spécification contre lequel un module a été écrit, est ignoré par le vérificateur et n'est pas haché, et une construction que le vérificateur n'implémente pas est refusée comme réservée, non implémentée (W-RES-1, annexe F.12). La langue est en développement et change à mesure que de meilleures formes sont trouvées : une forme peut être ajoutée, généralisée ou remplacée, et le changement et chaque programme du dépôt qu'il touche se déplacent ensemble dans un seul commit, jamais comme un choix par module, donc un programme ne dépend jamais de la version d'un autre programme ou d'une bibliothèque : tout ce qui est vérifié à un commit donné correspond à la spécification à ce commit.

**Pourquoi un seul texte et pas de sélection de version.** Le registre de la versioning soutient cette règle plutôt que la sélection par module que les brouillons précédents avaient. La résolution des dépendances avec une version par package et des contraintes arbitraires est NP-complète, établie pour les distributions Linux [176], reformulée en 2020 pour chaque modèle de composant non trivial [177] et prouvée indépendamment pour les gestionnaires de paquets de langage par réduction à partir de 3-SAT [178]. Un numéro de version sémantique ne porte pas la promesse qu'il fait : environ un tiers des publications de Maven Central sur sept ans ont introduit un changement brisant, dans les versions mineures et les correctifs aussi souvent que dans les versions majeures [179], une réplication sur 119 879 mises à niveau a tout de même trouvé 20,1 % des publications non majeures brisantes [180], et le texte d'ingénierie de Google conclut que le versioning sémantique est un résumé perdu du risque d'adopter un changement et garde une seule version de tout dans un seul dépôt [181]. L'exposition est une propriété du graphe transitif : pour plus de 80 % des 35 863 artefacts Maven affectés par la vulnérabilité Log4j, la dépendance était plus d'un niveau profond [182]. Où le registre converge, c'est sur l'identité dérivée du contenu, de sorte que deux choses différentes ne partagent jamais un nom et les variantes coexistent [183, 184], sur le changement par accretion sous des noms qui ne sont jamais réutilisés [185], et sur une preuve directe qu'un changement a préservé le comportement plutôt qu'un nombre affirmant cela [186] ; le design matériel a effectué une telle preuve, l'équivalence checking, comme la porte sur chaque révision pendant deux décennies [187], et les builds reproductibles lient un artefact à sa source par son hachage [188]. Le design RCE prend chacun de ces éléments comme une règle : un seul texte à un commit, des hachages de définition avec un tableau de compatibilité fermé (F.4.3), un manifeste qui fixe par hachage sans résolveur (F.5.3), des hachages de logs sans noms (T7) et le comportement comme la seule signification de deux programmes étant les mêmes ([§3.8](#38-behaviour-equivalence-and-dimension)). L'enquête du 24 octobre 2026 qui lit le registre contre ces règles, avec les lacunes qu'elle liste (un hachage de programme complet, le contrôle d'équivalence exécuté comme une porte sur chaque changement, l'origine dans le code émis), se trouve dans le dépôt de données ([/data/](/data/#rce)) et sa proposition est `spec/proposals/one-commit-change.md`.

**Les budgets comptent le travail.** Un bloc `with budget` facture chaque opération un coût fixe à partir du tableau de l'annexe C.6.4 et se bloque avec `budget` lorsque le compte est épuisé. Le compte est un proxy du travail, pas une mesure du temps ou de l'énergie ; `est_j` est séparé.

| Opération | Coût |
|---|---|
| appel d'une fonction utilisateur ou d'une fermeture, $c_{call}$ | 4 |
| méthode de bibliothèque standard sur un récepteur de taille $n$, taille du premier argument $k$ | $4 + w(m, n, k)$ |
| envoi ou réception sur un canal | 8 |
| `spawn` | 32 |
| une branche `par` ou un morceau `for ... par` | 16 |
| littéral de liste ou de carte, ou compréhension, avec $n$ résultats ; `[x; n]` | $4 + n$ |
| index, tranche, accès à un membre ; opérateurs unaires ; `and`, `or` ; opérateurs et comparaisons entiers, booléens et textuels | 1 |
| opération `+`, `-`, `*` sur float | 2 |
| opération `/`, `%` sur float | 8 |

Les tailles sont la longueur en octets UTF-8 d'un texte, la longueur d'une liste et le nombre d'entrées d'une carte ; toute autre valeur a une taille de 0. Le travail de méthode $w$ est fixé par la classe de complexité de la méthode dans l'évaluateur de référence : $n + k$ pour les méthodes linéaires sur les textes, les listes et les cartes (les cartes sont des listes d'associations ordonnées), $n \lceil \log_2 n \rceil$ pour `sort` (0 lorsque $n \le 1$), et 0 pour les méthodes restantes. Les appels que `map`, `filter` et `fold` font à leur argument de fonction sont facturés comme des appels supplémentaires. L'arithmétique se saturant à l'entier 128-bit le plus grand, et $w$ ne diminue jamais lorsque $n$ ou $k$ augmente. L'évaluateur de référence et les runtimes émis en Rust, Python et JavaScript calculent la même fonction, et un test vérifie que le piège de budget tombe sur la même opération dans les quatre.

**Une seule règle de coût.** Le coût d'un appel de méthode de bibliothèque standard est le coût unique du texte, dans chaque module et où que l'appel soit exécuté (spécification 2.7, C.15). La règle est lexicale au texte, pas au module, donc le lien des modules ne change aucun coût ; les tests le vérifient aux limites des modules dans les deux sens sur l'évaluateur de référence et sur les programmes émis en Rust, Python et JavaScript.

**Statut des théorèmes.** La spécification énonce les théorèmes T1 à T34 et enregistre exactement le statut de chacun. Les preuves sont en Lean 4 (v4.12.0, sans Mathlib) sur un calcul de noyau. Les mots utilisés pour le niveau d'un résultat sont les suivants. *Prouvé* signifie une preuve Lean sur la sémantique de base du langage. *Prouvé sur une sémantique* signifie une preuve Lean sur une sémantique à pas petit d'un noyau de RCE. *Modèle* signifie une preuve Lean sur un modèle abstrait non connecté à la sémantique RCE ou à l'évaluateur de référence. *Vecteurs* signifie que les résultats de l'évaluateur de référence sur les programmes générés sont vérifiés contre le modèle par le noyau Lean, ce qui est une correspondance sur des échantillons, pas une preuve sur l'évaluateur. *Testé* signifie un test différentiel sur les entrées déclarées. *Vérifié mécaniquement* signifie décidé par un programme, tel qu'un constructeur de tables LALR(1).

| | Énoncé | Niveau |
|---|---|---|
| T1 | déterminisme : un résultat par état et événement ; un résultat par tick de la sémantique de concurrence | prouvé |
| T2 | totalité de $\delta$, avec une borne explicite sur les étapes d'évaluation ; récursion structurale et composition bornée le long du graphe d'appel | prouvé (le noyau Lean n'a pas d'appels de fonctions utilisateur ; la récursion et la composition sont prouvées sur des modèles séparés) |
| T3 | l'état d'exécution est $\mathrm{foldl}(\delta_1, s_0, D)$ et le replay reproduit chaque hachage et sortie | prouvé |
| T4 | progression, y compris les ticks (une tâche se déplace, ou l'exécution se termine ou signale `Deadlock`) | prouvé |
| T5 | préservation, y compris la plage d'entiers de chaque champ écrit | prouvé |
| T6 | sécurité mémoire, chemins complets de prêt, aucun partage mutable entre tâches | prouvé pour le noyau de propriété et une sémantique instrumentée des chemins de prêt |
| T7 | indépendance des noms des hachages de logs, des ids et des choix de sélection | prouvé |
| T8 | atomicité : un événement refusé laisse l'état inchangé | prouvé |
| T9-L | les émetteurs de programmes (`rust`, `python`, `js`) s'accordent avec l'évaluateur de référence | prouvé pour l'émetteur Rust sur un noyau, comme une traduction vérifiée en MiniRust, une plongée profonde de l'ensemble émis de Rust ; que `rustc` implémente MiniRust est considéré comme fiable et testé ; les autres émetteurs sont testés |
| T10 | la grammaire est inambiguë | vérifié mécaniquement (LALR(1), 0 conflits, pour les deux versions) et échantillonné par un fuzzer |
| T11 | équité de sélection | prouvé sur le modèle de rotation |
| T12 | un handle linéaire est consommé exactement une fois sur chaque chemin | prouvé sur un modèle d'énoncé |
| T13 | les opérations f32 donnent les mêmes bits sur les cibles qui s'accordent sur IEEE 754 | prouvé pour la multiplication ; pour l'addition, la soustraction et la division, la propriété de ronde unique est le théorème de Figueroa, cité et non mécanisé |
| T14 | l'arithmétique vérifiée u64 est exacte dans la plage | prouvé |
| T15 | les itérateurs se terminent, respectent la limite de boucle et sont cohérents en préfixe | prouvé |
| T16 à T31 | concurrence de l'annexe C : déterminisme de `par`, commutation, réductions, liberté de blocage, délais, groupes de travail, horloges vectorielles, priorités, portées, acteurs, sessions, LVars, lots atomiques, répliques | prouvé sur une sémantique : T16, T17, T19a, T20, T23 ; prouvé sur un modèle de runs : T24 ; prouvé sur un calcul de session : T28 ; modèle : T18, T19b, T21, T22, T25, T26, T31 ; modèle avec vecteurs : T27, T29, T30. Aucun n'est une preuve sur l'évaluateur de référence Rust |
| T32 | replay étranger : pour chaque oracle, le replay du log égale l'exécution en direct, et un contrat d'answer s'applique à chaque réponse enregistrée | prouvé |
| T33 | `&mut` restauration en cas d'échec (F.4.4) : un appel échoué laisse l'état `&mut` de l'appelant comme à l'appel ; un appel retourné écrit de retour (la règle précédente de copie à chaque résultat est abandonnée) | prouvé |
| T34 | le passage de forme A-normalisée préservant l'ordre (ANF) avant chaque émetteur donne la même valeur, le même stockage et la même trace de charges et d'émissions | prouvé pour un fragment de noyau avec une ANF complète ; l'implémentation est testée différemment sur les cibles Rust, Python et JavaScript, y compris un balayage des budgets à travers le point de piège ; la sortie Scala passe par le même passage mais n'est pas testée dans ces tests |

T9-L est l'affirmation concernant les émetteurs de programmes du langage, que [§5.1](#51-differential-testing-of-the-program-emitters) décrit ; une cible en dehors de cet ensemble n'a pas de revendication T9. La spécification énonce également T9-F, pour les cibles du compilateur de Form de l'engine, et [§10](#10-work-to-finish) liste son test.

![Grille de 34 entrées, T1 à T34 avec T9 affiché comme T9-L et T19 divisé en T19a et T19b, chacun avec un niveau codé. Prouvé : T1, T2, T3, T4, T5, T7, T8, T14, T15, T32, T33 ; Prouvé pour un noyau ou fragment déclaré ; le reste testé ou cité : T6, T9-L, T13, T34 ; Prouvé sur une sémantique à pas petit d'un noyau de RCE : T16, T17, T19a, T20, T23 ; Prouvé sur un modèle nommé (modèle de rotation, modèle d'énoncé, modèle de runs, calcul de session) : T11, T12, T24, T28 ; Modèle : T18, T19b, T21, T22, T25, T26, T31 ; Modèle, avec des vecteurs d'évaluateur vérifiés par le noyau Lean : T27, T29, T30 ; Vérifié mécaniquement (tables LALR(1)) : T10.](/figures/rce/theorem-status.svg)

*Figure 3. Statut des théorèmes, T1 à T34. Niveau de chaque théorème tel qu'enregistré dans la spécification au commit public `ac95172` (brouillon 0.7) ; les théorèmes ajoutés après T34 ne sont pas montrés, et T9 est montré comme T9-L, la revendication concernant les émetteurs de programmes. `P` : preuve Lean sur la sémantique de base. `P*` : prouvé pour un noyau ou fragment déclaré, le reste testé ou cité. `S` : prouvé sur une sémantique à pas petit d'un noyau de RCE. `M+` : prouvé sur un modèle nommé (modèle de rotation, modèle d'énoncé, modèle de runs, calcul de session). `M` : preuve Lean sur un modèle abstrait. `MV` : modèle, avec des vecteurs d'évaluateur vérifiés par le noyau Lean. `C` : vérifié mécaniquement. T16 à T31 sont les théorèmes de concurrence de l'annexe C, et aucun n'est une preuve sur l'évaluateur de référence Rust. Lean 4 v4.12.0, sans Mathlib. Source : `spec/book/10-theorems.md` et l'annexe C.13. Une [copie PNG](/figures/rce/theorem-status.png) est fournie.*

**Les vérifications s'exécutent.** Au commit public `e416fd0`, `lake build` termine sur les 58 fichiers de `spec/lean/RCE/` sans `sorry` (46 fichiers au commit public `4304048`), et l'audit en cours signale les axiomes de 4 877 constantes de théorèmes comme uniquement `propext`, `Quot.sound` et `Classical.choice`. L'audit compte chaque constante de théorème dans l'environnement du noyau, y compris les constantes générées par l'élaborateur, donc elle diffère du compte des déclarations `theorem` et `lemma` dans la source, qui est de 1 116 au même commit. Au même commit, la source du vérificateur de référence contient 385 fonctions de test. Au commit public `ac95172`, la vérification de la spécification construit les tables LALR(1) de la grammaire de base (sections 2 à 10, 932 états) et de la grammaire avec l'annexe C (1 110 états) avec 0 conflits, accepte 51 des 51 exemples valides, refuse 12 des 12 rejets syntaxiques et 64 des 64 programmes mal typés ou inadmissibles, et parse chaque exemple avec trois parseurs, et la construction WebAssembly du vérificateur passe 401 des 401 vérifications contre les corpus d'exemples.

**Une observation de convergence.** Deux passes du 24 octobre 2026 ont catalogué 111 langages de programmation premiers rendus publics entre janvier 2024 et octobre 2026 [189, 190] : 72 conçus pour les modèles de langage ou les agents comme auteurs ou implémentés principalement par un agent (48 provenant du catalogue agentlanguages.dev [166], lu dans son dépôt de source, et 24 au-delà), et 39 langages généraux ou systèmes, avec 35 langages antérieurs à 2024 atteignant une étape dans la fenêtre. Parmi les entrants écrits par des agents, le compte par année est de 3, 10 et 57 pour 2024, 2025 et 2026. Deux positions sont presque universelles : le refus d'entrée invalide à une limite (54 sur 72) et l'émission vers un autre langage (57 sur 72 ; 17 sur 39 entrants généraux, avec Go comme cible de 2026 et C comme défaut système). Les minorités adoptent une forme canonique (25 sur 72), des exemples ou tests à l'intérieur du programme (21 sur 72 ; 2 sur 39), une spécification écrite comme définition autoritaire (16 sur 72 ; 14 sur 39), une évaluation déterministe comme porte déclarée (13 sur 72 ; 3 sur 39, parmi lesquels Gossamer, Dawn et Wyzer) et une sécurité mémoire sans collecteur (8 sur 72 ; 7 sur 39, convergent vers un comptage de référence précis ou la propriété plutôt que les annotations de durée de vie, avec les piles de données de Goose comme exception [191]). Un journal append-only avec replay (5 sur 72 ; aucun sur 39) et des définitions identifiées par hachage (2 sur 72 ; 3 sur 39, Bend, Scrapscript et Dawn [192]) sont rares, et une forme intermédiaire comme source de vérité est absente des nouveaux langages généraux. Une tendance distincte de 2025 et 2026 est les langages dont les compilateurs ont été écrits principalement par des agents de modèle et déclarés comme tels, parmi lesquels Goose, Rue, Cursed et Jolt, dont les affirmations de performance sont auto-déclarées. Les choix de conception de cet article se répètent donc là où ils sont peu coûteux (un résultat déclaré pour chaque entrée à la limite, impression vers un langage hôte) et restent rares là où ils sont des théorèmes ici (une forme canonique, des exemples comme partie du programme, replay à partir d'un journal enchaîné par hachage, une identité sans nom). C'est une observation que les choix se répètent et là où ; ce n'est pas une preuve qu'ils sont corrects, et cet article ne fait aucune comparaison de qualité avec ces projets. La proposition de registre d'émission du dépôt de spécification liste chaque entrant comme une cible et une source sur les mêmes termes que chaque autre langage ; aucun d'eux n'est levé ou émis aujourd'hui ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)).
<div id="38-behaviour-equivalence-and-dimension" class="anchor-alias" aria-hidden="true"></div>

### 3.8 Comportement, équivalence et dimension

La définition 3 indique que deux ajustements sont équivalents lorsque leurs séquences de sortie coïncident sur chaque séquence d'événements. Cette section donne à cette définition une propriété universelle, définit la dimension d'un programme comme un nombre calculé, et signale les mesures enregistrées de celle-ci. Le texte normatif est la section 6.10 de la spécification (brouillon 0.9, commit `45fc95c`), avec les théorèmes T57 à T61 et la commande `rce dim`.

**Comportement comme point dans la coalgèbre finale.** Fixons un programme $P$ avec un espace d'états $S$, un alphabet d'événements $E$ et $\delta : S \times E \to S \times O^*$, et écrivons $\delta_1 = \pi_1 \circ \delta$ et $\lambda = \pi_2 \circ \delta$ comme dans la définition 1. Le comportement d'un état $s$ est la fonction $\mathrm{beh}_P(s) : E^* \to (O^*)^*$ avec $\mathrm{beh}_P(s)(\varepsilon) = \varepsilon$ et $\mathrm{beh}_P(s)(e \cdot w) = \lambda(s, e) \cdot \mathrm{beh}_P(\delta_1(s, e))(w)$: les sorties par étape le long de toute séquence d'événements. $(S, \langle \lambda, \delta_1 \rangle)$ est une coalgèbre du foncteur $F(X) = (O^* \times X)^E$; $F$ a une coalgèbre finale $\mathrm{Beh}$ dont le porteur est l'ensemble des fonctions de flux causal, et $\mathrm{beh}_P$ est l'unique morphisme de coalgèbre $S \to \mathrm{Beh}$ (Rutten [144], Théorème 2.3). Deux ajustements sont équivalents, $F \equiv G$, lorsque $\mathrm{beh}_F(s_0^F) = \mathrm{beh}_G(s_0^G)$. C'est la définition 3 reformulée; le nouveau contenu est que $\equiv$ est l'égalité dans un objet que chaque Forme, dans chaque langue d'ajustement, mappe par la même construction. L'espace de comportement n'est pas une variété: il porte la métrique ultramétrique du préfixe $d(b_1, b_2) = 2^{-n}$, $n$ la longueur de la plus courte séquence d'événements discriminante, sous laquelle il est complet et totalement déconnecté [145]. L'accord des traces sur chaque séquence de longueur au plus $k$ certifie donc $d \le 2^{-(k+1)}$: une boule autour du comportement, pas le comportement lui-même. C'est ce que les tests différentiels de [§5.1](#51-differential-testing-of-the-program-emitters) établissent, et il n'entre jamais dans un hachage.

**Deux méthodes de preuve.** Une relation $R \subseteq S \times S$ est une bisimulation pour $P$ lorsque $s\,R\,t$ implique, pour chaque $e$, $\lambda(s, e) = \lambda(t, e)$ et $\delta_1(s, e)\,R\,\delta_1(t, e)$. T58 indique que $\mathrm{beh}_P(s) = \mathrm{beh}_P(t)$ si et seulement si une bisimulation relie $s$ et $t$: pour montrer deux ajustements équivalents, exhiber la relation; pour les montrer différents, exhiber une séquence discriminante, qui donne également la distance. T1 et T2 (totalité et déterminisme) sont exactement la complétude et le déterminisme qui rendent la machine minimale unique; une machine mal spécifiée n'a pas de minimum unique [146].

**Dimension.** $\mathrm{reach}(P)$ est l'ensemble des états atteignables à partir de $s_0$; il est fini car $S$ est fini sous les limites de valeur et de taille de la spécification (N9). La dimension de $P$ est

$$\dim(P) = |\{\mathrm{beh}_P(s) : s \in \mathrm{reach}(P)\}|,$$

le nombre de comportements distincts que $P$ peut avoir, qui est l'indice de Nerode de sa machine de Mealy minimale [147], calculable pour un alphabet explicite en $n \log n$ [148]. $\log_2 \dim(P)$ est le nombre de bits d'état que le comportement nécessite; $\log_2 |\mathrm{reach}(P)| - \log_2 \dim(P)$ est la *redondance* de l'ajustement, les bits d'état qui ne changent aucune sortie future. Une dimension de contrôle $\dim_c(P) \le \dim(P)$ est définie sur la projection qui remplace chaque garde sur $\Sigma_d$ par son symbole de prédicat, un automate fini symbolique [149], et sa machine minimale, numérotée par un parcours en largeur dans l'ordre d'événement canonique, a une chaîne unique sans nom [150]; son SHA-256 sur JSON canonique est `shape_ctl`, une troisième clé à côté de l'hachage du terme sans nom et de la clé e-class de la définition 6. L'égalité à toute clé implique l'équivalence; l'inégalité implique rien.

Ce qui est et ce qui n'est pas un théorème ici devrait être dit clairement. $S$ et $E$ sont finis par les limites de valeur et astronomiquement grands: $|S| \le 256^{\mathrm{VALUE\_LIMIT}}$ par champ, donc la finitude rend chaque question comportementale décidable et aucune d'entre elles tractable. La machine minimale est une forme canonique pour la projection à contrôle fini, où la minimisation des automates symboliques est unique jusqu'à l'équivalence des prédicats [149]; pour les champs qui ne sont que comparés et copiés, les automates enregistreurs donnent un théorème de Myhill-Nerode [151]; le moment où $\delta$ fait de l'arithmétique entière dans l'état, l'unique objet canonique est le terme lui-même. «Chaque Forme est une machine de Mealy finie, et sa machine minimale est sa forme canonique» est donc vrai comme énoncé pour $\Sigma_c$ plus les prédicats de garde et n'est pas une affirmation calculable pour $\Sigma_d$. C'est également la lecture honnête de la proposition 3: l'extraction de moindre-joule renvoie le terme de moindre-joule *que l'extracteur trouve*, et trois fonctions distinctes sont définies sur une e-class: les unités budgétaires aveugles à la cible de la spécification C.6, qui placent le piège budgétaire sur la même opération dans chaque exécution et ne sont jamais des joules; `est_j`, qui est par cible ([§6.3](#63-energy)); et le représentant haché, choisi par le coût d'arbre avec un dénouement canonique-JSON pour la reproductibilité. Le terme émis et le terme haché d'une e-class peuvent différer; aucun ne peut différer entre moteurs donnant le même journal.

**Statut des théorèmes.** T57 (finalité: $\mathrm{beh}_P$ est le morphisme de coalgèbre unique), T58 (l'équivalence est la bisimilarité), T59 (l'accord de trace jusqu'à la longueur $k$ borne la distance par $2^{-(k+1)}$), T60 (pour $S$ fini, le quotient de $\mathrm{reach}(P)$ par la plus grande bisimulation est la machine minimale, avec $\dim(P)$ états) et T61 (`shape_ctl` est invariant sous le renommage et sous les réécritures équivalentes des prédicats des gardes) sont énoncés au chapitre 10 de la spécification, et `spec/lean/RCE/Behaviour.lean` est dans `lake build` (Lean 4.12.0; au commit public `f2bd7222`, `scripts/lean-audit.sh` lit 5,052 théorèmes avec des axiomes standards uniquement et aucun `sorry`). Ce qui est prouvé, dans l'étendue exacte du chapitre: l'équation du morphisme de T57 (`beh_cons`; l'unicité du morphisme est énoncée, non prouvée); T58 pour un programme et pour deux (`bisim_beh`, `beh_bisim`, `behEq_iff_bisim`, `bisim2_beh`, `beh_bisim2`); et T59 dans les deux sens sur un alphabet fini explicite, les événements déclarés sur les ensembles de limites que `rce dim` explore (`trace_ball`, `ball_trace`), avec l'énoncé sur tout $E$ énoncé, non prouvé. T60 est énoncé, avec une preuve modélisée par affinement de partition comme étape suivante. T61 est testé uniquement pour le renommage, contre la projection sans nom `rce fmt --nameless`, qui imprime un programme avec des noms positionnels par type dans l'ordre de déclaration première et est accepté chaque fois que la source l'est, avec les mêmes hachages de trace par T7; son invariance sous les réécritures des gardes est énoncée, non prouvée, et le quotient symbolique n'est pas implémenté.

**`rce equiv`: le test d'équivalence comme outil.** `rce equiv A B` explore deux programmes à partir de leurs états initiaux sur les mêmes instances d'événements, compare chaque étape par sa sortie sans nom (valeurs émises en forme positionnelle, un refus par l'indice de déclaration de l'erreur, T7), affine les deux graphes ensemble et lit si les deux états initiaux tombent dans une classe (T58); lorsqu'ils ne le font pas, il imprime la plus courte séquence d'événements discriminante et les deux sorties à sa fin. `rce change OLD NEW` le combine avec la différence d'export de F.4.3 et classeifie un changement comme un erratum (tous les exports compatibles, toutes les comportements conservés), un changement de sens ou un changement d'interface, qui est la règle de C.15 décidée par l'outil. Exécuté entre chaque programme du corpus et sa projection sans nom comme étape de vérification continue, le test a trouvé un programme dont la projection a été refusée (un champ d'état nommé comme une méthode de bibliothèque standard a renommé la méthode); la projection a été corrigée et le balayage signale chaque Forme du corpus équivalente à sa projection, comme l'indique T7. C'est la version de la vérification d'équivalence du Forme que le design matériel exécute sur chaque révision ([§3.7](#37-the-language-one-text-costs-and-theorem-status)): un changement sous lequel chaque programme conserve son comportement est un erratum, tout autre un changement de sens, décidé par l'outil plutôt que par un numéro de version. Avec `rce hash`, qui imprime un hachage du programme sur la projection sans nom (un hachage pour un programme et son renommage, un autre pour un pas changé), et la ligne de provenance que chaque fichier émis porte maintenant, les trois mécanismes que le record appelle rares dans les nouvelles langues (section 3.7) sont des commandes du vérificateur de référence.

**`rce dim`, et les exécutions enregistrées.** `rce dim FILE [--fuel n] [--control]` explore $\mathrm{reach}(P)$ en largeur d'abord sur les événements déclarés avec des payloads tirés de chaque type de raffinement de champ ou, sans un, du jeu de limites de la spécification 6.3, jusqu'à `--fuel` états, puis exécute l'affinement de partition de Hopcroft avec les sorties comme partition initiale (100,000 états en 10 à 40 s; la première itération de Moore était quadratique et n'a pas terminé), et signale les états explorés, les comportements (exactement lorsque la borne n'est pas atteinte, sinon une borne inférieure), la redondance en bits par région, et avec `--control` les états de contrôle et `shape_ctl`. Trois exemples ont été écrits avec des valeurs connues: un compteur avec un drapeau non lu (1.00 bit de redondance), un compteur mod-6 qui émet la parité (1.58 bits), et une porte avec trois états atteignables et aucune redondance. La préenregistrement (`openie-research-experiments/rce/bench/dimension/PREREG.json`, enregistré le 22 octobre 2026 avant que la commande n'ait été construite et amendée avant chaque exécution ultérieure, avec un sidecar haché) fixe les populations et trois hypothèses sur les programmes bornés dont les étapes explorées émettent ou refusent: H0, que la moitié d'entre eux portent plus de 0.5 bit de redondance; H1, qu'un programme avec un seul site d'émission porte plus de redondance qu'un programme avec plusieurs; et H2, qu'une région porte au moins 80% de la redondance lorsqu'elle dépasse 1 bit. Son falsificateur est RCE-F6 de [§9](#9-falsifiers), une redondance médiane inférieure à 0.1 bit. Les exécutions rapportées ici, `dim-r2` à `dim-r5`, ont été faites une fois chacune avec `--fuel 100000 --control`, contre une construction d'un commit public de openIE-dev/rce, avec l'hachage binaire enregistré dans chaque ligne; la première exécution enregistrée, `dim-r1`, et le pilote avant sont listés dans [§10](#10-work-to-finish). L'étiquette de contrôle est le refus ou les constructeurs émis uniquement, et $\dim_c \le \dim$ tient sur chaque ligne de ces exécutions. Dans une machine d'états dont les exemples lisent l'état, elle n'émet jamais; l'intention est portée par les exemples et par aucune sortie; un rapport de `rce check` qui nomme un tel `example` (un qui lit un champ que pas un pas n'émet ou ne refuse jamais) est une proposition ouverte.

**Les exécutions figées.** L'exécution `dim-r2` du 23 octobre 2026 (commit `1107442b` de openIE-dev/rce, enregistré comme une deuxième amendation de la même préenregistrement avant l'exécution, avec la strate lue à partir de la clé que `rce dim` a rapportée comme `observable` à ce commit, maintenant `has_output`) échantillonne la strate portant des sorties par règle: chaque programme du dépôt fusionné sous ses exemples, programmes, applications et listes de livres qui est accepté seul, a une région d'état et contient une émission ou une défaillance. Cela fait 25 programmes, 24 d'entre eux portant des sorties, 14 bornés à l'intérieur de 100,000 états. Parmi eux, `ring_buffer` a 12,500 états atteignables, 781 comportements et cinq états de contrôle; quatre bits de son état ne changent aucune sortie, tous dans une région, et sa projection de contrôle, qui enregistre uniquement les étapes qui déclenchent, a cinq états. En excluant les trois programmes écrits pour `rce dim` et leurs copies de livre, il reste 8 programmes bornés portant des sorties, dont 6 portent plus de 0.5 bit (intervalle de Wilson 95% 0.41 à 0.93), avec une redondance médiane de 1.79 bits (intervalle interquartile 0.25 à 3.37); sur tous les 14, 10 de 14 (0.45 à 0.88) et une médiane de 1.29 bits. RCE-F6 (une médiane inférieure à 0.1 bit) n'est pas déclenchée; l'extrémité inférieure de l'intervalle est inférieure à la moitié, donc H0 est soutenue et non établie à cette taille. H1 n'est pas soutenue (les deux programmes à un seul site d'émission portent 1.58 et 4.00 bits, les deux programmes à plusieurs sites 2.51 et 3.65), et H2 tient sur 8 des 9 lignes qualifiées uniquement parce que 8 ont une seule région d'état; le seul programme à deux régions attribue 62% de sa redondance à sa région plus grande. L'ajout substantiel de cette exécution sont trois mesures de taille d'application. L'application de chat explore 100,000 états avec 176 comportements et 69 états de contrôle, donc au moins 9.15 bits de son état ne changent aucune sortie, la plus grande redondance mesurée et une borne inférieure; l'unité de transfert sélectif (40,218 états, 7,038 comportements, 2.51 bits) et le terminal (3,390 états, 270 comportements, 3.65 bits) sont exacts. Le rapport des états de contrôle aux comportements varie d'une ordre de grandeur à travers la population (5 à 781 pour le tampon circulaire, 69 à 176 pour le chat, 5,095 à 7,038 pour l'unité de transfert), ce qui mesure combien d'un comportement d'un programme est quelles étapes déclenchent contre quelles valeurs circulent. L'exécution montre également que la strate a besoin d'une règle enregistrée plus fine: le drapeau de l'outil est vrai pour un programme dont chaque sortie est la même (une constante, ou un refus que chaque état donne), donc une troisième exécution devrait enregistrer «portant des sorties, avec plus d'une sortie distincte» avant d'échantillonner. Les lignes, les intervalles et l'amendement sont dans le dépôt d'expériences sous `rce/bench/dimension/` (`results/dim-r2.jsonl`, `RESULTS.md`). Une troisième exécution, `dim-r3` (23 octobre 2026, enregistrée avant), a appliqué la règle plus fine que la deuxième exécution demandait: `rce dim` rapporte le nombre de sorties distinctes (`distinct_outputs`; valeurs émises et refusées comptées séparément comme `emits` et `refuses`), et la strate est portant des sorties avec au moins deux d'entre elles. Sur 28 programmes (la population de la deuxième exécution plus les trois programmes acceptés avec deux ou plus de régions d'état), 22 sont strictement portant des sorties et 12 de ceux-ci sont bornés; la redondance médiane est de 1.29 bits (8 de 12 au-dessus de 0.5 bit, Wilson 0.39 à 0.86), et 2.05 bits sur les 6 non écrits pour l'outil. Les trois programmes que la règle plus fine a supprimés (un thermostat, un conciliateur et un panier) sont chacun observables uniquement par une constante, donc les médianes de la deuxième exécution ont compté des bits qui changent une sortie qui ne change jamais du tout. H2 est testé là où il peut l'être, sur le seul programme strictement portant des sorties à plusieurs régions au-dessus de 1 bit, dont la région plus grande porte 62%, en dessous du seuil de 80%; il reste ouvert sur une ligne. Une quatrième exécution sur les 86 programmes de conformité avec état (enregistrée avant) a mesuré les cinq programmes d'hôte-contract harvessés pour la première fois, tous bornés dans le carburant et portant de 0.01 bit (le pilote de terminal) à 2.16 bits (le pilote de canal) avec des quotients de contrôle dans les milliers, et a répondu à la question de plusieurs régions pour ce corpus: les seuls programmes strictement portant des sorties à plusieurs régions sont des copies distinguées par les données d'un exemple de capacité, donc H2 ne peut pas être décidé à partir du matériel public existant et l'étape suivante est d'écrire des programmes observables à plusieurs régions, enregistrés comme une population avant l'exécution. Cette étape a été prise le 24 octobre 2026: douze programmes à deux régions (un ascenseur, une machine à vendre, un passage, un parking, une imprimante, un hall, une carte bancaire, un lave-linge, une session, un joueur, un contrôleur climatique et un réservoir) ont été écrits dans le corpus des programmes et enregistrés comme la cinquième exécution, avec la divulgation que l'outil avait été exécuté sur les brouillons. Tous les douze sont strictement portant des sorties, bornés et explorés en millisecondes; onze ont une redondance nulle et le douzième, le contrôleur climatique, garde 1.58 bits dans deux drapeaux qui enregistrent son dernier action et que rien ne lit. La médiane est de 0.00 bits, donc RCE-F6 est déclenché sur cette population: l'état accidentel n'est pas courant dans les petits Forms dont les caps sont enforcés par des refus et dont les phases émettent. Lire avec les exécutions précédentes (1.29 bits sur les exemples strictement portant des sorties manuscrits, 0.01 à 2.16 bits pour les programmes d'hôte, au moins 9 bits pour l'application de chat), la quantité croît avec la taille du programme et avec le nombre de champs que rien ne lit. L'affirmation que les données soutiennent est celle du falsificateur lui-même: `rce dim` est un diagnostic pour les grands programmes et pour les régions ajoutées sans observateur, pas une propriété des petits Forms en général.

**Le registre du concept.** La spécification 6.6 décrit maintenant un tableau latéral non haché indexé par les clés sans nom d'un programme et conservant ses noms, ses chaînes d'intention et ses commentaires de documentation, et `rce emit form` l'imprime sous `names`, indexé par l'indice de déclaration (l'indice que `shape_ctl` utilise), après les champs hachés. Les projections le rendent; $\delta$ ne le lit jamais; c'est le complément qui rend la projection d'une Forme un lentille symétrique [123] plutôt qu'une rétraction. Les preuves de [§2.1](#21-programming-is-coding-theory) disent que le tableau doit conserver le concept que le nom représente et non seulement son orthographe, car le choix de mots et l'ordre sont les deux étapes sur lesquelles les développeurs sont en désaccord à 6.9% [137] et l'étape sur laquelle ils s'accordent est le concept. Le fait qu'un modèle puisse raisonner à partir de la Forme avec le registre attaché ainsi qu'à partir d'une surface nommée est la première des trois expériences enregistrées de [§12.3](#123-why-human-written-code-is-redundant) et est ouverte.
<div id="4-the-engine-gears-gate-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## 4. Le moteur : engrenages, porte et reçus

Cette section décrit la conception du moteur, définie par l'annexe D de la spécification et ses propositions.

<div id="41-the-engine-is-a-form" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Le moteur est une Forme

RCE exécute des logiciels sous forme d'un graphe de gestionnaires déterministes petits. Un gestionnaire qui ne peut pas décider soulève une escalade. Un résolveur répond à l'escalade une fois, et la réponse est installée comme un gestionnaire permanent, donc le cas suivant de la même forme s'exécute sans résolveur. La conception exige que le moteur respecte chaque invariant de Forme :

| Invariant | Ce que la conception exige du moteur |
|---|---|
| Le rechargement est un pli vérifié | Le rechargement lit le journal littéralement, recalculer chaque hachage et lien, et plie le reste avec $\delta$. Rien n'est re-stampé. Une chaîne brisée refuse de charger. |
| Ordre de tick sans nom | Les gestionnaires s'exécutent dans l'ordre de rang topologique, puis par une clé de nœud sans nom. Les sorties sont étalées et livrées après que tous les gestionnaires aient exécuté, comme dans la sémantique ASM. Le renommage de chaque nœud donne le même hachage d'état anonyme à chaque entrée. |
| Aucun rejet silencieux | Un courrier électronique complet garde le message dans une file d'attente ordonnée et loggue `Backpressure`, et chaque tâche se ferme toujours. |
| Les payloads sont dans le journal | Les entrées, les ticks, les résultats des gestionnaires externes, les installations et les pannes sont des entrées du journal. Le hachage d'état après chaque entrée correspond à un pli à partir d'un moteur vide. |
| Horloge logique | Les comptes de vivacité comptent les ticks, pas le temps mural. |
| Hachages stables | SHA-256 (Secure Hash Algorithm, 256-bit) sur JSON canonique, les clés triées à chaque profondeur, pour les entrées, les états, les formes et les identifiants de règles. |

<div id="42-the-gears" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Les engrenages

Chaque engrenage est essayé uniquement lorsque l'engrenage en dessous ne passe pas la porte. Cet ordre est une cascade fixe.

| Engrenage | Méthode | Lignée |
|---|---|---|
| G0 Lookup | Une bibliothèque partagée de gestionnaires indexée par le hachage SHA-256 de forme ; pour la réparation de code, la localisation vers des fonctions classées | Recherche et récupération de code [21] |
| G1 Règles | Modèles de réparation déterministes, garantis et validateurs dérivés de schéma, chacun vérifié pour la sensibilité à la mutation | PAR, TBar, AVATAR, FixMiner [22, 23, 24, 25] ; des modifs de code tels que Coccinelle [26] |
| G2 Synthèse | Énumération sur la grammaire du gestionnaire, solveurs et e-graphs | Sketching, SyGuS, egg [27, 9, 12] |
| G3 à G5 Modèles | Un modèle de décision typé, un petit modèle local, puis un modèle distant, dernier | Cascades de modèles [28] |

<div id="43-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.3 La porte

Un candidat n'est promu que lorsqu'il passe la porte. La porte relance les entrées enregistrées du nœud, exécute le candidat en ombre sur des échantillons frais avec une borne de couverture (la règle des trois à un budget d'erreur déclaré), vérifie le schéma de sortie et exige le certificat de preuve de la Section 5. Un candidat rejeté est enregistré avec son contre-exemple.

![Diagramme. Quatre boîtes d'engrenages empilées du moins coûteux au plus coûteux : G0 Lookup, une bibliothèque partagée de gestionnaires indexée par le hachage SHA-256 de forme ; G1 Règles, modèles de réparation garantis et validateurs dérivés de schéma ; G2 Synthèse, énumération sur la grammaire du gestionnaire, solveurs et e-graphs ; G3 à G5 Modèles, un modèle de décision typé, un petit modèle local et un modèle distant, marqués comme proposants uniquement. Chaque engrenage envoie son candidat à une porte avec cinq vérifications : relance des entrées enregistrées, une exécution en ombre sur des échantillons frais avec une borne de couverture, une vérification du schéma de sortie, le certificat de vérification du noyau avec Kani, un vérificateur de modèles pour Rust, et pour les réécritures une vérification aléatoire puis une preuve par le solveur SMT Z3. Un passage promeut le candidat en tant que gestionnaire stocké, qui alimente G0 ; un échec est enregistré avec son contre-exemple et escalade vers l'engrenage suivant.](/figures/rce/gears-gate.svg)

*Figure 4. Les modèles proposent, les vérificateurs décident. Diagramme : les engrenages s'exécutent dans l'ordre du coût : G0 Lookup, G1 Règles, G2 Synthèse, G3 à G5 Modèles (un modèle de décision typé, un petit modèle local, puis un modèle distant). Chaque candidat passe par la même porte : relance des entrées enregistrées du nœud, une exécution en ombre sur des échantillons frais avec une borne de couverture, une vérification du schéma de sortie et le certificat de vérification du noyau avec Kani, un vérificateur de modèles pour Rust (Section 5.3) ; une réécriture proposée nécessite également une vérification aléatoire puis une preuve par le solveur SMT Z3 (Section 5.2). Un candidat qui passe est promu et ferme la même forme à G0 la prochaine fois ; un candidat qui échoue est enregistré avec son contre-exemple et l'engrenage suivant est essayé. Dans la conception, les harnais Kani et l'encodage SMT ne changent pas lors de la promotion. Source : Sections 2.2, 4.2, 4.3, 4.6, 5.2 à 5.5. Une [copie PNG](/figures/rce/gears-gate.png) est fournie.*
<div id="44-receipts" class="anchor-alias" aria-hidden="true"></div>

### 4.4 Reçus

Chaque promotion, refus, report et installation est une mutation dans un journal à l'ajout uniquement, chaîné avec SHA-256, donc toute altération d'une entrée passée brise la chaîne [29, 30]. Le coût de chaque gestionnaire est évalué à partir des comptes d'opérations de l'interprète avec un tableau de coûts par hôte et étiqueté `est_j`. Le chef de chantier est le résolveur des escalades de l'engin, qui exécute les engrenages dans l'ordre sur chacune d'elles, et chaque appel de celui-ci porte un reçu. Un reçu nomme l'engrenage, la méthode de l'estimation (`basis`), les candidats essayés et si l'engrenage a résolu l'escalade. Son champ `est_j` est requis : il s'agit d'un nombre non négatif fini, ou null, et null est autorisé uniquement lorsque `basis` indique `unpriced`, comme pour un appel de modèle sans figure d'énergie. Un reçu manquant ce champ ne peut pas être analysé. Un coût non évalué n'est jamais lu comme zéro, donc un total sur les reçus signale séparément ses invocations évaluées et non évaluées, et un gain dépendant d'une résolution non évaluée est signalé comme inconnu.

![Diagramme. Haut : trois entrées de journal, seq 0, 1 et 2, chacune avec les champs seq, event, prev_hash, state_hash et hash. Le premier prev_hash est 64 zéros ; chaque prev_hash suivant est égal à l'hash de l'entrée précédente, représenté par des flèches. state_hash est le SHA-256 de l'état après l'étape ; hash est le SHA-256 du JSON canonique de event, prev_hash, seq et state_hash. Bas : un reçu d'engrenage avec les champs gear, gear_name, est_j, basis, candidates_tried et resolved, à côté de la règle que est_j est requis et est soit un nombre non négatif fini, soit null, avec null autorisé uniquement lorsque basis indique unpriced ; un coût non évalué n'est jamais lu comme zéro joule.](/figures/rce/receipt-chain.svg)

*Figure 5. Le journal est une chaîne d'hash ; chaque coût porte une base. Diagramme : les entrées du journal durable D sont `{seq, event, prev_hash, state_hash, hash}`. `state_hash` est le SHA-256 du JSON canonique de l'état après l'étape ; `hash` est le SHA-256 du JSON canonique de `{event, prev_hash, seq, state_hash}` ; le premier `prev_hash` est 64 zéros, donc toute modification d'une entrée passée modifie chaque hash ultérieur. Un reçu d'engrenage porte `gear`, `gear_name`, `est_j`, `basis`, `candidates_tried` et `resolved`. `est_j` est requis et est un nombre non négatif fini, ou null uniquement lorsque `basis` indique unpriced ; les reçus d'appel de modèle portent `est_uj` en microjoules sous la même règle. Un coût non évalué n'est jamais lu comme 0 J. Les étiquettes d'hash sont symboliques. Source : spécification 6.1 et Section 4.4. Une [copie PNG](/figures/rce/receipt-chain.png) est fournie.*

<div id="45-the-form-compiler" class="anchor-alias" aria-hidden="true"></div>

<div id="45-the-compilers" class="anchor-alias" aria-hidden="true"></div>

### 4.5 Les compilateurs

Le compilateur du langage est le vérificateur de référence `rce emit TARGET FILE` (spécification 10.5). Il traduit un module qui passe `rce check` en un des cinq outputs : `form`, la Forme $P = (S, E, \delta, D, \lambda)$ comme une ligne de JSON canonique, une fonction déterministe du texte du programme ; et quatre programmes, `rust` (un seul fichier source Rust), `python` (un seul fichier Python 3), `js` (un seul module JavaScript pour Node) et `scala` (un seul fichier Scala 3 pour la machine virtuelle Java). Les émetteurs de programmes traduisent le module vérifié, pas la Forme, et chaque sortie est autonome. Chaque cible est générée. Aucune n'est rédigée. Les quatre ne sont pas au même niveau. Sur le jeu de tests de conformité du dépôt de spécification (`conformance/reports/` à la version publique `464bd98b`), les sorties Rust, Python et JavaScript passent chacune 1 459 tests sans échec, et les autres 520 ne s'appliquent pas à un émetteur (admission, le contrat de l'hôte, la réplication et les commandes d'outils). La sortie Scala passe 52 tests, échoue 1 189 et a 591 non pris en charge sur 1 832 résultats ; 1 186 des échecs sont dus à la sortie Scala ou à l'exécution du build ou de l'exécution avec le statut 2 plutôt qu'une valeur comparée, et ces résultats datent de la conversion du jeu de tests aux règles d'un seul langage de [§3.7](#37-the-language-one-text-costs-and-theorem-status). La Scala est donc émise mais ne correspond pas encore à la référence, et elle n'a pas de revendication T9.

La spécification 6.3 fixe un comportement à chaque bord numérique, que chaque cible doit reproduire : l'arithmétique entière vérifiée piège sur débordement du type statique et ne se déroule jamais ; l'entier `/` tronque vers zéro ($-7/2 = -3$) ; `%` prend le signe du dividende ($-3 \bmod 2 = -1$) ; la division par zéro piège ; les flottants sont IEEE 754 binary64, correctement arrondis une fois par opérateur, et un résultat non fini piège ; le temps est uniquement l'horloge logique.

Dans la conception de l'engin, un second compilateur réduit une spécification de gestionnaire et son ajustement à travers un e-graph en une IR de Forme et la projette vers d'autres cibles ; son test est listé dans [§10](#10-work-to-finish).
<div id="46-method-the-whole-stack-evaluated-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 4.6 Méthode : l'ensemble de la pile évalué, chaque hypothèse d'interface explicite

Un programme est une pile de niveaux : le texte source et les déclarations ; les gestionnaires ; la Forme, une seule fonction de pas $\delta : S \times E \to S \times O^*$ sur $S = \Sigma_c \times \Sigma_d$ (régions de contrôle ; données : l'horloge, le nombre d'entrées et les relations typées) ; le journal, une chaîne d'hachage SHA-256 dont les entrées enregistrent chaque événement, l'hachage de l'état qu'il a produit et l'hachage de l'entrée précédente ; les réécritures qui transforment la Forme ; et le substrat qui l'exécute. Chaque niveau repose sur des hypothèses concernant le niveau inférieur. Dans la conception, RCE ne traite aucun niveau comme fixe : il évalue l'ensemble de la pile, écrit chaque hypothèse d'interface comme une affirmation vérifiable et la vérifie à chaque exécution. Aujourd'hui, les outils publics vérifient la chaîne de journal lors de la relecture (`rce host replay`) et comparent les programmes Rust, Python et JavaScript émis avec la référence ; les autres vérifications du tableau ci-dessous sont détaillées ([§5.2](#52-the-proof-rule-for-rewrites) à §5.4 ; pour le contrat d'entrée, [§10](#10-work-to-finish) point 15).

| Frontière | Hypothèse | Vérification |
|---|---|---|
| source vers gestionnaire | une entrée satisfait son contrat source | la vérification du contrat à l'événement d'entrée de δ |
| gestionnaire vers sortie | chaque sortie Ok satisfait le schéma de sortie | preuve du gestionnaire : évaluation par l'évaluateur du noyau, que la conception exige d'être totale et déterministe et vérifiée avec un vérificateur de modèle ([§5.3](#53-model-checking-of-the-kernel)) |
| journal vers état | chaque entrée porte l'hachage de l'état qu'elle a produit | pli du noyau, qui refuse la première entrée dont l'hachage ne correspond pas ([§5.3](#53-model-checking-of-the-kernel)) |
| réécriture vers Forme | une réécriture préserve la sortie pour chaque entrée | vérification aléatoire, puis une preuve SMT ([§5.2](#52-the-proof-rule-for-rewrites)) |
| stub vers foreman | un gestionnaire qui ne peut pas décider escalade plutôt que choisir un résultat qu'il ne peut pas décider | les gestionnaires stub émettent des escalades ; les résolutions ne sont promues que via le chemin de promotion |
| Forme vers cible | chaque cible émise calcule le même δ | les sorties du programme émis, et l'hachage de la dernière entrée de son journal, sont égales à la référence ; aujourd'hui, cela est vrai sur le jeu de tests de conformité pour Rust, Python et JavaScript, mais pas pour Scala ([§4.5](#45-the-compilers)) |

Une vérification échouée localise la rupture à la frontière où elle se produit. La correction est faite à ce niveau, passée par la vérification de cette frontière, et promue. Chaque niveau au-dessus du niveau corrigé hérite de la correction sans modification supplémentaire, car chaque niveau au-dessus consomme le niveau corrigé uniquement via l'interface dont l'hypothèse est désormais vérifiée. C'est ainsi que les corrections se propagent vers le haut et s'accumulent.

<div id="5-verification" class="anchor-alias" aria-hidden="true"></div>

## 5. Vérification

<div id="51-five-targets-one-trace" class="anchor-alias" aria-hidden="true"></div>

<div id="51-differential-testing-across-five-targets" class="anchor-alias" aria-hidden="true"></div>

<div id="51-differential-testing-of-the-program-emitters" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Test différentiel des émetteurs de programmes

T9-L affirme que les émetteurs de programmes `rust`, `python` et `js` sont d'accord avec l'évaluateur de référence. Pour l'émetteur Rust, cela est prouvé sur un cœur, comme une traduction vérifiée en MiniRust, une profonde intégration de sous-ensemble de Rust émis ; que `rustc` implémente MiniRust est considéré comme fiable et testé. Pour les émetteurs Python et JavaScript, cela est testé : la sortie du programme émis est égale aux observations de l'évaluateur de référence pour chaque ligne du programme exemple, ligne par ligne (une ligne par constante, vérification, fonction sans argument, événement exemple et sortie de `fn main`), et sur le jeu de tests de conformité, ses sorties et l'hachage de la dernière entrée de son journal sont égales à la référence. La trace complète de référence de chaque programme exemple, octet par octet, est la porte que la proposition d'enregistrement d'émission fixe pour chaque langage ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). L'émetteur Scala n'a aucune revendication T9, et sa sortie ne correspond pas encore à la référence ([§4.5](#45-the-compilers)). L'évaluateur de référence et les runtimes émis de Rust, Python et JavaScript calculent également la même fonction de budget, et un test vérifie que le piège de budget tombe sur la même opération dans les quatre ([§3.7](#37-the-language-one-text-costs-and-theorem-status)) ; le passage ANF préservant l'ordre avant chaque émetteur est testé différemment sur les cibles Rust, Python et JavaScript, y compris un balayage des budgets à travers le point de piège (théorème T34). C'est un test différentiel dans la lignée de McKeeman et de Csmith [86] : accord entre des implémentations indépendantes sur un ensemble d'entrées spécifié. Ce n'est pas une validation de traduction [85], et en dehors du noyau prouvé de l'émetteur Rust, ce n'est pas un compilateur vérifié. Il ne dit rien sur les entrées en dehors de l'ensemble testé.

<div id="52-rewrites-proved-in-z3" class="anchor-alias" aria-hidden="true"></div>

<div id="52-the-proof-rule-for-rewrites" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Règle de preuve pour les réécritures

Les règles de réécriture vérifiées ont une descendance. Ruler infère et vérifie les règles de réécriture par saturation d'égalité sans modèle dans la boucle [87]. La réécriture proposée par le modèle mentionnée dans la Section 5.5 répète une règle que le moteur avait déjà, donc ce registre est une déclaration concernant la porte, qui a refusé 15 des 18 propositions, et non une revendication selon laquelle un modèle est une bonne source de règles.

Dans la conception du moteur, chaque réécriture e-graph doit être prouvée dans le solveur SMT Z3 [31] contre une encodage sans quantificateur de l'évaluation des termes et de l'arithmétique de la Forme : les valeurs comme un type de données, les vecteurs de bits 64 bits avec débordement vérifié, la division et le reste signés avec le signe du dividende, et les flottants binary64. Une réécriture qui modifie le débordement, l'ordre d'escalade ou un message n'obtient aucune preuve. Une équivalence proposée entre dans l'e-graph uniquement avec une preuve.
<div id="53-model-checking-of-the-kernel" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Vérification du noyau du modèle

La conception vérifie le noyau du moteur (chaîne d'hachage, pli, positions sans nom et évaluation du gestionnaire) avec le vérificateur de modèles Kani pour Rust [32]. L'évaluation du gestionnaire est le point fixe d'une étape non récursive, donc une preuve que l'étape est totale et déterministe par constructeur se généralise à l'évaluation par induction structurelle. La conception nomme dix propriétés, chacune avec un harnais :

| Harnais | Propriété |
|---|---|
| `chain_appended_verifies` | Une chaîne d'hachage ajoutée vérifie |
| `chain_detects_tampering` | Une entrée modifiée brise la chaîne |
| `fold_equals_replay` | Le pli est égal à la répétition |
| `fold_rejects_wrong_state` | Un pli qui ne correspond pas à l'état stocké est refusé |
| `position_is_name_independent` | Les positions des règles ne dépendent pas des noms des nœuds |
| `reason_tokens_are_name_independent` | Les raisons sont sans nom par l'ensemble des tokens |
| `handler_core_leaves` | Les gestionnaires de feuilles sont totaux et déterministes |
| `handler_core_validate` | La validation est totale et déterministe |
| `handler_core_pipeline` | Les pipelines sont totaux et déterministes |
| `handler_core_ifhas` | Les gardes sont totales et déterministes |

<div id="54-promotion-gate-on-the-proof-certificate" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Porte de promotion sur le certificat de preuve

Dans la conception, l'exécution de vérification du modèle écrit un certificat dont l'hachage est stocké avec le moteur. Le moteur, le journal, les identifiants de règles et l'évaluation du gestionnaire passent par le noyau, et la promotion nécessite le certificat.

<div id="55-the-model-as-a-proposer-behind-the-check" class="anchor-alias" aria-hidden="true"></div>

### 5.5 Le modèle comme proposant derrière la vérification

Un modèle peut proposer des équivalences. Il peut ne pas les accepter. Un modèle de codage local à 1,5 milliard de paramètres a été exécuté en tant que proposant sur la spécification `orders-form`, et l'enregistrement public de l'exécution ([`rce/bench/results/llm-proposer-form-demo.form.json`](https://github.com/openIE-dev/openie-research-experiments/blob/main/rce/bench/results/llm-proposer-form-demo.form.json)) contient 18 propositions, 13 d'entre elles distinctes. L'enregistrement indique uniquement la source de chaque proposition comme étant `llm` ; le modèle, Qwen2.5-Coder-1.5B sous llama.cpp, est nommé par cet article et par aucun enregistrement public. La vérification a refusé 15 propositions, 12 d'entre elles distinctes : quatre qui ne se parsent pas, deux qui mettent une valeur là où un terme appartient, et neuf permutations d'opérateurs arithmétiques, chacune refusée avec un contre-exemple sur lequel les deux côtés échouent différemment. Les 3 qu'elle a acceptées sont une réécriture, `(pipe pass ?a) => ?a`, sous trois noms, et cette réécriture répète une règle que le moteur avait déjà. L'enregistrement montre la porte refusant ce qui est incorrect ; il ne montre aucune nouvelle règle provenant du modèle.

<div id="6-lift-entering-the-ecosystem-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

## 6. Élévation : entrer dans l'écosystème depuis d'autres langages

<div id="6-importing-legacy-code-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

L'élévation est conçue pour être la porte d'entrée dans l'écosystème pour le code écrit ailleurs. Elle doit être une construction, faite par langue à partir des outils que chaque langue possède déjà : une grammaire formelle, un parseur tel que [tree-sitter](https://tree-sitter.github.io/tree-sitter/) qui produit l'arbre de syntaxe, l'arbre de syntaxe abstraite et les symboles que les outils du serveur de langage résolvent ([Language Server Protocol](https://microsoft.github.io/language-server-protocol/)). Le profil du moteur spécifie une élévation, `rce scan DIR --form`, qui construit la Forme à partir de cet arbre pour Rust, Python, TypeScript et Go et étiquette chaque élément élevé comme non prouvé (Annexe D.8) ; ni cette élévation ni le moteur ne sont publics, et rien dans l'Annexe D n'est vérifié par les outils publiés. Le dépôt public contient une seule sonde d'élévation, `spec/lift/go/lift_go.py`, qui élève un seul motif Go, et la conception pour éléver chaque langue, avec les niveaux auxquels une élévation est acceptée, est la proposition `spec/proposals/rce-form.md` ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). Un programme élevé porte les fautes de sa source, donc l'élévation inclut la réparation, et le protocole ci-dessous mesure la réparation sur des corpus de bugs publics avec l'emplacement donné.

<div id="60-the-repair-ladder-on-lifted-code" class="anchor-alias" aria-hidden="true"></div>
<div id="60-the-repair-ladder" class="anchor-alias" aria-hidden="true"></div>

### 6.0 L'échelle de réparation

<div id="23-per-rung-ladder-results" class="anchor-alias" aria-hidden="true"></div>

Une tâche de codage est mesurée ici par les **bits d'intention** dont elle a besoin : les bits qui doivent être fournis en dehors de ce que le moteur possède déjà (le programme autour de la modification, les bibliothèques, les tests, l'index des réparations connues). En notant $H_{task}$ les bits qui fixent l'artefact cible et $H_{corpus}$ les bits que le corpus corrige déjà, les bits fournis sont $I = H_{task} - H_{corpus}$. Un engrenage qui classe la bonne modification au rang $r$ parmi ses candidats a fourni $\log_2 r$ bits de recherche, et la porte fournit le reste. L'échelle classe les tâches par taille de modification, un proxy objectif pour $I$ : un token (L0), une instruction (L1), un bloc (L2), plusieurs blocs dans un seul fichier (L3), plusieurs fichiers (L4), une fonction issue d'une spécification ou des tests (L5), une modification au niveau d'un problème (L6) et un programme issue d'une spécification (L7). Les échelons, les corpus, les divisions et les hypothèses sont enregistrés à l'avance ; les fichiers se trouvent dans le [répertoire public](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

L2 à L4 doivent être mesurés sur un ensemble réservé de Defects4J ([Section 8.1](#81-defects4j)), et L5 à L7 selon les protocoles de [Section 8.2](#82-swe-bench-lite-offline). La méthode et la porte de L0 et L1 suivent.

**Méthode.** Chaque corpus est mélangé avec une graine fixe. Les premières 2 000 positions de chaque mélange, ainsi que pour L0 trois répertoires entiers (commons-lang, requests, flask), forment la division de développement, sur laquelle les engrenages peuvent être ajustés ; les résultats de développement ne sont pas rapportés. Tâche restante est dans la division de test. Avant une course de test, le solveur est validé et son hachage binaire enregistré, et aucun engrenage ne change pendant la course, donc chaque ligne à rapporter est le résultat d'un solveur figé sur les tâches de test uniquement, avec 0 appels de modèle. L'enregistrement à l'avance (`PREREG.json`) et le script de rapport se trouvent dans le [répertoire public](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

**Porte.** À L0 et L1, l'emplacement est donné et la porte est l'identité avec les espaces blancs supprimés : la ligne ou l'instruction réparée, avec tous les octets d'espaces blancs supprimés, doivent être identiques aux octets du développeur. Cela est plus strict que le passage des tests, car un patch peut passer un ensemble de tests faible et être tout de même incorrect. Qi et collègues ont trouvé que la plupart des patches que GenProg a signalés comme des réparations étaient plausibles mais incorrects [92] ; la surajustement aux tests est documenté dans la réparation basée sur la recherche et la réparation basée sur la sémantique [93, 94] et traité avec des tests générés [95] ; les outils obtiennent de meilleures notes sur le benchmark sur lequel ils ont été ajustés [96] ; et les biais de localisation des pannes influencent les comparaisons [97]. L'identité avec les espaces blancs supprimés ferme l'écart de plausibilité sur ces échelons, et le fait de donner l'emplacement élimine le terme de localisation, donc le taux mesure uniquement les engrenages de réparation. L2 et au-delà utilisent les tests comme porte et rapportent séparément les comptes plausibles et corrects (Section 8.1).

<div id="61-l0-one-token-faults" class="anchor-alias" aria-hidden="true"></div>

### 6.1 L0 : pannes d'un seul token

Le corpus L0 est chaque mutant de type PIT [109] avec un token de remplacement valide dans des dépôts réels à des commits fixes, cinq Java (commons-math, commons-collections, jsoup, joda-time, gson) et quatre Python (click, attrs, pydantic, sympy), avec quatre dépôts jamais utilisés pour l'ajustement (commons-text, commons-io, more-itertools, httpx) comme un deuxième ensemble de test. Les mutants sont un substitut des pannes réelles d'un seul token que Just et collègues ont trouvé couplées avec des pannes réelles [110]. Si le voisinage qui restaure une panne d'un seul token est construit à partir des mêmes tables d'opérateurs qui ont produit les mutants, un taux élevé reflète partiellement cette superposition et non la capacité de réparation sur les pannes qui surviennent en pratique. Une recherche simple d'inversion d'opérateur, exécutée sur les mêmes mutants, est la référence qui montre à quel point la superposition explique le taux, et un taux L0 est lu à côté.

<div id="62-l1-one-statement-bugs-from-real-histories" class="anchor-alias" aria-hidden="true"></div>

### 6.2 L1 : bugs d'une seule instruction provenant d'histoires réelles

L1 utilise deux ensembles de données publics de réparations d'instructions uniques extraites d'histoires open-source : ManySStuBs4J 2.0 [107] pour Java et TSSB-3M v1.0.0 [108], fragments 14 et 15, pour Python. Le solveur reçoit soit le bloc de 7 lignes uniquement, soit le fichier entier au commit parent, avec des index des méthodes du projet et des conditions de garde, et les deux sont rapportés comme des lignes séparées. Ces ensembles de données n'ont pas de classement de réparation publié sous cette porte (bloc uniquement, identité avec les espaces blancs supprimés, emplacement donné), donc aucun nombre de réparation apprise n'est indiqué à côté ; Defects4J, qui en a un, est comparé à TBar dans la Section 8.1.
<div id="63-energy" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Énergie

Selon le protocole, chaque ligne de l'échelle de complexité porte `est_j`, un modèle de secondes de processeur central (CPU) multipliées par 10 W, et non une mesure, et un sous-échantillon est lu sur la limite de puissance moyenne en cours d'exécution (RAPL) [105], le compteur de package sur puce du processeur, comme `reported_j` : la variation du package sur l'ensemble de l'exécution, moins la puissance inerte d'un échantillon pris juste avant, multipliée par la durée de l'exécution. `measured_j`, un mètre mural sur un rail nommé, suit le protocole de la Section 8.3.

**Deux régimes et un vecteur calibré.** L'estimation ci-dessus, secondes de processeur central multipliées par 10 W, est une table de sous-sol et ne peut pas distinguer les cibles, donc l'extraction à moindre coût en joules ne choisit jamais une cible. La littérature sur les mesures indique à quoi doit ressembler la solution. Sur un cœur en ordre, les joules sont linéaires en fonction du nombre d'opérations : un modèle à six compteurs sur Cortex-M0 atteint R² ≈ 0,99 et une erreur absolue moyenne de 2,8 à 4,3 %, avec des coefficients tels que 0,96 nJ par instruction et 2,1 nJ par branche prise [152]. Sur un cœur hors ordre, le modèle se réduit au temps : avec un cœur fixé et le turbo désactivé, un Xeon Gold 6430 a consommé 189,8 ± 0,5 W sur chaque implémentation et benchmark d'une réplication énergie-langage, et le classement qui avait placé Python à 75,88 fois C a disparu une fois que le choix de bibliothèque, le parallélisme, le chauffage et les erreurs de mesure ont été contrôlés [153]. Les compteurs eux-mêmes ont une valeur inégale : Intel RAPL prédit la puissance de branchement avec une erreur absolue moyenne de 1,8 % une fois que la DRAM est incluse, mais les mises à jour se produisent environ toutes les millisecondes et ont dérivé de 10 à 12 % avec la température du package sur une génération [105] ; interroger plus rapidement que 10 ms produit jusqu'à 50 % de lectures obsolètes [154] ; les échantillons NVML de NVIDIA couvrent environ un quart du temps d'exécution et les exécutions naïves simples se sont trompées de jusqu'à 70 % par rapport à un mètre externe [155]. Le comptage des unités de type gaz corrèle avec le temps CPU à seulement Pearson ≈ 0,51 sur Ethereum [156], donc "l'énergie varie avec les opérations comptées" est une hypothèse que le sous-échantillon `reported_j` doit tester. Une proposition à la spécification garde trois objets séparés : les unités de budget C.6 restent déterministes, aveugles aux cibles et dans le journal ; `est_j` devient $\langle \mathrm{count}(\mathit{term}), E[\mathit{target}] \rangle$ plus la puissance inerte multipliée par le temps dans le régime A (microcontrôleurs, voies de FPGA, cœurs en ordre) et $P_{\mathrm{active}} \cdot t + E_{\mathrm{llc}} \cdot \mathit{misses}$ dans le régime B (processeurs hors ordre et unités de traitement graphique (GPU)) ; et le vecteur de coefficient $E[\mathit{target}]$ est une entrée de journal `host.Calibrated` avec son protocole, le nombre d'échantillons et l'erreur standard par coefficient, écrite par `rce host calibrate` sous un protocole normatif (au moins 30 paires A/B entrelacées par rapport à la base inerte, des blocs de 60 s ou $10^9$ opérations, le chauffage rejeté, la température enregistrée, le mètre nommé avec sa référence de validation, RAPL échantillonné pas plus vite que 10 ms), afin que l'extraction sous `est_j` soit une fonction du journal et des réplays. Les reçus gagnent un hachage `calibration` et un `stale_fraction`, la part des opérations d'une étape sans ligne calibrée, tarifée `unpriced` ; les totaux conservent les quatre étiquettes dans des colonnes séparées. Le falsificateur est RCE-F5 dans [§9](#9-falsifiers). La première calibration à exécuter est l'échelon KV260 de l'échelle d'énergie sur son rail de cœur avec $N \ge 30$, ce qui transforme la valeur de substitution `E_LUT_READ = 1e-12` de la spécification en un coefficient avec une erreur standard.
<div id="7-reuse-evidence" class="anchor-alias" aria-hidden="true"></div>

## 7. Réutilisation des preuves

La position de RCE sur l'axe de réutilisation repose sur un fait technique : le code est réutilisé à toutes les échelles. Chaque méthode ci-dessous le mesure différemment.

| Méthode | Source | Découverte |
|---|---|---|
| Cartographie des clones au niveau du fichier | DéjàVu, Lopes et al. 2017 [33] | Sur 428 millions de fichiers dans 4,5 millions de projets GitHub non-forkés, 85 millions sont uniques : « 70 % du code sur GitHub consiste en des clones de fichiers créés précédemment. » En JavaScript, 6 % des fichiers sont distincts. |
| Redondance au niveau de la ligne | Gabel et Su 2010 [34] | Sur 420 millions de lignes, « entre 50 % et 100 % de chaque projet est redondant » à environ une ligne. |
| Modèles statistiques de langage | Hindle et al. 2012 [35] | Le code est « très répétitif, et en fait même plus que les langues naturelles. » |
| Déduplication presque totale du corpus | The Stack [36] | La déduplication presque totale élimine 54,7 % de The Stack v1 (6,4 TB à 2,9 TB) et 52,4 % de v2 (67,5 TB à 32,1 TB). |
| Conservation d'archives entières | Software Heritage [129, 130] | 30,3 milliards de contenus de fichiers uniques provenant de 448 millions d'origines (compteurs d'archives, lus le 13 octobre 2026), chacun stocké une seule fois par le hachage de ses octets. |
| Schémas de correction extraits | PAR, TBar [22, 23] | PAR a trouvé « plusieurs schémas de correction courants » dans plus de 60 000 correctifs humains. Les 15 catégories de schémas de TBar corrigent correctement 43 bugs Defects4J dans la pipeline standard, et 74 sur 101 avec une localisation parfaite des pannes, sans apprentissage. Ces chiffres proviennent de [23] ; le sens des 101 (correctifs plausibles ou pannes tentés) n'a pas été vérifié à nouveau contre cet article ici, donc traitez le ratio comme non confirmé. |
| Tâches trans-langues | Rosetta Code [131] | 1 360 tâches (et 421 tâches en brouillon), chacune implémentée dans de nombreuses langues parmi les 1 009 connues. |

![Cinq petits panneaux, chacun avec son propre unité. Lopes et al. 2017 : sur 428 millions de fichiers dans 4,5 millions de projets GitHub non-forkés, 85 millions sont uniques, avec la citation que 70 % du code sur GitHub consiste en des clones de fichiers créés précédemment. Gabel et Su 2010 : entre 50 % et 100 % de chaque projet est redondant à environ une ligne, sur 420 millions de lignes. The Stack : la déduplication presque totale élimine 54,7 % de v1 (6,4 TB à 2,9 TB) et 52,4 % de v2 (67,5 TB à 32,1 TB). Software Heritage : 30,3 milliards de contenus de fichiers uniques provenant de 448 millions d'origines, compteurs d'archives lus le 13 octobre 2026, chacun stocké une seule fois par le hachage de ses octets. PAR a trouvé plusieurs schémas de correction courants dans plus de 60 000 correctifs humains ; TBar corrige correctement 43 bugs Defects4J dans la pipeline standard et 74 sur 101 avec une localisation parfaite des pannes.](/figures/rce/reuse.svg)

*Figure 6. Le code est réutilisé à toutes les échelles. Figure de données : cinq mesures de réutilisation, chacune dans son propre unité ; les panneaux ne sont pas comparables entre eux. Cartographie des clones au niveau du fichier (Lopes et al. 2017 [33]) : sur 428 millions de fichiers dans 4,5 millions de projets GitHub non-forkés, 85 millions sont uniques. Redondance au niveau de la ligne (Gabel et Su 2010 [34]) : entre 50 % et 100 % de chaque projet est redondant à environ une ligne, sur 420 millions de lignes. Déduplication presque totale du corpus (The Stack [36]) : 54,7 % supprimés de v1 (6,4 TB à 2,9 TB) et 52,4 % de v2 (67,5 TB à 32,1 TB). Software Heritage [129, 130] : 30,3 milliards de contenus de fichiers uniques provenant de 448 millions d'origines (compteurs d'archives lus le 13 octobre 2026), chacun stocké une seule fois par le hachage de ses octets. Schémas de correction extraits (PAR [22], TBar [23]) : PAR a trouvé des schémas de correction courants dans plus de 60 000 correctifs humains ; TBar corrige correctement 43 bugs Defects4J dans la pipeline standard et 74 sur 101 avec une localisation parfaite des pannes. Les valeurs sont comme indiquées dans le tableau ci-dessus. Une [copie PNG](/figures/rce/reuse.png) est fournie.*

Chaque ligne est une entrée pour le moteur. Les clones et la déduplication indiquent qu'une solution existe généralement, qui est G0. Les réparations récurrentes indiquent que l'adaptation est principalement un petit catalogue de réécritures protégées, qui est G1. La redondance au niveau de la ligne réduit l'espace de recherche de G2. L'échelle de réparation de la Section 6 est le protocole qui la mesure à grande échelle sur les sous-ensembles réservés. Deux précautions aiguisent la lecture. Les duplications gonflent les résultats de recherche et les scores des modèles sauf si elles sont supprimées [104]. Et les lignes défectueuses sont moins naturelles que les lignes corrigées [45], donc le bug lui-même est le cas de recherche le moins capable de prédire ; la forme de la réparation, pas la ligne défectueuse, est ce que G0 et G1 doivent se baser sur. La ligne d'extraction de règles qui fait cela à grande échelle, de la recherche generate-and-validate de GenProg [88] et du modèle d'exactitude appris de Prophet [89] à Getafix chez Facebook [90] et à la réparation sans modèle de Sorald pour les violations d'analyse statique [91], dérive des modèles à partir d'une histoire disjointe et signale la précision sur des cas non vus [98]. C'est le standard adopté par la Section 8.4.

<div id="8-measurement-protocols-for-what-comes-next" class="anchor-alias" aria-hidden="true"></div>

## 8. Protocoles de mesure pour ce qui vient ensuite

Chaque protocole est fixé avant son exécution : la préenregistrement est validé, les graines et la validation du solveur sont enregistrées, chaque artefact est conservé. La porte d'abord, les joules ensuite, les étiquettes toujours.

<div id="81-defects4j" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Defects4J

Defects4J contient 854 bugs Java actifs, chacun avec des tests de reproduction [37].

1. Développer sur un sous-ensemble de 100 bugs, hors ligne, via `defects4j checkout` ; signaler uniquement les résultats réservés, sur un ensemble disjoint tiré des bugs actifs par une règle semée enregistrée avant l'exécution, qui exclut le sous-ensemble de développement et chaque bug déjà exécuté avec tout engrenage, et figé avant l'exécution.
2. Exécuter G0, puis G1, puis G2, puis un modèle local en dernier. Enregistrer l'engrenage qui a résolu chaque bug.
3. Porte : les tests déclencheurs et l'ensemble complet passent. Signaler séparément les comptes plausibles et corrects ; correct signifie équivalent au correctif du développeur lors de la revue.
4. Signaler les appels de modèle par correction et joules par correction, étiquetés.
5. Points de référence : les 43 corrections correctes de TBar et ses 74 sur 101 sous une localisation parfaite (figures comme lues dans [23], avec le dénominateur non vérifié ici). Cette section est un protocole. Aucun résultat de ce moteur de Defects4J n'est signalé dans cet article.
6. Vérification de la contamination : signaler chaque bug dont la correction apparaît verbatim dans l'index de G0, et signaler avec et sans les bugs signalés.
<div id="82-swe-bench-lite-offline" class="anchor-alias" aria-hidden="true"></div>

### 8.2 SWE-bench Lite, hors ligne

SWE-bench Lite est un sous-ensemble de 300 tâches de vrais problèmes GitHub résolus par des tests cachés [38].

1. Utilisez le harnais Docker officiel sans réseau.
2. Première exécution : uniquement G0 et G1, zéro appel de modèle. C'est le point bas de la résolution sans modèle.
3. Deuxième exécution : ajoutez un modèle local comme dernier engrenage.
4. Signalez le taux de résolution, les appels de modèle par tâche résolue et les joules par tâche résolue, étiquetés.
5. Vérification de contamination comme en 8.1. SWE-Bench+ a trouvé que 32,67 % des correctifs réussis contenaient la solution dans le texte du problème [39].

<div id="83-a-wall-meter" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Un mètre mural

1. Fixez un mètre mural ou un mètre dérivation sur l'alimentation de l'hôte, enregistré à un taux indiqué avec son horloge synchronisée au journal d'exécution.
2. Machine inoccupée : les exécuteurs CI et autres builds arrêtés, et une porte de fenêtre silencieuse vérifiée avant chaque bloc et enregistrée.
3. Soustrayez une base inoccupée mesurée, et indiquez la méthode.
4. Remplissez `measured_j` uniquement à partir du mètre. Signalez `reported_j` (RAPL) et `est_j` à côté dans des colonnes séparées. Ne jamais additionner sur les étiquettes.
5. Exécutez le sous-échantillon RAPL de l'échelle (Section 6.3) sous le mètre, puis l'ensemble réservé de Defects4J.

<div id="84-a-held-out-run-with-the-gears-frozen" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Une exécution réservée avec les engrenages figés

C'est la méthode de la Section 6, étendue à de nouveaux corpus.

1. Figer G0, G1 et G2 à un commit étiqueté, enregistrer l'empreinte binaire, et publier l'ensemble de règles avec ses horodatages d'auteur.
2. Tirer une tranche réservée disjointe : les instances Rust et Python de Multi-SWE-bench [102] et BugsInPy [103], dédoublonnées par rapport à l'index de G0 [104].
3. Enregistrer la tranche, les graines et les hypothèses avant la première exécution.
4. Signaler les comptes résolus, plausibles et identiques en octets séparément, chacun avec un intervalle de 95 %.

<div id="85-baselines-in-the-same-table" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Lignes de base dans le même tableau

1. Sans modèle : `cargo fix` et clippy [106], et Sorald ou un port TBar [91].
2. Modèle bon marché : sans agent avec un modèle local [99].
3. Modèle distant : un agent avec un modèle de frontière, son énergie estimée à partir des divulgations du fournisseur et étiquetée `est_j`.
4. Signaler le coût de passage [101] en joules et en dollars pour chaque ligne, avec le coût contrôlé comme le requiert Kapoor et ses collègues [100].

<div id="86-convergence-of-model-calls-at-large-n" class="anchor-alias" aria-hidden="true"></div>

### 8.6 Convergence des appels de modèle pour de grands N

La promotion est le mécanisme par lequel le modèle quitte la boucle : un résolveur est payé une fois pour un nouveau cas, la porte applique la solution comme gestionnaire, et chaque cas ultérieur de la même forme se ferme dans G0 ou G1 ([Section 4.2](#42-the-gears)). La convergence est l'affirmation selon laquelle les appels de modèle par tour tombent à zéro sur une spécification fixe sous le trafic en temps réel. Elle est mesurée comme suit.

1. Tirer au moins 1 000 spécifications des dépôts publics, stratifiées par langage et taille, et figer le moteur et le résolveur avant la première série.
2. Répéter le trafic de production enregistré, au moins 10 000 événements par spécification, en séries de taille fixe.
3. Enregistrer par série : nouvelles escalades, appels de modèle, promotions, différés et joules par tâche fermée, chacun étiqueté (`est_j`, `reported_j`, `measured_j`).
4. Point final principal : la part des spécifications atteignant une série avec zéro appel de modèle dans les 20 séries, avec un intervalle de Wilson à 95 %. Secondaire : les appels de modèle par tâche fermée par série, et la série de l'ultimo appel de modèle.
5. Signaler les spécifications qui ne convergent jamais avec leur cause (une entrée coincée, une dépendance manquante, une nouvelle intention), et exécuter le différé d'entrée coincée comme bras enregistré à l'avance.

**Proposition 8 (approche de base).** À mesure que la couverture de G0 et G1 augmente, les joules par tâche résolue s'approchent de la base d'or d'appliquer une correction connue et d'exécuter les tests. Les échelons de l'échelle et l'ensemble réservé de Defects4J sous le test du mètre mural le vérifient.

<div id="87-lift-coverage-across-languages" class="anchor-alias" aria-hidden="true"></div>

### 8.7 Étendre la couverture de l'élévation à travers les langages

<div id="87-coverage-of-real-programs-across-languages" class="anchor-alias" aria-hidden="true"></div>

L'élévation est mesurée à mesure qu'elle est construite. Pour le langage $L$, un programme est considéré comme élevé lorsque $\pi_L(\lambda_L(p))$ passe les propres tests du programme et répète ses traces enregistrées octet par octet, et $\lambda_L(\pi_L(\lambda_L(p)))$ a la même empreinte de forme que $\lambda_L(p)$. L'échantillon comprend au moins 10 000 programmes par langage pour au moins dix langages, tirés avec une graine fixe à partir de corpus publics verrouillés, avec le lifter figé et son empreinte binaire enregistrée avant chaque exécution, et 0 appels de modèle. Chaque exécution signale la part élevée avec un intervalle de Wilson à 95 %, et chaque construction non encore élevée est un élément de travail pour le lifter de ce langage, construit et figé avant l'exécution suivante. L'objectif est tous les programmes dans tous les langages.
<div id="9-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 9. Falsificateurs

Fixés avant les exécutions qu'ils testent.

| ID | Observation | Défaites |
|---|---|---|
| RCE-F0 | Sur une exécution préenregistrée d'au moins 10 000 Formes, l'une des quatre projections (Rust, Python, JavaScript, Scala) imprime une trace différente de la trace de référence de la Forme, ou tout entrée malformée est acceptée | La revendication que les projections sont fidèles et la porte refuse à l'entrée |
| RCE-F1 | Sur la tranche réservée, G0 à G2 avec des règles figées résolvent moins de 10 % des tâches avec 0 appel de modèle | La revendication que la plupart des solutions existent déjà pour la réparation à cette échelle |
| RCE-F2 | Les correctifs identiques au niveau octet ou équivalents sont inférieurs à la moitié des tâches résolues réservées | L'interprétation de la porte comme plus qu'une simple plausibilité sur les tâches couvertes |
| RCE-F3 | Sous le compteur de mur, les joules bruts par tâche résolue du solveur RCE dépassent ceux du modèle de base le moins coûteux sur les tâches qu'ils résolvent toutes les deux | La revendication d'une énergie plus faible par tâche résolue sur les tâches couvertes |
| RCE-F4 | Dans le protocole de convergence de la Section 8.6, moins de la moitié des spécifications sans entrée bloquée atteignent un tour avec 0 appel de modèle en 20 tours | Compiler le modèle hors de la boucle |
| RCE-F5 (enregistré le 22 octobre 2026) | Sur l'échantillon sous-échantillonné de l'échelle sous le compteur de mur de la Section 8.3, avec une entrée `host.Calibrated` pour l'hôte, le R² par cible de `reported_j` sur le vecteur de comptage C.6 est inférieur à 0,8 dans le régime A, ou `est_j` dans le régime B diffère de plus de 25 % à la médiane | La revendication que l'estimation calibrée est un substitut utilisable ; la base du reçu pour cet hôte devient `unpriced` jusqu'à ce qu'un meilleur modèle soit calibré |
| RCE-F6 (enregistré le 22 octobre 2026) | Dans la mesure de dimension enregistrée de la Section 3.8, la redondance médiane sur les programmes bornés, porteurs de sortie (le stratum que les exécutions enregistrées appellent observable) est inférieure à 0,1 bit. Statut, 24 octobre 2026 : déclenché sur la population à deux régions écrite de la cinquième exécution (médiane 0,00 bit sur douze programmes), non déclenché sur les exemples écrits à la main (1,29 bit, troisième exécution) ou les programmes hôtes (0,46 bit par famille, quatrième exécution) | La revendication que l'état accidentel est courant dans les petites Formes à cette échelle ; `rce dim` est alors un indicateur uniquement pour les grands programmes, ce qui est l'interprétation que la Section 3.8 donne maintenant |
<div id="10-work-to-finish" class="anchor-alias" aria-hidden="true"></div>

## 10. Travail nécessaire pour terminer

Chaque élément a son protocole nommé.

1. Élévation construite et mesurée sur au moins dix langages sous le protocole de la Section 8.7.
2. Le bras de spécification : des spécifications dans le style de MBPP et HumanEval rédigées sous forme de Formes et émises vers chaque cible.
3. Résultats réservés sur L2 à L4, sur l'ensemble réservé Defects4J tiré par la règle enregistrée de la Section 8.1, et sur L5 à L7 (Section 8.2).
4. Des lignes de base dans un tableau, coût de passage en joules et en dollars (Section 8.5).
5. Une série `measured_j` : un mètre mural sur un hôte inactif, au moins 10 répétitions, côté brut et côté net côte à côte (Section 8.3).
6. L'enquête sur 626 langues publiée avec sa méthode (Figure 1).
7. De nouveaux ensembles de corpus réservés avec les engrenages figés : Multi-SWE-bench et BugsInPy (Section 8.4).
8. Convergence des appels de modèles sur au moins 1 000 spécifications (Section 8.6).
9. T60, T61 et T59 sur l'ensemble $E$ prouvés (T60 par raffinement de partition mécanisé), et T62 lié depuis son modèle vers l'ordre de l'admetteur (Section 3.8).
10. La trouvaille `state_hash` de T7 est résolue (Section 3.6) et `RCE/Positional.lean` prouve l'encodage positionnel que les vérificateurs hachent inchangé sous les renommages de la spécification 10.6 pour chaque fonction de hachage. Ce qui reste à faire est de relier le modèle Lean au vérificateur qui exécute : la phase 2 de la Section 13 extrait le vérificateur et l'interprète de Lean et les utilise comme porte, avec le vérificateur Rust croi-vérifié contre eux, plutôt que de prouver un raffinement depuis le noyau Lean vers l'interprète Rust, ce que [§12.1](#121-seven-areas-of-the-design) refuse.
11. Une population de dimensions enregistrée aveuglement (programmes écrits sans la référence du benchmark à l'esprit, ou élevés), suffisamment grande pour tester H2 au-delà des deux lignes qui la portent actuellement ; les exécutions enregistrées à des commits publics ont enregistré RCE-F6 comme déclenché sur une population et non sur les autres (Section 3.8).
12. Les trois expériences enregistrées à l'avance de la Section 12.3 : la précision du modèle sur la Forme sans nom avec et sans le registre de concept ; le taux de commutation des déclarations adjacentes dans le code élevé ; et si la suppression certifiée par le replay déplace la ligne de base de suppression de 20 %.
13. La première entrée `host.Calibrated` sur le palier KV260 avec $N \ge 30$, et la régression que RCE-F5 teste (Section 6.3).
14. Le format IR Form 2 (définitions adressées par leur contenu) devenu le seul format, afin que les 77 briques de bibliothèque standard refusées uniquement pour la taille des termes soient plus basses, et la condition aller-retour hash(lift(emit(F))) = hash(F) vérifiée par cible à $N = 10{,}000$ (Section 13).
15. Le contrat d'entrée du vérificateur de référence, afin que chaque entrée ait un résultat déclaré à l'entrée (Section 1). Au commit public `d91a9fc8`, `rce run` et `rce host run` suppriment un champ de charge utile que l'événement ne déclare pas et appliquent l'événement, et stockent un champ du type incorrect sauf si l'arithmétique de l'étape y bloque. Le contrat refuse un événement non déclaré, un champ manquant, supplémentaire ou mal typé et une valeur imbriquée, laisse l'état inchangé et enregistre le refus (T8) ; le protocole de la Section 2.3 le teste pour de grands N.
16. L'émetteur Scala amené à l'accord avec le référentiel sur le jeu de conformité, où il passe 52 des 1 832 résultats aujourd'hui ([§4.5](#45-the-compilers)), avec les résultats Scala du jeu réexécutés sous les règles d'une seule langue.
17. La conception de [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis) construite : l'encodage `rce-form/1` de la proposition `spec/proposals/rce-form.md`, et pour chaque langue sa table d'élévation, sa table d'impression et sa bibliothèque d'exécution, publiée au niveau d'exécution atteint, avec les comptages de ces exécutions.

<div id="56-brownfield-agreement" class="anchor-alias" aria-hidden="true"></div>

**Résultats reconstruits sur le code public.** Le moteur a produit les résultats suivants. Chacun est reconstruit sur le code public avant d'entrer dans cet article : le code à un commit public marqué, une inscription scellée avant l'exécution, des lignes par tâche publiées, et une seule commande qui reproduit le résumé à partir d'une copie propre (la première phase du programme dans [§13](#13-programme-of-work-and-its-gates)).

| Résultat | Protocole dans cet article | Trajectoire de reconstrution |
|---|---|---|
| Le nombre de tests du moteur (`cargo test --release`, et le total de `make check`) et l'audit Lean à un commit du moteur | §3.7 | Comptage de vérification à un commit public : les tests du vérificateur de référence, `lake build` et l'audit Lean, la vérification de spécification et les vérifications WebAssembly, avec un identifiant de course de continuous-integration |
| Le pilote du 22 octobre 2026 et la première course de dimension enregistrée, `dim-r1` (77 programmes de `spec/examples/` et `rce-examples`), tous faits à des commits non publics | §3.8 | La même population re-exécutée avec `rce dim` à un commit public |
| Vérification du noyau : dix harnais vérifiés avec Kani 0.67.0, leurs comptages de vérification, et le certificat que la promotion exige | §5.3, §5.4 | Kani sur un crate public du noyau que le journal du vérificateur, le pli et le code positionnel appelle, avec les dix harnais et un certificat stocké |
| L'exécution de l'écosystème sur 10 000 Formes générées : encodage sans perte, projection déterministe et fidèle, la porte à l'entrée pour les entrées et pour les spécifications, son test de régression et son temps CPU | §2.3 | Le protocole de la Section 2.3 exécuté sur le vérificateur de référence et ses émetteurs, enregistré sous un nouvel identifiant de course |
| T9-F : le compilateur de Forme du moteur (`rce form`) et ses cinq cibles (Rust, WebAssembly, Python, XState, SCXML) imprimant la trace de référence sur le bord et les événements semés d'une spécification à onze opérateurs | §3.7 | Un test différentiel des émetteurs publics sur les événements de bord et semés enregistrés |
| Les preuves Z3 des réécritures de l'egrade interne du moteur, et le proposant déterministe des 87 identités familières | §5.2 | Une porte de réécriture publique : un évaluateur de référence des termes IR Form, un encodage SMT-LIB avec un résultat non satisfiable par réécriture et des contrôles négatifs, et les identités listées dans l'enregistrement |
| Les invariants de Forme de la Section 4.1 vérifiés par des tests du moteur nommés, l'accumulation des escalades sur la charge de travail de référence de la Proposition R2, et la démonstration du moteur dans le navigateur | §2.4, §4.1 | Le profil, la porte, la promotion et les reçus du moteur dans le code public, construits à partir de l'Annexe D |
| Les taux de réparation à un token (L0) sur neuf dépôts et sur quatre jamais ajustés, avec les bits de recherche médians et la décomposition non résolue | §6, §6.1 | Un outil de réparation public exécuté sur le protocole L0, avec la ligne de base d'inversion de l'opérateur à côté |
| Les taux de réparation à une déclaration (L1) sur ManySStuBs4J 2.0, uniquement les blocs et les fichiers entiers, et sur TSSB-3M, avec les taux par catégorie | §6, §6.2 | Les engrenages L1 dans l'outil de réparation public, sur le protocole L1 |
| Accord de l'élévation avec le code original sur les fixtures Rust, Python, TypeScript et Go | §6 | Élévations publiques par langue, exécutées sur des fixtures réécrits |
| Accord de trois programmes de prospection commerciale, réexprimés comme Formes, avec leurs entrées enregistrées, et la modification `est_j` sous extraction | §6 | Les programmes écrits comme modules de langue et réexécutés contre les entrées enregistrées publiques |
| `est_j` par tâche résolue sur l'échelle, et l'échantillon RAPL | §6.3 | `est_j` depuis les exécutions reconstruites de l'échelle, et `reported_j` sur un hôte avec RAPL
<div id="11-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 11. Conclusion

RCE est un écosystème de code natif par conception. Un programme est rédigé une seule fois, à partir de l'intention, sous forme de Forme : une encodage sans perte de l'état, des événements et des transitions pures, dont, dans la conception, chaque langue cible est une projection qui doit rejouer sa trace. Chaque état dans lequel un programme peut se trouver est déclaré dans sa Forme, et un événement refusé laisse l'état inchangé (théorème T8), donc un programme dans l'écosystème ne s'écarte pas de son intention et n'a pas besoin de diff après coup ou de suivi d'erreurs. La langue est une spécification écrite à un seul commit. Le vérificateur de référence l'implémente et génère Rust, Python et JavaScript, qui passent chacun 1 459 tests de conformité sans échec, et Scala, qui ne s'accorde pas encore avec la référence ; la spécification enregistre le niveau de preuve de chaque théorème ; et la dimension d'un programme est un nombre calculé, mesuré en exécutions enregistrées à des commits publics, qui ont déclenché RCE-F6 sur une population et pas sur les autres. Dans la conception du moteur, chaque solution que la porte applique est stockée et réutilisée, et l'écosystème s'accumule sous une porte dont la correction est monotone (proposition R1). Le code d'autres langues est conçu pour entrer par élévation, une construction de la grammaire de chaque langue à son arbre de syntaxe à la Forme ; un motif Go est élévée aujourd'hui par une sonde publique, et l'élévation et l'émission de chaque langue sont l'objectif de la proposition `spec/proposals/rce-form.md`. Les sections 3.6 et 8.7 énoncent les propositions d'universalité et expliquent comment leur construction est mesurée, la section 9 énonce les observations qui contrediraient les affirmations, et la section 10 liste le travail restant, y compris les résultats du moteur reconstruit sur le code public.

<div id="12-the-form-against-the-record" class="anchor-alias" aria-hidden="true"></div>

## 12. La Forme face au record

Cette section place la Forme face à trois corps de preuves : la théorie et les outils de chaque domaine que la conception touche, l'histoire de la conception des langages de programmation lue comme une comparaison de ce que chaque langue corrige et ce qu'elle laisse libre, et les causes mesurées de la redondance dans le code écrit par l'homme. Chaque sous-section indique ce que les preuves montrent, avec leur source, puis la position que ce papier adopte et la raison. Lorsqu'une position est un jugement plutôt qu'un résultat mesuré, le texte le précise. Les trois enquêtes derrière cette section ont été menées en octobre 2026 ; leurs textes complets et notes de travail sont publiés dans le dépôt d'expériences ([openie-research-experiments/rce/surveys](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/surveys)).
<div id="121-seven-areas-of-the-design" class="anchor-alias" aria-hidden="true"></div>

### 12.1 Sept domaines du design

**Formes canoniques.** Pour une machine complète et déterministe sur un alphabet fini, la machine minimale est unique à isomorphisme près, et un ordre de parcours fixe la transforme en une chaîne unique [150]. La Forme fournit la complétude et la déterminisme (T1, T2), donc la projection de contrôle fini de [§3.8](#38-behaviour-equivalence-and-dimension) a une forme canonique. La composante de données ne l'a pas : les automates finis symboliques ont une forme minimale canonique à équivalence de prédicat près [149], les automates à registre sur l'égalité ou l'ordre dense admettent un théorème de Myhill-Nerode [151], et un état mis à jour par l'arithmétique entière n'a aucun représentant canonique sauf le terme lui-même. L'extraction d'un e-graph sous un coût qui facture une fois les sous-termes partagés est NP-difficile et non approximable à un facteur constant [158], donc un représentant haché doit utiliser un coût reproductible entre les extracteurs. Position : trois clés de forme, chacune nommant son niveau dans l'entrée hachée (le hachage du terme sans nom, la forme de contrôle de [§3.8](#38-behaviour-equivalence-and-dimension), et la clé de classe e avec son budget de saturation) ; l'équivalence définie une fois, comme bisimulation ; les corps des étapes gardées vérifiés en premier par la procédure de décision presque linéaire de l'algèbre de Kleene gardée avec tests [157]. Refusé : toute affirmation que la machine minimale est *la* forme canonique d'une Forme avec un état arithmétique ; un représentant haché choisi par le coût des sous-termes partagés. Ouvert : pour quel fragment l'égalité de sens implique une forme de contrôle égale (la réciproque de T61).

**Représentation intermédiaire adressée par le contenu.** L'expérience de cinq ans d'Unison avec des définitions identifiées par hachage se réduit à une seule invariant, à savoir que le hachage couvre la sémantique et ne nomme jamais, et un seul coût, le re-hachage des dépendants sous modification [159] ; Dhall hache la forme normale d'une langue totale [160] ; l'essai de Nix pour adresser par le contenu la construction des sorties est resté expérimental pendant quinze ans car les références internes et la non-déterminisme l'ont brisé [161]. Position : des définitions indexées par le digest du corps α-éliminé, normalisé, avec les noms, les positions de source et les orthographes littérales dans un tableau non haché rendu par les projections ; un émetteur qui parcourt la représentation intermédiaire à travers un tableau par cible, remplaçant quatre émetteurs qui parcouraient la syntaxe de surface ; chaque exécution en temps réel qui sérialise est vérifiée contre les vecteurs JSON canoniques. Refusé : remplacer le JSON canonique par les octets hachés avec RFC 8785 (qui ne peut pas porter un entier distinct d'un flottant, zéro négatif ou un entier non signé exact de 64 bits) ou avec un CBOR déterministe (dont les deux spécifications divergent sur la largeur flottante et l'ordre des clés) ; adresser par le contenu les artefacts émis comme identité ; une β-normalisation complète avant le hachage, car une fonction récursive n'a alors aucun terme fini. Ouvert : des clés au niveau composant pour la récursion mutuelle.

**Le journal comme ordre partiel.** Une trace au sens de Mazurkiewicz est un mot modulo la commutation des événements indépendants, et toutes les linéarisation d'une configuration lisent la même trace. Le théorème de la cohérence comme monotonie logique indique quels programmes n'ont besoin d'aucune coordination [19], et son extension aux lectures dit que les observations d'états convergents sont dangereuses sauf si elles sont de forme seuil [82]. Position : une entrée du journal hachée sur sa chaîne, le numéro de séquence, l'événement et les hachages des entrées qu'elle a observées de manière causale, avec le hachage d'état enregistré uniquement aux coupures, de sorte que le digest est le même sous toute linéarisation que la sémantique admet ; le tag monotone étendu aux lectures ; chaque bras pris d'un `select` transversal enchaîné est journalisé. Le théorème selon lequel tout ordre cohérent avec les dépendances se plie à la même état de coupure (T62) est prouvé sur un modèle et est une proposition, pas un texte normatif. Refusé : laisser une cible choisir la linéarisation d'un événement non monotone. Ouvert : l'extension de la preuve du modèle à l'évaluateur complet.

**Synthèse à partir de l'intention.** Un vérificateur vérifie uniquement la validité : une postcondition toujours vraie vérifie. La complétude d'une spécification doit être mesurée, et la mesure qui fonctionne est la part des sorties modifiées que la spécification rejette ; en supprimant cette mesure dans la porte de l'étude qui l'a introduite, la vérifiabilité est tombée à 1,56 % [162]. L'énumération dirigée par le type sur les automates d'arbres contraints par l'égalité a porté la part résolue d'un benchmark de recherche de bibliothèque de 64 % à 88 % [163], et l'auto-affinement et le vote majoritaire justifient rarement leur coût une fois que le coût par résultat correct est pris en compte [164]. Position : l'intention comme un programme avec des trous portant des obligations, des exemples, un ensemble nommé de définitions utilisables et un budget ; une règle qui refuse une intention dont les obligations rejettent aucun comportement ; une complétude mesurée rapportée avec chaque intention ; un enregistrement de dérivation par trou donnant les candidats avant et après chaque vérification. Refusé : la promotion par score ; les boucles d'affinement à l'intérieur d'un appel de modèle. Ouvert : une mesure indépendante du corpus de l'information qu'une intention porte.

**Modèles de coûts énergétiques.** La littérature de mesure est résumée dans [§6.3](#63-energy) : les joules sont linéaires dans les comptages d'opérations sur un cœur en ordre [152] et linéaires dans le temps sur un cœur hors ordre [153] ; les compteurs sur puce diffèrent dans leur valeur par un ordre de grandeur [105, 154, 155] ; le type de mesure unitaire utilisé par Ethereum corrèle avec le temps CPU à seulement 0,51 [156]. Position : trois objets distincts, jamais fusionnés , les unités budgétaires déterministes et aveugles aux cibles de la spécification ; une estimation qui est un vecteur de coefficients calibrés par cible appliqué aux comptages (en ordre) ou au temps (hors ordre) ; et les étiquettes de reçu, conservées dans des colonnes séparées. Refusé : les joules dans le tableau budgétaire ; les constantes par langue ; un compteur lu comme une mesure de mètre mur.

**Langages conçus pour les auteurs de machines.** Un catalogue de 42 tels langages, 36 d'entre eux d'abord listés en 2026, montre que chaque mécanisme de ce papier a un pair : des preuves enchaînées par hachage, des contrats obligatoires divisés en prouvés et vérifiés en temps d'exécution, un noyau d'assistant de preuve, des arbres de syntaxe comme source de vérité avec des définitions hachées [166]. L'observation de convergence de [§3.7](#37-the-language-one-text-costs-and-theorem-status) tient. Ce qui distingue ce design n'est pas tout mécanisme mais que le replay et l'injectivité sont des théorèmes (T3, T7) plutôt que des promesses en temps d'exécution, et que les exemples sont des traces d'événements typés sur la même sémantique que le replay utilise, donc l'oracle qu'un modèle ne peut contourner est le programme lui-même. Position : un registre versionné de codes de règles avec des diagnostics et des plans de réparation lisibles par machine ; des paires de traduction validées par les tests manufacturées à partir des émetteurs et du vérificateur, qui est la recette qui a récupéré les langues à faible ressources dans [165] exécutée en sens inverse. Refusé : toute prétention d'être premier ou unique.

**Ingénierie de preuve.** Les normes qui ont comblé le fossé entre une spécification et son modèle mécanisé l'ont fait en générant du texte, des tables de vérificateur et des définitions à partir d'une seule source écrite : SpecTec pour WebAssembly a trouvé dix erreurs dans cinq propositions et a été adopté pour toutes les éditions futures [167]. Les projets qui ont prouvé une implémentation correcte par raffinement ont payé pour cela : environ douze années-personne pour 8 700 lignes de C [169]. Les mainteneurs de CompCert listent chaque élément de confiance avec sa raison [168]. Position : une seule source écrite de règles générant le texte de spécification, les tables de vérificateur et les définitions Lean, avec un contrôle qui échoue sur toute divergence ; le noyau Lean comme exécutant de référence pour le sous-ensemble qu'il couvre, avec le nombre de constructions non prises en charge publié et bornant la portée déclarée de chaque théorème ; un chapitre listant chaque composant de confiance avec son test. Refusé : une preuve de raffinement du noyau Lean vers l'interprète Rust ; les comptes de théorèmes comme mesure d'assurance ; deux sémantiques écrites de tout.
<div id="122-the-form-among-programming-languages" class="anchor-alias" aria-hidden="true"></div>

### 12.2 La Forme parmi les langages de programmation

Environ une centaine de langages appartenant à douze familles ont été placés sur huit coordonnées , disposition de l'état, alphabet des événements, transition, ordre, ressource, confiance, moment de liaison et intention , en enregistrant pour chacune si l'auteur la fixe, si le compilateur ou le runtime la choisit, ou si le langage n'a pas de mot pour la décrire. Trois régularités suivent. Seules trois familles obtiennent un déterminisme global sans effort de l'auteur, par trois théorèmes différents : les langages synchrones par un contrôle de causalité, les langages de flux et de logique par la monotonie, et les langages à actions atomiques protégées par un ordonnancement une-règle-à-la-fois avec une analyse statique des conflits. Toute famille qui a atteint une certification de sécurité l'a fait en supprimant les mêmes trois coordonnées que la Forme : l'allocation dynamique, la récursion non bornée et le choix non déterministe. Et les deux coordonnées que nulle famille ne fixe bien sont la confiance et l'intention ; l'intention et les blocs d'exemples ainsi que les valeurs de capacité de la Forme fixent les deux.

Les cinq conceptions les plus proches de la Forme sont Dedalus, dont les relations indexées par le temps sont le journal et dont les règles de prochaine étape sont la transition [15] ; Bluespec, dont les règles atomiques protégées sont ordonnancées par un ordre choisi par le compilateur prouvé égal à l'exécution une-règle-à-la-fois ; l'architecture Elm, qui est les quatre composants de la Forme sous d'autres noms [83] ; Lustre, dont la discipline à mémoire bornée et ordonnancée statiquement a été certifiée dans environ cent systèmes d'avionique ; et Unison, sur l'identité [159]. Le record fixe également cinq contraintes, chacune un endroit où un langage antérieur a payé pour le choix opposé. Les tâches concourantes doivent descendre à des machines d'états sans pile, comme le font les fonctions asynchrones de Rust, car une coroutine à pile pleine ne peut être enregistrée étape par étape. La composition parallèle doit être émise comme une étape structurée, jamais comme un produit explicite d'automates, ce qui a échoué chez les compilateurs d'Esterel au-delà d'environ mille lignes de source concourante. Les gestionnaires d'effets ne sont pas un objectif de la version 0.9 : la spécification F.2 exclut les gestionnaires reprendre et multi-tirs, citant la borne totale du théorème T2 et le replay du journal du théorème T3. Le record argumente l'exclusion de la propriété de propriété et la borne du théorème T2 au lieu : chaque reprise supplémentaire duplique l'état capturé, et le nombre de reprises dépend des données, donc aucune borne à partir du graphe d'appel n'existe ; il trouve l'argument du théorème T3 répondable. Il conclut que les gestionnaires doivent être un-tir, comme l'a choisi OCaml 5, et nomme les gestionnaires un-tir, de reprise en queue comme un fragment que la Forme pourrait admettre sans briser aucun théorème. La seule dimension d'un programme qui est un théorème est l'indice de sa projection à contrôle fini ([§3.8](#38-behaviour-equivalence-and-dimension)). Et l'élévation d'un langage complet de Turing est une carte partielle dont le domaine est indécidable ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). Le vocabulaire de la géométrie différentielle que l'une des versions antérieures de ce projet utilisait (cartes, jauge, holonomie, géodésiques) n'a aucun équivalent dans la littérature des langages de programmation et n'est pas utilisé ici ; les objets qui existent sont la coalgèbre finale, les foncteurs depuis la syntaxe vers elle, le groupoïde des preuves de réécriture dont les composantes connexes sont les classes e, et la longueur minimale de description avec des joules à la place des bits.

Les propositions d'universalité de [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis) deviennent mesurables par un critère d'encapsulation. La Forme encapsule un langage $L$ lorsque, pour chaque programme $p$ de $L$ dans un corpus fixe, la Forme élevée n'est pas pire que $p$ sur cinq coordonnées et strictement meilleure sur au moins une : les joules mesurés sur les mêmes tâches et hôte ; la redondance au sens de [§3.8](#38-behaviour-equivalence-and-dimension) par rapport aux bits d'état $p$ déclare ; la décidabilité, signifiant que chaque propriété décidée pour $p$ est décidée pour la Forme ; le round trip, signifiant l'accord de comportement à une longueur déclarée et la condition de lentille sur le hachage de forme ; et le coût pour un modèle d'atteindre un programme passant la porte à partir de la même intention. L'affirmation que la Forme est meilleure qu'un langage de programmation est la conjonction de ce critère sur le corpus, une course enregistrée par langage, et rien d'autre : elle affirme ni l'expressivité, car une Forme ne peut dire plus que $p$, ni la lisibilité, qui est une propriété d'une projection, ni l'adoption. Un langage sur lequel la Forme est strictement pire sur toute coordonnée après deux courses enregistrées n'est pas encapsulé, et le compte de ce que ce langage fixe que la Forme ne fixe pas devient un élément de travail pour la Forme.
<div id="123-why-human-written-code-is-redundant" class="anchor-alias" aria-hidden="true"></div>

### 12.3 Pourquoi le code écrit par les humains est redondant

Le code écrit par les humains comporte de la redondance partout où le medium ne donne pas au rédacteur de canal pour exprimer ce qui est voulu, et cette redondance est chaque fois une substitution privée de chaque auteur. Les preuves mesurées le classent en trois couches. Le formatage représente 13 à 15 % des tokens des langages délimités par des accolades et peut être supprimé sans perte de précision pour dix modèles de langage [136], et le layout n’a aucun effet mesurable sur la compréhension humaine [135]. Les seules quantités qui suivent la charge de compréhension mesurée sont la taille textuelle, la taille du vocabulaire et l’étendue des dépendances de flux de données, chacune avec un Kendall’s τ ≈ 0,4, tandis que la complexité cyclomatique ne suit rien (τ ≈ 0,09) [133] ; et 97 % des bugs de concurrence réels autres que les blocages sont des hypothèses non vérifiées sur l’atomicité ou l’ordre, 96 % d’entre eux impliquant au plus deux threads, car le texte séquentiel ne peut pas exprimer un ordre partiel et l’auteur écrit un ordre total [170]. Les noms sont choisis avec une médiane d’accord de 6,9 % entre les développeurs et sont décodés à 97 % [137] ; les commentaires cesse de suivre le code qu’ils décrivent après quelques commits [138] ; toutefois, les modèles de langage perdent jusqu’à 29 points de précision lorsqu’on supprime les identifiants [139]. Deux autres causes sont organisationnelles. Les développeurs ne suppriment pas : dans trois systèmes de production, 54 à 60 % des fichiers n’ont jamais été exécutés sur six à seize mois, les développeurs ont supprimé 20 % du code qu’on leur a montré être inutile, et cette prudence était raisonnable, car le détecteur était précis à 32 % [171]. Et les organisations transmettent leurs limites : huit métriques organisationnelles ont prédit les binaires à risque avec une précision de 86,2 % et un rappel de 84,0 %, devant toutes les métriques de code [172].

La position qui suit comporte quatre parties. La Forme prend l’ordre, la localité, l’idiome et la reachabilité, chacun décidable sur un état, un ensemble d’événements et un pas total. La projection prend le layout et l’idiome, rendus par communauté, car l’avantage d’un expert est limité au code écrit selon des plans familiers et une projection qui émet uniquement du code correct lui coûte cela. L’intention reste un enregistrement structuré et vérifié, d’où la projection rend les noms ([§3.8](#38-behaviour-equivalence-and-dimension)). Et la spécification est gouvernée par un contrôle d’admission mécanique, car l’autorité des modèles augmente le taux de propositions sans changer la règle. Trois questions sur lesquelles le design dépend n’ont pas de mesure dans la littérature et ont été enregistrées comme des expériences avec des protocoles scellés : savoir si un modèle raisonne aussi précisément d’une Forme sans nom avec son enregistrement de concept que d’une surface nommée ; quelle part des déclarations adjacentes dans le code ordinaire commutent sous les dépendances de la Forme, ce qui est la taille de la marge dont le coût la figure de 97 % mesure ; et savoir si la suppression vérifiée par le replay et réversible par une seule commande déplace le taux de suppression de 20 %. Deux affirmations qui ont circulé dans le matériel de travail du projet n’ont aucune source traçable et ne sont pas utilisées : une étude de 2014 sur le nombre de pages des manuels de langage, et l’affirmation que les programmeurs expérimentés écrivent moins de code, qui remonte à un billet de blog citant une étude non nommée.

<div id="124-how-the-language-grows-and-shrinks" class="anchor-alias" aria-hidden="true"></div>

### 12.4 Comment le langage grandit et se réduit

Tout langage qui est resté petit a remplacé le goût des relecteurs par une règle sur ce qui compte comme admissible. Le processus de Go est biaisé vers le refus, et dans une étude, 40,9 % de 1 095 propositions ont été refusés avec un ensemble publié de raisons [173] ; la règle de Lua sur les mécanismes plutôt que les politiques a maintenu son implémentation à environ 25 000 lignes de C ; Elm s’est arrêté. Le régime qui grandit est également documenté par son propre président : le bénéfice d’une fonctionnalité est privé et immédiat, son coût diffus et différé, et il est plus facile d’inspirer de l’enthousiasme pour quelque chose de nouveau que pour s’y opposer [175]. Dans RCE, la Forme grandit à l’intérieur d’un seul texte. Lorsqu’un programme a besoin d’une forme que le texte ne possède pas, y compris une forme que personne n’a anticipée, la forme est écrite directement dans la spécification elle-même, sans version, sans macro, drapeau, directive ou plugin. Le dépôt de spécification énonce sept règles sur la manière dont une forme entre dans le texte, chacune nommant l’artefact qui l’enforce. Une construction entre dans la grammaire normative uniquement avec un exemple accepté et un exemple refusé, une déclaration Lean du théorème sur lequel elle repose liée au vérificateur par un tableau de règles généré ou par des vecteurs de test, et sans conflits de parsing ; tout ce qui est moins est une proposition. Une deuxième orthographe de quelque chose que la Forme dit déjà est refusée uniquement sur cette base. Le changement se fait dans les deux sens : toute construction peut être modifiée, généralisée, remplacée ou supprimée lorsqu’une meilleure forme est trouvée, et le changement se propage ensemble avec chaque programme, exemple et module de bibliothèque du dépôt qu’il touche en un seul commit, avec une ligne de registre indiquant ce qui a changé et pourquoi. Chaque interface a un seul point de décision, car une limite organisationnelle qui traverse une interface est un site de défaut prédit [172]. Les décisions et leurs raisons sont publiées dans un registre avec un ensemble fixe de raisons, donc le taux de refus est un nombre que tout le monde peut lire. Le marché ne taille pas, donc l’utilisation n’est jamais une raison de garder une construction. Et l’autorité d’un modèle change le taux, pas la règle.
<div id="125-the-library-and-the-compute-fabric" class="anchor-alias" aria-hidden="true"></div>

### 12.5 La bibliothèque et le tissu de calcul

Qu'une langue doive livrer une grande bibliothèque ("batteries incluses") ou un petit noyau spécifié avec un registre gratuit est généralement débattu comme un choix entre commodité et flexibilité. Le record montre que les deux positions échouent au même point [193]. Une bibliothèque livrée avec la langue lie son interface à la promesse de compatibilité de la langue et perd de la flexibilité [195]. Ses modules sont retirés une fois qu'un installateur existe : la proposition d'amélioration de Python 594 a retiré 22 d'entre eux, citant le coût de maintenance et la facilité d'installation depuis le registre [194]. Un registre gratuit produit des graphes transitifs profonds : la moitié des paquets dépendants dans Cargo, npm et NuGet ont au moins 41, 21 et 27 dépendances transitives [196]. Une spécification avec de nombreuses implémentations diverge à ses extrémités, comme le font plus de 30 parseurs JSON sur une grammaire sous-spécifiée [197]. Là où le record converge, il converge vers un niveau curationné qui est livré et modifié comme une seule unité.

Le même échec apparaît à travers les tissus de calcul. Sur les processeurs graphiques, les modèles à source unique correspondent au code natif sur les noyaux de streaming et perdent sur les réductions : sur le produit scalaire, les scores de portabilité des performances de Kokkos, RAJA et SYCL se situent entre 0,80 et 0,91 [198]. Sur un FPGA, une source SYCL migrée depuis CUDA et ajustée pour un GPU atteint 0,2 % à 47 % de la vitesse de sa version optimisée pour le FPGA, par des rapports dérivés des temps publiés pour la plus grande taille de problème [193, 199]. Les systèmes examinés qui donnent un sens en logiciel et en matériel l'atteignent en réduisant leur langage source à ce que leur matériel peut signifier (état de taille statiquement connue, pas de tas ou de récursion dans la partie matérielle, un battement logique), et leurs preuves couvrent des parties de la chaîne, pas toutes [193, 200]. Les formats de code portables fonctionnent là où ils fixent les sémantiques [201]. Les résultats bit-identiques coûtent peu lorsqu'ils sont conçus [202]. Les résultats de validité pour les modèles de mémoire sont paires [203]. Le placement à partir des coûts mesurés est non déterministe sauf si chaque décision est enregistrée et répétée, ou si l'exécution est simulée dans le temps virtuel [193, 204]. Pour les auteurs de machines, la question est aussi une question de connaissance : parmi les paquets nommés par le code que 16 modèles ont générés en Python et JavaScript, 19,7 % n'existaient pas [205].

Les deux débats demandent où le sens d'une bibliothèque est tenu : par une seule implémentation, par chaque package du registre, par une spécification vérifiée avec des tolérances, ou par un binaire de fournisseur pour un tissu. La position RCE le tient dans un seul texte.

- **La bibliothèque fait partie du texte.** Elle est écrite dans la langue et intégrée dans chaque outil (spécification 4.1). Elle est fixée par l'empreinte de son manifeste, que le programme nomme comme sa seule dépendance (F.5.3).
- **Elle n'a pas de variante de plateforme.** Elle effectue uniquement l'entrée et la sortie via des adaptateurs.
- **Son coût est le coût de sa source sur chaque binaire.** Un pas signifie donc la même chose sur chaque hôte (HC-7).
- **Le choix par cible appartient à l'hôte.** L'hôte admet un tissu pour une classe d'opérations uniquement après une vérification bit-exacte enregistrée contre la référence du processeur (HC-13), et il enregistre chaque placement pour la répétition (HC-12).
- **Ce qui est disponible est une liste que l'outil imprime, complète à chaque validation et croissante dans le même texte.** Le fait qu'une fonction existe devient une recherche plutôt qu'un rappel.

La Forme le fait comme une forme, pas comme une porte. Les systèmes du record réduisent leur langage source car il dit plus que leur matériel ne peut signifier. La Forme P = (S, E, δ, D, λ) est la forme que chaque programme a déjà : l'état qu'il garde, les événements auxquels il répond, son pas, son journal et ses sorties. C'est pourquoi les programmes d'autres langues sont conçus pour entrer en elle par élévation, dans les états du domaine [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis), et pourquoi aucune partie de cette position ne classe les programmes parmi ceux admis et ceux refusés.

La Forme est rigide à chaque validation, avec un seul texte et un seul sens. Elle est flexible entre les validations. Lorsqu'un programme a besoin d'une forme que la forme n'a pas, la forme l'ajoute dans le texte, jamais par un macro, drapeau, directive ou plugin à côté. Un changement peut étendre, généraliser ou remplacer une forme. Elle se déplace ensemble avec les programmes du dépôt dans une validation, et les empreintes de programme, la vérification d'équivalence de [§3.8](#38-behaviour-equivalence-and-dimension) et le journal enregistrent ce qui a bougé. Le comportement et l'équivalence (spécification 6.10) et les entrées du tissu de l'hôte ont été ajoutés à l'intérieur du texte sans changer le sens de tout programme accepté, et le journal comme un ordre partiel et une intention avec des trous sont proposés de la même manière. Sous la proposition, le matériel suit la même règle : le moteur lit les tailles d'état et les coûts de pas d'une Forme pour la réaliser, avec un état de taille statique dans les registres et un état croissant en mémoire que le circuit adresse.

"Batteries incluses" et "spécification et gratuit" ne sont plus des alternatives : les batteries font partie de la spécification, et le programme est libre de tout tissu.

La moitié bibliothèque de cette position tient dans le dépôt dans ses parties principales : la bibliothèque est écrite dans la langue, intégrée dans chaque outil et fixée par empreinte. L'une de ses parties reste : une définition de la bibliothèque standard à travers les sections de la spécification. Depuis openIE-dev/rce `5e701e33` (27 octobre 2026), `use` est la seule façon d'introduire un module de bibliothèque. La moitié tissu est un contrat dont la répétition est prouvée sur un modèle de l'hôte (spécification Annexe E, théorème T37), avec les journaux d'exemple re-pliés à travers le vérificateur de référence (`tests/host_contract.rs`), et un exécuteur de référence dont la répétition est testée contre son exécution en direct (`tests/host_runtime.rs`), exercé uniquement sur les CPUs. La proposition "une bibliothèque et une Forme sur chaque tissu de calcul" liste ce qui reste [193] :

- une définition de la bibliothèque standard ;
- des preuves de vérification re-dérivées sur la répétition ;
- un placement sur chaque chemin d'exécution ;
- un arbre de réduction par construction ;
- des exécutions de calibration ;
- des classes d'opérations entier et binary32 ;
- une réalisation matérielle lue à partir de la forme de chaque Forme ;
- un hôte sans système d'exploitation ;
- deux mesures que le record manque : l'énergie d'un noyau à travers les classes de dispositifs sous une limite, et la part de fonctionnalité de bibliothèque que les assistants de modèles réutilisent plutôt que de reimplementer.
<div id="13-programme-of-work-and-its-gates" class="anchor-alias" aria-hidden="true"></div>

## 13. Programme de travail et ses portes

Deux examens indépendants des dépôts publics en octobre 2026 ont abouti au même diagnostic. Le vérificateur n'est pas lui-même vérifié : rien ne raffine la sémantique Lean jusqu'à l'interprète Rust, les deux noyaux Lean n'ont aucun théorème les reliant, et le rapport de la suite de conformité pour le noyau mécanisé (`conformance/reports/results-lean-core.json` au commit public `d91a9fc8`) enregistre 210 tests passés, 1 échoué et 1 766 non pris en charge sur 1 977, donc environ un dixième de la suite est sous le théorème que le résumé affirme. Le code généré est un runtime de valeur dynamique par cible, quatre runtimes écrits à la main d'environ 2 000 lignes chacun. L'estimation de l'énergie ne peut pas distinguer les cibles, donc l'extraction de moindre joule ne choisit jamais une cible. Le profil du moteur spécifie une élévation pour quatre langages, aucun d'entre eux n'étant public ; la seule élévation publique est une sonde pour un motif Go, et l'affirmation d'universalité en nécessite dix. Et le moteur , les engrenages, l'e-graph, les réécritures et leurs preuves, le noyau et sa vérification de modèle, et l'élévation , n'est pas public, donc les résultats qu'il a produits entrent dans cet article uniquement lorsqu'ils sont reconstruits à partir du code public ; [§10](#10-work-to-finish) les liste avec leurs pistes de reconstrution. Pour un projet dont la raison déclarée de travailler en public est la traçabilité, c'est le plus grand risque du programme.

Le programme est ordonné par dépendance : la reproductibilité d'abord ; puis l'encodage et le modèle de coût sur lequel repose toute mesure ultérieure ; puis la chaîne de preuves ; et seulement ensuite la largeur. Chaque phase se termine à une porte qui est un falsificateur enregistré avant l'exécution, rapporté avec un intervalle de confiance ; une phase se ferme lorsque l'observation de sa porte est publiée, jamais sur l'effort. Les portes sont énoncées dans [§9](#9-falsifiers) et le tableau ci-dessous.

| Phase | Livrables | Ce qui défait la phase |
|---|---|---|
| 0 Reproduire | Chaque résultat dépendant du moteur reconstruit à partir du code public à un commit étiqueté, comme [§10](#10-work-to-finish) le liste ; les enregistrements par tâche de chaque exécution reconstruite ; l'ensemble Defects4J réservé achevé ; chaque inscription scellée par un hachage ; une chaîne de version ; les errata de spécification fermés ; une orthographe de chaque terme de terminaison, d'autorité et d'erreur ; une mesure publiée de la redondance de surface (constructs distincts par Form sur le corpus d'exemples) | Un nombre dans cet article qui ne peut pas être reconstruit à partir d'un commit public avec une seule commande |
| 1 Geler la Forme | Les définitions adressées par le contenu comme seule forme intermédiaire ; les relations typées comme valeur de Forme ; un abaissement que chaque émetteur consomme ; la condition aller-retour vérifiée par cible ; un modèle de coût calibré par cible comme [§6.3](#63-energy) le stipule | Une définition refusée pour la taille ; une cible dont le aller-retour modifie un hachage de forme ; le modèle de coût classant deux cibles en opposition au mètre de paroi |
| 2 Un noyau, une porte vérifiée | Un seul noyau Lean avec les théorèmes T1 à T9 réaffirmés dessus ; les règles de typage générées à partir du tableau de règles du vérificateur de sorte qu'une règle sans contrepartie Lean échoue la construction ; le vérificateur et l'interprète extraits de Lean et utilisés comme porte, avec le vérificateur Rust comme front-end vérifié croisé | La porte extraite et le vérificateur Rust ne s'accordant sur aucun programme ; un théorème réaffirmé nécessitant une étape admise ; des tests de conformité non pris en charge au-delà de 10 % |
| 3 Cibles évaluées en joules | Les tableaux de rang n et les opérations en masse comme l'orthographe unique pour le travail numérique ; les émetteurs Zig et Fortran avec des modes fixes de virgule flottante et de débordement ; les indices de mise en forme dans l'ajustement et jamais dans la Forme ; un certificat de traduction-validation par module émis ; le protocole du mètre de paroi de [§8.3](#83-a-wall-meter) | RCE-F3 et RCE-F5 ; un module émis sans certificat ; l'extraction choisissant le même terme pour chaque paire de cibles |
| 4 L'élévation comme entrée | Une élévation par langue, Go et Python d'abord, puis TypeScript et Rust, puis C et Zig ; 10 000 programmes par langue avec l'élévation figée ; le critère d'encapsulation de [§12.2](#122-the-form-among-programming-languages) exécuté par langue ; un journal public, append-only des hachages de forme admis avec leurs certificats | Une couverture d'élévation inférieure à 10 % sur l'une des quatre premières langues après la deuxième exécution enregistrée ; la Forme strictement pire sur toute coordonnée du critère |
| 5 L'écosystème se compose | La synthèse à partir d'intentions avec des trous ; les premières engrenages publiques avec leur certificat de vérification ; le protocole de convergence de [§8.6](#86-convergence-of-model-calls-at-large-n) sur 1 000 spécifications publiques ; des lignes directrices dans un tableau avec le coût par résultat correct en joules et en dollars | RCE-F1, RCE-F2, RCE-F4 ; les outils incapables de vérifier ou d'émettre eux-mêmes |

Trois positions où les examens diffèrent des enquêtes de [§12](#12-the-form-against-the-record) sont résolues comme suit. Le JSON canonique reste le seul encodage haché, pour les raisons données dans [§12.1](#121-seven-areas-of-the-design) ; un encodage binaire peut le refléter uniquement pour le transport s'il est une bijection vers ces octets, vérifiée sur les mêmes vecteurs. L'orthographe unique de terminaison est une mesure déclarée décroissante, avec les limites de boucle et de récurrence comme sémantique ; la forme adressée par le contenu nécessite toujours un point fixe borné pour la récurrence, et la mesure est ce qui la borne. La réduction du vocabulaire de concurrence à deux primitives est enregistrée comme une proposition ouverte plutôt qu'une décision, car les théorèmes des deux primitives doivent d'abord être prouvés sur le vérificateur plutôt que sur un modèle. Pas du tout dans le programme : un compilateur auto-hébergé avant la phase 2, des cibles supplémentaires avant la phase 1, tout constructeur des annexes avant son théorème, et un compilateur de production, que le propre résumé de la spécification dit ne pas devoir construire tant que le document ne cesse pas de se déplacer.

Depuis les examens, les six dépôts qui doivent s'accorder avec la spécification , le livre, les programmes d'exemple, la bibliothèque standard, la suite de conformité, le package de grammaire et l'éditeur , ont été fusionnés dans le dépôt de spécification avec leurs historiques, et chacun est vérifié par un workflow qui construit le vérificateur à partir du même commit. Rien dans le projet ne fixe ou vend une spécification plus ancienne ; le vérificateur vendu de l'éditeur, six commits en arrière, était le dernier tel fixe. Le site de recherche et le dépôt d'expériences restent séparés et lisent le dépôt de spécification ; il ne les lit jamais.
<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Références

[1] C. E. Shannon, "Prediction and Entropy of Printed English," *Bell System Technical Journal* 30(1), 1951. doi:10.1002/j.1538-7305.1951.tb01366.x

[2] Y. Gurevich, "Sequential Abstract State Machines Capture Sequential Algorithms," *ACM Transactions on Computational Logic* 1(1), 2000. doi:10.1145/343369.343384

[3] A. Blass and Y. Gurevich, "Abstract State Machines Capture Parallel Algorithms," *ACM Transactions on Computational Logic*, 2003. doi:10.1145/937555.937561

[4] N. Dershowitz and Y. Gurevich, "A Natural Axiomatization of Computability and Proof of Church's Thesis," *Bulletin of Symbolic Logic*, 2008. doi:10.2178/bsl/1231081370

[5] E. F. Codd, "A Relational Model of Data for Large Shared Data Banks," *Communications of the ACM*, 1970. doi:10.1145/362384.362685

[6] G. H. Mealy, "A Method for Synthesizing Sequential Circuits," *Bell System Technical Journal*, 1955. doi:10.1002/j.1538-7305.1955.tb03788.x

[7] E. F. Moore, "Gedanken-Experiments on Sequential Machines," *Automata Studies*, 1956. doi:10.1515/9781400882618-006

[8] K. Kang et al., "Feature-Oriented Domain Analysis (FODA) Feasibility Study," CMU/SEI-90-TR-021, 1990.

[9] R. Alur et al., "Syntax-Guided Synthesis," FMCAD 2013. doi:10.1109/FMCAD.2013.6679385

[10] D. Harel, "Statecharts: A Visual Formalism for Complex Systems," *Science of Computer Programming*, 1987. doi:10.1016/0167-6423(87)90035-9

[11] R. Tate, M. Stepp, Z. Tatlock and S. Lerner, "Equality Saturation," POPL 2009. doi:10.1145/1480881.1480915

[12] M. Willsey et al., "egg: Fast and Extensible Equality Saturation," POPL 2021. doi:10.1145/3434304

[13] B. Moseley and P. Marks, "Out of the Tar Pit," 2006.

[14] M. Fowler, "Event Sourcing," 2005. https://martinfowler.com/eaaDev/EventSourcing.html

[15] P. Alvaro et al., "Dedalus: Datalog in Time and Space," LNCS 2011. doi:10.1007/978-3-642-24206-9_16

[16] A. M. Turing, "On Computable Numbers," *Proceedings of the London Mathematical Society*, 1937. doi:10.1112/plms/s2-42.1.230

[17] A. Church, "An Unsolvable Problem of Elementary Number Theory," *American Journal of Mathematics*, 1936. doi:10.2307/2371045

[18] P. Wadler, "Propositions as Types," *Communications of the ACM*, 2015. doi:10.1145/2699407

[19] J. M. Hellerstein and P. Alvaro, "Keeping CALM," *Communications of the ACM*, 2020. doi:10.1145/3369736

[20] G. Kahn, "The Semantics of a Simple Language for Parallel Programming," IFIP 1974, pp. 471 to 475.

[21] H. Husain et al., "CodeSearchNet Challenge," 2019. arXiv:1909.09436

[22] D. Kim, J. Nam, J. Song and S. Kim, "Automatic Patch Generation Learned from Human-Written Patches" (PAR), ICSE 2013. doi:10.1109/ICSE.2013.6606626

[23] K. Liu et al., "TBar: Revisiting Template-based Automated Program Repair," ISSTA 2019. arXiv:1903.08409

[24] K. Liu et al., "AVATAR: Fixing Semantic Bugs with Fix Patterns of Static Analysis Violations," SANER 2019. arXiv:1812.07270

[25] A. Koyuncu et al., "FixMiner: Mining Relevant Fix Patterns for Automated Program Repair," 2018. arXiv:1810.01791

[26] Y. Padioleau et al., "Documenting and Automating Collateral Evolutions in Linux Device Drivers" (Coccinelle), EuroSys 2008. doi:10.1145/1352592.1352618

[27] A. Solar-Lezama et al., "Combinatorial Sketching for Finite Programs," ASPLOS 2006. doi:10.1145/1168857.1168907

[28] L. Chen, M. Zaharia and J. Zou, "FrugalGPT," 2023. arXiv:2305.05176

[29] S. Haber and W. S. Stornetta, "How to Time-Stamp a Digital Document," *Journal of Cryptology*, 1991. doi:10.1007/BF00196791

[30] S. A. Crosby and D. S. Wallach, "Efficient Data Structures for Tamper-Evident Logging," USENIX Security 2009.

[31] L. de Moura and N. Bjørner, "Z3: An Efficient SMT Solver," TACAS 2008. doi:10.1007/978-3-540-78800-3_24

[32] Kani Rust Verifier. https://github.com/model-checking/kani

[33] C. V. Lopes et al., "DéjàVu: A Map of Code Duplicates on GitHub," OOPSLA 2017. doi:10.1145/3133908

[34] M. Gabel and Z. Su, "A Study of the Uniqueness of Source Code," FSE 2010. doi:10.1145/1882291.1882315

[35] A. Hindle et al., "On the Naturalness of Software," ICSE 2012. doi:10.1109/ICSE.2012.6227135

[36] D. Kocetkov et al., "The Stack: 3 TB of Permissively Licensed Source Code," 2022. arXiv:2211.15533; The Stack v2 dataset card, https://huggingface.co/datasets/bigcode/the-stack-v2

[37] R. Just, D. Jalali and M. D. Ernst, "Defects4J: A Database of Existing Faults to Enable Controlled Testing Studies for Java Programs," ISSTA 2014. doi:10.1145/2610384.2628055

[38] C. E. Jimenez et al., "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" 2023. arXiv:2310.06770

[39] R. Aleithan et al., "SWE-Bench+: Enhanced Coding Benchmark for LLMs," 2024. arXiv:2410.06992

[40] C. E. Shannon, "A Mathematical Theory of Communication," *Bell System Technical Journal* 27, 1948. doi:10.1002/j.1538-7305.1948.tb01338.x

[41] A. N. Kolmogorov, "Three approaches to the quantitative definition of information," *Problemy Peredachi Informatsii* 1(1), 1965 (in Russian); English translation, *International Journal of Computer Mathematics* 2, 1968. doi:10.1080/00207166808803030

[42] R. J. Solomonoff, "A formal theory of inductive inference. Part I," *Information and Control* 7(1), 1964. doi:10.1016/S0019-9958(64)90223-2

[43] G. J. Chaitin, "A Theory of Program Size Formally Identical to Information Theory," *Journal of the ACM* 22(3), 1975. doi:10.1145/321892.321894

[44] J. Rissanen, "Modeling by shortest data description," *Automatica* 14(5), 1978. doi:10.1016/0005-1098(78)90005-5

[45] B. Ray, V. Hellendoorn, S. Godhane, Z. Tu, A. Bacchelli and P. Devanbu, "On the 'naturalness' of buggy code," ICSE 2016. doi:10.1145/2884781.2884848

[46] Z. Tu, Z. Su and P. Devanbu, "On the localness of software," FSE 2014. doi:10.1145/2635868.2635875

[47] M. Allamanis, E. T. Barr, P. Devanbu and C. Sutton, "A Survey of Machine Learning for Big Code and Naturalness," *ACM Computing Surveys* 51(4), 2018. doi:10.1145/3212695

[48] 陈浙哲, 刘忠鑫, 鄢萌, 徐洲, 夏鑫, 雷晏 (Z. Chen, Z. Liu, M. Yan, Z. Xu, X. Xia and Y. Lei), "代码自然性及其应用研究进展" (Research progress of code naturalness and its application), *软件学报 (Journal of Software)* 33(8), 3015 to 3034, 2022. doi:10.13328/j.cnki.jos.006355

[49] G. Sridhara, V. S. Sinha and S. Mani, "Naturalness of Natural Language Artifacts in Software," ISEC 2015 (India Software Engineering Conference). doi:10.1145/2723742.2723758

[50] P. Devanbu, "On the naturalness of software," keynote, ISEC 2013 (India Software Engineering Conference). doi:10.1145/2442754.2442763

[51] A. Z. H. Yang, S. Kolak, V. J. Hellendoorn, R. Martins et al., "Revisiting Unnaturalness for Automated Program Repair in the Era of Large Language Models," ICSE 2025. doi:10.1109/ICSE55347.2025.00089

[52] E. W. Dijkstra, "Guarded commands, nondeterminacy and formal derivation of programs," *Communications of the ACM* 18(8), 1975. doi:10.1145/360933.360975

[53] N. Wirth, "Program development by stepwise refinement," *Communications of the ACM* 14(4), 1971. doi:10.1145/362575.362577

[54] C. A. R. Hoare, "An axiomatic basis for computer programming," *Communications of the ACM* 12(10), 1969. doi:10.1145/363235.363259

[55] J.-R. Abrial, *The B-Book: Assigning Programs to Meanings*, Cambridge University Press, 1996. doi:10.1017/CBO9780511624162

[56] J.-R. Abrial, *Modeling in Event-B: System and Software Engineering*, Cambridge University Press, 2010. doi:10.1017/CBO9781139195881

[57] R.-J. Back and J. von Wright, *Refinement Calculus: A Systematic Introduction*, Springer, 1998. doi:10.1007/978-1-4612-1674-2

[58] F. L. Bauer and H. Wössner, *Algorithmic Language and Program Development*, Springer, 1982. doi:10.1007/978-3-642-61807-9

[59] S. Gulwani, "Automating string processing in spreadsheets using input-output examples," POPL 2011. doi:10.1145/1926385.1926423

[60] S. Gulwani, O. Polozov and R. Singh, "Program Synthesis," *Foundations and Trends in Programming Languages* 4(1-2), 2017. doi:10.1561/2500000010

[61] F. P. Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering," *Computer* 20(4), 1987. doi:10.1109/MC.1987.1663532

[62] P. Naur, "Programming as theory building," *Microprocessing and Microprogramming* 15(5), 1985. doi:10.1016/0165-6074(85)90032-8

[63] M. M. Lehman, "Programs, life cycles, and laws of software evolution," *Proceedings of the IEEE* 68(9), 1980. doi:10.1109/PROC.1980.11805

[64] P. Zave and M. Jackson, "Four dark corners of requirements engineering," *ACM Transactions on Software Engineering and Methodology* 6(1), 1997. doi:10.1145/237432.237434

[65] R. Landauer, "Irreversibility and Heat Generation in the Computing Process," *IBM Journal of Research and Development* 5(3), 1961. doi:10.1147/rd.53.0183

[66] C. H. Bennett, "Logical Reversibility of Computation," *IBM Journal of Research and Development* 17(6), 1973. doi:10.1147/rd.176.0525

[67] M. Franz and T. Kistler, "Slim binaries," *Communications of the ACM* 40(12), 1997. doi:10.1145/265563.265576

[68] C. W. Fraser, "Automatic inference of models for statistical code compression," PLDI 1999. doi:10.1145/301618.301672

[69] P. Cousot and R. Cousot, "Abstract interpretation: a unified lattice model for static analysis of programs by construction or approximation of fixpoints," POPL 1977. doi:10.1145/512950.512973

[70] Y. Futamura, "Partial evaluation of computation process: an approach to a compiler-compiler," *Systems, Computers, Controls* 2(5), 1971; reprinted in *Higher-Order and Symbolic Computation* 12(4), 1999. doi:10.1023/A:1010095604496

[71] A. P. Ershov, "Mixed computation: potential applications and problems for study," *Theoretical Computer Science* 18(1), 1982. doi:10.1016/0304-3975(82)90111-6

[72] W. A. Howard, "The formulae-as-types notion of construction," in J. P. Seldin and J. R. Hindley (eds.), *To H. B. Curry: Essays on Combinatory Logic, Lambda Calculus and Formalism*, Academic Press, 1980.

[73] 土居真之, 肥後芳樹, 有馬諒, 下仲健斗, 楠本真二 (M. Doi, Y. Higo, R. Arima, K. Shimonaka and S. Kusumoto), "ソースコードの「自然さ」を利用した自動生成ファイルの特定" (Identifying auto-generated files using the naturalness of source code), 電子情報通信学会技術研究報告 (IEICE Technical Report) 117(380), 19 to 24, January 2018. https://sdl.ist.osaka-u.ac.jp/pman/pman3.cgi?D=517

[74] M. Doi, Y. Higo, R. Arima, K. Shimonaka and S. Kusumoto, "On the naturalness of auto-generated code: can we identify auto-generated code automatically?" ICPC 2018. doi:10.1145/3196321.3196356

[75] F. V. Arrebola, "Modelo de sugestão de código-fonte baseado em modelos de linguagem organizados em um contexto hierárquico" (A source code suggestion model based on language models organized in a hierarchical context), doctoral thesis in electrical engineering, Fundação Educacional Inaciana Padre Sabóia de Medeiros (FEI), Brazil, 2018. Advisor R. A. C. Bianchi.

[76] G. Febres, K. Jaffé and C. Gershenson, "Complexity measurement of natural and artificial languages," *Complexity* 20(6), 2015. doi:10.1002/cplx.21529

[77] M. Rahman, D. Palani and P. C. Rigby, "Natural Software Revisited," ICSE 2019. doi:10.1109/ICSE.2019.00022

[78] A. Torres, S. Baltes, C. Treude and M. Wagner, "Applying Information Theory to Software Evolution," NLBSE 2023. doi:10.1109/NLBSE59153.2023.00017

[79] A. Blass, N. Dershowitz and Y. Gurevich, "When are two algorithms the same?," *Bulletin of Symbolic Logic* 15(2), 2009. arXiv:0811.0811. https://arxiv.org/abs/0811.0811

[80] Y. N. Moschovakis, "What is an algorithm?," in *Mathematics Unlimited: 2001 and Beyond*, Springer, 2001. https://www.math.ucla.edu/~ynm/papers/eng.pdf

[81] M. Y. Vardi, "What is an algorithm?," *Communications of the ACM* 55(3), 2012. doi:10.1145/2093548.2093549

[82] S. Laddad, A. Cheung, J. M. Hellerstein and M. Milano, "Flo: a Semantic Foundation for Progressive Stream Processing," POPL 2025. arXiv:2411.08274. https://arxiv.org/abs/2411.08274

[83] The Elm Architecture, Elm guide. https://guide.elm-lang.org/architecture/

[84] Temporal, "Workflows" (event history), documentation. https://docs.temporal.io/workflows

[85] A. Pnueli, M. Siegel and E. Singerman, "Translation validation," TACAS 1998. doi:10.1007/BFb0054170

[86] X. Yang, Y. Chen, E. Eide and J. Regehr, "Finding and understanding bugs in C compilers," PLDI 2011. doi:10.1145/1993498.1993532

[87] C. Nandi, M. Willsey, A. Zhu et al., "Rewrite Rule Inference Using Equality Saturation," OOPSLA 2021. arXiv:2108.10436. https://arxiv.org/abs/2108.10436

[88] C. Le Goues, T. Nguyen, S. Forrest and W. Weimer, "GenProg: A Generic Method for Automatic Software Repair," *IEEE TSE* 38(1), 2012. doi:10.1109/TSE.2011.104

[89] F. Long and M. Rinard, "Automatic patch generation by learning correct code," POPL 2016. doi:10.1145/2837614.2837617

[90] J. Bader, A. Scott, M. Pradel and S. Chandra, "Getafix: Learning to Fix Bugs Automatically," OOPSLA 2019. arXiv:1902.06111. https://arxiv.org/abs/1902.06111

[91] K. Etemadi, N. Harrand, S. Larsen et al., "Sorald: Automatic Patch Suggestions for SonarQube Static Analysis Violations," *IEEE TDSC*, 2022. arXiv:2103.12033. https://arxiv.org/abs/2103.12033

[92] Z. Qi, F. Long, S. Achour and M. Rinard, "An analysis of patch plausibility and correctness for generate-and-validate patch generation systems," ISSTA 2015. doi:10.1145/2771783.2771791

[93] E. K. Smith, E. T. Barr, C. Le Goues and Y. Brun, "Is the cure worse than the disease? Overfitting in automated program repair," ESEC/FSE 2015. doi:10.1145/2786805.2786825

[94] X.-B. D. Le, F. Thung, D. Lo and C. Le Goues, "Overfitting in semantics-based automated program repair," *Empirical Software Engineering* 23, 2018. doi:10.1007/s10664-017-9577-2

[95] Y. Xiong, X. Liu, M. Zeng, L. Zhang and G. Huang, "Identifying patch correctness in test-based program repair," ICSE 2018. doi:10.1145/3180155.3180182

[96] T. Durieux, F. Madeiral, M. Martinez and R. Abreu, "Empirical Review of Java Program Repair Tools: A Large-Scale Experiment on 2,141 Bugs and 23,551 Repair Attempts," ESEC/FSE 2019. arXiv:1905.11973. https://arxiv.org/abs/1905.11973

[97] K. Liu, A. Koyuncu, T. F. Bissyandé et al., "You Cannot Fix What You Cannot Find! An Investigation of Fault Localization Bias in Benchmarking Automated Program Repair Systems," ICST 2019. arXiv:1812.07283. https://arxiv.org/abs/1812.07283

[98] M. Monperrus, "Automatic Software Repair: A Bibliography," *ACM Computing Surveys* 51(1), 2018. doi:10.1145/3105906

[99] C. S. Xia, Y. Deng, S. Dunn and L. Zhang, "Agentless: Demystifying LLM-based Software Engineering Agents," 2024. arXiv:2407.01489. https://arxiv.org/abs/2407.01489

[100] S. Kapoor, B. Stroebl, Z. S. Siegel, N. Nadgir and A. Narayanan, "AI Agents That Matter," 2024. arXiv:2407.01502. https://arxiv.org/abs/2407.01502

[101] M. H. Erol, B. El, M. Suzgun, M. Yuksekgonul and J. Zou, "Cost-of-Pass: An Economic Framework for Evaluating Language Models," 2025. arXiv:2504.13359. https://arxiv.org/abs/2504.13359

[102] D. Zan, Z. Huang, W. Liu et al., "Multi-SWE-bench: A Multilingual Benchmark for Issue Resolving," 2025. arXiv:2504.02605. https://arxiv.org/abs/2504.02605

[103] R. Widyasari, S. Q. Sim, C. Lok et al., "BugsInPy: a database of existing bugs in Python programs to enable controlled testing and debugging studies," ESEC/FSE 2020. doi:10.1145/3368089.3417943

[104] M. Allamanis, "The Adverse Effects of Code Duplication in Machine Learning Models of Code," Onward! 2019. arXiv:1812.06469. https://arxiv.org/abs/1812.06469

[105] K. N. Khan, M. Hirki, T. Niemi, J. K. Nurminen and Z. Ou, "RAPL in Action: Experiences in Using RAPL for Power Measurements," *ACM TOMPECS* 3(2), 2018. doi:10.1145/3177754

[106] The Rust project, rustfix and `cargo fix`. https://github.com/rust-lang/rustfix

[107] R.-M. Karampatsis and C. Sutton, "How Often Do Single-Statement Bugs Occur? The ManySStuBs4J Dataset," MSR 2020. doi:10.1145/3379597.3387491

[108] C. Richter and H. Wehrheim, "TSSB-3M: Mining single statement bugs at massive scale," MSR 2022. doi:10.1145/3524842.3528505

[109] H. Coles, T. Laurent, C. Henard, M. Papadakis and A. Ventresque, "PIT: a practical mutation testing tool for Java," ISSTA 2016. doi:10.1145/2931037.2948707

[110] R. Just, D. Jalali, L. Inozemtseva, M. D. Ernst, R. Holmes and G. Fraser, "Are mutants a valid substitute for real faults in software testing?" FSE 2014. doi:10.1145/2635868.2635929

[111] I. J. Good, "Speculations Concerning the First Ultraintelligent Machine," *Advances in Computers* 6, 1965. doi:10.1016/S0065-2458(08)60418-0

[112] J. Schmidhuber, "Gödel Machines: Fully Self-referential Optimal Universal Self-improvers," in *Artificial General Intelligence*, Springer, 2007. doi:10.1007/978-3-540-68677-4_7

[113] E. Yudkowsky, "Intelligence Explosion Microeconomics," Technical report 2013-1, Machine Intelligence Research Institute, 2013. https://intelligence.org/files/IEM.pdf

[114] M. H. Löb, "Solution of a Problem of Leon Henkin," *Journal of Symbolic Logic* 20(2), 1955. doi:10.2307/2266895

[115] E. Yudkowsky and M. Herreshoff, "Tiling Agents for Self-Modifying AI, and the Löbian Obstacle," Machine Intelligence Research Institute, 2013. https://intelligence.org/files/TilingAgentsDraft.pdf

[116] E. Zelikman, E. Lorch, L. Mackey and A. T. Kalai, "Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation," 2023. doi:10.48550/arXiv.2310.02304

[117] J. Zhang, S. Hu, C. Lu, R. Lange and J. Clune, "Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents," 2025. doi:10.48550/arXiv.2505.22954

[118] A. Novikov et al., "AlphaEvolve: A coding agent for scientific and algorithmic discovery," 2025. doi:10.48550/arXiv.2506.13131

[119] G. Wang, Y. Xie, Y. Jiang, A. Mandlekar, C. Xiao, Y. Zhu, L. Fan and A. Anandkumar, "Voyager: An Open-Ended Embodied Agent with Large Language Models," 2023. doi:10.48550/arXiv.2305.16291

[120] Y. Futamura, "Partial Evaluation of Computation Process: An Approach to a Compiler-Compiler," *Higher-Order and Symbolic Computation* 12(4), 1999 (first published 1971). doi:10.1023/A:1010095604496

[121] V. F. Turchin, "The Concept of a Supercompiler," *ACM Transactions on Programming Languages and Systems* 8(3), 1986. doi:10.1145/5956.5957

[122] J. N. Foster, M. B. Greenwald, J. T. Moore, B. C. Pierce and A. Schmitt, "Combinators for Bidirectional Tree Transformations: A Linguistic Approach to the View-Update Problem," *ACM Transactions on Programming Languages and Systems* 29(3), 2007. doi:10.1145/1232420.1232424

[123] M. Hofmann, B. Pierce and D. Wagner, "Symmetric Lenses," *POPL*, 2011. doi:10.1145/1926385.1926428

[124] K. Czarnecki, J. N. Foster, Z. Hu, R. Lämmel, A. Schürr and J. F. Terwilliger, "Bidirectional Transformations: A Cross-Discipline Perspective," *ICMT*, LNCS 5563, 2009. doi:10.1007/978-3-642-02408-5_19

[125] E. W. Dijkstra, "A Constructive Approach to the Problem of Program Correctness," *BIT* 8(3), 1968. doi:10.1007/BF01933419

[126] A. Hall and R. Chapman, "Correctness by Construction: Developing a Commercial Secure System," *IEEE Software* 19(1), 2002. doi:10.1109/52.976937

[127] Y. Minsky, "OCaml for the Masses," *Communications of the ACM* 54(11), 2011. doi:10.1145/2018396.2018413

[128] D. A. Turner, "Total Functional Programming," *Journal of Universal Computer Science* 10(7), 2004. doi:10.3217/jucs-010-07-0751

[129] R. Di Cosmo and S. Zacchiroli, "Software Heritage: Why and How to Preserve Software Source Code," iPRES 2017, Kyoto. https://hal.science/hal-01590958

[130] Software Heritage, archive counters, read 13 October 2026: 30,253,266,524 file contents and 448,311,919 origins. https://archive.softwareheritage.org/api/1/stat/counters/

[131] Rosetta Code, main page, read 13 October 2026: 1,360 tasks, 421 draft tasks, 1,009 known languages. https://rosettacode.org/wiki/Rosetta_Code

[132] C. Casalnuovo, K. Lee, H. Wang, P. Devanbu and E. Morgan, "Do Programmers Prefer Predictable Expressions in Code?" *Cognitive Science* 44(12), 2020; preprint arXiv:1910.03704. https://arxiv.org/abs/1910.03704

[133] N. Peitek, S. Apel, C. Parnin, A. Brechmann and J. Siegmund, "Program Comprehension and Code Complexity Metrics: An fMRI Study," ICSE 2021. https://www.se.cs.uni-saarland.de/publications/docs/PAP+21.pdf

[134] S. Scalabrino, G. Bavota, C. Vendome, M. Linares-Vásquez, D. Poshyvanyk and R. Oliveto, "Automatically Assessing Code Understandability," *IEEE Transactions on Software Engineering* 47(3), 2021. https://www.cs.wm.edu/~denys/pubs/TSE'19-Understandability.pdf

[135] N. Peitek, J. Siegmund, C. Parnin, S. Apel and A. Brechmann, "Beyond Gaze: Preliminary Analysis of Pupil Dilation and Blink Rates in an fMRI Study of Program Comprehension," and the companion layout study, 2017. https://www.se.cs.uni-saarland.de/publications/docs/SPP+17.pdf

[136] "The Hidden Cost of Readability: How Code Formatting Silently Consumes Your LLM Budget," arXiv:2508.13666, August 2025; ICSE 2026. https://arxiv.org/abs/2508.13666

[137] D. G. Feitelson, A. Mizrahi, N. Noy, A. Ben Shabat, O. Eliyahu and R. Sheffer, "How Developers Choose Names," *IEEE Transactions on Software Engineering* 48(1), 2022; preprint arXiv:2103.07487. https://arxiv.org/abs/2103.07487

[138] F. Wen, C. Nagy, G. Bavota and M. Lanza, "A Large-Scale Empirical Study on Code-Comment Inconsistencies," ICPC 2019. https://www.inf.usi.ch/faculty/lanza/PUBS/P/Wen2019a.pdf

[139] "When Names Disappear: Revealing What LLMs Actually Understand About Code," arXiv:2510.03178, October 2025. https://arxiv.org/abs/2510.03178

[140] A. A. Ivanova, S. Srikant, Y. Sueoka, H. H. Kean, R. Dhamala, U.-M. O'Reilly, M. U. Bers and E. Fedorenko, "Comprehension of Computer Code Relies Primarily on Domain-General Executive Brain Regions," *eLife* 9, 2020. doi:10.7554/eLife.58906

[141] H. G. Rice, "Classes of Recursively Enumerable Sets and Their Decision Problems," *Transactions of the American Mathematical Society* 74, 1953. doi:10.1090/S0002-9947-1953-0053041-6

[142] O. Danvy and K. Millikin, "Refunctionalization at Work," BRICS RS-08-4, 2008; *Science of Computer Programming* 74(8), 2009. https://www.brics.dk/RS/08/4/

[143] M. S. Ager, D. Biernacki, O. Danvy and J. Midtgaard, "A Functional Correspondence between Evaluators and Abstract Machines," PPDP 2003. doi:10.1145/888251.888254

[144] J. J. M. M. Rutten, "Universal Coalgebra: A Theory of Systems," *Theoretical Computer Science* 249(1), 2000. doi:10.1016/S0304-3975(00)00056-6

[145] J. W. de Bakker and J. I. Zucker, "Processes and the Denotational Semantics of Concurrency," *Information and Control* 54(1-2), 1982. doi:10.1016/S0019-9958(82)91013-8

[146] C. P. Pfleeger, "State Reduction in Incompletely Specified Finite-State Machines," *IEEE Transactions on Computers* C-22(12), 1973. doi:10.1109/T-C.1973.223591

[147] A. Nerode, "Linear Automaton Transformations," *Proceedings of the American Mathematical Society* 9(4), 1958. doi:10.2307/2033204

[148] J. Hopcroft, "An n log n Algorithm for Minimizing States in a Finite Automaton," in *Theory of Machines and Computations*, Academic Press, 1971. doi:10.1016/B978-0-12-417750-5.50022-1

[149] L. D'Antoni and M. Veanes, "Minimization of Symbolic Automata," POPL 2014. doi:10.1145/2535838.2535849

[150] R. Reis, N. Moreira and M. Almeida, "On the Representation of Finite Automata," DCFS 2005. https://www.dcc.fc.up.pt/~nam/resources/publica/dcfsrma05.pdf

[151] M. Bojańczyk, B. Klin and S. Lasota, "Automata with Group Actions," LICS 2011. doi:10.1109/LICS.2011.48

[152] J. Lee et al., "A Linear Energy Model for Cortex-M0 Class Cores from Six Hardware Counters," arXiv:2104.01055, 2021. https://arxiv.org/abs/2104.01055

[153] N. van Kempen, H. Kwon, D. T. Nguyen and E. D. Berger, "It's Not Easy Being Green: On the Energy Efficiency of Programming Languages," arXiv:2410.05460v4, 2025. https://arxiv.org/abs/2410.05460


[154] Dauner et al., "Stale Reads: Sampling Hazards of On-Chip Energy Counters," HotCarbon 2026. https://hotcarbon.org/assets/2026/paper-46.pdf

[155] Z. Yang et al., "Part-Time Power Measurements: nvidia-smi's Lack of Attention," arXiv:2312.02741v3, 2024. https://arxiv.org/abs/2312.02741

[156] D. Perez and B. Livshits, "Broken Metre: Attacking Resource Metering in EVM," NDSS 2020; arXiv:1909.07220. https://arxiv.org/abs/1909.07220

[157] S. Smolka, N. Foster, J. Hsu, T. Kappé, D. Kozen and A. Silva, "Guarded Kleene Algebra with Tests: Verification of Uninterpreted Programs in Nearly Linear Time," POPL 2020. doi:10.1145/3371129

[158] Y. Sun, Y. Zhang and Z. Ni, "E-Graph Extraction with DAG Cost Is NP-Hard and Inapproximable," arXiv:2408.17042, 2024. https://arxiv.org/abs/2408.17042

[159] Unison Computing, "The Big Idea," Unison language documentation; and "A New Update Process," 20 October 2023. https://www.unison-lang.org/docs/the-big-idea/

[160] Dhall language standard, "Binary Semantics and Semantic Integrity Checks," `binary.md`. https://github.com/dhall-lang/dhall-lang/blob/master/standard/binary.md

[161] Tweag, "Towards a Content-Addressed Model for Nix," 10 September 2020, and "Self-References in a Content-Addressed Nix," 18 November 2020. https://www.tweag.io/blog/2020-09-10-nix-cas/


[162] "SpecRL: Measuring Specification Completeness for Verified Program Synthesis," arXiv:2604.05820, 2026. https://arxiv.org/abs/2604.05820

[163] J. Koppel, Z. Guo, E. de Vries and A. Solar-Lezama, "Searching Entangled Program Spaces," ICFP 2022. doi:10.1145/3547622

[164] M. Erol et al., "Cost-of-Pass: An Economic Framework for Evaluating Language Models," arXiv:2504.13359, 2025. https://arxiv.org/abs/2504.13359

[165] F. Cassano, J. Gouwar, F. Lucchetti, C. Schlesinger, A. Freeman, C. J. Anderson, M. Q. Feldman, M. Greenberg, A. Jangda and A. Guha, "Knowledge Transfer from High-Resource to Low-Resource Programming Languages for Code LLMs," OOPSLA 2024. doi:10.1145/3689735

[166] agentlanguages.dev, catalogue of agent-oriented programming languages, read 19 October 2026 (42 entries). https://agentlanguages.dev

[167] WebAssembly Community Group, "SpecTec Has Been Adopted," 27 March 2025; D. Youn et al., "Bringing the WebAssembly Standard up to Speed with SpecTec," PLDI 2024. https://webassembly.org/news/2025-03-27-spectec/

[168] D. Monniaux and S. Boulmé, "The Trusted Computing Base of the CompCert Verified Compiler," ESOP 2022. https://arxiv.org/abs/2201.10280

[169] G. Klein, J. Andronick, K. Elphinstone, T. Murray, T. Sewell, R. Kolanski and G. Heiser, "Comprehensive Formal Verification of an OS Microkernel," *ACM Transactions on Computer Systems* 32(1), 2014; cost figures from NICTA technical report 4180. https://www.trustworthy.systems/publications/nicta_full_text/4180.pdf

[170] S. Lu, S. Park, E. Seo and Y. Zhou, "Learning from Mistakes: A Comprehensive Study on Real World Concurrency Bug Characteristics," ASPLOS 2008. doi:10.1145/1346281.1346323

[171] R. Haas, R. Niedermayr, T. Röhm and S. Apel, "Is Static Analysis Able to Identify Unnecessary Source Code?" *ACM Transactions on Software Engineering and Methodology* 29(1), 2020. doi:10.1145/3368267

[172] N. Nagappan, B. Murphy and V. Basili, "The Influence of Organizational Structure on Software Quality: An Empirical Case Study," ICSE 2008. doi:10.1145/1368088.1368160

[173] "An Empirical Study of Go's Language Proposal Process," arXiv:2510.06984, October 2025 (1,095 proposals; 448 declined, 337 accepted). https://arxiv.org/abs/2510.06984

[174] Z. R. Tam, C.-K. Wu, Y.-L. Tsai, C.-Y. Lin, H. Lee and Y.-N. Chen, "Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models," EMNLP Industry 2024; arXiv:2408.02442. https://arxiv.org/abs/2408.02442

[175] B. Stroustrup, "Thriving in a Crowded and Changing World: C++ 2006-2020," HOPL IV, *Proceedings of the ACM on Programming Languages* 4(HOPL), 2020. doi:10.1145/3386320

[176] F. Mancinelli, J. Boender, R. Di Cosmo, J. Vouillon, B. Durak, X. Leroy and R. Treinen, "Managing the Complexity of Large Free and Open Source Package-Based Software Distributions," ASE 2006, pp. 199-208. doi:10.1109/ASE.2006.49

[177] P. Abate, R. Di Cosmo, G. Gousios and S. Zacchiroli, "Dependency Solving Is Still Hard, but We Are Getting Better at It," SANER 2020, pp. 547-551. doi:10.1109/SANER48275.2020.9054837

[178] R. Cox, "Version SAT," research!rsc, 13 December 2016. https://research.swtch.com/version-sat

[179] S. Raemaekers, A. van Deursen and J. Visser, "Semantic versioning and impact of breaking changes in the Maven repository," *Journal of Systems and Software* 129:140-158, 2017. doi:10.1016/j.jss.2016.04.008

[180] L. Ochoa, T. Degueule, J.-R. Falleri and J. Vinju, "Breaking bad? Semantic versioning and impact of breaking changes in Maven Central," *Empirical Software Engineering* 27:61, 2022. doi:10.1007/s10664-021-10052-y

[181] T. Winters, T. Manshreck and H. Wright (eds.), *Software Engineering at Google*, chapter 21, O'Reilly, 2020. https://abseil.io/resources/swe-book/html/ch21.html

[182] J. Wetter and N. Ringland, "Understanding the Impact of Apache Log4j Vulnerability," Google Open Source Insights, 17 December 2021. https://blog.deps.dev/log4j/

[183] E. Dolstra, *The Purely Functional Software Deployment Model*, PhD thesis, Utrecht University, 2006. https://edolstra.github.io/pubs/phd-thesis.pdf

[184] R. Di Cosmo, M. Gruenpeter and S. Zacchiroli, "Referencing Source Code Artifacts: a Separate Concern in Software Citation," *Computing in Science & Engineering* 22(2):33-43, 2020. doi:10.1109/MCSE.2019.2963148

[185] R. Hickey, "Spec-ulation," keynote, Clojure/conj, December 2016. Transcript: https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/Spec_ulation.md

[186] B. Godlin and O. Strichman, "Regression verification," DAC 2009, pp. 466-471. doi:10.1145/1629911.1630034

[187] J. Baumgartner, H. Mony, V. Paruthi, R. Kanzelman and G. Janssen, "Scalable Sequential Equivalence Checking across Arbitrary Design Transformations," ICCD 2006. https://research.ibm.com/publications/scalable-sequential-equivalence-checking-across-arbitrary-design-transformations

[188] C. Lamb and S. Zacchiroli, "Reproducible Builds: Increasing the Integrity of Software Supply Chains," *IEEE Software* 39(2):62-70, 2022. doi:10.1109/MS.2021.3073045

[189] Open Interface Engineering, "Languages for or by machine authors, January 2024 to October 2026," working note 5 of the survey of 24 October 2026, `rce/surveys/2026-10-24/notes/languages_for_machine_authors.md`, openIE-dev/openie-research-experiments. https://github.com/openIE-dev/openie-research-experiments

[190] Open Interface Engineering, "New general-purpose and systems languages, January 2024 to October 2026," working note 6 of the survey of 24 October 2026, `rce/surveys/2026-10-24/notes/new_general_purpose_languages.md`, openIE-dev/openie-research-experiments. https://github.com/openIE-dev/openie-research-experiments

[191] W. van Oortmerssen, Goose: a memory-safe systems language with no heap allocator, garbage collector, or lifetime annotations, repository, 2026. https://github.com/aardappel/goose

[192] dawnop, Dawn: a small functional language with effects in the type signature and content-addressed packages, repository, 2026. https://github.com/dawnop/dawn-lang

[193] Open Interface Engineering, "Batteries included or specification and free: what the record says, and one Form on every compute fabric," synthesis of the survey of 24 October 2026, with working notes 7 to 18 and the proposal `spec/proposals/one-library-every-fabric.md` of openIE-dev/rce. https://github.com/openIE-dev/openie-research-experiments/blob/main/rce/surveys/2026-10-24/batteries-specification-and-fabrics.md

[194] C. Heimes and B. Cannon, "PEP 594: Removing dead batteries from the standard library," Python Enhancement Proposals, 2019. https://peps.python.org/pep-0594/

[195] Rust project, "RFC 1242: Policy for rust-lang crates," 2015. https://rust-lang.github.io/rfcs/1242-rust-lang-crates.html

[196] A. Decan, T. Mens and P. Grosjean, "An empirical comparison of dependency network evolution in seven software packaging ecosystems," Empirical Software Engineering 24, 2019. https://doi.org/10.1007/s10664-017-9589-y

[197] N. Seriot, "Parsing JSON is a Minefield," 2016. https://seriot.ch/projects/parsing_json.html

[198] J. H. Davis, P. Sivaraman, J. Kitson, K. Parasyris, H. Menon, I. Minn, G. Georgakoudis and A. Bhatele, "Taking GPU Programming Models to Task for Performance Portability," Proc. ICS 2025. https://doi.org/10.1145/3721145.3730423

[199] C. Weckert, L. Solis-Vasquez, J. Oppermann, A. Koch and O. Sinnen, "Altis-SYCL: Migrating Altis Benchmarking Suite from CUDA to SYCL for GPUs and FPGAs," SC '23 Workshops, 2023. https://doi.org/10.1145/3624062.3624542

[200] T. Bourgeat, C. Pit-Claudel, A. Chlipala and Arvind, "The essence of Bluespec: a core language for rule-based hardware design," Proc. PLDI 2020. https://doi.org/10.1145/3385412.3385965

[201] A. Haas, A. Rossberg, D. L. Schuff, B. L. Titzer, M. Holman, D. Gohman, L. Wagner, A. Zakai and J. F. Bastien, "Bringing the Web up to Speed with WebAssembly," Proc. PLDI 2017. https://doi.org/10.1145/3062341.3062363

[202] A. Arteaga, O. Fuhrer and T. Hoefler, "Designing Bit-Reproducible Portable High-Performance Applications," Proc. IPDPS 2014. https://doi.org/10.1109/IPDPS.2014.127

[203] D. Lustig, S. Sahasrabuddhe and O. Giroux, "A Formal Analysis of the NVIDIA PTX Memory Consistency Model," Proc. ASPLOS 2019. https://doi.org/10.1145/3297858.3304043

[204] StarPU project, StarPU Handbook: performance models and simulation with SimGrid, Inria. https://files.inria.fr/starpu/doc/html/

[205] J. Spracklen, R. Wijewickrama, A. H. M. N. Sakib, A. Maiti, B. Viswanath and M. Jadliwala, "We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs," Proc. USENIX Security 2025.
