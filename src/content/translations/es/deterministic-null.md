---
title: "Nulo determinista: un experimento de control prerregistrado para sustratos neuronales y agénticos"
deck: "Un bucle de casos de enteros de 64 bits con cero llamadas a modelo (Shape D: N0 estricto y N1 cristalizado en dev) implementado en Rust, Go, Python, C++20 y Julia, bloqueado bajo pruebas de calendario de Bitcoin de OpenTimestamps antes de las rondas de aleatoriedad drand de League of Entropy, y comparado frente a modelos de lenguaje de frontera en la nube y locales de pesos abiertos a lo largo de 4,030 instancias reservadas y 6 repositorios multiarchivo. Los contadores en chip IOReport de Apple Silicon y rusage del núcleo se registran como reported_j; no se conectó ningún monitor externo de julios de toma de pared ni de riel de alimentación (board_metered es false; measured_j no está definido)."
lang: "es"
source: "deterministic-null"
complete: true
---

<div id="deterministic-null-a-pre-registered-control-experiment-for-neural-and-agentic-substrates" class="anchor-alias" aria-hidden="true"></div>

*Revisión 7eb0ad5, 22 de noviembre de 2026. Resumen de datos y resúmenes criptográficos: [/data/#deterministic-null](/data/#deterministic-null). Figuras interactivas dinámicas: [/living/deterministic-null/](/living/deterministic-null/). Gemelo de archivo en LaTeX: [/pdfs/latex/deterministic-null.pdf](/pdfs/latex/deterministic-null.pdf) ([fuente](/pdfs/latex/deterministic-null.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Panorama general

Las evaluaciones empíricas de la inteligencia artificial agéntica comparan de manera rutinaria un modelo de lenguaje estocástico frente a otro, dejando sin medir qué proporción de la finalización de la tarea exige un sustrato neuronal en el momento de la decisión en lugar de un procedimiento fijo sobre enteros aplicado a un almacén explícito de casos previos verificados. Este estudio construye, congela y audita ese control ausente, el **Nulo determinista (`Shape D`)**, y somete a prueba la hipótesis nula por clase $H_{0,k}: \Delta_k = p_{\text{model},k} - p_{\text{null},k} \le \delta$ con un margen $\delta = 0.05$ (`5.0` puntos porcentuales) a través de dos experimentos confirmatorios prerregistrados criptográficamente (`4,030` instancias reservadas totales posteriores al faro de aleatoriedad) y un estudio multiturno de reparación de errores en repositorios (`6` repositorios multiarchivo en Python). Los contadores locales de energía del Apple M5 Max (`IOReport` y `proc_pid_rusage`) se registran como valores `reported_j` del sistema operativo y en chip; la energía de servidores remotos de modelos cerrados se registra estrictamente como `not_available`; no se conectó ningún medidor físico de potencia en rieles de hardware ni en toma de pared (`board_metered = false`, `measured_j = None`).

**En palabras sencillas**

1. La mayoría de los bancos de pruebas de agentes comparan el modelo A con el modelo B sin preguntar cuánto resuelve ya un bucle de búsqueda con cero llamadas a modelo sobre ejemplos previos verificados.
2. A lo largo de `2,840` instancias extraídas de familias acotadas algebraicas, de demostración formal y de transacciones estructuradas (`exp-001`, Track-A), una tabla congelada de casos en enteros (`0` llamadas a modelo en el momento de la decisión) iguala a los modelos de frontera en la nube en `9` de `10` celdas de clase y nivel, fallando únicamente en `12` modismos de clientes en texto libre no indexados (`+36.40` puntos porcentuales a favor de `Claude Opus 5.5`).
3. A lo largo de `1,190` instancias únicas procedentes de bancos de pruebas públicos de autoría externa (`exp-002`, Track-B: Berkeley Function-Calling Leaderboard `v3`, Sierra `tau-bench` Retail, `BigCodeBench v0.1.3` y `SWE` (ingeniería de software)-bench Verified) más `6` repositorios multiarchivo no vistos, la síntesis neuronal aporta entre `+52.80` y `+95.00` puntos porcentuales allí donde la masa de claves no vistas permanece alta; sin embargo, en fórmulas únicas de `3-satisfiability` (3-satisfacibilidad) en transición de fase, los modelos de lenguaje de un solo turno se desploman (`0.0%-5.2%`) por debajo tanto de la tabla acotada de enteros (`69.6%`) como del aprendizaje de cláusulas dirigido por conflictos autónomo con verificación clausal de pruebas (`100.0%`), y bajo flujos recurrentes de ley de Zipf la cristalización en línea reduce las llamadas a modelo y la energía en `3.59×` sin perder finalización de la tarea.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Términos, siglas y etiquetas de medición

<ul id="terms">
<li>AI, ML, LLM, LLMs, MoE, E4B, A3B: inteligencia artificial, aprendizaje automático, modelo(s) grande(s) de lenguaje, mezcla de expertos (Mixture-of-Experts), arquitectura efectiva de 4 mil millones de parámetros y enrutamiento activo de 3 mil millones de parámetros</li>
<li>OBSERVE, REDUCE, FUZZ, LOOKUP, ACT, VERIFY, MUTATE, WRITE: los ocho pasos secuenciales del bucle de decisión en enteros del Nulo determinista (Deterministic Null)</li>
<li>SATB, SUT, SUTs, PFRK, TH2, DOSSIER: contrato del arnés del banco de pruebas de saciedad (Satiation Benchmark), sistema(s) bajo prueba, resultados cuádruples de intento (aprobado pass, fallido fail, rechazo refuse, terminado killed), amenaza de equipo rojo 2 (ausencia de solucionador oculto dentro de las primitivas de acción) y expediente del estado de la técnica y revisión de equipo rojo del proyecto</li>
<li>DNULLMM1, FT, LCB: formato binario de índice de almacén proyectado en memoria, tabla de funciones por clase y cota inferior de confianza de Hoeffding</li>
<li>DRAT, RUP, CDCL, CNF, SAT, UNSAT: tautología asimétrica de resolución con eliminación, propagación unitaria inversa, aprendizaje de cláusulas dirigido por conflictos, forma normal conjuntiva, satisfacible e insatisfacible</li>
<li>BV, AST, XOR, IEEE, UC: vector de bits modular de ancho fijo, árbol de sintaxis abstracta, disyunción exclusiva bit a bit, Instituto de Ingenieros Eléctricos y Electrónicos (estándar de coma flotante IEEE-754) y Universidad de California</li>
<li>BFCL, BCB, SWE, SQL, DB, SAVEPOINT: clasificación de llamadas a funciones de Berkeley (Berkeley Function-Calling Leaderboard), BigCodeBench, prefijo de bancos de pruebas de ingeniería de software, lenguaje de consulta estructurado, base de datos relacional y punto de control de reversión transaccional</li>
<li>API, CLI, MCP, HTTP, JSON, JSONL, UTF: interfaz de programación de aplicaciones, interfaz de línea de comandos, protocolo de contexto de modelo (Model Context Protocol), protocolo de transferencia de hipertexto, notación de objetos de JavaScript, JSON delimitado por líneas y formato de transformación Unicode</li>
<li>POSIX, MMAP, SHA, OTS: interfaz de sistema operativo portable, entrada/salida de archivos proyectados en memoria, algoritmo de resumen seguro (SHA-256) y prueba de calendario de Bitcoin de OpenTimestamps</li>
<li>BCa, CI, CIs, UCL: bootstrap con corrección de sesgo y aceleración, intervalo(s) de confianza y límite superior de confianza de Wilson</li>
<li>CPU, GPU, ANE, SoC, PID, OS, RAM, DRAM, NVMe, PSU, AC: unidad central de procesamiento, unidad de procesamiento gráfico, Apple Neural Engine, sistema en chip, identificador de proceso, sistema operativo, memoria de acceso aleatorio, RAM dinámica, Non-Volatile Memory Express, fuente de alimentación y corriente alterna de toma de pared</li>
<li>RAPL, NVML, KV, GGUF, RPM, RPD, USD, EDA: límite de potencia media en ejecución de Intel (Intel Running Average Power Limit), biblioteca de gestión de NVIDIA, caché clave-valor, pesos cuantizados en formato unificado generado por GPT, solicitudes por minuto, solicitudes por día, dólares estadounidenses y automatización de diseño electrónico</li>
<li>RCE, MoL, WCA, JEPA, LUT6: Reality Code Engine [mismo grupo], Mixture of Limits (mezcla de límites) [mismo grupo], Wise Computer Automation [mismo grupo], arquitectura predictiva de incrustación conjunta (Joint-Embedding Predictive Architecture) y tabla de búsqueda booleana de 6 entradas</li>
</ul>

A lo largo de los niveles de telemetría L0 a L4, cuatro clases de medición se mantienen estrictamente separadas en todas las tablas y figuras de este estudio:

| Etiqueta de medición | Significado en este estudio |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** (Exacto: L4 lógico y criptográfico) | Resúmenes criptográficos idénticos bit a bit del almacén en coma fija de 64 bits (`SHA-256`), pruebas de calendario `.ots` de OpenTimestamps, rondas del faro `drand` de League of Entropy, conteos de tokens y llamadas capturados por `satb-proxy`, y dólares estadounidenses (`USD`) a precio de lista fechado de la API. |
| **`Reported (reported_j: L2 & L3 Counters)`** (Reportado: contadores L2 y L3) | Julios por ventana en chip de Apple Silicon mediante `IOReport` sin privilegios de superusuario (`macmon`, nivel de telemetría `L2`, etiqueta de anfitrión compartido `A2`) y energía del núcleo de macOS por `PID` `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3`, etiqueta `D`). No es un medidor físico sobre riel de hardware (`measured_j = None`, `board_metered = false`). |
| **`Not Available (label N)`** (No disponible: etiqueta N) | Energía en servidores remotos de API cerradas (`Claude Opus 5.5`, `Claude Sonnet 5.5`, `Gemini 2.5 Flash`) y energía de corriente alterna en toma de pared `L0`. Jamás se sustituyen medianas de flota ni multiplicadores bibliográficos en los recibos. |
| **`Invalidated Derived (Falsifier 6)`** (Derivado invalidado: Falsador 6) | La sustracción neta sobre el reposo (`derived_marginal_j`) se descarta automáticamente siempre que los procesos cohabitantes en el anfitrión compartido induzcan una deriva de línea base en reposo anterior/posterior `> 5.0%` en los niveles de telemetría L0 a L4, preservando intactos los contadores brutos `reported_j`. |

