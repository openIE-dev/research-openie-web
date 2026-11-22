---
title: "La quête de l'AGI résout le problème des trois corps en informatique"
deck: "Les systèmes informatiques échouent le plus souvent lors des transferts entre les personnes qui les spécifient, les construisent et les utilisent. Vérifier chaque hypothèse à chaque transfert produit une pile où une correction reste là où elle est effectuée."
lang: "fr"
source: "three-body"
complete: true
---

<div id="the-pursuit-of-agi-resolves-the-three-body-problem-in-computing" class="anchor-alias" aria-hidden="true"></div>

*Révision 395f081, 4 novembre 2026. LaTeX PDF: [/pdfs/latex/three-body.pdf](/pdfs/latex/three-body.pdf) ([source](/pdfs/latex/three-body.tex)).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

Les grandes défaillances d’ingénierie commencent souvent lorsqu’un groupe transfère du travail à un autre et qu’une hypothèse n’est jamais consignée par écrit. Cet article définit ces transferts, indique quand leur vérification rend le système stable, et propose des tests susceptibles de le contredire.

**En termes simples**

1. La plupart des importantes pannes informatiques surviennent au moment du transfert entre équipes ou composants, et non à l’intérieur de ceux‑ci.
2. La cause est généralement une supposition que personne n’a écrite, comme l’unité d’une valeur numérique.
3. Si chaque supposition est consignée et vérifiée par une machine, une correction appliquée en un point demeure effective et ne compromet rien au niveau supérieur.

<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. Thèse

Dans le roman de Liu Cixin *The Three-Body Problem* [1], une civilisation vit sur une planète qui orbite trois soleils. Ses saisons n’ont aucun rythme, car personne ne peut prédire où se trouveront trois corps soumis à la gravité mutuelle. Le titre de cet article emprunte cette image à l’informatique, puis la renverse : l’instabilité est réelle, mais elle possède une cause qui peut être localisée, et cette cause peut être éliminée.

L’informatique comporte trois corps. **Les théoriciens** définissent ce que le système doit faire : les mathématiques, la spécification, l’algorithme, le modèle physique. **Les concepteurs** le construisent : les concepteurs de puces, les rédacteurs de compilateurs et de noyaux, les auteurs de bibliothèques, les intégrateurs. **Les utilisateurs** l’exécutent : les opérateurs, les programmes en aval, les personnes et les machines qui dépendent de sa sortie. Chaque corps est compétent et cohérent en interne. Un théorème tient. Une puce satisfait sa fiche technique. Un utilisateur suit la documentation.

Le problème se situe entre eux. Chaque transfert d’un corps à l’autre implique des hypothèses : sur les unités, les tensions, les plages, le timing, la mémoire, les codages, les versions, les enveloppes d’exploitation et l’intention. Lorsque chaque corps suppose que le transfert n’existe pas, ou qu’il relève de la responsabilité de quelqu’un d’autre, l’hypothèse n’est jamais consignée par écrit, et une hypothèse non consignée n’est jamais vérifiée.

**L’affirmation principale.** L’instabilité des systèmes informatiques se trouve dans leurs interfaces non examinées, et non dans les corps eux‑mêmes. Poursuivre sérieusement l’intelligence artificielle générale (AGI), en tant que système qui doit agir correctement à travers chaque corps et chaque niveau de la pile, oblige à rendre explicites et à vérifier toutes les hypothèses d’interface. Une pile dont les hypothèses d’interface sont toutes explicites et vérifiées est stable dans un sens précis : une correction apportée à un niveau reste correcte à ce niveau et se propage à chaque niveau supérieur. C’est la résolution que le titre nomme.

