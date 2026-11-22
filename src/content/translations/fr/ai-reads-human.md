---
title: "L'« IA » lit l'humain : l'encodage en langage humain à la vitesse de la machine et son coût énergétique"
deck: "Travail en cours. Pourquoi une si grande part de ce que les machines échangent est écrite pour des humains, ce que cela coûte aujourd'hui en octets, tokens et temps, et comment le coût énergétique sera mesuré."
lang: "fr"
source: "ai-reads-human"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

Les agents logiciels s'échangent des données dans des formats conçus pour être lus par des personnes, tels que JSON, YAML, Markdown, XML et CSV. Nous nommons taxe d'impédance le travail supplémentaire que cela entraîne, nous la définissons avec ses unités et nous en mesurons deux composantes sur un corpus reproductible de 20,000 enregistrements : le temps d'analyse syntaxique et le nombre de tokens. Une première tentative de mesure énergétique sur deux ordinateurs portables (section 5b) n'a résolu aucun effet énergétique net de l'analyse ; aucune affirmation en joules n'est donc avancée.

**En termes simples**

1. Les ordinateurs et les personnes utilisent souvent le même format écrit : il est facile à lire pour l'humain, mais l'ordinateur doit fournir un travail supplémentaire pour le relire.
2. Sur nos données de test, la lecture des mêmes enregistrements a pris environ 8 fois plus de temps en JSON (lecteur intégré de Python) et environ 735 fois plus en YAML qu'en disposition binaire fixe ; lu par un modèle d'IA, YAML a consommé environ 2.2 fois plus de tokens que CSV.
3. Nous avons mesuré le temps et le nombre de tokens ; un essai de mesure d'énergie sur deux portables n'a pas permis d'isoler le signal de la puissance de fond, si bien qu'aucune économie en joules n'est revendiquée.

*Texte intégral en anglais : [/papers/ai-reads-human/](/papers/ai-reads-human/).*
