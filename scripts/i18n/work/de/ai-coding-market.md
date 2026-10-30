<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*Version 1.1, 11. Oktober 2026. Daten und Code: [research.openie.dev/data/](/data/#economics). LaTeX-PDF: [/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf) ([Quelltext](/pdfs/latex/ai-coding-market.tex)).*

## Zusammenfassung

Prognosen besagen, dass KI-Programmierung Billionen Dollar pro Jahr wert sein wird. Dieser Essay listet auf, wer das sagt, kennzeichnet jede Zahl danach, was sie ist, und benennt die Annahmen, die die Prognosen teilen.

**In einfachen Worten**

1. Die großen Zahlen zur KI-Programmierung sind meist Vermutungen über die Zukunft, keine Zählungen von bereits verdientem Geld.
2. Fast alle nehmen an, dass jedes neue Stück Code ein großes KI-Modell braucht, das nach Wörtern bezahlt wird, für immer.
3. Wenn funktionierender Code gespeichert und wiederverwendet werden kann, sinken die Kosten einer wiederholten Arbeit gegen die Kosten des Stroms, um sie auszuführen, und diese Prognosen wären zu hoch.

## 1. Projektionen und Messungen sind verschiedene Gegenstände

Jede der folgenden Zahlen trägt eine von fünf Kennzeichnungen.

| Kennzeichnung | Bedeutung |
|---|---|
| **Projektion** | Eine Prognose oder eine Wertschätzung auf Grundlage angegebener Annahmen |
| **Vom Unternehmen gemeldet** | Eine Zahl, die ein Unternehmen über sich selbst angibt, etwa den annualisierten Umsatz (letzter Monat mal zwölf) oder eine Finanzierungsbewertung |
| **Umfrageschätzung** | Eine Marktgrößenzahl aus einer Umfrage unter Käufern |
| **Eingereicht** | Eine Zahl aus einer Einreichung bei einer Aufsichtsbehörde |
| **Gemessen** | Eine Zählung oder ein Energiewert aus einem Lauf, dessen Artefakte aufbewahrt werden. Energiewerte tragen eine von drei Kennzeichnungen: `est_j` für eine analytische Schätzung, `reported_j` für einen Zähler des Betriebssystems oder auf dem Chip, `measured_j` für ein externes Leistungsmessgerät |

Nur die letzte Zeile ist ein Beleg für die Kosten eines korrekten Ergebnisses. Die übrigen sind Belege dafür, was der Markt erwartet.

## 2. Wer was projiziert

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

### 2.2 Werkzeugumsatz und Unternehmensausgaben

| Behauptung | Zahl | Kennzeichnung | Quelle |
|---|---|---|---|
| Unternehmensausgaben für KI-Programmierwerkzeuge, 2025 | 4.0 Milliarden Dollar, 55% der KI-Ausgaben der Fachabteilungen | Umfrageschätzung | Menlo Ventures [2] |
| Unternehmensausgaben für generative KI, 2025 | 37 Milliarden Dollar | Umfrageschätzung | [2] |
| Markt für KI-Codewerkzeuge, 2026 | 9.35 Milliarden Dollar, bis 2031 auf 29.96 Milliarden Dollar | Projektion | Mordor Intelligence [3] |

Der Umsatz, den der Markt heute meldet, liegt im Milliardenbereich. Die Billion ist der Wert, den der Markt zu erfassen hofft.

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

Abbildung 2 trägt die Tokenreihe auf.

![Liniendiagramm auf logarithmischer Skala der bei Google pro Monat verarbeiteten Tokens: 9.7 Billionen im Jahr 2024, etwa 480 Billionen im Jahr 2025 und über 3.2 Billiarden im Mai 2026, vom Unternehmen gemeldet.](/figures/ai-coding-market/tokens.svg)

*Abbildung 2. Bei Google pro Monat verarbeitete Tokens. Datenabbildung, vom Unternehmen gemeldet, logarithmische Skala. Quelle: Pichai [8]; der Hinweis zur Tokennutzung stammt von Bai, Huang und Wang [9]. Eine [PNG-Kopie](/figures/ai-coding-market/tokens.png) ist verfügbar.*

### 2.5 Preis pro Token

| Behauptung | Zahl | Kennzeichnung | Quelle |
|---|---|---|---|
| Kosten eines festen Niveaus an KI-Leistung | seit 2023 um etwa 47% pro Quartal gesunken, etwa um das 13-Fache pro Jahr | Gemessene Preisreihe (fünf Benchmarks) | Epoch AI [4] |
| Preis, um einen festen Benchmarkwert zu erreichen | fällt je nach Meilenstein um das 9-Fache bis 900-Fache pro Jahr; die schnellsten Rückgänge sind die jüngsten und am wenigsten sicher von Dauer | Gemessene Preisreihe (log-lineare Anpassungen) | Epoch AI [34] |
| Inferenzkosten bei gleichwertiger Leistung | etwa um das 10-Fache pro Jahr gesunken: von 60 Dollar pro Million Tokens 2021 auf 0.06 Dollar | Schätzung | Appenzeller, a16z [20] |
| Preissenkung der DeepSeek-API, 29. September 2025 | Kosten der Entwickler "um mehr als 50% gesenkt" | Vom Unternehmen gemeldet | DeepSeek [21] |

Das 13-Fache pro Jahr aus [4] ist ein Punkt in einer weiten Spanne [34]. Der Rückgang wird von Wettbewerb und offenen Gewichten getrieben, wie die Preissenkung von DeepSeek zeigt [21]. Er braucht keine Energiebilanz. Das ist der erste der beiden Rückgänge aus Abschnitt 5. Wiederverwendung fügt einen anderen hinzu: Aufrufe pro Aufgabe.

Abbildung 3 zeichnet die beiden Preisreihen.

![Diagramm auf logarithmischer Skala des Preises pro Million Tokens bei fester Fähigkeit. Eine Schätzung von a16z fällt von 60 Dollar im Jahr 2021 auf 0.06 Dollar im Jahr 2024, etwa um das Zehnfache pro Jahr. Eine gestrichelte Steigung von Epoch AI von etwa dem Dreizehnfachen pro Jahr seit 2023 ist auf zehn Dollar im Jahr 2023 indexiert gezeichnet.](/figures/ai-coding-market/price-trend.svg)

*Abbildung 3. Preis einer festen Fähigkeitsstufe. Datenabbildung, logarithmische Skala: Die Endpunkte von a16z sind wie gedruckt [20]; die Linie von Epoch AI ist die angegebene Rate von etwa dem 13-Fachen pro Jahr seit 2023 [4], auf einen beliebigen Start indexiert, um nur die Steigung zu zeigen. Die Spanne nach Meilenstein stammt von Epoch AI [34]. Eine [PNG-Kopie](/figures/ai-coding-market/price-trend.png) ist verfügbar.*

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

Die Miete, die bedient werden muss, ist Hardwaremiete. Investitionen und Verpflichtungen dieser Größe werden über Nutzung zurückgezahlt, deren Preis über ihrer Energie liegt. Bei Aufgaben, die durch Wiederverwendung geschlossen werden können, ist diese Grundlage kleiner.

### 2.7 Belege zur Produktivität

| Studie | n | Design | Effekt | Quelle |
|---|---|---|---|---|
| a16z-Essay | Interviews | Schätzung | etwa 20% für einen einfachen Assistenten; "mindestens das Doppelte" beim erstklassigen Einsatz | [1] |
| GitHub Copilot, Aufgabe HTTP-Server | angeworbene Entwickler | Kontrolliertes Experiment | 55.8% schneller bei einer Spielzeugaufgabe | Peng et al. [27] |
| Google-Unternehmensversuch | 96 Ingenieure | Randomisierte kontrollierte Studie | etwa 21% weniger Zeit für die Aufgabe | Paradis et al. [28] |
| METR, Anfang 2025 | 16 erfahrene Open-Source-Entwickler, 246 Aufgaben | Randomisierte kontrollierte Studie | 19% langsamer mit KI | Becker et al. [25] |
| METR, Aktualisierung 2026 | neue Kohorte | Randomisierte kontrollierte Studie | die Autoren nennen die neuen Daten "ein unzuverlässiges Signal" | METR [26] |

Die gemessenen Effekte reichen von einer Verlangsamung um 19% bis zu einer Beschleunigung um 56% bei einer Spielzeugaufgabe. Beide Faktoren der Wertschätzung, die Entwicklerzahl und der Produktivitätsfaktor, sind weich. Das schwächt die Billion. Es bedeutet auch, dass jeder Wert, den billigeres Programmieren freisetzt, keine bekannte Zahl ist.

## 3. Was die Projektionen voraussetzen

Zusammen gelesen ruhen die Projektionen auf vier Annahmen. Jede ist eine Aussage über eine Richtung im Entwurfsraum, nicht über den Wert von Software.

1. **Eine Richtung: Generierung.** Jede Änderung wird von einem Modell geschrieben. Die Wertschätzung skaliert die Produktivität mit dem Modell, und die Kostenveranschaulichung bepreist jede Anfrage [1].
2. **Hohe Energie und hohe Rechenleistung.** Tokenvolumen, Strom für Rechenzentren und Investitionsausgaben sollen gemeinsam wachsen [8, 10, 11]. Die Energie pro Anfrage sinkt, und die Tokens pro Aufgabe steigen schneller [9, 10].
3. **Miete pro Token.** Umsatz wird pro Token abgerechnet oder pro Arbeitsplatz, dessen Kosten Tokens sind. Die jährlichen Tokenkosten eines Entwicklers werden in der Größenordnung eines Gehalts projiziert [1].
4. **KI für immer in der Schleife.** Aufgabe 10,000 kostet so viel wie Aufgabe 1, weil nichts, was das Modell bei Aufgabe 1 gelernt hat, bei Aufgabe 10,000 ohne das Modell läuft.

Der Essay, der die Billion nennt, nennt auch ihre Grenze: "Substitutionspreise funktionieren zwar in frühen Märkten, doch schließlich konvergieren die Kosten eines Gutes gegen seine Grenzkosten, und ebenso die Preise" [1]. Dieser Essay stimmt zu und fragt, wie hoch die Grenzkosten einer korrekten Programmieraufgabe sind.

## 4. Was eine korrekte Aufgabe kostet

Für eine Programmieraufgabe seien $C \in \{0, 1\}$ das Ergebnis ihrer Abnahmeprüfung (Tests bestehen, ein Beweis wird geprüft oder eine Ausgabe stimmt mit einer Referenz überein), $J$ die Energie, die nötig ist, um $C = 1$ zu erreichen, in Joule, $c_J$ der Energiepreis in Dollar pro Joule und $c_{\text{check}}$ die Kosten der Prüfung in Dollar. Ein Käufer bezahlt für $C = 1$, nicht für Tokens.

**Energie begrenzt die Grenzkosten.** Die Grenzkosten eines Laufs betragen mindestens $c_J J$, da der Strom gekauft werden muss. Unter Wettbewerb tendiert der Preis gegen die Grenzkosten [1, 14].

**Viel Code wird wiederverwendet.** Gurevich bewies, dass jeder sequentielle Algorithmus von einer sequentiellen abstrakten Zustandsmaschine erfasst wird: einer Menge von Zuständen und einer Übergangsregel [35]. Lopes und Kollegen maßen, dass etwa 70% des Codes auf GitHub aus Klonen zuvor erstellter Dateien besteht [36]. Wo bereits eine Lösung existiert, die die Prüfung besteht, kann eine Aufgabe geschlossen werden, indem diese Lösung abgerufen und geprüft wird, statt sie erneut zu generieren.

**Proposition E0 (Preis einer abgedeckten Aufgabe).** Eine Aufgabe heiße abgedeckt, wenn eine gespeicherte Lösung ihre Prüfung besteht. Sei $J_{\text{floor}}$ die Energie, diese Lösung abzurufen, anzuwenden und zu prüfen. Unter Wettbewerb zwischen Anbietern, deren Ergebnisse dieselbe Prüfung bestehen, tendiert der Preis einer abgedeckten Aufgabe gegen

$$p_{\text{covered}} \to c_J \, J_{\text{floor}} + c_{\text{check}}.$$

Generierung wird nur bei nicht abgedeckten Aufgaben gebraucht. Für einen Aufgabenstrom mit abgedecktem Anteil $f \in [0, 1]$ und mittleren Generierungskosten $p_{\text{gen}}$ bei nicht abgedeckten Aufgaben beträgt der erwartete Preis pro Aufgabe $\bar p = f \, p_{\text{covered}} + (1 - f) \, p_{\text{gen}}$. Der Anteil $f$ ist noch nicht gemessen (Proposition E4).

## 5. Wo die Projektionen fragil sind

**Bepreisung pro Token.** Eine durch Wiederverwendung geschlossene Aufgabe braucht keine Tokens, also verdient eine pro Token bepreiste Umsatzlinie an ihr nichts. Der gesamte Tokenumsatz auf einem Aufgabenstrom skaliert mit $1 - f$.

**Das Modell in jeder Schleife.** Wird eine einmal gefundene Lösung gespeichert und geprüft, brauchen spätere Aufgaben derselben Gestalt das Modell nicht, sodass die Modellaufrufe pro Aufgabe mit wachsendem $f$ sinken. Ob sie das bei realer Arbeit tun, misst Proposition E3.

**Energie pro Aufgabe.** Eine mittlere Textanfrage an einen Produktionsassistenten wird von ihrem Betreiber mit 0.24 Wh gemessen, also 864 J [12], und die IEA setzt Reasoning- und agentische Anfragen beim Hundert- oder Tausendfachen der Energie einer einfachen an [10]. Keine öffentliche Messung vergleicht Generierung und Abruf auf denselben Aufgaben, daher wird hier kein Verhältnis angegeben.

**Zwei Rückgänge multiplizieren sich.** Man schreibe die Kosten pro Aufgabe als $p = n \cdot q$, mit $n$ Modellaufrufen pro Aufgabe und $q$ Dollar pro Aufruf. Der Preis pro Aufruf bei fester Leistung fällt je nach Aufgabe um den Faktor 9 bis 900 pro Jahr [4, 34]. Wiederverwendung senkt $n$. Eine Projektion, die das Tokenvolumen extrapoliert, modelliert nur $q$.

**Bündelung.** Ein Gut, dessen Grenzkosten nahe null liegen und das ein Werkzeug ergänzt, das die Menschen bereits haben, wird tendenziell in dieses Werkzeug gebündelt, und sein eigener Preis verschwindet [13, 14]. Nalebuff zeigte, dass ein Bündel den Markteintritt versperren kann [32], und Adams und Yellen, dass es über den Preis diskriminieren kann [33]; Spolsky beschrieb die Strategie, ein Komplement zur Massenware zu machen [31]. Preisänderungen sind sichtbar: GitHub stellte die Einzelpläne von Copilot ab dem 1. Juni 2026 auf nutzungsbasierte Abrechnung um [30], und Cursor stellte Pro 2025 von Anfragelimits auf durchgereichte API-Preise um [18].

**Was bestehen bleibt.** Die Wertschätzung aus Abschnitt 2.1 kann zutreffen. Fragil ist die Annahme, der Wert werde als Gebühr auf Generierung erhoben, da diese Gebühr nur auf den Anteil $1 - f$ anfällt.

## 6. Nachfrage

Billigere Aufgaben können die Gesamtnachfrage erhöhen. Der Risikokapitalessay erwartet das: "wir glauben, dass Jevons Paradoxon in diesem Fall gilt" [1]. Zwei Effekte sind zu trennen. Die Nachfrage nach einer Aufgabe endet, sobald $C = 1$ gilt. Die Gesamtnutzung kann dennoch wachsen, weil billigere Arbeit neue Aufgaben eröffnet. Die einzige veröffentlichte Elastizität ist klein. Über die Aufgaben in Anthropics API-Stichprobe hinweg geht jede Kostensteigerung um 1% mit einem Rückgang der Nutzungshäufigkeit um 0.29% einher, eine Elastizität von $\varepsilon \approx -0.29$ [29]. Das ist ein Querschnitt über Aufgaben, keine Preisänderung über die Zeit. Mit $|\varepsilon| < 1$ senkt ein Preisrückgang auf einer festen Aufgabenmenge den Umsatz, da sich der Umsatz $R = pQ$ um $dR/R = (1 + \varepsilon)\, dp/p$ ändert.

## 7. Propositionen und Protokolle

**Proposition E1 (die Kostenkurven kreuzen sich).** Für einen Strom von Aufgaben in einem Repository fallen die kumulierten Kosten pro gelöster Aufgabe einer Methode, die geprüfte Lösungen speichert und wiederverwendet, nach endlich vielen Aufgaben unter die einer Methode, die jede Änderung generiert. *Protokoll:* beide auf demselben Issue-Strom unter einem externen Leistungsmessgerät ausführen. `measured_j` und Dollar pro gelöster Aufgabe nach Aufgabenindex berichten, dazu den Kreuzungsindex.

**Proposition E2 (der Preis folgt der Untergrenze).** Wo eine Programmierfähigkeit durch Abruf und Regeln geschlossen werden kann, fällt ihr Listenpreis gegen $c_J J_{\text{floor}} + c_{\text{check}}$. *Protokoll:* die Listenpreise einer solchen Fähigkeitsklasse über die Zeit gegen ihre gemessene Laufenergie verfolgen.

**Proposition E3 (der Tokenanteil an den Kosten).** In einem Repository mit wachsender Wiederverwendung fällt der Anteil der Aufgabenkosten, der als Tokens bezahlt wird. *Protokoll:* Tokens, Joule und Dollar pro geschlossener Aufgabe nach Runde protokollieren und den Tokenanteil an den Kosten nach Runde berichten.

**Proposition E4 (Abdeckung).** Der abgedeckte Anteil $f$ des realen Volumens an Programmieraufgaben ist messbar. *Protokoll:* eine Zufallsstichprobe zusammengeführter Pull Requests aus öffentlichen Repositories ziehen (GitHub meldet 518.7 Millionen zusammengeführte in einem Jahr [17]), jeden auf eine abgerufene Lösung prüfen, die die Tests des Repositorys besteht, und $f$ mit einem 95%-Wilson-Intervall berichten.

## Literatur
