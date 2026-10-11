*Version 1.1, 11. Oktober 2026. Daten und Code: [research.openie.dev/data/](/data/#rce). Playground: [/playground/rce/](/playground/rce/). LaTeX-PDF: [/pdfs/latex/rce.pdf](/pdfs/latex/rce.pdf) ([Quelltext](/pdfs/latex/rce.tex)).*

*Eine Form, aus der Absicht geschrieben. Viele Projektionen. Das Tor ist Korrektheit, die Rangfolge sind Joule.*

Die ökonomische Lesart dieses Papiers steht in seinem Begleittext, [Der versprochene Billionen-Dollar-Markt für KI-Programmierung](/papers/ai-coding-market/). Dieses Papier enthält nur die Technik und die Theorie.

## 1. These

Autonome Computerautomatisierung ist ein Entwurfsraum mit vielen Punkten. Jeder Ansatz liegt irgendwo entlang fünf stetiger Achsen: der Energie, die pro korrektem Ergebnis aufgewendet wird; der Entropie, die das System zur Laufzeit auflösen muss, und damit dem Grad, in dem seine Ausgabe deterministisch ist; der Stärke der Verifikation, die ein Ergebnis annimmt; dem Maß, in dem jedes angenommene Ergebnis wiederverwendet wird und kumuliert; und dem Maß, in dem der Ansatz sich auf ein Modell stützt. Ein großes Sprachmodell (LLM), ein statistisches Textmodell, das jede Änderung aus dem Prompt schreibt, liegt nahe einer Ecke dieses Raums: Es stützt sich bei jeder Aufgabe auf das Modell, zieht jedes Mal eine frische Stichprobe aus einer Verteilung hoher Entropie und bezahlt die Generierung bei jeder Aufgabe erneut. Retrieval, Regeln, Synthese, Verifikation und Caching besetzen viele andere Punkte, und reale Systeme kombinieren sie.

Die Reality Code Engine (RCE) ist ein Punkt in diesem Raum, gewählt, um alle fünf Achsen zugleich zu optimieren. Das meiste dessen, was je programmiert werden wird, haben Menschen bereits programmiert. Ein Programm ist eine funktionale Datenbank-Zustandsmaschine: eine Form, viele Passungen. Menschliche Absicht hat hohe Entropie. Der Maschinenboden hat niedrige Entropie. Code konvergiert konstruktionsbedingt, also besteht der größte Teil der Arbeit darin, eine vorhandene Passung abzurufen, sie anzupassen und sie zu beweisen, und ein Modell wird nur aufgerufen, wenn nichts Billigeres die Aufgabe schließt.

**Die Kernaussage.** RCE ist ein vollständiges Code-Ökosystem, in dem Programme nativ aus der Absicht geschrieben werden. Die Absicht wird einmal geschrieben, als Form: ein Zustand, eine Menge von Ereignissen und ein reiner, totaler Übergang. Die Form ist eine verlustfreie Codierung dieser Absicht. Jedes Ziel (Statechart, Rust, Python, XState, SCXML, WASM) ist eine Projektion der Form, und jede Projektion spielt die Spur der Form Byte für Byte nach. Ein Zustand, den die Form nicht deklariert, kann nicht geschrieben werden, und eine Eingabe außerhalb ihres Vertrags wird am Eingang abgewiesen. Ein Programm im Ökosystem kann daher nicht von seiner Absicht abdriften, so wie ein Programm in einer gängigen Sprache von seinen Kommentaren, seinen Tests oder seinen anderen Implementierungen abdriftet, und es braucht keinen nachträglichen Diff und keine nachträgliche Fehlerverfolgung. Jede Passung, die das Tor passiert, wird gespeichert und wiederverwendet, sodass das Ökosystem mit seinem Wachstum kumulativ zulegt ([§2.4](#24-gated-verified-recursive-self-improvement)). Code, der in anderen Sprachen geschrieben ist, ist ein Eingang: Er tritt durch Hebung ein ([§6](#6-lift-entering-the-ecosystem-from-other-languages)).

Jeder Punkt des Raums steht vor demselben Tor. Das Tor ist Korrektheit: das Vollständigkeitsprädikat $C(z)$ einer Aufgabe, hier die Tests der Aufgabe, ein Beweis oder eine Übereinstimmungsspur. Unter den Läufen, die das Tor passieren, werden Systeme nach den Joule bis zur Fertigstellung gereiht, $J^*$. Korrektheit ist eine Nebenbedingung, keine Punktzahl.

Mixture of Limits ist die Philosophie: Für jede Aufgabe gibt es eine minimale Menge von allem, und alles darüber hinaus ist Verschwendung ([Gemessene Commit-Tore, Teil II](/papers/gates/#part-ii-the-cascade-mixture-of-limits)). RCE ist eine Instanz von Mixture of Limits. Ihre Gänge laufen vom billigsten an, und der erste Gang, der das Tor passiert, schließt die Aufgabe.

flowG ist ein eigenständiges Sprachprojekt. RCE ist seine akademische Erstdemonstration. Die beiden bleiben getrennte Projekte.

Energieangaben sind nach Quelle gekennzeichnet. `est_j` ist eine analytische Schätzung. `reported_j` ist ein Zähler des Betriebssystems oder des Chips. `measured_j` ist einem Wandmessgerät vorbehalten und in jedem Ergebnis hier leer.

<div id="2-two-paths-to-autonomy" class="anchor-alias" aria-hidden="true"></div>

## 2. Der Entwurfsraum des autonomen Programmierens

![Ein Satz hinein. Ein Boden heraus. Menschliche Absicht hat hohe Entropie; ein Trichter von Umwandlungen von der Absicht zur Spezifikation zu 626 Oberflächensprachen zu einer Zwischendarstellung zu Maschinencode verliert an jeder Grenze Information; aller Code erreicht wenige Maschinenformen; RCE schreibt die Bedeutung einmal in einer kanonischen Form, behandelt jede Oberfläche als Projektion und lässt die billigste korrekte Form gewinnen.](/figures/rce/intent-entropy.svg)

*Abbildung 1. Absichtsentropie und der Maschinenboden. Eine [PNG-Kopie](/figures/rce/intent-entropy.png) ist verfügbar. Quellen: Shannon (1951); Lopes et al. (2017); die Zahl von 626 Sprachen stammt aus David Charlots unveröffentlichter Erhebung der Absenkungspfade; Liste und Methode werden mit den Daten dieses Papiers veröffentlicht, bis dahin ist die Zahl die des Autors. Die Ergebnisse für Python und C sind Verhalten laut Sprachspezifikation; vorzeichenbehafteter Überlauf in C ist undefiniertes Verhalten.*

**Absicht hat hohe Entropie.** „Mach den Checkout schneller“ trägt viele Bedeutungen: kürzere Ladezeit, weniger Schritte, schnellere Kartenfreigabe, ein zwischengespeicherter Warenkorb oder schneller auf einer Geräteklasse. Kontext ist mitgemeint und nie aufgeschrieben. Shannon maß gedrucktes Englisch mit etwa 0.6 bis 1.3 Bit pro Buchstabe [1]. Die Buchstaben sind vorhersagbar. Die Bedeutung ist es nicht.

**Jede Umwandlung verliert Information.** Absicht wird zur Spezifikation, und Kontext geht verloren. Die Spezifikation wird zu einer von Hunderten Oberflächensprachen, und Alternativen und Randfälle gehen verloren. Der Quelltext wird zu einer Zwischendarstellung (IR), und Namen, Stil und die Gründe des Autors gehen verloren. Die IR wird zu Maschinencode, Typen werden zu Größen und Schleifen zu Sprüngen.

**Der Boden hat niedrige Entropie.** Jedes Programm endet als Laden, Speichern, Arithmetik und Sprünge. Das Ziel bietet nur Platz für wenige Formen, also biegt sich Code zu ihnen hin. Konvergenz ist konstruktionsbedingt.

**An Grenzen geht die Bedeutung auseinander.** Dieselbe Zeile liefert an den Rändern verschiedene Antworten. In Python ist `-3 % 2` gleich 1 und `-7 / 2` gleich -3.5. In C ist `-3 % 2` gleich -1, `-7 / 2` gleich -3, und vorzeichenbehafteter Überlauf ist undefiniert. Ein System, das Code an jeder Grenze neu generiert, rät an jeder Grenze.

**Die Achsen, als Größen ausgedrückt.**

| Achse | Ein Ende | Anderes Ende | Wo RCE liegt |
|---|---|---|---|
| Energie pro korrektem Ergebnis | Bei jeder Aufgabe erneut voll bezahlt | Einmal pro neuem Fall bezahlt, danach der Boden des Handlers | Am Boden bei abgedeckten Aufgaben |
| Zur Laufzeit aufgelöste Entropie, und Determinismus | Die volle Verteilung des Prompts, jedes Mal eine frische Stichprobe | Nur der Rest, den keine gespeicherte Passung abdeckt, eine deterministische Ausgabe | Nur der Rest; jede Projektion deterministisch |
| Stärke der Verifikation | Ausgabe nach Durchsicht angenommen | Tests, Abdeckung und ein Beweiszertifikat | Das volle Tor bei jedem Ergebnis |
| Wiederverwendung und Kumulation | Jedes Ergebnis einmal verwendet | Jede angenommene Passung gespeichert und wiederverwendet | Jede Passung, die das Tor passiert, wird gespeichert |
| Abhängigkeit vom Modell | Ein Modell bei jeder Aufgabe | Kein Modell | Ein Modell nur als letzter Gang |

Ansätze unterscheiden sich auf jeder Achse dem Grad nach, und die Achsen wirken zusammen: Wiederverwendung senkt die Energie und die noch aufzulösende Entropie, und starke Verifikation ist das, was Wiederverwendung sicher macht. RCE schreibt die Bedeutung einmal, in einer kanonischen Form. Jede Oberflächensprache ist eine Projektion dieser Form, geprüft auf Übereinstimmung mit ihr. Unter äquivalenten Formen läuft die billigste korrekte.

Abbildung 2 zeichnet die fünf Achsen und ordnet die wichtigsten Klassen von Ansätzen darauf ein.

![Netzdiagramm mit fünf Achsen: Energie pro korrektem Ergebnis, Determinismus, Stärke der Verifikation, Wiederverwendung und Kumulation sowie Unabhängigkeit von Modellen. Fünf Klassen von Ansätzen sind als Polygone gezeichnet. Ein Modell bei jeder Aufgabe liegt auf allen Achsen nahe der Mitte. Eine durch Tests gesicherte Agentenschleife liegt bei der Verifikation höher. Ein Modell mit Retrieval und Caching liegt bei der Wiederverwendung höher. Klassische Synthese und Reparatur liegen hoch bei Determinismus und Modellunabhängigkeit. RCE, mit Sternen markiert, liegt auf allen fünf Achsen am äußeren Ring oder nahe daran. Die Einordnungen sind qualitativ.](/figures/rce/design-space.svg)

*Abbildung 2. Der Entwurfsraum des autonomen Programmierens. Qualitatives Diagramm: Jede Klasse von Ansätzen ist nach der Lesart dieses Papiers zu Abschnitt 2 auf ordinalen Stufen eingeordnet, nicht nach Messung. Die Abhängigkeit vom Modell ist als Unabhängigkeit von Modellen gezeichnet, sodass außen auf jeder Achse besser ist. Eine [PNG-Kopie](/figures/rce/design-space.png) ist verfügbar.*

### 2.1 Programmieren ist Codierungstheorie

Die These dieses Abschnitts stammt von David Charlot: Alles Programmieren ist Codierungstheorie. Ein Programmierer wandelt Absicht entlang eines Gefälles zwischen zwei entropischen Regimen um. Absicht hat hohe Entropie, eine Verteilung über Bedeutungen. Code hat niedrige Entropie, ein deterministischer Übergang pro Zustand. Jeder Schritt der Softwarearbeit, von einer Anforderung bis zu einem Register, ist ein Schritt dieser Umwandlung. Die Literatur hat das seit siebzig Jahren stückweise gesagt, in vielen Sprachen. Dieser Abschnitt fügt die Stücke zu einem Argument zusammen und verortet jeden Gang von RCE darin.

**Das Maß.** Shannon definierte die Entropie einer Quelle und die Kapazität eines Kanals [40] und maß gedrucktes Englisch mit etwa 0.6 bis 1.3 Bit pro Buchstabe [1]. Kolmogorov, der 1965 auf Russisch in *Problemy Peredachi Informatsii* schrieb, gab drei Zugänge zur Informationsmenge an und stellte den algorithmischen an die erste Stelle: Die Information in einem Objekt ist die Länge des kürzesten Programms, das es erzeugt [41]. Solomonoff war als Theorie des induktiven Schließens zum selben Objekt gelangt [42], und Chaitin zeigte, dass die Programmgröße Identitäten gehorcht, die formal mit denen Shannons übereinstimmen [43]. Rissanen machte daraus eine Regel zur Modellwahl, die minimale Beschreibungslänge [44]. Zusammen sagen sie: Ein Programm ist ein Codewort, eine Beschreibung eines Verhaltens, und die kürzeste korrekte ist der Boden. Die Extraktionsregel von RCE, unter äquivalenten Passungen die mit den wenigsten Joule zu behalten (Proposition 3), ist diese Regel mit Joule statt Bit.

**Code liegt im Regime niedriger Entropie, und man hat es gemessen.** Hindle, Barr, Su, Gabel und Devanbu fanden, dass Code „very repetitive, and in fact even more so than natural languages“ ist, mit niedrigerer Kreuzentropie unter denselben n-Gramm-Modellen [35]. Gabel und Su fanden, dass die meisten Zeilen eines Projekts bereits anderswo existieren [34], und Lopes et al. fanden, dass die meisten Dateien auf GitHub Klone sind [33]. Tu, Su und Devanbu fanden, dass Code auch lokal ist: Was in der Nähe geschrieben wurde, sagt voraus, was als Nächstes kommt [46]. Ray und Kollegen fanden, dass fehlerhafte Zeilen weniger natürlich sind, mit höherer Entropie, und dass die Entropie sinkt, wenn der Fehler behoben ist [45]. 2025 nutzten Yang, Kolak, Hellendoorn und Martins die Entropieänderung, die ein Patch bewirkt, um Reparaturkandidaten zu reihen und korrekte Patches von überangepassten zu trennen [51]. Allamanis, Barr, Devanbu und Sutton gaben unter dem Namen Natürlichkeit einen Überblick über das Feld [47]. Das Ergebnis ist kein rein englischsprachiges. Prem Devanbu trug es 2013 als Keynote auf der India Software Engineering Conference vor [50]. Sridhara, Sinha und Mani von IBM Research India maßen am selben Ort die natürlichsprachlichen Artefakte rund um Code und fanden, dass Commit-Nachrichten am regelmäßigsten sind und Prosa auf Stack Overflow sich wie gewöhnliches Englisch verhält [49]. In China veröffentlichte das *Journal of Software* (软件学报) 2022 einen Überblick über die Forschung zur Natürlichkeit von Code, der das Kreuzentropiemaß und den Befund nennt, dass fehlerhafter Code höhere Entropie hat [48]. In Japan nutzten Doi, Higo, Arima, Shimonaka und Kusumoto von der Universität Osaka n-Gramm-Natürlichkeit, zuerst in einem japanischsprachigen technischen Bericht der IEICE und dann auf der ICPC 2018, um maschinell erzeugte Quelldateien von menschlich geschriebenen zu unterscheiden [73, 74]. Generierter Code liegt auf der Entropieskala noch tiefer als menschlicher Code, weil ein Generator eine feste Umwandlung ist. In Brasilien baute Arrebolas Dissertation Codevorschläge auf n-Gramm- und Themenmodellen, segmentiert nach Projekt und Maintainer, und bewertete sie über die Kreuzentropie, die Bits, die zur Codierung des nächsten Tokens nötig sind [75]. Die beiden Regime sind in einem einzigen Repository sichtbar: Die Prosa rund um den Code hat hohe Entropie, der Code niedrige.

**Das Maß ist entscheidend.** Febres, Jaffé und Gershenson verglichen von Venezuela und Mexiko aus englische, spanische und Programmtexte nach Vokabularvielfalt pro Nachrichtenlänge und fanden den Programmtext vielfältiger [76]. Rahman, Palani und Rigby fanden, dass ein großer Teil der n-Gramm-Vorhersagbarkeit von Code von Syntax-Tokens stammt und dass Code nach deren Entfernung immer noch repetitiv ist, weniger als zuerst berichtet, wobei die API-Nutzung der repetitivste Teil ist [77]. Beide Ergebnisse schärfen die Aussage, statt sie umzukehren. Vielfalt der Symbole ist nicht Vorhersagbarkeit, und das Regime niedriger Entropie ist eine Eigenschaft der bedingten Verteilung des nächsten Schritts, genau das, was ein deterministischer Übergang festlegt. Aus diesem Grund setzt G0 von RCE an Formen an, nicht an Oberflächen-Tokens.

**Absicht liegt im Regime hoher Entropie.** Zave und Jackson zeigten, dass eine Anforderung eine Aussage über die Umgebung ist, eine Spezifikation eine Aussage an der Schnittstelle, und dass die Lücke zwischen beiden nur durch Domänenwissen gefüllt wird, das oft nicht aufgeschrieben ist [64]. Brooks teilte die Schwierigkeit von Software in Essenz und Akzidenz: Die Essenz ist das begriffliche Konstrukt, und das meiste davon ist Spezifikation und Entwurf, nicht Darstellung [61]. Naur argumentierte, dass ein Programm der sichtbare Teil einer Theorie ist, die seine Programmierer besitzen, und dass diese Theorie aus dem Text nicht vollständig rückgewinnbar ist [62]. Durch Shannon gelesen sagen alle drei dasselbe. Absicht trägt mehr Unsicherheit als jedes einzelne Programm, und das Schreiben des Programms ist der Akt, der sie beseitigt. Was nach dem Schreiben des Codes im Kopf eines Programmierers bleibt, ist der Teil der Absicht, den der Code nicht codiert hat.

**Die Umwandlung ist eine Verfeinerung, und Verfeinerung ist eine Einengung.** Hoare gab Programmen eine Logik, in der ein Programm relativ zu einer Vor- und Nachbedingung korrekt ist [54]. Wirth lehrte schrittweise Verfeinerung: eine Aufgabe durch aufeinanderfolgende Entscheidungen in Anweisungen zerlegen, wobei jede eine Wahl festlegt, die die Spezifikation offen ließ [53]. Dijkstras bewachte Befehle machten die offenen Wahlen als Nichtdeterminismus explizit und leiteten Programme aus Spezifikationen ab, indem sie ihn beseitigten [52]. In München baute das CIP-Projekt von Bauer und Wössner Programmentwicklung als Folge korrektheitserhaltender Transformationen von der Spezifikation zum Programm [58]. In Frankreich trugen Abrials B-Methode und danach Event-B die Verfeinerung in den industriellen Maßstab, mit Beweisverpflichtungen bei jedem Schritt [55, 56]. In Finnland gaben Back und von Wright der Verfeinerung ihren verbandstheoretischen Kalkül [57]. In jedem Fall bezeichnet eine Spezifikation eine Menge zulässiger Verhaltensweisen, und jeder Verfeinerungsschritt verkleinert die Menge, bis ein deterministisches Verhalten übrig bleibt. Das ist Entropiereduktion mit einem Beweis bei jedem Schritt. Die Form von RCE ist das letzte Glied dieser Kette: ein totaler, deterministischer Übergang $\delta$ über Datenbankzustände, bei dem jede Wahl aufgelöst ist ([§3.2](#32-definitions)).

**Synthese ist Suche, die einen Hypothesenraum einengt.** Gulwanis FlashFill lernt ein Zeichenkettenprogramm aus wenigen Ein- und Ausgabebeispielen, indem es die Menge aller konsistenten Programme darstellt und sie mit jedem neuen Beispiel schneidet [59]. Gulwani, Polozov und Singh fassen Programmsynthese allgemein als Suche in einem Programmraum, der durch Absicht beschränkt ist [60], und Solar-Lezamas Sketching füllt Lücken in einem Teilprogramm mit einem Löser [27]. Jedes Beispiel und jede Nebenbedingung ist eine Messung, die Hypothesen entfernt. Shannons Maß zählt, wie viele solcher Messungen nötig sind. G2 von RCE ist dieser Gang.

**Was die Umwandlung erzeugt, hat eine Form.** Gurevich bewies, dass jeder sequentielle Algorithmus von einer Abstract State Machine auf seiner eigenen Abstraktionsebene erfasst wird [2]. Codd machte den Zustand zu einer Relation [5], und Event Sourcing macht den Zustand zur Faltung eines nur anhängbaren Logs [14]. Nach Curry und Howard ist ein Beweis ein Programm und eine Aussage ein Typ [18, 72], also ist eine verifizierte Passung ein Beweis ihrer Spezifikation. Das sind die Gründe, warum das Regime niedriger Entropie wenige Formen hat: Das Ziel ist eine Zustandsmaschine über einer Datenbank, gleich welche Oberflächensprache.

**Niedrige Entropie zerfällt ohne Tor.** Lehman beobachtete über Jahrzehnte großer Systeme, dass ein genutztes Programm sich ständig ändern muss und dass seine Komplexität wächst, sofern keine Arbeit zu ihrer Verringerung geleistet wird [63]. Torres, Baltes, Treude und Wagner maßen strukturelle und textuelle Entropie über die Commit-Historien von 25 Projekten und fanden, dass beide gemeinsam steigen [78]. Entropie fließt aus der Umgebung in den Code zurück. Ein System, das Code im Regime niedriger Entropie halten will, braucht ein Tor an jeder Änderung, und das Tor von RCE ist Korrektheit ([§4.3](#43-the-gate)).

**Compiler betreiben bereits Quellencodierung.** Franz und Kistler lieferten Programme als komprimierte abstrakte Syntaxbäume aus und erzeugten beim Laden nativen Code, was Quellencodierung eines Programms über seiner eigenen Grammatik ist [67]. Fraser leitete aus einem Korpus statistische Modelle von Code ab, um ihn zu komprimieren [68]. Futamura zeigte 1971 in der japanischen Zeitschrift *Systems, Computers, Controls*, dass die Spezialisierung eines Interpreters auf ein Programm ein kompiliertes Programm ergibt und die Spezialisierung des Spezialisierers einen Compiler [70]. Ershov entwickelte in Nowosibirsk dieselbe Idee als gemischte Berechnung [71]. Die abstrakte Interpretation der Cousots berechnet eine korrekte Beschreibung mit weniger Information für jedes Verhalten eines Programms [69]. Die Analogie zur Kanalcodierung ist die Lesart dieses Papiers, kein zitierter Satz: Typen, Tests und Beweise fügen geprüfte Redundanz hinzu, sodass ein falsches Programm erkannt wird, bevor es läuft, so wie eine Paritätsprüfung ein verfälschtes Wort erkennt.

**Beim Löschen fallen die Joule an.** Landauer zeigte, dass ein logisch irreversibler Schritt, das Löschen eines Bits, mindestens $k_B T \ln 2$ dissipiert [65]. Bennett zeigte, dass Berechnung grundsätzlich logisch reversibel gemacht werden kann, sodass das Löschen, nicht die Berechnung, die Schranke trägt [66]. Die Umwandlung hochentropischer Absicht in ein niedrigentropisches Programm verwirft jede Alternative, die die Absicht zuließ. Dieses Verwerfen ist ein Löschen von Information über die Alternativen, und es hat einen thermodynamischen Boden. Das [Papier zur Handlungsfähigkeit](/papers/agency/#1-thesis) bepreist jedes bestätigte Bit gegen diesen Boden. RCE bezahlt das Verwerfen einmal pro neuem Fall und speichert das Ergebnis, sodass ein wiederholter Fall nichts Neues löscht.

### 2.2 Wie RCE umwandelt und wo jeder Gang sitzt

Als Codierungstheorie gelesen trifft eine Aufgabe als Nachricht ein, deren verbleibende Unsicherheit das ist, was keine gespeicherte Passung bereits auflöst. Jeder Gang entfernt Unsicherheit zu einem anderen Preis, und die Gänge sind nach diesem Preis geordnet ([§4.2](#42-the-gears)).

| Gang | Was er mit der Unsicherheit macht | Herkunft im obigen Argument |
|---|---|---|
| G0 Nachschlagen | Erkennt, dass die Absicht bereits codiert wurde; löst sie durch Abruf auf, am Boden des Handlers | Repetitivität und Klone [33, 34, 35]; Lokalität [46] |
| G1 Regeln | Wendet eine bekannte bewachte Umschreibung an; löst einen wiederkehrenden Rest ohne Suche | Korrektheitserhaltende Transformation [52, 58]; Verfeinerung mit Beweisverpflichtungen [55, 56] |
| G2 Synthese | Durchsucht einen Hypothesenraum und engt ihn durch Beispiele, Nebenbedingungen und einen Löser ein | Programmsynthese als Suche [27, 59, 60] |
| G3 bis G5 Modelle | Zieht aus einer gelernten Verteilung über Code, wenn kein niedrigerer Gang die Lücke schließt; nur als Vorschlagender | Kreuzentropiemodelle von Code [35, 47] |
| Tor | Nimmt einen Kandidaten nur mit Tests, Abdeckung und einem Beweiszertifikat an | Hoare-Logik [54]; Curry-Howard [18, 72] |
| Beförderung | Speichert die angenommene Passung, sodass derselbe Rest beim nächsten Mal G0 kostet | Minimale Beschreibungslänge [44]; Landauer-Löschung einmal bezahlt [65] |

Positionen auf den Achsen von Abschnitt 2 unterscheiden sich darin, wo die Umwandlung bezahlt wird. Ein Ansatz, der bei jeder Aufgabe aus der vollen Verteilung des Prompts zieht, bezahlt jedes Mal erneut die hochentropische Seite. Ein Ansatz, der angenommene Passungen speichert und wiederverwendet, bezahlt nur den Rest, und nur einmal. Die meisten Systeme liegen zwischen diesen Enden, und RCE liegt am Ende der Wiederverwendung. Die ökonomische Lesart dieses Unterschieds steht in [Der versprochene Billionen-Dollar-Markt für KI-Programmierung, Abschnitt 4](/papers/ai-coding-market/#4-the-theory-that-prices-the-task). Die Abbruchregel hinter der Gangreihenfolge ist [Mixture of Limits](/papers/gates/#part-ii-the-cascade-mixture-of-limits), und der Abbruch pro Aufgabe ist [Aufgabensättigung](/papers/satiation/).

### 2.3 Das Ökosystem bei großem N

Die Aussage von [§1](#1-thesis) wird direkt gemessen. Der Benchmark wurde vor dem Lauf präregistriert ([`bench/ecosystem/PREREG.json`](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ecosystem/)). Ein Generator mit Seed schreibt 10,000 Formen, jede bestehend aus einer Quelle, einer Regel, deren Rumpf ein zufälliger arithmetischer Term der Tiefe bis 3 über acht Operatoren ist, und einer Senke. Die Engine ist bei Commit `a079967` eingefroren, und kein Modell wird aufgerufen.

| Eigenschaft | Was pro Form geprüft wird | N | Gilt | Modellaufrufe |
|---|---|---|---|---|
| Verlustfreie Codierung | Form IR zu kanonischem JSON zu Form IR zu kanonischem JSON ist die Identität | 10,000 | 10,000 | 0 |
| Deterministische Projektion | Zwei Kompilierungen ergeben dieselben Bytes; die XState- und SCXML-Projektionen der ursprünglichen und der hin und zurück übersetzten Form sind Byte für Byte gleich | 10,000 | 10,000 | 0 |
| Getreue Projektion, Python | Das erzeugte Python-Modul gibt die Referenzspur auf 40 Ereignissen mit Seed Byte für Byte aus | 10,000 | 9,999 | 0 |
| Tor am Eingang, Eingaben | Fünf Arten fehlerhafter Nutzdaten (falscher Typ, null, fehlendes Feld, leer, verschachtelt) werden alle abgewiesen, ohne angenommenes Ergebnis | 10,000 | 10,000 | 0 |
| Tor am Eingang, Spezifikationen | Eine Spezifikation mit einem Fluss zu einem nicht deklarierten Knoten wird vor dem Kompilieren abgewiesen | 10,000 | 10,000 | 0 |

Abbildung 3 zeigt dieselben Zählungen.

![Horizontales Balkendiagramm von fünf Prüfungen auf 10,000 Formen. Verlustfreie Codierung, deterministische Projektion, Tor am Eingang bei fehlerhaften Eingaben und Tor am Eingang bei Spezifikationen gelten jeweils bei 10,000 von 10,000. Das Nachspielen der Python-Spur gilt bei 9,999 von 10,000. Null Modellaufrufe.](/figures/rce/ecosystem-checks.svg)

*Abbildung 3. Das Ökosystem bei großem N. Datenabbildung: die fünf Prüfungen der Tabelle oben auf 10,000 präregistrierten Formen, Engine eingefroren bei Commit `a079967`, 0 Modellaufrufe, mit Wilson-95%-Intervallen, berechnet aus den Zählungen. Quelle: [`bench/ecosystem`](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ecosystem/). Eine [PNG-Kopie](/figures/rce/ecosystem-checks.png) ist verfügbar.*

Der eine Python-Fehlschlag wird als Fehlschlag gezählt; dieselbe Form und dieselben Ereignisse spielen sich im Regressionstest `tests/form_ecosystem_regress.rs` unter 32 Hash-Seeds identisch ab. Die Energie ist hier nur `est_j`; der ganze Lauf brauchte 393 s CPU-Zeit auf einem Kern. Die erzeugten Formen sind klein, daher misst diese Tabelle die Codierung, die Projektionen und das Tor. Gehobene Formen aus realen Programmen werden nach dem Protokoll von [§8.7](#87-lift-coverage-across-languages) gemessen.

### 2.4 Rekursive Selbstverbesserung, durch ein Tor gesichert und verifiziert

Good (1965) [111] definierte die ultraintelligente Maschine als eine, die bessere Maschinen entwerfen kann, sodass sich die Verbesserung rekursiv fortsetzt. Yudkowsky (2013) [113] fasste die Frage als eine der Erträge: ob jede Einheit Verbesserung die nächste Einheit billiger oder teurer macht. Schmidhubers Gödel-Maschine (2007) [112] gab die erste formale Antwort mit einer Garantie: Ein Programm schreibt jeden Teil seiner selbst um, einschließlich seiner eigenen Suche, erst nachdem es bewiesen hat, dass die Umschreibung seinen erwarteten Nutzen erhöht. Löbs Theorem (1955) [114] ist das Hindernis, auf das ein sich selbst vertrauender Beweiser stößt, und Yudkowsky und Herreshoff (2013) [115] nannten es das Löbsche Hindernis: Ein System kann im Allgemeinen die Korrektheit eines Nachfolgers, der sein eigenes Beweissystem verwendet, nicht beweisen. Neuere Systeme lassen die Beweisforderung fallen und wählen nach gemessener Punktzahl aus: STOP (Zelikman et al., 2023) [116] verbessert das Gerüst, das Code verbessert, die Darwin Gödel Machine (Zhang et al., 2025) [117] führt ein Archiv selbstveränderter Programmieragenten, ausgewählt nach Benchmarkpunktzahl, AlphaEvolve (Novikov et al., 2025) [118] entwickelt Programme unter automatischen Bewertern weiter, und Voyager (Wang et al., 2023) [119] lässt eine Bibliothek verifizierter Fähigkeiten wachsen, die spätere Aufgaben wiederverwenden.

RCE übernimmt die Struktur der Gödel-Maschine und die Bibliothek von Voyager, mit zwei Unterschieden, die das Hindernis beseitigen. Erstens ist das Objekt, das sich verbessert, nicht der Beweiser. RCE befördert Handler, Umschreibungen und Gänge, und jedes davon wird gegen einen festen, gesondert zertifizierten Kern geprüft: Die Kani-Harnesses und die SMT-Kodierung ändern sich durch Beförderung nie, sodass kein Schritt dem Beweissystem eines Nachfolgers vertrauen muss. Zweitens ist das Tor ein Korrektheitsbeweis an der Grenze, keine Punktzahl. Eine Punktzahl kann steigen, während eine Schnittstellenannahme bricht; ein Beweis an der Grenze kann von einer Änderung, die sie bricht, nicht passiert werden.

**Proposition R1 (monotone Korrektheit).** Wenn jede beförderte Änderung die Prüfung ihrer Grenze besteht und die Prüfungen der anderen Grenzen unverändert sind, dann gilt jede Eigenschaft, die diese Prüfungen vor der Beförderung festgestellt haben, auch nach ihr.

**Proposition R2 (Kumulation).** Eine Arbeitslast sei eine Multimenge von Aufgaben, und ein beförderter Handler schließe jede Aufgabe seiner Gestalt. Dann ist die Zahl der Eskalationen in Runde t in t nicht steigend, und eine vor Runde 1 beförderte Korrektur senkt die kumulierten Eskalationen jedes Horizonts um die Eskalationen, die sie in jeder späteren Runde schließt. In der Referenzarbeitslast des Playgrounds fallen die kumulierten Eskalationen über acht Runden mit einer Korrektur an den Senken von 21 auf 15 und erreichen in beiden Fällen in der letzten Runde null, wobei jede Aufgabe korrekt geschlossen und keine Beförderung abgelehnt wird.

Abbildung 4 zeichnet den Mechanismus der Propositionen R1 und R2 mit den Summen der Referenzarbeitslast.

![Diagramm des RCE-Stapels in sechs Ebenen, von der Absicht oben über Form, Tor, Projektionen und Laufzeit bis zu Hardware und Energie. Eine Korrektur, die auf der Laufzeitebene nach bestandener Grenzprüfung befördert wird, ist mit Pfeilen dargestellt, die durch jede Ebene darüber aufsteigen. Ein kleines Balkendiagramm daneben gibt die kumulierten Eskalationen über acht Runden der Referenzarbeitslast des Playgrounds an: 21 ohne Korrektur und 15 mit einer Korrektur an den Senken.](/figures/rce/stack-compounding.svg)

*Abbildung 4. Korrekturen kumulieren nach oben. Diagramm des Stapels mit einem Dateneinschub: kumulierte Eskalationen über acht Runden der Referenzarbeitslast des Playgrounds, 21 ohne Korrektur und 15 mit einer Korrektur an den Senken (Proposition R2; [RCE Playground](/playground/rce/#compounding)). Eine [PNG-Kopie](/figures/rce/stack-compounding.png) ist verfügbar.*

**Proposition R3 (fallende Kosten).** Da ein beförderter Handler anstelle eines Modellaufrufs ausgeführt wird und seine Kosten die Operationszahl des Handlers sind, bepreist mit der Substrattabelle, fällt die Energie einer Runde gegen die Energie der Handler allein, während die Eskalationen gegen null fallen.

Futamuras Projektionen (1971, neu veröffentlicht 1999) [120] und Turchins Superkompilation (1986) [121] geben den Grenzwert dieses Prozesses an. Einen Interpreter auf ein Programm zu spezialisieren ergibt ein kompiliertes Programm; den Spezialisierer zu spezialisieren ergibt einen Compiler. Die Beförderungen von RCE spezialisieren den allgemeinen Eskalationspfad auf die Gestalten, die tatsächlich vorkommen, sodass die Engine gegen das Restprogramm ihrer Arbeitslast konvergiert: den Teil der Berechnung, den ein Modell oder ein Mensch noch liefern muss. Rekursive Selbstverbesserung unter einem Tor ist diese Konvergenz, vollzogen in geprüften Schritten. Die Compounding-Ebene des [RCE Playground](/playground/rce/#compounding) führt diese Arbeitslast im Browser aus.

## 3. Die Form

### 3.1 Die stärkste formale Aussage über „dieselbe Form“

Zuerst wird der Geltungsbereich des Satzes genannt. Gurevichs sequentielle Postulate decken sequentielle Algorithmen ab; parallele und interaktive Algorithmen brauchen die weiteren Postulate von Blass und Gurevich [3]. Blass, Dershowitz und Gurevich argumentieren, dass keine einzelne Äquivalenzrelation auf Algorithmen jedem Zweck genügt [79], und Moschovakis und Vardi legen die Debatte darüber dar, was ein Algorithmus ist [80, 81]. Ein Web-Handler, der Ein- und Ausgabe ausführt, liegt außerhalb des sequentiellen Satzes. Die Form behandelt Interaktion so wie die interaktive Linie: Jede Eingabe ist ein Ereignis in $E$, und die Zustandsmaschine macht darauf einen Schritt. „Eine Form“ ist also eine Modellierungsentscheidung, die im sequentiellen Satz gründet und per Konvention erweitert ist, mit Vorbildern in der Produktion in der Elm-Architektur [83], in Ereignishistorien dauerhafter Workflows [84] und in Stromsemantiken wie Flo [82]. Die Propositionen von Abschnitt 3.4 sind für diese Entscheidung formuliert.

Gurevichs Satz über Abstract State Machines (ASM) ist die stärkste formale Aussage, dass jeder Algorithmus eine Form hat [2]. Eine abstrakte Zustandsmaschine ist eine Maschine, deren Zustände Strukturen erster Stufe sind und deren Schritt eine endliche Menge bewachter Aktualisierungen ist. Gurevich stellt drei Postulate auf. Sequentielle Zeit: Ein Algorithmus hat Zustände, Anfangszustände und eine Ein-Schritt-Abbildung $\tau$. Abstrakter Zustand: Zustände sind Strukturen erster Stufe über einem festen Vokabular, abgeschlossen unter Isomorphie. Beschränkte Erkundung: Eine endliche Menge von Termen entscheidet jeden Schritt. Sein Hauptsatz (Theorem 6.13) lautet: „For every sequential algorithm A, there exists an equivalent sequential abstract state machine B.“ Blass und Gurevich erweitern ihn auf parallele Algorithmen [3]. Dershowitz und Gurevich fügen ein viertes Axiom hinzu, dass die Anfangsoperationen berechenbar sind, und leiten daraus die Church-These ab [4].

### 3.2 Definitionen

**Definition 1 (die Form).** Ein Programm ist ein Tupel

$$P = (S, E, \delta, D, \lambda)$$

- $S$, der Zustandsraum: Strukturen über einem festen Vokabular $\Sigma$. Jeder Zustand ist eine Datenbankinstanz im Sinne Codds [5].
- $E$, das Ereignisalphabet, einschließlich des Takts der logischen Uhr.
- $\delta : S \times E \to S$, der Übergang: total, deterministisch und rein, geschrieben als endliche Menge bewachter Aktualisierungen „if $\varphi$ then $f(\bar t) := t_0$“, wobei jeder Schritt eine beschränkte Menge von Orten liest.
- $D = (s_0, L)$, der dauerhafte Speicher: ein Anfangszustand und ein nur anhängbares Ereignislog $L = e_1, \dots, e_n$.
- $\lambda : S \times E \to O$, die Ausgabeabbildung. Ein Mealy-Automat liest beide Argumente [6]; ein Moore-Automat liest nur den Zustand [7].

**Definition 2 (Form und Passung).** Die *Form* ist die Tupelgestalt mit vier Invarianten: $\delta$ ist deterministisch und rein; die Erkundung ist beschränkt; das Vokabular ist fest; der Zustand ist die Faltung des Logs,

$$\mathrm{state}(D) = \mathrm{foldl}(\delta, s_0, L).$$

Die *Passung* sind die Daten, die die Gestalt ausfüllen: das Vokabular $\Sigma$, die Alphabete $E$ und $O$, das Regelprogramm $\Pi$, das $\delta$ definiert, die Ausgaberegeln, die $\lambda$ definieren, und die Anfangsdaten $s_0$. In Gurevichs Begriffen ist die Passung das Vokabular, das ASM-Programm und die Anfangsstrukturen. In Codds Begriffen ist $\Sigma$ das Schema und $s_0$ die Instanz. In Begriffen der Produktlinien ist eine Passung eine Merkmalsauswahl [8]. In Begriffen der syntaxgesteuerten Synthese (SyGuS) ist eine Passung ein Term aus einer Grammatik, der eine Spezifikation erfüllt [9].

**Definition 3 (Äquivalenz von Passungen).** Zwei Passungen sind äquivalent, wenn für jedes Log $L$ ihre Ausgabefolgen unter $\lambda$ gleich sind.

**Definition 4 (Passungssprache).** Eine Grammatik, deren Terme Passungen bezeichnen. Programmiersprachen, SCXML-Dokumente, XState-Konfigurationen und `.rce`-Spezifikationen sind Passungssprachen. Eine Passungssprache ist vollständig, wenn jedes ASM-Programm über $\Sigma$ einen Term in ihr hat.

**Definition 5 (Kontrollprojektion).** Man teile $\Sigma = \Sigma_c \cup \Sigma_d$ in endliche Kontrollsymbole und Datenrelationen. Das Statechart von $P$ ist die Projektion von $\delta$ auf $\Sigma_c$: Zustände sind Werte von $\Sigma_c$, Übergänge tragen ein Ereignis und einen Wächter über $\Sigma_d$, und Aktionen sind Aktualisierungen von $\Sigma_d$. Harels Statecharts liefern die Hierarchie und die orthogonalen Regionen [10].

**Definition 6 (Passungs-E-Graph).** Für eine Passung $F$ und eine Menge $R$ korrekter Umschreibungen ist der Passungs-E-Graph $EG(F, R)$ der saturierte E-Graph der Regelterme von $F$ unter $R$ [11, 12]. Jede E-Klasse enthält Passungen, die nach Definition 3 äquivalent sind.

**Definition 7 (Joule-Kosten).** $\mathrm{cost}_J(t)$ ist die geschätzte Energie (`est_j`), um den Term $t$ einmal auf einem benannten Substrat auszuführen, gewichtet mit der erwarteten Zahl von Läufen.

### 3.3 Warum „funktionale Datenbank-Zustandsmaschine“

Eine endliche relationale Struktur ist eine Datenbankinstanz, also ist ein Gurevich-Zustand eine Datenbank und jeder Schritt eine beschränkte Transaktion. *Datenbank*: $S$ ist eine relationale Struktur. *Funktional*: $\delta$ und $\lambda$ sind rein. *Zustandsmaschine*: Läufe sind Faltungen von $\delta$ über Ereignisse. Moseley und Marks ziehen dieselbe Linie in der Architektur [13]. Event Sourcing zieht sie im Anwendungszustand: „Capture all changes to an application state as a sequence of events“ [14]. Dedalus zieht sie in der Logik, wo veränderlicher Zustand eine nach Zeit indizierte Relation ist [15].

### 3.4 Propositionen

**Proposition 1 (die Form erfasst jeden sequentiellen Algorithmus).** Zu jedem sequentiellen Algorithmus $A$ gibt es eine Form-Instanz $P$, deren Läufe die Läufe von $A$ sind.

*Beweisskizze.* Theorem 6.13 liefert eine ASM $B$ mit den Zuständen, Anfangszuständen und der Ein-Schritt-Abbildung von $A$. Setze $E = \{\varepsilon\}$, $\delta(s, \varepsilon) = \tau_B(s)$, $D = (s_0, \varepsilon^n)$ und $\lambda$ die Identität. Die Faltung nach $n$ Takten ist $\tau_A^n(s_0)$. Nach Gurevichs Korollar 3.3 haben $P$ und $A$ dieselben Läufe. ∎

**Proposition 1b (interaktive Programme).** Erweitere $\Sigma$ um ein nullstelliges Eingabesymbol, das vor jedem Schritt auf $e$ gesetzt wird; dann ist $\delta(s, e) = \tau(s[\mathit{in} := e])$ ein sequentieller Algorithmus über dem erweiterten Vokabular, und Proposition 1 gilt. Die Konstruktion ist unsere.

**Proposition 1c (Berechenbarkeit).** Unter dem Axiom von Dershowitz und Gurevich berechnet jede Form-Instanz eine Turing-berechenbare Funktion [4, 16, 17]. Die Form fügt keine Mächtigkeit hinzu. Sie gibt jedem Programm der Klasse eine Form.

**Proposition 1d (Beweise sind Passungen).** „For each proof of a given proposition, there is a program of the corresponding type“ [18]. Ein Typ ist eine Spezifikation, und ein Beweis ist eine Passung, die sie erfüllt. Das Korrektheitstor ist die Existenz dieses Beweises oder eines bestandenen Abnahmetests.

**Proposition 2 (ein Generator).** Eine Funktion $G : \mathrm{Fit} \to \mathrm{Program}$ erzeugt für jede Passung ein lauffähiges Programm und liest keine Domäne. *Grundlage:* Jedes Programm ist eine Form-Instanz, also gibt $G$ einen typisierten Speicher, einen Ereignistyp, kompilierte Regeln, ein Log mit einer Faltung und einen Ausgabeverteiler aus. Gerüstgeneratoren wie die Generatoren von Rails, JHipster und Yeoman sind $G$, eingeschränkt auf kleine Passungssprachen. Produktlinienentwicklung beginnt mit „the systematic discovery and exploitation of commonality across related software systems“ [8]; die Gemeinsamkeit ist die Form.

**Proposition 3 (Mixture of Limits als Extraktion).** Extraktion mit $\mathrm{cost}_J$ liefert den Term mit den wenigsten Joule, den der Extraktor in der E-Klasse von $F$ findet. *Beweisskizze.* Die Umschreibungen sind korrekt, also hat jeder Term der E-Klasse das beobachtbare Verhalten von $F$ und passiert dasselbe Tor. Die Extraktion minimiert die Kosten, und die Kosten sind Joule. ∎ Das ist Mixture of Limits, angewandt auf Code: Behalte die minimale Passung, die die Aufgabe erledigt, der Rest ist Verschwendung.

**Proposition 4 (Determinismus der Wiedergabe).** Wenn $\delta$ keine Wanduhr liest, Aktualisierungen ohne Namen ordnet und jede Eingabe protokolliert, ergeben zwei Wiedergaben desselben $D$ bei jedem Schritt identische Zustandshashes.

**Proposition 5 (die Statechart-Projektion ist korrekt).** Projiziere jeden Zustand eines Laufs auf $\Sigma_c$. Das Ergebnis ist ein Lauf des ausgegebenen Statecharts unter denselben Ereignissen.

**Proposition 6 (Koordinationsbudget).** Als monoton markierte Regeln laufen auf Replikaten ohne Koordination; nur nichtmonotone Regeln brauchen einen Koordinationspunkt. *Grundlage:* der CALM-Satz, „the programs that have consistent, coordination-free distributed implementations are exactly the programs that can be expressed in monotonic logic“ [19].

**Proposition 7 (Intelligenz als Joule-Ableitung).** $X$ zähle die Aufgaben durch das Tor und $J$ die aufgewendeten Joule. $\iota = dX/dJ$ wird im Nachhinein aus $D$ abgelesen, das jedes Ereignis und sein `est_j` aufzeichnet. Extraktion unter $\mathrm{cost}_J$ hält das Tor fest und erhöht $J$ nicht, also senkt sie bei gleichem $X$ nicht $\iota$ ([Handlungsfähigkeit, Abschnitt 2.3](/papers/agency/#23-layer-3-calculus-intelligence-as-a-derivative-read-in-hindsight)).

### 3.5 Graph, E-Graph und Statechart

| Struktur | Teil der Form | Was sie entscheidet |
|---|---|---|
| Statechart | Wächter von $\delta$ über $\Sigma_c$ | Welcher Übergang feuert |
| Datenflussgraph | Lese- und Schreibabhängigkeiten von $\delta$ und $\lambda$ (Kahn-Prozessnetze [20]) | Was läuft, und in welcher Reihenfolge |
| E-Graph | Die Äquivalenzklasse der Passung | Welche äquivalente Passung läuft |

Das Statechart und der Graph beschreiben eine Passung. Der E-Graph beschreibt jede dazu äquivalente Passung. Die Extraktion wählt unter ihnen nach Joule.

### 3.6 Ein Ökosystem, verlustfrei, und die Universalitätsthese

**Verlustfrei durch Konstruktion.** Shannons Quellencodierungstheorem legt den Boden eines verlustfreien Codes bei der Entropie der Quelle fest [40]. Eine Form ist ein verlustfreier Code für Absicht in einem engen, prüfbaren Sinn: Die kanonische Serialisierung der Form ist injektiv, sodass zwei Formen, die sich in irgendeinem Zustand, Ereignis oder Übergang unterscheiden, verschiedene Gestalthashes haben, und das Decodieren der Serialisierung liefert dieselbe Form zurück. Jede Projektion auf ein Ziel ist eine Funktion allein der Form. Bidirektionale Transformationen machen die Rundreise präzise. Foster, Greenwald, Moore, Pierce und Schmitt definieren eine Linse als Paar von get- und put-Funktionen mit Rundreisebedingungen, die eine Sicht und ihre Quelle in Übereinstimmung halten [122], Hofmann, Pierce und Wagner erweitern die Bedingungen auf symmetrische Linsen [123], und Czarnecki und Kollegen geben einen Überblick über dieselben Konsistenzbedingungen in Modelltechnik, Datenbanken und Programmiersprachen [124]. Die Rundreisebedingung von RCE ist die GetPut-Bedingung auf der Ebene des ganzen Programms: Hebt man eine Projektion zurück, bleibt der Gestalthash unverändert.

**Korrekt durch Konstruktion.** Dijkstra schlug 1968 vor, ein Programm und seinen Beweis gemeinsam zu entwickeln, sodass Korrektheit hineinkonstruiert statt durch Tests nachgewiesen wird [125]. Hall und Chapman übertrugen den Ansatz auf ein kommerzielles sicheres System mit formaler Spezifikation und Verfeinerung in jedem Schritt [126]. Minskys Regel für typisierte funktionale Programmierung, unzulässige Zustände nicht darstellbar zu machen, sagt dasselbe auf der Typebene: Ein Typ, der keinen schlechten Wert aufnehmen kann, erübrigt die Prüfung darauf [127]. Turners totale funktionale Programmierung verlangt, dass jede Funktion auf jeder Eingabe terminiert, sodass ein Programm eine mathematische Funktion ohne verborgenes Versagen bezeichnet [128]. Die Form von RCE ist total im Sinne Turners, ihre Vertragstypen machen nicht deklarierte Zustände im Sinne Minskys nicht darstellbar, und die Verfeinerungskette aus [§2.1](#21-programming-is-coding-theory) endet in ihr im Sinne Dijkstras. Die Folge ist die in [§1](#1-thesis) genannte: Ein Fehler wird am Eingang abgewiesen, sodass hinterher nichts zu diffen oder zu verfolgen bleibt.

**Die Universalitätsthese.** Die These stammt von David Charlot: RCE, und jede auf dem RCE-Rahmenwerk gebaute Sprache (flowG ist die erste), ersetzt den Bedarf an jeder anderen Sprache. Theoretisch formuliert gibt es eine universelle Form. Programme werden nativ in ihr geschrieben, jede bestehende Sprache ist von ihr aus als getreue Projektion erreichbar, und jedes bestehende Programm tritt durch Hebung in sie ein. Gurevichs These liefert die Grundlage: Jeder sequentielle Algorithmus wird Schritt für Schritt von einer abstrakten Zustandsmaschine auf seiner eigenen Abstraktionsebene erfasst [2], und parallele Algorithmen ebenso [3]. Eine Form ist eine solche Maschine über einem Datenbankzustand.

**Proposition U1 (Erfassung).** Ist ein Programm in der Sprache $L$ ein sequentieller oder paralleler Algorithmus im Sinne Gurevichs, dann gibt es eine Form, deren Übergang es auf der Abstraktionsebene des Programms Schritt für Schritt simuliert [2, 3].

**Proposition U2 (getreue Projektion).** Erhält die Projektion $\pi_L$ einer Form auf $L$ die Spur der Form auf jeder Eingabe im Vertrag, dann sind die Form und ihre Projektion für jeden Beobachter der Spur austauschbar, und $L$ fügt nichts hinzu, was der Form fehlt.

**Proposition U3 (Hebung durch Konstruktion).** Jede gebräuchliche Programmiersprache hat eine formale Grammatik, einen Parser, der einen konkreten Syntaxbaum liefert, einen abstrakten Syntaxbaum und eine Semantik, die durch ihre Spezifikation oder Referenzimplementierung festgelegt ist. Eine Hebung $\lambda_L$ wird pro Sprache in drei Stufen gebaut: die Grammatik, dann der abstrakte Syntaxbaum, dann die Form, wobei jedes Konstrukt von $L$ seine Formregel aus der Semantik von $L$ erhält. Eine so gebaute Hebung erfüllt $\pi_L(\lambda_L(p)) \equiv p$ im Verhalten und $\lambda_L(\pi_L(F)) = F$ im Gestalthash, sodass das Paar eine Linse im Sinne von [122] ist und ein Programm in $L$ ohne Verlust als Form gehalten wird.

**Proposition U4 (Ersetzung).** Gelten U2 und U3 für die Sprache $L$, dann muss kein Programm in $L$ geschrieben werden: Es wird einmal als Form geschrieben und als $L$ ausgegeben, wo eine Plattform es verlangt.

U1 ist ein Theorem. U2 wird pro Ziel durch differentielles Testen geprüft ([§5.1](#51-differential-testing-across-five-targets)) und bei großem N in [§2.3](#23-the-ecosystem-at-large-n). U3 ist eine Konstruktion, Sprache für Sprache von der Grammatik aufwärts gebaut, und [§8.7](#87-lift-coverage-across-languages) legt fest, wie die Konstruktion während des Baus gemessen wird. Aussagen zur Verbreitung stehen im [Begleitessay](/papers/ai-coding-market/).

## 4. Die Engine: Gänge, Tor und Belege

### 4.1 Die Engine ist eine Form

RCE führt Software als Graph kleiner deterministischer Handler aus. Ein Handler, der nicht entscheiden kann, löst eine Eskalation aus. Ein Auflöser beantwortet die Eskalation einmal, und die Antwort wird als dauerhafter Handler installiert, sodass der nächste Fall derselben Gestalt ohne Auflöser läuft. Die Engine erfüllt jede Invariante der Form, jede geprüft durch einen benannten Test in `tests/form_laws.rs`:

| Invariante | Was die Engine tut |
|---|---|
| Neuladen ist eine verifizierte Faltung | Das Neuladen liest das Log wörtlich, berechnet jeden Hash und jede Verkettung neu und faltet den Rest mit $\delta$. Nichts wird neu gestempelt. Eine gebrochene Kette verweigert das Laden. |
| Namensfreie Taktreihenfolge | Handler laufen in topologischer Rangfolge, dann nach einem namensfreien Knotenschlüssel. Ausgaben werden zwischengespeichert und nach dem Lauf aller Handler zugestellt, wie in der ASM-Semantik. Das Umbenennen jedes Knotens ergibt bei jedem Eintrag denselben anonymen Zustandshash. |
| Kein stilles Verwerfen | Ein volles Postfach hält die Nachricht in einer geordneten Warteschlange und protokolliert `Backpressure`. Bei Kapazität 1 und 10 Aufgaben werden 9 `Backpressure`-Einträge protokolliert, und alle 10 Aufgaben werden geschlossen. |
| Nutzdaten stehen im Log | Eingaben, Takte, Ergebnisse externer Handler, Installationen und Fehler sind Logeinträge. Der Zustandshash nach jedem Eintrag stimmt mit einer Faltung aus einer leeren Engine überein, auf 1,000 zufälligen Logs. |
| Logische Uhr | Lebendigkeit zählt Takte, nicht Wandzeit. |
| Stabile Hashes | SHA-256 (Secure Hash Algorithm, 256 Bit) über kanonisches JSON, Schlüssel auf jeder Tiefe sortiert, für Einträge, Zustände, Gestalten und Regel-IDs. |

### 4.2 Die Gänge

Jeder Gang wird nur versucht, wenn der Gang darunter das Tor nicht passiert. Diese Reihenfolge ist eine feste Kaskade, und die feste Kaskade ist eine Instanz von Mixture of Limits.

| Gang | Methode | Herkunft |
|---|---|---|
| G0 Nachschlagen | Eine gemeinsame Handler-Bibliothek, indiziert nach SHA-256-Gestalthash; für Codereparatur Lokalisierung auf gereihte Funktionen | Codesuche und Abruf [21] |
| G1 Regeln | Deterministische, bewachte Reparaturvorlagen und aus Schemata abgeleitete Validatoren, jeweils auf Mutationsempfindlichkeit geprüft | PAR, TBar, AVATAR, FixMiner [22, 23, 24, 25]; Codemods wie Coccinelle [26] |
| G2 Synthese | Aufzählung über der Handler-Grammatik, Löser und E-Graphen | Sketching, SyGuS, egg [27, 9, 12] |
| G3 bis G5 Modelle | Ein typisiertes Entscheidungsmodell, ein lokales kleines Modell, dann ein entferntes Modell, zuletzt | Modellkaskaden [28] |

### 4.3 Das Tor

Ein Kandidat wird nur befördert, wenn er das Tor passiert. Das Tor spielt die aufgezeichneten Eingaben des Knotens erneut ab, führt den Kandidaten im Schatten auf frischen Stichproben mit einer Abdeckungsschranke aus (die Dreierregel bei einem erklärten Fehlerbudget), prüft das Ausgabeschema und verlangt das Beweiszertifikat aus Abschnitt 5. Ein abgelehnter Kandidat wird mit seinem Gegenbeispiel protokolliert.

### 4.4 Belege

Jede Beförderung, Ablehnung, Zurückstellung und Installation ist eine Mutation in einem nur anhängbaren, mit SHA-256 verketteten Log, sodass jede Manipulation eines vergangenen Eintrags die Kette bricht [29, 30]. Die Kosten jedes Handlers werden aus den Operationszählungen des Interpreters mit der Host-Kostentabelle von FGIR, dem Backend für nativen Code von flowG, bepreist und als `est_j` gekennzeichnet. Jeder Aufruf des Vorarbeiters trägt seinen Beleg. Die Leiterläufe fügen auf einer Teilstichprobe einen Energiezähler des Prozessorpakets hinzu, gekennzeichnet als `reported_j`.

### 4.5 Der Form-Compiler

`rce form` nimmt eine Spezifikation und ihre Passung und gibt aus einer Form-IR fünf Ziele aus:

```
.rce spec + fit
  lower ─► normalize ─► egg e-graph, equality saturation (+ admitted proposals)
  ─► extract (cost = est_j) ─► Form IR (typed relations, regions, rules with SHA-256 ids)
     ├─ Rust crate (pure step, typed state, SHA-256 log and fold, tests)
     │  └─ WASM (the same crate on wasm32-wasip1)
     ├─ Python (standard library only)
     ├─ XState v5 machine
     └─ SCXML document, executed by SCION
```

Die IR legt an jedem numerischen Rand ein Verhalten fest: geprüfter 64-Bit-Ganzzahlüberlauf ist ein Fehler und läuft nie um; ganzzahliges `/` schneidet gegen null ab ($-7/2 = -3$); `%` übernimmt das Vorzeichen des Dividenden ($-3 \bmod 2 = -1$); Division durch null ist ein Fehler; Gleitkommazahlen sind IEEE 754 binary64, und ein nicht endliches Ergebnis ist ein Fehler; null und abwesend sind verschieden; Zeit ist nur die logische Uhr. Jedes Ziel wird generiert. Keines wird von Hand geschrieben.

Ein Prozess-, HTTP- oder Closure-Handler hat keinen Term, also werden seine protokollierten Ergebnisse zu einem aufgezeichneten Orakel kompiliert, indiziert nach dem SHA-256 der kanonischen Eingabe. `rce scan DIR --form` hebt vorhandenes Rust, Python, TypeScript und Go in das Schema der Form, und jedes gehobene Element wird als syntaktische Hebung gekennzeichnet.

### 4.6 Methode: der ganze Stapel bewertet, jede Schnittstellenannahme ausdrücklich

Ein Programm ist ein Stapel von Ebenen: Tokens und Anweisungen; Handler; die Form, eine einzige Schrittfunktion δ über einem Datenbankzustand aus typisierten Relationen, Kontrollregionen und einer Uhr; das Log, das jedes Ereignis mit dem Hash des erzeugten Zustands aufzeichnet; die Umschreibungen, die die Form umformen; und das Substrat, das sie ausführt. Jede Ebene ruht auf Annahmen über die Ebene darunter. RCE behandelt keine Ebene als fest. Es bewertet den ganzen Stapel, schreibt jede Schnittstellenannahme als prüfbare Aussage nieder und prüft sie bei jedem Lauf.

| Grenze | Annahme | Prüfung |
|---|---|---|
| Quelle zu Handler | eine Eingabe erfüllt ihren Quellvertrag | die Vertragsprüfung beim Eingabeereignis von δ |
| Handler zu Senke | jede Ok-Ausgabe erfüllt das Ausgabeschema | Handlerbeweis (verify::handler_proof), total und deterministisch durch den mit Kani geprüften Kernauswerter |
| Log zu Zustand | jeder Eintrag trägt den Hash des Zustands, den er erzeugt hat | Kernfaltung, die den ersten Eintrag mit nicht passendem Hash ablehnt (Kani-Harness `fold_rejects_wrong_state`) |
| Umschreibung zu Form | eine Umschreibung erhält die Ausgabe für jede Eingabe | randomisierte Prüfung, dann ein SMT-Beweis mit Z3 |
| Stub zu Vorarbeiter | ein Handler, der nicht entscheiden kann, eskaliert, statt zu raten | Stub-Handler geben Eskalationen aus; Auflösungen werden nur über den Beförderungspfad befördert |
| Form zu Ziel | jedes erzeugte Ziel berechnet dasselbe δ | jedes Ziel trägt dieselbe Referenzspur |

Eine fehlgeschlagene Prüfung verortet den Bruch an der Grenze, an der er auftritt. Die Korrektur wird auf dieser Ebene vorgenommen, durch die Prüfung dieser Grenze geführt und befördert. Jede Ebene über der korrigierten erbt die Korrektur ohne weitere Änderung, weil jede höhere Ebene die korrigierte Ebene nur über die Schnittstelle nutzt, deren Annahme nun geprüft wird. In diesem Sinn wandern Korrekturen nach oben und kumulieren sich. Der [RCE Playground](/playground/rce/) führt dies im Browser auf dem nach WebAssembly kompilierten RCE-Kern aus: Seine Interfaces-Ebene bricht jede Annahme und zeigt die Prüfung, die den Bruch erkennt, und seine Compounding-Ebene zeigt, wie die Korrektur in jede spätere Runde übergeht.

## 5. Verifikation

<div id="51-five-targets-one-trace" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Differentielles Testen über fünf Ziele

`tests/form_targets.rs` treibt eine arithmetische Spezifikation mit elf Operatoren mit 29 Randereignissen plus 500 geseedeten zufälligen Randwerten. Die generierten Ziele Rust, Python, WASM, XState und SCXML geben die Referenzspur Byte für Byte aus, einschließlich der arithmetischen Ränder. Das ist differentielles Testen in der Linie von McKeeman und von Csmith [86]: Übereinstimmung unabhängiger Implementierungen auf einer angegebenen Eingabemenge. Es ist keine Übersetzungsvalidierung [85] und kein verifizierter Compiler. Es deckt die elf Operatoren und die 529 Ereignisse des Tests ab und sagt nichts über Eingaben außerhalb davon. Die Ergebnisse mit Z3 und Kani unten sind die Verifikation.

Abbildung 5 zeigt die fünf Projektionen einer Form und die Rundreise der beiden Statechart-Ziele.

![Diagramm: Eine Form aus Zustand, Ereignissen und einem reinen, totalen Übergang wird durch deterministische Kompilierung auf fünf Ziele projiziert: Rust, Python, WASM, XState und SCXML. Durchgezogene Pfeile führen von der Form zu jedem Ziel. Gestrichelte Pfeile führen von XState und SCXML zurück zur Form und zeigen die Rundreise zu byteidentischen Bytes und demselben Gestalt-Hash. Rust, Python und WASM spielen die Referenzspur Byte für Byte nach.](/figures/rce/form-projections.svg)

*Abbildung 5. Eine Form, viele Projektionen. Diagramm: deterministische Projektion auf fünf Ziele ([§4.5](#45-the-form-compiler)); die XState- und SCXML-Projektionen decodieren zurück zu byteidentischen Bytes ([§2.3](#23-the-ecosystem-at-large-n)); alle fünf Ziele geben die Referenzspur Byte für Byte auf den 529 Ereignissen von `tests/form_targets.rs` aus. Eine [PNG-Kopie](/figures/rce/form-projections.png) ist verfügbar.*

### 5.2 In Z3 bewiesene Umschreibungen

Verifizierte Umschreibregeln haben eine Herkunft. Ruler leitet Umschreibregeln durch Gleichheitssaturierung ab und prüft sie, ohne Modell in der Schleife [87]. Die 3 von 16 modellvorgeschlagenen Regeln, die in Abschnitt 5.5 zugelassen werden, sind daher eine Aussage über das Tor, das 13 ablehnte, und keine Behauptung, dass ein Modell die beste Regelquelle sei.

Jede eingebaute E-Graph-Umschreibung ist im SMT-Löser Z3 (satisfiability modulo theories) [31] gegen eine quantorenfreie Codierung der Termauswertung und Arithmetik der Form bewiesen: Werte als Datentyp, 64-Bit-Bitvektoren mit geprüftem Überlauf, vorzeichenbehaftete Division und Rest mit dem Vorzeichen des Dividenden, und binary64-Gleitkommazahlen. Eine Umschreibung, die Überlauf, Eskalationsreihenfolge oder eine Nachricht ändert, erhält keinen Beweis. Eine vorgeschlagene Äquivalenz gelangt nur mit einem Beweis in den E-Graphen.

### 5.3 Kani-Beweise des Kerns

Der Kern der Engine (Hashkette, Faltung, namensfreie Positionen und Handler-Auswertung) wird mit dem Model Checker Kani für Rust geprüft [32]. Die Handler-Auswertung ist der Fixpunkt eines nicht rekursiven Schritts, und Kani beweist diesen Schritt pro Konstruktor als total und deterministisch, durch strukturelle Induktion. Zehn Harnesses sind verifiziert, mit 0 von 505 fehlgeschlagenen Prüfungen:

| Harness | Eigenschaft |
|---|---|
| `chain_appended_verifies` | Eine angehängte Hashkette verifiziert |
| `chain_detects_tampering` | Ein geänderter Eintrag bricht die Kette |
| `fold_equals_replay` | Die Faltung gleicht der Wiedergabe |
| `fold_rejects_wrong_state` | Eine Faltung, die dem gespeicherten Zustand widerspricht, wird abgelehnt |
| `position_is_name_independent` | Regelpositionen hängen nicht von Knotennamen ab |
| `reason_tokens_are_name_independent` | Begründungen sind über ganze Tokens namensfrei |
| `handler_core_leaves` | Blatt-Handler sind total und deterministisch |
| `handler_core_validate` | Validierung ist total und deterministisch |
| `handler_core_pipeline` | Pipelines sind total und deterministisch |
| `handler_core_ifhas` | Wächter sind total und deterministisch |

### 5.4 Beförderungstor am Beweiszertifikat

Der Kani-Lauf schreibt ein Zertifikat, dessen Hash in `proofs/kani.cert` gespeichert wird. Die Engine, das Log, die Regel-IDs und die Handler-Auswertung laufen über den bewiesenen Kern, und die Beförderung verlangt das Zertifikat.

### 5.5 Das Modell als Vorschlagender hinter der Prüfung

Ein Modell darf Äquivalenzen vorschlagen. Es darf sie nicht zulassen. Mit einem lokalen Codemodell mit 1.5 Milliarden Parametern (Qwen2.5-Coder-1.5B unter llama.cpp) auf der Demonstrationsspezifikation bot der Vorschlagende 16 Äquivalenzen an. Die Prüfung ließ 3 zu, durch randomisierte Versuche und einen Z3-Beweis, und lehnte 13 ab. Ein deterministischer Vorschlagender mit 87 vertrauten Identitäten bekam 9 zugelassen, alle strukturell, und jede arithmetische Identität wurde wegen Fehlerreihenfolge, Nicht-Zahlen oder Überlauf abgelehnt.

### 5.6 Übereinstimmung im Bestand

Die Hebung liest dieselbe Bestellmaschine aus Fixtures in Rust, Python, TypeScript und Go, führt den Originalcode auf 40 geseedeten Folgen von 30 Aufrufen aus und stimmt bei allen 1,200 Aufrufen pro Sprache überein. Ein eingefrorener Benchmark, präregistriert vor jedem Ergebnis, drückte drei vorhandene Programme für Vertriebsansprache als Formen neu aus. Die Formen stimmen mit dem Originalcode auf 4,500 von 4,500 aufgezeichneten Eingaben überein, und die Extraktion senkt `est_j` bei jedem (zum Beispiel $1.69 \times 10^{-8}$ J auf $1.49 \times 10^{-8}$ J).

## 6. Hebung: Eintritt in das Ökosystem aus anderen Sprachen

<div id="6-importing-legacy-code-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

Die Hebung ist der Eingang in das Ökosystem für Code, der anderswo geschrieben wurde. Sie ist eine Konstruktion, pro Sprache aus Werkzeugen gebaut, die jede Sprache bereits hat: einer formalen Grammatik, einem Parser wie [tree-sitter](https://tree-sitter.github.io/tree-sitter/), der den Syntaxbaum liefert, dem abstrakten Syntaxbaum und den Symbolen, die Sprachserver-Werkzeuge auflösen ([Language Server Protocol](https://microsoft.github.io/language-server-protocol/)). `rce scan DIR --form` baut die Form aus diesem Baum für Rust, Python, TypeScript und Go ([§4.5](#45-the-form-compiler), [§5.6](#56-brownfield-agreement)). Ein gehobenes Programm trägt die Fehler seiner Quelle, daher schließt die Hebung Reparatur ein, unten gemessen auf öffentlichen Fehlerkorpora mit gegebenem Ort. Innerhalb des Ökosystems können diese Fehler nicht geschrieben werden.

### 6.0 Die Reparaturleiter auf gehobenem Code

<div id="23-per-rung-ladder-results" class="anchor-alias" aria-hidden="true"></div>

Eine Programmieraufgabe wird hier an den **Absichtsbits** gemessen, die sie braucht: den Bits, die von außerhalb dessen geliefert werden müssen, was die Engine bereits hält (das Programm um die Änderung, die Bibliotheken, die Tests, der Index bekannter Korrekturen). Schreibt man $H_{task}$ für die Bits, die das Zielartefakt festlegen, und $H_{corpus}$ für die Bits, die der Korpus bereits festlegt, so sind die gelieferten Bits $I = H_{task} - H_{corpus}$. Ein Gang, der die richtige Änderung auf Rang $r$ unter seinen Kandidaten setzt, hat $\log_2 r$ Bit Suche geliefert, und das Tor liefert den Rest. Die Leiter ordnet Aufgaben nach Änderungsgröße, einem objektiven Stellvertreter für $I$: ein Token (L0), eine Anweisung (L1), ein Hunk (L2), mehrere Hunks in einer Datei (L3), mehrere Dateien (L4), eine Funktion aus einer Spezifikation oder Tests (L5), eine Änderung auf Issue-Ebene (L6) und ein Programm aus einer Spezifikation (L7). Sprossen, Korpora, Aufteilungen und Hypothesen wurden vor den vollen Läufen präregistriert; die Dateien liegen im [öffentlichen Repository](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

| Sprosse | Zurückgehaltener Testkorpus | N | Gelöst | Rate | Wilson 95% KI | Median Suchbits | Modellaufrufe |
|---|---|---|---|---|---|---|---|
| L0 ein Token | Mutanten im PIT-Stil [109] von 9 realen Repositories an festgelegten Commits (Java: commons-math, commons-collections, jsoup, joda-time, gson; Python: click, attrs, pydantic, sympy) | 520,821 | 520,541 | 0.9995 | 0.9994 bis 0.9995 | 2.3 | 0 |
| L0 ein Token, nie zum Abstimmen genutzte Repositories | commons-text, commons-io, more-itertools, httpx | 23,015 | 23,015 | 1.0000 | 0.9998 bis 1.0000 | 2.0 | 0 |
| L1 eine Anweisung, Java | ManySStuBs4J 2.0, Korrekturen mit einem Hunk [107] | 24,072 | 9,288 | 0.386 | 0.380 bis 0.392 | 3.5 | 0 |
| L1 eine Anweisung, Java, ganze Datei | ManySStuBs4J 2.0 [107], Datei am Eltern-Commit mit den Methoden- und Wächterindizes des Projekts | 21,320 | 13,586 | 0.637 | 0.631 bis 0.644 | 4.8 | 0 |
| L1 eine Anweisung, Python | TSSB-3M v1.0.0, Shards 14 und 15 [108] | 157,089 | 27,266 | 0.174 | 0.172 bis 0.175 | 4.8 | 0 |

Abbildung 6 trägt die Zeilen der Tabelle mit ihren Intervallen auf.

![Balkendiagramm der Lösungsraten auf zurückgehaltenem Code mit Wilson-Intervallen von 95 Prozent. L0 ein Token auf neun Repositories: 99.95 Prozent von 520,821. L0 ein Token auf vier nie abgestimmten Repositories: 100 Prozent von 23,015. L1 Java ganze Datei: 63.7 Prozent von 21,320. L1 Java nur Hunk: 38.6 Prozent von 24,072. L1 Python nur Hunk: 17.4 Prozent von 157,089. Null Modellaufrufe.](/figures/rce/lift-ladder.svg)

*Abbildung 6. Die Reparaturleiter auf gehobenem Code. Datenabbildung: zurückgehaltene Testaufteilung, eingefrorene Engine, Ort gegeben, Tor der Token-Identität, 0 Modellaufrufe; Wilson-95%-Intervalle, berechnet aus den Zählungen. Quellen: Mutanten im PIT-Stil [109], ManySStuBs4J 2.0 [107], TSSB-3M v1.0.0 [108]; Zeilen pro Aufgabe in [`bench/ladder`](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/). Eine [PNG-Kopie](/figures/rce/lift-ladder.png) ist verfügbar.*

L2 bis L4 werden auf dem zurückgehaltenen Defects4J-Satz von 288 Fehlern gemessen ([Abschnitt 8.1](#81-defects4j)). L5 bis L7 folgen den Protokollen von [Abschnitt 8.2](#82-swe-bench-lite-offline). Methode, Tor und Energie jeder Zeile folgen.

Die Raten lesen sich als Absichtsbits. Bei L0 liegen die fehlenden Bits fast alle auf der Zeile, und eine nach Priorität geordnete Ein-Token-Nachbarschaft liefert sie im Median mit 2.3 Bit. In der L1-Zeile mit nur dem Hunk sieht die Engine nur den 7-zeiligen Hunk. Sie schließt die Kategorien, deren Bits im Hunk liegen (Java: geänderter Operator 91%, vertauschtes boolesches Literal 84%, vertauschte Argumente 82%; Python: geändertes boolesches Literal 98.8%, vertauschte Argumente 99.4%), und lässt jene offen, deren Bits außerhalb liegen: Methodennamen (22%) und Bezeichner (37%) brauchen die Datei und ihre Typen, und neue Konjunkte (3% bis 7%) sowie Umschreibungen ganzer Anweisungen (Python, 1.2% einer Kategorie, die 34% des Korpus ausmacht) sind neue Absicht. Neue Absicht ist das, was ein Lieferant (eine Spezifikation, ein Test, ein Mensch oder ein lokales Modell) einmal bereitstellt, danach steht die Passung im Index.

**Methode.** Jeder Korpus wird mit einem festen Seed gemischt. Die ersten 2,000 Positionen jeder Mischung, und für L0 drei ganze Repositories (commons-lang, requests, flask), bilden die Entwicklungsaufteilung, auf der die Gänge abgestimmt werden dürfen; Entwicklungsergebnisse werden nicht berichtet. Jede übrige Aufgabe gehört zur Testaufteilung. Vor einem Testlauf wird die Engine committet und ihr Binärhash aufgezeichnet, und während des Laufs ändert sich kein Gang. Jede Zeile dieses Abschnitts ist ein Ergebnis der eingefrorenen Engine nur auf Testaufgaben, mit 0 Modellaufrufen. Die Präregistrierung (`PREREG.json`), die Zeilen pro Aufgabe und das Berichtsskript liegen im [öffentlichen Repository](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

**Tor.** Bei L0 und L1 ist der Ort gegeben, und das Tor ist Token-Identität: Die reparierte Zeile oder Anweisung muss Token für Token der des Entwicklers gleichen. Das ist strenger als das Bestehen der Tests, weil ein Patch eine schwache Testsuite bestehen und trotzdem falsch sein kann. Qi und Kollegen fanden, dass die meisten Patches, die GenProg als Korrekturen meldete, plausibel, aber falsch waren [92]; Überanpassung an Tests ist in suchbasierter und semantikbasierter Reparatur dokumentiert [93, 94] und wird mit generierten Tests angegangen [95]; Werkzeuge schneiden auf dem Benchmark besser ab, auf den sie abgestimmt wurden [96]; und Fehlerlokalisierung verzerrt Vergleiche [97]. Token-Identität beseitigt auf diesen Sprossen die Plausibilitätslücke, und die Angabe des Orts entfernt den Lokalisierungsterm, sodass die Rate allein die Reparaturgänge misst. L2 und darüber verwenden die Tests als Tor und berichten plausible und korrekte Zahlen getrennt (Abschnitt 8.1).

### 6.1 L0: Fehler in einem Token

Der L0-Korpus umfasst jeden Mutanten im PIT-Stil [109] mit einem gültigen Ersatz-Token in neun realen Repositories an festgelegten Commits, fünf in Java und vier in Python: 520,821 Testaufgaben von 547,448. Die Engine (Commit `65571d0`, Gänge G0-T und G1-J) stellt 520,541 wieder her, eine Rate von 0.9995 (95% Wilson-Intervall 0.9994 bis 0.9995) bei einem Median von 2.3 Suchbits. Von den 280 ungelösten sind 108 mutierte Ziffern in Gleitkommaliteralen und 2 liegen in Python-Mengenliteralen. Ein Gang für Gleitkommaliterale (G0-F, Commit `ecfe5a1`) wird auf vier nie zum Abstimmen genutzten Repositories getestet (commons-text, commons-io, more-itertools, httpx): 23,015 von 23,015 Aufgaben, 1.0000 (0.9998 bis 1.0000), ein Median von 2.0 Suchbits. Mutanten stehen stellvertretend für reale Ein-Token-Fehler, die nach Just und Kollegen mit realen Fehlern gekoppelt sind [110].

### 6.2 L1: Fehler in einer Anweisung aus realen Historien

L1 verwendet zwei öffentliche Datensätze realer Korrekturen einzelner Anweisungen, gewonnen aus Open-Source-Historien. ManySStuBs4J 2.0 [107] liefert 24,072 Java-Testaufgaben; die Engine (Commit `f2701b7`) löst 9,288, eine Rate von 0.386 (0.380 bis 0.392). TSSB-3M v1.0.0 [108] liefert 157,089 Python-Testaufgaben aus den Shards 14 und 15; dieselbe Engine löst 27,266, eine Rate von 0.174 (0.172 bis 0.175). Die Engine erhält nur den 7-zeiligen Hunk, also ist diese Java-Rate ein Ergebnis nur mit Hunk. Mit der ganzen Datei am Eltern-Commit, mit Indizes der Methoden und Wächterbedingungen des Projekts und mit den Gängen für geänderte Methodennamen, hinzugefügte Argumente, Wächterbedingungen, throws und Modifikatoren (Commit `62fb7a0`, sha256-Präfix der Binärdatei `3682c6515acdf722`, vor dem Lauf präregistriert), löst die Engine 13,586 der 21,320 Java-Testaufgaben, deren Datei und fehlerhafte Anweisung sich auffinden ließen, eine Rate von 0.637 (0.631 bis 0.644). Nach Kategorie schließt sie geänderte Operatoren (95.9%), geänderte Operanden (92.1%), falsche Aufrufer (87.9%), vertauschte boolesche Literale (88.4%), gelöschte Argumente (85.1%) und vertauschte Argumente (83.3%); geänderte Methodennamen erreichen 61.4% und hinzugefügte Argumente 51.4%, und neue oder verengte Bedingungen (43.5% und 51.7%) bleiben die wichtigste offene Absicht. Die vollständigen Tabellen pro Schicht stehen im Repository. Für diese Datensätze gibt es unter diesem Tor (nur Hunk, Token-Identität, Ort gegeben) keine veröffentlichte Rangliste der Reparatur, daher steht keine Zahl gelernter Reparatur daneben; Defects4J, das eine hat, wird in Abschnitt 8.1 mit TBar verglichen.

### 6.3 Energie

Jede Zeile trägt `est_j`, eine Schätzung aus CPU-Sekunden mal 10 W: 0.40 J pro gelöster Aufgabe bei L0, 0.13 auf den frischen Repositories, 0.10 auf ManySStuBs4J und 0.27 auf TSSB-3M. Eine Teilstichprobe wurde mit RAPL [105] abgelesen, dem Paketzähler auf dem Prozessorchip, auf einem Linux-Laptop mit einem Intel i9-13900H (Hostname `jetson-hub`; kein NVIDIA Jetson). Der Harness lief auf 4 festgelegten CPUs, und `reported_j` ist das Paketdelta über den ganzen Lauf, einschließlich des Python-Treibers, abzüglich der Leerlaufleistung aus einer 10-s-Stichprobe unmittelbar davor, multipliziert mit der Laufdauer. Runner der kontinuierlichen Integration waren aktiv, also lag der Leerlauf bei 40 W bis 44 W, und die Unsicherheit beträgt etwa ±1 W mal die Dauer, ±10 J auf diesen Summen.

| Teilstichprobe (Testaufteilung) | Aufgaben | Gelöst | Roh J | `reported_j` | `reported_j` pro gelöster Aufgabe | Sekunden |
|---|---|---|---|---|---|---|
| L0, gson-Mutanten (geseedet, erste 3,000) | 3,000 | 3,000 | 648.3 | 167.5 | 0.056 | 11.8 |
| L1, ManySStuBs4J Positionen 2,000 bis 3,999 | 2,000 | 690 | 377.2 | 17.9 | 0.026 | 8.2 |

Die L1-Teilstichprobe baut ihren Projektindex nur aus ihren 2,000 Aufgaben, daher liegt ihre Lösungsrate (34.5%) unter der des vollen Laufs. `measured_j`, ein Wandmessgerät an einer benannten Versorgungsschiene, ist in jeder Zeile leer; sein Protokoll ist Abschnitt 8.3.

## 7. Belege für Wiederverwendung

Die Position von RCE auf der Achse der Wiederverwendung ruht auf einer technischen Tatsache: Code wird auf jeder Skala wiederverwendet. Jede der folgenden Methoden misst das anders.

| Methode | Quelle | Befund |
|---|---|---|
| Klonkartierung auf Dateiebene | DéjàVu, Lopes et al. 2017 [33] | Von 428 Millionen Dateien in 4.5 Millionen GitHub-Projekten, die keine Forks sind, sind 85 Millionen eindeutig: „70% of the code on GitHub consists of clones of previously created files.“ In JavaScript sind 6% der Dateien verschieden. |
| Redundanz auf Zeilenebene | Gabel und Su 2010 [34] | Gegenüber 420 Millionen Zeilen ist „between 50% and 100% of each project is redundant“ bei etwa einer Zeile. |
| Statistische Sprachmodelle | Hindle et al. 2012 [35] | Code ist „very repetitive, and in fact even more so than natural languages.“ |
| Beinahe-Deduplizierung von Korpora | The Stack [36] | Beinahe-Deduplizierung entfernt 54.7% von The Stack v1 (6.4 TB auf 2.9 TB) und 52.4% von v2 (67.5 TB auf 32.1 TB). |
| Bewahrung des ganzen Archivs | Software Heritage | Etwa 30 Milliarden Quelldateien aus 445 Millionen Ursprüngen, jede einmal nach dem Hash ihrer Bytes gespeichert. |
| Gewonnene Korrekturmuster | PAR, TBar [22, 23] | PAR fand „several common fix patterns“ in mehr als 60,000 menschlichen Patches. Die 15 Musterkategorien von TBar korrigieren 43 Defects4J-Fehler korrekt in der Standardpipeline und 74 von 101 mit perfekter Fehlerlokalisierung, ohne Lernen. |
| Sprachübergreifende Aufgaben | Rosetta Code | 1,360 Aufgaben, jede ein Konzept, umgesetzt in vielen von 1,009 bekannten Sprachen. |

Jede Zeile ist eine Eingabe der Engine. Klone und Deduplizierung sagen, dass eine Passung meist existiert, das ist G0. Wiederkehrende Korrekturen sagen, dass Anpassung meist ein kleiner Katalog bewachter Umschreibungen ist, das ist G1. Redundanz auf Zeilenebene verkleinert den Suchraum von G2. Das Ökosystem misst das an jeder beförderten Passung (Abschnitt 2.3), und die Reparaturleiter auf gehobenem Code misst es im großen Maßstab auf zurückgehaltenen Aufteilungen (Abschnitt 6). Zwei Vorbehalte schärfen die Lesart. Duplikate blähen Abruf- und Modellwerte auf, sofern sie nicht entfernt werden [104]. Und fehlerhafte Zeilen sind weniger natürlich als korrigierte [45], also ist der Fehler selbst der Fall, den das Nachschlagen am wenigsten vorhersagen kann; die Gestalt der Korrektur, nicht die fehlerhafte Zeile, ist das, woran G0 und G1 ansetzen müssen. Die Linie des Regelabbaus, die das im großen Maßstab leistet, von GenProgs Suche nach dem Muster Erzeugen und Validieren [88] und Prophets gelerntem Korrektheitsmodell [89] bis zu Getafix bei Facebook [90] und Soralds modellfreier Reparatur von Verstößen der statischen Analyse [91], leitet Vorlagen aus disjunkter Historie ab und berichtet die Präzision auf ungesehenen Fällen [98]. Das ist der Standard, den Abschnitt 8.4 übernimmt.

## 8. Messprotokolle für das Kommende

Jedes Protokoll ist vor seinem Lauf festgelegt: Präregistrierung committet, Seeds und Commit des Lösers aufgezeichnet, jedes Artefakt aufbewahrt. Zuerst das Tor, dann die Joule, immer die Kennzeichnung.

### 8.1 Defects4J

Defects4J enthält 854 aktive reale Java-Fehler, jeder mit reproduzierenden Tests [37].

1. Entwickeln auf einer Teilmenge von 100 Fehlern, offline, über `defects4j checkout`; nur zurückgehaltene Ergebnisse berichten, auf einer disjunkten Menge von 288 Fehlern, die vor dem Lauf eingefroren wurde (`FROZEN-heldout-v1`).
2. G0, dann G1, dann G2, dann zuletzt ein lokales Modell ausführen. Den Gang aufzeichnen, der jeden Fehler geschlossen hat.
3. Tor: Die auslösenden Tests und die volle Suite bestehen. Plausible und korrekte Zahlen getrennt berichten; korrekt heißt bei Prüfung äquivalent zum Patch des Entwicklers.
4. Modellaufrufe pro korrekter Korrektur und Joule pro korrekter Korrektur berichten, gekennzeichnet.
5. Bezugspunkte: die 43 korrekten Korrekturen von TBar und seine 74 von 101 bei perfekter Lokalisierung.
6. Kontaminationsprüfung: jeden Fehler markieren, dessen Korrektur wörtlich im Index von G0 vorkommt, und mit und ohne markierte Fehler berichten.

### 8.2 SWE-bench Lite, offline

SWE-bench Lite ist eine Teilmenge von 300 Aufgaben aus realen GitHub-Issues, aufgelöst durch verborgene Tests [38].

1. Den offiziellen Docker-Harness ohne Netzwerk verwenden.
2. Erster Lauf: nur G0 und G1, null Modellaufrufe. Das ist der Boden des Lösens ohne Modell.
3. Zweiter Lauf: ein lokales Modell als letzten Gang hinzufügen.
4. Auflösungsrate, Modellaufrufe pro aufgelöster Aufgabe und Joule pro aufgelöster Aufgabe berichten, gekennzeichnet.
5. Kontaminationsprüfung wie in 8.1. SWE-Bench+ fand, dass 32.67% der erfolgreichen Patches die Lösung im Issue-Text hatten [39].

### 8.3 Ein Wandmessgerät

1. Ein Wandmessgerät oder ein Shunt-Messgerät an der Versorgung des Hosts anbringen, protokolliert mit angegebener Rate und mit einer Uhr, die mit dem Laufprotokoll synchronisiert ist.
2. Ruhende Maschine: CI-Runner und andere Builds gestoppt, und vor jedem Block ein Tor für ein ruhiges Zeitfenster geprüft und aufgezeichnet.
3. Eine gemessene Leerlaufbasis abziehen und die Methode angeben.
4. `measured_j` allein aus dem Messgerät füllen. `reported_j` (RAPL) und `est_j` daneben in getrennten Spalten berichten. Nie über Kennzeichnungen hinweg summieren.
5. Die RAPL-Teilstichproben aus Abschnitt 6.3 unter dem Messgerät wiederholen, dann den zurückgehaltenen Defects4J-Satz.

### 8.4 Ein zurückgehaltener Lauf mit eingefrorenen Gängen

Das ist die Methode von Abschnitt 6, erweitert auf neue Korpora.

1. G0, G1 und G2 an einem markierten Commit einfrieren, den Binärhash aufzeichnen und den Regelsatz mit seinen Erstellungszeitstempeln veröffentlichen.
2. Eine disjunkte zurückgehaltene Scheibe ziehen: die Rust- und Python-Instanzen von Multi-SWE-bench [102] und BugsInPy [103], dedupliziert gegen den Index von G0 [104].
3. Scheibe, Seeds und Hypothesen vor dem ersten Lauf präregistrieren.
4. Aufgelöste, plausible und byteidentische Zahlen getrennt berichten, jeweils mit einem 95%-Intervall.

### 8.5 Vergleichswerte in derselben Tabelle

1. Modellfrei: `cargo fix` und clippy [106], sowie Sorald oder eine Portierung von TBar [91].
2. Billiges Modell: Agentless mit einem lokalen Modell [99].
3. Entferntes Modell: ein Agent mit einem Frontier-Modell, seine Energie aus Angaben des Anbieters geschätzt und als `est_j` gekennzeichnet.
4. Cost-of-pass [101] in Joule und in Dollar für jede Zeile berichten, mit Kostenkontrolle, wie Kapoor und Kollegen sie verlangen [100].

### 8.6 Konvergenz der Modellaufrufe bei großem N

Beförderung ist der Mechanismus, durch den das Modell die Schleife verlässt: Ein Auflöser wird einmal für einen neuen Fall bezahlt, das Tor lässt die Passung als Handler zu, und jeder spätere Fall derselben Gestalt schließt in G0 oder G1 ([Abschnitt 4.2](#42-the-gears)). Konvergenz ist die Behauptung, dass die Modellaufrufe pro Runde auf einer festen Spezifikation unter Live-Verkehr auf null fallen. Sie wird wie folgt gemessen.

1. Mindestens 1,000 Spezifikationen aus öffentlichen Repositories ziehen, geschichtet nach Sprache und Größe, und Engine und Auflöser vor der ersten Runde einfrieren.
2. Aufgezeichneten Produktionsverkehr wiedergeben, mindestens 10,000 Ereignisse pro Spezifikation, in Runden fester Größe.
3. Pro Runde aufzeichnen: neue Eskalationen, Modellaufrufe, Beförderungen, Zurückstellungen und Joule pro geschlossener Aufgabe, jeweils gekennzeichnet (`est_j`, `reported_j`, `measured_j`).
4. Primärer Endpunkt: der Anteil der Spezifikationen, die innerhalb von 20 Runden eine Runde mit null Modellaufrufen erreichen, mit einem 95%-Wilson-Intervall. Sekundär: Modellaufrufe pro geschlossener Aufgabe nach Runde und die Runde des letzten Modellaufrufs.
5. Spezifikationen, die nie konvergieren, mit ihrer Ursache berichten (eine festsitzende Eingabe, eine fehlende Abhängigkeit, neue Absicht), und die Zurückstellung festsitzender Eingaben als präregistrierten Arm ausführen.

**Proposition 8 (Annäherung an den Boden).** Mit wachsender Abdeckung von G0 und G1 nähern sich die Joule pro gelöster Aufgabe dem Goldboden: eine bekannte Korrektur anwenden und die Tests ausführen. Die Sprossen der Leiter und der zurückgehaltene Defects4J-Satz unter dem Wandmessgerät prüfen das.

### 8.7 Abdeckung der Hebung über Sprachen hinweg

<div id="87-coverage-of-real-programs-across-languages" class="anchor-alias" aria-hidden="true"></div>

Die Hebung wird gemessen, während sie gebaut wird. Für eine Sprache $L$ gilt ein Programm als gehoben, wenn $\pi_L(\lambda_L(p))$ die eigenen Tests des Programms besteht und seine aufgezeichneten Spuren Byte für Byte nachspielt und $\lambda_L(\pi_L(\lambda_L(p)))$ denselben Gestalthash hat wie $\lambda_L(p)$. Die Stichprobe umfasst mindestens 10,000 Programme pro Sprache für mindestens zehn Sprachen, mit festem Seed aus festgelegten öffentlichen Korpora gezogen, wobei der Heber vor jedem Lauf eingefroren und sein Binärhash aufgezeichnet wird, und 0 Modellaufrufe. Jeder Lauf berichtet den gehobenen Anteil mit einem 95%-Wilson-Intervall, und jedes noch nicht gehobene Konstrukt ist ein Arbeitspunkt für den Heber dieser Sprache, gebaut und eingefroren vor dem nächsten Lauf. Das Ziel ist jedes Programm in jeder Sprache.

## 9. Bezüge zu den Begleitpapieren

**Mixture of Limits.** [Gemessene Commit-Tore, Teil II](/papers/gates/#part-ii-the-cascade-mixture-of-limits) formuliert die Philosophie: Für jede Aufgabe ist eine minimale Menge von allem nötig, und alles darüber hinaus ist Verschwendung. RCE wendet sie dreimal an. Die Gangreihenfolge führt den billigsten ausreichenden Gang zuerst aus. Die Beförderung bezahlt einen Auflöser einmal pro neuem Fall, danach wäre jeder wiederholte Aufruf Verschwendung. Die Extraktion behält unter äquivalenten Passungen die mit den wenigsten Joule (Proposition 3).

**Gemessene Commit-Tore.** [Teil I](/papers/gates/) sagt, dass ein Vorschlag sich nicht selbst autorisieren darf. In RCE schlägt ein Modell vor und das Tor committet: Ein Kandidat gelangt nur mit bestandenen Tests, erfüllter Abdeckungsschranke und einem Beweiszertifikat hinein, und jede Entscheidung ist ein Beleg in der Hashkette.

**Das Universelle Gesetz der Handlungsfähigkeit.** [Das Papier zur Handlungsfähigkeit](/papers/agency/) definiert Intelligenz als die Ableitung der Handlungsfähigkeit nach Joule, $\iota = dX/dJ$, im Nachhinein abgelesen. Das Log von RCE ist diese nachträgliche Aufzeichnung: $X$ sind die Aufgaben durch das Tor und $J$ ihre Joule, gekennzeichnet. Eine Zurückstellung mit Beleg ist die Verweigerungsklausel des Tors.

**Aufgabensättigung.** [Aufgabensättigung versus aggregierter Rebound in der KI-Nachfrage](/papers/satiation/) sagt, dass weitere Synthese für eine Aufgabe nichts mehr einbringt, sobald ihr Vollständigkeitsprädikat wahr ist. RCE ist Sättigung pro Aufgabe innerhalb eines Systems: Sobald ein Handler einen Fall abdeckt, ist weitere Inferenz für diesen Fall null. Die Frage der Gesamtnachfrage gehört zu jenem Papier und zum [ökonomischen Begleittext](/papers/ai-coding-market/).

## 10. Falsifikatoren

Vor den Läufen festgelegt, die sie prüfen.

| ID | Beobachtung | Widerlegt |
|---|---|---|
| RCE-F0 | In einem präregistrierten Lauf von mindestens 10,000 Formen gibt irgendeine Projektion eine Spur aus, die von der Referenzspur der Form abweicht, oder irgendeine fehlerhafte Eingabe wird angenommen | Die Aussage, dass Projektionen getreu sind und das Tor am Eingang abweist |
| RCE-F1 | Auf der zurückgehaltenen Scheibe lösen G0 bis G2 mit eingefrorenen Regeln weniger als 10% der Aufgaben mit 0 Modellaufrufen | Die Behauptung, dass für Reparatur in diesem Maßstab die meisten Passungen bereits existieren |
| RCE-F2 | Byteidentische oder äquivalente Patches machen weniger als die Hälfte der aufgelösten zurückgehaltenen Aufgaben aus | Die Lesart des Tors als mehr als Plausibilität auf den abgedeckten Aufgaben |
| RCE-F3 | Unter dem Wandmessgerät übersteigen die Brutto-Joule pro gelöster Aufgabe des RCE-Lösers die des billigsten Modellvergleichs auf den Aufgaben, die beide lösen | Den Joule-Vorteil von RCE auf abgedeckten Aufgaben |
| RCE-F4 | Im Konvergenzprotokoll von Abschnitt 8.6 erreicht weniger als die Hälfte der Spezifikationen ohne festsitzende Eingabe innerhalb von 20 Runden eine Runde mit null Modellaufrufen | Das Herauskompilieren des Modells aus der Schleife |

## 11. Noch zu erledigende Arbeit

Jeder Punkt hat sein benanntes Protokoll.

1. Hebung, gebaut und gemessen über mindestens zehn Sprachen nach dem Protokoll von Abschnitt 8.7.
2. Der Spezifikationsarm: Spezifikationen im Stil von MBPP und HumanEval, als Formen geschrieben und auf jedes Ziel ausgegeben.
3. Zurückgehaltene Ergebnisse auf L2 bis L4, dem Defects4J-Satz von 288 Fehlern (Abschnitt 8.1), und auf L5 bis L7 (Abschnitt 8.2).
4. Vergleichswerte in einer Tabelle, Cost-of-pass in Joule und Dollar (Abschnitt 8.5).
5. Das erste `measured_j`: ein Wandmessgerät an einem ruhenden Host, mindestens 10 Wiederholungen, brutto und netto nebeneinander (Abschnitt 8.3).
6. Die Erhebung der 626 Sprachen, mit ihrer Methode veröffentlicht (Abbildung 1).
7. Neue zurückgehaltene Korpora bei eingefrorenen Gängen: Multi-SWE-bench und BugsInPy (Abschnitt 8.4).
8. Konvergenz der Modellaufrufe über mindestens 1,000 Spezifikationen (Abschnitt 8.6).

## 12. Fazit

RCE ist ein natives Code-Ökosystem. Ein Programm wird einmal aus der Absicht geschrieben, als Form: eine verlustfreie Codierung von Zustand, Ereignissen und reinen Übergängen, und jede Zielsprache ist eine getreue Projektion davon. Ungültige Zustände können nicht geschrieben werden, und fehlerhafte Eingaben werden am Eingang abgewiesen, sodass ein Programm im Ökosystem nicht von seiner Absicht abdriften kann und keinen nachträglichen Diff und keine nachträgliche Fehlerverfolgung braucht. Jede Passung, die das Tor passiert, wird gespeichert und wiederverwendet, und das Ökosystem wächst kumulativ unter einem Tor, dessen Korrektheit monoton ist. Auf 10,000 präregistrierten Formen mit eingefrorener Engine und 0 Modellaufrufen übersteht jede Form die Rundreise zu identischen Bytes, jede Projektion ist deterministisch, jede fehlerhafte Eingabe und Spezifikation wird am Eingang abgewiesen, und die Python-Projektion spielt die Referenzspur auf 9,999 nach. Code aus anderen Sprachen tritt durch Hebung ein, eine Konstruktion von der Grammatik jeder Sprache über ihren Syntaxbaum zur Form; auf gehobenem Code stellen die Reparaturgänge 99.95% von 520,821 Ein-Token-Fehlern und 63.7% von 21,320 Java-Fehlern mit einer Anweisung wieder her. Eine universelle Form, mit jeder Sprache als Projektion und jedem Programm als Hebung, ist die These, und die Abschnitte 3.6 und 8.7 nennen ihre Propositionen und wie ihre Konstruktion gemessen wird.

## Literatur
