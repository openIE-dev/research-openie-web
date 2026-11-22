---
title: "Metered Commit Gates: Energie bis zur korrekten Fertigstellung für agentische Systeme"
deck: "Ein Gate, das einem Agenten nur dann zu handeln erlaubt, wenn eine Prüfung bestanden wurde, eine Kaskade, die zunächst die günstigste Methode versucht, sowie die Energiemessungen beider Ansätze, beschriftet nach der jeweiligen Erhebungsmethode."
lang: "de"
source: "gates"
complete: true
---

<div id="notational-intelligence-as-commit-law" class="anchor-alias" aria-hidden="true"></div>
<div id="metered-commit-gates-energy-to-correct-completion-for-agentic-systems" class="anchor-alias" aria-hidden="true"></div>

*Revision db13599, 5. November 2026. Daten und Code: [research.openie.dev/data/](/data/#gates). LaTeX PDF: [/pdfs/latex/gates.pdf](/pdfs/latex/gates.pdf) ([Quelle](/pdfs/latex/gates.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Überblick

Dieses Papier definiert ein Tor, das einer Maschine nur nach Bestehen einer Prüfung Handlungen erlaubt, und eine Regel, die zuerst die billigste Methode versucht. Es berichtet Software‑Ergebnisse und eine energiemessung auf Board‑Ebene, jeweils gekennzeichnet nach ihrer Herkunft.

**In einfachen Worten**

1. Ein Computer darf keine nicht rückgängig zu machende Aktion ausführen, bevor eine einfache Prüfung bestätigt, dass sie sicher ist.
2. Er soll zuerst den günstigsten Weg wählen, um eine Aufgabe zu erledigen, und ein großes KI‑Modell nur einsetzen, wenn nichts Günstigeres funktioniert.
3. Jede Entscheidung wird zusammen mit dem verbrauchten Energieaufwand dokumentiert, sodass jeder sie später prüfen kann.

Dieses Papier besteht aus zwei Teilen, die eine Regel teilen: Korrektheit ist das Tor, und Joule sind die Rangfolge. Teil I ist das Commit‑Tor. Ein Vorschlag darf sich nicht selbst autorisieren. Eine irreversible Handlung wird nur hinter einem Zertifikat ausgeführt, und jede Entscheidung, Commit oder Refuse, wird in einem Beleg festgehalten. Teil II ist Mixture of Limits: Eine Aufgabe benötigt eine minimale erwartete Energie zum Abschluss, und Energie, die nach Abschluss der Aufgabe verbraucht wird, liefert keinen verifizierten Fortschritt. Sein Standardbeispiel ist eine Kaskade, die zuerst das günstigste Zahnrad versucht: Lookup, dann Formula, dann Solver, dann Model. Die Kaskade stoppt, sobald das Abschlussprädikat $C(z)$ erfüllt ist, und verweigert mit einem Beleg, wenn das nächste Zahnrad das Budget überschreiten würde. Unter den Systemen, die die Aufgabe korrekt abschließen, rangiert dasjenige höher, das weniger Joule benötigt.

Eine Board‑Messung verankert das Tor‑Fabric. Auf einem AMD Kria KV260 zeigte der onboard INA260 SOM‑Level‑A/B/A‑Unterschiede von 11 428 pJ pro Tor‑Zyklus (Standardfehler 129 pJ, N = 4) für das WCA‑Tor‑Fabric und 98,0 pJ pro Seed‑Zyklus (Standardfehler 30,8 pJ, N = 4) für das Seed‑Fabric. Der INA260 sitzt an `VCC_SOM`, der das Verarbeitungssystem, die programmierbare Logik, den DDR‑Speicher und die Modul‑Regler versorgt ([KV260 device tree, `ina260@40`](https://gbmc.googlesource.com/linux/+/ccd1cdca5cd433c8a5dff78b69a79b31d9b77ee1/arch/arm64/boot/dts/xilinx/zynqmp-sck-kv-g-revB.dtso)), sodass es sich um Ganz‑Modul‑Unterschiede handelt, nicht um einen Kern‑Rail‑ oder PL‑nur‑Wert (Section I.3.7). Der Seed‑Fabric‑Unterschied in der Tabelle von Section I.4.9 beträgt +0,0098 W (Standardfehler 0,0031 W), also 9,8 mW, dieselben 98,0 pJ pro Seed‑Zyklus bei etwa 100 MHz. Bei der für diesen Vergleich angegebenen 5‑V‑Versorgung entspricht das 1,96 mA, nahe der Stromauflösung von 1,25 mA des Bauteils, und der Unterschied wird als nicht schlüssig gemeldet, bis ein PL‑Rail‑Messgerät und mindestens 10 Durchläufe durchgeführt wurden.

<div id="01-contributions" class="anchor-alias" aria-hidden="true"></div>

### 0.1 Beiträge

1. Ein Commit‑Umschlag: Vorschlag, dann Zertifikat, dann Commit oder Ablehnung, dann Quittung. Das Zertifikat ist konjunktiv: Nachschlagen zulassen UND ein Energieprädikat, optional UND eine Kontrollbarrierefunktion. Ablehnungsgründe sind typisiert. Eine Rust‑Software‑Referenzimplementierung, Wise Computer Automation (WCA), führt es aus (Teil I).  
2. Eine typisierte Provenienz‑Invariante. Die Ausgabe mit dem Label `ModelGenerated` kann niemals zu `Deterministic` befördert werden (Teile I und II).  
3. Eine Kaskade mit benannten Ablehnungen und der Bedingung, unter der die billigste zuerst‑Strategie in erwarteten Joule optimal ist, die sich aus dem Ordnungsresultat von Simon und Kadane für sequentielle Suche ergibt: Versuche Zahnräder in absteigender Reihenfolge von $p_i / c_i$, wobei $p_i$ die Wahrscheinlichkeit ist, dass Zahnrad $i$ die Aufgabe abschließt, und $c_i$ dessen erwartete Energie in Joule (Simon und Kadane, 1975) (Teil II).  
4. Energie zur korrekten Fertigstellung als Rangfolge, definiert in Abschnitt 0.2.  
5. Quittungen als Instrument. Jede Quittung enthält den Vorhersage‑Hash und dessen Zeitstempel vor der Handlung, das Ergebnis, die Übereinstimmung, die Joule pro Stufe (gemessen, gemeldet, geschätzt, nie summiert) und den Ablehnungsgrund.

<div id="02-energy-to-correct-completion" class="anchor-alias" aria-hidden="true"></div>

### 0.2 Energie bis zur korrekten Fertigstellung

Seien $C(z)$ das Prädikat für den Abschluss einer Aufgabe, wobei jede Frist darin eingetragen ist. Für ein System $S$ mit den Richtlinien $\pi$ und einer zulässigen Fehlerrate $\delta$,

$$
J^*(S) = \min_{\pi} \; \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta .
$$

Korrektheit und Fristen sind Nebenbedingungen. Unter den Systemen, die das Tor passieren, ordnen Joule allein sie. Die Ordnung der Systeme nach der reellen Zahl $J^*$ ist eine totale Präordnung, da jede zwei reelle Zahlen vergleichbar sind. Wenn jede Messung einen Messfehler von höchstens $\epsilon$ Joule aufweist, behalten zwei Systeme, deren $J^*$ um mehr als $2\epsilon$ differieren, ihre Reihenfolge. MLPerf Power stellt jedes Energieergebnis hinter ein Genauigkeitsziel. $J^*$ hat dieselbe Form.

<div id="03-how-to-read-this-paper" class="anchor-alias" aria-hidden="true"></div>

### 0.3 Hinweise zur Lektüre dieses Beitrags

Abschnitte in Teil I werden mit I.n nummeriert und Abschnitte in Teil II mit II.n. Jeder Teil hat seine eigene Literaturliste. Zwei Abbildungen vermitteln die Hauptideen: Abbildung 1 (Abschnitt I.1) zeigt das Commit‑Tor, und Abbildung 2 (Abschnitt II.1) zeigt den Boden und das Plateau von Mixture of Limits. Preise und Nachfrage werden hier nicht diskutiert.

<div id="part-i" class="anchor-alias" aria-hidden="true"></div>
<div id="part-i-the-commit-gate" class="anchor-alias" aria-hidden="true"></div>

## Part I. Das Commit-Gate

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="i-abstract" class="anchor-alias" aria-hidden="true"></div>

## I. Zusammenfassung

Agenten schlagen Aktionen vor. Irreversible Arbeit beginnt erst, wenn eine Aktion zur Ausführung freigegeben wird. Dieses Papier behandelt diesen Erlaubnis‑Schritt als formales Objekt. Linus Lees notationale Intelligenz ist die Beobachtung, dass eine Änderung der Symbole einige Gedanken billig und andere ausdrückbar machen kann. Die Behauptung hier ist enger gefasst. Für Maschinen, die Materie bewegen oder ein irreversibles Werkzeug aufrufen können, ist die nützliche Notation ein Laufzeitgesetz: Ein Vorschlag darf sich nicht selbst autorisieren. Die Software‑Referenz, Wise Computer Automation (WCA), zeichnet das Gesetz als vier Objekte unter dem Schema `wca.commit.v1` auf: einen Vorschlag, ein Zertifikat, einen typisierten Ablehnungsgrund und eine Commit‑Entscheidung. Das in der Referenz verwendete Zertifikat ist konjunktiv. Eine Look‑up‑Tabelle (LUT) allow‑Bit muss wahr sein, und ein Energie‑Prädikat muss wahr sein. Eine optionale Kontroll‑Barrier‑Funktion (CBF) kann hinzugefügt werden. Nur‑Lese‑Aufrufe können das Gate umgehen. Irreversible Aufrufe dürfen das nicht.

Energie‑Zahlen in diesem Papier sind Produkte aus Operations‑Zählungen und analytischen Energie‑Konstanten (ein OpCounter‑Modell). Sie sind nicht die Board‑Leistung. Das Verhalten von Field‑Programmable Gate Arrays (FPGA) wird hier in drei Klassen betrachtet. Die Icarus‑Verilog‑Simulation prüft die erzeugte Register‑Transfer‑Logik. Ein Alchitry Pt V2 führt das geschlossene Schleifen‑Gate aus und stimmt bei jeder Entscheidung mit der Software überein. Er hat keinen Zähler, sodass seine Energie nicht gemessen wird. Ein AMD Kria KV260 betreibt das Gate‑Fabric unter seinem integrierten INA260‑Strommonitor. Das Anhalten und Ausführen desselben Bitstreams, abwechselnd A/B/A, liefert einen board‑level gemessenen Unterschied von 11 428 pJ pro Gate‑Zyklus (Standardfehler 129 pJ, N = 4) für acht parallele Auswertungen von LUT‑allow, Energie‑Prädikat und Barrier bei 25 MHz. Das kleinere Seed‑Fabric liefert 98,0 pJ pro Seed‑Zyklus (Standardfehler 30,8 pJ, N = 4). Dies sind `measured_j` auf Board‑Ebene. Sie sind keine Core‑Rail‑Messwerte und nicht die Joule‑Kosten eines geschlossenen Schleifen‑Plants (Abschnitt I.3.7). Stufe B ist als Browser‑Instrument unter https://research.openie.dev/living/fpga-sim/ verfügbar. Es kompiliert dasselbe Rust‑Gate zu WebAssembly (WASM) und zeigt den LUT‑Zustand sowie Commit‑Spuren über die WebGPU‑API. Dieses Instrument ist eine Emulation. Es ist keine Device‑Under‑Test (DUT)‑Messung und nicht die Leistungsaufnahme des Alchitry‑Boards.

Die gemessenen Software‑Ergebnisse sind begrenzt. In einer 16‑Schritte‑Pendulum‑Episode mit Seed 1 commit‑t die Referenz 1 Schritt und verweigert 15. Die analytische Episoden‑Energie beträgt 8,6795e‑10 Joule. Beim gemeldeten Safe‑Fixed‑Point‑Port‑Hamiltonian‑Check sind falsche Erlaubnisse gegenüber dem kontinuierlichen Energie‑Orakel `Vdot <= epsilon` auf den angegebenen Gittern 0, und der Preis beträgt 79 falsche Verweigerungen in 209 261 Entscheidungen (Abschnitt I.4.3). Das ist das Sicherheits‑ und Lebendigkeitspaar für diesen Test‑Satz (Abschnitt I.4.10). Ein Model‑Context‑Protocol (MCP)‑Demo verweigert einen irreversiblen Werkzeug‑Aufruf, ohne den Executor zu aktivieren. Ein Spiel‑Vergleich mit einer Energie‑Set‑Barrier und einem diskreten Schild zeigt Uneinigkeit über Sicherheits‑Definitionen. Keines dieser Ergebnisse ist ein Anspruch auf Führungsposition in Silizium‑Energie, industrielle Steuerungs‑Leistung oder eine Core‑Rail‑Messung.

<div id="notation" class="anchor-alias" aria-hidden="true"></div>
<div id="i-notation" class="anchor-alias" aria-hidden="true"></div>

## I. Notation

Begriffe werden beim ersten wissenschaftlichen Gebrauch unten definiert und hier gesammelt, sodass spätere Abschnitte die Kurzform verwenden können.

| Begriff | Definition in diesem Papier |
|------|--------------------------|
| Notationale Intelligenz | Lee's Behauptung, dass bessere Notationen das, was eine Person oder ein System zuverlässig tun kann, über das bloße Hinzufügen von Werkzeugen hinaus steigern können. |
| Commit-Gate | Eine Laufzeitregel, die entweder eine vorgeschlagene Aktion anwendet oder sie ablehnt. Der Antragsteller erhält keinen zweiten, informellen Kanal. |
| Wise Computer Automation (WCA) | Die Softwarereferenz, die das Commit-Gate an der Grenze zwischen einem Vorschlag und einer unumkehrbaren Wirkung implementiert. |
| Energy-First Architecture (EFA) | Die Designentscheidung, ein Energieprädikat in den Berechtigungsdatensatz einzufügen, nicht nur in einem späteren Bericht. |
| Proposal | Eine Kandidatenaktion `u`, Zustand und optionale analytische Energiehinweise. Sie kann nicht committen. |
| Certificate | Der Gate-Datensatz: LUT‑Erlaubnis, Energieprädikat, optionales CBF‑Prädikat, Gründe und Metriken. |
| Refuse reason | Ein typisierter Code wie `lut_veto`, `energy_veto`, `cbf_veto`, `budget_exceeded` oder `policy`. |
| Commit decision | Der Umschlag, der die Anlagenaktion auf `u` oder auf Null setzt. |
| Look-up table (LUT) | Eine diskrete Abbildung von einem kompakten Code zu Erlauben oder Ablehnen. |
| Ternary look-up matrix multiplier (TLMM) | Der kostengünstige ternäre Tabellen‑Lookup‑Vorschlagsweg der Referenz. |
| Control barrier function (CBF) | Ein Zertifikat der Mengeninvarianz, wenn seine Ungleichung gilt (Ames et al., 2019). |
| Model Context Protocol (MCP) | Ein Tool‑Call‑Transport. In diesem Papier ist es ein Adapter im Test, kein Anlagenzertifikat. |
| System One | Typisierte Entscheidungsverfahren (Laya / Jev‑Klasse), die unter Software bekannte Optionen auswählen. Sie sind Antragsteller. |
| Port-Hamiltonian | Ein strukturiertes Energiemodell, das hier für eine Passivitäts‑Check‑Analyse von Spielzeuganlagen verwendet wird. |
| Runtime verification (RV) | Prüfung einer Eigenschaft auf einer ausführenden Spur. Verwandt, aber nicht identisch mit dem Commit‑Datensatz. |
| Device under test (DUT) | Hardware, gemessen unter einer angegebenen Arbeitslast mit einem angegebenen Messgerät. Die KV260‑Durchläufe von Abschnitt I.3.7 sind die einzigen DUT‑Messungen in diesem Papier. |
| Field-programmable gate array (FPGA) | Rekonfigurierbare Logik. Dieses Papier berichtet Verilog‑Simulation, einen programmierten Alchitry Pt V2 ohne gemessene Energie und board‑level KV260‑Messwerte (Abschnitt I.3.7). |
| WebAssembly (WASM) | Ein portables Kompilierungsziel für den Browser. Der Stage‑B‑WASM‑FPGA‑Emulator wird bereitgestellt unter https://research.openie.dev/living/fpga-sim/. |
| WebGPU | Die Browser‑GPU‑API, die als Anzeige‑ und Gitter‑Evaluationspfad für diesen Emulator benannt wird. |
| Alchitry Pt V2 | Die Herstellerdokumentation identifiziert einen Xilinx Artix‑7 XC7A100T. FPGA programmiert (SRAM‑geladen) mit dem Closed‑Loop‑Commit‑Gate; Energie nicht gemessen (Abschnitt I.3.7). |
| DiffLogic | Differenzierbare Logikgatter‑Netzwerke, trainiert auf boolesche Struktur (Petersen et al., 2022). |
| Analytical energy estimate | `J = sum_op count_op * E_op` mit benannten Konstanten. Nicht die Board‑Leistung. |
| Modeled | Eine Größe, die aus einer angegebenen Formel oder einer angepassten Struktur gewonnen wird. |
| Simulated | Eine Größe, die durch Ausführen der Software oder des Verilog‑Modells erhalten wird. |
| Board-measured | Eine Größe von einem Messgerät an einem angegebenen Gerät und einer Arbeitslast. Nur die KV260‑Messwerte von NI-9 gehören zu dieser Klasse. |
| Oracle-safe | Übereinstimmung mit dem kontinuierlichen Energie‑Oracle `Vdot <= epsilon` am angegebenen System. |
| Check-safe | Der diskrete Safe‑Festkomma‑/ Q16.16‑Rest, der dieses Oracle im Gate annähert. |
| Set-safe | Mengeninvarianz unter einem Barrier‑ oder Schildprädikat (zum Beispiel ein Energie‑Mengen‑CBF), das von oracle-safe abweichen kann. |

<div id="terms-used-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i-terms-used-here" class="anchor-alias" aria-hidden="true"></div>

### I. Verwendete Begriffe

Dieses Papier unterscheidet bereits drei Sicherheitsprädikate. **Oracle-safe** bedeutet das kontinuierliche `Vdot <= epsilon` Oracle. **Check-safe** bedeutet den diskreten Safe Q16.16 Restwert, der dieses Oracle im Gate nachverfolgt. **Set-safe** bedeutet Mengen-Invarianz unter einer Barriere oder einem Schild. NI-4 zeigt, dass check-safe und set-safe voneinander abweichen können. Die Software-Referenz ist die Rust‑Implementierung, die jedes simulierte Ergebnis hier erzeugt. Evidenzklassen sind in der Notationstabelle definiert: modelliert, simuliert, board‑gemessen. Das Seiten‑Flag `board_metered` ist wahr wegen der KV260‑Messungen allein.

**Analytische Konstanten.** `E_LUT_READ = 1e-12` J und die anderen OpCounter‑Konstanten in Abschnitt I.3.4 sind ingenieurtechnische Stellvertreter für relative Vergleiche innerhalb dieses Modells. Sie sind keine kalibrierten Board‑Messungen. Nicht als Silizium‑Joule interpretieren. Die Null‑Falsch‑Erlaubt‑Zählungen gegen das benannte Oracle bleiben wie berichtet.

**Living figures.** Commit‑Stack: [/living/ni/#ni-diag-02](/living/ni/#ni-diag-02). Seed‑1‑Runner: [/living/ni/#ni-run-01](/living/ni/#ni-run-01). Safe false‑allow=0: [/living/ni/#ni-run-02](/living/ni/#ni-run-02). Stage‑B‑Simulator: [/living/fpga-sim/](/living/fpga-sim/).

**Umfang von Teil I.** Abschnitt I.2 platziert den Commit‑Datensatz gegenüber Notationsforschung, Informationstheorie, Skalierungsergebnissen, LUT‑Netzwerken, Kontrollzertifikaten und Laufzeit‑Durchsetzung. Abschnitt I.3 definiert die Objekte, die Anlagen, das analytische Energiemodell, das Browser‑Instrument und die Boards. Abschnitt I.4 berichtet nur über Größen, die von der Software‑Referenz, von den Boards oder von einer zitierten externen Quelle erzeugt wurden. Abschnitt I.5 beantwortet Einwände, die in veröffentlichter Form vorliegen. Abschnitt I.6 gibt an, was die Behauptungen falsifizieren würde und was nicht gemessen wurde.

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>
<div id="i1-introduction" class="anchor-alias" aria-hidden="true"></div>

## I.1. Einleitung

Ein Sprachmodell kann Aktionen ranken. Ranking ist keine Erlaubnis. Der Fehlermodus, der für eine Anlage, eine Hülle, eine Zahlung oder einen destruktiven Laborschritt relevant ist, ist ein Commit: Die Aktion wird ausgeführt. Weiche Scores bleiben upstream nützlich. Sie sind am irreversiblen Ast vom falschen Typ, weil eine Wahrscheinlichkeit nicht angibt, welches Prädikat fehlgeschlagen ist, und sie zwingt den Aktuatorbefehl nicht auf Null.

Lee (2022) formuliert eine frühere Behauptung klar. Notation ist keine Verzierung. Eine Notation, die eine Operation ausführbar macht, ändert, welche Fehler niedergeschrieben werden können und welche verborgen bleiben. Iverson (1980) machte denselben Punkt für Array‑Sprachen: Notation ist ein Denkwerkzeug. Engelbart (1962) behandelte Sprache, Artefakte, Methoden und Training als ein System. Kay (1972) und Victor (2013; 2012 talk) argumentierten, dass Darstellungen Konsequenzen nahe der bearbeiteten Idee halten sollten. Matuschak und Nielsen fragten, warum Werkzeuge für das Denken als Produkte stagnieren. Diese Literatur behandelt Kognition und Medien. Sie spezifiziert nicht, dass ein Protokoll existiert, dem eine Maschine gehorchen muss, bevor sie sich bewegt.

Das industrielle Zentrum der jüngsten künstlichen Intelligenz ist Skalierung. Kaplan et al. (2020) und Hoffmann et al. (2022) berichten über Verlustskalierung mit Parametern, Daten und Rechenleistung. Hooker (2021) argumentiert, dass Ideen verbreitet werden, wenn sie zur verfügbaren Hardware und zu den Kernen passen. Diese Ergebnisse beschreiben, wie die Leistungsfähigkeit eines Vorschlagenden mit den dafür aufgewendeten Ressourcen wächst. Sie definieren kein Commit‑Prädikat.

Der Beitrag dieses Papiers ist eine Software‑Referenz für dieses Prädikat, plus ein Bericht darüber, was die Referenz an Spiel‑Anlagen tatsächlich tut. Der Beitrag ist kompositional. Boolesche LUT‑Schilde, Energiezertifikate, ternäre Tabellensuche und Werkzeugtransporte existieren bereits in früheren Arbeiten. Die Referenz verbindet sie zu einer auditierbaren Entscheidung: Vorschlag, dann Zertifikat, dann typisierte Ablehnung oder Commit. Die Behauptung ist das Vorhandensein und Verhalten dieser Referenz, nicht die Priorität.

Drei Mess‑Aussagen begrenzen jede spätere Zahl. Erstens, Joule, die vom OpCounter berechnet werden, sind analytische Schätzungen. Zweitens, Verilog‑Ergebnisse sind Simulationen. Drittens, die einzigen Board‑Joule sind die KV260‑Board‑Level‑Differenzen von Abschnitt I.3.7, abgelegt als `measured_j` mit dem benannten Messgerät. Das Board‑Ergebnis‑Flag ist für diese KV260‑Durchläufe allein wahr. Der Pt V2 bleibt ungemessen. Ein Leser sollte modellierte, simulierte und board‑gemessene Werte anhand der Methodenklausel, die an die Zahl angehängt ist, unterscheiden können.

Abbildung 1 zeigt das Commit‑Tor.

![Flow diagram: propose, then certify against the predicate and certificate, then either commit an act on the world or refuse with no act. Both outcomes write a receipt with a hash, joules and a reason.](/figures/gates/commit-gate.svg)

*Abbildung 1. Das Commit‑Tor. Diagramm von Vorschlag, Zertifizierung, Commit oder Ablehnung und Quittung, wie in Abschnitt I.3 definiert. Eine [PNG copy](/figures/gates/commit-gate.png) ist bereitgestellt.*

<div id="i2-related-work" class="anchor-alias" aria-hidden="true"></div>

## I.2. Verwandte Arbeiten

<div id="21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>
<div id="i21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>

### I.2.1 Notation und Denkwerkzeuge

Lee (2022) argumentiert, dass das Erfinden von Notationen wichtiger sein kann als das Erfinden zusätzlicher automatisierter Werkzeuge, weil eine Notation die Gedanken verändert, die billig sind. Das Interviewprotokoll mit The Gradient stimmt mit diesem Aufsatz überein und stellt kein unabhängiges empirisches Ergebnis dar. Iverson (1980), Turing‑Award‑Vortrag, ist die klassische Aussage der Informatik: Notation ist ein Denkwerkzeug, und Ausführbarkeit ist Teil des Tests. Engelbart (1962) verortet Intelligenz in einem Mensch‑plus‑Artefakt‑System, nicht in einem bloßen Gehirn. Kay (1972) spezifiziert ein persönliches dynamisches Medium. Victors „Media for Thinking the Unthinkable“ und „Inventing on Principle“ argumentieren, dass Schöpfer Repräsentationen benötigen, deren Konsequenzen sichtbar sind, während die Idee noch geformt wird. Matuschak und Nielsen, „How can we develop transformative tools for thought?“, dokumentieren Adoption und institutionelle Fehlermodi solcher Werkzeuge.

Dieses Papier nutzt diese Linie für eine begrenzte Schlussfolgerung. Wenn eine Notation ausführbar ist, werden einige Fehler zu gewöhnlichen Daten statt zu nicht repräsentierten Unfällen. Ein typisierter Ablehnungsgrund ist ein Beispiel. Es unterstützt nicht die starke Sapir‑Whorf‑Behauptung, dass Sprache Denken bestimmt. Die starke Behauptung wird in Abschnitt I.5 verworfen. Die schwache Behauptung, die Iversons ist, lautet, dass eine ausführbare Notation die Kosten von Operationen und die Darstellbarkeit von Fehlern ändert.

Chollet (2019) definiert Intelligenz als Effizienz beim Erwerb von Fähigkeiten und verankert die Definition in der algorithmischen Informationstheorie. Diese Definition bezieht sich auf das Erlernen neuer Fähigkeiten, nicht auf das Commit.

<div id="22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>
<div id="i22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### I.2.2 Information, Beschreibungslänge und physikalische Kosten

Shannon (1948) definiert Entropie und Kanal­kapazität. Shannon (1959) definiert Rate‑Distortion: wie viel Beschreibung für eine vorgegebene Treue erforderlich ist. Kolmogorov (1965) definiert Beschreibungs­länge durch Programmgröße. Solomonoff (1964) definiert induktives Schließen durch eine Mischung über Programme. Chaitin (1977) entwickelt Programmgrößen‑Komplexität. Cover und Thomas (2006) bilden das Lehrbuchgerüst. Jaynes (1957) verwendet maximale Entropie als Regel für Verteilungen unter Nebenbedingungen. Brillouin (1956) verbindet Information mit physikalischer Negentropie in der Maxwell‑Dämon‑Linie.

Cross‑Entropy‑Training eines Sprachmodells ist ein informationstheoretisches Ziel auf einer Daten­verteilung. Sutskevers Simons‑Institute‑Vortrag 2023, der ein Vortrag und kein Papier ist, diskutiert unbeaufsichtigtes Lernen als Kompression. Diese Tatsache liefert kein Kolmogorov‑Zertifikat für eine bestimmte Zeichenkette und erzeugt keinen Commit‑Bit. Statistische Kompression einer Trainings­verteilung ist nicht dasselbe Objekt wie eine Laufzeit‑Erlaubnis‑Menge unter einer Anlagen‑Beschränkung.

Landauer (1961) beweist eine Untergrenze: logisch irreversible Löschung dissipiert mindestens `kT ln 2` pro Bit im idealen Modell. Bennett (1973) zeigt, dass logisch reversible Berechnung diesen Lösch‑Kosten im Grenzfall entgehen kann. Horowitz (2014) berichtet über praktische CMOS‑Energie im Picojoule‑Bereich für Operationen und Speicher­bewegungen, weit über der Landauer‑Grenze, und behandelt Energie statt Transistor‑Anzahl als Beschränkung. Mead (1990) liefert das neuromorphe Argument für analoge Effizienz. Sandberg (2016) warnt, dass eine Gehirnleistung nahe 20 W die Energie eines von Grund auf trainierten technischen Systems nicht begrenzt. Ein prä‑Print zur kortikalen Partitionierung (arXiv:2102.06273) warnt weiter davor, die gesamte biologische Leistung als vergleichbare Rechenleistung zu behandeln. Dieses Papier verwendet Landauer und Horowitz als Grenzen und Praxis‑Tabellen. Es behauptet nicht, dass irgendein Modell in der Referenz nahe `kT ln 2` arbeitet.

<div id="23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-and-hardware-fit" class="anchor-alias" aria-hidden="true"></div>

### I.2.3 Skalierung und Hardware-Eignung

Hestness et al. (2017), Kaplan et al. (2020) und Hoffmann et al. (2022) dokumentieren die empirische Skalierung des Deep‑Learning‑Verlustes. Amodei und Hernandez (2018), ein OpenAI‑Blog‑Beitrag, beschreiben das rasche Wachstum des Trainingsrechenaufwands für wegweisende Ergebnisse. Die Seite ist ein Hersteller‑Essay. Dieses Papier hängt nicht von einer spezifischen Verdopplungszeit daraus ab. Sutton (2019) argumentiert, dass allgemeine Methoden, die Berechnung nutzen, Systeme übertroffen haben, die den Inhalt menschlichen Wissens als feste Merkmale kodieren. Der Aufsatz ist kein Argument gegen jede Einschränkung. Ein Commit‑Prädikat ist eine Einschränkung der Handlung, kein handgefertigtes Schachmerkmal. Hooker (2021) erklärt, warum Alternativen verlieren, wenn die installierte Basis von Chips und Bibliotheken dichte Matrixmultiplikation belohnt.

Dieses Papier ordnet nach Joule zur Korrektur der Fertigstellung und trennt die Vorschlagskosten von der Erlaubnis. Ein Preis ist in keinem der beiden Begriffe enthalten.

<div id="24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>
<div id="i24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>

### I.2.4 LUT-Netzwerke, ternäre Nachschlagetabellen und differenzierbare Logik

Umuroglu et al. (2020) ordnen spärliche Low‑Bit‑Netzwerke FPGA‑Wahrheitstabellen (LogicNets) zu. Petersen et al. (2022) trainieren Netzwerke aus Logikgattern mit differenzierbaren Relaxationen (DiffLogic). Bacellar et al. (2024) trainieren gewichtlose Netzwerke von LUTs (differenzierbare gewichtlose neuronale Netze). Ma et al. (2024) untersuchen ternäre Gewichtssprache‑Modelle (BitNet b1.58). Wei et al. (2024) implementieren Low‑Bit‑Matrixmultiplikation durch Tabellensuche auf CPUs (T-MAC). Die TeLLMe‑Reihe (arXiv:2504.16266) ist ein ternäres LUT‑Matrix‑Multiplikationsdesign, das auf FPGA‑Ausführung abzielt. Diese Systeme zeigen, dass Tabellen und Gatter ein echtes Rechen‑Substrat darstellen. Sie fügen in den zitierten Arbeiten keinen port‑Hamiltonian‑Energie‑Veto und keinen typisierten Commit‑Umschlag zu einem Tool‑Executor hinzu.

Die Referenz verwendet DiffLogic als dünne Erlaubnistabelle für Spiel‑Features und TLMM als Vorschlagspfad. Das ist eine andere Aufgabe, als ein Logiknetzwerk als gesamten Klassifikator zu nutzen, was die übliche DiffLogic‑Evaluation (Visions‑Benchmarks, große Gatterzahlen) darstellt. Abschnitt I.6 dokumentiert die Kapazitätslücke.

<div id="25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>
<div id="i25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>

### I.2.5 Zertifikate, Schutzschichten und Laufzeitüberwachung

Ames et al. (2019) untersuchen Kontroll-Barriere-Funktionen als Zertifikate für Mengen-Invarianz, die typischerweise durch einen Filter oder ein quadratisches Programm erzwungen werden. Alshiekh et al. (2018 preprint arXiv:1708.08611) führen Schilde ein, die unsichere Aktionen durch sichere ersetzen, minimal wenn möglich. Dawson, Gao und Fan (2022) geben einen Überblick über gelernte Lyapunov‑ und Barriere‑Zertifikate und die Fehlermodi, die entstehen, wenn ein neuronales Netzwerk ohne Prüfung als Zertifikat behandelt wird. Manek und Kolter (2020) lernen stabile Dynamiken mit einer Lyapunov‑Struktur. Greydanus, Dzamba und Yosinski (2019) lernen Hamilton‑Neuronale Netze. Roth et al. (2025) untersuchen stabile port‑Hamilton‑Neuronale Netze. Yu, Zikelic und Henzinger (2024) reparieren neuronale Zertifikate mittels Laufzeit‑Monitore. Leung und Paré (arXiv:2512.24493) geben bayessche Sicherheitsgarantien für port‑Hamilton‑Systeme mit gelernten Energie‑Funktionen. Ihre Energie ist die physikalische Hamiltonfunktion der Anlage. Es ist nicht die Energie der Berechnung. Der sichere Pfad dieser Referenz verwendet Energie im selben physischen Sinn. Die Joule der Berechnung sind ein separater Posten (Abschnitt I.3.4). Sanchez et al. (2018) geben einen Überblick über Taxonomien der Laufzeit‑Verifikation.

**Das Tor ist ein Simplex.** Sha's Simplex‑Architektur betreibt einen nicht verifizierten Hochleistungs‑Regler neben einem verifizierten Sicherheits‑Regler, und ein Entscheidungsmodul übergibt die Kontrolle an den Sicherheits‑Regler, bevor die Anlage den Bereich verlässt, aus dem sie sich erholen kann (Sha 2001). „Ein Vorschlag darf sich nicht selbst autorisieren“ ist diese Regel, übertragen von Regelkreisen auf Werkzeugaufrufe und Aktuatoren. Laufzeit‑Garantie ist ihr Name in der Avionik und Robotik. Drei ältere Ergebnisse vervollständigen den Rest der Form. Saltzer und Schroeder nannten vollständige Mediation: jeder Zugriff wird jedes Mal gegen die Autorität geprüft (1975). Ein Referenzmonitor ist der Mechanismus, der die Prüfung durchführt. Grays Zwei‑Phasen‑Commit trennt Vorbereitung von Abschluss, sodass kein Teilnehmer allein abschließt (1978). Neculas proof‑carrying code liefert einen Beweis, den der Host prüft, bevor nicht vertrauenswürdiger Code ausgeführt wird (1997). Der Commit‑Datensatz hier ist ein Referenzmonitor vor irreversiblen Effekten, mit einem Simplex‑Schalter zur Ablehnung und einem Zertifikat, das der Host prüft, wie bei proof‑carrying code. Was die Referenz zu dieser Linie hinzufügt, ist ein Konjunkt und ein Ledger: ein Energie‑Prädikat innerhalb des Zertifikats und Joule im selben Datensatz wie die Entscheidung.

Die Referenz ersetzt diese Mathematik nicht. Der sichere Pfad ist ein konservativer Fixpunkt‑Test einer bekannten Energie‑Identität für ein Pendel, `V = (1/2)(g theta^2 + omega^2)` mit `Vdot = omega * u`. Die im Spielzeug‑Vergleich verwendete CBF ist eine Energie‑Mengen‑Ungleichung für dieselbe `V`, nicht der Anspruch, das Ames‑quadratische Programm für einen Manipulator gelöst zu haben. Gelernte Lyapunov‑Struktur für ein Wagen‑Polesystem ist ein zweites Spielzeug, berichtet in Abschnitt I.4, und ist kein Attraktions‑Theorem für beliebige Anlagen.

<div id="26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>
<div id="i26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>

### I.2.6 Weltmodelle, typisierte Entscheidungen und Werkzeugtransport

Ha und Schmidhuber (2018) und Hafner et al. (DreamerV3, arXiv:2301.04104) zeigen, dass gelernte Modelle Aktionen aus vorgestellten Trajektorien vorschlagen können. LeCuns JEPA‑Essays (Meta‑Research‑Blog) argumentieren für prädiktive Weltmodelle. LeCun et al. (2006) ist das frühere Tutorial zum energie‑basierten Lernen. Der Vorhersagefehler ist in diesen Systemen nicht identisch null. Ein Prädiktor kann stromaufwärts eines Gates sitzen. Er kann das Gate nicht ersetzen, es sei denn, seine Vorhersagen sind perfekt und das Pflanzenmodell ist die Pflanze. Dieses Papier konkurriert nicht mit jenen Systemen auf Vorhersage‑Benchmarks.

System‑One‑Modelle geben eine typisierte Antwort und eine Wahrscheinlichkeit für jede zulässige Option in einem Vorwärtsdurchlauf zurück, ohne Freitext. TypeSafe AI benannte die Kategorie mit seinem gehosteten Jev‑Modell (15. September 2026). Open‑Modelle folgten, darunter Laya von Convai Innovations, ein Encoder mit Entscheidungs‑Heads. Sie reduzieren die Generierungskosten, wenn die Optionsmenge typisiert und bekannt ist. Anthropics Model‑Context‑Protocol‑Ankündigung spezifiziert Entdeckung und Transport für Werkzeuge. Transport liefert einen Aufruf. Er bewertet `Vdot` nicht. Im MCP‑Adapter der Referenz benötigen irreversible Werkzeuge ein Zertifikat, bevor der Executor läuft. Das ist eine ingenieurtechnische Behauptung über diesen Adapter, getestet durch die Demo in Abschnitt I.4, nicht eine Behauptung über jeden MCP‑Server in Produktion.

<div id="27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>
<div id="i27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>

### I.2.7 Was die Komposition hinzufügt

Schilde verweigern unsichere Aktionen, werden jedoch in den zitierten Arbeiten nicht als das vierfeldige Commit‑Datensatz des Referenzdokuments mit einer analytischen Joule‑Bilanz exportiert. DiffLogic‑ und LUT‑Netzwerke berechnen Funktionen. Sie stellen in jenen Arbeiten keinen Vetoeinwand vor einem separaten Vorschlagenden und einem Werkzeugausführer dar. Energie‑bewusste Barrier‑Filter sind kontinuierlich. Das „allow“-Bit des Referenzdokuments ist eine Tabelle. Der kompositionale Anspruch ist die Verdrahtung: LUT‑allow und Energieprädikat sowie optionales Barrier, aufgezeichnet mit einem typisierten Grund, angewendet vor einer irreversiblen Wirkung, wobei analytische Energie von der Platinenleistung getrennt bleibt. Abschnitt I.4 gibt an, welche Teile dieser Verdrahtung ausgeführt wurden.

<div id="28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-2025-to-2026" class="anchor-alias" aria-hidden="true"></div>

### I.2.8 Zertifizierungs- und Commit-Peers (2025 bis 2026)

Mehrere aktuelle Systeme erzwingen eine Entscheidung, bevor ein irreversibles Werkzeug ausgeführt wird.

Shi et al., **Progent** (arXiv:[2504.11703](https://arxiv.org/abs/2504.11703)), prüfen jeden Werkzeugaufruf gegen symbolische Least‑Privilege‑Regeln und verwenden einen SMT‑Solver, sodass Privilegien nur ohne Genehmigung eingeschränkt werden können (monotone Eindämmung). Chen, Kang und Li, **ShieldAgent** (ICML 2025; [proceedings.mlr.press/v267/chen25ae.html](https://proceedings.mlr.press/v267/chen25ae.html)), setzen verifizierbare Sicherheits‑Policy‑Schaltungen über Aktions­trajektorien des Agenten durch, bevor sie abschirmen. Yu, Žikelić und Henzinger (AAAI 2025; [doi:10.1609/aaai.v39i25.34840](https://doi.org/10.1609/aaai.v39i25.34840)) reparieren neuronale Zertifikate mittels Laufzeit‑Monitoring. Eine begleitende Linie verifiziert ReLU‑Kontroll‑Barrier‑Zertifikate online über eine Look‑Ahead‑Region (arXiv:[2507.11987](https://arxiv.org/abs/2507.11987)).

**What Part I adds.** Diese Kollegen sind Policy‑, Shield‑ oder Zertifikats‑Reparatur‑Objekte. Diese Referenz liefert einen Vier‑Feld‑Commit‑Umschlag (`proposal` → `certificate` → `commit|refuse` → receipt) mit einem konjunktiven LUT‑Allow‑Bit und einem Energie‑Prädikat, typisierten Ablehnungsgründen und analytischen Joule, die von der Board‑Leistung getrennt bleiben. Der Transport (MCP) bleibt Vorschlag. Board‑Joule existieren nur für die KV260‑Durchläufe in Abschnitt I.3.7, auf Board‑Ebene.

<div id="i29-runtime-enforcement" class="anchor-alias" aria-hidden="true"></div>

### I.2.9 Laufzeitdurchsetzung

Das Tor ist ein Sicherheitsautomat. Schneider zeigte, dass Ausführungsmonitore genau die Sicherheits­eigenschaften [Schneider 2000](https://doi.org/10.1145/353323.353382) durchsetzen, und Ligatti, Bauer und Walker erweiterten den Monitor zu Edit‑Automaten, die Aktionen unterdrücken oder einfügen [Ligatti et al. 2005](https://doi.org/10.1007/s10207-004-0046-8). Falcone stellte dar, wann durchgesetzt statt verifiziert werden soll [Falcone 2010](https://doi.org/10.1007/978-3-642-16612-9_9), und Bauer, Leucker und Schallhart lieferten Laufzeit‑Urteile mit drei Werten [Bauer et al. 2011](https://doi.org/10.1145/2000799.2000800), die auf erlauben, ablehnen und `settle_refuse` abbilden. Was dieser Beitrag zu dieser Reihe hinzufügt, ist das Energie‑Prädikat im Zertifikat und die Quittung. Agent‑Guards von 2024 bis 2026 haben dieselbe Form, eine Prüfung zwischen einem vorgeschlagenen Werkzeugaufruf und seiner Wirkung: GuardAgent [arXiv:2406.09187](https://arxiv.org/abs/2406.09187) und AgentSpec [arXiv:2503.18666](https://arxiv.org/abs/2503.18666). PolicyGuide argumentiert, dass eine Prüfung jeder Aktion einen mehrstufigen Arbeitsablauf nicht steuern kann [arXiv:2608.19861](https://arxiv.org/abs/2608.19861); deshalb setzt Teil II den Stopp beim Aufgaben‑Prädikat $C(z)$ statt beim einzelnen Akt. Mehrstufige irreversible Arbeit benötigt ebenfalls Kompensation, die Sagas bereitstellen [Garcia-Molina and Salem 1987](https://doi.org/10.1145/38713.38742), und „ein Vorschlag darf sich nicht selbst autorisieren“ ist das Referenz‑Monitor‑Prinzip, das Fähigkeits‑Kerne wie seL4 durch Beweis durchsetzen [Klein et al. 2009](https://doi.org/10.1145/1629575.1629596). Der 0‑false‑allow‑Scan von Abschnitt I.4 ist ein Test über ein Gitter, kein Beweis; Abschnitt I.6 gibt diese Grenze an, und sie gilt für jede Zusammenfassung des Ergebnisses.

<div id="i210-reference-points-for-the-board-figure" class="anchor-alias" aria-hidden="true"></div>

### I.2.10 Referenzpunkte für die Board-Abbildung

Eine FPGA-Implementierung einer Funktion wird voraussichtlich mehr Energie verbrauchen als ein ASIC; Kuon und Rose haben die dynamische Leistungsdifferenz gemessen [Kuon and Rose 2007](https://doi.org/10.1109/TCAD.2006.884574), und Horowitz gibt die CMOS‑Energie pro Operation an, die solche Werte einrahmt [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323). Eine Anbieter‑Leitungsschätzung für denselben Bitstream neben der SOM‑Auslesung ist Teil des PL‑rail‑Protokolls.

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>
<div id="i3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## I.3. Definitionen und Methoden

<div id="31-objects" class="anchor-alias" aria-hidden="true"></div>
<div id="i31-objects" class="anchor-alias" aria-hidden="true"></div>

### I.3.1 Objekte

Fixiere einen Zustand `x` und eine Kandidatenaktion `u` in einer Menge `U`. Ein Vorschlag ist ein Tupel

```text
Proposal = (u, x, hints)
```

`hints` kann analytische Energiemengen enthalten. Ein Vorschlag hat keine Interpretation als Erlaubnis.

Ein Zertifikat ist ein Tupel

```text
Certificate = (lut_allow, energy_ok, cbf_ok, reasons, metrics)
```

`lut_allow` und `energy_ok` sind Booleans. `cbf_ok` ist ein Boolean, wenn der ausgewählte Compose‑Modus ihn erfordert, und fehlt sonst. `reasons` ist eine Liste von Ablehnungsgründen. `metrics` enthält die analytische Energiebilanz und das Board‑Result‑Flag.

Compose‑Modi im Schema‑README sind:

```text
lut_and_energy        : commit <=> lut_allow AND energy_ok
lut_and_safe          : commit <=> lut_allow AND safe_energy_ok
lut_and_safe_and_cbf  : commit <=> lut_allow AND safe_energy_ok AND cbf_ok
```

Ablationen `energy_only` und `lut_only` existieren, sodass ein Vergleich einen Konjunkt entfernen kann. Sie sind nicht die Vorgabe für irreversible Werkzeuge.

Eine Commit‑Entscheidung ist

```text
if commit then plant_action = u else plant_action = 0
```

mit dem angehängten Zertifikat. Der Executor für ein irreversibles Werkzeug wird nur im ersten Zweig aufgerufen.

Arbeitsprotokoll. Datei `artifacts/schemas/wca.commit.v1/examples/commit_decision_refuse.json` speichert eine Ablehnung, bei der `lut_allow` wahr und `energy_ok` falsch ist. Der Grundcode ist `energy_veto`. Der Fixed‑Point‑Detail‑String lautet `Vdot_q=1461 > eps_q=13`. `plant_action` ist `[0.0]`. Der Datensatz setzt das Board‑Result‑Flag auf falsch. Ein wahrer Konjunkt führt nicht zum Commit.

<div id="32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>
<div id="i32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>

### I.3.2 Pflanzen und Orakel

Die primäre Anlage ist ein Pendel. Kontinuierliche Referenzgrößen, die vom Safe‑Check verwendet werden, sind `g = 9.81`, `epsilon = 0.05`, `V = (1/2)(g theta^2 + omega^2)` und `Vdot = omega * u`. `energy_ok` im kontinuierlichen Orakel bedeutet `Vdot <= epsilon`.

Der legacy diskrete Check ist eine Q8.8‑Festkomma‑Annäherung, bit‑genau abgestimmt auf das Verilog‑Modul `wca_ph_energy.v` in der Simulation. Der Safe‑Check (`SafeFixedPointPHCertificate`) verwendet Q16.16 und einen exakten ganzzahligen Rest. Das gemeldete Prädikat lautet

```text
energy_ok <=> 4*omega_q*u_q + 2*(abs(omega_q)+abs(u_q)) + 1
              <= floor(4*epsilon*S^2)
```

mit dem Rundungsargument, das in `artifacts/RESULTS.md` angegeben ist: Bei Rundung‑zu‑nächster mit einem Fehler von höchstens einem halben Least‑Significant‑Bit ist `Vdot` beschränkt durch `(prod + (1/2) abs + 1/4) / S^2`. Das Designziel ist einseitig. Wenn das Safe‑Prädikat zulässt, erlaubt das kontinuierliche Orakel es. Das Umgekehrte ist nicht erforderlich. Zusätzliche Ablehnungen sind ein gemessener Aufwand, keine Widerspruch zum Sicherheitsprinzip.

Eine zweite Anlage, Cart‑Pole, wird nur in der gelernten‑Lyapunov‑Simulation verwendet. Der Zustand ist `[x, xdot, theta, thetadot]`, mit `g = 9.81`, Wagenmasse 1.0, Stabmasse 0.1, Länge 0.5. `V` ist eine quadratische Form `xi^T P xi / 2` mit `P` positiv definit durch eine Cholesky‑Konstruktion plus ein Vielfaches der Einheitsmatrix. Die Anpassung erfolgt per stochastischem Gradienten auf einer Hinge‑Funktion von `Vdot + alpha V` unter einer linearen Regel, Seed 42, 400 Iterationen, Batch 32, `alpha = 0.15`, wie in `RESULTS.md` dokumentiert. Das kontinuierliche Gate ist `Vdot <= 0.05`. Die Safe‑diskrete Regel fügt einen Lipschitz‑Puffer mal einem halben Least‑Significant‑Bit hinzu. Dies ist eine Simulation einer angepassten quadratischen Form auf einer Box. Es ist kein Beweis für andere Anlagen.

<div id="33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>
<div id="i33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>

### I.3.3 LUT-Erlaubnis und Vorschlagspfad

Der erlaubte LUT in den berichteten Episoden ist ein DiffLogic‑Export mit Maske `21887` für vier Merkmale: absolutes Theta, absolutes Omega, absolutes `u` und ein Energiabit, sofern ein Abschnitt nichts Gegenteiliges angibt. TLMM ist ein gruppierter ternärer Tabellensuchlauf, der als Vorschlaggeber verwendet wird. Iso‑Korrektheit bedeutet Übereinstimmung mit einem naiven ternären Matrixprodukt innerhalb einer absoluten Toleranz von 1e-12, was `RESULTS.md` als in Software gemessen verzeichnet. Das Skalierungsverhalten ist das, was `wca-tlmm-scale` unter einem angegebenen analytischen Vorwärtsbudget schreibt. Das in den Ergebnissen diskutierte Standardbudget beträgt 2e-10 Joule pro Vorwärtsdurchlauf, analytisch, nicht elektrisch.

<div id="34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>
<div id="i34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>

### I.3.4 Analytisches Energiemodell

`RESULTS.md` trennt zwei Fakten. Die Operationszahlen sind exakt im OpCounter. Joule ergeben sich aus den Zahlen multipliziert mit Konstanten:

| Konstante | Wert (Joule) | Rolle |
|----------|----------------|------|
| `E_LUT_READ` | 1e-12 | LUT‑Lesevorgang |
| `E_BRAM_WORD` | 1e-11 | BRAM‑Wort |
| `E_BITMASK_OP` | 5e-14 | Bitmasken‑Operation |
| `E_ADD` | 5e-13 | Addition |
| `E_PACK` | 2e-13 | Packen |
| `E_COMMIT_BASE` | 2e-11 | Commit‑Overhead |
| `E_REFUSE_OVERHEAD` | 5e-12 | Refuse‑Overhead |

`J = sum count_op * E_op`. Diese Konstanten sind ingenieurtechnische Stellvertreter, keine Messwerte. Strukturzähler wie geteilte BRAM‑Hits werden gemeldet und nicht berechnet, sofern sie keinen gezählten Lesevorgang ändern. Das Ändern einer Konstanten skaliert jedes analytische Joule synchron. Deshalb können die Zahlen nicht mit den Token‑pro‑Joule‑Werten eines Anbieters, mit MLPerf Tiny‑Energie oder mit einer Schienenmessung verglichen werden. Sie können jedoch zwischen Modi desselben Modells verglichen werden.

Der Nutzen in den internen Tabellen ist die Commit‑Anzahl. Die Commit‑Anzahl ist keine Aufgabenbelohnung. Eine Richtlinie, die mehr committet, kann einen höheren Nutzen pro Joule erzielen und dabei den Energie‑Orakel verletzen. Abschnitt I.4 behandelt den Nutzen pro Joule daher nicht als Sicherheitsmetrik.

<div id="35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>
<div id="i35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>

### I.3.5 Werkzeugadapter

`wca-mcp-gate` klassifiziert Werkzeuge. Nur-Lese-Werkzeuge können ohne Commit‑Eintrag ausgeführt werden. Unbekannte Werkzeuge werden als irreversibel behandelt. Irreversible Werkzeuge benötigen ein Zertifikat unter dem konfigurierten Compose‑Modus, standardmäßig `lut_and_safe_and_cbf` in `artifacts/mcp_gate_demo.json`. Bei Ablehnung ist `executed` false und `executor_calls` ist 0. Der Demo‑Executor zeichnet Aufrufe auf und führt keine Host‑Ein- oder -Ausgabe aus. Der Methoden‑String in der Demo‑Datei ist `rust_mcp_commit_gate_v1`.

<div id="36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>
<div id="i36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>

### I.3.6 Simulation von Verilog

Das Repository erzeugt Verilog und Speicherabbilder für das allow‑LUT und das commit‑Gate (`artifacts/fpga/`). `wca-rtl-verify` und Icarus Verilog prüfen das bit‑exakte Verhalten dieser Modelle gegenüber dem Software‑Oracle. Icarus führt eine Simulation aus. Es platziert, routet oder misst keinen Chip. Vivado‑Berichte werden nur für die KV260‑Durchläufe von Abschnitt I.3.7 erstellt, als Auslastung und Timing‑Closure. Vivado‑Leistungsabschätzungen sind keine Ergebnisse.

<div id="37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>
<div id="i37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>

### I.3.7 Browser-Instrument und Boards

Der Vollständigkeitspfad für die Replikation hat drei Stufen. Die Stufen A und B existieren. Stufe C hat zwei Boards: eines für Entscheidungsvereinbarung und eines für Joule.

Stufe A, vorhanden. Rust‑Binärdateien in `wca-commit` führen die Episode, die Safe‑Prüfung, die Tool‑Demo und die analytische Joule‑Bilanz aus. Icarus simuliert emittiertes Verilog auf einer Workstation.

Stufe B, ausgeliefert. Der reine Entscheidungskern (Vorschlag ein, Zertifikat aus, Anlagen­schritt, analytisches Joule‑Update) wird zu `wasm32` kompiliert (`crates/wca-fpga-sim`). Eine statische Seite unter https://research.openie.dev/living/fpga-sim/ lädt das Modul. WebGPU hält die LUT‑Wörter und einen Trace‑Puffer von `(step, lut_allow, energy_ok, cbf_ok, decision)` zur Anzeige. WebGPU‑Zeitstempel sind keine Joule. Auf seed-1 (16 Schritte, theta 1.5, omega 3.0) berichtet die WASM‑Episode 1 commit, 15 refused, analytische Joule 8.6795e-10, was mit Stufe A übereinstimmt. Das WASM‑Modul ist eine Emulation derselben Funktionen, die das Rust‑Crate ausführt. Es ist kein taktgenaues Modell eines Artix‑7, kein Schalt‑Aktivitäts‑Power‑Modell und kein Ersatz für Icarus beim Verilog. Stufe B beansprucht keinen Alchitry Pt V2 DUT.

Stufe C, Board programmiert, Energie nicht gemessen. Ein Alchitry Pt V2 wurde erkannt und (SRAM) mit einem Closed‑Loop‑WCA‑Commit‑Gate‑Bitstream geladen: on‑fabric seed-1 Pendel‑Anlagendynamik, TLMM‑Vorschlag, allow LUT, Safe Q16.16 Port‑Hamiltonian‑Residual und Ames‑Style‑Energy‑Set‑Control‑Barrier‑Function (CBF)‑Residual. Fabric‑Commit ist `lut_allow ∧ energy_ok ∧ cbf_ok`. UART bei 115200 8N1 stimmte mit dem Software‑Composite‑Golden bei allow/refuse/commit überein (1 commit, 15 refuses, einziger commit bei Schritt 6). In dieser seed-1 Closed‑Loop‑Episode änderte das CBF‑Konjunkt nicht die allow/refuse‑Spur gegenüber LUT und Safe PH allein (der einzige PH‑Commit hat u=0, sodass die CBF‑Lie‑Prüfung gilt). **Closed‑loop** bedeutet hier, dass der Anlagen­zustand aus Gate‑Commits und Refusals auf dem Fabric entsteht; es ist kein gestreamter Stimulus‑ROM von Anlagen‑/Vorschlags­zustand. Der Pt V2 hat **kein eingebautes Joule‑Messgerät**. Kein USB‑Inline‑Meter oder Shunt war angeschlossen. Vivado‑/post‑PAR‑Power‑Schätzungen sind keine DUT‑Messwerte. Die Produktseite von SparkFun nennt FPGA XC7A100T-2FGG84I und listet 101.440 Logikzellen, 240 DSP48E1‑Slices, 4.860 Kb Block‑RAM und 256 MB DDR3L auf (https://www.sparkfun.com/alchitry-pt-v2.html); diese bleiben Herstellerspezifikationen. Builder‑Messmethoden: [/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy).

Stage C, board gemessen. Ein AMD Kria KV260 trägt einen integrierten INA260 Strom‑ und Spannungsmonitor (`ina260_u14`). Drei Durchläufe wurden am 30. September 2026 durchgeführt, jeweils als interleaved A/B/A‑Pässe mit N = 4, Settle‑Zeit 15 s und Sampling‑Zeit 25 s bei etwa 4 Hz. Durchlauf 1 vergleicht ein frei laufendes Seed‑Fabric (439 LUTs) mit dem Basis‑Bitstream der Platine. Er liefert nur Watt, ohne Operations‑Zähler, sodass keine Joule pro Operation angegeben werden können. Durchlauf 2 hält an und führt einen Seed‑Bitstream (975 LUTs) bei etwa 100 MHz unter einem geräteinternen Operations‑Zähler aus. Der Unterschied beträgt +0,0098 W (Standardfehler 0,0031 W), was 98,0 pJ pro Seed‑Zyklus entspricht (Standardfehler 30,8 pJ). Durchlauf 3 hält an und führt den Gate‑Bitstream aus: acht Spuren, jeweils die Konjunktion des Allow‑LUT, des Safe Q16.16‑Energie‑Restes und des Barrier‑Restes, in 6 370 LUTs und 128 DSP‑Slices, Timing bei 25 MHz abgeschlossen. Der Unterschied beträgt +0,2857 W (Standardfehler 0,0032 W). Bei 2,4999 × 10⁷ Gate‑Zyklen pro Sekunde entspricht das 11 428 pJ pro Gate‑Zyklus (Standardfehler 129 pJ), etwa 1,43 nJ pro Spuren‑Entscheidung. Der A2‑minus‑A1‑Drift betrug +0,0047 W (Standardfehler 0,0040 W). Die Bitstream‑Hashes und Protokolle befinden sich im `wca-kv260-meter`‑Artefakt der Referenz.

Was das Messgerät sehen kann und nicht sehen kann. Der INA260 gibt einen maximalen Offset von 5 mA und einen maximalen System‑Gain‑Fehler von 0,15 % an, mit einem Strom‑Schritt von 1,25 mA (TI INA260 Datenblatt). Der Offset ist für A und B auf derselben Platine und demselben Rail gemeinsam, sodass der Halt‑gegen‑Run‑Unterschied ihn aufhebt. Der Gain‑Fehler skaliert den Unterschied um höchstens 0,15 %. Das Messgerät erfasst die Platinen‑Leistung, sodass der Unterschied die durch das Enable‑Signal geschaltete Clock‑Tree‑ und Routing‑Leistung einschließt, nicht nur die Gate‑Logik. Der Unterschied von Durchlauf 2 liegt etwa drei Standardfehler vom Nullwert entfernt. Der von Durchlauf 3 liegt etwa neunzig Standardfehler entfernt. Das nächste Protokoll ist festgelegt: Lesen Sie die Core‑Rail (VCCINT) über die Regler‑Telemetrie des Moduls oder ein Source‑Measure‑Unit; mindestens 30 randomisierte interleaved A/B‑Paare; mindestens 10⁹ Gate‑Auswertungen pro Block; Die Die‑Temperatur wird vor jedem Block mit einer Leerlauf‑Basislinie protokolliert; sowohl Brutto‑ als auch subtrahierte Werte werden berichtet; die Vivado‑Leistungsabschätzung wird neben der Messung mit der Abweichung angegeben. Durchlauf 3 ist kein geschlossener‑Loop‑Plant‑Joule‑Kosten‑Messwert, und die analytischen Konstanten von Abschnitt I.3.4 werden dadurch nicht kalibriert.

Der wissenschaftliche Grund für Stufe B ist Replikation und Inspektion, nicht ein neuer physikalischer Anspruch. Ein Leser mit einem Browser führt dieselbe Seed‑1‑Episode aus und liest dieselben Allow‑Bits und Reason‑Codes, die das Gehäuse ausgibt. Die Übereinstimmung mit Stufe A ist der Akzeptanztest für Stufe B, und sie besteht für Seed 1. Die Übereinstimmung der Entscheidungen ist der Akzeptanztest für Pt V2, und sie besteht für Seed 1. Eine Messwert‑Ablesung bei einer angegebenen Arbeitslast ist der Akzeptanztest für den KV260, und Durchläufe 2 und 3 erfüllen ihn auf Platinen‑Ebene.

<div id="38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>
<div id="i38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>

### I.3.8 Was keine Methode dieses Beitrags ist

Keine Studie mit menschlichen Probanden. Keine Behauptung zur linguistischen Relativität über die Ablehnung in Abschnitt I.5 hinaus. Keine Extrapolation von Trainingsrechenleistung. Keine Identifizierung wirtschaftlicher Sättigung. Keine Optimierung gegenüber Groq, Etched oder Taalas Durchsatz. Kein Weltmodell-Benchmark.

<div id="4-results" class="anchor-alias" aria-hidden="true"></div>
<div id="i4-results" class="anchor-alias" aria-hidden="true"></div>

## I.4. Ergebnisse

Alle Größen in diesem Abschnitt werden in der Software‑Referenz simuliert, sofern ein Satz nicht ein externes Papier zitiert. Analytische Joule verwenden Abschnitt I.3.4. Nur NI‑9 wird plattenbezogen gemessen.

<div id="41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>
<div id="i41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>

### I.4.1 Behauptung NI-1. Der Commit-Datensatz existiert als Schema und als Rust-Typ

Schemata `Proposal`, `Certificate`, `RefuseReason` und `CommitDecision` befinden sich in `artifacts/schemas/wca.commit.v1/`. Rust‑Typen befinden sich in `crates/wca-commit/src/schema.rs`. Round‑trip‑Tests werden mit `cargo test -p wca-commit` ausgeführt. Dies ist ein Existenzresultat bezüglich der Referenz, Version `wca.commit.v1`. Es handelt sich nicht um einen Eindeutigkeits­satz.

<div id="42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>
<div id="i42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>

### I.4.2 Behauptung NI-2. Seed-1-Pendelsequenz

Befehl, aus `RESULTS.md`:

```text
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

Gemeldetes Ergebnis: committed = 1, refused = 15, analytical episode energy = 8.6795e-10 joule. Die gleichen Werte für committed und refused sowie die gleiche analytische Energie werden für `--safe-ph` bei diesem Seed gemeldet. `RESULTS.md` gibt an, dass der einzelne Commit Schritt 6 ist. Hinweis zur Toolchain in dieser Datei: Rust 1.98. Das erneute Ausführen des Binärprogramms ist die Reproduktion. Die Energie ist keine Messung eines Chips.

<div id="43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>
<div id="i43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>

### I.4.3 Behauptung NI-3. Falsche Erlaubnisse der sicheren Energieprüfung

`wca-ph-tighten` vergleicht diskrete Entscheidungen mit dem kontinuierlichen Orakel `Vdot <= epsilon`. Auf einem 21‑hoch‑3 Gitter plus 200 000 nahe‑Schwellen‑Monte‑Carlo‑Stichproben (209 261 Entscheidungen):

| Pfad | Falsch zulassen | Falsch ablehnen | Beide zulassen | Beide ablehnen |
|------|-----------------|----------------|----------------|----------------|
| Legacy Q8.8 | 30836 | 105 | 104711 | 73609 |
| Safe v1 (Q8.8 Über‑Approximation) | 0 | 42430 | 62386 | 104445 |
| Safe v2 (Q16.16 Residual) | 0 | 79 | 104737 | 104445 |

`RESULTS.md` gibt außerdem an, dass ein dichteres 41‑hoch‑3 Gitter plus 50 000 Monte‑Carlo‑Stichproben, geprüft in `cargo test`, falsches Zulassen gleich 0 behauptet. Safe v2 reduziert falsche Ablehnungen von 42 430 auf 79 im Vergleich zu Safe v1, während falsche Zulassungen bei 0 bleiben. Legacy Q8.8 ist nach dieser Definition nicht sicher: es verzeichnet 30 836 falsche Zulassungen. Diese Zahlen sind Eigenschaften des numerischen Tests, nicht eines physischen Pendels.

<div id="44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>
<div id="i44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>

### I.4.4 Behauptung NI-4. Spielzeug-Barrierenvergleich, keine Definition dominiert

`wca-cbf-bakeoff` führt Samen 0 bis 4 aus, 40 Schritte, Zeitschritt 0.05, Aktionsskala 2.5, gemeinsam genutztes Demo‑TLMM und DiffLogic‑Maske `21887`. Die Energie‑Set‑Barriere verwendet `h = 18 - V` und erlaubt, wenn `h >= 0` und `omega * u <= kappa * h` mit `kappa = 0.05`. Der diskrete Schild erlaubt einen Schritt, der innerhalb von absolutem Theta höchstens 2 und absolutem Omega höchstens 4 bleibt. Closed‑loop bedeutet Unterschied, weil Trajektorien divergieren. Die Datei berichtet Mittelwerte pro Episode für Commits und Summen für Verstöße. Ausgewählte Zeilen:

| Filter | Commit | Refuse | Analytical J | False allow vs PH | `h < 0` | `Vdot > epsilon` |
|--------|--------|--------|--------------|-------------------|---------|------------------|
| `lut_and_safe_ph` | 1 | 38 | 2.153e-09 | 0 | 4 | 0 |
| `cbf_energy_set` | 1 | 38 | 2.056e-09 | 3 | 0 | 3 |
| `shield_discrete` | 18 | 21 | 2.306e-09 | 90 | 38 | 90 |
| `lut_only` | 40 | 0 | 2.544e-09 | 194 | 220 | 194 |

Auf dieser Anlage und diesem Orakel hat `lut_and_safe_ph` keine `Vdot`‑Verstöße und vier `h < 0`‑Ereignisse. Die Energie‑Set‑Barriere hat keine `h < 0`‑Ereignisse und drei `Vdot`‑Verstöße. Der Schild committet mehr und verletzt das Energie‑Orakel häufig. `lut_only` stimmt mit `always_allow` bei den Verstößen in der berichteten Tabelle überein. Offline‑Übereinstimmung bei einem gemeinsam genutzten always‑allow‑Strom von 200 Schritten ergibt 4 Meinungsverschiedenheiten zwischen `lut_and_safe_ph` und `cbf_energy_set` und 70 gegenüber dem Schild.

Interpretation innerhalb des Tests: Passivität und Mengeninvarianz sind unterschiedliche Prädikate. Das LUT‑und‑Energie‑Tor ist nicht äquivalent zu einem Ames‑Filter und gewinnt nicht jede Spalte. Ein vollständiges quadratisches Programm‑Baseline auf einer reicheren Anlage ist in dieser Tabelle nicht enthalten. Dieser Vergleich bleibt offen. Das verfügbare Ergebnis ist die Meinungsverschiedenheit, die ein Hinweis gegen die Zusammenfassung der beiden Zertifikate zu einem Wort ist.

<div id="45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>
<div id="i45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>

### I.4.5 Behauptung NI-5. Cart-Pole-Safe-Lyapunov-Simulation

Im Audit, das in Abschnitt I.3.2 beschrieben wird (Gitter n = 7 plus 20 000 Randproben innerhalb der Lipschitz-Box, 26 487 Entscheidungen), lernte Safe Lyapunov gegenüber dem kontinuierlichen `Vdot`-Orakel, das falsche Erlaubnisse 0, falsche Ablehnungen 3, beide erlauben 15 925, beide ablehnen 10 559 aufzeichnet. Die geschlossene Schleife bedeutet über fünf Startwerte: `lut_and_safe_lyap` committet 11, lehnt 28 ab, analytisches J 2.719e-09 und zeichnet null falsche Erlaubnisse gegenüber jenem Orakel auf. Die Level-Set-Barriere auf demselben `V` committet 14 und zeichnet 15 Verstöße gegen das Energie-Orakel auf. Der diskrete Schild committet 29 und zeichnet 95 auf. Gleiches Muster wie beim Pendel: das Safe‑Konjunkt verfolgt sein eigenes Orakel; ein anderes Zertifikat verfolgt ein anderes; Permissivität ohne das Orakel ist keine Sicherheit.

Dies ist eine zusätzliche simulierte Anlage. Sie etabliert das Commit‑Gate bei industriellen Dynamiken nicht.

<div id="46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>
<div id="i46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>

### I.4.6 Behauptung NI-6. MCP-Demo

`artifacts/mcp_gate_demo.json` enthält vier Fälle. Das Board‑Result‑Flag in der Datei ist false.

| Fall | Klasse | Ausgeführt | Aufrufer‑Aufrufe | Commit |
|------|--------|------------|------------------|--------|
| `read_only_bypass` | read‑only | true | (kein Commit‑Eintrag) | absent |
| `irreversible_refuse` | irreversible | false | 0 | false |
| `irreversible_allow` | irreversible | true | 1 | true |
| `shell_exec_gated` | irreversible | true | (gated) | true |

Der Refuse‑Fall listet `energy_veto` (`vdot` 6.0 gegen `eps` 0.05) und `cbf_veto` auf. Die Pflanzenaktion in diesem Fall ist `[0.0]`. Der Allow‑Fall verwendet die Komposition `lut_and_safe_and_cbf` und die Pflanzenaktion `[-0.02]`. Die Anmerkung in der Datei besagt, dass Refuse niemals ausgeführt wird. Dies ist ein Demo des Adapters, keine Feldstudie von Computer‑Nutzungs‑Agenten.

<div id="47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>
<div id="i47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>

### I.4.7 Behauptung NI-7. TLMM unter einem analytischen Budget

`RESULTS.md` berichtet eine Demo‑2‑by‑4, Gruppe‑2‑Konfiguration nahe 4,24e-11 analytische Joule, unter dem Vorwärtsbudget. Die größten Konfigurationen, die unter dem Vorwärtsbudget von 2e-10 bleiben, enden bei 64 Parametern. Breiten von 8‑by‑16 und größer überschreiten dieses Budget selbst nach dem Optimierer. Iso‑Korrektheit gegenüber naiver ternärer Arithmetik ist ein Softwarevergleich bei einer Toleranz von 1e-12. Diese Aussagen sagen nicht, dass das Design die TeLLMe‑Durchsatzrate oder irgendeine Board‑Energie erreicht.

<div id="48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>
<div id="i48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>

### I.4.8 Behauptung NI-8. DiffLogic-Erlaubnis gegenüber einem Energielehrer, nur Spielzeugbeispiel

Auf dem harten Multi‑Seed‑Gate‑Benchmark in `RESULTS.md` stimmt DiffLogic nach Schwellenwert‑Kalibrierung und dichteren Labels mit dem Energie‑Lehrer bei einer Ablehnungsrate von 50,0 ± 15,9 Prozent, einer Präzision bei Schwelle 0,890 ± 0,067 und einem Recall von 0,802 ± 0,076 überein. Eine Bitmasken‑Referenz lehnt mehr ab (71,0 ± 14,9 Prozent) und ruft weniger ab (0,454 ± 0,266). Vor der Kalibrierung betrug die Ablehnungsrate von DiffLogic 57,5 ± 14,1 Prozent bei einem Recall von 0,724 ± 0,163. Der Vergleich bezieht sich auf dieses toy‑Labeling‑Setup. Es handelt sich weder um ein ImageNet‑ noch um ein Control‑Suite‑Ergebnis. Der interne Nutzen pro Joule steigt für das kalibrierte Gate (3,570e9 gegenüber 3,212e9 vorher) im analytischen Modell. Wie Abschnitt I.3.4 feststellt, verwendet dieses Verhältnis die Commit‑Anzahl als Nutzen.

<div id="49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>
<div id="i49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>

### I.4.9 Behauptung NI-9. Joule auf Board-Ebene des Gate-Geflechts

| Stufe | Schaltung | Takt | Unterschied (W) | Operation | Joule pro Operation | Bezeichnung |
|---|---|---|---|---|---|---|
| 1 | Seed-Freilauf vs Board-Basislinie | n/v | −0,8212 (SE 0,0024) | keine | keine | `measured_j`, nur Watt |
| 2 | Seed, Halt vs Lauf | etwa 100 MHz | +0,0098 (SE 0,0031) | ein Seed-Zyklus | 98,0 pJ (SE 30,8) | `measured_j`, INA260, SOM-Schiene (`VCC_SOM`) |
| 3 | Gate, 8 Bahnen, Halt vs Lauf | 25 MHz | +0,2857 (SE 0,0032) | ein Gate-Zyklus, 8 Entscheidungen | 11 428 pJ (SE 129) | `measured_j`, INA260, SOM-Schiene (`VCC_SOM`) |

N = 4 interleaved A/B/A passes pro Stufe. Das negative Vorzeichen bei Stufe 1 bedeutet, dass der Seed‑Bitstrom weniger Energie verbraucht als der Board‑Basis‑Bitstrom. Es bedeutet nicht, dass der Seed frei ist. Abschnitt I.3.7 gibt die Grenzen einer board‑level Messung an.

<div id="410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>
<div id="i410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>

### I.4.10 Sicherheit und Lebendigkeit

Zero false allows ist Sicherheit. Ein Tor, das alles ablehnt, ist ebenfalls sicher und nutzlos. Liveness ist die andere Achse: false verweigert und der Anteil der Aufgaben, die der gesteuerte Agent erledigt. NI-3 berichtet beides im Safe‑Raster. Safe v2 reduziert false refuses von 42,430 auf 79 bei null false allows. Die seed‑1‑Episode verbraucht 1 Schritt von 16, und diese Zahl allein sagt nicht, ob die Anlage ihr Ziel erreicht hat. Der erforderliche Bericht ist ein Frontierschaubild pro Anlage: Aufgaben‑Erfolgsrate gegenüber der false‑allow‑Rate, ein Punkt pro Compose‑Modus von NI-4 (`lut_only`, `shield_discrete`, `cbf_energy_set`, `lut_and_safe_ph`), jeder Punkt mit seinen Seeds und seiner Streuung. Bei den Arbeitslasten der Agenten verwendet dieselbe Frontier eine Angriffs‑Suite für false allows und eine harmlose Aufgabensuite für die Erledigung. Ein Tor wird anhand der Frontier beurteilt, nicht nach einer einzelnen Achse.

<div id="411-what-the-scan-supports" class="anchor-alias" aria-hidden="true"></div>
<div id="i411-what-the-literature-search-supports" class="anchor-alias" aria-hidden="true"></div>

### I.4.11 Was die Literaturrecherche stützt

Eine Literatursuche im September 2026 (Abschnitte I.2.4 bis I.2.9) ergab kein veröffentlichtes System, das ein erlerntes Boolesches erlaubtes LUT, ein port-Hamiltonian- oder Lyapunov-Energieprädikat und einen ternären LUT-Vorschlag als eine Commit-Grenze mit bitgenauer RTL-Simulation und einer analytischen Joule-Bilanz kombiniert. Die nächsten Nachbarn sind Schilde, energie‑bewusste Barrier‑Filter, Logiknetzwerke als Gesamtes Modell und TLMM‑Designs ohne Energiezertifikat. Die Suche unterstützt eine Lücken‑Aussage über die durchsuchte Literatur. Sie unterstützt keinen Prioritätsanspruch gegenüber unveröffentlichten Arbeiten und keinen Anspruch auf Energie‑Führerschaft.

<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>
<div id="i5-discussion" class="anchor-alias" aria-hidden="true"></div>

## I.5. Diskussion

<div id="51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>
<div id="i51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>

### I.5.1 Skalierung beantwortet die Commit-Frage nicht

Kaplan, Hoffmann, Hooker und Sutton beschreiben, wie Verlust und Vorschlagsfähigkeit skalieren. Ein größerer Vorschlagender kann weiterhin eine Aktion ausgeben, die `Vdot <= epsilon` nicht erfüllt. Den Vorschlagenden hinter das Zertifikat zu stellen, nutzt die Skalierung dort, wo die Evidenz sagt, dass Skalierung funktioniert, und nutzt das Prädikat dort, wo Skalierung schweigt. Die Bitter Lesson richtet Einwände gegen eingefrorene menschliche Merkmale, die Lernen blockieren. Sie impliziert nicht das Löschen eines Sicherheitsprädikats. Wenn ein zukünftiges Ergebnis zeigt, dass eine unbeschränkte Richtlinie denselben false-allow-Test bei geringeren analytischen Kosten und gleichem Aufgabenfehler besteht, würde NI-3s ingenieurtechnische Präferenz für das Tor an dieser Anlage geschwächt werden. Die logische Unterscheidung zwischen Vorschlag und Erlaubnis würde bestehen bleiben.

<div id="52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>
<div id="i52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>

### I.5.2 Natürliche Sprache und MCP sind Transport und Vorschlag

MCP löst Entdeckung und Aufrufform. System One löst einige Entscheidungen ohne freie Form-Generierung. Keines der Objekte ist `energy_ok`. Die Demo in NI-6 zeigt eine Ablehnung, die den Ausführer nicht aufruft. Eine Produktionsbereitstellung könnte den Adapter umgehen. Die Behauptung ist nicht, dass das Protokoll ein Umgehen unmöglich macht. Die Behauptung ist, dass die Erlaubnis ein separater Datensatz sein muss, wenn irreversible Effekte auditierbar sein sollen.

<div id="53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>
<div id="i53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>

### I.5.3 Starker sprachlicher Determinismus ist nicht die Behauptung

Die starke Hypothese, dass Sprache das Denken bestimmt, ist keine Prämisse. Die operationelle Aussage ist lokal. In diesem Schema ist ein Commit ohne ein gültiges Zertifikat kein erfolgreicher Datensatz. Eine untypisierte Vertrauenszeichenkette kann neben einem Erfolgsflag gespeichert werden und dennoch den Grund unausgesprochen lassen. Die Aufzählung beseitigt diese spezielle Mehrdeutigkeit. Sie beschreibt nicht die menschliche Kognition.

<div id="54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>
<div id="i54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>

### I.5.4 Formalismus kann verschwenderisch sein; dieses Prädikat ist klein

Eine Forderung nach einem Beweis des gesamten Agenten bei jedem Schritt würde das Budget dominieren. Die Referenz formalisiert eine Grenze. Nur-Lese‑Aufrufe umgehen sie. Der sichere Restwert ist eine Fixpunkt‑Ungleichung, keine allgemeine SMT‑Abfrage. NI-2s analytische Episodenenergie beträgt 8.6795e-10 Joule unter den angegebenen Konstanten. Sie kann nicht als Bruchteil der Board‑Energie eines generativen Modells angegeben werden, weil dieser Vergleich nicht gemessen wurde. Eine Aufteilung zwischen Vorschlags‑Joule und Gate‑Joule bei einer realen Agenten‑Arbeitslast fehlt in den Ergebnissen. Solange dies nicht vorliegt, ist das Kosten‑Einwand für dieses Spiel‑Gate beantwortet und bleibt für große Zertifikate offen.

<div id="55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>
<div id="i55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>

### I.5.5 Ein falsches Modell mit grünem Licht ist ein realer Fehler

Wenn `V` nicht die Energie der Anlage ist, kann `energy_ok` wahr sein, während die Anlage nicht sicher ist. Die im Referenzwerk vorhandene Abmilderung ist ein kontinuierliches Zwillingselement an den Spielzeugen, ein separater Grundcode und die Verweigerung, eine Wahrscheinlichkeit als Zertifikat zu behandeln. Die nicht vorhandene Abmilderung ist Störungs-Input-zu-Zustands-Stabilität, ein verifizierter Attraktionsbereich oder ein bayessches Glaubwürdigkeitsbudget der Art, die Leung und Paré untersuchen. NI-4 ist der Nachweis, dass zwei respektable Zertifikate widersprüchlich sind. Dieser Widerspruch ist ein Grund, das Prädikat zu benennen, nicht ein Grund, einem der beiden außerhalb seines Tests zu vertrauen.

<div id="56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>

### I.5.6 Frühere Zertifikatstheorie wird hier nicht dupliziert

Ames, Alshiekh, Dawson und die Laufzeit‑Überwachungs‑Papiere definieren bereits Filter und Monitore. NI‑1's Ergänzung ist der Produktdatensatz und die Zusammensetzung mit einem LUT‑Export und einem Werkzeug‑Ausführer in einer Referenz. Wo die Spielzeug‑Barriere bei Mengeninvarianz gewinnt, sagt das Papier das (NI‑4, NI‑5). Zusammensetzung ist `cbf_ok` als weiteres Konjunkt, wenn dieses Prädikat das erforderliche ist. Es ist keine Behauptung, dass das LUT das Ames‑Quadratik‑Programm berechnet.

<div id="57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>
<div id="i57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>

### I.5.7 Prädiktoren und spezialisierte Inferenzchips

Weltmodelle reduzieren einen Teil des Vorhersagefehlers und hinterlassen einen Rest. Spezialisierte Inferenzgeräte ändern die Kosten von Vorschlägen. Durchsatzzahlen von Anbietern sind Anbieterberichte, bis ein unabhängiges Messgerät sie wiederholt. Die Aufgabe des Gates ist der irreversible Zweig. Wenn die einzige Schnittstelle eines Geräts ein Token-Stream ist, muss der Commit‑Datensatz dennoch irgendwo existieren, bevor Aktuatoren oder irreversible Werkzeuge ausgeführt werden.

<div id="58-analytical-joules-are-not-a-costume-for-watts" class="anchor-alias" aria-hidden="true"></div>
<div id="i58-analytical-joules-are-not-watts" class="anchor-alias" aria-hidden="true"></div>

### I.5.8 Analytische Joule sind keine Watt

Die Konstanten in Abschnitt I.3.4 sind als ingenieurtechnische Zahlen gewählt. Sie ermöglichen den Vergleich von Zählungen innerhalb des Repositories. Sie sind nicht auf eine Artix-7‑Stromschiene kalibriert. Sie als Board‑Watt zu melden, wäre ein falscher Messbericht. Der korrekte Bericht ist der gegebene: Betriebszählungen werden berechnet; analytische Joule werden modelliert; Board‑Joule stammen ausschließlich vom KV260‑Messgerät und werden separat abgelegt. Stufe B von Abschnitt I.3.7 macht dasselbe Modell im Browser unter https://research.openie.dev/living/fpga-sim/ einsehbar. Es ändert die Messklasse nicht. Die KV260‑Rungen tun dies für das Fabric, das sie betrieben.

<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>
<div id="i6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## I.6. Grenzen und Bedrohungen der Validität

Interne Validität. Seed-1 ist eine Anfangsbedingung. Das Safe‑Gitter ist groß, aber dennoch ein gewählter Kasten und ein gewähltes Epsilon. Monte‑Carlo‑Stichproben nahe der Schwelle belasten die Grenze, die die Designer gewählt haben zu belasten. Ein anderes Epsilon oder eine andere Anlagenidentität brechen den numerischen Anspruch, bis er erneut ausgeführt wird. Das CBF im Bake‑off ist eine Energie‑Mengen‑Ungleichung, die im selben Crate implementiert ist, nicht ein unabhängig codierter Solver aus einer Ames‑Referenzimplementierung. Uneinigkeit ist informativ. Ein absolutes Ranking gegenüber dem Code der Literatur ist nicht etabliert.

Konstruktvalidität. Commit‑Count als Nutzen misst den Erfolg der Aufgabe nicht. Falsches Zulassen ist definiert gegenüber einem benannten Oracle. Ein System kann oracle‑sicher und check‑safe (null falsche Zulassungen gegenüber `Vdot <= epsilon`) sein und dennoch set‑safe (`h >= 0`) scheitern, wie NI‑4 zeigt. Leser, die „safe“ als ein Wort behandeln, werden die Tabelle missverstehen.

Externe Validität. Beide Anlagen sind Spielzeuge. Es gibt keinen Manipulator, Quadrotor oder Human‑in‑the‑Loop‑Versuch. Die MCP‑Demo ruft kein Netzwerk auf. Verilog wird simuliert. Das Browser‑Instrument wird als Stage‑B‑Simulation ausgeliefert. Der Alchitry Pt V2 stimmt bei Entscheidungen überein und ist ungemessen. Das KV260‑Reading ist auf Board‑Ebene und offen‑loop. Vendor‑Logic‑Cell‑Zahlen sind hier nicht bestätigt.

Messvalidität. Analytische Konstanten können auf jede Skala bearbeitet werden. Vergleiche mit Horowitz‘ Picojoule‑Tabellen, mit Landauers Grenze oder mit Vendor‑Tokens pro Joule sind mit diesen Konstanten nicht gültig. Die KV260‑Rungs sind ein Board‑Level‑Meter unter einer angegebenen Arbeitslast. Ein Core‑Rail‑Reading während der Closed‑Loop‑Episode fehlt. Die Leistungsaufnahme des Post‑Place‑and‑Route‑Tools wäre eine dritte Klasse, immer noch kein Meter, und wird nicht als Ergebnis berichtet.

Statistische Berichterstattung. Wo `RESULTS.md` einen Mittelwert und eine Standardabweichung angibt, kopiert dieses Papier diese. Es fügt keine Konfidenzintervalle hinzu, die nicht berechnet wurden. Die Multi‑Seed‑Abdeckung umfasst fünf Seeds bei den Bake‑offs und die gemeldeten Spreads des Hard‑Gate‑Benchmarks. Das ist kein Anspruch großer Stichprobe.

Nicht beansprucht. Folgendes sind keine Ergebnisse: Silizium‑Joule‑Führerschaft; Betrieb nahe der Landauer‑Grenze; Gehirn‑äquivalente Leistung; ein Gewinn gegenüber System One bei Latenz; ein Gewinn gegenüber World‑Model‑Benchmarks; starker linguistischer Determinismus; Identifikation von „Intelligenz“ mit Commit‑Count.

Falsifikatoren. NI‑2 ist falsch, wenn der angegebene Befehl auf der angegebenen Crate‑Revision diese Zählungen nicht ausgibt. NI‑3 ist falsch, wenn der Safe‑v2‑Test ein falsches Zulassen auf dem angegebenen Gitter meldet. NI‑6 ist falsch, wenn der Verweigerungsfall in der Demo‑Datei ausgeführt wird. NI‑1 ist falsch, wenn das Schema und die Laufzeit divergieren. Ein Stage‑B‑Emulator, der mit Stage‑A bei Seed 1 nicht übereinstimmt, besteht seinen eigenen Akzeptanztest nicht. Ein zukünftiger Meter, der Board‑Energie der analytischen Zahl zuweist ohne Kalibrierstudie, bestätigt das analytische Modell nicht.

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>
<div id="i7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## I.7. Schlussfolgerung

Das Papier definierte eine Commit-Entscheidung als ein konjunktives Zertifikat über ein LUT‑Allow‑Bit und ein Energieprädikat, mit einer optionalen Barriere, und zeigte eine Software‑Referenz, die die Entscheidung vor einer irreversiblen Wirkung ausgibt. Bei den berichteten Pendel‑Tests hat die Safe‑Fixed‑Point‑Regel null falsche Allows gegenüber ihrem kontinuierlichen Oracle `Vdot <= epsilon` im angegebenen Test‑Set, zum Preis von 79 falschen Refuses in 209 261 Entscheidungen. In den berichteten Vergleichen ist dieses Oracle nicht dasselbe wie die Mengeninvarianz. Die analytische Episoden‑Energie für den Seed‑1‑Durchlauf beträgt 8.6795e-10 Joule unter den veröffentlichten Konstanten. Das Tool‑Refuse im MCP‑Demo ruft den Executor nicht auf. Verilog‑Checks sind Simulationen. Das Browser‑WASM‑ und WebGPU‑Instrument ist verfügbar unter https://research.openie.dev/living/fpga-sim/ so dass dieselbe Entscheidung ohne Board inspiziert werden kann. Es bleibt eine Simulation, kein DUT‑Ergebnis. Der Alchitry Pt V2 stimmt mit der Software bei jeder Entscheidung von Seed 1 überein und bleibt ungemessen. Der KV260 misst das Gate‑Fabric auf Board‑Ebene: 11 428 pJ pro acht‑Lane‑Gate‑Zyklus bei 25 MHz. Die Referenz ist ein gemessenes Software‑Artefakt und ein Board‑gemessenes Fabric. Der geschlossene‑Loop‑Chip‑Joule ist die nächste Messung.

<div id="references" class="anchor-alias" aria-hidden="true"></div>
<div id="i-references" class="anchor-alias" aria-hidden="true"></div>

## I. Literaturverzeichnis

Simon, H. A., and Kadane, J. B. Optimal problem-solving search: all-or-none solutions. Artificial Intelligence 6(3), 235-247, 1975. https://doi.org/10.1016/0004-3702(75)90002-8

Alshiekh, M., Bloem, R., Ehlers, R., Konighofer, B., Niekum, S., and Topcu, U. Safe reinforcement learning via shielding. arXiv:1708.08611.

Ames, A. D., Coogan, S., Egerstedt, M., Notomista, G., Sreenath, K., and Tabuada, P. Control barrier functions: theory and applications. European Control Conference, 2019. https://doi.org/10.23919/ECC.2019.8796030

Amodei, D., and Hernandez, D. AI and compute. OpenAI, 2018. https://openai.com/index/ai-and-compute/

Anthropic. Introducing the Model Context Protocol. https://www.anthropic.com/news/model-context-protocol

Bacellar, A., et al. Differentiable weightless neural networks. arXiv:2410.11112.

Bauer, A., Leucker, M., and Schallhart, C. Runtime verification for LTL and TLTL. ACM Transactions on Software Engineering and Methodology 20(4), 14, 2011. https://doi.org/10.1145/2000799.2000800

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Brillouin, L. Science and Information Theory. Academic Press, 1956.

Chaitin, G. J. Algorithmic information theory. IBM Journal of Research and Development, 1977. https://doi.org/10.1147/rd.214.0350

Chen, Z., Kang, M., and Li, B. ShieldAgent: Shielding Agents via Verifiable Safety Policy Reasoning. ICML 2025 (PMLR v267). arXiv:2503.22738. https://proceedings.mlr.press/v267/chen25ae.html

Chollet, F. On the measure of intelligence. arXiv:1911.01547.

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Dawson, C., Gao, S., and Fan, C. Safe control with learned certificates: a survey of neural Lyapunov, barrier, and contraction methods. arXiv:2202.11762.

Engelbart, D. C. Augmenting human intellect: a conceptual framework. 1962. https://www.dougengelbart.org/pubs/augment-3906-Framework.html

Falcone, Y. You should better enforce than verify. Runtime Verification (RV 2010), Lecture Notes in Computer Science 6418, 89-105. Springer, 2010. https://doi.org/10.1007/978-3-642-16612-9_9

Garcia-Molina, H., and Salem, K. Sagas. Proceedings of ACM SIGMOD 1987, 249-259. https://doi.org/10.1145/38713.38742

Gray, J. Notes on data base operating systems. In Operating Systems: An Advanced Course, Lecture Notes in Computer Science 60, 393-481. Springer, 1978. https://doi.org/10.1007/3-540-08755-9_9

Greydanus, S., Dzamba, M., and Yosinski, J. Hamiltonian neural networks. arXiv:1906.01563.

Ha, D., and Schmidhuber, J. World models. arXiv:1803.10122.

Hafner, D., Pasukonis, J., Ba, J., and Lillicrap, T. Mastering diverse domains through world models. arXiv:2301.04104.

Henzinger, T. A., Kueffner, K., and Yu, E. Formal verification of neural certificates done dynamically. arXiv:2507.11987. https://arxiv.org/abs/2507.11987

Hestness, J., et al. Deep learning scaling is predictable, empirically. arXiv:1712.00409.

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Hooker, S. The hardware lottery. arXiv:2009.06489. Communications of the ACM, 2021. https://doi.org/10.1145/3467017

Horowitz, M. Computing's energy problem (and what we can do about it). IEEE International Solid-State Circuits Conference, 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Iverson, K. E. Notation as a tool of thought. Communications of the ACM, 1980. https://dl.acm.org/doi/10.1145/358896.358899

Jaynes, E. T. Information theory and statistical mechanics. Physical Review 106, 620, 1957. https://doi.org/10.1103/PhysRev.106.620

Kang, S., Yu, T., and Hwang, S. J. PolicyGuide: from guarding one action to guiding the whole workflow for policy-compliant LLM agents. arXiv:2608.19861. https://arxiv.org/abs/2608.19861

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Kay, A. A personal computer for children of all ages. 1972. https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf

Klein, G., et al. seL4: formal verification of an OS kernel. Proceedings of SOSP 2009, 207-220. https://doi.org/10.1145/1629575.1629596

Kolmogorov, A. N. Three approaches to the quantitative definition of information. 1965. English: International Journal of Computer Mathematics, 1968. https://doi.org/10.1080/00207166808803030

Kuon, I., and Rose, J. Measuring the gap between FPGAs and ASICs. IEEE Transactions on Computer-Aided Design 26(2), 203-215, 2007. https://doi.org/10.1109/TCAD.2006.884574

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

LeCun, Y. Path towards autonomous machine intelligence / JEPA discussion. Meta AI blog. https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/

LeCun, Y., Chopra, S., Hadsell, R., Ranzato, M., and Huang, F. J. A tutorial on energy-based learning. 2006. http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf

Lee, L. Notational intelligence. 2022. https://thesephist.com/posts/notation/

Leung, C. H., and Paré, P. E. Bayesian safety guarantees for port-Hamiltonian systems with learned energy functions. arXiv:2512.24493.

Levy, W. B., and Calvert, V. G. Cerebral cortical communication overshadows computational energy-use, but these combine to predict synapse number. arXiv:2102.06273.

Ligatti, J., Bauer, L., and Walker, D. Edit automata: enforcement mechanisms for run-time security policies. International Journal of Information Security 4, 2-16, 2005. https://doi.org/10.1007/s10207-004-0046-8

Ma, S., et al. The era of 1-bit LLMs: all large language models are in 1.58 bits. arXiv:2402.17764.

Manek, G., and Kolter, J. Z. Learning stable deep dynamics models. arXiv:2001.06116.

Matuschak, A., and Nielsen, M. How can we develop transformative tools for thought? https://numinous.productions/ttft/

Mead, C. Neuromorphic electronic systems. Proceedings of the IEEE, 1990. https://doi.org/10.1109/5.58356

Necula, G. C. Proof-carrying code. Proceedings of the 24th ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL '97), 106-119, 1997. https://doi.org/10.1145/263699.263712

Petersen, F., et al. Deep differentiable logic gate networks. arXiv:2210.08277.

Qiao, Y., Chen, Z., Zhang, Y., Wang, Y., et al. TeLLMe: an energy-efficient ternary LLM accelerator for prefilling and decoding on edge FPGAs. arXiv:2504.16266.

Roth, F., et al. Stable port-Hamiltonian neural networks. arXiv:2502.02480.

Saltzer, J. H., and Schroeder, M. D. The protection of information in computer systems. Proceedings of the IEEE 63(9), 1278-1308, 1975. https://doi.org/10.1109/PROC.1975.9939

Sanchez, C., et al. A survey of challenges for runtime verification from advanced application domains. arXiv:1811.06740.

Sandberg, A. Energetics of the brain and AI. arXiv:1602.04019.

Schneider, F. B. Enforceable security policies. ACM Transactions on Information and System Security 3(1), 30-50, 2000. https://doi.org/10.1145/353323.353382

Sha, L. Using simplicity to control complexity. IEEE Software 18(4), 20-28, 2001. https://doi.org/10.1109/MS.2001.936213

Shannon, C. E. A mathematical theory of communication. Bell System Technical Journal, 1948. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Shi, T., He, J., Wang, Z., et al. Progent: Securing AI Agents with Privilege Control. arXiv:2504.11703. https://arxiv.org/abs/2504.11703

Solomonoff, R. J. A formal theory of inductive inference, parts I and II. Information and Control, 1964.

SparkFun. Alchitry Pt V2 product page. https://www.sparkfun.com/alchitry-pt-v2.html

Sutskever, I. An observation on generalization. Simons Institute talk, 2023. https://www.youtube.com/watch?v=AKMuA_TVz3A

Sutton, R. The bitter lesson. 13 March 2019. http://www.incompleteideas.net/IncIdeas/BitterLesson.html

Texas Instruments. INA260 precision digital current and power monitor, data sheet. https://www.ti.com/lit/ds/symlink/ina260.pdf

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Umuroglu, Y., et al. LogicNets. arXiv:2004.03021.

Victor, B. Inventing on principle. 2012. https://www.youtube.com/watch?v=PUv66718DII

Victor, B. Media for thinking the unthinkable. https://worrydream.com/MediaForThinkingTheUnthinkable/

Wang, H., Poskitt, C. M., and Sun, J. AgentSpec: customizable runtime enforcement for safe and reliable LLM agents. arXiv:2503.18666. https://arxiv.org/abs/2503.18666

Wei, J., et al. T-MAC. arXiv:2407.00088.

Xiang, Z., Zheng, L., Li, Y., Hong, J., et al. GuardAgent: safeguard LLM agents by a guard agent via knowledge-enabled reasoning. arXiv:2406.09187. https://arxiv.org/abs/2406.09187

Yu, E., Žikelić, Đ., and Henzinger, T. A. Neural control and certificate repair via runtime monitoring. AAAI 2025. https://doi.org/10.1609/aaai.v39i25.34840 (arXiv:2412.12996).

Local measurement record: `artifacts/RESULTS.md` in the `wca-lut-edge` software reference. KV260 meter record: `artifacts/stage-c/wca-kv260-meter/` (protocol, claim status, A/B/A logs and summaries). Schema examples: `artifacts/schemas/wca.commit.v1/examples/`. Demo: `artifacts/mcp_gate_demo.json`.

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## I. Anhang A. Reproduzierbarkeit

Arbeitsplatzpfad, der zur Erzeugung der zitierten Protokolle verwendet wurde: der `wca-lut-edge`-Baum, Rust 1.98 wie in `RESULTS.md` festgehalten. Tagesaktuelle Befehle:

```text
cargo test -p wca-commit
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1 --safe-ph
cargo run --release --bin wca-ph-tighten -- --grid 21 --out artifacts/ph_tighten_report.json
cargo run --release --bin wca-cbf-bakeoff -- --out artifacts/cbf_bakeoff_report.json
cargo run --release --bin wca-lyap-plant -- --out artifacts/lyap_plant_report.json
cargo run --release --bin wca-mcp-gate -- --demo
cargo run --release --bin wca-tlmm-scale -- --out artifacts/tlmm_scale_report.json
```

Icarus Verilog war Version 12.0 in der Umgebungsnotiz in `RESULTS.md`. RTL‑Prüfungen sind Simulationen. Analytische Joule dürfen nicht als Board‑Leistung interpretiert werden.

Das Board‑Ergebnis‑Flag ist nur für die KV260 Stage C‑Rungen 1 bis 3 (Abschnitt I.3.7) auf Board‑Ebene wahr. Alle anderen Ergebnisse in diesem Papier sind Simulationen oder analytisch.

<div id="appendix-b-browser-fpga-emulator-architecture-to-build" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-b-browser-fpga-emulator-architecture" class="anchor-alias" aria-hidden="true"></div>

## I. Anhang B. Browser-FPGA-Emulator: Architektur

Dieser Anhang beschreibt die Architektur des Stage‑B‑Emulators, der unter https://research.openie.dev/living/fpga-sim/ läuft. Die Seed‑1‑Übereinstimmungszahlen unten stammen aus dem WASM‑Durchlauf gegen das Stage‑A‑Goldstandard‑Modell.

Module.

1. `decision_core`. Reine Funktionen, die bereits durch das Rust‑Zertifikat, den Plant‑Step und den Joule‑Akkumulator repräsentiert sind. Kein Dateisystem und keine Threads erforderlich. Ziel `wasm32-unknown-unknown`.
2. `lut_image`. Das gleiche Speicher‑Image, das der Verilog‑Pfad lädt (`artifacts/fpga/wca_allow_lut.mem` und Nachfolger). Die Browser‑Kopie muss hash‑identisch zu der Datei sein, die für die Icarus‑Prüfung verwendet wurde.
3. `trace`. Ein festes Schema: Schritt‑Index, Zustand, `u`, `lut_allow`, `energy_ok`, `cbf_ok`, Reason‑Codes, analytische Joule‑Inkremente, Plant‑Aktion. Identische Feldnamen zu `wca.commit.v1`, sodass ein Dump gegen das JSON‑Objekt des Crates diffbar ist.
4. `webgpu_view`. Gerät, Queue und ein Speicher‑Buffer für die LUT und den Trace. Ein Shader zeichnet „allow“ und „refuse“. Ein zweiter Dispatch kann das Safe‑Residual über ein Gitter abbilden. Buffer dienen der Inspektion. Sie stellen kein Leistungs‑Modell dar.
5. `workstation_oracle`. Icarus bleibt das RTL‑Oracle. Der Browser ersetzt es nicht. Eine Diskrepanz zwischen WASM und dem Rust‑Binary lässt den Build fehlschlagen. Eine Diskrepanz zwischen WASM und Icarus bezüglich des geteilten LUT‑Images lässt den Build ebenfalls fehlschlagen. Kein Vergleich erwähnt Watt.

Akzeptanz‑Tests. Der Seed‑1‑Test besteht (Abschnitt I.3.7). Die übrigen Tests sind die spezifizierten Prüfungen für das jeweilige Modul.

- Seed‑1, 16 Schritte, init theta 1.5, omega 3.0: committed 1, refused 15, analytical joule 8.6795e-10, matching NI‑2.
- Safe‑Grid‑Smoke: false allow 0 on a published subset of the 209,261‑decision test, matching NI‑3's direction.
- MCP‑refuse‑Vector: executor call count 0, matching NI‑6.
- Ein Unit‑Test, bei dem das WebGPU‑Buffer‑Readback dem WASM‑Trace entspricht. Wenn das Readback nicht verfügbar ist, muss die Seite anzeigen, dass der GPU‑Pfad den Trace nicht bestätigt hat, und der CPU‑WASM‑Trace bleibt das Ergebnis.

Physischer Follow‑On für Board **joules**. Stage C hat bereits ein Closed‑Loop‑Commit‑Gate auf dem Alchitry Pt V2 mit UART‑Entscheidungs‑Agreement programmiert; das Board verfügt noch über keinen eingebauten Joule‑Meter. Ein USB‑Inline‑Power‑Meter oder ein Shunt‑plus‑Oszilloskop auf der 5 V‑Schiene, bei einer angegebenen Arbeitslast, wäre das, was einen board‑gemessenen Joule unterstützen würde. Vivado / post‑PAR‑Schätzungen sind nicht dieser Meter. Vendor‑Logic‑Cell‑ und Memory‑Zahlen bleiben Vendor‑Zahlen. Siehe [/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy).

Aus dem Umfang des Emulators heraus: das Training von DiffLogic im Browser und die Schätzung der dynamischen Leistung von Artix‑7 aus einem Shader.

<div id="part-ii" class="anchor-alias" aria-hidden="true"></div>
<div id="mixture-of-limits-navigation-law-for-computer-intelligence" class="anchor-alias" aria-hidden="true"></div>
<div id="part-ii-the-cascade-mixture-of-limits" class="anchor-alias" aria-hidden="true"></div>

## Part II. Die Kaskade (Mixture of Limits)

<div id="mol-abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="ii1-the-rule" class="anchor-alias" aria-hidden="true"></div>

## II.1. Die Regel

Eine Aufgabe wird durch ein Vollständigkeitspredikat $C(z) \in \{0, 1\}$ über ihren Zustand $z$ definiert. Ein **Gear** ist ein Mechanismus, der die Aufgabe schließen kann: Lookup (einen gespeicherten, verifizierten Wert lesen), Formula (eine geschlossene Form auswerten), Solver (eine Suche, Optimierung ausführen oder mit einem Zertifikat abschließen) oder Model (einen gelernten Generator ausführen). Gear $i$ hat eine Durchlaufwahrscheinlichkeit $p_i$, die Wahrscheinlichkeit, dass es $C(z) = 1$ in der Aufgabenkategorie erreicht, und einen erwarteten Energieverbrauch $c_i$ in Joule (J).

Der **Floor** einer Aufgabe ist die kleinste erwartete Energie, bei der irgendeine Politik über Gears $C(z) = 1$ mit Fehlerrate höchstens $\delta$ erreicht. Er entspricht $J^*$ von Abschnitt 0.2. Das **Plateau** ist der Bereich des Aufwands über dem Floor: Sobald $C(z) = 1$, kann weitere Berechnung $C$ nicht erhöhen, sodass zusätzliche Joule keinen Nutzen für das genannte Ziel bringen.

**Mixture of Limits** ist die Regel: Gears in einer Reihenfolge ausprobieren, die die erwartete Energie bis zum ersten Abschluss minimiert, beim ersten Gear, das $C(z)$ schließt, stoppen und bei Überschreitung des Budgets oder wenn die Entscheidung nicht mehr geändert werden kann, mit einem Beleg ablehnen. Lookup → Formula → Solver → Model ist die Standardreihenfolge. Sie ist nur unter der in Abschnitt II.2 abgeleiteten Bedingung optimal. Jeder Abschluss durchläuft den Datensatz von Teil I: vorschlagen, zertifizieren, committen oder ablehnen, Beleg.

**Wo das Model steht.** Model last ist eine Reihenfolge des Versuchs, kein Urteil darüber, was Modelle leisten können. Snell et al. (2024) zeigten, dass ein rechenoptimaler Zeitplan für Testzeit‑Rechenleistung die Best‑of‑N‑Methode um mehr als das Vierfache in Effizienz übertrifft und dass bei manchen Problemen Testzeit‑Rechenleistung ein größeres Modell ersetzen kann. Dieses Ergebnis bezieht sich auf den Zeitplan innerhalb des Model‑Gears, der wie jedes andere Gear in Joule bepreist wird. Das Model‑Gear wird aktiviert, sobald billigere Gears $C(z)$ nicht schließen können, und es wird zuerst aktiviert, wenn diese zu selten erfolgreich sind, um ihre Fehlversuche zu bezahlen.

Abbildung 2 zeigt den Floor und das Plateau für eine Aufgabe.

![Diagram of verified progress against spend for one task. Progress rises in steps as the cascade escalates from Lookup to Formula to Solver; the Solver closes the task, marking the floor. Past the floor the Model stage adds spend with no further verified progress, the plateau where value of information is zero.](/figures/gates/mol-plateau.svg)

*Abbildung 2. Mixture of Limits für eine Aufgabe. Diagramm, keine Messung. Eine [PNG copy](/figures/gates/mol-plateau.png) ist bereitgestellt.*

**Mixture of Limits ist nicht Mixture of Experts.** Mixture‑of‑Experts (MoE) Routing wählt Parameter innerhalb eines generativen Modells aus (Shazeer et al., 2017; Fedus et al., 2022). Mixture of Limits wählt, ob und wo Aufwand über Gears verteilt wird, und ein MoE‑Modell kann als sein Model‑Gear dienen.

| | MoE | Mixture of Limits |
|---|---|---|
| Wo die Entscheidung getroffen wird | Innerhalb eines Modells | Über Gears, bevor ein Modell läuft |
| Gewähltes Objekt | Welche Parameter laufen | Welches Gear schließt, oder Ablehnung |
| Erfolg | Wahrscheinlichkeit des nächsten Tokens | $C(z) = 1$, ein zertifizierter Commit und ein Beleg |
| Ablehnung | Kein nativer Ausgang | Ein typisierter Ausgang mit einem Beleg |

<div id="ii2-expected-energy-of-a-cascade-and-the-optimal-order" class="anchor-alias" aria-hidden="true"></div>

## II.2. Erwartete Energie einer Kaskade und die optimale Reihenfolge

**Zwei Zahnräder.** Angenommen, ein leichtes Zahnrad L hat Durchtrittswahrscheinlichkeit $q_L$ und Energie $c_L$ und folgt ein schweres Zahnrad H, das immer durchtritt, mit Energie $c_H$. Das Ausprobieren von L zuerst kostet im Erwartungswert $c_L + (1 - q_L)\,c_H$. Das Ausprobieren von H zuerst kostet $c_H$. Daher ist L zuerst günstiger genau dann, wenn

$$
c_L + (1 - q_L)\,c_H < c_H \iff c_L < q_L\, c_H .
$$

Zum Beispiel spart ein Lookup, das $c_L = 10^{-9}$ J kostet und bei $q_L = 0.3$ der vorherigen Aufgaben durchtritt, gegenüber einem Modellaufruf, der $c_H = 10$ J kostet, im Erwartungswert $q_L c_H - c_L \approx 3$ J pro Aufgabe. Wenn $q_L$ unter $c_L / c_H = 10^{-10}$ fällt, kehrt sich die Reihenfolge um.

**Viele Zahnräder.** Für $n$ Zahnräder, die in Folge bis zum ersten Durchtritt ausprobiert werden, mit unabhängigen Ergebnissen, beträgt die erwartete Energie der Reihenfolge $\sigma$

$$
\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j<k} \bigl(1 - p_{\sigma(j)}\bigr).
$$

Der Austausch zweier benachbarter Zahnräder $a$ und dann $b$ ändert diese Summe um einen Faktor, der beiden Termen gemeinsam ist, multipliziert mit $(c_a + (1-p_a)c_b) - (c_b + (1-p_b)c_a) = c_a p_b - c_b p_a$. Daher sollte $a$ vor $b$ stehen genau dann, wenn $p_a / c_a > p_b / c_b$, und die optimale Reihenfolge sortiert die Zahnräder nach abnehmendem $p_i / c_i$ (Simon und Kadane, 1975). Das billigste zuerst ist exakt dann optimal, wenn billigere Zahnräder auch die höhere Durchtrittswahrscheinlichkeit pro Joule besitzen. Wenn das nicht zutrifft, beginnt die Kaskade bei einem schwereren Zahnrad. Unter einem bindenden Budget bleiben die Joule gescheiterter leichter Versuche ausgegeben, sodass ein Selektor, der $p_i / c_i$ pro Aufgabe schätzt, Aufgaben schließen kann, die eine feste Reihenfolge nicht schließen kann.

**Physikalische Untergrenze.** Jedes Zahnrad, das $n$ Bits irreversibel bei Temperatur $T$ löscht, dissipiert mindestens

$$
E_{\text{Landauer}}(n, T) = n\, k_B T \ln 2, \qquad k_B = 1.380649 \times 10^{-23}\ \text{J/K},
$$

was $2.87 \times 10^{-21}$ J pro Bit bei 300 K entspricht (Landauer, 1961; Bennett, 1973, für das reversible Limit). Gemessene CMOS‑Operationen kosten etwa 0,9 pJ für eine 32‑Bit‑Gleitkomma‑Addition bei 45 nm und etwa 1 bis 2 nJ für einen DRAM‑Zugriff (Horowitz, 2014, Paper‑Text; die Vortragsfolien geben 1,3 bis 2,6 nJ für einen 64‑Bit‑Zugriff an), acht bis zwölf Größenordnungen darüber. Die oft zitierte Angabe von 640 pJ pro 32‑Bit‑DRAM‑Lesevorgang stammt weder aus diesem Paper noch aus den Folien und wird hier nicht verwendet. Die Landauer‑Zahl auf einem Beleg ist daher ein gekennzeichneter Untergrenzwert, niemals eine Messung.

**Katalog‑Kostenmodell.** Bevor ein Zahnrad läuft, referenziert die Software es zu einem Preis von

$$
E_{\text{est}}(x) = \theta(D)\,\mu(S, V),
$$

wobei $\theta(D)$ (dimensionslos) mit der Schwierigkeitsklasse $D$ von Akt $x$ skaliert und $\mu(S, V)$ (J) eine Katalog‑Energie für das Primitive $S$ auf Hardware‑Ansicht $V$ ist. Beide sind als Katalog‑Konstanten angegeben, sodass $E_{\text{est}}$ eine Schätzung ist, die zur Reihenfolge der Zahnräder verwendet wird. Sie wird nicht aus der Physik abgeleitet und wird niemals als Messwert berichtet. Das Ranking unter Systemen, die die Aufgabe schließen, verwendet gemessene Joule (Abschnitt 0.2).

<div id="ii3-stopping-conditions" class="anchor-alias" aria-hidden="true"></div>

## II.3. Abbruchbedingungen

**Wert der Information.** Sei $B$ die Auszahlung einer Entscheidung, $x$ der aktuelle Informationszustand, $y$ eine weitere Beobachtung oder Berechnung, $c(y)$ deren Energie und $\lambda$ der Wechselkurs zwischen Auszahlung und Joule. Der Nettowert ist

$$
\Delta(x, y) = \mathbb{E}[B \mid x, y] - \mathbb{E}[B \mid x] - \lambda\, c(y)
$$

(Howard, 1966; Russell und Wefald, 1991). Die Regel verweigert Eskalation, wenn $\Delta \le 0$. Sobald $C(z) = 1$, sind die ersten beiden Terme für jede weitere $y$ auf der Aufgabe gleich, sodass $\Delta = -\lambda c(y) < 0$ und das Stoppen folgt.

**Abdeckung der Grammatik.** Sei $G$ die Menge der verifizierten Ableitungen, die Lookup, Formula und Solver zur Verfügung stehen. Eine Anfrage $q$ ist abgedeckt, wenn eine Ableitung $q \vdash_G a$ existiert. Wenn $q$ abgedeckt ist, wird das Model‑Zahnrad nicht geöffnet, weil ein abgedecktes Zahnrad mit Wahrscheinlichkeit 1 bei niedrigerer Energie als das Model‑Zahnrad durchläuft, sodass es nach der Zwei‑Zahnrad‑Ungleichung in Abschnitt II.2 zuerst kommt und die Aufgabe schließt. Wenn $q$ nicht abgedeckt ist und die Richtlinie das Model‑Zahnrad verbietet, verweigert die Regel.

**Ablehnung des Settle‑Schritts.** Ein Solver‑Zahnrad, das nach einer energiearmen Konfiguration sucht, erreicht entweder einen zertifizierten Fixpunkt (commit) oder meldet, dass es innerhalb seines Budgets nicht settle‑t (refuse).

Benannte Ablehnungsgründe in der Software‑Referenz:

| Grund | Bedingung |
|---|---|
| `voi` | $\Delta \le 0$ für jeden verfügbaren nächsten Schritt |
| `grammar` | Nicht abgedeckt und das Model‑Zahnrad ist nicht erlaubt |
| `energy` | Die Schätzung des nächsten Zahnrads überschreitet das verbleibende Budget |
| `efa_certificate` | Die Zertifikatsprüfung schlägt vor dem Commit fehl |
| `settle_refuse` | Der Solver settle‑t nicht innerhalb seines Budgets |
| `primitive_gap` | Ein erforderliches Primitive fehlt im Katalog |
| `safety` | Eine Fähigkeitsprüfung verweigert die Aktion |

<div id="ii4-provenance-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## II.4. Herkunft und Belege

Jede Antwort enthält eine Wiedergabeklasse, die angibt, wie sie erzeugt wurde: `Deterministic` (Lookup, Formula oder ein zertifizierter Solver), `RetrievedCited`, `Composed` oder `ModelGenerated`. Das Typsystem verbietet die Stärkung einer Klasse: `ModelGenerated` kann nicht zu `Deterministic` umgeschrieben werden. Energie auf einem Beleg trägt eines von drei Labels: **Estimated** (Katalog, Landauer- oder Instruktions‑Brennstoffzahl), **Unmetered** (keine Messung) oder **Metered** (ein benannter Zähler liefert einen Messwert). Die Softwarereferenz lässt `measured_j` unbelegt, sofern kein Zähler zurückgibt. Der Katalog der Primitive, den die Referenz durchläuft, gruppiert in Familien, wird in diesem Papier als Periodic Stack bezeichnet; jede Zelle ist Present (implementiert) oder Gap (nicht vorhanden).

<div id="ii5-software-reference" class="anchor-alias" aria-hidden="true"></div>

## II.5. Software-Referenz

Die Software‑Referenz `mixture-of-limits` (Apache-2.0 oder MIT) verfügt über ein Harness, `cargo run -p mol-cli -- prove`, das für jedes Kriterium `VERIFIED` ausgibt und mit 0 beendet. Die Workspace‑Test‑Suite (`cargo test --workspace`) besteht (P0), und das Harness beendet sich mit 0 (P1). Ein als verifiziert markiertes Kriterium bedeutet, dass eine Implementierung existiert und ihre angegebene Spezifikation erfüllt. Es ist kein Theorem, keine unabhängige Replikation und keine Energiemessung. Zum Stand des Laufs vom 2. Oktober 2026 gibt das Harness 43 `VERIFIED`‑Kriterien aus (dies ersetzt die frühere Zahl von etwa 29); die nachstehende Tabelle führt P2 bis P24 auf, und II.5.1 bis II.5.3 beschreiben die Produkt‑Lücken‑Kriterien A11 bis A14, die danach hinzugefügt wurden. Die übrigen Kriterien werden in diesem Beitrag nicht aufgelistet und finden sich in der `PLAN.md`‑Datei der Software‑Referenz sowie in `product/ACCEPTANCE`.

<div id="6-prove--claim-map" class="anchor-alias" aria-hidden="true"></div>

| Nachweis-Nr. | Kriterium | Anspruchs-ID | Anspruch | Geltungsbereich-Hinweis | Messung |
|---|---|---|---|---|---|
| Beweis # | Kriterium (PLAN) | Papier-Claim-ID | Behauptung (ein Satz) | Software-Referenz / Anmerkung | Messung |
|---|---|---|---|---|---|
| P2 | Deterministischer Abschluss (Doppel-Durchlauf) | `claim.mol.deterministic_close` | Gleiche Anfragen führen zum selben Commit/Refuse + Limit-ID. | keine | Ungemessen |
| P3 | Formel-/Lookup-Abschluss ohne Modell | `claim.mol.formula_lookup_no_model` | Landauer / Einheitsumwandlung schließt COMMIT bei Lookup oder Formel; Modell nie beantwortet. | keine | Ungemessen / Geschätzt (Landauer‑Bodenwert beim Empfang) |
| P4 | VoI verweigern wenn `!allow_model` | `claim.mol.voi_refuse` | Freiform‑Anfrage → REFUSE `voi`. | keine | Ungemessen |
| P5 | Settle‑Commit + Settle‑Refuse | `claim.mol.settle_ternary` | Ternary settle → COMMIT; `will not settle` → REFUSE `settle_refuse`. | Software‑Ref Settle‑Stub; kein VM / FPGA | Ungemessen |
| P6 | Zertifikat‑Verweigerung bei Divergenz | `claim.mol.efa_certificate_refuse` | Formula + `diverge` → REFUSE `efa_certificate`. | Im‑Baum‑Zertifikat | Ungemessen |
| P7 | Capability‑Standardverweigerung Mutieren | `claim.mol.capability_deny_mutate` | `AutomateGate::default().gate(Mutate)` → Refuse. | keine | Ungemessen |
| P8 | Beleg‑Etiketten | `claim.mol.receipt_honesty` | Software-ref: `measured_j=None`, estimate labeled (`EstimateKind`). | Live RAPL/NVML Standardabschluss AUSSERHALB DES GELÄNDE | Ungemessen / Geschätzt |
| P9 | `ModelGenerated` ↛ `Deterministic` | `claim.mol.replay_no_strengthen` | `TypedAnswer::weaken_to` returns `ReplayCoercion`. | keine | keine |
| P10 | Periodische Stack‑Live‑Katalog‑Navigation | `claim.mol.stack_live_catalog` | Familie + präsent + Skala → COMMIT bei Lookup; 258 Live‑Lookup/Formula/Solver/Navigate‑Gänge. | μ Kalibrierung + Silizium‑HW AUSSERHALB DES GELÄNDE; Software‑Referenz Gap‑Simulationen im Beweis | Ungemessen |
| P11 | `primitive_gap` via Registrierungs‑Probe | `claim.mol.primitive_gap` | Gap marker `physical_settle` + absent name → REFUSE `primitive_gap` (not string-only). | keine | Ungemessen |
| P12 | μ / Impedanz‑Katalog | `claim.mol.mu_catalog` | Beleg‑Stempel `mu_source=catalog`, `mu`, `landauer_floor_ratio`; `E≈θ·μ` (Katalog‑Schätzung, nicht RAPL/`measured_j`). | μ **Kalibrier‑Korpus** AUSSERHALB DES GELÄNDE | Geschätzt |
| P13 | Beleg‑Transkript‑Wiedergabe | `claim.mol.receipt_replay` | JSONL/in-memory replay reproduziert Commit/Refuse + Limit-ID; Modell nie beantwortet. | keine | Ungemessen |
| P14 | Z2 abrufen+zitieren | `claim.mol.z2_retrieve_cite` | Seeded factual hit → COMMIT `RetrievedCited` + citation ids; unknown → REFUSE `claim_unknown` (no invent). | Seed‑Korpus nur im Baum | Ungemessen |
| P15 | Z1 komponieren/Synthese | `claim.mol.z1_compose` | ≥2 cited claims → COMMIT `Composed` + `synthesis.composed_from`; missing → REFUSE `compose_missing`; never laundered as Deterministic/RetrievedCited alone. | keine | Ungemessen |
| P16 | Agent-Postfach-Schleife | `claim.mol.agent_mailbox` | Ziel/Nachricht/Aktion → schließen → commit|refuse + Empfang im Transkript; Demo trifft Formel/Zitat/Komposition COMMIT und voi/settle_refuse REFUSE; Modell kalt; Messungsflags halten. | keine | Unmetered |
| P17 | Bitemporaler Zustand + Speicher | `claim.mol.bitemporal_memory` | Schreibt nur bei Mischung von Limits schließen COMMIT; Mutieren verweigern / frei-form erinnern → REFUSE; abrufen → `RetrievedCited` + `memory:` zitieren; unbekannt → `memory_unknown`. | keine | Unmetered |
| P18 | Fabric-Routing + Software-Referenzinventar | `claim.mol.fabric_soft_ref` | Offline-Inventar gültig (`source=software_ref`, Cpu immer); Lookup/Formula→Cpu; Settle→ThermoSettle|Cpu; Modell→Gpu* oder REFUSE `fabric_unavailable`; erkennen ≠ gemessene Joule. | Live wgpu-Präsenz optional / nicht erforderlich für Beweis | Unmetered |
| P19 | Desktop-Shell headless | `claim.mol.desktop_headless` | `ShellSession` fragen/schließen → Empfangsansicht (zone/fabric/limit/estimated_j/`measured_j=None`); Joule-Ledger; VoI verweigern; GUI nicht erforderlich. | egui GUI optional | Unmetered / Estimated |
| P20 | OS-Meter-Labels | `claim.mol.os_meter_honesty` | Funktion aus / VM / keine Berechtigung → `measured_j=None`, leere Komponenten, `measure_source=unavailable`; Vorrichtungen stempeln gekennzeichnete Quellen; Standard schließen bleibt unmetered. | Live-Sonde optional (`energy-meter`) | Unmetered (Standard) / Metered nur wenn Sonde zurückgibt |
| P21 | WASM-Kapsel zertifizieren | `claim.mol.wasm_capsule` | `add.wasm` unter Stub-Laufzeit; Kraftstoff → nur estimated_j; FS/net Gewährung / Kraftstoff überschreitung / Host-Share → REFUSE; schließen stempelt Kapsel. | Optionale `wasmtime`-Funktion | Unmetered / Estimated (Kraftstoff) |
| P22 | Agent-Lane-Sitzungsweg | `claim.mol.agent_lane` | Lane-Partitionen; `host_invoke` ohne Herkunft verweigert; Schlüsselwort bestätigen unzureichend; benötigt `GrantReceipt`; erlaubt Stempel `AgentLaneReceipt`. | keine | Unmetered |
| P23 | Multi-Fabric-Compute-Beleg | `claim.mol.fabric_compute_receipt` | Software-Referenzinventar; `ComputeFabric` / `ScheduleDecision` / `ComputeStepReceipt` mit `fabric_id`; Kaskadenstempel `fabric:route`; CPU-Formel COMMIT; Modellrest kann `fabric_unavailable`; `measured_j=None` auf Software-Referenzpfad. | keine | Unmetered |
| P23b | Live-Fabric-Soft | `claim.mol.fabric_live_soft` | Funktion aus bleibt software_ref; Mock/live Metal kann `gpu_metal` stempeln; Formel bleibt Cpu; fehlendes Gpu* fail-closed; Beweis erfordert keinen GPU; `measured_j=None` außer wenn gemessen. | Soft / optional erkennen | Unmetered |
| P23c | wgpu / Metal kleiner Kernel | `claim.mol.kernel_vector_add` | Clean-room WGSL Vektor-Addition; weiche Stub offline (gleiche Prüfsumme); Gpu* versieht `kernel:vector_add` + `execution_proof` mit Stempeln; optional kann ein überlappendes Messgerät das Paket `measured_j` mit `energy_honesty=measured` (Feldname) stempeln; keine Schienen-Summen-Joule-Pakete. | Live Metal optional; Vorrichtung OK für Beweis | Ungemessen (Standard) / Gemessen nur wenn Messgerät zurückgibt |
| P24 | Ecosystem e2e zertifizieren (ein Beleg) | `claim.mol.ecosystem_e2e` | Strecke → Gewebe (Cpu-Software-Referenz) → WASM → Energielabels (geschätzter Brennstoff; optionaler meter_sample) → Host ruft nur mit `GrantReceipt` auf → commit|refuse auf **einem** Beleg; refuse-without-grant → `grant_receipt_required`. | keine | Ungemessen / Geschätzt |

Außerhalb des Harness: Live-Energiezähler (RAPL, NVML) als Standardabschluss, Live-GPU-Erkennung, geräteeigene Zertifikathardware, trainierte Modellgewichte und Silizium-Messer für Gap-Zellen. Keine wird beansprucht.

<div id="ii51-phase-1-micro-perception-on-the-arena-a11-a14" class="anchor-alias" aria-hidden="true"></div>

### II.5.1 Phase-1-Mikrowahrnehmung auf der Arena (A11, A14)

Die Arena bewertet die Kaskade bei typisierten Aufgaben (Entscheidung, Ticket‑Abschluss, Risiko) gegenüber einer immer‑Modell‑Basislinie und einer kleinen Blatt‑Basislinie. Typisierte Basislinien laufen mit `phase1=false`. Mit `phase1=true` wird ein unstrukturierter Ticket‑, Risiko‑ oder Entscheidungs‑String zuerst durch den In‑Tree‑Regel‑AST‑Transducer (`mol phase1`) geleitet und erst danach in die Kaskade eingespeist; nicht erkannte Eingaben werden abgelehnt, sodass der Transducer niemals als Modell verwendet wird und Model LAST zuletzt bleibt. Im software‑Referenzlauf vom 2. Oktober 2026 (n = 36, America/New_York) schloss die Kaskade 36 von 36 korrekt ab und lehnte 5 von 5 Sättigungsfällen ab, während die immer‑Modell‑Basislinie und die Blatt‑Basislinie jeweils 28 von 36 und 0 von 5 bei Sättigung erreichten. Der mittlere geschätzte Energieverbrauch lag bei etwa 2.1e-11 Joule für die Kaskade, 5.0e-1 für die immer‑Modell‑Basislinie und 2.5e-4 für die Blatt‑Basislinie. Dabei handelt es sich um Katalogschätzungen; `measured_j` ist nicht gesetzt, und die Zahlen stammen aus der eigenen veröffentlichten Tabelle der Referenz, nicht aus einem erneuten Durchlauf für dieses Papier.

<div id="ii52-tier-1-os-meters-a13" class="anchor-alias" aria-hidden="true"></div>

### II.5.2 Tier-1-OS-Messungen (A13)

Ein optionales Build‑Feature fügt paketweite Sonden hinzu, sodass `measured_j` nur aus einer echten Messung gefüllt wird: Linux RAPL (Power‑Cap‑`energy_uj`‑Delta), NVIDIA (`nvidia-smi`‑Leistung multipliziert mit dem Zeitfenster, oder ein energieverbrauchtes Delta, als geräte­gesamt‑GPU‑Energie) und macOS (SMC `PSTR`‑Watt multipliziert mit dem Zeitfenster, ohne sudo; der Energy‑Model‑Paket‑Kanal wird nicht verwendet und Schienen werden nie summiert). Der Test‑Aufbau läuft mit deaktiviertem Feature, sodass `measured_j` dort unbelegt bleibt. Kriterium A13 versieht RAPL‑, NVML‑ und SMC‑Fixtures mit Stempeln und verbietet das Erfinden eines Wertes aus einem Auslastungs‑Prozentsatz. Keine Abbildung Teil II ist eine Messung dieser Sonden.

<div id="ii53-primitive-distillation-a12" class="anchor-alias" aria-hidden="true"></div>

### II.5.3 Primitive Destillation (A12)

Nach einem zertifizierten Model‑LAST‑Commit fügt `mol distill` einen Lookup‑ oder Formeleintrag zu einem Store mit deterministischer Wiedergabe hinzu; ein nicht zertifizierter Vorschlag wird niemals destilliert. Ein zweiter Durchlauf des destillierten Musters schließt dann bei Lookup oder Formel, ohne Model‑LAST zu öffnen (A12). Belege behalten `estimated_j` als Schätzung gekennzeichnet.

Reproduzieren: `cargo run -p mol-cli -- prove` (43 Kriterien einschließlich A1 bis A14), `-- arena`, `-- phase1 "please close ticket as R-OK"`, `-- distill "ticket summary" --gear lookup --store product/fixtures/distill_store.json`. Code: [openIE-dev/mixture-of-limits](https://github.com/openIE-dev/mixture-of-limits).

<div id="ii6-related-work" class="anchor-alias" aria-hidden="true"></div>

## II.6. Verwandte Arbeiten

**Kaskaden und Metareasoning.** Viola und Jones (2001) führten eine Kaskade von verstärkten Klassifikatoren aus, bei der günstige Stufen die meisten Eingaben ablehnen. Russell und Wefald (1991) bewerteten jede Berechnung nach ihrem erwarteten Wert für das Entscheidungsnetz aus Kosten und stoppten, wenn keiner einen positiven Nettowert hatte. Horvitz (1987) setzte denselben Trade‑off für begrenztes Reasoning. Anytime‑Algorithmen tauschen Berechnung gegen Qualität mit einem unterbrechbaren Stopp (Dean und Boddy, 1988; Zilberstein, 1996). Model‑Cascading sendet eine Eingabe nur dann an ein größeres Modell, wenn ein kleineres unsicher ist (Varshney und Baral, 2022), und FrugalGPT stoppt, wenn ein gelernter Scorer die Antwort akzeptiert (Chen, Zaharia und Zou, 2023). Mixture of Limits unterscheidet sich in drei Punkten: Die Gänge umfassen nicht‑neuronale Mechanismen vor jedem Modell; der Stopp ist das Prädikat $C(z)$, nicht ein gelernter Score; und die Kosten werden in Joule auf einer Quittung gemessen, nicht in Dollar oder Latenz.

**Kosten über die Antwort hinaus.** Reasoning‑Modelle verbrauchen Tokens nach ihrer ersten korrekten Antwort, ohne sie zu ändern (Chen et al., 2024), und eine Umfrage sammelt Methoden, die früher stoppen (Sui et al., 2025). Spekulatives Decoding (Leviathan et al., 2023), Mixture‑of‑Depths (Raposo et al., 2024), Quantisierung (Frantar et al., 2022; Lin et al., 2024) und paginierte KV‑Caches (Kwon et al., 2023) senken die Energie eines Model‑Gangs, sobald er läuft. Sie entscheiden nicht, ob er läuft.

**Formelwiederherstellung.** AI Feynman (Udrescu und Tegmark, 2020), SINDy (Brunton et al., 2016) und PySR (Cranmer, 2023) rekonstruieren geschlossene Formen aus Daten; AlphaGeometry (Trinh et al., 2024) und AlphaProof (Hubert et al., 2025) koppeln einen Vorschlagenden mit einem symbolischen oder Lean‑Verifier. Jeder erzeugt Formel‑ oder zertifizierte Solver‑Gänge, die abgedeckte Aufgaben mit geringerer Energie als ein Generator abschließen.

**Routing zwischen Modellen.** Diese Systeme wählen, welches Modell antwortet. Keines versucht zuerst einen nicht‑neuronalen Gang oder verweigert mit einem typisierten Grund.

| System | Titel | ID | Klasse | Was es routet oder beschleunigt | Energie oder Kosten laut Bericht | Unterschied |
|---|---|---|---|---|---|---|
| **RouteLLM** | *RouteLLM: Learning to Route LLMs with Preference Data* (arXiv); ICLR 2025 venue title uses *from Preference Data* | arXiv:[2406.18665](https://arxiv.org/abs/2406.18665) · ICLR 2025 | Preference‑Router (stark↔schwach LLM) | Anfrage → starker oder schwacher LLM | Kosten / Qualität (API \$); von den Autoren berichtet | Modell↔Modell; kein Lookup/Formula‑Floor; kein typischer „refuse‑to‑commit“ |
| **PEARL** (routing) | *PEARL: Performance and energy aware routing for LLMs* | DOI:[10.1016/j.future.2025.108218](https://doi.org/10.1016/j.future.2025.108218) · FGCS 176:108218 | Energie‑bewusster Multi‑LLM‑Router | Anfrage → LLM unter Energie‑Cap (EMM sagt Energie voraus) | Autoren berichten über energie‑bewusstes Routing (GPU/Infra) | Wählt weiterhin ein Modell; Mixture of Limits kann vor einem Modell ablehnen |
| **GreenServ** | *GreenServ: Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference* | arXiv:[2601.17551](https://arxiv.org/abs/2601.17551) · ICPE 2026 | Kontext‑Bandit Multi‑LLM‑Router | Anfrage‑Features → LLM; Genauigkeit vs **gemessener GPU‑Energie** (Zeus) | **Gemessen** (GPU‑Wh der Autoren via Zeus) für ihren LLM‑Pool | Modell‑Pool‑Routing; Mixture of Limits‑Kaskade ist nicht‑neuronal zuerst |
| **VoltanaLLM** | *VoltanaLLM: Energy-Efficient and SLO-Aware Disaggregated LLM Serving via Adaptive Frequency Control and State-Space Routing* | arXiv:[2509.04827](https://arxiv.org/abs/2509.04827) | P/D‑disaggregiertes Serving + Frequenz + Zustands‑Raum‑Routing | Prefill/Decode‑Instanzen + GPU‑Frequenz unter TTFT/ITL‑SLOs | **Gemessen** (Autoren; pyNVML auf A100/GH200) bis zu ~36,3 % E2E GPU‑Energie gegenüber Max‑Freq‑Baseline (Feld‑Serving‑Ergebnis) | Routet **Instanzen desselben generativen Stacks**; Mixture of Limits kann Decode nie öffnen |
| **HCSpec** | *HCSpec: Two-Tier Horizontal Cascade Speculative Decoding for High-Efficiency Large Language Model Inference* | DOI:[10.18653/v1/2026.acl-long.353](https://doi.org/10.18653/v1/2026.acl-long.353) · ACL 2026 | Spekulatives Decoding (Entwurf↔Ziel) | Positions‑spezialisierte Entwurfs‑Kaskade → Ziel‑Verifikation | Latenz‑Beschleunigung (gegenüber EAGLE‑3 / AR) | Beschleunigt Generierung; verweigert keine Generierung bei Floors |
| **CAS-Spec** | *CAS-Spec: Cascade Adaptive Self-Speculative Decoding for On-the-Fly Lossless Inference Acceleration of LLMs* | arXiv:[2510.26843](https://arxiv.org/abs/2510.26843) · NeurIPS 2025 | Selbst‑spekulative Kaskade (DSIA‑Entwürfe) | Entwurfs‑Stufen vom Ziel (Sparsität/Quant) + DyTC | Latenz‑Beschleunigung ~1,1×‑2,3× AR (Autoren); verlustfreie Tokens | Modell‑interne Entwurfs‑Hierarchie ≠ Mixture of Limits Floors |
| **GCD** | *Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning* | arXiv:[2305.13971](https://arxiv.org/abs/2305.13971) · DOI:[10.18653/v1/2023.emnlp-main.674](https://doi.org/10.18653/v1/2023.emnlp-main.674) · EMNLP 2023 | Grammatik‑beschränktes LLM‑Decoding | Maskiere Logits zu CFG | Ungemessen / Qualitätsmetriken | Beschränkt **Tokens**; Mixture of Limits beschränkt **Commit** |

<div id="ii7-baselines-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## II.7. Baselines und Falsifikatoren

Ein Cascade‑Anspruch wird auf einem typisierten Aufgabensatz als Grenze von Joule pro Aufgabe gegenüber Abschlussrate getestet. Die Arme sind: immer das große Modell; immer das kleine Modell; ein gelernter Router (Ong et al., 2024); ein bewerteter Cascade (Chen, Zaharia und Zou, 2023); ein Selektor, der $p_i / c_i$ pro Aufgabe schätzt; und ein Orakel, das die billigste ausreichende Ausrüstung für jede Aufgabe kennt. Die feste Reihenfolge Lookup → Formula → Solver → Model behauptet die Grenze nur dort, wo ihre Kurve unter jedem Arm liegt. Die Reihenfolge wird falsifiziert bei einer Aufgabenklasse, bei der gemessenes $p_i / c_i$ nicht entlang davon abnimmt, durch die Herleitung von Abschnitt II.2. Die Harness‑Behauptungen werden falsifiziert, wenn `mol prove` nicht mit 0 beendet wird auf der angegebenen Revision.

<div id="ii8-limits" class="anchor-alias" aria-hidden="true"></div>

## II.8. Grenzen

Der Harness ist konstruktive Existenz in Software. Keine Teil‑II‑Abbildung ist ein Zählerstand: Katalog‑ und Landauer‑Energien sind Schätzungen, und `measured_j` ist auf dem Harness‑Pfad nicht gesetzt. Das Ergebnis optimaler Ordnung setzt unabhängige Getriebeausgänge voraus; korrelierte Ausfälle ändern die erwartete Energie und erfordern die vollständige Summe von Abschnitt II.2 mit bedingten Wahrscheinlichkeiten. Durchlaufwahrscheinlichkeiten $p_i$ müssen pro Aufgabenklasse geschätzt werden, und Schätzfehler verschieben die Ordnung. Der Grenzvergleich von Abschnitt II.7 wurde noch nicht durchgeführt.

<div id="ii-references" class="anchor-alias" aria-hidden="true"></div>

## II. Literaturverzeichnis

Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development* 17(6):525-532. https://doi.org/10.1147/rd.176.0525

Brunton, S. L., Proctor, J. L., and Kutz, J. N. (2016). Discovering governing equations from data by sparse identification of nonlinear dynamical systems. *PNAS* 113(15):3932-3937. https://doi.org/10.1073/pnas.1517384113

Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. arXiv:2305.05176.

Chen, X., et al. (2024). Do NOT Think That Much for 2+3=? On the Overthinking of o1-Like LLMs. arXiv:2412.21187.

CAS-Spec (2025). Cascade Adaptive Self-Speculative Decoding. NeurIPS. arXiv:2510.26843.

Cranmer, M. (2023). Interpretable Machine Learning for Science with PySR and SymbolicRegression.jl. arXiv:2305.01582.

Dean, T., and Boddy, M. (1988). An analysis of time-dependent planning. AAAI-88, 49-54.

Fedus, W., Zoph, B., and Shazeer, N. (2022). Switch Transformers. *JMLR* 23(120).

Frantar, E., et al. (2022). GPTQ. arXiv:2210.17323.

Geng, S., et al. (2023). Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning. EMNLP. https://doi.org/10.18653/v1/2023.emnlp-main.674

GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. ICPE. arXiv:2601.17551.

HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. ACL. https://doi.org/10.18653/v1/2026.acl-long.353

Horowitz, M. (2014). Computing's energy problem (and what we can do about it). ISSCC. https://doi.org/10.1109/ISSCC.2014.6757323

Horvitz, E. J. (1987). Reasoning about beliefs and actions under computational resource constraints. UAI. arXiv:1304.2759.

Howard, R. A. (1966). Information value theory. *IEEE Transactions on Systems Science and Cybernetics* 2(1):22-26. https://doi.org/10.1109/TSSC.1966.300074

Hubert, T., et al. (2025). Olympiad-level formal mathematical reasoning with reinforcement learning. *Nature*. https://doi.org/10.1038/s41586-025-09833-y

Kwon, W., et al. (2023). Efficient Memory Management for Large Language Model Serving with PagedAttention. arXiv:2309.06180.

Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development* 5(3):183-191. https://doi.org/10.1147/rd.53.0183

Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. ICML.

Lin, J., et al. (2024). AWQ. MLSys. arXiv:2306.00978.

Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. arXiv:2406.18665.

PEARL (2025). Performance and energy aware routing for LLMs. *Future Generation Computer Systems* 176:108218. https://doi.org/10.1016/j.future.2025.108218

Raposo, D., et al. (2024). Mixture-of-Depths. arXiv:2404.02258.

Russell, S., and Wefald, E. (1991). Principles of metareasoning. *Artificial Intelligence* 49:361-395. https://doi.org/10.1016/0004-3702(91)90015-C

Shazeer, N., et al. (2017). Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer. ICLR. arXiv:1701.06538.

Simon, H. A., and Kadane, J. B. (1975). Optimal problem-solving search: all-or-none solutions. *Artificial Intelligence* 6(3):235-247. https://doi.org/10.1016/0004-3702(75)90002-8

Snell, C., Lee, J., Xu, K., and Kumar, A. (2024). Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters. arXiv:2408.03314.

Sui, Y., et al. (2025). Stop Overthinking: A Survey on Efficient Reasoning for Large Language Models. arXiv:2503.16419.

Trinh, T. H., et al. (2024). Solving olympiad geometry without human demonstrations. *Nature* 625:476-482. https://doi.org/10.1038/s41586-023-06747-5

Udrescu, S.-M., and Tegmark, M. (2020). AI Feynman. *Science Advances* 6(16). https://doi.org/10.1126/sciadv.aay2631

Varshney, N., and Baral, C. (2022). Model cascading. EMNLP. https://doi.org/10.18653/v1/2022.emnlp-main.756

Viola, P., and Jones, M. (2001). Rapid object detection using a boosted cascade of simple features. CVPR. https://doi.org/10.1109/CVPR.2001.990517

VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. arXiv:2509.04827.

Zilberstein, S. (1996). Using anytime algorithms in intelligent systems. *AI Magazine* 17(3).

<div id="ii-appendix-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## II. Anhang. Reproduzierbarkeit

```bash
cargo test --workspace
cargo run -p mol-cli -- prove   # expect 43 VERIFIED lines (A1 to A14 included), exit 0
cargo run -p mol-cli -- arena   # refresh the arena table from a real run only
```
