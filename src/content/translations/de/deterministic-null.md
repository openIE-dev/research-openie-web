---
title: "Deterministische Null: Ein vorab registriertes Kontrollexperiment für neuronale und agentische Substrate"
deck: "Eine 64-Bit-Ganzzahl-Fallschleife ohne Modellaufruf (Shape D: striktes N0 und im dev-Betrieb kristallisiertes N1), implementiert in Rust, Go, Python, C++20 und Julia, vor drand-Zufallsrunden der League of Entropy mittels OpenTimestamps-Bitcoin-Kalendernachweisen gesperrt und über 4,030 zurückgehaltene Instanzen sowie 6 Mehrdatei-Repositories hinweg mit führenden Cloud-Sprachmodellen und lokalen Modellen mit offenen Gewichten verglichen. On-Chip-IOReport-Zähler von Apple Silicon und rusage-Kernelzähler werden als reported_j erfasst; ein externes Steckdosen- oder Stromschienen-Joulemessgerät war nicht angeschlossen (board_metered ist false; measured_j ist nicht gesetzt)."
lang: "de"
source: "deterministic-null"
complete: true
---

<div id="deterministic-null-a-pre-registered-control-experiment-for-neural-and-agentic-substrates" class="anchor-alias" aria-hidden="true"></div>

