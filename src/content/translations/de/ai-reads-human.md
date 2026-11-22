---
title: "\"KI\" liest Mensch: menschenlesbare Kodierung in Maschinengeschwindigkeit und ihre Energiekosten"
deck: "Laufende Arbeit. Warum so vieles von dem, was Maschinen austauschen, für Menschen geschrieben ist, was das heute an Bytes, Tokens und Zeit kostet und wie die Energiekosten gemessen werden sollen."
lang: "de"
source: "ai-reads-human"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

Software-Agenten tauschen Daten in Formaten aus, die für Menschen zum Lesen gemacht wurden, etwa JSON, YAML, Markdown, XML und CSV. Wir nennen den dadurch entstehenden Mehraufwand die Impedanzsteuer, definieren ihn mit Einheiten und messen zwei seiner Teile auf einem reproduzierbaren Korpus mit 20,000 Datensätzen: Parsing-Zeit und Token-Anzahl. Ein erster Energieversuch auf zwei Laptops (Abschnitt 5b) konnte keine Netto-Parsing-Energie vom Grundverbrauch trennen; daher wird kein Joule-Anspruch erhoben.

**In einfachen Worten**

1. Computer und Menschen nutzen oft dasselbe schriftliche Format: Für Menschen ist es leicht lesbar, doch der Computer muss beim Zurücklesen zusätzliche Arbeit leisten.
2. Auf unseren Testdaten dauerte das Einlesen derselben Datensätze als JSON (Pythons eingebauter Parser) rund 8-mal und als YAML rund 735-mal so lange wie ein festes Binärlayout; von einem KI-Modell gelesen verbrauchte YAML rund 2.2-mal so viele Tokens wie CSV.
3. Wir haben Zeit und Token-Zahlen gemessen; beim Versuch, die Energie auf zwei Laptops zu messen, war das Signal gegenüber der Hintergrundleistung zu klein, sodass diese Seite keine Aussage über eingesparte Joule trifft.

*Vollständiger englischer Originaltext: [/papers/ai-reads-human/](/papers/ai-reads-human/).*
