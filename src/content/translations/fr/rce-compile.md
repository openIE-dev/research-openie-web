---
title: "RCE Compile : une loi de la compilation, mise à l'épreuve comme forme normale face aux compilateurs réels"
deck: "RCE Compile (projet de recherche au sein du dépôt Reality Code Engine) demande si un énoncé unique de ce qu'est la compilation vaut pour tout compilateur, indépendamment du Reality Code Engine lui-même. Confronté à douze familles de compilateurs, l'énoncé candidat tient comme norme d'évaluation et non comme description des compilateurs existants. Cette étude expose cette norme en sept parties, les preuves pour et contre chacune, un remplacement mesurable de sa fonction de convergence, sept hypothèses avec leurs réfutateurs et les trois expériences menées jusqu'ici : comparaisons octet par octet sur trois machines, comptages d'effacement et de longueur de description sur 96 compilations sans compteur d'énergie, et un hachage sans noms testé sans faux positif sur 16 petits noyaux et 4 programmes."
lang: "fr"
source: "rce-compile"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

RCE Compile examine si une Loi de la Compilation unique vaut pour tout compilateur indépendamment du Reality Code Engine (RCE). L'énoncé candidat affirme que compiler consiste à abaisser un programme entre représentations canoniques en préservant le sens, selon un coût borné inférieurement par la limite de Landauer et visant le plus court programme équivalent, sous le contrôle d'une porte de vérification et avec réutilisation cumulative. Confronté à douze familles de compilateurs de production, il échoue comme description : aucun compilateur étudié ne hache une représentation sans noms, l'abaissement en production n'est ni total ni prouvé préserver le sens en général, et aucun ne comptabilise l'énergie. Après réécriture de trois clauses, il tient comme forme normale normative assortie de deux bornes, d'un remplacement calculable de la fonction de convergence, de sept hypothèses réfutables et de trois premières expériences.

**En termes simples**

1. La question est de savoir si tous les compilateurs obéissent à une même règle. Ce n'est pas le cas des compilateurs réels ; la règle devient donc une norme en sept parties à laquelle mesurer tout compilateur, aucun ne suivant l'énergie ni ne prouvant la correction de toute traduction.
2. Les bornes physiques et mathématiques de la règle initiale étant réelles mais non calculables en l'état, elles sont remplacées par deux quantités dénombrables comparables à un relevé d'énergie.
3. Une pièce absente des compilateurs étudiés a été construite et testée : une empreinte sans noms d'un programme compilé. Sur 16 petits noyaux et 4 programmes, elle a reconnu les copies renommées plus souvent que les empreintes d'octets bruts ou du texte source, sans jamais confondre deux noyaux calculant des résultats différents.

*Texte intégral en anglais : [/papers/rce-compile/](/papers/rce-compile/).*
