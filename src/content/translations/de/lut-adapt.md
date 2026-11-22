---
title: "Abwärtskompilierung auf LUT6 in einer Kaskade nach Mixture of Limits: Beneš-geroutete Boolesche Verbindungsnetze, konforme Aufwecktore und grenzwertiges Sparse-MoE-NVMe-Streaming"
deck: "Eine Mixture of Limits-Kaskade, die zunächst null-Gleitkomma-Operation-(FLOP)-gestützte, paginierte 6-Eingänge-Look-up-Table-(LUT6-)Schaltungen versucht, streamt 4-bit Non-Volatile Memory Express (NVMe) hybride und spärliche Mixture-of-Experts-(MoE-)Modelle des späten Jahres 2026 mit bis zu 34,66 Mrd. Parametern ausschließlich bei Fehlzugriffen, steuert Commit-Operationen über deterministische Verifizierer und kompiliert zertifizierte Wake-Signale nach unten in Beneš-geroutete 36-Kbit-Block-RAM-(RAMB36E2-)Seiten. Echtzeitmesswerte, unbuffered Darwin F_NOCACHE (unbuffered file read) Byte-Zahlen, aktiver Random-Access-Memory-(RAM-)Verbrauch, kumulative Deltas der systemweiten macOS Power-Management-Unit-(PMU-)Messungen sowie Yosys/Verilator xck26 Register-Transfer-Level-(RTL-)Simulationen werden vom Repository openIE-dev/lut-adapt-ai beim Commit a5e9bc1 berichtet. Pro-Aufgabe-Energiezahlen sind analytische est_j-Schätzungen; es wurde keine isolierte Platinen-Rail-Spannung gemessen."
lang: "de"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*Revision 30613ef, 22 November 2026. Referenzimplementierung und Artefakte: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) bei [`a5e9bc1de280f973bc9051b4cc58942820a67eeb`](https://github.com/openIE-dev/lut-adapt-ai/tree/a5e9bc1de280f973bc9051b4cc58942820a67eeb). Datenzusammenfassung: [/data/#lut-adapt](/data/#lut-adapt). LaTeX-PDF: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([Quelltext](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Überblick

Diese Studie untersucht, wie ein Rechensystem wiederholte Arbeit neuronaler Modelle abwärts in schnelle boolesche Tabellennachschlagungen kompilieren kann, ohne die exakte Ausgabeparität zu verlieren oder ungeprüfte Vermutungen in vertrauenswürdige Regeln zu überführen. Sie berichtet über Softwaremessungen, Synthesen auf Register-Transfer-Ebene und Zyklensimulationen sowie gekennzeichnete analytische Energieschätzungen (`est_j`). In diesem Repository war kein Wand- oder Netzteil-Joulemeter angeschlossen (`measured_j` ist nicht gesetzt; `board_metered` ist falsch).

**Einfach ausgedrückt**

1. Die meisten Eingaben, die ein eingesetztes System verarbeitet, wiederholen Muster, die es bereits gelöst hat. Die Ausführung eines vollständigen Fließkomma-Neuronalnetzes bei jedem Schritt verschwendet daher Rechenleistung und Speicherbandbreite.
2. Die Referenzarchitektur schaltet eine rekonfigurierbare 6-Eingangs-Wahrheitstabellen-Nachschlagestufe (`LUT6`) vor streaming-fähige State-Space- und Foundation-Modelle. Antworten werden erst dann abwärts in Nachschlagespeicherseiten kompiliert, wenn eine explizite Prüfung sie bestätigt hat.
3. Wenn hybride und dünnbesetzte Mixture-of-Experts-Sprachmodelle Ende 2026 mit bis zu `34.66B` Parametern 4-Bit-Gewichte von Festkörperspeichern streamen, senken router-dünnbesetzte Expertenzugriffe in Verbindung mit diesem nullmultiplikativen `LUT6`-Entwurfsmodell die Plattenzugriffe um bis zu `12.30×` (`6.50×` höherer Token-Durchsatz) bei `2.53` Gigabyte aktivem Speicher, ohne die Ausgabetokens zu verändern. Gating-Code, der Änderungen nur über eine deterministische Prüfung übernimmt, übertrifft das eigenständige `35B`-Modell in der Genauigkeit, lässt dabei `0.00%` fehlerhafte Commits zu und beschleunigt kristallisierte Wave-3-Aufgaben um `35,590×`.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Begriffe, Akronyme und Messbezeichnungen

<ul id="terms">
<li>MoL: Mixture of Limits, die Kaskadenregel aus Metered Commit Gates Teil II [gleiches Haus]</li>
<li>LA: Anspruchs- und Falsifikatorpräfix (LA-1 bis LA-11, LA-F1 bis LA-F11), das in dieser Studie verwendet wird</li>
<li>LUT, LUT6, INIT: Look-up-Tabelle, 6-Eingangs-Xilinx-UltraScale+-Boolesches Primitiv und dessen 64-Bit-Wahrheitstafelmaske zur Initialisierung</li>
<li>BRAM, RAMB36E2, URAM: Block-RAM, das 36-Kbit-Dual-Port-UltraScale+-Block-RAM-Primitiv (144 auf xck26) und UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: konfigurierbarer Logikblock, Flip-Flop, Digital-Signal-Processing-Slice und AMD-Kria-KV260-Board (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: Field-Programmable Gate Array, anwendungsspezifische integrierte Schaltung, Register-Transfer-Level, Zyklen pro Nachschlageoperation, Place-and-Route, Worst Negative Slack und Field-Programmable Logic Conference</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU: Advanced eXtensible Interface, Zynq-Verarbeitungssystem, programmierbare Logik, System-on-Module, Onboard-Leistungsmonitor-IC, Versorgungsschiene, Intel Running Average Power Limit, NVIDIA Management Library und macOS-Leistungsverwaltungseinheit</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: State Space Duality, Zustandsraummodell, Multiple-Input-Multiple-Output, Rotary Position Embedding, Gated Linear Unit-Aktivierung, Grouped-Query Attention, Key-Value-Cache, Byte-Pair Encoding, Large Language Model(s), Mixture-of-Experts, Multilayer Perceptron und kontextfreie Grammatik</li>
<li>HC, SOINN, WNN, DWN: Hierarchy-Context Self-Organizing Incremental Neural Network, Weightless Neural Network und Differentiable Weightless Neural Network</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: Joint-Embedding Predictive Architecture, Energy-Based Reasoning Model, Adaptive Conformal Inference, Out-of-Distribution, Area under the Receiver Operating Characteristic, Maximum Softmax Probability und Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF: Prompt Lookup Decoding, Retrieval-Based Speculative Decoding, Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LFM2.5-350M und LFM2.5-8B-A1B), Liquid Foundation Model 3 (Oct 2026 LiquidAI/LFM3-1.7B) und HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR: Singulärwertzerlegung, Iterative Quantization Procrustes Hypercube Rotation, Sign-Value-Independent Decomposition, Quantization-Aware Training, Post-Training Quantization, Perplexity und Signal-Rausch-Verhältnis</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB: Non-Volatile Memory Express-Speicher, Darwin F_NOCACHE ungepufferter Dateiflag, Portable Operating System Interface, Random-Access Memory, Dynamic RAM, Static RAM, Input/Output, Kilobyte, Megabyte und Gigabyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, FP16, FP32, INT4: Gleitkommaoperation(en), Millionen FLOPs, Multiply-Accumulate-Operation(en), Single-Instruction-Multiple-Data, automatische Differentiation, finite Differenz, Bits pro Byte, 16/32-Bit-Gleitkommazahl und 4-Bit-Ganzzahl</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [gleiches Haus], Wise Computer Automation [gleiches Haus], verifizierte Vervollständigung und Präfix für Software-Engineering-Benchmarks</li>
<li>CLI, HTTP, SSE, API, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW: Kommandozeilenschnittstelle, Hypertext Transfer Protocol, Server-Sent Events, Programmierschnittstelle, akademische Fachkonferenzen und Fachzeitschriften aus Informatik und Ingenieurwesen, Betriebssystem, zentrale bzw. grafische Verarbeitungseinheit und Software</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XNOR: virtuelles lokales Netz (IEEE 802.1Q), Transport Layer Security, Deep Packet Inspection, abstrakter Syntaxbaum, JavaScript Object Notation, kommagetrennte Werte, Secure Hash Algorithm, zyklische Redundanzprüfung, Asynchronous Transfer Mode (CRC-8/ATM), Request for Comments, Structured Query Language, vorzeichenbehaftete Little-Endian-Base-128-Kodierung nach DWARF, inhaltsadressierbarer Speicher und Exklusiv-NOR</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, DSP48E2, URAM288, AMD: Joint Test Action Group Debug-Port, Xilinx-Software-Kommandozeilenwerkzeug-Debugger, Debug Access Port, Universal Serial Bus, Future Technology Devices International und dessen Brückenbaustein FT2232C für Dual-UART/FIFO, universeller asynchroner Empfänger/Sender, FIFO-Puffer (first-in first-out buffer), integrierter Schaltkreis, elektronische Entwurfsautomatisierung, Out-of-Context-Synthesemodus, Advanced Microcontroller Bus Architecture, AXI4-Lite-/AXI4-Stream-Interconnect, Ein-/Ausgabeblock, Ein-/Ausgangspuffer, D-Flipflops mit synchronem Reset bzw. Set, 1- bis 5-Eingang-Look-up-Tabellen (UltraScale+), 7-/8-Eingang-Multiplexer (UltraScale+), 4-Bit-Schnellübertragskette, DSP-Slice (UltraScale+), 288-Kbit-UltraRAM und Advanced Micro Devices</li>
</ul>

Drei Evidenzklassen bleiben in allen untenstehenden Tabellen getrennt:

| Evidenzlabel | Bedeutung in dieser Studie |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Exakte Byte-Zahlen, die über `os.pread` unter Darwin `F_NOCACHE` gelesen bzw. geschrieben wurden, resident-Speicherzuweisungen, Echtzeit-Sekunden, gesamt-Maschinen-macOS `PMU` (`AppleSmartBattery.PowerTelemetryData`) kumulative Energiedeltas auf dem Apple M5 Max, sowie exakte Bit-/Token-Übereinstimmung. `measured_j` ist nicht gesetzt (`None`). |
| **`Simulated (RTL)`** | Strukturelle Netlist-Zählungen von Yosys `0.71+` (`synth_xilinx -family xcup` mit Ziel Kria KV260 `xck26`) und Zyklus-Zählungen (`CPI = 1`) von Verilator `5.054`. Kein Vivado-Timing-Closure und keine Platinen-Leistung (`board_metered = false`). |
| **`Estimated (est_j)`** | Analytische Joule, berechnet aus Operations-Zählungen oder thermisch-Design-Power-Zeit-Ersatzwerten (`joule_meter.py`-Fallback, wenn `RAPL`/`NVML`-Hardwarezähler auf macOS fehlen). Vergleichbar nur über Arme innerhalb derselben Formel; nie Silizium-Watt. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Architektureller Hintergrund und Beiträge

In [Metered Commit Gates](/papers/gates/) `[same house]`, Teil II definiert **Mixture of Limits**: Versuche die Gänge in absteigender Reihenfolge der Durchlasswahrscheinlichkeit pro Joule $p_i / c_i$ (Simon and Kadane, 1975), stoppe sobald das Aufgabenerfüllungsprädikat $C(z) = 1$ gilt und verbiete die Verstärkung von `ModelGenerated`-Ausgaben zu `Deterministic`. Eine statische Lookup-Stufe deckt jedoch nur die vor der Bereitstellung eingeschriebenen Einträge ab. Umgekehrt fixieren bestehende Lookup-Table-Neuronale-Netze, LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022) und Differentiable Weightless Neural Networks (Bacellar et al., 2024), die Leitungsverbindungen innerhalb statischer FPGA-Routing, was einen Hersteller-Place-and-Route bei jeder Verschiebung der Eingabeverteilung erfordert.

