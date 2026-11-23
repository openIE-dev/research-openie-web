---
title: "Compilación descendente a LUT6 en una cascada Mixture of Limits: mallas booleanas enrutadas por Beneš, compuertas de activación conformales y transmisión NVMe de MoE dispersa de vanguardia"
deck: "Una cascada Mixture of Limits que intenta primero circuitos de tablas de consulta (LUT6) paginadas de 6 entradas, sin operaciones de punto flotante (cero FLOP), transmite modelos híbridos y de Mixture-of-Experts (MoE) dispersos de 4 bits, de finales de 2026 y de hasta 34.66B parámetros, desde memoria no volátil Express (NVMe), mediante shaders personalizados de Apple Metal Shading Language (MSL) solo en los fallos, controla las confirmaciones mediante verificadores deterministas y compila las activaciones certificadas hacia abajo, en bloques de RAM de 36 Kbit (RAMB36E2) enrutados por redes de Beneš, y en páginas canónicas de habilidades. Los tiempos de reloj de pared, los recuentos de bytes de lectura de archivo sin búfer (F_NOCACHE de Darwin), la memoria RAM activa (de hasta 970.0 megabytes = 1.47% de los pesos de punto flotante de 16 bits en 34.66B), los contadores de energía en chip de doble canal del Apple M5 Max (reported_j), las estimaciones analíticas de energía (est_j) y las simulaciones a nivel de transferencia entre registros (RTL) de Yosys/Verilator para xck26 se reportan a partir de openIE-dev/lut-adapt-ai en el commit af152ba. No se midió la potencia de los rieles de la placa de forma aislada (measured_j sin asignar)."
lang: "es"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*Revisión ff18890, 22 de noviembre de 2026. Implementación de referencia y artefactos: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) en [`af152ba2e63b5c55bcfad9b2fa41e675e8e3946c`](https://github.com/openIE-dev/lut-adapt-ai/tree/af152ba2e63b5c55bcfad9b2fa41e675e8e3946c). Resumen de datos: [/data/#lut-adapt](/data/#lut-adapt). PDF LaTeX: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([fuente](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Visión general

Este estudio examina cómo un sistema de cómputo puede compilar de forma descendente el trabajo repetido de modelos neuronales hacia búsquedas booleanas rápidas en tablas y hacia habilidades canónicas certificadas, sin perder la paridad exacta de las salidas ni promover conjeturas no verificadas a reglas de confianza. Se reportan mediciones de software y de entrada/salida sin búfer, simulaciones de síntesis a nivel de transferencia entre registros y de ciclos, lecturas de contadores de energía de doble canal (del sistema operativo / en chip) en Apple M5 Max y en los contadores Linux Running Average Power Limit (`reported_j`), y estimaciones analíticas de energía etiquetadas (`est_j`). En este repositorio no se conectó ningún monitor de julios de red eléctrica ni de riel de alimentación (`measured_j` no está definido; `board_metered` es falso).

**En palabras sencillas**

1. La mayoría de las entradas que ve un sistema desplegado repiten patrones que ya ha resuelto, por lo que ejecutar una red neuronal completa en coma flotante en cada paso desperdicia cómputo y ancho de banda de memoria.
2. La referencia coloca un nivel reconfigurable de tabla de verdad de 6 entradas (`LUT6`) por delante de los modelos de espacio de estados en streaming y de fundamentos, y compila las respuestas hacia abajo en páginas de memoria de consulta solo después de que una comprobación explícita las certifique.
3. Cuando los modelos de lenguaje híbridos y de mezcla dispersa de expertos de finales de 2026 de hasta `34.66B` parámetros transmiten pesos de 4 bits desde almacenamiento de estado sólido a través de sombreadores Apple Metal fusionados personalizados, las lecturas de expertos dispersos por enrutador emparejadas con ese redactor `LUT6` de cero FLOP reducen las lecturas de disco hasta en `12.30×` y mantienen `Qwen/Qwen3.6-35B-A3B` en `970.0` megabytes de memoria activa de pesos (`1.47%` de su huella de `66.11` gigabytes en coma flotante de 16 bits) a `6.773 J/tok` de `reported_j` en chip sin cambio alguno en los tokens de salida; el código de compuertas y los commits de repositorios git multifichero detrás de comprobaciones deterministas `pytest` alcanzan una **tasa de aprobación verificada del `87.50%`** tanto en un bakeoff de codificación de frontera de `48` tareas (`16` especificaciones × `3` olas) como en un benchmark de parcheo de repositorio de `16` tareas (`8` repositorios git × `2` olas) con **`0.00%` de commits rotos admitidos**, acelerando las soluciones cristalizadas de la Ola-3 en **`15,401×`** (`2.89 ms`, `0.0424 J` `reported_j`).

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Términos, acrónimos y etiquetas de medida

<ul id="terms">
<li>MoL: Mixture of Limits, la regla de cascada de Metered Commit Gates Part II [misma casa]</li>
<li>LA: prefijo de afirmaciones y falsadores (LA-1 a LA-14, LA-F1 a LA-F14) utilizado en este estudio</li>
<li>LUT, LUT6, INIT: tabla de consulta (look-up table), primitiva booleana de 6 entradas de Xilinx UltraScale+ y su máscara de inicialización de tabla de verdad de 64 bits</li>
<li>BRAM, RAMB36E2, URAM: bloque de RAM (Block RAM), primitiva de bloque de RAM de doble puerto de 36 Kbit de UltraScale+ (144 en xck26), y UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: bloque lógico configurable, biestable (flip-flop), slice de procesamiento digital de señales, y placa AMD Kria KV260 (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: matriz de puertas programable en campo, circuito integrado de aplicación específica, nivel de transferencia entre registros, ciclos por consulta, colocación y enrutamiento, holgura negativa en el peor caso, y conferencia Field-Programmable Logic</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU, SMC, L2, L3: Advanced eXtensible Interface (interfaz extensible avanzada), sistema de procesamiento Zynq, lógica programable, sistema en módulo, circuito integrado de monitorización de potencia a bordo, riel de alimentación, Intel Running Average Power Limit, NVIDIA Management Library, unidad de gestión de energía de macOS, Apple System Management Controller, contador de energía a nivel de subsistema de nivel 2 (Apple IOReport GPU Energy) y contador de energía de CPU por proceso de nivel 3 (Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj)</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: dualidad de espacio de estados (State Space Duality), modelo de espacio de estados, múltiples entradas y múltiples salidas, codificación posicional rotatoria, unidad lineal con compuerta de activación Swish, atención de consultas agrupadas, caché clave-valor, codificación por pares de bytes, modelo(s) de lenguaje de gran escala, Mezcla de Expertos, perceptrón multicapa, y gramática independiente del contexto</li>
<li>HC, SOINN, WNN, DWN: red neuronal incremental autoorganizada de contexto jerárquico (hierarchy-context Self-Organizing Incremental Neural Network), red neuronal sin pesos (weightless neural network), y red neuronal diferenciable sin pesos (Differentiable Weightless Neural Network)</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: Arquitectura Predictiva de Incrustación Conjunta, Modelo de Razonamiento Basado en Energía, Inferencia Conformal Adaptativa, fuera de distribución, área bajo la curva característica operativa del receptor, área bajo la curva, probabilidad softmax máxima, y Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF: Prompt Lookup Decoding (decodificación por búsqueda en el prompt), decodificación especulativa basada en recuperación (Retrieval-Based Speculative Decoding), Extrapolation Algorithm for Greater Language-model Efficiency (algoritmo de extrapolación para una mayor eficiencia de modelos de lenguaje), Liquid Foundation Model 2.5 (LFM2.5-350M y LFM2.5-8B-A1B), Liquid Foundation Model 3 (oct 2026 LiquidAI/LFM3-1.7B), y HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR: descomposición en valores singulares, rotación Procrustes en hipercubo de cuantización iterativa (Iterative Quantization Procrustes hypercube rotation), descomposición independiente del valor de signo, entrenamiento consciente de la cuantización, cuantización post-entrenamiento, perplejidad, y relación señal-ruido</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB, GiB: almacenamiento Non-Volatile Memory Express, bandera de archivo sin búfer de Darwin F_NOCACHE, Portable Operating System Interface, memoria de acceso aleatorio, RAM dinámica, RAM estática, entrada/salida, kilobyte, megabyte, gigabyte y gibibyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, BF16, FP16, FP32, INT4, ULP, MSL, MPS: operación(es) de coma flotante, millones de FLOPs, operación(es) de multiplicación-acumulación, instrucción única con datos múltiples, diferenciación automática, diferencias finitas, bits por byte, formato de coma flotante de cerebro de 16 bits, coma flotante IEEE de 16/32 bits, entero de 4 bits, unidad en el último lugar, Apple Metal Shading Language y PyTorch Metal Performance Shaders</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house], Wise Computer Automation [same house], completado verificado, y prefijo de benchmark de ingeniería de software</li>
<li>CLI, HTTP, GET, POST, SSE, API, MCP, RPC, IDE, SDK, CORS, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW, TDP: interfaz de línea de comandos, Protocolo de transferencia de hipertexto y sus métodos de solicitud GET/POST, eventos enviados por el servidor, interfaz de programación de aplicaciones, Protocolo de contexto de modelo, llamada a procedimiento remoto (JSON-RPC 2.0), entorno de desarrollo integrado, kit de desarrollo de software, Intercambio de recursos de origen cruzado, lista de control de acceso, venues académicos de ciencias de la computación e ingeniería (ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM), sistema operativo, unidad central/gráfica de procesamiento, software y potencia de diseño térmico</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XNOR, JWT, HMAC, DAG, CIDR, LRU, TTL, WAL, ETL: red de área local virtual (IEEE 802.1Q), Seguridad de la capa de transporte, inspección profunda de paquetes, árbol de sintaxis abstracta, Notación de objetos de JavaScript, valores separados por comas, Algoritmo seguro de hash, comprobación de redundancia cíclica, Modo de transferencia asíncrono (CRC-8/ATM), Petición de comentarios, Lenguaje de consulta estructurado, DWARF (codificación de enteros con signo en little-endian de base 128), memoria direccionable por contenido, NO-O exclusivo (exclusive-NOR), token web JSON, código de autenticación de mensajes basado en hash, grafo acíclico dirigido, enrutamiento interdominio sin clases, caché de uso menos reciente, expiración por tiempo de vida, registro de escritura anticipada y proceso de extracción, transformación y carga</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, CARRY8, DSP48E2, URAM288, VCCINT, DS925, VCD, SDP, CE, XPE, CLAI, AMD: Grupo de Acción de Prueba Conjunta, depurador de línea de comandos de Xilinx (XSDB), Puerto de Acceso de Depuración, Bus Serial Universal, Future Technology Devices International y su puente dual UART/FIFO FT2232C, receptor-transmisor asíncrono universal, búfer de primera entrada-primera salida, circuito integrado, automatización de diseño electrónico, modo de síntesis fuera de contexto, Arquitectura de Bus de Microcontrolador Avanzado, interconexión AXI4-Lite/AXI4-Stream, bloque de entrada/salida, buffers de entrada/salida, biestables D síncronos de reinicio/establecimiento, tablas de búsqueda UltraScale+ de 1 a 5 entradas, multiplexores UltraScale+ de 7/8 entradas, cadenas de acarreo rápido de 4/8 bits, segmento DSP UltraScale+, UltraRAM de 288 Kbit, riel de suministro interno del núcleo (0.72 V en -2LV), hoja de datos DS925 de Características de Conmutación DC y AC del Zynq UltraScale+ de AMD, traza de forma de onda Value Change Dump, modo Block RAM de puerto dual simple, habilitación de reloj síncrono, estimador de consumo de Xilinx, identificador mágico de registro del subsistema (“CLAI”), y Advanced Micro Devices</li>
</ul>

Four evidence classes stay separate across every table below:

| Etiqueta de evidencia | Significado en este estudio |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Conteos exactos de bytes leídos o escritos mediante `os.pread` bajo Darwin `F_NOCACHE`, asignaciones de memoria residente, segundos de reloj de pared, energía acumulada del `PMU` de macOS (`AppleSmartBattery.PowerTelemetryData`) en Apple M5 Max, y acuerdo exacto de bits/token. `measured_j` está sin definir (`None`). |
| **`Reported (OS / On-Chip Counter, reported_j)`** | Contadores de telemetría del sistema operativo sin privilegios y del chip: en Apple M5 Max (`joule_meter.py`), `libIOReport.dylib` de doble canal `"Energy Model"` `'GPU Energy'` (`L2` con resolución de nanosegundos en `nJ`) más `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3` por proceso CPU `nJ`); en Linux `x86-64` (en la auditoría de síntesis EDA `xck26` abajo), julios `RAPL` `package-0`. Nunca se combina con `measured_j` (`None`). |
| **`Simulated (RTL)`** | Recuentos estructurales de netlist de Yosys `0.71+` (`synth_xilinx -family xcup` dirigido a Kria KV260 `xck26`) y recuentos de ciclos (`CPI = 1`) de Verilator `5.054`. No es cierre de temporización de Vivado ni potencia de placa (`board_metered = false`). |
| **`Estimated (est_j)`** | Julios analíticos calculados a partir de recuentos de operaciones, sustitutos temporales de potencia de diseño térmico (`joule_meter.py`), o actividad de conmutación de tasa de cambio de VCD de Verilator asociada a lógica AMD `DS925` `xck26-2LV` (`0.72 V`) y límites de capacitancia `RAMB36E2` (§4.16). Comparable solo entre brazos dentro de la misma fórmula; nunca vatios de silicio. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Antecedentes arquitectónicos y contribuciones

