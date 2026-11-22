---
title: "RCE-VC: Gesetz der Versionskontrolle"
deck: "RCE-VC (eine von der Sprache Reality Code Engine getrennte Versionskontroll-Referenz) lässt jede Änderung in einen einzigen kanonischen, namensfreien Repository-Zustand zu oder lehnt sie mit protokolliertem Grund ab und liest sowie schreibt gewöhnliche Git-Historie. Die Meilensteine M0, M1 und M2 sind bei Commit 8bf9c9af implementiert. Auf diesem Build ließ ein Kern eine Einreichung gegen 100,000 Einheiten in 188 Mikrosekunden zu. Belegkosten stammen aus einer angegebenen Tabelle; Joule wurden nicht gemessen."
lang: "de"
source: "rce-vc"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

RCE-VC ist ein Versionskontrollentwurf samt kleiner Rust-Referenz (`openIE-dev/rce-vc` bei Commit `8bf9c9af`). Viele Schreibende, Menschen oder Programme, reichen Änderungen gegen einen gemeinsamen Zustand ein: Eine benannte Prüfung lässt das Ergebnis zu oder die Änderung wird unter Aufzeichnung des Grundes abgelehnt, während Schreibende weiter Git nutzen können. Die Referenz ist nicht die Sprache Reality Code Engine, teilt aber denselben Rahmen: eine Form, einen totalen Schritt, ein hash-verkettetes Protokoll, namensfreie Schlüssel und eine Leiter von Gängen mit einem Modell an letzter Stelle.

**In einfachen Worten**

1. Beliebig viele Menschen und Programme können gleichzeitig schreiben. Eine Änderung gelangt in die gemeinsame Historie, wenn eine benannte Prüfung das Ergebnis akzeptiert; andernfalls bleibt sie draußen und der Grund wird festgehalten, unabhängig vom Urheber.
2. Änderungen, die nicht dieselben Abhängigkeiten berühren, müssen nicht aufeinander warten. Überschneiden sie sich, ordnet ein vorab festgelegter Preis die zulässigen Ergebnisse, und jedes einmal akzeptierte Ergebnis einschließlich gelöster Konflikte wird wiederverwendet; ein Modell wird erst gefragt, nachdem billigere Schritte scheitern.
3. Die Referenz liest und schreibt gewöhnliche Git-Historie. Auf dem gemessenen Build blieb die Zulassung einer Änderung von einigen hundert bis zu 100,000 Einheiten auf einem Kern unter zwei Zehntelmillisekunden (188 Mikrosekunden); die `est_uj`-Preise auf den Belegen entstammen einer angegebenen Tabelle, gemessen wurden null Joule.

*Vollständiger englischer Originaltext: [/papers/rce-vc/](/papers/rce-vc/).*
