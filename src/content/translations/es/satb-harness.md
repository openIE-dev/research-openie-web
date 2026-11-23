---
title: "Satiation Benchmark: arnés de referencia, adaptadores y atribución de telemetría"
deck: "Un arnés de referencia secuencial fijo en Rust (Carril B), un único puente adaptador impuesto por proxy (Formas D, M, H e I), una suite de conformidad de doce verificaciones (C1 a C12), y un motor de atribución de telemetría sin raíz de cinco niveles (L0 a L4 cruzado con etiquetas A1 a N). Verificado empíricamente a través de cinco arquetipos de hardware: Apple M5 Max (arm64 macOS IOReport y `proc_pid_rusage` `reported_j`), Tegra aarch64 Jetson Thor (corriente total del tablero y corriente de tres rieles separada medida `measured_j`), Framework Desktop Strix Halo (x86-64 Linux 0440 `root:energy` grupo aislado `package-energy` `reported_j` más seguimiento de energía del paquete gráfico), Intel Core i9-13900H Raptor Lake (x86-64 Linux plataforma L1 y paquete-0 L2 `reported_j`), e Intel Core i7-1165G7 Tiger Lake más GeForce 2060 en Windows 11 (x86-64 compilación 26300 sin raíz L2 discreto-gráfico acumulativo `reported_j`, objeto de trabajo Win32 y contabilidad de ciclos, y etiqueta de procesador-paquete N). Los `measured_j` crudos, los `reported_j` y los canales lógicos L4 permanecen estrictamente separados y nunca se suman; dado que las cargas de trabajo co-inquilinas se ejecutaron en los hosts compartidos (`dedicated_host` es false), la atribución de colocación neta A2 se retiene según el Falsificador 6."
lang: "es"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*Revisión af57f48, 22 de noviembre de 2026. Resumen de datos y resumen: [/data/#satb-harness](/data/#satb-harness). Figuras vivas interactivas: [/living/satb-harness/](/living/satb-harness/). Gemelo archivístico LaTeX: [/pdfs/latex/satb-harness.pdf](/pdfs/latex/satb-harness.pdf) ([fuente](/pdfs/latex/satb-harness.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Descripción general

Cuando dos evaluaciones de agentes reportan tasas de finalización de tareas o cifras de energía distintas, la diferencia suele deberse a cómo se envolvió el modelo y a cómo se atribuyeron los contadores del host, más que al modelo en sí. Cambiar únicamente el arnés que lo rodea modificó la resolución de tareas de `Gemini 2.5 Pro` en `Terminal-Bench 2` en `17` puntos porcentuales, mientras que restar una línea base de reposo desplazada o repartir un raíl de silicio compartido según el tiempo de procesador puede distorsionar la atribución de energía en más de un `30%`.

Este estudio especifica y verifica empíricamente el contrato de evaluación del **Satiation Benchmark (`SATB`)**: un arnés de referencia secuencial fijo en Rust (**`Lane B`**), un puente adaptador aislado por proxy (**`Shapes D, M, H, and I`**) para controles sin modelo, puntos de conexión de modelo sin procesar, arneses de línea de comandos externos y resolvedores de benchmarks públicos, una huella criptográfica del sistema bajo prueba (`SUT`) de cinco bloques, doce comprobaciones obligatorias de conformidad y un motor de telemetría sin raíz de cinco niveles. En lugar de dejar el diseño sin medir, ejecutamos benchmarks de conformidad y falsificación en vivo en **cinco arquetipos de hardware** que abarcan `macOS`, `Linux` y `Windows 11`: una estación de trabajo `Apple M5 Max` (`128` gigabytes de memoria unificada, `macOS 27.2.1`, `IOReport` en chip y `proc_pid_rusage` del núcleo `reported_j`), un kit de desarrollo Tegra `aarch64` (`Jetson Thor`, `Linux 6.8.12-1021-tegra`, shunt de corriente físico de Texas Instruments de placa completa y de tres canales separados por riel `measured_j`), una estación de trabajo `Framework` Desktop `Strix Halo` (`Ryzen Max+ 395`, `Linux 7.0.0-43-generic x86-64`, paquete de energía aislado por grupo `0440 root:energy` `reported_j` más seguimiento de potencia de paquete `amdgpu`), una estación de trabajo `Raptor Lake` (`Intel Core i9-13900H`, `Linux 7.0.0-43-generic x86-64`, energía de plataforma y de paquete `reported_j`) y una estación de trabajo bare-metal `Windows 11` (`Intel Core i7-1165G7` más `GeForce 2060`, compilación `26300` de `Windows 11` `x86-64`, `reported_j` discreto-gráfico acumulativo sin raíz, confinamiento de objeto de trabajo Win32 y energía de paquete de procesador sin privilegios estrictamente marcada `not_available`), junto con energía de servidor en la nube cerrada (`not_available`).

**En palabras sencillas**

1. Un bucle de solicitud del agente, regla de recorte de contexto y sandbox de herramienta pueden modificar las puntuaciones de referencia tanto como cambiar el modelo subyacente, por lo que `Lane B` mantiene ese envoltorio completamente fijo en Rust determinista mientras que `Lane O` fuerza envoltorios externos a través de un enchufe proxy auditado.  
2. Los canales de energía se registran sin procesar en su verdadera frontera física, enchufe de pared completo, entrada de placa, paquete del chip, estimación del proceso del sistema operativo o libro mayor lógico de tokens, y nunca se combinan en un único número sin etiquetar, sumados entre clases de evidencia (`measured_j` vs. `reported_j` vs. `est_j`), o rellenados con promedios de sostenibilidad de flota.  
3. Pruebas en vivo en cinco plataformas de silicio y sistemas operativos (`macOS`, `Linux` y `Windows 11`) verifican la determinación exacta de `Shape D` millones de registros mapeados en memoria (`15027705736`) y `C9` reproducción (`149,747 B`, `0` diferencias de salto de línea o bytes), limpieza del árbol de procesos del kernel de `0.87-9.54 ms` (`2.46 ms` mediante Win32 Job Objects en `Windows 11`), no-determinismo de nube `temperature = 0` entre tres proveedores, techos de cadencia de sensores de hardware (`24.3-45.4 µs` lecturas de contador Linux a `94-97 Hz` vs. `1.17 ms` lecturas de contador gráfico en proceso Windows a `64.6 Hz` vs. `2.95 ms` lecturas de derivación de bus serie a `66.6 Hz` en `Jetson Thor` vs. `~8 Hz` `macmon` `IOReport`), error de `32.59%-89.88%` al dividir fases secuenciales de cómputo-más-almacenamiento por tiempo de procesador (`Falsifier 3`), y separación física de rieles gráficos vs. procesador junto con la compuerta de deriva de host compartido `Falsifier 6` (`dedicated_host = false`).

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Términos, acrónimos y etiquetas de atribución

<ul id="terms">
<li>SATB, SUT, PFRK, OQ, SPEC, BUNDLE, SUBMIT, REFUSE, STOP: arnés de Satiation Benchmark y especificación de atribución, sistema bajo prueba, resultados de intento de cuatro vías (aprobado, fallido, rechazado, terminado), pregunta abierta resuelta de la especificación, documento normativo de especificación, archivo de paquete de tareas, llamada terminal de envío de respuesta, llamada terminal de rechazo y token de parada de bucle secuencial</li>
<li>ACI, SWE, CLI, MCP, SDK, ACP, ARC, AGI, GUI: interfaz agente-computadora, prefijo de los benchmarks de ingeniería de software, interfaz de línea de comandos, Model Context Protocol, kit de desarrollo de software, Agent Client Protocol, Abstraction and Reasoning Corpus, conjunto de benchmarks de inteligencia artificial general y interfaz gráfica de usuario</li>
<li>IO, JSON, JSONL, RPC, JCS, UTF, HTTP, SSE, URL: protocolo de entrada/salida, JavaScript Object Notation, JSON delimitado por líneas, llamada a procedimiento remoto, JSON Canonicalization Scheme (RFC 8785), Unicode Transformation Format, Hypertext Transfer Protocol, Server-Sent Events y Uniform Resource Locator</li>
<li>POSIX, MMAP, DNULLMM1, SHA, SIGKILL, ESRCH, EACCES, EOF, NT, NTFS, CRLF, MSVC, UCRT, FFI, DLL: Interfaz Portable de Sistema Operativo, interfaz de archivos mapeados en memoria, formato binario de índice nulo determinista mapeado en memoria, Algoritmo Seguro de Hash (SHA-256), señal de terminación de procesos POSIX no capturable, estado del núcleo de proceso inexistente, estado de error de permiso denegado de POSIX, delimitador de heredoc de fin de archivo, núcleo Windows New Technology (`Windows NT`), Sistema de Archivos New Technology, secuencia de nueva línea retorno de carro y avance de línea (`\r\n`), compilador Microsoft Visual C++ (`cl.exe`), biblioteca de tiempo de ejecución universal de C de Windows (`ucrtbase.dll`), interfaz de funciones externas, y biblioteca de enlace dinámico</li>
<li>AI, ML, LLM, MLX, GGUF, KV, TP, ENERGY: inteligencia artificial, aprendizaje automático, modelo de lenguaje de gran tamaño, marco de arrays de Apple para inferencia local, pesos cuantizados en GPT-Generated Unified Format, caché clave-valor, paralelismo de tensores y consorcio ML.ENERGY de benchmarks de potencia de GPU</li>
<li>CPU, GPU, APU, ANE, SoC, ALU, ISA, IPC, PID, UID, GID, OS, VM, EC, GB, TGL, RTX: unidad central de procesamiento, unidad de procesamiento gráfico, unidad de procesamiento acelerado, Motor Neuronal de Apple, sistema en chip, unidad aritmético-lógica, arquitectura del conjunto de instrucciones, instrucciones por ciclo, identificador de proceso, identificador de usuario, identificador de grupo, sistema operativo, máquina virtual, controlador integrado, gigabytes, arquitectura móvil Intel Tiger Lake, y familia de GPU discretas NVIDIA GeForce RTX</li>
<li>RAM, DRAM, SLC, NVMe, PSU, PDU, AC, DC, DVFS, MSR, MMIO, RDTSC, HVCI, WMI, EMI, SRUM: memoria de acceso aleatorio, RAM dinámica, caché a nivel de sistema, Non-Volatile Memory Express, unidad de fuente de alimentación, unidad de distribución de energía, corriente alterna, corriente continua, escalado dinámico de voltaje y frecuencia, registro específico del modelo, entrada/salida mapeada en memoria, instrucción x86 Read Time-Stamp Counter, Windows Hypervisor-Protected Code Integrity, Windows Management Instrumentation, Windows Energy Metering Interface (`\\.\EnergyMeter`), y Windows System Resource Usage Monitor</li>
<li>RAPL, NVML, PPT, TI, I2C, ADC, INA, INA238, INA3221, AGX, VDD, SOC, MSS, VIN, SYS, PLATYPUS: Running Average Power Limit de Intel/AMD, NVIDIA Management Library, AMD Package Power Tracking, Texas Instruments, bus Inter-Integrated Circuit, convertidor analógico-digital, familia de monitores de corriente y potencia de Texas Instruments (`INA238`, `INA3221`), nivel de módulo NVIDIA Jetson AGX, riel de voltaje de alimentación de drenaje, riel de voltaje del sistema en chip, riel del subsistema de memoria, riel de voltaje de entrada del sistema y Power Leakage Attacks: Targeting Your Processor Using Software (ataques de fuga de potencia dirigidos a su procesador mediante software)</li>
<li>API, USD, CNCF, AISI, UK, AMD, NVIDIA: interfaz de programación de aplicaciones, dólares estadounidenses, Fundación de Computación Nativa en la Nube, Instituto de Seguridad en IA, Reino Unido, Advanced Micro Devices y Corporación NVIDIA</li>
<li>RCE, MoL, WCA, LUT6: Reality Code Engine [misma entidad], Mezcla de Límites [misma entidad], Automatización de Computadoras Sabias [misma entidad] y tabla de búsqueda booleana de 6 entradas</li>
</ul>

En los niveles de telemetría L0 a L4, cada canal registrado en un recibo `SATB` incluye tanto su frontera física como una de cuatro clases estrictas de evidencia:

| Clase de evidencia | Alcance en los recibos y tablas de `SATB` |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | Resúmenes canónicos `SHA-256` y `JCS` (`RFC 8785`) de los paquetes de tareas, de las huellas de `SUT` de cinco bloques y de las transcripciones de repetición; recuentos de tokens de prompt, caché, razonamiento y compleción registrados por el proxy; duraciones de reloj de pared; y `USD` de precio de lista de `API` con fecha. |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | Se rellena únicamente a partir de un analizador de pared de `AC` externo calibrado (`L0`) o de un monitor físico de derivación de corriente en la placa (`L1`/`L2`). Verificado en vivo en `NVIDIA Jetson AGX Thor` mediante `TI` `INA238` (`hwmon6` `VIN`, `L1`) e `INA3221` (`hwmon5` `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS`, `ch3 VIN_SYS_5V0`, `L2`/`L1`; `board_metered = true`). Dado que un co-inquilino activo ocupaba `VDD_GPU` durante la captura (`dedicated_host = false`), se conserva el `measured_j` bruto del raíl mientras se retiene la atribución neta de colocación `A2`; `measured_j` permanece en `None` en `Apple M5 Max`, `AMD Strix Halo`, `Intel Raptor Lake` y `Windows 11` (`i7-1165G7` + `RTX 2060`), y la potencia de pared `L0` queda sin establecer en todos los casos. |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | Contadores de telemetría en chip sin privilegios de root (`IOReport` de `Apple M5 Max`: `sys_power` en `L1` y `chip_power`/`cpu_power`/`gpu_power` en `L2` mediante `macmon`; `RAPL` de `Intel Raptor Lake`: `psys` en `L1` y `package-0`/`core`/`uncore` en `L2`; `RAPL` de `Framework AMD Strix Halo`: `package-0`/`core` en `L2` más vatios `PPT` de `amdgpu`; `NVML` sin root en `Windows 11`: `nvmlDeviceGetTotalEnergyConsumption`, `mJ` acumulados en `NVIDIA GeForce RTX 2060` en `L2`) y estimaciones por proceso modeladas por el `OS` (`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` en `L3`, etiqueta `D`). Nunca se suman a `measured_j` ni a `est_j`. |
| **`Provider-Attested (P) vs. Not Available (N)`** | La energía del servidor remoto de `API` cerrada (y la energía del paquete de `CPU` en modo usuario de Windows 11, donde los controladores `MSR` de `RAPL` en ring-0 están vedados) se escribe como `P` solo cuando un proveedor devuelve una cifra de energía por solicitud con su metodología literal; en caso contrario se escribe literalmente como "not_available" (etiqueta `N`). Las sustracciones de línea base derivadas que incumplen el límite de deriva del `5.0%` (`Falsifier 6`) o la comprobación de suma del `Step 7` se descartan automáticamente, mientras que los canales brutos permanecen intactos. |

<div id="11-lineage-design-invariants-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Linaje, invariantes de diseño y divulgación de misma casa

`SATB` se basa directamente en trabajos públicos de evaluación de agentes y atribución de energía en lugar de inventar protocolos personalizados donde existen normas: la ejecución mínima sin estado del shell sigue a `mini-swe-agent`; la solución y el puente externo-CLI se basan en `UK AISI Inspect` (`react()` y `Inspect Agent Bridge`) y `Terminal-Bench` (`Harbor` / `Terminus-2`); los esquemas de herramienta usan `MCP` canonizado mediante `RFC 8785` (`JCS`); la disciplina de contadores acumulativos de GPU sigue a Chung et al. (`ML.ENERGY` / `Zeus`) y Yang et al. sobre las trampas de muestreo a tiempo parcial de `nvidia-smi`; la división proporcional de `CPU` (`label C`) se evalúa contra el modelo `CNCF Kepler`; y el aislamiento de permisos de Linux `RAPL` sigue a Lipp et al. (`PLATYPUS`). Estudios complementarios de Open Interface Engineering, [Puertas de Compromiso Medidas](/papers/gates/), [Saciación de Tareas vs. Rebote Agregado](/papers/satiation/), y [Nulo Determinista](/papers/deterministic-null/), son trabajos `[misma casa]` citados estrictamente para definiciones arquitectónicas compartidas:

| Eje del contrato | Invariante preservado en todas las vías |
| :--- | :--- |
| **Protocolo de intento** | Escalera de tareas fija; como máximo un `SUBMIT` o `REFUSE` terminal por intento; un recibo `SHA-256` inmutable por intento; resultados canónicos `pass`, `fail`, `refuse`, `killed`; cero retroalimentación del verificador durante los intentos de prueba. |
| **Identidad del sistema** | Huella de `SUT` de cinco bloques (`model` + `serving` + `sampling` + `harness` + `envelope`), hashada en `session.open` y re-hashada en `session.close`. |
| **Energía atribuible** | Energía bruta de ventana completa de `SUT` (`A2`) en un host dedicado en reposo; energía del motor de inferencia en una vía física exclusiva (`A1`); energía de fase secuencial modelo-vs-herramienta (`B`) bajo `Lane B`. |
| **No atribuible** | Joules de servidor `API` cerrado no atestiguados (`N`); cuotas exactas de joules por proceso de un `SoC` compartido o vía de memoria unificada (`C` y `D` son modelos, no medidores físicos de la vía); pesos del modelo desacoplados de los núcleos del motor y del silicio. |

---

<div id="2-survey-of-agent-harnesses-and-why-context-policy-is-part-of-the-system" class="anchor-alias" aria-hidden="true"></div>

## 2. Revisión de arneses de agentes y por qué la política de contexto forma parte del sistema

Los arneses modernos de codificación, terminal y uso de computadoras difieren notablemente en la forma en que exponen las herramientas, controlan las ediciones de archivos y compactan las historias de conversaciones en crecimiento:

| Arnés | Bucle y superficie de herramientas | Política de contexto e historial |
| :--- | :--- | :--- |
| **`mini-swe-agent`** | Solo `Bash`. Cada acción genera un `subprocess.run` fresco sin estado. | Historial de mensajes estrictamente lineal y de solo adición; sin compactación automática. |
| **`SWE-agent` (`ACI`)** | Visor de archivos en ventana de 100 líneas, comando de edición controlado por linter, búsqueda sucinta. | El procesador de historial pliega las observaciones antiguas del entorno en resúmenes acotados. |
| **`Inspect react()`** | Bucle secuencial de herramientas hasta `submit()`: `bash()`, `text_editor()`, herramientas `MCP`. | Estado editable de mensajes con truncamiento de historial o solucionadores de compactación conectables. |
| **`Inspect Agent Bridge`** | Envuelve a `Claude Code`, `Codex CLI`, `Gemini CLI` y agentes `SDK` personalizados detrás de un proxy local. | Delega la gestión de contexto íntegramente al arnés externo envuelto. |
| **`Terminus-2` (`Harbor`)** | Única herramienta: sesión persistente de terminal `tmux` que recibe pulsaciones de teclas en bruto. | Resumen de contexto en tres etapas (`3-stage` de compresión progresiva de transcripciones). |
| **`Codex CLI`** | Shell en sandbox (`Landlock`/`seccomp` o `seatbelt`), `apply_patch` estructurado, `MCP`. | Compactación nativa y progresiva de contexto activada cerca de los límites de la ventana del modelo. |
| **`Claude Code`** | `Bash`, herramientas estructuradas de archivos (`Read`, `Write`, `Edit`, `Glob`, `Grep`), `MCP`. | Compactación automática de conversación impulsada por LLM (`auto-compact`) más caché de prompts. |
| **`OpenHands`** | Tiempo de ejecución basado en flujo de eventos que ejecuta cualquier agente de codificación `ACP` o `CodeAct` en contenedores. | Condensador de contexto configurable (resumen por `LLM` o enmascaramiento de ventana). |
| **`ARC-AGI-3` runner** | Arnés estándar frente a arneses de adaptadores de proveedor sobre estados de cuadrícula interactivos. | Ventana acotada de trayectoria de estado visual/cuadrícula declarada por pista de adaptador. |
| **`OSWorld run.py`** | Bucle de `GUI` de escritorio que emite acciones de ratón/teclado `pyautogui` sobre capturas de pantalla de VM. | Ventana deslizante de trayectoria que retiene solo las $K$ capturas de pantalla y acciones más recientes. |

En `Terminal-Bench 2`, `Gemini 2.5 Pro` resolvió un **`17%` más de tareas** cuando se emparejó con `Terminus-2` que cuando se emparejó con `OpenHands`, manteniendo constante el punto de control del modelo subyacente. Por tanto, la gestión de contexto, el truncamiento de salida, el linting de ediciones y las reglas de reintento son componentes de primer orden del sistema evaluado, y no meras tuberías neutrales. `SATB` resuelve este factor de confusión al dividir la evaluación en dos carriles explícitos y al cerrar las preguntas abiertas `OQ-1` y `OQ-2`:

1. **Mantener el envoltorio constante (`Lane B`) frente a la evaluación de envoltorios externos (`Lane O`)**: `Lane B` (`satb-agent`) fija un único bucle en Rust auditable para todos los modelos, mientras que `Lane O` envuelve arnés completos de terceros (`Claude Code`, `Codex CLI`, `OpenHands`, `Terminus-2`, `Inspect`) como `SUT` de caja negra. Sus prompts internos y sus llamadas de compactación se registran con hash en el bloque de huella del arnés (`harness`) y se enrutan al 100 % a través de `satb-proxy`.

2. **Resolución de la política de contexto (`OQ-1`: `ContextRule_v0`)**: La terminación forzosa de un intento sin ninguna elisión confunde el razonamiento de múltiples pasos con la salida verbosa de herramientas. Por su parte, la sumarización generada por un `LLM` (la autocompactación de `Claude Code`) introduce llamadas ocultas al modelo con componentes estocásticas, lo que rompe la reproducibilidad determinista del arnés. `Lane B` adopta **`ContextRule_v0`**: cada vez que el tamaño acumulado de la conversación supera el **`80%`** de la ventana de contexto declarada, el arnés sustituye de forma determinista las salidas de herramientas más antiguas por `"[ELIDED_BY_CONTEXT_RULE_V0]"`, conservando `system(TEMPLATE_v0)`, el `user(render(bundle))` inicial y las **8 salidas de herramientas más recientes** de forma literal, sin realizar **ninguna llamada al modelo**. La terminación forzosa `killed(context_ceiling)` se activa únicamente si los mensajes retenidos por sí solos superan el `100%` de la ventana.

3. **Resolución de la superficie de herramientas (`OQ-2`: `TOOLS_v0`)**: Un diseño exclusivamente basado en `exec` (estilo `mini`) obliga a los modelos a escapar en la shell parches de código fuente de varias líneas y demostraciones algebraicas (`cat << 'EOF'`), lo que introduce fallos de entrecomillado de la shell ajenos al razonamiento de la tarea y complica el aislamiento portable sin privilegios de root en `macOS`, `Linux` y `Windows`. `Lane B` fija **`TOOLS_v0`**: cuatro herramientas de espacio de trabajo (`exec`, `read_file`, `write_file`, `list_dir`) y dos herramientas terminales (`submit`, `refuse`), canonicalizadas mediante `JCS` en `tools_hash` (`d5b102...`).

---

<div id="3-reference-harness-lane-b-contextrule_v0-and-satb-io-protocol" class="anchor-alias" aria-hidden="true"></div>

## 3. Arnés de referencia (`Lane B`), `ContextRule_v0`, y protocolo `SATB-IO`

<figure class="my-8">
  <img src="/figures/satb-harness/satb-lane-b-architecture.svg" alt="Topología de aislamiento de componentes del Benchmark de saciedad Lane B y ciclo de vida de sesión determinista." />
  <figcaption>Figura 1. Izquierda: aislamiento de componentes `<code>Lane B</code>` que separa `<code>satb-meter</code>` sin raíz, `<code>satb-supervisor</code>`, `<code>satb-agent</code>`, `<code>satb-sandbox</code>` bloqueado por la red, `<code>satb-proxy</code>` que mantiene credenciales, y el `<code>Verifier</code>` externo inaccesible. Derecho: sesión `<code>SATB-IO</code>` determinista y secuencia de intentos.</figcaption>
</figure>

<div id="31-sequential-execution-loop-and-fixed-versus-configurable-split" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Bucle de ejecución secuencial y división fija versus configurable

Dentro de `satb-agent`, cada intento ejecuta un bucle de agente único estrictamente secuencial sin hilos de herramientas en segundo plano superpuestos, sin votación `best-of-k` y sin retroalimentación de oráculo verificador:

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

Cada ejecución de `Lane B` separa las constantes fijas del benchmark (incorporadas al hash `harness_id`) de los parámetros declarados del `SUT` (incorporados al hash `sut_fingerprint_sha256`):

| Fijo en todas las ejecuciones de `Lane B` (`harness_id`) | Configurable por `SUT` (`sut_fingerprint_sha256`) |
| :--- | :--- |
| Prompt `TEMPLATE_v0`, renderizador de bundle y aviso `CONTINUE_v0` | `model_id`, fecha de snapshot del proveedor o `SHA-256` del `GGUF`/safetensors local |
| Esquemas `TOOLS_v0` (digest `JCS` de `tools/list`) y despacho secuencial | Parámetros de muestreo: `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `reasoning_effort` |
| `ContextRule_v0` (umbral de `80%`, conservar los últimos `8`) y `Truncate_v0` (`8 + 8 KiB`) | Motor de inferencia (`llama.cpp`, `MLX`, `vLLM`, `API` en la nube) y banderas de lote/caché |
| Intento único (`attempts = 1`), cero retroalimentación del verificador, cero votación interna | Límites de sobre: `wall_ms`, `max_total_tokens`, `max_turns` |
| `satb-sandbox`: confinamiento en `/work`, entorno depurado y cero egreso de red | Cuotas de `CPU`/`RAM` del sandbox, silicio del host, kernel del `OS` y nivel de aislamiento |

<div id="32-canonical-four-way-outcome-mapping-oq-3" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Mapeo canónico de resultados cuádruple (`OQ-3`)

Para evitar que los benchmarks eliminen silenciosamente ejecuciones con fallas o confundan respuestas erróneas voluntarias con tiempos de espera de la infraestructura, `SATB` asigna los códigos de finalización legados de cinco estados sin pérdida a **`{pass, fail, refuse, killed}`** (`PFRK`), preservando el `sub_reason` exacto en cada recibo:

1. **`completed` $\to$ `pass` (`sub_reason: "verified"`, score `1`)**: `SUT` llamó a `submit(bytes)` antes de la expiración del techo y el `Verifier` externo aceptó los `bytes` después de `attempt.close`.
2. **`incorrect` $\to$ `fail` (`sub_reason: "incorrect"`, score `0`)**: `SUT` llamó a `submit(bytes)` de forma limpia; el `Verifier` externo rechazó el candidato.
3. **`malformed` $\to$ `fail` (`sub_reason: "malformed_submission"`, score `0`)**: `SUT` llamó voluntariamente a `submit(bytes)` con contenido no analizabl e o inválido según el esquema. Una mala presentación autorada por el `SUT` es una falla de precisión, nunca una eliminación de infraestructura.
4. **`refused` $\to$ `refuse` (`sub_reason: "policy" | "capability" | "other"`, score `0`)**: `SUT` invocó explícitamente `refuse(reason)`.
5. **`no_submission` $\to$ `killed` (`sub_reason: "wall_ceiling" | "token_ceiling" | "turn_ceiling" | "context_ceiling" | "usage_missing" | "exec_timeout_killed" | "process_crash"`, score `0`)**: `satb-supervisor` terminó el intento antes de que llegara cualquier llamada de herramienta terminal. Todos los cuatro resultados permanecen en el denominador $n$.

---

<div id="4-adapter-bridge-shapes-d-m-h-i-five-block-sut-fingerprint-and-c1c12-conformance" class="anchor-alias" aria-hidden="true"></div>

## 4. Puente de adaptadores (`Shapes D, M, H, I`), huella digital de `SUT` de cinco bloques y conformidad `C1-C12`

<div id="41-four-adapter-shapes-behind-one-supervisor-and-proxy" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Cuatro formas de adaptadores detrás de un supervisor y un proxy

Todo sistema externo a `Lane B` se conecta con `satb-supervisor` mediante una de cuatro formas de adaptador:

| Forma del adaptador | Sistemas objetivo | Contrato de ejecución y aislamiento | Estándares reutilizados |
| :--- | :--- | :--- | :--- |
| **`Shape D` (`dnull` control)** | Nulo determinista (`N0` estricto sin modelo y `N1` dev-cristalizado) sobre almacenes `mmap` `DNULLMM1` congelados | Se ejecuta dentro de `/work` bajo reglas idénticas de `TOOLS_v0` y `Verifier` con **`0` llamadas al modelo proxy** en el momento de la decisión. | `POSIX mmap` / Win32 `MapViewOfFile`, bucle entero de 64 bits `SPEC v0.4` |
| **`Shape M` (Model endpoint)** | Servidores locales de peso abierto y `API`s de nube cerrada | Ejecuta `Lane B` `satb-agent` sobre `Chat Completions` o `Messages` con llamadas a herramientas y `usage` obligatoria, enrutado 100% a través de `satb-proxy`. | `API` compatible con OpenAI (`llama.cpp`, `mlx_lm`, `vLLM`); traductores `Anthropic`, `Gemini`, `xAI` |
| **`Shape H` (Harness in a box)** | `Claude Code`, `Codex CLI`, `Gemini CLI`, `OpenHands`, `Terminus-2` | Tarea escrita en `/work/task/BUNDLE.md`. `URL` base dirigido a `satb-proxy` (`127.0.0.1:<port>`); las claves reales de `API` retenidas de `/work`; finaliza mediante `MCP` `submit` o `refuse`; cero egresos adicionales. | Variables de entorno del puente sandbox `Inspect`; `--strict-mcp-config` `MCP`; `ACP` opcional |
| **`Shape I` (`Inspect` agent)** | Solucionadores públicos de referencia `Inspect` existentes | Envuelve el paquete de tarea `SATB` con herramientas `submit` y `refuse` en `attempts = 1`, enrutando llamadas al modelo a través de `satb-proxy`. | Interfaz `Task` y `Solver` de `UK AISI Inspect` |

<div id="42-five-block-sut-fingerprint-and-session-validity" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Huella de cinco bloques `SUT` y validez de la sesión

Antes de que `attempt.start` pueda activarse, el adaptador devuelve una estructura JSON de cinco bloques cuya digesta canónica `JCS` `SHA-256` define el `SUT`. Los campos desconocidos o no observables deben escribirse literalmente como `"not_available"`, nunca omitidos ni adivinados:

| Bloque de huella | Campos requeridos (valores no disponibles escritos literalmente como `"not_available"` ) |
| :--- | :--- |
| **`model`** | `provider`, `model_id`, `snapshot_date`, `weights_sha256`, `quantisation`, `tokenizer_hash`, `chat_template_hash`, `context_window`, `system_fingerprint` |
| **`serving`** | `engine`, `version`, `commit`, `binary_hash`, `flags_hash` (`cache_prompt`, `slots`, `batch_invariance`, `TP`), `drivers`, `devices` |
| **`sampling`** | `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `stop`, `reasoning_effort`, `tool_choice` |
| **`harness`** | `name`, `version`, `commit`, `binary_hash`, `prompt_hash`, `tools_hash`, `context_policy`, `internal_voting`, `sub_agents`, `config_hash` |
| **`envelope`** | `hardware`, `os_kernel`, `isolation_tier`, `cgroup_limits`, `cpuset`, `network_policy`, `ceilings`, `telemetry_config_hash` |

**Invalidez de la sesión y canarios de inicio/fin.** Cualquier digest de bloque modificado en `session.close`, cualquier notificación `MCP` `tools/list_changed`, un reinicio del motor de inferencia, un restablecimiento del contador `NVML`, un `model` o `system_fingerprint` reflejado modificado a mitad de sesión, o una actualización del `OS`/controlador marca **cada recibo en la sesión como `void`**. Los recibos vacíos permanecen en el archivo público para auditoría pero se excluyen de la colocación en el benchmark. Debido a que un proveedor de nube puede intercambiar pesos o cuantización detrás de un `model_id` fijo sin actualizar `system_fingerprint`, cada sesión también encierra la evaluación con un canario determinista en `session.open` y `session.close`.

<div id="43-mandatory-c1c12-adapter-conformance-suite" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Suite de conformidad obligatoria de adaptadores `C1-C12`

Ningún adaptador ni arnés entra en evaluación hasta que supere las doce comprobaciones de conformidad (`C1` a `C12`):

| Comprobación | Requisito para superar la prueba |
| :--- | :--- |
| **`C1` Ida y vuelta del paquete** | El adaptador devuelve el digest `SHA-256` exacto de `JCS` correspondiente al paquete de tarea de entrada. |
| **`C2` Ruta de envío** | El `Verifier` externo recibe la secuencia de bytes exacta registrada en la captura del terminal de `satb-proxy` / `MCP`. |
| **`C3` Ruta de rechazo** | Un rechazo indicado llega limpiamente como `refuse` (`sub_reason = "other"`, `completion_score = 0`). |
| **`C4` Una sola llamada terminal** | Cualquier llamada a herramientas o al terminal emitida después del primer `submit` o `refuse` se ignora y se contabiliza. |
| **`C5` Ausencia de oráculo** | Los directorios, sockets y rutas padre (`..`) de `Verifier` y `satb-supervisor` no son accesibles desde `/work`. |
| **`C6` Egreso** | Solo `satb-proxy` (`127.0.0.1:<port>`) es accesible para el tráfico de modelos; los subprocesos de `/work` no tienen acceso de red externo y carecen de claves `API` ascendentes. |
| **`C7` Uso presente** | Cada llamada al modelo incluye `usage` (`missing -> killed(usage_missing)`); los totales de tokens del proxy coinciden exactamente con los recuentos del motor ascendente. |
| **`C8` Huella estable** | El digest `SHA-256` de la huella del `SUT` de cinco bloques es idéntico antes y después de una ejecución de prueba de 3 intentos. |
| **`C9` Reproducción del arnés** | La reproducción de las respuestas grabadas de `satb-proxy` produce una transcripción byte a byte idéntica (diferencias de `0` bytes o de `CRLF`; obligatorio para `Lane B`). |
| **`C10` Ruta de terminación** | El árbol de procesos descontrolado de `/work` (grupo de procesos `POSIX` o Win32 Job Object, incluidos los procesos hijos desacoplados) se elimina en `< 2,000 ms` y se registra como `killed`. |
| **`C11` Negociación de telemetría** | Los contadores de procesos `L3` sin privilegios (`cgroup v2`, `proc_pid_rusage` o `GetProcessTimes`/`QueryProcessCycleTime` de Win32) son legibles, llegan los marcadores de fase y se registra el desfase entre el reloj monotónico y el reloj de pared. |
| **`C12` Sonda de determinismo** | Se ejecutan `8` solicitudes idénticas y se registra el número de salidas distintas como propiedad empírica del `SUT`. |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. Atribución de telemetría en cinco niveles (`L0-L4 × A1-N`), mapas de canales por plataforma y lo que no puede atribuirse

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="Fronteras de atribución de telemetría en cinco niveles, de L0 a L4, cruzadas con las etiquetas de A1 a N y el pipeline de verificación de suma de siete pasos con prioridad a los datos brutos." />
  <figcaption>Figura 2. A la izquierda: los niveles de telemetría física y lógica <code>L0</code>-<code>L4</code> asociados a las etiquetas de atribución <code>A1</code>-<code>N</code>. A la derecha: disciplina de contadores de siete pasos con prioridad a los datos brutos, que impone los límites de deriva de referencia previa y posterior (<code>Falsifier 6</code>) y la verificación de suma del <code>Step 7</code>.</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Límites de telemetría (`L0-L4`) y etiquetas de atribución (`A1-N`)

Los sensores de energía y actividad se sitúan en cinco límites distintos que miden cantidades físicamente diferentes y que nunca deben sumarse ni confundirse:

| Nivel | Límite físico / lógico | Sensores representativos | Lo que el canal puede atribuir honestamente |
| :--- | :--- | :--- | :--- |
| **`L0` wall** | `AC` en la toma de la pared | Enchufe inteligente o `PDU` (`Shelly` `apower`, `aenergy`; analizador `Yokogawa`) | Toda la máquina, incluyendo el calor de conversión del `PSU`, ventiladores, `DRAM` y `NVMe`; cadencia `~1 s`. |
| **`L1` platform** | Raíl de entrada `DC` de la placa | Portador `Jetson Thor INA238`; `Mac sys_power`; `RAPL psys` | Todo el ordenador del lado `DC` aguas abajo del bloque de energía o `PSU`. |
| **`L2` package / SoC** | Paquete `CPU`, `GPU` y rieles `SoC` | `RAPL pkg`; `macmon IOReport` sin root; `Thor INA3221`; `amdgpu hwmon`; energía acumulada `NVML` (`mJ`) | Todo el `SUT` en el `SoC` (`A2`), o solo el motor de inferencia cuando un raíl es físicamente exclusivo (`A1`). |
| **`L3` process / cgroup** | Árbol de procesos único del `OS` | `Linux cgroup v2` (`cpu.stat`, `memory.peak`, `io.stat`), `perf`; `macOS proc_pid_rusage` `ri_energy_nj`; Win32 `GetProcessTimes` + `QueryProcessCycleTime` | Cuotas de actividad de recursos (`C`), o el propio modelo interno de energía por proceso del kernel del `OS` (`D`). |
| **`L4` logical** | La conversación modelo/herramienta | Recuentos de tokens y latencias de llamada de `satb-proxy`; turnos del arnés, llamadas a herramientas y elisiones `ContextRule_v0` | Recuentos exactos en cada `SUT` sin excepción, incluyendo `API`s cerradas de la nube. |

Cada valor de energía en un recibo lleva una de siete etiquetas de atribución:

- **`A1` (Raíl físico exclusivo)**: Un sensor de raíl de hardware tocado exclusivamente por una partición durante la ventana de medición (p. ej., `Jetson Thor INA3221 ch1 VDD_GPU` cuando solo el motor de inferencia local tiene acceso al dispositivo `GPU`).
- **`A2` (Límite dedicado de todo el sistema)**: Un contador de máquina completa (`L0`/`L1`) o de paquete completo (`L2`) en una máquina dedicada en reposo (`SUT` más `OS` inactivo). **Según `OQ-4`, la energía bruta de ventana completa del `SUT` en `A2` es la métrica de energía física principal para la colocación**, evitando que los modelos delgados descarguen búsquedas de fuerza bruta no contabilizadas en subprocesos de `/work` y evitando que la sustracción `activo - inactivo` favorezca ejecuciones lentas.
- **`B` (División temporal de fases)**: Diferencias de contadores a lo largo de ventanas temporales no superpuestas delimitadas por marcadores de fase secuenciales (`model_call` frente a `tool_call` en `Lane B`).
- **`C` (Cuota proporcional, el modelo `Kepler`)**: Un contador de hardware compartido particionado por $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ o utilización de `GPU` cuando se solapan procesos paralelos (`Lane O` `Shape H`).
- **`D` (Estimación modelada por el `OS`)**: El modelo interno de energía por proceso del núcleo (`macOS ri_energy_nj`). Aísla un árbol de procesos de los cotenants de `CPU`, pero sigue siendo un modelo de firmware/núcleo en lugar de una lectura física de derivación.
- **`P` (Atestado por el proveedor)**: Un número de energía por solicitud devuelto por un proveedor de nube junto con su metodología de medición literal.
- **`N` (`not_available`)**: No observado y **nunca estimado**.

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Disciplina de contadores en siete pasos, recolección sin privilegios de root (`OQ-5`) y mapas de plataforma

`satb-meter` procesa cada intento mediante siete pasos ordenados:
1. **Leer los contadores acumulativos en cada frontera de evento** (`attempt.start`, cada `model_call` y `tool_call`, `attempt.close`, más una marca de referencia de `100 ms`), de modo que la energía de la ventana sea una diferencia exacta de contadores $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$.
2. **Escribir primero los canales brutos**: registrar la frontera, el sensor, las lecturas inicial y final, los desbordamientos de contador y el número de muestras; marcar como `"below_resolution"` las ventanas más cortas que `10` periodos del sensor, y como `"not_available"` el hardware ausente.
3. **Dividir las fases secuenciales (`B`)**: en `Lane B`, la inferencia del modelo y las llamadas de herramienta `/work` nunca se solapan; los arneses paralelos de `Lane O` reducen la división de fases a `C` o `N`.
4. **Aislar `engine_resident_during_tools`**: mientras se ejecuta una herramienta `/work`, un servidor de modelo local (`llama-server`, `vLLM`) mantiene los pesos residentes en la `GPU`/`DRAM`. Su consumo en reposo durante la ventana de la herramienta se asigna a `engine_resident_during_tools` y no se imputa ni a la inferencia activa del modelo ni a la ejecución de la herramienta.
5. **Dividir por proporción (`C`) únicamente donde las particiones se solapan**: aplicar las razones de $\Delta \text{CPU}$ estrictamente como alternativa de caracterización, reconociendo que los estados `C`, el `DVFS` con turbo y los bloqueos de `DRAM`/almacenamiento violan la proporcionalidad.
6. **Almacenar las líneas base como canales derivados**: acotar las sesiones con líneas base residentes previas y posteriores; si la potencia en reposo previa y posterior deriva más de `5.0%` (`Falsifier 6`), descartar los valores netos derivados por encima del reposo, manteniendo intactos los canales brutos.
7. **Ejecutar la comprobación de suma (`Falsifier 2`)**: verificar que los componentes derivados de cada fase sumen de nuevo la diferencia bruta del contador del intento dentro de un cuanto del sensor (`1 mJ`); si no lo hacen, descartar la división derivada y conservar únicamente el canal bruto.

**Regla de recolección sin privilegios (`OQ-5`).** Los benchmarks nunca deben ejecutar la orquestación del `SUT` como `root` ni cargar controladores personalizados de anillo 0. En `macOS`, `satb-meter` utiliza `macmon` sin privilegios (suscripción a `IOReport`) y `proc_pid_rusage(RUSAGE_INFO_V6)` de `libSystem`, nunca `sudo` ni `powermetrics`. En `Linux` (donde `/sys/class/powercap/intel-rapl` pasó a ser accesible solo para `root` en el kernel `5.10`, tras `PLATYPUS`), una regla `udev` de administrador, aplicada una única vez, concede acceso de lectura a un grupo dedicado `satb-meter` que contiene **únicamente el `UID` de `satb-supervisor`**. Así se garantiza que los procesos del sandbox `/work` no puedan aprovechar un canal lateral sobre `RAPL` ni leer su propio medidor de energía. En `Windows 11` (`NT 10.0.26300`), los tokens de usuario básico sin privilegios (`0x20000`) leen directamente la energía acumulada (`mJ`) de la `GPU` discreta mediante `nvml.dll` (`nvmlDeviceGetTotalEnergyConsumption`) y los ciclos de proceso de `L3` mediante `QueryProcessCycleTime` de Win32. En cambio, el `MSR` `0x611` de Intel `RAPL` requiere un controlador de kernel de anillo 0, prohibido por `OQ-5` y por `HVCI`. Por ello, la energía del paquete de `CPU` en Windows queda estrictamente en `"not_available"`, con la etiqueta `N`.

| Plataforma objetivo | Canales `L0` / `L1` de sistema completo | Canales de paquete `L2` / `SoC` | Canales de proceso `L3` y lógicos `L4` | Estado de verificación clave |
| :--- | :--- | :--- | :--- | :--- |
| **Apple Silicon Mac** (`M5 Max` verificado) | `L0`: `Shelly` `PDU` (`not_available` si está desconectado); `L1`: `macmon sys_power` (`reported_j`) | `macmon IOReport`: `chip_power`, `cpu_power`, `gpu_power`, `ane_power`, `ram_power` (`reported_j`) | `L3`: `proc_pid_rusage` `ri_energy_nj` (`D`), `ri_instructions`, `ri_diskio_*`; `L4`: `satb-proxy` | `L1`-`L4` sin privilegios (rootless) verificados en vivo en `Apple M5 Max`; `L0` pendiente de conexión. |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`, verificado en `Linux x86-64`) | `L0`: `Shelly` `PDU` (`not_available` si está desconectado); `L1`: `cros_ec` (atributos de potencia `0`) | `RAPL package-0` y `core` (`0440 root:energy` `udev`) `reported_j` + `amdgpu` `PPT` `power1_input` (`0444`; `energy1_input` ausente) | `L3`: `cgroup v2` / `getrusage` (cuotas de actividad `C`); `L4`: `satb-proxy` | Verificado en vivo (aislamiento `0440 root:energy` `PLATYPUS`; `amdgpu PPT` `0444`). |
| **Intel Raptor Lake** (`Core i9-13900H`, verificado en `Linux x86-64`) | `L0`: `not_available`; `L1`: `RAPL psys` (`intel-rapl:1/energy_uj`, `0444` `reported_j`) | `RAPL package-0`, `core` y `uncore` (`energy_uj` por `MSR` + `MMIO`, `0444` `reported_j`) | `L3`: `cgroup v2` / `getrusage` (cuotas de actividad `C`); `L4`: `satb-proxy` | Verificado en vivo (residuo `Step 7` de `0 µJ` entre `psys` `L1` y `package-0` `L2`). |
| **NVIDIA Jetson AGX Thor** (Tegra verificado en `Linux aarch64`) | `L1`: `TI INA238` (`hwmon6` `VIN`, `0444` `measured_j`) + `INA3221 ch3 VIN_SYS_5V0` (`0444` `measured_j`) | `INA3221 ch1 VDD_GPU` (`0444` `measured_j`, `A1` en exclusiva); `ch2 VDD_CPU_SOC_MSS` (`0444` `measured_j`); `NVML` (`unverified`) | `L3`: `cgroup v2` / `getrusage` (cuotas de actividad `C`); `L4`: `satb-proxy` | Verificado en vivo (`INA238` + `INA3221 ch1-ch3` `0444` sin privilegios; `NVML` de GPU pendiente bajo bloqueo de co-inquilino). |
| **Windows 11 `x86-64` + `RTX` discreta** (`i7-1165G7` + `RTX 2060`, verificado en `NT 26300`) | `L0`: `not_available`; `L1`: `WMI` `EMI` `PowerMeter` (`0` instancias -> `not_available`) | `RTX 2060`: `nvml.dll` sin privilegios, energía acumulada en `mJ` (`reported_j`); `CPU` `RAPL` `MSR 0x611`: **`N` (`not_available` sin controlador de anillo 0)** | `L3`: Win32 `GetProcessTimes` + `QueryProcessCycleTime` (cuotas `C`; se excluye el `SRUM` grueso de fondo del `OS`); `L4`: `satb-proxy` | Verificado en vivo con token `0x20000` de usuario básico (`Basic User`) (residuo `Step 7` de `0 mJ`; cierre del Job Object en `2.46 ms`). |
| **API cloud cerrada** (`Anthropic`, `xAI`, `Cerebras`, `OpenAI`, `Google`) | `L0`-`L1` locales solo en el cliente anfitrión (excluidos de la inferencia en servidor) | `L2` del servidor remoto: estrictamente **`N` (`not_available`)** o **`P`** por solicitud (`OQ-6`) | `L3` local en `/work` (`D`/`C`) para herramientas de sandbox; `L4`: tokens, llamadas y `USD` **exactos** de `satb-proxy` | Verificado en vivo en `Anthropic`, `Cerebras` y `xAI` mediante `satb-proxy`. |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Ocho trampas de medición de hardware y siete cantidades no atribuibles

Los atajos estándar de medición de energía fallan sistemáticamente en los modernos `SoC`s y `GPU`s:

| Problema de telemetría de hardware | Mitigación en `SATB` |
| :--- | :--- |
| **La potencia en reposo deriva con la temperatura del die, los ventiladores, `DVFS` y el turbo** | Esperar el enfriamiento de la `GPU` (`<= 1.5 W`), encuadrar cada ventana con líneas base previa y posterior, registrar la temperatura máxima de la `GPU` e invalidar los julios netos derivados cuando la deriva supere el `5.0%` (`Falsifier 6`). |
| **Ambigüedad entre el reposo de máquina fría y el reposo con pesos residentes** | Medir y etiquetar explícitamente ambos casos en el `Paso 6`, en lugar de restar uno de forma silenciosa. |
| **La resta `Active - idle` favorece a las ejecuciones lentas** | La energía bruta de la ventana del `SUT` completo (`A2`) sigue siendo la cifra principal de ubicación (`OQ-4`). |
| **Las ventanas de duración inferior a un periodo del sensor se leen como cero, negativas o ruido de cuantización** | Marcar cualquier ventana más corta que `10` periodos del sensor como `"below_resolution"` (p. ej., `< 1.2 s` con `macmon` a `~8 Hz` o `< 10 s` con un enchufe inteligente de `1 Hz`). |
| **Los muestreadores de telemetría de alta frecuencia consumen una potencia de CPU considerable** | Leer los contadores acumulativos en los límites de evento (`0.011 mW` a `0 Hz`) más un tick de `100 ms`, y registrar la línea base `observer_only`. |
| **El medidor de potencia instantánea de `NVML` en `A100`/`H100` solo muestrea alrededor del `~25%` del tiempo de ejecución** | Leer el contador acumulativo `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) mediante `FFI` en el mismo proceso (`1.17 ms` en `RTX 2060` frente a `43.88 ms` con el subproceso de `nvidia-smi`), y nunca sondear `nvmlDeviceGetPowerUsage` de forma instantánea (Chung et al.; Yang et al.). |
| **El medidor externo de enchufe de pared `L0` funciona con un reloj no sincronizado** | Emitir un pulso de calibración determinista con ciclo de trabajo del `50%` en `session.open` y `session.close`, y correlacionar cruzadamente las marcas temporales. |
| **Demonios de fondo del host compartido o trabajos de co-inquilinos** | Registrar la lista de procesos, degradar las restas derivadas de `L2` en host compartido mediante `Falsifier 6`, y registrar junto al `L2` bruto la energía `ri_energy_nj` (`D`) de `L3` aislada del co-inquilino. |