Die `lut-adapt-ai`-Referenz schließt die Schleife zwischen Ober- und Unterseite der Kaskade mittels **online-Abwärtskompilierung auf `LUT6`**:

- **Sprosse 0 (Lookup, Paged Beneš + `LUT6`)**: Wertet 64-Bit-Wahrheitstafelmasken aus, die über einen nicht-blockierenden $512 \times 512$ **Beneš-Copy-Beneš**-Multicast-Schalter geroutet und über $81 \times \texttt{RAMB36E2}$ Dual-Port-Blockspeicher zwischengespeichert werden (`0` Gleitkommaoperationen, einzyklisches Seitenschalten in der Verilator-Simulation).
- **Sprosse 1 (Stream, `Mamba-3` Complex MIMO State Space Duality)**: Behandelt Fehltreffer, die von der Sequenzhistorie abhängen, mittels eines konstant-großen $O(1)$ rekurrenten Zustands (`48 KB` gepinntes Gedächtnis in der `14.3M`-Parameter-Referenz) und vermeidet das $O(L)$-Wachstum des Key-Value-Caches.
- **Sprosse 2 (Topology, `HC-SOINN`)**: Unterhält eine online-Prototypentopologie über latente Einbettungen, isoliert Regimegrenzen und löst einen Schutzschalter (`Refuse` / Eskalation) aus, sobald eine ungelabelte Verteilungsverschiebung eintrifft.
- **Sprosse 3 (Model last, `JEPA-EBRM`, `AirMoL` und `Expert-AirMoL` 4-Bit NVMe Streaming)**: Ruft latente energiebasierte Verifikation auf oder streamt vortrainierte hybride und Sparse-MoE-Grundlagenmodelle aus Ende 2026 (`LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it`, `LiquidAI/LFM2.5-8B-A1B` und `Qwen/Qwen3.6-35B-A3B` sowie `LiquidAI/LFM2.5-350M` und `Qwen/Qwen3.5-0.8B-Base`) nur dann, wenn günstigere Sprossen sich enthalten oder eine exakte Zielverifikation erfordern.
- **Abwärts-`SleepCrystallizer`**: Extrahiert wiederkehrende Aufweckspuren mittels Walsh-Hadamard-spektraler Warmanläufe, Joint-Mode-Minterm-Wahrheitstafeln und Waksman-Schalterplänen, wobei Schatten-Blockspeicherbänke umgeschaltet werden, ohne die Inferenz anzuhalten oder einen FPGA-Place-and-Route auszuführen.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Beiträge

1. **Amortisierte Abwärtskompilierungsbedingung**: Erweitert die Simon-Kadane $p_i/c_i$ Ordnung um eine explizite Kompilierungskosten $E_{\text{compile}}$ über den stationären Horizont $\Delta T$.
2. **Non-blocking $512 \times 512$ Beneš-Copy-Beneš and `81`-`RAMB36E2` RTL architecture**: Elimininiert sowohl den `102.0%` Kria KV260 Logiküberlauf von flachen Kreuzbarren (`119,478` LUTs) als auch die `926,619`-LUT Explosion von Flip-Flop-Seitenmultiplexern, synthetisiert zu `41,186` UltraScale+ CLB LUTs (`35.2%` von `xck26`), `81` `RAMB36E2` Blöcken (`56.2%`), und `0` `DSP48` Slices mit `1`-Zyklus (`4.0 ns` bei `250 MHz` nominal) Seitenschaltung in der Simulation.
3. **Universelle $\le 64$-Bit Joint-Mode-Minterm-Synthese**: Zeigt, dass Joint-Mode-Minterm-Lookup die marginale Bit-Plane-DiffLogic-Rundung bei korrelierten Verzweigungen dominiert und $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ Subwort-Token in ein `uint64` Wort (`16b × 4 = 64b` für `|V| = 65,536`; `17b × 3 = 51b` für `|V| = 128,000`; `18b × 3 = 54b` für `|V| = 248,320`) packt.
4. **Oracle-freie Split-Conformal + Online ACI Kristallisationsschranke**: Paaren einen radial regularisierten latenten `JEPA-EBRM` Nichtkonformitäts-Score mit Split-Conformal Kalibrierung und Adaptive Conformal Inference (Gibbs und Candès, 2021), wobei `0.00%` falsches Kristallisations-Risiko und `1.0000` OOD AUROC bei verschobenem Verkehr aufgezeichnet werden, während Softmax- und MC-Dropout-Baselines `17.62%-24.28%` falsches Risiko melden.
5. **`AirMoL` und `Expert-AirMoL` 4-Bit NVMe-Streaming bis zu `34.66B` Sparse-MoE**: Kombiniert Darwin `F_NOCACHE` `os.pread` 4-Bit-Sharding, Router-indizierte `.experts.pack4` Byte-Stride-Expert-Lesevorgänge, hybriden Zustands-Rollback und Online-Token-`LUT6`-Burst-Spekulation über Oktober 2026 `LiquidAI/LFM3-1.7B` (`2.74×` NVMe-Reduktion in `3.79%` von FP32 RAM), `LiquidAI/LFM2.5-8B-A1B` (`8.47B`; `6.90×` NVMe-Reduktion), und `Qwen/Qwen3.6-35B-A3B` (`34.66B`; **`12.30×` NVMe-Reduktion**, **`2,530.7 MB` RAM = `3.83%` von FP16**, **`6.50×` Beschleunigung**) bei `100.0%` exakt Token-Parität.
6. **Zero-MAC `Sub1Bit-LUT6` vs. `LittleBit` und verifizierer-gesteuerte späte-2026 Frontier-Coding-Kaskade**: Ersetzt die `1.98M` Laufzeit-Binär-MACs von `LittleBit-1 / LittleBit-2` (`0.576` Bits pro Gewicht; Lee et al., 2025; Lee und Kim, 2026) durch Null-MAC `6`-Eingangs-`LUT6`-Partial-Sum-Lookup (`< 4 × 10⁻⁶` Fehler, `100.0%` Parität unter `MoL` Ziel-Verifikation in `0` QAT-Epochen) und übertrifft eigenständige `LittleBit-2 0.55bpw`, `LFM3-1.7B`, `Gemma-4-E2B-it`, `LFM2.5-8B-A1B`, `Qwen3.6-35B-A3B` und `RouteLLM` über einen `48`-Task (`16` Spezifikationen × `3` Wellen) Codierungs-Benchmark (`43.75%` vs. `0.00%-33.33%`) mit **`0.00%` beschädigte Commits zugelassen** und **`35,590×` Wave-3 kristallisierte Skill-Beschleunigung**, unterstützt von fünf-sprachiger polyglot-Verifikation.

<div id="13-same-house-disclosure-and-provenance-boundaries" class="anchor-alias" aria-hidden="true"></div>

### 1.3 Offenlegung hausinterner Arbeiten und Provenienzgrenzen

Frühere Studien von Open Interface Engineering, namentlich [Gemessene Commit-Tore](/papers/gates/), [Aufgabensättigung versus aggregierter Rebound in der KI-Nachfrage](/papers/satiation/), [Die Reality Code Engine](/papers/rce/), [RCE-JEPA](/papers/rce-jepa/) und [RCE Compile](/papers/rce-compile/), sind `[same house]`-Arbeiten, die zur Offenlegung und architektonischen Kontinuität zitiert werden, niemals als externe Bestätigung. Zwei Invarianten gelten durchgehend:

- **Keine Aufwertung der Provenienz (`ModelGenerated ↛ Deterministic`)**: Tabellen, die aus einer deterministischen `RCE`-Spezifikationsprüfung kompiliert wurden, tragen auf verifizierten zurückgehaltenen Mengen das Prädikat `Check-safe` (im laufenden Betrieb abgesichert durch einen `HC-SOINN`- / `RCE`-Schutzschalter). Tabellen, die unter dem orakelfreien konformen `JEPA-EBRM`-Tor kristallisiert wurden, tragen eine statistische Schranke für endliche Stichproben (`Conformal-bounded`, $1-\alpha$) und werden niemals zu `Deterministic` hochgestuft.
- **Vorschlagender gegen Entscheidungsinstanz (`The drafter proposes; the target decides`)**: Beim spekulativen Dekodieren fungiert `PagedBenesLUT6` strikt als Vorschlagender mit null FLOP; jedes ausgegebene Byte oder Token wird gegen die gierige Dekodierung des Zielmodells geprüft (`100.0%` verlustfreie Parität).

