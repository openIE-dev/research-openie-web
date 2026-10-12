---
title: "Der versprochene Billionen-Dollar-Markt für KI-Programmierung"
deck: "Wer einen Billionen-Dollar-Markt für KI-Programmierung prognostiziert, was jede Prognose zählt und was jede über Energie, Tokens und Wiederverwendung annimmt."
lang: "de"
source: "ai-coding-market"
complete: true
---

<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*Version 1.1, 11. Oktober 2026. Daten und Code: [research.openie.dev/data/](/data/#economics). LaTeX-PDF: [/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf) ([Quelltext](/pdfs/latex/ai-coding-market.tex)).*

*Der ökonomische Begleittext zum Papier [Die Reality Code Engine: eine verlustfreie Form für natives, verifiziertes und energiesparendes Programmieren](/papers/rce/). Das Forschungspapier enthält die Technik, die Theorie und die Messungen. Dieser Essay ist der Ort, an dem Theorie und Ökonomie zusammentreffen.*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

Der Billionen-Dollar-Markt für KI-Programmierung ist David Charlots fundierte hyperbolische Behauptung, und die realen Projektionen bestätigen seine Größenordnung. Eine Risikokapitalschätzung beziffert den Wert der Softwareentwickler der Welt auf etwa 3 Billionen Dollar pro Jahr und nennt KI-Programmierung einen Markt, der "sogar einen Billionen-Dollar-Riesen" tragen kann [1]. Zwei Unternehmen für KI-Programmierung meldeten im Abstand von einem Jahr mehr als 1 Milliarde und mehr als 2.5 Milliarden Dollar annualisierten Umsatz [5, 6]. Ein Frontier-Labor wird mit 380 Milliarden Dollar bewertet, und sein Programmierprodukt ist sein Aushängeschild [6]. Das Tokenvolumen eines Anbieters wuchs in zwei Jahren von 9.7 Billionen auf über 3.2 Billiarden Tokens pro Monat [8]. Die Investitionsausgaben der größten Technologieunternehmen überstiegen 2025 die Marke von 400 Milliarden Dollar [10].

Jede dieser Projektionen setzt dasselbe voraus: dass der Raum der autonomen Computerautomatisierung nur eine Richtung hat. Entlang dieser Richtung steigen Energie, Rechenleistung und Entropie gemeinsam, ein Modell sitzt bei jeder Aufgabe in der Schleife, und jede Aufgabe zahlt Miete pro Token. Der Raum hat mehr Richtungen als diese. Ansätze werden entlang stetiger Achsen eingeordnet: Energie pro Aufgabe, Entropie und Determinismus, Stärke der Verifikation, Wiederverwendung und Kumulation sowie Abhängigkeit vom Modell. Es gibt viele Kombinationen, und reale Systeme mischen mehrere. Der Fehler der Erzählung ist kein einzelner Ansatz. Er ist die Annahme, dass der Raum nur eine Richtung hat.

Das [RCE-Forschungspapier](/papers/rce/) misst einen Punkt in diesem Raum, gewählt, um alle fünf Achsen zugleich zu optimieren. RCE ist ein natives Code-Ökosystem. Ein Programm wird einmal, aus der Absicht, als Form geschrieben, als verlustfreie Kodierung von Zustand, Ereignissen und reinen Übergängen, und jede Zielsprache ist eine getreue Projektion davon. Ein Zustand, den die Form nicht deklariert, kann nicht geschrieben werden, sodass ein falsches Programm am Eingang abgewiesen wird, statt später gefunden und behoben zu werden. Jede Passung, die das Tor passiert, wird gespeichert und wiederverwendet, sodass das Ökosystem kumulativ zulegt. Auf 10,000 vorregistrierten Formen mit eingefrorener Engine und 0 Modellaufrufen durchläuft jede Form die Rundreise zu identischen Bytes, jede Projektion ist deterministisch, jede fehlerhafte Eingabe wird am Eingang abgewiesen, und die Python-Projektion spielt die Referenzspur bei 9,999 nach ([RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n)). Code aus anderen Sprachen tritt durch Hebung ein, und auf gehobenem Code stellen die Reparaturgänge 520,541 von 520,821 Ein-Token-Fehlern und 63.7% von 21,320 Java-Fehlern in einer Anweisung mit 0 Modellaufrufen wieder her ([RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)). Wo RCE eine Aufgabe abdeckt, fallen die Grenzkosten der Aufgabe gegen die Energie, sie auszuführen, und ein Markt, der auf Generierung bepreist ist, verliert bei dieser Aufgabe seine Grundlage. Dieser Essay trennt die Projektionen von den Messungen, benennt, was jede Projektion voraussetzt, und zeigt, wo sie bricht.

**Gemeinsame These, einmal für alle Papiere formuliert.** Die Energie zum Ausführen ist die einzige wahre Metrik maschineller Intelligenz. Alle anderen Faktoren fallen auf null. Die Torform legt fest, was das bedeutet. Unter den Läufen, die das Vollständigkeitsprädikat $C(z)$ der Aufgabe innerhalb des angegebenen Budgets und der Frist erfüllen, werden Systeme nach Joule bis zur Fertigstellung, $J^*$, gereiht. Korrektheit, Fristen und Aufgabengröße sind das Tor, keine Terme in der Bewertung. Parameter, Tokens, Benchmarkwerte und Preise haben in der Rangfolge das Gewicht null ([Handlungsfähigkeit, Abschnitt 1](/papers/agency/#1-thesis)). Schätzungen sind nie `measured_j`.

**Der Preis, eine eigene Behauptung, für die ökonomischen Begleittexte.** Ein Preistrend ist eine eigene Behauptung und wird als solche gekennzeichnet. Epoch AI berichtet, dass die Kosten eines gegebenen Niveaus an KI-Leistung seit 2023 um etwa 47 Prozent pro Quartal gefallen sind, etwa um das 13-Fache pro Jahr (Emberson und Roodman, *The plunging price of thought*, 22. September 2026). Setzt sich dieser Trend fort, wird Energie zu den dominierenden Grenzkosten der Inferenz. Das ist ein zitierter Trend mit einer Bedingung, kein gemessener Zusammenbruch. [Rechtschreibprüfung ist global](/papers/spellcheck/) ist ein Existenzbeweis dafür, dass manche maschinelle Intelligenz zu einem gebündelten Nullpreis zur Massenware wird. Die Theorie, die diese Begleittexte verwenden, steht im [Papier zur Handlungsfähigkeit](/papers/agency/), in [Gemessene Commit-Tore](/papers/gates/) und in [Reality Code Engine](/papers/rce/).

<div id="1-projections-and-measurements-are-different-objects" class="anchor-alias" aria-hidden="true"></div>

## 1. Projektionen und Messungen sind verschiedene Gegenstände

Jede der folgenden Zahlen trägt eine von fünf Kennzeichnungen.

| Kennzeichnung | Bedeutung |
|---|---|
| **Projektion** | Eine Prognose oder eine Wertschätzung auf Grundlage angegebener Annahmen |
| **Vom Unternehmen gemeldet** | Eine Zahl, die ein Unternehmen über sich selbst angibt, etwa den annualisierten Umsatz (letzter Monat mal zwölf) oder eine Finanzierungsbewertung |
| **Umfrageschätzung** | Eine Marktgrößenzahl aus einer Umfrage unter Käufern |
| **Eingereicht** | Eine Zahl aus einer Einreichung bei einer Aufsichtsbehörde |
| **Gemessen** | Eine Zählung oder ein Energiewert aus einem Lauf, dessen Artefakte aufbewahrt werden. In RCE trägt Energie ihre eigene Kennzeichnung: `est_j`, `reported_j` oder `measured_j` |

Nur die letzte Zeile ist ein Beleg für die Kosten eines korrekten Ergebnisses. Die übrigen sind Belege dafür, was der Markt erwartet.

<div id="2-who-projects-what" class="anchor-alias" aria-hidden="true"></div>

## 2. Wer was projiziert

<div id="21-developer-value-the-trillion" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Entwicklerwert: die Billion

| Behauptung | Zahl | Kennzeichnung | Quelle |
|---|---|---|---|
| Softwareentwickler weltweit | etwa 30 Millionen (je nach Schätzung 27 Millionen bis 47 Millionen) | Projektionseingabe | Appenzeller und Li [1] |
| Wert pro Entwickler und Jahr | 100,000 Dollar (angenommen) | Projektionseingabe | [1] |
| Jährlicher wirtschaftlicher Beitrag | etwa 3 Billionen Dollar | Projektion | [1] |
| Entwickler auf GitHub | über 180 Millionen; 518.7 Millionen zusammengeführte Pull Requests im Jahr | Vom Unternehmen gemeldet | GitHub Octoverse 2025 [17] |
| Wert generativer KI über 63 Anwendungsfälle | 2.6 Billionen bis 4.4 Billionen Dollar pro Jahr; Produktivität der Softwareentwicklung 20% bis 45% der heutigen jährlichen Ausgaben der Funktion | Projektion | McKinsey [15] |
| Wirkung generativer KI auf das globale BIP | 7% über einen Zeitraum von zehn Jahren | Projektion | Goldman Sachs [16] |
| Produktivitätsgewinn durch einen einfachen Assistenten | etwa 20% | Schätzung aus Interviews | [1] |
| Produktivitätsgewinn durch einen erstklassigen Einsatz | "mindestens das Doppelte" | Schätzung "auf Grundlage anekdotischer Belege" | [1] |

Die Entwicklerzahl ist weich: 30 Millionen ist eine Schätzung für Berufstätige, und allein GitHub zählt sechsmal so viele Konten, die auf der Plattform entwickeln [17]. Der Wert pro Entwickler und der Produktivitätsfaktor sind ebenfalls weich (Abschnitt 2.7). McKinseys Schätzung von 2023 ist die ursprüngliche Billion dieses Marktes, und sie ist eine Wertschätzung über alle Funktionen [15]. Derselbe Risikokapitalessay sagt, das Ökosystem der KI-Programmierung könne "Dutzende Milliardenunternehmen und sogar einen Billionen-Dollar-Riesen tragen" [1]. Dieser Satz ist die Billion. Er ist eine Wertschätzung. Er ist keine Umsatzprognose.

<div id="22-tool-revenue-and-enterprise-spend" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Werkzeugumsatz und Unternehmensausgaben

| Behauptung | Zahl | Kennzeichnung | Quelle |
|---|---|---|---|
| Unternehmensausgaben für KI-Programmierwerkzeuge, 2025 | 4.0 Milliarden Dollar, 55% der KI-Ausgaben der Fachabteilungen | Umfrageschätzung | Menlo Ventures [2] |
| Unternehmensausgaben für generative KI, 2025 | 37 Milliarden Dollar | Umfrageschätzung | [2] |
| Markt für KI-Codewerkzeuge, 2026 | 9.35 Milliarden Dollar, bis 2031 auf 29.96 Milliarden Dollar | Projektion | Mordor Intelligence [3] |

Der Umsatz, den der Markt heute meldet, liegt im Milliardenbereich. Die Billion ist der Wert, den der Markt zu erfassen hofft.

<div id="23-company-revenue-and-valuations" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Unternehmensumsätze und Bewertungen

| Unternehmensangabe | Zahl | Datum | Kennzeichnung | Quelle |
|---|---|---|---|---|
| Annualisierter Umsatz von Cursor | über 1 Milliarde Dollar | 13. November 2025 | Vom Unternehmen gemeldet | Cursor [5] |
| Neue Preise für Cursor Pro | von Anfragelimits zu "Frontier-Modellnutzung im Wert von 20 Dollar pro Monat zu API-Preisen", mit Erstattungen für die Umstellung | Juni bis Juli 2025 | Vom Unternehmen gemeldet | Cursor [18] |
| Cursor Series D | 2.3 Milliarden Dollar bei 29.3 Milliarden Dollar Post-Money | 13. November 2025 | Vom Unternehmen gemeldet | [5] |
| Run-Rate-Umsatz von Anthropic | 14 Milliarden Dollar | 12. Februar 2026 | Vom Unternehmen gemeldet | Anthropic [6] |
| Run-Rate-Umsatz von Claude Code | über 2.5 Milliarden Dollar | 12. Februar 2026 | Vom Unternehmen gemeldet | [6] |
| Anthropic Series G | 30 Milliarden Dollar bei 380 Milliarden Dollar Post-Money | 12. Februar 2026 | Vom Unternehmen gemeldet | [6] |

Anthropic erklärt, dass die Runde "Infrastrukturerweiterungen" finanziert [6]. Umsatz, Bewertung und Rechenleistung sind eine einzige Wette.

Abbildung 1 setzt die Dollarbeträge der Abschnitte 2.1 bis 2.3 und 2.6 auf eine Achse, markiert mit der Kennzeichnung, die jede Quelle trägt.

![Punktdiagramm auf logarithmischer Skala der Dollarbeträge aus den Tabellen des Essays. Projektionen: Beitrag der Entwickler etwa 3 Billionen Dollar, Wert generativer KI 2.6 bis 4.4 Billionen, weltweite KI-Ausgaben 1.5 Billionen, Markt für KI-Code-Werkzeuge 9.35 Milliarden im Jahr 2026 und 29.96 Milliarden im Jahr 2031. Schätzung: Investitionen über 400 Milliarden. Umfrageschätzungen: Unternehmensausgaben für generative KI 37 Milliarden und Ausgaben für KI-Programmierwerkzeuge 4.0 Milliarden. Von Unternehmen gemeldet: Jahresumsatzrate von Claude Code über 2.5 Milliarden und von Cursor über 1 Milliarde.](/figures/ai-coding-market/spend-by-label.svg)

*Abbildung 1. Dollarbeträge nach Kennzeichnung. Datenabbildung, logarithmische Skala. Quellen: Appenzeller und Li [1], Menlo Ventures [2], Mordor Intelligence [3], Cursor [5], Anthropic [6], IEA [10], McKinsey [15], Gartner [24]. Eine [PNG-Kopie](/figures/ai-coding-market/spend-by-label.png) ist verfügbar.*

<div id="24-inference-tokens-and-unit-economics" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Inferenz, Tokens und Stückkosten

| Behauptung | Zahl | Kennzeichnung | Quelle |
|---|---|---|---|
| Von Google verarbeitete Tokens pro Monat | 9.7 Billionen (2024), etwa 480 Billionen (2025), über 3.2 Billiarden (Mai 2026) | Vom Unternehmen gemeldet | Pichai [8] |
| Googles interne KI-Entwicklerwerkzeuge | eine halbe Billion Tokens pro Tag im März 2026, mehr als drei Billionen pro Tag im Mai | Vom Unternehmen gemeldet | [8] |
| Kosten einer agentischen Programmieranfrage zu Listenpreisen | 2.50 Dollar: ein Kontext von 100,000 Tokens und 10,000 Ausgabetokens zu 15 und 75 Dollar pro Million Tokens | Veranschaulichung | Appenzeller und Li [1] |
| Dasselbe bei 3 Anfragen pro Stunde, 7 Stunden pro Tag, 200 Tagen | etwa 10,000 Dollar pro Jahr und Entwickler | Veranschaulichung | [1] |
| Tokens beim agentischen Programmieren gegenüber Code-Reasoning und Code-Chat | etwa 1,000-mal mehr; Läufe derselben Aufgabe unterscheiden sich um bis zum 30-Fachen; höherer Tokenverbrauch "führt nicht zu höherer Genauigkeit" | Gemessen (acht Modelle, SWE-bench Verified) | Bai, Huang und Wang [9] |
| Nettoverluste aus Microsofts Beteiligung an OpenAI, Quartal zum 30. September 2025 | 4.1 Milliarden Dollar vor Steuern, sein Anteil nach der Equity-Methode, im sonstigen Aufwand; eine Minderung des Nettoergebnisses um 3.1 Milliarden Dollar (0.41 Dollar je verwässerter Aktie) | Eingereicht und vom Unternehmen gemeldet | Microsoft Form 10-Q [7]; Microsoft FY26 Q1 performance [19] |

Zwei Sätze in den Quellen benennen die Ökonomie unverblümt. Pichai: "viele Unternehmen sprengen bereits ihre jährlichen Tokenbudgets, und es ist erst Mai" [8]. Appenzeller und Li: "Jahrzehntelang waren die Kosten der Softwareentwicklung fast reine Personalkosten, doch jetzt fügen LLMs einen erheblichen Anteil an Betriebskosten hinzu" [1].

Abbildung 2 trägt die Token-Reihe auf.

![Liniendiagramm auf logarithmischer Skala der bei Google pro Monat verarbeiteten Token: 9.7 Billionen im Jahr 2024, etwa 480 Billionen im Jahr 2025 und über 3.2 Billiarden im Mai 2026, vom Unternehmen gemeldet.](/figures/ai-coding-market/tokens.svg)

*Abbildung 2. Bei Google pro Monat verarbeitete Token. Datenabbildung, vom Unternehmen gemeldet, logarithmische Skala. Quelle: Pichai [8]; der Hinweis zur Token-Nutzung stammt von Bai, Huang und Wang [9]. Eine [PNG-Kopie](/figures/ai-coding-market/tokens.png) ist verfügbar.*

<div id="25-price-per-token" class="anchor-alias" aria-hidden="true"></div>

### 2.5 Preis pro Token

| Behauptung | Zahl | Kennzeichnung | Quelle |
|---|---|---|---|
| Kosten eines festen Niveaus an KI-Leistung | seit 2023 um etwa 47% pro Quartal gesunken, etwa um das 13-Fache pro Jahr | Gemessene Preisreihe (fünf Benchmarks) | Epoch AI [4] |
| Preis, um einen festen Benchmarkwert zu erreichen | fällt je nach Meilenstein um das 9-Fache bis 900-Fache pro Jahr; die schnellsten Rückgänge sind die jüngsten und am wenigsten sicher von Dauer | Gemessene Preisreihe (log-lineare Anpassungen) | Epoch AI [34] |
| Inferenzkosten bei gleichwertiger Leistung | etwa um das 10-Fache pro Jahr gesunken: von 60 Dollar pro Million Tokens 2021 auf 0.06 Dollar | Schätzung | Appenzeller, a16z [20] |
| Preissenkung der DeepSeek-API, 29. September 2025 | Kosten der Entwickler "um mehr als 50% gesenkt" | Vom Unternehmen gemeldet | DeepSeek [21] |

Das 13-Fache pro Jahr aus [4] ist ein Punkt in einer weiten Spanne [34]. Der Rückgang wird von Wettbewerb und offenen Gewichten getrieben, wie die Preissenkung von DeepSeek zeigt [21]. Er braucht keine Energiebilanz. Das ist der erste Rückgang aus Abschnitt 6. Wiederverwendung fügt einen anderen hinzu: Aufrufe pro Aufgabe.

Abbildung 3 zeichnet die beiden Preisreihen.

![Diagramm auf logarithmischer Skala des Preises pro Million Token bei fester Fähigkeit. Eine Schätzung von a16z fällt von 60 Dollar im Jahr 2021 auf 0.06 Dollar im Jahr 2024, etwa um das Zehnfache pro Jahr. Eine gestrichelte Steigung von Epoch AI von etwa dem Dreizehnfachen pro Jahr seit 2023 ist auf zehn Dollar im Jahr 2023 indexiert gezeichnet.](/figures/ai-coding-market/price-trend.svg)

*Abbildung 3. Preis einer festen Fähigkeitsstufe. Datenabbildung, logarithmische Skala: Die Endpunkte von a16z sind wie gedruckt [20]; die Linie von Epoch AI ist die angegebene Rate von etwa dem 13-Fachen pro Jahr seit 2023 [4], auf einen beliebigen Start indexiert, um nur die Steigung zu zeigen. Die Spanne nach Meilenstein stammt von Epoch AI [34]. Eine [PNG-Kopie](/figures/ai-coding-market/price-trend.png) ist verfügbar.*

<div id="26-energy-and-capital" class="anchor-alias" aria-hidden="true"></div>

### 2.6 Energie und Kapital

| Behauptung | Zahl | Kennzeichnung | Quelle |
|---|---|---|---|
| Strom für Rechenzentren, 2024 | etwa 415 TWh, etwa 1.5% des weltweiten Stroms | Schätzung | IEA, *Energy and AI* [11] |
| Strom für Rechenzentren, 2030 | etwa 945 TWh, Basisszenario | Projektion | [11] |
| Strom für Rechenzentren, 2025 bis 2030 | 485 TWh bis 950 TWh, etwa 3% der weltweiten Nachfrage | Schätzung und Projektion | IEA, *Key Questions on Energy and AI* [10] |
| Investitionsausgaben der größten Technologieunternehmen | über 400 Milliarden Dollar 2025, für 2026 ein weiterer Anstieg um 75% erwartet | Gemeldet und projiziert | [10] |
| Investitionsausgaben von Alphabet | 31 Milliarden Dollar 2022; für 2026 etwa 180 bis 190 Milliarden Dollar erwartet | Vom Unternehmen gemeldet und Prognose | Pichai [8] |
| Energie pro Aufgabe | um mindestens eine Größenordnung pro Jahr gesunken; Reasoning und agentische Aufgaben verbrauchen "Hunderte oder Tausende Male mehr Energie pro Anfrage als einfache Textgenerierung" | Schätzung | [10] |
| Eine mittlere Textanfrage an einen Produktionsassistenten | 0.24 Wh | Vom Betreiber gemessen | Elsworth et al. [12] |
| Stargate | 500 Milliarden Dollar über vier Jahre für KI-Infrastruktur eines Labors, 100 Milliarden Dollar sofort eingesetzt | Vom Unternehmen angekündigt | OpenAI [22] |
| Weltweite KI-Ausgaben, 2025 | etwa 1.5 Billionen Dollar | Projektion | Gartner [24] |
| Umsatz, den die Investitionen wieder einspielen müssen | "AI's \$600B question" | Analyse | Sequoia Capital [23] |

Die Miete, die bedient werden muss, ist Hardwaremiete. Investitionen und Verpflichtungen dieser Größe werden über Nutzung zurückgezahlt, deren Preis über ihrer Energie liegt. Das ist die Grundlage, die Wiederverwendung bei abgedeckten Aufgaben beseitigt.

Abbildung 4 stellt den projizierten Netzstrom neben die gemessenen Joule einer Aufgabe.

![Zwei Felder. Feld a: Strom für Rechenzentren, 415 TWh im Jahr 2024 nach Schätzung der IEA, eine Spanne von 485 bis 950 TWh für 2025 bis 2030 und 945 TWh projiziert für 2030. Feld b, logarithmische Skala: ein mittlerer Text-Prompt, von seinem Betreiber mit 0.24 Wh oder 864 Joule gemessen; von RCE gelöste Reparaturaufgaben mit 0.10 bis 0.40 Joule geschätzt und 0.026 bis 0.056 Joule auf einem RAPL-Paketzähler.](/figures/ai-coding-market/energy.svg)

*Abbildung 4. Energie am Netz und bei der Aufgabe. Datenabbildung. Feld a: Schätzung und Projektion der IEA [10, 11]. Feld b, logarithmische Skala: ein mittlerer Text-Prompt, 0.24 Wh vom Betreiber gemessen [12]; von RCE gelöste Reparaturaufgaben, `est_j` und `reported_j` ([RCE §6.3](/papers/rce/#63-energy)). Die beiden Felder haben verschiedene Einheiten und werden nicht ineinander umgerechnet. Eine [PNG-Kopie](/figures/ai-coding-market/energy.png) ist verfügbar.*

<div id="27-productivity-evidence" class="anchor-alias" aria-hidden="true"></div>

### 2.7 Belege zur Produktivität

| Studie | n | Design | Effekt | Quelle |
|---|---|---|---|---|
| a16z-Essay | Interviews | Schätzung | etwa 20% für einen einfachen Assistenten; "mindestens das Doppelte" beim erstklassigen Einsatz | [1] |
| GitHub Copilot, Aufgabe HTTP-Server | angeworbene Entwickler | Kontrolliertes Experiment | 55.8% schneller bei einer Spielzeugaufgabe | Peng et al. [27] |
| Google-Unternehmensversuch | 96 Ingenieure | Randomisierte kontrollierte Studie | etwa 21% weniger Zeit für die Aufgabe | Paradis et al. [28] |
| METR, Anfang 2025 | 16 erfahrene Open-Source-Entwickler, 246 Aufgaben | Randomisierte kontrollierte Studie | 19% langsamer mit KI | Becker et al. [25] |
| METR, Aktualisierung 2026 | neue Kohorte | Randomisierte kontrollierte Studie | die Autoren nennen die neuen Daten "ein unzuverlässiges Signal" | METR [26] |

Die gemessenen Effekte reichen von einer Verlangsamung um 19% bis zu einer Beschleunigung um 56% bei einer Spielzeugaufgabe. Beide Faktoren der Wertschätzung, die Entwicklerzahl und der Produktivitätsfaktor, sind weich. Das schwächt die Billion. Es schwächt auch jede Behauptung, der Wert, den Wiederverwendung freisetzt, sei eine bekannte Zahl.

<div id="3-what-the-projections-assume" class="anchor-alias" aria-hidden="true"></div>

## 3. Was die Projektionen voraussetzen

Zusammen gelesen ruhen die Projektionen auf vier Annahmen. Jede ist eine Aussage über eine Richtung im Entwurfsraum, nicht über den Wert von Software.

1. **Eine Richtung: Generierung.** Jede Änderung wird von einem Modell geschrieben. Die Wertschätzung skaliert die Produktivität mit dem Modell, und die Kostenveranschaulichung bepreist jede Anfrage [1].
2. **Hohe Energie und hohe Rechenleistung.** Tokenvolumen, Strom für Rechenzentren und Investitionsausgaben sollen gemeinsam wachsen [8, 10, 11]. Die Energie pro Anfrage sinkt, und die Tokens pro Aufgabe steigen schneller [9, 10].
3. **Miete pro Token.** Umsatz wird pro Token abgerechnet oder pro Arbeitsplatz, dessen Kosten Tokens sind. Die jährlichen Tokenkosten eines Entwicklers werden in der Größenordnung eines Gehalts projiziert [1].
4. **KI für immer in der Schleife.** Aufgabe 10,000 kostet so viel wie Aufgabe 1, weil nichts, was das Modell bei Aufgabe 1 gelernt hat, bei Aufgabe 10,000 ohne das Modell läuft.

Der Essay, der die Billion nennt, nennt auch ihre Grenze: "Substitutionspreise funktionieren zwar in frühen Märkten, doch schließlich konvergieren die Kosten eines Gutes gegen seine Grenzkosten, und ebenso die Preise" [1]. Dieser Essay stimmt zu und fragt, wie hoch die Grenzkosten einer korrekten Programmieraufgabe sind.

<div id="4-the-theory-that-prices-the-task" class="anchor-alias" aria-hidden="true"></div>

## 4. Die Theorie, die die Aufgabe bepreist

Das [RCE-Forschungspapier](/papers/rce/) liefert drei Ergebnisse, die die Frage in eine Größe verwandeln.

**Korrektheit ist das Tor.** Eine Aufgabe ist erledigt, wenn ihr Vollständigkeitsprädikat $C(z)$ gilt: ihre Tests bestehen, ein Beweis existiert oder eine Übereinstimmungsspur passt ([RCE §1](/papers/rce/#1-thesis)). Ein Käufer bezahlt für $C(z) = 1$, nicht für Tokens.

**Joule sind die Rangfolge.** Unter den Systemen, die das Tor passieren, gewinnt dasjenige mit den wenigsten Joule bis zur Fertigstellung, $J^*$ ([Handlungsfähigkeit §1](/papers/agency/#1-thesis)). In einem Wettbewerbsmarkt konkurrieren Anbieter, die dasselbe Tor passieren, über die Kosten, und die Kostenuntergrenze einer Aufgabe ist die Energie, sie fertigzustellen, plus der Preis des Beweises.

**Die Form wird einmal geschrieben und wiederverwendet.** Ein Programm im Ökosystem wird einmal, aus der Absicht, als Form geschrieben, und jedes Ziel ist eine Projektion davon, sodass die Kosten einer Passung einmal bezahlt werden und jede spätere Nutzung am Boden des Handlers läuft ([RCE §1](/papers/rce/#1-thesis)). **Die meisten Passungen existieren bereits.** Ein Programm ist ein Tupel $P = (S, E, \delta, D, \lambda)$, und nach Gurevichs Satz über abstrakte Zustandsmaschinen hat jeder sequentielle Algorithmus diese Gestalt ([RCE §3](/papers/rce/#3-the-form)). Programme unterscheiden sich in der Passung, und die meisten Passungen existieren bereits: "70% des Codes auf GitHub besteht aus Klonen zuvor erstellter Dateien" ([RCE §7](/papers/rce/#7-reuse-evidence)). Gleichwertige Passungen passieren dasselbe Tor, also wählt die Extraktion diejenige mit den wenigsten Joule (RCE Proposition 3).

**Proposition E0 (Preis einer abgedeckten Aufgabe).** Eine Aufgabe heiße abgedeckt, wenn eine gespeicherte Passung ihr Tor passiert. Unter den Anbietern, die das Tor passieren, treibt der Wettbewerb den Preis einer abgedeckten Aufgabe gegen $c_J \cdot J^*_{\text{floor}} + c_{\text{proof}}$, wobei $c_J$ der Preis eines Joule ist, $J^*_{\text{floor}}$ die Energie, die Passung abzurufen, anzuwenden und zu prüfen, und $c_{\text{proof}}$ die Kosten der Prüfung. Generierung kommt nur bei nicht abgedeckten Aufgaben ins Spiel.

Mixture of Limits ist die Philosophie hinter der Proposition: Für jede Aufgabe gibt es eine minimale Menge von allem, und alles darüber hinaus ist Verschwendung ([Gemessene Commit-Tore, Teil II](/papers/gates/#part-ii-the-cascade-mixture-of-limits)). Miete pro Token jenseits der Untergrenze stellt Verschwendung in Rechnung.

<div id="5-the-measurements" class="anchor-alias" aria-hidden="true"></div>

## 5. Die Messungen

Dies sind Messungen, so gekennzeichnet, wie RCE sie kennzeichnet. Sie stammen aus dem [RCE-Forschungspapier](/papers/rce/). Die ersten Zeilen messen das Ökosystem selbst; die folgenden Zeilen messen die Reparatur von Code, der aus anderen Sprachen gehoben wurde ([RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)).

| Messung | Ergebnis | Kennzeichnung | Wo |
|---|---|---|---|
| Form-Ökosystem, 10,000 vorregistrierte Formen, verlustfreie Rundreise und deterministische Projektion | 10,000 von 10,000, 0 Modellaufrufe | Gemessene Zählungen | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Form-Ökosystem, fehlerhafte Eingaben und Spezifikationen am Eingang abgewiesen | 10,000 von 10,000, 0 Modellaufrufe | Gemessene Zählungen | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Form-Ökosystem, Python-Projektion spielt die Referenzspur bytegenau nach | 9,999 von 10,000, 0 Modellaufrufe | Gemessene Zählungen | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Gehobener Code, L0 Ein-Token-Fehler, 9 reale Repositories, zurückgehaltene Testaufteilung | 520,541 von 520,821 (0.9995, 95% KI 0.9994 bis 0.9995), 0 Modellaufrufe | Gemessene Zählungen | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| Gehobener Code, L0, 4 nie zum Abstimmen genutzte Repositories | 23,015 von 23,015 (95% KI 0.9998 bis 1.0000), 0 Modellaufrufe | Gemessene Zählungen | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| Gehobener Code, L1 Java, ManySStuBs4J 2.0, zurückgehalten, ganze Datei | 13,586 von 21,320 (0.637, 0.631 bis 0.644), 0 Modellaufrufe; 9,288 von 24,072 (0.386) allein aus dem Hunk | Gemessene Zählungen | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| Gehobener Code, L1 Python, TSSB-3M v1.0.0, zurückgehalten | 27,266 von 157,089 (0.174, 0.172 bis 0.175), 0 Modellaufrufe | Gemessene Zählungen | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| Energie pro gelöster Aufgabe, alle Sprossen | 0.10 J bis 0.40 J | `est_j` (CPU-Sekunden × 10 W) | [RCE §6.3](/papers/rce/#63-energy) |
| Energie pro gelöster Aufgabe, RAPL-Teilstichprobe | 0.056 J (L0, 3,000 Aufgaben), 0.026 J (L1, 690 gelöst von 2,000); ±10 J auf Laufsummen | `reported_j` (Paketzähler abzüglich einer angegebenen Leerlaufbasis) | [RCE §6.3](/papers/rce/#63-energy) |

`measured_j` ist einem Wandmessgerät vorbehalten und in jeder Zeile leer.

<div id="6-where-the-projections-break" class="anchor-alias" aria-hidden="true"></div>

## 6. Wo die Projektionen brechen

**Miete pro Token bricht bei abgedeckten Aufgaben.** Ein als Form geschriebenes Programm wird mit 0 Tokens in jedes Ziel kompiliert: 10,000 von 10,000 vorregistrierten Formen wurden ohne einen einzigen Modellaufruf kompiliert, projiziert und passierten das Tor [RCE §2.3]. Auf gehobenem Code kaufte jede abgedeckte Reparatur ebenfalls 0 Tokens: 520,541 Ein-Token-Reparaturen und 40,852 Reparaturen einzelner Anweisungen aus realen Historien [RCE §6.1, §6.2]. Eine Umsatzlinie, die pro Token bepreist ist, verdient nichts an einer Aufgabe, die kein Token braucht.

**KI für immer in der Schleife bricht bei der Beförderung.** Das Modell wird einmal für einen neuen Fall bezahlt; das Tor lässt die Passung als Handler zu, und spätere Fälle derselben Gestalt schließen sich ohne es ([RCE §4.2](/papers/rce/#42-the-gears)). Wo das gilt, kostet Aufgabe 10,000 nicht, was Aufgabe 1 gekostet hat. Ob die Modellaufrufe pro Runde über reale Spezifikationen hinweg null erreichen, wird bei großem N durch [RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n) gemessen.

**Hohe Energie ist für ein korrektes Ergebnis nicht nötig.** Eine zurückgehaltene Reparatur passierte das Tor mit 0.026 bis 0.056 berichteten Joule pro gelöster Aufgabe auf einem Paketzähler, ohne Modell [RCE §6.3]. Eine mittlere Textanfrage an einen Produktionsassistenten wird mit 0.24 Wh gemessen, also 864 J [12]. Eine agentische Programmieraufgabe verwendet viele Anfragen, und die IEA setzt agentische Anfragen beim Hundert- oder Tausendfachen der Energie einer einfachen an [10]. Das sind verschiedene Aufgaben auf verschiedenen Maschinen, also kein Verhältnis. Sie sind eine Größenordnung, die unter Protokoll E1 zu prüfen ist.

**Abdeckung wird pro Klasse gemessen.** Die Sprossen geben Abdeckung innerhalb von Aufgabenklassen: nahezu alle Ein-Token-Fehler sowie 63.7% (Java, ganze Datei; 38.6% allein aus dem Hunk) und 17.4% (Python) der Fehler in einer Anweisung, wobei die offenen Fälle diejenigen sind, deren Absichtsbits außerhalb des Hunks liegen oder neu sind ([RCE §6.0](/papers/rce/#60-the-repair-ladder-on-lifted-code)). Der Anteil des gesamten realen Programmiervolumens, der in abgedeckte Klassen fällt, ist Proposition E5.

**Zwei Rückgänge multiplizieren sich.** Der Preis pro Aufruf fällt bei fester Leistung je nach Aufgabe um das 9-Fache bis 900-Fache pro Jahr [4, 34]. Beförderung treibt die Aufrufe pro Aufgabe bei abgedeckten Fällen auf null [RCE §8.6]. Die Kosten pro Aufgabe sind das Produkt aus beiden. Eine Projektion, die das Tokenvolumen extrapoliert, bepreist nur den ersten.

**Das Muster der Rechtschreibprüfung.** [Rechtschreibprüfung ist global](/papers/spellcheck/) dokumentiert eine Fähigkeit, deren Grenzkosten auf etwa null fielen und die ein Werkzeug ergänzte, das alle schon hatten. Sie wurde in den Editor gebündelt, und ihr eigener Preis verschwand, wie die Ökonomie der Bündelung vorhersagt [13, 14]. Eine abgedeckte Programmieraufgabe hat dieselben zwei Eigenschaften: Ihre Grenzkosten fallen auf die Untergrenze des Handlers, und sie ergänzt Editoren und Repositories, die die Menschen bereits haben. Die Vorhersage ist dieselbe: Die abgedeckte Aufgabe wird gebündelt, und bepreist bleiben der nicht abgedeckte Fall und der Beweis.

**Bündelung durch den Plattformeigner.** Das Muster der Rechtschreibprüfung hat einen Eigner. Das Bündel schnürt, wem der Editor, das Repository oder die Cloud gehört. Spolsky benannte die Taktik: Mach dein Komplement zur Massenware [31]. Nalebuff zeigte, dass ein Bündel den Markteintritt versperren kann [32], und Adams und Yellen, dass es über den Preis diskriminiert [33]. Es geschieht bereits: GitHub stellte die Einzelpläne von Copilot ab dem 1. Juni 2026 auf nutzungsbasierte Abrechnung um [30], und Cursor stellte Pro 2025 von Anfragelimits auf durchgereichte API-Preise um [18]. Eine Plattform kann die Modellschicht verschenken und die Miete in der IDE und in der Cloud behalten. Eine energiebepreiste Engine konkurriert mit einem Bündel zum Nullpreis nur dort, wo das Tor ihr offensteht: wo die Tests, der Beweis und der Beleg dem Käufer gehören, nicht der Plattform.

**Eine Form anstelle vieler Sprachen.** Das RCE-Papier formuliert die These, dass eine universelle Form, mit jeder Sprache als Projektion und jedem Programm als Hebung, den Bedarf an jeder anderen Sprache ersetzt ([RCE §3.6](/papers/rce/#36-one-ecosystem-lossless-and-the-universality-thesis)). Die Lesart für den Markt ist diese. Ein großer Teil der Ausgaben, die die Projektionen zählen, ist Übersetzung zwischen Sprachen, Frameworks und ihren Versionen sowie der Abgleich auseinanderlaufender Implementierungen. In einem Ökosystem, in dem ein Programm einmal geschrieben und jedes Ziel ausgegeben wird, hat diese Ausgabe keine Aufgabe zu kaufen. Die Verbreitung ist die offene Größe, und sie ist eine Marktfrage, kein Theorem.

**Was bestehen bleibt.** Die Wertschätzung aus Abschnitt 2.1 kann zutreffen. Entwickler können mehr hervorbringen. Was bricht, ist die Behauptung, der Wert werde als Miete auf Generierung erfasst. Die Schlussfolgerung ist bedingt. Wo die Abdeckung hoch ist und die Plattform nicht bündelt, geht Wert, der bei fallenden Grenzkosten entsteht, an denjenigen, der das Tor, den Beweis und den niedrigentropischen Boden hält, und ein großer Teil davon geht an den Käufer. Wo die Plattform bündelt, sagen die Belege, dass der Inhaber des Tors die Plattform ist.

<div id="7-demand" class="anchor-alias" aria-hidden="true"></div>

## 7. Nachfrage

Billigere Aufgaben können die Gesamtnachfrage erhöhen. Der Risikokapitalessay erwartet das: "wir glauben, dass Jevons Paradoxon in diesem Fall gilt" [1]. [Aufgabensättigung versus aggregierter Rebound in der KI-Nachfrage](/papers/satiation/) trennt die beiden Effekte. Der Appetit pro Aufgabe endet am Vollständigkeitsprädikat. Die Gesamtnutzung kann dennoch wachsen, weil billigere Synthese neue Aufgaben eröffnet. Wiederverwendung verändert den ersten Effekt und lässt den zweiten offen. Ein größerer Markt abgedeckter Aufgaben ist ein Markt, dessen Grenzkosten die Untergrenze sind, nicht die Grenze des technisch Machbaren. Die einzige veröffentlichte Elastizität ist klein. Über die Aufgaben in Anthropics API-Stichprobe hinweg geht jede Kostensteigerung um 1% mit einem Rückgang der Nutzungshäufigkeit um 0.29% einher [29]. Das ist ein Querschnitt über Aufgaben, keine Preisänderung über die Zeit. So gelesen, wie sie dasteht, ist die Nachfrage unelastisch: Preisrückgänge lassen den Umsatz auf einer festen Aufgabenmenge schrumpfen, was die Lesart dieses Essays von der Miete stützt, und sie führen für sich genommen nicht dazu, dass Programmieren weit mehr genutzt wird.

<div id="8-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 8. Propositionen und Protokolle

**Proposition E1 (die Kostenkurven kreuzen sich).** Für einen Strom von Aufgaben in einem Repository fallen die kumulierten Kosten pro gelöster Aufgabe von RCE nach endlich vielen Aufgaben unter die eines Generierungsagenten. *Protokoll:* [RCE-Protokoll 8.3](/papers/rce/#83-a-wall-meter) und einen einfachen Generierungsagenten auf demselben Issue-Strom unter einem Wandmessgerät ausführen. `measured_j` und Dollar pro gelöster Aufgabe nach Aufgabenindex berichten, dazu den Kreuzungsindex.

**Proposition E2 (der Preis folgt der Untergrenze).** Wo eine Programmierfähigkeit durch Abruf und Regeln abgedeckt ist, fällt ihr Marktpreis gegen die Energie, sie auszuführen, plus die Kosten des Beweises. *Protokoll:* die Listenpreise einer abgedeckten Fähigkeitsklasse über die Zeit gegen ihre gemessene Laufenergie verfolgen, nach dem Vorbild der Preisreihe der Rechtschreibprüfung.

**Proposition E3 (Rechenskala ist bei abgedeckten Aufgaben kein Burggraben).** Bei Aufgaben, die RCE abdeckt, steigt die Lösungsrate nicht mit der Rechenleistung des letzten Gangs. *Protokoll:* [RCE-Protokoll 8.2](/papers/rce/#82-swe-bench-lite-offline) ohne Modell, mit einem kleinen lokalen Modell und mit einem Frontier-Modell als letztem Gang ausführen. Die Lösungsraten auf den Aufgaben vergleichen, die vor dem letzten Gang geschlossen wurden.

**Proposition E4 (der Tokenanteil am Umsatz).** In einem Repository mit wachsender Abdeckung fällt der Anteil der Aufgabenkosten, der als Tokens bezahlt wird, mit der Abdeckung. *Protokoll:* Tokens, Joule und Dollar pro geschlossener Aufgabe nach Runde im RCE-Konvergenzprotokoll mit einem bepreisten Modellauflöser protokollieren ([RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n)), gekennzeichnet, und den Tokenanteil an den Kosten nach Runde berichten.

**Proposition E5 (Abdeckung).** Der Anteil des realen Volumens an Programmieraufgaben, der in Klassen fällt, die RCE abdeckt, ist messbar. *Protokoll:* eine Zufallsstichprobe zusammengeführter Pull Requests aus öffentlichen Repositories ziehen (GitHub meldet 518.7 Millionen zusammengeführte in einem Jahr [17]), jeden danach klassifizieren, ob die eingefrorenen Gänge G0 bis G2 einen Patch erzeugen, der das Tor passiert, und den abgedeckten Anteil mit einem 95%-Intervall berichten. Solange diese Zahl nicht existiert, gilt Proposition E0 für einen ungemessenen Anteil.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Literatur

[1] G. Appenzeller and Y. Li, "The Trillion Dollar AI Software Development Stack," 9 October 2025. https://a16z.com/the-trillion-dollar-ai-software-development-stack/

[2] Menlo Ventures, "2025: The State of Generative AI in the Enterprise," December 2025. https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/

[3] Mordor Intelligence, "AI Code Tools Market Size, Share and 2031 Growth Trends Report," fetched 11 October 2026. https://www.mordorintelligence.com/industry-reports/artificial-intelligence-code-tools-market

[4] B. Emberson and D. Roodman, "The plunging price of thought," Epoch AI, 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

[5] Cursor, "Past, Present, and Future" (Series D announcement), 13 November 2025. https://cursor.com/blog/series-d

[6] Anthropic, "Anthropic raises \$30 billion in Series G funding at \$380 billion post-money valuation," 12 February 2026. https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation

[7] Microsoft Corporation, Form 10-Q for the quarter ended 30 September 2025, Note 3 and Item 2. https://www.sec.gov/Archives/edgar/data/789019/000119312525256321/msft-20250930.htm

[8] S. Pichai, "I/O 2026: Welcome to the agentic Gemini era," 19 May 2026. https://blog.google/innovation-and-ai/sundar-pichai-io-2026/

[9] L. Bai, Z. Huang and X. Wang, "How Do AI Agents Spend Your Money? Analyzing and Predicting Token Consumption in Agentic Coding Tasks," 2026. arXiv:2604.22750. https://arxiv.org/abs/2604.22750

[10] International Energy Agency, *Key Questions on Energy and AI*, executive summary, 2026. https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary

[11] International Energy Agency, *Energy and AI*, executive summary, April 2025. https://www.iea.org/reports/energy-and-ai/executive-summary

[12] C. Elsworth et al., "Measuring the environmental impact of delivering AI at Google Scale," 2025. arXiv:2508.15734. https://arxiv.org/abs/2508.15734

[13] Y. Bakos and E. Brynjolfsson, "Bundling Information Goods: Pricing, Profits, and Efficiency," *Management Science* 45(12), 1999. doi:10.1287/mnsc.45.12.1613

[14] C. Shapiro and H. R. Varian, *Information Rules: A Strategic Guide to the Network Economy*, Harvard Business School Press, 1998.

[15] McKinsey & Company, "The economic potential of generative AI: The next productivity frontier," June 2023. https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier

[16] Goldman Sachs, "Generative AI could raise global GDP by 7%," April 2023. https://www.goldmansachs.com/intelligence/pages/generative-ai-could-raise-global-gdp-by-7-percent.html

[17] GitHub, "Octoverse: A new developer joins GitHub every second as AI leads TypeScript to #1," 2025. https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/

[18] Cursor, "Clarifying our pricing," June 2025 pricing post. https://cursor.com/blog/june-2025-pricing

[19] Microsoft Investor Relations, FY26 Q1 Performance. https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/performance

[20] G. Appenzeller, "Welcome to LLMflation: LLM inference cost is going down fast," a16z, November 2024. https://a16z.com/llmflation-llm-inference-cost/

[21] DeepSeek, DeepSeek-V3.2-Exp release and API price reduction, 29 September 2025 (in Chinese). https://api-docs.deepseek.com/zh-cn/news/news250929

[22] OpenAI, "Announcing The Stargate Project," 21 January 2025. https://openai.com/index/announcing-the-stargate-project/

[23] D. Cahn, "AI's \$600B Question," Sequoia Capital, 2024. https://www.sequoiacap.com/article/ais-600b-question/

[24] Gartner, "Gartner Says Worldwide AI Spending Will Total \$1.5 Trillion in 2025," 17 September 2025. https://www.gartner.com/en/newsroom/press-releases/2025-09-17-gartner-says-worldwide-ai-spending-will-total-1-point-5-trillion-in-2025

[25] J. Becker, N. Rush, E. Barnes and D. Rein, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity," METR, 2025. arXiv:2507.09089. https://arxiv.org/abs/2507.09089

[26] METR, uplift study update, 24 February 2026. https://metr.org/blog/2026-02-24-uplift-update/

[27] S. Peng, E. Kalliamvakou, P. Cihon and M. Demirer, "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot," 2023. arXiv:2302.06590. https://arxiv.org/abs/2302.06590

[28] E. Paradis, K. Grey, Q. Madison et al., "How much does AI impact development speed? An enterprise-based randomized controlled trial," 2024. arXiv:2410.12944. https://arxiv.org/abs/2410.12944

[29] Anthropic, "Anthropic Economic Index report: Uneven geographic and enterprise AI adoption," September 2025. https://www.anthropic.com/research/anthropic-economic-index-september-2025-report

[30] GitHub Japan blog, "GitHub Copilotの個人向けプラン: ProとPro+へのフレックス枠追加と新しいMaxプランのご紹介," 15 May 2026 (in Japanese). https://github.blog/jp/2026-05-15-github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/

[31] J. Spolsky, "Strategy Letter V," Joel on Software, 12 June 2002. https://www.joelonsoftware.com/2002/06/12/strategy-letter-v/

[32] B. Nalebuff, "Bundling as an Entry Barrier," *Quarterly Journal of Economics* 119(1), 2004. doi:10.1162/003355304772839551

[33] W. J. Adams and J. L. Yellen, "Commodity Bundling and the Burden of Monopoly," *Quarterly Journal of Economics* 90(3), 1976. doi:10.2307/1886045

[34] Epoch AI, "LLM inference prices have fallen rapidly but unequally across tasks," data insight. https://epoch.ai/data-insights/llm-inference-price-trends