*Revision 7eb0ad5, 22. November 2026. Daten- und Prüfwerte-Übersicht: [/data/#deterministic-null](/data/#deterministic-null). Interaktive lebende Abbildungen: [/living/deterministic-null/](/living/deterministic-null/). Archivarischer LaTeX-Zwilling: [/pdfs/latex/deterministic-null.pdf](/pdfs/latex/deterministic-null.pdf) ([Quelltext](/pdfs/latex/deterministic-null.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Überblick

Empirische Auswertungen agentischer künstlicher Intelligenz vergleichen routinemäßig ein stochastisches Sprachmodell mit einem anderen und lassen ungemessen, welcher Anteil des Aufgabenabschlusses zum Entscheidungszeitpunkt tatsächlich ein neuronales Substrat erfordert statt einer festen Ganzzahlprozedur über einem expliziten Speicher verifizierter früherer Fälle. Diese Studie konstruiert, friert ein und prüft diese fehlende Kontrollbedingung, die **Deterministische Null (`Shape D`)**, und testet klassenweise die Nullhypothese $H_{0,k}: \Delta_k = p_{\text{model},k} - p_{\text{null},k} \le \delta$ bei einer Marge von $\delta = 0.05$ (`5.0` Prozentpunkten) über zwei kryptographisch vorab registrierte konfirmatorische Experimente (`4,030` zurückgehaltene Post-Beacon-Instanzen insgesamt) sowie eine mehrstufige Studie zur Fehlerbehebung in Software-Repositories (`6` Python-Repositories mit mehreren Dateien). Lokale Energiezähler auf Apple M5 Max (`IOReport` und `proc_pid_rusage`) werden als betriebssystem- bzw. chipseitige `reported_j`-Werte protokolliert; die Energie entfernter Server geschlossener Modelle wird strikt als `not_available` erfasst; kein Hardware-Stromschienen- oder Steckdosen-Leistungsmessgerät war angeschlossen (`board_metered = false`, `measured_j = None`).

**In einfachen Worten**

1. Die meisten Agenten-Benchmarks vergleichen Modell A mit Modell B, ohne zu fragen, wie viel bereits eine Nachschlageschleife ohne Modellaufruf über verifizierten früheren Beispielen löst.
2. Über `2,840` Instanzen aus beschränkten algebraischen, formal-beweisenden und strukturierten Transaktionsfamilien (`exp-001`, Track-A) erreicht eine eingefrorene Ganzzahl-Falltabelle (`0` Modellaufrufe zum Entscheidungszeitpunkt) die Leistung führender Cloud-Modelle in `9` von `10` Klassen-Stufen-Zellen und bleibt nur bei `12` nicht indizierten freitextlichen Kundenformulierungen zurück (`+36.40` Prozentpunkte für `Claude Opus 5.5`).
3. Über `1,190` eindeutige Instanzen aus extern verfassten öffentlichen Benchmarks (`exp-002`, Track-B: Berkeley Function-Calling Leaderboard `v3`, Sierra `tau-bench` Retail, `BigCodeBench v0.1.3` und `SWE` (Software-Engineering)-bench Verified) sowie `6` ungesehene Mehrdatei-Repositories liefert neuronale Synthese überall dort `+52.80` bis `+95.00` Prozentpunkte Zuwachs, wo die Masse ungesehener Schlüssel hoch bleibt; bei eindeutigen dreiwertigen Erfüllbarkeitsformeln (`3-satisfiability`) am Phasenübergang brechen einstufige Sprachmodelle hingegen ein (`0.0%-5.2%`) und liegen sowohl unter der beschränkten Ganzzahltabelle (`69.6%`) als auch unter eigenständigem konfliktgesteuertem Klausellernen mit Klauselbeweisprüfung (`100.0%`), und unter wiederkehrenden Zipf-Strömen senkt Online-Kristallisation Modellaufrufe und Energie um den Faktor `3.59×`, ohne Aufgabenabschluss einzubüßen.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Begriffe, Akronyme und Messkennzeichnungen

<ul id="terms">
<li>AI, ML, LLM, LLMs, MoE, E4B, A3B: künstliche Intelligenz, maschinelles Lernen, große(s) Sprachmodell(e), Mixture-of-Experts, Architektur mit effektiv 4 Milliarden Parametern und aktives Routing mit 3 Milliarden Parametern</li>
<li>OBSERVE, REDUCE, FUZZ, LOOKUP, ACT, VERIFY, MUTATE, WRITE: die acht aufeinanderfolgenden Schritte der Ganzzahl-Entscheidungsschleife der Deterministischen Null</li>
<li>SATB, SUT, SUTs, PFRK, TH2, DOSSIER: Prüfstandsvertrag des Satiation Benchmark, untersuchte(s) System(e), vierwertige Versuchsergebnisse (bestanden, fehlgeschlagen, Ablehnung, abgebrochen), Red-Team-Bedrohung 2 (kein versteckter Solver innerhalb von Aktionsprimitiven) sowie das Stand-der-Technik- und Red-Team-Dossier des Projekts</li>
<li>DNULLMM1, FT, LCB: binäres speicherabgebildetes Speicherindexformat, klassenspezifische Funktionstabelle und untere Hoeffding-Konfidenzschranke</li>
<li>DRAT, RUP, CDCL, CNF, SAT, UNSAT: Deletion Resolution Asymmetric Tautology, Reverse Unit Propagation, Conflict-Driven Clause Learning, konjunktive Normalform, erfüllbar und unerfüllbar</li>
<li>BV, AST, XOR, IEEE, UC: modularer Bitvektor fester Breite, abstrakter Syntaxbaum, bitweises Exklusiv-ODER, Institute of Electrical and Electronics Engineers (Gleitkommanorm IEEE-754) und University of California</li>
<li>BFCL, BCB, SWE, SQL, DB, SAVEPOINT: Berkeley Function-Calling Leaderboard, BigCodeBench, Software-Engineering-Benchmark-Präfix, Structured Query Language, relationale Datenbank und transaktionaler Rücksetzpunkt</li>
<li>API, CLI, MCP, HTTP, JSON, JSONL, UTF: Programmierschnittstelle, Kommandozeilenschnittstelle, Model Context Protocol, Hypertext Transfer Protocol, JavaScript Object Notation, zeilengetrenntes JSON und Unicode Transformation Format</li>
<li>POSIX, MMAP, SHA, OTS: Portable Operating System Interface, speicherabgebildete Datei-Ein-/Ausgabe, Secure Hash Algorithm (SHA-256) und OpenTimestamps-Bitcoin-Kalendernachweis</li>
<li>BCa, CI, CIs, UCL: verzerrungskorrigierter und beschleunigter Bootstrap, Konfidenzintervall(e) und obere Wilson-Konfidenzschranke</li>
<li>CPU, GPU, ANE, SoC, PID, OS, RAM, DRAM, NVMe, PSU, AC: Hauptprozessor, Grafikprozessor, Apple Neural Engine, Ein-Chip-System, Prozesskennung, Betriebssystem, Direktzugriffsspeicher, dynamischer Direktzugriffsspeicher, Non-Volatile Memory Express, Netzteil und Wechselstrom-Netzleistung an der Steckdose</li>
<li>RAPL, NVML, KV, GGUF, RPM, RPD, USD, EDA: Intel Running Average Power Limit, NVIDIA Management Library, Schlüssel-Wert-Cache, quantisierte Gewichte im GPT-Generated Unified Format, Anfragen pro Minute, Anfragen pro Tag, US-Dollar und elektronische Entwurfsautomatisierung</li>
<li>RCE, MoL, WCA, JEPA, LUT6: Reality Code Engine [gleiches Haus], Mixture of Limits (Mischung der Grenzen) [gleiches Haus], Wise Computer Automation [gleiches Haus], Joint-Embedding Predictive Architecture und Boolesche Nachschlagetabelle mit 6 Eingängen</li>
</ul>

Über die Telemetriestufen L0 bis L4 hinweg bleiben vier Messklassen in sämtlichen Tabellen und Abbildungen dieser Studie strikt getrennt:

| Messkennzeichnung | Bedeutung in dieser Studie |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | Bitidentische 64-Bit-Festkomma-Speicherprüfsummen (`SHA-256`), OpenTimestamps-Kalendernachweise (`.ots`), `drand`-Zufallsrunden der League of Entropy, von `satb-proxy` erfasste Token- und Aufrufzahlen sowie datierte API-Listenpreise in Dollar (`USD`). |
| **`Reported (reported_j: L2 & L3 Counters)`** | Root-freie On-Chip-Fenster-Joule auf Apple Silicon über `IOReport` (`macmon`, Telemetriestufe `L2`, Shared-Host-Kennzeichnung `A2`) sowie PID-bezogene macOS-Kernelzähler `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3`, Kennzeichnung `D`). Kein physisches Hardware-Stromschienenmessgerät (`measured_j = None`, `board_metered = false`). |
| **`Not Available (label N)`** | Energie entfernter Server geschlossener APIs (`Claude Opus 5.5`, `Claude Sonnet 5.5`, `Gemini 2.5 Flash`) sowie `L0`-Wechselstromenergie an der Steckdose. Flottenmediane und Literaturmultiplikatoren werden niemals in Belege eingesetzt. |
| **`Invalidated Derived (Falsifier 6)`** | Die Netto-Abzugsrechnung oberhalb der Leerlaufleistung (`derived_marginal_j`) wird automatisch verworfen, sobald konkurrierende Prozesse auf dem gemeinsam genutzten Host eine Leerlauf-Basisdrift vor/nach dem Lauf von `> 5.0%` über die Telemetriestufen L0 bis L4 verursachen; die unverarbeiteten `reported_j`-Zähler bleiben dabei vollständig erhalten. |

<div id="11-lineage-prior-art-boundaries-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Herkunftslinien, Abgrenzung zum Stand der Technik und Offenlegung aus gleichem Haus

