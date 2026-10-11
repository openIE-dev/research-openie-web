
*Version 1.1, 11. Oktober 2026. Daten und Code: [research.openie.dev/data/](/data/#rce). LaTeX-PDF: [/pdfs/latex/rce.pdf](/pdfs/latex/rce.pdf) ([Quelltext](/pdfs/latex/rce.tex)).*

*Eine Form. Viele Füllungen. Das Tor ist Korrektheit, die Rangfolge sind Joule.*

Die ökonomische Lesart dieses Papiers steht in seinem Begleittext, [The Promised Trillion Dollar AI-Coding Market](/papers/ai-coding-market/). Dieses Papier enthält nur die Technik und die Theorie.

## 1. These

Es gibt zwei Wege zur autonomen Computerautomatisierung. Man unterscheidet sie an zwei Größen: an der Energie, die pro korrektem Ergebnis aufgewendet wird, und an der Entropie, die das System zur Laufzeit auflösen muss.

Der erste Weg generiert. Ein großes Sprachmodell (LLM), ein statistisches Textmodell, schreibt jede Änderung aus dem Prompt. Jede Aufgabe bezahlt die Generierung erneut, und jede Ausgabe ist eine frische Stichprobe aus einer Verteilung hoher Entropie.

Der zweite Weg konvergiert. Das meiste dessen, was je programmiert werden wird, haben Menschen bereits programmiert. Ein Programm ist eine funktionale Datenbank-Zustandsmaschine: eine Form, viele Füllungen. Menschliche Absicht hat hohe Entropie. Der Maschinenboden hat niedrige Entropie. Code konvergiert konstruktionsbedingt, also besteht der größte Teil der Arbeit darin, eine vorhandene Füllung abzurufen, sie anzupassen und sie zu beweisen. Die Reality Code Engine (RCE) ist auf dem zweiten Weg gebaut.

Beide Wege stehen vor demselben Tor. Das Tor ist Korrektheit: das Vollständigkeitsprädikat $C(z)$ einer Aufgabe, hier die Tests der Aufgabe, ein Beweis oder eine Übereinstimmungsspur. Unter den Läufen, die das Tor passieren, werden Systeme nach den Joule bis zur Fertigstellung gereiht, $J^*$. Korrektheit ist eine Nebenbedingung, keine Punktzahl.

Mixture of Limits ist die Philosophie: Für jede Aufgabe gibt es eine minimale Menge von allem, und alles darüber hinaus ist Verschwendung ([Metered Commit Gates, Part II](/papers/gates/#part-ii-the-cascade-mixture-of-limits)). RCE ist eine Instanz von Mixture of Limits. Ihre Gänge laufen vom billigsten an, und der erste Gang, der das Tor passiert, schließt die Aufgabe.

flowG ist ein eigenständiges Sprachprojekt. RCE ist seine akademische Erstdemonstration. Die beiden bleiben getrennte Projekte.

Energieangaben sind nach Quelle gekennzeichnet. `est_j` ist eine analytische Schätzung. `reported_j` ist ein Zähler des Betriebssystems oder des Chips. `measured_j` ist einem Wandmessgerät vorbehalten und in jedem Ergebnis hier leer.

## 2. Zwei Wege zur Autonomie

![Ein Satz hinein. Ein Boden heraus. Menschliche Absicht hat hohe Entropie; ein Trichter von Umwandlungen von der Absicht zur Spezifikation zu 626 Oberflächensprachen zu einer Zwischendarstellung zu Maschinencode verliert an jeder Grenze Information; aller Code erreicht wenige Maschinenformen; RCE schreibt die Bedeutung einmal in einer kanonischen Form, behandelt jede Oberfläche als Projektion und lässt die billigste korrekte Form gewinnen.](/figures/rce/intent-entropy.svg)

*Abbildung 1. Absichtsentropie und der Maschinenboden. Eine [PNG-Kopie](/figures/rce/intent-entropy.png) ist verfügbar. Quellen: Shannon (1951); Lopes et al. (2017); die Zahl von 626 Sprachen stammt aus David Charlots unveröffentlichter Erhebung der Absenkungspfade; Liste und Methode werden mit den Daten dieses Papiers veröffentlicht, bis dahin ist die Zahl die des Autors. Die Ergebnisse für Python und C sind Verhalten laut Sprachspezifikation; vorzeichenbehafteter Überlauf in C ist undefiniertes Verhalten.*

**Absicht hat hohe Entropie.** „Mach den Checkout schneller“ trägt viele Bedeutungen: kürzere Ladezeit, weniger Schritte, schnellere Kartenfreigabe, ein zwischengespeicherter Warenkorb oder schneller auf einer Geräteklasse. Kontext ist mitgemeint und nie aufgeschrieben. Shannon maß gedrucktes Englisch mit etwa 0.6 bis 1.3 Bit pro Buchstabe [1]. Die Buchstaben sind vorhersagbar. Die Bedeutung ist es nicht.

**Jede Umwandlung verliert Information.** Absicht wird zur Spezifikation, und Kontext geht verloren. Die Spezifikation wird zu einer von Hunderten Oberflächensprachen, und Alternativen und Randfälle gehen verloren. Der Quelltext wird zu einer Zwischendarstellung (IR), und Namen, Stil und die Gründe des Autors gehen verloren. Die IR wird zu Maschinencode, Typen werden zu Größen und Schleifen zu Sprüngen.

**Der Boden hat niedrige Entropie.** Jedes Programm endet als Laden, Speichern, Arithmetik und Sprünge. Das Ziel bietet nur Platz für wenige Formen, also biegt sich Code zu ihnen hin. Konvergenz ist konstruktionsbedingt.

**An Grenzen geht die Bedeutung auseinander.** Dieselbe Zeile liefert an den Rändern verschiedene Antworten. In Python ist `-3 % 2` gleich 1 und `-7 / 2` gleich -3.5. In C ist `-3 % 2` gleich -1, `-7 / 2` gleich -3, und vorzeichenbehafteter Überlauf ist undefiniert. Ein System, das Code an jeder Grenze neu generiert, rät an jeder Grenze.

**Die zwei Wege, als Größen ausgedrückt.**

| Weg | Was pro Aufgabe läuft | Zur Laufzeit aufgelöste Entropie | Energie pro korrektem Ergebnis |
|---|---|---|---|
| Generieren | Ein Modell zieht eine neue Änderung | Die volle Verteilung des Prompts | Bei jeder Aufgabe erneut bezahlt |
| Konvergieren (RCE) | Nachschlagen, Regel, Löser; ein Modell nur zuletzt | Nur der Rest, den keine gespeicherte Füllung abdeckt | Einmal pro neuem Fall bezahlt; danach der Boden des Handlers |

RCE schreibt die Bedeutung einmal, in einer kanonischen Form. Jede Oberflächensprache ist eine Projektion dieser Form, geprüft auf Übereinstimmung mit ihr. Unter äquivalenten Formen läuft die billigste korrekte.

### 2.1 Programmieren ist Codierungstheorie

Die These dieses Abschnitts stammt von David Charlot: Alles Programmieren ist Codierungstheorie. Ein Programmierer wandelt Absicht zwischen zwei entropischen Regimen um. Absicht hat hohe Entropie, eine Verteilung über Bedeutungen. Code hat niedrige Entropie, ein deterministischer Übergang pro Zustand. Jeder Schritt der Softwarearbeit, von einer Anforderung bis zu einem Register, ist ein Schritt dieser Umwandlung. Die Literatur hat das seit siebzig Jahren stückweise gesagt, in vielen Sprachen. Dieser Abschnitt fügt die Stücke zu einem Argument zusammen und verortet jeden Gang von RCE darin.

**Das Maß.** Shannon definierte die Entropie einer Quelle und die Kapazität eines Kanals [40] und maß gedrucktes Englisch mit etwa 0.6 bis 1.3 Bit pro Buchstabe [1]. Kolmogorov, der 1965 auf Russisch in *Problemy Peredachi Informatsii* schrieb, gab drei Zugänge zur Informationsmenge an und stellte den algorithmischen an die erste Stelle: Die Information in einem Objekt ist die Länge des kürzesten Programms, das es erzeugt [41]. Solomonoff war als Theorie des induktiven Schließens zum selben Objekt gelangt [42], und Chaitin zeigte, dass die Programmgröße Identitäten gehorcht, die formal mit denen Shannons übereinstimmen [43]. Rissanen machte daraus eine Regel zur Modellwahl, die minimale Beschreibungslänge [44]. Zusammen sagen sie: Ein Programm ist ein Codewort, eine Beschreibung eines Verhaltens, und die kürzeste korrekte ist der Boden. Die Extraktionsregel von RCE, unter äquivalenten Füllungen die mit den wenigsten Joule zu behalten (Proposition 3), ist diese Regel mit Joule statt Bit.

**Code liegt im Regime niedriger Entropie, und man hat es gemessen.** Hindle, Barr, Su, Gabel und Devanbu fanden, dass Code „very repetitive, and in fact even more so than natural languages“ ist, mit niedrigerer Kreuzentropie unter denselben n-Gramm-Modellen [35]. Gabel und Su fanden, dass die meisten Zeilen eines Projekts bereits anderswo existieren [34], und Lopes et al. fanden, dass die meisten Dateien auf GitHub Klone sind [33]. Tu, Su und Devanbu fanden, dass Code auch lokal ist: Was in der Nähe geschrieben wurde, sagt voraus, was als Nächstes kommt [46]. Ray und Kollegen fanden, dass fehlerhafte Zeilen weniger natürlich sind, mit höherer Entropie, und dass die Entropie sinkt, wenn der Fehler behoben ist [45]. 2025 nutzten Yang, Kolak, Hellendoorn und Martins die Entropieänderung, die ein Patch bewirkt, um Reparaturkandidaten zu reihen und korrekte Patches von überangepassten zu trennen [51]. Allamanis, Barr, Devanbu und Sutton gaben unter dem Namen Natürlichkeit einen Überblick über das Feld [47]. Das Ergebnis ist kein rein englischsprachiges. Prem Devanbu trug es 2013 als Keynote auf der India Software Engineering Conference vor [50]. Sridhara, Sinha und Mani von IBM Research India maßen am selben Ort die natürlichsprachlichen Artefakte rund um Code und fanden, dass Commit-Nachrichten am regelmäßigsten sind und Prosa auf Stack Overflow sich wie gewöhnliches Englisch verhält [49]. In China veröffentlichte das *Journal of Software* (软件学报) 2022 einen Überblick über die Forschung zur Natürlichkeit von Code, der das Kreuzentropiemaß und den Befund nennt, dass fehlerhafter Code höhere Entropie hat [48]. In Japan nutzten Doi, Higo, Arima, Shimonaka und Kusumoto von der Universität Osaka n-Gramm-Natürlichkeit, zuerst in einem japanischsprachigen technischen Bericht der IEICE und dann auf der ICPC 2018, um maschinell erzeugte Quelldateien von menschlich geschriebenen zu unterscheiden [73, 74]. Generierter Code liegt auf der Entropieskala noch tiefer als menschlicher Code, weil ein Generator eine feste Umwandlung ist. In Brasilien baute Arrebolas Dissertation Codevorschläge auf n-Gramm- und Themenmodellen, segmentiert nach Projekt und Maintainer, und bewertete sie über die Kreuzentropie, die Bits, die zur Codierung des nächsten Tokens nötig sind [75]. Die beiden Regime sind in einem einzigen Repository sichtbar: Die Prosa rund um den Code hat hohe Entropie, der Code niedrige.

**Das Maß ist entscheidend.** Febres, Jaffé und Gershenson verglichen von Venezuela und Mexiko aus englische, spanische und Programmtexte nach Vokabularvielfalt pro Nachrichtenlänge und fanden den Programmtext vielfältiger [76]. Rahman, Palani und Rigby fanden, dass ein großer Teil der n-Gramm-Vorhersagbarkeit von Code von Syntax-Tokens stammt und dass Code nach deren Entfernung immer noch repetitiv ist, weniger als zuerst berichtet, wobei die API-Nutzung der repetitivste Teil ist [77]. Beide Ergebnisse schärfen die Aussage, statt sie umzukehren. Vielfalt der Symbole ist nicht Vorhersagbarkeit, und das Regime niedriger Entropie ist eine Eigenschaft der bedingten Verteilung des nächsten Schritts, genau das, was ein deterministischer Übergang festlegt. Aus diesem Grund setzt G0 von RCE an Formen an, nicht an Oberflächen-Tokens.

**Absicht liegt im Regime hoher Entropie.** Zave und Jackson zeigten, dass eine Anforderung eine Aussage über die Umgebung ist, eine Spezifikation eine Aussage an der Schnittstelle, und dass die Lücke zwischen beiden nur durch Domänenwissen gefüllt wird, das oft nicht aufgeschrieben ist [64]. Brooks teilte die Schwierigkeit von Software in Essenz und Akzidenz: Die Essenz ist das begriffliche Konstrukt, und das meiste davon ist Spezifikation und Entwurf, nicht Darstellung [61]. Naur argumentierte, dass ein Programm der sichtbare Teil einer Theorie ist, die seine Programmierer besitzen, und dass diese Theorie aus dem Text nicht vollständig rückgewinnbar ist [62]. Durch Shannon gelesen sagen alle drei dasselbe. Absicht trägt mehr Unsicherheit als jedes einzelne Programm, und das Schreiben des Programms ist der Akt, der sie beseitigt. Was nach dem Schreiben des Codes im Kopf eines Programmierers bleibt, ist der Teil der Absicht, den der Code nicht codiert hat.

**Die Umwandlung ist eine Verfeinerung, und Verfeinerung ist eine Einengung.** Hoare gab Programmen eine Logik, in der ein Programm relativ zu einer Vor- und Nachbedingung korrekt ist [54]. Wirth lehrte schrittweise Verfeinerung: eine Aufgabe durch aufeinanderfolgende Entscheidungen in Anweisungen zerlegen, wobei jede eine Wahl festlegt, die die Spezifikation offen ließ [53]. Dijkstras bewachte Befehle machten die offenen Wahlen als Nichtdeterminismus explizit und leiteten Programme aus Spezifikationen ab, indem sie ihn beseitigten [52]. In München baute das CIP-Projekt von Bauer und Wössner Programmentwicklung als Folge korrektheitserhaltender Transformationen von der Spezifikation zum Programm [58]. In Frankreich trugen Abrials B-Methode und danach Event-B die Verfeinerung in den industriellen Maßstab, mit Beweisverpflichtungen bei jedem Schritt [55, 56]. In Finnland gaben Back und von Wright der Verfeinerung ihren verbandstheoretischen Kalkül [57]. In jedem Fall bezeichnet eine Spezifikation eine Menge zulässiger Verhaltensweisen, und jeder Verfeinerungsschritt verkleinert die Menge, bis ein deterministisches Verhalten übrig bleibt. Das ist Entropiereduktion mit einem Beweis bei jedem Schritt. Die Form von RCE ist das letzte Glied dieser Kette: ein totaler, deterministischer Übergang $\delta$ über Datenbankzustände, bei dem jede Wahl aufgelöst ist ([§3.2](#32-definitions)).

**Synthese ist Suche, die einen Hypothesenraum einengt.** Gulwanis FlashFill lernt ein Zeichenkettenprogramm aus wenigen Ein- und Ausgabebeispielen, indem es die Menge aller konsistenten Programme darstellt und sie mit jedem neuen Beispiel schneidet [59]. Gulwani, Polozov und Singh fassen Programmsynthese allgemein als Suche in einem Programmraum, der durch Absicht beschränkt ist [60], und Solar-Lezamas Sketching füllt Lücken in einem Teilprogramm mit einem Löser [27]. Jedes Beispiel und jede Nebenbedingung ist eine Messung, die Hypothesen entfernt. Shannons Maß zählt, wie viele solcher Messungen nötig sind. G2 von RCE ist dieser Gang.

**Was die Umwandlung erzeugt, hat eine Form.** Gurevich bewies, dass jeder sequentielle Algorithmus von einer Abstract State Machine auf seiner eigenen Abstraktionsebene erfasst wird [2]. Codd machte den Zustand zu einer Relation [5], und Event Sourcing macht den Zustand zur Faltung eines nur anhängbaren Logs [14]. Nach Curry und Howard ist ein Beweis ein Programm und eine Aussage ein Typ [18, 72], also ist eine verifizierte Füllung ein Beweis ihrer Spezifikation. Das sind die Gründe, warum das Regime niedriger Entropie wenige Formen hat: Das Ziel ist eine Zustandsmaschine über einer Datenbank, gleich welche Oberflächensprache.

**Niedrige Entropie zerfällt ohne Tor.** Lehman beobachtete über Jahrzehnte großer Systeme, dass ein genutztes Programm sich ständig ändern muss und dass seine Komplexität wächst, sofern keine Arbeit zu ihrer Verringerung geleistet wird [63]. Torres, Baltes, Treude und Wagner maßen strukturelle und textuelle Entropie über die Commit-Historien von 25 Projekten und fanden, dass beide gemeinsam steigen [78]. Entropie fließt aus der Umgebung in den Code zurück. Ein System, das Code im Regime niedriger Entropie halten will, braucht ein Tor an jeder Änderung, und das Tor von RCE ist Korrektheit ([§4.3](#43-the-gate)).

**Compiler betreiben bereits Quellencodierung.** Franz und Kistler lieferten Programme als komprimierte abstrakte Syntaxbäume aus und erzeugten beim Laden nativen Code, was Quellencodierung eines Programms über seiner eigenen Grammatik ist [67]. Fraser leitete aus einem Korpus statistische Modelle von Code ab, um ihn zu komprimieren [68]. Futamura zeigte 1971 in der japanischen Zeitschrift *Systems, Computers, Controls*, dass die Spezialisierung eines Interpreters auf ein Programm ein kompiliertes Programm ergibt und die Spezialisierung des Spezialisierers einen Compiler [70]. Ershov entwickelte in Nowosibirsk dieselbe Idee als gemischte Berechnung [71]. Die abstrakte Interpretation der Cousots berechnet eine korrekte Beschreibung mit weniger Information für jedes Verhalten eines Programms [69]. Die Analogie zur Kanalcodierung ist die Lesart dieses Papiers, kein zitierter Satz: Typen, Tests und Beweise fügen geprüfte Redundanz hinzu, sodass ein falsches Programm erkannt wird, bevor es läuft, so wie eine Paritätsprüfung ein verfälschtes Wort erkennt.

**Beim Löschen fallen die Joule an.** Landauer zeigte, dass ein logisch irreversibler Schritt, das Löschen eines Bits, mindestens $k_B T \ln 2$ dissipiert [65]. Bennett zeigte, dass Berechnung grundsätzlich logisch reversibel gemacht werden kann, sodass das Löschen, nicht die Berechnung, die Schranke trägt [66]. Die Umwandlung hochentropischer Absicht in ein niedrigentropisches Programm verwirft jede Alternative, die die Absicht zuließ. Dieses Verwerfen ist ein Löschen von Information über die Alternativen, und es hat einen thermodynamischen Boden. Das [Agency-Papier](/papers/agency/#1-thesis) bepreist jedes bestätigte Bit gegen diesen Boden. RCE bezahlt das Verwerfen einmal pro neuem Fall und speichert das Ergebnis, sodass ein wiederholter Fall nichts Neues löscht.

### 2.2 Wie RCE umwandelt und wo jeder Gang sitzt

Als Codierungstheorie gelesen trifft eine Aufgabe als Nachricht ein, deren verbleibende Unsicherheit das ist, was keine gespeicherte Füllung bereits auflöst. Jeder Gang entfernt Unsicherheit zu einem anderen Preis, und die Gänge sind nach diesem Preis geordnet ([§4.2](#42-the-gears)).

| Gang | Was er mit der Unsicherheit macht | Herkunft im obigen Argument |
|---|---|---|
| G0 Nachschlagen | Erkennt, dass die Absicht bereits codiert wurde; löst sie durch Abruf auf, am Boden des Handlers | Repetitivität und Klone [33, 34, 35]; Lokalität [46] |
| G1 Regeln | Wendet eine bekannte bewachte Umschreibung an; löst einen wiederkehrenden Rest ohne Suche | Korrektheitserhaltende Transformation [52, 58]; Verfeinerung mit Beweisverpflichtungen [55, 56] |
| G2 Synthese | Durchsucht einen Hypothesenraum und engt ihn durch Beispiele, Nebenbedingungen und einen Löser ein | Programmsynthese als Suche [27, 59, 60] |
| G3 bis G5 Modelle | Zieht aus einer gelernten Verteilung über Code, wenn kein niedrigerer Gang die Lücke schließt; nur als Vorschlagender | Kreuzentropiemodelle von Code [35, 47] |
| Tor | Nimmt einen Kandidaten nur mit Tests, Abdeckung und einem Beweiszertifikat an | Hoare-Logik [54]; Curry-Howard [18, 72] |
| Beförderung | Speichert die angenommene Füllung, sodass derselbe Rest beim nächsten Mal G0 kostet | Minimale Beschreibungslänge [44]; Landauer-Löschung einmal bezahlt [65] |

Die beiden Wege der Tabelle in Abschnitt 2 unterscheiden sich darin, wo die Umwandlung bezahlt wird. Der Generierungsweg zieht bei jeder Aufgabe aus der vollen Verteilung des Prompts und bezahlt damit jedes Mal erneut die hochentropische Seite. Der Konvergenzweg bezahlt nur den Rest, und nur einmal. Die ökonomische Lesart dieses Unterschieds steht in [The Promised Trillion Dollar AI-Coding Market, Abschnitt 4](/papers/ai-coding-market/#4-the-theory-that-prices-the-task). Die Abbruchregel hinter der Gangreihenfolge ist [Mixture of Limits](/papers/gates/#part-ii-the-cascade-mixture-of-limits), und der Abbruch pro Aufgabe ist [Task Satiation](/papers/satiation/).

### 2.3 Ergebnisse pro Sprosse der Leiter

Eine Programmieraufgabe wird hier an den **Absichtsbits** gemessen, die sie braucht: den Bits, die von außerhalb dessen geliefert werden müssen, was die Engine bereits hält (das Programm um die Änderung, die Bibliotheken, die Tests, der Index bekannter Korrekturen). Schreibt man $H_{task}$ für die Bits, die das Zielartefakt festlegen, und $H_{corpus}$ für die Bits, die der Korpus bereits festlegt, so sind die gelieferten Bits $I = H_{task} - H_{corpus}$. Ein Gang, der die richtige Änderung auf Rang $r$ unter seinen Kandidaten setzt, hat $\log_2 r$ Bit Suche geliefert, und das Tor liefert den Rest. Die Leiter ordnet Aufgaben nach Änderungsgröße, einem objektiven Stellvertreter für $I$: ein Token (L0), eine Anweisung (L1), ein Hunk (L2), mehrere Hunks in einer Datei (L3), mehrere Dateien (L4), eine Funktion aus einer Spezifikation oder Tests (L5), eine Änderung auf Issue-Ebene (L6) und ein Programm aus einer Spezifikation (L7). Sprossen, Korpora, Aufteilungen und Hypothesen wurden vor den vollen Läufen präregistriert; die Dateien liegen im [öffentlichen Repository](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

| Sprosse | Zurückgehaltener Testkorpus | N | Gelöst | Rate | Wilson 95% KI | Median Suchbits | Modellaufrufe |
|---|---|---|---|---|---|---|---|
| L0 ein Token | Mutanten im PIT-Stil [109] von 9 realen Repositories an festgelegten Commits (Java: commons-math, commons-collections, jsoup, joda-time, gson; Python: click, attrs, pydantic, sympy) | 520,821 | 520,541 | 0.9995 | 0.9994 bis 0.9995 | 2.3 | 0 |
| L0 ein Token, nie zum Abstimmen genutzte Repositories | commons-text, commons-io, more-itertools, httpx | 23,015 | 23,015 | 1.0000 | 0.9998 bis 1.0000 | 2.0 | 0 |
| L1 eine Anweisung, Java | ManySStuBs4J 2.0, Korrekturen mit einem Hunk [107] | 24,072 | 9,288 | 0.386 | 0.380 bis 0.392 | 3.5 | 0 |
| L1 eine Anweisung, Python | TSSB-3M v1.0.0, Shards 14 und 15 [108] | 157,089 | 27,266 | 0.174 | 0.172 bis 0.175 | 4.8 | 0 |

L2 bis L4 werden auf dem zurückgehaltenen Defects4J-Satz von 288 Fehlern gemessen ([Abschnitt 8.1](#81-defects4j)). L5 bis L7 folgen den Protokollen von [Abschnitt 8.2](#82-swe-bench-lite-offline). Abschnitt 6 nennt Methode, Tor und Energie jeder Zeile.

Die Raten lesen sich als Absichtsbits. Bei L0 liegen die fehlenden Bits fast alle auf der Zeile, und eine nach Priorität geordnete Ein-Token-Nachbarschaft liefert sie im Median mit 2.3 Bit. Bei L1 sieht die Engine nur den 7-zeiligen Hunk. Sie schließt die Kategorien, deren Bits im Hunk liegen (Java: geänderter Operator 91%, vertauschtes boolesches Literal 84%, vertauschte Argumente 82%; Python: geändertes boolesches Literal 98.8%, vertauschte Argumente 99.4%), und lässt jene offen, deren Bits außerhalb liegen: Methodennamen (22%) und Bezeichner (37%) brauchen die Datei und ihre Typen, und neue Konjunkte (3% bis 7%) sowie Umschreibungen ganzer Anweisungen (Python, 1.2% einer Kategorie, die 34% des Korpus ausmacht) sind neue Absicht. Neue Absicht ist das, was ein Lieferant (eine Spezifikation, ein Test, ein Mensch oder ein lokales Modell) einmal bereitstellt, danach steht die Füllung im Index.

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

**Definition 2 (Form und Füllung).** Die *Form* ist die Tupelgestalt mit vier Invarianten: $\delta$ ist deterministisch und rein; die Erkundung ist beschränkt; das Vokabular ist fest; der Zustand ist die Faltung des Logs,

$$\mathrm{state}(D) = \mathrm{foldl}(\delta, s_0, L).$$

Die *Füllung* sind die Daten, die die Gestalt ausfüllen: das Vokabular $\Sigma$, die Alphabete $E$ und $O$, das Regelprogramm $\Pi$, das $\delta$ definiert, die Ausgaberegeln, die $\lambda$ definieren, und die Anfangsdaten $s_0$. In Gurevichs Begriffen ist die Füllung das Vokabular, das ASM-Programm und die Anfangsstrukturen. In Codds Begriffen ist $\Sigma$ das Schema und $s_0$ die Instanz. In Begriffen der Produktlinien ist eine Füllung eine Merkmalsauswahl [8]. In Begriffen der syntaxgesteuerten Synthese (SyGuS) ist eine Füllung ein Term aus einer Grammatik, der eine Spezifikation erfüllt [9].

**Definition 3 (Äquivalenz von Füllungen).** Zwei Füllungen sind äquivalent, wenn für jedes Log $L$ ihre Ausgabefolgen unter $\lambda$ gleich sind.

**Definition 4 (Füllungssprache).** Eine Grammatik, deren Terme Füllungen bezeichnen. Programmiersprachen, SCXML-Dokumente, XState-Konfigurationen und `.rce`-Spezifikationen sind Füllungssprachen. Eine Füllungssprache ist vollständig, wenn jedes ASM-Programm über $\Sigma$ einen Term in ihr hat.

**Definition 5 (Kontrollprojektion).** Man teile $\Sigma = \Sigma_c \cup \Sigma_d$ in endliche Kontrollsymbole und Datenrelationen. Das Statechart von $P$ ist die Projektion von $\delta$ auf $\Sigma_c$: Zustände sind Werte von $\Sigma_c$, Übergänge tragen ein Ereignis und einen Wächter über $\Sigma_d$, und Aktionen sind Aktualisierungen von $\Sigma_d$. Harels Statecharts liefern die Hierarchie und die orthogonalen Regionen [10].

**Definition 6 (Füllungs-E-Graph).** Für eine Füllung $F$ und eine Menge $R$ korrekter Umschreibungen ist der Füllungs-E-Graph $EG(F, R)$ der saturierte E-Graph der Regelterme von $F$ unter $R$ [11, 12]. Jede E-Klasse enthält Füllungen, die nach Definition 3 äquivalent sind.

**Definition 7 (Joule-Kosten).** $\mathrm{cost}_J(t)$ ist die geschätzte Energie (`est_j`), um den Term $t$ einmal auf einem benannten Substrat auszuführen, gewichtet mit der erwarteten Zahl von Läufen.

### 3.3 Warum „funktionale Datenbank-Zustandsmaschine“

Eine endliche relationale Struktur ist eine Datenbankinstanz, also ist ein Gurevich-Zustand eine Datenbank und jeder Schritt eine beschränkte Transaktion. *Datenbank*: $S$ ist eine relationale Struktur. *Funktional*: $\delta$ und $\lambda$ sind rein. *Zustandsmaschine*: Läufe sind Faltungen von $\delta$ über Ereignisse. Moseley und Marks ziehen dieselbe Linie in der Architektur [13]. Event Sourcing zieht sie im Anwendungszustand: „Capture all changes to an application state as a sequence of events“ [14]. Dedalus zieht sie in der Logik, wo veränderlicher Zustand eine nach Zeit indizierte Relation ist [15].

### 3.4 Propositionen

**Proposition 1 (die Form erfasst jeden sequentiellen Algorithmus).** Zu jedem sequentiellen Algorithmus $A$ gibt es eine Form-Instanz $P$, deren Läufe die Läufe von $A$ sind.

*Beweisskizze.* Theorem 6.13 liefert eine ASM $B$ mit den Zuständen, Anfangszuständen und der Ein-Schritt-Abbildung von $A$. Setze $E = \{\varepsilon\}$, $\delta(s, \varepsilon) = \tau_B(s)$, $D = (s_0, \varepsilon^n)$ und $\lambda$ die Identität. Die Faltung nach $n$ Takten ist $\tau_A^n(s_0)$. Nach Gurevichs Korollar 3.3 haben $P$ und $A$ dieselben Läufe. ∎

**Proposition 1b (interaktive Programme).** Erweitere $\Sigma$ um ein nullstelliges Eingabesymbol, das vor jedem Schritt auf $e$ gesetzt wird; dann ist $\delta(s, e) = \tau(s[\mathit{in} := e])$ ein sequentieller Algorithmus über dem erweiterten Vokabular, und Proposition 1 gilt. Die Konstruktion ist unsere.

**Proposition 1c (Berechenbarkeit).** Unter dem Axiom von Dershowitz und Gurevich berechnet jede Form-Instanz eine Turing-berechenbare Funktion [4, 16, 17]. Die Form fügt keine Mächtigkeit hinzu. Sie gibt jedem Programm der Klasse eine Form.

**Proposition 1d (Beweise sind Füllungen).** „For each proof of a given proposition, there is a program of the corresponding type“ [18]. Ein Typ ist eine Spezifikation, und ein Beweis ist eine Füllung, die sie erfüllt. Das Korrektheitstor ist die Existenz dieses Beweises oder eines bestandenen Abnahmetests.

**Proposition 2 (ein Generator).** Eine Funktion $G : \mathrm{Fit} \to \mathrm{Program}$ erzeugt für jede Füllung ein lauffähiges Programm und liest keine Domäne. *Grundlage:* Jedes Programm ist eine Form-Instanz, also gibt $G$ einen typisierten Speicher, einen Ereignistyp, kompilierte Regeln, ein Log mit einer Faltung und einen Ausgabeverteiler aus. Gerüstgeneratoren wie die Generatoren von Rails, JHipster und Yeoman sind $G$, eingeschränkt auf kleine Füllungssprachen. Produktlinienentwicklung beginnt mit „the systematic discovery and exploitation of commonality across related software systems“ [8]; die Gemeinsamkeit ist die Form.

**Proposition 3 (Mixture of Limits als Extraktion).** Extraktion mit $\mathrm{cost}_J$ liefert den Term mit den wenigsten Joule, den der Extraktor in der E-Klasse von $F$ findet. *Beweisskizze.* Die Umschreibungen sind korrekt, also hat jeder Term der E-Klasse das beobachtbare Verhalten von $F$ und passiert dasselbe Tor. Die Extraktion minimiert die Kosten, und die Kosten sind Joule. ∎ Das ist Mixture of Limits, angewandt auf Code: Behalte die minimale Füllung, die die Aufgabe erledigt, der Rest ist Verschwendung.

**Proposition 4 (Determinismus der Wiedergabe).** Wenn $\delta$ keine Wanduhr liest, Aktualisierungen ohne Namen ordnet und jede Eingabe protokolliert, ergeben zwei Wiedergaben desselben $D$ bei jedem Schritt identische Zustandshashes.

**Proposition 5 (die Statechart-Projektion ist korrekt).** Projiziere jeden Zustand eines Laufs auf $\Sigma_c$. Das Ergebnis ist ein Lauf des ausgegebenen Statecharts unter denselben Ereignissen.

**Proposition 6 (Koordinationsbudget).** Als monoton markierte Regeln laufen auf Replikaten ohne Koordination; nur nichtmonotone Regeln brauchen einen Koordinationspunkt. *Grundlage:* der CALM-Satz, „the programs that have consistent, coordination-free distributed implementations are exactly the programs that can be expressed in monotonic logic“ [19].

**Proposition 7 (Intelligenz als Joule-Ableitung).** $X$ zähle die Aufgaben durch das Tor und $J$ die aufgewendeten Joule. $\iota = dX/dJ$ wird im Nachhinein aus $D$ abgelesen, das jedes Ereignis und sein `est_j` aufzeichnet. Extraktion unter $\mathrm{cost}_J$ hält das Tor fest und erhöht $J$ nicht, also senkt sie bei gleichem $X$ nicht $\iota$ ([Agency, Abschnitt 2.3](/papers/agency/#23-layer-3-calculus-intelligence-as-a-derivative-read-in-hindsight)).

### 3.5 Graph, E-Graph und Statechart

| Struktur | Teil der Form | Was sie entscheidet |
|---|---|---|
| Statechart | Wächter von $\delta$ über $\Sigma_c$ | Welcher Übergang feuert |
| Datenflussgraph | Lese- und Schreibabhängigkeiten von $\delta$ und $\lambda$ (Kahn-Prozessnetze [20]) | Was läuft, und in welcher Reihenfolge |
| E-Graph | Die Äquivalenzklasse der Füllung | Welche äquivalente Füllung läuft |

Das Statechart und der Graph beschreiben eine Füllung. Der E-Graph beschreibt jede dazu äquivalente Füllung. Die Extraktion wählt unter ihnen nach Joule.

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

`rce form` nimmt eine Spezifikation und ihre Füllung und gibt aus einer Form-IR fünf Ziele aus:

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

## 5. Verifikation

<div id="51-five-targets-one-trace" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Differentielles Testen über fünf Ziele

`tests/form_targets.rs` treibt eine arithmetische Spezifikation mit elf Operatoren mit 29 Randereignissen plus 500 geseedeten zufälligen Randwerten. Die generierten Ziele Rust, Python, WASM, XState und SCXML geben die Referenzspur Byte für Byte aus, einschließlich der arithmetischen Ränder. Das ist differentielles Testen in der Linie von McKeeman und von Csmith [86]: Übereinstimmung unabhängiger Implementierungen auf einer angegebenen Eingabemenge. Es ist keine Übersetzungsvalidierung [85] und kein verifizierter Compiler. Es deckt die elf Operatoren und die 529 Ereignisse des Tests ab und sagt nichts über Eingaben außerhalb davon. Die Ergebnisse mit Z3 und Kani unten sind die Verifikation.

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

## 6. Ergebnisse

**Methode.** Jeder Korpus wird mit einem festen Seed gemischt. Die ersten 2,000 Positionen jeder Mischung, und für L0 drei ganze Repositories (commons-lang, requests, flask), bilden die Entwicklungsaufteilung, auf der die Gänge abgestimmt werden dürfen; Entwicklungsergebnisse werden nicht berichtet. Jede übrige Aufgabe gehört zur Testaufteilung. Vor einem Testlauf wird die Engine committet und ihr Binärhash aufgezeichnet, und während des Laufs ändert sich kein Gang. Jede Zeile dieses Abschnitts ist ein Ergebnis der eingefrorenen Engine nur auf Testaufgaben, mit 0 Modellaufrufen. Die Präregistrierung (`PREREG.json`), die Zeilen pro Aufgabe und das Berichtsskript liegen im [öffentlichen Repository](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/).

**Tor.** Bei L0 und L1 ist der Ort gegeben, und das Tor ist Token-Identität: Die reparierte Zeile oder Anweisung muss Token für Token der des Entwicklers gleichen. Das ist strenger als das Bestehen der Tests, weil ein Patch eine schwache Testsuite bestehen und trotzdem falsch sein kann. Qi und Kollegen fanden, dass die meisten Patches, die GenProg als Korrekturen meldete, plausibel, aber falsch waren [92]; Überanpassung an Tests ist in suchbasierter und semantikbasierter Reparatur dokumentiert [93, 94] und wird mit generierten Tests angegangen [95]; Werkzeuge schneiden auf dem Benchmark besser ab, auf den sie abgestimmt wurden [96]; und Fehlerlokalisierung verzerrt Vergleiche [97]. Token-Identität beseitigt auf diesen Sprossen die Plausibilitätslücke, und die Angabe des Orts entfernt den Lokalisierungsterm, sodass die Rate allein die Reparaturgänge misst. L2 und darüber verwenden die Tests als Tor und berichten plausible und korrekte Zahlen getrennt (Abschnitt 8.1).

<div id="61-track-a-a-frozen-repair-corpus" class="anchor-alias" aria-hidden="true"></div>
<div id="61-track-a-a-development-repair-corpus" class="anchor-alias" aria-hidden="true"></div>

### 6.1 L0: Fehler in einem Token

Der L0-Korpus umfasst jeden Mutanten im PIT-Stil [109] mit einem gültigen Ersatz-Token in neun realen Repositories an festgelegten Commits, fünf in Java und vier in Python: 520,821 Testaufgaben von 547,448. Die Engine (Commit `65571d0`, Gänge G0-T und G1-J) stellt 520,541 wieder her, eine Rate von 0.9995 (95% Wilson-Intervall 0.9994 bis 0.9995) bei einem Median von 2.3 Suchbits. Von den 280 ungelösten sind 108 mutierte Ziffern in Gleitkommaliteralen und 2 liegen in Python-Mengenliteralen. Ein Gang für Gleitkommaliterale (G0-F, Commit `ecfe5a1`) wird auf vier nie zum Abstimmen genutzten Repositories getestet (commons-text, commons-io, more-itertools, httpx): 23,015 von 23,015 Aufgaben, 1.0000 (0.9998 bis 1.0000), ein Median von 2.0 Suchbits. Mutanten stehen stellvertretend für reale Ein-Token-Fehler, die nach Just und Kollegen mit realen Fehlern gekoppelt sind [110].

<div id="62-track-b-joules-per-solved-task-on-jetson-hub" class="anchor-alias" aria-hidden="true"></div>

### 6.2 L1: Fehler in einer Anweisung aus realen Historien

L1 verwendet zwei öffentliche Datensätze realer Korrekturen einzelner Anweisungen, gewonnen aus Open-Source-Historien. ManySStuBs4J 2.0 [107] liefert 24,072 Java-Testaufgaben; die Engine (Commit `f2701b7`) löst 9,288, eine Rate von 0.386 (0.380 bis 0.392). TSSB-3M v1.0.0 [108] liefert 157,089 Python-Testaufgaben aus den Shards 14 und 15; dieselbe Engine löst 27,266, eine Rate von 0.174 (0.172 bis 0.175). Die Engine erhält nur den 7-zeiligen Hunk, also ist die Java-Rate ein Ergebnis nur mit Hunk; das Ergebnis mit ganzer Datei ist die nächste Zeile dieser Tabelle. Raten pro Kategorie stehen in Abschnitt 2.3, die vollständigen Tabellen pro Schicht im Repository. Für diese Datensätze gibt es unter diesem Tor (nur Hunk, Token-Identität, Ort gegeben) keine veröffentlichte Rangliste der Reparatur, daher steht keine Zahl gelernter Reparatur daneben; Defects4J, das eine hat, wird in Abschnitt 8.1 mit TBar verglichen.

### 6.3 Energie

Jede Zeile trägt `est_j`, eine Schätzung aus CPU-Sekunden mal 10 W: 0.40 J pro gelöster Aufgabe bei L0, 0.13 auf den frischen Repositories, 0.10 auf ManySStuBs4J und 0.27 auf TSSB-3M. Eine Teilstichprobe wurde mit RAPL [105] abgelesen, dem Paketzähler auf dem Prozessorchip, auf einem Linux-Laptop mit einem Intel i9-13900H (Hostname `jetson-hub`; kein NVIDIA Jetson). Der Harness lief auf 4 festgelegten CPUs, und `reported_j` ist das Paketdelta über den ganzen Lauf, einschließlich des Python-Treibers, abzüglich der Leerlaufleistung aus einer 10-s-Stichprobe unmittelbar davor, multipliziert mit der Laufdauer. Runner der kontinuierlichen Integration waren aktiv, also lag der Leerlauf bei 40 W bis 44 W, und die Unsicherheit beträgt etwa ±1 W mal die Dauer, ±10 J auf diesen Summen.

| Teilstichprobe (Testaufteilung) | Aufgaben | Gelöst | Roh J | `reported_j` | `reported_j` pro gelöster Aufgabe | Sekunden |
|---|---|---|---|---|---|---|
| L0, gson-Mutanten (geseedet, erste 3,000) | 3,000 | 3,000 | 648.3 | 167.5 | 0.056 | 11.8 |
| L1, ManySStuBs4J Positionen 2,000 bis 3,999 | 2,000 | 690 | 377.2 | 17.9 | 0.026 | 8.2 |

Die L1-Teilstichprobe baut ihren Projektindex nur aus ihren 2,000 Aufgaben, daher liegt ihre Lösungsrate (34.5%) unter der des vollen Laufs. `measured_j`, ein Wandmessgerät an einer benannten Versorgungsschiene, ist in jeder Zeile leer; sein Protokoll ist Abschnitt 8.3.


## 7. Belege für Wiederverwendung

Der zweite Weg ruht auf einer technischen Tatsache: Code wird auf jeder Skala wiederverwendet. Jede der folgenden Methoden misst das anders.

| Methode | Quelle | Befund |
|---|---|---|
| Klonkartierung auf Dateiebene | DéjàVu, Lopes et al. 2017 [33] | Von 428 Millionen Dateien in 4.5 Millionen GitHub-Projekten, die keine Forks sind, sind 85 Millionen eindeutig: „70% of the code on GitHub consists of clones of previously created files.“ In JavaScript sind 6% der Dateien verschieden. |
| Redundanz auf Zeilenebene | Gabel und Su 2010 [34] | Gegenüber 420 Millionen Zeilen ist „between 50% and 100% of each project is redundant“ bei etwa einer Zeile. |
| Statistische Sprachmodelle | Hindle et al. 2012 [35] | Code ist „very repetitive, and in fact even more so than natural languages.“ |
| Beinahe-Deduplizierung von Korpora | The Stack [36] | Beinahe-Deduplizierung entfernt 54.7% von The Stack v1 (6.4 TB auf 2.9 TB) und 52.4% von v2 (67.5 TB auf 32.1 TB). |
| Bewahrung des ganzen Archivs | Software Heritage | Etwa 30 Milliarden Quelldateien aus 445 Millionen Ursprüngen, jede einmal nach dem Hash ihrer Bytes gespeichert. |
| Gewonnene Korrekturmuster | PAR, TBar [22, 23] | PAR fand „several common fix patterns“ in mehr als 60,000 menschlichen Patches. Die 15 Musterkategorien von TBar korrigieren 43 Defects4J-Fehler korrekt in der Standardpipeline und 74 von 101 mit perfekter Fehlerlokalisierung, ohne Lernen. |
| Sprachübergreifende Aufgaben | Rosetta Code | 1,360 Aufgaben, jede ein Konzept, umgesetzt in vielen von 1,009 bekannten Sprachen. |

Jede Zeile ist eine Eingabe der Engine. Klone und Deduplizierung sagen, dass eine Füllung meist existiert, das ist G0. Wiederkehrende Korrekturen sagen, dass Anpassung meist ein kleiner Katalog bewachter Umschreibungen ist, das ist G1. Redundanz auf Zeilenebene verkleinert den Suchraum von G2. Die Sprossen L0 und L1 messen das im großen Maßstab auf zurückgehaltenen Aufteilungen (Abschnitt 6). Zwei Vorbehalte schärfen die Lesart. Duplikate blähen Abruf- und Modellwerte auf, sofern sie nicht entfernt werden [104]. Und fehlerhafte Zeilen sind weniger natürlich als korrigierte [45], also ist der Fehler selbst der Fall, den das Nachschlagen am wenigsten vorhersagen kann; die Gestalt der Korrektur, nicht die fehlerhafte Zeile, ist das, woran G0 und G1 ansetzen müssen. Die Linie des Regelabbaus, die das im großen Maßstab leistet, von GenProgs Suche nach dem Muster Erzeugen und Validieren [88] und Prophets gelerntem Korrektheitsmodell [89] bis zu Getafix bei Facebook [90] und Soralds modellfreier Reparatur von Verstößen der statischen Analyse [91], leitet Vorlagen aus disjunkter Historie ab und berichtet die Präzision auf ungesehenen Fällen [98]. Das ist der Standard, den Abschnitt 8.4 übernimmt.

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

<div id="63-the-soaks-converge" class="anchor-alias" aria-hidden="true"></div>
<div id="64-the-soaks-converge" class="anchor-alias" aria-hidden="true"></div>
<div id="64-model-calls-in-the-first-soak" class="anchor-alias" aria-hidden="true"></div>
<div id="65-model-calls-in-the-first-soak" class="anchor-alias" aria-hidden="true"></div>

### 8.6 Konvergenz der Modellaufrufe bei großem N

Beförderung ist der Mechanismus, durch den das Modell die Schleife verlässt: Ein Auflöser wird einmal für einen neuen Fall bezahlt, das Tor lässt die Füllung als Handler zu, und jeder spätere Fall derselben Gestalt schließt in G0 oder G1 ([Abschnitt 4.2](#42-the-gears)). Konvergenz ist die Behauptung, dass die Modellaufrufe pro Runde auf einer festen Spezifikation unter Live-Verkehr auf null fallen. Sie wird wie folgt gemessen.

1. Mindestens 1,000 Spezifikationen aus öffentlichen Repositories ziehen, geschichtet nach Sprache und Größe, und Engine und Auflöser vor der ersten Runde einfrieren.
2. Aufgezeichneten Produktionsverkehr wiedergeben, mindestens 10,000 Ereignisse pro Spezifikation, in Runden fester Größe.
3. Pro Runde aufzeichnen: neue Eskalationen, Modellaufrufe, Beförderungen, Zurückstellungen und Joule pro geschlossener Aufgabe, jeweils gekennzeichnet (`est_j`, `reported_j`, `measured_j`).
4. Primärer Endpunkt: der Anteil der Spezifikationen, die innerhalb von 20 Runden eine Runde mit null Modellaufrufen erreichen, mit einem 95%-Wilson-Intervall. Sekundär: Modellaufrufe pro geschlossener Aufgabe nach Runde und die Runde des letzten Modellaufrufs.
5. Spezifikationen, die nie konvergieren, mit ihrer Ursache berichten (eine festsitzende Eingabe, eine fehlende Abhängigkeit, neue Absicht), und die Zurückstellung festsitzender Eingaben als präregistrierten Arm ausführen.

**Proposition 8 (Annäherung an den Boden).** Mit wachsender Abdeckung von G0 und G1 nähern sich die Joule pro gelöster Aufgabe dem Goldboden: eine bekannte Korrektur anwenden und die Tests ausführen. Die Sprossen der Leiter und der zurückgehaltene Defects4J-Satz unter dem Wandmessgerät prüfen das.

## 9. Bezüge zu den Begleitpapieren

**Mixture of Limits.** [Metered Commit Gates, Part II](/papers/gates/#part-ii-the-cascade-mixture-of-limits) formuliert die Philosophie: Für jede Aufgabe ist eine minimale Menge von allem nötig, und alles darüber hinaus ist Verschwendung. RCE wendet sie dreimal an. Die Gangreihenfolge führt den billigsten ausreichenden Gang zuerst aus. Die Beförderung bezahlt einen Auflöser einmal pro neuem Fall, danach wäre jeder wiederholte Aufruf Verschwendung. Die Extraktion behält unter äquivalenten Füllungen die mit den wenigsten Joule (Proposition 3).

**Metered Commit Gates.** [Part I](/papers/gates/) sagt, dass ein Vorschlag sich nicht selbst autorisieren darf. In RCE schlägt ein Modell vor und das Tor committet: Ein Kandidat gelangt nur mit bestandenen Tests, erfüllter Abdeckungsschranke und einem Beweiszertifikat hinein, und jede Entscheidung ist ein Beleg in der Hashkette.

**The Universal Law of Agency.** [Das Agency-Papier](/papers/agency/) definiert Intelligenz als die Ableitung der Handlungsfähigkeit nach Joule, $\iota = dX/dJ$, im Nachhinein abgelesen. Das Log von RCE ist diese nachträgliche Aufzeichnung: $X$ sind die Aufgaben durch das Tor und $J$ ihre Joule, gekennzeichnet. Eine Zurückstellung mit Beleg ist die Verweigerungsklausel des Tors.

**Task Satiation.** [Task Satiation vs. Aggregate Rebound in AI Demand](/papers/satiation/) sagt, dass weitere Synthese für eine Aufgabe nichts mehr einbringt, sobald ihr Vollständigkeitsprädikat wahr ist. RCE ist Sättigung pro Aufgabe innerhalb eines Systems: Sobald ein Handler einen Fall abdeckt, ist weitere Inferenz für diesen Fall null. Die Frage der Gesamtnachfrage gehört zu jenem Papier und zum [ökonomischen Begleittext](/papers/ai-coding-market/).

## 10. Falsifikatoren

Vor dem zurückgehaltenen Lauf von Abschnitt 8.4 festgelegt.

| ID | Beobachtung | Widerlegt |
|---|---|---|
| RCE-F1 | Auf der zurückgehaltenen Scheibe lösen G0 bis G2 mit eingefrorenen Regeln weniger als 10% der Aufgaben mit 0 Modellaufrufen | Die Behauptung, dass für Reparatur in diesem Maßstab die meisten Füllungen bereits existieren |
| RCE-F2 | Byteidentische oder äquivalente Patches machen weniger als die Hälfte der aufgelösten zurückgehaltenen Aufgaben aus | Die Lesart des Tors als mehr als Plausibilität auf den abgedeckten Aufgaben |
| RCE-F3 | Unter dem Wandmessgerät übersteigen die Brutto-Joule pro gelöster Aufgabe des RCE-Lösers die des billigsten Modellvergleichs auf den Aufgaben, die beide lösen | Den Joule-Vorteil des zweiten Wegs auf abgedeckten Aufgaben |
| RCE-F4 | Im Konvergenzprotokoll von Abschnitt 8.6 erreicht weniger als die Hälfte der Spezifikationen ohne festsitzende Eingabe innerhalb von 20 Runden eine Runde mit null Modellaufrufen | Das Herauskompilieren des Modells aus der Schleife |

## 11. Offene Arbeit

Jeder Punkt ist offene Arbeit mit benanntem Protokoll.

1. Zurückgehaltene Ergebnisse auf L2 bis L4, dem Defects4J-Satz von 288 Fehlern (Abschnitt 8.1), und auf L5 bis L7 (Abschnitt 8.2).
2. Vergleichswerte in einer Tabelle, Cost-of-pass in Joule und Dollar (Abschnitt 8.5).
3. Das erste `measured_j`: ein Wandmessgerät an einem ruhenden Host, mindestens 10 Wiederholungen, brutto und netto nebeneinander (Abschnitt 8.3).
4. Das L1-Java-Ergebnis mit ganzer Datei, mit einem typindizierten API-Index als nächstem Gang (Abschnitt 6.2).
5. Die Erhebung der 626 Sprachen, veröffentlicht mit ihrer Methode (Abbildung 1).
6. Neue zurückgehaltene Korpora mit eingefrorenen Gängen: Multi-SWE-bench und BugsInPy (Abschnitt 8.4).
7. Konvergenz der Modellaufrufe über mindestens 1,000 Spezifikationen (Abschnitt 8.6).

## 12. Fazit

Ein Programm ist eine funktionale Datenbank-Zustandsmaschine, und RCE behandelt Programmieren als Umwandlung hochentropischer Absicht in diese niedrigentropische Form. Korrektheit ist das Tor, und Joule sind die Rangfolge. Auf zurückgehaltenen Testaufteilungen mit eingefrorener Engine und ohne Modellaufruf reparieren die Gänge 99.95% von 520,821 Ein-Token-Fehlern und alle 23,015 in nie zum Abstimmen genutzten Repositories, 38.6% von 24,072 Java-Fehlern in einer Anweisung und 17.4% von 157,089 Python-Fehlern, bei Hundertsteln eines berichteten Joule pro gelöster Aufgabe auf einem Paketzähler. Die Verifikationsschicht beweist die Umschreibungen in Z3 und den Kern in Kani, und differentielles Testen bindet fünf Ziele an eine Spur. Was bleibt, sind die oberen Sprossen, Konvergenz bei großem N, Vergleichswerte in derselben Tabelle und ein Wandmessgerät. Diese Protokolle sind in den Abschnitten 8.3 bis 8.6 festgelegt, die Falsifikatoren in Abschnitt 10.

## Literatur
