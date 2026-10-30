---
title: "Der Preis der ungeprüften Schnittstelle"
deck: "Was Schnittstellenfehler kosten, nur mit Zahlen, die eine Primärquelle nennt, jede als verbuchte Kosten, Modellschätzung oder Umfrageschätzung gekennzeichnet."
lang: "de"
source: "interface-economics"
complete: true
---

*Version 1.0, 11. Oktober 2026. LaTeX-PDF: [/pdfs/latex/interface-economics.pdf](/pdfs/latex/interface-economics.pdf) ([Quelltext](/pdfs/latex/interface-economics.tex)).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

Dieser Essay sammelt die veröffentlichten Kosten von Fehlern, die an den Übergaben zwischen den Teilen eines Systems entstehen, und kennzeichnet jede Zahl danach, wie sie entstanden ist. Er addiert sie nicht zu einer Gesamtsumme.

**In einfachen Worten**

1. Manche Fehler an Übergaben haben ein genaues Preisschild, etwa eine verlorene Marssonde, die Hunderte Millionen Dollar gekostet hat.
2. Die größeren nationalen Zahlen sind Schätzungen aus Umfragen und Modellen, und keine von ihnen zählt allein die Fehler an Übergaben.
3. Aufzuschreiben und zu prüfen, was jede Seite annimmt, ist billig, aber wer es tut, zahlt, während alle profitieren, und deshalb bleibt es oft ungetan.

<div id="0-definitions-and-scope" class="anchor-alias" aria-hidden="true"></div>

## 0. Definitionen und Geltungsbereich

Eine **Schnittstelle** ist eine Übergabe, über die die Ausgabe einer Partei zur Eingabe einer anderen wird: von denen, die festlegen, was ein System tun soll (Theoretiker), zu denen, die es bauen (Hersteller), zu denen, die es betreiben (Nutzer), oder zwischen zwei Ebenen eines Software- und Hardware-Stacks. Eine **Schnittstellenannahme** ist eine Bedingung an die Werte, die eine Übergabe passieren, auf die sich die empfangende Seite für ihre eigene Korrektheit verlässt, etwa eine Einheit, ein Wertebereich, ein Typ, eine Version oder eine Betriebshülle. Eine Annahme ist **ungeprüft**, wenn man sich auf sie verlässt, sie aber weder aufgeschrieben noch geprüft wird. Eine lange ingenieurwissenschaftliche Literatur, von Garlan, Allen und Ockerbloom zur architektonischen Fehlanpassung bis zu Leveson zu Unfällen als Interaktionsfehlern, verortet viele Systemfehler an solchen Annahmen [19, 20]. Dieser Essay fragt, was diese Fehler kosten, und antwortet nur mit Zahlen, die eine Primärquelle nennt. Jede Zahl ist nach ihrer Art gekennzeichnet. **Verbuchte Kosten** sind das, was eine Behörde oder ein Unternehmen als tatsächlich ausgegeben oder verloren angibt. Eine **Modellschätzung** ist eine Zahl, die mit einer angegebenen Methode aus Umfragen, Interviews oder Sekundärdaten gewonnen wird. Eine **Projektion** ist eine Aussage über die Zukunft. Die drei Arten werden nicht addiert.

Die verbuchten Kosten einzelner Schnittstellenfehler sind groß und konkret: Das Projekt Mars Surveyor 1998, zu dem Mars Climate Orbiter gehörte, kostete 327.6 Millionen Dollar [1], und die ESA bewilligte 214 Millionen ECU, um die mit der ersten Ariane 5 verlorene Cluster-Mission wiederherzustellen [4]. Die Modellschätzungen sind größer und breiter: NIST bezifferte die jährlichen Kosten einer unzureichenden Infrastruktur für Softwaretests in den Vereinigten Staaten auf 59.5 Milliarden Dollar [6] und die Kosten unzureichender Interoperabilität in der US-Branche für Kapitalanlagen auf 15.8 Milliarden Dollar pro Jahr [7]. CISQ schätzte die Kosten schlechter Softwarequalität in den Vereinigten Staaten für 2022 auf nicht weniger als 2.41 Billionen Dollar und die angesammelten technischen Schulden auf etwa 1.52 Billionen Dollar [8]. Keine dieser Zahlen misst allein Schnittstellenfehler. Jede enthält sie.

<div id="1-kinds-of-number" class="anchor-alias" aria-hidden="true"></div>

## 1. Arten von Zahlen

