---
title: "Ein Spiel einmal schreiben und überall ausführen: Wo exaktes Replay endet und Toleranz beginnt"
deck: "Kann ein Spiel einmal als geprüfte Zustandsmaschine geschrieben und in mehrere Engines, Befehlssätze und Grafik-Stacks projiziert werden? Ausgeführt über 25 Multi-ISA-Ziel-×-Host-Zellen für 100.000 Ticks unter Q32.32-Ganzzahl-Physik (GE-H1: 0 / 20.500 SHA-256-Fehlübereinstimmungen auf arm64 macOS, aarch64 Linux sowie AMD/Intel x86_64 Linux), 25.000 cross-ISA-Gleitkomma-Ticks (GE-H2: t_div = 10 Apple libm vs. GNU glibc sin/cos, t_div = 406 x86_64 FMA vs. arm64 fmadd ohne -ffast-math) und 4 physische GPUs über Metal und Vulkan (GE-H3: 1,3 %-9,3 % LSB-Pixel-Drift, Δ_max ≤ 2, PSNR 64,2-72,1 dB, SSIM ≥ 0,99983), gepaart mit einem spielbaren, joule-budgierten Q32.32-WebXR/Canvas-Prototyp."
lang: "de"
source: "game-engines"
complete: true
---

<div id="writing-a-game-once-and-running-it-everywhere-where-exact-replay-ends-and-tolerance-begins" class="anchor-alias" aria-hidden="true"></div>