<div id="11-lineage-prior-art-boundaries-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Linaje, fronteras frente al estado de la técnica y declaración del mismo grupo

No se reclama novedad alguna sobre el bucle de decisión en sí mismo. Los ciclos basados en casos de recuperación-reutilización-revisión-retención se remontan a Stanfill y Waltz (1986) y a Aamodt y Plaza (1994); el equilibrado tabular de péndulo invertido se remonta a Michie y Chambers (1968); las tablas de reglas difusas se remontan a Mamdani y Assilian (1975) y a Wang y Mendel (1992); el registro de pruebas de satisfacibilidad mediante `RUP/DRAT` se remonta a Goldberg y Novikov (2003) y a Wetzler, Heule y Hunt (2014). Los trabajos previos de Open Interface Engineering ([Compuertas de confirmación medidas](/papers/gates/), [Saciedad de la tarea frente al rebote agregado en la demanda de IA](/papers/satiation/), [El Reality Code Engine](/papers/rce/) y [Compilación descendente a LUT6](/papers/lut-adapt/)) son estudios compañeros del mismo grupo (`[same house]`) citados como contexto arquitectónico, nunca como confirmación independiente.

Una auditoría del estado de la técnica sobre 69 fuentes y una revisión de equipo rojo con 36 hallazgos (`docs/DOSSIER.md`) establecieron una brecha específica en la literatura de evaluación de agentes de 2024-2026: los bancos de pruebas de agentes existentes omiten de forma abrumadora los controles no neuronales, las líneas base no neuronales existentes carecen de congelaciones prerregistradas de almacenes sobre conjuntos reservados y los estudios energéticos existentes sobre agentes basados en modelos de lenguaje no incluyen ningún brazo de control con cero llamadas a modelo en el mismo anfitrión.