---

<div id="2-mathematical-formulations-and-four-results" class="anchor-alias" aria-hidden="true"></div>

## 2. Mathematische Formulierungen und vier Ergebnisse

<div id="21-result-1-cascade-ordering-with-amortized-downward-compilation" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Ergebnis 1: Kaskadenreihenfolge mit amortisierter Abwärtskompilierung

Betrachtet seien Gänge $i \in \{0, 1, 2, 3\}$, die nacheinander auf einer Eingabe $x$ erprobt werden. Gang $i$ schließt $C(z) = 1$ mit Wahrscheinlichkeit $p_i$ bei erwarteter analytischer Energie $c_i > 0$. Nach Simon und Kadane (1975) wird der erwartete Aufwand

$$\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j < k} \bigl(1 - p_{\sigma(j)}\bigr)$$

genau dann minimiert, wenn die Gänge in nicht-steigender Reihenfolge von $p_{\sigma(k)} / c_{\sigma(k)}$ durchlaufen werden. Angenommen, ein stationäres Regime $\mathcal{D}_r$ bleibe für $\Delta T$ verbleibende Abfragen bestehen, in denen der Aufweckpfad mit $p_{\text{wake}} = 1$ zu Kosten $c_{\text{wake}}$ abschließt. Das einmalige Aufwenden der Kompilierungsenergie $E_{\text{compile}}$ nach $N_{\text{wake}}$ zertifizierten Aufweckvorgängen erzeugt auf Sprosse 0 eine `LUT6`-Seite mit zertifizierter Trefferquote $p_0' \in (0, 1]$ und Nachschlagekosten $c_0 \ll c_{\text{wake}}$.

**Proposition 1 (Nettoenergiebedingung für die Abwärtskristallisation).** *Abwärtskompilierung senkt den erwarteten kumulierten analytischen Aufwand über dem Horizont $\Delta T$ genau dann, wenn*

$$\Delta T \cdot \bigl(p_0' c_{\text{wake}} - c_0\bigr) > E_{\text{compile}}, \qquad \text{and} \qquad \frac{p_0'}{c_0} > \frac{1}{c_{\text{wake}}}.$$

