---
title: "RCE-JEPA : la programmation du monde avec JEPA pour prémisse"
deck: "RCE-JEPA (RCE désigne le Reality Code Engine ; JEPA désigne une architecture prédictive à plongement conjoint) conserve son nom pour rester repérable. Le sujet est le World Coding. JEPA en est la prémisse : un modèle appris prédit un résumé compact d'un programme au lieu d'écrire le fragment de texte suivant. Un Monde du Code est l'espace des Formes canoniques de programmes muni des règles exactes de transition et d'acceptation (les Lois de la Programmation). Tout modèle appris peut occuper la place du proposant ; le vérificateur décide. Les planchers mesurés sont un rapport médian de longueur de description de 9.34 sur 185 programmes écrits à la main, 0 violation d'invariant sur 1,275 mutants à tests à rebours, 0 écart de rejeu sur 10,500 flux à travers six cibles, et une échelle déterministe ayant fermé 111 tâches sur 151 (73.5%) avec zéro appel de modèle. Aucun proposant appris n'a été entraîné et H15 reste inachevé."
lang: "fr"
source: "rce-jepa"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

Cet article énonce une thèse, des hypothèses (H1 à H15), des réfutateurs et un programme de travail ; les résultats rapportés sont les mesures de Phase 0 qui n'exigent aucun proposant appris (le corpus de Formes, l'espace de Formes sans noms, les flux de déterminisme et les Formes adverses), et aucun résultat de proposant appris n'est rapporté car aucun n'a été entraîné. JEPA est la prémisse : prédire un résumé du sens, non le texte de surface. Le sujet est le World Coding, tout proposant appris sur des Formes avec les Lois de la Programmation pour règle d'acceptation. La moitié décisionnelle (porte de validation, rejeu exact, projection et coût compté en unités entières avec estimations d'énergie étiquetées `est_j`) est décrite dans [Le Reality Code Engine](/papers/rce/) ; tout modèle dans la boucle ne fait que proposer et la sécurité n'en dépend jamais.

**En termes simples**

1. Le sujet est le World Coding. Un Monde du Code est l'espace des Formes de programmes muni de règles exactes pour l'état suivant et pour ce qui est accepté (les Lois de la Programmation). JEPA est la prémisse et non toute la méthode : prédire un résumé du sens plutôt que le mot suivant du code.
2. Le modèle propose et le vérificateur décide. Décodeurs entraînés sur traces, diffusion, apprentissage par renforcement dans un vérificateur de preuves, recherche évolutionnaire, apprentissage de bibliothèques et décodage contraint peuvent tous occuper cet emplacement sans modifier la porte.
3. Les planchers mesurés restent étiquetés et le travail inachevé reste déclaré comme tel : rapport médian de longueur de description de 9.34 sur 185 programmes écrits à la main, 0 invariant brisé sur 1,275 mutants acceptés, rejeu concordant sur 10,500 flux à travers six cibles et 111 tâches sur 151 (73.5%) fermées avec zéro appel de modèle. Aucun proposant appris n'a été entraîné et aucun compte en joules n'est inventé.

*Texte intégral en anglais : [/papers/rce-jepa/](/papers/rce-jepa/).*
