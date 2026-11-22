---
title: "La \"IA\" lee lenguaje humano: codificación legible por humanos a velocidad de máquina y su costo energético"
deck: "Trabajo en curso. Por qué gran parte de lo que intercambian las máquinas está escrito para personas, cuál es ese costo en bytes, tokens y tiempo, y en energía de rusage del kernel por proceso en Apple Silicon (reported_j) a lo largo de 34 cargas de trabajo de análisis sintáctico y tokenización, y por qué la energía medida con un medidor externo de pared (measured_j) sigue abierta."
lang: "es"
source: "ai-reads-human"
complete: true
---

<div id="ai-reads-human-human-language-encoding-at-machine-speed-and-the-energy-cost" class="anchor-alias" aria-hidden="true"></div>

*Trabajo en progreso, revisión af57f48, 22 de noviembre de 2026. Observatorio interactivo, datos, código y registro de lecturas: [research.openie.dev/living/ai-reads-human/](/living/ai-reads-human/). Términos compartidos: [glosario](/glossary/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

Los agentes de software intercambian datos en formatos pensados para que las personas los lean, como JSON, YAML, Markdown, XML y CSV. Este estudio denomina *impuesto de impedancia* (impedance tax) al trabajo adicional que esto provoca, lo define con unidades y mide tres de sus componentes en un corpus sembrado de 20,000 registros: el tiempo de análisis sintáctico, el número de tokens en cinco tokenizadores abiertos y los contadores `reported_j` de doble canal (sistema operativo y chip) de Apple M5 Max en las 34 cargas de trabajo de análisis y de `tiktoken` (sección 5c). Un primer intento no aislado, a nivel de chip completo, en dos portátiles ocupados no pudo separar el análisis sintáctico de la deriva causada por procesos concurrentes en segundo plano (sección 5b). Al aislar cada carga de trabajo en un subproceso trabajador dedicado, usando `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` del kernel de macOS por proceso (`L3`, etiqueta `D`), se resuelve una diferencia de `2,053.8×` en la energía de análisis: desde `280.4 nJ/record` para el binario de longitud fija (`struct.iter_unpack`) hasta `2,212.1 nJ/record` para el JSON de la biblioteca estándar (`7.89×`), `69,922.1 nJ/record` para `libyaml` en C (`249.4×`) y `575,799.3 nJ/record` para YAML en Python puro (`2,053.8×`). Además, se muestra que la tokenización con `cl100k_base` de JSON compacto (`27,679.2 nJ/record`, `98.7×` respecto al binario de longitud fija) consume `12.5×` el `reported_j` del propio `json.loads()`. Al mismo tiempo, el `IOReport` de chip completo (`L2`, etiqueta `A2`) activó el Falsificador 6 (deriva de la línea base en reposo previa/posterior `> 5.0%`) en `109` de `170` ventanas de medición en hosts compartidos, lo que confirma por qué la sustracción de energía a nivel de paquete no aislada falla en hosts activos. No se conectó ninguna sonda de potencia externa en línea ni medidor de pared (`measured_j = None`, `board_metered = false`), y la energía en julios del prefill/decode de modelos en GPU sigue planificada (M4).

**En palabras sencillas**

1. Las computadoras y las personas suelen usar el mismo formato escrito. Ese formato es fácil de leer para las personas, pero la computadora tiene que hacer trabajo extra para volver a leerlo.
2. En nuestro corpus de prueba de 20,000 registros, leer un binario de longitud fija (`struct.iter_unpack`) costó `280.4 nJ/record` según el `ri_energy_nj` del kernel por proceso en Apple M5 Max (`reported_j`). En comparación, el lector de JSON integrado de Python costó `2,212 nJ/record` (`7.89×`), YAML acelerado en C costó `69,922 nJ/record` (`249.4×`) y YAML en Python puro costó `575,799 nJ/record` (`2,053.8×`).
3. Tokenizar JSON compacto para un modelo de IA con `tiktoken` (`cl100k_base`) costó `27,679 nJ/record` (`1.69×` la tokenización de CSV y `12.5×` el análisis con `json.loads()` en sí), antes de que el modelo de lenguaje ejecute una sola multiplicación matricial. Todas las cifras de energía de esta página son contadores `reported_j` del kernel y del chip (`measured_j = None`, `board_metered = false`); la energía de prefill/decode de los modelos en GPU y las sondas externas de potencia aún están planificadas.

> **Estado: trabajo en curso, que seguirá creciendo.** Las secciones marcadas como *Planificado* (como los contadores de prefill/decode en GPU M4, los corpus en lenguaje natural M6 y los analizadores multilenguaje en C/Rust M8) aún no están terminadas. Todas las cifras de esta página se recalculan a partir de archivos descargables en `/living/ai-reads-human/`. Los contadores de energía del chip son estrictamente `reported_j` (`measured_j = None`, `board_metered = false`).

<div id="1-background-formats-written-for-people" class="anchor-alias" aria-hidden="true"></div>

## 1. Antecedentes: formatos escritos para personas

La mayoría de los datos que los agentes intercambian hoy viajan en formatos cuyas especificaciones anteponen las personas a las máquinas. Los pasajes citados a continuación se leyeron para esta página; el estado de lectura de cada fuente (COMPLETA, PARCIAL o NO DISPONIBLE) figura en el [registro de lectura](/living/ai-reads-human/READ_LEDGER.md).

- **TeX** surgió en 1982: el archivo fuente `tex.web` (encabezado, primeros 19 000 bytes leídos; PARCIAL) registra que la versión 0 se publicó en septiembre de 1982 y fecha las versiones posteriores a partir de la 3.0 (marzo de 1990).
- **Markdown** fue desarrollado por John Gruber con la colaboración de Aaron Swartz y publicado en 2004 como una descripción de sintaxis y un script en Perl que convierte el texto a HTML; la especificación CommonMark (versión 0.31.2, 28 de enero de 2024) indica que esa descripción "no especifica la sintaxis de manera inequívoca" y enumera las cuestiones que deja abiertas (CommonMark 0.31.2, secciones 1.1 y 1.2).
- **CSV** fue documentado en octubre de 2005 por la RFC 4180, una RFC *informativa* que afirma que "no existe una especificación formal" y registra lo que parecen hacer la mayoría de las implementaciones.
- **JSON** está definido por la RFC 8259 (diciembre de 2017, que reemplaza a la RFC 7159) como "un formato de intercambio de datos ligero, basado en texto e independiente del lenguaje". La RFC 7493 (marzo de 2015, I-JSON) lo restringe para los protocolos.
- **Formas canónicas y binarias** también aparecen en el registro de estándares: la RFC 8785 (junio de 2020) define un esquema de canonicalización de JSON, y la RFC 8949 (diciembre de 2020, que reemplaza a la RFC 7049) define CBOR, un formato de datos binario con una sección sobre codificación determinista (sección 4.2) que los protocolos pueden adoptar.
- **YAML** revisión 1.2.2 (1 de octubre de 2021) enumera sus objetivos de diseño "en orden de prioridad decreciente", y el objetivo de mayor prioridad es que "YAML debe ser fácilmente legible por humanos" (sección 1.1).

![Cronología de las especificaciones con fecha leídas para este tema](/living/ai-reads-human/charts/format-timeline.svg)

*Figura 1. Fechas impresas en los documentos enumerados en el registro de lectura. Generada por `scripts/make_charts.py`.*

Estos hechos no afirman que los formatos legibles por humanos sean errores. Indican que la legibilidad por personas fue un objetivo de diseño declarado, y que el costo de volver a leerlos por máquina no era lo que se buscaba minimizar. Cuando otros trabajos llegan a formas orientadas a máquinas (CBOR, JSON canónico, Protocol Buffers, Avro, safetensors, GGUF), este estudio lo registra como una observación de convergencia: varias comunidades llegaron a codificaciones fijas o deterministas para el intercambio entre máquinas, manteniendo el texto para las personas.

<div id="2-the-impedance-tax-defined" class="anchor-alias" aria-hidden="true"></div>

## 2. El impuesto de impedancia, definido

Sea un conjunto de registros R que portan información que un consumidor máquina necesita. Sea F un formato con codificador `enc_F` y decodificador `dec_F`, y sea M una forma canónica de máquina: una cadena de bytes válida por valor.

| Símbolo | Significado | Unidad |
|---|---|---|
| `B_F` | tamaño codificado de R en el formato F | byte |
| N | número de registros | 1 |
| k | un tokenizador | n/a |
| `T_{F,k}` | tokens producidos por k sobre la codificación de R | token |
| `d_{F,k} = B_F / T_{F,k}` | bytes por token | byte/token |
| `t_parse(F)` | tiempo de pared para decodificar R a valores en memoria | s |
| P | potencia media durante una operación | W = J/s |
| E | energía de una operación, `E = ∫ P dt`, aproximadamente `P_avg · t` | J |
| `e_prefill` | energía del modelo por token de entrada | J/token |

El **impuesto de impedancia** de F con respecto a M es la energía adicional que un consumidor gasta porque la información llega en F:

`Z(F) = E_enc(F) + E_parse(F) + E_tok(F,k) + e_prefill · T_{F,k} + E_ctx(F)`

`τ(F) = Z(F) − Z(M)` (julios), `θ(F) = Z(F) / Z(M)` (adimensional)

`E_ctx(F)` es el costo de decodificación adicional que provoca un contexto más largo; su coeficiente depende del modelo y es un objetivo de medición (M4 más abajo). La sección 5c mide `E_parse(F)` y `E_tok(F,k)` en el núcleo por proceso `reported_j` (`ri_energy_nj`) en Apple M5 Max.

Se pueden medir tres razones adimensionales sin ningún contador de energía:

- razón de bytes `β_F = B_F / B_ref`
- razón de tokens `κ_{F,k} = T_{F,k} / T_{ref,k}`
- razón de tiempo de análisis `π_F = t_parse(F) / t_parse(ref)`

y están ligadas por una identidad que los números de tokens de abajo obedecen:

`κ_F = β_F · (d_ref / d_F)`

por lo que un formato puede costar más tokens porque tiene más bytes, porque sus bytes se dividen en más piezas, o ambas cosas.

![Dónde se paga el impuesto de impedancia: codificación, transporte, análisis, tokenización, lectura del modelo](/living/ai-reads-human/charts/impedance-pipeline.svg)

*Figura 2. Los términos de Z(F). Sin modelo en la ruta (máquina a máquina) solo se aplican codificación, transporte y análisis. Con un modelo que lee texto, se aplican tokenización y lectura.*

<div id="21-physical-scale-and-what-this-page-does-not-claim" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Escala física y lo que esta página no afirma

El límite termodinámico mínimo para borrar un bit a temperatura T es el límite de Landauer, E = k_B T ln 2. Con k_B = 1.380649e-23 J/K (exacto según la definición del SI de 2019; el valor se verificó el 18 de octubre de 2026 frente a la página NIST CODATA 2022 para la constante de Boltzmann) y T = 300 K, esto equivale a **2.871e-21 J** por bit, recalculado en `scripts/verify_numbers.py`. Ocho bits son 2.297e-20 J. Se trata de una cota inferior para la lógica irreversible, no de una estimación de lo que cuesta analizar lenguaje: el software real consume órdenes de magnitud más, en tráfico de memoria, ejecución de instrucciones y refrigeración. Esta página no utiliza el límite para predecir ninguna cifra.

Las cifras de energía para la inferencia de modelos proceden de mediciones de otros autores en su propio hardware, y se presentan únicamente como contexto, no como medición nuestra:

- Samsi et al., "From Words to Watts: Benchmarking the Energy Costs of Large Language Model Inference" (arXiv:2310.03003), definen la energía por token de salida como la energía total de la GPU dividida entre los tokens de salida decodificados, y reportan unos 3 a 4 J por token de salida para un modelo LLaMA de 65 000 millones de parámetros, con una longitud máxima de generación de 512, medido con NVIDIA DCGM en su infraestructura MIT SuperCloud (GPU V100 para las ejecuciones con 8, 16 y 32 fragmentos). Ese artículo no separa la energía de prefill de la energía de decodificación.
- Luccioni, Jernite y Strubell, "Power Hungry Processing: Watts Driving the Cost of AI Deployment?" (ACM FAccT 2024, DOI 10.1145/3630106.3658542), midieron la energía por cada 1,000 inferencias según la tarea con CodeCarbon en un nodo con 8 GPU A100; su Tabla 2 reporta una media de 0.002 kWh para clasificación de texto y 0.047 kWh para generación de texto. Estas cifras se contrastaron con la versión corregida del registro de versión final de ACM V1.1 (6 de noviembre de 2024), que mantiene los mismos valores de la Tabla 2 y la misma configuración (8 GPU A100 80GB en AWS, CodeCarbon). Citamos la V1.1: el artículo señala que una versión anterior utilizaba 0.012 kWh en una comparación. El resto del artículo solo se leyó en parte.

La cifra de energía por lectura de palabra en DRAM (un valor muy citado de 640 pJ por lectura de 32 bits) **no se utiliza en esta página**. Su fuente atribuida, Horowitz (2014), fue consultada: el artículo indica unos 1 a 2 nJ por acceso a DRAM, y las diapositivas de la conferencia plenaria, de 1.3 a 2.6 nJ por acceso de 64 bits; la cifra de 640 pJ aparece solo en diapositivas posteriores que la citan. La sección 9 registra este estado.

<div id="3-what-was-measured" class="anchor-alias" aria-hidden="true"></div>

## 3. Qué se midió

Los puntos de referencia de tiempo de análisis inicial y recuento de tokens se ejecutaron en una máquina virtualizada Intel Xeon (8 vCPU, Linux 6.12, Python 3.13.5), que no expone contadores de energía RAPL (`/sys/class/powercap` está ausente), seguidos por campañas de energía Apple M5 Max reportadas en las secciones 5b y 5c. El corpus es sintético y está semilla (`scripts/gen_corpus.py`, semilla 20261016): 20.000 registros, cada uno con un id, un nombre de tres palabras, una puntuación flotante, un booleano, tres etiquetas y un entero de 31 bits.

![Un registro en cinco codificaciones](/living/ai-reads-human/charts/one-record-five-ways.svg)

*Figura 3. Registro 0 en CSV, JSON compacto, YAML, XML y un diseño binario fijo de 23 bytes. El diseño binario almacena cada palabra como un índice de un byte en una lista compartida de 24 palabras, por lo que leerlo de nuevo necesita esa lista. Los recuentos de bytes de las formas de texto incluyen el salto de línea.*

<div id="31-parse-time" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Tiempo de análisis

![Tiempo de análisis por registro: binario fijo 116 ns, JSON stdlib 904 ns, YAML libyaml 85300 ns](/living/ai-reads-human/charts/parse-time-headline.svg)

*Figura 4. Mínimo de 9 repeticiones sobre 20.000 registros en la línea base Xeon de Linux. Fuente: `/living/ai-reads-human/data/parse_time.tsv`, columna `ns_per_record`. Escala logarítmica.*

| Formato y analizador | ns por registro (Xeon) | razón respecto al binario fijo |
|---|---|---|
| Binario fijo, `struct.iter_unpack` | 116 | 1.0 |
| JSON, biblioteca estándar de Python | 904 | 7.8 |
| YAML, PyYAML con libyaml | 85.300 | 735.3 |

YAML tardó 94,4 veces más que el JSON de la biblioteca estándar en los mismos registros en el equipo Xeon (y `22.404 ns` frente a `570 ns` = `39,3×` para C `libyaml`, o `161.227 ns` = `282,9×` para YAML puro en Python, en Apple M5 Max en la sección 5c). La tabla completa de Xeon con todos los formatos y analizadores probados se muestra en la Figura 5.

![Tiempo de análisis por registro, todos los formatos probados](/living/ai-reads-human/charts/parse-time-all.svg)

*Figura 5. Todas las filas de `data/parse_time.tsv` excepto la fila de numpy sin copia, que no construye objetos y no es comparable.*

**Límites de esta medición.** (a) Los analizadores realizan trabajos diferentes: el lector de binario fijo devuelve tuplas, JSON y YAML construyen objetos tipados de Python, CSV devuelve cadenas y las filas de XML y Markdown construyen árboles o flujos de tokens sin convertir valores, por lo que las razones comparan el comportamiento completo de las bibliotecas, no el costo intrínseco de cada formato. (b) Un único entorno de ejecución de lenguaje (CPython 3.13). (c) El corpus es sintético y con pocos identificadores. (d) El tiempo por sí solo no es energía: la sección 5c mide por tanto directamente el `ri_energy_nj` (`reported_j`) del núcleo por proceso en las 34 cargas de trabajo de análisis y tokenización.

<div id="32-tokens" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Tokens

Un modelo de lenguaje lee tokens, no bytes. Los mismos registros, contados con el tokenizador `cl100k_base` sobre los primeros 2.000 registros de cada vista (y verificados en los 20.000 registros de la sección 5c):

![Tokens por registro relativos a CSV](/living/ai-reads-human/charts/tokens-vs-csv.svg)

*Figura 6. κ = tokens por registro de la vista dividido entre tokens por registro de CSV. Fuente: `/living/ai-reads-human/data/tokens.tsv`.*

| Vista | tokens por registro | κ (relativo a CSV) |
|---|---|---|
| CSV | 22.9 | 1.00 |
| JSON, compacto | 36.2 | 1.58 |
| YAML | 51.4 | 2.24 |
| JSON, con formato (sangría 2) | 65.6 | 2.86 |

La identidad de la sección 2 se cumple con estos datos: para JSON compacto, β = 1.912 y d_CSV/d_JSON = 0.826, lo que da κ = 1.58; para YAML, 2.028 × 1.107 = 2.24; para JSON con formato, 3.056 × 0.936 = 2.86. El JSON compacto cuesta más tokens principalmente porque tiene unas 1.9 veces los bytes de CSV, y el JSON con formato sobre todo por la misma razón más la sangría. YAML tiene más bytes y, además, tokens más cortos.

![Razón de tokens frente a CSV con cinco tokenizadores](/living/ai-reads-human/charts/tokens-five-tokenizers.svg)

*Figura 7. La misma razón con los tokenizadores `cl100k_base`, `o200k_base`, GPT-2, Mistral-7B-v0.1 y Qwen2.5-0.5B. El orden se mantiene en los cinco; la magnitud de la brecha no (el JSON con formato equivale a 3.66 veces CSV con GPT-2 y a 2.22 veces con Qwen2.5). No se probó ningún tokenizador comercial cerrado.*

![Bytes codificados por registro](/living/ai-reads-human/charts/bytes-per-record.svg)

*Figura 8. Bytes por registro. La cifra binaria de 23 bytes no cuenta la lista compartida de palabras; cualquier afirmación honesta sobre el tamaño de una forma binaria debe nombrar la lista (o diccionario) de la que depende, indicando versión y hash.*

**Un resultado negativo que conviene exponer.** Escribir el diseño binario como texto para un modelo no elimina el costo en tokens: en base64 fue de 20.3 tokens por registro (κ = 0.89) y en hexadecimal de 22.7 (κ = 0.99), prácticamente lo mismo que CSV, porque un modelo de texto necesita una vista textual. El ahorro para un modelo proviene de enviar menos campos, mejor seleccionados, y no de cambiar la codificación de lo que se envía. Esta afirmación es Planificada (M7), no medida.

<div id="4-why-the-hazards-come-with-the-readability" class="anchor-alias" aria-hidden="true"></div>

## 4. Por qué los peligros aparecen con la legibilidad

Formatos diseñados para personas y para programas débilmente acoplados permiten que una misma entrada tenga distintos significados para diferentes lectores. La tabla enumera los peligros encontrados en las especificaciones de lectura, y en pruebas realizadas con las versiones de biblioteca nombradas (Python 3.13.5, Node v20.19.2, jq 1.7, PyYAML 6.0.2, lxml 6.1.3). Las líneas de prueba (códigos T, U, X, Y, C) se encuentran en `tests-formats/RESULTS.txt` y describen únicamente esas versiones. "Spec" significa el texto del documento citado.

| Clase | Formato | Peligro | Evidencia |
|---|---|---|---|
| Ambigüedad | JSON | Los nombres de miembros duplicados dan lugar a un comportamiento «impredecible»; las implementaciones notifican el último valor, todos los valores o fallan. Tres herramientas probadas conservaron el último valor. | RFC 8259 sección 4; T1 |
| Ambigüedad | Markdown | La descripción original no especifica la sintaxis de forma inequívoca; los dialectos divergieron. | CommonMark 0.31.2 sección 1.2 |
| Diferencial de analizadores | Números JSON | 9007199254740993 es exacto en Python y se redondea a …992 en Node. | RFC 8259 sección 6; T2 y N2 |
| Diferencial de analizadores | JSON | El `json` de Python acepta `NaN` e `Infinity` sin comillas, valores que la especificación no permite. | RFC 8259 sección 6; T6 |
| Formas no canónicas | JSON | `1`, `1.0`, `1e0`, `10E-1`, `0.1e1` representan un mismo número escrito de cinco formas y dos tipos de Python. | U3 |
| Formas no canónicas | JSON | El orden de los miembros no altera el significado, pero modifica los bytes y cualquier función hash aplicada sobre ellos. | T8 |
| Ordenación | Canonización de JSON | La ordenación por unidades de código UTF-16 difiere del orden por puntos de código para U+1F600 frente a U+FFEE. | RFC 8785 sección 3.2.3; U2 |
| Formas no canónicas | CBOR | La codificación determinista es un perfil opcional que los protocolos pueden adoptar; no es el comportamiento predeterminado. | RFC 8949 sección 4.2 |
| Formas no canónicas | Protocol Buffers | «No se debe asumir que la salida de bytes de un mensaje serializado es estable». | Guía de codificación de Protobuf, «Implicaciones» |
| Peligros numéricos | JSON | Las implementaciones pueden limitar el rango y la precisión; el intervalo de enteros exactamente representables es ±(2^53)−1. | RFC 8259 secciones 6 y 9; RFC 7493 sección 2.2 |
| Peligros numéricos | JSON | `1e400` se convierte en `inf` tanto en Python como en Node; el tratamiento de `-0` difiere. | T3, N3, T4, N4 |
| Peligros numéricos | Resolvedor de YAML 1.1 | En PyYAML, `010` se interpreta como 8, `12:30:45` como 45045 y `country: NO` como `{country: False}`. | Filas Y |
| Peligros numéricos | TOML | La especificación indica que un entero que no pueda almacenarse sin pérdida es un error; `tomllib` de Python aceptó 2^63. | TOML 1.0.0; filas T |
| Unicode | JSON | `"\uDEAD"` (un sustituto suelto) está permitido por la gramática; se analiza correctamente y luego falla al codificar en UTF-8. | RFC 8259 sección 8.2; T5 |
| Unicode | JSON | Las formas NFC y NFD de un mismo texto son claves distintas. | U1 |
| Inyección | CSV | Una celda que comienza por `=` es un dato plano para el analizador y una fórmula para algunos programas de hoja de cálculo. | OWASP CSV Injection; fila C |
| Inyección | XML | Con la resolución de entidades activada, lxml leyó un archivo local mediante una entidad externa. | Filas X |
| Explosión de recursos | YAML | 166 bytes de alias se expandieron a 59.049 hojas lógicas. | Prueba de alias Y |
| Explosión de recursos | XML | 202 bytes de entidades internas se expandieron a 10.000 caracteres (49,5 veces). | Filas X |
| Explosión de recursos | JSON | Los límites de profundidad están definidos por la implementación; Python generó `RecursionError` a 100.000 niveles de anidamiento. | RFC 8259 sección 9; T9 |
| Totalidad | Cualquier analizador | Las excepciones de biblioteca constituyen flujo de control ajeno al tipo de retorno de la función. | T5, T9 |

Ninguna de estas razones justifica evitar los formatos para las personas. Cada una es una razón para no usar el mismo texto como única autoridad entre máquinas.

<div id="5-planned-measuring-energy" class="anchor-alias" aria-hidden="true"></div>

## 5. Planificado: medición de la energía

La hoja de ruta de mediciones separa los contadores `reported_j` de análisis y tokenización completados de la inferencia abierta en GPU y las sondas de potencia de hardware externo:

| ID | Medición | Estado |
|---|---|---|
| M1, M2, M3 | Tiempo de análisis, tokens, rendimiento del tokenizador | **Realizado** (`data/parse_time.tsv`, `data/tokens.tsv`, `data/tokenize_time.tsv`) |
| M5 | Energía de análisis y `tiktoken` en las 34 cargas de trabajo mediante `reported_j` de doble canal en Apple M5 Max (`L3` por proceso `ri_energy_nj` + `L2` de todo el chip `IOReport` con compuerta de deriva en reposo Falsifier 6) | **Realizado para `reported_j`** (sección 5c; `data/energy_reported_j.tsv`; `measured_j = None`, `board_metered = false`) |
| M4 | Energía de prellenado y energía de decodificación por token frente a la longitud de contexto, mismo modelo, GPU con un contador de energía de hardware o sonda de riel/pared externa | Planificado (necesita contador dedicado de GPU o sonda de potencia en línea) |
| M6 | Un segundo corpus: documentación en lenguaje natural y registros frente a telemetría rica en identificadores | Planificado |
| M7 | A nivel de tarea: tokens que un agente necesita para responder un conjunto fijo de preguntas a partir de una proyección de los campos que requiere frente al documento completo | Planificado |
| M8 | Otros analizadores por formato (simdjson, rapidyaml, libxml2 C, pulldown-cmark) para acotar los efectos de lenguaje-tiempo de ejecución | Planificado |

Las lecturas de potencia de enchufe de pared externo o sonda de potencia USB-C en línea (`measured_j`) permanecen sin recopilar; la sección 5c informa estrictamente de los contadores `reported_j` del sistema operativo/en el chip.

<div id="5b-measured-energy-no-net-effect-resolved" class="anchor-alias" aria-hidden="true"></div>

## 5b. Energía medida: ningún efecto neto resuelto

*Primer intento de sustracción de todo el chip, ejecutado el 2026-10-18 en dos portátiles Apple M5 Max (48 GB con batería, 128 GB con alimentación AC), macOS 27.0.1, Python 3.13.16, contador de potencia macmon 0.10.0 (48 GB) y 0.9.0 (128 GB), leyendo `IOReport` de todo el SoC y sensores SMC (`all_power` y `sys_power`). Nueve cargas de trabajo de análisis sobre los mismos 20.000 registros, cada una en bucle durante 10 s en un solo hilo, 10 rondas intercaladas, con una ventana de inactividad de 10 s antes y después de cada ronda. Archivos: `/living/ai-reads-human/data/energy_joules.tsv` y muestras en bruto en `/living/ai-reads-human/data/energy_raw_m5max48/` y `energy_raw_m5max128/`.*

**Resultado del intento no aislado de todo el chip: la sustracción del paquete por encima de la inactividad no pudo resolver el análisis de un solo hilo en un equipo ocupado.** En ambos portátiles (promedio de carga de un minuto entre 41 y 68), la línea base de inactividad previa y posterior se desplazó entre 2 y 7 W entre ventanas, mientras que un hilo de análisis añadía solo entre 1 y 5 W a un chip que consumía entre 18 y 36 W, lo que dejó todas las medias netas dentro de 1,5 errores estándar de cero (varias negativas). Ese fallo motivó el protocolo de doble canal de la sección 5c: emparejar `IOReport` de todo el chip (`L2`, controlado por el Falsificador 6 de modo que las sustracciones netas con deriva se rechazan automáticamente) con `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` por PID del núcleo de macOS (`L3`), que atribuye la energía de la CPU estrictamente al subproceso trabajador dedicado que ejecuta cada carga de trabajo.

<div id="5c-dual-channel-apple-m5-max-reported_j-across-all-34-parse-and-tokenize-workloads" class="anchor-alias" aria-hidden="true"></div>

## 5c. `reported_j` de doble canal en Apple M5 Max para las 34 cargas de trabajo de análisis y tokenización

*Ejecutado el 2026-11-22 (de `16:44:52` a `16:53:22 UTC`) en Apple M5 Max (`128 GB` de RAM, `macOS 27.2.1` `arm64`, `Python 3.13.14`, `macmon 0.12.0`), con corpus semilla `20261016` (`20,000` registros distribuidos en 12 archivos fijados mediante SHA-256), `5` rondas intercaladas y aleatorizadas × `34` cargas de trabajo = `170` ventanas de subprocesos trabajadores dedicados. Archivos: [`/living/ai-reads-human/data/energy_reported_j.tsv`](/living/ai-reads-human/data/energy_reported_j.tsv) y [`/living/ai-reads-human/data/energy_reported_j_summary.json`](/living/ai-reads-human/data/energy_reported_j_summary.json). Explorador interactivo: [`/living/ai-reads-human/`](/living/ai-reads-human/).*

<div id="telemetry-channels-and-falsifier-6-demonstration" class="anchor-alias" aria-hidden="true"></div>

### Canales de telemetría y demostración del Falsificador 6

Cada ventana de medición registró dos canales de telemetría sin privilegios simultáneamente mientras se mantenían `measured_j = None` y `board_metered = false`:

1. **Por proceso `L3` `reported_j` (etiqueta de host compartido `D`, aislado entre co-inquilinos)**: `proc_pid_rusage(worker_pid, RUSAGE_INFO_V6).ri_energy_nj`, integrado por el kernel XNU estrictamente sobre los hilos programados dentro del subproceso de trabajo dedicado para esa única pasada de formato/tokenizador.  
2. **Todo el SoC `L2` `reported_j` (etiqueta de host compartido `A2`, controlado por Falsificador 6)**: `macmon pipe` muestreo Apple Silicon `IOReport` `chip_power` junto con líneas base de inactividad pre y post ventana de `0.8 s`. Bajo **Falsificador 6**, cualquier ventana cuya línea base de inactividad pre/post se desvíe en `> 5.0%` tiene su `derived_marginal_j` invalidado automáticamente en lugar de reportarse. En este host compartido (promedio de carga de 1 minuto `12.92`, consumo en reposo del chip `30.5-35.4 W`), el Falsificador 6 invalidó **`109` de `170` windows (`64.1%`)** across the 34 workloads (`61 / 170` valid, `0 / 34` workloads passing all `5 / 5` replicates), reproduciendo cuantitativamente el diagnóstico de la sección 5b mientras que `L3` `ri_energy_nj` resolvió limpiamente cada carga de trabajo.

<div id="parse-stage-l3-reported_j-16-workloads-20000-records" class="anchor-alias" aria-hidden="true"></div>

### Etapa de análisis `L3` `reported_j` (`16` cargas de trabajo, `20,000` registros)

| Formato y analizador | Bytes del corpus | ms de pared / `20k` (media ± DE) | `L3` `nJ / registro` (media ± DE) | `L3` `nJ / byte` | Instrucciones / reg | Razón energética `L3` frente a binario |
|---|---:|---:|---:|---:|---:|---:|
| Binario fijo (`numpy.frombuffer`, vista de copia cero) | `460,000` | `0.0002 ± 0.0000` | `0.04 ± 0.01` | `0.002` | `0.3` | `0.00×` (solo vista) |
| **Binario fijo (`struct.iter_unpack`, referencia)** | `460,000` | `1.359 ± 0.351` | **`280.36 ± 111.38`** | `12.19` | `1,397.4` | **`1.00×`** |
| JSON (`orjson`, SIMD en C/Rust) | `2,325,428` | `7.053 ± 1.359` | **`1,405.93 ± 372.34`** | `12.09` | `6,187.0` | **`5.01×`** |
| CSV (`csv`, biblioteca estándar de Python) | `1,205,469` | `8.804 ± 1.309` | **`1,798.22 ± 435.28`** | `29.83` | `8,812.4` | **`6.41×`** |
| MessagePack (`msgpack`) | `1,660,773` | `10.817 ± 3.321` | **`1,802.46 ± 593.84`** | `21.71` | `9,593.3` | **`6.43×`** |
| **JSON (`json.loads`, biblioteca estándar de Python)** | `2,325,428` | `11.396 ± 1.219` | **`2,212.12 ± 409.29`** | `19.03` | `12,700.6` | **`7.89×`** |
| JSON con sangría (`json.loads`, indentación 2) | `3,685,429` | `11.716 ± 2.225` | **`2,648.45 ± 669.32`** | `14.37` | `13,433.3` | **`9.45×`** |
| CBOR (`cbor2`) | `1,660,877` | `15.286 ± 1.250` | **`2,719.58 ± 365.78`** | `32.75` | `14,514.3` | **`9.70×`** |
| XML (`lxml`, biblioteca en C) | `2,885,487` | `22.204 ± 2.392` | **`3,800.46 ± 331.49`** | `26.34` | `19,521.4` | **`13.56×`** |
| XML (`xml.etree.ElementTree`) | `2,885,487` | `26.354 ± 0.750` | **`6,029.30 ± 370.65`** | `41.79` | `27,495.7` | **`21.51×`** |
| JSON Lines (`json.loads` por línea) | `2,325,427` | `22.729 ± 1.481` | **`6,130.27 ± 946.08`** | `52.72` | `27,414.8` | **`21.87×`** |
| Tabla Markdown (`markdown-it-py`, tokens) | `1,525,499` | `115.160 ± 7.576` | **`22,824.50 ± 2,464.64`** | `299.24` | `115,255.0` | **`81.41×`** |
| TOML (`tomllib`, biblioteca estándar de Python) | `2,505,426` | `298.582 ± 60.674` | **`57,803.43 ± 16,269.64`** | `461.43` | `260,140.9` | **`206.17×`** |
| **YAML (`PyYAML` con `libyaml` en C)** | `2,445,427` | `448.071 ± 95.009` | **`69,922.12 ± 13,405.09`** | `571.86` | `371,347.0` | **`249.40×`** |
| Lista Markdown (`markdown-it-py`, tokens) | `1,925,427` | `417.700 ± 54.289` | **`99,595.04 ± 17,044.11`** | `1,034.52` | `377,878.0` | **`355.23×`** |
| **YAML (`PyYAML`, Python puro)** | `2,445,427` | `3,224.548 ± 375.725` | **`575,799.27 ± 56,674.36`** | `4,709.19` | `2,706,372.9` | **`2,053.75×`** |

<div id="tokenization-stage-l3-reported_j-18-tiktoken-workloads-20000-records" class="anchor-alias" aria-hidden="true"></div>

### Etapa de tokenización `L3` `reported_j` (`18` cargas de trabajo `tiktoken`, `20,000` registros)

Cuando un modelo de lenguaje ingiere texto en lugar de memoria estructurada, la tokenización por pares de bytes (`E_tok(F,k)` en la sección 2) domina el costo de decodificación en CPU para los formatos compactos:

| Tokenizador y vista | Tokens / `20k` | ms de reloj / `20k` (media ± DE) | `L3` `nJ / registro` (media ± DE) | `L3` `nJ / token` | Razón frente a CSV (`same tok`) | Razón frente al parseo binario fijo |
|---|---:|---:|---:|---:|---:|---:|
| `cl100k_base` · CSV (`recs.csv`) | `459,916` | `73.442 ± 20.454` | **`16,384.84 ± 4,362.40`** | `712.51` | `1.000×` | `58.44×` |
| `cl100k_base` · Tabla Markdown | `569,973` | `105.364 ± 18.819` | **`23,385.73 ± 5,597.57`** | `820.59` | `1.427×` | `83.41×` |
| `cl100k_base` · Lista Markdown | `649,947` | `105.199 ± 11.723` | **`26,749.70 ± 4,445.05`** | `823.13` | `1.633×` | `95.41×` |
| `cl100k_base` · JSONL (`recs.jsonl`) | `753,109` | `154.114 ± 43.130` | **`26,983.02 ± 9,347.95`** | `716.58` | `1.647×` | `96.24×` |
| **`cl100k_base` · JSON compacto (`recs.json`)** | `733,111` | `124.295 ± 7.051` | **`27,679.19 ± 2,697.37`** | `755.12` | **`1.689×`** | **`98.73×`** (`12.51×` `json.loads`) |
| `cl100k_base` · XML (`recs.xml`) | `1,046,596` | `171.844 ± 21.381` | **`36,730.51 ± 6,968.26`** | `701.90` | `2.242×` | `131.01×` |
| `cl100k_base` · TOML (`recs.toml`) | `933,109` | `178.111 ± 23.760` | **`38,499.73 ± 6,633.02`** | `825.19` | `2.350×` | `137.32×` |
| `cl100k_base` · YAML (`recs.yaml`) | `1,029,947` | `208.434 ± 33.837` | **`51,880.14 ± 12,381.40`** | `1,007.43` | `3.166×` | `185.05×` |
| **`cl100k_base` · JSON con formato (`recs_pretty.json`)** | `1,313,111` | `266.827 ± 21.754` | **`70,590.45 ± 10,239.93`** | `1,075.16` | **`4.308×`** | **`251.78×`** (`26.65×` `json.loads` con formato) |
| `o200k_base` · CSV (`recs.csv`) | `464,995` | `51.864 ± 5.906` | **`9,570.91 ± 1,012.53`** | `411.66` | `1.000×` | `34.14×` |
| `o200k_base` · JSON compacto (`recs.json`) | `754,794` | `93.277 ± 8.521` | **`15,125.65 ± 1,287.77`** | `400.79` | `1.580×` | `53.95×` (`6.84×` `json.loads`) |
| `o200k_base` · Tabla / lista Markdown | `574,818` / `654,792` | `68.091` / `68.666` | **`15,693.90`** / **`17,362.58`** | `546.05` / `530.32` | `1.640×` / `1.814×` | `55.98×` / `61.93×` |
| `o200k_base` · JSONL / XML / TOML | `774.8k` / `1,054.8k` / `934.8k` | `83.02` / `114.79` / `106.68` | **`21,530.58`** / **`22,997.48`** / **`25,307.32`** | `555.78` / `436.05` / `541.45` | `2.250×`-`2.644×` | `76.79×`-`90.27×` |
| `o200k_base` · YAML (`recs.yaml`) | `1,034,792` | `141.338 ± 24.980` | **`29,401.44 ± 7,308.15`** | `568.26` | `3.072×` | `104.87×` |
| `o200k_base` · JSON con formato (`recs_pretty.json`) | `1,314,794` | `193.648 ± 18.210` | **`37,070.18 ± 3,651.35`** | `563.89` | `3.873×` | `132.22×` |

Tres hallazgos surgen de la campaña de `170` ventanas:

1. **La tokenización de JSON cuesta un orden de magnitud más CPU `reported_j` que su análisis**: `tiktoken` (`cl100k_base`, implementado en Rust compilado) consume `27,679.2 nJ/record` (`0.554 J` por `20,000` registros, `129,192` instrucciones/registro) en JSON compacto, **`12.51×` `json.loads()` de Python (`2,212.1 nJ/record`)**, **`19.69×` `orjson.loads()` (`1,405.9 nJ/record`)**, y **`98.73×` `struct.iter_unpack` (`280.4 nJ/record`)**. Aplicar sangría al JSON (`indent=2`) eleva la energía de tokenización de `cl100k_base` en un factor adicional de `2.55×` hasta `70,590.5 nJ/record` (`4.31×` tokenización de CSV) simplemente para escanear secuencias de espacios en blanco.  
2. **Los ratios de energía de análisis siguen de cerca los ratios de instrucciones, con una ligera variación de potencia efectiva (`3.28-5.65 W` por PID de trabajador)**: C `libyaml` consume `3.31 W` de potencia efectiva del trabajador (`249.4×` `reported_j` binario frente a `329.8×` tiempo de pared), mientras que `jsonl` por línea y `tiktoken` de JSON con formato consumen `5.37-5.46 W` (`21.87×` y `251.78×` `reported_j` frente a `16.73×` y `196.37×` tiempo de pared), confirmando por qué los contadores `ri_energy_nj` por proceso son preferibles a multiplicar el tiempo de pared por una conjetura de potencia constante.  
3. **Límite de procedencia**: `ri_energy_nj` es un contador del sistema operativo/firmware (`reported_j`, nivel de telemetría `L3`), no un derivador de hardware externo ni un analizador de potencia de enchufe de pared (`measured_j = None`, `board_metered = false`), y aún cubre el trabajo de CPU/memoria del host previo a los pases forward de la red neuronal (`e_prefill · T_{F,k}` en M4).

<div id="6-where-a-canonical-machine-form-fits" class="anchor-alias" aria-hidden="true"></div>

## 6. Dónde encaja una forma canónica de máquina

Una respuesta al impuesto es mantener una forma canónica de máquina para el almacenamiento y el intercambio, y emitir texto humano solo cuando una persona solicite leerlo. Varios proyectos han seguido esa ruta para partes del problema: CBOR determinista, JSON canónico, formatos binarios vinculados a esquemas. Las propiedades que necesitaría tal forma son comprobables: una cadena de bytes válida por valor, una versión declarada, un esquema cerrado, límites de tamaño y profundidad indicados antes de la decodificación, y una afirmación de tamaño que nombre el diccionario del que depende.

<div id="61-an-open-design-question" class="anchor-alias" aria-hidden="true"></div>

### 6.1 Una cuestión de diseño abierta

Cuál es la mejor forma canónica de intercambio no se decide aquí. JSON canónico (RFC 8785) conserva una forma de texto, pero requiere reglas para el formato de los números y el orden de las claves. CBOR determinista (RFC 8949, sección 4.2) es binario (`2,719.6 nJ/record` en Python `cbor2`, `9.70×` en formato binario fijo), pero deja las decisiones a cada protocolo. Una forma binaria con prefijo de longitud o de paso fijo (`280.4 nJ/record` en `struct.iter_unpack`, o `0.04 nJ/record` para una vista de buffer sin copia) elimina casi todo el trabajo de análisis entre máquinas, mientras que un modelo basado en texto todavía requiere una vista de texto proyectada (`16,384.8 nJ/record` para CSV frente a `70,590.5 nJ/record` para JSON con sangría, bajo `cl100k_base`). Qué compromiso de extremo a extremo resulta ganador, una vez que se incluyen el prefill del modelo en GPU (M4) y las tareas de proyección de campos (M7), sigue siendo una cuestión abierta.

<div id="7-reproduce-this-page" class="anchor-alias" aria-hidden="true"></div>

## 7. Reproducir esta página

Todo lo necesario se encuentra bajo `/living/ai-reads-human/` en este sitio:

- `data/parse_time.tsv`, `data/tokens.tsv`, `data/tokenize_time.tsv`, `data/ENV.txt`, `data/SUMMARY.txt`: las líneas base de tiempo y tokens en Linux Xeon.
- `data/energy_reported_j.tsv` y `data/energy_reported_j_summary.json`: el conjunto de datos de 34 cargas de trabajo, 170 ventanas Apple M5 Max de doble canal `reported_j` (`L3` `ri_energy_nj` + `L2` `IOReport` Falsifier 6) (`data/energy_joules.tsv` conserva la ejecución nula de chip completo sin aislar de octubre de 2026).
- `scripts/gen_corpus.py` (corpus sembrado), `bench_parse.py`, `bench_tokens.py`, `bench_tokenize_time.py`, `summarize.py`: las mediciones.
- `scripts/make_charts.py`: recompila todos los gráficos a partir de los archivos de resultados y verifica los valores principales.
- `scripts/verify_numbers.py`: recalcula cada número citado en el texto; finaliza con un código distinto de cero si hay una discrepancia.
- `tests-formats/`: los scripts detrás de las líneas de prueba de riesgo.

```
python3 -m venv --system-site-packages venv
venv/bin/pip install tiktoken tokenizers msgpack cbor2 orjson ruamel.yaml markdown-it-py psutil
venv/bin/python scripts/gen_corpus.py 20000
venv/bin/python scripts/bench_parse.py 9 > results/parse_time.tsv
venv/bin/python scripts/bench_tokens.py 2000 > results/tokens.tsv
venv/bin/python scripts/make_charts.py charts && venv/bin/python scripts/verify_numbers.py
```

Los vocabularios de tokenizadores para GPT-2, Mistral-7B-v0.1 y Qwen2.5-0.5B se descargan desde un repositorio de modelos mediante `bench_tokens.py`. Los tiempos y los contadores de `ri_energy_nj` dependen del procesador anfitrión y del sistema operativo; se espera que el orden de magnitud múltiple entre formatos se mantenga, mientras que las cifras absolutas de nanosegundos y nanojulios varían según el hardware.

<div id="8-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## 8. Amenazas a la validez

- El contador `ri_energy_nj` del núcleo (`L3` `reported_j`) es un contador del sistema operativo basado en un modelo para Apple Silicon, no un medidor en línea de la riel de CC ni del enchufe de pared de CA (`measured_j = None`, `board_metered = false`), y los julios de prefill/decode del modelo de GPU (`M4`) aún no se miden aquí.
- En hosts compartidos, la sustracción neta sobre reposo del SoC completo mediante `IOReport` (`L2`) es vulnerable a la deriva por coinquilinos (`109 / 170` ventanas invalidadas por el Falsifier 6 en la sección 5c; resultado nulo en la sección 5b).
- La sobrecarga de asignación de objetos de Python contribuye a varias filas de análisis sintáctico (los analizadores compilados en C/Rust de `M8` acotarán la sobrecarga de ejecución; nótese que `orjson` y `tiktoken` ya ejecutan código nativo compilado).
- Un único corpus sintético y con pocos identificadores (`seed = 20261016`); los registros de lenguaje natural y de telemetría siguen sin probarse (`M6`).
- Los tokenizadores evaluados son abiertos; los tokenizadores comerciales cerrados no han sido probados.
- El diseño binario de 23 bytes depende de un diccionario compartido de 24 palabras (`SHA-256` fijado en `data/energy_reported_j_summary.json`), que las cifras de bytes por registro no repiten.

<div id="9-read-ledger-and-references" class="anchor-alias" aria-hidden="true"></div>

## 9. Libro de lectura y referencias

El estado por fuente se encuentra en el [libro de lectura](/living/ai-reads-human/READ_LEDGER.md) (COMPLETO, PARCIAL, NO DISPONIBLE). Citados: RFC 8259, RFC 7493, RFC 8785, RFC 8949, RFC 4180, CommonMark 0.31.2, YAML 1.2.2 (sección 1.1), TOML 1.0.0, guía de codificación de Protocol Buffers, OWASP CSV Injection, `tex.web` (solo encabezado, PARCIAL), Samsi et al. arXiv:2310.03003, Luccioni et al. DOI 10.1145/3630106.3658542. Las fuentes HTML se leyeron como texto sin etiquetas, por lo que las figuras en ellas no se leyeron.

**No leídos (de pago o no disponibles), listados con identificadores y no citados para ninguna afirmación:**

| Elemento | Identificador |
|---|---|
| ISO 32000-1:2008, Portable Document Format | Catálogo ISO (de pago) |
| ISO/IEC 29500, Office Open XML | ISO/IEC 29500 (equivalente libre ECMA-376 leído solo parcialmente) |
| ISO/IEC 26300, OpenDocument | ISO/IEC 26300 (leído OASIS ODF 1.3 Parte 1 libre) |
| IEEE 754-2019, Floating-Point Arithmetic | DOI 10.1109/IEEESTD.2019.8766229 |
| Sennrich, Haddow, Birch, "Neural Machine Translation of Rare Words with Subword Units" | DOI 10.18653/v1/P16-1162 |
| The Unicode Standard and UAX #15 | unicode.org (no recuperado) |
| ECMA-262 (serialización de números referenciada por RFC 8785) | no recuperado |
| The TeXbook, edición impresa | ISBN 978-0-201-13447-6 |
| Horowitz, "Computing's energy problem", fuente atribuida de la cita de 640 pJ por lectura de DRAM de 32 bits | **leído; 640 pJ no encontrado en el artículo ni en las diapositivas plenarias (dan 1 a 2 nJ, y 1,3 a 2,6 nJ por acceso de 64 bits); no utilizado** |
| Strubell et al. 2019; Patterson et al. 2021 y 2022; Wu et al. 2021 | citados solo dentro de los artículos de Samsi y Luccioni; no leídos, sin afirmación realizada |

<div id="10-what-will-be-added" class="anchor-alias" aria-hidden="true"></div>

## 10. Qué se añadirá

Expansiones planificadas, sin orden fijo: energía por token de prellenado y decodificación en modelo de GPU (`M4`) y validación externa en línea con medidor de pared (`measured_j`); analizadores nativos compilados en C/Rust (`M8`); un corpus de lenguaje natural y registros estructurados (`M6`); recuentos de tokens por tarea para cargas de trabajo de proyección de campos de agentes (`M7`); más formatos del libro mayor (PDF 2.0, C2PA, dialectos de Markdown, LaTeX) con sus peligros; y una comparación elaborada de proyecciones binarias canónicas para modelos.

*© 2026 Open Interface Engineering, Inc. Texto, figuras, datos y scripts: MIT OR Apache-2.0, a su elección.*