Für die Entscheidungsschleife selbst wird keinerlei Neuheit beansprucht. Fallbasierte Zyklen aus Abrufen-Wiederverwenden-Überarbeiten-Bewahren gehen auf Stanfill und Waltz (1986) sowie Aamodt und Plaza (1994) zurück; tabellarisches Stabbalancieren geht auf Michie und Chambers (1968) zurück; unscharfe Regeltabellen gehen auf Mamdani und Assilian (1975) sowie Wang und Mendel (1992) zurück; die Protokollierung von Erfüllbarkeitsbeweisen mittels `RUP/DRAT` geht auf Goldberg und Novikov (2003) sowie Wetzler, Heule und Hunt (2014) zurück. Frühere Arbeiten von Open Interface Engineering ([Gemessene Commit-Tore](/papers/gates/), [Aufgabensättigung versus aggregierter Rebound](/papers/satiation/), [Die Reality Code Engine](/papers/rce/) und [Abwärtskompilierung auf LUT6](/papers/lut-adapt/)) sind `[same house]`-Begleitarbeiten, die zur architektonischen Einordnung zitiert werden, niemals als unabhängige Bestätigung.

Eine Prüfung von 69 Quellen zum Stand der Technik und eine Red-Team-Begutachtung mit 36 Befunden (`docs/DOSSIER.md`) ergaben eine präzise abgegrenzte Lücke in der Agenten-Evaluierungsliteratur der Jahre 2024-2026: Bestehende Agenten-Benchmarks lassen nicht-neuronale Kontrollen fast durchgängig aus, bestehenden nicht-neuronalen Vergleichsverfahren fehlen vorab registrierte Einfrierungen auf zurückgehaltenen Speichern, und bestehende Energiestudien zu Sprachmodell-Agenten führen keinen Kontrollarm ohne Modellaufruf auf demselben Host mit.

<figure class="my-8">
  <img src="/figures/deterministic-null/dnull-control-protocol.svg" alt="Vierstufige Vor-Beacon-Sperre der Deterministischen Null und gepaartes Auswertungsprotokoll." />
  <figcaption>Figure 1. Vor-Beacon-Registrierung (<code>Gate G1</code> + OpenTimestamps + <code>drand</code>) und gepaartes Auswertungsprotokoll über <code>Shape D</code> (<code>N0</code>, <code>N1</code>) und neuronale Substrate (<code>B3</code>, <code>B6</code>, <code>Shape H</code>). Protokollschema, keine Hardware-Stromschienenmessung.</figcaption>
</figure>

---

<div id="2-machine-specification-arms-and-five-language-conformance" class="anchor-alias" aria-hidden="true"></div>

## 2. Maschinenspezifikation, Versuchsarme und Konformität in fünf Sprachen

<div id="21-the-eight-step-integer-loop-and-complexity-caps" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Die achtstufige Ganzzahlschleife und Komplexitätsobergrenzen

Jeder `Shape D`-Nullarm führt eine achtstufige Schleife mit vorzeichenbehafteten 64-Bit-Ganzzahlen aus (Festkommaskalierung `Q = 1,000,000`, null IEEE-754-Gleitkommainstruktionen, null neuronale Aufrufe zum Entscheidungszeitpunkt):

$$\texttt{OBSERVE} \;\to\; \texttt{REDUCE} \;\to\; \texttt{FUZZ} \;\to\; \texttt{LOOKUP} \;\to\; \texttt{ACT} \;\to\; \texttt{VERIFY} \;\to\; \texttt{MUTATE} \;\to\; \texttt{WRITE}.$$

Während des Aufbaus auf `dev` hängt `WRITE` verifizierte Datensätze (`src` gekennzeichnet mit `lit:`, `human:`, `mut:` oder `llm:`) an ein kanonisches `JSONL`-Protokoll an und kompiliert eine kopierfreie binäre Hashtabelle mit offener Adressierung über `POSIX mmap` (`DNULLMM1`: 64-Byte-Header plus 48-Byte-Einträge). Vor der Auswertung auf `test` wird der Speicher anhand seiner `SHA-256`-Prüfsumme schreibgeschützt eingefroren; `VERIFY`, `MUTATE` und `WRITE` führen zur Testzeit null Aktualisierungen durch, und die Byte-Identität der Speicherprüfsummen vor und nach dem Test wird per Assertion erzwungen. Um das Einschleusen eines allgemeinen Solvers in klassenspezifischen Code zu verhindern (`TH2`), ist die Funktionstabelle jeder Klasse (`REDUCE` + `ACT`) auf `<= 4,096` gzip-komprimierte Bytes und `<= 50,000` Elementaroperationen pro Aufruf begrenzt (`S-3`), und kein gelernter natürlichsprachlicher Reduzierer ist zulässig (`S-4`).

<div id="22-operational-permutations-under-comparison" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Verglichene operationale Permutationen

| Arm | Definition | LLM-Aufrufe zur Entscheidungszeit | Konstruktionsherkunft |
| :--- | :--- | :--- | :--- |
| **`B0` (Untergrenze)** | Gibt bedingungslos die Standardaktion der Klasse aus; erzwingt das Testzeit-Empfindlichkeitstor von $> 2\delta$ (`10.0` Prozentpunkte). | `0` | Keine |
| **`B1` (Klassisch)** | Eigenständiger deduktiver Solver ohne Fallspeicher (`CDCL+DRAT`, Spur-Nullraum-Houdini, rationaler Buchberger-Gröbner). | `0` | Klassischer Algorithmus |
| **`B2` (Nur Saatdaten)** | Aus der Literatur gespeister Speicher mit deaktivierter `dev`-Mutation. | `0` | Nur `lit:` |
| **`N0` (Strikte Null)** | Feste Ganzzahlschleife, auf `dev` befüllt ohne modellgenerierte Einträge, Reparaturen oder klassenspezifischen Code (`0` Einträge mit Herkunft `llm:`). | `0` | `lit:`, `human:`, `mut:` |
| **`N1` (Primäre Null)** | Feste Ganzzahlschleife, auf `dev` befüllt unter Zulassung verifizierter Einträge beliebiger Herkunft, wobei sämtliche `dev`-Modellaufrufe $C_{N1}$ belastet werden. | `0` | Beliebig verifiziert (`C_N1` belastet) |
| **`B5` (`code-once`)** | Ein führendes LLM verfasst einmalig eine deterministische Python-Strategie aus `dev`-Spezifikationen; eingefroren bevor `test_seed` existiert. | `0` | `1` `dev`-LLM-Aufruf / Klasse |
| **`B3` (Cloud-Spitzenmodell)** | Instanzweise Auswertung über Cloud-Modelle (`Claude Opus 5.5` primär, `Claude Sonnet 5.5` sekundär, `Gemini 2.5 Flash` Stichprobe). | `>= 1` / Instanz | Vortrainierte Cloud-API |
| **`B6` (Lokal, offene Gewichte)** | Lokale Inferenz auf demselben Host (`Alibaba Qwen 3.6 35B-A3B` und `Google Gemma 4 E4B-it` über `llama-server` auf der Metal-GPU des Apple M5 Max). | `>= 1` / Instanz | Lokales `reported_j` |
| **`Shape H` (Prüfstands-Box)** | Externe CLI `Claude Code 2.1.330` innerhalb von `/work` mit `--strict-mcp-config`, zu 100% über `satb-proxy` geleitet. | Mehrstufig | Prüft `Lane B`-Untergrenze (Falsifikator 8) |