En consecuencia, **siete magnitudes no pueden atribuirse de forma honesta** y quedan excluidas de las afirmaciones de `SATB`: (1) la energía del servidor de una `API` de código cerrado no certificada (solo `N` o `P`); (2) los julios físicos exactos por proceso en un raíl compartido de `SoC` o de memoria unificada (`C` y `D` son modelos); (3) los pesos del modelo aislados de los núcleos de servicio, la cuantización, el procesamiento por lotes y el silicio; (4) la titularidad del consumo en reposo del `OS` y la potencia de los pesos residentes en `DRAM` (se reportan como canales independientes); (5) los eventos individuales más cortos que el periodo del sensor (como una llamada a herramienta de `30 ms` bajo un muestreo de `1 s`); (6) las `VM` de nube compartidas o los dominios de `CPU` de Windows sin privilegios que carecen de contadores de hardware en modo usuario; y (7) los cambios silenciosos de pesos por parte del proveedor durante una sesión (detectados mediante canarios de inicio y fin, pero nunca descartados a priori). En particular (`OQ-6`), **las declaraciones de sostenibilidad de los proveedores son medianas de flota y no mediciones por solicitud, y nunca entran en un recibo `SATB`**, incluidas la mediana de `0.24 Wh` por prompt de `Gemini Apps` publicada por Google, la cifra de `0.34 Wh` de OpenAI (publicada sin metodología) y los `1.14 gCO2e` por respuesta de `400` tokens de Mistral.

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. Resultados de conformidad medida, determinismo, efecto observador y atribución multi-huésped

