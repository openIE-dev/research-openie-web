---
title: "RCE-VC : loi du contrôle de versions"
deck: "RCE-VC (une implémentation de référence de contrôle de versions, distincte du langage Reality Code Engine) admet chaque changement dans un unique état canonique de dépôt sans noms ou le refuse avec un motif enregistré, tout en lisant et écrivant l'historique Git ordinaire. Les jalons M0, M1 et M2 sont implémentés au commit public 8bf9c9af. Les temps réels ont été mesurés sur cette version (188 microsecondes face à 100,000 unités sur un cœur). Les coûts des reçus proviennent d'une table déclarée ; aucun joule n'a été mesuré."
lang: "fr"
source: "rce-vc"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Résumé

RCE-VC est une architecture de contrôle de versions accompagnée d'une petite référence en Rust (`openIE-dev/rce-vc` au commit `8bf9c9af`). De nombreux rédacteurs, humains ou programmes, soumettent des changements sur un état partagé : une vérification nommée admet le résultat, sinon le changement est refusé et le motif est conservé, tout en permettant aux rédacteurs de rester sur Git. La référence n'est pas le langage Reality Code Engine, mais reprend le même cadre : une Forme, un pas total déterministe, un journal chaîné par hachage, des clés sans noms et une échelle d'engrenages plaçant le modèle en dernier.

**En termes simples**

1. Autant de personnes et de programmes qu'on veut peuvent écrire simultanément. Un changement entre dans l'historique partagé lorsqu'une vérification nommée accepte le résultat ; sinon il reste dehors avec un motif écrit, sans que l'identité de l'auteur en décide.
2. Les changements qui ne touchent pas les mêmes dépendances n'ont pas à s'attendre mutuellement. En cas de chevauchement, un barème fixé à l'avance classe les résultats recevables et tout résultat accepté, y compris un conflit résolu, est réutilisé ; un modèle n'est sollicité qu'en dernier ressort.
3. La référence lit et écrit l'historique Git ordinaire. Sur la version mesurée, l'admission d'un changement est restée sous deux dixièmes de milliseconde jusqu'à 100,000 unités sur un cœur (188 microsecondes) ; les coûts `est_uj` inscrits sur les reçus viennent d'une table déclarée et aucun joule n'a été mesuré.

*Texte intégral en anglais : [/papers/rce-vc/](/papers/rce-vc/).*