*Beweis.* Ohne Kristallisation kosten $\Delta T$ Abfragen $\Delta T \cdot c_{\text{wake}}$. Mit Kristallisation zu Kosten $E_{\text{compile}}$ steht Sprosse 0 genau dann vor dem Aufweckpfad, wenn $p_0'/c_0 > 1/c_{\text{wake}} \iff c_0 < p_0' c_{\text{wake}}$ gilt, und jede Abfrage kostet $c_0 + (1 - p_0') c_{\text{wake}}$, was pro Schritt $p_0' c_{\text{wake}} - c_0 > 0$ einspart. Summation über $\Delta T$ Schritte liefert die Nettoersparnis $\Delta T(p_0' c_{\text{wake}} - c_0) - E_{\text{compile}} > 0$. Bei raschem Wechsel ($\Delta T \le \Delta T^*$) verliert die Kompilierung Energie, was den Mindest-Aufweckpuffer $N_{\text{wake}}$ des `SleepCrystallizer` sowie sein Tor auf der zurückgehaltenen Menge $\tau_{\text{agree}} = 0.985$ begründet. $\blacksquare$

<div id="22-result-2-non-blocking-512512-benešcopybeneš-multicast-routing" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Ergebnis 2: Blockierungsfreies $512 \times 512$-Beneš-Copy-Beneš-Multicast-Routing

Eine Bank auf Sprosse 0 aus $G = 80$ dynamischen `LUT6`-Zellen benötigt $M = 6G = 480$ Eingangspins, die mit beliebigem Fan-out aus einem $N = 512$-Bit-Bus ausgewählt werden. Ein bijektives Beneš-Permutationsnetz kann Leitungen mit hohem Fan-out nicht vervielfältigen, während flache $512:1$-Multiplexer-Koppelfelder die KV260 sprengen (`119,478` CLB-LUTs bereits bei `384` Ports).

**Theorem 2 (Konfliktfreies Multicast über Beneš-Copy-Beneš).** *Für $N = 2^n$ ($n=9, N=512$) und $M \le N$ ($M=480$) routet jede Viele-zu-eins-Multicast-Abbildung $\phi: \{0, \dots, M-1\} \to \{0, \dots, N-1\}$ konfliktfrei durch $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ in*

$$D(N) = 2(2\log_2 N - 1) + \log_2 N = 5\log_2 N - 2 = 43 \text{ stages}$$

*aus $N/2 = 256$ SRAM-konfigurierten $2 \times 2$-Schaltern ($11,008$ Konfigurationsbits), berechnet in Zeit $O(N \log N)$ ohne jedes FPGA-Place-and-Route.*

*Beweis.* Sei $U = \{s_1, \dots, s_r\}$ die Menge der paarweise verschiedenen aktiven Eingänge mit Fan-outs $\sum_{j=1}^r m_j = M \le N$ und Partialsummen $S_0 = 0, S_j = \sum_{i=1}^j m_i$. Das Konzentrationsnetz $\mathcal{B}_1$ ($17$ Stufen) bildet $\pi_1(s_j) = S_{j-1}$ mittels bipartiter Waksman-2-Färbung ab (Beneš, 1965; Waksman, 1968). Das Kopiernetz $\mathcal{C}$ ($9$ Butterfly-Stufen) vervielfältigt jedes $S_{j-1}$ ohne Leitungskonflikt über das disjunkte monotone Intervall $[S_{j-1}, S_j - 1]$ nach Thompsons monotoner Kopierkonstruktion (Thompson, 1978; Lee, 1988). Das ausgangsseitige Beneš-Netz $\mathcal{B}_2$ ($17$ Stufen) permutiert $[S_{j-1}, S_j - 1]$ bijektiv auf $\phi^{-1}(s_j)$. $\blacksquare$

<div id="23-result-3-joint-mode-minterm-synthesis-vs-marginal-coordinate-argmax" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Ergebnis 3: Verbundmodus-Minterm-Synthese gegenüber marginalem Koordinaten-Argmax

Unabhängige Bitebenen-DiffLogic-Schichten sagen Mehrbit-Salven $\mathbf{Y} = (Y_1, \dots, Y_B)$ durch koordinatenweise Rundung $\hat{y}_b(c) = \mathbb{I}[\Pr(Y_b = 1 \mid c) > 1/2]$ voraus, wodurch korrelierte Zweige zu ungültigen **Chimären**-Tokens verschmelzen.

**Proposition 3 (Dominanz und Chimärenfreiheit von Verbundmodus-Mintermen).** *Für einen diskreten Kontext $\psi(X) = c$ und einen $B \le 64$-Bit-Salvenraum $\mathcal{Y}$ erfüllt die Verbundmodus-Tabelle $T^*(c) = \arg\max_{\mathbf{y} \in \mathcal{Y}} \Pr(\mathbf{Y} = \mathbf{y} \mid c)$ die Ungleichung $\Pr[\mathbf{Y} = T^*(\psi(X))] \ge \Pr[\mathbf{Y} = \hat{\mathbf{y}}^{\text{marg}}(\psi(X))]$, verbleibt innerhalb des Trägers $\operatorname{supp}(\mathbf{Y} \mid c)$ und vermeidet marginale Chimären (etwa wenn Wahrscheinlichkeitsmassen $0.40, 0.35, 0.25$ auf $(1,1,0), (1,0,1), (0,1,1)$ marginal zum ungültigen Vektor $(1,1,1)$ mit `0%` exakter Übereinstimmung gegenüber `40%` für $T^*$ gerundet werden). Für ein Vokabular $|V|$ mit $b_V = \lceil \log_2 |V| \rceil$ packt ein einziges `uint64`-Wort $K = \lfloor 64 / b_V \rfloor$ BPE-Tokens (`16b × 4 = 64b` bei `LFM2.5-350M`; `18b × 3 = 54b` bei `Qwen3.5-0.8B-Base`).* $\blacksquare$

<div id="24-result-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Ergebnis 4: Orakelfreies latentes `JEPA-EBRM`-Tor mit Split-Conformal + Online-ACI

Um halluzinierte Selbst-Destillation zu verhindern, wenn keine deterministische `RCE`-Prüfung zur Verfügung steht, bewertet die Referenz Kandidatenpaare mit einer radial regularisierten latenten Energie:

$$E_\phi(x, y) = \frac{1}{2}\|f_\theta(x) - \mu_y\|_2^2 + \frac{\lambda_r}{2}\|f_\theta(x)\|_2^2 + \psi_\phi(f_\theta(x), y), \qquad \lambda_r > 0, \quad |\psi_\phi| \le C_\psi.$$

Split-Conformal-Kalibrierung auf einer zurückgehaltenen Menge bestimmt $\hat{Q}_{1-\alpha}$, und die laufende adaptive konforme Inferenz aktualisiert $\alpha_{t+1} = \alpha_t + \gamma(\alpha - \text{err}_t)$ (Gibbs und Candès, 2021), wobei $(x, \hat{y})$ nur dann in den `SleepCrystallizer` eingelassen wird, wenn $|\mathcal{C}_t(x)| = |\{y : E_\phi(x,y) \le \hat{Q}_{1-\alpha_t}\}| = 1$ (`Conformal-bounded`) gilt. Nach Vovk et al. (2005) sowie Gibbs und Candès (2021) beträgt die marginale Überdeckung unter Austauschbarkeit mindestens $1-\alpha$, die langfristige Fehlüberdeckung unter Verteilungsverschiebung konvergiert gegen $\alpha$, und jeder Halbstrahl abseits der Mannigfaltigkeit jenseits des Radius $R(\alpha_t) = \sqrt{2(\hat{Q}_{1-\alpha_t} + C_\psi)/\lambda_r}$ liefert $\mathcal{C}_t(x) = \emptyset$ (`Refuse` / Enthaltung).

---

<div id="3-reference-architecture-polyglot-suite-and-kv260-rtl" class="anchor-alias" aria-hidden="true"></div>

## 3. Referenzarchitektur, Polyglot-Suite und KV260 RTL

Abbildung 1 zeigt die vierstufige Kaskade und die abwärtsgerichtete `SleepCrystallizer`-Schleife in `src/clai/`.

![Abbildung 1. Abwärtskompilierung über eine vierstufige Mixture of Limits-Kaskade.](/figures/lut-adapt/mol-downward-cascade.svg)

*Abbildung 1. Abwärtskompilierung über eine vierstufige Mixture of Limits-Kaskade. Entwurfsdiagramm, keine Messung der Board-Stromaufnahme. [PNG](/figures/lut-adapt/mol-downward-cascade.png) · [Interaktiver Explorer](/living/lut-adapt/#la-diag-01).*

Fünf Systemimplementierungen in `openIE-dev/lut-adapt-ai` überprüfen die Kaskade: Python/PyTorch/Triton (`src/clai/`), Rust `Burn 0.22.1 / CubeCL` Metal (`sys/rust/`), Zig `0.17.1` (`sys/zig/`), Go `1.27.4` SIMD (`sys/go/`) und Julia `1.13.4` Enzyme (`sys/julia/`).

Abbildung 2 illustriert den Kria KV260 (`xck26`) RTL-Datenpfad in `hw/kv260/rtl/clai_benes_hotswap_core.sv` und mappt `512` resident `LUT6`-Seiten (`5,120` `INIT`-Bits + `48`-Bit-Kontext-Tag + gültiges Bit) über `81` parallele `RAMB36E2`-Dual-Port-Speicher für ein-Zyklus-(`4.0 ns` bei nominalen `250 MHz`, `CPI = 1.0`) Kontext-Umschalten.

![Abbildung 2. Beneš-Copy-Beneš-Multicast-Struktur und ein-Zyklus-BRAM-LUT6-Seiten-Cache.](/figures/lut-adapt/benes-paged-silicon.svg)

*Abbildung 2. `512×512` Beneš-Copy-Beneš-Multicast-Struktur und `81 × RAMB36E2` ein-Zyklus-`LUT6`-Seiten-Cache, Ziel AMD Kria KV260 (`xck26`) in Yosys `0.71+` und Verilator `5.054`-Simulation (`board_metered = false`). [PNG](/figures/lut-adapt/benes-paged-silicon.png) · [Interaktiver Explorer](/living/lut-adapt/#la-diag-02).*

Abbildung 3 zeigt `AirMoL` (`src/clai/frontier/air_mol_streamer.py` und `hf_air_mol_pretrained.py`), das 4-Bit-gruppenquantisierte Segmente über Darwin `F_NOCACHE` `os.pread` streamt, `[last_tok, d_1..d_K]` in einem Durchgang verifiziert und kompakte hybride Zustände (`Short-Conv/SSM` oder `Gated DeltaNet` + spärliche `6`-schichtige `GQA`-KV-Beschneidung) im RAM ablegt, sodass teilweise Entwurfs-Ablehnungen **keine zusätzlichen NVMe-Durchläufe** benötigen.

![Abbildung 3. AirMoL 4-Bit-NVMe-Layer-Streaming mit universeller 64-Bit-Token-LUT6-Spekulation.](/figures/lut-adapt/airmol-nvme-speculation.svg)

*Abbildung 3. `AirMoL` null-extra-Durchlauf-4-Bit-NVMe-Layer-Streaming mit universeller `≤64`-Bit-Token-`LUT6`-Spekulation auf `LiquidAI/LFM3-1.7B`, `LiquidAI/LFM2.5-350M` und `Qwen/Qwen3.5-0.8B-Base`. [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [Interaktiver Explorer](/living/lut-adapt/#la-run-01).*

Abbildung 4 zeigt `Expert-AirMoL` (`src/clai/frontier/moe_air_mol.py`) und `VerifiedCodeCascade` (`verified_code_cascade.py`). Das standardmäßige festplatten-ausgelagerte `AirLLM` durchmustert alle $E$ Experten pro MoE-Schicht (`32` in `LiquidAI/LFM2.5-8B-A1B`, `256` in `Qwen/Qwen3.6-35B-A3B`), obwohl der Router pro Token nur $k \ll E$ Experten aktiviert (`4/32` bzw. `8/256`). `Expert-AirMoL` partitioniert jede MoE-Schicht in einen kompakten Header-Shard und eine festabständige `INT4`-`.experts.pack4`-NVMe-Datei und führt `F_NOCACHE`-`os.pread`-Lesevorgänge ausschließlich für die aktive Expertenvereinigung $\mathcal{U}_l$ über die $K+1$ Burst-Positionen aus. Für neuartige Syntheseaufgaben schaltet `VerifiedCodeCascade` jeden Commit über die Sprossen `0-3c` hinter einer `0.35s`-begrenzten AST, einer Sandbox-Ausführung sowie einer randinvarianten Prüfung $C(z) \in \{0, 1\}$ und kompiliert zertifizierte Lösungen in `BenesLUT6` sowie kanonische AST-Fertigkeitsseiten.

![Abbildung 4. Router-sparse 4-Bit-NVMe-Streaming von Expert-AirMoL und verifizierergesteuerte VerifiedCodeCascade.](/figures/lut-adapt/moe-expert-cascade.svg)

*Abbildung 4. Router-sparses 4-Bit-Experten-indiziertes NVMe-Streaming von `Expert-AirMoL` (`12.30×` E/A-Reduktion bei `Qwen/Qwen3.6-35B-A3B`) und `C(z)`-gesteuerte `VerifiedCodeCascade`. [PNG](/figures/lut-adapt/moe-expert-cascade.png) · [Interaktiver Explorer](/living/lut-adapt/#la-run-01).*

---

<div id="4-claims-and-results" class="anchor-alias" aria-hidden="true"></div>

## 4. Behauptungen und Ergebnisse

<div id="41-claim-la-1-analytical-est_jvc-reduction-on-synthetic-tasks-and-real-pcap-traffic" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Behauptung LA-1: Analytische `est_j/VC`-Reduktion auf synthetischen Aufgaben und realem `.pcap`-Verkehr

| Arbeitslast & Fenster | Anteil Sprosse 0 | Bestehensrate | Analytische `est_j / VC` | Verilator-Parität | Evidenzklasse |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Synthetisch Ep. `1-512` (Kaltaufwecken) | `0.00%` | `0.0% → 52.0%` | `2,323.18 est_j` | - | SW + `est_j` |
| Synthetisch Ep. `3,073-3,584` (kristallisiert) | `52.73%` | `60.55%` | `2.59 est_j` (`895×`) | `100.0%` | Verilator + `est_j` |
| `.pcap`-Pakete `1-512` (IPv4 kalt) | `0.00%` | `73.05%` | `3.3351 est_j` | `100.0%` | Verilator + `est_j` |
| `.pcap`-Pakete `1,537-2,048` (kristallisiert) | `100.00%` | `100.00%` | `0.000140 est_j` | `100.0%` | Verilator + `est_j` |
| `.pcap`-Pakete `2,049-2,560` (VLAN-`0x8100`-Wechsel) | `2.73%` | `68.55%` | `3.0485 est_j` | `100.0%` | Schutzschalter + `est_j` |
| **`.pcap`-Pakete `2,561-3,072` (rekristallisiert)** | **`100.00%`** | **`100.00%`** | **`0.000131 est_j` (`25,458×`)** | **`100.0%` (`5,120/5,120`)** | **Verilator + `est_j`** |

<div id="42-claim-la-2-five-language-polyglot-parity-and-zero-allocation-dataplanes" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Behauptung LA-2: Polyglotte Parität in fünf Sprachen und allokationsfreie Datenpfade

| Implementierung | Zielsystem / Backend | Kernergebnis | Evidenzklasse |
| :--- | :--- | :--- | :--- |
| **Rust (`sys/rust/`)** | `Burn 0.22.1` + `CubeCL` Metal-GPU | `2,331.42 → 0.19 est_j/VC`, `95.31%` Anteil Sprosse 0, erzeugt KV260-`.v` | Gemessene SW + `est_j` |
| **Zig `0.17.1` (`sys/zig/`)** | `@Vector(8, f32)` SIMD + `@popCount` | `0` Heap-Bytes in der heißen Schleife; `87 ns/pkt` (`11.49M pkts/s`) | Gemessene SW (M5 Max) |
| **Go `1.27.4` (`sys/go/`)** | Worker-Pool + `OnesCount64` | `0 B/op`, `0 allocs/op`; `31.86 ns/op` (`31.39M evals/s`) | Gemessen (`go test`) |
| **Julia `1.13.4` (`sys/julia/`)** | Rückwärtsmodus-AD mit `Enzyme.jl` | Max. Gradientenabweichung ggü. zentralen FD: `6.11 × 10⁻¹⁰` | Gemessene numerische Prüfung |

<div id="43-claim-la-3-kv260-xck26-benešcopybeneš-and-ramb36e2-paged-synthesis" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Behauptung LA-3: Gepagte Beneš-Copy-Beneš- und `RAMB36E2`-Synthese für KV260 (`xck26`)

| RTL-Architektur | Seiten | Umschaltlatenz | `xcup` CLB-LUTs (`% xck26`) | `RAMB36E2` | `DSP48` | Gen. nach Drift | Evidenzklasse |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `2A` Flaches `512:1`-Koppelfeld (`64` LUT6) | `1` | `82 cyc` | `119,478` (**`102.0%` Überlauf**) | `0` | `0` | `98.44%` | Simuliert (Yosys) |
| `2B` Kompaktes Koppelfeld (`32` LUT6) | `1` | `82 cyc` | `59,739` (`51.0%`) | `0` | `0` | `95.94%` | Simuliert (Yosys) |
| `2C` Festverdrahtetes DiffLogic / WNN | `1` | Vivado-Neu-PAR | `160` (`0.14%`) | `0` | `0` | **`52.34%`** | Simuliert (Yosys) |
| `2D` Einseitiges Beneš-Copy-Beneš | `1` | `82 cyc` | `40,155` (`34.3%`) | `0` | `0` | `98.44%` | Simuliert (Yosys + Verilator) |
| `P2` Verteilte FFs + `512:1`-Mux | `512` | `1 cyc` | `926,619` (**`791.2%` Überlauf**) | `0` | `0` | `98.44%` | Simuliert |
| **`P3` Beneš + `81` `RAMB36E2` (Referenz)** | **`512`** | **`1 cyc` (`4.0 ns`)** | **`41,186` (`35.2%`)** | **`81` (`56.2%`)** | **`0`** | **`98.44%`** | **Simuliert (Yosys + Verilator)** |

<div id="44-claim-la-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.4 Behauptung LA-4: Orakelfreies latentes `JEPA-EBRM`-Tor mit Split-Conformal + Online-ACI

| Kristallisationstor | Durchläufe | Risiko falscher Kristallisation | OOD-AUROC | Sichere ID-Abdeckung | Reine `LUT6`-Gen. | Drift erkannt? | Evidenzklasse |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `3A` Softmax-MSP ($\max p \ge 0.95$) | `1` | `17.62%` | `0.8552` | `90.93%` | `99.22%` | `False` | Gemessene SW |
| `3B` Temperaturskalierte Marge | `1` | `17.66%` | `0.8422` | `91.12%` | `98.83%` | `False` | Gemessene SW |
| `3C` Helmholtz-Logit-Energie | `1` | `24.28%` | `0.8045` | `97.17%` | `99.80%` | `False` | Gemessene SW |
| `3D` MC-Dropout (`5` Durchläufe) | `5` | `18.24%` | `0.8494` | `91.03%` | `99.61%` | `False` | Gemessene SW |
| **`3E` Latentes `JEPA-EBRM` + konforme ACI** | **`1`** | **`0.00%`** | **`1.0000`** | **`95.66%`** | **`99.02%`** | **`True`** | **Gemessene SW** |

<div id="45-claim-la-5-lossless-byte-level-speculative-decoding-on-520-kb-polyglot-source-code" class="anchor-alias" aria-hidden="true"></div>

### 4.5 Behauptung LA-5: Verlustfreies spekulatives Dekodieren auf Byte-Ebene über `520 KB` polyglottem Quellcode

| Architektur | Exakte Parität | Bytes / Durchlauf | Durchläufe (`64 B`) | Entwurfs-FLOPs | MFLOPs / Byte | `est_mJ / Byte` | Evidenzklasse |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` Kausaler Transformer (`RoPE+SwiGLU`) | `100.0%` | `1.00` | `64.00` | `0` | `7.209` | `58.94` | Gemessene SW + `est_j` |
| `B` `Mamba-3` Komplexes MIMO (`T=1`) | `100.0%` | `1.00` | `64.00` | `0` | `2.257` | `20.84` | Gemessene SW + `est_j` |
| `C` `PLD` Nachschlagen im Prompt | `100.0%` | `2.13` | `29.98` | `0` | `1.322` | `11.52` | Gemessene SW + `est_j` |
| `D` `REST` Korpus-Suffix-Trie | `100.0%` | `3.84` | `16.65` | `0` | `0.734` | `6.40` | Gemessene SW + `est_j` |
| `E` `Medusa` Parallele MLP-Köpfe | `100.0%` | `2.62` | `24.44` | `428,288` | `1.241` | `9.46` | Gemessene SW + `est_j` |
| `F` `EAGLE-2` Neuronaler Entwurfsbaum | `100.0%` | `2.75` | `23.29` | `1,122,560` | `1.435` | `9.07` | Gemessene SW + `est_j` |
| **`G` `MoL` Gepagtes Beneš-`LUT6` (Referenz)** | **`100.0%`** | **`3.84`** | **`16.69`** | **`0`** | **`0.736`** | **`6.41`** | **Gemessene SW + `est_j`** |

<div id="46-claim-la-6-controlled-airmol-4-bit-nvme-streaming-143m-matched-pair" class="anchor-alias" aria-hidden="true"></div>

### 4.6 Behauptung LA-6: Kontrolliertes 4-Bit-NVMe-Streaming unter `AirMoL` (`14.3M`-Vergleichspaar)

| Ausgelagerte Streaming-Architektur | Parität | Bytes / Durchlauf | Durchläufe | NVMe-Lesen | NVMe-Schreiben | Spitzen-RAM | `ms / Byte` | Evidenzklasse |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `AirLLM` Transformer FP16 + KV-Auslagerung | `100%` | `1.00` | `64.00` | `2,130.0 MB` | `407.6 MB` | `8.81 MB` | `60.64` | Gemessen (`F_NOCACHE`) |
| `2` `AirLLM` Transformer 4-Bit + KV-Auslagerung | `100%` | `1.00` | `64.00` | `887.6 MB` | `407.6 MB` | `8.81 MB` | `64.87` | Gemessen (`F_NOCACHE`) |
| `3` `AirMamba-3` 4-Bit + ausgelagertes `EAGLE-2` | `100%` | `2.86` | `22.38` | `175.3 MB` | `0.0 MB` | `7.20 MB` | `19.20` | Gemessen (`F_NOCACHE`) |
| `4` `AirMamba-3` 4-Bit + gepinntes $O(1)$ (`T=1`) | `100%` | `1.00` | `64.00` | `488.3 MB` | `0.0 MB` | `7.20 MB` | `37.72` | Gemessen (`F_NOCACHE`) |
| **`5` `AirMoL` 4-Bit + kaltes `LUT6` (Referenz)** | **`100%`** | **`3.74`** | **`17.12`** | **`130.7 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.18`** | **Gemessen (`F_NOCACHE`)** |
| **`6` `AirMoL` 4-Bit + nach Aufwecken (Referenz)** | **`100%`** | **`4.27`** | **`15.00`** | **`114.4 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.09`** | **Gemessen (`F_NOCACHE`)** |

<div id="47-claim-la-7-pretrained-2026-dense--tri-hybrid-models-under-airmol-lfm3-17b-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 Claim LA-7: Vortrainierte Dense- und Tri-Hybrid-Modelle des Jahres 2026 unter `AirMoL` (`LFM3-1.7B`, `LFM2.5-350M` und `Qwen3.5-0.8B-Base`)

| 2026-Checkpoint & Variante | Parität | Tok / Sweep | Zeichen / Sweep | Sweeps | NVMe-Lesevorgänge | Aktiver RAM-Spitzenwert (`% FP32`) | `tok/s` | Evidenzklasse |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM3-1.7B` (Okt. 2026) · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.30` | `24.00` | `25.045 GB` | `250.0 MB` (`3.79%`) | `0.53` | Gemessen (`F_NOCACHE`) |
| `LFM3-1.7B` (Okt. 2026) · `AirLLM` 4-Bit + `PLD` | `100%` | `1.37` | `3.16` | `17.50` | `18.262 GB` | `250.0 MB` (`3.79%`) | `0.73` | Gemessen (`F_NOCACHE`) |
| **`LFM3-1.7B` (Okt. 2026) · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.55`** | **`3.56`** | **`15.50`** | **`16.175 GB`** | **`250.0 MB` (`3.79%`)** | **`0.81`** | **Gemessen (`F_NOCACHE`)** |
| **`LFM3-1.7B` (Okt. 2026) · `AirMoL` Post-Wake** | **`100%`** | **`2.74`** | **`6.31`** | **`8.75`** | **`9.131 GB`** | **`250.0 MB` (`3.79%`)** | **`1.32`** | **Gemessen (`F_NOCACHE`)** |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Gemessen (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Gemessen (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Gemessen (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Gemessen (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` Post-Wake** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Gemessen (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Gemessen (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Gemessen (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` Cold `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Gemessen (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` Post-Wake** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Gemessen (`F_NOCACHE`)** |

Im Oktober 2026 `LiquidAI/LFM3-1.7B` (`13` kurze Faltungen + `5` Gleitfenster-Aufmerksamkeits-Schichten + `6` Voll-Aufmerksamkeits-Schichten, `|V| = 128,000`), reduziert post-wake `AirMoL` den NVMe-Transfer um `2.74×` (`25.045 GB` auf `9.131 GB`) und erhöht die Dekodiergeschwindigkeit um `2.49×` (`0.53` auf `1.32 tok/s`) bei `250.0 MB` aktivem Gewicht-RAM (`3.79%` von FP32) bei `100.0%` verlustfreier Parität. Beachten Sie den erhaltenen Kompromiss bei CPU-gebundenem `Qwen3.5-0.8B-Base` kalten, ungesehenen Eingabeaufforderungen: `AirMoL` reduziert NVMe-Festplattenlesungen (`12.674 GB` auf `8.581 GB`), doch die CPU-Gated-DeltaNet-Batch-Verifikation von `4` Tokens senkt den Wand-Uhr-Durchsatz (`0.32` vs. `0.53 tok/s`), bis die online wake-to-`LUT6` Kristallisation die Akzeptanz auf `2.74 tok/sweep` (`1.11 tok/s`) hebt.

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 Aussage LA-8: Live-CLI- und HTTP/SSE-Streaming-Server (`mol_code_cli.py`)

`scripts/mol_code_cli.py` bedient `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` und `--air-nvme` über CLI- und SSE-Endpunkte (`/v1/health`, `/v1/complete`, `/v1/crystallize`), wobei die `RAMB36E2`-Slot-Belegung von `438/512` auf `460/512` live voranschreitet, bei `22/22` bestandenen Tests in `tests/`.

<div id="49-claim-la-9-frontier-sparse-moe-expert-airmol-liquidailfm25-8b-a1b-847b--qwenqwen36-35b-a3b-3466b" class="anchor-alias" aria-hidden="true"></div>

### 4.12 Anspruch LA-9: Grenzwertiges Sparse-MoE `Expert-AirMoL` (`LiquidAI/LFM2.5-8B-A1B` `8.47B` & `Qwen/Qwen3.6-35B-A3B` `34.66B`)

| Sparse-MoE-Checkpoint & Variante | Parität | Aktive Experten | Tok / Durchlauf | NVMe-Lesevorgang / Tok | E/A-Reduktion | Spitzen-RAM (`% FP16`) | `tok/s` | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `AirLLM` dicht 4-Bit (`T=1`) | `100%` | `100.00%` | `1.00` | `4.574 GB` | `1.00×` | `1,408.3 MB` (`8.72%`) | `0.28` | `368.80` |
| `LFM2.5-8B-A1B` · `Expert-AirLLM` (`T=1`) | `100%` | `16.93%` | `1.00` | `1.200 GB` | `3.81×` | `1,408.3 MB` (`8.72%`) | `0.58` | `181.26` |
| `LFM2.5-8B-A1B` · `Expert-AirMoL` + `PLD` | `100%` | `28.82%` | `1.78` | `0.883 GB` | `5.18×` | `1,408.3 MB` (`8.72%`) | `0.79` | `132.57` |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` kalt `LUT6`** | **`100%`** | **`33.91%`** | **`1.85`** | **`1.002 GB`** | **`4.56×`** | **`1,408.3 MB` (`8.72%`)** | **`0.72`** | **`145.42`** |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` nach dem Aufwecken** | **`100%`** | **`36.46%`** | **`3.00`** | **`0.663 GB`** | **`6.90×`** | **`1,408.3 MB` (`8.72%`)** | **`1.10`** | **`95.67`** |
| `Qwen3.6-35B-A3B` · `AirLLM` dicht 4-Bit (`T=1`) | `100%` | `100.00%` | `1.00` | `18.159 GB` | `1.00×` | `3,214.7 MB` (`4.86%`) | `0.06` | `1,696.81` |
| `Qwen3.6-35B-A3B` · `Expert-AirLLM` (`T=1`) | `100%` | `6.35%` | `1.00` | `2.356 GB` | `7.71×` | `2,530.7 MB` (`3.83%`) | `0.22` | `471.87` |
| `Qwen3.6-35B-A3B` · `Expert-AirMoL` + `PLD` | `100%` | `11.58%` | `1.89` | `1.708 GB` | `10.63×` | `2,530.7 MB` (`3.83%`) | `0.32` | `326.24` |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` kalt `LUT6`** | **`100%`** | **`12.91%`** | **`2.00`** | **`1.722 GB`** | **`10.54×`** | **`2,530.7 MB` (`3.83%`)** | **`0.31`** | **`334.42`** |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` nach dem Aufwecken** | **`100%`** | **`14.97%`** | **`2.57`** | **`1.477 GB`** | **`12.30×`** | **`2,530.7 MB` (`3.83%`)** | **`0.39`** | **`267.08`** |

Auf `Qwen/Qwen3.6-35B-A3B` (`34.66B` Parameter, `66.11 GB` FP16, aufgeteilt in `18.60 GB` 4-Bit-`.experts.pack4`-Dateien; systemweites macOS-`PMU`-Delta `20,070.18 J`) reduziert das `Expert-AirMoL` nach dem Aufwecken die ungepufferte NVMe-Übertragung um **`12.30×`** (`18.159` auf `1.477 GB/Tok`) und beschleunigt die Dekodierung um **`6.50×`** (`0.06` auf `0.39 tok/s`) bei **`2,530.7 MB` aktivem RAM (`3.83%` von FP16)** und `100.0%` verlustfreier Token-Parität.

<div id="410-claim-la-10-sub-1-bit-latent-factorization-littlebit-1--littlebit-2-vs-zero-mac-sub1bit-lut6" class="anchor-alias" aria-hidden="true"></div>

### 4.10 Behauptung LA-10: Sub-1-Bit latente Faktorisierung (`LittleBit-1 / LittleBit-2`) vs. Null-MAC `Sub1Bit-LUT6`

| Faktorisierungsmethode (`LFM2.5-8B-A1B` `w1 [1792, 2048]`) | Bits / Gewicht | Gewichts-SNR | Kosinus-Ähnlichkeit | `16K` Top-1 Treffer | Binäre MACs / Tok | QAT-Epochen | Evidenzklasse |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` Unrotated `SVD` SVID (`LittleBit-1` PTQ style) | `0.576` (`27.8×`) | `1.76 dB` | `0.5761` | `3.12%` | `1,981,440` | `0` (`5` in paper) | Gemessene SW |
| `B` Procrustes `ITQ` SVID (`LittleBit-2` PTQ style) | `0.576` (`27.8×`) | `2.42 dB` | `0.6487` | `10.94%` | `1,981,440` | `0` (`5` in paper) | Gemessene SW |
| **`C` `Sub1Bit-LUT6` Tabellenabfrage (`0` MACs, Entwurf)** | **`0.576` (`27.8×`)** | **`2.42 dB`** | **`0.6487`** | **`10.94%`** | **`0`** | **`0`** | **Gemessen (`< 4e-6` vs. `B`)** |
| `D` `Expert-AirMoL` `INT4` Block-64 Ziel | `4.500` (`3.56×`) | `20.77 dB` | `0.9958` | `82.81%` | `0` (`INT4`) | `0` | Gemessene SW |
| **`E` `MoL`: `Sub1Bit-LUT6` Entwurf + Ziel-Verifikation** | **`0.576` Entwurf** | **`148.84 dB`** | **`1.0000`** | **`100.00%`** | **`0` Entwurf-MACs** | **`0`** | **Gemessene verlustfreie Parität** |

<div id="411-claim-la-11-48-task-16-specifications--3-waves-late-2026-frontier-coding-bakeoff" class="anchor-alias" aria-hidden="true"></div>

### 4.11 Behauptung LA-11: `48`-Aufgaben-(`16` Spezifikationen × `3` Wellen) Frontier-Coding-Bakeoff Ende 2026

| Spätes-2026-Systemarm (`48` Aufgaben = `16` Spezifikationen × `3` Wellen) | W1 Kalt | W2 Adapt | W3 Warm | Gesamterfolg | Fehlgeschlagene Commits | W3 `Rung 0/1`-Anteil | `35B`-Aufrufe | Mittlere W3-Latenz |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT (`1`-Shot) | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `19.946 ms` |
| `B` `LiquidAI/LFM3-1.7B` (Okt. 2026 Tri-Hybrid, `1`-Shot) | `18.75%` | `6.25%` | `6.25%` | `10.42%` | `89.58%` | `0.00%` | `0.0%` | `3.561 ms` |
| `C` `google/gemma-4-E2B-it` (`2026` Hybrid, `1`-Shot) | `6.25%` | `0.00%` | `0.00%` | `2.08%` | `97.92%` | `0.00%` | `0.0%` | `8.886 ms` |
| `D` `LiquidAI/LFM2.5-8B-A1B` (`8.47B` MoE, `1`-Shot) | `18.75%` | `12.50%` | `12.50%` | `14.58%` | `85.42%` | `0.00%` | `0.0%` | `14.221 ms` |
| `E` `Qwen/Qwen3.6-35B-A3B` (`34.66B` `Expert-AirMoL`, `1`-Shot) | `37.50%` | `31.25%` | `31.25%` | `33.33%` | `66.67%` | `0.00%` | `100.0%` | `98.435 ms` |
| `F` `RouteLLM` Confidence Router (`LFM3` $\to$ `Gemma4` $\to$ `8B`) | `18.75%` | `6.25%` | `6.25%` | `10.42%` | `89.58%` | `0.00%` | `0.0%` | `3.561 ms` |
| **`G` `MoL` `VerifiedCodeCascade` (Referenz)** | **`43.75%`** | **`43.75%`** | **`43.75%`** | **`43.75%`** | **`0.00%`** | **`43.75%`** | **`62.5%`** | **`143.649 ms` (`2.54 ms` gelöst)** |

Über das `48`-Aufgaben-Protokoll und den Algorithmus-Benchmark (RFC-1982 serielle Arithmetik, gewichtete Intervall-Sweeplines, zyklussichere lexikografische topologische Sortierung, Nanosekunden-Token-Buckets, CRC-8/ATM und mutiertes `0xFF` CRC-8, RFC-6901 JSON-Pointer `~01`-Unescaping, hop-beschränkter Bellman-Ford, `>2⁵³` exakte Fenster-Mediane, uneingeschränkte Damerau-Levenshtein, `4×4` Beneš-Routing, SQL-Literal-Parametrisierung, monotoner Deque-Teilsequenz-Summe, DWARF SLEB128, SHA-256 konsistentes Hashing sowie konforme Quantile; ganzheitliches macOS-`PMU`-Delta `126.947,30 J`), übertrifft `VerifiedCodeCascade` jedes eigenständige Modell und jeden Router in jeder Welle (`43.75%` gegenüber `33.33%` beim `35B`), lässt **`0.00%` fehlgeschlagene Commits** zu (gegenüber `66.67%-100.00%`), fängt alle `3` Wave-2/3-adversariellen Spec-Drift-Lookups über $C(z)$ sicher ab und senkt die mittlere Wave-3-Latenz über die `7` kristallisierten Fähigkeiten von **`90.324,2 ms`** auf **`2.54 ms` (`35.590×` Beschleunigung)**.

<div id="412-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.9 Aufschlüsselung der Primitive des Gesamtsubsystems, topologische Tiefe und `Vivado 2026.1`-Hardwaresonde

Zur Prüfung sowohl des eigenständigen spekulativen Kerns mit 512 Seiten (`clai_benes_paged_hotswap_core` in `hw/kv260/rtl/clai_benes_hotswap_core.sv`) als auch des vollständigen Rung-0-Subsystems mit AMBA-`AXI4-Lite`- und `AXI4-Stream`-Schnittstellen (`clai_kv260_axi_top` in `hw/kv260/rtl/clai_kv260_axi_top.sv`, `clai_engram_streamer.sv`, `clai_rung0_hotswap_core.sv` sowie `artifacts/clai_rung0_kv260.v` am Commit `a5e9bc1de280`) gegen das exakte AMD-Kria-KV260-Bauteil (`xck26-sfvc784-2LV-c`: 117,120 CLB-LUTs, 234,240 CLB-Flipflops, 144 `RAMB36E2`-Blöcke, 64 UltraRAM-Blöcke mit 288 Kbit (`URAM288`), 1.248 DSP-Scheiben vom Typ `DSP48E2` (UltraScale+) und 189 Ein-/Ausgabeblöcke des Anwenders (`IOB`s)) wurden drei Hardware- und Entwurfsautomatisierungs-(`EDA`)-Prüfungen auf einer Arbeitsstation mit `Intel Core i9-13900H` (Linux 7.0.0-43-generic x86-64) durchgeführt:

1. **Nur-Lese-Joint-Test-Action-Group (`JTAG`) & Universal Serial Bus (`USB`)-Probe (`Xilinx hw_server v2026.1` + Xilinx Software Command-Line Tool (`XSDB`))**: Obwohl `lsusb` einen angeschlossenen Future Technology Devices International (`FTDI`) `0403:6010` (`FT2232C/D/H` dual universal asynchronous receiver-transmitter (`UART`) / first-in first-out (`FIFO`) integrated circuit (`IC`)) Bridge meldete, identifizierte die Inspektion der Linux `sysfs` USB vendor/product strings (`idVendor = 0403`, `idProduct = 6010`) das Gerät als `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"` statt eines Kria KV260-Trägers. Die Abfrage von `hw_server v2026.1` (Build May 29, 2026) via `xsdb` (`connect; jtag targets; targets`) ergab **`0` Xilinx `JTAG` devices and `0` Debug Access Port (`DAP`) targets** (`board_metered = false`, `measured_j = None`).

2. **`Vivado 2026.1` Batch-Synthese und Lizenzierungs-Gate (`SW Build 6511674`)**: Ein reproduzierbares low-footprint non-project Batch-Script (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, targeting `xck26-sfvc784-2LV-c` at `250.0 MHz` / `4.000 ns` in out-of-context (`OOC`) mode) wurde gegen `/tools/Xilinx/2026.1/Vivado/bin/vivado` gestaged. Das Starten von `vivado v2026.1` im Batch-Modus beendete vor `synth_design` (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`), weil AMD `Vivado 2025.1+` / `2026.1` eine explizite benutzer-generierte Standard/Enterprise `.lic`-Datei (`~/.Xilinx/Xilinx.lic` oder `XILINXD_LICENSE_FILE`) selbst für Standard-Tier `xck26` Teile verlangt und keine `.lic` Dateien auf dem Workstation installiert waren. Nach strengen Messregeln bleiben post-route `WNS`, platzierte-und-geroutete maximale Taktfrequenz und vektorloses `report_power` (`est_j`) als `not_available` vermerkt, bis eine Standard `.lic` Datei bereitgestellt wird.

3. **Voll-Subsystem UltraScale+ `xcup` Primitive-Dekomposition, `IOB`-Budget und topologische Logik-Ebenen-Audit (`Yosys 0.71+`)**: Das Synthese-Durchführen von sowohl `clai_benes_paged_hotswap_core` als auch `clai_kv260_axi_top` mittels `synth_xilinx -family xcup` und `ltp -noff` (während die Host-`RAPL package-0` `reported_j` streng als `x86-64` `EDA` compilation cost $E_{\text{compile}}$, never as FPGA silicon power) etablierte exakte Zellzahlen und kritische Pfad-kombinatorische Tiefen:

| `xck26-sfvc784-2LV-c`-Zielmodul | CLB-LUTs (`% xck26`) | Dominante LUT-Primitive | CLB-Register (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | Top-Ports (`IBUF`+`OBUF`) | Kombinatorische Tiefe (`ltp`) | Host-Synthese-`RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` Seiten) | **`41.185`** (`35,17 %`) | `19.982 LUT3`, `7.804 LUT6`, `7.714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36.464`** (`15,57 %`) | **`81`** (`56,25 %`) | **`0`** | `1.599` (`OOC` / interner Bus) | **`81` Stufen** | `7.297,3 J` (`144,8 s`) |
| **`clai_kv260_axi_top`** (`AXI4` Rung-0-Subsystem) | **`67.366`** (`57,52 %`) | `25.557 LUT6`, `25.333 LUT5`, `7.918 LUT3`, `569 CARRY4` | **`16.619`** (`7,09 %`) | **`4`** (`2,78 %`) | **`0`** | `126` (`<= 189` `IOB`s; `PS-PL`) | **`73` Stufen** | `10.089,4 J` (`214,8 s`) |

Zwei konkrete physikalische Entwurfsrestriktionen ergeben sich aus der `xcup`-Primitive und der `ltp`-Prüfung:
- **Pin-Budget-Einschränkung (`OOC` vs. `PS-PL` `AXI`-Wrapper)**: Da `clai_benes_paged_hotswap_core` den rohen `512`-bit-`CodeBitBus` und breite Schattenkonfigurationsvektoren offenlegt (`1.379` Eingangspuffer (`IBUF`) + `220` Ausgangspuffer (`OBUF`) = `1.599` Ports gegenüber `189` Gehäuse-`IOB`s auf `xck26-sfvc784-2LV-c`), muss die eigenständige Herstellerimplementierung mit `synth_design -mode out_of_context` oder innerhalb eines `AXI4-Stream`- / `zynq_ultra_ps_e`-Wrappers wie `clai_kv260_axi_top` (`126` Ports, `57,52 %` LUT-Auslastung) ausgeführt werden.
- **Ungepipelinete kombinatorische Tiefe (`81` und `73` Stufen) vs. `250 MHz` (`4,000 ns`) `-2LV`-Abschluss**: Während Verilator `5.054` zyklusgenaues `CPI = 1,0` (`1` Nachschlagevorgang pro Taktzyklus) verifiziert, umfasst das Durchlaufen von `17` `Beneš-1`-Stufen + `9` Präfixkopierstufen + `17` `Beneš-2`-Stufen + dynamischem `LUT6`-Wahrheitstafelmultiplexing + `5`-Wähler-Mehrheitsreduktion in einem einzigen kombinatorischen Zyklus **`81` primitive Stufen** (`73` Stufen in der kombinatorischen `64`-Eingangs-Popcount und dem Top-`2`-Vergleicher von `clai_kv260_axi_top`). Der Abschluss bei `250 MHz` (`4,000 ns`) nach Platzierung und Verdrahtung auf Niederspannungs-(`0,72 V`) `-2LV`-Silizium begünstigt daher das Einfügen von `2` bis `3` Pipeline-Registerstufen über $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ (und `1` Registerstufe zwischen dem `64`-Leitungs-Popcount-Baum und dem Top-`2`-Vergleicher), wobei der `CPI = 1,0`-Durchsatz (`1` Kontext pro Takt) bei `3`-`4` Taktzyklen Pipeline-Latenz erhalten bleibt.

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Verwandte Arbeiten und Beobachtungen zur Konvergenz

| System | ID / Venue | Was es etabliert | Kosten wie berichtet | Unterschied in dieser Referenz |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Sparse quantisierte neuronale Schichten, die in FPGA-LUTs kompiliert werden. | FPGA-LUT- und Fmax-Synthese. | Statische Leitungen benötigen Vivado-Neuparallelisierung bei Verschiebung gegenüber `1`-Zyklus-Beneš + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Differenzierbare Boolesche Gatter und gewichtslose LUT-Netzwerke. | Gatteranzahlen und Genauigkeit. | Statisches Routing fällt auf `52.34%` bei VLAN-Verschiebung und leidet unter marginalen Bitplane-Chimären. |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Ternäre / niedrigbitige Matrixprodukte mittels Tabellenabfragen auf CPU/FPGA. | Latenz und FPGA-Leistungsaufnahme. | Beschleunigt lineare Algebra innerhalb eines Modellgetriebes; umgeht nicht den Modellaufruf. |
| **LittleBit** (Lee et al., 2025) & **LittleBit-2** (Lee and Kim, 2026) | `arXiv:2506.13771` · `arXiv:2603.00042` | Sub-1-Bit-(`0.1-0.58` Bits/Gewicht) binäre latente Faktorisierung mittels `SVD` / `ITQ` + `5`-Epochen-QAT. | Kompression (`11.6×-31×`), PPL und QAT-Genauigkeit. | Entpackt Bitpacks zu dichten Laufzeit-binären MACs und fällt auf `0.00%` bei exakter Codierung (`Claim LA-11`); `Sub1Bit-LUT6` verwendet `0` binäre MACs und `MoL` stellt `100.0%` Parität in `0` QAT-Epochen wieder her. |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Schwach-zu-stark-LLM-Kaskaden und Präferenzrouter. | API-Dollarpreis gegenüber Qualität. | Fehlt ein deterministisches $C(z)$-Gatter (`89.58%` fehlerhafte Commits in `Claim LA-11`) und besitzt keinen `LUT6`-Abwärtskompilierer. |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Multi-LLM-Bandit-Routing und frequenzskalierte Bereitstellung. | GPU-Wh der Autoren (`Zeus` / `pyNVML`). | Optimiert GPU-Bereitstellung; diese Referenz kompiliert Aufweckungen in `0`-FLOP-`LUT6`-Seiten (`est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Neuronale MLP-, Draft-Baum- und Kaskaden-spekulative Entwerfer. | Wanduhr-Beschleunigung. | Erfordern Draft-FLOPs und Gewichtszugriffe gegenüber `0`-FLOP-`uint64`-`LUT6`-Seiten. |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Zero-FLOP-Prompt-n-Gramm- und Datenspeicher-Suffix-Trie-Entwerfer. | Latenzbeschleunigung (`0` FLOPs). | `PLD` verfehlt Off-Prompt-Token; `REST` verwendet variable Tries gegenüber `RAMB36E2`-Seiten. |
| **AirLLM** (lyogavin, 2023) | Open-source SSD streamer | Schichtweise SSD-Gewichtsstreaming in kleinem RAM. | Aktiver RAM-Fußabdruck. | Reines `T=1` (`1.0 tok/sweep`) + KV-Spill gegenüber `AirMoL` `2.74×-2.86×` Sweep-Reduktion. |
| **Metered Commit Gates** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Commit-Gatter (`11,428 pJ` KV260 `INA260` SOM-Ablesung), MoL $p_i/c_i$ und `RCE-JEPA`. | KV260 SOM `measured_j` + `est_j`. | Grundlage im gleichen Haus; hier erweitert um Beneš-`LUT6`-Abwärtskompilierung und `AirMoL`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. Grenzen, Bedrohungen der Validität, nicht beansprucht und Falsifikatoren

**Interne und Konstruktvalidität.** Unter gleichverteiltem Zufallsrauschen oder schrittweisem adversariellem Churn ($\Delta T = 1$) liefert Proposition 1 null Einsparungen bei der Abwärtskompilierung und fällt auf `1.00 tok/sweep` zurück. Verlustfreie Parität (`100.0%`) garantiert bitgenaue Übereinstimmung mit der gierigen Zieldecodierung, ohne die Fähigkeitsobergrenze eines `350M`- oder `0.8B`-Basismodells anzuheben.

**Messvalidität und nicht beansprucht.** Die aufgabenbezogenen Joule-Zahlen (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`) sind analytische `est_j`-Werte (`measured_j = None`), und die kumulativen Deltas des macOS-`PMU` umfassen die Last des gesamten Systems einschließlich Display, SSD und OS-Hintergrundprozessen anstelle isolierter Chip-Rail-Leistungsaufnahme. Yosys `0.71+` und Verilator `5.054` begründen die strukturelle `xck26`-Netlistsynthese und die `CPI = 1`-Zyklussimulation, nicht jedoch den Vivado-Post-PAR-`250 MHz`-Timing-Abschluss und nicht die physikalischen KV260-Rail-Wattwerte (`board_metered = false`). Silizium-Energie-Führerschaft, die Beförderung von `ModelGenerated`-Ausgaben zu `Deterministic`, die vollständige repository-weite `SWE-bench`-Auswertung jenseits der `48`-Aufgaben-Vertragsbenchmark sowie gemessene `70B`-Läufe (`air_mol_nvme_baselines.csv` berichtet analytische `70B`-Projektionen jenseits der gemessenen `34.66B`-`Qwen3.6-35B-A3B`-Läufe) werden nicht beansprucht.

| ID | Behauptung | Genaue Widerlegungs- / Falsifikationsbedingung |
| :--- | :--- | :--- |
| **`LA-F1`** | `Behauptung LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` scheitert an `100.0%` Verilator-Parität über `5.120` Pakete oder verfehlt die VLAN-Verschiebung bei Paket `2.500`. |
| **`LA-F2`** | `Behauptung LA-2` (Polyglot-Suite) | Zig allokiert `> 0` Heap-Bytes in der Hot-Loop, Go meldet `> 0 allocs/op`, oder Julia Enzyme überschreitet einen FD-Fehler von `1e-7`. |
| **`LA-F3`** | `Behauptung LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` überschreitet `117.120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s oder `1` Takt pro Seitenwechsel. |
| **`LA-F4`** | `Behauptung LA-4` (konforme ACI) | `scripts/run_frontier_benchmarks.py` überschreitet das Ziel-Fehlrisiko $\alpha = 0.02$ bei verschobenem Verkehr oder vergibt das Etikett `Deterministic`. |
| **`LA-F5`** | `Behauptung LA-5` (Byte-Speculation) | `scripts/run_code_corpus_benchmark.py` liefert `< 100.0%` exakte Byte-Parität gegenüber dem gierigen `Mamba3CodeLM` über `48` ungesehene Prompts. |
| **`LA-F6`** | `Behauptung LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` unter `F_NOCACHE` verfehlt `100%` Parität oder liest mehr NVMe-Bytes als `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Behauptung LA-7` (HF-`AirMoL` 2026) | `scripts/run_hf_lfm3_air_mol.py`, `scripts/run_hf_air_mol_pretrained.py` oder `scripts/run_hf_qwen35_air_mol.py` weicht um $\ge 1$ BPE-Token vom gierigen Zielmodell ab. |
| **`LA-F8`** | `Behauptung LA-8` (Regressionssuite) | `pytest -v` scheitert an einem der `22` Tests in `tests/`. |
| **`LA-F9`** | `Behauptung LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` weicht von `100%` Token-Parität ab oder liest mehr NVMe-Bytes als `AirLLM` oder `Expert-AirLLM`. |
| **`LA-F10`** | `Behauptung LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` überschreitet einen maximalen Fehler von `1e-3` gegenüber der dichten binären `ITQ`-Matrixmultiplikation oder verfehlt `100%` verifizierte Parität. |
| **`LA-F11`** | `Behauptung LA-11` (`48`-Aufgaben-Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` lässt `> 0%` fehlerhafte Commits zu oder akzeptiert einen veralteten Wave-1-Skill unter einer Wave-2-Spezifikationsmutation. |

---

<div id="7-references" class="anchor-alias" aria-hidden="true"></div>

## 7. Referenzen

<ol data-refs>
<li>Bacellar, A., et al. (2024). Differentiable Weightless Neural Networks. <em>arXiv:2410.11112</em>.</li>
<li>Beneš, V. E. (1965). <em>Mathematical Theory of Connecting Networks and Telephone Traffic</em>. Academic Press.</li>
<li>Cai, T., Li, Y., Geng, Z., Peng, H., Lee, J. D., Chen, D., and Dao, T. (2024). Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads. <em>ICML 2024</em>, <em>arXiv:2401.10774</em>.</li>
<li>Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. <em>arXiv:2305.05176</em>.</li>
<li>Dao, T., and Gu, A. (2024). Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality. <em>ICML 2024</em>, <em>arXiv:2405.21060</em>.</li>
<li>Furao, S., and Hasegawa, O. (2006). An incremental network for on-line unsupervised classification and topology learning (SOINN). <em>Neural Networks</em>, 19(1):90-106.</li>
<li>Gibbs, I., and Candès, E. (2021). Adaptive Conformal Inference Under Distribution Shift. <em>NeurIPS 2021</em>, <em>arXiv:2106.00170</em>.</li>
<li>Google Gemma Team (2026). <code>google/gemma-4-E2B-it</code> On-Device Hybrid Instruction Model Card (2026). <a href="https://huggingface.co/google/gemma-4-E2B-it">huggingface.co/google/gemma-4-E2B-it</a>.</li>
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Lee, H., Kim, M., Baek, S., Kim, J., Hwang, S., Shin, J., Lee, J., and Kim, E. (2025). LittleBit: Ultra Low-Bit Quantization via Latent Matrix Factorization. <em>NeurIPS 2025</em>, <em>arXiv:2506.13771</em>.</li>
<li>Lee, H., and Kim, E. (2026). LittleBit-2: Pushing the Frontier of Extreme LLMs Quantization into 0.1-Bit (<code>SamsungLabs/LittleBit</code>). <em>ICML 2026</em>, <em>arXiv:2603.00042</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455-1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094-1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026a). <code>LiquidAI/LFM2.5-350M</code> and <code>LiquidAI/LFM2.5-8B-A1B</code> Hybrid and Sparse-MoE Open-Weights Model Cards. <a href="https://huggingface.co/LiquidAI/LFM2.5-8B-A1B">huggingface.co/LiquidAI/LFM2.5-8B-A1B</a>.</li>
<li>Liquid AI (2026b). <code>LiquidAI/LFM3-1.7B</code> Tri-Hybrid Open-Weights Model Card (October 23, 2026). <a href="https://huggingface.co/LiquidAI/LFM3-1.7B">huggingface.co/LiquidAI/LFM3-1.7B</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026a). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
<li>Qwen Team (2026b). <code>Qwen/Qwen3.6-35B-A3B</code> Sparse-MoE Hybrid Gated DeltaNet + Attention Model Card (2026). <a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B">huggingface.co/Qwen/Qwen3.6-35B-A3B</a>.</li>
<li>Saxena, A. (2023). Prompt Lookup Decoding. <a href="https://github.com/apoorvumang/prompt-lookup-decoding">github.com/apoorvumang/prompt-lookup-decoding</a>.</li>
<li>Simon, H. A., and Kadane, J. B. (1975). Optimal Problem-Solving Search: All-or-None Solutions. <em>Artificial Intelligence</em>, 6(3):235-247.</li>
<li>Thompson, C. D. (1978). Generalized Connection Networks for Parallel Processor Intercommunication. <em>IEEE Trans. Comput.</em>, C-27(12):1119-1125.</li>
<li>Umuroglu, Y., Akhauri, Y., Fraser, N. J., and Blott, M. (2020). LogicNets. <em>FPL 2020</em>, <em>arXiv:2004.03021</em>.</li>
<li>VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. <em>arXiv:2509.04827</em>.</li>
<li>Vovk, V., Gammerman, A., and Shafer, G. (2005). <em>Algorithmic Learning in a Random World</em>. Springer.</li>
<li>Waksman, A. (1968). A Permutation Network. <em>Journal of the ACM</em>, 15(1):159-163.</li>
<li>Wei, J., et al. (2024). T-MAC: CPU Renaissance via Table Lookup for Low-Bit LLM Deployment. <em>arXiv:2407.00088</em>.</li>
</ol>

---

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## Anhang A. Reproduzierbarkeit

Aus einem Checkout von [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit a5e9bc1`):

```bash
PYTHONPATH=src .venv/bin/pytest -v
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_lfm3_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_moe_8b_35b_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_sub1bit_lut_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
```