Para reemplazar suposiciones de diseño no medidas con recibos auditables, ejecutamos el conjunto completo de conformidad `SATB` y el arnés falsificador (`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`, tiempo total de ejecución `175.69 s`) en una estación de trabajo `Apple M5 Max` (`arm64`, `128 GB` de memoria unificada, `macOS 27.2.1`, `macmon 0.12.0`), junto con una auditoría transversal de `188` ventanas y ejecuciones multi-silicio en vivo entre sistemas operativos en `Linux` y `Windows 11`.

<div id="61-c1c12-conformance-c9-deterministic-replay-and-c10-process-tree-cleanup" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Conformidad `C1-C12`, repetición determinista de `C9` y limpieza del árbol de procesos de `C10`

Todas las **comprobaciones de conformidad de referencia en Rust `12 / 12`** (`dnull_cli satb-conformance`) y todas las comprobaciones extendidas del sistema operativo pasaron:

- **Comprobaciones de paquete, terminal, confinamiento y huella digital (`C1`-`C8`, `C11`)**: `C1` devolvió el resumen canónico del paquete `455e941f51f8ffef`; `C2` entregó cargas útiles `submit` exactas a nivel de bytes a través de `satb-proxy` al `Verifier`; `C3` asignó rechazos vacíos o instruidos a `refuse:other`; `C4` ignoró llamadas a herramientas posteriores a `submit` (`ignored_trailing_calls = 1`); `C5` bloqueó escapes `../`, `/etc/passwd` y `verifier_oracle/*`; `C6` eliminó variables de entorno de proxy o credenciales dentro de `/work` (`NP=*|HTTP=`) y devolvió `HTTP 404` en rutas de proxy no listadas; `C7` abortó inmediatamente las respuestas sin uso como `killed(usage_missing)`; `C8` preservó una huella digital de cinco bloques idéntica a nivel de bytes `8b741c27bf364e5d` en ejecuciones en seco, al tiempo que marcaba intercambios simulados de `system_fingerprint` con `session_void = true`; y `C11` verificó la visibilidad sin privilegios del contador `RUSAGE_INFO_V6` (`sudo_invoked = false`).
- **Repetición extendida de `C9` multi-turno `ContextRule_v0` + `Truncate_v0`**: En un trazado de `14` turnos que generaba lecturas de archivos sin procesar de `24 KiB` por turno (`14` salidas truncadas a `8,192 B + 8,192 B` mediante `Truncate_v0`) dentro de una ventana de `48,000` tokens (umbral del `80%` = `38,400` tokens), `ContextRule_v0` elidió de forma determinista los **`5` resultados de herramientas más antiguos** con **`0` llamadas adicionales al modelo**, produciendo una transcripción canónica de `149,747` bytes (`SHA-256` `d697ed1476129939...`) con **`0` diferencias de bytes** en repeticiones independientes de `/work`. Al repetir el trazado idéntico bajo una ventana estricta de `16,000` tokens (donde `8` salidas retenidas de `16 KiB` superan el `100%`), se activó de forma determinista `killed(context_ceiling)`.
- **Limpieza extendida de `C10` multi-proceso `SIGKILL` (techo de especificación `< 2,000 ms`)**: En `5` ensayos que generaban un árbol de `4` procesos (`sh` padre más `3` procesos Python en segundo plano desvinculados en un grupo de procesos aislado), la entrega de `SIGKILL` y la recolección del núcleo se completaron en **`2.073 ms` de media** (`1.429 ms` mínimo, `2.571 ms` máximo, **`778×` por debajo** del techo de `2,000 ms`) con **`0` `PID`s supervivientes** y resultado `killed(wall_ceiling)`.