<figure class="my-8">
  <img src="/figures/deterministic-null/dnull-control-protocol.svg" alt="Bloqueo previo al faro en cuatro etapas del Nulo determinista (Deterministic Null) y protocolo de evaluación pareada." />
  <figcaption>Figura 1. Prerregistro previo al faro (<code>Gate G1</code> + OpenTimestamps + <code>drand</code>) y protocolo de evaluación pareada entre <code>Shape D</code> (<code>N0</code>, <code>N1</code>) y los sustratos neuronales (<code>B3</code>, <code>B6</code>, <code>Shape H</code>). Diagrama de protocolo, no lectura de un riel físico de hardware.</figcaption>
</figure>

---

<div id="2-machine-specification-arms-and-five-language-conformance" class="anchor-alias" aria-hidden="true"></div>

## 2. Especificación de máquina, brazos experimentales y conformidad en cinco lenguajes

<div id="21-the-eight-step-integer-loop-and-complexity-caps" class="anchor-alias" aria-hidden="true"></div>

### 2.1 El bucle de ocho pasos en enteros y los topes de complejidad

Todo brazo nulo `Shape D` ejecuta un bucle de ocho pasos sobre enteros con signo de 64 bits (escalado de coma fija `Q = 1,000,000`, cero instrucciones de coma flotante IEEE-754, cero llamadas neuronales en el momento de la decisión):

$$\texttt{OBSERVE} \;\to\; \texttt{REDUCE} \;\to\; \texttt{FUZZ} \;\to\; \texttt{LOOKUP} \;\to\; \texttt{ACT} \;\to\; \texttt{VERIFY} \;\to\; \texttt{MUTATE} \;\to\; \texttt{WRITE}.$$

Durante la construcción en `dev`, `WRITE` añade registros verificados (`src` etiquetado como `lit:`, `human:`, `mut:` o `llm:`) a un registro canónico `JSONL` y compila una tabla hash binaria de direccionamiento abierto mediante `POSIX mmap` sin copia (`DNULLMM1`: cabecera de 64 bytes más ranuras de 48 bytes). Antes de la evaluación en `test`, el almacén se congela en modo de solo lectura mediante resumen `SHA-256`; `VERIFY`, `MUTATE` y `WRITE` ejecutan cero actualizaciones en tiempo de prueba, y se comprueba que los resúmenes anterior y posterior del almacén sean idénticos byte a byte. Para impedir que se introduzca subrepticiamente un solucionador general dentro del código específico de cada clase (`TH2`), la tabla de funciones de cada clase (`REDUCE` + `ACT`) está limitada a `<= 4,096` bytes comprimidos con gzip y `<= 50,000` operaciones primitivas por llamada (`S-3`), y no se permite ningún reductor aprendido de lenguaje natural (`S-4`).

<div id="22-operational-permutations-under-comparison" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Permutaciones operativas bajo comparación

