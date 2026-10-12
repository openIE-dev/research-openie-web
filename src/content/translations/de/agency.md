---
title: "Thermodynamische Schranken und ein optimales Tempo für zielhaltende Agenten"
deck: "Erst Handlungsfähigkeit, dann Kinematik. Das vorgeschlagene Universelle Gesetz der Handlungsfähigkeit ist eine Definition plus ein Tor, und es muss erfüllt sein, bevor etwas als Agent zählt. Die kinematischen Schranken sagen, wie schnell sich Handlungsfähigkeit pro Sekunde und pro Joule bewegt. Intelligenz ist der Kalkül der Handlungsfähigkeit: eine Ableitung, in der Rückschau an einem abgeschlossenen Lauf abgelesen, ι = dX/dJ. Die Energie zum Ausführen ist die einzige wahre Metrik der Computerintelligenz. Schätzungen sind nie measured_j."
lang: "de"
source: "agency"
complete: true
---

<div id="the-universal-law-of-agency" class="anchor-alias" aria-hidden="true"></div>

*Version 1.1, 11. Oktober 2026. Daten und Code: [research.openie.dev/data/](/data/#agency). LaTeX-PDF: [/pdfs/latex/agency.pdf](/pdfs/latex/agency.pdf) ([Quelltext](/pdfs/latex/agency.tex)).*

*Das vorgeschlagene Universelle Gesetz der Handlungsfähigkeit, formuliert als Definition plus Tor.*

*Zuerst die Handlungsfähigkeit. Danach die Kinematik. Intelligenz ist der Kalkül der Handlungsfähigkeit, gelesen in Joule.*

<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. These

Der Vorschlag hat drei Schichten, und ihre Reihenfolge ist fest.

1. **Handlungsfähigkeit kommt zuerst, und ihre Definition ist erforderlich.** Diese Arbeitslinie schlägt sie als das Universelle Gesetz der Handlungsfähigkeit vor. Der Form nach ist es eine Definition plus ein Tor: Vier Klauseln sagen, was als Agent zählt, und die vierte Klausel lehnt jeden Akt ab, der das Joule-Budget überschreitet. Nichts ist ein Agent, bevor die Definition erfüllt ist. Nichts Nachgelagertes ist ohne sie definiert.
2. **Die kinematischen Schranken der Handlungsfähigkeit folgen aus der Definition.** Sie sagen, wie schnell sich Handlungsfähigkeit bewegen kann, pro Sekunde und pro Joule, und was sie für diese Bewegung zahlen muss.
3. **Intelligenz ist der Kalkül der Handlungsfähigkeit.** Intelligenz ist eine Eigenschaft der Rückschau. Sie wird an einem abgeschlossenen Lauf abgelesen, so wie eine Geschwindigkeit an einer aufgezeichneten Bahn abgelesen wird. Sie ist daher eine Ableitung der Handlungsfähigkeit: $\iota = dX/dJ$, wobei $X$ die bestätigte Handlungsfähigkeit und $J$ die Joule sind.

Die These: Die Energie zum Ausführen ist die einzige wahre Metrik der Computerintelligenz. Alle anderen Faktoren fallen auf null.

Die These wird durch ihr Tor gelesen. Leistungsfähigkeit wird nicht verworfen: Sie ist das Tor. Burnell und Kollegen fordern, dass Evaluationen Ergebnisse pro Instanz statt als ein einziges Aggregat berichten [333], und Zhou und Kollegen sowie Laber und Kollegen finden, dass Leistungsfähigkeit und Effizienz über Modelle und Inferenzbudgets hinweg unabhängig voneinander variieren [334, 335]. Diese Befunde betreffen Systeme, die nicht alle dasselbe Prädikat erfüllen. Sobald ein Prädikat $C(z)$ und eine Fehlerrate festgelegt sind, ist jeder Faktor außer den Joule bereits beim Passieren des Tores verbraucht, und das ist der Sinn des zweiten Satzes der These. Die torbedingte Rangordnung ist auch gängige Praxis: SPECpower ordnet Serverarbeit pro Watt bei angegebener Last [338], Cost-of-Pass ordnet Modelle nach den Kosten einer korrekten Antwort [336], und Intelligence per Watt ordnet lokale Modelle nach Genauigkeit pro Leistungseinheit [337]. Der Beitrag dieses Papiers ist die Joule-Form dieser Rangordnung mit einer Ablehnungsklausel und einer Ableitung in der Rückschau, nicht die Idee, unter Korrektheit nach Kosten zu ordnen.

Das Tor und die Rangordnung trennen zwei Dinge, die oft vermengt werden: Leistungsfähigkeit und Intelligenz. Leistungsfähigkeit heißt, $C(z)$ überhaupt zu erfüllen. Intelligenz heißt, wie wenige Joule das Erfüllen kostet. Krakauer, Mitchell und Krakauer ziehen dieselbe Linie aus der Komplexitätswissenschaft: Beeindruckende Fähigkeiten werden nicht mit Intelligenz verwechselt, die dem Lösen von Problemen vorbehalten ist, „quickly and parsimoniously, with a minimal expenditure of energy“ [339]. Zwei Systeme, die dieselbe korrekte Antwort liefern, das eine direkt und das andere nach einem langen Umweg, sind gleich leistungsfähig. Nur das erste ist das intelligentere, und $J^*$ ist die Größe, die sie unterscheidet. Ein System kann leistungsfähiger gemacht werden, indem es mehr ausgibt. Intelligenter wird es nur, indem es für dasselbe Erfüllen weniger ausgibt.

Die These hat eine exakte Form. Korrektheit ist ein Tor. Joule sind die Rangordnung. Für eine Aufgabe $q$ mit Vollständigkeitsprädikat $C(z)$ sind die Joule bis zur korrekten Fertigstellung des Systems $S$

$$
J^*_S(q) = \min_{\pi} \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta
$$

Das Minimum läuft über die Strategien $\pi$, die $S$ ausführen kann, und $\delta$ ist die Fehlerrate, die die Aufgabe zulässt. Eine Frist, sofern die Aufgabe eine hat, wird in $C(z)$ geschrieben: Eine Antwort nach ihrer Frist erfüllt das Prädikat nicht. Korrektheit, Fristen und Aufgabengröße erscheinen also in den Formeln dieser Arbeitslinie, und jede erscheint als Nebenbedingung. Keine erscheint als Punktzahl. Unter den Systemen, die das Tor passieren, ordnen allein die Joule. Parameter, Token, Benchmark-Punktzahlen und Preise haben in dieser Ordnung das Gewicht null. Das bedeutet „fallen auf null“. Korrektheit wird zur Nebenbedingung, und Energie wird zur einzigen Metrik. Das ist die These. Energy-to-Solution im Hochleistungsrechnen und die genauigkeitsbedingten Messungen von MLPerf Power haben dieselbe Form [260]. Diese Arbeitslinie stellt eine Zulässigkeitsdefinition vor das Tor und liest die Joule als gemessene Dichte. Abschnitt 2.3 formuliert die Rangordnung. Proposition 8 beweist, dass sie eine Totalordnung auf Systemen ist, die beschränkten Messfehler übersteht, und dass das integrierte $\iota$ dies nicht ist.

Die Reihenfolge zählt. Eine Ableitung braucht eine Bahn. Eine Bahn braucht etwas, das sich bewegt. Die Definition sagt, was sich bewegt. Die Kinematik sagt, wie es sich bewegen kann. Intelligenz wird danach an der Bahn abgelesen.

Diese Arbeitslinie prüft diese Reihenfolge an der Literatur. Sie sortiert jede Quelle in drei Fächer.

- **Bewiesen:** Theoreme und Herleitungen. Das Ergebnis folgt aus angegebenen Annahmen.
- **Nachgewiesen:** Experimente, Messungen und Simulationen. Das Ergebnis wurde beobachtet.
- **Meinung:** Positionspapiere, Rahmenwerke, Definitionen und Philosophie. Das Ergebnis wird argumentiert.

Keine Quelle wird wegen ihrer Methode ausgeschlossen. Jede Quelle wird danach eingeordnet, was sie der Definition, der Kinematik oder dem Kalkül gibt.

<div id="terms" class="anchor-alias" aria-hidden="true"></div>

### Begriffe

- **SI:** das Internationale Einheitensystem.
- **Joule (J):** die SI-Einheit der Energie. Ein Watt während einer Sekunde.
- **$k_B$:** die Boltzmann-Konstante, $1.380649 \times 10^{-23}$ J/K, nach SI-Definition exakt.
- **Entropieproduktion ($\Sigma$):** die gesamte Entropie, die ein Prozess erzeugt, in Einheiten von $k_B$. Sie ist nur für einen reversiblen Prozess null.
- **Transinformation ($I$):** die Anzahl der Bits, die eine Variable über eine andere trägt.
- **Dynamische Aktivität ($A$):** die Rate der Sprünge zwischen Zuständen in einem stochastischen Prozess. Sie misst, wie geschäftig die Dynamik ist.
- **TUR (thermodynamische Unschärferelation):** ein Theorem, das die Präzision eines Stroms an seine Entropieproduktion bindet.
- **NMR (Kernspinresonanz):** ein Verfahren, das molekulare Spins steuert und ausliest.
- **Instabilitätsrate ($\Lambda$):** wie schnell eine ungeregelte Welt vom Ziel wegdriftet, in Nat pro Sekunde. Für eine lineare Regelstrecke mit $f$ Schritten pro Sekunde gilt $\Lambda = f\sum_{|\lambda_i|>1}\ln|\lambda_i|$.
- **Rücksetzfehler ($\varepsilon$):** die Wahrscheinlichkeit, dass ein zurückgesetzter Datensatz nicht in seinem wahrscheinlichsten Zustand ist.
- **Zählobservable:** eine Größe einer Trajektorie, die ausgewählte Sprünge zählt. Sie nimmt nie ab.
- **Radon-Nikodym-Ableitung:** die Dichte eines Maßes bezüglich eines anderen. Sie existiert, wenn das erste Maß jeder Menge die Masse null gibt, der das zweite die Masse null gibt.
- **Mixture of Limits:** die Philosophie von OpenIE. Verwende den günstigsten Gang, der ausreicht. Es gibt Untergrenzen, jenseits derer zusätzliche Token, Parameter oder Joule keinen überprüfbaren Fortschritt kaufen. Ausgaben jenseits der Untergrenze sind Verschwendung. Diese Untergrenze ist das Plateau (Schwellenkonvergenz). Mixture of Limits ist nicht eine einzelne feste Kaskade. Eine feste Kaskadenreihenfolge ist eine Instanz davon. Der σ-Gesetz-Selektor ist eine andere.
- **Notational Intelligence:** die Belegstudie von OpenIE. Jeder Akt trägt seine Vorhersage, sein Ergebnis und seine Joule.

<div id="2-formal-framework" class="anchor-alias" aria-hidden="true"></div>

## 2. Formaler Rahmen

Definitionen legen die Begriffe fest. Propositionen werden aus zitierten Theoremen bewiesen, mit angegebenen Annahmen.

Abbildung 1 zeigt, wie die drei Schichten übereinanderliegen.

![Diagramm aus drei übereinanderliegenden Schichten. Unten, Schicht 1: die Definition und das Tor, Zulässigkeit, mit vier Klauseln: Vorhersage zuerst, Kopplung an die Welt, getragene Konsequenz und das Joule-Budget. In der Mitte, Schicht 2: Kinematik, wie schnell sich Handlungsfähigkeit pro Sekunde und pro Joule bewegt, begrenzt durch die Landauer-Untergrenze, Geschwindigkeitsgrenzen, die thermodynamische Unschärferelation und das Datenraten-Theorem. Oben, Schicht 3: Kalkül, Intelligenz iota gleich dX nach dJ, gelesen in der Rückschau.](/figures/agency/three-layers.svg)

*Abbildung 1. Handlungsfähigkeit in drei Schichten. Diagramm der Abschnitte 2.1 bis 2.3: die Definition und das Tor, die kinematischen Schranken und Intelligenz als Kalkül der Handlungsfähigkeit. Eine [PNG-Kopie](/figures/agency/three-layers.png) liegt vor.*

<div id="21-layer-1-the-law-eligibility" class="anchor-alias" aria-hidden="true"></div>

<div id="21-layer-1-the-definition-and-its-gate-eligibility" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Schicht 1. Die Definition und ihr Tor: Zulässigkeit

Für ein System $S$, einen Akt $a$ und ein Episodenbudget $B$ in Joule ist die Zulässigkeit $E(S,a) \in \{0,1\}$ nur dann gleich 1, wenn alle vier Klauseln gelten.

1. **Vorhersage zuerst.** Eine Ergebnisvorlage $R^*(a)$ wird zur Zeit $t_0$, vor dem Akt, festgelegt, und sie trennt: $D(R^*(a)) \ge d_0$. Dabei ist $D$ die Wahrscheinlichkeit, dass die Vorlage ein ohne den Akt gezogenes Ergebnis zurückweist, und $d_0 > 0$ wird mit der Vorlage festgelegt. Eine Vorlage, die jedes Ergebnis annimmt, sagt nichts vorher.
2. **Kopplung an die Welt.** $I(\mathrm{do}(a); W') > 0$. Dabei ist $W'$ der Weltzustand hinter dem Aktor, und $\mathrm{do}(a)$ ist Pearls Interventionsoperator [1]. Die Kopplung muss Änderungen an den eigenen Eingaben des Systems überstehen. Das Bearbeiten der eigenen Sensoren zählt nicht [2].
3. **Getragene Konsequenz.** Der Vergleich $m = M(R, R^*(a)) \in \{1, \mu, 0\}$ (Übereinstimmung, teilweise, Abweichung) verändert das System: $s_{t+1} = f(s_t, m)$.
4. **Physikalische Untergrenze: das Joule-Budget.** $J(a) \le B$. Erfüllt kein Akt die Klauseln 1 bis 4, so ist der Akt die Ablehnung, mit einem Beleg.

Die Physik bepreist die Klauseln 1 bis 3 bereits. Der zweite Hauptsatz mit Rückkopplung [3, 4] und die Schranke für Messung und Löschung [5] ergeben für ein Bad der Temperatur $T$:

$$
W_{\mathrm{ext}} \le -\Delta F + k_B T\, I, \qquad W_{\mathrm{meas}} + W_{\mathrm{erase}} \ge k_B T\, I
$$

Dabei ist $I$ die Transinformation, die der Vergleich des Aktes gewinnt, in Nat. Ein Bit sind $\ln 2$ Nat, also kostet jedes Bit $k_B T\ln 2$. Ein Akzeptor, der vergleicht und dann zurücksetzt, zahlt über einen geschlossenen Zyklus mindestens $k_B T \ln 2$ pro Bit [6, 7]. Die Definition ist ab ihrer ersten Klausel physikalisch.

<div id="definition-1-coupling" class="anchor-alias" aria-hidden="true"></div>

#### Definition 1. Kopplung

Klausel 2 wird durch kausalen Informationsfluss gemessen. Der Akt $a$ werde aus der Strategie $p(a)$ gezogen und durch Intervention gesetzt, und $W'$ sei die Welt hinter dem Aktor. Dann gilt

$$
I(\mathrm{do}(a); W') = \sum_{a} p(a) \sum_{w} p(w \mid \mathrm{do}(a)) \log_2 \frac{p(w \mid \mathrm{do}(a))}{\sum_{a'} p(a')\, p(w \mid \mathrm{do}(a'))}
$$

Das ist der Informationsfluss von Ay und Polani vom Aktknoten zu $W'$ [8]. Er ist gleich der Transinformation der interventionellen Verbundverteilung $p(a)\,p(w \mid \mathrm{do}(a))$. Sein Maximum über die Strategien ist die Kapazität des Kanals von den Akten zur Welt:

$$
0 \;\le\; I(\mathrm{do}(a); W') \;\le\; \max_{p(a)} I(\mathrm{do}(a); W') \;\le\; \log_2 |\mathcal{A}|
$$

Dabei ist $\mathcal{A}$ die Menge der verfügbaren Akte. Klyubin, Polani und Nehaniv definierten Empowerment als diese Kapazität, mit den eigenen künftigen Sensoren des Agenten anstelle von $W'$ [9]. Klausel 2 nimmt die Weltseite, sodass das Bearbeiten eines Sensors nichts hinzufügt [2].