En [Metered Commit Gates](/papers/gates/) `[same house]`, la Parte II define **Mixture of Limits**: probar las marchas en orden decreciente de probabilidad de superación por julio $p_i / c_i$ (Simon y Kadane, 1975), detenerse en cuanto se cumple el predicado de finalización de la tarea $C(z) = 1$, y prohibir que la salida `ModelGenerated` se refuerce hasta convertirse en `Deterministic`. Sin embargo, un nivel de búsqueda estático (Lookup) solo cubre las entradas escritas en él antes del despliegue. Por el contrario, las redes neuronales basadas en tablas de búsqueda existentes, LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022) y las Differentiable Weightless Neural Networks (Bacellar et al., 2024), fijan la conectividad de los cables dentro de un enrutamiento estático de FPGA, lo que exige place-and-route del proveedor cada vez que cambia la distribución de entrada.

La referencia `lut-adapt-ai` cierra el ciclo entre la parte superior e inferior de la cascada mediante **compilación descendente en línea a `LUT6`**:

- **Tramo 0 (Búsqueda, Beneš paginado + `LUT6`)**: Evalúa máscaras de tabla de verdad de 64 bits enrutadas a través de un conmutador multicast **Beneš-Copia-Beneš** no bloqueante $512 \times 512$ y almacenadas en caché en memorias de bloque dual-puerto $81 \times \texttt{RAMB36E2}$ (`0` operaciones de punto flotante, cambio de página de un ciclo en simulación Verilator).  
- **Tramo 1 (Flujo, Dualidad de Espacio de Estado MIMO Complejo `Mamba-3`)**: Gestiona fallos que dependen del historial de secuencia mediante un estado recurrente de tamaño constante $O(1)$ (`48 KB` de memoria anclada en la referencia de `14.3M` parámetros), evitando el crecimiento $O(L)$ de la caché clave-valor.  
- **Tramo 2 (Topología, `HC-SOINN`)**: Mantiene la topología de prototipo en línea sobre incrustaciones latentes, aislando límites de régimen y activando un disyuntor (`Refuse` / escalar) cuando ocurre un desplazamiento de distribución sin etiquetar.  
- **Tramo 3 (Modelo final, `JEPA-EBRM`, `AirMoL` y `Expert-AirMoL` fusionado con Metal de 4 bits y transmisión NVMe)**: Invoca la verificación basada en energía latente o transmite modelos fundacionales híbridos y de MoE dispersa preentrenados a finales de 2026 (`LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it`, `LiquidAI/LFM2.5-8B-A1B` y `Qwen/Qwen3.6-35B-A3B`, junto a `LiquidAI/LFM2.5-350M` y `Qwen/Qwen3.5-0.8B-Base`) mediante sombreadores de cómputo `MSL` de Apple Metal solo cuando los tramos inferiores son más económicos o requieren verificación exacta del objetivo.  
- **`SleepCrystallizer` descendente**: Extrae trazas de activación recurrentes usando arranques en caliente espectrales Walsh-Hadamard, tablas de verdad de minterminos en modo conjunto, habilidades AST canónicas y programaciones de conmutador Waksman, invirtiendo bancos de memoria de bloque sombra sin detener la inferencia ni ejecutar colocación y ruteo en FPGA.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Contribuciones

1. **Condición de compilación descendente amortizada**: Extiende el ordenamiento $p_i/c_i$ de Simon-Kadane con un costo explícito de compilación $E_{\text{compile}}$ sobre un horizonte estacionario $\Delta T$.
2. **Arquitectura RTL no bloqueante Beneš-Copy-Beneš de $512 \times 512$ y `81`-`RAMB36E2`**: Elimina tanto el desbordamiento lógico del `102.0%` en Kria KV260 de las barras cruzadas planas (`119,478` LUTs) como la explosión de `926,619` LUTs de los multiplexores de página basados en biestables, sintetizando a `41,186` LUTs CLB de UltraScale+ (`35.2%` de `xck26`), `81` bloques `RAMB36E2` (`56.2%`), y `0` porciones `DSP48` con conmutación de página de `1` ciclo (`4.0 ns` a `250 MHz` nominal) en simulación.
3. **Síntesis universal de minitérminos en modo conjunto de $\le 64$ bits**: Muestra que la búsqueda de minitérminos en modo conjunto domina el redondeo marginal DiffLogic de planos de bits en ramas correlacionadas y empaqueta $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ tokens de subpalabra en una palabra `uint64` (`16b × 4 = 64b` para `|V| = 65,536`; `17b × 3 = 51b` para `|V| = 128,000`; `18b × 3 = 54b` para `|V| = 248,320`).
4. **Compuerta de cristalización Split-Conformal + ACI en línea libre de oráculo**: Empareja una puntuación de no conformidad latente `JEPA-EBRM` regularizada radialmente con calibración Split Conformal e Inferencia Conformal Adaptativa (Gibbs y Candès, 2021), registrando un riesgo de cristalización falso de `0.00%` y un AUROC OOD de `1.0000` en tráfico desplazado donde las líneas base softmax y MC-Dropout registran un riesgo falso de `17.62%-24.28%`.
5. **Sombreadores Apple Metal `INT4` Sparse-MoE y `GatedDeltaNet` personalizados + `AirMoL` / `Expert-AirMoL` hasta `34.66B`**: Combina fragmentación de `4` bits `F_NOCACHE` `os.pread` de Darwin, sombreadores de cómputo `MSL` `q4_moe_*` (`43.45×` más rápidos) y `gated_delta_recurrent_k128` (`20.66×` más rápidos), `pread` paralelo de Profundidad-de-Cola-`8`, y especulación de ráfaga `BenesLUT6` en `LiquidAI/LFM3-1.7B` de octubre de 2026 (`2.74×` reducción de NVMe en `3.79%` de RAM FP32), `LiquidAI/LFM2.5-8B-A1B` (`500.0 MB` de RAM, `3.493 J/tok` `reported_j`), y `Qwen/Qwen3.6-35B-A3B` (`34.66B`; **`12.30×` reducción de NVMe**, **`970.0 MB` de RAM = `1.47%` de FP16**, **`6.773 J/tok` `reported_j`**, **`15.7 tok/s`** `Q4` de Memoria Unificada) con paridad exacta de token al `100.0%`.
6. **`Sub1Bit-LUT6` de cero-MAC frente a `LittleBit`, codificación de frontera con compuerta verificadora al `87.50%` y cascadas de repositorios git `SWE-Mini`, y `mol-agent` de OpenAI / `MCP`**: Reemplaza los `1.98M` MAC binarios en tiempo de ejecución de `LittleBit-1 / LittleBit-2` (`0.576` bits por peso; Lee et al., 2025; Lee y Kim, 2026) con búsqueda de suma parcial `LUT6` de `6` entradas de cero-MAC (`< 4 × 10⁻⁶` de error, `100.0%` de paridad bajo verificación de destino `MoL` en `0` épocas de QAT), logra un **`87.50%` (`42 / 48`) de aprobados verificados** (`0.00%` de commits rotos, `22.92%` de llamadas a `35B`, `2.89 ms` / `0.0424 J` `reported_j` de repetición cristalizada Wave-3 = `15,401×` más rápido que `35B`) en una competición de codificación de `48` tareas de finales de 2026 y un **`87.50%` (`14 / 16`)** (`0.00%` de parches rotos) en un banco de pruebas `SWE-Mini` `pytest` de `16` tareas (`8` repositorios git multifichero × `2` ondas), y expone un servidor `mol-agent` de sustitución directa OpenAI `/v1/chat/completions` + `MCP` (`JSON-RPC 2.0`) (`26 / 26` pruebas `pytest` aprobadas).

<div id="13-same-house-disclosure-and-provenance-boundaries" class="anchor-alias" aria-hidden="true"></div>

### 1.3 Divulgación de trabajos propios y límites de procedencia

Los estudios previos de Open Interface Engineering, a saber, [Compuertas de confirmación medidas](/papers/gates/), [Saciedad de la tarea frente al rebote agregado en la demanda de IA](/papers/satiation/), [El Reality Code Engine](/papers/rce/), [RCE-JEPA](/papers/rce-jepa/) y [RCE Compile](/papers/rce-compile/), son trabajos `[same house]` (de la misma casa) citados por transparencia y continuidad arquitectónica, nunca como confirmación externa independiente. Dos invariantes rigen en todo el documento:

- **No fortalecimiento de procedencia (`ModelGenerated ↛ Deterministic`)**: Las tablas compiladas a partir de una comprobación determinista de especificación `RCE` llevan la etiqueta `Check-safe` sobre conjuntos reservados verificados (protegidas en línea por un disyuntor `HC-SOINN` / `RCE`). Las tablas cristalizadas bajo la compuerta conformal `JEPA-EBRM` sin oráculo portan únicamente una cota estadística de muestra finita (`Conformal-bounded`, $1-\alpha$) y jamás se promueven a `Deterministic`.
- **Proponente frente a autoridad (`The drafter proposes; the target decides`)**: En la decodificación especulativa, `PagedBenesLUT6` actúa estrictamente como un proponente de cero FLOP; cada byte o token emitido se verifica frente a la decodificación voraz del modelo objetivo (`100.0%` de paridad sin pérdida).

---

<div id="2-mathematical-formulations-and-four-results" class="anchor-alias" aria-hidden="true"></div>

## 2. Formulaciones matemáticas y cuatro resultados

<div id="21-result-1-cascade-ordering-with-amortized-downward-compilation" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Resultado 1: Ordenamiento de cascada con compilación descendente amortizada

Considérense los engranajes $i \in \{0, 1, 2, 3\}$ probados secuencialmente sobre una entrada $x$. El engranaje $i$ satisface $C(z) = 1$ con probabilidad $p_i$ y un gasto energético analítico esperado $c_i > 0$. Por Simon y Kadane (1975), el gasto esperado

$$\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j < k} \bigl(1 - p_{\sigma(j)}\bigr)$$

se minimiza si y solo si los engranajes se ejecutan en orden no creciente de $p_{\sigma(k)} / c_{\sigma(k)}$. Supóngase que un régimen estacionario $\mathcal{D}_r$ persiste durante $\Delta T$ consultas restantes en las que la ruta de activación cierra con $p_{\text{wake}} = 1$ a un costo $c_{\text{wake}}$. Invertir una energía única de compilación $E_{\text{compile}}$ tras $N_{\text{wake}}$ activaciones certificadas produce una página `LUT6` en el Peldaño 0 con tasa de acierto certificada $p_0' \in (0, 1]$ y costo de búsqueda $c_0 \ll c_{\text{wake}}$.

