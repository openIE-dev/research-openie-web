---
title: "Aufgabensättigung versus aggregierter Rebound in der KI-Nachfrage"
deck: "Der veröffentlichte Preisverfall digitaler Inferenz belegt weder kostenlose Energie noch kostenlose Aktuierung noch unbegrenzten Wert, nachdem eine Routineaufgabe erledigt ist."
lang: "de"
source: "satiation"
complete: true
---

<div id="satiation-and-scarcity-after-free-ai" class="anchor-alias" aria-hidden="true"></div>

*Version 1.1, 11. Oktober 2026. Daten und Code: [research.openie.dev/data/](/data/#economics). LaTeX-PDF: [/pdfs/latex/satiation.pdf](/pdfs/latex/satiation.pdf) ([Quelltext](/pdfs/latex/satiation.tex)).*

*Der ökonomische Begleittext zu [Thermodynamische Schranken und ein optimales Tempo für zielhaltende Agenten](/papers/agency/) und zu [Gemessene Commit-Tore](/papers/gates/). Die Theorie, die er verwendet, bleibt dort: die Torform und $J^*$ in [Handlungsfähigkeit, Abschnitt 1](/papers/agency/#1-thesis), der maschinelle Halt in [Gemessene Commit-Tore, Abschnitt II.5](/papers/gates/#ii5-stop-bridge-satiation) und der Commit-Datensatz in [Teil I](/papers/gates/#part-i-the-commit-gate-notational-intelligence). Die Markt- und Preislesarten dieser Papiere sind in Abschnitt 8 gesammelt. Seine Anwendung auf das Programmieren ist [Der versprochene Billionen-Dollar-Markt für KI-Programmierung](/papers/ai-coding-market/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

Viele Planungsmodelle behandeln die Nachfrage nach maschineller Intelligenz, als hätte sie keine Ziellinie. Die Konsumtheorie enthält bereits das Gegenstück. Sättigung, und der verwandte Bliss-Punkt, ist der Bereich, in dem weitere Einheiten eines Gutes den Nutzen nicht erhöhen und ihn senken können (Andersen, 2001). Dieses Papier definiert ein operationales Gegenstück für Arbeit und Pflege: Eine Schleife erreicht den Aufgabenabschluss, wenn ein ausdrücklich formuliertes Vollständigkeitsprädikat gilt, weitere Aufrufe keine Klausel dieses Prädikats von falsch auf wahr umschalten und Aufrufe, die das Prädikat rückgängig machen, Schaden sind, kein Wert. Verweildauer, Tokenanzahl und Lizenzplatzanzahl sind andere Variablen. Sie können nach der Vollständigkeit steigen.

Zwei Behauptungen müssen getrennt bleiben. Sättigung auf Aufgabenebene gilt per Definition: Sobald das Vollständigkeitsprädikat einer Aufgabe wahr ist, kauft weitere Synthese für diese Aufgabe nichts. Aggregierte Sättigung ist eine Behauptung über die Gesamtnachfrage, und sie folgt nicht daraus. Billigere Synthese kann neue Aufgaben eröffnen (Acemoglu und Restrepo, 2019) und die Gesamtnutzung erhöhen, so wie billigere Kohle den gesamten Kohleverbrauch erhöhte (Jevons, 1865). Jede Routineaufgabe kann gesättigt sein, während die Gesamtnachfrage nach Routineaufgaben unbegrenzt wächst. Dieser Rebound ist das zentrale Identifikationsproblem des Papiers. Abschnitt 5.1 formuliert zwei prüfbare Hypothesen und die Daten, die sie identifizieren würden.

Eine zweite Tatsache betrifft den Preis, nicht die Physik. Epoch AI berichtet starke Rückgänge des Preises einer festen Inferenzleistung (Epoch AI, 2025; Emberson und Roodman, 2026). Dieses Papier nennt die daraus entstehende Lage an der Grenze kostenlos, für digitale Routineaufgaben, deren Ergebnis Information ist und deren Vollständigkeitstest endlich ist. Die Formulierung bedeutet nicht, dass Joule kostenlos sind, dass eine Anlage sich ohne Zertifikat bewegen darf oder dass Pflegearbeit wegautomatisiert wurde. Die Landauer-Schranke ist eine untere Schranke für das Löschen, keine Beschreibung heutiger Beschleuniger (Landauer, 1961; Horowitz, 2014).

Das Papier berichtet keine randomisierte Studie, keine Fehlerrate eines Fertig-Detektors und keine Aufteilung zwischen der Energie vor und der Energie nach der Vollständigkeit. Diese Messungen sind spezifiziert und fehlen. Was die Software-Referenz liefert, ist ein Ort für den Halt: Wise Computer Automation (WCA) kann aus einem Richtlinien- oder Budgetgrund ablehnen oder aufgrund eines physikalischen Prädikats (Freigabe durch eine Nachschlagetabelle und eine Energieprüfung, optional eine Control-Barrier-Funktion). Das Begleitpapier misst das physikalische Prädikat an Spielzeuganlagen. Dieses Papier formuliert das ökonomische Prädikat und die tatsächlich veröffentlichte Evidenz.

In dieser Studie trägt kein Field-Programmable Gate Array (FPGA) ein Energiemessgerät; die Platine des Begleitpapiers ist programmiert, und ihre Energie ist ungemessen. Ein Alchitry Pt V2 ist der vorgesehene spätere Prüfling (Device under Test, DUT). Ein Browser-Instrument, das das Tor zu WebAssembly (WASM) kompiliert und mit WebGPU darstellt, ist als Stufe B unter https://research.openie.dev/living/fpga-sim/ ausgeliefert (siehe Begleitpapier). Es ist eine Simulation, kein Platinenergebnis, und hier keine Sättigungsmessung. Analytische Joule aus dem OpCounter des Begleitpapiers sind keine Platinenleistung und keine Evidenz für Sättigung.

<div id="notation" class="anchor-alias" aria-hidden="true"></div>

## Notation

| Begriff | Definition in diesem Papier |
|------|--------------------------|
| Open Interface Engineering (OpenIE) | Die Organisation, die die Software-Referenz und diese beiden Studien pflegt. |
| Sättigung | In der zitierten Theorie ein Absinken des Grenznutzens auf null oder darunter. In der operationalen Klausel dieses Papiers schalten nach der Vollständigkeit weitere Aufrufe keine Klausel von `C` von falsch auf wahr um; Aufrufe, die `C` rückgängig machen, sind Schaden, kein Wert (Abschnitt 3.1). |
| Bliss-Punkt | Ein Güterbündel, bei dem zusätzliche Menge des Gutes den Nutzen senkt. Ein Lehrbuchobjekt. Hier nicht geschätzt. |
| Aufgabenabschluss | Das Ereignis, dass das Vollständigkeitsprädikat wahr wird. Orthogonal zur Modellgröße. |
| Arbeitsvollständigkeit | Ein ausdrücklich formulierter Arbeitshalt: Ticket geschlossen, Patch gemergt, Bericht eingereicht, Hauptbuch abgestimmt oder ein gleichwertiger schriftlicher Test. |
| Pflegevollständigkeit | Ein ausdrücklich formulierter Pflegehalt: Untersuchung abgeschlossen, Medikation abgeglichen, übernehmende Stelle benachrichtigt, Person in einem sicheren Zustand oder ein gleichwertiger schriftlicher Test. |
| An der Grenze kostenlos | Der Grenzpreis eines digitalen Syntheseschritts strebt gegen einen gebündelten oder vernachlässigbaren Geldpreis. Joule und Commits bleiben teuer. |
| Wise Computer Automation (WCA) | Die im Begleitpapier definierte Commit-und-Ablehnungs-Referenz. |
| Energy-First Architecture (EFA) | Die Entscheidung, ein Energieprädikat innerhalb der Erlaubnis zu halten. |
| Nachschlagetabelle (LUT) | Diskrete Freigabeabbildung, die das Referenztor verwendet. |
| Control-Barrier-Funktion (CBF) | Zertifikat der Mengeninvarianz, optionales Konjunkt (Ames et al., 2019). |
| Model Context Protocol (MCP) | Werkzeugtransport. Kein Detektor für Aufgabenabschluss. |
| System One | Typisierte Softwareentscheidungen für bekannte Optionsmengen. Ein Vorschlagender, kein Vollständigkeitsbeweis. |
| Künstliche allgemeine Intelligenz (AGI) | Ein breites Fähigkeitsziel. Keine Preisbeobachtung und kein Ergebnis dieses Papiers. |
| Prüfling (DUT) | Gemessene Hardware unter einer angegebenen Last. Keiner berichtet. |
| Field-Programmable Gate Array (FPGA) | Rekonfigurierbare Logik. Hier nicht synthetisiert. |
| WebAssembly (WASM) | Browser-Kompilierziel für den ausgelieferten Emulator des Tors in Stufe B (https://research.openie.dev/living/fpga-sim/). |
| WebGPU | Browser-GPU-API, genannt für die Darstellung dieses Emulators. Kein Leistungsmesser. |
| Alchitry Pt V2 | Vorgesehene spätere Platine (Hersteller: Artix-7 XC7A100T). Nicht gemessen. |
| Analytische Energieschätzung | Anzahl der Operationen mal eine benannte Konstante. Modelliert. Nicht auf der Platine gemessen. |
| Direkter Rebound | Zusätzliche Nutzung einer Leistung, wenn ihr effektiver Preis fällt, bei derselben Leistung (Gillingham, Rapson und Wagner). |
| Modelliert / simuliert / auf der Platine gemessen | Formel, Programmausführung oder Messgerät. Die neuen Zahlen dieses Papiers gehören zu keiner der drei Klassen; sein empirischer Gehalt ist das Zitieren veröffentlichter Reihen und Dokumente. |

<div id="terms-used-here" class="anchor-alias" aria-hidden="true"></div>

### Hier verwendete Begriffe

Vollständigkeitsprädikat `C`, Aufgabenabschluss, an der Grenze kostenlos und Ablehnungs-Begründungscodes sind in der Tabelle oben und in Abschnitt 3.1 definiert. Software-Referenz, Informationswert, Evidenzklassen und das Platinenergebnis-Kennzeichen stehen im gemeinsamen [Glossar](/glossary/).

Umfang. Abschnitt 2 gibt einen Überblick über Sättigungstheorie, Aufgabenautomatisierung, Aufmerksamkeitsmärkte, Evidenz zu Technologiezyklen und Inferenzpreise. Abschnitt 3 schreibt Prädikate auf und sagt, welche nicht geschätzt wurden. Abschnitt 4 listet Behauptungen auf, die auf Zitaten oder auf der Software-Demo des Begleitpapiers beruhen, und trennt sie von Gestaltungsregeln. Abschnitt 5 behandelt Rebound, Pflegekosten und militärische Nachfrage. Abschnitt 6 listet Gefährdungen der Validität auf. Die Commit-Mechanik und die Spielzeugmessungen stehen im Begleitpapier, „Gemessene Commit-Tore, Teil I (Notational Intelligence)“.

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>

## 1. Einleitung

Eine Nachfragekurve mit konstant positiver Steigung in „Intelligenz“ empfiehlt mehr Lizenzplätze, mehr Token und mehr Agenten, nachdem eine Arbeit erledigt ist. Diese Empfehlung ist eine Modellierungsentscheidung. Sie ist kein Satz über Arbeit. Die Standardkonsumtheorie erlaubt, dass der Grenznutzen sinkt und null kreuzt. Hat eine Routineaufgabe ein Vollständigkeitsprädikat, lautet die relevante Frage, ob mehr Modellausgabe dieses Prädikat verändert. Wenn nicht, ist zusätzliche Ausgabe ein Kostenfaktor ohne Zuwachs an dem Ziel, das aufgeschrieben wurde.

Die jüngste Preisevidenz weist von einer Knappheit der Synthese weg. Die Reihen von Epoch zeigen, dass der Geldpreis einer gegebenen Benchmarkleistung schnell fällt. Offene Gewichte und typisierte Entscheidungsverfahren, darunter System One, sind weitere Wege, auf denen ein bisher knapper Generierungsschritt billig wird. Teams, die eine abgeschlossene Routineaufgabe so bepreisen, als wäre Synthese noch knapp, verwenden eine veraltete Nebenbedingung.

Die Nebenbedingungen, die nicht aus einer Preisreihe folgen, sind physikalisch und institutionell. Rechnen dissipiert Energie. Horowitz (2014) dokumentiert, dass Datenbewegung und Speicher die praktische CMOS-Energie dominieren, auf Skalen weit oberhalb der idealen Löschschranke von Landauer. Ein Aktor ist kein Token. Eine Unterschrift, eine klinische Übergabe und eine Zahlung werden nicht dadurch rückgängig gemacht, dass man einen weiteren Absatz sampelt. Baumol (1967) zeigte, wie Sektoren mit schwachem Produktivitätswachstum einen wachsenden Anteil der Ausgaben aufnehmen können. Acemoglu und Restrepo (2019) modellieren Automatisierung als Verdrängung von Aufgaben plus die mögliche Schaffung neuer Aufgaben. Keines dieser Ergebnisse sagt, dass ein Sprachmodell die Kostenkrankheit beendet. Sie sagen aber, dass „mehr Fähigkeit“ keine hinreichende Beschreibung von Wert ist.

Die positive Behauptung dieses Papiers ist definitorisch und bibliografisch. Sättigung ist ein kohärentes Objekt. Veröffentlichte Inferenzpreise sind stark gefallen. Engagement-Metriken sind keine Vollständigkeitsmetriken. Die Software-Referenz kann eine Ablehnung für „nicht ausgeben“ und eine Ablehnung für „nicht bewegen“ als verschiedene Begründungscodes in einer Entscheidung darstellen. Die negative Behauptung ist ebenso wichtig. Dieses Papier identifiziert kein strukturelles Nachfragesystem, schätzt keinen Rebound und berichtet keine Platinenenergie.

<div id="companion-laws" class="anchor-alias" aria-hidden="true"></div>

<div id="companion-papers" class="anchor-alias" aria-hidden="true"></div>

### Begleitpapiere

Diese Studie ist der Halt beim **Aufgabenabschluss** in der Triade des Forschungskatalogs.

| Rolle | Studie | Zuständig für |
|---|---|---|
| **Navigation** | [Mixture of Limits](https://research.openie.dev/papers/gates/#part-ii-the-cascade-mixture-of-limits) | Nachschlagen → Formel → Löser → Modell; Böden einschließlich des Informationswerts (Value of Information, VoI). |
| **Commit** | [Gemessene Commit-Tore, Teil I (Notational Intelligence)](https://research.openie.dev/papers/gates/) | Vorschlagen → Zertifizieren → Commit\|Ablehnung → Beleg; physikalische Erlaubnis am Tor. |
| **Aufgabenabschluss** | Dieses Papier | Vollständigkeitsprädikat `C(z)`; Halt, wenn der VoI auf diesem Prädikat null ist oder wenn eine Budget- oder Richtlinienablehnung auslöst. |
| **Energiebudget** | [Metabolic Intelligence](https://research.openie.dev/products/mei/) | Budgethülle / Aktoren auf Ebene von Etikett und Campus. |
| **Automatisierungspfad** | [Rechtschreibprüfung ist global](https://research.openie.dev/papers/spellcheck/) | Ein Existenzbeweis, dass manche Computerintelligenz zu einem gebündelten Nullpreis zur Massenware wird: Die Grenzkosten der Rechtschreibprüfung fielen auf etwa null, und sie ergänzte Hardware und Editoren, die die Menschen bereits haben. Eine Rahmung des Zugangs, keine Zählung: die Vielen (7 Mrd.+), nicht die Wenigen, die Frontier-Rechenzentren mieten (<500 Mio.). |

Mixture of Limits navigiert. Notational Intelligence ist für den irreversiblen Commit zuständig. Dieses Papier ist für den Aufgabenabschluss nach digitaler Inferenz zuständig, die an der Grenze kostenlos ist. [Metabolic Intelligence](/products/mei/) ist für die Hülle des Energiebudgets und die Aktoren zuständig. In [Rechtschreibprüfung ist global](/papers/spellcheck/) haben, sobald ein Token behalten wird, weitere Schreibkandidaten auf diesem Prädikat einen Informationswert von null. An der Grenze kostenlos heißt nicht, dass Joule kostenlos sind.

<div id="2-related-work" class="anchor-alias" aria-hidden="true"></div>

## 2. Verwandte Arbeiten

<div id="21-satiation-and-bliss-points" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Sättigung und Bliss-Punkte

Andersen (2001) behandelt Sättigung innerhalb eines evolutorischen Modells des Strukturwandels, nicht als verbale Präferenz. Das tragfähige Element für dieses Papier ist das ökonomische: Die Grenzbewertung eines Gutes kann null erreichen. Lehrbuch-Bliss-Punkte machen die Geometrie explizit. Für ein Bündel `x*` steigt der Nutzen in einer Koordinate jenseits von `x*` nicht, und eine glatte Darstellung kann dort einen negativen Grenznutzen haben. Ein quadratisches Beispiel, `U(x) = -a (x - x*)^2` für `a > 0`, hat ein Maximum bei `x*` und jenseits davon eine negative Ableitung. Diese Funktion ist ein Modell, mit dem die Definition gelehrt wird. Sie wird in dieser Studie nicht an Agentenprotokolle angepasst. Kein Koeffizient `a` wird berichtet.

Die operationale Übersetzung erfordert ein Prädikat, das das Modell nicht kennt, solange es niemand formuliert. Sei `C(z) = 1`, wenn der schriftliche Vollständigkeitstest für die Episode `z` gilt, sonst 0. Sättigung in dieser Episode bedeutet, dass es einen Zeitpunkt `t*` gibt, zu dem `C` bei `t*` gleich 1 ist und für alle späteren Aufrufe keine Klausel von `C` von falsch auf wahr umschaltet. Aufrufe, die `C` rückgängig machen, sind Schaden, kein Wert. Abschnitt 3.1 formuliert dieselbe Regel. Das interne Ereignis **ökonomisch fertig** tritt ein, wenn `C` zu 1 wird; dieses Papier nennt dieses Ereignis Aufgabenabschluss. Das ist eine Definition. Zu einer empirischen Behauptung wird sie erst mit einer gelabelten Menge von Episoden und einem Detektor, dessen Fehler gezählt werden. Abschnitt 4 enthält diese Zählung nicht.

Keynes zog 1930 dieselbe Linie. Er teilte Bedürfnisse in absolute Bedürfnisse, die man empfindet, was immer andere haben, und relative Bedürfnisse, die man empfindet, weil ihre Befriedigung uns über andere erhebt. Er argumentierte, dass die absoluten Bedürfnisse erfüllt werden könnten. Das Vollständigkeitsprädikat ist das absolute Bedürfnis einer Aufgabe, aufgeschrieben. Relative und offene Wünsche haben kein solches Prädikat, und Abschnitt 5.2 hält sie aus der Behauptung heraus.

<div id="22-tasks-displacement-and-cost-disease" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Aufgaben, Verdrängung und Kostenkrankheit

Baumol (1967) analysiert unausgewogenes Wachstum. Steigt die Produktivität eines Sektors und die eines anderen nicht, steigen die relativen Kosten des stagnierenden Sektors, und er kann die Ausgaben dominieren, selbst wenn seine Menge langsam wächst. Gesundheitswesen, Bildung und Live-Aufführungen sind die üblichen Beispiele. Spätere gesundheitsökonomische Arbeiten bestreiten Größenordnungen und Mechanismen. Dieses Papier verwendet Baumol für eine negative Anweisung: Aus einem Fall des Tokenpreises nicht schließen, dass Pflege zu einem Softwaregut geworden ist. Pflege bleibt im gewöhnlichen institutionellen Sinn von Zeit, Vertrauen und Haftung abhängig. Ein Dokumentationsmodell kann die erfasste Aktivität erhöhen, was eine für Baumol relevante Mehrdeutigkeit ist: Die gemessene Leistung kann sich bewegen, während das Pflegeprädikat sich nicht bewegt.

Die mit David Autor verbundene Arbeitsmarktliteratur zerlegt Berufe in Aufgaben, die Maschinen ausführen können oder nicht. Die festgehaltene Aussage ist Acemoglu und Restrepo (2019), „Automation and New Tasks: How Technology Displaces and Reinstates Labor“, Journal of Economic Perspectives 33(2), https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3. Sie argumentieren, dass Verdrängung den Aufgabenanteil der Arbeit verringert und dass neue Aufgaben ihn wiederherstellen können. Ein vollständigkeitsorientierter Halt steht dem Abschließen einer Aufgabe näher als dem Schaffen einer neuen Engagement-Aufgabe. Eine Agentenschleife ohne Halt kann Aktivitätsmaße ohne Produktivitätsgewinn erhöhen. Diese Möglichkeit ist mit ihrer Warnung vor schwacher Automatisierung vereinbar.

<div id="23-attention-and-engagement" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Aufmerksamkeit und Engagement

Wus Buch „The Attention Merchants“ (Verlagsseite: https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/) beschreibt Unternehmen, die Aufmerksamkeit ernten und weiterverkaufen. Der Überblick des Center for Humane Technology über die Aufmerksamkeitsökonomie (https://www.humanetech.com/youth/the-attention-economy) ist eine Zusammenfassung desselben Musters aus Sicht einer Interessenvertretung, keine Studie. Der hier verwendete Schluss ist begrenzt. Ist das Ziel eines Produkts die Verweildauer bei der Aufgabe, kann eine Sitzung, die nach `C = 1` weiterläuft, erfolgreich aussehen. Ist das Ziel `C`, ist dieselbe Sitzung Verschwendung oder Schaden. Die beiden Ziele sind in einem Tokenprotokoll beobachtungsmäßig nicht äquivalent. Kein Experiment in diesem Papier schätzt die Wohlfahrtslücke.

<div id="24-historical-cycles" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Historische Zyklen

Technologiemärkte zeigen oft eine spekulative Phase, eine Nutzungsphase und eine spätere Phase der Massenware. Die Evidenz ist ungleichmäßig.

Quinn (2019), „Technological revolutions and speculative finance: evidence from the British Bicycle Mania“, Cambridge Journal of Economics 43(2), 271-294, https://doi.org/10.1093/cje/bey029, untersucht Aktienkurse von Fahrradunternehmen von 1895 bis 1900. Die Kurse stiegen um über 200 Prozent und fielen dann um mehr als 75 Prozent. Das Ergebnis des Papiers betrifft spekulative Finanzierung und Fundamentaldaten, nicht ein gemessenes Prädikat „genug Fahrrad“ für Haushalte. Es als Bild der Finanzierung in der Wettlaufphase zu verwenden, ist gestützt. Es als Beweis einer Sättigung im Verkehr zu verwenden, ist es nicht.

Autos, Linienflugverkehr und Fernsehen haben Märkte mit Massenwarencharakter im alltäglichen Sinn: Gebrauchtfahrzeuge, ertragsgesteuerte Sitzplätze und Panels, die als Vorleistungen für Inhalte verkauft werden. Die Zeilen dienen der historischen Orientierung. Sie sind keine Regressionen. Das Ertragsmanagement der Fluggesellschaften nach der Deregulierung ist eine Preisinstitution für einen Sitzplatz, was Evidenz für einen Massenwarenmarkt für Sitzplätze ist, nicht Evidenz dafür, dass die Reisenachfrage der Passagiere global gesättigt ist.

Das Mobile-Faktenblatt des Pew Research Center (https://www.pewresearch.org/internet/fact-sheet/mobile/) ist die Sättigungsquelle für Telefone. Das Projektarchiv verzeichnet einen Smartphone-Besitz in den USA von nahezu 91 Prozent in den Lesungen der Faktenblätter von 2024 und 2025. Wer die Zahl zitiert, sollte das aktuelle Blatt öffnen, weil Faktenblätter überarbeitet werden. Hoher Besitz ist Evidenz für Diffusion. Er ist für sich genommen keine Evidenz dafür, dass der Grenzwert einer weiteren Telefonkamera null ist.

Die Zeile der digitalen Routineaufgabe ist diejenige, die dieses Papier mit einer Preisreihe statt mit einer Analogie verteidigt. Siehe Abschnitt 4.2.

<div id="25-inference-prices-and-open-weights" class="anchor-alias" aria-hidden="true"></div>

### 2.5 Inferenzpreise und offene Gewichte

Epoch AI (2025), „LLM inference price trends“, https://epoch.ai/data-insights/llm-inference-price-trends, berichtet Preisrückgänge bei fester Leistung in der Größenordnung des 9- bis 900-Fachen pro Jahr über die Benchmarks in dieser Notiz. Emberson und Roodman für Epoch AI (2026), „The plunging price of thought“, https://epoch.ai/publications/the-plunging-price-of-thought, berichten einen Rückgang der Kosten einer gegebenen Leistung um etwa 47 Prozent pro Quartal seit etwa 2023, zusammengefasst als etwa das 13-Fache pro Jahr, schneller nahe der Frontier. Das sind die Zusammenfassungen der Autoren zu ihren Daten. Dieses Papier schätzt den Index nicht neu. Die ökonomische Lesart ist eng: Der Geldpreis der Synthese für eine feste gemessene Leistung ist schnell gefallen. Ein fallender Angebotspreis verschiebt die nachgefragte Menge, wenn die Nachfrage elastisch ist. Er schafft kein neues Vollständigkeitsprädikat, und er setzt den Energiepreis nicht auf null.

Werkzeuge der Klasse System One sind als Mechanismus für eine weitere Preissenkung bei Entscheidungsproblemen mit bekannter Optionsmenge relevant. Ein System-One-Modell liefert in einem Vorwärtsdurchlauf eine typisierte Antwort und eine Wahrscheinlichkeit für jede zulässige Option, ohne freien Text. TypeSafe AI benannte die Kategorie mit seinem gehosteten Modell Jev (15. September 2026). Offene Modelle folgten, darunter Laya von Convai Innovations. Ein System-One-Modell schlägt vor. Es ist keine Vollständigkeitsprüfung.

Eine Faustregel der Planung, nach der Frontier-Kompetenz in etwa sechs Monaten billigere Geräte erreicht, ist in diesem Archiv keine gemessene Konstante. Destillation, Quantisierung und Inferenz per Tabellennachschlag (Ma et al., 2024; Wei et al., 2024) sind veröffentlichte Mechanismen, durch die eine gegebene Kompetenz auf billigere Hardware wandern kann. Die Geschwindigkeit ist eine empirische Frage je Modellpaar.

<div id="26-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### 2.6 Physikalische Kosten

Landauer (1961) beschränkt das Löschen. Bennett (1973) zeigt, dass reversible Berechnung diese Schranke theoretisch vermeiden kann. Horowitz (2014) ist die praktische Aussage für CMOS: Energie pro Operation und Energie der Datenbewegung setzen die Entwurfsgrenze, viele Größenordnungen oberhalb von `kT ln 2` für irreversible CMOS-Logik. Der OpCounter des Begleitpapiers implementiert `J = sum count * E` mit Konstanten wie `E_LUT_READ = 1e-12` Joule. Diese Konstanten sind ein Modell. Das Begleitpapier gibt für eine Spielzeugepisode die analytische Gesamtsumme von Seed 1 an, 8.6795e-10 Joule. Diese Zahl in ein Nachfragepapier zu übernehmen, würde nicht zeigen, dass die Ausgaben nach dem Fertigsein groß sind. Es würde nur zeigen, dass das Modell des Spielzeugtors diese Summe geliefert hat. Dieses Papier behandelt das Joule des Begleitpapiers deshalb nicht als Sättigungsmessung.

Goldman Sachs veröffentlichte eine Research-Notiz mit dem Titel „Gen AI: Too Much Spend, Too Little Benefit?“ (https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit). Dass eine bedeutende Sell-Side-Notiz existiert, die Infrastrukturausgaben im Verhältnis zum Nutzen infrage stellt, ist eine Dokumententatsache. Dollarbeträge aus der Notiz werden hier nicht zitiert, weil Sell-Side-Schätzungen keine wissenschaftliche Energiebilanz sind.

<div id="27-commit-records-as-the-interface-not-the-demand-estimate" class="anchor-alias" aria-hidden="true"></div>

### 2.7 Commit-Datensätze als Schnittstelle, nicht als Nachfrageschätzung

Das Begleitpapier spezifiziert Vorschlag, Zertifikat, Ablehnungsgrund und Commit-Entscheidung. Zu den Kompositionsmodi gehören LUT-Freigabe und Energie, mit optionaler CBF. Zu den Ablehnungsgründen gehören `policy` und `budget_exceeded` sowie `energy_veto`. Diese Taxonomie kann Aufgabenabschluss und physikalische Ablehnung als verschiedene Codes darstellen. Darstellung ist keine Identifikation. Ein Code, der auslöst, beweist nicht, dass ein Mensch an einem Bliss-Punkt war. Er beweist, dass die Laufzeit den Schritt nach einer Regel eingeordnet hat, die jemand installiert hat.

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## 3. Definitionen und Methoden

<div id="31-predicates" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Prädikate

Eine Episode sei eine Folge von Modell- oder Werkzeugaufrufen `z_1, ..., z_T` zusammen mit einem dem Menschen zugewandten Zustand. Ein Vollständigkeitsprädikat `C` bildet das Präfix der Episode auf `{0, 1}` ab. Beispiele, die sich ohne Modellbewertung aufschreiben lassen:

- Arbeit: Die Tests bestehen und die Änderung ist gemergt; oder die Abweichung im Hauptbuch ist null; oder die Pflichtfelder eines Berichts sind ausgefüllt und der Bericht ist eingereicht.
- Pflege: Die Medikationsliste stimmt mit der Quelle überein, die übernehmende Klinikerin oder der übernehmende Kliniker hat die Notiz, und die Punkte der Sicherheitscheckliste, die die Einrichtung als kritisch markiert hat, sind wahr.

`C` ist keine Wahrscheinlichkeit. Ein Detektor, der eine Bewertung ausgibt, braucht noch eine Schwelle und eine Fehlertabelle, bevor er ein Prädikat im Sinn des fehlenden Experiments aus Abschnitt 4 ist.

Das interne Ereignis **ökonomisch fertig** zum Zeitpunkt `t*` bedeutet für den gewählten Test `C = 0` auf dem Präfix vor `t*` und `C = 1` bei `t*`. Dieses Papier nennt die Katalogschicht **Aufgabenabschluss**. Sättigung in Bezug auf Modellaufrufe bedeutet, dass für alle `t > t*` zusätzliche Aufrufe keine Klausel von `C` von falsch auf wahr umschalten. Aufrufe, die `C` rückgängig machen, sind Schaden, kein Wert. Die Definition sagt nicht, dass Menschen `t*` immer kennen. Sie sagt, dass die Sättigungsbehauptung, solange kein `C` aufgeschrieben ist, noch keine Aussage über dieses Produkt ist.

An der Grenze kostenlos ist eine Aussage über den Geldpreis. Sei `p_t(q)` der Preis der Syntheseleistung `q` zum Datum `t`. Die archivierte Preisevidenz lautet, dass `p_t` für feste Benchmarkleistung mit den Raten gefallen ist, die Epoch berichtet. An der Grenze kostenlos heißt, dass `p_t` niedrig genug ist, dass eine Lizenzplatz-Lizenz die Kosten dieser Routineaufgabe nur schwach erklärt. Es heißt nicht, dass das Integral der Leistung über die Zeit null ist.

Ablehnungsgründe in der Referenz:

```text
physical:  lut_veto, energy_veto, cbf_veto
economic:  budget_exceeded, policy
```

Die Mengenvereinigung in Worten lautet: Die Laufzeit lehnt ab, wenn die ökonomische Regel auslöst oder die physikalische Regel auslöst. Die Implementierung ist ein Zertifikat, kein Satz. Einzelheiten des physikalischen Konjunkts stehen im Begleitpapier, einschließlich der Simulation mit Seed 1 und des Safe-Fixpunktresiduums.

<div id="32-what-was-done-in-this-study" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Was in dieser Studie getan wurde

Diese Studie ist eine strukturierte Lektüre. Quellen sind das am 29. bis 30. September 2026 im Projekt geprüfte Zitationsgerüst, die Notizen zur Sättigung und der Softwaredatensatz des Begleitpapiers. Abschnitt 3.3 nennt die Messungen, die die operationale Definition empirisch machen würden.

Die Gestaltungsregeln in Abschnitt 4.10 sind Empfehlungen unter der Bedingung der Definitionen. Sie sind keine geschätzten Behandlungseffekte. Man kann eine Regel ablehnen, ohne die Preisreihe von Epoch abzulehnen, und die Preisreihe annehmen, ohne eine Produktempfehlung anzunehmen.

<div id="33-measurements-specified-and-not-taken" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Spezifizierte, nicht durchgeführte Messungen

**Das Prädikat ist endogen.** Witt (2001) argumentiert, dass Wünsche gelernt werden, sodass das Vollständigkeitsprädikat $C(z)$ mit fallendem Preis nachrücken kann. Eine Studie der Sättigung über eine Preisänderung hinweg muss $C(z)$ deshalb vor der Änderung in ihrer Präregistrierung einfrieren und jede Änderung des Prädikats als gesonderte Behandlung berichten.

**H1 lässt sich jetzt aus öffentlichen Daten ablesen.** Chen und Kollegen (2024) messen die Token, die nach der ersten korrekten Antwort ausgegeben werden; Cuadron und Kollegen (2025) bewerten das Überdenken in Agententrajektorien; Bai, Huang und Wang (2026) finden, dass der Tokenverbrauch für dieselbe Aufgabe beim agentischen Programmieren über Läufe hinweg um bis zum 30-Fachen schwankt. Wendet man das $C(z)$ dieses Papiers nachträglich auf diese Trajektorien an, erhält man eine explorative Schätzung von H1, als explorativ gekennzeichnet. Sie ist die nächste Messung.

**Token und Joule.** H1 und H2 sind in Token formuliert; die These ist in Joule formuliert. Masanet und Kollegen (2020) fanden, dass die Rechenleistung von Rechenzentren von 2010 bis 2018 etwa auf das Sechsfache wuchs, während die Energie weit weniger stieg; eine Token-Elastizität ist also keine Energie-Elastizität. Jede Hypothese ist in beiden Einheiten zu berichten, mit Nennung der Einheit, die die Daten identifizieren.

1. Aufgeteilte Bilanz. Für jede Episode die analytische oder später auf der Platine gemessene Energie für Aufrufe mit `t <= t*` und für Aufrufe mit `t > t*` summieren. Direkter Rebound bei dieser Routineaufgabe ist nur sichtbar, wenn das Integral nach dem Fertigsein geschätzt wird. Das Repository enthält diese Aufteilung nicht.
2. Detektorfehler. Auf einem gelabelten Korpus falsches Fertig (Prädikat für wahr erklärt, während eine Klausel falsch ist) und falsches Weiter (`C` wahr, und das System ruft weiter auf). Hier werden keine Raten veröffentlicht.
3. Pflegeübergabe. Zeit bis zum sicheren Zustand und eine Übergabecheckliste, gegenübergestellt der Sitzungsdauer. Nicht gemessen.
4. Segmenttabelle. Welche Produkte ein kurzes `C` haben und welche offene Forschung oder gegnerische Wettläufe sind. Nicht geschätzt. Der militärische Fall wird in Abschnitt 5 aus der Sättigungsbehauptung ausgeschlossen, statt in sie hineingezwungen zu werden.
5. Platinenenergie. Stufe C in Anhang B. Nicht durchgeführt.

Solange diese nicht existieren, sind Sätze über „Overkill-Joule“ Hypothesen. Sätze über die Preise von Epoch sind Zitate.

<div id="34-illustrative-episodes-not-data" class="anchor-alias" aria-hidden="true"></div>

### 3.4 Veranschaulichende Episoden, keine Daten

Support-Desk. Vollständigkeit: Das Anliegen der Kundin oder des Kunden ist gelöst, die Antwort ist gesendet und der Ticketstatus ist Done. Weitere Entwürfe verändern `C` nicht. Ein Tokenzähler kann trotzdem weiterzählen. Die Episode ist ein konstruiertes Beispiel, das die Variablen zeigt. Sie ist keine Stichprobe aus einem Helpdesk.

Pflegeübergabe. Vollständigkeit: kritische Felder ausgefüllt, Medikationsliste abgeglichen, übernehmende Stelle bestätigt, Person in einem sicheren Zustand. Die Sitzungsdauer ist eine andere Variable. Die Episode ist konstruiert. Kein Krankenhausdatensatz wurde analysiert.

Programmier-Routineaufgabe. Vollständigkeit: Das Artefakt stimmt mit einem schriftlichen Orakel überein (Tests oder eine bitgenaue Prüfung). Ein bestehendes Artefakt neu zu generieren, erhöht `C` nicht. Die LUT-Prüfung des Begleitpapiers ist eine Instanz eines schriftlichen Orakels für ein Tor, keine Instanz ökonomischer Sättigung.

<div id="35-instrument-path-for-the-physical-residual" class="anchor-alias" aria-hidden="true"></div>

### 3.5 Messpfad für das physikalische Residuum

Wenn eine Behauptung Joule betrifft, muss die Messklasse genannt werden. Das Begleitpapier definiert drei Stufen.

Stufe A, vorhanden: Rust-Simulation und Icarus-Verilog-Simulation. Nur analytische Energie.

Stufe B, ausgeliefert: WASM-Kompilierung des Entscheidungskerns und eine WebGPU-Ansicht der LUT und der Commit-Spur unter https://research.openie.dev/living/fpga-sim/. WebGPU-Zeit ist keine Energie. Abnahmekriterium ist die Übereinstimmung mit Stufe A bei veröffentlichten Episoden (Seed 1: 1 Commit, 15 Ablehnungen, analytische J 8.6795e-10).

Stufe C: Platine für die Commit-Tor-Demo des Begleitpapiers programmiert (Pendel im geschlossenen Regelkreis mit LUT-Freigabe, Safe PH und Ames-Energiemengen-CBF); Energie weiterhin ungemessen. Der Alchitry Pt V2 hat keinen eingebauten Joule-Messer. Übereinstimmung der Entscheidungen über UART ist keine Wattablesung. Herstellerangaben auf der Seite von SparkFun (XC7A100T-2FGG84I, 101,440 Logikzellen, 240 DSP48E1-Slices, 4,860 Kb Block-RAM, 256 MB DDR3L) sind keine Energieergebnisse eines Prüflings. Messmethoden: Leitfaden des Begleitpapiers [/living/fpga-sim/alchitry/#energy](https://research.openie.dev/living/fpga-sim/alchitry/#energy).

Dieses Papier fügt eine Zuordnung hinzu, keine vierte Stufe. Der Aufgabenabschluss sollte, wenn er als `policy` oder `budget_exceeded` codiert ist, in derselben Spur erscheinen wie `energy_veto`, damit eine künftige Aufteilung (Abschnitt 3.3) Begründungscodes gruppieren kann. Die Browseransicht würde diese Gruppierung lesbar machen. Sie würde den fehlenden Korpus nicht erzeugen, und die Energie der Platine bleibt ungemessen.


<div id="28-fidelity-criteria-and-stop-rules" class="anchor-alias" aria-hidden="true"></div>

<div id="36-fidelity-criteria-and-stop-rules" class="anchor-alias" aria-hidden="true"></div>

### 3.6 Treuekriterien und Halteregeln

Shannon (1959) definiert eine Rate-Distortion-Funktion: die kleinste Beschreibungsrate, die die erwartete Verzerrung auf oder unter einer gewählten Treue hält. Gegenstand ist Kommunikation unter einer Nebenbedingung, die die Nutzerin oder der Nutzer festlegt. Es ist keine Nachfragekurve für Intelligenz. Die Ähnlichkeit mit diesem Papier ist nur strukturell. Ein Vollständigkeitsprädikat `C` ist eine harte Treue: Entweder gelten die formulierten Klauseln oder nicht. Ein Verlust eines Sprachmodells steht einer mittleren Verzerrung auf einer Trainingsverteilung näher. Fallender Verlust und fallender Preis bei festem Benchmark lassen sich als Bewegung entlang einer Raten-Ressourcen-Kurve der Art lesen, die Kaplan et al. (2020) und Hoffmann et al. (2022) für das Training schätzen. Diese Bewegung wählt kein `C` für eine bestimmte Routineaufgabe. Benchmarkverzerrung mit der Vollständigkeit einer Routineaufgabe zu verwechseln, ist der Kategorienfehler hinter Plänen mit unbegrenzten Lizenzplätzen für abgeschlossene Arbeit.

Cover und Thomas (2006) ist der Lehrbuchweg in die Rate-Distortion-Theorie, wenn man die formale Entwicklung möchte. Das Papier nutzt die Existenz des Treuebegriffs, um zwei Zahlen auseinanderzuhalten: eine Bewertung, die sich immer um einen Bruchteil verbessern lässt, und ein Prädikat, das bereits wahr ist.

<div id="29-rebound-taxonomy-without-a-new-estimate" class="anchor-alias" aria-hidden="true"></div>

<div id="37-rebound-taxonomy-without-a-new-estimate" class="anchor-alias" aria-hidden="true"></div>

### 3.7 Rebound-Taxonomie, ohne neue Schätzung

Der Rebound-Kanon ist der Rahmen für H2. Khazzoom (1980) zeigte, dass vorgeschriebene Effizienz die Nutzung der Leistung erhöhen kann, Brookes (1990) argumentierte dasselbe auf Ebene der Volkswirtschaft, und Saunders (1992) leitete die Bedingungen im neoklassischen Wachstum her. Sorrell und Dimitropoulos (2008) gaben die mikroökonomischen Definitionen und ihre Grenzen an. Brockway, Sorrell, Semieniuk, Heun und Court (2021) prüften die Evidenz und fanden, dass gesamtwirtschaftlicher Rebound mehr als die Hälfte der erwarteten Energieeinsparungen aufzehren kann. Aufgabensättigung widerspricht diesem Befund nicht. Sie ist ein Halt je Aufgabe, und der aggregierte Rebound von H2 ist der Ort, an dem die Evidenz des Kanons gilt. Beleuchtung ist der historische Fall, an dem sie zu prüfen ist: Fouquet und Pearson (2006) verfolgen sieben Jahrhunderte des Preises und der Nutzung von Licht im Vereinigten Königreich, und Tsao und Kollegen (2010) finden, dass die Nutzung von Licht mit der Effizienz stieg, eine sättigbare Leistung mit großem Rebound.

Die Rebound-Übersicht von Gillingham, Rapson und Wagner trennt Kanäle, die ein einzelnes Schlagwort zusammenfallen lässt. Direkter Rebound ist zusätzliche Nutzung derselben Leistung, wenn ihre effektiven Kosten fallen. Indirekter Rebound ist das Ausgeben eingesparter Ressourcen für andere Leistungen. Gesamtwirtschaftlicher Rebound läuft über Preise und Wachstum. Das Politikfeld der Übersicht ist Energieeffizienz, nicht Token. Die Taxonomie überträgt sich dennoch als Warnung zur Identifikation. Ein gemessener Fall von `p_t` (Behauptung S-2) identifiziert für sich genommen keinen der drei Kanäle. Direkter Rebound bei einer Routineaufgabe, deren `C` bereits wahr ist, setzt voraus, dass Käufer weiterhin für Aufrufe zahlen, die `C` nicht verändern. Indirekte und gesamtwirtschaftliche Kanäle können groß sein, wenn neue Aufgaben entstehen (Acemoglu und Restrepo, 2019). Ein Papier, das eine Elastizität berichtete und sie „den Rebound“ nennte, wäre unterbestimmt. Dieses Papier berichtet keine Elastizität.

Das Muster ist alt. Jevons argumentierte 1865, dass effizientere Dampfmaschinen den gesamten Kohleverbrauch Großbritanniens erhöhen statt senken würden. Alcott verfolgt dieses Argument und die anschließende Debatte (*Ecological Economics* 54(1), 2005). Nordhaus maß den Preis der Berechnung über mehr als ein Jahrhundert und fand, dass er um viele Größenordnungen fiel, während die gesamte Berechnung stieg (*Journal of Economic History* 67(1), 2007). Agentenlasten zeigen bereits die Nutzungsseite. Das Engineering-Team von Anthropic berichtete für sein eigenes System, dass Agenten etwa das 4-Fache der Token einer Chat-Interaktion verwenden und Multiagentensysteme etwa das 15-Fache (13. Juni 2025). Diese Zahl ist vom Betreiber berichtet, nicht geprüft. Sie ist damit vereinbar, dass der Appetit je Aufgabe steigt, wenn Aufgaben ihre Gestalt ändern, und genau das muss die aufgeteilte Bilanz aus Abschnitt 3.3 von Verschwendung nach dem Abschluss trennen.

<div id="210-scarce-joules-and-the-economic-stop-20252026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="210-scarce-joules-and-the-economic-stop-2025-to-2026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="38-scarce-joules-and-the-economic-stop-2025-to-2026-peers" class="anchor-alias" aria-hidden="true"></div>

### 3.8 Knappe Joule und der ökonomische Halt (Fachliteratur 2025 bis 2026)

Die Preisreihen von Epoch (S-2) zeigen, dass Synthese in Geld billiger wird. Neuere Energiepublikationen zeigen, dass Joule knapp bleiben und im Aggregat oft wachsen.

Chung, Wu, Ma und Chowdhury (arXiv:[2601.22076](https://arxiv.org/abs/2601.22076), 2026) diagnostizieren die Inferenzenergie über 1,858 Konfigurationen: Der Aufgabentyp allein kann die LLM-Energie pro Antwort um etwa 25× verschieben; Videogenerierung kann die Energie für Bilder um zwei Größenordnungen übertreffen. Der *Joule*-Artikel „Energy use of AI inference, efficiency pathways, and test-time scaling“ ([cell.com/joule/fulltext/S2542-4351(26)00114-5](https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5), online am 22. Apr. 2026) schätzt optimierte Anfragen im Frontier-Maßstab im Medianbereich unter einer Wattstunde und berichtet zugleich, dass lange Reasoning- und agentische Anfragen die Energie um mehr als eine Größenordnung erhöhen können; Effizienzgewinne von 8 bis 20× sind absehbar, keine kostenlosen Joule. Luccioni, Strubell und Crawford (FAccT 2025) ([doi:10.1145/3715275.3732007](https://doi.org/10.1145/3715275.3732007)) warnen, dass Effizienz ohne Halt die Gesamtausgaben verstärken kann (Jevons). Der Energieüberblick von Epoch AI ([epoch.ai/publications/ai-energy](https://epoch.ai/publications/ai-energy), aktualisiert im Juli 2026) trennt moderate Kosten pro Anfrage von der sich rasch verdoppelnden aggregierten Leistung der Rechenzentren.

**Lesart für dieses Papier.** An der Grenze kostenlos ist eine Aussage über den Geldpreis. Knappe Joule sind eine physikalische Aussage. Der operationale Halt ist der Aufgabenabschluss: Wenn `C(z) = 1`, erhöht weitere Synthese das schriftliche Ziel nicht, und eine Ablehnung mit `policy` / `budget_exceeded` ist ein Erfolg. [Notational Intelligence](/papers/gates/) ist für das physikalische Zertifikat zuständig. [Mixture of Limits](/papers/gates/#part-ii-the-cascade-mixture-of-limits) navigiert die billigsten ausreichenden Gänge. [Metabolic Intelligence](/products/mei/) ist für die Aktoren der Hülle zuständig. Schätzungen sind kein auf der Platine gemessenes `measured_j`.

<div id="36-protocol-for-a-done-detector-study-not-executed" class="anchor-alias" aria-hidden="true"></div>

<div id="39-protocol-for-a-done-detector-study-not-executed" class="anchor-alias" aria-hidden="true"></div>

### 3.9 Protokoll für eine Studie zum Fertig-Detektor (nicht ausgeführt)

Das folgende Protokoll ist eine Methode für eine künftige Messung. Kein Schritt wurde ausgeführt. Es ist so geschrieben, dass das fehlende Ergebnis ein Ausstiegskriterium hat statt eines Schlagworts.

Population. Episoden aus einer einzigen Produktoberfläche, keine Mischung aus offener Forschung und Ticketabschluss. Jede Episode hat ein schriftliches `C` mit endlich vielen Klauseln, jede Klausel beobachtbar für eine Person, die das Modell nicht bedient hat. Die Zielgröße ist eine Entwurfsentscheidung; dieses Papier gibt nicht vor, dass eine Poweranalyse durchgeführt wurde. Eine erste brauchbare Tabelle braucht genug positive und negative Fälle, dass eine Rate keine Einzelanekdote ist. Das Archiv enthält diese Tabelle nicht.

Label. Zwei Annotierende markieren jede Klausel als wahr oder falsch zu dem Zeitpunkt, an dem das System zum ersten Mal fertig meldet, und noch einmal am Ende der Sitzung. Abweichungen werden entschieden und gezählt. Die Entscheidung des Detektors wird getrennt vom Label erfasst.

Primäre Raten.

- Falsches Fertig: Das System meldet `C = 1`, während eine kritische Klausel falsch ist.
- Falsches Weiter: Alle kritischen Klauseln sind wahr, und das System setzt weitere Modell- oder Werkzeugaufrufe ab.
- Sitzungsdauer und Aufrufanzahl sind Kovariaten, keine Endpunkte.

Sekundäre Aufteilung, nur wenn eine Energiebilanz existiert. Die Energie, analytisch oder auf der Platine gemessen, für Aufrufe vor dem entschiedenen `t*` und danach summieren. Die Messklasse im selben Satz wie die Zahl nennen. Eine analytische OpCounter-Summe ersetzt kein Messgerät und ist nicht mit den Tabellen von Horowitz vergleichbar.

Ausschluss. Episoden ohne schriftliches `C` werden nicht als „ungesättigt“ gelabelt. Sie liegen außerhalb des Umfangs. Gegnerische Episoden liegen außerhalb des Umfangs für den Sättigungsendpunkt und können dennoch auf physikalische Ablehnung bewertet werden, wenn ein Zertifikat vorliegt.

Scheitern des Protokolls. Können sich die Annotierenden nicht auf Klauseln einigen, war das Prädikat nicht aufgeschrieben. Hat das System kein Ereignis, mit dem es fertig meldet, ist falsches Weiter nicht identifiziert. Statt der beiden Raten eine Modell-Bestenliste zu veröffentlichen, würde dieses Protokoll nicht ausführen.

<div id="37-a-numerical-illustration-of-a-bliss-point-model-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

<div id="310-a-numerical-illustration-of-a-bliss-point-model-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

### 3.10 Ein numerisches Beispiel für einen Bliss-Punkt (Modell, keine Anpassung)

Eine Koordinate `x` sei die Anzahl der Modellaufrufe für eine einzelne Routineaufgabe, und es sei

```text
U(x) = -(x - 4)^2
```

für eine Routineaufgabe, deren konstruiertes Maximum bei vier Aufrufen liegt. Dann gilt `U(0) = -16`, `U(4) = 0`, `U(8) = -16`. Der Grenznutzen ist `dU/dx = -2(x - 4)`, positiv vor 4, null bei 4 und negativ danach. Das Beispiel verwendet ganze Zahlen, damit der Vorzeichenwechsel ohne Anpassung sichtbar ist. Kein Datensatz wurde zur Wahl von 4 verwendet. Ersetzt man 4 durch eine andere ganze Zahl, verschiebt sich der Gipfel, die Definition ändert sich nicht. Eine Produktmetrik gleich `x` stuft `x = 8` über `x = 4` ein. Eine Produktmetrik gleich `U` tut das Umgekehrte. Behauptung S-3 ist diese Nichtidentität, hier in einer vollständig spezifizierten Spielzeugfunktion und in Abschnitt 3.4 in konstruierten Episoden. Keines von beiden ist eine Wohlfahrtsschätzung für ein Unternehmen.

Ein Tokenpreis lässt sich anfügen, ohne Einheiten zu verwechseln. Angenommen, ein Aufruf kostet `p` in Geld und der Käufer zahlt `p * x`, während der Wert `U` folgt. Der Näherungswert für die Käuferrente `U(x) - p x` hat für jedes `p >= 0` weiterhin einen endlichen Maximierer. Ein Fall von `p` verschiebt den Maximierer, das ist die Rebound-Logik an diesem Spielzeug, und der Maximierer bleibt endlich. Das Spielzeug sagt nicht, wo der Maximierer für einen realen Käufer liegt. Es blockiert den Schluss, dass ein niedrigeres `p` das Maximum beseitigt.

Abbildung 1 zeichnet das Spielzeugmodell und die gesonderte Aussage zum Aggregat.

![Links: Modellillustration eines Bliss-Punkts. Der Wert U von x ist minus x minus 4 zum Quadrat, mit dem Überschuss U minus p x bei den Preisen 0, 2 und 4; die Maximierer sind 4, 3 und 2 Aufrufe, endlich bei jedem Preis. Rechts: ein Schema des aggregierten Rebounds, bei dem niedrigere Preise mehr Aufgaben eröffnen, von denen jede dennoch an ihrem eigenen Prädikat endet.](/figures/satiation/satiation-rebound.svg)

*Abbildung 1. Aufgabensättigung und aggregierter Rebound. Modellillustration des Spielzeugmodells dieses Abschnitts, keine Anpassung: Der Maximierer von $U(x) - p\,x$ ist $x = 4 - p/2$, endlich bei jedem Preis. Das rechte Feld ist ein Schema; dieses Papier schätzt keinen Rebound. Eine [PNG-Kopie](/figures/satiation/satiation-rebound.png) ist verfügbar.*

<div id="38-reason-codes-as-a-partition-not-a-welfare-function" class="anchor-alias" aria-hidden="true"></div>

<div id="311-reason-codes-as-a-partition-not-a-welfare-function" class="anchor-alias" aria-hidden="true"></div>

### 3.11 Begründungscodes als Partition, nicht als Wohlfahrtsfunktion

`R` sei die Menge der Ablehnungscodes in einer Spur. Man partitioniere `R` in `R_econ = {policy, budget_exceeded}` und `R_phys = {lut_veto, energy_veto, cbf_veto}`, passend zur Taxonomie des Schemas. Andere Codes müssen, falls sie später hinzukommen, schriftlich zugeordnet werden, bevor sie gezählt werden. Ein Intervall der Spur trägt nur dann zur ökonomischen Ablehnung nach dem Fertigsein bei, wenn `C` bereits 1 ist und der Code in `R_econ` liegt. Es trägt zur physikalischen Ablehnung bei, wenn der Code in `R_phys` liegt, unabhängig davon, ob `C` gleich 1 ist. Eine unsichere Aktion nach dem Fertigsein gehört zu beiden Geschichten und sollte in beiden Spalten gezählt werden, nicht gemittelt. Die irreversible Ablehnung der MCP-Demo ist ein physikalisches Beispiel: Energie- und Barrierecodes, 0 Aufrufe des Ausführenden. Sie ist kein Beispiel für `R_econ`. Eine künftige Episode mit `policy` nach einem gemergten Patch wäre das ökonomische Beispiel. Das Repository enthält diese Episode nicht. Die Partition legt fest, wie sie bewertet würde.


<div id="4-evidence" class="anchor-alias" aria-hidden="true"></div>

## 4. Evidenz

<div id="41-claim-s-1-satiation-is-a-defined-economic-object" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Behauptung S-1. Sättigung ist ein definiertes ökonomisches Objekt

Andersen (2001), https://doi.org/10.1007/PL00003852, und die Lehrbuchkonstruktion des Bliss-Punkts in Abschnitt 2.1 stützen S-1. Die Behauptung ist theoretisch. Sie ist keine gemessene Nutzenfunktion für irgendeine Nutzerpopulation in dieser Studie.

<div id="42-claim-s-2-published-inference-prices-fell-sharply-at-fixed-performance" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Behauptung S-2. Veröffentlichte Inferenzpreise fielen bei fester Leistung stark

Gestützt durch Epoch AI (2025) und Emberson und Roodman (2026), mit den Größenordnungen, die diese Notizen angeben (Abschnitt 2.5). Die Behauptung betrifft Preisindizes, die diese Autoren veröffentlichen. Sie behauptet nicht, dass die Rechnung jeder Organisation um das 13-Fache gefallen ist, und sie ist keine Behauptung über Watt.

<div id="43-claim-s-3-engagement-variables-are-not-the-completeness-predicate" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Behauptung S-3. Engagement-Variablen sind nicht das Vollständigkeitsprädikat

Gestützt durch die Definitionen in Abschnitt 3.1 und durch die Beschreibung von Zielen der Verweildauer in der Aufmerksamkeitsliteratur (Wu; Überblick des Center for Humane Technology). Keine kausale Schätzung eines Wohlfahrtsverlusts wird beansprucht. Die logische Behauptung ist die Nichtidentität der Variablen: Die Tokenanzahl kann steigen, während `C` konstant bleibt. Die konstruierten Episoden in Abschnitt 3.4 veranschaulichen die Nichtidentität, sie sind keine Datensätze.

<div id="44-claim-s-4-bicycle-mania-prices-detached-from-a-simple-fundamental-story" class="anchor-alias" aria-hidden="true"></div>

### 4.4 Behauptung S-4. Die Kurse der Fahrradmanie lösten sich von einer einfachen Fundamentalgeschichte

Gestützt durch Quinn (2019): Anstiege von über 200 Prozent und anschließende Rückgänge von über 75 Prozent bei Fahrradaktien von 1895 bis 1900, in den Tests dieses Papiers weder vollständig durch Fundamentaldaten noch durch eine einfache Risikoverschiebung erklärt. Die Behauptung endet dort. Sie quantifiziert keine Sättigung der Haushalte mit Fahrrädern.

<div id="45-claim-s-5-us-smartphone-ownership-is-high-in-the-cited-fact-sheet" class="anchor-alias" aria-hidden="true"></div>

### 4.5 Behauptung S-5. Der Smartphone-Besitz in den USA ist im zitierten Faktenblatt hoch

Die Lesung des Mobile-Faktenblatts von Pew im Projektarchiv ergibt einen Besitz von nahezu 91 Prozent für die Zeilen 2024 und 2025. Die in diesem Papier verwendete Behauptung ist eine Diffusion in dieser Größenordnung, unter der Bedingung, dass das aktuelle Blatt mit dem Archiv übereinstimmt. Sie ist eine Sättigungstatsache über Besitz, keine Schätzung eines Bliss-Punkts.

<div id="46-claim-s-6-care-is-not-priced-as-a-pure-software-good-by-the-baumol-framework" class="anchor-alias" aria-hidden="true"></div>

### 4.6 Behauptung S-6. Pflege wird im Rahmen von Baumol nicht als reines Softwaregut bepreist

Baumol (1967) liefert den Rahmen. Acemoglu und Restrepo (2019) liefern die Sprache der Aufgaben. Die Behauptung lautet, dass diese Rahmen kein Ende der Anforderungen der Pflege an Arbeit, Vertrauen oder Haftung implizieren, wenn Tokenpreise fallen. Die Behauptung ist keine Prognose der Gesundheitsausgaben.

<div id="47-claim-s-7-a-sell-side-note-questions-spend-versus-benefit" class="anchor-alias" aria-hidden="true"></div>

### 4.7 Behauptung S-7. Eine Sell-Side-Notiz stellt Ausgaben dem Nutzen gegenüber infrage

Die in Abschnitt 2.6 genannte Seite von Goldman Sachs existiert und rahmt die Frage in ihrem Titel.

<div id="48-claim-s-8-the-reference-can-encode-both-stop-types" class="anchor-alias" aria-hidden="true"></div>

### 4.8 Behauptung S-8. Die Referenz kann beide Arten des Halts codieren

Schema- und Demo-Evidenz stehen im Begleitpapier. `policy` und `budget_exceeded` sind Begründungscodes in der Ablehnungstaxonomie. `energy_veto` wird in `artifacts/mcp_gate_demo.json` und in `commit_decision_refuse.json` demonstriert, wo eine wahre LUT-Freigabe dennoch ablehnt und die Anlagenaktion auf null setzt. Der MCP-Ablehnungsfall ruft den Ausführenden nicht auf. Das sind Softwaretatsachen über die Referenz. Sie zeigen nicht, dass irgendein Unternehmen die Ausgaben nach dem Fertigsein gesenkt hat.

<div id="49-claim-s-9-physical-law-is-not-priced-to-zero-by-epoch" class="anchor-alias" aria-hidden="true"></div>

### 4.9 Behauptung S-9. Physikalisches Gesetz wird von Epoch nicht auf null bepreist

Landauer (1961) und Horowitz (2014) stützen eine dauerhafte Lücke zwischen einer idealen Löschschranke und der CMOS-Praxis. Das analytische Modell des Begleitpapiers ist ein drittes Objekt, weder die Schranke noch eine Platine. S-9 sagt nur, dass ein Zitat von Epoch ein Zitat von Landauer nicht erledigt.

<div id="410-design-rules-marked-as-design" class="anchor-alias" aria-hidden="true"></div>

### 4.10 Gestaltungsregeln, als Gestaltung gekennzeichnet

Diese Regeln folgen, wenn man die Definitionen annimmt und ein Produkt will, das `C` optimiert statt Token. Sie sind keine Effekte.

1. `C` aufschreiben, bevor Modellkapazität hinzugefügt wird.
2. Einen Burggraben über den Synthesepreis als vorübergehend behandeln, wenn Reihen nach Art von Epoch und offene Gewichte auf diese Routineaufgabe zutreffen.
3. Analytische Joule der Stufe A, WASM-Spuren der Stufe B oder ein ungemessenes FPGA nicht als kostenlose Energie beschreiben.
4. Einen Detektor für `C` mit Fehlertabelle einer ungelabelten Vergrößerung des Modells vorziehen, sobald die Routineaufgabe das Produkt ist.
5. Die physikalische Erlaubnis auf dem im Begleitpapier definierten Zertifikat halten, wann immer der Aufruf irreversibel ist.
6. Energie vor und nach dem Fertigsein getrennt berichten, wenn die Aufteilung existiert. Sie existiert noch nicht.
7. Das Sättigungsprädikat nicht auf gegnerische oder militärische Wettläufe anwenden (Abschnitt 5.3).
8. Ist das Ziel des Produkts Aufmerksamkeit, das sagen. Die Vollständigkeitsbehauptungen gelten dann nicht.

K.-o.-Tests für eine Roadmap, ebenfalls Gestaltung: ein Plan, der unbegrenzten Appetit für eine Routineaufgabe mit kurzem `C` annimmt; ein Preis, der dauerhafte Knappheit der Synthese und keinen physikalischen oder haftungsbedingten Keil voraussetzt; eine Sicherheitsgeschichte, die nur eine Konfidenzzeichenkette verwendet; eine Behauptung „kostenlos“, die Joule streicht; eine Agentenschleife ohne `C`.

<div id="411-what-would-be-a-result-and-is-not" class="anchor-alias" aria-hidden="true"></div>

### 4.11 Was ein Ergebnis wäre und keines ist

Eine Tabelle der Raten von falschem Fertig und falschem Weiter. Eine Zeitreihe der Aufrufe nach `t*`. Eine Messgerätablesung am Alchitry Pt V2. Eine strukturelle Rebound-Schätzung. Ein AGI-Preisaufschlag, geschätzt an einer gesättigten Routineaufgabe. Nichts davon erscheint unter den gestützten Behauptungen in Abschnitt 4.


<div id="412-non-identity-stated-as-a-comparison-of-objectives" class="anchor-alias" aria-hidden="true"></div>

### 4.12 Nichtidentität, formuliert als Vergleich von Zielen

`x` sei die Aufrufanzahl, `s` die Sitzungsdauer, `J_pre` und `J_post` die Energie vor und nach dem entschiedenen Fertigsein und `C` das Prädikat. Die folgenden Implikationen sind definitorisch.

| Beobachtung | Impliziert nicht |
|-------------|----------------|
| `x` gestiegen | `C` gestiegen |
| `s` gestiegen | Wohlfahrt gestiegen |
| `p` gefallen (S-2) | `J_post = 0` |
| `C = 1` | die Fehlerrate des Detektors ist bekannt |
| physikalische Ablehnung ausgelöst (S-8) | das Vollständigkeitsprädikat galt |
| Besitz von Telefonen ist hoch (S-5) | der Grenzwert eines weiteren Modellaufrufs ist null |
| Kurse der Fahrradaktien boomten und brachen ein (S-4) | Haushalte erreichten einen Bliss-Punkt im Verkehr |

Die rechte Spalte ist die Liste der Schlüsse, die dieses Papier verweigert. Jede Beobachtung links ist entweder ein Zitat in Abschnitt 4 oder eine Variable in Abschnitt 3. Die Tabelle ist die Diskussion, verdichtet zu einer Prüfung. Ein Satz, der eine Behauptung der rechten Spalte aufstellt, hat die Evidenz verlassen.

<div id="413-companion-quantities-that-stay-in-the-companion" class="anchor-alias" aria-hidden="true"></div>

### 4.13 Größen des Begleitpapiers, die im Begleitpapier bleiben

Nur zum Querlesen: Das Begleitpapier berichtet eine Pendelsimulation mit Seed 1: 1 Commit, 15 Ablehnungen, analytische Energie 8.6795e-10 Joule und eine Safe-Prüfung mit null falschen Freigaben gegenüber dem Orakel `Vdot <= epsilon` auf seinem angegebenen Gitter, um den Preis von 79 falschen Ablehnungen bei 209,261 Entscheidungen. Diese Größen beantworten eine Regelungsfrage. Sie sind simuliert. Sie verwenden die analytischen Konstanten des Begleitpapiers. Sie werden hier aufgeführt, damit sie nicht als S-Behauptungen übernommen werden. Die Sättigung würde sie nur innerhalb der nicht ausgeführten Aufteilung aus Abschnitt 3.3 verwenden, und nur mit der Messklasse neben der Zahl.


<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>

## 5. Diskussion

<div id="51-rebound-the-central-identification-problem" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Rebound: das zentrale Identifikationsproblem

Drei Ergebnisse begrenzen das natürliche Experiment. Gundlach und Kollegen (2025) finden, dass Preise bei fester Benchmarkleistung schnell fallen, Frontier-Preise dagegen nicht, und Du (2026) findet einen Strukturbruch und einen Reasoning-Aufschlag in der Preisentwicklung, sodass Preissenkungen gebündelt mit Modellwechseln eintreffen. Der Economic Index von Anthropic (September 2025) berichtet, dass über Aufgaben hinweg jeder Anstieg der Kosten um 1% mit einem Rückgang der Nutzungshäufigkeit um 0.29% einhergeht, eine unelastische Querschnittszahl, keine Preisänderung über die Zeit. Ein Design auf Anbieterebene kann keinen Rebound auf Marktebene identifizieren; das Design braucht Preise und Mengen auf Marktebene.

Gillingham, Rapson und Wagner geben einen Überblick über Rebound aus Politik zur Energieeffizienz. Der Mechanismus ist die verbleibende Nachfrageelastizität. Fällt der Geldpreis der Synthese, steigt die Nutzung dort, wo Käufer eine weitere Einheit noch schätzen. An einem Bliss-Punkt für eine abgeschlossene Routineaufgabe ist die direkte Ableitung des Werts nach mehr Synthese für diese Routineaufgabe nicht positiv, sodass direkter Rebound bei dieser Routineaufgabe nicht impliziert ist. Indirekter Rebound, neue Aufgaben und Verschiebungen der Aufmerksamkeit können bleiben. Der Rand neuer Aufgaben von Acemoglu und Restrepo ist ein Ort, an dem Menge wieder auftauchen kann. Behauptung S-2 impliziert deshalb keine globale Obergrenze für Rechenleistung. Sie impliziert eine Obergrenze nur relativ zu einem formulierten `C`. Globalen Rebound zu bestreiten, würde die Aufteilung aus Abschnitt 3.3 und ein Nachfragesystem erfordern. Dieses Papier bestreitet globalen Rebound nicht. Es weigert sich, „Jevons“ als Grund zu behandeln, `C` nicht aufzuschreiben.

Zwei Hypothesen machen die Frage prüfbar.

- **H1. Ausgaben nach dem Abschluss.** Der Anteil der Agentenrechenleistung, der nach `C(z) = 1` ausgegeben wird, Joule oder Aufrufe mit `t > t*` im Verhältnis zu allen Joule oder Aufrufen der Episode, liegt messbar über null. H1 ist die direkte Verschwendung, die der Vollständigkeitshalt beseitigt. Sie lässt sich aus Agentenprotokollen mit einem gelabelten `t*` je Episode schätzen (Abschnitt 3.3, Punkt 1).
- **H2. Jevons bei Aufgaben.** H2 ist die Elastizität des direkten Rebounds von Khazzoom (1980), formuliert für Aufgaben. Wenn der Preis der Synthese fällt, übersteigt die Elastizität der Anzahl ausgeführter Aufgaben den Rückgang der Ausgaben je Aufgabe. Dann steigen die Gesamtausgaben, obwohl jede Aufgabe gesättigt ist. H2 ist aggregierter Rebound.

**Identifikation.** H1 braucht keine Preisvariation: einen gelabelten Korpus, die Fehlerraten des Detektors aus Abschnitt 3.3 Punkt 2 und die aufgeteilte Bilanz. H2 braucht exogene Preisänderungen. Preissenkungen von Anbietern bei fester Modellqualität, an einem bekannten Datum angekündigt, sind natürliche Experimente. Das Design ist ein Panel von Konten mit gezahltem Preis, eröffneten Aufgaben, Aufrufen je Aufgabe und einem Vollständigkeitslabel je Episode, vor und nach jeder Senkung. Der Vergleich von Konten auf einem neu bepreisten Modell mit Konten auf Modellen, deren Preis sich nicht bewegte, ergibt eine Differenz-von-Differenzen-Schätzung der Elastizität der Aufgabenanzahl und der Reaktion der Ausgaben je Aufgabe, jeweils getrennt. Die Ausgaben je Aufgabe können fallen, während die Aufgabenanzahl steigt. Beide Zahlen werden gebraucht. Der Vollständigkeitshalt ist eine Behauptung über die erste. Jevons ist eine Behauptung über die zweite. Keine wurde hier geschätzt.

<div id="52-status-and-creative-goods" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Status- und kreative Güter

Manche Güter werden geschätzt, weil sie nicht fertig sind: Status, offene Kunst, Forschung, deren `C` keine endliche Checkliste ist. Die Definition in Abschnitt 3.1 zwingt diesen Gütern keinen Bliss-Punkt auf. Sie erzwingt eine Segmentierung. Eine endliche Routineaufgabe und eine offene Praxis können vom selben Unternehmen verkauft werden und sollten keine Nachfrageannahme teilen. Eine endliche Routineaufgabe so zu bepreisen, als wäre sie ein offener Wettlauf um Fähigkeit, ist ein Kategorienfehler, kein Befund über AGI.

<div id="53-adversarial-demand" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Gegnerische Nachfrage

Ist der Gewinn der anderen Partei der Verlust dieser Partei, ist „genug“ nicht durch eine lokale Checkliste definiert. Wettrüsten und manche Sicherheitswettbewerbe gehören zu dieser Klasse. Physikalische Commit-Beschränkungen können dennoch gelten: Eine unsichere Aktion kann abgelehnt werden, während die strategische Nachfrage offen bleibt. Der Umfang ist Teil der Behauptung, keine Fußnote, die sie aufhebt.

<div id="54-incomplete-knowledge-of-done" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Unvollständiges Wissen über das Fertigsein

Menschen schätzen den Abschluss falsch ein. Detektoren werden falsches Fertig und falsches Weiter liefern. Das ist ein Argument dafür, Detektorfehler zu messen, die Abschnitt 3.3 als fehlend aufführt. Es ist kein Argument dafür, dass die Sitzungsdauer `C` in einem Bereich ersetzt, in dem eine versäumte Übergabe eine haftende Partei hat. Wo kein Prädikat aufgeschrieben werden kann, schweigt die operationale Behauptung dieses Papiers.

<div id="55-baumol-is-not-solved" class="anchor-alias" aria-hidden="true"></div>

### 5.5 Baumol ist nicht gelöst

Ein Modell, das eine Notiz schneller entwirft, kann den Durchsatz an Notizen erhöhen und Untersuchung, Urteil und Verantwortung bei einer Person lassen. Ausgabenanteile können sich weiterhin so bewegen, wie Baumol es beschrieb, wenn das menschliche Residuum nicht schneller wird. Das Gegenteil zu sagen, wäre eine Prognose, die diese Bibliografie nicht enthält. Die zulässige Aussage ist S-6.

<div id="56-free-synthesis-is-not-free-actuation" class="anchor-alias" aria-hidden="true"></div>

### 5.6 Kostenlose Synthese ist keine kostenlose Aktuierung

Joule der Stufe A sind modelliert. Stufe B ist im Browser simuliert. Stufe C programmiert die Platine, und ein Messgerät daran ist eine spätere Messung. Ein Aktorbefehl ist das Commit-Bit des Begleitpapiers. Die Preise von Epoch liegen auf einer anderen Achse als alle drei. Sie zu „kostenloser KI“ zusammenzufassen, streicht die Messklasse. Der Pfad über WASM und WebGPU ist nützlich, weil er Dritten erlaubt, die Entscheidungsspur nachzuspielen, ohne die Alchitry-Platine zu besitzen. Nützlichkeit als Nachbildung ist kein Watt.

<div id="57-confidence-is-not-a-certificate" class="anchor-alias" aria-hidden="true"></div>

### 5.7 Konfidenz ist kein Zertifikat

Eine hohe Bewertung kann Vorschläge ordnen. Die Ablehnungsbeispiele des Begleitpapiers zeigen ein bestehendes LUT-Bit mit einem nicht erfüllten Energieprädikat und einer Anlagenaktion von null. Das ist die physikalische Hälfte der Vereinigung. Die ökonomische Hälfte ist ein `policy`- oder Budgetgrund, wenn `C` bereits 1 ist. Keine der Hälften ist ein Softmax-Eintrag.

<div id="58-sell-side-skepticism-is-not-a-measurement" class="anchor-alias" aria-hidden="true"></div>

### 5.8 Sell-Side-Skepsis ist keine Messung

S-7 verhindert, dass eine Literaturübersicht einen bedeutenden öffentlichen Zweifel an Ausgaben und Nutzen übergeht. Sie erlaubt nicht, dass eine Research-Notiz ein Messgerät oder eine Nachfrageschätzung ersetzt. Werden die Zahlen der Notiz später zitiert, muss das primäre PDF die Quelle sein, und die Kennzeichnung ist Sell-Side-Schätzung.


<div id="59-what-a-structural-demand-estimate-would-require" class="anchor-alias" aria-hidden="true"></div>

### 5.9 Was eine strukturelle Nachfrageschätzung erfordern würde

S-2 ist eine Tatsache über den Angebotspreis aus sekundär veröffentlichten Reihen. Eine Nachfrageschätzung ist eine andere Regression. Mindestens braucht sie eine Menge (Aufrufe, abgeschlossene Aufgaben oder beides), einen Preis und eine Möglichkeit, eine Bewegung entlang einer Nachfragekurve von einer Verschiebung der Kurve zu trennen. Der Benchmarkpreis von Epoch ist keine Rechnung auf Unternehmensebene, und die Rechnung eines Unternehmens ist nicht `C`. Sie zu verknüpfen, erfordert ein Panel, das diese Studie nicht hat: Konten, die gezahlten Preis, getätigte Aufrufe und ein entschiedenes Vollständigkeitslabel für dieselbe Episode erfassen. Ohne dieses Panel ist die Steigung der Nachfrage nach `t*` nicht identifiziert. Die Spielzeugrente in Abschnitt 3.10 zeigt nur, dass ein quadratischer Bliss-Punkt ein endliches Optimum behält, wenn `p` fällt. Sie ist nicht die fehlende Regression.

Die Segmentierung gehört in dasselbe Design. Jedes Produkt vor dem Poolen als endliches `C` oder offen codieren. Einen Ticket-Desk mit einem offenen Forschungswerkzeug zu poolen, mittelt zwei Nachfrageregime und kann den Anschein unbegrenzten Appetits erzeugen. Der militärische Ausschluss in Abschnitt 5.3 ist dieselbe Regel, angewandt auf einen Bereich, in dem das Ziel des Gegners einen lokalen Bliss-Punkt verhindert. Eine Tabelle mit diesen Codes wäre, selbst noch ohne Preise, aussagekräftiger als eine einzelne Zahl für den gesamten adressierbaren Markt. Die Tabelle wurde nicht erstellt.

<div id="510-why-no-multiple-of-kt-ln-2-is-stated" class="anchor-alias" aria-hidden="true"></div>

### 5.10 Warum kein Vielfaches von `kT ln 2` angegeben wird

Das Ergebnis von Landauer ist eine Ungleichung für ein idealisiertes Löschen bei der Temperatur `T`. Horowitz (2014) berichtet Energien für bestimmte CMOS-Operationen und für Speicherverkehr, in Pikojoule, unter den Annahmen dieses Tutorials. Das eine durch das andere zu teilen, ergibt erst dann eine Zahl, wenn jemand die Operation, den Aktivitätsfaktor, die Temperatur und das Bauelement wählt. Keine dieser Wahlen wurde an einer OpenIE-Last gemessen. Die Konstanten des Begleitpapiers, beginnend bei `1e-12` Joule pro LUT-Lesevorgang, sind nicht die Zahlen von Horowitz und keine Zählung gelöschter Bits. Ein Vielfaches über der Landauer-Schranke anzugeben, würde so tun, als wären diese Wahlen getroffen. Die wissenschaftliche Aussage ist die Richtung der Ungleichung: Praktisches irreversibles CMOS liegt in der Darstellung von Horowitz weit über der Schranke, und ein Preisindex bewegt kein Bauelement auf die Schranke.


<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## 6. Grenzen und Gefährdungen der Validität

Konstruktvalidität. Operationale Sättigung hängt von `C` ab. Ein feindseliges oder vages `C` macht das Prädikat beliebig. Die Verteidigung des Papiers besteht darin, zu verlangen, dass `C` in beobachtbaren Klauseln aufgeschrieben wird. Viele reale Produkte haben diese Niederschrift noch nicht. Für diese Produkte gilt die Theorie empirisch noch nicht.

Interne Validität der Preisbehauptung. S-2 erbt die Identifikation, die Epoch verwendet hat (Qualitätsbereinigung, Wahl des Benchmarks, Listenpreise gegenüber tatsächlichen Rechnungen). Dieses Papier hat die Mikrodaten nicht geprüft. Eine Überarbeitung der Reihen von Epoch würde die Größenordnungen von S-2 ändern und die Richtung möglicherweise nicht. S-2 sollte mit den Primärseiten abgeglichen werden, bevor es als Kennzahl für die Geschäftsleitung verwendet wird.

Externe Validität. Arbeit und Pflege, wie definiert, schließen militärische Rivalität aus und schließen möglicherweise Forschung aus. Telefonbesitz überträgt sich nicht auf Agentenprodukte. Kurse von Fahrradaktien übertragen sich nicht auf Softwaremargen. Die konstruierten Episoden sind keine Stichprobe.

Messvalidität. Keine aufgeteilten Joule, keine Konfusionsmatrix des Detektors, kein Prüfling. Die Zählungen falscher Freigaben im Begleitpapier betreffen ein Pendelorakel, nicht den Aufgabenabschluss. Sie als Evidenz für Sättigung zu übernehmen, wäre ein Kategorienfehler. Herstellerangaben zu FPGAs sind keine Energie.

Ausgelassene Variable. Neue Aufgaben können Ausgaben aufnehmen, die durch billige Synthese frei werden. Abschnitt 5.1 sagt das. Eine Roadmap, die Sättigung je Routineaufgabe als Prognose der aggregierten Nachfrage nach Rechenleistung behandelt, ist durch dieses Papier nicht gedeckt.

Publikationsverzerrung und Dokumenttyp. Wu ist ein Buch. Die Seite zu Humane Technology ist Interessenvertretung. Goldman Sachs ist Sell-Side. Quinn, Epoch, Baumol, Acemoglu und Restrepo, Landauer und Horowitz sind die tragenden Zitate, und sie stützen verschiedene Sätze. Die Struktur des Papiers ist ein Versuch, zu verhindern, dass diese Sätze zu einer Stimmung gemittelt werden.

Falsifikatoren. S-1 scheitert, wenn die zitierte Theorie keinen Bereich mit Grenznutzen null enthält. Sie enthält ihn. S-2 scheitert, wenn die primären Seiten von Epoch keine Rückgänge dieser Art berichten. S-8 scheitert, wenn das Schema keine ökonomischen Begründungscodes hat oder wenn das zitierte JSON nicht ablehnt. Ein künftiger gelabelter Korpus, in dem zusätzliche Aufrufe nach einem korrekten `C` einen unabhängig spezifizierten Wert systematisch erhöhen, würde die Sättigung für diesen Korpus falsifizieren. Ein solcher Korpus würde die Definition nicht falsifizieren. Er würde ihren Geltungsbereich begrenzen.



Dieselbe Disziplin gilt für Herstellerangaben zu FPGAs. SparkFun listet Logikzellen, DSP-Slices, Block-RAM und DRAM-Kapazität für den Alchitry Pt V2 auf. Diese Größen beschreiben ein Katalogteil. Sie beschreiben weder Schaltaktivität noch statische Leistung noch die Energie einer Commit-Spur. Ein späterer Bericht zum Prüfling muss den Bitstream, den Takt, die Last, das Messgerät und die Dauer nennen. Solange dieser Bericht nicht existiert, ist die Platine ein ungemessenes Instrument und der Browser-Emulator eine Nachbildung der Softwareentscheidung, keine Vorschau auf das Messgerät.

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 7. Schluss

Sättigung ist ein Standardobjekt in der zitierten Theorie, und sie hat eine enge operationale Form: ein schriftliches Vollständigkeitsprädikat, das zusätzliche Synthese nicht voranbringt. Die veröffentlichten Reihen von Epoch dokumentieren einen starken Fall des Geldpreises von Inferenz bei fester Leistung. Dieser Fall stützt die Beschreibung digitaler Routineaufgaben als an der Grenze kostenlos und stützt weder kostenlose Joule noch kostenlose Anlagenbewegung noch das Ende der Kostenstruktur der Pflege. Kurse von Fahrradaktien, Smartphone-Diffusion und Aufmerksamkeitsmärkte sind in genau den Hinsichten schwächer und stärker, die Abschnitt 4 nennt. Die Commit-Referenz kann eine ökonomische Ablehnung und eine physikalische Ablehnung als verschiedene Gründe speichern. Die physikalische Seite ist im Begleitpapier simuliert und nicht auf der Platine gemessen. Ein WASM- und WebGPU-Emulator bildet die Spur im Browser unter https://research.openie.dev/living/fpga-sim/ nach und bleibt eine Simulation. Eine Messung am Alchitry Pt V2 wäre eine andere, spätere Messung. Die fehlenden wissenschaftlichen Objekte sind ein gelabelter Fertig-Detektor, eine Aufteilung der Energie vor und nach dem Fertigsein und eine Nachfrageschätzung, die Rebound sehen kann. Solange sie nicht existieren, ist der empirische Gehalt des Papiers der zitierte Bestand und sein formaler Gehalt das Prädikat.

<div id="8-prices-and-markets-from-the-theory-papers" class="anchor-alias" aria-hidden="true"></div>

## 8. Preise und Märkte aus den Theoriepapieren

Die Theoriepapiere ordnen nach Joule bis zur korrekten Fertigstellung und halten Preise aus der Rangfolge heraus. Ihre Markt- und Preislesarten sind hier gesammelt, und die ursprünglichen Abschnitte bleiben dort als Anker erhalten.

<div id="81-price-series" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Preisreihen

*Aus [Gemessene Commit-Tore, Abschnitt I.2.3](/papers/gates/#i23-scale-and-hardware-fit).* Epoch AI (2025) berichtet Rückgänge der Inferenzpreise in der Größenordnung des 9- bis 900-Fachen pro Jahr bei fester Benchmarkleistung, je nach Benchmark. Emberson und Roodman (2026) berichten seit etwa 2023 einen Rückgang der Kosten einer gegebenen Leistung um etwa 47 Prozent pro Quartal, den sie als etwa das 13-Fache pro Jahr zusammenfassen, mit einem schnelleren Rückgang nahe der Frontier. Das sind die veröffentlichten Zusammenfassungen von Epoch. Sie sind Evidenz über den Preis. Sie sind keine Evidenz dafür, dass Joule oder irreversible Commits kostenlos geworden sind. Gemessene Commit-Tore verwendet sie nur, um die Kosten eines Vorschlags von der Erlaubnis zu trennen. Dieses Papier verwendet dieselben Reihen für das Nachfrageargument der Abschnitte 2.5 und 4.2.

<div id="82-the-economic-stop" class="anchor-alias" aria-hidden="true"></div>

### 8.2 Der ökonomische Halt

*Aus [Gemessene Commit-Tore, Abschnitt II.5](/papers/gates/#ii5-stop-bridge-satiation).* Preise digitaler Inferenz können gegen an der Grenze kostenlos fallen, ohne kostenlose Energie, kostenlose Aktuierung oder unbegrenzten Wert nach Erledigung einer Routineaufgabe zu implizieren. Dieses Papier definiert Sättigung als Halt an einem schriftlichen Vollständigkeitsprädikat und zitiert die veröffentlichten Preisreihen. Mixture of Limits liefert den maschinellen Halt, der dieser ökonomischen Intuition entspricht.

<div id="83-plateau-spend-and-the-device-dollar" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Plateau-Ausgaben und der Gerätedollar

*Aus [Gemessene Commit-Tore, Abschnitt II.8.12](/papers/gates/#ii812-hardware-plateau-spend-on-real-devices).* Software ist angewandte menschliche Ingenieurskunst unter ökonomischer und existenzieller Motivation, kein Reich, das von Kosten, Ausbeute und Joule losgelöst ist. Märkte belohnen Plateau-Ausgaben, die mehr Arbeit pro Gerätedollar herausholen: optimierte Algorithmen, Mixture-of-Experts-Routing, gemeinsames Design von Trainingssystemen und Inferenztricks auf älteren oder billigeren Beschleunigern. Mixture of Limits ist die Navigationsregel, die diese Ausgaben an Böden bindet, wenn mehr Arbeit nichts kauft.

<div id="84-the-price-trend-in-the-shared-thesis" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Der Preistrend in der gemeinsamen These

*Aus der gemeinsamen These.* Ein Preistrend ist eine eigene Behauptung und als solche gekennzeichnet. Epoch AI berichtet, dass die Kosten eines gegebenen Niveaus an KI-Leistung seit 2023 um etwa 47 Prozent pro Quartal gefallen sind, etwa um das 13-Fache pro Jahr (Emberson und Roodman, *The plunging price of thought*, 22. September 2026). Setzt sich dieser Trend fort, wird Energie zu den dominierenden Grenzkosten der Inferenz. Das ist ein zitierter Trend mit einer Bedingung, kein gemessener Zusammenbruch. [Rechtschreibprüfung ist global](/papers/spellcheck/) ist ein Existenzbeweis, dass manche Computerintelligenz zu einem gebündelten Nullpreis zur Massenware wird.

<div id="85-cache-hit-pricing" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Preise bei Cache-Treffern

*Aus [Gemessene Commit-Tore, Abschnitt II.8.13.1](/papers/gates/#ii8131-transmission-attention-kv-cache-and-interconnect-cost).* Die öffentliche API von DeepSeek bepreist `deepseek-flash` (ausgeliefert als DeepSeek-V4.1-Flash) mit einem großen Abstand zwischen Eingaben mit Cache-Treffer und Cache-Fehlschlag (z. B. Spitzenwert Cache-Treffer \$0.006 gegenüber Cache-Fehlschlag \$0.3 pro 1M Eingabetoken; [api-docs.deepseek.com/quick_start/pricing](https://api-docs.deepseek.com/quick_start/pricing)). Eine Diskussion auf Hacker News verweist auf Sitzungen, die den Präfix-Cache bei etwa ~60% eines Kontextfensters verlieren und plötzlich ~50× mehr zahlen ([news.ycombinator.com/item?id=49735410](https://news.ycombinator.com/item?id=49735410)). Das ist eine Betreiberanekdote, keine OpenIE-Messung. Bindung durch Mixture of Limits: Billige Wiederverwendung des Caches ist die billigste ausreichende Übertragung; bricht die Wiederverwendung, sind eskalierte Ausgaben weiterhin Kosten des generativen Korridors, keine zertifizierte Ablehnung. Eine lange Sitzung wird danach bepreist, ob ihr Präfix überlebt, nicht danach, ob ihre Aufgabe abgeschlossen ist. Der Preis kann springen, während das Vollständigkeitsprädikat falsch bleibt, und er kauft nichts, sobald das Prädikat wahr ist.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Literatur

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Acemoglu, D., and Restrepo, P. Automation and new tasks: how technology displaces and reinstates labor. Journal of Economic Perspectives 33(2), 2019. https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3

Ames, A. D., et al. Control barrier functions: theory and applications. ECC 2019. https://doi.org/10.23919/ECC.2019.8796030

Andersen, E. S. Satiation in an evolutionary model of structural economic dynamics. Journal of Evolutionary Economics, 2001. https://doi.org/10.1007/PL00003852

Baumol, W. J. Macroeconomics of unbalanced growth: the anatomy of urban crisis. American Economic Review 57, 415-426, 1967.

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Center for Humane Technology. The attention economy. https://www.humanetech.com/youth/the-attention-economy

Emberson, L., and Roodman, D. / Epoch AI. The plunging price of thought. 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

Epoch AI. LLM inference price trends. 12 March 2025. https://epoch.ai/data-insights/llm-inference-price-trends

Gillingham, K., Rapson, D., and Wagner, G. The rebound effect and energy efficiency policy. Review of Environmental Economics and Policy 10(1), 68-88, 2016. https://doi.org/10.1093/reep/rev017 Working text: https://gwagner.com/wp-content/uploads/Gillingham-Rapson-Wagner-2015-Rebound-Effect.pdf

Alcott, B. Jevons' paradox. Ecological Economics 54(1), 9-21, 2005. https://doi.org/10.1016/j.ecolecon.2005.03.020

Anthropic. How we built our multi-agent research system. 13 June 2025. https://www.anthropic.com/engineering/multi-agent-research-system

Jevons, W. S. The Coal Question. London: Macmillan, 1865.

Keynes, J. M. Economic possibilities for our grandchildren. 1930. Reprinted in Essays in Persuasion, 1931.

Nordhaus, W. D. Two centuries of productivity growth in computing. Journal of Economic History 67(1), 128-159, 2007. https://doi.org/10.1017/S0022050707000058

Goldman Sachs. Gen AI: too much spend, too little benefit? https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit

Horowitz, M. Computing's energy problem (and what we can do about it). ISSCC 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Ma, S., et al. The era of 1-bit LLMs. arXiv:2402.17764.

Pew Research Center. Mobile fact sheet. https://www.pewresearch.org/internet/fact-sheet/mobile/

Quinn, W. Technological revolutions and speculative finance: evidence from the British Bicycle Mania. Cambridge Journal of Economics 43(2), 271-294, 2019. https://doi.org/10.1093/cje/bey029

SparkFun. Alchitry Pt V2. https://www.sparkfun.com/alchitry-pt-v2.html

Wei, J., et al. T-MAC. arXiv:2407.00088.

Wu, T. The Attention Merchants. Knopf. https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/

Chung, J.-W., Wu, R., Ma, J. J., and Chowdhury, M. Where Do the Joules Go? Diagnosing Inference Energy Consumption. arXiv:2601.22076. https://arxiv.org/abs/2601.22076

Energy use of AI inference, efficiency pathways, and test-time scaling. *Joule*, 2026. https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5

Luccioni, A. S., Strubell, E., and Crawford, K. From efficiency gains to rebound effects: the problem of Jevons' Paradox in AI's polarized environmental debate. *FAccT* 2025. https://doi.org/10.1145/3715275.3732007

Ostrovsky, N. / Epoch AI. What you need to know about AI energy use. Updated 14 July 2026. https://epoch.ai/publications/ai-energy

Companion measurement record: Charlot, "Metered Commit Gates, Part I (Notational Intelligence)," this repository. Software logs: `artifacts/RESULTS.md`, `artifacts/mcp_gate_demo.json`, `artifacts/schemas/wca.commit.v1/`.

Anthropic. Anthropic Economic Index report: uneven geographic and enterprise AI adoption. September 2025. https://www.anthropic.com/research/anthropic-economic-index-september-2025-report

Bai, L., Huang, Z., Wang, X., et al. How do AI agents spend your money? Analyzing and predicting token consumption in agentic coding. arXiv:2604.22750, 2026. https://arxiv.org/abs/2604.22750

Brockway, P. E., Sorrell, S., Semieniuk, G., Heun, M. K., and Court, V. Energy efficiency and economy-wide rebound effects: a review of the evidence and its implications. Renewable and Sustainable Energy Reviews 141, 110781, 2021. https://doi.org/10.1016/j.rser.2021.110781

Brookes, L. The greenhouse effect: the fallacies in the energy efficiency solution. Energy Policy 18(2), 199-201, 1990. https://doi.org/10.1016/0301-4215(90)90145-T

Chen, X., Xu, J., Liang, T., et al. Do NOT think that much for 2+3=? On the overthinking of o1-like LLMs. arXiv:2412.21187, 2024. https://arxiv.org/abs/2412.21187

Cuadron, A., Li, D., Ma, W., et al. The danger of overthinking: examining the reasoning-action dilemma in agentic tasks. arXiv:2502.08235, 2025. https://arxiv.org/abs/2502.08235

Du, M. Tiered super-Moore's law: price evolution, production frontiers, and market competition in large language models. arXiv:2603.28576, 2026. https://arxiv.org/abs/2603.28576

Fouquet, R., and Pearson, P. J. G. Seven centuries of energy services: the price and use of light in the United Kingdom (1300-2000). The Energy Journal 27(1), 2006. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol27-No1-8

Gundlach, H., Lynch, J., Mertens, M., et al. The price of progress: price performance and the future of AI. arXiv:2511.23455, 2025. https://arxiv.org/abs/2511.23455

Khazzoom, J. D. Economic implications of mandated efficiency in standards for household appliances. The Energy Journal 1(4), 1980. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol1-No4-2

Masanet, E., Shehabi, A., Lei, N., Smith, S., and Koomey, J. Recalibrating global data center energy-use estimates. Science 367(6481), 984-986, 2020. https://doi.org/10.1126/science.aba3758

Saunders, H. D. The Khazzoom-Brookes postulate and neoclassical growth. The Energy Journal 13(4), 1992. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol13-No4-7

Sorrell, S., and Dimitropoulos, J. The rebound effect: microeconomic definitions, limitations and extensions. Ecological Economics 65(3), 636-649, 2008. https://doi.org/10.1016/j.ecolecon.2007.08.013

Tsao, J. Y., Saunders, H. D., Creighton, J. R., Coltrin, M. E., and Simmons, J. A. Solid-state lighting: an energy-economics perspective. Journal of Physics D: Applied Physics 43(35), 354001, 2010. https://doi.org/10.1088/0022-3727/43/35/354001

Witt, U. Learning to consume: a theory of wants and the growth of demand. Journal of Evolutionary Economics 11(1), 23-36, 2001. https://doi.org/10.1007/PL00003851

<div id="appendix-a-decision-rules-and-non-results" class="anchor-alias" aria-hidden="true"></div>

## Anhang A. Entscheidungsregeln und Nichtergebnisse

| Id | Aussage | Klasse |
|----|-----------|-------|
| R1 | Das Vollständigkeitsprädikat aufschreiben, bevor Kapazität hinzugefügt wird. | Gestaltung |
| R2 | Erwarten, dass Burggräben über den Synthesepreis dort erodieren, wo Evidenz nach Art von Epoch gilt. | Gestaltung, unter der Bedingung von S-2 |
| R3 | Keine kostenlose Energie und keine kostenlose Aktuierung behaupten. | Beschränkung aus S-9 |
| R4 | Ökonomische Begründungscodes von physikalischen Begründungscodes trennen. | Softwaretatsache, S-8, plus Gestaltung |
| R5 | Fehlerraten des Detektors veröffentlichen, bevor ein Halt als genau behandelt wird. | Noch kein Ergebnis |
| R6 | Energie vor und nach dem Fertigsein aufteilen. | Noch kein Ergebnis |
| R7 | Gegnerische Wettläufe außerhalb der Sättigungsbehauptung halten. | Umfang |
| R8 | Die Primärquellen von Pew und Epoch erneut lesen, bevor eine feinere Größenordnung zitiert wird. | Methode |

Keine Zeile oben ist eine Platinenmessung.

<div id="appendix-b-reproducibility-and-the-emulator" class="anchor-alias" aria-hidden="true"></div>

## Anhang B. Reproduzierbarkeit und der Emulator

Dieses Papier hat kein eigenes Binary. Reproduktion der zitierten Softwaretatsachen:

```text
cargo run --release --bin wca-mcp-gate -- --demo
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

Zu erwarten, nach den aufgezeichneten Protokollen des Begleitpapiers: Demo-Ablehnung mit 0 Aufrufen des Ausführenden; Seed 1 mit 1 Commit, 15 Ablehnungen, analytische Energie 8.6795e-10 Joule. Diese Ausgaben schätzen keine Sättigung.

Browser-Instrument, als Stufe B unter https://research.openie.dev/living/fpga-sim/ ausgeliefert, gemeinsam mit Anhang B des Begleitpapiers. Der Entscheidungskern läuft in WASM. WebGPU zeichnet das LUT-Bild und die Commit-Spur. Die Spur gegen das Rust-JSON diffen. GPU-Zeitstempel nicht in Joule umrechnen. Den Alchitry Pt V2 nicht als gemessen markieren. Herstellerseite: https://www.sparkfun.com/alchitry-pt-v2.html. Ein Messgerät an der programmierten Platine der Stufe C ist eine spätere Studie.

Sachliches Kennzeichen des Repositorys: kein FPGA-Platinenergebnis beansprucht.

<div id="appendix-c-claim-map" class="anchor-alias" aria-hidden="true"></div>

## Anhang C. Karte der Behauptungen

Jetzt gestützt: S-1 bis S-9, mit den Sätzen zum Umfang in Abschnitt 4.

Nicht gestützt: ein Ende der Baumolschen Kostenkrankheit; kostenlose Anlagenbewegung; Sättigung militärischer Nachfrage; ein numerischer globaler Rebound von null; Betrieb eines Sprachmodells im Landauer-Maßstab; Platinen-Watt; ein AGI-Preis als Tatsache über gesättigte Routineaufgaben; eine universelle Verzögerung der Destillation; Führerschaft bei der Siliziumleistung.

Offene Messungen: Abschnitt 3.3.