| Brazo | Definición | Llamadas a LLM en decisión | Procedencia de construcción |
| :--- | :--- | :--- | :--- |
| **`B0` (Piso)** | Emite incondicionalmente la acción predeterminada de la clase; impone la compuerta de sensibilidad de ensayo en prueba $> 2\delta$ (`10.0` puntos porcentuales). | `0` | Ninguna |
| **`B1` (Clásico)** | Solucionador deductivo autónomo sin almacén de casos (`CDCL+DRAT`, Houdini por espacio nulo de trazas, Buchberger Gröbner racional). | `0` | Algoritmo clásico |
| **`B2` (Solo semilla)** | Almacén sembrado a partir de la literatura con la mutación en `dev` desactivada. | `0` | Solo `lit:` |
| **`N0` (Nulo estricto)** | Bucle fijo de enteros llenado en `dev` con cero registros, reparaciones o código por clase derivados de modelos (`0` entradas con procedencia `llm:`). | `0` | `lit:`, `human:`, `mut:` |
| **`N1` (Nulo primario)** | Bucle fijo de enteros llenado en `dev` que admite entradas verificadas de cualquier procedencia, cargando todas las llamadas a modelo en `dev` a $C_{N1}$. | `0` | Cualquiera verificada (cargada a `C_N1`) |
| **`B5` (`code-once`)** | Un LLM de frontera redacta una sola vez una política determinista en Python a partir de las especificaciones `dev`; se congela antes de que exista `test_seed`. | `0` | `1` llamada a LLM en `dev` / clase |
| **`B3` (Frontera en la nube)** | Evaluación por instancia con modelos en la nube (`Claude Opus 5.5` primario, `Claude Sonnet 5.5` secundario, sonda `Gemini 2.5 Flash`). | `>= 1` / instancia | API preentrenada en la nube |
| **`B6` (Local de pesos abiertos)** | Inferencia local en el mismo anfitrión (`Alibaba Qwen 3.6 35B-A3B` y `Google Gemma 4 E4B-it` mediante `llama-server` sobre la GPU Metal del Apple M5 Max). | `>= 1` / instancia | `reported_j` local |
| **`Shape H` (Caja de arnés)** | CLI externo `Claude Code 2.1.330` dentro de `/work` con `--strict-mcp-config` enrutado al 100% a través de `satb-proxy`. | Multiturno | Somete a prueba el piso de `Lane B` (Falsador 8) |

<div id="23-gate-g2-five-language-conformance-and-positive-controls" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Conformidad en cinco lenguajes de Gate G2 y controles positivos

Vectores patrón independientes generados mediante `/usr/bin/bc` y `openssl` verifican la concordancia exacta bit a bit en cinco lenguajes (`Gate G2`), junto con tres controles positivos segregados (`ctl.setpoint`: `B0 = 0.110 -> N0 = 1.000`; `ctl.mamdani`: `B0 = 0.525 -> N0 = 1.000`; `ctl.cartpole`: `B0 = 0.000 -> N0 = 0.805`, excluidos de toda afirmación relativa a agentes):

| Implementación | Resumen `SHA-256` del almacén congelado | Montaje `DNULLMM1` de `1M` registros | Latencia media de sondeo | Suma de verificación de `10k` sondeos |
| :--- | :--- | ---: | ---: | ---: |
| **Rust** (Referencia + `SATB`) | `0da4df8d9ccbce1e...4485781` | `44.67 µs` | `582.57 ns` | `15027705736` |
| **C++20** (`clang++ -O3`) | `0da4df8d9ccbce1e...4485781` | `41.58 µs` | `388.43 ns` | `15027705736` |
| **Go `1.25`** | `0da4df8d9ccbce1e...4485781` | `60.63 µs` | `417.05 ns` | `15027705736` |
| **Julia `1.12`** | `0da4df8d9ccbce1e...4485781` | `125.92 µs` | `350.07 ns` | `15027705736` |
| **Python `3.13`** (`mmap`) | `0da4df8d9ccbce1e...4485781` | `8,655.58 µs` | `633.87 ns` | `15027705736` |

---

<div id="3-confirmatory-experiment-1-exp-001-track-a-bounded-template-stratum" class="anchor-alias" aria-hidden="true"></div>

## 3. Experimento confirmatorio 1 (`exp-001`, estrato de plantillas acotadas de Track-A)

<div id="31-pre-beacon-registration-reg-exp-001" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Prerregistro previo al faro (`reg-exp-001`)

Cinco clases (`m = 5`: `formal.bv_superopt`, `formal.hoare_inv`, `formal.poly_ideal`, `formal.open_drat_synth` y `tool.tau2_sqlite`) se poblaron a lo largo de $J = 5$ permutaciones de episodios `dev` (`966.2 J` de `reported_j` en `L2` a través de todos los intentos formales de llenado; `$0.00955` de costo `dev` en `Opus 5.5` cargados a `N1` sobre `tool.tau2_sqlite`). Los tamaños muestrales (`n = [420, 250, 250, 250, 250] = 1,420` por nivel; `2,840` en total) se dimensionaron con una potencia estadística del `90%` para intervalos `BCa` pareados de `10,000` remuestreos al `99.0%` ($1 - 0.05/5$) ajustados por multiplicidad. El manifiesto `cffb564cd9ad...` y la prueba de OpenTimestamps `suite/manifest.json.ots` (`172 B`) se confirmaron en `git tag reg-exp-001` (`e5007a4`) en la ronda `drand` `6663731`, estrictamente antes de la ronda objetivo `6663734` (`test_seed_u64 = 5861262844585529273`). Las `750/750` trayectorias muestreadas superaron auditorías independientes de calificación con `DRAT` y `SQLite SAVEPOINT` (`0` explotaciones indebidas).

<div id="32-track-a-confirmatory-results-2840-instances" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Resultados confirmatorios de Track-A (`2,840` instancias)