**Proposición 1 (Condición de energía neta para la cristalización descendente).** *La compilación descendente reduce el gasto analítico acumulado esperado en el horizonte $\Delta T$ si y solo si*

$$\Delta T \cdot \bigl(p_0' c_{\text{wake}} - c_0\bigr) > E_{\text{compile}}, \qquad \text{and} \qquad \frac{p_0'}{c_0} > \frac{1}{c_{\text{wake}}}.$$

*Demostración.* Sin cristalización, $\Delta T$ consultas cuestan $\Delta T \cdot c_{\text{wake}}$. Con cristalización a un costo $E_{\text{compile}}$, el Peldaño 0 precede a la ruta de activación siempre que $p_0'/c_0 > 1/c_{\text{wake}} \iff c_0 < p_0' c_{\text{wake}}$, y cada consulta cuesta $c_0 + (1 - p_0') c_{\text{wake}}$, ahorrando $p_0' c_{\text{wake}} - c_0 > 0$ por paso. Al sumar a lo largo de $\Delta T$ pasos se obtiene un ahorro neto $\Delta T(p_0' c_{\text{wake}} - c_0) - E_{\text{compile}} > 0$. Bajo rotación rápida de regímenes ($\Delta T \le \Delta T^*$), la compilación pierde energía, lo que motiva el búfer mínimo de activaciones $N_{\text{wake}}$ y la compuerta sobre el conjunto reservado $\tau_{\text{agree}} = 0.985$ en `SleepCrystallizer`. $\blacksquare$

<div id="22-result-2-non-blocking-512512-benešcopybeneš-multicast-routing" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Resultado 2: Enrutamiento multidifusión sin bloqueo $512 \times 512$ Beneš-Copy-Beneš

Un banco en el Peldaño 0 compuesto por $G = 80$ celdas `LUT6` dinámicas requiere seleccionar $M = 6G = 480$ pines de entrada desde un bus de $N = 512$ bits con ramificación de salida (fan-out) arbitraria. Una red de permutación biyectiva de Beneš no puede replicar cables con alto fan-out, mientras que las matrices planas de multiplexores $512:1$ desbordan la capacidad de la KV260 (`119,478` LUTs de CLB ya con `384` puertos).

**Teorema 2 (Multidifusión libre de contención mediante Beneš-Copy-Beneš).** *Para $N = 2^n$ ($n=9, N=512$) y $M \le N$ ($M=480$), cualquier aplicación multidifusión muchos-a-uno $\phi: \{0, \dots, M-1\} \to \{0, \dots, N-1\}$ se enruta sin contención a través de $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ en*

$$D(N) = 2(2\log_2 N - 1) + \log_2 N = 5\log_2 N - 2 = 43 \text{ stages}$$

*formadas por $N/2 = 256$ conmutadores $2 \times 2$ configurados por SRAM ($11,008$ bits de configuración), calculados en tiempo $O(N \log N)$ sin requerir posicionamiento ni enrutamiento en el FPGA.*

*Demostración.* Sea $U = \{s_1, \dots, s_r\}$ el conjunto de entradas activas distintas con grados de ramificación $\sum_{j=1}^r m_j = M \le N$ y sumas parciales $S_0 = 0, S_j = \sum_{i=1}^j m_i$. La red de concentración $\mathcal{B}_1$ ($17$ etapas) asigna $\pi_1(s_j) = S_{j-1}$ mediante la bicoloreación bipartita de Waksman (Beneš, 1965; Waksman, 1968). La red de copia $\mathcal{C}$ ($9$ etapas en mariposa) replica cada $S_{j-1}$ a lo largo del intervalo monótono disjunto $[S_{j-1}, S_j - 1]$ sin contención de enlaces gracias a la construcción de copia monótona de Thompson (Thompson, 1978; Lee, 1988). Finalmente, la red de Beneš de salida $\mathcal{B}_2$ ($17$ etapas) permuta biyectivamente $[S_{j-1}, S_j - 1]$ sobre $\phi^{-1}(s_j)$. $\blacksquare$

<div id="23-result-3-joint-mode-minterm-synthesis-vs-marginal-coordinate-argmax" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Resultado 3: Síntesis de minitérminos de moda conjunta frente a argmax coordenado marginal

Las capas DiffLogic de planos de bits independientes predicen ráfagas multibit $\mathbf{Y} = (Y_1, \dots, Y_B)$ mediante redondeo coordenada a coordenada $\hat{y}_b(c) = \mathbb{I}[\Pr(Y_b = 1 \mid c) > 1/2]$, lo cual mezcla ramas correlacionadas generando tokens **quimera** inválidos.

**Proposición 3 (Dominancia y propiedad de cero quimeras de los minitérminos de moda conjunta).** *Para un contexto discreto $\psi(X) = c$ y un espacio de ráfagas $\mathcal{Y}$ de $B \le 64$ bits, la tabla de moda conjunta $T^*(c) = \arg\max_{\mathbf{y} \in \mathcal{Y}} \Pr(\mathbf{Y} = \mathbf{y} \mid c)$ satisface $\Pr[\mathbf{Y} = T^*(\psi(X))] \ge \Pr[\mathbf{Y} = \hat{\mathbf{y}}^{\text{marg}}(\psi(X))]$, permanece dentro de $\operatorname{supp}(\mathbf{Y} \mid c)$ y evita las quimeras marginales (donde masas de probabilidad $0.40, 0.35, 0.25$ sobre $(1,1,0), (1,0,1), (0,1,1)$ se redondean marginalmente al vector inválido $(1,1,1)$ con `0%` de coincidencia exacta frente al `40%` de $T^*$). Para un vocabulario $|V|$ con $b_V = \lceil \log_2 |V| \rceil$, una palabra `uint64` empaqueta $K = \lfloor 64 / b_V \rfloor$ tokens BPE (`16b × 4 = 64b` en `LFM2.5-350M`; `18b × 3 = 54b` en `Qwen3.5-0.8B-Base`).* $\blacksquare$

<div id="24-result-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Resultado 4: Compuerta Split-Conformal + ACI en línea con `JEPA-EBRM` latente sin oráculo

Para impedir la autodestilación alucinada cuando no se dispone de una comprobación determinista `RCE`, la implementación de referencia puntúa los pares candidatos mediante una energía latente regularizada radialmente:

$$E_\phi(x, y) = \frac{1}{2}\|f_\theta(x) - \mu_y\|_2^2 + \frac{\lambda_r}{2}\|f_\theta(x)\|_2^2 + \psi_\phi(f_\theta(x), y), \qquad \lambda_r > 0, \quad |\psi_\phi| \le C_\psi.$$

La calibración Split Conformal sobre un conjunto reservado fija el umbral $\hat{Q}_{1-\alpha}$, y la Inferencia Conformal Adaptativa (ACI) en línea actualiza $\alpha_{t+1} = \alpha_t + \gamma(\alpha - \text{err}_t)$ (Gibbs y Candès, 2021), admitiendo $(x, \hat{y})$ en `SleepCrystallizer` únicamente cuando $|\mathcal{C}_t(x)| = |\{y : E_\phi(x,y) \le \hat{Q}_{1-\alpha_t}\}| = 1$ (`Conformal-bounded`). Por Vovk et al. (2005) y Gibbs y Candès (2021), la cobertura marginal bajo intercambiabilidad es de al menos $1-\alpha$, la falta de cobertura a largo plazo bajo desplazamiento converge a $\alpha$, y todo rayo fuera de la variedad que supere el radio $R(\alpha_t) = \sqrt{2(\hat{Q}_{1-\alpha_t} + C_\psi)/\lambda_r}$ produce $\mathcal{C}_t(x) = \emptyset$ (`Refuse` de rechazo o abstención).

---

<div id="3-reference-architecture-polyglot-suite-and-kv260-rtl" class="anchor-alias" aria-hidden="true"></div>

## 3. Arquitectura de referencia, suite poliglota y RTL para KV260

La figura 1 muestra la cascada de cuatro peldaños y el bucle descendente de `SleepCrystallizer` en `src/clai/`.

![Figura 1. Compilación descendente a través de una cascada Mixture of Limits de cuatro peldaños.](/figures/lut-adapt/mol-downward-cascade.svg)

*Figura 1. Compilación descendente a través de una cascada Mixture of Limits de cuatro peldaños. Diagrama de diseño, no una medición de potencia de placa. [PNG](/figures/lut-adapt/mol-downward-cascade.png) · [Explorador interactivo](/living/lut-adapt/#la-diag-01).*

Cinco implementaciones de sistemas en `openIE-dev/lut-adapt-ai` verifican cruzadamente la cascada: Python/PyTorch/Triton (`src/clai/`), Rust `Burn 0.22.1 / CubeCL` Metal (`sys/rust/`), Zig `0.17.1` (`sys/zig/`), Go `1.27.4` SIMD (`sys/go/`) y Julia `1.13.4` Enzyme (`sys/julia/`).

La figura 2 ilustra el camino de datos RTL de la Kria KV260 (`xck26`) en `hw/kv260/rtl/clai_benes_hotswap_core.sv`, que mapea `512` páginas residentes de `LUT6` (`5.120` bits `INIT` + etiqueta de contexto de `48` bits + bit de validez) a través de `81` memorias `RAMB36E2` de doble puerto en paralelo para conmutación de contexto en un solo ciclo (`4,0 ns` a `250 MHz` nominal, `CPI = 1,0`).

![Figura 2. Malla de multidifusión Beneš-Copy-Beneš y caché de página LUT6 en BRAM de un solo ciclo.](/figures/lut-adapt/benes-paged-silicon.svg)

*Figura 2. Malla de multidifusión Beneš-Copy-Beneš de `512×512` y caché de página `LUT6` de un solo ciclo con `81 × RAMB36E2` orientada a AMD Kria KV260 (`xck26`) en simulación Yosys `0.71+` y Verilator `5.054` (`board_metered = false`). [PNG](/figures/lut-adapt/benes-paged-silicon.png) · [Explorador interactivo](/living/lut-adapt/#la-diag-02).*

La figura 3 muestra `AirMoL` (`src/clai/frontier/air_mol_streamer.py` y `hf_air_mol_pretrained.py`), que transmite fragmentos cuantizados en grupos de 4 bits mediante `os.pread` de Darwin `F_NOCACHE`, verifica `[last_tok, d_1..d_K]` en un solo barrido y captura estados híbridos compactos (`Short-Conv/SSM` o `Gated DeltaNet` + recorte disperso de KV de `6` capas `GQA`) en RAM, de modo que las rechazos parciales de borrador requieren **cero barridos NVMe adicionales**.

![Figura 3. Transmisión NVMe por capas de AirMoL de 4 bits con especulación universal LUT6 de token de 64 bits.](/figures/lut-adapt/airmol-nvme-speculation.svg)

*Figura 3. Transmisión NVMe por capas de `AirMoL` de 4 bits con cero barridos adicionales y especulación universal `LUT6` de token de `≤64` bits en `LiquidAI/LFM3-1.7B`, `LiquidAI/LFM2.5-350M` y `Qwen/Qwen3.5-0.8B-Base`. [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [Explorador interactivo](/living/lut-adapt/#la-run-01).*

La Figura 4 muestra `Expert-AirMoL` (`src/clai/frontier/moe_air_mol.py`) y `VerifiedCodeCascade` (`verified_code_cascade.py`). El `AirLLM` estándar con descarga a disco recorre los $E$ expertos de cada capa MoE (`32` en `LiquidAI/LFM2.5-8B-A1B`, `256` en `Qwen/Qwen3.6-35B-A3B`), aunque el router activa solo $k \ll E$ expertos por token (`4/32` y `8/256`). `Expert-AirMoL` divide cada capa MoE en un fragmento compacto de cabeceras y un archivo NVMe `INT4` de tamaño de paso fijo, `.experts.pack4`. Emite lecturas `os.pread` con `F_NOCACHE` únicamente para la unión de expertos activos $\mathcal{U}_l$ a lo largo de las $K+1$ posiciones de ráfaga. Para tareas de síntesis novedosas, `VerifiedCodeCascade` somete cada confirmación en los escalones `0-3c` a un AST acotado a `0.35s`, a ejecución en sandbox y a una comprobación de invariantes de frontera $C(z) \in \{0, 1\}$, y compila las soluciones certificadas en `BenesLUT6` y en páginas canónicas de habilidades AST.

![Figura 4. Transmisión NVMe de 4 bits dispersa por router en Expert-AirMoL y VerifiedCodeCascade con compuerta de verificación.](/figures/lut-adapt/moe-expert-cascade.svg)

*Figura 4. Transmisión NVMe de 4 bits indexada por experto y dispersa por router en `Expert-AirMoL` (reducción de E/S de `12.30×` en `Qwen/Qwen3.6-35B-A3B`) y `VerifiedCodeCascade` con compuerta `C(z)`. [PNG](/figures/lut-adapt/moe-expert-cascade.png) · [Explorador interactivo](/living/lut-adapt/#la-run-01).*

---

<div id="4-claims-and-results" class="anchor-alias" aria-hidden="true"></div>

## 4. Afirmaciones y resultados

<div id="41-claim-la-1-analytical-est_jvc-reduction-on-synthetic-tasks-and-real-pcap-traffic" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Afirmación LA-1: Reducción analítica de `est_j/VC` en tareas sintéticas y tráfico `.pcap` real

| Carga de trabajo y ventana | Cuota Peldaño 0 | Tasa de aprobación | `est_j / VC` analítico | Paridad Verilator | Clase de evidencia |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Sintético ep. `1-512` (activación en frío) | `0.00%` | `0.0% → 52.0%` | `2,323.18 est_j` | - | SW + `est_j` |
| Sintético ep. `3,073-3,584` (cristalizado) | `52.73%` | `60.55%` | `2.59 est_j` (`895×`) | `100.0%` | Verilator + `est_j` |
| Paquetes `.pcap` `1-512` (IPv4 en frío) | `0.00%` | `73.05%` | `3.3351 est_j` | `100.0%` | Verilator + `est_j` |
| Paquetes `.pcap` `1,537-2,048` (cristalizado) | `100.00%` | `100.00%` | `0.000140 est_j` | `100.0%` | Verilator + `est_j` |
| Paquetes `.pcap` `2,049-2,560` (cambio VLAN `0x8100`) | `2.73%` | `68.55%` | `3.0485 est_j` | `100.0%` | Disyuntor + `est_j` |
| **Paquetes `.pcap` `2,561-3,072` (recristalizado)** | **`100.00%`** | **`100.00%`** | **`0.000131 est_j` (`25,458×`)** | **`100.0%` (`5,120/5,120`)** | **Verilator + `est_j`** |

<div id="42-claim-la-2-five-language-polyglot-parity-and-zero-allocation-dataplanes" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Afirmación LA-2: Paridad políglota en cinco lenguajes y planos de datos sin asignaciones dinámicas

| Implementación | Destino / Backend | Resultado clave | Clase de evidencia |
| :--- | :--- | :--- | :--- |
| **Rust (`sys/rust/`)** | `Burn 0.22.1` + GPU Metal `CubeCL` | `2,331.42 → 0.19 est_j/VC`, `95.31%` de cuota en Peldaño 0, emite `.v` para KV260 | SW medido + `est_j` |
| **Zig `0.17.1` (`sys/zig/`)** | `@Vector(8, f32)` SIMD + `@popCount` | `0` bytes de montículo (heap) en el bucle crítico; `87 ns/pkt` (`11.49M pkts/s`) | SW medido (M5 Max) |
| **Go `1.27.4` (`sys/go/`)** | Grupo de trabajadores + `OnesCount64` | `0 B/op`, `0 allocs/op`; `31.86 ns/op` (`31.39M evals/s`) | Medido (`go test`) |
| **Julia `1.13.4` (`sys/julia/`)** | AD en modo inverso con `Enzyme.jl` | Discrepancia máxima de gradiente frente a FD centradas: `6.11 × 10⁻¹⁰` | Comprobación numérica medida |

<div id="43-claim-la-3-kv260-xck26-benešcopybeneš-and-ramb36e2-paged-synthesis" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Afirmación LA-3: Síntesis paginada Beneš-Copy-Beneš y `RAMB36E2` en KV260 (`xck26`)

| Arquitectura RTL | Páginas | Latencia de cambio | LUTs CLB `xcup` (`% xck26`) | `RAMB36E2` | `DSP48` | Precisión tras deriva | Clase de evidencia |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `2A` Matriz plana `512:1` (`64` LUT6) | `1` | `82 cyc` | `119,478` (**`102.0%` desborde**) | `0` | `0` | `98.44%` | Simulado (Yosys) |
| `2B` Matriz compacta (`32` LUT6) | `1` | `82 cyc` | `59,739` (`51.0%`) | `0` | `0` | `95.94%` | Simulado (Yosys) |
| `2C` Cableado fijo DiffLogic / WNN | `1` | Re-PAR en Vivado | `160` (`0.14%`) | `0` | `0` | **`52.34%`** | Simulado (Yosys) |
| `2D` Beneš-Copy-Beneš de página única | `1` | `82 cyc` | `40,155` (`34.3%`) | `0` | `0` | `98.44%` | Simulado (Yosys + Verilator) |
| `P2` FF distribuidos + Mux `512:1` | `512` | `1 cyc` | `926,619` (**`791.2%` desborde**) | `0` | `0` | `98.44%` | Simulado |
| **`P3` Beneš + `81` `RAMB36E2` (Referencia)** | **`512`** | **`1 cyc` (`4.0 ns`)** | **`41,186` (`35.2%`)** | **`81` (`56.2%`)** | **`0`** | **`98.44%`** | **Simulado (Yosys + Verilator)** |

<div id="44-claim-la-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.4 Afirmación LA-4: Compuerta Split-Conformal + ACI en línea con `JEPA-EBRM` latente sin oráculo

| Compuerta de cristalización | Pasadas | Riesgo de falsa cristalización | AUROC OOD | Cobertura ID segura | Precisión `LUT6` limpia | ¿Detectó cambio? | Clase de evidencia |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `3A` Softmax MSP ($\max p \ge 0.95$) | `1` | `17.62%` | `0.8552` | `90.93%` | `99.22%` | `False` | SW medido |
| `3B` Margen escalado por temperatura | `1` | `17.66%` | `0.8422` | `91.12%` | `98.83%` | `False` | SW medido |
| `3C` Energía de logits de Helmholtz | `1` | `24.28%` | `0.8045` | `97.17%` | `99.80%` | `False` | SW medido |
| `3D` MC-Dropout (`5` pasadas) | `5` | `18.24%` | `0.8494` | `91.03%` | `99.61%` | `False` | SW medido |
| **`3E` `JEPA-EBRM` latente + ACI conformal** | **`1`** | **`0.00%`** | **`1.0000`** | **`95.66%`** | **`99.02%`** | **`True`** | **SW medido** |

<div id="45-claim-la-5-lossless-byte-level-speculative-decoding-on-520-kb-polyglot-source-code" class="anchor-alias" aria-hidden="true"></div>

### 4.5 Afirmación LA-5: Decodificación especulativa sin pérdida a nivel de byte sobre `520 KB` de código fuente políglota

| Arquitectura | Paridad exacta | Bytes / Pasada | Pasadas (`64 B`) | FLOPs de borrador | MFLOPs / Byte | `est_mJ / Byte` | Clase de evidencia |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` Transformer causal (`RoPE+SwiGLU`) | `100.0%` | `1.00` | `64.00` | `0` | `7.209` | `58.94` | SW medido + `est_j` |
| `B` `Mamba-3` MIMO complejo (`T=1`) | `100.0%` | `1.00` | `64.00` | `0` | `2.257` | `20.84` | SW medido + `est_j` |
| `C` Búsqueda en el prompt `PLD` | `100.0%` | `2.13` | `29.98` | `0` | `1.322` | `11.52` | SW medido + `est_j` |
| `D` Árbol de sufijos de corpus `REST` | `100.0%` | `3.84` | `16.65` | `0` | `0.734` | `6.40` | SW medido + `est_j` |
| `E` Cabezales MLP paralelos `Medusa` | `100.0%` | `2.62` | `24.44` | `428,288` | `1.241` | `9.46` | SW medido + `est_j` |
| `F` Árbol borrador neuronal `EAGLE-2` | `100.0%` | `2.75` | `23.29` | `1,122,560` | `1.435` | `9.07` | SW medido + `est_j` |
| **`G` `MoL` Beneš paginado `LUT6` (Referencia)** | **`100.0%`** | **`3.84`** | **`16.69`** | **`0`** | **`0.736`** | **`6.41`** | **SW medido + `est_j`** |

<div id="46-claim-la-6-controlled-airmol-4-bit-nvme-streaming-143m-matched-pair" class="anchor-alias" aria-hidden="true"></div>

### 4.6 Afirmación LA-6: Transmisión NVMe controlada de 4 bits `AirMoL` (par emparejado de `14.3M`)

| Arquitectura de transmisión descargada | Paridad | Bytes / Barrido | Barridos | Lectura NVMe | Escritura NVMe | RAM pico | `ms / Byte` | Clase de evidencia |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `AirLLM` Transformer FP16 + volcado KV | `100%` | `1.00` | `64.00` | `2,130.0 MB` | `407.6 MB` | `8.81 MB` | `60.64` | Medido (`F_NOCACHE`) |
| `2` `AirLLM` Transformer 4 bits + volcado KV | `100%` | `1.00` | `64.00` | `887.6 MB` | `407.6 MB` | `8.81 MB` | `64.87` | Medido (`F_NOCACHE`) |
| `3` `AirMamba-3` 4 bits + `EAGLE-2` paginado | `100%` | `2.86` | `22.38` | `175.3 MB` | `0.0 MB` | `7.20 MB` | `19.20` | Medido (`F_NOCACHE`) |
| `4` `AirMamba-3` 4 bits + $O(1)$ fijado (`T=1`) | `100%` | `1.00` | `64.00` | `488.3 MB` | `0.0 MB` | `7.20 MB` | `37.72` | Medido (`F_NOCACHE`) |
| **`5` `AirMoL` 4 bits + `LUT6` en frío (Referencia)** | **`100%`** | **`3.74`** | **`17.12`** | **`130.7 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.18`** | **Medido (`F_NOCACHE`)** |
| **`6` `AirMoL` 4 bits + tras activación (Referencia)** | **`100%`** | **`4.27`** | **`15.00`** | **`114.4 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.09`** | **Medido (`F_NOCACHE`)** |

<div id="47-claim-la-7-pretrained-2026-dense--tri-hybrid-models-under-airmol-lfm3-17b-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 Reclamación LA-7: Modelos densos y tri-híbridos preentrenados 2026 bajo `AirMoL` (`LFM3-1.7B`, `LFM2.5-350M`, & `Qwen3.5-0.8B-Base`)

| Punto de Control 2026 y Arm | Paridad | Token / Barrido | Caracteres / Barrido | Barridos | Lectura NVMe | RAM Activa Máxima (`% FP32`) | `tok/s` | Clase de Evidencia |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM3-1.7B` (Oct 2026) · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.30` | `24.00` | `25.045 GB` | `250.0 MB` (`3.79%`) | `0.53` | Medido (`F_NOCACHE`) |
| `LFM3-1.7B` (Oct 2026) · `AirLLM` 4-Bit + `PLD` | `100%` | `1.37` | `3.16` | `17.50` | `18.262 GB` | `250.0 MB` (`3.79%`) | `0.73` | Medido (`F_NOCACHE`) |
| **`LFM3-1.7B` (Oct 2026) · `AirMoL` Frío `LUT6`** | **`100%`** | **`1.55`** | **`3.56`** | **`15.50`** | **`16.175 GB`** | **`250.0 MB` (`3.79%`)** | **`0.81`** | **Medido (`F_NOCACHE`)** |
| **`LFM3-1.7B` (Oct 2026) · `AirMoL` Post-Despertar** | **`100%`** | **`2.74`** | **`6.31`** | **`8.75`** | **`9.131 GB`** | **`250.0 MB` (`3.79%`)** | **`1.32`** | **Medido (`F_NOCACHE`)** |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Medido (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Medido (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Medido (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` Frío `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Medido (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` Post-Despertar** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Medido (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Medido (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Medido (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` Frío `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Medido (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` Post-Despertar** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Medido (`F_NOCACHE`)** |

El 26 de octubre de 2026, `LiquidAI/LFM3-1.7B` (`13` convoluciones cortas + `5` capas de atención de ventana deslizante + `6` capas de atención completa, `|V| = 128.000`), post-activación `AirMoL` reduce la transferencia por NVMe en `2,74×` (`25,045 GB` a `9,131 GB`) y aumenta la velocidad de decodificación en `2,49×` (`0,53` a `1,32 tok/s`) en `250,0 MB` de RAM de pesos activos (`3,79%` de FP32) con paridad sin pérdidas del `100,0%`. Nótese el equilibrio preservado en los prompts fríos no vistos de `Qwen3.5-0.8B-Base` limitados por CPU: `AirMoL` reduce las lecturas de disco NVMe (`12,674 GB` a `8,581 GB`), aunque la verificación por lotes de CPU de `4` tokens en Gated DeltaNet disminuye el rendimiento de reloj de pared (`0,32` frente a `0,53 tok/s`) hasta que la cristalización en línea de activación-a-`LUT6` eleva la aceptación a `2,74 tok/sweep` (`1,11 tok/s`).

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 Afirmación LA-8: Servidor de transmisión en vivo por CLI y HTTP/SSE (`mol_code_cli.py`)

El script `scripts/mol_code_cli.py` proporciona los backends `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` y `--air-nvme` a través de puntos de conexión CLI y SSE (`/v1/health`, `/v1/complete`, `/v1/crystallize`), avanzando la residencia de ranuras `RAMB36E2` de `438/512` a `460/512` en vivo con `26/26` pruebas superadas en `tests/`.

<div id="49-claim-la-9-frontier-sparse-moe-expert-airmol-liquidailfm25-8b-a1b-847b--qwenqwen36-35b-a3b-3466b" class="anchor-alias" aria-hidden="true"></div>

### 4.9 Afirmación LA-9: Frontier Sparse-MoE `Expert-AirMoL` (`LiquidAI/LFM2.5-8B-A1B` `8.47B` & `Qwen/Qwen3.6-35B-A3B` `34.66B`)

| Punto de control Sparse-MoE y brazo | Paridad | Expertos activos | Tok / Barrido | Lectura NVMe / Tok | Reducción E/S | RAM pico (`% FP16`) | `tok/s` | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `AirLLM` Denso 4-Bit (`T=1`) | `100%` | `100.00%` | `1.00` | `4.574 GB` | `1.00×` | `1,408.3 MB` (`8.72%`) | `0.28` | `368.80` |
| `LFM2.5-8B-A1B` · `Expert-AirLLM` (`T=1`) | `100%` | `16.93%` | `1.00` | `1.200 GB` | `3.81×` | `1,408.3 MB` (`8.72%`) | `0.58` | `181.26` |
| `LFM2.5-8B-A1B` · `Expert-AirMoL` + `PLD` | `100%` | `28.82%` | `1.78` | `0.883 GB` | `5.18×` | `1,408.3 MB` (`8.72%`) | `0.79` | `132.57` |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` Frío `LUT6`** | **`100%`** | **`33.91%`** | **`1.85`** | **`1.002 GB`** | **`4.56×`** | **`1,408.3 MB` (`8.72%`)** | **`0.72`** | **`145.42`** |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` Post-Despertar** | **`100%`** | **`36.46%`** | **`3.00`** | **`0.663 GB`** | **`6.90×`** | **`1,408.3 MB` (`8.72%`)** | **`1.10`** | **`95.67`** |
| `Qwen3.6-35B-A3B` · `AirLLM` Denso 4-Bit (`T=1`) | `100%` | `100.00%` | `1.00` | `18.159 GB` | `1.00×` | `3,214.7 MB` (`4.86%`) | `0.06` | `1,696.81` |
| `Qwen3.6-35B-A3B` · `Expert-AirLLM` (`T=1`) | `100%` | `6.35%` | `1.00` | `2.356 GB` | `7.71×` | `2,530.7 MB` (`3.83%`) | `0.22` | `471.87` |
| `Qwen3.6-35B-A3B` · `Expert-AirMoL` + `PLD` | `100%` | `11.58%` | `1.89` | `1.708 GB` | `10.63×` | `2,530.7 MB` (`3.83%`) | `0.32` | `326.24` |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` Frío `LUT6`** | **`100%`** | **`12.91%`** | **`2.00`** | **`1.722 GB`** | **`10.54×`** | **`2,530.7 MB` (`3.83%`)** | **`0.31`** | **`334.42`** |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` Post-Despertar** | **`100%`** | **`14.97%`** | **`2.57`** | **`1.477 GB`** | **`12.30×`** | **`2,530.7 MB` (`3.83%`)** | **`0.39`** | **`267.08`** |

En `Qwen/Qwen3.6-35B-A3B` (`34.66B` parámetros, `66.11 GB` FP16 fragmentado a `18.60 GB` archivos `.experts.pack4` de 4 bits; delta `PMU` de todo el sistema macOS `20,070.18 J`), el `Expert-AirMoL` post-despertar reduce la transferencia NVMe sin búfer en **`12.30×`** (`18.159` a `1.477 GB/tok`) y acelera la decodificación **`6.50×`** (`0.06` a `0.39 tok/s`) en **`2,530.7 MB`** de RAM activa (`3.83%` de FP16) al `100.0%` de paridad de token sin pérdidas.

<div id="410-claim-la-10-sub-1-bit-latent-factorization-littlebit-1--littlebit-2-vs-zero-mac-sub1bit-lut6" class="anchor-alias" aria-hidden="true"></div>

### 4.10 Afirmación LA-10: Factorización latente sub-1-bit (`LittleBit-1 / LittleBit-2`) frente a `Sub1Bit-LUT6` de MAC cero

| Método de factorización (`LFM2.5-8B-A1B` `w1 [1792, 2048]`) | Bits / Peso | Relación señal-ruido del peso | Similitud coseno | Coincidencia Top-1 en `16K` | MACs binarios / Tok | Épocas de QAT | Clase de evidencia |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` SVD sin rotación SVID (estilo PTQ de `LittleBit-1`) | `0.576` (`27.8×`) | `1.76 dB` | `0.5761` | `3.12%` | `1,981,440` | `0` (`5` en el artículo) | Medido en SW |
| `B` SVID con Procrustes `ITQ` (estilo PTQ de `LittleBit-2`) | `0.576` (`27.8×`) | `2.42 dB` | `0.6487` | `10.94%` | `1,981,440` | `0` (`5` en el artículo) | Medido en SW |
| **`C` Búsqueda en tabla `Sub1Bit-LUT6` (`0` MACs, borrador)** | **`0.576` (`27.8×`)** | **`2.42 dB`** | **`0.6487`** | **`10.94%`** | **`0`** | **`0`** | **Medido (`< 4e-6` frente a `B`)** |
| `D` Bloque-64 objetivo `INT4` de `Expert-AirMoL` | `4.500` (`3.56×`) | `20.77 dB` | `0.9958` | `82.81%` | `0` (`INT4`) | `0` | Medido en SW |
| **`E` `MoL`: borrador `Sub1Bit-LUT6` + verificación del objetivo** | **`0.576` borrador** | **`148.84 dB`** | **`1.0000`** | **`100.00%`** | **`0` MACs de borrador** | **`0`** | **Paridad sin pérdidas medida** |

<div id="411-claim-la-11-48-task-16-specifications--3-waves-late-2026-frontier-coding-bakeoff" class="anchor-alias" aria-hidden="true"></div>

### 4.11 Reclamación LA-11: `48`-tareas (`16` especificaciones × `3` ondas) concurso de codificación de frontera a finales de 2026

| Brazo del Sistema Late-2026 (`48` Tareas = `16` Especificaciones × `3` Ondas) | W1 Frío | W2 Adaptación | W3 Caliente | Aprobación Global | Commits Rotos | Participación W3 `Rung 0/1` | Llamadas `35B` | Media W1 / W3 (`ms`) | `reported_j` / Resolver (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT (`1`-Disparo) | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `22,413` / `22,708` | `8,020.13` (`32,558 est_j`) |
| `B` `LiquidAI/LFM3-1.7B` (Oct 2026 Tri-Hybrid, `1`-Disparo) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `8,460` / `9,791` | `152.77` (`957.21 est_j`) |
| `C` `google/gemma-4-E2B-it` (`2026` Hybrid, `1`-Disparo) | `37.50%` | `18.75%` | `18.75%` | `25.00%` | `75.00%` | `0.00%` | `0.0%` | `18,924` / `23,578` | `5,800.68*` (`3,700.44 est_j`) |
| `D` `LiquidAI/LFM2.5-8B-A1B` (`8.47B` MoE, `1`-Disparo) | `6.25%` | `6.25%` | `6.25%` | `6.25%` | `93.75%` | `0.00%` | `0.0%` | `53,123` / `53,885` | `33,415.04` (`47,196 est_j`) |
| `E` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (`1`-Disparo) | `81.25%` | `75.00%` | `75.00%` | `77.08%` | `22.92%` | `0.00%` | `100.0%` | `49,887` / `44,447` | `1,069.65` (`5,701.32 est_j`) |
| `F` `RouteLLM` Confidence Router (`LFM3` $\to$ `Gemma4` $\to$ `8B`) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `9,735` / `11,294` | `171.09` (`1,148.96 est_j`) |
| **`G` `MoL` `VerifiedCodeCascade` (Referencia)** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`87.50%`** | **`22.92%`** | **`116,626` / `44,052` (`2.89 ms` solved)** | **`3,655.51*` (`0.0424 J` in W3)** |

Durante el benchmark de protocolos y algoritmos de `48` tareas (aritmética serial RFC 1982, barridos de intervalos ponderados, ordenación topológica léxica segura frente a ciclos, buckets de tokens con resolución de nanosegundos, CRC-8/ATM y CRC-8 mutado con `0xFF`, desescapado `~01` de JSON Pointer según RFC 6901, Bellman-Ford acotado por saltos, medianas de ventana exactas para `>2⁵³`, Damerau-Levenshtein sin restricciones, enrutamiento Beneš `4×4`, parametrización de literales SQL, suma de subsecuencias con deque monótono, SLEB128 de DWARF, hashing consistente con SHA-256 y cuantiles conformales; variación de `PMU` de todo el sistema en macOS de `117,166.40 J` en `6,646` ticks), `VerifiedCodeCascade` alcanza un **`87.50%` (`42 / 48`)** en las tres olas, superando a `Qwen3.6-35B-A3B` independiente (`77.08%`) mientras invoca `35B` solo en el **`22.92%` (`11 / 48`)** de las tareas (`LFM3-1.7B` resuelve `7` especificaciones de la Ola 1 directamente; `Gemma-4-E2B-it` con reparación estructurada por contraejemplos resuelve `3`; `Metal-Qwen3.6-35B-A3B` resuelve `4` más la especificación mutada `W2_01`). Admite **`0.00%` de commits defectuosos** (frente a `22.92%-100.00%`), detecta ambas mutaciones adversarias de especificación de la Ola 2 mediante $C(z)$ (`16` habilidades certificadas en `artifacts/.mol_verified_skills`) y reduce la reproducción media de la Ola 3 en las **`14` soluciones cristalizadas (`87.50%`)** a **`2.89 ms`** y **`0.0424 J` de `reported_j`** (`15,401×` más rápido y `25,227×` menor `reported_j` que `35B` independiente). *(Nota al pie `*`: Una invocación de `Gemma-4` en `W2_10` experimentó un pico de `+59.2 kJ` causado por un desbordamiento del acumulador de hardware `'GPU Energy'` de `IOReport` de macOS, accesible sin privilegios. Este valor se conserva sin editar en `frontier_ai_head_to_head_bakeoff.csv` y lo filtra en ejecuciones posteriores la guarda de desbordamiento `> 450 W` de `joule_meter.py`.)*

<div id="412-claim-la-12-native-apple-metal-msl-fused-int4-sparse-moe--gateddeltanet-shaders--dual-channel-reported_j" class="anchor-alias" aria-hidden="true"></div>

### 4.12 Afirmación LA-12: Shaders nativos de Apple Metal (`MSL`) fusionados para MoE dispersa `INT4` y `GatedDeltaNet` + `reported_j` de doble canal

`src/clai/frontier/metal_moe_kernels.py` y `scripts/run_metal_moe_benchmark.py` (`artifacts/metal_moe_air_mol_speedup.csv`, `artifacts/metal_moe_air_mol_meta.json`) compilan tres núcleos `MSL` personalizados mediante `torch.mps.compile_shader`: (i) `gated_delta_recurrent_k128`, que explota la independencia exacta de columnas en $v \in \{0, \dots, V_{\text{dim}}-1\}$ del estado recurrente $\mathbf{S}[b, h_v, :, v]$ para mantener `128` elementos de estado `FP32` en registros de GPU a lo largo de todos los tokens $T$ (**`20.66×` más rápido**: `34.523` a `1.671 ms`, **`46.2×` menor `reported_j`**: `1.4989` a `0.0325 J`, `1.19 × 10⁻⁷` error máximo de estado); y (ii) `q4_moe_gate_up_silu` + `q4_moe_down_weighted`, que des cuantizan pesos de expertos `INT4` de `4.50 bpw` en bloques de 64 directamente dentro de registros `simd_sum` con cero asignaciones de pesos `FP16`/`FP32` (**`43.45×` más rápido**: `22.408` a `0.516 ms` con `28` expertos activos, **`29.8×` menor `reported_j`**: `0.3959` a `0.0133 J`, `7.2 × 10⁻⁷` error máximo `FP32`, `<= 1 ULP` `BF16`), emparejados con `pread` paralelo de profundidad de cola `8` y enrutador de anticipación de boceto de signo `BenesLUT6`:

| Punto de control de MoE dispersa y variante de motor Cold-NVMe | Paridad | Tok / Barrido | Lectura NVMe / Tok | RAM activa máxima | `tok/s` (`× PyTorch`) | `reported_j / tok` en chip (`GPU` + `CPU`) | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `1` PyTorch-Ref `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | `1,408.3 MB` | `0.394` (`1.00×`) | `10.978 J` (`5.25` + `5.73`) | `266.66` |
| `LFM2.5-8B-A1B` · `2` Metal-Fused `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | **`500.0 MB`** | `0.689` (`1.75×`) | `6.979 J` (`1.30` + `5.68`) | `152.42` |
| **`LFM2.5-8B-A1B` · `3` Metal-Fused + `BenesLUT6` (Referencia)** | **`100%`** | **`2.67`** | **`0.791 GB`** | **`500.0 MB`** | **`1.671` (`4.24×`)** | **`3.493 J` (`1.22` + `2.28`)** | **`62.85`** |
| `Qwen3.6-35B-A3B` · `1` PyTorch-Ref `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | `2,434.7 MB` | `0.191` (`1.00×`) | `20.765 J` (`8.76` + `12.00`) | `549.49` |
| `Qwen3.6-35B-A3B` · `2` Metal-Fused `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | **`970.0 MB` (`1.47%`)** | `0.241` (`1.26×`) | `15.440 J` (`3.93` + `11.51`) | `436.26` |
| **`Qwen3.6-35B-A3B` · `3` Metal-Fused + `BenesLUT6` (Referencia)** | **`100%`** | **`2.67`** | **`1.447 GB`** | **`970.0 MB` (`1.47%`)** | **`0.621` (`3.25×`)** | **`6.773 J` (`2.31` + `4.47`)** | **`169.03`** |

La eliminación del desempaquetado de expertos `FP16`/`FP32` reduce la RAM activa máxima de pesos NVMe en frío en `Qwen/Qwen3.6-35B-A3B` en **`2.51×`** hasta **`970.0 MB` (`1.47%` de `66.11 GB` FP16)** y disminuye el `reported_j / tok` de canal dual en **`3.07×`** (`20.765` a **`6.773 J/tok`**) con paridad exacta de tokens del `100.0%` (alcanzando **`15.7 tok/s`** cuando los paquetes de expertos `INT4` de `16.8 GB` permanecen anclados en memoria unificada en estaciones de trabajo de `>= 36 GiB`).

<div id="413-claim-la-13-16-task-8-multi-file-git-repositories--2-waves-swe-mini-pytest-patching-benchmark" class="anchor-alias" aria-hidden="true"></div>

### 4.13 Reclamación LA-13: `16`-task (`8` multi-file git repositories × `2` waves) `SWE-Mini` `pytest` patching benchmark

`src/clai/frontier/repo_patch_cascade.py` y `scripts/run_repo_patch_benchmark.py` (`artifacts/repo_patch_swebench_mini.csv`, `artifacts/repo_patch_swebench_mini_traces.json`) evalúan la corrección de errores en repositorios multicódigo cruzados en `8` repositorios git aislados (`billing`, `scheduler` DAG, `auth` JWT/HMAC, `wal` CRC32, `http_client` CIDR, `semver`, `ttlcache` LRU/TTL, y `etl` CSV) × `2` ondas (`16` evaluaciones, incluyendo una mutación de seguridad Wave-2 en `R03_jwt_clock_skew` que añade rechazo de `iat` futuro), donde $C(z)$ impone `tests/` idénticos a nivel de byte y ejecuta el subproceso `pytest -q`:

| Brazo de Repositorio Git Multi-Archivo (`16` Tareas = `8` Repos × `2` Ondas) | W1 Frío | W2 Caliente | Aprobación Global | Parches Rotos | W2 `.mol/` Participación de Aciertos | Media W1 / W2 (`ms`) | `reported_j` / Corrección (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (`1`-Shot Repo Patch) | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `4,943` / `5,020` | `371.61 J` (`637.68 est_j`) |
| `B` `google/gemma-4-E2B-it` (`1`-Shot Repo Patch) | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `6,865` / `7,117` | `133.48 J` (`469.79 est_j`) |
| `C` `LiquidAI/LFM2.5-8B-A1B` (`1`-Shot Repo Patch) | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `61,430` / `61,416` | `17,882.33 J` (`54,052 est_j`) |
| `D` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (`1`-Shot) | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `20,270` / `20,502` | `288.39 J` (`3,098.71 est_j`) |
| **`E` `MoL` `RepoPatchCascade` (Referencia)** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`75.00%`** | **`59,341` / `30,663` (`594 ms` `.mol/`)** | **`692.38 J` (`1.10 J` `.mol/`)** |

`RepoPatchCascade` resuelve **`87.50%` (`14 / 16`)** de los errores en repositorios multi-archivo (`+25.0` puntos porcentuales respecto a `35B` independiente y `Gemma 4`), confirma **`0.00%` parches rotos**, captura la mutación de especificación Wave-2 `R03` mediante el subproceso `pytest` $C(z)$ y recristaliza `Patch#8` (`2,905 ms`), y reproduce los `6` parches recurrentes Wave-2 `.mol/` en **`594.0 ms` (`1.10 J` `reported_j`, incluyendo `git init` + `pytest`)** frente a `38,937.5 ms` (`590.38 J` `reported_j`) en Wave 1 (**`65.6×` más rápido, `537×` menor `reported_j`**).

<div id="414-claim-la-14-drop-in-openai-v1chatcompletions-and-mcp-json-rpc-20-local-coding-agent-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.14 Afirmación LA-14: agente de programación local compatible con OpenAI (`/v1/chat/completions`) y `MCP` (`JSON-RPC 2.0`) (`mol-agent`)

`src/clai/service/openai_mcp_agent.py` y `scripts/mol_agent_server.py` (punto de entrada de la CLI `mol-agent`) exponen la cascada a herramientas de programación en el `IDE` y en la terminal (`Cursor`, `Continue.dev`, `Claude Code`, `Antigravity`, `SDK` de OpenAI), sin dependencias web de terceros. El sistema ofrece: (i) `GET /v1/models` y `POST /v1/chat/completions` compatibles con OpenAI (`stream: true/false` mediante `SSE`, cabeceras CORS, verificador determinista opcional `x_mol_contract` y `x_mol_receipt`, que informa del escalón (`rung`), `skill_id`, `est_j`, `reported_j` y `measured_j: null`); y (ii) el protocolo Model Context Protocol (`MCP` `JSON-RPC 2.0`) sobre `--mcp-stdio` y `POST /mcp`, que expone `mol_synthesize_verified_function`, `mol_repair_repo_pytest`, `mol_lookup_crystallized_skill` y `mol_energy_telemetry`, respaldados por `.mol/skills_v1.json` y `.mol/benes_lut6_router.npz` persistentes (`26 / 26` pruebas de `pytest` superadas).

<div id="415-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.15 `xck26-sfvc784-2LV-c`: desglose de primitivas de todo el subsistema, profundidad topológica y sonda de hardware de `Vivado 2026.1`

Para auditar tanto el núcleo especulativo independiente de `512` páginas (`clai_benes_paged_hotswap_core` en `hw/kv260/rtl/clai_benes_hotswap_core.sv`) como el subsistema completo Rung-0 con buses `AXI4-Lite` y `AXI4-Stream` de la Arquitectura Avanzada de Bus para Microcontroladores (`AMBA`) (`clai_kv260_axi_top` en `hw/kv260/rtl/clai_kv260_axi_top.sv`, `clai_engram_streamer.sv`, `clai_rung0_hotswap_core.sv` y `artifacts/clai_rung0_kv260.v` en el commit `a5e9bc1de280`, sin cambios en `af152ba`) frente a la parte exacta AMD Kria KV260 (`xck26-sfvc784-2LV-c`: `117,120` LUT de CLB, `234,240` biestables de CLB, `144` bloques `RAMB36E2`, `64` bloques de UltraRAM de 288 Kbit (`URAM288`), `1,248` cortes de procesamiento digital de señal (`DSP48E2`) de UltraScale+ y `189` bloques de entrada/salida de usuario (`IOB`)), se ejecutaron tres comprobaciones de hardware y de automatización del diseño electrónico (`EDA`) en una estación de trabajo con `Intel Core i9-13900H` (`Linux 7.0.0-43-generic x86-64`):

1. **Grupo de Acción de Prueba Conjunta de Solo Lectura (`JTAG`) y sonda de Bus Serie Universal (`USB`) (`Xilinx hw_server v2026.1` + Herramienta de Línea de Comandos de Software Xilinx (`XSDB`))**: Aunque `lsusb` informó de un puente Future Technology Devices International (`FTDI`) `0403:6010` (`FT2232C/D/H` receptor-transmisor asíncrono universal dual (`UART`) / first-in first-out (`FIFO`) circuito integrado (`IC`)) conectado, la inspección de las cadenas de proveedor y producto USB en el `sysfs` de Linux (`idVendor = 0403`, `idProduct = 6010`) identificó el dispositivo como `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"` en lugar de un portador Kria KV260. La consulta a `hw_server v2026.1` (Build May 29, 2026) mediante `xsdb` (`connect; jtag targets; targets`) devolvió **`0` dispositivos Xilinx `JTAG` y `0` destinos de Puerto de Acceso de Depuración (`DAP`)** (`board_metered = false`, `measured_j = None`).
2. **Síntesis por lotes y compuerta de licencia de `Vivado 2026.1` (`SW Build 6511674`)**: Se preparó un script reproducible de lotes sin proyecto de baja huella (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, orientado a `xck26-sfvc784-2LV-c` a `250.0 MHz` / `4.000 ns` en modo fuera de contexto (`OOC`)) contra `/tools/Xilinx/2026.1/Vivado/bin/vivado`. El lanzamiento de `vivado v2026.1` en modo por lotes finalizó antes de `synth_design` (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`), porque AMD `Vivado 2025.1+` / `2026.1` requiere un archivo `.lic` Standard/Enterprise generado explícitamente por el usuario (`~/.Xilinx/Xilinx.lic` o `XILINXD_LICENSE_FILE`) incluso para piezas `xck26` de nivel Standard y no se instalaron archivos `.lic` cero en la estación de trabajo. Según las reglas de medición estrictas, el `WNS` posterior al enrutamiento, la frecuencia máxima de reloj colocada y enrutada, y el `report_power` vectorless (`est_j`) permanecen registrados como `not_available` hasta que se proporcione un archivo `.lic` Standard.
3. **Descomposición primitiva completa del subsistema UltraScale+ `xcup`, presupuesto de `IOB` y auditoría topológica a nivel lógico (`Yosys 0.71+`)**: La síntesis tanto de `clai_benes_paged_hotswap_core` como de `clai_kv260_axi_top` mediante `synth_xilinx -family xcup` y `ltp -noff` (mientras se registra estrictamente el `reported_j` del paquete-0 `RAPL` del anfitrión como costo de compilación `x86-64` `EDA` $E_{\text{compile}}$, nunca como potencia de silicio de FPGA) estableció recuentos exactos de celdas y profundidades combinacionales de ruta crítica:

| `xck26-sfvc784-2LV-c` Módulo objetivo | LUTs CLB (`% xck26`) | Primitivas LUT dominantes | Registros CLB (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | Puertos superiores (`IBUF`+`OBUF`) | Profundidad combinacional (`ltp`) | Host Synth `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` páginas) | **`41,185`** (`35.17%`) | `19,982 LUT3`, `7,804 LUT6`, `7,714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36,464`** (`15.57%`) | **`81`** (`56.25%`) | **`0`** | `1,599` (`OOC` / internal bus) | **`81` niveles** | `7,297.3 J` (`144.8 s`) |
| **`clai_kv260_axi_top`** (`AXI4` subsistema Rung-0) | **`67,366`** (`57.52%`) | `25,557 LUT6`, `25,333 LUT5`, `7,918 LUT3`, `569 CARRY4` | **`16,619`** (`7.09%`) | **`4`** (`2.78%`) | **`0`** | `126` (`<= 189` `IOB`s; `PS-PL`) | **`73` niveles** | `10,089.4 J` (`214.8 s`) |

- **Confinamiento del presupuesto de pines (`OOC` frente a envoltorio `PS-PL` `AXI`)**: Dado que `clai_benes_paged_hotswap_core` expone el bus `CodeBitBus` crudo de `512` bits y vectores de configuración en sombra anchos (`1,379` búferes de entrada (`IBUF`) + `220` búferes de salida (`OBUF`) = `1,599` puertos frente a `189` `IOB` de encapsulado en `xck26-sfvc784-2LV-c`), la implementación independiente del proveedor debe ejecutarse con `synth_design -mode out_of_context` o dentro de un envoltorio `AXI4-Stream` / `zynq_ultra_ps_e` como `clai_kv260_axi_top` (`126` puertos, utilización de `LUT` del `57.52%`).
- **Profundidad combinacional sin tuberización (`81` y `73` niveles) frente al cierre a `250 MHz` (`4.000 ns`) en `-2LV`**: Aunque Verilator `5.054` verifica con exactitud de ciclo un `CPI = 1.0` (una búsqueda por ciclo de reloj), el recorrido de `17` etapas `Beneš-1` + `9` etapas de copia de prefijo + `17` etapas `Beneš-2` + multiplexación dinámica de tablas de verdad `LUT6` + reducción por mayoría de `5` votantes en un solo ciclo combinacional abarca **`81` niveles primitivos** (`73` niveles por módulo jerárquico en el popcount combinacional de `64` entradas y el comparador de margen de `8` clases de `clai_kv260_axi_top`). El cierre a `250 MHz` (`4.000 ns`) posterior a colocación y enrutamiento en silicio de baja tensión (`0.72 V`) `-2LV` favorece por tanto la inserción de etapas de registro de tuberización a lo largo de $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ y la compresión de la reducción de popcount de `64` hilos, cuantificada analíticamente en §4.16.

<div id="416-gate-level-xcup-primitive--verilator-vcd-switching-activity-datasheet-audit-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.16 Primitiva a nivel de puerta `xcup` & Auditoría de la hoja de datos de actividad de conmutación `VCD` de `Verilator` (`est_j`)

Porque AMD `Vivado 2026.1` estaba bloqueado por un archivo `.lic` ausente y `0` tableros físicos `xck26` estaban conectados (§4.15), una forma de onda pre-registrada `Verilator 5.054` `--trace` y la auditoría aplanada `Yosys 0.71+` `synth_xilinx -family xcup` (`PREREG_xck26_vcd.json`, SHA-256 `c64505d177515c47…`) extrajeron transiciones de señal exactas por ciclo de `openIE-dev/lut-adapt-ai` (`af152ba`) a través de cuatro fases operativas (`idle_quiescent`, `steady_lut6_eval_2048_cycles`, `single_cycle_page_switch_512_burst` y `shadow_page_stream_write`, `0` errores de co-simulación en `3,072` búsquedas paginadas y todos los ráfagas de paquetes `AXI4-Lite`/`AXI4-Stream`). Cada número de potencia y energía en este subsección es estrictamente una estimación analítica de conmutación dinámica (**`est_j` / `est_pJ/cycle` / `est_mW`**, **`measured_j = None`**, **`reported_j = None`**, **`board_metered = false`**), excluyendo la fuga estática del silicio y nunca sustituyendo a los informes `Vivado report_power` colocados-y-encaminados o a lecturas de riel `INA260` del KV260.

La síntesis aplanada `xcup` asigna `clai_benes_paged_hotswap_core` (`512` páginas) a **`41,623` LUTs CLB** (`35.54%` de `xck26`, frente a `41,185` jerárquicos en §4.15; `19,982 LUT3`, `7,853 LUT6`, `7,738 LUT5`, `3,380 LUT4`, `2,670 LUT2`, `36 MUXF7`, `18 MUXF8`), `36,464` `FDRE` (`15.57%`), y `81` `RAMB36E2` (`56.25%`) a través de `27,157` redes `VCD` únicas (`90,124` bits internos: `64,218` combinacionales, `20,767` secuenciales), y asigna `clai_kv260_axi_top` a **`66,881` LUTs CLB** (`57.10%` de `xck26`, frente a `67,366` jerárquicos en §4.15; `25,402 LUT6`, `25,313 LUT5`, `7,909 LUT3`, `5,303 LUT4`, `2,879 LUT2`, `75 LUT1`, `569 CARRY4` $\equiv$ `285 CARRY8`), `16,619` `FDRE`/`FDSE` (`7.09%`), y `4` `RAMB36E2` (`2.78%`) a través de `3,825` redes `VCD` únicas (`128,486` bits internos: `108,582` combinacionales, `19,901` secuenciales). La energía de conmutación dinámica a `VCCINT = 0.72 V` (`xck26-sfvc784-2LV-c`, `250.0 MHz`, límites AMD DS925 / XPE 16 nm FinFET `[low, nom, high]`) modela lógica conmutada + nodos de interconexión local a $C_{\text{node}} = [2.6, 4.5, 7.2]\text{ fF}$ ($\frac{1}{2} C V^2 = [0.674, 1.166, 1.866]\text{ fJ/transition}$, ponderado por `2.02` primitivas `xcup` por bit combinacional `VCD` en el núcleo Beneš), pines de reloj de `FDRE`/`FDSE` a `[1.5, 2.2, 3.0] fF` (`2` flancos/ciclo = `1.141 fJ/FF/cycle` nominal) más `[3.5, 5.5, 8.0] fF` por transición `Q`, y `RAMB36E2` (`SDP` `64b`/`72b`) a `[2.90, 3.80, 4.80] pJ` por lectura de dirección variable, `[1.90, 2.47, 3.12] pJ` por ciclo habilitado de dirección constante (`ENARDEN = 1`, $\alpha_{\text{addr}} = 0$), `[3.30, 4.30, 5.40] pJ` por escritura, y `[0.04, 0.08, 0.14] pJ/cycle` cuando está deshabilitado (`EN = 0`).

| Módulo objetivo y carga de trabajo `VCD` (`250 MHz`, `0.72 V`) | Ciclos | Transiciones combinacionales / Ciclo ($\alpha_{\text{comb}}$) | Transiciones secuenciales / Ciclo ($\alpha_{\text{seq}}$) | Uso `RAMB36E2` (`Rd` / `Wr`) | Dinámico `est_pJ / ciclo` | Dinámico `est_mW` (`[bajo, alto]`) |
| :--- | ---: | ---: | ---: | :---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** · `idle_quiescent` | `256` | `0.00` (`0.0000`) | `0.00` (`0.0000`) | `100.0%` const-addr / `0%` | **`241.66`** (`53.74` CE-gated) | **`60.41`** (`[47.25, 76.21]`; `13.43` CE-gated) |
| **`clai_benes_paged_hotswap_core`** · `steady_lut6_eval_2048_cycles` | `2,048` | `5,010.21` (`0.0780`) | `90.97` (`0.0044`) | `100.0%` activo / `0%` | **`361.68`** | **`90.42`** (`[69.29, 116.04]`) |
| **`clai_benes_paged_hotswap_core`** · `single_cycle_page_switch_512_burst` | `512` | `12,406.84` (`0.1932`) | `269.46` (`0.0130`) | `100.0%` activo / `0%` | **`380.07`** | **`95.02`** (`[72.58, 122.60]`) |
| **`clai_benes_paged_hotswap_core`** · `shadow_page_stream_write` | `512` | `1,987.31` (`0.0310`) | `74.47` (`0.0036`) | `100.0%` rd / `1.23%` wr (`1/81`) | **`358.86`** | **`89.72`** (`[68.82, 114.89]`) |
| **`clai_kv260_axi_top`** · `idle_quiescent` | `256` | `0.00` (`0.0000`) | `0.00` (`0.0000`) | `0.0%` (`EN = 0`) / `0%` | **`19.55`** | **`4.89`** (`[3.26, 6.66]`) |
| **`clai_kv260_axi_top`** · `steady_lut6_eval_2048_cycles` | `2,048` | `120.31` (`0.0011`) | `15.27` (`0.0008`) | `3.12%` rd / `0%` | **`20.40`** | **`5.10`** (`[5.04, 5.18]`) |
| **`clai_kv260_axi_top`** · `single_cycle_page_switch_512_burst` | `512` | `325.21` (`0.0030`) | `25.56` (`0.0013`) | `11.13%` rd / `0%` | **`22.07`** | **`5.52`** (`[5.34, 5.75]`) |
| **`clai_kv260_axi_top`** · `shadow_page_stream_write` | `512` | `31.95` (`0.0003`) | `71.92` (`0.0036`) | `0.0%` rd / `8.20%` wr | **`21.80`** | **`5.45`** (`[5.30, 5.64]`) |

Tres hallazgos de diseño de hardware se derivan directamente de la descomposición de actividad `VCD` y del modelo de retardo `DS925`:

1. **Precarga inactiva incondicional de `ENARDEN` en `RAMB36E2` (`82.8%` de la potencia quiescente del núcleo) y reducción `4.50×` por `CE`-gating**: Aunque `clai_benes_paged_hotswap_core` presenta `0.00` transiciones de datos/ciclo en reposo, `clai_uram_lut6_page_cache` fija `ENARDEN = 1'b1` de forma continua en los `81` bloques `RAMB36E2`, lo que consume `200.07 est_pJ/cycle` (`50.02 est_mW`) en precarga de líneas de bit, junto con `41.59 est_pJ/cycle` (`10.40 est_mW`) en las hojas de reloj `FDRE` (**`60.41 est_mW`** en estado quiescente). En cambio, `clai_engram_streamer`, dentro de `clai_kv260_axi_top`, aplica gating a sus `4` bloques `RAMB36E2` mediante `accept_byte && s_axis_tlast`, de modo que en reposo consume **`4.89 est_mW`** (`19.55 est_pJ/cycle`) y, durante la inferencia continua de paquetes `AXI4-Stream` de `31` bytes (con `core_bus_reg` cargado una vez por paquete, $\alpha_{\text{comb}} = 0.0011$), consume **`5.10 est_mW`**. Aplicar gating a `ENARDEN` de `clai_uram_lut6_page_cache` con `bus_valid` reduce la potencia dinámica quiescente del núcleo paginado **`4.50×`, hasta `13.43 est_mW` (`53.74 est_pJ/cycle`)**, sin penalización de latencia.
2. **Amplificación de conmutación combinacional por Beneš (`2.48×`) frente a la potencia activa dominada por `RAMB36E2` (`+5.1%`)**: Cambiar `page_id` en las `512` ranuras en ciclos de reloj consecutivos (`single_cycle_page_switch_512_burst`) lleva simultáneamente `81 × 64 = 5,184` líneas de bit `INIT` de `LUT6` a los árboles selectores, lo que eleva las transiciones combinacionales `2.48×` (de `5,010.2` a `12,406.8` transiciones/ciclo, de `11.80` a `29.22 est_pJ/cycle`). Sin embargo, la potencia dinámica total del núcleo paginado solo aumenta en `+4.60 est_mW` (de `90.42` a `95.02 est_mW`, `+5.1%`), porque las `81` lecturas de amplificadores de detección de `RAMB36E2` (`307.80 est_pJ/cycle`) representan entre el `85.1%` y el `80.9%` de la energía dinámica activa (`358.86 est_pJ/cycle` / `89.72 est_mW` durante la escritura concurrente `shadow_page_stream_write`).
3. **Auditoría de la ruta crítica aplanada (`81` y `162` niveles `ltp`) y presupuesto analítico de retardo por etapa con `DS925` `-2LV`**: Aplicando los retardos de primitivas de `AMD DS925` (`xck26-2LV`, `0.72 V`: `T_ILO = 0.068 ns`, `T_CKO = 0.148 ns`, y `T_RCKO_DO = 1.390 ns` sin pipeline de `RAMB36E2` frente a `0.610 ns` con `DOA_REG = 1`, más un presupuesto de interconexión de `[0.140, 0.220] ns/nivel`), la ruta sin pipeline de `81` niveles de `clai_benes_paged_hotswap_core` se sitúa en **`18.76-24.83 est_ns`** (`40.3-53.3 MHz` de `est_Fmax` analítica). Al aplanar `clai_kv260_axi_top` a través de los límites de módulo (`ltp -noff` tras `-flatten`, frente a `73` niveles por módulo jerárquico en §4.15), aparece una ruta de **`162` niveles** (**`34.77-46.92 est_ns`**, `21.3-28.8 MHz`) que va desde `core_bus_reg` hasta `clai_rung0_core` (`artifacts/clai_rung0_kv260.v`) y su cadena de sumadores serie desenrollada de `64` pasos `pop_acc`. Si se habilita `DOA_REG = 1` en `RAMB36E2`, se insertan `4`-`5` cortes de registros de pipeline (`<= 18` niveles lógicos por etapa) y se sustituye el bucle serie de popcount de `64` entradas por un compresor de `6` niveles basado en `LUT6`/Wallace, el retardo analítico por etapa baja de **`3.7 est_ns` (`<= 4.000 ns` a `250 MHz`)** con `CPI = 1.0` (`not` cierre de temporización post-PAR de Vivado).

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Trabajos relacionados y observaciones de convergencia

| Sistema | ID / Foro | Qué establece | Coste según se reporta | Diferencia en esta referencia |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Capas neuronales cuantizadas y dispersas compiladas en LUT de FPGA. | Síntesis de LUT y Fmax en FPGA. | El cableado estático requiere un re-PAR de Vivado ante un desplazamiento, frente a la malla Beneš de `1` ciclo + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) y **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Redes diferenciables de compuertas booleanas y redes LUT sin pesos. | Número de compuertas y precisión. | El enrutamiento estático cae a `52.34%` ante un desplazamiento de VLAN y sufre quimeras marginales en los planos de bits. |
| **T-MAC** (Wei et al., 2024) y **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Productos matriciales ternarios o de bajo bit mediante búsqueda en tablas en CPU/FPGA. | Latencia y potencia en FPGA. | Acelera el álgebra lineal dentro de una marcha del modelo; no evita la invocación del modelo. |
| **LittleBit** (Lee et al., 2025) y **LittleBit-2** (Lee and Kim, 2026) | `arXiv:2506.13771` · `arXiv:2603.00042` | Factorización latente binaria de subbit (`0.1-0.58` bits/peso) mediante `SVD` / `ITQ` + QAT de `5` épocas. | Compresión (`11.6×-31×`), PPL y precisión tras QAT. | Desempaqueta los bitpacks a MAC binarios densos en tiempo de ejecución y cae a `0.00%` en la codificación exacta (`Claim LA-11`); `Sub1Bit-LUT6` usa `0` MAC binarios y `MoL` restaura una paridad de `100.0%` en `0` épocas de QAT. |
| **FrugalGPT** (Chen et al., 2023) y **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Cascadas de LLM de débil a fuerte y enrutadores basados en preferencias. | Precio en dólares de la API frente a calidad. | Carece de una compuerta determinista $C(z)$ (`68.75%` de commits rotos en `Claim LA-11`) y no dispone de un compilador descendente a `LUT6`. |
| **GreenServ** (2026) y **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Enrutamiento por bandidos entre múltiples LLM y servicio con escalado de frecuencia. | Wh de GPU según los autores (`Zeus` / `pyNVML`). | Optimiza el servicio en GPU; esta referencia compila las activaciones en `LUT6` de `0` FLOP y en páginas canónicas de habilidades (`reported_j` / `est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Redactores especulativos basados en MLP neuronal, en árbol de borradores y en cascada. | Aceleración de tiempo real (wall-clock). | Requieren FLOP y lecturas de pesos para el borrador, frente a las páginas `LUT6` de `uint64` con `0` FLOP. |
| **PLD** (Saxena, 2023) y **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Redactores sin FLOP basados en n-gramas del prompt y en tries de sufijos de un almacén de datos. | Aceleración de latencia (`0` FLOP). | `PLD` no detecta tokens fuera del prompt; `REST` usa tries de tamaño variable frente a las páginas `RAMB36E2`. |
| **AirLLM** (lyogavin, 2023) | Transmisor open-source desde SSD | Transmisión de pesos desde SSD capa por capa con poca RAM. | Huella activa de RAM. | `T=1` puro (`1.0 tok/sweep`) + desbordamiento de KV, frente a la reducción de E/S de `AirMoL` de `2.74×-12.30×` y `970 MB` de RAM `INT4` en Metal. |
| **Metered Commit Gates** y **RCE-JEPA** `[misma casa]` | `/papers/gates/` · `/papers/rce-jepa/` | Compuertas de commit (lectura de `11,428 pJ` del SOM KV260 con `INA260`), $p_i/c_i$ de MoL y `RCE-JEPA`. | `measured_j` del SOM KV260 + `reported_j` / `est_j`. | Base de la misma casa; aquí se amplía con la compilación descendente Beneš a `LUT6`, `Expert-AirMoL` en Metal y `mol-agent`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. Límites, amenazas a la validez, no reclamados y falsificadores

**Validez interna y de constructo.** Bajo ruido aleatorio uniforme o con rotación adversarial por paso ($\Delta T = 1$), la Proposición 1 no produce ahorros de compilación descendente y recae en `1.00 tok/sweep`. La paridad sin pérdida (`100.0%`) garantiza concordancia bit a bit con la decodificación greedy del modelo objetivo, pero no eleva el techo de capacidad de un punto de control base de `350M` u `0.8B`.

**Validez de la medición y no reivindicado.** Los números analíticos de julios y potencia de conmutación (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`, y los límites `est_pJ/cycle` y `est_mW` de `Verilator` `VCD` + `AMD DS925` a `0.72 V` en §4.16), las lecturas de contadores del sistema operativo o en chip (`reported_j` de Apple Silicon `L2` `libIOReport` `'GPU Energy'` + `L3` `proc_pid_rusage` `ri_energy_nj`, más un filtro de desbordamiento de registros estrechos `> 450 W` documentado en `Claim LA-11`), y los deltas acumulativos de `PMU` de macOS de máquina completa se mantienen estrictamente separados de las mediciones físicas de rieles (`measured_j = None`). Yosys `0.71+` y Verilator `5.054` establecen la síntesis de netlist estructural `xck26`, la simulación de ciclo con `CPI = 1` y la conmutación dinámica de tasa de toggles `est_mW` por `VCD` (excluyendo la fuga estática), no el cierre de temporización post-PAR de Vivado a `250 MHz` ni los vatios de riel físico de KV260 (`board_metered = false`). El liderazgo energético del silicio, la promoción de salidas `ModelGenerated` a `Deterministic`, la evaluación completa de contenedor `SWE-bench Verified` de `500` tareas más allá del benchmark contractual de `48` tareas (`Claim LA-11`) y el benchmark `SWE-Mini` `pytest` de repositorio git multifichero de `16` tareas (`Claim LA-13`), y las ejecuciones medidas de `70B` (el archivo `air_mol_nvme_baselines.csv` informa proyecciones analíticas de `70B` más allá de las ejecuciones medidas de `34.66B` de `Qwen3.6-35B-A3B`) no se reivindican.

| ID | Afirmación | Refutación exacta / condición de falsación |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` falla con una paridad de Verilator del `100.0%` en `5,120` paquetes o no detecta el desplazamiento VLAN del paquete `2,500`. |
| **`LA-F2`** | `Claim LA-2` (Polyglot suite) | Zig asigna `> 0` bytes de heap en el bucle caliente, Go reporta `> 0 allocs/op`, o el error de FD de Julia Enzyme supera `1e-7`. |
| **`LA-F3`** | `Claim LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` supera `117,120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s o `1` ciclo por cambio de página. |
| **`LA-F4`** | `Claim LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` supera el riesgo falso objetivo $\alpha = 0.02$ en tráfico desplazado o se etiqueta como `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Byte speculation) | `scripts/run_code_corpus_benchmark.py` produce `< 100.0%` de paridad exacta de bytes frente al `Mamba3CodeLM` greedy en `48` prompts no vistos. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` bajo `F_NOCACHE` no alcanza `100%` de paridad o lee más bytes de NVMe que `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Claim LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`, `scripts/run_hf_air_mol_pretrained.py` o `scripts/run_hf_qwen35_air_mol.py` diverge en $\ge 1$ token BPE del objetivo greedy. |
| **`LA-F8`** | `Claim LA-8` (Regression suite) | `pytest -v` falla en cualquiera de los `26` tests de `tests/`. |
| **`LA-F9`** | `Claim LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` diverge de la paridad de tokens del `100%` o lee más bytes de NVMe que `AirLLM` o `Expert-AirLLM`. |
| **`LA-F10`** | `Claim LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` supera un error máximo de `1e-3` frente a la multiplicación matricial binaria densa `ITQ` o no alcanza `100%` de paridad verificada. |
| **`LA-F11`** | `Claim LA-11` (`48`-Task Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` admite `> 0%` de commits rotos o admite una skill obsoleta de Wave-1 bajo una mutación de especificación de Wave-2. |
| **`LA-F12`** | `Claim LA-12` (Metal `INT4` MoE) | `scripts/run_metal_moe_benchmark.py` supera un error del shader `FP32` de `1e-4` o diverge de la paridad de tokens greedy del `100%` en `8.5B` o `35B`. |
| **`LA-F13`** | `Claim LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` admite `> 0%` de parches rotos, altera `tests/` o no detecta la mutación de especificación `R03` de Wave-2. |
| **`LA-F14`** | `Claim LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` falla en OpenAI REST/SSE, en `JSON-RPC 2.0` de `MCP`, en la recarga de `.mol/` o etiqueta `measured_j`. |

---

<div id="7-references" class="anchor-alias" aria-hidden="true"></div>

## 7. Referencias

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

## Apéndice A. Reproducibilidad

A partir de una copia de trabajo de [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit af152ba`):

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
PYTHONPATH=src .venv/bin/python scripts/run_metal_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
PYTHONPATH=src .venv/bin/python scripts/run_repo_patch_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/mol_agent_server.py --host 127.0.0.1 --port 8090 --mol-dir .mol
```
