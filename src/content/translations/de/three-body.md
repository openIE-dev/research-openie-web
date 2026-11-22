---
title: "Das Streben nach AGI löst das Dreikörperproblem im Computing"
deck: "Computersysteme versagen am häufigsten an den Übergabestellen zwischen den Personen, die sie spezifizieren, bauen und nutzen. Die Überprüfung jeder Annahme an jeder Übergabestelle ergibt einen Stack, in dem eine Korrektur dort verbleibt, wo sie vorgenommen wird."
lang: "de"
source: "three-body"
complete: true
---

<div id="the-pursuit-of-agi-resolves-the-three-body-problem-in-computing" class="anchor-alias" aria-hidden="true"></div>

*Revision 395f081, 4. November 2026. LaTeX PDF: [/pdfs/latex/three-body.pdf](/pdfs/latex/three-body.pdf) ([source](/pdfs/latex/three-body.tex)).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

Große technische Fehlfunktionen beginnen häufig dort, wo eine Gruppe Arbeit an eine andere übergibt und eine Annahme nie schriftlich festgehalten wird. Dieses Papier definiert diese Übergaben, gibt an, wann deren Prüfung ein System stabil macht, und liefert Tests, die das Gegenteil beweisen könnten.

**In einfachen Worten**

1. Die meisten großen Computerfehlfunktionen treten an der Übergabe zwischen Teams oder Komponenten auf, nicht innerhalb dieser.
2. Die Ursache ist meist eine Vermutung, die niemand schriftlich festgehalten hat, etwa in welchen Einheiten eine Zahl angegeben ist.
3. Wenn jede solche Vermutung schriftlich festgehalten und von einer Maschine geprüft wird, bleibt eine in einem Ort vorgenommene Korrektur erhalten und bricht nichts darüber hinweg.

<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. These

In Liu Cixins Roman *The Three-Body Problem* [1] lebt eine Zivilisation auf einem Planeten, der drei Sonnen umkreist. Seine Jahreszeiten haben keinen Rhythmus, weil niemand vorhersagen kann, wo sich drei Körper unter gegenseitiger Gravitation befinden werden. Der Titel dieses Artikels übernimmt dieses Bild für die Informatik und kehrt es dann um: Die Instabilität ist real, aber sie hat eine Ursache, die lokalisiert werden kann, und die Ursache kann entfernt werden.

Die Informatik hat drei Körper. **Theoretiker** geben vor, was ein System tun soll: die Mathematik, die Spezifikation, den Algorithmus, das physikalische Modell. **Entwickler** bauen es: die Chipdesigner, die Compiler‑ und Kernel‑Autoren, die Bibliotheksautoren, die Integratoren. **Nutzer** führen es aus: die Betreiber, die nachgelagerten Programme, die Personen und Maschinen, die von seiner Ausgabe abhängen. Jeder Körper ist kompetent und intern kohärent. Ein Theorem gilt. Ein Chip erfüllt sein Datenblatt. Ein Nutzer folgt der Dokumentation.

Das Problem liegt zwischen ihnen. Jede Übergabe von einem Körper zum anderen trägt Annahmen über Einheiten, Spannungen, Bereiche, Timing, Speicher, Kodierungen, Versionen, Betriebsgrenzen und Absicht. Wenn jeder Körper annimmt, dass die Übergabe nicht existiert oder dass sie jemand anderes erledigt, wird die Annahme nie schriftlich festgehalten, und eine Annahme, die nie schriftlich festgehalten wird, wird nie geprüft.

**Die zentrale Behauptung.** Die Instabilität von Informatiksystemen liegt an ihren ungeprüften Schnittstellen, nicht an den Körpern. Das ernsthafte Verfolgen künstlicher allgemeiner Intelligenz (AGI) als ein System, das über jeden Körper und jede Ebene des Stacks korrekt handeln muss, zwingt jede Schnittstellenannahme, explizit gemacht und geprüft zu werden. Ein Stack, dessen Schnittstellenannahmen alle explizit und geprüft sind, ist in einem genauen Sinn stabil: Eine Korrektur, die auf einer Ebene vorgenommen wird, bleibt auf dieser Ebene korrekt und wirkt sich auf jede darüber liegende Ebene aus. Das ist die Auflösung, die der Titel benennt.

