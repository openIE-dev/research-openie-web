---
title: "\"KI\" liest Mensch: menschenlesbare Kodierung in Maschinengeschwindigkeit und ihre Energiekosten"
deck: "Arbeitsstand: Warum ein Großteil dessen, was Maschinen untereinander austauschen, für Menschen geschrieben ist, welche Kosten dies in Bytes, Tokens und Zeit sowie in pro Prozess erfasster Kernel-Rusage-Energie auf Apple Silicon (reported_j) über 34 Parse- und Tokenisierungs-Workloads verursacht und warum die extern gemessene Energie am Netzmessgerät (measured_j) weiterhin offen ist."
lang: "de"
source: "ai-reads-human"
complete: true
---

<div id="ai-reads-human-human-language-encoding-at-machine-speed-and-the-energy-cost" class="anchor-alias" aria-hidden="true"></div>

*Arbeit im Gange, Revision af57f48, 22. November 2026. Interaktives Observatorium, Daten, Code und Leseledger: [research.openie.dev/living/ai-reads-human/](/living/ai-reads-human/). Gemeinsame Begriffe: [Glossar](/glossary/).

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

Software-Agenten tauschen Daten in Formaten aus, die für Menschen zum Lesen gedacht sind, etwa JSON, YAML, Markdown, XML und CSV. Diese Studie benennt den zusätzlichen Aufwand, den dies verursacht, als Impedanzsteuer (impedance tax), definiert ihn mit Einheiten und misst drei Teile davon an einem gesäten (seeded) Korpus mit 20.000 Datensätzen: Parsezeit, Tokenanzahl über fünf offene Tokenizer sowie die zweikanaligen `reported_j`-Zähler von Betriebssystem und Chip des Apple M5 Max für alle 34 Parse- und `tiktoken`-Workloads (Abschnitt 5c). Ein erster, nicht isolierter Versuch auf Gesamtchip-Ebene an zwei ausgelasteten Laptops konnte Parsing nicht von Hintergrund-Drift durch Mitnutzer trennen (Abschnitt 5b). Durch die Isolation jedes Workloads in einem eigenen Worker-Subprozess mit dem Kernel-Zähler pro Prozess `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3`, Bezeichnung `D`) wird jedoch eine Parse-Energiespanne von `2,053.8×` aufgelöst: von `280.4 nJ/record` für festes Binärformat (`struct.iter_unpack`) über `2,212.1 nJ/record` für Standard-JSON (`7.89×`) und `69,922.1 nJ/record` für C-`libyaml` (`249.4×`) bis `575,799.3 nJ/record` für reines Python-YAML (`2,053.8×`). Zudem zeigt sich, dass die `cl100k_base`-Tokenisierung von kompaktem JSON (`27,679.2 nJ/record`, `98.7×` gegenüber festem Binärformat) das `12.5×` des On-Chip-`reported_j` von `json.loads()` selbst verbraucht. Gleichzeitig hat das Gesamtchip-`IOReport` (`L2`, Bezeichnung `A2`) das Falsifikator 6 (`> 5.0%` Drift gegenüber der Leerlauf-Baseline vor und nach der Messung) bei `109` von `170` gemeinsam genutzten Messfenstern ausgelöst. Das bestätigt, warum nicht isolierte Paketsubtraktion auf aktiven Hosts scheitert. Es war kein externer Inline-Leistungsmesser oder Wattmeter angeschlossen (`measured_j = None`, `board_metered = false`), und die Joule-Werte für Prefill und Decode des GPU-Modells bleiben geplant (M4).

**In einfachen Worten**

1. Computer und Menschen verwenden oft dasselbe Schriftformat. Dieses Format ist für Menschen leicht lesbar, der Computer muss jedoch zusätzliche Arbeit leisten, um es wieder einzulesen.
2. In unserem Testkorpus mit 20.000 Datensätzen kostete das Lesen von festem Binärformat (`struct.iter_unpack`) auf dem Apple M5 Max laut dem Kernel-Zähler `ri_energy_nj` pro Prozess `280.4 nJ/record` (`reported_j`). Zum Vergleich: Pythons integrierter JSON-Leser benötigte `2,212 nJ/record` (`7.89×`), C-beschleunigtes YAML `69,922 nJ/record` (`249.4×`) und reines Python-YAML `575,799 nJ/record` (`2,053.8×`).
3. Die Tokenisierung von kompaktem JSON für ein KI-Modell mit `tiktoken` (`cl100k_base`) kostete `27,679 nJ/record` (`1.69×` der CSV-Tokenisierung und `12.5×` des Parsens mit `json.loads()` selbst), bevor das Sprachmodell auch nur eine Matrixmultiplikation ausführt. Alle Energiewerte auf dieser Seite sind Kernel- bzw. On-Chip-`reported_j`-Zähler (`measured_j = None`, `board_metered = false`). Joule-Werte für Prefill und Decode des GPU-Modells sowie externe Hardware-Leistungsmesser sind noch geplant.

> **Status: in Arbeit, und das Projekt wird weiter wachsen.** Mit *Geplant* gekennzeichnete Abschnitte (etwa GPU-Zähler für Prefill und Decode M4, natürlichsprachliche Korpora M6 und plattformübergreifende C/Rust-Parser M8) sind noch nicht abgeschlossen. Jede Zahl auf dieser Seite wird aus herunterladbaren Dateien unter `/living/ai-reads-human/` neu berechnet. On-Chip-Energiezähler sind ausschließlich `reported_j` (`measured_j = None`, `board_metered = false`).

<div id="1-background-formats-written-for-people" class="anchor-alias" aria-hidden="true"></div>

## 1. Hintergrund: Für Menschen geschriebene Formate

Die meisten Daten, die Agenten heute austauschen, werden in Formaten übertragen, deren Spezifikationen den Menschen vor die Maschine stellen. Die unten zitierten Passagen wurden für diese Seite gelesen; der Lesestatus jeder Quelle (FULL, PARTIAL oder UNAVAILABLE) ist im [Lesenachweis](/living/ai-reads-human/READ_LEDGER.md) vermerkt.

