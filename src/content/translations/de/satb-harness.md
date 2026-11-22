---
title: "Satiation Benchmark: Referenz-Harness, Adapter und Telemetrie-Zuordnung"
deck: "Ein fester sequenzieller Rust-Referenz-Harness (Lane B), eine einzige Proxy-isolierte Adapterbrücke (Shapes D, M, H und I), eine zwölfteilige Konformitätssuite (C1 bis C12) sowie eine fünfstufige rootlose Telemetrie-Zuordnung (L0 bis L4 gekreuzt mit den Labels A1 bis N). Empirisch geprüft auf Apple M5 Max über Cloud-Determinismus-Sonden, Abtastraten-Tests des Beobachtereffekts (0 Hz Grenzablesung gegenüber 1 Hz, 10 Hz und 100 Hz), sequenzielle Zeitgrenzen gegen CPU-zeitproportionale Aufteilung sowie 188 Messfenster auf einem gemeinsam genutzten Host. On-Chip-Zähler des Apple Silicon werden als reported_j erfasst; ein externes Steckdosen- oder Schienen-Leistungsmessgerät war nicht angeschlossen (board_metered ist false; measured_j ist nicht gesetzt)."
lang: "de"
source: "satb-harness"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

Wenn zwei Agenten-Benchmarks unterschiedliche Lösungsraten oder Energiewerte melden, stammt die Abweichung häufig aus der umgebenden Harness-Logik und der Zählerzuordnung statt aus dem Modell selbst. Auf `Terminal-Bench 2` verschob allein der Wechsel des Harnesses die Lösungsrate von `Gemini 2.5 Pro` um `17` Prozentpunkte, während der Abzug einer driftenden Leerlaufbasis oder die Aufteilung einer geteilten Chip-Schiene nach Prozessorzeit die Energiezuordnung um mehr als `30%` verzerren kann. Diese Studie spezifiziert und prüft auf einem `Apple M5 Max` (`128 GB` gemeinsamer Speicher, `macOS 27.2.1`) den Vertrag des Satiation Benchmark (`SATB`): einen deterministischen sequenziellen Rust-Harness (`Lane B` mit modellruffreier `80%`-Fenster-Elision `ContextRule_v0` und `8 + 8 KiB` `Truncate_v0`), eine lokale Proxy-Brücke (`Shapes D, M, H, I`), einen fünfblöckigen System-Fingerabdruck, zwölf Konformitätstests (`C1` bis `C12`) und eine fünfstufige Telemetrie (`L0` bis `L4`, Labels `A1` bis `N`), wobei lokale Zähler als `reported_j` und geschlossene Cloud-Serverenergie strikt als `not_available` protokolliert werden.

**In einfachen Worten**

1. Prompt-Schleife, Kontext-Kürzung und Werkzeug-Sandbox verändern Benchmark-Ergebnisse ebenso stark wie ein Modellwechsel; deshalb hält `Lane B` diese Hülle in deterministischem Rust konstant, während `Lane O` externe Agenten durch genau einen geprüften Proxy führt.
2. Energiekanäle werden roh an ihrer tatsächlichen physischen Grenze aufgezeichnet (Steckdose, Platineneingang, Chip-Package, Betriebssystem-Prozessschätzung oder logisches Token-Buch) und niemals zu einer unbeschrifteten Zahl vermischt oder mit Flotten-Medianen aufgefüllt.
3. Messungen auf dem `Apple M5 Max` bestätigen alle `12/12` Konformitätstests (`0` Byte Replay-Abweichung, `2.07 ms` `SIGKILL`-Bereinigung des Prozessbaums), zeigen, warum `temperature = 0` bei drei Cloud-Anbietern keine identischen Ausgaben garantiert, beziffern den Beobachter-Eigenverbrauch (`0.011 mW` an Ereignisgrenzen gegenüber `66.44 mW` bei `10 Hz`) und belegen `32.59%` bis `35.86%` Abweichung bei prozessorzeitproportionaler Aufteilung gegenüber exakten sequenziellen Grenzzählern.

*Vollständiger englischer Originaltext: [/papers/satb-harness/](/papers/satb-harness/).*
