---
title: "Compuertas de Confirmación Medidas: Energía hasta la Finalización Correcta para Sistemas Agénticos"
deck: "Una compuerta que permite a un agente actuar solo después de que una verificación es aprobada, una cascada que intenta primero el método más económico, y las mediciones de energía de ambos, etiquetadas según cómo fue obtenida cada una."
lang: "es"
source: "gates"
complete: true
---

<div id="notational-intelligence-as-commit-law" class="anchor-alias" aria-hidden="true"></div>
<div id="metered-commit-gates-energy-to-correct-completion-for-agentic-systems" class="anchor-alias" aria-hidden="true"></div>

*Revisión db13599, 5 de noviembre de 2026. Datos y código: [research.openie.dev/data/](/data/#gates). PDF LaTeX: [/pdfs/latex/gates.pdf](/pdfs/latex/gates.pdf) ([source](/pdfs/latex/gates.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Descripción general

Este artículo define una compuerta que permite que una máquina actúe solo después de que una verificación sea aprobada, y una regla que intenta primero el método más barato. Informa resultados de software y una medición de energía a nivel de placa, cada una etiquetada según cómo se obtuvo.

**En palabras sencillas**

1. Un ordenador no debe realizar una acción que no pueda deshacerse hasta que una verificación simple indique que es segura.
2. Debe intentar primero la forma más barata de completar una tarea y usar un modelo de IA grande solo si nada más barato funciona.
3. Cada decisión se registra con la energía que utilizó, de modo que cualquiera pueda verificarla después.

Este artículo tiene dos partes que comparten una regla: la corrección es la compuerta, y los julios son la clasificación. La Parte I es la compuerta de compromiso. Una propuesta no puede autorizarse a sí misma. Un acto irreversible se ejecuta solo detrás de un certificado, y cada decisión, compromiso o rechazo, se escribe en un recibo. La Parte II es Mezcla de Límites: una tarea necesita una energía esperada mínima para cerrarse, y la energía gastada después de que la tarea se completa no compra progreso verificado. Su instancia estándar es una cascada que intenta primero el engranaje más barato: Búsqueda, luego Fórmula, luego Solucionador, luego Modelo. La cascada se detiene tan pronto como el predicado de finalización de la tarea $C(z)$ se cumple, y rechaza con un recibo cuando el siguiente engranaje rompería el presupuesto. Entre los sistemas que completan la tarea correctamente, el que necesita menos julios se clasifica más alto.

Una medición de placa ancla la tela de la compuerta. En un AMD Kria KV260, el INA260 integrado en la placa lee diferencias A/B/A a nivel SOM de 11 428 pJ por ciclo de compuerta (error estándar 129 pJ, N = 4) para la tela de compuerta WCA, y 98,0 pJ por ciclo de semilla (error estándar 30,8 pJ, N = 4) para la tela de semilla. El INA260 está conectado a `VCC_SOM`, que alimenta el sistema de procesamiento, la lógica programable, la memoria DDR y los reguladores del módulo ([árbol de dispositivos KV260, `ina260@40`](https://gbmc.googlesource.com/linux/+/ccd1cdca5cd433c8a5dff78b69a79b31d9b77ee1/arch/arm64/boot/dts/xilinx/zynqmp-sck-kv-g-revB.dtso)), por lo que estas son diferencias de módulo completo, no una cifra de riel central o solo PL (Sección I.3.7). La diferencia de tela de semilla en la tabla de la Sección I.4.9 es +0,0098 W (error estándar 0,0031 W), lo que equivale a 9,8 mW, los mismos 98,0 pJ por ciclo de semilla a aproximadamente 100 MHz. Con la fuente de 5 V indicada para esta comparación eso corresponde a 1,96 mA, cerca de la resolución de corriente de 1,25 mA del componente, y la diferencia se informa como inconclusa hasta que se utilice un medidor de riel PL y se ejecuten al menos 10 pasadas.

<div id="01-contributions" class="anchor-alias" aria-hidden="true"></div>

### 0.1 Contribuciones

1. Un sobre de compromiso: propuesta, luego certificado, luego compromiso o rechazo, luego recibo. El certificado es conjuntivo: búsqueda permitir Y un predicado de energía, opcionalmente Y una función de barrera de control. Las razones de rechazo están tipificadas. Una implementación de referencia en Rust, Wise Computer Automation (WCA), lo ejecuta (Parte I).  
2. Un invariante de procedencia tipado. La salida etiquetada `ModelGenerated` nunca puede ser promovida a `Deterministic` (Partes I y II).  
3. Una cascada con rechazos nombrados, y la condición bajo la cual el más barato primero es óptimo en joules esperados, que se deduce del resultado de ordenación de Simon y Kadane para búsqueda secuencial: probar engranajes en orden decreciente de $p_i / c_i$, donde $p_i$ es la probabilidad de que el engranaje $i$ cierre la tarea y $c_i$ su energía esperada en joules (Simon y Kadane, 1975) (Parte II).  
4. Energía para la finalización correcta como el ranking, definido en la Sección 0.2.  
5. Recibos como instrumento. Cada recibo contiene el hash de la predicción y su marca de tiempo antes del acto, el resultado, la coincidencia, los joules por nivel (medidos, reportados, estimados, nunca sumados) y la razón del rechazo.

<div id="02-energy-to-correct-completion" class="anchor-alias" aria-hidden="true"></div>

### 0.2 Energía hasta la finalización correcta

Sea $C(z)$ el predicado de finalización de la tarea, con cualquier fecha límite escrita en él. Para un sistema $S$ con políticas $\pi$ y una tasa de fallos permitida $\delta$,

$$
J^*(S) = \min_{\pi} \; \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta .
$$

La corrección y las fechas límite son restricciones. Entre los sistemas que pasan la puerta, los julios solos los ordenan. Ordenar los sistemas por el número real $J^*$ constituye un preorden total, ya que cualquier par de reales se pueden comparar. Si cada lectura lleva un error de medidor de como máximo $\epsilon$ julios, dos sistemas cuyo $J^*$ difiere en más de $2\epsilon$ mantienen su orden. MLPerf Power coloca cada resultado de potencia detrás de un objetivo de precisión. $J^*$ tiene la misma forma.

<div id="03-how-to-read-this-paper" class="anchor-alias" aria-hidden="true"></div>

### 0.3 Cómo leer este artículo

Las secciones de la Parte I se numeran I.n y las secciones de la Parte II se numeran II.n. Cada parte tiene su propia lista de referencias. Dos figuras contienen las ideas principales: la Figura 1 (Sección I.1) dibuja la puerta de commit, y la Figura 2 (Sección II.1) dibuja el piso y la meseta de la Mezcla de Límites. Los precios y la demanda no se discuten aquí.

<div id="part-i" class="anchor-alias" aria-hidden="true"></div>
<div id="part-i-the-commit-gate" class="anchor-alias" aria-hidden="true"></div>

## Part I. La compuerta de confirmación

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="i-abstract" class="anchor-alias" aria-hidden="true"></div>

## I. Resumen

Los agentes proponen acciones. El trabajo irreversible comienza solo cuando se permite que una acción se ejecute. Este artículo trata ese paso de permiso como un objeto formal. La inteligencia notacional de Linus Lee es la observación de que un cambio en los símbolos puede hacer que algunos pensamientos sean baratos y otros expresables. La afirmación aquí es más estrecha. Para máquinas que pueden mover materia o invocar una herramienta irreversible, la notación útil es una ley de tiempo de ejecución: una propuesta no puede autorizarse a sí misma. La referencia de software, Wise Computer Automation (WCA), registra la ley como cuatro objetos bajo el esquema `wca.commit.v1`: una propuesta, un certificado, una razón de rechazo tipada y una decisión de compromiso. El certificado usado en la referencia es conjuntivo. Una tabla de búsqueda (LUT) allow bit debe cumplirse, y un predicado de energía debe cumplirse. Se puede añadir opcionalmente una función de barrera de control (CBF). Las llamadas de solo lectura pueden eludir la puerta. Las llamadas irreversibles no pueden.

Los números de energía en este artículo son productos de recuentos de operaciones y constantes analíticas de energía (un modelo OpCounter). No son potencia de la placa. El comportamiento de la puerta lógica programable en campo (FPGA) tiene tres clases aquí. La simulación de Icarus Verilog verifica la lógica de transferencia de registros emitida. Un Alchitry Pt V2 ejecuta la puerta de bucle cerrado y coincide con el software en cada decisión. No tiene medidor, por lo que su energía no está medida. Un AMD Kria KV260 ejecuta la trama de la puerta bajo su monitor de potencia INA260 integrado. Detener y ejecutar la misma bitstream, intercalado A/B/A, produce una diferencia medida a nivel de placa de 11,428 pJ por ciclo de puerta (error estándar 129 pJ, N = 4) para ocho evaluaciones paralelas de LUT allow, predicado de energía y barrera a 25 MHz. La trama de semilla más pequeña da 98.0 pJ por ciclo de semilla (error estándar 30.8 pJ, N = 4). Estos son `measured_j` a nivel de placa. No son lecturas de núcleo‑rail ni un costo de joule de planta de bucle cerrado (Sección I.3.7). La Etapa B está disponible como instrumento de navegador en https://research.openie.dev/living/fpga-sim/. Compila la misma puerta Rust a WebAssembly (WASM) y muestra el estado de LUT y trazas de compromiso a través de la API WebGPU. Ese instrumento es una emulación. No es una medición de dispositivo bajo prueba (DUT) y no es potencia de la placa Alchitry.

Los resultados de software medidos están acotados. En un episodio de péndulo de 16 pasos con semilla 1, la referencia compromete 1 paso y rechaza 15. La energía analítica del episodio es 8.6795e-10 joule. En la verificación port-Hamiltoniano de punto fijo Safe reportada, los falsos permisos contra el oráculo continuo de energía `Vdot <= epsilon` son 0 en las cuadrículas indicadas, y el precio es 79 falsos rechazos en 209,261 decisiones (Sección I.4.3). Ese es el par de seguridad y vivacidad en ese conjunto de pruebas (Sección I.4.10). Una demostración del Protocolo de Contexto de Modelo (MCP) rechaza una llamada a herramienta irreversible sin invocar al ejecutor. Una comparación de juguete con una barrera de conjunto de energía y un escudo discreto muestra desacuerdo entre definiciones de seguridad. Ninguno de estos resultados es una afirmación de liderazgo en energía de silicio, de rendimiento de control industrial, o de una medición de núcleo‑rail.

<div id="notation" class="anchor-alias" aria-hidden="true"></div>
<div id="i-notation" class="anchor-alias" aria-hidden="true"></div>

## I. Notación

Los términos se definen en su primer uso científico a continuación y se recopilan aquí para que las secciones posteriores puedan usar la forma abreviada.

| Término | Definición en este artículo |
|------|--------------------------|
| Inteligencia notacional | La afirmación de Lee de que mejores notaciones pueden elevar lo que una persona o sistema puede hacer de forma fiable, más allá de añadir solo herramientas. |
| Puerta de compromiso | Una regla de tiempo de ejecución que o bien aplica una acción propuesta o la rechaza. El proponente no obtiene un segundo canal informal. |
| Automatización Informática Sabia (WCA) | La referencia de software que implementa la puerta de compromiso en el límite entre una propuesta y un efecto irreversible. |
| Arquitectura Energía-Primero (EFA) | La elección de diseño de colocar un predicado de energía dentro del registro de permiso, no solo en un informe posterior. |
| Propuesta | Una acción candidata `u`, estado, y pistas analíticas de energía opcionales. No puede comprometerse. |
| Certificado | El registro de la puerta: LUT allow, predicado de energía, predicado CBF opcional, razones y métricas. |
| Razón de rechazo | Un código tipado como `lut_veto`, `energy_veto`, `cbf_veto`, `budget_exceeded`, o `policy`. |
| Decisión de compromiso | El sobre que establece la acción de planta a `u` o a cero. |
| Tabla de búsqueda (LUT) | Un mapa discreto de un código compacto a permitir o rechazar. |
| Multiplicador ternario de matriz de búsqueda (TLMM) | La ruta de propuesta de tabla de búsqueda ternaria barata de la referencia. |
| Función de barrera de control (CBF) | Un certificado de invariancia de conjunto cuando su desigualdad se cumple (Ames et al., 2019). |
| Protocolo de Contexto de Modelo (MCP) | Un transporte de llamada a herramienta. En este artículo es un adaptador bajo prueba, no un certificado de planta. |
| Sistema Uno | Procedimientos de decisión tipados (clase Laya / Jev) que eligen entre opciones conocidas en software. Son proponentes. |
| Port-Hamiltoniano | Un modelo de energía estructurado usado aquí para una verificación de estilo pasividad en plantas de juguete. |
| Verificación en tiempo de ejecución (RV) | Comprobación de una propiedad en una traza en ejecución. Relacionado, no idéntico, al registro de compromiso. |
| Dispositivo bajo prueba (DUT) | Hardware medido bajo una carga declarada con un medidor declarado. Las ejecuciones KV260 de la Sección I.3.7 son las únicas mediciones DUT en este artículo. |
| Matriz de puertas programable en campo (FPGA) | Lógica reconfigurable. Este artículo informa simulación Verilog, un Alchitry Pt V2 programado con energía no medida, y lecturas de medidor a nivel de placa KV260 (Sección I.3.7). |
| WebAssembly (WASM) | Un objetivo de compilación portátil para el navegador. El emulador FPGA WASM Etapa B se distribuye en https://research.openie.dev/living/fpga-sim/. |
| WebGPU | La API GPU del navegador nombrada como la ruta de visualización y evaluación de cuadrícula para ese emulador. |
| Alchitry Pt V2 | La documentación del proveedor identifica un Xilinx Artix-7 XC7A100T. FPGA programado (cargado en SRAM) con la puerta de compromiso de bucle cerrado; energía no medida (Sección I.3.7). |
| DiffLogic | Redes de puertas lógicas diferenciables entrenadas hacia una estructura booleana (Petersen et al., 2022). |
| Estimación analítica de energía | `J = sum_op count_op * E_op` con constantes nombradas. No es potencia de placa. |
| Modeled | Una cantidad obtenida a partir de una fórmula declarada o estructura ajustada. |
| Simulated | Una cantidad obtenida ejecutando el software o modelo Verilog. |
| Board-measured | Una cantidad de un medidor en un dispositivo y carga declarados. Sólo las lecturas KV260 de NI-9 están en esta clase. |
| Oracle-safe | Acuerdo con el oráculo continuo de energía `Vdot <= epsilon` en la planta declarada. |
| Check-safe | El residual discreto Safe de punto fijo / Q16.16 que aproxima ese oráculo en la compuerta. |
| Set-safe | Invariancia de conjunto bajo un predicado de barrera o escudo (por ejemplo un CBF de conjunto de energía), que puede discrepar con oracle-safe. |

<div id="terms-used-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i-terms-used-here" class="anchor-alias" aria-hidden="true"></div>

### I. Términos utilizados aquí

Este artículo ya distingue tres predicados de seguridad. **Oracle-safe** significa el oráculo continuo `Vdot <= epsilon`. **Check-safe** significa el residual discreto Safe Q16.16 que rastrea ese oráculo en la compuerta. **Set-safe** significa invariancia de conjunto bajo una barrera o escudo. NI-4 muestra que check-safe y set-safe pueden discrepar. La referencia de software es la implementación en Rust que produce cada resultado simulado aquí. Las clases de evidencia se definen en la tabla de Notación: modelado, simulado, medido en placa. La bandera de página `board_metered` es verdadera debido únicamente a las lecturas KV260.

**Constantes analíticas.** `E_LUT_READ = 1e-12` J y las demás constantes OpCounter en la Sección I.3.4 son sustitutos de ingeniería para comparaciones relativas dentro de este modelo. No son mediciones calibradas en placa. No se deben interpretar como julios de silicio. Los recuentos de cero-false-allows contra el oráculo nombrado permanecen tal como se reportan.

**Figuras vivas.** Pila de commits: [/living/ni/#ni-diag-02](/living/ni/#ni-diag-02). Ejecutador Seed-1: [/living/ni/#ni-run-01](/living/ni/#ni-run-01). Safe false-allow=0: [/living/ni/#ni-run-02](/living/ni/#ni-run-02). Simulador Etapa B: [/living/fpga-sim/](/living/fpga-sim/).

**Alcance de la Parte I.** La Sección I.2 coloca el registro de commits contra la investigación de notación, teoría de la información, resultados de escalado, redes LUT, certificados de control y aplicación en tiempo de ejecución. La Sección I.3 define los objetos, las plantas, el modelo analítico de energía, el instrumento del navegador y las placas. La Sección I.4 informa solo las cantidades producidas por la referencia de software, por las placas o por una fuente externa citada. La Sección I.5 responde a objeciones que tienen forma publicada. La Sección I.6 indica qué falsificaría las afirmaciones y qué no se midió.

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>
<div id="i1-introduction" class="anchor-alias" aria-hidden="true"></div>

## I.1. Introducción

Un modelo de lenguaje puede clasificar acciones. Clasificar no es permiso. El modo de falla que importa para una planta, una carcasa, un pago o un paso destructivo de laboratorio es un commit: la acción se ejecuta. Las puntuaciones suaves siguen siendo útiles aguas arriba. Son del tipo incorrecto en la rama irreversible, porque una probabilidad no indica qué predicado falló, y no obliga a que el comando del actuador sea cero.

Lee (2022) expone claramente una afirmación previa. La notación no es decoración. Una notación que hace que una operación sea ejecutable cambia qué errores pueden anotarse y cuáles pueden ocultarse. Iverson (1980) hizo el mismo punto para los lenguajes de arreglos: la notación es una herramienta de pensamiento. Engelbart (1962) trató el lenguaje, los artefactos, los métodos y la capacitación como un solo sistema. Kay (1972) y Victor (2013; charla de 2012) argumentaron que las representaciones deben mantener las consecuencias cerca de la idea que se está editando. Matuschak y Nielsen preguntaron por qué las herramientas para el pensamiento se estancan como productos. Esa literatura trata sobre cognición y medios. No especifica, por sí misma, un registro que una máquina deba obedecer antes de moverse.

El centro industrial de la inteligencia artificial reciente es la escala. Kaplan et al. (2020) y Hoffmann et al. (2022) informan sobre la escalabilidad de la pérdida con parámetros, datos y cómputo. Hooker (2021) sostiene que las ideas se difunden cuando encajan con el hardware y los núcleos disponibles. Esos resultados describen cómo la capacidad de un proponente crece con los recursos invertidos en él. No definen un predicado de commit.

La contribución de este artículo es una referencia de software para ese predicado, más un informe de lo que la referencia hace realmente en plantas de prueba. La contribución es composicional. Escudos LUT booleanos, certificados de energía, búsqueda ternaria en tabla y transportes de herramientas existen en trabajos previos. La referencia los conecta como una única decisión auditable: propuesta, luego certificado, luego rechazo tipado o commit. La afirmación es la existencia y el comportamiento de esta referencia, no la prioridad.

Tres declaraciones de medida restringen cada número posterior. Primero, los julios calculados por el OpCounter son estimaciones analíticas. Segundo, los resultados en Verilog son simulación. Tercero, los únicos julios de placa son las diferencias a nivel de placa KV260 de la Sección I.3.7, archivadas como `measured_j` con el medidor nombrado. La bandera de resultado de placa es verdadera solo para esas ejecuciones KV260. El Pt V2 permanece sin medir. Un lector debe poder distinguir lo modelado, lo simulado y lo medido en placa a partir de la cláusula metodológica adjunta al número.

Figura 1 dibuja la puerta de commit.

![Diagrama de flujo: proponer, luego certificar contra el predicado y el certificado, luego o bien commitear una acción en el mundo o rechazar sin acción. Ambos resultados escriben un recibo con un hash, julios y una razón.](/figures/gates/commit-gate.svg)

*Figura 1. La puerta de commit. Diagrama de proponer, certificar, commitear o rechazar, y recibo, como se define en la Sección I.3. Se proporciona una [copia PNG](/figures/gates/commit-gate.png)*.

<div id="i2-related-work" class="anchor-alias" aria-hidden="true"></div>

## I.2. Trabajo relacionado

<div id="21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>
<div id="i21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>

### I.2.1 Notación y herramientas para el pensamiento

Lee (2022) sostiene que inventar notaciones puede importar más que crear herramientas automatizadas adicionales, porque una notación cambia los pensamientos que son baratos. El registro de la entrevista con The Gradient es coherente con ese ensayo y no constituye un resultado empírico independiente. Iverson (1980), conferencia del Premio Turing, es la declaración clásica de la informática: la notación es una herramienta de pensamiento, y la ejecutabilidad forma parte de la prueba. Engelbart (1962) sitúa la inteligencia en un sistema humano‑más‑artefacto, no en un cerebro desnudo. Kay (1972) especifica un medio dinámico personal. Los trabajos de Victor, “Media for Thinking the Unthinkable” y “Inventing on Principle”, argumentan que los creadores necesitan representaciones cuyas consecuencias sean visibles mientras la idea aún se está formando. Matuschak y Nielsen, “How can we develop transformative tools for thought?”, documentan la adopción y los modos de falla institucionales de tales herramientas.

Este artículo utiliza esa línea de pensamiento para una inferencia limitada. Si una notación es ejecutable, algunos fallos se convierten en datos ordinarios en lugar de accidentes no representados. Una razón de rechazo tipada es un ejemplo. No respalda la afirmación fuerte de Sapir‑Whorf de que el lenguaje determina el pensamiento. La afirmación fuerte se rechaza en la Sección I.5. La afirmación débil, que es la de Iverson, es que una notación ejecutable cambia el costo de las operaciones y la representabilidad de los errores.

Chollet (2019) define la inteligencia como la eficiencia en la adquisición de habilidades y fundamenta la definición en la teoría de la información algorítmica. Esa definición trata sobre aprender nuevas habilidades, no sobre el compromiso.

<div id="22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>
<div id="i22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### I.2.2 Información, longitud de descripción y costo físico

Shannon (1948) define la entropía y la capacidad de canal. Shannon (1959) define la tasa‑distorsión: cuánta descripción se requiere para una fidelidad declarada. Kolmogorov (1965) define la longitud de descripción por el tamaño del programa. Solomonoff (1964) define la inferencia inductiva mediante una mezcla sobre programas. Chaitin (1977) desarrolla la complejidad por tamaño de programa. Cover y Thomas (2006) constituye la columna vertebral del libro de texto. Jaynes (1957) utiliza la entropía máxima como regla para distribuciones bajo restricciones. Brillouin (1956) conecta la información con la neguentropía física en la línea del demonio de Maxwell.

El entrenamiento por entropía cruzada de un modelo de lenguaje es un objetivo de teoría de la información sobre una distribución de datos. La charla de Sutskever en el Simons Institute en 2023, que es una charla y no un artículo, discute el aprendizaje no supervisado como compresión. Ese hecho no proporciona un certificado de Kolmogorov para una cadena particular, y no genera un bit de compromiso. La compresión estadística de una distribución de entrenamiento no es el mismo objeto que un conjunto permitido en tiempo de ejecución bajo una restricción de planta.

Landauer (1961) demuestra un límite inferior: el borrado lógicamente irreversible disipa al menos `kT ln 2` por bit en el modelo ideal. Bennett (1973) muestra que la computación lógicamente reversible puede evitar ese costo de borrado en el límite. Horowitz (2014) informa energía práctica de CMOS a escalas de picojulios para operaciones y movimiento de memoria, muy por encima del límite de Landauer, y trata la energía más que el recuento de transistores como la restricción. Mead (1990) es el argumento neuromórfico para la eficiencia analógica. Sandberg (2016) advierte que una potencia cerebral cercana a 20 vatios no limita la energía de un sistema ingenierizado entrenado desde cero. Un preprint de particionamiento cortical (arXiv:2102.06273) advierte adicionalmente contra tratar toda esa potencia biológica como cómputo comparable. Este artículo utiliza a Landauer y Horowitz como límites y tablas prácticas. No afirma que ningún modelo en la referencia opere cerca de `kT ln 2`.

<div id="23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-and-hardware-fit" class="anchor-alias" aria-hidden="true"></div>

### I.2.3 Escala y adecuación al hardware

Hestness et al. (2017), Kaplan et al. (2020) y Hoffmann et al. (2022) documentan el escalado empírico de la pérdida en aprendizaje profundo. Amodei y Hernandez (2018), una publicación del blog de OpenAI, describen el rápido crecimiento del cómputo de entrenamiento para resultados emblemáticos. La página es un ensayo de un proveedor. Este artículo no depende de un tiempo de duplicación específico de ella. Sutton (2019) argumenta que los métodos generales que utilizan cómputo han superado a los sistemas que codifican el contenido del conocimiento humano como características fijas. El ensayo no es un argumento contra toda restricción. Un predicado de compromiso es una restricción sobre la acción, no una característica de ajedrez construida a mano. Hooker (2021) explica por qué las alternativas pierden cuando la base instalada de chips y bibliotecas recompensa la multiplicación de matrices densas.

Este artículo clasifica por julios para la corrección de la finalización y separa el costo de la propuesta del permiso. Un precio no es un término en ninguno de los dos.

<div id="24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>
<div id="i24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>

### I.2.4 Redes LUT, búsqueda ternaria y lógica diferenciable

Umuroglu et al. (2020) asignan redes escasas de bajo número de bits a tablas de verdad en FPGA (LogicNets). Petersen et al. (2022) entrenan redes de puertas lógicas con relajaciones diferenciables (DiffLogic). Bacellar et al. (2024) entrenan redes sin pesos de LUTs (redes neuronales sin peso diferenciables). Ma et al. (2024) estudian modelos de lenguaje con pesos ternarios (BitNet b1.58). Wei et al. (2024) implementan multiplicación de matrices de bajo número de bits mediante búsqueda en tablas en CPUs (T-MAC). La línea TeLLMe (arXiv:2504.16266) es un diseño de multiplicación de matrices ternarias con LUT dirigido a la ejecución en FPGA. Estos sistemas demuestran que las tablas y las puertas constituyen un sustrato de cómputo real. No incluyen, en los artículos citados, un veto energético port-Hamiltoniano ni un sobre de compromiso tipado para un ejecutor de herramienta.

La referencia usa DiffLogic como una tabla de permiso ligera sobre características de juguete, y TLMM como una ruta de propuesta. Eso es una tarea diferente a usar una red lógica como el clasificador completo, que es la evaluación habitual de DiffLogic (conjuntos de referencia de visión, recuentos de puertas grandes). La Sección I.6 registra la brecha de capacidad.

<div id="25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>
<div id="i25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>

### I.2.5 Certificados, escudos y monitoreo en tiempo de ejecución

Ames et al. (2019) encuestan funciones de barrera de control como certificados de invariancia de conjunto, típicamente aplicadas mediante un filtro o un programa cuadrático. Alshiekh et al. (2018 preprint arXiv:1708.08611) introducen escudos que sustituyen acciones inseguras por seguras, mínimamente cuando es posible. Dawson, Gao y Fan (2022) encuestan certificados de Lyapunov y de barrera aprendidos y los modos de falla al tratar una red neuronal como un certificado sin una verificación. Manek y Kolter (2020) aprenden dinámicas estables con una estructura de Lyapunov. Greydanus, Dzamba y Yosinski (2019) aprenden redes neuronales Hamiltonianas. Roth et al. (2025) estudian redes neuronales port-Hamiltonianas estables. Yu, Zikelic y Henzinger (2024) reparan certificados neuronales usando monitores en tiempo de ejecución. Leung y Paré (arXiv:2512.24493) ofrecen garantías de seguridad bayesianas para sistemas port-Hamiltonianos con funciones de energía aprendidas. Su energía es la Hamiltoniana física de la planta. No es la energía de la computación. La ruta segura de esta referencia usa la energía en ese mismo sentido físico. Los julios de la computación son una cuenta separada (Sección I.3.4). Sanchez et al. (2018) encuestan taxonomías de verificación en tiempo de ejecución.

**La compuerta es un Simplex.** La arquitectura Simplex de Sha ejecuta un controlador de alto rendimiento no verificado junto a un controlador de seguridad verificado, y un módulo de decisión entrega el control al controlador de seguridad antes de que la planta abandone la región de la que puede recuperarse (Sha 2001). “Una propuesta no puede autorizarse a sí misma” es esa regla, trasladada de los bucles de control a llamadas de herramientas y actuadores. La garantía en tiempo de ejecución es su nombre en aviación y robótica. Tres resultados anteriores fijan el resto de la forma. Saltzer y Schroeder nombraron la mediación completa: cada acceso se verifica contra la autoridad, cada vez (1975). Un monitor de referencia es el mecanismo que realiza la verificación. El compromiso de dos fases de Gray separa la preparación del compromiso, de modo que ningún participante se compromete solo (1978). El código con prueba transportada de Necula envía una prueba que el host verifica antes de ejecutar código no confiable (1997). El registro de compromiso aquí es un monitor de referencia frente a efectos irreversibles, con un interruptor Simplex a rechazo y un certificado que el host verifica, como en el código con prueba transportada. Lo que la referencia añade a esa línea de trabajo es una conjunción y un libro mayor: un predicado de energía dentro del certificado, y julios en el mismo registro que la decisión.

La referencia no sustituye esa matemática. La ruta segura es una prueba conservadora de punto fijo de una identidad de energía conocida en un péndulo, `V = (1/2)(g theta^2 + omega^2)` con `Vdot = omega * u`. La CBF usada en la competencia de juguete es una desigualdad de conjunto de energía sobre el mismo `V`, no una afirmación de haber resuelto el programa cuadrático de Ames en un manipulador. La estructura de Lyapunov aprendida en un carrito‑polo es un segundo juguete, reportado en la Sección I.4, y no es un teorema de región de atracción para plantas arbitrarias.

<div id="26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>
<div id="i26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>

### I.2.6 Modelos de mundo, decisiones tipadas y transporte de herramientas

Ha y Schmidhuber (2018) y Hafner et al. (DreamerV3, arXiv:2301.04104) demuestran que los modelos aprendidos pueden proponer acciones a partir de trayectorias imaginadas. Los ensayos JEPA de LeCun (blog de investigación de Meta) abogan por modelos predictivos del mundo. LeCun et al. (2006) es el tutorial anterior sobre aprendizaje basado en energía. El error de predicción no es idénticamente cero en estos sistemas. Un predictor puede situarse aguas arriba de una compuerta. No puede reemplazar la compuerta a menos que sus predicciones sean perfectas y el modelo de planta sea la planta. Este artículo no compite con esos sistemas en los puntos de referencia de predicción.

Los modelos System One devuelven una respuesta tipada y una probabilidad para cada opción permitida en una única pasada hacia adelante, sin texto libre. TypeSafe AI nombró la categoría con su modelo Jev alojado (15 de septiembre de 2026). Siguieron los modelos abiertos, entre ellos Laya de Convai Innovations, un codificador con cabezas de decisión. Reducen el coste de generación cuando el conjunto de opciones está tipado y es conocido. El anuncio del Protocolo de Contexto de Modelo de Anthropic especifica el descubrimiento y el transporte para herramientas. El transporte entrega una llamada. No evalúa `Vdot`. En el adaptador MCP de la referencia, las herramientas irreversibles requieren un certificado antes de que el ejecutor se ejecute. Esa es una afirmación de ingeniería sobre este adaptador, probada por la demostración en la Sección I.4, no una afirmación sobre cada servidor MCP en producción.

<div id="27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>
<div id="i27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>

### I.2.7 Lo que aporta la composición

Los escudos rechazan acciones inseguras pero no se exportan, en los artículos citados, como el registro de confirmación de cuatro campos de la referencia con una cuenta analítica de julios. DiffLogic y las redes LUT calculan funciones. No son, en esos artículos, un veto frente a un proponente separado y a un ejecutor de herramientas. Los filtros de barrera conscientes de la energía son continuos. El bit de permiso de la referencia es una tabla. La afirmación composicional es el cableado: permiso LUT y predicado de energía y barrera opcional, registrado con una razón tipada, aplicado antes de un efecto irreversible, con la energía analítica mantenida distinta de la potencia de la placa. La Sección I.4 indica qué partes de ese cableado se ejecutaron.

<div id="28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-2025-to-2026" class="anchor-alias" aria-hidden="true"></div>

### I.2.8 Pares de certificación y confirmación (2025 a 2026)

Varios sistemas recientes imponen una decisión antes de que se ejecute una herramienta irreversible.

Shi et al., **Progent** (arXiv:[2504.11703](https://arxiv.org/abs/2504.11703)), verifican cada llamada a la herramienta contra reglas simbólicas de menor privilegio y utilizan un solucionador SMT de modo que el privilegio solo puede reducirse sin aprobación (confinamiento monótono). Chen, Kang y Li, **ShieldAgent** (ICML 2025; [proceedings.mlr.press/v267/chen25ae.html](https://proceedings.mlr.press/v267/chen25ae.html)), imponen circuitos de política de seguridad verificables sobre las trayectorias de acción del agente antes del blindaje. Yu, Žikelić y Henzinger (AAAI 2025; [doi:10.1609/aaai.v39i25.34840](https://doi.org/10.1609/aaai.v39i25.34840)) reparan certificados neuronales mediante monitoreo en tiempo de ejecución. Una línea complementaria verifica certificados de barrera de control ReLU en línea sobre una región de anticipación (arXiv:[2507.11987](https://arxiv.org/abs/2507.11987)).

**Qué añade la Parte I.** Esos pares son objetos de política, blindaje o reparación de certificados. Esta referencia envía un sobre de compromiso de cuatro campos (`proposal` → `certificate` → `commit|refuse` → receipt) con un bit de permiso LUT conjuntivo y un predicado de energía, razones de rechazo tipificadas y julios analíticos mantenidos separados de la potencia de la placa. El transporte (MCP) sigue siendo propuesta. Los julios de la placa existen solo para las ejecuciones KV260 en la Sección I.3.7, a nivel de placa.

<div id="i29-runtime-enforcement" class="anchor-alias" aria-hidden="true"></div>

### I.2.9 Aplicación en tiempo de ejecución

La puerta es un autómata de seguridad. Schneider mostró que los monitores de ejecución hacen cumplir exactamente las propiedades de seguridad [Schneider 2000](https://doi.org/10.1145/353323.353382), y Ligatti, Bauer y Walker ampliaron el monitor a autómatas de edición que suprimen o insertan acciones [Ligatti et al. 2005](https://doi.org/10.1007/s10207-004-0046-8). Falcone estableció cuándo aplicar la imposición en lugar de la verificación [Falcone 2010](https://doi.org/10.1007/978-3-642-16612-9_9), y Bauer, Leucker y Schallhart ofrecieron veredictos en tiempo de ejecución con tres valores [Bauer et al. 2011](https://doi.org/10.1145/2000799.2000800), que se corresponden con permitir, rechazar y `settle_refuse`. Lo que este artículo añade a esa línea es el predicado de energía en el certificado y el recibo. Los guardias de agente de 2024 a 2026 tienen la misma forma, una verificación entre una llamada de herramienta propuesta y su efecto: GuardAgent [arXiv:2406.09187](https://arxiv.org/abs/2406.09187) y AgentSpec [arXiv:2503.18666](https://arxiv.org/abs/2503.18666). PolicyGuide sostiene que una verificación en cada acción no puede dirigir un flujo de trabajo de varios pasos [arXiv:2608.19861](https://arxiv.org/abs/2608.19861); por eso la Parte II detiene el predicado de tarea $C(z)$ en lugar de la acción individual. El trabajo irreversible de varios pasos también requiere compensación, que las sagas proporcionan [Garcia-Molina and Salem 1987](https://doi.org/10.1145/38713.38742), y “una propuesta no puede autorizarse a sí misma” es el principio de monitor de referencia que los núcleos de capacidad como seL4 hacen cumplir mediante prueba [Klein et al. 2009](https://doi.org/10.1145/1629575.1629596). El escaneo 0-false-allow de la Sección I.4 es una prueba sobre una cuadrícula, no una demostración; la Sección I.6 establece ese límite, y se aplica a cada resumen del resultado.

<div id="i210-reference-points-for-the-board-figure" class="anchor-alias" aria-hidden="true"></div>

### I.2.10 Puntos de referencia para la figura de la tarjeta

Una implementación en FPGA de una función se espera que consuma más energía que un ASIC; Kuon y Rose midieron la brecha de potencia dinámica [Kuon and Rose 2007](https://doi.org/10.1109/TCAD.2006.884574), y Horowitz proporciona la energía CMOS por operación que enmarca tales cifras [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323). Una estimación de potencia del proveedor para el mismo bitstream junto a la lectura del SOM forma parte del protocolo PL-rail.

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>
<div id="i3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## I.3. Definiciones y métodos

<div id="31-objects" class="anchor-alias" aria-hidden="true"></div>
<div id="i31-objects" class="anchor-alias" aria-hidden="true"></div>

### I.3.1 Objetos

Fije un estado `x` y una acción candidata `u` en un conjunto `U`. Una propuesta es una tupla

```text
Proposal = (u, x, hints)
```

Los `hints` pueden incluir cantidades analíticas de energía. Una propuesta no tiene interpretación como permiso.

Un certificado es una tupla

```text
Certificate = (lut_allow, energy_ok, cbf_ok, reasons, metrics)
```

`lut_allow` y `energy_ok` son Booleanos. `cbf_ok` es un Booleano cuando el modo de composición seleccionado lo requiere, y está ausente en caso contrario. `reasons` es una lista de razones de rechazo. `metrics` incluye la cuenta analítica de energía y la bandera de resultado del tablero.

Los modos de composición en el README del esquema son:

```text
lut_and_energy        : commit <=> lut_allow AND energy_ok
lut_and_safe          : commit <=> lut_allow AND safe_energy_ok
lut_and_safe_and_cbf  : commit <=> lut_allow AND safe_energy_ok AND cbf_ok
```

Existen ablaciones `energy_only` y `lut_only` para que una comparación pueda eliminar un conjuntivo. No son el valor predeterminado para herramientas irreversibles.

Una decisión de commit es

```text
if commit then plant_action = u else plant_action = 0
```

con el certificado adjunto. El ejecutor para una herramienta irreversible se llama solo en la primera rama.

Registro trabajado. El archivo `artifacts/schemas/wca.commit.v1/examples/commit_decision_refuse.json` almacena un rechazo en el que `lut_allow` es verdadero y `energy_ok` es falso. El código de razón es `energy_veto`. La cadena de detalle del punto fijo es `Vdot_q=1461 > eps_q=13`. `plant_action` es `[0.0]`. El registro establece la bandera de resultado del tablero a falso. Un conjuntivo verdadero no compromete.

<div id="32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>
<div id="i32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>

### I.3.2 Plantas y oráculos

La planta primaria es un péndulo. Las cantidades de referencia continuas usadas por la verificación Safe son `g = 9.81`, `epsilon = 0.05`, `V = (1/2)(g theta^2 + omega^2)`, y `Vdot = omega * u`. `energy_ok` en el oráculo continuo significa `Vdot <= epsilon`.

La verificación discreta heredada es una aproximación de punto fijo Q8.8, coincidente a nivel de bits con el módulo Verilog `wca_ph_energy.v` en simulación. La verificación Safe (`SafeFixedPointPHCertificate`) usa Q16.16 y un residuo entero exacto. El predicado reportado es

```text
energy_ok <=> 4*omega_q*u_q + 2*(abs(omega_q)+abs(u_q)) + 1
              <= floor(4*epsilon*S^2)
```

con el argumento de redondeo dado en `artifacts/RESULTS.md`: bajo redondeo al más cercano con error de como máximo la mitad de un bit menos significativo, `Vdot` está acotado por `(prod + (1/2) abs + 1/4) / S^2`. El objetivo de diseño es unilateral. Si el predicado Safe lo permite, el oráculo continuo lo permite. La implicación inversa no es requerida. Los rechazos adicionales son un costo medido, no una contradicción de la dirección de seguridad.

Una segunda planta, carro‑polo, se usa solo en la simulación aprendida‑Lyapunov. El estado es `[x, xdot, theta, thetadot]`, con `g = 9.81`, masa del carro 1.0, masa del polo 0.1, longitud 0.5. `V` es una forma cuadrática `xi^T P xi / 2` con `P` definida positiva mediante una construcción de Cholesky más un múltiplo de la identidad. El ajuste es gradiente estocástico sobre una bisagra de `Vdot + alpha V` bajo una política lineal, semilla 42, 400 iteraciones, lote 32, `alpha = 0.15`, como se registra en `RESULTS.md`. La puerta continua es `Vdot <= 0.05`. La regla discreta Safe añade un margen de Lipschitz multiplicado por la mitad de un bit menos significativo. Esta es una simulación de una cuadrática ajustada en una caja. No es una prueba para otras plantas.

<div id="33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>
<div id="i33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>

### I.3.3 Ruta de permiso LUT y de propuesta

El LUT permitido en los episodios reportados es una exportación DiffLogic con máscara `21887` en cuatro características: theta absoluto, omega absoluto, `u` absoluto y un bit de energía, a menos que una sección indique lo contrario. TLMM es una tabla ternaria agrupada utilizada como proponente. La iso-corrección significa acuerdo con un producto matricial ternario ingenuo dentro de una tolerancia absoluta de 1e-12, que `RESULTS.md` registra como medido en software. El comportamiento de escala es lo que `wca-tlmm-scale` escribe bajo un presupuesto analítico de avance declarado. El presupuesto predeterminado discutido en los resultados es 2e-10 joule por avance, analítico, no eléctrico.

<div id="34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>
<div id="i34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>

### I.3.4 Modelo analítico de energía

`RESULTS.md` separa dos hechos. Los recuentos de operaciones son exactos en el OpCounter. Los julios son los recuentos multiplicados por constantes:

| Constante | Valor (julio) | Rol |
|----------|----------------|------|
| `E_LUT_READ` | 1e-12 | Lectura LUT |
| `E_BRAM_WORD` | 1e-11 | Palabra BRAM |
| `E_BITMASK_OP` | 5e-14 | Operación de máscara de bits |
| `E_ADD` | 5e-13 | Suma |
| `E_PACK` | 2e-13 | Empaquetado |
| `E_COMMIT_BASE` | 2e-11 | Sobrecarga de commit |
| `E_REFUSE_OVERHEAD` | 5e-12 | Sobrecarga de rechazo |

`J = sum count_op * E_op`. Estas constantes son sustitutos de ingeniería, no mediciones. Los contadores de estructura, como los aciertos de BRAM compartida, se informan y no se cobran a menos que cambien una lectura contabilizada. Cambiar una constante reescala cada julio analítico en sincronía. Por eso los números no pueden compararse con los tokens por julio de un proveedor, con la energía de MLPerf Tiny, o con una medición de riel. Pueden compararse entre modos dentro del mismo modelo.

La utilidad en las tablas internas es el recuento de commits. El recuento de commits no es una recompensa de tarea. Una política que realiza más commits puede obtener una mayor utilidad por julio mientras viola el oráculo de energía. La Sección I.4, por lo tanto, no trata la utilidad por julio como una métrica de seguridad.

<div id="35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>
<div id="i35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>

### I.3.5 Adaptador de herramienta

La clase `wca-mcp-gate` clasifica herramientas. Las herramientas de solo lectura pueden ejecutarse sin un registro de confirmación. Las herramientas desconocidas se tratan como irreversibles. Las herramientas irreversibles requieren un certificado bajo el modo de composición configurado, por defecto `lut_and_safe_and_cbf` en `artifacts/mcp_gate_demo.json`. En caso de rechazo, `executed` es false y `executor_calls` es 0. El ejecutor de demostración registra llamadas y no realiza entrada o salida del host. La cadena del método en el archivo de demostración es `rust_mcp_commit_gate_v1`.

<div id="36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>
<div id="i36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>

### I.3.6 Simulación de Verilog

El repositorio genera Verilog e imágenes de memoria para la LUT de permiso y la puerta de commit (`artifacts/fpga/`). `wca-rtl-verify` e Icarus Verilog verifican el comportamiento bit a bit de esos modelos contra el oráculo de software. Icarus ejecuta una simulación. No coloca, enruta ni mide un chip. Los informes de Vivado se incluyen solo para las ejecuciones KV260 de la Sección I.3.7, como utilización y cierre de temporización. Las estimaciones de potencia de Vivado no son resultados.

<div id="37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>
<div id="i37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>

### I.3.7 Instrumento de navegador y tarjetas

La ruta de completitud para la replicación tiene tres etapas. Existen las etapas A y B. La etapa C tiene dos tarjetas: una para el acuerdo de decisión y otra para joules.

Etapa A, presente. Los binarios Rust en `wca-commit` ejecutan el episodio, la verificación Safe, la demostración de la herramienta y la cuenta analítica de joules. Icarus simula Verilog emitido en una estación de trabajo.

Etapa B, enviada. El núcleo puro de decisión (propuesta entrante, certificado saliente, paso de planta, actualización analítica de joules) se compila a `wasm32` (`crates/wca-fpga-sim`). Una página estática en https://research.openie.dev/living/fpga-sim/ carga el módulo. WebGPU contiene las palabras LUT y un búfer de trazas de `(step, lut_allow, energy_ok, cbf_ok, decision)` para su visualización. Las marcas de tiempo de WebGPU no son joules. En seed-1 (16 pasos, theta 1.5, omega 3.0) el episodio WASM informa 1 comprometido, 15 rechazados, joule analítico 8.6795e-10, coincidiendo con la Etapa A. El módulo WASM es una emulación de las mismas funciones que ejecuta el crate Rust. No es un modelo de ciclo preciso de un Artix-7, no es un modelo de potencia por actividad de conmutación, y no sustituye a Icarus en el Verilog. La Etapa B no afirma un DUT Alchitry Pt V2.

Etapa C, tarjeta programada, energía sin medir. Se detectó y cargó un Alchitry Pt V2 (SRAM) con un bitstream de puerta de compromiso WCA de bucle cerrado: dinámica de planta de péndulo seed-1 en el tejido, propuesta TLMM, LUT permitido, residual port-Hamiltoniano Safe Q16.16, y residual de función barrera de control estilo Ames (CBF). El compromiso del tejido es `lut_allow ∧ energy_ok ∧ cbf_ok`. UART a 115200 8N1 coincidió con el oro compuesto del software en permitir/rechazar/comprometer (1 compromiso, 15 rechazos, único compromiso en el paso 6). En ese episodio de bucle cerrado seed-1 la conjunción CBF no cambió la traza de permitir/rechazar respecto a LUT y PH Safe solos (el único compromiso PH tiene u=0, por lo que la verificación Lie de CBF se mantiene). **Bucle cerrado** aquí significa que el estado de la planta evoluciona a partir de los compromisos y rechazos de la puerta en el tejido; no es una ROM de estímulo transmitido de estado de planta/propuesta. El Pt V2 **no tiene medidor de joules integrado**. No se conectó ningún medidor USB en línea ni shunt. Las estimaciones de potencia post-PAR de Vivado no son lecturas del DUT. La página del producto SparkFun nombra el FPGA XC7A100T-2FGG84I y enumera 101,440 celdas lógicas, 240 rebanadas DSP48E1, 4,860 Kb de RAM de bloque y 256 MB de DDR3L (https://www.sparkfun.com/alchitry-pt-v2.html); esos siguen siendo especificaciones del fabricante. Métodos de medición del constructor: [/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy)

Etapa C, placa medida. Un AMD Kria KV260 lleva un monitor de potencia INA260 integrado (`ina260_u14`). Se ejecutaron tres series el 30 de septiembre de 2026, cada una como pases intercalados A/B/A con N = 4, asentamiento de 15 s y muestreo de 25 s a aproximadamente 4 Hz. La serie 1 compara una arquitectura de semilla de ejecución libre (439 LUTs) con el bitstream de referencia de la placa. Proporciona solo vatios, sin recuento de operaciones, por lo que no ofrece julios por operación. La serie 2 se detiene y ejecuta un bitstream de semilla (975 LUTs) a aproximadamente 100 MHz bajo un contador de operaciones en el dispositivo. La diferencia es +0.0098 W (error estándar 0.0031 W), lo que equivale a 98.0 pJ por ciclo de semilla (error estándar 30.8 pJ). La serie 3 se detiene y ejecuta el bitstream de compuerta: ocho carriles, cada uno la conjunción del LUT de permiso, el residual de energía Safe Q16.16 y el residual de barrera, en 6,370 LUTs y 128 slices DSP, con temporización cerrada a 25 MHz. La diferencia es +0.2857 W (error estándar 0.0032 W). A 2.4999 × 10⁷ ciclos de compuerta por segundo eso corresponde a 11,428 pJ por ciclo de compuerta (error estándar 129 pJ), aproximadamente 1.43 nJ por decisión de carril. La deriva A2 menos A1 fue +0.0047 W (error estándar 0.0040 W). Los hashes del bitstream y los registros están en el artefacto `wca-kv260-meter` de la referencia.

Lo que el medidor puede y no puede ver. El INA260 especifica un desplazamiento máximo de 5 mA y un error máximo de ganancia del sistema del 0.15 %, con un paso de corriente de 1.25 mA (hoja de datos TI INA260). El desplazamiento es común a A y B en la misma placa y riel, por lo que la diferencia entre detención y ejecución lo cancela. El error de ganancia escala la diferencia en un máximo del 0.15 %. El medidor detecta la potencia de la placa, de modo que la diferencia incluye el árbol de relojes y el enrutamiento conmutado por la habilitación, no solo la lógica de compuerta. La diferencia de la serie 2 está a aproximadamente tres errores estándar de cero. La de la serie 3 está a aproximadamente noventa. El siguiente protocolo es fijo: leer el riel central (VCCINT) a través de la telemetría del regulador del módulo o una unidad fuente‑medida; al menos 30 pares intercalados A/B aleatorizados; al menos 10⁹ evaluaciones de compuerta por bloque; temperatura del dado registrada con una línea base inactiva antes de cada bloque; valores brutos y restados reportados ambos; la estimación de potencia de Vivado reportada junto a la lectura con la discrepancia. La serie 3 no es un costo de joules de planta en bucle cerrado, y las constantes analíticas de la Sección I.3.4 no están calibradas por ella.

La razón científica de la etapa B es la replicación e inspección, no una nueva afirmación física. Un lector con un navegador ejecuta el mismo episodio semilla‑1 y lee el mismo bit de permiso y los códigos de razón que la caja imprime. El acuerdo con la etapa A es la prueba de aceptación para la etapa B, y se aprueba en la semilla 1. El acuerdo de decisiones es la prueba de aceptación para el Pt V2, y se aprueba en la semilla 1. Una lectura del medidor bajo una carga declarada es la prueba de aceptación para el KV260, y las series 2 y 3 la cumplen a nivel de placa.

<div id="38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>
<div id="i38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>

### I.3.8 Lo que no es un método de este artículo

No hay estudio con sujetos humanos. No hay afirmación sobre la relatividad lingüística más allá del rechazo en la Sección I.5. No hay extrapolación de entrenamiento y cómputo. No hay identificación de saciedad económica. No hay optimización contra el rendimiento de Groq, Etched o Taalas. No hay referencia de referencia de modelo mundial.

<div id="4-results" class="anchor-alias" aria-hidden="true"></div>
<div id="i4-results" class="anchor-alias" aria-hidden="true"></div>

## I.4. Resultados

Todas las cantidades en esta sección se simulan en la referencia de software a menos que una oración cite un artículo externo. Los julios analíticos utilizan la Sección I.3.4. Solo NI-9 se mide en la placa.

<div id="41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>
<div id="i41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>

### I.4.1 Afirmación NI-1. El registro de confirmación existe como esquema y tipo Rust

Los esquemas `Proposal`, `Certificate`, `RefuseReason` y `CommitDecision` se encuentran en `artifacts/schemas/wca.commit.v1/`. Los tipos de Rust están en `crates/wca-commit/src/schema.rs`. Las pruebas de ida y vuelta son `cargo test -p wca-commit`. Este es un resultado de existencia sobre la referencia, versión `wca.commit.v1`. No es un teorema de unicidad.

<div id="42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>
<div id="i42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>

### I.4.2 Afirmación NI-2. Episodio de péndulo Seed-1

```text
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

Resultado reportado: committed = 1, refused = 15, energía del episodio analítico = 8.6795e-10 joule. Los mismos recuentos de committed y refused y la misma energía analítica se informan para `--safe-ph` en esa semilla. `RESULTS.md` indica que el único commit es el paso 6. Nota de la cadena de herramientas en ese archivo: Rust 1.98. Volver a ejecutar el binario es la reproducción. La energía no es una medida de un chip.

<div id="43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>
<div id="i43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>

### I.4.3 Afirmación NI-3. Permisos falsos de la verificación de energía segura

`wca-ph-tighten` compara decisiones discretas con el oráculo continuo `Vdot <= epsilon`. En una cuadrícula de 21 al cubo más 200 000 muestras de Monte Carlo cercanas al umbral (209 261 decisiones):

| Ruta | Permitir falsos | Rechazar falsos | Ambos permitir | Ambos rechazar |
|------|-----------------|-----------------|----------------|----------------|
| Legado Q8.8 | 30836 | 105 | 104711 | 73609 |
| Seguro v1 (sobre‑aproximación Q8.8) | 0 | 42430 | 62386 | 104445 |
| Seguro v2 (residual Q16.16) | 0 | 79 | 104737 | 104445 |

`RESULTS.md` también indica que una cuadrícula más densa de 41 al cubo más 50 000 muestras de Monte Carlo, verificadas en `cargo test`, afirma que permitir falsos es igual a 0. Seguro v2 reduce los rechazos falsos de 42 430 a 79 respecto a Seguro v1 mientras mantiene los permisos falsos en 0. El legado Q8.8 no es seguro bajo esta definición: registra 30 836 permisos falsos. Estos recuentos son propiedades de la prueba numérica, no de un péndulo físico.

<div id="44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>
<div id="i44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>

### I.4.4 Afirmación NI-4. Comparación de barrera de juguete, ninguna definición domina

`wca-cbf-bakeoff` ejecuta semillas 0 a 4, 40 pasos, paso de tiempo 0.05, escala de acción 2.5, demo compartida TLMM y máscara DiffLogic `21887`. La barrera del conjunto de energía usa `h = 18 - V` y permite cuando `h >= 0` y `omega * u <= kappa * h` con `kappa = 0.05`. El escudo discreto permite un paso que permanece dentro de theta absoluto como máximo 2 y omega absoluto como máximo 4. Bucle cerrado significa diferente porque las trayectorias divergen. El archivo informa medias por episodio para compromisos y sumas para recuentos de violaciones. Filas seleccionadas:

| Filtro | Compromiso | Rechazo | J Analítico | Falsa autorización vs PH | `h < 0` | `Vdot > epsilon` |
|--------|------------|---------|--------------|--------------------------|---------|-------------------|
| `lut_and_safe_ph` | 1 | 38 | 2.153e-09 | 0 | 4 | 0 |
| `cbf_energy_set` | 1 | 38 | 2.056e-09 | 3 | 0 | 3 |
| `shield_discrete` | 18 | 21 | 2.306e-09 | 90 | 38 | 90 |
| `lut_only` | 40 | 0 | 2.544e-09 | 194 | 220 | 194 |

En esta planta y con este oráculo, `lut_and_safe_ph` tiene cero violaciones de `Vdot` y cuatro eventos `h < 0`. La barrera del conjunto de energía tiene cero eventos `h < 0` y tres violaciones de `Vdot`. El escudo compromete más y viola el oráculo de energía con frecuencia. `lut_only` coincide con `always_allow` en violaciones en la tabla reportada. El acuerdo fuera de línea en un flujo siempre‑permitir compartido de 200 pasos muestra 4 desacuerdos entre `lut_and_safe_ph` y `cbf_energy_set`, y 70 contra el escudo.

Interpretación dentro de la prueba: pasividad e invariancia de conjunto son predicados diferentes. La puerta LUT‑y‑energía no es equivalente a un filtro Ames, y no gana en cada columna. Una línea base de programa cuadrático completo en una planta más rica no está en esta tabla. Esa comparación sigue abierta. El resultado disponible es el desacuerdo, que constituye evidencia contra colapsar los dos certificados en una sola palabra.

<div id="45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>
<div id="i45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>

### I.4.5 Afirmación NI-5. Simulación Lyapunov segura del carro-péndulo

En la auditoría descrita en la Sección I.3.2 (rejilla n = 7 más 20 000 muestras límite dentro de la caja de Lipschitz, 26 487 decisiones), Safe aprendió Lyapunov frente al oráculo continuo `Vdot` registra falsos permitir 0, falsos rechazar 3, ambos permitir 15 925, ambos rechazar 10 559. El bucle cerrado significa que, en cinco semillas: `lut_and_safe_lyap` comete 11, rechaza 28, J analítico 2.719e-09, y registra cero falsos permitir contra ese oráculo. La barrera de nivel‑set sobre el mismo `V` comete 14 y registra 15 violaciones del oráculo de energía. El escudo discreto comete 29 y registra 95. Mismo patrón que el péndulo: el conjunto Safe sigue su propio oráculo; un certificado diferente sigue otro; la permisividad sin el oráculo no es seguridad.

Este es una planta simulada adicional. No establece la compuerta de compromiso en dinámicas industriales.

<div id="46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>
<div id="i46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>

### I.4.6 Afirmación NI-6. Demostración MCP

`artifacts/mcp_gate_demo.json` registra cuatro casos. La bandera board-result en el archivo es false.

| Caso | Clase | Ejecutado | Llamadas al ejecutor | Commit |
|------|-------|-----------|----------------------|--------|
| `read_only_bypass` | solo-lectura | true | (sin registro de commit) | ausente |
| `irreversible_refuse` | irreversible | false | 0 | false |
| `irreversible_allow` | irreversible | true | 1 | true |
| `shell_exec_gated` | irreversible | true | (gateado) | true |

El caso de rechazo enumera `energy_veto` (`vdot` 6.0 contra `eps` 0.05) y `cbf_veto`. La acción de la planta en ese caso es `[0.0]`. El caso de aceptación usa la composición `lut_and_safe_and_cbf` y la acción de la planta `[-0.02]`. La nota en el archivo indica que el rechazo nunca se ejecuta. Esto es una demostración del adaptador, no un estudio de campo de agentes que usan computadoras.

<div id="47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>
<div id="i47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>

### I.4.7 Afirmación NI-7. TLMM bajo un presupuesto analítico

`RESULTS.md` informa una configuración de demostración 2 por 4, grupo 2 cerca de 4,24e-11 joules analíticos, bajo el presupuesto directo. Las configuraciones más grandes que permanecen bajo el presupuesto directo de 2e-10 se detienen en 64 parámetros. Anchos de 8 por 16 y superiores superan ese presupuesto incluso después del optimizador. La iso-corrección contra la aritmética ternaria ingenua es una comparación de software con tolerancia 1e-12. Estas afirmaciones no dicen que el diseño coincida con el rendimiento de TeLLMe o con la energía de ninguna placa.

<div id="48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>
<div id="i48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>

### I.4.8 Afirmación NI-8. Permiso DiffLogic frente a un maestro de energía, solo de juguete

En el benchmark de puerta multi-semilla dura en `RESULTS.md`, después de la calibración del umbral y etiquetas más densas, DiffLogic iguala al docente de energía en tasa de rechazo 50.0 ± 15.9 por ciento, precisión en el umbral 0.890 ± 0.067 y recall 0.802 ± 0.076. La referencia de máscara de bits rechaza más (71.0 ± 14.9 por ciento) y recuerda menos (0.454 ± 0.266). Antes de la calibración, la tasa de rechazo de DiffLogic era 57.5 ± 14.1 por ciento con recall 0.724 ± 0.163. La coincidencia se da en este esquema de etiquetado toy. No es un resultado de ImageNet o de suite de control. La utilidad interna por joule aumenta para la puerta calibrada (3.570e9 frente a 3.212e9 antes) bajo el modelo analítico. Como indica la Sección I.3.4, esa razón utiliza el recuento de commits como utilidad.

<div id="49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>
<div id="i49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>

### I.4.9 Afirmación NI-9. Julios a nivel de tarjeta del tejido de compuertas

| Peldaño | Fabricación | Reloj | Diferencia (W) | Operación | Julios por operación | Etiqueta |
|---|---|---|---|---|---|---|
| 1 | Seed freerun vs board baseline | n/a | −0.8212 (SE 0.0024) | none | none | `measured_j`, watts only |
| 2 | Seed, halt vs run | about 100 MHz | +0.0098 (SE 0.0031) | one seed cycle | 98.0 pJ (SE 30.8) | `measured_j`, INA260, SOM rail (`VCC_SOM`) |
| 3 | Gate, 8 lanes, halt vs run | 25 MHz | +0.2857 (SE 0.0032) | one gate cycle, 8 decisions | 11,428 pJ (SE 129) | `measured_j`, INA260, SOM rail (`VCC_SOM`) |

N = 4 pasadas intercaladas A/B/A por peldaño. El signo negativo del peldaño 1 indica que la secuencia de bits de la semilla consume menos energía que la secuencia de bits de referencia de la placa. No implica que la semilla sea gratuita. La Sección I.3.7 muestra los límites de una lectura a nivel de placa.

<div id="410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>
<div id="i410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>

### I.4.10 Seguridad y vivacidad

Zero false allows es seguridad. Una puerta que rechaza todo también es segura, y es inútil. La vivacidad es el otro eje: false refuses, y la proporción de tareas que el agente con puerta completa. NI-3 informa ambos en la cuadrícula Safe. Safe v2 reduce false refuses de 42,430 a 79 con cero false allows. El episodio seed-1 compromete 1 paso de 16, y ese recuento por sí solo no indica si la planta alcanzó su objetivo. El informe requerido es una frontera por planta: tasa de finalización de tareas frente a la tasa de false-allow, un punto por modo de composición de NI-4 (`lut_only`, `shield_discrete`, `cbf_energy_set`, `lut_and_safe_ph`), cada punto con sus semillas y dispersión. En las cargas de trabajo del agente la misma frontera utiliza un conjunto de ataques para false allows y un conjunto de tareas benignas para la finalización. Una puerta se juzga en la frontera, no en un solo eje.

<div id="411-what-the-scan-supports" class="anchor-alias" aria-hidden="true"></div>
<div id="i411-what-the-literature-search-supports" class="anchor-alias" aria-hidden="true"></div>

### I.4.11 Lo que respalda la búsqueda bibliográfica

Una búsqueda bibliográfica en septiembre de 2026 (Secciones I.2.4 a I.2.9) no encontró ningún sistema publicado que combine una LUT booleana aprendida, un predicado de energía port-Hamiltoniano o de Lyapunov, y una propuesta de LUT ternaria como un único límite de commit con simulación RTL bit‑exacta y una cuenta analítica de joules. Los vecinos más cercanos son escudos, filtros de barrera conscientes de la energía, redes lógicas como modelo completo y diseños TLMM sin un certificado de energía. La búsqueda respalda una declaración de brecha sobre la literatura que se revisó. No respalda una afirmación de prioridad sobre trabajo no publicado, y no respalda una afirmación de liderazgo energético.

<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>
<div id="i5-discussion" class="anchor-alias" aria-hidden="true"></div>

## I.5. Discusión

<div id="51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>
<div id="i51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>

### I.5.1 La escala no responde la pregunta de confirmación

Kaplan, Hoffmann, Hooker y Sutton describen cómo escalan la pérdida y la capacidad de propuesta. Un proponente más grande aún puede emitir una acción que falla `Vdot <= epsilon`. Colocar ese proponente detrás del certificado utiliza la escala donde la evidencia indica que la escala funciona, y emplea el predicado donde la escala está en silencio. La Lección Amarga objeta a las características humanas congeladas que bloquean el aprendizaje. No implica eliminar un predicado de seguridad. Si un resultado futuro muestra que una política sin restricciones cumple la misma prueba de falsos‑permitidos a menor costo analítico y con error de tarea igual, la preferencia de ingeniería de NI-3 por la compuerta se vería debilitada en esa planta. La distinción lógica entre propuesta y permiso permanecería.

<div id="52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>
<div id="i52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>

### I.5.2 El lenguaje natural y MCP son transporte y propuesta

MCP resuelve el descubrimiento y la forma de llamada. System One resuelve algunas decisiones sin generación libre. Ningún objeto es `energy_ok`. La demostración en NI-6 muestra una denegación que no llama al ejecutor. Una implementación en producción podría eludir el adaptador. La afirmación no es que el protocolo haga imposible eludirlo. La afirmación es que el permiso debe ser un registro separado si se desean auditar efectos irreversibles.

<div id="53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>
<div id="i53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>

### I.5.3 El determinismo lingüístico fuerte no es la afirmación

La hipótesis fuerte de que el lenguaje determina el pensamiento no es una premisa. La declaración operativa es local. En este esquema, un commit sin un certificado de paso no es un registro exitoso. Una cadena de confianza no tipada puede almacenarse junto a una bandera de éxito y aún así dejar la razón sin declarar. El enum elimina esa ambigüedad particular. No describe la cognición humana.

<div id="54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>
<div id="i54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>

### I.5.4 El formalismo puede ser costoso; este predicado es pequeño

Requerir una prueba del agente completo en cada paso dominaría el presupuesto. La referencia formaliza un límite. Las llamadas de solo lectura lo evitan. El residual Seguro es una desigualdad de punto fijo, no una consulta SMT general. La energía del episodio analítico de NI-2 es 8.6795e-10 joule bajo las constantes indicadas. No puede expresarse como una fracción de la energía de la placa de un modelo generativo, porque esa comparación no se midió. Una división entre joules de propuesta y joules de compuerta en una carga de trabajo de agente real no está presente en los resultados. Hasta que lo esté, la objeción de costo se responde para esta compuerta de juguete y sigue abierta para certificados grandes.

<div id="55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>
<div id="i55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>

### I.5.5 Un modelo incorrecto con luz verde es un fallo real

Si `V` no es la energía de la planta, `energy_ok` puede ser verdadero mientras la planta no es segura. La mitigación presente en la referencia es un gemelo continuo en los juguetes, un código de razón separado y una negativa a tratar una probabilidad como un certificado. La mitigación no presente es la estabilidad de entrada a estado perturbada, una región de atracción verificada, o un presupuesto de credibilidad bayesiano del tipo que estudian Leung y Paré. NI-4 es la evidencia de que dos certificados respetables discrepan. Ese desacuerdo es una razón para nombrar el predicado, no una razón para confiar en cualquiera de ellos fuera de su prueba.

<div id="56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>

### I.5.6 La teoría de certificados previa no se duplica aquí

Ames, Alshiekh, Dawson y los artículos sobre monitoreo en tiempo de ejecución ya definen filtros y monitores. La adición de NI-1 es el registro de producto y la composición con una exportación LUT y un ejecutor de herramienta en una referencia. Donde la barrera de juguete gana en invariancia de conjunto, el artículo lo dice (NI-4, NI-5). La composición es `cbf_ok` como otro conjuntivo cuando ese predicado es el requerido. No es una afirmación de que la LUT calcule el programa cuadrático de Ames.

<div id="57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>
<div id="i57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>

### I.5.7 Predictores y chips de inferencia especializados

Los modelos del mundo reducen parte del error de predicción y dejan un residuo. Los dispositivos de inferencia especializados cambian el costo de las propuestas. Las cifras de rendimiento del proveedor son informes del proveedor hasta que un medidor independiente las repite. La función de la puerta es la rama irreversible. Si la única interfaz de un dispositivo es una secuencia de tokens, el registro de confirmación aún debe residir en algún lugar antes de que los actuadores o herramientas irreversibles se ejecuten.

<div id="58-analytical-joules-are-not-a-costume-for-watts" class="anchor-alias" aria-hidden="true"></div>
<div id="i58-analytical-joules-are-not-watts" class="anchor-alias" aria-hidden="true"></div>

### I.5.8 Los julios analíticos no son vatios

Las constantes en la Sección I.3.4 son números de ingeniería elegidos. Permiten que los recuentos sean comparables dentro del repositorio. No están calibrados a una vía Artix-7. Informarlos como vatios de placa sería un informe de medida falso. El informe correcto es el que se da: los recuentos de operación se calculan; los julios analíticos se modelan; los julios de placa provienen únicamente del medidor KV260 y se archivan por separado. La Etapa B de la Sección I.3.7 hace que el mismo modelo sea inspeccionable en un navegador en https://research.openie.dev/living/fpga-sim/. No cambia la clase de medida. Los rungs KV260 lo hacen, para la estructura que ejecutaron.

<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>
<div id="i6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## I.6. Limitaciones y amenazas a la validez

Validez interna. Seed-1 es una condición inicial. La cuadrícula Safe es grande pero sigue siendo una caja elegida y un epsilon elegido. Las muestras Monte Carlo cerca del umbral ejercen presión sobre el límite que los diseñadores decidieron presionar. Un epsilon diferente o una identidad de planta diferente rompe la afirmación numérica hasta que se vuelve a ejecutar. El CBF en la prueba comparativa es una desigualdad de conjunto de energía implementada en el mismo crate, no un solucionador codificado independientemente a partir de una implementación de referencia de Ames. El desacuerdo es informativo. No se ha establecido una clasificación absoluta contra el código de la literatura.

Validez de constructo. El recuento de commits como utilidad no mide el éxito de la tarea. La falsa autorización se define contra un oráculo nombrado. Un sistema puede ser seguro respecto al oráculo y seguro en la verificación (cero falsas autorizaciones contra `Vdot <= epsilon`) y aun así fallar en la seguridad del conjunto (`h >= 0`), como muestra NI-4. Los lectores que traten “safe” como una sola palabra malinterpretarán la tabla.

Validez externa. Ambas plantas son juguetes. No hay manipulador, cuadricóptero o prueba con humano en el bucle. La demostración MCP no llama a una red. Verilog se simula. El instrumento del navegador se envía como simulación de Etapa B. El Alchitry Pt V2 coincide en decisiones y no está medido. La lectura KV260 es a nivel de placa y en bucle abierto. Los recuentos de celdas lógicas del proveedor no se confirman aquí.

Validez de medida. Las constantes analíticas pueden editarse a cualquier escala. Las comparaciones con las tablas de picojulios de Horowitz, con el límite de Landauer, o con los tokens del proveedor por julio no son válidas con estas constantes. Los escalones KV260 son un medidor a nivel de placa bajo una carga de trabajo declarada. Una lectura de núcleo‑raíl durante el episodio de bucle cerrado es la medida que falta. La potencia de la herramienta post‑place‑and‑route sería una tercera clase, aún no un medidor, y no se informa como resultado.

Informe estadístico. Donde `RESULTS.md` proporciona una media y una desviación estándar, este artículo las copia. No añade intervalos de confianza que no fueron calculados. La cobertura de múltiples semillas son cinco semillas en las pruebas comparativas y los rangos reportados del benchmark de puerta dura. Eso no constituye una afirmación de gran muestra.

No reclamado. Lo siguiente no son resultados: liderazgo de joules en silicio; operación cerca del límite de Landauer; potencia equivalente al cerebro; una victoria sobre System One en latencia; una victoria sobre benchmarks de modelo mundial; fuerte determinismo lingüístico; identificación de “inteligencia” con el recuento de commits.

Falsificadores. NI-2 es falso si el comando declarado en la revisión del crate indicada no imprime esos recuentos. NI-3 es falso si la prueba Safe v2 reporta una falsa autorización en la cuadrícula declarada. NI-6 es falso si el caso de rechazo en el archivo de demostración se ejecuta. NI-1 es falso si el esquema y el tiempo de ejecución divergen. Un emulador de Etapa B que discrepa con la Etapa A en la semilla 1 falla su propia prueba de aceptación. Un medidor futuro que asigna energía de placa al número analítico sin un estudio de calibración no confirma el modelo analítico.

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>
<div id="i7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## I.7. Conclusión

El artículo definió una decisión de commit como un certificado conjuntivo sobre un bit de permiso de LUT y un predicado de energía, con una barrera opcional, y mostró una referencia de software que emite la decisión antes de un efecto irreversible. En las pruebas de péndulo reportadas, la regla de punto fijo Seguro tiene cero permisos falsos contra su oráculo continuo `Vdot <= epsilon` en el conjunto de pruebas indicado, al costo de 79 rechazos falsos en 209,261 decisiones. En las comparaciones reportadas, ese oráculo no es el mismo que la invariancia del conjunto. La energía del episodio analítico para la ejecución seed-1 es 8.6795e-10 joule bajo constantes publicadas. El rechazo de la herramienta en la demostración MCP no llama al ejecutor. Las verificaciones Verilog son simulación. El instrumento WASM y WebGPU del navegador está disponible en https://research.openie.dev/living/fpga-sim/ de modo que la misma decisión pueda inspeccionarse sin una placa. Sigue siendo una simulación, no un resultado de DUT. El Alchitry Pt V2 concuerda con el software en cada decisión de la semilla 1 y permanece sin medir. El KV260 mide la tela de compuertas a nivel de placa: 11,428 pJ por ciclo de compuerta de ocho carriles a 25 MHz. La referencia es un artefacto de software medido y una tela medida en placa. El joule del chip en bucle cerrado es la próxima medición.

<div id="references" class="anchor-alias" aria-hidden="true"></div>
<div id="i-references" class="anchor-alias" aria-hidden="true"></div>

## I. Referencias

Simon, H. A., and Kadane, J. B. Optimal problem-solving search: all-or-none solutions. Artificial Intelligence 6(3), 235-247, 1975. https://doi.org/10.1016/0004-3702(75)90002-8

Alshiekh, M., Bloem, R., Ehlers, R., Konighofer, B., Niekum, S., and Topcu, U. Safe reinforcement learning via shielding. arXiv:1708.08611.

Ames, A. D., Coogan, S., Egerstedt, M., Notomista, G., Sreenath, K., and Tabuada, P. Control barrier functions: theory and applications. European Control Conference, 2019. https://doi.org/10.23919/ECC.2019.8796030

Amodei, D., and Hernandez, D. AI and compute. OpenAI, 2018. https://openai.com/index/ai-and-compute/

Anthropic. Introducing the Model Context Protocol. https://www.anthropic.com/news/model-context-protocol

Bacellar, A., et al. Differentiable weightless neural networks. arXiv:2410.11112.

Bauer, A., Leucker, M., and Schallhart, C. Runtime verification for LTL and TLTL. ACM Transactions on Software Engineering and Methodology 20(4), 14, 2011. https://doi.org/10.1145/2000799.2000800

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Brillouin, L. Science and Information Theory. Academic Press, 1956.

Chaitin, G. J. Algorithmic information theory. IBM Journal of Research and Development, 1977. https://doi.org/10.1147/rd.214.0350

Chen, Z., Kang, M., and Li, B. ShieldAgent: Shielding Agents via Verifiable Safety Policy Reasoning. ICML 2025 (PMLR v267). arXiv:2503.22738. https://proceedings.mlr.press/v267/chen25ae.html

Chollet, F. On the measure of intelligence. arXiv:1911.01547.

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Dawson, C., Gao, S., and Fan, C. Safe control with learned certificates: a survey of neural Lyapunov, barrier, and contraction methods. arXiv:2202.11762.

Engelbart, D. C. Augmenting human intellect: a conceptual framework. 1962. https://www.dougengelbart.org/pubs/augment-3906-Framework.html

Falcone, Y. You should better enforce than verify. Runtime Verification (RV 2010), Lecture Notes in Computer Science 6418, 89-105. Springer, 2010. https://doi.org/10.1007/978-3-642-16612-9_9

Garcia-Molina, H., and Salem, K. Sagas. Proceedings of ACM SIGMOD 1987, 249-259. https://doi.org/10.1145/38713.38742

Gray, J. Notes on data base operating systems. In Operating Systems: An Advanced Course, Lecture Notes in Computer Science 60, 393-481. Springer, 1978. https://doi.org/10.1007/3-540-08755-9_9

Greydanus, S., Dzamba, M., and Yosinski, J. Hamiltonian neural networks. arXiv:1906.01563.

Ha, D., and Schmidhuber, J. World models. arXiv:1803.10122.

Hafner, D., Pasukonis, J., Ba, J., and Lillicrap, T. Mastering diverse domains through world models. arXiv:2301.04104.

Henzinger, T. A., Kueffner, K., and Yu, E. Formal verification of neural certificates done dynamically. arXiv:2507.11987. https://arxiv.org/abs/2507.11987

Hestness, J., et al. Deep learning scaling is predictable, empirically. arXiv:1712.00409.

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Hooker, S. The hardware lottery. arXiv:2009.06489. Communications of the ACM, 2021. https://doi.org/10.1145/3467017

Horowitz, M. Computing's energy problem (and what we can do about it). IEEE International Solid-State Circuits Conference, 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Iverson, K. E. Notation as a tool of thought. Communications of the ACM, 1980. https://dl.acm.org/doi/10.1145/358896.358899

Jaynes, E. T. Information theory and statistical mechanics. Physical Review 106, 620, 1957. https://doi.org/10.1103/PhysRev.106.620

Kang, S., Yu, T., and Hwang, S. J. PolicyGuide: from guarding one action to guiding the whole workflow for policy-compliant LLM agents. arXiv:2608.19861. https://arxiv.org/abs/2608.19861

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Kay, A. A personal computer for children of all ages. 1972. https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf

Klein, G., et al. seL4: formal verification of an OS kernel. Proceedings of SOSP 2009, 207-220. https://doi.org/10.1145/1629575.1629596

Kolmogorov, A. N. Three approaches to the quantitative definition of information. 1965. English: International Journal of Computer Mathematics, 1968. https://doi.org/10.1080/00207166808803030

Kuon, I., and Rose, J. Measuring the gap between FPGAs and ASICs. IEEE Transactions on Computer-Aided Design 26(2), 203-215, 2007. https://doi.org/10.1109/TCAD.2006.884574

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

LeCun, Y. Path towards autonomous machine intelligence / JEPA discussion. Meta AI blog. https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/

LeCun, Y., Chopra, S., Hadsell, R., Ranzato, M., and Huang, F. J. A tutorial on energy-based learning. 2006. http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf

Lee, L. Notational intelligence. 2022. https://thesephist.com/posts/notation/

Leung, C. H., and Paré, P. E. Bayesian safety guarantees for port-Hamiltonian systems with learned energy functions. arXiv:2512.24493.

Levy, W. B., and Calvert, V. G. Cerebral cortical communication overshadows computational energy-use, but these combine to predict synapse number. arXiv:2102.06273.

Ligatti, J., Bauer, L., and Walker, D. Edit automata: enforcement mechanisms for run-time security policies. International Journal of Information Security 4, 2-16, 2005. https://doi.org/10.1007/s10207-004-0046-8

Ma, S., et al. The era of 1-bit LLMs: all large language models are in 1.58 bits. arXiv:2402.17764.

Manek, G., and Kolter, J. Z. Learning stable deep dynamics models. arXiv:2001.06116.

Matuschak, A., and Nielsen, M. How can we develop transformative tools for thought? https://numinous.productions/ttft/

Mead, C. Neuromorphic electronic systems. Proceedings of the IEEE, 1990. https://doi.org/10.1109/5.58356

Necula, G. C. Proof-carrying code. Proceedings of the 24th ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL '97), 106-119, 1997. https://doi.org/10.1145/263699.263712

Petersen, F., et al. Deep differentiable logic gate networks. arXiv:2210.08277.

Qiao, Y., Chen, Z., Zhang, Y., Wang, Y., et al. TeLLMe: an energy-efficient ternary LLM accelerator for prefilling and decoding on edge FPGAs. arXiv:2504.16266.

Roth, F., et al. Stable port-Hamiltonian neural networks. arXiv:2502.02480.

Saltzer, J. H., and Schroeder, M. D. The protection of information in computer systems. Proceedings of the IEEE 63(9), 1278-1308, 1975. https://doi.org/10.1109/PROC.1975.9939

Sanchez, C., et al. A survey of challenges for runtime verification from advanced application domains. arXiv:1811.06740.

Sandberg, A. Energetics of the brain and AI. arXiv:1602.04019.

Schneider, F. B. Enforceable security policies. ACM Transactions on Information and System Security 3(1), 30-50, 2000. https://doi.org/10.1145/353323.353382

Sha, L. Using simplicity to control complexity. IEEE Software 18(4), 20-28, 2001. https://doi.org/10.1109/MS.2001.936213

Shannon, C. E. A mathematical theory of communication. Bell System Technical Journal, 1948. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Shi, T., He, J., Wang, Z., et al. Progent: Securing AI Agents with Privilege Control. arXiv:2504.11703. https://arxiv.org/abs/2504.11703

Solomonoff, R. J. A formal theory of inductive inference, parts I and II. Information and Control, 1964.

SparkFun. Alchitry Pt V2 product page. https://www.sparkfun.com/alchitry-pt-v2.html

Sutskever, I. An observation on generalization. Simons Institute talk, 2023. https://www.youtube.com/watch?v=AKMuA_TVz3A

Sutton, R. The bitter lesson. 13 March 2019. http://www.incompleteideas.net/IncIdeas/BitterLesson.html

Texas Instruments. INA260 precision digital current and power monitor, data sheet. https://www.ti.com/lit/ds/symlink/ina260.pdf

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Umuroglu, Y., et al. LogicNets. arXiv:2004.03021.

Victor, B. Inventing on principle. 2012. https://www.youtube.com/watch?v=PUv66718DII

Victor, B. Media for thinking the unthinkable. https://worrydream.com/MediaForThinkingTheUnthinkable/

Wang, H., Poskitt, C. M., and Sun, J. AgentSpec: customizable runtime enforcement for safe and reliable LLM agents. arXiv:2503.18666. https://arxiv.org/abs/2503.18666

Wei, J., et al. T-MAC. arXiv:2407.00088.

Xiang, Z., Zheng, L., Li, Y., Hong, J., et al. GuardAgent: safeguard LLM agents by a guard agent via knowledge-enabled reasoning. arXiv:2406.09187. https://arxiv.org/abs/2406.09187

Yu, E., Žikelić, Đ., and Henzinger, T. A. Neural control and certificate repair via runtime monitoring. AAAI 2025. https://doi.org/10.1609/aaai.v39i25.34840 (arXiv:2412.12996).

Local measurement record: `artifacts/RESULTS.md` in the `wca-lut-edge` software reference. KV260 meter record: `artifacts/stage-c/wca-kv260-meter/` (protocol, claim status, A/B/A logs and summaries). Schema examples: `artifacts/schemas/wca.commit.v1/examples/`. Demo: `artifacts/mcp_gate_demo.json`.

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## I. Apéndice A. Reproducibilidad

Ruta de la estación de trabajo utilizada para generar los registros citados: el árbol `wca-lut-edge`, Rust 1.98 según lo registrado en `RESULTS.md`. Comandos cotidianos:

```text
cargo test -p wca-commit
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1 --safe-ph
cargo run --release --bin wca-ph-tighten -- --grid 21 --out artifacts/ph_tighten_report.json
cargo run --release --bin wca-cbf-bakeoff -- --out artifacts/cbf_bakeoff_report.json
cargo run --release --bin wca-lyap-plant -- --out artifacts/lyap_plant_report.json
cargo run --release --bin wca-mcp-gate -- --demo
cargo run --release --bin wca-tlmm-scale -- --out artifacts/tlmm_scale_report.json
```

Icarus Verilog era la versión 12.0 en la nota del entorno en `RESULTS.md`. Las verificaciones RTL son simulación. No se deben interpretar los julios analíticos como potencia de la placa.

La bandera board-result es verdadera para los escalones 1 a 3 del KV260 Stage C únicamente (Sección I.3.7), a nivel de placa. Todos los demás resultados en este documento son simulación o análisis.

<div id="appendix-b-browser-fpga-emulator-architecture-to-build" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-b-browser-fpga-emulator-architecture" class="anchor-alias" aria-hidden="true"></div>

## I. Apéndice B. Emulador FPGA en navegador: arquitectura

Este apéndice describe la arquitectura del emulador Stage B, que se ejecuta en https://research.openie.dev/living/fpga-sim/. Los números de acuerdo Seed-1 a continuación provienen de la ejecución WASM contra el dorado Stage A.

Módulos.

1. `decision_core`. Funciones puras ya representadas por el certificado Rust, paso de planta y acumulador de julios. No se requiere sistema de archivos ni hilos. Objetivo `wasm32-unknown-unknown`.
2. `lut_image`. La misma imagen de memoria que la ruta Verilog carga (`artifacts/fpga/wca_allow_lut.mem` y sucesores). La copia del navegador debe coincidir en hash con el archivo usado para la verificación Icarus.
3. `trace`. Un esquema fijo: índice de paso, estado, `u`, `lut_allow`, `energy_ok`, `cbf_ok`, códigos de razón, incremento analítico de julios, acción de planta. Nombres de campo idénticos a `wca.commit.v1` para que un volcado pueda compararse con el JSON del crate.
4. `webgpu_view`. Dispositivo, cola y un búfer de almacenamiento para la LUT y la traza. Un shader dibuja permitidos y rechazados. Un segundo despacho puede mapear el residual Safe a través de una cuadrícula. Los búferes son para inspección. No son un modelo de potencia.
5. `workstation_oracle`. Icarus sigue siendo el oráculo RTL. El navegador no lo reemplaza. Un desacuerdo entre WASM y el binario Rust falla la compilación. Un desacuerdo entre WASM e Icarus sobre la imagen LUT compartida falla la compilación. Ninguna comparación menciona vatios.

Pruebas de aceptación. La prueba seed-1 pasa (Sección I.3.7). Las demás son las verificaciones especificadas para el módulo.

- Seed-1, 16 pasos, theta inicial 1.5, omega 3.0: comprometido 1, rechazado 15, julio analítico 8.6795e-10, coincidente con NI-2.
- Humo de cuadrícula Safe: permiso falso 0 en un subconjunto publicado de la prueba de decisión 209,261, coincidente con la dirección NI-3.
- Vector de rechazo MCP: recuento de llamadas al ejecutor 0, coincidente con NI-6.
- Una prueba unitaria que la lectura del búfer WebGPU sea igual a la traza WASM. Si la lectura no está disponible, la página debe mostrar que la ruta GPU no confirmó la traza, y la traza CPU WASM permanece como resultado.

Seguimiento físico para **joules** de la placa. Stage C ya programó una compuerta de compromiso en bucle cerrado en la Alchitry Pt V2 con acuerdo de decisión UART; la placa aún no tiene medidor de julios integrado. Un medidor de potencia USB en línea o un shunt más osciloscopio en el riel de 5 V, bajo una carga declarada, es lo que permitiría medir julios en la placa. Las estimaciones de Vivado / post-PAR no son ese medidor. Las cifras de celdas lógicas y memoria del proveedor siguen siendo cifras del proveedor. Ver [/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy).

Fuera del alcance del emulador: entrenar DiffLogic en el navegador y estimar la potencia dinámica Artix-7 a partir de un shader.

<div id="part-ii" class="anchor-alias" aria-hidden="true"></div>
<div id="mixture-of-limits-navigation-law-for-computer-intelligence" class="anchor-alias" aria-hidden="true"></div>
<div id="part-ii-the-cascade-mixture-of-limits" class="anchor-alias" aria-hidden="true"></div>

## Part II. La cascada (Mezcla de Límites)

<div id="mol-abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="ii1-the-rule" class="anchor-alias" aria-hidden="true"></div>

## II.1. La regla

Una tarea está dada por un predicado de completitud $C(z) \in \{0, 1\}$ sobre su estado $z$. Un **engranaje** es un mecanismo que puede cerrar la tarea: Búsqueda (leer un valor almacenado y verificado), Fórmula (evaluar una forma cerrada), Solucionador (ejecutar una búsqueda, optimizador o resolver con un certificado), o Modelo (ejecutar un generador aprendido). El engranaje $i$ tiene una probabilidad de paso $p_i$, la probabilidad de que alcance $C(z) = 1$ en la clase de tarea, y una energía esperada $c_i$ en julios (J).

El **piso** de una tarea es la menor energía esperada en la que alguna política sobre engranajes alcanza $C(z) = 1$ con probabilidad de falla como máximo $\delta$. Equivale a $J^*$ de la Sección 0.2. La **meseta** es la región de gasto más allá del piso: una vez $C(z) = 1$, ningún cálculo adicional puede elevar $C$, de modo que más julios no aportan nada al objetivo declarado.

**Mezcla de Límites** es la regla: probar los engranajes en un orden que minimice la energía esperada hasta el primer cierre, detenerse en el primer engranaje que cierra $C(z)$, y rechazar con un recibo cuando el siguiente engranaje excedería el presupuesto o no pudiera cambiar la decisión. Búsqueda → Fórmula → Solucionador → Modelo es el orden estándar. Es óptimo solo bajo la condición derivada en la Sección II.2. Cada cierre pasa por el registro de la Parte I: proponer, certificar, comprometer o rechazar, recibo.

**Dónde se sitúa el modelo.** Modelo último es un orden de prueba, no un veredicto sobre lo que los modelos pueden hacer. Snell et al. (2024) mostraron que una agenda de cómputo óptima en tiempo de prueba supera al mejor de N en más de 4× en eficiencia, y que en algunos problemas el cómputo en tiempo de prueba puede sustituir a un modelo mayor. Ese resultado se refiere a la agenda dentro del engranaje Modelo, que se cotiza en julios como cualquier otro engranaje. El engranaje Modelo se abre siempre que los engranajes más baratos no puedan cerrar $C(z)$, y se abre primero cuando su paso es tan raro que no cubre sus fallas.

Figura 2 dibuja el piso y la meseta para una tarea.

![Diagram of verified progress against spend for one task. Progress rises in steps as the cascade escalates from Lookup to Formula to Solver; the Solver closes the task, marking the floor. Past the floor the Model stage adds spend with no further verified progress, the plateau where value of information is zero.](/figures/gates/mol-plateau.svg)

*Figura 2. Mezcla de Límites en una tarea. Diagrama, no una medición. Se proporciona una [copia PNG](/figures/gates/mol-plateau.png)*.

**Mezcla de Límites no es Mezcla de Expertos.** El enrutamiento de Mezcla de Expertos (MoE) selecciona parámetros dentro de un modelo generativo (Shazeer et al., 2017; Fedus et al., 2022). Mezcla de Límites selecciona si y dónde gastar entre engranajes, y un modelo MoE puede servir como su engranaje Modelo.

| | MoE | Mezcla de Límites |
|---|---|---|
| Dónde se toma la decisión | Dentro de un modelo | Entre engranajes, antes de que cualquier modelo se ejecute |
| Objeto elegido | Qué parámetros se ejecutan | Qué engranaje cierra, o rechazar |
| Éxito | Verosimilitud del siguiente token | $C(z) = 1$, un compromiso certificado, y un recibo |
| Rechazo | No es un resultado nativo | Un resultado tipado con un recibo |

<div id="ii2-expected-energy-of-a-cascade-and-the-optimal-order" class="anchor-alias" aria-hidden="true"></div>

## II.2. Energía esperada de una cascada y el orden óptimo

**Dos engranajes.** Sea un engranaje ligero L con probabilidad de paso $q_L$ y energía $c_L$ que precede a un engranaje pesado H que siempre pasa, con energía $c_H$. Intentar L primero cuesta $c_L + (1 - q_L)\,c_H$ en expectativa. Intentar H primero cuesta $c_H$. Por lo tanto, L primero es más barato si y solo si

$$
c_L + (1 - q_L)\,c_H < c_H \iff c_L < q_L\, c_H .
$$

Por ejemplo, una búsqueda que cuesta $c_L = 10^{-9}$ J y que pasa en $q_L = 0.3$ de las tareas frente a una llamada a modelo que cuesta $c_H = 10$ J ahorra $q_L c_H - c_L \approx 3$ J por tarea en expectativa. Si $q_L$ cae por debajo de $c_L / c_H = 10^{-10}$, el orden se invierte.

**Muchos engranajes.** Para $n$ engranajes probados en secuencia hasta el primer paso, con resultados independientes, la energía esperada del orden $\sigma$ es

$$
\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j<k} \bigl(1 - p_{\sigma(j)}\bigr).
$$

Intercambiar dos engranajes adyacentes $a$ y luego $b$ cambia esta suma por un factor común a ambos términos multiplicado por $(c_a + (1-p_a)c_b) - (c_b + (1-p_b)c_a) = c_a p_b - c_b p_a$. Así $a$ debe preceder a $b$ si y solo si $p_a / c_a > p_b / c_b$, y el orden óptimo ordena los engranajes por $p_i / c_i$ decreciente (Simon y Kadane, 1975). El más barato primero es óptimo exactamente cuando los engranajes más baratos también tienen mayor probabilidad de paso por joule. Cuando eso falla, la cascada comienza en un engranaje más pesado. Bajo un presupuesto vinculante, los joules de intentos ligeros fallidos permanecen gastados, de modo que un selector que estima $p_i / c_i$ por tarea puede cerrar tareas que un orden fijo no puede.

**Piso físico.** Cualquier engranaje que borra $n$ bits de forma irreversible a temperatura $T$ disipa al menos

$$
E_{\text{Landauer}}(n, T) = n\, k_B T \ln 2, \qquad k_B = 1.380649 \times 10^{-23}\ \text{J/K},
$$

lo que equivale a $2.87 \times 10^{-21}$ J por bit a 300 K (Landauer, 1961; Bennett, 1973, para el límite reversible). Las operaciones CMOS medidas cuestan aproximadamente 0.9 pJ para una suma de punto flotante de 32 bits a 45 nm y entre 1 y 2 nJ para un acceso a DRAM (Horowitz, 2014, texto del artículo; las diapositivas plenarias dan entre 1.3 y 2.6 nJ para un acceso de 64 bits), ocho a doce órdenes de magnitud por encima de ese piso. El valor frecuentemente citado de 640 pJ por lectura DRAM de 32 bits no aparece en ese artículo ni en sus diapositivas y no se usa aquí. La cifra de Landauer en un recibo es, por tanto, un límite inferior etiquetado, nunca una medición.

**Modelo de costo del catálogo.** Antes de que un engranaje se ejecute, el software lo referencia de precio como

$$
E_{\text{est}}(x) = \theta(D)\,\mu(S, V),
$$

donde $\theta(D)$ (adimensional) escala con la clase de dificultad $D$ de la acción $x$ y $\mu(S, V)$ (J) es una energía de catálogo para el primitivo $S$ en la vista de hardware $V$. Ambos son constantes de catálogo, por lo que $E_{\text{est}}$ es una estimación usada para ordenar los engranajes. No se deriva de la física, y nunca se informa como una medición. El ranking entre sistemas que cierran la tarea usa joules medidos (Sección 0.2).

<div id="ii3-stopping-conditions" class="anchor-alias" aria-hidden="true"></div>

## II.3. Condiciones de parada

**Valor de la información.** Sea $B$ la recompensa de una decisión, $x$ el estado de información actual, $y$ una observación o cálculo adicional, $c(y)$ su energía, y $\lambda$ la tasa de cambio entre recompensa y julios. El valor neto es

$$
\Delta(x, y) = \mathbb{E}[B \mid x, y] - \mathbb{E}[B \mid x] - \lambda\, c(y)
$$

(Howard, 1966; Russell and Wefald, 1991). La regla rechaza la escalada cuando $\Delta \le 0$. Una vez $C(z) = 1$, los dos primeros términos son iguales para cualquier $y$ adicional en la tarea, por lo que $\Delta = -\lambda c(y) < 0$ y se sigue la detención.

**Cobertura gramatical.** Sea $G$ el conjunto de derivaciones verificadas disponibles para Lookup, Formula y Solver. Una consulta $q$ está cubierta cuando existe una derivación $q \vdash_G a$. Cuando $q$ está cubierta, el engranaje Model no se abre, porque un engranaje cubierto pasa con probabilidad 1 a menor energía que el engranaje Model, de modo que por la desigualdad de dos engranajes de la Sección II.2 va primero y cierra la tarea. Cuando $q$ no está cubierta y la política prohíbe el engranaje Model, la regla rechaza.

**Rechazo de asentamiento.** Un engranaje Solver que busca una configuración de baja energía o bien alcanza un punto fijo certificado (commit) o informa que no se asentará dentro de su presupuesto (refuse).

Razones de rechazo nombradas en la referencia del software:

| Razón | Condición |
|---|---|
| `voi` | $\Delta \le 0$ para cada paso siguiente disponible |
| `grammar` | No está cubierta y el engranaje Model no está permitido |
| `energy` | La estimación del siguiente engranaje supera el presupuesto restante |
| `efa_certificate` | La verificación del certificado falla antes del commit |
| `settle_refuse` | El Solver no se asienta dentro de su presupuesto |
| `primitive_gap` | Falta un primitivo requerido en el catálogo |
| `safety` | Una verificación de capacidad niega la acción |

<div id="ii4-provenance-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## II.4. Procedencia y recibos

Cada respuesta lleva una clase de reproducción que indica cómo se produjo: `Deterministic` (Lookup, Formula o un Solver certificado), `RetrievedCited`, `Composed` o `ModelGenerated`. El sistema de tipos prohíbe reforzar una clase: `ModelGenerated` no puede reescribirse como `Deterministic`. La energía en un recibo lleva una de tres etiquetas: **Estimated** (catálogo, Landauer o figura de combustible de instrucción), **Unmetered** (sin lectura) o **Metered** (un medidor nombrado devolvió una lectura). La referencia de software deja `measured_j` sin establecer a menos que un medidor devuelva. El catálogo de primitivas que la referencia navega, agrupado en familias, se denomina la Periodic Stack en este artículo; cada celda es Present (implementada) o Gap (ausente).

<div id="ii5-software-reference" class="anchor-alias" aria-hidden="true"></div>

## II.5. Referencia de software

La referencia de software `mixture-of-limits` (Apache-2.0 o MIT) tiene un arnés, `cargo run -p mol-cli -- prove`, que imprime `VERIFIED` para cada criterio y finaliza con código 0. El conjunto de pruebas del espacio de trabajo (`cargo test --workspace`) pasa (P0), y el arnés finaliza con código 0 (P1). Un criterio marcado como verificado indica que existe una implementación y que cumple con la especificación declarada. No es un teorema, ni una replicación independiente y tampoco una medición de energía. A fecha de la ejecución del 2 de octubre de 2026 el arnés imprime 43 criterios `VERIFIED` (esto reemplaza el recuento anterior de aproximadamente 29); la tabla a continuación enumera los criterios P2 a P24, y la sección II.5.1 a II.5.3 describe los criterios de brecha de producto A11 a A14 que se añadieron posteriormente. Los demás criterios no se enumeran en este artículo y se encuentran en el `PLAN.md` y en `product/ACCEPTANCE` de la referencia de software.

<div id="6-prove--claim-map" class="anchor-alias" aria-hidden="true"></div>

| Prueba # | Criterio | ID de reclamo | Reclamo | Nota de alcance | Medición |
|---|---|---|---|---|---|
| Prove # | Criterion (PLAN) | Paper claim id | Claim (one sentence) | Software reference / scope note | Measurement |
|---|---|---|---|---|---|
| P2 | Cierre determinista (doble ejecución) | `claim.mol.deterministic_close` | Mismas preguntas generan el mismo commit/refuse + id de límite. | ninguno | Sin medición |
| P3 | Cierre por fórmula/búsqueda sin modelo | `claim.mol.formula_lookup_no_model` | Landauer / conversión de unidades cierra COMMIT en Lookup o Formula; el modelo nunca respondió. | ninguno | Sin medición / Estimado (piso Landauer en el recibo) |
| P4 | VoI rechaza cuando `!allow_model` | `claim.mol.voi_refuse` | Pregunta de forma libre → REFUSE `voi`. | ninguno | Sin medición |
| P5 | Confirmar compromiso + rechazar asentamiento | `claim.mol.settle_ternary` | Asentamiento ternario → COMMIT; `will not settle` → REFUSE `settle_refuse`. | Stub de asentamiento referenciado por software; sin VM / FPGA | Sin medición |
| P6 | Rechazo de certificado al divergir | `claim.mol.efa_certificate_refuse` | Formula + `diverge` → REFUSE `efa_certificate`. | Certificado en árbol | Sin medición |
| P7 | Capacidad denegar por defecto mutar | `claim.mol.capability_deny_mutate` | `AutomateGate::default().gate(Mutate)` → Refuse. | ninguno | Sin medición |
| P8 | Etiquetas de recibo | `claim.mol.receipt_honesty` | Referencia de software: `measured_j=None`, estimación etiquetada (`EstimateKind`). | Cierre predeterminado en vivo RAPL/NVML FUERA DE ALCANCE | Sin medición / Estimado |
| P9 | `ModelGenerated` ↛ `Deterministic` | `claim.mol.replay_no_strengthen` | `TypedAnswer::weaken_to` devuelve `ReplayCoercion`. | ninguno | ninguno |
| P10 | Navegación periódica de pila en catálogo en vivo | `claim.mol.stack_live_catalog` | Familia + presente + escala → COMMIT en Lookup; 258 engranajes de Lookup/Formula/Solver/Navigate en vivo. | Calibración μ + hardware de silicio FUERA DE ALCANCE; referencia de software simulaciones Gap en la prueba | Sin medición |
| P11 | `primitive_gap` vía sondeo de registro | `claim.mol.primitive_gap` | Marcador Gap `physical_settle` + nombre ausente → REFUSE `primitive_gap` (no solo cadena). | ninguno | Sin medición |
| P12 | catálogo μ / impedancia | `claim.mol.mu_catalog` | Recibos estampan `mu_source=catalog`, `mu`, `landauer_floor_ratio`; `E≈θ·μ` (estimación del catálogo, no RAPL/`measured_j`). | Corpus de calibración μ FUERA DE ALCANCE | Estimado |
| P13 | Reproducción de transcripción de recibo | `claim.mol.receipt_replay` | Reproducción JSONL/en memoria reproduce commit/refuse + id de límite; el modelo nunca respondió. | ninguno | Sin medición |
| P14 | Z2 recuperar+citar | `claim.mol.z2_retrieve_cite` | Hecho factual sembrado → COMMIT `RetrievedCited` + ids de citación; desconocido → REFUSE `claim_unknown` (no inventar). | Corpus semilla solo en árbol | Sin medición |
| P15 | Z1 componer/síntesis | `claim.mol.z1_compose` | ≥2 reclamos citados → COMMIT `Composed` + `synthesis.composed_from`; faltante → REFUSE `compose_missing`; nunca lavado como Deterministic/RetrievedCited solo. | ninguno | Sin medición |
| P16 | Bucle de buzón de agente | `claim.mol.agent_mailbox` | Objetivo/Mensaje/Acción → cerrar → confirmar\|rechazar + recibo en la transcripción; la demostración activa fórmula/cita/componer COMMIT y voi/settle_refuse REFUSE; modelo frío; las banderas de medición se mantienen. | ninguno | Sin medición |
| P17 | Estado bitemporal + memoria | `claim.mol.bitemporal_memory` | Escribe solo en Mezcla de Límites cerrar COMMIT; Mutar denegar / recordar libremente → REFUSE; recordar → `RetrievedCited` + `memory:` cite; desconocido → `memory_unknown`. | ninguno | Sin medición |
| P18 | Enrutamiento de tejido + inventario de referencia de software | `claim.mol.fabric_soft_ref` | Inventario offline válido (`source=software_ref`, Cpu siempre); Búsqueda/Fórmula→Cpu; Liquidar→ThermoSettle\|Cpu; Modelo→Gpu* o REFUSE `fabric_unavailable`; detectar ≠ julios medidos. | Presencia wgpu en vivo opcional / no requerida para la prueba | Sin medición |
| P19 | Shell de escritorio sin cabeza | `claim.mol.desktop_headless` | `ShellSession` preguntar/cerrar → vista de recibo (zona/fabric/limite/estimated_j/`measured_j=None`); libro de julios; VoI rechazar; GUI no requerida. | GUI egui opcional | Sin medición / Estimado |
| P20 | Etiquetas de medidor del SO | `claim.mol.os_meter_honesty` | Función desactivada / VM / sin permiso → `measured_j=None`, componentes vacíos, `measure_source=unavailable`; los fixtures estampan fuentes etiquetadas; el cierre predeterminado permanece sin medición. | Sonda en vivo opcional (`energy-meter`) | Sin medición (predeterminado) / Medido solo cuando la sonda devuelve |
| P21 | Certificación de cápsula WASM | `claim.mol.wasm_capsule` | `add.wasm` bajo tiempo de ejecución stub; combustible → solo estimated_j; concesión FS/red / exceso de combustible / host-share → REFUSE; cerrar estampas cápsula. | Función `wasmtime` opcional | Sin medición / Estimado (combustible) |
| P22 | Ruta de sesión de carril de agente | `claim.mol.agent_lane` | Particiones de carril; `host_invoke` sin procedencia rechaza; confirmar palabra clave insuficiente; se necesita `GrantReceipt`; permitir estampas `AgentLaneReceipt`. | ninguno | Sin medición |
| P23 | Recibo de cómputo multitejido | `claim.mol.fabric_compute_receipt` | Inventario de referencia de software; `ComputeFabric` / `ScheduleDecision` / `ComputeStepReceipt` con `fabric_id`; estampas en cascada `fabric:route`; Fórmula CPU COMMIT; el modelo residual puede `fabric_unavailable`; `measured_j=None` en la ruta de referencia de software. | ninguno | Sin medición |
| P23b | Software suave de tejido en vivo | `claim.mol.fabric_live_soft` | Función desactivada permanece software_ref; Metal simulado/en vivo puede estampar `gpu_metal`; la fórmula permanece Cpu; falta Gpu* falla cerrado; la prueba no requiere una GPU; `measured_j=None` a menos que se mida. | Suave / detección opcional | Sin medición |
| P23c | wgpu / Metal kernel diminuto | `claim.mol.kernel_vector_add` | Vector-add WGSL de sala limpia; stub suave offline (mismo checksum); Gpu* estampa `kernel:vector_add` + `execution_proof`; medidor opcional superpuesto puede estampar paquete `measured_j` con `energy_honesty=measured` (nombre del campo); sin joules de paquete rail-sum. | Metal en vivo opcional; fixture OK para probar | Sin medir (por defecto) / Medido solo si el medidor devuelve |
| P24 | Certificar ecosistema e2e (un recibo) | `claim.mol.ecosystem_e2e` | Carril → tejido (referencia de software CPU) → WASM → etiquetas de energía (combustible estimado; muestra_de_medidor opcional) → host invoca solo con `GrantReceipt` → comprometer|rechazar en **un** recibo; rechazar-sin-concesión → `grant_receipt_required`. | ninguno | Sin medir / Estimado |

Fuera del arnés: contadores de energía en tiempo real (RAPL, NVML) como cierre predeterminado, detección de GPU en tiempo real, hardware de certificado en el dispositivo, pesos de modelo entrenados y medidores de silicio para celdas Gap. No se reclama nada.

<div id="ii51-phase-1-micro-perception-on-the-arena-a11-a14" class="anchor-alias" aria-hidden="true"></div>

### II.5.1 Micropercepción de fase 1 en la arena (A11, A14)

El arena evalúa la cascada en tareas tipificadas (decisión, cierre de ticket, riesgo) contra una línea base siempre‑modelo y una línea base de hoja pequeña. Las líneas base tipificadas se ejecutan con `phase1=false`. Con `phase1=true`, una cadena no estructurada de ticket, riesgo o decisión pasa primero por el transductor de AST de reglas en árbol (`mol phase1`) y solo después ingresa a la cascada; la entrada no reconocida es rechazada, por lo que el transductor nunca se usa como modelo y Model LAST permanece último. En la ejecución de referencia de software del 2 de octubre de 2026 (n = 36, America/New_York), la cascada cerró 36 de 36 correctamente y rechazó 5 de 5 casos de saciación, mientras que la línea base siempre‑modelo y la línea base de hoja pequeña obtuvieron cada una 28 de 36 y 0 de 5 en saciación. Los joules estimados medios fueron aproximadamente 2.1e-11 para la cascada, 5.0e-1 para la línea base siempre‑modelo y 2.5e-4 para la línea base de hoja. Estas son estimaciones de catálogo; `measured_j` no está configurado, y las cifras provienen de la tabla publicada por la referencia, no de una re‑ejecución para este artículo.

<div id="ii52-tier-1-os-meters-a13" class="anchor-alias" aria-hidden="true"></div>

### II.5.2 Medidores del sistema operativo de nivel 1 (A13)

Una característica de compilación opcional agrega sondas a nivel de paquete para que `measured_j` se rellene solo a partir de una lectura real: Linux RAPL (delta de `energy_uj` de powercap), NVIDIA (`nvidia-smi` potencia multiplicada por la ventana, o un delta de energía consumida, como energía total del GPU del dispositivo) y macOS (vatios `PSTR` de SMC multiplicados por la ventana, sin sudo; el canal del paquete Energy Model no se utiliza y nunca se suman los rieles). El arnés se ejecuta con la característica desactivada, por lo que `measured_j` permanece sin establecer allí. El criterio A13 sella los fixtures RAPL, NVML y SMC y prohíbe inventar un valor a partir de un porcentaje de utilización. Ninguna figura de la Parte II es una lectura de estas sondas.

<div id="ii53-primitive-distillation-a12" class="anchor-alias" aria-hidden="true"></div>

### II.5.3 Destilación primitiva (A12)

Después de un commit certificado del Modelo LAST, `mol distill` agrega una entrada de Búsqueda o Fórmula a un almacén con reproducción determinista; una propuesta no certificada nunca se destila. Un segundo paso sobre el patrón destilado luego cierra en Búsqueda o Fórmula sin abrir Modelo LAST (A12). Los recibos conservan `estimated_j` etiquetado como una estimación.

Reproducir: `cargo run -p mol-cli -- prove` (43 criterios incluyendo A1 a A14), `-- arena`, `-- phase1 "please close ticket as R-OK"`, `-- distill "ticket summary" --gear lookup --store product/fixtures/distill_store.json`. Código: [openIE-dev/mixture-of-limits](https://github.com/openIE-dev/mixture-of-limits).

<div id="ii6-related-work" class="anchor-alias" aria-hidden="true"></div>

## II.6. Trabajo relacionado

**Cascadas y metarazonamiento.** Viola y Jones (2001) ejecutaron una cascada de clasificadores potenciados en la que etapas baratas rechazan la mayor parte de las entradas. Russell y Wefald (1991) asignaron a cada cálculo su valor esperado para la red de decisión de su costo y se detuvieron cuando ninguno tenía valor neto positivo. Horvitz (1987) estableció el mismo intercambio para razonamiento limitado. Los algoritmos de cualquier momento intercambian computación por calidad con una parada interrumpible (Dean y Boddy, 1988; Zilberstein, 1996). El encadenamiento de modelos envía una entrada a un modelo mayor solo cuando uno menor está inseguro (Varshney y Baral, 2022), y FrugalGPT se detiene cuando un puntuador aprendido acepta la respuesta (Chen, Zaharia y Zou, 2023). Mixture of Limits difiere en tres aspectos: los engranajes incluyen mecanismos no neuronales antes de cualquier modelo; la parada es el predicado $C(z)$, no una puntuación aprendida; y el costo son julios en un recibo, no dólares o latencia.

**Gastar más allá de la respuesta.** Los modelos de razonamiento gastan tokens después de su primera respuesta correcta sin modificarla (Chen et al., 2024), y una encuesta recopila métodos que se detienen antes (Sui et al., 2025). La decodificación especulativa (Leviathan et al., 2023), Mixture-of-Depths (Raposo et al., 2024), la cuantización (Frantar et al., 2022; Lin et al., 2024) y las cachés KV paginadas (Kwon et al., 2023) reducen la energía de un engranaje de Modelo una vez que se ejecuta. No deciden si se ejecuta.

**Recuperación de fórmulas.** AI Feynman (Udrescu y Tegmark, 2020), SINDy (Brunton et al., 2016) y PySR (Cranmer, 2023) recuperan formas cerradas a partir de datos; AlphaGeometry (Trinh et al., 2024) y AlphaProof (Hubert et al., 2025) emparejan un proponente con un verificador simbólico o Lean. Cada uno produce engranajes de Fórmula o Solver certificado que completan tareas cubiertas con menor energía que un generador.

**Enrutamiento entre modelos.** Estos sistemas eligen qué modelo responde. Ninguno prueba primero un engranaje no neuronal o se niega con una razón tipificada.

| Sistema | Título | ID | Clase | Qué enruta o acelera | Energía o costo según lo reportado | Diferencia |
|---|---|---|---|---|---|---|
| **RouteLLM** | *RouteLLM: Learning to Route LLMs with Preference Data* (arXiv); el título del evento ICLR 2025 usa *from Preference Data* | arXiv:[2406.18665](https://arxiv.org/abs/2406.18665) · ICLR 2025 | Enrutador de preferencias (LLM fuerte↔débil) | Consulta → LLM fuerte o débil | Costo / calidad (API \$); reportado por los autores | Modelo↔modelo; sin piso de Búsqueda/Fórmula; sin rechazo tipado a comprometer |
| **PEARL** (routing) | *PEARL: Performance and energy aware routing for LLMs* | DOI:[10.1016/j.future.2025.108218](https://doi.org/10.1016/j.future.2025.108218) · FGCS 176:108218 | Enrutador multi-LLM consciente de energía | Consulta → LLM bajo límite de energía (EMM predice energía) | Los autores reportan enrutamiento consciente de energía (GPU/infra) | Aún elige un modelo; Mixture of Limits puede rechazar antes de cualquier modelo |
| **GreenServ** | *GreenServ: Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference* | arXiv:[2601.17551](https://arxiv.org/abs/2601.17551) · ICPE 2026 | Enrutador multi-LLM de banda contextual | Características de la consulta → LLM; precisión vs **energía GPU medida** (Zeus) | **Medido** (Wh GPU de los autores vía Zeus) en su conjunto de LLM | Enrutamiento de conjunto de modelos; la cascada Mixture of Limits es primero no neuronal |
| **VoltanaLLM** | *VoltanaLLM: Energy-Efficient and SLO-Aware Disaggregated LLM Serving via Adaptive Frequency Control and State-Space Routing* | arXiv:[2509.04827](https://arxiv.org/abs/2509.04827) | Servicio P/D-desagregado + frecuencia + ruta de espacio de estados | Instancias de prellenado/decodificación + frecuencia GPU bajo SLOs TTFT/ITL | **Medido** (autores; pyNVML en A100/GH200) hasta ~36.3% de energía GPU E2E vs línea base de frecuencia máxima (resultado de servicio en campo) | Enruta **instancias del mismo stack generativo**; Mixture of Limits puede nunca abrir la decodificación |
| **HCSpec** | *HCSpec: Two-Tier Horizontal Cascade Speculative Decoding for High-Efficiency Large Language Model Inference* | DOI:[10.18653/v1/2026.acl-long.353](https://doi.org/10.18653/v1/2026.acl-long.353) · ACL 2026 | Decodificación especulativa (borrador↔objetivo) | Cascada de borrador especializada por posición → verificación del objetivo | Aceleración de latencia (vs EAGLE-3 / AR) | Acelera la generación; no rechaza generación en pisos |
| **CAS-Spec** | *CAS-Spec: Cascade Adaptive Self-Speculative Decoding for On-the-Fly Lossless Inference Acceleration of LLMs* | arXiv:[2510.26843](https://arxiv.org/abs/2510.26843) · NeurIPS 2025 | Cascada auto-especulativa (borradores DSIA) | Etapas de borrador desde el objetivo (esparsidad/cuanto) + DyTC | Aceleración de latencia ~1.1×-2.3× AR (autores); tokens sin pérdida | Jerarquía de borradores interna al modelo ≠ pisos Mixture of Limits |
| **GCD** | *Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning* | arXiv:[2305.13971](https://arxiv.org/abs/2305.13971) · DOI:[10.18653/v1/2023.emnlp-main.674](https://doi.org/10.18653/v1/2023.emnlp-main.674) · EMNLP 2023 | Decodificación LLM con restricción gramatical | Enmascarar logits a CFG | Sin medición / métricas de calidad | Restringe **tokens**; Mixture of Limits restringe **commit** |

<div id="ii7-baselines-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## II.7. Líneas base y falsificadores

Una reclamación en cascada se prueba en un conjunto de tareas tipificado como una frontera de julios por tarea frente a la tasa de cierre. Los brazos son: siempre el modelo grande; siempre el modelo pequeño; un enrutador aprendido (Ong et al., 2024); una cascada puntuada (Chen, Zaharia y Zou, 2023); un selector que estima $p_i / c_i$ por tarea; y un oráculo que conoce el equipo suficiente más barato para cada tarea. El orden fijo Búsqueda → Fórmula → Solver → Modelo afirma la frontera solo donde su curva se sitúa por debajo de cada brazo. El orden se falsifica en una clase de tareas donde el $p_i / c_i$ medido no disminuye a lo largo de ella, según la derivación de la Sección II.2. Las reclamaciones del arnés se falsifican si `mol prove` no sale 0 en la revisión indicada.

<div id="ii8-limits" class="anchor-alias" aria-hidden="true"></div>

## II.8. Limitaciones

El arnés es una existencia constructiva en el software. Ninguna figura de la Parte II es una lectura de medidor: los catálogos y las energías de Landauer son estimaciones, y `measured_j` no está establecido en la ruta del arnés. El resultado de orden óptimo asume resultados de engranaje independientes; fallas correlacionadas cambian la energía esperada y requieren la suma completa de la Sección II.2 con probabilidades condicionales. Las probabilidades de paso $p_i$ deben estimarse por clase de tarea, y el error de estimación desplaza el orden. La comparación de fronteras de la Sección II.7 no se ha ejecutado.

<div id="ii-references" class="anchor-alias" aria-hidden="true"></div>

## II. Referencias

Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development* 17(6):525-532. https://doi.org/10.1147/rd.176.0525

Brunton, S. L., Proctor, J. L., and Kutz, J. N. (2016). Discovering governing equations from data by sparse identification of nonlinear dynamical systems. *PNAS* 113(15):3932-3937. https://doi.org/10.1073/pnas.1517384113

Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. arXiv:2305.05176.

Chen, X., et al. (2024). Do NOT Think That Much for 2+3=? On the Overthinking of o1-Like LLMs. arXiv:2412.21187.

CAS-Spec (2025). Cascade Adaptive Self-Speculative Decoding. NeurIPS. arXiv:2510.26843.

Cranmer, M. (2023). Interpretable Machine Learning for Science with PySR and SymbolicRegression.jl. arXiv:2305.01582.

Dean, T., and Boddy, M. (1988). An analysis of time-dependent planning. AAAI-88, 49-54.

Fedus, W., Zoph, B., and Shazeer, N. (2022). Switch Transformers. *JMLR* 23(120).

Frantar, E., et al. (2022). GPTQ. arXiv:2210.17323.

Geng, S., et al. (2023). Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning. EMNLP. https://doi.org/10.18653/v1/2023.emnlp-main.674

GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. ICPE. arXiv:2601.17551.

HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. ACL. https://doi.org/10.18653/v1/2026.acl-long.353

Horowitz, M. (2014). Computing's energy problem (and what we can do about it). ISSCC. https://doi.org/10.1109/ISSCC.2014.6757323

Horvitz, E. J. (1987). Reasoning about beliefs and actions under computational resource constraints. UAI. arXiv:1304.2759.

Howard, R. A. (1966). Information value theory. *IEEE Transactions on Systems Science and Cybernetics* 2(1):22-26. https://doi.org/10.1109/TSSC.1966.300074

Hubert, T., et al. (2025). Olympiad-level formal mathematical reasoning with reinforcement learning. *Nature*. https://doi.org/10.1038/s41586-025-09833-y

Kwon, W., et al. (2023). Efficient Memory Management for Large Language Model Serving with PagedAttention. arXiv:2309.06180.

Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development* 5(3):183-191. https://doi.org/10.1147/rd.53.0183

Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. ICML.

Lin, J., et al. (2024). AWQ. MLSys. arXiv:2306.00978.

Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. arXiv:2406.18665.

PEARL (2025). Performance and energy aware routing for LLMs. *Future Generation Computer Systems* 176:108218. https://doi.org/10.1016/j.future.2025.108218

Raposo, D., et al. (2024). Mixture-of-Depths. arXiv:2404.02258.

Russell, S., and Wefald, E. (1991). Principles of metareasoning. *Artificial Intelligence* 49:361-395. https://doi.org/10.1016/0004-3702(91)90015-C

Shazeer, N., et al. (2017). Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer. ICLR. arXiv:1701.06538.

Simon, H. A., and Kadane, J. B. (1975). Optimal problem-solving search: all-or-none solutions. *Artificial Intelligence* 6(3):235-247. https://doi.org/10.1016/0004-3702(75)90002-8

Snell, C., Lee, J., Xu, K., and Kumar, A. (2024). Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters. arXiv:2408.03314.

Sui, Y., et al. (2025). Stop Overthinking: A Survey on Efficient Reasoning for Large Language Models. arXiv:2503.16419.

Trinh, T. H., et al. (2024). Solving olympiad geometry without human demonstrations. *Nature* 625:476-482. https://doi.org/10.1038/s41586-023-06747-5

Udrescu, S.-M., and Tegmark, M. (2020). AI Feynman. *Science Advances* 6(16). https://doi.org/10.1126/sciadv.aay2631

Varshney, N., and Baral, C. (2022). Model cascading. EMNLP. https://doi.org/10.18653/v1/2022.emnlp-main.756

Viola, P., and Jones, M. (2001). Rapid object detection using a boosted cascade of simple features. CVPR. https://doi.org/10.1109/CVPR.2001.990517

VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. arXiv:2509.04827.

Zilberstein, S. (1996). Using anytime algorithms in intelligent systems. *AI Magazine* 17(3).

<div id="ii-appendix-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## II. Apéndice. Reproducibilidad

```bash
cargo test --workspace
cargo run -p mol-cli -- prove   # expect 43 VERIFIED lines (A1 to A14 included), exit 0
cargo run -p mol-cli -- arena   # refresh the arena table from a real run only
```