- **TeX** entstand 1982: Die Quelldatei `tex.web` (Kopfteil, die ersten 19.000 Bytes gelesen; PARTIAL) hält fest, dass Version 0 im September 1982 veröffentlicht wurde, und datiert spätere Versionen ab 3.0 (März 1990).
- **Markdown** wurde von John Gruber mit Unterstützung von Aaron Swartz entwickelt und 2004 als Syntaxbeschreibung zusammen mit einem Perl-Skript veröffentlicht, das nach HTML konvertiert. Die CommonMark-Spezifikation (Version 0.31.2, 28. Januar 2024) stellt fest, dass diese Beschreibung "die Syntax nicht eindeutig festlegt", und listet Fragen auf, die sie offenlässt (CommonMark 0.31.2, Abschnitte 1.1 und 1.2).
- **CSV** wurde im Oktober 2005 mit RFC 4180 dokumentiert, einem *informativen* RFC, das erklärt, es existiere "keine formale Spezifikation", und festhält, was die meisten Implementierungen offenbar tun.
- **JSON** ist durch RFC 8259 (Dezember 2017, ersetzt RFC 7159) definiert als "ein leichtgewichtiges, textbasiertes, sprachunabhängiges Datenaustauschformat". RFC 7493 (März 2015, I-JSON) schränkt es für Protokolle ein.
- **Kanonische und binäre Formen** existieren ebenfalls im Normenbestand: RFC 8785 (Juni 2020) definiert ein JSON Canonicalization Scheme, und RFC 8949 (Dezember 2020, ersetzt RFC 7049) definiert CBOR, ein binäres Datenformat mit einem Abschnitt zur deterministischen Kodierung (Abschnitt 4.2), den Protokolle übernehmen können.
- **YAML** Revision 1.2.2 (1. Oktober 2021) nennt seine Gestaltungsziele "in absteigender Priorität", und das Ziel mit der höchsten Priorität lautet "YAML sollte von Menschen leicht lesbar sein" (Abschnitt 1.1).

![Zeitleiste der datierten Spezifikationen, die zu diesem Thema gelesen wurden](/living/ai-reads-human/charts/format-timeline.svg)

*Abbildung 1. Datumsangaben in den Dokumenten des Lesenachweises. Erzeugt durch `scripts/make_charts.py`.*

Diese Fakten besagen nicht, dass menschenlesbare Formate Fehlentscheidungen waren. Sie besagen, dass die Lesbarkeit für Menschen ein erklärtes Gestaltungsziel war und dass die Kosten des maschinellen Zurücklesens nicht das Kriterium war, das minimiert wurde. Wo andere Arbeiten zu maschinenorientierten Formen gelangen (CBOR, kanonisches JSON, Protocol Buffers, Avro, safetensors, GGUF), verzeichnet diese Studie dies als Konvergenzbeobachtung: Mehrere Gemeinschaften haben für den maschinellen Austausch feste oder deterministische Kodierungen gewählt, während sie für Menschen Text beibehalten haben.

<div id="2-the-impedance-tax-defined" class="anchor-alias" aria-hidden="true"></div>

## 2. Die Impedanzsteuer, definiert

Sei R eine Menge von Datensätzen, die Informationen tragen, welche ein maschineller Konsument benötigt. Sei F ein Format mit Kodierer `enc_F` und Dekodierer `dec_F`, und sei M eine kanonische Maschinenform: eine gültige Bytefolge pro Wert.

| Symbol | Bedeutung | Einheit |
|---|---|---|
| B_F | kodierte Größe von R im Format F | Byte |
| N | Anzahl der Datensätze | 1 |
| k | ein Tokenizer | n/a |
| T_{F,k} | von k auf der Kodierung von R erzeugte Token | Token |
| d_{F,k} = B_F / T_{F,k} | Bytes pro Token | Byte/Token |
| t_parse(F) | Wandzeit zum Dekodieren von R zu Speicherwerten | s |
| P | mittlere Leistung während einer Operation | W = J/s |
| E | Energie einer Operation, E = ∫ P dt, näherungsweise P_avg · t | J |
| e_prefill | Modellenergie pro Eingabetoken | J/Token |

Die **Impedanzsteuer** von F relativ zu M ist die zusätzliche Energie, die ein Konsument aufwendet, weil die Information in F eintrifft:

Z(F) = E_enc(F) + E_parse(F) + E_tok(F,k) + e_prefill · T_{F,k} + E_ctx(F)

τ(F) = Z(F) − Z(M)  (joules),  θ(F) = Z(F) / Z(M)  (dimensionless)

E_ctx(F) ist der zusätzliche Dekodieraufwand, den ein längerer Kontext verursacht; sein Koeffizient hängt vom Modell ab und ist ein Messziel (M4 unten). Abschnitt 5c misst `E_parse(F)` und `E_tok(F,k)` in per-Prozess-Kernel-`reported_j` (`ri_energy_nj`) auf Apple M5 Max.

Drei dimensionslose Verhältnisse können ohne jeden Energiezähler gemessen werden:

- Byte-Verhältnis β_F = B_F / B_ref
- Token-Verhältnis κ_{F,k} = T_{F,k} / T_{ref,k}
- Parsezeit-Verhältnis π_F = t_parse(F) / t_parse(ref)

und sie sind durch eine Identität verknüpft, der die Tokenzahlen unten gehorchen:

κ_F = β_F · (d_ref / d_F)

sodass ein Format mehr Token kosten kann, weil es mehr Bytes hat, weil seine Bytes in mehr Stücke zerfallen oder beides.

![Wo die Impedanzsteuer gezahlt wird: kodieren, transportieren, parsen, tokenisieren, Modell liest](/living/ai-reads-human/charts/impedance-pipeline.svg)

*Abbildung 2. Die Terme von Z(F). Ohne Modell im Pfad (Maschine zu Maschine) gelten nur kodieren, transportieren und parsen. Bei einem Modell, das Text liest, gelten tokenisieren und lesen.*

<div id="21-physical-scale-and-what-this-page-does-not-claim" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Physikalische Größenordnung und was diese Seite nicht behauptet

Die thermodynamische Untergrenze für das Löschen eines Bits bei der Temperatur T ist das Landauer-Limit E = k_B T ln 2. Mit k_B = 1.380649e-23 J/K (exakt laut der SI-Definition von 2019; der Wert wurde am 18. Oktober 2026 mit der Seite NIST CODATA 2022 zur Boltzmann-Konstante abgeglichen) ergibt sich für T = 300 K **2.871e-21 J** pro Bit, neu berechnet in `scripts/verify_numbers.py`. Acht Bit entsprechen 2.297e-20 J. Dies ist eine untere Schranke für irreversible Logik und keine Schätzung der Kosten für Parsing: Reale Software verursacht um Größenordnungen höhere Kosten, etwa durch Speicherzugriffe, Befehlsausführung und Kühlung. Diese Seite nutzt das Limit nicht, um irgendeine Zahl vorherzusagen.

Energiewerte für die Inferenz von Modellen stammen aus Messungen anderer Autorinnen und Autoren auf deren eigener Hardware. Sie dienen nur als Hintergrund und sind nicht unsere Messung:

- Samsi et al., "From Words to Watts: Benchmarking the Energy Costs of Large Language Model Inference" (arXiv:2310.03003), definieren die Energie pro Ausgabe-Token als gesamte GPU-Energie geteilt durch die dekodierten Ausgabe-Token. Sie berichten für ein LLaMA-Modell mit 65 Milliarden Parametern und einer maximalen Generierungslänge von 512 etwa 3 bis 4 J pro Ausgabe-Token. Gemessen wurde mit NVIDIA DCGM auf ihrem Aufbau am MIT SuperCloud (V100-GPUs für die Läufe mit 8, 16 und 32 Shards). Diese Arbeit trennt die Energie für Prefill und Decode nicht.
- Luccioni, Jernite und Strubell, "Power Hungry Processing: Watts Driving the Cost of AI Deployment?" (ACM FAccT 2024, DOI 10.1145/3630106.3658542), messen die Energie pro 1.000 Inferenzen nach Aufgabe mit CodeCarbon auf einem Knoten mit 8 A100-GPUs. Ihre Tabelle 2 gibt im Mittel 0,002 kWh für die Textklassifikation und 0,047 kWh für die Textgenerierung an. Diese Werte wurden gegen die ACM Corrected Version of Record V1.1 (6. November 2024) geprüft. Diese Fassung enthält dieselben Werte in Tabelle 2 und denselben Aufbau (8 A100-80GB-GPUs auf AWS, CodeCarbon). Zitiert wird V1.1, da die Arbeit anmerkt, dass eine frühere Version in einem Vergleich 0,012 kWh verwendete. Den übrigen Teil der Arbeit haben wir nur teilweise gelesen.

