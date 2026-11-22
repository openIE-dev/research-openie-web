---
title: "Écrire un jeu une seule fois et l'exécuter partout : où s'arrête le rejeu exact et où commence la tolérance"
deck: "Peut-on écrire un jeu une seule fois sous la forme d'une machine à états vérifiée et le projeter vers plusieurs moteurs et langages ? Pour les règles et la simulation, oui, sous une arithmétique stricte. Pour les pixels d'un matériel graphique à l'autre, non : seul un accord dans une tolérance mesurée est atteignable."
lang: "fr"
source: "game-engines"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

Cette étude demande si un jeu peut être écrit une seule fois comme une machine à états vérifiée (une Forme $P = (S, E, \delta, D, \lambda)$) puis projeté vers plusieurs moteurs et langages. Les sources répondent : oui pour les règles du jeu et la simulation sous une discipline numérique stricte ; non pour des pixels identiques bit à bit sur tout matériel graphique, où seul un accord à tolérance mesurée est possible, avec un découpage en quatre couches (simulation, script, scène, rendu), une frontière de déterminisme et un plan d'essais guidé par des réfutateurs.

**En termes simples**

1. Les règles d'un jeu (qui bouge, ce qui entre en collision, qui gagne) peuvent être énoncées une seule fois et rejouées exactement, à condition de fixer l'arithmétique.
2. Les images qu'un jeu dessine ne peuvent pas être rendues identiques sur chaque carte graphique, mais on peut vérifier qu'elles restent dans une marge d'erreur mesurée.
3. Les formats actuels de description de jeux ne couvrent chacun qu'une tranche (nuanceurs, scènes ou règles) ; presque aucun ne vérifie les coutures entre tranches, et c'est sur ces coutures que porte cette conception.

*Texte intégral en anglais : [/papers/game-engines/](/papers/game-engines/).*