<div id="62-live-c12-eight-request-determinism-probes-across-four-model-substrates" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Sondeos de determinismo `C12` con ocho solicitudes en vivo sobre cuatro sustratos de modelo

Enrutar `8` solicitudes idénticas de síntesis algebraica por modelo (`32` llamadas en vivo a la nube más `8` ejecuciones locales de `Shape D`) a través de `satb-proxy` verificó una paridad exacta del recuento de tokens `C7` del `100%` (`32/32` llamadas) y expuso tres regímenes de determinismo distintos:

| `SUT` / Endpoint a través de `satb-proxy` | Preflight con `temperature = 0` | `sampling.temperature` registrado | Salidas crudas distintas (`/ 8`) | Formas algebraicas distintas (`/ 8`) | `system_fingerprint` | Latencia media |
| :--- | :---: | :--- | :---: | :---: | :--- | ---: |
| **`Shape D`: `dnull N1`** (local, Rust) | `i64` exacto | `0 (exact_i64_q1e6)` | **`1 / 8`** | **`1 / 8`** | `0da4df8d9ccbce1e…` | `1,474.0 ms` |
| **`Anthropic claude-opus-5-5`** | **`HTTP 400`** | `not_available` (obsoleto) | **`8 / 8`** | **`4 / 8`** | `not_available` | `3,389.1 ms` |
| **`Anthropic claude-sonnet-5-5`** | **`HTTP 400`** | `not_available` (obsoleto) | **`8 / 8`** | **`2 / 8`** | `not_available` | `2,914.3 ms` |
| **`Cerebras gpt-oss-120b`** | `HTTP 200` | `0.0 (seed=42)` | **`2 / 8`** | **`2 / 8`** | `fp_fd4dff7eed92aaf38281` | `484.2 ms` |
| **`xAI grok-4.20-0309-non-reasoning`** | `HTTP 200` | `0.0 (seed=42)` | **`8 / 8`** | **`1 / 8`** | `fp_9974b11849` | `942.7 ms` |