Eine Energiezahl pro Wort für DRAM-Lesezugriffe (häufig zitierte 640 pJ pro 32-Bit-Lesezugriff) wird **auf dieser Seite nicht verwendet**. Ihre angegebene Quelle, Horowitz (2014), wurde gelesen: Das Paper nennt etwa 1 bis 2 nJ pro DRAM-Zugriff, und die Folien des Plenarvortrags nennen 1,3 bis 2,6 nJ pro 64-Bit-Zugriff. Der Wert von 640 pJ erscheint nur in späteren Folien, die sich darauf berufen. Abschnitt 9 dokumentiert diesen Status.

<div id="3-what-was-measured" class="anchor-alias" aria-hidden="true"></div>

## 3. Was gemessen wurde

Die anfänglichen Laufzeit- und Token-Zähl-Baselines wurden auf einer virtualisierten Intel-Xeon-Maschine (8 vCPU, Linux 6.12, Python 3.13.5) ausgeführt, die keine RAPL-Energiezähler bereitstellt (`/sys/class/powercap` fehlt), gefolgt von Apple-M5-Max-Energiekampagnen, die in den Abschnitten 5b und 5c berichtet werden. Der Korpus ist synthetisch und gesät (`scripts/gen_corpus.py`, Seed 20261016): 20.000 Datensätze, jeder mit einer ID, einem dreiwortigen Namen, einem Fließkomma-Score, einem Booleschen Wert, drei Tags und einem 31-Bit-Integer.

![Ein Datensatz in fünf Kodierungen](/living/ai-reads-human/charts/one-record-five-ways.svg)

*Abbildung 3. Datensatz 0 in CSV, kompaktem JSON, YAML, XML und einem 23-Byte-fixen Binärlayout. Das Binärlayout speichert jedes Wort als ein-Byte-Index in einer gemeinsam genutzten Liste von 24 Wörtern, sodass das Rücklesen diese Liste benötigt. Die Byte-Zahlen der Textformen beinhalten den Zeilenumbruch.*

<div id="31-parse-time" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Parse-Zeit

![Parse-Zeit pro Datensatz: festes Binärformat 116 ns, JSON-Standardbibliothek 904 ns, YAML libyaml 85300 ns](/living/ai-reads-human/charts/parse-time-headline.svg)

*Abbildung 4. Minimum aus 9 Wiederholungen über 20.000 Datensätze auf dem Linux-Xeon-Baseline-System. Quelle: `/living/ai-reads-human/data/parse_time.tsv`, Spalte `ns_per_record`. Logarithmische Skalierung.*

| Format und Parser | ns pro Datensatz (Xeon) | Verhältnis zum festen Binärformat |
|---|---|---|
| Festes Binärformat, `struct.iter_unpack` | 116 | 1,0 |
| JSON, Python-Standardbibliothek | 904 | 7,8 |
| YAML, PyYAML mit libyaml | 85.300 | 735,3 |

YAML benötigte auf dem Xeon-Host 94,4-mal so lange wie die Standardbibliotheks-JSON-Implementierung für dieselben Datensätze (und `22.404 ns` gegenüber `570 ns` = `39,3×` für C `libyaml` bzw. `161.227 ns` = `282,9×` für reines Python-YAML auf dem Apple M5 Max in Abschnitt 5c). Die vollständige Xeon-Tabelle aller getesteten Formate und Parser befindet sich in Abbildung 5.

![Parse-Zeit pro Datensatz, alle getesteten Formate](/living/ai-reads-human/charts/parse-time-all.svg)

*Abbildung 5. Alle Zeilen von `data/parse_time.tsv` mit Ausnahme der Zero-Copy-numpy-Zeile, die keine Objekte aufbaut und daher nicht vergleichbar ist.*

**Grenzen dieser Messung.** (a) Die Parser leisten unterschiedliche Arbeit: Der Leser für das feste Binärformat liefert Tupel zurück, JSON und YAML erzeugen typisierte Python-Objekte, CSV liefert Zeichenketten und die XML- sowie Markdown-Zeilen bauen Bäume oder Token-Ströme auf, ohne Werte zu konvertieren; die Verhältnisse vergleichen daher das End-to-End-Verhalten der Bibliotheken, nicht die intrinsischen Kosten jedes Formats. (b) Eine einzige Sprachlaufzeitumgebung (CPython 3.13). (c) Das Korpus ist synthetisch und enthält wenige Bezeichner. (d) Zeit allein ist nicht Energie: Abschnitt 5c misst daher direkt den kernel-seitigen Prozesswert `ri_energy_nj` (`reported_j`) über alle 34 Parse- und Tokenisierungsworkloads.

<div id="32-tokens" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Token

Ein Sprachmodell liest Token, nicht Bytes. Dieselben Datensätze, gezählt mit dem Tokenizer `cl100k_base` auf den ersten 2.000 Datensätzen jeder Ansicht (und über alle 20.000 Datensätze in Abschnitt 5c verifiziert):

![Token pro Datensatz relativ zu CSV](/living/ai-reads-human/charts/tokens-vs-csv.svg)

*Abbildung 6. κ = Token pro Datensatz der Ansicht geteilt durch Token pro Datensatz von CSV. Quelle: `/living/ai-reads-human/data/tokens.tsv`.*

| Ansicht | Token pro Datensatz | κ (relativ zu CSV) |
|---|---|---|
| CSV | 22,9 | 1,00 |
| JSON, kompakt | 36,2 | 1,58 |
| YAML | 51,4 | 2,24 |
| JSON, mit Einrückung (Einzug 2) | 65,6 | 2,86 |

Die Identität aus Abschnitt 2 gilt für diese Daten: Für kompaktes JSON gilt β = 1,912 und d_CSV/d_JSON = 0,826, woraus κ = 1,58 folgt; für YAML gilt 2,028 × 1,107 = 2,24; für JSON mit Einrückung gilt 3,056 × 0,936 = 2,86. Kompaktes JSON verursacht mehr Token vor allem deshalb, weil es etwa das 1,9-Fache der Bytes von CSV umfasst, und JSON mit Einrückung größtenteils aus demselben Grund zuzüglich der Einrückung. YAML hat sowohl mehr Bytes als auch kürzere Token.