Wirtschaftliche Aussagen über Softwarefehler treten in drei Formen auf, die gleich aussehen und es nicht sind. Ein Projektbudget ist ein Buchungsbeleg. Eine nationale Kostenschätzung ist die Ausgabe eines Modells, dessen Eingaben Umfragen, Fallstudien und Annahmen über die Größenordnung sind. Eine Prognose ist keines von beiden. Dieser Essay folgt einer Regel: Jede Zahl trägt ihre Art, ihre Quelle und das, was sie tatsächlich zählt.

Zahlen für die Kosten von "Schnittstellenfehlern" als eine einzige Jahressumme kursieren ohne angegebene Methode. Keine der Primärschätzungen in Abschnitt 3 isoliert Schnittstellen, deshalb bildet dieser Essay sie auf keine einzige Summe ab.

<div id="2-single-failures-accounted" class="anchor-alias" aria-hidden="true"></div>

## 2. Einzelne Fehler, verbucht

**Mars Climate Orbiter.** Die Schnittstelle war eine Einheit: Schubimpulsdaten in Pound-force-Sekunden wurden als Newtonsekunden gelesen [2]. Das Projektdatenblatt der NASA gibt die Kosten des Projekts Mars Surveyor 1998 für den Orbiter und den Mars Polar Lander zusammen mit 327.6 Millionen Dollar an: 193.1 Millionen Dollar für die Entwicklung der Raumfahrzeuge, 91.7 Millionen Dollar für den Start und 42.8 Millionen Dollar für den Betrieb [1]. Zeitgenössische Berichte nannten für den Orbiter allein ein Raumfahrzeug für 125 Millionen Dollar [3]. Art: verbuchte Kosten des Projekts, mit einer berichteten Zahl für das eine Raumfahrzeug.

**Ariane 501 und Cluster.** Die Schnittstelle war eine Hülle: Von der Ariane 4 übernommene Software nahm einen Bereich der horizontalen Geschwindigkeit an, den die neue Trägerrakete überschritt [5]. Die vier Cluster-Satelliten gingen verloren. Der Bericht der ESA über die Wiederherstellung hält die Optionen fest, die ihr Wissenschaftsprogrammausschuss 1996 bepreiste, darunter 351 Millionen Rechnungseinheiten für den Nachbau der vier Satelliten nach dem ursprünglichen Entwurf, und die ESA bewilligte 1997 eine Wiederherstellungsmission, Cluster II, für 214 Millionen ECU [4, 17]. Art: verbuchte Kosten der von der ESA gewählten Wiederherstellung, also eine untere Schranke für den Verlust, nicht der Wert der Satelliten oder der verzögerten Wissenschaft.

Diese beiden Fälle legen die Gestalt des Problems fest. In jedem erledigte jede Instanz ihre eigene Arbeit, und die Kosten fielen an der Schnittstelle an. In jedem war die Prüfung, die die Fehlanpassung erkannt hätte, im Verhältnis zum Verlust billig. Keiner der Fälle lässt sich auf eine nationale Zahl hochrechnen, weil einzelne Unfälle keine Stichprobe sind.

<div id="3-national-estimates-modeled" class="anchor-alias" aria-hidden="true"></div>

## 3. Nationale Schätzungen, modelliert

![Balkendiagramm auf einer logarithmischen Dollarachse mit den in diesem Essay zitierten Primärschätzungen, nach Art eingefärbt. Verbuchte Kosten: das Projekt Mars Surveyor 1998 mit 327.6 Millionen Dollar und die Wiederherstellung Cluster II mit 214 Millionen ECU. Modellschätzungen: NIST 2004, unzureichende Interoperabilität in US-Kapitalanlagen, 15.8 Milliarden Dollar pro Jahr; NIST 2002, unzureichende Infrastruktur für Softwaretests, 59.5 Milliarden Dollar pro Jahr; Stripe 2018, Entwicklerzeit für schlechten Code, etwa 85 Milliarden Dollar pro Jahr; CISQ 2022, technische Schulden, etwa 1.52 Billionen Dollar angesammelt; CISQ 2022, Kosten schlechter Softwarequalität in den USA, mindestens 2.41 Billionen Dollar im Jahr 2022.](/figures/interface-economics/estimates-by-kind.svg)