<div id="23-gate-g2-five-language-conformance-and-positive-controls" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Fünf-Sprachen-Konformität nach Gate G2 und Positivkontrollen

Unabhängige Referenzvektoren, erzeugt mittels `/usr/bin/bc` und `openssl`, bestätigen bitgenaue Übereinstimmung über fünf Programmiersprachen hinweg (`Gate G2`), begleitet von drei strikt abgetrennten Positivkontrollen (`ctl.setpoint`: `B0 = 0.110 -> N0 = 1.000`; `ctl.mamdani`: `B0 = 0.525 -> N0 = 1.000`; `ctl.cartpole`: `B0 = 0.000 -> N0 = 0.805`, ausgeschlossen aus sämtlichen Aussagen über Agenten):

| Implementierung | `SHA-256`-Prüfsumme des eingefrorenen Speichers | `1M`-Einträge-Mount `DNULLMM1` | Mittlere Abfragelatenz | Prüfsumme über `10k` Abfragen |
| :--- | :--- | ---: | ---: | ---: |
| **Rust** (Referenz + `SATB`) | `0da4df8d9ccbce1e...4485781` | `44.67 µs` | `582.57 ns` | `15027705736` |
| **C++20** (`clang++ -O3`) | `0da4df8d9ccbce1e...4485781` | `41.58 µs` | `388.43 ns` | `15027705736` |
| **Go `1.25`** | `0da4df8d9ccbce1e...4485781` | `60.63 µs` | `417.05 ns` | `15027705736` |
| **Julia `1.12`** | `0da4df8d9ccbce1e...4485781` | `125.92 µs` | `350.07 ns` | `15027705736` |
| **Python `3.13`** (`mmap`) | `0da4df8d9ccbce1e...4485781` | `8,655.58 µs` | `633.87 ns` | `15027705736` |

---

<div id="3-confirmatory-experiment-1-exp-001-track-a-bounded-template-stratum" class="anchor-alias" aria-hidden="true"></div>

## 3. Konfirmatorisches Experiment 1 (`exp-001`, beschränktes Vorlagen-Stratum Track-A)

<div id="31-pre-beacon-registration-reg-exp-001" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Vor-Beacon-Registrierung (`reg-exp-001`)

Fünf Klassen (`m = 5`: `formal.bv_superopt`, `formal.hoare_inv`, `formal.poly_ideal`, `formal.open_drat_synth` und `tool.tau2_sqlite`) wurden über $J = 5$ Permutationen von `dev`-Episoden befüllt (`966.2 J` `L2` `reported_j` über alle formalen Befüllversuche; `$0.00955` `Opus 5.5` `dev`-Kosten belastet auf `N1` für `tool.tau2_sqlite`). Die Stichprobenumfänge (`n = [420, 250, 250, 250, 250] = 1,420` pro Stufe; `2,840` insgesamt) wurden auf eine Teststärke von `90%` für multiplizitätsbereinigte gepaarte `BCa`-Intervalle auf dem Niveau `99.0%` ($1 - 0.05/5$) mit `10,000` Resamples ausgelegt. Das Manifest `cffb564cd9ad...` und der OpenTimestamps-Nachweis `suite/manifest.json.ots` (`172 B`) wurden unter `git tag reg-exp-001` (`e5007a4`) bei `drand`-Runde `6663731` festgeschrieben, strikt vor der Zielrunde `6663734` (`test_seed_u64 = 5861262844585529273`). Sämtliche `750/750` gezogenen Trajektorien bestanden unabhängige Verifizierer-Prüfungen mittels `DRAT` und `SQLite SAVEPOINT` (`0` Regelumgehungen).

<div id="32-track-a-confirmatory-results-2840-instances" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Konfirmatorische Ergebnisse auf Track-A (`2,840` Instanzen)

