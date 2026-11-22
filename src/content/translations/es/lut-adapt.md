---
title: "Compilación descendente a LUT6 en una cascada Mixture of Limits: mallas booleanas enrutadas por Beneš, compuertas de activación conformales y transmisión de capas NVMe de 4 bits"
deck: "Una cascada Mixture of Limits (mezcla de límites) de cuatro peldaños que prueba primero circuitos paginados de tablas de búsqueda de 6 entradas (LUT6) con cero operaciones de coma flotante (FLOP), despierta modelos Mamba-3 y modelos híbridos de 2026 transmitidos por capas desde Non-Volatile Memory Express (NVMe) en 4 bits solo ante fallos de búsqueda, y compila de forma descendente las activaciones certificadas hacia páginas de Block RAM de 36 Kbits (RAMB36E2) enrutadas mediante redes Beneš. Se informan tiempos de reloj real, conteos de bytes sin búfer bajo Darwin F_NOCACHE (lectura de archivos sin caché), memoria activa de acceso aleatorio (RAM) y simulaciones a nivel de transferencia de registros (RTL) con Yosys/Verilator para xck26 a partir de openIE-dev/lut-adapt-ai en el commit a5e9bc1. Las cifras de energía son estimaciones analíticas est_j; no se midió potencia física en placa."
lang: "es"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-4-bit-nvme-layer-streaming" class="anchor-alias" aria-hidden="true"></div>