*Revision af57f48, 22. November 2026. Interaktiver Explorer, GPU-übergreifender Inspektor und spielbare `Q32.32`-Chrono-Budget-Arena: [research.openie.dev/living/game-engines/](/living/game-engines/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Zusammenfassung

Diese Studie untersucht, ob ein Spiel einmal als geprüfte Zustandsmaschine geschrieben und anschließend über verschiedene Programmiersprachen, CPU-Instruktionssatzarchitekturen (ISAs) und GPU-Backends projiziert werden kann. Sowohl die untersuchten Spezifikationen als auch drei ausgeführte empirische Falsifizierer-Suiten liefern eine klare Grenze: **ja** für Spielregeln und Simulation unter festgelegter Festkomma-Ganzzahlarithmetik (`(GE-H1)`: `0 / 20,500` Secure Hash Algorithm 256-bit (`SHA-256`) Checkpoint-Abweichungen über `100,000` Ticks einer 16-Körper-2D-Arena, projiziert über `25` Ziel-×-Host-Zellen auf `arm64` `macOS 27.2.1`, `aarch64` `Linux 6.8` und Advanced Micro Devices (`AMD`) Zen 5 sowie Intel Raptor Lake `x86_64` `Linux 7.0`, wobei der Energieverbrauch von `0.073 J` bis `13.60 J` in macOS pro Prozess `reported_j` und von `1.89 J` bis `181.87 J` in Linux Running Average Power Limit (`RAPL`) Paket `reported_j` liegt); **nein**, wenn nicht fixierte Gleitkomma-Transzendenten oder Fused Multiply-Add (`FMA`)-Niedrigstufungen chaotische Mehrkörper-Kollisionen verursachen (`(GE-H2)`: selbst *ohne* `-ffast-math` divergieren Apple `libSystem` `libm` gegenüber Linux-System `glibc` `std::sin`/`std::cos` bereits beim Tick `10`, ISA-übergreifend divergiert `x86_64` `-mavx2 -mfma` gegenüber `arm64` `fmadd` beim Tick `406`, und V8 `Math.sin` divergiert zwischen den ISAs beim Tick `66`); und **nein** für bit-exakte Pixel über GPU-Hersteller hinweg, jedoch **ja** unter einem begrenzten einseitigen Toleranztor (`(GE-H3)`: über Apple `Metal`, `AMD` Mesa Radeon Vulkan (`RADV`), Nvidia Vulkan (`NVIDIA`) und Intel Mesa Vulkan (`ANV`) bei `512×512` `RGBA8Unorm`, `24 / 24` über-GPU-Frame-Paare unterscheiden sich im rohen `SHA-256` bei `1.30 %`-`9.34 %` der Pixel, während der maximale Kanal-Fehler $\Delta_{\max} \le 2 / 255$ bleibt, das Peak-Signal-to-Noise-Ratio (`PSNR`) zwischen `64.16`-`72.06 dB` liegt, und die strukturelle Ähnlichkeit (`SSIM`) zwischen `0.99983`-`0.99999` liegt, mit `measured_j = None` und `board_metered = false`.

**In einfachen Worten**

1. **Exakte Simulation über Chips und Sprachen hinweg gelingt, wenn die Arithmetik ganzzahlig festgelegt ist.** Über `100,000` Ticks (`20,500` verifizierte `SHA-256`-Checkpoints) reproduzieren native Rust, C++20 (`Clang` und die Compiler-Sammlung (`GCC`)), WebAssembly (`Wasm`), JavaScript `BigInt` und Python exakt denselben 732-Byte-Zustand bit-genau auf Apple Silicon (`arm64`), NVIDIA Jetson Thor (`aarch64`), AMD Zen 5 (`x86_64`) und Intel Raptor Lake (`x86_64`), ohne jede Abweichung.
2. **Gleitkomma-Physik driftet auch ohne `-ffast-math` zwischen Betriebssystemen und CPU-Familien.** Rein algebraische Operationen `+`, `-`, `*`, `/` und `sqrt` stimmen bei deaktiviertem `FMA` (`-ffp-contract=off`) über `x86_64` und `arm64` für alle `25,000` getesteten Ticks überein. Der Aufruf von `std::sin`/`std::cos` über die `libm` von macOS gegenüber `glibc` unter Linux kippt jedoch bereits bei Tick `10` (`0.17 s` bei `60 Hz`) ein Bit und lässt die Spielstände bis Tick `9,798` (`163.3 s`) auseinanderlaufen. Bei aktivierter Standard-FMA-Kontraktion (`-ffp-contract=fast`) divergieren `x86_64` und `arm64` bereits bei Tick `406`, und das Spiel desynchronisiert bei Tick `11,205`.
3. **Grafikkarten erzeugen keine identischen Bits, daher gehört das Rendering hinter ein einseitiges Toleranztor.** Über Apple `Metal`, AMD `RADV` Vulkan, NVIDIA Vulkan und Intel `ANV` Vulkan hinweg unterscheiden sich `1.3%` bis `9.3%` der Pixel um `1` bis `2` niederwertigste Bits (`LSB`). Dadurch scheitern naive `SHA-256`-Prüfungen des Framebuffers, während wahrnehmungsbasierte Toleranzkriterien (`PSNR > 64 dB`, `SSIM > 0.9998`) erfüllt werden, da kein GPU-Wert jemals in den Simulationszustand zurückfließt.

![Diagramm der vorgeschlagenen Aufteilung. Ein Kasten oben enthält das Spiel Form P gleich S, E, delta, D, lambda, mit typisierten Schnittstellenschemata und einem strikten Prüfer. Pfeile führen zu vier Projektionen: Simulation (Rust, WebAssembly, XState, SCXML, Python) und Skripting (Rhai, Lua, Luau) links in der exakten Zone, geprüft über einen Zustandshash pro Tick; Szene (BSN-ähnlich, glTF, OpenUSD) und Rendering (Slang, WGSL, WESL) rechts in der Toleranzzone, geprüft über den Fehler pro Pixel. Eine gestrichelte vertikale Linie markiert die Determinismusgrenze. Ein Band am unteren Rand listet Host-Effekte auf, die ausschließlich als protokollierte Ereignisse eingehen: Eingabe, Takt, Audio, Netzwerk, Asset-Ein- und -Ausgabe, GPU-Zeichenoperationen, kosmetische Physik.](/figures/game-engines/architecture.svg)

*Abbildung 1. Vorgeschlagene Aufteilung. Eine Form speist vier Projektionen. Simulation und Skripting liegen in der exakten Zone und werden über Zustandshashes pro Tick geprüft. Szene und Rendering liegen in der Toleranzzone und werden über den Fehler pro Pixel geprüft. Host-Effekte gehen ausschließlich als protokollierte Ereignisse ein.*

![Gitter mit elf bestehenden Repräsentationen als Zeilen (Slang, Naga, WGSL und WESL, glTF, OpenUSD, BSN, SCXML und XState, VGDL, GameRule, nAIVE, SpacetimeDB) und sieben Fähigkeitsspalten (Verhalten, Szene, Shader, Ausführungsreihenfolge, Mehrzieldarstellung, Replay-Protokoll, Cross-Layer-Prüfung). Grüne Zellen markieren dokumentierte Fähigkeiten, Bernstein teilweise, Grau fehlend oder undokumentiert. Die Spalte für die Cross-Layer-Prüfung ist grau, mit Ausnahme teilweiser Markierungen für Slang und nAIVE.](/figures/game-engines/coverage.svg)

*Abbildung 2. Abdeckung bestehender Repräsentationen, bewertet ausschließlich anhand der für diese Studie gelesenen Dokumente. Grün: dokumentierte Fähigkeit. Gelb: teilweise. Grau: nicht vorhanden oder nicht dokumentiert. Die rechteste Spalte, die schichtenübergreifende Prüfung, ist nahezu leer.*

<div id="1-terms-notation-and-the-idea-under-test" class="anchor-alias" aria-hidden="true"></div>

## 1. Begriffe, Notation und die zu testende Idee

<ul id="terms">
<li>RCE, IR, ECS, FSM, SDF: Reality Code Engine [gleiches Haus], Intermediate Representation, Entity Component System, Finite-State Machine und Signed Distance Field</li>
<li>CPU, GPU, ISA, ISAs, SIMD, AVX2, NEON, SFU, ROP, RPL: Central Processing Unit, Graphics Processing Unit, Instruction Set Architecture(s), Single Instruction Multiple Data, Advanced Vector Extensions 2, Arm Advanced SIMD, Special Function Unit, Raster Operations Pipeline und Intel Raptor Lake Mobile Architecture</li>
<li>IEEE, FMA, VFMADD, VFNMADD, FMADD, FMSUB, ULP, LSB, SHA, MAE, RMSE, PSNR, SSIM, SD, RGBA8: Institute of Electrical and Electronics Engineers (wie in IEEE 754 Gleitkomma), Fused Multiply-Add, x86_64 Vektor-Fused-Multiply-Add- und Negated-Multiply-Add-Opcodes, AArch64 skalare Fused-Multiply-Add- und Multiply-Subtract-Opcodes, Unit in the Last Place, Least Significant Bit, Secure Hash Algorithm (`SHA-256`), Mean Absolute Error, Root Mean Squared Error, Peak Signal-to-Noise Ratio, Structural Similarity Index, Standard Deviation und 8-Bit-pro-Kanal-Red-Green-Blue-Alpha-Framebuffer-Format</li>
<li>WGSL, WESL, SPIR-V, GLSL, HLSL, MSL, D3D11, D3D12, CUDA: WebGPU Shading Language, WebGPU Extended Shading Language, Standard Portable Intermediate Representation V, OpenGL Shading Language, High-Level Shading Language, Metal Shading Language, Direct3D 11, Direct3D 12 und Compute Unified Device Architecture</li>
<li>RADV, ANV, LLVM, GNU, GCC, PE, OS, API, APIs, WebXR, WebMCP, URL, JSON, YAML, README, MB, CS0246, RE, ENGINE, DFU: Mesa Radeon Vulkan Driver, Mesa Intel Vulkan Driver, Low Level Virtual Machine Compiler Infrastructure, GNU's Not Unix Projekt, GNU Compiler Collection, Windows Portable Executable, Operating System, Application Programming Interface(s), Web Extended Reality API, Web Model Context Protocol, Uniform Resource Locator, JavaScript Object Notation, YAML Ain't Markup Language, Repository-README-Dokumentationsdatei, Megabytes, C#-Compiler-Fehlende-Typ-Diagnose CS0246, Capcom RE ENGINE („Reach for the Moon“ / „RE neXt“ Engine-Branding) und Dagstuhl Follow-Ups DOI-Präfix</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG: State Chart XML, Game Description Language, Video Game Description Language, Bevy Scene Notation, Boldsea Semantic Language, Multi-Level Intermediate Representation, Atomic/Consistent/Isolated/Durable-Transaktionen, Good Game Peace Out Rollback Networking Library, Graphics Language Transmission Format (ISO/IEC 12113:2022), Open Universal Scene Description, Universal Scene Description, Local Area Network, Artificial Intelligence und Computational Intelligence and Games</li>
<li>SATB, RAPL, MSR, PID, RUSAGE, V6, AMD, NVIDIA, V100, GH200, CTC: Stufenweiser Sättigungs-Benchmark (Satiation Tiered Benchmark), Telemetriestufen (`L2` Zähler auf Sockel- bzw. Package-Ebene, `L3` Kernel-Zähler pro Prozess) [selbe Einrichtung], Running Average Power Limit, modellspezifisches Register, Prozessidentifikator, `proc_pid_rusage` (`RUSAGE_INFO_V6`), Advanced Micro Devices, NVIDIA Corporation, Volta-V100-GPU, Grace-Hopper-GH200-Superchip und geschlossene zeitartige Kurve</li>
</ul>

Um Vorwärtsreferenzen von oben nach unten transparent zu halten, definiert Abschnitt 1 die Form-Notation, Abschnitt 2 gibt einen Überblick über bestehende Spielrepräsentationen, Abschnitt 3 analysiert Gleitkomma-Divergenz, Abschnitt 4 tabelliert Zwischendarstellungen, Abschnitt 5 legt die vorgeschlagene Schichtaufteilung dar, Abschnitt 6 berichtet über die Multi-ISA- und Cross-GPU-Falsifikationsläufe, Abschnitt 7 listet Unzulässigkeits-Flaggen auf und Abschnitt 8 dokumentiert Quellen und Grenzen.

Die [Reality Code Engine (RCE)](https://research.openie.dev/about/rce/) betrachtet ein Programm als Zustandsmaschine, die Form genannt wird und geschrieben ist $P = (S, E, \delta, D, \lambda)$:

- $S$: die Menge der Zustände;
- $E$: die Menge der Ereignisse (Eingaben);
- $\delta : S \times E \to S$: die Übergangsfunktion;
- $D$: ein append-only-Log jedes ausgeführten Schrittes;
- $\lambda$: die Ausgabekarte von Zustand zu beobachtbarer Ausgabe.

Ein strikter Prüfer akzeptiert entweder eine Form oder benennt die Regel, die sie verletzt. Emitters projizieren dann die akzeptierte Form nach Rust, Python, JavaScript und Scala. XState (eine JavaScript- und TypeScript-Statechart-Bibliothek), SCXML (eine Empfehlung des World Wide Web Consortium) und WebAssembly (`Wasm`) gehören nicht zu den Zielen der Emitters; diese Studie behandelt sie als mögliche Projektionen. Da jeder Schritt in $D$ landet, kann jeder Lauf wiederholt werden.

Eine Spiel-Engine ist eine wesentlich größere Maschine. Sie führt eine Simulation mit festem Zeitschritt, eine Skripting-Schicht, eine Szenenbeschreibung und eine Rendering-Pipeline auf einer GPU aus. Abschnitte 1 bis 8 untersuchen, welche dieser Schichten innerhalb einer Form leben können, welche als Host-Effekte außen bleiben müssen und wo Genauigkeit zugunsten von Toleranz aufgegeben werden muss.

Die Idee hat eine lange Vorgeschichte. Die Stanford [Game Description Language (GDL) specification](http://ggp.stanford.edu/readings/gdl_spec.pdf) behandelt „finite, discrete, deterministic multi-player games of complete information“ und stellt fest, dass das natürliche zugrunde liegende Modell solcher Spiele „eine endliche Zustandsmaschine“ ist. Neu an einer Spiel-Engine ist nicht die Zustandsmaschine, sondern alles, was sie umgibt: Gleitkomma-Physik, Skripte, Szenen und GPUs.

<div id="2-what-the-landscape-shows" class="anchor-alias" aria-hidden="true"></div>

## 2. Was die Landschaft zeigt

<div id="21-game-logic-as-data-already-works-on-one-backend" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Spiel-Logik als Daten funktioniert bereits auf einem Backend

GameRule ([Multimedia Systems 32:564, 2026](https://doi.org/10.1007/s00530-026-02629-8)) drückt Verhalten als pro-Akteur-geltende *when-do*-Regeln über 14 Erzeuge-, Lese-, Aktualisiere- und Lösche-Aktionen sowie 6 Bedingungen aus. Ihr deterministischer Vertrag ist konkret: Ein zentraler Scheduler läuft aus einem einzigen FixedUpdate in Deklarationsreihenfolge, der letzte Schreibzugriff gewinnt, und Erzeugungen sowie Löschungen werden bis zum Ende der Traversierung aufgeschoben. Die Autoren begründen den Vertrag, indem sie das Unity-Handbuch zitieren, das angibt, die Ausführungsreihenfolge von Skripten sei „nicht über Builds, Maschinen oder Unity-Versionen hinweg garantiert“. Bei drei Unity-Beispielspielen (Haunted Jaunt, Survival Shooter, Tanks) schrumpfte der Verhaltenscode von 572 auf 107 Zeilen (−81,3 %).

Der Preis ist messbar. Die Regelinterpretation kostet etwa $c \approx 65\ \mu\text{s}$ pro Akteur pro Schritt. Bei einem Schrittbudget $T = 20$ ms beträgt die Akteur-Obergrenze

$$N_{\max} = \frac{T}{c} = \frac{20\ \text{ms}}{65\ \mu\text{s}} \approx 308,$$

was mit der Beobachtung des Papiers übereinstimmt, dass das Budget zwischen 200 und 350 Akteuren überschritten wird (23,872 ms bei 350). Es existiert nur ein Unity-Backend, weshalb Portabilität über Engines hinweg zwar argumentiert, aber nicht demonstriert wird.

<div id="22-order-of-execution-can-be-made-deterministic-by-construction" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Die Ausführungsreihenfolge kann konstruktionsbedingt deterministisch gemacht werden

Das ECS-Muster speichert den Spielzustand als Komponenten, die an Entitätskennungen angehängt sind, und führt Verhalten als Systeme über ihnen aus. Redmond, Castello, Calderón Trilla und Kuper geben ihm ein formales Modell, Core ECS ([arXiv:2508.15264](https://arxiv.org/abs/2508.15264)). Sie beweisen, dass ein Zeitplan, in dem jedes nebenläufige Paar von Mutationen kommutiert, deterministisch ist, und dass zwei Teilschedules, die disjunkte Mengen von Komponentenbezeichnungen schreiben, parallel ausgeführt werden können, ohne das Ergebnis zu ändern. Bei der Untersuchung von Bevy ECS, EnTT, Flecs, Specs und apecs stellen sie fest, dass keines das gleichzeitige Anhängen einer neuen Komponente zusammen mit einer anderen Mutation erlaubt; solche strukturellen Änderungen werden verzögert und seriell angewendet. Tasnim und Zhao ([SAC 2026, doi:10.1145/3748522.3779910](https://doi.org/10.1145/3748522.3779910)) fügen eine operationale Semantik und ein Typsystem für Archetype-ECS hinzu, das Lese- und Schreibmengen pro System verfolgt, und berichten über eine Tower-Defense-Simulation, bei der ein paralleles Archetype-Layout 109,54 Bilder pro Sekunde erreichte gegenüber 36,13 für eine objektorientierte Baseline. Die verzögerte Erzeugung und Löschung von GameRule ist dieselbe Disziplin, unabhängig davon erreicht.

<div id="23-compiling-is-not-the-same-as-being-right" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Kompilieren heißt nicht, richtig zu liegen

Der Mage-Benchmark ([arXiv:2605.07342](https://arxiv.org/abs/2605.07342)) führte 858 Generierungsversuche über 26 Unity-Mechanikmuster durch. Ohne IR bestanden 43 % der Ausgaben die Laufzeitprüfung, doch die Mechanismus-F1 (Übereinstimmung zwischen angeforderten und implementierten Mechaniken) lag nur bei etwa 0,12. Wurde auf eine IR konditioniert, sank die Laufzeitbestehensquote auf 14 % bis 21 %, die Mechanismus-F1 stieg jedoch auf 0,82 bis 1,00. Die Kompilierrate war negativ mit funktionaler Korrektheit korreliert: Der Fehler für fehlende Typen CS0246 trat unter IR-Konditionierung 469-mal auf, ohne sie hingegen nie. Eine IR, die nur das Verhalten beschreibt, und eine IR der vollständigen Szene waren statistisch nicht unterscheidbar (McNemar p = 1,0). Die Lehre für RCE lautet: Ein Prüfer, der lediglich belegt, dass es kompiliert, misst die falsche Größe. Schnittstellenprüfungen müssen daher verhaltensbasiert sein.

<div id="24-public-benchmarks-with-replayable-traces-exist" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Öffentliche Benchmarks mit wiederholbaren Traces existieren

GameCraft-Bench ([arXiv:2606.17861](https://arxiv.org/abs/2606.17861); [repository](https://github.com/FreedomIntelligence/gamecraft-bench)) bietet 140 zweidimensionale Godot 4-Aufgaben in 15 Familien. Einsendungen enthalten wiederholbare Eingabe-Traces. Der stärkste Agent im Papier erreichte 41.46 %, und das Repository meldet später 65.70 %. Es deckt weder Unity, Unreal, 3D, Mehrspieler- noch große Physik-Szenen ab. [Summer Engine](https://www.summerengine.com/templates) veröffentlicht 17 Open-Source-Spielevorlagen (Rallye, Plattformspiel, Turmverteidigung, Metroidvania, Überlebensspiele, Ego-Shooter, LAN-Mehrspieler, Voxel und weitere). Das General Video Game AI-Framework und sein VGDL ([arXiv:1802.10363](https://arxiv.org/abs/1802.10363)) stellt 120 Einzelspieler- und 60 Mehrspieler-Spiele bereit, die durch Sprite-, Interaktions-, Terminierungs- und Level-Mapping-Mengen definiert sind.

<div id="25-convergence-across-industry-and-research" class="anchor-alias" aria-hidden="true"></div>

### 2.5 Konvergenz in Industrie und Forschung

Mehrere Bestrebungen konvergieren auf dieselbe Gestalt: deklarative Szenen- und Pipeline-Dateien, eine sandboxed Skriptschicht, eine moderne Shadingsprache und ein Ereignisprotokoll.

- [nAIVE](https://github.com/poro/nAIVE) ist in Rust auf `wgpu` mit einem ECS (hecs) aufgebaut, verwendet YAML-Szenen, Materialien und Render-Pipelines, Lua 5.4 mit per-Entity-Sandboxing, Slang-Shader, die nach WGSL cross-kompiliert werden, Rapier-Physik, einen Event-Bus mit YAML-Schemavalidierung sowie einen Headless-Testläufer. Seine [Website](https://naive.dev/) zeigt eine 92-Zeilen-YAML-Datei, die eine fünfstufige Deferred-Pipeline deklariert. Sein README beschreibt außerdem eine GPU-Compute-Simulation, die über 50.000 Entitäten steuert; diese Entscheidung verortet die Simulation auf der Toleranzseite der im Folgenden gezogenen Grenze.
- Capcom beschreibt REX („RE neXt Engine“) als eine schrittweise Evolution von RE ENGINE unter Beteiligung von etwa 200 Ingenieuren ([Capcom IR](https://www.capcom.co.jp/ir/english/data/oar/2025/re-engine.html)). Presseberichte ([PC Gamer](https://www.pcgamer.com/gaming-industry/game-development/capcom-announces-plans-to-transform-its-re-engine-into-an-ai-generation-game-engine/)) sprechen von sechs Programmen, darunter Re:Dox, das unterschiedliche Datentypen in einen gemeinsamen Regelsatz übersetzt, und RE:Flows, das Spielmechanik-Ideen in eine standardisierte Programmiersprache überführt; außerdem wird berichtet, dass mehr als 2.000 Personen RE Engine nutzen.
- Der BSN-Vorschlag von Bevy ([Diskussion 14437](https://github.com/bevyengine/bevy/discussions/14437)) definiert Szenen als komposable Patch-, EntityPatch- und DynamicScene-Werte mit einem `bsn!`-Makro und einem Asset-Format, lässt die Behandlung von Ereignissen jedoch offen.
- [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) führt Spiellogik als Reducer aus, die als ACID-Transaktionen über Tabellen ablaufen, und spielt ein Commit-Log ab; dieses ist das RCE-Protokoll $D$ unter anderem Namen.
- Executable Ontologies ([doi:10.48550/arXiv.2601.07964](https://doi.org/10.48550/arXiv.2601.07964)) modellieren Spielverhalten in BSL über einen append-only, unveränderlichen Ereignisgraphen. Das Papier empfiehlt einen hybriden Ansatz, bei dem Physik, Rendering und Animation herkömmliche hochfrequente Verfahren beibehalten, während Quests und Entscheidungen auf dem Ereignisgraphen laufen und über aggregierte Ereignisse verbunden werden. Dies ist dieselbe Schichtaufteilung, die hier vorgeschlagen wird.

<div id="3-the-physics-of-divergence-why-exactness-is-binary" class="anchor-alias" aria-hidden="true"></div>

## 3. Die Physik der Divergenz: warum Exaktheit binär ist

Floating-Point-Addition ist nicht assoziativ. Auf Parallelhardware variiert die Reihenfolge einer Reduktion von Lauf zu Lauf. Eine Untersuchung der Nicht-assoziativität von Fließkommazahlen auf Parallelhardware ([arXiv:2408.05148](https://arxiv.org/abs/2408.05148)) definiert die skalare Variabilität

$$V_s = 1 - \left| \frac{f_{nd}}{f_d} \right|,$$

wobei $f_d$ eine deterministische Reduktion und $f_{nd}$ eine nondeterministische ist. Das Permutieren einer Summe von $10^6$ normalverteilten double-precision Werten veränderte das Ergebnis um bis zu etwa $4.26 \times 10^{-13}$, und das maximale $|V_s|$ wuchs wie $\sqrt{n}$. Eine deterministische Baum-Reduktion kostete etwa 0.2% relativ zu atomarer Akkumulation auf einer NVIDIA V100 und bis zu 7.8% auf einer GH200. In 1 000 Graph-Network-Training-Durchläufen erzeugte jeder Lauf unterschiedliche Gewichte.

Ein Spiel wandelt solche winzigen Unterschiede in sichtbare um. Rigid-Body-Kontakt und Many-Body-Dynamik sind typischerweise chaotisch. Unter einem lokalen Lyapunov-Exponent $\Lambda$ wächst eine Störung wie

$$\delta(t) = \delta_0 \, e^{\Lambda t},$$

so dass die Zeit bis sie eine spiel-sichtbare Größe $\Delta$ erreicht

$$t^{*} = \frac{1}{\Lambda} \ln\frac{\Delta}{\delta_0}.$$

*Illustratives Modell:* nehme $\delta_0 \approx 6 \times 10^{-8}$ (ein ULP von Single Precision, relativ), $\Delta = 1$ (ein Objekt auf der anderen Seite einer Wand) und einen angenommenen $\Lambda = 2\ \text{s}^{-1}$. Dann ist $t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ s. Der Logarithmus ist der entscheidende Faktor: Das Verringern von $\delta_0$ um den Faktor eine Million verschafft nur etwa 6.9 s mehr. Approximate agreement therefore cannot rescue simulation. Either the state is bitwise identical or it eventually diverges, a prediction tested directly across 25 000 multi-ISA collision ticks below (`GE-H2`).

Praxis bestätigt das. [Gaffer On Games](https://gafferongames.com/post/floating_point_determinism/) stellt fest, dass maschinenübergreifende Determinismus denselben Compiler und dieselbe Instruktionssatz erfordert, dass Battlezone 2 Unterschiede zwischen AMD- und Intel-Transzendentalfunktionen erlebte und dass MotoGP-Replays nicht zwischen Xbox und Personal-Computern ausgetauscht werden konnten. Es zitiert Marksteins Rat, FMA-Kontraktion und Reassoziation zu verbieten. Der [Rapier-Leitfaden](https://rapier.rs/docs/user_guides/rust/determinism/) zeigt einen funktionierenden Weg: Plattformübergreifender Determinismus gilt nur mit dem Feature `enhanced-determinism` (inkompatibel zu `simd8`), auf IEEE 754-2008-Zielen (Wasm qualifiziert sich) und mittels Software-Transzendentalen.

Für die Rendering-Phase besagt die [WGSL-Spezifikation](https://www.w3.org/TR/WGSL/), „WGSL erlaubt manchmal mehrere mögliche Verhaltensweisen für ein gegebenes Merkmal. Dies ist ein Portabilitätsrisiko.“ Der Abschnitt über Fließkomma geht weiter: „WGSL spezifiziert keinen Rundungsmodus“; „Eine Implementierung darf Operationen neu assoziieren“; sie „kann Operationen zusammenführen, wenn der transformierte Ausdruck mindestens so exakt ist wie der ursprüngliche“; subnormale Eingaben und Ausgaben vieler Operationen „können zu Null geflutet werden“; und das eingebaute `fma` „kann zu einer gewöhnlichen Multiplikation … und einer Addition ausgedehnt werden“. Pixel werden damit bewusst unterschiedlich zwischen Implementierungen definiert. Die [SPIR-V-Spezifikation](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) bietet ein engeres Mittel: ihre NoContraction-Dekoration kennzeichnet eine arithmetische Anweisung, die „nicht mit einer anderen Anweisung zu einer einzigen Operation kombiniert werden kann“, und solche Anweisungen „dürfen nicht neu assoziiert werden“. Dies ist ein pro-Instruktions-Schutz für ein Backend, jedoch keine portable Garantie für einen gesamten Shader.

<div id="4-the-ir-table" class="anchor-alias" aria-hidden="true"></div>

## 4. Die IR-Tabelle

| Repräsentation | Schicht | Stärkste dokumentierte Eigenschaft | Fehlende Aspekte für ein Form |
|---|---|---|---|
| [Slang](https://shader-slang.org/) | Shader | Modul-IR; Back-Ends für D3D12, Vulkan, Metal, D3D11, OpenGL, CUDA, WebGPU, CPU; Fähigkeitsystem | Kein Spielzustand, keine Ereignisse, keine Garantie für exakte Semantik bei Fließkommazahlen |
| [Naga](https://github.com/gfx-rs/wgpu/tree/trunk/naga) | Shader | Validierter IR; WGSL, SPIR-V und GLSL Eingabe; SPIR-V, WGSL, MSL, HLSL und GLSL Ausgabe | Dasselbe; keine Verknüpfung zu einem Szenenschema |
| [WGSL](https://www.w3.org/TR/WGSL/) / [WESL](https://wesl-lang.dev/) | Shader | Uniformitätsanalyse; WESL fügt Importe, bedingte Kompilierung, Pakete, `wgsl-test` hinzu | Erlaubt Neuassoziierung, Fusion und Flush-to-Zero; keine hostseitigen Typen |
| [SPIR-V](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) | Shader-Binär-IR | `NoContraction`-Dekoration verbietet Fusion und Neuassoziierung pro Anweisung | Nur pro Anweisung; keine Spielsemantik |
| [MLIR](https://mlir.llvm.org/) | Compiler-Infrastruktur | Mehrstufige Dialekte für das Herabstufen | Kein Spielmodell; Semantik bleibt jedem Dialekt überlassen |
| [glTF 2.0](https://www.khronos.org/gltf/) (ISO/IEC 12113:2022) | Assets und Szene | Austauschsstandard über Werkzeuge hinweg | Kein Verhalten, keine Ausführungsreihenfolge |
| [OpenUSD](https://openusd.org/release/intro.html) | Szene | Kompositionsbögen, Namensraumpfade | Selbstbeschreibung "Not a rigging system"; keine Simulationssemantik |
| [BSN](https://github.com/bevyengine/bevy/discussions/14437) | Szene | Typisierte Patches über Komponenten, versionierte Importe | Ereignis-Handler ungelöst; nur Bevy |
| [SCXML](https://www.w3.org/TR/scxml/) / [XState](https://stately.ai/docs/xstate) | Verhalten | Micro- und Makroschritt-Semantik, dokumentenreihenfolge-Priorität, serielle parallele Regionen | Datenmodell ist plattformspezifisch; keine numerische Disziplin, keine Szene oder Shader |
| [GDL](http://ggp.stanford.edu/readings/gdl_spec.pdf) | Regeln | Logische Beschreibung endlicher, diskreter, deterministischer Spiele | Keine kontinuierliche Physik, kein Rendering |
| [VGDL](https://arxiv.org/abs/1802.10363) | Regeln | Kompakte 2D-Gitterspiele, großer öffentlicher Korpus | Nur 2D-Gitter; kein Rendering oder physikalische Treue |
| [Core ECS](https://arxiv.org/abs/2508.15264) | Ausführungsreihenfolge | Theorem, das eine Bedingung für deterministische parallele Abläufe liefert | Ein formales Modell, kein Engine-Format; keine Szene oder Shader |
| [GameRule](https://doi.org/10.1007/s00530-026-02629-8) | Regeln | Deterministischer Scheduler-Vertrag, gemessene Codeeinsparungen | Nur Unity; etwa 65 µs pro Akteur; kein formaler Prüfer |
| [nAIVE](https://github.com/poro/nAIVE) | Gesamte Engine | YAML-Szenen und -Pipelines, Lua, Slang, Ereignisschema-Validierung | Keine veröffentlichten formalen Semantiken oder Querschnitt-Typprüfungen |
| [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) | Server-Logik | Reducer als Transaktionen, Commit-Log-Wiedergabe | Nur serverseitig; kein Client-Rendering oder Szene |

<div id="5-proposed-architecture" class="anchor-alias" aria-hidden="true"></div>

## 5. Vorgeschlagene Architektur

<div id="51-layer-split" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Schichtaufteilung

1. **Simulationsform (exakt).** $S$ enthält Festkomma- oder strikte IEEE-754-Werte, mit deaktiviertem FMA und Reassoziation sowie transzendenten Funktionen, die in ganzzahligen oder festgepinnten Software-Routinen implementiert sind. $E$ enthält Takt-Ereignisse und protokollierte Eingaben. $\delta$ verwendet SCXML-Makroschritt-Semantik: pro Takt werden Ereignisse in Warteschlangenreihenfolge verarbeitet, Konflikte nach Dokumentenreihenfolge aufgelöst und parallele Regionen seriell ausgeführt. Sammlungen iterieren in einer deklarierten Reihenfolge und folgen dem Vertrag von GameRule (Deklarationsreihenfolge, letzter Schreibzugriff gewinnt, strukturelle Änderungen werden bis zum Ende des Takts zurückgestellt). Wo Parallelität gewünscht ist, lässt der Prüfer nur Zeitpläne zu, die die Core-ECS-Disjunktheitsbedingung erfüllen.
2. **Skriptprojektion (exakt).** Designer-Skripte werden zu Wächtern und Aktionen über $S$ kompiliert und als [Rhai](https://rhai.rs/book/about/features.html) (sandboxed, mit „Don't Panic“-Garantie, no-std- und Wasm-Unterstützung), Lua oder [Luau](https://luau.org/) (standardmäßig sandboxed, mit graduellen Typen) emittiert. Skripte dürfen $\delta$ nur über deklarierte Aktionen aufrufen. Sie können Uhren, Zufallsquellen oder GPU-Ergebnisse nicht direkt lesen.
3. **Szenenprojektion (Toleranz stromabwärts).** $\lambda$ bildet $S$ auf einen BSN-ähnlichen Patch-Baum ab, dessen Komponentenschema Teil der Form ist. glTF und OpenUSD dienen als Exportziele für Assets.
4. **Renderprojektion (Toleranz).** Materialien und Durchläufe werden in Slang oder WGSL verfasst und über Slang oder Naga zu Metal- und Vulkan-Backends emittiert. Das Rendering ist eine reine Funktion von $\lambda(s)$. Kein GPU-Ergebnis fließt jemals zurück in $S$.

<div id="52-inside-the-form-versus-host-effects" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Innerhalb des Formulars versus Host-Effekte

Innerhalb: Zustand, Übergänge, Regelreihenfolge, Fixed-Point-Physik für spielrelevante Körper, der Zufallsgenerator mit seinem Seed in $S$, Schnittstellenschemata. Außerhalb, als protokollierte Ereignisse: Geräteeingaben, Echtzeit-Uhrenzeit, Netzwerkpakete, Audioausgabe, Asset-Ein- und -ausgabe, GPU-Zeichnungen und jegliche Drittanbieter-Physik, die für kosmetische Effekte verwendet wird. Replay speist $D$ zurück durch $\delta$, anstatt Geräte zu berühren. Der Speicheraufwand ist gering. Bei einer Tick-Rate von $f_{\text{tick}} = 60$ Hz und $b = 16$ Bytes Eingabe pro Tick wächst das Log mit $f_{\text{tick}} \cdot b = 960$ B/s, etwa 3.5 MB pro Stunde.

<div id="53-determinism-boundary" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Determinismusgrenze

- **Kriterium der exakten Zone:** Für die Ziele A und B und jeden Tick $t$ gilt $H(s_t^A) = H(s_t^B)$, wobei $H$ eine kryptographische Hashfunktion über eine kanonische Serialisierung von $S$ ist.
- **Kriterium der Toleranzzone:** Für gerenderte Bilder $I^A$ und $I^B$ desselben $s_t$ darf der Anteil der Pixel, deren Fehler pro Kanal $\varepsilon$ überschreitet, $p_{\max}$ nicht übersteigen. Ergänzend gelten beschränkte Untergrenzen für die strukturelle Ähnlichkeit (`SSIM`) und das Spitzen-Signal-Rausch-Verhältnis (`PSNR`). Abschnitt 6.3 führt diese Kalibrierung auf vier GPU-Architekturen aus (`Metal`, `RADV` Vulkan, `NVIDIA` Vulkan und `ANV` Vulkan).
- Rollback-Netzwerkverfahren im Stil von [GGPO](https://github.com/pond3r/ggpo), die auf Eingabeprädiktion und spekulativer Ausführung beruhen, sind nur auf der exakten Seite dieser Grenze gültig.

<div id="54-cross-layer-interface-checking" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Schnittstellenprüfung über Schichten hinweg

Der Prüfer validiert vier typisierte Kanten vor jeder Emission: (a) Skript zu Simulation: Jede Aktion benennt einen deklarierten Übergang mit übereinstimmenden Argumenttypen; (b) Simulation zu Szene: Die Ausgabe von $\lambda$ entspricht dem Komponentenschema; (c) Szene zu Rendering: Jede Materialbindung entspricht einer Slang- oder WGSL-Ressource mit kompatiblem Typ, Gruppe und Bindungsindex; (d) Ereignisabdeckung: Jedes Ereignis, auf das ein Skript lauscht, wird von mindestens einem Übergang oder einer Host-Quelle erzeugt. Mages Befund (Abschnitt 2.3) ist der Grund, weshalb Kantenprüfungen anhand von Verhaltensspuren beurteilt werden und nicht anhand des Erfolgs der Kompilierung.

<div id="6-falsifier-first-test-plan-and-executed-multi-isa--cross-gpu-results" class="anchor-alias" aria-hidden="true"></div>

## 6. Falsifier-first-Testplan und ausgeführte Multi-ISA- / Cross-GPU-Ergebnisse

Jede Hypothese wird mit ihrem Ausschlusskriterium aufgeführt. Wird das Kriterium erfüllt, wird die Behauptung zurückgezogen. Die Unterabschnitte 6.1 bis 6.4 berichten über die drei durchgeführten empirischen Falsifizierer-Suiten (`GE-H1` Multi-ISA `Q32.32` Replay über 25 Ziel-×-Host-Zellen, `GE-H2` Cross-ISA-Gleitkomma-Drift über `x86_64` und `arm64`/`aarch64`, und `GE-H3` Cross-GPU headless `wgpu` Rendering-Toleranz über Apple `Metal` sowie AMD, NVIDIA und Intel `Vulkan`), plus einem interaktiven, joule-budgetierten `Q32.32`-Prototyp (`GE-H4` bis `GE-H9` bleiben offen`).

| ID | Hypothese | Testkorpus | Maß | Abbruchkriterium | Status |
|---|---|---|---|---|---|
| GE-H1 | Simulationsprojektionen sind bitweise identisch über Sprachen, Betriebssysteme und CPU-ISAs hinweg | 16-Körper-2D-Arena-Form (`Q32.32`-Festkomma, `732`-Byte-Zustand) über `arm64` macOS, `aarch64` Linux sowie AMD/Intel `x86_64` Linux | $H(s_t)$ über Rust, Wasm32, C++20 (`Clang`/`GCC`), Node.js `BigInt`, Python 3 für $10^5$ Ticks (`25` Zellen) | Jegliche Hash-Abweichung an einem Prüfpunkt in einer `(Host, Ziel)`-Zelle | **Ausgeführt (`0 / 20.500` Abweichungen, Abschnitt 6.1)** |
| GE-H2 | Strenger Modus gegenüber Cross-ISA-Gleitkomma-Grenzen und Bibliotheks-/FMA-Drift | 16-Körper-2D-chaotische Arena (`25.000` Ticks über `arm64` macOS, `aarch64` Linux sowie AMD/Intel `x86_64` Linux) | Exakte Divergenz-Ticks `t_div` über strenges `f64`, Cross-OS-`libm` `sin/cos`, Cross-ISA-`FMA`, V8 `Math.sin` und `f32` | Unerwartete Abweichung unter festgelegter algebraischer Arithmetik oder unvorhergesehene stille Drift | **Ausgeführt über `arm64`, `aarch64` und `x86_64` (Abschnitt 6.2)** |
| GE-H3 | Cross-GPU-Rendering bleibt innerhalb gebundener Toleranz (`wgpu` / WGSL) | 4 kanonische `Q32.32`-Zustände (`t = 0, 250, 1k, 10k`) gerendert bei `512×512` `RGBA8Unorm` auf 4 physischen GPUs (`Metal`, `RADV`, `NVIDIA`, `ANV`) + `llvmpipe` + `CPU Q16.16` | Framebuffer-`SHA-256`, abweichende Pixel-`%`, $\Delta_{\max}$, MAE, RMSE, `PSNR` und `SSIM` | Jegliches physisches GPU-Paar, das `PSNR > 40 dB`, `SSIM > 0.999` oder $p(\Delta > 8) \le 0.001$ nicht erfüllt | **Ausgeführt (`24/24` Pass-Gate: `PSNR 64,2-72,1 dB`, `SSIM ≥ 0.99983`, Abschnitt 6.3)** |
| GE-H4 | Form-kodierte Regeln reduzieren Code wie GameRule | Haunted Jaunt, Survival Shooter, Tanks-Verhalten | Zeilen Verhaltenscode | Reduktion unter 50 % (GameRule erreichte 81,3 %) | Offen |
| GE-H5 | Form-Laufzeit überschreitet die GameRule-Obergrenze | Synthetische Akteur-Skalierung | Schrittdauer gegen $N$ | Schrittdauer über 20 ms unter $N = 350$ | Offen |
| GE-H6 | Schnittstellenprüfungen fangen reale Defekte ab | 26 Muster des Magiers; injizierte Bindungs- und Schemafehler | Erkennungsrate; Mechanismus-F1 | Erkennung unter 90 % der injizierten Fehler oder F1 nicht besser als das no-IR-Ergebnis 0,12 | Offen |
| GE-H7 | Vollständige $\ln(\Delta/\delta_0)$-Steigungsabtastung an Summer-Engine-Vorlagen | Physiklastige Summer-Engine-Vorlagen, als Forms neu ausgedrückt | Divergenzzeit gegen injiziertes $\delta_0$ | Steigung von $t^{*}$ gegen $\ln(1/\delta_0)$ nicht von null unterscheidbar | Offen |
| GE-H8 | Replay ist vollständig | Ein-Stunden-aufgezeichnete Sitzungen | End-Hash allein aus $D$ reproduziert | Jegliches Replay, das Zustand benötigt, der nicht in $D$ enthalten ist | Offen |
| GE-H9 | Benchmark-Parität | GameCraft-Bench 140 Aufgaben über einen Form-to-Godot-Emitter | Bestehensrate gegenüber nativen Godot-Einreichungen | Niedrigere Bestehensrate bei verhaltensidentischen Eingaben | Offen |

![Zweifeldige empirische Zusammenfassung an der Determinismusgrenze. Das linke Feld zeigt die Exakte Zone GE-H1 (0 Abweichungen über 20.500 SHA-256-Checkpoints in 25 Konfigurationen auf arm64 macOS, aarch64 Linux sowie AMD/Intel x86_64 Linux) und die GE-H2-Divergenzmarken über ISA-Grenzen hinweg für f64 (t_div = 10 für Apple libm gegenüber GNU glibc sin/cos, t_div = 406 für x86_64 VFMADD gegenüber arm64 FMADD ohne -ffast-math). Das rechte Feld zeigt die minimalen PSNR-Balken der Toleranzzone GE-H3 über alle 6 physischen GPU-Paare (Apple Metal, AMD RADV Vulkan, Intel ANV Vulkan, NVIDIA Vulkan), die zwischen 64,2 und 72,1 dB liegen und damit deutlich über dem Schwellenwert von 40 dB, bei 1,3 % bis 9,3 % Pixelabweichungen von 1 bis 2 LSB.](/figures/game-engines/cross-gpu-tolerance.svg)

*Abbildung 3. Empirische Grenze über `GE-H1`, `GE-H2` und `GE-H3`. Der vorgelagerte `Q32.32`-Simulationszustand (`S`) erreicht `0 / 20,500` `SHA-256`-Checkpoint-Abweichungen über fünf Rechner und drei ISAs, während nicht fixierte `f64`-`sin/cos`- und `FMA`-Operationen über OS- und ISA-Grenzen hinweg innerhalb von `10` bis `406` Ticks divergieren. Stromabwärts von $\lambda(s_t)$ erzeugen alle vier GPU-Architekturen unterschiedliche `RGBA8Unorm`-`SHA-256`-Digests (`1.3%`-`9.3%` Pixelabweichungen von `1-2` LSB), während sie strikt oberhalb von `64.1 dB` `PSNR` und `0.99983` `SSIM` bleiben (`measured_j = None`, `board_metered = false`).*

<div id="61-ge-h1-multi-isa-and-multi-os-100000-tick-determinism-q3232-integer-physics" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `GE-H1`: Multi-ISA und Multi-OS 100.000-Tick-Determinismus (`Q32.32` Integer-Physik)

*Vorangemeldet unter `PREREG_wave3_multi_isa_wgpu.json` (`SHA-256: 1721e5bdffaf...`). Telemetry trennt strikt die `SATB`-Ebenen `L2` und `L3` `reported_j` (`L2`: Linux `/sys/class/powercap/intel-rapl:0/energy_uj` Socket/Package- und Kern-Zähler; `L3`: macOS per-PID `proc_pid_rusage(child_pid, RUSAGE_INFO_V6).ri_energy_nj`; `measured_j = None`, `board_metered = false`). Interaktiver Explorer und rohes JSON: [`/living/game-engines/`](/living/game-engines/) ([`results.json`](/living/game-engines/results.json)).*

Eine 16-Körper-+-4-Pickup-2D-Elastikkollisions- und Cooldown-FSM-Arena-Form (`Q32.32` signierte 64-Bit-Festkomma-Koordinaten im Intervall `[-64, +64]`, `128`-Bit-Zwischenergebnisse, ganzzahlige Boden-Quadratwurzel `isqrt_u128`, verzögertes strukturelles Pickup-Respawn, `732`-Byte-little-endian-kanonischer Zustandsvektor) wurde für `100,000` Ticks auf **fünf Maschinen, drei ISAs (`arm64`/`AArch64`, `x86_64`, `wasm32`), zwei Betriebssystemen (`macOS 27.2.1`, `Ubuntu Linux 6.8 / 7.0`) und sechs Sprach-/Compiler-Projektionen (`25` Ziel-×-Host-Zellen)** ausgeführt:

| Host (`ISA` · `OS`) | Zielprojektion | Wand-ms / `100k` (Mittelwert ± SD) | `ns / Tick` | Telemetriekanal (`reported_j`) | `reported_j` / `100k` (J) | Verifizierte `SHA-256`-Prüfpunkte |
|---|---|---:|---:|---|---:|:---:|
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_native` (`rustc 1.100 -O`) | `22.333 ± 5.043` | `223.3` | `L3` pro-PID `ri_energy_nj` | **`0.1028 ± 0.0247`** | `100 / 100` (`stride 1.000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `cpp20_clang_o3` (`Apple Clang 21`) | `21.022 ± 1.657` | `210.2` | `L3` pro-PID `ri_energy_nj` | **`0.1090 ± 0.0134`** | `100 / 100` (`stride 1.000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_wasm32_node` (`Node v26.13`) | `84.300 ± 11.334` | `843.0` | `L3` pro-PID `ri_energy_nj` | **`0.4480 ± 0.0881`** | `100 / 100` (`stride 1.000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `javascript_bigint_node` (`ES2024`) | `717.955 ± 36.304` | `7.179,6` | `L3` pro-PID `ri_energy_nj` | **`4.4021 ± 0.4048`** | `100 / 100` (`stride 1.000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `python_3_13` (`CPython 3.13.14`) | `2.945,816 ± 284.033` | `29.458,2` | `L3` pro-PID `ri_energy_nj` | **`13.5999 ± 1.9086`** | `100 / 100` (`stride 1.000`) |
| **Apple M3 Ultra** (`arm64` · `macOS 27.2.1`) | `rust_native` / `cpp20_clang_o3` | `32.711` / `33.727` | `327.1` / `337.3` | `L3` pro-PID `ri_energy_nj` | **`0.0729` / `0.0755`** | `2 × 1.000 / 1.000` (`stride 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `21.793` / `23.061` / `26.677` | `217.9` - `266.8` | `L2` AMD RAPL pkg (Kern `0.13`-`0.21 J`) | **`1.958` / `2.349` / `2.932`** | `3 × 1.000 / 1.000` (`stride 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `145.29` / `1.347,80` / `2.546,42` | `1.452,9` - `25.464,2` | `L2` AMD RAPL pkg (Kern `1.01`-`12.23 J`) | **`14.44` / `115.81` / `181.87`** | `3 × 1.000 / 1.000` (`stride 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `39.718` / `36.868` / `58.792` | `368.7` - `587.9` | `L2` Intel RAPL pkg (Kern `1.64`-`2.68 J`) | **`2.062` / `1.888` / `3.026`** | `3 × 1.000 / 1.000` (`stride 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `158.35` / `1.390,46` / `3.375,07` | `1.583,5` - `33.750,7` | `L2` Intel RAPL pkg (Kern `5.65`-`124.90 J`) | **`6.89` / `60.79` / `149.48`** | `3 × 1.000 / 1.000` (`stride 100`) |
| **NVIDIA Jetson Thor** (`Armv9-A` `aarch64` · `Linux 6.8`) | `rust_native` / `clang` / `gcc` / `wasm32` / `js` / `py3.12` | `39.28` (`GCC`) - `4.407,89` (`Py`) | `392.8` - `44.078,9` | Nur-CPU (`reported_j = null`, GPU unberührt) | `null` | `6 × 1.000 / 1.000` (`stride 100`) |

- **Urteil**: **`PASS_ZERO_MISMATCHES` (`0 / 20.500` verifizierte `SHA-256`-Checkpoints; `0 / 190.000` paarweise Vergleiche mit Schrittweite `100` über die `20` vollständigen Trace-Zellen aus Welle 3)**. Jedes Ziel auf jedem Host erzeugte `2683c3f7cb8b...` bei Tick `100`, `21fa688e4ee8...` bei Tick `1.000`, `ea01ba793841...` bei Tick `50.000` und `82e404df6475d64d...` bei Tick `100.000`.
- **Umfang der Telemetrie und Abdeckung der Betriebssysteme**: Beachten Sie, dass `L2`- und `L3`-`reported_j` niemals miteinander verwechselt werden dürfen. Die `ri_energy_nj`-Angabe von Apple `L3` ordnet die CPU-Kernenergie strikt dem benchmarkten Kindprozess (PID) zu (`0,073`-`0,109 J` für native Rust- und C++-Programme), während `/sys/class/powercap/intel-rapl:0` (`L2`) unter Linux die sockelweite Paketleistung über alle Hintergrunddämonen hinweg integriert (`1,89`-`2,06 J` Paket gegenüber `0,13`-`1,83 J` in der Subdomäne `core`). Die Cross-Kompilierung über `x86_64-w64-mingw32-g++` bzw. `wine64` wurde geprüft, war auf den gemeinsam genutzten Linux-Runnern jedoch nicht vorhanden, und der physische Windows-Host `x86_64` war während des Laufs ausgeschaltet. Die Ausführung von Windows-PE-Dateien auf Bare-Metal bleibt daher unverifiziert, although das betriebssystemunabhängige `wasm32-unknown-unknown` auf macOS und Linux sowohl auf `arm64` als auch auf `x86_64` identische Ergebnisse lieferte.

<div id="62-ge-h2-cross-isa-and-cross-os-25000-tick-floating-point-drift-ieee-754-f64" class="anchor-alias" aria-hidden="true"></div>

### 6.2 `GE-H2`: Cross-ISA- und Cross-OS-25.000-Tick-Gleitkommadrift (`IEEE 754` `f64`)

Um zu prüfen, ob `IEEE 754` `binary64` (`f64`) Simulationen über `x86_64` und `arm64`/`aarch64` hinweg synchron bleiben, wenn `-ffast-math` *verboten* ist, wurde die identische 16-Körper-chaotische Arena für `25,000` Ticks (`~6.94` Minuten bei `60 Hz`) gesteppt, wobei in jedem Tick die kanonischen `IEEE 754`-Bits (`t_div_ieee_bits`), quantisierte `10^-3`-Arena-Einheiten-Positionen (`t_div_macro_1e3`) und der diskrete Spielzustand (`t_div_gameplay`) gehasht wurden:

| Host / Ziel A | Host / Ziel B | Störungsmechanismus | `t_div_ieee_bits` | `t_div_macro_1e3` | `t_div_gameplay` |
|---|---|---|---:|---:|---:|
| `arm64` macOS `Clang 21` (`f64_strict`) | AMD Zen 5 & Intel RPL `x86_64` Linux `Clang 21` / `GCC 15.2` | Cross-ISA- und Cross-OS-`f64`-algebraisch + `sqrt`, `FMA` aus (`-ffp-contract=off`, keine trig) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| `x86_64` Linux `glibc 2.43` (`f64_trig`) | `aarch64` Linux `glibc 2.39` (`f64_trig`) | Cross-ISA Linux GNU `glibc` `std::sin/cos` (`-ffp-contract=off`, kein `-ffast-math`) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| **Apple `arm64` macOS (`f64_trig`, `-ffp-contract=off`)** | **AMD/Intel `x86_64` & Thor `aarch64` Linux (`f64_trig`, `-ffp-contract=off`)** | **Cross-OS-Standard-`libm` `std::sin/cos` (`Apple libSystem` vs `GNU glibc`, kein `-ffast-math`)** | **`10`** (`0.17 s`) | **`5,900`** | **`9,798`** (`163.3 s`) |
| **`x86_64` Linux (`-O3 -mavx2 -mfma -ffp-contract=fast`)** | **Apple `arm64` & Thor `aarch64` (`-O3 -ffp-contract=fast`)** | **Cross-ISA `FMA`-Absenkung (`x86_64 VFMADD/VFNMADD` vs `AArch64 FMADD/FMSUB`, nur algebraisch, kein `-ffast-math`)** | **`406`** (`6.77 s`) | **`7,422`** | **`11,205`** (`186.8 s`) |
| **`x86_64` Linux `Node v22.22` (`f64_trig`)** | **`aarch64` Linux `Node v24.22` (`f64_trig`)** | **Cross-ISA Node.js V8 `Math.sin/cos` (`x86_64` vs `aarch64`)** | **`66`** (`1.10 s`) | **`7,617`** | **`10,093`** (`168.2 s`) |
| **`cpp_f64_strict` (`-ffp-contract=off`)** | **`cpp_f64_fma` / `-ffast-math`** | **Gleiches Host `FMA`-Kontraktion (`-ffp-contract=off` vs `-ffp-contract=fast`)** | **`192`** (`3.20 s`) | **`5,927`-`6,576`** | **`8,869`-`10,093`** |
| **`cpp_f64_strict` / `trig`** | **`cpp_f32_strict` / `trig`** | **Präzisions-Reduktion (`binary64` `f64` vs `binary32` `f32`)** | **`1`** | **`8`-`9`** | **`1,370`-`2,240`** |

Drei scharfe ISA-übergreifende Erkenntnisse treten zutage:

1. **IEEE 754-2008 `+`, `-`, `*`, `/` und `sqrt` mit deaktiviertem `FMA` (`-ffp-contract=off`) sind bitweise portabel zwischen `x86_64` und `arm64`/`aarch64`** (`0` Abweichungen über `25.000` Ticks bei `Clang`, `GCC`, `Rustc` und `V8`), da alle fünf Operationen verpflichtend auf `0,5` ULP runden.
2. **Standard-C++ `std::sin`/`std::cos` bricht die betriebssystemübergreifende Determinismusgarantie bereits bei Tick `10` (`0,17 s`) ein, selbst mit `-ffp-contract=off -fno-fast-math`**: Apples `libSystem` `libm` und GNU `glibc` runden einen Steuerimpuls um `1` ULP unterschiedlich bei Tick `10`, was chaotische 16-Körper-Kollisionen zu einem Positionsfehler von `> 10^-3` bis Tick `5.900` und zu einer diskreten Score-/Pickup-Desynchronisation bis Tick `9.798` (`163,3 s`) verstärken.
3. **Standardmäßige Compiler-`FMA`-Kontraktion (`-ffp-contract=fast`, ohne `-ffast-math` oder Trigonometrie) bricht die ISA-übergreifende Determinismusgarantie bei Tick `406` (`6,77 s`) ein**: Während AMD Zen 5 und Intel Raptor Lake bitgenau auf `x86_64` übereinstimmen (`844172b5...`) und Apple M3 Ultra sowie Jetson Thor bitgenau auf `AArch64` übereinstimmen (`deeb446c...`), senkt LLVM negierte Multiplizieren-Subtrahieren-Ausdrücke unterschiedlich auf `x86_64` (`AVX2` `VFMADD`/`VFNMADD`) und `AArch64` (`NEON` `FMADD`/`FMSUB`) ab, was das Spielgeschehen bei Tick `11.205` desynchronisiert.

<div id="63-ge-h3-cross-gpu-headless-wgpu-metal--vulkan-rendering-tolerance" class="anchor-alias" aria-hidden="true"></div>

### 6.3 `GE-H3`: Plattformübergreifende Toleranz beim headless `wgpu`-Rendering (`Metal` / `Vulkan`)

Um die rechte Seite von Abbildung 1 empirisch zu prüfen, wurde ein eigenständiger headless `wgpu`-Benchmark in Rust (`v22.1.0`, `ge_h3_wgpu_bench`) eingesetzt. Dieser rendert vier kanonische `Q32.32`-Simulationszustände (`ticks 0, 250, 1,000, 10,000`) in `512×512`-`RGBA8Unorm`-Framebuffer (`262,144` Pixel, `1,048,576` Bytes pro Frame). Die Darstellung erfolgt über eine zweistufige WGSL-Pipeline: einen trigonometrisch prozedural erzeugten Radar-/Gitter-Hintergrund und `20` in Deklarationsreihenfolge mit `SrcAlpha / OneMinusSrcAlpha` alpha-gemischte SDF- sowie Blinn-Phong-beleuchtete 3D-Kugel- und Torus-Entitäten. Als Referenz dient ein rein ganzzahliger, gleitkommafreier `CPU Q16.16`-Software-Rasterisierer.

| Adapter A (`API` · Treiber) | Adapter B (`API` · Treiber) | Mittlerer Anteil abweichender Pixel (`%`) | Max $|\Delta|$ (`0..255`) | Mittlerer MAE (`u8`) | Mittlerer RMSE (`u8`) | Min. `PSNR` (`dB`) | Min. `SSIM` | `GE-H3`-Schwelle |
|---|---|---:|---:|---:|---:|---:|---:|:---:|
| **Apple M3 Ultra (`Metal` 4)** | **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | `1.301%` | `2` | `0.00386` | `0.06215` | **`72.06`** | **`0.999986`** | **Bestanden** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **Apple M3 Ultra (`Metal` 4)** | `3.103%` | `1` | `0.00788` | `0.08876` | **`69.09`** | **`0.999956`** | **Bestanden** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | `3.774%` | `2` | `0.01022` | `0.10116` | **`67.97`** | **`0.999951`** | **Bestanden** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `6.553%` | `2` | `0.01735` | `0.13179` | **`65.64`** | **`0.999874`** | **Bestanden** |
| **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `8.280%` | `2` | `0.02149` | `0.14667` | **`64.79`** | **`0.999844`** | **Bestanden** |
| **Apple M3 Ultra (`Metal` 4)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `9.337%` | `2` | `0.02467` | `0.15720` | **`64.16`** | **`0.999833`** | **Bestanden** |
| Physische GPUs (`4` Hersteller) | `Mesa llvmpipe` (`LLVM 21.1.8` CPU `Vulkan`) | `1.541%` - `9.633%` | `2` - `3` | `0.00477` - `0.02601` | `0.06895` - `0.16173` | `63.86` - `70.87` | `0.999828` - `0.999984` | **Bestanden** |
| Physische GPUs (`4` Hersteller) | `CPU Q16.16` Zero-Float-Ganzzahl-Referenz | `20.400%` - `27.626%` | `2` | `0.05612` - `0.07864` | `0.23689` - `0.28068` | `59.13` - `60.58` | `0.999556` - `0.999693` | **Bestanden** |

- **Bit-Exaktheit widerlegt, begrenzte Toleranz bestätigt (`24 / 24` physische GPU-Frame-Paare)**: Jedes physische GPU-Paar erzeugte unterschiedliche rohe `RGBA8` `SHA-256` Digests (`0 / 24` bitweise Übereinstimmungen) aufgrund von Hardware-SFU-`sin`/`cos`/`pow`-Approximationen und `unorm8` ROP-Blend-Rundung, dennoch **keine Pixel auf irgendeinem physischen GPU-Paar unterschieden sich um mehr als `2 / 255`** ($p(|\Delta| > 8) = 0.000000 \le 0.001$), `PSNR` überstieg `64.16 dB` (`> 40.0 dB` Schwelle), und `SSIM` überstieg `0.999833` (`> 0.999` Schwelle) bei `0.31-2.80 ms` pro Frame.
- **Software-Rasterizer-Kontrast**: Der null-float `CPU Q16.16` Integer-Software-Rasterizer erreichte `0` `SHA-256` Framebuffer-Abweichungen auf `Apple M3 Ultra` (`arm64`), `AMD Zen 5` (`x86_64`) und `Intel Raptor Lake` (`x86_64`) (`9c693a38...` bei Tick `0`, `ce3b2cec...` bei Tick `10,000`), und `Mesa llvmpipe` (`LLVM 21.1.8`) stimmte bitweise zwischen AMD- und Intel-`x86_64`-Hosts überein (`ccb291f6...` bei Tick `0`), was zeigt, dass die Pixel-Divergenz spezifisch aus der Variabilität der GPU-Shader/ROP-Hardware stammt und nicht aus der Szenenprojektion $\lambda(s_t)$.

<div id="64-playable-joule-native-q3232-chrono-budget-arena-livinggame-engines" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Spielbare joule-native `Q32.32` Chrono-Budget-Arena (`/living/game-engines/`)

Die Verknüpfung des exakten `Q32.32`-Replay-Vertrags dieser Studie mit den energie-nativen zeitlichen Mechanismen von [Zeit als Index](/papers/time-as-an-index/) (Abschnitt 9.2) liefert Instrument 4 von [`/living/game-engines/`](/living/game-engines/) ein spielbares `60 Hz` deterministisches Orbital-Navigations- und Pickup-Verteidigungs-Mini-Spiel, das in JavaScript `BigInt` läuft (`0` Gleitkommaoperationen innerhalb der Simulation):

- **Live-`SHA-256`-Zustandsband & deterministisches Replay**: Jeder Takt aktualisiert einen rollenden `SHA-256`-Zustands-Digest und zeichnet kompakte 1-Byte-Spielereingabeereignisse in $D$ auf; das Anklicken von `Replay & Verify SHA-256` führt den gesamten Spielverlauf von `(seed, D)` aus und prüft die bitweise Hash-Gleichheit (`replayed_sha256 === live_sha256`).
- **Joule-budgetierter zeitlicher Vorausblick & Rücklauf (`est_j`-Entwurfsmodell)**: Das Abfragen zukünftiger Trajektorien (`Hellman-Branch-Preview`, Simulation von `3` Kandidaten-Steuerungsverzweigungen `K` Takte voraus) oder das Zurückspulen zu einem persistenten kausalen Checkpoint belastet eine explizite Mikrojoule-(`µJ`-)Batterie (`step_cost_uj` pro spekulativen Takt plus Landauer-Verzweigungs-Löschkosten, wenn nicht gewählte Zukünfte oder zurückgespulte Zeitlinien verworfen werden), spielbar über Tastatur, Maus/Touch und `WebXR`- / `Gamepad`-Controller (einschließlich Meta Quest Browser).

<div id="7-infeasibility-flags" class="anchor-alias" aria-hidden="true"></div>

## 7. Unzulässigkeitsmarkierungen

1. **Bitgenaues plattformübergreifendes Hardware-Rendering: nicht realisierbar (`0 / 24` `SHA-256`-Übereinstimmungen über `Metal`, `RADV`, `NVIDIA` und `ANV` in `GE-H3`). Begrenzte perzeptuelle Toleranz (`PSNR > 64 dB`, `SSIM > 0.9998`, $\Delta_{\max} \le 2$) hingegen gilt, solange GPU-Ausgaben nicht in $S$ zurückfließen.**
2. **Plattformübergreifende exakte Physik mit Standard-Gleitkommaeinstellungen: nicht realisierbar.** Selbst *ohne* `-ffast-math` weichen plattformübergreifende `std::sin`/`std::cos`-Aufrufe (`Apple libm` gegenüber `GNU glibc`) ab Tick `10` voneinander ab, und die ISA-übergreifende `FMA`-Lowering (`x86_64` gegenüber `arm64`, `-ffp-contract=fast`) divergiert ab Tick `406`. Diese Abweichungen kaskadieren innerhalb von `9.798` bis `11.205` Ticks in eine Desynchronisation des Spielablaufs (`GE-H2`).
3. **GPU-Berechnung innerhalb der Simulation: als exakte Berechnung nicht realisierbar; nur mit deterministischen Reduktionen machbar**, bei einem gemessenen Mehraufwand von etwa 0,2 % bis 7,8 % auf der angeführten Hardware. Zudem unterliegt sie weiterhin der Compiler-Kontraktion, sofern sie nicht auf jedem Zielsystem pro Instruktion abgesichert ist (SPIR-V NoContraction).
4. **Engine-portables Verhalten: in keiner gelesenen externen Quelle belegt; auf der Ebene des 2D-Physikkerns in `GE-H1` über `25` Ziel- × Host-Zellen (`5` Rechner, `3` ISAs, `6` Laufzeitumgebungen/Compiler) demonstriert, während vollständige Engine-Projektionen (`GE-H4`, `GE-H9`) offen bleiben.**
5. **Interpretierte Regeln bei großen Akteurzahlen: eingeschränkt.** Die GameRule-Messung impliziert eine Obergrenze von etwa 300 Akteuren bei 20 ms (`GE-H1` zeigt darüber hinaus, dass Python-`int` gegenüber nativem Rust `reported_j` über Intel-, AMD- und Apple-Silicon-Systeme hinweg einen Mehraufwand von `73×` bis `132×` verursacht). Bei Skalierung ist eine kompilierte native oder WebAssembly-Projektion erforderlich.
6. **Proprietäre Engines und bare-metal-Windows-Ziele als exakte Ziele: unverifiziert.** Das Unity-Handbuch, wie von GameRule zitiert, schließt Ordnungsgarantien aus. Die Vorlagenkataloge von Unity und Unreal konnten nicht gelesen werden (ihre Seiten werden clientseitig gerendert), es wurde keine Quelle zur Ausführungsreihenfolge in Unreal gelesen, und die bare-metal-Windows-`PE`-Ausführung war im Linux/macOS-Runner-Pool der Welle 3 nicht aktiv.

<div id="8-sources-and-limits" class="anchor-alias" aria-hidden="true"></div>

## 8. Quellen und Grenzen

Jede oben genannte Quelle wurde an der angegebenen Passage vollständig gelesen, mit Ausnahme: des GameCraft-Bench-Papiers (Abstract und Repository-README gelesen), der RCE-Über-Seite (Zusammenfassungsseite gelesen) und der Capcom-Pressegeschichte (ein Artikel). Begleitende Hausstudien, die für Telemetrielagen (`SATB`) und joule-budgetsbasierte temporale Spielmechaniken zitiert werden, sind [Zeit als Index](/papers/time-as-an-index/) und das [Sättigungsstufen-Benchmark-Harness](/papers/satb-harness/) (`[same house]`). Konsultierte, aber nicht als Evidenz zitierte Quellen: das [Ludii-Portal](https://ludii.games/), das Spiele als strukturierte Mengen von Ludemes beschreibt; das Game Grammar Hobby-Repository; und die READMEs von [PlayCanvas](https://github.com/playcanvas/engine), [Babylon.js](https://github.com/BabylonJS/Babylon.js) und [three.js](https://github.com/mrdoob/three.js), die Rendering-Bibliotheken statt Spielbeschreibungsformate beschreiben.

Nicht gelesen, hinter Bezahlschranke oder anderweitig nicht verfügbar: T. Schaul, "A Video Game Description Language for Model-based or Interactive Learning," IEEE CIG 2013, doi:10.1109/CIG.2013.6633610; J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845. M. Ebner et al., "Towards a Video Game Description Language," doi:10.4230/DFU.Vol6.12191.85, ist Open Access, wurde jedoch für diese Studie nicht gelesen.

In Abschnitt 6 lassen `GE-H1`, `GE-H2` und `GE-H3` `measured_j = None` und `board_metered = false` für alle Durchläufe unverändert (sie trennen macOS `L3` per-process `ri_energy_nj` von Linux `L2` socket/core `RAPL` `reported_j` und halten die Chrono-Budget-Arena-`est_j`-Mechaniken streng analytisch). Bare-metal Windows `PE`-Ausführung, Direct3D 12 `wgpu`-Rendering und Multi-Engine-Emitter (`GE-H4`-`GE-H9`) bleiben offene Arbeit.
