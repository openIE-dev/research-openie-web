---
title: "Abwärtskompilierung auf LUT6 in einer Kaskade nach Mixture of Limits: Beneš-geroutete Boolesche Verbindungsnetze, konforme Aufwecktore und grenzwertiges Sparse-MoE-NVMe-Streaming"
deck: "Eine Mixture-of-Limits-Kaskade mit 36 über sechs Kernels verifizierten Lean-4.36.0-Theoremen (zuzüglich 1,400 Theoremen über vier Open-Interface-Engineering-Repositories innerhalb von Linux-bubblewrap-Sandboxes, gehärtet gegen Common Vulnerabilities and Exposures (CVE)-2026-72844), die zunächst seitenweise 6-Eingangs-Lookup-Table-Schaltungen (LUT6) ohne Gleitkommaoperationen (FLOP) sowie einen 4 Kilobyte großen, ohne Standardbibliothek auskommenden Rust-lut6-core-Nucleus erprobt (0.154 Millisekunden im Einzelbinärprogramm mol-agent-rs in Rust, 125.23 Nanojoule pro Bit-Sliced-Entscheidung und 25.06% der 64 Kilobyte SRAM von Nordic nRF52832 Cortex-M4F und RISC-V RV32IMAC), über geschleifte, hybride und dünnbesetzte 4-Bit-Non-Volatile-Memory-Express-(NVMe)-Mixture-of-Experts-(MoE)-Modelle von Ende 2026 mit bis zu 120B Parametern (darunter Thinking Machines Lab Inkling-2-Mini und Nemotron-Labs-Dory1.0-4B) über vier Grafikprozessor-(GPU)-Siliziumhersteller hinweg eskaliert (bis zu 328.06x Beschleunigung), Commits über deterministische Verifizierer auf 4 Upstream-Verified-Software-Engineering-Repositories schaltet und zertifizierte Aufweckvorgänge abwärts in taktfreigabegesteuerte, Beneš-geroutete 36-Kbit-Block-RAMs (RAMB36E2 sowie 7-Series XC7A200T RAMB36E1 M.2 2280) und Wobble-Codon-Kristallseiten kompiliert. Umfasst physikalische Gleichstrom-(DC)-Shunt-Messwerte measured_j von Texas Instruments auf Tegra aarch64 Jetson Thor (85.28x Bit-Sliced-lut6-core-, 3.74x Sub1Bit-LUT6-, 34.21x Expert-AirMoL- und 10.94x Proposition-1-Kompilierungs-Energieeinsparung; board_metered ist wahr), strikt getrennt von Live-Zykluszählungen auf Alif Ensemble Cortex-M55, On-Chip-Zählern reported_j auf fünf Hosts sowie simulierten Register-Transfer-Level-(RTL)-Schätzungen est_j für xck26 und XC7A200T bei Commit 75533d5."
lang: "de"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*Revision 75533d5, 24. November 2026. Referenzimplementierung und Artefakte: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) bei [`75533d5df16f9d46b6abbe70dc3bfb87fc0c973e`](https://github.com/openIE-dev/lut-adapt-ai/tree/75533d5df16f9d46b6abbe70dc3bfb87fc0c973e). Datenzusammenfassung: [/data/#lut-adapt](/data/#lut-adapt). LaTeX-PDF: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([Quelltext](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Überblick

Diese Studie untersucht, wie ein Rechensystem wiederkehrende Arbeit neuronaler Modelle abwärts in schnelle boolesche Tabellenabfragen und zertifizierte kanonische Fertigkeiten kompilieren kann, ohne die exakte Ausgabeparität zu verlieren und ohne ungeprüfte Vermutungen in vertrauenswürdige Regeln zu überführen. Vier Evidenzklassen bleiben über sämtliche Behauptungen hinweg strikt getrennt: physikalische Joule-Messwerte über Board-Stromshunts von Texas Instruments (`measured_j`, `board_metered = true` auf Tegra `aarch64` Jetson Thor ausschließlich in §4.26 und §4.30), Betriebssystem- und On-Chip-Hardware-Energiezähler zuzüglich Hardware-Zykluszählern auf Bare-Metal-Mikrocontrollern (`reported_j` über fünf Linux-, macOS- und Windows-11-Workstations sowie Live-Zykluszählungen auf einem angeschlossenen Alif Ensemble Cortex-M55, `board_metered = false`), Synthesen auf Register-Transfer-Ebene, erschöpfende Boolesche Miter-Prüfungen und Zyklensimulationen (`xck26` und 7-Series `XC7A200T`, `board_metered = false` für alle FPGA-Behauptungen) sowie gekennzeichnete analytische Energie- und elektrothermische Hüllkurvenschätzungen (`est_j`).

**Einfach ausgedrückt**

1. Die meisten Eingaben, die ein bereitgestelltes System sieht, wiederholen Muster, die es bereits gelöst hat, sodass die Ausführung eines vollständigen Gleitkomma-Neuralnetzes bei jedem Schritt Rechen- und Speicherbandbreite verschwendet.
2. Die Referenz platziert eine rekonfigurierbare 6-Eingangs-Wahrheitstabellen-Stufe (`LUT6`) und einen 4 Kilobyte großen Bare-Metal-Rust-Nucleus `lut6-core` (der in `25.06%` eines `64` Kilobyte großen Mikrocontroller-SRAMs oder in die `365` On-Die-Block-RAMs einer M.2-`2280`-`XC7A200T`-Karte passt) vor Streaming-Zustandsraum-, geschleiften und Grundlagenmodellen und kompiliert Antworten erst dann abwärts in Lookup-Speicherseiten, nachdem eine explizite Prüfung sie zertifiziert hat.
3. Wenn geschleifte, hybride und dünnbesetzte Mixture-of-Experts-Sprachmodelle von Ende 2026 mit bis zu `120B` Parametern (`12B` aktiv, zuzüglich der geschleiften Modelle `thinkingmachines/Inkling-2-Mini` und `Nemotron-Labs-Dory1.0-4B` vom Oktober-November 2026) lokal auf Apple Silicon über benutzerdefinierte fusionierte Apple-Metal-Shader, portable Rust-Shader mit `Burn 0.22.1 / CubeCL` sowie das Einzelbinärprogramm `mol-agent-rs` in Rust (`0.154` Millisekunden pro Fertigkeitsabfrage) laufen, senken router-dünnbesetzte Experten-Lesevorgänge in Verbindung mit diesem `LUT6`-Vorschlagenden ohne Gleitkommaoperationen die Plattenzugriffe auf `Qwen/Qwen3.6-35B-A3B` um bis zu `12.30×` (`970.0` Megabyte aktiver Gewichtsspeicher), verkürzen tiefenrekurrente Vorwärtsdurchläufe geschleifter Modelle um `4.00×` (`3.52×-3.95×` gemessene Beschleunigung bei `100%` gieriger Parität) und halten auf `nvidia/Nemotron-3-Super-120B-A12B` innerhalb von `58.08` Gigabyte Unified Memory `22.17` Tokens pro Sekunde aufrecht; das Absichern von Code- und Repository-Commits hinter deterministischen `unittest`- und `pytest`-Prüfungen erreicht **`91.67%` verifizierte Bestehensrate (`93.75%` über Welle 2 und Welle 3)** im algorithmischen Vergleich mit `48` Aufgaben, **`90.62%` (`93.75%` auf menschlichen Paraphrasen in Welle 2)** im offiziellen `BigCodeBench v0.1.3`, **`50.00%`** auf Einzel-Repository-Git-Arbeitsbäumen von `SymPy`, **`20.83%` (`2.50×` gegenüber eigenständigen `24B`- und `35B`-Modellen)** über `4` Upstream-Verified-Repositories von `princeton-nlp` (`django`, `pytest`, `requests` und `sympy`) sowie **`62.50%`** auf der harten `120B`-Frontier-Suite bei **`0.00%` zugelassenen fehlerhaften Commits**.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Begriffe, Akronyme und Messbezeichnungen

<ul id="terms">
<li>MoL: Mixture of Limits, die Kaskadenregel aus Metered Commit Gates Teil II [gleiches Haus]</li>
<li>LA: Anspruch- und Falsifikator-Präfix (LA-1 bis LA-30, LA-F1 bis LA-F30), das in dieser Studie verwendet wird</li>
<li>LUT, LUT6, INIT: Look-up-Tabelle, 6-Eingangs-Xilinx-UltraScale+-Boolesches Primitiv und dessen 64-Bit-Wahrheitstafelmaske zur Initialisierung</li>
<li>BRAM, RAMB36E2, URAM: Block-RAM, das 36-Kbit-Dual-Port-UltraScale+-Block-RAM-Primitiv (144 auf xck26) und UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: konfigurierbarer Logikblock, Flip-Flop, Digital-Signal-Processing-Slice und AMD-Kria-KV260-Board (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: Field-Programmable Gate Array, anwendungsspezifische integrierte Schaltung, Register-Transfer-Level, Zyklen pro Nachschlageoperation, Place-and-Route, Worst Negative Slack und Field-Programmable Logic Conference</li>
<li>AXI, AXIS, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU, SMC, L1, L2, L3: Advanced eXtensible Interface, AXI4-Stream-Wrapper-Präfix, Zynq-Verarbeitungssystem, programmierbare Logik, System-on-Module, Onboard-Leistungsüberwachungs-IC, Versorgungsschiene, Intel Running Average Power Limit, NVIDIA Management Library, macOS-Leistungsverwaltungseinheit, Apple System Management Controller, Gesamtboard-Spannungseingangsschiene der Ebene 1, Subsystem-Energiezähler der Ebene 2 (Apple IOReport GPU Energy und Tegra-Schienenshunt) und prozessbezogener CPU-Energiezähler der Ebene 3 (Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj)</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: State Space Duality, Zustandsraummodell, Multiple-Input-Multiple-Output, Rotary Position Embedding, Gated Linear Unit-Aktivierung, Grouped-Query Attention, Key-Value-Cache, Byte-Pair Encoding, Large Language Model(s), Mixture-of-Experts, Multilayer Perceptron und kontextfreie Grammatik</li>
<li>HC, SOINN, WNN, DWN: Hierarchy-Context Self-Organizing Incremental Neural Network, Weightless Neural Network und Differentiable Weightless Neural Network</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: Joint-Embedding Predictive Architecture, Energy-Based Reasoning Model, Adaptive Conformal Inference, Out-of-Distribution, Area under the Receiver Operating Characteristic, Maximum Softmax Probability und Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF: Prompt Lookup Decoding, Retrieval-Based Speculative Decoding, Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LFM2.5-350M und LFM2.5-8B-A1B), Liquid Foundation Model 3 (Oct 2026 LiquidAI/LFM3-1.7B) und HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR: Singulärwertzerlegung, Iterative Quantization Procrustes Hypercube Rotation, Sign-Value-Independent Decomposition, Quantization-Aware Training, Post-Training Quantization, Perplexity und Signal-Rausch-Verhältnis</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, RSS, GGUF, IO, KB, MB, GB, GiB: Non-Volatile-Memory-Express-Speicher, ungepuffertes Darwin-Dateiflag F_NOCACHE, Portable Operating System Interface, wahlfreier Zugriffsspeicher, dynamisches RAM, statisches RAM, Resident Set Size im physischen Unified Memory, quantisierte Modelldatei im GPT-Generated Unified Format, Eingabe/Ausgabe, Kilobyte, Megabyte, Gigabyte und Gibibyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, BF16, FP16, FP32, INT4, ULP, MSL, MPS, CUDA, ROC, SPIR, PTX, HIP, LLVM: Gleitkommaoperation(en), Millionen FLOPs, Multiply-Accumulate-Operation(en), Single-Instruction Multiple-Data, automatische Differenzierung, finite Differenzen, Bits pro Byte, Brain Float 16, 16/32-Bit-IEEE-Gleitkomma, 4-Bit-Ganzzahl, Unit in the Last Place, Apple Metal Shading Language, PyTorch Metal Performance Shaders, NVIDIA Compute Unified Device Architecture, AMD-ROCm-Laufzeitumgebung, Standard Portable Intermediate Representation (Vulkan SPIR-V), Parallel Thread Execution, Heterogeneous-Compute Interface for Portability und Low-Level-Virtual-Machine-Compiler-Backend</li>
<li>RCE, WCA, VC, BCB, SWE, OSA, DP: Reality Code Engine [gleiches Haus], Wise Computer Automation [gleiches Haus], verifizierte Vervollständigung, Benchmark BigCodeBench v0.1.3, Präfix für Software-Engineering-Benchmarks, optimale String-Ausrichtung und dynamische Programmierung</li>
<li>CLI, HTTP, GET, POST, SSE, API, MCP, RPC, IDE, SDK, CORS, URL, ORM, IDNA, CADE, LNCS, NVIDIA, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW, TDP: Befehlszeilenschnittstelle, Hypertext Transfer Protocol und seine GET/POST-Anfragemethoden, Server-Sent Events, Programmierschnittstelle, Model Context Protocol, Remote Procedure Call (JSON-RPC 2.0), integrierte Entwicklungsumgebung, Software-Entwicklungskit, Cross-Origin Resource Sharing, Uniform Resource Locator, objektrelationaler Mapper, Internationalized Domain Names in Applications, Conference on Automated Deduction, Lecture Notes in Computer Science, NVIDIA Corporation, akademische Informatik- und Ingenieurkonferenzen, Betriebssystem, zentrale bzw. Grafik-Verarbeitungseinheit, Software und thermische Designleistung</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XOR, XNOR, JWT, HMAC, DAG, CIDR, LRU, TTL, WAL, ETL: virtuelles lokales Netzwerk (IEEE 802.1Q), Transport Layer Security, Deep Packet Inspection, abstrakter Syntaxbaum, JavaScript Object Notation, kommagetrennte Werte, Secure Hash Algorithm, zyklische Redundanzprüfung, Asynchronous Transfer Mode (CRC-8/ATM), Request for Comments, Structured Query Language, DWARF-kodierte vorzeichenbehaftete Little-Endian-Base-128-Kodierung, inhaltsadressierbarer Speicher, exklusives ODER, exklusives NOR, JSON Web Token, hash-basierter Message-Authentication-Code, gerichteter azyklischer Graph, Classless Inter-Domain Routing, am wenigsten kürzlich genutzter Cache, Time-to-Live-Ablauf, Write-Ahead-Log und Extract-Transform-Load-Pipeline</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, CARRY8, DSP48E2, URAM288, VCCINT, DS925, VCD, SDP, CE, ENARDEN, XPE, CLAI, AMD: Joint-Test-Action-Group-Debug-Port, Xilinx-Software-Command-Line-Tool-Debugger, Debug-Access-Port, Universal Serial Bus, Future Technology Devices International und dessen FT2232C-Dual-UART/FIFO-Brücken-IC, universeller asynchroner Empfänger-Transmitter, First-in-First-out-Puffer, integrierter Schaltkreis, elektronische Entwurfsautomatisierung, Out-of-Context-Synthese-Modus, Advanced Microcontroller Bus Architecture, AXI4-Lite/AXI4-Stream-Interconnect, Input/Output-Block, Input/Output-Puffer, synchroner Reset/Set-D-Flip-Flop, 1-bis-5-Eingangs-UltraScale+-Look-Up-Tables, 7/8-Eingangs-UltraScale+-Multiplexer, schnelle 4/8-Bit-Carry-Ketten, UltraScale+-DSP-Slice, 288-Kbit-UltraRAM, interne Kern-Versorgungs-Rail (0,72 V bei -2LV), AMD-Zynq-UltraScale+-DC- und -AC-Schaltcharakteristik-Datenblatt DS925, Value-Change-Dump-Wellenform-Trace, einfacher Dual-Port-Block-RAM-Modus, synchrone Taktfreigabe, Lese-/Taktfreigabe-Pin von Port A bei RAMB36E2, Xilinx-Power-Estimator, Subsystem-Register-Magic-Identifier („CLAI“) und Advanced Micro Devices</li>
<li>CVE, CWE, FRO, GMP, RAG, WHNF, ZFC, CIC, FFI: Common Vulnerabilities and Exposures, Common Weakness Enumeration, Lean Focused Research Organization, GNU Multiple Precision Arithmetic Library, Retrieval-Augmented Generation, Weak-Head-Normalform, Zermelo-Fraenkel-Mengenlehre mit Auswahlaxiom, Kalkül der induktiven Konstruktionen und Foreign Function Interface</li>
<li>ABBA, AGX, AI, DC, FWHT, INA238, INA3221, MSS, NT, PPT, RDNA, RPL, RTX, RUSAGE_INFO_V6, TI, VDD, VDD_CPU_SOC_MSS, VDD_GPU, VIN, XNU: ausbalancierte A-B-B-A-Versuchsreihenfolge, Autonomous-Grade-Compute-Modulfamilie, künstliche Intelligenz, Gleichstrom, schnelle Walsh-Hadamard-Transformation, Inline-Leistungsmonitore von Texas Instruments (INA238 Gesamtboard-VIN und dreikanaliger INA3221), Speichersubsystem, Windows-NT-Kernelfamilie, Package Power Tracking, Radeon-DNA-Grafikarchitektur, mobile Raptor-Lake-Plattform, Ray Tracing Texel eXtreme, Struktur Darwin Resource Usage Info v6, Texas Instruments, Drain-Drain-Versorgungsschiene, Tegra-CPU/SoC/Speicher-Versorgungsschiene, Tegra-GPU-Versorgungsschiene, Board-Spannungseingangsschiene und Kernel Darwin X is Not Unix</li>
<li>ABI, AC, ADC, AE3, A2B, CRC32, CYCCNT, DTCM, DWT, E3, E4, E4B, ELF, ELFs, FCCM, FSM, GPT, INT8, ISVLSI, LSB, M0, M55, MCU, MRAM, PALUTE, PIO, Q4, ROM, RP2040, SHA256, SPI, ST, XL: Application Binary Interface, nichtkonstante Wechselanteil-Fourier-Energie, Analog-Digital-Umsetzer, Mikrocontroller-Board Alif Ensemble E3 OpenMV-AE3, dünnbesetztes Architektursuffix für 2 Milliarden aktive Experten, 32-Bit-IEEE-Zyklische-Redundanzprüfung, Zykluszählerregister der Arm Data Watchpoint and Trace Unit, Data Tightly Coupled Memory, Data Watchpoint and Trace Unit, Mikrocontrollerserie Alif Ensemble E3/E4, Suffix für 4 Milliarden effektive Edge-Parameter, Firmware-Abbild(er) im Executable and Linkable Format, Symposium Field-Programmable Custom Computing Machines, endlicher Automat, Generative Pre-trained Transformer (normiertes nGPT), 8-Bit-Ganzzahlquantisierung, International Symposium on VLSI, niederwertigstes Bit, Mikrocontrollerkerne Arm Cortex-M0+ und Cortex-M55, Mikrocontrollereinheit, magnetoresistives nichtflüchtiges RAM, Processing-In-Memory Acceleration via Lookup Table, programmierbare Ein-/Ausgabe-Peripherie, 4-Bit-quantisiertes Blockformat (Q4_K_XL), Festwertspeicher, Dual-Cortex-M0+-Mikrocontroller des Raspberry Pi, 256-Bit Secure Hash Algorithm, Serial-Peripheral-Interface-Bus, Straight-Through-Schätzer und extragroßes Quantisierungsblocksuffix</li>
<li>BAR0, BGA, BLE, CEM, CMOS, CSR, DDR3, DS181, DSP48E1, ECC, FBG484, FPC, GPIO, GTP, HAT, HPL, I2C, JEDEC, LFM, M4F, MIG, ODT, PCIe, PHY, QCM6490, QFAA, RAMB36E1, RISC, RV32IMAC, SSTL15, SYSMON, UG475, XADC, XC7A200T, XCK26, XCZU9EG, ZCU102: PCIe-Basisadressregister 0, Ball-Grid-Array, Bluetooth Low Energy, elektromechanische PCIe-Kartenspezifikation, komplementärer Metall-Oxid-Halbleiter, Steuer- und Statusregister, synchrone Double-Data-Rate-Typ-3-DRAM, AMD-Artix-7-DC/AC-Schaltcharakteristik-Datenblatt DS181, Xilinx-7-Series-DSP-Slice, Fehlerkorrekturcode, deckelloses 484-Ball-23x23-mm-Flip-Chip-BGA-Gehäuse, flexibles Flachbandkabel, Allzweck-Ein-/Ausgang, Artix-7-Multigigabit-Seriell-Transceiver, 40-poliger Hardware-Attached-on-Top-Erweiterungsstecker, TSMC-28-nm-High-Performance-Low-Power-Prozess, Inter-Integrated-Circuit-Bus, thermischer JEDEC-Prüfkartenstandard, Luftstrom-Einheit Linear Feet per Minute, Mikrocontrollerkern Arm Cortex-M4F, Xilinx-7-Series-Memory-Interface-Generator, On-Die-Terminierung, Peripheral Component Interconnect Express, physikalische Speicherschnittstellenschicht, System-on-Chip Qualcomm Dragonwing auf Particle Tachyon, 48-Pin-QFN-Gehäusesuffix des Nordic nRF52832, 36-Kbit-Dual-Port-Block-RAM-Primitiv der Xilinx 7-Series (365 auf XC7A200T), Reduced Instruction Set Computer, 32-Bit-RISC-V-Ganzzahl/Multiplikations/Atomar/Komprimiert-ISA, 1.5-V-E/A-Standard Stub Series Terminated Logic, Temperatur-/Spannungsüberwachungsblock Xilinx System Monitor, AMD-7-Series-Gehäuse- und Pinbelegungsspezifikation UG475, dualer 12-Bit-Analog-Digital-Umsetzer der Xilinx 7-Series, FPGA AMD Artix-7 200T (Numato Aller A7 M.2 2280), SOM-FPGA AMD Kria K26, MPSoC-FPGA AMD Zynq UltraScale+ und Evaluationsboard AMD ZCU102</li>
</ul>

Fünf Evidenzklassen bleiben über jede nachfolgende Tabelle hinweg getrennt:

| Evidenzlabel | Bedeutung in dieser Studie |
| :--- | :--- |
| **`Physical DC Shunt (measured_j)`** | Inline-Gleichstrom-Shunt-Messwerte auf `NVIDIA Jetson AGX Thor` (ausschließlich `Behauptungen LA-24 und LA-28`, `board_metered = true`): Kanal 2 `VDD_CPU_SOC_MSS` des Texas Instruments `INA3221` (`L2`, physikalisch isoliert von `VDD_GPU`) sowie Gesamtboard-`VIN` des `INA238` (`L1`), trapezförmig mit `500 Hz` über ausbalancierte `ABBA`-Fenster integriert. Niemals mit `reported_j` oder `est_j` summiert und auf allen Nicht-Thor-Zeilen ungesetzt (`None`). |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Exakte über `os.pread` unter Darwin `F_NOCACHE` gelesene oder geschriebene Bytezahlen, residente Speicherzuweisungen, Echtzeit-Sekunden, kumulative Energiedeltas der macOS-Gesamtmaschinen-`PMU` (`AppleSmartBattery.PowerTelemetryData`) auf Apple M5 Max sowie exakte Bit-/Token-Übereinstimmung. |
| **`Reported (OS / On-Chip Counter, reported_j)`** | Unprivilegierte Betriebssystem- und On-Chip-Telemetriezähler (`board_metered = false`): auf Apple M5 Max und M3 Ultra `libIOReport.dylib` `'GPU Energy'` (`L2` `nJ`) plus `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3` CPU `nJ`); auf `x86-64` Linux `RAPL` (`package-0` / `core`), `amdgpu` `PPT` und `NVML` `mJ`; unter Windows 11 `NVML` `mJ`. Niemals mit `measured_j` zusammengeführt. |
| **`Simulated (RTL)`** | Strukturelle Netzlistenzählungen aus Yosys `0.71+` (`synth_xilinx -family xcup` für Kria KV260 `xck26` sowie `-family xc7` für Artix-7 `XC7A200T`) und Zykluszählungen (`CPI = 1`) aus Verilator `5.054`. Weder Vivado-Timing-Closure noch physikalische Board-Leistung (`measured_j = None` für sämtliche `xck26`- und `XC7A200T`-Zeilen). |
| **`Estimated (est_j)`** | Analytische Joule-Werte und elektrothermische Schranken aus Operationszählungen, Thermal-Design-Power-Zeitersatzwerten (`joule_meter.py`) oder Verilator-VCD-Schaltaktivitäten gepaart mit den Kapazitäts- und Wärmewiderstandsmodellen AMD `DS925` `xck26-2LV` (`0.72 V`) `RAMB36E2` (§4.22, §4.25) sowie AMD `DS181` / `UG475` `XC7A200T-2FBG484C` (`1.00 V`) `RAMB36E1` (§4.32). Nur innerhalb derselben Formel zwischen Armen vergleichbar; niemals Silizium-Watt. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Architektonischer Hintergrund und Beiträge

