---
title: "Le marché promis à mille milliards de dollars de la programmation par IA"
deck: "Qui projette le marché de la programmation par IA, ce qu'il projette, et ce que suppose chaque projection : une seule voie vers l'automatisation informatique autonome, avec une forte énergie, un fort calcul, une rente par jeton et le modèle dans la boucle pour toujours. Le Reality Code Engine (RCE) mesure une seconde voie : un écosystème de code natif dans lequel un programme est écrit une seule fois, à partir de l'intention, comme une Forme sans perte, et chaque langage cible en est une projection fidèle. Sur 10 000 Formes préenregistrées avec 0 appel de modèle, chaque Forme fait l'aller-retour à des octets identiques et chaque entrée mal formée est refusée dès l'entrée. Chaque ajustement qui franchit la porte est réutilisé, si bien que le coût marginal d'une tâche couverte tombe vers l'énergie nécessaire pour l'exécuter, et les projections perdent leur base."
lang: "fr"
source: "ai-coding-market"
complete: true
---

<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*Version 1.1, 11 octobre 2026. Données et code : [research.openie.dev/data/](/data/#economics). PDF LaTeX : [/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf) ([source](/pdfs/latex/ai-coding-market.tex)).*

*Compagnon économique de l'article [Le Reality Code Engine : une Forme sans perte pour une programmation native, vérifiée et sobre en énergie](/papers/rce/). L'article de recherche contient l'ingénierie, la théorie et les mesures. Cet essai est le lieu où la théorie et l'économie se rencontrent.*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

Le marché du codage par IA à mille milliards de dollars est l'affirmation hyperbolique et informée de David Charlot, et les projections réelles en confirment l'échelle. Une estimation de capital-risque évalue la valeur des développeurs de logiciels du monde à environ 3 000 milliards de dollars par an et qualifie le codage par IA de marché capable de soutenir « même un géant à mille milliards de dollars » [1]. Deux entreprises de codage par IA ont déclaré plus de 1 milliard et plus de 2,5 milliards de dollars de revenus annualisés à un an d'intervalle [5, 6]. Un laboratoire de pointe est valorisé à 380 milliards de dollars, et son produit de codage est sa vitrine [6]. Le volume de tokens d'un fournisseur est passé de 9 700 milliards à plus de 3,2 millions de milliards de tokens par mois en deux ans [8]. Les dépenses d'investissement des plus grandes entreprises technologiques ont dépassé 400 milliards de dollars en 2025 [10].

Toutes ces projections supposent la même chose. Il n'existe qu'une seule voie vers l'automatisation informatique autonome. Elle est à haute énergie, à fort calcul, à haute entropie et désordre. Un modèle est dans la boucle de chaque tâche, et chaque tâche paie une rente par token.

L'[article de recherche sur RCE](/papers/rce/) mesure une seconde voie. RCE est un écosystème de code natif. Un programme est écrit une seule fois, à partir de l'intention, comme une Forme, un encodage sans perte de l'état, des événements et des transitions pures, et chaque langage cible en est une projection fidèle. Un état que la Forme ne déclare pas ne peut pas être écrit, si bien qu'un programme erroné est refusé dès l'entrée au lieu d'être trouvé et corrigé plus tard. Chaque ajustement qui franchit la porte est stocké et réutilisé, si bien que l'écosystème se renforce de façon cumulative. Sur 10 000 Formes préenregistrées, moteur gelé et 0 appel de modèle, chaque Forme fait l'aller-retour à des octets identiques, chaque projection est déterministe, chaque entrée mal formée est refusée dès l'entrée, et la projection Python rejoue la trace de référence sur 9 999 d'entre elles ([RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n)). Le code d'autres langages entre par élévation, et sur le code élevé les engrenages de réparation rétablissent 520 541 des 520 821 fautes d'un token et 63,7 % de 21 320 bogues Java d'une seule instruction, avec 0 appel de modèle ([RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)). Là où cette voie couvre une tâche, le coût marginal de la tâche tombe vers l'énergie nécessaire pour l'exécuter, et un marché dont les prix reposent sur la génération perd sa base sur cette tâche. Cet essai sépare les projections des mesures, nomme ce que suppose chaque projection et indique où elle se rompt.

**Thèse commune, énoncée une fois pour tous les articles.** L'énergie d'exécution est la seule vraie métrique de l'intelligence computationnelle. Tous les autres facteurs se réduisent à zéro. La forme de porte définit ce que cela signifie. Parmi les exécutions qui satisfont le prédicat de complétude de la tâche $C(z)$ dans le budget et le délai annoncés, les systèmes sont classés par joules jusqu'à l'achèvement, $J^*$. La correction, les délais et la taille de la tâche constituent la porte, et non des termes du score. Les paramètres, les tokens, les scores de benchmark et les prix ont un poids nul dans le classement ([Agentivité, Section 1](/papers/agency/#1-thesis)). Les estimations ne sont jamais `measured_j`.

**Le prix, une affirmation distincte, pour les compagnons économiques.** Une tendance de prix est une affirmation distincte, étiquetée comme telle. Epoch AI indique que le coût d'un niveau donné de performance de l'IA a baissé d'environ 47 pour cent par trimestre depuis 2023, soit environ 13 fois par an (Emberson et Roodman, *The plunging price of thought*, 22 septembre 2026). Si cette tendance se poursuit, l'énergie devient le coût marginal dominant de l'inférence. C'est une tendance citée assortie d'une condition, non un effondrement mesuré. [La correction orthographique est mondiale](/papers/spellcheck/) est une preuve d'existence qu'une certaine intelligence computationnelle se banalise jusqu'à un prix nul intégré à une offre groupée. La théorie qu'utilisent ces compagnons se trouve dans [l'article sur l'agentivité](/papers/agency/), [Portes de validation mesurées](/papers/gates/) et [Reality Code Engine](/papers/rce/).

<div id="1-projections-and-measurements-are-different-objects" class="anchor-alias" aria-hidden="true"></div>

## 1. Les projections et les mesures sont des objets différents

Chaque nombre ci-dessous porte l'une de cinq étiquettes.

| Étiquette | Signification |
|---|---|
| **Projection** | Une prévision ou une estimation de valeur fondée sur des hypothèses énoncées |
| **Déclaré par l'entreprise** | Un chiffre qu'une entreprise déclare sur elle-même, comme un revenu annualisé (le dernier mois multiplié par douze) ou une valorisation de levée de fonds |
| **Estimation d'enquête** | Un chiffre de taille de marché issu d'une enquête auprès d'acheteurs |
| **Déposé** | Un chiffre figurant dans un document réglementaire |
| **Mesuré** | Un comptage ou une lecture d'énergie provenant d'une exécution dont les artefacts sont conservés. Dans RCE, l'énergie porte sa propre étiquette : `est_j`, `reported_j` ou `measured_j` |

Seule la dernière ligne constitue une preuve sur le coût d'un résultat correct. Les autres sont des preuves de ce qu'attend le marché.

<div id="2-who-projects-what" class="anchor-alias" aria-hidden="true"></div>

## 2. Qui projette quoi

<div id="21-developer-value-the-trillion" class="anchor-alias" aria-hidden="true"></div>

### 2.1 La valeur des développeurs : les mille milliards

| Affirmation | Nombre | Étiquette | Source |
|---|---|---|---|
| Développeurs de logiciels dans le monde | environ 30 millions (de 27 à 47 millions selon les estimations) | Donnée d'entrée de projection | Appenzeller et Li [1] |
| Valeur par développeur et par an | 100 000 dollars (hypothèse) | Donnée d'entrée de projection | [1] |
| Contribution économique annuelle | environ 3 000 milliards de dollars | Projection | [1] |
| Développeurs sur GitHub | plus de 180 millions ; 518,7 millions de pull requests fusionnées dans l'année | Déclaré par l'entreprise | GitHub Octoverse 2025 [17] |
| Valeur de l'IA générative sur 63 cas d'usage | de 2 600 à 4 400 milliards de dollars par an ; productivité de l'ingénierie logicielle de 20 % à 45 % des dépenses annuelles actuelles de la fonction | Projection | McKinsey [15] |
| Effet de l'IA générative sur le PIB mondial | 7 % sur une période de dix ans | Projection | Goldman Sachs [16] |
| Gain de productivité d'un assistant simple | environ 20 % | Estimation tirée d'entretiens | [1] |
| Gain de productivité d'un déploiement de premier ordre | « au moins le double » | Estimation « fondée sur des preuves anecdotiques » | [1] |

Le nombre de développeurs est fragile : 30 millions est une estimation de professionnels, et GitHub seul compte six fois plus de comptes qui développent sur sa plateforme [17]. La valeur par développeur et le multiple de productivité sont fragiles eux aussi (section 2.7). L'estimation de McKinsey de 2023 est le millier de milliards d'origine de ce marché, et c'est une estimation de valeur portant sur toutes les fonctions [15]. Le même essai de capital-risque affirme que l'écosystème du codage par IA peut « soutenir des dizaines d'entreprises à un milliard de dollars et même un géant à mille milliards de dollars » [1]. Cette phrase, ce sont les mille milliards. C'est une estimation de valeur. Ce n'est pas une prévision de revenus.

<div id="22-tool-revenue-and-enterprise-spend" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Revenus des outils et dépenses des entreprises

| Affirmation | Nombre | Étiquette | Source |
|---|---|---|---|
| Dépenses des entreprises en outils de codage par IA, 2025 | 4,0 milliards de dollars, 55 % des dépenses d'IA des départements | Estimation d'enquête | Menlo Ventures [2] |
| Dépenses des entreprises en IA générative, 2025 | 37 milliards de dollars | Estimation d'enquête | [2] |
| Marché des outils de code par IA, 2026 | 9,35 milliards de dollars, jusqu'à 29,96 milliards en 2031 | Projection | Mordor Intelligence [3] |

Les revenus que le marché déclare aujourd'hui se comptent en milliards. Les mille milliards sont la valeur que le marché espère capter.

<div id="23-company-revenue-and-valuations" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Revenus et valorisations des entreprises

| Affirmation de l'entreprise | Nombre | Date | Étiquette | Source |
|---|---|---|---|---|
| Revenu annualisé de Cursor | plus de 1 milliard de dollars | 13 novembre 2025 | Déclaré par l'entreprise | Cursor [5] |
| Nouvelle tarification de Cursor Pro | des limites de requêtes à « 20 dollars d'usage de modèles de pointe par mois au tarif de l'API », avec remboursements pour le changement | juin à juillet 2025 | Déclaré par l'entreprise | Cursor [18] |
| Série D de Cursor | 2,3 milliards de dollars pour une valorisation post-money de 29,3 milliards | 13 novembre 2025 | Déclaré par l'entreprise | [5] |
| Revenu annualisé d'Anthropic | 14 milliards de dollars | 12 février 2026 | Déclaré par l'entreprise | Anthropic [6] |
| Revenu annualisé de Claude Code | plus de 2,5 milliards de dollars | 12 février 2026 | Déclaré par l'entreprise | [6] |
| Série G d'Anthropic | 30 milliards de dollars pour une valorisation post-money de 380 milliards | 12 février 2026 | Déclaré par l'entreprise | [6] |

Anthropic indique que le tour finance des « extensions d'infrastructure » [6]. Revenus, valorisation et calcul forment un seul pari.

<div id="24-inference-tokens-and-unit-economics" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Inférence, tokens et économie unitaire

| Affirmation | Nombre | Étiquette | Source |
|---|---|---|---|
| Tokens traités par Google par mois | 9 700 milliards (2024), environ 480 000 milliards (2025), plus de 3,2 millions de milliards (mai 2026) | Déclaré par l'entreprise | Pichai [8] |
| Outils internes d'IA pour développeurs de Google | 500 milliards de tokens par jour en mars 2026, plus de 3 000 milliards par jour en mai | Déclaré par l'entreprise | [8] |
| Coût d'une requête de codage agentique au prix catalogue | 2,50 dollars : un contexte de 100 000 tokens et 10 000 tokens de sortie à 15 et 75 dollars par million de tokens | Illustration | Appenzeller et Li [1] |
| Idem, à 3 requêtes par heure, 7 heures par jour, 200 jours | environ 10 000 dollars par an et par développeur | Illustration | [1] |
| Tokens du codage agentique par rapport au raisonnement sur le code et au chat de code | environ 1 000 fois plus ; les exécutions d'une même tâche diffèrent jusqu'à 30 fois ; une consommation de tokens plus élevée « ne se traduit pas par une meilleure exactitude » | Mesuré (huit modèles, SWE-bench Verified) | Bai, Huang et Wang [9] |
| Pertes nettes de l'investissement de Microsoft dans OpenAI, trimestre clos le 30 septembre 2025 | 4,1 milliards de dollars avant impôts, sa quote-part selon la mise en équivalence, en autres charges ; une baisse de 3,1 milliards du résultat net (0,41 dollar par action diluée) | Déposé et déclaré par l'entreprise | Microsoft Form 10-Q [7] ; Microsoft FY26 Q1 performance [19] |

Deux phrases des sources énoncent l'économie sans détour. Pichai : « de nombreuses entreprises épuisent déjà leurs budgets annuels de tokens, et nous ne sommes qu'en mai » [8]. Appenzeller et Li : « Pendant des décennies, le coût du développement logiciel était presque uniquement un coût humain, mais les LLM y ajoutent désormais une composante substantielle de dépenses d'exploitation » [1].

<div id="25-price-per-token" class="anchor-alias" aria-hidden="true"></div>

### 2.5 Prix par token

| Affirmation | Nombre | Étiquette | Source |
|---|---|---|---|
| Coût d'un niveau fixe de performance de l'IA | en baisse d'environ 47 % par trimestre, environ 13 fois par an, depuis 2023 | Série de prix mesurée (cinq benchmarks) | Epoch AI [4] |
| Prix pour atteindre un score fixe sur un benchmark | baisse de 9 à 900 fois par an selon le jalon ; les baisses les plus rapides sont les plus récentes et les moins sûres de durer | Série de prix mesurée (ajustements log-linéaires) | Epoch AI [34] |
| Coût d'inférence à performance équivalente | en baisse d'environ 10 fois par an : de 60 dollars par million de tokens en 2021 à 0,06 dollar | Estimation | Appenzeller, a16z [20] |
| Baisse de prix de l'API DeepSeek, 29 septembre 2025 | coût pour les développeurs « réduit de plus de 50 % » | Déclaré par l'entreprise | DeepSeek [21] |

Les 13 fois par an de [4] ne sont qu'un point dans une large fourchette [34]. La baisse est portée par la concurrence et les poids ouverts, comme le montre la baisse de DeepSeek [21]. Elle n'exige aucune comptabilité énergétique. C'est le premier déclin de la section 6. La seconde voie en ajoute un autre : les appels par tâche.

<div id="26-energy-and-capital" class="anchor-alias" aria-hidden="true"></div>

### 2.6 Énergie et capital

| Affirmation | Nombre | Étiquette | Source |
|---|---|---|---|
| Électricité des centres de données, 2024 | environ 415 TWh, environ 1,5 % de l'électricité mondiale | Estimation | IEA, *Energy and AI* [11] |
| Électricité des centres de données, 2030 | environ 945 TWh, scénario de base | Projection | [11] |
| Mise à jour : 2025 à 2030 | de 485 TWh à 950 TWh, environ 3 % de la demande mondiale | Estimation et projection | IEA, *Key Questions on Energy and AI* [10] |
| Dépenses d'investissement des plus grandes entreprises technologiques | plus de 400 milliards de dollars en 2025, avec une hausse attendue de 75 % supplémentaires en 2026 | Déclaré et projeté | [10] |
| Dépenses d'investissement d'Alphabet | 31 milliards de dollars en 2022 ; environ 180 à 190 milliards attendus en 2026 | Déclaré par l'entreprise et prévision | Pichai [8] |
| Énergie par tâche | en baisse d'au moins un ordre de grandeur par an ; les tâches de raisonnement et agentiques consomment « des centaines ou des milliers de fois plus d'énergie par requête que la simple génération de texte » | Estimation | [10] |
| Une invite textuelle médiane à un assistant en production | 0,24 Wh | Mesuré par l'opérateur | Elsworth et al. [12] |
| Stargate | 500 milliards de dollars sur quatre ans pour l'infrastructure d'IA d'un laboratoire, dont 100 milliards déployés immédiatement | Annoncé par l'entreprise | OpenAI [22] |
| Dépenses mondiales en IA, 2025 | environ 1 500 milliards de dollars | Projection | Gartner [24] |
| Revenus que les dépenses d'investissement doivent rapporter | « AI's $600B question » | Analyse | Sequoia Capital [23] |

La rente à servir est une rente matérielle. Des investissements et des engagements de cette taille se remboursent par un usage facturé au-dessus de son énergie. C'est la base que la seconde voie supprime sur les tâches couvertes.

<div id="27-productivity-evidence" class="anchor-alias" aria-hidden="true"></div>

### 2.7 Preuves de productivité

| Étude | n | Protocole | Effet | Source |
|---|---|---|---|---|
| Essai d'a16z | entretiens | Estimation | environ 20 % pour un assistant simple ; « au moins le double » pour le meilleur de sa catégorie | [1] |
| GitHub Copilot, tâche de serveur HTTP | développeurs recrutés | Expérience contrôlée | 55,8 % plus rapide sur une tâche jouet | Peng et al. [27] |
| Essai en entreprise chez Google | 96 ingénieurs | Essai contrôlé randomisé | environ 21 % de temps en moins sur la tâche | Paradis et al. [28] |
| METR, début 2025 | 16 développeurs open source expérimentés, 246 tâches | Essai contrôlé randomisé | 19 % plus lents avec l'IA | Becker et al. [25] |
| METR, mise à jour 2026 | nouvelle cohorte | Essai contrôlé randomisé | les auteurs qualifient les nouvelles données de « signal peu fiable » | METR [26] |

Les effets mesurés vont d'un ralentissement de 19 % à une accélération de 56 % sur une tâche jouet. Les deux facteurs de l'estimation de valeur, le nombre de développeurs et le multiple de productivité, sont fragiles. Cela affaiblit les mille milliards. Cela affaiblit aussi toute affirmation selon laquelle la valeur libérée par la seconde voie serait un nombre connu.

<div id="3-what-the-projections-assume" class="anchor-alias" aria-hidden="true"></div>

## 3. Ce que supposent les projections

Lues ensemble, les projections reposent sur quatre hypothèses. Chacune est un énoncé sur la voie, non sur la valeur du logiciel.

1. **Une seule voie : la génération.** Chaque changement est écrit par un modèle. L'estimation de valeur fait croître la productivité grâce au modèle, et l'illustration des coûts facture chaque requête [1].
2. **Haute énergie et fort calcul.** Le volume de tokens, l'électricité des centres de données et les dépenses d'investissement sont projetés en croissance conjointe [8, 10, 11]. L'énergie par requête baisse, et les tokens par tâche augmentent plus vite [9, 10].
3. **Rente par token.** Les revenus sont facturés au token ou au siège dont le coût est en tokens. Le coût annuel en tokens d'un développeur est projeté à l'échelle d'un salaire [1].
4. **L'IA dans la boucle pour toujours.** La tâche 10 000 coûte ce que coûte la tâche 1, car rien de ce que le modèle a appris sur la tâche 1 ne s'exécute sans le modèle sur la tâche 10 000.

L'essai qui énonce les mille milliards énonce aussi leur limite : « si la tarification par substitution fonctionne sur les marchés naissants, le coût d'un bien finit par converger vers son coût marginal, et la tarification aussi » [1]. Cet essai est d'accord, et demande quel est le coût marginal d'une tâche de codage correcte.

<div id="4-the-theory-that-prices-the-task" class="anchor-alias" aria-hidden="true"></div>

## 4. La théorie qui fixe le prix de la tâche

L'[article de recherche sur RCE](/papers/rce/) fournit trois résultats qui transforment la question en une quantité.

**La correction est la porte.** Une tâche est accomplie lorsque son prédicat de complétude $C(z)$ est vrai : ses tests passent, une preuve existe, ou une trace d'accord correspond ([RCE §1](/papers/rce/#1-thesis)). Un acheteur paie pour $C(z) = 1$, non pour des tokens.

**Les joules sont le classement.** Parmi les systèmes qui franchissent la porte, celui qui nécessite le moins de joules jusqu'à l'achèvement, $J^*$, l'emporte ([Agentivité §1](/papers/agency/#1-thesis)). Sur un marché concurrentiel, les vendeurs qui franchissent la même porte se font concurrence sur le coût, et le plancher de coût d'une tâche est l'énergie nécessaire pour l'achever plus le prix de la preuve.

**La Forme est écrite une fois et réutilisée.** Un programme de l'écosystème est écrit une seule fois, à partir de l'intention, comme une Forme, et chaque cible en est une projection, si bien que le coût d'un ajustement est payé une fois et que chaque usage ultérieur s'exécute au plancher du gestionnaire ([RCE §1](/papers/rce/#1-thesis)). **La plupart des ajustements existent déjà.** Un programme est un n-uplet $P = (S, E, \delta, D, \lambda)$, et d'après le théorème des machines à états abstraites de Gurevich, tout algorithme séquentiel a cette forme ([RCE §3](/papers/rce/#3-the-form)). Les programmes diffèrent par leur ajustement, et la plupart des ajustements existent déjà : « 70 % du code sur GitHub consiste en clones de fichiers créés auparavant » ([RCE §7](/papers/rce/#7-reuse-evidence)). Des ajustements équivalents franchissent la même porte, si bien que l'extraction choisit celui qui consomme le moins de joules (Proposition 3 de RCE).

**Proposition E0 (prix d'une tâche couverte).** On dit qu'une tâche est couverte lorsqu'un ajustement stocké franchit sa porte. Parmi les vendeurs qui franchissent la porte, la concurrence pousse le prix d'une tâche couverte vers $c_J \cdot J^*_{\text{floor}} + c_{\text{proof}}$, où $c_J$ est le prix d'un joule, $J^*_{\text{floor}}$ est l'énergie nécessaire pour récupérer, appliquer et vérifier l'ajustement, et $c_{\text{proof}}$ est le coût de la vérification. La génération n'intervient que sur les tâches non couvertes.

Mixture of Limits est la philosophie qui sous-tend la proposition : il existe une quantité minimale de toute chose pour accomplir une tâche, et tout surplus est du gaspillage ([Portes de validation mesurées, Partie II](/papers/gates/#part-ii-the-cascade-mixture-of-limits)). Une rente par token au-delà du plancher facture du gaspillage.

<div id="5-the-measurements" class="anchor-alias" aria-hidden="true"></div>

## 5. Les mesures

Ce sont des mesures, étiquetées comme RCE les étiquette. Elles proviennent de l'[article de recherche sur RCE](/papers/rce/). Les premières lignes mesurent l'écosystème lui-même ; les lignes suivantes mesurent la réparation de code élevé depuis d'autres langages ([RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)).

| Mesure | Résultat | Étiquette | Où |
|---|---|---|---|
| Écosystème de Formes, 10 000 Formes préenregistrées, aller-retour sans perte et projection déterministe | 10 000 sur 10 000, 0 appel de modèle | Comptages mesurés | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Écosystème de Formes, entrées et spécifications mal formées refusées dès l'entrée | 10 000 sur 10 000, 0 appel de modèle | Comptages mesurés | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Écosystème de Formes, la projection Python rejoue la trace de référence octet par octet | 9 999 sur 10 000, 0 appel de modèle | Comptages mesurés | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Code élevé, L0 fautes d'un token, 9 dépôts réels, partition de test réservée | 520 541 sur 520 821 (0,9995, IC à 95 % de 0,9994 à 0,9995), 0 appel de modèle | Comptages mesurés | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| Code élevé, L0, 4 dépôts jamais utilisés pour le réglage | 23 015 sur 23 015 (IC à 95 % de 0,9998 à 1,0000), 0 appel de modèle | Comptages mesurés | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| Code élevé, L1 Java, ManySStuBs4J 2.0, réservé, fichier entier | 13 586 sur 21 320 (0,637, de 0,631 à 0,644), 0 appel de modèle ; 9 288 sur 24 072 (0,386) avec le fragment seul | Comptages mesurés | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| Code élevé, L1 Python, TSSB-3M v1.0.0, réservé | 27 266 sur 157 089 (0,174, de 0,172 à 0,175), 0 appel de modèle | Comptages mesurés | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| Énergie par tâche résolue, tous les échelons | de 0,10 J à 0,40 J | `est_j` (secondes CPU × 10 W) | [RCE §6.3](/papers/rce/#63-energy) |
| Énergie par tâche résolue, sous-échantillon RAPL | 0,056 J (L0, 3 000 tâches), 0,026 J (L1, 690 résolues sur 2 000) ; ±10 J sur les totaux d'exécution | `reported_j` (compteur du boîtier moins une ligne de base au repos déclarée) | [RCE §6.3](/papers/rce/#63-energy) |

`measured_j` est réservé à un wattmètre mural et il est vide dans chaque ligne.

<div id="6-where-the-projections-break" class="anchor-alias" aria-hidden="true"></div>

## 6. Où les projections se rompent

**La rente par token se rompt sur les tâches couvertes.** Un programme écrit comme une Forme se compile vers chaque cible avec 0 token : 10 000 des 10 000 Formes préenregistrées ont été compilées, projetées et ont franchi la porte sans aucun appel de modèle [RCE §2.3]. Sur le code élevé, chaque réparation couverte a elle aussi acheté 0 token : 520 541 réparations d'un token et 40 852 réparations d'une instruction issues d'historiques réels [RCE §6.1, §6.2]. Une ligne de revenus tarifée au token ne gagne rien sur une tâche qui n'a besoin d'aucun token.

**L'IA dans la boucle pour toujours se rompt à la promotion.** Le modèle est payé une fois pour un cas nouveau ; la porte admet l'ajustement comme gestionnaire, et les cas ultérieurs de même forme se ferment sans lui ([RCE §4.2](/papers/rce/#42-the-gears)). Là où cela tient, la tâche 10 000 ne coûte pas ce qu'a coûté la tâche 1. La question de savoir si les appels de modèle par tour atteignent zéro sur des spécifications réelles est mesurée à grand N par [RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n).

**Un résultat correct n'exige pas une haute énergie.** Une réparation réservée a franchi la porte avec 0,026 à 0,056 joule déclaré par tâche résolue sur un compteur du boîtier, sans modèle [RCE §6.3]. Une invite textuelle médiane à un assistant en production est mesurée à 0,24 Wh, soit 864 J [12]. Une tâche de codage agentique utilise de nombreuses invites, et l'IEA situe les requêtes agentiques à des centaines ou des milliers de fois l'énergie d'une requête simple [10]. Ce sont des tâches différentes sur des machines différentes, elles ne forment donc pas un rapport. Elles indiquent un ordre de grandeur à tester, selon le Protocole E1.

**La couverture se mesure par classe.** Les échelons donnent la couverture au sein de classes de tâches : presque toutes les fautes d'un token, et 63,7 % (Java, fichier entier ; 38,6 % avec le fragment seul) et 17,4 % (Python) des bogues d'une instruction, où les cas ouverts sont ceux dont les bits d'intention se trouvent hors du fragment ou sont nouveaux ([RCE §6.0](/papers/rce/#60-the-repair-ladder-on-lifted-code)). La part de tout le volume réel de codage qui tombe dans des classes couvertes est la Proposition E5.

**Deux déclins se multiplient.** Le prix par appel baisse de 9 à 900 fois par an à performance fixe, selon la tâche [4, 34]. La promotion ramène à zéro les appels par tâche sur les cas couverts [RCE §8.6]. Le coût par tâche est le produit des deux. Une projection qui extrapole le volume de tokens ne tarifie que le premier.

**Le schéma du correcteur orthographique.** [La correction orthographique est mondiale](/papers/spellcheck/) documente une capacité dont le coût marginal est tombé à presque zéro et qui complétait un outil que tout le monde possédait déjà. Elle a été intégrée à l'éditeur et son prix séparé a disparu, comme le prédit l'économie des offres groupées [13, 14]. Une tâche de codage couverte a les deux mêmes propriétés : son coût marginal tombe au plancher du gestionnaire, et elle complète les éditeurs et dépôts que les gens possèdent déjà. La prédiction est la même : la tâche couverte est intégrée à une offre groupée, et ce qui reste tarifé, c'est le cas non couvert et la preuve.

**L'offre groupée du propriétaire de la plateforme.** Le schéma du correcteur orthographique a un propriétaire. L'offre groupée est faite par celui qui possède l'éditeur, le dépôt ou le cloud. Spolsky a nommé la tactique : banaliser son complément [31]. Nalebuff a montré qu'une offre groupée peut barrer l'entrée [32], et Adams et Yellen qu'elle discrimine par les prix [33]. Cela se produit : GitHub a fait passer les forfaits individuels de Copilot à une facturation à l'usage à partir du 1er juin 2026 [30], et Cursor a fait passer Pro des limites de requêtes à une tarification API répercutée en 2025 [18]. Une plateforme peut offrir la couche du modèle et garder la rente dans l'IDE et le cloud. Un moteur tarifé à l'énergie ne concurrence une offre groupée à prix nul que là où la porte lui est ouverte : là où les tests, la preuve et le reçu appartiennent à l'acheteur, et non à la plateforme.

**Une Forme à la place de nombreux langages.** L'article sur RCE énonce la thèse selon laquelle une Forme universelle, avec chaque langage comme projection et chaque programme comme élévation, remplace le besoin de tout autre langage ([RCE §3.6](/papers/rce/#36-one-ecosystem-lossless-and-the-universality-thesis)). La lecture de marché est la suivante. Une grande part des dépenses que comptent les projections est de la traduction entre langages, frameworks et leurs versions, et de la réconciliation d'implémentations qui divergent. Dans un écosystème où un programme est écrit une fois et où chaque cible est émise, cette dépense n'a aucune tâche à acheter. L'adoption est la grandeur ouverte, et c'est une question de marché, pas un théorème.

**Ce qui subsiste.** L'estimation de valeur de la section 2.1 peut tenir. Les développeurs peuvent produire davantage. Ce qui se rompt, c'est l'affirmation selon laquelle la valeur est captée sous forme de rente sur la génération. La conclusion est conditionnelle. Là où la couverture est élevée et où la plateforme ne groupe pas, la valeur créée à un coût marginal décroissant revient à celui qui détient la porte, la preuve et le plancher de basse entropie, et une grande part revient à l'acheteur. Là où la plateforme groupe, les preuves indiquent que le détenteur de la porte est la plateforme.

<div id="7-demand" class="anchor-alias" aria-hidden="true"></div>

## 7. Demande

Des tâches moins chères peuvent accroître la demande totale. L'essai de capital-risque s'y attend : « nous pensons que le paradoxe de Jevons tient dans ce cas » [1]. [Satiété de la tâche contre effet rebond agrégé dans la demande d'IA](/papers/satiation/) sépare les deux effets. L'appétit par tâche s'arrête au prédicat de complétude. L'usage agrégé peut encore croître, car une synthèse moins chère ouvre de nouvelles tâches. La seconde voie modifie le premier effet et laisse le second ouvert. Un marché plus grand de tâches couvertes est un marché dont le coût marginal est le plancher, non la frontière. La seule élasticité publiée est faible. Entre les tâches de l'échantillon de l'API d'Anthropic, chaque hausse de 1 % du coût est associée à une baisse de 0,29 % de la fréquence d'utilisation [29]. C'est une relation transversale entre tâches, non un changement de prix dans le temps. Prise telle quelle, la demande est inélastique : les baisses de prix réduisent les revenus sur un ensemble fixe de tâches, ce qui appuie la lecture de la rente faite par cet essai, et elles ne font pas à elles seules que le codage soit beaucoup plus utilisé.

<div id="8-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 8. Propositions et protocoles

**Proposition E1 (les courbes de coût se croisent).** Pour un flux de tâches dans un dépôt, le coût cumulé par tâche résolue de la seconde voie passe sous celui d'un agent de génération après un nombre fini de tâches. *Protocole :* exécuter le [Protocole 8.3 de RCE](/papers/rce/#83-a-wall-meter) et un agent de génération simple sur le même flux de tickets sous un wattmètre mural. Rapporter `measured_j` et les dollars par tâche résolue selon l'indice de la tâche, ainsi que l'indice de croisement.

**Proposition E2 (le prix suit le plancher).** Là où une capacité de codage est couverte par la récupération et les règles, son prix de marché baisse vers l'énergie nécessaire pour l'exécuter plus le coût de la preuve. *Protocole :* suivre dans le temps les prix catalogue d'une classe de capacités couverte face à son énergie d'exécution mesurée, à la manière de la série de prix du correcteur orthographique.

**Proposition E3 (l'échelle de calcul n'est pas un rempart sur les tâches couvertes).** Sur les tâches que couvre la seconde voie, le taux de résolution n'augmente pas avec le calcul du dernier engrenage. *Protocole :* exécuter le [Protocole 8.2 de RCE](/papers/rce/#82-swe-bench-lite-offline) sans modèle, avec un petit modèle local et avec un modèle de pointe comme dernier engrenage. Comparer les taux de résolution sur les tâches fermées avant le dernier engrenage.

**Proposition E4 (la part des tokens dans les revenus).** Dans un dépôt où la couverture croît, la part du coût des tâches payée en tokens baisse avec la couverture. *Protocole :* consigner les tokens, joules et dollars par tâche fermée et par tour dans le protocole de convergence de RCE avec un résolveur à modèle tarifé ([RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n)), étiquetés, et rapporter la part des tokens dans le coût par tour.

**Proposition E5 (couverture).** La part du volume réel de tâches de codage qui tombe dans des classes couvertes par la seconde voie est mesurable. *Protocole :* tirer un échantillon aléatoire de pull requests fusionnées dans des dépôts publics (GitHub en rapporte 518,7 millions fusionnées en un an [17]), classer chacune selon que les engrenages gelés G0 à G2 produisent ou non un correctif qui franchit la porte, et rapporter la fraction couverte avec un intervalle à 95 %. Tant que ce nombre n'existe pas, la Proposition E0 s'applique à une part non mesurée.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Références

[1] G. Appenzeller and Y. Li, "The Trillion Dollar AI Software Development Stack," 9 October 2025. https://a16z.com/the-trillion-dollar-ai-software-development-stack/

[2] Menlo Ventures, "2025: The State of Generative AI in the Enterprise," December 2025. https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/

[3] Mordor Intelligence, "AI Code Tools Market Size, Share and 2031 Growth Trends Report," fetched 11 October 2026. https://www.mordorintelligence.com/industry-reports/artificial-intelligence-code-tools-market

[4] B. Emberson and D. Roodman, "The plunging price of thought," Epoch AI, 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

[5] Cursor, "Past, Present, and Future" (Series D announcement), 13 November 2025. https://cursor.com/blog/series-d

[6] Anthropic, "Anthropic raises $30 billion in Series G funding at $380 billion post-money valuation," 12 February 2026. https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation

[7] Microsoft Corporation, Form 10-Q for the quarter ended 30 September 2025, Note 3 and Item 2. https://www.sec.gov/Archives/edgar/data/789019/000119312525256321/msft-20250930.htm

[8] S. Pichai, "I/O 2026: Welcome to the agentic Gemini era," 19 May 2026. https://blog.google/innovation-and-ai/sundar-pichai-io-2026/

[9] L. Bai, Z. Huang and X. Wang, "How Do AI Agents Spend Your Money? Analyzing and Predicting Token Consumption in Agentic Coding Tasks," 2026. arXiv:2604.22750. https://arxiv.org/abs/2604.22750

[10] International Energy Agency, *Key Questions on Energy and AI*, executive summary, 2026. https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary

[11] International Energy Agency, *Energy and AI*, executive summary, April 2025. https://www.iea.org/reports/energy-and-ai/executive-summary

[12] C. Elsworth et al., "Measuring the environmental impact of delivering AI at Google Scale," 2025. arXiv:2508.15734. https://arxiv.org/abs/2508.15734

[13] Y. Bakos and E. Brynjolfsson, "Bundling Information Goods: Pricing, Profits, and Efficiency," *Management Science* 45(12), 1999. doi:10.1287/mnsc.45.12.1613

[14] C. Shapiro and H. R. Varian, *Information Rules: A Strategic Guide to the Network Economy*, Harvard Business School Press, 1998.

[15] McKinsey & Company, "The economic potential of generative AI: The next productivity frontier," June 2023. https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier

[16] Goldman Sachs, "Generative AI could raise global GDP by 7%," April 2023. https://www.goldmansachs.com/intelligence/pages/generative-ai-could-raise-global-gdp-by-7-percent.html

[17] GitHub, "Octoverse: A new developer joins GitHub every second as AI leads TypeScript to #1," 2025. https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/

[18] Cursor, "Clarifying our pricing," June 2025 pricing post. https://cursor.com/blog/june-2025-pricing

[19] Microsoft Investor Relations, FY26 Q1 Performance. https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/performance

[20] G. Appenzeller, "Welcome to LLMflation: LLM inference cost is going down fast," a16z, November 2024. https://a16z.com/llmflation-llm-inference-cost/

[21] DeepSeek, DeepSeek-V3.2-Exp release and API price reduction, 29 September 2025 (in Chinese). https://api-docs.deepseek.com/zh-cn/news/news250929

[22] OpenAI, "Announcing The Stargate Project," 21 January 2025. https://openai.com/index/announcing-the-stargate-project/

[23] D. Cahn, "AI's $600B Question," Sequoia Capital, 2024. https://www.sequoiacap.com/article/ais-600b-question/

[24] Gartner, "Gartner Says Worldwide AI Spending Will Total $1.5 Trillion in 2025," 17 September 2025. https://www.gartner.com/en/newsroom/press-releases/2025-09-17-gartner-says-worldwide-ai-spending-will-total-1-point-5-trillion-in-2025

[25] J. Becker, N. Rush, E. Barnes and D. Rein, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity," METR, 2025. arXiv:2507.09089. https://arxiv.org/abs/2507.09089

[26] METR, uplift study update, 24 February 2026. https://metr.org/blog/2026-02-24-uplift-update/

[27] S. Peng, E. Kalliamvakou, P. Cihon and M. Demirer, "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot," 2023. arXiv:2302.06590. https://arxiv.org/abs/2302.06590

[28] E. Paradis, K. Grey, Q. Madison et al., "How much does AI impact development speed? An enterprise-based randomized controlled trial," 2024. arXiv:2410.12944. https://arxiv.org/abs/2410.12944

[29] Anthropic, "Anthropic Economic Index report: Uneven geographic and enterprise AI adoption," September 2025. https://www.anthropic.com/research/anthropic-economic-index-september-2025-report

[30] GitHub Japan blog, "GitHub Copilotの個人向けプラン: ProとPro+へのフレックス枠追加と新しいMaxプランのご紹介," 15 May 2026 (in Japanese). https://github.blog/jp/2026-05-15-github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/

[31] J. Spolsky, "Strategy Letter V," Joel on Software, 12 June 2002. https://www.joelonsoftware.com/2002/06/12/strategy-letter-v/

[32] B. Nalebuff, "Bundling as an Entry Barrier," *Quarterly Journal of Economics* 119(1), 2004. doi:10.1162/003355304772839551

[33] W. J. Adams and J. L. Yellen, "Commodity Bundling and the Burden of Monopoly," *Quarterly Journal of Economics* 90(3), 1976. doi:10.2307/1886045

[34] Epoch AI, "LLM inference prices have fallen rapidly but unequally across tasks," data insight. https://epoch.ai/data-insights/llm-inference-price-trends
