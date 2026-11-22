---
title: "RCE-VC: Gesetz der Versionskontrolle"
deck: "RCE-VC (ein Versionskontroll-Referenz, getrennt von der Reality-Code-Engine-Sprache) lässt jede Änderung in einen kanonischen Repository-Zustand zu oder verweigert sie mit einem aufgezeichneten Grund, zerlegt Rust- und Python-Dateien in namenfreie Top-Level-Elemente und liest sowie schreibt gewöhnliche Git-Historie. Meilensteine M0, M1 und M2 sind bei öffentlichem Commit aba99fce (49 Offline-Tests) implementiert. Bei 100.000 Einheiten auf Apple M5 Max benötigt die Zulassung 69,7 bis 73,6 Mikrosekunden und 317 bis 365 Mikrojoule an per-Prozess-Kernel-rusage-Energie (`reported_j`; `measured_j` ist nicht gesetzt)."
lang: "de"
source: "rce-vc"
complete: true
---

<div id="rce-vc-law-of-version-control" class="anchor-alias" aria-hidden="true"></div>

*Überarbeitung af57f48, 22. November 2026. Referenzimplementierung: [openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc) unter [`aba99fcec4414a32bff30ab075668350d3fb80bf`](https://github.com/openIE-dev/rce-vc/tree/aba99fcec4414a32bff30ab075668350d3fb80bf) (13. November 2026), die den initialen Baum `8bf9c9af` um die Aufteilung von Rust- und Python-Items auf oberster Ebene in `rcevc-keys`, die Grenze `rcevc-core::assure` (`49` Offline-Tests) und die am 22. November 2026 erfassten `reported_j`-Zulassungsmessungen auf Apple M5 Max aktualisiert.*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

RCE-VC ist ein Versionskontroll-Design und ein kleines Referenzbeispiel in Rust. Viele Schreiber, Personen oder Programme reichen Änderungen gegen einen gemeinsamen Zustand ein. Eine benannte Prüfung akzeptiert das Ergebnis, oder die Änderung wird abgelehnt und der Grund wird festgehalten. Schreiber können bei Git bleiben. Die Referenz ist nicht die Reality Code Engine Sprache. Sie verwendet dieselbe Rahmenstruktur: ein Formular, einen Gesamtschritt, ein hashverkettetes Protokoll, namenfreie Schlüssel und eine Kette von Zahnrädern, wobei das Modell zuletzt kommt.

**Einfach ausgedrückt**

1. Eine beliebige Anzahl von Personen und Programmen kann gleichzeitig schreiben. Eine Änderung tritt in die gemeinsame Historie ein, wenn eine benannte Prüfung das Ergebnis akzeptiert. Wenn die Prüfung sie nicht akzeptiert, bleibt die Änderung außen und der Grund wird notiert. Wer sie geschrieben hat, entscheidet nicht.
2. Änderungen, die unterschiedliche Dinge betreffen, müssen nicht aufeinander warten. Wenn sie sich überschneiden, ordnet ein im Voraus festgelegter Preis die bestandenen Ergebnisse, und ein einmal akzeptiertes Ergebnis, einschließlich eines gelösten Konflikts, wird wiederverwendet. Ein Modell wird erst abgefragt, nachdem die günstigeren Schritte fehlgeschlagen sind, und seine Antwort muss ebenfalls die Prüfung bestehen.
3. Die Referenz liest und schreibt gewöhnliche Git-Historie und teilt nun Rust- und Python-Dateien in namenfreie Top-Level-Elemente (`rcevc-keys`) auf, sodass ein Schreiber Git nicht verlassen muss. Bei `aba99fce` auf Apple M5 Max dauerte das Akzeptieren einer Änderung gegen ein Repository mit 100 000 Einheiten `69.7-73.6 µs` und `317-365 µJ` im betriebssystemseitigen pro-Prozess-Kernel `ri_energy_nj` (`reported_j`). Die Felder des Belegs `est_uj` bleiben eine angegebene Ganzzahl-Tabelle (`424,153 µJ` Mittelwert bei gleicher Arbeitslast), und es war keine externe Hardware-Stromschiene oder Wandmonitor angeschlossen (`measured_j = None`, `board_metered = false`).

<div id="terms-and-labels" class="anchor-alias" aria-hidden="true"></div>

## Begriffe und Bezeichnungen

<ul id="terms">
<li>SHA: SHA-256, die Hashfunktion, die die Referenzimplementierung für Schlüssel, Inhalts-Digests und das Protokoll verwendet</li>
<li>BLAKE3: eine kryptographische Hashfunktion, die als Entwurfsziel für interne Schlüssel benannt ist; die Referenzimplementierung verwendet sie noch nicht</li>
<li>HAMT: Hash Array Mapped Trie, die persistente Abbildung, die den Repository-Zustand hält</li>
<li>UTF: UTF-8, die Textkodierung, die die Git-Dateiabbildung akzeptiert</li>
<li>MSRV: minimale unterstützte Rust-Version (`1.85` für `rcevc-core` und `rcevc-proj-git`, `1.90` für `rcevc-keys`)</li>
<li>CI: kontinuierliche Integration (`cargo test --locked --offline --all-targets` mit `rustc 1.100.0`)</li>
<li>CAS: Vergleichen-und-Tauschen-Aktualisierung einer Referenz (`CasRef` und `GitDir::compare_and_swap_ref`)</li>
<li>FIPS: Federal Information Processing Standards; die SHA-256-Prüfungen verwenden die Testvektoren aus FIPS 180-4</li>
<li>RFC: Request for Comments; der Inflate-Code folgt RFC 1950 und RFC 1951</li>
<li>SATB, CPU, GPU, PID, SMC, SoC: Disziplin der Satiation-Benchmark-Telemetrie, Zentralprozessor (central processing unit), Grafikprozessor (graphics processing unit), Prozesskennung (process identifier), System Management Controller und System-on-Chip</li>
<li>VC1, VC2, VC3, VC4, VC5: die fünf Aussagen, die die Referenzimplementierung prüft, benannt mit ihren Tests weiter unten</li>
<li>CONGRA: ein Korpus, der in den Projektnotizen für eine spätere Wiedergabe genannt wird; der Name wird auf dieser Seite nicht aufgelöst</li>
<li>README: die Übersichtsdatei, die im Referenz-Repository ausgeliefert wird</li>
</ul>

Drei Bezeichnungen bleiben auf dieser Seite getrennt bei der Telemetrie über den gesamten Chip (L2) und pro Prozess (L3):

- **Gemessen (Wallzeit und Zählungen)** bedeutet eine Echtzeit-Uhrzeit, Instruktionszählung oder Pfadzählung aus dem Release-Build (`aba99fce` auf Apple M5 Max und dem im README gedruckten Basiswert bei `8bf9c9af`).
- **Gemeldet (`reported_j`: L2- und L3-Zähler)** bedeutet eine Messung eines Betriebssystem- oder On-Chip-Zählers auf Apple M5 Max (`macOS 27.2.1`): ganz-Chip `IOReport` über `macmon` (L2, gemeinsam genutztes Host-Label `A2`, gesteuert durch Falsifier 6 bei `<= 5.0%` Vor-/Nach-Idle-Drift) und pro-PID-Kernel `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (L3, Label `D`). Es war keine externe Stromschiene oder Netzstecker-Leistungsanzeige angeschlossen (`measured_j = None`, `board_metered = false`).
- **Deklariert (`est_uj` / `est_j`)** bedeutet die standardmäßige Ganzzahl-Kosten-tabelle, die innerhalb von `rcevc-core` auf Belegen dupliziert wird. Sie ist eine analytische Tabelle, die im Quellcode geschrieben ist, niemals ein Zähler- oder Wand-Messwert.

<div id="1-what-the-reference-is-and-what-it-is-not" class="anchor-alias" aria-hidden="true"></div>

## 1. Was die Referenz ist und was sie nicht ist

Das Ziel des Projekts ist eine Historie, die viele Menschen und Agenten gleichzeitig schreiben können, ohne einen Autor zu bitten, die Nutzung von Git einzustellen. Die Rahmung in den Projektnotizen lautet, dass Verzweigen, Vergleichen und Zusammenführen in eine Hauptlinie eine alte Schnittstelle darstellen, dass Kompatibilität diese Schnittstelle aufrechterhält und dass eine deterministische Regel überall dort entscheiden soll, wo eine Regel möglich ist, mit einem Modell zuletzt.

Die Reality Code Engine (RCE) ist eine Programmiersprache, die in einem eigenen Papier auf dieser Seite untersucht wird. RCE-VC ist nicht auf dieser Sprache aufgebaut. Es parst keine RCE-Programme, emittiert sie nicht und ruft den RCE-Prüfer nicht auf. Gemeinsam ist die Rahmung: eine Form für das Repository, ein total deterministischer Schritt namens δ, ein hash-verkettetes Log, dessen Faltung der Zustand ist, namensfreie Schlüssel sowie eine Leiter von Zahnrädern, in der ein Modell zuletzt läuft und nicht vertraut wird.

Zum Commit `aba99fce` (`13 November 2026`) ist der öffentliche Arbeitsbereich in Version 0.1.0 und enthält **drei** Crates:

1. `rcevc-core` ist der deterministische Kern: keine Uhr, keine Zufälligkeit, keine Ein-/Ausgabe, keine Abhängigkeiten und `#![forbid(unsafe_code)]` (MSRV `1.85`). Er enthält nun auch `rcevc-core::assure`, eine Sicherheitsgrenze, die sicherstellt, dass eine geprüfte Aktion nur aus einem Ergebnis geprägt wird, das bereits im Log dieses Repositorys vorliegt, und nur am Kopf und am Gate angewendet wird, gegen das sie geprüft wurde, während `CasRef` einen Operationsbezeichner erneut versucht, damit das identische Ziel eines anderen Autors niemals fälschlich als Erfolg gewertet wird.
2. `rcevc-keys` zerlegt Rust- (`.rs`) und Python- (`.py`) Quelltextdateien in Top-Level-Elemente unter Verwendung von vendoriertem `tree-sitter 0.27.2`, `tree-sitter-rust 0.24.2` und `tree-sitter-python 0.25.0` (MSRV `1.90`, offline aus `vendor/` mit einem C-Compiler und ohne Netzwerkzugriffe gebaut). Der Bezeichner jedes Elements ist der namensfreie Kernschlüssel eines normalisierten Tokenkörpers, invariant gegenüber Umbenennungen von Elementen, Leerzeichen und Kommentaren, während die exakten ursprünglichen Bytes in `parts` verbleiben, sodass `project` sie verlustfrei zurückkonkateniert; Pfade außerhalb von `.rs`/`.py` oder Parse-Fehlerbäume fallen sauber auf ein Blatt über den ursprünglichen Bytes zurück.
3. `rcevc-proj-git` ist die Git-Projektion (`#![forbid(unsafe_code)]`, MSRV `1.85`), die ihren eigenen SHA-1-, zlib- und Git-Objektcode sowie `GitDir::compare_and_swap_ref` mitführt, damit der Kern frei von Abhängigkeiten bleibt.

Die CI führt `cargo test --locked --offline --all-targets` und `cargo clippy --locked --offline --all-targets -- -D warnings` auf `rustc 1.100.0` aus und führt dabei **49 Offline-Tests** aus (`29` in `rcevc-core`, `8` in `rcevc-keys` und `12` in `rcevc-proj-git`, verifiziert gegen `git 2.43`). Propositionen mit Nummern jenseits von VC5 werden auf dieser Seite nicht formuliert.

<div id="2-law-of-version-control" class="anchor-alias" aria-hidden="true"></div>

## 2. Gesetz der Versionskontrolle

Die Referenz formuliert es wie folgt. Derselbe Absatz eröffnet das README des Repositoriums und die Crate-Dokumentation. Er wird hier einmalig zitiert.

> Versionskontrolle ist die Zulassung von Änderungen zu einem kanonischen, namenlosen Repository-Zustand. Jede Änderung wird nur zugelassen, wenn ein benannter Prüfer den Nachzustand unter einem deklarierten Vertrag akzeptiert, oder sie wird unter Angabe eines protokollierten Grundes abgelehnt; Änderungen, deren Abhängigkeitsabschlüsse nicht erfüllt sind, werden ohne Koordination zugelassen; unter den zulässigen Integrationen ordnet ein angegebener Aufwand die Kandidaten; und jedes akzeptierte Ergebnis, einschließlich jedes aufgelösten Konflikts, wird wiederverwendet.

Der Rest dieser Seite beschreibt, was die Referenz unter `aba99fce` implementiert, was an ihr gemessen wurde und was sie noch nicht leistet. Die Formulierung ist der Maßstab, auf den die Referenz ausgelegt ist. Sie ist kein Bericht darüber, dass bestehende Versionskontrollwerkzeuge sich bereits so verhalten.

<div id="3-quantities" class="anchor-alias" aria-hidden="true"></div>

## 3. Größen

Eine **Einheit** ist ein Textkörper und eine Liste von Abhängigkeitsslots. Ist die Abhängigkeitsliste leer, so ist die Einheit ein Blatt und der Körper besteht aus literalem Text; ein Dollarzeichen in einem Shell-Skript bleibt daher ein Dollarzeichen. Ist die Liste nicht leer, wählt ein Dollarzeichen gefolgt von einem Index die entsprechende Abhängigkeit aus, und zwei Dollarzeichen stehen für ein literales Dollarzeichen.

Der **Schlüssel** einer Einheit ist eine namenfreie Identität. Eine Umbenennung ändert, an welchen Slot ein Name gebunden wird. Sie ändert den Schlüssel nicht. Die Referenz definiert

$$
\mathrm{key}(u) = H(\texttt{rcevc/unit/v1},\; \mathrm{body}(u),\; \mathrm{key}(d_0), \ldots, \mathrm{key}(d_{m-1}))
$$

wobei $H$ eine SHA-256-Hashfunktion durch einen versionierten, domänenseparierten Kodierer ist und $d_i$ die Abhängigkeitseinheiten sind. Der **Inhaltsdigest**, den der Trie hasht, ist ein anderer Wert: $H(\mathrm{body}, \text{dependency names})$.

Ein **Entwurf** ist eine unvalidierte Abbildung, die für den Genesis-Vorgang und für alles verwendet wird, was von außen gelesen wird. Das Versiegeln eines Entwurfs prüft ihn und erzeugt einen **Zustand**. Ein Zustand ist wohlgeformt: Abhängigkeiten werden aufgelöst, jeder Index im Körper ist gebunden und der Abhängigkeitsgraph enthält keinen Zyklus. Er hält drei persistente Abbildungen. Die Einheitenabbildung ist ein Merkle-HAMT. Die Schlüsselabbildung und der Rückwärtsabhängigkeitsindex sind persistent und gehören nicht zur Merkle-Wurzel. Das Klonen eines Zustands und das Lesen seiner Wurzel sind $O(1)$. Zwei Zustände sind gleich, wenn ihre Wurzeln gleich sind. Ein Diff durchläuft nur Teilbäume, deren Hashes sich unterscheiden, sodass seine Kosten der Differenz folgen und nicht der Größe des Repositorys. Abhängige, deren Schlüssel sich geändert hat, deren eigene Einheit jedoch unverändert blieb, werden absichtlich aus dem Diff ausgelassen. Die unten definierte Abschließung führt diese Abhängigen mit. Ihre Aufnahme in das Diff würde einen geteilten Abhängigen in einen falschen Konflikt verwandeln.

Eine **Bearbeitung** ändert Slots und validiert einmal am Ende über der Rückwärtsabhängigkeitsabschließung der berührten Slots. Zustände innerhalb einer Bearbeitung dürfen wohlgeformt sein. Das ist beabsichtigt, zum Beispiel bei einer Löschung gefolgt von einem Einfügen.

Eine **Änderung** trägt eine opake Schreiberkennung, einen Basiszustand, eine Stufe, eine Liste von Operationen und eine Nachricht. Die Operationen sind Einfügen, Löschen und Umbenennen. Die Stufen sind namenrein, Erratum, Bedeutungsänderung und Schnittstellenänderung. Die namenreine Stufe wird vom Kernel geprüft: die Multiset der Schlüssel muss unverändert bleiben. Der Änderungskennzeichner umfasst jedes Feld. Die Nachricht ist die erklärte Absicht, zum Beispiel der Betreff eines Commits. Die Zulassung liest sie nicht, und sie hängt nicht von der Schreiberkennung ab.

Für eine Änderung $c$ gegenüber einem Zustand $s$ gilt

$$
\mathrm{writes}(c, s) = \mathrm{diff}(s,\; \mathrm{apply}(s, c)).
$$

Lesezugriffe sind die Abhängigkeiten von Einfügungen und die Quellen von Umbenennungen. Die Abschließung von $c$ in einem Zustand und im Nachzustand umfasst die Schreibzugriffe, die Abhängigen vorher, die Abhängigen nachher und die Lesezugriffe. Zwei Änderungen kommutieren bezüglich $s$, wenn die Schreibzugriffe der einen die Abschließung der anderen verfehlen:

$$
\mathrm{commutes}(a, b, s) \iff \mathrm{writes}(a) \cap \mathrm{closure}(b) = \emptyset \;\land\; \mathrm{writes}(b) \cap \mathrm{closure}(a) = \emptyset.
$$

Der Referenztest prüft, dass kommutierende Änderungen in beiden Reihenfolgen dieselbe Wurzel ergeben.

Der Schritt **δ** ist `submit`. Er ist total über Benutzereingaben definiert. Er liefert entweder eine Annahme mit Quittung oder eine Ablehnung mit Begründung und hängt in beiden Fällen genau einen hash-verketteten Logeintrag an. Der Kopf ist die Faltung dieses Logs. Die Wiedergabe (Replay) verifiziert die Kette und integriert jeden Eintrag erneut. Für einen Konflikt verwendet sie die aufgezeichnete Auflösung. Sie ruft keinen Proposer auf. Sie prüft jede Vorzustands-Wurzel, jede Nachzustands-Wurzel und jede Ablehnungsbegründung.

<div id="4-the-repository-form" class="anchor-alias" aria-hidden="true"></div>

## 4. Die Repository-Form

Die README gliedert die implementierte Form in neun Teile, plus den `rcevc-keys` Element-Splitter und die `rcevc-core::assure` Grenze.

| Teil | Wo | Was es tut |
|---|---|---|
| R, namensfreie Schlüssel | `model.rs`, `rcevc-keys` | Schlüssel wie oben; `rcevc-keys` teilt `.rs`- und `.py`-Dateien in Top-Level-Elemente mit verlustfreier Byte-Projektion. Eine Umbenennung ändert keinen Schlüssel. |
| S, persistenter Zustand | `hamt.rs`, `model.rs` | Merkle-HAMT. Klonen und Wurzel in $O(1)$, Unterschied in der Größe der Differenz, kanonische Trie-Form. Schlüssel und der Rückwärts-Abhängigkeits-Index werden bei der Bearbeitung aktualisiert, nicht für das gesamte Repository. |
| Δ, getypte Änderungen | `change.rs` | Einfügen, Löschen und Umbenennen gegenüber einer deklarierten Basis, mit einer deklarierten Ebene. Nur der Name wird vom Kernel geprüft. |
| X, Kommutativität | `change.rs` | Schreibvorgänge sind das eigentliche Diff. Der Abschluss fügt Abhängige vor und nach hinzu, und liest. Disjunkte Abschlüsse kommutieren. |
| K und G, Prüfer und Tor | `gate.rs` | Jeder Prüfer spezifiziert eine Eigenschaftsklasse, eine Verknüpfungsannahme, eine vertrauenswürdige Basis, eine Autorität, einen Geltungsbereich und einen Digest. |
| δ, die Leiter | `repo.rs`, `assure.rs` | Lookup, Kommutativität, strukturelle Zusammenführung, Neubewertung, Vorschlag, plus CAS-Ref-Sicherheit (`CasRef`). Das Tor wird auf jedem Pfad ausgeführt. |
| D, das Log | `repo.rs` | Hash-verkettete Einträge. Der Kopf ist die Faltung. Replay baut es ohne Vorschlag erneut auf. |
| U, Wiederverwendung | `repo.rs` | Eine Auflösung wird unter einer namensfreien Konfliktsignatur gespeichert und nur nach Annahme durch das Tor verwendet. |
| C, Kosten | `repo.rs` | Die angegebene pro-Stufe-Tabelle (`est_uj`). Quittungen tragen die Summe. |

Die Autorität eines Prüfers ist eine von: pinned, replay, proved, derived oder inferred. Sein Geltungsbereich ist einer von drei. **Einheit**: Wiederprüfen von Einheiten im Delta. **Abschluss**: Das Urteil hängt von der Einheit und ihren transitiven Abhängigkeiten ab, daher prüft das Tor auch abhängige Elemente nach. **Global**: Prüfen des gesamten Zustands. Wenn der vorherige Kopf bestand und der deklarierte Geltungsbereich wahr ist, entspricht eine scoped Wiederprüfung einer vollständigen Prüfung. Der Test `delta_gate_agrees_with_full_gate` protokolliert diese Übereinstimmung über 600 Versuche, mit mehr als 100 Ablehnungen. Ein Prüfer, der seine Reichweite fälscht, verletzt VC2. Der Geltungsbereich ist vertrauenswürdig. In dieser Version wird er nicht erzwungen, indem der Rest des Zustands verborgen wird.

Der Tor-Digest umfasst jede Aussage des Prüfers, und dieser Digest liefert den Genesis-Hash. Die Trie-Form ist kanonisch: ein Präfix enthält nichts, ein einzelnes Blatt oder einen Zweig von zwei oder mehr Schlüsseln. Wurzeln hängen nicht von der Ankunftsreihenfolge der Historie ab. Alles, was gehasht wird, durchläuft den Encoder mit einem versionierten Domänentag der Form `rcevc/<thing>/vN`. Das Ändern dessen, was ein Tag abdeckt, bedeutet ein Versions-Bump.

<div id="5-the-transition" class="anchor-alias" aria-hidden="true"></div>

## 5. Der Übergang

`submit` durchläuft stets einen der folgenden Pfade. Die Getriebebezeichnungen sind die auf dem Beleg vermerkten.

1. **G0, Nachschlagen.** Dieselbe Änderungskennung gegen denselben Kopf, bereits abgelehnt, liefert die gespeicherte Ablehnung zurück. Die angegebene Kosten dieses Wiederholversuchs bestehen allein aus der G0-Zeile. Der Test `g0_identical_retry_costs_one_lookup` protokolliert dies.
2. **Basis.** Der Basissnapshot muss vorhanden sein, andernfalls lautet der Grund unbekannte Basis. Das Anwenden der Operationen auf diese Basis muss gelingen, andernfalls lautet der Grund ein Anwendungsfehler oder eine fehlgeformte Einheit. Ein reiner Namensanspruch, der die Multiset der Schlüssel nicht unverändert lässt, wird abgelehnt.
3. **G1, Kommutation.** Sei die verschobene Menge die Differenz von der Basis zum aktuellen Kopf. Wenn der Abschluss der Änderung in der Basis und im Kopf diese Menge verfehlt, wird die Änderung direkt auf den Kopf angewendet. Kein Merge.
4. **G2, struktureller Merge.** Andernfalls führt die Referenz Slot für Slot einen Merge über der Vereinigung dessen durch, was sich auf dem Kopf bewegt hat, und dessen, was die Änderung selbst verändert hat. Eine Seite unverändert: die andere Seite übernehmen. Beide Seiten gleich: eine von beiden übernehmen. Jeder andere Slot ist ein Konflikt.
5. **Konflikt.** Die Signatur lautet $H(\mathrm{key}_{base}, \mathrm{key}_{head}, \mathrm{key}_{theirs})$, die den Namen des Slots nicht verwendet. G0-Wiederverwendung liefert eine gespeicherte Auflösung für diese Signatur. Ist keine gespeichert, fragt G4 den Antragsteller. Gibt es keinen Antragsteller oder liefert dieser nichts, wird die Änderung mit den konfliktbehafteten Slots abgelehnt. Während der Wiedergabe wird die aufgezeichnete Auflösung verwendet und der Antragsteller nicht aufgerufen.
6. **G3, Revalidierung.** Die zusammengeführte Zuweisung wird auf dem Kopf mit einer Wohlgeformtheitsprüfung aufgebaut. Schlägt diese Prüfung fehl, wird die Änderung als fehlgeformt abgelehnt.
7. **Gate, auf jedem Pfad, einschließlich G1.** Der Kandidat und die Differenz vom aktuellen Kopf werden dem Gate übergeben. Ein fehlschlagender Checker lehnt die Änderung ab und benennt den Checker.
8. **Annehmen.** Auflösungen des Antragstellers werden erst jetzt in den Wiederverwendungsspeicher kopiert. Der neue Kopf wird gesnapshottet. Der Beleg zeichnet die verwendeten Getriebe, den Gate-Beleg, die Auflösungen und `est_uj` auf.

Ablehnungen werden ebenfalls protokolliert. Der Kopf bewegt sich nicht.

<div id="6-propositions-the-tests-hold" class="anchor-alias" aria-hidden="true"></div>

## 6. Die von den Tests geprüften Aussagen

Bei `aba99fce` führt `cargo test --offline` 49 Tests aus (`29` im Kern, `8` für Schlüssel, `12` für Git), die den folgenden Aussagen zugeordnet sind:

| Aussage | Im Repository benannter Test |
|---|---|
| VC1, Totalität, kein Zwischenzustand: Jede Einreichung wird mit Begründung angenommen oder abgelehnt und protokolliert | `vc1_every_submission_is_accepted_or_refused_and_logged` |
| VC2, Grün durch Induktion: Jeder Kopf ist wohlgeformt und besteht das Gate | `vc2_every_head_is_well_formed_and_passes_the_gate` (400 zufällige Einreichungen, veraltete Basen, vergiftete Änderungen) |
| VC3, Kommutation impliziert dasselbe Ergebnis in beiden Reihenfolgen | `vc3_commutation_implies_order_independence` (3.000 zufällige Durchläufe, mehr als 500 kommutierende Paare) und `vc3_disjoint_writers_integrate_at_g1_in_either_order` |
| VC4, ein semantischer Konflikt wird erkannt, auch wenn der Text nicht kollidiert | `vc4_identical_edits_merge_and_semantic_conflicts_are_caught_at_g3` (eine Aritätsänderung gegenüber einem neuen Aufrufer) |
| VC5, ein gelöster Konflikt wird über seine namensfreie Signatur wiederverwendet | `vc5_resolved_conflicts_are_reused_by_name_free_signature` |
| Ein Modellergebnis ist ein Kandidat | `model_output_is_a_candidate_never_trusted` |
| Der Zustand ist die Faltung des Protokolls | `replay_reproduces_head_without_any_proposer` |
| Eine Umbenennung ändert keinen Schlüssel, und reine Namensprüfung wird verifiziert | `renames_change_no_keys_and_name_only_is_verified` |
| G0: Idempotente Wiederholungen kosten einen Nachschlagevorgang | `g0_identical_retry_costs_one_lookup` |
| Das Gate mit eingeschränktem Umfang stimmt mit einem vollständigen Gate überein | `delta_gate_agrees_with_full_gate` (600 Durchläufe, mehr als 100 Ablehnungen) |
| Snapshots bleiben von späteren Änderungen unberührt; inkrementell stimmt mit Neuberechnung überein | `snapshots_share_structure_and_diff_is_exact` sowie HAMT-Tests in `hamt.rs` |
| SHA-256 stimmt mit den veröffentlichten Vektoren überein | FIPS-180-4-Vektoren in `hash.rs` |

Der Test zu VC5 akzeptiert einen Konflikt über den Vorschlagsweg und reicht anschließend denselben Konflikt unter einem anderen Slot-Namen ein. Die zweite Annahme nutzt die G0-Nachschlagestufe, durchläuft G4 nicht, ruft den Vorschlagsgeber nicht erneut auf und weist `est_uj` auf, das weniger als ein Hundertstel der Quittung des Vorschlagswegs beträgt. Dieses Verhältnis ist ein Vergleich angegebener Quittungskosten.

Ein separater Test speist dem Vorschlagsgeber ein vergiftetes Ergebnis ein. Das Gate lehnt es ab, der Kopf bleibt unverändert, und die abgelehnte Auflösung wird nicht zur Wiederverwendung gespeichert.

<div id="7-measured-wall-time" class="anchor-alias" aria-hidden="true"></div>

## 7. Gemessene Laufzeit

Die Arbeitslast, wie sie das Schwarm-Beispiel implementiert: Jeder Schreiber in einer Runde reicht gegen den Ausgangskopf dieser Runde ein, sodass spätere Einreichungen in derselben Runde veraltet sind. Ein Schreiber von fünf bearbeitet das heiße Modul (`below(5) == 0`). Eine Einreichung von fünfzig enthält ein verbotenes Token (`below(50) == 0`), was der im README angegebenen 2%-igen Giftquote entspricht. Der Vorschlagende im Beispiel ist ein deterministischer Stellvertreter, der die beiden Körper zusammenführt. Er ist kein gelerntes Modell. Das Beispiel speichert 10 Einheiten in jedem Modul. Der feste Seed im Beispiel ist `0x5eed`.

<div id="71-path-shares-at-400-units" class="anchor-alias" aria-hidden="true"></div>

### 7.1 Pfadanteile bei 400 Einheiten

Die Pfadtabelle des README ist der Standard-Schwarm: 64 Schreiber, 20 Runden, 40 Module, 400 Einheiten, 1.280 Einreichungen. Die Anteile beziehen sich auf alle Einreichungen.

| Pfad | Anteil |
|---|---:|
| Akzeptiert bei G1 (umgeordnet, kein Merge) | 57,0% |
| Akzeptiert bei G2, dann G3 (struktureller Merge, neu validiert) | 27,3% |
| Akzeptiert bei G2, dann G4, dann G3 (Konflikt, Proposer, neu validiert) | 13,8% |
| Vom Gate abgelehnt | 1,9% |

Die vier Anteile summieren sich auf 100. Jede Ablehnung war eine vergiftete Änderung, einschließlich 6 Proposer-Ausgaben, die das Gift geerbt hatten. 1.259 der 1.280 Einreichungen lagen auf einer veralteten Basis, und 98,1% dieser veralteten Einreichungen wurden ohne erneutes Rebasen des Schreibers zugelassen. Das Beispiel führte 182 Proposer-Aufrufe aus. Ein Replay ab dem Genesis-Zustand ohne Proposer reproduzierte denselben Head.

![Zulassungspfade und Wandzeiten, gemessen am Referenz-Build](/figures/rce-vc/swarm-and-timing.svg)

*Abbildung 1. Gemessene Pfadanteile für den 400-Einheiten-, 20-Runden-Schwarm sowie gemessene Wandzeit pro Einreichung für die 5-Runden-Zeitmessungen auf dem Basis-Referenz-Build. Release, ein Kern. Die angegebenen Empfangskosten sind nicht in dieser Abbildung enthalten.*

<div id="72-integration-cost-against-repository-size" class="anchor-alias" aria-hidden="true"></div>

### 7.2 Integrationskosten in Abhängigkeit von der Repository-Größe

Die Zeittabelle der README beschreibt dieselbe Art von Arbeitslast mit 64 Schreibern und 5 Runden, gleichem Seed, Release-Build und einem Kern. Die Zelle gibt die gemessene Wanduhrzeit pro Einreichung an. M0 ist der frühere Zustand mit geklonten Maps. M1 ist der persistente Merkle-Zustand.

| Einheiten | Module | M0, geklonte Maps | M1, persistenter Zustand (Host der README) | Im README angegebenes Verhältnis |
|---:|---:|---:|---:|---:|
| 400 | 40 | 2.103 µs | 98 µs | 21-mal |
| 4.000 | 400 | 27.536 µs | 105 µs | 262-mal |
| 40.000 | 4.000 | nicht ausgeführt | 136 µs | |
| 100.000 | 10.000 | nicht ausgeführt | 188 µs | |

Die Zeile mit 100.000 Einheiten entspricht dem Beispiel, das als `swarm -- 64 5 10000` aufgerufen wird: 64 Schreiber, 5 Runden, 10.000 Module. M0 wuchs mit der Repository-Größe, während M1 nahezu konstant blieb. Der verbleibende Anstieg ergibt sich aus der Tiefe des Tries und aus dem Umfang der Änderungen innerhalb einer Runde. Snapshots teilen Struktur, `diff` und das Gate überspringen gleiche Teilbäume, eine Änderung schlüsselt nur die geänderten Einheiten und deren Abhängigkeiten neu, und das Gate prüft den deklarierten Geltungsbereich des Deltas erneut.

<div id="73-measured-wall-time-and-on-chip-reported_j-at-100000-units-commit-aba99fce" class="anchor-alias" aria-hidden="true"></div>

### 7.3 Gemessene Echtzeit und on-chip `reported_j` bei 100.000 Einheiten (Commit `aba99fce`)

Am 22. November 2026 wurde `openIE-dev/rce-vc` bei Commit `aba99fce` (`rustc 1.100.0`, Release-Build) auf Apple M5 Max (`macOS 27.2.1` `arm64`) unter dem Dual-Channel-SATB `reported_j`-Harness ausgeführt und instrumentiert: Ganz-Chip `IOReport` via `macmon` (L2, Label `A2`, Falsifier 6 `<= 5.0%` Leerlauf-Drift-Gate) kombiniert mit pro-PID Kernel `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (L3, Label `D`), bei `100,000` Einheiten (`10,000` Module × `10` Einheiten):

| `100,000`-Einheiten-Last (`aba99fce`, Apple M5 Max) | Zulassungen / Durchlauf | Durchläufe | Median-Echtzeit / Zulassung | Median L3 `reported_j` / Zulassung | Instruktionen / Zulassung | Angegebene `CostTable` `est_uj` / Zulassung |
|---|---:|---:|---:|---:|---:|---:|
| **README-Schwarm (`64` Schreibende × `5` Runden)** | `320` (`315` acc, `5` ref) | `5` | **`69.69 µs`** (`63.5-84.1 µs`) | **`365.35 µJ`** (`346.4-395.7 µJ`) | `1,147,137` | `438,530.4 µJ` |
| **Dauerhaftes Fenster (`64` Schreibende × `500` Runden)** | `32,000` (`31,357` acc, `643` ref) | `3` | **`73.56 µs`** (`69.3-75.7 µs`) | **`317.21 µJ`** (`278.9-369.0 µJ`) | `1,153,976` | `424,152.7 µJ` |

- **Entstehungs- und Pfadaufgliederung**: Der Aufbau des `100,000`-Einheiten Merkle-HAMT-Genesis-Zustands dauerte median **`1.244 s`** einmal (`5` Versuche). Im `32,000`-Einreichungs-dauerhaften Lauf (`2.35 s` Fenster) wurden `26,103` Einreichungen (`81.6%`) bei `G1Commute` zugelassen, `2,594` (`8.1%`) bei `G2Structural > G3Revalidate`, `2,660` (`8.3%`) über `G4Proposer` mit `2,660` Konflikt-Signaturen zur Wiederverwendung gefördert, und `643` (`2.0%`) vergiftete Einreichungen wurden abgelehnt (`30,857` von `31,490` veralteten Einreichungen = `98.0%` ohne Writer-Rebase zugelassen).
- **L2 vs L3 Konsistenz und Falsifier 6**: Bei den beiden dauerhaften Versuchen, die Falsifier 6 bestanden (`2.67%` und `1.22%` Leerlauf-Drift), betrug die net-marginale Energie des gesamten Chips L2 `IOReport` `9.22 J` bzw. `4.66 J` (`288.2 µJ` und `145.6 µJ`/Zulassung) neben dem pro-PID L3 `ri_energy_nj` von `11.81 J` und `8.92 J` (`369.0 µJ` und `278.9 µJ`/Zulassung), während der mittlere Versuch (`7.28% > 5.0%` Leerlauf-Drift durch konkurrierende Host-Jobs) seine L2-Netto-Subtraktion automatisch von Falsifier 6 annulliert wurde. Beachten Sie, dass der Platzhalter `CostTable` (`424-439 mJ`/Zulassung) die CPU-nur-Zulassung um etwa drei Größenordnungen überschätzt, weil sein `5,000,000 µJ` (`5 J`) `Proposer`-Eintrag einen neuronalen Proposer erwartet und nicht das deterministische Platzhalter-Modell des Beispiels (`measured_j = None`, `board_metered = false`).

<div id="8-stated-cost-on-receipts" class="anchor-alias" aria-hidden="true"></div>

## 8. Angegebene Kosten auf Quittungen

Die Standardtabelle in `CostTable` bei `aba99fce`, in Mikrojoule, bleibt ein angegebener Preis pro Zeile innerhalb der Repository-Quittungen:

| Zeile | Was sie hinzufügt | Angegebene µJ |
|---|---|---:|
| G0 | Wird zu Beginn jedes Versuchs berechnet. Wird erneut für jede wiederverwendete Konfliktsignatur berechnet. Eine memoisierte Ablehnung ist diese Zeile allein. | 1 |
| G1 | Wird berechnet, wenn der Versuch den Kommutationstest erreicht | 10 |
| G2 | Wird berechnet, wenn der Versuch die strukturelle Zusammenführung durchführt | 100 |
| Checker | Wird einmal pro Checker berechnet, auf jedem Pfad, der das Gate erreicht, einschließlich G1 | 1.000 |
| Proposer | Wird einmal pro Proposer-Aufruf berechnet | 5.000.000 |

G3 wird auf dem Pfad geschrieben und hat keine eigene Zeile. Der `est_uj`-Wert einer Quittung ist die Summe der Zeilen, die der Versuch hinzugefügt hat. Das Ersetzen dieser Tabelle durch hardware-rail-`measured_j` ist Meilenstein M6 und bleibt offen; Abschnitt 7.3 liefert die erste Betriebssystem-`reported_j`-Kalibrierung (`317-365 µJ` pro `100.000`-Einheiten-Zulassung mit einem deterministischen Platzhalter-Proposer).

<div id="9-the-git-projection" class="anchor-alias" aria-hidden="true"></div>

## 9. Die Git-Projektion

Die Projektion ist Meilenstein M2 und befindet sich in `rcevc-proj-git`. Eine Blatteinheit ist durch die Dateibytes gegeben. Eine Einheit mit Abhängigkeiten wird als Datei mit einem kurzen Kopfbereich geschrieben, den die Referenzimplementierung als Bijektion auf UTF-8-Dateien auffasst:

```
#rcevc-unit v1
#dep <slot>
#body
<body>
```

Für jede Abhängigkeit wird eine Zeile `#dep` geschrieben.

**Out.** `export` schreibt für jeden akzeptierten Eintrag einen Commit auf `main`. Der Autor ist das Schreiberkürzel. Das Subject ist die Änderungsnachricht, oder eine Zeile, die die Änderungskennung und die Gears benennt, falls die Nachricht leer ist. Jeder akzeptierte Commit enthält die Trailer `RCE-VC-Change`, `RCE-VC-Pre`, `RCE-VC-Post`, `RCE-VC-Path`, `RCE-VC-Evidence`, `RCE-VC-Resolved`, `RCE-VC-Est-uJ` und `RCE-VC-Entry`. `RCE-VC-Est-uJ` ist die angegebene Mikrojoule-Summe, keine Messung. Der Ref `refs/rcevc/log` hat einen Commit pro Log-Eintrag, Ablehnungen eingeschlossen, und ein Ablehnungskommit trägt außerdem `RCE-VC-Reason`. Bei identischem Log und identischer Zeitbasis erzeugt `export` dieselben Commit-Identifikatoren.

**In.** `ingest` durchläuft die Vorgänger-Commits von einem Tip, bis es einen Commit findet, dessen `RCE-VC-Post`-Trailer ein Snapshot ist. Dieser Snapshot ist die Basis. Der Tip-Baum wird zu einer einzigen Änderung (Einfügung und Löschung) gegenüber dieser Basis. Wenn das Inhalts-Multiset unverändert ist, ist die Ebene nur Namens-bezogen. Der Branch ist der Vorschlag. Die Leiter entscheidet. Der Schreiber wird nicht zum Rebase aufgefordert.

Das README protokolliert diese Prüfungen gegen Git 2.43, in `tests/git_interop.rs` (`12` Tests in `rcevc-proj-git` bei `aba99fce`):

| Prüfung | Im README aufgezeichnetes Ergebnis |
|---|---|
| `git fsck --full --strict` auf der exportierten Historie | clean |
| Jeder Commit auf `main` wird in seinem `RCE-VC-Post`-Trailer zum Root reimportiert | yes |
| Zwei Exporte desselben Logs in unterschiedlichen Verzeichnissen | identical commit identifiers |
| Der Trailer-Parser von Git liest die Belege | yes |
| Zwei einfache Git-Commits auf einem Branch, dessen Basis veraltet ist | ingested as one change, admitted at G1, `main` moves forward |
| Objekte, die Git selbst schrieb, inklusive dynamischer Huffman-Deflate | read |
| Ein einfacher Git-Commit, der ein verbotener Token enthält | refused, recorded on `refs/rcevc/log`, `main` unmoved |

Grenzen dieser Projektion, wie sie im README angegeben sind: nur lose Objekte und lose Refs; Dateimodus 100644 beim Export, sodass das Ausführungs-Bit noch kein eigenständiges Attribut ist; Symlinks, Submodule und Nicht-UTF-8-Dateien werden mit einer Begründung abgelehnt, statt geraten.

Das Projekt erwähnt den Namen Mergiraf, ein strukturiertes Merge, das tree-sitter verwendet, als Arbeit, die auf parse-geformte Dateien abzielt. Das ist eine Konvergenzbeobachtung. Diese Seite bewertet die Referenz nicht gegen dieses System und bewertet die Referenz nicht gegen irgendein anderes Versionskontrollsystem.

<div id="10-limits-of-this-version" class="anchor-alias" aria-hidden="true"></div>

## 10. Grenzen dieser Version

Bei Commit `aba99fce`:

1. `rcevc-keys` teilt Rust- (`.rs`) und Python-Dateien (`.py`) in Top-Level-Elemente auf (mit Abhängigkeiten, die nur auf frühere Elemente in derselben Datei verweisen), doch das Aufteilen von TypeScript sowie eine Rundreise-Evaluierung mit 50 Paketen / 1.000 Repositories sind noch nicht umgesetzt; andere Dateitypen verbleiben als ganzheitliche Blatt-Einheiten.
2. Die Git-Speicherung verwendet lose Objekte und lose Referenzen. Es gibt keine Pack-Dateien und keine gepackten Referenzen. Der Export schreibt ausschließlich den Modus 100644. Symlinks, Submodule und nicht-UTF-8-Dateien werden abgelehnt.
3. Jeder exportierte Commit baut den gesamten Baum neu auf.
4. Die Mengen der umgekehrten Abhängigkeiten werden beim Aktualisieren geklont. Eine Einheit mit vielen Abhängigen macht diese Aktualisierung groß.
5. Die Schlüsselberechnung ist rekursiv. Eine Abhängigkeitskette von mehr als etwa 10.000 Einheiten könnte den Stack überlaufen.
6. Eine Wurzel mit vollständigem Inhalt ist linear in der Anzahl der Einheiten. Die Aufnahme verwendet sie nur, um die Ebene mit namenbasierten Prüfungen zu erraten. Die namenbasierte Prüfung des Kernels durchläuft den Diff.
7. Snapshots werden im Speicher gehalten, ohne Aufbewahrungsrichtlinie und ohne separaten Speicher.
8. `submit` ist single-threaded (`CasRef` schützt Referenz-Tauschvorgänge, während `submit` kommutierende Änderungen sequentiell zulässt). Leases sind nicht implementiert.
9. Ein Checker wird vertraut, die Wahrheit über seinen Geltungsbereich mitzuteilen (Wasmtime-Sandboxing von M3 ist noch nicht umgesetzt).
10. On-Chip-`reported_j` (`317-365 µJ` pro `100,000`-Einheiten-Zulassung) wurde extern über den Kernel-`ri_energy_nj` aufgezeichnet, während die Receipt-Felder im Repository weiterhin die angegebene `est_uj`-Tabelle und die externe Hardware-Rail-`measured_j` (M6) führen (`measured_j = None`, `board_metered = false`).

<div id="11-next-work" class="anchor-alias" aria-hidden="true"></div>

## 11. Nächste Arbeitsschritte

- **Abschluss von M1 (Erweiterung von `rcevc-keys` und Korpus-Rundreise).** Die TypeScript-Grammatik wird neben Rust und Python ergänzt, und es werden itemübergreifende Abhängigkeiten zwischen Dateien unterstützt. Anschließend wird für mindestens 50 reale Crates und Pakete verifiziert, dass Rundreisen byteidentisch sind und dass unabhängige Änderungen an getrennten Funktionen einer Datei auf G1 kommutieren.
- **Abschluss von M2 (BLAKE3-interne Schlüssel und `gix`-Packfiles).** Die interne Hashfunktion wird auf BLAKE3 umgestellt, wobei die FIPS-180-4-SHA-256-Testvektoren als eigenständiger Test erhalten bleiben und die Domänen-Tags angehoben werden. Die Speicherung von Git-Objekten wird auf `gix` (`gitoxide`) für Packfiles und gepackte Referenzen umgestellt, gefolgt von einer Rundreise über 1.000 Repository-Historien.
- **M3 (`rcevc-gate` auf Wasmtime).** Prüfer werden als treibstofflimitierte, deterministische WebAssembly-Module mit festgelegten Digests ausgeführt, sodass der deklarierte Geltungsbereich durch Freigabe ausschließlich des deklarierten Ausschnitts durchgesetzt wird.
- **M4 (Leases und monotoner Kanal).** Nebenläufiges Streaming monotoner Änderungen ohne Koordination.
- **M5 (Wiedergabe von Konfliktkorpora).** Merge-Bench, CONGRA und AgenticFlict werden durch die Stufenleiter wiedergegeben, wobei die Auflösungen auf G0, G1, G2, G3 und G4 gezählt werden.
- **M6 (`rcevc-meter`).** `est_uj` wird durch kalibriertes `reported_j` und extern gemessenes `measured_j` aus Hardware-Rails ersetzt.

<div id="12-copyright-and-license" class="anchor-alias" aria-hidden="true"></div>

## 12. Urheberrecht und Lizenz

Urheberrecht 2026 Open Interface Engineering, Inc.

Die Referenzimplementierung in [openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc) bei Commit `aba99fcec4414a32bff30ab075668350d3fb80bf` (`13 November 2026`) steht unter der Apache Lizenz, Version 2.0. Die Lizenzdatei in diesem Verzeichnis gibt das Urheberrecht als Open Interface Engineering, Inc. an, und das Crate-Manifest setzt `license = "Apache-2.0"`. Diese Seite ist der Studientext für diese Referenz.
