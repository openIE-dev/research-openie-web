---
title: "RCE-VC : loi du contrôle de versions"
deck: "RCE-VC (référence de contrôle de versions, distincte du langage Reality Code Engine) admet chaque modification dans un état canonique unique du dépôt ou la refuse avec un motif enregistré, découpe les fichiers Rust et Python en éléments de niveau supérieur sans nom, et lit et écrit l'historique Git ordinaire. Les jalons M0, M1 et M2 sont implémentés au commit public aba99fce (49 tests hors ligne). À 100 000 unités sur Apple M5 Max, l'admission prend de 69,7 à 73,6 microsecondes et consomme de 317 à 365 microjoules d'énergie rusage noyau par processus (reported_j ; measured_j est non défini)."
lang: "fr"
source: "rce-vc"
complete: true
---

<div id="rce-vc-law-of-version-control" class="anchor-alias" aria-hidden="true"></div>

*Révision af57f48, 22 novembre 2026. Implémentation de référence : [openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc) à la révision [`aba99fcec4414a32bff30ab075668350d3fb80bf`](https://github.com/openIE-dev/rce-vc/tree/aba99fcec4414a32bff30ab075668350d3fb80bf) (13 novembre 2026), mettant à jour l'arborescence initiale `8bf9c9af` avec le découpage des éléments de niveau supérieur Rust/Python de `rcevc-keys`, la frontière `rcevc-core::assure` (`49` tests hors ligne) et les mesures d'admission `reported_j` sur Apple M5 Max enregistrées le 22 novembre 2026.*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

RCE-VC est une conception de contrôle de version et une petite référence en Rust. De nombreux rédacteurs, personnes ou programmes, soumettent des modifications à un état partagé. Un contrôle nommé accepte le résultat, ou la modification est refusée et la raison est conservée. Les rédacteurs peuvent rester sur Git. La référence n'est pas le langage Reality Code Engine. Il utilise le même encadrement : un Form, une étape totale, un journal chaîné par hachage, des clés sans nom, et une échelle d'engrenages avec un modèle en dernier.

**En termes simples**

1. Un nombre quelconque de personnes et de programmes peut écrire simultanément. Une modification entre dans l'historique partagé lorsqu'un contrôle nommé accepte le résultat. Si le contrôle ne l'accepte pas, la modification reste exclue et la raison est enregistrée. L'auteur ne décide pas.  
2. Les modifications qui ne touchent pas les mêmes éléments n'ont pas besoin d'attendre les unes les autres. Lorsqu'elles se chevauchent, un prix préalablement consigné classe les résultats qui passent, et un résultat accepté une fois, y compris un conflit résolu, est réutilisé. Un modèle est sollicité uniquement après l'échec des étapes moins coûteuses, et sa réponse doit encore passer le contrôle.  
3. La référence lit et écrit l'historique Git ordinaire et sépare désormais les fichiers Rust et Python en éléments de niveau supérieur sans nom (`rcevc-keys`), de sorte qu'un rédacteur n'ait pas besoin de quitter Git. Sur `aba99fce` avec Apple M5 Max, accepter une modification contre un dépôt de 100,000 unités a pris `69.7-73.6 µs` et `317-365 µJ` dans le noyau `ri_energy_nj` du système d'exploitation par processus (`reported_j`). Les champs de reçu `est_uj` restent une table d'entiers spécifiée (`424,153 µJ` de moyenne sur la même charge de travail), et aucun rail matériel externe ou moniteur mural n'était connecté (`measured_j = None`, `board_metered = false`).

<div id="terms-and-labels" class="anchor-alias" aria-hidden="true"></div>

## Termes et étiquettes

<ul id="terms">
<li>SHA : SHA-256, la fonction de hachage que la référence utilise pour les clés, les empreintes de contenu et le journal</li>
<li>BLAKE3 : une fonction de hachage cryptographique désignée comme cible de conception pour les clés internes ; la référence ne l'utilise pas encore</li>
<li>HAMT : hash array mapped trie (arbre à tableaux hachés), la table persistante qui contient l'état du dépôt</li>
<li>UTF : UTF-8, l'encodage de texte accepté par la mise en correspondance des fichiers Git</li>
<li>MSRV : version minimale supportée de Rust (`1.85` pour `rcevc-core` et `rcevc-proj-git`, `1.90` pour `rcevc-keys`)</li>
<li>CI : intégration continue (`cargo test --locked --offline --all-targets` sur `rustc 1.100.0`)</li>
<li>CAS : mise à jour de référence par comparaison et échange (`CasRef` et `GitDir::compare_and_swap_ref`)</li>
<li>FIPS : Federal Information Processing Standards (normes fédérales de traitement de l'information) ; les vérifications de SHA-256 utilisent les vecteurs de test de la norme FIPS 180-4</li>
<li>RFC : Request for Comments (demande de commentaires) ; le code de décompression suit les RFC 1950 et RFC 1951</li>
<li>SATB, CPU, GPU, PID, SMC, SoC : discipline de télémétrie Satiation Benchmark, unité centrale de traitement, processeur graphique, identifiant de processus, System Management Controller (contrôleur de gestion système) et système sur puce</li>
<li>VC1, VC2, VC3, VC4, VC5 : les cinq propositions testées par la référence, nommées avec leurs tests ci-dessous</li>
<li>CONGRA : un corpus mentionné dans les notes du projet pour un rejeu futur ; le nom n'est pas développé sur cette page</li>
<li>README : le fichier de présentation fourni dans le dépôt de référence</li>
</ul>

- **Mesuré (temps d'horloge et comptes)** signifie un temps d'horloge, un nombre d'instructions ou un nombre de chemins provenant de la version release (`aba99fce` sur Apple M5 Max, et la référence du README affichée à `8bf9c9af`).

- **Signalé (`reported_j` : compteurs L2 et L3)** signifie une lecture de compteur du système d'exploitation ou du puce sur Apple M5 Max (`macOS 27.2.1`) : `IOReport` complet via `macmon` (L2, étiquette hôte partagé `A2`, limité par Falsifier 6 à `<= 5.0%` dérive pré/post inactivité) et compteur noyau par PID `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (L3, étiquette `D`). Aucun rail matériel externe ni sonde d’alimentation secteur n’a été connecté (`measured_j = None`, `board_metered = false`).

- **Déclaré (`est_uj` / `est_j`)** signifie la table de coût entier par défaut copiée sur les reçus à l'intérieur de `rcevc-core`. Il s’agit d’une table analytique écrite dans le code source, jamais un compteur ou une lecture d’un mesureur d’horloge.

<div id="1-what-the-reference-is-and-what-it-is-not" class="anchor-alias" aria-hidden="true"></div>

## 1. Ce qu’est la référence, et ce qu’elle n’est pas

L’objectif du projet est une histoire que de nombreux humains et agents peuvent écrire simultanément, sans demander à un rédacteur d’arrêter d’utiliser Git. La formulation dans les notes du projet est que le branchement, la comparaison et la fusion dans une ligne principale constituent une ancienne interface, que la compatibilité est ce qui maintient cette interface en place, et qu’une règle déterministe doit décider partout où une règle le peut, avec un modèle en dernier.

Le Reality Code Engine (RCE) est un langage de programmation étudié dans son propre article sur ce site. RCE-VC n’est pas construit sur ce langage. Il n’analyse pas les programmes RCE, ne les émet pas et n’appelle pas le vérificateur RCE. Ce qu’il partage est la formulation : une Forme pour le dépôt, une étape déterministe totale appelée δ, un journal chaîné par hachage dont le pli est l’état, des clés sans nom, et une échelle de rouages dans laquelle un modèle s’exécute en dernier et n’est pas fiable.

Au commit `aba99fce` (`13 November 2026`), l’espace de travail public est en version 0.1.0 et contient **trois** crates :

1. `rcevc-core` est le noyau déterministe : pas d’horloge, pas d’aléatoire, pas d’E/S, aucune dépendance, et `#![forbid(unsafe_code)]` (MSRV `1.85`). Il inclut désormais également `rcevc-core::assure`, une frontière d’assurance garantissant qu’une action vérifiée n’est frappée qu’à partir d’un résultat déjà présent dans le journal de ce dépôt et ne s’applique qu’à la tête et à la porte contre lesquelles elle a été vérifiée, tandis que `CasRef` réessaie un identifiant d’opération afin qu’une cible identique d’un autre rédacteur ne soit jamais confondue avec un succès.
2. `rcevc-keys` divise les fichiers sources Rust (`.rs`) et Python (`.py`) en éléments de premier niveau en utilisant les versions fournies `tree-sitter 0.27.2`, `tree-sitter-rust 0.24.2` et `tree-sitter-python 0.25.0` (MSRV `1.90`, construit hors ligne à partir de `vendor/` avec un compilateur C et zéro récupération réseau). L’identifiant de chaque élément est la clé sans nom du noyau d’un corps de jeton normalisé, invariant aux renommages d’éléments, aux espaces blancs et aux commentaires, tandis que les octets originaux exacts restent dans `parts` afin que `project` les concatène de nouveau sans perte ; les chemins non `.rs`/`.py` ou les arbres d’erreur d’analyse retombent proprement sur une feuille unique sur les octets originaux.
3. `rcevc-proj-git` est la projection Git (`#![forbid(unsafe_code)]`, MSRV `1.85`), portant son propre code SHA-1, zlib et objets Git ainsi que `GitDir::compare_and_swap_ref` afin que le noyau reste exempt de dépendances.

La CI exécute `cargo test --locked --offline --all-targets` et `cargo clippy --locked --offline --all-targets -- -D warnings` sur `rustc 1.100.0`, en exécutant **49 tests hors ligne** (`29` dans `rcevc-core`, `8` dans `rcevc-keys` et `12` dans `rcevc-proj-git`, vérifiés contre `git 2.43`). Les propositions numérotées au-delà de VC5 ne sont pas énoncées sur cette page.

<div id="2-law-of-version-control" class="anchor-alias" aria-hidden="true"></div>

## 2. Loi du contrôle de versions

La référence énonce la loi comme suit. Le même paragraphe ouvre le README du dépôt ainsi que la documentation du crate. Il est cité ici une seule fois.

> Le contrôle de versions consiste en l'admission de modifications dans un état canonique du dépôt, sans nom. Chaque modification n'est admise que lorsqu'un vérificateur nommé accepte l'état résultant selon un contrat déclaré, ou bien elle est refusée avec un motif enregistré ; les modifications dont les fermetures de dépendances ne satisfont pas cette condition sont admises sans coordination ; parmi les intégrations admissibles, un coût déclaré ordonne les candidats ; et chaque résultat accepté, y compris chaque conflit résolu, est réutilisé.

La suite de cette page décrit ce que la référence à la révision `aba99fce` implémente, ce qui a été mesuré sur celle-ci, et ce qu'elle ne réalise pas encore. L'énoncé constitue la norme à laquelle la référence est construite. Il ne s'agit pas d'un rapport affirmant que les outils de contrôle de versions existants se comportent déjà ainsi.

<div id="3-quantities" class="anchor-alias" aria-hidden="true"></div>

## 3. Quantités

Une **unité** est un corps de texte accompagné d'une liste d'emplacements de dépendances. Si cette liste est vide, l'unité est une feuille et son corps est un texte littéral : un signe dollar dans un script shell reste donc un signe dollar. Si la liste n'est pas vide, un signe dollar suivi d'un index désigne une dépendance, et deux signes dollar désignent un signe dollar littéral.

La **clé** d'une unité est une identité indépendante des noms. Un renommage modifie le nom auquel un emplacement est lié, mais il ne modifie pas la clé. La référence définit

$$
\mathrm{key}(u) = H(\texttt{rcevc/unit/v1},\; \mathrm{body}(u),\; \mathrm{key}(d_0), \ldots, \mathrm{key}(d_{m-1}))
$$

où $H$ est SHA-256 appliqué par un encodeur versionné et à domaines séparés, et où $d_i$ sont les unités de dépendance. Le **condensat de contenu**, que le trie hache, est une valeur différente : $H(\mathrm{body}, \text{dependency names})$.

Un **brouillon** est une table non validée, utilisée pour la genèse et pour toute donnée lue depuis l'extérieur. Le scellement d'un brouillon le vérifie et produit un **état**. Un état est bien formé : les dépendances se résolvent, chaque index d'un corps est lié, et le graphe de dépendances ne contient aucun cycle. Il comporte trois tables persistantes. La table des unités est un HAMT de Merkle. La table des clés et l'index des dépendances inverses sont persistants et ne font pas partie de la racine de Merkle. Le clonage d'un état et la lecture de sa racine sont en $O(1)$. Deux états sont égaux lorsque leurs racines sont égales. Un diff ne parcourt que les sous-arbres dont les condensats diffèrent, de sorte que son coût suit la différence et non la taille du dépôt. Les dépendants dont la clé a changé, sans que leur propre unité ait changé, sont volontairement exclus du diff. La fermeture, définie ci-dessous, les prend en charge. Les inclure dans le diff transformerait un dépendant partagé en conflit fictif.

Une **édition** modifie des emplacements et ne valide qu'une seule fois, à la fin, sur la fermeture par dépendances inverses des emplacements touchés. Les états à l'intérieur d'une édition peuvent être mal formés. Ce comportement est intentionnel, par exemple lorsqu'une suppression est suivie d'un ajout.

Un **changement** porte une étiquette d'auteur opaque, un état de base, un niveau, une liste d'opérations et un message. Les opérations sont l'ajout (put), la suppression (delete) et le renommage (rename). Les niveaux sont le niveau « nom seul » (name-only), l'erratum, le changement de sens (meaning change) et le changement d'interface (interface change). Le niveau « nom seul » est vérifié par le noyau : le multi-ensemble des clés doit rester inchangé. L'identifiant du changement couvre chacun des champs. Le message exprime une intention déclarée, par exemple l'objet d'un commit. L'admission ne le lit pas et ne dépend pas de l'étiquette de l'auteur.

Pour un changement $c$ appliqué à un état $s$,

$$
\mathrm{writes}(c, s) = \mathrm{diff}(s,\; \mathrm{apply}(s, c)).
$$

Les lectures sont les dépendances des ajouts et les sources des renommages. La fermeture de $c$ dans un état et dans l'état postérieur regroupe les écritures, les dépendants avant, les dépendants après et les lectures. Deux changements commutent sur $s$ lorsque les écritures de chacun ne rencontrent pas la fermeture de l'autre :

$$
\mathrm{commutes}(a, b, s) \iff \mathrm{writes}(a) \cap \mathrm{closure}(b) = \emptyset \;\land\; \mathrm{writes}(b) \cap \mathrm{closure}(a) = \emptyset.
$$

Le test de référence vérifie que des changements commutatifs donnent la même racine, quel que soit l'ordre dans lequel ils sont appliqués.

L'étape **δ** est `submit`. Elle est totale sur les entrées utilisateur. Elle renvoie soit une acceptation accompagnée d'un récépissé, soit un refus accompagné d'un motif, et ajoute dans les deux cas une entrée de journal chaînée par hachage. La tête est le pli (fold) de ce journal. Le rejeu vérifie la chaîne et réintègre chaque entrée. Il utilise la résolution enregistrée pour un conflit et n'appelle pas de proposeur. Il contrôle chaque racine d'état antérieur, chaque racine d'état postérieur et chaque motif de refus.

<div id="4-the-repository-form" class="anchor-alias" aria-hidden="true"></div>

## 4. La forme du dépôt

Le fichier README décrit la forme implémentée en neuf parties, ainsi que le séparateur d'éléments `rcevc-keys` et la frontière `rcevc-core::assure`.

| Partie | Emplacement | Fonction |
|---|---|---|
| R, clés sans nom | `model.rs`, `rcevc-keys` | Clés comme ci-dessus ; `rcevc-keys` découpe les fichiers `.rs` et `.py` en éléments de niveau supérieur avec projection d’octets sans perte. Un renommage ne modifie aucune clé. |
| S, état persistant | `hamt.rs`, `model.rs` | Merkle HAMT. Clonage et racine en $O(1)$, différence proportionnelle à la taille de la différence, forme de trie canonique. Les clés et l’index d’inverse-dépendance se mettent à jour lors de l’édition, pas sur l’ensemble du dépôt. |
| Δ, changements typés | `change.rs` | Insertion, suppression et renommage par rapport à une base déclarée, avec un niveau déclaré. La vérification du nom uniquement est assurée par le noyau. |
| X, commutation | `change.rs` | Les écritures constituent le diff réel. La clôture ajoute les dépendants avant et après, ainsi que les lectures. Les clôtures disjointes commutent. |
| K et G, vérificateur et gate | `gate.rs` | Chaque vérificateur indique une classe de propriété, une hypothèse de liaison, une base de confiance, une autorité, une portée et un condensat. |
| δ, l’échelle | `repo.rs`, `assure.rs` | Recherche, commutation, fusion structurelle, re-validation, proposeur, ainsi que l’assurance de référence CAS (`CasRef`). Le gate s’exécute sur chaque chemin. |
| D, le journal | `repo.rs` | Entrées chaînées par hachage. La tête est le repliement. La relecture le reconstruit sans proposeur. |
| U, réutilisation | `repo.rs` | Une résolution est stockée sous une signature de conflit sans nom, et uniquement après que le gate l’ait acceptée. |
| C, coût | `repo.rs` | Le tableau déclaré par échelon (`est_uj`). Les reçus transportent la somme. |

L’autorité d’un vérificateur est l’une des suivantes : pinned, replay, proved, derived ou inferred. Sa portée est l’une de trois. **Unit** : re-vérifier les unités dans le delta. **Closure** : le verdict dépend de l’unité et de ses dépendances transverses, de sorte que le gate re-vérifie également les dépendants. **Global** : vérifier l’ensemble de l’état. Si la tête précédente a passé et que la portée déclarée est vraie, une re-vérification portée correspond à une vérification complète. Le test `delta_gate_agrees_with_full_gate` consigne cet accord sur 600 essais, avec plus de 100 refus. Un vérificateur qui ment sur sa portée viole VC2. La portée est fiable. Rien dans cette version ne l’impose en masquant le reste de l’état.

Le condensat du gate couvre chaque déclaration de vérificateur, et ce condensat alimente le hachage de genèse. La forme du trie est canonique : un préfixe ne contient rien, une seule feuille, ou une branche de deux clés ou plus. Les racines ne dépendent pas de l’ordre d’arrivée de l’historique. Tout ce qui est haché transite par l’encodeur avec une balise de domaine versionnée de la forme `rcevc/<thing>/vN`. Modifier le contenu d’une balise implique de faire évoluer la version.

<div id="5-the-transition" class="anchor-alias" aria-hidden="true"></div>

## 5. La transition

`submit` emprunte toujours l'un des chemins suivants. Les noms des engrenages sont ceux inscrits sur le reçu.

1. **G0, consultation.** Le même identifiant de modification contre la même tête, déjà refusé, renvoie le refus stocké. Le coût déclaré de cette nouvelle tentative est la seule ligne G0. Le test `g0_identical_retry_costs_one_lookup` enregistre ce cas.
2. **Base.** L'instantané de base doit exister, sinon la raison est une base inconnue. L'application des opérations à cette base doit réussir, sinon la raison est une erreur d'application ou une unité mal formée. Une revendication ne portant que sur des noms et qui ne laisse pas le multiset des clés inchangé est refusée.
3. **G1, commutation.** Soit l'ensemble déplacé la différence de la base à la tête courante. Si la fermeture de la modification, dans la base et dans la tête, ne rencontre pas cet ensemble, la modification est appliquée directement à la tête. Pas de fusion.
4. **G2, fusion structurelle.** Sinon la référence fusionne, créneau par créneau, sur l'union de ce qui a bougé sur la tête et de ce que la modification elle-même a modifié. Un seul côté inchangé : prendre l'autre côté. Les deux côtés égaux : prendre l'un ou l'autre. Tout autre créneau est un conflit.
5. **Conflit.** La signature est $H(\mathrm{key}_{base}, \mathrm{key}_{head}, \mathrm{key}_{theirs})$, qui n'utilise pas le nom du créneau. La réutilisation G0 renvoie une résolution stockée pour cette signature. S'il n'en existe aucune, G4 interroge le proposant. S'il n'y a pas de proposant, ou s'il ne renvoie rien, la modification est refusée avec les créneaux en conflit. Pendant la relecture, la résolution enregistrée est utilisée et le proposant n'est pas appelé.
6. **G3, revalidation.** L'affectation fusionnée est construite sur la tête avec un contrôle de bonne formation. Si ce contrôle échoue, la modification est refusée comme mal formée.
7. **Porte, sur chaque chemin, y compris G1.** Le candidat et la différence par rapport à la tête courante sont transmis à la porte. Un vérificateur en échec refuse la modification et nomme le vérificateur.
8. **Acceptation.** Les résolutions du proposant ne sont copiées dans le magasin de réutilisation qu'à ce stade. La nouvelle tête est instantanée. Le reçu enregistre les engrenages utilisés, les preuves de la porte, les résolutions et `est_uj`.

Les refus sont également journalisés. La tête ne bouge pas.

<div id="6-propositions-the-tests-hold" class="anchor-alias" aria-hidden="true"></div>

## 6. Propositions vérifiées par les tests

À `aba99fce`, `cargo test --offline` exécute 49 tests (`29` dans le noyau, `8` pour les clés, `12` pour git), qui correspondent aux propositions ci-dessous :

| Affirmation | Test nommé dans le dépôt |
|---|---|
| VC1, totalité, absence d'impasse : chaque soumission est acceptée ou refusée avec un motif, et journalisée | `vc1_every_submission_is_accepted_or_refused_and_logged` |
| VC2, verdict vert par induction : chaque tête est bien formée et passe la porte de contrôle | `vc2_every_head_is_well_formed_and_passes_the_gate` (400 soumissions aléatoires, bases obsolètes, changements empoisonnés) |
| VC3, la commutation implique le même résultat dans les deux ordres | `vc3_commutation_implies_order_independence` (3 000 essais aléatoires, plus de 500 paires commutantes) et `vc3_disjoint_writers_integrate_at_g1_in_either_order` |
| VC4, un conflit sémantique est détecté alors que le texte ne présente aucun conflit | `vc4_identical_edits_merge_and_semantic_conflicts_are_caught_at_g3` (un changement d'arité face à un nouvel appelant) |
| VC5, un conflit résolu est réutilisé grâce à sa signature indépendante du nom | `vc5_resolved_conflicts_are_reused_by_name_free_signature` |
| Un résultat de modèle est un candidat | `model_output_is_a_candidate_never_trusted` |
| L'état est le repli du journal | `replay_reproduces_head_without_any_proposer` |
| Un renommage ne modifie aucune clé, et la vérification par nom seul est effectuée | `renames_change_no_keys_and_name_only_is_verified` |
| Les nouvelles tentatives idempotentes en G0 ne coûtent qu'une recherche | `g0_identical_retry_costs_one_lookup` |
| La porte de portée restreinte concorde avec la porte complète | `delta_gate_agrees_with_full_gate` (600 essais, plus de 100 refus) |
| Les instantanés ne sont pas modifiés par les éditions ultérieures ; le calcul incrémental coïncide avec le calcul depuis zéro | `snapshots_share_structure_and_diff_is_exact`, tests HAMT dans `hamt.rs` |
| SHA-256 coïncide avec les vecteurs publiés | vecteurs FIPS 180-4 dans `hash.rs` |

Le test de VC5 accepte un conflit par l'intermédiaire du proposeur, puis soumet le même conflit sous un autre nom de créneau. La seconde acceptation emprunte la voie de recherche G0, n'emprunte pas G4, n'appelle pas de nouveau le proposeur, et a un `est_uj` inférieur à un centième du reçu du chemin passant par le proposeur. Ce rapport compare des coûts déclarés dans les reçus.

Un test distinct fournit au proposeur un résultat empoisonné. La porte de contrôle le refuse, la tête reste inchangée, et la résolution refusée n'est pas stockée pour réutilisation.

<div id="7-measured-wall-time" class="anchor-alias" aria-hidden="true"></div>

## 7. Temps d'exécution mesuré

La charge de travail, telle qu'implémentée dans l'exemple swarm : chaque écrivain d'un tour soumet par rapport à la tête initiale de ce tour, de sorte que les soumissions ultérieures du même tour sont obsolètes. Un écrivain sur cinq modifie le module actif (`below(5) == 0`). Une soumission sur cinquante porte un jeton interdit (`below(50) == 0`), ce qui correspond au taux de poisons de 2 % indiqué dans le README. Le proposeur dans l'exemple est un substitut déterministe qui combine les deux corps. Il ne s'agit pas d'un modèle appris. L'exemple stocke 10 unités dans chaque module. Le germe fixe de l'exemple est `0x5eed`.

<div id="71-path-shares-at-400-units" class="anchor-alias" aria-hidden="true"></div>

### 7.1 Parts de chemins à 400 unités

Le tableau des chemins du README correspond à l’essaim par défaut : 64 rédacteurs, 20 rondes, 40 modules, 400 unités, 1 280 soumissions. Les parts portent sur l’ensemble des soumissions.

| Chemin | Part |
|---|---:|
| Accepté à G1 (commuté, sans fusion) | 57,0 % |
| Accepté à G2, puis G3 (fusion structurelle, revalidé) | 27,3 % |
| Accepté à G2, puis G4, puis G3 (conflit, proposant, revalidé) | 13,8 % |
| Refusé par la porte | 1,9 % |

Les quatre parts totalisent 100 %. Chaque refus était un changement empoisonné, y compris 6 sorties du proposant qui ont hérité de l’empoisonnement. 1 259 des 1 280 soumissions portaient sur une base obsolète, et 98,1 % de ces soumissions obsolètes ont été admises sans ré-embase du rédacteur. L’exemple a effectué 182 appels au proposant. La relecture depuis la genèse, sans proposant, a reproduit la même tête.

![Chemins d’admission et temps d’exécution mesurés sur la version de référence](/figures/rce-vc/swarm-and-timing.svg)

*Figure 1. Parts de chemins mesurées pour l’essaim de 400 unités et 20 rondes, et temps d’exécution mesuré par soumission pour les exécutions de temporisation de 5 rondes sur la version de référence de base. Release, un cœur. Les coûts de réception indiqués n’apparaissent pas sur cette figure.*

<div id="72-integration-cost-against-repository-size" class="anchor-alias" aria-hidden="true"></div>

### 7.2 Coût d'intégration en fonction de la taille du dépôt

Le tableau de temps de la README correspond à la même classe de charge de travail, avec 64 rédacteurs et 5 rounds, la même graine, un build de release et un seul cœur. La cellule indique le temps mural mesuré par soumission. M0 désigne l'état antérieur qui clonait les tables de hachage. M1 désigne l'état de Merkle persistant.

| Unités | Modules | M0, tables clonées | M1, état persistant (hôte de la README) | Ratio indiqué dans la README |
|---:|---:|---:|---:|---:|
| 400 | 40 | 2 103 µs | 98 µs | 21 fois |
| 4 000 | 400 | 27 536 µs | 105 µs | 262 fois |
| 40 000 | 4 000 | non exécuté | 136 µs | |
| 100 000 | 10 000 | non exécuté | 188 µs | |

La ligne de 100 000 unités correspond à l'exemple invoqué par `swarm -- 64 5 10000` : 64 rédacteurs, 5 rounds, 10 000 modules. Le temps de M0 croît avec la taille du dépôt, tandis que celui de M1 reste pratiquement constant. La hausse restante provient de la profondeur du trie et de la quantité de modifications survenant au sein d'un round. Les instantanés partagent en effet leur structure, la comparaison et la porte de contrôle ignorent les sous-arbres égaux, une édition ne recalcule les clés que des unités modifiées et de leurs dépendants, et la porte vérifie à nouveau la portée déclarée du delta.

<div id="73-measured-wall-time-and-on-chip-reported_j-at-100000-units-commit-aba99fce" class="anchor-alias" aria-hidden="true"></div>

### 7.3 Mesure du temps d'exécution et du `reported_j` sur puce à 100 000 unités (commit `aba99fce`)

Le 22 novembre 2026, `openIE-dev/rce-vc` au commit `aba99fce` (`rustc 1.100.0`, version release) a été exécuté et instrumenté sur Apple M5 Max (`macOS 27.2.1` `arm64`) sous le harnais dual-channel SATB `reported_j` : `IOReport` sur l’ensemble de la puce via `macmon` (L2, label `A2`, Falsifier 6 `<= 5.0%` porte de dérive d’inactivité) associé au kernel par PID `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (L3, label `D`), à `100,000` unités (`10,000` modules × `10` unités) :

| `100,000`-unit workload (`aba99fce`, Apple M5 Max) | Admissions / essai | Essais | Temps d'exécution médian / admission | L3 `reported_j` médian / admission | Instructions / admission | `CostTable` déclaré `est_uj` / admission |
|---|---:|---:|---:|---:|---:|---:|
| **Essaim README (`64` rédacteurs × `5` tours)** | `320` (`315` acceptées, `5` refusées) | `5` | **`69.69 µs`** (`63.5-84.1 µs`) | **`365.35 µJ`** (`346.4-395.7 µJ`) | `1,147,137` | `438,530.4 µJ` |
| **Fenêtre soutenue (`64` rédacteurs × `500` tours)** | `32,000` (`31,357` acceptées, `643` refusées) | `3` | **`73.56 µs`** (`69.3-75.7 µs`) | **`317.21 µJ`** (`278.9-369.0 µJ`) | `1,153,976` | `424,152.7 µJ` |

- **Genèse et répartition du chemin** : La construction de l’état genesis Merkle HAMT de `100,000` unités a nécessité en médiane **`1.244 s`** une fois (`5` essais). Dans l’exécution soutenue de `32,000` soumissions (`fenêtre de `2.35 s`), `26,103` soumissions (`81.6%`) ont été admises à `G1Commute`, `2,594` (`8.1%`) à `G2Structural > G3Revalidate`, `2,660` (`8.3%`) via `G4Proposer` avec `2,660` signatures de conflit promues pour réutilisation, et `643` (`2.0%`) soumissions empoisonnées ont été refusées (`30,857` sur `31,490` soumissions obsolètes = `98.0%` admises sans rebasage de rédacteur).
- **Cohérence L2 vs L3 et Falsifier 6** : Sur les deux essais soutenus qui ont passé Falsifier 6 (`2.67%` et `1.22%` dérive d’inactivité), l’énergie marginale nette du `IOReport` L2 sur toute la puce était de `9.22 J` et `4.66 J` (`288.2 µJ` et `145.6 µJ`/admission) à côté du `ri_energy_nj` L3 par PID de `11.81 J` et `8.92 J` (`369.0 µJ` et `278.9 µJ`/admission), tandis que l’essai intermédiaire (`7.28% > 5.0%` dérive d’inactivité due à des tâches hôtes concurrentes) a vu sa soustraction nette L2 automatiquement invalidée par Falsifier 6. Notez que le `CostTable` factice (`424-439 mJ`/admission) surestime l’admission uniquement CPU d’environ trois ordres de grandeur parce que son entrée `Proposer` de `5,000,000 µJ` (`5 J`) prévoit un proposeur neuronal plutôt que le substitut déterministe de l’exemple (`measured_j = None`, `board_metered = false`).

<div id="8-stated-cost-on-receipts" class="anchor-alias" aria-hidden="true"></div>

## 8. Coût indiqué sur les reçus

Le tableau par défaut dans `CostTable` à `aba99fce`, en microjoules, demeure un prix indiqué par ligne à l’intérieur des reçus du dépôt :

| Ligne | Ce qui l’ajoute | µJ indiqué |
|---|---|---:|
| G0 | Facturé au début de chaque tentative. Facturé à nouveau pour chaque signature de conflit réutilisée. Un refus mémorisé correspond à cette ligne seule. | 1 |
| G1 | Facturé lorsque la tentative atteint le test de commutation | 10 |
| G2 | Facturé lorsque la tentative effectue la fusion structurelle | 100 |
| Checker | Facturé une fois par vérificateur, sur chaque chemin qui atteint la porte, y compris G1 | 1 000 |
| Proposer | Facturé une fois par appel de proposeur | 5 000 000 |

G3 est écrit sur le chemin et ne possède pas de ligne propre. Le `est_uj` d’un reçu est la somme des lignes qu’a ajoutées la tentative. Remplacer ce tableau par le `measured_j` du rail matériel constitue le jalon M6 et reste ouvert ; la section 7.3 fournit le premier étalonnage du système d’exploitation `reported_j` (`317-365 µJ` par admission de `100 000` unités avec un proposeur de substitution déterministe).

<div id="9-the-git-projection" class="anchor-alias" aria-hidden="true"></div>

## 9. La projection Git

La projection correspond au jalon M2, dans `rcevc-proj-git`. Une unité feuille est constituée des octets du fichier. Une unité possédant des dépendances est écrite sous la forme d'un fichier précédé d'un court en-tête, que la référence traite comme une bijection sur les fichiers UTF-8 :

```
#rcevc-unit v1
#dep <slot>
#body
<body>
```

Une ligne `#dep` est écrite pour chaque dépendance.

**Sortie.** `export` écrit un commit sur `main` pour chaque entrée acceptée. L’auteur est l’étiquette du rédacteur. Le sujet est le message de modification, ou une ligne nommant l’identifiant du changement et les engrenages si le message est vide. Chaque commit accepté porte les trailers `RCE-VC-Change`, `RCE-VC-Pre`, `RCE-VC-Post`, `RCE-VC-Path`, `RCE-VC-Evidence`, `RCE-VC-Resolved`, `RCE-VC-Est-uJ` et `RCE-VC-Entry`. `RCE-VC-Est-uJ` est la somme de microjoules indiquée, pas une mesure. La référence `refs/rcevc/log` possède un commit par entrée de journal, refus inclus, et un commit de refus porte également `RCE-VC-Reason`. Étant donné le même journal et la même base temporelle, `export` produit les mêmes identifiants de commit.

**Entrée.** `ingest` parcourt les commits parents depuis un sommet jusqu’à trouver un commit dont le trailer `RCE-VC-Post` est un instantané. Cet instantané constitue la base. L’arbre du sommet devient un changement, ajout et suppression, par rapport à cette base. Si le multiensemble de contenu reste inchangé, le niveau est « nom-only ». La branche est la proposition. L’échelle décide. Le rédacteur n’est pas invité à rebaser.

Le README consigne ces vérifications pour git 2.43, dans `tests/git_interop.rs` (`12` tests dans `rcevc-proj-git` à `aba99fce`):

| Vérification | Résultat enregistré dans le README |
|---|---|
| `git fsck --full --strict` sur l’historique exporté | clean |
| Chaque commit sur `main` ré-importé à la racine dans son trailer `RCE-VC-Post` | yes |
| Deux exportations du même journal dans des répertoires différents | identical commit identifiers |
| L’analyseur de trailers de Git lit les reçus | yes |
| Deux commits Git simples sur une branche dont la base est devenue obsolète | ingested as one change, admitted at G1, `main` moves forward |
| Objets écrits par Git lui-même, y compris la compression dynamique Huffman | read |
| Un commit Git simple contenant un jeton interdit | refused, recorded on `refs/rcevc/log`, `main` unmoved |

Limites de cette projection, comme le README les indique : seulement les objets lâches et les références lâches ; le mode de fichier 100644 à la sortie, de sorte que le bit exécutable n’est pas encore un attribut d’unité ; les liens symboliques, sous-modules et fichiers non UTF-8 sont refusés avec une raison plutôt que devinés.

Le projet mentionne le nom Mergiraf, une fusion structurée qui utilise tree-sitter, comme travail visant des fichiers façonnés par l’analyse syntaxique. Il s’agit d’une observation de convergence. Cette page n’évalue pas la référence à son égard, et elle n’évalue pas la référence par rapport à aucun autre système de contrôle de version.

<div id="10-limits-of-this-version" class="anchor-alias" aria-hidden="true"></div>

## 10. Limites de cette version

Au commit `aba99fce` :

1. `rcevc-keys` découpe les fichiers Rust (`.rs`) et Python (`.py`) en éléments de premier niveau (avec des dépendances ne pointant que vers des éléments antérieurs du même fichier), mais le découpage TypeScript et une évaluation aller-retour sur 50 paquets / 1 000 dépôts ne sont pas encore réalisés ; les autres types de fichiers restent des unités feuilles du fichier entier.
2. Le stockage Git utilise des objets et des références lâches. Il n’y a ni packfiles ni références compactées. L’export n’écrit que le mode 100644. Les liens symboliques, les sous-modules et les fichiers non UTF-8 sont refusés.
3. Chaque commit exporté reconstruit l’arbre entier.
4. Les ensembles de dépendances inverses sont clonés lors de leur mise à jour. Une unité ayant de nombreux dépendants rend cette mise à jour volumineuse.
5. Le calcul des clés est récursif. Une chaîne de dépendances de plus de 10 000 unités environ pourrait provoquer un débordement de pile.
6. Une racine à contenu complet est linéaire en nombre d’unités. L’ingestion ne l’utilise que pour deviner le niveau nom-seul. La vérification nom-seul du noyau parcourt le diff.
7. Les instantanés sont conservés en mémoire, sans politique de rétention ni magasin séparé.
8. `submit` est monotâche (`CasRef` protège les échanges de références, tandis que `submit` admet séquentiellement les modifications commutatives). Les baux ne sont pas construits.
9. Un vérificateur est considéré comme fiable pour dire la vérité sur sa portée (le bac à sable Wasmtime pour M3 n’est pas encore construit).
10. Le `reported_j` sur puce (`317-365 µJ` par admission de `100,000` unités) a été enregistré en externe via le noyau `ri_energy_nj`, tandis que les champs de reçu dans le dépôt portent encore le tableau `est_uj` déclaré et le rail matériel externe `measured_j` (M6) reste ouvert (`measured_j = None`, `board_metered = false`).

<div id="11-next-work" class="anchor-alias" aria-hidden="true"></div>

## 11. Travaux à venir

- **Achever M1 (extension de `rcevc-keys` et aller-retour sur corpus).** Ajouter la grammaire TypeScript à côté de Rust et Python, prendre en charge les dépendances entre éléments de fichiers distincts, et vérifier des aller-retours identiques octet par octet sur au moins 50 crates et paquets réels, les modifications indépendantes de fonctions distinctes d'un même fichier commutant au niveau G1.
- **Achever M2 (clés internes BLAKE3 et paquets `gix`).** Migrer le hachage interne vers BLAKE3 (en conservant les vecteurs SHA-256 de FIPS 180-4 comme test distinct et en faisant évoluer les étiquettes de domaine), et migrer le stockage des objets Git vers `gix` (`gitoxide`) pour les paquets et les références empaquetées, suivi d'un aller-retour sur l'historique de 1 000 dépôts.
- **M3 (`rcevc-gate` sur Wasmtime).** Exécuter les vérificateurs sous forme de modules WebAssembly déterministes à budget de carburant (fuel) limité, avec des empreintes épinglées, afin que la portée déclarée soit appliquée en n'exposant que la tranche déclarée.
- **M4 (baux et canal monotone).** Diffusion concurrente des changements monotones sans coordination.
- **M5 (rejeu de corpus de conflits).** Rejouer Merge-Bench, CONGRA et AgenticFlict à travers l'échelle, en comptabilisant les résolutions aux niveaux G0, G1, G2, G3 et G4.
- **M6 (`rcevc-meter`).** Remplacer `est_uj` par `reported_j` calibré et par `measured_j` mesuré sur des rails matériels externes.

<div id="12-copyright-and-license" class="anchor-alias" aria-hidden="true"></div>

## 12. Droits d’auteur et licence

Copyright 2026 Open Interface Engineering, Inc.

L'implémentation de référence dans [openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc) au commit `aba99fcec4414a32bff30ab075668350d3fb80bf` (`13 novembre 2026`) est sous la licence Apache, version 2.0. Le fichier de licence dans cet arbre indique le droit d’auteur comme Open Interface Engineering, Inc., et le manifeste du crate définit `license = "Apache-2.0"`. Cette page constitue le texte d’étude pour cette référence.