*Abbildung 1. Die Schätzungen nach Art. Datenabbildung, logarithmische Achse. Werte wie von den Quellen angegeben [1, 4, 6, 7, 8, 9]. Die Balken sind nicht additiv: Die CISQ-Summe enthält Kategorien, die sich mit den Zahlen von NIST und Stripe überschneiden, und ein Bestand (technische Schulden) steht neben jährlichen Strömen. Eine [PNG-Kopie](/figures/interface-economics/estimates-by-kind.png) liegt bei.*

**Softwaretests, NIST 2002.** RTI International schätzte für NIST, dass eine unzureichende Infrastruktur für Softwaretests die US-Wirtschaft 22.2 Milliarden bis 59.5 Milliarden Dollar pro Jahr kostete, wobei die obere Zahl die Gesamtkosten und die untere den Teil bezeichnet, den machbare Verbesserungen beseitigen könnten [6]. Die Methode kombinierte Umfragen unter Entwicklern und Nutzern in zwei Sektoren, Fahrzeug- und Transportmittelbau sowie Finanzdienstleistungen, mit einer Hochrechnung auf die Volkswirtschaft. Art: Modellschätzung.

**Interoperabilität, NIST 2004.** Gallaher und Kollegen schätzten für NIST die Kosten unzureichender Interoperabilität in der US-Branche für Kapitalanlagen auf 15.8 Milliarden Dollar pro Jahr, auf Grundlage von Interviews und Umfragen unter Eigentümern, Betreibern, Architekten, Ingenieuren und Bauunternehmern [7]. Interoperabilität ist hier die Fähigkeit, Entwurfs- und Betriebsdaten über Softwaresysteme hinweg auszutauschen und zu nutzen, also eine Schnittstelle im Sinne der Definition in der Zusammenfassung. Der Bericht gibt an, dass seine Zahl Kosten auslässt, die er nicht beziffern konnte. Art: Modellschätzung, eine Branche, als konservativ dargestellt.

**Schlechte Softwarequalität, CISQ 2022.** Das Consortium for Information and Software Quality schätzte, dass die Kosten schlechter Softwarequalität in den Vereinigten Staaten 2022 auf mindestens 2.41 Billionen Dollar gestiegen waren und die angesammelten technischen Schulden auf etwa 1.52 Billionen Dollar [8]. Der Bericht setzt die Summe aus Kategorien zusammen, nämlich Betriebsausfällen, gescheiterten Projekten, Problemen mit Altsystemen und Verlusten durch Cyberkriminalität, die Software-Schwachstellen zugeschrieben werden, und bezieht einen großen Teil seiner Eingaben aus Sekundärquellen; sein Anteil für Cyberkriminalität rechnet eine globale Prognose auf die Vereinigten Staaten um [8]. Art: Modellschätzung, die teilweise auf anderen Schätzungen beruht. Sie ist die größte dokumentierte Zahl in diesem Bereich, und sie ist eine Zahl für Softwarequalität insgesamt, nicht für Schnittstellen.

**Entwicklerzeit, Stripe 2018.** Eine Umfrage von Stripe mit Harris Poll berichtete, dass Entwickler etwa 17.3 Stunden pro Woche mit Wartungsarbeit wie Fehlersuche und Refactoring verbringen und etwa vier Stunden pro Woche mit "schlechtem Code", den der Bericht weltweit mit fast 85 Milliarden Dollar pro Jahr bewertet [9]. Art: umfragebasierte Schätzung.

Was diese Zahlen teilen, ist eine Struktur, keine Summe. Jede zählt die Kosten einer Annahme, auf die man sich verließ und die nicht geprüft wurde: ein ungetesteter Pfad, ein Datenformat, das sich nicht übertragen lässt, eine Schwachstelle an einer Grenze, ein Altsystem, dessen Verträge niemand mehr formulieren kann. Eine Fehlanpassung, die nicht dort geprüft wird, wo sie entsteht, gelangt als wohlgeformte Eingabe auf jede Ebene darüber, sodass ihre Kosten weit von ihrer Ursache entfernt auftreten, wie bei der Navigationslösung des Mars Climate Orbiter, die in sich stimmig und falsch war [2]. Das ist auch der Grund, warum nationale Schätzungen modelliert statt gezählt werden müssen.

<div id="4-technical-debt-is-an-interface-account" class="anchor-alias" aria-hidden="true"></div>

## 4. Technische Schulden sind ein Schnittstellenkonto

