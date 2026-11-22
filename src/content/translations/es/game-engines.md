---
title: "Escribir un juego una vez y ejecutarlo en todas partes: dónde termina la reproducción exacta y empieza la tolerancia"
deck: "¿Se puede escribir un juego una vez como una máquina de estados verificada y proyectarlo en varios motores, conjuntos de instrucciones y pilas gráficas? Ejecutado a través de 25 celdas de destino × anfitrión multi-ISA durante 100.000 ticks bajo física entera Q32.32 (GE-H1: 0 / 20.500 discrepancias SHA-256 en arm64 macOS, aarch64 Linux y AMD/Intel x86_64 Linux), 25.000 ticks en coma flotante entre ISA (GE-H2: t_div = 10 Apple libm frente a GNU glibc sin/cos, t_div = 406 x86_64 FMA frente a arm64 fmadd sin -ffast-math) y 4 GPU físicas a través de Metal y Vulkan (GE-H3: deriva de píxeles LSB del 1,3 % al 9,3 %, Δ_max ≤ 2, PSNR 64,2-72,1 dB, SSIM ≥ 0,99983), emparejado con un prototipo jugable de WebXR/Canvas presupuestado en julios con Q32.32."
lang: "es"
source: "game-engines"
complete: true
---

<div id="writing-a-game-once-and-running-it-everywhere-where-exact-replay-ends-and-tolerance-begins" class="anchor-alias" aria-hidden="true"></div>

