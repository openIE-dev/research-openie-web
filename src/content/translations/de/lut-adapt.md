---
title: "Abwärtskompilierung auf LUT6 in einer Kaskade nach Mixture of Limits: Beneš-geroutete Boolesche Verbindungsnetze, konforme Aufwecktore und schichtweises 4-Bit-NVMe-Streaming"
deck: "Eine viersprossige Kaskade nach Mixture of Limits (Mischung der Grenzen), die zuerst gepagte Schaltungen aus Nachschlagetabellen mit 6 Eingängen (LUT6) ohne Gleitkommaoperationen (FLOP) erprobt, Mamba-3 sowie per 4-Bit Non-Volatile Memory Express (NVMe) gestreamte hybride Modelle des Jahres 2026 nur bei Fehlschlägen aufweckt und zertifizierte Aufweckvorgänge abwärts in Beneš-geroutete 36-Kbit-Block-RAM-Seiten (RAMB36E2) kompiliert. Wanduhrzeiten, ungepufferte Darwin-F_NOCACHE-Bytezahlen (ungepuffertes Dateilesen), aktiver Arbeitsspeicher (RAM) sowie Yosys/Verilator-Simulationen auf Register-Transfer-Ebene (RTL) für xck26 werden aus openIE-dev/lut-adapt-ai bei Commit 9dbf745 berichtet. Energieangaben sind analytische est_j-Schätzungen; eine Platinenleistung wurde nicht gemessen."
lang: "de"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-4-bit-nvme-layer-streaming" class="anchor-alias" aria-hidden="true"></div>