| Nivel y clase de tarea | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Qwen36}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | IC `BCa` `99.0%` | `reported_j`/acierto en `Qwen` | Veredicto ($\delta = +0.05$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | ---: | :--- |
| **Tier 1** `formal.bv_superopt` | `420` | `0.000` | `1.000` | `1.000` | `0.998` | `0.836` | `-0.24 pts` | `[-1.43, +0.00]` | `14.17 J` | **Relevancia excluida** |
| **Tier 1** `formal.hoare_inv` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.508` | `+0.00 pts` | `[+0.00, +0.00]` | `23.32 J` | **Relevancia excluida** |
| **Tier 1** `formal.poly_ideal` | `250` | `0.348` | `1.000` | `1.000` | `0.996` | `1.000` | `-0.40 pts` | `[-2.80, +0.00]` | `7.26 J` | **Relevancia excluida** |
| **Tier 1** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.352` | `+0.00 pts` | `[+0.00, +0.00]` | `69.00 J` | **Relevancia excluida** |
| **Tier 1** `tool.tau2_sqlite` | `250` | `0.188` | `0.624` | `1.000` | `1.000` | `0.940` | `+0.00 pts` | `[+0.00, +0.00]` | `7.11 J` | **Relevancia excluida** |
| **Tier 2** `formal.bv_superopt` (`16b`) | `420` | `0.000` | `1.000` | `1.000` | `0.983` | `1.000` | `-1.67 pts` | `[-3.81, -0.48]` | `7.87 J` | **Relevancia excluida** |
| **Tier 2** `formal.hoare_inv` (`6b`) | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.600` | `+0.00 pts` | `[+0.00, +0.00]` | `16.41 J` | **Relevancia excluida** |
| **Tier 2** `formal.poly_ideal` ($k\in[7,15]$) | `250` | `0.376` | `1.000` | `1.000` | `1.000` | `1.000` | `+0.00 pts` | `[+0.00, +0.00]` | `6.74 J` | **Relevancia excluida** |
| **Tier 2** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.376` | `+0.00 pts` | `[+0.00, +0.00]` | `53.59 J` | **Relevancia excluida** |
| **Tier 2** `tool.tau2_sqlite` (paráfrasis) | `250` | `0.224` | `0.516` | `0.636` | `1.000` | `0.916` | **`+36.40 pts`** | **`[+28.80, +44.80]`** | `7.15 J` | **Relevancia demostrada** (`12` sin llenar) |

**Auditoría de alcance de Track-A.** Si bien `exp-001` separó con nitidez la verificación formal canonizable (`9/9` celdas excluidas, ahorrando `$27.25` de gasto en API o `31,619.9 J` de `reported_j` local) frente a las paráfrasis superficiales no vistas (`+36.40` puntos en Tier 2 `tool.tau2_sqlite`, con un costo de `23.38 J` por acierto adicional en `Qwen 3.6`), una auditoría posterior a la ejecución identificó una limitación estructural decisiva: los generadores de Track-A muestreaban a partir de familias de plantillas módulo `6` a módulo `12` ($K_{\text{eff}} = 6\text{-}12$), lo que permitía que un presupuesto `dev` de `120` episodios saturase por completo las celdas de características.

---

<div id="4-confirmatory-experiment-2-exp-002-track-b-external-public-benchmarks-keffn" class="anchor-alias" aria-hidden="true"></div>

## 4. Experimento confirmatorio 2 (`exp-002`, bancos de pruebas públicos externos de Track-B, $K_{\text{eff}} = n$)

<div id="41-course-corrected-unique-instance-design-and-registration-reg-exp-002" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Diseño corregido de instancias únicas y prerregistro (`reg-exp-002`)

Para someter a prueba `Shape D` sin menús de plantillas sintéticas, Track-B (`exp-002`) incorporó cuatro bancos de pruebas públicos de autoría externa (artefactos originales fijados mediante `SHA-256`) junto con instancias aleatorias estructuralmente únicas de `3-SAT` en transición de fase (`12` variables, `50` cláusulas, razón cláusulas/variables `4.17`), produciendo `1,190` instancias únicas reservadas de `test` ($K_{\text{eff}} = n = 1,190$):

1. **`formal.unique_3sat_drat` (`n = 250`)**: Fórmulas `3-CNF` únicas de `12` variables y `50` cláusulas; `Shape D` emplea propagación polinómica de literales fallidos de nivel 1 y caminata local de `45` inversiones (`3,108 B` de FT comprimida con gzip), mientras que `CDCL` autónomo con verificación de pruebas `RUP/DRAT` de dos literales vigilados actúa como el brazo clásico `B1`.
2. **`external.bfcl_v3_live` (`n = 250` de un conjunto de `1,292`)**: UC Berkeley Gorilla Function-Calling Leaderboard `v3` (esquemas multiherramienta aportados por usuarios en `live_multiple` intercalados con tareas de abstención por `irrelevance`; `1,381 B` de FT comprimida con gzip).
3. **`external.tau_bench_retail` (`n = 220` de un conjunto de `635`)**: Conjunto de políticas minoristas y mutaciones de bases de datos relacionales `tau-bench` de Sierra Research (`500` usuarios, `1,000` pedidos, `50` productos; `1,298 B` de FT comprimida con gzip).
4. **`external.bigcodebench_exec` (`n = 220` de un conjunto ejecutable verificado localmente de `487`)**: Especificaciones de programación en Python con múltiples bibliotecas de `BigCodeBench v0.1.3` calificadas mediante ejecución aislada de `unittest` (`286 B` de FT comprimida con gzip; el `100%` de las tareas del conjunto se verificaron fuera de línea para aprobar las soluciones canónicas y rechazar `return None`).
5. **`external.swebench_verified` (`n = 250` de un conjunto de `500`)**: Incidencias de GitHub validadas por humanos de `princeton-nlp/SWE-bench_Verified`, evaluadas sobre localización de fallos en repositorios entre `12` opciones `(file_path :: symbol)` (`718 B` de FT comprimida con gzip).

El manifiesto `5fe640f00298...` (`355` llamadas `dev` a `Opus 5.5` = `$7.1902` cargados a $C_{N1}$) y el recibo de OpenTimestamps `suite_exp002/manifest.json.ots` (`207 B`) se confirmaron en `git tag reg-exp-002` (`d6bfae5`) en la ronda `drand` `6664086`, estrictamente antes de la ronda objetivo `6664089` (`test_seed_u64 = 9069507899917430179`). Una enmienda mecánica del arnés (`amendment_01_b6_slot_ctx.json`) elevó el contexto total de `llama-server` desde `-c 16384` (`4,096` tokens repartidos en `4` ranuras, lo que devolvía `HTTP 400` ante esquemas `BFCL`/`tau-bench` de `10k-13.7k` tokens) hasta `-c 81920` (`20,480` tokens por ranura), dejando inalterados todos los almacenes congelados, instrucciones, verificadores, tamaños muestrales y la ronda `drand` `6664089`. Las `515/515` trayectorias muestreadas superaron la reverificación independiente del calificador (`0` explotaciones indebidas).

<div id="42-track-b-multi-vendor-confirmatory-results-1190-unique-instances" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Resultados confirmatorios multiproveedor de Track-B (`1,190` instancias únicas)

Todas las `1,190` evaluaciones de `Shape D` (`N0`, `N1`), `B0` y `B1` (`CDCL+DRAT`) concluyeron en **`0.9213 s`** (`35.72 J` de `reported_j` en `L2`, `0.36 J` en `GPU`, `2.58 J` de `ri_energy_nj` en `L3`, `6.57 × 10^9` instrucciones, deriva en reposo anterior/posterior `3.09% <= 5.0%`).

| Clase de instancias únicas | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Sonnet}}$ | $p_{\text{Qwen36}}$ | $p_{\text{Gemma4}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | IC `BCa` `99.0%` | Veredicto ($\delta = +0.05$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | :--- |
| `formal.unique_3sat_drat` ($p_{B1}=1.000$) | `250` | `0.000` | **`0.696`** | **`0.696`** | `0.052` | `0.008` | `0.000` | `0.000` | **`-64.40 pts`** | `[-72.00, -56.00]` | **No evaluable** ($p_{\text{LLM}} < 2\delta$) |
| `external.bfcl_v3_live` | `250` | `0.180` | `0.200` | `0.228` | `0.828` | **`0.840`** | `0.804` | `0.720` | **`+60.00 pts`** | `[+51.20, +68.40]` | **Relevancia demostrada** (`28` sin llenar) |
| `external.tau_bench_retail` | `220` | `0.005` | `0.396` | `0.259` | **`0.864`** | `0.805` | `0.755` | `0.623` | **`+60.45 pts`** | `[+51.82, +68.64]` | **Relevancia demostrada** (`14` sin llenar) |
| `external.bigcodebench_exec` | `220` | `0.000` | `0.000` | `0.000` | **`0.950`** | `0.836` | `0.473` | `0.391` | **`+95.00 pts`** | `[+90.00, +97.73]` | **Relevancia demostrada** (`218` sin llenar) |
| `external.swebench_verified` | `250` | `0.096` | **`0.460`** | `0.456` | **`0.984`** | `0.952` | `0.900` | `0.812` | **`+52.80 pts`** | `[+44.40, +60.40]` | **Relevancia demostrada** (`4` sin llenar) |

*(Una sonda activa en la nube de 15 llamadas sobre `Google Gemini 2.5 Flash`, dentro del tope gratuito de `20 RPD` de AI Studio, registró `0/3`, `3/3`, `2/3`, `1/3` y `3/3` en las cinco clases en el mismo orden).*

Tres hallazgos empíricos destacan en la Sección 4.2:

1. **Acantilado combinatorio deductivo (`formal.unique_3sat_drat`)**: Cuando se eliminan los menús de plantillas de la satisfacibilidad formal (`K_eff = 250` fórmulas `3-CNF` únicas en transición de fase), los modelos neuronales de un solo turno fracasan casi por completo (`Opus 5.5` logra `5.2%` por `$13.55`, `Sonnet 5.5` `0.8%` por `$8.17`, `Qwen 3.6` `0.0%` con `7,588 J`, `Gemma 4` `0.0%` con `4,698 J`), mientras que la tabla polinómica de casos con cero llamadas resuelve el `69.6%` (`174/250`) y el solucionador clásico autónomo `CDCL+DRAT` (`B1`) resuelve el **`100.0%` (`250/250`)**. Dado que el propio `Opus 5.5` no logró superar a `B0` por $2\delta = 10.0$ puntos porcentuales (intervalo `BCa` al `95%` de `[+2.80, +8.40]` puntos), la regla de decisión prerregistrada se abstiene de emitir `"Relevance excluded"` (relevancia excluida) y clasifica estrictamente la celda como **`Not assessable`** (no evaluable).
2. **Líneas base no triviales sin modelo junto a incrementos neuronales genuinos**: Incluso con cero parámetros neuronales (`N0`), las reglas de casos léxicas y de esquemas resuelven el **`46.0%`** de la localización de fallos entre `12` opciones de `SWE-bench Verified` (frente al piso del `9.6%`) y el **`39.6%`** de las mutaciones de políticas minoristas de `tau-bench` (frente al piso del `0.5%`). En `tau-bench`, la extracción voraz de bigramas en `dev` dentro de `N1` sobreajustó de hecho el fraseo ruidoso de los clientes (`25.9%` frente al `39.6%` de `N0`), confirmando la importancia de reportar `N0` estricto junto a `N1` (`S4`). No obstante, en los cuatro bancos de pruebas públicos, los modelos de frontera y los modelos locales de pesos abiertos aportan incrementos amplios y estadísticamente decisivos (`+46.82` a `+95.00` puntos porcentuales por encima tanto de `N0` como de `N1`).
3. **Costo en `reported_j` de doble canal del incremento local (`B6`)**: En el anfitrión compartido Apple M5 Max (donde la síntesis concurrente `yosys-abc` activó el Falsador 6 en `4` de `5` ventanas de varios minutos, invalidando limpiamente `derived_marginal_j` mientras preservaba los contadores brutos `IOReport` de `L2` y `ri_energy_nj` por `PID` de `L3`), cada tarea adicional completada por `Qwen 3.6 35B-A3B` por encima de `N1` costó **`49.90 J`** (`SWE-bench`), **`70.33 J`** (`BFCL v3`), **`238.80 J`** (`BigCodeBench`) y **`407.12 J`** (`tau-bench` Retail) en `reported_j` bruto de nivel `L2`.

---

<div id="5-goodturing-unseen-mass-multi-turn-work-repair-and-online-crystallization" class="anchor-alias" aria-hidden="true"></div>

## 5. Masa no vista de Good-Turing, reparación multiturno en `/work` y cristalización en línea

<figure class="my-8">
  <img src="/figures/deterministic-null/s3-good-turing-regimes.svg" alt="Dos regímenes separados por la masa de claves no vistas de Good-Turing N1(t)/t y la cristalización en línea bajo ley de Zipf." />
  <figcaption>Figura 2. La masa de claves no vistas de Good-Turing <em>N</em><sub>1</sub>(<em>t</em>) / <em>t</em> predice dónde se satura el <code>Shape D</code> congelado frente a dónde se requiere síntesis neuronal o cristalización en línea (<code>measured_j = None</code>).</figcaption>
</figure>

<div id="51-goodturing-unseen-mass-n1tt-across-the-five-track-b-streams" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Masa no vista de Good-Turing ($N_1(t)/t$) a lo largo de los cinco flujos de Track-B

A lo largo de cada flujo de tareas `dev + cal` $t = 1 \dots T$, la razón de frecuencias unitarias (singletons) de Good-Turing $N_1(t)/t$ estima la probabilidad de que la siguiente clave entrante no haya sido vista antes:

| Clase de tarea (flujo `dev + cal`) | Longitud del flujo $T$ | Celda gruesa $N_1(T)/T$ | Esquema/instancia fina $N_1(T)/T$ | Finalización reservada `N0` / `N1` |
| :--- | ---: | ---: | ---: | ---: |
| `formal.unique_3sat_drat` | `270` | `0.0000` | `1.0000` | `69.6%` / `69.6%` |
| `external.swebench_verified` | `250` | `0.0080` | `0.5960` | `46.0%` / `45.6%` |
| `external.tau_bench_retail` | `285` | `0.0035` | `0.6386` | `39.6%` / `25.9%` |
| `external.bfcl_v3_live` | `300` | `0.0233` | `0.4033` | `20.0%` / `22.8%` |
| `external.bigcodebench_exec` | `240` | **`0.9917`** | **`0.9917`** | **`0.0%` / `0.0%`** |

Incluso después de que `N1` cristalizara `108` soluciones en Python de `Claude Opus 5.5` verificadas con pruebas unitarias en el conjunto `dev` de `BigCodeBench`, $N_1(T)/T = 0.9917$ predijo un solapamiento de claves prácticamente nulo sobre especificaciones composicionales de programación no vistas, coincidiendo exactamente con el `0.0%` de finalización observado en el conjunto reservado `test` (`218` claves sin llenar).

<div id="52-multi-turn-work-software-engineering-repair-6-multi-file-repositories" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Reparación multiturno de ingeniería de software en `/work` (`6` repositorios multiarchivo)

Para comprobar que las instrucciones de un solo turno de la Sección 4 no penalizaron ni distorsionaron a los arneses de programación de múltiples pasos, se evaluaron seis repositorios de corrección de errores en Python con múltiples funciones y múltiples archivos (`config-defaults` sobre `loader.py` + `schema.py`, `interval-merge`, `pagination`, `precedence` sobre `calc.py` + `lexer.py`, `rate-window` sobre `window.py` + `limiter.py` y `retry-backoff`) dentro de entornos aislados `/work` (`max_turns = 10`), sobrescribiendo `test_*.py` desde copias originales intactas antes de calificar mediante `pytest -q`:

| Carril de arnés multiturno en `/work` | Repositorios superados | `SATB` `P/F/R/K` | Llamadas a modelo | Llamadas a herramienta | `USD` de API / `reported_j` local |
| :--- | ---: | :---: | ---: | ---: | :--- |
| **`Shape D` frío no visto (`t = 1`)** | `0 / 6` (`0.0%`) | `0/6/0/0` | `0` | `0` | `$0.0000` / `< 1 J` |
| **`Lane B` (`Claude Opus 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `28` | `29` | `$0.3613` (`not_available`) |
| **`Lane B` (`Claude Sonnet 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `31` | `34` | `$0.2080` (`not_available`) |
| **`Shape H` (`Claude Code 2.1.330` + `Opus 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `30` | `MCP` | `$0.2646` (`not_available`; Falsador 8 superado) |
| **`Lane B` local (`Qwen 3.6 35B-A3B`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `42` | `42` | **`2,342.0 J`** `L2` (`390.3 J`/repositorio) |
| **`Shape D` repetición en línea (flujo `t = 2`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `0` | `0` | `$0.0000` (repetición de parche verificado) |

<div id="53-online-crystallization-on-recurring-zipfian-traffic-bigcodebench" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Cristalización en línea sobre tráfico recurrente de Zipf (`BigCodeBench`)

En la pista secundaria en línea (`600` solicitudes extraídas de una distribución Zipf-$0.85$ sobre las `220` tareas únicas de prueba de `BigCodeBench`, donde `Shape D` invoca `B3`/`B6` únicamente ante un fallo por clave no vista y almacena en caché las soluciones que superan `unittest`), la finalización de la tarea iguala al uso puro por solicitud de `Opus 5.5` (**`98.0%` frente a `98.0%`**) mientras `155` funciones verificadas se cristalizan en el almacén, reduciendo las llamadas acumuladas a LLM en un **`72.17%` (`167` frente a `600`)**, el gasto de API de **`$7.33` a `$2.04` (`3.59×`)** y el consumo local `reported_j` de `Qwen 3.6` de **`67,729.6 J` a `18,851.4 J` (`3.59×`)**.

---

<div id="6-limitations-falsifiers-and-unfinished-work" class="anchor-alias" aria-hidden="true"></div>

## 6. Limitaciones, falsadores y trabajo pendiente

1. **Ausencia de medidor físico en riel o en toma de pared de corriente alterna (`board_metered = false`, `measured_j = None`)**: Todas las cifras de energía de este estudio corresponden a contadores `reported_j` en chip `IOReport` (`L2`) de Apple Silicon y `ri_energy_nj` (`L3`) del núcleo en un anfitrión con trabajos concurrentes; las mediciones `L0` de corriente alterna en toma de pared (`Shelly`/`Yokogawa`, capaces de capturar pérdidas en PSU, DRAM y NVMe) sobre una máquina objetivo aquietada permanecen abiertas.
2. **Selección autoadministrada de bancos de pruebas frente a un Nivel 3 de terceros humanos independientes**: Aunque Track-B (`exp-002`) sustituyó las plantillas sintéticas por cuatro bancos de pruebas públicos de autoría externa bloqueados antes de la ronda `drand` `6664089`, todavía no se ha ejecutado un banco de pruebas sellado de Nivel 3 redactado y custodiado en depósito por un tercero humano independiente.
3. **No necesidad bajo presupuesto finito**: Todo veredicto `"Relevance shown"` (relevancia demostrada) es estrictamente relativo a la muestra `dev` declarada (`100-150` instancias) y al tope de `4,096 B` de tabla de funciones; una clave sin llenar demuestra que no se alcanzó cobertura dentro de ese presupuesto, nunca la imposibilidad matemática de un procedimiento no neuronal.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referencias

<ol data-refs>
<li>Aamodt, A., &amp; Plaza, E. (1994). Case-based reasoning: Foundational issues, methodological variations, and system approaches. <em>AI Communications</em>, 7(1), 39-59.</li>
<li>Efron, B. (1987). Better bootstrap confidence intervals. <em>Journal of the American Statistical Association</em>, 82(397), 171-185.</li>
<li>Goldberg, E., &amp; Novikov, Y. (2003). Verification of proofs of unsatisfiability for CNF formulas. <em>DATE 2003</em>, 886-891.</li>
<li>Good, I. J. (1953). The population frequencies of species and the estimation of population parameters. <em>Biometrika</em>, 40(3-4), 237-264.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., &amp; Narasimhan, K. (2024). SWE-bench: Can language models resolve real-world GitHub issues? <em>ICLR 2024</em>.</li>
<li>Mamdani, E. H., &amp; Assilian, S. (1975). An experiment in linguistic synthesis with a fuzzy logic controller. <em>International Journal of Man-Machine Studies</em>, 7(1), 1-13.</li>
<li>Michie, D., &amp; Chambers, R. A. (1968). BOXES: An experiment in adaptive control. <em>Machine Intelligence</em>, 2, 137-152.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Patil, S. G., Mao, H., Cheng-Jie Ji, C., Yan, F., Suresh, V., Stoica, I., &amp; Gonzalez, J. E. (2024). Gorilla: Large language model connected with massive APIs (Berkeley Function-Calling Leaderboard). <em>NeurIPS 2024</em>.</li>
<li>Simon, H. A., &amp; Kadane, J. B. (1975). Optimal problem-solving search: All-or-none solutions. <em>Artificial Intelligence</em>, 6(3), 235-247.</li>
<li>Stanfill, C., &amp; Waltz, D. (1986). Toward memory-based reasoning. <em>Communications of the ACM</em>, 29(12), 1213-1228.</li>
<li>Wang, L.-X., &amp; Mendel, J. M. (1992). Generating fuzzy rules by learning from examples. <em>IEEE Transactions on Systems, Man, and Cybernetics</em>, 22(6), 1414-1427.</li>
<li>Wetzler, N., Heule, M. J. H., &amp; Hunt, W. A. (2014). DRAT-trim: Efficient checking and trimming using expressive clausal proofs. <em>SAT 2014</em>, 422-429.</li>
<li>Yao, S., Shinn, N., Razavi, P., &amp; Narasimhan, K. (2024). tau-bench: A benchmark for tool-agent-user interaction in real-world domains. <em>arXiv:2406.12045</em>.</li>
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2025). BigCodeBench: Benchmarking code generation with diverse function calls and complex instructions. <em>ICLR 2025</em>.</li>
</ol>
