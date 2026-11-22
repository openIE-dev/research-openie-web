---
title: "Ein Spiel einmal schreiben und überall ausführen: Wo exaktes Replay endet und Toleranz beginnt"
deck: "Kann ein Spiel einmal als geprüfter Zustandsautomat geschrieben und in mehrere Engines und Sprachen projiziert werden? Für Regeln und Simulation ja, unter strikter Arithmetik. Für Pixel über verschiedene Grafikhardware hinweg nein: Dort ist nur Übereinstimmung innerhalb einer gemessenen Toleranz erreichbar."
lang: "de"
source: "game-engines"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

Diese Studie fragt, ob ein Spiel einmal als geprüfter Zustandsautomat (eine Form $P = (S, E, \delta, D, \lambda)$) geschrieben und anschließend in mehrere Engines und Sprachen projiziert werden kann. Die ausgewerteten Quellen antworten: ja für Spielregeln und Simulation unter strikter numerischer Disziplin; nein für bitgenaue Pixel über unterschiedliche Grafikhardware hinweg, wo nur toleranzbasierte Übereinstimmung erreichbar ist, ergänzt um eine Vierschichtaufteilung (Simulation, Skripting, Szene, Rendering), eine Determinismusgrenze und einen falsifikatorgeleiteten Prüfplan.

**In einfachen Worten**

1. Die Regeln eines Spiels (wer zieht, was kollidiert, wer gewinnt) lassen sich einmal festlegen und exakt reproduzieren, sofern die Arithmetik festgeschrieben ist.
2. Die Bilder, die ein Spiel zeichnet, lassen sich nicht auf jeder Grafikkarte bitgleich machen, wohl aber darauf prüfen, ob sie innerhalb eines gemessenen Fehlers bleiben.
3. Heutige Spielbeschreibungsformate decken jeweils nur eine Scheibe ab (Shader, Szenen oder Regeln); fast keines prüft die Nähte zwischen den Scheiben, und genau auf diese Nahtstellen konzentriert sich dieser Entwurf.

*Vollständiger englischer Originaltext: [/papers/game-engines/](/papers/game-engines/).*