*Revision 11dbc8c, 22. November 2026. Referenzimplementierung und Artefakte: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) bei [`9dbf745f6ea7aecba26a70482138e0f2d8bbe9c0`](https://github.com/openIE-dev/lut-adapt-ai/tree/9dbf745f6ea7aecba26a70482138e0f2d8bbe9c0). Datenzusammenfassung: [/data/#lut-adapt](/data/#lut-adapt). LaTeX-PDF: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([Quelltext](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Überblick

Diese Studie untersucht, wie ein Rechensystem wiederkehrende Arbeit neuronaler Modelle abwärts in schnelle Abfragen Boolescher Nachschlagetabellen kompilieren kann, ohne die exakte Ausgabeparität zu verlieren oder ungeprüfte Vermutungen zu vertrauenswürdigen Regeln aufzuwerten. Berichtet werden Softwaremessungen, Synthesen auf Register-Transfer-Ebene und taktsynchrone Simulationen sowie ausdrücklich gekennzeichnete analytische Energieschätzungen (`est_j`). In diesem Repository war kein Wand- oder Stromschienen-Joulemessgerät angeschlossen (`measured_j` ist ungesetzt; `board_metered` ist `false`).

**In einfachen Worten**

1. Die meisten Eingaben, denen ein eingesetztes System begegnet, wiederholen Muster, die es bereits gelöst hat; daher verschwendet das Ausführen eines vollständigen neuronalen Gleitkommanetzes in jedem Schritt Rechenleistung und Speicherbandbreite.
2. Die Referenzimplementierung schaltet eine rekonfigurierbare Sprosse aus Wahrheitstabellen mit 6 Eingängen (`LUT6`) vor streamende Zustandsraum- und Basismodelle und kompiliert Antworten erst dann abwärts in Nachschlagespeicherseiten, nachdem eine explizite Prüfung sie zertifiziert hat.
3. Wenn ein hybrides Sprachmodell des Jahres 2026 seine Gewichte schichtweise von einem Solid-State-Laufwerk streamt, schlägt dieser `LUT6`-Entwurfsgenerator mit null FLOP Mehr-Token-Salven vor, die das Zielmodell in einem einzigen Laufwerksdurchlauf verifiziert; dadurch sinken die Laufwerkslesevorgänge um nahezu den Faktor `3×`, ohne dass sich die ausgegebenen Tokens ändern.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Begriffe, Akronyme und Messkennzeichnungen

<ul id="terms">
<li>MoL: Mixture of Limits (Mischung der Grenzen), die Kaskadenregel aus Gemessene Commit-Tore, Teil II [same house]</li>
<li>LA: Präfix für Behauptungen und Falsifikatoren (LA-1 bis LA-8, LA-F1 bis LA-F8) in dieser Studie</li>
<li>LUT, LUT6, INIT: Nachschlagetabelle (look-up table), Boolesches Xilinx-UltraScale+-Primitiv mit 6 Eingängen und dessen 64-Bit-Initialisierungsmaske für Wahrheitstabellen</li>
<li>BRAM, RAMB36E2, URAM: Block-RAM, das 36-Kbit-Dual-Port-Block-RAM-Primitiv von UltraScale+ (144 auf xck26) und UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: konfigurierbarer Logikblock, Flip-Flop, digitale Signalverarbeitungs-Slice und AMD-Kria-KV260-Platine (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: Field-Programmable Gate Array, anwendungsspezifische integrierte Schaltung, Register-Transfer-Ebene, Takte pro Abfrage (cycles per lookup), Platzierung und Verdrahtung (place-and-route), ungünstigster negativer Zeitpuffer (worst negative slack) und Konferenz Field-Programmable Logic</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML: Advanced eXtensible Interface, Zynq-Prozessorsystem, programmierbare Logik, System-on-Module, integrierter Leistungsüberwachungsbaustein auf der Platine, Versorgungsschiene, Intel Running Average Power Limit und NVIDIA Management Library</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: Zustandsraum-Dualität (State Space Duality), Zustandsraummodell, Multiple-Input Multiple-Output, rotatorische Positionseinbettung, Aktivierung mit torgesteuerter linearer Einheit, gruppierte Abfrage-Attention, Schlüssel-Wert-Cache, Byte-Pair-Encoding, große(s) Sprachmodell(e), Expertenmischung (Mixture-of-Experts), mehrschichtiges Perzeptron und kontextfreie Grammatik</li>
<li>HC, SOINN, WNN, DWN: selbstorganisierendes inkrementelles neuronales Netz mit Hierarchiekontext (hierarchy-context Self-Organizing Incremental Neural Network), gewichtsloses neuronales Netz und differenzierbares gewichtsloses neuronales Netz (Differentiable Weightless Neural Network)</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: prädiktive Architektur mit gemeinsamer Einbettung (Joint-Embedding Predictive Architecture), energiebasiertes Schlussfolgerungsmodell (Energy-Based Reasoning Model), adaptive konforme Inferenz (Adaptive Conformal Inference), außerhalb der Verteilung (out-of-distribution), Fläche unter der Receiver-Operating-Characteristic-Kurve, maximale Softmax-Wahrscheinlichkeit und Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, HF: Prompt Lookup Decoding, abrufgestütztes spekulatives Dekodieren (Retrieval-Based Speculative Decoding), Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LiquidAI/LFM2.5-350M) und HuggingFace</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB: Non-Volatile-Memory-Express-Speicher, ungepuffertes Dateiflag Darwin F_NOCACHE, Portable Operating System Interface, Arbeitsspeicher, dynamisches RAM, statisches RAM, Ein-/Ausgabe, Kilobyte, Megabyte und Gigabyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, SIMD, AD, FD, BPB, FP16, FP32, INT4: Gleitkommaoperation(en), Million(en) FLOPs, Multiplizieren-Akkumulieren, Single-Instruction Multiple-Data, automatisches Differenzieren, endliche Differenzen, Bits pro Byte, 16-/32-Bit-Gleitkomma und 4-Bit-Ganzzahl</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house], Wise Computer Automation [same house], verifizierte Fertigstellung (verified completion) und Präfix für Software-Engineering-Benchmarks</li>
<li>CLI, HTTP, SSE, API, ACL, OS, CPU, GPU, SW: Befehlszeilenschnittstelle, Hypertext Transfer Protocol, Server-Sent Events, Anwendungsprogrammierschnittstelle, Association for Computational Linguistics, Betriebssystem, Haupt- bzw. Grafikprozessor und Software</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CAM, XNOR: virtuelles lokales Netz (IEEE 802.1Q), Transport Layer Security, tiefe Paketinspektion, abstrakter Syntaxbaum, JavaScript Object Notation, kommagetrennte Werte, Secure Hash Algorithm, inhaltsadressierbarer Speicher und Exklusiv-NICHT-ODER</li>
</ul>

Drei Evidenzklassen bleiben über jede nachfolgende Tabelle hinweg strikt getrennt:

| Evidenzkennzeichnung | Bedeutung in dieser Studie |
| :--- | :--- |
| **`Measured (SW / NVMe I/O)`** | Exakte gelesene oder geschriebene Bytezahlen über `os.pread` unter Darwin `F_NOCACHE`, residente Speicherbelegungen, Wanduhrsekunden auf Apple M5 Max sowie exakte Bit- bzw. Token-Übereinstimmung. `measured_j` ist ungesetzt (`None`). |
| **`Simulated (RTL)`** | Strukturelle Netzlistenzählungen aus Yosys `0.71+` (`synth_xilinx -family xcup` für Kria KV260 `xck26`) und Taktzahlen (`CPI = 1`) aus Verilator `5.054`. Weder Vivado-Timing-Abschluss noch auf der Platine gemessene Leistung (`board_metered = false`). |
| **`Estimated (est_j)`** | Analytische Joule aus Operationszählungen oder Zeit-Ersatzgrößen der thermischen Verlustleistung (`joule_meter.py`-Rückfallmodus, wenn unter macOS keine `RAPL`/`NVML`-Hardwarezähler vorliegen). Nur zwischen Varianten innerhalb derselben Formel vergleichbar; niemals Silizium-Watt. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Architektonischer Hintergrund und Beiträge

In [Gemessene Commit-Tore](/papers/gates/) `[same house]` definiert Teil II **Mixture of Limits (Mischung der Grenzen)**: Gänge in absteigender Reihenfolge der Bestehenswahrscheinlichkeit pro Joule $p_i / c_i$ (Simon und Kadane, 1975) erproben, anhalten, sobald das Aufgabenabschlussprädikat $C(z) = 1$ erfüllt ist, und jede Aufwertung einer `ModelGenerated`-Ausgabe zu `Deterministic` untersagen. Eine statische Nachschlagesprosse deckt jedoch nur jene Einträge ab, die vor der Inbetriebnahme hineingeschrieben wurden. Umgekehrt verankern bestehende neuronale Netze auf Basis von Nachschlagetabellen, nämlich LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022) und Differentiable Weightless Neural Networks (Bacellar et al., 2024), die Leitungsverbindungen fest in statischem FPGA-Routing, sodass jede Verschiebung der Eingabeverteilung einen neuen herstellerseitigen Platzierungs- und Verdrahtungslauf erfordert.

Die Referenz `lut-adapt-ai` schließt den Regelkreis zwischen dem oberen und dem unteren Ende der Kaskade durch **laufende Abwärtskompilierung auf `LUT6`**:

- **Sprosse 0 (Nachschlagen - Gepagtes Beneš + `LUT6`)**: Wertet 64-Bit-Wahrheitstabellenmasken aus, die über ein blockierungsfreies $512 \times 512$ **Beneš-Copy-Beneš**-Multicast-Koppelfeld geroutet und über $81 \times \texttt{RAMB36E2}$-Dual-Port-Blockspeicher gecacht werden (`0` Gleitkommaoperationen, Seitenwechsel in einem Takt in der Verilator-Simulation).
- **Sprosse 1 (Strom - Komplexe MIMO-Zustandsraum-Dualität `Mamba-3`)**: Verarbeitet Nachschlage-Fehlzugriffe, die von der Sequenzhistorie abhängen, mithilfe eines rekurrenten Zustands konstanter Größe $O(1)$ (`48 KB` gepinnter Speicher in der `14.3M`-Parameter-Referenz) und vermeidet so ein $O(L)$-Wachstum des Schlüssel-Wert-Caches.
- **Sprosse 2 (Topologie - `HC-SOINN`)**: Pflegt im laufenden Betrieb eine Prototypentopologie über latenten Einbettungen, isoliert Regimegrenzen und löst bei eintreffender ungelabelter Verteilungsverschiebung einen Schutzschalter (`Refuse` / Eskalation) aus.
- **Sprosse 3 (Modell zuletzt - `JEPA-EBRM` und 4-Bit-NVMe-Streaming `AirMoL`)**: Ruft die latente energiebasierte Verifikation oder schichtweise gestreamte vortrainierte Basismodelle des Jahres 2026 (`LiquidAI/LFM2.5-350M` und `Qwen/Qwen3.5-0.8B-Base`) nur dann auf, wenn günstigere Sprossen sich enthalten oder eine exakte Verifikation durch das Zielmodell verlangen.
- **Abwärtsgerichteter `SleepCrystallizer`**: Extrahiert wiederkehrende Aufweckspuren mittels spektraler Walsh-Hadamard-Warmstarts, Verbundmodus-Minterm-Wahrheitstabellen und Waksman-Schaltplänen und schaltet Schatten-Blockspeicherbänke um, ohne die Inferenz anzuhalten oder ein FPGA-Place-and-Route auszuführen.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Beiträge