*Revisión 11dbc8c, 22 de noviembre de 2026. Implementación de referencia y artefactos: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) en [`a5e9bc1de280f973bc9051b4cc58942820a67eeb`](https://github.com/openIE-dev/lut-adapt-ai/tree/a5e9bc1de280f973bc9051b4cc58942820a67eeb). Resumen de datos: [/data/#lut-adapt](/data/#lut-adapt). PDF en LaTeX: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([fuente](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Descripción general

Este estudio examina cómo un sistema de cómputo puede compilar de manera descendente el trabajo repetido de un modelo neuronal hacia búsquedas rápidas en tablas booleanas sin perder la paridad exacta de salida ni promover conjeturas no verificadas a la categoría de reglas confiables. Se presentan mediciones de software, síntesis a nivel de transferencia de registros (RTL) y simulaciones por ciclos, junto con estimaciones analíticas de energía debidamente etiquetadas (`est_j`). No se conectó ningún medidor de julios en toma eléctrica ni en riel de alimentación en este repositorio (`measured_j` no está definido; `board_metered` es falso).

**En palabras sencillas**

1. La mayoría de las entradas que recibe un sistema desplegado repiten patrones que ya ha resuelto antes, de modo que ejecutar una red neuronal completa en coma flotante en cada paso desperdicia cómputo y ancho de banda de memoria.
2. La arquitectura de referencia sitúa un nivel reconfigurable de búsqueda en tablas de verdad de 6 entradas (`LUT6`) delante de los modelos de espacio de estados en transmisión y de los modelos fundacionales, y compila las respuestas hacia abajo en páginas de memoria de búsqueda únicamente después de que una comprobación explícita las certifica.
3. Cuando un modelo de lenguaje híbrido de 2026 transmite sus pesos capa por capa desde una unidad de estado sólido, ese redactor borrador `LUT6` de cero FLOP propone ráfagas de múltiples tokens que el modelo objetivo verifica en un único barrido de disco, reduciendo las lecturas de disco en casi `3×` sin alterar en absoluto los tokens de salida.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Términos, siglas y etiquetas de medición

<ul id="terms">
<li>MoL: Mixture of Limits (mezcla de límites), la regla de cascada definida en Compuertas de confirmación medidas, Parte II [same house]</li>
<li>LA: prefijo de afirmaciones y falsadores (LA-1 a LA-8, LA-F1 a LA-F8) empleado en este estudio</li>
<li>LUT, LUT6, INIT: tabla de búsqueda, primitiva booleana de 6 entradas de Xilinx UltraScale+ y su máscara de inicialización de tabla de verdad de 64 bits</li>
<li>BRAM, RAMB36E2, URAM: Block RAM, la primitiva de memoria en bloque de doble puerto de 36 Kbits de UltraScale+ (144 unidades en xck26) y UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: bloque lógico configurable, biestable (flip-flop), bloque de procesamiento digital de señales y placa AMD Kria KV260 (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: matriz de compuertas programables en campo, circuito integrado de aplicación específica, nivel de transferencia de registros, ciclos por búsqueda, posicionamiento y enrutamiento (place-and-route), peor holgura negativa (worst negative slack) y conferencia Field-Programmable Logic</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML: Advanced eXtensible Interface, sistema de procesamiento Zynq, lógica programable, sistema en módulo, circuito integrado monitor de potencia en placa, riel de alimentación, Intel Running Average Power Limit y NVIDIA Management Library</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: dualidad de espacio de estados (State Space Duality), modelo de espacio de estados, múltiples entradas y múltiples salidas, incrustación posicional rotatoria, activación de unidad lineal con compuerta, atención de consultas agrupadas, caché clave-valor, codificación de pares de bytes, modelo(s) grande(s) de lenguaje, mezcla de expertos (Mixture-of-Experts), perceptrón multicapa y gramática libre de contexto</li>
<li>HC, SOINN, WNN, DWN: red neuronal incremental autoorganizada de contexto jerárquico (hierarchy-context Self-Organizing Incremental Neural Network), red neuronal sin pesos y red neuronal diferenciable sin pesos (Differentiable Weightless Neural Network)</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: arquitectura predictiva de incrustación conjunta, modelo de razonamiento basado en energía, inferencia conformal adaptativa (Adaptive Conformal Inference), fuera de distribución, área bajo la curva característica operativa del receptor, probabilidad softmax máxima y Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, HF: decodificación por búsqueda en el prompt (Prompt Lookup Decoding), decodificación especulativa basada en recuperación, algoritmo de extrapolación para mayor eficiencia en modelos de lenguaje, Liquid Foundation Model 2.5 (LiquidAI/LFM2.5-350M) y HuggingFace</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB: almacenamiento Non-Volatile Memory Express, indicador Darwin F_NOCACHE de lectura sin caché, interfaz portable de sistema operativo, memoria de acceso aleatorio, RAM dinámica, RAM estática, entrada/salida, kilobyte, megabyte y gigabyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, SIMD, AD, FD, BPB, FP16, FP32, INT4: operación(es) de coma flotante, millones de FLOPs, multiplicación-acumulación, instrucción única sobre múltiples datos, diferenciación automática, diferencias finitas, bits por byte, coma flotante de 16/32 bits y entero de 4 bits</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house], Wise Computer Automation [same house], finalización verificada (verified completion) y prefijo de bancos de pruebas de ingeniería de software</li>
<li>CLI, HTTP, SSE, API, ACL, OS, CPU, GPU, SW: interfaz de línea de comandos, protocolo de transferencia de hipertexto, eventos enviados por el servidor (Server-Sent Events), interfaz de programación de aplicaciones, Association for Computational Linguistics, sistema operativo, unidad central o gráfica de procesamiento y software</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CAM, XNOR: red de área local virtual (IEEE 802.1Q), seguridad de la capa de transporte, inspección profunda de paquetes, árbol de sintaxis abstracta, JavaScript Object Notation, valores separados por comas, algoritmo de hash seguro, memoria direccionable por contenido y compuerta NOR exclusiva</li>
</ul>

En todas las tablas siguientes se mantienen estrictamente separadas tres clases de evidencia:

| Etiqueta de evidencia | Significado en este estudio |
| :--- | :--- |
| **`Measured (SW / NVMe I/O)`** | Conteos exactos de bytes leídos o escritos mediante `os.pread` bajo Darwin `F_NOCACHE`, asignaciones de memoria residente, segundos de reloj real en Apple M5 Max y concordancia exacta de bits o tokens. `measured_j` no está definido (`None`). |
| **`Simulated (RTL)`** | Conteos estructurales de lista de conexiones (netlist) obtenidos con Yosys `0.71+` (`synth_xilinx -family xcup` dirigido a Kria KV260 `xck26`) y conteos de ciclos (`CPI = 1`) obtenidos con Verilator `5.054`. No corresponde a cierre temporal en Vivado ni a potencia medida en placa (`board_metered = false`). |
| **`Estimated (est_j)`** | Julios analíticos calculados a partir de conteos de operaciones o sustitutos temporales de potencia de diseño térmico (`joule_meter.py` en modo de respaldo cuando no existen contadores hardware `RAPL`/`NVML` en macOS). Comparables únicamente entre variantes dentro de una misma fórmula; nunca equivalen a vatios medidos en silicio. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Antecedentes arquitectónicos y contribuciones

En [Compuertas de confirmación medidas](/papers/gates/) `[same house]`, la Parte II define **Mixture of Limits (mezcla de límites)**: probar los engranajes en orden decreciente de probabilidad de éxito por julio $p_i / c_i$ (Simon y Kadane, 1975), detenerse tan pronto como se cumpla el predicado de finalización de la tarea $C(z) = 1$, y prohibir el fortalecimiento de una salida `ModelGenerated` hacia `Deterministic`. Sin embargo, un nivel de búsqueda estático solo cubre las entradas escritas en él antes del despliegue. En sentido inverso, las redes neuronales basadas en tablas de búsqueda existentes (LogicNets de Umuroglu et al., 2020; DiffLogic de Petersen et al., 2022; y Differentiable Weightless Neural Networks de Bacellar et al., 2024) fijan la conectividad de cables dentro del enrutamiento estático del FPGA, lo que exige volver a ejecutar el posicionamiento y enrutamiento del fabricante cada vez que cambia la distribución de entrada.

La implementación de referencia `lut-adapt-ai` cierra el ciclo entre la cima y la base de la cascada mediante la **compilación descendente en línea hacia `LUT6`**:

- **Peldaño 0 (Búsqueda - Beneš paginado + `LUT6`)**: Evalúa máscaras de tablas de verdad de 64 bits enrutadas a través de un conmutador multidifusión sin bloqueo $512 \times 512$ **Beneš-Copy-Beneš** y almacenadas en caché a lo largo de $81 \times \texttt{RAMB36E2}$ memorias en bloque de doble puerto (`0` operaciones de coma flotante, cambio de página en un solo ciclo en simulación con Verilator).
- **Peldaño 1 (Flujo - Dualidad de espacio de estados MIMO compleja `Mamba-3`)**: Resuelve los fallos de búsqueda que dependen del historial de la secuencia empleando un estado recurrente de tamaño constante $O(1)$ (`48 KB` de memoria fijada en la referencia de `14.3M` parámetros), evitando el crecimiento $O(L)$ de la caché clave-valor.
- **Peldaño 2 (Topología - `HC-SOINN`)**: Mantiene en línea una topología de prototipos sobre incrustaciones latentes, aislando fronteras entre regímenes y disparando un disyuntor (`Refuse` de rechazo o escalamiento) cuando llega un desplazamiento de distribución sin etiquetar.
- **Peldaño 3 (Modelo en último lugar - `JEPA-EBRM` y transmisión NVMe de 4 bits `AirMoL`)**: Invoca la verificación basada en energía latente o modelos fundacionales preentrenados de 2026 transmitidos por capas (`LiquidAI/LFM2.5-350M` y `Qwen/Qwen3.5-0.8B-Base`) únicamente cuando los peldaños más económicos se abstienen o requieren verificación exacta del modelo objetivo.
- **`SleepCrystallizer` descendente**: Extrae trazas recurrentes de activación mediante arranques en caliente espectrales de Walsh-Hadamard, tablas de verdad de minitérminos de moda conjunta y planificaciones de conmutadores de Waksman, alternando bancos de memoria en bloque en sombra sin detener la inferencia ni ejecutar posicionamiento y enrutamiento en el FPGA.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Contribuciones

1. **Condición de compilación descendente amortizada**: Extiende el ordenamiento $p_i/c_i$ de Simon-Kadane incorporando un costo explícito de compilación $E_{\text{compile}}$ sobre un horizonte estacionario $\Delta T$.
2. **Arquitectura RTL sin bloqueo $512 \times 512$ Beneš-Copy-Beneš con `81` bloques `RAMB36E2`**: Elimina tanto el desbordamiento lógico del `102.0%` en la Kria KV260 producido por matrices de conmutación planas (`119,478` LUTs) como la explosión a `926,619` LUTs de los multiplexores de páginas basados en biestables, sintetizando en `41,186` LUTs de CLB UltraScale+ (`35.2%` del `xck26`), `81` bloques `RAMB36E2` (`56.2%`) y `0` bloques `DSP48`, con cambio de página en `1` ciclo (`4.0 ns` a `250 MHz` nominales) en simulación.
3. **Síntesis universal de minitérminos de moda conjunta de $\le 64$ bits**: Demuestra que la búsqueda de minitérminos de moda conjunta domina al redondeo marginal por planos de bits de DiffLogic en ramas correlacionadas, y empaqueta $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ tokens de subpalabra en una sola palabra `uint64` (`16b × 4 = 64b` para `|V| = 65,536`; `18b × 3 = 54b` para `|V| = 248,320`).
4. **Compuerta de cristalización Split-Conformal + ACI en línea sin oráculo**: Combina una puntuación de no conformidad `JEPA-EBRM` latente regularizada radialmente con calibración Split Conformal e Inferencia Conformal Adaptativa (Gibbs y Candès, 2021), registrando `0.00%` de riesgo de falsa cristalización y `1.0000` de AUROC fuera de distribución en tráfico desplazado, donde las líneas base softmax y MC-Dropout registran entre `17.62%-24.28%` de falso riesgo.
5. **Transmisión NVMe de 4 bits `AirMoL` sin barridos adicionales en modelos híbridos de 2026**: Combina la transmisión por capas cuantizadas por grupos de 4 bits mediante `os.pread` con Darwin `F_NOCACHE`, la reversión en RAM de estados híbridos y la especulación en línea por ráfagas de tokens en `LUT6` sobre `LiquidAI/LFM2.5-350M` (marzo de 2026) y `Qwen/Qwen3.5-0.8B-Base` (febrero de 2026), reduciendo las lecturas NVMe de disco en `2.86×` y `2.74×` con `100.0%` de paridad exacta de tokens mientras mantiene la RAM activa de pesos en `8.45%-9.47%` del tamaño del modelo en FP32.
6. **Suite de sistemas políglota y servidor HTTP/SSE en vivo**: Verifica de forma cruzada la cascada en Python/PyTorch/Triton, Rust `Burn 0.22.1 / CubeCL` Metal, Zig `0.17.1`, Go `1.27.4` SIMD, Julia `1.13.4` Enzyme y `mol_code_cli.py`.

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

## 3. Arquitectura de referencia, suite políglota y RTL en KV260

La Figura 1 muestra la cascada de cuatro peldaños y el bucle descendente de `SleepCrystallizer` implementado en `src/clai/`.

![Figura 1. Compilación descendente a lo largo de una cascada Mixture of Limits de cuatro peldaños.](/figures/lut-adapt/mol-downward-cascade.svg)

*Figura 1. Compilación descendente a lo largo de una cascada Mixture of Limits de cuatro peldaños. Diagrama de diseño, no una medición de potencia en placa. [PNG](/figures/lut-adapt/mol-downward-cascade.png) · [Explorador interactivo](/living/lut-adapt/#la-diag-01).*

Cinco implementaciones de sistemas en `openIE-dev/lut-adapt-ai` verifican de manera cruzada la cascada: Python/PyTorch/Triton (`src/clai/`), Rust `Burn 0.22.1 / CubeCL` Metal (`sys/rust/`), Zig `0.17.1` (`sys/zig/`), Go `1.27.4` SIMD (`sys/go/`) y Julia `1.13.4` Enzyme (`sys/julia/`).

La Figura 2 ilustra la ruta de datos RTL para la Kria KV260 (`xck26`) en `hw/kv260/rtl/clai_benes_hotswap_core.sv`, donde se mapean `512` páginas `LUT6` residentes (`5,120` bits `INIT` + etiqueta de contexto de `48` bits + bit de validez) en `81` memorias de doble puerto `RAMB36E2` en paralelo para lograr conmutación de contexto en un solo ciclo (`4.0 ns` a `250 MHz` nominales, `CPI = 1.0`).

![Figura 2. Malla multidifusión Beneš-Copy-Beneš y caché de páginas LUT6 en BRAM de un solo ciclo.](/figures/lut-adapt/benes-paged-silicon.svg)

*Figura 2. Malla multidifusión `512×512` Beneš-Copy-Beneš y caché de páginas `LUT6` de un solo ciclo en `81 × RAMB36E2` dirigida a AMD Kria KV260 (`xck26`) bajo simulación en Yosys `0.71+` y Verilator `5.054` (`board_metered = false`). [PNG](/figures/lut-adapt/benes-paged-silicon.png) · [Explorador interactivo](/living/lut-adapt/#la-diag-02).*

La Figura 3 muestra `AirMoL` (`src/clai/frontier/air_mol_streamer.py` y `hf_air_mol_pretrained.py`), que transmite fragmentos cuantizados por grupos de 4 bits mediante `os.pread` con Darwin `F_NOCACHE`, verifica `[last_tok, d_1..d_K]` en un único barrido y guarda instantáneas en RAM de estados híbridos compactos (`Short-Conv/SSM` o `Gated DeltaNet` + recorte disperso KV de `GQA` en `6` capas) de modo que los rechazos parciales del borrador requieran **cero barridos NVMe adicionales**.

![Figura 3. Transmisión de capas NVMe de 4 bits AirMoL con especulación universal LUT6 de tokens de 64 bits.](/figures/lut-adapt/airmol-nvme-speculation.svg)

*Figura 3. Transmisión de capas NVMe de 4 bits `AirMoL` sin barridos adicionales con especulación universal `LUT6` de tokens de `≤64` bits sobre `LiquidAI/LFM2.5-350M` y `Qwen/Qwen3.5-0.8B-Base`. [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [Explorador interactivo](/living/lut-adapt/#la-run-01).*

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

<div id="47-claim-la-7-pretrained-2026-hybrid-models-under-airmol-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 Afirmación LA-7: Modelos híbridos preentrenados de 2026 bajo `AirMoL` (`LFM2.5-350M` y `Qwen3.5-0.8B-Base`)

| Punto de control 2026 y variante | Paridad | Tok / Barrido | Caract. / Barrido | Barridos | Lectura NVMe | RAM activa pico (`% FP32`) | `tok/s` | Clase de evidencia |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Medido (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4 bits (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Medido (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4 bits + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Medido (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` `LUT6` en frío** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Medido (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` tras activación** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Medido (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4 bits (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Medido (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4 bits + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Medido (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` `LUT6` en frío** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Medido (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` tras activación** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Medido (`F_NOCACHE`)** |

Obsérvese el compromiso de rendimiento preservado sobre `Qwen3.5-0.8B-Base` ante prompts no vistos en frío: `AirMoL` reduce las lecturas de disco NVMe de `12.674 GB` a `8.581 GB`, pero la verificación por lotes de `4` tokens en Gated DeltaNet sobre CPU reduce el rendimiento en tiempo real (`0.32` frente a `0.53 tok/s`) hasta que la cristalización en línea de las activaciones hacia `LUT6` eleva la aceptación a `2.74 tok/sweep` (`4.621 GB` leídos, `1.11 tok/s`).

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 Afirmación LA-8: Interfaz CLI en vivo y servidor de transmisión HTTP/SSE (`mol_code_cli.py`)

`scripts/mol_code_cli.py` sirve `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b}` y `--air-nvme` a través de CLI y puntos finales SSE (`/v1/health`, `/v1/complete`, `/v1/crystallize`), elevando en vivo la ocupación de ranuras `RAMB36E2` de `438/512` a `460/512` con `18/18` suites de pruebas `pytest` superadas.

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Trabajo relacionado y observaciones de convergencia

| Sistema | ID / Foro | Qué establece | Costo según se informa | Diferencia en esta referencia |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Capas neuronales dispersas y cuantizadas compiladas en LUTs de FPGA. | Síntesis de LUTs en FPGA y Fmax. | El cableado estático exige re-PAR en Vivado ante cambios, frente al cambio en `1` ciclo con Beneš + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) y **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Redes diferenciables de compuertas booleanas y redes LUT sin pesos. | Conteo de compuertas y precisión. | El enrutamiento estático cae a `52.34%` ante el cambio de VLAN y sufre quimeras marginales por planos de bits. |
| **T-MAC** (Wei et al., 2024) y **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Productos matriciales ternarios o de pocos bits mediante búsqueda en tablas en CPU/FPGA. | Latencia y potencia en FPGA. | Acelera el álgebra lineal dentro de un engranaje de modelo; no evita invocar el modelo. |
| **FrugalGPT** (Chen et al., 2023) y **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Cascadas de LLM de débil a fuerte y enrutadores de preferencias. | Precio en dólares de API frente a calidad. | Enrutamiento exclusivo entre modelos; sin piso de búsqueda `LUT6` ni compilación descendente. |
| **GreenServ** (2026) y **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Enrutamiento bandit multi-LLM y servicio con escalado de frecuencia. | Wh de GPU informados por los autores (`Zeus` / `pyNVML`). | Optimiza el servicio en GPU; esta referencia compila las activaciones hacia páginas `LUT6` de `0` FLOP (`est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Redactores especulativos basados en MLP neuronales, árboles borrador y cascadas. | Aceleración en tiempo de reloj real. | Requieren FLOPs de borrador y lecturas de pesos, frente a páginas `LUT6` `uint64` de `0` FLOP. |
| **PLD** (Saxena, 2023) y **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Redactores de cero FLOP por n-gramas en el prompt y árboles de sufijos en almacén de datos. | Aceleración de latencia (`0` FLOPs). | `PLD` omite tokens fuera del prompt; `REST` recorre árboles variables frente a páginas fijas `RAMB36E2`. |
| **AirLLM** (lyogavin, 2023) | Transmisor SSD de código abierto | Transmisión de pesos desde SSD capa por capa en poca RAM. | Huella de RAM activa. | Puro `T=1` (`1.0 tok/sweep`) + volcado KV frente a la reducción de barridos de `2.74×-2.86×` en `AirMoL`. |
| **Compuertas de confirmación medidas** y **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Compuertas de confirmación (lectura SOM `INA260` en KV260 de `11,428 pJ`), MoL $p_i/c_i$ y `RCE-JEPA`. | `measured_j` + `est_j` en SOM KV260. | Base propia de la misma casa; extendida aquí con compilación descendente Beneš `LUT6` y `AirMoL`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. Límites, amenazas a la validez, lo que no se afirma y falsadores

**Validez interna y de constructo.** Bajo ruido aleatorio uniforme o rotación adversaria paso a paso ($\Delta T = 1$), la Proposición 1 arroja cero ahorro por compilación descendente y el sistema retrocede a `1.00 tok/sweep`. La paridad sin pérdida (`100.0%`) garantiza concordancia bit a bit con la decodificación voraz del modelo objetivo, sin elevar el techo de capacidad intrínseca de un punto de control base de `350M` o `0.8B` parámetros.

**Validez de medición y lo que no se afirma.** Toda cifra en julios de este estudio es una estimación analítica `est_j` (`measured_j = None`). Yosys `0.71+` y Verilator `5.054` establecen la síntesis estructural de lista de conexiones para `xck26` y la simulación por ciclos con `CPI = 1`, no el cierre temporal posterior a posicionamiento y enrutamiento en Vivado a `250 MHz` ni vatios físicos medidos en los rieles de una placa KV260 (`board_metered = false`). No se afirma liderazgo energético medido en silicio, ni promoción de salidas `ModelGenerated` a `Deterministic`, ni ejecuciones medidas en modelos de `70B` (`air_mol_nvme_baselines.csv` informa únicamente proyecciones analíticas para `70B`).

| ID | Afirmación | Condición exacta de refutación / falsador |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` no alcanza el `100.0%` de paridad en Verilator en los `5,120` paquetes o no detecta el cambio de VLAN en el paquete `2,500`. |
| **`LA-F2`** | `Claim LA-2` (Suite políglota) | Zig asigna `> 0` bytes de montículo en el bucle crítico, Go informa `> 0 allocs/op` o Enzyme en Julia supera un error de `1e-7` frente a diferencias finitas. |
| **`LA-F3`** | `Claim LA-3` (RTL paginado KV260) | `scripts/verify_paged_bram_rtl.py` supera `117,120` LUTs, `144` bloques `RAMB36E2`, `0` bloques `DSP48` o `1` ciclo por cambio de página. |
| **`LA-F4`** | `Claim LA-4` (ACI conformal) | `scripts/run_frontier_benchmarks.py` supera el riesgo falso objetivo $\alpha = 0.02$ en tráfico desplazado o etiqueta salidas como `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Especulación por bytes) | `scripts/run_code_corpus_benchmark.py` produce `< 100.0%` de paridad exacta de bytes frente a `Mamba3CodeLM` voraz en `48` prompts no vistos. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` bajo `F_NOCACHE` pierde el `100%` de paridad o lee más bytes NVMe que `AirLLM` de 4 bits con `T=1`. |
| **`LA-F7`** | `Claim LA-7` (`AirMoL` HF 2026) | `scripts/run_hf_air_mol_pretrained.py` o `scripts/run_hf_qwen35_air_mol.py` diverge en $\ge 1$ token BPE respecto a la decodificación voraz del objetivo. |
| **`LA-F8`** | `Claim LA-8` (Suite de regresión) | `pytest -v` falla en cualquiera de las `18` suites de pruebas dentro de `tests/`. |

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

## Apéndice A. Reproducibilidad

Desde una copia local de [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit a5e9bc1`):

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