In [Metered Commit Gates](/papers/gates/) `[same house]`, Teil II definiert **Mixture of Limits**: Versuche die Gänge in absteigender Reihenfolge der Durchlasswahrscheinlichkeit pro Joule $p_i / c_i$ (Simon and Kadane, 1975), stoppe sobald das Aufgabenerfüllungsprädikat $C(z) = 1$ gilt und verbiete die Verstärkung von `ModelGenerated`-Ausgaben zu `Deterministic`. Eine statische Lookup-Stufe deckt jedoch nur die vor der Bereitstellung eingeschriebenen Einträge ab. Umgekehrt fixieren bestehende Lookup-Table-Neuronale-Netze, LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022) und Differentiable Weightless Neural Networks (Bacellar et al., 2024), die Leitungsverbindungen innerhalb statischer FPGA-Routing, was einen Hersteller-Place-and-Route bei jeder Verschiebung der Eingabeverteilung erfordert.

Die `lut-adapt-ai`-Referenz schließt die Schleife zwischen Ober- und Unterseite der Kaskade mittels **online-Abwärtskompilierung auf `LUT6`**:

- **Stufe 0 (Lookup, paginierter Beneš + `LUT6`)**: Bewertet 64-Bit-Wahrheitstabelle-Masken, die durch einen nicht-blockierenden $512 \times 512$ **Beneš-Copy-Beneš** Multicast-Switch geleitet und über $81 \times \texttt{RAMB36E2}$ Dual-Port-Block-Speicher gecached werden (`0` Fließkomma-Operationen, ein-Zyklus-Seiten-Umschaltung in Verilator-Simulation).  
- **Stufe 1 (Stream, `Mamba-3` komplexe MIMO-Zustandsraummodularität)**: Bearbeitet Fehlzugriffe, die von der Sequenzhistorie abhängen, mittels eines konstanten $O(1)$ rekursiven Zustands (`48 KB` gepinnter Speicher im `14.3M`-Parameter-Referenzmodell) und vermeidet ein $O(L)$ Schlüssel-Wert-Cache-Wachstum.  
- **Stufe 2 (Topology, `HC-SOINN`)**: Pflegt online die Prototyp-Topologie über latente Einbettungen, isoliert Regime-Grenzen und löst einen Schutzschalter (`Refuse` / eskalieren) aus, wenn ein nicht gekennzeichneter Verteilungswechsel eintritt.  
- **Stufe 3 (Modell zuletzt, `JEPA-EBRM`, `AirMoL` und Metall-verschmolzener `Expert-AirMoL` 4-Bit NVMe-Streaming)**: Ruft latente energie-basierte Verifikation auf oder streamt vor-trainierte Hybrid- und Sparse-MoE-Grundmodelle von Ende 2026 (`LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it`, `LiquidAI/LFM2.5-8B-A1B` und `Qwen/Qwen3.6-35B-A3B`, zusammen mit `LiquidAI/LFM2.5-350M` und `Qwen/Qwen3.5-0.8B-Base`) durch benutzerdefinierte Apple-Metal `MSL` Compute-Shader, ausschließlich wenn billigere Stufen zurückhalten oder eine exakte Ziel-Verifikation benötigen.  
- **Abwärtsgerichteter `SleepCrystallizer`**: Extrahiert wiederkehrende Wake-Spuren mittels Walsh-Hadamard-Spektral-Warm-Starts, gemeinsamer Minterm-Wahrheitstabellen, kanonischer AST-Fähigkeiten und Waksman-Switch-Zeitplänen, indem Schatten-Block-Speicher-Bänke umgeschaltet werden, ohne Inferenz zu stoppen oder FPGA-Place-and-Route auszuführen.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Beiträge

1. **Amortisierte Abwärtskompilierungsbedingung**: Erweitert die Simon-Kadane-$p_i/c_i$-Ordnung um einen expliziten Kompilierungskostenfaktor $E_{\text{compile}}$ über einen stationären Horizont $\Delta T$.
2. **Blockierungsfreies $512 \times 512$-Beneš-Copy-Beneš-Netz, `81`-`RAMB36E2`-Seitencache und `4`-stufig gepipelinetes `250 MHz`-`P4-AXIS`-RTL-Subsystem**: Beseitigt sowohl den `102.0%`-Logiküberlauf flacher Koppelfelder auf dem Kria KV260 (`119,478` LUTs) als auch die `926,619`-LUT-Explosion von Flip-Flop-Seitenmultiplexern (`41,186` UltraScale+-CLB-LUTs = `35.2%` von `xck26`, `81` `RAMB36E2`-Blöcke = `56.2%`, `0` `DSP48`-Slices im `1`-Zyklus-OOC-Modus), während ein `4`-stufig gepipelineter, IOB-konformer `AXI4-Stream`-Wrapper (`clai_benes_axi_stream_250mhz_top`) die synchrone Einzelzyklus-Logiktiefe um den Faktor **`4.00×`** von `52` auf **`13` Stufen** senkt, **`170 <= 189` `xck26`-`IOB`s** einhält (`41,459` LUTs = `35.40%`) und in Verilator **`256 / 256` blasenfreie Streaming-Parität mit `CPI = 1.00`** besteht.
3. **Universelle $\le 64$-bit-Joint-Mode-Minterm-Synthese**: Zeigt, dass die Joint-Mode-Minterm-Nachschlagetabelle die marginale Bitplane-DiffLogic-Rundung auf korrelierten Zweigen dominiert und $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ Unterwort-Token in ein `uint64`-Wort packt (`16b × 4 = 64b` für `|V| = 65,536`; `17b × 3 = 51b` für `|V| = 128,000`; `18b × 3 = 54b` für `|V| = 248,320`).
4. **Orakelfreies Split-Conformal- + Online-ACI-Kristallisationstor**: Paart eine radial regularisierte latente `JEPA-EBRM`-Nichtkonformitätsbewertung mit Split-Conformal-Kalibrierung und Adaptive Conformal Inference (Gibbs und Candès, 2021), verzeichnet `0.00%` falsches Kristallisationsrisiko und `1.0000` OOD-AUROC bei verschobenem Verkehr, während Softmax- und MC-Dropout-Baselines `17.62%-24.28%` falsches Risiko aufweisen.
5. **Benutzerdefinierte Apple-Metal- und plattformübergreifende Rust-`CubeCL`-`INT4`-Sparse-MoE- / `GatedDeltaNet`-Shader sowie `AirMoL` / `Expert-AirMoL` bis `34.66B`**: Kombiniert Darwin-`F_NOCACHE`-`os.pread`-4-Bit-Sharding, benutzerdefinierte `MSL`-Compute-Shader (`43.45×` MoE, `20.66×` `GatedDeltaNet`) und portable Rust-Compute-Shader mit `Burn 0.22.1 / CubeCL` (`35.09×` Metal / `2.67×` `LLVM`-`CPU` MoE, `69.20×` Metal / `14.87×` `LLVM`-`CPU` `GatedDeltaNet`), paralleles `pread` mit Warteschlangentiefe `8` sowie `BenesLUT6`-Burst-Spekulation über `LiquidAI/LFM3-1.7B` vom Oktober 2026 (`2.74×` NVMe-Reduktion in `3.79%` FP32-RAM), `LiquidAI/LFM2.5-8B-A1B` (`500.0 MB` RAM, `3.493 J/tok` `reported_j`) und `Qwen/Qwen3.6-35B-A3B` (`34.66B`; **`12.30×` NVMe-Reduktion**, **`970.0 MB` RAM = `1.47%` von FP16**, **`6.773 J/tok` `reported_j`**, **`15.7 tok/s`** Unified-Memory-`Q4`) bei `100.0%` exakter Token-Parität.
6. **MAC-freies `Sub1Bit-LUT6` gegenüber `LittleBit`, `91.67%`-Obergrenze mit `Rung 3d` `<think>`, offizielles `BigCodeBench v0.1.3` + Upstream-`SWE-bench Verified` über `MCP` sowie OpenAI- / `MCP`-`mol-agent`**: Ersetzt die `1.98M` binären Laufzeit-MACs von `LittleBit-1 / LittleBit-2` (`0.576` Bits pro Gewicht; Lee et al., 2025; Lee und Kim, 2026) durch MAC-freies `6`-Eingangs-`LUT6`-Partialsummen-Nachschlagen (`< 4 × 10⁻⁶` Fehler, `100.0%` Parität unter `MoL`-Zielverifikation in `0` QAT-Epochen), hebt den `48`-Aufgaben-Coding-Vergleich von Ende 2026 mit begrenztem Open-Weights-`Rung 3d` `<think>` von `87.50%` auf **`91.67%` (`44 / 48`; `93.75%` in Welle 2 und Welle 3)**, erreicht **`90.62%` (`29 / 32`, `93.75%` Welle 2)** im offiziellen `BigCodeBench v0.1.3` (gegenüber `78.12%` auf eigenständigem `35B`) sowie **`50.00%` (`8 / 16`)** auf Upstream-`SWE-bench Verified`-Git-Arbeitsbäumen von `sympy/sympy` (gegenüber `25.00%` auf `35B`) bei **`0.00%` zugelassenen fehlerhaften Commits** und stellt persistente `.mol/`-Fertigkeiten über OpenAI `/v1/chat/completions` und `MCP` (`JSON-RPC 2.0`) bereit.
7. **Paranoide Sechs-Kernel-Formalisierung in Lean `4.36.0` (gehärtet gegen `CVE-2026-72844`, `36` Theoreme), Aufrufgraph-Lokalisierung auf `4` Repositories in `SWE-bench Verified`, gemessene `120B`-Hybrid-MoE-Spitzenstufe, `CE`-gesteuerte `VCD`-Leistung und Einzelbinärprogramm `mol-agent-rs` in Rust (`Claims LA-19` bis `LA-23`)**: Prüft sämtliche **`36` Theoreme** über `Cascade`, `BenesCopy`, `JointMinterm`, `ConformalProvenance` und `NucleusCodon` auf **sechs unabhängigen Beweisprüfern** (`con-leche --verified` [`58,729` Dekl.], `con-ron --verified` [`58,729` Dekl.], `lean4lean` [`58,731` Dekl.], `nanoda`, `leanchecker --paranoid` und Lean `4.36.0`; `0` `sorry`, `0` benutzerdefinierte Axiome, `0` `Lean.ofReduceBool`; Moura und Ullrich, 2021), erweitert die leckagefreie Auswertung von `SWE-bench Verified` über **`4` Upstream-Repositories (`django`, `pytest`, `requests`, `sympy`, `24` Auswertungen)** auf **`20.83%` gesamt / `25.00%` Welle 2 (`2.50×` gegenüber eigenständigen `24B` und `35B`)** mit `0.00%` fehlerhaften Patches, vermisst **`nvidia/Nemotron-3-Super-120B-A12B` im `120B`-Maßstab** (`58,075.4 MB` `RSS`, **`22.17 tok/s`**, **`62.50%` verifizierte Bestehensrate** gegenüber `43.75%` auf eigenständigem `120B-A12B` und `31.25%` auf `Devstral-Small-2-24B`), senkt die dynamische Leerlaufleistung von `P4-AXIS` bei `250 MHz` über `ENARDEN`- und Valid-Bubble-`CE`-Gating um **`4.10×`** (`63.99` auf **`15.59 est_mW`**) und liefert ein Python-freies Rust-Einzelbinärprogramm `mol-agent-rs` (`0.1540 ms/req` `MCP`, **`17.21×` schneller** als Python-`mol-agent`, `44 / 44` `pytest`-Tests bestanden).
8. **`4 KB` `#![no_std]`-Rust-`1.100.0`-Bootstrap-Nucleus `lut6-core` über `4` Bare-Metal-`MCU`s (`64 KB` `nRF52832` & `RV32IMAC`), geschlossenes `-64.06%`-Pruning nach `DiffLUT-Net` (`arXiv:2609.09254`), Live-Telemetrie auf `Alif E3` + `Thor`-Shunts, geschleifte Modelle vom Oktober-November 2026 und Xilinx-7-Series-`XC7A200T`-M.2-`2280`-Gateware-Portierung (`Claims LA-26` bis `LA-30`)**: Cross-kompiliert eine exakte `4,096 B`-`CompactLut6Page` sowie eine 64-Codon-Operon-`ABI` über `7` Bare-Metal- und Host-Ziele hinweg - darunter gleitkommafreie `ELFs` für `Alif E3/E4` Cortex-`M55`, `RP2040` Cortex-`M0`+, `Nordic nRF52832` Cortex-`M4F` (`25.06%` von `64 KB` `SRAM`, `49,112 B` frei) und `RV32IMAC` (`25.06%` von `64 KB` `SRAM`; `64/64` Boolesche Miter-Vektoren unter Yosys `abc -lut 6`) -, beweist universell `0` Walsh-Hadamard-Rauschen vom Grad `>=5` auf 2-Bit-Wobble-`LUT6`s (`NucleusCodon.lean`) und senkt aktive `LUT6`-Gatter um **`64.06%`** (`64` auf `23`, **`95.00%` Unterdrückung verrauschter Aufweckvorgänge, `0.00%` stille Korruption, `100.00%` `OOD`-Enthaltung**), verzeichnet **`125.23 nJ/op` (`85.28×` physikalische `CpJ` ggü. `INT8`-Micro-`MLP`)** an den `DC`-Shunts des `Jetson AGX Thor` sowie **`12.18` `DWT`-Zyklen (`38.1 ns`, `1,943.49×` weniger Zyklen)** auf einem live angeschlossenen `OpenMV-AE3` Cortex-`M55`, vermisst `thinkingmachines/Inkling-2-Mini` (`3.52×` Beschleunigung, `4.29×` geringeres `reported_j`), `Nemotron-Labs-Dory1.0-4B` (`3.95×` Beschleunigung), `LiquidAI/LFM2.5-24B-A2B` und `NVIDIA-Nemotron-3.5-Bolt-E4B` bei `100.0%` gieriger Parität und portiert das vollständige Beneš- + `CompactLut6Page`-Subsystem auf den **Artix-7 `XC7A200T-2FBG484C` (Numato Aller A7 M.2 `2280`)** (`62,211` `xc7`-LUTs = `46.22%`, `83` `RAMB36E1`s, `365`-Kristall-On-Die-Tresor mit `1.46 MB`, `0` `DSP48E1`s, **`10,500 / 10,500` bitgenaue `KV260`-Äquivalenz** und **`0.86 est_W` M.2 `3.3V` @ `55.2 est_C`** bei in `CMOS`-Reset gehaltener `DDR3`).

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