Die Behauptung ist ingenieurtechnisch und theoretisch. Sie wird mit Definitionen in [Section 5](#5-definitions-and-propositions) formuliert, beruht auf der in [Section 4](#4-the-interface-literature) geprüften Schnittstellenliteratur, ihre Evidenz stammt aus unabhängig getesteten verifizierten Systemen ([Section 6](#6-the-stabilized-configuration)), und sie enthält Protokolle und Falsifikatoren, die sie widerlegen können ([Section 8](#8-protocols) und [Section 9](#9-falsifiers)).

<div id="2-the-three-body-problem-and-what-the-analogy-carries" class="anchor-alias" aria-hidden="true"></div>

## 2. Das Dreikörperproblem und was die Analogie trägt

<div id="21-what-the-physics-says" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Was die Physik besagt

Newton löste die Bewegung von zwei Körpern unter gegenseitiger Gravitation in geschlossener Form: Jeder bewegt sich auf einer Kegelschnitte um ihren gemeinsamen Schwerpunkt. Fügt man einen dritten Körper hinzu, ändert sich das Problem grundlegend. Poincarés Memoiren für den Preis von König Oscar II, veröffentlicht in *Acta Mathematica* im Jahr 1890, zeigten, dass das Drei‑Körper‑Problem neben den klassischen Integralen keine weiteren Integrale der Art besitzt, die es auf Quadraturen reduzieren würden, und dass er bei der Korrektur eines Fehlers in seiner ersten Einreichung das Geflecht von Bahnen in der Nähe einer periodischen Umlaufbahn fand, das heute als das erste Auftreten deterministischer Chaostheorie erkannt wird [2, 3]. Barrow‑Greens Geschichte verfolgt die Episode vom Preis bis zur korrigierten Memoire [3].

„Keine allgemeine geschlossene Form“ erfordert Vorsicht, weil diese Aussage häufig übertrieben wird. Sundman zeigte in Arbeiten, die 1912 und 1913 veröffentlicht wurden, dass das Drei‑Körper‑Problem für alle Zeiten eine konvergente Reihenlösung besitzt, sofern der Gesamtdrehimpuls nicht null ist [4], und Wang erweiterte 1991 eine globale Reihenlösung auf das n‑Körper‑Problem [5]. Die Reihen konvergieren so langsam, dass sie für Vorhersagen unbrauchbar sind. Der praktische Inhalt von Poincarés Ergebnis bleibt erhalten: Es gibt keine einfache Formel, und nahe beieinander liegende Anfangsbedingungen können exponentiell auseinandergehen, sodass eine Fernvorhersage einer generischen Konfiguration nicht möglich ist. Lorenz fand dieselbe Empfindlichkeit in einem dreivariablen Modell der Konvektion im Jahr 1963 [6]. Stone und Leigh zeigten 2019, dass das chaotische, nicht‑hierarchische Drei‑Körper‑Problem statistisch beschrieben werden kann, durch die Verteilung seiner Ergebnisse, obwohl einzelne Bahnen nicht vorhergesagt werden können [7].

<div id="22-the-special-stable-configurations" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Die speziellen stabilen Konfigurationen

Chaos ist der generische Fall, nicht der einzige Fall. Lagrange stellte 1772 fest, dass drei Körper ihre relativen Positionen beibehalten können, während sie gemeinsam rotieren: in einer geraden Linie oder an den Ecken eines gleichseitigen Dreiecks [3]. Im eingeschränkten Problem, bei dem der dritte Körper leicht ist, handelt es sich um die fünf Lagrange‑Punkte. Die dreieckigen Punkte sind linear stabil, wenn das größere Primärteil im Vergleich zum kleineren ausreichend schwer ist, eine Bedingung, die Routh 1874 formulierte (Massenverhältnis über etwa 25) [8]. Raumfahrzeuge parken heute aus diesem Grund in der Nähe der Lagrange‑Punkte von Sonne und Erde. Weitere periodische Lösungen existieren: Moore fand die Achter‑Bahn 1993 numerisch [9], Chenciner und Montgomery bewiesen 2000 ihre Existenz für gleiche Massen [10], und Šuvakov und Dmitrašinović entdeckten 2013 neue Familien [11].

Die Lehre für dieses Papier liegt in der Form dieser Lösungen. Jede stabile Konfiguration ist eine besondere Anordnung, in der die Kräfte zwischen den Körpern in einem mit ihnen mitbewegten Bezugssystem ausgeglichen sind. Stabilität ist keine Eigenschaft eines einzelnen Körpers. Sie ist eine Eigenschaft der Beziehungen zwischen den Körpern und eines Bezugssystems, in dem diese Beziehungen festgehalten werden.

<div id="23-analogy-and-mechanism" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Analogie und Mechanismus

Eine Metapher, die aus der Physik entlehnt ist, kann irreführen. Die Tabelle trennt das, was dieses Papier als Analogie verwendet, von dem, was es als Mechanismus behauptet.

| Das Drei‑Körper‑Problem | In der Informatik | Status in diesem Papier |
|---|---|---|
| Drei Massen, jede für sich einfach | Theoretiker, Entwickler und Nutzer, jeder für sich kohärent | Analogie |
| Instabilität entsteht durch die Wechselwirkungen, nicht durch irgendeinen Körper | Fehler entstehen an Schnittstellen, nicht innerhalb der Körper | Mechanismus, unterstützt durch die Fehlstudien in Abschnitt 3 und die Literatur in Abschnitt 4 |
| Sensitive Abhängigkeit von Anfangsbedingungen | Eine kleine, unkontrollierte Diskrepanz an einer Schnittstelle wächst, wenn sie durch Ebenen propagiert | Mechanismus, formuliert als Proposition 2 |
| Keine nützliche allgemeine geschlossene Form | Kein einzelner Körper kann das Verhalten des Gesamtsystems aus seinem eigenen Modell vorhersagen | Analogie; die Informatik hat keine Bewegungsgleichungen |
| Stabile Konfigurationen existieren in einem ko‑rotierenden Rahmen | Ein Stapel, dessen Schnittstellenannahmen alle geprüft sind, hält eine Korrektur dort, wo sie vorgenommen wird | Mechanismus, formuliert als Proposition 3 |
| Statistische Beschreibung chaotischer Ergebnisse [7] | Fehlerraten können bei großem N gemessen werden, selbst wenn einzelne Fehler nicht vorhergesagt werden können | Methode, verwendet in den Protokollen von Abschnitt 8 |

Das Papier behauptet niemals, dass die Informatik den newtonschen Gesetzen folgt, dass Schnittstellen Kräfte ausüben oder dass ein Lyapunov‑Exponent für eine Organisation berechnet werden kann. Die Physik liefert Vokabular und eine strukturelle Lehre: Stabilität entsteht aus den Beziehungen und findet sich in speziellen Konfigurationen, nicht im generischen Fall.

<div id="3-the-three-bodies-of-computing-and-their-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 3. Die drei Körper des Computing und ihre Schnittstellen

![Diagramm von drei Akteuren, Theoretikern, Machern und Nutzern, dargestellt als Kreise an den Ecken eines Dreiecks. Jede Kante zwischen zwei Akteuren ist eine Schnittstelle, dargestellt als Band, beschriftet mit den Annahmen, die sie kreuzen: Theoretiker zu Macher trägt die Spezifikation, ihre Einheiten und ihren Betriebsbereich; Macher zu Nutzer trägt die API, die Version und die Spannungs‑ und Zeitgrenzen; Nutzer zu Theoretiker trägt die tatsächliche Nutzung, die beobachteten Fehler und die Absicht, die nie schriftlich festgehalten wurde. Gestrichelte Abschnitte jedes Bands markieren Annahmen, die kein Akteur niederschreibt oder prüft.](/figures/three-body/three-bodies.svg)

*Abbildung 1. Die drei Akteure und ihre drei Schnittstellen. Diagramm. Die Akteure sind solide dargestellt, weil jeder für sich kohärent ist. Die gestrichelten Bänder sind die ungeprüften Annahmen, aus denen Fehler entstehen. Eine [PNG‑Kopie](/figures/three-body/three-bodies.png) ist bereitgestellt.*

<div id="31-theorist-to-maker" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Theoretiker zum Hersteller

Eine Aussage eines Theoretikers setzt einen Bereich voraus: Einheiten, Wertebereiche, eine Betriebsumgebung, eine idealisierte Maschine. Die Umsetzung eines Praktikers geht davon aus, dass die Aussage vollständig ist. Wenn keiner die Umgebung schriftlich festhält, ist die Umsetzung korrekt für eine Welt, die nicht diejenige ist, in der sie ausgeführt wird.

Der Verlust des Mars Climate Orbiter im Jahr 1999 ist das Lehrbuchbeispiel. Das Mishap Investigation Board stellte fest, dass die Bodensoftware Impulsdaten der Triebwerke in englischen Einheiten (Pfundkraft‑Sekunden) lieferte, während die Navigationssoftware metrische Einheiten (Newton‑Sekunden) erwartete, und dass sich der Fehler während der Flugphase ansammelte, bis das Raumfahrzeug weit unter seiner geplanten Höhe in die Atmosphäre eintrat [12]. Jeder Akteur erledigte seine eigene Arbeit. Die Einheit war eine Schnittstellenannahme, die niemand überprüfte.

<div id="32-maker-to-user" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Hersteller zum Benutzer

Ein Hersteller veröffentlicht eine Schnittstelle und ein Nutzer ist darauf angewiesen. Die Dokumentation enthält einen Teil des Vertrags. Der Rest ist das, was die Implementierung tatsächlich tut. Hyrums Beobachtung beschreibt die Konsequenz: Mit genügend Nutzern einer API wird jedes beobachtbare Verhalten des Systems von jemandem abhängen, unabhängig davon, was der Vertrag verspricht [13]. Spolskys Aufsatz über leaky abstractions macht den komplementären Punkt: Jede nicht triviale Abstraktion legt, in gewissem Maße, das offen, was sie zu verbergen versucht [14].

Der erste Flug der Ariane 5 im Jahr 1996 zeigt, wie eine Annahme des Herstellers auf einen neuen Nutzer übergreift. Die Untersuchungskommission stellte fest, dass die Trägheitsreferenzsoftware, die von Ariane 4 wiederverwendet wurde, einen 64‑Bit‑Gleitkommawert, der die horizontale Geschwindigkeit beschreibt, in einen 16‑Bit‑vorzeichenbehafteten Integer konvertierte; auf der schnelleren Ariane‑5‑Trajektorie überschritt der Wert den Bereich, die Konvertierung löste eine Ausnahme aus, beide Referenzeinheiten schalteten ab und die Trägerrakete zerbrach etwa 40 Sekunden nach Beginn der Flugsequenz [15]. Die Software war für den Rahmen korrekt, für den sie geschrieben wurde. Der Rahmen war eine Schnittstellenannahme, die mit dem Code mitgereist ist, ohne erneut formuliert oder geprüft zu werden [15, 16].

Dasselbe Muster erscheint an der Hardware‑Grenze. Ein Befehlssatz ist ein Vertrag, den Anbieter überarbeiten. Die unprivilegierte Spezifikation von RISC‑V listet mehrere ratifizierte Basen und eine lange, wachsende Liste ratifizierter Erweiterungen auf [17]. Apple wechselte 2020 den Mac von Intel‑Prozessoren zu Apple‑Silicon und stellt Rosetta als Übersetzungsschicht für Anwendungen bereit, die für den früheren Vertrag gebaut wurden; Apples Seite gibt zudem an, dass Rosetta ab macOS 28 nur noch für bestimmte ältere Spiele erhalten bleibt [18]. Die Übersetzungsschicht ist selbst eine Schnittstelle mit einem veröffentlichten Ende. Software, die davon ausgeht, dass der Befehlsvertrag fest sei, trifft auf eine Revision, die sie nicht erwartete, und die Lösung ist eine weitere Schnittstellenschicht.

<div id="33-user-to-theorist" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Benutzer zum Theoretiker

Der Rückweg ist am wenigsten untersucht. Benutzer erfahren, was ein System tatsächlich tut, wo es versagt und was sie eigentlich erfragen wollten. Sofern dieses Wissen nicht zu den Theoretikern als überarbeitete Aussage zurückkehrt, wiederholt die nächste Spezifikation die alten Annahmen. Zave und Jacksons Darstellung von Anforderungen macht die Lücke präzise: Eine Anforderung ist eine Aussage über die Umgebung, eine Spezifikation ist eine Aussage an der Schnittstelle, und das Domänenwissen, das sie verbindet, ist oft ungeschrieben [19]. Hookers „hardware lottery“ zeigt den Rückweg in umgekehrter Richtung: Forschungsideen gelingen oder scheitern je nach der Hardware und Software, die gerade verfügbar ist, nicht allein aufgrund ihrer Vorzüge, sodass das, was Entwickler bauen, bestimmt, worüber Theoretiker nachdenken können [20].

<div id="34-why-the-instability-looks-irreducible" class="anchor-alias" aria-hidden="true"></div>

### 3.4 Warum die Instabilität irreduzibel erscheint

Jeder Körper sieht nur sein eigenes kohärentes Modell. Aus der Sicht eines beliebigen Körpers erscheinen die oben genannten Fehler wie Pech oder das Versehen eines anderen, weil die Ursache an einer Schnittstelle liegt, die keinem Körper gehört. Dies ist das Gegenstück in der Informatik zu der Behauptung, dass drei Körper keine einfache Formel besitzen: kein einzelnes Modell eines Teilnehmers sagt das Ganze voraus. Sculley und Kollegen fanden dieselbe Struktur in maschinellen Lernsystemen, wobei der Modellcode nur einen kleinen Teil des Systems ausmacht und die meisten Wartungskosten in Klebstoffcode, Konfiguration, Datenabhängigkeiten und nicht deklarierten Verbrauchern liegen, also in Schnittstellen [21].

<div id="4-the-interface-literature" class="anchor-alias" aria-hidden="true"></div>

## 4. Die Schnittstellenliteratur

Die These ist in ihren Teilen nicht neu. Ihr Beitrag besteht darin, sie zu einer Aussage zu verbinden und eine stabilisierende Konfiguration sowie einen Test anzuhängen.

**Struktur folgt Kommunikation.** Conway beobachtete 1968, dass Organisationen, die Systeme entwerfen, Designs produzieren, die die Kommunikationsstruktur der Organisation nachahmen [22]. MacCormack, Baldwin und Rusnak prüften diese Spiegelungshypothese an passenden Paaren von Produkten, die von eng bzw. lose gekoppelten Organisationen gebaut wurden, und stellten fest, dass die Produktarchitekturen in der vorhergesagten Richtung differieren [23]. Wenn die Komponenten über eine Kante nicht kommunizieren, hat das System an dieser Kante eine nicht untersuchte Schnittstelle.

**Schnittstellen sind der Ort des Designwissens.** Parnas argumentierte 1972, dass ein System in Module zu unterteilen sei, basierend auf den Entscheidungen, die jedes Modul verbirgt, sodass eine Änderung einer Entscheidung auf ein Modul beschränkt bleibt [24]. Baldwin und Clark verallgemeinerten dies zu Designregeln: sichtbare Schnittstellenentscheidungen werden im Voraus festgelegt, hinter denen verborgene Module variieren können [25]. Henderson und Clark zeigten, dass etablierte Unternehmen bei architektonischer Innovation - einer Änderung der Verknüpfung bekannter Komponenten - scheitern, weil ihr Wissen über die Schnittstellen in ihrer Organisation verankert und nicht untersucht ist [26].

**Korrektheit muss an den Enden geprüft werden.** Das End-to-End-Argument von Saltzer, Reed und Clark besagt, dass eine Funktion nur mit dem Wissen über die Anwendung an den Endpunkten vollständig und korrekt implementiert werden kann, sodass Prüfungen in den unteren Schichten höchstens Leistungsverbesserungen darstellen [27]. Das Argument sagt nicht, dass Zwischenschnittstellen keine Prüfungen benötigen. Es besagt, dass die relevante Eigenschaft dort geprüft werden muss, wo ihre Bedeutung bekannt ist.

**Verträge machen Annahmen explizit.** Hoare gab Programmen 1969 Vorbedingungen und Nachbedingungen [28]. Meyer entwickelte daraus Design by Contract, bei dem jede Routine angibt, was sie verlangt und was sie garantiert [29]. Liskov und Wing definierten, wann eine Komponente eine andere ersetzen darf: wenn sie das Verhalten bewahrt, auf das ihre Nutzer vertrauen [30]. Jede dieser Methoden schreibt eine Schnittstellenannahme nieder, sodass sie geprüft werden kann.

**Wiederverwendung scheitert an nicht übereinstimmenden Annahmen.** Garlan, Allen und Ockerbloom stellten 1995 fest, dass der Bau eines Systems aus bestehenden Teilen scheiterte, weil jedes Teil implizite Annahmen über die anderen machte - über Steuerung, Daten, Protokolle und die Umgebung - und diese Annahmen im Konflikt standen [31]. Bei einer erneuten Untersuchung 2009 stellten sie fest, dass das Problem weiterhin besteht [32].

**Unfälle sind Interaktionsfehler.** Levesons systemtheoretischer Ansatz behandelt Sicherheit als ein Steuerungsproblem: Unfälle entstehen durch unsichere Interaktionen zwischen Komponenten, die jeweils ihre eigene Spezifikation erfüllen [33]. Cooks kurze Abhandlung über das Versagen komplexer Systeme sagt dasselbe aus der Sicht des Betriebs: Katastrophen erfordern mehrere Fehler, und das System läuft meist in einem degradieren Modus [34]. Lehman’s Beobachtungen zur Softwareentwicklung fügen Zeit hinzu: Ein im Einsatz befindliches Programm muss sich ständig ändern, und seine Komplexität wächst, sofern nicht aktiv Maßnahmen zu ihrer Reduktion ergriffen werden [35].

**Verifizierte Kernel zeigen, dass eine Grenze ein Beweis sein kann.** seL4 war der erste allgemeine Betriebssystemkernel mit einem maschinell geprüften Beweis, dass seine Implementierung seiner Spezifikation entspricht [36]. Der Beweis ist ein Schnittstellencheck, der vollständig ist: zwischen Spezifikation und Code wird nichts vorausgesetzt.

<div id="5-definitions-and-propositions" class="anchor-alias" aria-hidden="true"></div>

## 5. Definitionen und Propositionen

<div id="51-definitions" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Definitionen

**Definition 1 (Körper).** Ein Körper ist eine Partei mit einem intern kohärenten Modell eines Systems: ein Theoretiker, ein Hersteller oder ein Nutzer. Ein Körper kann eine Person, ein Team, eine Organisation oder ein Programm sein.

**Definition 2 (Schnittstelle).** Eine Schnittstelle ist ein Übergabepunkt zwischen zwei Körpern oder zwischen zwei Ebenen eines Stacks, über den die Ausgabe der einen Seite zur Eingabe der anderen Seite wird.

**Definition 3 (Schnittstellenannahme).** Eine Schnittstellenannahme ist ein Prädikat $a$ über die Werte, die eine Schnittstelle überqueren, wobei die empfangende Seite für ihre eigene Korrektheit darauf vertraut. Beispiele: eine Einheit, ein Bereich, ein Typ, eine Spannung, eine Zeitgrenze, eine Version, ein Envelope.

**Definition 4 (geprüft und ungeprüft).** Eine Annahme ist geprüft, wenn ein Mechanismus $a$ bei jedem Durchgang auswertet und den Durchgang verweigert, wenn $a$ fehlschlägt. Sie ist ungeprüft, wenn sie zwar verwendet wird, aber weder schriftlich festgehalten noch ausgewertet wird.

**Definition 5 (Stack).** Ein Stack ist eine Sequenz von Ebenen $L_0, \dots, L_n$, wobei jede Ebene die darunterliegende Ebene ausschließlich über die zwischen ihnen liegende Schnittstelle konsumiert. Ein Körper kann mehrere Ebenen besitzen; eine Schnittstelle kann zwei Körper oder zwei Ebenen eines Körpers verbinden.

**Definition 6 (allgemeiner Agent).** Nach Legg und Hutter ist ein allgemeiner Agent einer, dessen Leistung über eine breite Klasse von Umgebungen gemessen wird, nicht über eine einzelne Aufgabe [37]. Morris und Kollegen operationalisieren Stufen von AGI sowohl nach Leistung als auch nach Allgemeinheit [38]. Für dieses Papier ist die relevante Eigenschaft die Allgemeinheit über Körper hinweg: Der Agent muss als Theoretiker, Hersteller und Nutzer agieren und über jede Ebene des Stacks hinweg.

<div id="52-propositions" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Propositionen

**Proposition 1 (Fehler entstehen an nicht geprüften Schnittstellen).** Wenn jeder Baustein korrekt bezüglich seines eigenen Modells ist, dann verletzt jeder Fehler des zusammengesetzten Systems mindestens eine Schnittstellenannahme, und wenn jede Annahme geprüft wird, wird die zuerst verletzte Annahme an der Schnittstelle, an der sie auftritt, abgelehnt.

*Beweisskizze.* Wenn jeder Baustein korrekt relativ zu seinen Eingaben ist und jede Eingabe die Annahmen erfüllt, auf die sich der Baustein stützt, ist die Zusammensetzung durch Induktion über den Stapel korrekt. Ein Fehler erfordert daher ein Durchschreiten, bei dem eine Annahme fehlschlägt. Wenn diese Annahme geprüft wird, wird das Durchschreiten dort abgelehnt, sodass der Fehler an dieser Schnittstelle lokalisiert ist und sich nicht ausbreitet. ∎

**Proposition 2 (ungeprüfte Diskrepanzen verbreiten sich).** Wenn eine Annahme an der Schnittstelle zwischen $L_k$ und $L_{k+1}$ nicht untersucht wird, kann eine Verletzung an dieser Schnittstelle falsche Werte auf jeder Ebene über $k$ erzeugen, und keine Prüfung auf einer Ebene über $k$, die nur in den Begriffen dieser Ebene formuliert ist, kann sie lokalisieren.

*Skizze.* Ebenen über $k$ sehen nur Ausgaben von $L_{k+1}$, die wohlgeformt relativ zum eigenen Modell von $L_{k+1}$ sind. Der Mars Climate Orbiter ist das Beispiel: die Navigationslösung war intern konsistent und falsch [12].

**Proposition 3 (die stabilisierte Konfiguration).** In einem Stapel, in dem jede Schnittstellenannahme explizit und geprüft ist, lässt eine Korrektur auf Ebene $k$, die die Prüfung ihrer eigenen Grenze besteht, jede durch die Prüfungen der anderen Grenzen etablierte Eigenschaft unverändert, und jede Ebene über $k$ übernimmt die Korrektur ohne Änderung.

*Skizze.* Die Prüfungen an den anderen Grenzen bewerten Prädikate über die Werte, die diese Grenzen überschreiten. Das korrigierte $L_k$ ändert nur Werte, die die Grenzen von $L_k$ überschreiten, und seine ausgehenden Werte erfüllen die geprüfte Annahme der darüber liegenden Grenze. Jede Ebene über $k$ konsumiert $L_k$ nur über eine geprüfte Schnittstelle, sodass, wenn das korrigierte $L_k$ diese Schnittstelle erfüllt, die Verbraucher einen korrekten Eingang sehen. ∎

**Proposition 4 (das Streben nach AGI erzwingt Explizität).** Sei ein allgemeiner Agent im Sinne von Definition 6 verpflichtet, ein Korrektheitsgate für Aufgaben zu passieren, die über alle drei Bausteine und alle Ebenen des Stapels verteilt sind. Dann muss für jede Schnittstelle, die die Aufgabenverteilung kreuzt, entweder der Agent die Schnittstellenannahme explizit machen und prüfen, oder es gibt eine Aufgabe, bei der der Erfolg des Agenten von einer ungeprüften Vermutung über diese Annahme abhängt.

*Argument.* Ein enges System kann sich auf die Konvention seiner einen Umgebung verlassen: ein festes Einheitensystem, ein festes Befehlssatz, eine feste Version. Ein allgemeiner Agent begegnet Umgebungen, in denen diese Konventionen unterschiedlich sind, per Definition der Allgemeinheit. Eine Annahme, die in einer Umgebung gilt und in einer anderen fehlschlägt, muss erkannt werden, um gehandhabt zu werden, und das Erkennen ist das Prüfen. Ein Korrektheitsgate ist ein Test, den ein Durchlauf entweder besteht oder nicht, ohne Teilpunkte. Unter einem solchen Gate ist eine Vermutung, die sich als falsch herausstellt, eine fehlgeschlagene Aufgabe, nicht Teilpunkte. Daher ist das Streben nach Allgemeinheit unter einem Gate ein Druck hin zu expliziten, geprüften Schnittstellen an jeder Grenze, die der Agent berührt. Die Proposition besagt nicht, dass irgendein aktuelles System diesem Standard entspricht. Sie beschreibt, was das Ziel verlangt.

**Proposition 5 (Joule bewerten die stabilen Konfigurationen).** Unter den Stapeln, die das Tor passieren, wird derjenige bevorzugt, der jede Schnittstelle mit dem geringsten Energieaufwand bis zum Abschluss löst, und eine explizite Prüfung, die einmal an einer Schnittstelle durchgeführt wird, ist über eine Arbeitslast hinweg günstiger als ein Fehler, der auf jeder darüber liegenden Ebene erneut entdeckt wird.

*Skizze.* Die Reihenfolge ist Tor dann Rang: Korrektheit ist eine Einschränkung, die jeder Kandidat erfüllen muss, und Energie bis zum Abschluss, in Joule, ordnet nur die Kandidaten, die sie erfüllen, wie bei einer eingeschränkten Optimierung, bei der das Ziel nur über der zulässigen Menge verglichen wird. Eine Prüfung an der Grenze hat feste Kosten pro Durchgang. Eine nicht untersuchte Diskrepanz verursacht Kosten auf jeder Ebene, die sie erreicht, und diese Kosten wiederholen sich bei jedem Durchlauf, bis die Diskrepanz gefunden wird.

<div id="6-the-stabilized-configuration" class="anchor-alias" aria-hidden="true"></div>

## 6. Die stabilisierte Konfiguration

![Diagramm der gleichen drei Körper, jetzt an den Ecken eines gleichseitigen Dreiecks innerhalb eines rotierenden Rahmens angeordnet, im Stil der Lagrange-Konfiguration. Jeder Schnittstellen‑Band ist solide und trägt ein Häkchen sowie eine kurze Beschriftung: die einmal geschriebene Spezifikation, das Tor beim Eintritt und die Spur und Quittung, die zum Theoretiker zurückkehren. In der Mitte befindet sich ein gemeinsamer Rahmen, beschriftet eine Spezifikation, ein Tor, Joule als Rang.](/figures/three-body/stabilized.svg)

*Abbildung 2. Die stabilisierte Konfiguration. Diagramm. In der Physik behalten drei Körper ihre relativen Positionen in einem Rahmen, der mit ihnen rotiert. In der Informatik ist der gemeinsame Rahmen eine explizite, maschinenprüfbare Absichtserklärung, bei der jede Schnittstellenannahme geprüft wird, sodass die drei Körper ihre Beziehungen beibehalten, wenn das System sich ändert. Eine [PNG‑Kopie](/figures/three-body/stabilized.png) wird bereitgestellt.*

<div id="61-the-shared-frame" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Der gemeinsame Rahmen

Lagranges Konfigurationen sind nur in einem Bezugssystem stabil, das sich mit den Körpern bewegt. Das Gegenstück in der Informatik ist eine gemeinsame Repräsentation, die alle drei Körper lesen und schreiben, wobei jede Schnittstellenannahme eine prüfbare Aussage ist: eine formale Spezifikation, ein maschinengeschützter Vertrag oder ein Typ. Wenn die Aussage des Theoretikers, die Implementierung des Herstellers und das beobachtete Verhalten des Benutzers durch Prüfungen gegen eine solche Repräsentation miteinander verknüpft sind, dann sind die Übergaben zwischen ihnen Prüfungen und keine Übersetzungen.

<div id="62-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Jede Schnittstellenannahme explizit

![Diagram of a stack with six levels from intent at the top through specification, gate, projections and runtime to hardware and energy. Between each pair of adjacent levels sits an interface drawn as a small gate with its assumption and its check written beside it. A correction made at the runtime level is drawn with arrows rising through each checked interface to the levels above.](/figures/three-body/stack-checks.svg)

*Abbildung 3. Der Stack mit jeder geprüften Schnittstelle. Diagramm. Eine [PNG‑Kopie](/figures/three-body/stack-checks.png) ist bereitgestellt.*

Die Methode besteht aus drei Schritten. Listen Sie jede Grenze des Stacks auf. Für jede formulieren Sie die Annahme, auf die die empfangende Seite vertraut, als Prädikat und benennen Sie den Mechanismus, der sie bei jedem Durchgang evaluiert. Scheitert eine Prüfung, wird die Unterbrechung an dieser Grenze lokalisiert; die Korrektur erfolgt auf dieser Ebene, wird durch die Prüfung dieser Grenze geleitet und von den darüber liegenden Ebenen übernommen.

<div id="63-evidence-from-verified-systems" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Evidenz aus verifizierten Systemen

Die Existenz stabilisierter Konfigurationen im Sinne von Proposition 3 wird durch von unabhängigen Gruppen entwickelte und getestete Systeme unterstützt.

- **Ein verifizierter Compiler unter Zufallstests.** CompCert ist ein C‑Compiler, dessen optimierende Mittel- und Backend‑Teile einen maschinell geprüften Beweis enthalten, dass der erzeugte Code die Semantik der Quelle bewahrt [39]. Yang, Chen, Eide und Regehr führten Csmith, einen zufälligen Programmgenerator, gegen CompCert und viele andere Compiler aus. Sie berichteten über Hunderte zuvor unbekannter Fehler in den anderen Compilern. In CompCert fanden sie keine falschen‑Code‑Fehler im verifizierten Mittelteil. Die Defekte, die sie fanden, befanden sich in Teilen außerhalb des Beweises, etwa im Front‑End und einer nicht verifizierten Annahme über das Ziel [40]. Fehler traten dort auf, wo eine Annahme ungeprüft blieb, wie Propositionen 1 und 2 vorhersagen, und nicht über geprüfte Grenzen hinweg.
- **Eine verifizierte Kernel‑Grenze.** Der Beweis von seL4 verbindet seine C‑Implementierung mit einer abstrakten Spezifikation, sodass zwischen Spezifikation und Code nichts vorausgesetzt wird [36]. Der Beweis wird relativ zu expliziten Annahmen über den Compiler, den Assemblercode und die Hardware formuliert, was die Methode von Abschnitt 6.2 in der Praxis zeigt: die Restannahmen werden als die verbleibenden Schnittstellen niedergelegt.
- **Spezifikationen in der industriellen Praxis.** Newcombe und Kollegen berichten, dass Ingenieure bei Amazon Web Services TLA+‑Spezifikationen für zentrale verteilte Systeme geschrieben haben und dass Model‑Checking subtile Designfehler aufdeckte, manche erforderten lange Ereignisfolgen, die Review und Tests verpasst hatten [41].
- **Einheiten als geprüfte Schnittstelle.** Kennedys Dimensionstypen machen die Einheit einer Größe zum Teil ihres Typs, sodass ein pound‑force‑second‑Wert nicht ohne explizite Umwandlung an einer Stelle verwendet werden kann, an der ein newton‑second‑Wert erwartet wird [42]. Die Schnittstellenannahme hinter dem Verlust des Mars Climate Orbiter [12] wird damit zur Ablehnung zur Compile‑Zeit.

Diese Evidenz stammt aus einzelnen Systemen, die jeweils mit Prüfungen im Blick entwickelt wurden. Sie zeigt, dass die stabilisierte Konfiguration existiert und aufrechterhalten werden kann. Sie zeigt nicht, dass die Konfiguration auf Stapel ausgedehnt werden kann, die mehrere Organisationen umfassen. Die Protokolle von Abschnitt 8 sind dafür geschrieben, dies zu testen.

<div id="7-the-hardware-side" class="anchor-alias" aria-hidden="true"></div>

## 7. Die Hardware-Seite

Die Hardware-Grenze ist der Punkt, an dem Annahmen über Schnittstellen physisch werden: eine Versorgungsspannung, ein thermisches Umfeld, ein Speichermodell, ein Instruktionsvertrag. Abschnitt 3.2 gab den Instruktionsvertrag als Beispiel für eine Herstellerschnittstelle, die im Laufe der Zeit überarbeitet wird [17, 18]. Ein Stack, der die Hardware als fest annimmt, besitzt eine nicht untersuchte Schnittstelle auf seiner untersten Ebene, und Proposition 2 besagt, dass eine Diskrepanz dort jede darüber liegende Ebene erreichen kann.

Im Rahmen dieses Artikels ist die Hardware‑Seite ein Satz von Schnittstellen, die explizit gemacht werden müssen, und ein Hardware‑Ergebnis wird unter demselben Tor und derselben Energie‑Bewertung wie Software eingeordnet.

<div id="8-protocols" class="anchor-alias" aria-hidden="true"></div>

## 8. Protokolle

Jedes Protokoll wird vor seiner Ausführung festgelegt. Energiewerte tragen eines von drei Labels: `est_j` für eine analytische Schätzung, `reported_j` für eine Messung aus einem Betriebssystem oder einem On-Chip‑Zähler, und `measured_j` für eine Messung von einem externen Strommessgerät.

<div id="81-interface-inventory" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Schnittstelleninventar

Für ein Zielsystem jede Schnittstelle zwischen Körpern und zwischen Ebenen aufzählen. Für jede Schnittstelle die Annahme als Prädikat, den Eigentümer und ob ein Mechanismus sie prüft, festhalten. Den Anteil der Annahmen, die geprüft werden, sowie den Anteil ohne Eigentümer angeben. Zwei unabhängige Prüfer das gleiche System inventarisieren; deren Übereinstimmung berichten.

<div id="82-break-and-catch" class="anchor-alias" aria-hidden="true"></div>

### 8.2 Bruch und Fang

Für jede aufgezeichnete Annahme injiziere eine Verletzung an dieser Schnittstelle in einem festen Saatgut-Set. Dokumentiere, ob die Verletzung an dieser Schnittstelle abgelehnt wird, später auf einer höheren Ebene erfasst wird oder nicht erfasst wird. Proposition 1 sagt voraus, dass geprüfte Annahmen an ihrer eigenen Schnittstelle abgelehnt werden. Proposition 2 sagt voraus, dass nicht untersuchte Annahmen, wenn sie überhaupt erfasst werden, später erfasst werden und nicht lokalisiert sind.

<div id="83-compounding" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Kumulierung

Führen Sie eine feste Arbeitslast für $R$ Runden mit und ohne eine auf einem gewählten Niveau beförderte Korrektur durch. Zeichnen Sie Eskalationen, Fehler und Energie pro Runde auf. Proposition 3 sagt voraus, dass die kumulierten Eskalationen mit der Korrektur in keiner Runde höher sind und dass keine vor der Beförderung geprüfte Eigenschaft nach ihr fehlschlägt.

<div id="84-cross-body-handoff" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Übergabe über Körpergrenzen hinweg

Wählen Sie eine reale Übergabe zwischen Organisationen: eine Spezifikation, die an einen Implementierer übergeben wird, eine Bibliothek, die an nachgelagerte Nutzer weitergegeben wird, oder eine Hardware‑Revision, die an Software übergeben wird. Stellen Sie die Übergabe als gemeinsame Repräsentation mit expliziten Annahmen dar, führen Sie das Break‑and‑Catch‑Protokoll darüber aus und vergleichen Sie dies mit derselben Übergabe, die durch Fließtext‑Dokumentation vermittelt wird. Berichten Sie über Fehler, die an der Schnittstelle in jedem Arm auftreten, mit Wilson‑95‑%‑Intervallen.

<div id="85-generality-under-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Allgemeingültigkeit unter dem Gate

Erstellen Sie ein Aufgabenset, das die Konventionen an Schnittstellen variiert: Einheiten, Anweisungsverträge, Bibliotheksversionen, Kodierungen. Bewerten Sie Agenten unter einer Korrektheitsprüfung. Proposition 4 sagt voraus, dass Erfolg über das variierte Set hinweg das Erkennen der Konvention erfordert, sodass Agenten, die Schnittstellenannahmen explizit prüfen, einen größeren Anteil der variierenden Aufgaben bestehen sollten als Agenten, die eine Vorgabe annehmen, bei gleicher Erfolgsrate bei den Vorgabeaufgaben. Rangieren Sie die bestandenen Agenten nach Joule bis zum Abschluss.

<div id="9-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 9. Falsifikatoren

| ID | Beobachtung | Niederlagen |
|---|---|---|
| TBP-F1 | Im Break‑und‑Catch‑Protokoll wird eine Verletzung einer geprüften Annahme an ihrer eigenen Schnittstelle akzeptiert | Proposition 1 wie für das zu testende System angegeben |
| TBP-F2 | Im Kompositions‑Protokoll führt eine Korrektur, die ihre eigene Grenzprüfung besteht, dazu, dass eine zuvor bestandene Prüfung an einer anderen Grenze fehlschlägt | Proposition 3 |
| TBP-F3 | Im Cross‑Body‑Protokoll identifiziert die gemeinsame Repräsentation nicht mehr Schnittstellenfehler als die Fließtext‑Dokumentation, innerhalb der Intervalle | Der Anspruch, dass explizite geprüfte Schnittstellen Übergaben zwischen Körpern stabilisieren |
| TBP-F4 | Im Generalitäts‑Protokoll bestehen Agenten, die Vorgaben annehmen, die variierenden Aufgaben mit einer Rate, die nicht niedriger ist als die von Agenten, die prüfen, bei gleicher Vorgaben‑Leistung | Proposition 4 |
| TBP-F5 | Ein Schnittstellen‑Inventar eines funktionierenden Systems findet Fehler, deren Ursache keiner Schnittstellen‑Annahme zugeordnet werden kann, wobei jeder Körper zu seinem eigenen Modell korrekt ist | Der Schnittstellen‑Bericht über Instabilität |

<div id="10-limits-of-the-argument" class="anchor-alias" aria-hidden="true"></div>
<div id="10-scope-and-method" class="anchor-alias" aria-hidden="true"></div>

## 10. Umfang und Methode

Die Physik tritt als Struktur auf. Sie liefert den Wortschatz von Körpern, Relationen und stabilen Konfigurationen, und jede Aussage wird in den eigenen Begriffen der Informatik formuliert und geprüft. Behauptungen über Empfindlichkeit sind Behauptungen darüber, wie Ergebnisse von nicht untersuchten Fehlanpassungen abhängen, und sie werden statistisch bei großem N gemessen, analog zu Stone und Leigh [7].

Explizitheit wird aufrechterhalten, nicht deklariert. Annahmen treten zutage, wenn ein System neue Umgebungen trifft, und die Welt, die ein Programm bedient, bewegt sich weiter [35]. Die Methode behandelt daher jede entdeckte Annahme als neue Schnittstelle, die zu schließen ist: geschrieben als Prädikat, mit einem Check versehen und unter Proposition 3 geprüft. Die stabilisierte Konfiguration wird gehalten, wie ein Raumfahrzeug in der Nähe eines Lagrange-Punkts, durch fortlaufende Stationshaltung.

Die Analyseeinheit ist die Übergabe zwischen Rollen. Eine Person kann am Nachmittag Theoretiker, Entwickler und Nutzer sein, sodass die Methode dort anwendbar ist, wo immer eine Übergabe stattfindet, innerhalb eines Teams oder über Organisationsgrenzen hinweg. Jeder Ansatz zum Bau von Systemen, von formalen Methoden über große Modelle mit Tests bis hin zu handgeschriebenem Code mit Review, wird nach derselben Messgröße bewertet: dem Anteil seiner Schnittstellenannahmen, die explizit und geprüft sind, abgelesen aus dem Inventarprotokoll von Abschnitt 8.1.

<div id="11-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 11. Schlussfolgerung

Das Drei‑Körper‑Problem lehrte die Physik, dass Instabilität aus den Beziehungen zwischen einfachen Teilen entstehen kann und dass Stabilität, wo sie existiert, eine besondere Anordnung dieser Beziehungen in einem gemeinsamen Rahmen darstellt. Die Informatik hat eigene drei Körper: Theoretiker, Entwickler und Anwender, und ihre Instabilität entsteht an den Schnittstellen zwischen ihnen, wo Annahmen ungeschrieben und ungeprüft kreuzen. Ein System, das allgemeine Intelligenz anstrebt, muss über alle drei Körper und jede Ebene des Stacks hinweg agieren, sodass es diese Annahmen nicht implizit lassen kann. Dieses Ziel ernst zu nehmen bedeutet, jede Schnittstellen‑Annahme schriftlich festzuhalten und bei jedem Übergang zu prüfen. In einem auf diese Weise aufgebauten Stack bleibt eine Korrektur dort, wo sie vorgenommen wird, und trägt nach oben, wobei das System seine Form beibehält, während es sich verändert. So löst das Streben nach AGI das Drei‑Körper‑Problem in der Informatik.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Literaturverzeichnis

[1] Liu Cixin, *The Three-Body Problem*, translated by Ken Liu. Tor Books, 2014. Original Chinese edition 三体, Chongqing Publishing House, 2008. ISBN 978-0-7653-7706-7.

[2] H. Poincaré, "Sur le problème des trois corps et les équations de la dynamique," *Acta Mathematica* 13, 1890, pp. 1 to 270. Introduction: doi:10.1007/BF02392506

[3] J. Barrow-Green, *Poincaré and the Three Body Problem*. History of Mathematics 11, American Mathematical Society, 1997. doi:10.1090/hmath/011

[4] K. F. Sundman, "Mémoire sur le problème des trois corps," *Acta Mathematica* 36, 1913, pp. 105 to 179. doi:10.1007/BF02422379

[5] Q. Wang, "The global solution of the N-body problem," *Celestial Mechanics and Dynamical Astronomy* 50, 1991, pp. 73 to 88. doi:10.1007/BF00048987

[6] E. N. Lorenz, "Deterministic Nonperiodic Flow," *Journal of the Atmospheric Sciences* 20(2), 1963, pp. 130 to 141. doi:10.1175/1520-0469(1963)020<0130:DNF>2.0.CO;2

[7] N. C. Stone and N. W. C. Leigh, "A statistical solution to the chaotic, non-hierarchical three-body problem," *Nature* 576, 2019, pp. 406 to 410. doi:10.1038/s41586-019-1833-8

[8] E. J. Routh, "On Laplace's Three Particles, with a Supplement on the Stability of Steady Motion," *Proceedings of the London Mathematical Society* s1-6, 1874, pp. 86 to 97. doi:10.1112/plms/s1-6.1.86

[9] C. Moore, "Braids in classical dynamics," *Physical Review Letters* 70, 1993, pp. 3675 to 3679. doi:10.1103/PhysRevLett.70.3675

[10] A. Chenciner and R. Montgomery, "A Remarkable Periodic Solution of the Three-Body Problem in the Case of Equal Masses," *Annals of Mathematics* 152(3), 2000, pp. 881 to 901. doi:10.2307/2661357

[11] M. Šuvakov and V. Dmitrašinović, "Three Classes of Newtonian Three-Body Planar Periodic Orbits," *Physical Review Letters* 110, 114301, 2013. doi:10.1103/PhysRevLett.110.114301

[12] Mars Climate Orbiter Mishap Investigation Board, *Phase I Report*. NASA, 10 November 1999. https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf

[13] H. Wright, "Hyrum's Law." https://www.hyrumslaw.com/

[14] J. Spolsky, "The Law of Leaky Abstractions," *Joel on Software*, 11 November 2002. https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/

[15] J. L. Lions (chair), *Ariane 5 Flight 501 Failure: Report by the Inquiry Board*. European Space Agency, 19 July 1996. https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf

[16] G. Le Lann, "An analysis of the Ariane 5 flight 501 failure: a system engineering perspective," *Proceedings of the IEEE International Conference on the Engineering of Computer-Based Systems*, 1997, pp. 339 to 346. doi:10.1109/ECBS.1997.581900

[17] RISC-V International, *The RISC-V Instruction Set Manual, Volume I: Unprivileged Architecture*, version 20250508, preface. https://docs.riscv.org/reference/isa/v20250508/unpriv/colophon.html

[18] Apple, "Using Intel-based apps on a Mac with Apple silicon," Apple Support, article 102527, published 21 September 2026. https://support.apple.com/en-us/102527

[19] P. Zave and M. Jackson, "Four Dark Corners of Requirements Engineering," *ACM Transactions on Software Engineering and Methodology* 6(1), 1997, pp. 1 to 30. doi:10.1145/237432.237434

[20] S. Hooker, "The Hardware Lottery," *Communications of the ACM* 64(12), 2021, pp. 58 to 65. doi:10.1145/3467017

[21] D. Sculley, G. Holt, D. Golovin, E. Davydov, T. Phillips, D. Ebner, V. Chaudhary, M. Young, J.-F. Crespo and D. Dennison, "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems* 28, 2015. https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

[22] M. E. Conway, "How Do Committees Invent?" *Datamation* 14(4), April 1968, pp. 28 to 31. https://www.melconway.com/Home/Committees_Paper.html

[23] A. MacCormack, C. Baldwin and J. Rusnak, "Exploring the duality between product and organizational architectures: A test of the 'mirroring' hypothesis," *Research Policy* 41(8), 2012, pp. 1309 to 1324. doi:10.1016/j.respol.2012.04.011

[24] D. L. Parnas, "On the criteria to be used in decomposing systems into modules," *Communications of the ACM* 15(12), 1972, pp. 1053 to 1058. doi:10.1145/361598.361623

[25] C. Y. Baldwin and K. B. Clark, *Design Rules, Volume 1: The Power of Modularity*. MIT Press, 2000. doi:10.7551/mitpress/2366.001.0001

[26] R. M. Henderson and K. B. Clark, "Architectural Innovation: The Reconfiguration of Existing Product Technologies and the Failure of Established Firms," *Administrative Science Quarterly* 35(1), 1990, pp. 9 to 30. doi:10.2307/2393549

[27] J. H. Saltzer, D. P. Reed and D. D. Clark, "End-to-end arguments in system design," *ACM Transactions on Computer Systems* 2(4), 1984, pp. 277 to 288. doi:10.1145/357401.357402

[28] C. A. R. Hoare, "An axiomatic basis for computer programming," *Communications of the ACM* 12(10), 1969, pp. 576 to 580. doi:10.1145/363235.363259

[29] B. Meyer, "Applying 'design by contract'," *Computer* 25(10), 1992, pp. 40 to 51. doi:10.1109/2.161279

[30] B. H. Liskov and J. M. Wing, "A behavioral notion of subtyping," *ACM Transactions on Programming Languages and Systems* 16(6), 1994, pp. 1811 to 1841. doi:10.1145/197320.197383

[31] D. Garlan, R. Allen and J. Ockerbloom, "Architectural mismatch: why reuse is so hard," *IEEE Software* 12(6), 1995, pp. 17 to 26. doi:10.1109/52.469757

[32] D. Garlan, R. Allen and J. Ockerbloom, "Architectural Mismatch: Why Reuse Is Still So Hard," *IEEE Software* 26(4), 2009, pp. 66 to 69. doi:10.1109/MS.2009.86

[33] N. G. Leveson, *Engineering a Safer World: Systems Thinking Applied to Safety*. MIT Press, 2012. doi:10.7551/mitpress/8179.001.0001

[34] R. I. Cook, "How Complex Systems Fail," Cognitive Technologies Laboratory, University of Chicago, 1998. https://how.complexsystems.fail/

[35] M. M. Lehman, "Programs, life cycles, and laws of software evolution," *Proceedings of the IEEE* 68(9), 1980, pp. 1060 to 1076. doi:10.1109/PROC.1980.11805

[36] G. Klein, K. Elphinstone, G. Heiser, J. Andronick, D. Cock, P. Derrin, D. Elkaduwe, K. Engelhardt, R. Kolanski, M. Norrish, T. Sewell, H. Tuch and S. Winwood, "seL4: Formal Verification of an OS Kernel," *Proceedings of the 22nd ACM Symposium on Operating Systems Principles*, 2009, pp. 207 to 220. doi:10.1145/1629575.1629596

[37] S. Legg and M. Hutter, "Universal Intelligence: A Definition of Machine Intelligence," *Minds and Machines* 17(4), 2007, pp. 391 to 444. doi:10.1007/s11023-007-9079-x

[38] M. R. Morris, J. Sohl-Dickstein, N. Fiedel, T. Warkentin, A. Dafoe, A. Faust, C. Farabet and S. Legg, "Levels of AGI for Operationalizing Progress on the Path to AGI," *Proceedings of the 41st International Conference on Machine Learning*, 2024. arXiv:2311.02462

[39] X. Leroy, "Formal verification of a realistic compiler," *Communications of the ACM* 52(7), 2009, pp. 107 to 115. doi:10.1145/1538788.1538814

[40] X. Yang, Y. Chen, E. Eide and J. Regehr, "Finding and understanding bugs in C compilers," *Proceedings of the 32nd ACM SIGPLAN Conference on Programming Language Design and Implementation*, 2011, pp. 283 to 294. doi:10.1145/1993498.1993532

[41] C. Newcombe, T. Rath, F. Zhang, B. Munteanu, M. Brooker and M. Deardeuff, "How Amazon Web Services uses formal methods," *Communications of the ACM* 58(4), 2015, pp. 66 to 73. doi:10.1145/2699417

[42] A. Kennedy, "Types for Units-of-Measure: Theory and Practice," in *Central European Functional Programming School*, Lecture Notes in Computer Science 6299, Springer, 2010, pp. 268 to 305. doi:10.1007/978-3-642-17685-2_8
