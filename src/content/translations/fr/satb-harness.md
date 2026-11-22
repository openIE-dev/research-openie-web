---
title: "Satiation Benchmark : harnais de référence, adaptateurs et attribution télémétrique"
deck: "Un harnais de référence séquentiel fixe en Rust (Lane B), un pont adaptateur unique isolé par mandataire local (Shapes D, M, H et I), une suite de douze tests de conformité (C1 à C12) et un moteur d'attribution télémétrique sans privilèges root à cinq niveaux (L0 à L4 croisés avec les étiquettes A1 à N). Vérifié empiriquement sur Apple M5 Max par sondes de déterminisme multi-fournisseurs, cadences d'échantillonnage de l'observateur (0 Hz aux bornes contre 1 Hz, 10 Hz et 100 Hz), falsificateurs d'attribution temporelle contre proportionnelle au temps processeur et 188 fenêtres sur hôte partagé. Les compteurs intégrés Apple Silicon sont enregistrés comme reported_j ; aucun wattmètre mural ni shunt physique n'était branché (board_metered vaut false ; measured_j n'est pas renseigné)."
lang: "fr"
source: "satb-harness"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

Lorsque deux évaluations d'agents publient des taux de réussite ou des bilans énergétiques différents, l'écart provient souvent de l'enveloppe logicielle autour du modèle et des règles d'attribution des compteurs matériels plutôt que du modèle lui-même. Sur `Terminal-Bench 2`, le seul remplacement du harnais a déplacé le score de `Gemini 2.5 Pro` de `17` points de pourcentage, tandis que soustraire un ralenti dérivant ou répartir un rail partagé au prorata du temps processeur peut fausser l'attribution énergétique de plus de `30%`. Cette étude spécifie et vérifie sur `Apple M5 Max` (`128 Go` de mémoire unifiée, `macOS 27.2.1`) le contrat du Satiation Benchmark (`SATB`) : un harnais séquentiel déterministe en Rust (`Lane B`, avec élision déterministe `ContextRule_v0` à `80%` de la fenêtre sans appel au modèle et troncature `Truncate_v0` de `8 + 8 Kio`), un pont mandataire local (`Shapes D, M, H, I`), une empreinte système à cinq blocs, douze contrôles de conformité (`C1` à `C12`) et une télémétrie à cinq niveaux (`L0` à `L4`, étiquettes `A1` à `N`), enregistrant les compteurs locaux en `reported_j` et l'énergie serveur des API fermées strictement comme `not_available`.

**En termes simples**

1. La boucle d'invite, la règle d'élagage du contexte et le bac à sable d'outils influencent les scores autant que le choix du modèle ; `Lane B` fige donc cette enveloppe en Rust déterministe tandis que `Lane O` fait passer les harnais externes par un unique mandataire audité.
2. Chaque canal énergétique est consigné brut à sa vraie frontière physique (prise murale, entrée carte, boîtier de puce, estimation par processus du système d'exploitation ou journal logique de jetons), sans jamais fusionner les niveaux ni substituer des médianes de flotte.
3. Les mesures sur `Apple M5 Max` valident les `12/12` tests de conformité (`0` octet d'écart au rejeu sur `149,747` octets, nettoyage `SIGKILL` d'arbre de processus en `2.07 ms`), montrent pourquoi `temperature = 0` ne garantit pas des sorties identiques chez trois fournisseurs cloud, chiffrent le coût de l'observateur (`0.011 mW` aux bornes contre `66.44 mW` à `10 Hz`) et montrent un écart de `32.59%` à `35.86%` lorsque le partage proportionnel au temps processeur remplace les compteurs séquentiels exacts.

*Texte intégral en anglais : [/papers/satb-harness/](/papers/satb-harness/).*