Cunningham führte technische Schulden 1992 als die Kosten ein, Code auszuliefern, dessen Struktur noch nicht dem entspricht, was das Team gelernt hat, wobei auf jede spätere Änderung Zinsen anfallen, bis die Schuld getilgt ist [10]. Sculley und Kollegen zeigten, dass in Systemen des maschinellen Lernens der größte Teil dieser Schulden außerhalb des Modells liegt, in Verbindungscode, Konfiguration, Datenabhängigkeiten und nicht deklarierten Konsumenten [11]. In den oben definierten Begriffen ist ein großer Teil der technischen Schulden ein Saldo ungeprüfter Schnittstellenannahmen, der in den Büchern geführt wird, und ihre Zinsen sind die Kosten, die eine ungeprüfte Fehlanpassung jeder Ebene darüber bei jedem Lauf berechnet.

Die Schätzung von CISQ von etwa 1.52 Billionen Dollar angesammelter technischer Schulden in den Vereinigten Staaten ist ein Bestand, gemessen in den Kosten der Behebung [8]. Die jährlichen Zahlen in Abschnitt 3 sind Ströme. Die wirtschaftliche Folge ist eine Hypothese, die in Abschnitt 7 geprüft wird: Eine Prüfung, die einmal an einer Grenze bezahlt wird, kann über eine Arbeitslast weniger kosten als ein Fehler, der auf jeder Ebene, die er erreicht, erneut bezahlt wird.

<div id="5-standards-are-how-markets-close-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 5. Standards sind die Art, wie Märkte Schnittstellen schließen

Ökonomen untersuchen das Schnittstellenproblem seit Jahrzehnten unter einem anderen Namen: Kompatibilität. Katz und Shapiro zeigten, dass, wenn der Wert eines Produkts mit der Zahl der Nutzer steigt, mit denen es zusammenarbeiten kann, die Anreize der Unternehmen zur Kompatibilität von ihrer Größe und Position abhängen und der Markt zu wenig Kompatibilität liefern kann [12]. Farrell und Saloner zeigten, dass ein Markt an einem alten Standard festhängen oder zu schnell zu einem neuen wechseln kann, weil die Wahl jedes Nutzers von der Wahl der anderen abhängt [13]. Davids Geschichte der QWERTY-Tastatur machte Pfadabhängigkeit konkret [14]. Baldwin und Clark zeigten, dass Entwurfsregeln, also im Voraus festgelegte sichtbare Schnittstellen, es modularen Branchen überhaupt erst ermöglichen, sich zu bilden [15]. Swanns Übersicht für die britische Regierung fasste Belege zusammen, dass Standards zu Produktivität und Handel beitragen [16].

Der gemeinsame Faden ist, dass eine Schnittstelle ein öffentliches Gut mit privaten Kosten ist. Eine Annahme aufzuschreiben und zu prüfen nützt jeder Partei, die die Grenze überquert, wird aber von dem bezahlt, der das Aufschreiben übernimmt. Jede Partei hat einen Grund, die Übergabe als Aufgabe eines anderen zu behandeln. Normungsgremien, Regulierungsbehörden und Plattformbetreiber sind die Institutionen, die diese Kosten historisch getragen haben. Maschinell geprüfte Darstellungen, etwa Typen, die Maßeinheiten tragen, oder formale Spezifikationen, die ein Model Checker prüft [21, 22], senken die privaten Kosten, eine Schnittstelle zu schließen, auf die Kosten zu, ihre Prüfung auszuführen.

<div id="6-generated-code-crosses-the-same-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 6. Generierter Code überquert dieselben Schnittstellen

Code, den ein automatischer Generator erzeugt, überquert dieselben Grenzen wie von Hand geschriebener Code: zwischen einer Spezifikation und einer Implementierung, zwischen einer Bibliothek und ihren Nutzern, zwischen Software und dem Befehlsvertrag darunter. Jede Überquerung trägt Annahmen, die ein Generator nicht prüft, sofern er nicht dafür gebaut ist. Die Zahlen in Abschnitt 3 betreffen daher auch die automatische Codegenerierung. Wenn ein großer Teil der Kosten schlechter Softwarequalität die Kosten ungeprüfter Annahmen an Grenzen sind, dann kann der Wert, Schnittstellen zu schließen, den Wert übersteigen, Code schneller zu schreiben. Das ist eine Hypothese darüber, wo Wert liegt, keine Messung. Die Protokolle in Abschnitt 7 sind der Weg, ihn zu messen.

<div id="7-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 7. Propositionen und Protokolle

