---
title: "RCE-JEPA: World Coding mit JEPA als Prämisse"
deck: "RCE-JEPA (RCE steht für die Reality Code Engine; JEPA für eine Joint Embedding Predictive Architecture) behält seinen Namen, damit die Arbeit auffindbar bleibt. Das Thema ist World Coding. JEPA ist die Prämisse: Ein gelerntes Modell sagt eine kompakte Zusammenfassung eines Programms voraus, statt das nächste Textstück zu schreiben. Eine Welt des Codes ist der Raum kanonischer Programm-Formen samt exakten Übergangs- und Akzeptanzregeln (den Gesetzen des Programmierens). Der Platz des Vorschlagenden steht jedem gelernten Modell offen; der Prüfer entscheidet. Gemessene Untergrenzen sind ein medianes Beschreibungslängenverhältnis von 9.34 über 185 handgeschriebene Programme, 0 Invariantenverletzungen unter 1,275 Fuzz-Mutanten, 0 Replay-Abweichungen auf 10,500 Strömen über sechs Ziele und eine deterministische Leiter, die 111 von 151 Aufgaben (73.5%) mit null Modellaufrufen schloss und 40 offenließ. Kein gelernter Vorschlagender wurde trainiert; H15 ist unvollendet."
lang: "de"
source: "rce-jepa"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

Dieser Beitrag formuliert eine These, Hypothesen (H1 bis H15), Falsifikatoren und ein Arbeitsprogramm; berichtet werden die Phase-0-Messungen, die keinen gelernten Vorschlagenden benötigen (der Form-Korpus, der namensfreie Form-Raum, die Determinismusströme und die adversariellen Formen), während für einen gelernten Vorschlagenden kein Ergebnis vorliegt, weil noch keiner trainiert wurde. JEPA ist die Prämisse: eine Zusammenfassung der Bedeutung vorhersagen, nicht den Oberflächentext. Gegenstand ist World Coding, also jeder gelernte Vorschlagende über Formen mit den Gesetzen des Programmierens als Akzeptanzregel. Die entscheidende Hälfte (Commit-Tor, exaktes Replay, Projektion und in ganzzahligen Einheiten gezählte Kosten mit als `est_j` gekennzeichneten Energieschätzungen) ist in [Die Reality Code Engine](/papers/rce/) beschrieben; jedes Modell in der Schleife schlägt nur vor, und die Sicherheit hängt niemals von ihm ab.

**In einfachen Worten**

1. Gegenstand ist World Coding. Eine Welt des Codes ist der Raum der Programm-Formen samt exakten Regeln für den Folgezustand und für das, was akzeptiert wird (die Gesetze des Programmierens). JEPA ist die Prämisse, nicht die gesamte Methode: eine Bedeutungszusammenfassung statt des nächsten Codeworts vorhersagen.
2. Das Modell schlägt vor und der Prüfer entscheidet. Auf Spuren trainierte Decoder, Diffusion, Reinforcement Learning innerhalb eines Beweisprüfers, evolutionäre Suche, Bibliothekslernen und eingeschränktes Decodieren können diesen Platz einnehmen, ohne dass sich das Tor ändert.
3. Gemessene Untergrenzen bleiben gekennzeichnet und offene Arbeit bleibt offen: medianes Beschreibungslängenverhältnis 9.34 über 185 handgeschriebene Programme, 0 gebrochene Invarianten in 1,275 akzeptierten Mutanten, übereinstimmendes Replay auf 10,500 Strömen über sechs Ziele und 111 von 151 Aufgaben (73.5%) mit null Modellaufrufen geschlossen. Kein gelernter Vorschlagender wurde trainiert und kein Joule-Wert für nicht durchgeführte Läufe erfunden.

*Vollständiger englischer Originaltext: [/papers/rce-jepa/](/papers/rce-jepa/).*