1. **Bedingung für amortisierte Abwärtskompilierung**: Erweitert die Simon-Kadane-Reihenfolge $p_i/c_i$ um explizite Kompilierungskosten $E_{\text{compile}}$ über einem stationären Horizont $\Delta T$.
2. **Blockierungsfreie $512 \times 512$-Beneš-Copy-Beneš- und `81`-`RAMB36E2`-RTL-Architektur**: Beseitigt sowohl den Logiküberlauf von `102.0%` flacher Koppelfelder (`119,478` LUTs) auf der Kria KV260 als auch die Explosion von Flip-Flop-Seitenmultiplexern auf `926,619` LUTs; synthetisiert auf `41,186` UltraScale+-CLB-LUTs (`35.2%` des `xck26`), `81` `RAMB36E2`-Blöcke (`56.2%`) und `0` `DSP48`-Slices mit Seitenwechsel in `1` Takt (`4.0 ns` bei nominal `250 MHz`) in der Simulation.
3. **Universelle $\le 64$-Bit-Verbundmodus-Minterm-Synthese**: Zeigt, dass das Nachschlagen von Mintermen im Verbundmodus die marginale Bitebenen-Rundung von DiffLogic auf korrelierten Zweigen dominiert und $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ Teilwort-Tokens in ein einziges `uint64`-Wort packt (`16b × 4 = 64b` für `|V| = 65,536`; `18b × 3 = 54b` für `|V| = 248,320`).
4. **Orakelfreies Split-Conformal- + Online-ACI-Kristallisationstor**: Koppelt einen radial regularisierten latenten `JEPA-EBRM`-Nichtkonformitätswert mit Split-Conformal-Kalibrierung und adaptiver konformer Inferenz (Gibbs und Candès, 2021) und erzielt `0.00%` Risiko falscher Kristallisation sowie `1.0000` OOD-AUROC auf verschobenem Datenverkehr, während Softmax- und MC-Dropout-Vergleichsverfahren `17.62%-24.28%` Fehlrisiko verzeichnen.
5. **`AirMoL` 4-Bit-NVMe-Streaming ohne Zusatzdurchläufe auf hybriden Modellen von 2026**: Kombiniert 4-Bit-gruppenquantisiertes Schicht-Streaming per `os.pread` unter Darwin `F_NOCACHE` mit hybrider Zustandsrücksetzung im RAM und laufender Token-`LUT6`-Salvenspekulation auf `LiquidAI/LFM2.5-350M` (März 2026) und `Qwen/Qwen3.5-0.8B-Base` (Februar 2026), senkt die NVMe-Laufwerkslesevorgänge um `2.86×` bzw. `2.74×` bei `100.0%` exakter Token-Parität und hält den aktiven Gewichts-RAM bei `8.45%-9.47%` der FP32-Modellgröße.
6. **Polyglotte Systemsuite und Live-HTTP/SSE-Server**: Prüft die Kaskade kreuzweise über Python/PyTorch/Triton, Rust `Burn 0.22.1 / CubeCL` Metal, Zig `0.17.1`, Go `1.27.4` SIMD, Julia `1.13.4` Enzyme und `mol_code_cli.py`.

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

## 3. Referenzarchitektur, polyglotte Suite und KV260-RTL

Abbildung 1 zeigt die viersprossige Kaskade und die abwärtsgerichtete `SleepCrystallizer`-Schleife in `src/clai/`.

![Abbildung 1. Abwärtskompilierung über eine viersprossige Kaskade nach Mixture of Limits.](/figures/lut-adapt/mol-downward-cascade.svg)