Abbildung 5 verortet die Abwärtskompilierung entlang der neunstufigen Fähigkeitssperrklinke maschineller Intelligenz (Begleitstudie: [Die Kommunikationsplattform Lawine](/papers/communication-avalanche/) `[same house]`). Die Sprossen 1 bis 5 - **(1) Suche** (`RAG`), **(2) Generierung**, **(3) Schlussfolgern** (`<think>`), **(4) Kommunikation** (`MCP`-Delegation) und **(5) Werkzeugnutzung** - stagnieren unter flüchtiger Kaltstart-`MAC`-Inferenz, bei der der stationäre Horizont bei $\Delta T \approx 1 \le \Delta T^*$ verharrt und eigenständige `1`-Shot-Modelle `56.25%-95.83%` fehlerhafte Patches zulassen (`Claims LA-20` und `LA-21`). Das Überschreiten der **Kompilierungsschwelle** aus Proposition 1 ($\Delta T > \Delta T^* = E_{\text{compile}} / (p_0' c_{\text{wake}} - c_0)$ unter $C(z) = 1$, `0.00%` zugelassene fehlerhafte Commits) erschließt **(6) Immersion** (persistenter lokaler Zustand streckt $\Delta T \gg \Delta T^*$), **(7) Kompetenz** ($p_0' \to 1$ bei `62.4 pJ/cycle` `est_j` in `CE`-gesteuertem `xck26`-`LUT6`-RTL und `272 µJ/req` `reported_j` in Rust `mol-agent-rs` `MCP`), **(8) Ökologie** (Edge-native Agentenpopulationen in Rust) und **(9) Ökonomie** (Arbeitsteilung geordnet nach Simon-Kadane $p_i / c_i$ und stufentypisierten Joule-Belegen).

![Abbildung 5. Die neunstufige Lawinen-Sperrklinke maschineller Intelligenz und die Kompilierungsschwelle.](/figures/lut-adapt/avalanche-compilation-threshold.svg)

*Abbildung 5. Die neunstufige Fähigkeitssperrklinke und die Kompilierungsschwelle aus Proposition 1 ($\Delta T > \Delta T^*$), mit strikter Trennung von `reported_j` (Apple M5 Max) und `est_j` (`AMD DS925` `VCD`) über zwölf Größenordnungen (`measured_j = None`, `board_metered = false`). [PNG](/figures/lut-adapt/avalanche-compilation-threshold.png) · [Interaktiver Explorer](/living/lut-adapt/#la-diag-03).*

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

### 4.8 Anspruch LA-8: Live-CLI- und HTTP/SSE-Streaming-Server (`mol_code_cli.py`)

`scripts/mol_code_cli.py` stellt `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` und `--air-nvme` über CLI- und SSE-Endpunkte bereit (`/v1/health`, `/v1/complete`, `/v1/crystallize`). Dabei erhöht sich die Slot-Belegung von RAMB36E2 live von `438/512` auf `460/512`, und `26/26` Tests in `tests/` sind bestanden.

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

### 4.11 Anspruch LA-11: Coding-Vergleich mit `48` Aufgaben (`16` Spezifikationen × `3` Wellen) an der Frontier Ende 2026

| System-Arm Ende 2026 (`48` Aufgaben = `16` Spezifikationen × `3` Wellen) | W1 Kalt | W2 Adaptiv | W3 Warm | Gesamterfolg | Defekte Commits | Anteil `Rung 0/1` in W3 | `35B`-Aufrufe | Mittel W1 / W3 (`ms`) | `reported_j` / Lösung (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT (`1`-Shot) | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `22,413` / `22,708` | `8,020.13` (`32,558 est_j`) |
| `B` `LiquidAI/LFM3-1.7B` (Okt. 2026 Tri-Hybrid, `1`-Shot) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `8,460` / `9,791` | `152.77` (`957.21 est_j`) |
| `C` `google/gemma-4-E2B-it` (Hybrid `2026`, `1`-Shot) | `37.50%` | `18.75%` | `18.75%` | `25.00%` | `75.00%` | `0.00%` | `0.0%` | `18,924` / `23,578` | `5,800.68*` (`3,700.44 est_j`) |
| `D` `LiquidAI/LFM2.5-8B-A1B` (`8.47B` MoE, `1`-Shot) | `6.25%` | `6.25%` | `6.25%` | `6.25%` | `93.75%` | `0.00%` | `0.0%` | `53,123` / `53,885` | `33,415.04` (`47,196 est_j`) |
| `E` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (`1`-Shot) | `81.25%` | `75.00%` | `75.00%` | `77.08%` | `22.92%` | `0.00%` | `100.0%` | `49,887` / `44,447` | `1,069.65` (`5,701.32 est_j`) |
| `F` `RouteLLM` Konfidenz-Router (`LFM3` $\to$ `Gemma4` $\to$ `8B`) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `9,735` / `11,294` | `171.09` (`1,148.96 est_j`) |
| **`G` `MoL` `VerifiedCodeCascade` (Referenz)** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`87.50%`** | **`22.92%`** | **`116,626` / `44,052` (`2.89 ms` gelöst)** | **`3,655.51*` (`0.0424 J` in W3)** |

Über das `48`-Aufgabenprotokoll und den Algorithmus-Benchmark (RFC-1982-Serienarithmetik, gewichtete Intervall-Sweeplines, zyklussichere lexikografische topologische Sortierung, Nanosekunden-Token-Buckets, CRC-8/ATM und mutierte `0xFF` CRC-8, RFC-6901-JSON-Pointer-`~01`-Unescaping, hop-beschränkter Bellman-Ford, `>2⁵³` exakte Fenster-Mediane, uneingeschränkte Damerau-Levenshtein, `4×4` Beneš-Routing, SQL-Literal-Parametrisierung, monotoner Deque-Teilsequenzsumme, DWARF-SLEB128, SHA-256-konsistentes Hashing sowie konforme Quantile; ganzheitliches macOS-`PMU`-Delta `117,166.40 J` über `6,646` Ticks) erreicht `VerifiedCodeCascade` **`87,50 %` (`42 / 48`)** über alle drei Wellen hinweg, übertrifft das eigenständige `Qwen3.6-35B-A3B` (`77,08 %`) und ruft `35B` nur bei **`22,92 %` (`11 / 48`)** der Aufgaben auf (`LFM3-1.7B` löst `7` Wave-1-Spezifikationen direkt; `Gemma-4-E2B-it` plus strukturierte Gegenbeispiel-Reparatur löst `3`; `Metal-Qwen3.6-35B-A3B` löst `4` plus mutiertes `W2_01`). Es weist **`0,00 %` fehlerhafte Commits** auf (gegenüber `22,92 %`-`100,00 %`), erkennt beide Wave-2-adversariellen Spezifikationsmutationen über $C(z)$ (`16` zertifizierte Fähigkeiten in `artifacts/.mol_verified_skills`) und senkt die mittlere Wave-3-Wiederholung über die **`14` kristallisierten Lösungen (`87,50 %`)** auf **`2,89 ms`** sowie **`0,0424 J` `reported_j`** (`15.401×` schneller und `25.227×` geringerer `reported_j` als das eigenständige `35B`). *(Fußnote `*`: Ein `W2_10`-`Gemma-4`-Aufruf erlebte einen unprivilegierten macOS-`IOReport`-`'GPU Energy'`-Hardware-Akkumulator-Überlaufspike von `+59,2 kJ`, unverändert in `frontier_ai_head_to_head_bakeoff.csv` erhalten und durch den `> 450 W`-Überlaufwächter von `joule_meter.py` in nachfolgenden Läufen gefiltert.)*

<div id="412-claim-la-12-native-apple-metal-msl-fused-int4-sparse-moe--gateddeltanet-shaders--dual-channel-reported_j" class="anchor-alias" aria-hidden="true"></div>

### Behauptung LA-12: Native Apple Metal (MSL) zusammengefügte INT4 Sparse-MoE- und GatedDeltaNet-Shader + Dual-Kanal `reported_j`

Die Dateien `src/clai/frontier/metal_moe_kernels.py` und `scripts/run_metal_moe_benchmark.py` (`artifacts/metal_moe_air_mol_speedup.csv`, `artifacts/metal_moe_air_mol_meta.json`) kompilieren drei benutzerdefinierte `MSL`-Kernel über `torch.mps.compile_shader`: (i) `gated_delta_recurrent_k128` nutzt die exakte Spaltenunabhängigkeit über $v \in \{0, \dots, V_{\text{dim}}-1\}$ des rekurrenten Zustands $\mathbf{S}[b, h_v, :, v]$, um `128` `FP32`-Zustandselemente über alle $T$ Token in GPU-Registern zu halten (**`20.66×` schneller**: `34.523` auf `1.671 ms`, **`46.2×` niedrigeres `reported_j`**: `1.4989` auf `0.0325 J`, `1.19 × 10⁻⁷` maximaler Zustandsfehler). (ii) `q4_moe_gate_up_silu` und `q4_moe_down_weighted` dequantisieren `INT4`-Expertengewichte mit `4.50 bpw` und Blockgröße 64 direkt in `simd_sum`-Registern, ohne `FP16`/`FP32`-Gewichtsallokationen (**`43.45×` schneller**: `22.408` auf `0.516 ms` bei `28` aktiven Experten, **`29.8×` niedrigeres `reported_j`**: `0.3959` auf `0.0133 J`, `7.2 × 10⁻⁷` maximaler `FP32`-Fehler, `<= 1 ULP` `BF16`). Ergänzt wird dies durch parallele `pread`-Aufrufe mit Warteschlangentiefe `8` und einen Router-Lookahead mit `BenesLUT6`-Vorzeichen-Sketch.

| Sparse-MoE-Checkpoint & Cold-NVMe-Engine-Variante | Parität | Tok / Sweep | NVMe-Lesevorgänge / Tok | Aktiver Spitzen-RAM | `tok/s` (`× PyTorch`) | On-Chip `reported_j / tok` (`GPU` + `CPU`) | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `1` PyTorch-Referenz `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | `1,408.3 MB` | `0.394` (`1.00×`) | `10.978 J` (`5.25` + `5.73`) | `266.66` |
| `LFM2.5-8B-A1B` · `2` Metal-fusioniert `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | **`500.0 MB`** | `0.689` (`1.75×`) | `6.979 J` (`1.30` + `5.68`) | `152.42` |
| **`LFM2.5-8B-A1B` · `3` Metal-fusioniert + `BenesLUT6` (Referenz)** | **`100%`** | **`2.67`** | **`0.791 GB`** | **`500.0 MB`** | **`1.671` (`4.24×`)** | **`3.493 J` (`1.22` + `2.28`)** | **`62.85`** |
| `Qwen3.6-35B-A3B` · `1` PyTorch-Referenz `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | `2,434.7 MB` | `0.191` (`1.00×`) | `20.765 J` (`8.76` + `12.00`) | `549.49` |
| `Qwen3.6-35B-A3B` · `2` Metal-fusioniert `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | **`970.0 MB` (`1.47%`)** | `0.241` (`1.26×`) | `15.440 J` (`3.93` + `11.51`) | `436.26` |
| **`Qwen3.6-35B-A3B` · `3` Metal-fusioniert + `BenesLUT6` (Referenz)** | **`100%`** | **`2.67`** | **`1.447 GB`** | **`970.0 MB` (`1.47%`)** | **`0.621` (`3.25×`)** | **`6.773 J` (`2.31` + `4.47`)** | **`169.03`** |

Durch den Verzicht auf die Entpackung von `FP16`/`FP32`-Experten sinkt der aktive Gewichts-RAM-Spitzenwert im Cold-NVMe-Betrieb für `Qwen/Qwen3.6-35B-A3B` um den Faktor **`2.51×`** auf **`970.0 MB` (`1.47%` von `66.11 GB` FP16)**. Das `reported_j / tok` über beide Kanäle sinkt um den Faktor **`3.07×`** (`20.765` auf **`6.773 J/tok`**) bei `100.0%` exakter Token-Parität. Bei `>= 36 GiB`-Workstations, auf denen `16.8 GB` `INT4`-Expertenpakete im Unified Memory fixiert bleiben, werden **`15.7 tok/s`** erreicht.

<div id="413-claim-la-13-16-task-8-multi-file-git-repositories--2-waves-swe-mini-pytest-patching-benchmark" class="anchor-alias" aria-hidden="true"></div>

### 4.13 Behauptung LA-13: `16`-Aufgaben-Benchmark (`8` Multi-File-Git-Repositories × `2` Wellen) zum `SWE-Mini`-`pytest`-Patching

`src/clai/frontier/repo_patch_cascade.py` und `scripts/run_repo_patch_benchmark.py` (`artifacts/repo_patch_swebench_mini.csv`, `artifacts/repo_patch_swebench_mini_traces.json`) evaluieren die modulübergreifende Fehlerbehebung in Repositories anhand von `8` isolierten Git-Repositories (`billing`, `scheduler` DAG, `auth` JWT/HMAC, `wal` CRC32, `http_client` CIDR, `semver`, `ttlcache` LRU/TTL und `etl` CSV) × `2` Wellen (`16` Auswertungen, einschließlich einer Sicherheitsmutation in Welle 2 an `R03_jwt_clock_skew`, die die Ablehnung zukünftiger `iat`-Werte ergänzt). Dabei erzwingt $C(z)$ byte-identische `tests/`-Verzeichnisse und führt einen Subprozess `pytest -q` aus:

| Multi-File-Git-Repository-Arm (`16` Aufgaben = `8` Repos × `2` Wellen) | W1 kalt | W2 warm | Gesamterfolg | Fehlerhafte Patches | W2-`.mol/`-Trefferanteil | Mittelwert W1 / W2 (`ms`) | `reported_j` / Fix (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (`1`-Shot-Repo-Patch) | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `4,943` / `5,020` | `371.61 J` (`637.68 est_j`) |
| `B` `google/gemma-4-E2B-it` (`1`-Shot-Repo-Patch) | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `6,865` / `7,117` | `133.48 J` (`469.79 est_j`) |
| `C` `LiquidAI/LFM2.5-8B-A1B` (`1`-Shot-Repo-Patch) | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `61,430` / `61,416` | `17,882.33 J` (`54,052 est_j`) |
| `D` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (`1`-Shot) | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `20,270` / `20,502` | `288.39 J` (`3,098.71 est_j`) |
| **`E` `MoL` `RepoPatchCascade` (Referenz)** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`75.00%`** | **`59,341` / `30,663` (`594 ms` `.mol/`)** | **`692.38 J` (`1.10 J` `.mol/`)** |

`RepoPatchCascade` löst **`87.50%` (`14 / 16`)** der modulübergreifenden Repository-Fehler (`+25.0` Prozentpunkte über dem jeweils eigenständig betriebenen `35B` und `Gemma 4`), committet **`0.00%` fehlerhafte Patches**, erkennt die Spezifikationsmutation `R03` aus Welle 2 über den Subprozess-`pytest` $C(z)$ und kristallisiert `Patch#8` (`2,905 ms`) erneut aus. Zudem spielt es die `6` wiederkehrenden `.mol/`-Patches aus Welle 2 in **`594.0 ms` (`1.10 J` `reported_j`, einschließlich `git init` + `pytest`)** ab, gegenüber `38,937.5 ms` (`590.38 J` `reported_j`) in Welle 1 (**`65.6×` schneller, `537×` niedrigeres `reported_j`**).

<div id="414-claim-la-14-drop-in-openai-v1chatcompletions-and-mcp-json-rpc-20-local-coding-agent-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.14 Anspruch LA-14: Drop-in-OpenAI (`/v1/chat/completions`) und `MCP` (`JSON-RPC 2.0`) lokaler Codierungsagent (`mol-agent`)

`src/clai/service/openai_mcp_agent.py` und `scripts/mol_agent_server.py` (`mol-agent`-CLI-Einstiegspunkt) stellen die Kaskade `IDE`- und Terminal-Codierungswerkzeugen (`Cursor`, `Continue.dev`, `Claude Code`, `Antigravity`, OpenAI-`SDK`) mit null Drittanbieter-Webabhängigkeiten zur Verfügung: (i) OpenAI-kompatibles `GET /v1/models` und `POST /v1/chat/completions` (`stream: true/false` `SSE`, CORS-Header, optionaler `x_mol_contract`-deterministischer Verifizierer sowie `x_mol_receipt`-Berichtsrang, `skill_id`, `est_j`, `reported_j`, `measured_j: null`); und (ii) Model Context Protocol (`MCP` `JSON-RPC 2.0` über `--mcp-stdio` und `POST /mcp`) mit Freigabe von `mol_synthesize_verified_function`, `mol_repair_repo_pytest`, `mol_lookup_crystallized_skill` und `mol_energy_telemetry`, gestützt auf persistente `.mol/skills_v1.json` + `.mol/benes_lut6_router.npz` (`30 / 30` `pytest`-Tests bestanden).

<div id="415-claim-la-15-official-bigcodebench-v013-32-evaluations-and-upstream-swe-bench-verified-sympy-git-worktree-16-evaluations-benchmarks-via-mcp-json-rpc-20" class="anchor-alias" aria-hidden="true"></div>

### 4.15 Behauptung LA-15: Benchmarks im offiziellen `BigCodeBench v0.1.3` (`32` Auswertungen) und in Upstream-`SWE-bench Verified`-`SymPy`-Git-Arbeitsbäumen (`16` Auswertungen) über `MCP` `JSON-RPC 2.0`

`src/clai/frontier/external_public_benchmarks.py` und `scripts/run_external_public_benchmarks.py` (`artifacts/external_public_bcb_swebench.csv`, `artifacts/external_public_bcb_swebench_traces.json`) vergleichen den `MoL`-`MCP`-Agenten (`handle_mcp_jsonrpc` + `.mol/`-Kristallisation) direkt mit eigenständigem `LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it` sowie Metal-beschleunigtem `Qwen/Qwen3.6-35B-A3B` auf zwei offiziellen öffentlichen HuggingFace-Parquet-Benchmarks, die beim Laden per `SHA`-256 verifiziert werden (`bigcode/bigcodebench` `v0.1.3`: `ed5a3a39...`, `16` Aufgaben × `2` von Menschen verfasste Prompt-Wellen [`complete_prompt` in Welle 1 + `instruct_prompt` in Welle 2] = `32` `unittest`-Auswertungen; sowie `princeton-nlp/SWE-bench_Verified`: `a45b1fe4...`, `8` reale `sympy/sympy`-`1.11-1.12`-Git-Arbeitsbaum-Checkouts × `2` Wellen = `16` `pytest`-Auswertungen über `FAIL_TO_PASS + PASS_TO_PASS`), unter striktem Ausschluss jeder Gold-Lösungs-Leckage (macOS-`PMU`-Delta `59,250.43 J`):

| Offizieller öffentlicher Benchmark & Arm | W1 Kalt | W2 Paraphrase / Backport | Verifizierte Gesamtquote | Fehlerhaft zugelassen | W2-`.mol/`-Schnellpfad | `35B`-Aufrufe | Mittel W1 / W2 (`ms`) | `reported_j` / Lösung (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `BCB v0.1.3` (`32`) · `A` `LiquidAI/LFM3-1.7B` | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `0.00%` | `5,471` / `5,716` | `169.67 J` (`409.11 est_j`) |
| `BCB v0.1.3` (`32`) · `B` `google/gemma-4-E2B-it` | `31.25%` | `43.75%` | `37.50%` | `62.50%` | `0.00%` | `0.00%` | `12,187` / `9,791` | `190.91 J` (`1,230.76 est_j`) |
| `BCB v0.1.3` (`32`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `75.00%` | `81.25%` | `78.12%` | `21.88%` | `0.00%` | `100.00%` | `28,365` / `10,926` | `277.45 J` (`2,388.89 est_j`) |
| **`BCB v0.1.3` (`32`) · `D` `MoL` `MCP` Agent (Referenz)** | **`87.50%`** | **`93.75%`** | **`90.62%`** | **`0.00%`** | **`81.25%`** | **`25.00%`** | **`47,321` / `6,001`** | **`263.54 J` (`1,917.44 est_j`)** |
| `SWE-bench Verified` `SymPy` (`16`) · `A` `LiquidAI/LFM3-1.7B` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `5,449` / `5,486` | `869.84 J` (`2,799.45 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `B` `google/gemma-4-E2B-it` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `8,304` / `5,040` | `1,015.22 J` (`4,483.82 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `100.00%` | `18,384` / `19,898` | `1,280.08 J` (`7,273.48 est_j`) |
| **`SWE-bench Verified` `SymPy` (`16`) · `D` `MoL` `MCP` Agent (Referenz)** | **`50.00%`** | **`50.00%`** | **`50.00%`** | **`0.00%`** | **`50.00%`** | **`68.75%`** | **`131,976` / `17,215`** | **`6,130.89 J` (`0.33-0.44 J` W2 `.mol/`)** |

Auf `BigCodeBench v0.1.3` (Zhuo et al., 2024) übertrifft der `MoL`-`MCP`-Agent das eigenständige `Qwen3.6-35B-A3B` um **`+12.50` Prozentpunkte (`90.62%` gegenüber `78.12%`, mit `93.75%` [`15/16`] auf den von Menschen paraphrasierten `instruct_prompt`-Aufgaben in Welle 2)**, während er `35B` nur bei `25.00%` der Aufgaben aufruft, die mittlere Latenz in Welle 2 um den Faktor **`7.89×`** senkt (`47,321` auf `6,001 ms`; `63-146 ms` und `0.09-0.13 J` `reported_j` auf `12` von `13` `.mol/`-Treffern) und **weniger `reported_j` pro verifizierter Lösung aufwendet (`263.54 J` gegenüber `277.45 J`)**, bei `0.00%` zugelassenen fehlerhaften Ausgaben. Auf Upstream-`SWE-bench Verified` (Jimenez et al., 2024) identifiziert die leckagefreie `AST`- und Stackframe-Lokalisierung sämtliche `8 / 8` Zieldateien in `sympy/sympy`, ohne `patch` zu lesen, und `MoL` verdoppelt die verifizierte Lösungsquote (**`50.00%` [`4/8`: `sympy-23534`, `23950`, `24066`, `24213`] gegenüber `25.00%` [`2/8`] bei `35B` und `0.00%` bei `LFM3`/`Gemma4`**), spielt alle `4` kristallisierten vereinheitlichten `git diff`-Fertigkeiten in Welle 2 in **`1,590-1,720 ms` (`0.33-0.44 J` `reported_j`, einschließlich frischem `git worktree`-Checkout + `pytest`)** ab und enthält sich auf den `4` ungelösten Multi-Hunk-Algebra-Problemen sicher (`VERIFIER_ABSTAIN_SAFE`, `0.00%` fehlerhafte Patches zugelassen).

<div id="416-claim-la-16-4-stage-250-mhz-pipelined-kria-kv260-xck26-benešcopybeneš--81-ramb36e2-rtl-subsystem-400-logic-depth-reduction" class="anchor-alias" aria-hidden="true"></div>

### 4.16 Behauptung LA-16: `4`-stufig mit `250 MHz` gepipelinetes Kria-KV260-(`xck26`)-Beneš-Copy-Beneš- + `81-RAMB36E2`-RTL-Subsystem (`4.00×` Reduktion der Logiktiefe)

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv` und `scripts/verify_pipelined_250mhz_rtl.py` (`artifacts/kv260_pipelined_250mhz_rtl.csv`, `artifacts/kv260_pipelined_250mhz_meta.json`) beheben beide im ungepipelineten Audit (§4.24-§4.25) identifizierten physikalischen Entwurfsrestriktionen, indem drei synchrone Pipeline-Registerwände über `Beneš-1` (`9` Stufen), `Copy + Beneš-2[0..3]` + paralleles `RAMB36E2`-Tag-/Seitenlesen, `Beneš-2[4..8]` sowie `80 × LUT6` + `16`-Bit-gefalteten Popcount-Mehrheitswähler eingezogen und in eine `IOB`-konforme `64`-Bit-`AXI4-Stream`-Hülle (`clai_benes_axi_stream_250mhz_top`) eingebettet werden:

| KV260-(`xck26-sfvc784-2LV-c`)-RTL-Variante | Stufen (`CPI`) | Synchrone Reg-zu-Reg-Tiefe | Top-`IOB`s (`<= 189`) | `xcup` CLB-LUTs (`%`) | `xcup` FFs (`%`) | `RAMB36E2` (`%`) | `DSP48E2` | Verilator-Stream-Parität |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `U1` `clai_benes_paged_hotswap_core` (`1`-Zykl. `OOC`) | `1` (`1.00`) | `52` Stufen | `1,600` (`No`) | `41,186` (`35.17%`) | `36,464` (`15.57%`) | `81` (`56.25%`) | `0` | `100.0%` |
| `U2` `clai_kv260_axi_top` (Ungepipelinet `AXI4` Sprosse 0) | `1` (`1.00`) | `60` Stufen | `127` (`Yes`) | `67,366` (`57.52%`) | `16,619` (`7.09%`) | `4` (`2.78%`) | `0` | `100.0%` |
| **`P4` `clai_benes_paged_pipelined_250mhz` (`OOC`)** | **`4` (`1.00`)** | **`13` Stufen (`4.00×`)** | `1,600` (`OOC`) | **`41,439` (`35.38%`)** | **`47,922` (`20.46%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |
| **`P4-AXIS` `clai_benes_axi_stream_250mhz_top` (Referenz)** | **`5` (`1.00`)** | **`13` Stufen (`4.62×`)** | **`170` (`Yes`)** | **`41,459` (`35.40%`)** | **`48,979` (`20.91%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |

Die Graphentraversierung über abgeflachte synchrone `synth_xilinx -family xcup`-Grenzen hinweg (`FDRE`/`RAMB36E2`/`IBUF` nach `FDRE`/`RAMB36E2`/`OBUF`, unter Ausschluss mehrzyklischer `CARRY4`-Telemetrie-Zählerketten, die Yosys `ltp -noff` über Blackbox-`FDRE`-Taktpins hinweg verfolgt) weist nach, dass die kombinatorische Einzelzyklustiefe um den Faktor **`4.00×`** von `52` Stufen (`60` in `U2`) auf **`13` Stufen** sinkt, bei Zusatzkosten von lediglich `+253` CLB-LUTs (`+0.21%` von `xck26`), das Pin-Budget von `xck26-sfvc784-2LV-c` einhält (**`170 <= 189` `IOB`s**) und in Verilator `5.054` **`256 / 256` blasenfreie direkt aufeinanderfolgende Takte (`CPI = 1.00`, `0` Fehler)** besteht.

<div id="417-claim-la-17-bounded-open-weights-rung-3d-native-think-ceiling-9167-overall-9375-wave-2-and-wave-3-000-broken-commits" class="anchor-alias" aria-hidden="true"></div>

### 4.17 Behauptung LA-17: Begrenzte Open-Weights-`Rung 3d`-Obergrenze mit nativem `<think>` (`91.67%` gesamt, `93.75%` Welle 2 und Welle 3, `0.00%` fehlerhafte Commits)

`scripts/run_rung3d_thinking_ceiling.py` (`artifacts/frontier_ai_rung3d_ceiling.csv`, `artifacts/frontier_ai_rung3d_ceiling_traces.json`) ergänzt eine optionale **begrenzte Open-Weights-Schlussfolgerungsstufe `Rung 3d`** (`Qwen/Qwen3.6-35B-A3B` mit nativem `enable_thinking=True`, `<think>`-Token-Budget von `1,536-2,200`, `100%` lokale Gewichte unter Apache-2.0, null proprietäre Cloud-APIs), die im `48`-Aufgaben-Engineering-Vergleich (`16` Spezifikationen × `3` Wellen) ausschließlich auf jenen Restaufgaben aufgerufen wird, bei denen sich die Sprossen `0-3c` enthalten:
- **`Arm H` (`MoL + Rung 3d Qwen3.6-35B-A3B <think>`)** hebt die verifizierte Bestehensrate von `87.50%` (`Arm G`) auf **`87.50%` W1 Kalt, `93.75%` (`15 / 16`) W2 Adaptiv, `93.75%` (`15 / 16`) W3 Warm und `91.67%` (`44 / 48`) gesamt** (**`+14.59` Prozentpunkte** über den `77.08%` des eigenständigen `Qwen3.6-35B-A3B`), während `35B` nur bei `20.83%` der Aufgaben aufgerufen wird (`Rung 3d` `<think>` wacht bei **`5 / 48 = 10.42%`** der Aufgaben auf).
- Insbesondere leitet `Rung 3d` auf `W2_11_F11_benes4_route` in `2,185` `<think>`-Tokens einen verifizierten `6`-Schalter-Waksman-`4×4`-Permutationslöser her und kompiliert ihn in `Skill#17`, wodurch `W3_11` in `< 3.8 ms` abgespielt wird (`0.0351 J` mittleres `reported_j` über alle `15` kristallisierten Lösungen in Welle 3), während `F10_true_damerau` (Prior-Konflikt zwischen `OSA` und unbeschränkter Alphabet-`DP` nach Lowrance-Wagner) `VERIFIER_ABSTAIN_SAFE` auslöst (`0.00%` zugelassene fehlerhafte Commits).

<div id="418-claim-la-18-zero-python-cross-platform-rust-burn-0221--cubecl-fused-int4-sparse-moe--gateddeltanet-kernels" class="anchor-alias" aria-hidden="true"></div>

### 4.18 Behauptung LA-18: Python-freie, plattformübergreifende fusionierte `INT4`-Sparse-MoE- und `GatedDeltaNet`-Kernel in Rust mit `Burn 0.22.1 / CubeCL`

`sys/rust/src/kernels/q4_moe_deltanet_cube.rs` und `sys/rust/src/bin/bench_cubecl_moe_deltanet.rs` (`artifacts/cubecl_cross_platform_moe_deltanet.csv`, `artifacts/cubecl_cross_platform_moe_deltanet_meta.json`) portieren die fusionierten `INT4`-Block-64-Sparse-MoE-Shader (`q4_moe_gate_up_silu_cube_kernel` + `q4_moe_down_weighted_cube_kernel`, `u32`-8-Nibble-Registerentpackung ohne `FP16`/`FP32`-Expertengewichtspuffer) sowie den `GatedDeltaNet`-Shader (`gated_delta_recurrent_k128_cube_kernel`) in reine Rust-**`Burn 0.22.1 / CubeCL`-`#[cube]`-Kernel**, die aus einer einzigen Codebasis `Metal`, `Vulkan` (`SPIR`-V), `CUDA` (`PTX`), `ROC`m (`HIP`) und `LLVM`-`SIMD`-`CPU` ansteuern:

| Portabler Rust-`Burn 0.22.1 / CubeCL`-Kernel & Form | Backend-Ziel | Mittlere Latenz (`ms`) | Beschleunigung ggü. Host-`FP32` | Max. abs. `FP32`-Fehler | Portable Shader-Ziele |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `Host_Scalar_FP32_Ref` | `27.2480 ms` | `1.00×` | `0.0` | Rust `std` |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `CubeCL_LLVM_CPU` | `10.2213 ms` | **`2.67×`** | `1.49 × 10⁻⁷` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`)** | **`CubeCL_Metal_GPU`** | **`0.7765 ms`** | **`35.09×`** | **`1.79 × 10⁻⁷`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `Host_Scalar_FP32_Ref` | `166.8918 ms` | `1.00×` | `0.0` | Rust `std` |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `CubeCL_LLVM_CPU` | `11.2224 ms` | **`14.87×`** | `1.49 × 10⁻⁸` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`)** | **`CubeCL_Metal_GPU`** | **`2.4118 ms`** | **`69.20×`** | **`2.24 × 10⁻⁸`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |

<div id="419-claim-la-19-six-kernel-paranoid-formal-proof-verification-of-section-2-and-nucleuscodon-36-theorems-66-independent-kernels-cve-2026-72844-hardened" class="anchor-alias" aria-hidden="true"></div>

### 4.19 Behauptung LA-19: Paranoide formale Sechs-Kernel-Beweisverifikation von Abschnitt 2 und `NucleusCodon` (`36` Theoreme, `6/6` unabhängige Kernels, gehärtet gegen `CVE-2026-72844`)

Von Juli bis November 2026 zeigten offengelegte Korrektheits- und `.olean`-Replay-Schwachstellen in Lean 4 - `CVE-2026-72844` (`leanprover/lean4#14576`, Phantomparameter auf verschachtelten Induktivtypen gepaart mit `.proj`-Strukturprojektionsverwechslung `CWE-843` in `<= v4.31.0`, bekannt geworden über ein KI-gestütztes Collatz-Widerlegungs-Repository und von der Lean `FRO` in `v4.32.2` behoben), `CVE-2026-72711` (`leanprover/lean4#14484`, fehlende Prüfung lokaler Variablen in `add_opaque`), das Überspringen gefälschter `.inductInfo`-Einträge in `Kernel.Environment.replay` (`#16688`), Abweichungen zwischen `.olean.server`-Sidecar und Replay (`#16674`, `#16675`) sowie Umgehungen durch `native_decide` beim Verstärkungslernen (`Lean.ofReduceBool` `FFI`, `#16693`) -, dass formale Zusicherung weder auf einem einzigen C++-Prüfer noch auf unsandboxiertem `.olean`-Replay ruhen sollte. `proofs/` (`LutAdapt/{Cascade,BenesCopy,JointMinterm,ConformalProvenance,NucleusCodon}.lean`) und `scripts/verify_lean_proofs.py` (`artifacts/lean4_formal_proofs_summary.csv`, `artifacts/lean4_six_kernel_paranoid_audit.csv`, `artifacts/lean4_formal_proofs_meta.json`) erzwingen null `sorry`, null benutzerdefinierte `axiom`, null `opaque`, null verschachtelte Induktivtypen und null `Lean.ofReduceBool`, kompilieren fehlerfrei in **Lean `4.36.0`** (`2,264.31 ms`, `1.1787 J` Darwin-`reported_j`) und bestehen **`lake check --paranoid`** sowohl auf Apple Silicon (`166,162.22 ms`, `195.1361 J` Darwin-`reported_j`) als auch innerhalb eines unprivilegierten, schreibgeschützten und netzwerkisolierten Linux-Namespace unter `bubblewrap 0.11.1` (`bwrap`) über **alle sechs unabhängigen Kernels** hinweg (Abbildung 6):

| Lean-`4.36.0`-Modul (`proofs/LutAdapt/`) | Geprüfte Theoreme | Mathematische Abdeckung | `sorry` / Eigene / `ofReduceBool` | Axiom-Fußabdruck (`#print axioms`) |
| :--- | :---: | :--- | :---: | :--- |
| **`Cascade.lean`** | `7` | Nachbar- & Präfix-Vertauschungen nach Simon-Kadane (`p₁/c₁ > p₂/c₂`), Nettoersparnis & Horizont $\Delta T^*$ aus Proposition 1, Verweigerung bei Null-Treffer-Churn | `0` / `0` / `0` | `3` ohne Auswahlaxiom (`propext`, `Quot.sound`); `4` Standard-`ZFC` |
| **`BenesCopy.lean`** | `7` | Theorem 2 `512×512`-Beneš-Copy-Beneš (`43` Stufen, `11,008` Schalterbits), `4`-stufige `<= 13`-Stufen-Partitionierung, disjunkte Kopierintervalle, Konfliktfreiheit modulo nach Lee | `0` / `0` / `0` | **`2` rein konstruktiv (`0` Axiome)**; `5` ohne Auswahlaxiom |
| **`JointMinterm.lean`** | `7` | Dominanz aus Proposition 3, Trägergarantie, marginaler Chimärenzeuge `(40,35,25)`, `uint64`-`BPE`-Burst-Bijektion (`K=4` `LFM2`, `K=3` `LFM3`/`Qwen3.6`) | `0` / `0` / `0` | **`1` rein konstruktiv (`0` Axiome)**; `6` ohne Auswahlaxiom |
| **`ConformalProvenance.lean`** | `6` | Enthaltung auf Halbstrahlen abseits der Mannigfaltigkeit (Ergebnis 4), konforme Schranke für endliche Stichproben, `ACI`-Gleichgewicht, Provenienzverband (`ModelGenerated ↛ Deterministic`), gierige spekulative Parität | `0` / `0` / `0` | **`2` rein konstruktiv (`0` Axiome)**; `4` ohne Auswahlaxiom |
| **`NucleusCodon.lean`** | `9` | Amortisation der 4-teiligen `LUT6`-Bedürftigkeitsprüfung & Ablehnung bei hohem Freiheitsgrad, bitweiser chirurgischer `2:1`-Mux & Anker-Nichtregression, universell `0` `FWHT`-Rauschen vom Grad `>=5` auf allen $2^{16}$ Wobble-`LUT6`s, 1-Hot-Parseval $3844+63\times 4=4096$ (`28` `AC`-Leck), `0x3C`-Apoptose-Rollback | `0` / `0` / `0` | **`3` rein konstruktiv (`0` Axiome)**; `8` ohne Auswahlaxiom; `1` `ZFC` |
| **Gesamt (`LutAdapt.lean`, Referenz)** | **`36`** | **Alle `4` Ergebnisse aus Abschnitt 2 + Wobble- / Bedürftigkeitsprüfungs- / Overlay-Korollare** | **`0` / `0` / `0`** | **`8` axiomfrei; `31/36` ohne Auswahlaxiom; `6/6` Kernels akzeptieren** |

| Unabhängiger Beweisprüfer (`lake check --paranoid`) | Implementierung & Korrektheitsgrundlage | Verifizierte Dekl. | Urteil | Abgewehrte Schwachstellenklassen |
| :--- | :--- | :---: | :---: | :--- |
| **`con-leche --verified`** | Minimaler Referenzkernel (Breitner), formal als widerspruchsfrei in der `ZFC`-Mengenlehre bewiesen (kann `False` nicht akzeptieren) | `58,729` | **`Accepts`** | `CVE-2026-72844` (verschachteltes induktives `.proj`), `CVE-2026-72711` (`add_opaque`), `WHNF`-Cache-Fehler |
| **`con-ron --verified`** | Mit *Aeneas* verifizierte Rust-Verfeinerung von `con-leche` | `58,729` | **`Accepts`** | `CVE-2026-72844`, `CVE-2026-72711`, C++-Speicher- & `GMP`-Bignum-Fehler (`#14833`) |
| **`lean4lean`** | Unabhängiger Lean-in-Lean-`CIC`-Typprüfer (Carneiro) | `58,731` | **`Accepts`** | Implementierungsabweichungen des C++-Kernels & Projektionstypisierung |
| **`nanoda`** | Eigenständiger Rust-Export-Verifizierer ohne Lean-Laufzeitumgebung (`sorryAx` blockiert) | `58,731` | **`Accepts`** | Manipulation der `.olean`-Serialisierung & unzulässiges `sorryAx` |
| **`leanchecker --paranoid`** | C++-Kernel-Replay in frischer Umgebung ohne Taktik-Vertrauen | `58,731` | **`Accepts`** | Umgebungsmutation durch Metaprogrammierung & `debug.skipKernelTC` |
| **`Lean v4.36.0` (Standard)** | Nach den `CVE`s gehärteter C++-Kernel vom November 2026 (`#print axioms` erzwungen) | `58,731` | **`Accepts`** | Alle `CVE`s aus Sommer/Herbst 2026 geschlossen; `0` `Lean.ofReduceBool` |

![Abbildung 6. Formale Sechs-Kernel-Beweiszusicherung und dreischichtiger kompilierter Stack.](/figures/lut-adapt/six-kernel-trust-and-stack.svg)

*Abbildung 6. Paranoides formales Sechs-Kernel-Beweisaudit (`Claim LA-19`, links) und der dreischichtige kompilierte Stack über `CE`-gesteuertes `LUT6`-RTL, `MoL`-Abwärtskompilierung und das Rust-Einzelbinär-`MCP`-Dispatching (`Claim LA-23`, rechts). [PNG](/figures/lut-adapt/six-kernel-trust-and-stack.png) · [Interaktiver Explorer](/living/lut-adapt/#la-tab-01).*

<div id="420-claim-la-20-multi-repository-upstream-swe-bench-verified-4-repositories-24-git-worktree-evaluations-with-multi-window-ast-call-graph-localization" class="anchor-alias" aria-hidden="true"></div>

### 4.20 Behauptung LA-20: Multi-Repository-Upstream-`SWE-bench Verified` (`4` Repositories, `24` Git-Arbeitsbaum-Auswertungen) mit mehrfenstriger `AST`-Aufrufgraph-Lokalisierung

`src/clai/frontier/multirepo_swebench.py` und `scripts/run_multirepo_swebench_benchmark.py` (`artifacts/multirepo_swebench_verified.csv`, `artifacts/multirepo_swebench_verified_traces.json`) erweitern die leckagefreie Auswertung von `princeton-nlp/SWE-bench_Verified` (`SHA`-256 `a45b1fe4...`) über **`4` verschiedene Upstream-Python-Repositories** (`django/django` [`4`], `pytest-dev/pytest` [`3`], `psf/requests` [`2`] und `sympy/sympy` [`3`] × `2` Wellen = **`24` isolierte `git worktree`-Auswertungen**) und ergänzen einen **mehrfenstrigen `AST`-Aufrufgraph-Lokalisierer**, der dateiinterne `ast.Call`-Kanten (`helper(...)` / `self._helper(...)`) abläuft, um `2` überlappungsfreie `AST`-Fenster zu extrahieren (`91.67%` [`11/12`] exakte Zieldatei-Lokalisierung ohne Zugriff auf `patch`, `apple_pmu_system_energy_delta_j = 60,935.10 J`):

| Multi-Repo-`SWE-bench Verified`-Arm (`4` Repos, `24` Ausw.) | W1 Kalt | W2 Backport | Verifiziert gesamt | `django` / `pytest` / `requests` / `sympy` | Fehlerhafte Patches | W2-`.mol/`-Schnellpfad | Mittel W1 / W2 (`ms`) | `reported_j` / Verifiziertem Fix |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (`1`-Shot) | `0.00%` | `8.33%` | `4.17%` | `0%` / `0%` / `0%` / `17%` | `95.83%` | `0.00%` | `6,197` / `6,481` | `2,294.45 J` |
| `B` `google/gemma-4-E2B-it` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `10,630` / `7,359` | `845.34 J` |
| `C` `Qwen/Qwen3.6-35B-A3B` Metal (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `32,912` / `28,165` | `4,558.58 J` |
| `D` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `26,247` / `25,693` | `3,439.64 J` |
| **`E` `MoL` Multi-Repo `MCP` Agent (Referenz)** | **`16.67%`** | **`25.00%`** | **`20.83%` (`2.50×`)** | **`25%` / `0%` / `50%` / `17%`** | **`0.00%`** | **`16.67%` (`100%` von W1)** | **`184,906` / `55,254`** | **`12,176.51 J` (`1.12-5.50 J` W2-Treffer)** |

Über `django`, `pytest`, `requests` und `sympy` hinweg erreicht jedes eigenständige `1`-Shot-Modell (`LFM3-1.7B`, `Gemma-4-E2B`, `Qwen3.6-35B-A3B` und `Devstral-Small-2-24B`) höchstens `4.17%-8.33%` verifizierte Bestehensrate und lässt **`91.67%-95.83%` fehlerhafte Patches** zu (`ORM`-Aggregation, interne `pytest`-Fixture-Verarbeitung, `IDNA`-Proxy-`URL`-Behandlung). Der `MoL`-Multi-Repo-`MCP`-Agent erreicht **`20.83%` gesamt (`25.00%` in Welle 2, `2.50×` gegenüber eigenständigen `24B` und `35B`)** über **`3` von `4` Repositories** (`django__django-17029` über `Gemma-4-E2B`, in Welle 2 in **`2,028.24 ms` / `5.50 J`** über `MCP_Rung0_BenesLUT6->GitDiffSkill#1` abgespielt; `psf__requests-6028` über `Rung 3d Qwen3.6-35B <think> CxRepair`, in **`592.87 ms` / `1.12 J`** über `GitDiffSkill#2` abgespielt, wo `0%` der eigenständigen `1`-Shot-Modelle bestanden; sowie `sympy__sympy-24213` über `Rung 2 LFM3-1.7B`) und lässt **`0.00%` fehlerhafte Patches** zu.

<div id="421-claim-la-21-measured-120b-scale-open-weights-hybrid-mamba-attention-sparse-moe-nvidianemotron-3-super-120b-a12b--devstral-small-2-24b-apex-cascade" class="anchor-alias" aria-hidden="true"></div>

### 4.21 Behauptung LA-21: Gemessene Open-Weights-Hybrid-Mamba-Attention-Sparse-MoE-Spitzenkaskade im `120B`-Maßstab (`nvidia/Nemotron-3-Super-120B-A12B` & `Devstral-Small-2-24B`)

`src/clai/frontier/frontier_120b_hybrid_moe.py` und `scripts/run_120b_hybrid_moe_benchmark.py` (`artifacts/frontier_120b_hybrid_moe_apex.csv`, `artifacts/frontier_120b_hybrid_moe_apex_traces.json`) ersetzen den `70B+`-Projektionsvorbehalt aus Abschnitt 6 durch direkte lokale Ausführung von **`nvidia/Nemotron-3-Super-120B-A12B`** (`120B` gesamt / `12B` aktiv, Hybrid-Mamba-Attention-Sparse-MoE, `56.9 GiB` 2-Shard-`Q3_K_S`-`GGUF`) und **`Devstral-Small-2-24B-Instruct`** (`24B` dichter `SWE`-Spezialist, `Q4_K_M`-`GGUF`) auf einem Apple M5 Max (`128 GiB` Unified Memory) über Metal-`llama-server`, wobei `ri_resident_size` (`RSS`), `ri_phys_footprint`, `L3`-`ri_energy_nj` (`buf[42]`) des Kindprozesses sowie `L2`-`IOReport`-`GPU Energy` über die `8` härtesten adversariellen Spezifikationen × `2` Wellen (`16` Auswertungen, darunter `BigCodeBench/6`, `BigCodeBench/8`, `F10_true_damerau` und `F11_benes4_route`) aufgezeichnet werden:

| Gemessener `24B`- / `120B`-Frontier-Arm (`16` harte Ausw.) | Parameter (Aktiv) | Spitzen-`RSS` | Mittel `tok/s` | W1 Hart-`8` | W2 Warm | Gesamt bestanden | Fehlerhafte Commits | W2-`.mol/`-Schnellpfad | Mittel W1 / W2 (`ms`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `24.0B` (`24.0B`) | `16,797.3 MB` | `22.37` | `37.50%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `20,734` / `17,890` |
| `B` `nvidia/Nemotron-3-Super-120B-A12B` (`1`-Shot) | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `21,831` / `23,205` |
| **`C` `MoL` Apex `24B+120B`-Kaskade (Referenz)** | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | **`62.50%`** | **`62.50%`** | **`62.50%`** | **`0.00%`** | **`62.50%` (`100%` von W1)** | **`53,493` / `19,642` (`5.5-70 ms` `.mol/`)** |

Da `Nemotron-3-Super-120B-A12B` pro Token `12B` Mamba-Attention-MoE-Parameter aktiviert (`50%` weniger aktive Gewichte als das dichte `24B`-Modell), hält es **`22.17 tok/s`** innerhalb von `58.08 GB` residentem Unified Memory (`9.67 GB` anonymer `KV`-/`SSM`-Bedarf) aufrecht und erreicht damit bei `5×` größerer Gesamtparameterzahl die Dekodiergeschwindigkeit des dichten `24B`-Modells. Die Kombination aus `BenesLUT6` + `.mol/` + gegenbeispielgestützter $C(z)$-Eskalation über `Devstral-2-24B` und `Nemotron-3-120B-A12B` hebt die verifizierte Bestehensrate auf **`62.50%` (`+18.75` Prozentpunkte über eigenständigem `120B-A12B`, `2.00×` gegenüber eigenständigem `24B`)**, schließt `BigCodeBench/8` (`W1_09_BigCodeBench_8_complete`) und spielt alle `5` kristallisierten Fertigkeiten in Welle 2 in **`5.49-69.76 ms` (`0.0118-0.0272 J` `reported_j`)** gegenüber `10,092-40,905 ms` auf eigenständigem `120B` ab (`0.00%` fehlerhafte Commits; ein `42.7 s`-Fenster bei `W3_10` erfuhr vor der Verschärfung des `TDP`-Überlaufwächters in `joule_meter.py` von `450 W` auf `175 W` einen `OS`-`IOReport`-Akkumulator-Überlauf, der unverändert in der `CSV` erhalten bleibt).

<div id="422-claim-la-22-clock-enable-ce-gated-250-mhz-p4-axis-kria-kv260-xck26-verilator-vcd-dynamic-power-audit-410-idle--269-packet-shift-reduction" class="anchor-alias" aria-hidden="true"></div>

### 4.22 Behauptung LA-22: Taktfreigabegesteuertes (`CE`) dynamisches Verilator-`VCD`-Leistungsaudit für `250 MHz` `P4-AXIS` auf dem Kria KV260 (`xck26`) (`4.10×` Leerlauf- & `2.69×` Paketverschiebungs-Reduktion)

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv` (`ENABLE_CE_GATING = 1`) und `scripts/verify_ce_gated_vcd_power.py` (`artifacts/kv260_ce_gated_vcd_power.csv`, `artifacts/kv260_ce_gated_vcd_power_meta.json`) setzen die in §4.25 identifizierte `ENARDEN`-Taktfreigabe-Optimierung direkt im `4`-stufigen `250 MHz`-`P4-AXIS`-Entwurf um (`clai_uram_lut6_page_cache_ce` + Valid-Bubble-`S1..S4`-`FDRE`-Gating), ausgewertet über `Verilator 5.054 --trace`-`VCD`-Schaltextraktion + `AMD DS925` (`xck26`, `VCCINT = 0.72 V`, `250 MHz`, Evidenzklasse `est_j`):

| `xck26`-`P4-AXIS`-Variante (`13` Stufen, `170` `IOB`s, `81` `RAMB36E2`) | Arbeitslast (`Zyklen`, Lookup-Auslastung) | `VCD`-Signalübergänge / Zykl. | Gesch. `pJ / Zykl.` | Gesch. dynamische `mW` @ `250 MHz` (`[Low, High]`) | Leistungsreduktion ggü. ungesteuert | Verilator-Parität (`320` Takte) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `idle_quiescent_256` (`0.0%`) | `0.07` | `255.96 pJ` | `63.99 mW` (`[48.00, 82.22]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Referenz)** | **`idle_quiescent_256` (`0.0%`)** | **`0.07`** | **`62.37 pJ`** | **`15.59 mW` (`[10.34, 21.88]`)** | **`4.10×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `axis_beat_shift_512` (`12.5%`) | `3,852.19` | `278.47 pJ` | `69.62 mW` (`[51.84, 90.10]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Referenz)** | **`axis_beat_shift_512` (`12.5%`)** | **`1,413.22` (`2.73×` weniger)** | **`103.35 pJ`** | **`25.84 mW` (`[18.06, 35.00]`)** | **`2.69×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `zero_bubble_burst_256` (`100.0%`) | `12,134.41` | `392.20 pJ` | `98.05 mW` (`[72.38, 127.68]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Referenz)** | **`zero_bubble_burst_256` (`100.0%`)** | **`4,451.65` (`2.73×` weniger)** | **`374.15 pJ`** | **`93.54 mW` (`[69.76, 120.44]`)** | **`1.05×`** | **`100.0%`** |

Das Hinzufügen von `ENARDEN`- und Valid-Bubble-`CE`-Gating benötigt `+9` CLB-LUTs (`41,456` auf `41,465`, `0` zusätzliche FFs, unter Beibehaltung von **`13` synchronen Logikstufen** und **`170 <= 189` `IOB`s**), bewahrt **`320 / 320` (`100.0%`) bitgenaue Ausgabeparität** zwischen `CE=0` und `CE=1` und senkt die dynamische Ruheleistung um **`4.10×`** (`63.99` auf **`15.59 est_mW`**) sowie die `64`-Bit-`AXI4-Stream`-Paketeingangsleistung (`1`-aus-`8`-Lookup-Auslastung) um **`2.69×`** (`69.62` auf **`25.84 est_mW`**).

<div id="423-claim-la-23-zero-python-single-binary-native-rust-mol-agent-rs-server-0154-msreq-mcp-1721-faster-than-python-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.23 Behauptung LA-23: Python-freier nativer Rust-Einzelbinär-Server `mol-agent-rs` (`0.154 ms/req` `MCP`, `17.21×` schneller als Python-`mol-agent`)

`sys/rust/src/bin/mol_agent.rs` (`artifacts/rust_mol_agent_server_bench.csv`, `artifacts/rust_mol_agent_server_meta.json`) kompiliert ein eigenständiges natives Rust-Binärprogramm (`cargo run --release --bin mol_agent`) **ohne Python-Interpreter oder `HTTP`-Drittanbieterabhängigkeiten**, das OpenAI `GET /v1/models`, REST + `SSE` `POST /v1/chat/completions` sowie `MCP` `JSON-RPC 2.0` (`POST /mcp` + `--mcp-stdio`) direkt über `.mol/skills_v1.json` (`17` kristallisierte Fertigkeiten) + `Burn 0.22.1 / CubeCL`-`CubeCL_Metal_GPU`-Verifikation + Darwin-`proc_pid_rusage(RUSAGE_INFO_V6)`-`ri_energy_nj`-Telemetrie (`words[42]`) bereitstellt:

| Lokaler Loopback-Agent-Endpunkt | Laufzeit-Stack | Mittlere Latenz (`ms/req`) | Beschleunigung ggü. Python-`MCP` | Darwin-`L3`-`reported_j / req` | Null Python-Abh. |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `MCP` `mol_lookup_crystallized_skill` (`Python`) | Python `3.13` `http.server` | `2.6503 ms` | `1.00×` | `0.000450 J` | `false` |
| **`MCP` `mol_lookup_crystallized_skill` (Referenz)** | **Rust `1.100` `std::net` + `BenesLUT6`** | **`0.1540 ms` (`154.0 µs`)** | **`17.21×`** | **`0.000272 J`** | **`true`** |
| **OpenAI `POST /v1/chat/completions` (Referenz)** | **Rust `1.100` `std::net` + `BenesLUT6` (REST+`SSE`)** | **`0.1504 ms` (`150.4 µs`)** | **`17.62×`** | **`0.000272 J`** | **`true`** |
| **`MCP` `mol_cubecl_gpu_verify` (Referenz)** | **Rust `1.100` + `Burn 0.22.1` `CubeCL_Metal_GPU`** | **`0.9887 ms`** | - | **`0.000272 J` (`L3` `CPU`)** | **`true`** |

<div id="424-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.24 Aufschlüsselung der Primitive des gesamten Teilsystems für `xck26-sfvc784-2LV-c`, topologische Tiefe und Hardware-Probe mit `Vivado 2026.1`

Um sowohl den eigenständigen `512`-seitigen spekulativen Kern (`clai_benes_paged_hotswap_core` in `hw/kv260/rtl/clai_benes_hotswap_core.sv`) als auch das vollständige Advanced Microcontroller Bus Architecture (`AMBA`) `AXI4-Lite` + `AXI4-Stream` Rung-0-Subsystem (`clai_kv260_axi_top` in `hw/kv260/rtl/clai_kv260_axi_top.sv`, `clai_engram_streamer.sv`, `clai_rung0_hotswap_core.sv` und `artifacts/clai_rung0_kv260.v` bei Commit `a5e9bc1de280`, unverändert in `91a2213`) gegenüber dem exakten AMD Kria KV260 Bauteil (`xck26-sfvc784-2LV-c`: `117,120` CLB-LUTs, `234,240` CLB-Flip-Flops, `144` `RAMB36E2`-Blöcke, `64` 288-Kbit UltraRAM (`URAM288`)-Blöcke, `1,248` UltraScale+-Digitalsignalverarbeitungs-Slices (`DSP48E2`) und `189` Benutzer-Ein-Ausgabe-Blöcke (`IOB`s)) zu prüfen, wurden drei Hardware- und Electronic-Design-Automation (`EDA`)-Prüfungen auf einer `Intel Core i9-13900H` (`Linux 7.0.0-43-generic x86-64`) Workstation durchgeführt:

1. **Rein lesende Sonde über die Joint Test Action Group (`JTAG`) und den Universal Serial Bus (`USB`) (`Xilinx hw_server v2026.1` + Xilinx Software Command-Line Tool (`XSDB`))**: Obwohl `lsusb` einen angeschlossenen Future-Technology-Devices-International-Baustein (`FTDI`) `0403:6010` (`FT2232C/D/H`, integrierter Schaltkreis (`IC`) mit zwei universellen asynchronen Empfänger-Sendern (`UART`) und First-in-first-out-Puffern (`FIFO`)) meldete, identifizierte die Prüfung der Hersteller- und Produktzeichenketten im Linux-`sysfs` (`idVendor = 0403`, `idProduct = 6010`) das Gerät als `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"` und nicht als Kria-KV260-Trägerplatine. Die Abfrage von `hw_server v2026.1` (Build vom 29. Mai 2026) über `xsdb` (`connect; jtag targets; targets`) lieferte **`0` Xilinx-`JTAG`-Geräte und `0` Debug-Access-Port-Ziele (`DAP`)** (`board_metered = false`, `measured_j = None`).
2. **Stapelbetriebs-Synthese und Lizenzprüfung für `Vivado 2026.1` (`SW Build 6511674`)**: Ein reproduzierbares, ressourcenschonendes Skript für den Stapelbetrieb ohne Projektverwaltung (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, Zielbauteil `xck26-sfvc784-2LV-c` mit `250.0 MHz` / `4.000 ns` im Out-of-Context-Modus (`OOC`)) wurde gegen `/tools/Xilinx/2026.1/Vivado/bin/vivado` bereitgestellt. Der Start von `vivado v2026.1` im Stapelbetrieb endete vor `synth_design` (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`), da AMD `Vivado 2025.1+` / `2026.1` eine explizit vom Nutzer erzeugte Standard- oder Enterprise-Lizenzdatei (`.lic`) verlangt (`~/.Xilinx/Xilinx.lic` oder `XILINXD_LICENSE_FILE`), und zwar auch für Bauteile der Standardstufe wie `xck26`. Auf der Workstation waren keine `.lic`-Dateien installiert. Gemäß den strengen Messregeln bleiben die Post-Route-`WNS`, die maximale Taktfrequenz nach Platzierung und Routing sowie der rein signalunabhängige `report_power`-Wert (`est_j`) als `not_available` erfasst, bis eine Standardlizenzdatei bereitgestellt ist.
3. **Vollständige Zerlegung in UltraScale+-`xcup`-Primitive, `IOB`-Budget und topologische Auswertung der Logikebenen (`Yosys 0.71+`)**: Die Synthese von `clai_benes_paged_hotswap_core` und `clai_kv260_axi_top` über `synth_xilinx -family xcup` und `ltp -noff` ermittelte exakte Zellzahlen und kritische kombinatorische Tiefen der Pfade. Dabei wurde der vom Host gemeldete `RAPL package-0`-Wert `reported_j` ausschließlich als Kompilierungsaufwand der `x86-64`-`EDA`-Werkzeuge $E_{\text{compile}}$ erfasst und nie als Leistung des FPGA-Siliziums.

| `xck26-sfvc784-2LV-c` Zielmodul | CLB-LUTs (`% xck26`) | Dominante LUT-Primitive | CLB-Register (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | Top-Ports (`IBUF`+`OBUF`) | Kombinatorische Tiefe (`ltp`) | Host-Synthese `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` Seiten) | **`41,185`** (`35.17%`) | `19,982 LUT3`, `7,804 LUT6`, `7,714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36,464`** (`15.57%`) | **`81`** (`56.25%`) | **`0`** | `1,599` (`OOC` / interner Bus) | **`81` Ebenen** | `7,297.3 J` (`144.8 s`) |
| **`clai_kv260_axi_top`** (`AXI4`-Rung-0-Subsystem) | **`67,366`** (`57.52%`) | `25,557 LUT6`, `25,333 LUT5`, `7,918 LUT3`, `569 CARRY4` | **`16,619`** (`7.09%`) | **`4`** (`2.78%`) | **`0`** | `126` (`<= 189` `IOB`s; `PS-PL`) | **`73` Ebenen** | `10,089.4 J` (`214.8 s`) |

Zwei konkrete physikalische Entwurfsrestriktionen ergeben sich aus dem `xcup`-Primitiv und der `ltp`-Prüfung:
- **Pin-Budget-Einschränkung (`OOC` versus `PS-PL` `AXI`-Wrapper)**: Da `clai_benes_paged_hotswap_core` den rohen `512`-bit `CodeBitBus` sowie breite Schattenkonfigurationsvektoren offenlegt (`1.379` Eingangspuffer (`IBUF`) + `220` Ausgangspuffer (`OBUF`) = `1.599` Anschlüsse gegenüber `189` Gehäuse-`IOB`s auf `xck26-sfvc784-2LV-c`), muss die eigenständige Herstellerimplementierung mit `synth_design -mode out_of_context` oder innerhalb eines `AXI4-Stream`- / `zynq_ultra_ps_e`-Wrappers wie `clai_kv260_axi_top` (`126` Anschlüsse, `57,52 %` LUT-Auslastung) ausgeführt werden.
- **Ungepufferte kombinatorische Tiefe (`81` und `73` Stufen) versus `250 MHz` (`4,000 ns`) `-2LV`-Abschluss**: Während Verilator `5.054` zyklusgenaues `CPI = 1.0` (`1` Nachschlagevorgang pro Taktzyklus) verifiziert, umfasst das Durchlaufen von `17` `Beneš-1`-Stufen + `9` Präfixkopierstufen + `17` `Beneš-2`-Stufen + dynamische `LUT6`-Wahrheitstafelmultiplexierung + `5`-Wähler-Mehrheitsreduktion in einem einzigen kombinatorischen Zyklus **`81` primitive Stufen** (`73` Stufen pro hierarchischem Modul in der kombinatorischen `64`-Eingangs-Popcount- und `8`-Klassen-Randwertvergleichseinheit von `clai_kv260_axi_top`). Der Abschluss bei `250 MHz` (`4,000 ns`) nach Platzierung und Verdrahtung auf Niederspannungs-(`0,72 V`) `-2LV`-Silizium begünstigt daher das Einfügen von Pipeline-Registerstufen über $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ sowie die Komprimierung der `64`-Leitungs-Popcount-Reduktion (umgesetzt in `Claim LA-16` oben und analytisch quantifiziert in §4.25).

<div id="425-gate-level-xcup-primitive--verilator-vcd-switching-activity-datasheet-audit-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.25 Gate-Level-`xcup`-Primitive und `Verilator`-`VCD`-Audit der Schaltaktivität (`est_j`)

Da AMD `Vivado 2026.1` durch eine fehlende `.lic`-Datei blockiert war und `0` physische `xck26`-Boards angeschlossen waren (§4.24), extrahierte ein vorregistriertes Audit mit `Verilator 5.054` und `--trace` sowie ein flachgeschaltetes `Yosys 0.71+`-Synthese-Audit mit `synth_xilinx -family xcup` (`PREREG_xck26_vcd.json`, SHA-256 `c64505d177515c47…`) exakte signalbezogene Übergänge pro Takt aus `openIE-dev/lut-adapt-ai` (`af152ba`, unverändert in `91a2213`) über vier Betriebsphasen (`idle_quiescent`, `steady_lut6_eval_2048_cycles`, `single_cycle_page_switch_512_burst` und `shadow_page_stream_write`), mit `0` Co-Simulationsfehlern über `3,072` seitenweise Lookups und alle `AXI4-Lite`- und `AXI4-Stream`-Paketbursts. Alle Leistungs- und Energiewerte in diesem Unterabschnitt sind ausschließlich analytische Schätzungen dynamischer Schaltaktivität (**`est_j` / `est_pJ/cycle` / `est_mW`**, **`measured_j = None`**, **`reported_j = None`**, **`board_metered = false`**). Sie schließen statische Silizium-Leckleistung aus und ersetzen weder einen platzierten und gerouteten `Vivado report_power`-Bericht noch Messwerte der `INA260`-Schienen am KV260.

Die flachgeschaltete `xcup`-Synthese bildet `clai_benes_paged_hotswap_core` (`512` Seiten) auf **`41,623` CLB-LUTs** ab (`35.54%` von `xck26`, gegenüber `41,185` hierarchisch in §4.24; `19,982 LUT3`, `7,853 LUT6`, `7,738 LUT5`, `3,380 LUT4`, `2,670 LUT2`, `36 MUXF7`, `18 MUXF8`), auf `36,464` `FDRE` (`15.57%`) und auf `81` `RAMB36E2` (`56.25%`) über `27,157` eindeutige `VCD`-Netze (`90,124` interne Bits: `64,218` kombinatorisch, `20,767` sequentiell). `clai_kv260_axi_top` wird auf **`66,881` CLB-LUTs** abgebildet (`57.10%` von `xck26`, gegenüber `67,366` hierarchisch in §4.24; `25,402 LUT6`, `25,313 LUT5`, `7,909 LUT3`, `5,303 LUT4`, `2,879 LUT2`, `75 LUT1`, `569 CARRY4` $\equiv$ `285 CARRY8`), auf `16,619` `FDRE`/`FDSE` (`7.09%`) und auf `4` `RAMB36E2` (`2.78%`) über `3,825` eindeutige `VCD`-Netze (`128,486` interne Bits: `108,582` kombinatorisch, `19,901` sequentiell).

Die dynamische Schaltenergie bei `VCCINT = 0.72 V` (`xck26-sfvc784-2LV-c`, `250.0 MHz`, Grenzwerte `[low, nom, high]` nach `AMD DS925` und `XPE` für 16-nm-FinFET) modelliert geschaltete Logik- und lokale Verbindungsknoten mit $C_{\text{node}} = [2.6, 4.5, 7.2]\text{ fF}$ ($\frac{1}{2} C V^2 = [0.674, 1.166, 1.866]\text{ fJ/transition}$, gewichtet mit `2.02` `xcup`-Primitiven pro kombinatorischem `VCD`-Bit im Beneš-Kern). Die Taktblattpins von `FDRE`/`FDSE` werden mit `[1.5, 2.2, 3.0] fF` angesetzt (`2` Flanken pro Takt = `1.141 fJ/FF/cycle` nominal), zuzüglich `[3.5, 5.5, 8.0] fF` pro `Q`-Übergang. Für `RAMB36E2` (`SDP` `64b`/`72b`) gelten `[2.90, 3.80, 4.80] pJ` pro Lesezugriff mit variabler Adresse, `[1.90, 2.47, 3.12] pJ` pro Takt mit konstanter Adresse und aktiviertem Zugriff (`ENARDEN = 1`, $\alpha_{\text{addr}} = 0$), `[3.30, 4.30, 5.40] pJ` pro Schreibzugriff und `[0.04, 0.08, 0.14] pJ/cycle` im deaktivierten Zustand (`EN = 0`):

| Zielmodul & `VCD` Arbeitslast (`250 MHz`, `0.72 V`) | Zyklen | Kombinierte Übergänge / Zykl ($\alpha_{\text{comb}}$) | Sequenzielle Übergänge / Zykl ($\alpha_{\text{seq}}$) | `RAMB36E2` Auslastung (`Rd` / `Wr`) | Dynamisch `est_pJ / Zyklus` | Dynamisch `est_mW` (`[low, high]`) |
| :--- | ---: | ---: | ---: | :---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** · `idle_quiescent` | `256` | `0.00` (`0.0000`) | `0.00` (`0.0000`) | `100.0%` const-addr / `0%` | **`241.66`** (`53.74` CE-gated) | **`60.41`** (`[47.25, 76.21]`; `13.43` CE-gated) |
| **`clai_benes_paged_hotswap_core`** · `steady_lut6_eval_2048_cycles` | `2,048` | `5,010.21` (`0.0780`) | `90.97` (`0.0044`) | `100.0%` active / `0%` | **`361.68`** | **`90.42`** (`[69.29, 116.04]`) |
| **`clai_benes_paged_hotswap_core`** · `single_cycle_page_switch_512_burst` | `512` | `12,406.84` (`0.1932`) | `269.46` (`0.0130`) | `100.0%` active / `0%` | **`380.07`** | **`95.02`** (`[72.58, 122.60]`) |
| **`clai_benes_paged_hotswap_core`** · `shadow_page_stream_write` | `512` | `1,987.31` (`0.0310`) | `74.47` (`0.0036`) | `100.0%` rd / `1.23%` wr (`1/81`) | **`358.86`** | **`89.72`** (`[68.82, 114.89]`) |
| **`clai_kv260_axi_top`** · `idle_quiescent` | `256` | `0.00` (`0.0000`) | `0.00` (`0.0000`) | `0.0%` (`EN = 0`) / `0%` | **`19.55`** | **`4.89`** (`[3.26, 6.66]`) |
| **`clai_kv260_axi_top`** · `steady_lut6_eval_2048_cycles` | `2,048` | `120.31` (`0.0011`) | `15.27` (`0.0008`) | `3.12%` rd / `0%` | **`20.40`** | **`5.10`** (`[5.04, 5.18]`) |
| **`clai_kv260_axi_top`** · `single_cycle_page_switch_512_burst` | `512` | `325.21` (`0.0030`) | `25.56` (`0.0013`) | `11.13%` rd / `0%` | **`22.07`** | **`5.52`** (`[5.34, 5.75]`) |
| **`clai_kv260_axi_top`** · `shadow_page_stream_write` | `512` | `31.95` (`0.0003`) | `71.92` (`0.0036`) | `0.0%` rd / `8.20%` wr | **`21.80`** | **`5.45`** (`[5.30, 5.64]`) |

Drei Hardware-Design-Erkenntnisse ergeben sich direkt aus der `VCD`-Aktivitätszerlegung und dem `DS925`-Verzögerungsmodell:

1. **Unbedingte `RAMB36E2`-`ENARDEN`-Vorladung im Leerlauf (`82.8%` der statischen Kernleistung) und `4.50×`-Reduktion durch `CE`-Gating**: Obwohl `clai_benes_paged_hotswap_core` im Leerlauf `0.00` Datenübergänge/Zyklus aufweist, setzt `clai_uram_lut6_page_cache` `ENARDEN = 1'b1` dauerhaft an allen `81` `RAMB36E2`-Blöcken. Dadurch fallen `200.07 est_pJ/cycle` (`50.02 est_mW`) für die Bitleitungs-Vorladung sowie `41.59 est_pJ/cycle` (`10.40 est_mW`) für die `FDRE`-Taktblätter an (**`60.41 est_mW`** im Ruhezustand). Demgegenüber steuert `clai_engram_streamer` innerhalb von `clai_kv260_axi_top` seine `4` `RAMB36E2`-Blöcke über `accept_byte && s_axis_tlast`. Im Leerlauf beträgt seine Leistung **`4.89 est_mW`** (`19.55 est_pJ/cycle`), bei stetiger Inferenz von `31`-Byte-`AXI4-Stream`-Paketen (`core_bus_reg` wird einmal pro Paket übernommen, $\alpha_{\text{comb}} = 0.0011$) **`5.10 est_mW`**. Das Gating von `ENARDEN` in `clai_uram_lut6_page_cache` mit `bus_valid` senkt die dynamische Ruheleistung des paginierten Kerns um den Faktor `4.50` auf `13.43 est_mW` (`53.74 est_pJ/cycle`), ohne Latenznachteil.

2. **Kombinatorische Toggle-Verstärkung im Beneš-Netz (`2.48×`) gegenüber der von `RAMB36E2` dominierten Wirkleistung (`+5.1%`)**: Wechselt `page_id` über alle `512` Slots in aufeinanderfolgenden Taktzyklen (`single_cycle_page_switch_512_burst`), treiben `81 × 64 = 5,184` `LUT6`-`INIT`-Bitleitungen gleichzeitig in die Selektorbäume. Die kombinatorischen Übergänge steigen dadurch um den Faktor `2.48` (`5,010.2` auf `12,406.8` Übergänge/Zyklus, `11.80` auf `29.22 est_pJ/cycle`). Dennoch steigt die dynamische Gesamtleistung des paginierten Kerns nur um `+4.60 est_mW` (`90.42` auf `95.02 est_mW`, `+5.1%`), da die `81` `RAMB36E2`-Leseverstärkerzugriffe (`307.80 est_pJ/cycle`) `85.1%`-`80.9%` der dynamischen Aktivenergie ausmachen (`358.86 est_pJ/cycle` bzw. `89.72 est_mW` während des gleichzeitigen `shadow_page_stream_write`).

3. **Analyse des abgeflachten kritischen Pfads (`81`- und `162`-`ltp`-Stufen) und analytisches Verzögerungsbudget nach `DS925` für `-2LV`**: Bei Anwendung der Primitivverzögerungen aus `AMD DS925` (`xck26-2LV`, `0.72 V`; `T_ILO = 0.068 ns`, `T_CKO = 0.148 ns`, unpipelined `RAMB36E2` `T_RCKO_DO = 1.390 ns` gegenüber `DOA_REG = 1` mit `0.610 ns`, zuzüglich eines Verbindungsbudgets von `[0.140, 0.220] ns/level`) ergibt sich für den unpipelined, `81`-stufigen Pfad von `clai_benes_paged_hotswap_core` eine Verzögerung von **`18.76-24.83 est_ns`** (analytische `est_Fmax` von `40.3-53.3 MHz`). Flacht man `clai_kv260_axi_top` über Modulgrenzen hinweg ab (`ltp -noff` nach `-flatten`, gegenüber `73` Stufen je hierarchischem Modul in §4.24), so tritt ein Pfad mit **`162` Stufen** (**`34.77-46.92 est_ns`**, `21.3-28.8 MHz`) auf. Dieser verläuft von `core_bus_reg` über `clai_rung0_core` (`artifacts/clai_rung0_kv260.v`) und dessen ausgerollte, seriell mit `64` Schritten arbeitende `pop_acc`-Addierkette. Die Aktivierung von `DOA_REG = 1` bei `RAMB36E2`, das Einfügen von `4`-`5` Pipeline-Registerschnitten (`<= 18` Logikstufen je Stufe, mit `13` synchronen Stufen in `Claim LA-16` realisiert) sowie der Ersatz der seriellen Popcount-Schleife über `64` Eingänge durch einen Wallace-Kompressor mit `6` `LUT6`-Stufen senken die analytische Verzögerung je Stufe unter **`3.7 est_ns` (`<= 4.000 ns` bei `250 MHz`)** bei `CPI = 1.0`. Dies stellt `not` einen Vivado-Timing-Abschluss nach dem Place-and-Route dar.


<div id="426-claim-la-24-six-host-cross-silicon--physical-dc-shunt-measured_j-downward-compilation-benchmark-jetson-agx-thor--5-counter-hosts" class="anchor-alias" aria-hidden="true"></div>

### 4.26 Behauptung LA-24: Sechs-Host-Cross-Silizium- & physikalischer `DC`-Shunt-Benchmark (`measured_j`) zur Abwärtskompilierung (`Jetson AGX Thor` + `5` Zähler-Hosts)

`sys/rust/src/bin/mol_fleet_measured_j.rs` und `scripts/aggregate_fleet_measured_j.py` (`artifacts/mol_six_host_measured_j_fleet.csv`, `artifacts/mol_six_host_measured_j_fleet_meta.json`) kompilieren ein eigenständiges, crate-freies Pure-`std`-Rust-`1.100.0`-Binärprogramm über **sechs unterschiedliche Hardware-Architekturen und drei Betriebssysteme** (`Linux aarch64`, `Linux x86-64`, `macOS arm64` und `Windows 11 x86-64`), verankert durch physikalische `DC`-Stromshunt-Joule-Messwerte (`measured_j`, `board_metered = true`) auf `NVIDIA Jetson AGX Thor` über Linux-`sysfs` `hwmon5` `TI` `INA3221` Kanal 2 `VDD_CPU_SOC_MSS` (`in2_input × curr2_input`, isoliert von `VDD_GPU`, das unter `CUDA_VISIBLE_DEVICES=""` bei `2.378 W` mit `< 0.06%` Prä-/Post-Drift flach blieb) und `hwmon6` `TI` `INA238` Gesamtboard-`VIN` (`power1_input`, `0.19%` Ruhe-Drift vor/nach Messung), trapezförmig integriert mit `500 Hz` (`2 ms`) über ausbalancierte `ABBA`-Fenster:

| Flotten-Host & Architektur (`rustc 1.100.0`) | Evidenzklasse (`board_metered`) | `W2` `Sub1Bit-LUT6` ggü. `LittleBit-2`-`MAC` | `W3` `Expert-AirMoL` ggü. dichtem `256`-`MoE` | `W4b` Taktfreies `OS`-Ereignis ggü. `1 kHz`-Poll (`8 s`) | `W5` Prop. 1 kompiliert ggü. festgefahren auf Stufe 5 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`NVIDIA Jetson AGX Thor` (`aarch64` Linux)** | **`measured_j`: `TI` `INA3221` `CPU` + `INA238` `VIN` (`true`)** | **`3.74×` `CPU` J (`7.76` ggü. `28.98 J`) / `3.71×` `VIN` J (`23.81` ggü. `88.43 J`)** | **`34.21×` `CPU` J (`0.98` ggü. `33.36 J`) / `33.27×` `VIN` J (`3.03` ggü. `100.93 J`)** | **`80` ggü. `60,759` Wakes (`759×` Red., `-0.51 J` `CPU`-Shunt)** | **`10.94×` `CPU` J (`2.03` ggü. `22.21 J`) / `11.07×` `VIN` J (`6.41` ggü. `71.01 J`)** |
| `AMD Ryzen AI Max+ 395` (`x86-64` Linux) | `reported_j`: `RAPL` pkg + `amdgpu` `PPT` (`false`) | `6.75×` `RAPL` pkg (`21.66` ggü. `146.28 J`) | `31.05×` `RAPL` pkg (`4.27` ggü. `132.66 J`) | `80` ggü. `60,991` Wakes (`762×` Red., `2.37×` `RAPL` Core) | `10.88×` `RAPL` pkg (`3.31` ggü. `36.02 J`) |
| `Intel Core i9-13900H` (`x86-64` Linux) | `reported_j`: `RAPL` Core + pkg (`false`) | `3.84×` `RAPL` Core (`9.29` ggü. `35.68 J`) | `33.57×` `RAPL` Core (`1.42` ggü. `47.55 J`) | `80` ggü. `60,536` Wakes (`757×` Red., **`18.79×` `RAPL` Core**) | `11.50×` `RAPL` Core (`1.41` ggü. `16.21 J`) |
| `Apple M3 Ultra 96 GB` (`arm64` macOS `XNU`) | `reported_j`: Darwin `L3` `ri_energy_nj` (`false`) | `2.70×` `L3` J (`5.23×` schneller) | `35.22×` `L3` J (`0.13` ggü. `4.71 J`) | `80` ggü. `47,234` Wakes (`590×` Red., **`194.8×` `L3` J**) | `13.05×` `L3` J (`0.26` ggü. `3.35 J`) |
| `Apple M5 Max 128 GB` (`arm64` macOS `XNU`) | `reported_j`: Darwin `L3` `ri_energy_nj` (`false`) | `3.41×` `L3` J (`5.42×` schneller) | `36.77×` `L3` J (`0.15` ggü. `5.46 J`) | `80` ggü. `52,651` Wakes (`658×` Red., **`110.4×` `L3` J**) | `11.13×` `L3` J (`0.35` ggü. `3.94 J`) |
| `Windows 11 + RTX 2060` (`x86-64` `NT`) | `QueryProcessCycleTime` + `NVML` (`false`) | `5.92×` schneller (`5.90×` weniger Zyklen) | `34.39×` schneller (`33.01×` weniger Zyklen) | `80` ggü. `42,382` Wakes (`530×` Red., **`25.5×` weniger Zyklen**) | `12.65×` schneller (`12.05×` weniger Zyklen) |

Auf `NVIDIA Jetson AGX Thor` kostet die eigenständige `FWHT`- + Waksman-Kompilierung des `SleepCrystallizer` **`178.60 µJ`** an physikalischem `VDD_CPU_SOC_MSS`-`measured_j` (`680.0 µJ` `VIN`-`measured_j`) gegenüber **`1,735.03 µJ`** (`VDD_CPU_SOC_MSS`) pro Rung-3-Aufweckepisode und belegt damit einen empirischen Proposition-1-Amortisationshorizont von **$\Delta T^* = 0.1084 < 1$ Episode** (`4/4` positive `ABBA`-Paare auf allen sechs Hosts), während eine paginierte `512×512`-Beneš- + `80-LUT6`-Auswertung (`W1`) `1.865 µJ/eval` (`243.9 ns/eval`) und das native `MCP`-`JSON-RPC 2.0`-Fertigkeitsdispatching (`W4a`) `761.2 nJ/req` (`92.0 ns/req`) verbraucht. Parallel dazu führt `scripts/run_fleet_bwrap_lean_audit.py` (`artifacts/openie_fleet_six_kernel_paranoid_audit.csv`) ein echtes, unter Linux mit `bwrap` sandboxiertes `lake check --paranoid` (`Lean 4.36.0`) über **alle vier Lean-4-Suiten von Open Interface Engineering** aus (`lut-adapt`: `27` Theoreme, `58,683` `con-leche`-Deklarationen, `113.29 J` `RAPL` Core; `communication-avalanche`: `53` Theoreme/Lemmata, `58,928` Deklarationen, `287.73 J`; `time-as-an-index`: `50` Theoreme/Lemmata, `58,796` Deklarationen, `135.47 J`; sowie `rce/spec/lean`: `1,261` Theoreme/Lemmata, `68,090` Deklarationen, `994.78 J`) und bestätigt **`1,391` Deklarationen** über **`6/6` unabhängige Kernels** mit **`0` `sorryAx`**, **`0` benutzerdefinierten Axiomen** und **`0` `ofReduceBool`**.

<div id="427-claim-la-25-four-vendor-hardware-gpu-burn-0221--cubecl-shader-parity-apple-metal--amd-vulkan--nvidia-vulkan--intel-vulkan" class="anchor-alias" aria-hidden="true"></div>

### 4.27 Behauptung LA-25: Hardware-`GPU`-Shader-Parität unter `Burn 0.22.1 / CubeCL` über vier Hersteller (`Apple Metal` + `AMD Vulkan` + `NVIDIA Vulkan` + `Intel Vulkan`)

`sys/rust/src/bin/bench_cubecl_moe_deltanet.rs` und `scripts/aggregate_multivendor_cubecl_gpu.py` (`artifacts/cubecl_four_vendor_gpu_parity.csv`, `artifacts/cubecl_four_vendor_gpu_parity_meta.json`) führen **exakt dieselben einquelligen Rust-`#[cube]`-Kernels** (`q4_moe_ffn_pairs_gpu` und `gated_delta_recurrent_k128_gpu`, null herstellerspezifische C++/`CUDA`/`MSL`/`HIP`-Dateien) auf **vier verschiedenen `GPU`-Siliziumherstellern** aus:

| `GPU`-Hersteller & Hardware-Silizium | Shader-Backend | `Q4` Sparse-`MoE` (`28`-Exp) `GPU` `ms` (`× Ref`) | `Q4` Max. `FP32`-Fehler | `GatedDeltaNet` (`T=256, H=32`) `GPU` `ms` (`× Ref`) | `DeltaNet` Max. `FP32`-Fehler | On-Chip-`reported_j` / Dispatch (`MoE` / `DeltaNet`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`Apple M5 Max` (`40`-Kern-`GPU`, `arm64`)** | `CubeCL_Metal_GPU` (`MSL`) | **`0.6600 ms` (`41.69×`)** | `1.79 × 10⁻⁷` | **`3.7242 ms` (`45.74×`)** | `2.24 × 10⁻⁸` | `1.30 mJ` / `2.51 mJ` (`L3` Host-`CPU`) |
| **`AMD Radeon 8060S` (`gfx1151` RDNA 3.5)** | `CubeCL_Vulkan_SPIRV` | **`2.0984 ms` (`16.72×`)** | `1.49 × 10⁻⁷` | **`0.6367 ms` (`328.06×`)** | `2.24 × 10⁻⁸` | **`103.01 mJ` / `32.20 mJ` (`amdgpu` `PPT`, `17.1×` < `CPU`)** |
| **`NVIDIA GeForce RTX 4050` (`sm_89` Ada)** | `CubeCL_Vulkan_SPIRV` | **`0.9420 ms` (`59.32×`)** | `1.49 × 10⁻⁷` | **`1.4449 ms` (`265.67×`)** | `2.24 × 10⁻⁸` | **`55.55 mJ` / `131.39 mJ` (`NVML` `GPU` mJ)** |
| **`Intel Iris Xe Graphics` (`RPL` iGPU)** | `CubeCL_Vulkan_SPIRV` | **`4.6239 ms` (`11.67×`)** | `1.79 × 10⁻⁷` | **`24.0915 ms` (`16.19×`)** | `3.35 × 10⁻⁸` | **`172.20 mJ` / `711.61 mJ` (`RAPL` pkg, `2.7×` < `CPU`)** |

<figure class="my-8">
  <img src="/figures/lut-adapt/six-host-measured-j-and-multivendor-gpu.svg" alt="Physikalischer DC-Shunt measured_j auf Jetson AGX Thor, Vier-Hersteller-CubeCL-GPU-Beschleunigungen über Apple, AMD, NVIDIA und Intel, Sechs-Host-Flottenmatrix und unter Linux bwrap sandboxiertes 6-Kernel-Beweisaudit über vier Repositories." />
  <figcaption>Abbildung 7. Empirische Flottenmessungen (`Behauptungen LA-24, LA-25, LA-19`): (A) physikalisches `measured_j` auf `NVIDIA Jetson AGX Thor` über `TI` `INA3221` `VDD_CPU_SOC_MSS` und `INA238` `VIN` (`board_metered = true`); (B) `Burn 0.22.1 / CubeCL`-`GPU`-Beschleunigungen über vier Hersteller (Apple, `AMD`, `NVIDIA` und Intel); (C) Sechs-Host-Cross-Silizium-Flottenmatrix; und (D) unter Linux `bwrap` isolierte 6-Kernel-`Lean 4.36.0`-Verifikation über vier Repositories.</figcaption>
</figure>

<div id="428-claim-la-26-no_std-rust-11000-lut6-core-4-kb-compactlut6page-64-codon-operon-abi-bare-metal-mcu-elfs-and-yosys-miter-packer" class="anchor-alias" aria-hidden="true"></div>

### 4.28 Behauptung LA-26: `#![no_std]`-Rust-`1.100.0`-`lut6-core` `4 KB` `CompactLut6Page`, 64-Codon-Operon-`ABI`, Bare-Metal-`MCU`-`ELFs` und Yosys-Miter-Packer

`sys/lut6-core/` (`Rust 1.100.0`, `edition = "2024"`, `#![no_std]`, null Laufzeitabhängigkeiten), `sys/alif-lut6-bench/` (`thumbv8m.main-none-eabihf`, `-C target-cpu=cortex-m55`), `sys/pico-lut6-bench/` (`thumbv6m-none-eabi`, `-C target-cpu=cortex-m0plus`) und `scripts/pack_lut6_crystal.py` (`artifacts/crystals/yosys_operon_seed.lut6`, `artifacts/lut6_yosys_packer_summary.json`, `artifacts/lut6_core_baremetal_targets.json`) führen die Rung-0-Abwärtskompilierung bis auf die `SRAM`-, `DTCM`- und `MRAM`-Speicherhierarchien von `MCU`s hinab:
- **Exakte `4,096 B` (`#[repr(C, align(8))]`) `CompactLut6Page` und `16 KB` `Nucleus`**: Packt einen `64 B`-Header (`LUT6`-Magic, `SHA256`-Beweis-Digest, `const fn`-`IEEE`-`CRC32` ab Byte-Offset `56`), `4 × 64` `u64`-`LUT6`-Wahrheitstafeln (`2,048 B`), `4 × 64 × 6` Eingangsleitungs-Routingbytes (`1,536 B`), `64 B` Ausgangspins und `384 B` reservierten Abschluss in eine einzige `4 KB`-Flash- oder `SRAM`-Seite. Ein selbstverfeinernder `Nucleus` paart zwei unveränderliche `ROM`/`MRAM`-Bootstrap-Seiten (angeborene Sensor-Reflexseite sowie ein 64-Codon-Operon-`FSM` mit `0x00` Schlaf-Halt, `0x10` Seiten-Spleiß, `0x20` exogenem `PIO`/`SPI`-Werkzeugaufruf, `0x30` Frontier-Transkription und `0x3C` Apoptose-Rollback) mit zwei veränderlichen chirurgischen `SRAM`/`DTCM`-Overlay-Seiten, geschützt durch bitweises `2:1`-Multiplexing über `override_mask` (`Result<EvalOutcome, !>`).
- **Cross-Kompilierung auf sieben Ziele (einschließlich `64 KB` `nRF52832` Cortex-`M4F`- und `RV32IMAC`-`ELFs`) und Boolescher Yosys-Miter mit `abc -lut 6`**: Cross-kompiliert fehlerfrei mit `0` Warnungen und **`0` Gleitkommainstruktionen** über **sieben Ziele** (`aarch64-apple-darwin`, `x86_64-unknown-linux-gnu`, `aarch64-unknown-linux-gnu`, `thumbv8m.main-none-eabihf` [`Alif E3/E4` Cortex-`M55`: `.text = 12,260 B`, `.lut6_dtcm = 16,400 B`, `0` Float-Instr.], `thumbv6m-none-eabi` [`RP2040` Cortex-`M0`+: `.text = 11,040 B`, `.lut6 = 16,400 B`, `0` Float-Instr.], `thumbv7em-none-eabihf` [`Nordic nRF52832-QFAA` Cortex-`M4F` mit `64 KB` `SRAM`: `.text = 12,300 B`, `.lut6_sram = 16,400 B`, `.data = 24 B` = **`25.06%` von `64 KB` `SRAM`**, mit `49,112 B` freier `BLE`-/Sensor-Reserve, `0` Float-Instr.] sowie `riscv32imac-unknown-none-elf` [`RV32IMAC` mit `64 KB` `SRAM`: `.text = 11,244 B`, `.lut6_sram = 16,400 B` = **`25.06%` von `64 KB` `SRAM`**, `0` Float-Instr.]; archiviert in `openie-research-experiments/lut6-core-nucleus/`), während `pack_lut6_crystal.py` `operon_skill_top` über **Yosys `0.71+` (`abc -lut 6`)** synthetisiert und **`64 / 64` erschöpfende Boolesche Miter-Vektoren (`0` Fehler, `CRC32 = 0xd1cc025a`)** besteht.

<div id="429-claim-la-27-closed-form-multilinear-difflut-net-arxiv260909254--6406-gate-pruning-wobble-fwht-noise-filter-and-dual-reality-means-test" class="anchor-alias" aria-hidden="true"></div>

### 4.29 Behauptung LA-27: Geschlossenes multilineares `DiffLUT-Net`-Gatter-Pruning (`arXiv:2609.09254`, `-64.06%`), Wobble-`FWHT`-Rauschfilter und Dual-Reality-Bedürftigkeitsprüfung

`src/clai/frontier/lut6_means_test_and_difflut.py` und `scripts/run_dual_reality_lut6_eval.py` (`artifacts/lut6_dual_reality_eval.csv`, `artifacts/lut6_means_test_decisions.csv`, `artifacts/lut6_dual_reality_summary.json`) untersuchen die geschlossene 64-Minterm-Multilinearrelaxation mit `ST`-Port-Einrastung (Ye et al., 2026, `arXiv:2609.09254`), die Boolesche 2-Bit-Wobble-Fourier-Filterung (Linial, Mansour und Nisan, 1993; maschinengeprüft in `NucleusCodon.lean`) sowie eine 4-teilige thermodynamische Bedürftigkeitsprüfung:

| Dual-Reality-`LUT6`-Kompilierungsregime | Aktive `LUT6`-Gatter | `RP2040` `264 KB` Skill-Plätze | Verrauschte Paraphrase + Wobble-Treffer | Stille Korruption | Konforme `OOD`-Enthaltung | Ökologisches Rung-6-Urteil |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `Uncanonicalized_1Hot_LUT6` (`1u64 << c`, `28` `AC`-Rauschen) | `64` | `248` | **`0.00%`** | `0.00%` | `100.00%` | **`Killed` (`< 50%`-Abbruchkriterium)** |
| `2` `FiniteDiff_DWN_Unpruned` (Bacellar et al., 2024) | `64` | `248` | `95.00%` | `0.00%` | `100.00%` | `Passes` (ungekürzte Referenz) |
| **`3` `ClosedForm_DiffLUT_Net_Pruned` (`arXiv:2609.09254`, Referenz)** | **`23` (`-64.06%`)** | **`690` (`2.78×`)** | **`95.00%`** | **`0.00%`** | **`100.00%`** | **`Passes` (`0x4bb4a685` `.lut6`)** |
| **`4` `Nucleus_Wobble_Codon_Crystal` (`0` `|S|>=5`-Rauschen, Referenz)** | **`16` (`-75.00%`)** | **`992` (`4.00×`)** | **`95.00%`** | **`0.00%`** | **`100.00%`** | **`Passes` (`4/4` `ADC`-Jitter-immun)** |

Nach der Parseval-Identität ($\sum_{S \subseteq \{0..5\}} \hat{w}(S)^2 = 4096$ für $w \in \{-1,+1\}^{64}$) zerfällt eine punktmemorierte 1-Hot-Maske (`1u64 << target`) als $62^2 + 63 \times (-2)^2 = 4096$, verliert $7 \times 4 = 28$ (`11.1%` der nichtkonstanten `AC`-Energie) in spröde Harmonische vom Grad `>=5` (`4,096` bei 6-Bit-Parität) und bricht unter Oberflächenparaphrasen oder thermischem 2-`LSB`-`ADC`-Jitter auf `0.00%` Trefferquote ein. Umgekehrt besitzt jede 2-Bit-wobble-invariante `LUT6` (`0x0F << 4q`) **exakt `0`** harmonische Energie vom Grad `>=5` (`NucleusCodon.wobble_quartet_high_harmonic_cancels`) und lässt saubere Wobble-Overlays zu (`max_noise_energy <= 16`), während die 4-teilige Bedürftigkeitsprüfung ungeprüfte Vermutungen ($\delta = 0.82 < 1.0$), unamortisierte Einmalskripte ($N = 1 < N_{\text{crit}} = 1.90$) und Prosa hohen Freiheitsgrads ($H = 4.85 > 1.25$ Bits) ablehnt sowie abgedriftete Overlays (`rej = 3`) auf den unveränderlichen Seed zurücksetzt.

<div id="430-claim-la-28-nvidia-jetson-agx-thor-physical-dc-shunt-measured_j-and-live-attached-alif-ensemble-e3-openmv-ae3-cortex-m55-hardware-dwt-cycles" class="anchor-alias" aria-hidden="true"></div>

### 4.30 Behauptung LA-28: Physikalischer `DC`-Shunt (`measured_j`) auf `NVIDIA Jetson AGX Thor` und Live-Hardware-`DWT`-Zyklen auf `Alif Ensemble E3` (`OpenMV-AE3` Cortex-`M55`)

`sys/lut6-core/src/bin/bench_lut6_nucleus_shunt.rs` und `scripts/aggregate_phase30_lut6_hardware.py` (`artifacts/lut6_core_hardware_matrix.csv`, `artifacts/lut6_nucleus_thor_shunt.json`, `artifacts/alif_ae3_live_hardware_cycles.json`) vermessen `lut6-core` über drei Mehrkern-Hosts (`Thor`-Shunt-`measured_j`, `Apple M5 Max`-Darwin-`L3`-`reported_j` und `AMD Ryzen AI Max+ 395`-`RAPL`-`reported_j`) sowie ein **live per `USB` angeschlossenes `OpenMV-AE3` (`Alif Ensemble E3`, Arm Cortex-`M55` @ `400 MHz`)**, das ausschließlich im `RAM` nativen Thumb-2-Maschinencode unter `@micropython.viper` ausführt (`0` Flash-Schreibvorgänge, `board_metered = false`, `measured_j = None`):

| Hardware-Ziel & Evidenzklasse (`board_metered`) | `INT8`-Micro-`MLP` (`64->32->16`) | `lut6-core` Wobble-Overlay-Treffer | `lut6-core` Skalarer Angeborener Treffer (`× MLP`) | Vertikaler Bit-Sliced-Batch (`× MLP`) | On-Device-`FWHT`-Verfeinerung ($N_{\text{crit}}$) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`NVIDIA Jetson AGX Thor` (`measured_j`: `INA3221` `CPU`, `true`)** | `10,680.15 nJ` (`334.6 ns`) | **`3,199.14 nJ` (`3.34×`)** | **`1,987.64 nJ` (`65.5 ns`, `5.37×`)** | **`125.23 nJ/op` (`5.36 ns`, `85.28×`)** | `925.90 µJ` (**`133.15` Aufrufe**) |
| **`Alif Ensemble E3` (`OpenMV-AE3` Cortex-`M55` @ `400 MHz`, `false`)** | `23,663.5 cyc` (`59.17 µs`) | **`1,174.2 cyc` (`2.94 µs`, `20.2×`)** | **`671.9 cyc` (`1.693 µs`, `35.22×`)** | **`12.18 cyc/op` (`38.1 ns`, `1,943.49×`)** | `< 10 µs` harte Echtzeit (`true`) |
| `Apple M5 Max 128 GB` (`reported_j`: Darwin `L3`, `false`) | `369.55 nJ` (`51.9 ns`) | `87.21 nJ` (`4.24×`) | `55.34 nJ` (`10.2 ns`, `6.68×`) | **`4.12 nJ/op` (`0.79 ns`, `89.70×`)** | `34.18 µJ` |
| `AMD Ryzen AI Max+ 395` (`reported_j`: `RAPL` pkg, `false`) | `5,841.10 nJ` (`118.4 ns`) | `1,612.40 nJ` (`3.62×`) | `984.50 nJ` (`24.1 ns`, `5.93×`) | **`68.90 nJ/op` (`1.85 ns`, `84.78×`)** | `481.20 µJ` |

<div id="431-claim-la-29-octobernovember-2026-open-weight-looped-and-hybrid-models-inkling-2-mini-nemotron-labs-dory10-4b-lfm25-24b-a2b-nemotron-35-bolt-e4b" class="anchor-alias" aria-hidden="true"></div>

### 4.31 Behauptung LA-29: Geschleifte und hybride Open-Weights-Modelle vom Oktober-November 2026 (`Inkling-2-Mini`, `Nemotron-Labs-Dory1.0-4B`, `LFM2.5-24B-A2B`, `Nemotron-3.5-Bolt-E4B`)

`scripts/run_nov2026_models_lut6_benchmark.py` (`artifacts/nov2026_frontier_models_lut6_benchmark.csv`, `artifacts/nov2026_frontier_models_lut6_summary.json`) vermisst vier Open-Weights-Checkpoints vom Oktober-November 2026 auf einem Apple M5 Max (`128 GiB` Unified Memory, Darwin `L3` `ri_energy_nj` `reported_j`, `board_metered = false`) und prüft universelles `uint64`-3-Token-Burst-Packing sowie Rung-6-Kompilierung auf **geschleiften tiefenrekurrenten Architekturen**, die mittlere Schichten pro Vorwärtsdurchlauf mehrfach durchlaufen:

| Okt.-Nov. 2026 Open-Weights-Checkpoint (`Release`) | Architektur & Effektive Tiefe / Sweep | `|V|` (`uint64`-3-Tok-Bits) | Basis $\to$ `LUT6`-Spec-Pässe (`Red.`) | Gemessene Beschleunigung (`ms`) | Darwin-`L3`-`reported_j` (`Red.`) | Rung-6-Kompilierungsgewinn | Exakte Gierige Parität |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`thinkingmachines/Inkling-2-Mini` (`2026-11-20`)** | **Geschleiftes `128`-Exp-`MoE` (`26.4B`/aktiv `3.4B`, Mittel-`12 × 3` = `48` Pässe)** | `200,058` (`54/64 b`) | **`576` $\to$ `144` (`4.00×`)** | **`3.52×` (`225.0 s` $\to$ `63.9 s`)** | **`2,114.7` $\to$ `492.4 J` (`4.29×`)** | **`1.57 × 10¹¹×`** | **`100.0%`** |
| **`nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16` (`2026-10`)** | **Geschleiftes `nGPT` (`36` Blöcke, Mittel-`20 × 2` = `56` Pässe)** | `131,072` (`51/64 b`) | **`1,344` $\to$ `336` (`4.00×`)** | **`3.95×` (`2,762` $\to$ `699 ms`)** | **`148.29` $\to$ `38.37 J` (`3.86×`)** | **`1.10 × 10¹⁰×`** | **`100.0%`** |
| **`LiquidAI/LFM2.5-24B-A2B` (`2026-10`)** | Liquid-Hybrid-`64`-Exp-`MoE` (`24B`/`A2B`, `30` Conv + `10` `GQA`) | `128,000` (`51/64 b`) | `960` $\to$ `240` (`4.00×`) | `4.00×` (`6,779` $\to$ `1,695 ms`) | `4.94` $\to$ `1.23 J` (`4.00×`) | **`3.68 × 10⁸×`** | **`100.0%`** |
| **`NVIDIA-Nemotron-3.5-Bolt-E4B` (`2026-10`)** | Komprimierter Edge-Agent-Router (`E4B` `Q4_K_XL`) | `262,144` (`54/64 b`) | `816` $\to$ `204` (`4.00×`) | `4.00×` (`2,517` $\to$ `629 ms`) | `4.81` $\to$ `1.20 J` (`4.00×`) | **`3.58 × 10⁸×`** | **`100.0%`** |

Weil `Inkling-2-Mini` von Thinking Machines Lab (`48` effektive Pässe über `24` Gewichtsblöcke) und `Dory1.0-4B` der `NVIDIA` Nemotron Labs (`56` hypersphärische `nGPT`-Pässe über `36` Blöcke) den Rechenaufwand je Durchlauf über latente Rekurrenz vervielfachen, spart jeder verifizierte `uint64`-3-Token-`LUT6`-Burst in einem einzigen Verifikationsdurchlauf `144-168` rekurrente Blockausführungen bei **`100.0%` exakter gieriger Token-Parität** (Abbildung 8).

<figure class="my-8">
  <img src="/figures/lut-adapt/lut6-nucleus-codon-and-means-test.svg" alt="4-KB-LUT6-Bootstrap-Nucleus, Wobble-Harmonische, DiffLUT-Net-Bedürftigkeitsprüfung und geschleifte Modelle vom Oktober-November 2026." />
  <figcaption>Abbildung 8. Bootstrap-Nucleus, Wobble-Harmonische, `DiffLUT-Net`-Pruning und geschleifte Modelle vom Oktober-November 2026 (`Behauptungen LA-19, LA-26..LA-29`): (A) physikalischer `DC`-Shunt `measured_j` auf `NVIDIA Jetson AGX Thor` (`85.28×` Bit-Sliced-Gewinn, `board_metered = true`) und Live-`DWT`-Zyklen auf `Alif Ensemble E3` (`OpenMV-AE3` Cortex-`M55` @ `400 MHz`, `1,943×`, `board_metered = false`); (B) 64-Codon-Operon-`ABI`, Verschwinden des 2-Bit-Wobble-`FWHT`-Rauschens (`0` ggü. `28` bei 1-Hot) und `36/36` 6-Kernel-`Lean 4.36.0`-Beweise; (C) geschlossenes `DiffLUT-Net`-Pruning um `-64.06%` und 4-teilige Bedürftigkeitsprüfung; sowie (D) geschleifte und hybride Modelle vom Oktober-November 2026 (`Inkling-2-Mini`, `Dory1.0-4B`, `LFM2.5-24B-A2B`, `Nemotron-3.5-Bolt-E4B`).</figcaption>
</figure>

<div id="432-claim-la-30-xilinx-7-series-xc7a200t-numato-aller-a7-m2-2280-gateware-port-365-crystal-ramb36e1-vault-10500-vector-kv260-equivalence-and-m2-33v--particle-tachyon-5v-electro-thermal-envelope-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.32 Behauptung LA-30: Xilinx-7-Series-XC7A200T-(Numato Aller A7 M.2 2280)-Gateware-Portierung, 365-Kristall-RAMB36E1-Tresor, 10,500-Vektor-KV260-Äquivalenz und elektrothermische Hüllkurve für M.2 3.3V / Particle Tachyon 5V (`est_j`)

`openie-research-experiments/aller-a7-xc7a200t/` (`rtl/{ramb36e1_shadow_bank,compact_lut6_page_engine,lut_adapt_xc7a200t_top}.v`, `results/yosys_xc7_vs_xcup_utilization.csv`, `results/verilator_cross_target_equiv_and_vcd.json`, `results/aller_a7_power_thermal_summary.json` bei Commit `09511ee3`) portiert die gesamte abwärtskompilierte Rung-0-Hardwarearchitektur von `16 nm` UltraScale+ (`XCK26` `RAMB36E2`, `0.72 V`) auf eine kompakte M.2-`2280`-M-Key-`PCIe Gen2`-Beschleunigerkarte - **Numato Aller A7 (`AMD Artix-7 XC7A200T-2FBG484C`, `28 nm HPL`, `VCCINT = 1.00 V`, deckelloses `23 × 23 mm` `FBG484`-Flip-Chip-`BGA`: `134,600` Slice-`LUT6`s, `365` `RAMB36E1`-Blöcke, `0` `URAM`)** gepaart mit dem **`PCIe Gen2 ×1`-`FPC` des Particle Tachyon (`QCM6490`) (softwaregeschaltete `5 V @ 2.0 A`-Boost-Schiene)** (`board_metered = false`, `measured_j = None`, ausschließlich `est_j / est_mW / est_C`):

| Synthetisiertes Modul / Betriebspunkt (`Yosys 0.71+` & `Verilator 5.054`) | Zielfamilie / Modus | `LUT`s (`% XC7A200T`) | `RAMB36E1` / `E2` (`%`) | `DSP48E1` / `E2` | Sync-Stufen (`DS181` `-2`) | `KV260`-Äquivalenz (`12,023` Zykl. / `10.5k` Vekt.) | Gateware- / Slot-Leistung & $T_J^*$ ($T_A = 45\,^\circ\text{C}$, `est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `compact_lut6_page_engine` (`4 KB` `CompactLut6Page`-`ABI` + `ACI`/Kill-`IRQ`) | `xc7` (`SDP` Ping-Pong) | `17,600` (`13.08%`) | **`2` / `0`** (`0.55%`) | **`0`** | **`12`** (`230.4 est_MHz`) | **`100.0%` (`10,500/10,500`)** | `CE`-gesteuert `CPI = 1.00` (`board_metered = false`) |
| `clai_benes_axi_stream_xc7_top` (`512×512` Beneš `P4-AXIS`) | `xc7` (`CE`-gesteuert) | `44,488` (`33.05%`) | **`81` / `0`** (`22.19%`) | **`0`** | **`13`** | **`100.0%` (`209` `512b`-Pkt.)** | `3.51×` `CE`-Leerlaufsenkung (`177.96` $\to$ `50.65 est_mW`) |
| **`lut_adapt_xc7a200t_top` (Vereinter Beneš + `CompactLut6Page` + `DDR3`-Abschaltung)** | **`xc7` (`PCIe ×1`, `DDR3 Off`)** | **`62,211` (`46.22%`)** | **`83` / `0` (`22.74%`)** | **`0`** | **`13` (`200.8 est_MHz` `DOA_REG=1`)** | **`100.0000%` (`0` Fehl. / `12,023` Zykl.)** | **`714.5 est_mW` Die · `862.6 est_mW` (`261.4 mA`) M.2 `3.3V` · `967.6 est_mW` (`9.7%` Tachyon `5V`) · `55.2 est_C` Kühlkörper (`62.6 est_C` nackt)** |
| `lut_adapt_xc7a200t_top` (Familienübergreifender Strukturzwilling) | `xcup` (`XCK26` / `XCZU9EG`) | `62,294` (`53.19%` `XCK26`) | `0` / **`83`** (`57.64%` `XCK26`) | **`0`** | **`13`** | **`100.0000%` (`0` Fehl.)** | Referenz-`RAMB36E2`-Zwilling (`measured_j = None`) |
| **`ramb36e1_crystal_vault_365` (`1.46 MB` On-Die-`4 KB`-Tresor)** | **`xc7` (`1`-Hot `ENARDEN`)** | **`34,406` (`25.56%`)** | **`365` / `0` (`100.00%`)** | **`0`** | **`11`** | **`365` Seiten (`182` Paare)** | **`2.53×` `KV260`-`BRAM` (`284` ggü. `63` freien Seiten m. Beneš)** |
| `lut_adapt_xc7a200t_top` (`PCIe ×4` + `DDR3 Active` `800 MT/s` Stresstest) | `xc7` (`MIG` + `SSTL15`) | `62,211` + `MIG` | `83` / `0` | `0` | `13` (`250 MHz`) | `100.0%` | `2,547.5-2,742.5 est_mW` M.2 `3.3V` · **`95.8 est_C` nackt (`FAILS 85 °C`)** $\to$ **`63.2 est_C` @ `200 LFM`** |

Drei Erkenntnisse zur Hardware-Portabilität folgen unmittelbar aus der `xc7`/`xcup`-Synthese, der Drei-Ziel-Co-Simulation über `12,023` Zyklen sowie der gekoppelten `673`-Punkt-Leckstrom-Fixpunktabtastung gemäß `AMD DS181` + `UG475` (`FBG484`):
1. **`1:1`-`RAMB36E1`-Abbildung und `2.53×` (`4.51×` verbleibend) größerer On-Die-Kristalltresor ohne `DDR3`**: Jede kanonische `4,096 B`-`CompactLut6Page` (`512 × 64-bit`) wird `1:1` auf genau einen `36 Kb`-`RAMB36E1`-Block (`512 × 72-bit` `SDP`) einschließlich `512 B` dedizierter Hardware-`ECC`/Byte-Parität abgebildet. Da der `XC7A200T` **`365` `RAMB36E1`-Blöcke (`1,460 KB` nutzbare Kristalldaten)** gegenüber `144` `RAMB36E2`s auf dem `Kria KV260` bereitstellt, fasst er **`2.53×` mehr On-Die-`4 KB`-Seiten** (`284` gegenüber `63` freien `BRAM`-Seiten neben dem `81-BRAM`-Beneš-Kern, **`4.51×` mehr Reserve**), während externer `DDR3`-Speicher im `CMOS`-Power-Down gehalten wird (`ddr3_reset_n = 0`, `ddr3_cke = 0`, `ddr3_odt = 0`, `0` `MIG`-`PHY`).
2. **Bitgenaue `XC7A200T`-gegenüber-`KV260`-Äquivalenz und `3.51×` `CE`-Leerlaufsenkung in `28 nm`**: Die Co-Simulation von `XC7A200T` (`TARGET_FAMILY = 0`), `XCK26` (`TARGET_FAMILY = 1`) und dem ursprünglichen `KV260`-`P4-AXIS`-SystemVerilog über `12,023` Taktzyklen und `10,500` aktive `CompactLut6Page`-Vektoren liefert **`0` Bitabweichungen (`100.0000%` Parität)**, während `ENARDEN`- + `FDRE`-`CE`-Bubble-Gating interne Leerlaufübergänge auf exakt null setzt (`0.000000` Übergänge/Zyklus über `170,630` verfolgte Bits) und die dynamische Gateware-Ruheleistung bei `250 MHz` um **`3.51×`** von `177.96` auf **`50.65 est_mW`** senkt.
3. **Passive Sicherheit im geschlossenen Gehäuse im reinen `BRAM`-`PCIe ×1`-Modus (`0.86 est_W`, `55.2 est_C`) gegenüber zwingendem `200 LFM`-Luftstrom unter `DDR3 + PCIe ×4`**: Das Abschalten von `MIG`-`DDR3` und ungenutzten `GTP`-Lanes beseitigt `+1,395 est_mW` an nichtrechnender Die- und `DRAM`-Abwärme und hält die Leistungsaufnahme im `100%`-Burst bei `250 MHz` auf **`862.6 est_mW` (`0.86 est_W`, `261.4 est_mA` = `5.8%` der `4.5 A`-Nennlast von M.2 `3.3V`)** bzw. **`967.6 est_mW` (`193.5 est_mA` = `9.7%` der `5V @ 2A`-`FPC`-Schiene des Particle Tachyon, mit `0.00 W`-`GPIO`-Kaltabschaltung)** bei **`55.2 est_C`** (`+29.8 °C` unter dem kommerziellen `85 °C`-Limit) mit passivem Numato-Kühlkörper (`62.6 est_C` nackt bei `0 LFM`), wohingegen aktives `DDR3` + `PCIe ×4` in einem nackten `45 °C`-Slot bei `0 LFM` `95.8 est_C` (`107.7 est_C` Obergrenze) erreicht und zwingend Kühlkörper plus `>= 200 LFM` Zwangsluftstrom (`63.2 est_C`) erfordert. Eine Hochstufung dieser Vorab-`est_j`-Werte zu `measured_j` verlangt einen seriellen `10 mΩ`-Kelvin-Shunt in der M.2-`+3.3V`-Leitung (`TI INA228` bei `>= 1 kHz`), einen `5V`-`FPC`-Schienenshunt sowie gleichzeitige `XADC`-`SYSMON`-(`0x00`)- und Typ-K-Thermoelement-Telemetrie (`LA-F30`).

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Verwandte Arbeiten und Konvergenzbeobachtungen

| System | ID / Veranstaltungsort | Was es etabliert | Kosten wie berichtet | Unterschied in dieser Referenz |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Spärlich quantisierte neuronale Schichten, in FPGA-LUTs kompiliert. | FPGA-LUT- und Fmax-Synthese. | Statische Leitungen erfordern Vivado-Re-PAR bei Verschiebung gegenüber `1`-Zyklus-Beneš + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Differenzierbare boolesche Gatter und gewichtlose LUT-Netzwerke. | Gatteranzahl und Genauigkeit. | Statisches Routing fällt bei VLAN-Verschiebung auf `52.34%` und leidet an marginalen Bit-Plane- Chimären. |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Ternäre / niedrig-bit-Matrixprodukte über Tabellensuche auf CPU/FPGA. | Latenz und FPGA-Leistung. | Beschleunigt lineare Algebra innerhalb eines Modellgetriebes; umgeht die Modelaufrufe nicht. |
| **LittleBit** (Lee et al., 2025) & **LittleBit-2** (Lee and Kim, 2026) | `arXiv:2506.13771` · `arXiv:2603.00042` | Unter-1-Bit (`0.1-0.58` Bits/Gewicht) binäre latente Faktorisierung via `SVD` / `ITQ` + `5`-Epochen-QAT. | Kompression (`11.6×-31×`), PPL und QAT-Genauigkeit. | Entpackt Bitpacks zu dichten Laufzeit-Binär-MACs und fällt bei exakter Kodierung auf `0.00%` (`Claim LA-11`); `Sub1Bit-LUT6` verwendet `0` Binär-MACs und `MoL` stellt `100.0%` Parität in `0` QAT-Epochen wieder her. |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Schwach-zu-stark LLM-Kaskaden und Präferenz-Router. | API-Dollar-Preis vs. Qualität. | Fehlt ein deterministisches $C(z)$-Gatter (`68.75%` fehlerhafte Commits in `Claim LA-11`) und besitzt keinen `LUT6`-Abwärtscompiler. |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Multi-LLM-Banditen-Routing und frequenzskalierte Bereitstellung. | GPU-Wh der Autoren (`Zeus` / `pyNVML`). | Optimiert GPU-Bereitstellung; diese Referenz kompiliert Wake-Signale zu `0`-FLOP `LUT6` und kanonischen Skill-Seiten (`reported_j` / `est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Neuronales MLP, Entwurfs-Baum- und Kaskaden-spekulative Entwerfer. | Wand-Uhr-Geschwindigkeitssteigerung. | Benötigen Entwurfs-FLOPs und Gewichtslesevorgänge gegenüber `0`-FLOP `uint64` `LUT6`-Seiten. |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Null-FLOP Prompt-n-Gram- und Datenspeicher-Suffix-Trie-Entwerfer. | Latenz-Geschwindigkeitssteigerung (`0` FLOPs). | `PLD` verpasst Off-Prompt-Token; `REST` verwendet variable Tries gegenüber `RAMB36E2`-Seiten. |
| **AirLLM** (lyogavin, 2023) | Open-source SSD streamer | Schicht-für-Schicht SSD-Gewichtestreaming in kleinem RAM. | Aktiver RAM-Fußabdruck. | Reines `T=1` (`1.0 tok/sweep`) + KV-Überschlag gegenüber `AirMoL` `2.74×-12.30×` I/O-Reduktion und `970 MB` Metal `INT4` RAM. |
| **Metered Commit Gates** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Commit-Gatter (`11,428 pJ` KV260 `INA260` SOM-Messung), MoL $p_i/c_i$, und `RCE-JEPA`. | KV260 SOM `measured_j` + `reported_j` / `est_j`. | Gleiche Haus-Grundlage; hier erweitert um Beneš `LUT6`-Abwärtskompilierung, Metal `Expert-AirMoL` und `mol-agent`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. Grenzwerte, Bedrohungen für die Validität, nicht behauptet, und Falsifizierer

**Interne und Konstruktvalidität.** Unter gleichverteiltem Zufallsrauschen oder schrittweisem adversariellem Churn ($\Delta T = 1$) liefert Proposition 1 null Einsparungen bei der Abwärtskompilierung und fällt auf `1.00 tok/sweep` zurück. Verlustfreie Parität (`100.0%`) garantiert bitgenaue Übereinstimmung mit der gierigen Zieldecodierung, ohne die Fähigkeitsobergrenze eines `350M`- oder `0.8B`-Basismodells anzuheben.

**Messgenauigkeit und nicht beansprucht.** Physikalische `DC`-Stromshunt-Joule-Messwerte (`measured_j` über `TI` `INA3221` `VDD_CPU_SOC_MSS` und `INA238` `VIN` auf `NVIDIA Jetson AGX Thor` ausschließlich in `Claims LA-24 und LA-28`, `board_metered = true`), Betriebssystem- und On-Chip-Zählerablesungen zuzüglich Bare-Metal-`MCU`-Zykluszählungen (`reported_j` aus `Linux RAPL`, `amdgpu` `PPT`, `NVML`, Apple Silicon `L2` `libIOReport` `'GPU Energy'` + `L3` `proc_pid_rusage` `ri_energy_nj` sowie Live-`DWT`-Zyklen auf dem angeschlossenen `Alif Ensemble E3`, `board_metered = false`), kumulative Deltas der macOS-Gesamtmaschinen-`PMU` sowie analytische Joule-, Schaltleistungs- und elektrothermische Kenngrößen (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`, die `Verilator`-`VCD`- + `AMD DS925`-`0.72 V`-`est_pJ/cycle`- und `est_mW`-Schranken in §4.22 und §4.25 sowie die `AMD DS181`- + `UG475`-`1.00 V`-`XC7A200T`-M.2-`est_mW`-/ `est_C`-Schranken in §4.32) werden strikt getrennt gehalten und niemals über Klassen hinweg summiert. Yosys `0.71+` und Verilator `5.054` begründen die strukturelle `xck26`- und `XC7A200T`-Netzlistensynthese (`41,465` `xcup`-LUTs auf `xck26` sowie `62,211` `xc7`-LUTs + `83` `RAMB36E1`s / `365`-Kristall-Tresor auf `XC7A200T`, `12`-`13` Einzelzyklus-Logikstufen, `0` `DSP48`s), `64/64` Boolesche `abc -lut 6`-`.lut6`-Miter-Äquivalenz, `10,500/10,500` Vektoräquivalenz zwischen `XC7A200T` und `KV260` über `12,023` Zyklen, `320/320` `CE`-Parität, blasenfreie `256/256`-Zyklussimulation mit `CPI = 1.00` sowie die `VCD`-Toggle-Rate-basierte dynamische Schalt-`est_mW`-Abschätzung (`15.59 est_mW` `xck26`-Leerlauf und `50.65 est_mW` `XC7A200T`-Gateware-Leerlauf; `862.6 est_mW` M.2 `3.3V` einschließlich gekoppelter statischer `DS181`-Leckleistung bei `55.2 est_C`), nicht jedoch den kommerziellen Vivado-Post-PAR-Timing-Abschluss bei `250 MHz` und nicht physikalische Schienenwattwerte auf KV260 oder Numato Aller A7 (`board_metered = false`, `measured_j = None` für sämtliche `xck26`- und `XC7A200T`-`FPGA`-Zeilen sowie cross-kompilierte `MCU`-`ELF`-Zeilen). Silizium-Energieführerschaft, die Hochstufung von `ModelGenerated`-Ausgaben zu `Deterministic` sowie die vollständige Container-Auswertung über alle `500` Aufgaben von `SWE-bench Verified` jenseits der `40` realen Upstream-Git-Arbeitsbaum-Auswertungen über `django/django`, `pytest-dev/pytest`, `psf/requests` und `sympy/sympy` (`Claims LA-15, LA-20`), des `48`-Aufgaben-Vertrags-Benchmarks (`Claims LA-11, LA-17`) und des `16`-Aufgaben-`SWE-Mini`-Benchmarks (`Claim LA-13`) werden nicht beansprucht (während reale `120B-A12B`-Ausführung in `Claim LA-21` direkt gemessen ist und lediglich die synthetische Cold-NVMe-`70B`-Zeile in `air_mol_nvme_baselines.csv` eine analytische Projektion bleibt).

| ID | Behauptung | Exakte Widerlegungs- / Falsifikationsbedingung |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` schlägt bei `100.0%` Verilator-Parität über `5,120` Pakete fehl oder verfehlt den VLAN-Shift bei Paket `2,500`. |
| **`LA-F2`** | `Claim LA-2` (Polyglot-Suite) | Zig allokiert `> 0` Heap-Bytes in der Hot-Loop, Go meldet `> 0 allocs/op`, oder Julia Enzyme überschreitet einen FD-Fehler von `1e-7`. |
| **`LA-F3`** | `Claim LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` überschreitet `117,120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s oder `1` Zyklus pro Seitenwechsel. |
| **`LA-F4`** | `Claim LA-4` (Konformes ACI) | `scripts/run_frontier_benchmarks.py` überschreitet das Ziel-Fehlrisiko $\alpha = 0.02$ bei verschobenem Verkehr oder vergibt den Stempel `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Byte-Spekulation) | `scripts/run_code_corpus_benchmark.py` liefert `< 100.0%` exakte Byte-Parität gegenüber dem Greedy-Decoding von `Mamba3CodeLM` bei `48` ungesehenen Prompts. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14,3M) | `scripts/run_air_mol_benchmark.py` scheitert unter `F_NOCACHE` an 100% Parität oder liest mehr NVMe-Bytes als `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Claim LA-7` (HF `AirMoL` 2026) | `scripts/run_hf_lfm3_air_mol.py`, `scripts/run_hf_air_mol_pretrained.py` oder `scripts/run_hf_qwen35_air_mol.py` weicht um $\ge 1$ BPE-Token vom Greedy-Ziel ab. |
| **`LA-F8`** | `Claim LA-8` (Regressionssuite) | `pytest -v` schlägt bei einem der `44` Tests in `tests/` fehl. |
| **`LA-F9`** | `Claim LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` weicht von `100%` Token-Parität ab oder liest mehr NVMe-Bytes als `AirLLM` oder `Expert-AirLLM`. |
| **`LA-F10`** | `Claim LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` überschreitet `1e-3` maximalen Fehler gegenüber dem dichten `ITQ`-Binär-Matmul oder verfehlt `100%` verifizierte Parität. |
| **`LA-F11`** | `Claim LA-11` (`48`-Aufgaben-Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` lässt `> 0%` fehlerhafte Commits zu oder akzeptiert einen veralteten Wave-1-Skill bei einer Wave-2-Spezifikationsmutation. |
| **`LA-F12`** | `Claim LA-12` (Metal-`INT4`-MoE) | `scripts/run_metal_moe_benchmark.py` überschreitet `1e-4` `FP32`-Shader-Fehler oder weicht bei `8.5B` oder `35B` von `100%` Greedy-Token-Parität ab. |
| **`LA-F13`** | `Claim LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` lässt `> 0%` fehlerhafte Patches zu, verändert `tests/` oder übersieht die Wave-2-Spezifikationsmutation `R03`. |
| **`LA-F14`** | `Claim LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` schlägt bei OpenAI REST/SSE, `MCP` `JSON-RPC 2.0` oder beim Neuladen von `.mol/` fehl oder vergibt den Stempel `measured_j`. |
| **`LA-F15`** | `Claim LA-15` (`BCB` + `SWE-bench`) | `scripts/run_external_public_benchmarks.py` schlägt bei der Parquet-`SHA`-256-Verifikation fehl, legt Gold-Lösungen/-Patches offen oder lässt `> 0%` fehlerhafte Ausgaben zu. |
| **`LA-F16`** | `Claim LA-16` (`250 MHz` `xck26`-RTL) | `scripts/verify_pipelined_250mhz_rtl.py` überschreitet `20` Einzelzyklus-Logikstufen, überschreitet `189` `IOB`s auf `P4-AXIS`, nutzt `> 0` `DSP48`s oder verfehlt `256/256` `CPI = 1.00` Verilator-Parität. |
| **`LA-F17`** | `Claim LA-17` (`Rung 3d` `<think>`) | `scripts/run_rung3d_thinking_ceiling.py` lässt `> 0%` fehlerhafte Commits zu, ruft Cloud-APIs auf oder verfehlt eine Anhebung der verifizierten Bestehensrate über `87.50%`. |
| **`LA-F18`** | `Claim LA-18` (Rust-`CubeCL`-MoE) | `cargo run --release --bin bench_cubecl_moe_deltanet` überschreitet `1e-4` `FP32`-Fehler auf `LLVM`-`CPU` oder `Metal`-`GPU` oder erreicht `< 25×` Metal-Beschleunigung. |
| **`LA-F19`** | `Claim LA-19` (`6`-Kernel-`Lean 4.36.0`-Beweise) | `scripts/verify_lean_proofs.py` oder `lake check --paranoid` schlägt bei einem der `6` unabhängigen Kernels (`con-leche`, `con-ron`, `lean4lean`, `nanoda`, `leanchecker`, `lean`) fehl, enthält `>= 1` `sorry` / `opaque` / `ofReduceBool` oder fügt `>= 1` benutzerdefiniertes Axiom hinzu. |
| **`LA-F20`** | `Claim LA-20` (`4`-Repo-`SWE-bench`) | `scripts/run_multirepo_swebench_benchmark.py` legt `patch` offen, wertet `< 4` Repositories aus, lässt `> 0%` fehlerhafte Patches zu oder übertrifft eigenständige `24B`/`35B` nicht. |
| **`LA-F21`** | `Claim LA-21` (`120B`-Hybrid-MoE) | `scripts/run_120b_hybrid_moe_benchmark.py` schlägt bei der lokalen `120B-A12B`-Ausführung fehl, lässt `> 0%` fehlerhafte Commits zu oder verzeichnet `0%` `.mol/`-Schnellpfad-Treffer in Welle 2. |
| **`LA-F22`** | `Claim LA-22` (`CE`-gesteuerte `VCD`-Leistung) | `scripts/verify_ce_gated_vcd_power.py` verfehlt `320/320` `CE`-Parität, überschreitet `189` `IOB`s oder erreicht `< 3.5×` dynamische Leistungsreduktion im Leerlauf. |
| **`LA-F23`** | `Claim LA-23` (Rust `mol-agent-rs`) | `cargo run --release --bin mol_agent -- --self-test-bench` benötigt Python für `/v1` oder `/mcp`, schlägt bei `--mcp-stdio` fehl oder erreicht `< 10×` Beschleunigung gegenüber Python-`MCP`. |
| **`LA-F24`** | `Claim LA-24` (`6`-Host-Flotte & `Thor`-Shunt `measured_j`) | `scripts/aggregate_fleet_measured_j.py` vermischt `measured_j` mit `reported_j`, verzeichnet `>= 1%` `VIN`-Drift auf `Jetson AGX Thor` oder verfehlt `4/4` `ABBA`-Einsparungen bei `W2`, `W3` oder `W5`. |
| **`LA-F25`** | `Claim LA-25` (`4`-Hersteller-`GPU`-`CubeCL`-Parität) | `scripts/aggregate_multivendor_cubecl_gpu.py` überschreitet `1e-4` `FP32`-Fehler oder erreicht `< 10×` `GPU`-Beschleunigung gegenüber der skalaren Host-Referenz auf Apple-, `AMD`-, `NVIDIA`- oder Intel-`GPU`s. |
| **`LA-F26`** | `Claim LA-26` (`#![no_std]` `lut6-core`, `MCU`-`ELFs` & Yosys-Miter) | `cargo test --release` in `sys/lut6-core` schlägt fehl, `CompactLut6Page` weicht von `4,096 B` ab, Cortex-`M55`- / `M0`+- / `nRF52832`-`M4F`-(`64 KB` `SRAM`)- / `RV32IMAC`-`ELFs` verweigern das Linken oder emittieren `>= 1` Float-Instruktion, oder `scripts/pack_lut6_crystal.py` verfehlt `64/64` Yosys-`abc -lut 6`-Miter-Prüfungen. |
| **`LA-F27`** | `Claim LA-27` (`DiffLUT-Net`, Wobble-`FWHT` & Bedürftigkeitsprüfung) | `scripts/run_dual_reality_lut6_eval.py` erreicht `< 55%` aktives `LUT6`-Pruning ggü. ungekürztem `DWN`, `< 85%` Unterdrückung verrauschter Wakes, `> 0%` stille Korruption, `< 100%` `OOD`-Enthaltung oder `> 0` `FWHT`-Rauschen vom Grad `>=5` auf einem Wobble-Codon. |
| **`LA-F28`** | `Claim LA-28` (`Thor`-Shunt `measured_j` & Live-`Alif E3`-`DWT`) | `scripts/aggregate_phase30_lut6_hardware.py` vergibt `board_metered = true` außerhalb von `Thor`, verzeichnet `< 10×` Bit-Sliced-Gewinn am `Thor`-Shunt oder überschreitet `10 µs` skalare Latenz auf dem `OpenMV-AE3` Cortex-`M55`. |
| **`LA-F29`** | `Claim LA-29` (Geschleifte & hybride Modelle Okt.-Nov. 2026) | `scripts/run_nov2026_models_lut6_benchmark.py` weicht um `>= 1` gieriges Token ab (`< 100.0%` Parität) oder überschreitet `64` Bits je 3-Token-Burst auf `Inkling-2-Mini`, `Dory1.0-4B`, `LFM2.5-24B-A2B` oder `Nemotron-3.5-Bolt-E4B`. |
| **`LA-F30`** | `Claim LA-30` (`XC7A200T` M.2 `2280`-Port & elektrothermisches `est_j`) | `aller-a7-xc7a200t` überschreitet `134,600` `xc7`-LUTs oder `365` `RAMB36E1`s, nutzt `> 0` `DSP48E1`s, verzeichnet `>= 1` Bitabweichung ggü. `XCK26` über `10,500` Vektoren (`12,023` Zyklen), vergibt `board_metered = true` ohne seriellen `+3.3V`/`5V`-Shunt oder überschreitet am Prüfstand `1,000 mA` M.2 `3.3V`, `1,600 mA` kombinierte Tachyon-`5V` oder `85.0 °C` `XADC`-$T_J$ unter passiver Kühlung bei $T_A \le 45\,^\circ\text{C}$ (`DDR3` aus). |

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
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., and Narasimhan, K. (2024). SWE-bench: Can Language Models Resolve Real-World GitHub Issues? <em>ICLR 2024</em>, <em>arXiv:2310.06770</em>.</li>
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
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2024). BigCodeBench: Benchmarking Code Generation with Diverse Function Calls and Complex Instructions. <em>ICLR 2025</em>, <em>arXiv:2406.15877</em>.</li>
<li>Moura, L. de, and Ullrich, S. (2021). The Lean 4 Theorem Prover and Programming Language. <em>CADE 28</em>, <em>LNCS</em> 12699:625-635.</li>
<li>NVIDIA (2026). <code>nvidia/Nemotron-3-Super-120B-A12B</code> Hybrid Mamba-Attention Sparse-MoE Open-Weights Model Card. <a href="https://huggingface.co/nvidia/Nemotron-3-Super-120B-A12B-BF16">huggingface.co/nvidia/Nemotron-3-Super-120B-A12B-BF16</a>.</li>
<li>Mistral AI (2025). <code>mistralai/Devstral-Small-2-24B-Instruct-2512</code> Open-Weights Software Engineering Model Card. <a href="https://huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512">huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512</a>.</li>
<li>Ye, J., Gong, X., Wang, J., Kondrateva, O., Li, B., and Zhang, G. L. (2026). DiffLUT-Net: Differentiable Training of FPGA LUT Networks with Learnable Connectivity. <em>arXiv:2609.09254</em>.</li>
<li>Andronic, M., and Constantinides, G. A. (2025). NeuraLUT-Assemble: Hardware-Aware Assembling of Sub-Neural Networks for Efficient LUT Inference. <em>IEEE FCCM 2025</em>, <em>arXiv:2504.00592</em>.</li>
<li>Tian, R., Chen, Y., Xu, W., and Rosing, T. Š. (2026). PALUTE: Processing-In-Memory Acceleration via Lookup Table for Edge LLM Inference. <em>arXiv:2606.08891</em>.</li>
<li>Sanyal, A., Chinchali, S. P., and Datta, G. (2026). EntroMCU: A Hardware-Algorithm Vision for LLM Inference on Microcontrollers. <em>IEEE ISVLSI 2026</em>.</li>
<li>Linial, N., Mansour, Y., and Nisan, N. (1993). Constant Depth Circuits, Fourier Transform, and Learnability. <em>Journal of the ACM</em>, 40(3):607-620.</li>
<li>Thinking Machines Lab (2026). <code>thinkingmachines/Inkling-2-Mini</code> Open-Weights Looped Multimodal MoE Model Card (November 20, 2026). <a href="https://huggingface.co/thinkingmachines/Inkling-2-Mini">huggingface.co/thinkingmachines/Inkling-2-Mini</a>.</li>
<li>NVIDIA Nemotron Labs (2026). <code>nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16</code> Looped nGPT Model Card (October 20, 2026). <a href="https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16">huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16</a>.</li>
<li>Advanced Micro Devices (2023). <em>Artix-7 FPGAs Data Sheet: DC and AC Switching Characteristics (DS181, v1.28)</em> and <em>7 Series FPGAs Packaging and Pinout Product Specification (UG475, v1.19)</em>. AMD Technical Documentation.</li>
</ol>

---

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## Anhang A. Reproduzierbarkeit

Aus Checkouts von [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit 75533d5`) und [openIE-dev/openie-research-experiments](https://github.com/openIE-dev/openie-research-experiments) (`aller-a7-xc7a200t/` und `lut6-core-nucleus/`):

```bash
PYTHONPATH=src .venv/bin/pytest -v
(cd sys/lut6-core && cargo test --release && cargo run --release --bin bench_lut6_nucleus_shunt)
PYTHONPATH=src .venv/bin/python scripts/pack_lut6_crystal.py
PYTHONPATH=src .venv/bin/python scripts/run_dual_reality_lut6_eval.py
PYTHONPATH=src .venv/bin/python scripts/run_nov2026_models_lut6_benchmark.py
(cd ../openie-research-experiments/aller-a7-xc7a200t && python3 scripts/run_aller_a7_verification.py)
(cd ../openie-research-experiments/lut6-core-nucleus && python3 packer/audit_mcu_elfs.py)
(cd proofs && lake build) && PYTHONPATH=src .venv/bin/python scripts/verify_lean_proofs.py
PYTHONPATH=src .venv/bin/python scripts/run_multirepo_swebench_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_120b_hybrid_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/verify_ce_gated_vcd_power.py
(cd sys/rust && cargo run --release --bin mol_agent -- --self-test-bench)
PYTHONPATH=src .venv/bin/python scripts/run_external_public_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_pipelined_250mhz_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_rung3d_thinking_ceiling.py
(cd sys/rust && cargo test --release && cargo run --release --bin bench_cubecl_moe_deltanet)
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
PYTHONPATH=src .venv/bin/python scripts/run_metal_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
PYTHONPATH=src .venv/bin/python scripts/run_repo_patch_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/mol_agent_server.py --host 127.0.0.1 --port 8090 --mol-dir .mol
```
