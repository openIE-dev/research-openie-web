---
title: "Die Reality Code Engine: eine verlustfreie Form für natives, verifiziertes und energiesparendes Programmieren"
deck: "Ein Programmiersystem, in dem ein Programm einmal als Zustandsautomat geschrieben und Code in anderen Sprachen daraus erzeugt wird: seine Spezifikation, der Referenzprüfer und seine Emitter, die Lean-Beweise und registrierte Messungen der Dimension von Programmen, mit vorab festgelegten Protokollen und Falsifikatoren."
lang: "de"
source: "rce"
complete: true
---

<div id="the-reality-code-engine-one-lossless-form-for-native-verified-low-energy-programming" class="anchor-alias" aria-hidden="true"></div>

*Revision `df38742`, 6. November 2026. Spezifikation: [aktueller Entwurf (Entwurf 0.9)](/rce/spec/), aus [openIE-dev/rce](https://github.com/openIE-dev/rce); die Anzahlen der in [§3.7](#37-the-language-one-text-costs-and-theorem-status) ausgeführten Prüfungen gelten für die dort genannten öffentlichen Commits, und diejenigen bei `0c015c43` sind in [`src/data/rce-facts.json`](https://github.com/openIE-dev/research-openie-web/blob/main/src/data/rce-facts.json) aufgezeichnet. Daten und Code: [research.openie.dev/data/](/data/#rce). Spielplatz (Referenzprüfer): [openie-dev.github.io/rce](https://openie-dev.github.io/rce/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Kurzfassung

Dieser Artikel beschreibt die Reality Code Engine (RCE), ein System, in dem ein Programm einmal als Zustandsautomat, genannt eine Form, geschrieben und Code in anderen Sprachen daraus erzeugt wird. Er stellt die schriftliche Spezifikation der Sprache vor, den Referenzprüfer, der sie implementiert und Rust, Python, JavaScript und Scala ausgibt, die Lean-Beweise ihrer Sätze, registrierte Messungen der Dimension ihrer Programme sowie das Design der Engine, die Lösungen findet, prüft und wiederverwendet. Er legt dar, wie die Behauptungen widerlegt werden könnten, sowie die Protokolle der noch durchzuführenden Messungen.

**In einfachen Worten**

1. Ein Programm wird einmal in einer präzisen Form geschrieben, und der Computer erzeugt daraus dasselbe Programm in vielen Sprachen.
2. Alles, was ein Programm tun kann, wird in seiner Form deklariert, und die Sprache verlangt für jede Eingabe ein deklariertes Ergebnis: einen Schritt oder einen aufgezeichneten beibehaltenen Schritt, der den Zustand so belässt, wie er war, anstelle eines undefinierten Verhaltens, das erst später gefunden und behoben wird.
3. Im Design der Engine wird eine Korrektur, die die Prüfungen besteht, gespeichert und wiederverwendet, sodass dasselbe Problem nicht zweimal Zeit oder Energie kostet.
<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. These

Autonomes Computer-Automatisierung ist ein Entwurfsraum mit vielen Punkten darin. Jeder Ansatz befindet sich irgendwo entlang fünf kontinuierlicher Achsen: die Energie, die pro korrektem Ergebnis verbraucht wird; die Entropie, die das System zur Laufzeit lösen muss, und damit, wie deterministisch seine Ausgabe ist; die Stärke der Verifikation, die ein Ergebnis akzeptiert; wie weit jedes akzeptierte Ergebnis wiederverwendet und sich verbindet; und wie sehr der Ansatz auf ein Modell zurückgreift. Ein großes Sprachmodell (LLM), ein statistisches Textmodell, das jede Änderung vom Prompt schreibt, befindet sich nahe an einer Ecke dieses Raums: Es verlässt sich auf das Modell für jede Aufgabe, zieht bei jedem Mal eine frische Stichprobe aus einer hochentropischen Verteilung und zahlt für die Generierung erneut bei jeder Aufgabe. Retrieval, Regeln, Synthese, Verifikation und Caching belegen viele andere Punkte, und reale Systeme kombinieren sie.

Die Reality Code Engine (RCE) ist ein Punkt in diesem Raum. Dieser Artikel beschreibt sie, und die Messungen, über die er berichtet, betreffen ihre Sprache und deren Werkzeuge. RCE modelliert ein Programm als datenbank-funktionalen Zustandsautomaten. Lopes und Kollegen haben gemessen, dass etwa 70 % des Codes auf GitHub aus Klonen früherer Dateien bestehen [33]; daher versucht RCE zunächst, eine bestehende Passung abzurufen, anzupassen und zu prüfen, und ruft ein Modell nur dann auf, wenn nichts Günstigeres die Aufgabe abschließt.

**Die zentrale Aussage.** RCE ist ein vollständiges Code-Ökosystem, in dem Programme nativ aus Absicht verfasst werden. Absicht wird einmal geschrieben, als Form: ein Zustand, eine Menge von Ereignissen und ein reiner, totaler Übergang. Die Form ist eine verlustfreie Kodierung dieser Absicht. Jede Zielsprache ist eine Projektion der Form, und jede Projektion muss die Spur der Form Byte für Byte wiedergeben; der Referenzprüfer gibt heute Rust, Python, JavaScript und Scala aus. Jeder Zustand, in dem sich ein Programm befinden kann, wird in seiner Form deklariert, und die Sprache verlangt für jede Eingabe ein deklariertes Ergebnis: einen Schritt, der sie ausführt, oder, wenn das Ereignis unter seinem Vertrag nicht greift, einen beibehaltenen Schritt: Der Zustand bleibt unverändert und der Schritt wird im Log aufgezeichnet (T8). Ein Programm, das diese Anforderungen erfüllt, kann nicht so von seiner Absicht abdriften, wie ein Programm in einer gängigen Sprache von seinen Kommentaren, seinen Tests oder seinen anderen Implementierungen abdriftet, und es benötigt kein nachträgliches Diffing oder Fehler-Tracking. Der Eingabevertrag, mit dem der Referenzprüfer die zweite Anforderung am Eingang erfüllt, ist in [§10](#10-work-to-finish) aufgeführt. Im Entwurf der Engine wird jede Passung, die das Tor passiert, gespeichert und wiederverwendet, sodass das Ökosystem mit seinem Wachstum verzinslich aufbaut ([§2.4](#24-gated-verified-recursive-self-improvement)). In anderen Sprachen geschriebener Code ist eine Tür hinein: Er tritt durch Hebung ein ([§6](#6-lift-entering-the-ecosystem-from-other-languages)).

Jeder Punkt im Raum steht vor demselben Tor. Das Tor ist Richtigkeit: das Vollständigkeitsprädikat $C(z)$ einer Aufgabe, hier die Tests der Aufgabe, ein Beweis oder eine Übereinstimmungsspur. Unter den Laufzeiten, die das Tor passieren, werden Systeme nach Joules bis zur Fertigstellung, $J^*$, bewertet. Richtigkeit ist eine Einschränkung, nicht ein Score.

Im Entwurf des Motors laufen RCEs Mechanismen, die als Gänge bezeichnet werden, in Reihenfolge des Kosten, und der erste Gang, dessen Kandidat das Tor passiert, schließt die Aufgabe.

Energieangaben sind nach Quelle gekennzeichnet. `est_j` ist eine analytische Schätzung. `reported_j` ist ein Betriebssystem- oder On-Chip-Zähler. `measured_j` ist für ein Wandmessgerät reserviert und in jedem Ergebnis hier leer. Was der öffentliche Code unter `openIE-dev/rce` `main` `09b2bdfb` ausliefert, ist enger gefasst. Der Prüfer zählt Arbeit in ganzzahligen Kosteneinheiten und Fuel pro Eingabe, wozu Spezifikation C.6 festhält, sie seien „keine Messung von Zeit oder Energie“. Die Joule-Angaben eines Belegs werden nur als `est` oder `unpriced` befüllt, und kein Beleg enthält einen Messwert. Der Log-Eintrag für einen Zählerstand, `host.Energy`, ist in der Spezifikation definiert, und kein Prüfercode schreibt ihn. `host.Calibrated` zeichnet den Overhead und Durchsatz eines Compute-Fabrics auf, nicht Joule. Eine Kalibrierung in Joule pro Einheit ist ein Vorschlag ([§6.3](#63-energy)).

<div id="2-two-paths-to-autonomy" class="anchor-alias" aria-hidden="true"></div>
<div id="2-the-design-space-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

## 2. Der Entwurfsspielraum autonomer Codierung

![Ein Satz hinein. Eine Etage heraus. Menschliche Absicht hat hohe Entropie; ein Trichter von Konvertierungen von Absicht zu Spezifikation zu 626 Oberflächensprachen zu einer Zwischenrepräsentation zu Maschinencode verliert Informationen an jeder Grenze; aller Code erreicht wenige Maschinenformen; RCE schreibt die Bedeutung einmal in einer kanonischen Form, behandelt jede Oberfläche als Projektion und lässt die günstigste korrekte Form gewinnen.](/figures/rce/intent-entropy.svg)

*Abbildung 1. Absichtsentropie und die Maschinenetage. Eine [PNG-Kopie](/figures/rce/intent-entropy.png) wird bereitgestellt. Quellen: Shannon (1951); Lopes et al. (2017); die 626-Sprachenzahl ist eine unveröffentlichte Umfrage der OpenIE-Autoren und unterstützt keine Aussage in diesem Artikel. Die Ergebnisse von Python und C sind Verhaltensweisen der Sprachspezifikation; vorzeichenbehafteter Überlauf in C ist undefiniertes Verhalten.*

**Die Absicht hat eine hohe Entropie.** „Machen Sie den Checkout schneller“ trägt viele Bedeutungen: kürzere Seitenladezeit, weniger Schritte, schnellerer Kartenfreigabe, ein zwischengespeicherter Warenkorb oder schneller auf einer Gerätekategorie. Der Kontext wird impliziert und nie geschrieben. Shannon hat das gedruckte Englisch bei etwa 0,6 bis 1,3 Bit pro Buchstaben gemessen [1]. Die Buchstaben sind vorhersagbar. Die Bedeutung ist es nicht.

**Jede Konvertierung verliert Informationen.** Die Absicht wird zu einer Spezifikation, und der Kontext geht verloren. Die Spezifikation wird zu einer der hunderten Oberflächensprachen, und Alternativen und Randfälle gehen verloren. Die Quelle wird zu einer Zwischenrepräsentation (IR), und Namen, Stil und die Gründe des Autors gehen verloren. Die IR wird zu Maschinencode, und Typen werden zu Größen und Schleifen werden zu Sprüngen.

**Die Etage hat eine geringe Entropie.** Jedes Programm endet als Ladevorgänge, Speicheroperationen, Arithmetik und Sprünge. Der Zielort hat Platz für nur wenige Formen, also biegt der Code in diese Richtung. Die Konvergenz ist durch Entwurf gegeben.

**Grenzen sind der Ort, an dem Bedeutung auseinandergeht.** Die gleiche Zeile gibt unterschiedliche Antworten an den Rändern. In Python ist `-3 % 2` 1 und `-7 / 2` -3,5. In C ist `-3 % 2` -1, `-7 / 2` -3, und das Vorzeichenüberlauf ist undefiniertes Verhalten. Ein System, das Code an jeder Grenze neu generiert, rät an jeder Grenze.

**Die Achsen, als Größen ausgedrückt.**

| Achse | Eine Seite | Andere Seite | Wo sich der Entwurf von RCE befindet |
|---|---|---|---|
| Energie pro korrektem Ergebnis | Wiederholt vollständig bezahlt bei jeder Aufgabe | Einmal pro neuem Fall bezahlt, dann die Handler-Untergrenze | Auf der Untergrenze bei abgedeckten Aufgaben |
| Zur Laufzeit aufgelöste Entropie und Determinismus | Die vollständige Verteilung des Prompts, jedes Mal eine frische Stichprobe | Nur das Residuum, das keine gespeicherte Passung abdeckt, eine deterministische Ausgabe | Nur das Residuum; jede Projektion deterministisch |
| Verifikationsstärke | Ausgabe nach Sichtprüfung akzeptiert | Tests, Abdeckung und ein Beweiszertifikat | Das vollständige Tor bei jedem Ergebnis |
| Wiederverwendung und Verzinsung | Jedes Ergebnis einmal verwendet | Jede akzeptierte Passung gespeichert und wiederverwendet | Jede Passung, die das Tor passiert, wird gespeichert |
| Modellabhängigkeit | Ein Modell bei jeder Aufgabe | Kein Modell | Ein Modell nur als letzter Gang |

Ansätze unterscheiden sich graduell auf jeder Achse, und die Achsen wirken zusammen: Wiederverwendung senkt die Energie und die noch aufzulösende Entropie, und starke Verifikation macht Wiederverwendung überhaupt erst sicher. RCE schreibt die Bedeutung einmal, in einer kanonischen Form. Jede Oberflächensprache ist eine Projektion dieser Form, darauf geprüft, mit ihr übereinzustimmen. Unter gleichwertigen Formen läuft die günstigste korrekte.

Abbildung 2 zeichnet die fünf Achsen und platziert die Hauptklassen der Ansätze darauf.

![Radar-Diagramm mit fünf Achsen: Energie pro korrektem Ergebnis, Determinismus, Verifikationsstärke, Wiederverwendung und Verzinsung sowie Unabhängigkeit von Modellen. Fünf Ansatzklassen werden als Polygone gezeichnet. Ein Modell bei jeder Aufgabe befindet sich in der Nähe des Zentrums auf allen Achsen. Ein Agentenkreis, der durch Tests begrenzt ist, ist höher in der Verifikation. Ein Modell mit Retrieval und Caching ist höher in der Wiederverwendung. Klassische Synthese und Reparatur ist hoch in Determinismus und Modellunabhängigkeit. RCE, markiert mit Sternen, befindet sich am oder nahe dem äußeren Ring auf allen fünf Achsen. Die Platzierungen sind qualitativ.](/figures/rce/design-space.svg)

*Abbildung 2. Der Entwurfsspielraum autonomer Codierung. Qualitatives Diagramm: jede Klasse von Ansätzen wird gemäß der Lesart des Abschnitts 2 des Artikels auf ordinalen Ebenen platziert, nicht gemäß Messung. Die Modellabhängigkeit wird als Unabhängigkeit von Modellen gezeichnet, damit der äußere Bereich auf jeder Achse besser ist. Eine [PNG-Kopie](/figures/rce/design-space.png) wird bereitgestellt.*
<div id="21-programming-is-coding-theory" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Programmierung ist Kodierungstheorie

Die These dieses Abschnitts lautet, dass Programmierung als Kodierungstheorie gelesen werden kann. Ein Programmierer konvertiert Absichten entlang eines Gradienten zwischen zwei entropischen Regimen. Absicht ist eine hohe Entropie, eine Verteilung über Bedeutungen. Code ist eine niedrige Entropie, eine deterministische Übergang pro Zustand. Jeder Schritt der Softwareentwicklung, von einem Anforderung bis zu einem Register, ist ein Schritt dieser Konvertierung. Die Literatur hat dies in Teilen seit 70 Jahren in vielen Sprachen gesagt. Dieser Abschnitt fasst die Teile zu einem Argument zusammen und platziert jeden RCE-Gang darauf.

**Die Messung.** Shannon definierte die Entropie einer Quelle und die Kapazität eines Kanals [40], und maß gedrucktes Englisch bei etwa 0,6 bis 1,3 Bit pro Buchstaben [1]. Kolmogorov, der 1965 auf Russisch in *Problemy Peredachi Informatsii* schrieb, gab drei Ansätze zur Quantität der Information und machte den algorithmischen Ansatz primär: die Information in einem Objekt ist die Länge des kürzesten Programms, das es erzeugt [41]. Solomonoff erreichte denselben Gegenstand als Theorie der induktiven Inferenz [42], und Chaitin zeigte, dass die Programmgröße Identitäten formal identisch zu Shannons folgt [43]. Rissanen wandelte die Idee in eine Regel zur Wahl von Modellen, der minimalen Beschreibungsgröße [44]. Zusammen sagen sie, dass ein Programm ein Codewort ist: eine Beschreibung eines Verhaltens, und das kürzeste korrekte ist der Boden. RCEs Extraktionsregel, die Passung mit den wenigsten Joule unter gleichwertigen Passungen zu behalten (Aussage 3), ist diese Regel mit Joule anstelle von Bit.

**Code sitzt im niedrig-entropischen Regime, und Menschen haben es gemessen.** Hindle, Barr, Su, Gabel und Devanbu fanden heraus, dass Code „sehr repetitiv ist und in der Tat sogar noch mehr als natürliche Sprachen“, bei niedrigerer Kreuzentropie unter denselben n-Gramm-Modellen [35]. Gabel und Su fanden heraus, dass die meisten Zeilen eines Projekts bereits an anderer Stelle existieren [34], und Lopes et al. fanden heraus, dass die meisten Dateien auf GitHub Kopien sind [33]. Tu, Su und Devanbu fanden heraus, dass Code auch lokal ist: was in der Nähe geschrieben wurde, prognostiziert, was als nächstes kommt [46]. Ray und Kollegen fanden heraus, dass fehlerhafte Zeilen weniger natürliche sind, mit höherer Entropie, und dass die Entropie fällt, wenn der Fehler behoben wird [45]. Im Jahr 2025 verwendeten Yang, Kolak, Hellendoorn und Martins die Entropieänderung, die ein Patch induziert, um Reparaturkandidaten zu rangieren und korrekte Patches von überanpassenden zu trennen [51]. Allamanis, Barr, Devanbu und Sutton untersuchten das Feld unter dem Namen Naturalness [47]. Das Ergebnis ist nicht nur ein englischsprachiges. Prem Devanbu stellte es als Keynote am India Software Engineering Conference 2013 vor [50]. Sridhara, Sinha und Mani von IBM Research India maßen die natürlichsprachlichen Artefakte um Code am selben Ort und fanden heraus, dass Commit-Nachrichten am regelmäßigsten sind und Stack Overflow-Prosa sich wie gewöhnliches Englisch verhält [49]. In China veröffentlichte das *Journal of Software* (软件学报) 2022 eine Übersicht über Forschung zur Code-Naturalness, die die Kreuzentropie-Messung und die Erkenntnis, dass fehlerhafter Code höhere Entropie hat, erwähnt [48]. In Japan verwendeten Doi, Higo, Arima, Shimonaka und Kusumoto an der Osaka University n-Gramm-Naturalness, zuerst in einem japanischsprachigen IEICE-technischen Bericht und dann bei ICPC 2018, um maschinengenerierte Quellcodedateien von menschlich geschriebenen zu trennen [73, 74]. Generierter Code sitzt noch niedriger auf der Entropie-Skala als menschlicher Code, weil ein Generator eine feste Konvertierung ist. In Brasilien baute Arrebolas Doktorarbeit Code-Vorschläge auf n-Gramm- und Themenmodellen, segmentiert nach Projekt und Wartungsperson, und bewertete sie durch Kreuzentropie, die Bits, die benötigt werden, um den nächsten Token zu kodieren [75]. Die beiden Regime sind in einem Repository sichtbar: der Text um den Code ist hoch entropisch, und der Code ist niedrig.

**Die Messung zählt.** Febres, Jaffé und Gershenson, die aus Venezuela und Mexiko stammen, verglichen Englisch, Spanisch und Programmtext durch Vokabularvielfalt pro Nachrichtenlänge und fanden heraus, dass der Programmtext vielfältiger ist [76]. Rahman, Palani und Rigby fanden heraus, dass viel der n-Gramm-Vorhersagbarkeit von Code aus Syntax-Token stammt, und dass Code immer noch repetitiv ist, weniger als zuerst berichtet, sobald diese entfernt sind, mit API-Nutzung als am repetitivsten Teil [77]. Beide Ergebnisse schärfen die Aussage, anstatt sie umzukehren. Vielfalt der Symbole ist keine Vorhersagbarkeit, und das niedrig-entropische Regime ist eine Eigenschaft der bedingten Verteilung des nächsten Schritts, was ein deterministischer Übergang festlegt. RCEs G0 indiziert aus diesem Grund nach Formen und nicht nach Oberflächen-Token.

**Absicht sitzt im hoch-entropischen Regime.** Zave und Jackson zeigten, dass eine Anforderung eine Aussage über die Umgebung ist, eine Spezifikation eine Aussage an der Schnittstelle, und der Abstand zwischen ihnen wird nur durch Domänenwissen gefüllt, das oft nicht geschrieben ist [64]. Brooks teilte die Schwierigkeit der Software in Essenz und Zufall auf: die Essenz ist der konzeptionelle Aufbau, und der größte Teil davon ist Spezifikation und Gestaltung, nicht Darstellung [61]. Naur argumentierte, dass ein Programm der sichtbare Teil einer Theorie ist, die seine Programmierer halten, und dass die Theorie nicht vollständig aus dem Text wiederhergestellt werden kann [62]. Durchgelesen durch Shannon sagen alle drei dasselbe. Absicht trägt mehr Unsicherheit als jedes einzelne Programm, und das Schreiben des Programms ist der Akt, der sie entfernt. Was in einem Programmierer bleibt, nachdem der Code geschrieben ist, ist der Teil der Absicht, den der Code nicht kodiert.

**Die Konvertierung ist eine Verfeinerung, und Verfeinerung ist eine Verengung.** Hoare gab Programmen eine Logik, in der ein Programm korrekt ist in Bezug auf eine Vor- und Nachbedingung [54]. Wirth lehrte schrittweise Verfeinerung: zerlege eine Aufgabe in Anweisungen durch sukzessive Entscheidungen, jede davon fixiert eine Wahl, die die Spezifikation offen gelassen hat [53]. Dijkstras geschützte Befehle machten die offenen Wahlmöglichkeiten explizit als Nichtdeterminismus und leiteten Programme aus Spezifikationen ab, indem sie ihn entfernten [52]. In München baute Bauer und Wössners CIP-Projekt die Programmentwicklung als eine Folge von korrektheitserhaltenden Transformationen von Spezifikation zu Programm [58]. In Frankreich trug Abrials B-Methode und dann Event-B die Verfeinerung auf industrielle Skala, mit Nachweispflichten an jedem Schritt [55, 56]. In Finnland gab Back und von Wright der Verfeinerung ihre Lattice-theoretische Kalkulation [57]. In jedem Fall bezeichnet eine Spezifikation eine Menge akzeptabler Verhaltensweisen und jeder Verfeinerungsschritt verkleinert die Menge, bis ein deterministisches Verhalten bleibt. Das ist Entropie-Reduktion mit einem Nachweis an jedem Schritt. RCEs Form ist das letzte Element dieser Kette: ein vollständiger, deterministischer Übergang $\delta$ über Datenbankzustände, mit jeder Wahl gelöst ([§3.2](#32-definitions)).

**Synthese ist Suche, die einen Hypothesenraum verengt.** Gulwanis FlashFill lernt ein Zeichenprogramm aus ein paar Eingabe-Ausgabe-Beispielen, indem er die Menge aller konsistenten Programme darstellt und sie mit jedem neuen Beispiel schneidet [59]. Gulwani, Polozov und Singh stellen die Programmsynthese allgemein als Suche durch einen Raum von Programmen, eingeschränkt durch Absicht, dar [60], und Solar-Lezamas Skizzierung füllt Lücken in einem unvollständigen Programm mit einem Löser [27]. Jedes Beispiel oder jede Einschränkung ist eine Messung, die Hypothesen entfernt. Shannons Messung zählt, wie viele solcher Messungen benötigt werden. RCEs G2 ist dieser Gang.

**Was die Konvertierung erzeugt, hat eine Form.** Gurevich bewies, dass jeder sequenzielle Algorithmus durch eine abstrakte Zustandsmaschine auf seiner eigenen Abstraktionsstufe erfasst wird [2]. Codd machte den Zustand eine Relation [5], und Event Sourcing macht den Zustand den Faltung eines nur-hinzufügenden Logs [14]. Unter Curry und Howard ist ein Beweis ein Programm und eine Aussage ein Typ [18, 72], also ist eine verifizierte Passung ein Beweis ihrer Spezifikation. Das sind die Gründe, warum das niedrig-entropische Regime wenige Formen hat: das Ziel ist eine Zustandsmaschine über eine Datenbank, egal welche Oberflächensprache.

**Niedrige Entropie zerfällt ohne ein Tor.** Lehman beobachtete über Jahrzehnte großer Systeme, dass ein in Gebrauch befindliches Programm sich ständig verändern muss, und dass seine Komplexität wächst, es sei denn, Arbeit wird geleistet, um sie zu reduzieren [63]. Torres, Baltes, Treude und Wagner maßen strukturelle und textuelle Entropie über die Commit-Historien von 25 Projekten und fanden heraus, dass beide gemeinsam ansteigen [78]. Entropie fließt zurück in den Code aus der Umgebung. Ein System, das Code im niedrig-entropischen Regime hält, benötigt ein Tor für jede Änderung, und RCEs Tor ist Korrektheit ([§4.3](#43-the-gate)).

**Compiler machen bereits Quellencodierung.** Franz und Kistler schickten Programme als komprimierte abstrakte Syntaxbäume und generierten nativen Code beim Laden, was Quellencodierung eines Programms über seine eigene Grammatik ist [67]. Fraser schloss statistische Modelle des Codes aus einem Corpus ab, um ihn zu komprimieren [68]. Futamura zeigte 1971 in der japanischen Zeitschrift *Systems, Computers, Controls*, dass das Spezialisieren eines Interpreters für ein Programm ein kompiliertes Programm ergibt, und dass das Spezialisieren des Spezialisierers einen Compiler ergibt [70]. Ershov in Nowosibirsk entwickelte dieselbe Idee als gemischte Berechnung [71]. Die Cousots' abstrakte Interpretation berechnet eine konservative, niedrigere Informationsbeschreibung jedes Verhaltens eines Programms [69]. Der Vergleich zu Kanalcodierung ist die Lesart dieses Papers, nicht ein zitiertes Theorem: Typen, Tests und Beweise fügen überprüfte Redundanz hinzu, damit ein falsches Programm vor dem Ausführen erkannt wird, wie ein Paritätscheck ein korruptes Wort erkennt.

**Löschung ist, wohin die Joule gehen.** Landauer zeigte, dass ein logisch irreversible Schritt, die Löschung eines Bits, mindestens $k_B T \ln 2$ dissipiert [65]. Bennett zeigte, dass Berechnung in Prinzip logisch reversibel gemacht werden kann, also die Löschung, nicht die Berechnung, trägt die Schranke [66]. Die Konvertierung von hochentropischer Absicht in ein niedrigentropisches Programm verwirft jede Alternative, die die Absicht erlaubt. Diese Verwerfung ist eine Löschung von Information über die Alternativen, und sie hat eine thermodynamische Schranke. RCE zahlt die Verwerfung einmal pro neuem Fall und speichert das Ergebnis, sodass ein Wiederholungsfall nichts Neues löscht.

**Was die Oberfläche kostet, gemessen.** Das Naturalness-Ergebnis hat zwei Korrekturen, die dieses Paper jetzt trägt, und eine dritte Erkenntnis, die sich auf den namenlosen Form bezieht. Erstens schrumpft der rohe Entropie-Abstand zwischen Code und Prosa erheblich, sobald Syntax-Token entfernt sind [77], und Casalnuovo, Lee, Morgan und Devanbu fanden heraus, dass ein Teil dessen, was übrig bleibt, ein Vertrautheitseffekt ist: in den top-starred Java- und Python-Projekten hatte der ursprüngliche Code eine geringere Überraschung als Bedeutungserhaltende Umformulierungen, und 50 menschliche Gutachter stimmten dem Sprachmodell-Präferenz 61,9 % der Zeit zu [132]. Was als natürlich liest, ist das, was der Leser am meisten gesehen hat, also ein kanonischer Form verschiebt das Gleichgewicht dieses Schlaufs, statt es zu verlassen. Zweitens sind die einzigen Größen, die gemessene Verständnislast verfolgen, textuelle Größe, Vokabulargröße und Datenfluss-Abhängigkeitsreichweite: in der einen Studie, die Code-Metriken gegen Gehirnaktivierung getestet hat, korrelierten diese drei bei Kendall τ ≈ 0,4, während McCabe cyclomatische Komplexität mit nichts korrelierte (τ ≈ 0,09) [133]; über 121 Lesbarkeitsmetriken und 444 Bewertungen erreichte keine einzelne Metrik |τ| > 0,16 mit gemessener Verständlichkeit [134]; und pretty-printed gegen gestörte Layout zeigte keine fMRI-Differenz [135], konsistent mit der Erkenntnis, dass Formatierung 13 bis 15 % der Token von Klammernsprachen sind und für zehn Sprachmodelle ohne signifikante Änderung in der Genauigkeit gestript werden können [136]. Drittens sind Namen ein Kanal mit geringer Übereinstimmung und hoher Abhängigkeit: zwei Entwickler wählen denselben Namen mit medianer Wahrscheinlichkeit 6,9 % [137], Kommentare ko-evolvieren mit dem Code, den sie beschreiben, in 7 bis 13 % der Fälle [138], und doch verlieren Frontier-Modelle 11 bis 29 Punkte Genauigkeit bei Zusammenfassung und bis zu 24 Punkte bei Ausführungsvorhersage, wenn Identifikatoren entfernt oder ersetzt werden [139]. Menschen verarbeiten Identifikatoren nicht auf der neuronalen Ebene als Sprache: das Austauschen von englischen Identifikatoren gegen japanische veränderte die Sprachsystemantwort um Δβ = 0,03 [140]. Die Konsequenz für RCE wird in [§3.8](#38-behaviour-equivalence-and-dimension) erwähnt: Positionen bleiben im Hash (T7) und Namen bleiben außerhalb, aber die Seiten-Tabelle, die sie hält, muss den *Begriff* tragen, den ein Name kodiert, weil die einzigen Autoren, die zählen, durch Namen lesen und der Form hat noch nicht gezeigt, dass ein Modell aus einem namenlosen einen Schluss ziehen kann.
<div id="22-how-rce-converts-and-where-each-gear-sits" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Wie RCE konvertiert und wo sich jeder Gang befindet

Als Kodierungstheorie gelesen trifft eine Aufgabe als Nachricht ein, deren verbleibende Unsicherheit das ist, was keine gespeicherte Passung bereits auflöst. Jeder Gang baut Unsicherheit zu einem anderen Preis ab, und die Gänge sind nach diesem Preis geordnet ([§4.2](#42-the-gears)).

| Gang | Was er mit der Unsicherheit macht | Linie in dem oben genannten Argument |
|---|---|---|
| G0 Lookup | Erkennt, dass die Absicht bereits kodiert war; löst sie durch Abruf auf der Ebene des Handlers | Wiederholung und Klone [33, 34, 35]; Lokalität [46] |
| G1 Rules | Wendet eine bekannte geschützte Umformung an; löst ein wiederkehrendes Residuum ohne Suche | Korrektheitserhaltende Transformation [52, 58]; Verfeinerung mit Nachweispflichten [55, 56] |
| G2 Synthese | Durchsucht einen Hypothesenraum und verengt ihn durch Beispiele, Einschränkungen und einen Löser | Programmsynthese als Suche [27, 59, 60] |
| G3 bis G5 Modelle | Zieht Stichproben aus einer gelernten Verteilung über Code, wenn kein unterer Gang die Lücke schließt; nur ein Vorschlagender | Kreuzentropie-Modelle von Code [35, 47] |
| Tor | Nimmt einen Kandidaten nur mit Tests, Abdeckung und einem Beweiszertifikat an | Hoare-Logik [54]; Curry-Howard [18, 72] |
| Förderung | Speichert die angenommene Passung, sodass dasselbe Residuum beim nächsten Mal G0 kostet | Minimale Beschreibungsgröße [44]; Landauer-Löschung einmalig bezahlt [65] |

Die Positionen auf den Achsen von Abschnitt 2 unterscheiden sich darin, wo die Konvertierung bezahlt wird. Ein Ansatz, der bei jeder Aufgabe die vollständige Verteilung des Prompts stichprobenartig abfragt, zahlt jedes Mal erneut für die hochentropische Seite. Ein Ansatz, der akzeptierte Passungen speichert und wiederverwendet, zahlt nur für das Residuum, und nur einmal. Die meisten Systeme befinden sich zwischen diesen Enden, und RCE sitzt am Wiederverwendungs-Ende.

<div id="23-the-ecosystem-checked-per-program" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Das Ökosystem, geprüft pro Programm

Die Aussage von [§1](#1-thesis) wird Programm für Programm geprüft, nicht anhand einer Stichprobe. Jede der folgenden Eigenschaften ist eine Pflicht jedes Programms, geprüft durch die kontinuierliche Integration (CI) von [openIE-dev/rce](https://github.com/openIE-dev/rce), und ein einziges Programm, das eine Pflicht verletzt, widerlegt die Aussage. Die dritte Spalte nennt, wann jede Prüfung läuft: Die Tests des Prüfers sowie die Referenz- und Scala-Läufe der Konformitätssuite laufen bei jedem Push und jedem Pull Request, der Rust-Lauf der Suite einmal wöchentlich und auf Anforderung, und ihre Python- und JavaScript-Läufe sind nicht in der CI enthalten. Wo eine Prüfung bei jedem Commit läuft, wird ein später hinzukommendes Programm vor dem Zusammenführen daran gemessen. Eine Stichprobe sagt aus, wie viele Programme ausprobiert wurden; eine Prüfung auf jedem Programm sagt aus, dass die Eigenschaft für jedes im Repository gehaltene Programm gilt. Kein Modell wird aufgerufen.

| Eigenschaft | Pflicht jedes Programms | Wo und wann geprüft wird |
|---|---|---|
| Verlustfreie Kodierung | Seine Form (`rce emit form`), in Quelltext dekodiert (`rce unform`), ergibt ein Programm, dessen Syntaxbaum, Verdikt und Beobachtungen denen des Originals gleichen | `tests/form_roundtrip.rs`, auf jeder `.rce`-Datei der Spezifikationsbeispiele und der Testkorpora des Prüfers; in der schnellen Testgruppe von `ci.yml`, bei jedem Push und Pull Request |
| Treue Projektion | Jedes ausgegebene Programm (Rust, Python, JavaScript und Scala) gibt die Referenzbeobachtungen und die gesamte Referenzspur Zeile für Zeile aus | `tests/emit.rs` auf jedem Beispiel, ein langsames Test-Binary, das `ci.yml` bei jedem Push und Pull Request als eigenen Job ausführt. Die Konformitätssuite: Bei öffentlichem Commit `43ea544a` besteht jeder der vier Emitter alle 1.459 seiner ausführbaren Tests ohne Fehler (die übrigen 520 prüfen die Zulassung, über die das Frontend entscheidet). Von den Emitter-Läufen ist nur der Scala-Lauf bei jedem Push und Pull Request in der CI (`conformance.yml`); der Rust-Lauf ist `emit-rust.yml`, einmal pro Woche und auf Anforderung; die Python- und JavaScript-Läufe sind nicht in der CI und werden in der README der Suite zusammen mit dem Commit festgehalten, bei dem sie erstellt wurden |
| Deterministische Projektion | Zwei Ausgaben desselben Ziels liefern dieselben Bytes | `tests/emit_deterministic.rs`: Jedes von `rce emit` akzeptierte Beispiel wird zweimal, jeweils in einem eigenen Prozess, in die Form, den Kern, Rust, Python, JavaScript und Scala ausgegeben, und die Bytes werden verglichen; in der schnellen Testgruppe von `ci.yml`, bei jedem Push und Pull Request |
| Tor am Eingang, Eingaben | Eine fehlerhaft geformte Nutzlast (falscher Typ, fehlendes Feld, zusätzliches Feld, verschachtelter Wert) oder ein nicht deklariertes Ereignis verändert niemals den Zustand: Ein nicht deklariertes Ereignis erfordert eine Änderung, eine Nutzlast, die ihren Vertrag verfehlt, behält den Zustand bei, und das Ergebnis wird aufgezeichnet | Die Host-Vertragstests (`tests/host_*.rs`), in der schnellen Testgruppe von `ci.yml`, bei jedem Push und Pull Request; der Eingabevertrag von `rce run` ist Punkt 15 von [§10](#10-work-to-finish) |
| Tor am Eingang, Spezifikationen | Ein Modul, das einen Namen verwendet, den es nicht deklariert, erfordert vor der Ausgabe eine Änderung (W-NAME-1) | Die Zulassungstests der Konformitätssuite, ausgeführt gegen den Referenzprüfer durch `conformance.yml` bei jedem Push und Pull Request |

Abschnitt 9 nennt die Beobachtung, die die Aussage widerlegt, RCE-F0: ein einziges Programm im Repository oder beim Eintritt in dieses, dessen ausgegebenes Programm eine von seiner Referenzspur abweichende Spur ausgibt, oder eine einzige fehlerhafte Eingabe, die den Zustand verändert. Ein später zu den Emittern hinzugefügtes Ziel tritt unter denselben Prüfungen ein. Gehobene Formen aus realen Programmen werden unter dem Protokoll von [§8.7](#87-lift-coverage-across-languages) gemessen.
<div id="24-gated-verified-recursive-self-improvement" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Torgesteuerte, verifizierte rekursive Selbstverbesserung

Good (1965) [111] definierte die ultraintelligente Maschine als eine, die besser Maschinen entwerfen könnte, so dass die Verbesserung rekursiv wäre. Yudkowsky (2013) [113] stellte die Frage als eine von Rückgaben dar: ob jede Einheit Verbesserung die nächste Einheit billiger oder teurer macht. Schmidhubers Gödel-Maschine (2007) [112] gab eine formale Antwort mit einer Garantie: ein Programm schreibt beliebige Teile von sich selbst, einschließlich seiner eigenen Suche, nur nachdem es bewiesen hat, dass die Neuschreibung seine erwartete Nutzen verbessert. Löbs Theorem (1955) [114] ist das Hindernis, das ein selbstvertrauender Beweiser trifft, das Yudkowsky und Herreshoff (2013) [115] den Löbischen Hindernis nennen: ein System kann im Allgemeinen nicht die Korrektheit eines Nachfolgers beweisen, der dessen eigenen Beweisesystem verwendet. Kürzliche Systeme entfallen auf die Nachweisvoraussetzung und wählen durch gemessene Bewertung: STOP (Zelikman et al., 2023) [116] verbessert den Gerüst, der den Code verbessert, die Darwin Gödel-Maschine (Zhang et al., 2025) [117] hält eine Archiv von selbstmodifizierten Codierung-Agenten, die durch Benchmark-Bewertung gewählt werden, AlphaEvolve (Novikov et al., 2025) [118] entwickelt Programme unter automatischen Evaluatoren, und Voyager (Wang et al., 2023) [119] wächst eine Bibliothek von verifizierten Fähigkeiten, die spätere Aufgaben wiederverwenden.

RCE nimmt die Struktur der Gödel-Maschine und die Bibliothek von Voyager mit zwei Unterschieden an, die das Hindernis für die Objekte, die es fördert, umgehen. Erstens ist das Objekt, das verbessert wird, nicht der Beweiser. In der Gestaltung fördert RCE Handler, Neuschreibungen und Gänge, und jedes wird gegen einen festen Kern und eine festen Beweisregel geprüft: die Eigenschaften, gegen die der Kern mit Modellprüfung geprüft wird ([§5.3](#53-model-checking-of-the-kernel)), und die Kodierung der Arithmetik des Forms für einen Satisfiability Modulo Theories (SMT) Solver ([§5.2](#52-the-proof-rule-for-rewrites)) ändern sich nie durch Förderung, also braucht kein Schritt ein Nachfolgersystem vertrauen. Zweitens ist das Tor ein Beweis der Korrektheit an der Grenze, nicht eine Bewertung. Eine Bewertung kann ansteigen, während eine Schnittstellenannahme bricht; ein Beweis an der Grenze kann nicht durch eine Änderung, die sie bricht, übergeben werden.

**Aussage R1 (monotoner Korrektheit).** Wenn jede geförderte Änderung die Prüfung ihrer Grenze besteht und die Prüfungen der anderen Grenzen unverändert bleiben, dann hält jede Eigenschaft, die diese Prüfungen vor der Förderung etabliert haben, nach der Förderung weiterhin.

**Aussage R2 (Verzinsung).** Sei eine Arbeitslast eine Multimenge von Aufgaben und sei ein gefördeter Handler jede Aufgabe seiner Form schließen. Dann ist die Anzahl der Eskalationen in Runde t nicht zunehmend in t, und eine Korrektur, die vor Runde 1 gefördert wird, verringert die kumulierten Eskalationen jedes Horizonts um die Eskalationen, die sie in jeder späteren Runde schließt.

**Aussage R3 (fallende Kosten).** Da ein geförderter Handler anstelle eines Modellaufrufs ausgeführt wird und seine Kosten die über die Substrattabelle bewertete Operationszahl des Handlers sind, fällt die geschätzte Energie (`est_j`) einer Runde gegen die geschätzte Energie der Handler allein, wenn die Eskalationen gegen null gehen. Die Aussage betrifft die Schätzung; kein Messwert stützt sie.

Futamuras Projektionen (1971, erneut veröffentlicht 1999) [120] und Turchins Supercompilation (1986) [121] geben den Grenzwert dieses Prozesses. Die Spezialisierung eines Interpreters auf ein Programm ergibt ein kompiliertes Programm; die Spezialisierung des Spezialisierers ergibt einen Compiler. RCEs Förderungen spezialisieren den allgemeinen Eskalationspfad auf die Formen, die tatsächlich auftreten, sodass die Engine gegen das Residualprogramm ihrer Arbeitslast konvergiert: den Teil der Berechnung, den ein Modell oder eine Person noch liefern muss. Rekursive Selbstverbesserung unter einem Tor ist diese Konvergenz, vollzogen in geprüften Schritten.

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

Ein Log kann auch das Ergebnis, die Ausgaben und den Zustand jedes Eintrags tragen. Diese sind abgeleitet: sie werden nicht gehasht, und sie müssen der Wiederholung entsprechen (T1 und T3 von [§3.7](#37-the-language-one-text-costs-and-theorem-status)). Zwei Ergebnisse sind voneinander zu unterscheiden. Im Engine-Profil, das Anhang D der Spezifikation definiert, wird jedes Ereignis angewendet, und eine Eingabe, die ihren Vertrag nicht erfüllt, erzeugt eine `reject`-Ausgabe und eine Fehlerzeile (D.6), keinen beibehaltenen Schritt. In der Sprache behält ein Ereignis, das nicht greift, den Zustand bei (T8: Atomarität, Zustand unverändert) und wird als beibehaltener Schritt aufgezeichnet.

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

**Aussage 3 (Extraktion mit geringster geschätzter Energie).** Extraktion mit $\mathrm{cost}_J$ liefert den Term mit der geringsten geschätzten Energie, den der Extraktor in der e-Klasse von $F$ findet. *Hinweis zur Beweisskizze.* Die Umformungen sind korrekt, also hat jeder Term in der e-Klasse das beobachtbare Verhalten von $F$ und besteht dasselbe Tor. Extraktion minimiert die Kosten, und die Kosten sind `est_j`, eine Schätzung in Joule, kein Messwert. ∎ Ob die Reihenfolge auch für gemessene Joule gilt, testet RCE-F5 ([§9](#9-falsifiers)). Dies ist Mixture of Limits (Mischung der Grenzen) auf Code angewendet. Mixture of Limits, Teil II des Begleitpapiers [Gemessene Commit-Tore](/papers/gates/), besagt, dass eine Aufgabe eine minimale erwartete Energie zum Abschluss benötigt und dass Energie, die nach Abschluss der Aufgabe aufgewendet wird, keinen verifizierten Fortschritt erkauft; auf Code angewendet besagt es: behalte die minimale Passung, die die Aufgabe erledigt, und der Rest ist Verschwendung.

**Aussage 4 (Wiederholungsdeterminismus).** Wenn $\delta$ keine Uhrzeit liest, Updates ohne Namen ordnet und jede Eingabe protokolliert, ergeben zwei Wiederholungen desselben $D$ identische Zustandshashes zu jedem Schritt.

**Aussage 5 (Projektion des Zustandsdiagramms ist korrekt).** Projiziere jeden Zustand einer Ausführung auf $\Sigma_c$. Das Ergebnis ist eine Ausführung des emittierten Zustandsdiagramms unter denselben Ereignissen.

**Aussage 6 (Koordination-Budget).** Regeln mit dem Merkmal monotone laufen auf Replikaten ohne Koordination; nur nicht-monotone Regeln benötigen einen Koordinationspunkt. *Basis:* der CALM-Satz, „die Programme, die konsistente, koordinationsfreie verteilte Implementierungen haben, sind genau die Programme, die in monotoner Logik ausgedrückt werden können“ [19].

Anhang D.5 der Spezifikation leitet das Merkmal aus der Regel ab, nie aus einer Deklaration, und unter der IR-Prüfung des Engine-Profils erfordert eine Form, deren gespeichertes Merkmal vom abgeleiteten abweicht, eine Änderung:

| Regel hat | Merkmal | Grund |
|---|---|---|
| keine Auflösung, Lesung, Verknüpfung oder Scan | monotone | ihre Schreibvorgänge fügen nur Schlüssel hinzu und erhöhen Zähler |
| eine Auflösung | nicht monotone | sie löscht Escalation-Zeilen |
| eine Lesung ihres eigenen Senks | nicht monotone | Lesen, Ändern, Schreiben |
| eine Schlüsselverknüpfung | nicht monotone | die verknüpfte Zeile kann jetzt nicht vorhanden sein und später vorhanden oder überschrieben werden |
| einen Scan | nicht monotone | sie beobachtet die gesamte Relation, einschließlich dessen, was fehlt |

Das Merkmal ist korrekt, aber nicht vollständig: eine Verknüpfung mit einer nur-einfügenden Relation wäre monoton, aber das Profil beweist nicht, dass eine Relation nur-einfügend ist, also beansprucht das Merkmal das nicht. Eine Form ist koordinationsfrei, wenn jede Regel monoton ist. Jede Lesung, Verknüpfung und Scan sieht den Zustand zum Eintritt des Ereignisses, also hängt der Nachzustand eines Eingabeereignisses nicht von der Reihenfolge ab, in der Regeln für verschiedene Senken laufen; nur die Ausgabereihenfolge tut es, und sie ist durch den Inhaltshash festgelegt.

**Aussage 7 (Intelligenz als Joule-Ableitung).** Sei $X$ die Anzahl der Aufgaben, die durch das Tor gehen, und $J$ die verbrauchten Joule. $\iota = dX/dJ$ ist im Nachhinein aus $D$ zu lesen, das jedes Ereignis protokolliert, und im Entwurf der Engine aus ihren Belegen ([§4.4](#44-receipts)), von denen jeder den `est_j` eines Gangaufrufs trägt. Heute enthält $D$ keinen Joule-Eintrag, da kein Prüfercode `host.Energy` schreibt, und die Joule-Angaben eines Belegs lauten `est` oder `unpriced`; ein daraus gelesenes $J$ ist eine Schätzung, und ebenso $\iota$. Extraktion unter $\mathrm{cost}_J$ hält das Tor fest und erhöht $J$ nicht, also verringert sie bei gleichem $X$ nicht $\iota$.

<div id="35-graph-e-graph-and-statechart" class="anchor-alias" aria-hidden="true"></div>

### 3.5 Graph, e-Graph und Zustandsdiagramm

| Struktur | Teil der Form | Was es entscheidet |
|---|---|---|
| Zustandsdiagramm | Wächter von $\delta$ über $\Sigma_c$ | Welche Übergang feuert |
| Datenflussgraph | Lesen- und Schreibabhängigkeiten von $\delta$ und $\lambda$ (Kahn-Prozessnetzwerke [20]) | Was läuft und in welcher Reihenfolge |
| E-Graph | Äquivalenzklasse der Passung | Welche äquivalente Passung läuft |

Das Zustandsdiagramm und der Graph beschreiben eine Passung. Der E-Graph beschreibt jede dazu äquivalente Passung. Extraktion wählt unter ihnen nach geschätzten Joule (`est_j`).
<div id="36-one-ecosystem-lossless-and-the-universality-thesis" class="anchor-alias" aria-hidden="true"></div>

### 3.6 Eine Ökosystem, verlustfrei, und die Universalitäts-Hypothese

**Verlustfrei durch Konstruktion.** Shannons Quellencodierungstheorem legt die untere Grenze für einen verlustfreien Code an der Entropie der Quelle fest [40]. Eine Form ist ein verlustfreier Code für die Absicht in enger Hinsicht, der überprüft werden kann: die kanonische Serialisierung der Form ist injektiv, also haben zwei Formen, die sich in jedem Zustand, Ereignis oder Übergang unterscheiden, unterschiedliche Form-Hashes, und die Dekodierung der Serialisierung liefert dieselbe Form zurück. Jede Projektion auf ein Ziel ist allein eine Funktion der Form. Bidirektionale Transformationen machen die Rundreise präzise. Foster, Greenwald, Moore, Pierce und Schmitt definieren ein Lens als ein Paar von get- und put-Funktionen mit Rundreisebedingungen, die sicherstellen, dass der View und seine Quelle übereinstimmen [122], Hofmann, Pierce und Wagner erweitern die Bedingungen auf symmetrische Lenses [123], und Czarnecki und Kollegen untersuchen dieselben Konsistenzbedingungen über Modellengineering, Datenbanken und Programmiersprachen [124]. Die Rundreisebedingung von RCE ist die GetPut-Bedingung auf der Ebene des gesamten Programms: heben Sie eine Projektion zurück und der Form-Hash bleibt unverändert.

**Richtig durch Konstruktion.** Dijkstra schlug 1968 vor, ein Programm und dessen Beweis gemeinsam zu entwickeln, so dass Richtigkeit entworfen, nicht getestet wird [125]. Hall und Chapman trugen diesen Ansatz in ein kommerzielles sicheres System mit formaler Spezifikation und Verfeinerung in jedem Schritt [126]. Minskys Regel für typisierte funktionale Programmierung, illegale Zustände unverfügbar machen, sagt dasselbe auf der Ebene des Typs: ein Typ, der keinen schlechten Wert halten kann, beseitigt die Notwendigkeit, ihn zu überprüfen [127]. Turners totale funktionale Programmierung erfordert, dass jede Funktion auf jedem Eingang terminiert, so dass ein Programm eine mathematische Funktion darstellt, ohne versteckte Fehler [128]. RCEs Form ist in Turners Sinne total, seine Vertragstypen machen unerklärte Zustände in Minskys Sinne unverfügbar, und die Verfeinerungskette von [§2.1](#21-programming-is-coding-theory) endet in ihr in Dijkstras Sinne. Die Konsequenz ist die in [§1](#1-thesis) genannte: was ein Programm tut, ist das, was seine Form deklariert, also gibt es nichts zu diffen oder zu verfolgen, nachdem es geschehen ist.

**Die Universalitäts-Hypothese.** Formuliert in theoretischen Begriffen, besagt die Hypothese, dass es eine universelle Form gibt. Programme werden in ihr nativ verfasst, jede bestehende Sprache ist von ihr aus als treue Projektion erreichbar, und jedes bestehende Programm gelangt in sie durch Hebung. Gurevichs Hypothese legt den Grundstein: jeder sequenzielle Algorithmus wird Schritt für Schritt von einer abstrakten Zustandsmaschine auf seiner eigenen Abstraktionsstufe erfasst [2], und parallele Algorithmen ebenso [3]. Eine Form ist solch eine Maschine über einen Datenbankzustand.

**Aussage U1 (Erfaßung).** Wenn ein Programm in der Sprache $L$ ein sequenzieller oder paralleler Algorithmus im Sinne von Gurevich ist, dann gibt es eine Form, deren Übergang ihn Schritt für Schritt auf der Ebene der Abstraktion des Programms simuliert [2, 3].

**Aussage U2 (treue Projektion).** Wenn die Projektion $\pi_L$ einer Form auf $L$ die Spur der Form auf jedem Eingang im Vertrag bewahrt, dann sind die Form und ihre Projektion für jeden Beobachter der Spur austauschbar, und $L$ fügt nichts hinzu, was die Form nicht besitzt.

**Aussage U3 (Hebung durch Konstruktion).** Jede in Gebrauch befindliche Programmiersprache hat eine formale Grammatik, einen Parser, der einen konkreten Syntaxbaum erzeugt, einen abstrakten Syntaxbaum und eine Semantik, die durch ihre Spezifikation oder Referenzimplementierung festgelegt ist. Eine Hebung $\lambda_L$ wird pro Sprache in drei Schritten aufgebaut: zuerst die Grammatik, dann der abstrakte Syntaxbaum, dann die Form, wobei jedem Konstrukt von $L$ seine Form-Regel durch die Semantik von $L$ gegeben wird. Eine so gebaute Hebung erfüllt $\pi_L(\lambda_L(p)) \equiv p$ in Bezug auf das Verhalten und $\lambda_L(\pi_L(F)) = F$ in Bezug auf den Form-Hash, also ist das Paar ein Lens im Sinne von [122], und ein Programm in $L$ wird als Form gespeichert, ohne Verlust.

**Aussage U4 (Ersetzung).** Wenn U2 und U3 für die Sprache $L$ gelten, dann muss kein Programm in $L$ geschrieben werden: es wird einmal als Form geschrieben und als $L$ emittiert, wo eine Plattform es erfordert.

**Jede Sprache ist Ziel und Quelle.** Die Form legt keine Schranke für Ziele fest. Eine Zielsprache ist eine Zeile des Emit-Registers (der Vorschlag `spec/proposals/emit-targets.md` im Spezifikations-Repository): ein Emitter über der Form-IR, der Zwischenrepräsentation der Terme einer Form, die Anhang D.7 der Spezifikation definiert, und eine Tabelle pro Sprache, die festlegt, wie diese Sprache den Zahlen- und Textvertrag von Spezifikation 6.3 einhält, wobei jede Zeile dasselbe Tor passiert, die Referenzspur jedes Beispielprogramms Byte für Byte (T9). Die Hebung $\lambda_L$ ist die Umkehrabbildung, von der festgelegten Grammatik der Sprache und einer Semantiktabelle in die Form, sodass jede Sprache sowohl eine Ausgabe der Form als auch eine Eingabe in sie ist. Der Referenzprüfer emittiert heute Rust, Python, JavaScript und Scala, und die Stufen des Registers führen die System-, Plattform-, dynamischen und nicht-von-Neumann-Sprachen auf, die folgen, einschließlich der Neuzugänge von 2024 bis 2026, die in [§3.7](#37-the-language-one-text-costs-and-theorem-status) katalogisiert sind.

U1 ist ein Theorem. U2 wird pro Ziel durch die Tests der Programmemitter geprüft ([§5.1](#51-differential-testing-of-the-program-emitters)) und auf jedem Programm durch die Prüfungen von [§2.3](#23-the-ecosystem-checked-per-program). U3 ist eine Konstruktion, aufgebaut Sprache für Sprache von der Grammatik aus, und [§8.7](#87-lift-coverage-across-languages) legt dar, wie die Konstruktion beim Aufbau gemessen wird.

**Zwei Qualifikationen.** Die Hebung von U3 ist eine Konstruktion, und ihr Definitionsgebiet ist kleiner, als der obige Satz vermuten lässt. Die Form erfordert, dass jedes Programm endet (T2), also ist die Hebung von jeder Turing-vollständigen Sprache bestenfalls eine Abbildung vom terminierenden Fragment dieser Sprache, und die Mitgliedschaft in diesem Fragment ist unentscheidbar (Rice's Theorem angewandt auf ein totales Ziel [141]). Auf dem terminierenden Fragment ist die Hebung immer noch nicht kanonisch: Schließungsdarstellung, bei der Unterterme zu Steuerzuständen werden, und Auswertungsreihenfolge sind freie Wahl, und die Umkehrung existiert nur für Programme in defunktionierter Form [142, 143]. Also ist $\lambda_L$ eine Konstruktion auf dem Bild einer partiellen Abbildung, deren Definitionsgebiet unentscheidbar ist, die Lens-Rundreisebedingungen gelten auf diesem Bild, und „jedes bestehende Programm gelangt durch Hebung in sie“ ist eine Aussage über das Fragment, das die Konstruktion erreicht, gemessen wie in [§8.7](#87-lift-coverage-across-languages) gemessen. Die zweite Qualifikation betrifft den Hash, über den die Injektivitätsbehauptung gestellt wird. Spezifikation 6.1 hashen die positionalen Formen des Zustands und des Ereignisses (Regionen und Felder als Listen in Deklarationsreihenfolge, eine Variante durch ihren Index, ein Ereignis durch seinen Index unter den Ereignissen des Moduls); der gespeicherte Eintrag behält seinen lesbaren `event` und `state` bei, und eine Spur wiederholt die gehasheten Formen unter `hashed` (Spurformat `rce-trace/2`). Das Lean-Modul `RCE/NameFree.lean` hashen De Bruijn-Schlüssel, und `RCE/Positional.lean` modelliert die positionale Einbettung (Aufzeichnungen deklarierter Typen als Feldlisten in Deklarationsreihenfolge, Varianten als Index und Felder, Ereignisse durch Index, nicht deklarierte Aufzeichnungen durch Namen) und beweist, dass sie unter jeder injektiven Umbenennung unverändert bleibt, die unerklärte Namen fixiert, was die namenlose Projektion durchführt, also bleiben der Zustandshash und die gesamte Eintragskette für jede Hashfunktion unverändert; der Ereignisindex, den sie hashen, ist per Definition der Deklarationsindex des De Bruijn-Modells, also stimmen die beiden Kodierungen auf dem von ihnen geteilten Komponenten überein. Der Referenzprüfer und die Python-, JavaScript- und Rust-Laufzeiten stimmen in den Hashes überein, und ein Test prüft, dass ein Programm und seine namenlose Projektion dieselben Log-Hashes haben, wie T7 besagt; bei dem öffentlichen Commit `f2bd7222`, der `RCE/Positional.lean` hinzufügt, besteht die Prüfung bei 5.052 Theoremen mit nur Standardaxiomen. Ein früherer Referenzprüfer hashen den benannten kanonischen JSON, also hingen seine Log-Hashes von Namen ab, während die Modellhashes nicht taten; das Spezifikationsregister der Vorschläge dokumentiert diese Entdeckung, den Test, der sie demonstrierte, und ihre Lösung als Erratum unter C.15 (der Log-Eintrag liegt außerhalb der Bedeutung eines Programms), mit den Spur-Testfällen, Anwendungsgolden, 130 Konformitätsstiften und den Regenerierung der Feed-Vektoren der Standardbibliothek.
<div id="37-the-language-one-text-costs-and-theorem-status" class="anchor-alias" aria-hidden="true"></div>

### 3.7 Die Sprache: ein Text, Kosten und Theorem-Status

Die RCE-Sprache wird durch eine schriftliche Spezifikation ([/rce/spec/](/rce/spec/); Quelle im [rce-Repository](https://github.com/openIE-dev/rce)) definiert. Es gibt eine Sprache, den Text der Spezifikation an einem Commit, und jedes Modul eines Programms ist in ihr enthalten (Spezifikation 2.7). Abschnitte 2 bis 10 definieren den Kern; Anhang C definiert Konkurrenz (`par`, `for ... par`, `with budget`, Workgroups, LVars, Sitzungen und Aufsichtspersonen) und gilt für jedes Modul; Anhang D definiert das Profil der Engine: die Handler-Spezifikationen und Passungen des Entwurfs der Engine. Keine Deklaration wählt einen Dialekt aus: ein Kommentar `# rce-version:` in der ersten Zeile ist ein Versionslabel, das den Commit der Spezifikation benennt, gegen die ein Modul geschrieben wurde, wird vom Prüfer ignoriert und nicht gehasht, und ein Konstrukt, das der Prüfer nicht implementiert, erfordert als reserviert, nicht implementiert eine Änderung (W-RES-1, Anhang F.12). Die Sprache befindet sich in der Entwicklung und ändert sich, während das Projekt lernt: eine Form kann hinzugefügt, verallgemeinert oder ersetzt werden, und die Änderung und jedes Programm im Repository, das sie berührt, bewegen sich gemeinsam in einem Commit, nie als eine pro-Modul-Entscheidung, sodass ein Programm nie von der Version eines anderen Programms oder einer Bibliothek abhängt: alles, was an einem Commit geprüft wird, stimmt mit der Spezifikation an diesem Commit überein.

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
| T8 | Atomarität: ein Ereignis, das nicht greift, behält den Zustand unverändert bei | bewiesen |
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
| T34 | Die ordnungserhaltende A-Normalform (ANF)-Passage vor jedem Ausgeber liefert denselben Wert, Speicher und dieselbe Spur von Gebühren und Emissionen | bewiesen für ein Kernfragment mit voller ANF; die Implementierung wird auf jedem Ziel differenziell getestet, einschließlich eines Durchlaufs der Budgets über den Abbruchpunkt |

T9-L ist der Anspruch über die Programmausgeber der Sprache, den [§5.1](#51-differential-testing-of-the-program-emitters) beschreibt; ein Ziel außerhalb dieser Menge hat keinen T9-Anspruch. Die Spezifikation formuliert auch T9-F, für die Ziele des Form-Compilers der Engine, und [§10](#10-work-to-finish) listet ihre Test.

![Gitter von 34 Einträgen, T1 bis T34 mit T9 als T9-L und T19 in T19a und T19b aufgeteilt, jeder mit einem kodierten Grad. Bewiesen: T1, T2, T3, T4, T5, T7, T8, T14, T15, T32, T33; Bewiesen für einen genannten Kern oder Fragment; Rest getestet oder zitiert: T6, T9-L, T13, T34; Bewiesen auf einer Schritt-für-Schritt-Semantik eines Kerns von RCE: T16, T17, T19a, T20, T23; Bewiesen auf einem benannten Modell (Rotation, Aussage, Lauf, Sitzungsrechnen): T11, T12, T24, T28; Modell: T18, T19b, T21, T22, T25, T26, T31; Modell, mit Referenzevaluator-Vektoren durch den Lean-Kern geprüft: T27, T29, T30; Mechanisch geprüft (LALR(1)-Tabellen): T10.](/figures/rce/theorem-status.svg)

*Abbildung 3. Theorem-Status, T1 bis T34. Grad jedes Theorems wie in der Spezifikation an öffentlichem Commit `ac95172` (Entwurf 0.7); Theoreme nach T34 sind nicht gezeigt, und T9 wird als T9-L, der Anspruch über die Programmausgeber, gezeigt. `P`: Lean-Beweis über die Kernsemantik. `P*`: bewiesen für einen genannten Kern oder Fragment, der Rest getestet oder zitiert. `S`: bewiesen auf einer Schritt-für-Schritt-Semantik eines Kerns von RCE. `M+`: bewiesen auf einem benannten Modell (Rotation, Aussage, Lauf, Sitzungsrechnen). `M`: Lean-Beweis über ein abstraktes Modell. `MV`: Modell, mit Referenzevaluator-Vektoren durch den Lean-Kern geprüft. `C`: mechanisch geprüft. T16 bis T31 sind die Konkurrenztheoreme des Anhangs C, und keiner ist ein Beweis über den Rust-Referenzevaluator. Lean 4 v4.12.0, keine Mathlib. Quelle: `spec/book/10-theorems.md` und Anhang C.13. Eine [PNG-Kopie](/figures/rce/theorem-status.png) wird bereitgestellt.*

**Prüfungen laufen.** Bei öffentlichem Commit `0c015c43` schließt `lake build` über die 62 Dateien von `spec/lean/RCE/` ohne `sorry` ab (58 Dateien bei öffentlichem `e416fd0`, 46 bei `4304048`), und der laufende Audit berichtet als Axiome von 5.055 Theorem-Konstanten ausschließlich `propext`, `Quot.sound` und `Classical.choice` (4.877 bei `e416fd0`). Der Audit zählt jede Theorem-Konstante in der Kernel-Umgebung, einschließlich Konstanten, die der Elaborator generiert, und unterscheidet sich daher von der Anzahl der `theorem`- und `lemma`-Deklarationen in der Quelle, die bei demselben Commit 1.155 beträgt (1.116 bei `e416fd0`). Bei demselben Commit enthält die Quelle des Referenzprüfers 581 Testfunktionen, und die Spezifikationsprüfung baut die LALR(1)-Tabellen der Kerngrammatik (974 Zustände) und der Grammatik mit Anhang C (1.152 Zustände) mit 0 Konflikten, akzeptiert 62 von 62 gültigen Beispielen und meldet, dass 12 von 12 Syntaxbeispielen und 65 von 65 schlecht typisierten oder unzulässigen Programmen eine Änderung erfordern. Bei öffentlichem Commit `ac95172` baut die Spezifikationsprüfung die LALR(1)-Tabellen der Kerngrammatik (Abschnitte 2 bis 10, 932 Zustände) und der Grammatik mit Anhang C (1.110 Zustände) mit 0 Konflikten, akzeptiert 51 von 51 gültigen Beispielen, meldet, dass 12 von 12 Syntaxbeispielen und 64 von 64 schlecht typisierten oder unzulässigen Programmen jeweils unter Nennung ihrer Regel eine Änderung erfordern, und parst jedes Beispiel mit drei Parsern, und der WebAssembly-Build des Prüfers besteht 401 von 401 Prüfungen gegen die Beispielkorpora.

**Eine Konvergenzbeobachtung.** Zwei Durchgänge vom 24. Oktober 2026 katalogisierten 111 Programmiersprachen, die erstmals zwischen Januar 2024 und Oktober 2026 öffentlich gemacht wurden [189, 190]: 72 für Sprachmodelle oder Agenten als Autoren oder hauptsächlich von einem Agenten implementiert (48 aus dem Katalog agentlanguages.dev [166], gelesen in seinem Quellrepository, und 24 darüber hinaus), und 39 allgemeine oder Systemsprachen, mit 35 Sprachen vor 2024, die in dem Fenster einen Meilenstein erreichten. Unter den maschinengeschriebenen Eingängen ist die Anzahl pro Jahr 3, 10 und 57 für 2024, 2025 und 2026. Zwei Positionen sind fast universell: Ablehnung von ungültigem Eingang an einer Grenze (54 von 72) und Emission in eine andere Sprache (57 von 72; 17 von 39 allgemeinen Eingängen, mit Go als Ziel von 2026 und C als Systemstandard). Minderheiten nehmen eine kanonische Form an (25 von 72), Beispiele oder Tests innerhalb des Programms (21 von 72; 2 von 39), eine schriftliche Spezifikation als autoritative Definition (16 von 72; 14 von 39), deterministische Auswertung als genannte Tor (13 von 72; 3 von 39, unter ihnen Gossamer, Dawn und Wyzer) und Speichersicherheit ohne Sammler (8 von 72; 7 von 39, konvergierend auf präzise Referenzzählung oder Eigentum anstelle von Lebensdauerannotationen, mit Goose's Datenstapeln als Ausreißer [191]). Ein append-only-Log mit Wiederholung (5 von 72; keiner von 39) und hash-identifizierte Definitionen (2 von 72; 3 von 39, Bend, Scrapscript und Dawn [192]) sind selten, und eine Zwischenform als Quelle der Wahrheit fehlt bei den neuen allgemeinen Sprachen. Ein klarer Trend von 2025 und 2026 ist Sprachen, deren Compiler hauptsächlich von Modellagenten geschrieben wurden und als solche offengelegt wurden, unter ihnen Goose, Rue, Cursed und Jolt, deren Leistungsansprüche selbstberichtet sind. Die Designentscheidungen dieses Papers wiederholen sich also dort, wo sie billig sind (ein deklarierter Ausgang für jedes Eingang an der Grenze, Ausgabe in eine Gastsprache) und bleiben selten dort, wo sie Theoreme hier sind (eine kanonische Form, Beispiele als Teil des Programms, Wiederholung aus einem hash-chained Log, namenfreie Identität). Dies ist eine Beobachtung, dass Entscheidungen sich wiederholen und wo; es ist keine Beweis dafür, dass sie korrekt sind, und dieses Paper macht keine Qualitätsgleichvergleiche mit diesen Projekten. Das Emit-Register des Spezifikationsrepositorys nimmt jeden Neuzugang zu denselben Bedingungen wie jede andere Sprache als Ziel und als Quelle auf.
<div id="38-behaviour-equivalence-and-dimension" class="anchor-alias" aria-hidden="true"></div>

### 3.8 Verhalten, Äquivalenz und Dimension

Definition 3 besagt, dass zwei Passungen äquivalent sind, wenn ihre Ausgabesequenzen auf jeder Ereignissequenz übereinstimmen. Dieser Abschnitt verleiht dieser Definition eine universelle Eigenschaft, definiert die Dimension eines Programms als berechnete Zahl und berichtet über die registrierten Messungen davon. Der normative Text ist Abschnitt 6.10 der Spezifikation (Entwurf 0.9, Commit `45fc95c`), mit den Sätzen T57 bis T61 und dem Befehl `rce dim`.

**Verhalten als Punkt in der endlichen Koalgebra.** Fixiere ein Programm $P$ mit Zustandsraum $S$, Ereignisalphabet $E$ und $\delta : S \times E \to S \times O^*$, und schreibe $\delta_1 = \pi_1 \circ \delta$ und $\lambda = \pi_2 \circ \delta$ wie in Definition 1. Das Verhalten eines Zustands $s$ ist die Funktion $\mathrm{beh}_P(s) : E^* \to (O^*)^*$ mit $\mathrm{beh}_P(s)(\varepsilon) = \varepsilon$ und $\mathrm{beh}_P(s)(e \cdot w) = \lambda(s, e) \cdot \mathrm{beh}_P(\delta_1(s, e))(w)$: die Schritt-für-Schritt-Ausgaben entlang jeder Ereignissequenz. $(S, \langle \lambda, \delta_1 \rangle)$ ist eine Koalgebra des Funktors $F(X) = (O^* \times X)^E$; $F$ hat eine endliche Koalgebra $\mathrm{Beh}$, deren Träger die Menge der kausalen Stream-Funktionen ist, und $\mathrm{beh}_P$ ist der eindeutige Koalgebra-Morphismus $S \to \mathrm{Beh}$ (Rutten [144], Satz 2.3). Zwei Passungen sind äquivalent, $F \equiv G$, wenn $\mathrm{beh}_F(s_0^F) = \mathrm{beh}_G(s_0^G)$. Dies ist Definition 3 wiederholt; der neue Inhalt ist, dass $\equiv$ Gleichheit in einem Objekt ist, in das jeder Form, in jeder Passungssprache, durch die gleiche Konstruktion abgebildet wird. Der Verhaltensraum ist keine Mannigfaltigkeit: er trägt die Präfix-Ultrametrik $d(b_1, b_2) = 2^{-n}$, $n$ die Länge der kürzesten unterscheidenden Ereignissequenz, unter der er vollständig und vollständig getrennt ist [145]. Übereinstimmung der Spuren auf jeder Sequenz der Länge höchstens $k$ bestätigt daher $d \le 2^{-(k+1)}$: eine Kugel um das Verhalten, nicht das Verhalten selbst. Das ist, was die Differentialtests von [§5.1](#51-differential-testing-of-the-program-emitters) etablieren, und es kommt nie in einen Hash.

**Zwei Beweismethoden.** Eine Relation $R \subseteq S \times S$ ist eine Bisimulation für $P$, wenn $s\,R\,t$ impliziert, dass für jedes $e$, $\lambda(s, e) = \lambda(t, e)$ und $\delta_1(s, e)\,R\,\delta_1(t, e)$. T58 besagt, dass $\mathrm{beh}_P(s) = \mathrm{beh}_P(t)$ genau dann gilt, wenn eine Bisimulation $s$ und $t$ verknüpft: um zwei Passungen äquivalent zu zeigen, die Relation zu präsentieren; um sie unterschiedlich zu zeigen, eine unterscheidende Sequenz zu präsentieren, die auch den Abstand gibt. T1 und T2 (Vollständigkeit und Determinismus) sind genau die Vollständigkeit und Determinismus, die den minimalen Maschine eindeutig machen; eine unvollständig spezifizierte Maschine hat keine eindeutige Minimum [146].

**Dimension.** $\mathrm{reach}(P)$ ist die Menge der Zustände, die von $s_0$ erreichbar sind; sie ist endlich, weil $S$ unter den Wert- und Größenbeschränkungen der Spezifikation (N9) endlich ist. Die Dimension von $P$ ist

$$\dim(P) = |\{\mathrm{beh}_P(s) : s \in \mathrm{reach}(P)\}|,$$

die Anzahl der unterschiedlichen Verhaltensweisen, in denen $P$ sein kann, was der Nerode-Index seines minimalen Mealy-Automaten [147] ist, berechenbar für ein explizites Alphabet in $n \log n$ [148]. $\log_2 \dim(P)$ sind die Bits des Zustands, die das Verhalten benötigt; $\log_2 |\mathrm{reach}(P)| - \log_2 \dim(P)$ ist die *Redundanz* der Passung, die Bits des Zustands, die keine zukünftige Ausgabe verändern. Eine Steuerdimension $\dim_c(P) \le \dim(P)$ wird auf der Projektion definiert, die jedes Guard über $\Sigma_d$ durch sein Prädikatsymbol ersetzt, ein symbolischer endlicher Automat [149], und seine minimale Maschine, nummeriert durch eine Breitensuche in der kanonischen Ereignisreihenfolge, hat eine eindeutige namenlose Zeichenfolge [150]; ihre SHA-256 über kanonischen JSON ist `shape_ctl`, ein dritter Schlüssel neben dem namenlosen Term-Hash und dem e-Klasse-Schlüssel der Definition 6. Gleichheit bei jedem Schlüssel impliziert Äquivalenz; Ungleichheit impliziert nichts.

Was hier ein Theorem ist und was nicht, sollte klar gesagt werden. $S$ und $E$ sind endlich durch die Wertbeschränkungen und astronomisch groß: $|S| \le 256^{\mathrm{VALUE\_LIMIT}}$ pro Feld, also macht die Endlichkeit jede Verhaltensfrage entscheidbar und keine von ihnen tractabel. Die minimale Maschine ist eine kanonische Form für die endliche Steuerungsprojektion, wo symbolische Automatenminimierung bis auf Prädikatäquivalenz eindeutig ist [149]; für Felder, die nur verglichen und kopiert werden, geben Registerautomaten einen Myhill-Nerode-Satz [151]; der Moment, in dem $\delta$ ganze Zahl-Arithmetik in den Zustand bringt, ist der einzige kanonische Gegenstand der Term selbst. „Jeder Form ist ein endlicher Mealy-Automat, und seine minimale Maschine ist seine kanonische Form“ ist daher für $\Sigma_c$ plus Guard-Prädikate wahr und ist kein berechenbarer Anspruch für $\Sigma_d$. Das ist auch die ehrliche Lesart von Proposition 3: die geringste-Joule-Extraktion gibt den geringsten-Joule-Term *den Extraktor findet*, und drei unterschiedliche Funktionen sind auf einer e-Klasse definiert: die Ziel-Blind-Budget-Einheiten der Spezifikation C.6, die den Budget-Trap auf die gleiche Operation in jedem Laufzeit und nie Joule setzen; `est_j`, die pro Ziel ([§6.3](#63-energy)) ist; und der gehashte Vertreter, der durch Bäumekosten mit einem kanonischen-JSON-Gleichstand für Wiederholbarkeit gewählt wird. Der emittierte Term und der gehashte Term einer e-Klasse können sich unterscheiden; weder kann sich unterscheiden, wenn der gleiche Log gegeben wird.

**Status der Theoreme.** T57 (Endlichkeit: $\mathrm{beh}_P$ ist der eindeutige Koalgebra-Morphismus), T58 (Äquivalenz ist Bisimilitarität), T59 (Spurübereinstimmung bis zur Länge $k$ begrenzt den Abstand durch $2^{-(k+1)}$), T60 (für endliches $S$ ist der Quotient von $\mathrm{reach}(P)$ durch die größte Bisimulation die minimale Maschine, mit $\dim(P)$ Zuständen) und T61 (`shape_ctl` ist unter Umbenennung und unter prädikatäquivalenten Umformungen der Guards invariant) sind in Kapitel 10 der Spezifikation formuliert, und `spec/lean/RCE/Behaviour.lean` ist in `lake build` (Lean 4.12.0; bei öffentlichem Commit `f2bd7222`, `scripts/lean-audit.sh` liest 5,052 Theoreme mit Standardaxiomen nur und kein `sorry`). Was bewiesen wird, im genauen Umfang des Kapitels: die Morphismusgleichung von T57 (`beh_cons`; Eindeutigkeit des Morphismus wird formuliert, nicht bewiesen); T58 für ein Programm und für zwei (`bisim_beh`, `beh_bisim`, `behEq_iff_bisim`, `bisim2_beh`, `beh_bisim2`); und T59 in beide Richtungen über ein explizites endliches Alphabet, die deklarierten Ereignisse über die Grenzmenge, die `rce dim` erkundet (`trace_ball`, `ball_trace`), mit der Aussage über alle $E$ formuliert, nicht bewiesen. T60 wird formuliert, mit einem Modellbeweis durch Partitionserweiterung als nächsten Schritt. T61 wird nur für Umbenennung getestet, gegen die namenlose Projektion `rce fmt nameless`, die ein Programm mit positionellen Namen nach Art in der Reihenfolge der ersten Deklaration druckt und akzeptiert wird, wann immer die Quelle akzeptiert wird, mit den gleichen Spur-Hashes durch T7; ihre Invarianz unter Guard-Umformungen wird formuliert, nicht bewiesen, und der symbolische Quotient wird nicht implementiert.

**`rce equiv`: der Äquivalenz-Check als Werkzeug.** `rce equiv A B` erkundet zwei Programme von ihren Anfangszuständen über die gleichen Ereignisinstanzen, vergleicht jeden Schritt durch seine namenlose Ausgabe (emittierte Werte in positioneller Form, einen beibehaltenen Schritt durch den Deklarationsindex seines Fehlers, T7), verfeinert die beiden Graphen gemeinsam und liest, ob die beiden Anfangszustände in eine Klasse fallen (T58); wenn sie es nicht tun, druckt es die kürzeste unterscheidende Ereignissequenz und die beiden Ausgaben am Ende. `rce change OLD NEW` kombiniert es mit dem Export-Diff von F.4.3 und klassifiziert eine Änderung als Erratum (jeder Export kompatibel, jedes Verhalten behalten), eine Bedeutungsänderung oder eine Schnittstellenänderung, was die Regel von C.15 durch das Werkzeug entscheidet. Als Schritt der kontinuierlichen Integration zwischen jedem Korpusprogramm und seiner namenlosen Projektion ausgeführt, fand der Check ein Programm, dessen Projektion eine Änderung erforderte (ein Zustandsfeld, das wie eine Standardbibliotheksmethode benannt war, hatte die Methode umbenannt); die Projektion wurde korrigiert und der Durchlauf berichtet, dass jede Korpus-Form äquivalent zu ihrer Projektion ist, wie T7 besagt. Es ist die Form-Variante des Äquivalenz-Checks, den das Hardware-Design bei jeder Revision ausführt ([§3.7](#37-the-language-one-text-costs-and-theorem-status)): eine Änderung, unter der jedes Programm sein Verhalten behält, ist ein Erratum, jede andere eine Bedeutungsänderung, entschieden durch das Werkzeug und nicht durch eine Versionsnummer. Mit `rce hash`, das einen Programm-Hash über die namenlose Projektion druckt (ein Hash für ein Programm und seine Umbenennung, einen anderen für einen geänderten Schritt), und der Herkunftszeile, die jede emittierte Datei jetzt trägt, sind die drei Mechanismen, die die Aufzeichnung in neuen Sprachen selten nennt (Abschnitt 3.7), Befehle des Referenzprüfers.

**`rce dim`, und die registrierten Läufe.** `rce dim [control] [fuel n] FILE` erkundet $\mathrm{reach}(P)$ per Breitensuche über die deklarierten Ereignisse mit Nutzlasten, die aus dem Verfeinerungstyp jedes Feldes oder, ohne einen solchen, aus der Grenzmenge der Spezifikation 6.3 gezogen werden, bis zu `fuel` Zuständen, führt dann Hopcroft-Partitionsverfeinerung mit den Ausgaben als Anfangspartition durch (100.000 Zustände in 10 bis 40 s; die erste Moore-Iteration war quadratisch und endete nicht) und berichtet über erkundete Zustände, Verhaltensweisen (exakt, wenn die Grenze nicht erreicht wird, sonst eine untere Schranke), Redundanz in Bits pro Region und mit `control` die Steuerzustände und `shape_ctl`. Drei Beispiele wurden mit bekannten Werten geschrieben: ein Zähler mit einem ungelesenen Flag (1,00 Bit Redundanz), ein mod-6-Zähler, der Parität emittiert (1,58 Bits), und eine Tür mit drei erreichbaren Zuständen und keiner Redundanz. Die Vorregistrierung (`openie-research-experiments/rce/bench/dimension/PREREG.json`, registriert am 22. Oktober 2026, bevor der Befehl gebaut wurde, und vor jedem späteren Lauf mit einem gehashten Sidecar ergänzt) fixiert die Populationen und drei Hypothesen über beschränkte Programme, deren erkundete Schritte emittieren oder den Zustand beibehalten: H0, dass mindestens die Hälfte von ihnen mehr als 0,5 Bit Redundanz trägt; H1, dass ein Programm mit einem Emit-Ort mehr Redundanz trägt als ein Programm mit mehreren; und H2, dass eine Region mindestens 80 % der Redundanz trägt, wenn sie über 1 Bit liegt. Ihr Falsifizierer ist RCE-F6 von [§9](#9-falsifiers), eine Median-Redundanz unter 0,1 Bit. Die hier berichteten Läufe, `dim-r2` bis `dim-r5`, wurden jeweils einmal mit `--fuel 100000 --control` (seit openIE-dev/rce `a5df5be7`, das die Befehlszeile positionell machte, geschrieben als `fuel 100000 control`) gegen einen Build eines öffentlichen Commits von openIE-dev/rce ausgeführt, wobei der Binärhash in jeder Zeile aufgezeichnet wurde; der erste registrierte Lauf, `dim-r1`, und der Pilot davor sind in [§10](#10-work-to-finish) aufgelistet. Das Steuerlabel ist nur der Fehler des beibehaltenen Schritts oder die emittierten Konstruktoren, und $\dim_c \le \dim$ gilt in jeder Zeile dieser Läufe. In einer Zustandsmaschine, deren Beispiele Zustand lesen, den sie nie emittiert, wird die Absicht von den Beispielen und von keiner Ausgabe getragen; ein Bericht von `rce check`, der ein solches `example` nennt (eines, das ein Feld liest, das kein Schritt jemals emittiert oder zum Beibehalten des Zustands nutzt), ist ein offener Vorschlag.

**Die eingefrorenen Läufe.** Der Lauf `dim-r2` vom 23. Oktober 2026 (Commit `1107442b` von openIE-dev/rce, vor dem Lauf als zweite Ergänzung derselben Vorregistrierung registriert, wobei das Stratum aus dem Schlüssel gelesen wurde, den `rce dim` bei diesem Commit als `observable` meldete, heute `has_output`) zieht das ausgabentragende Stratum nach Regel: jedes Programm des zusammengeführten Repositorys unter seinen Beispielen, Programmen, Anwendungen und Buchlistings, das eigenständig akzeptiert wird, einen Zustandsbereich hat und eine Emit- oder Fail-Anweisung enthält. Das sind 25 Programme, 24 davon ausgabentragend, 14 innerhalb von 100.000 Zuständen beschränkt. Unter ihnen hat `ring_buffer` 12.500 erreichbare Zustände, 781 Verhaltensweisen und fünf Steuerzustände; vier Bits seines Zustands verändern keine Ausgabe, alle in einem Bereich, und seine Steuerprojektion, die nur verzeichnet, welche Schritte feuern, hat fünf Zustände. Der Ausschluss der drei für `rce dim` geschriebenen Programme und ihrer Buchkopien lässt 8 beschränkte ausgabentragende Programme übrig, von denen 6 mehr als 0,5 Bit tragen (Wilson-95-%-Intervall 0,41 bis 0,93), mit einer Median-Redundanz von 1,79 Bit (Interquartilsabstand 0,25 bis 3,37); über alle 14 sind es 10 von 14 (0,45 bis 0,88) und ein Median von 1,29 Bit. RCE-F6 (ein Median unter 0,1 Bit) wird nicht ausgelöst; das untere Ende des Intervalls liegt unter der Hälfte, sodass H0 bei dieser Größe gestützt, aber nicht etabliert wird. H1 wird nicht gestützt (die beiden Programme mit einem Emit-Ort tragen 1,58 und 4,00 Bit, die beiden mit mehreren Orten 2,51 und 3,65), und H2 gilt auf 8 von 9 qualifizierten Zeilen nur deshalb, weil 8 einen einzigen Zustandsbereich haben; das eine Zweibereichsprogramm weist 62 % seiner Redundanz seinem größeren Bereich zu. Die inhaltliche Ergänzung des Laufs sind drei Messungen auf Anwendungsgröße. Die Chat-Anwendung erkundet 100.000 Zustände mit 176 Verhaltensweisen und 69 Steuerzuständen, sodass mindestens 9,15 Bit ihres Zustands keine Ausgabe verändern, die größte gemessene Redundanz und eine untere Schranke; die selektive Weiterleitungseinheit (40.218 Zustände, 7.038 Verhaltensweisen, 2,51 Bit) und das Terminal (3.390 Zustände, 270 Verhaltensweisen, 3,65 Bit) sind exakt. Das Verhältnis von Steuerzuständen zu Verhaltensweisen variiert über die Population um eine Größenordnung (5 zu 781 für den Ringpuffer, 69 zu 176 für den Chat, 5.095 zu 7.038 für die Weiterleitungseinheit), was misst, wie viel vom Verhalten eines Programms darin besteht, welche Schritte feuern gegenüber welche Werte fließen. Der Lauf zeigt auch, dass das Stratum eine feinere registrierte Regel benötigt: das Flag des Werkzeugs ist wahr für ein Programm, dessen jede Ausgabe dieselbe ist (eine Konstante oder ein beibehaltener Schritt, den jeder Zustand liefert), sodass ein dritter Lauf vor der Stichprobenziehung „ausgabentragend, mit mehr als einer unterschiedlichen Ausgabe“ registrieren sollte. Zeilen, Intervalle und die Ergänzung liegen im Experiment-Repository unter `rce/bench/dimension/` (`results/dim-r2.jsonl`, `RESULTS.md`). Ein dritter Lauf, `dim-r3` (23. Oktober 2026, zuvor registriert), wandte die feinere Regel an, die der zweite Lauf gefordert hatte: `rce dim` meldet die Anzahl unterschiedlicher Ausgaben (`distinct_outputs`; emittierte Werte und beibehaltene Schritte werden getrennt als `emits` und `keeps` gezählt), und das Stratum ist ausgabentragend mit mindestens zwei davon. Auf 28 Programmen (die Population des zweiten Laufs plus die drei akzeptierten Programme mit zwei oder mehr Zustandsbereichen) sind 22 streng ausgabentragend und 12 davon beschränkt; die Median-Redundanz beträgt 1,29 Bit (8 von 12 über 0,5 Bit, Wilson 0,39 bis 0,86) und 2,05 Bit über die 6, die nicht für das Werkzeug geschrieben wurden. Die drei Programme, die die feinere Regel entfernte (ein Thermostat, ein Rekonziliator und ein Warenkorb), sind jeweils nur durch eine Konstante beobachtbar, sodass die Mediane des zweiten Laufs Bits gezählt hatten, die eine Ausgabe verändern, die sich überhaupt nie ändert. H2 wird dort getestet, wo es möglich ist, auf dem einen streng ausgabentragenden Mehrbereichsprogramm über 1 Bit, dessen größerer Bereich 62 % trägt, unterhalb der 80-%-Schwelle; es bleibt auf einer Zeile offen. Ein vierter Lauf über die 86 Konformitätsprogramme mit Zustand (zuvor registriert) maß die fünf gewonnenen Host-Vertrags-Programme zum ersten Mal, alle innerhalb des `fuel` beschränkt und mit 0,01 Bit (der Terminal-Treiber) bis 2,16 Bit (der Kanal-Treiber) bei Steuerquotienten in den Tausenden, und beantwortete die Mehrbereichsfrage für diesen Korpus: die einzigen streng ausgabentragenden Mehrbereichsprogramme sind datenunterschiedene Kopien eines Fähigkeitsbeispiels, sodass H2 aus bestehendem öffentlichem Material nicht entschieden werden kann und der nächste Schritt das Verfassen beobachtbarer Mehrbereichsprogramme ist, die vor dem Lauf als Population registriert werden. Dieser Schritt erfolgte am 24. Oktober 2026: zwölf Zweibereichsprogramme (ein Aufzug, ein Getränkeautomat, eine Kreuzung, ein Parkhaus, ein Drucker, eine Lobby, eine Bankkarte, eine Waschmaschine, eine Sitzung, ein Player, ein Klimaregler und ein Reservoir) wurden in den Programmkorpus geschrieben und als fünfter Lauf registriert, mit der Offenlegung, dass das Werkzeug auf den Entwürfen gelaufen war. Alle zwölf sind streng ausgabentragend, beschränkt und in Millisekunden erkundet; elf haben null Redundanz und das zwölfte, der Klimaregler, hält 1,58 Bit in zwei Flags, die seine letzte Aktion aufzeichnen und die nichts liest. Der Median beträgt 0,00 Bit, sodass RCE-F6 auf dieser Population ausgelöst wird: zufälliger Zustand ist nicht üblich in kleinen Forms, deren Obergrenzen durch beibehaltene Schritte durchgesetzt werden und deren Phasen emittieren. Zusammen mit den früheren Läufen gelesen (1,29 Bit über die streng ausgabentragenden handgeschriebenen Beispiele, 0,01 bis 2,16 Bit für die Host-Programme, mindestens 9 Bit für die Chat-Anwendung), wächst die Größe mit der Programmgröße und mit der Anzahl der Felder, die nichts liest. Der Anspruch, den die Daten stützen, ist der des Falsifizierers selbst: `rce dim` ist ein Diagnoseinstrument für größere Programme und für Bereiche, die ohne Beobachter hinzugefügt werden, nicht eine Eigenschaft kleiner Forms im Allgemeinen.

**Der Konzept-Record.** Spezifikation 6.6 beschreibt jetzt eine unhashierte Seiten-Tabelle, die durch die namenlosen Schlüssel eines Programms indiziert ist und seine Namen, Absichtsstrings und Dokumentkommentare hält, und `rce emit form` druckt sie unter `names`, indiziert durch Deklarationsindex (den Index, den `shape_ctl` verwendet), nach den gehashten Feldern. Projektionen rendern sie; $\delta$ liest sie nie; sie ist das Komplement, das die Projektion eines Forms zu einem symmetrischen Lens [123] macht, nicht zu einer Retraktion. Die Beweise von [§2.1](#21-programming-is-coding-theory) sagen, dass die Tabelle den Konzept, den ein Name steht für, und nicht nur seine Schreibweise, halten muss, weil Wortwahl und Reihenfolge die beiden Schritte sind, bei denen Entwickler sich bei 6,9 % [137] nicht einigen, und der Schritt, bei dem sie sich einigen, ist der Konzept. Ob ein Modell sich von dem Form mit dem Record angehängt sowie von einer benannten Oberfläche ableiten kann, ist der erste der drei registrierten Experimente von [§12.3](#123-why-human-written-code-is-redundant) und ist offen.
<div id="4-the-engine-gears-gate-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## 4. Die Engine: Gänge, Tor und Belege

Dieser Abschnitt beschreibt das Design der Engine, das Appendix D der Spezifikation und deren Vorschläge definieren.

<div id="41-the-engine-is-a-form" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Die Engine ist eine Form

RCE führt Software als Graph kleiner deterministischer Handler aus. Ein Handler, der keine Entscheidung treffen kann, löst eine Eskalation aus. Ein Resolver beantwortet die Eskalation einmal, und die Antwort wird als permanenter Handler installiert, sodass der nächste Fall desselben Typs ohne Resolver läuft. Das Design erfordert, dass die Engine jede Form-Invariante erfüllt:

| Invariante | Was das Design von der Engine erfordert |
|---|---|
| Reload ist eine verifizierte Faltung | Reload liest den Log wörtlich, berechnet jede Hash- und Verknüpfung erneut und faltet den Rest mit $\delta$. Nichts wird erneut gestempelt. Eine beschädigte Kette wird nicht geladen. |
| Namensfreie Tick-Reihenfolge | Handler laufen in topologischer Reihenfolge, dann nach einem namensfreien Knotenschlüssel. Ausgaben werden gesteuert und nachdem alle Handler abgelaufen sind, geliefert, wie in ASM-Semantik. Das Umbenennen jedes Knotens ergibt denselben anonymen Zustandshash an jedem Eingang. |
| Kein stiller Verlust | Ein voller Posteingang hält die Nachricht in einer geordneten Warteschlange und protokolliert `Backpressure`, und jede Aufgabe schließt dennoch. |
| Nutzlasten sind im Log | Eingaben, Ticks, Ergebnisse externer Handler, Installationen und Fehler sind Log-Einträge. Der Zustandshash nach jedem Eintrag stimmt mit einer Faltung aus einer leeren Engine überein. |
| Logische Uhr | Lebendigkeit zählt Ticks, nicht die Wanduhrzeit. |
| Stabile Hashes | SHA-256 (Secure Hash Algorithm, 256-Bit) über kanonischen JSON, Schlüssel an jeder Tiefe sortiert, für Einträge, Zustände, Formen und Regel-IDs. |

<div id="42-the-gears" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Die Gänge

Jeder Gang wird nur dann versucht, wenn der Gang darunter das Tor nicht passiert. Diese Reihenfolge ist eine feste Kaskade.

| Gang | Methode | Abstammung |
|---|---|---|
| G0 Lookup | Eine gemeinsame Handler-Bibliothek, nach SHA-256-Form-Hash indiziert; für Code-Reparatur, Lokalisierung auf gerankte Funktionen | Code-Suche und -Abruf [21] |
| G1 Regeln | Deterministische, geschützte Reparaturvorlagen und schema-abgeleitete Validatoren, jeweils auf Mutationsempfindlichkeit geprüft | PAR, TBar, AVATAR, FixMiner [22, 23, 24, 25]; Codemods wie Coccinelle [26] |
| G2 Synthese | Aufzählung über die Handler-Grammatik, Solver und e-Graphen | Sketching, SyGuS, egg [27, 9, 12] |
| G3 bis G5 Modelle | Ein typisiertes Entscheidungsmodell, ein lokales kleines Modell, dann zuletzt ein entferntes Modell | Modellkaskaden [28] |

Die Reihenfolge folgt einem Grundsatz: die erste Regel der Automatisierung besteht darin, einen manuellen Prozess zu haben, der funktioniert. Ein Modell lohnt sich erst auf Basis einer manuellen Variante der Aufgabe oder einer deterministischen automatisierten Variante, die bereits funktioniert. Daher laufen die exakten Gänge G0 bis G2 zuerst, und ein Modell greift nur auf dem Restbestand ein, den sie offen lassen, indem es Änderungen vorschlägt, die dasselbe Tor beurteilt. Wird reduziert, was ein stochastisches Modell leisten muss, wird sein Aktionsraum kleiner und damit leichter zu beherrschen. Die öffentliche Form dieser Leiter ist `rce repair` von [openIE-dev/rce](https://github.com/openIE-dev/rce), und sie hat drei Läufe in [openie-research-experiments](https://github.com/openIE-dev/openie-research-experiments), jeweils vor ihrer Ausführung registriert. Die ersten beiden führten vier Sprossen aus (Wiederverwendung, Suche nach Typ, die Umformungen, die `rce fmt` bestimmt, und beschränkte Aufzählung einer kleinen Änderung, höchstens 2000 Kandidaten). Der erste [225] schloss 118 von 120 Aufgaben mit null Modellaufrufen, aber 119 der 120 waren Operator- und Ganzzahl-Literal-Mutationen, die eine beschränkte Aufzählung konstruktionsbedingt umkehrt, und 9 der Abschlüsse bestehen die Beispiele und Prüfungen, ohne das ursprüngliche Programm zu sein. Der zweite [226] enthält keine solche Mutation. Von seinen 151 Aufgaben schloss er 31 (20,5 %) mit null Modellaufrufen: 1 von 41 Änderungen aus der Git-Historie von openIE-dev/rce, von denen 39 Sprachänderungen folgen und nur 2 Programmfehler sind; alle 27 Guard-Negationen, jeweils durch die Aufzählungsänderung, die ein `not` entfernt, was diese Mutation konstruktionsbedingt umkehrt; und 3 von 83 Umbenennungen, keine davon auf das Original wiederhergestellt. Ohne die Guard-Negationen schließen 4 von 124 Aufgaben. Die Vorhersage P3 des zweiten Laufs schlug fehl und sein Falsifizierer F1 trat ein: die Abschlussrate des ersten Laufs überträgt sich nicht auf reale Historie. Der dritte [227] führte die 151 Aufgaben des zweiten Laufs unverändert bei openIE-dev/rce `8a5d90ea` aus, mit einer fünften Sprosse nach der beschränkten Aufzählung: Umbenennungen, bei denen eine Verwendung eines Wertnamens zu einem anderen dort gültigen Wertnamen wird oder eine Bindung zu einem Namen wird, den der Bericht des Prüfers nennt, höchstens 2000 Kandidaten. Seine Registrierung hält fest, dass Umbenennungen die Klasse sind, für die diese Sprosse nach dem zweiten Lauf gebaut wurde. Im einfachen Arm, dem nur die Aufgabe gegeben wurde, schloss die Leiter 111 von 151 (73,5 %) mit null Modellaufrufen, davon 103 auf das Original wiederhergestellt: alle 83 Umbenennungen (80 auf der fünften Sprosse, 3 durch beschränkte Aufzählung), 77 wiederhergestellt; alle 27 Guard-Negationen, jeweils mit ihrem Ergebnis aus dem zweiten Lauf; und 1 der 41 Historienaufgaben, dieselbe. Ohne die Guard-Negationen schließen 84 von 124 Aufgaben. Ein Known-Good-Arm gab der Leiter zusätzlich das ursprüngliche Programm jeder Aufgabe: er schloss 116 von 151, 114 wiederhergestellt, darunter alle 83 Umbenennungen wiederhergestellt und 6 der 41 Historienaufgaben. Seine Vorhersage P6, dass jede Guard- und Historienaufgabe im Known-Good-Arm ihr Ergebnis aus dem einfachen Arm beibehält, schlug fehl: 5 weitere Historienaufgaben schließen, und die im einfachen Arm geschlossene Aufgabe schließt auf der fünften Sprosse statt auf der dritten. Die Leiter schließt die Mutationsklassen, die ihre Sprossen umkehren, und 1 von 41 Änderungen aus realer Historie, sodass der Restbestand, auf dem ein Modell handeln würde, nahezu jeder reale Defekt ist.

<div id="43-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Das Tor

Ein Kandidat wird nur dann befördert, wenn er das Tor passiert. Das Tor spielt die aufgezeichneten Eingaben des Knotens erneut ab, führt den Kandidaten im Schatten auf frischen Proben mit einer Abdeckungsgrenze (das Gesetz der drei bei einem deklarierten Fehlerbudget) aus, überprüft das Ausgabeschema und erfordert das Beweiszertifikat von Abschnitt 5. Ein Kandidat, der nicht besteht, wird mit seinem Gegenbeispiel protokolliert.

![Diagramm. Vier Getriebeboxen gestapelt von günstigsten zu teuersten: G0 Lookup, ein gemeinsamer Handler-Repository, der nach SHA-256 Form-Hash sortiert; G1 Regeln, geschützte Reparaturvorlagen und schema-abgeleitete Validatoren; G2 Synthese, Aufzählung über die Handler-Grammatik, Lösungsalgorithmen und e-Graphen; G3 bis G5 Modelle, ein typisierter Entscheidungsmodell, ein lokales kleines Modell und ein entferntes Modell, als Vorschlagender markiert. Jedes Getriebe sendet seinen Kandidaten an ein Tor mit fünf Prüfungen: Wiederholung der aufgezeichneten Eingaben, Schattenlauf auf frischen Proben mit einer Abdeckungsgrenze, Prüfung des Ausgabeschemas, das Zertifikat der Modellprüfung des Kernels mit Kani, einem Modellprüfer für Rust, und für Umformungen eine zufällige Prüfung gefolgt von einem Beweis durch den Z3 SMT-Solver. Ein Pass befördert den Kandidaten zu einem gespeicherten Handler, der G0 versorgt; ein Fehlschlag wird mit seinem Gegenbeispiel protokolliert und eskaliert zum nächsten Getriebe.](/figures/rce/gears-gate.svg)

*Abbildung 4. Modelle schlagen vor, Prüfer entscheiden. Diagramm: Getriebe laufen in Reihenfolge der Kosten: G0 Lookup, G1 Regeln, G2 Synthese, G3 bis G5 Modelle (ein typisierter Entscheidungsmodell, ein lokales kleines Modell, dann ein entferntes Modell). Jeder Kandidat geht durch dasselbe Tor: Wiederholung der aufgezeichneten Eingaben des Knotens, Schattenlauf auf frischen Proben mit einer Abdeckungsgrenze, Prüfung des Ausgabeschemas und das Zertifikat der Modellprüfung des Kernels mit Kani, einem Modellprüfer für Rust (Abschnitt 5.3); ein vorgeschlagener Umformung benötigt auch eine zufällige Prüfung und anschließend einen Beweis durch den Z3 SMT-Solver (Abschnitt 5.2). Ein Kandidat, der besteht, wird befördert und schließt dieselbe Form bei G0 beim nächsten Mal; einer, der fehlschlägt, wird mit seinem Gegenbeispiel protokolliert und der nächste Getriebe wird versucht. Im Design ändern sich die Kani-Harnesses und die SMT-Kodierung nicht durch Beförderung. Quelle: Abschnitte 2.2, 4.2, 4.3, 4.6, 5.2 bis 5.5. Eine [PNG-Kopie](/figures/rce/gears-gate.png) wird bereitgestellt.*
<div id="44-receipts" class="anchor-alias" aria-hidden="true"></div>

### 4.4 Belege

Jede Beförderung, jeder Tor-Fehlschlag, jede Zurückstellung und jede Installation ist eine Mutation in einem append-only-Log, das mit SHA-256 verkettet ist, also bricht jede Manipulation eines früheren Eintrags die Kette [29, 30]. Die Kosten jedes Handlers werden aus der Anzahl der Interpreteroperationen mit einer pro-Host-Kostentabelle berechnet und tragen die Bezeichnung `est_j`. Der Aufseher ist der Auflöser von Eskalationen der Engine, der die Gänge der Reihe nach auf jeder Eskalation ausführt, und jeder seiner Aufrufe trägt einen Beleg. Ein Beleg nennt den Gang, die Methode der Schätzung (`basis`), die ausprobierten Kandidaten und ob der Gang die Eskalation gelöst hat. Sein Feld `est_j` ist erforderlich: es ist eine endliche nicht-negative Zahl oder `null`, und `null` ist nur erlaubt, wenn `basis` `unpriced` angibt, wie bei einem Modellaufruf ohne Energieangabe. Ein Beleg ohne dieses Feld ist nicht parsierbar. Unbepreiste Kosten werden nie als null gelesen, sodass eine Summe über Belege ihre bepreisten und unbepreisten Aufrufe getrennt ausweist und eine Einsparung, die von einer unbepreisten Lösung abhängt, als unbekannt gemeldet wird.

![Diagramm. Oben: drei Log-Einträge, seq 0, 1 und 2, jeweils mit Feldern seq, event, prev_hash, state_hash und hash. Der erste prev_hash besteht aus 64 Nullen; jeder spätere prev_hash entspricht dem hash des vorherigen Eintrags, dargestellt als Pfeile. state_hash ist der SHA-256 des Zustands nach dem Schritt; hash ist der SHA-256 des kanonischen JSON von event, prev_hash, seq und state_hash. Unten: ein Gang-Beleg mit Feldern gear, gear_name, est_j, basis, candidates_tried und resolved, neben der Regel, dass est_j erforderlich ist und entweder eine endliche nicht-negative Zahl oder null ist, wobei null nur erlaubt ist, wenn basis `unpriced` sagt; eine unpreisgegebene Kosten wird nie als 0 J gelesen.](/figures/rce/receipt-chain.svg)

*Abbildung 5. Der Log ist eine Hash-Kette; jede Kosten trägt eine Basis. Diagramm: Einträge des dauerhaften Logs D sind `{seq, event, prev_hash, state_hash, hash}`. `state_hash` ist der SHA-256 des kanonischen JSON des Zustands nach dem Schritt; `hash` ist der SHA-256 des kanonischen JSON von `{event, prev_hash, seq, state_hash}`; der erste `prev_hash` besteht aus 64 Nullen, also verändert das Verändern eines früheren Eintrags jeden späteren Hash. Ein Gang-Beleg trägt `gear`, `gear_name`, `est_j`, `basis`, `candidates_tried` und `resolved`. `est_j` ist erforderlich und ist eine endliche nicht-negative Zahl oder `null` nur, wenn `basis` `unpriced` sagt; Modellauftrag-Belege tragen `est_uj` in Mikrojoule unter der gleichen Regel. Eine unpreisgegebene Kosten wird nie als 0 J gelesen. Hash-Bezeichnungen sind symbolisch. Quelle: Spezifikation 6.1 und Abschnitt 4.4. Ein [PNG-Abbild](/figures/rce/receipt-chain.png) wird bereitgestellt.*

<div id="45-the-form-compiler" class="anchor-alias" aria-hidden="true"></div>

<div id="45-the-compilers" class="anchor-alias" aria-hidden="true"></div>

### 4.5 Die Compiler

Der Compiler der Sprache ist `rce emit TARGET FILE` des Referenzprüfers (Spezifikation 10.5). Er übersetzt ein Modul, das `rce check` besteht, in eine von fünf Ausgaben: `form`, die Form $P = (S, E, \delta, D, \lambda)$ als eine Zeile kanonischen JSONs, eine deterministische Funktion des Programmtexts; und vier Programme, `rust` (eine Rust-Quelldatei), `python` (eine Python-3-Datei), `js` (ein JavaScript-Modul für Node) und `scala` (eine Scala-3-Datei für die Java Virtual Machine). Die Programmemitter übersetzen das geprüfte Modul, nicht die Form, und jede Ausgabe ist eigenständig. Jedes Ziel wird generiert. Keines wird von Hand verfasst.

Spezifikation 6.3 legt ein Verhalten an jedem numerischen Rand fest, das jedes Ziel reproduzieren muss: geprüfte Ganzzahl-Arithmetik fängt Überläufe des statischen Typs ab und wickelt nie; Ganzzahl `/` schneidet auf Null zu ($-7/2 = -3$); `%` nimmt das Vorzeichen des Dividenden ($-3 \bmod 2 = -1$); Division durch Null fängt ab; Gleitkommazahlen sind IEEE 754 binary64, korrekt gerundet einmal pro Operator, und ein nicht-endliches Ergebnis fängt ab; Zeit ist allein die logische Uhr.

Im Entwurf der Engine senkt ein zweiter Compiler eine Handler-Spezifikation und ihre Passung über einen e-Graphen in eine Form-IR ab und projiziert sie auf weitere Ziele; sein Test wird in [§10](#10-work-to-finish) aufgelistet.
<div id="46-method-the-whole-stack-evaluated-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 4.6 Methode: der gesamte Stack bewertet, jede Schnittstellenannahme explizit

Ein Programm ist ein Stack von Ebenen: Token und Anweisungen; Handler; die Form, eine einzelne Schrittfunktion $\delta : S \times E \to S \times O^*$ über $S = \Sigma_c \times \Sigma_d$ (Steuerungsbereiche; Daten: die Uhr, die Eingangszahl und typisierte Relationen); der Log, eine SHA-256-Hashkette, deren Einträge jedes Ereignis, den Hash des Zustands, den es erzeugte, und den Hash des vorherigen Eintrags aufzeichnen; die Umformungen, die die Form transformieren; und das Substrat, das sie ausführt. Jede Ebene beruht auf Annahmen über die Ebene darunter. RCE behandelt keine Ebene als fest. Es bewertet den gesamten Stack, schreibt jede Schnittstellenannahme als überprüfbare Aussage nieder und überprüft sie bei jedem Lauf.

| Grenze | Annahme | Überprüfung |
|---|---|---|
| Quelle zu Handler | eine Eingabe erfüllt ihren Quellvertrag | die Vertragsprüfung beim Eingabeereignis von δ |
| Handler zu Senke | jede Ok-Ausgabe erfüllt das Ausgabeschema | Handler-Beweis: Auswertung durch den Kernel-Evaluator, von dem das Design verlangt, total und deterministisch zu sein, und den es mit einem Modellprüfer prüft ([§5.3](#53-model-checking-of-the-kernel)) |
| Log zu Zustand | jeder Eintrag trägt den Hash des Zustands, den er erzeugte | Kernel-Faltung, die beim ersten Eintrag anhält, dessen Hash nicht übereinstimmt, und ihn meldet ([§5.3](#53-model-checking-of-the-kernel)) |
| Umformung zu Form | eine Umformung bewahrt die Ausgabe für jede Eingabe | zufällige Prüfung, dann ein SMT-Beweis ([§5.2](#52-the-proof-rule-for-rewrites)) |
| Stub zu Foreman | ein Handler, der keine Entscheidung treffen kann, eskaliert statt zu raten | Stub-Handler emittieren Eskalationen; Lösungen werden nur über den Beförderungspfad befördert |
| Form zu Ziel | jedes emittierte Ziel berechnet denselben δ | jedes Ziel trägt dieselbe Referenzspur |

Ein fehlgeschlagener Test lokalisiert den Bruch an der Grenze, an der er auftritt. Die Korrektur wird an dieser Ebene vorgenommen, durch die Überprüfung der Grenze weitergeleitet und gefördert. Jede Ebene über der korrigierten Ebene erbt die Korrektur ohne weitere Änderung, da jede Ebene über der korrigierten Ebene die korrigierte Ebene nur über die Schnittstelle konsumiert, deren Annahme jetzt überprüft wird. Dies ist der Sinn, in dem Korrekturen nach oben tragen und sich verketten.

<div id="5-verification" class="anchor-alias" aria-hidden="true"></div>

## 5. Verifikation

<div id="51-five-targets-one-trace" class="anchor-alias" aria-hidden="true"></div>

<div id="51-differential-testing-across-five-targets" class="anchor-alias" aria-hidden="true"></div>

<div id="51-differential-testing-of-the-program-emitters" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Differenzieller Test der Programmerzeuger

T9-L besagt, dass die Programmerzeuger `rust`, `python` und `js` mit dem Referenzevaluator übereinstimmen. Für den Rust-Erzeuger wird dies auf einem Kern bewiesen, als verifizierte Übersetzung in MiniRust, eine tief eingebettete Teilmenge des emittierten Rusts; dass `rustc` MiniRust implementiert, wird vertraut und getestet. Für die Python- und JavaScript-Erzeuger wird es getestet: das emittierte Programm muss die Referenzspur jedes Beispielprogramms Byte für Byte ausgeben, was das Tor ist, das jede Zeile des Emit-Registers passiert ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). Der Referenzevaluator und die emittierten Rust-, Python- und JavaScript-Laufzeiten berechnen zudem dieselbe Budgetfunktion, und ein Test prüft, dass der Budget-Abbruch in allen vieren auf dieselbe Operation fällt ([§3.7](#37-the-language-one-text-costs-and-theorem-status)); die ordnungserhaltende ANF-Passage vor jedem Erzeuger wird auf jedem Ziel differenziell getestet, einschließlich eines Durchlaufs der Budgets über den Abbruchpunkt (Satz T34). Dies ist differenzieller Test im Sinne von McKeeman und Csmith [86]: Übereinstimmung unter unabhängigen Implementierungen auf einem angegebenen Eingabesatz. Es ist nicht Übersetzungsvalidierung [85], und außerhalb des bewiesenen Kerns des Rust-Erzeugers ist es kein verifizierter Compiler. Es sagt nichts über Eingaben außerhalb des getesteten Satzes.

<div id="52-rewrites-proved-in-z3" class="anchor-alias" aria-hidden="true"></div>

<div id="52-the-proof-rule-for-rewrites" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Die Beweisregel für Umformungen

Verifizierte Umformungsregeln haben eine Abstammung. Ruler schließt und überprüft Umformungsregeln durch Gleichheitssättigung ohne Modell im Kreis [87]. Die vom Modell vorgeschlagene Umformung, die in Abschnitt 5.5 zugelassen wird, wiederholt eine Regel, die die Engine bereits hatte, also ist dieser Eintrag eine Aussage über das Tor, das 15 von 18 Vorschlägen nicht zuließ, und kein Anspruch, dass ein Modell eine gute Quelle für Regeln ist.

In der Gestaltung der Engine muss jede e-graph-Umformung im Z3 SMT-Solver [31] bewiesen werden, gegen eine quantorenfreie Kodierung der Auswertung und Arithmetik des Form-Begriffs: Werte als Datentyp, 64-Bit-Bitvektoren mit überprüftem Überlauf, signierte Division und Rest mit dem Vorzeichen des Dividenden und binäre64-Floating-Points. Eine Umformung, die Überlauf, Eskalationsreihenfolge oder eine Nachricht ändert, erhält keinen Beweis. Eine vorgeschlagene Äquivalenz gelangt in den e-graph nur mit einem Beweis.

<div id="53-kani-proofs-of-the-kernel" class="anchor-alias" aria-hidden="true"></div>

<div id="53-model-checking-of-the-kernel" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Modellprüfung des Kernels

Das Design überprüft den Kernel der Engine (Hashkette, Faltung, namenfreie Positionen und Handlerbewertung) mit dem Kani-Modellprüfer für Rust [32]. Die Handlerbewertung ist der Fixpunkt eines nicht rekursiven Schritts, sodass ein Beweis dafür, dass der Schritt total und deterministisch pro Konstruktor ist, durch strukturelle Induktion auf die Bewertung übertragen wird. Das Design nennt zehn Eigenschaften, jeweils einen Harness:

| Harness | Eigenschaft |
|---|---|
| `chain_appended_verifies` | Eine angehängte Hashkette wird überprüft |
| `chain_detects_tampering` | Ein geänderter Eintrag bricht die Kette |
| `fold_equals_replay` | Die Faltung entspricht der Wiederholung |
| `fold_rejects_wrong_state` | Eine Faltung, die vom gespeicherten Zustand abweicht, schlägt fehl |
| `position_is_name_independent` | Regelnpositionen hängen nicht von Knotennamen ab |
| `reason_tokens_are_name_independent` | Gründe sind namenfrei durch ganze Token |
| `handler_core_leaves` | Blatt-Handler sind total und deterministisch |
| `handler_core_validate` | Validierung ist total und deterministisch |
| `handler_core_pipeline` | Pipelines sind total und deterministisch |
| `handler_core_ifhas` | Wächter sind total und deterministisch |

<div id="54-promotion-gate-on-the-proof-certificate" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Commit-Tor für das Beweiszertifikat

Im Design schreibt die Modellprüfung ein Zertifikat, dessen Hash mit der Engine gespeichert wird. Die Engine, der Log, Regel-IDs und die Handlerbewertung laufen durch den Kernel, und die Beförderung erfordert das Zertifikat.

<div id="55-the-model-as-a-proposer-behind-the-check" class="anchor-alias" aria-hidden="true"></div>

### 5.5 Das Modell als Vorschlagender hinter der Prüfung

Ein Modell kann Äquivalenzen vorschlagen. Es kann sie nicht zulassen. Ein lokales 1,5-Milliarden-Parameter-Codierungsmodell wurde als Vorschlagender auf der Spezifikation `orders-form` ausgeführt, und das öffentliche Protokoll der Ausführung ([`rce/bench/results/llm-proposer-form-demo.form.json`](https://github.com/openIE-dev/openie-research-experiments/blob/main/rce/bench/results/llm-proposer-form-demo.form.json)) enthält 18 Vorschläge, 13 davon unterschiedlich. Das Protokoll nennt die Quelle jedes Vorschlags nur als `llm`; das Modell, Qwen2.5-Coder-1.5B unter llama.cpp, wird in diesem Paper und in keinem öffentlichen Protokoll benannt. Die Prüfung ließ 15 Vorschläge nicht zu, 12 davon unterschiedlich: vier, die nicht geparst werden können, zwei, die einen Wert dorthin setzen, wo ein Term hingehört, und neun Vertauschungen arithmetischer Operatoren, von denen jede durch ein Gegenbeispiel als falsch erwiesen wurde, auf dem die beiden Seiten unterschiedlich scheitern. Die 3 zugelassenen sind eine einzige Umformung, `(pipe pass ?a) => ?a`, unter drei Namen, und diese Umformung wiederholt eine Regel, die die Engine bereits hatte. Das Protokoll zeigt, wie das Tor aufhält, was falsch ist; es zeigt keine neue Regel vom Modell.

<div id="6-lift-entering-the-ecosystem-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

## 6. Hebung: Eintreten in das Ökosystem aus anderen Sprachen

<div id="6-importing-legacy-code-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

Hebung ist die Tür in das Ökosystem für anderswo geschriebenen Code. Sie ist eine Konstruktion, die pro Sprache aus Werkzeugen gebaut wird, die jede Sprache bereits besitzt: einer formalen Grammatik, einem Parser wie [tree-sitter](https://tree-sitter.github.io/tree-sitter/), der den Syntaxbaum liefert, dem abstrakten Syntaxbaum und den Symbolen, die das Language-Server-Tooling auflöst ([Language Server Protocol](https://microsoft.github.io/language-server-protocol/)). Das Engine-Profil spezifiziert eine Hebung, `rce scan DIR --form`, die die Form aus diesem Baum für Rust, Python, TypeScript und Go erstellt und jedes gehobene Element als unbewiesen kennzeichnet (Anhang D.8). Ein gehobenes Programm trägt die Fehler seiner Quelle, also schließt Hebung Reparatur ein, und das Protokoll unten misst Reparatur auf öffentlichen Fehlerkorpora bei gegebener Position.

<div id="60-the-repair-ladder-on-lifted-code" class="anchor-alias" aria-hidden="true"></div>

<div id="60-the-repair-ladder" class="anchor-alias" aria-hidden="true"></div>

### 6.0 Die Reparaturleiter

<div id="23-per-rung-ladder-results" class="anchor-alias" aria-hidden="true"></div>

Eine Codierungsaufgabe wird hier durch die **Absichtsbits** gemessen, die sie benötigt: die Bits, die von außen geliefert werden müssen, da die Engine sie nicht bereits besitzt (das Programm um die Änderung, die Bibliotheken, die Tests, der Index der bekannten Korrekturen). Mit $H_{task}$ bezeichnen wir die Bits, die das Zielobjekt festlegen, und mit $H_{corpus}$ die Bits, die der Korpus bereits bereitstellt. Die gelieferten Bits sind $I = H_{task} - H_{corpus}$. Ein Gang, der die richtige Änderung unter seinen Kandidaten auf Platz $r$ anordnet, liefert $\log_2 r$ Bits der Suche, und das Tor liefert den Rest. Die Leiter ordnet die Aufgaben nach der Größe der Änderung, einem objektiven Proxy für $I$: ein Token (L0), eine Anweisung (L1), ein Hunk (L2), mehrere Hunks in einer Datei (L3), mehrere Dateien (L4), eine Funktion aus einer Spezifikation oder Tests (L5), eine Änderung auf Ebene von Issues (L6) und ein Programm aus einer Spezifikation (L7). Die Sprossen, Korpora, Aufteilungen und Hypothesen sind vorregistriert; die Dateien befinden sich im [öffentlichen Repository](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

L2 bis L4 werden auf einem zurückgehaltenen Datensatz von Defects4J ([Abschnitt 8.1](#81-defects4j)) gemessen, und L5 bis L7 unter den Protokollen von [Abschnitt 8.2](#82-swe-bench-lite-offline). Die Methode und das Tor von L0 und L1 folgen.

**Methode.** Jedes Korpus wird mit einem festen Seed gemischt. Die ersten 2.000 Positionen jeder Mischung, sowie für L0 drei ganze Repositorys (commons-lang, requests, flask), bilden die Entwicklungsaufteilung, auf der die Gänge abgestimmt werden können; Ergebnisse der Entwicklung werden nicht gemeldet. Jede verbleibende Aufgabe ist in der Testaufteilung. Vor einem Testlauf wird der Löser kommittiert und sein Binärhash aufgezeichnet, und während des Laufs ändert sich kein Gang, so dass jede zu meldende Zeile ein Ergebnis eines eingefrorenen Lösers auf Testaufgaben mit 0 Modellaufrufen ist. Die Vorregistrierung (`PREREG.json`) und das Meldescript befinden sich im [öffentlichen Repository](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

**Tor.** Bei L0 und L1 wird die Position gegeben und das Tor ist Token-Identität: die reparierte Zeile oder Anweisung muss Token für Token mit der des Entwicklers übereinstimmen. Dies ist strenger als das Bestehen der Tests, da ein Patch eine schwache Testsuite durchlaufen und dennoch falsch sein kann. Qi und Kollegen fanden heraus, dass die meisten Patches, die GenProg als Korrekturen meldete, plausibel, aber falsch waren [92]; Überanpassung an Tests wird in suchbasierten und semantikbasierten Reparaturmethoden dokumentiert [93, 94] und mit generierten Tests adressiert [95]; Tools erzielen höhere Bewertungen auf den Benchmarks, auf denen sie abgestimmt wurden [96]; und Fehlerlokalisierung verfälscht Vergleiche [97]. Token-Identität beseitigt die Plausibilitätslücke auf diesen Sprossen, und das Geben der Position entfernt den Lokalisierungsterm, sodass die Rate allein die Reparaturgänge misst. L2 und höher verwenden die Tests als Tor und melden plausible und korrekte Zahlen getrennt (Abschnitt 8.1).

<div id="61-l0-one-token-faults" class="anchor-alias" aria-hidden="true"></div>

### 6.1 L0: Fehler mit einem Token

Das L0-Korpus umfasst alle PIT-ähnlichen Mutanten [109] mit einem gültigen Ersatztoken in realen Repositorys an festgelegten Commits, fünf Java (commons-math, commons-collections, jsoup, joda-time, gson) und vier Python (click, attrs, pydantic, sympy), mit vier Repositorys, die nie für die Abstimmung verwendet wurden (commons-text, commons-io, more-itertools, httpx), als zweiten Testdatensatz. Mutanten sind ein Ersatz für reale Fehler mit einem Token, die Just und Kollegen mit realen Fehlern verknüpft fanden [110]. Wenn die Nachbarschaft, die einen Fehler mit einem Token wiederherstellt, aus denselben Operator-Tabellen besteht, die die Mutanten erzeugten, spiegelt ein hoher Rate teilweise diese Überschneidung und nicht die Reparaturfähigkeit auf Fehler wider, die in der Praxis auftreten. Eine einfache Operator-Inversion-Suche, die auf denselben Mutanten durchgeführt wird, ist die Baseline, die zeigt, wie viel des Rates die Überschneidung erklärt, und ein L0-Rate wird neben ihr gelesen.

<div id="62-l1-one-statement-bugs-from-real-histories" class="anchor-alias" aria-hidden="true"></div>

### 6.2 L1: Einzelanweisungsfehler aus realen Historien

L1 verwendet zwei öffentliche Datensätze mit realen Einzelanweisungskorrekturen, die aus offenen Quellhistorien abgebaut wurden: ManySStuBs4J 2.0 [107] für Java und TSSB-3M v1.0.0 [108], Schichten 14 und 15, für Python. Der Löser erhält entweder nur den 7-Zeilen-Hunk oder die ganze Datei am Elterncommit, mit Indizes der Methoden des Projekts und Schutzbedingungen, und die beiden werden als separate Zeilen gemeldet. Diese Datensätze haben keine veröffentlichte Reparaturleaderboard unter diesem Tor (nur Hunk, Token-Identität, Position gegeben), also wird keine gelernte-Reparatur-Zahl neben ihnen gesetzt; Defects4J, der einen hat, wird mit TBar in Abschnitt 8.1 verglichen.
<div id="63-energy" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Energie

Im Protokoll trägt jede Zeile der Leiter `est_j`, eine Schätzung von Zentralprozessor (CPU)-Sekunden mal 10 W, und eine Unterstichprobe soll auf RAPL [105], dem On-Chip-Paketzähler des Prozessors, als `reported_j` gelesen werden: das Paketdelta über den gesamten Lauf, abzüglich der Leerlaufleistung aus einer unmittelbar zuvor genommenen Stichprobe, mal der Dauer des Laufs. `measured_j`, ein Wandmessgerät an einer benannten Schiene, folgt dem Protokoll von Abschnitt 8.3. Auf öffentlichem Code wurde noch kein `reported_j`- oder `measured_j`-Wert erzeugt; der Neuaufbau ist in [§10](#10-work-to-finish) aufgeführt.

**Zwei Regime und ein kalibrierter Vektor.** Die oben genannte Schätzung, CPU-Sekunden mal 10 W, ist eine Substrattabelle und kann keine Ziele unterscheiden, daher wählt die Extraktion mit geringsten Joule nie ein Ziel aus. Die Literatur zu Messungen sagt, wie die Korrektur aussehen muss. Auf einem in-order-Core sind Joule linear in der Anzahl der Operationen: ein Sechs-Zähler-Modell auf Cortex-M0 erreicht R² ≈ 0,99 und einen mittleren absoluten Fehler von 2,8 bis 4,3 %, mit Koeffizienten wie 0,96 nJ pro Anweisung und 2,1 nJ pro genommener Verzweigung [152]. Auf einem out-of-order-Core kollabiert das Modell auf die Zeit: mit einem festgelegten Core und ausgeschaltetem Turbo zog ein Xeon Gold 6430 189,8 ± 0,5 W über jede Implementierung und jeden Benchmark einer Sprach-Energie-Replikation, und die Rangliste, die Python bei 75,88-mal C platziert hatte, verschwand, sobald Bibliothekswahl, Parallelität, Aufwärmen und Messfehler kontrolliert wurden [153]. Die Zähler selbst haben unterschiedlichen Wert: Intel RAPL prognostiziert die Steckdosenleistung mit einem mittleren absoluten prozentualen Fehler von 1,8 %, sobald DRAM eingeschlossen ist, aktualisiert sich aber etwa jede Millisekunde und driftete auf einer Generation um 10 bis 12 % mit der Pakettemperatur [105]; Abfragen schneller als 10 ms führen zu bis zu 50 % veralteten Messwerten [154]; NVIDIAs NVML tastet etwa ein Viertel der Laufzeit ab und einzelne naive Läufe wiesen gegenüber einem externen Messgerät Fehler von bis zu 70 % auf [155]. Gas-artige Einheitenmessung korreliert mit der CPU-Zeit auf Ethereum nur bei Pearson ≈ 0,51 [156], also ist „Energie skaliert mit den gezählten Operationen“ eine Annahme, die die Unterstichprobe `reported_j` testen muss. Ein Vorschlag an die Spezifikation hält drei Objekte getrennt: die Budgeteinheiten aus C.6 bleiben deterministisch, zielblind und im Log; `est_j` wird zu $\langle \mathrm{count}(\mathit{term}), E[\mathit{target}] \rangle$ plus Leerlaufleistung mal Zeit in Regime A (Mikrocontroller, Field-Programmable Gate Array (FPGA)-Lanes, in-order-Cores) und $P_{\mathrm{active}} \cdot t + E_{\mathrm{llc}} \cdot \mathit{misses}$ in Regime B (out-of-order-CPUs und Grafikprozessoren (GPUs)); und der Koeffizientenvektor $E[\mathit{target}]$ ist ein `host.Calibrated`-Logeintrag mit seinem Protokoll, seiner Stichprobenanzahl und dem Standardfehler pro Koeffizient, geschrieben von `rce host calibrate` unter einem normativen Protokoll (mindestens 30 verschachtelte A/B-Paare gegen die Leerlaufbasislinie, Blöcke von mindestens 60 s oder $10^9$ Operationen, Aufwärmen verworfen, Temperatur aufgezeichnet, Brutto und Netto gemeldet, das Messgerät mit seiner Validierungsreferenz benannt, RAPL nicht schneller als 10 ms abgetastet), sodass die Extraktion unter `est_j` eine Funktion des Logs ist und wiederholt werden kann. Belege erhalten einen `calibration`-Hash und eine `stale_fraction`, den Anteil der Operationen eines Schritts ohne kalibrierte Zeile, bewertet als `unpriced`; Summen halten die vier Bezeichnungen in getrennten Spalten. Der Falsifizierer ist RCE-F5 in [§9](#9-falsifiers). Die erste durchzuführende Kalibrierung ist die KV260-Sprosse der Energieleiter auf ihrer Core-Schiene mit $N \ge 30$, was den Platzhalter `E_LUT_READ = 1e-12` J, eine OpCounter-Konstante aus [Gemessene Commit-Tore](/papers/gates/), die in der RCE-Spezifikation nicht enthalten ist, in einen Koeffizienten mit Standardfehler überführt. Nichts davon ist gebaut: auf main enthält `host.Calibrated` Fabric, Operationsklasse, Overhead und Durchsatz für die Platzierung, nicht Joule, und ein Befehl `rce host calibrate` existiert nicht.
<div id="7-reuse-evidence" class="anchor-alias" aria-hidden="true"></div>

## 7. Wiederverwendungsbelege

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

Jede Zeile ist eine Eingabe für die Engine. Clone und Dedup besagen, dass eine Passung normalerweise existiert, was G0 ist. Wiederkehrende Korrekturen besagen, dass Anpassung hauptsächlich ein kleiner Katalog von geschützten Umformungen ist, was G1 ist. Zeileniveau-Redundanz verkleinert den Suchraum von G2. Die Reparaturleiter von Abschnitt 6 ist das Protokoll, das dies in großem Maßstab auf zurückgehaltenen Aufteilungen misst. Zwei Warnungen schärfen die Lesung. Duplikate vergrößern Retrieval und Modellscores, es sei denn, sie werden entfernt [104]. Und fehlerhafte Zeilen sind weniger natürlich als korrigierte [45], also ist der Fehler selbst der Fall, der am wenigsten vorhergesagt werden kann; die Korrekturform, nicht die fehlerhafte Zeile, ist es, worauf G0 und G1 sich stützen müssen. Die Regel-Mining-Linie, die dies in großem Maßstab tut, von GenProgs Generate-and-Validate-Suche [88] und Prophets gelerntem Korrektheitsmodell [89] bis zu Getafix bei Facebook [90] und Soralds modellfreier Reparatur von statischen Analyseverstößen [91], leitet Vorlagen aus disjunkter Historie ab und berichtet Präzision auf ungesehenen Fällen [98]. Das ist der Standard, den Abschnitt 8.4 übernimmt.

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

Promotion ist der Mechanismus, durch den das Modell den Kreis verlässt: ein Resolver wird für einen neuen Fall einmal bezahlt, das Tor lässt die Passung als Handler zu, und jeder spätere Fall derselben Form schließt sich in G0 oder G1 ([Abschnitt 4.2](#42-the-gears)). Konvergenz ist der Anspruch, dass die Modellaufrufe pro Runde auf null fallen bei einer festen Spezifikation unter Live-Verkehr. Es wird wie folgt gemessen.

1. Zeichnen Sie mindestens 1.000 Spezifikationen aus öffentlichen Repositories, stratifiziert nach Sprache und Größe, und einfrieren Sie die Engine und den Resolver vor der ersten Runde.
2. Wiederholen Sie aufgezeichneten Produktionsverkehr, mindestens 10.000 Ereignisse pro Spezifikation, in Runden fester Größe.
3. Protokollieren Sie pro Runde: neue Eskalationen, Modellaufrufe, Beförderungen, Zurückstellungen und Joule pro geschlossener Aufgabe, jeweils mit Bezeichnungen (`est_j`, `reported_j`, `measured_j`).
4. Primärer Endpunkt: der Anteil der Spezifikationen, die innerhalb von 20 Runden eine Runde mit null Modellaufrufen erreichen, mit einem 95-%-Wilson-Intervall. Sekundär: Modellaufrufe pro geschlossener Aufgabe nach Runde sowie die Runde des letzten Modellaufrufs.
5. Melden Sie Spezifikationen, die nie konvergieren, mit ihrem Grund (ein blockierter Eingang, eine fehlende Abhängigkeit, neue Absicht), und führen Sie die Zurückstellung blockierter Eingänge als vorregistrierten Arm durch.

**Aussage 8 (untere Grenze-Ansatz).** Mit wachsender Abdeckung von G0 und G1 nähern sich die Joule pro gelöster Aufgabe der Gold-Untergrenze an, bei der ein bekannter Fix angewendet und die Tests durchgeführt werden. Die Leitersprossen und die Defects4J-Reserve-Gruppe unter der Wandmessung testen es.

<div id="87-lift-coverage-across-languages" class="anchor-alias" aria-hidden="true"></div>

### 8.7 Abdeckung der Hebung über Sprachen

<div id="87-coverage-of-real-programs-across-languages" class="anchor-alias" aria-hidden="true"></div>

Hebung wird gemessen, während sie gebaut wird. Für Sprache $L$ zählt ein Programm als gehoben, wenn $\pi_L(\lambda_L(p))$ die eigenen Tests des Programms besteht und seine aufgezeichneten Spuren Byte für Byte wiederholt, und $\lambda_L(\pi_L(\lambda_L(p)))$ denselben Form-Hash wie $\lambda_L(p)$ hat. Jeder Durchlauf nimmt jedes Programm festgelegter öffentlicher Korpora für mindestens zehn Sprachen, wobei der Heber eingefroren und sein Binärhash vor dem Durchlauf aufgezeichnet wird, und mit 0 Modellaufrufen. Jeder Durchlauf listet pro Sprache jedes gehobene Programm und jedes noch nicht gehobene Programm samt dem Konstrukt auf, das es aufhält, und jedes noch nicht gehobene Konstrukt ist ein Arbeitselement für den Heber dieser Sprache, gebaut und eingefroren vor dem nächsten Durchlauf. Das Ziel ist jedes Programm in jeder Sprache.
<div id="9-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 9. Falsifizierer

Festgelegt vor den Läufen, die sie testen.

| ID | Beobachtung | Widerlegt |
|---|---|---|
| RCE-F0 | Ein Programm, im Repository oder beim Eintritt in dieses, dessen emittiertes Programm (Rust, Python, JavaScript oder Scala) eine Spur ausgibt, die sich von seiner Referenzspur unterscheidet, oder eine fehlerhafte Eingabe, die den Zustand verändert | Die Aussage, dass Projektionen treu sind und dass fehlerhafte Eingaben beim Eintritt niemals den Zustand verändern |
| RCE-F1 | Auf dem zurückgehaltenen Datenschnitt lösen G0 bis G2 mit eingefrorenen Regeln unter 10 % der Aufgaben mit 0 Modellaufrufen | Die Aussage, dass die meisten Passungen für Reparaturen in dieser Größenordnung bereits existieren |
| RCE-F2 | Byteidentische oder gleichwertige Patches machen weniger als die Hälfte der gelösten zurückgehaltenen Aufgaben aus | Die Lesart des Tors als mehr als Plausibilität auf den abgedeckten Aufgaben |
| RCE-F3 | Unter dem Wandmessgerät überschreiten die Brutto-Joule pro gelöster Aufgabe des RCE-Lösers die der günstigsten Modell-Baseline auf den Aufgaben, die beide lösen | Die Aussage eines geringeren Energieaufwands pro gelöster Aufgabe auf den abgedeckten Aufgaben |
| RCE-F4 | Im Konvergenzprotokoll von Abschnitt 8.6 erreichen weniger als die Hälfte der Spezifikationen ohne blockierende Eingabe innerhalb von 20 Runden eine Runde mit null Modellaufrufen | Das Herauskompilieren des Modells aus dem Kreislauf |
| RCE-F5 (registriert am 22. Oktober 2026) | Auf der Unterstichprobe der Leiter unter dem Wandmessgerät von Abschnitt 8.3, mit einem Eintrag `host.Calibrated` für den Host, liegt das pro-Ziel-R² von `reported_j` auf dem Zählvektor C.6 in Regime A unter 0,8, oder `est_j` weicht in Regime B im Median um mehr als 25 % ab | Die Aussage, dass die kalibrierte Schätzung ein nutzbarer Ersatzwert ist; die Basis des Belegs für diesen Host wird `unpriced`, bis ein besseres Modell kalibriert ist |
| RCE-F6 (registriert am 22. Oktober 2026) | In der registrierten Dimensionsmessung von Abschnitt 3.8 liegt die Median-Redundanz über beschränkte, ausgabentragende Programme (das Stratum, das die registrierten Läufe beobachtbar nennen) unter 0,1 Bit. Status, 24. Oktober 2026: ausgelöst auf der verfassten Zweibereichspopulation des fünften Laufs (Median 0,00 Bit über zwölf Programme), nicht ausgelöst auf den handgeschriebenen Beispielen (1,29 Bit, dritter Lauf) oder den Host-Programmen (0,46 Bit nach Familie, vierter Lauf) | Die Aussage, dass zufälliger Zustand in kleinen Forms in dieser Größenordnung häufig ist; `rce dim` ist dann ein Diagnoseinstrument nur für große Programme, was der Lesart entspricht, die Abschnitt 3.8 jetzt gibt |
<div id="10-work-to-finish" class="anchor-alias" aria-hidden="true"></div>

## 10. Arbeit zum Abschließen

Für jeden Punkt ist das zugehörige Protokoll benannt.

1. Hebung gebaut und gemessen über mindestens zehn Sprachen unter dem Protokoll von Abschnitt 8.7.
2. Der Spezifikationsarm: Spezifikationen im Stil von MBPP und HumanEval als Forms verfasst und an jedes Ziel emittiert.
3. Zurückgehaltene Ergebnisse auf L2 bis L4, auf dem zurückgehaltenen Defects4J-Datensatz, der gemäß der registrierten Regel von Abschnitt 8.1 gezogen wurde, und auf L5 bis L7 (Abschnitt 8.2).
4. Baselines in einer Tabelle, Kosten des Bestehens in Joule und Dollar (Abschnitt 8.5).
5. Eine `measured_j`-Reihe: ein Wandmessgerät auf einem ruhenden Host, mindestens 10 Wiederholungen, Brutto und Netto nebeneinander (Abschnitt 8.3).
6. Die 626-Sprachen-Umfrage veröffentlicht mit ihrer Methode (Abbildung 1).
7. Neue zurückgehaltene Korpora mit eingefrorenen Gängen: Multi-SWE-bench und BugsInPy (Abschnitt 8.4).
8. Konvergenz von Modellaufrufen über mindestens 1.000 Spezifikationen (Abschnitt 8.6).
9. T60, T61 und T59 über ganz $E$ bewiesen (T60 durch mechanisierte Partitionsverfeinerung), und T62 von seinem Modell mit der Reihenfolge des Admitters verknüpft (Abschnitt 3.8).
10. Der T7-Befund zu `state_hash` ist gelöst (Abschnitt 3.6) und `RCE/Positional.lean` beweist, dass die positionelle Einbettung, die der Prüfer hasht, unter den Umbenennungen aus Spezifikation 10.6 für jede Hashfunktion unverändert bleibt. Was bleibt, ist eine Verfeinerung vom Lean-Modell zum Rust-Prüfer selbst, was das Tor von Phase 2 in Abschnitt 13 ist.
11. Eine blind registrierte Dimensionspopulation (Programme, die ohne den Benchmark im Sinn geschrieben oder gehoben wurden), groß genug, um H2 über die beiden Zeilen hinaus zu testen, die es derzeit tragen; die registrierten Läufe an öffentlichen Commits verzeichneten RCE-F6 als ausgelöst auf einer Population und nicht auf den anderen (Abschnitt 3.8).
12. Die drei vorregistrierten Experimente von Abschnitt 12.3: Modellgenauigkeit auf der namenlosen Form mit und ohne Konzeptaufzeichnung; die Vertauschungsrate benachbarter Anweisungen in gehobenem Code; und ob durch Wiederholung zertifizierte, umkehrbare Löschung die 20-%-Löschungsbaseline verschiebt.
13. Der erste `host.Calibrated`-Eintrag, auf der KV260-Sprosse mit $N \ge 30$, und die Regression, die RCE-F5 testet (Abschnitt 6.3).
14. Form-IR-Format 2 (inhaltsadressierte Definitionen) als einziges Format festgelegt, sodass die 77 Bausteine der Standardbibliothek, die allein aufgrund der Termgröße eine Änderung erfordern, abgesenkt werden, und die Rundreisebedingung hash(lift(emit(F))) = hash(F) pro Ziel bei $N = 10{,}000$ geprüft wird (Abschnitt 13).
15. Der Eingabevertrag des Referenzprüfers, sodass jede Eingabe beim Eintritt ein deklariertes Ergebnis hat (Abschnitt 1). Bei öffentlichem Commit `d91a9fc8`, und weiterhin bei `0c015c43`, verwerfen `rce run` und `rce host run` ein Nutzlastfeld, das das Ereignis nicht deklariert, und wenden das Ereignis an, und speichern ein Feld falschen Typs, sofern die Arithmetik des Schritts daran nicht abbricht. Unter dem Vertrag lassen ein nicht deklariertes Ereignis, ein fehlendes, zusätzliches oder falsch typisiertes Feld sowie ein verschachtelter Wert den Zustand jeweils unverändert, und das Ergebnis wird protokolliert (T8); das Protokoll von Abschnitt 2.3 testet dies bei großem N.

<div id="56-brownfield-agreement" class="anchor-alias" aria-hidden="true"></div>

**Ergebnisse im Neuaufbau auf öffentlichem Code.** Die Engine hat die untenstehenden Ergebnisse erzeugt. Jedes wird vor der Aufnahme in dieses Papier auf öffentlichem Code neu aufgebaut: der Code an einem markierten öffentlichen Commit, eine vor dem Lauf versiegelte Registrierung, veröffentlichte Zeilen pro Aufgabe und ein Befehl, der die Zusammenfassung aus einem sauberen Klon reproduziert (die erste Phase des Programms in [§13](#13-programme-of-work-and-its-gates)).

| Ergebnis | Protokoll in diesem Papier | Neuaufbaupfad |
|---|---|---|
| Die Testanzahl der Engine (`cargo test --release` und die Gesamtzahl von `make check`) sowie das Lean-Audit an einem Engine-Commit | §3.7 | Verifikationszahlen an einem öffentlichen Commit: die Tests des Referenzprüfers, `lake build` und das Lean-Audit, die Spezifikationsprüfung und die WebAssembly-Prüfungen, mit einer Lauf-ID der kontinuierlichen Integration |
| Der Pilot vom 22. Oktober 2026 und der erste registrierte Dimensionslauf, `dim-r1` (77 Programme aus `spec/examples/` und `rce-examples`), beide erstellt an Commits, die nicht öffentlich sind | §3.8 | Dieselbe Population erneut mit `rce dim` an einem öffentlichen Commit ausgeführt |
| Modellprüfung des Kernels: zehn mit Kani 0.67.0 verifizierte Harnesses, ihre Prüfzahlen und das Zertifikat, das die Beförderung erfordert | §5.3, §5.4 | Kani auf einem öffentlichen Kernel-Crate, das Log, Faltung und Positionscode des Prüfers aufrufen, mit den zehn Harnesses und einem gespeicherten Zertifikat |
| Das Ökosystem-Ergebnis auf generierten Forms: verlustfreie Kodierung, deterministische und treue Projektion, das Tor am Eingang für Eingaben und für Spezifikationen | §2.3 | Ersetzt durch die Prüfungen pro Programm aus §2.3, jeweils ausgeführt wie in §2.3 angegeben; die Prüfung, dass zwei Emissionen dieselben Bytes liefern, ist `tests/emit_deterministic.rs` |
| T9-F: der Form-Compiler der Engine (`rce form`) und seine fünf Ziele (Rust, WebAssembly, Python, XState, SCXML), die auf den Rand- und Seed-Ereignissen einer Elf-Operatoren-Spezifikation die Referenzspur ausgeben | §3.7 | Ein differenzieller Test der öffentlichen Emitter auf registrierten Rand- und Seed-Ereignissen |
| Die Z3-Beweise der eingebauten e-Graph-Umformungen der Engine und der deterministische Vorschlagende von 87 vertrauten Identitäten | §5.2 | Ein öffentliches Umformungstor: ein Referenzevaluator für Form-IR-Terme, eine SMT-LIB-Kodierung mit einem `unsat`-Ergebnis pro Umformung und Negativkontrollen sowie die in der Registrierung aufgeführten Identitäten |
| Die Form-Invarianten von §4.1, geprüft durch benannte Engine-Tests, die Verkettung von Eskalationen auf der Referenz-Arbeitslast von Aussage R2 und die Browser-Demonstration der Engine | §2.4, §4.1 | Das Engine-Profil, Tor, Beförderung und Belege in öffentlichem Code, gebaut aus Anhang D |
| Die Ein-Token-Reparaturraten (L0) auf neun Repositorys und auf vier, auf denen nie abgestimmt wurde, mit den Median-Suchbits und der Aufschlüsselung der ungelösten Fälle | §6, §6.1 | Die Sprossen der öffentlichen Vorschlagsleiter (§4.2: deterministische Sprossen zuerst, ein Modell nur auf dem Restbestand), ausgeführt auf dem L0-Protokoll, mit der Operator-Inversion-Baseline daneben |
| Die Ein-Anweisungs-Reparaturraten (L1) auf ManySStuBs4J 2.0, nur Hunk und ganze Datei, und auf TSSB-3M, mit den Raten pro Kategorie | §6, §6.2 | Die L1-Gänge als Sprossen derselben öffentlichen Leiter, auf dem L1-Protokoll |
| Übereinstimmung der Hebung mit dem ursprünglichen Code auf Rust-, Python-, TypeScript- und Go-Fixtures | §6 | Öffentliche Hebungen pro Sprache, ausgeführt auf frisch geschriebenen Fixtures |
| Übereinstimmung von drei Sales-Outreach-Programmen, neu formuliert als Forms, mit ihren aufgezeichneten Eingaben sowie die `est_j`-Änderung unter Extraktion | §6 | Die Programme als Sprachmodule geschrieben und gegen die öffentlichen aufgezeichneten Eingaben wiederholt |
| `est_j` pro gelöster Aufgabe auf der Leiter und die RAPL-Unterstichprobe | §6.3 | `est_j` aus den neu aufgebauten Leiter-Läufen und `reported_j` auf einem Host mit RAPL |
<div id="11-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 11. Schlussfolgerung

RCE ist konstruktionsbedingt ein natives Code-Ökosystem. Ein Programm wird einmalig, aus Absicht, als Form verfasst: eine verlustfreie Kodierung von Zustand, Ereignissen und reinen Übergängen, von der jede Zielsprache eine Projektion ist, die ihre Spur wiederholen muss. Jeder Zustand, in dem sich ein Programm befinden kann, wird in seiner Form deklariert, und ein Ereignis, das nicht greift, behält den Zustand bei (Satz T8), sodass ein Programm im Ökosystem nicht von seiner Absicht abdriftet und keine nachträgliche Differenzbildung oder Fehlerverfolgung benötigt. Die Sprache ist eine schriftliche Spezifikation an einem Commit. Der Referenzprüfer implementiert sie und emittiert Rust, Python, JavaScript und Scala; die Spezifikation verzeichnet den Beweisgrad jedes Satzes exakt; und die Dimension eines Programms ist eine berechnete Zahl, gemessen in registrierten Läufen an öffentlichen Commits, die RCE-F6 auf einer Population auslösten und auf den anderen nicht. Im Entwurf der Engine wird jede Passung, die das Tor passiert, gespeichert und wiederverwendet, und das Ökosystem verkettet sich unter einem Tor, dessen Korrektheit monoton ist (Aussage R1). Code aus anderen Sprachen tritt durch Hebung ein, eine Konstruktion von der Grammatik jeder Sprache zu ihrem Syntaxbaum und zur Form. Abschnitte 3.6 und 8.7 formulieren die Universalitätsaussagen und wie ihre Konstruktion gemessen wird, Abschnitt 9 nennt die Beobachtungen, die die Ansprüche widerlegen würden, und Abschnitt 10 listet die verbleibende Arbeit auf, einschließlich der Ergebnisse der Engine, die auf öffentlichem Code neu aufgebaut werden.

<div id="12-the-form-against-the-record" class="anchor-alias" aria-hidden="true"></div>

## 12. Die Form im Vergleich zur Aufzeichnung

Dieser Abschnitt stellt die Form drei Beweiskörpern gegenüber: der Theorie und den Werkzeugen jedes Bereichs, den das Design berührt, der Geschichte des Programmiersprachendesigns, gelesen als Vergleich zwischen dem, was jede Sprache festlegt und was sie frei lässt, und den gemessenen Ursachen der Redundanz in menschlich geschriebenem Code. Jeder Unterabschnitt beschreibt, was die Belege zeigen, mit ihrer Quelle, und dann die Position, die dieses Papier einnimmt, samt der Begründung. Wo eine Position ein Urteil und kein gemessenes Ergebnis ist, sagt der Text dies ausdrücklich. Die drei Umfragen hinter diesem Abschnitt wurden im Oktober 2026 durchgeführt; ihre vollständigen Texte und Arbeitsnotizen sind im Experiment-Repository veröffentlicht ([openie-research-experiments/rce/surveys](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/surveys)). Der letzte Unterabschnitt stellt die Planung brechender Änderungen bei Sprachen in der Entwicklung der Regel gegenüber, der RCE folgt; er stützt sich auf eine kürzere Web-Umfrage von Ende Oktober 2026, deren Quellen direkt dort zitiert werden.
<div id="121-seven-areas-of-the-design" class="anchor-alias" aria-hidden="true"></div>

### 12.1 Sieben Bereiche des Entwurfs

**Kanonische Formen.** Für eine vollständige, deterministische Maschine über einem endlichen Alphabet ist die minimale Maschine bis auf Isomorphie eindeutig, und eine festgelegte Traversierungsreihenfolge verwandelt dies in eine eindeutige Zeichenfolge [150]. Die Form liefert Vollständigkeit und Determinismus (T1, T2), also hat die Projektion auf den endlichen Steueranteil aus [§3.8](#38-behaviour-equivalence-and-dimension) eine kanonische Form. Der Datenanteil nicht: symbolische endliche Automaten haben ein kanonisches Minimum bis auf Prädikatäquivalenz [149], Registerautomaten über Gleichheit oder dichter Ordnung gestatten ein Myhill-Nerode-Theorem [151], und ein durch Ganzzahl-Arithmetik aktualisierter Zustand hat keinen kanonischen Repräsentanten außer dem Term selbst. Die Extraktion aus einem e-Graphen unter einer Kostenfunktion, die gemeinsame Unterterme nur einmal berechnet, ist NP-schwer und nicht bis auf einen konstanten Faktor approximierbar [159], also muss ein gehashter Repräsentant eine Kostenfunktion verwenden, die über Extraktoren hinweg reproduzierbar ist. Position: drei Formschlüssel, von denen jeder seine Schicht in der gehashten Eingabe benennt (der namenlose Term-Hash, die Steuerform von [§3.8](#38-behaviour-equivalence-and-dimension) und der e-Klassen-Schlüssel mit seinem Sättigungsbudget); Äquivalenz einmalig definiert, als Bisimulation; geschützte Schrittkörper zuerst geprüft durch das nahezu lineare Entscheidungsverfahren der geschützten Kleene-Algebra mit Tests [158]. Nicht übernommen: jede Behauptung, die minimale Maschine sei *die* kanonische Form einer Form mit arithmetischem Zustand; ein gehashter Repräsentant, gewählt über Kosten gemeinsamer Unterterme. Offen: für welches Fragment gleiche Bedeutung gleiche Steuerform impliziert (die Umkehrung von T61).

**Inhaltsadressierte Zwischenrepräsentation.** Unisons fünfjährige Erfahrung mit hash-identifizierten Definitionen verdichtete sich auf eine Invariante, dass der Hash die Semantik abdeckt und niemals Namen, und auf einen Kostenpunkt, das erneute Hashen Abhängiger bei Änderungen [160]; Dhall hasht die Normalform einer totalen Sprache [161]; Nix' Versuch, Build-Ausgaben inhaltsadressiert zu machen, blieb fünfzehn Jahre lang experimentell, weil Selbstreferenzen und Nichtdeterminismus ihn brachen [162]. Position: Definitionen indiziert durch den Digest des α-gelöschten, normalisierten Körpers, mit Namen, Quellpositionen und Literalschreibweisen in einer ungehashten Tabelle, die von den Projektionen gerendert wird; ein einziger Emitter, der die Zwischenrepräsentation über eine pro-Ziel-Tabelle durchläuft und vier Emitter ersetzt, die die Oberflächensyntax durchlaufen; jede serialisierende Laufzeit gegen die Vektoren des kanonischen JSON geprüft. Nicht übernommen: kanonisches JSON als gehashte Bytes durch RFC 8785 zu ersetzen (das keine Ganzzahl getrennt von einer Gleitkommazahl, keine negative Null und keine exakte vorzeichenlose 64-Bit-Ganzzahl darstellen kann) oder durch deterministisches CBOR (dessen zwei Spezifikationen bei Gleitkommabreite und Schlüsselreihenfolge voneinander abweichen); inhaltsadressierte emittierte Artefakte als Identität; vollständige β-Normalisierung vor dem Hashen, da eine rekursive Funktion dann keinen endlichen Term hat. Offen: Schlüssel auf Komponentenebene für wechselseitige Rekursion.

**Der Log als partielle Ordnung.** Eine Spur im Sinne von Mazurkiewicz ist ein Wort modulo der Vertauschung unabhängiger Ereignisse, und alle Linearisierungen einer Konfiguration lesen dieselbe Spur ab. Der Satz über Konsistenz als logische Monotonie besagt, welche Programme keine Koordination benötigen [19], und seine Erweiterung auf Lesevorgänge besagt, dass Beobachtungen konvergenten Zustands unsicher sind, sofern sie nicht schwellenwertförmig sind [82]. Position: ein Eintrag des Logs gehasht über seine Kette, Sequenznummer, das Ereignis und die Hashes der Einträge, die er kausal beobachtet hat, wobei der Zustandshash nur an Schnitten aufgezeichnet wird, sodass der Digest unter jeder von der Semantik zugelassenen Linearisierung gleich ist; das Monotonie-Merkmal auf Lesevorgänge erweitert; jeder genommene Zweig eines kettenübergreifenden `select` im Log protokolliert. Der Satz, dass jede mit den Abhängigkeiten konsistente Ordnung zum selben Schnittzustand faltet (T62), ist auf einem Modell bewiesen und ist ein Vorschlag, kein normativer Text. Nicht übernommen: einem Ziel zu erlauben, die Linearisierung eines nicht-monotonen Ereignisses zu wählen. Offen: die Erweiterung des Modellbeweises auf den vollständigen Evaluator.

**Synthese aus Absicht.** Ein Verifizierer prüft nur Korrektheit: eine Nachbedingung, die immer wahr ist, verifiziert. Die Vollständigkeit einer Spezifikation muss gemessen werden, und das Maß, das funktioniert, ist der Anteil mutierter Ausgaben, den die Spezifikation zurückweist; das Entfernen dieses Maßes aus dem Tor senkte in der Studie, die es einführte, die Verifizierbarkeit auf 1,56 % [164]. Typgeleitete Aufzählung über gleichheitsbeschränkten Baumautomaten erhöhte den gelösten Anteil eines Bibliothekssuch-Benchmarks von 64 % auf 88 % [165], und Selbstverfeinerung sowie Mehrheitsabstimmung rechtfertigen ihre Kosten selten, sobald die Kosten pro korrektem Ergebnis berücksichtigt werden [166]. Position: Absicht als Programm mit Lücken, die Verpflichtungen, Beispiele, eine benannte Menge nutzbarer Definitionen und ein Budget tragen; eine Regel, unter der eine Absicht, deren Verpflichtungen kein Verhalten ausschließen, eine Änderung erfordert; eine gemessene Vollständigkeit, die mit jeder Absicht ausgewiesen wird; ein Ableitungsprotokoll pro Lücke, das die Kandidaten vor und nach jeder Prüfung angibt. Nicht übernommen: Beförderung nach Punktzahl; Verfeinerungsschleifen innerhalb eines Modellaufrufs. Offen: ein korpusunabhängiges Maß für die Information, die eine Absicht trägt.

**Energiekostenmodelle.** Die Messliteratur ist in [§6.3](#63-energy) zusammengefasst: Joule sind auf einem in-order-Kern linear in der Anzahl der Operationen [152] und auf einem out-of-order-Kern linear in der Zeit [153]; On-Chip-Zähler unterscheiden sich in ihrer Aussagekraft um eine Größenordnung [105, 154, 155]; Einheitenmessung nach Art von Ethereum korreliert mit der CPU-Zeit nur bei 0,51 [156]. Position: drei verschiedene Objekte, niemals zusammengelegt: die deterministischen, zielblinden Budgeteinheiten der Spezifikation; eine Schätzung als kalibrierter pro-Ziel-Koeffizientenvektor, angewendet auf die Zähler (in-order) oder auf die Zeit (out-of-order); und die Belegbezeichnungen, in getrennten Spalten geführt. Nicht übernommen: Joule in der Budgettabelle; Konstanten pro Sprache; ein Zähler gelesen als Wandmessung.

**Sprachen, die für Maschinenautoren entworfen wurden.** Ein Katalog von 42 solchen Sprachen, 36 davon erstmals 2026 gelistet, zeigt zu jedem Mechanismus dieses Papiers ein Gegenstück: hash-verkettete Belege, verpflichtende Verträge aufgeteilt in bewiesene und zur Laufzeit geprüfte, einen Beweisassistenten-Kern, Syntaxbäume als Quelle der Wahrheit mit gehashten Definitionen [168]. Die Konvergenzbeobachtung von [§3.7](#37-the-language-one-text-costs-and-theorem-status) hat Bestand. Was diesen Entwurf unterscheidet, ist kein einzelner Mechanismus, sondern dass Wiederholung und Injektivität Theoreme sind (T3, T7) statt Laufzeitversprechen, und dass Beispiele typisierte Ereignisspuren über derselben Semantik sind, die auch die Wiederholung verwendet, sodass das Orakel, das ein Modell nicht umgehen kann, das Programm selbst ist. Position: ein versioniertes Register von Regelcodes mit maschinenlesbaren Diagnosen und Reparaturplänen; testvalidierte Übersetzungspaare, hergestellt aus den Emittern und dem Prüfer, was das Rezept, mit dem in [167] ressourcenarme Sprachen erschlossen wurden, rückwärts ausgeführt ist. Nicht übernommen: jeder Anspruch, der Erste oder Einzige zu sein.

**Beweis-Ingenieurwesen.** Die Standards, die die Lücke zwischen einer Spezifikation und ihrem mechanisierten Modell schlossen, taten dies, indem sie Prosa, Prüfertabellen und Definitionen aus einer einzigen verfassten Quelle generierten: SpecTec für WebAssembly fand zehn Fehler in fünf Vorschlägen und wurde für alle künftigen Ausgaben übernommen [169]. Die Projekte, die eine Implementierung durch Verfeinerung als korrekt bewiesen, zahlten dafür: rund zwölf Personenjahre für 8.700 Zeilen C [171]. CompCerts Betreuer listen jedes als vertrauenswürdig vorausgesetzte Element samt Begründung auf [170]. Position: eine einzige verfasste Regelquelle, die den Spezifikationstext, die Prüfertabellen und die Lean-Definitionen generiert, mit einer Prüfung, die bei jeder Abweichung fehlschlägt; der Lean-Kern als maßgeblicher Ausführer für die Teilmenge, die er abdeckt, wobei die Anzahl nicht unterstützter Konstrukte veröffentlicht wird und den angegebenen Geltungsbereich jedes Theorems begrenzt; ein Kapitel, das jede vertrauenswürdige Komponente mit ihrem Test auflistet. Nicht übernommen: ein Verfeinerungsbeweis vom Lean-Kern zum Rust-Interpreter; Theorem-Anzahlen als Maß für Sicherheit; zwei verfasste Semantiken von irgendetwas.
<div id="122-the-form-among-programming-languages" class="anchor-alias" aria-hidden="true"></div>

### 12.2 Die Form unter Programmiersprachen

Etwa hundert Sprachen aus zwölf Familien wurden auf acht Koordinaten (Zustandslayout, Ereignisalphabet, Übergang, Ordnung, Ressource, Vertrauen, Bindungszeit und Absicht) platziert, wobei für jede festgehalten wurde, ob der Autor sie festlegt, der Compiler oder die Laufzeit sie wählt oder die Sprache kein Wort dafür hat. Drei Regelmäßigkeiten folgen. Nur drei Familien erzielen globalen Determinismus ohne Zutun des Autors, durch drei verschiedene Theoreme: die synchronen Sprachen durch eine Kausalitätsprüfung, die Stream- und Logiksprachen durch Monotonie und die Sprachen mit geschützten atomaren Aktionen durch eine Regel-pro-Schritt-Planung mit statischer Konfliktanalyse. Jede Familie, die eine Sicherheitszertifizierung erreichte, tat dies, indem sie dieselben drei Koordinaten entfernte, die die Form entfernt: dynamische Allokation, unbeschränkte Rekursion und nichtdeterministische Wahl. Und die beiden Koordinaten, die keine Familie gut festlegt, sind Vertrauen und Absicht; die Absichts- und Beispielblöcke der Form sowie ihre Fähigkeitswerte legen beide fest.

Die fünf Entwürfe, die der Form am nächsten stehen, sind Dedalus, dessen zeitindizierte Relationen der Log sind und dessen Nächster-Schritt-Regeln der Übergang sind [15]; Bluespec, dessen geschützte atomare Regeln in einer vom Compiler gewählten Ordnung geplant werden, die als äquivalent zu einer Ausführung einer Regel pro Schritt bewiesen ist; die Elm-Architektur, die die vier Komponenten der Form unter anderen Namen darstellt [83]; Lustre, dessen Disziplin mit beschränktem Speicher und statischer Planung in etwa hundert Avioniksystemen zertifiziert wurde; und Unison bei der Identität [160]. Die Aufzeichnung legt außerdem fünf Einschränkungen fest, jeweils eine Stelle, an der eine frühere Sprache für die entgegengesetzte Wahl bezahlt hat. Nebenläufige Aufgaben müssen auf Zustandsmaschinen ohne Stack abgesenkt werden, wie Rusts asynchrone Funktionen es tun, weil eine Coroutine mit eigenem Stack nicht Schritt für Schritt protokolliert werden kann. Parallele Komposition muss als strukturierter Schritt emittiert werden, nie als explizites Automatenprodukt, was in Esterels Compilern oberhalb von etwa tausend Zeilen nebenläufigem Quelltext scheiterte. Effekt-Handler müssen one-shot sein, wie OCaml 5 gewählt hat, und der Grund liegt in Eigentum und der Totalitätsschranke (jede zusätzliche Wiederaufnahme kopiert erfassten Zustand in datenabhängiger Anzahl), nicht in der Protokollierbarkeit. Die einzige Dimension eines Programms, die ein Theorem ist, ist der Index seiner endlichen Steuerungsprojektion ([§3.8](#38-behaviour-equivalence-and-dimension)). Und die Hebung aus einer Turing-vollständigen Sprache ist eine partielle Abbildung, deren Definitionsbereich unentscheidbar ist ([§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis)). Das Vokabular der Differentialgeometrie, das ein früherer Arbeitsentwurf dieses Projekts verwendete (Karten, Eichung, Holonomie, Geodäten), hat kein Gegenstück in der Literatur der Programmiersprachen und wird hier nicht verwendet; die Objekte, die existieren, sind die finale Koalgebra, Funktoren von der Syntax in sie, das Gruppoid der Umformungsbeweise, dessen Zusammenhangskomponenten e-Klassen sind, und minimale Beschreibungslänge mit Joule anstelle von Bits.

Die Universalitätsaussagen von [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis) werden durch ein Kapselungskriterium messbar. Die Form kapselt eine Sprache $L$, wenn für jedes Programm $p$ von $L$ in einem festen Korpus die gehobene Form auf fünf Koordinaten nicht schlechter als $p$ und auf mindestens einer strikt besser ist: Joule gemessen auf denselben Aufgaben und demselben Host; Redundanz im Sinne von [§3.8](#38-behaviour-equivalence-and-dimension) gegenüber den Zustandsbits, die $p$ deklariert; Entscheidbarkeit, das heißt jede für $p$ entschiedene Eigenschaft wird auch für die Form entschieden; die Rundreise, das heißt Verhaltensübereinstimmung bis zu einer angegebenen Länge und die Lens-Bedingung auf dem Form-Hash; und die Kosten für ein Modell, von derselben Absicht aus ein Tor-bestehendes Programm zu erreichen. Der Anspruch, dass die Form besser als eine Programmiersprache sei, ist die Konjunktion dieses Kriteriums über den Korpus, ein registrierter Lauf pro Sprache, und nichts weiter: er beansprucht weder Ausdruckskraft, da eine Form nicht mehr ausdrücken kann als $p$, noch Lesbarkeit, die eine Eigenschaft einer Projektion ist, noch Verbreitung. Eine Sprache, bei der die Form nach zwei registrierten Läufen auf irgendeiner Koordinate strikt schlechter ist, wird nicht gekapselt, und das Protokoll dessen, was diese Sprache festlegt und die Form nicht, wird zu einem Arbeitselement für die Form.
<div id="123-why-human-written-code-is-redundant" class="anchor-alias" aria-hidden="true"></div>

### 12.3 Warum menschlich geschriebener Code redundant ist

Menschlich geschriebener Code trägt Redundanz überall dort, wo das Medium dem Autor keinen Kanal für das Gemeinte bietet, und diese Redundanz ist der private Ersatz jedes Autors. Die gemessenen Belege ordnen sie in drei Schichten. Formatierung macht 13 bis 15 % der Token geschweifter Klammernsprachen aus und kann für zehn Sprachmodelle ohne Genauigkeitsverlust entfernt werden [136], und das Layout hat keinen messbaren Einfluss auf das menschliche Textverständnis [135]. Die einzigen Größen, die den gemessenen Verständnisaufwand abbilden, sind Textgröße, Vokabulargröße und die Reichweite von Datenflussabhängigkeiten, jeweils bei Kendalls τ ≈ 0,4, während die zyklomatische Komplexität nichts abbildet (τ ≈ 0,09) [133]; und 97 % der realen Nebenläufigkeitsfehler abseits von Deadlocks sind nicht durchgesetzte Annahmen über Atomarität oder Reihenfolge, davon 96 % mit höchstens zwei Threads, weil sequenzieller Text keine partielle Ordnung ausdrücken kann und der Autor eine totale hinschreibt [172]. Namen werden mit einer Medianübereinstimmung von 6,9 % zwischen Entwicklern gewählt und zu 97 % dekodiert [137]; Kommentare verlieren innerhalb weniger Commits den Bezug zu dem Code, den sie beschreiben [138]; dennoch verlieren Sprachmodelle bis zu 29 Prozentpunkte Genauigkeit, wenn Bezeichner entfernt werden [139]. Zwei weitere Ursachen sind organisatorisch. Entwickler löschen nicht: in drei Produktionssystemen wurden 54 bis 60 % der Dateien über sechs bis sechzehn Monate nie ausgeführt, Entwickler entfernten 20 % des Codes, der ihnen als unnötig gezeigt wurde, und die Vorsicht war begründet, da der Detektor eine Präzision von 32 % hatte [173]. Und Organisationen liefern ihre Grenzen mit aus: acht organisatorische Metriken sagten fehleranfällige Binärdateien mit 86,2 % Präzision und 84,0 % Recall voraus, vor jeder Code-Metrik [174].

Die daraus folgende Position besteht aus vier Teilen. Die Form übernimmt Ordnung, Lokalität, Idiom und Erreichbarkeit, jeweils entscheidbar über einen Zustand, eine Ereignismenge und einen totalen Schritt. Die Projektion übernimmt Layout und Idiom, gerendert pro Gemeinschaft, weil der Vorsprung von Experten auf Code beschränkt ist, der in vertrauten Mustern geschrieben ist, und eine Projektion, die lediglich korrekten Code emittiert, sie diesen Vorsprung kostet. Die Absicht bleibt ein strukturierter, geprüfter Datensatz, aus dem die Projektion Namen rendert ([§3.8](#38-behaviour-equivalence-and-dimension)). Und die Spezifikation wird durch eine mechanische Zulassungsprüfung gesteuert, da das Verfassen durch Modelle die Vorschlagsrate erhöht, ohne die Regel zu ändern. Drei Fragen, von denen das Design abhängt, hatten keine Messung in der Literatur und wurden als Experimente mit versiegelten Protokollen registriert: ob ein Modell aus einer namenlosen Form samt Konzeptaufzeichnung ebenso genau schließt wie aus einer benannten Oberfläche; welcher Anteil benachbarter Anweisungen in gewöhnlichem Code unter den Abhängigkeiten der Form vertauschbar ist, was das Ausmaß des Spielraums ist, dessen Kosten die 97-%-Zahl misst; und ob eine durch Wiederholung geprüfte und mit einem Befehl umkehrbare Löschung die 20-%-Löschungsrate verschiebt. Zwei Behauptungen, die im Arbeitsmaterial des Projekts kursierten, haben keine nachvollziehbare Quelle und werden nicht verwendet: eine Studie von 2014 über Seitenzahlen von Sprachhandbüchern und die Aussage, erfahrene Programmierer schrieben weniger Code, die auf einen Blogbeitrag zurückgeht, der eine ungenannte Studie zitiert.

<div id="124-how-the-language-grows-and-shrinks" class="anchor-alias" aria-hidden="true"></div>

### 12.4 Wie die Sprache wächst und schrumpft

Jede Sprache, die klein blieb, ersetzte den Geschmack von Prüfern durch eine Regel darüber, was als zulässig gilt. Gos Prozess ist auf Ablehnung ausgelegt und lehnte in einer Studie 40,9 % von 1.095 Vorschlägen mit einem veröffentlichten Katalog von Gründen ab [175]; Luas Regel von Mechanismen statt Richtlinien hielt ihre Implementierung bei rund 25.000 Zeilen C; Elm hörte auf. Auch das wachsende Regime ist durch seinen eigenen Vorsitzenden dokumentiert: der Nutzen eines Features ist privat und unmittelbar, seine Kosten sind diffus und aufgeschoben, und für etwas Neues lässt sich leichter Begeisterung wecken als für den Widerstand dagegen [175]. In RCE wächst die Form innerhalb des einen Textes. Wenn ein Programm eine Form benötigt, die dem Text fehlt, einschließlich einer, die niemand vorhergesehen hat, wird die Form in die Spezifikation selbst geschrieben, ohne Version und ohne Makro, Flag, Direktive oder Plugin. Das Spezifikations-Repository nennt sieben Regeln dafür, wie eine Form in den Text gelangt, wobei jede das Artefakt benennt, das sie durchsetzt. Ein Konstrukt gelangt nur mit einem akzeptierten Beispiel und einem, das eine Änderung erfordert, einer Lean-Aussage des Theorems, auf das es sich stützt, verknüpft mit dem Prüfer über eine generierte Regeltabelle oder über Testvektoren, sowie ohne Parsing-Konflikte in die normative Grammatik; alles darunter ist ein Vorschlag. Eine zweite Schreibweise für etwas, das die Form bereits ausdrückt, wird allein aus diesem Grund abgelehnt. Änderung wirkt in beide Richtungen: jedes Konstrukt kann geändert, verallgemeinert, ersetzt oder entfernt werden, wenn eine bessere Form gefunden wird, und die Änderung bewegt sich zusammen mit jedem Programm, Beispiel und Bibliotheksmodul des Repositorys, das sie berührt, in einem Commit, mit einer Zeile im Register, die angibt, was sich warum geändert hat. Jede Schnittstelle hat genau einen Entscheidungsort, weil eine organisatorische Grenze, die mitten durch eine Schnittstelle verläuft, eine vorhergesagte Defektstelle ist [174]. Die Entscheidungen und ihre Gründe werden in einem Register mit festem Gründe-Katalog veröffentlicht, sodass die Ablehnungsrate eine Zahl ist, die jeder ablesen kann. Der Markt stutzt nicht zurück, also ist Verbreitung niemals ein Grund, ein Konstrukt zu behalten. Und Autorschaft durch ein Modell ändert die Rate, nicht die Regel.
<div id="125-the-library-and-the-compute-fabric" class="anchor-alias" aria-hidden="true"></div>

### 12.5 Die Bibliothek und das Compute-Fabric

Ob eine Sprache eine große Bibliothek („batteries included“) mitliefern sollte oder einen kleinen spezifizierten Kern mit freiem Register, wird üblicherweise als Abwägung zwischen Bequemlichkeit und Flexibilität geführt. Die Aufzeichnung zeigt, dass beide Positionen an derselben Stelle scheitern [193]. Eine mit der Sprache ausgelieferte Bibliothek bindet ihre Schnittstelle an das Kompatibilitätsversprechen der Sprache und büßt Flexibilität ein [195]. Ihre Module werden entfernt, sobald ein Installer existiert: Python Enhancement Proposal 594 entfernte 22 davon unter Verweis auf Wartungskosten und die einfache Installation aus dem Register [194]. Ein freies Register erzeugt tiefe transitive Graphen: die Hälfte der abhängigen Pakete in Cargo, npm und NuGet hat mindestens 41, 21 und 27 transitive Abhängigkeiten [196]. Eine Spezifikation mit vielen Implementierungen divergiert an ihren Rändern, wie es mehr als 30 JSON-Parser auf einer unterspezifizierten Grammatik tun [197]. Wo die Aufzeichnung konvergiert, konvergiert sie auf eine kuratierte Schicht, die als eine Einheit ausgeliefert und geändert wird.

Derselbe Befund zeigt sich über Compute-Fabrics hinweg. Auf Grafikprozessoren erreichen Single-Source-Modelle auf Streaming-Kerneln nativen Code und verlieren bei Reduktionen: beim Skalarprodukt liegen die Performance-Portabilitätswerte von Kokkos, RAJA und SYCL zwischen 0,80 und 0,91 [198]. Auf einem FPGA erreicht eine aus CUDA migrierte und für eine GPU abgestimmte SYCL-Quelle 0,2 % bis 47 % der Geschwindigkeit ihrer FPGA-optimierten Fassung, gemessen an Verhältnissen aus den veröffentlichten Laufzeiten bei der größten Problemgröße [193, 199]. Die untersuchten Systeme, die in Software und Hardware dieselbe Bedeutung liefern, erreichen dies, indem sie ihre Quellsprache auf das beschneiden, was ihre Hardware bedeuten kann (Zustand statisch bekannter Größe, kein Heap und keine Rekursion im Hardwareteil, ein logischer Takt), und ihre Beweise decken Teile der Kette ab, nicht die gesamte [193, 200]. Portierbare Codeformate funktionieren dort, wo sie Semantik festlegen [201]. Bitidentische Ergebnisse kosten wenig, wenn sie von Anfang an entworfen werden [202]. Korrektheitsresultate für Speichermodelle gelten paarweise [203]. Platzierung anhand gemessenen Kosten ist nichtdeterministisch, sofern nicht jede Entscheidung protokolliert und wiederholt oder der Lauf in virtueller Zeit simuliert wird [193, 204]. Für Maschinenautoren ist die Frage zudem eine des Wissens: von den Paketen, die in von 16 Modellen generiertem Python- und JavaScript-Code benannt wurden, existierten 19,7 % nicht [205].

Beide Debatten fragen danach, wo die Bedeutung einer Bibliothek gehalten wird: durch eine einzige Implementierung, durch jedes Paket im Register, durch eine mit Toleranzen geprüfte Spezifikation oder durch ein Hersteller-Binary für ein Fabric. Die RCE-Position hält sie in dem einen Text.

- **Die Bibliothek ist Teil des Textes.** Sie ist in der Sprache geschrieben und in jedes Werkzeug eingebaut (Spezifikation 4.1). Sie ist durch den Hash ihres Manifests fixiert, das ein Programm als seine einzige Abhängigkeit benennt (F.5.3).
- **Sie hat keine Plattformvariante.** Ein- und Ausgabe führt sie ausschließlich über Adapter aus.
- **Ihre Kosten sind auf jedem Binary die Kosten ihres Quelltextes.** Ein Schritt bedeutet daher auf jedem Host dasselbe (HC-7).
- **Die Wahl pro Ziel liegt beim Host.** Der Host lässt ein Fabric für eine Klasse von Operationen erst nach einem protokollierten Bitgenauigkeits-Test gegen die CPU-Referenz zu (HC-13), und er protokolliert jede Platzierung für die Wiederholung (HC-12).
- **Was verfügbar ist, ist eine Liste, die ein Werkzeug ausgibt, vollständig bei jedem Commit und wachsend im selben Text.** Ob eine Funktion existiert, wird zum Nachschlagen statt zum Erinnern.

Die Form leistet dies als Gestalt, nicht als Tor. Die Systeme der Literatur beschneiden ihre Quellsprache, weil sie mehr ausdrückt, als ihre Hardware bedeuten kann. Die Form P = (S, E, δ, D, λ) ist die Gestalt, die jedes Programm ohnehin hat: der Zustand, den es hält, die Ereignisse, die es beantwortet, sein Schritt, sein Log und seine Ausgaben. Deshalb treten Programme anderer Sprachen durch Hebung in sie ein, innerhalb des Bereichs, den [§3.6](#36-one-ecosystem-lossless-and-the-universality-thesis) nennt, und deshalb teilt kein Teil dieser Position Programme in zugelassene und solche ein, die eine Änderung erfordern.

Die Form ist bei jedem Commit starr, mit einem Text und einer Bedeutung. Über Commits hinweg ist sie flexibel. Wenn ein Programm eine Form benötigt, die die Gestalt noch nicht hat, gewinnt die Gestalt sie im Text hinzu, niemals durch ein Makro, Flag, eine Direktive oder ein Plugin daneben. Eine Änderung kann eine Form erweitern, verallgemeinern oder ersetzen. Sie bewegt sich zusammen mit den Programmen des Repositorys in einem Commit, und die Programm-Hashes, der Äquivalenz-Check von [§3.8](#38-behaviour-equivalence-and-dimension) sowie der Log zeichnen auf, was sich bewegt hat. Verhalten und Äquivalenz (Spezifikation 6.10) sowie die Fabric-Einträge des Hosts wurden innerhalb des Textes ergänzt, ohne die Bedeutung irgendeines akzeptierten Programms zu verändern, und der Log als partielle Ordnung sowie Absicht mit Lücken werden auf dieselbe Weise vorgeschlagen. Unter dem Vorschlag folgt Hardware derselben Regel: die Engine liest die Zustandsgrößen und Schrittkosten einer Form, um sie zu realisieren, mit statisch dimensioniertem Zustand in Registern und wachsendem Zustand im Speicher, den die Schaltung adressiert.

„Batteries included“ und „Spezifikation und frei“ hören damit auf, Alternativen zu sein: die Batterien sind Teil der Spezifikation, und das Programm ist frei von jedem Fabric.

Die Bibliothekshälfte dieser Position gilt im Repository in ihren Hauptteilen: die Bibliothek ist in der Sprache geschrieben, in jedes Werkzeug eingebaut und durch Hash festgelegt. Zwei ihrer Teile bleiben offen: eine einzige Definition der Standardbibliothek über die Abschnitte der Spezifikation hinweg, und `use` als einziger Weg, die vier Module einzubinden, die eine Direktive noch erreicht. Die Fabric-Hälfte ist ein Vertrag und ein Referenz-Ausführer mit bewiesener Wiederholung, bisher allein auf CPUs ausgeübt. Der Vorschlag „eine Bibliothek und eine Form auf jedem Compute-Fabric“ listet auf, was bleibt [193]:

- eine einzige Definition der Standardbibliothek, und `use` als einziger Weg, eine Bibliothek einzubinden;
- bei Wiederholung erneut abgeleitete Probe-Nachweise;
- Platzierung auf jedem Ausführungspfad;
- ein Reduktionsbaum pro Konstrukt;
- Kalibrierungsläufe;
- Ganzzahl- und binary32-Operationsklassen;
- aus der Gestalt jeder Form abgelesene Hardware-Realisierung;
- ein Host ohne Betriebssystem;
- zwei Messungen, die der Literatur fehlen: die Energie eines Kernels über Geräteklassen hinweg unter einer gemeinsamen Systemgrenze, und der Anteil an Bibliotheksfunktionalität, den Modell-Assistenten wiederverwenden statt neu zu implementieren.

<div id="126-how-languages-in-development-plan-breaking-change" class="anchor-alias" aria-hidden="true"></div>

### 12.6 Wie Sprachen in der Entwicklung brechende Änderungen planen

[§12.4](#124-how-the-language-grows-and-shrinks) legt dar, wie sich die Form ändert. Dieser Unterabschnitt stellt diese Regel neben die Pläne von Sprachen, die sich im Jahr 2026 weiterentwickelten, so wie ihre Roadmaps, Release Notes und Foren sie beschreiben. Die Quellen haben unterschiedliches Gewicht. Wo eine Angabe auf einem einzelnen Blog- oder Forenbeitrag beruht, sagt der Text dies ausdrücklich, und wo Sekundärquellen sich widersprechen, wird der Widerspruch berichtet statt aufgelöst.

**Rust: Editionen und keine zweite Hauptversion.** Rust führt brechende Änderungen über Editionen ein. Eine Edition wird pro Crate gewählt, Rusts Übersetzungs- und Verteilungseinheit, und Crates auf unterschiedlichen Editionen lassen sich weiterhin zu einem gemeinsamen Programm linken. Kommentatoren im Lobsters-Forum lesen die Editionspolitik als Haltung, dass es niemals ein Rust 2.0 geben werde [206]; diese Lesart stammt aus einem Forenthread, nicht aus einer Stellungnahme des Projekts. Die aktuelle Edition ist 2024, stabilisiert in Rust 1.85. Eine Edition 2027 wird im Internals-Forum des Projekts diskutiert, wo einige Beteiligte sie stattdessen erst 2028 erwarten; Bereichstypen (`ranges`) sind ein Änderungskandidat, entschieden ist noch nichts [207]. Die inhaltliche Richtung für 2026 gibt die Roadmap „The Borrow Checker Within“ vor [208]. Sie plant, 2026 eine Alpha-Version von Polonius, der nächsten Formulierung des Borrow-Checkers, zu stabilisieren, und belässt dessen vollständige flusssensitive Form als künftige Arbeit. Außerdem plant sie View-Typen, mit denen eine Funktion deklarieren kann, welche Felder eines Wertes sie berührt, sodass getrennte Felder gleichzeitig ausgeliehen werden können. Ein vorgeschlagenes Experiment für 2026 fügt View-Typen nur zu Erprobungszwecken in den Compiler ein, und ihre Syntax ist noch umstritten [209]. Fortschritte bei diesen Zielen werden im Rust-Blog berichtet, etwa für April 2026 [210]. Pattern-Typen und lineare Typen tauchen nur in Berichten aus zweiter Hand auf; die Umfrage fand für keines von beiden ein offizielles Ziel für 2026.

**Go: ein einziges Kompatibilitätsversprechen.** Es gibt kein Go 2. Das Kompatibilitätsversprechen von Go 1 gilt fort, und die Sprache ändert sich innerhalb dieses Rahmens. Go 1.26, veröffentlicht im Februar 2026, brachte ein neu geschriebenes `go fix`, einen neuen Garbage Collector, eine Ausdrucksform von `new()` sowie die Erkennung geleakter Goroutinen [211]. Go 1.27, veröffentlicht am 19. August 2026, ergänzte generische Methoden (Methoden mit eigenen Typparametern), bessere Typinferenz, ein Profil für Goroutinen-Leaks sowie experimentelle SIMD-Operationen (Single Instruction, Multiple Data) [212, 213].

**Zig: kein 1.0, bevor Stabilität versprochen werden kann.** Zig hat 1.0 noch nicht erreicht und nennt dafür kein Datum. Seine Ein- und Ausgabe wurde rund um eine `Io`-Schnittstelle neu aufgebaut, die wie Allokatoren übergeben wird, sodass der Aufrufer zwischen threadbasierter und ereignisbasierter Ausführung wählt, und die Schlüsselwörter `async` und `await` wurden entfernt [214, 215]. Ein Blog berichtet von Version 0.16 mit `std.Io` im April 2026 [216]; andere Sekundärquellen nennen abweichende Versionsnummern, und maßgeblich dafür ist die Website des Projekts selbst. Eine Lobsters-Diskussion zur Roadmap 2026 berichtet von zwei laufenden Arbeiten: einem eigenen x86-Backend von Zig für Debug-Builds anstelle von LLVM, der Compiler-Infrastruktur seiner übrigen Builds, sowie inkrementeller Kompilierung [217]. Einem Sekundärbericht zufolge vertritt Zigs Schöpfer Andrew Kelley die Position, dass 1.0 erscheint, sobald das Projekt Stabilität glaubwürdig versprechen kann, und die dort gesammelten Schätzungen reichen von Ende 2026 bis 2027 [218].

**Weitere Sprachen.** Mojo 1.0 erschien am 11. August 2026 als Teil von Modular 26.5, wobei behutsame brechende Änderungen auch danach möglich bleiben [219]. Ein Bericht gibt an, der Quelltext des Compilers sei eine Woche später unter der Apache-2.0-Lizenz mit LLVM-Ausnahme gefolgt [220]; diese Angabe stützt sich auf eine einzelne Quelle. Carbon ist experimentell und besitzt keine funktionsfähige Toolchain. Die Ergänzung eines Speichersicherheits-Entwurfs verschob sein Release 0.1 frühestens auf Ende 2026, ein Datum, das das Projekt selbst „sehr ehrgeizig“ nennt [221, 222]. C++26 wurde im März 2026 abgeschlossen, laut Herb Sutters Sitzungsbericht vom Komiteetreffen, einer Einzelquelle für die folgenden Details: Verträge (`contracts`) und eine gehärtete Standardbibliothek wurden aufgenommen, Sicherheitsprofile wanderten nach C++29, und Safe C++, der Vorschlag zur Einführung eines Borrow-Checkers, wurde fallengelassen [223]. Für Gleam, Roc, Vale und Hylo fand die Umfrage lediglich Übersichtslisten [224], aus denen hier nichts übernommen wird.

**Zwei gemeinsame Muster.** Jede dieser Sprachen führt geprüftes Eigentum schrittweise ein: Rust über Polonius und View-Typen, Carbon über einen vor 0.1 geforderten Sicherheitsentwurf und C++ über Verträge jetzt und Profile später. Und jede hält für ein früheres Release geschriebenen Code kompilierbar: Rust durch gemeinsam linkbare Editionen, Go durch das Go-1-Versprechen, Zig durch das Zurückhalten von 1.0, bis es dasselbe versprechen kann.

**Position.** RCE stellt sich beim zweiten Muster bewusst auf die entgegengesetzte Seite und bewahrt das, was das zweite Muster schützt, mit anderen Mitteln.

- *Keine Edition, keine Versionsauswahl.* Es gibt eine Sprache, den Text der Spezifikation an einem Commit (Spezifikation 2.7). Das Label `# rce-version:` wählt nichts aus und wird nicht gehasht. Eine Änderung, die einem gültigen Programm eines früheren Releases eine andere Bedeutung gibt, ist ein neues Release mit neuem Label, und ein benanntes Release wird niemals nachträglich geändert (Spezifikation C.15). Ein Programm, das ein früherer Commit akzeptierte, kann unter einem späteren eine Änderung erfordern, wenn eine Regel ergänzt wurde; darauf weist die Spezifikation in ihrer Übersicht ausdrücklich hin. Eine Edition lässt zwei Dialekte in einem Programm koexistieren; die Form lässt nur einen zu.
- *Die Änderung bewegt sich mit dem Code, den sie berührt.* Statt alte Formen am Leben zu halten, bewegen sich eine Textänderung und jedes Programm, Beispiel und Bibliotheksmodul des Repositorys, das sie berührt, gemeinsam in einem Commit, mit einer Zeile im Register, die angibt, was sich warum geändert hat ([§12.4](#124-how-the-language-grows-and-shrinks)).
- *Kompatibilität wird zwischen zwei Artefakten geprüft, nicht versprochen.* `rce api-diff` klassifiziert jede Änderung eines Exports anhand einer geschlossenen Tabelle als kompatibel oder brechend (F.4.3); `rce equiv` entscheidet, ob zwei Programme über dem erkundeten Alphabet dasselbe Verhalten haben ([§3.8](#38-behaviour-equivalence-and-dimension)); und `rce change` kombiniert beides und klassifiziert eine Änderung als Erratum, Bedeutungsänderung oder Schnittstellenänderung (Spezifikation 10.11, aus dem Vorschlag `spec/proposals/one-commit-change.md`). Das Urteil gilt bis zur erkundeten Schranke, und T59 begrenzt, was Übereinstimmung bis zu einer Tiefe zeigt.
- *Ein Programm benennt, wogegen es geprüft wurde.* `rce manifest` schreibt ein Manifest, das jedes Modul über den Hash seines kanonischen Textes und die Standardbibliothek über den Hash ihres eigenen Manifests fixiert, und nichts löst Versionen auf (F.5.3). Eine veröffentlichte Definition ist unveränderlich; eine Korrektur ist eine neue Definition mit neuem Hash. Ein Programm wird daher niemals stillschweigend aktualisiert.

Der Zielkonflikt ist explizit. Go und Rust versprechen, dass Code, der ihnen nicht gehört, weiter kompiliert. RCE bewegt den Code, der ihm gehört, mit und bietet für ein Programm außerhalb des Repositorys den Pin, das Release-Label, das genau einen Text benennt, und die Klassifikation jeder Änderung, nicht aber das Versprechen, dass das Programm weiterhin akzeptiert wird. Die beiden Entwürfe werden hier nicht gegeneinander aufgerechnet; nichts in diesem Papier misst die Kosten eines der beiden für die Eigentümer externer Programme.

Beim ersten Muster ist die Position der Form enger gefasst. Der Footprint einer Anweisung, also die Menge der Ortspfade, die sie liest und schreibt, ist aus der Anweisung selbst definiert (Spezifikation C.3), und die Zweige eines `par` werden nur zugelassen, wenn ihre Footprints disjunkt sind (W-PAR-1). Rusts View-Typen erreichen ein ähnliches Ziel, die gleichzeitige Nutzung getrennter Teile eines Wertes, über eine Deklaration in der Funktionssignatur; die Form benötigt keine. Zigs vom Aufrufer gewähltes `Io` ähnelt der Arbeitsteilung der Form: der Schritt ist rein und total, die Bibliothek führt Ein- und Ausgabe nur über Adapter aus, und der Host wählt das Fabric und protokolliert jede Platzierung für die Wiederholung ([§12.5](#125-the-library-and-the-compute-fabric)). In den gesichteten Quellen macht keine Roadmap das Verhalten eines Programms zu einem geprüften, wiederholbaren Objekt oder vergleicht zwei Programme anhand dessen, was sie tun. Dies ist ein Urteil über die gelesenen Roadmaps, kein gemessenes Ergebnis, und genau diese Lücke sollen der Äquivalenz-Check und die Wiederholung (Satz T3) schließen.

<div id="13-programme-of-work-and-its-gates" class="anchor-alias" aria-hidden="true"></div>

## 13. Arbeitsprogramm und seine Tore

Zwei unabhängige Überprüfungen der öffentlichen Repositorys im Oktober 2026 kamen zu derselben Diagnose. Der Prüfer ist nicht selbst verifiziert: nichts verfeinert die Lean-Semantik bis zum Rust-Interpreter, und die beiden Lean-Kerne haben kein Theorem, das sie miteinander verknüpft. Die beiden untenstehenden Konformitäts-Untergrenzen stammen aus unterschiedlichen Berichten, und jeder ist ausdrücklich benannt.

**Lean-Kern.** Der Bericht für den mechanisierten Kern (`conformance/reports/results-lean-core.json` bei öffentlichem Commit `d91a9fc8`) verzeichnet 210 bestandene Tests, 1 fehlgeschlagenen und 1.766 nicht unterstützte von 1.977, sodass etwa ein Zehntel dieses Lean-Kern-Berichts unter das Theorem fällt, mit dem die Übersicht wirbt. Die am öffentlichen Tip `3d38454a28ef` (6. November 2026) weiterhin eingecheckte Datei weist denselben Stand auf: 210 bestanden, 1 fehlgeschlagen, 1.766 nicht unterstützt, 1.977 Ergebnisse. Dieser Stand ist die Momentaufnahme des Lean-Kerns. Die Untergrenze des Referenzprüfers folgt im nächsten Absatz.

**Referenzprüfer.** Bei `3d38454a28ef` verzeichnen die README sowie die eingecheckten Berichte `conformance/reports/results-reference.json` und `conformance/reports/coverage.json` 2.236 Tests, die 311 von 311 normativen Klauseln abdecken. Die Referenz besteht 2.221, schlägt bei 0 fehl und markiert 15 als nicht unterstützt. Der Referenzbericht nennt den Interpreter-Commit `fb4211290198`. Die Python- und JavaScript-Emitter stimmen jeweils auf 1.462 Tests Zeile für Zeile mit der Referenzspur überein, bei 0 Fehlschlägen, und die übrigen 774 Ergebnisse in jeder dieser Dateien sind nicht anwendbar (`conformance/reports/results-emit-python.json`, `conformance/reports/results-emit-js.json` und `conformance/reports/parity.md`: 1.462 Antworten mit denselben Bytes wie die Referenz, 0 abweichende). Die eingecheckten Rust- und Scala-Ergebnisdateien enthalten Stände früherer Läufe und liegen außerhalb dieser Referenz-Untergrenze (`conformance/README.md`).

Emittierter Code ist eine Laufzeit mit dynamischen Werten pro Ziel, vier handgeschriebene Laufzeiten von jeweils rund 2.000 Zeilen. Die Energieschätzung kann Ziele nicht voneinander unterscheiden, sodass die Extraktion mit geringsten Joule nie eines auswählt. Die Hebungen bei `3d38454a28ef` sind die Sonde `spec/lift/go/lift_go.py` für ein Go-Muster sowie `spec/lift/python/lift_py.py` für eine Teilmenge von Python 3.13, die 6 der 92 Fälle des festgelegten Python-Korpus abdeckt (`lang/README.md`). Der Universalitätsanspruch erfordert Messungen über mindestens zehn Sprachen hinweg und verbleibt in [§10](#10-work-to-finish). Die Engine (die Gänge, der e-Graph, die Umformungen und ihre Beweise, der Kernel und seine Modellprüfung sowie die Hebung) ist nicht öffentlich, sodass die von ihr erzeugten Ergebnisse erst dann in dieses Papier eingehen, wenn jedes einzelne auf öffentlichem Code neu aufgebaut ist; [§10](#10-work-to-finish) listet sie samt ihren Neuaufbaupfaden auf. Für ein Projekt, dessen erklärter Grund für offene Arbeit Nachvollziehbarkeit ist, stellt dies das größte Risiko im Programm dar.

Am 6. November 2026 sind bei openIE-dev/rce `3d38454a28ef` Planung (`schedule`) und Aufbau (`construct`) auf `main`. Der Brückenkorpus ist kein Produktionscompiler. Die handgeschriebenen Emitter durchlaufen weiterhin den Syntaxbaum. Die Option-B-Arbeit, die ein `break` im Schleifenkörper als Flag des Körpers mitführt, ist als [Pull Request #148](https://github.com/openIE-dev/rce/pull/148) offen.

Das Programm ist nach Abhängigkeiten geordnet: Reproduzierbarkeit zuerst; dann die Kodierung und das Kostenmodell, auf denen jede spätere Messung beruht; dann die Beweiskette; und erst dann Breite. Jede Phase endet an einem Tor, das ein vor dem Lauf registrierter Falsifizierer ist und mit einem Konfidenzintervall berichtet wird; eine Phase schließt, wenn ihre Torbeobachtung veröffentlicht ist, niemals aufgrund von Aufwand. Die Tore sind in [§9](#9-falsifiers) und in der Tabelle unten angegeben.

| Phase | Ergebnisse | Was die Phase widerlegt |
|---|---|---|
| 0 Reproduzieren | Jedes von der Engine abhängige Ergebnis auf öffentlichem Code an einem markierten Commit neu aufgebaut, wie [§10](#10-work-to-finish) auflistet; die Datensätze pro Aufgabe jedes neu aufgebauten Laufs; der zurückgehaltene Defects4J-Datensatz abgeschlossen; jede Registrierung per Hash versiegelt; ein einziger Versionsstring; die Spezifikations-Errata geschlossen; je eine einzige Schreibweise für Terminierung, Autorität und Fehler; ein veröffentlichtes Maß der Oberflächenredundanz (unterschiedliche Konstrukte pro Form über dem Beispielkorpus) | Eine Zahl in diesem Papier, die nicht aus einem öffentlichen Commit mit einem einzigen Befehl neu aufgebaut werden kann |
| 1 Form einfrieren | Inhaltsadressierte Definitionen als einzige Zwischenform; typisierte Relationen als Form-Wert; eine einzige Absenkung, die jeder Emitter konsumiert; die Rundreisebedingung pro Ziel geprüft; ein pro-Ziel-Kostenmodell kalibriert, wie [§6.3](#63-energy) angibt | Eine Definition, die allein aufgrund ihrer Größe eine Änderung erfordert; ein Ziel, dessen Rundreise einen Form-Hash verändert; das Kostenmodell ordnet zwei Ziele entgegengesetzt zum Wandmessgerät |
| 2 Ein Kern, verifiziertes Tor | Ein einziger Lean-Kern mit darauf neu formulierten Sätzen T1 bis T9; die Typregeln aus der Regeltabelle des Prüfers generiert, sodass eine Regel ohne Lean-Gegenstück den Build scheitern lässt; Prüfer und Interpreter aus Lean extrahiert und als Tor eingesetzt, mit dem Rust-Prüfer als gegengeprüftem Frontend | Das extrahierte Tor und der Rust-Prüfer weichen bei irgendeinem Programm voneinander ab; ein neu formuliertes Theorem benötigt einen unbewiesen angenommenen Schritt; nicht unterstützte Tests im Konformitätsbericht des Lean-Kerns über 10 % |
| 3 Ziele in Joule bewertet | Rang-n-Arrays und Bulk-Operationen als einzige Schreibweise für numerische Arbeit; Zig- und Fortran-Emitter mit festem Gleitkomma- und Überlaufmodus; Layout-Hinweise in der Passung und niemals in der Form; ein Übersetzungsvalidierungs-Zertifikat pro emittiertem Modul; das Wandmessgerät-Protokoll von [§8.3](#83-a-wall-meter) | RCE-F3 und RCE-F5; ein Modul ohne Zertifikat emittiert; Extraktion wählt für jedes Zielpaar denselben Term |
| 4 Hebung als Eingang | Eine Hebung pro Sprache, Go und Python zuerst, dann TypeScript und Rust, dann C und Zig; jedes Programm des Korpus jeder Sprache gezählt, bei eingefrorener Hebung; das Kapselungskriterium von [§12.2](#122-the-form-among-programming-languages) pro Sprache ausgeführt; ein öffentliches, nur anhängendes Log zugelassener Form-Hashes mit ihren Zertifikaten | Hebungsabdeckung unter 10 % bei einer der ersten vier Sprachen nach dem zweiten registrierten Lauf; die Form auf irgendeiner Koordinate des Kriteriums strikt schlechter |
| 5 Das Ökosystem verkettet sich | Synthese aus Absichten mit Lücken; die ersten Gänge öffentlich mit ihrem Verifikationszertifikat; das Konvergenzprotokoll von [§8.6](#86-convergence-of-model-calls-at-large-n) auf 1.000 öffentlichen Spezifikationen; Baselines in einer Tabelle mit Kosten pro korrektem Ergebnis in Joule und Dollar | RCE-F1, RCE-F2, RCE-F4; die Werkzeuge können sich nicht selbst prüfen oder emittieren |

Drei Positionen, an denen die Überprüfungen von den Umfragen in [§12](#12-the-form-against-the-record) abwichen, werden wie folgt aufgelöst. Kanonisches JSON bleibt die einzige gehashte Kodierung, aus den in [§12.1](#121-seven-areas-of-the-design) genannten Gründen; eine binäre Kodierung darf es nur dann für den Transport spiegeln, wenn sie eine auf denselben Vektoren geprüfte Bijektion auf diese Bytes ist. Die eine Schreibweise für Terminierung ist ein deklariertes fallendes Maß, mit den Schleifen- und Rekursionsschranken als Semantik; die inhaltsadressierte Form benötigt weiterhin einen beschränkten Fixpunkt für Rekursion, und das Maß ist das, was ihn beschränkt. Das Reduzieren des Nebenläufigkeits-Vokabulars auf zwei Primitive wird als offener Vorschlag und nicht als Entscheidung festgehalten, weil die Theoreme der beiden Primitive zuerst auf dem Prüfer statt auf einem Modell bewiesen werden müssen. Überhaupt nicht im Programm enthalten: ein selbsthostender Compiler vor Phase 2, weitere Ziele vor Phase 1, irgendein Konstrukt der Anhänge vor seinem Theorem sowie ein Produktionscompiler, von dem die Übersicht der Spezifikation selbst sagt, dass er nicht gebaut werden soll, solange sich das Dokument noch bewegt.

Seit den Überprüfungen wurden die sechs Repositorys, die mit der Spezifikation übereinstimmen müssen (das Buch, die Beispielprogramme, die Standardbibliothek, die Konformitäts-Suite, das Grammatik-Paket und der Editor), mit ihren Historien in das Spezifikations-Repository zusammengeführt, und jedes wird von einem Workflow geprüft, der den Prüfer aus demselben Commit baut. Nichts im Projekt fixiert oder bündelt mehr eine ältere Spezifikation; der gebündelte Prüfer des Editors, sechs Commits zurück, war die letzte solche Fixierung. Die Forschungs-Website und das Experiment-Repository bleiben getrennt und lesen das Spezifikations-Repository; dieses liest sie nie.
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

[206] Lobsters, discussion of "Announcing Rust 1.93.0" (forum comments). https://lobste.rs/s/l61c2k/announcing_rust_1_93_0

[207] Rust internals forum, "We have only two years to prepare the Rust 2027 edition" (discussion thread). https://internals.rust-lang.org/t/we-have-only-two-years-to-prepare-the-rust-2027-edition/22494

[208] Rust project goals, "The Borrow Checker Within," 2026 roadmap. https://rust-lang.github.io/rust-project-goals/2026/roadmap-borrow-checker-within.html

[209] Rust project goals, "View types experiment," proposed 2026 goal. https://rust-lang.github.io/rust-project-goals/2026/view-types-experiment.html

[210] Rust project, project goals update for April 2026, Rust Blog, 18 May 2026. https://blog.rust-lang.org/2026/05/18/project-goals-2026-04/

[211] Go project, Go 1.26 release notes, February 2026. https://go.googlesource.com/website/+show/cd9f0a846a136f7b452395772638018114795f37/_content/doc/go1.26.md

[212] Go project, Go 1.27 release announcement, The Go Blog, August 2026. https://go.dev/blog/go1.27

[213] Go project, Go 1.27 release notes, August 2026. https://go.dev/doc/go1.27

[214] Linux Weekly News (LWN.net), article on Zig's new asynchronous input and output design. https://lwn.net/Articles/1046084/

[215] L. Cro, "Zig's New Async I/O," blog post. https://kristoff.it/blog/zig-new-async-io/

[216] bokvi, "Zig in 2026," blog post. https://blog.bokvi.com/blog/zig-in-2026/

[217] Lobsters, discussion of the Zig roadmap for 2026 (forum comments). https://lobste.rs/s/0szaso/zig_roadmap_2026

[218] WebProNews, "Zig's Long Wait for 1.0: Andrew Kelley Demands Perfection Over Speed" (secondary report). https://www.webpronews.com/zigs-long-wait-for-1-0-andrew-kelley-demands-perfection-over-speed/

[219] Modular, "Mojo 1.0 is here," Modular forum, August 2026. https://forum.modular.com/t/mojo-1-0-is-here/3391

[220] iThome, report on the release of the Mojo compiler source, 2026 (single source). https://www.ithome.com.tw/news/178352

[221] Carbon Language project, Roadmap. https://docs.carbon-lang.dev/docs/project/roadmap.html

[222] Carbon Language project, Proposal 4880, "Safety milestones and a 2025 roadmap." https://docs.carbon-lang.dev/proposals/p004880-safety-milestones-and-a-2025-roadmap.html

[223] H. Sutter, trip report on the March 2026 C++ standards meeting, Sutter's Mill, March 2026. https://herbsutter.com/2026/03/

[224] DevPebble, "New programming languages" (list article). https://www.devpebble.com/blog/new-programming-languages/

[225] Open Interface Engineering, "Exact-proposer ladder: registered run," `rce/bench/ladder/exact-proposers/`, openIE-dev/openie-research-experiments: registration committed before the run at `3030469d`, results at `70a0a776` (pull request #21); ladder openIE-dev/rce `6d04a096`. https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/exact-proposers

[226] Open Interface Engineering, "Exact-proposer ladder on real defects: registered run," `rce/bench/ladder/real-defects/`, openIE-dev/openie-research-experiments: registration committed before the run at `64e70389`, results at `00e3b005` (pull request #22); ladder openIE-dev/rce `7dc4eded`. https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/real-defects

[227] Open Interface Engineering, "Exact-proposer ladder with renames: registered run," `rce/bench/ladder/rung-e/`, openIE-dev/openie-research-experiments: registration committed before the run at `be5f370d`, results at `3a5227c2`, merged at `f76ba9d8` (pull request #23); ladder openIE-dev/rce `8a5d90ea`. https://github.com/openIE-dev/openie-research-experiments/tree/f76ba9d8d02d57b773afbf105333417d55f72e2c/rce/bench/ladder/rung-e
