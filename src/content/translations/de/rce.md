---
title: "Die Reality Code Engine: eine verlustfreie Form für natives, verifiziertes und energiesparendes Programmieren"
deck: "Ein Programmiersystem, in dem ein Programm einmal als Zustandsautomat geschrieben und Code in anderen Sprachen daraus erzeugt wird: seine Spezifikation, der Referenzprüfer und seine Emitter, die Lean-Beweise und registrierte Messungen der Dimension von Programmen, mit vorab festgelegten Protokollen und Falsifikatoren."
lang: "de"
source: "rce"
complete: true
---


*Version 1.24, 28. Oktober 2026. Spezifikation: [aktueller Entwurf (Entwurf 0.9)](/rce/spec/), von [openIE-dev/rce](https://github.com/openIE-dev/rce); die Anzahlen der durchgeführten Checks in [§3.7](#37-the-language-one-text-costs-and-theorem-status) befinden sich in den öffentlichen Commits, die dort genannt sind, und diejenigen bei `e416fd0` sind in [`src/data/rce-facts.json`](https://github.com/openIE-dev/research-openie-web/blob/dcharlot65-openie/src/data/rce-facts.json) aufgezeichnet. Daten und Code: [research.openie.dev/data/](/data/#rce). Spielplatz (Referenzprüfer): [openie-dev.github.io/rce](https://openie-dev.github.io/rce/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Kurzfassung

Dieser Artikel beschreibt den Reality Code Engine (RCE), ein System, in dem ein Programm einmal als Zustandsmaschine, genannt eine Form, geschrieben wird, und Code in anderen Sprachen daraus generiert wird. Er präsentiert die schriftliche Spezifikation der Sprache, den Referenzprüfer, der sie implementiert und Rust, Python, JavaScript und Scala erzeugt (die Scala-Ausgabe stimmt noch nicht mit der Referenz überein), die Lean-Beweise ihrer Sätze, registrierte Messungen der Dimension seiner Programme, das Design der Engine, die Lösungen findet, prüft und wiederverwendet, und das Design, durch das jede Sprache in die Form gehoben und daraus emittiert wird. Er beschreibt, wie die Behauptungen als falsch gezeigt werden könnten, und die Protokolle der noch zu durchführenden Messungen.

**In einfachen Worten**

1. Ein Programm wird einmal in einer präzisen Form geschrieben, und der Computer erzeugt heute aus ihr das gleiche Programm in Rust, Python und JavaScript. Das Design gilt für jede Sprache; die Tools, die andere Sprachen konvertieren würden, sind noch nicht gebaut.
2. Alles, was ein Programm tun kann, wird in seiner Form erklärt, und die Sprache verlangt, dass jeder Eingang einen erklärteten Ausgang, einen Schritt oder eine aufgezeichnete Ablehnung hat, anstatt einen unklaren, der später gefunden und behoben wird.
3. Im Design der Engine wird eine Korrektur, die die Checks besteht, gespeichert und wiederverwendet, so dass das gleiche Problem nicht zweimal Zeit oder Energie kostet.
<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. These

Autonomes Computer-Automatisierung ist ein Entwurfsraum mit vielen Punkten darin. Jeder Ansatz befindet sich irgendwo entlang fünf kontinuierlicher Achsen: die Energie, die pro korrektem Ergebnis verbraucht wird; die Entropie, die das System zur Laufzeit lösen muss, und damit, wie deterministisch seine Ausgabe ist; die Stärke der Verifikation, die ein Ergebnis akzeptiert; wie weit jedes akzeptierte Ergebnis wiederverwendet und sich verbindet; und wie sehr der Ansatz auf ein Modell zurückgreift. Ein großes Sprachmodell (LLM), ein statistisches Textmodell, das jede Änderung vom Prompt schreibt, befindet sich nahe an einer Ecke dieses Raums: Es verlässt sich auf das Modell für jede Aufgabe, zieht bei jedem Mal eine frische Stichprobe aus einer hochentropischen Verteilung und zahlt für die Generierung erneut bei jeder Aufgabe. Retrieval, Regeln, Synthese, Verifikation und Caching belegen viele andere Punkte, und reale Systeme kombinieren sie.

Der Reality Code Engine (RCE) ist ein Punkt in diesem Raum. Dieser Artikel beschreibt ihn, und die Messungen, die er berichtet, betreffen seine Sprache und die Werkzeuge der Sprache. RCE modelliert ein Programm als Datenbank-funktionalen Zustandsautomaten. Lopes und Kollegen haben gemessen, dass etwa 70 % des Codes auf GitHub aus Kopien früherer Dateien bestehen [33], also ist der Entwurf des RCE-Motors zunächst eine vorhandene Lösung abrufend, anpasst und überprüft und ruft ein Modell nur auf, wenn nichts Billigeres die Aufgabe abschließt.

**Die zentrale Aussage.** RCE ist als vollständiges Code-Ökosystem entworfen, in dem Programme aus Absicht nativ verfasst werden. Die Absicht wird einmal geschrieben, als Form: ein Zustand, eine Menge von Ereignissen und eine reine, vollständige Übergang. Die Form ist eine verlustfreie Kodierung dieser Absicht. RCE ist so entworfen, dass jede Ziel-Sprache eine Projektion der Form ist, und jede Projektion muss den Byte-für-Byte-Trace der Form wiedergeben. Heute hat der Referenzprüfer vier Emitter für Rust, Python, JavaScript und Scala, die den überprüften Syntaxbaum eines Programms übersetzen, nicht aber die Form; die Ausgaben für Rust, Python und JavaScript bestehen jeweils aus 1.459 Konformitätstests mit 0 Fehlern, und die Scala-Ausgabe stimmt noch nicht mit dem Referenzwert überein ([§4.5](#45-the-compilers)). Jeder Zustand, in dem ein Programm sich befinden kann, wird in seiner Form deklariert, und die Sprache erfordert, dass jeder Eingabe ein deklarierter Ausgang zugeordnet ist: einen Schritt, der ihn nimmt, oder eine Ablehnung durch seinen Vertrag, die den Zustand unverändert lässt und im Protokoll (T8) aufgezeichnet wird. Ein Programm, das diese Anforderungen erfüllt, kann nicht so von seiner Absicht abdriften, wie ein Programm in einer gängigen Sprache von seinen Kommentaren, seinen Tests oder anderen Implementierungen abdriften kann, und es benötigt keine Nachträgliche Differenzierung oder Fehlerverfolgung. Der Eingabe-Vertrag, der den Referenzprüfer zur Erfüllung der zweiten Anforderung am Eingang macht, ist in [§10](#10-work-to-finish) aufgelistet. Im Entwurf des Motors speichert und wiederverwendet jeder Lösung, die das Tor anwendet, und das Ökosystem verbindet sich, während es wächst ([§2.4](#24-gated-verified-recursive-self-improvement)). Code, der in anderen Sprachen geschrieben ist, ist so entworfen, dass er durch Hebung eingeht ([§6](#6-lift-entering-the-ecosystem-from-other-languages)). Der einzige öffentliche Lift heute ist ein Test für ein Go-Muster; die Hebung aller Sprachen in die Form und die Ausgabe aller Sprachen aus ihr ist das Ziel eines Vorschlags im Spezifikations-Repository, dessen Annahmeebenen sagen, wann eine Sprache als gehoben oder ausgegeben zählt ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)).

Jeder Punkt im Raum steht vor demselben Tor. Das Tor ist Richtigkeit: das Vollständigkeitsprädikat $C(z)$ einer Aufgabe, hier die Tests der Aufgabe, ein Beweis oder eine Übereinstimmungsspur. Unter den Laufzeiten, die das Tor passieren, werden Systeme nach Joules bis zur Fertigstellung, $J^*$, bewertet. Richtigkeit ist eine Einschränkung, nicht ein Score.

Im Entwurf des Motors laufen RCEs Mechanismen, die als Gänge bezeichnet werden, in Reihenfolge des Kosten, und der erste Gang, dessen Kandidat das Tor passiert, schließt die Aufgabe.

Energieangaben sind nach Quelle gekennzeichnet. `est_j` ist eine analytische Schätzung. `reported_j` ist ein Betriebssystem- oder Chip-Zähler. `measured_j` ist für eine Wand-Messung reserviert und ist in jedem Ergebnis hier leer. RCE hat keine gemessene Energieangabe: der Referenzprüfer berechnet keine Joules, seine Budgeteinheiten zählen Arbeit und sind keine Energie, und jeder `est_j` in diesem Artikel ist ein Modell. Ein Kosten mit keinem Modell wird als unverzichtet gekennzeichnet und wird nie als Null gelesen ([§4.4](#44-receipts)).

<div id="2-two-paths-to-autonomy" class="anchor-alias" aria-hidden="true"></div>
<div id="2-the-design-space-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

## 2. Der Entwurfsspielraum autonomer Codierung

![Ein Satz hinein. Eine Etage heraus. Die menschliche Absicht hat eine hohe Entropie; ein Schlauch von Konvertierungen von Absicht zu Spezifikation zu 626 Oberflächensprachen zu einer Zwischenrepräsentation zu Maschinencode verliert Informationen an jeder Grenze; alle Code erreichen einige Maschinenformen; RCE schreibt die Bedeutung einmal in einer kanonischen Form, ist darauf ausgelegt, jede Oberfläche als Projektion zu behandeln (heute Rust, Python und JavaScript passieren die Konformitätsprüfung und Scala tut es noch nicht) und die billigste korrekte Form zu ermöglichen.](/figures/rce/intent-entropy.svg)

*Abbildung 1. Absichtsentropie und die Maschinenetage. Eine [PNG-Kopie](/figures/rce/intent-entropy.png) wird bereitgestellt. Panel 6 beschreibt den Entwurf von RCE; was heute existiert, wird in [§4.5](#45-the-compilers) beschrieben. Quellen: Shannon (1951); Lopes et al. (2017); die 626-Sprachenzahl ist eine unveröffentlichte Umfrage der OpenIE-Autoren und unterstützt keine Aussage in diesem Artikel. Die Ergebnisse von Python und C sind Verhaltensweisen der Sprachspezifikation; C untersucht das Vorzeichenüberlauf als undefiniertes Verhalten.*

**Die Absicht hat eine hohe Entropie.** „Machen Sie den Checkout schneller“ trägt viele Bedeutungen: kürzere Seitenladezeit, weniger Schritte, schnellerer Kartenfreigabe, ein zwischengespeicherter Warenkorb oder schneller auf einer Gerätekategorie. Der Kontext wird impliziert und nie geschrieben. Shannon hat das gedruckte Englisch bei etwa 0,6 bis 1,3 Bit pro Buchstaben gemessen [1]. Die Buchstaben sind vorhersagbar. Die Bedeutung ist es nicht.

**Jede Konvertierung verliert Informationen.** Die Absicht wird zu einer Spezifikation, und der Kontext geht verloren. Die Spezifikation wird zu einer der hunderten Oberflächensprachen, und Alternativen und Randfälle gehen verloren. Die Quelle wird zu einer Zwischenrepräsentation (IR), und Namen, Stil und die Gründe des Autors gehen verloren. Die IR wird zu Maschinencode, und Typen werden zu Größen und Schleifen werden zu Sprüngen.

**Die Etage hat eine geringe Entropie.** Jedes Programm endet als Ladevorgänge, Speicheroperationen, Arithmetik und Sprünge. Der Zielort hat Platz für nur wenige Formen, also biegt der Code in diese Richtung. Die Konvergenz ist durch Entwurf gegeben.

**Grenzen sind der Ort, an dem Bedeutung auseinandergeht.** Die gleiche Zeile gibt unterschiedliche Antworten an den Rändern. In Python ist `-3 % 2` 1 und `-7 / 2` -3,5. In C ist `-3 % 2` -1, `-7 / 2` -3, und das Vorzeichenüberlauf ist undefiniertes Verhalten. Ein System, das Code an jeder Grenze neu generiert, rät an jeder Grenze.

**Die Achsen, als Größen ausgedrückt.**

| Achse | Eine Seite | Andere Seite | Wo sich der Entwurf von RCE befindet |
|---|---|---|---|
| Energie pro korrektem Ergebnis | Wiederholt vollständig bezahlt bei jeder Aufgabe | Einmal pro neuer Fall bezahlt, dann die Handler-Etage | Auf der Etage bei abgedeckten Aufgaben |
| Entropie, die zur Laufzeit gelöst wird, und Determinismus | Die vollständige Verteilung des Prompts, ein frischer Probenahme jedes Mal | Nur der Rest, keine gespeicherte Lösung abdeckt, ein deterministisches Ausgang | Nur der Rest; jede Projektion deterministisch |
| Verifikationsstärke | Ausgang akzeptiert bei Inspektion | Tests, Abdeckung und ein Beweiszertifikat | Die vollständige Schranke bei jedem Ergebnis |
| Wiederverwendung und Verzinsung | Jedes Ergebnis wird einmal verwendet | Jede akzeptierte Lösung wird gespeichert und wiederverwendet | Jede Lösung, auf die die Schranke anwendet, wird gespeichert |
| Modellabhängigkeit | Ein Modell bei jeder Aufgabe | Kein Modell | Ein Modell nur als letzte Gang |

Ansätze unterscheiden sich in jedem Grad auf jeder Achse, und die Achsen interagieren: Wiederverwendung verringert Energie und die Entropie, die gelöst werden muss, und starke Verifikation ist das, was Wiederverwendung sicher macht. RCE schreibt die Bedeutung einmal in einer kanonischen Form. In seinem Entwurf ist jede Oberflächensprache eine Projektion dieser Form, überprüft, um mit ihr übereinzustimmen, und unter gleichwertigen Formen läuft die billigste korrekte Form; vier Sprachen werden heute emittiert ([§4.5](#45-the-compilers)).

Abbildung 2 zeichnet die fünf Achsen und platziert die Hauptklassen der Ansätze darauf.

![Radar-Diagramm mit fünf Achsen: Energie pro korrektem Ergebnis, Determinismus, Verifikationsstärke, Wiederverwendung und Verzinsung sowie Unabhängigkeit von Modellen. Fünf Ansatzklassen werden als Polygone gezeichnet. Ein Modell bei jeder Aufgabe befindet sich in der Nähe des Zentrums auf allen Achsen. Ein Agentenkreis, der durch Tests begrenzt ist, ist höher in der Verifikation. Ein Modell mit Retrieval und Caching ist höher in der Wiederverwendung. Klassische Synthese und Reparatur ist hoch in Determinismus und Modellunabhängigkeit. RCE, markiert mit Sternen, befindet sich am oder nahe dem äußeren Ring auf allen fünf Achsen. Die Platzierungen sind qualitativ.](/figures/rce/design-space.svg)

*Abbildung 2. Der Entwurfsspielraum autonomer Codierung. Qualitatives Diagramm: jede Klasse von Ansätzen wird gemäß der Lesart des Abschnitts 2 des Artikels auf ordinalen Ebenen platziert, nicht gemäß Messung. Die Modellabhängigkeit wird als Unabhängigkeit von Modellen gezeichnet, damit der äußere Bereich auf jeder Achse besser ist. Eine [PNG-Kopie](/figures/rce/design-space.png) wird bereitgestellt.*
<div id="21-programming-is-coding-theory" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Programmierung ist Kodierungstheorie

Die These dieses Abschnitts lautet, dass Programmierung als Kodierungstheorie gelesen werden kann. Ein Programmierer konvertiert Absichten entlang eines Gradienten zwischen zwei entropischen Regimen. Absicht ist eine hohe Entropie, eine Verteilung über Bedeutungen. Code ist eine niedrige Entropie, eine deterministische Übergang pro Zustand. Jeder Schritt der Softwareentwicklung, von einem Anforderung bis zu einem Register, ist ein Schritt dieser Konvertierung. Die Literatur hat dies in Teilen seit 70 Jahren in vielen Sprachen gesagt. Dieser Abschnitt fasst die Teile zu einem Argument zusammen und platziert jeden RCE-Gang darauf.

**Die Messung.** Shannon definierte die Entropie einer Quelle und die Kapazität eines Kanals [40], und maß gedrucktes Englisch bei etwa 0,6 bis 1,3 Bit pro Buchstaben [1]. Kolmogorov, der 1965 auf Russisch in *Problemy Peredachi Informatsii* schrieb, gab drei Ansätze zur Quantität der Information und machte den algorithmischen Ansatz primär: die Information in einem Objekt ist die Länge des kürzesten Programms, das es erzeugt [41]. Solomonoff erreichte denselben Gegenstand als Theorie der induktiven Inferenz [42], und Chaitin zeigte, dass die Programmgröße Identitäten formal identisch zu Shannons folgt [43]. Rissanen wandelte die Idee in eine Regel zur Wahl von Modellen, der minimalen Beschreibungsgröße [44]. Zusammen sagen sie, dass ein Programm ein Codewort ist: eine Beschreibung eines Verhaltens, und das kürzeste korrekte ist der Boden. RCEs Extraktionsregel, den Term mit den wenigsten Joule unter gleichwertigen Termen behalten (Aussage 3), ist diese Regel mit Joule anstelle von Bit.

**Code sitzt im niedrig-entropischen Regime, und Menschen haben es gemessen.** Hindle, Barr, Su, Gabel und Devanbu fanden heraus, dass Code „sehr repetitiv ist und in der Tat sogar noch mehr als natürliche Sprachen“, bei niedrigerer Kreuzentropie unter denselben n-Gramm-Modellen [35]. Gabel und Su fanden heraus, dass die meisten Zeilen eines Projekts bereits an anderer Stelle existieren [34], und Lopes et al. fanden heraus, dass die meisten Dateien auf GitHub Kopien sind [33]. Tu, Su und Devanbu fanden heraus, dass Code auch lokal ist: was in der Nähe geschrieben wurde, prognostiziert, was als nächstes kommt [46]. Ray und Kollegen fanden heraus, dass fehlerhafte Zeilen weniger natürliche sind, mit höherer Entropie, und dass die Entropie fällt, wenn der Fehler behoben wird [45]. Im Jahr 2025 verwendeten Yang, Kolak, Hellendoorn und Martins die Entropieänderung, die ein Patch induziert, um Reparaturkandidaten zu rangieren und korrekte Patches von überanpassenden zu trennen [51]. Allamanis, Barr, Devanbu und Sutton untersuchten das Feld unter dem Namen Naturalness [47]. Das Ergebnis ist nicht nur ein englischsprachiges. Prem Devanbu stellte es als Keynote am India Software Engineering Conference 2013 vor [50]. Sridhara, Sinha und Mani von IBM Research India maßen die natürlichsprachlichen Artefakte um Code am selben Ort und fanden heraus, dass Commit-Nachrichten am regelmäßigsten sind und Stack Overflow-Prosa sich wie gewöhnliches Englisch verhält [49]. In China veröffentlichte das *Journal of Software* (软件学报) 2022 eine Übersicht über Forschung zur Code-Naturalness, die die Kreuzentropie-Messung und die Erkenntnis, dass fehlerhafter Code höhere Entropie hat, erwähnt [48]. In Japan verwendeten Doi, Higo, Arima, Shimonaka und Kusumoto an der Osaka University n-Gramm-Naturalness, zuerst in einem japanischsprachigen IEICE-technischen Bericht und dann bei ICPC 2018, um maschinengenerierte Quellcodedateien von menschlich geschriebenen zu trennen [73, 74]. Generierter Code sitzt noch niedriger auf der Entropie-Skala als menschlicher Code, weil ein Generator eine feste Konvertierung ist. In Brasilien baute Arrebolas Doktorarbeit Code-Vorschläge auf n-Gramm- und Themenmodellen, segmentiert nach Projekt und Wartungsperson, und bewertete sie durch Kreuzentropie, die Bits, die benötigt werden, um den nächsten Token zu kodieren [75]. Die beiden Regime sind in einem Repository sichtbar: der Text um den Code ist hoch entropisch, und der Code ist niedrig.

**Die Messung zählt.** Febres, Jaffé und Gershenson, die aus Venezuela und Mexiko stammen, verglichen Englisch, Spanisch und Programmtext durch Vokabularvielfalt pro Nachrichtenlänge und fanden heraus, dass der Programmtext vielfältiger ist [76]. Rahman, Palani und Rigby fanden heraus, dass viel der n-Gramm-Vorhersagbarkeit von Code aus Syntax-Token stammt, und dass Code immer noch repetitiv ist, weniger als zuerst berichtet, sobald diese entfernt sind, mit API-Nutzung als am repetitivsten Teil [77]. Beide Ergebnisse schärfen die Aussage, anstatt sie umzukehren. Vielfalt der Symbole ist keine Vorhersagbarkeit, und das niedrig-entropische Regime ist eine Eigenschaft der bedingten Verteilung des nächsten Schritts, was ein deterministischer Übergang festlegt. In der Gestaltung basiert RCEs erster Gang, Lookup (G0, [§2.2](#22-how-rce-converts-and-where-each-gear-sits)), auf Formen, nicht auf Oberflächentext, aus diesem Grund.

**Absicht sitzt im hoch-entropischen Regime.** Zave und Jackson zeigten, dass eine Anforderung eine Aussage über die Umgebung ist, eine Spezifikation eine Aussage an der Schnittstelle, und der Abstand zwischen ihnen wird nur durch Domänenwissen gefüllt, das oft nicht geschrieben ist [64]. Brooks teilte die Schwierigkeit der Software in Essenz und Zufall auf: die Essenz ist der konzeptionelle Aufbau, und der größte Teil davon ist Spezifikation und Gestaltung, nicht Darstellung [61]. Naur argumentierte, dass ein Programm der sichtbare Teil einer Theorie ist, die seine Programmierer halten, und dass die Theorie nicht vollständig aus dem Text wiederhergestellt werden kann [62]. Durchgelesen durch Shannon sagen alle drei dasselbe. Absicht trägt mehr Unsicherheit als jedes einzelne Programm, und das Schreiben des Programms ist der Akt, der sie entfernt. Was in einem Programmierer bleibt, nachdem der Code geschrieben ist, ist der Teil der Absicht, den der Code nicht kodiert.

**Die Konvertierung ist eine Verfeinerung, und Verfeinerung ist eine Verengung.** Hoare gab Programmen eine Logik, in der ein Programm korrekt ist in Bezug auf eine Vor- und Nachbedingung [54]. Wirth lehrte schrittweise Verfeinerung: zerlege eine Aufgabe in Anweisungen durch sukzessive Entscheidungen, jede davon fixiert eine Wahl, die die Spezifikation offen gelassen hat [53]. Dijkstras geschützte Befehle machten die offenen Wahlmöglichkeiten explizit als Nichtdeterminismus und leiteten Programme aus Spezifikationen ab, indem sie ihn entfernten [52]. In München baute Bauer und Wössners CIP-Projekt die Programmentwicklung als eine Folge von korrektheitserhaltenden Transformationen von Spezifikation zu Programm [58]. In Frankreich trug Abrials B-Methode und dann Event-B die Verfeinerung auf industrielle Skala, mit Nachweispflichten an jedem Schritt [55, 56]. In Finnland gab Back und von Wright der Verfeinerung ihre Lattice-theoretische Kalkulation [57]. In jedem Fall bezeichnet eine Spezifikation eine Menge akzeptabler Verhaltensweisen und jeder Verfeinerungsschritt verkleinert die Menge, bis ein deterministisches Verhalten bleibt. Das ist Entropie-Reduktion mit einem Nachweis an jedem Schritt. RCEs Form ist das letzte Element dieser Kette: ein vollständiger, deterministischer Übergang $\delta$ über Datenbankzustände, mit jeder Wahl gelöst ([§3.2](#32-definitions)).

**Synthese ist Suche, die einen Hypothesenraum verengt.** Gulwanis FlashFill lernt ein Zeichenprogramm aus ein paar Eingabe-Ausgabe-Beispielen, indem er die Menge aller konsistenten Programme darstellt und sie mit jedem neuen Beispiel schneidet [59]. Gulwani, Polozov und Singh stellen die Programmsynthese allgemein als Suche durch einen Raum von Programmen, eingeschränkt durch Absicht, dar [60], und Solar-Lezamas Skizzierung füllt Lücken in einem unvollständigen Programm mit einem Löser [27]. Jedes Beispiel oder jede Einschränkung ist eine Messung, die Hypothesen entfernt. Shannons Messung zählt, wie viele solcher Messungen benötigt werden. In der Gestaltung ist RCEs dritter Gang, Synthese (G2, [§2.2](#22-how-rce-converts-and-where-each-gear-sits)), dieser Gang.

**Was die Konvertierung erzeugt, hat eine Form.** Gurevich bewies, dass jeder sequenzielle Algorithmus durch eine abstrakte Zustandsmaschine auf seiner eigenen Abstraktionsstufe erfasst wird [2]. Codd machte den Zustand eine Relation [5], und Event Sourcing macht den Zustand den Faltung eines nur-hinzufügenden Logs [14]. Unter Curry und Howard ist ein Beweis ein Programm und eine Aussage ein Typ [18, 72], also ein verifiziertes Programm ist ein Beweis seiner Spezifikation. Das sind die Gründe, warum das niedrig-entropische Regime wenige Formen hat: das Ziel ist eine Zustandsmaschine über eine Datenbank, egal welche Oberflächensprache.

**Niedrige Entropie zerfällt ohne ein Tor.** Lehman beobachtete über Jahrzehnte großer Systeme, dass ein in Gebrauch befindliches Programm sich ständig verändern muss, und dass seine Komplexität wächst, es sei denn, Arbeit wird geleistet, um sie zu reduzieren [63]. Torres, Baltes, Treude und Wagner maßen strukturelle und textuelle Entropie über die Commit-Historien von 25 Projekten und fanden heraus, dass beide gemeinsam ansteigen [78]. Entropie fließt zurück in den Code aus der Umgebung. Ein System, das Code im niedrig-entropischen Regime hält, benötigt ein Tor für jede Änderung, und RCEs Tor ist Korrektheit ([§4.3](#43-the-gate)).

**Compiler machen bereits Quellencodierung.** Franz und Kistler schickten Programme als komprimierte abstrakte Syntaxbäume und generierten nativen Code beim Laden, was Quellencodierung eines Programms über seine eigene Grammatik ist [67]. Fraser schloss statistische Modelle des Codes aus einem Corpus ab, um ihn zu komprimieren [68]. Futamura zeigte 1971 in der japanischen Zeitschrift *Systems, Computers, Controls*, dass das Spezialisieren eines Interpreters für ein Programm ein kompiliertes Programm ergibt, und dass das Spezialisieren des Spezialisierers einen Compiler ergibt [70]. Ershov in Nowosibirsk entwickelte dieselbe Idee als gemischte Berechnung [71]. Die Cousots' abstrakte Interpretation berechnet eine konservative, niedrigere Informationsbeschreibung jedes Verhaltens eines Programms [69]. Der Vergleich zu Kanalcodierung ist die Lesart dieses Papers, nicht ein zitiertes Theorem: Typen, Tests und Beweise fügen überprüfte Redundanz hinzu, damit ein falsches Programm vor dem Ausführen erkannt wird, wie ein Paritätscheck ein korruptes Wort erkennt.

**Löschung ist, wohin die Joule gehen.** Landauer zeigte, dass ein logisch irreversible Schritt, die Löschung eines Bits, mindestens $k_B T \ln 2$ dissipiert [65]. Bennett zeigte, dass Berechnung in Prinzip logisch reversibel gemacht werden kann, also die Löschung, nicht die Berechnung, trägt die Schranke [66]. Die Konvertierung von hochentropischer Absicht in ein niedrigentropisches Programm verwirft jede Alternative, die die Absicht erlaubt. Diese Verwerfung ist eine Löschung von Information über die Alternativen, und sie hat eine thermodynamische Schranke. In der Gestaltung der Engine zahlt RCE die Verwerfung einmal pro neuem Fall und speichert das Ergebnis, also ein Wiederholungsfall löscht nichts Neues.

**Was die Oberfläche kostet, gemessen.** Das Naturalness-Ergebnis hat zwei Korrekturen, die dieses Paper jetzt trägt, und eine dritte Erkenntnis, die sich auf den namenlosen Form bezieht. Erstens schrumpft der rohe Entropie-Abstand zwischen Code und Prosa erheblich, sobald Syntax-Token entfernt sind [77], und Casalnuovo, Lee, Morgan und Devanbu fanden heraus, dass ein Teil dessen, was übrig bleibt, ein Vertrautheitseffekt ist: in den top-starred Java- und Python-Projekten hatte der ursprüngliche Code eine geringere Überraschung als Bedeutungserhaltende Umformulierungen, und 50 menschliche Gutachter stimmten dem Sprachmodell-Präferenz 61,9 % der Zeit zu [132]. Was als natürlich liest, ist das, was der Leser am meisten gesehen hat, also ein kanonischer Form verschiebt das Gleichgewicht dieses Schlaufs, statt es zu verlassen. Zweitens sind die einzigen Größen, die gemessene Verständnislast verfolgen, textuelle Größe, Vokabulargröße und Datenfluss-Abhängigkeitsreichweite: in der einen Studie, die Code-Metriken gegen Gehirnaktivierung getestet hat, korrelierten diese drei bei Kendall τ ≈ 0,4, während McCabe cyclomatische Komplexität mit nichts korrelierte (τ ≈ 0,09) [133]; über 121 Lesbarkeitsmetriken und 444 Bewertungen erreichte keine einzelne Metrik |τ| > 0,16 mit gemessener Verständlichkeit [134]; und pretty-printed gegen gestörte Layout zeigte keine fMRI-Differenz [135], konsistent mit der Erkenntnis, dass Formatierung 13 bis 15 % der Token von Klammernsprachen sind und für zehn Sprachmodelle ohne signifikante Änderung in der Genauigkeit gestript werden können [136]. Drittens sind Namen ein Kanal mit geringer Übereinstimmung und hoher Abhängigkeit: zwei Entwickler wählen denselben Namen mit medianer Wahrscheinlichkeit 6,9 % [137], Kommentare ko-evolvieren mit dem Code, den sie beschreiben, in 7 bis 13 % der Fälle [138], und doch verlieren Frontier-Modelle 11 bis 29 Punkte Genauigkeit bei Zusammenfassung und bis zu 24 Punkte bei Ausführungsvorhersage, wenn Identifikatoren entfernt oder ersetzt werden [139]. Menschen verarbeiten Identifikatoren nicht auf der neuronalen Ebene als Sprache: das Austauschen von englischen Identifikatoren gegen japanische veränderte die Sprachsystemantwort um Δβ = 0,03 [140]. Die Konsequenz für RCE wird in [§3.8](#38-behaviour-equivalence-and-dimension) erwähnt: Positionen bleiben im Hash (T7) und Namen bleiben außerhalb, aber die Seiten-Tabelle, die sie hält, muss den *Begriff* tragen, den ein Name kodiert, weil die einzigen Autoren, die zählen, durch Namen lesen und der Form hat noch nicht gezeigt, dass ein Modell aus einem namenlosen einen Schluss ziehen kann.
<div id="22-how-rce-converts-and-where-each-gear-sits" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Wie RCE konvertiert und wo sich jeder Gang befindet

Wenn man dies als Kodierungstheorie liest, kommt eine Aufgabe als Nachricht, deren verbleibende Unsicherheit ist, was keine gespeicherte Lösung bereits löst. In der Konstruktion der Engine entfernt jeder Gang Unsicherheit zu unterschiedlichen Kosten, und die Gänge sind nach diesen Kosten geordnet ([§4.2](#42-the-gears)); die Tabelle gibt diese Konstruktionsgänge Schritt für Schritt an, mit dem Tor und der Förderung.

| Gang | Was es mit der Unsicherheit macht | Linie in dem oben genannten Argument |
|---|---|---|
| G0 Lookup | Erkennt, dass die Absicht bereits kodiert war; löst sie durch Abruf, auf der Ebene des Handlers | Wiederholung und Klonen [33, 34, 35]; Lokalität [46] |
| G1 Rules | Wendet eine bekannte geschützte Umformung an; löst eine wiederkehrende Restunsicherheit ohne Suche | Transformationsmethode, die die Korrektheit bewahrt [52, 58]; Verfeinerung mit Nachweispflichten [55, 56] |
| G2 Synthese | Durchsucht einen Hypothesenraum und verengt ihn durch Beispiele, Einschränkungen und einen Löser | Programmsynthese als Suche [27, 59, 60] |
| G3 bis G5 Modelle | Stichproben aus einer gelernten Verteilung über Code, wenn kein unterer Gang den Abstand schließt; nur ein Vorschlagender | Kreuzentropie-Modelle von Code [35, 47] |
| Tor | Nimmt einen Kandidaten nur mit Tests, Abdeckung und einem Nachweiszertifikat an | Hoare-Logik [54]; Curry-Howard [18, 72] |
| Förderung | Speichert die angenommene Lösung, sodass dieselbe Restunsicherheit beim nächsten Mal G0 kostet | Minimale Beschreibungsgröße [44]; Landauer-Löschung einmalig bezahlt [65] |

Die Positionen auf den Achsen von Abschnitt 2 unterscheiden sich darin, wo die Konvertierung bezahlt wird. Ein Ansatz, der bei jeder Aufgabe die vollständige Verteilung des Prompts stichprobenartig erfasst, zahlt jedes Mal erneut für die hohe Entropie. Ein Ansatz, der akzeptierte Lösungen speichert und wiederverwendet, zahlt nur für die Restunsicherheit und nur einmal. Die meisten Systeme befinden sich zwischen diesen Extremen, und das Design von RCE befindet sich am Wiederverwendungs-Ende.

<div id="23-the-ecosystem-at-large-n" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Das Ökosystem bei großem N

Die Aussage von [§1](#1-thesis) wird direkt bei großem N unter dem unten beschriebenen Protokoll getestet, das vor der Ausführung registriert wird. Ein mit Samen versegener Generator schreibt mindestens 10.000 Formen, wobei jede ein Modul der Sprache mit einem Zustandsbereich, einem Ereignis mit ganzzahligen Feldern und einem Schritt ist, dessen Körper ein zufälliges arithmetisches Term mit begrenzter Tiefe über einen festen Satz von Operatoren ist. Der Referenzprüfer und seine Emitter sind vor der Ausführung bei einem öffentlichen Commit eingefroren, und kein Modell wird aufgerufen. Die Projektionen sind die vier Programmerzeuger des Referenzprüfers: Rust, Python, JavaScript und Scala. Fünf Eigenschaften werden auf jedem Form geprüft:

| Eigenschaft | Was pro Form geprüft wird |
|---|---|
| Verlustfreie Kodierung | Die kanonische JSON-Datei des Form (`rce emit form`), decodiert in die Quelle (`rce unform`) und erneut kodiert, ergibt dieselben Bytes |
| Deterministische Projektion | Zwei Erzeugungen desselben Ziels ergeben dieselben Bytes |
| Treue Projektion | Jedes erzeugte Programm (Rust, Python, JavaScript und Scala) druckt Byte für Byte die Referenzspur für gesäte Ereignisse |
| Tor am Eingang, Eingaben | Falsch formatierte Nutzlasten (falscher Typ, fehlendes Feld, zusätzliches Feld, verschachtelter Wert) und nicht deklarierte Ereignisse werden alle abgelehnt, mit unverändertem Zustand und der Ablehnung aufgezeichnet |
| Tor am Eingang, Spezifikationen | Ein Modul, das einen Namen verwendet, den es nicht deklariert, wird vor der Erzeugung abgelehnt (W-NAME-1) |

Abschnitt 9 beschreibt die Beobachtung, die die Aussage widerlegt, RCE-F0: bei einer vorregistrierten Ausführung von mindestens 10.000 Formen druckt einer der vier Projektionen eine Spur, die sich von der Referenzspur des Form unterscheidet, oder irgendeine falsch formatierte Eingabe wird akzeptiert. Auf dem Konformitäts-Testsuite stimmt die Scala-Ausgabe noch nicht mit der Referenz überein ([§4.5](#45-the-compilers)), und der öffentliche Prüfer erfüllt noch nicht den Eingabe-Vertrag ([§10](#10-work-to-finish), Punkt 15). Ein Ziel, das später den Emitter hinzugefügt wird, tritt erst in das Protokoll ein, wenn eine neue Registrierung erfolgt. Die generierten Formen sind klein, sodass solch eine Ausführung die Kodierung, die Projektionen und das Tor misst. Aufgehebte Formen aus echten Programmen werden unter dem Protokoll von [§8.7](#87-lift-coverage-across-languages) gemessen.
<div id="24-gated-verified-recursive-self-improvement" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Gated, verified recursive self-improvement

Good (1965) [111] definierte die ultraintelligente Maschine als eine, die besser Maschinen entwerfen könnte, so dass die Verbesserung rekursiv wäre. Yudkowsky (2013) [113] stellte die Frage als eine von Rückgaben dar: ob jede Einheit Verbesserung die nächste Einheit billiger oder teurer macht. Schmidhubers Gödel-Maschine (2007) [112] gab eine formale Antwort mit einer Garantie: ein Programm schreibt beliebige Teile von sich selbst, einschließlich seiner eigenen Suche, nur nachdem es bewiesen hat, dass die Neuschreibung seine erwartete Nutzen verbessert. Löbs Theorem (1955) [114] ist das Hindernis, das ein selbstvertrauender Beweiser trifft, das Yudkowsky und Herreshoff (2013) [115] den Löbischen Hindernis nennen: ein System kann im Allgemeinen nicht die Korrektheit eines Nachfolgers beweisen, der dessen eigenen Beweisesystem verwendet. Kürzliche Systeme entfallen auf die Nachweisvoraussetzung und wählen durch gemessene Bewertung: STOP (Zelikman et al., 2023) [116] verbessert den Gerüst, der den Code verbessert, die Darwin Gödel-Maschine (Zhang et al., 2025) [117] hält eine Archiv von selbstmodifizierten Codierung-Agenten, die durch Benchmark-Bewertung gewählt werden, AlphaEvolve (Novikov et al., 2025) [118] entwickelt Programme unter automatischen Evaluatoren, und Voyager (Wang et al., 2023) [119] wächst eine Bibliothek von verifizierten Fähigkeiten, die spätere Aufgaben wiederverwenden.

RCE nimmt die Struktur der Gödel-Maschine und die Bibliothek von Voyager mit zwei Unterschieden an, die das Hindernis für die Objekte, die es fördert, umgehen. Erstens ist das Objekt, das verbessert wird, nicht der Beweiser. In der Gestaltung fördert RCE Handler, Neuschreibungen und Gänge, und jedes wird gegen einen festen Kern und eine festen Beweisregel geprüft: die Eigenschaften, gegen die der Kern mit Modellprüfung geprüft wird ([§5.3](#53-model-checking-of-the-kernel)), und die Kodierung der Arithmetik des Forms für einen Satisfiability Modulo Theories (SMT) Solver ([§5.2](#52-the-proof-rule-for-rewrites)) ändern sich nie durch Förderung, also braucht kein Schritt ein Nachfolgersystem vertrauen. Zweitens ist das Tor ein Beweis der Korrektheit an der Grenze, nicht eine Bewertung. Eine Bewertung kann ansteigen, während eine Schnittstellenannahme bricht; ein Beweis an der Grenze kann nicht durch eine Änderung, die sie bricht, übergeben werden.

**Aussage R1 (monotoner Korrektheit).** Wenn jede geförderte Änderung die Prüfung ihrer Grenze besteht und die Prüfungen der anderen Grenzen unverändert bleiben, dann hält jede Eigenschaft, die diese Prüfungen vor der Förderung etabliert haben, nach der Förderung weiterhin.

**Aussage R2 (Verzinsung).** Sei eine Arbeitslast eine Multimenge von Aufgaben und sei ein gefördeter Handler jede Aufgabe seiner Form schließen. Dann ist die Anzahl der Eskalationen in Runde t nicht zunehmend in t, und eine Korrektur, die vor Runde 1 gefördert wird, verringert die kumulierten Eskalationen jedes Horizonts um die Eskalationen, die sie in jeder späteren Runde schließt.

**Aussage R3 (fallende Kosten).** Da ein gefördeter Handler anstelle eines Modellauftrags ausgeführt wird, und seine Kosten die Op-Zahl des Handlers sind, die von der Substrattabelle bewertet wird, fällt die Energie einer Runde auf die Energie der Handler allein, während die Eskalationen auf Null fallen.

Futamuras Projektionen (1971, erneut veröffentlicht 1999) [120] und Turchins Supercompilation (1986) [121] geben den Grenzwert dieses Prozesses. Die Spezialisierung eines Interpreters auf ein Programm ergibt ein kompiliertes Programm; die Spezialisierung des Spezialisierers ergibt einen Compiler. In der Gestaltung spezialisieren RCEs Förderungen den allgemeinen Eskalationsweg auf die Formen, die tatsächlich auftreten, so dass der Motor sich dem residualen Programm seiner Arbeitslast nähert: dem Teil der Berechnung, den ein Modell oder eine Person immer noch liefern muss. Rekursive Selbstverbesserung unter einem Tor ist diese Konvergenz, mit überprüften Schritten.

<div id="3-the-form" class="anchor-alias" aria-hidden="true"></div>

## 3. Die Form

<div id="31-the-strongest-formal-statement-of-same-form" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Die stärkste formale Aussage von „gleicher Form“

Der Umfang des Satzes wird zuerst angegeben. Gurevichs sequenzielle Postulate decken sequenzielle Algorithmen ab; parallele und interaktive Algorithmen benötigen die weiteren Postulate von Blass und Gurevich [3]. Blass, Dershowitz und Gurevich argumentieren, dass keine einzige Äquivalenzrelation für Algorithmen jedem Zweck entspricht [79], und Moschovakis und Vardi legen den Streit über, was ein Algorithmus ist, dar [80, 81]. Ein Web-Handler, der Eingabe und Ausgabe durchführt, befindet sich außerhalb des sequenziellen Satzes. Die Form behandelt Interaktion wie die interaktive Linie: jede Eingabe ist ein Ereignis in $E$, und der Zustandsmaschine schreitet darauf. Also ist „eine Form“ eine Modellierungswahl, die auf dem sequenziellen Satz beruht und durch Konvention erweitert wird, mit Produktionsvorgängern in der Elm-Architektur [83], anhaltenden Workflow-Ereignishistorien [84] und Stream-Semantiken wie Flo [82]. Die Aussagen des Abschnitts 3.4 sind für diese Wahl formuliert.

Gurevichs Abstrakte Zustandsmaschine (ASM)-Satz ist die stärkste formale Aussage, dass jeder Algorithmus eine Form hat [2]. Eine abstrakte Zustandsmaschine ist eine Maschine, deren Zustände erste Ordnung Strukturen sind und deren Schritt eine endliche Menge von geschützten Updates ist. Gurevich formuliert drei Postulate. Sequenzielle Zeit: ein Algorithmus hat Zustände, Anfangszustände und eine ein-Schritt-Karte $\tau$. Abstrakter Zustand: Zustände sind erste Ordnung Strukturen über einem festen Vokabular, geschlossen unter Isomorphismus. Begrenzte Exploration: eine endliche Menge von Begriffen entscheidet jeden Schritt. Sein Haupttheorem (Satz 6.13) lautet: „Für jeden sequenziellen Algorithmus A gibt es eine äquivalente sequenzielle abstrakte Zustandsmaschine B.“ Blass und Gurevich erweitern es auf parallele Algorithmen [3]. Dershowitz und Gurevich fügen ein viertes Axiom hinzu, dass Anfangsoperationen berechenbar sind, und leiten daraus Churchs These ab [4].
<div id="32-definitions" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Definitionen

**Definition 1 (die Form).** Ein Programm ist ein Tupel

$$P = (S, E, \delta, D, \lambda)$$

- $S = \Sigma_c \times \Sigma_d$, der Zustandsraum: Strukturen über einem festen Vokabular $\Sigma$, aufgeteilt in Steuerungsbereiche $\Sigma_c$ und Daten $\Sigma_d$. $\Sigma_d$ enthält die logische Uhr, die Eingangszahl und die typisierten Relationen (in der Sprache auch die deklarierten Bereiche). Jeder Zustand ist eine Datenbankinstanz im Sinne von Codd [5].
- $E$, das Ereignisalphabet, einschließlich des Ticks der logischen Uhr.
- $\delta : S \times E \to S \times O^*$, die Übergangsfunktion: total, deterministisch und rein, geschrieben als eine endliche Menge von geschützten Updates "if $\varphi$ then $f(\bar t) := t_0$", wobei jeder Schritt eine beschränkte Menge von Orten liest. Es gibt den nächsten Zustand und die Ausgaben des Schritts zurück. Schreibe $\delta_1 = \pi_1 \circ \delta$ für seine Zustandskomponente.
- $D$, der dauerhafte Log: eine Sequenz von Einträgen $\{\mathit{seq}, \mathit{event}, \mathit{prev\_hash}, \mathit{state\_hash}, \mathit{hash}\}$, wobei $\mathit{state\_hash}$ der SHA-256 des kanonischen JSON des Zustands nach dem Schritt ist, $\mathit{hash}$ der SHA-256 des kanonischen JSON der ersten vier Felder ist, und der erste $\mathit{prev\_hash}$ 64 Nullen ist. Der Log ist eine Hashkette, also ändert sich jeder frühere Eintrag alle späteren $\mathit{hash}$.
- $\lambda = \pi_2 \circ \delta : S \times E \to O^*$, die Ausgabekarte. Eine Mealy-Maschine liest beide Argumente [6]; eine Moore-Maschine liest nur den Zustand [7].

**Definition 2 (Form und Passung).** Die *Form* ist das Tupel mit vier Invarianten: $\delta$ ist deterministisch und rein; die Exploration ist beschränkt; das Vokabular ist fest; der Zustand ist die Faltung des Logs,

$$\mathrm{state}(D) = \mathrm{foldl}(\delta_1, s_0, D).$$

Ein Log kann auch das Ergebnis, die Ausgaben und den Zustand jedes Eintrags tragen. Diese sind abgeleitet: sie werden nicht gehasht, und sie müssen der Wiederholung entsprechen (T1 und T3 von [§3.7](#37-the-language-one-text-costs-and-theorem-status)). Zwei Arten von Ablehnung sind unterschiedlich. In der Engine-Profile, die Appendix D der Spezifikation definiert, wird jedes Ereignis angewendet, und eine Eingabe, die ihren Vertrag nicht erfüllt, erzeugt eine `reject`-Ausgabe und eine Fehlerzeile (D.6). In der Sprache verändert ein abgelehntes Ereignis den Zustand nicht (T8) und wird als abgelehnt aufgezeichnet.

Die *Passung* ist die Daten, die die Form füllen: das Vokabular $\Sigma$, die Alphabete $E$ und $O$, die Regelprogramme $\Pi$, die $\delta$ definieren, die Ausgaberegeln, die $\lambda$ definieren, und die anfänglichen Daten $s_0$. In den Begriffen von Gurevich ist die Passung das Vokabular, das ASM-Programm und die anfänglichen Strukturen. In den Begriffen von Codd ist $\Sigma$ das Schema und $s_0$ die Instanz. In den Begriffen von Produktlinien ist eine Passung eine Funktionenauswahl [8]. In den Begriffen der syntaxgeleiteten Synthese (SyGuS) ist eine Passung ein Term aus einer Grammatik, der eine Spezifikation erfüllt [9].

**Definition 3 (Passungsequivalenz).** Zwei Passungen sind äquivalent, wenn für jede Ereignisfolge $L$ ihre Ausgabefolgen unter $\lambda$ gleich sind.

**Definition 4 (Passungssprache).** Eine Grammatik, deren Terme Passungen bezeichnen. Programmiersprachen, Statechart-Dokumente in State Chart XML (SCXML), XState-Konfigurationen und `.rce`-Spezifikationen sind Passungssprachen. Eine Passungssprache ist vollständig, wenn jedes ASM-Programm über $\Sigma$ einen Term in ihr hat.

**Definition 5 (Steuerungsprojektion).** Teile $\Sigma = \Sigma_c \cup \Sigma_d$ in endliche Steuerungssymbole und Datenrelationen auf. Der Statechart von $P$ ist die Projektion von $\delta$ auf $\Sigma_c$: Zustände sind Werte von $\Sigma_c$, Übergänge tragen ein Ereignis und eine Schranke über $\Sigma_d$, und Aktionen sind Updates zu $\Sigma_d$. Harel's Statecharts geben die Hierarchie und die orthogonalen Bereiche an [10].

**Definition 6 (Passungse-Graph).** Für eine Passung $F$ und eine Menge $R$ von konsistenten Umformungen ist der Passungse-Graph $EG(F, R)$ der gesättigte e-Graph der Regeltermen von $F$ unter $R$ [11, 12]. Jede e-Klasse enthält Passungen, die nach Definition 3 äquivalent sind.

**Definition 7 (Joule-Kosten).** $\mathrm{cost}_J(t)$ ist die geschätzte Energie (`est_j`), um den Term $t$ einmal auf einem benannten Substrat auszuführen, gewichtet mit der erwarteten Anzahl der Ausführungen.

<div id="33-why-database-functional-state-machine" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Warum "databasen funktionale Zustandsmaschine"

Ein endlicher relationaler Struktur ist eine Datenbankinstanz, also ist ein Gurevich-Zustand eine Datenbank und jeder Schritt ist eine beschränkte Transaktion. *Datenbank*: $S$ ist eine relationale Struktur. *Funktional*: $\delta$ und $\lambda$ sind rein. *Zustandsmaschine*: Laufbahnen sind Faltungen von $\delta$ über Ereignisse. Moseley und Marks ziehen die gleiche Linie in der Architektur [13]. Event Sourcing zieht sie in der Anwendungsstatus: "Alle Änderungen an einem Anwendungsstatus als Sequenz von Ereignissen erfassen" [14]. Dedalus zieht sie in der Logik, wo veränderlicher Zustand eine Relation ist, die nach der Zeit indiziert ist [15].
<div id="34-propositions" class="anchor-alias" aria-hidden="true"></div>

### 3.4 Aussagen

**Aussage 1 (die Form erfasst jeden sequenziellen Algorithmus).** Für jeden sequenziellen Algorithmus $A$ gibt es eine Form-Instanz $P$, deren Ausführungen die Ausführungen von $A$ sind.

*Hinweis zur Beweisskizze.* Satz 6.13 liefert eine ASM $B$ mit den Zuständen, den Anfangszuständen und der ein-Schritt-Karte von $A$. Setze $E = \{\varepsilon\}$, $\delta(s, \varepsilon) = \tau_B(s)$, $D = (s_0, \varepsilon^n)$ und $\lambda$ als Identität. Der Faltungsprozess nach $n$ Ticks ist $\tau_A^n(s_0)$. Nach Gurevichs Folgerung 3.3 haben $P$ und $A$ dieselben Ausführungen. ∎

**Aussage 1b (interaktive Programme).** Erweitere $\Sigma$ mit einer nullären Eingabe-Symbolmenge zu $e$ vor jedem Schritt; dann ist $\delta(s, e) = \tau(s[\mathit{in} := e])$ ein sequenzieller Algorithmus über das erweiterte Vokabular, und Aussage 1 gilt. Die Konstruktion ist unsere.

**Aussage 1c (Berechenbarkeit).** Unter dem Axiom von Dershowitz und Gurevich berechnet jede Form-Instanz eine Turing-berechenbare Funktion [4, 16, 17]. Die Form fügt keine neue Macht hinzu. Sie verleiht jedem Programm in der Klasse eine Form.

**Aussage 1d (Beweise sind Passungen).** „Für jeden Beweis einer gegebenen Aussage gibt es ein Programm des entsprechenden Typs“ [18]. Ein Typ ist eine Spezifikation und ein Beweis ist eine Passung, die diese erfüllt. Das Korrektheits-Tor ist die Existenz dieses Beweises oder eines bestandenen Akzeptanztests.

**Aussage 2 (ein Generator).** Eine Funktion $G : \mathrm{Fit} \to \mathrm{Program}$ erzeugt ein ausführbares Programm für jede Passung und liest kein Gebiet. *Basis:* jedes Programm ist eine Form-Instanz, also emittiert $G$ einen typisierten Speicher, einen Ereignistyp, kompilierte Regeln, einen Log mit einer Faltung und einen Ausgabevermittler. Skeletteure wie Rails-Generatoren, JHipster und Yeoman sind $G$ eingeschränkt auf kleine Passungssprachen. Produktlinien-Engineering beginnt mit „der systematischen Entdeckung und Nutzung von Gemeinsamkeiten zwischen verwandten Software-Systemen“ [8]; die Gemeinsamkeit ist die Form.

**Aussage 3 (minimaler Energieverbrauch bei Extraktion).** Extraktion mit $\mathrm{cost}_J$ liefert den minimalen Joule-Ausdruck, den der Extraktor in der e-Klasse von $F$ findet. *Hinweis zur Beweisskizze.* Die Umformungen sind korrekt, also hat jeder Ausdruck in der e-Klasse das beobachtbare Verhalten von $F$ und besteht denselben Test. Extraktion minimiert den Kosten, und die Kosten sind Joule. ∎ Dies ist Mischung der Grenzen auf Code angewendet. Mischung der Grenzen, Teil II des Begleitpapiers [Gemessene Commit-Tore](/papers/gates/), besagt, dass eine Aufgabe eine minimale erwartete Energie benötigt, um abgeschlossen zu werden, und dass Energie, die nach Abschluss der Aufgabe verbraucht wird, keinen verifizierten Fortschritt kauft; auf Code angewendet, bedeutet das: behalte den minimalen Ausdruck, der die Aufgabe erledigt, und der Rest ist Abfall.

**Aussage 4 (Wiederholungsdeterminismus).** Wenn $\delta$ keine Uhrzeit liest, Updates ohne Namen ordnet und jede Eingabe protokolliert, ergeben zwei Wiederholungen desselben $D$ identische Zustandshashes zu jedem Schritt.

**Aussage 5 (Projektion des Zustandsdiagramms ist korrekt).** Projiziere jeden Zustand einer Ausführung auf $\Sigma_c$. Das Ergebnis ist eine Ausführung des emittierten Zustandsdiagramms unter denselben Ereignissen.

**Aussage 6 (Koordination-Budget).** Regeln mit dem Merkmal monotone laufen auf Replikaten ohne Koordination; nur nicht-monotone Regeln benötigen einen Koordinationspunkt. *Basis:* der CALM-Satz, „die Programme, die konsistente, koordinationsfreie verteilte Implementierungen haben, sind genau die Programme, die in monotoner Logik ausgedrückt werden können“ [19].

Anhang D.5 der Spezifikation leitet das Merkmal aus der Regel ab, nie aus einer Deklaration, und hat die IR-Prüfung des Engine-Profils eine Form ablehnen, deren gespeichertes Merkmal sich von dem abgeleiteten unterscheidet:

| Regel hat | Merkmal | Grund |
|---|---|---|
| keine Auflösung, Lesung, Verknüpfung oder Scan | monotone | ihre Schreibvorgänge fügen nur Schlüssel hinzu und erhöhen Zähler |
| eine Auflösung | nicht monotone | sie löscht Escalation-Zeilen |
| eine Lesung ihres eigenen Senks | nicht monotone | Lesen, Ändern, Schreiben |
| eine Schlüsselverknüpfung | nicht monotone | die verknüpfte Zeile kann jetzt nicht vorhanden sein und später vorhanden oder überschrieben werden |
| einen Scan | nicht monotone | sie beobachtet die gesamte Relation, einschließlich dessen, was fehlt |

Das Merkmal ist korrekt, aber nicht vollständig: eine Verknüpfung mit einer nur-einfügenden Relation wäre monoton, aber das Profil beweist nicht, dass eine Relation nur-einfügend ist, also beansprucht das Merkmal das nicht. Eine Form ist koordinationsfrei, wenn jede Regel monoton ist. Jede Lesung, Verknüpfung und Scan sieht den Zustand zum Eintritt des Ereignisses, also hängt der Nachzustand eines Eingabeereignisses nicht von der Reihenfolge ab, in der Regeln für verschiedene Senken laufen; nur die Ausgabereihenfolge tut es, und sie ist durch den Inhaltshash festgelegt.

**Aussage 7 (Intelligenz als Joule-Ableitung).** Sei $X$ die Anzahl der Aufgaben, die durch das Tor gehen, und $J$ die verbrauchten Joule. $\iota = dX/dJ$ wird im Nachhinein aus $D$ gelesen, das jedes Ereignis protokolliert, und, im Entwurf der Engine, aus ihren Belegen ([§4.4](#44-receipts)), wobei jeder Beleg den `est_j` eines Gangaufrufs trägt. Extraktion unter $\mathrm{cost}_J$ hält das Tor fest und erhöht $J$ nicht, also verringert sie bei gleichem $X$ nicht $\iota$.

<div id="35-graph-e-graph-and-statechart" class="anchor-alias" aria-hidden="true"></div>

### 3.5 Graph, e-Graph und Zustandsdiagramm

| Struktur | Teil der Form | Was es entscheidet |
|---|---|---|
| Zustandsdiagramm | Wächter von $\delta$ über $\Sigma_c$ | Welche Übergang feuert |
| Datenflussgraph | Lesen- und Schreibabhängigkeiten von $\delta$ und $\lambda$ (Kahn-Prozessnetzwerke [20]) | Was läuft und in welcher Reihenfolge |
| E-Graph | Äquivalenzklasse der Passung | Welche äquivalente Passung läuft |

Das Zustandsdiagramm und der Graph beschreiben eine Passung. Der E-Graph beschreibt jede Passung, die äquivalent dazu ist. Extraktion wählt unter ihnen nach Joule.
<div id="36-one-ecosystem-lossless-and-the-universality-thesis" class="anchor-alias" aria-hidden="true"></div>

### 3.6 Eine Ökosystem, verlustfrei, und die Universalitäts-Hypothese

**Verlustfrei durch Konstruktion.** Shannons Quellencodierungstheorem legt die untere Grenze für einen verlustfreien Code an der Entropie der Quelle fest [40]. Eine Form ist ein verlustfreier Code für die Absicht in enger Hinsicht, der überprüft werden kann: die kanonische Serialisierung der Form ist injektiv, also haben zwei Formen, die sich in jedem Zustand, Ereignis oder Übergang unterscheiden, unterschiedliche Form-Hashes, und die Dekodierung der Serialisierung liefert dieselbe Form zurück. In der Gestaltung ist jede Projektion auf ein Ziel eine Funktion der Form allein; die heutigen Sender lesen den überprüften Programmcode anstelle dessen ([§4.5](#45-the-compilers)). Bidirektionale Transformationen machen die Rundreise präzise. Foster, Greenwald, Moore, Pierce und Schmitt definieren ein Lens als ein Paar von get- und put-Funktionen mit Rundreisebedingungen, die sicherstellen, dass der View und seine Quelle übereinstimmen [122], Hofmann, Pierce und Wagner erweitern die Bedingungen auf symmetrische Lenses [123], und Czarnecki und Kollegen untersuchen dieselben Konsistenzbedingungen über Modellengineering, Datenbanken und Programmiersprachen [124]. Die Rundreisebedingung von RCE ist die GetPut-Bedingung auf der Ebene des gesamten Programms: heben Sie eine Projektion zurück und der Form-Hash bleibt unverändert.

**Richtig durch Konstruktion.** Dijkstra schlug 1968 vor, ein Programm und dessen Beweis gemeinsam zu entwickeln, so dass Richtigkeit entworfen, nicht getestet wird [125]. Hall und Chapman trugen diesen Ansatz in ein kommerzielles sicheres System mit formaler Spezifikation und Verfeinerung in jedem Schritt [126]. Minskys Regel für typisierte funktionale Programmierung, illegale Zustände unverfügbar machen, sagt dasselbe auf der Ebene des Typs: ein Typ, der keinen schlechten Wert halten kann, beseitigt die Notwendigkeit, ihn zu überprüfen [127]. Turners totale funktionale Programmierung erfordert, dass jede Funktion auf jedem Eingang terminiert, so dass ein Programm eine mathematische Funktion darstellt, ohne versteckte Fehler [128]. RCEs Form ist in Turners Sinne total, seine Vertragstypen machen unerklärte Zustände in Minskys Sinne unverfügbar, und die Verfeinerungskette von [§2.1](#21-programming-is-coding-theory) endet in ihr in Dijkstras Sinne. Die Konsequenz ist die in [§1](#1-thesis) genannte: was ein Programm tut, ist das, was seine Form deklariert, also gibt es nichts zu diffen oder zu verfolgen, nachdem es geschehen ist.

**Die Universalitäts-Hypothese.** Formuliert in theoretischen Begriffen, besagt die Hypothese, dass es eine universelle Form gibt. Programme werden in ihr nativ verfasst, jede bestehende Sprache ist von ihr aus als treue Projektion erreichbar, und jedes bestehende Programm gelangt in sie durch Hebung. Gurevichs Hypothese legt den Grundstein: jeder sequenzielle Algorithmus wird Schritt für Schritt von einer abstrakten Zustandsmaschine auf seiner eigenen Abstraktionsstufe erfasst [2], und parallele Algorithmen ebenso [3]. Eine Form ist solch eine Maschine über einen Datenbankzustand.

**Aussage U1 (Erfaßung).** Wenn ein Programm in der Sprache $L$ ein sequenzieller oder paralleler Algorithmus im Sinne von Gurevich ist, dann gibt es eine Form, deren Übergang ihn Schritt für Schritt auf der Ebene der Abstraktion des Programms simuliert [2, 3].

**Aussage U2 (treue Projektion).** Wenn die Projektion $\pi_L$ einer Form auf $L$ die Spur der Form auf jedem Eingang im Vertrag bewahrt, dann sind die Form und ihre Projektion für jeden Beobachter der Spur austauschbar, und $L$ fügt nichts hinzu, was die Form nicht besitzt.

**Aussage U3 (Hebung durch Konstruktion).** Jede in Gebrauch befindliche Programmiersprache hat eine formale Grammatik, einen Parser, der einen konkreten Syntaxbaum erzeugt, einen abstrakten Syntaxbaum und eine Semantik, die durch ihre Spezifikation oder Referenzimplementierung festgelegt ist. Eine Hebung $\lambda_L$ wird pro Sprache in drei Schritten aufgebaut: zuerst die Grammatik, dann der abstrakte Syntaxbaum, dann die Form, wobei jedem Konstrukt von $L$ seine Form-Regel durch die Semantik von $L$ gegeben wird. Eine so gebaute Hebung erfüllt $\pi_L(\lambda_L(p)) \equiv p$ in Bezug auf das Verhalten und $\lambda_L(\pi_L(F)) = F$ in Bezug auf den Form-Hash, also ist das Paar ein Lens im Sinne von [122], und ein Programm in $L$ wird als Form gespeichert, ohne Verlust.

**Aussage U4 (Ersetzung).** Wenn U2 und U3 für die Sprache $L$ gelten, dann muss kein Programm in $L$ geschrieben werden: es wird einmal als Form geschrieben und als $L$ emittiert, wo eine Plattform es erfordert.

**Jede Sprache als Ziel und als Quelle: das Design.** Die Form legt keine Schranken für Ziele fest, und RCE ist so gestaltet, dass jede Sprache in die Form gehoben und von ihr aus emittiert wird. Das Design ist der Vorschlag [`spec/proposals/rce-form.md`](https://github.com/openIE-dev/rce/blob/main/spec/proposals/rce-form.md) des Spezifikations-Repositories. Es fixiert eine Kodierung der Form, `rce-form/1`, die von Hebung und Emission geteilt wird, und behandelt eine Sprache als Daten: eine festgelegte Grammatik, eine Hebungstabelle, die die Syntax der Sprache auf die Kodierung abbildet, eine Drucktabelle, die die Kodierung als Text der Sprache druckt, und eine Laufzeitbibliothek, die die Werte und eingebauten Operationen der Sprache exakt definiert. Eine Hebung wird durch exakte Vergleich mit der eigenen Implementierung der Sprache akzeptiert, und eine Emission durch exakte Vergleich des Ausgabeprogramms, das unter der eigenen Bauweise der Sprache läuft, mit der Referenzspur, auf einer Leiter der Annahmestufen von 0 (die Sprache hat eine Zeile, mit einem Identifikator aus einem öffentlichen Katalog wie der Geschichte der Programmiersprachen oder GitHub Linguist, in der eigenen Sprachregistrierung des Vorschlags) durch 4 (auf einem festgelegten Corpus stimmen alle Fälle Byte für Byte überein oder werden von der Hebung oder Emission mit einem benannten Grund behalten, mindestens ein Fall stimmt überein, keiner unterscheidet sich, und kein gelifteter Fall wird aufgrund einer Ressourcenbegrenzung behalten) und 5 (Hebung und Emission bilden ein Lens auf diesem Corpus) bis 6 (Übereinstimmung mit einer zweiten, unabhängigen Implementierung oder mit dem eigenen Testsuite der Sprache, die mindestens 30 % des Corpus ausmacht), und eine Stufe wird nur veröffentlicht, wenn die Zahlen der Lauf, die sie erreicht hat, bekannt sind. Der Vorschlag baut auf drei früheren auf: die Emissionsregistrierung (`spec/proposals/emit-targets.md`), deren Ebenen die Systeme, Plattformen, dynamische und nicht-von-Neumann-Sprachen auflisten, einschließlich der neuen Teilnehmer von 2024 bis 2026, die in [§3.7](#37-the-language-one-text-costs-and-theorem-status) katalogisiert sind; einen Emitter mit einer Drucktabelle pro Sprache (`spec/proposals/one-emitter.md`); und wie die Form das hält, was ihr geboten wird (`spec/proposals/compliance.md`). In der Kodierung ist jede Definition eines Programms durch den Hash ihrer Bytes benannt, und ihr Körper ist ein Graph über fünf Knotentypen (Bind, Apply, Branch, Iterate und Halt), die die Zahlen, die ihnen vom Kern von flowG ([openIE-dev/flow-g](https://github.com/openIE-dev/flow-g)) gegeben werden, beibehalten, ihr Vokabular von 22 Primitiven und 11 Drahttypen; flowG ist der erste Durchlauf des Projekts für eine gemeinsame Form zwischen Absicht und Silizium und der Elter von RCE. Das Design wird nicht gebaut: der Vorschlag besagt, dass nichts in ihm gebaut wurde und dass keine Zeile seiner Formebene existiert, und der typisierte Kern, den seine Drucker lesen würden, existiert nur auf einer Entwicklungsbranch des Repositories. Was heute existiert, ist enger. Der Referenzprüfer emittiert Rust, Python, JavaScript und Scala durch vier manuell geschriebene Emitter, die den überprüften Syntaxbaum eines Programms übersetzen, nicht die Form ([§4.5](#45-the-compilers)). Die einzige Hebung aus einer anderen Sprache im öffentlichen Repository ist der Test `spec/lift/go/lift_go.py`, der ein Go-Muster (ein Struct mit einer Zeigerempfänger-Methode pro Ereignis, Schutzmechanismen, die einen Fehler zurückgeben, und Feldzuweisungen) in eine Form hebt; bei seinem einzigen Beispiel, einer Tür, hat die geliftete Form dieselben Steuerzustände und Übergänge wie eine manuell geschriebene Form derselben Tür, wenn die beiden ihre Fehler in derselben Reihenfolge deklarieren. Unter `lang/` hält das Repository auch, in den pro-sprachlichen Dateiformaten des Vorschlags, festgelegte Orakel und aufgezeichnete Corpora für Go 1.24, Python 3.13 und JavaScript (ECMAScript 2020), gegen die eine Hebung beurteilt werden würde; kein Heber existiert, wie [seine Readme](https://github.com/openIE-dev/rce/blob/main/lang/README.md) besagt.

U1 ist ein Theorem. U2 wird für Rust, Python und JavaScript durch die Tests der Programmemitter geprüft ([§5.1](#51-differential-testing-of-the-program-emitters)), gilt noch nicht für Scala, und wird unter dem Protokoll von [§2.3](#23-the-ecosystem-at-large-n) bei großem N geprüft. U3 ist eine Konstruktion, die Sprache für Sprache von der Grammatik aufgebaut werden muss; ein Go-Muster wird heute durch einen öffentlichen Test geliftet, und [§8.7](#87-lift-coverage-across-languages) beschreibt, wie die Konstruktion gemessen wird, während sie aufgebaut wird.

**Zwei Qualifikationen.** Die Hebung von U3 ist eine Konstruktion, und ihr Definitionsgebiet ist kleiner, als der obige Satz vermuten lässt. Die Form erfordert, dass jedes Programm endet (T2), also ist die Hebung von jeder Turing-vollständigen Sprache bestenfalls eine Abbildung vom terminierenden Fragment dieser Sprache, und die Mitgliedschaft in diesem Fragment ist unentscheidbar (Rice's Theorem angewandt auf ein totales Ziel [141]). Auf dem terminierenden Fragment ist die Hebung immer noch nicht kanonisch: Schließungsdarstellung, bei der Unterterme zu Steuerzuständen werden, und Auswertungsreihenfolge sind freie Wahl, und die Umkehrung existiert nur für Programme in defunktionierter Form [142, 143]. Also ist $\lambda_L$ eine Konstruktion auf dem Bild einer partiellen Abbildung, deren Definitionsgebiet unentscheidbar ist, die Lens-Rundreisebedingungen gelten auf diesem Bild, und „jedes bestehende Programm gelangt durch Hebung in sie“ ist eine Aussage über das Fragment, das die Konstruktion erreicht, gemessen wie in [§8.7](#87-lift-coverage-across-languages) gemessen. Die zweite Qualifikation betrifft den Hash, über den die Injektivitätsbehauptung gestellt wird. Spezifikation 6.1 hashen die positionalen Formen des Zustands und des Ereignisses (Regionen und Felder als Listen in Deklarationsreihenfolge, eine Variante durch ihren Index, ein Ereignis durch seinen Index unter den Ereignissen des Moduls); der gespeicherte Eintrag behält seinen lesbaren `event` und `state` bei, und eine Spur wiederholt die gehasheten Formen unter `hashed` (Spurformat `rce-trace/2`). Das Lean-Modul `RCE/NameFree.lean` hashen De Bruijn-Schlüssel, und `RCE/Positional.lean` modelliert die positionale Einbettung (Aufzeichnungen deklarierter Typen als Feldlisten in Deklarationsreihenfolge, Varianten als Index und Felder, Ereignisse durch Index, nicht deklarierte Aufzeichnungen durch Namen) und beweist, dass sie unter jeder injektiven Umbenennung unverändert bleibt, die unerklärte Namen fixiert, was die namenlose Projektion durchführt, also bleiben der Zustandshash und die gesamte Eintragskette für jede Hashfunktion unverändert; der Ereignisindex, den sie hashen, ist per Definition der Deklarationsindex des De Bruijn-Modells, also stimmen die beiden Kodierungen auf dem von ihnen geteilten Komponenten überein. Der Referenzprüfer und die Python-, JavaScript- und Rust-Laufzeiten stimmen in den Hashes überein, und ein Test prüft, dass ein Programm und seine namenlose Projektion dieselben Log-Hashes haben, wie T7 besagt; bei dem öffentlichen Commit `f2bd7222`, der `RCE/Positional.lean` hinzufügt, besteht die Prüfung bei 5.052 Theoremen mit nur Standardaxiomen. Ein früherer Referenzprüfer hashen den benannten kanonischen JSON, also hingen seine Log-Hashes von Namen ab, während die Modellhashes nicht taten; das Spezifikationsregister der Vorschläge dokumentiert diese Entdeckung, den Test, der sie demonstrierte, und ihre Lösung als Erratum unter C.15 (der Log-Eintrag liegt außerhalb der Bedeutung eines Programms), mit den Spur-Testfällen, Anwendungsgolden, 130 Konformitätsstiften und den Regenerierung der Feed-Vektoren der Standardbibliothek.
<div id="37-the-language-one-text-costs-and-theorem-status" class="anchor-alias" aria-hidden="true"></div>

### 3.7 Die Sprache: ein Text, Kosten und Theorem-Status

Die RCE-Sprache wird durch eine schriftliche Spezifikation ([/rce/spec/](/rce/spec/); Quelle im [rce-Repository](https://github.com/openIE-dev/rce)) definiert. Es gibt eine Sprache, den Text der Spezifikation an einem Commit, und jedes Modul eines Programms ist in ihr enthalten (Spezifikation 2.7). Abschnitte 2 bis 10 definieren den Kern; Anhang C definiert Konkurrenz (`par`, `for ... par`, `with budget`, Workgroups, LVars, Sitzungen und Aufsichtspersonen) und gilt für jedes Modul; Anhang D definiert das Profil der Engine: die Handler-Spezifikationen und Passungen des Entwurfs der Engine. Keine Deklaration wählt ein Dialekt aus: ein Kommentar `# rce-version:` in der ersten Zeile ist ein Versionslabel, das den Commit der Spezifikation benennt, gegen die ein Modul geschrieben wurde, wird vom Prüfer ignoriert und nicht gehasht, und eine Konstruktion, die der Prüfer nicht implementiert, wird als reserviert abgelehnt, nicht implementiert (W-RES-1, Anhang F.12). Die Sprache befindet sich in der Entwicklung und ändert sich, wenn bessere Formen gefunden werden: eine Form kann hinzugefügt, verallgemeinert oder ersetzt werden, und die Änderung und jedes Programm im Repository, das sie berührt, bewegen sich gemeinsam in einem Commit, nie als eine pro-Modul-Entscheidung, sodass ein Programm nie von der Version eines anderen Programms oder einer Bibliothek abhängt: alles, was an einem Commit geprüft wird, stimmt mit der Spezifikation an diesem Commit überein.

**Warum ein Text und keine Versionsauswahl.** Der Aufzeichnungsbefehl unterstützt diese Regel, nicht die pro-Modul-Auswahl, die frühere Entwürfe hatten. Die Abhängigkeitsauflösung mit einer Version pro Paket und beliebigen Einschränkungen ist NP-vollständig, bewiesen für Linux-Verteilungen [176], erneut formuliert im Jahr 2020 für jedes nicht-triviale Komponentenmodell [177] und unabhängig für Sprachpaketschalter durch Reduktion von 3-SAT [178]. Eine semantische Versionsnummer trägt nicht das Versprechen, das sie macht: über sieben Jahre führten über ein Drittel der Veröffentlichungen im Maven Central eine bruchhafte Änderung ein, in Minor- und Patch-Veröffentlichungen so oft wie in Major-Veröffentlichungen [179], eine Wiederholung bei 119.879 Upgrades fand immer noch 20,1 % der Nicht-Major-Veröffentlichungen bruchhaft [180], und der Google-Ingenieurtext schließt, dass semantische Versionierung eine verlustreiche Zusammenfassung des Risikos ist, eine Änderung anzunehmen, und hält eine Version von allem in einem Repository [181]. Die Exposition ist eine Eigenschaft des transitiven Graphen: bei mehr als 80 % der 35.863 Maven-Artefakte, die von der Log4j-Schwachstelle betroffen waren, war die Abhängigkeit mehr als eine Ebene tief [182]. Wo der Aufzeichnungsbefehl konvergiert, ist es die Identität, die aus dem Inhalt abgeleitet wird, sodass zwei verschiedene Dinge niemals einen Namen teilen und Varianten koexistieren [183, 184], Änderungen durch Akkretion unter Namen, die nie wiederverwendet werden [185], und ein direkter Beweis, dass eine Änderung das Verhalten bewahrt, nicht eine Zahl, die es behauptet [186]; der Hardware-Entwurf hat solch einen Beweis, Äquivalenzprüfung, als das Tor auf jedem Revision für zwei Jahrzehnte [187], und reproduzierbare Builds verknüpfen ein Artefakt mit seiner Quelle durch seinen Hash [188]. Der RCE-Entwurf nimmt jede dieser als Regel: einen Text an einem Commit, Definitionshashes mit einer geschlossenen Kompatibilitätstabelle (F.4.3), ein Manifest, das durch Hash mit keinem Resolver fixiert (F.5.3), namenfreie Log-Hashes (T7) und Verhalten als einziger Sinn, dass zwei Programme gleich sind ([§3.8](#38-behaviour-equivalence-and-dimension)). Die Umfrage vom 24. Oktober 2026, die den Aufzeichnungsbefehl gegen diese Regeln liest, mit den Lücken, die sie auflistet (ein ganzzahliger Hash, die Äquivalenzprüfung, die als Tor auf jeder Änderung durchgeführt wird, Herkunft in emittiertem Code), ist im Datenrepository ([/data/](/data/#rce)) und ihr Vorschlag ist `spec/proposals/one-commit-change.md`.

**Budgets zählen Arbeit.** Ein `with budget`-Block berechnet jedem Vorgang eine festen Kosten aus der Tabelle von Anhang C.6.4 und fängt mit `budget` ab, wenn die Anzahl aufgebraucht ist. Die Anzahl ist ein Proxy für Arbeit, nicht eine Messung von Zeit oder Energie; `est_j` ist getrennt.

| Vorgang | Kosten |
|---|---|
| Aufruf einer Benutzerfunktion oder eines Closures, $c_{call}$ | 4 |
| Standardbibliothodmethode auf Empfängergröße $n$, erste Argumentgröße $k$ | $4 + w(m, n, k)$ |
| Kanalsendung oder -empfang | 8 |
| `spawn` | 32 |
| ein `par`-Zweig oder `for ... par`-Chunk | 16 |
| Liste oder Map-Literal, oder Verständnis, mit $n$ Ergebnissen; `[x; n]` | $4 + n$ |
| Index, Slice, Mitgliedszugriff; einstellige Operatoren; `and`, `or`; Integer-, bool- und Textoperatoren und -Vergleiche | 1 |
| Float `+`, `-`, `*` | 2 |
| Float `/`, `%` | 8 |

Größen sind die UTF-8-Byte-Länge eines Textes, die Länge einer Liste und die Anzahl der Einträge einer Map; jeder andere Wert hat Größe 0. Die Methodenarbeit $w$ wird durch die Komplexitätsklasse der Methode im Referenzevaluator festgelegt: $n + k$ für lineare Methoden auf Text, Listen und Maps (Maps sind geordnete Assoziationslisten), $n \lceil \log_2 n \rceil$ für `sort` (0, wenn $n \le 1$), und 0 für die verbleibenden Methoden. Die Aufrufe, die `map`, `filter` und `fold` an ihre Funktionenargumente machen, werden zusätzlich als Aufrufe berechnet. Die Arithmetik sättigt bei der größten 128-Bit-Ganzzahl, und $w$ nimmt nie ab, wenn $n$ oder $k$ wächst. Der Referenzevaluator und die emittierten Rust-, Python- und JavaScript-Runzeiten berechnen die gleiche Funktion, und ein Test prüft, dass der Budget-Abbruch auf dem gleichen Vorgang in allen vier fällt.

**Eine Kostenregel.** Die Kosten eines Standardbibliothodmethaufrufs sind die eine Kosten des Textes, in jedem Modul und wo immer der Aufruf ausgeführt wird (Spezifikation 2.7, C.15). Die Regel ist lexikalisch für den Text, nicht für ein Modul, also ändert das Verknüpfen von Modulen keine Kosten; Tests prüfen sie an Modulgrenzen in beide Richtungen auf dem Referenzevaluator und auf den emittierten Rust-, Python- und JavaScript-Programmen.

**Theorem-Status.** Die Spezifikation formuliert Theoreme T1 bis T34 und verzeichnet den Status jedes genau. Die Beweise sind in Lean 4 (v4.12.0, keine Mathlib) über einen Kernkalkül. Die Wörter, die für den Grad eines Ergebnisses verwendet werden, sind diese. *Bewiesen* bedeutet einen Lean-Beweis über die Kernsemantik der Sprache. *Bewiesen auf einer Semantik* bedeutet einen Lean-Beweis über eine Schritt-für-Schritt-Semantik eines Kerns von RCE. *Modell* bedeutet einen Lean-Beweis über ein abstraktes Modell, das nicht mit der RCE-Semantik oder dem Referenzevaluator verbunden ist. *Vektoren* bedeutet, dass die Ergebnisse des Referenzevaluators auf generierten Programmen durch den Lean-Kern gegen das Modell geprüft werden, was eine Korrespondenz auf Stichproben, nicht einen Beweis über den Evaluator, ist. *Getestet* bedeutet Differenzentestung auf angegebenen Eingaben. *Mechanisch geprüft* bedeutet entschieden durch ein Programm, wie einen LALR(1)-Tabelle-Builder.

| | Aussage | Grad |
|---|---|---|
| T1 | Determinismus: ein Ergebnis pro Zustand und Ereignis; ein Ergebnis pro Takt der Konkurrenzsemantik | bewiesen |
| T2 | Vollständigkeit von $\delta$, mit einer expliziten Grenze auf Auswertungsschritten; strukturelle Rekursion und Grenzkomposition entlang des Aufrufgraphen | bewiesen (der Lean-Ausdruckskern hat keine Benutzerfunktionaufrufe; Rekursion und Komposition sind auf getrennten Modellen bewiesen) |
| T3 | Der Laufzeitzustand ist $\mathrm{foldl}(\delta_1, s_0, D)$ und Wiederholung reproduziert jeden Hash und Ausgabe | bewiesen |
| T4 | Fortschritt, einschließlich Takte (einige Aufgabe bewegt sich, oder der Lauf endet oder meldet `Deadlock`) | bewiesen |
| T5 | Erhaltung, einschließlich des Integerbereichs jedes geschriebenen Feldes | bewiesen |
| T6 | Speicher-Sicherheit, vollständige Ausleihpfade, keine mutable Freigabe zwischen Aufgaben | bewiesen für den Eigentums-Kern und eine instrumentierte Semantik der Ausleihpfade |
| T7 | Namensunabhängigkeit von Log-Hashes, IDs und Select-Wahl | bewiesen |
| T8 | Atomarität: ein abgelehntes Ereignis lässt den Zustand unverändert | bewiesen |
| T9-L | Die Programmausgeber (`rust`, `python`, `js`) stimmen mit dem Referenzevaluator überein | bewiesen für den Rust-Ausgeber auf einem Kern, als eine verifizierte Übersetzung in MiniRust, eine tiefe Einbettung des emittierten Rust-Unterabschnitts; dass `rustc` MiniRust implementiert, wird vertraut und getestet; die anderen Ausgeber getestet |
| T10 | Die Grammatik ist unambig | mechanisch geprüft (LALR(1), 0 Konflikte, für beide Versionen) und von einem Fuzzer beispielhaft geprüft |
| T11 | Select-Fairness | bewiesen auf dem Rotationsmodell |
| T12 | Ein linearer Handle wird auf jedem Pfad genau einmal verbraucht | bewiesen auf einem Aussagesmodell |
| T13 | f32-Operationen liefern die gleichen Bits auf Zielen, die sich auf IEEE 754 einigen | bewiesen für Multiplikation; für Addition, Subtraktion und Division ist die Einzelrundungseigenschaft Figueroas Theorem, zitiert und nicht mechanisiert |
| T14 | Geprüfte u64-Arithmetik ist innerhalb des Bereichs exakt | bewiesen |
| T15 | Iteratoren enden, respektieren die Schleifenbegrenzung und sind Präfix-konsistent | bewiesen |
| T16 bis T31 | Anhang C Konkurrenz: `par`-Determinismus, Vertauschbarkeit, Reduktionen, Deadlockfreiheit, Fristen, Workgroups, Vektuhr, Prioritäten, Scopes, Akteure, Sitzungen, LVars, atomare Batches, Replikate | bewiesen auf einer Semantik: T16, T17, T19a, T20, T23; bewiesen auf einem Modell von Lauf: T24; bewiesen auf einem Sitzungsrechnen: T28; Modell: T18, T19b, T21, T22, T25, T26, T31; Modell mit Vektoren: T27, T29, T30. Keiner ist ein Beweis über den Rust-Referenzevaluator |
| T32 | Fremd-Wiederholung: Für jeden Orakel, Wiederholung des Logs entspricht dem Live-Lauf, und ein Antwortvertrag gilt für jede geloggte Antwort | bewiesen |
| T33 | `&mut` Wiederherstellung bei Fehlschlag (F.4.4): ein fehlgeschlagener Aufruf lässt den Aufrufers `&mut` Zustand wie beim Aufruf; ein zurückkehrender Aufruf schreibt zurück (die frühere Regel, Kopie bei jedem Ergebnis, ist veraltet) | bewiesen |
| T34 | Die ordnungserhaltende A-Normalform (ANF) Passage vor jedem Ausgeber gibt den gleichen Wert, Speicher und Spur von Gebühren und Emissionen | bewiesen für einen Kernabschnitt mit voller ANF; die Implementierung wird differenziell auf den Rust-, Python- und JavaScript-Zielen getestet, einschließlich eines Sweeps der Budgets über den Abbruchpunkt; die Scala-Ausgabe geht durch die gleiche Passage, ist aber nicht in diesen Tests |

T9-L ist der Anspruch über die Programmausgeber der Sprache, den [§5.1](#51-differential-testing-of-the-program-emitters) beschreibt; ein Ziel außerhalb dieser Menge hat keinen T9-Anspruch. Die Spezifikation formuliert auch T9-F, für die Ziele des Form-Compilers der Engine, und [§10](#10-work-to-finish) listet ihre Test.

![Gitter von 34 Einträgen, T1 bis T34 mit T9 als T9-L und T19 in T19a und T19b aufgeteilt, jeder mit einem kodierten Grad. Bewiesen: T1, T2, T3, T4, T5, T7, T8, T14, T15, T32, T33; Bewiesen für einen genannten Kern oder Fragment; Rest getestet oder zitiert: T6, T9-L, T13, T34; Bewiesen auf einer Schritt-für-Schritt-Semantik eines Kerns von RCE: T16, T17, T19a, T20, T23; Bewiesen auf einem benannten Modell (Rotation, Aussage, Lauf, Sitzungsrechnen): T11, T12, T24, T28; Modell: T18, T19b, T21, T22, T25, T26, T31; Modell, mit Referenzevaluator-Vektoren durch den Lean-Kern geprüft: T27, T29, T30; Mechanisch geprüft (LALR(1)-Tabellen): T10.](/figures/rce/theorem-status.svg)

*Abbildung 3. Theorem-Status, T1 bis T34. Grad jedes Theorems wie in der Spezifikation an öffentlichem Commit `ac95172` (Entwurf 0.7); Theoreme nach T34 sind nicht gezeigt, und T9 wird als T9-L, der Anspruch über die Programmausgeber, gezeigt. `P`: Lean-Beweis über die Kernsemantik. `P*`: bewiesen für einen genannten Kern oder Fragment, der Rest getestet oder zitiert. `S`: bewiesen auf einer Schritt-für-Schritt-Semantik eines Kerns von RCE. `M+`: bewiesen auf einem benannten Modell (Rotation, Aussage, Lauf, Sitzungsrechnen). `M`: Lean-Beweis über ein abstraktes Modell. `MV`: Modell, mit Referenzevaluator-Vektoren durch den Lean-Kern geprüft. `C`: mechanisch geprüft. T16 bis T31 sind die Konkurrenztheoreme des Anhangs C, und keiner ist ein Beweis über den Rust-Referenzevaluator. Lean 4 v4.12.0, keine Mathlib. Quelle: `spec/book/10-theorems.md` und Anhang C.13. Eine [PNG-Kopie](/figures/rce/theorem-status.png) wird bereitgestellt.*

**Prüfungen laufen.** Bei öffentlichem Commit `e416fd0` vervollständigt `lake build` über die 58 Dateien von `spec/lean/RCE/` ohne `sorry` (46 Dateien bei öffentlichem `4304048`), und der laufende Audit berichtet die Axiome von 4.877 Theorem-Konstanten als nur `propext`, `Quot.sound` und `Classical.choice`. Der Audit zählt jede Theorem-Konstante in der Kernel-Umgebung, einschließlich Konstanten, die der Elaborator generiert, also unterscheidet sich von der Anzahl der `theorem`- und `lemma`-Deklarationen in der Quelle, die 1.116 bei demselben Commit ist. Bei demselben Commit hält die Referenzprüferquelle 385 Testfunktionen. Bei öffentlichem Commit `ac95172` baut die Spezifikationsprüfung die LALR(1)-Tabellen der Kerngrammatik (Abschnitte 2 bis 10, 932 Zustände) und der Grammatik mit Anhang C (1.110 Zustände) mit 0 Konflikten, akzeptiert 51 von 51 gültigen Beispielen, lehnt 12 von 12 Syntaxablehnungen und 64 von 64 schlecht typisierten oder unzulässigen Programmen ab, und analysiert jedes Beispiel mit drei Parsern, und der WebAssembly-Bau des Prüfers passt 401 von 401 Prüfungen gegen die Beispielkorpora.

**Eine Konvergenzbeobachtung.** Zwei Durchgänge vom 24. Oktober 2026 katalogisierten 111 Programmiersprachen, die erstmals zwischen Januar 2024 und Oktober 2026 öffentlich gemacht wurden [189, 190]: 72 für Sprachmodelle oder Agenten als Autoren oder hauptsächlich von einem Agenten implementiert (48 aus dem Katalog agentlanguages.dev [166], gelesen in seinem Quellrepository, und 24 darüber hinaus), und 39 allgemeine oder Systemsprachen, mit 35 Sprachen vor 2024, die in dem Fenster einen Meilenstein erreichten. Unter den maschinengeschriebenen Eingängen ist die Anzahl pro Jahr 3, 10 und 57 für 2024, 2025 und 2026. Zwei Positionen sind fast universell: Ablehnung von ungültigem Eingang an einer Grenze (54 von 72) und Emission in eine andere Sprache (57 von 72; 17 von 39 allgemeinen Eingängen, mit Go als Ziel von 2026 und C als Systemstandard). Minderheiten nehmen eine kanonische Form an (25 von 72), Beispiele oder Tests innerhalb des Programms (21 von 72; 2 von 39), eine schriftliche Spezifikation als autoritative Definition (16 von 72; 14 von 39), deterministische Auswertung als genannte Tor (13 von 72; 3 von 39, unter ihnen Gossamer, Dawn und Wyzer) und Speichersicherheit ohne Sammler (8 von 72; 7 von 39, konvergierend auf präzise Referenzzählung oder Eigentum anstelle von Lebensdauerannotationen, mit Goose's Datenstapeln als Ausreißer [191]). Ein append-only-Log mit Wiederholung (5 von 72; keiner von 39) und hash-identifizierte Definitionen (2 von 72; 3 von 39, Bend, Scrapscript und Dawn [192]) sind selten, und eine Zwischenform als Quelle der Wahrheit fehlt bei den neuen allgemeinen Sprachen. Ein klarer Trend von 2025 und 2026 ist Sprachen, deren Compiler hauptsächlich von Modellagenten geschrieben wurden und als solche offengelegt wurden, unter ihnen Goose, Rue, Cursed und Jolt, deren Leistungsansprüche selbstberichtet sind. Die Designentscheidungen dieses Papers wiederholen sich also dort, wo sie billig sind (ein deklarierter Ausgang für jedes Eingang an der Grenze, Ausgabe in eine Gastsprache) und bleiben selten dort, wo sie Theoreme hier sind (eine kanonische Form, Beispiele als Teil des Programms, Wiederholung aus einem hash-chained Log, namenfreie Identität). Dies ist eine Beobachtung, dass Entscheidungen sich wiederholen und wo; es ist keine Beweis dafür, dass sie korrekt sind, und dieses Paper macht keine Qualitätsgleichvergleiche mit diesen Projekten. Der Emit-Register-Vorschlag des Spezifikationsrepository listet jeden Eingang als Ziel und eine Quelle unter denselben Bedingungen wie jede andere Sprache; keiner von ihnen wird heute gehoben oder emittiert ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)).
<div id="38-behaviour-equivalence-and-dimension" class="anchor-alias" aria-hidden="true"></div>

### 3.8 Verhalten, Äquivalenz und Dimension

Definition 3 besagt, dass zwei Passungen äquivalent sind, wenn ihre Ausgabesequenzen auf jeder Ereignissequenz übereinstimmen. Dieser Abschnitt verleiht dieser Definition eine universelle Eigenschaft, definiert die Dimension eines Programms als berechnete Zahl und berichtet über die registrierten Messungen davon. Der normative Text ist Abschnitt 6.10 der Spezifikation (Entwurf 0.9, Commit `45fc95c`), mit den Sätzen T57 bis T61 und dem Befehl `rce dim`.

**Verhalten als Punkt in der endlichen Koalgebra.** Fixiere ein Programm $P$ mit Zustandsraum $S$, Ereignisalphabet $E$ und $\delta : S \times E \to S \times O^*$, und schreibe $\delta_1 = \pi_1 \circ \delta$ und $\lambda = \pi_2 \circ \delta$ wie in Definition 1. Das Verhalten eines Zustands $s$ ist die Funktion $\mathrm{beh}_P(s) : E^* \to (O^*)^*$ mit $\mathrm{beh}_P(s)(\varepsilon) = \varepsilon$ und $\mathrm{beh}_P(s)(e \cdot w) = \lambda(s, e) \cdot \mathrm{beh}_P(\delta_1(s, e))(w)$: die Schritt-für-Schritt-Ausgaben entlang jeder Ereignissequenz. $(S, \langle \lambda, \delta_1 \rangle)$ ist eine Koalgebra des Funktors $F(X) = (O^* \times X)^E$; $F$ hat eine endliche Koalgebra $\mathrm{Beh}$, deren Träger die Menge der kausalen Stream-Funktionen ist, und $\mathrm{beh}_P$ ist der eindeutige Koalgebra-Morphismus $S \to \mathrm{Beh}$ (Rutten [144], Satz 2.3). Zwei Passungen sind äquivalent, $F \equiv G$, wenn $\mathrm{beh}_F(s_0^F) = \mathrm{beh}_G(s_0^G)$. Dies ist Definition 3 wiederholt; der neue Inhalt ist, dass $\equiv$ Gleichheit in einem Objekt ist, in das jeder Form, in jeder Passungssprache, durch die gleiche Konstruktion abgebildet wird. Der Verhaltensraum ist keine Mannigfaltigkeit: er trägt die Präfix-Ultrametrik $d(b_1, b_2) = 2^{-n}$, $n$ die Länge der kürzesten unterscheidenden Ereignissequenz, unter der er vollständig und vollständig getrennt ist [145]. Übereinstimmung der Spuren auf jeder Sequenz der Länge höchstens $k$ bestätigt daher $d \le 2^{-(k+1)}$: eine Kugel um das Verhalten, nicht das Verhalten selbst. Das ist, was die Differentialtests von [§5.1](#51-differential-testing-of-the-program-emitters) etablieren, und es kommt nie in einen Hash.

**Zwei Beweismethoden.** Eine Relation $R \subseteq S \times S$ ist eine Bisimulation für $P$, wenn $s\,R\,t$ impliziert, dass für jedes $e$, $\lambda(s, e) = \lambda(t, e)$ und $\delta_1(s, e)\,R\,\delta_1(t, e)$. T58 besagt, dass $\mathrm{beh}_P(s) = \mathrm{beh}_P(t)$ genau dann gilt, wenn eine Bisimulation $s$ und $t$ verknüpft: um zwei Passungen äquivalent zu zeigen, die Relation zu präsentieren; um sie unterschiedlich zu zeigen, eine unterscheidende Sequenz zu präsentieren, die auch den Abstand gibt. T1 und T2 (Vollständigkeit und Determinismus) sind genau die Vollständigkeit und Determinismus, die den minimalen Maschine eindeutig machen; eine unvollständig spezifizierte Maschine hat keine eindeutige Minimum [146].

**Dimension.** $\mathrm{reach}(P)$ ist die Menge der Zustände, die von $s_0$ erreichbar sind; sie ist endlich, weil $S$ unter den Wert- und Größenbeschränkungen der Spezifikation (N9) endlich ist. Die Dimension von $P$ ist

$$\dim(P) = |\{\mathrm{beh}_P(s) : s \in \mathrm{reach}(P)\}|,$$

die Anzahl der unterschiedlichen Verhaltensweisen, in denen $P$ sein kann, was der Nerode-Index seines minimalen Mealy-Automaten [147] ist, berechenbar für ein explizites Alphabet in $n \log n$ [148]. $\log_2 \dim(P)$ sind die Bits des Zustands, die das Verhalten benötigt; $\log_2 |\mathrm{reach}(P)| - \log_2 \dim(P)$ ist die *Redundanz* der Passung, die Bits des Zustands, die keine zukünftige Ausgabe verändern. Eine Steuerdimension $\dim_c(P) \le \dim(P)$ wird auf der Projektion definiert, die jedes Guard über $\Sigma_d$ durch sein Prädikatsymbol ersetzt, ein symbolischer endlicher Automat [149], und seine minimale Maschine, nummeriert durch eine Breitensuche in der kanonischen Ereignisreihenfolge, hat eine eindeutige namenlose Zeichenfolge [150]; ihre SHA-256 über kanonischen JSON ist `shape_ctl`, ein dritter Schlüssel neben dem namenlosen Term-Hash und dem e-Klasse-Schlüssel der Definition 6. Gleichheit bei jedem Schlüssel impliziert Äquivalenz; Ungleichheit impliziert nichts.

Was hier ein Theorem ist und was nicht, sollte klar gesagt werden. $S$ und $E$ sind endlich durch die Wertbeschränkungen und astronomisch groß: $|S| \le 256^{\mathrm{VALUE\_LIMIT}}$ pro Feld, also macht die Endlichkeit jede Verhaltensfrage entscheidbar und keine von ihnen tractabel. Die minimale Maschine ist eine kanonische Form für die endliche Steuerungsprojektion, wo symbolische Automatenminimierung bis auf Prädikatäquivalenz eindeutig ist [149]; für Felder, die nur verglichen und kopiert werden, geben Registerautomaten einen Myhill-Nerode-Satz [151]; der Moment, in dem $\delta$ ganze Zahl-Arithmetik in den Zustand bringt, ist der einzige kanonische Gegenstand der Term selbst. „Jeder Form ist ein endlicher Mealy-Automat, und seine minimale Maschine ist seine kanonische Form“ ist daher für $\Sigma_c$ plus Guard-Prädikate wahr und ist kein berechenbarer Anspruch für $\Sigma_d$. Das ist auch die ehrliche Lesart von Proposition 3: die geringste-Joule-Extraktion gibt den geringsten-Joule-Term *den Extraktor findet*, und drei unterschiedliche Funktionen sind auf einer e-Klasse definiert: die Ziel-Blind-Budget-Einheiten der Spezifikation C.6, die den Budget-Trap auf die gleiche Operation in jedem Laufzeit und nie Joule setzen; `est_j`, die pro Ziel ([§6.3](#63-energy)) ist; und der gehashte Vertreter, der durch Bäumekosten mit einem kanonischen-JSON-Gleichstand für Wiederholbarkeit gewählt wird. Der emittierte Term und der gehashte Term einer e-Klasse können sich unterscheiden; weder kann sich unterscheiden, wenn der gleiche Log gegeben wird.

**Status der Theoreme.** T57 (Endlichkeit: $\mathrm{beh}_P$ ist der eindeutige Koalgebra-Morphismus), T58 (Äquivalenz ist Bisimilitarität), T59 (Spurübereinstimmung bis zur Länge $k$ begrenzt den Abstand durch $2^{-(k+1)}$), T60 (für endliches $S$ ist der Quotient von $\mathrm{reach}(P)$ durch die größte Bisimulation die minimale Maschine, mit $\dim(P)$ Zuständen) und T61 (`shape_ctl` ist unter Umbenennung und unter prädikatäquivalenten Umformungen der Guards invariant) sind in Kapitel 10 der Spezifikation formuliert, und `spec/lean/RCE/Behaviour.lean` ist in `lake build` (Lean 4.12.0; bei öffentlichem Commit `f2bd7222`, `scripts/lean-audit.sh` liest 5,052 Theoreme mit Standardaxiomen nur und kein `sorry`). Was bewiesen wird, im genauen Umfang des Kapitels: die Morphismusgleichung von T57 (`beh_cons`; Eindeutigkeit des Morphismus wird formuliert, nicht bewiesen); T58 für ein Programm und für zwei (`bisim_beh`, `beh_bisim`, `behEq_iff_bisim`, `bisim2_beh`, `beh_bisim2`); und T59 in beide Richtungen über ein explizites endliches Alphabet, die deklarierten Ereignisse über die Grenzmenge, die `rce dim` erkundet (`trace_ball`, `ball_trace`), mit der Aussage über alle $E$ formuliert, nicht bewiesen. T60 wird formuliert, mit einem Modellbeweis durch Partitionserweiterung als nächsten Schritt. T61 wird nur für Umbenennung getestet, gegen die namenlose Projektion `rce fmt --nameless`, die ein Programm mit positionellen Namen in der Reihenfolge der ersten Deklaration druckt und akzeptiert, wenn die Quelle akzeptiert wird, mit den gleichen Spur-Hashes durch T7; ihre Invarianz unter Guard-Umformungen wird formuliert, nicht bewiesen, und der symbolische Quotient wird nicht implementiert.

**`rce equiv`: der Äquivalenz-Check als Werkzeug.** `rce equiv A B` erkundet zwei Programme von ihren Anfangszuständen über die gleichen Ereignisinstanzen, vergleicht jeden Schritt durch seine namenlose Ausgabe (emitierte Werte in positionierter Form, eine Ablehnung durch den Fehler-Index ihrer Deklaration, T7), verfeinert die beiden Graphen gemeinsam und liest, ob die beiden Anfangszustände in eine Klasse fallen (T58); wenn sie nicht tun, druckt es die kürzeste unterscheidende Ereignissequenz und die beiden Ausgaben am Ende. `rce change OLD NEW` kombiniert es mit dem Export-Diff von F.4.3 und klassifiziert eine Änderung als Erratum (jeder Export kompatibel, jedes Verhalten behalten), eine Bedeutungsänderung oder eine Schnittstellenänderung, was die Regel von C.15 durch das Werkzeug entscheidet. Wenn zwischen jedem Corpus-Programm und seiner namenlosen Projektion als kontinuierlichen-Integration-Schritt gelaufen, fand der Check ein Programm, dessen Projektion abgelehnt wurde (ein Zustandsfeld, das wie eine Standardbibliotheksmethode benannt war, hatte die Methode umbenannt); die Projektion wurde korrigiert und die Durchsicht berichtet, dass jedes Corpus-Form äquivalent zu seiner Projektion ist, wie T7 besagt. Es ist die Form-Variante des Äquivalenz-Checks, den Hardware-Design auf jeder Überarbeitung läuft ([§3.7](#37-the-language-one-text-costs-and-theorem-status)): eine Änderung, unter der jedes Programm sein Verhalten behält, ist ein Erratum, jede andere eine Bedeutungsänderung, entschieden durch das Werkzeug und nicht durch eine Versionsnummer. Mit `rce hash`, das einen Program-Hash über die namenlose Projektion druckt (ein Hash für ein Programm und seine Umbenennung, einen anderen für einen geänderten Schritt), und der Herkunftslinie, die jeder emittierte Datei jetzt trägt, sind die drei Mechanismen, die der Aufzeichnung in neuen Sprachen selten nennt (Abschnitt 3.7), Befehle des Referenzprüfers.

**`rce dim`, und die registrierten Laufzeiten.** `rce dim FILE [--fuel n] [--control]` erkundet $\mathrm{reach}(P)$ breitensuche über die deklarierten Ereignisse mit Nutzlasten, die aus jedem Felds Verfeinerungstyp gezogen werden oder, ohne einen, aus der Grenzmenge der Spezifikation 6.3, bis zu `--fuel` Zuständen, dann führt Hopcroft-Partitionserweiterung mit den Ausgaben als Anfangspartition durch (100.000 Zustände in 10 bis 40 s; die erste Moore-Iteration war quadratisch und endete nicht), und berichtet über erkannte Zustände, Verhaltensweisen (genau, wenn die Grenze nicht erreicht wird, sonst eine untere Grenze), Redundanz in Bits pro Region und mit `--control` die Steuerzustände und `shape_ctl`. Drei Beispiele wurden mit bekannten Werten geschrieben: ein Zähler mit einem ungelesenen Flag (1,00 Bit Redundanz), ein mod-6-Zähler, der Parität emittiert (1,58 Bits), und eine Tür mit drei erreichbaren Zuständen und keiner Redundanz. Die Vorregistrierung (`openie-research-experiments/rce/bench/dimension/PREREG.json`, registriert am 22. Oktober 2026, bevor der Befehl gebaut und vor jedem späteren Lauf geändert wurde, mit einem gehassten Nebenfahrzeug) fixiert die Bevölkerungen und drei Hypothesen über begrenzte Programme, deren erkannte Schritte emittieren oder ablehnen: H0, dass mindestens die Hälfte von ihnen mehr als 0,5 Bit Redundanz trägt; H1, dass ein Programm mit einem Emit-Ort mehr Redundanz trägt als ein Programm mit mehreren; und H2, dass eine Region mindestens 80 % der Redundanz trägt, wenn sie über 1 Bit geht. Sein Falsifizierer ist RCE-F6 von [§9](#9-falsifiers), ein Median-Redundanz unter 0,1 Bit. Die hier gemeldeten Laufzeiten, `dim-r2` bis `dim-r5`, wurden jeweils einmal mit `--fuel 100000 --control` gegen eine Bau eines öffentlichen Commits von openIE-dev/rce durchgeführt, mit dem Binärhash in jeder Zeile aufgezeichnet; die erste registrierte Laufzeit, `dim-r1`, und der Pilot davor sind in [§10](#10-work-to-finish) aufgelistet. Das Steuerlabel ist die Ablehnung oder die emittierten Konstruktoren nur, und $\dim_c \le \dim$ gilt in jeder Zeile dieser Laufzeiten. In einer Zustandsmaschine, deren Beispiele Zustand lesen, emittiert sie nie; die Absicht wird von den Beispielen und von keiner Ausgabe getragen; ein Bericht von `rce check`, der ein solches `Beispiel` nennt (ein, das ein Feld liest, das kein Schritt jemals emittiert oder ablehnt), ist ein offenes Angebot.

**Die gefrorenen Laufzeiten.** Die Laufzeit `dim-r2` vom 23. Oktober 2026 (Commit `1107442b` von openIE-dev/rce, registriert als zweite Änderung der gleichen Vorregistrierung vor der Laufzeit, mit dem Stratum gelesen vom Schlüssel, den `rce dim` bei diesem Commit als `observable` berichtete, jetzt `has_output`) sampelt das stratum, das Ausgaben trägt, nach Regel: jedes Programm der zusammengeführten Repository unter seinen Beispielen, Programmen, Anwendungen und Buchlisten, das allein akzeptiert wird, hat ein Zustandsbereich und enthält eine Emission oder eine Fehlschlag-Aussage. Das sind 25 Programme, 24 davon tragen Ausgaben, 14 begrenzt innerhalb von 100.000 Zuständen. Unter ihnen hat `ring_buffer` 12.500 erreichbare Zustände, 781 Verhaltensweisen und fünf Steuerzustände; vier Bits seines Zustands verändern keine Ausgabe, alle in einem Bereich, und seine Steuerprojektion, die nur verzeichnet, welche Schritte feuern, hat fünf Zustände. Die Ausschluss der drei Programme, die für `rce dim` geschrieben wurden, und ihre Buchkopien lässt 8 begrenzte Ausgaben tragende Programme übrig, von denen 6 mehr als 0,5 Bit (Wilson 95 % Intervall 0,41 bis 0,93) tragen, mit einem Median-Redundanz von 1,79 Bit (Interquartilbereich 0,25 bis 3,37); über alle 14, 10 von 14 (0,45 bis 0,88) und ein Median von 1,29 Bit. RCE-F6 (ein Median unter 0,1 Bit) wird nicht ausgelöst; der untere Endpunkt des Intervalls ist unterhalb der Hälfte, also wird H0 unterstützt und nicht etabliert bei dieser Größe. H1 wird nicht unterstützt (die beiden Einzel-Emit-Ort-Programme tragen 1,58 und 4,00 Bit, die beiden Mehr-Ort-Programme 2,51 und 3,65), und H2 gilt nur auf 8 von 9 qualifizierten Zeilen, weil 8 einen Zustandsbereich haben; das eine Zweibereichsprogramm weist 62 % seiner Redundanz auf seinen größeren Bereich zu. Die substantielle Ergänzung der Laufzeit sind drei Anwendungsgröße-Messungen. Die Chat-Anwendung erkundet 100.000 Zustände mit 176 Verhaltensweisen und 69 Steuerzuständen, also mindestens 9,15 Bit seines Zustands verändern keine Ausgabe, die größte gemessene Redundanz und eine untere Grenze; der selektive Weiterleitungs-Unit (40.218 Zustände, 7.038 Verhaltensweisen, 2,51 Bit) und der Terminal (3.390 Zustände, 270 Verhaltensweisen, 3,65 Bit) sind exakt. Das Verhältnis der Steuerzustände zu Verhaltensweisen variiert um eine Größenordnung über die Bevölkerung (5 bis 781 für den Ringpuffer, 69 bis 176 für den Chat, 5.095 bis 7.038 für den Weiterleitungs-Unit), was misst, wie viel von einem Programms Verhalten welche Schritte feuern gegen welche Werte fließen. Die Laufzeit zeigt auch, dass das Stratum eine feinere registrierte Regel benötigt: das Werkzeug-Flag ist wahr für ein Programm, dessen jede Ausgabe gleich ist (eine Konstante, oder eine Ablehnung, die jeder Zustand gibt), also sollte ein dritter Lauf „Ausgaben tragend, mit mehr als einem unterschiedlichen Ausgang“ registrieren, bevor er sampelt. Zeilen, Intervalle und die Änderung sind im Experiment-Repository unter `rce/bench/dimension/` (`results/dim-r2.jsonl`, `RESULTS.md`). Ein dritter Lauf, `dim-r3` (23. Oktober 2026, registriert vorher), wendete die feinere Regel an, die der zweite Lauf gefordert hatte: `rce dim` berichtet die Anzahl der unterschiedlichen Ausgaben (`distinct_outputs`; emitierte Werte und Ablehnungen werden getrennt als `emits` und `refuses` gezählt), und das Stratum ist ausgaben tragend mit mindestens zwei von ihnen. Auf 28 Programmen (die Bevölkerung des zweiten Laufs plus die drei akzeptierten Programme mit zwei oder mehr Zustandsbereichen), 22 sind streng ausgaben tragend und 12 davon sind begrenzt; der Median-Redundanz ist 1,29 Bit (8 von 12 über 0,5 Bit, Wilson 0,39 bis 0,86), und 2,05 Bit über die 6, die nicht für das Werkzeug geschrieben wurden. Die drei Programme, die die feinere Regel entfernte (ein Thermostat, ein Rekonkiliator und ein Warenkorb), sind jeweils nur durch eine Konstante beobachtbar, also hatten die Mediane des zweiten Laufs Bits gezählt, die eine Ausgabe verändern, die nie verändert wird. H2 wird dort getestet, wo es kann, auf dem einen streng ausgaben tragenden Mehrbereichsprogramm über 1 Bit, dessen größere Bereich 62 % trägt, unterhalb des 80 % Schwellenwerts; es bleibt offen auf einer Zeile. Ein vierter Lauf über die 86 Konformitätsprogramme mit Zustand (registriert vorher) maß die fünf ernten Host-Vertrag-Programme zum ersten Mal, alle begrenzt innerhalb des Kraftstoffes und tragen von 0,01 Bit (der Terminal-Treiber) bis 2,16 Bit (der Kanal-Treiber) mit Steuerquotienten in den Tausenden, und beantwortete die Mehrbereichsfrage für diesen Corpus: die einzigen streng ausgaben tragenden Mehrbereichsprogramme sind Daten unterschiedliche Kopien eines Fähigkeitsbeispiels, also kann H2 nicht aus bestehenden öffentlichen Materialien entschieden werden und der nächste Schritt ist das Schreiben beobachtbarer Mehrbereichsprogramme, registriert als Bevölkerung vor dem Lauf. Dieser Schritt wurde am 24. Oktober 2026 getroffen: zwölf Zweibereichsprogramme (ein Aufzug, ein Getränkeautomat, eine Kreuzung, ein Parkplatz, ein Drucker, ein Foyer, eine Bankkarte, ein Waschmaschine, eine Sitzung, ein Spieler, ein Klimaregler und ein Reservoir) wurden in den Programmkorpus geschrieben und als fünfter Lauf registriert, mit der Offenlegung, dass das Werkzeug auf den Entwürfen gelaufen ist. Alle zwölf sind streng ausgaben tragend, begrenzt und in Millisekunden erkundet; elf haben keine Redundanz und das zwölfte, der Klimaregler, hält 1,58 Bit in zwei Flags, die seine letzte Aktion aufzeichnen und nichts liest. Der Median ist 0,00 Bit, also wird RCE-F6 auf dieser Bevölkerung ausgelöst: zufälliger Zustand ist nicht üblich in kleinen Forms, deren Caps durch Ablehnungen erzwungen werden und deren Phasen emittieren. Lesen mit den früheren Laufzeiten (1,29 Bit über die streng ausgaben tragenden Handgeschriebenen Beispiele, 0,01 bis 2,16 Bit für die Host-Programme, mindestens 9 Bit für die Chat-Anwendung), wächst die Größe mit dem Programmgröße und der Anzahl der Felder, die nichts liest. Der Anspruch, den die Daten unterstützen, ist der Falsifizierers eigene: `rce dim` ist ein Diagnose für größere Programme und für Bereiche, die ohne Beobachter hinzugefügt werden, nicht eine Eigenschaft kleiner Forms im Allgemeinen.

**Der Konzept-Record.** Spezifikation 6.6 beschreibt jetzt eine unhashierte Seiten-Tabelle, die durch die namenlosen Schlüssel eines Programms indiziert ist und seine Namen, Absichtsstrings und Dokumentkommentare hält, und `rce emit form` druckt sie unter `names`, indiziert durch Deklarationsindex (den Index, den `shape_ctl` verwendet), nach den gehashten Feldern. Projektionen rendern sie; $\delta$ liest sie nie; sie ist das Komplement, das die Projektion eines Forms zu einem symmetrischen Lens [123] macht, nicht zu einer Retraktion. Die Beweise von [§2.1](#21-programming-is-coding-theory) sagen, dass die Tabelle den Konzept, den ein Name steht für, und nicht nur seine Schreibweise, halten muss, weil Wortwahl und Reihenfolge die beiden Schritte sind, bei denen Entwickler sich bei 6,9 % [137] nicht einigen, und der Schritt, bei dem sie sich einigen, ist der Konzept. Ob ein Modell sich von dem Form mit dem Record angehängt sowie von einer benannten Oberfläche ableiten kann, ist der erste der drei registrierten Experimente von [§12.3](#123-why-human-written-code-is-redundant) und ist offen.
<div id="4-the-engine-gears-gate-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## 4. Die Engine: Gänge, Tor und Belege

Dieser Abschnitt beschreibt das Design der Engine, das Appendix D der Spezifikation und deren Vorschläge definieren.

<div id="41-the-engine-is-a-form" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Die Engine ist eine Form

RCE führt Software als Graph kleiner deterministischer Handler aus. Ein Handler, der keine Entscheidung treffen kann, löst eine Eskalation aus. Ein Resolver beantwortet die Eskalation einmal, und die Antwort wird als permanenter Handler installiert, sodass der nächste Fall desselben Typs ohne Resolver läuft. Das Design erfordert, dass die Engine jede Form-Invariante erfüllt:

| Invariante | Was das Design von der Engine erfordert |
|---|---|
| Reload ist eine verifizierte Faltung | Reload liest den Log wörtlich, berechnet jede Hash- und Verknüpfung erneut und faltet den Rest mit $\delta$. Nichts wird erneut gestempelt. Eine beschädigte Kette weigert sich, geladen zu werden. |
| Namensfreie Tick-Reihenfolge | Handler laufen in topologischer Reihenfolge, dann nach einem namensfreien Knotenschlüssel. Ausgaben werden gesteuert und nachdem alle Handler abgelaufen sind, geliefert, wie in ASM-Semantik. Das Umbenennen jedes Knotens ergibt denselben anonymen Zustandshash an jedem Eingang. |
| Kein stiller Verlust | Ein voller Posteingang hält die Nachricht in einer geordneten Warteschlange und protokolliert `Backpressure`, und jede Aufgabe schließt dennoch. |
| Nutzlasten sind im Log | Eingaben, Ticks, Ergebnisse externer Handler, Installationen und Fehler sind Log-Einträge. Der Zustandshash nach jedem Eintrag stimmt mit einer Faltung aus einer leeren Engine überein. |
| Logische Uhr | Lebendigkeit zählt Ticks, nicht die Wanduhrzeit. |
| Stabile Hashes | SHA-256 (Secure Hash Algorithm, 256-Bit) über kanonischen JSON, Schlüssel an jeder Tiefe sortiert, für Einträge, Zustände, Formen und Regel-IDs. |

<div id="42-the-gears" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Die Gänge

Jede Gang wird nur dann versucht, wenn die Gang darunter das Tor nicht passiert. Diese Reihenfolge ist eine feste Kaskade.

| Gang | Methode | Abstammung |
|---|---|---|
| G0 Lookup | Ein gemeinsamer Handler-Repository, der nach SHA-256 Form-Hash sortiert; für Code-Reparatur, Lokalisierung zu rangierten Funktionen | Code-Suche und -Abruf [21] |
| G1 Regeln | Deterministische, geschützte Reparaturvorlagen und schema-abgeleitete Validatoren, jeder überprüft auf Empfindlichkeit gegenüber Mutationen | PAR, TBar, AVATAR, FixMiner [22, 23, 24, 25]; Code-Modifikationen wie Coccinelle [26] |
| G2 Synthese | Aufzählung über die Handler-Grammatik, Lösungsalgorithmen und e-Graphen | Sketching, SyGuS, egg [27, 9, 12] |
| G3 bis G5 Modelle | Ein typisierter Entscheidungsmodell, ein lokales kleines Modell, dann ein entferntes Modell, letzter | Modellkaskaden [28] |

<div id="43-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Das Tor

Ein Kandidat wird nur dann befördert, wenn er das Tor passiert. Das Tor spielt die aufgezeichneten Eingaben des Knotens erneut ab, führt den Kandidaten im Schatten auf frischen Proben mit einer Abdeckungsgrenze (das Gesetz der drei bei einem deklarierten Fehlerbudget) aus, überprüft das Ausgabeschema und erfordert das Zertifikat von Abschnitt 5. Ein abgelehnter Kandidat wird mit seinem Gegenbeispiel protokolliert.

![Diagramm. Vier Getriebeboxen gestapelt von günstigsten zu teuersten: G0 Lookup, ein gemeinsamer Handler-Repository, der nach SHA-256 Form-Hash sortiert; G1 Regeln, geschützte Reparaturvorlagen und schema-abgeleitete Validatoren; G2 Synthese, Aufzählung über die Handler-Grammatik, Lösungsalgorithmen und e-Graphen; G3 bis G5 Modelle, ein typisierter Entscheidungsmodell, ein lokales kleines Modell und ein entferntes Modell, als Vorschlagender markiert. Jedes Getriebe sendet seinen Kandidaten an ein Tor mit fünf Prüfungen: Wiederholung der aufgezeichneten Eingaben, Schattenlauf auf frischen Proben mit einer Abdeckungsgrenze, Prüfung des Ausgabeschemas, das Zertifikat der Modellprüfung des Kernels mit Kani, einem Modellprüfer für Rust, und für Umformungen eine zufällige Prüfung gefolgt von einem Beweis durch den Z3 SMT-Solver. Ein Pass befördert den Kandidaten zu einem gespeicherten Handler, der G0 versorgt; ein Fehlschlag wird mit seinem Gegenbeispiel protokolliert und eskaliert zum nächsten Getriebe.](/figures/rce/gears-gate.svg)

*Abbildung 4. Modelle schlagen vor, Prüfer entscheiden. Diagramm: Getriebe laufen in Reihenfolge der Kosten: G0 Lookup, G1 Regeln, G2 Synthese, G3 bis G5 Modelle (ein typisierter Entscheidungsmodell, ein lokales kleines Modell, dann ein entferntes Modell). Jeder Kandidat geht durch dasselbe Tor: Wiederholung der aufgezeichneten Eingaben des Knotens, Schattenlauf auf frischen Proben mit einer Abdeckungsgrenze, Prüfung des Ausgabeschemas und das Zertifikat der Modellprüfung des Kernels mit Kani, einem Modellprüfer für Rust (Abschnitt 5.3); ein vorgeschlagener Umformung benötigt auch eine zufällige Prüfung und anschließend einen Beweis durch den Z3 SMT-Solver (Abschnitt 5.2). Ein Kandidat, der besteht, wird befördert und schließt dieselbe Form bei G0 beim nächsten Mal; einer, der fehlschlägt, wird mit seinem Gegenbeispiel protokolliert und der nächste Getriebe wird versucht. Im Design ändern sich die Kani-Harnesses und die SMT-Kodierung nicht durch Beförderung. Quelle: Abschnitte 2.2, 4.2, 4.3, 4.6, 5.2 bis 5.5. Eine [PNG-Kopie](/figures/rce/gears-gate.png) wird bereitgestellt.*
<div id="44-receipts" class="anchor-alias" aria-hidden="true"></div>

### 4.4 Belege

Jeder Aufstieg, jede Ablehnung, Verzögerung und Installation ist eine Mutation in einem append-only-Log, das mit SHA-256 verkettet ist, also verfälscht man irgendeinen früheren Eintrag, bricht man die Kette [29, 30]. Der Kostenpreis jedes Handlers wird aus der Anzahl der Interpreteroperationen mit einer pro-Host-Kostentabelle berechnet und trägt die Bezeichnung `est_j`. Der Aufseher ist der Auflöser von Eskalationen der Engine, der die Gänge in Reihenfolge auf jeder Eskalation ausführt, und jeder seiner Aufrufe trägt einen Beleg. Ein Beleg nennt den Gang, die Methode der Schätzung (`basis`), die ausprobierten Kandidaten und ob der Gang die Eskalation gelöst hat. Sein Feld `est_j` ist erforderlich: es ist eine endliche nicht-negative Zahl oder `null`, und `null` ist nur erlaubt, wenn `basis` `unpriced` sagt, wie bei einem Modellauftrag ohne Energieangabe. Ein Beleg ohne das Feld ist nicht parsierbar. Eine unpreisgegebene Kosten ist nie als null Joule gelesen. Ein Gesamtbericht über Belege meldet seine preisgegebenen und unpreisgegebenen Aufrufe getrennt, und ein Einsparung, die von einer unpreisgegebenen Lösung abhängt, wird als unbekannt gemeldet.

![Diagramm. Oben: drei Log-Einträge, seq 0, 1 und 2, jeweils mit Feldern seq, event, prev_hash, state_hash und hash. Der erste prev_hash besteht aus 64 Nullen; jeder spätere prev_hash entspricht dem hash des vorherigen Eintrags, dargestellt als Pfeile. state_hash ist der SHA-256 des Zustands nach dem Schritt; hash ist der SHA-256 des kanonischen JSON von event, prev_hash, seq und state_hash. Unten: ein Gang-Beleg mit Feldern gear, gear_name, est_j, basis, candidates_tried und resolved, neben der Regel, dass est_j erforderlich ist und entweder eine endliche nicht-negative Zahl oder null ist, wobei null nur erlaubt ist, wenn basis `unpriced` sagt; eine unpreisgegebene Kosten wird nie als 0 J gelesen.](/figures/rce/receipt-chain.svg)

*Abbildung 5. Der Log ist eine Hash-Kette; jede Kosten trägt eine Basis. Diagramm: Einträge des dauerhaften Logs D sind `{seq, event, prev_hash, state_hash, hash}`. `state_hash` ist der SHA-256 des kanonischen JSON des Zustands nach dem Schritt; `hash` ist der SHA-256 des kanonischen JSON von `{event, prev_hash, seq, state_hash}`; der erste `prev_hash` besteht aus 64 Nullen, also verändert das Verändern eines früheren Eintrags jeden späteren Hash. Ein Gang-Beleg trägt `gear`, `gear_name`, `est_j`, `basis`, `candidates_tried` und `resolved`. `est_j` ist erforderlich und ist eine endliche nicht-negative Zahl oder `null` nur, wenn `basis` `unpriced` sagt; Modellauftrag-Belege tragen `est_uj` in Mikrojoule unter der gleichen Regel. Eine unpreisgegebene Kosten wird nie als 0 J gelesen. Hash-Bezeichnungen sind symbolisch. Quelle: Spezifikation 6.1 und Abschnitt 4.4. Ein [PNG-Abbild](/figures/rce/receipt-chain.png) wird bereitgestellt.*

<div id="45-the-form-compiler" class="anchor-alias" aria-hidden="true"></div>

<div id="45-the-compilers" class="anchor-alias" aria-hidden="true"></div>

### 4.5 Die Compiler

Der Compiler der Sprache ist der `rce emit TARGET FILE` des Referenzprüfers (Spezifikation 10.5). Er übersetzt ein Modul, das `rce check` besteht, in eines von fünf Outputs: `form`, die Form $P = (S, E, \delta, D, \lambda)$ als eine Zeile kanonischen JSONs, eine deterministische Funktion des Programmtexts; und vier Programme, `rust` (eine Rust-Quellendatei), `python` (eine Python 3-Datei), `js` (ein JavaScript-Modul für Node) und `scala` (eine Scala 3-Datei für die Java-VM). Die Programmuhrer übersetzen das geprüfte Modul, nicht die Form, und jeder Output ist eigenständig. Jeder Zieloutput wird generiert. Keiner wird verfasst. Die vier sind nicht gleichrangig. Auf der Konformitäts-Suite des Spezifikations-Repositorys (`conformance/reports/` bei öffentlichem Commit `464bd98b`) bestehen die Rust-, Python- und JavaScript-Outputs jeweils 1.459 Tests mit 0 Fehlern, und die anderen 520 betreffen keinen Emitter (Zugang, Host-Vertrag, Replikation und Tool-Befehle). Der Scala-Output besteht aus 52, scheitert an 1.189 und hat 591 nicht unterstützte von 1.832 Ergebnissen; 1.186 der Fehlschläge sind der Scala-Build oder -Ausführung, die mit Status 2 statt einem verglichenen Wert beendet werden, und diese Ergebnisse stammen vor der Umstellung der Suite auf die ein-Sprache-Regeln von [§3.7](#37-the-language-one-text-costs-and-theorem-status). Scala wird daher emittiert, stimmt aber noch nicht mit der Referenz überein, und es gibt keinen T9-Anspruch.

Spezifikation 6.3 korrigiert ein Verhalten an jedem numerischen Rand, das jeder Zieloutput reproduzieren muss: geprüfte Ganzzahl-Arithmetik fängt Überläufe des statischen Typs ab und wickelt nie; Ganzzahl `/` schneidet auf Null zu ($-7/2 = -3$); `%` nimmt das Vorzeichen des Dividenden ($-3 \bmod 2 = -1$); Division durch Null fängt ab; Gleitkommazahlen sind IEEE 754 binary64, korrekt gerundet einmal pro Operator, und ein nicht endlicher Ergebnis fängt ab; Zeit ist nur der logische Uhren. 

Im Entwurf der Engine ist ein zweiter Compiler, der eine Handler-Spezifikation und ihre Passung über einen e-Graph in eine Form-IR und projiziert sie auf weitere Ziele; sein Test wird in [§10](#10-work-to-finish) aufgelistet.
<div id="46-method-the-whole-stack-evaluated-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 4.6 Methode: der gesamte Stack bewertet, jede Schnittstellenannahme explizit

Ein Programm ist ein Stack von Ebenen: Quelltext und Aussagen; Handler; die Form, eine einzelne Schritt-Funktion $\delta : S \times E \to S \times O^*$ über $S = \Sigma_c \times \Sigma_d$ (Steuerungsbereiche; Daten: die Uhr, die Eingangszahl und typisierte Beziehungen); der Log, eine SHA-256-Hashkette, deren Einträge jedes Ereignis, den Hash des Zustands, den er erzeugte, und den Hash des vorherigen Eintrags aufzeichnen; die Umformungen, die die Form transformieren; und die Substrat, die sie ausführt. Jede Ebene beruht auf Annahmen über die Ebene darunter. In der Gestaltung behandelt RCE keine Ebene als fest: sie bewertet den gesamten Stack, schreibt jede Schnittstellenannahme als überprüfbare Aussage und überprüft sie bei jedem Lauf. Heute überprüfen die öffentlichen Tools die Log-Kette bei der Wiederholung (`rce host replay`) und vergleichen die emittierten Rust-, Python- und JavaScript-Programme mit der Referenz; die anderen Überprüfungen in der Tabelle unten sind Gestaltung ([§5.2](#52-the-proof-rule-for-rewrites) bis §5.4; für den Eingabe-Vertrag, [§10](#10-work-to-finish) Punkt 15).

| Grenze | Annahme | Überprüfung |
|---|---|---|
| Quelle zu Handler | eine Eingabe erfüllt ihren Quellvertrag | der Vertragstest bei dem Eingabeereignis von δ |
| Handler zu Senke | jedes Ok-Ausgang erfüllt das Ausgangsschema | Handler-Beweis: Auswertung durch den Kernel-Evaluator, der die Gestaltung erfordert, vollständig und deterministisch zu sein und mit einem Modellprüfer überprüft wird ([§5.3](#53-model-checking-of-the-kernel)) |
| Log zu Zustand | jeder Eintrag trägt den Hash des Zustands, den er erzeugte | Kernel-Faltung, die den ersten Eintrag ablehnt, dessen Hash nicht übereinstimmt ([§5.3](#53-model-checking-of-the-kernel)) |
| Umformung zu Form | eine Umformung bewahrt die Ausgabe für jede Eingabe | zufällige Überprüfung, dann ein SMT-Beweis ([§5.2](#52-the-proof-rule-for-rewrites)) |
| Stubs zu Foreman | ein Handler, der keine Entscheidung treffen kann, eskaliert anstatt ein Ergebnis zu wählen, das er nicht entscheiden kann | Stub-Handler emittieren Eskalationen; Lösungen werden nur über den Aufstiegspfad gefördert |
| Form zu Ziel | jedes emitierte Ziel berechnet denselben δ | die Ausgaben des emitierten Programms und der Hash des letzten Eintrags seines Logs stimmen mit der Referenz überein; heute gilt dies für den Konformitäts-Test für Rust, Python und JavaScript und nicht für Scala ([§4.5](#45-the-compilers)) |

Ein fehlgeschlagener Test lokalisiert den Bruch an der Grenze, an der er auftritt. Die Korrektur wird an dieser Ebene vorgenommen, durch die Überprüfung der Grenze weitergeleitet und gefördert. Jede Ebene über der korrigierten Ebene erbt die Korrektur ohne weitere Änderung, da jede Ebene über der korrigierten Ebene die korrigierte Ebene nur über die Schnittstelle konsumiert, deren Annahme jetzt überprüft wird. Dies ist der Sinn, in dem Korrekturen nach oben tragen und sich verketten.

<div id="5-verification" class="anchor-alias" aria-hidden="true"></div>

## 5. Verifikation

<div id="51-five-targets-one-trace" class="anchor-alias" aria-hidden="true"></div>

<div id="51-differential-testing-across-five-targets" class="anchor-alias" aria-hidden="true"></div>

<div id="51-differential-testing-of-the-program-emitters" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Differenzieller Test der Programmerzeuger

T9-L besagt, dass die Programmerzeuger `rust`, `python` und `js` mit dem Referenzevaluator übereinstimmen. Für den Rust-Erzeuger wird dies auf einem Kern bewiesen, als verifizierte Übersetzung in MiniRust, eine tief eingebettete Teilmenge des emittierten Rusts; dass `rustc` MiniRust implementiert, wird vertraut und getestet. Für die Python- und JavaScript-Erzeuger wird es getestet: die Ausgabe des emittierten Programms entspricht den Beobachtungen des Referenzevaluators für jede Zeile des Beispielprogramms (eine Zeile pro Konstante, Prüfung, Funktion ohne Argumente, Beispielereignis und Ausgabe von `fn main`), und auf dem Konformitäts-Test stimmen ihre Ausgaben und der Hash des letzten Eintrags ihres Logs mit der Referenz überein. Die gesamte Referenzspur jedes Beispielprogramms, Byte für Byte, ist das Tor, das der Emit-Registrierungs-Vorschlag für jede Sprache setzt ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). Der Scala-Erzeuger hat keinen T9-Anspruch, und seine Ausgabe stimmt noch nicht mit der Referenz überein ([§4.5](#45-the-compilers)). Der Referenzevaluator und die emitierten Rust-, Python- und JavaScript-Runtimes berechnen auch denselben Budgetfunktion, und ein Test prüft, dass der Budget-Abgriff auf dieselbe Operation in allen vier fällt ([§3.7](#37-the-language-one-text-costs-and-theorem-status)); der ordnungserhaltende ANF-Pass vor jedem Erzeuger wird differenziell auf den Rust-, Python- und JavaScript-Zielen getestet, einschließlich eines Durchlaufs der Budgets über den Abgriffspunkt (Satz T34). Dies ist differenzieller Test im Sinne von McKeeman und Csmith [86]: Übereinstimmung unter unabhängigen Implementierungen auf einem angegebenen Eingabesatz. Es ist nicht Übersetzungsbewertung [85], und außerhalb des bewiesenen Kerns des Rust-Erzeugers ist es kein verifizierter Compiler. Es sagt nichts über Eingaben außerhalb des getesteten Satzes.

<div id="52-rewrites-proved-in-z3" class="anchor-alias" aria-hidden="true"></div>

<div id="52-the-proof-rule-for-rewrites" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Der Beweisregel für Umformungen

Verifizierte Umformungsregeln haben eine Abstammung. Ruler schließt und überprüft Umformungsregeln durch Gleichheitssättigung ohne Modell im Kreis [87]. Die vom Modell vorgeschlagene Umformung, die in Abschnitt 5.5 angenommen wird, wiederholt eine Regel, die der Engine bereits hatte, also ist dieser Eintrag eine Aussage über das Tor, das 15 von 18 Vorschlägen ablehnte, und nicht ein Anspruch, dass ein Modell eine gute Quelle für Regeln ist.

In der Gestaltung der Engine muss jede e-graph-Umformung im Z3 SMT-Solver [31] bewiesen werden, gegen eine quantorenfreie Kodierung der Auswertung und Arithmetik des Form-Begriffs: Werte als Datentyp, 64-Bit-Bitvektoren mit überprüftem Überlauf, signierte Division und Rest mit dem Vorzeichen des Dividenden und binäre64-Floating-Points. Eine Umformung, die Überlauf, Eskalationsreihenfolge oder eine Nachricht ändert, erhält keinen Beweis. Eine vorgeschlagene Äquivalenz gelangt in den e-graph nur mit einem Beweis.
<div id="53-model-checking-of-the-kernel" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Modellprüfung des Kernels

Das Design überprüft den Kernel der Engine (Hashkette, Faltung, namenfreie Positionen und Handlerbewertung) mit dem Kani-Modellprüfer für Rust [32]. Die Handlerbewertung ist der Fixpunkt eines nicht rekursiven Schritts, sodass ein Beweis dafür, dass der Schritt total und deterministisch pro Konstruktor ist, durch strukturelle Induktion auf die Bewertung übertragen wird. Das Design nennt zehn Eigenschaften, jeweils einen Harness:

| Harness | Eigenschaft |
|---|---|
| `chain_appended_verifies` | Eine angehängte Hashkette wird überprüft |
| `chain_detects_tampering` | Ein geänderter Eintrag bricht die Kette |
| `fold_equals_replay` | Die Faltung entspricht der Wiederholung |
| `fold_rejects_wrong_state` | Eine Faltung, die mit dem gespeicherten Zustand nicht übereinstimmt, wird abgelehnt |
| `position_is_name_independent` | Regelnpositionen hängen nicht von Knotennamen ab |
| `reason_tokens_are_name_independent` | Gründe sind namenfrei durch ganze Token |
| `handler_core_leaves` | Blatt-Handler sind total und deterministisch |
| `handler_core_validate` | Validierung ist total und deterministisch |
| `handler_core_pipeline` | Pipelines sind total und deterministisch |
| `handler_core_ifhas` | Wächter sind total und deterministisch |

<div id="54-promotion-gate-on-the-proof-certificate" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Commit-Tor für das Beweiszertifikat

Im Design schreibt die Modellprüfung eine Ausführung, deren Hash mit der Engine gespeichert wird. Die Engine, der Log, Regel-IDs und die Handlerbewertung laufen durch den Kernel, und die Promotion erfordert das Zertifikat.

<div id="55-the-model-as-a-proposer-behind-the-check" class="anchor-alias" aria-hidden="true"></div>

### 5.5 Das Modell als Vorschlagender hinter der Prüfung

Ein Modell kann Äquivalenzen vorschlagen. Es kann sie nicht akzeptieren. Ein lokales 1,5-Milliarden-Parameter-Codierungsmodell wurde als Vorschlagender auf der Spezifikation `orders-form` ausgeführt, und das öffentliche Protokoll der Ausführung ([`rce/bench/results/llm-proposer-form-demo.form.json`](https://github.com/openIE-dev/openie-research-experiments/blob/main/rce/bench/results/llm-proposer-form-demo.form.json)) enthält 18 Vorschläge, 13 davon sind unterschiedlich. Das Protokoll nennt die Quelle jedes Vorschlags nur als `llm`; das Modell, Qwen2.5-Coder-1.5B unter llama.cpp, wird in diesem Paper und in keinem öffentlichen Protokoll benannt. Die Prüfung lehnte 15 Vorschläge ab, 12 davon sind unterschiedlich: vier, die nicht analysiert werden können, zwei, die einen Wert an einer Stelle setzen, an der ein Begriff gehört, und neun Vertauschungen arithmetischer Operatoren, jeweils abgelehnt mit einem Gegenbeispiel, auf dem die beiden Seiten unterschiedlich scheitern. Die drei, die akzeptiert wurden, sind eine Umformung, `(pipe pass ?a) => ?a`, unter drei Namen, und diese Umformung wiederholt eine Regel, die die Engine bereits hatte. Das Protokoll zeigt das Tor, das das Falsche ablehnt; es zeigt keine neue Regel vom Modell.

<div id="6-lift-entering-the-ecosystem-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

## 6. Hebung: Eintreten in das Ökosystem aus anderen Sprachen

<div id="6-importing-legacy-code-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

Hebung ist so gestaltet, um die Tür zum Ökosystem für Code, der anderswo geschrieben wurde, zu sein. Sie soll eine Konstruktion sein, die pro Sprache aus den Werkzeugen erstellt wird, die jede Sprache bereits hat: eine formale Grammatik, einen Parser wie [tree-sitter](https://tree-sitter.github.io/tree-sitter/), der den Syntaxbaum, den abstrakten Syntaxbaum und die Symbole erzeugt, die das Tooling des Language Servers auflöst ([Language Server Protocol](https://microsoft.github.io/language-server-protocol/)). Das Engine-Profil definiert eine Hebung, `rce scan DIR --form`, die den Form aus diesem Baum für Rust, Python, TypeScript und Go erstellt und jedes gehobene Element als unbestätigt kennzeichnet (Anhang D.8); weder diese Hebung noch die Engine sind öffentlich, und nichts im Anhang D wird von den veröffentlichten Tools geprüft. Das öffentliche Repository enthält einen Hebungstest, `spec/lift/go/lift_go.py`, der ein Go-Muster hebt, und das Design für die Hebung aller Sprachen, mit den Ebenen, auf denen eine Hebung akzeptiert wird, ist der Vorschlag `spec/proposals/rce-form.md` ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). Ein gehobenes Programm trägt die Fehler seiner Quelle, also beinhaltet Hebung Reparatur, und das Protokoll unten misst Reparatur an öffentlichen Fehlerkorpora mit der angegebenen Position.
<div id="60-the-repair-ladder" class="anchor-alias" aria-hidden="true"></div>

### 6.0 Die Reparaturleiter

<div id="23-per-rung-ladder-results" class="anchor-alias" aria-hidden="true"></div>

Eine Codierungsaufgabe wird hier durch die **Absichtsbits** gemessen, die sie benötigt: die Bits, die von außen geliefert werden müssen, da die Engine sie nicht bereits besitzt (das Programm um die Änderung, die Bibliotheken, die Tests, der Index der bekannten Korrekturen). Mit $H_{task}$ bezeichnen wir die Bits, die das Zielobjekt festlegen, und mit $H_{corpus}$ die Bits, die der Korpus bereits bereitstellt. Die gelieferten Bits sind $I = H_{task} - H_{corpus}$. Ein Gang, der die richtige Änderung unter seinen Kandidaten auf Platz $r$ anordnet, liefert $\log_2 r$ Bits der Suche, und das Tor liefert den Rest. Die Leiter ordnet die Aufgaben nach der Größe der Änderung, einem objektiven Proxy für $I$: ein Token (L0), eine Anweisung (L1), ein Hunk (L2), mehrere Hunks in einer Datei (L3), mehrere Dateien (L4), eine Funktion aus einer Spezifikation oder Tests (L5), eine Änderung auf Ebene von Issues (L6) und ein Programm aus einer Spezifikation (L7). Die Sprossen, Korpora, Aufteilungen und Hypothesen sind vorregistriert; die Dateien befinden sich im [öffentlichen Repository](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

L2 bis L4 werden auf einem zurückgehaltenen Datensatz von Defects4J ([Abschnitt 8.1](#81-defects4j)) gemessen, und L5 bis L7 unter den Protokollen von [Abschnitt 8.2](#82-swe-bench-lite-offline). Die Methode und das Tor von L0 und L1 folgen.

**Methode.** Jedes Korpus wird mit einem festen Seed gemischt. Die ersten 2.000 Positionen jeder Mischung, sowie für L0 drei ganze Repositorys (commons-lang, requests, flask), bilden die Entwicklungsaufteilung, auf der die Gänge abgestimmt werden können; Ergebnisse der Entwicklung werden nicht gemeldet. Jede verbleibende Aufgabe ist in der Testaufteilung. Vor einem Testlauf wird der Löser kommittiert und sein Binärhash aufgezeichnet, und während des Laufs ändert sich kein Gang, so dass jede zu meldende Zeile ein Ergebnis eines eingefrorenen Lösers auf Testaufgaben mit 0 Modellausführungen ist. Die Vorregistrierung (`PREREG.json`) und das Meldescript befinden sich im [öffentlichen Repository](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

**Tor.** Bei L0 und L1 wird die Position gegeben und das Tor ist Identität mit entferntem Leerzeichen: die reparierte Zeile oder Anweisung, mit allen Leerzeichenbytes entfernt, muss Byte für Byte mit der Entwicklerzeile übereinstimmen. Dies ist strenger als das Bestehen der Tests, da ein Patch eine schwache Testsuite durchlaufen kann und dennoch falsch sein. Qi und Kollegen fanden heraus, dass die meisten Patches, die GenProg als Korrekturen meldete, plausibel, aber falsch waren [92]; Überanpassung an Tests wird in suchbasierten und semantikbasierten Reparaturmethoden dokumentiert [93, 94] und mit generierten Tests adressiert [95]; Tools erzielen höhere Bewertungen auf den Benchmarks, auf denen sie abgestimmt wurden [96]; und Fehlerlokalisierung verfälscht Vergleiche [97]. Identität mit entferntem Leerzeichen schließt den Plausibilitätslücke auf diesen Sprossen, und das Geben der Position entfernt den Lokalisierungsterm, so dass der Rate die Reparaturgänge allein messen. L2 und höher verwenden die Tests als Tor und melden plausibel und korrekte Zahlen getrennt (Abschnitt 8.1).

<div id="61-l0-one-token-faults" class="anchor-alias" aria-hidden="true"></div>

### 6.1 L0: Fehler mit einem Token

Das L0-Korpus umfasst alle PIT-ähnlichen Mutanten [109] mit einem gültigen Ersatztoken in realen Repositorys an festgelegten Commits, fünf Java (commons-math, commons-collections, jsoup, joda-time, gson) und vier Python (click, attrs, pydantic, sympy), mit vier Repositorys, die nie für die Abstimmung verwendet wurden (commons-text, commons-io, more-itertools, httpx), als zweiten Testdatensatz. Mutanten sind ein Ersatz für reale Fehler mit einem Token, die Just und Kollegen mit realen Fehlern verknüpft fanden [110]. Wenn die Nachbarschaft, die einen Fehler mit einem Token wiederherstellt, aus denselben Operator-Tabellen besteht, die die Mutanten erzeugten, spiegelt ein hoher Rate teilweise diese Überschneidung und nicht die Reparaturfähigkeit auf Fehler wider, die in der Praxis auftreten. Eine einfache Operator-Inversion-Suche, die auf denselben Mutanten durchgeführt wird, ist die Baseline, die zeigt, wie viel des Rates die Überschneidung erklärt, und ein L0-Rate wird neben ihr gelesen.

<div id="62-l1-one-statement-bugs-from-real-histories" class="anchor-alias" aria-hidden="true"></div>

### 6.2 L1: Einzelanweisungsfehler aus realen Historien

L1 verwendet zwei öffentliche Datensätze mit realen Einzelanweisungskorrekturen, die aus offenen Quellhistorien abgebaut wurden: ManySStuBs4J 2.0 [107] für Java und TSSB-3M v1.0.0 [108], Schichten 14 und 15, für Python. Der Löser erhält entweder nur den 7-Zeilen-Hunk oder die ganze Datei am Elterncommit, mit Indizes der Methoden des Projekts und Schutzbedingungen, und die beiden werden als separate Zeilen gemeldet. Diese Datensätze haben keine veröffentlichte Reparaturleaderboard unter diesem Tor (nur Hunk, Identität mit entferntem Leerzeichen, Position gegeben), also wird keine gelernte-Reparatur-Zahl neben ihnen gesetzt; Defects4J, der einen hat, wird mit TBar in Abschnitt 8.1 verglichen.
<div id="63-energy" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Energie

Nach dem Protokoll trägt jede Zeile der Leiter `est_j`, ein Modell von Zentralprozessor-Einheiten (CPU) Sekunden mal 10 W, nicht eine Messung, und eine Unterstichprobe wird auf Running Average Power Limit (RAPL) [105], dem on-chip-Paketzähler des Prozessors, als `reported_j` gelesen: das Paketdelta über die gesamte Ausführung, abzüglich der Leerlaufleistung aus einer Stichprobe, die unmittelbar vorher genommen wurde, mal die Dauer der Ausführung. `measured_j`, ein Wandmeter auf einem benannten Schienenabschnitt, folgt dem Protokoll von Abschnitt 8.3.

**Zwei Regime und ein kalibriertes Vektor.** Die oben genannte Schätzung, CPU-Sekunden mal 10 W, ist eine Substrattabelle und kann keine Ziele unterscheiden, daher wählt die geringste-Joule-Extraktion nie ein Ziel aus. Die Literatur zu Messungen sagt, wie die Korrektur aussehen muss. Auf einem in-order-Core sind Joule linear in der Anzahl der Operationen: ein sechsfacher Zählermodell auf Cortex-M0 erreicht R² ≈ 0,99 und einen mittleren absoluten Fehler von 2,8 bis 4,3 %, mit Koeffizienten wie 0,96 nJ pro Anweisung und 2,1 nJ pro genommener Verzweigung [152]. Auf einem out-of-order-Core kollabiert das Modell auf die Zeit: mit einem Core festgelegt und Turbo ausgeschaltet, zog ein Xeon Gold 6430 189,8 ± 0,5 W über jede Implementierung und Benchmark eines Sprach-Energie-Replications, und die Rangliste, die Python auf 75,88-mal C platziert hatte, verschwand, sobald die Bibliothekswahl, Parallelität, Aufwärmen und Messfehler kontrolliert wurden [153]. Die Zähler selbst haben unterschiedlichen Wert: Intel RAPL prognostiziert Steckleistung mit einem mittleren absoluten Prozentsatzfehler von 1,8 %, sobald DRAM eingeschlossen ist, aber aktualisiert sich etwa alle Millisekunde und driftete um 10 bis 12 % mit Pakettemperatur auf einer Generation [105]; das Abfragen schneller als 10 ms führt zu bis zu 50 % veralteten Lesungen [154]; NVIDIA's NVML sticht etwa ein Viertel der Laufzeit ab und einfache naive Laufzeiten wiesen bis zu 70 % Fehler gegenüber einem externen Meter auf [155]. Gas-artige Einheitenmessung korreliert mit CPU-Zeit nur bei Pearson ≈ 0,51 auf Ethereum [156], also ist "Energie skaliert mit den gezählten Operationen" eine Annahme, die die Unterstichprobe `reported_j` testen muss. Ein Vorschlag an die Spezifikation hält drei Objekte getrennt: die C.6 Budgeteinheiten bleiben deterministisch, Zielblind und im Log; `est_j` wird zu $\langle \mathrm{count}(\mathit{term}), E[\mathit{target}] \rangle$ plus Leerlaufleistung mal Zeit im Regime A (Mikrocontroller, field-programmable gate array (FPGA)-Lanes, in-order-Cores) und $P_{\mathrm{active}} \cdot t + E_{\mathrm{llc}} \cdot \mathit{misses}$ im Regime B (out-of-order CPUs und Grafikprozessoren (GPUs)); und der Koeffizientenvektor $E[\mathit{target}]$ ist ein `host.Calibrated` Logeintrag mit seinem Protokoll, Stichprobenanzahl und Standardfehler pro Koeffizient, geschrieben von `rce host calibrate` unter einem normativen Protokoll (mindestens 30 ineinandergeflochtene A/B-Paare gegen die Leerlaufbasislinie, Blöcke von mindestens 60 s oder $10^9$ Operationen, Aufwärmen verworfen, Temperatur aufgezeichnet, Brutto- und Netto gemeldet, das Meter mit seinem Validierungsreferenz benannt, RAPL nicht schneller als 10 ms abgetastet), so dass die Extraktion unter `est_j` eine Funktion des Logs und Wiederholungen ist. Belege erhalten eine `kalibrierung` Hash und eine `veraltete_Fraktion`, den Anteil der Operationen eines Schritts ohne kalibrierte Zeile, mit `unbewertet` Preis; Gesamtwerte behalten die vier Etiketten in separaten Spalten. Der Fälscher ist RCE-F5 in [§9](#9-falsifiers). Die erste Kalibrierung, die laufen wird, ist der KV260 Sprosse der Energieleiter auf ihrem Core-Schienenabschnitt mit $N \ge 30$, was den Ersatz `E_LUT_READ = 1e-12` der Spezifikation in einen Koeffizienten mit einem Standardfehler verwandelt.
<div id="7-reuse-evidence" class="anchor-alias" aria-hidden="true"></div>

## 7. Wiederverwendung von Beweisen

Die Position von RCE auf der Wiederverwendungsskala beruht auf einem ingenieurtechnischen Fakt: Code wird auf jeder Ebene wiederverwendet. Jede Methode misst dies anders.

| Methode | Quelle | Erkenntnis |
|---|---|---|
| Dateiniveau-Clone-Kartierung | DéjàVu, Lopes et al. 2017 [33] | Von 428 Millionen Dateien in 4,5 Millionen nicht-geforkten GitHub-Projekten sind 85 Millionen einzigartig: „70 % des Codes auf GitHub besteht aus Clonen bereits erstellter Dateien.“ In JavaScript sind 6 % der Dateien einzigartig. |
| Zeileniveau-Redundanz | Gabel und Su 2010 [34] | Bei 420 Millionen Zeilen ist „zwischen 50 % und 100 % jedes Projekts redundant“ bei etwa einer Zeile. |
| Statistische Sprachmodelle | Hindle et al. 2012 [35] | Code ist „sehr repetitiv, und tatsächlich sogar noch mehr als natürliche Sprachen.“ |
| Korpus-nahes Deduplizieren | The Stack [36] | Nahes Deduplizieren entfernt 54,7 % von The Stack v1 (6,4 TB zu 2,9 TB) und 52,4 % von v2 (67,5 TB zu 32,1 TB). |
| Archivweite Erhaltung | Software Heritage [129, 130] | 30,3 Milliarden einzigartige Dateiinhalte aus 448 Millionen Ursprungsquellen (Archivzähler, gelesen am 13. Oktober 2026), jedes einmal gespeichert, basierend auf dem Hash seiner Bytes. |
| Ausgewonnene Korrekturmuster | PAR, TBar [22, 23] | PAR fand „mehrere häufige Korrekturmuster“ in mehr als 60.000 menschlichen Patches. TBar’s 15 Musterkategorien beheben 43 Defects4J-Fehler korrekt im Standardpipeline und 74 von 101 mit perfekter Fehlersuche, ohne Lernen. Diese Zahlen sind wie aus [23] gelesen; die Bedeutung der 101 (plausible Patches oder behandelte Fehler) wurde hier nicht erneut gegen das Papier überprüft, daher gilt der Anteil als unbestätigt. |
| Querlinguaufgaben | Rosetta Code [131] | 1.360 Aufgaben (und 421 Entwurfsvorlagen), jede eine Konzeption implementiert in vielen von 1.009 bekannten Sprachen. |

![Fünf kleine Panels, jedes mit seiner eigenen Einheit. Lopes et al. 2017: von 428 Millionen Dateien in 4,5 Millionen nicht-geforkten GitHub-Projekten sind 85 Millionen einzigartig, mit der Zitation, dass 70 % des Codes auf GitHub aus Clonen bereits erstellter Dateien besteht. Gabel und Su 2010: zwischen 50 % und 100 % jedes Projekts ist bei etwa einer Zeile redundant, bei 420 Millionen Zeilen. The Stack: nahe Deduplizierung entfernt 54,7 % von v1 (6,4 TB zu 2,9 TB) und 52,4 % von v2 (67,5 TB zu 32,1 TB). Software Heritage: 30,3 Milliarden einzigartige Dateiinhalte aus 448 Millionen Ursprungsquellen, Archivzähler gelesen am 13. Oktober 2026, jedes einmal gespeichert basierend auf dem Hash seiner Bytes. PAR fand mehrere häufige Korrekturmuster in mehr als 60.000 menschlichen Patches; TBar behebt 43 Defects4J-Fehler korrekt im Standardpipeline und 74 von 101 mit perfekter Fehlersuche.](/figures/rce/reuse.svg)

*Abbildung 6. Code wird auf jeder Ebene wiederverwendet. Datenfigur: fünf Maßnahmen der Wiederverwendung, jede in ihrer eigenen Einheit; die Panels sind untereinander nicht vergleichbar. Dateiniveau-Clone-Kartierung (Lopes et al. 2017 [33]): von 428 Millionen Dateien in 4,5 Millionen nicht-geforkten GitHub-Projekten sind 85 Millionen einzigartig. Zeileniveau-Redundanz (Gabel und Su 2010 [34]): zwischen 50 % und 100 % jedes Projekts ist bei etwa einer Zeile redundant, bei 420 Millionen Zeilen. Korpus-nahes Deduplizieren (The Stack [36]): 54,7 % von v1 (6,4 TB zu 2,9 TB) und 52,4 % von v2 (67,5 TB zu 32,1 TB) entfernt. Software Heritage [129, 130]: 30,3 Milliarden einzigartige Dateiinhalte aus 448 Millionen Ursprungsquellen (Archivzähler gelesen am 13. Oktober 2026), jedes einmal gespeichert basierend auf dem Hash seiner Bytes. Ausgewonnene Korrekturmuster (PAR [22], TBar [23]): PAR fand häufige Korrekturmuster in mehr als 60.000 menschlichen Patches; TBar behebt 43 Defects4J-Fehler korrekt im Standardpipeline und 74 von 101 mit perfekter Fehlersuche. Werte wie in der Tabelle oben. Ein [PNG-Abbild](/figures/rce/reuse.png) wird bereitgestellt.*

Jede Zeile ist eine Eingabe für die Engine. Clone und Dedup sagen, dass eine Lösung normalerweise besteht, was G0 ist. Wiederkehrende Korrekturen sagen, dass Anpassung hauptsächlich ein kleines Katalog von geschützten Neuschreibungen ist, was G1 ist. Zeileniveau-Redundanz verkleinert den Suchraum von G2. Die Reparaturleiter von Abschnitt 6 ist das Protokoll, das es auf geteilten Splits in großem Maßstab misst. Zwei Warnungen schärfen die Lesung. Duplikate vergrößern Retrieval und Modellscores, es sei denn, sie werden entfernt [104]. Und fehlerhafte Zeilen sind weniger natürlich als korrigierte [45], also ist der Fehler selbst der Fall, der am wenigsten vorhergesagt werden kann; die Korrekturform, nicht die fehlerhafte Zeile, ist es, auf das G0 und G1 sich konzentrieren müssen. Die Regel-Mining-Linie, die dies in großem Maßstab tut, von GenProg’s generate-and-validate Suche [88] und Prophet’s gelernter Korrektheitsmodell [89] bis zu Getafix bei Facebook [90] und Sorald’s modellfreier Reparatur von statischen Analyseverstößen [91], leitet Vorlagen aus getrennter Geschichte und berichtet Präzision auf unbekannten Fällen [98]. Das ist der Standard, den Abschnitt 8.4 übernimmt.

<div id="8-measurement-protocols-for-what-comes-next" class="anchor-alias" aria-hidden="true"></div>

## 8. Messprotokolle für das Folgende

Jedes Protokoll ist vor seinem Lauf festgelegt: vorregistrierte Commit, Samen und Solver-Commit aufgezeichnet, jedes Artefakt behalten. Tor zuerst, Joule zweit, Labels immer.

<div id="81-defects4j" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Defects4J

Defects4J enthält 854 aktive reale Java-Fehler, jeder mit reproduzierenden Tests [37].

1. Entwickeln Sie auf einer 100-Fehler-Untermenge, offline, über `defects4j checkout`; berichten Sie nur über Ergebnisse, die auf einer geteilten Menge aus den aktiven Fehlern gezogen werden, die durch eine vor dem Lauf registrierte, gesäte Regel ausgewählt wird, die die Entwicklungsuntermenge und jeden Fehler ausschließt, der bereits mit jedem Gang gelaufen ist, und vor dem Lauf eingefroren wird.
2. Führen Sie G0, dann G1, dann G2 und schließlich ein lokales Modell aus. Notieren Sie den Gang, der jeden Fehler geschlossen hat.
3. Tor: die auslösenden Tests und das vollständige Testset passen. Berichten Sie die Anzahl der plausiblen und korrekten Fälle getrennt; korrekt bedeutet gleichwertig mit dem Entwickler-Patch bei der Überprüfung.
4. Berichten Sie die Modellaufträge pro korrekter Korrektur und Joule pro korrekter Korrektur, mit Bezeichnungen.
5. Referenzpunkte: TBar’s 43 korrekten Korrekturen und seine 74 von 101 unter perfekter Lokalisierung (Zahlen wie aus [23] gelesen, mit dem Nenner hier nicht erneut überprüft). Dieser Abschnitt ist ein Protokoll. Kein Defects4J-Ergebnis dieser Engine wird in diesem Papier berichtet.
6. Kontaminationsprüfung: markieren Sie jeden Fehler, dessen Korrektur wörtlich in G0’s Index erscheint, und berichten Sie mit und ohne markierte Fehler.
<div id="82-swe-bench-lite-offline" class="anchor-alias" aria-hidden="true"></div>

### 8.2 SWE-bench Lite, offline

SWE-bench Lite ist eine 300-Aufgaben-Untermenge realer GitHub-Probleme, die durch versteckte Tests gelöst wurden [38].

1. Verwenden Sie das offizielle Docker-Tool mit keiner Netzwerkverbindung.
2. Erster Durchlauf: Nur G0 und G1, keine Modellausführungen. Dies ist der untere Grenzwert für das Lösen ohne Modell.
3. Zweiter Durchlauf: Fügen Sie ein lokales Modell als letzten Gang hinzu.
4. Melden Sie die Lösungsrate, die Modellausführungen pro gelöster Aufgabe und die Joule pro gelöster Aufgabe, mit Bezeichnungen.
5. Kontaminationstest wie in 8.1. SWE-Bench+ fand heraus, dass 32,67 % der erfolgreichen Patches die Lösung im Problemtext hatten [39].

<div id="83-a-wall-meter" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Eine Wandmessung

1. Anbringen Sie eine Wandmessung oder eine Shunt-Messung an der Stromversorgung des Hosts, mit einer festgelegten Rate protokolliert und mit ihrer Uhr synchronisiert zum Laufprotokoll.
2. Leerlaufmaschine: CI-Laufwerke und andere Builds gestoppt, und ein leiser Fenstertor-Check vor jedem Block durchgeführt und protokolliert.
3. Subtrahieren Sie eine gemessene Leerlaufgrundlinie und geben Sie die Methode an.
4. Füllen Sie `measured_j` allein aus der Messung. Melden Sie `reported_j` (RAPL) und `est_j` neben ihm in separaten Spalten. Summieren Sie niemals über Bezeichnungen.
5. Führen Sie die RAPL-Unterstichprobe der Leiter (Abschnitt 6.3) unter der Messung durch, gefolgt von der Defects4J-Reserve-Gruppe.

<div id="84-a-held-out-run-with-the-gears-frozen" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Ein reservierter Durchlauf mit eingefrorenen Gängen

Dies ist die Methode des Abschnitts 6, erweitert auf neue Corpora.

1. Einfrieren Sie G0, G1 und G2 an einem markierten Commit, protokollieren Sie die Binärhash, und veröffentlichen Sie die Regelsatz mit seinen Erstellungstimestamps.
2. Zeichnen Sie einen disjunkten reservierten Slice: die Rust- und Python-Instanzen von Multi-SWE-bench [102] und BugsInPy [103], dedupliziert gegen G0's Index [104].
3. Registrieren Sie den Slice, die Samen und die Hypothesen vor dem ersten Durchlauf.
4. Melden Sie gelöste, plausibele und byte-identische Zahlen getrennt, jeweils mit einem 95 % Intervall.

<div id="85-baselines-in-the-same-table" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Baselines in der gleichen Tabelle

1. Modellfrei: `cargo fix` und clippy [106], und Sorald oder ein TBar-Port [91].
2. Billiges Modell: Agentlos mit einem lokalen Modell [99].
3. Fernmodell: ein Agent mit einem Front-Modell, dessen Energie aus Anbieteroffenlegungen geschätzt und als `est_j` bezeichnet wird.
4. Melden Sie den Kostenprozess [101] in Joule und in Dollar für jede Zeile, mit Kostenkontrolle wie Kapoor und Kollegen es verlangen [100].

<div id="86-convergence-of-model-calls-at-large-n" class="anchor-alias" aria-hidden="true"></div>

### 8.6 Konvergenz der Modellausführungen bei großem N

Promotion ist der Mechanismus, durch den das Modell den Kreis verlässt: ein Resolver wird für einen neuen Fall einmal bezahlt, das Tor wendet die Lösung als Handler an, und jeder spätere Fall desselben Typs schließt sich in G0 oder G1 ([Abschnitt 4.2](#42-the-gears)). Konvergenz ist der Anspruch, dass die Modellausführungen pro Runde auf null fallen bei einer festen Spezifikation unter Live-Verkehr. Es wird wie folgt gemessen.

1. Zeichnen Sie mindestens 1.000 Spezifikationen aus öffentlichen Repositories, stratifiziert nach Sprache und Größe, und einfrieren Sie die Engine und den Resolver vor der ersten Runde.
2. Wiederholen Sie aufgezeichneten Produktionsverkehr, mindestens 10.000 Ereignisse pro Spezifikation, in Runden fester Größe.
3. Protokollieren Sie pro Runde: neue Eskalationen, Modellausführungen, Promotions, Verzögerungen und Joule pro geschlossener Aufgabe, jeweils mit Bezeichnungen (`est_j`, `reported_j`, `measured_j`).
4. Primäres Endpunkt: der Anteil der Spezifikationen, die eine Runde mit null Modellausführungen innerhalb von 20 Runden erreichen, mit einem 95 % Wilson-Intervall. Sekundär: Modellausführungen pro geschlossener Aufgabe pro Runde und die Runde der letzten Modellausführung.
5. Melden Sie Spezifikationen, die nie konvergieren, mit ihrem Grund (ein blockierter Eingang, ein fehlender Abhängigkeit, neue Absicht), und führen Sie die Verzögerung für blockierenden Eingang als vorregistrierte Arm durch.

**Aussage 8 (untere Grenze-Ansatz).** Mit wachsender Abdeckung von G0 und G1 nähern sich die Joule pro gelöster Aufgabe der Gold-Untergrenze an, bei der ein bekannter Fix angewendet und die Tests durchgeführt werden. Die Leitersprossen und die Defects4J-Reserve-Gruppe unter der Wandmessung testen es.

<div id="87-lift-coverage-across-languages" class="anchor-alias" aria-hidden="true"></div>

### 8.7 Abdeckung der Hebung über Sprachen

<div id="87-coverage-of-real-programs-across-languages" class="anchor-alias" aria-hidden="true"></div>

Hebung wird gemessen, wie sie gebaut wird. Für Sprache $L$ zählt ein Programm als gehoben, wenn $\pi_L(\lambda_L(p))$ die eigenen Tests des Programms besteht und seine aufgezeichneten Spuren Byte für Byte wiederholt, und $\lambda_L(\pi_L(\lambda_L(p)))$ denselben Formhash wie $\lambda_L(p)$ hat. Die Stichprobe besteht aus mindestens 10.000 Programmen pro Sprache für mindestens zehn Sprachen, gezogen mit einem festen Samen aus festgelegten öffentlichen Corpora, mit dem Heber eingefroren und seinem Binärhash vor jedem Durchlauf protokolliert, und 0 Modellausführungen. Jeder Durchlauf meldet den Anteil der gehobenen mit einem Wilson 95 % Intervall, und jeder noch nicht gehobene Konstrukt ist ein Arbeitselement für den Heber dieser Sprache, gebaut und eingefroren vor dem nächsten Durchlauf. Das Ziel ist jedes Programm in jeder Sprache.
<div id="9-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 9. Falsifizierer

Festgelegt, bevor die von ihnen getesteten Laufzeiten stattfinden.

| ID | Beobachtung | Überwindet |
|---|---|---|
| RCE-F0 | Bei einer vorregistrierten Laufzeit von mindestens 10.000 Forms druckt einer der vier Projektionen (Rust, Python, JavaScript, Scala) eine Spur aus, die sich von der Referenzspur des Forms unterscheidet, oder ein fehlerhaftes Eingabeformat wird akzeptiert | Die Aussage, dass Projektionen treu sind und das Tor bei der Eingabe ablehnt |
| RCE-F1 | Auf dem zurückgehaltenen Datenschnitt lösen G0 bis G2 mit eingefrorenen Regeln unter 10 % der Aufgaben unter Verwendung von 0 Modellausführungen | Die Aussage, dass die meisten Lösungen bereits für Reparaturen in dieser Größenordnung existieren |
| RCE-F2 | Byteidentische oder gleichwertige Patches sind unter der Hälfte der gelösten, zurückgehaltenen Aufgaben | Die Interpretation des Tors als mehr als plausibel auf den abgedeckten Aufgaben |
| RCE-F3 | Unter dem Wand-Messer überschreiten die Bruttowattstunden pro gelöster Aufgabe des RCE-Lösers die des billigsten Modell-Referenzwerts auf den Aufgaben, die beide lösen | Die Aussage, dass die Energie pro gelöster Aufgabe auf den abgedeckten Aufgaben niedriger ist |
| RCE-F4 | Im Konvergenzprotokoll des Abschnitts 8.6 erreichen weniger als die Hälfte der Spezifikationen ohne blockierende Eingabe eine Runde mit null Modellausführungen innerhalb von 20 Runden | Das Modell aus dem Kreislauf kompilieren |
| RCE-F5 (registriert am 22. Oktober 2026) | Auf der Unterstichprobe der Leiter unter dem Wand-Messer des Abschnitts 8.3, mit einem Eintrag `host.Calibrated` für den Host, ist der pro Ziel R² von `reported_j` auf dem Zählvektor C.6 unter 0,8 im Regime A, oder `est_j` im Regime B weicht um mehr als 25 % vom Median ab | Die Aussage, dass die kalibrierte Schätzung ein nutzbarer Ersatz ist; die Grundlage des Belegs für diesen Host wird `unpriced` bis ein besseres Modell kalibriert ist |
| RCE-F6 (registriert am 22. Oktober 2026) | In der registrierten Dimensionsmessung des Abschnitts 3.8 ist die Median-Redundanz über beschränkte, outputtragende Programme (die Schicht, auf die die registrierten Laufzeiten beobachtbare Aufrufe durchführen) unter 0,1 Bit. Status, 24. Oktober 2026: ausgelöst auf der authorierten Zweiregionsbevölkerung der fünften Laufzeit (Median 0,00 Bit über zwölf Programme), nicht ausgelöst auf den handgeschriebenen Beispielen (1,29 Bit, dritte Laufzeit) oder den Host-Programmen (0,46 Bit pro Familie, vierte Laufzeit) | Die Aussage, dass zufälliger Zustand in kleinen Forms in dieser Größenordnung häufig ist; `rce dim` ist dann nur ein Diagnoseinstrument für große Programme, was der Interpretation in Abschnitt 3.8 jetzt entspricht |
<div id="10-work-to-finish" class="anchor-alias" aria-hidden="true"></div>

## 10. Arbeit zum Abschließen

Jedes Item hat seinen eigenen Protokollnamen.

1. Hebung gebaut und gemessen über mindestens zehn Sprachen unter dem Protokoll von Abschnitt 8.7.
2. Der Spezifikationsarm: Spezifikationen im Stil von MBPP und HumanEval als Forms verfasst und an jedes Ziel emittiert.
3. Ergebnisse auf L2 bis L4, auf dem Defects4J zurückgehaltenen Datensatz, der gemäß der registrierten Regel von Abschnitt 8.1 gezogen wurde, und auf L5 bis L7 (Abschnitt 8.2).
4. Baselines in einer Tabelle, Kosten der Passung in Joule und Dollar (Abschnitt 8.5).
5. Eine `measured_j`-Reihe: eine Wandmessung auf einem ruhenden Host, mindestens 10 Wiederholungen, Brutto- und Nettoseite nebeneinander (Abschnitt 8.3).
6. Die 626-Sprachen-Umfrage veröffentlicht mit ihrer Methode (Abbildung 1).
7. Neue zurückgehaltene Corpora mit eingefrorenen Gängen: Multi-SWE-bench und BugsInPy (Abschnitt 8.4).
8. Konvergenz von Modellausführungen über mindestens 1.000 Spezifikationen (Abschnitt 8.6).
9. T60, T61 und T59 über alle von $E$ bewiesen (T60 durch mechanisierte Partitionserweiterung), und T62 verknüpft von seinem Modell zum Aufnahmevertrag (Abschnitt 3.8).
10. Die T7 `state_hash`-Ergebnisse sind gelöst (Abschnitt 3.6) und `RCE/Positional.lean` beweist die Positionscodierung, die der Prüfer unter den Umbenennungen der Spezifikation 10.6 für jede Hashfunktion unverändert hashen bleibt. Was übrig bleibt, ist, das Lean-Modell mit dem Prüfer zu verknüpfen, der es ausführt: Phase 2 von Abschnitt 13 extrahiert den Prüfer und den Interpreter aus Lean und verwendet sie als Tor, wobei der Rust-Prüfer gegen sie überprüft wird, anstatt einen Verfeinerungsbeweis vom Lean-Kern zum Rust-Interpreter zu führen, was [§12.1](#121-seven-areas-of-the-design) ablehnt.
11. Eine dimensionsbezogene Bevölkerung, die blind registriert wurde (Programme geschrieben, ohne an den Benchmark zu denken, oder gehoben), groß genug, um H2 jenseits der beiden Zeilen zu testen, die es jetzt tragen; die registrierten Ausführungen an öffentlichen Commits haben RCE-F6 als ausgelöst auf einer Bevölkerung und nicht auf den anderen gemeldet (Abschnitt 3.8).
12. Die drei vorregistrierten Experimente von Abschnitt 12.3: Modellgenauigkeit auf der namenlosen Form mit und ohne Konzeptaufzeichnung; der Austauschrate benachbarter Anweisungen in gehobenem Code; und ob die Wiederholungszertifizierung umkehrbare Löschung die 20%-Löschungsgrundlinie verschiebt.
13. Der erste `host.Calibrated`-Eintrag, auf dem KV260-Sprosse mit $N \ge 30$, und die Regression, die RCE-F5 testet (Abschnitt 6.3).
14. Form IR Format 2 (inhaltadressierte Definitionen) als einzigen Format, so dass die 77 Standardbibliothekssteine, die allein aufgrund der Begriffsgöße abgelehnt wurden, niedriger sind, und die Rundreisebedingung hash(lift(emit(F))) = hash(F) pro Ziel bei $N = 10{,}000$ geprüft wird (Abschnitt 13).
15. Der Eingabevertrag des Referenzprüfers, so dass jeder Eingabe bei der Eingabe ein deklarierter Ausgang hat (Abschnitt 1). Bei öffentlichem Commit `d91a9fc8` fällt `rce run` und `rce host run` ein Feld, das der Ereignis nicht deklariert, an und wendet das Ereignis an, und speichert ein Feld des falschen Typs, es sei denn, die Schrittarithmetik fängt es ab. Der Vertrag lehnt ein nicht deklariertes Ereignis, ein fehlendes, zusätzliches oder falsch typisiertes Feld und einen verschachtelten Wert ab, lässt den Zustand unverändert und protokolliert die Ablehnung (T8); das Protokoll von Abschnitt 2.3 testet es bei großem N.
16. Der Scala-Emitter wurde mit dem Referenz auf dem Konformitäts-Test-Satz vereinbart, wo er heute 52 von 1.832 Ergebnissen durchläuft ([§4.5](#45-the-compilers)), mit den Scala-Ergebnissen des Test-Satzes unter den Ein-Sprachen-Regeln erneut durchgeführt.
17. Das Design von [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis) gebaut: die Kodierung `rce-form/1` des Vorschlags `spec/proposals/rce-form.md`, und für jede Sprache ihre Lift-Tabelle, Druck-Tabelle und Laufzeitbibliothek, veröffentlicht auf der Ebene, die ihre Ausführungen erreichen, mit der Anzahl dieser Ausführungen.

<div id="56-brownfield-agreement" class="anchor-alias" aria-hidden="true"></div>

**Ergebnisse werden auf öffentlichem Code neu aufgebaut.** Der Motor hat die untenstehenden Ergebnisse erzeugt. Jedes wird vor dem Eintreten in diesen Artikel auf öffentlichem Code neu aufgebaut: der Code an einem markierten öffentlichen Commit, eine Registrierung, die vor der Ausführung versiegelt ist, veröffentlichte Zeilen pro Aufgabe, und ein Befehl, der die Zusammenfassung aus einer sauberen Klonung reproduziert (die erste Phase des Programms in [§13](#13-programme-of-work-and-its-gates)).

| Ergebnis | Protokoll in diesem Artikel | Neuaufbaupfad |
|---|---|---|
| Die Testanzahl des Motors (`cargo test --release`, und die Gesamtzahl von `make check`) und die Lean-Prüfung an einem Motor-Commit | §3.7 | Verifizierungsanzahl an einem öffentlichen Commit: die Tests des Referenzprüfers, `lake build` und die Lean-Prüfung, die Spezifikationsprüfung und die WebAssembly-Prüfungen, mit einem kontinuierlichen Integration-Lauf-Identifier |
| Der Pilot vom 22. Oktober 2026 und die erste registrierte Dimension-Ausführung, `dim-r1` (77 Programme von `spec/examples/` und `rce-examples`), beide erstellt an Commits, die nicht öffentlich sind | §3.8 | Die gleiche Bevölkerung erneut mit `rce dim` an einem öffentlichen Commit |
| Modellprüfung des Kernels: zehn Halterungen mit Kani 0.67.0 verifiziert, ihre Prüfzahlen und das Zertifikat, das die Förderung erfordert | §5.3, §5.4 | Kani auf einem öffentlichen Kernel-Kasten, der den Prüferprotokoll, Faltung und Positionscodierung des Prüfers aufruft, mit den zehn Halterungen und einem gespeicherten Zertifikat |
| Das Ökosystem auf 10.000 generierten Forms: verlustfreie Kodierung, deterministische und treue Projektion, das Tor am Eingang für Eingaben und Spezifikationen, seine Regressionstest und seine CPU-Zeit | §2.3 | Das Protokoll von §2.3 auf dem Referenzprüfer und seinen Emittern, registriert unter einem neuen Lauf-Identifier |
| T9-F: der Form-Compiler des Motors (`rce form`) und seine fünf Ziele (Rust, WebAssembly, Python, XState, SCXML), die Referenzspur auf der Kante und den gesäten Ereignissen einer elf-Operator-Spezifikation drucken | §3.7 | Ein Differenzentest der öffentlichen Emitter auf registrierten Kanten- und gesäten Ereignissen |
| Die Z3-Beweise der eingebauten e-Graph-Umformungen des Motors und der deterministische Vorschlagender von 87 vertrauten Identitäten | §5.2 | Ein öffentliches Umformungstor: ein Referenzbewerter von Form IR-Begriffen, eine SMT-LIB-Kodierung mit einem unsat-Ergebnis pro Umformung und negativen Steuerungen, und die in der Registrierung aufgelisteten Identitäten |
| Die Form-Invarianten von §4.1, wie sie durch benannte Motor-Tests geprüft wurden, die Verknüpfung der Eskalationen auf der Referenz-Arbeitslast von Proposition R2, und die Browserdemonstration des Motors | §2.4, §4.1 | Der Motorprofil, Tor, Förderung und Belege in öffentlichem Code, gebaut aus Anhang D |
| Die Ein-Token-Reparaturraten (L0) auf neun Repositories und auf vier, die nie abgestimmt wurden, mit dem Median-Suchbits und der nicht gelösten Aufschlüsselung | §6, §6.1 | Ein öffentliches Reparaturwerkzeug auf dem L0-Protokoll, mit der Operator-Inversion-Grundlinie nebenan |
| Die Ein-Aussage-Reparaturraten (L1) auf ManySStuBs4J 2.0, nur Hunk und ganze Datei, und auf TSSB-3M, mit den Raten pro Kategorie | §6, §6.2 | Die L1-Gänge im öffentlichen Reparaturwerkzeug, auf dem L1-Protokoll |
| Übereinstimmung der Lift mit dem ursprünglichen Code auf Rust, Python, TypeScript und Go-Beispielen | §6 | Öffentliche Lifts pro Sprache, auf frisch geschriebenen Beispielen ausgeführt |
| Übereinstimmung von drei Verkaufsaufruf-Programmen, neu formuliert als Forms, mit ihren aufgezeichneten Eingaben, und der `est_j`-Änderung unter Extraktion | §6 | Die Programme als Sprachmodule geschrieben und gegen die öffentlich aufgezeichneten Eingaben wiederholt |
| `est_j` pro gelöster Aufgabe auf der Leiter und die RAPL-Unterprobe | §6.3 | `est_j` aus den neu aufgebauten Leiter-Laufs, und `reported_j` auf einem Host mit RAPL
<div id="11-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 11. Schlussfolgerung

RCE ist ein nativer Code-Ökosystem per Design. Ein Programm wird einmalig, aus Absicht, als Form verfasst: eine verlustfreie Kodierung von Zustand, Ereignissen und reinen Übergängen, wobei in der Gestaltung jeder Ziel-Sprache eine Projektion ist, die ihren Verlauf erneut abspielen muss. Jeder Zustand, in dem ein Programm sich befinden kann, wird in seiner Form deklariert, und ein abgelehntes Ereignis lässt den Zustand unverändert (Satz T8), also verlässt ein Programm im Ökosystem nicht seine Absicht und benötigt keine Nachträgliche Differenzierung oder Fehlerverfolgung. Die Sprache ist eine schriftliche Spezifikation an einem Commit. Der Referenzprüfer implementiert sie und erzeugt Rust, Python und JavaScript, die jeweils 1.459 Konformitätstests mit 0 Fehlern bestehen, und Scala, das noch nicht mit der Referenz übereinstimmt; die Spezifikation verzeichnet das Niveau des Beweises jedes Satzes; und die Dimension eines Programms ist eine berechnete Zahl, gemessen in registrierten Ausführungen an öffentlichen Commits, die RCE-F6 bei einer Population auslösten und nicht bei den anderen. In der Gestaltung der Engine wird jede Lösung, die das Tor anwendet, gespeichert und wiederverwendet, und das Ökosystem verbindet sich unter einem Tor, dessen Richtigkeit monoton ist (Aussage R1). Code aus anderen Sprachen wird so konstruiert, dass er durch Hebung eingeführt wird, eine Konstruktion von der Grammatik jeder Sprache zu ihrem Syntaxbaum und zur Form; ein Go-Muster wird heute durch einen öffentlichen Test erfasst, und das Heben und Erzeugen jeder Sprache ist das Ziel des Vorschlags `spec/proposals/rce-form.md`. Abschnitte 3.6 und 8.7 erklären die Universalitätsaussagen und wie ihre Konstruktion gemessen wird, Abschnitt 9 erläutert die Beobachtungen, die die Ansprüche widerlegen würden, und Abschnitt 10 listet die verbleibende Arbeit auf, einschließlich der Ergebnisse der Engine, die auf öffentlichem Code neu aufgebaut wurde.

<div id="12-the-form-against-the-record" class="anchor-alias" aria-hidden="true"></div>

## 12. Die Form im Vergleich zur Aufzeichnung

Dieser Abschnitt stellt die Form drei Körpern von Beweisen gegenüber: der Theorie und den Werkzeugen jedes Bereichs, den das Design berührt, der Geschichte der Programmiersprachen-Entwicklung, gelesen als Vergleich zwischen dem, was jede Sprache behebt und was sie frei lässt, und den gemessenen Ursachen der Redundanz in menschlich geschriebenen Code. Jeder Unterabschnitt beschreibt, was die Beweise zeigen, mit ihrer Quelle, und dann die Position, die dieses Papier einnimmt und den Grund dafür. Wo eine Position ein Urteil und nicht ein gemessenes Ergebnis ist, sagt der Text dies aus. Die drei Umfragen hinter diesem Abschnitt wurden im Oktober 2026 durchgeführt; ihre vollständigen Texte und Arbeitsnotizen sind im Experiment-Repository veröffentlicht ([openie-research-experiments/rce/surveys](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/surveys)).
<div id="121-seven-areas-of-the-design" class="anchor-alias" aria-hidden="true"></div>

### 12.1 Sieben Bereiche des Entwurfs

**Kanonische Formen.** Für eine vollständige, deterministische Maschine über ein endliches Alphabet ist die minimale Maschine bis auf Isomorphie eindeutig, und eine festgelegte Traversierungsreihenfolge verwandelt dies in eine eindeutige Zeichenfolge [150]. Die Form liefert Vollständigkeit und Determinismus (T1, T2), also hat die Projektion auf endlichen Kontrollanteil von [§3.8](#38-behaviour-equivalence-and-dimension) eine kanonische Form. Der Datenanteil nicht: symbolische endliche Automaten haben eine kanonische Minimum bis auf Prädikatäquivalenz [149], Registerautomaten über Gleichheit oder dichte Ordnung gestatten ein Myhill-Nerode-Theorem [151], und ein Zustand, der durch ganzzahlige Arithmetik aktualisiert wird, hat keinen kanonischen Vertreter außer dem Term selbst. Die Extraktion aus einem e-Graph unter einer Kosten, die gemeinsame Unterterme nur einmal berechnet, ist NP-schwer und nicht approximierbar auf einen konstanten Faktor [158], also muss ein gehashter Vertreter eine Kosten verwenden, die über Extraktoren reproduzierbar ist. Position: drei Formschlüssel, jeder benennend seine Schicht im gehashten Eingabe (den namenlosen Term-Hash, die Kontrollform von [§3.8](#38-behaviour-equivalence-and-dimension) und den e-Klasse-Schlüssel mit seinem Sättigungs-Budget); Äquivalenz definiert einmal, als Bisimulation; geschützte Schritt-Körpererst geprüft durch den fast linearen Entscheidungsprozess der geschützten Kleene-Algebra mit Tests [157]. Abgelehnt: jede Behauptung, dass die minimale Maschine *die* kanonische Form einer Form mit arithmetischem Zustand sei; ein gehashter Vertreter gewählt durch Kosten gemeinsamer Unterterme. Offen: für welchen Fragment gleicher Sinn impliziert gleiche Kontrollform (die Umkehrung von T61).

**Inhaltadressierte Zwischenrepräsentation.** Unisons fünfjährige Erfahrung mit hash-identifizierten Definitionen reduzierte sich auf eine Invariante, dass der Hash Semantik abdeckt und nie benennt, und eine Kosten, Re-Hashing von Abhängigen unter Bearbeitung [159]; Dhall hashen die Normalform einer totalen Sprache [160]; Nixs Versuch, inhaltadressiertes Erzeugen von Ausgaben zu realisieren, blieb experimentell für fünfzehn Jahre, da Selbstreferenzen und Nichtdeterminismus es zerstörten [161]. Position: Definitionen, die durch den Digest des α-erased, normalisierten Körpers mit Namen, Quellpositionen und Literal-Schreibweisen in einer unhashierten Tabelle durch Projektionen gerendert werden, mit einem Emitter, der die Zwischenrepräsentation durch eine pro-Ziel-Tabelle durchläuft, ersetzt vier Emitter, die die Oberflächensyntax durchlaufen; jeder Laufzeit, die serialisiert, wird gegen die kanonischen JSON-Vektoren geprüft. Abgelehnt: den kanonischen JSON als gehashten Bytes durch RFC 8785 ersetzen (der keine ganze Zahl unterscheiden kann von einer Gleitkommazahl, negativen Null oder einer exakten 64-Bit-unsigned-Ganzzahl) oder durch deterministisches CBOR (der zwei Spezifikationen in Bezug auf Gleitkommabreite und Schlüsselreihenfolge nicht übereinstimmen); inhaltadressierte Artefakte als Identität emittiert; vollständige β-Normalisierung vor dem Hashen, da eine rekursive Funktion dann keinen endlichen Term hat. Offen: Komponenten-Schlüssel für gegenseitige Rekursion.

**Der Log als partielle Ordnung.** Eine Spur im Sinne von Mazurkiewicz ist ein Wort modulo der Kommunikation unabhängiger Ereignisse, und alle Linearisierungen eines Konfigurationszustands liefern die gleiche Spur. Der Konsistenzals-logische-Monotonie-Satz besagt, welche Programme keine Koordination benötigen [19], und seine Erweiterung auf Lesen besagt, dass Beobachtungen konvergenter Zustände unsicher sind, es sei denn, sie sind Schwelle-gestaltet [82]. Position: Eintrag des Logs gehasht über seine Kette, Sequenznummer, Ereignis und die Hashes der Einträge, die es kausal beobachtet hat, mit dem Zustandshash nur an Schnitten aufgezeichnet, so dass der Digest unter jeder Linearisierung gleich ist, die die Semantik zulässt; der monotone Tag auf Lesen erweitert; jeder genommene Arm eines cross-chain `select` in den Log geschrieben. Der Satz, dass jede Ordnung, die mit den Abhängigkeiten konsistent ist, auf den gleichen Schnittzustand zusammengeklappt wird (T62), wird auf einem Modell bewiesen und ist ein Vorschlag, nicht normativer Text. Abgelehnt: Erlauben, dass ein Ziel die Linearisierung eines nicht-monotonen Ereignisses wählt. Offen: die Erweiterung des Modellbeweises auf den vollständigen Auswerter.

**Synthese aus Absicht.** Ein Verifier prüft nur Konsistenz: eine Nachbedingung, die immer wahr ist, verifiziert. Die Vollständigkeit einer Spezifikation muss gemessen werden, und die Maß, die funktioniert, ist der Anteil der veränderten Ausgaben, die die Spezifikation ablehnt; das Entfernen dieser Maß aus dem Tor in der Studie, die sie eingeführt hat, senkte Verifizierbarkeit auf 1,56% [162]. Typ-geleitete Aufzählung über Gleichheitsbeschränkte Baumautomaten erhöhte den gelösten Anteil eines Bibliotheks-Suchbenchmark von 64% auf 88% [163], und Selbstverbesserung und Mehrheitsabstimmung rechtfertigen selten ihre Kosten, sobald Kosten pro korrektem Ergebnis berücksichtigt werden [164]. Position: Absicht als ein Programm mit Löchern, die Verpflichtungen tragen, Beispiele, eine benannte Menge nutzbarer Definitionen und ein Budget; eine Regel, die eine Absicht ablehnt, deren Verpflichtungen kein Verhalten ablehnen; eine gemessene Vollständigkeit berichtet mit jeder Absicht; eine Ableitungsaufzeichnung pro Loch, die die Kandidaten vor und nach jedem Check gibt. Abgelehnt: Förderung durch Punkte; Verfeinerungs-Schleifen innerhalb eines Modellaufrufs. Offen: eine korpusunabhängige Maß für die Information, die eine Absicht trägt.

**Energiekostenmodelle.** Die Literatur zur Messung wird in [§6.3](#63-energy) zusammengefasst: Joule sind linear in der Anzahl der Operationen auf einem in-order Kern [152] und linear in der Zeit auf einem out-of-order Kern [153]; On-chip-Counter unterscheiden sich in ihrem Wert um eine Größenordnung [105, 154, 155]; Einheitliche Meterung der Art, die Ethereum verwendet, korreliert mit CPU-Zeit nur bei 0,51 [156]. Position: drei verschiedene Objekte, niemals zusammengefasst - die deterministischen, target-blind Budgeteinheiten der Spezifikation; eine Schätzung, die ein kalibriertes pro-target-Koeffizientenvektor auf die Zähler (in-order) oder auf die Zeit (out-of-order) angewendet wird; und die Beleglabels, in separaten Spalten gehalten. Abgelehnt: Joule in der Budgettabelle; pro-sprachliche Konstanten; ein Counter als Wall-Meter-Messung gelesen.

**Sprachen, die für Maschinenautoren entworfen wurden.** Ein Katalog von 42 solchen Sprachen, 36 davon erstmals 2026 gelistet, zeigt jede dieser Mechanismen mit einem Gegenstück: hash-chained Beweise, verpflichtende Verträge, die in bewiesen und run-time-geprüft geteilt sind, ein Beweis-Assistent-Kern, Syntaxbäume als Quelle der Wahrheit mit gehashten Definitionen [166]. Die Konvergenzbeobachtung von [§3.7](#37-the-language-one-text-costs-and-theorem-status) gilt. Was diesen Entwurf unterscheidet, ist nicht irgendein Mechanismus, sondern dass Wiederholung und Injektivität Theoreme (T3, T7) sind und nicht Laufzeitversprechen, und dass Beispiele typisierte Ereignis-Spuren über die gleiche Semantik sind, die Wiederholung verwendet, also ist der Oracle, den ein Modell nicht umgehen kann, das Programm selbst. Position: eine versionierte Registrierung von Regeln mit maschinenlesbaren Diagnosen und Reparaturplänen; testvalidierte Übersetzungspaare hergestellt aus den Emittoren und dem Checker, der die Rezeptur ist, die in [165] niedrigressourcensprachen wiederkehrend laufen. Abgelehnt: jede Behauptung, erster oder einziger zu sein.

**Beweis-Ingenieurwesen.** Die Standards, die den Abstand zwischen einer Spezifikation und ihrem mechanisierten Modell schlossen, taten dies, indem sie Prosa, Checker-Tabelle und Definitionen aus einem autorisierten Quelltext generierten: SpecTec für WebAssembly fand zehn Fehler in fünf Vorschlägen und wurde für alle zukünftigen Ausgaben angenommen [167]. Die Projekte, die eine Implementierung korrekt durch Verfeinerung bewiesen, zahlten dafür: etwa zwölf Person-Jahre für 8.700 Zeilen C-Code [169]. CompCerts Wartungsteam listet jedes vertrauenswürdige Item mit seinem Grund auf [168]. Position: ein autorisierter Regeln-Quelltext, der die Spezifikationstext, Checker-Tabelle und Lean-Definitionen generiert, mit einem Check, der bei jeder Divergenz fehlschlägt; der Lean-Kern als Ausführer für den Teil, den er abdeckt, mit der Anzahl der nicht unterstützten Konstrukte veröffentlicht und jede Theorem-Aussage umschließend; ein Kapitel, das jedes vertrauenswürdige Komponente mit seinem Test auflistet. Abgelehnt: ein Verfeinerungs-Beweis vom Lean-Kern zum Rust-Interpreter; Theorem-Anzahlen als Maß für Sicherheit; zwei autorisierte Semantiken von etwas.
<div id="122-the-form-among-programming-languages" class="anchor-alias" aria-hidden="true"></div>

### 12.2 Die Form unter Programmiersprachen

Etwa hundert Sprachen aus zwölf Familien wurden auf acht Koordinaten , Zustandslayout, Ereignisalphabet, Übergang, Ordnung, Ressource, Vertrauen, Bindungszeit und Absicht , platziert, wobei für jede festgelegt wurde, ob der Autor sie festlegt, der Compiler oder Laufzeit sie wählt oder die Sprache kein Wort dafür hat. Drei Regelmäßigkeiten folgen. Nur drei Familien erzielen globale Determinismus ohne den Einsatz des Autors, durch drei verschiedene Theoreme: die synchronen Sprachen durch einen Kausalitätscheck, die Stream- und Logiksprachen durch Monotonie und die guarded-atomic-action-Sprachen durch eine Regel- pro-Mal-Planung mit statischer Konfliktanalyse. Jede Familie, die eine Sicherheitszertifizierung erreichte, tat dies, indem sie dieselben drei Koordinaten entfernte, die die Form entfernt: dynamische Zuordnung, unbeschränkte Rekursion und nichtdeterministische Wahl. Und die beiden Koordinaten, die keine Familie gut festlegt, sind Vertrauen und Absicht; die Absicht und Beispielblöcke der Form sowie ihre Fähigkeitswerte legen beide fest.

Die fünf Entwürfe, die der Form am nächsten sind, sind Dedalus, dessen zeitindexierten Relationen der Log ist und dessen nächsten Schritt Regeln die Übergang sind [15]; Bluespec, dessen guarded atomic Regeln von einem Compiler gewählten Ordnung geplant werden, die als gleich zu einer Regel pro Mal-Ausführung bewiesen wurde; die Elm-Architektur, die die vier Komponenten der Form unter anderen Namen sind [83]; Lustre, dessen begrenzter Speicher, statisch geplanter Disziplin in etwa hundert Flugzeugsteuerungssystemen zertifiziert wurde; und Unison, auf Identität [159]. Der Bericht legt auch fünf Einschränkungen fest, jeweils einen Ort, an dem eine frühere Sprache für die entgegengesetzte Wahl bezahlt hat. Konkurrenzaufgaben müssen auf Zustandsmaschinen ohne Stack reduziert werden, wie Rusts asynchrone Funktionen es tun, weil eine Stack-voll Coroutine nicht Schritt für Schritt protokolliert werden kann. Parallelcomposition muss als strukturierter Schritt emittiert werden, nie als explizites Produkt von Automaten, was bei Esterels Compilern über etwa tausend Zeilen paralleler Quellcode fehlgeschlagen ist. Effekt-Handler sind ein Nicht-Ziel des Entwurfs 0.9: Spezifikation F.2 schließt resumierbare und multi-shot Handler aus, mit Verweis auf die Totalitäts-Schranke des Theorems T2 und der Wiederholung aus dem Log des Theorems T3. Der Bericht argumentiert für die Ausschluss aus der Eigentumsfrage und die Schranke des Theorems T2 stattdessen: Jede zusätzliche Resumption dupliziert den gefangenen Zustand, und die Anzahl der Resumptions hängt von den Daten ab, also existiert keine Schranke aus dem Aufrufgraphen; es findet den Argument aus dem Theorem T3 beantwortbar. Es schließt, dass Handler ein-shot sein müssen, wie OCaml 5 gewählt hat, und nennt ein-shot, tail-resumptive Handler als Fragment, das die Form ohne Verletzung beider Theoreme aufnehmen könnte. Die einzige Dimension eines Programms, die ein Theorem ist, ist der Index seiner endlichen Steuerung Projektion ([§3.8](#38-behaviour-equivalence-and-dimension)). Und die Hebung aus einer Turing-vollständigen Sprache ist eine partielle Abbildung, deren Definitionsbereich unentscheidbar ist ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). Das Vokabular der Differentialgeometrie, das ein früherer Entwurf dieses Projekts verwendet hat (Karten, Gauge, Holonomie, Geodäten), hat keinen Gegenpart in der Literatur der Programmiersprachen und wird hier nicht verwendet; die Objekte, die existieren, sind der finale Coalgebra, Funktoren von Syntax in sie, die Gruppoid der Umformulierungs-Beweise, deren verbundene Komponenten e-Klassen sind, und Minimum Beschreibungs Länge mit Joule anstelle von Bits.

Die Universalitätsaussagen von [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis) werden durch einen Kapselungskriterium messbar. Die Form kapselt eine Sprache $L$, wenn für jedes Programm $p$ von $L$ in einem festen Corpus die aufgehobene Form nicht schlechter als $p$ auf fünf Koordinaten ist und mindestens auf einer besser: Joule gemessen auf denselben Aufgaben und Host; Redundanz im Sinne von [§3.8](#38-behaviour-equivalence-and-dimension) gegen die Zustandsbits $p$ deklariert; Entscheidbarkeit, bedeutet jede Eigenschaft, die für $p$ entschieden wird, wird für die Form entschieden; die Rundreise, bedeutet Verhaltensübereinstimmung bis zu einer angegebenen Länge und die Linsenbedingung auf dem Formhash; und der Kosten für ein Modell, um ein Tor-übergehendes Programm von derselben Absicht zu erreichen. Die Behauptung, dass die Form besser als eine Programmiersprache ist, ist die Konjunktion dieses Kriteriums über den Corpus, eine registrierte Ausführung pro Sprache und nichts anderes: sie beansprucht weder Ausdruckskraft, da eine Form nicht mehr sagen kann als $p$, noch Lesbarkeit, die eine Eigenschaft einer Projektion ist, noch Adoption. Eine Sprache, auf der die Form auf jeder Koordinate nach zwei registrierten Ausführungen streng schlechter ist, wird nicht eingekapselt, und der Bericht über das, was diese Sprache festlegt, was die Form nicht tut, wird ein Arbeitselement für die Form.
<div id="123-why-human-written-code-is-redundant" class="anchor-alias" aria-hidden="true"></div>

### 12.3 Warum menschlich geschriebener Code redundant ist

Menschlich geschriebener Code trägt Redundanz dort, wo das Medium dem Autor keinen Kanal für das Gewünschte bietet, und diese Redundanz ist jeder Autors private Ersatzlösung. Die gemessenen Beweise unterteilen sie in drei Schichten. Die Formatierung macht 13 bis 15 % der Tokens von geschweiften-Klammern-sprachen aus und kann ohne Verlust an Genauigkeit entfernt werden, wenn zehn Sprachmodelle verwendet werden [136], und die Anordnung hat keinen messbaren Einfluss auf die menschliche Verständigung [135]. Die einzigen Größen, die den gemessenen Verständigungsaufwand verfolgen, sind Textgröße, Vokabulargröße und der Umfang der Datenflussabhängigkeiten, jeweils bei Kendalls τ ≈ 0,4, während die cyclomatische Komplexität nichts verfolgt (τ ≈ 0,09) [133]; und 97 % der realen Konkurrenzfehler, die nicht Deadlocks sind, sind ungeprüfte Annahmen über Atomarität oder Reihenfolge, 96 % davon betreffen maximal zwei Threads, weil sequenzieller Text keine partielle Ordnung ausdrücken kann und der Autor eine totale schreibt [170]. Namen werden mit einer Medianübereinstimmung von 6,9 % zwischen Entwicklern gewählt und werden bei 97 % decodiert [137]; Kommentare verlieren den Verlauf des Codes, den sie beschreiben, innerhalb weniger Commits [138]; doch verlieren Sprachmodelle bis zu 29 Punkte Genauigkeit, wenn Identifikatoren entfernt werden [139]. Zwei weitere Ursachen sind organisatorisch. Entwickler löschen nicht: in drei Produktionsystemen waren 54 bis 60 % der Dateien nie über sechs bis sechzehn Monate ausgeführt worden, Entwickler entfernten 20 % des Codes, den sie gezeigt wurden, als unnötig zu sein, und die Vorsicht war angemessen, da der Detektor 32 % präzise war [171]. Und Organisationen senden ihre Grenzen: acht organisatorische Metriken prognostizierten fehleranfällige Binärdateien mit 86,2 % Präzision und 84,0 % Recall, besser als jede Code-Metrik [172].

Die folgende Position besteht aus vier Teilen. Die Form nimmt Ordnung, Lokalität, Idiom und Erreichbarkeit an, jeweils entscheidbar über einen Zustand, eine Ereignismenge und einen totalen Schritt. Die Projektion nimmt Anordnung und Idiom an, dargestellt pro Gemeinschaft, weil der Vorteil eines Experten auf Code beschränkt ist, der in vertrauten Plänen geschrieben wird, und eine Projektion, die lediglich korrekten Code erzeugt, kostet sie dies. Die Absicht bleibt eine strukturierte, geprüfte Aufzeichnung, aus der die Projektion Namen rendert ([§3.8](#38-behaviour-equivalence-and-dimension)). Und die Spezifikation wird durch eine mechanische Zulassungsprüfung geregelt, da die Autorität durch Modelle die Rate der Vorschläge erhöht, ohne die Regel zu ändern. Drei Fragen, auf denen das Design beruht, hatten keine Messung in der Literatur und wurden als Experimente mit versiegelten Protokollen registriert: ob ein Modell genauso genau von einer namenlosen Form mit ihrem Konzeptaufzeichnung wie von einer benannten Oberfläche denkt; welcher Anteil der benachbarten Aussagen in gewöhnlichem Code unter der Form-Abhängigkeit vertauschbar ist, was die Größe der Schlacke ist, deren Kosten der 97 % -Zahl misst; und ob eine Löschung, die durch Wiederholung geprüft und durch einen Befehl umkehrbar ist, die 20 % -Löschungsrate verändert. Zwei Behauptungen, die im Projektmaterial der Arbeit zirkulierten, haben keine nachvollziehbare Quelle und werden nicht verwendet: eine 2014 Studie über die Seitenzahlen von Sprachhandbüchern, und die Aussage, dass erfahrene Programmierer weniger Code schreiben, die auf einen Weblog-Beitrag zurückgeht, der eine nicht genannte Studie zitiert.

<div id="124-how-the-language-grows-and-shrinks" class="anchor-alias" aria-hidden="true"></div>

### 12.4 Wie die Sprache wächst und schrumpft

Jede Sprache, die klein blieb, ersetzte den Geschmack der Prüfer mit einer Regel, was als zulässig gilt. Go's Prozess ist geneigt, abzulehnen, und in einer Studie wurde 40,9 % von 1.095 Vorschlägen mit einer veröffentlichten Menge von Gründen abgelehnt [173]; Lus Regel der Mechanismen statt der Politiken hielt ihre Implementierung auf etwa 25.000 Zeilen C-Code; Elm stoppte. Das Regime, das wächst, wird auch von seinem eigenen Vorsitzenden dokumentiert: der Nutzen einer Funktion ist privat und sofortig, ihr Preis diffus und aufgeschoben, und es ist einfacher, Begeisterung für etwas Neues zu wecken als für etwas zu widerstreben [175]. In RCE wächst die Form innerhalb eines Textes. Wenn ein Programm eine Form benötigt, die der Text nicht hat, einschließlich einer, die niemand vorhergesehen hat, wird die Form direkt in die Spezifikation geschrieben, ohne Version und ohne Makro, Flag, Direktive oder Plugin. Der Spezifikations-Repository gibt sieben Regeln an, wie eine Form in den Text gelangt, jede benennend das Artefakt, das sie durchsetzt. Ein Konstrukt gelangt in die normative Grammatik nur mit einem angenommenen und einem abgelehnten Beispiel, einer Lean-Aussage des Theorems, auf das es sich stützt, verknüpft mit dem Prüfer durch eine generierte Regeltabelle oder durch Testvektoren, und ohne Parsing-Konflikte; alles weniger ist ein Vorschlag. Eine zweite Schreibweise von etwas, das die Form bereits sagt, wird allein auf dieser Grundlage abgelehnt. Änderungen laufen in beide Richtungen: jedes Konstrukt kann geändert, verallgemeinert, ersetzt oder entfernt werden, wenn eine bessere Form gefunden wird, und die Änderung bewegt sich gemeinsam mit jedem Programm, Beispiel und Bibliotheksmodule des Repositorys, das sie berührt, in einem Commit, mit einer Buchungsspalte, die angibt, was geändert und warum. Jede Schnittstelle hat einen Entscheidungspunkt, weil eine organisatorische Grenze, die durch eine Schnittstelle läuft, ein prognostiziertes Defektszenario ist [172]. Die Entscheidungen und ihre Gründe werden in einem Buchhaltungsregister mit einer festen Menge an Gründen veröffentlicht, so dass die Ablehnungsrate eine Zahl ist, die jeder lesen kann. Der Markt schneidet nicht, also ist der Gebrauch nie ein Grund, ein Konstrukt zu behalten. Und die Autorität durch ein Modell verändert die Rate, nicht die Regel.
<div id="125-the-library-and-the-compute-fabric" class="anchor-alias" aria-hidden="true"></div>

### 12.5 Die Bibliothek und der Compute-Stack

Ob eine Sprache eine große Bibliothek ("batteries included") mitliefern sollte oder einen kleinen, spezifizierten Kern mit einer freien Registrierung, wird üblicherweise als Kompromiss zwischen Bequemlichkeit und Flexibilität diskutiert. Die Erfahrung zeigt, dass beide Positionen an demselben Punkt scheitern [193]. Eine mit der Sprache gelieferte Bibliothek bindet ihre Schnittstelle an das Kompatibilitätsversprechen der Sprache und verliert Flexibilität [195]. Ihre Module werden entfernt, sobald ein Installer existiert: Python Enhancement Proposal 594 entfernte 22 von ihnen, wobei Wartungskosten und die Einfachheit der Installation aus der Registrierung genannt wurden [194]. Eine freie Registrierung führt zu tiefen transitiven Graphen: die Hälfte der abhängigen Pakete in Cargo, npm und NuGet haben mindestens 41, 21 und 27 transitive Abhängigkeiten [196]. Eine Spezifikation mit vielen Implementierungen divergiert an ihren Rändern, wie mehr als 30 JSON-Parser auf einer unter-spezifizierten Grammatik tun [197]. Wo die Erfahrung konvergiert, konvergiert sie auf eine kurierte Schicht, die als Einheit geliefert und geändert wird.

Dieser gleiche Fehler tritt auch in Compute-Stacks auf. Auf Grafikprozessoren übertreffen Single-Source-Modelle die native Code auf Streaming-Kernen, verlieren aber bei Reduktionen: bei dem Punktprodukt liegen die Leistungsportabilitätsbewertungen von Kokkos, RAJA und SYCL zwischen 0,80 und 0,91 [198]. Auf einem FPGA erreicht eine SYCL-Quelle, die von CUDA migriert und für eine GPU optimiert wurde, 0,2 % bis 47 % der Geschwindigkeit ihrer FPGA-optimierten Version, gemäß den Verhältnissen, die aus den veröffentlichten Zeiten bei der größten Problemgröße abgeleitet wurden [193, 199]. Die untersuchten Systeme, die eine Bedeutung sowohl in Software als auch in Hardware erreichen, tun dies, indem sie ihre Quellsprache auf das reduzieren, was ihre Hardware bedeuten kann (zustand von statisch bekannter Größe, kein Heap oder Rekursion in der Hardware-Teil, eine logische Ticks), und ihre Beweise decken Teile der Kette, nicht alle [193, 200]. Portierbare Codeformate funktionieren, wo sie Semantik festlegen [201]. Bitidentische Ergebnisse kosten wenig, wenn sie entworfen werden [202]. Konsistenzresultate für Speichermodelle sind paarweise [203]. Platzierung aus gemessenen Kosten ist nichtdeterministisch, es sei denn, jede Entscheidung wird aufgezeichnet und wiederholt, oder der Lauf wird in virtueller Zeit simuliert [193, 204]. Für Maschinenautoren ist die Frage auch eine von Wissen: von den Paketen, die durch Code in 16 Modellen in Python und JavaScript benannt wurden, existierten 19,7 % nicht [205].

Beide Debatten fragen, wo die Bedeutung einer Bibliothek gehalten wird: durch eine Implementierung, durch jedes Registrierungspaket, durch eine Spezifikation mit Toleranzen oder durch ein Vendor-Binary für einen Stack. Die RCE-Position hält sie im einen Text.

- **Die Bibliothek ist Teil des Textes.** Sie wird in der Sprache geschrieben und in jedes Werkzeug eingebaut (Spezifikation 4.1). Sie wird durch den Hash ihres Manifests festgelegt, das ein Programm als seine einzige Abhängigkeit benennt (F.5.3).
- **Sie hat keine Plattformvariante.** Sie führt Eingabe und Ausgabe nur über Adapter durch.
- **Ihr Kosten ist der Kosten ihrer Quelle auf jedem Binärdatei.** Ein Schritt bedeutet daher auf jedem Host dasselbe (HC-7).
- **Die pro-Ziel Wahl gehört dem Host.** Der Host akzeptiert einen Stack für eine Klasse von Operationen nur nach einem protokollierten bitgenauen Test gegen die CPU-Referenz (HC-13), und er protokolliert jede Platzierung für Wiederholung (HC-12).
- **Was verfügbar ist, ist eine Liste, die ein Werkzeug ausgibt, vollständig bei jedem Commit und wächst im selben Text.** Ob eine Funktion existiert, wird zu einer Suche statt zu einer Erinnerung.

Die Form tut dies als Form, nicht als Tor. Die Systeme der Erfahrung schneiden ihre Quellsprache ab, weil sie mehr sagt, als ihre Hardware bedeuten kann. Die Form P = (S, E, δ, D, λ) ist die Form, die jedes Programm bereits hat: den Zustand, den es hält, die Ereignisse, auf die es antwortet, seinen Schritt, seinen Log und seine Ausgaben. Deshalb werden Programme anderer Sprachen entworfen, um in sie einzutreten, innerhalb des Bereichs [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis) Zustände, und warum kein Teil dieser Position Programme in angenommene und abgelehnte unterteilt.

Die Form ist bei jedem Commit starr, mit einem Text und einer Bedeutung. Sie ist flexibel über Commits. Wenn ein Programm eine Form benötigt, die die Form nicht hat, gewinnt die Form sie im Text, nie durch einen Makro, Flag, Direktive oder Plugin neben ihr. Eine Änderung kann eine Form erweitern, verallgemeinern oder ersetzen. Sie bewegt sich gemeinsam mit den Programmen des Repositorys in einem Commit, und die Programmhässen, der Äquivalenztest von [§3.8](#38-behaviour-equivalence-and-dimension) und der Log protokollieren, was sich bewegt. Verhalten und Äquivalenz (Spezifikation 6.10) und die Einträge des Hosts-Stacks wurden innerhalb des Texts hinzugefügt, ohne die Bedeutung irgendeines angenommenen Programms zu ändern, und der Log als partielle Ordnung und Absicht mit Lücken werden auf dieselbe Weise vorgeschlagen. Unter der Vorschlag folgt die Hardware demselben Regel: die Engine liest die Zustandsgrößen und Schritt-Kosten einer Form, um sie zu realisieren, mit einem statisch dimensionierten Zustand in Registern und einem wachsenden Zustand im Speicher, den der Schaltkreis adressiert.

"Batteries included" und "Spezifikation und frei" stoppen dann, als Alternativen zu gelten: die Batterien sind Teil der Spezifikation, und das Programm ist frei von jedem Stack.

Die Bibliothekshälfte dieser Position gilt im Repository in ihren Hauptteilen: die Bibliothek wird in der Sprache geschrieben, in jedes Werkzeug eingebaut und durch Hash festgelegt. Ein Teil bleibt: eine Definition der Standardbibliothek über die Abschnitte der Spezifikation. Seit openIE-dev/rce `5e701e33` (27. Oktober 2026), ist `use` die einzige Möglichkeit, ein Bibliotheksmodule einzubringen. Die Stack-Hälfte ist ein Vertrag, dessen Wiederholung auf einem Modell des Hosts bewiesen wird (Spezifikation Anhang E, Satz T37), mit den Beispiel-Logs durch den Referenzprüfer (`tests/host_contract.rs`) wiederfalt, und einem Referenz-Ausführer, dessen Wiederholung gegen seine Live-Ausführung getestet wird (`tests/host_runtime.rs`), auf CPUs allein ausgeübt. Der Vorschlag "eine Bibliothek und eine Form auf jedem Compute-Stack" listet, was bleibt [193]:

- eine Definition der Standardbibliothek;
- Beweise der Probe auf Wiederholung;
- Platzierung auf jedem Ausführungs-Pfad;
- einen Reduktionsbaum pro Konstruktion;
- Kalibrierungs-Läufe;
- Integer- und binary32-Operationen;
- Hardware-Realisierung gelesen von jedem Form-Form;
- ein Host ohne Betriebssystem;
- zwei Messungen, die die Erfahrung fehlt: eine Kernel-Energie über Geräteklassen unter einer Grenze, und den Anteil der Bibliotheksfunktionalität, die Modell-Assistenten wiederverwenden anstatt neu implementieren.
<div id="13-programme-of-work-and-its-gates" class="anchor-alias" aria-hidden="true"></div>

## 13. Arbeitsprogramm und seine Tore

Zwei unabhängige Überprüfungen der öffentlichen Repositories im Oktober 2026 kamen zu der gleichen Diagnose. Der Checker wird nicht selbst verifiziert: nichts verfeinert die Lean-Semantik bis zum Rust-Interpreter, die beiden Lean-Kerne haben keine Theorie, die sie miteinander verknüpft, und der Bericht der Konformitäts-Suite für den mechanisierten Kern (`conformance/reports/results-lean-core.json` bei öffentlichem Commit `d91a9fc8`) verzeichnet 210 bestandene Tests, 1 fehlgeschlagenen und 1.766 nicht unterstützte von 1.977, also ungefähr ein Zehntel der Suite unter der Theorie, die der Übersicht bewirbt. Emittierter Code ist ein dynamischer Wert Laufzeit pro Ziel, vier handgeschriebene Laufzeiten von jeweils etwa 2.000 Zeilen. Die Energie-Schätzung kann Ziele nicht voneinander unterscheiden, also wählt die geringste Joule-Extraktion nie eines. Das Engine-Profil legt eine Hebung für vier Sprachen fest, keiner davon öffentlich; die einzige öffentliche Hebung ist ein Prüfprogramm für ein Go-Muster, und der Universalitätsanspruch benötigt zehn. Und das Engine - die Gänge, der e-Graph, die Umformungen und ihre Beweise, der Kern und seine Modellprüfung sowie die Hebung - ist nicht öffentlich, also treten die Ergebnisse, die es erzeugt, in diesen Artikel nur ein, wenn sie jeweils auf öffentlichem Code neu aufgebaut werden; [§10](#10-work-to-finish) listet sie mit ihren Rebuild-Tracks auf. Für ein Projekt, dessen angegebener Grund für die Arbeit im offenen Umfeld Nachverfolgbarkeit ist, ist das der größte Risiko im Programm.

Das Programm ist nach Abhängigkeiten geordnet: Wiederherstellung zuerst; dann die Kodierung und das Kostenmodell, auf dem jede spätere Messung beruht; dann die Beweiskette; und erst dann Breite. Jede Phase endet an einem Tor, das ein Falsifizierer ist, der vor dem Lauf registriert wird, mit einem Konfidenzintervall berichtet wird; eine Phase schließt, wenn ihre Torbeobachtung veröffentlicht wird, nie aufgrund von Aufwand. Die Tore sind in [§9](#9-falsifiers) und in der Tabelle unten angegeben.

| Phase | Lieferables | Was die Phase besiegt |
|---|---|---|
| 0 Wiederherstellen | Jedes Ergebnis, das auf dem Engine basiert, der auf öffentlichem Code bei einem markierten Commit neu aufgebaut wurde, wie [§10](#10-work-to-finish) auflistet; die pro-Aufgaben-Records jedes neu aufgebauten Laufs; die zurückgehaltene Defects4J-Menge abgeschlossen; jede Registrierung mit Hash versiegelt; eine Versionsschnur; die Spezifikationsfehler geschlossen; ein Schreibweise für Beendigung, Autorität und Fehler; eine veröffentlichte Messung der Oberflächenredundanz (unterschiedliche Konstrukte pro Form über das Beispiel-Korpus) | Eine Zahl in diesem Artikel, die nicht aus einem öffentlichen Commit mit einem Befehl neu aufgebaut werden kann |
| 1 Form einfrieren | Inhaltadressierte Definitionen als einzige Zwischenform; typisierte Beziehungen als Form-Wert; eine Absenkung, die jeder Emitter konsumiert; die Rundreisebedingung pro Ziel geprüft; ein pro-Ziel Kostenmodell kalibriert, wie [§6.3](#63-energy) beschreibt | Eine Definition aufgrund der Größe abgelehnt; ein Ziel, dessen Rundreise einen Form-Hash verändert; das Kostenmodell zwei Ziele entgegengesetzt zur Wand-Messung rangiert |
| 2 Ein Kern, verifiziertes Tor | Ein einzelner Lean-Kern mit T1 bis T9 erneut formuliert; die Typregeln aus der Regel-Tabelle des Checkers generiert, so dass eine Regel ohne Lean-Entsprechung den Build fehlschlägt; der Checker und der Interpreter aus Lean extrahiert und als Tor verwendet, mit dem Rust-Checker als überprüftem Front-End | Der extrahierte Tor und der Rust-Checker stimmen über ein Programm nicht überein; eine erneut formulierte Theorie benötigt einen angenommenen Schritt; Konformitäts-Tests über 10 % nicht unterstützt |
| 3 Ziele in Joule bewertet | Rank-n-Arrays und Bulk-Operationen als einzige Schreibweise für numerische Arbeit; Zig- und Fortran-Emitter mit festen Gleitkommamodus und Überlaufmodus; Layout-Hinweise in der Passung und nie in der Form; ein Übersetzungsbewertungszertifikat pro emittiertem Modul; das Wand-Meter-Protokoll von [§8.3](#83-a-wall-meter) | RCE-F3 und RCE-F5; ein Modul ohne Zertifikat emittiert; Extraktion wählt denselben Begriff für jedes Paar Ziele |
| 4 Hebung als Eingang | Eine Hebung pro Sprache, Go und Python zuerst, dann TypeScript und Rust, dann C und Zig; 10.000 Programme pro Sprache mit der Hebung eingefroren; das Verpackungskriterium von [§12.2](#122-the-form-among-programming-languages) pro Sprache ausgeführt; ein öffentliches, nur hinzufügendes Log der angenommenen Form-Hashes mit ihren Zertifikaten | Hebungsumfang unter 10 % bei einer der ersten vier Sprachen nach dem zweiten registrierten Lauf; die Form ist auf jedem Koordinaten des Kriteriums strikt schlechter |
| 5 Das Ökosystem verbindet sich | Synthese aus Absichten mit Lücken; die ersten Gänge öffentlich mit ihren Verifizierungszertifikaten; das Konvergenzprotokoll von [§8.6](#86-convergence-of-model-calls-at-large-n) auf 1.000 öffentlichen Spezifikationen; Baselines in einer Tabelle mit Kosten pro korrektem Ergebnis in Joule und Dollar | RCE-F1, RCE-F2, RCE-F4; die Tools können sich nicht selbst prüfen oder emittieren |

Drei Positionen, an denen die Überprüfungen sich von den Umfragen in [§12](#12-the-form-against-the-record) unterschieden, werden wie folgt gelöst. Kanonisches JSON bleibt die einzige gehashte Kodierung, aus den Gründen, die in [§12.1](#121-seven-areas-of-the-design) genannt werden; eine binäre Kodierung kann es nur für den Transport spiegeln, wenn sie eine Bijektion zu diesen Bytes ist, auf denselben Vektoren geprüft. Die eine Schreibweise für Beendigung ist eine deklarierte abnehmende Messung, mit den Schleifen- und Rekursionsgrenzen als Semantik; die inhaltadressierte Form benötigt immer noch einen begrenzten Fixpunkt für Rekursion, und die Messung ist das, was sie begrenzt. Das Reduzieren des Konkurrenz-Vokabulars auf zwei Primitive wird als offenes Vorschlag aufgezeichnet, nicht als Entscheidung, weil die Theoreme der beiden Primitive zuerst auf dem Checker bewiesen werden müssen, nicht auf einem Modell. Nicht im Programm überhaupt: ein selbsthostender Compiler vor Phase 2, weitere Ziele vor Phase 1, jede Konstruktion der Anhänge vor ihrem Theorem, und ein Produktionscompiler, den die Spezifikation selbst in ihrer eigenen Übersicht sagt, nicht bis das Dokument nicht mehr bewegt wird.

Seit den Überprüfungen haben die sechs Repositories, die mit der Spezifikation übereinstimmen müssen - das Buch, die Beispielprogramme, die Standardbibliothek, die Konformitäts-Suite, das Grammatik-Paket und der Editor - in das Spezifikations-Repository mit ihren Historien zusammengefasst werden, und jeder wird von einem Workflow geprüft, der den Checker aus demselben Commit baut. Nichts im Projekt fixiert oder vermarktet eine ältere Spezifikation; der vermarkte Checker des Editors, sechs Commits hinterher, war die letzte solche Fixierung. Das Forschungs- und das Experiment-Repository bleiben getrennt und lesen das Spezifikations-Repository; es liest sie nie.
<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Literatur

[1] C. E. Shannon, "Prediction and Entropy of Printed English," *Bell System Technical Journal* 30(1), 1951. doi:10.1002/j.1538-7305.1951.tb01366.x

[2] Y. Gurevich, "Sequential Abstract State Machines Capture Sequential Algorithms," *ACM Transactions on Computational Logic* 1(1), 2000. doi:10.1145/343369.343384

[3] A. Blass and Y. Gurevich, "Abstract State Machines Capture Parallel Algorithms," *ACM Transactions on Computational Logic*, 2003. doi:10.1145/937555.937561

[4] N. Dershowitz and Y. Gurevich, "A Natural Axiomatization of Computability and Proof of Church's Thesis," *Bulletin of Symbolic Logic*, 2008. doi:10.2178/bsl/1231081370

[5] E. F. Codd, "A Relational Model of Data for Large Shared Data Banks," *Communications of the ACM*, 1970. doi:10.1145/362384.362685

[6] G. H. Mealy, "A Method for Synthesizing Sequential Circuits," *Bell System Technical Journal*, 1955. doi:10.1002/j.1538-7305.1955.tb03788.x

[7] E. F. Moore, "Gedanken-Experiments on Sequential Machines," *Automata Studies*, 1956. doi:10.1515/9781400882618-006

[8] K. Kang et al., "Feature-Oriented Domain Analysis (FODA) Feasibility Study," CMU/SEI-90-TR-021, 1990.

[9] R. Alur et al., "Syntax-Guided Synthesis," FMCAD 2013. doi:10.1109/FMCAD.2013.6679385

[10] D. Harel, "Statecharts: A Visual Formalism for Complex Systems," *Science of Computer Programming*, 1987. doi:10.1016/0167-6423(87)90035-9

[11] R. Tate, M. Stepp, Z. Tatlock and S. Lerner, "Equality Saturation," POPL 2009. doi:10.1145/1480881.1480915

[12] M. Willsey et al., "egg: Fast and Extensible Equality Saturation," POPL 2021. doi:10.1145/3434304

[13] B. Moseley and P. Marks, "Out of the Tar Pit," 2006.

[14] M. Fowler, "Event Sourcing," 2005. https://martinfowler.com/eaaDev/EventSourcing.html

[15] P. Alvaro et al., "Dedalus: Datalog in Time and Space," LNCS 2011. doi:10.1007/978-3-642-24206-9_16

[16] A. M. Turing, "On Computable Numbers," *Proceedings of the London Mathematical Society*, 1937. doi:10.1112/plms/s2-42.1.230

[17] A. Church, "An Unsolvable Problem of Elementary Number Theory," *American Journal of Mathematics*, 1936. doi:10.2307/2371045

[18] P. Wadler, "Propositions as Types," *Communications of the ACM*, 2015. doi:10.1145/2699407

[19] J. M. Hellerstein and P. Alvaro, "Keeping CALM," *Communications of the ACM*, 2020. doi:10.1145/3369736

[20] G. Kahn, "The Semantics of a Simple Language for Parallel Programming," IFIP 1974, pp. 471 to 475.

[21] H. Husain et al., "CodeSearchNet Challenge," 2019. arXiv:1909.09436

[22] D. Kim, J. Nam, J. Song and S. Kim, "Automatic Patch Generation Learned from Human-Written Patches" (PAR), ICSE 2013. doi:10.1109/ICSE.2013.6606626

[23] K. Liu et al., "TBar: Revisiting Template-based Automated Program Repair," ISSTA 2019. arXiv:1903.08409

[24] K. Liu et al., "AVATAR: Fixing Semantic Bugs with Fix Patterns of Static Analysis Violations," SANER 2019. arXiv:1812.07270

[25] A. Koyuncu et al., "FixMiner: Mining Relevant Fix Patterns for Automated Program Repair," 2018. arXiv:1810.01791

[26] Y. Padioleau et al., "Documenting and Automating Collateral Evolutions in Linux Device Drivers" (Coccinelle), EuroSys 2008. doi:10.1145/1352592.1352618

[27] A. Solar-Lezama et al., "Combinatorial Sketching for Finite Programs," ASPLOS 2006. doi:10.1145/1168857.1168907

[28] L. Chen, M. Zaharia and J. Zou, "FrugalGPT," 2023. arXiv:2305.05176

[29] S. Haber and W. S. Stornetta, "How to Time-Stamp a Digital Document," *Journal of Cryptology*, 1991. doi:10.1007/BF00196791

[30] S. A. Crosby and D. S. Wallach, "Efficient Data Structures for Tamper-Evident Logging," USENIX Security 2009.

[31] L. de Moura and N. Bjørner, "Z3: An Efficient SMT Solver," TACAS 2008. doi:10.1007/978-3-540-78800-3_24

[32] Kani Rust Verifier. https://github.com/model-checking/kani

[33] C. V. Lopes et al., "DéjàVu: A Map of Code Duplicates on GitHub," OOPSLA 2017. doi:10.1145/3133908

[34] M. Gabel and Z. Su, "A Study of the Uniqueness of Source Code," FSE 2010. doi:10.1145/1882291.1882315

[35] A. Hindle et al., "On the Naturalness of Software," ICSE 2012. doi:10.1109/ICSE.2012.6227135

[36] D. Kocetkov et al., "The Stack: 3 TB of Permissively Licensed Source Code," 2022. arXiv:2211.15533; The Stack v2 dataset card, https://huggingface.co/datasets/bigcode/the-stack-v2

[37] R. Just, D. Jalali and M. D. Ernst, "Defects4J: A Database of Existing Faults to Enable Controlled Testing Studies for Java Programs," ISSTA 2014. doi:10.1145/2610384.2628055

[38] C. E. Jimenez et al., "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" 2023. arXiv:2310.06770

[39] R. Aleithan et al., "SWE-Bench+: Enhanced Coding Benchmark for LLMs," 2024. arXiv:2410.06992

[40] C. E. Shannon, "A Mathematical Theory of Communication," *Bell System Technical Journal* 27, 1948. doi:10.1002/j.1538-7305.1948.tb01338.x

[41] A. N. Kolmogorov, "Three approaches to the quantitative definition of information," *Problemy Peredachi Informatsii* 1(1), 1965 (in Russian); English translation, *International Journal of Computer Mathematics* 2, 1968. doi:10.1080/00207166808803030

[42] R. J. Solomonoff, "A formal theory of inductive inference. Part I," *Information and Control* 7(1), 1964. doi:10.1016/S0019-9958(64)90223-2

[43] G. J. Chaitin, "A Theory of Program Size Formally Identical to Information Theory," *Journal of the ACM* 22(3), 1975. doi:10.1145/321892.321894

[44] J. Rissanen, "Modeling by shortest data description," *Automatica* 14(5), 1978. doi:10.1016/0005-1098(78)90005-5

[45] B. Ray, V. Hellendoorn, S. Godhane, Z. Tu, A. Bacchelli and P. Devanbu, "On the 'naturalness' of buggy code," ICSE 2016. doi:10.1145/2884781.2884848

[46] Z. Tu, Z. Su and P. Devanbu, "On the localness of software," FSE 2014. doi:10.1145/2635868.2635875

[47] M. Allamanis, E. T. Barr, P. Devanbu and C. Sutton, "A Survey of Machine Learning for Big Code and Naturalness," *ACM Computing Surveys* 51(4), 2018. doi:10.1145/3212695

[48] 陈浙哲, 刘忠鑫, 鄢萌, 徐洲, 夏鑫, 雷晏 (Z. Chen, Z. Liu, M. Yan, Z. Xu, X. Xia and Y. Lei), "代码自然性及其应用研究进展" (Research progress of code naturalness and its application), *软件学报 (Journal of Software)* 33(8), 3015 to 3034, 2022. doi:10.13328/j.cnki.jos.006355

[49] G. Sridhara, V. S. Sinha and S. Mani, "Naturalness of Natural Language Artifacts in Software," ISEC 2015 (India Software Engineering Conference). doi:10.1145/2723742.2723758

[50] P. Devanbu, "On the naturalness of software," keynote, ISEC 2013 (India Software Engineering Conference). doi:10.1145/2442754.2442763

[51] A. Z. H. Yang, S. Kolak, V. J. Hellendoorn, R. Martins et al., "Revisiting Unnaturalness for Automated Program Repair in the Era of Large Language Models," ICSE 2025. doi:10.1109/ICSE55347.2025.00089

[52] E. W. Dijkstra, "Guarded commands, nondeterminacy and formal derivation of programs," *Communications of the ACM* 18(8), 1975. doi:10.1145/360933.360975

[53] N. Wirth, "Program development by stepwise refinement," *Communications of the ACM* 14(4), 1971. doi:10.1145/362575.362577

[54] C. A. R. Hoare, "An axiomatic basis for computer programming," *Communications of the ACM* 12(10), 1969. doi:10.1145/363235.363259

[55] J.-R. Abrial, *The B-Book: Assigning Programs to Meanings*, Cambridge University Press, 1996. doi:10.1017/CBO9780511624162

[56] J.-R. Abrial, *Modeling in Event-B: System and Software Engineering*, Cambridge University Press, 2010. doi:10.1017/CBO9781139195881

[57] R.-J. Back and J. von Wright, *Refinement Calculus: A Systematic Introduction*, Springer, 1998. doi:10.1007/978-1-4612-1674-2

[58] F. L. Bauer and H. Wössner, *Algorithmic Language and Program Development*, Springer, 1982. doi:10.1007/978-3-642-61807-9

[59] S. Gulwani, "Automating string processing in spreadsheets using input-output examples," POPL 2011. doi:10.1145/1926385.1926423

[60] S. Gulwani, O. Polozov and R. Singh, "Program Synthesis," *Foundations and Trends in Programming Languages* 4(1-2), 2017. doi:10.1561/2500000010

[61] F. P. Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering," *Computer* 20(4), 1987. doi:10.1109/MC.1987.1663532

[62] P. Naur, "Programming as theory building," *Microprocessing and Microprogramming* 15(5), 1985. doi:10.1016/0165-6074(85)90032-8

[63] M. M. Lehman, "Programs, life cycles, and laws of software evolution," *Proceedings of the IEEE* 68(9), 1980. doi:10.1109/PROC.1980.11805

[64] P. Zave and M. Jackson, "Four dark corners of requirements engineering," *ACM Transactions on Software Engineering and Methodology* 6(1), 1997. doi:10.1145/237432.237434

[65] R. Landauer, "Irreversibility and Heat Generation in the Computing Process," *IBM Journal of Research and Development* 5(3), 1961. doi:10.1147/rd.53.0183

[66] C. H. Bennett, "Logical Reversibility of Computation," *IBM Journal of Research and Development* 17(6), 1973. doi:10.1147/rd.176.0525

[67] M. Franz and T. Kistler, "Slim binaries," *Communications of the ACM* 40(12), 1997. doi:10.1145/265563.265576

[68] C. W. Fraser, "Automatic inference of models for statistical code compression," PLDI 1999. doi:10.1145/301618.301672

[69] P. Cousot and R. Cousot, "Abstract interpretation: a unified lattice model for static analysis of programs by construction or approximation of fixpoints," POPL 1977. doi:10.1145/512950.512973

[70] Y. Futamura, "Partial evaluation of computation process: an approach to a compiler-compiler," *Systems, Computers, Controls* 2(5), 1971; reprinted in *Higher-Order and Symbolic Computation* 12(4), 1999. doi:10.1023/A:1010095604496

[71] A. P. Ershov, "Mixed computation: potential applications and problems for study," *Theoretical Computer Science* 18(1), 1982. doi:10.1016/0304-3975(82)90111-6

[72] W. A. Howard, "The formulae-as-types notion of construction," in J. P. Seldin and J. R. Hindley (eds.), *To H. B. Curry: Essays on Combinatory Logic, Lambda Calculus and Formalism*, Academic Press, 1980.

[73] 土居真之, 肥後芳樹, 有馬諒, 下仲健斗, 楠本真二 (M. Doi, Y. Higo, R. Arima, K. Shimonaka and S. Kusumoto), "ソースコードの「自然さ」を利用した自動生成ファイルの特定" (Identifying auto-generated files using the naturalness of source code), 電子情報通信学会技術研究報告 (IEICE Technical Report) 117(380), 19 to 24, January 2018. https://sdl.ist.osaka-u.ac.jp/pman/pman3.cgi?D=517

[74] M. Doi, Y. Higo, R. Arima, K. Shimonaka and S. Kusumoto, "On the naturalness of auto-generated code: can we identify auto-generated code automatically?" ICPC 2018. doi:10.1145/3196321.3196356

[75] F. V. Arrebola, "Modelo de sugestão de código-fonte baseado em modelos de linguagem organizados em um contexto hierárquico" (A source code suggestion model based on language models organized in a hierarchical context), doctoral thesis in electrical engineering, Fundação Educacional Inaciana Padre Sabóia de Medeiros (FEI), Brazil, 2018. Advisor R. A. C. Bianchi.

[76] G. Febres, K. Jaffé and C. Gershenson, "Complexity measurement of natural and artificial languages," *Complexity* 20(6), 2015. doi:10.1002/cplx.21529

[77] M. Rahman, D. Palani and P. C. Rigby, "Natural Software Revisited," ICSE 2019. doi:10.1109/ICSE.2019.00022

[78] A. Torres, S. Baltes, C. Treude and M. Wagner, "Applying Information Theory to Software Evolution," NLBSE 2023. doi:10.1109/NLBSE59153.2023.00017

[79] A. Blass, N. Dershowitz and Y. Gurevich, "When are two algorithms the same?," *Bulletin of Symbolic Logic* 15(2), 2009. arXiv:0811.0811. https://arxiv.org/abs/0811.0811

[80] Y. N. Moschovakis, "What is an algorithm?," in *Mathematics Unlimited: 2001 and Beyond*, Springer, 2001. https://www.math.ucla.edu/~ynm/papers/eng.pdf

[81] M. Y. Vardi, "What is an algorithm?," *Communications of the ACM* 55(3), 2012. doi:10.1145/2093548.2093549

[82] S. Laddad, A. Cheung, J. M. Hellerstein and M. Milano, "Flo: a Semantic Foundation for Progressive Stream Processing," POPL 2025. arXiv:2411.08274. https://arxiv.org/abs/2411.08274

[83] The Elm Architecture, Elm guide. https://guide.elm-lang.org/architecture/

[84] Temporal, "Workflows" (event history), documentation. https://docs.temporal.io/workflows

[85] A. Pnueli, M. Siegel and E. Singerman, "Translation validation," TACAS 1998. doi:10.1007/BFb0054170

[86] X. Yang, Y. Chen, E. Eide and J. Regehr, "Finding and understanding bugs in C compilers," PLDI 2011. doi:10.1145/1993498.1993532

[87] C. Nandi, M. Willsey, A. Zhu et al., "Rewrite Rule Inference Using Equality Saturation," OOPSLA 2021. arXiv:2108.10436. https://arxiv.org/abs/2108.10436

[88] C. Le Goues, T. Nguyen, S. Forrest and W. Weimer, "GenProg: A Generic Method for Automatic Software Repair," *IEEE TSE* 38(1), 2012. doi:10.1109/TSE.2011.104

[89] F. Long and M. Rinard, "Automatic patch generation by learning correct code," POPL 2016. doi:10.1145/2837614.2837617

[90] J. Bader, A. Scott, M. Pradel and S. Chandra, "Getafix: Learning to Fix Bugs Automatically," OOPSLA 2019. arXiv:1902.06111. https://arxiv.org/abs/1902.06111

[91] K. Etemadi, N. Harrand, S. Larsen et al., "Sorald: Automatic Patch Suggestions for SonarQube Static Analysis Violations," *IEEE TDSC*, 2022. arXiv:2103.12033. https://arxiv.org/abs/2103.12033

[92] Z. Qi, F. Long, S. Achour and M. Rinard, "An analysis of patch plausibility and correctness for generate-and-validate patch generation systems," ISSTA 2015. doi:10.1145/2771783.2771791

[93] E. K. Smith, E. T. Barr, C. Le Goues and Y. Brun, "Is the cure worse than the disease? Overfitting in automated program repair," ESEC/FSE 2015. doi:10.1145/2786805.2786825

[94] X.-B. D. Le, F. Thung, D. Lo and C. Le Goues, "Overfitting in semantics-based automated program repair," *Empirical Software Engineering* 23, 2018. doi:10.1007/s10664-017-9577-2

[95] Y. Xiong, X. Liu, M. Zeng, L. Zhang and G. Huang, "Identifying patch correctness in test-based program repair," ICSE 2018. doi:10.1145/3180155.3180182

[96] T. Durieux, F. Madeiral, M. Martinez and R. Abreu, "Empirical Review of Java Program Repair Tools: A Large-Scale Experiment on 2,141 Bugs and 23,551 Repair Attempts," ESEC/FSE 2019. arXiv:1905.11973. https://arxiv.org/abs/1905.11973

[97] K. Liu, A. Koyuncu, T. F. Bissyandé et al., "You Cannot Fix What You Cannot Find! An Investigation of Fault Localization Bias in Benchmarking Automated Program Repair Systems," ICST 2019. arXiv:1812.07283. https://arxiv.org/abs/1812.07283

[98] M. Monperrus, "Automatic Software Repair: A Bibliography," *ACM Computing Surveys* 51(1), 2018. doi:10.1145/3105906

[99] C. S. Xia, Y. Deng, S. Dunn and L. Zhang, "Agentless: Demystifying LLM-based Software Engineering Agents," 2024. arXiv:2407.01489. https://arxiv.org/abs/2407.01489

[100] S. Kapoor, B. Stroebl, Z. S. Siegel, N. Nadgir and A. Narayanan, "AI Agents That Matter," 2024. arXiv:2407.01502. https://arxiv.org/abs/2407.01502

[101] M. H. Erol, B. El, M. Suzgun, M. Yuksekgonul and J. Zou, "Cost-of-Pass: An Economic Framework for Evaluating Language Models," 2025. arXiv:2504.13359. https://arxiv.org/abs/2504.13359

[102] D. Zan, Z. Huang, W. Liu et al., "Multi-SWE-bench: A Multilingual Benchmark for Issue Resolving," 2025. arXiv:2504.02605. https://arxiv.org/abs/2504.02605

[103] R. Widyasari, S. Q. Sim, C. Lok et al., "BugsInPy: a database of existing bugs in Python programs to enable controlled testing and debugging studies," ESEC/FSE 2020. doi:10.1145/3368089.3417943

[104] M. Allamanis, "The Adverse Effects of Code Duplication in Machine Learning Models of Code," Onward! 2019. arXiv:1812.06469. https://arxiv.org/abs/1812.06469

[105] K. N. Khan, M. Hirki, T. Niemi, J. K. Nurminen and Z. Ou, "RAPL in Action: Experiences in Using RAPL for Power Measurements," *ACM TOMPECS* 3(2), 2018. doi:10.1145/3177754

[106] The Rust project, rustfix and `cargo fix`. https://github.com/rust-lang/rustfix

[107] R.-M. Karampatsis and C. Sutton, "How Often Do Single-Statement Bugs Occur? The ManySStuBs4J Dataset," MSR 2020. doi:10.1145/3379597.3387491

[108] C. Richter and H. Wehrheim, "TSSB-3M: Mining single statement bugs at massive scale," MSR 2022. doi:10.1145/3524842.3528505

[109] H. Coles, T. Laurent, C. Henard, M. Papadakis and A. Ventresque, "PIT: a practical mutation testing tool for Java," ISSTA 2016. doi:10.1145/2931037.2948707

[110] R. Just, D. Jalali, L. Inozemtseva, M. D. Ernst, R. Holmes and G. Fraser, "Are mutants a valid substitute for real faults in software testing?" FSE 2014. doi:10.1145/2635868.2635929

[111] I. J. Good, "Speculations Concerning the First Ultraintelligent Machine," *Advances in Computers* 6, 1965. doi:10.1016/S0065-2458(08)60418-0

[112] J. Schmidhuber, "Gödel Machines: Fully Self-referential Optimal Universal Self-improvers," in *Artificial General Intelligence*, Springer, 2007. doi:10.1007/978-3-540-68677-4_7

[113] E. Yudkowsky, "Intelligence Explosion Microeconomics," Technical report 2013-1, Machine Intelligence Research Institute, 2013. https://intelligence.org/files/IEM.pdf

[114] M. H. Löb, "Solution of a Problem of Leon Henkin," *Journal of Symbolic Logic* 20(2), 1955. doi:10.2307/2266895

[115] E. Yudkowsky and M. Herreshoff, "Tiling Agents for Self-Modifying AI, and the Löbian Obstacle," Machine Intelligence Research Institute, 2013. https://intelligence.org/files/TilingAgentsDraft.pdf

[116] E. Zelikman, E. Lorch, L. Mackey and A. T. Kalai, "Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation," 2023. doi:10.48550/arXiv.2310.02304

[117] J. Zhang, S. Hu, C. Lu, R. Lange and J. Clune, "Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents," 2025. doi:10.48550/arXiv.2505.22954

[118] A. Novikov et al., "AlphaEvolve: A coding agent for scientific and algorithmic discovery," 2025. doi:10.48550/arXiv.2506.13131

[119] G. Wang, Y. Xie, Y. Jiang, A. Mandlekar, C. Xiao, Y. Zhu, L. Fan and A. Anandkumar, "Voyager: An Open-Ended Embodied Agent with Large Language Models," 2023. doi:10.48550/arXiv.2305.16291

[120] Y. Futamura, "Partial Evaluation of Computation Process: An Approach to a Compiler-Compiler," *Higher-Order and Symbolic Computation* 12(4), 1999 (first published 1971). doi:10.1023/A:1010095604496

[121] V. F. Turchin, "The Concept of a Supercompiler," *ACM Transactions on Programming Languages and Systems* 8(3), 1986. doi:10.1145/5956.5957

[122] J. N. Foster, M. B. Greenwald, J. T. Moore, B. C. Pierce and A. Schmitt, "Combinators for Bidirectional Tree Transformations: A Linguistic Approach to the View-Update Problem," *ACM Transactions on Programming Languages and Systems* 29(3), 2007. doi:10.1145/1232420.1232424

[123] M. Hofmann, B. Pierce and D. Wagner, "Symmetric Lenses," *POPL*, 2011. doi:10.1145/1926385.1926428

[124] K. Czarnecki, J. N. Foster, Z. Hu, R. Lämmel, A. Schürr and J. F. Terwilliger, "Bidirectional Transformations: A Cross-Discipline Perspective," *ICMT*, LNCS 5563, 2009. doi:10.1007/978-3-642-02408-5_19

[125] E. W. Dijkstra, "A Constructive Approach to the Problem of Program Correctness," *BIT* 8(3), 1968. doi:10.1007/BF01933419

[126] A. Hall and R. Chapman, "Correctness by Construction: Developing a Commercial Secure System," *IEEE Software* 19(1), 2002. doi:10.1109/52.976937

[127] Y. Minsky, "OCaml for the Masses," *Communications of the ACM* 54(11), 2011. doi:10.1145/2018396.2018413

[128] D. A. Turner, "Total Functional Programming," *Journal of Universal Computer Science* 10(7), 2004. doi:10.3217/jucs-010-07-0751

[129] R. Di Cosmo and S. Zacchiroli, "Software Heritage: Why and How to Preserve Software Source Code," iPRES 2017, Kyoto. https://hal.science/hal-01590958

[130] Software Heritage, archive counters, read 13 October 2026: 30,253,266,524 file contents and 448,311,919 origins. https://archive.softwareheritage.org/api/1/stat/counters/

[131] Rosetta Code, main page, read 13 October 2026: 1,360 tasks, 421 draft tasks, 1,009 known languages. https://rosettacode.org/wiki/Rosetta_Code

[132] C. Casalnuovo, K. Lee, H. Wang, P. Devanbu and E. Morgan, "Do Programmers Prefer Predictable Expressions in Code?" *Cognitive Science* 44(12), 2020; preprint arXiv:1910.03704. https://arxiv.org/abs/1910.03704

[133] N. Peitek, S. Apel, C. Parnin, A. Brechmann and J. Siegmund, "Program Comprehension and Code Complexity Metrics: An fMRI Study," ICSE 2021. https://www.se.cs.uni-saarland.de/publications/docs/PAP+21.pdf

[134] S. Scalabrino, G. Bavota, C. Vendome, M. Linares-Vásquez, D. Poshyvanyk and R. Oliveto, "Automatically Assessing Code Understandability," *IEEE Transactions on Software Engineering* 47(3), 2021. https://www.cs.wm.edu/~denys/pubs/TSE'19-Understandability.pdf

[135] N. Peitek, J. Siegmund, C. Parnin, S. Apel and A. Brechmann, "Beyond Gaze: Preliminary Analysis of Pupil Dilation and Blink Rates in an fMRI Study of Program Comprehension," and the companion layout study, 2017. https://www.se.cs.uni-saarland.de/publications/docs/SPP+17.pdf

[136] "The Hidden Cost of Readability: How Code Formatting Silently Consumes Your LLM Budget," arXiv:2508.13666, August 2025; ICSE 2026. https://arxiv.org/abs/2508.13666

[137] D. G. Feitelson, A. Mizrahi, N. Noy, A. Ben Shabat, O. Eliyahu and R. Sheffer, "How Developers Choose Names," *IEEE Transactions on Software Engineering* 48(1), 2022; preprint arXiv:2103.07487. https://arxiv.org/abs/2103.07487

[138] F. Wen, C. Nagy, G. Bavota and M. Lanza, "A Large-Scale Empirical Study on Code-Comment Inconsistencies," ICPC 2019. https://www.inf.usi.ch/faculty/lanza/PUBS/P/Wen2019a.pdf

[139] "When Names Disappear: Revealing What LLMs Actually Understand About Code," arXiv:2510.03178, October 2025. https://arxiv.org/abs/2510.03178

[140] A. A. Ivanova, S. Srikant, Y. Sueoka, H. H. Kean, R. Dhamala, U.-M. O'Reilly, M. U. Bers and E. Fedorenko, "Comprehension of Computer Code Relies Primarily on Domain-General Executive Brain Regions," *eLife* 9, 2020. doi:10.7554/eLife.58906

[141] H. G. Rice, "Classes of Recursively Enumerable Sets and Their Decision Problems," *Transactions of the American Mathematical Society* 74, 1953. doi:10.1090/S0002-9947-1953-0053041-6

[142] O. Danvy and K. Millikin, "Refunctionalization at Work," BRICS RS-08-4, 2008; *Science of Computer Programming* 74(8), 2009. https://www.brics.dk/RS/08/4/

[143] M. S. Ager, D. Biernacki, O. Danvy and J. Midtgaard, "A Functional Correspondence between Evaluators and Abstract Machines," PPDP 2003. doi:10.1145/888251.888254

[144] J. J. M. M. Rutten, "Universal Coalgebra: A Theory of Systems," *Theoretical Computer Science* 249(1), 2000. doi:10.1016/S0304-3975(00)00056-6

[145] J. W. de Bakker and J. I. Zucker, "Processes and the Denotational Semantics of Concurrency," *Information and Control* 54(1-2), 1982. doi:10.1016/S0019-9958(82)91013-8

[146] C. P. Pfleeger, "State Reduction in Incompletely Specified Finite-State Machines," *IEEE Transactions on Computers* C-22(12), 1973. doi:10.1109/T-C.1973.223591

[147] A. Nerode, "Linear Automaton Transformations," *Proceedings of the American Mathematical Society* 9(4), 1958. doi:10.2307/2033204

[148] J. Hopcroft, "An n log n Algorithm for Minimizing States in a Finite Automaton," in *Theory of Machines and Computations*, Academic Press, 1971. doi:10.1016/B978-0-12-417750-5.50022-1

[149] L. D'Antoni and M. Veanes, "Minimization of Symbolic Automata," POPL 2014. doi:10.1145/2535838.2535849

[150] R. Reis, N. Moreira and M. Almeida, "On the Representation of Finite Automata," DCFS 2005. https://www.dcc.fc.up.pt/~nam/resources/publica/dcfsrma05.pdf

[151] M. Bojańczyk, B. Klin and S. Lasota, "Automata with Group Actions," LICS 2011. doi:10.1109/LICS.2011.48

[152] J. Lee et al., "A Linear Energy Model for Cortex-M0 Class Cores from Six Hardware Counters," arXiv:2104.01055, 2021. https://arxiv.org/abs/2104.01055

[153] N. van Kempen, H. Kwon, D. T. Nguyen and E. D. Berger, "It's Not Easy Being Green: On the Energy Efficiency of Programming Languages," arXiv:2410.05460v4, 2025. https://arxiv.org/abs/2410.05460


[154] Dauner et al., "Stale Reads: Sampling Hazards of On-Chip Energy Counters," HotCarbon 2026. https://hotcarbon.org/assets/2026/paper-46.pdf

[155] Z. Yang et al., "Part-Time Power Measurements: nvidia-smi's Lack of Attention," arXiv:2312.02741v3, 2024. https://arxiv.org/abs/2312.02741

[156] D. Perez and B. Livshits, "Broken Metre: Attacking Resource Metering in EVM," NDSS 2020; arXiv:1909.07220. https://arxiv.org/abs/1909.07220

[157] S. Smolka, N. Foster, J. Hsu, T. Kappé, D. Kozen and A. Silva, "Guarded Kleene Algebra with Tests: Verification of Uninterpreted Programs in Nearly Linear Time," POPL 2020. doi:10.1145/3371129

[158] Y. Sun, Y. Zhang and Z. Ni, "E-Graph Extraction with DAG Cost Is NP-Hard and Inapproximable," arXiv:2408.17042, 2024. https://arxiv.org/abs/2408.17042

[159] Unison Computing, "The Big Idea," Unison language documentation; and "A New Update Process," 20 October 2023. https://www.unison-lang.org/docs/the-big-idea/

[160] Dhall language standard, "Binary Semantics and Semantic Integrity Checks," `binary.md`. https://github.com/dhall-lang/dhall-lang/blob/master/standard/binary.md

[161] Tweag, "Towards a Content-Addressed Model for Nix," 10 September 2020, and "Self-References in a Content-Addressed Nix," 18 November 2020. https://www.tweag.io/blog/2020-09-10-nix-cas/


[162] "SpecRL: Measuring Specification Completeness for Verified Program Synthesis," arXiv:2604.05820, 2026. https://arxiv.org/abs/2604.05820

[163] J. Koppel, Z. Guo, E. de Vries and A. Solar-Lezama, "Searching Entangled Program Spaces," ICFP 2022. doi:10.1145/3547622

[164] M. Erol et al., "Cost-of-Pass: An Economic Framework for Evaluating Language Models," arXiv:2504.13359, 2025. https://arxiv.org/abs/2504.13359

[165] F. Cassano, J. Gouwar, F. Lucchetti, C. Schlesinger, A. Freeman, C. J. Anderson, M. Q. Feldman, M. Greenberg, A. Jangda and A. Guha, "Knowledge Transfer from High-Resource to Low-Resource Programming Languages for Code LLMs," OOPSLA 2024. doi:10.1145/3689735

[166] agentlanguages.dev, catalogue of agent-oriented programming languages, read 19 October 2026 (42 entries). https://agentlanguages.dev

[167] WebAssembly Community Group, "SpecTec Has Been Adopted," 27 March 2025; D. Youn et al., "Bringing the WebAssembly Standard up to Speed with SpecTec," PLDI 2024. https://webassembly.org/news/2025-03-27-spectec/

[168] D. Monniaux and S. Boulmé, "The Trusted Computing Base of the CompCert Verified Compiler," ESOP 2022. https://arxiv.org/abs/2201.10280

[169] G. Klein, J. Andronick, K. Elphinstone, T. Murray, T. Sewell, R. Kolanski and G. Heiser, "Comprehensive Formal Verification of an OS Microkernel," *ACM Transactions on Computer Systems* 32(1), 2014; cost figures from NICTA technical report 4180. https://www.trustworthy.systems/publications/nicta_full_text/4180.pdf

[170] S. Lu, S. Park, E. Seo and Y. Zhou, "Learning from Mistakes: A Comprehensive Study on Real World Concurrency Bug Characteristics," ASPLOS 2008. doi:10.1145/1346281.1346323

[171] R. Haas, R. Niedermayr, T. Röhm and S. Apel, "Is Static Analysis Able to Identify Unnecessary Source Code?" *ACM Transactions on Software Engineering and Methodology* 29(1), 2020. doi:10.1145/3368267

[172] N. Nagappan, B. Murphy and V. Basili, "The Influence of Organizational Structure on Software Quality: An Empirical Case Study," ICSE 2008. doi:10.1145/1368088.1368160

[173] "An Empirical Study of Go's Language Proposal Process," arXiv:2510.06984, October 2025 (1,095 proposals; 448 declined, 337 accepted). https://arxiv.org/abs/2510.06984

[174] Z. R. Tam, C.-K. Wu, Y.-L. Tsai, C.-Y. Lin, H. Lee and Y.-N. Chen, "Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models," EMNLP Industry 2024; arXiv:2408.02442. https://arxiv.org/abs/2408.02442

[175] B. Stroustrup, "Thriving in a Crowded and Changing World: C++ 2006-2020," HOPL IV, *Proceedings of the ACM on Programming Languages* 4(HOPL), 2020. doi:10.1145/3386320

[176] F. Mancinelli, J. Boender, R. Di Cosmo, J. Vouillon, B. Durak, X. Leroy and R. Treinen, "Managing the Complexity of Large Free and Open Source Package-Based Software Distributions," ASE 2006, pp. 199-208. doi:10.1109/ASE.2006.49

[177] P. Abate, R. Di Cosmo, G. Gousios and S. Zacchiroli, "Dependency Solving Is Still Hard, but We Are Getting Better at It," SANER 2020, pp. 547-551. doi:10.1109/SANER48275.2020.9054837

[178] R. Cox, "Version SAT," research!rsc, 13 December 2016. https://research.swtch.com/version-sat

[179] S. Raemaekers, A. van Deursen and J. Visser, "Semantic versioning and impact of breaking changes in the Maven repository," *Journal of Systems and Software* 129:140-158, 2017. doi:10.1016/j.jss.2016.04.008

[180] L. Ochoa, T. Degueule, J.-R. Falleri and J. Vinju, "Breaking bad? Semantic versioning and impact of breaking changes in Maven Central," *Empirical Software Engineering* 27:61, 2022. doi:10.1007/s10664-021-10052-y

[181] T. Winters, T. Manshreck and H. Wright (eds.), *Software Engineering at Google*, chapter 21, O'Reilly, 2020. https://abseil.io/resources/swe-book/html/ch21.html

[182] J. Wetter and N. Ringland, "Understanding the Impact of Apache Log4j Vulnerability," Google Open Source Insights, 17 December 2021. https://blog.deps.dev/log4j/

[183] E. Dolstra, *The Purely Functional Software Deployment Model*, PhD thesis, Utrecht University, 2006. https://edolstra.github.io/pubs/phd-thesis.pdf

[184] R. Di Cosmo, M. Gruenpeter and S. Zacchiroli, "Referencing Source Code Artifacts: a Separate Concern in Software Citation," *Computing in Science & Engineering* 22(2):33-43, 2020. doi:10.1109/MCSE.2019.2963148

[185] R. Hickey, "Spec-ulation," keynote, Clojure/conj, December 2016. Transcript: https://github.com/matthiasn/talk-transcripts/blob/master/Hickey_Rich/Spec_ulation.md

[186] B. Godlin and O. Strichman, "Regression verification," DAC 2009, pp. 466-471. doi:10.1145/1629911.1630034

[187] J. Baumgartner, H. Mony, V. Paruthi, R. Kanzelman and G. Janssen, "Scalable Sequential Equivalence Checking across Arbitrary Design Transformations," ICCD 2006. https://research.ibm.com/publications/scalable-sequential-equivalence-checking-across-arbitrary-design-transformations

[188] C. Lamb and S. Zacchiroli, "Reproducible Builds: Increasing the Integrity of Software Supply Chains," *IEEE Software* 39(2):62-70, 2022. doi:10.1109/MS.2021.3073045

[189] Open Interface Engineering, "Languages for or by machine authors, January 2024 to October 2026," working note 5 of the survey of 24 October 2026, `rce/surveys/2026-10-24/notes/languages_for_machine_authors.md`, openIE-dev/openie-research-experiments. https://github.com/openIE-dev/openie-research-experiments

[190] Open Interface Engineering, "New general-purpose and systems languages, January 2024 to October 2026," working note 6 of the survey of 24 October 2026, `rce/surveys/2026-10-24/notes/new_general_purpose_languages.md`, openIE-dev/openie-research-experiments. https://github.com/openIE-dev/openie-research-experiments

[191] W. van Oortmerssen, Goose: a memory-safe systems language with no heap allocator, garbage collector, or lifetime annotations, repository, 2026. https://github.com/aardappel/goose

[192] dawnop, Dawn: a small functional language with effects in the type signature and content-addressed packages, repository, 2026. https://github.com/dawnop/dawn-lang

[193] Open Interface Engineering, "Batteries included or specification and free: what the record says, and one Form on every compute fabric," synthesis of the survey of 24 October 2026, with working notes 7 to 18 and the proposal `spec/proposals/one-library-every-fabric.md` of openIE-dev/rce. https://github.com/openIE-dev/openie-research-experiments/blob/main/rce/surveys/2026-10-24/batteries-specification-and-fabrics.md

[194] C. Heimes and B. Cannon, "PEP 594: Removing dead batteries from the standard library," Python Enhancement Proposals, 2019. https://peps.python.org/pep-0594/

[195] Rust project, "RFC 1242: Policy for rust-lang crates," 2015. https://rust-lang.github.io/rfcs/1242-rust-lang-crates.html

[196] A. Decan, T. Mens and P. Grosjean, "An empirical comparison of dependency network evolution in seven software packaging ecosystems," Empirical Software Engineering 24, 2019. https://doi.org/10.1007/s10664-017-9589-y

[197] N. Seriot, "Parsing JSON is a Minefield," 2016. https://seriot.ch/projects/parsing_json.html

[198] J. H. Davis, P. Sivaraman, J. Kitson, K. Parasyris, H. Menon, I. Minn, G. Georgakoudis and A. Bhatele, "Taking GPU Programming Models to Task for Performance Portability," Proc. ICS 2025. https://doi.org/10.1145/3721145.3730423

[199] C. Weckert, L. Solis-Vasquez, J. Oppermann, A. Koch and O. Sinnen, "Altis-SYCL: Migrating Altis Benchmarking Suite from CUDA to SYCL for GPUs and FPGAs," SC '23 Workshops, 2023. https://doi.org/10.1145/3624062.3624542

[200] T. Bourgeat, C. Pit-Claudel, A. Chlipala and Arvind, "The essence of Bluespec: a core language for rule-based hardware design," Proc. PLDI 2020. https://doi.org/10.1145/3385412.3385965

[201] A. Haas, A. Rossberg, D. L. Schuff, B. L. Titzer, M. Holman, D. Gohman, L. Wagner, A. Zakai and J. F. Bastien, "Bringing the Web up to Speed with WebAssembly," Proc. PLDI 2017. https://doi.org/10.1145/3062341.3062363

[202] A. Arteaga, O. Fuhrer and T. Hoefler, "Designing Bit-Reproducible Portable High-Performance Applications," Proc. IPDPS 2014. https://doi.org/10.1109/IPDPS.2014.127

[203] D. Lustig, S. Sahasrabuddhe and O. Giroux, "A Formal Analysis of the NVIDIA PTX Memory Consistency Model," Proc. ASPLOS 2019. https://doi.org/10.1145/3297858.3304043

[204] StarPU project, StarPU Handbook: performance models and simulation with SimGrid, Inria. https://files.inria.fr/starpu/doc/html/

[205] J. Spracklen, R. Wijewickrama, A. H. M. N. Sakib, A. Maiti, B. Viswanath and M. Jadliwala, "We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs," Proc. USENIX Security 2025.