*Revisión af57f48, 22 de noviembre de 2026. Explorador interactivo, inspector entre GPU y Chrono-Budget Arena jugable en `Q32.32`: [research.openie.dev/living/game-engines/](/living/game-engines/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

Este estudio se pregunta si un juego puede escribirse una vez como una máquina de estados verificada y luego proyectarse a través de lenguajes, arquitecturas de conjunto de instrucciones de la unidad central de procesamiento (CPU) (ISA), y back-ends de la unidad de procesamiento gráfico (GPU). Tanto las especificaciones encuestadas como tres suites empíricas de falsificación ejecutadas establecen un límite claro: **sí** para reglas del juego y simulación bajo aritmética entera de punto fijo fijada (`(GE-H1)`: `0 / 20,500` desacuerdos de punto de control Secure Hash Algorithm 256-bit (`SHA-256`) a lo largo de `100,000` ticks de una arena 2D de 16 cuerpos proyectada en `25` celdas objetivo × host en `arm64` `macOS 27.2.1`, `aarch64` `Linux 6.8`, y Advanced Micro Devices (`AMD`) Zen 5 e Intel Raptor Lake `x86_64` `Linux 7.0`, abarcando de `0.073 J` a `13.60 J` en macOS por proceso `reported_j` y de `1.89 J` a `181.87 J` en Linux con límite de potencia promedio (`RAPL`) paquete `reported_j`); **no** cuando transcedentales de punto flotante no fijados o la reducción de multiplicación-acumulación fusionada (`FMA`) introducen colisiones caóticas multibody (`(GE-H2)`: incluso *sin* `-ffast-math`, `libSystem` `libm` de Apple frente a `glibc` `std::sin`/`std::cos` del sistema Linux divergen en el tick `10`, ISA cruzada `x86_64` `-mavx2 -mfma` frente a `arm64` `fmadd` divergen en el tick `406`, y `Math.sin` de V8 diverge entre ISAs en el tick `66`); y **no** para píxeles bit-exactos entre proveedores de GPU, sin embargo **sí** bajo una puerta de tolerancia unidireccional acotada (`(GE-H3)`: a través de Apple `Metal`, `AMD` Mesa Radeon Vulkan (`RADV`), Nvidia Vulkan (`NVIDIA`), e Intel Mesa Vulkan (`ANV`) a `512×512` `RGBA8Unorm`, `24 / 24` pares de frames cruzados GPU difieren en `SHA-256` sin procesar en entre `1.30%`-`9.34%` de los píxeles, pero mantienen error máximo por canal $\Delta_{\max} \le 2 / 255$, relación señal-ruido pico (`PSNR`) de `64.16`-`72.06 dB`, y similitud estructural (`SSIM`) de `0.99983`-`0.99999`, con `measured_j = None` y `board_metered = false`).

**En palabras sencillas**

1. **La simulación exacta entre chips y lenguajes funciona cuando la aritmética está fijada a enteros.** Durante `100,000` ticks (`20,500` puntos de control `SHA-256` verificados), Rust nativo, C++20 (`Clang` y la colección de compiladores (`GCC`)), WebAssembly (`Wasm`), `BigInt` de JavaScript y Python reproducen exactamente el mismo estado de 732 bytes, bit a bit, en Apple Silicon (`arm64`), NVIDIA Jetson Thor (`aarch64`), AMD Zen 5 (`x86_64`) e Intel Raptor Lake (`x86_64`), sin discrepancias.
2. **La física de punto flotante estándar diverge entre sistemas operativos y familias de CPU incluso sin `-ffast-math`.** La aritmética algebraica pura con `+`, `-`, `*`, `/` y `sqrt`, con FMA desactivada (`-ffp-contract=off`), coincide entre `x86_64` y `arm64` en los `25,000` ticks evaluados. Sin embargo, al invocar `std::sin`/`std::cos` en la `libm` de macOS frente a `glibc` de Linux, un bit cambia en el tick `10` (`0.17 s` a `60 Hz`) y las puntuaciones de la jugabilidad se desincronizan en el tick `9,798` (`163.3 s`). Por otra parte, al activar la contracción FMA por defecto (`-ffp-contract=fast`), la divergencia entre `x86_64` y `arm64` aparece en el tick `406`, y la jugabilidad se desincroniza en el tick `11,205`.
3. **Las tarjetas gráficas no dibujan bits idénticos, por lo que el renderizado debe situarse aguas abajo de una puerta de tolerancia unidireccional.** En Apple `Metal`, AMD `RADV` Vulkan, NVIDIA Vulkan e Intel `ANV` Vulkan, entre el `1.3%` y el `9.3%` de los píxeles difieren en `1` a `2` bits menos significativos (`LSB`). Esto rompe las comprobaciones ingenuas de `SHA-256` sobre el framebuffer, pero supera los umbrales perceptuales (`PSNR > 64 dB`, `SSIM > 0.9998`), porque ningún valor de la GPU retorna nunca al estado de la simulación.

![Diagrama de la división propuesta. Una caja superior contiene la forma del juego P igual a S, E, delta, D, lambda, con esquemas tipados de interfaz y un verificador estricto. Las flechas conducen a cuatro proyecciones: simulación (Rust, WebAssembly, XState, SCXML, Python) y scripting (Rhai, Lua, Luau) a la izquierda, en la zona exacta, evaluadas mediante un hash de estado por tick; escena (similar a BSN, glTF, OpenUSD) y renderizado (Slang, WGSL, WESL) a la derecha, en la zona de tolerancia, evaluadas mediante error por píxel. Una línea vertical discontinua marca la frontera de determinismo. Una banda inferior enumera los efectos del anfitrión que entran únicamente como eventos registrados: entrada, reloj, audio, red, entrada y salida de recursos, dibujos de GPU y física cosmética.](/figures/game-engines/architecture.svg)

*Figura 1. División propuesta. Una única forma alimenta cuatro proyecciones. La simulación y el scripting se sitúan en la zona exacta, evaluada mediante hashes de estado por tick. La escena y el renderizado se sitúan en la zona de tolerancia, evaluada mediante error por píxel. Los efectos del anfitrión entran únicamente como eventos registrados.*

![Cuadrícula con once representaciones existentes como filas (Slang, Naga, WGSL y WESL, glTF, OpenUSD, BSN, SCXML y XState, VGDL, GameRule, nAIVE, SpacetimeDB) y siete columnas de capacidades (comportamiento, escena, shader, orden de ejecución, multiplataforma, registro de reproducción y verificación entre capas). Las celdas verdes indican capacidad documentada, las ámbar capacidad parcial y las grises ausencia o falta de documentación. La columna de verificación entre capas es gris salvo por marcas parciales en Slang y nAIVE.](/figures/game-engines/coverage.svg)

*Figura 2. Cobertura de representaciones existentes frente a las capacidades necesarias para la división propuesta.*

*Figura 2. Cobertura de las representaciones existentes, valorada únicamente a partir de los documentos leídos para este estudio. Verde: capacidad documentada. Ámbar: parcial. Gris: ausente o no documentada. La columna más a la derecha, verificación entre capas, está casi vacía.*

<div id="1-terms-notation-and-the-idea-under-test" class="anchor-alias" aria-hidden="true"></div>

## 1. Términos, notación y la idea bajo prueba

<ul id="terms">
<li>RCE, IR, ECS, FSM, SDF: Reality Code Engine [misma casa], representación intermedia, sistema de componentes de entidades, máquina de estados finitos y campo de distancia con signo</li>
<li>CPU, GPU, ISA, ISAs, SIMD, AVX2, NEON, SFU, ROP, RPL: unidad central de procesamiento, unidad de procesamiento gráfico, arquitectura(s) de conjunto de instrucciones, instrucción única datos múltiples, Extensiones Vectoriales Avanzadas 2, Arm Advanced SIMD, unidad de funciones especiales, canal de operaciones de rasterización y arquitectura móvil Intel Raptor Lake</li>
<li>IEEE, FMA, VFMADD, VFNMADD, FMADD, FMSUB, ULP, LSB, SHA, MAE, RMSE, PSNR, SSIM, SD, RGBA8: Instituto de Ingenieros Eléctricos y Electrónicos (como en IEEE 754 de coma flotante), multiplicación-fusión con suma, opcodes vectoriales x86_64 de multiplicación-fusión con suma y multiplicación-fusión con suma negada, opcodes escalares AArch64 de multiplicación-fusión con suma y multiplicación-sustracción, unidad en el último lugar, bit menos significativo, Secure Hash Algorithm (`SHA-256`), error absoluto medio, error cuadrático medio de la raíz, relación pico señal-ruido, índice de similitud estructural, desviación estándar y formato de búfer de fotogramas rojo-verde-azul-alfa de 8 bits por canal</li>
<li>WGSL, WESL, SPIR-V, GLSL, HLSL, MSL, D3D11, D3D12, CUDA: Lenguaje de Sombreado WebGPU, Lenguaje de Sombreado Extendido WebGPU, Representación Intermedia Portable Estándar V, Lenguaje de Sombreado OpenGL, Lenguaje de Alto Nivel de Sombreado, Lenguaje de Sombreado Metal, Direct3D 11, Direct3D 12 y Arquitectura de Dispositivos Unificada de Cómputo</li>
<li>RADV, ANV, LLVM, GNU, GCC, PE, OS, API, APIs, WebXR, WebMCP, URL, JSON, YAML, README, MB, CS0246, RE, ENGINE, DFU: controlador Mesa Radeon Vulkan, controlador Mesa Intel Vulkan, infraestructura de compilador de Máquina Virtual de Bajo Nivel, proyecto GNU's Not Unix, Colección de Compiladores GNU, Windows Portable Executable, sistema operativo, interfaz(s) de programación de aplicaciones, API de Realidad Extendida Web, Protocolo de Contexto de Modelo Web, Localizador Uniforme de Recursos, Notación de Objetos JavaScript, YAML Ain't Markup Language, archivo de documentación README del repositorio, megabytes, diagnóstico de compilador C# de tipo ausente CS0246, Capcom RE ENGINE (marca de motor «Reach for the Moon» / «RE neXt») y prefijo DOI de Dagstuhl Follow-Ups</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG: State Chart XML, Lenguaje de Descripción de Juegos, Lenguaje de Descripción de Videojuegos, Notación de Escena Bevy, Lenguaje Semántico Boldsea, Representación Intermedia de Múltiples Niveles, transacciones atómicas/consistentes/aisladas/durables, biblioteca de red rollback Good Game Peace Out, Formato de Transmisión de Lenguaje Gráfico (ISO/IEC 12113:2022), Descripción Universal de Escena Abierta, Descripción Universal de Escena, red de área local, inteligencia artificial y Computational Intelligence and Games</li>
<li>SATB, RAPL, MSR, PID, RUSAGE, V6, AMD, NVIDIA, V100, GH200, CTC: Benchmark escalonado por niveles de saciedad (Satiation Tiered Benchmark), con niveles de telemetría `L2` (contador de socket/paquete) y `L3` (contador de kernel por proceso) [misma casa]; Límite de potencia con promedio en ejecución (Running Average Power Limit); registro específico del modelo (model-specific register); identificador de proceso (process identifier); `proc_pid_rusage` (`RUSAGE_INFO_V6`); Advanced Micro Devices; NVIDIA Corporation; GPU Volta V100; superchip Grace Hopper GH200; y curva temporal cerrada (closed timelike curve)</li>
</ul>

Para mantener transparentes las referencias adelantadas de arriba hacia abajo, la Sección 1 define la notación Form, la Sección 2 examina las representaciones de juegos existentes, la Sección 3 analiza la divergencia de punto flotante, la Sección 4 tabula las representaciones intermedias, la Sección 5 expone la división de capa propuesta, la Sección 6 informa los ejecutables de falsificador multi-ISA y cruzados de GPU, la Sección 7 enumera las banderas de inviabilidad, y la Sección 8 documenta fuentes y límites.

El [Motor de Código Real (RCE)](https://research.openie.dev/about/rce/) trata un programa como una máquina de estados llamada Form, escrita $P = (S, E, \delta, D, \lambda)$:

- $S$: el conjunto de estados;
- $E$: el conjunto de eventos (entradas);
- $\delta : S \times E \to S$: la función de transición;
- $D$: un registro solo-añadido de cada paso ejecutado;
- $\lambda$: el mapa de salida del estado al output observable.

Un verificador estricto o acepta un Form o nombra la regla que viola. Los emisores entonces proyectan el Form aceptado a Rust, Python, JavaScript y Scala. XState (una biblioteca de diagramas de estado para JavaScript y TypeScript), SCXML (una Recomendación del World Wide Web Consortium) y WebAssembly (`Wasm`) no están entre los objetivos de los emisores; este estudio los trata como proyecciones candidatas. Debido a que cada paso se registra en $D$, cualquier ejecución puede reproducirse.

Un motor de juego es una máquina mucho mayor. Ejecuta una simulación de paso fijo, una capa de scripting, una descripción de escena y una canalización de renderizado en una GPU. Las Secciones 1 a 8 preguntan cuáles de esas capas pueden vivir dentro de un Form, cuáles deben permanecer fuera como efectos del host, y dónde la exactitud debe ceder paso a la tolerancia.

La idea tiene una larga tradición. La especificación del Lenguaje de Descripción de Juegos (GDL) de Stanford ([http://ggp.stanford.edu/readings/gdl_spec.pdf](http://ggp.stanford.edu/readings/gdl_spec.pdf)) cubre “juegos multi-jugador finitos, discretos, deterministas de información completa” y observa que el modelo subyacente natural de tales juegos “es una máquina de estados finita”. Lo novedoso en un motor de juego no es la máquina de estados sino todo lo que la rodea: física de punto flotante, scripts, escenas y GPUs.

<div id="2-what-the-landscape-shows" class="anchor-alias" aria-hidden="true"></div>

## 2. Lo que muestra el panorama

<div id="21-game-logic-as-data-already-works-on-one-backend" class="anchor-alias" aria-hidden="true"></div>

### 2.1 La lógica del juego como datos ya funciona, en un solo backend

GameRule ([Multimedia Systems 32:564, 2026](https://doi.org/10.1007/s00530-026-02629-8)) expresa el comportamiento como reglas *when-do* por actor sobre 14 acciones de crear, leer, actualizar y borrar y 6 condiciones. Su contrato determinista es concreto: un planificador central se ejecuta desde un único FixedUpdate en orden de declaración, la última escritura prevalece, y las creaciones y borrados se difieren hasta el final del recorrido. Los autores justifican el contrato citando el manual de Unity, que indica que el orden de ejecución de scripts "no está garantizado entre compilaciones, máquinas o versiones de Unity". En tres juegos de muestra de Unity (Haunted Jaunt, Survival Shooter, Tanks), el código de comportamiento se redujo de 572 a 107 líneas (−81.3%).

El costo se mide. La interpretación de la regla cuesta alrededor de $c \approx 65\ \mu\text{s}$ por actor por paso. Con un presupuesto de paso $T = 20$ ms, el techo de actores es

$$N_{\max} = \frac{T}{c} = \frac{20\ \text{ms}}{65\ \mu\text{s}} \approx 308,$$

lo que concuerda con la observación del artículo de que el presupuesto se supera entre 200 y 350 actores (23.872 ms a 350). Sólo existe un backend de Unity, por lo que se argumenta la portabilidad entre motores pero no se demuestra.

<div id="22-order-of-execution-can-be-made-deterministic-by-construction" class="anchor-alias" aria-hidden="true"></div>

### 2.2 El orden de ejecución puede hacerse determinista por construcción

El patrón ECS almacena el estado del juego como componentes adjuntos a identificadores de entidades y ejecuta el comportamiento como sistemas sobre ellos. Redmond, Castello, Calderón Trilla y Kuper le dan un modelo formal, Core ECS ([arXiv:2508.15264](https://arxiv.org/abs/2508.15264)). Demuestran que un programa de planificación en el que cada par concurrente de mutaciones conmuta es determinista, y que dos subprogramas de planificación que escriben conjuntos disjuntos de etiquetas de componentes pueden ejecutarse en paralelo sin modificar el resultado. Al examinar Bevy ECS, EnTT, Flecs, Specs y apecs, descubren que ninguno permite adjuntar un nuevo componente concurrentemente con otra mutación; tales cambios estructurales se difieren y se aplican en serie. Tasnim y Zhao ([SAC 2026, doi:10.1145/3748522.3779910](https://doi.org/10.1145/3748522.3779910)) añaden una semántica operacional y un sistema de tipos para archetype ECS que rastrea los conjuntos de lectura y escritura por sistema, e informan sobre una simulación de Tower Defense en la que un diseño paralelo de arquetipos alcanzó 109,54 fotogramas por segundo frente a 36,13 para una línea base orientada a objetos. El spawn y delete diferidos de GameRule constituyen la misma disciplina, alcanzada de forma independiente.

<div id="23-compiling-is-not-the-same-as-being-right" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Compilar no equivale a tener razón

El benchmark Mage ([arXiv:2605.07342](https://arxiv.org/abs/2605.07342)) ejecutó 858 intentos de generación sobre 26 patrones de mecánicas de Unity. Sin una IR, el 43 % de las salidas superó la ejecución en tiempo de ejecución, pero el F1 de mecánicas (concordancia entre las mecánicas solicitadas y las implementadas) fue solo de unos 0,12. Al condicionar la generación con una IR, la tasa de superación en tiempo de ejecución bajó al 14 % - 21 %, mientras que el F1 de mecánicas subió a 0,82 - 1,00. La tasa de compilación resultó anticorrelacionada con la corrección funcional: el error de tipo ausente CS0246 apareció 469 veces bajo condicionamiento con IR y ninguna vez sin él. Una IR centrada solo en el comportamiento y una IR de escena completa no fueron estadísticamente distinguibles (McNemar p = 1,0). La lección para RCE es que un verificador que solo demuestra que "compila" mide la magnitud equivocada. Las comprobaciones de interfaz deben ser de naturaleza conductual.

<div id="24-public-benchmarks-with-replayable-traces-exist" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Existen benchmarks públicos con trazas reproducibles

GameCraft-Bench ([arXiv:2606.17861](https://arxiv.org/abs/2606.17861); [repositorio](https://github.com/FreedomIntelligence/gamecraft-bench)) ofrece 140 tareas bidimensionales de Godot 4 en 15 familias. Las presentaciones llevan trazas de entrada reproducibles. El agente más fuerte del artículo obtuvo un 41,46 %, y el repositorio informa posteriormente un 65,70 %. No abarca Unity, Unreal, 3D, multijugador ni escenas de física grandes. [Summer Engine](https://www.summerengine.com/templates) publica 17 plantillas de juegos de código abierto (carreras, plataformas, defensa de torre, metroidvania, supervivientes, disparos en primera persona, multijugador LAN, voxel y otras). El marco General Video Game AI y su VGDL ([arXiv:1802.10363](https://arxiv.org/abs/1802.10363)) suministran 120 juegos de un jugador y 60 de dos jugadores definidos por conjuntos de sprites, interacciones, terminación y mapeo de niveles.

<div id="25-convergence-across-industry-and-research" class="anchor-alias" aria-hidden="true"></div>

### 2.5 Convergencia entre la industria y la investigación

Varios esfuerzos convergen hacia la misma forma: archivos declarativos de escenas y pipelines, una capa de scripting aislada, un lenguaje de shaders moderno y un registro de eventos.

- [nAIVE](https://github.com/poro/nAIVE) está construido en Rust sobre `wgpu` con un ECS (hecs), escenas YAML, materiales y pipelines de renderizado, Lua 5.4 con aislamiento por entidad, shaders Slang recompilados a WGSL, física Rapier, un bus de eventos con validación de esquemas YAML y un ejecutor de pruebas sin cabecera. Su [sitio](https://naive.dev/) muestra un archivo YAML de 92 líneas que declara un pipeline diferido de cinco pases. Su README también describe una simulación de cómputo en GPU que impulsa más de 50.000 entidades, una elección que sitúa esa simulación en el lado de la tolerancia del límite trazado a continuación.
- Capcom describe REX («RE neXt Engine») como una evolución escalonada de RE ENGINE que involucra a unos 200 ingenieros ([Capcom IR](https://www.capcom.co.jp/ir/english/data/oar/2025/re-engine.html)). La cobertura de prensa ([PC Gamer](https://www.pcgamer.com/gaming-industry/game-development/capcom-announces-plans-to-transform-its-re-engine-into-an-ai-generation-game-engine/)) informa de seis programas, entre ellos Re:Dox, que traduce diferentes tipos de datos a un conjunto común de reglas, y RE:Flows, que convierte ideas de mecánicas de juego en un lenguaje de programación estandarizado; también informa de que más de 2.000 personas utilizan RE Engine.
- La propuesta BSN de Bevy ([discusión 14437](https://github.com/bevyengine/bevy/discussions/14437)) define las escenas como valores composables Patch, EntityPatch y DynamicScene con una macro `bsn!` y un formato de activos, mientras deja sin resolver los manejadores de eventos.
- [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) ejecuta la lógica de juego como reductores que se ejecutan como transacciones ACID sobre tablas y reproduce un registro de commits, que es el registro RCE $D$ bajo otro nombre.
- Las Ontologías Ejecutables ([doi:10.48550/arXiv.2601.07964](https://doi.org/10.48550/arXiv.2601.07964)) modelan el comportamiento del juego en BSL sobre un grafo de eventos inmutable y de solo adición. El artículo recomienda un enfoque híbrido en el que la física, el renderizado y la animación mantengan enfoques tradicionales de alta frecuencia, mientras que las misiones y las decisiones se ejecutan sobre el grafo de eventos, unidos mediante eventos agregados. Esa es la misma división de capas propuesta aquí.

<div id="3-the-physics-of-divergence-why-exactness-is-binary" class="anchor-alias" aria-hidden="true"></div>

## 3. La física de la divergencia: por qué la exactitud es binaria

La suma en coma flotante no es asociativa. En hardware paralelo, el orden de una reducción varía de una ejecución a otra. Un estudio sobre la no asociatividad de la coma flotante en hardware paralelo ([arXiv:2408.05148](https://arxiv.org/abs/2408.05148)) define la variabilidad escalar

$$V_s = 1 - \left| \frac{f_{nd}}{f_d} \right|,$$

donde $f_d$ es una reducción determinista y $f_{nd}$ una no determinista. Al permutar una suma de $10^6$ valores normalmente distribuidos en doble precisión, el resultado cambió hasta en unos $4.26 \times 10^{-13}$, y el máximo de $|V_s|$ creció como $\sqrt{n}$. Una reducción determinista en árbol supuso un coste de alrededor del 0,2 % respecto a la acumulación atómica en una NVIDIA V100, y de hasta el 7,8 % en una GH200. En 1000 entrenamientos de redes neuronales sobre grafos, cada ejecución produjo pesos distintos.

Un juego convierte estas diferencias minúsculas en diferencias visibles. La dinámica de sólidos rígidos con contacto y la dinámica de muchos cuerpos son, típicamente, caóticas. Con un exponente de Lyapunov local $\Lambda$, una perturbación crece como

$$\delta(t) = \delta_0 \, e^{\Lambda t},$$

por lo que el tiempo hasta que alcanza un tamaño $\Delta$ perceptible en la jugabilidad es

$$t^{*} = \frac{1}{\Lambda} \ln\frac{\Delta}{\delta_0}.$$

*Modelo ilustrativo:* tómese $\delta_0 \approx 6 \times 10^{-8}$ (una ULP de precisión simple, en términos relativos), $\Delta = 1$ (un objeto al otro lado de una pared) y un $\Lambda = 2\ \text{s}^{-1}$ supuesto. Entonces $t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ s. El logaritmo es la clave: reducir $\delta_0$ un millón de veces solo añade unos 6.9 segundos más. Una concordancia aproximada no puede, por tanto, salvar la simulación. El estado es o bit a bit idéntico, o acaba divergiendo, una predicción que se contrasta directamente en 25 000 ticks de colisión en múltiples ISA más adelante (`GE-H2`).

La práctica coincide con esto. [Gaffer On Games](https://gafferongames.com/post/floating_point_determinism/) documenta que el determinismo entre máquinas exige el mismo compilador y el mismo conjunto de instrucciones, que Battlezone 2 encontró diferencias entre AMD e Intel en funciones trascendentes, y que las repeticiones de MotoGP no podían compartirse entre Xbox y ordenadores personales. Cita el consejo de Markstein de prohibir la contracción FMA y la reasociación. La [guía de Rapier](https://rapier.rs/docs/user_guides/rust/determinism/) muestra una vía que funciona: el determinismo multiplataforma solo se mantiene con su característica `enhanced-determinism` (incompatible con `simd8`), en objetivos IEEE 754-2008 (Wasm cumple este requisito) y utilizando funciones trascendentes implementadas por software.

Para el renderizado, la [especificación WGSL](https://www.w3.org/TR/WGSL/) indica que "WGSL sometimes permits several possible behaviors for a given feature. This is a portability hazard." Su sección de punto flotante va más allá: "WGSL does not specify a rounding mode"; "An implementation may reassociate operations"; puede "fuse operations if the transformed expression is at least as accurate as the original"; las entradas y salidas subnormales de muchas operaciones "may be flushed to zero"; y la built-in `fma` "may expand to an ordinary multiply ... and an add." Los píxeles, por tanto, están especificados para diferir entre implementaciones. La [especificación SPIR-V](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) ofrece una herramienta más estrecha: su decoración NoContraction marca una instrucción aritmética que "cannot be combined with another instruction to form a single operation," y tales operaciones "are not allowed to reassociate." Eso es una guardia por instrucción en un backend, no una garantía portátil para un shader completo.

<div id="4-the-ir-table" class="anchor-alias" aria-hidden="true"></div>

## 4. La tabla de RI

| Representación | Capa | Propiedad más sólida (documentada) | Lo que carece para un Form |
|---|---|---|---|
| [Slang](https://shader-slang.org/) | Shaders | IR de módulos; backends para D3D12, Vulkan, Metal, D3D11, OpenGL, CUDA, WebGPU, CPU; sistema de capacidades | No tiene estado de juego, ni eventos, ni garantía de semántica exacta para coma flotante |
| [Naga](https://github.com/gfx-rs/wgpu/tree/trunk/naga) | Shaders | IR validado; entrada en WGSL, SPIR-V y GLSL; salida en SPIR-V, WGSL, MSL, HLSL y GLSL | Lo mismo; no tiene vínculo con un esquema de escena |
| [WGSL](https://www.w3.org/TR/WGSL/) / [WESL](https://wesl-lang.dev/) | Shaders | Análisis de uniformidad; WESL añade importaciones, compilación condicional, paquetes y `wgsl-test` | Permite reasociación, fusión y flush-to-zero; no tiene tipos del lado del host |
| [SPIR-V](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) | IR binario de shaders | La decoración NoContraction prohíbe la fusión y la reasociación por instrucción | Solo por instrucción; no tiene semántica de juego |
| [MLIR](https://mlir.llvm.org/) | Infraestructura de compiladores | Dialectos multinivel para el descenso (lowering) | No es un modelo de juego; la semántica queda a cargo de cada dialecto |
| [glTF 2.0](https://www.khronos.org/gltf/) (ISO/IEC 12113:2022) | Activos y escena | Estándar de intercambio entre herramientas | No tiene comportamiento ni orden de ejecución |
| [OpenUSD](https://openusd.org/release/intro.html) | Escena | Arcos de composición, rutas de espacio de nombres | Autodescrito como "Not a rigging system"; no tiene semántica de simulación |
| [BSN](https://github.com/bevyengine/bevy/discussions/14437) | Escena | Parches tipados sobre componentes, importaciones versionadas | Manejadores de eventos sin resolver; solo para Bevy |
| [SCXML](https://www.w3.org/TR/scxml/) / [XState](https://stately.ai/docs/xstate) | Comportamiento | Semántica de micropaso y macropaso, prioridad por orden de documento, regiones paralelas en serie | El modelo de datos es específico de la plataforma; no tiene disciplina numérica, ni escena ni shader |
| [GDL](http://ggp.stanford.edu/readings/gdl_spec.pdf) | Reglas | Descripción lógica de juegos finitos, discretos y deterministas | No tiene física continua ni renderizado |
| [VGDL](https://arxiv.org/abs/1802.10363) | Reglas | Juegos compactos en cuadrícula 2D, amplio corpus público | Solo cuadrícula 2D; no tiene renderizado ni fidelidad física |
| [Core ECS](https://arxiv.org/abs/2508.15264) | Orden de ejecución | Teorema que da una condición para planificaciones concurrentes deterministas | Es un modelo formal, no un formato de motor; no tiene escena ni shader |
| [GameRule](https://doi.org/10.1007/s00530-026-02629-8) | Reglas | Contrato de planificador determinista, ahorro de código medido | Solo Unity; unos 65 µs por actor; no tiene verificador formal |
| [nAIVE](https://github.com/poro/nAIVE) | Motor completo | Escenas y pipelines en YAML, Lua, Slang, validación de esquema de eventos | No tiene semántica formal publicada ni verificación de tipos entre capas |
| [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) | Lógica de servidor | Reducers como transacciones, reproducción desde el registro de confirmaciones (commit-log) | Solo lado servidor; no tiene renderizado de cliente ni escena |

<div id="5-proposed-architecture" class="anchor-alias" aria-hidden="true"></div>

## 5. Arquitectura propuesta

<div id="51-layer-split" class="anchor-alias" aria-hidden="true"></div>

### 5.1 División de capas

1. **Forma de simulación (exacta).** $S$ contiene valores de coma fija o IEEE 754 estrictos, con FMA y reasociación desactivados y transcendentales implementados mediante rutinas enteras o de software anclado. $E$ contiene eventos de tic e entradas registradas. $\delta$ utiliza la semántica de macrostep de SCXML: por cada tic, procesa los eventos en orden de cola, resuelve conflictos por orden del documento y ejecuta regiones paralelas de forma serial. Las colecciones iteran en un orden declarado, siguiendo el contrato de GameRule (orden de declaración, la última escritura gana, los cambios estructurales se difieren hasta el final del tic). Cuando se desea paralelismo, el comprobador solo admite planificaciones que satisfagan la condición de disyunción del Core ECS.
2. **Proyección de guionado (exacta).** Los guiones de diseñador se compilan a guardas y acciones sobre $S$, emitidos como [Rhai](https://rhai.rs/book/about/features.html) (en sandbox, con garantía de «Don't Panic», soporte no-std y Wasm), Lua o [Luau](https://luau.org/) (en sandbox por defecto, con tipos graduales). Los guiones solo pueden invocar $\delta$ a través de acciones declaradas. No pueden leer relojes, fuentes aleatorias ni resultados de GPU directamente.
3. **Proyección de escena (tolerancia aguas abajo).** $\lambda$ mapea $S$ a un árbol de parches similar a BSN cuya esquema de componentes forma parte de la Forma. glTF y OpenUSD sirven como destinos de exportación para los activos.
4. **Proyección de renderizado (tolerancia).** Los materiales y pases se redactan en Slang o WGSL, y se emiten mediante Slang o Naga hacia los backends de Metal y Vulkan. El renderizado es una función pura de $\lambda(s)$. Ningún resultado de GPU fluye nunca de vuelta a $S$.

<div id="52-inside-the-form-versus-host-effects" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Dentro del núcleo formal frente a los efectos del anfitrión

Dentro del núcleo formal se encuentran el estado, las transiciones, el orden de las reglas, la física de punto fijo para los cuerpos relevantes para la jugabilidad, el generador aleatorio con su semilla en $S$ y los esquemas de las interfaces. Fuera del núcleo, como eventos registrados, quedan la entrada de los dispositivos, el tiempo de reloj, los paquetes de red, la salida de audio, la entrada y salida de recursos, las llamadas de dibujo en la GPU y cualquier motor de físicas de terceros utilizado con fines puramente cosméticos. La reproducción alimenta $D$ de nuevo a través de $\delta$ en lugar de acceder a los dispositivos. El coste de almacenamiento es moderado. Con una frecuencia de reloj $f_{\text{tick}} = 60$ Hz y $b = 16$ bytes de entrada por tick, el registro crece a $f_{\text{tick}} \cdot b = 960$ B/s, es decir, unos 3,5 MB por hora.

<div id="53-determinism-boundary" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Frontera de determinismo

- **Criterio de la zona exacta:** para los objetivos A y B y todo tick $t$, $H(s_t^A) = H(s_t^B)$, donde $H$ es una función hash criptográfica sobre una serialización canónica de $S$.
- **Criterio de la zona de tolerancia:** para los fotogramas renderizados $I^A$ e $I^B$ del mismo $s_t$, la fracción de píxeles con error por canal superior a $\varepsilon$ no debe exceder $p_{\max}$, junto con umbrales acotados de similitud estructural (`SSIM`) y de relación señal-ruido de pico (`PSNR`). La sección 6.3 ejecuta esta calibración en cuatro arquitecturas de GPU (`Metal`, Vulkan con `RADV`, Vulkan con `NVIDIA` y Vulkan con `ANV`).
- La red de rollback al estilo de [GGPO](https://github.com/pond3r/ggpo), que se basa en la predicción de entradas y la ejecución especulativa, solo es válida en el lado exacto de esta frontera.

<div id="54-cross-layer-interface-checking" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Comprobación de interfaces entre capas

El comprobador valida cuatro aristas tipadas antes de cualquier emisión: (a) guion a simulación: toda acción nombra una transición declarada con tipos de argumentos coincidentes; (b) simulación a escena: la salida de $\lambda$ coincide con el esquema del componente; (c) escena a renderizado: todo enlace de material coincide con un recurso Slang o WGSL de tipo, grupo e índice de enlace compatibles; (d) cobertura de eventos: todo evento al que un guion esté suscrito es producible por alguna transición o fuente del anfitrión. El hallazgo de Mage (Sección 2.3) es la razón por la que las comprobaciones de aristas se juzgan por trazas de comportamiento, no por el éxito de la compilación.

<div id="6-falsifier-first-test-plan-and-executed-multi-isa--cross-gpu-results" class="anchor-alias" aria-hidden="true"></div>

## 6. Plan de pruebas falsificador-primero y resultados multi-ISA / cross-GPU ejecutados

Cada hipótesis se enumera con su criterio de eliminación. Si se cumple el criterio, la afirmación se retira. Las subsecciones 6.1 a 6.4 describen los tres suites empíricos de falsificador ejecutados (`GE-H1` multi-ISA `Q32.32` replay across 25 target × host cells, `GE-H2` cross-ISA floating-point drift across `x86_64` and `arm64`/`aarch64`, and `GE-H3` cross-GPU headless `wgpu` rendering tolerance across Apple `Metal` and AMD, NVIDIA, and Intel `Vulkan`), más un prototipo interactivo de `Q32.32` con presupuesto de joules (`GE-H4` through `GE-H9` permanecen abiertas).

| ID | Hipótesis | Corpus de pruebas | Medida | Criterio de eliminación | Estado |
|---|---|---|---|---|---|
| GE-H1 | Las proyecciones de simulación son idénticas a nivel de bits entre lenguajes, sistemas operativos y arquitecturas de CPU | Arena 2D de 16 cuerpos Form (`Q32.32` de coma fija, estado de `732` bytes) en `arm64` macOS, `aarch64` Linux y AMD/Intel `x86_64` Linux | $H(s_t)$ en Rust, Wasm32, C++20 (`Clang`/`GCC`), Node.js `BigInt`, Python 3 durante $10^5$ ticks (`25` celdas) | Cualquier discrepancia de hash en cualquier punto de control en cualquier celda `(host, target)` | **Ejecutado (`0 / 20.500` discrepancias, Sección 6.1)** |
| GE-H2 | Modo estricto frente a deriva de límites de coma flotante entre ISA y de biblioteca/FMA | Arena caótica 2D de 16 cuerpos (`25.000` ticks en `arm64` macOS, `aarch64` Linux y AMD/Intel `x86_64` Linux) | Ticks de divergencia exacta `t_div` en `f64` estricto, `libm` `sin/cos` entre SO, FMA entre ISA, V8 `Math.sin` y `f32` | Discrepancia inesperada bajo aritmética algebraica fijada o deriva silenciosa impredecible | **Ejecutado en `arm64`, `aarch64` y `x86_64` (Sección 6.2)** |
| GE-H3 | El renderizado entre GPU se mantiene dentro de una tolerancia acotada (`wgpu` / WGSL) | 4 estados canónicos `Q32.32` (`t = 0, 250, 1k, 10k`) renderizados a `512×512` `RGBA8Unorm` en 4 GPU físicas (`Metal`, `RADV`, `NVIDIA`, `ANV`) + `llvmpipe` + `CPU Q16.16` | `SHA-256` del framebuffer, `%` de píxeles diferentes, $\Delta_{\max}$, MAE, RMSE, `PSNR` y `SSIM` | Cualquier par de GPU físicas que no cumpla `PSNR > 40 dB`, `SSIM > 0.999` o $p(\Delta > 8) \le 0.001$ | **Ejecutado (`24/24` umbral superado: `PSNR 64,2-72,1 dB`, `SSIM ≥ 0,99983`, Sección 6.3)** |
| GE-H4 | Las reglas codificadas en Form reducen el código tanto como lo hizo GameRule | Comportamientos de Haunted Jaunt, Survival Shooter y Tanks | Líneas de código de comportamiento | Reducción por debajo del 50 % (GameRule alcanzó el 81,3 %) | Abierto |
| GE-H5 | El tiempo de ejecución de Form supera el techo de GameRule | Escalado sintético de actores | Tiempo por paso frente a $N$ | Tiempo por paso superior a 20 ms por debajo de $N = 350$ | Abierto |
| GE-H6 | Las comprobaciones de interfaz detectan defectos reales | 26 patrones de Mage; fallos de enlace y esquema inyectados | Tasa de detección; F1 del mecanismo | Detección inferior al 90 % de los fallos inyectados, o F1 no mejor que el 0,12 sin IR | Abierto |
| GE-H7 | Barrido completo de la pendiente $\ln(\Delta/\delta_0)$ en plantillas de Summer Engine | Plantillas de Summer Engine con física intensa reexpresadas como Forms | Tiempo de divergencia frente a $\delta_0$ inyectado | Pendiente de $t^{*}$ frente a $\ln(1/\delta_0)$ no distinguible de cero | Abierto |
| GE-H8 | La reproducción es completa | Sesiones grabadas de una hora | Hash final reproducido solo a partir de $D$ | Cualquier reproducción que necesite estado no presente en $D$ | Abierto |
| GE-H9 | Paridad de referencia | 140 tareas de GameCraft-Bench mediante un emisor Form-to-Godot | Tasa de aprobación frente a envíos nativos de Godot | Tasa de aprobación inferior en entradas idénticas en comportamiento | Abierto |

![Panel de dos secciones sobre la frontera de determinismo. El panel izquierdo muestra la Zona exacta GE-H1 (0 discrepancias en 20.500 puntos de control SHA-256 sobre 25 celdas en macOS arm64, Linux aarch64 y Linux x86_64 de AMD/Intel) y las marcas de divergencia GE-H2 entre ISA en f64 (t_div = 10 para libm de Apple frente a sin/cos de GNU glibc, y t_div = 406 para VFMADD en x86_64 frente a FMADD en arm64 sin -ffast-math). El panel derecho muestra las barras de PSNR mínimo de la Zona de tolerancia GE-H3 para los 6 pares físicos de GPU (Apple Metal, AMD RADV Vulkan, Intel ANV Vulkan, NVIDIA Vulkan), con valores entre 64,2 y 72,1 dB, muy por encima del umbral de 40 dB, y diferencias de píxeles de 1 a 2 LSB entre el 1,3 % y el 9,3 %.](/figures/game-engines/cross-gpu-tolerance.svg)

*Figura 3. Frontera empírica entre `GE-H1`, `GE-H2` y `GE-H3`. El estado de simulación `Q32.32` aguas arriba (`S`) alcanza `0 / 20,500` discrepancias en los puntos de control `SHA-256` en cinco máquinas y tres ISA, mientras que el `sin/cos` y el `FMA` en `f64` sin fijar divergen entre límites de SO/ISA dentro de `10` a `406` ticks. Aguas abajo de $\lambda(s_t)$, las cuatro arquitecturas de GPU producen digestos `SHA-256` distintos de `RGBA8Unorm` (diferencias de píxeles de `1,3%`-`9,3%` de `1-2` LSB), manteniéndose estrictamente por encima de `64,1 dB` de `PSNR` y `0,99983` de `SSIM` (`measured_j = None`, `board_metered = false`).*

<div id="61-ge-h1-multi-isa-and-multi-os-100000-tick-determinism-q3232-integer-physics" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `GE-H1`: Multi-ISA y multi-OS determinismo de 100,000 ticks (`Q32.32` física entera)

*Pre-registrado bajo `PREREG_wave3_multi_isa_wgpu.json` (`SHA-256: 1721e5bdffaf...`). La telemetría separa estrictamente los niveles `SATB` `L2` y `L3` `reported_j` (`L2`: Linux `/sys/class/powercap/intel-rapl:0/energy_uj` contadores de socket/paquete y núcleo; `L3`: macOS por PID `proc_pid_rusage(child_pid, RUSAGE_INFO_V6).ri_energy_nj`; `measured_j = None`, `board_metered = false`). Explorador interactivo y JSON crudo: [`/living/game-engines/`](/living/game-engines/) ([`results.json`](/living/game-engines/results.json)).*

Una arena `Form` de colisión elástica 2D con 16 cuerpos + 4 recogidas y FSM de enfriamiento (`Q32.32` coordenadas con punto fijo con signo de 64 bits en `[-64, +64]`, productos intermedios de 128 bits, raíz cuadrada entera por piso `isqrt_u128`, reaparición estructural diferida de objetos, vector de estado canónico de 732 bytes en little-endian) se ejecutó durante `100,000` ticks en **cinco máquinas, tres ISA (`arm64`/`AArch64`, `x86_64`, `wasm32`), dos sistemas operativos (`macOS 27.2.1`, `Ubuntu Linux 6.8 / 7.0`), y seis proyecciones de lenguaje/compilador (`25` celdas objetivo × host)**:

| Anfitrión (`ISA` · `SO`) | Proyección de destino | ms de pared / `100k` (media ± DE) | `ns / tick` | Canal de telemetría (`reported_j`) | `reported_j` / `100k` (J) | Puntos de control `SHA-256` verificados |
|---|---|---:|---:|---|---:|:---:|
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_native` (`rustc 1.100 -O`) | `22.333 ± 5.043` | `223.3` | `L3` por PID `ri_energy_nj` | **`0.1028 ± 0.0247`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `cpp20_clang_o3` (`Apple Clang 21`) | `21.022 ± 1.657` | `210.2` | `L3` por PID `ri_energy_nj` | **`0.1090 ± 0.0134`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_wasm32_node` (`Node v26.13`) | `84.300 ± 11.334` | `843.0` | `L3` por PID `ri_energy_nj` | **`0.4480 ± 0.0881`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `javascript_bigint_node` (`ES2024`) | `717.955 ± 36.304` | `7,179.6` | `L3` por PID `ri_energy_nj` | **`4.4021 ± 0.4048`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `python_3_13` (`CPython 3.13.14`) | `2,945.816 ± 284.033` | `29,458.2` | `L3` por PID `ri_energy_nj` | **`13.5999 ± 1.9086`** | `100 / 100` (`stride 1,000`) |
| **Apple M3 Ultra** (`arm64` · `macOS 27.2.1`) | `rust_native` / `cpp20_clang_o3` | `32.711` / `33.727` | `327.1` / `337.3` | `L3` por PID `ri_energy_nj` | **`0.0729` / `0.0755`** | `2 × 1,000 / 1,000` (`stride 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `21.793` / `23.061` / `26.677` | `217.9` - `266.8` | `L2` AMD RAPL pkg (núcleo `0.13`-`0.21 J`) | **`1.958` / `2.349` / `2.932`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `145.29` / `1,347.80` / `2,546.42` | `1,452.9` - `25,464.2` | `L2` AMD RAPL pkg (núcleo `1.01`-`12.23 J`) | **`14.44` / `115.81` / `181.87`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `39.718` / `36.868` / `58.792` | `368.7` - `587.9` | `L2` Intel RAPL pkg (núcleo `1.64`-`2.68 J`) | **`2.062` / `1.888` / `3.026`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `158.35` / `1,390.46` / `3,375.07` | `1,583.5` - `33,750.7` | `L2` Intel RAPL pkg (núcleo `5.65`-`124.90 J`) | **`6.89` / `60.79` / `149.48`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **NVIDIA Jetson Thor** (`Armv9-A` `aarch64` · `Linux 6.8`) | `rust_native` / `clang` / `gcc` / `wasm32` / `js` / `py3.12` | `39.28` (`GCC`) - `4,407.89` (`Py`) | `392.8` - `44,078.9` | Solo CPU (`reported_j = null`, GPU sin tocar) | `null` | `6 × 1,000 / 1,000` (`stride 100`) |

- **Veredicto**: **`PASS_ZERO_MISMATCHES` (`0 / 20,500` checkpoints `SHA-256` verificados; `0 / 190,000` comparaciones por pares con paso `100` entre las `20` celdas de trazas completas de la Ola 3)**. Todos los objetivos en todos los hosts produjeron `2683c3f7cb8b...` en el tick `100`, `21fa688e4ee8...` en el tick `1,000`, `ea01ba793841...` en el tick `50,000` y `82e404df6475d64d...` en el tick `100,000`.
- **Alcance de la telemetría y cobertura de sistemas operativos**: Conviene advertir que los valores `reported_j` de `L2` y `L3` nunca deben confundirse. En Apple, `L3` (`ri_energy_nj`) atribuye la energía de los núcleos de CPU exclusivamente al PID del proceso hijo evaluado, con valores entre 0.073 y 0.109 J para Rust y C++ nativos. En cambio, en Linux, `/sys/class/powercap/intel-rapl:0` (`L2`) integra la potencia del paquete a nivel de socket, incluyendo todos los demonios en segundo plano: entre 1.89 y 2.06 J para el paquete frente a entre 0.13 y 1.83 J para el subdominio `core`. La compilación cruzada mediante `x86_64-w64-mingw32-g++` y `wine64` se verificó y no estaba disponible en los runners Linux compartidos, mientras que el host Windows `x86_64` de metal desnudo estaba apagado durante la ejecución. Por tanto, la ejecución de PE en Windows sigue sin verificarse en metal desnudo, aunque el objetivo independiente del sistema operativo `wasm32-unknown-unknown` produjo resultados idénticos en macOS y Linux, tanto en `arm64` como en `x86_64`.

<div id="62-ge-h2-cross-isa-and-cross-os-25000-tick-floating-point-drift-ieee-754-f64" class="anchor-alias" aria-hidden="true"></div>

### 6.2 `GE-H2`: Deriva de punto flotante de 25 000 ticks entre ISA cruzada y SO cruzado (`IEEE 754` `f64`)

Para comprobar si las simulaciones `IEEE 754` `binary64` (`f64`) permanecen sincronizadas entre `x86_64` y `arm64`/`aarch64` cuando `-ffast-math` está *prohibido*, se avanzó la arena caótica idéntica de 16 cuerpos durante `25,000` ticks (`~6.94` minutos a `60 Hz`), calculando hashes de los bits canónicos de `IEEE 754` (`t_div_ieee_bits`), posiciones cuantizadas a `10^-3` unidades de arena (`t_div_macro_1e3`) y el estado de juego discreto (`t_div_gameplay`) en cada tick:

| Host / Destino A | Host / Destino B | Mecanismo de perturbación | `t_div_ieee_bits` | `t_div_macro_1e3` | `t_div_gameplay` |
|---|---|---|---:|---:|---:|
| `arm64` macOS `Clang 21` (`f64_strict`) | AMD Zen 5 & Intel RPL `x86_64` Linux `Clang 21` / `GCC 15.2` | Algebra `f64` cruzada ISA y SO + `sqrt`, `FMA` desactivado (`-ffp-contract=off`, sin trig) | Ninguno (>25,000) | Ninguno (>25,000) | Ninguno (>25,000) |
| `x86_64` Linux `glibc 2.43` (`f64_trig`) | `aarch64` Linux `glibc 2.39` (`f64_trig`) | ISA cruzada Linux GNU `glibc` `std::sin/cos` (`-ffp-contract=off`, sin `-ffast-math`) | Ninguno (>25,000) | Ninguno (>25,000) | Ninguno (>25,000) |
| **Apple `arm64` macOS (`f64_trig`, `-ffp-contract=off`)** | **AMD/Intel `x86_64` & Thor `aarch64` Linux (`f64_trig`, `-ffp-contract=off`)** | **SO cruzado `libm` estándar `std::sin/cos` (`Apple libSystem` vs `GNU glibc`, sin `-ffast-math`)** | **`10`** (`0.17 s`) | **`5,900`** | **`9,798`** (`163.3 s`) |
| **`x86_64` Linux (`-O3 -mavx2 -mfma -ffp-contract=fast`)** | **Apple `arm64` & Thor `aarch64` (`-O3 -ffp-contract=fast`)** | **ISA cruzada `FMA` lowering (`x86_64 VFMADD/VFNMADD` vs `AArch64 FMADD/FMSUB`, solo algebraico, sin `-ffast-math`)** | **`406`** (`6.77 s`) | **`7,422`** | **`11,205`** (`186.8 s`) |
| **`x86_64` Linux `Node v22.22` (`f64_trig`)** | **`aarch64` Linux `Node v24.22` (`f64_trig`)** | **ISA cruzada Node.js V8 `Math.sin/cos` (`x86_64` vs `aarch64`)** | **`66`** (`1.10 s`) | **`7,617`** | **`10,093`** (`168.2 s`) |
| **`cpp_f64_strict` (`-ffp-contract=off`)** | **`cpp_f64_fma` / `-ffast-math`** | **Contracción `FMA` mismo host (`-ffp-contract=off` vs `-ffp-contract=fast`)** | **`192`** (`3.20 s`) | **`5,927`-`6,576`** | **`8,869`-`10,093`** |
| **`cpp_f64_strict` / `trig`** | **`cpp_f32_strict` / `trig`** | **Reducción de precisión (`binary64` `f64` vs `binary32` `f32`)** | **`1`** | **`8`-`9`** | **`1,370`-`2,240`** |

Tres hallazgos nítidos entre arquitecturas de instrucción (cross-ISA) emergen:

1. **IEEE 754-2008 `+`, `-`, `*`, `/` y `sqrt` con `FMA` desactivado (`-ffp-contract=off`) son portables a nivel de bits entre `x86_64` y `arm64`/`aarch64`** (`0` discrepancias sobre `25,000` ticks en `Clang`, `GCC`, `Rustc` y `V8`), porque las cinco operaciones están obligadas a redondear a `0.5` ULP.
2. **El `std::sin`/`std::cos` estándar de C++ rompe la determinismo entre sistemas operativos en el tick `10` (`0.17 s`) incluso con `-ffp-contract=off -fno-fast-math`**: la `libm` de `libSystem` de Apple y la `glibc` de GNU redondean un impulso de dirección de forma distinta en `1` ULP en el tick `10`, lo que las colisiones caóticas de 16 cuerpos amplifican hasta un error de posición `> 10^-3` en el tick `5,900` y una desincronización discreta de puntuación/recogida en el tick `9,798` (`163.3 s`).
3. **La contracción `FMA` predeterminada del compilador (`-ffp-contract=fast`, sin `-ffast-math` ni trigonometría alguna) rompe el determinismo entre arquitecturas de instrucción en el tick `406` (`6.77 s`)**: mientras que AMD Zen 5 e Intel Raptor Lake coinciden bit a bit en `x86_64` (`844172b5...`), y Apple M3 Ultra y Jetson Thor coinciden bit a bit en `AArch64` (`deeb446c...`), LLVM reduce las expresiones de multiplicación-sustracción negada de forma distinta entre `x86_64` (`AVX2` `VFMADD`/`VFNMADD`) y `AArch64` (`NEON` `FMADD`/`FMSUB`), desincronizando el juego en el tick `11,205`.

<div id="63-ge-h3-cross-gpu-headless-wgpu-metal--vulkan-rendering-tolerance" class="anchor-alias" aria-hidden="true"></div>

### `GE-H3`: Tolerancia de renderizado `wgpu` sin cabecera (`Metal` / `Vulkan`) entre GPUs

Para contrastar empíricamente el lado derecho de la Figura 1, se ejecutó un benchmark autocontenido en Rust, `ge_h3_wgpu_bench`, con `wgpu` (`v22.1.0`) en modo headless. Este benchmark renderizó cuatro instantáneas canónicas de simulación en `Q32.32` (`ticks 0, 250, 1,000, 10,000`) sobre framebuffers `RGBA8Unorm` de `512×512` (`262,144` píxeles, `1,048,576` bytes por fotograma). El renderizado se realizó mediante un pipeline WGSL de dos pasadas: un fondo procedimental trigonométrico de radar y cuadrícula, seguido de `20` entidades SDF y esferas/toroides 3D con iluminación Blinn-Phong, mezcladas con alfa `SrcAlpha / OneMinusSrcAlpha` en orden de declaración. Como referencia se empleó un rasterizador de software entero `CPU Q16.16`, sin coma flotante.

| Adaptador A (`API` · Controlador) | Adaptador B (`API` · Controlador) | Media de píxeles diferentes (`%`) | Máx $|\Delta|$ (`0..255`) | MAE media (`u8`) | RMSE media (`u8`) | `PSNR` mínimo (`dB`) | `SSIM` mínimo | Criterio `GE-H3` |
|---|---|---:|---:|---:|---:|---:|---:|:---:|
| **Apple M3 Ultra (`Metal` 4)** | **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | `1.301%` | `2` | `0.00386` | `0.06215` | **`72.06`** | **`0.999986`** | **Aprobado** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **Apple M3 Ultra (`Metal` 4)** | `3.103%` | `1` | `0.00788` | `0.08876` | **`69.09`** | **`0.999956`** | **Aprobado** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | `3.774%` | `2` | `0.01022` | `0.10116` | **`67.97`** | **`0.999951`** | **Aprobado** |
| **AMD Radeon 8060S (`Vulkan` · Mesa `RADV` 26.0.8)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `6.553%` | `2` | `0.01735` | `0.13179` | **`65.64`** | **`0.999874`** | **Aprobado** |
| **Intel Iris Xe (`Vulkan` · Mesa `ANV` 26.0.8)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `8.280%` | `2` | `0.02149` | `0.14667` | **`64.79`** | **`0.999844`** | **Aprobado** |
| **Apple M3 Ultra (`Metal` 4)** | **NVIDIA GeForce RTX 4050 (`Vulkan` · `595.99.02`)** | `9.337%` | `2` | `0.02467` | `0.15720` | **`64.16`** | **`0.999833`** | **Aprobado** |
| GPUs físicas (`4` fabricantes) | `Mesa llvmpipe` (`LLVM 21.1.8` CPU `Vulkan`) | `1.541%` - `9.633%` | `2` - `3` | `0.00477` - `0.02601` | `0.06895` - `0.16173` | `63.86` - `70.87` | `0.999828` - `0.999984` | **Aprobado** |
| GPUs físicas (`4` fabricantes) | Referencia entera `CPU Q16.16` sin coma flotante | `20.400%` - `27.626%` | `2` | `0.05612` - `0.07864` | `0.23689` - `0.28068` | `59.13` - `60.58` | `0.999556` - `0.999693` | **Aprobado** |

- **Exactitud bit a bit falsificada, tolerancia delimitada confirmada (`24 / 24` pares de fotogramas GPU físicos)**: Cada par de GPU físico produjo digestos `RGBA8` `SHA-256` distintos (`0 / 24` coincidencias bit a bit) debido a aproximaciones del hardware SFU `sin`/`cos`/`pow` y al redondeo de la combinación ROP `unorm8`, sin embargo **cero píxeles en cualquier par de GPU físico difirieron en más de `2 / 255`** ($p(|\Delta| > 8) = 0.000000 \le 0.001$), `PSNR` superó `64.16 dB` (`> 40.0 dB` umbral), y `SSIM` superó `0.999833` (`> 0.999` umbral) en `0.31`-`2.80 ms` por fotograma.  
- **Contraste del rasterizador por software**: El rasterizador por software entero de punto flotante cero `CPU Q16.16` logró `0` desajustes de framebuffer `SHA-256` en `Apple M3 Ultra` (`arm64`), `AMD Zen 5` (`x86_64`) e `Intel Raptor Lake` (`x86_64`) (`9c693a38...` en tick `0`, `ce3b2cec...` en tick `10,000`), y `Mesa llvmpipe` (`LLVM 21.1.8`) coincidió bit a bit entre los hosts AMD e Intel `x86_64` (`ccb291f6...` en tick `0`), ilustrando que la divergencia de píxeles proviene específicamente de la variabilidad de hardware GPU shader/ROP más que de la proyección de escena $\lambda(s_t)$.

<div id="64-playable-joule-native-q3232-chrono-budget-arena-livinggame-engines" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Arena jugable nativa de joules con cronopresupuesto en `Q32.32` (`/living/game-engines/`)

Al unir el contrato exacto de reproducción en `Q32.32` de este estudio con la mecánica temporal nativa de energía de [El tiempo como índice](/papers/time-as-an-index/) (sección 9.2), el Instrumento 4 de [`/living/game-engines/`](/living/game-engines/) distribuye un minijuego jugable de navegación orbital determinista a `60 Hz` y defensa de recogida que se ejecuta en JavaScript `BigInt` (0 operaciones de punto flotante dentro de la simulación):

- **Cinta de estado con `SHA-256` en vivo y reproducción determinista**: Cada tick actualiza un resumen de estado `SHA-256` rodante y registra eventos de entrada del jugador compactos de 1 byte en $D$; al hacer clic en `Reproducir y verificar SHA-256` se vuelve a ejecutar toda la partida desde `(seed, D)` y se verifica la igualdad bit a bit del hash (`replayed_sha256 === live_sha256`).
- **Mirada temporal presupuestada en joules y rebobinado (modelo de diseño `est_j`)**: La consulta de trayectorias futuras (`Vista previa de rama Hellman`, simulando `3` ramas de dirección candidatas `K` ticks adelante) o el rebobinado a un punto de control causal persistente descuenta una batería explícita de microjoules (`µJ`) (`step_cost_uj` por tick especulativo más el coste de borrado de rama de Landauer cuando se descartan futuros no elegidos o líneas temporales rebobinadas), jugable mediante teclado, ratón/táctil y controladores `WebXR` / `Gamepad` (incluido Meta Quest Browser).

<div id="7-infeasibility-flags" class="anchor-alias" aria-hidden="true"></div>

## 7. Marcas de inviabilidad

1. **Renderizado de hardware bit a bit exacto entre GPU: inviable (`0 / 24` coincidencias de `SHA-256` entre `Metal`, `RADV`, `NVIDIA` y `ANV` en `GE-H3`), mientras que la tolerancia perceptual acotada (`PSNR > 64 dB`, `SSIM > 0.9998`, $\Delta_{\max} \le 2$) se mantiene siempre que las salidas de GPU nunca retroalimenten $S$.**
2. **Física exacta entre plataformas con configuraciones estándar de punto flotante: inviable.** Incluso *sin* `-ffast-math`, las funciones `std::sin`/`std::cos` entre sistemas operativos (`Apple libm` frente a `GNU glibc`) divergen en el tick `10`, y la contracción `FMA` entre ISAs (`x86_64` frente a `arm64` con `-ffp-contract=fast`) diverge en el tick `406`, lo que se propaga en una desincronización de la jugabilidad dentro de entre `9,798` y `11,205` ticks (`GE-H2`).
3. **Cómputo en GPU dentro de la simulación: inviable como exacto; factible únicamente con reducciones deterministas**, con un costo medido de aproximadamente 0,2 % a 7,8 % en el hardware citado, y aun así sujeto a la contracción del compilador salvo que se proteja cada instrucción (SPIR-V NoContraction) en todos los objetivos.
4. **Comportamiento portable entre motores: no demostrado en ninguna fuente externa consultada; demostrado a nivel del núcleo de física 2D en `GE-H1` en `25` celdas objetivo × anfitrión (`5` máquinas, `3` ISAs, `6` entornos de ejecución o compiladores), mientras que las proyecciones a motores completos (`GE-H4`, `GE-H9`) siguen abiertas.**
5. **Reglas interpretadas con grandes cantidades de actores: restringidas.** La medición de GameRule implica un techo cercano a 300 actores a 20 ms (`GE-H1` muestra además que el `int` de Python cuesta entre `73×` y `132×` el `reported_j` de Rust nativo en Intel, AMD y Apple Silicon); a escala se requiere una proyección nativa compilada o WebAssembly.
6. **Motores propietarios y objetivos Windows bare-metal como objetivos exactos: no verificados.** El manual de Unity, citado por GameRule, descarta garantías de orden de ejecución; los catálogos de plantillas de Unity y Unreal no pudieron leerse (sus páginas se renderizan del lado del cliente), no se leyó ninguna fuente sobre el orden de ejecución de Unreal, y la ejecución de `PE` en Windows bare-metal no estuvo activa en el conjunto de ejecutores Linux/macOS de la Ola 3.

<div id="8-sources-and-limits" class="anchor-alias" aria-hidden="true"></div>

## 8. Fuentes y límites

Cada fuente anterior se leyó completa en el pasaje citado, salvo: el artículo GameCraft-Bench (se leyó el resumen y el README del repositorio), la página “about” de RCE (se leyó la página resumen) y la historia de prensa de Capcom (un artículo). Los estudios complementarios de la misma institución citados para los niveles de telemetría (`SATB`) y la mecánica temporal de juegos presupuestada en julios son [Tiempo como Índice](/papers/time-as-an-index/) y el [Arnés de Evaluación Por Niveles de Saciación](/papers/satb-harness/) (`[same house]`). Fuentes consultadas pero no citadas como evidencia: el [portal Ludii](https://ludii.games/), que describe los juegos como conjuntos estructurados de ludemes; el repositorio hobby Game Grammar; y los READMEs de [PlayCanvas](https://github.com/playcanvas/engine), [Babylon.js](https://github.com/BabylonJS/Babylon.js) y [three.js](https://github.com/mrdoob/three.js), que describen bibliotecas de renderizado más que formatos de descripción de juegos.

No leídos, con paywall o de otro modo indisponibles: T. Schaul, "A Video Game Description Language for Model-based or Interactive Learning," IEEE CIG 2013, doi:10.1109/CIG.2013.6633610; J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845. M. Ebner et al., "Towards a Video Game Description Language," doi:10.4230/DFU.Vol6.12191.85, es de acceso abierto pero no se leyó para este estudio.

En la Sección 6, `GE-H1`, `GE-H2` y `GE-H3` dejan `measured_j = None` y `board_metered = false` en todas las ejecuciones (separando el `ri_energy_nj` por proceso `L3` de macOS del `reported_j` `RAPL` de socket/núcleo `L2` en Linux, y manteniendo las mecánicas `est_j` del Chrono-Budget Arena estrictamente analíticas). La ejecución `PE` de Windows bare-metal, el renderizado `wgpu` de Direct3D 12 y los emisores de motor múltiple (`GE-H4`-`GE-H9`) siguen siendo trabajo abierto.