**Proposition E1 (der Schnittstellenanteil).** In einer Population von Softwarefehlern mit verbuchten Kosten übersteigt der Kostenanteil, dessen Ursache eine verletzte Schnittstellenannahme im Sinne der Definition in der Zusammenfassung ist, den Anteil, dessen Ursache vollständig innerhalb einer Instanz liegt.

*Protokoll.* Man nehme einen öffentlichen Vorfallkorpus mit Kostenfeldern, etwa Unfallberichte von Behörden oder regulatorische Meldungen. Zwei Kodierer klassifizieren jede Ursache als Schnittstelle oder intern anhand der Definitionen in der Zusammenfassung, ohne die Kosten zu kennen. Berichtet werden der kostengewichtete Schnittstellenanteil mit einem Bootstrap-Intervall und die Übereinstimmung der Kodierer.

**Proposition E2 (Prüfungen zahlen sich aus).** Für eine feste Arbeitslast sind die Kosten, an einer Schnittstelle eine explizite Prüfung hinzuzufügen, niedriger als die erwarteten Kosten der Fehler, die sie abweist, summiert über jede Ebene, die der Fehler sonst erreichen würde. Formal: Für eine Schnittstelle, die $N$ Mal überquert wird, sei $c$ die Kosten einer Prüfung in Dollar, $\pi$ die Wahrscheinlichkeit, dass eine Überquerung die Annahme verletzt, und $L_m$ die Kosten in Dollar, die eine nicht abgefangene Verletzung auf Ebene $m$ der $M$ Ebenen verursacht, die sie erreicht. Die Prüfung zahlt sich aus, wenn $N c < N \pi \sum_{m=1}^{M} L_m$, also wenn $c < \pi \sum_m L_m$. Die beiden verbuchten Fälle aus Abschnitt 2 haben $\sum_m L_m$ in der Größenordnung von $10^8$ Dollar, sodass die Bedingung für jede Prüfung gilt, die weniger als $10^8 \pi$ Dollar pro Überquerung kostet.

*Protokoll.* In einem System, dessen Ebenen bekannte Betriebskosten haben, wird auf einer festen Seed-Menge eine Verletzung jeder festgehaltenen Schnittstellenannahme injiziert, wobei die Kosten jeder Prüfung und die Kosten jeder nicht abgefangenen Verletzung dort, wo sie ankommt, erfasst werden. Beides wird in Joule und in Dollar zu einem angegebenen Preis berichtet.

**Proposition E3 (das Schließen einer Schnittstelle senkt ihre privaten Kosten).** Wenn die Schnittstellenannahme Teil einer gemeinsamen Darstellung ist und konstruktionsbedingt geprüft wird, sinken die Kosten, die eine einzelne Partei für ihr Schließen trägt, auf die Kosten zu, die Prüfung auszuführen.

*Protokoll.* Man wähle eine reale Übergabe zwischen Organisationen, etwa eine Spezifikation, die an einen Implementierer übergeben wird. In einem Arm wird sie als Prosadokumentation geführt, im anderen als maschinell geprüfte Darstellung. Erfasst werden die Arbeitsstunden auf jeder Seite der Übergabe und die an der Schnittstelle verorteten Fehler in jedem Arm, mit Wilson-Intervallen zu 95%.

<div id="8-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 8. Fazit

Die Kosten ungeprüfter Schnittstellen sind real, groß und schlecht gemessen. Einzelne Fehler lassen sich genau bepreisen, und sie zeigen, dass der Verlust an einer Grenze anfällt, von der jede Instanz glaubte, sie gehöre jemand anderem. Nationale Schätzungen sind Modelle, und die größten von ihnen beschreiben Softwarequalität insgesamt. Keine Primärquelle nennt die Kosten von Schnittstellenfehlern für sich allein, und dieser Essay liefert keine solche Zahl. Was die Belege stützen, ist eine Struktur: Kosten, die an Grenzen entstehen, sich nach oben fortpflanzen und sich als Schulden aufzinsen, in Märkten, die das öffentliche Gut einer geprüften Schnittstelle zu wenig bereitstellen. Die Propositionen in Abschnitt 7 legen fest, wie diese Struktur geprüft werden kann.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Literatur

[1] NASA Jet Propulsion Laboratory, "Mars Climate Orbiter Fact Sheet," Mars Surveyor 1998 project. Archived copy: https://web.archive.org/web/20121003073752/http://mars.jpl.nasa.gov/msp98/orbiter/fact.html

