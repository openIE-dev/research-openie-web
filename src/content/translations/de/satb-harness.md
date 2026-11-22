---
title: "Satiation Benchmark: Referenz-Harness, Adapter und Telemetrie-Zuordnung"
deck: "Ein fester sequentieller Rust-Referenz-Harness (Lane B), eine einzelne proxy-erzwungene Adapter-Brücke (Shapes D, M, H und I), eine zwölfstufige Konformitätssuite (C1 bis C12) sowie eine fünfstufige wurzellose Telemetrie-Zuordnungsmaschine (L0 bis L4 gekreuzt mit Labels A1 bis N). Empirisch verifiziert über vier Hardware-Archetypen: Apple M5 Max (arm64 macOS IOReport und proc_pid_rusage `reported_j`), NVIDIA Jetson AGX Thor (aarch64 Tegra Linux physikalisches INA238-Gesamtboard und INA3221 schienengetrennter Shunt `measured_j`), Framework Desktop AMD Ryzen AI Max+ 395 Strix Halo (x86-64 Linux 0440 root:energy PLATYPUS-isoliertes RAPL `reported_j` plus amdgpu PPT) und Intel Core i9-13900H Raptor Lake (x86-64 Linux RAPL psys L1 und package-0 L2 `reported_j`). Rohe `measured_j`, `reported_j` und L4-logische Kanäle bleiben strikt getrennt und werden niemals summiert; da Co-Tenant-Workloads auf den gemeinsam genutzten Hosts liefen (dedicated_host ist false), wird die A2-Netzplatzierungs-Zuordnung gemäß Falsifier 6 zurückgehalten."
lang: "de"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*Revision af57f48, 22. November 2026. Daten- und Digest-Zusammenfassung: [/data/#satb-harness](/data/#satb-harness). Interaktive lebende Abbildungen: [/living/satb-harness/](/living/satb-harness/). LaTeX-Archivfassung: [/pdfs/latex/satb-harness.pdf](/pdfs/latex/satb-harness.pdf) ([Quelle](/pdfs/latex/satb-harness.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Überblick

Wenn zwei Agenten-Evaluationen unterschiedliche Aufgabenerfolgsraten oder unterschiedliche Energiewerte melden, liegt die Ursache häufig nicht am Modell selbst, sondern darin, wie das Modell eingebettet wurde und wie die Hardwarezähler zugeordnet wurden. Allein die Änderung des umgebenden Harness verschob die Aufgabenlösung von `Gemini 2.5 Pro` auf `Terminal-Bench 2` um `17` Prozentpunkte. Gleichzeitig kann das Abziehen einer driftenden Leerlaufbasislinie oder die Aufteilung einer gemeinsam genutzten Silizium-Stromschiene nach Prozessorzeit die Energiezuordnung um mehr als 30 % verzerren.

Diese Studie spezifiziert und verifiziert empirisch den **Satiation Benchmark (`SATB`)**-Evaluationsvertrag. Er umfasst einen festen, sequenziellen Rust-Referenz-Harness (**`Lane B`**), eine proxy-isolierte Adapterbrücke (**`Shapes D, M, H, and I`**) für Nullmodell-Kontrollen, rohe Modellendpunkte, externe Kommandozeilen-Harnesses und öffentliche Benchmark-Solver, einen fünfblockigen kryptografischen Fingerabdruck des Systems unter Test (`SUT`), zwölf verpflichtende Konformitätsprüfungen sowie eine rootless arbeitende Telemetrie-Engine mit fünf Stufen. Anstatt das Design unvermessen zu lassen, führen wir Live-Konformitäts- und Falsifikationsbenchmarks auf **vier Hardware-Archetypen** aus: eine Workstation mit `Apple M5 Max` (`128` Gigabyte vereinheitlichter Speicher, `macOS 27.2.1`, `IOReport` auf dem Chip sowie `proc_pid_rusage` des Kernels als `reported_j`), ein Tegra-`aarch64`-Entwicklungskit (`Jetson Thor`, `Linux 6.8.12-1021-tegra`, mit physischen Gesamtboard- und dreikanaligen, schienengetrennten Strommesswiderständen von Texas Instruments als `measured_j`), eine `Framework`-Desktop-Workstation mit `Strix Halo` (`Ryzen Max+ 395`, `Linux 7.0.0-43-generic x86-64`, gruppenisolierte Package-Energie `0440 root:energy` als `reported_j` plus Leistungsverfolgung der `amdgpu`-Package) sowie eine Workstation mit `Raptor Lake` (`Intel Core i9-13900H`, `Linux 7.0.0-43-generic x86-64`, Plattform- und Package-Energie als `reported_j`). Geschlossene Cloud-Server-Energie wird dagegen strikt als `not_available` markiert.

**Einfach ausgedrückt**

1. Die Prompt-Schleife eines Agenten, die Kontext-Trim-Regel und die Werkzeug-Sandbox können Benchmark-Ergebnisse ebenso stark beeinflussen wie ein Austausch des zugrunde liegenden Modells, daher hält `Lane B` diese Hülle vollständig fest in deterministischem Rust, während `Lane O` externe Hüllen durch einen auditierten Proxy-Stecker zwingt.  
2. Energiekanäle werden unverändert an ihrer wahren physischen Grenze, bei der kompletten Wandsteckdose, Board-Eingang, Chip-Package, Betriebssystem-Prozess-Schätzung oder dem logischen Token-Ledger erfasst und niemals zu einer einzigen unlabeled Zahl zusammengefasst, über Evidenzklassen (`measured_j` vs. `reported_j` vs. `est_j`) summiert oder mit Flotten-Nachhaltigkeits-Durchschnittswerten rückgefüllt.  
3. Live-Tests über vier Silizium-Plattformen bestätigen exakte `Shape D` million-Datensatz-memory-mapped (`15027705736`) und `C9`-Replay (`149,747 B`, `0` Byte-Differenzen) Determinismus, `0.87-9.54 ms` Prozess-Baum-Kill-Aufräumzeit, Cloud `temperature = 0` Nicht-Determinismus über drei Anbieter, Hardware-Sensor-Kadenz-Grenzwerte (`24.3-45.4 µs` `x86-64` Zähler-Ablesungen bei `94-97 Hz` vs. `2.95 ms` serieller-Bus-Shunt-Ablesungen bei `66.6 Hz` auf `Jetson Thor` vs. `~8 Hz` `macmon` `IOReport`), `32.59%-72.89%` Fehler beim Aufteilen sequentieller Compute-plus-Storage-Phasen nach Prozessorzeit (`Falsifier 3`), und physische Trennung von Grafik-zu-Prozessor-Shunt-Leitung neben `Falsifier 6` Shared-Host-Drift-Gating (`dedicated_host = false`).

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Begriffe, Akronyme und Zuordnungsbezeichnungen

<ul id="terms">
<li>SATB, SUT, PFRK, OQ, SPEC, BUNDLE, SUBMIT, REFUSE, STOP: Satiation-Benchmark-Harness- und Attributionsspezifikation, System unter Test, vierwertige Versuchsergebnisse (pass, fail, refuse, killed), aufgelöste offene Frage der Spezifikation, normatives Spezifikationsdokument, Aufgabenbündel-Datei, terminaler Aufruf zur Abgabe der Antwort, terminaler Aufruf zur Verweigerung, und Stopp-Token zum Abbruch der sequentiellen Schleife</li>
<li>ACI, SWE, CLI, MCP, SDK, ACP, ARC, AGI, GUI: Agent-Computer-Interface, Präfix für Software-Engineering-Benchmarks, Kommandozeilenschnittstelle, Model Context Protocol, Software Development Kit, Agent Client Protocol, Abstraction and Reasoning Corpus, Benchmark-Suite für allgemeine künstliche Intelligenz, und grafische Benutzeroberfläche</li>
<li>IO, JSON, JSONL, RPC, JCS, UTF, HTTP, SSE, URL: Ein-/Ausgabe-Protokoll, JavaScript Object Notation, zeilenweise getrenntes JSON, Remote Procedure Call, JSON Canonicalization Scheme (RFC 8785), Unicode Transformation Format, Hypertext Transfer Protocol, Server-Sent Events, und Uniform Resource Locator</li>
<li>POSIX, MMAP, DNULLMM1, SHA, SIGKILL, ESRCH, EACCES, EOF: Portable Operating System Interface, Schnittstelle für speicherabgebildete Dateien, binäres speicherabgebildetes Format des deterministischen Null-Index, Secure Hash Algorithm (SHA-256), nicht abfangbares POSIX-Signal zur Prozessbeendigung, Kernel-Status für nicht existierenden Prozess, POSIX-Fehlerstatus für verweigerte Berechtigung, und Dateiende-Begrenzer des Here-Dokuments</li>
<li>AI, ML, LLM, MLX, GGUF, KV, TP, ENERGY: künstliche Intelligenz, maschinelles Lernen, großes Sprachmodell, Apple-Array-Framework für lokale Inferenz, quantisierte Gewichte im GPT-Generated Unified Format, Key-Value-Cache, Tensorparallelismus, und das Konsortium ML.ENERGY für GPU-Leistungs-Benchmarks</li>
<li>CPU, GPU, APU, ANE, SoC, ALU, ISA, IPC, PID, UID, GID, OS, VM, EC, GB: zentrale Verarbeitungseinheit, Grafikprozessor, beschleunigte Verarbeitungseinheit, Apple Neural Engine, System-on-Chip, arithmetisch-logische Einheit, Befehlssatzarchitektur, Befehle pro Takt, Prozesskennung, Benutzerkennung, Gruppenkennung, Betriebssystem, virtuelle Maschine, Embedded Controller, und Gigabyte</li>
<li>RAM, DRAM, SLC, NVMe, PSU, PDU, AC, DC, DVFS, MSR, MMIO: Arbeitsspeicher mit wahlfreiem Zugriff, dynamischer RAM, systemweiter Cache, Non-Volatile Memory Express, Netzteil, Stromverteilungseinheit, Wechselstrom, Gleichstrom, dynamische Spannungs- und Frequenzskalierung, modellspezifisches Register, und speicherabgebildete Ein-/Ausgabe</li>
<li>RAPL, NVML, PPT, TI, I2C, ADC, INA, INA238, INA3221, AGX, VDD, SOC, MSS, VIN, SYS, PLATYPUS: Running Average Power Limit für Intel- und AMD-Prozessoren, NVIDIA Management Library, AMD Package Power Tracking, Texas Instruments, Inter-Integrated-Circuit-Bus, Analog-Digital-Wandler, Familie der Strom- und Leistungsmonitore von Texas Instruments (`INA238`, `INA3221`), NVIDIA-Jetson-AGX-Modulklasse, Versorgungsspannungsschiene für den Drain, Schiene für das System-on-Chip, Schiene für das Speicherteilsystem, Eingangsschiene der Systemspannung, und Power Leakage Attacks: Targeting Your Processor Using Software</li>
<li>API, USD, CNCF, AISI, UK, AMD, NVIDIA: Programmierschnittstelle, US-Dollar, Cloud Native Computing Foundation, AI Safety Institute, Vereinigtes Königreich, Advanced Micro Devices und NVIDIA Corporation</li>
<li>RCE, MoL, WCA, LUT6: Reality Code Engine [same house], Mixture of Limits [same house], Wise Computer Automation [same house] und 6-Eingabe-Boolean-Lookup-Tabelle</li>
</ul>

Über die Telemetrieebenen L0 bis L4 hinweg trägt jeder in einer `SATB`-Quittung erfasste Kanal sowohl seine physikalische Grenze als auch eine von vier strikten Evidenzklassen:

| Evidenzklasse | Geltungsbereich in `SATB`-Quittungen und -Tabellen |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | Kanonische `SHA-256`- und `JCS`-Digests (`RFC 8785`) von Aufgabenbündeln, fünfblöckigen `SUT`-Fingerabdrücken und Replay-Transkripten; vom Proxy protokollierte Token-Zahlen für Prompt, Cache, Reasoning und Completion; Wanduhr-Laufzeiten; sowie datierte `API`-Listenpreise in `USD`. |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | Wird ausschließlich aus einem kalibrierten externen `AC`-Wandleistungsanalysator (`L0`) oder einem physischen Strom-Shunt-Monitor auf der Platine (`L1`/`L2`) befüllt. Live verifiziert auf `NVIDIA Jetson AGX Thor` über `TI` `INA238` (`hwmon6` `VIN`, `L1`) und `INA3221` (`hwmon5` `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS`, `ch3 VIN_SYS_5V0`, `L2`/`L1`; `board_metered = true`). Da während der Erfassung ein aktiver Mitnutzer `VDD_GPU` belegte (`dedicated_host = false`), bleibt der rohe Rail-Wert `measured_j` erhalten, während die `A2`-Netto-Platzierungszuordnung zurückgehalten wird; `measured_j` bleibt auf `Apple M5 Max`, `AMD Strix Halo` und `Intel Raptor Lake` `None`, und die `L0`-Wandleistung ist durchgängig nicht gesetzt. |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | Rootlose On-Chip-Telemetriezähler (`Apple M5 Max` `IOReport` `sys_power` auf `L1` und `chip_power`/`cpu_power`/`gpu_power` auf `L2` über `macmon`; `Intel Raptor Lake` `RAPL` `psys` auf `L1` und `package-0`/`core`/`uncore` auf `L2`; `Framework AMD Strix Halo` `RAPL` `package-0`/`core` auf `L2` sowie `amdgpu` `PPT`-Watt) und vom `OS` modellierte Schätzwerte pro Prozess (`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` auf `L3`, Label `D`). Werden niemals mit `measured_j` oder `est_j` summiert. |
| **`Provider-Attested (P) vs. Not Available (N)`** | Die Energie des entfernten Servers bei geschlossenen `API`s wird nur dann als `P` geschrieben, wenn der Anbieter pro Anfrage einen Energiewert mit wörtlich angegebener Methodik liefert; andernfalls steht buchstäblich `"not_available"` (Label `N`). Abgeleitete Baseline-Subtraktionen, die die `5.0%`-Driftgrenze (`Falsifier 6`) oder die Summenprüfung in `Step 7` verfehlen, werden automatisch verworfen, während die Rohkanäle unverändert erhalten bleiben. |

<div id="11-lineage-design-invariants-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Herkunft, Design-Invarianten und Offenlegung im gleichen Haus

`SATB` baut unmittelbar auf öffentlichen Arbeiten zur Agenten-Evaluation und Leistungszuordnung auf, anstatt eigene Protokolle zu erfinden, wo Standards bereits existieren: die minimale zustandslose Shell-Ausführung folgt `mini-swe-agent`; die Brückenbildung zu Solver und externer CLI greift auf `UK AISI Inspect` (`react()` und `Inspect Agent Bridge`) sowie `Terminal-Bench` (`Harbor` / `Terminus-2`) zurück; Tool-Schemata verwenden `MCP`, kanonisiert über `RFC 8785` (`JCS`); die Disziplin des kumulativen GPU-Zählers folgt Chung et al. (`ML.ENERGY` / `Zeus`) und Yang et al. zu Fallstricken der teilzeitlichen `nvidia-smi`-Stichproben; die proportionale `CPU`-Aufteilung (`label C`) wird gegen das `CNCF Kepler`-Modell evaluiert; und die Linux-`RAPL`-Berechtigungsisolierung folgt Lipp et al. (`PLATYPUS`). Begleitende Studien der Open Interface Engineering, [Metered Commit Gates](/papers/gates/), [Task Satiation vs. Aggregate Rebound](/papers/satiation/) und [Deterministic Null](/papers/deterministic-null/), sind `[same house]`-Arbeiten, die ausschließlich für gemeinsame architekturelle Definitionen zitiert werden:

| Vertragsachse | Invariante, die über alle Lanes hinweg erhalten bleibt |
| :--- | :--- |
| **Versuchsprotokoll** | Feste Aufgabenleiter; höchstens ein terminales `SUBMIT` oder `REFUSE` pro Versuch; eine unveränderliche `SHA-256`-Quittung pro Versuch; kanonische Ergebnisse `pass`, `fail`, `refuse`, `killed`; null Verifizierer-Feedback während der Testversuche. |
| **Systemidentität** | Fünf-Block-`SUT`-Fingerabdruck (`model` + `serving` + `sampling` + `harness` + `envelope`), gehasht bei `session.open` und erneut gehasht bei `session.close`. |
| **Zurechenbare Energie** | Rohfenster-Energie des gesamten `SUT` (`A2`) auf einem quieszierten dedizierten Host; Energie der Inferenz-Engine auf einer exklusiven physischen Schiene (`A1`); sequenzielle Energie der Modell-gegen-Tool-Phase (`B`) unter `Lane B`. |
| **Nicht zurechenbar** | Unbezeugte Joule eines geschlossenen `API`-Servers (`N`); exakte Joule-Anteile pro Prozess einer gemeinsam genutzten `SoC`- oder Unified-Memory-Schiene (`C` und `D` sind Modelle, keine physischen Schienenmessgeräte); Modellgewichte getrennt von Engine-Kernen und Silizium. |

---

<div id="2-survey-of-agent-harnesses-and-why-context-policy-is-part-of-the-system" class="anchor-alias" aria-hidden="true"></div>

## 2. Überblick über Agent-Harnesses und warum die Kontextstrategie Teil des Systems ist

Moderne Harnesses für Coding, Terminal und Computer-Nutzung unterscheiden sich deutlich darin, wie sie Werkzeuge bereitstellen, Dateiänderungen absichern und wachsende Konversationsverläufe verdichten:

| Harness | Schleife und Werkzeugoberfläche | Kontext- und Verlaufsstrategie |
| :--- | :--- | :--- |
| **`mini-swe-agent`** | Nur `Bash`. Jede Aktion startet einen neuen, zustandslosen `subprocess.run`. | Streng lineare, nur anhängende Nachrichtenhistorie; keine automatische Verdichtung. |
| **`SWE-agent` (`ACI`)** | Dateibetrachter mit 100-zeiligem Fenster, durch Linter abgesicherter Bearbeitungsbefehl, knappe Suche. | Verlaufsprozessor fasst ältere Umgebungsbeobachtungen zu begrenzten Zusammenfassungen zusammen. |
| **`Inspect react()`** | Sequenzielle Werkzeugschleife bis `submit()`: `bash()`, `text_editor()`, `MCP`-Werkzeuge. | Editierbarer Nachrichtenzustand mit austauschbaren Solvern zur Kürzung oder Verdichtung des Verlaufs. |
| **`Inspect Agent Bridge`** | Kapselt `Claude Code`, `Codex CLI`, `Gemini CLI` und eigene `SDK`-Agenten hinter einem lokalen Proxy. | Die Kontextverwaltung wird vollständig an das eingebettete externe Harness delegiert. |
| **`Terminus-2` (`Harbor`)** | Einziges Werkzeug: persistente `tmux`-Terminalsitzung, die rohe Tastatureingaben empfängt. | Dreistufige Kontextzusammenfassung (progressive Komprimierung des Transkripts in drei Stufen). |
| **`Codex CLI`** | Gesandboxte Shell (`Landlock`/`seccomp` oder `seatbelt`), strukturiertes `apply_patch`, `MCP`. | Native, fortlaufende Kontextverdichtung, ausgelöst nahe den Grenzen des Modellfensters. |
| **`Claude Code`** | `Bash`, strukturierte Dateiwerkzeuge (`Read`, `Write`, `Edit`, `Glob`, `Grep`), `MCP`. | Automatische, LLM-gesteuerte Konversationsverdichtung (`auto-compact`) zusätzlich zu Prompt-Caching. |
| **`OpenHands`** | Ereignisstrom-Laufzeitumgebung, die beliebige `ACP`- oder `CodeAct`-Coding-Agenten in Containern ausführt. | Konfigurierbarer Kontextkondensator (`LLM`-Zusammenfassung oder Fenstermaskierung). |
| **`ARC-AGI-3`-Runner** | Standard-Harness gegenüber Provider-Adapter-Harnesses über interaktive Gitterzustände. | Begrenztes visuelles bzw. gitterbasiertes Zustandstrajektorienfenster, das pro Adapter-Track deklariert wird. |
| **`OSWorld run.py`** | Desktop-`GUI`-Schleife, die `pyautogui`-Maus- und Tastaturaktionen über VM-Screenshots ausgibt. | Gleitendes Trajektorienfenster, das nur die jeweils letzten $K$ Screenshots und Aktionen behält. |

Auf `Terminal-Bench 2` löste `Gemini 2.5 Pro` **`17 %` mehr Aufgaben** auf, wenn es mit `Terminus-2` statt mit `OpenHands` gepaart wurde, wobei der zugrunde liegende Modell-Checkpoint konstant gehalten wurde. Kontextverwaltung, Ausgabekürzung, Linting von Bearbeitungen und Wiederholungsregeln sind daher Komponenten erster Ordnung des evaluierten Systems und keine neutrale Infrastruktur. `SATB` löst diese Verwechslung auf, indem die Evaluation in zwei explizite Lanes aufgeteilt wird, und schließt damit die offenen Fragen `OQ-1` und `OQ-2`:

1. **Den Wrapper konstant halten (`Lane B`) vs. externe Wrapper evaluieren (`Lane O`)**: `Lane B` (`satb-agent`) fixiert eine einzelne auditierbare Rust-Schleife über alle Modelle, während `Lane O` komplette Third-Party-Harnesses (`Claude Code`, `Codex CLI`, `OpenHands`, `Terminus-2`, `Inspect`) als Black-Box-`SUT`s einbettet, deren interne Prompts und Kompaktierungsaufrufe in den `harness`-Fingerprint-Block gehasht werden und zu 100% durch `satb-proxy` geleitet werden.

2. **Auflösung der Kontextrichtlinie (`OQ-1`: `ContextRule_v0`)**: Das harte Abschalten eines Versuchs ohne Elision vermischt mehrstufiges Denken mit ausführlicher Werkzeugausgabe, während die von `LLM` generierte Zusammenfassung (`Claude Code` auto-compact) versteckte stochastische Modellaufrufe einführt, die die deterministische Harness-Wiedergabe brechen. `Lane B` verwendet **`ContextRule_v0`**: Immer wenn die akkumulierte Gesprächsgröße **`80%`** des deklarierten Kontextfensters überschreitet, ersetzt der Harness deterministisch die ältesten Werkzeugausgaben durch `"[ELIDED_BY_CONTEXT_RULE_V0]"`, während `system(TEMPLATE_v0)`, das initiale `user(render(bundle))` und die **letzten `8` Werkzeugausgaben** unverändert erhalten bleiben, wodurch **null Modellaufrufe** entstehen. Das harte `killed(context_ceiling)` wird nur ausgelöst, wenn diese behaltenen Nachrichten allein **`100%`** des Fensters überschreiten.

3. **Auflösung der Werkzeugoberfläche (`OQ-2`: `TOOLS_v0`)**: Reines `exec`-only (`mini`-Style) zwingt Modelle, mehrzeilige Quellcode-Patches und algebraische Beweise (`cat << 'EOF'`) per Shell-Escape zu verarbeiten, was Shell-Quoting-Fehler erzeugt, die orthogonal zum Aufgabenreasoning liegen, und die portable rootless Sandbox-Implementierung über `macOS` und `Linux` verkompliziert. `Lane B` korrigiert **`TOOLS_v0`**, vier Workspace-Werkzeuge (`exec`, `read_file`, `write_file`, `list_dir`) sowie zwei Terminal-Werkzeuge (`submit`, `refuse`), kanonisiert via `JCS` zu `tools_hash` (`d5b102...`).

---

<div id="3-reference-harness-lane-b-contextrule_v0-and-satb-io-protocol" class="anchor-alias" aria-hidden="true"></div>

## 3. Referenz-Harness (`Lane B`), `ContextRule_v0` und `SATB-IO`-Protokoll

<figure class="my-8">
  <img src="/figures/satb-harness/satb-lane-b-architecture.svg" alt="Satiation Benchmark Lane B Komponentenisolationstopologie und deterministischer Sitzungslebenszyklus." />
  <figcaption>Abbildung 1. Links: <code>Lane B</code>-Komponentenisolation mit rootless <code>satb-meter</code>, <code>satb-supervisor</code>, <code>satb-agent</code>, netzwerkblockiertem <code>satb-sandbox</code>, credentialhaltendem <code>satb-proxy</code> und dem unerreichbaren externen <code>Verifier</code>. Rechts: deterministische <code>SATB-IO</code>-Sitzungs- und Versuchsequenz.</figcaption>
</figure>

<div id="31-sequential-execution-loop-and-fixed-versus-configurable-split" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Sequentielle Ausführungsschleife und Trennung zwischen fixierten und konfigurierbaren Komponenten

Innerhalb von `satb-agent` führt jeder Versuch eine strikt sequentielle Einzelagenten-Schleife aus, ohne überlappende Hintergrund-Tool-Threads, ohne `best-of-k`-Abstimmung und ohne Rückmeldung eines Verifikations-Orakels:

```text
msgs <- [system(TEMPLATE_v0), user(render(bundle))]
loop:
  ContextRule_v0(msgs)        # >= 80% window -> elide oldest tool outputs; keep last 8; 0 model calls
  r <- proxy.chat(msgs, TOOLS_v0)   # missing usage -> immediate killed(usage_missing)
  if no tool calls: append CONTINUE_v0; continue
  for call in r.tool_calls (sequential):
    submit | refuse -> attempt.close; ignore trailing calls (C4); STOP
    exec | read_file | write_file | list_dir -> fresh sandboxed process in /work,
      Truncate_v0 (8 KiB head + 8 KiB tail), no network egress (C6)
  envelope ceiling reached -> killed(wall_ceiling | token_ceiling | turn_ceiling | context_ceiling)
```

Jeder `Lane B`-Durchlauf trennt feste Benchmark-Konstanten (gehasht in `harness_id`) von deklarierten `SUT`-Parametern (gehasht in `sut_fingerprint_sha256`):

| Fest über alle `Lane B`-Durchläufe (`harness_id`) | Pro `SUT` konfigurierbar (`sut_fingerprint_sha256`) |
| :--- | :--- |
| `TEMPLATE_v0`-Prompt, Bündel-Renderer und `CONTINUE_v0`-Hinweis | `model_id`, Anbieterschnappschuss-Datum oder lokales `GGUF`/safetensors `SHA-256` |
| `TOOLS_v0`-Schemata (`tools/list` `JCS`-Digest) und sequentielle Weiterleitung | Sampling-Parameter: `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `reasoning_effort` |
| `ContextRule_v0` (`80%` Schwelle, behalte letzte `8`) und `Truncate_v0` (`8 + 8 KiB`) | Serving-Engine (`llama.cpp`, `MLX`, `vLLM`, Cloud-`API`) und Batch-/Cache-Flags |
| Einzelner Versuch (`attempts = 1`), kein Verifizierer-Feedback, keine interne Abstimmung | Envelope-Grenzwerte: `wall_ms`, `max_total_tokens`, `max_turns` |
| `satb-sandbox`: `/work`-Einschränkung, abgespeckte Umgebung, kein Netzwerk-Ausgang | Sandbox-`CPU`/`RAM`-Kontingente, Host-Silizium, `OS`-Kernel und Isolations-Stufe |

<div id="32-canonical-four-way-outcome-mapping-oq-3" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Kanonische Vier-Wege-Ergebniszuordnung (`OQ-3`)

Um zu verhindern, dass Benchmarks abgestürzte Durchläufe stillschweigend verwerfen oder freiwillige Fehlantworten mit Infrastruktur-Timeouts vermengen, bildet `SATB` die legacy-Fünf-Zustands-Abschluss-Codes verlustfrei auf **`{pass, fail, refuse, killed}`** (`PFRK`) ab und bewahrt den exakten `sub_reason` in jedem Receipt:

1. **`completed` $\to$ `pass` (`sub_reason: "verified"`, score `1`)**: `SUT` rief `submit(bytes)` vor Ablauf der Ceiling auf und der externe `Verifier` akzeptierte `bytes` nach `attempt.close`.
2. **`incorrect` $\to$ `fail` (`sub_reason: "incorrect"`, score `0`)**: `SUT` rief `submit(bytes)` sauber auf; der externe `Verifier` lehnte den Kandidaten ab.
3. **`malformed` $\to$ `fail` (`sub_reason: "malformed_submission"`, score `0`)**: `SUT` rief freiwillig `submit(bytes)` mit unparsablem oder schema-ungültigem Inhalt auf. Eine fehlerhafte Einreichung des `SUT` ist ein Genauigkeitsfehler, niemals ein Infrastruktur-Kill.
4. **`refused` $\to$ `refuse` (`sub_reason: "policy" | "capability" | "other"`, score `0`)**: `SUT` rief explizit `refuse(reason)` auf.
5. **`no_submission` $\to$ `killed` (`sub_reason: "wall_ceiling" | "token_ceiling" | "turn_ceiling" | "context_ceiling" | "usage_missing" | "exec_timeout_killed" | "process_crash"`, score `0`)**: `satb-supervisor` beendete den Versuch, bevor ein terminaler Tool-Aufruf eintraf. Alle vier Ergebnisse verbleiben im Nenner $n$.

---

<div id="4-adapter-bridge-shapes-d-m-h-i-five-block-sut-fingerprint-and-c1c12-conformance" class="anchor-alias" aria-hidden="true"></div>

## 4. Adapter-Brücke (`Shapes D, M, H, I`), Fünf-Block-`SUT`-Fingerprint und `C1-C12`-Konformität

<div id="41-four-adapter-shapes-behind-one-supervisor-and-proxy" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Vier Adapter-Formen hinter einem Supervisor und Proxy

Jedes System außerhalb von `Lane B` verbindet sich mit `satb-supervisor` über eine von vier Adapter-Formen:

| Adapter-Form | Zielsyteme | Ausführungs- und Isolationsvertrag | Wiederverwendete Standards |
| :--- | :--- | :--- | :--- |
| **`Shape D` (`dnull` control)** | Deterministic Null (`N0` strict model-free und `N1` dev-crystallized) über eingefrorene `DNULLMM1` `mmap`-Speicher | Führt innerhalb von `/work` unter identischen `TOOLS_v0`- und `Verifier`-Regeln aus mit **`0` Proxy-Modellaufrufen** zum Entscheidungszeitpunkt. | `POSIX mmap`, `SPEC v0.4` 64-Bit-Ganzzahl-Schleife |
| **`Shape M` (Model endpoint)** | Lokale Open-Weight-Server und geschlossene Cloud-`API`s | Führt `Lane B` `satb-agent` über `Chat Completions` oder `Messages` mit Tool-Aufrufen und obligatorischem `usage` aus, zu 100 % über `satb-proxy` geroutet. | OpenAI-kompatible `API` (`llama.cpp`, `mlx_lm`, `vLLM`); `Anthropic`, `Gemini`, `xAI`-Übersetzer |
| **`Shape H` (Harness in a box)** | `Claude Code`, `Codex CLI`, `Gemini CLI`, `OpenHands`, `Terminus-2` | Aufgabe nach `/work/task/BUNDLE.md` geschrieben. Basis-`URL` auf `satb-proxy` (`127.0.0.1:<port>`) gerichtet; echte `API`-Schlüssel werden von `/work` ferngehalten; Ende über `MCP` `submit` oder `refuse`; kein weiterer Ausgang. | `Inspect`-Sandbox-Bridge-Umgebungsvariablen; `--strict-mcp-config` `MCP`; optionales `ACP` |
| **`Shape I` (`Inspect` agent)** | Bestehende öffentliche Benchmark-`Inspect`-Solver | Umschließt das `SATB`-Aufgabenbündel mit `submit`- und `refuse`-Tools bei `attempts = 1` und routet Modellaufrufe über `satb-proxy`. | `UK AISI Inspect` `Task`- und `Solver`-Schnittstelle |

<div id="42-five-block-sut-fingerprint-and-session-validity" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Fünf-Block-`SUT`-Fingerabdruck und Sitzungs-Gültigkeit

Bevor `attempt.start` ausgelöst werden kann, liefert der Adapter eine fünf-Block-JSON-Struktur, deren kanonischer `JCS`-`SHA-256`-Digest den `SUT` definiert. Unbekannte oder nicht beobachtbare Felder müssen wörtlich als `"not_available"` geschrieben werden, niemals ausgelassen oder geraten:

| Fingerabdruck-Block | Erforderliche Felder (nicht verfügbare Werte wörtlich als `"not_available"` geschrieben) |
| :--- | :--- |
| **`model`** | `provider`, `model_id`, `snapshot_date`, `weights_sha256`, `quantisation`, `tokenizer_hash`, `chat_template_hash`, `context_window`, `system_fingerprint` |
| **`serving`** | `engine`, `version`, `commit`, `binary_hash`, `flags_hash` (`cache_prompt`, `slots`, `batch_invariance`, `TP`), `drivers`, `devices` |
| **`sampling`** | `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `stop`, `reasoning_effort`, `tool_choice` |
| **`harness`** | `name`, `version`, `commit`, `binary_hash`, `prompt_hash`, `tools_hash`, `context_policy`, `internal_voting`, `sub_agents`, `config_hash` |
| **`envelope`** | `hardware`, `os_kernel`, `isolation_tier`, `cgroup_limits`, `cpuset`, `network_policy`, `ceilings`, `telemetry_config_hash` |

**Sitzungs-Entwertung und Start-/End-Canaries.** Jeder geänderte Block-Digest bei `session.close`, jede `MCP`-`tools/list_changed`-Benachrichtigung, ein Neustart der Inferenz-Engine, ein `NVML`-Zähler-Reset, ein geändertes Echo von `model` oder `system_fingerprint` innerhalb der Sitzung oder eine `OS`/Treiber-Aktualisierung markiert **jeden Beleg in der Sitzung als `void`**. Void-Belege verbleiben im öffentlichen Archiv zur Auditierbarkeit, werden jedoch von der Benchmark-Platzierung ausgeschlossen. Da ein Cloud-Provider Gewichte oder Quantisierung hinter einer festen `model_id` austauschen kann, ohne `system_fingerprint` zu aktualisieren, umklammert jede Sitzung die Evaluation zusätzlich mit einem deterministischen Canary, das bei `session.open` und `session.close` ausgeführt wird.

<div id="43-mandatory-c1c12-adapter-conformance-suite" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Verpflichtende Konformitätssuite für Adapter (`C1-C12`)

Kein Adapter und kein Harness gelangt in die Evaluation, bevor alle zwölf Konformitätsprüfungen (`C1` bis `C12`) bestanden sind:

| Prüfpunkt | Anforderung für das Bestehen |
| :--- | :--- |
| **`C1` Bundle-Round-Trip** | Der Adapter gibt den exakten `JCS`-`SHA-256`-Digest des Eingabe-Task-Bundles zurück. |
| **`C2` Abgabepfad** | Der externe `Verifier` erhält exakt die Bytefolge, die im Terminal-Capture von `satb-proxy` / `MCP` protokolliert wurde. |
| **`C3` Verweigerungspfad** | Eine angewiesene Verweigerung trifft sauber als `refuse` ein (`sub_reason = "other"`, `completion_score = 0`). |
| **`C4` Ein Terminal-Aufruf** | Tool- oder Terminal-Aufrufe, die nach dem ersten `submit` oder `refuse` ausgegeben werden, werden ignoriert und gezählt. |
| **`C5` Kein Orakel** | `Verifier`- und `satb-supervisor`-Verzeichnisse, Sockets und übergeordnete Pfade (`..`) sind von `/work` aus nicht erreichbar. |
| **`C6` Egress** | Für Modelldatenverkehr ist nur `satb-proxy` (`127.0.0.1:<port>`) erreichbar; `/work`-Subprozesse haben keinen externen Netzwerkzugriff und keine upstream-`API`-Schlüssel. |
| **`C7` Usage vorhanden** | Jeder Modellaufruf trägt `usage` (fehlend -> `killed(usage_missing)`); die Token-Summen des Proxys stimmen exakt mit den Zählwerten der upstream-Engine überein. |
| **`C8` Fingerprint stabil** | Der fünfblockige `SUT`-Fingerprint `SHA-256` ist vor und nach einem Dry Run mit 3 Versuchen identisch. |
| **`C9` Harness-Replay** | Das Wiederabspielen aufgezeichneter `satb-proxy`-Antworten reproduziert ein byteidentisches Transkript (`0` Byte-Abweichungen; verpflichtend für `Lane B`). |
| **`C10` Abbruchpfad** | Ein außer Kontrolle geratener Prozessbaum in `/work` (einschließlich losgelöster Kindprozesse) wird in `< 2,000 ms` beendet und als `killed` protokolliert. |
| **`C11` Telemetrie-Handshake** | Rootless-`L3`-Prozesszähler (`cgroup v2` oder `proc_pid_rusage`) sind lesbar, Phasenmarker treffen ein, und der Offset zwischen monotoner und Wanduhr-Zeit wird protokolliert. |
| **`C12` Determinismus-Probe** | `8` identische Anfragen werden ausgeführt, und die Anzahl unterschiedlicher Ausgaben wird als empirische Eigenschaft des `SUT` erfasst. |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. Fünfstufige Telemetrie-Zuordnung (`L0-L4 × A1-N`), Plattform-Kanal-Karten und was nicht zugeordnet werden kann

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="Fünfstufige Telemetrie-Zuordnungsgrenzen L0 bis L4 gekreuzt mit den Bezeichnungen A1 bis N und der siebenschrittigen Raw-First Summen-Prüfungspipeline." />
  <figcaption>Abbildung 2. Links: physikalische und logische Telemetrieniveaus <code>L0</code>-<code>L4</code> abgebildet auf Zuordnungsbezeichnungen <code>A1</code>-<code>N</code>. Rechts: siebenschrittige Raw-First Zähler-Disziplin, die Vor-/Nach-Baseline-Drift-Grenzen durchsetzt (<code>Falsifier 6</code>) und die <code>Step 7</code> Summenprüfung.</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Telemetrie-Grenzen (`L0-L4`) und Zuordnungsbezeichnungen (`A1-N`)

Energie- und Aktivitätssensoren befinden sich an fünf unterschiedlichen Grenzen, die physikalisch verschiedene Größen messen und niemals summiert oder vermischt werden dürfen:

| Stufe | Physikalische / logische Grenze | Repräsentative Sensoren | Was der Kanal ehrlich zuordnen kann |
| :--- | :--- | :--- | :--- |
| **`L0` wall** | `AC` an der Wandsteckdose | Smart Plug oder `PDU` (`Shelly` `apower`, `aenergy`; `Yokogawa`-Analysator) | Gesamtes Gerät einschließlich `PSU`-Umwandlungswärme, Lüfter, `DRAM` und `NVMe`; `~1 s` Takt. |
| **`L1` platform** | `DC`-Eingangschiene des Boards | `Jetson Thor INA238`-Träger; `Mac sys_power`; `RAPL psys` | Gesamter Rechner auf der `DC`-Seite stromabwärts des Netzteils oder `PSU`. |
| **`L2` package / SoC** | `CPU`-Gehäuse, `GPU`- und `SoC`-Schienen | `RAPL pkg`; rootless `macmon IOReport`; `Thor INA3221`; `amdgpu hwmon`; `NVML` kumulative Energie (`mJ`) | Gesamtes `SUT` auf `SoC` (`A2`) oder Inferenz-Engine allein, wenn eine Schiene physikalisch exklusiv ist (`A1`). |
| **`L3` process / cgroup** | Einzelner `OS`-Prozessbaum | `Linux cgroup v2` (`cpu.stat`, `memory.peak`, `io.stat`), `perf`; `macOS proc_pid_rusage` `ri_energy_nj` | Anteile der Ressourcenaktivität (`C`) oder das eigene interne prozessbezogene Energiemodell des `OS`-Kernels (`D`). |
| **`L4` logical** | Das Modell-/Werkzeug-Gespräch | `satb-proxy`-Tokenzählungen und Aufruflatenzen; Harness-Durchgänge, Werkzeugaufrufe und `ContextRule_v0`-Auslassungen | Exakte Zählungen auf jedem `SUT` ohne Ausnahme, einschließlich geschlossener Cloud-`API`s. |

Jeder Energiewert in einer Quittung trägt eine der sieben Zuordnungsbezeichnungen:

- **`A1` (Exklusive physikalische Versorgungsschiene)**: Ein Hardware-Sensor für eine Versorgungsschiene, der während des Messfensters ausschließlich von einer Partition berührt wird (z. B. `Jetson Thor INA3221 ch1 VDD_GPU`, wenn nur die lokale Inferenz-Engine Zugriff auf das `GPU`-Gerät hat).
- **`A2` (Dediziertes Gesamtsystem-Messgrenze)**: Ein Zähler für die gesamte Maschine (`L0`/`L1`) oder das gesamte Package (`L2`) auf einer ruhenden, dedizierten Maschine (`SUT` zuzüglich des Leerlauf-Grundlastniveaus des `OS`). **Gemäß `OQ-4` ist die rohe Gesamtenergie des gesamten `SUT` über das Messfenster bei `A2` die primäre physikalische Energiemetrik für die Platzierung.** Dadurch wird verhindert, dass schlanke Modelle ungezählte Brute-Force-Suchen in `/work`-Subprozesse auslagern, und dass die Subtraktion `active - idle` langsame Läufe begünstigt.
- **`B` (Zeitliche Phasenaufteilung)**: Differenzen von Zählerständen über nicht überlappende Zeitfenster, die durch aufeinanderfolgende Phasenmarkierungen abgegrenzt werden (`model_call` vs. `tool_call` in `Lane B`).
- **`C` (Proportionaler Anteil, das `Kepler`-Modell)**: Ein gemeinsam genutzter Hardware-Zähler, der anteilig nach $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ oder nach der `GPU`-Auslastung aufgeteilt wird, wenn parallele Prozesse sich überlappen (`Lane O` `Shape H`).
- **`D` (Vom `OS` modellierte Schätzung)**: Das interne prozessbezogene Energiemodell des Kernels (`macOS ri_energy_nj`). Es isoliert einen Prozessbaum von `CPU`-Mitbewohnern, bleibt jedoch ein Firmware- bzw. Kernel-Modell und keine physikalische Messung über einen Shunt-Sensor.
- **`P` (Vom Anbieter bescheinigt)**: Eine pro Anfrage von einem Cloud-Anbieter zurückgegebene Energiezahl des Servers, zusammen mit der wörtlich angegebenen Messmethodik des Anbieters.
- **`N` (`not_available`)**: Nicht beobachtet und **niemals geschätzt**.

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Siebenschrittige Zählerdisziplin, rootlose Erfassung (`OQ-5`) und Plattformabbildungen

`satb-meter` verarbeitet jeden Versuch in sieben geordneten Schritten:
1. **Kumulative Zähler an jeder Ereignisgrenze lesen** (`attempt.start`, jeder `model_call` und `tool_call`, `attempt.close` sowie ein Referenz-Tick von `100 ms`), sodass die Fensterenergie eine exakte Zählerdifferenz $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$ ist.
2. **Rohkanäle zuerst schreiben**: Grenze, Sensor, Start- und Endwerte, Zählerüberläufe und Anzahl der Abtastwerte erfassen; Fenster, die kürzer als `10` Sensorperioden sind, als `"below_resolution"` markieren und fehlende Hardware als `"not_available"` kennzeichnen.
3. **Sequentielle Phasen (`B`) aufteilen**: In `Lane B` überlappen sich Modellinferenz und `/work`-Tool-Aufrufe niemals; parallele `Lane O`-Harnesses reduzieren die Phasenaufteilung auf `C` oder `N`.
4. **`engine_resident_during_tools` isolieren**: Während ein `/work`-Tool läuft, hält ein lokaler Modellserver (`llama-server`, `vLLM`) die Gewichte auf `GPU`/`DRAM` resident. Seine Leerlaufleistung während des Tool-Fensters wird unter `engine_resident_during_tools` verbucht und weder der aktiven Modellinferenz noch der Tool-Ausführung zugeschlagen.
5. **Aufteilung nach Proportion (`C`) nur dort, wo Partitionen sich überlappen**: Verhältnisse von $\Delta \text{CPU}$ werden ausschließlich als Charakterisierungs-Fallback angewendet, wobei anerkannt wird, dass `C`-Zustände, Turbo-`DVFS` sowie `DRAM`- und Speicher-Stalls die Proportionalitätsannahme verletzen.
6. **Baselines als abgeleitete Kanäle speichern**: Sitzungen werden durch Ruhe-Baselines vor und nach der Resident-Phase eingerahmt; weicht die Ruheleistung vor und nach der Messung um mehr als `5.0%` ab (`Falsifier 6`), werden abgeleitete Netto-über-Leerlauf-Werte verworfen, während die Rohkanäle unverändert erhalten bleiben.
7. **Summenprüfung ausführen (`Falsifier 2`)**: Es wird geprüft, ob die abgeleiteten Phasenkomponenten innerhalb eines Sensorquantums (`1 mJ`) zur rohen Versuchs-Zählerdifferenz aufsummieren; ist dies nicht der Fall, wird die abgeleitete Aufteilung verworfen und nur der Rohkanal beibehalten.

**Regel zur rootlosen Erfassung (`OQ-5`).** Benchmarks dürfen die Orchestrierung des `SUT` niemals als `root` ausführen. Unter `macOS` verwendet `satb-meter` ein rootloses `macmon` (`IOReport`-Abonnement) sowie `libSystem` `proc_pid_rusage(RUSAGE_INFO_V6)`, niemals `sudo` oder `powermetrics`. Unter `Linux` (wo `/sys/class/powercap/intel-rapl` seit Kernel `5.10` infolge von `PLATYPUS` nur noch für `root` lesbar ist) gewährt eine einmalige `udev`-Regel durch einen Administrator den Lesezugriff für eine dedizierte Gruppe `satb-meter`, die **ausschließlich die `UID` von `satb-supervisor`** enthält. Dadurch wird sichergestellt, dass `/work`-Sandbox-Prozesse weder über Seitenkanäle `RAPL` auslesen noch ihren eigenen Energiezähler lesen können:

| Zielplattform | `L0` / `L1` Gesamtsystem-Kanäle | `L2` Paket- / `SoC`-Kanäle | `L3`-Prozess- & `L4`-logische Kanäle | Status der Schlüsselverifikation |
| :--- | :--- | :--- | :--- | :--- |
| **Apple Silicon Mac** (`M5 Max` verifiziert) | `L0`: `Shelly` `PDU` (`not_available`, falls nicht angeschlossen); `L1`: `macmon sys_power` (`reported_j`) | `macmon IOReport`: `chip_power`, `cpu_power`, `gpu_power`, `ane_power`, `ram_power` (`reported_j`) | `L3`: `proc_pid_rusage` `ri_energy_nj` (`D`), `ri_instructions`, `ri_diskio_*`; `L4`: `satb-proxy` | Rootless `L1`-`L4` live auf `Apple M5 Max` verifiziert; `L0`-Anbindung offen. |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`, `Linux x86-64` verifiziert) | `L0`: `Shelly` `PDU` (`not_available`, falls nicht angeschlossen); `L1`: `cros_ec` (`0` Leistungsattribute) | `RAPL package-0` & `core` (`0440 root:energy` `udev`) `reported_j` + `amdgpu` `PPT` `power1_input` (`0444`; `energy1_input` fehlt) | `L3`: `cgroup v2` / `getrusage` (`C`-Aktivitätsanteile); `L4`: `satb-proxy` | Live verifiziert (`0440 root:energy` `PLATYPUS`-Isolation; `amdgpu PPT` `0444`). |
| **Intel Raptor Lake** (`Core i9-13900H`, `Linux x86-64` verifiziert) | `L0`: `not_available`; `L1`: `RAPL psys` (`intel-rapl:1/energy_uj`, `0444` `reported_j`) | `RAPL package-0`, `core` & `uncore` (`MSR` + `MMIO` `energy_uj`, `0444` `reported_j`) | `L3`: `cgroup v2` / `getrusage` (`C`-Aktivitätsanteile); `L4`: `satb-proxy` | Live verifiziert (`0 µJ`-Rest bei `Step 7` über `psys` `L1` und `package-0` `L2`). |
| **NVIDIA Jetson AGX Thor** (`Linux aarch64` Tegra verifiziert) | `L1`: `TI INA238` (`hwmon6` `VIN`, `0444` `measured_j`) + `INA3221 ch3 VIN_SYS_5V0` (`0444` `measured_j`) | `INA3221 ch1 VDD_GPU` (`0444` `measured_j`, `A1` bei exklusiver Nutzung); `ch2 VDD_CPU_SOC_MSS` (`0444` `measured_j`); `NVML` (`unverifiziert`) | `L3`: `cgroup v2` / `getrusage` (`C`-Aktivitätsanteile); `L4`: `satb-proxy` | Live verifiziert (`INA238` + `INA3221 ch1-ch3` `0444` rootless; GPU-`NVML` offen unter Co-Tenant-Sperre). |
| **Geschlossene Cloud-`API`** (`Anthropic`, `xAI`, `Cerebras`, `OpenAI`, `Google`) | Lokal nur `L0`-`L1` des Client-Hosts gemessen (von der Serverinferenz ausgeschlossen) | Remote-Server `L2`: strikt **`N` (`not_available`)** oder pro Anfrage **`P`** (`OQ-6`) | Lokal `/work` `L3` (`D`/`C`) für Sandbox-Werkzeuge; `L4`: **exakte** `satb-proxy`-Tokens, Aufrufe, `USD` | Live verifiziert über `Anthropic`, `Cerebras` und `xAI` via `satb-proxy`. |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Acht Fallstricke bei Hardware-Messungen und sieben nicht zuordenbare Größen

Standard-Power-Mess-Abkürzungen versagen systematisch bei modernen `SoC`s und `GPU`s:

| Hardware-Telemetrie-Problem | SATB-Abhilfe |
| :--- | :--- |
| **Leerlaufleistung schwebt mit Die-Temperatur, Lüftern, `DVFS` und Turbo** | Warten Sie auf die Abkühlung der `GPU` (`<= 1.5 W`), umschließen jedes Fenster mit Vor-/Nach-Baseline, protokollieren Sie die Spitzen-`GPU`-Temperatur und ungültig machen abgeleitete Netto-Joule bei einem Drift von über `5.0%` (`Falsifier 6`). |
| **Mehrdeutigkeit zwischen kaltem-Maschinen-Leerlauf und gewichts-residentem Leerlauf** | Messen und kennzeichnen Sie beide explizit in `Step 6` statt stillschweigend eines zu subtrahieren. |
| **`Active - idle` Subtraktion begünstigt langsame Durchläufe** | Die rohe Fensterenergie des gesamten `SUT` (`A2`) bleibt die primäre Platzierungszahl (`OQ-4`). |
| **Teilperioden-Fenster werden als null, negativ oder Quantisierungsrauschen gelesen** | Markieren Sie jedes Fenster, das kürzer ist als `10` Sensor-Perioden als "below_resolution" (z.B. `< 1.2 s` bei `~8 Hz` `macmon` oder `< 10 s` bei einem `1 Hz` Smart-Plug). |
| **Hochfrequente Telemetrie-Sampler verbrauchen erhebliche `CPU`-Leistung** | Lesen Sie kumulative Zähler an Ereignisgrenzen (`0.011 mW` bei `0 Hz`) zuzüglich eines `100 ms` Taktes; protokollieren Sie die `observer_only`-Baseline. |
| **`NVML` Sofort-Leistungsmessung auf `A100`/`H100` erfasst nur `~25%` der Laufzeit** | Lesen Sie den kumulativen `nvmlDeviceGetTotalEnergyConsumption` (`mJ`), niemals sofortiges Polling von `nvmlDeviceGetPowerUsage` (Chung et al.; Yang et al.). |
| **Externer `L0` Wandstecker läuft mit einer unsynchronisierten Uhr** | Senden Sie einen deterministischen Kalibrier-Lastimpuls mit `50%`-Tastverhältnis bei `session.open` und `session.close` und führen Sie eine Kreuzkorrelation der Zeitstempel durch. |
| **Gemeinsame-Host-Hintergrund-Daemons oder Co-Mandanten-Jobs** | Protokollieren Sie die Prozessliste, reduzieren Sie gemeinsam genutzte `L2`-abgeleitete Subtraktionen via `Falsifier 6` und erfassen Sie das co-Mandanten-isolierte `L3` `ri_energy_nj` (`D`) zusammen mit dem rohen `L2`. |

Folglich können **sieben Größen nicht ehrlich zugeordnet** werden und sind von `SATB`-Behauptungen ausgeschlossen: (1) unbelegte geschlossene `API`-Server-Energie (`N` oder `P` nur); (2) genaue pro-Prozess-physikalische Joule auf einem gemeinsamen `SoC` oder einheitlichen-Speicher-Schiene (`C` und `D` sind Modelle); (3) Modell-Gewichte isoliert von Servier-Kernels, Quantisierung, Batching und Silizium; (4) Eigentum des `OS`-Leerlauf-Floor und `DRAM`-residenter Gewichts-Leistung (als eigenständige Kanäle gemeldet); (5) einzelne Ereignisse kürzer als die Sensor-Periode (wie ein `30 ms` Werkzeugaufruf unter einem `1 s` Plug); (6) geteilte Cloud-`VM`s ohne Host-Hardware-Zähler; und (7) stille Mittel-Sitzungs-Provider-Gewichts-Swaps (gekennzeichnet durch Start/End-Canaries, nie a priori ausgeschlossen). Insbesondere (`OQ-6`) sind **Anbieter-Nachhaltigkeits-Offenlegungen Flotten-Medianwerte statt pro-Anfrage-Messungen und werden niemals in einen `SATB`-Beleg aufgenommen**, einschließlich Googles `0.24 Wh` Median `Gemini Apps` Prompt, OpenAI`s `0.34 Wh` Zahl (veröffentlicht ohne Methodik) und Mistrals `1.14 gCO2e` pro `400`-Token-Antwort.

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. Gemessene Konformanz-, Determinismus-, Beobachtereffekt- und Multi-Host-Zuordnungsergebnisse

Um ungemessene Designannahmen durch auditierbare Belege zu ersetzen, führten wir die vollständige `SATB`-Konformanzsuite und den Falsifikator-Harness (`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`, Gesamtlaufzeit `175.69 s`) auf einer `Apple M5 Max`-Workstation (`arm64`, `128 GB` einheitlicher Speicher, `macOS 27.2.1`, `macmon 0.12.0`) aus, neben einer `188`-Fenster umfassenden Cross-Study-Audit.

<div id="61-c1c12-conformance-c9-deterministic-replay-and-c10-process-tree-cleanup" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Konformität `C1-C12`, deterministische Wiedergabe `C9` und Bereinigung des Prozessbaums `C10`

Alle **`12 / 12` Rust-Referenzkonformitätsprüfungen** (`dnull_cli satb-conformance`) sowie alle erweiterten Betriebssystemprüfungen wurden bestanden:

- **Bundle-, Terminal-, Einschluss- und Fingerprint-Prüfungen (`C1`-`C8`, `C11`)**: `C1` meldete den kanonischen Bundle-Digest `455e941f51f8ffef` zurück; `C2` lieferte Byte-genaue `submit`-Nutzlasten über `satb-proxy` an `Verifier` aus; `C3` ordnete leere bzw. angewiesene Verweigerungen `refuse:other` zu; `C4` ignorierte nachfolgende Tool-Aufrufe nach `submit` (`ignored_trailing_calls = 1`); `C5` blockierte `../`-, `/etc/passwd`- und `verifier_oracle/*`-Ausbrüche; `C6` entfernte Proxy- und Credential-Umgebungsvariablen innerhalb von `/work` (`NP=*|HTTP=`), während nicht gelistete Proxy-Pfade `HTTP 404` lieferten; `C7` brach Antworten ohne Usage-Angaben sofort als killed(usage_missing) ab; `C8` bewahrte den byteidentischen Fünf-Block-Fingerprint `8b741c27bf364e5d` über Probeläufe hinweg, während simulierte `system_fingerprint`-Wechsel mit `session_void = true` markiert wurden; und `C11` verifizierte die Sichtbarkeit der rootless `RUSAGE_INFO_V6`-Zähler (`sudo_invoked = false`).
- **Erweiterte `C9`-Wiedergabe mehrstufiger `ContextRule_v0`- und `Truncate_v0`-Verläufe**: Über eine Trace-Sequenz mit `14` Runden, die pro Runde `24 KiB` rohe Dateilesezugriffe erzeugte (`14` Ausgaben, durch `Truncate_v0` auf `8.192 B + 8.192 B` gekürzt), innerhalb eines `48.000`-Token-Fensters (`80%`-Schwelle = `38.400` Token), eliminierte `ContextRule_v0` deterministisch die **`5` ältesten Tool-Ausgaben** mit **`0` zusätzlichen Modellaufrufen** und erzeugte ein kanonisches Transkript von `149.747` Byte (`SHA-256` `d697ed1476129939...`) mit **`0` Byte-Unterschieden** über unabhängige `/work`-Wiederholungen. Die Wiederholung des identischen Traces unter einem engen `16.000`-Token-Fenster, in dem `8` beibehaltene `16 KiB`-Ausgaben `100%` überschreiten, löste deterministisch `killed(context_ceiling)` aus.
- **Erweiterte `C10`-Bereinigung nach `SIGKILL` bei mehreren Prozessen (Spezifikationsobergrenze `< 2,000 ms`)**: Über `5` Durchläufe, in denen ein `4`-Prozess-Baum gestartet wurde (`sh`-Elternprozess plus `3` losgelöste Python-Sleeper im Hintergrund in einer isolierten Prozessgruppe), wurden Zustellung von `SIGKILL` und Reaping durch den Kernel im **Mittel `2.073 ms`** abgeschlossen (Minimum `1.429 ms`, Maximum `2.571 ms`, **`778×` unterhalb** der Obergrenze von `2.000 ms`) mit **`0` überlebenden `PID`s** und dem Ergebnis `killed(wall_ceiling)`.

<div id="62-live-c12-eight-request-determinism-probes-across-four-model-substrates" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Live `C12` acht-Anfrage-Determinismus-Tests über vier Modell-Substrate

Routing von `8` identischen algebraischen Synthese-Anfragen pro Modell (`32` Live-Cloud-Aufrufe plus `8` lokale `Shape D`-Durchläufe) durch `satb-proxy` verifiziert `100%` exakte `C7` Token-Zähl-Parität (`32/32` Aufrufe) und offenbarte drei unterschiedliche Determinismus-Regime:

| `SUT` / Endpunkt über `satb-proxy` | `temperature = 0` Vorprüfung | Aufgezeichnete `sampling.temperature` | Unterschiedliche Rohausgaben (`/ 8`) | Unterschiedliche algebraische Formen (`/ 8`) | `system_fingerprint` | Mittlere Latenz |
| :--- | :---: | :--- | :---: | :---: | :--- | ---: |
| **`Shape D`: `dnull N1`** (Rust lokal) | `Exact i64` | `0 (exact_i64_q1e6)` | **`1 / 8`** | **`1 / 8`** | `0da4df8d9ccbce1e…` | `1,474.0 ms` |
| **`Anthropic claude-opus-5-5`** | **`HTTP 400`** | `not_available` (deprecated) | **`8 / 8`** | **`4 / 8`** | `not_available` | `3,389.1 ms` |
| **`Anthropic claude-sonnet-5-5`** | **`HTTP 400`** | `not_available` (deprecated) | **`8 / 8`** | **`2 / 8`** | `not_available` | `2,914.3 ms` |
| **`Cerebras gpt-oss-120b`** | `HTTP 200` | `0.0 (seed=42)` | **`2 / 8`** | **`2 / 8`** | `fp_fd4dff7eed92aaf38281` | `484.2 ms` |
| **`xAI grok-4.20-0309-non-reasoning`** | `HTTP 200` | `0.0 (seed=42)` | **`8 / 8`** | **`1 / 8`** | `fp_9974b11849` | `942.7 ms` |

1. **Provider-Deprecation von `temperature = 0`**: Sowohl `claude-opus-5-5` als auch `claude-sonnet-5-5` verwiesen `"temperature": 0.0` mit **`HTTP 400` (`"`temperature` is deprecated for this model."`)** ab, wodurch empirisch die Regel von `SATB` bestätigt wird, dass nicht verfügbare Sampling-Steuerungen zu `"not_available"` normalisiert werden müssen, anstatt stillschweigend als Null angenommen zu werden. Über `8` identische Aufrufe emitierte `claude-opus-5-5` (`1,047` adaptive thinking-Tokens) `8` unterschiedliche Rohtexte, die `4` algebraisch verschiedene Bitvektor-Identitäten umfassten (`(x | y) - (x & y)`, `(x | y) & ~(x & y)`, `(x & ~y) | (~x & y)`, und `(x + y) - ((x & y) + (x & y))`).

2. **Restlicher Nicht-Determinismus bei `temperature = 0, seed = 42`**: Selbst wenn `temperature = 0.0` und `seed = 42` akzeptiert wurden (`HTTP 200`) mit einem stabilen `system_fingerprint`, erzeugte `Cerebras gpt-oss-120b` (`2,976` reasoning-Tokens) `2` unterschiedliche Ausgaben über `8` identische Aufrufe, während `xAI grok-4.20-0309-non-reasoning` über alle `8` Aufrufe auf `1` algebraische Formel (`(x | y) & ~(x & y)`) stabilisiert blieb, jedoch seinen Prosa-Beweis-Satz in allen `8/8` Antworten variierte. Die Trennung von **Harness-Determinismus gegeben aufgezeichneten Reaktionen (`C9`)** von **gemessener `SUT`-Ausgabestreuung (`C12`)** ist daher wesentlich.

<div id="63-falsifier-5-observer-effect-benchmark-across-telemetry-cadences-10-s-windows" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Falsifikator 5: Beobachtereffekt-Benchmark über Telemetrie-Kadenz (`10 s`-Fenster)

Messung der kombinierten Sampler-(`Python` + Kind-`macmon`-`IOReport`-Pipe) `CPU`-Zeit, des `L3`-`ri_energy_nj` (`observer_only`-`reported_j`) sowie des gesamten-`SoC`-`L2`-`reported_j` über verschachtelte `10,0 s`-Fenster auf `Apple M5 Max` quantifizierte den exakten Beobachter-Overhead:

| Sampling-Kadenz | Erreichte Rate | Sampler-`CPU`-Zeit / `10 s` | Beobachter-`L3`-`reported_j` | Beobachter-Leistung (`mW`) | Anteil am `L2`-Fenster | Gesamtes-`SoC`-`L2`-Fenster (`reported_j`) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`0 Hz`-Grenzfall** (`2` `rusage`-Systemaufrufe) | `0.20 Hz` | **`0.004 ms`** | **`0.000108 J`** | **`0.011 mW`** | **`0.0000%`** | `-` (kein `IOReport`-Daemon) |
| **`1 Hz` (`1.000 ms`-Tick)** | `0.90 Hz` | `9.323 ms` | `0.194237 J` | `19.371 mW` | `0.0521%` | `372.769 J` (`37.17 W`) |
| **`10 Hz` (`100 ms`-`SATB`-Referenztick)** | `8.12 Hz` | `36.434 ms` | `0.666596 J` | **`66.439 mW`** | **`0.1770%`** | `376.603 J` (`37.53 W`) |
| **`100 Hz` (`10 ms`-Stress-Falsifikator)** | `7.44 Hz` | `35.636 ms` | `0.598721 J` | `58.971 mW` | `0.1618%` | `369.926 J` (`36.44 W`) |

Zwei Hardware-Fakten ergeben sich unmittelbar aus dieser Messung:
1. **Vernachlässigbare Störung (`< 0,18 %`)**: Grenzfall-`proc_pid_rusage`-Lesevorgänge verbrauchen `108 µJ` (`0,011 mW`), **`6.040×` weniger Leistung** als `10 Hz`-`IOReport`-Polling (`66,44 mW`), und selbst der `100 ms`-Referenztick entspricht lediglich **`0,177 %`** der gesamten-`SoC`-Fensterenergie (`0,76 %` Gesamt-`L2`-Fensterdifferenz zwischen `-i 10` und `-i 1000`, wodurch `Falsifikator 5` geklärt wird).
2. **`IOReport`-Abonnement-Kadenz-Obergrenze (`~8 Hz`)**: Die Anforderung von `-i 10` (`100 Hz`) von `macmon 0.12.0` erreichte **`7,44 Hz`** (`75,5` Proben in `10,15 s`), da jeder rootless-`IOReport`-Abonnementzyklus im macOS-User-Space für `~120 ms` blockiert. Folglich entspricht die `10`-Perioden-`below_resolution`-Untergrenze aus Schritt 2 physikalisch **`~1,2 s`** auf `macmon`-`L2`-Fenstern, während subsekündige Operationen auf `0 Hz`-Grenz-`L3`-`ri_energy_nj`-Zähler oder gebündelte Fenster angewiesen sind.

<div id="64-falsifier-3--step-7-b-temporal-boundary-vs-c-proportional-kepler-attribution" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Falsifikator 3 & Schritt 7: `B`-zeitliche Grenze vs. `C`-proportionale (`Kepler`-)Attribution

Über `3` Replikate auf `Apple M5 Max` führte ein einzelnes `SUT` zuerst **Phase 1** aus (`2.50 s` ALU-intensiver `SHA-256`-Digest-Burst: `29.27 ms` mittlere `CPU`-Zeit, `38.63 mJ` pro `CPU`-ms), anschließend sequenziell **Phase 2** (`2.51 s` `192 MiB` `DRAM`-Cache-Miss-Sweep mit synchronen `fsync`-Plattenschreibvorgängen und `8 ms` `I/O`-Wartezeiten: `15.94 ms` mittlere `CPU`-Zeit, `27.73 mJ` pro `CPU`-ms), parallel zu einem stetig im Tastverhältnis laufenden Hintergrund-Worker.

| Attributionsprüfung (`n = 3` sequenzielle Zwei-Phasen- + Mitläufer-Replikate) | Phase 1 (`Compute` `2.50 s`) | Phase 2 (`DRAM + fsync-I/O` `2.51 s`) | Falsifikator- / Step-7-Befund |
| :--- | ---: | ---: | :--- |
| **Exakte `B`-zeitliche Grenze `L3`-Delta (`reported_j`)** | `1.1272 J` (`1,127,172 µJ`) | `0.4433 J` (`443,317 µJ`) | **`Step 7`-Residuum `<= 1 µJ` (`3/3` bestanden)** |
| **`C` (`Kepler` $\Delta\text{CPU}$-Anteil: `64.58%` vs. `35.42%`) auf `L3`** | `1.0145 J` (`-10.00%`) | `0.5560 J` (**`+25.21%` mittlerer Fehler**) | `DRAM`-/Stall-Energie/ms $\ne$ `ALU`-Energie/ms |
| **Exakte `B`-zeitliche `L2`-Fenster des gesamten `SoC` (`reported_j`)** | `82.246 J` | `90.975 J` | `DRAM`, `NVMe` und Host-Leistungsaufnahme bleiben in der `I/O`-Wartezeit bestehen |
| **`C` (`Kepler`-$\Delta\text{CPU}$-Anteil), angewendet auf das `L2`-Fenster** | `111.758 J` (**`+35.86%` Fehler**) | `61.464 J` (**`-32.59%` Fehler**) | **`Falsifikator 3` ausgelöst (`> 20%` Fehler)** |

Während die Summenprüfung von `Step 7` unter `B`-Zählerdifferenzen über alle Versuche (`100.0%` der Durchläufe) im Bereich `0-1 µJ` blieb, überbewertete die CPU-zeitproportionale Attribution (`C`) den Compute-Burst um **`+35.86%`** und unterbewertete die Speicher- und `fsync`-Phase um **`-32.59%`** auf dem geteilten `L2` (und wich selbst auf dem prozessbezogenen `L3` um **`25.21%`** ab). Damit wird empirisch bestätigt, weshalb `SATB` `C` auf überlappende parallele Harnesses (`Shape H`) beschränkt und sequenzielle Abweichungen von `> 20%` über `Falsifikator 3` kennzeichnet.

<div id="65-multi-session-falsifier-6-audit-188-windows-and-falsifier-8-harness-floor-check" class="anchor-alias" aria-hidden="true"></div>

### 6.5 Mehrsitzungs-Audit von `Falsifier 6` (`188` Fenster) und Prüfung der Harness-Untergrenze von `Falsifier 8`

Die Prüfung von **`188` realen `L2`-`IOReport`-Fenstern**, die in drei Experimentierkampagnen auf dem gemeinsam genutzten Host `Apple M5 Max` sowie in zwei gepaarten Auswertungen von `Lane B` gegen `Shape H` (`Claude Code 2.1.330`) erhoben wurden, bestätigt beide Schutzmechanismen auf Sitzungsebene:

1. **Baseline-Drift-Audit von `Falsifier 6` (`188` Fenster)**: In `exp-001` (`11` Fenster: `1` innerhalb von `5.0%`, `10` mit Drift von bis zu `44.5%`), in `exp-002` sowie im Mehrrundenlauf (`7` Fenster: `2` innerhalb von `5.0%`, der `dnull`-Batch mit `1.190` Instanzen mit `3.09%` Drift und `BigCodeBench` mit `Qwen 3.6` mit `1.02%` Drift, sowie `5` Fenster mit `12.16%-65.11%` Drift unter gleichzeitiger `yosys-abc`-Synthese) und in `ai-reads-human` (`170` Fenster bei `loadavg_1m = 12.92`: `61` innerhalb von `5.0%`, `109` mit Drift) behielten **`64 / 188` Fenster (`34.04%`)** ein gültiges `derived_marginal_j`, während **`124 / 188` (`65.96%`)** die Subtraktion der Netto-Leistung über dem Leerlauf automatisch ungültig machten, ohne dass auch nur ein einziger roher `L2`-Messwert oder pro-`PID`-`L3`-`reported_j`-Messwert verloren ging (`188 / 188 = 100.0%` Erhaltung der Rohdaten).
2. **`Falsifier 8` (`Lane B` gegen `Shape H` `Claude Code 2.1.330`)**: Über `24` gepaarte `/work`-Bündel für formale Prüfungen und `SQLite`-Richtlinien erreichte `Lane B` sowohl mit `Claude Opus 5.5` (`44` Modellaufrufe, `63.568` Prompt- und Cache-Tokens, `\$0.5477`) als auch mit `Claude Sonnet 5.5` (`43` Aufrufe, `60.284` Tokens, `\$0.3413`) jeweils **`24 / 24` (`100.0%`)**. Damit entspricht `Lane B` dem Ergebnis von `Shape H` (`Claude Code 2.1.330`: **`24 / 24`**, `89` Aufrufe / `218.449` Tokens bei `Opus 5.5`; `83` Aufrufe / `196.128` Tokens bei `Sonnet 5.5`), reduziert jedoch den Verkehr an Prompt- und Cache-Tokens um **`3.44×` bzw. `3.25×`**. Auf `6` bisher ungesehenen, mehrdateiigen Python-Repositories zur Fehlerbehebung (`config-defaults`, `interval-merge`, `pagination`, `precedence`, `rate-window`, `retry-backoff`) erreichte `Lane B` erneut das Niveau von `Shape H` (`Claude Code 2.1.330` + `Opus 5.5`: **`6 / 6`**, `30` Aufrufe / `86.744` Tokens, `1.67×` mehr Tokens). Dazu gehörten `Lane B` mit `Opus 5.5` (`28` Aufrufe / `52.045` Tokens), mit `Sonnet 5.5` (`31` Aufrufe) und mit dem lokalen `Qwen 3.6 35B-A3B` (`42` Aufrufe / `2.342,05 J` `L2`). Dies bestätigt, dass `Lane B` **keine** verkrüppelte Harness-Untergrenze darstellt.

<div id="66-multi-platform-hardware-attribution-across-four-silicon-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 Multiplattform-Hardware-Zuordnung über vier Silizium-Archetypen

Um zu verifizieren, dass die `SATB`-Konformität, die `Shape D`-Festkomma-Determinismus, die rootless-`PLATYPUS`-Berechtigungsgrenzen und die physische Shunt-Schienen-Trennung außerhalb von `macOS` und `Apple Silicon` gelten, führten wir `run_multi_host_satb.py` (`multi_host_satb_receipts.json`) auf drei zusätzlichen `Linux`-Hardware-Archetypen neben dem `Apple M5 Max` aus:

| Hardware-Archetyp und `OS`-Kernel | Rootless-Sensor-Grenze und Evidenzklasse | `Shape D` `1M` `DNULLMM1` (`10k` Sonden) | `C9`-Wiedergabe und `C10`-`SIGKILL`-Mittelwert | Einzel-Lese-Latenz und `100 Hz` erreicht | `Step 7`-Residuum und `Falsifier 3` (`C` vs. `B`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`** (`arm64`, `128 GB`, `macOS 27.2.1`) | `IOReport` `L1`/`L2` + `rusage` `L3` (`reported_j`; `measured_j = None`) | `15027705736` (`388.43 ns` `C++`, `582.57 ns` Rust) | `149,747 B` (`0` diffs) · `2.073 ms` (`0` `PID`s) | `~120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`** Phase 2 (`+35.86%` Ph. 1) |
| **`NVIDIA Jetson AGX Thor`** (`aarch64`, `122.9 GiB`, `Linux 6.8.12-1021-tegra`) | `TI INA238` (`hwmon6` `VIN` `L1`) + `INA3221` (`hwmon5` `ch1-ch3` `L2`/`L1`, `0444` **`measured_j`**) | `15027705736` (`984.86 ns` `C -O3`, `2,489.4 ns` Py) | `149,747 B` (`0` diffs) · `9.544 ms` (`0` `PID`s) | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2` (`-67.02%` `VIN`) |
| **`Framework AMD Ryzen AI Max+ 395`** (`x86-64`, `122.8 GiB`, `Linux 7.0.0-43`) | `RAPL package-0` und `core` (`0440 root:energy` **`reported_j`**) + `amdgpu PPT` (`0444`; `measured_j = None`) | `15027705736` (`376.61 ns` `C -O3`, `1,341.7 ns` Py) | `149,747 B` (`0` diffs) · `0.868 ms` (`0` `PID`s) | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0` (`-63.34%` `core`) |
| **`Intel Core i9-13900H`** (`x86-64`, `14.7 GiB`, `Linux 7.0.0-43`) | `RAPL psys` (`L1`) + `package-0`, `core`, `uncore` (`L2`, `0444` **`reported_j`**; `measured_j = None`) | `15027705736` (`420.93 ns` `C -O3`, `863.6 ns` Py) | `149,747 B` (`0` diffs) · `1.120 ms` (`0` `PID`s) | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0` (`-73.62%` `psys`) |

Vier plattformübergreifende Hardware-Erkenntnisse ergeben sich aus diesen Live-Belegen:

1. **Bit-exakte `Shape D` und `Lane B`-Wiedergabe-Invarianz über `arm64`/`aarch64` und `x86-64`**: Alle vier Hosts erzeugten die exakte `10.000`-Sonden-`DNULLMM1`-Prüfsumme **`15027705736`**, den exakten `test.setpoint`-eingefrorenen Digest `0da4df8d9ccbce1e...4485781` sowie das exakte `149.747`-Byte-`C9`-Transkript (`SHA-256` `d697ed1476129939...`, `0` Byte Unterschiede), während sie `4`-`PID`-Ausreißer-Prozessgruppen mittels `SIGKILL` in `0,868 ms` bis `9,544 ms` (`> 200×` unter der `2.000 ms`-Spezifikationsobergrenze, selbst bei `loadavg_1m = 52,39` auf `Jetson AGX Thor`) beendeten.
2. **Physische `INA238` / `INA3221`-Shunt-Trennung und `Falsifier 6` unter live-`GPU`-Mitnutzung auf `NVIDIA Jetson AGX Thor`**: Unter `Linux 6.8.12-1021-tegra` sind sowohl `hwmon6` (`ti,ina238` bei `i2c@c600000/ina238@44`, `VIN`-Gesamtplatinen-`DC`-Eingang bei `~27,97 V`) als auch alle drei Kanäle von `hwmon5` (`ina3221@40`: `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS` und `ch3 VIN_SYS_5V0`) weltlesbar (`0444`) ohne `sudo`. Während unserer strikt `CPU`-only-Sonde (`dedicated_host = false`) hielt ein unabhängiger Mitnutzer-`llama-server` die `GPU`-Sperre des Hosts:

| `Jetson AGX Thor`-physischer Shunt-Kanal (`0444` rootless `sysfs`) | Grenze | Vor-Baseline (`W`) | Phase 1 Compute (`measured_j` / `W`) | Phase 2 `DRAM+fsync` (`measured_j` / `W`) | Nach-Baseline (`W`) | Drift (`F6`) & `Kepler` `C` Phase-2-Fehler |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`** (Modul + Träger-Eingang) | **`L1`** | `100,70 W` | `122,12 J` (`101,66 W`) | `99,02 J` (`81,94 W`) | `97,21 W` | `3,47 %` (`A2` zurückgehalten: Mitnutzer) · **`-67,02 %`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`** (Mitnutzer-`LLM`) | **`L2`** | `29,26 W` | `40,29 J` (`33,54 W`) | `26,00 J` (`21,52 W`) | `28,13 W` | Externer `GPU`-Mitnutzer (`-36,1 %`-Schwankung in `F5`) |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36,68 W` | `45,73 J` (`38,07 W`) | `44,37 J` (`36,71 W`) | `36,08 W` | `1,64 %` (`CPU`/`SoC`/`MSS`-Domäne) · **`-70,01 %`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`** (`5,08 V`-Schiene) | **`L1`** | `14,89 W` | `18,66 J` (`15,53 W`) | `16,82 J` (`13,92 W`) | `13,98 W` | **`6,13 % > 5,0 %` (`F6` ausgelöst)** · **`-68,85 %`** |

3. **Isolierung von `PLATYPUS` `0440 root:energy` und Verifikation der `APU`-Domäne von `Strix Halo` auf `Framework` `AMD`**: Auf dem `Framework` Desktop (`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`, `Linux 7.0.0-43-generic`) setzt die `udev`-Regel `90-energy-read.rules` `/sys/class/powercap/intel-rapl:0/energy_uj` (`package-0`) und `intel-rapl:0:0/energy_uj` (`core`) auf den Modus **`0440` (`root:energy`, `world_readable = false`)**: Nicht gruppierte `UID`s der `/work`-Sandbox erhalten `EACCES` (wodurch `PLATYPUS`-Seitenkanäle blockiert werden), während die Supervisor-`GID` (`energy`) kumulative Mikrojoule ohne Root-Rechte mit einer Median-Latenz von `24.34 µs` liest (`0 µJ` Residuum bei `Step 7`). Die Untersuchung von `hwmon9` (`amdgpu`) hat zudem ein offenes Spezifikationsdetail geklärt: Die integrierte `Radeon 8060S` von `Strix Halo` stellt weltweit lesbare (`0444`) `PPT`-Leistungswerte bereit (`power1_input` / `power1_average` in `µW`, `75.38 W` in Phase 1 / `69.72 W` in Phase 2), statt eines separaten `energy1_input`-Zählers, während `cros_ec` (`hwmon8`) ausschließlich Lüfter- und Board-Temperaturen liefert.

4. **Kadenzphysik des Sensorbusses (`I2C` vs. `MSR`/`MMIO` vs. `IOReport`) und universeller `Falsifier 3`-Auslöser**: Während `powercap`-`sysfs`-Lesevorgänge auf `x86-64` in `24.34-45.37 µs` abgeschlossen werden (`94.28-97.12 Hz` erreicht bei `100 Hz` nominal), durchläuft jeder neunregistrige `INA238`+`INA3221`-Snapshot auf `Jetson AGX Thor` den physischen `i2c@c600000` mit einem Median von **`2,948.8 µs`** (`4.48 ms` Mittelwert). Dadurch wird Polling mit `100 Hz` auf **`66.55 Hz`** begrenzt (`8.9×` höher als die `IOReport`-Obergrenze von `macmon` mit `7.44 Hz`), während am Referenz-Takt von `SATB` (`100 ms`, `10 Hz`) sauber **`9.49 Hz`** erreicht werden. Auf allen drei `Linux`-Hosts hat die `Kepler`-artige, CPU-Zeit-proportionale Aufteilung (`C`) die `192 MiB`-`DRAM`- plus `fsync`-Phase um **`67.02%` bis `73.62%`** zu gering gutgeschrieben. Dies bestätigt über vier Silizium-Architekturen hinweg, warum `SATB` `C` auf überlappende parallele Läufe beschränkt.

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. Verifikation von Open-Hardware und Einschränkungen

| Sitzungsfälscher | Folge bei Auslösung | Empirischer Status in dieser Studie |
| :--- | :--- | :--- |
| **`F1` Wiederholungsabweichung (`C9`)** | Referenz-Harness ist nicht-deterministisch | **Geklärt auf `4/4` Hosts (`0` Byte-Differenzen über `149,747 B`, `14` Durchläufe)** |
| **`F2` Summenprüfung schlägt bei `> 5%` der Versuche fehl** | Attributionsaufteilung auf dem Host ist unterbrochen | **Geklärt auf `4/4` Hosts (`0 µJ` Linux `RAPL`/Shunt; `<= 1 µJ` `M5 Max`)** |
| **`F3` `B` und `C` weichen sequentiell um `> 20%` voneinander ab** | `C` (`Kepler`) als unzuverlässig auf dem Host markiert | **Auf `4/4` Hosts ausgelöst (`32.59%-73.62%` Fehler); `C` eingeschränkt** |
| **`F4` Bekannte Pulslast außerhalb der Sensorgenauigkeit** | Sensor für die Sitzung herabgestuft | **Offen (`L0` Smart-Plug Sync-Pulse Aufstellung noch nicht angeschlossen)** |
| **`F5` `10 ms` vs. `1 s` Takt verschiebt Fensterenergie** | Telemetry-Beobachter-Effekt | **Geklärt (`0.76%` `M5 Max` `L2` Delta; `9.49-10.48 Hz` erreicht bei `100 ms` Referenz)** |
| **`F6` Pre/Post-Resident-Basislinien drift `> 5.0%`** | Abgeleitete Netto-Kanäle ungültig | **Aktiv (`124/188` `M5 Max` Fenster + Linux Co-Tenant Drifts sauber gesteuert)** |
| **`F7` Adapter besteht `C1`-`C12`, aber Canary schlägt fehl** | Konformität unzureichend; Sitzung `void` | **In Simulation verifiziert (`session_void = true` beim Austausch)** |
| **`F8` `Lane B` liegt unter starken `Lane O` Harnesses** | `Lane B` wird strikt als Untergrenze gemeldet | **Geklärt (`24/24` & `6/6` Parität gegenüber `Claude Code 2.1.330`)** |

Drei konkrete Hardware- und Adapter-Elemente bleiben offen (`OQ-5`):
1. **Dedizierte ruhende `A2`-Sitzungen und `L0` `AC` Netzstecker-Kalibrierung**: Obwohl die physischen `TI INA238` (`L1`) und `INA3221` (`L2`/`L1`) Shunt-`measured_j`-Leitungen jetzt live auf `NVIDIA Jetson AGX Thor` verifiziert sind, zusammen mit rootlosen `reported_j`-Zählern auf `Apple M5 Max`, `Framework AMD Strix Halo` und `Intel Raptor Lake`, führten alle vier Bench-Maschinen gleichzeitig Co-Tenant-Workloads aus (`dedicated_host = false`), wodurch `A2`-Ganz-`SUT`-Platzierungsansprüche zurückgehalten werden; das Anschließen eines synchron-gepulsten `L0` `AC`-Messgeräts (`Shelly` / `Yokogawa`) an einem ruhenden dedizierten Host ist der nächste Schritt.
2. **Integrierte `GPU` `NVML`-Zählerprüfung auf `Jetson AGX Thor`**: Rootlose `sysfs`-Berechtigungen (`0444`) für `INA238` und `INA3221 ch1-ch3` (`VDD_GPU`, `VDD_CPU_SOC_MSS`, `VIN_SYS_5V0`) sowie `Framework AMD Strix Halo` `0440 root:energy` `RAPL` + `amdgpu PPT` (`energy1_input` fehlt) sind jetzt on-device verifiziert; das Abfragen von `nvmlDeviceGetTotalEnergyConsumption` auf `Jetson AGX Thor` wartet auf ein Leerlauf-Fenster, wenn die gemeinsam genutzte `GPU`-Sperre frei ist.
3. **Erweiterte `Shape H`- und `Shape I`-Live-Liste**: Live-External-Harness-Durchläufe in dieser Studie haben `Shape H` auf `Claude Code 2.1.330` gemeinsam mit `Lane B` und `Shape D` verwendet; das Ausführen der Live-`C1-C12`-Zertifizierung auf `Codex CLI`, `OpenHands`, `Terminus-2` und `Shape I` `Inspect`-Lösern steht als nächster Schritt an.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referenzen

<ol data-refs>
<li>Anthropic (2026). Claude Code sandboxing and MCP configuration documentation. <a href="https://docs.anthropic.com/en/docs/claude-code/security">https://docs.anthropic.com/en/docs/claude-code/security</a></li>
<li>ARC Prize Foundation (2026). ARC-AGI-3 interactive benchmarking and adapter harness specification. <a href="https://github.com/arcprize/">https://github.com/arcprize/</a></li>
<li>Chung, J.-W., Gu, Y., Jang, I., Meng, L., Bansal, N., &amp; Chowdhury, M. (2024). Zeus / ML.ENERGY: Understanding and optimizing GPU energy consumption of DNN training and inference. <em>NSDI 2023 / ML.ENERGY</em>. <a href="https://ml.energy/">https://ml.energy/</a></li>
<li>Cloud Native Computing Foundation (2025). Kepler (Kubernetes-based Efficient Power Level Exporter): Proportional CPU/GPU power attribution model. <a href="https://github.com/sustainable-computing-io/kepler">https://github.com/sustainable-computing-io/kepler</a></li>
<li>gerganov, g., &amp; contributors (2026). <code>llama.cpp</code> HTTP server and prompt-cache determinism documentation. <a href="https://github.com/ggml-org/llama.cpp">https://github.com/ggml-org/llama.cpp</a></li>
<li>Kwon, W., Li, Z., Zhuang, S., Sheng, Y., Zheng, L., Yu, C. H., et al. (2023/2026). Efficient memory management for large language model serving with PagedAttention and vLLM batch invariance notes. <em>SOSP 2023 / vLLM Docs</em>. <a href="https://docs.vllm.ai/">https://docs.vllm.ai/</a></li>
<li>Lipp, M., Kogler, A., Oswald, D., Schwarz, M., Easdon, C., Canella, C., &amp; Gruss, D. (2021). PLATYPUS: Software-based power side-channel attacks on x86. <em>IEEE Symposium on Security and Privacy (SP)</em>, 355-371. <a href="https://platypusattack.com/">https://platypusattack.com/</a></li>
<li>Luccioni, A. S., Jernite, Y., &amp; Strubell, E. (2024/2026). Power hungry processing and comparative disclosures of commercial AI energy figures. <em>FAccT / Hugging Face Blog</em>. <a href="https://huggingface.co/blog">https://huggingface.co/blog</a></li>
<li>Model Context Protocol (2025). MCP specification: Tools (`tools/list`, `tools/call`, and `tools/list_changed`). <a href="https://modelcontextprotocol.io/specification">https://modelcontextprotocol.io/specification</a></li>
<li>NVIDIA Corporation (2025/2026). Jetson Thor series power management, INA238 carrier, and INA3221 rail monitoring guide. <a href="https://docs.nvidia.com/jetson/">https://docs.nvidia.com/jetson/</a></li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; Deterministic Null [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>OpenAI (2025/2026). Codex CLI Linux Landlock/seccomp and macOS Seatbelt sandboxing architecture. <a href="https://github.com/openai/codex">https://github.com/openai/codex</a></li>
<li>Rundgren, A., Jordan, B., &amp; Erdtman, S. (2020). JSON Canonicalization Scheme (JCS). <em>IETF RFC 8785</em>. <a href="https://www.rfc-editor.org/rfc/rfc8785">https://www.rfc-editor.org/rfc/rfc8785</a></li>
<li>Terminal-Bench Team (2025/2026). Terminal-Bench 2 and Terminus-2 (Harbor) terminal agent evaluation benchmark. <em>arXiv / GitHub</em>. <a href="https://github.com/laude-institute/terminal-bench">https://github.com/laude-institute/terminal-bench</a></li>
<li>UK AI Safety Institute (2025/2026). Inspect Evals: ReAct solver (`react()`) and Inspect Agent Bridge documentation. <a href="https://inspect.aisi.org.uk/">https://inspect.aisi.org.uk/</a></li>
<li>vladkens (2025/2026). <code>macmon</code>: Sudoless Apple Silicon power and performance monitoring CLI over <code>IOReport</code>. <a href="https://github.com/vladkens/macmon">https://github.com/vladkens/macmon</a></li>
<li>Wang, X., Li, B., Song, Y., Xu, F. F., Tang, X., Zhuge, M., et al. (2025). OpenHands: An open platform for AI software developers as generalist agents. <em>ICLR 2025</em>.</li>
<li>Xie, T., Zhang, D., Chen, J., Li, X., Zhao, S., Cao, R., et al. (2024). OSWorld: Benchmarking multimodal agents for open-ended tasks in real computer environments. <em>NeurIPS 2024</em>.</li>
<li>Yang, J., Jimenez, C. E., Wettig, A., Lieret, K., Yao, S., Narasimhan, K., &amp; Press, O. (2024/2025). SWE-agent: Agent-computer interfaces enable automated software engineering, and <code>mini-swe-agent</code> reference implementation. <em>NeurIPS 2024 / GitHub</em>. <a href="https://github.com/SWE-agent/mini-swe-agent">https://github.com/SWE-agent/mini-swe-agent</a></li>
<li>Yang, Z., Adamek, K., &amp; Armour, W. (2024). Accurate and convenient energy measurements for GPUs: Detailed study of <code>nvidia-smi</code> part-time power sampling. <em>arXiv:2312.12741</em>.</li>
</ol>