![Token-Verhältnis zu CSV bei fünf Tokenizern](/living/ai-reads-human/charts/tokens-five-tokenizers.svg)

*Abbildung 7. Dasselbe Verhältnis bei den Tokenizern `cl100k_base`, `o200k_base`, GPT-2, Mistral-7B-v0.1 und Qwen2.5-0.5B. Die Reihenfolge bleibt in allen fünf erhalten, die Größe der Abweichung hingegen nicht (JSON mit Einrückung beträgt das 3,66-Fache von CSV bei GPT-2 und das 2,22-Fache bei Qwen2.5). Kein geschlossener kommerzieller Tokenizer wurde getestet.*

![Kodierte Bytes pro Datensatz](/living/ai-reads-human/charts/bytes-per-record.svg)

*Abbildung 8. Bytes pro Datensatz. Die Binärabbildung mit 23 Byte zählt die gemeinsame Wortliste nicht mit; jede belastbare Größenangabe für eine Binärform muss die Liste (oder das Wörterbuch), von der sie abhängt, nach Version und Hash benennen.*

**Ein Negativergebnis, das festzuhalten ist.** Die Darstellung des Binärlayouts als Text für ein Modell hebt die Token-Last nicht auf: Als Base64 ergaben sich 20,3 Token pro Datensatz (κ = 0,89), als Hexadezimal 22,7 (κ = 0,99), also etwa so viel wie CSV, denn ein Textmodell benötigt eine textuelle Ansicht. Die Einsparung für ein Modell entsteht durch das Senden weniger, besser ausgewählter Felder, nicht durch eine andere Kodierung des gesendeten Inhalts. Diese Aussage ist Planung (M7) und nicht gemessen.

<div id="4-why-the-hazards-come-with-the-readability" class="anchor-alias" aria-hidden="true"></div>

## 4. Warum die Gefahren mit der Lesbarkeit einhergehen

Formate, die für Menschen und für lose gekoppelte Programme entwickelt wurden, lassen dieselbe Eingabe von verschiedenen Lesenden unterschiedlich interpretiert werden. Die Tabelle listet Gefahren auf, die in den gelesenen Spezifikationen gefunden wurden, sowie in Tests, die mit den angegebenen Bibliotheksversionen durchgeführt wurden (Python 3.13.5, Node v20.19.2, jq 1.7, PyYAML 6.0.2, lxml 6.1.3). Testzeilen (T, U, X, Y, C-Codes) befinden sich in `tests-formats/RESULTS.txt` und beschreiben ausschließlich diese Versionen. "Spec" bezeichnet den Text des zitierten Dokuments.

| Klasse | Format | Gefährdung | Nachweis |
|---|---|---|---|
| Ambiguität | JSON | Doppelte Elementnamen führen zu „unvorhersehbarem“ Verhalten; Implementierungen berichten den letzten Wert, alle Werte oder scheitern. Drei getestete Werkzeuge behielten den letzten Wert bei. | RFC 8259 Abschnitt 4; T1 |
| Ambiguität | Markdown | Die ursprüngliche Beschreibung legt die Syntax nicht eindeutig fest; Dialekte divergierten. | CommonMark 0.31.2 Abschnitt 1.2 |
| Parserdifferenz | JSON-Zahlen | 9007199254740993 ist in Python exakt und wird in Node zu …992 gerundet. | RFC 8259 Abschnitt 6; T2 und N2 |
| Parserdifferenz | JSON | Pythons `json` akzeptiert nacktes `NaN` und `Infinity`, was die Spezifikation nicht zulässt. | RFC 8259 Abschnitt 6; T6 |
| Nicht-kanonische Formen | JSON | `1`, `1.0`, `1e0`, `10E-1`, `0.1e1` sind eine Zahl in fünf Schreibweisen und zwei Python-Typen. | U3 |
| Nicht-kanonische Formen | JSON | Die Reihenfolge der Elemente ändert die Bedeutung nicht, verändert jedoch die Bytes und jeden Hash davon. | T8 |
| Ordnung | JSON-Kanonisierung | Sortierung nach UTF-16-Codeeinheiten unterscheidet sich von der Codepunkt-Reihenfolge bei U+1F600 gegenüber U+FFEE. | RFC 8785 Abschnitt 3.2.3; U2 |
| Nicht-kanonische Formen | CBOR | Deterministische Kodierung ist ein optionales Profil, das Protokolle übernehmen können; sie ist nicht die Vorgabe. | RFC 8949 Abschnitt 4.2 |
| Nicht-kanonische Formen | Protocol Buffers | „Do not assume the byte output of a serialized message is stable.“ | Protobuf-Kodierungsleitfaden, „Implications“ |
| Zahlengefährdungen | JSON | Implementierungen dürfen Bereich und Genauigkeit einschränken; der exakt darstellbare ganzzahlige Bereich beträgt ±(2^53)−1. | RFC 8259 Abschnitte 6 und 9; RFC 7493 Abschnitt 2.2 |
| Zahlengefährdungen | JSON | `1e400` wird in Python und Node zu `inf`; `-0` wird unterschiedlich behandelt. | T3, N3, T4, N4 |
| Zahlengefährdungen | YAML-1.1-Auflöser | In PyYAML wird `010` zu 8, `12:30:45` zu 45045 und `country: NO` zu `{country: False}`. | Y-Zeilen |
| Zahlengefährdungen | TOML | Die Spezifikation erklärt eine Ganzzahl, die nicht verlustfrei gespeichert werden kann, zum Fehler; Pythons `tomllib` akzeptierte 2^63. | TOML 1.0.0; T-Zeilen |
| Unicode | JSON | `"\uDEAD"` (ein ungepaarter Ersatzteil) ist durch die Grammatik erlaubt; es wird geparst, scheitert dann aber bei der UTF-8-Kodierung. | RFC 8259 Abschnitt 8.2; T5 |
| Unicode | JSON | NFC- und NFD-Formen desselben Texts sind unterschiedliche Schlüssel. | U1 |
| Injektion | CSV | Eine Zelle, die mit `=` beginnt, ist für den Parser reine Daten und für manche Tabellenkalkulationsprogramme eine Formel. | OWASP CSV Injection; C-Zeile |
| Injektion | XML | Bei eingeschalteter Entitätsauflösung las lxml eine lokale Datei über eine externe Entität. | X-Zeilen |
| Ressourcenexplosion | YAML | 166 Bytes Aliase wurden zu 59.049 logischen Blättern expandiert. | Y-Alias-Test |
| Ressourcenexplosion | XML | 202 Bytes interner Entitäten wurden zu 10.000 Zeichen (49,5-fach) expandiert. | X-Zeilen |
| Ressourcenexplosion | JSON | Tiefenbeschränkungen sind implementierungsabhängig; Python löste bei 100.000 Schachtelungstiefe `RecursionError` aus. | RFC 8259 Abschnitt 9; T9 |
| Totalität | beliebiger Parser | Bibliotheksausnahmen sind Kontrollfluss außerhalb des Rückgabetypen der Funktion. | T5, T9 |