L’affirmation est à la fois d’ingénierie et de théorie. Elle est énoncée avec des définitions dans [Section 5](#5-definitions-and-propositions), repose sur la littérature d’interface revue dans [Section 4](#4-the-interface-literature), ses preuves proviennent de systèmes vérifiés testés de façon indépendante ([Section 6](#6-the-stabilized-configuration)), et elle inclut des protocoles et des falsificateurs capables de la contester ([Section 8](#8-protocols) et [Section 9](#9-falsifiers)).

<div id="2-the-three-body-problem-and-what-the-analogy-carries" class="anchor-alias" aria-hidden="true"></div>

## 2. Le problème des trois corps, et ce que l'analogie implique

<div id="21-what-the-physics-says" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Ce que dit la physique

Newton a résolu le mouvement de deux corps sous gravité mutuelle sous forme fermée : chaque corps se déplace le long d’une section conique autour de leur centre de masse commun. Ajouter un troisième corps modifie le caractère du problème. Le mémoire de Poincaré pour le prix du roi Oscar II, publié dans *Acta Mathematica* en 1890, a montré que, au‑delà des intégrales classiques, le problème à trois corps ne possède pas d’autres intégrales du type qui le réduirait à des quadratures, et en corrigeant une erreur dans sa première soumission il a découvert l’enchevêtrement de trajectoires près d’une orbite périodique qui est aujourd’hui reconnu comme la première apparition du chaos déterministe [2, 3]. L’histoire de Barrow‑Green retrace l’épisode du prix au mémoire corrigé [3].

« Pas de forme fermée générale » nécessite de la prudence, car cette affirmation est souvent exagérée. Sundman a montré, dans des travaux publiés en 1912 et 1913, que le problème à trois corps possède bien une solution en série convergente pour tout temps, à condition que le moment angulaire total ne soit pas nul [4], et Wang a étendu une solution en série globale au problème à n corps en 1991 [5]. Les séries convergent si lentement qu’elles sont inutiles pour la prévision. Le contenu pratique du résultat de Poincaré subsiste : il n’existe pas de formule simple, et des conditions initiales proches peuvent se séparer de façon exponentielle, de sorte que la prévision à long terme d’une configuration générique n’est pas disponible. Lorenz a constaté la même sensibilité dans un modèle à trois variables de convection en 1963 [6]. Stone et Leigh ont montré en 2019 que le problème chaotique, non hiérarchique, à trois corps peut être décrit statistiquement, par la distribution de ses issues, bien que les trajectoires individuelles ne puissent pas être prédites [7].

<div id="22-the-special-stable-configurations" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Les configurations stables spéciales

Le chaos est le cas générique, pas le seul cas. Lagrange a découvert en 1772 que trois corps peuvent conserver leurs positions relatives tout en tournant ensemble : en ligne droite, ou aux sommets d’un triangle équilatéral [3]. Dans le problème restreint, où le troisième corps est léger, il s’agit des cinq points de Lagrange. Les points triangulaires sont linéairement stables lorsque le corps primaire le plus massif est suffisamment lourd par rapport au plus petit, une condition énoncée par Routh en 1874 (rapport de masses supérieur à environ 25) [8]. Les engins spatiaux se stationnent aujourd’hui près des points de Lagrange du Soleil et de la Terre pour cette raison. D’autres solutions périodiques existent : Moore a trouvé numériquement l’orbite en forme de huit en 1993 [9], Chenciner et Montgomery ont démontré son existence pour des masses égales en 2000 [10], et Šuvakov et Dmitrašinović ont découvert de nouvelles familles en 2013 [11].

La leçon de cet article réside dans la forme de ces solutions. Chaque configuration stable est un arrangement particulier dans lequel les forces entre les corps sont équilibrées dans un référentiel qui se déplace avec eux. La stabilité n’est pas une propriété d’un corps isolé. C’est une propriété des relations entre les corps, et d’un référentiel dans lequel ces relations restent fixes.

<div id="23-analogy-and-mechanism" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Analogie et mécanisme

Une métaphore empruntée à la physique peut induire en erreur. Le tableau sépare ce que cet article utilise comme analogie de ce qu’il affirme comme mécanisme.

| Le problème à trois corps | En informatique | Statut dans cet article |
|---|---|---|
| Trois masses, chacune simple prise isolément | Théoriciens, constructeurs et utilisateurs, chacun cohérent pris isolément | Analogie |
| L’instabilité provient des interactions, pas d’un corps en particulier | L’échec provient des interfaces, pas de l’intérieur des corps | Mécanisme, appuyé par les études d’échec de la Section 3 et la littérature de la Section 4 |
| Dépendance sensible aux conditions initiales | Un petit désalignement non contrôlé à une interface croît en se propageant à travers les niveaux | Mécanisme, énoncé comme Proposition 2 |
| Pas de forme fermée générale utile | Aucun corps unique ne peut prédire le comportement du système complet à partir de son propre modèle | Analogie ; l’informatique ne possède pas d’équations du mouvement |
| Des configurations stables existent dans un cadre co‑rotatif | Une pile dont les hypothèses d’interface sont toutes vérifiées maintient une correction là où elle est appliquée | Mécanisme, énoncé comme Proposition 3 |
| Description statistique des issues chaotiques [7] | Les taux d’échec peuvent être mesurés à grand N même lorsque les échecs individuels ne sont pas prévus | Méthode, utilisée dans les protocoles de la Section 8 |

L’article ne prétend jamais que l’informatique obéisse à la dynamique newtonienne, que les interfaces exercent des forces, ou qu’un exposant de Lyapunov puisse être calculé pour une organisation. La physique fournit le vocabulaire et une leçon structurelle : la stabilité provient des relations, et elle se trouve dans des configurations spéciales, pas dans le cas générique.

<div id="3-the-three-bodies-of-computing-and-their-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 3. Les trois corps de l'informatique et leurs interfaces

![Diagramme de trois parties, théoriciens, concepteurs et utilisateurs, dessinés comme des cercles aux coins d’un triangle. Chaque arête entre deux parties est une interface représentée par une bande, étiquetée avec les hypothèses qui la traversent : du théoricien au concepteur transporte la spécification, ses unités et son domaine d’opération ; du concepteur à l’utilisateur transporte l’API, la version ainsi que les limites de tension et de timing ; de l’utilisateur au théoricien transporte l’usage réel, les défaillances observées et l’intention jamais écrite. Les portions pointillées de chaque bande indiquent les hypothèses qu’aucune partie n’écrit ou ne vérifie.](/figures/three-body/three-bodies.svg)

*Figure 1. Les trois parties et leurs trois interfaces. Diagramme. Les parties sont dessinées en plein car chacune est cohérente prise isolément. Les bandes pointillées représentent les hypothèses non examinées d’où proviennent les défaillances. Une [copie PNG](/figures/three-body/three-bodies.png) est fournie.*

<div id="31-theorist-to-maker" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Du théoricien au concepteur

Une déclaration de théoricien suppose un domaine : unités, intervalles, enveloppe de fonctionnement, machine idéalisée. L’implémentation d’un concepteur suppose que la déclaration est complète. Lorsque aucun des deux n’inscrit l’enveloppe, l’implémentation est correcte pour un monde qui n’est pas celui dans lequel elle sera exécutée.

La perte du Mars Climate Orbiter en 1999 constitue le cas classique. Le conseil d’enquête sur l’incident a constaté que le logiciel au sol fournissait les données d’impulsion des propulseurs en unités anglaises (pound‑force seconds) alors que le logiciel de navigation attendait des unités métriques (newton seconds), et que l’erreur s’est accumulée pendant la croisière jusqu’à ce que le vaisseau spatial pénètre dans l’atmosphère bien en dessous de l’altitude prévue [12]. Chaque partie a effectué son propre travail. L’unité était une hypothèse d’interface que personne n’a vérifiée.

<div id="32-maker-to-user" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Du concepteur à l'utilisateur

Un fabricant publie une interface et un utilisateur en dépend. La documentation indique une partie du contrat. Le reste dépend de ce que l’implémentation fait réellement. L’observation de Hyrum indique la conséquence : avec un nombre suffisant d’utilisateurs d’une API, chaque comportement observable du système sera exploité par quelqu’un, quels que soient les engagements du contrat [13]. L’essai de Spolsky sur les abstractions fuyantes fait le point complémentaire : toute abstraction non triviale expose, dans une certaine mesure, ce qu’elle était censée dissimuler [14].

Le premier vol d’Ariane 5 en 1996 montre comment l’hypothèse du fabricant se transmet à un nouvel utilisateur. Le comité d’enquête a constaté que le logiciel de référence inertielle réutilisé depuis Ariane 4 convertissait une valeur en virgule flottante de 64 bits liée à la vitesse horizontale en entier signé de 16 bits ; sur la trajectoire plus rapide d’Ariane 5, la valeur dépassait la plage, la conversion a levé une exception, les deux unités de référence se sont arrêtées, et le lanceur s’est désintégré environ 40 secondes après le début de la séquence de vol [15]. Le logiciel était correct pour l’enveloppe pour laquelle il avait été écrit. Cette enveloppe était une hypothèse d’interface qui a voyagé avec le code sans être reformulée ni vérifiée [15, 16].

Le même schéma apparaît à la frontière matérielle. Un jeu d’instructions constitue un contrat que les fournisseurs révisent. La spécification non privilégiée de RISC‑V répertorie plusieurs bases ratifiées ainsi qu’une liste longue et croissante d’extensions ratifiées [17]. Apple a déplacé le Mac des processeurs Intel vers le silicium Apple, annoncé en 2020, et fournit Rosetta comme couche de traduction pour les applications conçues pour le contrat antérieur ; la page d’Apple indique également qu’à partir de macOS 28 Rosetta ne restera disponible que pour certains jeux plus anciens [18]. La couche de traduction est elle‑même une interface avec une fin publiée. Un logiciel écrit comme si le contrat d’instruction était fixe rencontre une révision qu’il n’attendait pas, et le remède consiste en une autre couche d’interface.

<div id="33-user-to-theorist" class="anchor-alias" aria-hidden="true"></div>

### 3.3 De l'utilisateur au théoricien

Le chemin de retour est le moins étudié. Les utilisateurs apprennent ce qu’un système fait réellement, où il échoue et ce qu’ils voulaient demander. À moins que cette connaissance ne revienne aux théoriciens sous forme d’une déclaration révisée, la spécification suivante répète les anciennes hypothèses. Le compte rendu de Zave et Jackson sur les exigences rend l’écart précis : une exigence est une affirmation concernant l’environnement, une spécification est une affirmation au niveau de l’interface, et la connaissance du domaine qui les relie est souvent non écrite [19]. Le « hardware lottery » de Hooker montre le chemin de retour fonctionnant en sens inverse : les idées de recherche réussissent ou échouent selon le matériel et le logiciel disponibles, et non uniquement sur leurs mérites, de sorte que ce que les concepteurs construisent façonne ce que les théoriciens peuvent imaginer [20].

<div id="34-why-the-instability-looks-irreducible" class="anchor-alias" aria-hidden="true"></div>

### 3.4 Pourquoi l'instabilité semble irréductible

Chaque corps ne voit que son propre modèle cohérent. De l’intérieur de n’importe quel corps, les défaillances susmentionnées apparaissent comme de la malchance ou l’erreur d’autrui, car la cause se situe sur une frontière qui n’appartient à aucun corps. Il s’agit de l’équivalent informatique de l’affirmation selon laquelle trois corps n’ont pas de formule simple : aucun modèle de participant unique ne prédit l’ensemble. Sculley et ses collègues ont observé la même structure au sein des systèmes d’apprentissage automatique, où le code du modèle ne constitue qu’une petite partie du système et la majeure partie du coût de maintenance réside dans le code d’assemblage, la configuration, les dépendances de données et les consommateurs non déclarés, c’est‑à‑dire dans les interfaces [21].

<div id="4-the-interface-literature" class="anchor-alias" aria-hidden="true"></div>

## 4. La littérature sur les interfaces

La thèse n’est pas nouvelle dans ses parties. Sa contribution consiste à les assembler en une seule déclaration et à y joindre une configuration stabilisante ainsi qu’un test.

**La structure suit la communication.** Conway a observé en 1968 que les organisations qui conçoivent des systèmes produisent des conceptions qui copient la structure de communication de l’organisation [22]. MacCormack, Baldwin et Rusnak ont testé cette hypothèse de miroir sur des paires de produits construits par des organisations fortement et faiblement couplées et ont constaté que les architectures des produits diffèrent dans la direction prévue [23]. Si les corps ne communiquent pas à travers une arête, le système possède une interface non examinée à cette arête.

**Les interfaces sont le lieu où réside le savoir‑faire de conception.** Parnas a soutenu en 1972 qu’un système doit être divisé en modules selon les décisions que chaque module masque, de sorte qu’un changement dans une décision soit confiné à un module [24]. Baldwin et Clark ont généralisé cela en règles de conception : décisions d’interface visibles fixées à l’avance, derrière lesquelles les modules cachés peuvent varier [25]. Henderson et Clark ont montré que les entreprises établies échouent dans l’innovation architecturale, un changement dans la façon dont les composants connus sont reliés, parce que leur connaissance des interfaces est intégrée à leur organisation et reste non examinée [26].

**La correction doit être vérifiée aux extrémités.** L’argument de bout en bout de Saltzer, Reed et Clark affirme qu’une fonction ne peut être implémentée complètement et correctement qu’avec la connaissance de l’application aux points d’extrémité, de sorte que les contrôles dans les couches inférieures ne sont que des aides de performance [27]. L’argument ne dit pas que les interfaces intermédiaires n’ont pas besoin de contrôles. Il indique que la propriété qui importe doit être vérifiée là où sa signification est connue.

**Les contrats rendent les hypothèses explicites.** Hoare a attribué des préconditions et postconditions aux programmes en 1969 [28]. Meyer les a transformées en design by contract, où chaque routine indique ce qu’elle requiert et ce qu’elle garantit [29]. Liskov et Wing ont défini quand un composant peut remplacer un autre : lorsqu’il préserve le comportement sur lequel ses utilisateurs comptent [30]. Chaque approche consiste à consigner une hypothèse d’interface afin qu’elle puisse être vérifiée.

**La réutilisation échoue en cas d’hypothèses incompatibles.** Garlan, Allen et Ockerbloom ont constaté en 1995 que la construction d’un système à partir de pièces existantes échouait parce que chaque pièce faisait des hypothèses implicites sur les autres, concernant le contrôle, les données, les protocoles et l’environnement, et que ces hypothèses étaient en conflit [31]. En revisitant le problème en 2009, ils ont constaté qu’il persistait toujours [32].

**Les accidents sont des échecs d’interaction.** Le compte rendu systémique de Leveson considère la sécurité comme un problème de contrôle : les accidents résultent d’interactions dangereuses entre des composants qui respectent chacun leur spécification [33]. Le court traité de Cook sur les défaillances de systèmes complexes dit la même chose du point de vue opérationnel : une catastrophe nécessite plusieurs défaillances, et le système fonctionne généralement en mode dégradé [34]. Les observations de Lehman sur l’évolution logicielle ajoutent la dimension temporelle : un programme utilisé dans le monde doit continuer à évoluer, et sa complexité augmente à moins que des efforts ne soient faits pour la réduire [35].

**Les noyaux vérifiés montrent qu’une frontière peut être une preuve.** seL4 a été le premier noyau de système d’exploitation à usage général avec une preuve vérifiée par machine que son implémentation satisfait sa spécification [36]. La preuve constitue un contrôle d’interface total : entre la spécification et le code, rien n’est supposé.

<div id="5-definitions-and-propositions" class="anchor-alias" aria-hidden="true"></div>

## 5. Définitions et propositions

<div id="51-definitions" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Définitions

**Définition 1 (corps).** Un corps est une partie disposant d’un modèle interne cohérent d’un système : un théoricien, un créateur ou un utilisateur. Un corps peut être une personne, une équipe, une organisation ou un programme.

**Définition 2 (interface).** Une interface est un transfert entre deux corps, ou entre deux niveaux d’une pile, à travers lequel la sortie d’un côté devient l’entrée de l’autre côté.

**Définition 3 (hypothèse d’interface).** Une hypothèse d’interface est un prédicat $a$ sur les valeurs qui traversent une interface, sur lequel le côté récepteur compte pour garantir sa propre correction. Exemples : une unité, une plage, un type, une tension, une contrainte de synchronisation, une version, une enveloppe.

**Définition 4 (vérifiée et non examinée).** Une hypothèse est vérifiée lorsqu’un mécanisme évalue $a$ à chaque passage et refuse le passage lorsque $a$ échoue. Elle est non examinée lorsqu’elle est prise en compte mais n’est ni consignée ni évaluée.

**Définition 5 (pile).** Une pile est une séquence de niveaux $L_0, \dots, L_n$ où chaque niveau consomme le niveau inférieur uniquement via l’interface qui les relie. Un corps peut posséder plusieurs niveaux ; une interface peut relier deux corps ou deux niveaux d’un même corps.

**Définition 6 (agent général).** Selon Legg et Hutter, un agent général est celui dont la performance est mesurée sur une large classe d’environnements, et non sur une tâche unique [37]. Morris et ses collègues opérationnalisent les niveaux d’AGI à la fois par la performance et la généralité [38]. Dans cet article, la propriété pertinente est la généralité entre corps : l’agent doit agir en tant que théoricien, créateur et utilisateur, et à chaque niveau de la pile.

<div id="52-propositions" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Propositions

**Proposition 1 (les défaillances proviennent d’interfaces non examinées).** Si chaque corps est correct par rapport à son propre modèle, alors chaque défaillance du système composé viole au moins une hypothèse d’interface, et si chaque hypothèse est vérifiée, la première hypothèse violée est refusée à l’interface où elle se produit.

*Ébauche de preuve.* Si chaque corps est correct par rapport à ses entrées et que chaque entrée satisfait les hypothèses dont le corps dépend, la composition est correcte par induction sur la pile. Une défaillance nécessite donc un franchissement où une hypothèse échoue. Si cette hypothèse est vérifiée, le franchissement est refusé à ce point, de sorte que la défaillance est localisée à cette interface et ne se propage pas. ∎

**Proposition 2 (les incompatibilités non vérifiées se propagent).** Si une hypothèse à l’interface entre $L_k$ et $L_{k+1}$ n’est pas examinée, une violation à cette interface peut produire des valeurs erronées à tous les niveaux supérieurs à $k$, et aucune vérification à un niveau supérieur à $k$ formulée uniquement dans les termes de ce niveau ne peut la localiser.

*Ébauche.* Les niveaux supérieurs à $k$ ne voient que les sorties de $L_{k+1}$, qui sont bien formées par rapport au modèle propre de $L_{k+1}$. Le Mars Climate Orbiter en est l’exemple : la solution de navigation était cohérente en interne et incorrecte [12].

**Proposition 3 (la configuration stabilisée).** Dans une pile où chaque hypothèse d’interface est explicite et vérifiée, une correction effectuée au niveau $k$ qui passe la vérification de sa propre frontière laisse intactes toutes les propriétés établies par les vérifications des autres frontières, et chaque niveau supérieur à $k$ hérite de la correction sans modification.

*Ébauche.* Les vérifications aux autres frontières évaluent des prédicats sur les valeurs qui traversent ces frontières. Le $L_k$ corrigé ne modifie que les valeurs qui traversent les frontières de $L_k$, et ses valeurs sortantes satisfont l’hypothèse vérifiée de la frontière au-dessus. Chaque niveau supérieur à $k$ consomme $L_k$ uniquement via une interface vérifiée, de sorte que si le $L_k$ corrigé satisfait cette interface, les consommateurs reçoivent une entrée correcte. ∎

**Proposition 4 (la quête de l’AGI impose l’explicitation).** Supposons qu’un agent général au sens de la Définition 6 doive franchir une porte de correction sur des tâches tirées de tous les trois corps et de tous les niveaux de la pile. Alors, pour chaque interface que la distribution de tâches traverse, soit l’agent rend explicite l’hypothèse d’interface et la vérifie, soit il existe une tâche dont le succès de l’agent dépend d’une supposition non vérifiée concernant cette hypothèse.

*Argument.* Un système étroit peut se reposer sur la convention de son unique environnement : un système d’unités fixe, un jeu d’instructions fixe, une version fixe. Un agent général fait face à des environnements où ces conventions diffèrent, par construction de la généralité. Une hypothèse qui tient dans un environnement et échoue dans un autre doit être détectée pour être gérée, et la détecter revient à la vérifier. Une porte de correction est un test qu’une exécution passe ou échoue, sans crédit partiel. Sous une telle porte, une supposition qui s’avère fausse constitue une tâche échouée, pas un crédit partiel. Ainsi, la quête de généralité sous une porte crée une pression vers des interfaces explicites et vérifiées à chaque frontière que l’agent touche. La proposition ne prétend pas qu’un système actuel satisfasse ce critère. Elle décrit ce que l’objectif exige.

**Proposition 5 (les joules classent les configurations stables).** Parmi les piles qui franchissent la porte, celle qui résout chaque interface avec le moins d’énergie jusqu’à la complétion est préférée, et une vérification explicite effectuée une fois à une interface est moins coûteuse sur une charge de travail qu’un échec redécouvert à chaque niveau supérieur.

*Esquisse.* L’ordre est porte puis rang : la correction est une contrainte que chaque candidat doit satisfaire, et l’énergie jusqu’à la complétion, en joules, classe uniquement les candidats qui la respectent, comme dans une optimisation contrainte où l’objectif n’est comparé que sur l’ensemble faisable. Une vérification à la frontière a un coût fixe par traversée. Un désaccord non examiné engendre un coût à chaque niveau qu’il atteint, et ce coût se répète à chaque exécution jusqu’à ce que le désaccord soit détecté.

<div id="6-the-stabilized-configuration" class="anchor-alias" aria-hidden="true"></div>

## 6. La configuration stabilisée

![Diagramme des trois mêmes corps, maintenant disposés aux coins d'un triangle équilatéral à l'intérieur d'un cadre tournant, à la manière de la configuration de Lagrange. Chaque bande d'interface est solide et porte une coche ainsi qu'une courte étiquette : la spécification écrite une fois, la porte à l'entrée, et la trace et le reçu qui reviennent au théoricien. Au centre se trouve un cadre partagé intitulé une spécification, une porte, joules comme classement.](/figures/three-body/stabilized.svg)

*Figure 2. La configuration stabilisée. Diagramme. En physique, trois corps conservent leurs positions relatives dans un cadre qui tourne avec eux. En informatique, le cadre partagé est une déclaration explicite, vérifiable par machine, de l'intention avec chaque hypothèse d'interface vérifiée, de sorte que les trois corps conservent leurs relations lorsque le système évolue. Une [copie PNG](/figures/three-body/stabilized.png) est fournie.*

<div id="61-the-shared-frame" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Le cadre partagé

Les configurations de Lagrange ne sont stables que dans un référentiel qui se déplace avec les corps. L’équivalent informatique est une représentation partagée que les trois corps lisent et écrivent, dans laquelle chaque hypothèse d’interface est une affirmation vérifiable : une spécification formelle, un contrat vérifié par machine, ou un type. Lorsque l’énoncé du théoricien, l’implémentation du concepteur et le comportement observé par l’utilisateur sont reliés par des vérifications contre une telle représentation, les transferts entre eux sont des vérifications plutôt que des traductions.

<div id="62-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Chaque hypothèse d'interface rendue explicite

![Diagram of a stack with six levels from intent at the top through specification, gate, projections and runtime to hardware and energy. Between each pair of adjacent levels sits an interface drawn as a small gate with its assumption and its check written beside it. A correction made at the runtime level is drawn with arrows rising through each checked interface to the levels above.](/figures/three-body/stack-checks.svg)

*Figure 3. La pile avec chaque interface vérifiée. Diagramme. Une [copie PNG](/figures/three-body/stack-checks.png) est fournie.*

La méthode comporte trois étapes. Énumérez chaque frontière de la pile. Pour chacune, formulez l'hypothèse sur laquelle le côté récepteur s'appuie sous forme de prédicat, et indiquez le mécanisme qui l'évalue à chaque traversée. Lorsqu'une vérification échoue, la rupture se situe à cette frontière ; la correction est effectuée à ce niveau, transmise à travers la vérification de cette frontière, et héritée par les niveaux supérieurs.

<div id="63-evidence-from-verified-systems" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Preuves issues des systèmes vérifiés

L’existence de configurations stabilisées, au sens de la Proposition 3, est confirmée par des systèmes construits et testés par des groupes indépendants.

- **Un compilateur vérifié soumis à des tests aléatoires.** CompCert est un compilateur C dont la partie intermédiaire et le back‑end d’optimisation portent une preuve formellement vérifiée que le code généré préserve la sémantique de la source [39]. Yang, Chen, Eide et Regehr ont exécuté Csmith, un générateur de programmes aléatoires, contre CompCert et de nombreux autres compilateurs. Ils ont signalé des centaines de bogues auparavant inconnus dans les autres compilateurs. Dans CompCert, ils n’ont trouvé aucune erreur de code erroné dans la partie intermédiaire vérifiée. Les défauts qu’ils ont découverts se situaient dans des parties hors de la preuve, telles que le front‑end et une hypothèse non vérifiée concernant la cible [40]. Les échecs sont apparus là où une hypothèse est restée non vérifiée, comme le prédisent les Propositions 1 et 2, et non pas à travers des frontières vérifiées.
- **Une frontière de noyau vérifiée.** La preuve de seL4 relie son implémentation C à une spécification abstraite, de sorte qu’entre la spécification et le code rien n’est supposé [36]. La preuve est formulée par rapport à des hypothèses explicites concernant le compilateur, le code assembleur et le matériel, ce qui illustre la méthode de la Section 6.2 en pratique : les hypothèses résiduelles sont consignées comme les interfaces restantes.
- **Spécifications dans la pratique industrielle.** Newcombe et ses collègues rapportent que des ingénieurs d’Amazon Web Services ont rédigé des spécifications TLA+ pour les systèmes distribués de base, et que la vérification de modèle a mis en évidence des bogues de conception subtils, certains nécessitant de longues séquences d’événements, que la révision et les tests avaient manqués [41].
- **Unités comme interface vérifiée.** Les types de dimension de Kennedy intègrent l’unité d’une grandeur dans son type, de sorte qu’une valeur en pound‑force‑second ne peut pas être transmise là où une valeur en newton‑second est attendue sans conversion explicite [42]. L’hypothèse d’interface à l’origine de la perte du Mars Climate Orbiter [12] devient un refus à la compilation.

Ces preuves proviennent de systèmes uniques, chacun construit avec des contrôles en tête. Elles montrent que la configuration stabilisée existe et peut être maintenue. Elles ne démontrent pas que la configuration s’étende à des piles qui traversent plusieurs organisations. Les protocoles de la Section 8 sont rédigés pour tester cela.

<div id="7-the-hardware-side" class="anchor-alias" aria-hidden="true"></div>

## 7. Le côté matériel

La frontière matérielle est l’endroit où les hypothèses d’interface deviennent physiques : une tension d’alimentation, une enveloppe thermique, un modèle de mémoire, un contrat d’instruction. La section 3.2 a présenté le contrat d’instruction comme un exemple d’interface du fabricant qui est révisée au fil du temps [17, 18]. Une pile qui considère le matériel comme fixe possède une interface non examinée à son niveau le plus bas, et la Proposition 2 indique qu’un désalignement à ce niveau peut atteindre tous les niveaux supérieurs.

Dans cet article, le côté matériel est un ensemble d’interfaces à rendre explicites, et un résultat matériel entre sous la même porte et le même classement énergétique que le logiciel.

<div id="8-protocols" class="anchor-alias" aria-hidden="true"></div>

## 8. Protocoles

Chaque protocole est fixé avant son exécution. Les valeurs d’énergie portent l’une des trois étiquettes : `est_j` pour une estimation analytique, `reported_j` pour une lecture provenant d’un système d’exploitation ou d’un compteur intégré, et `measured_j` pour une lecture provenant d’un wattmètre externe.

<div id="81-interface-inventory" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Inventaire des interfaces

Pour un système cible, énumérez chaque interface entre corps et chaque interface entre niveaux. Pour chacune, consignez l’hypothèse sous forme de prédicat, son propriétaire, et si un mécanisme la vérifie. Indiquez la fraction des hypothèses qui sont vérifiées, ainsi que la fraction qui n’ont aucun propriétaire. Deux auditeurs indépendants inventorient le même système ; indiquez leur accord.

<div id="82-break-and-catch" class="anchor-alias" aria-hidden="true"></div>

### 8.2 Rupture et capture

Pour chaque hypothèse enregistrée, injectez une violation à cette interface sur un ensemble de graines fixes. Enregistrez si la violation est refusée à cette interface, interceptée à un niveau ultérieur, ou non interceptée. La Proposition 1 prédit que les hypothèses vérifiées sont refusées à leur propre interface. La Proposition 2 prédit que les hypothèses non examinées, lorsqu’elles sont interceptées, le sont plus tard et ne sont pas localisées.

<div id="83-compounding" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Composition

Exécutez une charge de travail fixe pendant $R$ cycles avec et sans une correction promue à un niveau choisi. Enregistrez les escalades, les échecs et l’énergie par cycle. La Proposition 3 prédit que les escalades cumulées avec la correction ne sont pas supérieures à aucun cycle, et qu’aucune propriété vérifiée avant la promotion ne tombe en défaut après celle‑ci.

<div id="84-cross-body-handoff" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Transfert entre les corps

Choisissez un véritable transfert entre organisations : une spécification transmise à un implémenteur, une bibliothèque transmise aux utilisateurs en aval, ou une révision matérielle transmise au logiciel. Exprimez le transfert sous forme de représentation partagée avec des hypothèses explicites, exécutez le protocole break and catch dessus, et comparez-le avec le même transfert présenté sous forme de documentation en prose. Rapportez les échecs situés à l’interface dans chaque branche, avec des intervalles Wilson à 95 %.

<div id="85-generality-under-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Généralité sous la porte

Construisez un ensemble de tâches qui fait varier les conventions aux interfaces : unités, contrats d'instructions, versions de bibliothèques, encodages. Évaluez les agents sous une porte de correction. La Proposition 4 prédit que la réussite sur l'ensemble varié nécessite de détecter la convention, de sorte que les agents qui vérifient explicitement les hypothèses d'interface devraient réussir une plus grande part des tâches variées que les agents qui supposent une valeur par défaut, tout en obtenant un succès comparable sur les tâches par défaut. Classez les agents qui réussissent selon les joules nécessaires à l'achèvement.

<div id="9-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 9. Falsificateurs

Fixé avant les exécutions qu'ils testent.

| ID | Observation | Défaites |
|---|---|---|
| TBP-F1 | Dans le protocole de rupture et de capture, une violation d'une hypothèse vérifiée est acceptée à sa propre interface | Proposition 1 telle qu'énoncée pour le système testé |
| TBP-F2 | Dans le protocole de composition, une correction qui réussit son propre contrôle de frontière entraîne l'échec d'un contrôle précédemment réussi à une autre frontière | Proposition 3 |
| TBP-F3 | Dans le protocole inter-corps, la représentation partagée ne localise pas davantage d'échecs d'interface que la documentation en prose, dans les intervalles | L'affirmation que les interfaces explicitement vérifiées stabilisent les transferts entre corps |
| TBP-F4 | Dans le protocole de généralité, les agents qui supposent les valeurs par défaut réussissent les tâches variées à un taux pas inférieur à celui des agents qui vérifient, avec des performances par défaut correspondantes | Proposition 4 |
| TBP-F5 | Un inventaire d'interface d'un système fonctionnel trouve des échecs dont la cause ne peut être attribuée à aucune hypothèse d'interface, chaque corps étant correct par rapport à son propre modèle | Le compte d'interface de l'instabilité |

<div id="10-limits-of-the-argument" class="anchor-alias" aria-hidden="true"></div>
<div id="10-scope-and-method" class="anchor-alias" aria-hidden="true"></div>

## 10. Portée et méthode

La physique entre comme structure. Elle fournit le vocabulaire des corps, des relations et des configurations stables, et chaque proposition est énoncée et testée selon les propres termes de l’informatique. Les affirmations concernant la sensibilité sont des affirmations sur la façon dont les résultats dépendent de désaccords non examinés, et elles sont mesurées statistiquement à grand N, à la manière de Stone et Leigh [7].

L’explicité est maintenue, non déclarée. Les hypothèses apparaissent lorsqu’un système rencontre de nouveaux environnements, et le monde qu’un programme sert continue de changer [35]. La méthode traite donc chaque hypothèse découverte comme une nouvelle interface à fermer : écrite comme un prédicat, dotée d’une vérification, et maintenue vérifiée sous la Proposition 3. La configuration stabilisée est maintenue de la même façon qu’un vaisseau spatial près d’un point de Lagrange, par un maintien continu de la station.

L’unité d’analyse est le transfert de rôle. Une personne peut être théoricien, créateur et utilisateur en un après‑midi, ainsi la méthode s’applique partout où un transfert se produit, au sein d’une même équipe ou entre organisations. Chaque approche de construction de systèmes, des méthodes formelles aux grands modèles avec tests en passant par le code écrit à la main avec révision, est évaluée selon la même mesure : la fraction de ses hypothèses d’interface qui sont explicites et vérifiées, lue dans le protocole d’inventaire de la Section 8.1.

<div id="11-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 11. Conclusion

Le problème à trois corps a enseigné à la physique que l’instabilité peut provenir des relations entre des parties simples, et que la stabilité, lorsqu’elle existe, constitue un agencement particulier de ces relations dans un cadre partagé. L’informatique possède ses propres trois corps : les théoriciens, les concepteurs et les utilisateurs, et son instabilité découle des interfaces entre eux, où les hypothèses se croisent de façon non écrite et non vérifiée. Un système qui vise l’intelligence générale doit agir sur les trois corps et à tous les niveaux de la pile, il ne peut donc pas laisser ces hypothèses implicites. Prendre cet objectif au sérieux signifie consigner chaque hypothèse d’interface et la vérifier à chaque point de croisement. Dans une pile construite de cette manière, une correction reste à l’endroit où elle est effectuée et se propage vers le haut, et le système conserve sa forme lorsqu’il évolue. C’est ainsi que la quête de l’AGI résout le problème à trois corps en informatique.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Références

[1] Liu Cixin, *The Three-Body Problem*, translated by Ken Liu. Tor Books, 2014. Original Chinese edition 三体, Chongqing Publishing House, 2008. ISBN 978-0-7653-7706-7.

[2] H. Poincaré, "Sur le problème des trois corps et les équations de la dynamique," *Acta Mathematica* 13, 1890, pp. 1 to 270. Introduction: doi:10.1007/BF02392506

[3] J. Barrow-Green, *Poincaré and the Three Body Problem*. History of Mathematics 11, American Mathematical Society, 1997. doi:10.1090/hmath/011

[4] K. F. Sundman, "Mémoire sur le problème des trois corps," *Acta Mathematica* 36, 1913, pp. 105 to 179. doi:10.1007/BF02422379

[5] Q. Wang, "The global solution of the N-body problem," *Celestial Mechanics and Dynamical Astronomy* 50, 1991, pp. 73 to 88. doi:10.1007/BF00048987

[6] E. N. Lorenz, "Deterministic Nonperiodic Flow," *Journal of the Atmospheric Sciences* 20(2), 1963, pp. 130 to 141. doi:10.1175/1520-0469(1963)020<0130:DNF>2.0.CO;2

[7] N. C. Stone and N. W. C. Leigh, "A statistical solution to the chaotic, non-hierarchical three-body problem," *Nature* 576, 2019, pp. 406 to 410. doi:10.1038/s41586-019-1833-8

[8] E. J. Routh, "On Laplace's Three Particles, with a Supplement on the Stability of Steady Motion," *Proceedings of the London Mathematical Society* s1-6, 1874, pp. 86 to 97. doi:10.1112/plms/s1-6.1.86

[9] C. Moore, "Braids in classical dynamics," *Physical Review Letters* 70, 1993, pp. 3675 to 3679. doi:10.1103/PhysRevLett.70.3675

[10] A. Chenciner and R. Montgomery, "A Remarkable Periodic Solution of the Three-Body Problem in the Case of Equal Masses," *Annals of Mathematics* 152(3), 2000, pp. 881 to 901. doi:10.2307/2661357

[11] M. Šuvakov and V. Dmitrašinović, "Three Classes of Newtonian Three-Body Planar Periodic Orbits," *Physical Review Letters* 110, 114301, 2013. doi:10.1103/PhysRevLett.110.114301

[12] Mars Climate Orbiter Mishap Investigation Board, *Phase I Report*. NASA, 10 November 1999. https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf

[13] H. Wright, "Hyrum's Law." https://www.hyrumslaw.com/

[14] J. Spolsky, "The Law of Leaky Abstractions," *Joel on Software*, 11 November 2002. https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/

[15] J. L. Lions (chair), *Ariane 5 Flight 501 Failure: Report by the Inquiry Board*. European Space Agency, 19 July 1996. https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf

[16] G. Le Lann, "An analysis of the Ariane 5 flight 501 failure: a system engineering perspective," *Proceedings of the IEEE International Conference on the Engineering of Computer-Based Systems*, 1997, pp. 339 to 346. doi:10.1109/ECBS.1997.581900

[17] RISC-V International, *The RISC-V Instruction Set Manual, Volume I: Unprivileged Architecture*, version 20250508, preface. https://docs.riscv.org/reference/isa/v20250508/unpriv/colophon.html

[18] Apple, "Using Intel-based apps on a Mac with Apple silicon," Apple Support, article 102527, published 21 September 2026. https://support.apple.com/en-us/102527

[19] P. Zave and M. Jackson, "Four Dark Corners of Requirements Engineering," *ACM Transactions on Software Engineering and Methodology* 6(1), 1997, pp. 1 to 30. doi:10.1145/237432.237434

[20] S. Hooker, "The Hardware Lottery," *Communications of the ACM* 64(12), 2021, pp. 58 to 65. doi:10.1145/3467017

[21] D. Sculley, G. Holt, D. Golovin, E. Davydov, T. Phillips, D. Ebner, V. Chaudhary, M. Young, J.-F. Crespo and D. Dennison, "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems* 28, 2015. https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

[22] M. E. Conway, "How Do Committees Invent?" *Datamation* 14(4), April 1968, pp. 28 to 31. https://www.melconway.com/Home/Committees_Paper.html

[23] A. MacCormack, C. Baldwin and J. Rusnak, "Exploring the duality between product and organizational architectures: A test of the 'mirroring' hypothesis," *Research Policy* 41(8), 2012, pp. 1309 to 1324. doi:10.1016/j.respol.2012.04.011

[24] D. L. Parnas, "On the criteria to be used in decomposing systems into modules," *Communications of the ACM* 15(12), 1972, pp. 1053 to 1058. doi:10.1145/361598.361623

[25] C. Y. Baldwin and K. B. Clark, *Design Rules, Volume 1: The Power of Modularity*. MIT Press, 2000. doi:10.7551/mitpress/2366.001.0001

[26] R. M. Henderson and K. B. Clark, "Architectural Innovation: The Reconfiguration of Existing Product Technologies and the Failure of Established Firms," *Administrative Science Quarterly* 35(1), 1990, pp. 9 to 30. doi:10.2307/2393549

[27] J. H. Saltzer, D. P. Reed and D. D. Clark, "End-to-end arguments in system design," *ACM Transactions on Computer Systems* 2(4), 1984, pp. 277 to 288. doi:10.1145/357401.357402

[28] C. A. R. Hoare, "An axiomatic basis for computer programming," *Communications of the ACM* 12(10), 1969, pp. 576 to 580. doi:10.1145/363235.363259

[29] B. Meyer, "Applying 'design by contract'," *Computer* 25(10), 1992, pp. 40 to 51. doi:10.1109/2.161279

[30] B. H. Liskov and J. M. Wing, "A behavioral notion of subtyping," *ACM Transactions on Programming Languages and Systems* 16(6), 1994, pp. 1811 to 1841. doi:10.1145/197320.197383

[31] D. Garlan, R. Allen and J. Ockerbloom, "Architectural mismatch: why reuse is so hard," *IEEE Software* 12(6), 1995, pp. 17 to 26. doi:10.1109/52.469757

[32] D. Garlan, R. Allen and J. Ockerbloom, "Architectural Mismatch: Why Reuse Is Still So Hard," *IEEE Software* 26(4), 2009, pp. 66 to 69. doi:10.1109/MS.2009.86

[33] N. G. Leveson, *Engineering a Safer World: Systems Thinking Applied to Safety*. MIT Press, 2012. doi:10.7551/mitpress/8179.001.0001

[34] R. I. Cook, "How Complex Systems Fail," Cognitive Technologies Laboratory, University of Chicago, 1998. https://how.complexsystems.fail/

[35] M. M. Lehman, "Programs, life cycles, and laws of software evolution," *Proceedings of the IEEE* 68(9), 1980, pp. 1060 to 1076. doi:10.1109/PROC.1980.11805

[36] G. Klein, K. Elphinstone, G. Heiser, J. Andronick, D. Cock, P. Derrin, D. Elkaduwe, K. Engelhardt, R. Kolanski, M. Norrish, T. Sewell, H. Tuch and S. Winwood, "seL4: Formal Verification of an OS Kernel," *Proceedings of the 22nd ACM Symposium on Operating Systems Principles*, 2009, pp. 207 to 220. doi:10.1145/1629575.1629596

[37] S. Legg and M. Hutter, "Universal Intelligence: A Definition of Machine Intelligence," *Minds and Machines* 17(4), 2007, pp. 391 to 444. doi:10.1007/s11023-007-9079-x

[38] M. R. Morris, J. Sohl-Dickstein, N. Fiedel, T. Warkentin, A. Dafoe, A. Faust, C. Farabet and S. Legg, "Levels of AGI for Operationalizing Progress on the Path to AGI," *Proceedings of the 41st International Conference on Machine Learning*, 2024. arXiv:2311.02462

[39] X. Leroy, "Formal verification of a realistic compiler," *Communications of the ACM* 52(7), 2009, pp. 107 to 115. doi:10.1145/1538788.1538814

[40] X. Yang, Y. Chen, E. Eide and J. Regehr, "Finding and understanding bugs in C compilers," *Proceedings of the 32nd ACM SIGPLAN Conference on Programming Language Design and Implementation*, 2011, pp. 283 to 294. doi:10.1145/1993498.1993532

[41] C. Newcombe, T. Rath, F. Zhang, B. Munteanu, M. Brooker and M. Deardeuff, "How Amazon Web Services uses formal methods," *Communications of the ACM* 58(4), 2015, pp. 66 to 73. doi:10.1145/2699417

[42] A. Kennedy, "Types for Units-of-Measure: Theory and Practice," in *Central European Functional Programming School*, Lecture Notes in Computer Science 6299, Springer, 2010, pp. 268 to 305. doi:10.1007/978-3-642-17685-2_8