1. **Obsolescencia de `temperature = 0` por parte del proveedor**: Tanto `claude-opus-5-5` como `claude-sonnet-5-5` rechazaron `"temperature": 0.0` con **`HTTP 400` (`"`temperature` está obsoleto para este modelo."`)**, lo que valida empíricamente la regla de `SATB` según la cual los controles de muestreo no disponibles se normalizan a `"not_available"` en lugar de asumirse, sin más, iguales a cero. En `8` llamadas idénticas, `claude-opus-5-5` (`1,047` tokens de razonamiento adaptativo) emitió `8` textos crudos distintos que abarcan `4` identidades de vectores de bits algebraicamente distintas: `(x | y) - (x & y)`, `(x | y) & ~(x & y)`, `(x & ~y) | (~x & y)` y `(x + y) - ((x & y) + (x & y))`.
2. **No determinismo residual bajo `temperature = 0, seed = 42`**: Incluso cuando `temperature = 0.0` y `seed = 42` fueron aceptados (`HTTP 200`) con un `system_fingerprint` estable, `Cerebras gpt-oss-120b` (`2,976` tokens de razonamiento) produjo `2` salidas distintas en `8` llamadas idénticas, mientras que `xAI grok-4.20-0309-non-reasoning` se estabilizó en `1` fórmula algebraica (`(x | y) & ~(x & y)`) en las `8` llamadas, pero varió la oración de prueba en prosa en `8/8` respuestas. Por tanto, separar el **determinismo del arnés dadas las respuestas registradas (`C9`)** de la **dispersión medida de la salida del `SUT` (`C12`)** es esencial.