**Realisiert, nicht Kapazität.** Die einem Akt gutgeschriebene Größe ist der realisierte Fluss unter der Strategie, die der Agent ausgeführt hat: $I(\mathrm{do}(a); W')$ bei diesem $p(a)$. Die Kapazität ist eine obere Schranke und wird nie gutgeschrieben. Einem System wird keine Kopplung gutgeschrieben, die es hätte herstellen können und nicht hergestellt hat.

**Schätzung.** Der Fluss wird aus Belegen geschätzt. Die randomisierte Strategie des Agenten weist die Akte zu, sodass die gemeinsamen Zählungen von $(a, w)$ im Beleg interventionelle Stichproben sind. Die Plug-in-Transinformation dieser Zählungen ist bei $n$ Stichproben um etwa $(|\mathcal{A}|-1)(|\mathcal{W}|-1)/(2n)$ Nat nach oben verzerrt, mit $\mathcal{W}$ der Menge der unterscheidbaren Weltergebnisse. Dieser Miller-Madow-Term wird abgezogen, und ein Bootstrap-Intervall wird berichtet [315]. Bei Zählungen im Umfang eines Belegs reicht diese Korrektur nicht aus. Der bayessche Schätzer von Nemenman, Shafee und Bialek [325] ist der angegebene Ersatz für den nächsten Lauf, und das Belegschema soll festhalten, welcher Schätzer jede Zahl erzeugt hat. Wo die Strategie in einem Kontext deterministisch ist, werden die Akte dort nicht randomisiert, und der Fluss ist aus diesem Lauf nicht identifizierbar. Der Beleg hält dann die Kapazitätsschranke in einer eigenen Spalte fest, als Schranke gekennzeichnet, und $X$ für diesen Kontext wird als obere Schranke berichtet. Der Lauf aus Abschnitt 8.11 hat die Kapazitätsschranke $b = n_{\mathrm{empty}}\log_2 9$ gutgeschrieben. Sein $X$ und sein $\iota$ sind obere Schranken für realisierte Kopplung und realisierte Intelligenz. Seine $J^*$-Rangordnung verwendet $X$ nicht und bleibt daher bestehen.

Warum dieses Maß:

- **Es ist interventionell.** Pearls Do-Kalkül liefert den Operator [1]. Kenton, Kumar, Farquhar, Richens, MacDermott und Everitt definieren Agenten als Systeme, die ihre Strategie anpassen würden, wenn ihre Akte die Welt auf andere Weise beeinflussten, und sie entdecken Agenten aus interventionellen Daten [10]. Ein Beleg ist konstruktionsbedingt interventionell. Der Agent setzt seine Akte, und das Ergebnis wird an der Welt abgelesen.
- **Beobachtende Maße versagen.** James, Barnett und Crutchfield zeigten an Beispielen, dass Transferentropie keinen Informationsfluss misst [11]. Lizier und Prokopenko trennten Informationsübertragung von kausaler Wirkung und ordneten die kausale Wirkung dem kausalen Informationsfluss zu [12].
- **Es ist bepreist.** Unter Intervention ist der Fluss eine Transinformation. Transinformation ist die Größe, die der zweite Hauptsatz mit Rückkopplung und die Schranke für Messung und Löschung in Joule bepreisen [3, 5].
- **Es braucht keinen Kausalgraphen.** Janzing, Balduzzi, Grosse-Wentrup und Schölkopf leiteten aus Postulaten ein Maß kausalen Einflusses her, gegeben den Kausalgraphen und die Verbundverteilung [13]. Ein Beleg trägt Akte und Ergebnisse, nicht den vollständigen Graphen des Agenten. Der Fluss wird direkt aus ihnen berechnet.
- **Die Gutschrift geht an den Akt, der ihn verursacht hat.** Wenn mehrere Akte ein Ergebnis berühren, folgen die dem Akt $k$ gutgeschriebenen Bits der Darstellung tatsächlicher Verursachung für einzelne Übergänge von Albantakis, Marshall, Hoel und Tononi [14].

<div id="definition-2-agent-boundary" class="anchor-alias" aria-hidden="true"></div>

#### Definition 2. Agentengrenze

Das physikalische System sei eine endliche Menge $V$ von Komponenten, jede hinter einer gemessenen Wand. Ein Kandidat für den Agenten ist eine Teilmenge $S \subseteq V$, oder eine Vergröberung einer solchen, die den Datensatz jedes Vergleichs $m_k$ hält (Klausel 3), mit $W'$ außerhalb von $S$. Für einen abgeschlossenen Lauf sei $X_S$ die Menge der bestätigten gekoppelten Bits, die mit $S$ als Agent gutgeschrieben werden, und $J_S$ die an der Wand von $S$ gemessenen Joule.

**Der Agent ist ein Kandidat, der $X_S / J_S$ maximiert.**

$V$ ist endlich, also gibt es endlich viele Kandidaten. Ein Maximierer existiert, sobald ein Kandidat $J_S > 0$ hat. Der Beleg nennt den Maximierer und hält jeden Gleichstand fest.

**Aktgeschlossene Messung.** Klausel 4 belastet den handelnden Agenten mit den Joule eines Aktes. Ein Kandidat, dem die Kopplung eines Aktes gutgeschrieben wird, wird also mit jedem Joule belastet, das sie verwirklicht: den Joule des Aktors, der den Akt ausführt, und der Verbindung, die den Befehl überträgt. $J_S$ in Definition 2 wird unter dieser Regel gelesen. Takahashi und Hayashi zeigen, warum die Regel nötig ist. Bei einer offenen Grenze entkoppeln sich Informationsgewinn und Dissipation innerhalb der Grenze, und die Bits pro Joule lassen sich beliebig groß machen [239].

<div id="lemma-1-the-maximizing-boundary-contains-the-actuator" class="anchor-alias" aria-hidden="true"></div>

#### Lemma 1. Die maximierende Grenze enthält den Aktor

**Rahmen.** Eine Komponente $\alpha \in V$, der Aktor, ist ein Schnitt zwischen dem Rest von $V$ und der Welt: Jeder kausale Pfad von einer Komponente aus $V \setminus \{\alpha\}$ zu $W'$ läuft über die Ausgabe $a$ von $\alpha$. Ein Kandidat $S$ mit $\alpha \notin S$ wirkt auf $W'$ nur über einen Befehl $c$, den er an $\alpha$ sendet. Die Wände sind disjunkt, wie in Proposition 7, also gilt $J_{S \cup \{\alpha\}} = J_S + J_\alpha + J_0$, mit Verbindungsjoule $J_0 \ge 0$.

**Annahmen.**

- (B1) Schnitt. Für einen Kandidaten ohne $\alpha$ ist $c \to a \to W'$ unter Intervention auf $c$ eine Markow-Kette.
- (B2) Aktgeschlossene Messung. Ein Kandidat ohne $\alpha$, dem Kopplung über $\alpha$ gutgeschrieben wird, wird mit $J_S + J_\alpha + J_0$ belastet.
- (B3) Ein Gleichstand zwischen Kandidaten geht an den bezüglich Inklusion größeren.

**Aussage.** Für jeden Kandidaten $S$ mit $\alpha \notin S$ und positiven belasteten Joule gilt $X_S / (J_S + J_\alpha + J_0) \le X_{S\cup\{\alpha\}} / J_{S\cup\{\alpha\}}$. Also enthält ein Maximierer von Definition 2 den Aktor $\alpha$, und unter (B3) enthält ihn der genannte Maximierer. Die Ungleichung ist strikt, sobald der Aktor Kopplung hinzufügt, $X_S < X_{S\cup\{\alpha\}}$.

**Beweis.**

1. Man fixiere einen Akt. Beide Kandidaten halten dieselben Vergleichsdatensätze, weil $S$ jeden Datensatz hält (Definition 2) und $S \cup \{\alpha\}$ die Menge $S$ enthält. Also sind $E_k$ und $m_k$ für beide gleich. Nach (B1) und der Datenverarbeitungsungleichung, angewandt auf die interventionelle Verbundverteilung, gilt $I(\mathrm{do}(c); W') \le I(\mathrm{do}(a); W')$. Summation über die Akte ergibt $X_S \le X_{S\cup\{\alpha\}}$.
2. Nach (B2) und der Zusammensetzung der Wände (Proposition 7, Teil 1) sind die $S$ belasteten Joule gleich $J_{S\cup\{\alpha\}}$.
3. Schritt 1 über dem gemeinsamen Nenner aus Schritt 2 ergibt die Ungleichung. Sie ist strikt, wenn $X_S < X_{S\cup\{\alpha\}}$.
4. $V$ ist endlich, also existiert ein Maximierer $S^*$. Ist $\alpha \notin S^*$, so macht Schritt 3 auch $S^* \cup \{\alpha\}$ zu einem Maximierer, und (B3) nennt ihn. $\blacksquare$

**Lesart.** Ohne (B2) ist Definition 2 entartet. Eine kleine Teilmenge, die die Datensätze hält und die Leistungsaufnahme des Aktors außerhalb ihrer Wand lässt, meldet dieselben gekoppelten Bits bei weniger Joule. Die aktgeschlossene Messung beseitigt das, in der Praxis ohne Kosten, denn die Joule des Aktors stehen nach Klausel 4 bereits auf dem Beleg. Komponenten abseits des kausalen Pfades werden weiterhin durch das Verhältnis entfernt: Das Weglassen einer solchen lässt $X$ unverändert und senkt $J$. Die Suche läuft nicht über alle $2^{|V|}$ Teilmengen. Sie läuft über Kandidaten, die die Datensätze halten und den Aktor enthalten. Auf einem Host sind das wenige: Prozessor, Beschleuniger, Speicher, Aktor. Ein Messgerät genügt, wenn seine Domänen die Leistung diesen Komponenten zuordnen (Abschnitt 8.1).

Warum diese Grenze:

- **Das Verhältnis, nicht $X_S$ allein.** Die Maximierung von $X_S$ allein setzt keinen Preis auf Komponenten, die Joule und keine bestätigten Bits hinzufügen. Das Verhältnis entfernt sie.
- **Nicht die Markow-Decke.** Aguilera, Millidge, Tschantz und Buckley leiteten her, dass die Bedingung der Markow-Decke nur in einem engen Parameterbereich gilt, selbst für schwach gekoppelte lineare stochastische Systeme [15]. Biehl, Pollock und Kanai bewiesen durch Gegenbeispiel, dass die gebräuchlichen Definitionen der Markow-Decke nicht äquivalent sind [16]. Bruineberg, Dołęga, Dewhurst und Baltieri trennen die Decke als Werkzeug der Inferenz von der Decke als physikalischer Grenze [17].
- **Kein Beobachter.** Orseau, McGregor McGill und Legg definieren Agent und Gerät durch einen bayesschen Vergleich zweier Beschreibungen desselben Verhaltens, sodass die Bezeichnung von den Vorannahmen des Beobachters abhängt [18]. $X_S$ und $J_S$ werden an Belegen und Messgeräten abgelesen.
- **Eine durch ein Maß gefundene Grenze.** IIT 4.0 (integrierte Informationstheorie) nimmt als System die Menge der Elemente mit maximaler integrierter Ursache-Wirkungs-Kraft [19]. Krakauer, Bertschinger, Olbrich, Flack und Ay bestimmen Individuen als Aggregate, die Information aus ihrer Vergangenheit in ihre Zukunft weitertragen [20]. Definition 2 behält die Form bei und verwendet die eigene Währung der Definition: bestätigte gekoppelte Bits pro Joule.
- **Vergröberungen zählen.** Hoel, Albantakis und Tononi zeigten, dass eine Makrobeschreibung mehr kausale Kraft tragen kann als die Mikrobeschreibung [21].
- **Werkzeuge verschieben die Grenze.** Wenn eine Person ein Werkzeug benutzt, umfassen die Kandidaten die Person allein, das Werkzeug allein und das Paar. Definition 2 schreibt die Kopplung demjenigen Kandidaten gut, der $X_S/J_S$ maximiert, und belastet ihn mit jedem Joule des Aktes. Krakauer modelliert die Person, das Werkzeug und die Aufgabe als ein dynamisches System, in dem behaltene Kompetenz und Abhängigkeit sich gemeinsam entwickeln. Oberhalb einer kritischen Verfügbarkeit des Werkzeugs bricht die Kompetenz auf ein abhängiges Niveau ein, und bei einem unsicheren Ziel kann die Handlungsfähigkeit selbst auf das Werkzeug übergehen [340]. In diesem Modell lässt ein Werkzeug, dessen Funktionsweise der Nutzer nachvollziehen kann, etwa ein Abakus, die Kompetenz nach dem Wegnehmen des Werkzeugs bei der Person, während Satellitennavigation in dem Bereich liegt, in dem die Kompetenz mit der Nutzung abnimmt [340]. Das Verhältnis aus Definition 2 macht diese Übertragung messbar: Man prüft die Person ohne das Werkzeug, und die verbleibenden bestätigten Bits sind diejenigen, die die Person hält.
- **Jeder Kandidat hat eine Schnittstelle.** Rosas, Mediano, Biehl, Chandaria und Polani bewiesen, dass jeder bipartite stochastische Prozess eine kausale Decke hat, und gaben einen Algorithmus an, der sie ohne Stationaritäts- oder Markow-Annahme aus Daten findet [22].

<div id="22-layer-2-kinematics" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Schicht 2. Kinematik

Die kumulierten Joule sind $J(t) = \int_0^t P(t')\,dt'$, mit $P$ der gemessenen Leistung.

Die Verschiebung der Handlungsfähigkeit zählt Bits bestätigter, gekoppelter Veränderung:

$$
X(t) = \sum_{k:\,t_k \le t} E_k\, m_k\, I(\mathrm{do}(a_k); W'_k)
$$

Pro Akt ist $I(\mathrm{do}(a_k); W'_k)$ der realisierte Fluss der Strategie, die $a_k$ gewählt hat, geschätzt über die Akte des Laufs im selben Kontext (Definition 1).

Die Geschwindigkeit pro Sekunde ist $v_t = dX/dt$. Die Geschwindigkeit pro Joule ist $v_J = dX/dJ$. Die Beschleunigung pro Joule ist $\alpha_J = d^2X/dJ^2$. Das Budget ist $J(T) \le B$.

Die kinematischen Schranken sind die Grenzen dieser Größen.

**K1. Landauer-Untergrenze, geschlossener Zyklus.** Jedes bestätigte Bit wird aufgezeichnet und später gelöscht, um den Akzeptor zurückzusetzen. Also gilt

$$
v_J \le \frac{1}{k_B T \ln 2}.
$$

Bei $T = 300$ K ist $k_B T \ln 2 \approx 2.87 \times 10^{-21}$ J, berechnet aus den SI-Konstanten. Das sind etwa $3.5 \times 10^{20}$ Bits pro Joule. Proposition 1 beweist K1 Akt für Akt, für die mittleren Joule jedes Aktes, unter angegebenen Annahmen über den Datensatz.

**K2. Klassische Geschwindigkeitsgrenze.** Shiraishi, Funo und Saito bewiesen diese Schranke für einen Markow-Sprungprozess mit lokalem detailliertem Gleichgewicht [23]:

$$
\tau \;\ge\; \frac{L\big(p(0),p(\tau)\big)^2}{2\,\Sigma_{\mathrm{tot}}\,\langle A\rangle_\tau}
$$

- $L(p,p') = \sum_i |p_i - p'_i|$ ist der volle $L_1$-Abstand zwischen zwei Wahrscheinlichkeitsverteilungen. Es gibt keinen Faktor 1/2. Mit dem Totalvariationsabstand $d_{TV} = L/2$ lautet dieselbe Schranke $\tau \ge 2 d_{TV}^2/(\Sigma_{\mathrm{tot}}\langle A\rangle_\tau)$.
- $\Sigma_{\mathrm{tot}} = \int_0^\tau \dot\Sigma\,dt$ ist die gesamte Entropieproduktion, System plus Bäder, in Einheiten von $k_B$.
- $A(t) = \sum_{i\ne j} W_{ij}(t)\,p_j(t)$ ist die dynamische Aktivität, mit $W_{ij}$ der Sprungrate vom Zustand $j$ in den Zustand $i$. $\langle A\rangle_\tau = \frac{1}{\tau}\int_0^\tau A(t)\,dt$ ist ihr Zeitmittel.

Umgestellt gilt $\Sigma_{\mathrm{tot}} \ge L^2/(2\tau\langle A\rangle_\tau)$. Eine Verteilung weit, schnell und mit wenigen Sprüngen zu bewegen, kostet Entropie.

**Joule-Form.** Für ein Bad gilt $k_B T\,\Sigma_{\mathrm{tot}} = W - \Delta F_{\mathrm{neq}}$, mit $F_{\mathrm{neq}}$ der Nichtgleichgewichts-Freien-Energie [24]. Die dissipierte Arbeit erfüllt also

$$
W_{\mathrm{diss}} \;\ge\; \frac{k_B T\, L^2}{2\,\tau\,\langle A\rangle_\tau}.
$$

**Stationäre Ströme.** Dieselbe Arbeit gibt $\tau \ge c^* L^2 / (2\,\Sigma_{HS}\,\langle A\rangle_\tau)$ an, mit $c^* = 0.896\ldots$ und $\Sigma_{HS}$ der Hatano-Sasa- oder Überschuss-Entropieproduktion [23].

**K3. Präzision kostet Dissipation.** Akte sind getrieben und nicht stationär, daher gilt die Unschärferelation von Koyuk und Seifert für zeitabhängigen Antrieb [323]; die stationäre Form wird hier zum Vergleich angegeben. Für einen zeitantisymmetrischen Strom $Y$ in einem stationären Zustand gilt $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma_{\mathrm{tot}}$ [25, 26]. Agenten verwenden Rückkopplung, und Rückkopplung unterbietet diese Schranke im Experiment [27]. Die Schranke für Agenten ist die Rückkopplungsform, in der die Transinformation in die Schranke eingeht [28]. Proposition 3 formuliert sie für bestätigte Handlungsfähigkeit.

**K4. Kosten in endlicher Zeit.** Ein Bit in endlicher Zeit $\tau$ zu löschen, kostet mehr als $k_B T \ln 2$. Der Überschuss wächst, wenn $\tau$ schrumpft [29]. Nahe dem Gleichgewicht ist die Überschussarbeit entlang eines Protokolls nach unten durch die quadrierte thermodynamische Länge geteilt durch die Dauer beschränkt [30]. Proposition 1 gibt die Untergrenze für einen ganzen Akt an.

**K5. Quantenobergrenze der Rate.** Ein System mit mittlerer Energie $\langle E\rangle$ über seinem Grundzustand macht höchstens $2\langle E\rangle/(\pi\hbar)$ orthogonale Übergänge pro Sekunde [31]. Das sind etwa $6.04 \times 10^{33}$ Übergänge pro Sekunde und Joule, berechnet aus den Konstanten. Der manchmal zitierte Wert von etwa $3 \times 10^{33}$ ist $2E/h$, die Hälfte der Margolus-Levitin-Rate, da $2E/(\pi\hbar) = 4E/h$.

<div id="proposition-1-joule-floor-of-one-act-in-finite-time" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 1. Joule-Untergrenze eines Aktes in endlicher Zeit

**Rahmen.** Akt $k$ schreibt seinen Vergleich in einen Datensatz $M_k$ mit $N$ Zuständen und setzt den Datensatz dann zurück. Der Datensatz ist ein Markow-Sprungprozess mit lokalem detailliertem Gleichgewicht, in Kontakt mit einem Bad der Temperatur $T$. Während des Schreibens wird das verglichene Ergebnis $R_k$ festgehalten, und die Sprungraten des Datensatzes dürfen davon abhängen. Während des Zurücksetzens hängen die Raten des Datensatzes von nichts anderem ab, sodass sich der Datensatz allein entwickelt. Das Zurücksetzen dauert $\tau_k$. $\langle A\rangle_k$ ist die zeitgemittelte dynamische Aktivität des Datensatzes während des Zurücksetzens. Joule und Arbeiten sind Mittelwerte über das Ensemble des Aktes $k$.

**Annahmen.**

- (R1) Die Zustände des Datensatzes haben gleiche Energie. Der Datensatz teilt zu Beginn und am Ende des Schreibens keine Wechselwirkungsenergie mit $R_k$. Zu Beginn des Aktes ist der Datensatz in seiner Bereitschaftsverteilung $q^0$, unabhängig von $R_k$.
- (R2) Die gutgeschriebenen Bits übersteigen nicht die Information, die das Schreiben im Datensatz hinterlässt: $b_k \le I(M_k; R_k)$, in Bits, am Ende des Schreibens. Der Datensatz bleibt zwischen dem Schreiben und dem Zurücksetzen unverändert.
- (R3) Das Zurücksetzen bringt den Datensatz zurück in $q^0$. Der Rücksetzfehler ist $\varepsilon = 1 - \max_s q^0_s$.
- (R4) Die Arbeit des Schreibens und des Zurücksetzens läuft durch das Messgerät: $J_k \ge W_k^{\mathrm{write}} + W_k^{\mathrm{reset}}$.

**Aussage.**

$$
J_k \;\ge\; b_k\, k_B T \ln 2 \;+\; \frac{2\, k_B T\, \big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Dabei ist $(x)_+ = \max(x, 0)$, $h_2(x) = -x\log_2 x - (1-x)\log_2(1-x)$ die binäre Entropie und $\phi_N(x) = h_2(x) + x\log_2(N-1)$. Auf $[0, 1 - 1/N]$ wächst $\phi_N$ von 0 bis $\log_2 N$, sodass seine Umkehrfunktion auf $[0, \log_2 N]$ definiert ist. Für einen Ein-Bit-Datensatz, der ein Bit bestätigt, gilt $\phi_2^{-1}(1) = 1/2$ und

$$
J_k \;\ge\; k_B T \ln 2 \;+\; \frac{2\, k_B T\, \big[(1/2 - \varepsilon)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Für $\varepsilon \to 0$ strebt dies gegen $k_B T\ln 2 + k_B T/(2\tau_k\langle A\rangle_k)$.

**Beweis.**

1. Für einen isothermen Markow-Sprungprozess mit lokalem detailliertem Gleichgewicht gilt $W = \Delta F_{\mathrm{neq}} + k_B T\, \Sigma_{\mathrm{tot}}$ mit $\Sigma_{\mathrm{tot}} \ge 0$. Dabei ist $F_{\mathrm{neq}} = \langle E\rangle - k_B T\, S$, mit $S$ der Shannon-Entropie in Nat [24].
2. Das Schreiben. Man wende Schritt 1 auf das Paar $(M_k, R_k)$ mit festem $R_k$ an. Nach (R1) ändert sich die mittlere Energie nicht, und das Paar startet unabhängig. Die Entropie von $R_k$ ändert sich nicht. Die Verbundentropie ändert sich also um $H(q') - I - H(q^0)$, wobei $q'$ die Verteilung des Datensatzes nach dem Schreiben ist und $I = I(M_k; R_k)$, alles in Nat. Also gilt $W_k^{\mathrm{write}} \ge k_B T\,[\,I - H(q') + H(q^0)\,]$.
3. Das Zurücksetzen. Der Datensatz entwickelt sich allein, also gilt Schritt 1 für den Datensatz. Seine Energie ändert sich nicht. Nach (R2) und (R3) geht seine Entropie von $H(q')$ zu $H(q^0)$. Also gilt $W_k^{\mathrm{reset}} = k_B T\,[\,H(q') - H(q^0)\,] + k_B T\, \Sigma^{\mathrm{reset}}$.
4. Die Schritte 2 und 3 und (R4) ergeben $J_k \ge k_B T\, I + k_B T\, \Sigma^{\mathrm{reset}}$. Die Entropien des Datensatzes heben sich über den Zyklus auf. In Bits gilt $k_B T\, I = k_B T\ln 2\; I(M_k;R_k) \ge b_k\, k_B T\ln 2$ nach (R2). Das ist die Schranke für Messung und Löschung von Sagawa und Ueda [5], hier für jede Bereitschaftsverteilung.
5. Die klassische Geschwindigkeitsgrenze ergibt $\Sigma^{\mathrm{reset}} \ge L^2/(2\tau_k\langle A\rangle_k)$, mit $L = \sum_s \lvert q'_s - q^0_s\rvert$ [23]. Man nehme $s$ mit $q^0_s = \max q^0 = 1 - \varepsilon$. Die übrigen Zustände tragen insgesamt die entgegengesetzte Änderung, also gilt $L \ge 2(q^0_s - q'_s) \ge 2\,[(1 - q'_{\max}) - \varepsilon]$.
6. Die Fano-Ungleichung, ohne Nebeninformation und mit dem wahrscheinlichsten Zustand als Schätzung, ergibt $H(q') \le h_2(1-q'_{\max}) + (1-q'_{\max})\log_2(N-1) = \phi_N(1 - q'_{\max})$, in Bits. Da $1 - q'_{\max} \le 1 - 1/N$ und $\phi_N$ dort wächst, gilt $1 - q'_{\max} \ge \phi_N^{-1}(H(q'))$. Nach (R2) gilt $H(q') \ge I(M_k;R_k) \ge b_k$, und $\phi_N^{-1}$ wächst. Also gilt $L \ge 2\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+$.
7. Die Schritte 4 bis 6 ergeben die Aussage. $\blacksquare$

**Lesart.** Die Untergrenze ist eine Summe zweier Preise. Der Informationspreis beträgt $k_B T\ln 2$ pro bestätigtem Bit, gezahlt über den geschlossenen Zyklus, unabhängig vom Bereitschaftszustand. Der Geschwindigkeitspreis gehört zum Zurücksetzen. Ein Zurücksetzen mit endlichen Raten erreicht in endlicher Zeit nie einen einzelnen Zustand, also ist $\varepsilon > 0$ bei jedem endlichen $\tau_k$, und der Geschwindigkeitspreis trägt diesen Fehler. K1 gilt Akt für Akt bei jedem $\tau_k$. Schärfere Löschschranken für bestimmte Dynamiken sind ebenfalls untere Schranken für dasselbe Zurücksetzen (Abschnitt 4.1). Pro Akt ist die Geschwindigkeit pro Joule

$$
v_{J,k} = \frac{b_k}{J_k} \;\le\; \frac{b_k}{b_k\, k_B T \ln 2 + 2 k_B T\,\big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2/(\tau_k\langle A\rangle_k)} \;\le\; \frac{1}{k_B T \ln 2}
$$

Die letzte Ungleichung ist strikt, sobald $\phi_N^{-1}(b_k) > \varepsilon$ bei endlichem $\tau_k\langle A\rangle_k$.

<div id="proposition-2-standing-joules-to-hold-a-goal" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 2. Ständige Joule, um ein Ziel zu halten

**Rahmen.** Die Welt ist eine lineare Regelstrecke $x_{t+1} = A x_t + B u_t + w_t$, mit $x_t \in \mathbb{R}^n$. Im Schritt $t$ schreibt der Agent einen endlichwertigen Datensatz $c_t$ der Regelstrecke. Sein Gedächtnis $s_t$ ist eine endlichwertige Funktion von $(s_{t-1}, c_t)$, mit festem $s_0$, und sein Akt $u_t$ ist eine Funktion von $s_t$. Jeden Datensatz zu behalten, $s_t = (s_{t-1}, c_t)$, ist ein solches Gedächtnis. Das Ziel ist, die Regelstrecke zu halten: $\sup_t \mathbb{E}\|x_t\|^2 < \infty$.

**Annahmen.**

- (C1) Das Rauschen $w_t$ ist unabhängig von $(x_t, s_t)$.
- (C2) $x_0$ hat eine Dichte mit endlicher differentieller Entropie und endlichem zweitem Moment.
- (C3) Abrechnung im geschlossenen Zyklus pro Schritt. $J_t$ sind die mittleren Joule, die dem Datensatz $c_t$ zugerechnet werden: sein Schreiben und seine spätere Löschung, wann immer sie bezahlt werden. $J_t \ge k_B T\, I(x_t; c_t \mid s_{t-1})$, mit der Information in Nat. Das ist Proposition 1, Schritte 1 bis 4, bei jedem Wert des Gedächtnisses $s_{t-1}$, mit einem frischen Datensatz in seinem Bereitschaftszustand und festgehaltenem $x_t$ während des Schreibens [5]. Ein Gedächtnis beschränkter Größe löscht jeden Datensatz innerhalb einer beschränkten Zahl von Schritten, sodass die zugerechneten Joule bis auf einen Randterm in den Lauf fallen.

**Aussage.** Dies ist ein in Joule bepreistes Korollar des Datenraten-Theorems von Tatikonda und Mitter [169] sowie von Nair und Evans [170]. Die Ungleichung für geschlossene Regelkreise von Touchette und Lloyd [32, 33] überträgt die Rate auf den Datensatz, und Landauers Löschpreis [6] rechnet jedes Bit in $k_B T\ln 2$ Joule um. Neu ist es nur als diese Zusammensetzung. Seien $\lambda_1, \dots, \lambda_n$ die Eigenwerte von $A$. Dann gilt

$$
\liminf_{N\to\infty} \frac{1}{N}\sum_{t=1}^{N} J_t \;\ge\; k_B T \ln 2 \sum_{i:\,|\lambda_i| > 1} \log_2 |\lambda_i|
$$

**Beweis.**

1. Man wähle reelle Koordinaten, in denen $A = \mathrm{diag}(A_u, A_s)$, wobei $A_u$ genau die Eigenwerte mit Betrag über 1 trägt. Sei $y_t$ der instabile Block von $x_t$. Dann gilt $y_{t+1} = A_u y_t + v_t + e_t$, wobei $v_t$ eine Funktion von $s_t$ ist und $e_t$ nach (C1) unabhängig von $(y_t, s_t)$. Ein linearer Koordinatenwechsel verschiebt differentielle Entropien um eine Konstante, sodass die Endlichkeit unverändert bleibt.
2. Sei $D_t = h(y_t \mid s_t)$, eine bedingte differentielle Entropie in Nat. Das Hinzufügen unabhängigen Rauschens senkt eine bedingte Entropie nicht. Eine Verschiebung um eine Funktion von $s_t$ ändert sie nicht. Die lineare Abbildung $A_u$ fügt $\ln|\det A_u|$ hinzu. Also gilt $h(y_{t+1} \mid s_t) \ge D_t + \ln|\det A_u|$.
3. $s_{t+1}$ ist eine Funktion von $(s_t, c_{t+1})$, und das Bedingen auf weniger senkt die Entropie nie. Also gilt $D_{t+1} \ge h(y_{t+1}\mid s_t, c_{t+1}) = h(y_{t+1}\mid s_t) - I(y_{t+1}; c_{t+1} \mid s_t)$. Da $y$ eine Funktion von $x$ ist, gilt $I(y_{t+1}; c_{t+1}\mid s_t) \le I(x_{t+1}; c_{t+1}\mid s_t)$. Das ist die Ungleichung für geschlossene Regelkreise von Touchette und Lloyd [32, 33].
4. Die Schritte 2 und 3 ergeben $I(x_{t+1}; c_{t+1}\mid s_t) \ge \ln|\det A_u| - (D_{t+1} - D_t)$. Summation über $N$ Schritte ergibt $\sum_{t=1}^{N} I(x_t; c_t\mid s_{t-1}) \ge N \ln|\det A_u| - (D_N - D_0)$.
5. Jeder Datensatz ist endlichwertig, also ist jeder Informationsterm endlich. $D_0 = h(y_0)$ ist endlich: Das zweite Moment beschränkt es nach oben, und $h(x_0) \le h(y_0) + h(x^{\mathrm{s}}_0)$, mit $x^{\mathrm{s}}_0$ dem stabilen Block, beschränkt es nach (C2) nach unten. $D_N \le h(y_N)$, und eine Gaußverteilung hat bei gegebener Kovarianz die größte Entropie, sodass das beschränkte zweite Moment $D_N$ nach oben beschränkt. Nach Division durch $N$ beträgt die mittlere Information pro Schritt im Grenzwert mindestens $\ln|\det A_u| = \sum_{|\lambda_i|>1}\ln|\lambda_i|$.
6. (C3) bepreist jedes Nat mit $k_B T$, also $k_B T\ln 2$ pro Bit. $\blacksquare$

**Lesart.** Ein Agent, der ein Ziel gegen eine instabile Welt hält, zahlt bei $f$ Regelschritten pro Sekunde eine ständige Leistung von mindestens $f\, k_B T\ln 2\sum_{|\lambda_i|>1}\log_2|\lambda_i|$. Ein instabiler Modus mit $|\lambda| = 2$ braucht ein Bit pro Schritt, also $k_B T\ln 2 \approx 2.87\times10^{-21}$ J pro Schritt bei 300 K. Die Bits pro Schritt des Datensatzes beschränken seine Information nach oben, sodass der Beweis auch eine nicht strikte, gemittelte Form des Datenraten-Theorems liefert (Abschnitt 4.1). Die Zusammensetzung ist kurz. Sie ist das Datenraten-Theorem von Tatikonda und Mitter sowie von Nair und Evans [169, 170], bepreist mit $k_B T\ln 2$ pro Bit über Touchette und Lloyd [32, 33]. Was sie hinzufügt, ist der Preis in Joule, und das ist die Untergrenze, die Vorhersage 1 braucht.

<div id="proposition-3-precision-of-confirmed-agency" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 3. Präzision bestätigter Handlungsfähigkeit

**Rahmen.** Der Agent, seine Welt und seine Rückkopplung bilden einen zeithomogenen, irreduziblen Markow-Sprungprozess auf endlich vielen Zuständen, in seinem stationären Zustand. Jeder bestätigte Akt ist ein Sprung einer markierten Art. $N(t)$ zählt die bestätigten Akte in $[0,t]$. $\langle K\rangle$ ist die mittlere Anzahl der Sprünge aller Arten in $[0,t]$, und $\langle k\rangle = \langle K\rangle/t$ ist die mittlere Sprungrate.

**Aussage.**

1. Im Grenzwert langer Zeiten gilt $\mathrm{Var}(N)/\langle N\rangle^2 \ge 1/\langle K\rangle$. Schreibt jeder bestätigte Akt dieselben $b$ Bits gut, so ist $X = bN$, und dieselbe Schranke gilt für $X$.
2. Sei $T_n$ der Zeitpunkt, zu dem der $n$-te bestätigte Akt abschließt. Für großes $n$ gilt $\mathrm{Var}(T_n)/\langle T_n\rangle^2 \ge 1/(\langle T_n\rangle\langle k\rangle)$.
3. Sei $X$ stattdessen ungerade unter der Abbildung auf das Rückwärtsexperiment einer Fluktuationsrelation, die einen Informationsterm enthält, $P_B(-X,-\sigma_I)/P(X,\sigma_I) = e^{-\sigma_I}$. Dann gilt

$$
\frac{\mathrm{Var}(X) + \mathrm{Var}_B(X)}{\big(\langle X\rangle + \langle X\rangle_B\big)^2} \;\ge\; \frac{1}{\exp\!\big[(\langle\sigma_I\rangle + \langle\sigma_I\rangle_B)/2\big] - 1}
$$

Wenn das Rückwärtsexperiment dem Vorwärtsexperiment gleicht, lautet dies $\mathrm{Var}(X)/\langle X\rangle^2 \ge 2/\big(e^{\langle\sigma_I\rangle} - 1\big)$.

**Beweis.** $N$ ist eine Zählobservable: Sie zählt eine Teilmenge der Sprünge und nimmt nie ab. Garrahan bewies die Teile 1 und 2 für Zählobservablen in stationären Markow-Sprungprozessen [34]. Teil 1 ist seine Schranke für die Varianz einer Zählobservable durch die mittlere Aktivität. Teil 2 ist seine Erstpassageschranke, formuliert für Zählungen mit Sprunggewichten 0 oder 1, die hier gilt, weil $N$ eine markierte Sprungart zählt. Die Skalierung mit $b$ lässt eine relative Varianz unverändert. Teil 3 ist die Unschärferelation, die Potts und Samuelsson aus jeder Fluktuationsrelation hergeleitet haben, Messung und Rückkopplung eingeschlossen [28], angewandt mit $X$ als Observable. $\blacksquare$

**Lesart.** Teil 1 braucht keine Zeitumkehreigenschaft und kein Modell der Rückkopplung. Die Präzision bestätigter Handlungsfähigkeit wird mit Aktivität erkauft. Teil 3 ist der Dissipationspreis, und er gilt unter Rückkopplung, weil er auf der Fluktuationsrelation mit Rückkopplung beruht. Die Standard-TUR bindet Rückkopplungsmaschinen im Experiment nicht [27]. Deshalb trägt die Agentenform den Informationsterm.

<div id="proposition-4-quantum-agents-keep-the-floor" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 4. Quantenagenten halten die Untergrenze ein

**Rahmen.** Der Vergleich $m_k$ stammt aus einer Quantenmessung und wird in ein klassisches Register geschrieben, den Datensatz von Klausel 3. Das Zurücksetzen des Registers erfüllt den Rahmen von Proposition 1 sowie (R2) und (R3), mit $I(M_k;R_k)$ der quanten-klassischen Transinformation der Messung. Die Arbeit des Zurücksetzens läuft durch das Messgerät: $J_k \ge W_k^{\mathrm{reset}}$.

**Aussage.**

$$
J_k \;\ge\; k_B T\ln 2\,\big[\,b_k - \phi_N(\varepsilon)\,\big] \;+\; \frac{2\, k_B T\, \big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Für $\varepsilon \to 0$ ist dies die Untergrenze von Proposition 1. Wird auch das Schreiben gemessen, ergibt die Schranke für Messung und Löschung von Sagawa und Ueda $J_k \ge b_k\, k_B T\ln 2$ bei jedem $\varepsilon$, unter der zusätzlichen Annahme, die sie für Quantenmessungen angeben [5].

**Beweis.** Schritt 3 von Proposition 1 verwendet nur das Register und seine Rücksetzdynamik. Er ergibt $W_k^{\mathrm{reset}} = k_B T\ln 2\,[H(q') - H(q^0)] + k_B T\,\Sigma^{\mathrm{reset}}$, mit Entropien in Bits. Die quanten-klassische Transinformation ist höchstens die Entropie der Ergebnisse [5], also gilt $H(q') \ge b_k$. Die Fano-Ungleichung ergibt $H(q^0) \le \phi_N(\varepsilon)$, da $\varepsilon \le 1 - 1/N$. Die Schritte 5 und 6 von Proposition 1 beschränken $\Sigma^{\mathrm{reset}}$. $\blacksquare$

**Lesart.** Quantenressourcen ändern, was ein Agent pro Akt tun kann. Sie senken nicht den Preis seines Datensatzes. Der Datensatz kostet $k_B T\ln 2$ pro Bit, abzüglich eines Rests $\phi_N(\varepsilon)$, der verschwindet, wenn das Zurücksetzen exakt wird. Die Messung, die den Datensatz schreibt, hat ihren eigenen Preis, angegeben in Abschnitt 4.1.

<div id="23-layer-3-calculus-intelligence-as-a-derivative-read-in-hindsight" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Schicht 3. Kalkül: Intelligenz als Ableitung, gelesen in der Rückschau

Ein Lauf erzeugt einen Beleg: den geordneten Datensatz $\{(J_k, X_k)\}_{k=0}^{n}$ aus gemessenen Joule und bestätigter Verschiebung. Jedes $m_k$ ist erst bekannt, wenn der Akt $k$ abschließt. Die Bahn $X(J)$ existiert also erst, wenn der Lauf abgeschlossen ist.

- **Intelligenz, marginal:** $\iota(J) = \dfrac{dX}{dJ}$, aus dem Beleg geschätzt als $\iota_k = \Delta X_k/\Delta J_k$.
- **Laufintegral:** $X(B) = \int_0^B \iota(J)\,dJ$.
- **Joule zum Erfüllen einer Anforderung:** $J^*(X_{\mathrm{req}}) = \int_0^{X_{\mathrm{req}}} \frac{dX}{\iota}$.
- **Optimum:** $\pi^* = \arg\min_\pi J_\pi$ unter den Nebenbedingungen $X_\pi \ge X_{\mathrm{req}}$, $E_k = 1$ für jedes $k$ und $J_\pi \le B$. Ist keine Strategie zulässig, wird mit einem Beleg abgelehnt.
- **Rangordnung:** $S_1 \succ_q S_2 \iff J^*_{S_1}(q) < J^*_{S_2}(q)$.

$X_{\mathrm{req}}$ wird durch das Vollständigkeitsprädikat $C(z)$ der Aufgabe festgelegt. Es ist ein Tor, keine Punktzahl. Parameter, Token und Benchmarks gehen nur über $J^*$ ein. Alle anderen Faktoren fallen auf null.

Rückschau ist hier wörtlich gemeint. Eine Geschwindigkeit wird an einer aufgezeichneten Bahn abgelesen. Intelligenz wird an einem aufgezeichneten Lauf abgelesen. Der Beleg ist die Bahn.

<div id="proposition-5-intelligence-exists-as-a-bounded-density-on-the-joule-axis" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 5. Intelligenz existiert als beschränkte Dichte auf der Joule-Achse

**Rahmen.** Ein Lauf auf $[0, T]$ hat eine gemessene Leistung $P(t) \ge 0$, integrierbar, und das Joule-Maß $dJ = P\,dt$. Akt $k$ belegt $[s_k, e_k]$ und schreibt $b_k = E_k\, m_k\, I(\mathrm{do}(a_k); W'_k) \ge 0$ Bits gut. Akte dürfen sich überlappen. Jeder Akt hat eine zugeordnete Leistung $P_k \ge 0$, null außerhalb von $[s_k, e_k]$, mit $\sum_k P_k \le P$. Seine Joule sind $J_k = \int P_k\,dt > 0$. Für Akte, die sich nicht überlappen, gilt $P_k = P$ auf dem Intervall des Aktes.

**Gutschriftregel.** Die Bits jedes Aktes werden über seine eigenen Joule verteilt:

$$
dX = \sum_k \frac{b_k}{J_k}\, P_k\, dt
$$

**Annahme (K1 pro Akt).** $b_k\, k_B T \ln 2 \le J_k$ für jedes $k$. Proposition 1 liefert dies unter (R1) bis (R4) für die mittleren Joule jedes Aktes, sodass die Aussage für den mittleren Lauf gilt. Für einen einzelnen Lauf gilt sie, sobald jeder Akt mehr als $b_k\, k_B T\ln 2$ aufnimmt. Jeder bestätigte Akt im Lauf aus Abschnitt 8.11 nahm mehr als das $3 \times 10^{14}$-Fache davon auf.

**Aussage.**

1. Für jede messbare Zeitmenge $A \subseteq [0,T]$ gilt $0 \le X(A) \le J(A)/(k_B T\ln 2)$. Also ist $dX$ absolut stetig bezüglich $dJ$.
2. Die Radon-Nikodym-Ableitung $\iota = dX/dJ$ existiert, ist bis auf Mengen von null Joule eindeutig und erfüllt

$$
0 \;\le\; \iota \;\le\; \frac{1}{k_B T \ln 2}
$$

Wo $P > 0$, gilt $\iota = \sum_k (b_k/J_k)(P_k/P)$. Für Akte, die sich nicht überlappen, gilt $\iota = b_k/J_k$ auf Akt $k$, und das ist das $\iota_k$ des Belegs.

3. Bestätigte Handlungsfähigkeit ist eine Funktion der kumulierten Joule: $X(t) = g(J(t))$, mit $g$ nicht fallend und Lipschitz-stetig mit Konstante $1/(k_B T\ln 2)$. Also ist $g$ bei fast jedem Joule differenzierbar, und $g'(J(t)) = \iota(t)$ für fast jedes Joule.
4. Werden die Bits jedes Aktes stattdessen im Augenblick seines Abschlusses gutgeschrieben, so ist $dX = \sum_k b_k\,\delta_{e_k}$ singulär bezüglich $dJ$, sobald ein $b_k > 0$ ist. Dann ist $g$ eine Treppenfunktion, $g' = 0$ bei fast jedem Joule, und die gesamte Handlungsfähigkeit liegt auf einer Menge von null Joule.

**Beweis.**

1. $X(A) = \sum_k (b_k/J_k)\int_A P_k\,dt \le \frac{1}{k_BT\ln 2}\int_A \sum_k P_k\,dt \le \frac{J(A)}{k_BT\ln 2}$, nach K1 pro Akt und dann $\sum_k P_k \le P$. Ist $J(A) = 0$, so ist $X(A) = 0$.
2. Beide Maße sind endlich, also liefert der Satz von Radon-Nikodym $\iota$. Wäre $\iota > 1/(k_BT\ln 2)$ auf einer Menge $B$ mit $J(B) > 0$, so wäre $X(B) > J(B)/(k_BT\ln 2)$, im Widerspruch zu Schritt 1. Auf $\{P > 0\}$ gilt $dX = \sum_k (b_k/J_k)(P_k/P)\,dJ$, und $P_k = 0$, wo $P = 0$. Das ergibt die explizite Form.
3. Ist $J(t_1) = J(t_2)$ mit $t_1 < t_2$, so ergibt Schritt 1 $X((t_1,t_2]) = 0$, also ist $g$ wohldefiniert. Für $t_1 < t_2$ gilt $g(J(t_2)) - g(J(t_1)) = X((t_1,t_2]) \le (J(t_2) - J(t_1))/(k_BT\ln 2)$. $J$ ist stetig, also ist $g$ auf $[0, J(T)]$ Lipschitz-stetig. Eine Lipschitz-stetige Funktion ist absolut stetig und fast überall differenzierbar. Eine Variablensubstitution ergibt $\int_0^t g'(J(s))\,dJ(s) = g(J(t)) = X([0,t])$. Also ist $g'\circ J$ ebenfalls eine Dichte von $X$ bezüglich $J$, und wegen der Eindeutigkeit ist sie gleich $\iota$.
4. $X(\{e_k\}) = b_k > 0$, während $J(\{e_k\}) = 0$, weil $J$ stetig ist. Also ist $dX$ nicht absolut stetig. Es liegt auf endlich vielen Punkten von null Joule, ist also singulär. Eine Funktion, die zwischen endlich vielen Sprüngen konstant ist, hat fast überall die Ableitung null. $\blacksquare$

**Lesart.** Intelligenz in der Rückschau ist eine wohldefinierte Dichte auf der Joule-Achse, sobald die Bits jedes Aktes über die Joule verteilt werden, die dieser Akt verbraucht hat. Die Gutschriftregel ist es, die $dX/dJ$ existieren lässt. Punktweise Gutschrift legt die gesamte Handlungsfähigkeit auf eine Menge von null Joule. Überlappende Akte werden durch jede Zuordnung behandelt, die nie mehr Joule zuweist, als das Messgerät gelesen hat. Jedes $b_k$ ist erst bekannt, wenn der Akt $k$ abschließt, also wird $\iota$ am abgeschlossenen Lauf abgelesen.

Proposition 5 gilt konstruktionsbedingt. Die Gutschriftregel macht $X$ absolut stetig bezüglich $J$, also existiert die Dichte per Definition. Ihr Gehalt ist die Wahl der Regel: Teil 4 zeigt, dass die andere naheliegende Regel, die punktweise Gutschrift, überhaupt keine Dichte übrig lässt.

<div id="proposition-6-sampled-intelligence-converges" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 6. Abgetastete Intelligenz konvergiert

**Rahmen.** Das Messgerät wird bei den kumulierten Joule $0 = j_0 < j_1 < \dots < j_M = J(T)$ abgelesen, mit Feinheit $\Delta = \max_i (j_{i+1} - j_i)$. Auf $[j_i, j_{i+1})$ ist die abgetastete Intelligenz

$$
\hat\iota = \frac{g(j_{i+1}) - g(j_i)}{j_{i+1} - j_i}
$$

Zeitliche Abtastungen verfeinern Joule-Abtastungen, weil $J$ stetig ist.

**Aussage.** Unter dem Rahmen von Proposition 5 gilt $\hat\iota(j) \to g'(j)$ bei fast jedem Joule $j$ für $\Delta \to 0$, und $0 \le \hat\iota \le 1/(k_BT\ln 2)$ bei jeder Feinheit. Hat die Ablesung des Messgeräts für jedes abgetastete Intervall einen relativen Fehler von höchstens $\epsilon < 1$, so liegt das berichtete Verhältnis in $[\hat\iota/(1+\epsilon),\, \hat\iota/(1-\epsilon)]$.

**Beweis.** $\hat\iota(j)$ ist der Mittelwert von $g'$ über ein abgetastetes Intervall $I \ni j$ der Länge $h \le \Delta$. Da $I \subseteq [j - h, j + h]$, gilt

$$
\big|\hat\iota(j) - g'(j)\big| \;\le\; \frac{1}{h}\int_{j-h}^{j+h}\big|g'(u) - g'(j)\big|\,du
$$

Die rechte Seite strebt in jedem Lebesgue-Punkt von $g'$ gegen 0, und nach dem Differentiationssatz von Lebesgue ist fast jedes $j$ ein Lebesgue-Punkt. Die Schranken für $\hat\iota$ sind die Monotonie und die Lipschitz-Konstante von $g$. Eine Ablesung $\Delta\hat J \in [(1-\epsilon)\Delta J, (1+\epsilon)\Delta J]$ teilt dasselbe $\Delta X$. $\blacksquare$

<div id="proposition-7-composition-of-joules-and-coupled-bits" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 7. Zusammensetzung von Joule und gekoppelten Bits

**Rahmen.** Eine Gruppe $G$ aus Mitgliedern $i = 1, \dots, n$ wirkt auf eine Welt $W'$. Jedes Mitglied sitzt hinter seiner eigenen gemessenen Wand. Die Wände sind disjunkt und liegen innerhalb der Wand der Gruppe, und jedes Mitglied bezieht seine Energie von außerhalb der Gruppe. Die Mitglieder wählen die Akte $a_1, \dots, a_n$ nach unabhängigen Strategien. Die Kopplung des Mitglieds $i$ wird berechnet, während die übrigen Mitglieder nach ihren eigenen Strategien handeln.

**Aussage.**

1. $J_G = \sum_i J_i + J_0$, wobei $J_0 \ge 0$ die Energie ist, die in die Wand der Gruppe und in die Wand keines Mitglieds eintritt.
2. $I(\mathrm{do}(a_1,\dots,a_n); W') \ge \sum_i I(\mathrm{do}(a_i); W')$, mit Gleichheit genau dann, wenn $a_i$ für jedes $i$ gegeben $W'$ unabhängig von $(a_1, \dots, a_{i-1})$ ist.
3. Die Ungleichung kann strikt sein, wenn jedes Mitglied für sich ungekoppelt ist. Mit $a_1, a_2$ unabhängigen gleichverteilten Bits und $W' = a_1 \oplus a_2$ beträgt die Kopplung jedes Mitglieds 0 Bits und die der Gruppe 1 Bit.
4. Unter K1 pro Akt an der Wand der Gruppe gilt Proposition 5 für $G$: $\iota_G$ existiert und $0 \le \iota_G \le 1/(k_BT\ln 2)$. Nach Definition 2 ist $G$ der Agent, wenn $X_G/J_G$ das Verhältnis $X_S/J_S$ jedes anderen Kandidaten übersteigt, jedes Mitglied eingeschlossen.

**Beweis.**

1. Jedes Joule, das in die Wand eines Mitglieds eintritt, tritt zuerst in die Wand der Gruppe ein, und gemessene Energie addiert sich über disjunkte Wände.
2. Unter Intervention haben die Akte die Produktverteilung $\prod_i p(a_i)$, und jede Kopplung ist eine Transinformation der interventionellen Verbundverteilung (Definition 1). Die Kopplung des Mitglieds $i$ ist $I(a_i; W')$ in dieser Verbundverteilung, durch Marginalisieren der übrigen Akte. Nach der Kettenregel gilt $I(a_{1:n}; W') = \sum_i I(a_i; W' \mid a_{<i})$. Die Unabhängigkeit ergibt $I(a_i; a_{<i}) = 0$, also gilt $I(a_i; W' \mid a_{<i}) = I(a_i; W', a_{<i}) = I(a_i; W') + I(a_i; a_{<i} \mid W') \ge I(a_i; W')$. Gleichheit gilt für jeden Term genau dann, wenn $I(a_i; a_{<i}\mid W') = 0$ für jedes $i$.
3. Gegeben nur $a_1$, ist $W'$ weiterhin ein gleichverteiltes Bit, also gilt $I(a_1; W') = 0$, und ebenso für $a_2$. Gegeben beide Akte, ist $W'$ festgelegt, also gilt $I(a_1, a_2; W') = H(W') = 1$ Bit.
4. Proposition 5 braucht nur den Lauf, das Messgerät und K1 pro Akt. Man wende sie an der Wand der Gruppe an. $\blacksquare$

**Lesart.** Joule addieren sich, mit den Verbindungen der Gruppe obendrauf. Gekoppelte Bits unabhängiger Mitglieder addieren sich mindestens, und manche existieren nur auf Gruppenebene. Eine Gruppe erhöht $\iota_G$, wenn sie mehr gekoppelte Bits gewinnt, als ihre Mitglieder allein halten, oder wenn sie beim gemeinsamen Handeln weniger Joule ausgibt als ihre Mitglieder beim getrennten Handeln. Abschnitt 4.1 gibt die Theoreme an, die beide Terme bepreisen.

<div id="prediction-1-the-optimal-act-time-of-an-agent-that-holds-a-goal" class="anchor-alias" aria-hidden="true"></div>

#### Vorhersage 1. Die optimale Aktzeit eines Agenten, der ein Ziel hält

**Rahmen.** Ein Akzeptor im geschlossenen Zyklus führt einen Akt nach dem anderen aus. Jeder Akt schreibt einen Datensatz mit $N$ Zuständen und schreibt bei Bestätigung $b$ Bits gut. Der Vergleich, der vor dem Zurücksetzen erfolgt, bestätigt mit Wahrscheinlichkeit $p$. Jedes Zurücksetzen erfüllt Proposition 1, mit Dauer $\tau$, mittlerer Aktivität $\langle A\rangle$ und Rücksetzfehler $\varepsilon$. Währenddessen hält der Agent über ein separates Register ein Ziel gegen eine Welt mit Instabilitätsrate $\Lambda$. Jedes Joule wird an der Wand des Agenten gemessen (Definition 2).

**Herleitung.** Jeder Akt dauert mindestens $\tau$. Proposition 2 bepreist das Halten langfristig mit $k_B T\,\Lambda$ pro Sekunde. Proposition 1 bepreist den Akt. Die beiden Register sind verschieden, also addieren sich ihre gemessenen Joule. Pro Akt gilt im Mittel

$$
J(\tau) \;\ge\; b\,k_B T\ln 2 \;+\; \frac{\kappa}{\tau} \;+\; k_B T\,\Lambda\,\tau, \qquad \kappa = \frac{2k_B T\,\big[\big(\phi_N^{-1}(b) - \varepsilon\big)_+\big]^2}{\langle A\rangle}
$$

Nach Proposition 5 ist die Intelligenz des Laufs bestätigte Bits pro Joule, $\iota(\tau) = p\,b/J(\tau)$. Die rechte Seite der Schranke für $J$ ist am kleinsten bei $\tau^* = \sqrt{\kappa/(k_B T\Lambda)}$, wo sie gleich $b\,k_B T\ln 2 + 2\sqrt{\kappa\,k_B T\Lambda}$ ist. Für einen Ein-Bit-Datensatz und ein exaktes Zurücksetzen ergibt das zwei Zahlen:

$$
\tau^* = \frac{1}{\sqrt{2\,\langle A\rangle\,\Lambda}}, \qquad \iota(\tau) \;\le\; \frac{p}{k_B T\,\big[\ln 2 + \sqrt{2\Lambda/\langle A\rangle}\big]}
$$

**Vorhersage 1.**

1. **Obergrenze.** Kein Akzeptor, der während des Handelns ein Ziel bei Instabilitätsrate $\Lambda$ hält, erreicht für Ein-Bit-Akte bei irgendeiner Aktzeit ein $\iota$ über $p/\big(k_B T[\ln 2 + \sqrt{2\Lambda/\langle A\rangle}]\big)$. Die allgemeine Obergrenze ist $p\,b/\big(b\,k_B T\ln 2 + 2\sqrt{\kappa\,k_B T\Lambda}\big)$. Sie hängt nur von $T$, $p$, $b$, $N$, $\varepsilon$ und dem Verhältnis $\Lambda/\langle A\rangle$ ab.
2. **Optimale Aktzeit.** Die gemessenen Joule pro Akt eines Akzeptors mögen $J(\tau) = J_0 + a/\tau + s\,\tau$ folgen. Man messe $a$ und $J_0$ aus einem Durchlauf über $\tau$ ohne gehaltenes Ziel und die ständige Leistung $s$ aus dem gehaltenen Ziel ohne Akte. Dann hat das gemessene $\iota(\tau)$ sein Maximum bei $\tau^* = \sqrt{a/s}$, mit dem Wert $p\,b/(J_0 + 2\sqrt{a s})$, wobei $a \ge \kappa$ und $s \ge k_B T\Lambda$. Das Fehlerband ist

$$
\frac{\delta\tau^*}{\tau^*} = \frac{1}{2}\sqrt{\Big(\frac{\delta a}{a}\Big)^2 + \Big(\frac{\delta s}{s}\Big)^2}
$$

3. **Skalierung.** Über einen Durchlauf der Instabilitätsrate fällt $\ln\tau^*$ gegen $\ln s$ mit Steigung $-1/2$.

**Falsifikator.** Der gemessene Maximierer von $\iota(\tau)$ liegt außerhalb von $\tau^* \pm 2\,\delta\tau^*$, oder die angepasste Steigung von $\ln\tau^*$ gegen $\ln s$ über mindestens eine Dekade von $s$ weicht um mehr als zwei Standardfehler von $-1/2$ ab. Beides widerlegt die Behauptung, dass sich Aktjoule und ständige Joule auf einem Messgerät addieren, mit $\iota$ als ihrer Dichte gelesen. Ein gemessenes $\iota$ über der Obergrenze widerlegt die Abrechnung dieses Laufs (F12, Abschnitt 8.7).

Abbildung 2 zeichnet die Kurve von Vorhersage 1.

![Modellillustration von Vorhersage 1. Die relative Intelligenz iota von tau ist gegen die Aktzeit tau auf logarithmischer Achse aufgetragen, für J von tau gleich J null plus a durch tau plus s tau. Mit s gleich 1 liegt das Maximum bei tau Stern gleich 1; mit s gleich 4 wandert das Maximum zu 0.5 und ist niedriger, was die Steigung von minus einhalb zeigt.](/figures/agency/act-time.svg)

*Abbildung 2. Eine optimale Aktzeit. Modellillustration, keine Messung: $J(\tau) = J_0 + a/\tau + s\,\tau$ mit $J_0 = a = 1$ und $s \in \{1, 4\}$ in normierten Einheiten. Eine Vervierfachung der ständigen Kosten halbiert $\tau^*$, die Steigung von $-1/2$, die der Falsifikator prüft. Eine [PNG-Kopie](/figures/agency/act-time.png) liegt vor.*

**Im Vergleich mit den nächstliegenden Arbeiten.** Eine endliche optimale Zykluszeit ist für sich genommen nicht neu. Paneru und Kollegen maßen eine leistungsoptimale Zykluszeit in einer brownschen Informationsmaschine [330]. Panizon leitet optimale Messpläne als Funktion der Messkosten her [331], und Rolandi und Kollegen beschränken einen Zielkonflikt zwischen Energie, Zeit und Genauigkeit im thermodynamischen Rechnen [332]. Was Vorhersage 1 hinzufügt, ist die Quelle des inneren Optimums, ständige Kosten für das Halten eines Ziels gegen eine Drift, und seine Skalierung: $\tau^*$ fällt wie $\Lambda^{-1/2}$. Der Steigungstest ist der kennzeichnende Falsifikator.

**Was neu ist.** Die Landauer-Schranke in endlicher Zeit bepreist nur das Gedächtnis und fällt mit wachsendem $\tau$ gegen $k_B T\ln 2$ [29]. Dort ist das langsamste Zurücksetzen das billigste. Das Datenraten-Theorem bepreist nur das Halten, pro Sekunde (Abschnitt 4.1). Keines von beiden liefert ein inneres Optimum. Die Definition misst den ganzen Agenten, zählt nur bestätigte Bits und liest $\iota$ als Dichte auf der Joule-Achse. Dann macht das Halten eines Ziels Langsamkeit teuer, und die beste Aktzeit ist das geometrische Mittel aus der Sprungzeit $1/\langle A\rangle$ und der Driftzeit $1/\Lambda$, bis auf den Faktor $1/\sqrt{2}$. Die eigenen Kosten des Reglers gehen in der Arbeit von Ehrich, Still und Sivak auf dieselbe Weise in die Joule ein (Abschnitt 5.1).

**Wo man es prüft.** Eine kolloidale Rückkopplungsfalle erzeugt virtuelle Potentiale in Software und berechnet die Arbeit aus Trajektorien auf der $k_B T$-Skala (Abschnitt 3.2). Eine Koordinate durchläuft einen Ein-Bit-Aktzyklus in einem virtuellen Doppelmuldenpotential mit Rücksetzzeit $\tau$. Die andere wird am Scheitel einer virtuellen umgekehrten Mulde der Rate $\Lambda$ gehalten. Eine Einzelelektronenbox mit Ladungsdetektor führt denselben Aktzyklus aus, wobei jeder Sprung gezählt wird, sodass $\langle A\rangle$ gemessen wird (Abschnitt 3.2). Abschnitt 8.8 gibt das Protokoll an.

<div id="proposition-8-the-gated-ranking" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 8. Die torbedingte Rangordnung

**Rahmen.** Man fixiere eine Aufgabe $q$, ihr Prädikat $C(z)$ und ihre zulässige Fehlerrate $\delta$. Für jedes System $S$ ist $J^*_S(q) \in (0, \infty]$ die Joule bis zur korrekten Fertigstellung aus Abschnitt 1, mit $J^*_S(q) = \infty$, wenn keine Strategie von $S$ das Tor passiert. Man definiere $S_1 \preceq_q S_2$, wenn $J^*_{S_1}(q) \le J^*_{S_2}(q)$.

**Aussage.**

1. $\preceq_q$ ist eine totale Präordnung auf Systemen: reflexiv, transitiv und total. Die Rangordnung $\succ_q$ aus Abschnitt 2.3 ist ihr strikter Teil.
2. Jedes System, das das Tor passiert, steht im Rang über jedem System, das daran scheitert.
3. Jede Ablesung der mittleren Joule einer Strategie habe einen relativen Fehler von höchstens $\epsilon < 1$. Wenn $(1+\epsilon)\,J^*_{S_1}(q) < (1-\epsilon)\,J^*_{S_2}(q)$, dann steht $S_1$ unter jeder zulässigen Ablesung über $S_2$.
4. Das integrierte $\iota$ induziert diese Ordnung nicht. Es gibt Systeme mit $\iota_{S_1} > \iota_{S_2}$ und $S_2 \succ_q S_1$.

**Beweis.**

1. $\preceq_q$ ist der Rückzug der Totalordnung $\le$ auf $(0, \infty]$ entlang der Abbildung $S \mapsto J^*_S(q)$. Ein Rückzug einer Totalordnung ist eine totale Präordnung. Ihr strikter Teil ist $J^*_{S_1} < J^*_{S_2}$, die Rangordnung aus Abschnitt 2.3.
2. Jeder endliche Wert liegt unter $\infty$.
3. Die Ablesung jeder Strategie liegt in $[(1-\epsilon)J_\pi, (1+\epsilon)J_\pi]$, also liegt das Minimum der Ablesungen über die zulässigen Strategien in $[(1-\epsilon)J^*, (1+\epsilon)J^*]$. Dann gilt $\hat J^*_{S_1} \le (1+\epsilon)J^*_{S_1} < (1-\epsilon)J^*_{S_2} \le \hat J^*_{S_2}$.
4. $S_1$ unternehme pro Aufgabe einen Versuch zu 0.1 J, der mit Wahrscheinlichkeit 1/2 gelingt, und wiederhole nie. $S_2$ unternehme einen Versuch zu 1 J, der immer gelingt. Jedes Gelingen schreibt $b$ Bits gut. Dann ist $\iota_{S_1} = (b/2)/0.1 = 5b$ Bits pro Joule und $\iota_{S_2} = b$ Bits pro Joule. Für jedes $\delta < 1/2$ erfüllt $S_1$ das Tor nie, also ist $J^*_{S_1} = \infty$, während $J^*_{S_2} = 1$ J. $\blacksquare$

**Lesart.** Teil 4 ist der Mechanismus von R-F6 in Abschnitt 8.11: Billige Fehlschläge erhöhen das integrierte $\iota$ und lassen $J^*$ unverändert oder unendlich. Deshalb wird $\iota$ innerhalb eines Laufs als Dichte gelesen, und $J^*$ ist die Rangordnung über Systeme hinweg. Teil 3 erledigt P6 bis auf ein validiertes $\epsilon$ für jedes Messgerät.

<div id="proposition-9-when-cheapest-first-is-optimal" class="anchor-alias" aria-hidden="true"></div>

#### Proposition 9. Wann das Günstigste zuerst optimal ist

**Rahmen.** Eine Aufgabe hat die Gänge $g_1, \dots, g_n$. Ein Versuch mit Gang $g_i$ kostet $c_i > 0$ Joule, voll bezahlt, und erfüllt $C(z)$ mit Wahrscheinlichkeit $p_i$. Eine Strategie probiert die Gänge in einer Reihenfolge, hält beim ersten Gelingen an und lehnt nach dem letzten ab. Zwei Strukturen werden behandelt. Unabhängig: Das Gelingen verschiedener Gänge sind unabhängige Ereignisse. Verschachtelt: Gelingt $g_i$, so gelingt jeder spätere Gang, mit Erfolgswahrscheinlichkeiten $q_1 \le \dots \le q_n$.

**Aussage.**

1. Unabhängige Gänge. Die erwarteten Joule einer Reihenfolge sind am kleinsten, wenn die Gänge in absteigender Reihenfolge von $p_i/c_i$ probiert werden. Das Günstigste zuerst ist genau dann optimal, wenn die Reihenfolge steigender Kosten auch eine Reihenfolge fallender $p_i/c_i$ ist.
2. Verschachtelte Gänge, zwei davon, wobei der schwere Gang ausreicht ($q_H = 1$). Den leichten Gang zuerst zu probieren, senkt die erwarteten Joule genau dann, wenn $q_L\,c_H > c_L$.
3. Budget. Unter einem harten Budget $B$ mit $c_H \le B < c_L + c_H$ schließt „leicht zuerst“ die Aufgabe mit Wahrscheinlichkeit $q_L$ ab. „Nur schwer“ schließt sie mit Wahrscheinlichkeit 1 ab.

**Beweis.**

1. Die erwarteten Joule einer Reihenfolge $\sigma$ sind $\sum_k c_{\sigma(k)} \prod_{j<k}(1 - p_{\sigma(j)})$. Man vertausche zwei benachbarte Gänge $i$ und dann $j$, die auf ein Präfix mit Überlebenswahrscheinlichkeit $P$ folgen. Ihr Beitrag ändert sich von $P[c_i + (1-p_i)c_j]$ zu $P[c_j + (1-p_j)c_i]$, und sonst ändert sich nichts. Also ist $i$ zuerst genau dann nicht schlechter, wenn $p_i c_j \ge p_j c_i$, das heißt $p_i/c_i \ge p_j/c_j$. Jede nicht nach diesem Verhältnis sortierte Reihenfolge hat ein benachbartes Paar in falscher Reihenfolge, und dessen Vertauschung erhöht die erwarteten Joule nicht. Endlich viele Vertauschungen sortieren die Reihenfolge. Das ist die Verhältnisregel von Simon und Kadane für die Suche mit Alles-oder-nichts-Lösungen [318].
2. „Leicht zuerst“ kostet $c_L + (1-q_L)\,c_H$, weil der schwere Gang nur läuft, wenn der leichte scheitert, und dann gelingt. „Nur schwer“ kostet $c_H$. Das Erste ist genau dann kleiner, wenn $c_L < q_L\,c_H$.
3. Ein gescheiterter leichter Versuch lässt $B - c_L < c_H$ übrig, also kann der schwere Gang nicht laufen. $\blacksquare$

**Lesart.** Die feste Kaskade, das günstigste ausreichende zuerst in fester Reihenfolge, ist optimal, wenn günstige Gänge oft genug gelingen, um ihre Fehlschläge zu bezahlen: $q_L c_H > c_L$ bei jedem Schritt einer verschachtelten Kaskade, oder steigende Kosten bei fallendem $p/c$ unter unabhängigen Gängen. Wenn die Bedingung verletzt ist, gewinnt der direkte Weg zum schwereren Gang, und unter einem bindenden Budget kann er der einzige Weg zum Abschluss sein. Das ist der Mechanismus des Selektorergebnisses in Abschnitt 8.11. Der σ-Gesetz-Selektor schätzt das Verhältnis mit kalibrierten Erfolgswahrscheinlichkeiten. Er ist eine Regel des Rechenwerts mit Joule als Kosten, im Sinne von Russell und Wefald sowie von Horvitz (Abschnitt 5.1). Er hält an, wenn der nächste Akt seine Joule nicht mehr bezahlt. Beide Regeln halten an der Untergrenze an, jenseits derer mehr Joule keinen überprüfbaren Fortschritt kaufen, also sind beide Instanzen von Mixture of Limits. P7 (Abschnitt 7.1) nennt, was offen bleibt: eine Regret-Schranke, wenn Erfolgswahrscheinlichkeiten geschätzt werden oder die Hinlänglichkeit nicht monoton ist, und der verschachtelte Fall mit mehr als zwei Gängen, der ein dynamisches Programm über aufsteigende Teilfolgen von Gängen ist.

<div id="24-where-the-studies-sit" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Wo die Studien stehen

- **Mixture of Limits** ist der Optimumsoperator. Der günstigste ausreichende Gang ist das Argmin über die Joule. Es ist eine Philosophie, keine feste Reihenfolge: Die Ausgaben enden am Plateau, wo mehr Verschwendung ist.
- **Notational Intelligence** ist der Beleg. Er trägt $R^*$, $R$, $m$ und $J$ für jeden Akt.

Beide werden im Begleitpapier [Gemessene Commit-Tore](/papers/gates/) entwickelt. Die Produktplatzierung ist nicht Teil dieses Physikpapiers. Sie steht im [Whitepaper zu Metabolic Intelligence](/products/mei/#where-the-products-sit).

<div id="3-layer-1-the-universal-law-of-agency" class="anchor-alias" aria-hidden="true"></div>

<div id="3-layer-1-the-proposed-universal-law-of-agency-a-definition-plus-a-gate" class="anchor-alias" aria-hidden="true"></div>

## 3. Schicht 1. Das vorgeschlagene Universelle Gesetz der Handlungsfähigkeit: eine Definition plus ein Tor

Die Definition hat vier Klauseln: eine vor dem Akt festgelegte Vorhersage, Kopplung an die Welt durch Intervention, vom System getragene Konsequenz und eine physikalische Untergrenze in Joule mit Ablehnung auf einen Beleg.

<div id="30-objections-to-the-floor" class="anchor-alias" aria-hidden="true"></div>

### 3.0 Einwände gegen die Untergrenze

Die hier verwendete Untergrenze ist umstritten, und die Annahmen (R1) bis (R4) von Proposition 1 sind der Ort, an dem die Einwände beantwortet werden. Norton argumentiert, dass Landauers Prinzip nur für Protokolle mit einem thermodynamisch irreversiblen Schritt gilt [326]. Maroney und Sagawa trennen logische von thermodynamischer Irreversibilität: $k_B T\ln 2$ bepreist die Entropieänderung eines Gedächtnisses, nicht ein Bit als solches [327, 328]. López-Suárez, Neri und Gammaitoni betrieben ein irreversibles Logikgatter unterhalb von $k_B T$ [329]. Wolpert und Kollegen argumentieren, dass die Kosten realer Computer von Fehlanpassung, Modularität und Taktung dominiert werden statt von Löschung [320]. Jeder Einwand verengt die Behauptung, statt sie umzukehren. Proposition 1 ist nur für einen Datensatz formuliert, der (R1) bis (R4) erfüllt, ein Zurücksetzen in einen festen Zustand mit energiegleichen Zuständen und ohne geteilte Wechselwirkungsenergie, und das ist der Fall, in dem die Schranke gilt; die Untergrenze ist eine untere Schranke, und jeder bestätigte Akt der Läufe in Abschnitt 8.11, den das Messgerät auflöste, liegt mehr als 14 Größenordnungen darüber. K5 hat einen ähnlichen Geltungsbereich: Jordan zeigt, dass die Margolus-Levitin-Schranke die Rechenrate ohne eine Annahme über die Informationsdichte nicht durch die Energie begrenzt [324], daher wird K5 als Schranke für orthogonale Zustandsänderungen gelesen, nicht für die Taktfrequenz.

<div id="31-proven" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Bewiesen

**Information hat einen Preis.** Landauer zeigte, dass eine logisch irreversible Operation mindestens $k_B T \ln 2$ pro Bit dissipiert [6]. Das ist die Untergrenze unter Klausel 4. Bennett baute eine reversible Turingmaschine und zeigte, dass nur das Löschen kosten muss [35]. Die unvermeidlichen Kosten der Handlungsfähigkeit liegen beim Zurücksetzen des Akzeptors, nicht beim Denken. Bennett löste dann den maxwellschen Dämon über die Kosten des Löschens des Dämonengedächtnisses auf [7]. Der Dämon ist ein minimaler Agent. Seine Bilanz schließt erst, wenn sein Gedächtnis zurückgesetzt ist. Das ist Klausel 3 plus Klausel 4.

**Rückkopplung wird durch Information bepreist.** Sagawa und Ueda bewiesen, dass mit Rückkopplung die extrahierbare Arbeit durch $-\Delta F + k_B T I$ beschränkt ist [3]. Der Wert des Handelns auf eine Messung hin ist durch die Information gedeckelt, die die Messung trägt. Sie bewiesen, dass Messarbeit plus Löscharbeit mindestens $k_B T I$ beträgt [5]. Der volle Zyklus aus Vorhersagen, Vergleichen und Zurücksetzen ist in Joule bepreist. Sie leiteten eine exakte Jarzynski-Gleichung unter Rückkopplung her [4] und ein Fluktuationstheorem mit Informationsaustausch zwischen Teilsystemen [36]. Kopplung ist eine Korrelation, die in den zweiten Hauptsatz eingeht. Hartle, Wolpert, Stier, Kempes und Manzano bepreisten Rückkopplung mit verrauschten Messungen, begrenztem Gedächtnis und einem begrenzten Repertoire an Protokollen. Gegenüber zufälligem Handeln als Referenz kann der Nutzen der Rückkopplung die gewonnene Information um Größenordnungen übersteigen [37]. Die Bits beschränken die Arbeit gegenüber der freien Energie. Der Wert gegenüber einer Referenz wird am Messgerät abgelesen.

**Entropie wird in Joule umgerechnet.** Esposito und Van den Broeck leiteten $k_B T \Sigma = W - \Delta F_{\mathrm{neq}}$ für ein isothermes getriebenes System her [24]. Jede kinematische Schranke in Schicht 2 wird durch diese Identität zu einer Joule-Schranke. Horodecki und Oppenheim bewiesen Arbeitskosten für Einzelschüsse auf kleiner Skala [38]. Akte der Handlungsfähigkeit sind Einzelschüsse. Die Standardübersichten geben den gesicherten Stand wieder: Information ist eine thermodynamische Ressource mit einem Preis [39, 40].

**Regelung braucht Kopplung.** Conant und Ashby bewiesen, dass ein guter Regler ein Modell des Systems sein muss, das er regelt [41]. Ein System, das gut regelt, trägt bereits eine Vorhersage. Touchette und Lloyd bewiesen, dass die Entropie, die ein Regler entfernt, durch seine Transinformation mit dem System beschränkt ist [32, 33]. Kopplung ist die Währung der Regelung. Geschlossene Regelung, die auf einen Vergleich hin handelt, ist das, was die Definition verlangt. Pearls Do-Kalkül liefert den Interventionsoperator und die Bedingungen, unter denen seine Wirkungen identifizierbar sind [1]. Klausel 2 ist in diesem Operator geschrieben. Everitt und Kollegen klassifizierten, wie ein Agent seine eigene Belohnung oder seine Eingaben manipulieren kann [2]. Die Kopplung muss an die Welt bestehen, nicht an den eigenen Sensor des Agenten. Richens und Everitt bewiesen, dass jeder Agent, der unter einer großen Menge von Verteilungsverschiebungen eine Regret-Schranke einhält, ein approximatives Kausalmodell des Prozesses gelernt hat, der seine Daten erzeugt [42]. Richens, Abel, Bellot und Everitt bewiesen, dass jeder Agent, der auf mehrschrittige zielgerichtete Aufgaben generalisiert, ein prädiktives Modell seiner Umgebung gelernt hat und dass sich das Modell aus der Strategie extrahieren lässt [43]. Ein leistungsfähiger Agent trägt eine Vorhersage. Das ist Klausel 1, bewiesen für moderne Agenten.

**Information fließt im Inneren des Agenten.** Horowitz und Esposito zeigten, dass der Informationsfluss zwischen Teilsystemen in den zweiten Hauptsatz jedes Teilsystems eingeht [44]. Kopplung wird zu einer Rate. Ito und Sagawa bewiesen einen zweiten Hauptsatz für beliebige kausale Netze mit Transferentropie [45]. Vorhersage, Akt und Ergebnis sind Knoten in einem solchen Netz. Hartich, Barato und Seifert verknüpften Transferentropie, Lernrate und Dissipation [46]. Allahverdyan, Janzing und Mahler beschränkten die Effizienz des Informationsflusses zwischen gekoppelten Systemen [47]. Esposito und Schaller zeigten, dass Rückkopplung, die nur Barrieren verändert, dennoch in die Entropiebilanz eingeht [48]. Ein rein informationeller Akt steht im Joule-Hauptbuch.

**Autonome Dämonen.** Mandal und Jarzynski lösten einen Dämon, der eine Masse hebt, indem er Bits auf ein Band schreibt [49]. Er hat keinen äußeren Bediener, und das Gedächtnis bezahlt seine Arbeit. Boyd, Mandal und Crutchfield beschränkten die Arbeit solcher Ratschen durch die Entropieraten ihrer Ein- und Ausgabebänder [50]. Sie zeigten, dass modulare Entwürfe Dissipation oberhalb von Landauer zahlen [51]. Wie ein Agent gebaut ist, verändert seine Untergrenze. Wolpert und Kolchinsky berechneten die zusätzliche Entropieproduktion, die ein Gatter innerhalb einer Schaltung zahlt, festgelegt durch die Topologie der Schaltung [52]. Die Verdrahtung ist Teil der Untergrenze.

**Vorhersagequalität hat einen Joule-Preis.** Kolchinsky und Wolpert bewiesen, dass ein für eine Eingabeverteilung abgestimmter Prozess bei jeder anderen zusätzlich dissipiert, um einen Term der relativen Entropie [53]. Still, Sivak, Bell und Crooks zeigten, dass Gedächtnis, das nicht vorhersagt, Dissipation kostet [54]. Nur das zu behalten, was vorhersagt, ist der günstige Entwurf. Kolchinsky und Wolpert definierten semantische Information als Information, die für ein System kausal notwendig ist, um sich außerhalb des Gleichgewichts zu halten, mit einem thermodynamischen Wert [55]. Sie ist die nächstliegende bestehende Darstellung mit Joule. Sie endet vor der Kinematik und vor einem Intelligenzoperator. Ortega und Braun leiteten beschränkt rationale Entscheidungen aus einem Prinzip der freien Energie mit Informationskosten her [56]. Kolchinsky und Wolpert beschränkten die Wärme universeller Berechnung durch die Programmkomplexität [57]. Kolchinsky und Wolpert zeigten, dass Einschränkungen der verfügbaren Protokolle die extrahierbare Arbeit und den Informationswert begrenzen [58]. Manzano und Kollegen leiteten Fluktuationsrelationen und dem zweiten Hauptsatz ähnliche Ungleichungen für Berechnungen her, die zu zufälligen Zeiten anhalten [59]. Ein Lauf, der anhält, wenn sein Prädikat erfüllt ist, ist eine solche Berechnung.

**Kopplung und Grenze beruhen auf Theoremen.** Ay und Polani definierten kausalen Informationsfluss über Interventionen [8]. Transferentropie misst diesen Fluss nicht, gezeigt an Beispielen [11]. Die Bedingung der Markow-Decke gilt nur in einem engen Parameterbereich, durch Herleitung [15], und ihre gebräuchlichen Definitionen unterscheiden sich, durch Gegenbeispiel [16]. Jeder bipartite stochastische Prozess hat eine kausale Decke, durch Theorem [22]. Die Definitionen 1 und 2 stehen auf diesen Ergebnissen.

<div id="32-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Nachgewiesen

**Landauers Untergrenze, gemessen.** Eine Kolloidkugel in einer optischen Doppelmulde näherte sich bei verlangsamter Löschung einer mittleren Wärme von $k_B T \ln 2$ [60]. Eine Rückkopplungsfalle maß dieselbe Annäherung mit hoher Präzision und Zusatzkosten bei kurzen Zykluszeiten [61]. Die Untergrenze steigt, wenn der Akt schnell ist. Das ist ein Effekt der Schicht 2, gesehen in einem Experiment der Schicht 1. Eine adiabatische elektronische Schaltung zeigte die Landauer-Kosten für irreversiblen Betrieb und eine Dissipation unter $k_B T$ für reversiblen Betrieb [62]. Die Untergrenze bindet das Zurücksetzen, nicht die Logik. Nanomagnetische Speicherbits zeigten die Untergrenze in Speicherhardware [63]. Löschung mit nahezu null Arbeit tritt auf, wenn die Bilanz der freien Energie vollständig ist [64]. Die Untergrenze betrifft die Gesamtentropie, also muss der Beleg die vollständige Bilanz tragen. Für die Entropie, die in die Schranke eingeht, wurde die Gibbs-Shannon-Form gemessen [65]. Ein einzelnes gefangenes Ion zeigte die Quantenuntergrenze [66]. Die Untergrenze gilt auf jedem geprüften Substrat. Ein unterdämpfter mikromechanischer Oszillator erreichte die Untergrenze bei hoher Geschwindigkeit [67]. Ein Quantenpunkt löschte Bits mit minimaler Dissipation für eine gegebene Dauer, mit aus der thermodynamischen Länge entworfenen Protokollen [68].

**Rückkopplungsagenten verwandeln Information in Arbeit.** Ein Kolloid auf einem Wendeltreppenpotential gewann freie Energie über die geleistete Arbeit hinaus, bezahlt durch Information, und bestätigte die verallgemeinerte Jarzynski-Gleichung [69]. Das ist die erste direkte Beobachtung eines Aktes, dessen Wert durch eine vor ihm durchgeführte Messung festgelegt wird. Eine Einzelelektronenbox extrahierte Arbeit nahe $k_B T \ln 2$ pro Bit [70] und maß das Fluktuationstheorem mit Transinformation [71]. Ein autonomer Dämon auf dem Chip kühlte ein System mit Information, während seine eigene Erwärmung gemessen wurde [72]. Die Kosten des Agenten wurden neben seiner Wirkung gemessen.

Quantenagenten gehorchen denselben Schranken. NMR an molekularen Spins verringerte die Entropieproduktion durch Rückkopplung, innerhalb der Informationsschranke [73], und wandelte Information an der Untergrenze in Energie um [74]. Supraleitende Schaltungen verfolgten das Gedächtnis eines Dämons während der Rückkopplung [75], verifizierten das verallgemeinerte integrale Fluktuationstheorem [76] und maßen die während der Rückkopplung gewonnene und verlorene Information [77]. Kopplung zerfällt, also muss der Beleg sie zum Zeitpunkt des Aktes festhalten. Kalte Atome in einem dreidimensionalen optischen Gitter wurden durch Messung sortiert [78]. Linpeng und Kollegen maßen die energetischen Kosten der Quantenmessung mit quantenhaftem, kohärentem und thermischem Licht in einem Aufbau der Schaltkreis-Quantenelektrodynamik. Einzelphotonenlicht kostete am wenigsten Energie pro Einheit gewonnener Information [79]. Die Messung, die einen Datensatz schreibt, hat einen gemessenen Preis.

Klassische Maschinen maßen den Preis im vollen Maßstab. Eine Maschine mit optischer Pinzette wandelte Information an der theoretischen Grenze in Arbeit um [80]. Eine Kolloidmaschine extrahierte Arbeit, die von zeitlichen Korrelationen in ihrer Eingabe abhängt [81]. Eine DNA-Haarnadel unter kontinuierlicher Überwachung lieferte mehr als $k_B T \ln 2$ pro Zyklus, wenn viele Messungen pro Zyklus stattfanden, im Einklang mit dem Informationsgehalt [82]. Ein levitiertes Mikroteilchen mit verzögerter Rückkopplung gehorchte über zwei Dekaden der Verzögerung einem verallgemeinerten zweiten Hauptsatz, und bei großer Verzögerung versagte die Rückkopplung [83]. Ein später Akt ist ein schwächerer Akt. Maschinen mit Rückkopplungsfalle maximierten Leistung und Geschwindigkeit [84], nutzten verrauschte Messungen optimal [85] und ernteten ein Nichtgleichgewichtsbad [86]. Ein Quantenpunkt verknüpfte Arbeitsfluktuationen mit Dissipation während der Umwandlung von Information in Arbeit [87]. Ein gefangenes Ion verifizierte Fluktuationstheoreme, die die eigene Dissipation des Dämons einschließen [88], nach der Theorie von Zeng und Wang [89].

**Agenten nach der Theorie funktioneller Systeme, gebaut und betrieben.** Ein simulierter Fadenwurm mit einem Akzeptor der Handlungsergebnisse lernte Fortbewegung und Chemotaxis [90]. Ein physischer mobiler Roboter führte denselben Regler nach der Theorie funktioneller Systeme aus [91]. Die Klauseln 1 und 3 laufen in Software und an einem Körper. Keiner von beiden misst Joule.

<div id="33-opinion" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Meinung

**Zweckgerichtete Systeme und Antizipation.** Rosenblueth, Wiener und Bigelow definierten zweckgerichtetes Verhalten über negative Rückkopplung auf ein Ziel hin [92]. Es hat keinen Energieterm. Anokhins funktionelles System hat afferente Synthese, Entscheidung, einen vor dem Akt festgelegten Akzeptor der Handlungsergebnisse, Handlung und Vergleich [93, 94]. Das sind die Klauseln 1 und 3 in ihrer ersten systematischen Form, gebaut auf Tierexperimenten. Sudakov formulierte das Ergebnis als systembildenden Faktor [95]. Die Vorhersageklausel ist das Organisationsprinzip. Shvyrkov zeigte anhand von Einzelneuronenableitungen, dass das Ziel die neuronale Aktivität organisiert [96]. Rosen definierte ein antizipatorisches System als eines, das ein prädiktives Modell seiner selbst und seiner Welt enthält und auf die Vorhersage hin handelt [97]. Keines davon setzt eine Joule-Untergrenze. Sterling definiert Allostase als Regulation durch Vorhersage [98]. Die Physiologie stellt die Vorhersage vor den Akt. Virgo, Biehl und McGregor gaben Bedingungen an, unter denen die Zustände eines Systems als nach dem Satz von Bayes aktualisierte Überzeugungen gelesen werden können [99]. Biehl und Virgo nennen ein System einen Agenten, wenn es so gelesen werden kann, als löse es ein POMDP (partially observable Markov decision process) [100]. Beides sind formale Definitionen. Klausel 1 verlangt weniger und legt mehr fest: eine Vorlage, festgelegt bei $t_0$, gehasht auf dem Beleg.

**Autonomie und Organisation.** Maturana und Varela definierten das Lebendige durch Selbsterzeugung [101]. Kauffman setzte einen thermodynamischen Arbeitszyklus in die Definition eines autonomen Agenten [102]. Sie hat keine Vorhersageklausel. Di Paolo machte Adaptivität, die Regulation der eigenen Lebensfähigkeit, zur Bedingung der Sinnstiftung [103]. Das ist Klausel 3. Barandiaran und Moreno schlugen ein minimales Kriterium für kognitive Organisation vor und begründeten adaptive Regulation im Stoffwechsel [104, 105]. Barandiaran, Di Paolo und Rohde definierten Handlungsfähigkeit durch Individualität, Interaktionsasymmetrie und Normativität [106]. Ruiz-Mirazo, Moreno und Mossio fassten Autonomie als sich selbst erhaltende metabolische Organisation [107, 108]. Montévil und Mossio beschrieben Organismen als Schließungen von Zwangsbedingungen auf thermodynamischen Flüssen [109]. Das ist in dieser Schule das, was den Joule am nächsten kommt. Aguilera und Barandiaran bauten ein minimales Modell autonomer Handlungsfähigkeit in der stochastischen Thermodynamik [110]. Die Autonomietradition bewegt sich auf das Joule zu. Barandiaran und Almendros wandten Individualität, Normativität und Interaktionsasymmetrie auf große Sprachmodelle an. Ein Modell verfehlt die ersten beiden und teilweise die dritte [111]. Die Definition wendet ihr Tor pro Akt an: Ein Modellaufruf ist ein Akt, wenn sein Beleg $R^*$, $m$ und $J$ trägt. Levins TAME (Technological Approach to Mind Everywhere) behandelt Handlungsfähigkeit als abgestuft und auf jeder Skala experimentell prüfbar [112]. Die Definition hält das Tor pro Akt binär und legt die Abstufung in $X$.

**Freie Energie und die Physik der Handlungsfähigkeit.** Friston schlägt vor, dass Agenten die variationelle freie Energie minimieren [113, 114]. Diese freie Energie ist informationell, nicht in Joule, und jedes beschränkte System qualifiziert sich, sodass sie keine Untergrenze setzt. Rovelli erklärt Handlungsfähigkeit über den Entropiegradienten [115]. Handlungsfähigkeit ist im Kern thermodynamisch. Jaeger argumentiert, dass Handlungsfähigkeit Selbstherstellung erfordert und dass sie der heutigen künstlichen Intelligenz fehlt [116]. Das ist die Forderung nach einem Tor vor jeder Intelligenzbehauptung. Azadi verknüpft Handlungsfähigkeit mit rechnerischer Irreduzibilität [117]. Wissner-Gross und Freer schlagen eine Kraft in Richtung künftiger Pfadvielfalt vor [118]. Ihre kausale Temperatur ist keine Badtemperatur, also sind ihre Einheiten keine Joule. Kappens Kommentar kritisiert sie [119]. Fields, Goldstein und Sandved-Smith trennen bei Agenten der aktiven Inferenz die thermodynamische freie Energie, in Joule, von der variationellen freien Energie und setzen beide in Beziehung [120]. Nur die Joule-Größe geht in K1 ein. Bruineberg und Kollegen trennen die Markow-Decke als Werkzeug der Inferenz von der Decke als physikalischer Grenze [17]. Definition 2 nimmt die Grenze aus der Definition. Bartlett und Kollegen machen zielgerichtete Informationsverarbeitung, gemessen durch semantische Information, zum kennzeichnenden Merkmal lebender Systeme [121]. Das sind die Klauseln 2 und 3 als Kriterium des Lebens.

<div id="4-layer-2-the-kinematic-laws-of-agency" class="anchor-alias" aria-hidden="true"></div>

<div id="4-layer-2-the-kinematic-bounds-of-agency" class="anchor-alias" aria-hidden="true"></div>

## 4. Schicht 2. Die kinematischen Schranken der Handlungsfähigkeit

Sobald ein Akt zulässig ist, beschränkt die Physik, wie schnell sich Handlungsfähigkeit pro Sekunde und pro Joule bewegt und was Präzision und Geschwindigkeit kosten. Die Schranken bilden vier Familien: Geschwindigkeitsgrenzen, die TUR, Kosten in endlicher Zeit und Ratenobergrenzen.

<div id="41-proven" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Bewiesen

**Geschwindigkeitsgrenzen.** Shiraishi, Funo und Saito bewiesen die klassische Geschwindigkeitsgrenze aus Abschnitt 2.2 [23]. Die Zustandsverteilung des Agenten in der Zeit $\tau$ um einen Abstand $L$ zu bewegen, kostet Entropie und damit Joule. Die Schranke erstreckt sich auf offene Quantensysteme [122] und auf starke Kopplung mit allgemeinen Umgebungen [123]. Vo, Van Vu und Hasegawa leiteten die Geschwindigkeitsgrenze und die TUR aus einer einzigen Ungleichung her [124]. Falasco und Esposito beschränkten die Zeit bis zum Abschluss eines Übergangs durch die aufgewendete Dissipation [125]. Ito beschränkte die informationsgeometrische Geschwindigkeit einer Verteilung durch die Entropieproduktion [126]. Ito und Dechant beschränkten die Änderungsrate jeder Observable durch Fisher-Information und Dissipation [127]. Nakazato und Ito beschränkten die Entropieproduktion durch den zurückgelegten Wasserstein-Abstand [128]. Dechant, Sasa und Ito zerlegten die Entropieproduktion in den Teil, der das System bewegt, und den Teil, der es in Gang hält [129]. Van Vu und Saito vereinheitlichten TUR, minimale Dissipation und Geschwindigkeitsgrenzen über optimalen Transport [130]. Nagayama, Yoshimura und Ito leiteten eine Familie von Geschwindigkeitsgrenzen her, indiziert durch verallgemeinerte Mittelwerte der Aktivität [131]. Yoshimura und Ito bewiesen die TUR und die Geschwindigkeitsgrenze in deterministischen chemischen Reaktionsnetzen [132]. Aurell, Mejía-Monasterio und Muratore-Ginanneschi lösten die minimale Dissipation in endlicher Zeit als Problem des optimalen Transports [133]. Die kinematischen Schranken bilden eine Familie. Der günstigste Weg, den Zustand eines Agenten zu bewegen, ist eine Transportabbildung. Hasegawa leitete die Geschwindigkeitsgrenze, die TUR und das Heisenberg-Prinzip aus einer einzigen Volumen-Rand-Korrespondenz her [134]. Van Vu und Hasegawa beschränkten die irreversible Entropieproduktion durch einen modifizierten Wasserstein-Abstand in klassischen und quantenmechanischen Markow-Systemen [135]. Delvenne und Falasco beschränkten die Entropieproduktion durch die Statistik kinetischer Observablen [136].

**Präzision kostet Dissipation.** Barato und Seifert formulierten die TUR, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma$ [25]. Ein zuverlässiger Agent bezahlt für seine Zuverlässigkeit. Aus $2/\epsilon^2$ bei $\epsilon = 0.01$ folgt, dass eine Präzision von 1% mindestens 20,000 $k_B T$ kostet [137]. Gingrich, Horowitz, Perunov und England bewiesen die TUR für alle stationären Ströme [26]. Horowitz und Gingrich bewiesen sie für endliche Beobachtungszeiten [138], und solche haben Agenten. Weitere Ergebnisse beschränken die volle Verteilung der Fluktuationen [139], decken diskrete Zeitschritte ab [140], erweitern die TUR überall dorthin, wo ein Fluktuationstheorem gilt [141], und decken Langevin-Dynamik, unterdämpfte Bewegung und Geschwindigkeitsrückkopplung ab [142, 143, 144]. Korrelationen zwischen Strömen verschärfen die Schranken [145]. Potts und Samuelsson zeigten, dass jede Fluktuationsrelation eine TUR impliziert, auch mit Messung und Rückkopplung [28]. Das ist die Präzisionsschranke für Agenten. Eine Übersicht gibt den Stand des Feldes wieder [146]. Barato und Seifert bepreisten die Präzision einer Uhr [147]. Salazar beschränkte die Entropieproduktion durch Information aus dem detaillierten Fluktuationstheorem [148]. Landi und Paternostro gaben einen Überblick über die Entropieproduktion vom Klassischen bis zum Quantenmechanischen [149]. Rückkopplungsformen decken inzwischen die Fälle ab, denen Agenten begegnen. Van Vu und Hasegawa beschränkten Fluktuationen unter beliebigen Steuerprotokollen durch die Entropieproduktion und einen kinetischen Term [150]. Tanogami, Van Vu und Saito beschränkten den Strom eines Teilsystems durch seine eigene Entropieproduktion und den Informationsfluss zwischen ihm und seinem Partner [151]. Kumasaki, Tojo, Sagawa und Funo leiteten eine TUR für Rückkopplungskühlung her [152]. Honma und Van Vu leiteten eine TUR in endlicher Zeit für offene Quantensysteme unter kontinuierlicher Überwachung und markowscher Rückkopplung her, mit Quanten-Transinformation neben der Entropieproduktion [153]. Für Zählobservablen beschränkte Garrahan die Fluktuationen durch die dynamische Aktivität und gab die passenden Schranken für Erstpassagezeiten an [34]. Gingrich und Horowitz leiteten die konjugierte Relation für die Erstpassagezeit bis zur Akkumulation eines Nettostroms her [154]. Proposition 3 wendet diese Ergebnisse auf bestätigte Handlungsfähigkeit an.

**Kosten in endlicher Zeit.** Schmiedl und Seifert fanden optimale Protokolle in endlicher Zeit, mit Sprüngen an den Enden [155]. Der optimale Akt bei endlicher Geschwindigkeit ist nicht der langsame Akt. Sivak und Crooks beschränkten die Überschussarbeit durch die quadrierte thermodynamische Länge geteilt durch die Dauer [30]. Proesmans, Ehrich und Bechhoefer fanden die minimalen Kosten, ein Bit in der Zeit $\tau$ zu löschen [29, 156]. Die Untergrenze der Schicht 1 wird zu einer Kurve der Schicht 2. Zhen und Kollegen formulierten eine universelle Schranke in endlicher Zeit für die Rücksetzenergie [157]. Geschwindigkeit und Wirkungsgrad stehen durch Theoreme im Zielkonflikt: Wirkungsgrad bei maximaler Leistung [158, 159], endliche Leistung, die den Carnot-Wirkungsgrad verbietet [160], ein Dreifachkonflikt zwischen Leistung, Wirkungsgrad und Konstanz [161] und eine universelle Einschränkung für Maschinen mit geringer Dissipation [162]. Tsirlin und Kollegen fanden die minimale Dissipation bei fester Rate [163]. Lee, Lee, Kwon und Park verschärften die Geschwindigkeitsgrenze für stark irreversible Prozesse und erhielten eine scharfe Landauer-Schranke in endlicher Zeit [164]. Van Vu und Saito leiteten das Quanten-Landauer-Prinzip in endlicher Zeit und die Rolle der Kohärenz darin her [165]. Rolandi und Perarnau-Llobet leiteten das Landauer-Prinzip in endlicher Zeit jenseits schwacher Kopplung her [166]. Kamijima, Funo und Sagawa leiteten die Zielkonflikte in endlicher Zeit zwischen Messung und Rückkopplung her [167]. Tkachenko zeigte für physikalische neuronale Netze, dass quasistatische Inferenz keine Arbeit braucht, während Inferenz bei endlicher Geschwindigkeit mindestens einen Transportabstand kostet (Preprint) [168]. Inferenz hat keine Untergrenze, die langsamen Betrieb übersteht. Das Zurücksetzen hat eine. Proposition 1 bepreist sie.

**Ein Ziel halten.** Tatikonda und Mitter [169] sowie Nair und Evans [170] bewiesen das Datenraten-Theorem: Ein instabiles lineares System zu halten, erfordert eine Kanalrate über der Summe der Logarithmen zur Basis 2 der Beträge seiner instabilen Eigenwerte. Nair, Fagnani, Zampieri und Evans gaben einen Überblick über das Feld [171]. Sandberg, Delvenne, Newton und Mitter fanden die maximale Arbeit, die ein kontinuierlich messender Dämon in endlicher Zeit extrahiert, und zeigten, dass jede Implementierung eine externe Energiequelle braucht [172]. Horowitz und Sandberg zeigten, dass die Informationsterme in Ungleichungen vom Typ des zweiten Hauptsatzes eine Hierarchie bilden, jeder davon die minimalen Kosten, diese Information durch eine eigene Messung zu gewinnen [173]. Proposition 2 macht aus der Bitzahl eine Joule-Untergrenze pro Schritt. Sie ist ein in Joule bepreistes Korollar des Datenraten-Theorems, kein neues Gesetz.

**Quantenrückkopplung und Messung.** Der zweite Hauptsatz mit Rückkopplung gilt für Quantensysteme [3]. Jacobs erweiterte ihn auf schwache Messungen [174]. Funo, Watanabe und Ueda leiteten integrale Fluktuationstheoreme unter Quantenmessung und Rückkopplung her [175]. Guryanova, Friis und Huber bewiesen, dass ideale projektive Messungen unendliche Ressourcen benötigen, und gaben die Energiekosten eines Zeigers an, der die Statistik des Systems reproduziert [176]. Danageozian, Wilde und Buscemi beschränkten die Messwärme der Fehleridentifikation durch den Groenewold-Informationsgewinn [177]. Diese bepreisen die Messung, die einen Datensatz schreibt. Proposition 4 hält die Untergrenze des Datensatzes selbst.

**Gruppen.** Wolpert leitete aus den Einschränkungen, von welchen Teilsystemen jedes abhängt, eine strikt positive untere Schranke für die minimale Entropieproduktionsrate wechselwirkender Teilsysteme her [178]. Tasnim und Wolpert erweiterten die Theorie auf Teilsysteme, die gemeinsam ihren Zustand ändern [179]. Wolpert setzte die Entropieproduktion eines ganzen Bayes-Netzes in Beziehung zur Präzision der Ströme in seinen Teilen [180]. Rolandi, Abiuso und Perarnau-Llobet zeigten, dass kollektive Protokolle die dissipierte Arbeit mit der Zahl der Mitglieder sublinear wachsen lassen können [181]. Fujimoto und Ito fanden mit einer spieltheoretischen Methode, dass die partiellen Entropieproduktionen wechselwirkender Teilsysteme gegeneinander abgewogen werden und dass die Summe am kleinsten ist, wenn die Teilsysteme die Last gleich teilen [182]. Proposition 7 setzt diese Joule mit den gekoppelten Bits der Gruppe zusammen.

**Ratenobergrenzen.** Margolus und Levitin beschränkten orthogonale Übergänge pro Sekunde durch die Energie [31]. Lloyd wandte die Grenze auf einen ganzen Computer an [183]. Deffner und Campbell gaben einen Überblick über die Familie der Quantengeschwindigkeitsgrenzen [184].

**Lebende Sensoren.** Energiedissipation, Anpassungsgeschwindigkeit und Genauigkeit sind bei der bakteriellen Chemotaxis aneinander gebunden [185]. Über die Umgebung zu lernen, erfordert Energie [186], und die Genauigkeit der Inferenz ist an die Dissipation gebunden [187]. Die Präzision der Wahrnehmung ist durch Rezeptoren, Zeit und Energie begrenzt, mit einer optimalen Aufteilung zwischen ihnen [188]. Keine Ressource kann übersprungen werden. Das passt zu Mixture of Limits. Löschung innerhalb der Anpassung hat Kosten [189]. Die pro dissipierter Energie gewonnene Information ist bei lebenden Sensoren die nächstliegende bestehende Größe zu $v_J$ [190, 191]. Das Kopieren von Information kostet Energie [192]. Das Schreiben des Belegs hat einen Preis. Genaue und synchronisierte biochemische Uhren kosten freie Energie [193, 194], ebenso das Verringern des Rauschens bei hoher Empfindlichkeit [195]. Ein System vom Gleichgewicht fernzuhalten, hat eine Mindestleistung [196]. Das sind die ständigen Kosten eines handlungsbereiten Agenten. Bryant und Machta beschränkten die Energie, ein Bit durch die physischen Kanäle einer Zelle zu senden, in $k_B T$ pro Bit, als Funktion von Größe, Abstand und Latenz, und fanden sie viele Größenordnungen über eins [197]. Tjalma und Kollegen zeigten, dass die Bits der Vergangenheit, die die Zukunft am besten vorhersagen, für zelluläre Netze unerschwinglich teuer sind [198].

**Durch Selektion gewonnene Information.** Auch Selektion schreibt Bits, und ihre Rate ist beschränkt. Kimura maß die Information, die natürliche Selektion in einem Genom anhäuft, über die Substitutionslast und schätzte mit den Lastwerten, die er als repräsentativ annahm, etwa 0.29 Bits pro Generation [341]. Worden beschränkte die Rate, mit der Selektion einem Genom Information hinzufügen kann, in Abhängigkeit von der pro Generation angewandten Selektion [342]. Hledík, Barton und Tkačik zeigten, dass in stochastischen Populationen die Rate durch die Populationsgröße mal die Kosten der Selektion beschränkt ist, über Wright-Fisher-, Moran- und Diffusionsmodelle hinweg [343]. Jede solche Schranke ist eine Rate pro Generation. Eine Generation verlängert sich, wenn ein Organismus größer wird, sodass ein Träger, der nur durch Selektion lernt, gekoppelte Bits pro Sekunde immer langsamer gewinnt. Nervensysteme schreiben Bits innerhalb eines Lebens, und kulturelle Aufzeichnungen schreiben sie über Lebenszeiten hinweg. Die Kinematik aus Abschnitt 2.2 gilt für jeden Träger. Was sich von einem Träger zum nächsten ändert, ist die Zeit pro geschriebenem Bit, und das ist der Grund, warum Handlungsfähigkeit von Genomen zu Gehirnen zu Werkzeugen wandert, wenn sich die Welt schneller ändert, als Generationen aufeinander folgen.

Abbildung 3 ordnet die drei Träger.

![Qualitatives Diagramm, das drei Träger gekoppelter Bits auf einer Achse der Schreibgeschwindigkeit pro Sekunde anordnet: das Genom, durch Selektion pro Generation, mit etwa 0.29 Bits pro Generation nach Kimura; das Gehirn, durch Lernen innerhalb eines Lebens; und Werkzeuge und Aufzeichnungen, durch Kultur über Lebenszeiten hinweg.](/figures/agency/carriers.svg)

*Abbildung 3. Wo gekoppelte Bits geschrieben werden. Qualitatives Diagramm; die einzige Zahl ist Kimuras Schätzung [341]. Schranken: Worden [342]; Hledík, Barton und Tkačik [343]. Eine [PNG-Kopie](/figures/agency/carriers.png) liegt vor.*

**Informationsraten ohne Joule.** Schreiber definierte die Transferentropie, gerichteten Informationsfluss pro Schritt [199]. Sie ist pro Zeit, nicht pro Joule, und hat kein Zulässigkeitstor. Tishby und Polani berechneten Information pro Schritt in einer Bellman-Rekursion [200]. Landauer rechnet diese Bits in Joule um. Stratonovich beschränkte den maximalen Gewinn aus einer gegebenen Informationsmenge [201]. Das ist eine Obergrenze für den Wert pro gekoppeltem Bit.

<div id="42-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Nachgewiesen

**Die TUR geprüft.** Ein NMR-Experiment mit zwei Qubits gehorchte verallgemeinerten TURs und verletzte die spezielle TUR dort, wo die Theorie es vorhersagt [202]. Eine Informationsmaschine mit optischer Pinzette verletzte die ursprüngliche TUR nahe dem maximalen Wirkungsgrad und gehorchte verallgemeinerten Schranken mit Transinformation [27]. Agenten brauchen die Rückkopplungsform. Eine Szilard-Maschine aus einem Quantenpunkt bestätigte dies unabhängig [203]. Leiter auf atomarer Skala untersuchten die TUR mit gemessenem Stromrauschen, der Physik jedes Chips [204]. Molekulare Motoren wurden nach Präzision pro Einheit Dissipation bewertet [205]. Beobachtete Stromfluktuationen beschränken die Dissipation nach unten [206]. Ein Beleg der Fluktuationen ist ein Messgerät, das eine untere Schranke für die Joule liefert.

**Geschwindigkeitsgrenzen und Kosten in endlicher Zeit geprüft.** Einzelne Atome in einem optischen Gitter zeigten die Mandelstam-Tamm- und die Margolus-Levitin-Schranke und den Übergang zwischen ihnen [207]. Die Ratenobergrenze ist gemessen. Ein gefangenes Kolloid maß Zielkonflikte zwischen Zeit und Entropie für schnelle thermische Übergänge [208]. Brownsche Teilchen, getrieben durch Protokolle des optimalen Transports, sättigten die Schranke für minimale Dissipation in endlicher Zeit [209]. Das kinematische Optimum ist erreichbar. Eine Rückkopplungsfalle maß eine brownsche Maschine mit zwei Kräften an Schranken der linearen Antwort [210]. Ein photonisches Experiment prüfte geometrische Schranken für die Entropieproduktion [211]. Dago und Bellon maßen die Löschung in einem Doppelmuldenspeicher bei hoher Geschwindigkeit und führten den Mehraufwand über Landauers Schranke auf seine Quellen zurück [212].

**Lebende Sensoren gemessen.** Mattingly, Kamino, Machta und Emonet maßen die Rate, mit der E. coli während der Chemotaxis Information gewinnt, und zeigten, dass die Zellen Gradienten nahe der durch diese Rate gesetzten Grenze hinaufsteigen [213]. Information begrenzt Verhalten, gemessen.

**Wärmekraftmaschinen bei endlicher Geschwindigkeit.** Ein einzelnes Kolloid betrieb eine Stirlingmaschine im Mikrometermaßstab [214]. Eine gefangene Kugel durchlief einen brownschen Carnot-Zyklus, wobei der Wirkungsgrad bei maximaler Leistung gemessen wurde [215]. Die Energiekosten der Wahl zwischen zwei Optionen wurden gemessen [216]. Das ist der kleinste Akt. Eine Kolloidmaschine lief auf einem aktiven Bakterienbad [217], und gezielt erzeugtes Rauschen ergab durch verkürzte Relaxation nahezu den Carnot-Wirkungsgrad bei endlicher Leistung [218]. Gezielt erzeugte Aktivität verschiebt die Schranke. Eine Informationsmaschine kippte durch Rauschen vom Kühlschrank zur Heizung [219]. Der Beleg muss das Regime festhalten, nicht nur Mittelwerte.

**Empowerment in der Simulation.** Klyubin, Polani und Nehaniv definierten Empowerment, die Kanalkapazität von Handlungen zu künftigen Sensoren [9]. Es wurde für kontinuierliche Regelung berechnet [220] und in einer Übersicht dargestellt [221]. Es misst, wie stark ein Agent die Welt bewegen kann, in Bits. Es ist keine Rate pro Joule.

<div id="43-opinion" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Meinung

Kinematik besteht überwiegend aus Theorem und Experiment. Die Meinungen hier betreffen die Frage, welche Variable die richtige ist. Seifert vertritt, dass die Inferenz aus Fluktuationen der Weg zu verborgenen Kosten ist [137]. Rovelli sowie Wissner-Gross und Freer schlagen beide eine entropische Kinematik vor [115, 118]. Kolchinsky zeigt, dass Dissipation allein nicht beschränkt, wie schnell Replikatoren wachsen oder zerfallen [222]. Raten werden durch Dissipation zusammen mit Aktivität beschränkt. Das ist die Form der Geschwindigkeitsgrenze, in der $\langle A\rangle$ neben $\Sigma$ steht. Adlam, McQueen und Waegell argumentieren, dass ein rein quantenmechanisches System kein Agent sein kann, weil der Aufbau eines Weltmodells und das Abwägen Kopieren erfordern, was das No-Cloning-Theorem verbietet (Preprint) [223]. Klausel 3 verlangt bereits einen klassischen Datensatz von $m$.

<div id="5-layer-3-intelligence-as-the-calculus-of-agency" class="anchor-alias" aria-hidden="true"></div>

## 5. Schicht 3. Intelligenz als Kalkül der Handlungsfähigkeit

Intelligenz ist die Ableitung torbedingter Handlungsfähigkeit nach den Joule, abgelesen an einem abgeschlossenen Lauf. Diese Schicht braucht drei Dinge aus der Literatur: eine Theorie, die Lernen und Entscheiden an Joule bindet, die Messung von Joule pro Einheit nützlicher Arbeit und Positionen dazu, was Intelligenz ist.

<div id="51-proven" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Bewiesen

**Lernen und Vorhersage, in Joule bepreist.** Goldt und Seifert beschränkten die Information, die ein lernendes Netz gewinnt, durch die Entropie, die es erzeugt [224]. Die Lerneffizienz ist höchstens eins. Das ist $\iota$ für den lernenden Teil eines Aktes, mit einer Obergrenze. Still zeigte, dass optimales Gedächtnis nur prädiktive Information behält [225]. Das für Gedächtnis ausgegebene marginale Joule muss Vorhersage kaufen. Boyd, Crutchfield und Gu bewiesen, dass der Agent, der die meiste Arbeit aus Daten extrahiert, das Maximum-Likelihood-Modell dieser Daten hat [226]. Bessere Modelle liefern mehr Arbeit pro Joule. Boyd, Crutchfield, Gu und Binder formulierten Überanpassung und Generalisierung als Energetik [227]. Generalisierung erscheint als Joule. Ehrich, Still und Sivak bepreisten den Regler selbst, über die Information hinaus, die er verwendet [228]. $J$ muss also an der Wand des ganzen Systems gemessen werden. Ehrich und Sivak gaben das Hauptbuch der Energie- und Informationsflüsse in autonomen Maschinen an [229]. Wolpert gab einen Überblick über Rechenkosten jenseits von Landauer [230]. Wolpert und Kollegen legten die offenen Probleme zu den Energiekosten der Berechnung in der stochastischen Thermodynamik dar [320]. Levy und Baxter zeigten, dass neuronale Codes, die Bits pro Energieeinheit maximieren, sich von Codes unterscheiden, die Bits maximieren [231]. Das richtige Ziel für ein Gehirn ist Information pro Joule. Balasubramanian, Kimber und Berry setzten als Ziel für ein exploratives Regime die Übertragungsrate pro Leistungseinheit [232]. Das sind Bits pro Joule. Goldt und Seifert beschränkten die Information, die ein Netz über eine Regel lernt, durch die thermodynamischen Kosten des Lernens, für Batch- und Online-Lernen [233]. Fiderer, Barth, Smith und Briegel definierten die Arbeitskapazität eines Umgebungskanals, die maximale Rate, mit der irgendein Agent in einer Wahrnehmungs-Handlungs-Schleife Arbeit zu extrahieren erwarten kann. Arbeitseffiziente Agenten wägen Vorhersage gegen Vergessen ab (Preprint) [234]. Elliott, Gu, Garner und Thompson zeigten, dass adaptive Quantenagenten weit weniger Gedächtnis brauchen können als gedächtnisminimale klassische Agenten [235]. Weniger zurückzusetzendes Gedächtnis ist eine niedrigere zu zahlende Untergrenze.

**Entscheidungen und beschränkte Optimalität.** Russell und Subramanian definierten beschränkte Optimalität: das beste Programm für eine gegebene Maschine und Umgebung [236]. Hier ist die Ressource Joule, und das Optimum ist $\arg\min J$ unter der Nebenbedingung $X \ge X_{\mathrm{req}}$. Russell und Wefald bepreisten jede Berechnung nach ihrer erwarteten Wirkung auf die Entscheidung, abzüglich ihrer Kosten, und beendeten das Abwägen, wenn keine Berechnung einen positiven Nettowert hatte [316]. Horvitz fasste denselben Zielkonflikt für das Schließen unter Ressourcenbeschränkungen [317]. Der σ-Gesetz-Selektor ist diese Regel mit den Kosten in gemessenen Joule. Proposition 9 gibt ihre exakte Form für eine Kaskade an. Genewein und Kollegen leiteten Abstraktion und Hierarchie aus Nutzen minus Informationskosten her [237]. Die Gänge von Mixture of Limits sind eine solche Hierarchie. Legg und Hutter definierten Intelligenz als komplexitätsgewichtete erwartete Belohnung über alle berechenbaren Umgebungen [238]. Das ist ein Integral, aber über die Belohnung, ohne Energie, und nicht berechenbar. Die Ableitung nach den Joule ersetzt die Belohnung durch bestätigte gekoppelte Bits und das Maß durch gemessene Joule. Takahashi und Hayashi liefern den nächstliegenden bestehenden Kalkül in Joule [239]. Sie definieren zwei Verhältnisse unter expliziten Abrechnungskonventionen. Thermodynamische Epiplexität pro Joule ist $I(W^{\mathrm{post}}; Z \mid W^{\mathrm{pre}})/E_{\mathrm{cons}}$: neue Bits über eine Umgebungsvariable $Z$, die im Zustand des Agenten behalten werden, pro innerhalb einer angegebenen Grenze verbrauchtem Joule. Empowerment pro Joule ist die Kapazität des Kanals von Akten zu Beobachtungen pro Einheit erwarteter energetischer Kosten, die Kapazität pro Kosteneinheit nach Verdú. Sie beweisen einen Landauer-Maßstab im geschlossenen Zyklus, indem sie eine thermodynamische Lernungleichung mit Datenverarbeitung verbinden, und sie zeigen durch eine reversible Kopierkonstruktion, dass sich bei offener Grenze und kostenlos hereingebrachtem frischem Gedächtnis Informationsgewinn und Dissipation innerhalb der Grenze entkoppeln. Sie schließen mit einer Berichtscheckliste: Grenze, Energiebilanz, Referenz, Vergröberung, Horizont und Zurücksetzen, Durchsatz, Schätzer. Diese Arbeitslinie übernimmt vier Dinge aus dieser Arbeit. Ihr Maßstab im geschlossenen Zyklus ist K1 für das Lernen. Ihre Entkopplungskonstruktion ist der Grund für die aktgeschlossene Messung in Definition 2 (Lemma 1). Ihre Checkliste wird in Abschnitt 8.12 übernommen. Ihr Rat, Bits pro Joule neben Bits pro Sekunde zu berichten, ist die Variable, die Vorhersage 1 optimiert. Die Definition unterscheidet sich von ihren Metriken in vier genauen Punkten. Empowerment pro Joule ist eine Kapazität, ein Supremum über Aktverteilungen; die Definition schreibt den realisierten Fluss der ausgeführten Strategie gut (Definition 1), mit der Kapazität als Schranke. Ihre Zahlen sind nach eigener Aussage maßstabsbezogene Effizienzberichte; diese Arbeitslinie ordnet Systeme nach $J^*$ hinter einem Korrektheitstor (Proposition 8). Sie haben keine vor dem Akt festgelegte Vorhersage, keine Konsequenzklausel und keine Ablehnung; die Definition verlangt alle drei, bevor irgendein Bit zählt. Sie geben keine Kinematik der Zeit an; Vorhersage 1 leitet aus derselben Joule-Abrechnung eine optimale Aktzeit und eine Obergrenze her. Ortega, Braun, Dyer, Kim und Tishby legten die informationstheoretische beschränkte Rationalität dar [240]. Zénon, Solopchuk und Pezzulo fassen die Kosten der Kognition als Information [241]. Sims wandte die Rate-Distortion-Theorie auf die Wahrnehmung an [242]. Ihre Währung sind Bits. Landauer rechnet Bits beim Zurücksetzen in Joule um.

<div id="52-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Nachgewiesen

**Gehirne.** Laughlin, de Ruyter van Steveninck und Anderson maßen die Energiekosten pro Bit in Photorezeptoren und Interneuronen der Schmeißfliege [243]. Höhere Informationsraten kosten mehr pro Bit. Das ist ein gemessenes $\iota$ in einem lebenden Agenten und ein gemessener abnehmender Ertrag, $\alpha_J < 0$ bei der Wahrnehmung. Attwell und Laughlin erstellten das Energiebudget der grauen Substanz nach Prozessen [244]. Lennie zeigte, dass die Energie begrenzt, wie viele kortikale Neuronen gleichzeitig aktiv sein können [245]. Energie ist die Beschränkung, und der Rest passt sich an. Die Energie pro Aktionspotential unterscheidet sich zwischen Neuronentypen stark [246]. Gleiche Funktion, verschiedene Joule. Neuronales Design folgt der Energieeffizienz [247]. Levy und Calvert prüften den menschlichen Kortex. Kommunikation kostet 35-mal so viel wie Berechnung, und die Berechnung eines Neurons liegt um einen Faktor $10^8$ von den bestmöglichen Bits pro Joule entfernt [248]. Das ist ein Abstand zur Untergrenze. Harris und Kollegen fanden, dass eine Synapse der Sehbahn so dimensioniert ist, dass sie Information pro Energieeinheit maximiert, nicht Information [249]. Das Ziel sind Bits pro Joule, gemessen an einer Synapse. Padamsey, Katsanevaki, Dupuy und Rochefort fanden, dass Nahrungsrestriktion den synaptischen ATP-Verbrauch (Adenosintriphosphat) im visuellen Kortex der Maus um 29% senkte und die Orientierungsabstimmung um 32% verbreiterte [250]. Weniger Joule kauften weniger Präzision. Plaçais und Preat zeigten, dass hungernde Fliegen das kostspielige aversive Langzeitgedächtnis abschalten und dass sein erzwungenes Wiedereinschalten das Überleben verringerte [251]. Plaçais und Kollegen fanden, dass ein erhöhter Energiefluss im Pilzkörper das Langzeitgedächtnis auslöst [252]. Mery und Kawecki fanden, dass die Bildung von Langzeitgedächtnis die Austrocknungsresistenz von Fliegen senkte [253]. Lernen hat einen gemessenen metabolischen Preis. Hechler, de Lange und Riedl maßen einen um bis zu 12% niedrigeren kortikalen Sauerstoffverbrauch während sicherer Vorhersage (Preprint) [254]. Vorhersage zuerst kann Joule sparen. Malkin und Kollegen gaben Synapsen in trainierten Netzen Energiekosten für Zuverlässigkeit und fanden im Optimum Kennzeichen bayesscher Inferenz [255]. Li und van Rossum zeigten, dass naive synaptische Plastizität extreme Energie kostet und dass das Zwischenspeichern von Änderungen vor der Konsolidierung sie spart [256]. Lynn und Kollegen erschlossen aus Neurobildgebung ein gebrochenes detailliertes Gleichgewicht im menschlichen Gehirn, das mit körperlicher und kognitiver Anstrengung zunimmt [257]. Diese Entropieproduktion ist vergröbert und informationell. Sie ist kein Joule-Messgerät.

**Maschinen.** Speicherzugriffe kosten weit mehr Energie als Arithmetik [258]. Die Parameterzahl zählt nur über die Joule, die sie zu bewegen zwingt. Intelligence per Watt misst die Aufgabengenauigkeit pro Leistungseinheit auf lokalen Beschleunigern [259]. Ihr Zähler ist Benchmark-Genauigkeit, nicht torbedingte Handlungsfähigkeit. MLPerf Power standardisiert die Leistungsmessung von Mikrowatt bis Megawatt, wobei jedes Ergebnis durch ein Genauigkeitsziel bedingt ist [260]. Dieses Tor ist die Form von $J^*$. FrugalGPT schaltet Sprachmodelle in Kaskade und hält an, wenn ein Bewerter die Antwort annimmt [321]. RouteLLM lernt, jede Anfrage unter einem Kostenziel an ein starkes oder ein schwaches Modell zu senden [322]. Ihre Kosten sind Dollar pro Anfrage, und ihr Tor ist eine Qualitätsschwelle. Mit gemessenen Joule und $C(z)$ als Tor gelesen, sind beide Kaskaden im Sinne von Proposition 9. ML.ENERGY misst die Inferenzenergie automatisch [261]. TokenPowerBench vergleicht die Leistungsaufnahme der Inferenz großer Sprachmodelle (LLM) [262]. Jin, Wei und Brooks analysieren die Energie der Rechenleistung zur Testzeit [263]. Allzweckmodelle kosten pro Aufgabe viel mehr Energie als aufgabenspezifische [264]. Das günstigste ausreichende Modell gewinnt in Joule. Das ist Mixture of Limits, gemessen. Samsi und Kollegen maßen die Energie der Inferenz großer Sprachmodelle auf GPUs (Grafikprozessoren) [265]. Dillavou und Kollegen demonstrierten dezentrales Lernen in einer physischen Schaltung, ohne Prozessor [266]. Stern und Kollegen trainierten selbstlernende Schaltungen auf leistungseffiziente Lösungen und maßen den Zielkonflikt zwischen Leistung und Fehler [267]. Saggio und Kollegen demonstrierten in einem photonischen Experiment eine Quantenbeschleunigung für lernende Agenten [268]. Weniger Interaktionen zum Lernen bedeuten weniger Akte bis zum Abschluss.

**Ein Akzeptor mit vom Kernel berichteter Energie.** Abschnitt 8.11 berichtet einen präregistrierten Lauf eines Akzeptor-Agenten auf einem Laptop, mit Vorhersage zuerst, Vergleich, Ablehnung und bindenden Joule-Budgets. Die Falsifikatoren wurden vor dem Lauf festgelegt, und mehrere wurden ausgelöst: R-F1 (die Joule der Selektoren auf gemeinsamen Aufgaben sind nicht unterscheidbar), R-F2 (36 von 5,400 Episoden überschritten das Budget: 9 beim σ-Gesetz-Arm und 7 bei der festen Kaskade bei $B = 1.0$ sowie 20 bei der zielblinden Referenz bei $B = 0.5$), R-F3, R-F5 und R-F6 (Abschnitt 8.11). $\iota$ wurde an 4,940 Belegen abgelesen. Der mediane bestätigte Akt ergab $1.5 \times 10^5$ Bits pro berichtetem Joule, etwa das $2 \times 10^{15}$-Fache der Joule pro Bit der Untergrenze. Unter einem bindenden Budget schloss der σ-Gesetz-Selektor mehr Aufgaben ab als die feste Kaskade, eine Instanz von Mixture of Limits. Dieser Vergleich wurde nach dem Lauf gewählt, ist also explorativ, und die Joule pro abgeschlossener Aufgabe waren gleich. Der präregistrierte zweite Lauf und eine zweite Maschine wiederholten den Gewinn nur beim lockersten Budget (Abschnitt 8.11.2). Das integrierte $\iota$ setzte einen zielblinden Agenten bei lockerem Budget auf den ersten Rang, während $J^*$ ihn auf den letzten setzte.

**Gruppen simuliert.** Crosato und Kollegen berechneten die thermodynamischen Größen simulierter kollektiver Bewegung über ihren kritischen Punkt hinweg [269]. Chen und Prokopenko verglichen thermodynamische Effizienz mit rein informationellen Nutzenmaßen als Erklärungen kollektiven Verhaltens nahe der Kritikalität [270]. $\iota_G$ in Proposition 7 ist die torbedingte, gemessene Form eines solchen Verhältnisses.

**Messgeräte.** RAPL (Running Average Power Limit) ist die Menge der Energiezähler auf dem Chip in Prozessoren von Intel und AMD. Seine Ablesungen wurden gegen externe Messung validiert [271]. Ablesungen für DRAM (dynamischer Speicher mit wahlfreiem Zugriff) wurden separat validiert [272]. Die Qualität des Messgeräts hängt von der Prozessorgeneration ab [273]. Apples Handbuch zu powermetrics gibt an, dass seine mittleren Leistungswerte „are estimated and may be inaccurate“ und nicht zum Vergleich von Geräten verwendet werden sollten [274]. Auf Apple Silicon sind Ablesungen von powermetrics berichtete Werte. Gemessene Joule für diese Maschine stammen von einem externen Wandsteckdosen-Messgerät.

**Kompression bewertet.** Der Hutter Prize bewertet die verlustfreie Kompression des ersten Gigabytes eines Dumps der englischen Wikipedia, mit einem Preisfonds von 500,000 Euro und Grenzen für Laufzeit und Speicher [275]. Er beschränkt Zeit und Speicher, nie Joule. Eine Joule-Obergrenze würde ihn zu einem Benchmark des Kalküls der Handlungsfähigkeit für eine Aufgabenklasse machen.

**Schätzungen.** Diese Quellen sind wertvoll, und ihre Joule-Zahlen sind modelliert, extrapoliert oder berechnet. Sie stehen neben gemessenen Joule, nie an ihrer Stelle. Schätzungen sind nie `measured_j`. Strubell, Ganesh und McCallum tasteten die Leistung für kurze Läufe ab und extrapolierten auf das vollständige Training von Modellen der Verarbeitung natürlicher Sprache [276]. Patterson und Kollegen berechneten die Trainingsenergie aus berichteten Daten zu Hardware, Laufzeit und Rechenzentrum [277]. Lacoste und Kollegen bauten einen Rechner aus Hardwaretyp, Laufzeit und Region [278]. Der Fußabdruck von BLOOM mischt gemessene und modellierte Eingaben [279]. Carbontracker liest Zähler auf dem Gerät und sagt Gesamtwerte für den vollen Lauf voraus [280]. Seine Vorhersagen sind Schätzungen. Elsworth und Kollegen berichten einen Median von 0.24 Wh pro Text-Prompt in Gemini Apps, einschließlich Beschleunigern, Hosts, Leerlaufkapazität und Overhead des Rechenzentrums [281]. Das ist eine vom Betreiber berichtete Zahl, abgelegt als `reported_j`.

<div id="53-opinion" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Meinung

Jede Position wird an der Definition gemessen: Intelligenz ist die Ableitung torbedingter Handlungsfähigkeit nach den Joule, abgelesen an einem abgeschlossenen Lauf.

- Schmidhuber behandelt intrinsische Belohnung als Kompressionsfortschritt, eine erste Ableitung dessen, wie gut ein Agent seine Geschichte komprimiert [282]. Das ist der nächstliegende Vorläufer für Intelligenz als an einem Lauf abgelesene Ableitung. Seine Variable ist Kompression, nicht Joule.
- Krakauer, Mitchell und Krakauer definieren Intelligenz als emergente Eigenschaft, die sich in immer günstigeren und schnelleren Verwendungen emergenter Fähigkeiten zur Problemlösung ausdrückt, zusammengefasst als „less is more“ [339]. Sie folgern, dass große Sprachmodelle höchstens emergente Fähigkeit zeigen, nicht emergente Intelligenz. Ihre Definition ist im Wortlaut die nächstliegende zu $\iota = dX/dJ$. Sie nennt Energie als Nenner und misst sie nicht. Der Kalkül liefert das Messgerät, das Tor, das Leistungsfähigkeit von Intelligenz trennt (Abschnitt 1), und die am Lauf abgelesene Ableitung.
- Chollet definiert Intelligenz als Effizienz des Fertigkeitserwerbs gegenüber Vorwissen und Erfahrung, mit dem Benchmark ARC (Abstraction and Reasoning Corpus) [283]. Das ist ein Verhältnis. Sein Nenner sind Information und Daten, nicht Joule. Die Rangliste des ARC Prize trägt die Kosten pro Aufgabe gegen die Punktzahl als Effizienzmaß auf [284]. Die Kosten sind in Dollar. Ein Joule-Messgerät macht daraus $J^*$.
- Hernández-Orallo baut eine universelle Psychometrie über Arten und Maschinen hinweg auf [285]. Sie bewertet nach Aufgaben. Diese Arbeitslinie bewertet nach den Joule bis zum Abschluss von Aufgaben. Der Anytime-Test von Hernández-Orallo und Dowe passt sich an die verfügbare Zeit an [286]. Der Kalkül passt sich an die verfügbaren Joule an.
- Gershman, Horvitz und Tenenbaum definieren Intelligenz als erwarteten Nutzen abzüglich der Rechenkosten [287]. Diese Arbeitslinie macht die Kosten zu Joule.
- Lieder und Griffiths behandeln Kognition als optimale Nutzung begrenzter Ressourcen [288]. Das liegt nahe an Mixture of Limits. Die Ressource bleibt abstrakt.
- Balasubramanian liest das Design des Gehirns durch seine Energiegrenzen [289].
- Silver, Singh, Precup und Sutton vertreten, dass Belohnung genügt [290]. Belohnung wird von einem Entwerfer gewählt. Joule werden an einem Messgerät abgelesen. Vamplew und Kollegen erwidern, dass skalare Belohnung keine Ziele mit mehreren Kriterien ausdrücken kann [291]. Diese Arbeitslinie behält eine Variable, die Joule, und verlegt die Vielfalt in das Tor $X \ge X_{\mathrm{req}}$.
- Hafez und Kollegen definieren Handlungsfähigkeit und Intelligenz gemeinsam [292]. Das ist nicht in Joule verankert.
- Karagoz macht energetische Selbsterhaltung zum Ziel [293]. Es hat kein Vorhersagetor, keine Kinematik und keine Joule-Rangordnung über Systeme hinweg.
- Chaisson schlägt die Energieratendichte, Leistung pro Masseneinheit, als Komplexitätsmaß über die kosmische Evolution vor [294]. Das ist eine Rate in Watt pro Kilogramm. Der Kalkül teilt bestätigte Bits durch Joule.

Der Geltungsbereich von $\iota$ folgt aus seinem Zähler. $X$ zählt bestätigte Kopplung an die Welt, also misst $\iota$, wie günstig ein Agent die Welt so verändert, wie er es vorhergesagt hat. Es misst nicht Verstehen. Krakauer, Mitchell und Krakauer binden Intelligenz an kompakte, mitteilbare Repräsentationen [339]. Eine kompakte Repräsentation geht über ihre Wirkung in den Kalkül ein: Ein Agent, der eine solche hält, schließt spätere Aufgaben mit weniger Joule ab. Verstehen, das nie einen Akt verändert, liegt außerhalb dessen, was $\iota$ abliest.

<div id="54-where-the-calculus-stands" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Wo der Kalkül steht

- **Bewiesen:** Lernen, Gedächtnis, Vorhersage und Regelung haben jeweils einen Joule-Preis mit einer Obergrenze.
- **Nachgewiesen:** Joule pro Bit sind in Gehirnen gemessen. Joule pro Aufgabe sind in Maschinen gemessen. Messgeräte lassen sich validieren.
- **Hier bewiesen:** $\iota$ ist unter joule-proportionaler Gutschrift eine beschränkte Dichte auf der Joule-Achse (Proposition 5). Abgetastetes $\iota$ konvergiert dagegen (Proposition 6). Gruppen setzen sich nach Proposition 7 zusammen. Das Halten eines Ziels legt eine optimale Aktzeit und eine Obergrenze für $\iota$ fest (Vorhersage 1).
- **Hier nachgewiesen:** $\iota$ und $J^*$, abgelesen an den Belegen eines Akzeptors mit vom Kernel berichteter Energie, mit im Voraus festgelegten Falsifikatoren (Abschnitt 8.11). $J^*$ ordnet Agenten. Das integrierte $\iota$ tut es nicht.
- **Von dieser Arbeitslinie hinzugefügt:** Intelligenz, gelesen als $dX/dJ$ an einem torbedingten, abgeschlossenen Lauf, mit $J^*$ als Rangordnung. Takahashi und Hayashi kommen am nächsten, mit Verhältnissen von Bits pro Joule unter expliziter Abrechnung [239]. Diese Arbeitslinie fügt das Zulässigkeitstor hinzu, den realisierten Fluss anstelle der Kapazität, die torbedingte Rangordnung und ihren Beweis (Proposition 8) sowie die optimale Aktzeit (Vorhersage 1).

<div id="6-global-findings-by-method" class="anchor-alias" aria-hidden="true"></div>

## 6. Weltweite Befunde, nach Methode

Die Recherche lief auf Russisch, Chinesisch, Japanisch, Deutsch, Französisch, Spanisch, Portugiesisch, Koreanisch, Italienisch, Polnisch, Hindi und Arabisch, mit Nachrecherchen auf Englisch. Ein zweiter Durchgang durchsuchte erneut Japanisch, Chinesisch, Russisch, Deutsch, Französisch, Spanisch und Koreanisch und fügte Persisch, Türkisch und Hebräisch hinzu. Seine Ergebnisse sind in die Abschnitte 2 bis 5 und 8 eingearbeitet, je nachdem, was sie beweisen, messen oder definieren. Die Ergebnisse sind nach Methode und Ergebnisklasse geordnet. Die Sprache ist nur ein Metadatum. Kein Eintrag wird nach seiner Herkunft gewichtet.

<div id="61-theorems-and-reviews-information-has-a-thermodynamic-price" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Theoreme und Übersichten: Information hat einen thermodynamischen Preis

- Poplavskii lieferte eine frühe systematische Behandlung der Energiekosten der Gewinnung und Verarbeitung von Information [295]. Auf Russisch verfasst, mit einer englischen Übersetzung. Schicht: Definition.
- Stratonovich bewies Theoreme zum Informationswert [201]. Englische Ausgabe einer russischen Monographie. Schicht: Kinematik.
- Ito und Sagawa wandten die Informationsthermodynamik auf Netzen auf die Chemotaxis von E. coli an. Die Transferentropie beschränkt die Robustheit, und die informationsthermodynamische Effizienz ist dort hoch, wo die gewöhnliche thermodynamische Effizienz niedrig ist [296]. Auf Japanisch verfasst. Schichten: Definition und Kinematik.
- Sun und Quan gaben einen Überblick über den maxwellschen Dämon und die physikalische Untergrenze der Dissipation in der Informationsverarbeitung [297]. Auf Chinesisch verfasst. Schicht: Definition.
- Quan, Dong und Sun gaben einen Überblick über die mesoskopische Thermodynamik: Der Dämon ist mit dem zweiten Hauptsatz vereinbar, sobald die Löschung mitgezählt wird, und Einschränkungen zwischen Leistung und Wirkungsgrad wurden geprüft [298]. Auf Chinesisch verfasst, mit einer englischen Zusammenfassung. Schichten: Definition und Kinematik.
- Parrondos enzyklopädische Übersicht gibt den aktuellen Stand zu Information als thermodynamischer Ressource wieder [299]. Schicht: Definition.
- Strasbergs Dissertation prüft gängige Annahmen der Informationsthermodynamik mit physikalischen Modellen [300]. Auf Englisch verfasst, mit einer deutschen Zusammenfassung. Schicht: Definition.
- Weitere Theoreme fanden sich bei Recherchen auf Japanisch, Russisch, Chinesisch, Koreanisch, Portugiesisch, Italienisch und Polnisch: Geschwindigkeitsgrenzen und TURs in chemischen Netzen [127, 131, 132], Thermodynamik in endlicher Zeit [159, 162, 163], Langevin-TURs [143, 144], Informationsschranken für die Entropieproduktion [148, 149] und Arbeitskosten für Einzelschüsse [38].

<div id="62-experiments-the-price-measured" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Experimente: der gemessene Preis

- Dagos Dissertation berichtet das Löschen und Schreiben eines Bits nahe der minimalen Energie bei hoher Geschwindigkeit an einem unterdämpften Mikrocantilever [301]. Auf Französisch verfasst. Schicht: die Joule-Untergrenze der Definition, erreicht bei kinematischer Geschwindigkeit.
- Lagoins Dissertation baut makroskopische maxwellsche Dämonen, darunter eine Szilard-Maschine, aus einem Flügelrad in einem granularen Gas [302]. Auf Französisch verfasst. Schicht: Definition. Die Bilanz des Dämons gilt auch außerhalb des mikroskopischen Regimes.
- Ciampini und Kollegen verwendeten extrahierbare Arbeit als Zeugen für Quantenkorrelationen in einem photonischen Experiment [303]. Schicht: Definition.
- Experimente fanden sich bei Recherchen auf Koreanisch, Portugiesisch, Hindi, Italienisch, Spanisch, Chinesisch und Japanisch: Informationsmaschinen [27, 80], NMR-Dämonen [73, 74], die TUR an Qubits [202], Maschinen mit aktivem Bad [217, 218], geometrische Schranken [211], Symmetriebrechung und Carnot-Zyklen [215, 216], Dämonen mit gefangenen Ionen [66, 88] sowie Rückkopplungsumwandlung und optimaler Transport [69, 76, 209].

<div id="63-theory-of-functional-systems-prediction-before-the-act" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Theorie funktioneller Systeme: Vorhersage vor dem Akt

Die Schule Anokhins formuliert die Klauseln 1 und 3 in physiologischen Begriffen. Eine Ergebnisvorlage, der Akzeptor der Handlungsergebnisse, wird vor dem Akt gebildet, nach ihm verglichen, und der Vergleich organisiert das Verhalten neu. Diese Arbeiten wurden durch Recherchen auf Russisch gefunden.

- Anokhins funktionelles System [93, 94].
- Sudakov über das Ergebnis als systembildenden Faktor und über die probabilistische Vorhersage von Verhalten [95, 304, 305, 306].
- Shvyrkov über Ziele, die neuronale Aktivität organisieren, und über Lernen als Selektion neuronaler Systeme [96, 307].
- K. V. Anokhin über die kognitive Struktur des Gehirns als Hypernetz von Elementen funktioneller Systeme [308].
- Saltykov und Grachev über den systembildenden Faktor als Antizipation [309].
- Vityaev über Zweckgerichtetheit, formalisiert als Lernen von Regeln, die Ergebnisse vorhersagen [310].

**Implementiert und betrieben.** Kognitive Architekturen auf Grundlage der Theorie funktioneller Systeme bilden Ergebnisvorlagen, vergleichen und lernen Teilziele, in der Simulation und auf einem physischen Roboter [90, 91, 311, 312, 313]. Keine davon misst Joule. Einem dieser Agenten ein Messgerät hinzuzufügen, würde die volle Reihenfolge aus Definition, Kinematik und Kalkül an einer bestehenden Implementierung prüfen. Differenzierbare probabilistische Logiknetze sind verwandtes Werkzeug des Kalküls, nicht auf funktionellen Systemen aufgebaut, ohne Zulässigkeitstor und ohne Joule [314].

<div id="64-autonomy-organization-and-minimal-agency" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Autonomie, Organisation und minimale Handlungsfähigkeit

Gefunden durch Recherchen auf Spanisch, Französisch und Deutsch. Handlungsfähigkeit ist eine sich selbst erhaltende Organisation, die ihre Interaktionen reguliert [103, 104, 105, 106, 107, 108]. Die Organisation ist eine Schließung von Zwangsbedingungen auf thermodynamischen Flüssen [109]. Die Autonomieschule hat den Schritt in die stochastische Thermodynamik getan [110]. Schicht: Definition, als die Organisation, die existieren muss, bevor irgendein Akt zählt.

<div id="65-measured-joules-for-machine-intelligence" class="anchor-alias" aria-hidden="true"></div>

### 6.5 Gemessene Joule für maschinelle Intelligenz

Gefunden durch Recherchen auf Chinesisch zur Inferenzenergie: automatisierte Messung der Inferenzenergie [261], Leistungsbenchmarks pro Token [262] und die Energie des Schließens zur Testzeit [263].

<div id="66-philosophy-of-agency" class="anchor-alias" aria-hidden="true"></div>

### 6.6 Philosophie der Handlungsfähigkeit

Rovellis Physik der Handlungsfähigkeit fand sich über das Deutsche [115]. Jaeger und Azadi vervollständigen die Reihe der Positionspapiere [116, 117].

<div id="67-searches-with-no-primary-research" class="anchor-alias" aria-hidden="true"></div>

### 6.7 Recherchen ohne Primärforschung

Recherchen auf Hindi und Arabisch ergaben keine Primärforschung in diesen Sprachen. Nachrecherchen auf Englisch brachten weitere Arbeiten zutage, oben nach Methode aufgeführt. Recherchen auf Persisch, Türkisch und Hebräisch ergaben Dissertationen, Übersichten und bereits zitierte Arbeiten, ohne neue Primärforschung.

<div id="7-open-problems" class="anchor-alias" aria-hidden="true"></div>

## 7. Offene Probleme

<div id="71-what-must-be-proven" class="anchor-alias" aria-hidden="true"></div>

### 7.1 Was bewiesen werden muss

**P1. Die Bahn des Laufs ist wohldefiniert.** Bewiesen. Proposition 5 gibt $\iota = dX/dJ$ als Dichte auf der Joule-Achse mit $0 \le \iota \le 1/(k_B T\ln 2)$ an, unter joule-proportionaler Gutschrift. Proposition 6 gibt die Konvergenz des abgetasteten $\iota$ bei Verfeinerung der Abtastung des Messgeräts an, mit dem relativen Fehler des Messgeräts als Fehlerterm.

**P2. Landauer-Schranke hinter dem Tor der Handlungsfähigkeit.** Unter Abrechnung im geschlossenen Zyklus kostet jedes bestätigte gekoppelte Bit mindestens $k_B T \ln 2$, also gilt $v_J \le 1/(k_B T \ln 2)$. Vorhanden: Mess- plus Löscharbeit beträgt mindestens $k_B T I$ [5], und Löschen kostet mindestens $k_B T \ln 2$ pro Bit [6, 7]. Fehlt: ein Datenverarbeitungsschritt, der zeigt, dass die in $X$ gutgeschriebenen gekoppelten Bits die während des Vergleichs im Gedächtnis des Akzeptors aufgezeichneten Bits nicht übersteigen können. Klausel 3 verlangt bereits, dass die Bestätigung $m$ aus einem physischen Datensatz stammt. Proposition 1 beweist die Untergrenze pro Akt, wobei dieser Schritt als Annahme (R2) genommen wird.

**P3. Geschwindigkeitsgrenze der Handlungsfähigkeit.** Bewiesen für Akte, deren Datensatz (R1) bis (R4) erfüllt. Proposition 1 beschränkt die mittleren Joule des Aktes $k$ nach unten durch $b_k k_B T\ln 2$ plus einen Term für endliche Zeit in $\tau_k$, $\langle A\rangle_k$, dem Rücksetzfehler $\varepsilon$ und den bestätigten Bits, über die Fano-Ungleichung. Vorhersage 1 fügt die ständigen Joule für das Halten eines Ziels hinzu und gibt die optimale Aktzeit an.

**P4. Präzisionsschranke für Agenten.** Bewiesen. Proposition 3 beschränkt die relative Varianz bestätigter Handlungsfähigkeit durch die dynamische Aktivität für die Zahl bestätigter Akte und durch die Entropieproduktion mit dem Informationsterm unter Rückkopplung.

**P5. Rückschautheorem.** $\iota$ ist nur eine Funktion des abgeschlossenen Belegs. Keine vor dem Lauf bekannte Größe legt sie fest. Vorhanden: Jedes $m_k$ vergleicht ein Ergebnis mit einer vor dem Akt festgelegten Vorhersage, also ist $m_k$ unbekannt, bevor der Akt $k$ abschließt. Fehlt: eine Konstruktion zweier Welten, die in allem übereinstimmen, was ein Prädiktor vor dem Lauf sieht, und sich in einem $m_k$ unterscheiden. Zusammen mit P1 macht dies „Intelligenz wird am abgeschlossenen Lauf abgelesen“ zu einem Theorem.

**P6. Die Rangordnung übersteht Messfehler.** Bewiesen. Proposition 8, Teil 3: Wenn $(1+\epsilon)J^*_{S_1}(q) < (1-\epsilon)J^*_{S_2}(q)$, mit $\epsilon$ der relativen Fehlerschranke des Messgeräts, dann gilt $S_1 \succ_q S_2$ unter jeder Ablesung innerhalb dieses Fehlers. Fehlt: ein validiertes $\epsilon$ für jedes Messgerät [271].

**P7. Optimalität von Mixture of Limits.** Teilweise bewiesen. Proposition 9 gibt die exakten Bedingungen für unabhängige Gänge und für zwei verschachtelte Gänge an, sowie den Budgetmechanismus. Die Instanz der festen Kaskade probiert die Gänge vom günstigsten aufwärts, hält beim ersten Gang an, dessen Ausgabe $C(z)$ erfüllt, und lehnt mit einem Beleg ab, wenn der nächste Gang das Budget sprengen würde. Sie erreicht das Joule-Minimum bis auf die Kosten gescheiterter Versuche. Vorhanden: Ist die Hinlänglichkeit in der Gangreihenfolge monoton und steigen die Gangkosten mit der Reihenfolge, so ist der erste ausreichende Gang der günstigste ausreichende Gang. Fehlt: eine Regret-Schranke, wenn Erfolgswahrscheinlichkeiten geschätzt werden oder die Hinlänglichkeit nicht monoton ist, der verschachtelte Fall mit mehr als zwei Gängen und die Bedingungen, unter denen diese Regel und der σ-Gesetz-Selektor, $a^* = \arg\max[H(a) - \lambda J(a)]$ unter der Nebenbedingung $J \le B$, denselben Akt wählen.

**P8. Wann sich Handlungsfähigkeit kumuliert.** Bedingungen, unter denen $\alpha_J > 0$ über einen Lauf gilt, sodass frühere Belege die Joule späterer Abschlüsse senken. Vorhanden: Ein früherer Probelauf von OpenIE fand $\alpha_J \le 0$ bei nahezu optimalen Aufgaben. Fehlt: ein Modell der Wiederverwendung, in dem gespeicherte Belege das spätere $J$ um mehr senken als die Joule für Speicherung und Nachschlagen. Still liefert die Kostenseite des Gedächtnisses [225]. Abschnitt 8.10 misst den Anteil der Vorlage an den Joule jedes Aktes.

<div id="72-what-must-be-demonstrated" class="anchor-alias" aria-hidden="true"></div>

### 7.2 Was nachgewiesen werden muss

| ID | Behauptung | Erforderliche Nachweise |
|---|---|---|
| D1 | $J^*$ pro Aufgabe ist gemessen, nicht geschätzt, auf mindestens zwei Plattformen | `measured_j` aus RAPL unter Linux auf x86 und aus einem externen Wandsteckdosen-Messgerät auf Apple Silicon |
| D2 | Der σ-Gesetz-Selektor schließt Aufgaben unter bindenden Budgets mit weniger gemessenen Joule ab als die feste Kaskade | Gepaarte Läufe mit denselben Aufgaben, Gängen, Prädikaten, Budgets und Messgeräten |
| D3 | Ablehnung mit Beleg funktioniert | Null Überschreitungen, Ablehnungen bei undurchführbaren Aufgaben, wenige Ablehnungen bei durchführbaren |
| D4 | $\iota$ wird an Belegen abgelesen und ist über Seeds stabil | Reihe $\iota_k$ pro Lauf mit einer Streuung innerhalb einer vorab festgelegten Schranke |
| D5 | Schätzungen ersetzen keine Messung | Rangübereinstimmung zwischen `est_j` und `measured_j`, berichtet, nie zusammengeführt |
| D6 | Die physikalische Untergrenze wird eingehalten, und der Abstand ist bekannt | Gemessene Joule pro bestätigtem Bit geteilt durch $k_B T \ln 2$ |
| D7 | Vorhersage 1: die optimale Aktzeit und die Obergrenze eines Agenten, der ein Ziel hält | Ein Durchlauf über $\tau$ bei zwei oder mehr Instabilitätsraten, mit Aktjoule und ständigen Joule getrennt und gemeinsam gemessen |

Abschnitt 8.11 berichtet den ersten Lauf im Hinblick auf D2 bis D6, in berichteten Joule. Abschnitt 8.11.1 berichtet den zweiten Lauf auf derselben Maschine, mit den Korrekturen von Wächter und Ablehnung, und Abschnitt 8.11.2 wiederholt ihn auf einer zweiten Maschine.

<div id="8-experiment-plan" class="anchor-alias" aria-hidden="true"></div>

## 8. Versuchsplan

Jede Tabelle, jeder Beleg und jede Abbildung in diesem Plan folgt einer Regel. Schätzungen sind nie `measured_j`. Eine modellierte Zahl wird als `est_j` gekennzeichnet. Eine gemessene Zahl wird als `measured_j` gekennzeichnet und nennt ihr Messgerät.

<div id="81-meters" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Messgeräte

Abkürzungen: CPU (Hauptprozessor), GPU (Grafikprozessor), ANE (Apple Neural Engine), AC (Wechselstrom), NVML (NVIDIA Management Library).

| Stufe | Messgerät | Was es liest | Kennzeichnung |
|---|---|---|---|
| M0 | Externes Wandsteckdosen-Leistungsmessgerät, Aufzeichnung mit 1 Hz oder schneller | Wechselstromleistung des Gesamtsystems | `measured_j`, Wand |
| M1 | RAPL über powercap unter Linux, Domänen Package, Core, Uncore und DRAM, sofern vorhanden | Kumulierte Energie auf dem Chip in Mikrojoule | `measured_j`, rapl |
| M1g | Gesamtenergiezähler von NVML auf einer diskreten GPU | Kumulierte Energie der GPU-Karte | `measured_j`, nvml |
| M2 | Apple powermetrics, CPU- und GPU-Sampler mit 100 ms | CPU-, GPU- und ANE-Leistung, wie vom System berichtet | `reported_j`, powermetrics |

- **RAPL.** Den Zähler vor und nach jedem Akt lesen. Überläufe behandeln. Gegen M0 auf einer Kalibrierlast validieren [271, 272].
- **powermetrics.** Ablesungen werden als `reported_j` abgelegt. Gemessene Joule auf Apple Silicon stammen von M0. Innerhalb einer Maschine ordnet `reported_j` die Joule CPU, GPU und ANE zu.
- **Leerlaufreferenz.** Vor jedem Block 120 s Leerlaufleistung auf jedem Messgerät aufzeichnen. Brutto-Joule und um den Leerlauf bereinigte Joule nebeneinander berichten. Nie nur die bereinigte Zahl berichten.
- **Zustandskontrolle.** Den CPU-Frequenzregler festlegen, wo das Betriebssystem es erlaubt. Umgebungstemperatur und thermischen Druck protokollieren. Hintergrundaufträge schließen. Einen Aufwärmlauf pro Arm verwerfen.

<div id="82-tasks" class="anchor-alias" aria-hidden="true"></div>

### 8.2 Aufgaben

Jede Aufgabe hat ein maschinell prüfbares Vollständigkeitsprädikat $C(z)$: Unit-Tests für Code, exakte Übereinstimmung für Arithmetik, Schemavalidierung für Extraktion, ein verifizierter Endzustand für Werkzeugnutzung. Zwei Schichten werden im Voraus festgelegt. Nahezu optimale Aufgaben sind solche, die der günstigste Gang gewöhnlich abschließt. Kumulierende Aufgaben sind Folgen, in denen frühere Belege wiederverwendet werden können. $X_{\mathrm{req}}$ wird durch $C(z)$ festgelegt. Erfüllen ist ein Tor, keine Punktzahl.

<div id="83-arms" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Arme

Alle Arme teilen die Gänge, das Prädikat, das Budget, die Messgeräte und eine randomisierte, verschränkte Laufreihenfolge.

1. **σ-Gesetz-Selektor:** $a^* = \arg\max[H(a) - \lambda J(a)]$ unter der Nebenbedingung $J \le B$, mit Ablehnung auf einen Beleg.
2. **Feste Kaskade (eine Instanz von Mixture of Limits):** die Regel des günstigsten Ausreichenden, mit Gängen, die in fester Reihenfolge vom günstigsten aufwärts probiert werden. Sie ist der passende Vergleich: gleiche Information, gleiche Gänge, gleiches Budget und gleiches Ablehnungsrecht. Nur die Auswahlregel unterscheidet sich.
3. **Immer der größte Gang:** Referenzobergrenze.
4. **Immer der kleinste Gang:** Referenzuntergrenze, mit Ablehnung bei Scheitern.

Beide Selektoren sind Instanzen von Mixture of Limits. Die Philosophie besteht darin, den günstigsten ausreichenden Gang zu verwenden, weil jenseits der Untergrenze zusätzliche Joule keinen überprüfbaren Fortschritt kaufen. Die feste Kaskade wendet sie in fester Reihenfolge an. Der σ-Gesetz-Selektor hält an, wenn der nächste Akt seine Joule nicht mehr bezahlt. Das ist eine Regel der Schwellenkonvergenz, also ebenfalls eine Instanz von Mixture of Limits. Der Vergleich findet zwischen zwei Instanzen einer Philosophie statt. In Code und Datendateien ist die feste Kaskade der Arm `mol` und der σ-Gesetz-Selektor der Arm `sigma`.

<div id="84-budgets-seeds-and-statistics" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Budgets, Seeds und Statistik

- Ein Pilotlauf führt Arm 2 ohne Budget aus und zeichnet die medianen gemessenen Joule pro Aufgabe auf, $\tilde J_q$.
- Die Budgetstufen sind $B \in \{0.25, 0.5, 0.75, 1.0\} \times \tilde J_q$, dazu unbeschränkt. Eine Stufe bindet nur, wenn im Pilotlauf mindestens 20% der Aufgaben sie überschreiten. Nicht bindende Stufen werden berichtet und vom Test von D2 ausgeschlossen.
- Mindestens 10 Seeds pro Arm, Aufgabe und Budget. Mehr, wenn der Pilotlauf zeigt, dass 10 keinen Unterschied von 10% im Median von $J^*$ bei 95% Konfidenz auflösen können.
- Mittelwert, Median, Standardabweichung und ein 95%-Bootstrap-Konfidenzintervall von $J^*$ pro Aufgabe berichten. Die Arme 1 und 2 mit einem Wilcoxon-Vorzeichen-Rang-Test auf den Median von $J^*$ pro Aufgabe vergleichen, mit Effektstärke.
- Die Präregistrierung nennt die primären Endpunkte. Sekundäre Vergleiche werden mit dem schrittweisen Holm-Verfahren korrigiert. Eine nach einem Lauf gewählte Analyse wird überall, wo sie erscheint, Zusammenfassungen eingeschlossen, als post hoc gekennzeichnet und ist nie das Hauptergebnis. Zu einem primären Endpunkt wird sie erst in der Präregistrierung des nächsten Laufs.

<div id="85-receipt-schema" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Belegschema

Der Beleg ist der Notational-Intelligence-Datensatz des Laufs. Ein Datensatz pro Akt:

```
act_id, run_id, task_id, arm, seed, budget_j, gear
prediction_hash, prediction_ts        # R*, fixed before the act
outcome_hash, outcome_ts              # R
m                                     # 1, mu, or 0
coupled_bits_est                      # realized I(do(a); W'), bias-corrected, with interval
coupled_bits_bound                    # capacity bound, never credited as X
t_start, t_end
measured_j   {meter, domains, gross_j, idle_w, idle_subtracted_j}
reported_j   {meter, cpu_j, gpu_j, ane_j}    # powermetrics only
wall_j       {meter, gross_j, idle_w, idle_subtracted_j}
est_j        {model, inputs}                 # never merged with measured_j
cumulative_measured_j
refused, refuse_reason
passed_C
record_states, record_bits            # N and H of the act's record M_k
joule_share                           # P_k attribution when acts overlap
template_j   {meter, write_j, hold_j, reset_j}   # joules for R*
trajectory_j {tau, activity, work}    # physical runs only, Section 8.8
```

<div id="86-metrics" class="anchor-alias" aria-hidden="true"></div>

### 8.6 Metriken

- $J^*$ pro Aufgabe: gemessene Joule bis zum Erfüllen von $C(z)$, von M0, sofern vorhanden, sonst von M1.
- Abschlussrate pro Arm und Budget.
- Überschreitungen: Akte, die $B$ überschritten. Das Ziel ist null.
- Qualität der Ablehnung: Präzision und Trefferquote der Ablehnungen gegenüber Aufgaben, die irgendein Arm innerhalb von $B$ als undurchführbar gezeigt hat.
- Intelligenzreihe: $\iota_k = \Delta X_k/\Delta J_k$ pro Lauf und ihre Streuung über Seeds.
- Vorzeichen der Beschleunigung: das Vorzeichen von $\alpha_J$ aus der Regression von $\iota_k$ auf das kumulierte $J$, pro Schicht.
- Prüfung der Schätzung: Kendalls Rangkorrelation zwischen `est_j` und `measured_j`.
- Abstand zur Untergrenze: gemessene Joule pro bestätigtem gekoppeltem Bit geteilt durch $k_B T \ln 2$ bei der protokollierten Temperatur.
- Aktintelligenz: $\iota_k = b_k/J_k$ pro Akt, gleich der Dichte von Proposition 5 auf diesem Akt.
- Anteil der Vorlage: $J^{R^*}/J$ pro Akt und die Kurve $\iota(w)$ (Abschnitt 8.10).

<div id="87-falsifiers-fixed-before-any-run" class="anchor-alias" aria-hidden="true"></div>

### 8.7 Falsifikatoren, vor jedem Lauf festgelegt

| ID | Beobachtung | Widerlegte Behauptung |
|---|---|---|
| F1 | Das 95%-Intervall der gepaarten Differenz im Median von $J^*$, σ-Gesetz minus feste Kaskade, schließt bei jedem bindenden Budget null ein oder liegt darüber | Der σ-Gesetz-Selektor schlägt seinen fairen Konkurrenten in Joule |
| F2 | Irgendein Arm verzeichnet eine Überschreitung | Die Ablehnungsimplementierung dieses Arms |
| F3 | Die Trefferquote der Ablehnung bei undurchführbaren Aufgaben liegt unter 0.9, oder mehr als 10% der Ablehnungen betreffen Aufgaben, die ein anderer Arm innerhalb von $B$ abgeschlossen hat | Die Korrektheit der Ablehnung |
| F4 | Kendalls Korrelation zwischen `est_j` und `measured_j` liegt unter 0.8 | Die Verwendung dieses Schätzers für jede Rangordnung |
| F5 | Der Variationskoeffizient des mittleren $\iota$ über Seeds übersteigt bei einer Aufgabe 0.25 | Das Ablesen von $\iota$ in der Granularität dieser Aufgabe |
| F6 | Das angepasste $\alpha_J$ ist in der kumulierenden Schicht nicht mit 95% Konfidenz positiv | Die Kumulierung bei diesen Aufgaben |
| F7 | Die mittleren gemessenen Joule pro bestätigtem Bit über einen Lauf fallen unter $k_B T \ln 2$, oder die eines beliebigen Aktes einer makroskopischen Maschine | Die Abrechnung selbst: ein Fehler des Messgeräts oder der Buchführung, behoben, bevor irgendein anderes Ergebnis berichtet wird |
| F8 | M1 und M0 weichen auf einer Kalibrierlast um mehr als die Fehlerschranke aus P6 voneinander ab | Diese RAPL-Domäne als gemessene Quelle auf dieser Maschine |
| F9 | Ein physischer Aktzyklus zeigt bei seinem protokollierten $\tau$ und $\langle A\rangle$ eine Arbeit unter der Untergrenze von Proposition 1 | Die Abrechnung dieses Laufs: ein übersehener Sprungkanal, ein falsch kalibriertes Potential oder eine nicht gemessene Arbeitsquelle |
| F10 | Ein stationärer Lauf zeigt $\mathrm{Var}(N)/\langle N\rangle^2$ unter $1/\langle K\rangle$ jenseits seines Konfidenzintervalls | Die Sprungzählung dieses Laufs: Einige Sprünge wurden nicht gezählt |
| F11 | Ein Regler hält die Regelstrecke mit gemessenen Joule pro Schritt unter $k_B T\ln 2 \log_2\lvert\lambda\rvert$ | Das Messgerät oder das Streckenmodell dieses Laufs |
| F12 | Der Maximierer des gemessenen $\iota(\tau)$ liegt außerhalb von $\tau^* \pm 2\delta\tau^*$ aus Vorhersage 1, oder die Steigung von $\ln\tau^*$ gegen $\ln s$ weicht um mehr als zwei Standardfehler von $-1/2$ ab; oder das $\iota$ eines Laufs übersteigt die Obergrenze von Vorhersage 1 | Die Additivität von Aktjoule und ständigen Joule auf einem Messgerät, mit $\iota$ als ihrer Dichte; für die Obergrenze die Abrechnung dieses Laufs |

<div id="88-physical-act-cycles" class="anchor-alias" aria-hidden="true"></div>

### 8.8 Physische Aktzyklen

Diese Läufe prüfen die Propositionen 1 bis 4 an der physikalischen Untergrenze. Die Arbeit wird aus gemessenen Trajektorien und dem kalibrierten Potential berechnet, wie in [61, 67, 70]. Sie wird als `trajectory_j` abgelegt und nie mit `measured_j`, `reported_j` oder `est_j` zusammengeführt.

- **Aktzyklus auf einem Ladungsregister (Propositionen 1 und 4).** Eine Einzelelektronenbox oder ein Quantenpunkt hält einen Ein-Bit-Datensatz, wie in [68, 70, 71]. Jeder Zyklus schreibt den Vergleich, handelt und setzt den Datensatz in der Zeit $\tau$ zurück. Ein Ladungsdetektor zählt jeden Tunnelsprung, sodass $\langle A\rangle$ gemessen wird. $\tau$ über mindestens zwei Dekaden durchfahren. Ergebnisform: Arbeit pro Zyklus gegen $k_B T\ln 2 + k_B T/(2\tau\langle A\rangle)$, die Untergrenze von Proposition 1 für $N = 2$ und $b = 1$.
- **Zählen bestätigter Akte (Proposition 3).** Auf demselben Register, im stationären Zyklusbetrieb, bestätigte Akte $N$ und alle Sprünge $K$ über wiederholte Fenster gleicher Länge zählen. Ergebnisform: $\mathrm{Var}(N)/\langle N\rangle^2$ gegen $1/\langle K\rangle$ und die Streuung von $T_n$ gegen $1/(\langle T_n\rangle\langle k\rangle)$. Auf einer Informationsmaschine mit Rückkopplungsfalle wie in [27] das Vorwärts- und das Rückwärtsexperiment ausführen, $\sigma_I$ aus den gemessenen Trajektorien berechnen und Teil 3 prüfen.
- **Die optimale Aktzeit (Vorhersage 1).** Das ist der Labortest.
  - *Aufbau.* Eine Kolloidkugel in Wasser der Temperatur $T$ sitzt in einer Rückkopplungsfalle [61]. Ihre Position wird alle $\Delta t$ gelesen, und eine Rückkopplungskraft erzeugt ein virtuelles Potential $U(x, t)$. Die Arbeit wird aus der Trajektorie durch stochastische Energetik berechnet, $W = \sum_t \partial_t U(x_t, t)\,\Delta t$ [319]. Eine Koordinate durchläuft den Ein-Bit-Aktzyklus in einer virtuellen Doppelmulde, zurückgesetzt in der Zeit $\tau$. Die andere wird am Scheitel einer virtuellen umgekehrten Mulde gehalten, $U = -\tfrac{1}{2}k x^2$, deren Instabilitätsrate $\Lambda$ durch $k$ und die Mobilität der Kugel festgelegt ist.
  - *Blöcke.* Für jeden Wert von $\Lambda$ laufen drei Blöcke verschränkt in randomisierter Reihenfolge. Block A: Akte ohne gehaltenes Ziel, bei neun oder mehr logarithmisch verteilten Werten von $\tau$ über mindestens zwei Dekaden; er passt $J_0$ und $a$ an. Block B: das gehaltene Ziel ohne Akte; er liefert die ständige Leistung $s$. Block C: beides zusammen, bei denselben Werten von $\tau$; er liefert $\iota(\tau)$. Mindestens 200 Zyklen pro Punkt.
  - *Durchlauf über $s$.* Mindestens vier Werte von $\Lambda$, die mindestens eine Dekade überspannen, sodass $s$ mindestens eine Dekade überspannt.
  - *Anpassung.* $J(\tau) = J_0 + a/\tau + s\tau$ an Block C mit gewichteten kleinsten Quadraten anpassen. Das gemessene $\tau^*$ am Maximum von $\iota(\tau)$ durch eine lokale quadratische Anpassung in $\ln\tau$ ablesen. $\sqrt{a/s}$ und sein Band $\delta\tau^*$ aus den Blöcken A und B berechnen. $\ln\tau^*$ auf $\ln s$ mit kleinsten Quadraten regressieren und die Steigung mit ihrem Standardfehler berichten.
  - *Falsifikation.* Die Behauptung scheitert, wenn die Steigung um mehr als zwei Standardfehler von $-1/2$ abweicht, oder ein gemessenes $\tau^*$ außerhalb von $\sqrt{a/s} \pm 2\delta\tau^*$ liegt, oder die Joule pro Akt von Block C von der Summe der Blöcke A und B jenseits ihres kombinierten 95%-Intervalls abweichen. Der letzte Test ist die Additivität auf einem Messgerät, der physikalische Gehalt der Vorhersage.
  - *Teststärke.* Der Standardfehler der Steigung muss unter 0.1 liegen. Andernfalls wird der Lauf als nicht schlüssig berichtet und der Durchlauf erweitert. Ein nicht schlüssiger Lauf ist kein Bestehen.
  - *Zweites Substrat.* Eine Einzelelektronenbox mit Ladungsdetektor wiederholt das Protokoll, mit $\langle A\rangle$ Sprung für Sprung gezählt [70]. Die Übereinstimmung auf zwei Substraten ist der Test.
  - Die gesamte Arbeit wird aus Trajektorien berechnet und als `trajectory_j` abgelegt.
- **Eine instabile Regelstrecke halten (Proposition 2).** Ein digitaler Regler hält eine Regelstrecke mit einem instabilen Modus von festem $|\lambda|$ pro Schritt, bei $f$ Schritten pro Sekunde. Den Regler mit M0 und M1 messen. Die Bits pro Schritt des Datensatzes protokollieren. Ergebnisform: gemessene Joule pro Schritt geteilt durch $k_B T\ln 2\log_2|\lambda|$, berichtet als Abstand zur Untergrenze. $|\lambda|$ und $f$ durchfahren.

<div id="89-living-agents-measured-ι" class="anchor-alias" aria-hidden="true"></div>

### 8.9 Lebende Agenten: gemessenes ι

Ergebnisform: $\iota$ in einem lebenden Präparat, als Bits pro Entscheidung geteilt durch Joule pro Entscheidung, beide im selben Präparat erhoben und mit dem Abstand zur Untergrenze berichtet. Ein lebendes $\iota$ zählt nur dann als gemessen, wenn beide Terme gemessen sind. Eine aus Leitfähigkeiten berechnete oder aus Bildgebung erschlossene Joule-Zahl wird als `est_j` abgelegt. Aus Hirnbildgebung erschlossene Entropieproduktion ist vergröbert und informationell, also kein Joule-Messgerät [257].

- **Bakterielle Chemotaxis.** Die Informationsrate aus dem Verhalten einzelner Zellen in einem definierten Gradienten, wie Mattingly und Kollegen sie gemessen haben [213]. Die Joule aus dem Sauerstoffverbrauch derselben Kultur, geteilt durch die Zellzahl. Die Vergleichsuntergrenze sind die Kosten, ein Bit durch den Signalkanal der Zelle zu senden, nach Bryant und Machta [197], neben $k_B T\ln 2$.
- **Visueller Kortex der Maus.** Orientierungsinformation pro Durchgang aus Zwei-Photonen-Bildgebung und synaptischer ATP-Verbrauch aus Ganzzellableitungen, wie Padamsey und Kollegen beides erhoben haben [250]. Nahrungsrestriktion verschiebt die Joule. Die gemessene Antwort der Information auf die Joule ist Vorzeichen und Größe von $dX/dJ$ in einem Kortex.
- **Gedächtnis der Fliege.** Der Energiefluss im Pilzkörper während der Bildung von Langzeitgedächtnis, abgebildet wie bei Plaçais und Kollegen [252], pro gelernter Assoziation, mit dem Behalten als Bestätigung. Das Überleben unter Hunger und Austrocknung sind die Ergebniskosten [251, 253].

<div id="810-the-joule-price-of-prediction-first" class="anchor-alias" aria-hidden="true"></div>

### 8.10 Der Joule-Preis von Vorhersage zuerst

Ergebnisform. Die gemessenen Joule jedes Aktes in den Anteil der Vorlage und den Rest aufteilen, $J_k = J_k^{R^*} + J_k^{\mathrm{act}}$. $J_k^{R^*}$ umfasst das Schreiben, Halten und Zurücksetzen von $R^*(a)$. Eine Vorlage mit $H(R^*)$ Bits Entropie zurückzusetzen, kostet mindestens $H(R^*)\,k_B T\ln 2$ [6, 24]. Gedächtnis, das nicht vorhersagt, kostet Dissipation [54]. Eine Vorlage erhöht $\iota$, wenn die Aktjoule, die sie einspart, ihre eigenen Joule übersteigen. Das gemessene Ergebnis ist die Kurve $\iota(w)$ über der Vorlagenbreite $w$, den Bits von $R^*$, mit ihrem Maximierer $w^*$ und dem Verhältnis $\Delta J^{\mathrm{act}}/\Delta J^{R^*}$ bei jedem Schritt.

Protokoll. Aufgaben, Gänge, Prädikate und Budgets festlegen. $w$ über ein vorab festgelegtes Raster variieren. Ein Akt darf anhalten, sobald sein Ergebnis gegenüber der Vorlage entschieden ist. `template_j` und die verbleibenden Joule des Aktes für jeden Akt protokollieren, auf denselben Messgeräten.

Vorhandene Befunde: Sichere Vorhersage senkte den kortikalen Sauerstoffverbrauch beim Menschen um bis zu 12%, gemessen durch metabolische Bildgebung (Preprint) [254]. In zellulären Netzen sind die Bits der Vergangenheit, die die Zukunft am besten vorhersagen, unerschwinglich teuer [198]. In Wahrnehmungs-Handlungs-Schleifen wägen arbeitseffiziente Agenten Vorhersage gegen Vergessen ab [234].

<div id="811-first-run-a-metered-acceptor-on-a-laptop" class="anchor-alias" aria-hidden="true"></div>

<div id="811-first-run-a-kernel-reported-acceptor-on-a-laptop" class="anchor-alias" aria-hidden="true"></div>

### 8.11 Erster Lauf: ein Akzeptor mit vom Kernel berichteter Energie auf einem Laptop

Dieser Lauf wendet die Abschnitte 8.1 bis 8.7 auf eine Aufgabenklasse auf einer Maschine an. Code, Aufgabenmengen, Belege und Analyse liegen im Repository der Website unter `experiments/agency-run`. Die Präregistrierung und ihre Falsifikatoren wurden zuerst committet (e830bff). Der Pilotlauf und die festgeschriebene Kalibrierung folgten (5828420), danach der Hauptlauf (35c967a).

**Methode.**

- **Agent und Aufgabe.** Ein Python-Prozess löst Sudoku-Rätsel. Das Vollständigkeitsprädikat $C(z)$ ist erfüllt, wenn das Gitter voll ist, jede Zeile, jede Spalte und jeder Block die Ziffern 1 bis 9 enthält und jede Vorgabe erhalten bleibt. Eine bestätigte Aufgabe schreibt $b = n_{\mathrm{empty}}\log_2 9$ Bits gut, die Zahl der Füllungen, zwischen denen der Akt wählt. Das ist die Kapazitätsschranke aus Definition 1. Die Testmenge umfasst 30 Rätsel, 10 pro Schicht (leicht, mittel, schwer), erzeugt aus einem festen Seed. Eine separate Menge von 30 Rätseln kalibriert die Selektoren.
- **Gänge.** g0 füllt nackte Einzelne (naked singles). g1 fügt versteckte Einzelne (hidden singles) hinzu. g2 fügt Tiefensuche hinzu.
- **Arme.** Der σ-Gesetz-Selektor nimmt $a^* = \arg\max[H(a) - \lambda J(a)]$, wobei $H(a)$ die kalibrierte Erfolgswahrscheinlichkeit, gegeben die bereits probierten Gänge, mal $b$ ist, und $\lambda = b/B$. Die feste Kaskade (eine Instanz von Mixture of Limits) nimmt den günstigsten Gang, dessen kalibrierte Erfolgswahrscheinlichkeit mindestens 0.5 beträgt. Beide legen $R^*$ vor jedem Akt fest, hashen es mit SHA-256 (Secure Hash Algorithm, 256 Bit) und versehen es mit einem Zeitstempel. Beide vergleichen nach dem Akt und lehnen mit einem Beleg ab, wenn kein Akt in das Budget passt. Die zielblinde Referenz zieht einen Gang zufällig, ohne Vorhersage, ohne Vergleich, ohne Eskalation und ohne Ablehnung. Das Budget bricht sie ab.
- **Budgets und Seeds.** Pro Aufgabe gilt $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, der Median von g2 allein im Pilotlauf. Die Stufen 0.5 und 1.0 binden: 98% und 40% der Pilotläufe überschreiten sie. Die Stufe 2.0 bindet nicht (0.7%). Es gibt 20 Seeds pro Bedingung, in einer per Seed festgelegten, verschränkten Reihenfolge. Insgesamt liefen 5,400 Episoden mit 4,940 Akten.
- **Energiekennzeichnung.** Jedes Joule ist `reported_j`: die Energieschätzung des Kernels pro Prozess für den Agenten (`ri_energy_nj` aus `proc_pid_rusage`), vor und nach jedem Akt gelesen, ohne Privilegien. Der Prozess ist die Wand des Agenten. Das Sudoku-Gitter wird innerhalb dieses Prozesses gehalten, sodass die Welt $W'$ nicht, wie Definition 2 es verlangt, außerhalb von $S$ liegt. Dieser Lauf prüft die Kinematik und die torbedingte Rangordnung, nicht die Definition. Der Lauf, der die Definition prüft, hält das Gitter in einem zweiten Prozess hinter einem Socket oder auf einem Mikrocontroller. `measured_j` ist leer, weil kein Wandsteckdosen-Messgerät angeschlossen war. `est_j` ist die Zahl der Zyklen mal $4.20 \times 10^{-10}$ J, das mediane Verhältnis des Pilotlaufs.

**Ergebnisse.** Mittelwert ± Standardabweichung über 20 Seeds. Ein Lauf ist ein Arm bei einer Budgetstufe über alle 30 Aufgaben. CV ist der Variationskoeffizient, Standardabweichung geteilt durch Mittelwert.

| Arm | $B/J_{g2}$ | Abgeschlossene Aufgaben von 30 | $X$ (Bits) | $J$ (berichtet, mJ) | $\iota$ (Bits pro berichtetem Joule) | CV von $\iota$ | Ablehnungen | Abbrüche | Überschreitungen |
|---|---|---|---|---|---|---|---|---|---|
| σ-Gesetz | 0.5 | 0.60 ± 0.50 | 108 ± 91 | 20.8 ± 0.3 | 5,254 ± 4,402 | 0.84 | 29.40 | 0 | 0 |
| σ-Gesetz | 1.0 | 9.10 ± 1.86 | 1,479 ± 316 | 43.8 ± 4.0 | 34,454 ± 10,007 | 0.29 | 20.90 | 0 | 9 |
| σ-Gesetz | 2.0 | 28.40 ± 0.60 | 4,823 ± 105 | 66.2 ± 5.8 | 73,345 ± 6,443 | 0.09 | 1.60 | 0 | 0 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 0.5 | 0.70 ± 0.47 | 126 ± 85 | 18.8 ± 0.3 | 6,801 ± 4,569 | 0.67 | 29.30 | 0 | 0 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 1.0 | 6.45 ± 1.50 | 1,047 ± 254 | 44.7 ± 3.6 | 23,804 ± 7,067 | 0.30 | 23.55 | 0 | 7 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 2.0 | 27.50 ± 0.51 | 4,668 ± 92 | 67.0 ± 6.7 | 70,418 ± 7,766 | 0.11 | 2.50 | 0 | 0 |
| Zielblind | 0.5 | 0.25 ± 0.44 | 45 ± 80 | 14.1 ± 3.1 | 2,775 ± 4,999 | 1.80 | 0 | 20.35 | 20 |
| Zielblind | 1.0 | 3.85 ± 1.84 | 623 ± 301 | 26.6 ± 5.7 | 24,153 ± 13,364 | 0.55 | 0 | 17.45 | 0 |
| Zielblind | 2.0 | 18.25 ± 2.71 | 3,034 ± 471 | 34.1 ± 9.7 | 92,724 ± 15,690 | 0.17 | 0 | 1.35 | 0 |

- **Pro Akt.** 1,902 Akte wurden bestätigt. Das mediane $\iota$ pro Akt betrug $1.53 \times 10^5$ Bits pro berichtetem Joule, mit einem Interquartilsabstand von $8.3 \times 10^4$ bis $4.7 \times 10^5$. Die Joule pro bestätigtem Bit betrugen mindestens das $3.8 \times 10^{14}$-Fache von $k_B T\ln 2$ bei 300 K, im Median das $2.3 \times 10^{15}$-Fache. Die Untergrenze erlaubt $3.5 \times 10^{20}$ Bits pro Joule.
- **Joule pro abgeschlossener Aufgabe.** Der Median über die Arme betrug 0.34 bis 0.38 mJ für leichte Aufgaben, 1.58 bis 1.70 mJ für mittlere und 4.05 bis 4.28 mJ für schwere.
- **Selektoren, gepaart nach Seed (explorativ, post hoc).** Diese Analyse wurde nach dem Lauf gewählt, ist also explorativ. Bei $B = 1.0\,J_{g2}$ schloss der σ-Gesetz-Selektor pro Lauf 2.65 Aufgaben mehr ab als die feste Kaskade (95%-Bootstrap-Intervall 1.5 bis 3.8). Sein $\iota$ pro Lauf war um 10,650 Bits pro Joule höher (4,747 bis 16,592). Bei $B = 2.0\,J_{g2}$ schloss er 0.9 mehr ab (0.55 bis 1.25). Die σ-Gesetz-Regel geht direkt zu dem Gang, der ausreicht, sodass die Joule gescheiterter leichter Versuche im Budget bleiben. Die Joule pro abgeschlossener Aufgabe waren gleich: Bei den 4 Aufgaben, die beide Arme bei $B = 1.0\,J_{g2}$ abschlossen, reichte das gepaarte Intervall von $-7.9$ bis $+15.5$ µJ (R-F1).
- **Gegenprüfung am Package.** powermetrics, nicht interaktiv über Fenster von 30 s ausgeführt, las etwa 12.1 W CPU-Leistung und 13.6 W GPU-Leistung aus anderer Arbeit auf der Maschine, während der Agent ruhte. Der Agent fügte auf seinem eigenen Messgerät etwa 0.6 W hinzu. Die CPU-Hintergrundleistung schwankte zwischen den Fenstern um etwa 0.5 W, sodass die um den Leerlauf bereinigten Package-Joule negativ ausfielen. Das Messgerät pro Prozess ist das Messgerät des Laufs. D1 und D5 brauchen ein Wandsteckdosen-Messgerät an einer ansonsten ruhenden Maschine.

**Ergebnisse der Falsifikatoren.** Alle wurden vor dem Lauf festgelegt.

| ID | Beobachtung | Ergebnis |
|---|---|---|
| R-F1 | Das 95%-Intervall der gepaarten Differenz pro Aufgabe im Median von $J^*$, σ-Gesetz minus feste Kaskade, schließt bei jeder bindenden Stufe null ein | Ausgelöst. Bei $B = 1.0$, 4 von beiden abgeschlossene Aufgaben: Intervall $-7.9$ bis $+15.5$ µJ. Bei $B = 0.5$ keine von beiden abgeschlossene Aufgabe. Bei Aufgaben, die beide abschließen, sind die Joule gleich |
| R-F2 | Irgendeine Episode endet über ihrem Budget | Ausgelöst. 36 von 5,400. σ-Gesetz 9 und feste Kaskade 7 bei $B = 1.0$, 0.07% bis 3.6% darüber, wenn der abschließende Vergleich außerhalb des Wächters lief. Zielblind 20 bei $B = 0.5$, bis zu 33% darüber, bei Budgets, die nur wenige Prüfungen des Messgeräts breit sind |
| R-F3 | Trefferquote der Ablehnung unter 0.9 bei undurchführbaren Aufgabenstufen, oder mehr als 10% der Ablehnungen bei Aufgabenstufen, die irgendein Arm in der Hälfte der Seeds abschließt | Ausgelöst. Trefferquote 1.00 bei 41 undurchführbaren Aufgabenstufen. 13.1% der Ablehnungen betrafen Aufgabenstufen, die irgendein Arm abschloss |
| R-F4 | Kendalls Tau-b zwischen `est_j` und `reported_j` pro Akt unter 0.8 | Gehalten. 0.96 bei 4,000 Akten |
| R-F5 | CV des $\iota$ pro Lauf über 0.25 in irgendeiner Bedingung | Ausgelöst bei bindenden Stufen (0.29 bis 1.80). Gehalten bei $B = 2.0$ (0.09, 0.11, 0.17) |
| R-F6 | Die Rangordnung nach $J^*$ weicht von der Rangordnung nach integriertem $\iota$ ab | Ausgelöst. Bei $B = 2.0$ ordnet $J^*$ σ-Gesetz, feste Kaskade, zielblind. Das integrierte $\iota$ setzt zielblind auf den ersten Rang. Bei $B = 1.0$ tauschen die letzten beiden die Plätze |
| R-F7 | Ein bestätigter Akt unter $k_B T\ln 2$ pro Bit | Gehalten. Der niedrigste Akt lag um das $3.8 \times 10^{14}$-Fache darüber |
| R-F8 | Das $\iota$ pro Lauf der zielblinden Referenz erreicht bei einer bindenden Stufe mindestens das des besseren Selektors | Gehalten. 2,775 gegenüber 6,801 bei $B = 0.5$. 24,153 gegenüber 34,454 bei $B = 1.0$ |

**Was der Lauf klärt.**

- $\iota$ wird an Belegen abgelesen, Akt für Akt und Lauf für Lauf, wie es die Propositionen 5 und 6 verlangen. Bei lockerem Budget ist es über Seeds stabil.
- $J^*$ ist die Rangordnung, das integrierte $\iota$ nicht. Der zielblinde Agent hatte beim lockeren Budget das höchste $\iota$ pro Lauf und schloss 18 von 30 Aufgaben ab, gegenüber 28. Seine Fehlschläge waren billig. $J^*$ ist durch $C(z)$ torbedingt und setzt diesen Agenten daher auf den letzten Rang. Deshalb ordnet Abschnitt 2.3 nach $J^*$, mit $X_{\mathrm{req}}$ als Tor.
- Explorativ, post hoc: Unter einem bindenden Budget schloss der σ-Gesetz-Selektor mehr Aufgaben ab als die feste Kaskade, und die Joule pro abgeschlossener Aufgabe waren gleich. Der Gewinn liegt darin, welche Aufgaben in das Budget passen, nicht in einem günstigeren Abschluss derselben Aufgabe. Abschnitt 8.11.2 gibt an, was die späteren Läufe wiederholen.
- Zwei Korrekturen der Implementierung kommen vor dem nächsten Lauf. Der Vergleich und das Schreiben des Belegs wandern in den bewachten Bereich. Gemessene Abschlusskosten werden vor jedem Akt angerechnet.

Abbildung 4 stellt das Tor neben die gemessene Rangordnung beim lockeren Budget.

![Diagramm und Daten. Kandidatenläufe passieren das Tor C von z, X mindestens X erforderlich. Diejenigen, die es passieren, werden nach J Stern geordnet, den geringsten Joule bis zur korrekten Fertigstellung; diejenigen, die scheitern, werden nicht geordnet. Darunter Lauf 1 bei Budget 2.0: σ-Gesetz schloss 28.40 von 30 Aufgaben ab, mit iota pro Lauf von 73,345 Bits pro Joule; feste Kaskade 27.50 mit 70,418; zielblind 18.25 mit 92,724. Das integrierte iota allein würde den zielblinden Agenten auf den ersten Rang setzen.](/figures/agency/gate-then-rank.svg)

*Abbildung 4. Zuerst das Tor, dann die Rangordnung nach Joule. Diagramm mit Daten aus Lauf 1 bei $B = 2.0\,J_{g2}$, Mittelwerte über 20 Seeds aus der obigen Ergebnistabelle; das integrierte $\iota$ allein würde den zielblinden Agenten auf den ersten Rang setzen (R-F6). Quelle: `experiments/agency-run/results`. Eine [PNG-Kopie](/figures/agency/gate-then-rank.png) liegt vor.*

<div id="8111-second-run-guarded-acceptor-40-seeds" class="anchor-alias" aria-hidden="true"></div>

### 8.11.1 Zweiter Lauf: bewachter Akzeptor, 40 Seeds

Dieser Lauf verwendet dieselbe Aufgabenklasse, dieselben Gänge und dieselben drei Arme wie Abschnitt 8.11, auf demselben Laptop. Die Präregistrierung für den zweiten Lauf wurde zuerst committet (610dd4c). Der Pilotlauf und die festgeschriebene Kalibrierung folgten (c88511f), danach der Hauptlauf (920d7e2). Vorhersage 1 hat in diesem Lauf kein Software-Gegenstück: Der Agent hat keine deklarierten Aktkosten, die mit der Aktzeit fallen, und keine ständigen Kosten, die er steuert, daher hält die Präregistrierung fest, dass das Dosis-Wirkungs-Design nicht ausgeführt wird.

**Methode.**

- **Wächter.** Jedes Joule einer Episode wird innerhalb des Wächters angerechnet: Auswahl, Hash, Gangschritte, Vergleich, Beleg und abschließende Ablesung. Die Eingangsprüfung verwendet Verbrauch $= 0$. Die Gesetzesarme lehnen ab, wenn der Wächter scheitert. Der zielblinde Arm wird abgebrochen.
- **Ablehnungsschwelle.** Beide Selektoren verwenden für die Prüfung, ob ein Akt in das Budget passt, das $r$-Quantil der Kalibrierkosten. $r$ wurde vor dem Hauptlauf aus einer Wiederholung der Kalibrierung festgeschrieben: $r = 0.1$, mit Trefferquote 1.0 und Präzision von etwa 0.976 auf dem Kalibrierteil.
- **Budgets und Seeds.** Pro Aufgabe gilt $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, der Median von g2 allein im Pilotlauf. Die Stufen 0.5 und 1.0 binden: Die Anteile der Pilotläufe, die sie überschreiten, betragen 0.98 und 0.4. Die Stufe 2.0 bindet nicht (0.0067). Es gibt 40 Seeds pro Bedingung. Insgesamt liefen 10,800 Episoden.
- **Ruhefenster.** Ruhe wurde nicht erreicht. Die Prüfungen liefen bis zur Grenze. Die letzte Prüfung vor dem Start, um 21:46 Ortszeit, verzeichnete eine CPU-Last anderer Prozesse von nahezu 621% eines Kerns, mit mediaanalysisd und Hilfsprozessen des Editors an der Spitze. Die Grundleistung des Package betrug etwa 21.4 W. Die Package-Leistung im Hauptfenster betrug etwa 22.7 W. Der Lauf verzeichnet `quiet_window = no`.
- **Energiekennzeichnung.** Jedes Joule ist `reported_j`: die Energieschätzung des Kernels pro Prozess für den Agenten (`ri_energy_nj` aus `proc_pid_rusage`), mit Package-Zahlen aus powermetrics, wo sie für die Gegenprüfung verwendet werden. `est_j` ist die Zahl der Zyklen mal $1.783 \times 10^{-9}$ J, im Pilotlauf festgeschrieben. `measured_j` ist leer: Es war kein Wandsteckdosen-Messgerät angeschlossen.
- **Gegenprüfung am Package.** Im Hauptfenster las das Prozessmessgerät 42.35 J. Die Netto-Package-Joule betrugen 121.81 J, ein Verhältnis von etwa 2.88 zum Prozess. Die Drift der Grundleistung des Package betrug etwa $-0.082$ W. Weil `quiet_window = no` gilt, wird die Gegenprüfung als nicht erreichbar erklärt. Das Messgerät pro Prozess bleibt das Messgerät des Laufs.

**Ergebnisse.** Mittelwert ± Standardabweichung über 40 Seeds. Ein Lauf ist ein Arm bei einer Budgetstufe über alle 30 Aufgaben. CV ist der Variationskoeffizient, Standardabweichung geteilt durch Mittelwert. $J$ wird zum Vergleich mit Abschnitt 8.11 in Millijoule berichtet.

| Arm | $B/J_{g2}$ | Abgeschlossene Aufgaben von 30 | $X$ (Bits) | $J$ (berichtet, mJ) | $\iota$ (Bits pro berichtetem Joule) | CV von $\iota$ | Ablehnungen | Abbrüche | Überschreitungen |
|---|---|---|---|---|---|---|---|---|---|
| σ-Gesetz | 0.5 | 0.62 ± 0.49 | 113 ± 89 | 59.5 ± 2.0 | 1,942 ± 1,525 | 0.785 | 29.38 | 0 | 0 |
| σ-Gesetz | 1.0 | 2.90 ± 1.74 | 523 ± 314 | 133.7 ± 13.8 | 4,150 ± 2,892 | 0.697 | 27.10 | 0 | 0 |
| σ-Gesetz | 2.0 | 22.73 ± 1.30 | 3,980 ± 206 | 197.3 ± 18.2 | 20,359 ± 2,388 | 0.117 | 7.28 | 0 | 0 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 0.5 | 0.57 ± 0.50 | 104 ± 90 | 60.1 ± 2.1 | 1,777 ± 1,548 | 0.871 | 29.43 | 0 | 0 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 1.0 | 2.67 ± 1.25 | 483 ± 226 | 140.3 ± 13.5 | 3,593 ± 1,948 | 0.542 | 27.32 | 0 | 0 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 2.0 | 19.93 ± 1.42 | 3,509 ± 227 | 201.2 ± 20.4 | 17,684 ± 2,909 | 0.164 | 10.07 | 0 | 0 |
| Zielblind | 0.5 | 0.12 ± 0.33 | 23 ± 61 | 35.4 ± 11.6 | 513 ± 1,397 | 2.723 | 0 | 22.85 | 0 |
| Zielblind | 1.0 | 1.00 ± 0.93 | 181 ± 169 | 72.0 ± 19.5 | 2,661 ± 2,579 | 0.969 | 0 | 20.00 | 0 |
| Zielblind | 2.0 | 10.65 ± 2.27 | 1,859 ± 400 | 97.3 ± 30.1 | 20,302 ± 5,766 | 0.284 | 0 | 8.70 | 0 |

- **Pro Akt.** 7,960 Akte liefen. 2,448 wurden bestätigt. Kendalls Tau-b zwischen `est_j` und `reported_j` betrug 0.942 bei 4,000 Akten. Das mediane $\iota$ pro Akt betrug etwa $3.11 \times 10^{4}$ Bits pro berichtetem Joule. Jeder bestätigte Akt lag weit über $k_B T\ln 2$ pro Bit: Der niedrigste lag etwa um das $6.4 \times 10^{14}$-Fache über dieser Untergrenze.
- **Ablehnung.** Die Trefferquote betrug 1.0 bei 49 undurchführbaren Paaren. Es gab 5,223 Ablehnungen. Der Anteil bei Aufgaben, die irgendein Arm abschloss, betrug etwa 0.081.
- **Überschreitungen.** Keine Episode endete über dem Budget. Der maximale Überschreitungsanteil betrug $-0.03684$: Jede Episode endete unter dem Budget.
- **Selektoren, gepaart nach Seed.** Diese Analyse wurde in der Präregistrierung angekündigt. Bei $B = 2.0\,J_{g2}$ schloss der σ-Gesetz-Selektor pro Lauf 2.8 Aufgaben mehr ab als die feste Kaskade (95%-Bootstrap-Intervall 2.3 bis 3.275). Sein $\iota$ pro Lauf war um 2,674 Bits pro Joule höher (1,831 bis 3,504). Bei 39 von 40 Seeds schloss der σ-Gesetz-Selektor mehr ab. Bei $B = 0.5$ und $B = 1.0$ schließen die Intervalle für die Differenz der abgeschlossenen Aufgaben null ein. Diese Ergebnisse lösen keinen Falsifikator aus.

**Ergebnisse der Falsifikatoren.** Alle wurden vor dem Lauf festgelegt. Die Tabelle stellt das Ergebnis des zweiten Laufs neben das des ersten.

| ID | Beobachtung | Lauf 2 | Lauf 1 |
|---|---|---|---|
| R-F1 | Bei jeder bindenden Stufe schließt das 95%-Intervall der gepaarten Differenz pro Aufgabe im Median von $J^*$, σ-Gesetz minus feste Kaskade, null ein oder liegt darüber | Gehalten, weil sich kein Intervall bilden ließ: Bei $B = 1.0$ schlossen beide keine gemeinsame Aufgabe ab, bei $B = 0.5$ eine. Die Joule gemeinsamer Aufgaben zeigen keine Einsparung durch das σ-Gesetz | Ausgelöst |
| R-F2 | Irgendeine Episode endet über ihrem Budget | Gehalten. 0 von 10,800. Der Wächter rechnet Vergleich, Beleg und abschließende Ablesung an | Ausgelöst |
| R-F3 | Trefferquote der Ablehnung unter 0.9 bei undurchführbaren Paaren, oder mehr als 10% der Ablehnungen bei Paaren, die irgendein Arm abschließt | Gehalten. Trefferquote 1.0 bei 49 undurchführbaren Paaren. Anteil bei Aufgaben, die irgendein Arm abschloss, etwa 0.081. Die Ablehnungsschwelle über das $r$-Quantil ist die Änderung gegenüber Lauf 1 | Ausgelöst |
| R-F4 | Kendalls Tau-b zwischen `est_j` und `reported_j` pro Akt unter 0.8 | Gehalten. 0.942 bei 4,000 Akten | Gehalten |
| R-F5 | CV des $\iota$ pro Lauf über 0.25 in irgendeiner Bedingung | Ausgelöst bei bindenden Stufen (0.54 bis 2.72) und für den zielblinden Arm bei $B = 2.0$ (0.284). Gehalten für beide Selektoren bei $B = 2.0$ (0.117, 0.164) | Ausgelöst |
| R-F6 | Die Rangordnung nach $J^*$ weicht von der Rangordnung nach integriertem $\iota$ ab | Ausgelöst. Bei $B = 2.0$ ordnet $J^*$ σ-Gesetz, feste Kaskade, zielblind. Das integrierte $\iota$ ordnet σ-Gesetz, zielblind, feste Kaskade | Ausgelöst |
| R-F7 | Ein bestätigter Akt unter $k_B T\ln 2$ pro Bit | Gehalten. Der niedrigste Akt lag etwa um das $6.4 \times 10^{14}$-Fache darüber | Gehalten |
| R-F8 | Das $\iota$ pro Lauf der zielblinden Referenz erreicht bei einer bindenden Stufe mindestens das des besseren Selektors | Gehalten. 513 gegenüber 1,942 bei $B = 0.5$. 2,661 gegenüber 4,150 bei $B = 1.0$ | Gehalten |

**Was der Lauf klärt.**

- Der Wächter schließt R-F2. Null Überschreitungen.
- Das Ablehnungsquantil schließt R-F3. Die Trefferquote bleibt 1.0, und der Anteil der Ablehnungen bei abschließbaren Aufgaben fällt unter 10%.
- $J^*$ bleibt die Rangordnung. Das integrierte $\iota$ weicht beim lockeren Budget weiterhin davon ab (R-F6).
- Das $\iota$ pro Lauf ist bei bindenden Budgets über Seeds weiterhin instabil (R-F5).
- R-F1 hielt nur, weil zu wenige Aufgaben von beiden Selektoren abgeschlossen wurden, um ein Intervall zu bilden. Kein Lauf zeigt, dass der σ-Gesetz-Selektor eine gemeinsame Aufgabe mit weniger Joule abschließt. Der nach Seed gepaarte Gewinn bei $B = 2.0$ besteht aus mehr abgeschlossenen Aufgaben, nicht aus günstigeren Abschlüssen derselben Aufgaben.

<div id="8112-second-machine-a-replication-with-a-package-energy-counter" class="anchor-alias" aria-hidden="true"></div>

### 8.11.2 Zweite Maschine: eine Replikation mit einem Package-Energiezähler

Dieser Lauf wiederholt das Protokoll des zweiten Laufs aus Abschnitt 8.11.1 auf einer zweiten Maschine mit einem anderen Energiezähler. Er ist eine Replikation des Selektorvergleichs, keine Energiemessung. Code, Belege und Zusammenfassungen liegen in `experiments/agency-run`: `PREREGISTRATION_v2_jetson.md` und dessen Amendment 1, `results_jetson/summary.md` (Teil A) und `results_jetson_cyc/summary.md` (Teil B). Der Nachtrag zur Präregistrierung wurde zuerst committet (cb059f0), dann das Backend des Messgeräts und die Testumgebung (1938577), dann Amendment 1 (7703822). Es folgten der Pilotlauf von Teil A (6ddd086) und sein Hauptlauf (a652503), dann der Pilotlauf von Teil B (3fde1fb) und sein Hauptlauf (1bb2444).

**Methode.**

- **Maschine.** Ein Linux-Laptop mit einem x86-Prozessor mit 14 Kernen: 6 Leistungskerne mit je 2 Threads und 8 Effizienzkerne. Turbo war ausgeschaltet. Jeder Kern war auf seine Basisfrequenz festgelegt: 2.6 GHz auf Leistungskernen und 1.9 GHz auf Effizienzkernen. Der Agent lief fest an einen Thread eines Leistungskerns gebunden, eine Episode nach der anderen. Die mediane Frequenz des Agentenkerns während der Blöcke betrug 2.6 GHz. Die ursprünglichen Einstellungen wurden nach dem Lauf wiederhergestellt.
- **Unverändert.** Aufgaben, Prädikat, gekoppelte Bits, die Gänge g0 bis g2, die drei Arme, der Wächter, die Wiederholung der Kalibrierung für die Ablehnung, die Budgetstufen $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, 40 Seeds und 10,800 Episoden pro Teil, die Falsifikatoren R-F1 bis R-F8 und die nach Seed gepaarte Analyse sind die aus Abschnitt 8.11.1.
- **Energiezähler.** RAPL (Running Average Power Limit) ist der Package-Energiezähler auf dem Chip des Prozessors. Jedem Intervall wurden die Package-Joule abzüglich der Leerlaufleistung des jeweiligen Blocks mal der Sekunden des Intervalls angerechnet. RAPL ist ein Modell und Sensor im Chip, kein Wandsteckdosen-Messgerät. Es zählt jeden Prozess auf dem Package.
- **Ruhefenster.** Ruhe wurde nicht erreicht: `quiet_window = no`. Ein CI-Runner (Continuous Integration) baute während der gesamten Zeit Rust-Code auf der Maschine. Die 40 Prüfungen vor dem Start sahen andere Prozesse, die 1.0 bis 20.0 Kerne nutzten, und eine Package-Leistung von 2.3 bis 28.7 W. Die Prüfung pro Block war vor 180 von 360 Blöcken in Teil A und vor 244 von 360 in Teil B erfüllt. 98 beziehungsweise 208 Blöcke waren über ihre ganze Dauer ruhig.
- **Teil A.** Das Messgerät des Agenten ist RAPL, gelesen vor und nach jedem Akt. Jede Zahl ist `reported_j`.
- **Teil B.** Amendment 1 fügte diesen Teil vor jedem Pilotlauf hinzu, weil ein Test der Testumgebung zeigte, dass Akte etwa 0.01 bis 6 ms dauern, während RAPL etwa jede 1 ms in Schritten von etwa 5 bis 60 mJ aktualisiert. Das Messgerät des Agenten ist `est_j`: die User-Zyklen des Agenten-Threads mal $c$. $c$ wurde im Pilotlauf von Teil B an RAPL kalibriert, abzüglich des Leerlaufs, über 8 Runden von 3 s, im zweiten Versuch: $c = 6.576 \times 10^{-10}$ J pro Zyklus, aus 41.11 J Netto-Package-Energie über 62,516,635,701 Zyklen. Jede Joule-Zahl von Teil B ist `est_j`. Daneben protokollierte RAPL-Zahlen bleiben `reported_j`.
- **Kennzeichnungen.** `measured_j` ist in beiden Teilen leer. Es war weder ein Wandsteckdosen-Messgerät noch ein Shunt-Messgerät angeschlossen.
- **Armnamen.** Die Armnamen und ihre Codefelder folgen Abschnitt 8.3. Die zielblinde Referenz ist `blind`.

**Ergebnisse von Teil A: RAPL pro Akt gelesen.** Mittelwert ± Standardabweichung über 40 Seeds. $J$ ist `reported_j` in Joule, wie in der Zusammenfassung. Die Stufen 0.5, 1.0 und 2.0 binden alle: 0.647, 0.40 und 0.353 der g2-Pilotläufe überschreiten sie.

| Arm | $B/J_{g2}$ | Abgeschlossene Aufgaben von 30 | $X$ (Bits) | $J$ (berichtet, J) | $\iota$ (Bits pro berichtetem Joule) | CV von $\iota$ | Ablehnungen | Abbrüche | Überschreitungen |
|---|---|---|---|---|---|---|---|---|---|
| σ-Gesetz | 0.5 | 0.00 | 0 | 0.0018 | 0 | n. v. | 30.00 | 0.00 | 323 |
| σ-Gesetz | 1.0 | 0.00 | 0 | 0.0002 | 0 | n. v. | 30.00 | 0.00 | 322 |
| σ-Gesetz | 2.0 | 1.00 ± 0.39 | 181 ± 71 | 0.0018 ± 0.0336 | 14,427 ± 18,680 | 1.295 | 29.00 | 0.00 | 322 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 0.5 | 0.00 | 0 | -0.0008 | 0 | n. v. | 30.00 | 0.00 | 326 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 1.0 | 0.00 | 0 | -0.0005 | 0 | n. v. | 30.00 | 0.00 | 324 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 2.0 | 1.00 ± 0.51 | 181 ± 91 | 0.0107 ± 0.0286 | 15,451 ± 23,767 | 1.538 | 29.00 | 0.00 | 320 |
| Zielblind | 0.5 | 0.00 | 0 | 0.0026 | 0 | n. v. | 0.00 | 30.00 | 327 |
| Zielblind | 1.0 | 0.00 | 0 | 0.0009 | 0 | n. v. | 0.00 | 30.00 | 323 |
| Zielblind | 2.0 | 0.28 ± 0.45 | 50 ± 82 | 0.0019 ± 0.0180 | 3,801 ± 13,749 | 3.618 | 0.00 | 28.90 | 321 |

- **Auflösung des Zählers.** Die mediane Episode dauerte etwa 0.04 ms. 10,075 von 10,800 Episoden sahen keine Änderung des Package-Zählers. 10,549 hatten nach Abzug des Leerlaufs ein `reported_j` von null oder darunter.
- **Budgets.** Die Pilotmediane von $J_{g2}$ reichten von $-0.0110$ bis $0.0914$ J, Median $0.0097$ J. Die Öffnungsschwelle des Wächters betrug 0.117 J. Die Budgets lagen bei den drei Stufen für 30, 30 und 28 von 30 Aufgaben darunter, sodass die Gesetzesarme fast jede Aufgabe ablehnten.
- **Überschreitungen.** Jede Bedingung verzeichnete 320 bis 327 Überschreitungen. Der maximale Überschreitungsanteil betrug 10.86. Eine Anrechnung, die für die meisten Akte null und für einige wenige einen ganzen Zählerschritt liest, kann kein Budget von wenigen Millijoule einhalten.
- **Pro Akt.** 137 Akte liefen. 91 wurden bestätigt. 44 Akte lasen null. 26 bestätigte Akte lasen null oder weniger. Kendalls Tau-b zwischen `est_j` und `reported_j` betrug 0.368 bei 93 Akten.
- **Gegenprüfung.** Der Netto-Package-Wert der Blöcke betrug 3.445 J gegenüber 2.737 J, summiert über die Episoden, ein Verhältnis von 0.794. Die Leerlaufleistung des Package betrug vor dem Lauf 4.01 W und danach 5.55 W. Die Gegenprüfung wird als nicht erreichbar erklärt.
- **Selektoren, gepaart nach Seed.** Bei $B = 2.0\,J_{g2}$ betrug die Differenz der abgeschlossenen Aufgaben 0 (95%-Bootstrap-Intervall $-0.15$ bis $0.15$). Die Differenz des $\iota$ pro Lauf betrug 1,328 Bits pro berichtetem Joule ($-8,971$ bis $12,581$). 30 von 40 Seeds endeten gleich. Bei 0.5 und 1.0 schloss kein Arm eine Aufgabe ab.

**Ergebnisse von Teil B: Zyklenzahl mal eine an RAPL kalibrierte Konstante.** Mittelwert ± Standardabweichung über 40 Seeds. $J$ ist `est_j` in Joule, wie in der Zusammenfassung. Die Stufen 0.5 und 1.0 binden: 0.98 und 0.40 der g2-Pilotläufe überschreiten sie. Die Stufe 2.0 bindet nicht (0.0).

| Arm | $B/J_{g2}$ | Abgeschlossene Aufgaben von 30 | $X$ (Bits) | $J$ (geschätzt, J) | $\iota$ (Bits pro geschätztem Joule) | CV von $\iota$ | Ablehnungen | Abbrüche | Überschreitungen |
|---|---|---|---|---|---|---|---|---|---|
| σ-Gesetz | 0.5 | 1.10 ± 0.98 | 200 ± 178 | 0.0345 ± 0.0017 | 6,027 ± 5,458 | 0.906 | 28.90 | 0.00 | 0 |
| σ-Gesetz | 1.0 | 8.75 ± 3.14 | 1,574 ± 565 | 0.0805 ± 0.0098 | 20,519 ± 8,516 | 0.415 | 21.25 | 0.00 | 0 |
| σ-Gesetz | 2.0 | 28.60 ± 0.98 | 4,882 ± 154 | 0.1008 ± 0.0234 | 50,667 ± 10,088 | 0.199 | 1.40 | 0.00 | 0 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 0.5 | 1.15 ± 0.92 | 208 ± 167 | 0.0366 ± 0.0013 | 5,833 ± 4,757 | 0.816 | 28.85 | 0.00 | 0 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 1.0 | 9.22 ± 3.07 | 1,660 ± 551 | 0.0813 ± 0.0106 | 21,412 ± 8,130 | 0.380 | 20.77 | 0.00 | 0 |
| Feste Kaskade (eine Instanz von Mixture of Limits) | 2.0 | 27.77 ± 2.30 | 4,745 ± 377 | 0.1099 ± 0.0339 | 47,108 ± 13,216 | 0.281 | 2.23 | 0.00 | 0 |
| Zielblind | 0.5 | 0.20 ± 0.46 | 36 ± 84 | 0.0210 ± 0.0055 | 1,722 ± 3,927 | 2.280 | 0.00 | 21.50 | 0 |
| Zielblind | 1.0 | 3.73 ± 2.12 | 667 ± 381 | 0.0436 ± 0.0140 | 16,393 ± 9,246 | 0.564 | 0.00 | 16.68 | 0 |
| Zielblind | 2.0 | 15.65 ± 2.50 | 2,662 ± 433 | 0.0499 ± 0.0160 | 57,266 ± 14,596 | 0.255 | 0.00 | 4.17 | 0 |

- **Pro Akt.** 7,800 Akte liefen. 3,847 wurden bestätigt. Das mediane $\iota$ pro Akt betrug 69,892 Bits pro geschätztem Joule, mit einem Interquartilsabstand von 35,759 bis 146,697. Jeder bestätigte Akt lag weit über $k_B T\ln 2$ pro Bit: Der niedrigste lag etwa um das $3.6 \times 10^{14}$-Fache über dieser Untergrenze, der Median etwa um das $5.0 \times 10^{15}$-Fache.
- **Ablehnung.** Die Trefferquote betrug 1.0 bei 45 undurchführbaren Paaren. Es gab 4,136 Ablehnungen. Der Anteil bei Aufgaben, die irgendein Arm abschloss, betrug etwa 0.071.
- **Überschreitungen.** Keine Episode endete über dem Budget. Der maximale Überschreitungsanteil betrug $-0.03977$.
- **Gemeinsame Aufgaben.** Bei $B = 1.0$ wurden 9 Aufgaben von beiden Selektoren abgeschlossen. Die gepaarte Differenz pro Aufgabe im Median von $J^*$, σ-Gesetz minus feste Kaskade, hatte den Mittelwert $1.02 \times 10^{-4}$ J (95%-Intervall $-5.23 \times 10^{-4}$ bis $6.03 \times 10^{-4}$, Wilcoxon $p = 0.214$). Bei $B = 0.5$ wurde eine Aufgabe von beiden abgeschlossen, mit der Differenz $-6.68 \times 10^{-6}$ J. Bei $B = 2.0$ wurden 29 Aufgaben von beiden abgeschlossen, mit der mittleren Differenz $-2.65 \times 10^{-4}$ J ($-6.63 \times 10^{-4}$ bis $5.67 \times 10^{-5}$, $p = 0.358$).
- **Selektoren, gepaart nach Seed.** Bei $B = 2.0\,J_{g2}$ schloss der σ-Gesetz-Selektor pro Lauf 0.825 Aufgaben mehr ab als die feste Kaskade (95%-Bootstrap-Intervall 0.125 bis 1.575). Sein $\iota$ pro Lauf war um 3,559 Bits pro geschätztem Joule höher ($-1,068$ bis $8,320$). 9 von 40 Seeds begünstigten den σ-Gesetz-Selektor, und 27 endeten gleich. Bei $B = 0.5$ betrug die Differenz der abgeschlossenen Aufgaben $-0.05$ ($-0.45$ bis $0.35$). Bei $B = 1.0$ betrug sie $-0.475$ ($-1.8$ bis $0.775$).
- **Die Schätzung gegenüber dem Zähler.** Kendalls Tau-b zwischen dem `est_j` jeder Episode und dem RAPL-Netto-Package-Wert derselben Episode betrug $-0.037$ bei 4,000 Episoden. 5,258 von 10,800 Episoden sahen keine Änderung des Package-Zählers. Summiert über die Blöcke betrug `est_j` 23.23 J gegenüber 17.14 J RAPL-Netto-Package-Wert, ein Verhältnis von 1.355. Die Leerlaufleistung des Package betrug vor dem Lauf 9.37 W und danach 3.17 W. Die Gegenprüfung wird als nicht erreichbar erklärt.

**Ergebnisse der Falsifikatoren.** Alle wurden vor dem Lauf festgelegt. Teil B ersetzt R-F4 durch den Episodentest gegen RAPL, wie Amendment 1 es festlegt. In Lauf 2 und in den beiden Teilen hier bedeutet „Gehalten“, dass die Beobachtung nicht eintrat.

| ID | Beobachtung | Teil A (RAPL pro Akt) | Teil B (Zyklenmodell) | Lauf 2 |
|---|---|---|---|---|
| R-F1 | Bei jeder bindenden Stufe schließt das 95%-Intervall der gepaarten Differenz pro Aufgabe im Median von $J^*$, σ-Gesetz minus feste Kaskade, null ein oder liegt darüber | Gehalten, weil sich kein Intervall bilden ließ: eine von beiden abgeschlossene Aufgabe, bei $B = 2.0$, mit der Differenz $-0.0052$ J, und keine bei den anderen Stufen | Gehalten, weil die Beobachtung jede bindende Stufe verlangt und $B = 0.5$ nur eine gemeinsame Aufgabe ($-6.68 \times 10^{-6}$ J) und kein Intervall hat. Bei $B = 1.0$ schließt das Intervall null ein | Gehalten |
| R-F2 | Irgendeine Episode endet über ihrem Budget | Ausgelöst. 320 bis 327 pro Bedingung | Gehalten. 0 von 10,800 | Gehalten |
| R-F3 | Trefferquote der Ablehnung unter 0.9 bei undurchführbaren Paaren, oder mehr als 10% der Ablehnungen bei Paaren, die irgendein Arm abschließt | Gehalten. Trefferquote 1.0 bei 88 Paaren. Anteil 0.0011 | Gehalten. Trefferquote 1.0 bei 45 Paaren. Anteil 0.071 | Gehalten |
| R-F4 | Teil A: Kendalls Tau-b zwischen `est_j` und `reported_j` pro Akt unter 0.8. Teil B: Tau-b zwischen `est_j` der Episode und RAPL-Nettowert der Episode unter 0.8 | Ausgelöst. 0.368 bei 93 Akten | Ausgelöst. $-0.037$ bei 4,000 Episoden | Gehalten |
| R-F5 | CV des $\iota$ pro Lauf über 0.25 in irgendeiner Bedingung | Ausgelöst (1.295 bis 3.618) | Ausgelöst. 0.380 bis 2.280 bei bindenden Stufen. Bei $B = 2.0$: σ-Gesetz 0.199, feste Kaskade 0.281, zielblind 0.255 | Ausgelöst |
| R-F6 | Die Rangordnung nach $J^*$ weicht von der Rangordnung nach integriertem $\iota$ ab | Ausgelöst. Bei $B = 2.0$ ordnet $J^*$ σ-Gesetz, feste Kaskade, zielblind. Das integrierte $\iota$ setzt die feste Kaskade auf den ersten Rang | Ausgelöst. Bei $B = 2.0$ ordnet $J^*$ σ-Gesetz, feste Kaskade, zielblind. Das integrierte $\iota$ ordnet zielblind, σ-Gesetz, feste Kaskade | Ausgelöst |
| R-F7 | Ein bestätigter Akt unter $k_B T\ln 2$ pro Bit | Ausgelöst. 26 bestätigte Akte lasen null oder weniger, was sie unter die Untergrenze stellt. Das ist Quantisierung des Zählers | Gehalten. Der niedrigste Akt lag etwa um das $3.6 \times 10^{14}$-Fache darüber | Gehalten |
| R-F8 | Das $\iota$ pro Lauf der zielblinden Referenz erreicht bei einer bindenden Stufe mindestens das des besseren Selektors | Ausgelöst. Bei $B = 0.5$ und $1.0$ liest jeder Arm 0 | Gehalten. 1,722 gegenüber 6,027 bei $B = 0.5$. 16,393 gegenüber 21,412 bei $B = 1.0$ | Gehalten |

**Was die Replikation klärt.**

- RAPL pro Akt kann Akte, die kürzer als eine Millisekunde sind, nicht messen. Die meisten Episoden sahen keine Aktualisierung des Zählers, sodass der Wächter allein aufgrund der Quantisierung ablehnte oder überschritt. Teil A ist ein Ergebnis zur Auflösung des Messgeräts. Über die Selektoren sagt er nichts.
- Mit einem Zyklenmessgerät hat das Selektionsergebnis bei $B = 2.0$ dasselbe Vorzeichen wie in Lauf 2: Der σ-Gesetz-Selektor schloss pro Lauf mehr Aufgaben ab. Der Gewinn ist kleiner (0.825 gegenüber 2.8), und die Stufe 2.0 band auf dieser Maschine nicht. Bei den bindenden Stufen schließen die Intervalle null ein.
- Das Zyklenmodell folgte dem Package-Zähler nicht Episode für Episode (Tau-b $-0.037$), und seine Blocksumme betrug das 1.355-Fache des Nettowerts des Zählers. Die Joule von Teil B ordnen Akte nach Zyklen. Sie sind keine Energieablesungen.
- Auch hier zeigen die Joule gemeinsamer Aufgaben keine Einsparung durch das σ-Gesetz. Wo der σ-Gesetz-Selektor gewinnt, gewinnt er an abgeschlossenen Aufgaben, nicht an einem günstigeren Abschluss derselben Aufgabe.
- Keine Zahl in diesem Abschnitt ist `measured_j`.

Abbildung 5 stellt die Ergebnisse zu abgeschlossenen Aufgaben aus den drei Läufen nebeneinander.

![Drei Balkendiagramme der abgeschlossenen Aufgaben von 30 nach Arm und Budgetstufe für Lauf 1, Lauf 2 und Teil B der zweiten Maschine. Bei der lockeren Stufe 2.0 schloss der σ-Gesetz-Selektor 28.40, 22.73 und 28.60 ab; die feste Kaskade 27.50, 19.93 und 27.77; die zielblinde Referenz 18.25, 10.65 und 15.65. Fehlerbalken zeigen eine Standardabweichung.](/figures/agency/run-results.svg)

*Abbildung 5. Abgeschlossene Aufgaben von 30 in drei präregistrierten Läufen. Datenabbildung: Mittelwert ± eine Standardabweichung über Seeds, aus den Ergebnistabellen der Abschnitte 8.11, 8.11.1 und 8.11.2 (Teil B). Quellen: `experiments/agency-run/results`, `results2` und `results_jetson_cyc`. Eine [PNG-Kopie](/figures/agency/run-results.png) liegt vor.*

**Was sich repliziert und was nicht.** Das Selektorergebnis von Lauf 1 war explorativ. Zwei spätere Läufe prüften es unter Präregistrierung.

| Behauptung aus Lauf 1 (explorativ) | Lauf 2 (präregistriert) | Zweite Maschine, Teil B (präregistriert) |
|---|---|---|
| Mehr abgeschlossene Aufgaben bei $B = 1.0\,J_{g2}$: +2.65 (1.5 bis 3.8) | Nicht repliziert. Das Intervall schließt null ein | Nicht repliziert. $-0.475$ ($-1.8$ bis $0.775$) |
| Mehr abgeschlossene Aufgaben bei $B = 2.0\,J_{g2}$: +0.9 (0.55 bis 1.25) | Repliziert. +2.8 (2.3 bis 3.275) | Repliziert. +0.825 (0.125 bis 1.575) |
| Joule pro abgeschlossener Aufgabe | Gleich. Keine Einsparung bei gemeinsamen Aufgaben | Gleich. Die Intervalle bei gemeinsamen Aufgaben schließen null ein |

Das replizierte Ergebnis ist eng. Bei der lockersten Budgetstufe schließt der σ-Gesetz-Selektor auf zwei Maschinen mehr Aufgaben ab als die feste Kaskade. Kein Lauf zeigt weniger Joule für dieselbe abgeschlossene Aufgabe, und der Gewinn von Lauf 1 bei bindendem Budget hat sich nicht repliziert. Teil A ist ein Ergebnis zur Auflösung des Messgeräts und prüft keine der beiden Behauptungen.

**Messprotokoll für den nächsten Lauf.** Beide Teile scheitern am Messgerät, daher ändert sich das Protokoll, bevor die Selektoren erneut geprüft werden.

1. **Ruhende Maschine.** Nichts anhalten, was jemand anderem gehört. Auf ein Ruhefenster warten oder eines einplanen: andere Prozesse während des gesamten Laufs bei höchstens 0.5 Kernen, mit verzeichnetem `quiet_window = yes`. Wird keine Ruhe erreicht, startet der Lauf nicht.
2. **Wandsteckdosen- oder Shunt-Messgerät.** Ein Wandsteckdosen-Leistungsmessgerät oder ein Shunt-Messgerät an der Versorgungsschiene anschließen, mit einer Abtastung schneller als ein Akt. Nur seine Ablesungen füllen `measured_j`.
3. **Zuerst die Auflösung prüfen.** Vor dem Pilotlauf das Aktualisierungsintervall und die Schrittweite des Messgeräts im Verhältnis zur medianen Aktdauer festhalten. Kann das Messgerät einen einzelnen Akt nicht auflösen, Blöcke von Akten messen, nach Anzahl zuordnen und dies in der Präregistrierung angeben.
4. **Die Schätzung am Messgerät kalibrieren.** `est_j` auf Blockebene an das Wandsteckdosen- oder Shunt-Messgerät anpassen und verlangen, dass R-F4 hält, bevor `est_j` den Wächter steuert.
5. **Festlegen und protokollieren.** Die Frequenz festlegen, Leerlaufreferenzen davor und danach aufzeichnen, die Drift berichten und den Package-Zähler als gekennzeichnete Gegenprüfung beibehalten.
6. **Der Aufgabenabschluss ist primär.** Die Präregistrierung des nächsten Laufs macht den Aufgabenabschluss zum primären Endpunkt: die nach Seed gepaarte Differenz der abgeschlossenen Aufgaben, σ-Gesetz minus feste Kaskade, bei jeder Budgetstufe, mit der schrittweisen Holm-Korrektur über die Stufen. Die Joule gemeinsamer Aufgaben (R-F1) sind sekundär.

<div id="812-reporting" class="anchor-alias" aria-hidden="true"></div>

### 8.12 Berichterstattung

Alle Belege, rohen Messgerätespuren, Leerlaufreferenzen und den Analysecode zusammen mit dem Ergebnis veröffentlichen. Gemessene, berichtete und geschätzte Joule in getrennten Spalten berichten. Nie über Stufen hinweg summieren. Angeben, welche Falsifikatoren ausgelöst wurden, mit derselben Sichtbarkeit wie diejenigen, die bestanden. Jeder Lauf beantwortet außerdem die Checkliste von Takahashi und Hayashi [239]: die Abrechnungsgrenze; die Terme der Energiebilanz (gespeicherte Energie und exportierte Arbeit, oder eine Angabe, dass sie vernachlässigbar sind); die Referenz und ob die Joule gesamt oder inkrementell sind; die Vergröberung der Ergebnisse; den Horizont und das Rücksetzprotokoll; die Wanduhrzeit und die mittlere Leistung neben den Bits pro Joule; und den Schätzer der gekoppelten Bits mit seiner Verzerrungskorrektur.

<div id="813-where-the-products-sit" class="anchor-alias" aria-hidden="true"></div>

### 8.13 Wo die Produkte stehen

- **Notational Intelligence** ist das Belegformat aus Abschnitt 8.5.
- **Mixture of Limits** ist die Philosophie, die beide Selektoren instanziieren. Arm 2 ist ihre Instanz als feste Kaskade.
- **Die Reality Code Engine** liest $\iota = dX/dJ$ in der Rückschau aus ihrem per Hash verketteten Protokoll ab, mit $X$ den Programmieraufgaben, die das Tor passieren, und $J$ ihren gekennzeichneten Joule ([Reality Code Engine, Abschnitt 9](/papers/rce/#9-ties-to-the-companion-papers)).

Die Platzierung von Hardware und Produkten steht im [Whitepaper zu Metabolic Intelligence](/products/mei/#where-the-products-sit). Die Messgeräte dieses Plans sind M0 und M1 aus Abschnitt 8.1.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Literatur

Entries marked "preprint" are cited by their arXiv posting. Entries published in a language other than English say so.

1. Pearl, J. (1995). Causal diagrams for empirical research. *Biometrika* 82:669-688. https://doi.org/10.1093/biomet/82.4.669
2. Everitt, T., Hutter, M., Kumar, R. and Krakovna, V. (2019). Reward tampering problems and solutions in reinforcement learning: a causal influence diagram perspective. arXiv:1908.04734 (preprint).
3. Sagawa, T. and Ueda, M. (2008). Second law of thermodynamics with discrete quantum feedback control. *Physical Review Letters* 100:080403. https://doi.org/10.1103/PhysRevLett.100.080403
4. Sagawa, T. and Ueda, M. (2010). Generalized Jarzynski equality under nonequilibrium feedback control. *Physical Review Letters* 104:090602. https://doi.org/10.1103/PhysRevLett.104.090602
5. Sagawa, T. and Ueda, M. (2009). Minimal energy cost for thermodynamic information processing: measurement and information erasure. *Physical Review Letters* 102:250602. https://doi.org/10.1103/PhysRevLett.102.250602
6. Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development* 5:183-191. https://doi.org/10.1147/rd.53.0183
7. Bennett, C. H. (1982). The thermodynamics of computation: a review. *International Journal of Theoretical Physics* 21:905-940. https://doi.org/10.1007/BF02084158
8. Ay, N. and Polani, D. (2008). Information flows in causal networks. *Advances in Complex Systems* 11:17-41. https://doi.org/10.1142/S0219525908001465
9. Klyubin, A. S., Polani, D. and Nehaniv, C. L. (2005). Empowerment: a universal agent-centric measure of control. *2005 IEEE Congress on Evolutionary Computation* 1:128-135. https://doi.org/10.1109/CEC.2005.1554676
10. Kenton, Z., Kumar, R., Farquhar, S., Richens, J. et al. (2023). Discovering agents. *Artificial Intelligence* 322:103963. https://doi.org/10.1016/j.artint.2023.103963
11. James, R. G., Barnett, N. and Crutchfield, J. P. (2016). Information flows? A critique of transfer entropies. *Physical Review Letters* 116:238701. https://doi.org/10.1103/PhysRevLett.116.238701
12. Lizier, J. T. and Prokopenko, M. (2010). Differentiating information transfer and causal effect. *The European Physical Journal B* 73:605-615. https://doi.org/10.1140/epjb/e2010-00034-5
13. Janzing, D., Balduzzi, D., Grosse-Wentrup, M. and Schölkopf, B. (2013). Quantifying causal influences. *The Annals of Statistics* 41. https://doi.org/10.1214/13-AOS1145
14. Albantakis, L., Marshall, W., Hoel, E. and Tononi, G. (2019). What caused what? A quantitative account of actual causation using dynamical causal networks. *Entropy* 21:459. https://doi.org/10.3390/e21050459
15. Aguilera, M., Millidge, B., Tschantz, A. and Buckley, C. L. (2022). How particular is the physics of the free energy principle? *Physics of Life Reviews* 40:24-50. https://doi.org/10.1016/j.plrev.2021.11.001
16. Biehl, M., Pollock, F. A. and Kanai, R. (2021). A technical critique of some parts of the free energy principle. *Entropy* 23:293. https://doi.org/10.3390/e23030293
17. Bruineberg, J., Dołęga, K., Dewhurst, J. and Baltieri, M. (2022). The emperor's new Markov blankets. *Behavioral and Brain Sciences* 45:e183. https://doi.org/10.1017/S0140525X21002351
18. Orseau, L., McGregor McGill, S. and Legg, S. (2018). Agents and devices: a relative definition of agency. arXiv:1805.12387 (preprint).
19. Albantakis, L., Barbosa, L., Findlay, G., Grasso, M. et al. (2023). Integrated information theory (IIT) 4.0: formulating the properties of phenomenal existence in physical terms. *PLOS Computational Biology* 19:e1011465. https://doi.org/10.1371/journal.pcbi.1011465
20. Krakauer, D., Bertschinger, N., Olbrich, E., Flack, J. C. and Ay, N. (2020). The information theory of individuality. *Theory in Biosciences* 139:209-223. https://doi.org/10.1007/s12064-020-00313-7
21. Hoel, E. P., Albantakis, L. and Tononi, G. (2013). Quantifying causal emergence shows that macro can beat micro. *Proceedings of the National Academy of Sciences* 110:19790-19795. https://doi.org/10.1073/pnas.1314922110
22. Rosas, F. E., Mediano, P. A. M., Biehl, M., Chandaria, S. and Polani, D. (2020). Causal blankets: theory and algorithmic framework. In *Active Inference: IWAI 2020*, Communications in Computer and Information Science, Springer, pp. 187-198. https://doi.org/10.1007/978-3-030-64919-7_19
23. Shiraishi, N., Funo, K. and Saito, K. (2018). Speed limit for classical stochastic processes. *Physical Review Letters* 121:070601. https://doi.org/10.1103/PhysRevLett.121.070601
24. Esposito, M. and Van den Broeck, C. (2011). Second law and Landauer principle far from equilibrium. *EPL* 95:40004. https://doi.org/10.1209/0295-5075/95/40004
25. Barato, A. C. and Seifert, U. (2015). Thermodynamic uncertainty relation for biomolecular processes. *Physical Review Letters* 114:158101. https://doi.org/10.1103/PhysRevLett.114.158101
26. Gingrich, T. R., Horowitz, J. M., Perunov, N. and England, J. L. (2016). Dissipation bounds all steady-state current fluctuations. *Physical Review Letters* 116:120601. https://doi.org/10.1103/PhysRevLett.116.120601
27. Paneru, G., Dutta, S., Tlusty, T. and Pak, H. K. (2020). Reaching and violating thermodynamic uncertainty bounds in information engines. *Physical Review E* 102:032126. https://doi.org/10.1103/PhysRevE.102.032126
28. Potts, P. P. and Samuelsson, P. (2019). Thermodynamic uncertainty relations including measurement and feedback. *Physical Review E* 100:052137. https://doi.org/10.1103/PhysRevE.100.052137
29. Proesmans, K., Ehrich, J. and Bechhoefer, J. (2020). Finite-time Landauer principle. *Physical Review Letters* 125:100602. https://doi.org/10.1103/PhysRevLett.125.100602
30. Sivak, D. A. and Crooks, G. E. (2012). Thermodynamic metrics and optimal paths. *Physical Review Letters* 108:190602. https://doi.org/10.1103/PhysRevLett.108.190602
31. Margolus, N. and Levitin, L. B. (1998). The maximum speed of dynamical evolution. *Physica D* 120:188-195. https://doi.org/10.1016/S0167-2789(98)00054-2
32. Touchette, H. and Lloyd, S. (2000). Information-theoretic limits of control. *Physical Review Letters* 84:1156-1159. https://doi.org/10.1103/PhysRevLett.84.1156
33. Touchette, H. and Lloyd, S. (2004). Information-theoretic approach to the study of control systems. *Physica A* 331:140-172. https://doi.org/10.1016/j.physa.2003.09.007
34. Garrahan, J. P. (2017). Simple bounds on fluctuations and uncertainty relations for first-passage times of counting observables. *Physical Review E* 95:032134. https://doi.org/10.1103/PhysRevE.95.032134
35. Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development* 17:525-532. https://doi.org/10.1147/rd.176.0525
36. Sagawa, T. and Ueda, M. (2012). Fluctuation theorem with information exchange: role of correlations in stochastic thermodynamics. *Physical Review Letters* 109:180602. https://doi.org/10.1103/PhysRevLett.109.180602
37. Hartle, H., Wolpert, D., Stier, A., Kempes, C. P. and Manzano, G. (2024). Work extraction with feedback control using limited resources. arXiv:2407.05507 (preprint).
38. Horodecki, M. and Oppenheim, J. (2013). Fundamental limitations for quantum and nanoscale thermodynamics. *Nature Communications* 4:2059. https://doi.org/10.1038/ncomms3059
39. Parrondo, J. M. R., Horowitz, J. M. and Sagawa, T. (2015). Thermodynamics of information. *Nature Physics* 11:131-139. https://doi.org/10.1038/nphys3230
40. Seifert, U. (2012). Stochastic thermodynamics, fluctuation theorems and molecular machines. *Reports on Progress in Physics* 75:126001. https://doi.org/10.1088/0034-4885/75/12/126001
41. Conant, R. C. and Ashby, W. R. (1970). Every good regulator of a system must be a model of that system. *International Journal of Systems Science* 1:89-97. https://doi.org/10.1080/00207727008920220
42. Richens, J. and Everitt, T. (2024). Robust agents learn causal world models. *International Conference on Learning Representations (ICLR 2024)*, oral, honorable mention. arXiv:2402.10877.
43. Richens, J., Abel, D., Bellot, A. and Everitt, T. (2025). General agents contain world models. arXiv:2506.01622 (preprint).
44. Horowitz, J. M. and Esposito, M. (2014). Thermodynamics with continuous information flow. *Physical Review X* 4:031015. https://doi.org/10.1103/PhysRevX.4.031015
45. Ito, S. and Sagawa, T. (2013). Information thermodynamics on causal networks. *Physical Review Letters* 111:180603. https://doi.org/10.1103/PhysRevLett.111.180603
46. Hartich, D., Barato, A. C. and Seifert, U. (2014). Stochastic thermodynamics of bipartite systems: transfer entropy inequalities and a Maxwell's demon interpretation. *Journal of Statistical Mechanics* P02016. https://doi.org/10.1088/1742-5468/2014/02/P02016
47. Allahverdyan, A. E., Janzing, D. and Mahler, G. (2009). Thermodynamic efficiency of information and heat flow. *Journal of Statistical Mechanics* P09011. https://doi.org/10.1088/1742-5468/2009/09/P09011
48. Esposito, M. and Schaller, G. (2012). Stochastic thermodynamics for "Maxwell demon" feedbacks. *EPL* 99:30003. https://doi.org/10.1209/0295-5075/99/30003
49. Mandal, D. and Jarzynski, C. (2012). Work and information processing in a solvable model of Maxwell's demon. *PNAS* 109:11641-11645. https://doi.org/10.1073/pnas.1204263109
50. Boyd, A. B., Mandal, D. and Crutchfield, J. P. (2016). Identifying functional thermodynamics in autonomous Maxwellian ratchets. *New Journal of Physics* 18:023049. https://doi.org/10.1088/1367-2630/18/2/023049
51. Boyd, A. B., Mandal, D. and Crutchfield, J. P. (2018). Thermodynamics of modularity: structural costs beyond the Landauer bound. *Physical Review X* 8:031036. https://doi.org/10.1103/PhysRevX.8.031036
52. Wolpert, D. H. and Kolchinsky, A. (2020). Thermodynamics of computing with circuits. *New Journal of Physics* 22:063047. https://doi.org/10.1088/1367-2630/ab82b8
53. Kolchinsky, A. and Wolpert, D. H. (2017). Dependence of dissipation on the initial distribution over states. *Journal of Statistical Mechanics* 083202. https://doi.org/10.1088/1742-5468/aa7ee1
54. Still, S., Sivak, D. A., Bell, A. J. and Crooks, G. E. (2012). Thermodynamics of prediction. *Physical Review Letters* 109:120604. https://doi.org/10.1103/PhysRevLett.109.120604
55. Kolchinsky, A. and Wolpert, D. H. (2018). Semantic information, autonomous agency and non-equilibrium statistical physics. *Interface Focus* 8:20180041. https://doi.org/10.1098/rsfs.2018.0041
56. Ortega, P. A. and Braun, D. A. (2013). Thermodynamics as a theory of decision-making with information-processing costs. *Proceedings of the Royal Society A* 469:20120683. https://doi.org/10.1098/rspa.2012.0683
57. Kolchinsky, A. and Wolpert, D. H. (2020). Thermodynamic costs of Turing machines. *Physical Review Research* 2:033312. https://doi.org/10.1103/PhysRevResearch.2.033312
58. Kolchinsky, A. and Wolpert, D. H. (2021). Work, entropy production, and thermodynamics of information under protocol constraints. *Physical Review X* 11:041024. https://doi.org/10.1103/PhysRevX.11.041024
59. Manzano, G., Kardeş, G., Roldán, É. and Wolpert, D. H. (2024). Thermodynamics of computations with absolute irreversibility, unidirectional transitions, and stochastic computation times. *Physical Review X* 14:021026. https://doi.org/10.1103/PhysRevX.14.021026
60. Bérut, A., Arakelyan, A., Petrosyan, A., Ciliberto, S., Dillenschneider, R. and Lutz, E. (2012). Experimental verification of Landauer's principle linking information and thermodynamics. *Nature* 483:187-189. https://doi.org/10.1038/nature10872
61. Jun, Y., Gavrilov, M. and Bechhoefer, J. (2014). High-precision test of Landauer's principle in a feedback trap. *Physical Review Letters* 113:190601. https://doi.org/10.1103/PhysRevLett.113.190601
62. Orlov, A. O., Lent, C. S., Thorpe, C. C., Boechler, G. P. and Snider, G. L. (2012). Experimental test of Landauer's principle at the sub-k_BT level. *Japanese Journal of Applied Physics* 51:06FE10. https://doi.org/10.1143/JJAP.51.06FE10
63. Hong, J., Lambson, B., Dhuey, S. and Bokor, J. (2016). Experimental test of Landauer's principle in single-bit operations on nanomagnetic memory bits. *Science Advances* 2:e1501492. https://doi.org/10.1126/sciadv.1501492
64. Gavrilov, M. and Bechhoefer, J. (2016). Erasure without work in an asymmetric double-well potential. *Physical Review Letters* 117:200601. https://doi.org/10.1103/PhysRevLett.117.200601
65. Gavrilov, M., Chétrite, R. and Bechhoefer, J. (2017). Direct measurement of weakly nonequilibrium system entropy is consistent with Gibbs-Shannon form. *PNAS* 114:11097-11102. https://doi.org/10.1073/pnas.1708689114
66. Yan, L. L., Xiong, T. P., Rehan, K., Zhou, F., Liang, D. F. et al. (2018). Single-atom demonstration of the quantum Landauer principle. *Physical Review Letters* 120:210601. https://doi.org/10.1103/PhysRevLett.120.210601
67. Dago, S., Pereda, J., Barros, N., Ciliberto, S. and Bellon, L. (2021). Information and thermodynamics: fast and precise approach to Landauer's bound in an underdamped micromechanical oscillator. *Physical Review Letters* 126:170601. https://doi.org/10.1103/PhysRevLett.126.170601
68. Scandi, M., Barker, D., Lehmann, S., Dick, K. A., Maisi, V. F. and Perarnau-Llobet, M. (2022). Minimally dissipative information erasure in a quantum dot via thermodynamic length. *Physical Review Letters* 129:270601. https://doi.org/10.1103/PhysRevLett.129.270601
69. Toyabe, S., Sagawa, T., Ueda, M., Muneyuki, E. and Sano, M. (2010). Experimental demonstration of information-to-energy conversion and validation of the generalized Jarzynski equality. *Nature Physics* 6:988-992. https://doi.org/10.1038/nphys1821
70. Koski, J. V., Maisi, V. F., Pekola, J. P. and Averin, D. V. (2014). Experimental realization of a Szilard engine with a single electron. *PNAS* 111:13786-13789. https://doi.org/10.1073/pnas.1406966111
71. Koski, J. V., Maisi, V. F., Sagawa, T. and Pekola, J. P. (2014). Experimental observation of the role of mutual information in the nonequilibrium dynamics of a Maxwell demon. *Physical Review Letters* 113:030601. https://doi.org/10.1103/PhysRevLett.113.030601
72. Koski, J. V., Kutvonen, A., Khaymovich, I. M., Ala-Nissila, T. and Pekola, J. P. (2015). On-chip Maxwell's demon as an information-powered refrigerator. *Physical Review Letters* 115:260602. https://doi.org/10.1103/PhysRevLett.115.260602
73. Camati, P. A., Peterson, J. P. S., Batalhão, T. B., Micadei, K., Souza, A. M. et al. (2016). Experimental rectification of entropy production by Maxwell's demon in a quantum system. *Physical Review Letters* 117:240502. https://doi.org/10.1103/PhysRevLett.117.240502
74. Peterson, J. P. S., Sarthour, R. S., Souza, A. M., Oliveira, I. S., Goold, J. et al. (2016). Experimental demonstration of information to energy conversion in a quantum system at the Landauer limit. *Proceedings of the Royal Society A* 472:20150813. https://doi.org/10.1098/rspa.2015.0813
75. Cottet, N., Jezouin, S., Bretheau, L., Campagne-Ibarcq, P., Ficheux, Q. et al. (2017). Observing a quantum Maxwell demon at work. *PNAS* 114:7561-7564. https://doi.org/10.1073/pnas.1704827114
76. Masuyama, Y., Funo, K., Murashita, Y., Noguchi, A., Kono, S. et al. (2018). Information-to-work conversion by Maxwell's demon in a superconducting circuit quantum electrodynamical system. *Nature Communications* 9:1291. https://doi.org/10.1038/s41467-018-03686-y
77. Naghiloo, M., Alonso, J. J., Romito, A., Lutz, E. and Murch, K. W. (2018). Information gain and loss for a quantum Maxwell's demon. *Physical Review Letters* 121:030604. https://doi.org/10.1103/PhysRevLett.121.030604
78. Kumar, A., Wu, T.-Y., Giraldo, F. and Weiss, D. S. (2018). Sorting ultracold atoms in a three-dimensional optical lattice in a realization of Maxwell's demon. *Nature* 561:83-87. https://doi.org/10.1038/s41586-018-0458-7
79. Linpeng, X., Bresque, L., Maffei, M., Jordan, A. N. et al. (2022). Energetic cost of measurements using quantum, coherent, and thermal light. *Physical Review Letters* 128:220506. https://doi.org/10.1103/PhysRevLett.128.220506
80. Paneru, G., Lee, D. Y., Tlusty, T. and Pak, H. K. (2018). Lossless Brownian information engine. *Physical Review Letters* 120:020601. https://doi.org/10.1103/PhysRevLett.120.020601
81. Admon, T., Rahav, S. and Roichman, Y. (2018). Experimental realization of an information machine with tunable temporal correlations. *Physical Review Letters* 121:180601. https://doi.org/10.1103/PhysRevLett.121.180601
82. Ribezzi-Crivellari, M. and Ritort, F. (2019). Large work extraction and the Landauer limit in a continuous Maxwell demon. *Nature Physics* 15:660-664. https://doi.org/10.1038/s41567-019-0481-0
83. Debiossac, M., Grass, D., Alonso, J. J., Lutz, E. and Kiesel, N. (2020). Thermodynamics of continuous non-Markovian feedback control. *Nature Communications* 11:1360. https://doi.org/10.1038/s41467-020-15148-5
84. Saha, T. K., Lucero, J. N. E., Ehrich, J., Sivak, D. A. and Bechhoefer, J. (2021). Maximizing power and velocity of an information engine. *PNAS* 118:e2023356118. https://doi.org/10.1073/pnas.2023356118
85. Saha, T. K., Lucero, J. N. E., Ehrich, J., Sivak, D. A. and Bechhoefer, J. (2022). Bayesian information engine that optimally exploits noisy measurements. *Physical Review Letters* 129:130601. https://doi.org/10.1103/PhysRevLett.129.130601
86. Saha, T. K., Ehrich, J., Gavrilov, M., Still, S., Sivak, D. A. and Bechhoefer, J. (2023). Information engine in a nonequilibrium bath. *Physical Review Letters* 131:057101. https://doi.org/10.1103/PhysRevLett.131.057101
87. Barker, D., Scandi, M., Lehmann, S., Thelander, C., Dick, K. A., Perarnau-Llobet, M. and Maisi, V. F. (2022). Experimental verification of the work fluctuation-dissipation relation for information-to-work conversion. *Physical Review Letters* 128:040602. https://doi.org/10.1103/PhysRevLett.128.040602
88. Yan, L.-L., Bu, J.-T., Zeng, Q., Zhang, K., Cui, K.-F. et al. (2024). Experimental verification of demon-involved fluctuation theorems. *Physical Review Letters* 133:090402. https://doi.org/10.1103/PhysRevLett.133.090402
89. Zeng, Q. and Wang, J. (2021). New fluctuation theorems on Maxwell's demon. *Science Advances* 7:eabf1807. https://doi.org/10.1126/sciadv.abf1807
90. Demin, A. V. and Vityaev, E. E. (2014). Learning in a virtual model of the C. elegans nematode for locomotion and chemotaxis. *Biologically Inspired Cognitive Architectures* 7:9-14. https://doi.org/10.1016/j.bica.2013.11.005
91. Putintsev, N. I., Isupov, O. V. and Vityaev, E. E. (2015). Adaptive control system for a mobile agent in a physical environment based on functional systems theory. *Russian Journal of Genetics: Applied Research* 5:601-608. https://doi.org/10.1134/S2079059715060131
92. Rosenblueth, A., Wiener, N. and Bigelow, J. (1943). Behavior, purpose and teleology. *Philosophy of Science* 10:18-24. https://doi.org/10.1086/286788
93. Anokhin, P. K. (1968). The functional system as a unit of organism integrative activity. In *Systems Theory and Biology*, Springer, pp. 376-403. https://doi.org/10.1007/978-3-642-88343-9_15
94. Anokhin, P. K. (1974). The biological roots of the conditioned reflex. In *Biology and Neurophysiology of the Conditioned Reflex and Its Role in Adaptive Behavior*, Pergamon, pp. 1-24. https://doi.org/10.1016/B978-0-08-021516-7.50008-2
95. Sudakov, K. V. (1997). The theory of functional systems: general postulates and principles of dynamic organization. *Integrative Physiological and Behavioral Science* 32:392-414. https://doi.org/10.1007/BF02688634
96. Shvyrkov, V. B. (1980). Goal as a system-forming factor in behavior and learning. In *Neural Mechanisms of Goal-directed Behavior and Learning*, Academic Press, pp. 199-219. https://doi.org/10.1016/B978-0-12-688980-2.50018-7
97. Rosen, R. (2012). *Anticipatory Systems: Philosophical, Mathematical, and Methodological Foundations*, 2nd ed. Springer. https://doi.org/10.1007/978-1-4614-1269-4
98. Sterling, P. (2012). Allostasis: a model of predictive regulation. *Physiology & Behavior* 106:5-15. https://doi.org/10.1016/j.physbeh.2011.06.004
99. Virgo, N., Biehl, M. and McGregor, S. (2021). Interpreting dynamical systems as Bayesian reasoners. In *Machine Learning and Principles and Practice of Knowledge Discovery in Databases* (ECML PKDD 2021 workshops), Communications in Computer and Information Science, Springer, pp. 726-762. https://doi.org/10.1007/978-3-030-93736-2_52
100. Biehl, M. and Virgo, N. (2023). Interpreting systems as solving POMDPs: a step towards a formal understanding of agency. In *Active Inference: IWAI 2022*, Communications in Computer and Information Science 1721, Springer, pp. 16-31. https://doi.org/10.1007/978-3-031-28719-0_2
101. Maturana, H. R. and Varela, F. J. (1980). *Autopoiesis and Cognition: The Realization of the Living*. Reidel. https://doi.org/10.1007/978-94-009-8947-4
102. Kauffman, S. (2003). Molecular autonomous agents. *Philosophical Transactions of the Royal Society A* 361:1089-1099. https://doi.org/10.1098/rsta.2003.1186
103. Di Paolo, E. A. (2005). Autopoiesis, adaptivity, teleology, agency. *Phenomenology and the Cognitive Sciences* 4:429-452. https://doi.org/10.1007/s11097-005-9002-y
104. Barandiaran, X. and Moreno, A. (2006). On what makes certain dynamical systems cognitive: a minimally cognitive organization program. *Adaptive Behavior* 14:171-185. https://doi.org/10.1177/105971230601400208
105. Barandiaran, X. and Moreno, A. (2008). Adaptivity: from metabolism to behavior. *Adaptive Behavior* 16:325-344. https://doi.org/10.1177/1059712308093868
106. Barandiaran, X. E., Di Paolo, E. and Rohde, M. (2009). Defining agency: individuality, normativity, asymmetry, and spatio-temporality in action. *Adaptive Behavior* 17:367-386. https://doi.org/10.1177/1059712309343819
107. Ruiz-Mirazo, K. and Moreno, A. (2011). Autonomy in evolution: from minimal to complex life. *Synthese* 185:21-52. https://doi.org/10.1007/s11229-011-9874-z
108. Moreno, A. and Mossio, M. (2015). *Biological Autonomy: A Philosophical and Theoretical Enquiry*. Springer. https://doi.org/10.1007/978-94-017-9837-2
109. Montévil, M. and Mossio, M. (2015). Biological organisation as closure of constraints. *Journal of Theoretical Biology* 372:179-191. https://doi.org/10.1016/j.jtbi.2015.02.029
110. Aguilera, M. and Barandiaran, X. E. (2024). Thermina: a minimal model of autonomous agency from the lens of stochastic thermodynamics. *ALIFE 2024: Proceedings of the 2024 Artificial Life Conference*. https://doi.org/10.1162/isal_a_00826
111. Barandiaran, X. E. and Almendros, L. S. (2024). Transforming agency: on the mode of existence of large language models. arXiv:2407.10735 (preprint).
112. Levin, M. (2022). Technological approach to mind everywhere: an experimentally-grounded framework for understanding diverse bodies and minds. *Frontiers in Systems Neuroscience* 16:768201. https://doi.org/10.3389/fnsys.2022.768201
113. Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience* 11:127-138. https://doi.org/10.1038/nrn2787
114. Friston, K. (2013). Life as we know it. *Journal of the Royal Society Interface* 10:20130475. https://doi.org/10.1098/rsif.2013.0475
115. Rovelli, C. (2020). Agency in physics. arXiv:2007.05300 (preprint).
116. Jaeger, J. (2023). Artificial intelligence is algorithmic mimicry: why artificial "agents" are not (and won't be) proper agents. arXiv:2307.07515 (preprint).
117. Azadi, P. (2025). Computational irreducibility as the foundation of agency. arXiv:2505.04646 (preprint).
118. Wissner-Gross, A. D. and Freer, C. E. (2013). Causal entropic forces. *Physical Review Letters* 110:168702. https://doi.org/10.1103/PhysRevLett.110.168702
119. Kappen, H. J. (2013). Comment: causal entropic forces. arXiv:1312.4185 (preprint).
120. Fields, C., Goldstein, A. and Sandved-Smith, L. (2024). Making the thermodynamic cost of active inference explicit. *Entropy* 26:622. https://doi.org/10.3390/e26080622
121. Bartlett, S., Eckford, A. W., Egbert, M., Lingam, M. et al. (2025). Physics of life: exploring information as a distinctive feature of living systems. *PRX Life* 3:037003. https://doi.org/10.1103/rsx4-8x5f
122. Funo, K., Shiraishi, N. and Saito, K. (2019). Speed limit for open quantum systems. *New Journal of Physics* 21:013006. https://doi.org/10.1088/1367-2630/aaf9f5
123. Shiraishi, N. and Saito, K. (2021). Speed limit for open systems coupled to general environments. *Physical Review Research* 3:023074. https://doi.org/10.1103/PhysRevResearch.3.023074
124. Vo, V. T., Van Vu, T. and Hasegawa, Y. (2020). Unified approach to classical speed limit and thermodynamic uncertainty relation. *Physical Review E* 102:062132. https://doi.org/10.1103/PhysRevE.102.062132
125. Falasco, G. and Esposito, M. (2020). Dissipation-time uncertainty relation. *Physical Review Letters* 125:120604. https://doi.org/10.1103/PhysRevLett.125.120604
126. Ito, S. (2018). Stochastic thermodynamic interpretation of information geometry. *Physical Review Letters* 121:030605. https://doi.org/10.1103/PhysRevLett.121.030605
127. Ito, S. and Dechant, A. (2020). Stochastic time evolution, information geometry, and the Cramér-Rao bound. *Physical Review X* 10:021056. https://doi.org/10.1103/PhysRevX.10.021056
128. Nakazato, M. and Ito, S. (2021). Geometrical aspects of entropy production in stochastic thermodynamics based on Wasserstein distance. *Physical Review Research* 3:043093. https://doi.org/10.1103/PhysRevResearch.3.043093
129. Dechant, A., Sasa, S.-i. and Ito, S. (2022). Geometric decomposition of entropy production in out-of-equilibrium systems. *Physical Review Research* 4:L012034. https://doi.org/10.1103/PhysRevResearch.4.L012034
130. Van Vu, T. and Saito, K. (2023). Thermodynamic unification of optimal transport: thermodynamic uncertainty relation, minimum dissipation, and thermodynamic speed limits. *Physical Review X* 13:011013. https://doi.org/10.1103/PhysRevX.13.011013
131. Nagayama, R., Yoshimura, K. and Ito, S. (2025). Infinite variety of thermodynamic speed limits with general activities. *Physical Review Research* 7:013307. https://doi.org/10.1103/PhysRevResearch.7.013307
132. Yoshimura, K. and Ito, S. (2021). Thermodynamic uncertainty relation and thermodynamic speed limit in deterministic chemical reaction networks. *Physical Review Letters* 127:160601. https://doi.org/10.1103/PhysRevLett.127.160601
133. Aurell, E., Mejía-Monasterio, C. and Muratore-Ginanneschi, P. (2011). Optimal protocols and optimal transport in stochastic thermodynamics. *Physical Review Letters* 106:250601. https://doi.org/10.1103/PhysRevLett.106.250601
134. Hasegawa, Y. (2023). Unifying speed limit, thermodynamic uncertainty relation and Heisenberg principle via bulk-boundary correspondence. *Nature Communications* 14:2828. https://doi.org/10.1038/s41467-023-38074-8
135. Van Vu, T. and Hasegawa, Y. (2021). Geometrical bounds of the irreversibility in Markovian systems. *Physical Review Letters* 126:010601. https://doi.org/10.1103/PhysRevLett.126.010601
136. Delvenne, J.-C. and Falasco, G. (2024). Thermokinetic relations. *Physical Review E* 109:014109. https://doi.org/10.1103/PhysRevE.109.014109
137. Seifert, U. (2017). Stochastic thermodynamics: from principles to the cost of precision. arXiv:1707.03759 (lecture notes).
138. Horowitz, J. M. and Gingrich, T. R. (2017). Proof of the finite-time thermodynamic uncertainty relation for steady-state currents. *Physical Review E* 96:020103. https://doi.org/10.1103/PhysRevE.96.020103
139. Pietzonka, P., Barato, A. C. and Seifert, U. (2016). Universal bounds on current fluctuations. *Physical Review E* 93:052145. https://doi.org/10.1103/PhysRevE.93.052145
140. Proesmans, K. and Van den Broeck, C. (2017). Discrete-time thermodynamic uncertainty relation. *EPL* 119:20001. https://doi.org/10.1209/0295-5075/119/20001
141. Hasegawa, Y. and Van Vu, T. (2019). Fluctuation theorem uncertainty relation. *Physical Review Letters* 123:110602. https://doi.org/10.1103/PhysRevLett.123.110602
142. Dechant, A. and Sasa, S.-i. (2018). Entropic bounds on currents in Langevin systems. *Physical Review E* 97:062101. https://doi.org/10.1103/PhysRevE.97.062101
143. Lee, J. S., Park, J.-M. and Park, H. (2019). Thermodynamic uncertainty relation for underdamped Langevin systems driven by a velocity-dependent force. *Physical Review E* 100:062132. https://doi.org/10.1103/PhysRevE.100.062132
144. Lee, J. S., Park, J.-M. and Park, H. (2021). Universal form of thermodynamic uncertainty relation for Langevin dynamics. *Physical Review E* 104:L052102. https://doi.org/10.1103/PhysRevE.104.L052102
145. Dechant, A. and Sasa, S.-i. (2021). Improving thermodynamic bounds using correlations. *Physical Review X* 11:041061. https://doi.org/10.1103/PhysRevX.11.041061
146. Horowitz, J. M. and Gingrich, T. R. (2020). Thermodynamic uncertainty relations constrain non-equilibrium fluctuations. *Nature Physics* 16:15-20. https://doi.org/10.1038/s41567-019-0702-6
147. Barato, A. C. and Seifert, U. (2016). Cost and precision of Brownian clocks. *Physical Review X* 6:041053. https://doi.org/10.1103/PhysRevX.6.041053
148. Salazar, D. S. P. (2021). Information bound for entropy production from the detailed fluctuation theorem. *Physical Review E* 103:022122. https://doi.org/10.1103/PhysRevE.103.022122
149. Landi, G. T. and Paternostro, M. (2021). Irreversible entropy production: from classical to quantum. *Reviews of Modern Physics* 93:035008. https://doi.org/10.1103/RevModPhys.93.035008
150. Van Vu, T. and Hasegawa, Y. (2020). Thermodynamic uncertainty relations under arbitrary control protocols. *Physical Review Research* 2:013060. https://doi.org/10.1103/PhysRevResearch.2.013060
151. Tanogami, T., Van Vu, T. and Saito, K. (2023). Universal bounds on the performance of information-thermodynamic engine. *Physical Review Research* 5:043280. https://doi.org/10.1103/PhysRevResearch.5.043280
152. Kumasaki, K., Tojo, K., Sagawa, T. and Funo, K. (2026). Thermodynamic uncertainty relation for feedback cooling. *Physical Review E* 113:024134. https://doi.org/10.1103/4pq6-7djm
153. Honma, R. and Van Vu, T. (2026). Thermodynamic uncertainty relation with quantum feedback. *Physical Review Letters*. https://doi.org/10.1103/6d8l-94pv. Preprint: arXiv:2602.22651.
154. Gingrich, T. R. and Horowitz, J. M. (2017). Fundamental bounds on first passage time fluctuations for currents. *Physical Review Letters* 119:170601. https://doi.org/10.1103/PhysRevLett.119.170601
155. Schmiedl, T. and Seifert, U. (2007). Optimal finite-time processes in stochastic thermodynamics. *Physical Review Letters* 98:108301. https://doi.org/10.1103/PhysRevLett.98.108301
156. Proesmans, K., Ehrich, J. and Bechhoefer, J. (2020). Optimal finite-time bit erasure under full control. *Physical Review E* 102:032105. https://doi.org/10.1103/PhysRevE.102.032105
157. Zhen, Y.-Z., Egloff, D., Modi, K. and Dahlsten, O. (2021). Universal bound on energy cost of bit reset in finite time. *Physical Review Letters* 127:190602. https://doi.org/10.1103/PhysRevLett.127.190602
158. Esposito, M., Kawai, R., Lindenberg, K. and Van den Broeck, C. (2010). Efficiency at maximum power of low-dissipation Carnot engines. *Physical Review Letters* 105:150603. https://doi.org/10.1103/PhysRevLett.105.150603
159. Tu, Z. C. (2008). Efficiency at maximum power of Feynman's ratchet as a heat engine. *Journal of Physics A* 41:312003. https://doi.org/10.1088/1751-8113/41/31/312003
160. Shiraishi, N., Saito, K. and Tasaki, H. (2016). Universal trade-off relation between power and efficiency for heat engines. *Physical Review Letters* 117:190601. https://doi.org/10.1103/PhysRevLett.117.190601
161. Pietzonka, P. and Seifert, U. (2018). Universal trade-off between power, efficiency, and constancy in steady-state heat engines. *Physical Review Letters* 120:190602. https://doi.org/10.1103/PhysRevLett.120.190602
162. Ma, Y.-H., Xu, D., Dong, H. and Sun, C.-P. (2018). Universal constraint for efficiency and power of a low-dissipation heat engine. *Physical Review E* 98:042112. https://doi.org/10.1103/PhysRevE.98.042112
163. Tsirlin, A. M., Mironova, V. A., Amelkin, S. A. and Kazakov, V. (1998). Finite-time thermodynamics: conditions of minimal dissipation for thermodynamic processes with given rate. *Physical Review E* 58:215-223. https://doi.org/10.1103/PhysRevE.58.215
164. Lee, J. S., Lee, S., Kwon, H. and Park, H. (2022). Speed limit for a highly irreversible process and tight finite-time Landauer's bound. *Physical Review Letters* 129:120603. https://doi.org/10.1103/PhysRevLett.129.120603
165. Van Vu, T. and Saito, K. (2022). Finite-time quantum Landauer principle and quantum coherence. *Physical Review Letters* 128:010602. https://doi.org/10.1103/PhysRevLett.128.010602
166. Rolandi, A. and Perarnau-Llobet, M. (2023). Finite-time Landauer principle beyond weak coupling. *Quantum* 7:1161. https://doi.org/10.22331/q-2023-11-03-1161
167. Kamijima, T., Funo, K. and Sagawa, T. (2024). Finite-time thermodynamic bounds and tradeoff relations for information processing. arXiv:2409.08606 (preprint).
168. Tkachenko, A. V. (2025). Thermodynamic cost of inference and learning in physical neural networks. arXiv:2503.09980 (preprint). Title of the current arXiv version.
169. Tatikonda, S. and Mitter, S. (2004). Control under communication constraints. *IEEE Transactions on Automatic Control* 49:1056-1068. https://doi.org/10.1109/TAC.2004.831187
170. Nair, G. N. and Evans, R. J. (2004). Stabilizability of stochastic linear systems with finite feedback data rates. *SIAM Journal on Control and Optimization* 43:413-436. https://doi.org/10.1137/S0363012902402116
171. Nair, G. N., Fagnani, F., Zampieri, S. and Evans, R. J. (2007). Feedback control under data rate constraints: an overview. *Proceedings of the IEEE* 95:108-137. https://doi.org/10.1109/JPROC.2006.887294
172. Sandberg, H., Delvenne, J.-C., Newton, N. J. and Mitter, S. K. (2014). Maximum work extraction and implementation costs for nonequilibrium Maxwell's demons. *Physical Review E* 90:042119. https://doi.org/10.1103/PhysRevE.90.042119
173. Horowitz, J. M. and Sandberg, H. (2014). Second-law-like inequalities with information and their interpretations. *New Journal of Physics* 16:125007. https://doi.org/10.1088/1367-2630/16/12/125007
174. Jacobs, K. (2009). Second law of thermodynamics and quantum feedback control: Maxwell's demon with weak measurements. *Physical Review A* 80:012322. https://doi.org/10.1103/PhysRevA.80.012322
175. Funo, K., Watanabe, Y. and Ueda, M. (2013). Integral quantum fluctuation theorems under measurement and feedback control. *Physical Review E* 88:052121. https://doi.org/10.1103/PhysRevE.88.052121
176. Guryanova, Y., Friis, N. and Huber, M. (2020). Ideal projective measurements have infinite resource costs. *Quantum* 4:222. https://doi.org/10.22331/q-2020-01-13-222
177. Danageozian, A., Wilde, M. M. and Buscemi, F. (2022). Thermodynamic constraints on quantum information gain and error correction: a triple trade-off. *PRX Quantum* 3:020318. https://doi.org/10.1103/PRXQuantum.3.020318
178. Wolpert, D. H. (2020). Minimal entropy production rate of interacting systems. *New Journal of Physics* 22:113013. https://doi.org/10.1088/1367-2630/abc5c6
179. Tasnim, F. and Wolpert, D. H. (2023). Stochastic thermodynamics of multiple co-evolving systems: beyond multipartite processes. *Entropy* 25:1078. https://doi.org/10.3390/e25071078
180. Wolpert, D. H. (2020). Uncertainty relations and fluctuation theorems for Bayes nets. *Physical Review Letters* 125:200602. https://doi.org/10.1103/PhysRevLett.125.200602
181. Rolandi, A., Abiuso, P. and Perarnau-Llobet, M. (2023). Collective advantages in finite-time thermodynamics. *Physical Review Letters* 131:210401. https://doi.org/10.1103/PhysRevLett.131.210401
182. Fujimoto, Y. and Ito, S. (2024). Game-theoretical approach to minimum entropy productions in information thermodynamics. *Physical Review Research* 6:013023. https://doi.org/10.1103/PhysRevResearch.6.013023
183. Lloyd, S. (2000). Ultimate physical limits to computation. *Nature* 406:1047-1054. https://doi.org/10.1038/35023282
184. Deffner, S. and Campbell, S. (2017). Quantum speed limits: from Heisenberg's uncertainty principle to optimal quantum control. *Journal of Physics A* 50:453001. https://doi.org/10.1088/1751-8121/aa86c6
185. Lan, G., Sartori, P., Neumann, S., Sourjik, V. and Tu, Y. (2012). The energy-speed-accuracy trade-off in sensory adaptation. *Nature Physics* 8:422-428. https://doi.org/10.1038/nphys2276
186. Mehta, P. and Schwab, D. J. (2012). Energetic costs of cellular computation. *PNAS* 109:17978-17982. https://doi.org/10.1073/pnas.1207814109
187. Lang, A. H., Fisher, C. K., Mora, T. and Mehta, P. (2014). Thermodynamics of statistical inference by cells. *Physical Review Letters* 113:148103. https://doi.org/10.1103/PhysRevLett.113.148103
188. Govern, C. C. and ten Wolde, P. R. (2014). Optimal resource allocation in cellular sensing systems. *PNAS* 111:17486-17491. https://doi.org/10.1073/pnas.1411524111
189. Sartori, P., Granger, L., Lee, C. F. and Horowitz, J. M. (2014). Thermodynamic costs of information processing in sensory adaptation. *PLoS Computational Biology* 10:e1003974. https://doi.org/10.1371/journal.pcbi.1003974
190. Barato, A. C., Hartich, D. and Seifert, U. (2013). Information-theoretic versus thermodynamic entropy production in autonomous sensory networks. *Physical Review E* 87:042104. https://doi.org/10.1103/PhysRevE.87.042104
191. Barato, A. C., Hartich, D. and Seifert, U. (2014). Efficiency of cellular information processing. *New Journal of Physics* 16:103024. https://doi.org/10.1088/1367-2630/16/10/103024
192. Ouldridge, T. E., Govern, C. C. and ten Wolde, P. R. (2017). Thermodynamics of computational copying in biochemical systems. *Physical Review X* 7:021004. https://doi.org/10.1103/PhysRevX.7.021004
193. Cao, Y., Wang, H., Ouyang, Q. and Tu, Y. (2015). The free-energy cost of accurate biochemical oscillations. *Nature Physics* 11:772-778. https://doi.org/10.1038/nphys3412
194. Zhang, D., Cao, Y., Ouyang, Q. and Tu, Y. (2019). The energy cost and optimal design for synchronization of coupled molecular oscillators. *Nature Physics* 16:95-100. https://doi.org/10.1038/s41567-019-0701-7
195. Sartori, P. and Tu, Y. (2015). Free energy cost of reducing noise while maintaining a high sensitivity. *Physical Review Letters* 115:118102. https://doi.org/10.1103/PhysRevLett.115.118102
196. Horowitz, J. M., Zhou, K. and England, J. L. (2017). Minimum energetic cost to maintain a target nonequilibrium state. *Physical Review E* 95:042102. https://doi.org/10.1103/PhysRevE.95.042102
197. Bryant, S. J. and Machta, B. B. (2023). Physical constraints in intracellular signaling: the cost of sending a bit. *Physical Review Letters* 131:068401. https://doi.org/10.1103/PhysRevLett.131.068401
198. Tjalma, A. J., Galstyan, V., Goedhart, J., Slim, L. et al. (2023). Trade-offs between cost and information in cellular prediction. *Proceedings of the National Academy of Sciences* 120:e2303078120. https://doi.org/10.1073/pnas.2303078120
199. Schreiber, T. (2000). Measuring information transfer. *Physical Review Letters* 85:461-464. https://doi.org/10.1103/PhysRevLett.85.461
200. Tishby, N. and Polani, D. (2011). Information theory of decisions and actions. In *Perception-Action Cycle*, Springer, pp. 601-636. https://doi.org/10.1007/978-1-4419-1452-1_19
201. Stratonovich, R. L. (2020). *Theory of Information and its Value* (English edition of the 1975 Russian monograph). Springer. https://doi.org/10.1007/978-3-030-22833-0
202. Pal, S., Saryal, S., Segal, D., Mahesh, T. S. and Agarwalla, B. K. (2020). Experimental study of the thermodynamic uncertainty relation. *Physical Review Research* 2:022044. https://doi.org/10.1103/PhysRevResearch.2.022044
203. Barker, D., Lehmann, S., Dick, K. A., Samuelsson, P. et al. (2025). Information thermodynamics in a quantum dot Szilard engine: experimentally investigating fluctuation theorems and thermodynamic uncertainty relations. arXiv:2511.08541 (preprint).
204. Friedman, H. M., Agarwalla, B. K., Shein-Lumbroso, O., Tal, O. and Segal, D. (2020). Thermodynamic uncertainty relation in atomic-scale quantum conductors. *Physical Review B* 101:195423. https://doi.org/10.1103/PhysRevB.101.195423
205. Hwang, W. and Hyeon, C. (2018). Energetic costs, precision, and transport efficiency of molecular motors. *Journal of Physical Chemistry Letters* 9:513-520. https://doi.org/10.1021/acs.jpclett.7b03197
206. Li, J., Horowitz, J. M., Gingrich, T. R. and Fakhri, N. (2019). Quantifying dissipation using fluctuating currents. *Nature Communications* 10:1666. https://doi.org/10.1038/s41467-019-09631-x
207. Ness, G., Lam, M. R., Alt, W., Meschede, D., Sagi, Y. and Alberti, A. (2021). Observing crossover between quantum speed limits. *Science Advances* 7:eabj9119. https://doi.org/10.1126/sciadv.abj9119
208. Pires, L. B., Goerlich, R., Luna da Fonseca, A., Debiossac, M., Hervieux, P.-A. et al. (2023). Optimal time-entropy bounds and speed limits for Brownian thermal shortcuts. *Physical Review Letters* 131:097101. https://doi.org/10.1103/PhysRevLett.131.097101
209. Oikawa, S., Nakayama, Y., Ito, S., Sagawa, T. and Toyabe, S. (2025). Experimentally achieving minimal dissipation via thermodynamically optimal transport. *Nature Communications* 16:10424. https://doi.org/10.1038/s41467-025-66519-9
210. Proesmans, K., Dreher, Y., Gavrilov, M., Bechhoefer, J. and Van den Broeck, C. (2016). Brownian duet: a novel tale of thermodynamic efficiency. *Physical Review X* 6:041010. https://doi.org/10.1103/PhysRevX.6.041010
211. Mancino, L., Cavina, V., De Pasquale, A., Sbroscia, M., Booth, R. I. et al. (2018). Geometrical bounds on irreversibility in open quantum systems. *Physical Review Letters* 121:160602. https://doi.org/10.1103/PhysRevLett.121.160602
212. Dago, S. and Bellon, L. (2022). Dynamics of information erasure and extension of Landauer's bound to fast processes. *Physical Review Letters* 128:070604. https://doi.org/10.1103/PhysRevLett.128.070604
213. Mattingly, H. H., Kamino, K., Machta, B. B. and Emonet, T. (2021). *Escherichia coli* chemotaxis is information limited. *Nature Physics* 17:1426-1431. https://doi.org/10.1038/s41567-021-01380-3
214. Blickle, V. and Bechinger, C. (2012). Realization of a micrometre-sized stochastic heat engine. *Nature Physics* 8:143-146. https://doi.org/10.1038/nphys2163
215. Martínez, I. A., Roldán, É., Dinis, L., Petrov, D., Parrondo, J. M. R. and Rica, R. A. (2016). Brownian Carnot engine. *Nature Physics* 12:67-70. https://doi.org/10.1038/nphys3518
216. Roldán, É., Martínez, I. A., Parrondo, J. M. R. and Petrov, D. (2014). Universal features in the energetics of symmetry breaking. *Nature Physics* 10:457-461. https://doi.org/10.1038/nphys2940
217. Krishnamurthy, S., Ghosh, S., Chatterji, D., Ganapathy, R. and Sood, A. K. (2016). A micrometre-sized heat engine operating between bacterial reservoirs. *Nature Physics* 12:1134-1138. https://doi.org/10.1038/nphys3870
218. Krishnamurthy, S., Ganapathy, R. and Sood, A. K. (2023). Overcoming power-efficiency tradeoff in a micro heat engine by engineered system-bath interactions. *Nature Communications* 14:6842. https://doi.org/10.1038/s41467-023-42350-y
219. Paneru, G., Dutta, S., Sagawa, T., Tlusty, T. and Pak, H. K. (2020). Efficiency fluctuations and noise induced refrigerator-to-heater transition in information engines. *Nature Communications* 11:1012. https://doi.org/10.1038/s41467-020-14823-x
220. Jung, T., Polani, D. and Stone, P. (2011). Empowerment for continuous agent-environment systems. *Adaptive Behavior* 19:16-39. https://doi.org/10.1177/1059712310392389
221. Salge, C., Glackin, C. and Polani, D. (2013). Empowerment: an introduction. arXiv:1310.1863 (preprint).
222. Kolchinsky, A. (2024). Thermodynamic dissipation does not bound replicator growth and decay rates. arXiv:2404.01130 (preprint).
223. Adlam, E. C., McQueen, K. J. and Waegell, M. (2025). Agency cannot be a purely quantum phenomenon. arXiv:2510.13247 (preprint).
224. Goldt, S. and Seifert, U. (2017). Stochastic thermodynamics of learning. *Physical Review Letters* 118:010601. https://doi.org/10.1103/PhysRevLett.118.010601
225. Still, S. (2020). Thermodynamic cost and benefit of memory. *Physical Review Letters* 124:050601. https://doi.org/10.1103/PhysRevLett.124.050601
226. Boyd, A. B., Crutchfield, J. P. and Gu, M. (2022). Thermodynamic machine learning through maximum work production. *New Journal of Physics* 24:083040. https://doi.org/10.1088/1367-2630/ac4309
227. Boyd, A. B., Crutchfield, J. P., Gu, M. and Binder, F. C. (2025). Thermodynamic overfitting and generalization: energetics of predictive intelligence. *New Journal of Physics* 27:063901. https://doi.org/10.1088/1367-2630/addf71
228. Ehrich, J., Still, S. and Sivak, D. A. (2023). Energetic cost of feedback control. *Physical Review Research* 5:023080. https://doi.org/10.1103/PhysRevResearch.5.023080
229. Ehrich, J. and Sivak, D. A. (2023). Energy and information flows in autonomous systems. *Frontiers in Physics* 11:1108357. https://doi.org/10.3389/fphy.2023.1108357
230. Wolpert, D. H. (2019). The stochastic thermodynamics of computation. *Journal of Physics A* 52:193001. https://doi.org/10.1088/1751-8121/ab0850
231. Levy, W. B. and Baxter, R. A. (1996). Energy efficient neural codes. *Neural Computation* 8:531-543. https://doi.org/10.1162/neco.1996.8.3.531
232. Balasubramanian, V., Kimber, D. and Berry, M. J., II (2001). Metabolically efficient information processing. *Neural Computation* 13:799-815. https://doi.org/10.1162/089976601300014358
233. Goldt, S. and Seifert, U. (2017). Thermodynamic efficiency of learning a rule in neural networks. *New Journal of Physics* 19:113001. https://doi.org/10.1088/1367-2630/aa89ff
234. Fiderer, L. J., Barth, P. C., Smith, I. D. and Briegel, H. J. (2025). Information thermodynamics of agents: the work capacity of channels with memory. arXiv:2504.06209 (preprint).
235. Elliott, T. J., Gu, M., Garner, A. J. P. and Thompson, J. (2022). Quantum adaptive agents with efficient long-term memories. *Physical Review X* 12:011007. https://doi.org/10.1103/PhysRevX.12.011007
236. Russell, S. J. and Subramanian, D. (1995). Provably bounded-optimal agents. *Journal of Artificial Intelligence Research* 2:575-609. https://doi.org/10.1613/jair.133
237. Genewein, T., Leibfried, F., Grau-Moya, J. and Braun, D. A. (2015). Bounded rationality, abstraction, and hierarchical decision-making: an information-theoretic optimality principle. *Frontiers in Robotics and AI* 2:27. https://doi.org/10.3389/frobt.2015.00027
238. Legg, S. and Hutter, M. (2007). Universal intelligence: a definition of machine intelligence. *Minds and Machines* 17:391-444. https://doi.org/10.1007/s11023-007-9079-x
239. Takahashi, K. and Hayashi, Y. (2026). Thermodynamic limits of physical intelligence. In *Artificial General Intelligence: 19th International Conference, AGI 2026, Proceedings, Part II*, Lecture Notes in Computer Science. Springer. https://doi.org/10.1007/978-3-032-33195-3_24. arXiv:2602.05463.
240. Ortega, P. A., Braun, D. A., Dyer, J., Kim, K.-E. and Tishby, N. (2015). Information-theoretic bounded rationality. arXiv:1512.06789 (preprint).
241. Zénon, A., Solopchuk, O. and Pezzulo, G. (2019). An information-theoretic perspective on the costs of cognition. *Neuropsychologia* 123:5-18. https://doi.org/10.1016/j.neuropsychologia.2018.09.013
242. Sims, C. R. (2016). Rate-distortion theory and human perception. *Cognition* 152:181-198. https://doi.org/10.1016/j.cognition.2016.03.020
243. Laughlin, S. B., de Ruyter van Steveninck, R. R. and Anderson, J. C. (1998). The metabolic cost of neural information. *Nature Neuroscience* 1:36-41. https://doi.org/10.1038/236
244. Attwell, D. and Laughlin, S. B. (2001). An energy budget for signaling in the grey matter of the brain. *Journal of Cerebral Blood Flow and Metabolism* 21:1133-1145. https://doi.org/10.1097/00004647-200110000-00001
245. Lennie, P. (2003). The cost of cortical computation. *Current Biology* 13:493-497. https://doi.org/10.1016/S0960-9822(03)00135-0
246. Sengupta, B., Stemmler, M., Laughlin, S. B. and Niven, J. E. (2010). Action potential energy efficiency varies among neuron types in vertebrates and invertebrates. *PLoS Computational Biology* 6:e1000840. https://doi.org/10.1371/journal.pcbi.1000840
247. Sengupta, B., Stemmler, M. B. and Friston, K. J. (2013). Information and efficiency in the nervous system: a synthesis. *PLoS Computational Biology* 9:e1003157. https://doi.org/10.1371/journal.pcbi.1003157
248. Levy, W. B. and Calvert, V. G. (2021). Communication consumes 35 times more energy than computation in the human cortex, but both costs are needed to predict synapse number. *Proceedings of the National Academy of Sciences* 118:e2008173118. https://doi.org/10.1073/pnas.2008173118
249. Harris, J. J., Jolivet, R., Engl, E. and Attwell, D. (2015). Energy-efficient information transfer by visual pathway synapses. *Current Biology* 25:3151-3160. https://doi.org/10.1016/j.cub.2015.10.063
250. Padamsey, Z., Katsanevaki, D., Dupuy, N. and Rochefort, N. L. (2022). Neocortex saves energy by reducing coding precision during food scarcity. *Neuron* 110:280-296.e10. https://doi.org/10.1016/j.neuron.2021.10.024
251. Plaçais, P.-Y. and Preat, T. (2013). To favor survival under food shortage, the brain disables costly memory. *Science* 339:440-442. https://doi.org/10.1126/science.1226018
252. Plaçais, P.-Y., de Tredern, É., Scheunemann, L., Trannoy, S. et al. (2017). Upregulated energy metabolism in the *Drosophila* mushroom body is the trigger for long-term memory. *Nature Communications* 8:15510. https://doi.org/10.1038/ncomms15510
253. Mery, F. and Kawecki, T. J. (2005). A cost of long-term memory in *Drosophila*. *Science* 308:1148. https://doi.org/10.1126/science.1111331
254. Hechler, A., de Lange, F. P. and Riedl, V. (2023). The energy metabolic footprint of predictive processing in the human brain. bioRxiv preprint, version 2 posted 2024. https://doi.org/10.1101/2023.12.08.570804
255. Malkin, J., O'Donnell, C., Houghton, C. J. and Aitchison, L. (2024). Signatures of Bayesian inference emerge from energy-efficient synapses. *eLife* 12:RP92595. https://doi.org/10.7554/eLife.92595
256. Li, H. L. and van Rossum, M. C. W. (2020). Energy efficient synaptic plasticity. *eLife* 9:e50804. https://doi.org/10.7554/eLife.50804
257. Lynn, C. W., Cornblath, E. J., Papadopoulos, L., Bertolero, M. A. and Bassett, D. S. (2021). Broken detailed balance and entropy production in the human brain. *Proceedings of the National Academy of Sciences* 118:e2109889118. https://doi.org/10.1073/pnas.2109889118
258. Horowitz, M. (2014). Computing's energy problem (and what we can do about it). *2014 IEEE International Solid-State Circuits Conference*, pp. 10-14. https://doi.org/10.1109/ISSCC.2014.6757323
259. Saad-Falcon, J., Narayan, A., Akengin, H. O., Griffin, J. W. et al. (2025). Intelligence per watt: measuring intelligence efficiency of local AI. arXiv:2511.07885 (preprint).
260. Tschand, A., Rajan, A. T. R., Idgunji, S., Ghosh, A. et al. (2025). MLPerf Power: benchmarking the energy efficiency of machine learning systems from μWatts to MWatts for sustainable AI. *2025 IEEE International Symposium on High Performance Computer Architecture (HPCA)*, 1201-1216. https://doi.org/10.1109/HPCA61900.2025.00092. arXiv:2410.12032.
261. Chung, J.-W., Ma, J. J., Wu, R., Liu, J. et al. (2025). The ML.ENERGY benchmark: toward automated inference energy measurement and optimization. arXiv:2505.06371 (preprint).
262. Niu, C., Zhang, W., Li, J., Zhao, Y. et al. (2025). TokenPowerBench: benchmarking the power consumption of LLM inference. arXiv:2512.03024 (preprint).
263. Jin, Y., Wei, G.-Y. and Brooks, D. (2025). The energy cost of reasoning: analyzing energy usage in LLMs with test-time compute. arXiv:2505.14733 (preprint).
264. Luccioni, S., Jernite, Y. and Strubell, E. (2024). Power hungry processing: watts driving the cost of AI deployment? *ACM FAccT 2024*, pp. 85-99. https://doi.org/10.1145/3630106.3658542
265. Samsi, S., Zhao, D., McDonald, J., Li, B. et al. (2023). From words to watts: benchmarking the energy costs of large language model inference. *2023 IEEE High Performance Extreme Computing Conference (HPEC)*, pp. 1-9. https://doi.org/10.1109/HPEC58863.2023.10363447
266. Dillavou, S., Stern, M., Liu, A. J. and Durian, D. J. (2022). Demonstration of decentralized physics-driven learning. *Physical Review Applied* 18:014040. https://doi.org/10.1103/PhysRevApplied.18.014040
267. Stern, M., Dillavou, S., Jayaraman, D., Durian, D. J. and Liu, A. J. (2024). Training self-learning circuits for power-efficient solutions. *APL Machine Learning* 2:016114. https://doi.org/10.1063/5.0181382
268. Saggio, V., Asenbeck, B. E., Hamann, A., Strömberg, T. et al. (2021). Experimental quantum speed-up in reinforcement learning agents. *Nature* 591:229-233. https://doi.org/10.1038/s41586-021-03242-7
269. Crosato, E., Spinney, R. E., Nigmatullin, R., Lizier, J. T. and Prokopenko, M. (2018). Thermodynamics and computation during collective motion near criticality. *Physical Review E* 97:012120. https://doi.org/10.1103/PhysRevE.97.012120
270. Chen, Q. and Prokopenko, M. (2025). Why collective behaviours self-organize to criticality: a primer on information-theoretic and thermodynamic utility measures. *Royal Society Open Science* 12:241655. https://doi.org/10.1098/rsos.241655
271. Khan, K. N., Hirki, M., Niemi, T., Nurminen, J. K. and Ou, Z. (2018). RAPL in action: experiences in using RAPL for power measurements. *ACM Transactions on Modeling and Performance Evaluation of Computing Systems* 3:1-26. https://doi.org/10.1145/3177754
272. Desrochers, S., Paradis, C. and Weaver, V. M. (2016). A validation of DRAM RAPL power measurements. *Proceedings of the Second International Symposium on Memory Systems*, pp. 455-470. https://doi.org/10.1145/2989081.2989088
273. Hackenberg, D., Schöne, R., Ilsche, T., Molka, D., Schuchart, J. and Geyer, R. (2015). An energy efficiency feature survey of the Intel Haswell processor. *2015 IEEE IPDPS Workshops*, pp. 896-904. https://doi.org/10.1109/IPDPSW.2015.70
274. Apple. powermetrics(1) manual page. macOS developer tools documentation.
275. Hutter Prize for Lossless Compression of Human Knowledge. http://prize.hutter1.net/
276. Strubell, E., Ganesh, A. and McCallum, A. (2019). Energy and policy considerations for deep learning in NLP. arXiv:1906.02243 (preprint).
277. Patterson, D., Gonzalez, J., Le, Q., Liang, C. et al. (2021). Carbon emissions and large neural network training. arXiv:2104.10350 (preprint).
278. Lacoste, A., Luccioni, A., Schmidt, V. and Dandres, T. (2019). Quantifying the carbon emissions of machine learning. arXiv:1910.09700 (preprint).
279. Luccioni, A. S., Viguier, S. and Ligozat, A.-L. (2022). Estimating the carbon footprint of BLOOM, a 176B parameter language model. arXiv:2211.02001 (preprint).
280. Anthony, L. F. W., Kanding, B. and Selvan, R. (2020). Carbontracker: tracking and predicting the carbon footprint of training deep learning models. arXiv:2007.03051 (preprint).
281. Elsworth, C., Huang, K., Patterson, D., Schneider, I. et al. (2025). Measuring the environmental impact of delivering AI at Google scale. arXiv:2508.15734 (preprint).
282. Schmidhuber, J. (2010). Formal theory of creativity, fun, and intrinsic motivation (1990-2010). *IEEE Transactions on Autonomous Mental Development* 2:230-247. https://doi.org/10.1109/TAMD.2010.2056368
283. Chollet, F. (2019). On the measure of intelligence. arXiv:1911.01547 (preprint).
284. ARC Prize Foundation. ARC-AGI leaderboard. https://arcprize.org/leaderboard (accessed 8 October 2026).
285. Hernández-Orallo, J. (2017). *The Measure of All Minds: Evaluating Natural and Artificial Intelligence*. Cambridge University Press. https://doi.org/10.1017/9781316594179
286. Hernández-Orallo, J. and Dowe, D. L. (2010). Measuring universal intelligence: towards an anytime intelligence test. *Artificial Intelligence* 174:1508-1539. https://doi.org/10.1016/j.artint.2010.09.006
287. Gershman, S. J., Horvitz, E. J. and Tenenbaum, J. B. (2015). Computational rationality: a converging paradigm for intelligence in brains, minds, and machines. *Science* 349:273-278. https://doi.org/10.1126/science.aac6076
288. Lieder, F. and Griffiths, T. L. (2020). Resource-rational analysis: understanding human cognition as the optimal use of limited computational resources. *Behavioral and Brain Sciences* 43:e1. https://doi.org/10.1017/S0140525X1900061X
289. Balasubramanian, V. (2021). Brain power. *PNAS* 118:e2107022118. https://doi.org/10.1073/pnas.2107022118
290. Silver, D., Singh, S., Precup, D. and Sutton, R. S. (2021). Reward is enough. *Artificial Intelligence* 299:103535. https://doi.org/10.1016/j.artint.2021.103535
291. Vamplew, P., Smith, B. J., Källström, J., Ramos, G., Rădulescu, R. et al. (2022). Scalar reward is not enough: a response to Silver, Singh, Precup and Sutton (2021). *Autonomous Agents and Multi-Agent Systems* 36:41. https://doi.org/10.1007/s10458-022-09575-5
292. Hafez, W., Wei, C., Pena, R., Nazeri, A. et al. (2026). A mathematical theory of agency and intelligence. arXiv:2602.22519 (preprint).
293. Karagoz, A. (2025). Energentic intelligence: from self-sustaining systems to enduring artificial life. arXiv:2506.04916 (preprint).
294. Chaisson, E. J. (2011). Energy rate density as a complexity metric and evolutionary driver. *Complexity* 16:27-40. https://doi.org/10.1002/cplx.20323
295. Poplavskii, R. P. (1975). Thermodynamic models of information processes. *Uspekhi Fizicheskikh Nauk* 115:465 (in Russian), https://doi.org/10.3367/UFNr.0115.197503d.0465. English translation: *Soviet Physics Uspekhi* 18:222-241, https://doi.org/10.1070/PU1975v018n03ABEH001955
296. Ito, S. and Sagawa, T. (2017). Information thermodynamics on networks and its application to biological information processing. *Butsuri* (日本物理学会誌) 72(9):658 (in Japanese). https://doi.org/10.11316/butsuri.72.9_658
297. Sun, C.-P. and Quan, H.-T. (2013). Maxwell's demon and the physical limits on information processing. *Wuli* (物理, Physics) 42(11) (in Chinese). doi:10.7693/wl20131101
298. Quan, H.-T., Dong, H. and Sun, C.-P. (2023). Theory and experiments of mesoscopic statistical thermodynamics. *Acta Physica Sinica* 72:230501 (in Chinese, with English abstract). https://doi.org/10.7498/aps.72.20231608
299. Parrondo, J. M. R. (2023). Thermodynamics of information. arXiv:2306.12447 (encyclopedia chapter preprint).
300. Strasberg, P. Thermodynamics and information processing at the nanoscale. Doctoral thesis, Technische Universität Berlin.
301. Dago, S. (2022). Thermodynamique stochastique: pilotage de micro-oscillateurs et applications à l'étude et l'optimisation du traitement de l'information. Doctoral thesis, École normale supérieure de Lyon (in French). https://theses.fr/2022LYSEN019
302. Lagoin, M. (2023). Thermodynamique dans les systèmes stationnaires hors équilibre macroscopiques: démons de Maxwell et machines thermiques aléatoires. Doctoral thesis, École normale supérieure de Lyon (in French).
303. Ciampini, M. A., Mancino, L., Orieux, A., Vigliar, C. et al. (2017). Experimental extractable work-based multipartite separability criteria. *npj Quantum Information* 3:10. https://doi.org/10.1038/s41534-017-0011-9
304. Sudakov, K. V. (2004). Functional systems theory and the probabilistic prediction of behavior. *Neuroscience and Behavioral Physiology* 34:505-507. https://doi.org/10.1023/B:NEAB.0000022638.96382.dd
305. Sudakov, K. V. (2015). Theory of functional systems: a keystone of integrative biology. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 153-173. https://doi.org/10.1007/978-3-319-19446-2_9
306. Sudakov, K. V. (2022). Cognitive activity from the perspective of functional systems theory. In *Russian Cognitive Neuroscience*, Brill, pp. 87-117. https://doi.org/10.1163/9789004505667_005
307. Shvyrkov, V. B. (1985). Toward a psychophysiological theory of behavior. *Advances in Psychology*, pp. 47-71. https://doi.org/10.1016/S0166-4115(08)61596-4
308. Anokhin, K. V. (2021). The cognitome: seeking the fundamental neuroscience of a theory of consciousness. *Neuroscience and Behavioral Physiology* 51:915-937. https://doi.org/10.1007/s11055-021-01149-4
309. Saltykov, A. and Grachev, S. (2015). Anticipation and the concept of system-forming factor in the theory of functional systems. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 507-520. https://doi.org/10.1007/978-3-319-19446-2_30
310. Vityaev, E. E. (2015). Purposefulness as a principle of brain activity. In M. Nadin (ed.), *Anticipation: Learning from the Past*, Springer, pp. 231-254. https://doi.org/10.1007/978-3-319-19446-2_13
311. Vityaev, E. E. and Demin, A. V. (2011). Recursive subgoals discovery based on the functional systems theory. *Frontiers in Artificial Intelligence and Applications* (BICA 2011), IOS Press. https://doi.org/10.3233/978-1-60750-959-2-425
312. Vityaev, E. E. and Demin, A. V. (2018). Cognitive architecture based on the functional systems theory. *Procedia Computer Science* 145:623-628. https://doi.org/10.1016/j.procs.2018.11.072
313. Vityaev, E., Kolonin, A., Kurpatov, A., Molchanov, A. et al. (2022). Brain principles programming. arXiv:2202.12710 (preprint).
314. Potapov, A., Belikov, A., Bogdanov, V., Scherbatiy, A. et al. (2019). Differentiable probabilistic logic networks. arXiv:1907.04592 (preprint).
315. Paninski, L. (2003). Estimation of entropy and mutual information. *Neural Computation* 15:1191-1253. https://doi.org/10.1162/089976603321780272
316. Russell, S. and Wefald, E. (1991). Principles of metareasoning. *Artificial Intelligence* 49:361-395. https://doi.org/10.1016/0004-3702(91)90015-C
317. Horvitz, E. J. (1987). Reasoning about beliefs and actions under computational resource constraints. *Proceedings of the Third Conference on Uncertainty in Artificial Intelligence (UAI 1987)*, 429-447. arXiv:1304.2759.
318. Simon, H. A. and Kadane, J. B. (1975). Optimal problem-solving search: all-or-none solutions. *Artificial Intelligence* 6:235-247. https://doi.org/10.1016/0004-3702(75)90002-8
319. Sekimoto, K. (1998). Langevin equation and thermodynamics. *Progress of Theoretical Physics Supplement* 130:17-27. https://doi.org/10.1143/PTPS.130.17
320. Wolpert, D. H., Korbel, J., Lynn, C. W., Tasnim, F., Grochow, J. A., Kardeş, G. et al. (2024). Is stochastic thermodynamics the key to understanding the energy costs of computation? *PNAS* 121:e2321112121. arXiv:2311.17166. https://doi.org/10.1073/pnas.2321112121
321. Chen, L., Zaharia, M. and Zou, J. (2023). FrugalGPT: how to use large language models while reducing cost and improving performance. arXiv:2305.05176 (preprint).
322. Ong, I., Almahairi, A., Wu, V., Chiang, W.-L. et al. (2024). RouteLLM: learning to route LLMs with preference data. arXiv:2406.18665 (preprint).
323. Koyuk, T. and Seifert, U. (2020). Thermodynamic uncertainty relation for time-dependent driving. *Physical Review Letters* 125:260604. arXiv:2005.02312. https://arxiv.org/abs/2005.02312
324. Jordan, S. P. (2017). Fast quantum computation at arbitrarily low energy. *Physical Review A* 95:032305. arXiv:1701.01175. https://arxiv.org/abs/1701.01175
325. Nemenman, I., Shafee, F. and Bialek, W. (2002). Entropy and inference, revisited. *Advances in Neural Information Processing Systems* 14. arXiv:physics/0108025. https://arxiv.org/abs/physics/0108025
326. Norton, J. D. (2005). Eaters of the lotus: Landauer's principle and the return of Maxwell's demon. *Studies in History and Philosophy of Modern Physics* 36:375-411. https://doi.org/10.1016/j.shpsb.2004.12.002
327. Maroney, O. J. E. (2005). The (absence of a) relationship between thermodynamic and logical reversibility. *Studies in History and Philosophy of Modern Physics* 36:355-374. arXiv:physics/0406137. https://arxiv.org/abs/physics/0406137
328. Sagawa, T. (2014). Thermodynamic and logical reversibilities revisited. *Journal of Statistical Mechanics* P03025. arXiv:1311.1886. https://arxiv.org/abs/1311.1886
329. López-Suárez, M., Neri, I. and Gammaitoni, L. (2016). Sub-kBT micro-electromechanical irreversible logic gate. *Nature Communications* 7:12068. https://doi.org/10.1038/ncomms12068
330. Paneru, G., Lee, D. Y., Park, J.-M., Park, J. T., Noh, J. D. and Pak, H. K. (2018). Optimal tuning of a Brownian information engine operating in a nonequilibrium steady state. *Physical Review E* 98:052119. https://doi.org/10.1103/PhysRevE.98.052119
331. Panizon, E. (2026). Optimal control of a mesoscopic information engine. arXiv:2603.29804 (preprint). https://arxiv.org/abs/2603.29804
332. Rolandi, A., Abiuso, P., Lipka-Bartosik, P. et al. (2026). Energy-time-accuracy tradeoffs in thermodynamic computing. arXiv:2601.04358 (preprint). https://arxiv.org/abs/2601.04358
333. Burnell, R., Schellaert, W., Burden, J. et al. (2023). Rethink reporting of evaluation results in AI. *Science* 380:136-138. https://doi.org/10.1126/science.adf6369
334. Zhou, L., Pacchiardi, L., Martínez-Plumed, F. et al. (2025). General scales unlock AI evaluation with explanatory and predictive power. arXiv:2503.06378 (preprint). https://arxiv.org/abs/2503.06378
335. Laber, M., Shafi, Z., Savcisens, G. et al. (2026). Scaling of capability and efficiency at inference time in large reasoning models. arXiv:2609.27166 (preprint). https://arxiv.org/abs/2609.27166
336. Erol, M. H., El, B., Suzgun, M., Yuksekgonul, M. and Zou, J. (2025). Cost-of-Pass: an economic framework for evaluating language models. arXiv:2504.13359 (preprint). https://arxiv.org/abs/2504.13359
337. Saad-Falcon, J., Narayan, A., Akengin, H. O. et al. (2025). Intelligence per Watt: measuring intelligence efficiency of local AI. arXiv:2511.07885 (preprint). https://arxiv.org/abs/2511.07885
338. Standard Performance Evaluation Corporation. SPECpower_ssj2008. https://www.spec.org/power_ssj2008/
339. Krakauer, D. C., Mitchell, M. and Krakauer, J. W. (2026). Large language models and emergence: a complex systems perspective. *Philosophical Transactions of the Royal Society A* 384:20250014. https://doi.org/10.1098/rsta.2025.0014. arXiv:2506.11135.
340. Krakauer, D. C. (2026). Competitive and complementary tools. arXiv:2607.18460 (preprint). https://arxiv.org/abs/2607.18460
341. Kimura, M. (1961). Natural selection as the process of accumulating genetic information in adaptive evolution. *Genetical Research* 2:127-140. https://doi.org/10.1017/S0016672300000616
342. Worden, R. P. (1995). A speed limit for evolution. *Journal of Theoretical Biology* 176:137-152. https://doi.org/10.1006/jtbi.1995.0183
343. Hledík, M., Barton, N. and Tkačik, G. (2022). Accumulation and maintenance of information in evolution. *PNAS* 119:e2123152119. https://doi.org/10.1073/pnas.2123152119
