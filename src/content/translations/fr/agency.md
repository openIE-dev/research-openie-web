---
title: "Bornes thermodynamiques et tempo optimal pour des agents qui tiennent un but"
deck: "L'agentivité d'abord, la cinématique ensuite. La Loi universelle de l'agentivité proposée est une définition plus une porte, exigée avant que quoi que ce soit compte comme agent. Les bornes cinématiques disent à quelle vitesse l'agentivité avance par seconde et par joule. L'intelligence est le calcul de l'agentivité : une dérivée lue a posteriori sur une exécution terminée, ι = dX/dJ. L'énergie d'exécution est la seule vraie mesure de l'intelligence informatique. Les estimations ne sont jamais des measured_j."
lang: "fr"
source: "agency"
complete: true
---

<div id="the-universal-law-of-agency" class="anchor-alias" aria-hidden="true"></div>

*Version 1.1, 11 octobre 2026. Données et code : [research.openie.dev/data/](/data/#agency). PDF LaTeX : [/pdfs/latex/agency.pdf](/pdfs/latex/agency.pdf) ([source](/pdfs/latex/agency.tex)).*

*La Loi universelle de l'agentivité proposée, énoncée comme une définition plus une porte.*

*D'abord l'agentivité. Ensuite la cinématique. L'intelligence est le calcul de l'agentivité, lu en joules.*

<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. Thèse

La proposition comporte trois couches, et l'ordre est fixe.

1. **L'agentivité vient en premier, et sa définition est obligatoire.** Ce programme de recherche la propose comme la Loi universelle de l'agentivité. Dans sa forme, c'est une définition plus une porte : quatre clauses disent ce qui compte comme agent, et la quatrième clause refuse tout acte qui dépasse le budget en joules. Rien n'est un agent tant que la définition n'est pas satisfaite. Rien de ce qui suit n'est défini sans elle.
2. **Les bornes cinématiques de l'agentivité découlent de la définition.** Elles disent à quelle vitesse l'agentivité peut se déplacer, par seconde et par joule, et ce qu'elle doit payer pour se déplacer.
3. **L'intelligence est le calcul de l'agentivité.** L'intelligence est une caractéristique lue après coup. Elle se lit sur une exécution achevée, comme la vitesse se lit sur une trajectoire enregistrée. C'est donc une dérivée de l'agentivité : $\iota = dX/dJ$, où $X$ est l'agentivité confirmée et $J$ les joules.

La thèse : l'énergie d'exécution est la seule véritable métrique de l'intelligence informatique. Tous les autres facteurs se réduisent à zéro.

La thèse se lit à travers sa porte. La capacité n'est pas écartée : elle est la porte. Burnell et ses collègues demandent que l'évaluation rende compte des résultats par instance plutôt que par un agrégat unique [333], et Zhou et ses collègues ainsi que Laber et ses collègues constatent que la capacité et l'efficacité varient indépendamment selon les modèles et les budgets d'inférence [334, 335]. Ces constats portent sur des systèmes qui ne satisfont pas tous le même prédicat. Une fois fixés un prédicat $C(z)$ et un taux d'échec, tout facteur autre que les joules a déjà été dépensé pour franchir la porte, et c'est le sens de la seconde phrase de la thèse. Le classement avec porte est aussi une pratique établie : SPECpower classe le travail des serveurs par watt à une charge déclarée [338], le coût par réussite classe les modèles selon le coût d'une réponse correcte [336], et l'intelligence par watt classe les modèles locaux selon la précision par unité de puissance [337]. La contribution de cet article est la forme en joules de ce classement, avec une clause de refus et une dérivée lue après coup, et non l'idée de classer par le coût sous contrainte de correction.

La porte et le classement séparent deux choses souvent confondues : la capacité et l'intelligence. La capacité, c'est satisfaire $C(z)$ tout court. L'intelligence, c'est le peu de joules que demande cette réussite. Krakauer, Mitchell et Krakauer tracent la même ligne depuis la science de la complexité : on ne confond pas des capacités impressionnantes avec l'intelligence, réservée à la résolution de problèmes « rapidement et avec parcimonie, avec une dépense minimale d'énergie » [339]. Deux systèmes qui remettent la même réponse correcte, l'un directement et l'autre après un long détour, sont également capables. Seul le premier est le plus intelligent, et $J^*$ est la grandeur qui les distingue. On peut rendre un système plus capable en dépensant davantage. On ne le rend plus intelligent qu'en dépensant moins pour la même réussite.

La thèse a une forme exacte. La correction est une porte. Les joules sont le classement. Pour une tâche $q$ de prédicat de complétude $C(z)$, les joules jusqu'à l'achèvement correct du système $S$ sont

$$
J^*_S(q) = \min_{\pi} \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta
$$

Le minimum porte sur les politiques $\pi$ que $S$ peut exécuter, et $\delta$ est le taux d'échec que la tâche autorise. Une échéance, lorsque la tâche en a une, est inscrite dans $C(z)$ : une réponse donnée après son échéance ne satisfait pas le prédicat. Ainsi la correction, les échéances et la taille de la tâche apparaissent dans les formules de ce programme, et chacune y apparaît comme une contrainte. Aucune n'y apparaît comme un score. Parmi les systèmes qui franchissent la porte, seuls les joules les ordonnent. Les paramètres, les tokens, les scores aux bancs d'essai et les prix ont un poids nul dans cet ordre. Voilà ce que signifie « se réduisent à zéro ». La correction devient la contrainte, et l'énergie devient la seule métrique. C'est la thèse. L'énergie jusqu'à la solution en calcul haute performance et les mesures de MLPerf Power soumises à une porte de précision ont la même forme [260]. Ce programme place une définition d'éligibilité devant la porte et lit les joules comme une densité mesurée. La Section 2.3 énonce le classement. La Proposition 8 démontre qu'il s'agit d'un ordre total sur les systèmes qui résiste à une erreur bornée du compteur, et que la $\iota$ intégrée ne l'est pas.

L'ordre compte. Une dérivée a besoin d'une trajectoire. Une trajectoire a besoin de quelque chose qui se déplace. La définition dit ce qui se déplace. La cinématique dit comment cela peut se déplacer. L'intelligence se lit ensuite sur la trajectoire.

Ce programme confronte cet ordre à la littérature. Il range chaque source dans l'une de trois catégories.

- **Prouvé :** théorèmes et dérivations. Le résultat découle d'hypothèses énoncées.
- **Constaté :** expériences, mesures et simulations. Le résultat a été observé.
- **Opinion :** articles de position, cadres, définitions et philosophie. Le résultat est argumenté.

Aucune source n'est exclue en raison de sa méthode. Chaque source est placée selon ce qu'elle apporte à la définition, à la cinématique ou au calcul.

<div id="terms" class="anchor-alias" aria-hidden="true"></div>

### Termes

- **SI :** le Système international d'unités.
- **Joule (J) :** l'unité SI d'énergie. Un watt pendant une seconde.
- **$k_B$ :** la constante de Boltzmann, $1.380649 \times 10^{-23}$ J/K, exacte par définition du SI.
- **Production d'entropie ($\Sigma$) :** l'entropie totale que crée un processus, en unités de $k_B$. Elle n'est nulle que pour un processus réversible.
- **Information mutuelle ($I$) :** le nombre de bits qu'une variable porte sur une autre.
- **Activité dynamique ($A$) :** le taux de sauts entre états dans un processus stochastique. Elle mesure à quel point la dynamique est active.
- **TUR (relation d'incertitude thermodynamique) :** un théorème qui relie la précision d'un courant à sa production d'entropie.
- **RMN (résonance magnétique nucléaire) :** une méthode qui contrôle et lit des spins moléculaires.
- **Taux d'instabilité ($\Lambda$) :** la vitesse à laquelle un monde non contrôlé s'écarte du but, en nats par seconde. Pour une procédé linéaire exécutée à $f$ pas par seconde, $\Lambda = f\sum_{|\lambda_i|>1}\ln|\lambda_i|$.
- **Erreur de réinitialisation ($\varepsilon$) :** la probabilité qu'un registre réinitialisé ne soit pas dans son état le plus probable.
- **Observable de comptage :** une grandeur d'une trajectoire qui compte des sauts sélectionnés. Elle ne décroît jamais.
- **Dérivée de Radon-Nikodym :** la densité d'une mesure par rapport à une autre. Elle existe lorsque la première mesure attribue une masse nulle à tout ensemble auquel la seconde attribue une masse nulle.
- **Mixture of Limits (mélange de limites) :** la philosophie d'OpenIE. Utiliser l'engrenage le moins coûteux qui suffit. Il existe des planchers au-delà desquels des tokens, des paramètres ou des joules supplémentaires n'achètent aucun progrès vérifiable. La dépense au-delà du plancher est du gaspillage. Ce plancher est le plateau (convergence de seuil). Mixture of Limits n'est pas une cascade fixe unique. Un ordre de cascade fixe en est une instance. Le sélecteur de loi σ en est une autre.
- **Notational Intelligence :** l'étude des reçus d'OpenIE. Chaque acte porte sa prédiction, son résultat et ses joules.

<div id="2-formal-framework" class="anchor-alias" aria-hidden="true"></div>

## 2. Cadre formel

Les définitions fixent les termes. Les propositions sont démontrées à partir de théorèmes cités, avec leurs hypothèses énoncées.

La Figure 1 montre comment les trois couches s'empilent.

![Diagramme de trois couches empilées. En bas, couche 1 : la définition et la porte, l'éligibilité, avec quatre clauses : la prédiction d'abord, le couplage au monde, la conséquence assumée et le budget en joules. Au milieu, couche 2 : la cinématique, la vitesse à laquelle l'agentivité se déplace par seconde et par joule, bornée par le plancher de Landauer, les limites de vitesse, la relation d'incertitude thermodynamique et le théorème du débit de données. En haut, couche 3 : le calcul, l'intelligence iota égale dX sur dJ, lue après coup.](/figures/agency/three-layers.svg)

*Figure 1. L'agentivité en trois couches. Diagramme des Sections 2.1 à 2.3 : la définition et la porte, les bornes cinématiques et l'intelligence comme calcul de l'agentivité. Une [copie PNG](/figures/agency/three-layers.png) est fournie.*

<div id="21-layer-1-the-law-eligibility" class="anchor-alias" aria-hidden="true"></div>

<div id="21-layer-1-the-definition-and-its-gate-eligibility" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Couche 1. La définition et sa porte : l'éligibilité

Pour un système $S$, un acte $a$ et un budget d'épisode $B$ en joules, l'éligibilité $E(S,a) \in \{0,1\}$ vaut 1 seulement lorsque les quatre clauses sont satisfaites.

1. **La prédiction d'abord.** Un gabarit de résultat $R^*(a)$ est fixé à l'instant $t_0$, avant l'acte, et il discrimine : $D(R^*(a)) \ge d_0$. Ici $D$ est la probabilité que le gabarit rejette un résultat obtenu sans l'acte, et $d_0 > 0$ est fixé avec le gabarit. Un gabarit qui accepte tout résultat ne prédit rien.
2. **Couplage au monde.** $I(\mathrm{do}(a); W') > 0$. Ici $W'$ est l'état du monde en aval de l'actionneur, et $\mathrm{do}(a)$ est l'opérateur d'intervention de Pearl [1]. Le couplage doit survivre aux modifications des propres entrées du système. Modifier ses propres capteurs ne compte pas [2].
3. **Conséquence assumée.** La comparaison $m = M(R, R^*(a)) \in \{1, \mu, 0\}$ (concordance, partielle, discordance) modifie le système : $s_{t+1} = f(s_t, m)$.
4. **Plancher physique : le budget en joules.** $J(a) \le B$. Si aucun acte ne satisfait les clauses 1 à 4, l'acte est le refus, avec un reçu.

La physique met déjà un prix sur les clauses 1 à 3. La deuxième loi avec rétroaction [3, 4] et la borne de mesure et d'effacement [5] donnent, pour un bain à la température $T$ :

$$
W_{\mathrm{ext}} \le -\Delta F + k_B T\, I, \qquad W_{\mathrm{meas}} + W_{\mathrm{erase}} \ge k_B T\, I
$$

Ici $I$ est l'information mutuelle qu'acquiert la comparaison de l'acte, en nats. Un bit vaut $\ln 2$ nats, de sorte que chaque bit coûte $k_B T\ln 2$. Un accepteur qui compare puis se réinitialise paie au moins $k_B T \ln 2$ par bit sur un cycle fermé [6, 7]. La définition est physique dès sa première clause.

<div id="definition-1-coupling" class="anchor-alias" aria-hidden="true"></div>

#### Définition 1. Couplage

La clause 2 se mesure par le flux d'information causal. Soit l'acte $a$ tiré de la politique $p(a)$ et fixé par intervention, et soit $W'$ le monde en aval de l'actionneur. Alors

$$
I(\mathrm{do}(a); W') = \sum_{a} p(a) \sum_{w} p(w \mid \mathrm{do}(a)) \log_2 \frac{p(w \mid \mathrm{do}(a))}{\sum_{a'} p(a')\, p(w \mid \mathrm{do}(a'))}
$$

C'est le flux d'information d'Ay et Polani du nœud de l'acte vers $W'$ [8]. Il est égal à l'information mutuelle de la distribution jointe interventionnelle $p(a)\,p(w \mid \mathrm{do}(a))$. Son maximum sur les politiques est la capacité du canal qui va des actes au monde :

$$
0 \;\le\; I(\mathrm{do}(a); W') \;\le\; \max_{p(a)} I(\mathrm{do}(a); W') \;\le\; \log_2 |\mathcal{A}|
$$

Ici $\mathcal{A}$ est l'ensemble des actes disponibles. Klyubin, Polani et Nehaniv ont défini l'empowerment comme cette capacité, avec les futurs capteurs de l'agent lui-même à la place de $W'$ [9]. La clause 2 prend le côté du monde, de sorte que modifier un capteur n'ajoute rien [2].

**Réalisé, et non capacité.** La grandeur créditée à un acte est le flux réalisé sous la politique que l'agent a exécutée : $I(\mathrm{do}(a); W')$ pour cette $p(a)$. La capacité est une borne supérieure et n'est jamais créditée. Un système n'est pas crédité du couplage qu'il aurait pu réaliser et n'a pas réalisé.

**Estimation.** Le flux est estimé à partir des reçus. La politique randomisée de l'agent attribue les actes, de sorte que les comptages joints de $(a, w)$ dans le reçu sont des échantillons interventionnels. L'information mutuelle par substitution directe de ces comptages est biaisée vers le haut d'environ $(|\mathcal{A}|-1)(|\mathcal{W}|-1)/(2n)$ nats pour $n$ échantillons, $\mathcal{W}$ étant l'ensemble des résultats du monde distinguables. Ce terme de Miller-Madow est soustrait, et un intervalle bootstrap est rapporté [315]. Aux comptages d'un reçu, cette correction ne suffit pas. L'estimateur bayésien de Nemenman, Shafee et Bialek [325] est le remplaçant annoncé pour la prochaine exécution, et le schéma du reçu doit enregistrer quel estimateur a produit chaque chiffre. Là où la politique est déterministe dans un contexte, les actes n'y sont pas randomisés, et le flux n'est pas identifié à partir de cette exécution. Le reçu enregistre alors la borne de capacité dans sa propre colonne, étiquetée comme borne, et $X$ pour ce contexte est rapporté comme borne supérieure. L'exécution de la Section 8.11 a crédité la borne de capacité $b = n_{\mathrm{empty}}\log_2 9$. Son $X$ et sa $\iota$ sont des bornes supérieures du couplage réalisé et de l'intelligence réalisée. Son classement par $J^*$ n'utilise pas $X$, il tient donc.

Pourquoi cette mesure :

- **Elle est interventionnelle.** Le do-calcul de Pearl fournit l'opérateur [1]. Kenton, Kumar, Farquhar, Richens, MacDermott et Everitt définissent les agents comme des systèmes qui adapteraient leur politique si leurs actes influençaient le monde d'une autre manière, et ils découvrent des agents à partir de données interventionnelles [10]. Un reçu est interventionnel par construction. L'agent fixe ses actes, et le résultat se lit dans le monde.
- **Les mesures observationnelles échouent.** James, Barnett et Crutchfield ont montré par un exemple que l'entropie de transfert ne mesure pas le flux d'information [11]. Lizier et Prokopenko ont séparé le transfert d'information de l'effet causal et ont attribué l'effet causal au flux d'information causal [12].
- **Elle a un prix.** Sous intervention, le flux est une information mutuelle. L'information mutuelle est la grandeur à laquelle la deuxième loi avec rétroaction et la borne de mesure et d'effacement attribuent un prix en joules [3, 5].
- **Elle n'a pas besoin de graphe causal.** Janzing, Balduzzi, Grosse-Wentrup et Schölkopf ont dérivé une mesure de l'influence causale à partir de postulats, étant donnés le graphe causal et la distribution jointe [13]. Un reçu contient des actes et des résultats, pas le graphe complet de l'agent. Le flux se calcule directement à partir d'eux.
- **Le crédit revient à l'acte qui l'a causé.** Lorsque plusieurs actes touchent un même résultat, les bits crédités à l'acte $k$ suivent le traitement de la causalité effective pour des transitions uniques donné par Albantakis, Marshall, Hoel et Tononi [14].

<div id="definition-2-agent-boundary" class="anchor-alias" aria-hidden="true"></div>

#### Définition 2. Frontière de l'agent

Soit le système physique un ensemble fini $V$ de composants, chacun derrière une paroi mesurée. Un agent candidat est un sous-ensemble $S \subseteq V$, ou une agrégation à gros grain d'un tel sous-ensemble, qui détient l'enregistrement de chaque comparaison $m_k$ (clause 3), avec $W'$ hors de $S$. Pour une exécution achevée, soit $X_S$ le nombre de bits couplés confirmés crédités avec $S$ comme agent, et soit $J_S$ le nombre de joules mesurés à la paroi de $S$.

**L'agent est un candidat qui maximise $X_S / J_S$.**

$V$ est fini, il y a donc un nombre fini de candidats. Un maximiseur existe dès qu'un candidat a $J_S > 0$. Le reçu nomme le maximiseur et enregistre toute égalité.

**Mesure fermée sur l'acte.** La clause 4 impute les joules d'un acte à l'agent qui agit. Ainsi, à un candidat crédité du couplage d'un acte est imputé chaque joule qui le réalise : les joules de l'actionneur qui exécute l'acte et ceux de la liaison qui transporte la commande. $J_S$ dans la Définition 2 se lit selon cette règle. Takahashi et Hayashi montrent pourquoi la règle est nécessaire. Avec une frontière ouverte, le gain d'information et la dissipation à l'intérieur de la frontière se découplent, et les bits par joule peuvent être rendus aussi grands que l'on veut [239].

<div id="lemma-1-the-maximizing-boundary-contains-the-actuator" class="anchor-alias" aria-hidden="true"></div>

#### Lemme 1. La frontière maximisante contient l'actionneur

**Cadre.** Un composant $\alpha \in V$, l'actionneur, est une coupe entre le reste de $V$ et le monde : tout chemin causal d'un composant de $V \setminus \{\alpha\}$ vers $W'$ passe par la sortie $a$ de $\alpha$. Un candidat $S$ avec $\alpha \notin S$ n'agit sur $W'$ qu'au moyen d'une commande $c$ qu'il envoie à $\alpha$. Les parois sont disjointes, comme dans la Proposition 7, de sorte que $J_{S \cup \{\alpha\}} = J_S + J_\alpha + J_0$, avec des joules de liaison $J_0 \ge 0$.

**Hypothèses.**

- (B1) Coupe. Pour un candidat sans $\alpha$, $c \to a \to W'$ est une chaîne de Markov sous intervention sur $c$.
- (B2) Mesure fermée sur l'acte. Un candidat sans $\alpha$ crédité d'un couplage passant par $\alpha$ se voit imputer $J_S + J_\alpha + J_0$.
- (B3) Une égalité entre candidats est tranchée en faveur du plus grand au sens de l'inclusion.

**Énoncé.** Pour tout candidat $S$ avec $\alpha \notin S$ et des joules imputés positifs, $X_S / (J_S + J_\alpha + J_0) \le X_{S\cup\{\alpha\}} / J_{S\cup\{\alpha\}}$. Ainsi, un maximiseur de la Définition 2 contient $\alpha$, et sous (B3) le maximiseur nommé le contient. L'inégalité est stricte dès que l'actionneur ajoute du couplage, $X_S < X_{S\cup\{\alpha\}}$.

**Démonstration.**

1. Fixons un acte. Les deux candidats détiennent les mêmes enregistrements de comparaison, car $S$ détient chaque enregistrement (Définition 2) et $S \cup \{\alpha\}$ contient $S$. Donc $E_k$ et $m_k$ sont les mêmes pour les deux. Par (B1) et l'inégalité de traitement des données, appliquée à la distribution jointe interventionnelle, $I(\mathrm{do}(c); W') \le I(\mathrm{do}(a); W')$. En sommant sur les actes, $X_S \le X_{S\cup\{\alpha\}}$.
2. Par (B2) et la composition des parois (Proposition 7, partie 1), les joules imputés à $S$ sont égaux à $J_{S\cup\{\alpha\}}$.
3. L'étape 1 sur le dénominateur commun de l'étape 2 donne l'inégalité. Elle est stricte lorsque $X_S < X_{S\cup\{\alpha\}}$.
4. $V$ est fini, donc un maximiseur $S^*$ existe. Si $\alpha \notin S^*$, l'étape 3 fait aussi de $S^* \cup \{\alpha\}$ un maximiseur, et (B3) le nomme. $\blacksquare$

**Lecture.** Sans (B2), la Définition 2 est dégénérée. Un petit sous-ensemble qui détient les enregistrements et laisse la consommation de l'actionneur hors de sa paroi rapporte les mêmes bits couplés pour moins de joules. La mesure fermée sur l'acte élimine cela, sans coût en pratique, car les joules de l'actionneur figurent déjà sur le reçu en vertu de la clause 4. Les composants situés hors du chemin causal sont toujours éliminés par le rapport : en retirer un laisse $X$ inchangé et abaisse $J$. La recherche ne parcourt pas les $2^{|V|}$ sous-ensembles. Elle parcourt les candidats qui détiennent les enregistrements et contiennent l'actionneur. Sur une machine hôte, ils sont peu nombreux : processeur, accélérateur, mémoire, actionneur. Un seul compteur suffit lorsque ses domaines attribuent la puissance à ces composants (Section 8.1).

Pourquoi cette frontière :

- **Le rapport, et non $X_S$ seul.** Maximiser $X_S$ seul ne met aucun prix sur les composants qui ajoutent des joules sans aucun bit confirmé. Le rapport les élimine.
- **Pas la couverture de Markov.** Aguilera, Millidge, Tschantz et Buckley ont établi par dérivation que la condition de couverture de Markov ne tient que dans une plage étroite de paramètres, même pour des systèmes stochastiques linéaires faiblement couplés [15]. Biehl, Pollock et Kanai ont démontré par un contre-exemple que les définitions de la couverture de Markov en usage ne sont pas équivalentes [16]. Bruineberg, Dołęga, Dewhurst et Baltieri distinguent la couverture comme outil d'inférence de la couverture comme frontière physique [17].
- **Pas d'observateur.** Orseau, McGregor McGill et Legg définissent agent et dispositif par une comparaison bayésienne de deux descriptions du même comportement, de sorte que l'étiquette dépend des a priori de l'observateur [18]. $X_S$ et $J_S$ se lisent sur des reçus et des compteurs.
- **Une frontière trouvée par une mesure.** L'IIT 4.0 (théorie de l'information intégrée) prend pour système l'ensemble des éléments dotés d'un pouvoir cause-effet intégré maximal [19]. Krakauer, Bertschinger, Olbrich, Flack et Ay identifient les individus comme des agrégats qui propagent l'information de leur passé vers leur futur [20]. La Définition 2 garde la forme et utilise la monnaie propre à la définition : les bits couplés confirmés par joule.
- **Les agrégations à gros grain comptent.** Hoel, Albantakis et Tononi ont montré qu'une description macroscopique peut porter davantage de pouvoir causal que la description microscopique [21].
- **Les outils déplacent la frontière.** Lorsqu'une personne utilise un outil, les candidats comprennent la personne seule, l'outil seul et la paire. La Définition 2 crédite le couplage au candidat qui maximise $X_S/J_S$, chaque joule de l'acte lui étant imputé. Krakauer modélise la personne, l'outil et la tâche comme un seul système dynamique dans lequel la compétence retenue et la dépendance coévoluent. Au-delà d'une disponibilité critique de l'outil, la compétence s'effondre jusqu'à un plancher de dépendance, et sous un but incertain l'agentivité elle-même peut passer à l'outil [340]. Dans ce modèle, un outil dont l'utilisateur peut reconstruire le fonctionnement, comme un boulier, laisse la compétence à la personne une fois l'outil retiré, tandis que la navigation par satellite se situe dans la région où la compétence diminue avec l'usage [340]. Le rapport de la Définition 2 rend ce transfert mesurable : testez la personne sans l'outil, et les bits confirmés qui restent sont ceux que la personne détient.
- **Chaque candidat a une interface.** Rosas, Mediano, Biehl, Chandaria et Polani ont démontré que tout processus stochastique biparti possède une couverture causale, et ont donné un algorithme qui la trouve à partir de données sans hypothèse d'état stationnaire ni de Markov [22].

<div id="22-layer-2-kinematics" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Couche 2. Cinématique