| Stufe & Aufgabenklasse | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Qwen36}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | `99.0%` BCa CI | `Qwen` `reported_j`/Erfolg | Befund ($\delta = +0.05$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | ---: | :--- |
| **Stufe 1** `formal.bv_superopt` | `420` | `0.000` | `1.000` | `1.000` | `0.998` | `0.836` | `-0.24 pts` | `[-1.43, +0.00]` | `14.17 J` | **Relevanz ausgeschlossen** |
| **Stufe 1** `formal.hoare_inv` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.508` | `+0.00 pts` | `[+0.00, +0.00]` | `23.32 J` | **Relevanz ausgeschlossen** |
| **Stufe 1** `formal.poly_ideal` | `250` | `0.348` | `1.000` | `1.000` | `0.996` | `1.000` | `-0.40 pts` | `[-2.80, +0.00]` | `7.26 J` | **Relevanz ausgeschlossen** |
| **Stufe 1** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.352` | `+0.00 pts` | `[+0.00, +0.00]` | `69.00 J` | **Relevanz ausgeschlossen** |
| **Stufe 1** `tool.tau2_sqlite` | `250` | `0.188` | `0.624` | `1.000` | `1.000` | `0.940` | `+0.00 pts` | `[+0.00, +0.00]` | `7.11 J` | **Relevanz ausgeschlossen** |
| **Stufe 2** `formal.bv_superopt` (`16b`) | `420` | `0.000` | `1.000` | `1.000` | `0.983` | `1.000` | `-1.67 pts` | `[-3.81, -0.48]` | `7.87 J` | **Relevanz ausgeschlossen** |
| **Stufe 2** `formal.hoare_inv` (`6b`) | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.600` | `+0.00 pts` | `[+0.00, +0.00]` | `16.41 J` | **Relevanz ausgeschlossen** |
| **Stufe 2** `formal.poly_ideal` ($k\in[7,15]$) | `250` | `0.376` | `1.000` | `1.000` | `1.000` | `1.000` | `+0.00 pts` | `[+0.00, +0.00]` | `6.74 J` | **Relevanz ausgeschlossen** |
| **Stufe 2** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.376` | `+0.00 pts` | `[+0.00, +0.00]` | `53.59 J` | **Relevanz ausgeschlossen** |
| **Stufe 2** `tool.tau2_sqlite` (Paraphrase) | `250` | `0.224` | `0.516` | `0.636` | `1.000` | `0.916` | **`+36.40 pts`** | **`[+28.80, +44.80]`** | `7.15 J` | **Relevanz belegt** (`12` unbefüllt) |

**Reichweitenprüfung von Track-A.** Zwar trennte `exp-001` kanonisierte formale Verifikation (`9/9` Zellen ausgeschlossen, Ersparnis von `$27.25` API-Ausgaben bzw. `31,619.9 J` lokalem `reported_j`) sauber von ungesehenen Oberflächenparaphrasen (`+36.40` Punkte auf Stufe 2 `tool.tau2_sqlite`, zu Kosten von `23.38 J` je zusätzlichem Erfolg auf `Qwen 3.6`), doch deckte eine Nachprüfung eine wesentliche strukturelle Grenze auf: Die Generatoren von Track-A schöpften aus Vorlagenfamilien modulo `6` bis modulo `12` ($K_{\text{eff}} = 6\text{-}12$), sodass ein `dev`-Budget von `120` Episoden die Merkmalszellen vollständig sättigen konnte.

---

<div id="4-confirmatory-experiment-2-exp-002-track-b-external-public-benchmarks-keffn" class="anchor-alias" aria-hidden="true"></div>

## 4. Konfirmatorisches Experiment 2 (`exp-002`, externe öffentliche Benchmarks Track-B, $K_{\text{eff}} = n$)

<div id="41-course-corrected-unique-instance-design-and-registration-reg-exp-002" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Kurskorrigiertes Einzelinstanz-Design und Registrierung (`reg-exp-002`)

Um `Shape D` ohne synthetische Vorlagenmenüs zu prüfen, übernahm Track-B (`exp-002`) vier extern verfasste öffentliche Benchmarks (per `SHA-256` fixierte Upstream-Artefakte) zusammen mit strukturell eindeutigen zufälligen `3-SAT`-Instanzen am Phasenübergang (`12` Variablen, `50` Klauseln, Klausel-zu-Variablen-Verhältnis `4.17`), was `1,190` eindeutige zurückgehaltene `test`-Instanzen ergab ($K_{\text{eff}} = n = 1,190$):

1. **`formal.unique_3sat_drat` (`n = 250`)**: Eindeutige `3-CNF`-Formeln mit `12` Variablen und `50` Klauseln; `Shape D` nutzt eine polynomielle einstufige Failed-Literal-Propagation und eine lokale Suche mit `45` Flips (`3,108 B` gzip-komprimierte FT), während ein eigenständiger `CDCL`-Solver mit 2-Watched-Literal-`RUP/DRAT`-Beweisprüfung als klassisches `B1` dient.
2. **`external.bfcl_v3_live` (`n = 250` aus einem Pool von `1,292`)**: UC Berkeley Gorilla Function-Calling Leaderboard `v3` (von Nutzern eingereichte Mehrwerkzeug-Schemata `live_multiple`, verschränkt mit `irrelevance`-Enthaltungsaufgaben; `1,381 B` gzip-komprimierte FT).
3. **`external.tau_bench_retail` (`n = 220` aus einem Pool von `635`)**: Einzelhandelsrichtlinien- und relationale Datenbank-Mutationssuite `tau-bench` von Sierra Research (`500` Nutzer, `1,000` Bestellungen, `50` Produkte; `1,298 B` gzip-komprimierte FT).
4. **`external.bigcodebench_exec` (`n = 220` aus einem lokal verifizierten ausführbaren Pool von `487`)**: Mehrbibliotheks-Python-Programmierspezifikationen aus `BigCodeBench v0.1.3`, bewertet durch isolierte `unittest`-Ausführung (`286 B` gzip-komprimierte FT; `100%` der Pool-Aufgaben offline darauf verifiziert, kanonische Lösungen zu bestehen und `return None` abzuweisen).
5. **`external.swebench_verified` (`n = 250` aus einem Pool von `500`)**: Von Menschen validierte GitHub-Issues aus `princeton-nlp/SWE-bench_Verified`, ausgewertet anhand einer `12`-fach-Fehlerlokalisierung `(file_path :: symbol)` im Repository (`718 B` gzip-komprimierte FT).

Das Manifest `5fe640f00298...` (`355` `Opus 5.5` `dev`-Aufrufe = `$7.1902` belastet auf $C_{N1}$) und der OpenTimestamps-Beleg `suite_exp002/manifest.json.ots` (`207 B`) wurden unter `git tag reg-exp-002` (`d6bfae5`) bei `drand`-Runde `6664086` festgeschrieben, strikt vor der Zielrunde `6664089` (`test_seed_u64 = 9069507899917430179`). Eine einzige mechanische Prüfstandsänderung (`amendment_01_b6_slot_ctx.json`) hob den Gesamtkontext von `llama-server` von `-c 16384` (`4,096` Tokens über `4` Slots, was bei `10k-13.7k` Tokens umfassenden `BFCL`/`tau-bench`-Schemata `HTTP 400` lieferte) auf `-c 81920` (`20,480` Tokens pro Slot) an und ließ sämtliche eingefrorenen Speicher, Prompts, Verifizierer, Stichprobenumfänge sowie die `drand`-Runde `6664089` unverändert. Alle `515/515` gezogenen Trajektorien bestanden die unabhängige Nachprüfung durch den Bewerter (`0` Regelumgehungen).

<div id="42-track-b-multi-vendor-confirmatory-results-1190-unique-instances" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Anbieterübergreifende konfirmatorische Ergebnisse auf Track-B (`1,190` eindeutige Instanzen)

Sämtliche `1,190` Auswertungen von `Shape D` (`N0`, `N1`), `B0` und `B1` (`CDCL+DRAT`) wurden in **`0.9213 s`** abgeschlossen (`35.72 J` `L2` `reported_j`, `0.36 J` `GPU`, `2.58 J` `L3` `ri_energy_nj`, `6.57 × 10^9` Instruktionen, Leerlaufdrift vor/nach dem Lauf `3.09% <= 5.0%`).

| Einzelinstanz-Klasse | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Sonnet}}$ | $p_{\text{Qwen36}}$ | $p_{\text{Gemma4}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | `99.0%` BCa CI | Befund ($\delta = +0.05$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | :--- |
| `formal.unique_3sat_drat` ($p_{B1}=1.000$) | `250` | `0.000` | **`0.696`** | **`0.696`** | `0.052` | `0.008` | `0.000` | `0.000` | **`-64.40 pts`** | `[-72.00, -56.00]` | **Nicht bewertbar** ($p_{\text{LLM}} < 2\delta$) |
| `external.bfcl_v3_live` | `250` | `0.180` | `0.200` | `0.228` | `0.828` | **`0.840`** | `0.804` | `0.720` | **`+60.00 pts`** | `[+51.20, +68.40]` | **Relevanz belegt** (`28` unbefüllt) |
| `external.tau_bench_retail` | `220` | `0.005` | `0.396` | `0.259` | **`0.864`** | `0.805` | `0.755` | `0.623` | **`+60.45 pts`** | `[+51.82, +68.64]` | **Relevanz belegt** (`14` unbefüllt) |
| `external.bigcodebench_exec` | `220` | `0.000` | `0.000` | `0.000` | **`0.950`** | `0.836` | `0.473` | `0.391` | **`+95.00 pts`** | `[+90.00, +97.73]` | **Relevanz belegt** (`218` unbefüllt) |
| `external.swebench_verified` | `250` | `0.096` | **`0.460`** | `0.456` | **`0.984`** | `0.952` | `0.900` | `0.812` | **`+52.80 pts`** | `[+44.40, +60.40]` | **Relevanz belegt** (`4` unbefüllt) |

*(Eine Live-Cloud-Stichprobe mit 15 Aufrufen auf `Google Gemini 2.5 Flash` innerhalb des kostenlosen AI-Studio-Kontingents von `20 RPD` verzeichnete über die fünf Klassen in derselben Reihenfolge `0/3`, `3/3`, `2/3`, `1/3` und `3/3`.)*

Drei empirische Befunde treten in Abschnitt 4.2 deutlich hervor:

1. **Deduktive kombinatorische Klippe (`formal.unique_3sat_drat`)**: Werden Vorlagenmenüs aus der formalen Erfüllbarkeit entfernt (`K_eff = 250` eindeutige `3-CNF`-Formeln am Phasenübergang), versagen einstufige neuronale Modelle nahezu vollständig (`Opus 5.5` `5.2%` bei `$13.55`, `Sonnet 5.5` `0.8%` bei `$8.17`, `Qwen 3.6` `0.0%` bei `7,588 J`, `Gemma 4` `0.0%` bei `4,698 J`), wohingegen die polynomielle Falltabelle ohne Modellaufruf `69.6%` (`174/250`) und eigenständiges klassisches `CDCL+DRAT` (`B1`) **`100.0%` (`250/250`)** löst. Da `Opus 5.5` selbst `B0` nicht um $2\delta = 10.0$ Prozentpunkte übertraf (`95%` `BCa` `[+2.80, +8.40]` Punkte), vergibt die vorab registrierte Entscheidungsregel nicht den Ausschluss der Relevanz (`"Relevance excluded"`), sondern stuft die Zelle strikt als nicht bewertbar (**`Not assessable`**) ein.
2. **Nichttriviale Null-Modell-Basislinien neben echten neuronalen Zuwächsen**: Selbst mit null neuronalen Parametern (`N0`) lösen lexikalische und schemabasierte Fallregeln **`46.0%`** der `12`-fach-Fehlerlokalisierung in `SWE-bench Verified` (gegenüber `9.6%` Untergrenze) und **`39.6%`** der Einzelhandelsrichtlinien-Mutationen in `tau-bench` (gegenüber `0.5%` Untergrenze). Auf `tau-bench` führte die gierige `dev`-Bigramm-Extraktion in `N1` sogar zu einer Überanpassung an verrauschte Kundenformulierungen (`25.9%` gegenüber `39.6%` bei `N0`), was bestätigt, wie wichtig der gemeinsame Ausweis des strikten `N0` neben `N1` ist (`S4`). Gleichwohl erzielen führende Cloud-Modelle wie auch lokale Modelle mit offenen Gewichten über alle vier öffentlichen Benchmarks hinweg große, statistisch eindeutige Zuwächse (`+46.82` bis `+95.00` Prozentpunkte gegenüber sowohl `N0` als auch `N1`).
3. **Zweikanalige `reported_j`-Kosten des lokalen Zuwachses (`B6`)**: Auf dem gemeinsam genutzten Apple-M5-Max-Host (auf dem eine parallel laufende `yosys-abc`-Synthese in `4` von `5` mehrminütigen Messfenstern Falsifikator 6 auslöste und dadurch `derived_marginal_j` sauber invalidierte, während die Rohzähler `L2` `IOReport` und PID-bezogenes `L3` `ri_energy_nj` erhalten blieben) kostete jede durch `Qwen 3.6 35B-A3B` über `N1` hinaus zusätzlich gelöste Aufgabe **`49.90 J`** (`SWE-bench`), **`70.33 J`** (`BFCL v3`), **`238.80 J`** (`BigCodeBench`) und **`407.12 J`** (`tau-bench` Retail) an unverarbeitetem `L2`-`reported_j`.

---

<div id="5-goodturing-unseen-mass-multi-turn-work-repair-and-online-crystallization" class="anchor-alias" aria-hidden="true"></div>

## 5. Ungesehene Good-Turing-Masse, mehrstufige `/work`-Reparatur und Online-Kristallisation

<figure class="my-8">
  <img src="/figures/deterministic-null/s3-good-turing-regimes.svg" alt="Zwei durch die ungesehene Good-Turing-Schlüsselmasse N1(t)/t und Zipf-verteilte Online-Kristallisation getrennte Regime." />
  <figcaption>Figure 2. Die ungesehene Good-Turing-Schlüsselmasse <em>N</em><sub>1</sub>(<em>t</em>) / <em>t</em> sagt voraus, wo ein eingefrorenes <code>Shape D</code> sättigt und wo neuronale Synthese oder Online-Kristallisation erforderlich ist (<code>measured_j = None</code>).</figcaption>
</figure>

<div id="51-goodturing-unseen-mass-n1tt-across-the-five-track-b-streams" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Ungesehene Good-Turing-Masse ($N_1(t)/t$) über die fünf Track-B-Ströme

Entlang jedes `dev + cal`-Aufgabenstroms $t = 1 \dots T$ schätzt der Good-Turing-Singleton-Quotient $N_1(t)/t$ die Wahrscheinlichkeit, dass der nächste eintreffende Schlüssel bisher ungesehen ist:

| Aufgabenklasse (`dev + cal`-Strom) | Stromlänge $T$ | Grobe Zelle $N_1(T)/T$ | Feines Schema/Instanz $N_1(T)/T$ | Zurückgehaltener `N0` / `N1`-Abschluss |
| :--- | ---: | ---: | ---: | ---: |
| `formal.unique_3sat_drat` | `270` | `0.0000` | `1.0000` | `69.6%` / `69.6%` |
| `external.swebench_verified` | `250` | `0.0080` | `0.5960` | `46.0%` / `45.6%` |
| `external.tau_bench_retail` | `285` | `0.0035` | `0.6386` | `39.6%` / `25.9%` |
| `external.bfcl_v3_live` | `300` | `0.0233` | `0.4033` | `20.0%` / `22.8%` |
| `external.bigcodebench_exec` | `240` | **`0.9917`** | **`0.9917`** | **`0.0%` / `0.0%`** |

Selbst nachdem `N1` auf `BigCodeBench` `dev` insgesamt `108` durch Komponententests geprüfte Python-Lösungen von `Claude Opus 5.5` kristallisiert hatte, sagte $N_1(T)/T = 0.9917$ eine nahezu verschwindende Schlüsselüberlappung auf ungesehenen kompositionellen Programmierspezifikationen voraus, in genauer Übereinstimmung mit dem beobachteten Aufgabenabschluss von `0.0%` auf den zurückgehaltenen `test`-Daten (`218` unbefüllte Schlüssel).

<div id="52-multi-turn-work-software-engineering-repair-6-multi-file-repositories" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Mehrstufige `/work`-Software-Reparatur (`6` Mehrdatei-Repositories)

Um sicherzustellen, dass einstufige Prompts in Abschnitt 4 mehrschrittige Programmier-Prüfstände weder benachteiligten noch verzerrten, wurden sechs Python-Fehlerbehebungs-Repositories mit mehreren Funktionen und Dateien (`config-defaults` über `loader.py` + `schema.py`, `interval-merge`, `pagination`, `precedence` über `calc.py` + `lexer.py`, `rate-window` über `window.py` + `limiter.py` sowie `retry-backoff`) in isolierten `/work`-Sandboxes ausgewertet (`max_turns = 10`), wobei `test_*.py` vor der Bewertung mit `pytest -q` jeweils aus unveränderten Upstream-Kopien überschrieben wurde:

| Mehrstufige `/work`-Prüfstandsspur | Bestandene Repos | `SATB` `P/F/R/K` | Modellaufrufe | Werkzeugaufrufe | API `USD` / Lokales `reported_j` |
| :--- | ---: | :---: | ---: | ---: | :--- |
| **`Shape D` Kalt & ungesehen (`t = 1`)** | `0 / 6` (`0.0%`) | `0/6/0/0` | `0` | `0` | `$0.0000` / `< 1 J` |
| **`Lane B` (`Claude Opus 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `28` | `29` | `$0.3613` (`not_available`) |
| **`Lane B` (`Claude Sonnet 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `31` | `34` | `$0.2080` (`not_available`) |
| **`Shape H` (`Claude Code 2.1.330` + `Opus 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `30` | `MCP` | `$0.2646` (`not_available`; Falsifikator 8 bestanden) |
| **`Lane B` Lokal (`Qwen 3.6 35B-A3B`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `42` | `42` | **`2,342.0 J`** `L2` (`390.3 J`/Repo) |
| **`Shape D` Online-Wiedergabe (`t = 2`-Strom)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `0` | `0` | `$0.0000` (Wiedergabe verifizierter Patches) |

<div id="53-online-crystallization-on-recurring-zipfian-traffic-bigcodebench" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Online-Kristallisation bei wiederkehrendem Zipf-Verkehr (`BigCodeBench`)

Auf der sekundären Online-Spur (`600` Anfragen aus einer Zipf-$0.85$-Verteilung über die `220` eindeutigen `BigCodeBench`-Testaufgaben, wobei `Shape D` nur bei einem Fehlgriff auf einen ungesehenen Schlüssel `B3`/`B6` aufruft und Lösungen speichert, die `unittest` bestehen) erreicht der Aufgabenabschluss exakt das Niveau reiner Einzelabfragen an `Opus 5.5` (**`98.0%` gegenüber `98.0%`**), während `155` verifizierte Funktionen im Speicher kristallisieren; dadurch sinken die kumulierten LLM-Aufrufe um **`72.17%` (`167` gegenüber `600`)**, die API-Ausgaben von **`$7.33` auf `$2.04` (`3.59×`)** und der lokale `reported_j`-Verbrauch von `Qwen 3.6` von **`67,729.6 J` auf `18,851.4 J` (`3.59×`)**.

---

<div id="6-limitations-falsifiers-and-unfinished-work" class="anchor-alias" aria-hidden="true"></div>

## 6. Grenzen, Falsifikatoren und offene Arbeiten

1. **Kein physisches Stromschienen- oder Wechselstrom-Steckdosenmessgerät (`board_metered = false`, `measured_j = None`)**: Sämtliche Energieangaben dieser Studie sind chipseitige Apple-Silicon-`IOReport`- (`L2`) und Kernel-`ri_energy_nj`- (`L3`) `reported_j`-Zählerwerte auf einem Host mit parallel laufenden Prozessen; `L0`-Wechselstrommessungen an der Steckdose (`Shelly`/`Yokogawa`, einschließlich Netzteil-, DRAM- und NVMe-Verlusten) auf einer ruhiggestellten Zielmaschine stehen noch aus.
2. **Selbstadministrierte Benchmark-Auswahl gegenüber einer externen menschlichen Stufe 3**: Obwohl Track-B (`exp-002`) synthetische Vorlagen durch vier extern verfasste öffentliche Benchmarks ersetzte, die vor `drand`-Runde `6664089` gesperrt wurden, steht ein versiegelter Stufe-3-Benchmark, der von einer unabhängigen menschlichen Drittpartei verfasst und treuhänderisch verwahrt wird, noch aus.
3. **Nicht-Notwendigkeit bei endlichem Budget**: Jeder Befund belegter Relevanz (`"Relevance shown"`) gilt strikt relativ zur deklarierten `dev`-Stichprobe (`100-150` Instanzen) und der Funktionstabellen-Obergrenze von `4,096 B`; ein unbefüllter Schlüssel belegt eine innerhalb dieses Budgets nicht erreichte Abdeckung, niemals die mathematische Unmöglichkeit eines nicht-neuronalen Verfahrens.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Literatur

<ol data-refs>
<li>Aamodt, A., &amp; Plaza, E. (1994). Case-based reasoning: Foundational issues, methodological variations, and system approaches. <em>AI Communications</em>, 7(1), 39-59.</li>
<li>Efron, B. (1987). Better bootstrap confidence intervals. <em>Journal of the American Statistical Association</em>, 82(397), 171-185.</li>
<li>Goldberg, E., &amp; Novikov, Y. (2003). Verification of proofs of unsatisfiability for CNF formulas. <em>DATE 2003</em>, 886-891.</li>
<li>Good, I. J. (1953). The population frequencies of species and the estimation of population parameters. <em>Biometrika</em>, 40(3-4), 237-264.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., &amp; Narasimhan, K. (2024). SWE-bench: Can language models resolve real-world GitHub issues? <em>ICLR 2024</em>.</li>
<li>Mamdani, E. H., &amp; Assilian, S. (1975). An experiment in linguistic synthesis with a fuzzy logic controller. <em>International Journal of Man-Machine Studies</em>, 7(1), 1-13.</li>
<li>Michie, D., &amp; Chambers, R. A. (1968). BOXES: An experiment in adaptive control. <em>Machine Intelligence</em>, 2, 137-152.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Patil, S. G., Mao, H., Cheng-Jie Ji, C., Yan, F., Suresh, V., Stoica, I., &amp; Gonzalez, J. E. (2024). Gorilla: Large language model connected with massive APIs (Berkeley Function-Calling Leaderboard). <em>NeurIPS 2024</em>.</li>
<li>Simon, H. A., &amp; Kadane, J. B. (1975). Optimal problem-solving search: All-or-none solutions. <em>Artificial Intelligence</em>, 6(3), 235-247.</li>
<li>Stanfill, C., &amp; Waltz, D. (1986). Toward memory-based reasoning. <em>Communications of the ACM</em>, 29(12), 1213-1228.</li>
<li>Wang, L.-X., &amp; Mendel, J. M. (1992). Generating fuzzy rules by learning from examples. <em>IEEE Transactions on Systems, Man, and Cybernetics</em>, 22(6), 1414-1427.</li>
<li>Wetzler, N., Heule, M. J. H., &amp; Hunt, W. A. (2014). DRAT-trim: Efficient checking and trimming using expressive clausal proofs. <em>SAT 2014</em>, 422-429.</li>
<li>Yao, S., Shinn, N., Razavi, P., &amp; Narasimhan, K. (2024). tau-bench: A benchmark for tool-agent-user interaction in real-world domains. <em>arXiv:2406.12045</em>.</li>
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2025). BigCodeBench: Benchmarking code generation with diverse function calls and complex instructions. <em>ICLR 2025</em>.</li>
</ol>