Keines dieser Argumente ist ein Grund, die Formate für Menschen zu meiden. Jedes davon ist jedoch ein Grund, denselben Text nicht als einzige maßgebliche Instanz zwischen Maschinen zu verwenden.

<div id="5-planned-measuring-energy" class="anchor-alias" aria-hidden="true"></div>

## 5. Geplant: Messung des Energieverbrauchs

Die Messungs-Roadmap trennt abgeschlossene Parse-/Tokenize-`reported_j`-Zähler von offenen GPU-Inference- und externen Hardware-Stromsonden:

| ID | Messung | Status |
|---|---|---|
| M1, M2, M3 | Parse-Zeit, Tokens, Tokenizer-Durchsatz | **Erledigt** (`data/parse_time.tsv`, `data/tokens.tsv`, `data/tokenize_time.tsv`) |
| M5 | Parse- und `tiktoken`-Energie über alle 34 Arbeitslasten mittels Dual-Channel Apple M5 Max `reported_j` (`L3` pro Prozess `ri_energy_nj` + `L2` gesamt-Chip `IOReport` mit Falsifier 6 Leerlauf-Drift-Gating) | **Erledigt für `reported_j`** (Abschnitt 5c; `data/energy_reported_j.tsv`; `measured_j = None`, `board_metered = false`) |
| M4 | Energie für Prä-Füllung und Dekodierung pro Token in Abhängigkeit von der Kontextlänge, gleiches Modell, GPU mit einem hardwarebasierten Energiezähler oder externem Schienen-/Steckdosen-Messgerät | Geplant (benötigt dedizierten GPU-Zähler oder Inline-Stromprobe) |
| M6 | Ein zweiter Korpus: Dokumentation und Protokolle in natürlicher Sprache gegenüber identifier-lastiger Telemetrie | Geplant |
| M7 | Aufgabenebene: Tokens, die ein Agent benötigt, um einen festen Fragenkatalog anhand einer Projektion der benötigten Felder gegenüber dem vollständigen Dokument zu beantworten | Geplant |
| M8 | Weitere Parser pro Format (simdjson, rapidyaml, libxml2 C, pulldown-cmark) zur Abschätzung von Sprache-Laufzeit-Effekten | Geplant |

Externe Steckdosen- oder Inline-USB-C-Stromprobe-Messungen (`measured_j`) liegen noch nicht vor; Abschnitt 5c berichtet ausschließlich über Betriebssystem-/On-Chip-`reported_j`-Zähler.

<div id="5b-measured-energy-no-net-effect-resolved" class="anchor-alias" aria-hidden="true"></div>

## 5b. Gemessene Energie: kein Nettoeffekt aufgelöst

*Erster Ganz-Chip-Subtraktionsversuch, ausgeführt am 2026-10-18 auf zwei Apple-M5-Max-Laptops (48 GB im Akkubetrieb, 128 GB am Netz), macOS 27.0.1, Python 3.13.16, Leistungszähler macmon 0.10.0 (48 GB) und 0.9.0 (128 GB), Auslesen des gesamten-SoC-`IOReport` sowie der SMC-Sensoren (`all_power` und `sys_power`). Neun Parse-Arbeitslasten auf denselben 20.000 Datensätzen, jeweils 10 s lang auf einem Thread geschleift, 10 verschachtelte Runden mit einem 10 s langen Leerlauffenster vor und nach jeder Runde. Dateien: `/living/ai-reads-human/data/energy_joules.tsv` sowie Rohmessungen in `/living/ai-reads-human/data/energy_raw_m5max48/` und `energy_raw_m5max128/`.*

**Ergebnis des unisolierenden Ganz-Chip-Versuchs: die paketbezogene Subtraktion über Leerlauf konnte das Einzel-Thread-Parsen auf einem ausgelasteten Rechner nicht auflösen.** Auf beiden Laptops (Ein-Minuten-Lastmittel 41 bis 68) verschob sich die Leerlaufbasis vor/nach den Fenstern um 2 bis 7 W, während ein Parse-Thread nur 1 bis 5 W zu einem Chip mit 18 bis 36 W Gesamtverbrauch hinzufügte. Dadurch lag jedes Netto-Mittel innerhalb von 1,5 Standardfehlern bei null (mehrere negativ). Dieser Fehlschlag motivierte das Dual-Kanal-Protokoll in Abschnitt 5c: die Kopplung des Ganz-Chip-`IOReport` (`L2`, gesteuert durch Falsifier 6, sodass abgedriftete Netto-Subtraktionen automatisch verworfen werden) mit der macOS-Kernel-per-PID-Messung `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3`), die die CPU-Energie strikt dem dedizierten Worker-Subprozess zuordnet, der jede Arbeitslast ausführt.

<div id="5c-dual-channel-apple-m5-max-reported_j-across-all-34-parse-and-tokenize-workloads" class="anchor-alias" aria-hidden="true"></div>

## 5c. Zwei-Kanal-`reported_j` auf dem Apple M5 Max über alle 34 Parse- und Tokenisierungs-Workloads

*Ausgeführt am 22.11.2026 (`16:44:52` bis `16:53:22 UTC`) auf einem Apple M5 Max (`128 GB` RAM, `macOS 27.2.1` `arm64`, `Python 3.13.14`, `macmon 0.12.0`), Korpus mit Seed `20261016` (`20.000` Datensätze in 12 per SHA-256 fixierten Dateien), `5` verschachtelte, gemischte Runden × `34` Workloads = `170` dedizierte Worker-Subprozess-Fenster. Dateien: [`/living/ai-reads-human/data/energy_reported_j.tsv`](/living/ai-reads-human/data/energy_reported_j.tsv) und [`/living/ai-reads-human/data/energy_reported_j_summary.json`](/living/ai-reads-human/data/energy_reported_j_summary.json). Interaktiver Explorer: [`/living/ai-reads-human/`](/living/ai-reads-human/).*

<div id="telemetry-channels-and-falsifier-6-demonstration" class="anchor-alias" aria-hidden="true"></div>

### Telemetriekanäle und Falsifier 6 Demonstration

Jedes Messfenster zeichnete gleichzeitig zwei rootlose Telemetriekanäle auf, wobei `measured_j = None` und `board_metered = false` beibehalten wurden:

1. **Prozessbezogen `L3` `reported_j` (shared-host-Label `D`, Co-Mieter isoliert)**: `proc_pid_rusage(worker_pid, RUSAGE_INFO_V6).ri_energy_nj`, integriert vom XNU-Kernel ausschließlich über die Threads, die im dedizierten Worker-Subprozess für diesen einzelnen Format-/Tokenizer-Durchlauf geplant sind.
2. **Whole-SoC `L2` `reported_j` (shared-host-Label `A2`, durch Falsifier 6 gesteuert)**: `macmon pipe` sampelt Apple-Silicon `IOReport` `chip_power` zusammen mit `0.8 s` Vor- und Nach-Fenster-Idle-Baseline. Unter **Falsifier 6** wird jedes Fenster, dessen Vor-/Nach-Idle-Baseline um `> 5.0%` abweicht, automatisch mit `derived_marginal_j` invalide gesetzt anstatt gemeldet. Auf diesem shared-host (mittlerer 1-Minute-Load-Average `12.92`, Leerlauf-Chip-Verbrauch `30.5-35.4 W`) invalidierte Falsifier 6 **`109` von `170` Fenstern (`64.1%`)** über die 34 Workloads (`61 / 170` gültig, `0 / 34` Workloads, die alle `5 / 5` Replikate bestanden), wodurch Abschnitt 5b’s Diagnose quantitativ reproduziert wird, während `L3` `ri_energy_nj` jeden einzelnen Workload sauber auflöste.