[2] Mars Climate Orbiter Mishap Investigation Board, *Phase I Report*. NASA, 10 November 1999. https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf

[3] A. Pollack, "Two Teams, Two Measures Equaled One Lost Spacecraft," *The New York Times*, 1 October 1999. https://archive.nytimes.com/www.nytimes.com/library/national/science/100199sci-nasa-mars.html

[4] European Space Agency, "Cluster will fly again!," press release N° 12 1997, 26 March 1997. https://www.esa.int/Newsroom/Press_Releases/Cluster_will_fly_again

[5] J. L. Lions (chair), *Ariane 5 Flight 501 Failure: Report by the Inquiry Board*. European Space Agency, 19 July 1996. https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf

[6] RTI International for the National Institute of Standards and Technology, *The Economic Impacts of Inadequate Infrastructure for Software Testing*, Planning Report 02-3, May 2002. https://www.nist.gov/system/files/documents/director/planning/report02-3.pdf

[7] M. P. Gallaher, A. C. O'Connor, J. L. Dettbarn and L. T. Gilday, *Cost Analysis of Inadequate Interoperability in the U.S. Capital Facilities Industry*, NIST GCR 04-867, 2004. doi:10.6028/NIST.GCR.04-867

[8] H. Krasner, *The Cost of Poor Software Quality in the US: A 2022 Report*. Consortium for Information and Software Quality, 2022. https://www.it-cisq.org/the-cost-of-poor-quality-software-in-the-us-a-2022-report/

[9] Stripe, *The Developer Coefficient*, with Harris Poll, September 2018. https://stripe.com/files/reports/the-developer-coefficient.pdf

[10] W. Cunningham, "The WyCash portfolio management system," *OOPSLA 1992 Addendum*, *ACM SIGPLAN OOPS Messenger* 4(2), 1993, pp. 29 to 30. doi:10.1145/157710.157715

[11] D. Sculley, G. Holt, D. Golovin, E. Davydov, T. Phillips, D. Ebner, V. Chaudhary, M. Young, J.-F. Crespo and D. Dennison, "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems* 28, 2015. https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

[12] M. L. Katz and C. Shapiro, "Network Externalities, Competition, and Compatibility," *American Economic Review* 75(3), June 1985, pp. 424 to 440. RePEc:aea:aecrev:v:75:y:1985:i:3:p:424-40. https://www.jstor.org/stable/1814809

[13] J. Farrell and G. Saloner, "Standardization, Compatibility, and Innovation," *RAND Journal of Economics* 16(1), 1985, pp. 70 to 83. doi:10.2307/2555589

[14] P. A. David, "Clio and the Economics of QWERTY," *American Economic Review* 75(2), Papers and Proceedings, May 1985, pp. 332 to 337. RePEc:aea:aecrev:v:75:y:1985:i:2:p:332-37. https://www.jstor.org/stable/1805621

[15] C. Y. Baldwin and K. B. Clark, *Design Rules, Volume 1: The Power of Modularity*. MIT Press, 2000. doi:10.7551/mitpress/2366.001.0001

[16] G. M. P. Swann, *The Economics of Standardization: An Update*. Report for the UK Department for Business, Innovation and Skills, 2010. https://www.gov.uk/government/publications/economics-of-standardisation-update-to-report

[17] European Space Agency, "The Resurrection of the Cluster Scientific Mission," *ESA Bulletin* 91, 1997. https://www.esa.int/esapub/bulletin/bullet91/b91cred.htm

[19] D. Garlan, R. Allen and J. Ockerbloom, "Architectural mismatch: why reuse is so hard," *IEEE Software* 12(6), 1995, pp. 17 to 26. doi:10.1109/52.469757

[20] N. G. Leveson, *Engineering a Safer World: Systems Thinking Applied to Safety*. MIT Press, 2012. doi:10.7551/mitpress/8179.001.0001

[21] A. Kennedy, "Types for Units-of-Measure: Theory and Practice," in *Central European Functional Programming School*, Lecture Notes in Computer Science 6299, Springer, 2010, pp. 268 to 305. doi:10.1007/978-3-642-17685-2_8

[22] C. Newcombe, T. Rath, F. Zhang, B. Munteanu, M. Brooker and M. Deardeuff, "How Amazon Web Services uses formal methods," *Communications of the ACM* 58(4), 2015, pp. 66 to 73. doi:10.1145/2699417