<div id="63-falsifier-5-observer-effect-benchmark-across-telemetry-cadences-10-s-windows" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Falsificador 5: Benchmark de efecto del observador a través de cadencias de telemetría (`10 s` windows)

Medición del tiempo `CPU` del muestreador combinado (`Python` + tubería hija `macmon` `IOReport`), la energía `L3` `ri_energy_nj` (`observer_only` `reported_j`), y el `L2` `reported_j` de todo el `SoC` a través de ventanas intercaladas de `10.0 s` en `Apple M5 Max` cuantificó la sobrecarga exacta del observador:

| Cadencia de muestreo | Tasa alcanzada | Tiempo `CPU` del muestreador / `10 s` | Observador `L3` `reported_j` | Potencia del observador (`mW`) | Participación de la ventana `L2` | Ventana `L2` completa del `SoC` (`reported_j`) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`0 Hz` solo-límite** (`2` `rusage` syscalls) | `0.20 Hz` | **`0.004 ms`** | **`0.000108 J`** | **`0.011 mW`** | **`0.0000%`** | `-` (daemon `IOReport` cero) |
| **`1 Hz` (`1,000 ms` marca)** | `0.90 Hz` | `9.323 ms` | `0.194237 J` | `19.371 mW` | `0.0521%` | `372.769 J` (`37.17 W`) |
| **`10 Hz` (`100 ms` `SATB` tick de referencia)** | `8.12 Hz` | `36.434 ms` | `0.666596 J` | **`66.439 mW`** | **`0.1770%`** | `376.603 J` (`37.53 W`) |
| **`100 Hz` (`10 ms` falsificador de estrés)** | `7.44 Hz` | `35.636 ms` | `0.598721 J` | `58.971 mW` | `0.1618%` | `369.926 J` (`36.44 W`) |

Dos hechos de hardware emergen directamente de esta medición:
1. **Perturbación insignificante (`< 0.18%`)**: Las lecturas `proc_pid_rusage` solo-límite consumen `108 µJ` (`0.011 mW`), **`6,040×` menos potencia** que el sondeo `IOReport` a `10 Hz` (`66.44 mW`), y aun el tick de referencia `100 ms` representa sólo **`0.177%`** de la energía de la ventana completa del `SoC` (`0.76%` diferencia total de la ventana `L2` entre `-i 10` y `-i 1000`, despejando `Falsificador 5`).
2. **Límite de cadencia de suscripción `IOReport` (`~8 Hz`)**: Solicitar `-i 10` (`100 Hz`) a `macmon 0.12.0` alcanzó **`7.44 Hz`** (`75.5` muestras en `10.15 s`) porque cada ciclo de suscripción `IOReport` sin raíz bloquea durante `~120 ms` en el espacio de usuario de macOS. En consecuencia, el piso `below_resolution` de `10` períodos del `Paso 2` corresponde físicamente a **`~1.2 s`** en las ventanas `L2` de `macmon`, mientras que las operaciones subsegundo deben depender de los contadores `L3` `ri_energy_nj` a `0 Hz` o de ventanas agrupadas.

<div id="64-falsifier-3--step-7-b-temporal-boundary-vs-c-proportional-kepler-attribution" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Falsificador 3 y Paso 7: límite temporal `B` frente a atribución proporcional (`Kepler`) `C`

A lo largo de `3` réplicas en `Apple M5 Max`, un único `SUT` ejecutó la **Fase 1** (`2.50 s` de ráfaga densa en ALU de resumen `SHA-256`: `29.27 ms` de tiempo medio de `CPU`, `38.63 mJ` por `CPU`-ms) seguida secuencialmente de la **Fase 2** (`2.51 s` de barrido de fallos de caché en `192 MiB` de `DRAM` + vaciados síncronos `fsync` a disco y esperas de `E/S` de `8 ms`: `15.94 ms` de tiempo medio de `CPU`, `27.73 mJ` por `CPU`-ms) junto con un trabajador en segundo plano de ciclo de trabajo estable:

| Comprobación de atribución (`n = 3` réplicas secuenciales bifásicas + cotenientes) | Fase 1 (`Compute` `2.50 s`) | Fase 2 (`DRAM + fsync E/S` `2.51 s`) | Veredicto del falsificador / Paso 7 |
| :--- | ---: | ---: | :--- |
| **Límite temporal exacto `B` delta `L3` (`reported_j`)** | `1.1272 J` (`1,127,172 µJ`) | `0.4433 J` (`443,317 µJ`) | **`Paso 7` residual `<= 1 µJ` (`3/3` aprobado)** |
| **`C` (participación $\Delta\text{CPU}$ de `Kepler`: `64.58%` frente a `35.42%`) en `L3`** | `1.0145 J` (`-10.00%`) | `0.5560 J` (**`+25.21%` error medio**) | Energía/ms de `DRAM`/bloqueo $\ne$ energía/ms de `ALU` |
| **Ventana temporal exacta `B` `L2` de todo el `SoC` (`reported_j`)** | `82.246 J` | `90.975 J` | `DRAM`, `NVMe` y consumo del anfitrión persisten en espera de `E/S` |
| **`C` (participación $\Delta\text{CPU}$ de `Kepler`) aplicada a la ventana `L2`** | `111.758 J` (**`+35.86%` error**) | `61.464 J` (**`-32.59%` error**) | **`Falsificador 3` activado (`> 20%` error)** |

Aunque la comprobación de suma del Paso 7 se mantuvo en `0-1 µJ` (`100.0%` de las pruebas) bajo diferencias de contadores de límite (`B`), la atribución proporcional al tiempo de `CPU` (`C`) sobreatribuyó la ráfaga de cómputo en **`+35.86%`** y subatribuyó la fase de memoria y `fsync` en **`-32.59%`** en el `L2` compartido (y erró en **`25.21%`** incluso en `L3` por proceso), confirmando empíricamente por qué `SATB` restringe `C` a arneses paralelos superpuestos (`Shape H`) y señala divergencias secuenciales `> 20%` mediante el Falsificador 3.

<div id="65-multi-session-falsifier-6-audit-188-windows-and-falsifier-8-harness-floor-check" class="anchor-alias" aria-hidden="true"></div>

### 6.5 Auditoría multisesión de `Falsifier 6` (`188` ventanas) y verificación del piso del arnés de `Falsifier 8`

La auditoría de **`188` ventanas `IOReport` `L2` reales**, recopiladas en tres campañas experimentales sobre el host compartido `Apple M5 Max` y en dos evaluaciones pareadas de `Lane B` frente a `Shape H` (`Claude Code 2.1.330`), confirma ambas salvaguardas a nivel de sesión:

1. **Auditoría de deriva de la línea base de `Falsifier 6` (`188` ventanas)**: En `exp-001` (`11` ventanas: `1` dentro del `5.0%`, `10` con deriva ascendente de hasta `44.5%`), `exp-002` más el experimento multiturno (`7` ventanas: `2` dentro del `5.0%`, el lote `dnull` de `1,190` instancias con deriva de `3.09%` y `BigCodeBench` con `Qwen 3.6` con deriva de `1.02%`, y `5` con deriva de `12.16%-65.11%` bajo síntesis concurrente con `yosys-abc`), y `ai-reads-human` (`170` ventanas con `loadavg_1m = 12.92`: `61` dentro del `5.0%`, `109` con deriva), **`64 / 188` ventanas (`34.04%`)** conservaron un `derived_marginal_j` válido, mientras que **`124 / 188` (`65.96%`)** invalidaron automáticamente la sustracción neta por encima de la inactividad sin perder ni lectura bruta `L2` ni lectura `reported_j` por `PID` `L3` (`188 / 188 = 100.0%` de supervivencia bruta).
2. **`Falsifier 8` (`Lane B` frente a `Shape H` `Claude Code 2.1.330`)**: En `24` paquetes pareados de políticas formales y de `SQLite` en `/work`, `Lane B` alcanzó **`24 / 24` (`100.0%`)** tanto con `Claude Opus 5.5` (`44` llamadas al modelo, `63,568` tokens de prompt más caché, `\$0.5477`) como con `Claude Sonnet 5.5` (`43` llamadas, `60,284` tokens, `\$0.3413`). Este resultado iguala a `Shape H` (`Claude Code 2.1.330`: **`24 / 24`**, `89` llamadas y `218,449` tokens con `Opus 5.5`; `83` llamadas y `196,128` tokens con `Sonnet 5.5`), al tiempo que reduce el tráfico de tokens de prompt más caché en **`3.44×` y `3.25×`**. En `6` repositorios Python de reparación de errores de múltiples archivos no vistos durante el desarrollo (`config-defaults`, `interval-merge`, `pagination`, `precedence`, `rate-window`, `retry-backoff`), `Lane B` (`Opus 5.5` con `28` llamadas y `52,045` tokens; `Sonnet 5.5` con `31` llamadas; y `Qwen 3.6 35B-A3B` local con `42` llamadas y `2,342.05 J` de `L2`) volvió a igualar a `Shape H` (`Claude Code 2.1.330` + `Opus 5.5`: **`6 / 6`**, `30` llamadas y `86,744` tokens, es decir, `1.67×` más tokens). Esto confirma que `Lane B` **no** es un piso del arnés deficiente.

<div id="66-multi-platform-hardware-attribution-across-five-silicon-and-os-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 Atribución de hardware multiplataforma en cinco arquetipos de silicio y SO

Para verificar que la conformidad de `SATB`, el determinismo de punto fijo de `Shape D`, los límites de permiso sin raíz de `PLATYPUS` / `HVCI`, y la atribución física de derivación o acumulativa de `NVML` se mantengan en `macOS`, `Linux` y `Windows 11`, ejecutamos `run_multi_host_satb.py` (`multi_host_satb_receipts.json`) y `run_windows_suite.py` (`windows_satb_receipts.json`) en cuatro arquetipos de hardware adicionales de `Linux` y `Windows 11` junto con `Apple M5 Max`:

| Arquetipo de hardware y kernel `OS` | Límite de sensor sin raíz y clase de evidencia | `Shape D` `1M` `DNULLMM1` (`10k` sondas) | Reproducción `C9` y media de eliminación de árbol `C10` | Latencia de lectura única y `100 Hz` alcanzado | Residual `Step 7` y `Falsifier 3` (`C` vs. `B`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`** (`arm64`, `128 GB`, `macOS 27.2.1`) | `IOReport` `L1`/`L2` + `rusage` `L3` (`reported_j`; `measured_j = None`) | `15027705736` (`388.43 ns` `C++`, `582.57 ns` Rust) | `149,747 B` (`0` diffs) · `2.073 ms` (`0` `PID`s) | `~120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`** Fase 2 (`+35.86%` Fase 1) |
| **`NVIDIA Jetson AGX Thor`** (`aarch64`, `122.9 GiB`, `Linux 6.8.12-1021-tegra`) | `TI INA238` (`hwmon6` `VIN` `L1`) + `INA3221` (`hwmon5` `ch1-ch3` `L2`/`L1`, `0444` **`measured_j`**) | `15027705736` (`984.86 ns` `C -O3`, `2,489.4 ns` Py) | `149,747 B` (`0` diffs) · `9.544 ms` (`0` `PID`s) | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2` (`-67.02%` `VIN`) |
| **`Framework AMD Ryzen AI Max+ 395`** (`x86-64`, `122.8 GiB`, `Linux 7.0.0-43`) | `RAPL package-0` & `core` (`0440 root:energy` **`reported_j`**) + `amdgpu PPT` (`0444`; `measured_j = None`) | `15027705736` (`376.61 ns` `C -O3`, `1,341.7 ns` Py) | `149,747 B` (`0` diffs) · `0.868 ms` (`0` `PID`s) | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0` (`-63.34%` `core`) |
| **`Intel Core i9-13900H`** (`x86-64`, `14.7 GiB`, `Linux 7.0.0-43`) | `RAPL psys` (`L1`) + `package-0`, `core`, `uncore` (`L2`, `0444` **`reported_j`**; `measured_j = None`) | `15027705736` (`420.93 ns` `C -O3`, `863.6 ns` Py) | `149,747 B` (`0` diffs) · `1.120 ms` (`0` `PID`s) | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0` (`-73.62%` `psys`) |
| **`Intel Core i7-1165G7 + RTX 2060`** (`x86-64`, `63.7 GiB`, `Windows 11 26300`) | `nvml.dll` `RTX 2060` acumulativo `mJ` (`L2` **`reported_j`**) + Win32 `L3`; `CPU RAPL` = `N` (`measured_j = None`) | `15027705736` (`1,474.22 ns` `MSVC /O2`, `2,885.6 ns` Py) | `149,747 B` (`0` `CRLF`) · `2.458 ms` JobObj (`0` `PID`s) | `1,174.2 µs` `NVML` · **`64.64 Hz`** (`NT` tick) | `0 mJ` · **`-89.88%`** tiempo (`-77.05%` `RDTSC`) |

Emergen cinco hallazgos de hardware y sistema operativo multiplataforma a partir de estos recibos en vivo:

1. **Invarianza bit a bit de la reproducción de `Forma D` y `Carril B` entre `macOS`, `Linux` y `Windows 11` (`arm64`/`aarch64` y `x86-64`)**: Los cinco hosts, incluido Win32 `CreateFileMappingA` + `MapViewOfFile` compilado con `MSVC 19.44 /O2` y la E/S de archivos `NTFS` en `Windows 11` (`NT 10.0.26300`), produjeron la suma de verificación exacta `DNULLMM1` de `10,000` sondas, **`15027705736`**, el resumen congelado exacto de `test.setpoint` `0da4df8d9ccbce1e...4485781` y la transcripción `C9` exacta de `149,747` bytes (`SHA-256` `d697ed1476129939...`, con **`0` bytes de desviación `CRLF` en `NTFS`**). Al mismo tiempo, terminaron árboles de procesos descontrolados de `4` `PID` en `0.868 ms` a `9.544 ms` mediante primitivas del núcleo (`SIGKILL` en `macOS`/`Linux` y Win32 `TerminateJobObject` con **`2.458 ms` de media** en `Windows 11`, **`50.0×` más rápido** que invocar `taskkill.exe /F /T /PID`, que promedió `122.817 ms`, y **`> 200×` por debajo** del límite de especificación de `2,000 ms`).

2. **Separación física de derivaciones `INA238` / `INA3221` y `Falsificador 6` bajo co-tenencia de `GPU` en vivo en `NVIDIA Jetson AGX Thor`**: En `Linux 6.8.12-1021-tegra`, tanto `hwmon6` (`ti,ina238` en `i2c@c600000/ina238@44`, entrada `VIN` de la placa completa con entrada `DC` de `~27.97 V`) como los tres canales de `hwmon5` (`ina3221@40`: `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS` y `ch3 VIN_SYS_5V0`) son legibles por todos (`0444`) sin `sudo`. Durante nuestra sonda estrictamente solo-`CPU` (`dedicated_host = false`), un `llama-server` co-inquilino independiente mantenía el bloqueo de `GPU` del host:

| Canal físico de derivación de `Jetson AGX Thor` (`sysfs` sin root `0444`) | Frontera | Línea base previa (`W`) | Cómputo de fase 1 (`measured_j` / `W`) | `DRAM+fsync` de fase 2 (`measured_j` / `W`) | Línea base posterior (`W`) | Deriva (`F6`) y error de fase 2 `C` de `Kepler` |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`** (entrada del módulo + portadora) | **`L1`** | `100.70 W` | `122.12 J` (`101.66 W`) | `99.02 J` (`81.94 W`) | `97.21 W` | `3.47%` (`A2` retenido: co-inquilino) · **`-67.02%`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`** (`LLM` co-inquilino) | **`L2`** | `29.26 W` | `40.29 J` (`33.54 W`) | `26.00 J` (`21.52 W`) | `28.13 W` | Co-inquilino `GPU` externo (oscilación de `-36.1%` en `F5`) |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36.68 W` | `45.73 J` (`38.07 W`) | `44.37 J` (`36.71 W`) | `36.08 W` | `1.64%` (dominio `CPU`/`SoC`/`MSS`) · **`-70.01%`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`** (raíl de `5.08 V`) | **`L1`** | `14.89 W` | `18.66 J` (`15.53 W`) | `16.82 J` (`13.92 W`) | `13.98 W` | **`6.13% > 5.0%` (`F6` activado)** · **`-68.85%`** |

Entre las cuatro ventanas de cadencia de `Falsifier 5`, las solicitudes fluctuantes de `LLM` de los co-inquilinos redujeron `ch1 VDD_GPU` de `35.36 J` a `22.60 J` (`-36.1%`) y llevaron `INA238 VIN` (`L1`) de placa completa de `107.48 J` a `81.73 J` (`-24.0%`), mientras que `ch2 VDD_CPU_SOC_MSS` se mantuvo dentro de `35.76-39.31 J`. Dado que `dedicated_host = false` (y `ch3 VIN_SYS_5V0` superó una deriva del `5.0%` con un `6.13%`), `SATB` retiene las afirmaciones de colocación neta del `SUT` completo de `A2`, pero conserva el `measured_j` exacto separado por rieles (los canales `L1` y `L2` nunca se suman).

3. **Aislamiento `0440 root:energy` de `PLATYPUS` y verificación del dominio `APU` de `Strix Halo` en `AMD` de `Framework`**: En `Framework` Desktop (`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`, `Linux 7.0.0-43-generic`), la regla `udev` `90-energy-read.rules` establece `/sys/class/powercap/intel-rapl:0/energy_uj` (`package-0`) y `intel-rapl:0:0/energy_uj` (`core`) con modo **`0440` (`root:energy`, `world_readable = false`)**: los `UID` del entorno aislado `/work` que no pertenecen al grupo reciben `EACCES` (lo que bloquea los canales laterales de `PLATYPUS`), mientras que el `GID` del supervisor (`energy`) lee los microjulios acumulados sin privilegios de root, con una latencia mediana de `24.34 µs` (residuo de `0 µJ` en `Step 7`). La inspección de `hwmon9` (`amdgpu`) resolvió además un detalle de especificación abierto: la `Radeon 8060S` integrada de `Strix Halo` expone la potencia `PPT` legible por todos (`0444`) mediante `power1_input` / `power1_average` en `µW` (`75.38 W` en la fase 1 / `69.72 W` en la fase 2), en lugar de un contador independiente `energy1_input`, mientras que `cros_ec` (`hwmon8`) expone únicamente ventiladores y termistores de placa.

4. **Frontera rootless de `Windows 11` en bare-metal (bloque `0x20000` de usuario básico `NVML` frente al bloque `RAPL` de anillo 0) y aliasing del tick de reloj `NT` de `15.625 ms`**: Bajo un token de usuario básico explícitamente desescalado (`runas.exe /trustlevel:0x20000`, `IsUserAnAdmin() == false`) en `Windows 11 Pro` (`NT 10.0.26300`, `Intel Core i7-1165G7` + `NVIDIA GeForce RTX 2060`), las llamadas `FFI` en proceso a `nvml.dll` `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) y `nvmlDeviceGetPowerUsage` (`mW`) se completan sin privilegios en una mediana de **`1,174.15 µs`** (**`37.4×` más rápido** que lanzar `nvidia-smi.exe`, que tarda `43.88 ms` por llamada), superando `Step 7` con un **residuo de `0 mJ`** (`8.769 J + 8.816 J = 17.585 J`, deriva pre/post del `3.0%`). En cambio, las lecturas en modo usuario sin privilegios del `MSR 0x611` de `RAPL` de Intel están bloqueadas por el núcleo `Windows NT` sin un controlador firmado de anillo 0 (lo que queda excluido por `OQ-5` y `HVCI`), y las instancias `WMI` `EMI` (`\\.\EnergyMeter` / `Win32_PerfRawData_Counters_PowerMeter`) exponen `0` instancias, por lo que el `L2` del paquete de `CPU` de Windows se ubica estrictamente en la `Label N` (`"not_available"`). Además, dado que `Windows NT` sin ajustes actualiza `GetProcessTimes` mediante interrupciones de reloj de unos `~15.625 ms`, las ráfagas de suspensión de `8 ms` más `FlushFileBuffers` de la fase 2 quedaron aliadas a `62.5 ms` (cuota de `CPU` del `5.06%` frente a `1,171.9 ms` en la fase 1), lo que provocó que la atribución `C` de `Kepler` se desviara un **`-89.88%`** (`-77.05%` incluso al usar ciclos `RDTSC` de `QueryProcessCycleTime` por debajo del tick, con una cuota del `11.48%`).

5. **Física del bus de sensores y cadencia del temporizador del `OS` en las cinco plataformas**: Mientras que las lecturas de `powercap` `sysfs` en Linux `x86-64` se completan en `24.34-45.37 µs` (se logra `94.28-97.12 Hz` a `100 Hz`), el cuanto de sueño predeterminado de `15.625 ms` de `Windows NT` limita los bucles `NVML` sin ajustar de `10 ms` a **`64.64 Hz`** mientras entrega **`9.45 Hz`** de forma limpia al tick de referencia de `100 ms` (`10 Hz`) de `SATB`, lo que coincide con el techo de `66.55 Hz` del shunt `I2C` de `Jetson AGX Thor` (`9.49 Hz` a `100 ms` de referencia) y contrasta con el techo de `7.44 Hz` de `IOReport` de `macmon`. En **`5 / 5`** arquitecturas de silicio y `OS`, la división proporcional a `CPU` (`C`) subatribuyó la fase de `192 MiB` de `DRAM` + sincronización de disco entre **`32.59%` y `89.88%`**, lo que confirma universalmente por qué `SATB` restringe `C` a ejecuciones paralelas superpuestas.

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. Verificación de hardware abierto y limitaciones

| Falsificador de sesión | Consecuencia al activarse | Estado empírico en este estudio |
| :--- | :--- | :--- |
| **`F1` Desajuste de reproducción (`C9`)** | El arnés de referencia es no determinista | **Aprobado en `5/5` hosts (`0` byte/`CRLF` diffs en `149,747 B`, `14` turnos)** |
| **`F2` La verificación de suma falla en `> 5%` de los intentos** | La división de atribución se rompe en el host | **Aprobado en `5/5` hosts (`0 µJ` Linux; `0 mJ` Win11 `NVML`; `<= 1 µJ` `M5 Max`)** |
| **`F3` `B` y `C` difieren en `> 20%` secuencialmente** | `C` (`Kepler`) marcado como poco fiable en el host | **Activado en `5/5` hosts (`32.59%-89.88%` error); `C` restringido** |
| **`F4` Carga de pulso conocida fuera de la precisión del sensor** | Sensor degradado para la sesión | **Abierto (`L0` smart-plug rig de pulso-sincronía aún no conectado)** |
| **`F5` Desplazamientos de tick `10 ms` vs. `1 s` cambian la energía de la ventana** | Efecto de observador de telemetría | **Aprobado (`0.76%` delta `M5 Max` `L2`; `9.45-10.48 Hz` alcanzado a `100 ms` ref)** |
| **`F6` Deriva de líneas base residentes pre/post `> 5.0%`** | Canales netos derivados invalidados | **Activo (`124/188` ventanas `M5 Max` + derivaciones de co-inquilino Linux gating limpio)** |
| **`F7` El adaptador pasa `C1`-`C12`, falla en la canaria** | Conformidad insuficiente; sesión `void` | **Verificado en simulación (`session_void = true` en swap)** |
| **`F8` `Lane B` se sitúa bajo arneses fuertes `Lane O`** | `Lane B` reportado estrictamente como un piso | **Aprobado (`24/24` y `6/6` paridad vs. `Claude Code 2.1.330`)** |

Tres elementos concretos de hardware y adaptadores siguen abiertos (`OQ-5`):
1. **Sesiones `A2` dedicadas en reposo y calibración de enchufe de pared `AC` `L0`**: Aunque los shunts `TI INA238` (`L1`) e `INA3221` (`L2`/`L1`) `measured_j` ahora están verificados en vivo en `NVIDIA Jetson AGX Thor` junto a contadores sin root `reported_j` en `Apple M5 Max`, `Framework AMD Strix Halo`, `Intel Raptor Lake` y `Windows 11` (`RTX 2060` `NVML`), los cinco equipos de banco ejecutaron servicios compartidos o cargas de co-inquilino (`dedicated_host = false`), reteniendo afirmaciones de colocación completa `SUT` `A2`; conectar un medidor `AC` `L0` con pulso sincronizado (`Shelly` / `Yokogawa`) en un host dedicado en reposo es el siguiente paso.
2. **Chequeo integrado del contador `NVML` de `GPU` en `Jetson AGX Thor`**: Mientras que el contador discreto `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) ya está verificado sin root mediante `nvml.dll` en `NVIDIA GeForce RTX 2060` (`Windows 11`), la exploración de la energía acumulada `NVML` en la `GPU` unificada Tegra de `Jetson AGX Thor` junto a su shunt verificado `0444` `INA3221 ch1 VDD_GPU` aún espera una ventana inactiva cuando el bloqueo compartido de `GPU` esté libre.
3. **Rostro en vivo más amplio de `Shape H` y `Shape I`**: Las ejecuciones de arneses externos en este estudio ejercitaron `Shape H` en `Claude Code 2.1.330` junto a `Lane B` y `Shape D`; ejecutar la certificación en vivo `C1-C12` en `Codex CLI`, `OpenHands`, `Terminus-2` y los solucionadores `Shape I` `Inspect` es el próximo objetivo.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referencias

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