<div id="parse-stage-l3-reported_j-16-workloads-20000-records" class="anchor-alias" aria-hidden="true"></div>

### Parse-Phase `L3` `reported_j` (`16` Workloads, `20.000` Datensätze)

| Format und Parser | Korpus-Bytes | Wand-ms / `20k` (Mittelwert ± SD) | `L3` `nJ / Datensatz` (Mittelwert ± SD) | `L3` `nJ / Byte` | Instruktionen / Datensatz | `L3`-Energieverhältnis gegenüber Binär |
|---|---:|---:|---:|---:|---:|---:|
| Feste Binärdarstellung (`numpy.frombuffer`, Zero-Copy-View) | `460.000` | `0,0002 ± 0,0000` | `0,04 ± 0,01` | `0,002` | `0,3` | `0,00×` (nur View) |
| **Feste Binärdarstellung (`struct.iter_unpack`, Referenz)** | `460.000` | `1,359 ± 0,351` | **`280,36 ± 111,38`** | `12,19` | `1.397,4` | **`1,00×`** |
| JSON (`orjson`, C/Rust-SIMD) | `2.325.428` | `7,053 ± 1,359` | **`1.405,93 ± 372,34`** | `12,09` | `6.187,0` | **`5,01×`** |
| CSV (`csv`, Python-Standardbibliothek) | `1.205.469` | `8,804 ± 1,309` | **`1.798,22 ± 435,28`** | `29,83` | `8.812,4` | **`6,41×`** |
| MessagePack (`msgpack`) | `1.660.773` | `10,817 ± 3,321` | **`1.802,46 ± 593,84`** | `21,71` | `9.593,3` | **`6,43×`** |
| **JSON (`json.loads`, Python-Standardbibliothek)** | `2.325.428` | `11,396 ± 1,219` | **`2.212,12 ± 409,29`** | `19,03` | `12.700,6` | **`7,89×`** |
| JSON mit Einrückung (`json.loads`, Einzug 2) | `3.685.429` | `11,716 ± 2,225` | **`2.648,45 ± 669,32`** | `14,37` | `13.433,3` | **`9,45×`** |
| CBOR (`cbor2`) | `1.660.877` | `15,286 ± 1,250` | **`2.719,58 ± 365,78`** | `32,75` | `14.514,3` | **`9,70×`** |
| XML (`lxml`-C-Bibliothek) | `2.885.487` | `22,204 ± 2,392` | **`3.800,46 ± 331,49`** | `26,34` | `19.521,4` | **`13,56×`** |
| XML (`xml.etree.ElementTree`) | `2.885.487` | `26,354 ± 0,750` | **`6.029,30 ± 370,65`** | `41,79` | `27.495,7` | **`21,51×`** |
| JSON Lines (`json.loads` pro Zeile) | `2.325.427` | `22,729 ± 1,481` | **`6.130,27 ± 946,08`** | `52,72` | `27.414,8` | **`21,87×`** |
| Markdown-Tabelle (`markdown-it-py`, Token) | `1.525.499` | `115,160 ± 7,576` | **`22.824,50 ± 2.464,64`** | `299,24` | `115.255,0` | **`81,41×`** |
| TOML (`tomllib`, Python-Standardbibliothek) | `2.505.426` | `298,582 ± 60,674` | **`57.803,43 ± 16.269,64`** | `461,43` | `260.140,9` | **`206,17×`** |
| **YAML (`PyYAML` mit C-`libyaml`)** | `2.445.427` | `448,071 ± 95,009` | **`69.922,12 ± 13.405,09`** | `571,86` | `371.347,0` | **`249,40×`** |
| Markdown-Liste (`markdown-it-py`, Token) | `1.925.427` | `417,700 ± 54,289` | **`99.595,04 ± 17.044,11`** | `1.034,52` | `377.878,0` | **`355,23×`** |
| **YAML (`PyYAML`, reines Python)** | `2.445.427` | `3.224,548 ± 375,725` | **`575.799,27 ± 56.674,36`** | `4.709,19` | `2.706.372,9` | **`2.053,75×`** |

<div id="tokenization-stage-l3-reported_j-18-tiktoken-workloads-20000-records" class="anchor-alias" aria-hidden="true"></div>

### Tokenisierungsstufe `L3` `reported_j` (`18` `tiktoken`-Workloads, `20,000` Datensätze)

Wenn ein Sprachmodell Text statt strukturierten Speichers verarbeitet, dominiert die Byte-Pair-Tokenisierung (`E_tok(F,k)` in Abschnitt 2) die CPU-Dekodierkosten bei kompakten Formaten:

| Tokenizer & Sicht | Token / `20k` | Wandzeit ms / `20k` (Mittelwert ± SD) | `L3` `nJ / record` (Mittelwert ± SD) | `L3` `nJ / token` | Verhältnis zu CSV (`same tok`) | Verhältnis zu festem Binär-Parsing |
|---|---:|---:|---:|---:|---:|---:|
| `cl100k_base` · CSV (`recs.csv`) | `459,916` | `73.442 ± 20.454` | **`16,384.84 ± 4,362.40`** | `712.51` | `1.000×` | `58.44×` |
| `cl100k_base` · Markdown-Tabelle | `569,973` | `105.364 ± 18.819` | **`23,385.73 ± 5,597.57`** | `820.59` | `1.427×` | `83.41×` |
| `cl100k_base` · Markdown-Liste | `649,947` | `105.199 ± 11.723` | **`26,749.70 ± 4,445.05`** | `823.13` | `1.633×` | `95.41×` |
| `cl100k_base` · JSONL (`recs.jsonl`) | `753,109` | `154.114 ± 43.130` | **`26,983.02 ± 9,347.95`** | `716.58` | `1.647×` | `96.24×` |
| **`cl100k_base` · JSON kompakt (`recs.json`)** | `733,111` | `124.295 ± 7.051` | **`27,679.19 ± 2,697.37`** | `755.12` | **`1.689×`** | **`98.73×`** (`12.51×` `json.loads`) |
| `cl100k_base` · XML (`recs.xml`) | `1,046,596` | `171.844 ± 21.381` | **`36,730.51 ± 6,968.26`** | `701.90` | `2.242×` | `131.01×` |
| `cl100k_base` · TOML (`recs.toml`) | `933,109` | `178.111 ± 23.760` | **`38,499.73 ± 6,633.02`** | `825.19` | `2.350×` | `137.32×` |
| `cl100k_base` · YAML (`recs.yaml`) | `1,029,947` | `208.434 ± 33.837` | **`51,880.14 ± 12,381.40`** | `1,007.43` | `3.166×` | `185.05×` |
| **`cl100k_base` · JSON formatiert (`recs_pretty.json`)** | `1,313,111` | `266.827 ± 21.754` | **`70,590.45 ± 10,239.93`** | `1,075.16` | **`4.308×`** | **`251.78×`** (`26.65×` `json.loads` formatiert) |
| `o200k_base` · CSV (`recs.csv`) | `464,995` | `51.864 ± 5.906` | **`9,570.91 ± 1,012.53`** | `411.66` | `1.000×` | `34.14×` |
| `o200k_base` · JSON kompakt (`recs.json`) | `754,794` | `93.277 ± 8.521` | **`15,125.65 ± 1,287.77`** | `400.79` | `1.580×` | `53.95×` (`6.84×` `json.loads`) |
| `o200k_base` · Markdown-Tabelle / -Liste | `574,818` / `654,792` | `68.091` / `68.666` | **`15,693.90`** / **`17,362.58`** | `546.05` / `530.32` | `1.640×` / `1.814×` | `55.98×` / `61.93×` |
| `o200k_base` · JSONL / XML / TOML | `774.8k` / `1,054.8k` / `934.8k` | `83.02` / `114.79` / `106.68` | **`21,530.58`** / **`22,997.48`** / **`25,307.32`** | `555.78` / `436.05` / `541.45` | `2.250×`-`2.644×` | `76.79×`-`90.27×` |
| `o200k_base` · YAML (`recs.yaml`) | `1,034,792` | `141.338 ± 24.980` | **`29,401.44 ± 7,308.15`** | `568.26` | `3.072×` | `104.87×` |
| `o200k_base` · JSON formatiert (`recs_pretty.json`) | `1,314,794` | `193.648 ± 18.210` | **`37,070.18 ± 3,651.35`** | `563.89` | `3.873×` | `132.22×` |

Drei Befunde ergeben sich aus der Kampagne mit `170` Fenstern:

1. **Tokenisierung von JSON kostet eine Größenordnung mehr CPU `reported_j` als das Parsen**: `tiktoken` (`cl100k_base`, implementiert in kompiliertem Rust) verbraucht `27,679.2 nJ/record` (`0.554 J` pro `20,000` Records, `129,192` Instruktionen/Record) bei kompakter JSON, **`12.51×` Python-`json.loads()` (`2,212.1 nJ/record`)**, **`19.69×` `orjson.loads()` (`1,405.9 nJ/record`)**, und **`98.73×` `struct.iter_unpack` (`280.4 nJ/record`)**. Das Einrücken von JSON (`indent=2`) erhöht die Tokenisierungsenergie von `cl100k_base` um ein weiteres `2.55×` auf `70,590.5 nJ/record` (`4.31×` CSV-Tokenisierung), nur um Whitespace-Sequenzen zu scannen.  

2. **Parse-Energieverhältnisse folgen eng den Instruktionsverhältnissen, mit geringfügigen Variation in der effektiven Wattzahl (`3.28-5.65 W` pro Worker-PID)**: C `libyaml` zieht `3.31 W` effektive Worker-Leistung (`249.4×` binäres `reported_j` vs `329.8×` Echtzeit), während pro-Zeile `jsonl` und pretty-JSON `tiktoken` `5.37-5.46 W` verbrauchen (`21.87×` und `251.78×` `reported_j` vs `16.73×` und `196.37×` Echtzeit), was bestätigt, warum direkte pro-Prozess-`ri_energy_nj`-Zähler gegenüber der Multiplikation der Echtzeit mit einer konstanten Watt-Schätzung vorzuziehen sind.  

3. **Provenienz-Grenze**: `ri_energy_nj` ist ein Betriebssystem/Firmware-Zähler (`reported_j`, Telemetrie-Stufe `L3`), kein externer Hardware-Shunt oder Netzstecker-Leistungsanalysator (`measured_j = None`, `board_metered = false`), und erfasst weiterhin die Host-CPU/Memory-Arbeit vor den Vorwärtsdurchläufen des neuronalen Netzwerks (`e_prefill · T_{F,k}` in M4).

<div id="6-where-a-canonical-machine-form-fits" class="anchor-alias" aria-hidden="true"></div>

## 6. Wo eine kanonische Maschinenform passt

Eine Antwort auf die Steuer besteht darin, eine kanonische Maschinenform für Speicherung und Austausch beizubehalten und menschenlesbaren Text nur dann auszugeben, wenn eine Person ihn zu lesen verlangt. Mehrere Projekte sind diesen Weg für Teilbereiche des Problems gegangen: deterministisches CBOR, kanonisches JSON, schema-gebundene Binärformate. Die Eigenschaften, die eine solche Form benötigen würde, sind testbar: eine gültige Bytefolge pro Wert, eine deklarierte Version, ein geschlossenes Schema, vor der Dekodierung angegebene Grenzen für Größe und Tiefe sowie eine Größenangabe, die das zugehörige Wörterbuch benennt.

<div id="61-an-open-design-question" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Eine offene Gestaltungsfrage

Welche kanonische Austauschform die beste ist, wird hier nicht entschieden. Canonical JSON (RFC 8785) behält eine Textform, benötigt aber Regeln für die Zahlenformatierung und die Schlüsselreihenfolge. Deterministisches CBOR (RFC 8949, Abschnitt 4.2) ist binär (`2,719.6 nJ/record` in Python `cbor2`, `9.70×` fester Binärwert), überlässt aber den einzelnen Protokollen weiterhin Entscheidungen. Eine längenpräfixierte oder binäre Form mit fester Schrittweite (`280.4 nJ/record` in `struct.iter_unpack`, bzw. `0.04 nJ/record` bei einer Zero-Copy-Pufferansicht) entfernt nahezu den gesamten Parsing-Aufwand zwischen Maschinen, während ein Textmodell weiterhin eine projizierte Textansicht benötigt (`16,384.8 nJ/record` für CSV gegenüber `70,590.5 nJ/record` für formatiertes JSON unter `cl100k_base`). Welcher durchgängige Zielkonflikt sich als vorteilhaft erweist, sobald die GPU-Modellvorfüllung (`M4`) und die Feldprojektionsaufgaben (`M7`) einbezogen werden, bleibt offen.

<div id="7-reproduce-this-page" class="anchor-alias" aria-hidden="true"></div>

## 7. Diese Seite reproduzieren

Alles Notwendige befindet sich unter `/living/ai-reads-human/` auf dieser Seite:

- `data/parse_time.tsv`, `data/tokens.tsv`, `data/tokenize_time.tsv`, `data/ENV.txt`, `data/SUMMARY.txt`: die Linux Xeon Zeit- und Token-Grundwerte.
- `data/energy_reported_j.tsv` und `data/energy_reported_j_summary.json`: der 34-Workload, 170-Window Apple M5 Max Dual-Channel `reported_j` (`L3` `ri_energy_nj` + `L2` `IOReport` Falsifier 6) Datensatz (`data/energy_joules.tsv` behält den früheren Oktober 2026 nicht isolierten Whole-Chip-Nulllauf bei).
- `scripts/gen_corpus.py` (gesaiteter Korpus), `bench_parse.py`, `bench_tokens.py`, `bench_tokenize_time.py`, `summarize.py`: die Messungen.
- `scripts/make_charts.py`: erzeugt alle Diagramme aus den Ergebnisdateien neu und prüft die Überschriftenwerte.
- `scripts/verify_numbers.py`: berechnet jede im Text zitierte Zahl neu; beendet mit Nicht-Null-Status bei einer Abweichung.
- `tests-formats/`: die Skripte hinter den Hazard-Test-Zeilen.

```
python3 -m venv --system-site-packages venv
venv/bin/pip install tiktoken tokenizers msgpack cbor2 orjson ruamel.yaml markdown-it-py psutil
venv/bin/python scripts/gen_corpus.py 20000
venv/bin/python scripts/bench_parse.py 9 > results/parse_time.tsv
venv/bin/python scripts/bench_tokens.py 2000 > results/tokens.tsv
venv/bin/python scripts/make_charts.py charts && venv/bin/python scripts/verify_numbers.py
```

Die Tokenizer-Vokabulare für GPT-2, Mistral-7B-v0.1 und Qwen2.5-0.5B werden von einem Modell-Hub durch `bench_tokens.py` heruntergeladen. Die Zeitmessungen und `ri_energy_nj`-Zähler hängen vom Host-Prozessor und Betriebssystem ab; es ist zu erwarten, dass die Größenordnung über mehrere Zehnerpotenzen hinweg für die Formate erhalten bleibt, während sich die absoluten Nanosekunden- und Nanojoule-Werte mit der Hardware verschieben.

<div id="8-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## 8. Bedrohungen der Validität

- Der Kernel-Zähler `ri_energy_nj` (`L3` `reported_j`) ist ein modellgestützter Betriebssystemzähler auf Apple-Silicon-Systemen und kein inline gemessener DC-Schienen- oder AC-Steckdosenzähler (`measured_j = None`, `board_metered = false`). Die GPU-Modell-Joule für Prefill und Decode (`M4`) sind hier noch nicht gemessen.
- Auf gemeinsam genutzten Hosts ist die um den Leerlaufwert bereinigte Nettomessung des gesamten SoC über `IOReport` (`L2`) anfällig für Drift durch Mitnutzer (`109 / 170` Fenster wurden durch Falsifier 6 in Abschnitt 5c ungültig; Nullergebnis in Abschnitt 5b).
- Der Overhead der Python-Objektallokation trägt zu mehreren Parse-Zeilen bei (kompilierte C- und Rust-Parser in `M8` werden den Laufzeit-Overhead begrenzen; zu beachten ist, dass `orjson` und `tiktoken` bereits nativen kompilierten Code ausführen).
- Ein einziges synthetisches, bezeichnerarmes Korpus (`seed = 20261016`); natürlichsprachliche Texte und Telemetrieprotokolle bleiben ungetestet (`M6`).
- Getestet wurden nur offene Tokenizer; geschlossene kommerzielle Tokenizer sind ungetestet.
- Das 23-Byte-Binärlayout hängt von einem gemeinsamen 24-Wort-Wörterbuch ab (`SHA-256` in `data/energy_reported_j_summary.json` festgeschrieben), das die Byte-Angaben pro Datensatz nicht wiederholen.

<div id="9-read-ledger-and-references" class="anchor-alias" aria-hidden="true"></div>

## 9. Ledger lesen und Referenzen

Status pro Quelle befindet sich im [Leseledger](/living/ai-reads-human/READ_LEDGER.md) (FULL, PARTIAL, UNAVAILABLE). Zitierte: RFC 8259, RFC 7493, RFC 8785, RFC 8949, RFC 4180, CommonMark 0.31.2, YAML 1.2.2 (Abschnitt 1.1), TOML 1.0.0, Protocol Buffers encoding guide, OWASP CSV Injection, `tex.web` (nur Header, PARTIAL), Samsi et al. arXiv:2310.03003, Luccioni et al. DOI 10.1145/3630106.3658542. HTML-Quellen wurden als tag-bereinigter Text gelesen, sodass Abbildungen darin nicht gelesen wurden.

**Nicht gelesen (bezahlt oder nicht verfügbar), aufgeführt mit Kennungen und nicht für irgendeine Behauptung zitiert:**

| Eintrag | Kennung |
|---|---|
| ISO 32000-1:2008, Portable Document Format | ISO-Katalog (bezahlt) |
| ISO/IEC 29500, Office Open XML | ISO/IEC 29500 (freie Entsprechung ECMA-376 nur teilweise gelesen) |
| ISO/IEC 26300, OpenDocument | ISO/IEC 26300 (freie OASIS ODF 1.3 Teil 1 gelesen) |
| IEEE 754-2019, Floating-Point Arithmetic | DOI 10.1109/IEEESTD.2019.8766229 |
| Sennrich, Haddow, Birch, "Neural Machine Translation of Rare Words with Subword Units" | DOI 10.18653/v1/P16-1162 |
| Der Unicode-Standard und UAX #15 | unicode.org (nicht abgerufen) |
| ECMA-262 (Zahlenserialisierung, referenziert durch RFC 8785) | nicht abgerufen |
| Das TeXbook, gedruckte Ausgabe | ISBN 978-0-201-13447-6 |
| Horowitz, "Computing's energy problem", zugeschriebene Quelle des zitierten 640 pJ pro 32-Bit-DRAM-Lesevorgang | **gelesen; 640 pJ nicht im Papier oder den Plenarfolien gefunden (sie geben 1 bis 2 nJ, und 1.3 bis 2.6 nJ pro 64-Bit-Zugriff); nicht verwendet** |
| Strubell et al. 2019; Patterson et al. 2021 und 2022; Wu et al. 2021 | nur innerhalb der Samsi- und Luccioni-Papers zitiert; nicht gelesen, keine Behauptung gemacht |

<div id="10-what-will-be-added" class="anchor-alias" aria-hidden="true"></div>

## 10. Was hinzugefügt wird

Geplante Erweiterungen, in keiner festen Reihenfolge: GPU-Modell-Prefill- und Decode-Energie pro Token (`M4`) sowie externe Inline-Wall-Meter-Validierung (`measured_j`); kompilierte C/Rust-native Parser (`M8`); ein Korpus aus natürlicher Sprache und strukturierten Protokollen (`M6`); token-spezifische Zählungen pro Aufgabe für Agent-Field-Projection-Workloads (`M7`); weitere Formate aus dem Ledger (PDF 2.0, C2PA, Markdown-Dialekte, LaTeX) mit ihren Gefahren; sowie ein ausgearbeiteter Vergleich kanonischer binärer Projektionen für Modelle.

*© 2026 Open Interface Engineering, Inc. Text, Abbildungen, Daten und Skripte: MIT OR Apache-2.0, nach Wahl.*