*Abbildung 1. Abwärtskompilierung über eine viersprossige Kaskade nach Mixture of Limits. Entwurfsdiagramm, keine Leistungsmessung auf der Platine. [PNG](/figures/lut-adapt/mol-downward-cascade.png) · [Interaktiver Explorer](/living/lut-adapt/#la-diag-01).*

Fünf Systemimplementierungen in `openIE-dev/lut-adapt-ai` prüfen die Kaskade kreuzweise: Python/PyTorch/Triton (`src/clai/`), Rust `Burn 0.22.1 / CubeCL` Metal (`sys/rust/`), Zig `0.17.1` (`sys/zig/`), Go `1.27.4` SIMD (`sys/go/`) und Julia `1.13.4` Enzyme (`sys/julia/`).

Abbildung 2 veranschaulicht den RTL-Datenpfad für die Kria KV260 (`xck26`) in `hw/kv260/rtl/clai_benes_hotswap_core.sv`, der `512` residente `LUT6`-Seiten (`5,120` `INIT`-Bits + `48`-Bit-Kontextkennung + Gültigkeitsbit) auf `81` parallele `RAMB36E2`-Dual-Port-Speicher abbildet und so einen Kontextwechsel in einem einzigen Takt (`4.0 ns` bei nominal `250 MHz`, `CPI = 1.0`) ermöglicht.

![Abbildung 2. Beneš-Copy-Beneš-Multicast-Verbindungsnetz und eintaktiger BRAM-LUT6-Seitencache.](/figures/lut-adapt/benes-paged-silicon.svg)

*Abbildung 2. `512×512`-Beneš-Copy-Beneš-Multicast-Verbindungsnetz und eintaktiger `LUT6`-Seitencache auf `81 × RAMB36E2` für AMD Kria KV260 (`xck26`) in der Yosys-`0.71+`- und Verilator-`5.054`-Simulation (`board_metered = false`). [PNG](/figures/lut-adapt/benes-paged-silicon.png) · [Interaktiver Explorer](/living/lut-adapt/#la-diag-02).*

Abbildung 3 zeigt `AirMoL` (`src/clai/frontier/air_mol_streamer.py` und `hf_air_mol_pretrained.py`), das 4-Bit-gruppenquantisierte Shards über `os.pread` unter Darwin `F_NOCACHE` streamt, `[last_tok, d_1..d_K]` in einem einzigen Durchlauf verifiziert und kompakte hybride Zustände (`Short-Conv/SSM` oder `Gated DeltaNet` + dünn besetzter `6`-Schicht-`GQA`-KV-Ausschnitt) im RAM sichert, sodass teilweise verworfene Entwürfe **null zusätzliche NVMe-Durchläufe** erfordern.

![Abbildung 3. Schichtweises 4-Bit-NVMe-Streaming unter AirMoL mit universeller 64-Bit-Token-LUT6-Spekulation.](/figures/lut-adapt/airmol-nvme-speculation.svg)

*Abbildung 3. Schichtweises 4-Bit-NVMe-Streaming ohne Zusatzdurchläufe mit `AirMoL` und universeller `≤64`-Bit-Token-`LUT6`-Spekulation auf `LiquidAI/LFM2.5-350M` und `Qwen/Qwen3.5-0.8B-Base`. [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [Interaktiver Explorer](/living/lut-adapt/#la-run-01).*

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

<div id="47-claim-la-7-pretrained-2026-hybrid-models-under-airmol-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 Behauptung LA-7: Vortrainierte hybride Modelle des Jahres 2026 unter `AirMoL` (`LFM2.5-350M` & `Qwen3.5-0.8B-Base`)

| 2026-Checkpoint & Variante | Parität | Tok / Durchlauf | Zeichen / Durchlauf | Durchläufe | NVMe-Lesen | Aktiver Spitzen-RAM (`% FP32`) | `tok/s` | Evidenzklasse |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Gemessen (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Gemessen (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Gemessen (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` kaltes `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Gemessen (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` nach Aufwecken** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Gemessen (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Gemessen (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Gemessen (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` kaltes `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Gemessen (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` nach Aufwecken** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Gemessen (`F_NOCACHE`)** |

Man beachte den bewusst ausgewiesenen Zielkonflikt bei kalten, ungesehenen Prompts auf `Qwen3.5-0.8B-Base`: `AirMoL` senkt die NVMe-Laufwerkslesevorgänge von `12.674 GB` auf `8.581 GB`, doch die CPU-Stapelverifikation von `4` Tokens im Gated DeltaNet verringert den Wanduhrdurchsatz (`0.32` gegenüber `0.53 tok/s`), bis die laufende Kristallisation von Aufweckvorgängen in `LUT6` die Annahmerate auf `2.74 tok/sweep` anhebt (`4.621 GB` gelesen, `1.11 tok/s`).

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 Behauptung LA-8: Live-CLI und HTTP/SSE-Streaming-Server (`mol_code_cli.py`)

`scripts/mol_code_cli.py` stellt `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b}` und `--air-nvme` über CLI- und SSE-Endpunkte (`/v1/health`, `/v1/complete`, `/v1/crystallize`) bereit und erhöht im laufenden Betrieb die `RAMB36E2`-Steckplatzbelegung von `438/512` auf `460/512` bei `18/18` bestandenen `pytest`-Testsuiten.

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Verwandte Arbeiten und Konvergenzbeobachtungen

| System | Kennung / Tagung | Was es belegt | Berichtete Kostengröße | Unterschied in dieser Referenz |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Dünn besetzte quantisierte neuronale Schichten, kompiliert in FPGA-LUTs. | FPGA-LUT- und Fmax-Synthese. | Statische Leitungen erfordern bei Drift ein Vivado-Neu-PAR gegenüber `1`-Takt-Beneš + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Differenzierbare Boolesche Gatter- und gewichtslose LUT-Netze. | Gatterzahlen und Genauigkeit. | Statisches Routing fällt bei VLAN-Wechsel auf `52.34%` und leidet unter marginalen Bitebenen-Chimären. |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Ternäre / niedrigbittige Matrixprodukte per Tabellenabfrage auf CPU/FPGA. | Latenz und FPGA-Leistung. | Beschleunigt lineare Algebra innerhalb eines Modellgangs; umgeht keinen Modellaufruf. |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Schwach-zu-stark-LLM-Kaskaden und Präferenz-Router. | API-Dollarpreis gegen Qualität. | Ausschließlich Modell-zu-Modell-Routing; weder `LUT6`-Nachschlageboden noch Abwärtskompilierung. |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Multi-LLM-Banditen-Routing und frequenzskaliertes Serving. | GPU-Wh der Autoren (`Zeus` / `pyNVML`). | Optimiert GPU-Serving; diese Referenz kompiliert Aufweckvorgänge in `0`-FLOP-`LUT6`-Seiten (`est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Neuronale spekulative MLP-, Entwurfsbaum- und Kaskaden-Entwurfsgeneratoren. | Wanduhr-Beschleunigung. | Benötigen Entwurfs-FLOPs und Gewichtslesevorgänge gegenüber `0`-FLOP-`uint64`-`LUT6`-Seiten. |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Null-FLOP-Entwurfsgeneratoren über Prompt-n-Gramme und Datenspeicher-Suffix-Tries. | Latenzbeschleunigung (`0` FLOPs). | `PLD` verfehlt promptfremde Tokens; `REST` nutzt variable Tries statt `RAMB36E2`-Seiten. |
| **AirLLM** (lyogavin, 2023) | Quelloffener SSD-Streamer | Schichtweises SSD-Gewichtsstreaming in kleinem RAM. | Aktiver RAM-Bedarf. | Reines `T=1` (`1.0 tok/sweep`) + KV-Auslagerung gegenüber `2.74×-2.86×` weniger Durchläufen unter `AirMoL`. |
| **Gemessene Commit-Tore** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Commit-Tore (`11,428 pJ` KV260-`INA260`-SOM-Messwert), MoL $p_i/c_i$ und `RCE-JEPA`. | KV260-SOM `measured_j` + `est_j`. | Hausinterne Grundlage; hier erweitert um Beneš-`LUT6`-Abwärtskompilierung und `AirMoL`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. Grenzen, Gefährdungen der Validität, nicht Beanspruchtes und Falsifikatoren

**Interne Validität und Konstruktvalidität.** Unter gleichverteiltem Zufallsrauschen oder gegnerischem Wechsel in jedem Schritt ($\Delta T = 1$) ergibt Proposition 1 null Einsparung durch Abwärtskompilierung, und das System fällt auf `1.00 tok/sweep` zurück. Verlustfreie Parität (`100.0%`) garantiert bitgenaue Übereinstimmung mit der gierigen Dekodierung des Zielmodells, ohne die Fähigkeitsobergrenze eines Basis-Checkpoints mit `350M` oder `0.8B` Parametern anzuheben.

**Messvalidität und nicht Beanspruchtes.** Jede Joule-Angabe in dieser Studie ist eine analytische `est_j`-Schätzung (`measured_j = None`). Yosys `0.71+` und Verilator `5.054` belegen die strukturelle `xck26`-Netzlistensynthese und die taktsynchrone Simulation mit `CPI = 1`, jedoch weder einen Vivado-Timing-Abschluss nach Place-and-Route bei `250 MHz` noch physische Stromschienen-Wattwerte der KV260 (`board_metered = false`). Eine energetische Spitzenstellung auf Silizium, eine Hochstufung von `ModelGenerated`-Ausgaben zu `Deterministic` sowie gemessene `70B`-Läufe (`air_mol_nvme_baselines.csv` weist ausschließlich analytische `70B`-Projektionen aus) werden nicht beansprucht.

| ID | Behauptung | Exakte Widerlegungs- / Falsifikationsbedingung |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` verfehlt `100.0%` Verilator-Parität über `5,120` Pakete oder übersieht den VLAN-Wechsel ab Paket `2,500`. |
| **`LA-F2`** | `Claim LA-2` (Polyglotte Suite) | Zig allokiert `> 0` Heap-Bytes in der heißen Schleife, Go meldet `> 0 allocs/op`, oder Julia Enzyme überschreitet `1e-7` FD-Fehler. |
| **`LA-F3`** | `Claim LA-3` (Gepagtes KV260-RTL) | `scripts/verify_paged_bram_rtl.py` überschreitet `117,120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s oder `1` Takt pro Seitenwechsel. |
| **`LA-F4`** | `Claim LA-4` (Konforme ACI) | `scripts/run_frontier_benchmarks.py` überschreitet das Ziel-Fehlrisiko $\alpha = 0.02$ auf verschobenem Verkehr oder vergibt `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Byte-Spekulation) | `scripts/run_code_corpus_benchmark.py` erreicht `< 100.0%` exakte Byte-Parität gegenüber gierigem `Mamba3CodeLM` auf `48` ungesehenen Prompts. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` unter `F_NOCACHE` verfehlt `100%` Parität oder liest mehr NVMe-Bytes als `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Claim LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_air_mol_pretrained.py` oder `scripts/run_hf_qwen35_air_mol.py` weicht um $\ge 1$ BPE-Token vom gierigen Zielmodell ab. |
| **`LA-F8`** | `Claim LA-8` (Regressionssuite) | `pytest -v` schlägt in irgendeiner der `18` Testsuiten unter `tests/` fehl. |

---

<div id="7-references" class="anchor-alias" aria-hidden="true"></div>

## 7. Literatur

<ol data-refs>
<li>Bacellar, A., et al. (2024). Differentiable Weightless Neural Networks. <em>arXiv:2410.11112</em>.</li>
<li>Beneš, V. E. (1965). <em>Mathematical Theory of Connecting Networks and Telephone Traffic</em>. Academic Press.</li>
<li>Cai, T., Li, Y., Geng, Z., Peng, H., Lee, J. D., Chen, D., and Dao, T. (2024). Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads. <em>ICML 2024</em>, <em>arXiv:2401.10774</em>.</li>
<li>Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. <em>arXiv:2305.05176</em>.</li>
<li>Dao, T., and Gu, A. (2024). Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality. <em>ICML 2024</em>, <em>arXiv:2405.21060</em>.</li>
<li>Furao, S., and Hasegawa, O. (2006). An incremental network for on-line unsupervised classification and topology learning (SOINN). <em>Neural Networks</em>, 19(1):90-106.</li>
<li>Gibbs, I., and Candès, E. (2021). Adaptive Conformal Inference Under Distribution Shift. <em>NeurIPS 2021</em>, <em>arXiv:2106.00170</em>.</li>
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455-1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094-1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026). <code>LiquidAI/LFM2.5-350M</code> Open-Weights Hybrid Model Card (March 2026). <a href="https://huggingface.co/LiquidAI/LFM2.5-350M">huggingface.co/LiquidAI/LFM2.5-350M</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
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

Aus einem Checkout von [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit 9dbf745`):

```bash
PYTHONPATH=src .venv/bin/pytest -v
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
```
