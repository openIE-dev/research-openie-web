---
title: "RCE Compile: Ein Gesetz der Kompilierung, geprüft als Normalform an realen Compilern"
deck: "RCE Compile (ein Forschungsprojekt im Repository der Reality Code Engine) prüft, ob eine einzige Aussage darüber, was Kompilierung ist, unabhängig von der Reality Code Engine für jeden Compiler gilt. Gemessen an zwölf Compilerfamilien hält der Kandidat als Maßstab stand, an dem ein Compiler gemessen werden kann, nicht jedoch als Beschreibung dessen, was Compiler heute tun. Diese Studie nennt den siebenteiligen Standard, die Belege für und gegen jeden Teil, einen messbaren Ersatz für die Konvergenzfunktion, sieben Hypothesen mit Falsifikatoren und die drei bisherigen Experimente: Byte-Vergleiche auf drei Maschinen, Lösch- und Beschreibungslängenzählungen über 96 Builds ohne Energiezähler sowie einen namensfreien Hash ohne Falschtreffer auf 16 kleinen Kernen und 4 Programmen."
lang: "de"
source: "rce-compile"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

RCE Compile untersucht, ob ein einziges Gesetz der Kompilierung unabhängig von der Reality Code Engine (RCE) für beliebige Compiler gilt. Der Kandidat besagt, Kompilierung sei bedeutungsbewahrendes Absenken zwischen kanonischen Darstellungen, geordnet nach Kosten mit der Landauer-Grenze als Untergrenze und dem kürzesten äquivalenten Programm als Ziel, gesichert durch ein Verifikationstor und verstärkt durch Wiederverwendung. Gegenüber zwölf Produktions-Compilerfamilien scheitert er als Beschreibung: Kein untersuchter Compiler hasht eine namensfreie Darstellung, das Absenken ist weder total noch allgemein als bedeutungsbewahrend bewiesen, und kein Compiler verbucht Energie. Nach Neufassung dreier Klauseln trägt er als normative Normalform mit zwei Schranken, zwei berechenbaren Ersatzgrößen für die Konvergenzfunktion, sieben falsifizierbaren Hypothesen und drei ersten Experimenten.

**In einfachen Worten**

1. Gefragt wird, ob alle Compiler einer einzigen Regel folgen. Reale Compiler tun das nicht; daher wird die Regel als siebenteiliger Maßstab formuliert, an dem sich jeder Compiler messen lässt, wobei keiner Energie verfolgt oder jede Übersetzung beweist.
2. Die physikalischen und mathematischen Schranken der ursprünglichen Regel sind real, aber so nicht berechenbar; sie werden durch zwei zählbare Größen ersetzt, die sich mit einem Energiemessgerät vergleichen lassen.
3. Ein fehlender Baustein wurde gebaut und getestet: ein Fingerabdruck kompilierter Programme, der interne Namen ignoriert. Auf 16 kleinen Kernen und 4 Programmen erkannte er umbenannte Kopien häufiger als Byte- oder Quelltext-Schlüssel und ordnete niemals zwei verschieden rechnenden Kernen denselben Fingerabdruck zu.

*Vollständiger englischer Originaltext: [/papers/rce-compile/](/papers/rce-compile/).*