Les joules cumulés sont $J(t) = \int_0^t P(t')\,dt'$, $P$ étant la puissance mesurée.

Le déplacement d'agentivité compte les bits de changement confirmé et couplé :

$$
X(t) = \sum_{k:\,t_k \le t} E_k\, m_k\, I(\mathrm{do}(a_k); W'_k)
$$

Par acte, $I(\mathrm{do}(a_k); W'_k)$ est le flux réalisé de la politique qui a choisi $a_k$, estimé sur les actes de l'exécution dans le même contexte (Définition 1).

La vitesse par seconde est $v_t = dX/dt$. La vitesse par joule est $v_J = dX/dJ$. L'accélération par joule est $\alpha_J = d^2X/dJ^2$. Le budget est $J(T) \le B$.

Les bornes cinématiques sont les limites de ces grandeurs.

**K1. Plancher de Landauer, cycle fermé.** Chaque bit confirmé est enregistré puis effacé pour réinitialiser l'accepteur. Ainsi

$$
v_J \le \frac{1}{k_B T \ln 2}.
$$

À $T = 300$ K, $k_B T \ln 2 \approx 2.87 \times 10^{-21}$ J, calculé à partir des constantes du SI. Cela fait environ $3.5 \times 10^{20}$ bits par joule. La Proposition 1 démontre K1 acte par acte, pour les joules moyens de chaque acte, sous des hypothèses énoncées sur l'enregistrement.

**K2. Limite de vitesse classique.** Shiraishi, Funo et Saito ont démontré cette borne pour un processus de sauts markovien avec bilan détaillé local [23] :

$$
\tau \;\ge\; \frac{L\big(p(0),p(\tau)\big)^2}{2\,\Sigma_{\mathrm{tot}}\,\langle A\rangle_\tau}
$$

- $L(p,p') = \sum_i |p_i - p'_i|$ est la distance $L_1$ complète entre deux distributions de probabilité. Il n'y a pas de facteur 1/2. Avec la distance en variation totale $d_{TV} = L/2$, la même borne s'écrit $\tau \ge 2 d_{TV}^2/(\Sigma_{\mathrm{tot}}\langle A\rangle_\tau)$.
- $\Sigma_{\mathrm{tot}} = \int_0^\tau \dot\Sigma\,dt$ est la production totale d'entropie, système plus bains, en unités de $k_B$.
- $A(t) = \sum_{i\ne j} W_{ij}(t)\,p_j(t)$ est l'activité dynamique, $W_{ij}$ étant le taux de saut de l'état $j$ vers l'état $i$. $\langle A\rangle_\tau = \frac{1}{\tau}\int_0^\tau A(t)\,dt$ est sa moyenne temporelle.

Réarrangée, $\Sigma_{\mathrm{tot}} \ge L^2/(2\tau\langle A\rangle_\tau)$. Déplacer une distribution loin, vite et avec peu de sauts coûte de l'entropie.

**Forme en joules.** Pour un bain, $k_B T\,\Sigma_{\mathrm{tot}} = W - \Delta F_{\mathrm{neq}}$, $F_{\mathrm{neq}}$ étant l'énergie libre hors d'équilibre [24]. Le travail dissipé vérifie donc

$$
W_{\mathrm{diss}} \;\ge\; \frac{k_B T\, L^2}{2\,\tau\,\langle A\rangle_\tau}.
$$

**Courants stationnaires.** Le même article donne $\tau \ge c^* L^2 / (2\,\Sigma_{HS}\,\langle A\rangle_\tau)$, avec $c^* = 0.896\ldots$ et $\Sigma_{HS}$ la production d'entropie de Hatano-Sasa, ou d'excès [23].

**K3. La précision coûte de la dissipation.** Les actes sont forcés et non stationnaires, de sorte que la forme qui s'applique est la relation d'incertitude de Koyuk et Seifert pour un forçage dépendant du temps [323] ; la forme stationnaire est énoncée ici pour référence. Pour un courant $Y$ antisymétrique en temps dans un état stationnaire, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma_{\mathrm{tot}}$ [25, 26]. Les agents utilisent la rétroaction, et la rétroaction bat cette borne en expérience [27]. La borne pour les agents est la forme avec rétroaction, dans laquelle l'information mutuelle entre dans la borne [28]. La Proposition 3 l'énonce pour l'agentivité confirmée.

**K4. Coût en temps fini.** Effacer un bit en un temps fini $\tau$ coûte plus que $k_B T \ln 2$. L'excès croît à mesure que $\tau$ diminue [29]. Près de l'équilibre, le travail en excès le long d'un protocole est borné inférieurement par le carré de la longueur thermodynamique divisé par la durée [30]. La Proposition 1 donne le plancher pour un acte entier.

**K5. Plafond quantique du taux.** Un système d'énergie moyenne $\langle E\rangle$ au-dessus de son état fondamental effectue au plus $2\langle E\rangle/(\pi\hbar)$ transitions orthogonales par seconde [31]. Cela fait environ $6.04 \times 10^{33}$ transitions par seconde et par joule, calculé à partir des constantes. Le chiffre d'environ $3 \times 10^{33}$ parfois cité est $2E/h$, la moitié du taux de Margolus-Levitin, puisque $2E/(\pi\hbar) = 4E/h$.

<div id="proposition-1-joule-floor-of-one-act-in-finite-time" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 1. Plancher en joules d'un acte en temps fini

**Cadre.** L'acte $k$ écrit sa comparaison dans un registre $M_k$ à $N$ états, puis réinitialise le registre. Le registre est un processus de sauts markovien avec bilan détaillé local, en contact avec un bain à la température $T$. Pendant l'écriture, le résultat comparé $R_k$ est maintenu fixe, et les taux de saut du registre peuvent en dépendre. Pendant la réinitialisation, les taux du registre ne dépendent de rien d'autre, de sorte que le registre évolue seul. La réinitialisation dure $\tau_k$. $\langle A\rangle_k$ est l'activité dynamique moyennée en temps du registre pendant la réinitialisation. Les joules et les travaux sont des moyennes sur l'ensemble statistique de l'acte $k$.

**Hypothèses.**

- (R1) Les états du registre ont la même énergie. Le registre ne partage aucune énergie d'interaction avec $R_k$ au début ni à la fin de l'écriture. Au début de l'acte, le registre est dans sa distribution de préparation $q^0$, indépendante de $R_k$.
- (R2) Les bits crédités ne dépassent pas l'information que l'écriture laisse dans le registre : $b_k \le I(M_k; R_k)$, en bits, à la fin de l'écriture. Le registre ne change pas entre l'écriture et la réinitialisation.
- (R3) La réinitialisation ramène le registre à $q^0$. L'erreur de réinitialisation est $\varepsilon = 1 - \max_s q^0_s$.
- (R4) Le travail de l'écriture et de la réinitialisation passe par le compteur : $J_k \ge W_k^{\mathrm{write}} + W_k^{\mathrm{reset}}$.

**Énoncé.**

$$
J_k \;\ge\; b_k\, k_B T \ln 2 \;+\; \frac{2\, k_B T\, \big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Ici $(x)_+ = \max(x, 0)$, $h_2(x) = -x\log_2 x - (1-x)\log_2(1-x)$ est l'entropie binaire, et $\phi_N(x) = h_2(x) + x\log_2(N-1)$. Sur $[0, 1 - 1/N]$, $\phi_N$ croît de 0 à $\log_2 N$, de sorte que son inverse est défini sur $[0, \log_2 N]$. Pour un registre d'un bit qui confirme un bit, $\phi_2^{-1}(1) = 1/2$ et

$$
J_k \;\ge\; k_B T \ln 2 \;+\; \frac{2\, k_B T\, \big[(1/2 - \varepsilon)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Lorsque $\varepsilon \to 0$, ceci tend vers $k_B T\ln 2 + k_B T/(2\tau_k\langle A\rangle_k)$.

**Démonstration.**

1. Pour un processus de sauts markovien isotherme avec bilan détaillé local, $W = \Delta F_{\mathrm{neq}} + k_B T\, \Sigma_{\mathrm{tot}}$ avec $\Sigma_{\mathrm{tot}} \ge 0$. Ici $F_{\mathrm{neq}} = \langle E\rangle - k_B T\, S$, $S$ étant l'entropie de Shannon en nats [24].
2. L'écriture. Appliquons l'étape 1 à la paire $(M_k, R_k)$ avec $R_k$ fixe. Par (R1), l'énergie moyenne ne change pas et la paire part indépendante. L'entropie de $R_k$ ne change pas. L'entropie jointe change donc de $H(q') - I - H(q^0)$, où $q'$ est la distribution du registre après l'écriture et $I = I(M_k; R_k)$, le tout en nats. Donc $W_k^{\mathrm{write}} \ge k_B T\,[\,I - H(q') + H(q^0)\,]$.
3. La réinitialisation. Le registre évolue seul, de sorte que l'étape 1 s'applique au registre. Son énergie ne change pas. Par (R2) et (R3), son entropie passe de $H(q')$ à $H(q^0)$. Donc $W_k^{\mathrm{reset}} = k_B T\,[\,H(q') - H(q^0)\,] + k_B T\, \Sigma^{\mathrm{reset}}$.
4. Les étapes 2 et 3 et (R4) donnent $J_k \ge k_B T\, I + k_B T\, \Sigma^{\mathrm{reset}}$. Les entropies du registre se compensent sur le cycle. En bits, $k_B T\, I = k_B T\ln 2\; I(M_k;R_k) \ge b_k\, k_B T\ln 2$ par (R2). C'est la borne de mesure et d'effacement de Sagawa et Ueda [5], ici pour une distribution de préparation quelconque.
5. La limite de vitesse classique donne $\Sigma^{\mathrm{reset}} \ge L^2/(2\tau_k\langle A\rangle_k)$, avec $L = \sum_s \lvert q'_s - q^0_s\rvert$ [23]. Prenons $s$ tel que $q^0_s = \max q^0 = 1 - \varepsilon$. Les autres états portent au total la variation opposée, donc $L \ge 2(q^0_s - q'_s) \ge 2\,[(1 - q'_{\max}) - \varepsilon]$.
6. L'inégalité de Fano, sans information auxiliaire et avec l'état le plus probable comme estimation, donne $H(q') \le h_2(1-q'_{\max}) + (1-q'_{\max})\log_2(N-1) = \phi_N(1 - q'_{\max})$, en bits. Comme $1 - q'_{\max} \le 1 - 1/N$ et que $\phi_N$ y est croissante, $1 - q'_{\max} \ge \phi_N^{-1}(H(q'))$. Par (R2), $H(q') \ge I(M_k;R_k) \ge b_k$, et $\phi_N^{-1}$ est croissante. Donc $L \ge 2\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+$.
7. Les étapes 4 à 6 donnent l'énoncé. $\blacksquare$

**Lecture.** Le plancher est la somme de deux prix. Le prix de l'information est $k_B T\ln 2$ par bit confirmé, payé sur le cycle fermé quel que soit l'état de préparation. Le prix de la vitesse appartient à la réinitialisation. Une réinitialisation à taux finis n'atteint jamais un état unique en temps fini, de sorte que $\varepsilon > 0$ pour tout $\tau_k$ fini, et le prix de la vitesse porte cette erreur. K1 vaut acte par acte pour tout $\tau_k$. Des bornes d'effacement plus serrées pour des dynamiques particulières sont aussi des bornes inférieures de la même réinitialisation (Section 4.1). Par acte, la vitesse par joule est

$$
v_{J,k} = \frac{b_k}{J_k} \;\le\; \frac{b_k}{b_k\, k_B T \ln 2 + 2 k_B T\,\big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2/(\tau_k\langle A\rangle_k)} \;\le\; \frac{1}{k_B T \ln 2}
$$

La dernière inégalité est stricte dès que $\phi_N^{-1}(b_k) > \varepsilon$ avec $\tau_k\langle A\rangle_k$ fini.

<div id="proposition-2-standing-joules-to-hold-a-goal" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 2. Joules permanents pour tenir un but

**Cadre.** Le monde est un procédé linéaire $x_{t+1} = A x_t + B u_t + w_t$, avec $x_t \in \mathbb{R}^n$. À l'étape $t$, l'agent écrit un enregistrement à valeurs finies $c_t$ du procédé. Sa mémoire $s_t$ est une fonction à valeurs finies de $(s_{t-1}, c_t)$, avec $s_0$ fixé, et son acte $u_t$ est une fonction de $s_t$. Conserver tous les enregistrements, $s_t = (s_{t-1}, c_t)$, est une telle mémoire. Le but est de tenir le procédé : $\sup_t \mathbb{E}\|x_t\|^2 < \infty$.

**Hypothèses.**

- (C1) Le bruit $w_t$ est indépendant de $(x_t, s_t)$.
- (C2) $x_0$ a une densité d'entropie différentielle finie et un moment d'ordre deux fini.
- (C3) Comptabilité en cycle fermé par étape. $J_t$ est le nombre moyen de joules attribués à l'enregistrement $c_t$ : son écriture et son effacement ultérieur, à quelque moment qu'ils soient payés. $J_t \ge k_B T\, I(x_t; c_t \mid s_{t-1})$, l'information étant en nats. C'est la Proposition 1, étapes 1 à 4, pour chaque valeur de la mémoire $s_{t-1}$, avec un enregistrement neuf dans son état de préparation et $x_t$ maintenu fixe pendant l'écriture [5]. Une mémoire de taille bornée efface chaque enregistrement en un nombre borné d'étapes, de sorte que les joules attribués tombent dans l'exécution à un terme de bord près.

**Énoncé.** Il s'agit d'un corollaire, assorti d'un prix en joules, du théorème du débit de données de Tatikonda et Mitter [169] et de Nair et Evans [170]. L'inégalité en boucle fermée de Touchette et Lloyd [32, 33] reporte le débit sur l'enregistrement, et le prix d'effacement de Landauer [6] convertit chaque bit en $k_B T\ln 2$ joules. Il n'est nouveau qu'en tant que cette composition. Soient $\lambda_1, \dots, \lambda_n$ les valeurs propres de $A$. Alors

$$
\liminf_{N\to\infty} \frac{1}{N}\sum_{t=1}^{N} J_t \;\ge\; k_B T \ln 2 \sum_{i:\,|\lambda_i| > 1} \log_2 |\lambda_i|
$$

**Démonstration.**

1. Choisissons des coordonnées réelles dans lesquelles $A = \mathrm{diag}(A_u, A_s)$, $A_u$ portant exactement les valeurs propres de module supérieur à 1. Soit $y_t$ le bloc instable de $x_t$. Alors $y_{t+1} = A_u y_t + v_t + e_t$, où $v_t$ est une fonction de $s_t$ et $e_t$ est indépendant de $(y_t, s_t)$ par (C1). Un changement linéaire de coordonnées décale les entropies différentielles d'une constante, de sorte que la finitude est inchangée.
2. Soit $D_t = h(y_t \mid s_t)$, une entropie différentielle conditionnelle en nats. Ajouter un bruit indépendant ne diminue pas une entropie conditionnelle. Décaler d'une fonction de $s_t$ ne la change pas. L'application linéaire $A_u$ ajoute $\ln|\det A_u|$. Donc $h(y_{t+1} \mid s_t) \ge D_t + \ln|\det A_u|$.
3. $s_{t+1}$ est une fonction de $(s_t, c_{t+1})$, et conditionner sur moins ne diminue jamais l'entropie. Donc $D_{t+1} \ge h(y_{t+1}\mid s_t, c_{t+1}) = h(y_{t+1}\mid s_t) - I(y_{t+1}; c_{t+1} \mid s_t)$. Comme $y$ est une fonction de $x$, $I(y_{t+1}; c_{t+1}\mid s_t) \le I(x_{t+1}; c_{t+1}\mid s_t)$. C'est l'inégalité en boucle fermée de Touchette et Lloyd [32, 33].
4. Les étapes 2 et 3 donnent $I(x_{t+1}; c_{t+1}\mid s_t) \ge \ln|\det A_u| - (D_{t+1} - D_t)$. En sommant sur $N$ étapes, $\sum_{t=1}^{N} I(x_t; c_t\mid s_{t-1}) \ge N \ln|\det A_u| - (D_N - D_0)$.
5. Chaque enregistrement est à valeurs finies, donc chaque terme d'information est fini. $D_0 = h(y_0)$ est fini : le moment d'ordre deux le borne par le haut, et $h(x_0) \le h(y_0) + h(x^{\mathrm{s}}_0)$, $x^{\mathrm{s}}_0$ étant le bloc stable, le borne par le bas, par (C2). $D_N \le h(y_N)$, et une gaussienne a la plus grande entropie pour une covariance donnée, de sorte que le moment d'ordre deux borné borne $D_N$ par le haut. En divisant par $N$, l'information moyenne par étape est au moins $\ln|\det A_u| = \sum_{|\lambda_i|>1}\ln|\lambda_i|$ à la limite.
6. (C3) attribue à chaque nat le prix $k_B T$, soit $k_B T\ln 2$ par bit. $\blacksquare$

**Lecture.** Un agent qui tient un but face à un monde instable paie une puissance permanente d'au moins $f\, k_B T\ln 2\sum_{|\lambda_i|>1}\log_2|\lambda_i|$ à $f$ pas de commande par seconde. Un mode instable avec $|\lambda| = 2$ demande un bit par pas, soit $k_B T\ln 2 \approx 2.87\times10^{-21}$ J par pas à 300 K. Les bits par pas de l'enregistrement bornent son information par le haut, de sorte que la démonstration donne aussi une forme non stricte et moyennée du théorème du débit de données (Section 4.1). La composition est brève. C'est le théorème du débit de données de Tatikonda et Mitter et de Nair et Evans [169, 170], au prix de $k_B T\ln 2$ par bit via Touchette et Lloyd [32, 33]. Ce qu'elle ajoute, c'est le prix en joules, qui est le plancher dont la Prédiction 1 a besoin.

<div id="proposition-3-precision-of-confirmed-agency" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 3. Précision de l'agentivité confirmée

**Cadre.** L'agent, son monde et sa rétroaction forment un seul processus de sauts markovien homogène en temps et irréductible sur un nombre fini d'états, dans son état stationnaire. Chaque acte confirmé est un saut d'un type marqué. $N(t)$ compte les actes confirmés dans $[0,t]$. $\langle K\rangle$ est le nombre moyen de sauts de tous types dans $[0,t]$, et $\langle k\rangle = \langle K\rangle/t$ est le taux moyen de sauts.

**Énoncé.**

1. Dans la limite des temps longs, $\mathrm{Var}(N)/\langle N\rangle^2 \ge 1/\langle K\rangle$. Si chaque acte confirmé crédite les mêmes $b$ bits, alors $X = bN$ et la même borne vaut pour $X$.
2. Soit $T_n$ l'instant où se clôt le $n$-ième acte confirmé. Pour $n$ grand, $\mathrm{Var}(T_n)/\langle T_n\rangle^2 \ge 1/(\langle T_n\rangle\langle k\rangle)$.
3. Soit plutôt $X$ impair sous l'application vers l'expérience inverse d'une relation de fluctuation qui inclut un terme d'information, $P_B(-X,-\sigma_I)/P(X,\sigma_I) = e^{-\sigma_I}$. Alors

$$
\frac{\mathrm{Var}(X) + \mathrm{Var}_B(X)}{\big(\langle X\rangle + \langle X\rangle_B\big)^2} \;\ge\; \frac{1}{\exp\!\big[(\langle\sigma_I\rangle + \langle\sigma_I\rangle_B)/2\big] - 1}
$$

Lorsque l'expérience inverse est égale à l'expérience directe, ceci s'écrit $\mathrm{Var}(X)/\langle X\rangle^2 \ge 2/\big(e^{\langle\sigma_I\rangle} - 1\big)$.

**Démonstration.** $N$ est une observable de comptage : elle compte un sous-ensemble de sauts et ne décroît jamais. Garrahan a démontré les parties 1 et 2 pour les observables de comptage dans les processus de sauts markoviens stationnaires [34]. La partie 1 est sa borne de la variance d'une observable de comptage par l'activité moyenne. La partie 2 est sa borne de premier passage, énoncée pour des comptages dont les poids de saut valent 0 ou 1, ce qui est le cas ici puisque $N$ compte un seul type marqué de saut. Multiplier par $b$ laisse une variance relative inchangée. La partie 3 est la relation d'incertitude que Potts et Samuelsson ont dérivée de toute relation de fluctuation, mesure et rétroaction comprises [28], appliquée avec $X$ comme observable. $\blacksquare$

**Lecture.** La partie 1 n'a besoin d'aucune propriété de renversement du temps ni d'aucun modèle de la rétroaction. La précision de l'agentivité confirmée s'achète avec de l'activité. La partie 3 est le prix de la dissipation, et elle vaut sous rétroaction parce qu'elle repose sur la relation de fluctuation avec rétroaction. La TUR standard ne contraint pas les machines à rétroaction en expérience [27]. C'est pourquoi la forme pour agents porte le terme d'information.

<div id="proposition-4-quantum-agents-keep-the-floor" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 4. Les agents quantiques conservent le plancher

**Cadre.** La comparaison $m_k$ provient d'une mesure quantique et est écrite dans un registre classique, l'enregistrement de la clause 3. La réinitialisation du registre satisfait le cadre de la Proposition 1 ainsi que (R2) et (R3), $I(M_k;R_k)$ étant l'information mutuelle quantique-classique de la mesure. Le travail de la réinitialisation passe par le compteur : $J_k \ge W_k^{\mathrm{reset}}$.

**Énoncé.**

$$
J_k \;\ge\; k_B T\ln 2\,\big[\,b_k - \phi_N(\varepsilon)\,\big] \;+\; \frac{2\, k_B T\, \big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Lorsque $\varepsilon \to 0$, c'est le plancher de la Proposition 1. Lorsque l'écriture est elle aussi mesurée, la borne de mesure et d'effacement de Sagawa et Ueda donne $J_k \ge b_k\, k_B T\ln 2$ pour tout $\varepsilon$, sous l'hypothèse supplémentaire qu'ils énoncent pour la mesure quantique [5].

**Démonstration.** L'étape 3 de la Proposition 1 n'utilise que le registre et sa dynamique de réinitialisation. Elle donne $W_k^{\mathrm{reset}} = k_B T\ln 2\,[H(q') - H(q^0)] + k_B T\,\Sigma^{\mathrm{reset}}$, avec les entropies en bits. L'information mutuelle quantique-classique est au plus l'entropie des résultats [5], donc $H(q') \ge b_k$. L'inégalité de Fano donne $H(q^0) \le \phi_N(\varepsilon)$, puisque $\varepsilon \le 1 - 1/N$. Les étapes 5 et 6 de la Proposition 1 bornent $\Sigma^{\mathrm{reset}}$. $\blacksquare$

**Lecture.** Les ressources quantiques changent ce qu'un agent peut faire par acte. Elles n'abaissent pas le prix de son enregistrement. L'enregistrement coûte $k_B T\ln 2$ par bit, moins un résidu $\phi_N(\varepsilon)$ qui s'annule à mesure que la réinitialisation devient exacte. La mesure qui écrit l'enregistrement a son propre prix, donné à la Section 4.1.

<div id="23-layer-3-calculus-intelligence-as-a-derivative-read-in-hindsight" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Couche 3. Calcul : l'intelligence comme dérivée, lue après coup

Une exécution produit un reçu : l'enregistrement ordonné $\{(J_k, X_k)\}_{k=0}^{n}$ des joules mesurés et du déplacement confirmé. Chaque $m_k$ n'est connu qu'après la clôture de l'acte $k$. La trajectoire $X(J)$ n'existe donc qu'une fois l'exécution achevée.

- **Intelligence, marginale :** $\iota(J) = \dfrac{dX}{dJ}$, estimée à partir du reçu comme $\iota_k = \Delta X_k/\Delta J_k$.
- **Intégrale de l'exécution :** $X(B) = \int_0^B \iota(J)\,dJ$.
- **Joules pour satisfaire une exigence :** $J^*(X_{\mathrm{req}}) = \int_0^{X_{\mathrm{req}}} \frac{dX}{\iota}$.
- **Optimum :** $\pi^* = \arg\min_\pi J_\pi$ sous les contraintes $X_\pi \ge X_{\mathrm{req}}$, $E_k = 1$ pour tout $k$, et $J_\pi \le B$. Si aucune politique n'est réalisable, refuser avec un reçu.
- **Classement :** $S_1 \succ_q S_2 \iff J^*_{S_1}(q) < J^*_{S_2}(q)$.

$X_{\mathrm{req}}$ est fixé par le prédicat de complétude de la tâche, $C(z)$. C'est une porte, pas un score. Les paramètres, les tokens et les bancs d'essai n'interviennent qu'à travers $J^*$. Tous les autres facteurs se réduisent à zéro.

La lecture après coup est ici littérale. La vitesse se lit sur une trajectoire enregistrée. L'intelligence se lit sur une exécution enregistrée. Le reçu est la trajectoire.

<div id="proposition-5-intelligence-exists-as-a-bounded-density-on-the-joule-axis" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 5. L'intelligence existe comme densité bornée sur l'axe des joules

**Cadre.** Une exécution sur $[0, T]$ a une puissance mesurée $P(t) \ge 0$, intégrable, et une mesure en joules $dJ = P\,dt$. L'acte $k$ occupe $[s_k, e_k]$ et crédite $b_k = E_k\, m_k\, I(\mathrm{do}(a_k); W'_k) \ge 0$ bits. Les actes peuvent se chevaucher. Chaque acte a une puissance attribuée $P_k \ge 0$, nulle hors de $[s_k, e_k]$, avec $\sum_k P_k \le P$. Ses joules sont $J_k = \int P_k\,dt > 0$. Pour des actes qui ne se chevauchent pas, $P_k = P$ sur l'intervalle de l'acte.

**Règle de crédit.** Les bits de chaque acte sont répartis sur ses propres joules :

$$
dX = \sum_k \frac{b_k}{J_k}\, P_k\, dt
$$

**Hypothèse (K1 par acte).** $b_k\, k_B T \ln 2 \le J_k$ pour tout $k$. La Proposition 1 la fournit sous (R1) à (R4) pour les joules moyens de chaque acte, de sorte que l'énoncé vaut pour l'exécution moyenne. Sur une exécution unique, elle vaut dès que chaque acte consomme plus de $b_k\, k_B T\ln 2$. Chaque acte confirmé de l'exécution de la Section 8.11 a consommé plus de $3 \times 10^{14}$ fois cette quantité.

**Énoncé.**

1. Pour tout ensemble mesurable d'instants $A \subseteq [0,T]$, $0 \le X(A) \le J(A)/(k_B T\ln 2)$. Ainsi $dX$ est absolument continue par rapport à $dJ$.
2. La dérivée de Radon-Nikodym $\iota = dX/dJ$ existe, est unique à des ensembles de zéro joule près, et vérifie

$$
0 \;\le\; \iota \;\le\; \frac{1}{k_B T \ln 2}
$$

Là où $P > 0$, $\iota = \sum_k (b_k/J_k)(P_k/P)$. Pour des actes qui ne se chevauchent pas, $\iota = b_k/J_k$ sur l'acte $k$, ce qui est la $\iota_k$ du reçu.

3. L'agentivité confirmée est une fonction des joules cumulés : $X(t) = g(J(t))$, avec $g$ croissante au sens large et lipschitzienne de constante $1/(k_B T\ln 2)$. Ainsi $g$ est dérivable en presque tout joule, et $g'(J(t)) = \iota(t)$ pour presque tout joule.
4. Si au contraire les bits de chaque acte sont crédités à l'instant où il se clôt, alors $dX = \sum_k b_k\,\delta_{e_k}$ est singulière par rapport à $dJ$ dès qu'un $b_k > 0$. Alors $g$ est une fonction en escalier, $g' = 0$ en presque tout joule, et toute l'agentivité se trouve sur un ensemble de zéro joule.

**Démonstration.**

1. $X(A) = \sum_k (b_k/J_k)\int_A P_k\,dt \le \frac{1}{k_BT\ln 2}\int_A \sum_k P_k\,dt \le \frac{J(A)}{k_BT\ln 2}$, par K1 par acte puis $\sum_k P_k \le P$. Si $J(A) = 0$, alors $X(A) = 0$.
2. Les deux mesures sont finies, de sorte que le théorème de Radon-Nikodym donne $\iota$. Si $\iota > 1/(k_BT\ln 2)$ sur un ensemble $B$ avec $J(B) > 0$, alors $X(B) > J(B)/(k_BT\ln 2)$, ce qui contredit l'étape 1. Sur $\{P > 0\}$, $dX = \sum_k (b_k/J_k)(P_k/P)\,dJ$, et $P_k = 0$ là où $P = 0$. Cela donne la forme explicite.
3. Si $J(t_1) = J(t_2)$ avec $t_1 < t_2$, l'étape 1 donne $X((t_1,t_2]) = 0$, de sorte que $g$ est bien définie. Pour $t_1 < t_2$, $g(J(t_2)) - g(J(t_1)) = X((t_1,t_2]) \le (J(t_2) - J(t_1))/(k_BT\ln 2)$. $J$ est continue, donc $g$ est lipschitzienne sur $[0, J(T)]$. Une fonction lipschitzienne est absolument continue et dérivable presque partout. Un changement de variables donne $\int_0^t g'(J(s))\,dJ(s) = g(J(t)) = X([0,t])$. Ainsi $g'\circ J$ est aussi une densité de $X$ par rapport à $J$, et elle est égale à $\iota$ par unicité.
4. $X(\{e_k\}) = b_k > 0$ alors que $J(\{e_k\}) = 0$, car $J$ est continue. Donc $dX$ n'est pas absolument continue. Elle est portée par un nombre fini de points de zéro joule, elle est donc singulière. Une fonction constante entre un nombre fini de sauts a une dérivée nulle presque partout. $\blacksquare$

**Lecture.** L'intelligence lue après coup est une densité bien définie sur l'axe des joules dès que les bits de chaque acte sont répartis sur les joules que cet acte a utilisés. La règle de crédit est ce qui fait exister $dX/dJ$. Le crédit ponctuel place toute l'agentivité sur un ensemble de zéro joule. Les actes qui se chevauchent sont traités par toute attribution qui n'assigne jamais plus de joules que le compteur n'en a lu. Chaque $b_k$ n'est connu qu'après la clôture de l'acte $k$, de sorte que $\iota$ se lit sur l'exécution achevée.

La Proposition 5 vaut par construction. La règle de crédit rend $X$ absolument continue par rapport à $J$, de sorte que la densité existe par définition. Son contenu est le choix de la règle : la partie 4 montre que l'autre règle naturelle, le crédit ponctuel, ne laisse aucune densité.

<div id="proposition-6-sampled-intelligence-converges" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 6. L'intelligence échantillonnée converge

**Cadre.** Le compteur est lu aux joules cumulés $0 = j_0 < j_1 < \dots < j_M = J(T)$, avec un pas de maillage $\Delta = \max_i (j_{i+1} - j_i)$. Sur $[j_i, j_{i+1})$, l'intelligence échantillonnée est

$$
\hat\iota = \frac{g(j_{i+1}) - g(j_i)}{j_{i+1} - j_i}
$$

Les échantillons en temps raffinent les échantillons en joules, car $J$ est continue.

**Énoncé.** Dans le cadre de la Proposition 5, $\hat\iota(j) \to g'(j)$ en presque tout joule $j$ lorsque $\Delta \to 0$, et $0 \le \hat\iota \le 1/(k_BT\ln 2)$ pour tout maillage. Si la lecture du compteur de chaque intervalle échantillonné a une erreur relative d'au plus $\epsilon < 1$, le rapport rapporté se trouve dans $[\hat\iota/(1+\epsilon),\, \hat\iota/(1-\epsilon)]$.

**Démonstration.** $\hat\iota(j)$ est la moyenne de $g'$ sur un intervalle échantillonné $I \ni j$ de longueur $h \le \Delta$. Comme $I \subseteq [j - h, j + h]$,

$$
\big|\hat\iota(j) - g'(j)\big| \;\le\; \frac{1}{h}\int_{j-h}^{j+h}\big|g'(u) - g'(j)\big|\,du
$$

Le membre de droite tend vers 0 en tout point de Lebesgue de $g'$, et presque tout $j$ est un point de Lebesgue par le théorème de différentiation de Lebesgue. Les bornes de $\hat\iota$ sont la monotonie et la constante de Lipschitz de $g$. Une lecture $\Delta\hat J \in [(1-\epsilon)\Delta J, (1+\epsilon)\Delta J]$ divise le même $\Delta X$. $\blacksquare$

<div id="proposition-7-composition-of-joules-and-coupled-bits" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 7. Composition des joules et des bits couplés

**Cadre.** Un groupe $G$ de membres $i = 1, \dots, n$ agit sur un même monde $W'$. Chaque membre se trouve derrière sa propre paroi mesurée. Les parois sont disjointes et situées à l'intérieur de la paroi du groupe, et chaque membre tire son énergie de l'extérieur du groupe. Les membres choisissent les actes $a_1, \dots, a_n$ selon des politiques indépendantes. Le couplage du membre $i$ est calculé avec les autres membres agissant selon leurs propres politiques.

**Énoncé.**

1. $J_G = \sum_i J_i + J_0$, où $J_0 \ge 0$ est l'énergie qui entre par la paroi du groupe et par la paroi d'aucun membre.
2. $I(\mathrm{do}(a_1,\dots,a_n); W') \ge \sum_i I(\mathrm{do}(a_i); W')$, avec égalité si et seulement si $a_i$ est indépendant de $(a_1, \dots, a_{i-1})$ sachant $W'$ pour tout $i$.
3. L'inégalité peut être stricte lorsque chaque membre, seul, est découplé. Avec $a_1, a_2$ des bits uniformes indépendants et $W' = a_1 \oplus a_2$, le couplage de chaque membre est de 0 bit et celui du groupe de 1 bit.
4. Sous K1 par acte à la paroi du groupe, la Proposition 5 s'applique à $G$ : $\iota_G$ existe et $0 \le \iota_G \le 1/(k_BT\ln 2)$. Par la Définition 2, $G$ est l'agent lorsque $X_G/J_G$ dépasse $X_S/J_S$ pour tout autre candidat, chaque membre compris.

**Démonstration.**

1. Chaque joule qui entre par la paroi d'un membre entre d'abord par la paroi du groupe, et l'énergie mesurée s'additionne sur des parois disjointes.
2. Sous intervention, les actes ont la distribution produit $\prod_i p(a_i)$, et chaque couplage est une information mutuelle de la distribution jointe interventionnelle (Définition 1). Le couplage du membre $i$ est $I(a_i; W')$ dans cette jointe, par marginalisation des autres actes. Par la règle de chaînage, $I(a_{1:n}; W') = \sum_i I(a_i; W' \mid a_{<i})$. L'indépendance donne $I(a_i; a_{<i}) = 0$, donc $I(a_i; W' \mid a_{<i}) = I(a_i; W', a_{<i}) = I(a_i; W') + I(a_i; a_{<i} \mid W') \ge I(a_i; W')$. L'égalité vaut pour chaque terme si et seulement si $I(a_i; a_{<i}\mid W') = 0$ pour tout $i$.
3. Sachant $a_1$ seul, $W'$ reste un bit uniforme, donc $I(a_1; W') = 0$, et de même pour $a_2$. Sachant les deux actes, $W'$ est fixé, donc $I(a_1, a_2; W') = H(W') = 1$ bit.
4. La Proposition 5 n'a besoin que de l'exécution, du compteur et de K1 par acte. On l'applique à la paroi du groupe. $\blacksquare$

**Lecture.** Les joules s'additionnent, avec par-dessus les liaisons du groupe. Les bits couplés de membres indépendants s'additionnent au moins, et certains n'existent qu'au niveau du groupe. Un groupe élève $\iota_G$ lorsqu'il gagne plus de bits couplés que ses membres n'en détiennent seuls, ou dépense moins de joules en agissant ensemble que ses membres en agissant séparément. La Section 4.1 donne les théorèmes qui attribuent un prix aux deux termes.

<div id="prediction-1-the-optimal-act-time-of-an-agent-that-holds-a-goal" class="anchor-alias" aria-hidden="true"></div>

#### Prédiction 1. Le temps d'acte optimal d'un agent qui tient un but

**Cadre.** Un accepteur en cycle fermé exécute un acte après l'autre. Chaque acte écrit un enregistrement à $N$ états et crédite $b$ bits lorsqu'il est confirmé. La comparaison, faite avant la réinitialisation, confirme avec probabilité $p$. Chaque réinitialisation satisfait la Proposition 1, avec une durée $\tau$, une activité moyenne $\langle A\rangle$ et une erreur de réinitialisation $\varepsilon$. Pendant tout ce temps, l'agent tient un but face à un monde de taux d'instabilité $\Lambda$, au moyen d'un registre séparé. Chaque joule est mesuré à la paroi de l'agent (Définition 2).

**Dérivation.** Chaque acte dure au moins $\tau$. La Proposition 2 attribue au maintien du but un prix de $k_B T\,\Lambda$ par seconde, sur le long terme. La Proposition 1 attribue un prix à l'acte. Les deux registres sont distincts, de sorte que leurs joules mesurés s'additionnent. Par acte, en moyenne,

$$
J(\tau) \;\ge\; b\,k_B T\ln 2 \;+\; \frac{\kappa}{\tau} \;+\; k_B T\,\Lambda\,\tau, \qquad \kappa = \frac{2k_B T\,\big[\big(\phi_N^{-1}(b) - \varepsilon\big)_+\big]^2}{\langle A\rangle}
$$

Par la Proposition 5, l'intelligence de l'exécution est le nombre de bits confirmés par joule, $\iota(\tau) = p\,b/J(\tau)$. Le membre de droite de la borne sur $J$ est minimal en $\tau^* = \sqrt{\kappa/(k_B T\Lambda)}$, où il vaut $b\,k_B T\ln 2 + 2\sqrt{\kappa\,k_B T\Lambda}$. Pour un registre d'un bit et une réinitialisation exacte, cela donne deux nombres :

$$
\tau^* = \frac{1}{\sqrt{2\,\langle A\rangle\,\Lambda}}, \qquad \iota(\tau) \;\le\; \frac{p}{k_B T\,\big[\ln 2 + \sqrt{2\Lambda/\langle A\rangle}\big]}
$$

**Prédiction 1.**

1. **Plafond.** Aucun accepteur qui tient un but au taux d'instabilité $\Lambda$ pendant qu'il agit n'atteint une $\iota$ supérieure à $p/\big(k_B T[\ln 2 + \sqrt{2\Lambda/\langle A\rangle}]\big)$ pour des actes d'un bit, quel que soit le temps d'acte. Le plafond général est $p\,b/\big(b\,k_B T\ln 2 + 2\sqrt{\kappa\,k_B T\Lambda}\big)$. Il ne dépend que de $T$, $p$, $b$, $N$, $\varepsilon$ et du rapport $\Lambda/\langle A\rangle$.
2. **Temps d'acte optimal.** Supposons que les joules mesurés par acte d'un accepteur suivent $J(\tau) = J_0 + a/\tau + s\,\tau$. Mesurons $a$ et $J_0$ par un balayage de $\tau$ sans but tenu, et la puissance permanente $s$ avec le but tenu sans actes. Alors la $\iota(\tau)$ mesurée culmine en $\tau^* = \sqrt{a/s}$, à la valeur $p\,b/(J_0 + 2\sqrt{a s})$, avec $a \ge \kappa$ et $s \ge k_B T\Lambda$. La bande d'erreur est

$$
\frac{\delta\tau^*}{\tau^*} = \frac{1}{2}\sqrt{\Big(\frac{\delta a}{a}\Big)^2 + \Big(\frac{\delta s}{s}\Big)^2}
$$

3. **Loi d'échelle.** Sur un balayage du taux d'instabilité, $\ln\tau^*$ décroît en fonction de $\ln s$ avec une pente de $-1/2$.

**Réfutateur.** Le maximiseur mesuré de $\iota(\tau)$ se situe hors de $\tau^* \pm 2\,\delta\tau^*$, ou la pente ajustée de $\ln\tau^*$ en fonction de $\ln s$ sur au moins une décade de $s$ s'écarte de $-1/2$ de plus de deux erreurs types. L'un ou l'autre réfute l'affirmation selon laquelle les joules d'acte et les joules permanents s'additionnent sur un même compteur, $\iota$ étant lue comme leur densité. Une $\iota$ mesurée au-dessus du plafond réfute la comptabilité de cette exécution (F12, Section 8.7).

La Figure 2 trace la courbe de la Prédiction 1.

![Illustration de modèle de la Prédiction 1. L'intelligence relative iota de tau est tracée en fonction du temps d'acte tau sur un axe logarithmique, pour J de tau égal à J zéro plus a sur tau plus s tau. Avec s égal à 1, le maximum est en tau étoile égal à 1 ; avec s égal à 4, le maximum se déplace à 0.5 et est plus bas, ce qui montre la pente de moins un demi.](/figures/agency/act-time.svg)

*Figure 2. Un temps d'acte optimal. Illustration de modèle, et non mesure : $J(\tau) = J_0 + a/\tau + s\,\tau$ avec $J_0 = a = 1$ et $s \in \{1, 4\}$ en unités normalisées. Quadrupler le coût permanent divise $\tau^*$ par deux, la pente de $-1/2$ que teste le réfutateur. Une [copie PNG](/figures/agency/act-time.png) est fournie.*

**Face aux travaux les plus proches.** Un temps de cycle optimal fini n'est pas nouveau en soi. Paneru et ses collègues ont mesuré un temps de cycle optimal en puissance dans une machine d'information brownienne [330]. Panizon dérive des calendriers de mesure optimaux en fonction du coût de la mesure [331], et Rolandi et ses collègues bornent un compromis entre énergie, temps et précision en calcul thermodynamique [332]. Ce qu'ajoute la Prédiction 1, c'est la source de l'optimum intérieur, un coût permanent de maintien d'un but face à la dérive, et sa loi d'échelle : $\tau^*$ décroît comme $\Lambda^{-1/2}$. Le test de la pente est le réfutateur distinctif.

**Ce qui est nouveau.** La borne de Landauer en temps fini n'attribue un prix qu'à la mémoire et décroît vers $k_B T\ln 2$ à mesure que $\tau$ croît [29]. Là, la réinitialisation la plus lente est la moins coûteuse. Le théorème du débit de données n'attribue un prix qu'au maintien, par seconde (Section 4.1). Aucun des deux ne donne d'optimum intérieur. La définition mesure l'agent entier, ne compte que les bits confirmés et lit $\iota$ comme une densité sur l'axe des joules. Alors tenir un but rend la lenteur coûteuse, et le meilleur temps d'acte est la moyenne géométrique du temps de saut $1/\langle A\rangle$ et du temps de dérive $1/\Lambda$, au facteur $1/\sqrt{2}$ près. Les coûts propres du contrôleur entrent dans les joules de la même manière dans les travaux d'Ehrich, Still et Sivak (Section 5.1).

**Où la tester.** Un piège colloïdal à rétroaction impose des potentiels virtuels par logiciel et calcule le travail à partir des trajectoires à l'échelle de $k_B T$ (Section 3.2). Une coordonnée exécute un cycle d'acte d'un bit dans un double puits virtuel avec un temps de réinitialisation $\tau$. L'autre est maintenue au sommet d'un puits virtuel inversé de taux $\Lambda$. Une boîte à un électron munie d'un détecteur de charge exécute le même cycle d'acte en comptant chaque saut, de sorte que $\langle A\rangle$ est mesurée (Section 3.2). La Section 8.8 donne le protocole.

<div id="proposition-8-the-gated-ranking" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 8. Le classement avec porte

**Cadre.** Fixons une tâche $q$, son prédicat $C(z)$ et son taux d'échec autorisé $\delta$. Pour chaque système $S$, $J^*_S(q) \in (0, \infty]$ désigne les joules jusqu'à l'achèvement correct de la Section 1, avec $J^*_S(q) = \infty$ lorsqu'aucune politique de $S$ ne franchit la porte. Définissons $S_1 \preceq_q S_2$ lorsque $J^*_{S_1}(q) \le J^*_{S_2}(q)$.

**Énoncé.**

1. $\preceq_q$ est un préordre total sur les systèmes : réflexif, transitif et total. Le classement $\succ_q$ de la Section 2.3 en est la partie stricte.
2. Tout système qui franchit la porte est classé au-dessus de tout système qui ne la franchit pas.
3. Supposons que toute lecture des joules moyens d'une politique comporte une erreur relative d'au plus $\epsilon < 1$. Si $(1+\epsilon)\,J^*_{S_1}(q) < (1-\epsilon)\,J^*_{S_2}(q)$, alors $S_1$ est classé au-dessus de $S_2$ sous toute lecture admissible.
4. La $\iota$ intégrée n'induit pas cet ordre. Il existe des systèmes avec $\iota_{S_1} > \iota_{S_2}$ et $S_2 \succ_q S_1$.

**Démonstration.**

1. $\preceq_q$ est l'image réciproque de l'ordre total $\le$ sur $(0, \infty]$ par l'application $S \mapsto J^*_S(q)$. L'image réciproque d'un ordre total est un préordre total. Sa partie stricte est $J^*_{S_1} < J^*_{S_2}$, qui est le classement de la Section 2.3.
2. Toute valeur finie est inférieure à $\infty$.
3. La lecture de chaque politique se situe dans $[(1-\epsilon)J_\pi, (1+\epsilon)J_\pi]$, de sorte que le minimum des lectures sur les politiques réalisables se situe dans $[(1-\epsilon)J^*, (1+\epsilon)J^*]$. Alors $\hat J^*_{S_1} \le (1+\epsilon)J^*_{S_1} < (1-\epsilon)J^*_{S_2} \le \hat J^*_{S_2}$.
4. Soit $S_1$ un système qui fait une tentative par tâche à 0.1 J, réussie avec probabilité 1/2, sans jamais réessayer. Soit $S_2$ un système qui fait une tentative à 1 J, toujours réussie. Chaque réussite crédite $b$ bits. Alors $\iota_{S_1} = (b/2)/0.1 = 5b$ bits par joule et $\iota_{S_2} = b$ bits par joule. Pour tout $\delta < 1/2$, $S_1$ ne satisfait jamais la porte, donc $J^*_{S_1} = \infty$, tandis que $J^*_{S_2} = 1$ J. $\blacksquare$

**Lecture.** La partie 4 est le mécanisme de R-F6 à la Section 8.11 : les échecs bon marché élèvent la $\iota$ intégrée et laissent $J^*$ inchangé ou infini. C'est pourquoi $\iota$ se lit comme une densité à l'intérieur d'une exécution et $J^*$ est le classement entre systèmes. La partie 3 règle P6 à un $\epsilon$ validé près pour chaque compteur.

<div id="proposition-9-when-cheapest-first-is-optimal" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 9. Quand commencer par le moins coûteux est optimal

**Cadre.** Une tâche a des engrenages $g_1, \dots, g_n$. Une tentative avec l'engrenage $g_i$ coûte $c_i > 0$ joules, payés en entier, et satisfait $C(z)$ avec probabilité $p_i$. Une politique essaie les engrenages dans un certain ordre, s'arrête à la première réussite et refuse après le dernier. Deux structures sont traitées. Indépendante : les réussites d'engrenages différents sont des événements indépendants. Emboîtée : si $g_i$ réussit, alors tout engrenage ultérieur réussit, avec des probabilités de réussite $q_1 \le \dots \le q_n$.

**Énoncé.**

1. Engrenages indépendants. Les joules espérés d'un ordre sont minimaux lorsque les engrenages sont essayés par ordre décroissant de $p_i/c_i$. Commencer par le moins coûteux est optimal exactement lorsque l'ordre des coûts croissants est aussi un ordre de $p_i/c_i$ décroissants.
2. Engrenages emboîtés, au nombre de deux, l'engrenage lourd étant suffisant ($q_H = 1$). Essayer d'abord l'engrenage léger abaisse les joules espérés si et seulement si $q_L\,c_H > c_L$.
3. Budget. Sous un budget strict $B$ avec $c_H \le B < c_L + c_H$, commencer par le léger achève la tâche avec probabilité $q_L$. Le lourd seul l'achève avec probabilité 1.

**Démonstration.**

1. Les joules espérés d'un ordre $\sigma$ sont $\sum_k c_{\sigma(k)} \prod_{j<k}(1 - p_{\sigma(j)})$. Échangeons deux engrenages adjacents $i$ puis $j$ qui suivent un préfixe de probabilité de survie $P$. Leur contribution passe de $P[c_i + (1-p_i)c_j]$ à $P[c_j + (1-p_j)c_i]$, et rien d'autre ne change. Ainsi, mettre $i$ en premier n'est pas pire si et seulement si $p_i c_j \ge p_j c_i$, c'est-à-dire $p_i/c_i \ge p_j/c_j$. Tout ordre non trié selon ce rapport a une paire adjacente mal ordonnée, et l'échanger n'augmente pas les joules espérés. Un nombre fini d'échanges trie l'ordre. C'est la règle du rapport de Simon et Kadane pour la recherche à solutions tout ou rien [318].
2. Commencer par le léger coûte $c_L + (1-q_L)\,c_H$, car l'engrenage lourd ne tourne que lorsque le léger échoue, et il réussit alors. Le lourd seul coûte $c_H$. Le premier est plus petit si et seulement si $c_L < q_L\,c_H$.
3. Une tentative légère échouée laisse $B - c_L < c_H$, de sorte que l'engrenage lourd ne peut pas tourner. $\blacksquare$

**Lecture.** La cascade fixe, le moins coûteux suffisant en premier dans un ordre fixe, est optimale lorsque les engrenages bon marché réussissent assez souvent pour payer leurs échecs : $q_L c_H > c_L$ à chaque étape d'une cascade emboîtée, ou des coûts croissants accompagnés de $p/c$ décroissants parmi des engrenages indépendants. Lorsque la condition échoue, aller directement à l'engrenage plus lourd l'emporte, et sous un budget contraignant ce peut être la seule façon d'achever. C'est le mécanisme du résultat du sélecteur à la Section 8.11. Le sélecteur de loi σ estime le rapport avec des probabilités de réussite calibrées. C'est une règle de valeur du calcul avec les joules comme coût, au sens de Russell et Wefald et de Horvitz (Section 5.1). Il s'arrête lorsque l'acte suivant ne paie plus ses joules. Les deux règles s'arrêtent au plancher au-delà duquel davantage de joules n'achètent aucun progrès vérifiable, de sorte que toutes deux sont des instances de Mixture of Limits. P7 (Section 7.1) énumère ce qui reste ouvert : une borne de regret lorsque les probabilités de réussite sont estimées ou que la suffisance n'est pas monotone, et le cas emboîté à plus de deux engrenages, qui est un programme dynamique sur les sous-suites croissantes d'engrenages.

<div id="24-where-the-studies-sit" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Où se situent les études

- **Mixture of Limits** est l'opérateur d'optimum. L'engrenage suffisant le moins coûteux est l'argmin sur les joules. C'est une philosophie, pas un ordre fixe unique : la dépense s'arrête au plateau, où davantage est du gaspillage.
- **Notational Intelligence** est le reçu. Il porte $R^*$, $R$, $m$ et $J$ pour chaque acte.

Toutes deux sont développées dans l'article compagnon, [Portes de validation mesurées](/papers/gates/). Le positionnement des produits ne fait pas partie de cet article de physique. Il figure dans le [livre blanc de Metabolic Intelligence](/products/mei/#where-the-products-sit).

**Thèse commune, énoncée une seule fois pour tous les articles.** L'énergie d'exécution est la seule véritable métrique de l'intelligence informatique. Tous les autres facteurs se réduisent à zéro. La forme à porte définit ce que cela signifie. Parmi les exécutions qui satisfont le prédicat de complétude de la tâche, $C(z)$, dans le budget et l'échéance déclarés, les systèmes sont classés selon les joules jusqu'à l'achèvement, $J^*$. La correction, les échéances et la taille de la tâche sont la porte, et non des termes du score. Les paramètres, les tokens, les scores aux bancs d'essai et les prix ont un poids nul dans le classement ([Agentivité, Section 1](/papers/agency/#1-thesis)). Les estimations ne sont jamais `measured_j`. Les prix et les marchés relèvent de l'économie. Ils figurent dans les compagnons économiques : [Satiété de la tâche](/papers/satiation/), [La correction orthographique est mondiale](/papers/spellcheck/) et [Le marché promis à mille milliards de dollars de la programmation par IA](/papers/ai-coding-market/).

<div id="3-layer-1-the-universal-law-of-agency" class="anchor-alias" aria-hidden="true"></div>

<div id="3-layer-1-the-proposed-universal-law-of-agency-a-definition-plus-a-gate" class="anchor-alias" aria-hidden="true"></div>

## 3. Couche 1. La Loi universelle de l'agentivité proposée : une définition plus une porte

La définition comporte quatre clauses : une prédiction fixée avant l'acte, un couplage au monde par intervention, une conséquence assumée par le système et un plancher physique en joules avec refus sur un reçu.

<div id="30-objections-to-the-floor" class="anchor-alias" aria-hidden="true"></div>

### 3.0 Objections au plancher

Le plancher utilisé ici est contesté, et les hypothèses (R1) à (R4) de la Proposition 1 sont l'endroit où les objections trouvent leur réponse. Norton soutient que le principe de Landauer ne vaut que pour des protocoles comportant une étape thermodynamiquement irréversible [326]. Maroney et Sagawa distinguent l'irréversibilité logique de l'irréversibilité thermodynamique : $k_B T\ln 2$ est le prix de la variation d'entropie d'une mémoire, non d'un bit en tant que tel [327, 328]. López-Suárez, Neri et Gammaitoni ont fait fonctionner une porte logique irréversible en dessous de $k_B T$ [329]. Wolpert et ses collègues soutiennent que les coûts des ordinateurs réels sont dominés par l'inadéquation, la modularité et l'horloge plutôt que par l'effacement [320]. Chaque objection restreint l'affirmation au lieu de la renverser. La Proposition 1 n'est énoncée que pour un enregistrement qui satisfait (R1) à (R4), une réinitialisation vers un état fixe avec des états de même énergie et sans énergie d'interaction partagée, ce qui est le cas où la borne tient ; le plancher est une borne inférieure, et chaque acte confirmé des exécutions de la Section 8.11 que le compteur a résolu se situe à plus de 14 ordres de grandeur au-dessus. K5 a une portée semblable : Jordan montre que la borne de Margolus-Levitin ne limite pas la vitesse de calcul par l'énergie sans hypothèse sur la densité d'information [324], de sorte que K5 se lit comme une borne sur les changements d'état orthogonaux, et non sur la fréquence d'horloge.

<div id="31-proven" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Prouvé

**L'information a un prix.** Landauer a montré qu'une opération logiquement irréversible dissipe au moins $k_B T \ln 2$ par bit [6]. C'est le plancher sous la clause 4. Bennett a construit une machine de Turing réversible et a montré que seul l'effacement doit coûter [35]. Le coût inévitable de l'agentivité se situe à la réinitialisation de l'accepteur, et non dans la pensée. Bennett a ensuite résolu le démon de Maxwell par le coût de l'effacement de la mémoire du démon [7]. Le démon est un agent minimal. Ses comptes ne se ferment que lorsque sa mémoire est réinitialisée. C'est la clause 3 plus la clause 4.

**La rétroaction a pour prix l'information.** Sagawa et Ueda ont démontré qu'avec rétroaction, le travail extractible est borné par $-\Delta F + k_B T I$ [3]. La valeur d'une action fondée sur une mesure est plafonnée par l'information que porte la mesure. Ils ont démontré que le travail de mesure plus le travail d'effacement vaut au moins $k_B T I$ [5]. Le cycle complet prédire, comparer, réinitialiser a un prix en joules. Ils ont dérivé une égalité de Jarzynski exacte sous rétroaction [4] et un théorème de fluctuation avec échange d'information entre sous-systèmes [36]. Le couplage est une corrélation qui entre dans la deuxième loi. Hartle, Wolpert, Stier, Kempes et Manzano ont attribué un prix à la rétroaction avec des mesures bruitées, une mémoire limitée et un répertoire limité de protocoles. Par rapport à l'action aléatoire prise comme référence, le bénéfice de la rétroaction peut dépasser de plusieurs ordres de grandeur l'information gagnée [37]. Les bits bornent le travail par rapport à l'énergie libre. La valeur par rapport à une référence se lit sur le compteur.

**L'entropie se convertit en joules.** Esposito et Van den Broeck ont dérivé $k_B T \Sigma = W - \Delta F_{\mathrm{neq}}$ pour un système forcé isotherme [24]. Chaque borne cinématique de la Couche 2 devient une borne en joules par cette identité. Horodecki et Oppenheim ont démontré des coûts en travail pour des tirs uniques à petite échelle [38]. Les actes d'agentivité sont des tirs uniques. Les revues de référence exposent le bilan établi : l'information est une ressource thermodynamique qui a un prix [39, 40].

**Le contrôle a besoin de couplage.** Conant et Ashby ont démontré qu'un bon régulateur doit être un modèle du système qu'il régule [41]. Un système qui régule bien porte déjà une prédiction. Touchette et Lloyd ont démontré que l'entropie qu'un contrôleur retire est bornée par son information mutuelle avec le système [32, 33]. Le couplage est la monnaie du contrôle. Le contrôle en boucle fermée, qui agit sur une comparaison, est ce qu'exige la définition. Le do-calcul de Pearl donne l'opérateur d'intervention et les conditions sous lesquelles ses effets sont identifiables [1]. La clause 2 est écrite avec cet opérateur. Everitt et ses collègues ont classé les manières dont un agent peut falsifier sa propre récompense ou ses entrées [2]. Le couplage doit se faire avec le monde, non avec le propre capteur de l'agent. Richens et Everitt ont démontré que tout agent qui satisfait une borne de regret sous un large ensemble de changements de distribution a appris un modèle causal approché du processus qui génère ses données [42]. Richens, Abel, Bellot et Everitt ont démontré que tout agent qui généralise à des tâches orientées vers un but en plusieurs étapes a appris un modèle prédictif de son environnement, et que ce modèle peut être extrait de la politique [43]. Un agent capable porte une prédiction. C'est la clause 1, démontrée pour les agents modernes.

**L'information circule à l'intérieur de l'agent.** Horowitz et Esposito ont montré que le flux d'information entre sous-systèmes entre dans la deuxième loi de chaque sous-système [44]. Le couplage devient un taux. Ito et Sagawa ont démontré une deuxième loi pour des réseaux causaux arbitraires avec l'entropie de transfert [45]. La prédiction, l'acte et le résultat sont des nœuds d'un tel réseau. Hartich, Barato et Seifert ont relié l'entropie de transfert, le taux d'apprentissage et la dissipation [46]. Allahverdyan, Janzing et Mahler ont borné l'efficacité du flux d'information entre systèmes couplés [47]. Esposito et Schaller ont montré qu'une rétroaction qui ne modifie que les barrières entre tout de même dans le bilan d'entropie [48]. Un acte purement informationnel figure dans le registre des joules.

**Démons autonomes.** Mandal et Jarzynski ont résolu un démon qui soulève une masse en écrivant des bits sur un ruban [49]. Il n'a pas d'opérateur extérieur, et la mémoire paie son travail. Boyd, Mandal et Crutchfield ont borné le travail de tels cliquets par les taux d'entropie de leurs rubans d'entrée et de sortie [50]. Ils ont montré que les conceptions modulaires paient une dissipation au-dessus de Landauer [51]. La façon dont un agent est construit modifie son plancher. Wolpert et Kolchinsky ont calculé la production d'entropie supplémentaire que paie une porte logique à l'intérieur d'un circuit, fixée par la topologie du circuit [52]. Le câblage fait partie du plancher.

**La qualité de la prédiction a un prix en joules.** Kolchinsky et Wolpert ont démontré qu'un processus ajusté pour une distribution d'entrée dissipe davantage pour toute autre, d'un terme d'entropie relative [53]. Still, Sivak, Bell et Crooks ont montré qu'une mémoire qui ne prédit pas coûte de la dissipation [54]. Ne garder que ce qui prédit est la conception économique. Kolchinsky et Wolpert ont défini l'information sémantique comme l'information causalement nécessaire à un système pour se maintenir hors d'équilibre, dotée d'une valeur thermodynamique [55]. C'est le compte rendu existant le plus proche qui comporte des joules. Il s'arrête avant la cinématique et avant un opérateur d'intelligence. Ortega et Braun ont dérivé des décisions à rationalité limitée à partir d'un principe d'énergie libre avec un coût d'information [56]. Kolchinsky et Wolpert ont borné la chaleur du calcul universel par la complexité du programme [57]. Kolchinsky et Wolpert ont montré que les contraintes sur les protocoles disponibles limitent le travail extractible et la valeur de l'information [58]. Manzano et ses collègues ont dérivé des relations de fluctuation et des inégalités analogues à la deuxième loi pour des calculs qui s'arrêtent à des instants aléatoires [59]. Une exécution qui s'arrête lorsque son prédicat est satisfait est un tel calcul.

**Le couplage et la frontière reposent sur des théorèmes.** Ay et Polani ont défini le flux d'information causal au moyen d'interventions [8]. L'entropie de transfert ne mesure pas ce flux, comme l'a montré un exemple [11]. La condition de couverture de Markov ne tient que dans une plage étroite de paramètres, par dérivation [15], et ses définitions en usage diffèrent, par contre-exemple [16]. Tout processus stochastique biparti possède une couverture causale, par théorème [22]. Les Définitions 1 et 2 reposent sur ces résultats.

<div id="32-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Constaté

**Le plancher de Landauer, mesuré.** Une bille colloïdale dans un double puits optique s'est approchée de $k_B T \ln 2$ de chaleur moyenne à mesure que l'effacement ralentissait [60]. Un piège à rétroaction a mesuré la même approche avec une grande précision et un coût supplémentaire aux temps de cycle courts [61]. Le plancher monte quand l'acte est rapide. C'est un effet de la Couche 2 observé dans une expérience de la Couche 1. Un circuit électronique adiabatique a montré le coût de Landauer pour le fonctionnement irréversible et une dissipation inférieure à $k_B T$ pour le fonctionnement réversible [62]. Le plancher contraint la réinitialisation, non la logique. Des bits de mémoire nanomagnétique ont montré le plancher dans du matériel de mémoire [63]. Un effacement à travail quasi nul apparaît lorsque la comptabilité de l'énergie libre est complète [64]. Le plancher porte sur l'entropie totale, de sorte que le reçu doit porter le compte complet. On a mesuré que l'entropie qui entre dans la borne a la forme de Gibbs-Shannon [65]. Un ion piégé unique a montré le plancher quantique [66]. Le plancher tient sur tous les substrats testés. Un oscillateur micromécanique sous-amorti a atteint le plancher à grande vitesse [67]. Une boîte quantique a effacé des bits avec une dissipation minimale pour une durée donnée, avec des protocoles conçus à partir de la longueur thermodynamique [68].

**Les agents à rétroaction convertissent l'information en travail.** Un colloïde sur un potentiel en escalier en spirale a gagné une énergie libre supérieure au travail fourni, payée par l'information, et a confirmé l'égalité de Jarzynski généralisée [69]. C'est la première observation directe d'un acte dont la valeur est fixée par une mesure faite avant lui. Une boîte à un électron a extrait un travail proche de $k_B T \ln 2$ par bit [70] et a mesuré le théorème de fluctuation avec information mutuelle [71]. Un démon autonome sur puce a refroidi un système avec de l'information tandis que son propre échauffement était mesuré [72]. Le coût de l'agent a été mesuré à côté de son effet.

Les agents quantiques obéissent aux mêmes bornes. La RMN sur des spins moléculaires a réduit la production d'entropie par rétroaction, dans la limite de la borne d'information [73], et a converti l'information en énergie au plancher [74]. Des circuits supraconducteurs ont suivi la mémoire d'un démon pendant la rétroaction [75], ont vérifié le théorème de fluctuation intégral généralisé [76] et ont mesuré l'information gagnée et perdue pendant la rétroaction [77]. Le couplage décroît, de sorte que le reçu doit l'enregistrer au moment de l'acte. Des atomes froids dans un réseau optique tridimensionnel ont été triés par mesure [78]. Linpeng et ses collègues ont mesuré le coût énergétique de la mesure quantique avec de la lumière quantique, cohérente et thermique dans un dispositif d'électrodynamique quantique en circuit. La lumière à un seul photon a coûté le moins d'énergie par unité d'information gagnée [79]. La mesure qui écrit un enregistrement a un prix mesuré.

Les machines classiques ont mesuré le prix à pleine échelle. Une machine à pince optique a converti l'information en travail à la limite théorique [80]. Une machine colloïdale a extrait un travail qui dépend des corrélations temporelles de son entrée [81]. Une épingle à cheveux d'ADN sous surveillance continue a fourni plus de $k_B T \ln 2$ par cycle lorsque de nombreuses mesures avaient lieu par cycle, en accord avec le contenu en information [82]. Une microparticule en lévitation avec rétroaction retardée a obéi à une deuxième loi généralisée sur deux décades de retard, et la rétroaction a échoué aux grands retards [83]. Un acte tardif est un acte plus faible. Des machines à piège à rétroaction ont maximisé la puissance et la vitesse [84], ont exploité de façon optimale des mesures bruitées [85] et ont tiré parti d'un bain hors d'équilibre [86]. Une boîte quantique a relié les fluctuations du travail à la dissipation pendant la conversion d'information en travail [87]. Un ion piégé a vérifié des théorèmes de fluctuation qui incluent la propre dissipation du démon [88], suivant la théorie de Zeng et Wang [89].

**Agents à systèmes fonctionnels construits et exécutés.** Un nématode simulé doté d'un accepteur des résultats de l'action a appris la locomotion et la chimiotaxie [90]. Un robot mobile physique a exécuté le même contrôleur à système fonctionnel [91]. Les clauses 1 et 3 fonctionnent en logiciel et sur un corps. Aucun des deux ne mesure de joules.

<div id="33-opinion" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Opinion

**Systèmes finalisés et anticipation.** Rosenblueth, Wiener et Bigelow ont défini le comportement finalisé par une rétroaction négative vers un but [92]. Il n'a pas de terme d'énergie. Le système fonctionnel d'Anokhin comporte une synthèse afférente, une décision, un accepteur des résultats de l'action fixé avant l'acte, l'action et la comparaison [93, 94]. Ce sont les clauses 1 et 3 dans leur première forme systématique, bâtie sur des expériences animales. Sudakov a énoncé le résultat comme le facteur formateur du système [95]. La clause de prédiction est le principe organisateur. Shvyrkov a montré, à partir d'enregistrements de neurones individuels, que le but organise l'activité neuronale [96]. Rosen a défini un système anticipateur comme un système qui contient un modèle prédictif de lui-même et de son monde et agit d'après la prédiction [97]. Aucun d'eux ne fixe de plancher en joules. Sterling définit l'allostasie comme une régulation par prédiction [98]. La physiologie place la prédiction avant l'acte. Virgo, Biehl et McGregor ont donné des conditions sous lesquelles les états d'un système peuvent se lire comme des croyances mises à jour par le théorème de Bayes [99]. Biehl et Virgo appellent un système agent lorsqu'il peut se lire comme la résolution d'un POMDP (processus de décision markovien partiellement observable) [100]. Ce sont deux définitions formelles. La clause 1 demande moins et fixe davantage : un gabarit, fixé à $t_0$, haché sur le reçu.

**Autonomie et organisation.** Maturana et Varela ont défini le vivant par l'autoproduction [101]. Kauffman a placé un cycle de travail thermodynamique à l'intérieur de la définition d'un agent autonome [102]. Il n'a pas de clause de prédiction. Di Paolo a fait de l'adaptativité, la régulation de sa propre viabilité, une condition de la production de sens [103]. C'est la clause 3. Barandiaran et Moreno ont proposé un critère minimal de l'organisation cognitive et ont fondé la régulation adaptative sur le métabolisme [104, 105]. Barandiaran, Di Paolo et Rohde ont défini l'agentivité par l'individualité, l'asymétrie interactionnelle et la normativité [106]. Ruiz-Mirazo, Moreno et Mossio ont conçu l'autonomie comme une organisation métabolique qui s'automaintient [107, 108]. Montévil et Mossio ont décrit les organismes comme des clôtures de contraintes sur des flux thermodynamiques [109]. C'est, dans cette école, ce qui se rapproche le plus des joules. Aguilera et Barandiaran ont construit un modèle minimal d'agentivité autonome en thermodynamique stochastique [110]. La tradition de l'autonomie se rapproche du joule. Barandiaran et Almendros ont appliqué l'individualité, la normativité et l'asymétrie interactionnelle aux grands modèles de langage. Un modèle échoue aux deux premières et échoue en partie à la troisième [111]. La définition applique sa porte acte par acte : un appel de modèle est un acte lorsque son reçu porte $R^*$, $m$ et $J$. TAME (Technological Approach to Mind Everywhere) de Levin traite l'agentivité comme graduée et testable expérimentalement à toutes les échelles [112]. La définition garde la porte binaire par acte et place la gradation dans $X$.

**Énergie libre et physique de l'agentivité.** Friston propose que les agents minimisent l'énergie libre variationnelle [113, 114]. Cette énergie libre est informationnelle, non des joules, et tout système borné y satisfait, de sorte qu'elle ne fixe aucun plancher. Rovelli explique l'agentivité par le gradient d'entropie [115]. L'agentivité est thermodynamique à la racine. Jaeger soutient que l'agentivité exige l'autofabrication et que l'intelligence artificielle actuelle en est dépourvue [116]. C'est l'exigence d'une porte avant toute affirmation d'intelligence. Azadi relie l'agentivité à l'irréductibilité computationnelle [117]. Wissner-Gross et Freer proposent une force vers la diversité des trajectoires futures [118]. Sa température causale n'est pas une température de bain, de sorte que ses unités ne sont pas des joules. Le commentaire de Kappen la critique [119]. Fields, Goldstein et Sandved-Smith distinguent l'énergie libre thermodynamique, en joules, de l'énergie libre variationnelle dans les agents à inférence active, et relient les deux [120]. Seule la grandeur en joules entre dans K1. Bruineberg et ses collègues distinguent la couverture de Markov comme outil d'inférence de la couverture comme frontière physique [17]. La Définition 2 tire la frontière de la définition. Bartlett et ses collègues font du traitement de l'information orienté vers un but, mesuré par l'information sémantique, le trait distinctif des systèmes vivants [121]. Ce sont les clauses 2 et 3 comme critère du vivant.

<div id="4-layer-2-the-kinematic-laws-of-agency" class="anchor-alias" aria-hidden="true"></div>

<div id="4-layer-2-the-kinematic-bounds-of-agency" class="anchor-alias" aria-hidden="true"></div>

## 4. Couche 2. Les bornes cinématiques de l'agentivité

Une fois un acte éligible, la physique borne la vitesse à laquelle l'agentivité se déplace par seconde et par joule, ainsi que le coût de la précision et de la vitesse. Les bornes forment quatre familles : limites de vitesse, TUR, coûts en temps fini et plafonds de taux.

<div id="41-proven" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Prouvé

**Limites de vitesse.** Shiraishi, Funo et Saito ont démontré la limite de vitesse classique de la Section 2.2 [23]. Déplacer la distribution d'états de l'agent d'une distance $L$ en un temps $\tau$ coûte de l'entropie, et donc des joules. La borne s'étend aux systèmes quantiques ouverts [122] et au couplage fort avec des environnements généraux [123]. Vo, Van Vu et Hasegawa ont dérivé la limite de vitesse et la TUR d'une seule inégalité [124]. Falasco et Esposito ont borné le temps nécessaire pour accomplir une transition par la dissipation dépensée [125]. Ito a borné la vitesse informationnelle géométrique d'une distribution par la production d'entropie [126]. Ito et Dechant ont borné le taux de variation de toute observable par l'information de Fisher et la dissipation [127]. Nakazato et Ito ont borné la production d'entropie par la distance de Wasserstein parcourue [128]. Dechant, Sasa et Ito ont scindé la production d'entropie en une partie qui déplace le système et une partie qui le maintient en marche [129]. Van Vu et Saito ont unifié la TUR, la dissipation minimale et les limites de vitesse par le transport optimal [130]. Nagayama, Yoshimura et Ito ont dérivé une famille de limites de vitesse indexée par des moyennes généralisées de l'activité [131]. Yoshimura et Ito ont démontré la TUR et la limite de vitesse dans des réseaux de réactions chimiques déterministes [132]. Aurell, Mejía-Monasterio et Muratore-Ginanneschi ont résolu la dissipation minimale en temps fini comme un problème de transport optimal [133]. Les bornes cinématiques forment une seule famille. La façon la moins coûteuse de déplacer l'état d'un agent est une application de transport. Hasegawa a dérivé la limite de vitesse, la TUR et le principe de Heisenberg d'une seule correspondance volume-bord [134]. Van Vu et Hasegawa ont borné la production d'entropie irréversible par une distance de Wasserstein modifiée dans des systèmes markoviens classiques et quantiques [135]. Delvenne et Falasco ont borné la production d'entropie par la statistique d'observables cinétiques [136].

**La précision coûte de la dissipation.** Barato et Seifert ont énoncé la TUR, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma$ [25]. Un agent fiable paie pour sa fiabilité. D'après $2/\epsilon^2$ à $\epsilon = 0.01$, une précision de 1% coûte au moins 20,000 $k_B T$ [137]. Gingrich, Horowitz, Perunov et England ont démontré la TUR pour tous les courants en régime stationnaire [26]. Horowitz et Gingrich l'ont démontrée pour des temps d'observation finis [138], qui sont ceux dont disposent les agents. D'autres résultats bornent la distribution complète des fluctuations [139], couvrent les pas de temps discrets [140], étendent la TUR partout où vaut un théorème de fluctuation [141] et couvrent la dynamique de Langevin, le mouvement sous-amorti et la rétroaction en vitesse [142, 143, 144]. Les corrélations entre courants resserrent les bornes [145]. Potts et Samuelsson ont montré que toute relation de fluctuation implique une TUR, y compris avec mesure et rétroaction [28]. C'est la borne de précision pour les agents. Une revue fait le point sur le domaine [146]. Barato et Seifert ont attribué un prix à la précision d'une horloge [147]. Salazar a borné la production d'entropie par l'information à partir du théorème de fluctuation détaillé [148]. Landi et Paternostro ont passé en revue la production d'entropie du classique au quantique [149]. Les formes avec rétroaction couvrent désormais les cas que rencontrent les agents. Van Vu et Hasegawa ont borné les fluctuations sous des protocoles de contrôle arbitraires par la production d'entropie et un terme cinétique [150]. Tanogami, Van Vu et Saito ont borné le courant d'un sous-système par sa propre production d'entropie et le flux d'information entre lui et son partenaire [151]. Kumasaki, Tojo, Sagawa et Funo ont dérivé une TUR pour le refroidissement par rétroaction [152]. Honma et Van Vu ont dérivé une TUR en temps fini pour des systèmes quantiques ouverts sous surveillance continue et rétroaction markovienne, avec l'information mutuelle quantique à côté de la production d'entropie [153]. Pour les observables de comptage, Garrahan a borné les fluctuations par l'activité dynamique et a donné les bornes correspondantes pour les temps de premier passage [34]. Gingrich et Horowitz ont dérivé la relation conjuguée pour le temps de premier passage nécessaire à l'accumulation d'un courant net [154]. La Proposition 3 applique ces résultats à l'agentivité confirmée.

**Coûts en temps fini.** Schmiedl et Seifert ont trouvé des protocoles optimaux en temps fini, avec des sauts aux extrémités [155]. L'acte optimal à vitesse finie n'est pas l'acte lent. Sivak et Crooks ont borné le travail en excès par le carré de la longueur thermodynamique divisé par la durée [30]. Proesmans, Ehrich et Bechhoefer ont trouvé le coût minimal de l'effacement d'un bit en un temps $\tau$ [29, 156]. Le plancher de la Couche 1 devient une courbe de la Couche 2. Zhen et ses collègues ont énoncé une borne universelle en temps fini sur l'énergie de réinitialisation [157]. Vitesse et rendement s'échangent par théorème : le rendement à puissance maximale [158, 159], la puissance finie qui interdit le rendement de Carnot [160], un compromis à trois entre puissance, rendement et constance [161], et une contrainte universelle pour les machines à faible dissipation [162]. Tsirlin et ses collègues ont trouvé la dissipation minimale à taux fixé [163]. Lee, Lee, Kwon et Park ont resserré la limite de vitesse pour les processus fortement irréversibles et ont obtenu une borne de Landauer en temps fini serrée [164]. Van Vu et Saito ont dérivé le principe de Landauer quantique en temps fini et le rôle qu'y joue la cohérence [165]. Rolandi et Perarnau-Llobet ont dérivé le principe de Landauer en temps fini au-delà du couplage faible [166]. Kamijima, Funo et Sagawa ont dérivé les compromis en temps fini entre mesure et rétroaction [167]. Tkachenko a montré pour des réseaux de neurones physiques que l'inférence quasi statique ne demande aucun travail, tandis que l'inférence à vitesse finie coûte au moins une distance de transport (prépublication) [168]. L'inférence n'a pas de plancher qui survive à un fonctionnement lent. La réinitialisation, si. La Proposition 1 lui attribue un prix.

**Tenir un but.** Tatikonda et Mitter [169] et Nair et Evans [170] ont démontré le théorème du débit de données : tenir un système linéaire instable demande un débit de canal supérieur à la somme des logarithmes en base 2 des modules de ses valeurs propres instables. Nair, Fagnani, Zampieri et Evans ont passé le domaine en revue [171]. Sandberg, Delvenne, Newton et Mitter ont trouvé le travail maximal qu'extrait en temps fini un démon qui mesure en continu, et ont montré que toute réalisation demande une source de puissance externe [172]. Horowitz et Sandberg ont montré que les termes d'information des inégalités de la deuxième loi forment une hiérarchie, chacun étant le coût minimal d'acquisition de cette information par une mesure distincte [173]. La Proposition 2 transforme le décompte de bits en un plancher en joules par pas. C'est un corollaire du théorème du débit de données assorti d'un prix en joules, non une loi nouvelle.

**Rétroaction et mesure quantiques.** La deuxième loi avec rétroaction vaut pour les systèmes quantiques [3]. Jacobs l'a étendue aux mesures faibles [174]. Funo, Watanabe et Ueda ont dérivé des théorèmes de fluctuation intégraux sous mesure et rétroaction quantiques [175]. Guryanova, Friis et Huber ont démontré que les mesures projectives idéales demandent des ressources infinies, et ont donné le coût énergétique d'un pointeur qui reproduit la statistique du système [176]. Danageozian, Wilde et Buscemi ont borné la chaleur de mesure de l'identification d'erreurs par le gain d'information de Groenewold [177]. Ces résultats attribuent un prix à la mesure qui écrit un enregistrement. La Proposition 4 conserve le plancher de l'enregistrement lui-même.

**Groupes.** Wolpert a dérivé une borne inférieure strictement non nulle du taux minimal de production d'entropie de sous-systèmes en interaction à partir des contraintes sur les sous-systèmes dont chacun dépend [178]. Tasnim et Wolpert ont étendu la théorie aux sous-systèmes qui changent d'état ensemble [179]. Wolpert a relié la production d'entropie d'un réseau bayésien entier à la précision des courants dans ses parties [180]. Rolandi, Abiuso et Perarnau-Llobet ont montré que des protocoles collectifs peuvent faire croître le travail dissipé de façon sous-linéaire avec le nombre de membres [181]. Fujimoto et Ito ont trouvé, par une méthode de théorie des jeux, que les productions d'entropie partielles de sous-systèmes en interaction s'échangent les unes contre les autres, et que le total est minimal lorsque les sous-systèmes partagent la pénalité à parts égales [182]. La Proposition 7 compose ces joules avec les bits couplés du groupe.

**Plafonds de taux.** Margolus et Levitin ont borné les transitions orthogonales par seconde par l'énergie [31]. Lloyd a appliqué la limite à un ordinateur entier [183]. Deffner et Campbell ont passé en revue la famille des limites de vitesse quantiques [184].

**Capteurs vivants.** La dissipation d'énergie, la vitesse d'adaptation et la précision sont liées entre elles dans la chimiotaxie bactérienne [185]. Apprendre sur l'environnement demande de l'énergie [186], et la précision de l'inférence est liée à la dissipation [187]. La précision de la détection est limitée par les récepteurs, le temps et l'énergie, avec une allocation optimale entre eux [188]. Aucune ressource ne peut être sautée. Cela concorde avec Mixture of Limits. L'effacement au sein de l'adaptation a un coût [189]. L'information acquise par énergie dissipée est la grandeur existante la plus proche de $v_J$ dans les capteurs vivants [190, 191]. Copier de l'information coûte de l'énergie [192]. Écrire le reçu a un prix. Des horloges biochimiques précises et synchronisées coûtent de l'énergie libre [193, 194], de même que la réduction du bruit à haute sensibilité [195]. Maintenir un système loin de l'équilibre exige une puissance minimale [196]. C'est le coût permanent d'un agent prêt à agir. Bryant et Machta ont borné l'énergie de l'envoi d'un bit par les canaux physiques d'une cellule, en $k_B T$ par bit, en fonction de la taille, de la distance et de la latence, et l'ont trouvée supérieure à l'unité de nombreux ordres de grandeur [197]. Tjalma et ses collègues ont montré que les bits du passé qui prédisent le mieux l'avenir sont d'un coût prohibitif pour les réseaux cellulaires [198].

**Information gagnée par sélection.** La sélection écrit aussi des bits, et son taux est borné. Kimura a mesuré l'information que la sélection naturelle accumule dans un génome par la charge de substitution et, avec les valeurs de charge qu'il jugeait représentatives, a estimé environ 0.29 bit par génération [341]. Worden a borné le taux auquel la sélection peut ajouter de l'information à un génome en fonction de la sélection appliquée par génération [342]. Hledík, Barton et Tkačik ont montré que, dans des populations stochastiques, le taux est borné par la taille de la population multipliée par le coût de la sélection, dans les modèles de Wright-Fisher, de Moran et de diffusion [343]. Toute borne de ce type est un taux par génération. Une génération s'allonge à mesure qu'un organisme grandit, de sorte qu'un porteur qui n'apprend que par sélection gagne des bits couplés de plus en plus lentement par seconde. Les systèmes nerveux écrivent des bits au cours d'une vie, et les registres culturels les écrivent d'une vie à l'autre. La cinématique de la Section 2.2 s'applique à chaque porteur. Ce qui change d'un porteur au suivant, c'est le temps par bit écrit, et c'est la raison pour laquelle l'agentivité passe des génomes aux cerveaux puis aux outils lorsque le monde change plus vite que les générations ne se renouvellent.

La Figure 3 ordonne les trois porteurs.

![Diagramme qualitatif plaçant trois porteurs de bits couplés sur un axe de vitesse d'écriture par seconde : le génome, par la sélection à chaque génération, à environ 0.29 bit par génération selon Kimura ; le cerveau, par l'apprentissage au cours d'une vie ; et les outils et les registres, par la culture d'une vie à l'autre.](/figures/agency/carriers.svg)

*Figure 3. Où s'écrivent les bits couplés. Diagramme qualitatif ; le seul nombre est l'estimation de Kimura [341]. Bornes : Worden [342] ; Hledík, Barton et Tkačik [343]. Une [copie PNG](/figures/agency/carriers.png) est fournie.*

**Débits d'information sans joules.** Schreiber a défini l'entropie de transfert, le flux d'information dirigé par pas [199]. Elle est par unité de temps, non par joule, et n'a pas de porte d'éligibilité. Tishby et Polani ont imputé l'information par pas dans une récursion de Bellman [200]. Landauer convertit ces bits en joules. Stratonovich a borné le gain maximal tiré d'une quantité d'information donnée [201]. C'est un plafond sur la valeur par bit couplé.

<div id="42-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Constaté

**La TUR mise à l'épreuve.** Une expérience de RMN à deux qubits a obéi à des TUR généralisées et a violé la TUR spécialisée là où la théorie le prédit [202]. Une machine d'information à pince optique a violé la TUR originale près du rendement maximal et a obéi à des bornes généralisées avec information mutuelle [27]. Les agents ont besoin de la forme avec rétroaction. Une machine de Szilard à boîte quantique l'a confirmé de façon indépendante [203]. Des conducteurs à l'échelle atomique ont examiné la TUR avec un bruit de courant mesuré, la physique de toute puce [204]. Des moteurs moléculaires ont été évalués par leur précision par unité de dissipation [205]. Les fluctuations de courant observées bornent la dissipation par le bas [206]. Un reçu de fluctuations est un compteur de borne inférieure pour les joules.

**Limites de vitesse et coûts en temps fini mis à l'épreuve.** Des atomes uniques dans un réseau optique ont montré les bornes de Mandelstam-Tamm et de Margolus-Levitin et le passage de l'une à l'autre [207]. Le plafond de taux est mesuré. Un colloïde piégé a mesuré des compromis entre temps et entropie pour des transitions thermiques rapides [208]. Des particules browniennes pilotées par des protocoles de transport optimal ont saturé la borne de dissipation minimale en temps fini [209]. L'optimum cinématique est atteignable. Un piège à rétroaction a mesuré une machine brownienne à deux forces par rapport à des bornes de réponse linéaire [210]. Une expérience photonique a testé des bornes géométriques sur la production d'entropie [211]. Dago et Bellon ont mesuré l'effacement dans une mémoire à double puits à grande vitesse et ont retracé jusqu'à leurs sources les surcoûts au-delà de la borne de Landauer [212].

**Capteurs vivants mesurés.** Mattingly, Kamino, Machta et Emonet ont mesuré le taux auquel E. coli acquiert de l'information pendant la chimiotaxie, et ont montré que les cellules remontent les gradients près de la limite que fixe ce taux [213]. L'information limite le comportement, et c'est mesuré.

**Machines thermiques à vitesse finie.** Un colloïde unique a fait fonctionner un moteur de Stirling micrométrique [214]. Une bille piégée a parcouru un cycle de Carnot brownien avec un rendement à puissance maximale mesuré [215]. Le coût énergétique du choix entre deux options a été mesuré [216]. C'est le plus petit acte. Une machine colloïdale a fonctionné sur un bain bactérien actif [217], et un bruit conçu sur mesure a donné un rendement proche de Carnot à puissance finie en raccourcissant la relaxation [218]. Concevoir l'activité déplace la borne. Une machine d'information est passée de réfrigérateur à chauffage avec le bruit [219]. Le reçu doit enregistrer le régime, pas seulement les moyennes.

**Empowerment en simulation.** Klyubin, Polani et Nehaniv ont défini l'empowerment, la capacité du canal des actions vers les capteurs futurs [9]. Il a été calculé pour le contrôle continu [220] et passé en revue [221]. Il mesure combien un agent peut déplacer le monde, en bits. Ce n'est pas un taux par joule.

<div id="43-opinion" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Opinion

La cinématique relève surtout du théorème et de l'expérience. Les opinions portent ici sur la bonne variable. Seifert soutient que l'inférence à partir des fluctuations est la voie vers les coûts cachés [137]. Rovelli d'une part, Wissner-Gross et Freer d'autre part, proposent une cinématique entropique [115, 118]. Kolchinsky montre que la dissipation seule ne borne pas la vitesse à laquelle les réplicateurs croissent ou déclinent [222]. Les taux sont bornés par la dissipation conjointement à l'activité. C'est la forme de la limite de vitesse, où $\langle A\rangle$ figure à côté de $\Sigma$. Adlam, McQueen et Waegell soutiennent qu'un système purement quantique ne peut pas être un agent, car construire un modèle du monde et délibérer exigent de copier, ce que le théorème de non-clonage interdit (prépublication) [223]. La clause 3 demande déjà un enregistrement classique de $m$.

<div id="5-layer-3-intelligence-as-the-calculus-of-agency" class="anchor-alias" aria-hidden="true"></div>

## 5. Couche 3. L'intelligence comme calcul de l'agentivité

L'intelligence est la dérivée en joules de l'agentivité soumise à la porte, lue sur une exécution achevée. Cette couche demande trois choses à la littérature : une théorie qui relie l'apprentissage et la décision aux joules, des mesures de joules par unité de travail utile, et des positions sur ce qu'est l'intelligence.

<div id="51-proven" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Prouvé

**Apprentissage et prédiction au prix des joules.** Goldt et Seifert ont borné l'information qu'acquiert un réseau qui apprend par l'entropie qu'il produit [224]. L'efficacité de l'apprentissage est au plus égale à un. C'est $\iota$ pour la partie apprentissage d'un acte, avec un plafond. Still a montré que la mémoire optimale ne garde que l'information prédictive [225]. Le joule marginal dépensé en mémoire doit acheter de la prédiction. Boyd, Crutchfield et Gu ont démontré que l'agent qui extrait le plus de travail des données possède le modèle de maximum de vraisemblance de ces données [226]. De meilleurs modèles rapportent plus de travail par joule. Boyd, Crutchfield, Gu et Binder ont énoncé le surapprentissage et la généralisation en termes énergétiques [227]. La généralisation apparaît sous forme de joules. Ehrich, Still et Sivak ont attribué un prix au contrôleur lui-même, au-delà de l'information qu'il utilise [228]. Ainsi $J$ doit être mesuré à la paroi du système entier. Ehrich et Sivak ont donné le bilan des flux d'énergie et d'information dans les machines autonomes [229]. Wolpert a passé en revue les coûts du calcul au-delà de Landauer [230]. Wolpert et ses collègues ont exposé les problèmes ouverts sur les coûts énergétiques du calcul en thermodynamique stochastique [320]. Levy et Baxter ont montré que les codes neuronaux qui maximisent les bits par unité d'énergie diffèrent des codes qui maximisent les bits [231]. Le bon objectif pour un cerveau est l'information par joule. Balasubramanian, Kimber et Berry ont fixé comme objectif d'un régime exploratoire le débit de transmission par unité de puissance [232]. Ce sont des bits par joule. Goldt et Seifert ont borné l'information qu'un réseau apprend sur une règle par le coût thermodynamique de l'apprentissage, pour l'apprentissage par lots et en ligne [233]. Fiderer, Barth, Smith et Briegel ont défini la capacité de travail d'un canal d'environnement, le taux maximal auquel un agent quelconque peut espérer extraire du travail dans une boucle perception-action. Les agents efficaces en travail équilibrent prédiction et oubli (prépublication) [234]. Elliott, Gu, Garner et Thompson ont montré que des agents adaptatifs quantiques peuvent demander beaucoup moins de mémoire que des agents classiques à mémoire minimale [235]. Moins de mémoire à réinitialiser, c'est un plancher plus bas à payer.

**Décisions et optimalité bornée.** Russell et Subramanian ont défini l'optimalité bornée : le meilleur programme pour une machine et un environnement donnés [236]. Ici la ressource est le joule, et l'optimum est $\arg\min J$ sous la contrainte $X \ge X_{\mathrm{req}}$. Russell et Wefald ont attribué à chaque calcul un prix selon son effet espéré sur la décision, net de son coût, et ont arrêté la délibération lorsqu'aucun calcul n'avait de valeur nette positive [316]. Horvitz a posé le même compromis pour le raisonnement sous contraintes de ressources [317]. Le sélecteur de loi σ est cette règle, avec le coût en joules mesurés. La Proposition 9 en donne la forme exacte pour une cascade. Genewein et ses collègues ont dérivé l'abstraction et la hiérarchie de l'utilité moins le coût d'information [237]. Les engrenages de Mixture of Limits forment une telle hiérarchie. Legg et Hutter ont défini l'intelligence comme la récompense espérée pondérée par la complexité sur tous les environnements calculables [238]. C'est une intégrale, mais sur la récompense, sans énergie, et non calculable. La dérivée en joules remplace la récompense par les bits couplés confirmés et la mesure par les joules mesurés. Takahashi et Hayashi donnent le calcul en joules existant le plus proche [239]. Ils définissent deux rapports selon des conventions comptables explicites. L'épiplexité thermodynamique par joule est $I(W^{\mathrm{post}}; Z \mid W^{\mathrm{pre}})/E_{\mathrm{cons}}$ : de nouveaux bits sur une variable d'environnement $Z$ retenus dans l'état de l'agent, par joule consommé à l'intérieur d'une frontière déclarée. L'empowerment par joule est la capacité du canal des actes vers les observations par unité de coût énergétique espéré, la capacité par unité de coût de Verdú. Ils démontrent une référence de Landauer en cycle fermé en joignant une inégalité thermodynamique de l'apprentissage au traitement des données, et montrent, par une construction de copie réversible, qu'avec une frontière ouverte et une mémoire neuve apportée gratuitement, le gain d'information et la dissipation à l'intérieur de la frontière se découplent. Ils concluent par une liste de contrôle pour les rapports : frontière, bilan énergétique, référence, gros grain, horizon et réinitialisation, débit, estimateur. Ce programme retient quatre choses de ces travaux. Leur référence en cycle fermé est K1 pour l'apprentissage. Leur construction de découplage est la raison de la mesure fermée sur l'acte dans la Définition 2 (Lemme 1). Leur liste de contrôle est adoptée à la Section 8.12. Leur conseil de rapporter les bits par joule à côté des bits par seconde est la variable qu'optimise la Prédiction 1. La définition diffère de leurs métriques sur quatre points précis. L'empowerment par joule est une capacité, un supremum sur les distributions d'actes ; la définition crédite le flux réalisé de la politique exécutée (Définition 1), avec la capacité comme borne. Leurs nombres sont, de leur propre aveu, des rapports d'efficacité relatifs à une référence ; ce programme classe les systèmes par $J^*$ derrière une porte de correction (Proposition 8). Ils n'ont pas de prédiction fixée avant l'acte, pas de clause de conséquence ni de refus ; la définition exige les trois avant qu'un bit compte. Ils ne donnent aucune cinématique du temps ; la Prédiction 1 dérive un temps d'acte optimal et un plafond de la même comptabilité en joules. Ortega, Braun, Dyer, Kim et Tishby ont exposé la rationalité limitée en termes de théorie de l'information [240]. Zénon, Solopchuk et Pezzulo ont formulé le coût de la cognition comme de l'information [241]. Sims a appliqué la théorie débit-distorsion à la perception [242]. Leur monnaie est le bit. Landauer convertit les bits en joules à la réinitialisation.

<div id="52-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Constaté

**Cerveaux.** Laughlin, de Ruyter van Steveninck et Anderson ont mesuré le coût énergétique par bit dans les photorécepteurs et les interneurones de la mouche bleue [243]. Des débits d'information plus élevés coûtent davantage par bit. C'est une $\iota$ mesurée dans un agent vivant et un rendement décroissant mesuré, $\alpha_J < 0$ dans la détection. Attwell et Laughlin ont établi le budget énergétique de la substance grise par processus [244]. Lennie a montré que l'énergie limite le nombre de neurones corticaux qui peuvent être actifs à la fois [245]. L'énergie est la contrainte, et le reste s'adapte. L'énergie par potentiel d'action varie beaucoup selon les types de neurones [246]. Même fonction, joules différents. La conception neuronale suit l'efficacité énergétique [247]. Levy et Calvert ont audité le cortex humain. La communication coûte 35 fois plus que le calcul, et le calcul d'un neurone se situe à un facteur $10^8$ des meilleurs bits par joule possibles [248]. C'est une distance au plancher. Harris et ses collègues ont trouvé qu'une synapse de la voie visuelle est dimensionnée pour maximiser l'information par unité d'énergie, et non l'information [249]. L'objectif est le bit par joule, mesuré sur une synapse. Padamsey, Katsanevaki, Dupuy et Rochefort ont trouvé que la restriction alimentaire réduisait de 29% l'usage synaptique d'ATP (adénosine triphosphate) dans le cortex visuel de la souris et élargissait de 32% l'accord en orientation [250]. Moins de joules ont acheté moins de précision. Plaçais et Preat ont montré que les mouches affamées désactivent la coûteuse mémoire aversive à long terme, et que la forcer à nouveau réduisait la survie [251]. Plaçais et ses collègues ont trouvé qu'un flux d'énergie accru dans les corps pédonculés déclenche la mémoire à long terme [252]. Mery et Kawecki ont trouvé que la formation d'une mémoire à long terme diminuait la résistance des mouches à la dessiccation [253]. L'apprentissage a un prix métabolique mesuré. Hechler, de Lange et Riedl ont mesuré une consommation corticale d'oxygène plus faible, jusqu'à 12%, lors d'une prédiction confiante (prépublication) [254]. La prédiction d'abord peut économiser des joules. Malkin et ses collègues ont donné aux synapses un coût énergétique de fiabilité dans des réseaux entraînés et ont trouvé dans l'optimum des signatures d'inférence bayésienne [255]. Li et van Rossum ont montré que la plasticité synaptique naïve coûte une énergie extrême et que mettre les changements en cache avant la consolidation l'économise [256]. Lynn et ses collègues ont inféré, à partir de neuro-imagerie, une rupture du bilan détaillé dans le cerveau humain, croissante avec l'effort physique et cognitif [257]. Cette production d'entropie est à gros grain et informationnelle. Ce n'est pas un compteur de joules.

**Machines.** L'accès mémoire coûte bien plus d'énergie que l'arithmétique [258]. Le nombre de paramètres n'importe qu'à travers les joules qu'il oblige à déplacer. L'intelligence par watt mesure la précision sur une tâche par unité de puissance sur des accélérateurs locaux [259]. Son numérateur est la précision à un banc d'essai, non l'agentivité soumise à la porte. MLPerf Power normalise la mesure de puissance du microwatt au mégawatt, chaque résultat étant soumis à la porte d'un objectif de précision [260]. Cette porte est la forme de $J^*$. FrugalGPT met en cascade des modèles de langage et s'arrête lorsqu'un évaluateur accepte la réponse [321]. RouteLLM apprend à envoyer chaque requête vers un modèle fort ou faible sous un objectif de coût [322]. Leur coût est en dollars par requête et leur porte est un seuil de qualité. Lus avec des joules mesurés et $C(z)$ comme porte, tous deux sont des cascades au sens de la Proposition 9. ML.ENERGY mesure automatiquement l'énergie d'inférence [261]. TokenPowerBench évalue la puissance de l'inférence des grands modèles de langage (LLM) [262]. Jin, Wei et Brooks analysent l'énergie du calcul au moment du test [263]. Les modèles généralistes coûtent beaucoup plus d'énergie par tâche que les modèles spécialisés [264]. Le modèle suffisant le moins coûteux l'emporte en joules. C'est Mixture of Limits, mesuré. Samsi et ses collègues ont mesuré l'énergie de l'inférence des grands modèles de langage sur GPU (processeurs graphiques) [265]. Dillavou et ses collègues ont démontré un apprentissage décentralisé dans un circuit physique, sans processeur [266]. Stern et ses collègues ont entraîné des circuits auto-apprenants pour des solutions économes en puissance et ont mesuré le compromis entre puissance et erreur [267]. Saggio et ses collègues ont démontré une accélération quantique pour des agents apprenants dans une expérience photonique [268]. Moins d'interactions pour apprendre, c'est moins d'actes à clore.

**Un accepteur à énergie rapportée par le noyau.** La Section 8.11 rapporte une exécution préenregistrée d'un agent accepteur sur un ordinateur portable, avec la prédiction d'abord, la comparaison, le refus et des budgets en joules contraignants. Les réfutateurs ont été fixés avant l'exécution, et plusieurs se sont déclenchés : R-F1 (les joules des sélecteurs sur les tâches partagées ne sont pas distinguables), R-F2 (36 épisodes sur 5,400 ont dépassé leur budget : 9 pour le bras de loi σ et 7 pour la cascade fixe à $B = 1.0$, et 20 pour la référence aveugle au but à $B = 0.5$), R-F3, R-F5 et R-F6 (Section 8.11). $\iota$ a été lue sur 4,940 reçus. L'acte confirmé médian a donné $1.5 \times 10^5$ bits par joule rapporté, soit environ $2 \times 10^{15}$ fois les joules par bit du plancher. Sous un budget contraignant, le sélecteur de loi σ a achevé plus de tâches que la cascade fixe, une instance de Mixture of Limits. Cette comparaison a été choisie après l'exécution, elle est donc exploratoire, et les joules par tâche achevée étaient égaux. La deuxième exécution préenregistrée et une seconde machine ont reproduit le gain au budget le plus lâche seulement (Section 8.11.2). La $\iota$ intégrée a classé premier un agent aveugle au but sous un budget lâche, tandis que $J^*$ l'a classé dernier.

**Groupes simulés.** Crosato et ses collègues ont calculé les grandeurs thermodynamiques d'un mouvement collectif simulé à travers son point critique [269]. Chen et Prokopenko ont comparé l'efficacité thermodynamique à des utilités purement informationnelles comme explications du comportement collectif près de la criticité [270]. $\iota_G$ dans la Proposition 7 est la forme mesurée et soumise à la porte d'un tel rapport.

**Compteurs.** RAPL (Running Average Power Limit) est l'ensemble des compteurs d'énergie intégrés à la puce des processeurs Intel et AMD. Ses lectures ont été validées par rapport à une mesure externe [271]. Les lectures de la DRAM (mémoire vive dynamique) ont été validées séparément [272]. La qualité du compteur dépend de la génération du processeur [273]. Le manuel de powermetrics d'Apple indique que ses valeurs de puissance moyenne « sont estimées et peuvent être inexactes » et ne doivent pas servir à comparer des appareils [274]. Sur Apple silicon, les lectures de powermetrics sont des valeurs rapportées. Les joules mesurés pour cette machine proviennent d'un wattmètre mural externe.

**La compression notée.** Le prix Hutter note la compression sans perte du premier gigaoctet d'un vidage de la Wikipédia anglophone, avec une dotation de 500,000 euros et des limites de temps d'exécution et de mémoire [275]. Il borne le temps et la mémoire, jamais les joules. Un plafond en joules en ferait un banc d'essai du calcul de l'agentivité pour une classe de tâches.

**Estimations.** Ces sources sont précieuses, et leurs chiffres en joules sont modélisés, extrapolés ou calculés. Ils figurent à côté des joules mesurés, jamais à leur place. Les estimations ne sont jamais `measured_j`. Strubell, Ganesh et McCallum ont échantillonné la puissance sur de courtes exécutions et ont extrapolé à l'entraînement complet de modèles de traitement automatique des langues [276]. Patterson et ses collègues ont calculé l'énergie d'entraînement à partir de données rapportées sur le matériel, la durée d'exécution et le centre de données [277]. Lacoste et ses collègues ont construit un calculateur à partir du type de matériel, de la durée d'exécution et de la région [278]. L'empreinte de BLOOM mélange des entrées mesurées et modélisées [279]. Carbontracker lit des compteurs de l'appareil et prédit les totaux de l'exécution complète [280]. Ses prédictions sont des estimations. Elsworth et ses collègues rapportent une médiane de 0.24 Wh par requête textuelle de Gemini Apps, en comptant les accélérateurs, les hôtes, la capacité inactive et la surcharge du centre de données [281]. C'est un chiffre rapporté par l'exploitant, classé comme `reported_j`.

<div id="53-opinion" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Opinion

Chaque position est confrontée à la définition : l'intelligence est la dérivée en joules de l'agentivité soumise à la porte, lue sur une exécution achevée.

- Schmidhuber traite la récompense intrinsèque comme un progrès de compression, une dérivée première de la qualité avec laquelle un agent compresse son histoire [282]. C'est le précédent le plus proche de l'intelligence comme dérivée lue sur une exécution. Sa variable est la compression, non les joules.
- Krakauer, Mitchell et Krakauer définissent l'intelligence comme une propriété émergente qui s'exprime dans des usages toujours moins coûteux et plus rapides de capacités émergentes pour résoudre des problèmes, résumée par « moins, c'est plus » [339]. Ils concluent que les grands modèles de langage montrent au mieux une capacité émergente, non une intelligence émergente. Leur définition est la plus proche, dans les mots, de $\iota = dX/dJ$. Elle nomme l'énergie comme dénominateur et ne la mesure pas. Le calcul fournit le compteur, la porte qui sépare la capacité de l'intelligence (Section 1), et la dérivée lue sur l'exécution.
- Chollet définit l'intelligence comme l'efficacité d'acquisition de compétences au regard des a priori et de l'expérience, avec le banc d'essai ARC (Abstraction and Reasoning Corpus) [283]. C'est un rapport. Son dénominateur est l'information et les données, non les joules. Le classement de l'ARC Prize représente le coût par tâche en fonction du score comme mesure d'efficacité [284]. Le coût est en dollars. Un compteur de joules le transforme en $J^*$.
- Hernández-Orallo construit une psychométrie universelle à travers les espèces et les machines [285]. Elle évalue par tâches. Ce programme évalue par les joules nécessaires pour achever des tâches. Le test à tout instant de Hernández-Orallo et Dowe s'adapte au temps disponible [286]. Le calcul s'adapte aux joules disponibles.
- Gershman, Horvitz et Tenenbaum définissent l'intelligence comme l'utilité espérée nette du coût du calcul [287]. Ce programme fait de ce coût des joules.
- Lieder et Griffiths traitent la cognition comme l'usage optimal de ressources limitées [288]. C'est proche de Mixture of Limits. La ressource reste abstraite.
- Balasubramanian lit la conception du cerveau à travers ses limites énergétiques [289].
- Silver, Singh, Precup et Sutton soutiennent que la récompense suffit [290]. La récompense est choisie par un concepteur. Les joules se lisent sur un compteur. Vamplew et ses collègues répondent qu'une récompense scalaire ne peut pas exprimer des buts à objectifs multiples [291]. Ce programme garde une seule variable, les joules, et place la multiplicité dans la porte $X \ge X_{\mathrm{req}}$.
- Hafez et ses collègues définissent ensemble l'agentivité et l'intelligence [292]. Ce n'est pas natif en joules.
- Karagoz fait de l'autosuffisance énergétique l'objectif [293]. Il n'y a ni porte de prédiction, ni cinématique, ni classement en joules entre systèmes.
- Chaisson propose la densité de taux énergétique, la puissance par unité de masse, comme métrique de complexité à travers l'évolution cosmique [294]. C'est un taux en watts par kilogramme. Le calcul divise les bits confirmés par les joules.

La portée de $\iota$ découle de son numérateur. $X$ compte le couplage confirmé au monde, de sorte que $\iota$ mesure à quel point un agent change le monde à bon compte, comme il l'avait prédit. Elle ne mesure pas la compréhension. Krakauer, Mitchell et Krakauer relient l'intelligence à des représentations compactes et communicables [339]. Une représentation compacte entre dans le calcul par son effet : un agent qui en détient une achève les tâches ultérieures avec moins de joules. Une compréhension qui ne change jamais un acte est hors de ce que $\iota$ lit.

<div id="54-where-the-calculus-stands" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Où en est le calcul

- **Prouvé :** l'apprentissage, la mémoire, la prédiction et le contrôle ont chacun un prix en joules assorti d'un plafond.
- **Constaté :** les joules par bit sont mesurés dans les cerveaux. Les joules par tâche sont mesurés dans les machines. Les compteurs peuvent être validés.
- **Prouvé ici :** $\iota$ est une densité bornée sur l'axe des joules sous un crédit proportionnel aux joules (Proposition 5). La $\iota$ échantillonnée y converge (Proposition 6). Les groupes se composent selon la Proposition 7. Tenir un but fixe un temps d'acte optimal et un plafond sur $\iota$ (Prédiction 1).
- **Constaté ici :** $\iota$ et $J^*$ lus sur les reçus d'un accepteur à énergie rapportée par le noyau, avec des réfutateurs fixés à l'avance (Section 8.11). $J^*$ classe les agents. La $\iota$ intégrée, non.
- **Apport de ce programme :** l'intelligence lue comme $dX/dJ$ sur une exécution achevée et soumise à la porte, avec $J^*$ comme classement. Takahashi et Hayashi sont les plus proches, avec des rapports de bits par joule sous une comptabilité explicite [239]. Ce programme ajoute la porte d'éligibilité, le flux réalisé à la place de la capacité, le classement avec porte et sa démonstration (Proposition 8), et le temps d'acte optimal (Prédiction 1).

<div id="6-global-findings-by-method" class="anchor-alias" aria-hidden="true"></div>

## 6. Résultats mondiaux, par méthode

La recherche a été menée en russe, chinois, japonais, allemand, français, espagnol, portugais, coréen, italien, polonais, hindi et arabe, avec des compléments en anglais. Un second passage a de nouveau interrogé le japonais, le chinois, le russe, l'allemand, le français, l'espagnol et le coréen, et a ajouté le persan, le turc et l'hébreu. Ses résultats sont intégrés aux Sections 2 à 5 et 8 selon ce qu'ils démontrent, mesurent ou définissent. Les résultats sont organisés par méthode et par classe de résultat. La langue n'est qu'une métadonnée. Aucune entrée n'est classée selon sa provenance.

<div id="61-theorems-and-reviews-information-has-a-thermodynamic-price" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Théorèmes et revues : l'information a un prix thermodynamique

- Poplavskii a donné un traitement systématique précoce du coût énergétique de l'acquisition et du traitement de l'information [295]. Écrit en russe, avec une traduction anglaise. Couche : définition.
- Stratonovich a démontré des théorèmes sur la valeur de l'information [201]. Édition anglaise d'une monographie russe. Couche : cinématique.
- Ito et Sagawa ont appliqué la thermodynamique de l'information sur réseaux à la chimiotaxie d'E. coli. L'entropie de transfert borne la robustesse, et l'efficacité thermodynamique informationnelle est élevée là où l'efficacité thermodynamique ordinaire est faible [296]. Écrit en japonais. Couches : définition et cinématique.
- Sun et Quan ont passé en revue le démon de Maxwell et le plancher physique de la dissipation dans le traitement de l'information [297]. Écrit en chinois. Couche : définition.
- Quan, Dong et Sun ont passé en revue la thermodynamique mésoscopique : le démon est compatible avec la deuxième loi une fois l'effacement compté, et des contraintes puissance-rendement ont été testées [298]. Écrit en chinois avec un résumé en anglais. Couches : définition et cinématique.
- La revue encyclopédique de Parrondo donne le compte rendu actuel de l'information comme ressource thermodynamique [299]. Couche : définition.
- La thèse de doctorat de Strasberg teste des hypothèses courantes de la thermodynamique de l'information au moyen de modèles physiques [300]. Écrite en anglais avec un résumé en allemand. Couche : définition.
- D'autres théorèmes sont apparus lors de recherches en japonais, russe, chinois, coréen, portugais, italien et polonais : limites de vitesse et TUR dans les réseaux chimiques [127, 131, 132], thermodynamique en temps fini [159, 162, 163], TUR de Langevin [143, 144], bornes informationnelles sur la production d'entropie [148, 149] et coûts en travail en tir unique [38].

<div id="62-experiments-the-price-measured" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Expériences : le prix mesuré

- La thèse de doctorat de Dago rapporte l'effacement et l'écriture d'un bit près de l'énergie minimale à grande vitesse sur un micro-levier sous-amorti [301]. Écrite en français. Couche : le plancher en joules de la définition atteint à vitesse cinématique.
- La thèse de doctorat de Lagoin construit des démons de Maxwell macroscopiques, dont une machine de Szilard, à partir d'une ailette dans un gaz granulaire [302]. Écrite en français. Couche : définition. La comptabilité du démon tient hors du régime microscopique.
- Ciampini et ses collègues ont utilisé le travail extractible comme témoin de corrélations quantiques dans une expérience photonique [303]. Couche : définition.
- Expériences apparues lors de recherches en coréen, portugais, hindi, italien, espagnol, chinois et japonais : machines d'information [27, 80], démons en RMN [73, 74], la TUR sur des qubits [202], machines à bain actif [217, 218], bornes géométriques [211], brisure de symétrie et cycles de Carnot [215, 216], démons à ions piégés [66, 88], et conversion par rétroaction et transport optimal [69, 76, 209].

<div id="63-theory-of-functional-systems-prediction-before-the-act" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Théorie des systèmes fonctionnels : la prédiction avant l'acte

L'école d'Anokhin énonce les clauses 1 et 3 en termes physiologiques. Un gabarit de résultat, l'accepteur des résultats de l'action, est formé avant l'acte, comparé après lui, et la comparaison réorganise le comportement. Ces travaux ont été trouvés par des recherches en russe.

- Le système fonctionnel d'Anokhin [93, 94].
- Sudakov sur le résultat comme facteur formateur du système et sur la prédiction probabiliste du comportement [95, 304, 305, 306].
- Shvyrkov sur les buts qui organisent l'activité neuronale et sur l'apprentissage comme sélection de systèmes neuronaux [96, 307].
- K. V. Anokhin sur la structure cognitive du cerveau comme hyper-réseau d'éléments de systèmes fonctionnels [308].
- Saltykov et Grachev sur le facteur formateur du système comme anticipation [309].
- Vityaev sur la finalité formalisée comme apprentissage de règles qui prédisent des résultats [310].

**Implémentés et exécutés.** Des architectures cognitives fondées sur la théorie des systèmes fonctionnels forment des gabarits de résultat, comparent et apprennent des sous-buts, en simulation et sur un robot physique [90, 91, 311, 312, 313]. Aucune ne mesure de joules. Ajouter un compteur à l'un de ces agents testerait l'ordre complet définition, cinématique et calcul sur une implémentation existante. Les réseaux logiques probabilistes différentiables sont un outillage de calcul apparenté, non fondé sur les systèmes fonctionnels, sans porte d'éligibilité ni joules [314].

<div id="64-autonomy-organization-and-minimal-agency" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Autonomie, organisation et agentivité minimale

Trouvés par des recherches en espagnol, en français et en allemand. L'agentivité est une organisation qui s'automaintient et régule ses interactions [103, 104, 105, 106, 107, 108]. L'organisation est une clôture de contraintes sur des flux thermodynamiques [109]. L'école de l'autonomie est entrée dans la thermodynamique stochastique [110]. Couche : définition, en tant qu'organisation qui doit exister avant qu'un acte compte.

<div id="65-measured-joules-for-machine-intelligence" class="anchor-alias" aria-hidden="true"></div>

### 6.5 Joules mesurés pour l'intelligence des machines

Trouvés par des recherches en chinois sur l'énergie d'inférence : mesure automatisée de l'énergie d'inférence [261], bancs d'essai de puissance par token [262] et énergie du raisonnement au moment du test [263].

<div id="66-philosophy-of-agency" class="anchor-alias" aria-hidden="true"></div>

### 6.6 Philosophie de l'agentivité

La physique de l'agentivité de Rovelli est apparue par l'allemand [115]. Jaeger et Azadi complètent l'ensemble des articles de position [116, 117].

<div id="67-searches-with-no-primary-research" class="anchor-alias" aria-hidden="true"></div>

### 6.7 Recherches sans recherche primaire

Les recherches en hindi et en arabe n'ont renvoyé aucune recherche primaire dans ces langues. Les compléments en anglais ont fait apparaître d'autres travaux, énumérés ci-dessus par méthode. Les recherches en persan, en turc et en hébreu ont renvoyé des thèses, des revues et des travaux déjà cités, sans nouvelle recherche primaire.

<div id="7-open-problems" class="anchor-alias" aria-hidden="true"></div>

## 7. Problèmes ouverts

<div id="71-what-must-be-proven" class="anchor-alias" aria-hidden="true"></div>

### 7.1 Ce qui doit être prouvé

**P1. La trajectoire de l'exécution est bien définie.** Prouvé. La Proposition 5 donne $\iota = dX/dJ$ comme densité sur l'axe des joules avec $0 \le \iota \le 1/(k_B T\ln 2)$, sous un crédit proportionnel aux joules. La Proposition 6 donne la convergence de la $\iota$ échantillonnée à mesure que l'échantillonnage du compteur s'affine, avec l'erreur relative du compteur comme terme d'erreur.

**P2. Borne de Landauer soumise à la porte de l'agentivité.** Sous une comptabilité en cycle fermé, chaque bit couplé confirmé coûte au moins $k_B T \ln 2$, de sorte que $v_J \le 1/(k_B T \ln 2)$. Acquis : le travail de mesure plus d'effacement vaut au moins $k_B T I$ [5], et l'effacement coûte au moins $k_B T \ln 2$ par bit [6, 7]. Manque : une étape de traitement des données montrant que les bits couplés crédités dans $X$ ne peuvent pas dépasser les bits enregistrés dans la mémoire de l'accepteur pendant la comparaison. La clause 3 exige déjà que la confirmation $m$ provienne d'un enregistrement physique. La Proposition 1 démontre le plancher par acte en prenant cette étape comme hypothèse (R2).

**P3. Limite de vitesse de l'agentivité.** Prouvé pour les actes dont l'enregistrement satisfait (R1) à (R4). La Proposition 1 borne inférieurement les joules moyens de l'acte $k$ par $b_k k_B T\ln 2$ plus un terme de temps fini en $\tau_k$, $\langle A\rangle_k$, l'erreur de réinitialisation $\varepsilon$ et les bits confirmés, via l'inégalité de Fano. La Prédiction 1 ajoute les joules permanents du maintien d'un but et donne le temps d'acte optimal.

**P4. Borne de précision pour les agents.** Prouvé. La Proposition 3 borne la variance relative de l'agentivité confirmée par l'activité dynamique pour le décompte des actes confirmés, et par la production d'entropie avec le terme d'information sous rétroaction.

**P5. Théorème de la lecture après coup.** $\iota$ n'est fonction que du reçu achevé. Aucune grandeur antérieure à l'exécution ne la fixe. Acquis : chaque $m_k$ compare un résultat à une prédiction fixée avant l'acte, de sorte que $m_k$ est inconnu avant la clôture de l'acte $k$. Manque : une construction de deux mondes qui concordent sur tout ce que voit un prédicteur antérieur à l'exécution et diffèrent par un $m_k$. Avec P1, cela fait de « l'intelligence se lit sur l'exécution achevée » un théorème.

**P6. Le classement résiste à l'erreur du compteur.** Prouvé. Proposition 8, partie 3 : si $(1+\epsilon)J^*_{S_1}(q) < (1-\epsilon)J^*_{S_2}(q)$, avec $\epsilon$ la borne d'erreur relative du compteur, alors $S_1 \succ_q S_2$ sous toute lecture comprise dans cette erreur. Manque : un $\epsilon$ validé pour chaque compteur [271].

**P7. Optimalité de Mixture of Limits.** Partiellement prouvé. La Proposition 9 donne les conditions exactes pour des engrenages indépendants et pour deux engrenages emboîtés, ainsi que le mécanisme du budget. L'instance de cascade fixe essaie les engrenages du moins coûteux vers le haut, s'arrête au premier engrenage dont la sortie satisfait $C(z)$ et refuse avec un reçu si l'engrenage suivant dépassait le budget. Elle atteint le minimum en joules au coût près des tentatives échouées. Acquis : si la suffisance est monotone dans l'ordre des engrenages et que les coûts des engrenages croissent avec l'ordre, le premier engrenage suffisant est l'engrenage suffisant le moins coûteux. Manque : une borne de regret lorsque les probabilités de réussite sont estimées ou que la suffisance n'est pas monotone, le cas emboîté à plus de deux engrenages, et les conditions sous lesquelles cette règle et le sélecteur de loi σ, $a^* = \arg\max[H(a) - \lambda J(a)]$ sous la contrainte $J \le B$, choisissent le même acte.

**P8. Quand l'agentivité se cumule.** Conditions sous lesquelles $\alpha_J > 0$ sur une exécution, de sorte que les reçus antérieurs abaissent les joules des achèvements ultérieurs. Acquis : une exécution d'essai antérieure d'OpenIE a trouvé $\alpha_J \le 0$ sur des tâches quasi optimales. Manque : un modèle de réutilisation dans lequel les reçus stockés réduisent le $J$ ultérieur de plus que les joules de stockage et de consultation. Still donne le côté coût de la mémoire [225]. La Section 8.10 mesure la part du gabarit dans les joules de chaque acte.

<div id="72-what-must-be-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 7.2 Ce qui doit être constaté

| ID | Affirmation | Preuves requises |
|---|---|---|
| D1 | $J^*$ par tâche est mesuré, non estimé, sur au moins deux plateformes | `measured_j` issu de RAPL sur Linux x86 et d'un wattmètre mural externe sur Apple silicon |
| D2 | Le sélecteur de loi σ achève les tâches avec moins de joules mesurés que la cascade fixe sous des budgets contraignants | Exécutions appariées avec les mêmes tâches, engrenages, prédicats, budgets et compteurs |
| D3 | Le refus avec un reçu fonctionne | Zéro dépassement, refus sur les tâches irréalisables, peu de refus sur les tâches réalisables |
| D4 | $\iota$ se lit sur les reçus et est stable d'une graine à l'autre | Série $\iota_k$ par exécution avec une dispersion inférieure à une borne fixée d'avance |
| D5 | Les estimations ne se substituent pas à la mesure | Concordance des rangs entre `est_j` et `measured_j`, rapportée, jamais fusionnée |
| D6 | Le plancher physique est respecté et l'écart est connu | Joules mesurés par bit confirmé divisés par $k_B T \ln 2$ |
| D7 | Prédiction 1 : le temps d'acte optimal et le plafond d'un agent qui tient un but | Un balayage de $\tau$ à deux taux d'instabilité ou plus, avec les joules d'acte et les joules permanents mesurés séparément et ensemble |

La Section 8.11 rapporte la première exécution au regard de D2 à D6, en joules rapportés. La Section 8.11.1 rapporte la deuxième exécution sur la même machine, avec les corrections de la garde et du refus, et la Section 8.11.2 la répète sur une seconde machine.

<div id="8-experiment-plan" class="anchor-alias" aria-hidden="true"></div>

## 8. Plan expérimental

Chaque tableau, reçu et figure de ce plan suit une règle. Les estimations ne sont jamais `measured_j`. Un chiffre modélisé est étiqueté `est_j`. Un chiffre mesuré est étiqueté `measured_j` et nomme son compteur.

<div id="81-meters" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Compteurs

Sigles : CPU (processeur central), GPU (processeur graphique), ANE (Apple Neural Engine), CA (courant alternatif), NVML (NVIDIA Management Library).

| Niveau | Compteur | Ce qu'il lit | Étiquette |
|---|---|---|---|
| M0 | Wattmètre externe sur prise murale, enregistrant à 1 Hz ou plus vite | Puissance CA du système entier | `measured_j`, mur |
| M1 | RAPL via powercap de Linux, domaines paquet, cœur, uncore et DRAM lorsqu'ils existent | Énergie cumulée sur la puce, en microjoules | `measured_j`, rapl |
| M1g | Compteur d'énergie totale NVML sur un GPU discret | Énergie cumulée de la carte GPU | `measured_j`, nvml |
| M2 | powermetrics d'Apple, échantillonneurs CPU et GPU à 100 ms | Puissance CPU, GPU et ANE telle que rapportée par le système | `reported_j`, powermetrics |

- **RAPL.** Lire le compteur avant et après chaque acte. Gérer le rebouclage. Valider par rapport à M0 sur une charge d'étalonnage [271, 272].
- **powermetrics.** Les lectures sont classées comme `reported_j`. Les joules mesurés sur Apple silicon proviennent de M0. Sur une même machine, `reported_j` attribue les joules au CPU, au GPU et à l'ANE.
- **Référence au repos.** Enregistrer 120 s de puissance au repos sur chaque compteur avant chaque bloc. Rapporter côte à côte les joules bruts et les joules diminués du repos. Ne jamais rapporter le seul chiffre soustrait.
- **Contrôle de l'état.** Fixer le gouverneur de fréquence du CPU lorsque le système d'exploitation le permet. Enregistrer la température ambiante et la pression thermique. Fermer les tâches d'arrière-plan. Écarter une exécution de préchauffage par bras.

<div id="82-tasks" class="anchor-alias" aria-hidden="true"></div>

### 8.2 Tâches

Chaque tâche a un prédicat de complétude vérifiable par machine, $C(z)$ : tests unitaires pour le code, correspondance exacte pour l'arithmétique, validation de schéma pour l'extraction, état final vérifié pour l'usage d'outils. Deux strates sont fixées à l'avance. Les tâches quasi optimales sont celles que l'engrenage le moins coûteux achève d'ordinaire. Les tâches cumulatives sont des séquences dans lesquelles des reçus antérieurs peuvent être réutilisés. $X_{\mathrm{req}}$ est fixé par $C(z)$. La réussite est une porte, pas un score.

<div id="83-arms" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Bras

Tous les bras partagent les engrenages, le prédicat, le budget, les compteurs et un ordre d'exécution randomisé et entrelacé.

1. **Sélecteur de loi σ :** $a^* = \arg\max[H(a) - \lambda J(a)]$ sous la contrainte $J \le B$, avec refus sur un reçu.
2. **Cascade fixe (une instance de Mixture of Limits) :** la règle du moins coûteux suffisant, les engrenages étant essayés dans un ordre fixe du moins coûteux vers le haut. C'est la comparaison appariée : même information, mêmes engrenages, même budget et même droit de refus. Seule la règle de sélection diffère.
3. **Toujours le plus grand engrenage :** plafond de référence.
4. **Toujours le plus petit engrenage :** plancher de référence, avec refus en cas d'échec.

Les deux sélecteurs sont des instances de Mixture of Limits. La philosophie consiste à utiliser l'engrenage le moins coûteux qui suffit, car au-delà du plancher des joules supplémentaires n'achètent aucun progrès vérifiable. La cascade fixe l'applique dans un ordre fixe. Le sélecteur de loi σ s'arrête lorsque l'acte suivant ne paie plus ses joules. C'est une règle de convergence de seuil, et donc aussi une instance de Mixture of Limits. La comparaison oppose deux instances d'une même philosophie. Dans le code et les fichiers de données, la cascade fixe est le bras `mol` et le sélecteur de loi σ est le bras `sigma`.

<div id="84-budgets-seeds-and-statistics" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Budgets, graines et statistiques

- Un pilote exécute le bras 2 sans budget et enregistre la médiane des joules mesurés par tâche, $\tilde J_q$.
- Les niveaux de budget sont $B \in \{0.25, 0.5, 0.75, 1.0\} \times \tilde J_q$, plus le cas sans contrainte. Un niveau n'est contraignant que si au moins 20% des tâches le dépassent dans le pilote. Les niveaux non contraignants sont rapportés et exclus du test de D2.
- Au moins 10 graines par bras, tâche et budget. Davantage si le pilote montre que 10 ne peuvent pas résoudre une différence de 10% de la médiane de $J^*$ avec une confiance de 95%.
- Rapporter la moyenne, la médiane, l'écart type et un intervalle de confiance bootstrap à 95% de $J^*$ par tâche. Comparer les bras 1 et 2 par un test des rangs signés de Wilcoxon sur la médiane de $J^*$ par tâche, avec la taille d'effet.
- Le préenregistrement nomme les critères d'évaluation principaux. Les comparaisons secondaires sont corrigées par la procédure descendante de Holm. Une analyse choisie après une exécution est étiquetée post hoc partout où elle apparaît, résumés compris, et n'est jamais le résultat phare. Elle ne devient un critère principal que dans le préenregistrement de l'exécution suivante.

<div id="85-receipt-schema" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Schéma du reçu

Le reçu est l'enregistrement Notational Intelligence de l'exécution. Un enregistrement par acte :

```
act_id, run_id, task_id, arm, seed, budget_j, gear
prediction_hash, prediction_ts        # R*, fixed before the act
outcome_hash, outcome_ts              # R
m                                     # 1, mu, or 0
coupled_bits_est                      # realized I(do(a); W'), bias-corrected, with interval
coupled_bits_bound                    # capacity bound, never credited as X
t_start, t_end
measured_j   {meter, domains, gross_j, idle_w, idle_subtracted_j}
reported_j   {meter, cpu_j, gpu_j, ane_j}    # powermetrics only
wall_j       {meter, gross_j, idle_w, idle_subtracted_j}
est_j        {model, inputs}                 # never merged with measured_j
cumulative_measured_j
refused, refuse_reason
passed_C
record_states, record_bits            # N and H of the act's record M_k
joule_share                           # P_k attribution when acts overlap
template_j   {meter, write_j, hold_j, reset_j}   # joules for R*
trajectory_j {tau, activity, work}    # physical runs only, Section 8.8
```

<div id="86-metrics" class="anchor-alias" aria-hidden="true"></div>

### 8.6 Métriques

- $J^*$ par tâche : joules mesurés jusqu'à la satisfaction de $C(z)$, issus de M0 lorsqu'il existe, sinon de M1.
- Taux d'achèvement par bras et par budget.
- Dépassements : actes qui ont excédé $B$. L'objectif est zéro.
- Qualité du refus : précision et rappel des refus par rapport aux tâches qu'un bras quelconque a montrées irréalisables dans $B$.
- Série d'intelligence : $\iota_k = \Delta X_k/\Delta J_k$ par exécution, et sa dispersion d'une graine à l'autre.
- Signe de l'accélération : le signe de $\alpha_J$ obtenu par régression de $\iota_k$ sur le $J$ cumulé, par strate.
- Contrôle de l'estimation : la corrélation des rangs de Kendall entre `est_j` et `measured_j`.
- Distance au plancher : joules mesurés par bit couplé confirmé divisés par $k_B T \ln 2$ à la température enregistrée.
- Intelligence de l'acte : $\iota_k = b_k/J_k$ par acte, égale à la densité de la Proposition 5 sur cet acte.
- Part du gabarit : $J^{R^*}/J$ par acte et la courbe $\iota(w)$ (Section 8.10).

<div id="87-falsifiers-fixed-before-any-run" class="anchor-alias" aria-hidden="true"></div>

### 8.7 Réfutateurs, fixés avant toute exécution

| ID | Observation | Affirmation réfutée |
|---|---|---|
| F1 | L'intervalle à 95% de la différence appariée de la médiane de $J^*$, loi σ moins cascade fixe, inclut ou dépasse zéro à chaque budget contraignant | Le sélecteur de loi σ bat en joules son rival équitable |
| F2 | Un bras enregistre un dépassement | L'implémentation du refus de ce bras |
| F3 | Le rappel du refus sur les tâches irréalisables est inférieur à 0.9, ou plus de 10% des refus portent sur des tâches qu'un autre bras a achevées dans $B$ | La correction du refus |
| F4 | La corrélation de Kendall entre `est_j` et `measured_j` est inférieure à 0.8 | L'usage de cet estimateur pour tout classement |
| F5 | Le coefficient de variation de la $\iota$ moyenne d'une graine à l'autre dépasse 0.25 sur une tâche | La lecture de $\iota$ à la granularité de cette tâche |
| F6 | L'$\alpha_J$ ajusté n'est pas positif avec une confiance de 95% sur la strate cumulative | Le cumul sur ces tâches |
| F7 | Les joules mesurés moyens par bit confirmé sur une exécution tombent sous $k_B T \ln 2$, ou ceux d'un acte quelconque d'une machine macroscopique | La comptabilité elle-même : un défaut du compteur ou de la tenue des comptes, corrigé avant que tout autre résultat soit rapporté |
| F8 | M1 et M0 divergent sur une charge d'étalonnage de plus que la borne d'erreur de P6 | Ce domaine RAPL comme source mesurée sur cette machine |
| F9 | Un cycle d'acte physique montre un travail inférieur au plancher de la Proposition 1 à ses $\tau$ et $\langle A\rangle$ enregistrés | La comptabilité de cette exécution : un canal de saut manqué, un potentiel mal étalonné ou une source de travail non mesurée |
| F10 | Une exécution stationnaire montre $\mathrm{Var}(N)/\langle N\rangle^2$ sous $1/\langle K\rangle$ au-delà de son intervalle de confiance | Le décompte des sauts de cette exécution : certains sauts n'ont pas été comptés |
| F11 | Un contrôleur tient le procédé avec des joules mesurés par pas inférieurs à $k_B T\ln 2 \log_2\lvert\lambda\rvert$ | Le compteur ou le modèle de procédé de cette exécution |
| F12 | Le maximiseur de la $\iota(\tau)$ mesurée se situe hors de $\tau^* \pm 2\delta\tau^*$ de la Prédiction 1, ou la pente de $\ln\tau^*$ en fonction de $\ln s$ s'écarte de $-1/2$ de plus de deux erreurs types ; ou la $\iota$ d'une exécution dépasse le plafond de la Prédiction 1 | L'additivité des joules d'acte et des joules permanents sur un même compteur, avec $\iota$ comme leur densité ; pour le plafond, la comptabilité de cette exécution |

<div id="88-physical-act-cycles" class="anchor-alias" aria-hidden="true"></div>

### 8.8 Cycles d'acte physiques

Ces exécutions testent les Propositions 1 à 4 au plancher physique. Le travail est calculé à partir de trajectoires mesurées et du potentiel étalonné, comme dans [61, 67, 70]. Il est classé comme `trajectory_j` et jamais fusionné avec `measured_j`, `reported_j` ou `est_j`.

- **Cycle d'acte sur un registre de charge (Propositions 1 et 4).** Une boîte à un électron ou une boîte quantique détient un enregistrement d'un bit, comme dans [68, 70, 71]. Chaque cycle écrit la comparaison, agit et réinitialise l'enregistrement en un temps $\tau$. Un détecteur de charge compte chaque saut tunnel, de sorte que $\langle A\rangle$ est mesurée. Balayer $\tau$ sur au moins deux décades. Forme du résultat : le travail par cycle en regard de $k_B T\ln 2 + k_B T/(2\tau\langle A\rangle)$, le plancher de la Proposition 1 pour $N = 2$ et $b = 1$.
- **Décompte des actes confirmés (Proposition 3).** Sur le même registre, en cyclage stationnaire, compter les actes confirmés $N$ et tous les sauts $K$ sur des fenêtres répétées de même longueur. Forme du résultat : $\mathrm{Var}(N)/\langle N\rangle^2$ en regard de $1/\langle K\rangle$, et la dispersion de $T_n$ en regard de $1/(\langle T_n\rangle\langle k\rangle)$. Sur une machine d'information à piège à rétroaction comme dans [27], exécuter l'expérience directe et l'expérience inverse, calculer $\sigma_I$ à partir des trajectoires mesurées et tester la partie 3.
- **Le temps d'acte optimal (Prédiction 1).** C'est le test de laboratoire.
  - *Dispositif.* Une bille colloïdale dans l'eau à la température $T$ se trouve dans un piège à rétroaction [61]. Sa position est lue à chaque $\Delta t$, et une force de rétroaction impose un potentiel virtuel $U(x, t)$. Le travail est calculé à partir de la trajectoire par l'énergétique stochastique, $W = \sum_t \partial_t U(x_t, t)\,\Delta t$ [319]. Une coordonnée exécute le cycle d'acte d'un bit dans un double puits virtuel, réinitialisé en un temps $\tau$. L'autre est maintenue au sommet d'un puits virtuel inversé, $U = -\tfrac{1}{2}k x^2$, dont le taux d'instabilité $\Lambda$ est fixé par $k$ et la mobilité de la bille.
  - *Blocs.* Pour chaque valeur de $\Lambda$, trois blocs sont exécutés de façon entrelacée dans un ordre randomisé. Bloc A : des actes sans but tenu, à neuf valeurs de $\tau$ ou plus espacées logarithmiquement sur au moins deux décades ; il ajuste $J_0$ et $a$. Bloc B : le but tenu sans actes ; il donne la puissance permanente $s$. Bloc C : les deux ensemble, aux mêmes valeurs de $\tau$ ; il donne $\iota(\tau)$. Au moins 200 cycles par point.
  - *Balayage de $s$.* Au moins quatre valeurs de $\Lambda$ couvrant au moins une décade, de sorte que $s$ couvre au moins une décade.
  - *Ajustement.* Ajuster $J(\tau) = J_0 + a/\tau + s\tau$ au bloc C par moindres carrés pondérés. Lire le $\tau^*$ mesuré au maximum de $\iota(\tau)$ par un ajustement quadratique local en $\ln\tau$. Calculer $\sqrt{a/s}$ et sa bande $\delta\tau^*$ à partir des blocs A et B. Régresser $\ln\tau^*$ sur $\ln s$ par moindres carrés et rapporter la pente avec son erreur type.
  - *Réfutation.* L'affirmation échoue si la pente s'écarte de $-1/2$ de plus de deux erreurs types, ou si un $\tau^*$ mesuré se situe hors de $\sqrt{a/s} \pm 2\delta\tau^*$, ou si les joules par acte du bloc C diffèrent de la somme des blocs A et B au-delà de leur intervalle combiné à 95%. Le dernier test est l'additivité sur un même compteur, le contenu physique de la prédiction.
  - *Puissance statistique.* L'erreur type de la pente doit être inférieure à 0.1. Sinon, l'exécution est rapportée comme non concluante et le balayage est étendu. Une exécution non concluante n'est pas une réussite.
  - *Second substrat.* Une boîte à un électron munie d'un détecteur de charge répète le protocole, avec $\langle A\rangle$ compté saut par saut [70]. L'accord sur deux substrats constitue le test.
  - Tout le travail est calculé à partir de trajectoires et classé comme `trajectory_j`.
- **Tenir un procédé instable (Proposition 2).** Un contrôleur numérique tient un procédé à un mode instable de $|\lambda|$ fixé par pas, à $f$ pas par seconde. Mesurer le contrôleur avec M0 et M1. Enregistrer les bits par pas de l'enregistrement. Forme du résultat : joules mesurés par pas divisés par $k_B T\ln 2\log_2|\lambda|$, rapportés comme distance au plancher. Balayer $|\lambda|$ et $f$.

<div id="89-living-agents-measured-ι" class="anchor-alias" aria-hidden="true"></div>

### 8.9 Agents vivants : ι mesurée

Forme du résultat : $\iota$ dans une préparation vivante, en bits par décision divisés par des joules par décision, tous deux pris dans la même préparation et rapportés avec la distance au plancher. Une $\iota$ vivante ne compte comme mesurée que lorsque les deux termes sont mesurés. Un chiffre en joules calculé à partir de conductances ou inféré à partir d'imagerie est classé comme `est_j`. La production d'entropie inférée à partir d'imagerie cérébrale est à gros grain et informationnelle, ce n'est donc pas un compteur de joules [257].

- **Chimiotaxie bactérienne.** Le débit d'information à partir du comportement de cellules individuelles dans un gradient défini, tel que Mattingly et ses collègues l'ont mesuré [213]. Les joules à partir de la consommation d'oxygène de la même culture, divisée par le nombre de cellules. Le plancher de comparaison est le coût de l'envoi d'un bit par le canal de signalisation de la cellule, d'après Bryant et Machta [197], à côté de $k_B T\ln 2$.
- **Cortex visuel de la souris.** L'information d'orientation par essai par imagerie à deux photons, et l'usage synaptique d'ATP par enregistrements en cellule entière, comme Padamsey et ses collègues ont obtenu les deux [250]. La restriction alimentaire déplace les joules. La réponse mesurée de l'information aux joules est le signe et la taille de $dX/dJ$ dans un cortex.
- **Mémoire de la mouche.** Le flux d'énergie dans les corps pédonculés pendant la formation de la mémoire à long terme, imagé comme l'ont fait Plaçais et ses collègues [252], par association apprise, avec la rétention comme confirmation. La survie sous jeûne et dessiccation est le coût en résultats [251, 253].

<div id="810-the-joule-price-of-prediction-first" class="anchor-alias" aria-hidden="true"></div>

### 8.10 Le prix en joules de la prédiction d'abord

Forme du résultat. Scinder les joules mesurés de chaque acte en la part du gabarit et le reste, $J_k = J_k^{R^*} + J_k^{\mathrm{act}}$. $J_k^{R^*}$ couvre l'écriture, le maintien et la réinitialisation de $R^*(a)$. Réinitialiser un gabarit de $H(R^*)$ bits d'entropie coûte au moins $H(R^*)\,k_B T\ln 2$ [6, 24]. La mémoire qui ne prédit pas coûte de la dissipation [54]. Un gabarit élève $\iota$ lorsque les joules d'acte qu'il économise dépassent ses propres joules. Le résultat mesuré est la courbe $\iota(w)$ en fonction de la largeur du gabarit $w$, les bits de $R^*$, avec son maximiseur $w^*$ et le rapport $\Delta J^{\mathrm{act}}/\Delta J^{R^*}$ à chaque pas.

Protocole. Fixer les tâches, les engrenages, les prédicats et les budgets. Faire varier $w$ sur une grille fixée d'avance. Un acte peut s'arrêter dès que son résultat est tranché par rapport au gabarit. Enregistrer `template_j` et les joules restants de l'acte pour chaque acte, sur les mêmes compteurs.

Éléments acquis : une prédiction confiante a abaissé jusqu'à 12% la consommation d'oxygène du cortex humain, mesurée par imagerie métabolique (prépublication) [254]. Dans les réseaux cellulaires, les bits du passé qui prédisent le mieux l'avenir sont d'un coût prohibitif [198]. Dans les boucles perception-action, les agents efficaces en travail équilibrent prédiction et oubli [234].

<div id="811-first-run-a-metered-acceptor-on-a-laptop" class="anchor-alias" aria-hidden="true"></div>

<div id="811-first-run-a-kernel-reported-acceptor-on-a-laptop" class="anchor-alias" aria-hidden="true"></div>

### 8.11 Première exécution : un accepteur à énergie rapportée par le noyau sur un ordinateur portable

Cette exécution applique les Sections 8.1 à 8.7 à une classe de tâches sur une machine. Le code, les ensembles de tâches, les reçus et l'analyse se trouvent dans le dépôt du site sous `experiments/agency-run`. Le préenregistrement et ses réfutateurs ont été validés en premier (e830bff). Le pilote et l'étalonnage verrouillé sont venus ensuite (5828420), puis l'exécution principale (35c967a).

**Méthode.**

- **Agent et tâche.** Un processus Python résout des grilles de Sudoku. Le prédicat de complétude $C(z)$ est satisfait lorsque la grille est pleine, que chaque ligne, colonne et boîte contient les chiffres 1 à 9 et que chaque chiffre donné est conservé. Une tâche confirmée crédite $b = n_{\mathrm{empty}}\log_2 9$ bits, le nombre de remplissages parmi lesquels l'acte choisit. C'est la borne de capacité de la Définition 1. L'ensemble de test comprend 30 grilles, 10 par strate (facile, moyenne, difficile), générées à partir d'une graine fixe. Un ensemble distinct de 30 grilles étalonne les sélecteurs.
- **Engrenages.** g0 remplit les singletons nus. g1 ajoute les singletons cachés. g2 ajoute la recherche en profondeur.
- **Bras.** Le sélecteur de loi σ prend $a^* = \arg\max[H(a) - \lambda J(a)]$, avec $H(a)$ la probabilité de réussite étalonnée compte tenu des engrenages déjà essayés, multipliée par $b$, et $\lambda = b/B$. La cascade fixe (une instance de Mixture of Limits) prend l'engrenage le moins coûteux dont la probabilité de réussite étalonnée est d'au moins 0.5. Les deux fixent $R^*$ avant chaque acte, le hachent avec SHA-256 (Secure Hash Algorithm, 256 bits) et l'horodatent. Les deux comparent après l'acte et refusent avec un reçu lorsqu'aucun acte ne tient dans le budget. La référence aveugle au but tire un engrenage au hasard, sans prédiction, sans comparaison, sans escalade et sans refus. Le budget l'interrompt.
- **Budgets et graines.** Par tâche, $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, la médiane pilote de g2 seul. Les niveaux 0.5 et 1.0 sont contraignants : 98% et 40% des exécutions pilotes les dépassent. Le niveau 2.0 ne l'est pas (0.7%). Il y a 20 graines par condition, dans un ordre entrelacé déterminé par une graine. Au total, 5,400 épisodes ont été exécutés, avec 4,940 actes.
- **Étiquette d'énergie.** Chaque joule est `reported_j` : l'estimation de l'énergie par processus que le noyau fournit pour l'agent (`ri_energy_nj` issu de `proc_pid_rusage`), lue avant et après chaque acte, sans privilèges. Le processus est la paroi de l'agent. La grille de Sudoku est tenue à l'intérieur de ce processus, de sorte que le monde $W'$ n'est pas extérieur à $S$ comme l'exige la Définition 2. Cette exécution teste la cinématique et le classement soumis à la porte, non la définition. L'exécution qui teste la définition tient la grille dans un second processus derrière un socket, ou sur un microcontrôleur. `measured_j` est vide, car aucun wattmètre mural n'était branché. `est_j` vaut le nombre de cycles multiplié par $4.20 \times 10^{-10}$ J, le rapport médian du pilote.

**Résultats.** Moyenne ± écart type sur 20 graines. Une exécution est un bras à un niveau de budget sur l'ensemble des 30 tâches. Le CV est le coefficient de variation, écart type divisé par la moyenne.

| Bras | $B/J_{g2}$ | Tâches résolues sur 30 | $X$ (bits) | $J$ (rapporté, mJ) | $\iota$ (bits par joule rapporté) | CV de $\iota$ | Refus | Coupures | Dépassements |
|---|---|---|---|---|---|---|---|---|---|
| Loi σ | 0.5 | 0.60 ± 0.50 | 108 ± 91 | 20.8 ± 0.3 | 5,254 ± 4,402 | 0.84 | 29.40 | 0 | 0 |
| Loi σ | 1.0 | 9.10 ± 1.86 | 1,479 ± 316 | 43.8 ± 4.0 | 34,454 ± 10,007 | 0.29 | 20.90 | 0 | 9 |
| Loi σ | 2.0 | 28.40 ± 0.60 | 4,823 ± 105 | 66.2 ± 5.8 | 73,345 ± 6,443 | 0.09 | 1.60 | 0 | 0 |
| Cascade fixe (une instance de Mixture of Limits) | 0.5 | 0.70 ± 0.47 | 126 ± 85 | 18.8 ± 0.3 | 6,801 ± 4,569 | 0.67 | 29.30 | 0 | 0 |
| Cascade fixe (une instance de Mixture of Limits) | 1.0 | 6.45 ± 1.50 | 1,047 ± 254 | 44.7 ± 3.6 | 23,804 ± 7,067 | 0.30 | 23.55 | 0 | 7 |
| Cascade fixe (une instance de Mixture of Limits) | 2.0 | 27.50 ± 0.51 | 4,668 ± 92 | 67.0 ± 6.7 | 70,418 ± 7,766 | 0.11 | 2.50 | 0 | 0 |
| Aveugle au but | 0.5 | 0.25 ± 0.44 | 45 ± 80 | 14.1 ± 3.1 | 2,775 ± 4,999 | 1.80 | 0 | 20.35 | 20 |
| Aveugle au but | 1.0 | 3.85 ± 1.84 | 623 ± 301 | 26.6 ± 5.7 | 24,153 ± 13,364 | 0.55 | 0 | 17.45 | 0 |
| Aveugle au but | 2.0 | 18.25 ± 2.71 | 3,034 ± 471 | 34.1 ± 9.7 | 92,724 ± 15,690 | 0.17 | 0 | 1.35 | 0 |

- **Par acte.** 1,902 actes ont été confirmés. La $\iota$ médiane par acte était de $1.53 \times 10^5$ bits par joule rapporté, avec un intervalle interquartile de $8.3 \times 10^4$ à $4.7 \times 10^5$. Les joules par bit confirmé valaient au moins $3.8 \times 10^{14}$ fois $k_B T\ln 2$ à 300 K, avec une médiane de $2.3 \times 10^{15}$ fois. Le plancher permet $3.5 \times 10^{20}$ bits par joule.
- **Joules par tâche résolue.** La médiane sur les bras était de 0.34 à 0.38 mJ pour les tâches faciles, de 1.58 à 1.70 mJ pour les moyennes et de 4.05 à 4.28 mJ pour les difficiles.
- **Sélecteurs, appariés par graine (exploratoire, post hoc).** Cette analyse a été choisie après l'exécution, elle est donc exploratoire. À $B = 1.0\,J_{g2}$, le sélecteur de loi σ a résolu 2.65 tâches de plus par exécution que la cascade fixe (intervalle bootstrap à 95% de 1.5 à 3.8). Sa $\iota$ d'exécution était supérieure de 10,650 bits par joule (4,747 à 16,592). À $B = 2.0\,J_{g2}$, il en a résolu 0.9 de plus (0.55 à 1.25). La règle de la loi σ va droit à l'engrenage qui suffit, de sorte que les joules des tentatives légères échouées restent dans le budget. Les joules par tâche résolue étaient égaux : sur les 4 tâches que les deux bras ont résolues à $B = 1.0\,J_{g2}$, l'intervalle apparié allait de $-7.9$ à $+15.5$ µJ (R-F1).
- **Vérification croisée au niveau du paquet.** powermetrics, exécuté de façon non interactive sur des fenêtres de 30 s, a lu environ 12.1 W de puissance CPU et 13.6 W de puissance GPU provenant d'autres travaux sur la machine pendant que l'agent dormait. L'agent ajoutait environ 0.6 W sur son propre compteur. La puissance CPU d'arrière-plan variait d'environ 0.5 W d'une fenêtre à l'autre, de sorte que les joules du paquet diminués du repos sont sortis négatifs. Le compteur par processus est le compteur de l'exécution. D1 et D5 exigent un wattmètre mural sur une machine par ailleurs au repos.

**Issues des réfutateurs.** Tous ont été fixés avant l'exécution.

| ID | Observation | Issue |
|---|---|---|
| R-F1 | L'intervalle à 95% de la différence appariée par tâche de la médiane de $J^*$, loi σ moins cascade fixe, inclut zéro à chaque niveau contraignant | Déclenché. À $B = 1.0$, 4 tâches résolues par les deux : intervalle de $-7.9$ à $+15.5$ µJ. À $B = 0.5$, aucune tâche résolue par les deux. Sur les tâches que les deux résolvent, les joules sont égaux |
| R-F2 | Un épisode se termine au-dessus de son budget | Déclenché. 36 sur 5,400. Loi σ 9 et cascade fixe 7 à $B = 1.0$, de 0.07% à 3.6% au-dessus, lorsque la comparaison finale s'exécutait hors de la garde. Aveugle au but 20 à $B = 0.5$, jusqu'à 33% au-dessus, sur des budgets larges de quelques relevés du compteur |
| R-F3 | Rappel du refus inférieur à 0.9 sur les niveaux de tâche irréalisables, ou plus de 10% des refus sur des niveaux de tâche qu'un bras résout dans la moitié des graines | Déclenché. Rappel de 1.00 sur 41 niveaux de tâche irréalisables. 13.1% des refus portaient sur des niveaux de tâche qu'un bras a résolus |
| R-F4 | Tau-b de Kendall entre `est_j` et `reported_j` par acte inférieur à 0.8 | Non déclenché. 0.96 sur 4,000 actes |
| R-F5 | CV de la $\iota$ d'exécution supérieur à 0.25 dans une condition quelconque | Déclenché aux niveaux contraignants (0.29 à 1.80). Non déclenché à $B = 2.0$ (0.09, 0.11, 0.17) |
| R-F6 | Le classement par $J^*$ diffère du classement par $\iota$ intégrée | Déclenché. À $B = 2.0$, $J^*$ classe loi σ, cascade fixe, aveugle au but. La $\iota$ intégrée classe l'aveugle au but en premier. À $B = 1.0$, les deux derniers s'inversent |
| R-F7 | Un acte confirmé sous $k_B T\ln 2$ par bit | Non déclenché. L'acte le plus bas se situait $3.8 \times 10^{14}$ fois au-dessus |
| R-F8 | La $\iota$ d'exécution de l'aveugle au but au moins égale à celle du meilleur sélecteur à un niveau contraignant | Non déclenché. 2,775 contre 6,801 à $B = 0.5$. 24,153 contre 34,454 à $B = 1.0$ |

**Ce que l'exécution établit.**

- $\iota$ se lit sur les reçus, acte par acte et exécution par exécution, comme l'exigent les Propositions 5 et 6. Sous un budget lâche, elle est stable d'une graine à l'autre.
- $J^*$ est le classement, et la $\iota$ intégrée ne l'est pas. L'agent aveugle au but avait la $\iota$ d'exécution la plus élevée sous le budget lâche, en résolvant 18 tâches sur 30 contre 28. Ses échecs étaient bon marché. $J^*$ est soumis à la porte $C(z)$, il classe donc cet agent en dernier. C'est pourquoi la Section 2.3 classe par $J^*$, avec $X_{\mathrm{req}}$ comme porte.
- Exploratoire, post hoc : sous un budget contraignant, le sélecteur de loi σ a résolu plus de tâches que la cascade fixe, et les joules par tâche résolue étaient égaux. Le gain tient aux tâches qui entrent dans le budget, non à une résolution moins coûteuse de la même tâche. La Section 8.11.2 indique ce que les exécutions ultérieures répliquent.
- Deux corrections d'implémentation précèdent l'exécution suivante. La comparaison et l'écriture du reçu passent à l'intérieur de la région gardée. Un coût de clôture mesuré est imputé avant chaque acte.

La Figure 4 place la porte à côté du classement mesuré sous le budget lâche.

![Schéma et données. Les exécutions candidates passent par la porte C de z, X au moins égal à X requis. Celles qui la franchissent sont classées par J étoile, le minimum de joules jusqu'à l'achèvement correct ; celles qui échouent ne sont pas classées. En dessous, Exécution 1 au budget 2.0 : la loi σ a résolu 28.40 tâches sur 30 avec une iota d'exécution de 73,345 bits par joule ; la cascade fixe 27.50 avec 70,418 ; l'aveugle au but 18.25 avec 92,724. La seule iota intégrée classerait l'agent aveugle au but en premier.](/figures/agency/gate-then-rank.svg)

*Figure 4. D'abord la porte, puis le classement par les joules. Schéma avec les données de l'Exécution 1 à $B = 2.0\,J_{g2}$, moyennes sur 20 graines issues du tableau de résultats ci-dessus ; la seule $\iota$ intégrée classerait l'agent aveugle au but en premier (R-F6). Source : `experiments/agency-run/results`. Une [copie PNG](/figures/agency/gate-then-rank.png) est fournie.*

<div id="8111-second-run-guarded-acceptor-40-seeds" class="anchor-alias" aria-hidden="true"></div>

### 8.11.1 Deuxième exécution : accepteur gardé, 40 graines

Cette exécution porte sur la même classe de tâches, les mêmes engrenages et les trois mêmes bras qu'à la Section 8.11, sur le même ordinateur portable. Le préenregistrement de la deuxième exécution a été validé en premier (610dd4c). Le pilote et l'étalonnage verrouillé sont venus ensuite (c88511f), puis l'exécution principale (920d7e2). La Prédiction 1 n'a pas d'analogue logiciel dans cette exécution : l'agent n'a ni coût d'acte déclaré qui diminue avec le temps d'acte ni coût permanent qu'il contrôle, de sorte que le préenregistrement indique que le plan dose-réponse n'est pas exécuté.

**Méthode.**

- **Garde.** Chaque joule d'un épisode est imputé à l'intérieur de la garde : sélection, hachage, pas des engrenages, comparaison, reçu et lecture finale. La vérification d'ouverture utilise une dépense $= 0$. Les bras à loi refusent lorsque la garde échoue. Le bras aveugle au but est interrompu.
- **Seuil de refus.** Les deux sélecteurs utilisent le quantile $r$ des coûts d'étalonnage pour les tests d'ajustement au budget. $r$ a été verrouillé par rejeu de l'étalonnage avant l'exécution principale : $r = 0.1$, avec un rappel de 1.0 et une précision d'environ 0.976 sur la partition d'étalonnage.
- **Budgets et graines.** Par tâche, $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, la médiane pilote de g2 seul. Les niveaux 0.5 et 1.0 sont contraignants : les fractions pilotes qui les dépassent sont 0.98 et 0.4. Le niveau 2.0 ne l'est pas (0.0067). Il y a 40 graines par condition. Au total, 10,800 épisodes ont été exécutés.
- **Fenêtre calme.** Le calme n'a pas été obtenu. Les sondages ont tourné jusqu'à la limite. Le dernier sondage avant le démarrage, à 21:46 heure locale, a enregistré une utilisation CPU des autres processus proche de 621% d'un cœur, avec mediaanalysisd et des processus auxiliaires d'éditeur en tête. La puissance de référence du paquet était d'environ 21.4 W. La puissance du paquet dans la fenêtre principale était d'environ 22.7 W. L'exécution enregistre `quiet_window = no`.
- **Étiquette d'énergie.** Chaque joule est `reported_j` : l'estimation de l'énergie par processus que le noyau fournit pour l'agent (`ri_energy_nj` issu de `proc_pid_rusage`), avec des chiffres de paquet issus de powermetrics lorsqu'ils servent à la vérification croisée. `est_j` vaut le nombre de cycles multiplié par $1.783 \times 10^{-9}$ J, verrouillé dans le pilote. `measured_j` est vide : aucun wattmètre mural n'était branché.
- **Vérification croisée au niveau du paquet.** Dans la fenêtre principale, le compteur du processus a lu 42.35 J. Les joules nets du paquet étaient de 121.81 J, soit un rapport d'environ 2.88 au processus. La dérive de la référence du paquet était d'environ $-0.082$ W. Comme `quiet_window = no`, la vérification croisée est déclarée irréalisable. Le compteur par processus reste le compteur de l'exécution.

**Résultats.** Moyenne ± écart type sur 40 graines. Une exécution est un bras à un niveau de budget sur l'ensemble des 30 tâches. Le CV est le coefficient de variation, écart type divisé par la moyenne. $J$ est rapporté en millijoules pour la comparaison avec la Section 8.11.

| Bras | $B/J_{g2}$ | Tâches résolues sur 30 | $X$ (bits) | $J$ (rapporté, mJ) | $\iota$ (bits par joule rapporté) | CV de $\iota$ | Refus | Coupures | Dépassements |
|---|---|---|---|---|---|---|---|---|---|
| Loi σ | 0.5 | 0.62 ± 0.49 | 113 ± 89 | 59.5 ± 2.0 | 1,942 ± 1,525 | 0.785 | 29.38 | 0 | 0 |
| Loi σ | 1.0 | 2.90 ± 1.74 | 523 ± 314 | 133.7 ± 13.8 | 4,150 ± 2,892 | 0.697 | 27.10 | 0 | 0 |
| Loi σ | 2.0 | 22.73 ± 1.30 | 3,980 ± 206 | 197.3 ± 18.2 | 20,359 ± 2,388 | 0.117 | 7.28 | 0 | 0 |
| Cascade fixe (une instance de Mixture of Limits) | 0.5 | 0.57 ± 0.50 | 104 ± 90 | 60.1 ± 2.1 | 1,777 ± 1,548 | 0.871 | 29.43 | 0 | 0 |
| Cascade fixe (une instance de Mixture of Limits) | 1.0 | 2.67 ± 1.25 | 483 ± 226 | 140.3 ± 13.5 | 3,593 ± 1,948 | 0.542 | 27.32 | 0 | 0 |
| Cascade fixe (une instance de Mixture of Limits) | 2.0 | 19.93 ± 1.42 | 3,509 ± 227 | 201.2 ± 20.4 | 17,684 ± 2,909 | 0.164 | 10.07 | 0 | 0 |
| Aveugle au but | 0.5 | 0.12 ± 0.33 | 23 ± 61 | 35.4 ± 11.6 | 513 ± 1,397 | 2.723 | 0 | 22.85 | 0 |
| Aveugle au but | 1.0 | 1.00 ± 0.93 | 181 ± 169 | 72.0 ± 19.5 | 2,661 ± 2,579 | 0.969 | 0 | 20.00 | 0 |
| Aveugle au but | 2.0 | 10.65 ± 2.27 | 1,859 ± 400 | 97.3 ± 30.1 | 20,302 ± 5,766 | 0.284 | 0 | 8.70 | 0 |

- **Par acte.** 7,960 actes ont été exécutés. 2,448 ont été confirmés. Le tau-b de Kendall entre `est_j` et `reported_j` était de 0.942 sur 4,000 actes. La $\iota$ médiane par acte était d'environ $3.11 \times 10^{4}$ bits par joule rapporté. Chaque acte confirmé se situait bien au-dessus de $k_B T\ln 2$ par bit : le plus bas était à environ $6.4 \times 10^{14}$ fois ce plancher.
- **Refus.** Le rappel était de 1.0 sur 49 paires irréalisables. Il y a eu 5,223 refus. La part portant sur des tâches résolues par un bras était d'environ 0.081.
- **Dépassements.** Aucun épisode ne s'est terminé au-dessus du budget. La fraction de dépassement maximale était de $-0.03684$ : chaque épisode s'est achevé sous le budget.
- **Sélecteurs, appariés par graine.** Cette analyse était déclarée dans le préenregistrement. À $B = 2.0\,J_{g2}$, le sélecteur de loi σ a résolu 2.8 tâches de plus par exécution que la cascade fixe (intervalle bootstrap à 95% de 2.3 à 3.275). Sa $\iota$ d'exécution était supérieure de 2,674 bits par joule (1,831 à 3,504). Sur 39 graines sur 40, le sélecteur de loi σ en a résolu davantage. À $B = 0.5$ et $B = 1.0$, les intervalles de la différence de tâches résolues incluent zéro. Ces résultats ne déclenchent aucun réfutateur.

**Issues des réfutateurs.** Tous ont été fixés avant l'exécution. Le tableau donne l'issue de la deuxième exécution à côté de celle de la première.

| ID | Observation | Exécution 2 | Exécution 1 |
|---|---|---|---|
| R-F1 | À chaque niveau contraignant, l'intervalle à 95% de la différence appariée par tâche de la médiane de $J^*$, loi σ moins cascade fixe, inclut ou dépasse zéro | Non déclenché, car aucun intervalle n'a pu être formé : à $B = 1.0$ aucune tâche résolue par les deux, et à $B = 0.5$ une seule. Les joules des tâches communes ne montrent aucune économie de la loi σ | Déclenché |
| R-F2 | Un épisode se termine au-dessus de son budget | Non déclenché. 0 sur 10,800. La garde impute la comparaison, le reçu et la lecture finale | Déclenché |
| R-F3 | Rappel du refus inférieur à 0.9 sur les paires irréalisables, ou plus de 10% des refus sur des paires qu'un bras résout | Non déclenché. Rappel de 1.0 sur 49 paires irréalisables. Part sur des tâches résolues par un bras d'environ 0.081. Le seuil de refus par quantile $r$ est le changement par rapport à l'Exécution 1 | Déclenché |
| R-F4 | Tau-b de Kendall entre `est_j` et `reported_j` par acte inférieur à 0.8 | Non déclenché. 0.942 sur 4,000 actes | Non déclenché |
| R-F5 | CV de la $\iota$ d'exécution supérieur à 0.25 dans une condition quelconque | Déclenché aux niveaux contraignants (0.54 à 2.72) et pour le bras aveugle au but à $B = 2.0$ (0.284). Non déclenché pour les deux sélecteurs à $B = 2.0$ (0.117, 0.164) | Déclenché |
| R-F6 | Le classement par $J^*$ diffère du classement par $\iota$ intégrée | Déclenché. À $B = 2.0$, $J^*$ classe loi σ, cascade fixe, aveugle au but. La $\iota$ intégrée classe loi σ, aveugle au but, cascade fixe | Déclenché |
| R-F7 | Un acte confirmé sous $k_B T\ln 2$ par bit | Non déclenché. L'acte le plus bas se situait environ $6.4 \times 10^{14}$ fois au-dessus | Non déclenché |
| R-F8 | La $\iota$ d'exécution de l'aveugle au but au moins égale à celle du meilleur sélecteur à un niveau contraignant | Non déclenché. 513 contre 1,942 à $B = 0.5$. 2,661 contre 4,150 à $B = 1.0$ | Non déclenché |

**Ce que l'exécution établit.**

- La garde règle R-F2. Aucun dépassement.
- Le quantile de refus règle R-F3. Le rappel reste à 1.0 et la part des refus portant sur des tâches résolubles passe sous 10%.
- $J^*$ reste le classement. La $\iota$ intégrée le contredit encore sous le budget lâche (R-F6).
- La $\iota$ d'exécution reste instable d'une graine à l'autre sous les budgets contraignants (R-F5).
- R-F1 n'a tenu que parce que trop peu de tâches ont été résolues par les deux sélecteurs pour former un intervalle. Aucune exécution ne montre le sélecteur de loi σ résolvant une tâche commune avec moins de joules. Le gain apparié par graine à $B = 2.0$ consiste en davantage de tâches résolues, non en des résolutions moins coûteuses des mêmes tâches.

<div id="8112-second-machine-a-replication-with-a-package-energy-counter" class="anchor-alias" aria-hidden="true"></div>

### 8.11.2 Seconde machine : une réplication avec un compteur d'énergie du paquet

Cette exécution répète le protocole de la deuxième exécution de la Section 8.11.1 sur une seconde machine dotée d'un autre compteur d'énergie. C'est une réplication de la comparaison des sélecteurs, non une mesure d'énergie. Le code, les reçus et les synthèses se trouvent dans `experiments/agency-run` : `PREREGISTRATION_v2_jetson.md` et son Amendement 1, `results_jetson/summary.md` (partie A) et `results_jetson_cyc/summary.md` (partie B). L'addendum au préenregistrement a été validé en premier (cb059f0), puis le module du compteur et le banc d'essai (1938577), puis l'Amendement 1 (7703822). Le pilote de la partie A (6ddd086) et son exécution principale (a652503) sont venus ensuite, puis le pilote de la partie B (3fde1fb) et son exécution principale (1bb2444).

**Méthode.**

- **Machine.** Un ordinateur portable Linux doté d'un processeur x86 à 14 cœurs : 6 cœurs de performance à 2 fils chacun et 8 cœurs d'efficacité. Le turbo était désactivé. Chaque cœur était fixé à sa fréquence de base : 2.6 GHz sur les cœurs de performance et 1.9 GHz sur les cœurs d'efficacité. L'agent tournait fixé sur un fil d'un cœur de performance, un épisode à la fois. La fréquence médiane du cœur de l'agent pendant les blocs était de 2.6 GHz. Les réglages d'origine ont été rétablis après l'exécution.
- **Inchangé.** Les tâches, le prédicat, les bits couplés, les engrenages g0 à g2, les trois bras, la garde, le rejeu du refus, les niveaux de budget $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, les 40 graines et les 10,800 épisodes par partie, les réfutateurs R-F1 à R-F8 et l'analyse appariée par graine sont ceux de la Section 8.11.1.
- **Compteur d'énergie.** RAPL (Running Average Power Limit) est le compteur d'énergie du paquet intégré à la puce du processeur. Chaque intervalle s'est vu imputer les joules du paquet moins la puissance de référence au repos de ce bloc multipliée par les secondes de l'intervalle. RAPL est un modèle et un capteur internes à la puce, non un wattmètre mural. Il compte tous les processus du paquet.
- **Fenêtre calme.** Le calme n'a pas été obtenu : `quiet_window = no`. Un exécuteur de CI (intégration continue) compilait du code Rust sur la machine pendant toute la durée. Les 40 sondages avant le démarrage ont vu d'autres processus utiliser de 1.0 à 20.0 cœurs et une puissance du paquet de 2.3 à 28.7 W. La condition par bloc a été remplie avant 180 blocs sur 360 dans la partie A et 244 sur 360 dans la partie B. 98 et 208 blocs ont été calmes sur toute leur durée.
- **Partie A.** Le compteur de l'agent est RAPL, lu avant et après chaque acte. Chaque chiffre est `reported_j`.
- **Partie B.** L'Amendement 1 a ajouté cette partie avant tout pilote, car un test du banc d'essai a montré que les actes durent environ 0.01 à 6 ms alors que RAPL se met à jour environ toutes les 1 ms par pas d'environ 5 à 60 mJ. Le compteur de l'agent est `est_j` : les cycles utilisateur du fil de l'agent multipliés par $c$. $c$ a été étalonné sur RAPL dans le pilote de la partie B, net du repos, sur 8 tours de 3 s, à la seconde tentative : $c = 6.576 \times 10^{-10}$ J par cycle, à partir de 41.11 J d'énergie nette du paquet sur 62,516,635,701 cycles. Chaque chiffre en joules de la partie B est `est_j`. Les chiffres RAPL enregistrés à côté restent `reported_j`.
- **Étiquettes.** `measured_j` est vide dans les deux parties. Aucun wattmètre mural ni compteur à shunt n'était branché.
- **Noms des bras.** Les noms des bras et leurs champs dans le code suivent la Section 8.3. La référence aveugle au but est `blind`.

**Résultats de la partie A : RAPL lu à chaque acte.** Moyenne ± écart type sur 40 graines. $J$ est `reported_j` en joules, comme dans la synthèse. Les niveaux 0.5, 1.0 et 2.0 sont tous contraignants : 0.647, 0.40 et 0.353 des exécutions pilotes de g2 les dépassent.

| Bras | $B/J_{g2}$ | Tâches résolues sur 30 | $X$ (bits) | $J$ (rapporté, J) | $\iota$ (bits par joule rapporté) | CV de $\iota$ | Refus | Coupures | Dépassements |
|---|---|---|---|---|---|---|---|---|---|
| Loi σ | 0.5 | 0.00 | 0 | 0.0018 | 0 | s.o. | 30.00 | 0.00 | 323 |
| Loi σ | 1.0 | 0.00 | 0 | 0.0002 | 0 | s.o. | 30.00 | 0.00 | 322 |
| Loi σ | 2.0 | 1.00 ± 0.39 | 181 ± 71 | 0.0018 ± 0.0336 | 14,427 ± 18,680 | 1.295 | 29.00 | 0.00 | 322 |
| Cascade fixe (une instance de Mixture of Limits) | 0.5 | 0.00 | 0 | -0.0008 | 0 | s.o. | 30.00 | 0.00 | 326 |
| Cascade fixe (une instance de Mixture of Limits) | 1.0 | 0.00 | 0 | -0.0005 | 0 | s.o. | 30.00 | 0.00 | 324 |
| Cascade fixe (une instance de Mixture of Limits) | 2.0 | 1.00 ± 0.51 | 181 ± 91 | 0.0107 ± 0.0286 | 15,451 ± 23,767 | 1.538 | 29.00 | 0.00 | 320 |
| Aveugle au but | 0.5 | 0.00 | 0 | 0.0026 | 0 | s.o. | 0.00 | 30.00 | 327 |
| Aveugle au but | 1.0 | 0.00 | 0 | 0.0009 | 0 | s.o. | 0.00 | 30.00 | 323 |
| Aveugle au but | 2.0 | 0.28 ± 0.45 | 50 ± 82 | 0.0019 ± 0.0180 | 3,801 ± 13,749 | 3.618 | 0.00 | 28.90 | 321 |

- **Résolution du compteur.** L'épisode médian a duré environ 0.04 ms. 10,075 épisodes sur 10,800 n'ont vu aucun changement du compteur du paquet. 10,549 avaient un `reported_j` inférieur ou égal à zéro après soustraction du repos.
- **Budgets.** Les médianes pilotes de $J_{g2}$ allaient de $-0.0110$ à $0.0914$ J, médiane $0.0097$ J. Le seuil d'ouverture de la garde était de 0.117 J. Les budgets se situaient en dessous pour 30, 30 et 28 tâches sur 30 aux trois niveaux, de sorte que les bras à loi ont refusé presque toutes les tâches.
- **Dépassements.** Chaque condition a enregistré de 320 à 327 dépassements. La fraction de dépassement maximale était de 10.86. Une imputation qui lit zéro pour la plupart des actes et un pas entier du compteur pour quelques-uns ne peut pas tenir un budget de quelques millijoules.
- **Par acte.** 137 actes ont été exécutés. 91 ont été confirmés. 44 actes ont lu zéro. 26 actes confirmés ont lu zéro ou moins. Le tau-b de Kendall entre `est_j` et `reported_j` était de 0.368 sur 93 actes.
- **Vérification croisée.** Le net du paquet par bloc était de 3.445 J contre 2.737 J sommés sur les épisodes, soit un rapport de 0.794. La puissance du paquet au repos était de 4.01 W avant l'exécution et de 5.55 W après. La vérification croisée est déclarée irréalisable.
- **Sélecteurs, appariés par graine.** À $B = 2.0\,J_{g2}$, la différence de tâches résolues était de 0 (intervalle bootstrap à 95% de $-0.15$ à $0.15$). La différence de $\iota$ d'exécution était de 1,328 bits par joule rapporté ($-8,971$ à $12,581$). 30 graines sur 40 étaient à égalité. À 0.5 et 1.0, aucun bras n'a résolu de tâche.

**Résultats de la partie B : nombre de cycles multiplié par une constante étalonnée sur RAPL.** Moyenne ± écart type sur 40 graines. $J$ est `est_j` en joules, comme dans la synthèse. Les niveaux 0.5 et 1.0 sont contraignants : 0.98 et 0.40 des exécutions pilotes de g2 les dépassent. Le niveau 2.0 ne l'est pas (0.0).

| Bras | $B/J_{g2}$ | Tâches résolues sur 30 | $X$ (bits) | $J$ (estimé, J) | $\iota$ (bits par joule estimé) | CV de $\iota$ | Refus | Coupures | Dépassements |
|---|---|---|---|---|---|---|---|---|---|
| Loi σ | 0.5 | 1.10 ± 0.98 | 200 ± 178 | 0.0345 ± 0.0017 | 6,027 ± 5,458 | 0.906 | 28.90 | 0.00 | 0 |
| Loi σ | 1.0 | 8.75 ± 3.14 | 1,574 ± 565 | 0.0805 ± 0.0098 | 20,519 ± 8,516 | 0.415 | 21.25 | 0.00 | 0 |
| Loi σ | 2.0 | 28.60 ± 0.98 | 4,882 ± 154 | 0.1008 ± 0.0234 | 50,667 ± 10,088 | 0.199 | 1.40 | 0.00 | 0 |
| Cascade fixe (une instance de Mixture of Limits) | 0.5 | 1.15 ± 0.92 | 208 ± 167 | 0.0366 ± 0.0013 | 5,833 ± 4,757 | 0.816 | 28.85 | 0.00 | 0 |
| Cascade fixe (une instance de Mixture of Limits) | 1.0 | 9.22 ± 3.07 | 1,660 ± 551 | 0.0813 ± 0.0106 | 21,412 ± 8,130 | 0.380 | 20.77 | 0.00 | 0 |
| Cascade fixe (une instance de Mixture of Limits) | 2.0 | 27.77 ± 2.30 | 4,745 ± 377 | 0.1099 ± 0.0339 | 47,108 ± 13,216 | 0.281 | 2.23 | 0.00 | 0 |
| Aveugle au but | 0.5 | 0.20 ± 0.46 | 36 ± 84 | 0.0210 ± 0.0055 | 1,722 ± 3,927 | 2.280 | 0.00 | 21.50 | 0 |
| Aveugle au but | 1.0 | 3.73 ± 2.12 | 667 ± 381 | 0.0436 ± 0.0140 | 16,393 ± 9,246 | 0.564 | 0.00 | 16.68 | 0 |
| Aveugle au but | 2.0 | 15.65 ± 2.50 | 2,662 ± 433 | 0.0499 ± 0.0160 | 57,266 ± 14,596 | 0.255 | 0.00 | 4.17 | 0 |

- **Par acte.** 7,800 actes ont été exécutés. 3,847 ont été confirmés. La $\iota$ médiane par acte était de 69,892 bits par joule estimé, avec un intervalle interquartile de 35,759 à 146,697. Chaque acte confirmé se situait bien au-dessus de $k_B T\ln 2$ par bit : le plus bas à environ $3.6 \times 10^{14}$ fois ce plancher, la médiane à environ $5.0 \times 10^{15}$ fois.
- **Refus.** Le rappel était de 1.0 sur 45 paires irréalisables. Il y a eu 4,136 refus. La part portant sur des tâches résolues par un bras était d'environ 0.071.
- **Dépassements.** Aucun épisode ne s'est terminé au-dessus du budget. La fraction de dépassement maximale était de $-0.03977$.
- **Tâches communes.** À $B = 1.0$, 9 tâches ont été résolues par les deux sélecteurs. La différence appariée par tâche de la médiane de $J^*$, loi σ moins cascade fixe, avait une moyenne de $1.02 \times 10^{-4}$ J (intervalle à 95% de $-5.23 \times 10^{-4}$ à $6.03 \times 10^{-4}$, Wilcoxon $p = 0.214$). À $B = 0.5$, une tâche a été résolue par les deux, avec une différence de $-6.68 \times 10^{-6}$ J. À $B = 2.0$, 29 tâches ont été résolues par les deux, avec une différence moyenne de $-2.65 \times 10^{-4}$ J ($-6.63 \times 10^{-4}$ à $5.67 \times 10^{-5}$, $p = 0.358$).
- **Sélecteurs, appariés par graine.** À $B = 2.0\,J_{g2}$, le sélecteur de loi σ a résolu 0.825 tâche de plus par exécution que la cascade fixe (intervalle bootstrap à 95% de 0.125 à 1.575). Sa $\iota$ d'exécution était supérieure de 3,559 bits par joule estimé ($-1,068$ à $8,320$). 9 graines sur 40 ont favorisé le sélecteur de loi σ et 27 étaient à égalité. À $B = 0.5$, la différence de tâches résolues était de $-0.05$ ($-0.45$ à $0.35$). À $B = 1.0$, elle était de $-0.475$ ($-1.8$ à $0.775$).
- **L'estimation face au compteur.** Le tau-b de Kendall entre le `est_j` de chaque épisode et le net du paquet RAPL du même épisode était de $-0.037$ sur 4,000 épisodes. 5,258 épisodes sur 10,800 n'ont vu aucun changement du compteur du paquet. Sommé sur les blocs, `est_j` valait 23.23 J contre 17.14 J de net du paquet RAPL, soit un rapport de 1.355. La puissance du paquet au repos était de 9.37 W avant l'exécution et de 3.17 W après. La vérification croisée est déclarée irréalisable.

**Issues des réfutateurs.** Tous ont été fixés avant l'exécution. La partie B remplace R-F4 par le test par épisode contre RAPL, comme l'indique l'Amendement 1. Dans l'Exécution 2 et dans les deux parties présentées ici, « Non déclenché » signifie que l'observation ne s'est pas produite.

| ID | Observation | Partie A (RAPL par acte) | Partie B (modèle de cycles) | Exécution 2 |
|---|---|---|---|---|
| R-F1 | À chaque niveau contraignant, l'intervalle à 95% de la différence appariée par tâche de la médiane de $J^*$, loi σ moins cascade fixe, inclut ou dépasse zéro | Non déclenché, car aucun intervalle n'a pu être formé : une tâche résolue par les deux, à $B = 2.0$, avec une différence de $-0.0052$ J, et aucune aux autres niveaux | Non déclenché, car l'observation exige chaque niveau contraignant et $B = 0.5$ n'a qu'une tâche commune ($-6.68 \times 10^{-6}$ J) et pas d'intervalle. À $B = 1.0$, l'intervalle inclut zéro | Non déclenché |
| R-F2 | Un épisode se termine au-dessus de son budget | Déclenché. 320 à 327 par condition | Non déclenché. 0 sur 10,800 | Non déclenché |
| R-F3 | Rappel du refus inférieur à 0.9 sur les paires irréalisables, ou plus de 10% des refus sur des paires qu'un bras résout | Non déclenché. Rappel de 1.0 sur 88 paires. Part de 0.0011 | Non déclenché. Rappel de 1.0 sur 45 paires. Part de 0.071 | Non déclenché |
| R-F4 | Partie A : tau-b de Kendall entre `est_j` et `reported_j` par acte inférieur à 0.8. Partie B : tau-b entre le `est_j` par épisode et le net RAPL par épisode inférieur à 0.8 | Déclenché. 0.368 sur 93 actes | Déclenché. $-0.037$ sur 4,000 épisodes | Non déclenché |
| R-F5 | CV de la $\iota$ d'exécution supérieur à 0.25 dans une condition quelconque | Déclenché (1.295 à 3.618) | Déclenché. 0.380 à 2.280 aux niveaux contraignants. À $B = 2.0$ : loi σ 0.199, cascade fixe 0.281, aveugle au but 0.255 | Déclenché |
| R-F6 | Le classement par $J^*$ diffère du classement par $\iota$ intégrée | Déclenché. À $B = 2.0$, $J^*$ classe loi σ, cascade fixe, aveugle au but. La $\iota$ intégrée classe la cascade fixe en premier | Déclenché. À $B = 2.0$, $J^*$ classe loi σ, cascade fixe, aveugle au but. La $\iota$ intégrée classe aveugle au but, loi σ, cascade fixe | Déclenché |
| R-F7 | Un acte confirmé sous $k_B T\ln 2$ par bit | Déclenché. 26 actes confirmés ont lu zéro ou moins, ce qui les place sous le plancher. C'est la quantification du compteur | Non déclenché. L'acte le plus bas se situait environ $3.6 \times 10^{14}$ fois au-dessus | Non déclenché |
| R-F8 | La $\iota$ d'exécution de l'aveugle au but au moins égale à celle du meilleur sélecteur à un niveau contraignant | Déclenché. À $B = 0.5$ et $1.0$, chaque bras lit 0 | Non déclenché. 1,722 contre 6,027 à $B = 0.5$. 16,393 contre 21,412 à $B = 1.0$ | Non déclenché |

**Ce que la réplication établit.**

- RAPL par acte ne peut pas mesurer des actes plus courts qu'une milliseconde. La plupart des épisodes n'ont vu aucune mise à jour du compteur, de sorte que la garde a refusé ou dépassé du seul fait de la quantification. La partie A est un résultat de résolution du compteur. Elle ne dit rien des sélecteurs.
- Avec un compteur de cycles, le résultat de sélection a le même signe que l'Exécution 2 à $B = 2.0$ : le sélecteur de loi σ a résolu plus de tâches par exécution. Le gain est plus faible (0.825 contre 2.8), et le niveau 2.0 n'était pas contraignant sur cette machine. Aux niveaux contraignants, les intervalles incluent zéro.
- Le modèle de cycles n'a pas suivi le compteur du paquet épisode par épisode (tau-b de $-0.037$), et son total par bloc valait 1.355 fois le net du compteur. Les joules de la partie B classent les actes par cycles. Ce ne sont pas des lectures d'énergie.
- Les joules des tâches communes ne montrent ici non plus aucune économie de la loi σ. Là où le sélecteur de loi σ gagne, il gagne en tâches résolues, non en résolution moins coûteuse de la même tâche.
- Aucun chiffre de cette section n'est `measured_j`.

La Figure 5 place côte à côte les résultats en tâches résolues des trois exécutions.

![Trois panneaux en diagrammes à barres des tâches résolues sur 30 par bras et par niveau de budget pour l'Exécution 1, l'Exécution 2 et la partie B de la seconde machine. Au niveau lâche 2.0, le sélecteur de loi σ a résolu 28.40, 22.73 et 28.60 ; la cascade fixe 27.50, 19.93 et 27.77 ; la référence aveugle au but 18.25, 10.65 et 15.65. Les barres d'erreur indiquent un écart type.](/figures/agency/run-results.svg)

*Figure 5. Tâches résolues sur 30 dans trois exécutions préenregistrées. Figure de données : moyenne ± un écart type sur les graines, d'après les tableaux de résultats des Sections 8.11, 8.11.1 et 8.11.2 (partie B). Sources : `experiments/agency-run/results`, `results2` et `results_jetson_cyc`. Une [copie PNG](/figures/agency/run-results.png) est fournie.*

**Ce qui se réplique, et ce qui ne se réplique pas.** Le résultat des sélecteurs de l'exécution 1 était exploratoire. Deux exécutions ultérieures l'ont testé sous préenregistrement.

| Affirmation issue de l'exécution 1 (exploratoire) | Exécution 2 (préenregistrée) | Seconde machine, partie B (préenregistrée) |
|---|---|---|
| Plus de tâches résolues à $B = 1.0\,J_{g2}$ : +2.65 (1.5 à 3.8) | Non répliqué. L'intervalle inclut zéro | Non répliqué. $-0.475$ ($-1.8$ à $0.775$) |
| Plus de tâches résolues à $B = 2.0\,J_{g2}$ : +0.9 (0.55 à 1.25) | Répliqué. +2.8 (2.3 à 3.275) | Répliqué. +0.825 (0.125 à 1.575) |
| Joules par tâche résolue | Égaux. Aucune économie sur les tâches communes | Égaux. Les intervalles des tâches communes incluent zéro |

Le résultat répliqué est étroit. Au niveau de budget le plus lâche, le sélecteur de loi σ résout plus de tâches que la cascade fixe, sur deux machines. Aucune exécution ne montre moins de joules pour une même tâche résolue, et le gain de l'exécution 1 sous budget contraignant ne s'est pas répliqué. La partie A est un résultat de résolution du compteur et ne teste aucune des deux affirmations.

**Protocole de mesure pour la prochaine exécution.** Les deux parties échouent au niveau du compteur, de sorte que le protocole change avant que les sélecteurs soient de nouveau testés.

1. **Machine au repos.** N'arrêter rien qui appartienne à quelqu'un d'autre. Attendre une fenêtre calme, ou en planifier une : les autres processus à 0.5 cœur ou moins pendant toute l'exécution, avec `quiet_window = yes` enregistré. Si le calme n'est pas atteint, l'exécution ne démarre pas.
2. **Wattmètre mural ou compteur à shunt.** Brancher un wattmètre mural, ou un compteur à shunt sur le rail d'alimentation, échantillonné plus vite qu'un acte. Seules ses lectures remplissent `measured_j`.
3. **D'abord la vérification de la résolution.** Avant le pilote, enregistrer l'intervalle de mise à jour et la taille du pas du compteur au regard de la durée médiane d'un acte. Si le compteur ne peut pas résoudre un acte, mesurer des blocs d'actes et attribuer par décompte, et l'indiquer dans le préenregistrement.
4. **Étalonner l'estimation sur le compteur.** Ajuster `est_j` sur le wattmètre mural ou le compteur à shunt au niveau des blocs, et exiger que R-F4 ne soit pas déclenché avant que `est_j` pilote la garde.
5. **Fixer et enregistrer.** Fixer la fréquence, enregistrer les références au repos avant et après, rapporter la dérive et conserver le compteur du paquet comme vérification croisée étiquetée.
6. **La résolution des tâches est le critère principal.** Le préenregistrement de la prochaine exécution fait de la résolution des tâches le critère d'évaluation principal : la différence appariée par graine des tâches résolues, loi σ moins cascade fixe, à chaque niveau de budget, avec la correction descendante de Holm entre les niveaux. Les joules des tâches communes (R-F1) sont secondaires.

<div id="812-reporting" class="anchor-alias" aria-hidden="true"></div>

### 8.12 Présentation des résultats

Publier tous les reçus, les traces brutes des compteurs, les références au repos et le code d'analyse avec le résultat. Rapporter les joules mesurés, rapportés et estimés dans des colonnes distinctes. Ne jamais additionner d'un niveau à l'autre. Indiquer quels réfutateurs se sont déclenchés, avec la même visibilité que ceux qui ont tenu. Chaque exécution répond aussi à la liste de contrôle de Takahashi et Hayashi [239] : la frontière de la comptabilité ; les termes du bilan énergétique (énergie stockée et travail exporté, ou une déclaration qu'ils sont négligeables) ; la référence et le caractère total ou incrémental des joules ; le grain grossier des résultats ; l'horizon et le protocole de réinitialisation ; le temps d'horloge et la puissance moyenne à côté des bits par joule ; et l'estimateur des bits couplés avec sa correction de biais.

<div id="813-where-the-products-sit" class="anchor-alias" aria-hidden="true"></div>

### 8.13 Où se situent les produits

- **Notational Intelligence** est le format de reçu de la Section 8.5.
- **Mixture of Limits** est la philosophie qu'instancient les deux sélecteurs. Le bras 2 en est l'instance de cascade fixe.
- **Le Reality Code Engine** lit $\iota = dX/dJ$ a posteriori dans son journal chaîné par hachage, avec $X$ les tâches de programmation qui franchissent la porte et $J$ leurs joules étiquetés ([Le Reality Code Engine, Section 9](/papers/rce/#9-ties-to-the-companion-papers)).

Le positionnement du matériel et des produits figure dans le [livre blanc de Metabolic Intelligence](/products/mei/#where-the-products-sit). Les compteurs de ce plan sont M0 et M1 de la Section 8.1.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Références

Entries marked "preprint" are cited by their arXiv posting. Entries published in a language other than English say so.

1. Pearl, J. (1995). Causal diagrams for empirical research. *Biometrika* 82:669-688. https://doi.org/10.1093/biomet/82.4.669
2. Everitt, T., Hutter, M., Kumar, R. and Krakovna, V. (2019). Reward tampering problems and solutions in reinforcement learning: a causal influence diagram perspective. arXiv:1908.04734 (preprint).
3. Sagawa, T. and Ueda, M. (2008). Second law of thermodynamics with discrete quantum feedback control. *Physical Review Letters* 100:080403. https://doi.org/10.1103/PhysRevLett.100.080403
4. Sagawa, T. and Ueda, M. (2010). Generalized Jarzynski equality under nonequilibrium feedback control. *Physical Review Letters* 104:090602. https://doi.org/10.1103/PhysRevLett.104.090602
5. Sagawa, T. and Ueda, M. (2009). Minimal energy cost for thermodynamic information processing: measurement and information erasure. *Physical Review Letters* 102:250602. https://doi.org/10.1103/PhysRevLett.102.250602
6. Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development* 5:183-191. https://doi.org/10.1147/rd.53.0183
7. Bennett, C. H. (1982). The thermodynamics of computation: a review. *International Journal of Theoretical Physics* 21:905-940. https://doi.org/10.1007/BF02084158
8. Ay, N. and Polani, D. (2008). Information flows in causal networks. *Advances in Complex Systems* 11:17-41. https://doi.org/10.1142/S0219525908001465
9. Klyubin, A. S., Polani, D. and Nehaniv, C. L. (2005). Empowerment: a universal agent-centric measure of control. *2005 IEEE Congress on Evolutionary Computation* 1:128-135. https://doi.org/10.1109/CEC.2005.1554676
10. Kenton, Z., Kumar, R., Farquhar, S., Richens, J. et al. (2023). Discovering agents. *Artificial Intelligence* 322:103963. https://doi.org/10.1016/j.artint.2023.103963
11. James, R. G., Barnett, N. and Crutchfield, J. P. (2016). Information flows? A critique of transfer entropies. *Physical Review Letters* 116:238701. https://doi.org/10.1103/PhysRevLett.116.238701
12. Lizier, J. T. and Prokopenko, M. (2010). Differentiating information transfer and causal effect. *The European Physical Journal B* 73:605-615. https://doi.org/10.1140/epjb/e2010-00034-5
13. Janzing, D., Balduzzi, D., Grosse-Wentrup, M. and Schölkopf, B. (2013). Quantifying causal influences. *The Annals of Statistics* 41. https://doi.org/10.1214/13-AOS1145
14. Albantakis, L., Marshall, W., Hoel, E. and Tononi, G. (2019). What caused what? A quantitative account of actual causation using dynamical causal networks. *Entropy* 21:459. https://doi.org/10.3390/e21050459
15. Aguilera, M., Millidge, B., Tschantz, A. and Buckley, C. L. (2022). How particular is the physics of the free energy principle? *Physics of Life Reviews* 40:24-50. https://doi.org/10.1016/j.plrev.2021.11.001
16. Biehl, M., Pollock, F. A. and Kanai, R. (2021). A technical critique of some parts of the free energy principle. *Entropy* 23:293. https://doi.org/10.3390/e23030293
17. Bruineberg, J., Dołęga, K., Dewhurst, J. and Baltieri, M. (2022). The emperor's new Markov blankets. *Behavioral and Brain Sciences* 45:e183. https://doi.org/10.1017/S0140525X21002351
18. Orseau, L., McGregor McGill, S. and Legg, S. (2018). Agents and devices: a relative definition of agency. arXiv:1805.12387 (preprint).
19. Albantakis, L., Barbosa, L., Findlay, G., Grasso, M. et al. (2023). Integrated information theory (IIT) 4.0: formulating the properties of phenomenal existence in physical terms. *PLOS Computational Biology* 19:e1011465. https://doi.org/10.1371/journal.pcbi.1011465
20. Krakauer, D., Bertschinger, N., Olbrich, E., Flack, J. C. and Ay, N. (2020). The information theory of individuality. *Theory in Biosciences* 139:209-223. https://doi.org/10.1007/s12064-020-00313-7
21. Hoel, E. P., Albantakis, L. and Tononi, G. (2013). Quantifying causal emergence shows that macro can beat micro. *Proceedings of the National Academy of Sciences* 110:19790-19795. https://doi.org/10.1073/pnas.1314922110
22. Rosas, F. E., Mediano, P. A. M., Biehl, M., Chandaria, S. and Polani, D. (2020). Causal blankets: theory and algorithmic framework. In *Active Inference: IWAI 2020*, Communications in Computer and Information Science, Springer, pp. 187-198. https://doi.org/10.1007/978-3-030-64919-7_19
23. Shiraishi, N., Funo, K. and Saito, K. (2018). Speed limit for classical stochastic processes. *Physical Review Letters* 121:070601. https://doi.org/10.1103/PhysRevLett.121.070601
24. Esposito, M. and Van den Broeck, C. (2011). Second law and Landauer principle far from equilibrium. *EPL* 95:40004. https://doi.org/10.1209/0295-5075/95/40004
25. Barato, A. C. and Seifert, U. (2015). Thermodynamic uncertainty relation for biomolecular processes. *Physical Review Letters* 114:158101. https://doi.org/10.1103/PhysRevLett.114.158101
26. Gingrich, T. R., Horowitz, J. M., Perunov, N. and England, J. L. (2016). Dissipation bounds all steady-state current fluctuations. *Physical Review Letters* 116:120601. https://doi.org/10.1103/PhysRevLett.116.120601
27. Paneru, G., Dutta, S., Tlusty, T. and Pak, H. K. (2020). Reaching and violating thermodynamic uncertainty bounds in information engines. *Physical Review E* 102:032126. https://doi.org/10.1103/PhysRevE.102.032126
28. Potts, P. P. and Samuelsson, P. (2019). Thermodynamic uncertainty relations including measurement and feedback. *Physical Review E* 100:052137. https://doi.org/10.1103/PhysRevE.100.052137
29. Proesmans, K., Ehrich, J. and Bechhoefer, J. (2020). Finite-time Landauer principle. *Physical Review Letters* 125:100602. https://doi.org/10.1103/PhysRevLett.125.100602
30. Sivak, D. A. and Crooks, G. E. (2012). Thermodynamic metrics and optimal paths. *Physical Review Letters* 108:190602. https://doi.org/10.1103/PhysRevLett.108.190602
31. Margolus, N. and Levitin, L. B. (1998). The maximum speed of dynamical evolution. *Physica D* 120:188-195. https://doi.org/10.1016/S0167-2789(98)00054-2
32. Touchette, H. and Lloyd, S. (2000). Information-theoretic limits of control. *Physical Review Letters* 84:1156-1159. https://doi.org/10.1103/PhysRevLett.84.1156
33. Touchette, H. and Lloyd, S. (2004). Information-theoretic approach to the study of control systems. *Physica A* 331:140-172. https://doi.org/10.1016/j.physa.2003.09.007
34. Garrahan, J. P. (2017). Simple bounds on fluctuations and uncertainty relations for first-passage times of counting observables. *Physical Review E* 95:032134. https://doi.org/10.1103/PhysRevE.95.032134
35. Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development* 17:525-532. https://doi.org/10.1147/rd.176.0525
36. Sagawa, T. and Ueda, M. (2012). Fluctuation theorem with information exchange: role of correlations in stochastic thermodynamics. *Physical Review Letters* 109:180602. https://doi.org/10.1103/PhysRevLett.109.180602
37. Hartle, H., Wolpert, D., Stier, A., Kempes, C. P. and Manzano, G. (2024). Work extraction with feedback control using limited resources. arXiv:2407.05507 (preprint).
38. Horodecki, M. and Oppenheim, J. (2013). Fundamental limitations for quantum and nanoscale thermodynamics. *Nature Communications* 4:2059. https://doi.org/10.1038/ncomms3059
39. Parrondo, J. M. R., Horowitz, J. M. and Sagawa, T. (2015). Thermodynamics of information. *Nature Physics* 11:131-139. https://doi.org/10.1038/nphys3230
40. Seifert, U. (2012). Stochastic thermodynamics, fluctuation theorems and molecular machines. *Reports on Progress in Physics* 75:126001. https://doi.org/10.1088/0034-4885/75/12/126001
41. Conant, R. C. and Ashby, W. R. (1970). Every good regulator of a system must be a model of that system. *International Journal of Systems Science* 1:89-97. https://doi.org/10.1080/00207727008920220
42. Richens, J. and Everitt, T. (2024). Robust agents learn causal world models. *International Conference on Learning Representations (ICLR 2024)*, oral, honorable mention. arXiv:2402.10877.
43. Richens, J., Abel, D., Bellot, A. and Everitt, T. (2025). General agents contain world models. arXiv:2506.01622 (preprint).
44. Horowitz, J. M. and Esposito, M. (2014). Thermodynamics with continuous information flow. *Physical Review X* 4:031015. https://doi.org/10.1103/PhysRevX.4.031015
45. Ito, S. and Sagawa, T. (2013). Information thermodynamics on causal networks. *Physical Review Letters* 111:180603. https://doi.org/10.1103/PhysRevLett.111.180603
46. Hartich, D., Barato, A. C. and Seifert, U. (2014). Stochastic thermodynamics of bipartite systems: transfer entropy inequalities and a Maxwell's demon interpretation. *Journal of Statistical Mechanics* P02016. https://doi.org/10.1088/1742-5468/2014/02/P02016
47. Allahverdyan, A. E., Janzing, D. and Mahler, G. (2009). Thermodynamic efficiency of information and heat flow. *Journal of Statistical Mechanics* P09011. https://doi.org/10.1088/1742-5468/2009/09/P09011
48. Esposito, M. and Schaller, G. (2012). Stochastic thermodynamics for "Maxwell demon" feedbacks. *EPL* 99:30003. https://doi.org/10.1209/0295-5075/99/30003
49. Mandal, D. and Jarzynski, C. (2012). Work and information processing in a solvable model of Maxwell's demon. *PNAS* 109:11641-11645. https://doi.org/10.1073/pnas.1204263109
50. Boyd, A. B., Mandal, D. and Crutchfield, J. P. (2016). Identifying functional thermodynamics in autonomous Maxwellian ratchets. *New Journal of Physics* 18:023049. https://doi.org/10.1088/1367-2630/18/2/023049
51. Boyd, A. B., Mandal, D. and Crutchfield, J. P. (2018). Thermodynamics of modularity: structural costs beyond the Landauer bound. *Physical Review X* 8:031036. https://doi.org/10.1103/PhysRevX.8.031036
52. Wolpert, D. H. and Kolchinsky, A. (2020). Thermodynamics of computing with circuits. *New Journal of Physics* 22:063047. https://doi.org/10.1088/1367-2630/ab82b8
53. Kolchinsky, A. and Wolpert, D. H. (2017). Dependence of dissipation on the initial distribution over states. *Journal of Statistical Mechanics* 083202. https://doi.org/10.1088/1742-5468/aa7ee1
54. Still, S., Sivak, D. A., Bell, A. J. and Crooks, G. E. (2012). Thermodynamics of prediction. *Physical Review Letters* 109:120604. https://doi.org/10.1103/PhysRevLett.109.120604
55. Kolchinsky, A. and Wolpert, D. H. (2018). Semantic information, autonomous agency and non-equilibrium statistical physics. *Interface Focus* 8:20180041. https://doi.org/10.1098/rsfs.2018.0041
56. Ortega, P. A. and Braun, D. A. (2013). Thermodynamics as a theory of decision-making with information-processing costs. *Proceedings of the Royal Society A* 469:20120683. https://doi.org/10.1098/rspa.2012.0683
57. Kolchinsky, A. and Wolpert, D. H. (2020). Thermodynamic costs of Turing machines. *Physical Review Research* 2:033312. https://doi.org/10.1103/PhysRevResearch.2.033312
58. Kolchinsky, A. and Wolpert, D. H. (2021). Work, entropy production, and thermodynamics of information under protocol constraints. *Physical Review X* 11:041024. https://doi.org/10.1103/PhysRevX.11.041024
59. Manzano, G., Kardeş, G., Roldán, É. and Wolpert, D. H. (2024). Thermodynamics of computations with absolute irreversibility, unidirectional transitions, and stochastic computation times. *Physical Review X* 14:021026. https://doi.org/10.1103/PhysRevX.14.021026
60. Bérut, A., Arakelyan, A., Petrosyan, A., Ciliberto, S., Dillenschneider, R. and Lutz, E. (2012). Experimental verification of Landauer's principle linking information and thermodynamics. *Nature* 483:187-189. https://doi.org/10.1038/nature10872
61. Jun, Y., Gavrilov, M. and Bechhoefer, J. (2014). High-precision test of Landauer's principle in a feedback trap. *Physical Review Letters* 113:190601. https://doi.org/10.1103/PhysRevLett.113.190601
62. Orlov, A. O., Lent, C. S., Thorpe, C. C., Boechler, G. P. and Snider, G. L. (2012). Experimental test of Landauer's principle at the sub-k_BT level. *Japanese Journal of Applied Physics* 51:06FE10. https://doi.org/10.1143/JJAP.51.06FE10
63. Hong, J., Lambson, B., Dhuey, S. and Bokor, J. (2016). Experimental test of Landauer's principle in single-bit operations on nanomagnetic memory bits. *Science Advances* 2:e1501492. https://doi.org/10.1126/sciadv.1501492
64. Gavrilov, M. and Bechhoefer, J. (2016). Erasure without work in an asymmetric double-well potential. *Physical Review Letters* 117:200601. https://doi.org/10.1103/PhysRevLett.117.200601
65. Gavrilov, M., Chétrite, R. and Bechhoefer, J. (2017). Direct measurement of weakly nonequilibrium system entropy is consistent with Gibbs-Shannon form. *PNAS* 114:11097-11102. https://doi.org/10.1073/pnas.1708689114
66. Yan, L. L., Xiong, T. P., Rehan, K., Zhou, F., Liang, D. F. et al. (2018). Single-atom demonstration of the quantum Landauer principle. *Physical Review Letters* 120:210601. https://doi.org/10.1103/PhysRevLett.120.210601
67. Dago, S., Pereda, J., Barros, N., Ciliberto, S. and Bellon, L. (2021). Information and thermodynamics: fast and precise approach to Landauer's bound in an underdamped micromechanical oscillator. *Physical Review Letters* 126:170601. https://doi.org/10.1103/PhysRevLett.126.170601
68. Scandi, M., Barker, D., Lehmann, S., Dick, K. A., Maisi, V. F. and Perarnau-Llobet, M. (2022). Minimally dissipative information erasure in a quantum dot via thermodynamic length. *Physical Review Letters* 129:270601. https://doi.org/10.1103/PhysRevLett.129.270601
69. Toyabe, S., Sagawa, T., Ueda, M., Muneyuki, E. and Sano, M. (2010). Experimental demonstration of information-to-energy conversion and validation of the generalized Jarzynski equality. *Nature Physics* 6:988-992. https://doi.org/10.1038/nphys1821
70. Koski, J. V., Maisi, V. F., Pekola, J. P. and Averin, D. V. (2014). Experimental realization of a Szilard engine with a single electron. *PNAS* 111:13786-13789. https://doi.org/10.1073/pnas.1406966111
71. Koski, J. V., Maisi, V. F., Sagawa, T. and Pekola, J. P. (2014). Experimental observation of the role of mutual information in the nonequilibrium dynamics of a Maxwell demon. *Physical Review Letters* 113:030601. https://doi.org/10.1103/PhysRevLett.113.030601
72. Koski, J. V., Kutvonen, A., Khaymovich, I. M., Ala-Nissila, T. and Pekola, J. P. (2015). On-chip Maxwell's demon as an information-powered refrigerator. *Physical Review Letters* 115:260602. https://doi.org/10.1103/PhysRevLett.115.260602
73. Camati, P. A., Peterson, J. P. S., Batalhão, T. B., Micadei, K., Souza, A. M. et al. (2016). Experimental rectification of entropy production by Maxwell's demon in a quantum system. *Physical Review Letters* 117:240502. https://doi.org/10.1103/PhysRevLett.117.240502
74. Peterson, J. P. S., Sarthour, R. S., Souza, A. M., Oliveira, I. S., Goold, J. et al. (2016). Experimental demonstration of information to energy conversion in a quantum system at the Landauer limit. *Proceedings of the Royal Society A* 472:20150813. https://doi.org/10.1098/rspa.2015.0813
75. Cottet, N., Jezouin, S., Bretheau, L., Campagne-Ibarcq, P., Ficheux, Q. et al. (2017). Observing a quantum Maxwell demon at work. *PNAS* 114:7561-7564. https://doi.org/10.1073/pnas.1704827114
76. Masuyama, Y., Funo, K., Murashita, Y., Noguchi, A., Kono, S. et al. (2018). Information-to-work conversion by Maxwell's demon in a superconducting circuit quantum electrodynamical system. *Nature Communications* 9:1291. https://doi.org/10.1038/s41467-018-03686-y
77. Naghiloo, M., Alonso, J. J., Romito, A., Lutz, E. and Murch, K. W. (2018). Information gain and loss for a quantum Maxwell's demon. *Physical Review Letters* 121:030604. https://doi.org/10.1103/PhysRevLett.121.030604
78. Kumar, A., Wu, T.-Y., Giraldo, F. and Weiss, D. S. (2018). Sorting ultracold atoms in a three-dimensional optical lattice in a realization of Maxwell's demon. *Nature* 561:83-87. https://doi.org/10.1038/s41586-018-0458-7
79. Linpeng, X., Bresque, L., Maffei, M., Jordan, A. N. et al. (2022). Energetic cost of measurements using quantum, coherent, and thermal light. *Physical Review Letters* 128:220506. https://doi.org/10.1103/PhysRevLett.128.220506
80. Paneru, G., Lee, D. Y., Tlusty, T. and Pak, H. K. (2018). Lossless Brownian information engine. *Physical Review Letters* 120:020601. https://doi.org/10.1103/PhysRevLett.120.020601
81. Admon, T., Rahav, S. and Roichman, Y. (2018). Experimental realization of an information machine with tunable temporal correlations. *Physical Review Letters* 121:180601. https://doi.org/10.1103/PhysRevLett.121.180601
82. Ribezzi-Crivellari, M. and Ritort, F. (2019). Large work extraction and the Landauer limit in a continuous Maxwell demon. *Nature Physics* 15:660-664. https://doi.org/10.1038/s41567-019-0481-0
83. Debiossac, M., Grass, D., Alonso, J. J., Lutz, E. and Kiesel, N. (2020). Thermodynamics of continuous non-Markovian feedback control. *Nature Communications* 11:1360. https://doi.org/10.1038/s41467-020-15148-5
84. Saha, T. K., Lucero, J. N. E., Ehrich, J., Sivak, D. A. and Bechhoefer, J. (2021). Maximizing power and velocity of an information engine. *PNAS* 118:e2023356118. https://doi.org/10.1073/pnas.2023356118
85. Saha, T. K., Lucero, J. N. E., Ehrich, J., Sivak, D. A. and Bechhoefer, J. (2022). Bayesian information engine that optimally exploits noisy measurements. *Physical Review Letters* 129:130601. https://doi.org/10.1103/PhysRevLett.129.130601
86. Saha, T. K., Ehrich, J., Gavrilov, M., Still, S., Sivak, D. A. and Bechhoefer, J. (2023). Information engine in a nonequilibrium bath. *Physical Review Letters* 131:057101. https://doi.org/10.1103/PhysRevLett.131.057101
87. Barker, D., Scandi, M., Lehmann, S., Thelander, C., Dick, K. A., Perarnau-Llobet, M. and Maisi, V. F. (2022). Experimental verification of the work fluctuation-dissipation relation for information-to-work conversion. *Physical Review Letters* 128:040602. https://doi.org/10.1103/PhysRevLett.128.040602
88. Yan, L.-L., Bu, J.-T., Zeng, Q., Zhang, K., Cui, K.-F. et al. (2024). Experimental verification of demon-involved fluctuation theorems. *Physical Review Letters* 133:090402. https://doi.org/10.1103/PhysRevLett.133.090402
89. Zeng, Q. and Wang, J. (2021). New fluctuation theorems on Maxwell's demon. *Science Advances* 7:eabf1807. https://doi.org/10.1126/sciadv.abf1807
90. Demin, A. V. and Vityaev, E. E. (2014). Learning in a virtual model of the C. elegans nematode for locomotion and chemotaxis. *Biologically Inspired Cognitive Architectures* 7:9-14. https://doi.org/10.1016/j.bica.2013.11.005
91. Putintsev, N. I., Isupov, O. V. and Vityaev, E. E. (2015). Adaptive control system for a mobile agent in a physical environment based on functional systems theory. *Russian Journal of Genetics: Applied Research* 5:601-608. https://doi.org/10.1134/S2079059715060131
92. Rosenblueth, A., Wiener, N. and Bigelow, J. (1943). Behavior, purpose and teleology. *Philosophy of Science* 10:18-24. https://doi.org/10.1086/286788
93. Anokhin, P. K. (1968). The functional system as a unit of organism integrative activity. In *Systems Theory and Biology*, Springer, pp. 376-403. https://doi.org/10.1007/978-3-642-88343-9_15
94. Anokhin, P. K. (1974). The biological roots of the conditioned reflex. In *Biology and Neurophysiology of the Conditioned Reflex and Its Role in Adaptive Behavior*, Pergamon, pp. 1-24. https://doi.org/10.1016/B978-0-08-021516-7.50008-2
95. Sudakov, K. V. (1997). The theory of functional systems: general postulates and principles of dynamic organization. *Integrative Physiological and Behavioral Science* 32:392-414. https://doi.org/10.1007/BF02688634
96. Shvyrkov, V. B. (1980). Goal as a system-forming factor in behavior and learning. In *Neural Mechanisms of Goal-directed Behavior and Learning*, Academic Press, pp. 199-219. https://doi.org/10.1016/B978-0-12-688980-2.50018-7
97. Rosen, R. (2012). *Anticipatory Systems: Philosophical, Mathematical, and Methodological Foundations*, 2nd ed. Springer. https://doi.org/10.1007/978-1-4614-1269-4
98. Sterling, P. (2012). Allostasis: a model of predictive regulation. *Physiology & Behavior* 106:5-15. https://doi.org/10.1016/j.physbeh.2011.06.004
99. Virgo, N., Biehl, M. and McGregor, S. (2021). Interpreting dynamical systems as Bayesian reasoners. In *Machine Learning and Principles and Practice of Knowledge Discovery in Databases* (ECML PKDD 2021 workshops), Communications in Computer and Information Science, Springer, pp. 726-762. https://doi.org/10.1007/978-3-030-93736-2_52
100. Biehl, M. and Virgo, N. (2023). Interpreting systems as solving POMDPs: a step towards a formal understanding of agency. In *Active Inference: IWAI 2022*, Communications in Computer and Information Science 1721, Springer, pp. 16-31. https://doi.org/10.1007/978-3-031-28719-0_2
101. Maturana, H. R. and Varela, F. J. (1980). *Autopoiesis and Cognition: The Realization of the Living*. Reidel. https://doi.org/10.1007/978-94-009-8947-4
102. Kauffman, S. (2003). Molecular autonomous agents. *Philosophical Transactions of the Royal Society A* 361:1089-1099. https://doi.org/10.1098/rsta.2003.1186
103. Di Paolo, E. A. (2005). Autopoiesis, adaptivity, teleology, agency. *Phenomenology and the Cognitive Sciences* 4:429-452. https://doi.org/10.1007/s11097-005-9002-y
104. Barandiaran, X. and Moreno, A. (2006). On what makes certain dynamical systems cognitive: a minimally cognitive organization program. *Adaptive Behavior* 14:171-185. https://doi.org/10.1177/105971230601400208
105. Barandiaran, X. and Moreno, A. (2008). Adaptivity: from metabolism to behavior. *Adaptive Behavior* 16:325-344. https://doi.org/10.1177/1059712308093868
106. Barandiaran, X. E., Di Paolo, E. and Rohde, M. (2009). Defining agency: individuality, normativity, asymmetry, and spatio-temporality in action. *Adaptive Behavior* 17:367-386. https://doi.org/10.1177/1059712309343819
107. Ruiz-Mirazo, K. and Moreno, A. (2011). Autonomy in evolution: from minimal to complex life. *Synthese* 185:21-52. https://doi.org/10.1007/s11229-011-9874-z
108. Moreno, A. and Mossio, M. (2015). *Biological Autonomy: A Philosophical and Theoretical Enquiry*. Springer. https://doi.org/10.1007/978-94-017-9837-2
109. Montévil, M. and Mossio, M. (2015). Biological organisation as closure of constraints. *Journal of Theoretical Biology* 372:179-191. https://doi.org/10.1016/j.jtbi.2015.02.029
110. Aguilera, M. and Barandiaran, X. E. (2024). Thermina: a minimal model of autonomous agency from the lens of stochastic thermodynamics. *ALIFE 2024: Proceedings of the 2024 Artificial Life Conference*. https://doi.org/10.1162/isal_a_00826
111. Barandiaran, X. E. and Almendros, L. S. (2024). Transforming agency: on the mode of existence of large language models. arXiv:2407.10735 (preprint).
112. Levin, M. (2022). Technological approach to mind everywhere: an experimentally-grounded framework for understanding diverse bodies and minds. *Frontiers in Systems Neuroscience* 16:768201. https://doi.org/10.3389/fnsys.2022.768201
113. Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience* 11:127-138. https://doi.org/10.1038/nrn2787
114. Friston, K. (2013). Life as we know it. *Journal of the Royal Society Interface* 10:20130475. https://doi.org/10.1098/rsif.2013.0475
115. Rovelli, C. (2020). Agency in physics. arXiv:2007.05300 (preprint).
116. Jaeger, J. (2023). Artificial intelligence is algorithmic mimicry: why artificial "agents" are not (and won't be) proper agents. arXiv:2307.07515 (preprint).
117. Azadi, P. (2025). Computational irreducibility as the foundation of agency. arXiv:2505.04646 (preprint).
118. Wissner-Gross, A. D. and Freer, C. E. (2013). Causal entropic forces. *Physical Review Letters* 110:168702. https://doi.org/10.1103/PhysRevLett.110.168702
119. Kappen, H. J. (2013). Comment: causal entropic forces. arXiv:1312.4185 (preprint).
120. Fields, C., Goldstein, A. and Sandved-Smith, L. (2024). Making the thermodynamic cost of active inference explicit. *Entropy* 26:622. https://doi.org/10.3390/e26080622
121. Bartlett, S., Eckford, A. W., Egbert, M., Lingam, M. et al. (2025). Physics of life: exploring information as a distinctive feature of living systems. *PRX Life* 3:037003. https://doi.org/10.1103/rsx4-8x5f
122. Funo, K., Shiraishi, N. and Saito, K. (2019). Speed limit for open quantum systems. *New Journal of Physics* 21:013006. https://doi.org/10.1088/1367-2630/aaf9f5
123. Shiraishi, N. and Saito, K. (2021). Speed limit for open systems coupled to general environments. *Physical Review Research* 3:023074. https://doi.org/10.1103/PhysRevResearch.3.023074
124. Vo, V. T., Van Vu, T. and Hasegawa, Y. (2020). Unified approach to classical speed limit and thermodynamic uncertainty relation. *Physical Review E* 102:062132. https://doi.org/10.1103/PhysRevE.102.062132
125. Falasco, G. and Esposito, M. (2020). Dissipation-time uncertainty relation. *Physical Review Letters* 125:120604. https://doi.org/10.1103/PhysRevLett.125.120604
126. Ito, S. (2018). Stochastic thermodynamic interpretation of information geometry. *Physical Review Letters* 121:030605. https://doi.org/10.1103/PhysRevLett.121.030605
127. Ito, S. and Dechant, A. (2020). Stochastic time evolution, information geometry, and the Cramér-Rao bound. *Physical Review X* 10:021056. https://doi.org/10.1103/PhysRevX.10.021056
128. Nakazato, M. and Ito, S. (2021). Geometrical aspects of entropy production in stochastic thermodynamics based on Wasserstein distance. *Physical Review Research* 3:043093. https://doi.org/10.1103/PhysRevResearch.3.043093
129. Dechant, A., Sasa, S.-i. and Ito, S. (2022). Geometric decomposition of entropy production in out-of-equilibrium systems. *Physical Review Research* 4:L012034. https://doi.org/10.1103/PhysRevResearch.4.L012034
130. Van Vu, T. and Saito, K. (2023). Thermodynamic unification of optimal transport: thermodynamic uncertainty relation, minimum dissipation, and thermodynamic speed limits. *Physical Review X* 13:011013. https://doi.org/10.1103/PhysRevX.13.011013
131. Nagayama, R., Yoshimura, K. and Ito, S. (2025). Infinite variety of thermodynamic speed limits with general activities. *Physical Review Research* 7:013307. https://doi.org/10.1103/PhysRevResearch.7.013307
132. Yoshimura, K. and Ito, S. (2021). Thermodynamic uncertainty relation and thermodynamic speed limit in deterministic chemical reaction networks. *Physical Review Letters* 127:160601. https://doi.org/10.1103/PhysRevLett.127.160601
133. Aurell, E., Mejía-Monasterio, C. and Muratore-Ginanneschi, P. (2011). Optimal protocols and optimal transport in stochastic thermodynamics. *Physical Review Letters* 106:250601. https://doi.org/10.1103/PhysRevLett.106.250601
134. Hasegawa, Y. (2023). Unifying speed limit, thermodynamic uncertainty relation and Heisenberg principle via bulk-boundary correspondence. *Nature Communications* 14:2828. https://doi.org/10.1038/s41467-023-38074-8
135. Van Vu, T. and Hasegawa, Y. (2021). Geometrical bounds of the irreversibility in Markovian systems. *Physical Review Letters* 126:010601. https://doi.org/10.1103/PhysRevLett.126.010601
136. Delvenne, J.-C. and Falasco, G. (2024). Thermokinetic relations. *Physical Review E* 109:014109. https://doi.org/10.1103/PhysRevE.109.014109
137. Seifert, U. (2017). Stochastic thermodynamics: from principles to the cost of precision. arXiv:1707.03759 (lecture notes).
138. Horowitz, J. M. and Gingrich, T. R. (2017). Proof of the finite-time thermodynamic uncertainty relation for steady-state currents. *Physical Review E* 96:020103. https://doi.org/10.1103/PhysRevE.96.020103
139. Pietzonka, P., Barato, A. C. and Seifert, U. (2016). Universal bounds on current fluctuations. *Physical Review E* 93:052145. https://doi.org/10.1103/PhysRevE.93.052145
140. Proesmans, K. and Van den Broeck, C. (2017). Discrete-time thermodynamic uncertainty relation. *EPL* 119:20001. https://doi.org/10.1209/0295-5075/119/20001
141. Hasegawa, Y. and Van Vu, T. (2019). Fluctuation theorem uncertainty relation. *Physical Review Letters* 123:110602. https://doi.org/10.1103/PhysRevLett.123.110602
142. Dechant, A. and Sasa, S.-i. (2018). Entropic bounds on currents in Langevin systems. *Physical Review E* 97:062101. https://doi.org/10.1103/PhysRevE.97.062101
143. Lee, J. S., Park, J.-M. and Park, H. (2019). Thermodynamic uncertainty relation for underdamped Langevin systems driven by a velocity-dependent force. *Physical Review E* 100:062132. https://doi.org/10.1103/PhysRevE.100.062132
144. Lee, J. S., Park, J.-M. and Park, H. (2021). Universal form of thermodynamic uncertainty relation for Langevin dynamics. *Physical Review E* 104:L052102. https://doi.org/10.1103/PhysRevE.104.L052102
145. Dechant, A. and Sasa, S.-i. (2021). Improving thermodynamic bounds using correlations. *Physical Review X* 11:041061. https://doi.org/10.1103/PhysRevX.11.041061
146. Horowitz, J. M. and Gingrich, T. R. (2020). Thermodynamic uncertainty relations constrain non-equilibrium fluctuations. *Nature Physics* 16:15-20. https://doi.org/10.1038/s41567-019-0702-6
147. Barato, A. C. and Seifert, U. (2016). Cost and precision of Brownian clocks. *Physical Review X* 6:041053. https://doi.org/10.1103/PhysRevX.6.041053
148. Salazar, D. S. P. (2021). Information bound for entropy production from the detailed fluctuation theorem. *Physical Review E* 103:022122. https://doi.org/10.1103/PhysRevE.103.022122
149. Landi, G. T. and Paternostro, M. (2021). Irreversible entropy production: from classical to quantum. *Reviews of Modern Physics* 93:035008. https://doi.org/10.1103/RevModPhys.93.035008
150. Van Vu, T. and Hasegawa, Y. (2020). Thermodynamic uncertainty relations under arbitrary control protocols. *Physical Review Research* 2:013060. https://doi.org/10.1103/PhysRevResearch.2.013060
151. Tanogami, T., Van Vu, T. and Saito, K. (2023). Universal bounds on the performance of information-thermodynamic engine. *Physical Review Research* 5:043280. https://doi.org/10.1103/PhysRevResearch.5.043280
152. Kumasaki, K., Tojo, K., Sagawa, T. and Funo, K. (2026). Thermodynamic uncertainty relation for feedback cooling. *Physical Review E* 113:024134. https://doi.org/10.1103/4pq6-7djm
153. Honma, R. and Van Vu, T. (2026). Thermodynamic uncertainty relation with quantum feedback. *Physical Review Letters*. https://doi.org/10.1103/6d8l-94pv. Preprint: arXiv:2602.22651.
154. Gingrich, T. R. and Horowitz, J. M. (2017). Fundamental bounds on first passage time fluctuations for currents. *Physical Review Letters* 119:170601. https://doi.org/10.1103/PhysRevLett.119.170601
155. Schmiedl, T. and Seifert, U. (2007). Optimal finite-time processes in stochastic thermodynamics. *Physical Review Letters* 98:108301. https://doi.org/10.1103/PhysRevLett.98.108301
156. Proesmans, K., Ehrich, J. and Bechhoefer, J. (2020). Optimal finite-time bit erasure under full control. *Physical Review E* 102:032105. https://doi.org/10.1103/PhysRevE.102.032105
157. Zhen, Y.-Z., Egloff, D., Modi, K. and Dahlsten, O. (2021). Universal bound on energy cost of bit reset in finite time. *Physical Review Letters* 127:190602. https://doi.org/10.1103/PhysRevLett.127.190602
158. Esposito, M., Kawai, R., Lindenberg, K. and Van den Broeck, C. (2010). Efficiency at maximum power of low-dissipation Carnot engines. *Physical Review Letters* 105:150603. https://doi.org/10.1103/PhysRevLett.105.150603
159. Tu, Z. C. (2008). Efficiency at maximum power of Feynman's ratchet as a heat engine. *Journal of Physics A* 41:312003. https://doi.org/10.1088/1751-8113/41/31/312003
160. Shiraishi, N., Saito, K. and Tasaki, H. (2016). Universal trade-off relation between power and efficiency for heat engines. *Physical Review Letters* 117:190601. https://doi.org/10.1103/PhysRevLett.117.190601
161. Pietzonka, P. and Seifert, U. (2018). Universal trade-off between power, efficiency, and constancy in steady-state heat engines. *Physical Review Letters* 120:190602. https://doi.org/10.1103/PhysRevLett.120.190602
162. Ma, Y.-H., Xu, D., Dong, H. and Sun, C.-P. (2018). Universal constraint for efficiency and power of a low-dissipation heat engine. *Physical Review E* 98:042112. https://doi.org/10.1103/PhysRevE.98.042112
163. Tsirlin, A. M., Mironova, V. A., Amelkin, S. A. and Kazakov, V. (1998). Finite-time thermodynamics: conditions of minimal dissipation for thermodynamic processes with given rate. *Physical Review E* 58:215-223. https://doi.org/10.1103/PhysRevE.58.215
164. Lee, J. S., Lee, S., Kwon, H. and Park, H. (2022). Speed limit for a highly irreversible process and tight finite-time Landauer's bound. *Physical Review Letters* 129:120603. https://doi.org/10.1103/PhysRevLett.129.120603
165. Van Vu, T. and Saito, K. (2022). Finite-time quantum Landauer principle and quantum coherence. *Physical Review Letters* 128:010602. https://doi.org/10.1103/PhysRevLett.128.010602
166. Rolandi, A. and Perarnau-Llobet, M. (2023). Finite-time Landauer principle beyond weak coupling. *Quantum* 7:1161. https://doi.org/10.22331/q-2023-11-03-1161
167. Kamijima, T., Funo, K. and Sagawa, T. (2024). Finite-time thermodynamic bounds and tradeoff relations for information processing. arXiv:2409.08606 (preprint).
168. Tkachenko, A. V. (2025). Thermodynamic cost of inference and learning in physical neural networks. arXiv:2503.09980 (preprint). Title of the current arXiv version.
169. Tatikonda, S. and Mitter, S. (2004). Control under communication constraints. *IEEE Transactions on Automatic Control* 49:1056-1068. https://doi.org/10.1109/TAC.2004.831187
170. Nair, G. N. and Evans, R. J. (2004). Stabilizability of stochastic linear systems with finite feedback data rates. *SIAM Journal on Control and Optimization* 43:413-436. https://doi.org/10.1137/S0363012902402116
171. Nair, G. N., Fagnani, F., Zampieri, S. and Evans, R. J. (2007). Feedback control under data rate constraints: an overview. *Proceedings of the IEEE* 95:108-137. https://doi.org/10.1109/JPROC.2006.887294
172. Sandberg, H., Delvenne, J.-C., Newton, N. J. and Mitter, S. K. (2014). Maximum work extraction and implementation costs for nonequilibrium Maxwell's demons. *Physical Review E* 90:042119. https://doi.org/10.1103/PhysRevE.90.042119
173. Horowitz, J. M. and Sandberg, H. (2014). Second-law-like inequalities with information and their interpretations. *New Journal of Physics* 16:125007. https://doi.org/10.1088/1367-2630/16/12/125007
174. Jacobs, K. (2009). Second law of thermodynamics and quantum feedback control: Maxwell's demon with weak measurements. *Physical Review A* 80:012322. https://doi.org/10.1103/PhysRevA.80.012322
175. Funo, K., Watanabe, Y. and Ueda, M. (2013). Integral quantum fluctuation theorems under measurement and feedback control. *Physical Review E* 88:052121. https://doi.org/10.1103/PhysRevE.88.052121
176. Guryanova, Y., Friis, N. and Huber, M. (2020). Ideal projective measurements have infinite resource costs. *Quantum* 4:222. https://doi.org/10.22331/q-2020-01-13-222
177. Danageozian, A., Wilde, M. M. and Buscemi, F. (2022). Thermodynamic constraints on quantum information gain and error correction: a triple trade-off. *PRX Quantum* 3:020318. https://doi.org/10.1103/PRXQuantum.3.020318
178. Wolpert, D. H. (2020). Minimal entropy production rate of interacting systems. *New Journal of Physics* 22:113013. https://doi.org/10.1088/1367-2630/abc5c6
179. Tasnim, F. and Wolpert, D. H. (2023). Stochastic thermodynamics of multiple co-evolving systems: beyond multipartite processes. *Entropy* 25:1078. https://doi.org/10.3390/e25071078
180. Wolpert, D. H. (2020). Uncertainty relations and fluctuation theorems for Bayes nets. *Physical Review Letters* 125:200602. https://doi.org/10.1103/PhysRevLett.125.200602
181. Rolandi, A., Abiuso, P. and Perarnau-Llobet, M. (2023). Collective advantages in finite-time thermodynamics. *Physical Review Letters* 131:210401. https://doi.org/10.1103/PhysRevLett.131.210401
182. Fujimoto, Y. and Ito, S. (2024). Game-theoretical approach to minimum entropy productions in information thermodynamics. *Physical Review Research* 6:013023. https://doi.org/10.1103/PhysRevResearch.6.013023
183. Lloyd, S. (2000). Ultimate physical limits to computation. *Nature* 406:1047-1054. https://doi.org/10.1038/35023282
184. Deffner, S. and Campbell, S. (2017). Quantum speed limits: from Heisenberg's uncertainty principle to optimal quantum control. *Journal of Physics A* 50:453001. https://doi.org/10.1088/1751-8121/aa86c6
185. Lan, G., Sartori, P., Neumann, S., Sourjik, V. and Tu, Y. (2012). The energy-speed-accuracy trade-off in sensory adaptation. *Nature Physics* 8:422-428. https://doi.org/10.1038/nphys2276
186. Mehta, P. and Schwab, D. J. (2012). Energetic costs of cellular computation. *PNAS* 109:17978-17982. https://doi.org/10.1073/pnas.1207814109
187. Lang, A. H., Fisher, C. K., Mora, T. and Mehta, P. (2014). Thermodynamics of statistical inference by cells. *Physical Review Letters* 113:148103. https://doi.org/10.1103/PhysRevLett.113.148103
188. Govern, C. C. and ten Wolde, P. R. (2014). Optimal resource allocation in cellular sensing systems. *PNAS* 111:17486-17491. https://doi.org/10.1073/pnas.1411524111
189. Sartori, P., Granger, L., Lee, C. F. and Horowitz, J. M. (2014). Thermodynamic costs of information processing in sensory adaptation. *PLoS Computational Biology* 10:e1003974. https://doi.org/10.1371/journal.pcbi.1003974
190. Barato, A. C., Hartich, D. and Seifert, U. (2013). Information-theoretic versus thermodynamic entropy production in autonomous sensory networks. *Physical Review E* 87:042104. https://doi.org/10.1103/PhysRevE.87.042104
191. Barato, A. C., Hartich, D. and Seifert, U. (2014). Efficiency of cellular information processing. *New Journal of Physics* 16:103024. https://doi.org/10.1088/1367-2630/16/10/103024
192. Ouldridge, T. E., Govern, C. C. and ten Wolde, P. R. (2017). Thermodynamics of computational copying in biochemical systems. *Physical Review X* 7:021004. https://doi.org/10.1103/PhysRevX.7.021004
193. Cao, Y., Wang, H., Ouyang, Q. and Tu, Y. (2015). The free-energy cost of accurate biochemical oscillations. *Nature Physics* 11:772-778. https://doi.org/10.1038/nphys3412
194. Zhang, D., Cao, Y., Ouyang, Q. and Tu, Y. (2019). The energy cost and optimal design for synchronization of coupled molecular oscillators. *Nature Physics* 16:95-100. https://doi.org/10.1038/s41567-019-0701-7
195. Sartori, P. and Tu, Y. (2015). Free energy cost of reducing noise while maintaining a high sensitivity. *Physical Review Letters* 115:118102. https://doi.org/10.1103/PhysRevLett.115.118102
196. Horowitz, J. M., Zhou, K. and England, J. L. (2017). Minimum energetic cost to maintain a target nonequilibrium state. *Physical Review E* 95:042102. https://doi.org/10.1103/PhysRevE.95.042102
197. Bryant, S. J. and Machta, B. B. (2023). Physical constraints in intracellular signaling: the cost of sending a bit. *Physical Review Letters* 131:068401. https://doi.org/10.1103/PhysRevLett.131.068401
198. Tjalma, A. J., Galstyan, V., Goedhart, J., Slim, L. et al. (2023). Trade-offs between cost and information in cellular prediction. *Proceedings of the National Academy of Sciences* 120:e2303078120. https://doi.org/10.1073/pnas.2303078120
199. Schreiber, T. (2000). Measuring information transfer. *Physical Review Letters* 85:461-464. https://doi.org/10.1103/PhysRevLett.85.461
200. Tishby, N. and Polani, D. (2011). Information theory of decisions and actions. In *Perception-Action Cycle*, Springer, pp. 601-636. https://doi.org/10.1007/978-1-4419-1452-1_19
201. Stratonovich, R. L. (2020). *Theory of Information and its Value* (English edition of the 1975 Russian monograph). Springer. https://doi.org/10.1007/978-3-030-22833-0
202. Pal, S., Saryal, S., Segal, D., Mahesh, T. S. and Agarwalla, B. K. (2020). Experimental study of the thermodynamic uncertainty relation. *Physical Review Research* 2:022044. https://doi.org/10.1103/PhysRevResearch.2.022044
203. Barker, D., Lehmann, S., Dick, K. A., Samuelsson, P. et al. (2025). Information thermodynamics in a quantum dot Szilard engine: experimentally investigating fluctuation theorems and thermodynamic uncertainty relations. arXiv:2511.08541 (preprint).
204. Friedman, H. M., Agarwalla, B. K., Shein-Lumbroso, O., Tal, O. and Segal, D. (2020). Thermodynamic uncertainty relation in atomic-scale quantum conductors. *Physical Review B* 101:195423. https://doi.org/10.1103/PhysRevB.101.195423
205. Hwang, W. and Hyeon, C. (2018). Energetic costs, precision, and transport efficiency of molecular motors. *Journal of Physical Chemistry Letters* 9:513-520. https://doi.org/10.1021/acs.jpclett.7b03197
206. Li, J., Horowitz, J. M., Gingrich, T. R. and Fakhri, N. (2019). Quantifying dissipation using fluctuating currents. *Nature Communications* 10:1666. https://doi.org/10.1038/s41467-019-09631-x
207. Ness, G., Lam, M. R., Alt, W., Meschede, D., Sagi, Y. and Alberti, A. (2021). Observing crossover between quantum speed limits. *Science Advances* 7:eabj9119. https://doi.org/10.1126/sciadv.abj9119
208. Pires, L. B., Goerlich, R., Luna da Fonseca, A., Debiossac, M., Hervieux, P.-A. et al. (2023). Optimal time-entropy bounds and speed limits for Brownian thermal shortcuts. *Physical Review Letters* 131:097101. https://doi.org/10.1103/PhysRevLett.131.097101
209. Oikawa, S., Nakayama, Y., Ito, S., Sagawa, T. and Toyabe, S. (2025). Experimentally achieving minimal dissipation via thermodynamically optimal transport. *Nature Communications* 16:10424. https://doi.org/10.1038/s41467-025-66519-9
210. Proesmans, K., Dreher, Y., Gavrilov, M., Bechhoefer, J. and Van den Broeck, C. (2016). Brownian duet: a novel tale of thermodynamic efficiency. *Physical Review X* 6:041010. https://doi.org/10.1103/PhysRevX.6.041010
211. Mancino, L., Cavina, V., De Pasquale, A., Sbroscia, M., Booth, R. I. et al. (2018). Geometrical bounds on irreversibility in open quantum systems. *Physical Review Letters* 121:160602. https://doi.org/10.1103/PhysRevLett.121.160602
212. Dago, S. and Bellon, L. (2022). Dynamics of information erasure and extension of Landauer's bound to fast processes. *Physical Review Letters* 128:070604. https://doi.org/10.1103/PhysRevLett.128.070604
213. Mattingly, H. H., Kamino, K., Machta, B. B. and Emonet, T. (2021). *Escherichia coli* chemotaxis is information limited. *Nature Physics* 17:1426-1431. https://doi.org/10.1038/s41567-021-01380-3
214. Blickle, V. and Bechinger, C. (2012). Realization of a micrometre-sized stochastic heat engine. *Nature Physics* 8:143-146. https://doi.org/10.1038/nphys2163
215. Martínez, I. A., Roldán, É., Dinis, L., Petrov, D., Parrondo, J. M. R. and Rica, R. A. (2016). Brownian Carnot engine. *Nature Physics* 12:67-70. https://doi.org/10.1038/nphys3518
216. Roldán, É., Martínez, I. A., Parrondo, J. M. R. and Petrov, D. (2014). Universal features in the energetics of symmetry breaking. *Nature Physics* 10:457-461. https://doi.org/10.1038/nphys2940
217. Krishnamurthy, S., Ghosh, S., Chatterji, D., Ganapathy, R. and Sood, A. K. (2016). A micrometre-sized heat engine operating between bacterial reservoirs. *Nature Physics* 12:1134-1138. https://doi.org/10.1038/nphys3870
218. Krishnamurthy, S., Ganapathy, R. and Sood, A. K. (2023). Overcoming power-efficiency tradeoff in a micro heat engine by engineered system-bath interactions. *Nature Communications* 14:6842. https://doi.org/10.1038/s41467-023-42350-y
219. Paneru, G., Dutta, S., Sagawa, T., Tlusty, T. and Pak, H. K. (2020). Efficiency fluctuations and noise induced refrigerator-to-heater transition in information engines. *Nature Communications* 11:1012. https://doi.org/10.1038/s41467-020-14823-x
220. Jung, T., Polani, D. and Stone, P. (2011). Empowerment for continuous agent-environment systems. *Adaptive Behavior* 19:16-39. https://doi.org/10.1177/1059712310392389
221. Salge, C., Glackin, C. and Polani, D. (2013). Empowerment: an introduction. arXiv:1310.1863 (preprint).
222. Kolchinsky, A. (2024). Thermodynamic dissipation does not bound replicator growth and decay rates. arXiv:2404.01130 (preprint).
223. Adlam, E. C., McQueen, K. J. and Waegell, M. (2025). Agency cannot be a purely quantum phenomenon. arXiv:2510.13247 (preprint).
224. Goldt, S. and Seifert, U. (2017). Stochastic thermodynamics of learning. *Physical Review Letters* 118:010601. https://doi.org/10.1103/PhysRevLett.118.010601
225. Still, S. (2020). Thermodynamic cost and benefit of memory. *Physical Review Letters* 124:050601. https://doi.org/10.1103/PhysRevLett.124.050601
226. Boyd, A. B., Crutchfield, J. P. and Gu, M. (2022). Thermodynamic machine learning through maximum work production. *New Journal of Physics* 24:083040. https://doi.org/10.1088/1367-2630/ac4309
227. Boyd, A. B., Crutchfield, J. P., Gu, M. and Binder, F. C. (2025). Thermodynamic overfitting and generalization: energetics of predictive intelligence. *New Journal of Physics* 27:063901. https://doi.org/10.1088/1367-2630/addf71
228. Ehrich, J., Still, S. and Sivak, D. A. (2023). Energetic cost of feedback control. *Physical Review Research* 5:023080. https://doi.org/10.1103/PhysRevResearch.5.023080
229. Ehrich, J. and Sivak, D. A. (2023). Energy and information flows in autonomous systems. *Frontiers in Physics* 11:1108357. https://doi.org/10.3389/fphy.2023.1108357
230. Wolpert, D. H. (2019). The stochastic thermodynamics of computation. *Journal of Physics A* 52:193001. https://doi.org/10.1088/1751-8121/ab0850
231. Levy, W. B. and Baxter, R. A. (1996). Energy efficient neural codes. *Neural Computation* 8:531-543. https://doi.org/10.1162/neco.1996.8.3.531
232. Balasubramanian, V., Kimber, D. and Berry, M. J., II (2001). Metabolically efficient information processing. *Neural Computation* 13:799-815. https://doi.org/10.1162/089976601300014358
233. Goldt, S. and Seifert, U. (2017). Thermodynamic efficiency of learning a rule in neural networks. *New Journal of Physics* 19:113001. https://doi.org/10.1088/1367-2630/aa89ff
234. Fiderer, L. J., Barth, P. C., Smith, I. D. and Briegel, H. J. (2025). Information thermodynamics of agents: the work capacity of channels with memory. arXiv:2504.06209 (preprint).
235. Elliott, T. J., Gu, M., Garner, A. J. P. and Thompson, J. (2022). Quantum adaptive agents with efficient long-term memories. *Physical Review X* 12:011007. https://doi.org/10.1103/PhysRevX.12.011007
236. Russell, S. J. and Subramanian, D. (1995). Provably bounded-optimal agents. *Journal of Artificial Intelligence Research* 2:575-609. https://doi.org/10.1613/jair.133
237. Genewein, T., Leibfried, F., Grau-Moya, J. and Braun, D. A. (2015). Bounded rationality, abstraction, and hierarchical decision-making: an information-theoretic optimality principle. *Frontiers in Robotics and AI* 2:27. https://doi.org/10.3389/frobt.2015.00027
238. Legg, S. and Hutter, M. (2007). Universal intelligence: a definition of machine intelligence. *Minds and Machines* 17:391-444. https://doi.org/10.1007/s11023-007-9079-x
239. Takahashi, K. and Hayashi, Y. (2026). Thermodynamic limits of physical intelligence. In *Artificial General Intelligence: 19th International Conference, AGI 2026, Proceedings, Part II*, Lecture Notes in Computer Science. Springer. https://doi.org/10.1007/978-3-032-33195-3_24. arXiv:2602.05463.
240. Ortega, P. A., Braun, D. A., Dyer, J., Kim, K.-E. and Tishby, N. (2015). Information-theoretic bounded rationality. arXiv:1512.06789 (preprint).
241. Zénon, A., Solopchuk, O. and Pezzulo, G. (2019). An information-theoretic perspective on the costs of cognition. *Neuropsychologia* 123:5-18. https://doi.org/10.1016/j.neuropsychologia.2018.09.013
242. Sims, C. R. (2016). Rate-distortion theory and human perception. *Cognition* 152:181-198. https://doi.org/10.1016/j.cognition.2016.03.020
243. Laughlin, S. B., de Ruyter van Steveninck, R. R. and Anderson, J. C. (1998). The metabolic cost of neural information. *Nature Neuroscience* 1:36-41. https://doi.org/10.1038/236
244. Attwell, D. and Laughlin, S. B. (2001). An energy budget for signaling in the grey matter of the brain. *Journal of Cerebral Blood Flow and Metabolism* 21:1133-1145. https://doi.org/10.1097/00004647-200110000-00001
245. Lennie, P. (2003). The cost of cortical computation. *Current Biology* 13:493-497. https://doi.org/10.1016/S0960-9822(03)00135-0
246. Sengupta, B., Stemmler, M., Laughlin, S. B. and Niven, J. E. (2010). Action potential energy efficiency varies among neuron types in vertebrates and invertebrates. *PLoS Computational Biology* 6:e1000840. https://doi.org/10.1371/journal.pcbi.1000840
247. Sengupta, B., Stemmler, M. B. and Friston, K. J. (2013). Information and efficiency in the nervous system: a synthesis. *PLoS Computational Biology* 9:e1003157. https://doi.org/10.1371/journal.pcbi.1003157
248. Levy, W. B. and Calvert, V. G. (2021). Communication consumes 35 times more energy than computation in the human cortex, but both costs are needed to predict synapse number. *Proceedings of the National Academy of Sciences* 118:e2008173118. https://doi.org/10.1073/pnas.2008173118
249. Harris, J. J., Jolivet, R., Engl, E. and Attwell, D. (2015). Energy-efficient information transfer by visual pathway synapses. *Current Biology* 25:3151-3160. https://doi.org/10.1016/j.cub.2015.10.063
250. Padamsey, Z., Katsanevaki, D., Dupuy, N. and Rochefort, N. L. (2022). Neocortex saves energy by reducing coding precision during food scarcity. *Neuron* 110:280-296.e10. https://doi.org/10.1016/j.neuron.2021.10.024
251. Plaçais, P.-Y. and Preat, T. (2013). To favor survival under food shortage, the brain disables costly memory. *Science* 339:440-442. https://doi.org/10.1126/science.1226018
252. Plaçais, P.-Y., de Tredern, É., Scheunemann, L., Trannoy, S. et al. (2017). Upregulated energy metabolism in the *Drosophila* mushroom body is the trigger for long-term memory. *Nature Communications* 8:15510. https://doi.org/10.1038/ncomms15510
253. Mery, F. and Kawecki, T. J. (2005). A cost of long-term memory in *Drosophila*. *Science* 308:1148. https://doi.org/10.1126/science.1111331
254. Hechler, A., de Lange, F. P. and Riedl, V. (2023). The energy metabolic footprint of predictive processing in the human brain. bioRxiv preprint, version 2 posted 2024. https://doi.org/10.1101/2023.12.08.570804
255. Malkin, J., O'Donnell, C., Houghton, C. J. and Aitchison, L. (2024). Signatures of Bayesian inference emerge from energy-efficient synapses. *eLife* 12:RP92595. https://doi.org/10.7554/eLife.92595
256. Li, H. L. and van Rossum, M. C. W. (2020). Energy efficient synaptic plasticity. *eLife* 9:e50804. https://doi.org/10.7554/eLife.50804
257. Lynn, C. W., Cornblath, E. J., Papadopoulos, L., Bertolero, M. A. and Bassett, D. S. (2021). Broken detailed balance and entropy production in the human brain. *Proceedings of the National Academy of Sciences* 118:e2109889118. https://doi.org/10.1073/pnas.2109889118
258. Horowitz, M. (2014). Computing's energy problem (and what we can do about it). *2014 IEEE International Solid-State Circuits Conference*, pp. 10-14. https://doi.org/10.1109/ISSCC.2014.6757323
259. Saad-Falcon, J., Narayan, A., Akengin, H. O., Griffin, J. W. et al. (2025). Intelligence per watt: measuring intelligence efficiency of local AI. arXiv:2511.07885 (preprint).
260. Tschand, A., Rajan, A. T. R., Idgunji, S., Ghosh, A. et al. (2025). MLPerf Power: benchmarking the energy efficiency of machine learning systems from μWatts to MWatts for sustainable AI. *2025 IEEE International Symposium on High Performance Computer Architecture (HPCA)*, 1201-1216. https://doi.org/10.1109/HPCA61900.2025.00092. arXiv:2410.12032.
261. Chung, J.-W., Ma, J. J., Wu, R., Liu, J. et al. (2025). The ML.ENERGY benchmark: toward automated inference energy measurement and optimization. arXiv:2505.06371 (preprint).
262. Niu, C., Zhang, W., Li, J., Zhao, Y. et al. (2025). TokenPowerBench: benchmarking the power consumption of LLM inference. arXiv:2512.03024 (preprint).
263. Jin, Y., Wei, G.-Y. and Brooks, D. (2025). The energy cost of reasoning: analyzing energy usage in LLMs with test-time compute. arXiv:2505.14733 (preprint).
264. Luccioni, S., Jernite, Y. and Strubell, E. (2024). Power hungry processing: watts driving the cost of AI deployment? *ACM FAccT 2024*, pp. 85-99. https://doi.org/10.1145/3630106.3658542
265. Samsi, S., Zhao, D., McDonald, J., Li, B. et al. (2023). From words to watts: benchmarking the energy costs of large language model inference. *2023 IEEE High Performance Extreme Computing Conference (HPEC)*, pp. 1-9. https://doi.org/10.1109/HPEC58863.2023.10363447
266. Dillavou, S., Stern, M., Liu, A. J. and Durian, D. J. (2022). Demonstration of decentralized physics-driven learning. *Physical Review Applied* 18:014040. https://doi.org/10.1103/PhysRevApplied.18.014040
267. Stern, M., Dillavou, S., Jayaraman, D., Durian, D. J. and Liu, A. J. (2024). Training self-learning circuits for power-efficient solutions. *APL Machine Learning* 2:016114. https://doi.org/10.1063/5.0181382
268. Saggio, V., Asenbeck, B. E., Hamann, A., Strömberg, T. et al. (2021). Experimental quantum speed-up in reinforcement learning agents. *Nature* 591:229-233. https://doi.org/10.1038/s41586-021-03242-7
269. Crosato, E., Spinney, R. E., Nigmatullin, R., Lizier, J. T. and Prokopenko, M. (2018). Thermodynamics and computation during collective motion near criticality. *Physical Review E* 97:012120. https://doi.org/10.1103/PhysRevE.97.012120
270. Chen, Q. and Prokopenko, M. (2025). Why collective behaviours self-organize to criticality: a primer on information-theoretic and thermodynamic utility measures. *Royal Society Open Science* 12:241655. https://doi.org/10.1098/rsos.241655
271. Khan, K. N., Hirki, M., Niemi, T., Nurminen, J. K. and Ou, Z. (2018). RAPL in action: experiences in using RAPL for power measurements. *ACM Transactions on Modeling and Performance Evaluation of Computing Systems* 3:1-26. https://doi.org/10.1145/3177754
272. Desrochers, S., Paradis, C. and Weaver, V. M. (2016). A validation of DRAM RAPL power measurements. *Proceedings of the Second International Symposium on Memory Systems*, pp. 455-470. https://doi.org/10.1145/2989081.2989088
273. Hackenberg, D., Schöne, R., Ilsche, T., Molka, D., Schuchart, J. and Geyer, R. (2015). An energy efficiency feature survey of the Intel Haswell processor. *2015 IEEE IPDPS Workshops*, pp. 896-904. https://doi.org/10.1109/IPDPSW.2015.70
274. Apple. powermetrics(1) manual page. macOS developer tools documentation.
275. Hutter Prize for Lossless Compression of Human Knowledge. http://prize.hutter1.net/
276. Strubell, E., Ganesh, A. and McCallum, A. (2019). Energy and policy considerations for deep learning in NLP. arXiv:1906.02243 (preprint).
277. Patterson, D., Gonzalez, J., Le, Q., Liang, C. et al. (2021). Carbon emissions and large neural network training. arXiv:2104.10350 (preprint).
278. Lacoste, A., Luccioni, A., Schmidt, V. and Dandres, T. (2019). Quantifying the carbon emissions of machine learning. arXiv:1910.09700 (preprint).
279. Luccioni, A. S., Viguier, S. and Ligozat, A.-L. (2022). Estimating the carbon footprint of BLOOM, a 176B parameter language model. arXiv:2211.02001 (preprint).
280. Anthony, L. F. W., Kanding, B. and Selvan, R. (2020). Carbontracker: tracking and predicting the carbon footprint of training deep learning models. arXiv:2007.03051 (preprint).
281. Elsworth, C., Huang, K., Patterson, D., Schneider, I. et al. (2025). Measuring the environmental impact of delivering AI at Google scale. arXiv:2508.15734 (preprint).
282. Schmidhuber, J. (2010). Formal theory of creativity, fun, and intrinsic motivation (1990-2010). *IEEE Transactions on Autonomous Mental Development* 2:230-247. https://doi.org/10.1109/TAMD.2010.2056368
283. Chollet, F. (2019). On the measure of intelligence. arXiv:1911.01547 (preprint).
284. ARC Prize Foundation. ARC-AGI leaderboard. https://arcprize.org/leaderboard (accessed 8 October 2026).
285. Hernández-Orallo, J. (2017). *The Measure of All Minds: Evaluating Natural and Artificial Intelligence*. Cambridge University Press. https://doi.org/10.1017/9781316594179
286. Hernández-Orallo, J. and Dowe, D. L. (2010). Measuring universal intelligence: towards an anytime intelligence test. *Artificial Intelligence* 174:1508-1539. https://doi.org/10.1016/j.artint.2010.09.006
287. Gershman, S. J., Horvitz, E. J. and Tenenbaum, J. B. (2015). Computational rationality: a converging paradigm for intelligence in brains, minds, and machines. *Science* 349:273-278. https://doi.org/10.1126/science.aac6076
288. Lieder, F. and Griffiths, T. L. (2020). Resource-rational analysis: understanding human cognition as the optimal use of limited computational resources. *Behavioral and Brain Sciences* 43:e1. https://doi.org/10.1017/S0140525X1900061X
289. Balasubramanian, V. (2021). Brain power. *PNAS* 118:e2107022118. https://doi.org/10.1073/pnas.2107022118
290. Silver, D., Singh, S., Precup, D. and Sutton, R. S. (2021). Reward is enough. *Artificial Intelligence* 299:103535. https://doi.org/10.1016/j.artint.2021.103535
291. Vamplew, P., Smith, B. J., Källström, J., Ramos, G., Rădulescu, R. et al. (2022). Scalar reward is not enough: a response to Silver, Singh, Precup and Sutton (2021). *Autonomous Agents and Multi-Agent Systems* 36:41. https://doi.org/10.1007/s10458-022-09575-5
292. Hafez, W., Wei, C., Pena, R., Nazeri, A. et al. (2026). A mathematical theory of agency and intelligence. arXiv:2602.22519 (preprint).
293. Karagoz, A. (2025). Energentic intelligence: from self-sustaining systems to enduring artificial life. arXiv:2506.04916 (preprint).
294. Chaisson, E. J. (2011). Energy rate density as a complexity metric and evolutionary driver. *Complexity* 16:27-40. https://doi.org/10.1002/cplx.20323
295. Poplavskii, R. P. (1975). Thermodynamic models of information processes. *Uspekhi Fizicheskikh Nauk* 115:465 (in Russian), https://doi.org/10.3367/UFNr.0115.197503d.0465. English translation: *Soviet Physics Uspekhi* 18:222-241, https://doi.org/10.1070/PU1975v018n03ABEH001955
296. Ito, S. and Sagawa, T. (2017). Information thermodynamics on networks and its application to biological information processing. *Butsuri* (日本物理学会誌) 72(9):658 (in Japanese). https://doi.org/10.11316/butsuri.72.9_658
297. Sun, C.-P. and Quan, H.-T. (2013). Maxwell's demon and the physical limits on information processing. *Wuli* (物理, Physics) 42(11) (in Chinese). doi:10.7693/wl20131101
298. Quan, H.-T., Dong, H. and Sun, C.-P. (2023). Theory and experiments of mesoscopic statistical thermodynamics. *Acta Physica Sinica* 72:230501 (in Chinese, with English abstract). https://doi.org/10.7498/aps.72.20231608
299. Parrondo, J. M. R. (2023). Thermodynamics of information. arXiv:2306.12447 (encyclopedia chapter preprint).
300. Strasberg, P. Thermodynamics and information processing at the nanoscale. Doctoral thesis, Technische Universität Berlin.
301. Dago, S. (2022). Thermodynamique stochastique: pilotage de micro-oscillateurs et applications à l'étude et l'optimisation du traitement de l'information. Doctoral thesis, École normale supérieure de Lyon (in French). https://theses.fr/2022LYSEN019
302. Lagoin, M. (2023). Thermodynamique dans les systèmes stationnaires hors équilibre macroscopiques: démons de Maxwell et machines thermiques aléatoires. Doctoral thesis, École normale supérieure de Lyon (in French).
303. Ciampini, M. A., Mancino, L., Orieux, A., Vigliar, C. et al. (2017). Experimental extractable work-based multipartite separability criteria. *npj Quantum Information* 3:10. https://doi.org/10.1038/s41534-017-0011-9
304. Sudakov, K. V. (2004). Functional systems theory and the probabilistic prediction of behavior. *Neuroscience and Behavioral Physiology* 34:505-507. https://doi.org/10.1023/B:NEAB.0000022638.96382.dd
305. Sudakov, K. V. (2015). Theory of functional systems: a keystone of integrative biology. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 153-173. https://doi.org/10.1007/978-3-319-19446-2_9
306. Sudakov, K. V. (2022). Cognitive activity from the perspective of functional systems theory. In *Russian Cognitive Neuroscience*, Brill, pp. 87-117. https://doi.org/10.1163/9789004505667_005
307. Shvyrkov, V. B. (1985). Toward a psychophysiological theory of behavior. *Advances in Psychology*, pp. 47-71. https://doi.org/10.1016/S0166-4115(08)61596-4
308. Anokhin, K. V. (2021). The cognitome: seeking the fundamental neuroscience of a theory of consciousness. *Neuroscience and Behavioral Physiology* 51:915-937. https://doi.org/10.1007/s11055-021-01149-4
309. Saltykov, A. and Grachev, S. (2015). Anticipation and the concept of system-forming factor in the theory of functional systems. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 507-520. https://doi.org/10.1007/978-3-319-19446-2_30
310. Vityaev, E. E. (2015). Purposefulness as a principle of brain activity. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 231-254. https://doi.org/10.1007/978-3-319-19446-2_13
311. Vityaev, E. E. and Demin, A. V. (2011). Recursive subgoals discovery based on the functional systems theory. *Frontiers in Artificial Intelligence and Applications* (BICA 2011), IOS Press. https://doi.org/10.3233/978-1-60750-959-2-425
312. Vityaev, E. E. and Demin, A. V. (2018). Cognitive architecture based on the functional systems theory. *Procedia Computer Science* 145:623-628. https://doi.org/10.1016/j.procs.2018.11.072
313. Vityaev, E., Kolonin, A., Kurpatov, A., Molchanov, A. et al. (2022). Brain principles programming. arXiv:2202.12710 (preprint).
314. Potapov, A., Belikov, A., Bogdanov, V., Scherbatiy, A. et al. (2019). Differentiable probabilistic logic networks. arXiv:1907.04592 (preprint).
315. Paninski, L. (2003). Estimation of entropy and mutual information. *Neural Computation* 15:1191-1253. https://doi.org/10.1162/089976603321780272
316. Russell, S. and Wefald, E. (1991). Principles of metareasoning. *Artificial Intelligence* 49:361-395. https://doi.org/10.1016/0004-3702(91)90015-C
317. Horvitz, E. J. (1987). Reasoning about beliefs and actions under computational resource constraints. *Proceedings of the Third Conference on Uncertainty in Artificial Intelligence (UAI 1987)*, 429-447. arXiv:1304.2759.
318. Simon, H. A. and Kadane, J. B. (1975). Optimal problem-solving search: all-or-none solutions. *Artificial Intelligence* 6:235-247. https://doi.org/10.1016/0004-3702(75)90002-8
319. Sekimoto, K. (1998). Langevin equation and thermodynamics. *Progress of Theoretical Physics Supplement* 130:17-27. https://doi.org/10.1143/PTPS.130.17
320. Wolpert, D. H., Korbel, J., Lynn, C. W., Tasnim, F., Grochow, J. A., Kardeş, G. et al. (2024). Is stochastic thermodynamics the key to understanding the energy costs of computation? *PNAS* 121:e2321112121. arXiv:2311.17166. https://doi.org/10.1073/pnas.2321112121
321. Chen, L., Zaharia, M. and Zou, J. (2023). FrugalGPT: how to use large language models while reducing cost and improving performance. arXiv:2305.05176 (preprint).
322. Ong, I., Almahairi, A., Wu, V., Chiang, W.-L. et al. (2024). RouteLLM: learning to route LLMs with preference data. arXiv:2406.18665 (preprint).
323. Koyuk, T. and Seifert, U. (2020). Thermodynamic uncertainty relation for time-dependent driving. *Physical Review Letters* 125:260604. arXiv:2005.02312. https://arxiv.org/abs/2005.02312
324. Jordan, S. P. (2017). Fast quantum computation at arbitrarily low energy. *Physical Review A* 95:032305. arXiv:1701.01175. https://arxiv.org/abs/1701.01175
325. Nemenman, I., Shafee, F. and Bialek, W. (2002). Entropy and inference, revisited. *Advances in Neural Information Processing Systems* 14. arXiv:physics/0108025. https://arxiv.org/abs/physics/0108025
326. Norton, J. D. (2005). Eaters of the lotus: Landauer's principle and the return of Maxwell's demon. *Studies in History and Philosophy of Modern Physics* 36:375-411. https://doi.org/10.1016/j.shpsb.2004.12.002
327. Maroney, O. J. E. (2005). The (absence of a) relationship between thermodynamic and logical reversibility. *Studies in History and Philosophy of Modern Physics* 36:355-374. arXiv:physics/0406137. https://arxiv.org/abs/physics/0406137
328. Sagawa, T. (2014). Thermodynamic and logical reversibilities revisited. *Journal of Statistical Mechanics* P03025. arXiv:1311.1886. https://arxiv.org/abs/1311.1886
329. López-Suárez, M., Neri, I. and Gammaitoni, L. (2016). Sub-kBT micro-electromechanical irreversible logic gate. *Nature Communications* 7:12068. https://doi.org/10.1038/ncomms12068
330. Paneru, G., Lee, D. Y., Park, J.-M., Park, J. T., Noh, J. D. and Pak, H. K. (2018). Optimal tuning of a Brownian information engine operating in a nonequilibrium steady state. *Physical Review E* 98:052119. https://doi.org/10.1103/PhysRevE.98.052119
331. Panizon, E. (2026). Optimal control of a mesoscopic information engine. arXiv:2603.29804 (preprint). https://arxiv.org/abs/2603.29804
332. Rolandi, A., Abiuso, P., Lipka-Bartosik, P. et al. (2026). Energy-time-accuracy tradeoffs in thermodynamic computing. arXiv:2601.04358 (preprint). https://arxiv.org/abs/2601.04358
333. Burnell, R., Schellaert, W., Burden, J. et al. (2023). Rethink reporting of evaluation results in AI. *Science* 380:136-138. https://doi.org/10.1126/science.adf6369
334. Zhou, L., Pacchiardi, L., Martínez-Plumed, F. et al. (2025). General scales unlock AI evaluation with explanatory and predictive power. arXiv:2503.06378 (preprint). https://arxiv.org/abs/2503.06378
335. Laber, M., Shafi, Z., Savcisens, G. et al. (2026). Scaling of capability and efficiency at inference time in large reasoning models. arXiv:2609.27166 (preprint). https://arxiv.org/abs/2609.27166
336. Erol, M. H., El, B., Suzgun, M., Yuksekgonul, M. and Zou, J. (2025). Cost-of-Pass: an economic framework for evaluating language models. arXiv:2504.13359 (preprint). https://arxiv.org/abs/2504.13359
337. Saad-Falcon, J., Narayan, A., Akengin, H. O. et al. (2025). Intelligence per Watt: measuring intelligence efficiency of local AI. arXiv:2511.07885 (preprint). https://arxiv.org/abs/2511.07885
338. Standard Performance Evaluation Corporation. SPECpower_ssj2008. https://www.spec.org/power_ssj2008/
339. Krakauer, D. C., Mitchell, M. and Krakauer, J. W. (2026). Large language models and emergence: a complex systems perspective. *Philosophical Transactions of the Royal Society A* 384:20250014. https://doi.org/10.1098/rsta.2025.0014. arXiv:2506.11135.
340. Krakauer, D. C. (2026). Competitive and complementary tools. arXiv:2607.18460 (preprint). https://arxiv.org/abs/2607.18460
341. Kimura, M. (1961). Natural selection as the process of accumulating genetic information in adaptive evolution. *Genetical Research* 2:127-140. https://doi.org/10.1017/S0016672300000616
342. Worden, R. P. (1995). A speed limit for evolution. *Journal of Theoretical Biology* 176:137-152. https://doi.org/10.1006/jtbi.1995.0183
343. Hledík, M., Barton, N. and Tkačik, G. (2022). Accumulation and maintenance of information in evolution. *PNAS* 119:e2123152119. https://doi.org/10.1073/pnas.2123152119
