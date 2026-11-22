---
title: "RCE-VC: ley del control de versiones"
deck: "RCE-VC (una referencia de control de versiones, separada del lenguaje Reality Code Engine) admite cada cambio en un estado canónico del repositorio o lo rechaza con un motivo registrado, divide los archivos Rust y Python en elementos de nivel superior sin nombre, y lee y escribe el historial ordinario de Git. Los hitos M0, M1 y M2 están implementados en el commit público aba99fce (49 pruebas sin conexión). A 100.000 unidades en Apple M5 Max, la admisión tarda entre 69,7 y 73,6 microsegundos y consume entre 317 y 365 microjulios de energía rusage del núcleo por proceso (reported_j; measured_j está sin establecer)."
lang: "es"
source: "rce-vc"
complete: true
---

<div id="rce-vc-law-of-version-control" class="anchor-alias" aria-hidden="true"></div>

*Revisión af57f48, 22 de noviembre de 2026. Implementación de referencia: [openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc) en [`aba99fcec4414a32bff30ab075668350d3fb80bf`](https://github.com/openIE-dev/rce-vc/tree/aba99fcec4414a32bff30ab075668350d3fb80bf) (13 de noviembre de 2026), que actualiza el árbol inicial `8bf9c9af` con la división de elementos de nivel superior en Rust/Python de `rcevc-keys`, la frontera `rcevc-core::assure` (`49` pruebas sin conexión) y las mediciones de admisión `reported_j` en Apple M5 Max registradas el 22 de noviembre de 2026.*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

RCE-VC es un diseño de control de versiones y una pequeña referencia en Rust. Muchos escritores, personas o programas, envían cambios contra un estado compartido. Una verificación nombrada admite el resultado, o el cambio es rechazado y se conserva la razón. Los escritores pueden permanecer en Git. La referencia no es el lenguaje Reality Code Engine. Utiliza el mismo encuadre: un Form, un paso total, un registro encadenado por hash, claves sin nombre y una escalera de engranajes con un modelo al final.

**En palabras sencillas**

1. Un número arbitrario de personas y programas pueden escribir simultáneamente. Un cambio entra en la historia compartida cuando una verificación nombrada acepta el resultado. Si la verificación no lo acepta, el cambio queda excluido y la razón se registra. Quien lo escribió no decide.
2. Los cambios que no afectan a los mismos componentes no necesitan esperar entre sí. Cuando se superponen, un precio anotado con antelación jerarquiza los resultados que pasan, y un resultado que fue aceptado una vez, incluso tras un conflicto resuelto, se reutiliza. Un modelo se consulta solo después de que fallen los pasos más baratos, y su respuesta aún debe superar la verificación.
3. La referencia lee y escribe la historia ordinaria de Git y ahora divide los archivos Rust y Python en elementos de nivel superior sin nombre (`rcevc-keys`), de modo que un escritor no tiene que abandonar Git. En `aba99fce` sobre Apple M5 Max, admitir un cambio contra un repositorio de 100 000 unidades tomó `69.7-73.6 µs` y `317-365 µJ` en el kernel por proceso del sistema operativo `ri_energy_nj` (`reported_j`). Los campos del recibo `est_uj` siguen siendo una tabla entera declarada (`424,153 µJ` de media en la misma carga de trabajo), y no se conectó ningún monitor de hardware externo ni de pared (`measured_j = None`, `board_metered = false`).

<div id="terms-and-labels" class="anchor-alias" aria-hidden="true"></div>

## Términos y etiquetas

<ul id="terms">
<li>SHA: SHA-256, la función de hash que la referencia utiliza para las claves, los resúmenes de contenido y el registro</li>
<li>BLAKE3: una función de hash criptográfica señalada como objetivo de diseño para las claves internas; la referencia todavía no la utiliza</li>
<li>HAMT: hash array mapped trie (trie mapeado por arreglos de hash), el mapa persistente que almacena el estado del repositorio</li>
<li>UTF: UTF-8, la codificación de texto que admite la correspondencia de archivos de Git</li>
<li>MSRV: versión mínima de Rust soportada (`1.85` para `rcevc-core` y `rcevc-proj-git`, `1.90` para `rcevc-keys`)</li>
<li>CI: integración continua (`cargo test --locked --offline --all-targets` sobre `rustc 1.100.0`)</li>
<li>CAS: actualización de referencia por comparación e intercambio (`CasRef` y `GitDir::compare_and_swap_ref`)</li>
<li>FIPS: Federal Information Processing Standards (Estándares Federales de Procesamiento de la Información); las comprobaciones de SHA-256 utilizan los vectores de FIPS 180-4</li>
<li>RFC: Request for Comments (solicitud de comentarios); el código de descompresión inflate sigue las RFC 1950 y RFC 1951</li>
<li>SATB, CPU, GPU, PID, SMC, SoC: disciplina de telemetría de Satiation Benchmark, unidad central de procesamiento, unidad de procesamiento gráfico, identificador de proceso, controlador de gestión del sistema (System Management Controller) y sistema en chip (system-on-chip)</li>
<li>VC1, VC2, VC3, VC4, VC5: las cinco proposiciones que prueba la referencia, identificadas con sus pruebas más abajo</li>
<li>CONGRA: un corpus mencionado en las notas del proyecto para una futura reproducción; el nombre no se desarrolla en esta página</li>
<li>README: el archivo de descripción general incluido en el repositorio de referencia</li>
</ul>

Tres etiquetas se mantienen separadas en esta página a lo largo de la telemetría de chip completo (L2) y por proceso (L3):

- **Medido (tiempo de reloj y recuentos)** significa un tiempo de reloj, recuento de instrucciones o recuento de rutas del build de lanzamiento (`aba99fce` en Apple M5 Max, y la línea base del README impresa en `8bf9c9af`).
- **Reportado (`reported_j`: contadores L2 y L3)** significa una lectura de contador del sistema operativo o del chip en Apple M5 Max (`macOS 27.2.1`): todo el chip `IOReport` a través de `macmon` (L2, etiqueta de host compartido `A2`, regulado por Falsifier 6 a `<= 5.0%` deriva de inactividad pre/post) y kernel por PID `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (L3, etiqueta `D`). No se conectó ninguna sonda de alimentación externa de riel de hardware o enchufe de pared (`measured_j = None`, `board_metered = false`).
- **Declarado (`est_uj` / `est_j`)** significa la tabla de costos enteros predeterminada copiada en los recibos dentro de `rcevc-core`. Es una tabla analítica escrita en código fuente, nunca un contador ni una lectura de medidor de pared.

<div id="1-what-the-reference-is-and-what-it-is-not" class="anchor-alias" aria-hidden="true"></div>

## 1. Qué es la referencia y qué no es

El objetivo del proyecto es una historia que muchos humanos y agentes puedan escribir simultáneamente, sin pedir a un escritor que deje de usar Git. El encuadre en las notas del proyecto es que ramificar, diferenciar y fusionar en una única línea principal es una interfaz antigua, que la compatibilidad es lo que mantiene esa interfaz en su lugar, y que una regla determinista debe decidir allí donde una regla pueda, con un modelo al final.

El Reality Code Engine (RCE) es un lenguaje de programación estudiado en su propio artículo en este sitio. RCE-VC no está construido sobre ese lenguaje. No analiza programas RCE, no los emite ni llama al comprobador de RCE. Lo que comparte es el encuadre: una Forma para el repositorio, un paso determinista total llamado δ, un registro encadenado por hash cuya plegadura es el estado, claves sin nombre y una escalera de engranajes en la que un modelo se ejecuta al final y no es de confianza.

En el commit `aba99fce` (`13 November 2026`), el espacio de trabajo público es la versión 0.1.0 y contiene **tres** crates:

1. `rcevc-core` es el núcleo determinista: sin reloj, sin aleatoriedad, sin E/S, sin dependencias y con `#![forbid(unsafe_code)]` (MSRV `1.85`). Ahora también incluye `rcevc-core::assure`, un límite de aseguramiento que garantiza que una acción comprobada se acuñe solo a partir de un resultado ya presente en el registro de ese repositorio y se aplique únicamente en la cabeza y la puerta contra las que se comprobó, mientras que `CasRef` reintenta un identificador de operación para que el objetivo idéntico de otro escritor nunca se confunda con éxito.
2. `rcevc-keys` divide archivos fuente de Rust (`.rs`) y Python (`.py`) en elementos de nivel superior mediante `tree-sitter 0.27.2`, `tree-sitter-rust 0.24.2` y `tree-sitter-python 0.25.0` vendidos (MSRV `1.90`, compilado sin conexión desde `vendor/` con un compilador de C y cero descargas de red). El identificador de cada elemento es la clave sin nombre del núcleo de un cuerpo de token normalizado, invariante ante renombrados de elementos, espacios en blanco y comentarios, mientras que los bytes originales exactos permanecen en `parts` para que `project` los concatene de nuevo sin pérdidas; las rutas que no son `.rs`/`.py` o los árboles con error de análisis recurren limpiamente a una hoja sobre los bytes originales.
3. `rcevc-proj-git` es la proyección de Git (`#![forbid(unsafe_code)]`, MSRV `1.85`), que lleva su propio código SHA-1, zlib y de objetos Git, además de `GitDir::compare_and_swap_ref` para que el núcleo permanezca libre de dependencias.

La CI ejecuta `cargo test --locked --offline --all-targets` y `cargo clippy --locked --offline --all-targets -- -D warnings` sobre `rustc 1.100.0`, ejecutando **49 pruebas sin conexión** (`29` en `rcevc-core`, `8` en `rcevc-keys` y `12` en `rcevc-proj-git`, verificadas contra `git 2.43`). Las proposiciones numeradas más allá de VC5 no se exponen en esta página.

<div id="2-law-of-version-control" class="anchor-alias" aria-hidden="true"></div>

## 2. Ley del control de versiones

El enunciado de referencia es el siguiente. El mismo párrafo abre el README del repositorio y la documentación del crate. Aquí se cita una sola vez.

> El control de versiones es la admisión de cambios sobre un estado canónico y sin nombres del repositorio. Cada cambio se admite únicamente cuando un verificador nombrado acepta el estado posterior bajo un contrato declarado, o bien se rechaza con un motivo registrado; los cambios cuyas clausuras de dependencias no cumplen se admiten sin coordinación; entre las integraciones admisibles, un coste declarado ordena los candidatos; y todo resultado aceptado, incluido cada conflicto resuelto, se reutiliza.

El resto de esta página describe lo que implementa la referencia en `aba99fce`, lo que se midió sobre ella y lo que todavía no hace. El enunciado es el estándar para el que está construida la referencia. No es un informe que indique que las herramientas de control de versiones existentes ya se comportan de esta manera.

<div id="3-quantities" class="anchor-alias" aria-hidden="true"></div>

## 3. Cantidades

Una **unidad** es un cuerpo de texto y una lista de ranuras de dependencia. Si la lista de dependencias está vacía, la unidad es una hoja y el cuerpo es texto literal, de modo que un signo de dólar en un script de shell sigue siendo un signo de dólar. Si la lista no está vacía, un signo de dólar seguido de un índice selecciona una dependencia, y dos signos de dólar representan un signo de dólar literal.

La **clave** de una unidad es una identidad independiente de los nombres. Un renombrado cambia a qué ranura está vinculado un nombre, pero no cambia la clave. La referencia define

$$
\mathrm{key}(u) = H(\texttt{rcevc/unit/v1},\; \mathrm{body}(u),\; \mathrm{key}(d_0), \ldots, \mathrm{key}(d_{m-1}))
$$

donde $H$ es SHA-256 a través de un codificador versionado y con separación de dominios, y $d_i$ son las unidades de dependencia. El **resumen de contenido**, que el trie utiliza para el hash, es un valor distinto: $H(\mathrm{body}, \text{dependency names})$.

Un **borrador** es un mapa no validado, que se usa para la génesis y para cualquier dato leído desde el exterior. Sellar un borrador lo comprueba y produce un **estado**. Un estado está bien formado: las dependencias se resuelven, cada índice de un cuerpo está vinculado y el grafo de dependencias no tiene ciclos. Mantiene tres mapas persistentes. El mapa de unidades es un HAMT de Merkle. El mapa de claves y el índice de dependencias inversas son persistentes y no forman parte de la raíz de Merkle. Clonar un estado y leer su raíz tienen coste $O(1)$. Dos estados son iguales cuando sus raíces son iguales. Un diff recorre únicamente los subárboles cuyos hashes difieren, de modo que su coste depende de la diferencia y no del tamaño del repositorio. Los dependientes cuya clave cambió, pero cuya propia unidad no, quedan deliberadamente fuera del diff. La clausura, definida más abajo, los incorpora. Incluirlos en el diff convertiría a un dependiente compartido en un conflicto falso.

Una **edición** cambia ranuras y valida una sola vez al final, sobre la clausura de dependencias inversas de las ranuras tocadas. Los estados dentro de una edición pueden estar mal formados. Eso es intencionado, por ejemplo, un borrado seguido de una escritura.

Un **cambio** lleva una etiqueta opaca del autor, un estado base, un nivel, una lista de operaciones y un mensaje. Las operaciones son put, delete y rename. Los niveles son solo nombres, erratum, cambio de significado y cambio de interfaz. El nivel solo nombres lo comprueba el núcleo: el multiconjunto de claves debe permanecer inalterado. El identificador del cambio cubre todos los campos. El mensaje es la intención declarada, por ejemplo, el asunto de un commit. La admisión no lo lee y no depende de la etiqueta del autor.

Para un cambio $c$ frente a un estado $s$,

$$
\mathrm{writes}(c, s) = \mathrm{diff}(s,\; \mathrm{apply}(s, c)).
$$

Las lecturas son las dependencias de los puts y las fuentes de los renombrados. La clausura de $c$ en un estado y en el estado posterior está formada por las escrituras, los dependientes previos, los dependientes posteriores y las lecturas. Dos cambios conmutan sobre $s$ cuando las escrituras de cada uno no intersecan la clausura del otro:

$$
\mathrm{commutes}(a, b, s) \iff \mathrm{writes}(a) \cap \mathrm{closure}(b) = \emptyset \;\land\; \mathrm{writes}(b) \cap \mathrm{closure}(a) = \emptyset.
$$

La referencia comprueba que los cambios conmutativos producen la misma raíz en cualquier orden.

El paso **δ** es `submit`. Es total sobre la entrada del usuario. Devuelve una aceptación con un recibo o un rechazo con un motivo, y en ambos casos añade exactamente una entrada al registro encadenado por hash. La cabeza es el resultado del pliegue de ese registro. La reproducción (replay) verifica la cadena y reintegra cada entrada. Utiliza la resolución registrada para un conflicto y no invoca a ningún proponente. Comprueba la raíz de cada estado previo, la raíz de cada estado posterior y el motivo de cada rechazo.

<div id="4-the-repository-form" class="anchor-alias" aria-hidden="true"></div>

## 4. La forma del repositorio

El README organiza la forma implementada en nueve partes, más el divisor de ítems `rcevc-keys` y el límite `rcevc-core::assure`.

| Parte | Ubicación | Qué hace |
|---|---|---|
| R, claves sin nombre | `model.rs`, `rcevc-keys` | Claves como arriba; `rcevc-keys` divide los archivos `.rs` y `.py` en ítems de nivel superior con proyección de bytes sin pérdida. Un renombrado no cambia ninguna clave. |
| S, estado persistente | `hamt.rs`, `model.rs` | Merkle HAMT. Clonar y raíz en $O(1)$, diferencia del tamaño de la diferencia, forma canónica del trie. Las claves y el índice de dependencias inversas se actualizan en la edición, no en todo el repositorio. |
| Δ, cambios tipados | `change.rs` | Inserción, eliminación y renombrado sobre una base declarada, con un nivel declarado. Solo el nombre se verifica por el núcleo. |
| X, conmutación | `change.rs` | Las escrituras son la diferencia real. El cierre agrega dependientes antes y después, y lecturas. Los cierres disjuntos conmutan. |
| K y G, verificador y puerta | `gate.rs` | Cada verificador declara una clase de propiedad, una suposición de enlace, una base confiable, una autoridad, un alcance y un resumen. |
| δ, la escalera | `repo.rs`, `assure.rs` | Búsqueda, conmutación, fusión estructural, revalidación, proponente, más garantía de referencia CAS (`CasRef`). La puerta se ejecuta en cada ruta. |
| D, el registro | `repo.rs` | Entradas encadenadas por hash. La cabeza es el pliegue. La reproducción lo reconstruye sin proponente. |
| U, reutilización | `repo.rs` | Una resolución se almacena bajo una firma de conflicto sin nombre, y solo después de que la puerta la haya aceptado. |
| C, costo | `repo.rs` | La tabla por peldaño indicada (`est_uj`). Los recibos llevan la suma. |

La autoridad de un verificador es una de: pinned, replay, proved, derived o inferred. Su alcance es uno de tres. **Unit**: vuelve a comprobar unidades en la delta. **Closure**: el veredicto depende de la unidad y sus dependencias transitivas, por lo que la puerta también vuelve a comprobar a los dependientes. **Global**: verifica todo el estado. Si la cabeza anterior pasó y el alcance declarado es verdadero, una re-verificación con alcance coincide con una verificación completa. La prueba `delta_gate_agrees_with_full_gate` registra ese acuerdo en 600 ensayos, con más de 100 rechazos. Un verificador que miente sobre su alcance rompe VC2. El alcance es confiado. Nada en esta versión lo impone ocultando el resto del estado.

El resumen de la puerta cubre cada declaración del verificador, y ese resumen alimenta el hash génesis. La forma del trie es canónica: un prefijo contiene nada, una hoja única, o una rama de dos o más claves. Las raíces no dependen del historial de orden de llegada. Todo lo hashado pasa por el codificador con una etiqueta de dominio versionada del forma `rcevc/<thing>/vN`. Cambiar lo que cubre una etiqueta implica incrementar la versión.

<div id="5-the-transition" class="anchor-alias" aria-hidden="true"></div>

## 5. La transición

`submit` siempre toma una de las siguientes rutas. Los nombres de los engranajes son los que aparecen en el recibo.

1. **G0, búsqueda.** El mismo identificador de cambio contra la misma cabeza, ya rechazado, devuelve el rechazo almacenado. El coste declarado de ese reintento es únicamente la fila G0. La prueba `g0_identical_retry_costs_one_lookup` registra esto.
2. **Base.** La instantánea base debe existir, o el motivo es una base desconocida. La aplicación de las operaciones a esa base debe tener éxito, o el motivo es un error de aplicación o una unidad mal formada. Una reclamación de solo nombre que no deje invariante el multiconjunto de claves es rechazada.
3. **G1, conmutación.** Sea el conjunto movido la diferencia de la base a la cabeza actual. Si el cierre del cambio, en la base y en la cabeza, no intersecta ese conjunto, el cambio se aplica directamente a la cabeza. Sin fusión.
4. **G2, fusión estructural.** En caso contrario la referencia fusiona, ranura a ranura, sobre la unión de lo que se movió en la cabeza y lo que el propio cambio modificó. Un lado sin cambios: se toma el otro lado. Ambos lados iguales: se toma cualquiera. Cualquier otra ranura es un conflicto.
5. **Conflicto.** La firma es $H(\mathrm{key}_{base}, \mathrm{key}_{head}, \mathrm{key}_{theirs})$, que no utiliza el nombre de la ranura. La reutilización G0 devuelve una resolución almacenada para esa firma. Si no hay ninguna almacenada, G4 consulta al proponente. Si no hay proponente o este no devuelve nada, el cambio se rechaza con las ranuras en conflicto. Durante la reproducción se utiliza la resolución registrada y no se invoca al proponente.
6. **G3, revalidación.** La asignación fusionada se construye sobre la cabeza con una comprobación de buena formación. Si esa comprobación falla, el cambio se rechaza por mal formado.
7. **Puerta, en toda ruta, incluida G1.** El candidato y la diferencia desde la cabeza actual se entregan a la puerta. Un comprobador que falla rechaza el cambio y nombra al comprobador.
8. **Aceptar.** Las resoluciones del proponente se copian en el almacén de reutilización solo en este momento. La nueva cabeza se instantánea. El recibo registra los engranajes utilizados, la evidencia de la puerta, las resoluciones y `est_uj`.

Los rechazos también se registran. La cabeza no se mueve.

<div id="6-propositions-the-tests-hold" class="anchor-alias" aria-hidden="true"></div>

## 6. Proposiciones que sostienen las pruebas

En `aba99fce`, `cargo test --offline` ejecuta 49 pruebas (`29` del núcleo, `8` de claves, `12` de git), que corresponden a las proposiciones siguientes:

| Afirmación | Prueba nombrada en el repositorio |
|---|---|
| VC1, totalidad, sin estados indeterminados: toda propuesta se acepta o se rechaza con un motivo, y queda registrada | `vc1_every_submission_is_accepted_or_refused_and_logged` |
| VC2, verde por inducción: toda cabeza está bien formada y supera la puerta | `vc2_every_head_is_well_formed_and_passes_the_gate` (400 propuestas aleatorias, bases obsoletas, cambios envenenados) |
| VC3, la conmutación implica el mismo resultado en cualquier orden | `vc3_commutation_implies_order_independence` (3.000 ensayos aleatorios, más de 500 pares que conmutan) y `vc3_disjoint_writers_integrate_at_g1_in_either_order` |
| VC4, un conflicto semántico se detecta aunque el texto no entre en conflicto | `vc4_identical_edits_merge_and_semantic_conflicts_are_caught_at_g3` (un cambio de aridad frente a un nuevo llamador) |
| VC5, un conflicto resuelto se reutiliza por su firma independiente del nombre | `vc5_resolved_conflicts_are_reused_by_name_free_signature` |
| Un resultado del modelo es un candidato | `model_output_is_a_candidate_never_trusted` |
| El estado es el pliegue del registro | `replay_reproduces_head_without_any_proposer` |
| Un renombrado no cambia ninguna clave, y la verificación solo por nombre está comprobada | `renames_change_no_keys_and_name_only_is_verified` |
| Los reintentos idempotentes en G0 cuestan una sola búsqueda | `g0_identical_retry_costs_one_lookup` |
| La puerta acotada coincide con una puerta completa | `delta_gate_agrees_with_full_gate` (600 ensayos, más de 100 rechazos) |
| Las instantáneas no se alteran con ediciones posteriores; lo incremental coincide con el cálculo desde cero | `snapshots_share_structure_and_diff_is_exact`, pruebas de HAMT en `hamt.rs` |
| SHA-256 coincide con los vectores publicados | Vectores FIPS 180-4 en `hash.rs` |

La prueba de VC5 acepta un conflicto a través del proponente y, a continuación, envía el mismo conflicto bajo otro nombre de ranura. La segunda aceptación utiliza la marcha de búsqueda G0, no utiliza G4, no vuelve a invocar al proponente y tiene un `est_uj` inferior a una centésima parte del recibo de la ruta del proponente. Ese cociente es una comparación de costes declarados en los recibos.

Otra prueba independiente suministra al proponente un resultado envenenado. La puerta lo rechaza, la cabeza permanece sin cambios y la resolución rechazada no se almacena para su reutilización.

<div id="7-measured-wall-time" class="anchor-alias" aria-hidden="true"></div>

## 7. Tiempo de ejecución medido

La carga de trabajo, tal como la implementa el ejemplo de enjambre: cada escritor en una ronda envía frente a la cabeza inicial de esa ronda, por lo que los envíos posteriores en la ronda quedan obsoletos. Un escritor de cada cinco modifica el módulo activo (`below(5) == 0`). Una presentación de cada cincuenta transporta un token prohibido (`below(50) == 0`), lo cual corresponde a la tasa de veneno del 2 % que indica el README. El proponente en el ejemplo es un sustituto determinista que une los dos cuerpos. No es un modelo aprendido. El ejemplo almacena 10 unidades en cada módulo. La semilla fija en el ejemplo es `0x5eed`.

<div id="71-path-shares-at-400-units" class="anchor-alias" aria-hidden="true"></div>

### 7.1 Participaciones de rutas a 400 unidades

La tabla de rutas del README es el enjambre predeterminado: 64 escritores, 20 rondas, 40 módulos, 400 unidades, 1.280 envíos. Las participaciones son de todos los envíos.

| Ruta | Participación |
|---|---:|
| Aceptada en G1 (conmutada, sin fusión) | 57.0% |
| Aceptada en G2, luego G3 (fusión estructural, revalidada) | 27.3% |
| Aceptada en G2, luego G4, luego G3 (conflicto, proponente, revalidada) | 13.8% |
| Rechazada por la puerta | 1.9% |

Las cuatro participaciones suman el 100%. Todos los rechazos fueron cambios envenenados, incluidos 6 salidas de proponente que heredaron el veneno. 1.259 de los 1.280 envíos estaban sobre una base obsoleta, y el 98.1% de esos envíos obsoletos fueron admitidos sin rebase de escritor. El ejemplo realizó 182 llamadas a proponente. La reproducción desde el génesis, sin proponente, reprodujo la misma cabeza.

![Rutas de admisión y tiempos de pared medidos en la compilación de referencia](/figures/rce-vc/swarm-and-timing.svg)

*Figura 1. Participaciones de rutas medidas para el enjambre de 400 unidades y 20 rondas, y tiempo de pared medido por envío para las ejecuciones de temporización de 5 rondas en la compilación de referencia de línea base. Versión de lanzamiento, un núcleo. Los costes de recepción indicados no aparecen en esta figura.*

<div id="72-integration-cost-against-repository-size" class="anchor-alias" aria-hidden="true"></div>

### 7.2 Costo de integración frente al tamaño del repositorio

La tabla de tiempos del README corresponde a la misma clase de carga de trabajo, con 64 escritores y 5 rondas, la misma semilla, compilación en modo release y un solo núcleo. La celda indica el tiempo de pared medido por envío. M0 es el estado anterior, que clonaba mapas. M1 es el estado persistente de Merkle.

| Unidades | Módulos | M0, mapas clonados | M1, estado persistente (host del README) | Razón impresa en el README |
|---:|---:|---:|---:|---:|
| 400 | 40 | 2.103 µs | 98 µs | 21 veces |
| 4.000 | 400 | 27.536 µs | 105 µs | 262 veces |
| 40.000 | 4.000 | no ejecutado | 136 µs | |
| 100.000 | 10.000 | no ejecutado | 188 µs | |

La fila de 100.000 unidades corresponde al ejemplo invocado como `swarm -- 64 5 10000`: 64 escritores, 5 rondas y 10.000 módulos. M0 creció con el tamaño del repositorio, mientras que M1 se mantuvo casi constante. El aumento restante procede de la profundidad del trie y de la cantidad de cambios dentro de una ronda, dado que las instantáneas comparten estructura, el diff y la compuerta omiten los subárboles iguales, una edición solo vuelve a indexar las unidades editadas y sus dependientes, y la compuerta vuelve a verificar el alcance declarado del delta.

<div id="73-measured-wall-time-and-on-chip-reported_j-at-100000-units-commit-aba99fce" class="anchor-alias" aria-hidden="true"></div>

### 7.3 Tiempo de pared medido y `reported_j` en chip a 100,000 unidades (commit `aba99fce`)

El 22 de noviembre de 2026, `openIE-dev/rce-vc` en el commit `aba99fce` (`rustc 1.100.0`, compilación de release) se ejecutó e instrumentó en Apple M5 Max (`macOS 27.2.1` `arm64`) bajo el arnés de `reported_j` de canal dual SATB: `IOReport` de chip completo a través de `macmon` (L2, etiqueta `A2`, Falsifier 6 `<= 5.0%` puerta de deriva en reposo) emparejado con el kernel por PID `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (L3, etiqueta `D`), a `100,000` unidades (`10,000` módulos × `10` unidades):

| Carga de trabajo de `100,000` unidades (`aba99fce`, Apple M5 Max) | Admisiones / prueba | Pruebas | Tiempo de pared mediano / admisión | `reported_j` L3 mediano / admisión | Instrucciones / admisión | `CostTable` `est_uj` declarado / admisión |
|---|---:|---:|---:|---:|---:|---:|
| **Enjambre README (`64` escritores × `5` rondas)** | `320` (`315` acc, `5` ref) | `5` | **`69.69 µs`** (`63.5-84.1 µs`) | **`365.35 µJ`** (`346.4-395.7 µJ`) | `1,147,137` | `438,530.4 µJ` |
| **Ventana sostenida (`64` escritores × `500` rondas)** | `32,000` (`31,357` acc, `643` ref) | `3` | **`73.56 µs`** (`69.3-75.7 µs`) | **`317.21 µJ`** (`278.9-369.0 µJ`) | `1,153,976` | `424,152.7 µJ` |

- **Génesis y desglose de rutas**: Construir el estado génesis Merkle HAMT de `100,000` unidades tomó una mediana **`1.244 s`** una sola vez (`5` pruebas). En la ejecución sostenida de `32,000` envíos (`ventana de `2.35 s`), `26,103` envíos (`81.6%`) fueron admitidos en `G1Commute`, `2,594` (`8.1%`) en `G2Structural > G3Revalidate`, `2,660` (`8.3%`) a través de `G4Proposer` con `2,660` firmas de conflicto promovidas para reutilización, y `643` (`2.0%`) envíos contaminados fueron rechazados (`30,857` de `31,490` envíos obsoletos = `98.0%` admitidos sin rebase de escritor).
- **Consistencia L2 vs L3 y Falsifier 6**: En las dos pruebas sostenidas que superaron Falsifier 6 (`2.67%` y `1.22%` de deriva en reposo), la energía marginal neta del `IOReport` L2 de chip completo fue `9.22 J` y `4.66 J` (`288.2 µJ` y `145.6 µJ`/admisión) junto a `ri_energy_nj` L3 por PID de `11.81 J` y `8.92 J` (`369.0 µJ` y `278.9 µJ`/admisión), mientras que la prueba intermedia (`7.28% > 5.0%` de deriva en reposo por trabajos concurrentes del host) tuvo su resta neta L2 invalidada automáticamente por Falsifier 6. Obsérvese que el marcador de posición `CostTable` (`424-439 mJ`/admisión) sobrestima la admisión exclusivamente de CPU en aproximadamente tres órdenes de magnitud porque su entrada `Proposer` de `5,000,000 µJ` (`5 J`) anticipa un proponente neural en vez del sustituto determinista del ejemplo (`measured_j = None`, `board_metered = false`).

<div id="8-stated-cost-on-receipts" class="anchor-alias" aria-hidden="true"></div>

## 8. Costo declarado en los recibos

La tabla predeterminada en `CostTable` en `aba99fce`, en microjulios, permanece como un precio declarado por fila dentro de los recibos del repositorio:

| Fila | Qué lo añade | µJ declarados |
|---|---|---:|
| G0 | Se carga al inicio de cada intento. Se carga de nuevo por cada firma de conflicto reutilizada. Un rechazo memoizado es solo esta fila. | 1 |
| G1 | Se carga cuando el intento alcanza la prueba de conmutación | 10 |
| G2 | Se carga cuando el intento realiza la fusión estructural | 100 |
| Checker | Se carga una vez por comprobador, en cada ruta que alcanza la puerta, incluida G1 | 1.000 |
| Proposer | Se carga una vez por llamada al proponente | 5.000.000 |

G3 se escribe en la ruta y no tiene fila propia. El `est_uj` de un recibo es la suma de las filas que añadió el intento. Reemplazar esta tabla con `measured_j` de rieles de hardware es el hito M6 y permanece abierto; la Sección 7.3 proporciona la primera calibración del sistema operativo `reported_j` (`317-365 µJ` por admisión de `100.000` unidades con un proponente suplente determinista).

<div id="9-the-git-projection" class="anchor-alias" aria-hidden="true"></div>

## 9. La proyección sobre Git

La proyección corresponde al hito M2, en `rcevc-proj-git`. Una unidad hoja se representa mediante los bytes del archivo. Una unidad con dependencias se escribe como un archivo con una cabecera breve, que la referencia trata como una biyección sobre archivos UTF-8:

```
#rcevc-unit v1
#dep <slot>
#body
<body>
```

Se escribe una línea `#dep` por cada dependencia.

**Out.** `export` escribe un commit en `main` por cada entrada aceptada. El autor es la etiqueta del escritor. El asunto es el mensaje del cambio, o una línea que nombra el identificador del cambio y los engranajes si el mensaje está vacío. Cada commit aceptado lleva los trailers `RCE-VC-Change`, `RCE-VC-Pre`, `RCE-VC-Post`, `RCE-VC-Path`, `RCE-VC-Evidence`, `RCE-VC-Resolved`, `RCE-VC-Est-uJ` y `RCE-VC-Entry`. `RCE-VC-Est-uJ` es la suma declarada de microjulios, no una medida. La referencia `refs/rcevc/log` tiene un commit por cada entrada del registro, incluidas las denegaciones, y un commit de denegación también lleva `RCE-VC-Reason`. Dado el mismo registro y la misma base temporal, `export` produce los mismos identificadores de commit.

**In.** `ingest` recorre los commits padre desde una punta hasta encontrar un commit cuyo trailer `RCE-VC-Post` sea una instantánea. Esa instantánea es la base. El árbol de la punta se convierte en un único cambio, inserción y eliminación, contra esa base. Si el multiconjunto de contenido no cambia, el nivel es solo de nombres. La rama es la propuesta. La escalera decide. No se le pide al escritor que haga rebase.

El README registra estas verificaciones contra git 2.43, en `tests/git_interop.rs` (`12` pruebas en `rcevc-proj-git` en `aba99fce`):

| Check | Result recorded in the README |
|---|---|
| `git fsck --full --strict` en el historial exportado | limpio |
| Cada commit en `main` se reimporta a la raíz en su trailer `RCE-VC-Post` | sí |
| Dos exportaciones del mismo registro en diferentes directorios | identificadores de commit idénticos |
| El analizador de trailers de Git lee los recibos | sí |
| Dos commits Git simples en una rama cuya base ha quedado obsoleta | ingestado como un único cambio, admitido en G1, `main` avanza |
| Objetos que Git escribió, incluyendo deflate dinámico-Huffman | leído |
| Un commit Git simple que contiene un token prohibido | rechazado, registrado en `refs/rcevc/log`, `main` sin mover |

Límites de esta proyección, según lo indica el README: solo objetos sueltos y referencias sueltas; modo de archivo 100644 al exportar, por lo que el bit ejecutable aún no es un atributo unitario; los enlaces simbólicos, submódulos y archivos no UTF-8 son rechazados con una razón en lugar de ser adivinados.

El proyecto menciona el nombre Mergiraf, una combinación estructurada que utiliza tree-sitter, como trabajo dirigido a archivos con forma de parse. Eso es una observación de convergencia. Esta página no evalúa la referencia contra él, ni evalúa la referencia contra ningún otro sistema de control de versiones.

<div id="10-limits-of-this-version" class="anchor-alias" aria-hidden="true"></div>

## 10. Límites de esta versión

En el commit `aba99fce`:

1. `rcevc-keys` divide los archivos Rust (`.rs`) y Python (`.py`) en elementos de nivel superior (con dependencias que apuntan solo a elementos anteriores en el mismo archivo), pero la división de TypeScript y una evaluación de ida y vuelta de 50 paquetes / 1.000 repositorios aún no se han realizado; los demás tipos de archivo permanecen como unidades hoja de archivo completo.
2. El almacenamiento en Git utiliza objetos sueltos y referencias sueltas. No hay packfiles ni referencias empaquetadas. La exportación escribe únicamente el modo 100644. Se rechazan enlaces simbólicos, submódulos y archivos no UTF-8.
3. Cada commit exportado reconstruye el árbol completo.
4. Los conjuntos de dependencias inversas se clonan cuando se actualizan. Una unidad con muchos dependientes hace que esa actualización sea grande.
5. El cálculo de claves es recursivo. Una cadena de dependencias de más de unos 10.000 elementos podría desbordar la pila.
6. Una raíz de contenido completo es lineal en el número de unidades. La ingesta la utiliza solo para estimar el nivel de solo-nombre. La comprobación de solo-nombre del núcleo recorre el diff.
7. Las instantáneas se mantienen en memoria, sin política de retención ni almacén separado.
8. `submit` es monotarea (`CasRef` protege los intercambios de referencias, mientras que `submit` admite cambios conmutativos de forma secuencial). No se han construido leases.
9. Se confía en que un comprobador diga la verdad sobre su ámbito (el sandboxing de Wasmtime M3 aún no se ha construido).
10. El `reported_j` en chip (`317-365 µJ` por admisión de `100,000` unidades) se ha registrado externamente mediante el `ri_energy_nj` del núcleo, mientras que los campos de recibo en el repositorio aún llevan la tabla `est_uj` declarada y el `measured_j` de carril de hardware externo (M6) permanece abierto (`measured_j = None`, `board_metered = false`).

<div id="11-next-work" class="anchor-alias" aria-hidden="true"></div>

## 11. Trabajo siguiente

- **Completar M1 (ampliación de `rcevc-keys` y ida y vuelta sobre corpus).** Añadir la gramática de TypeScript junto a las de Rust y Python, dar soporte a dependencias entre ítems de distintos archivos y verificar reconstrucciones idénticas byte a byte sobre al menos 50 crates y paquetes reales, con ediciones independientes a funciones separadas de un mismo archivo que conmutan en G1.
- **Completar M2 (claves internas BLAKE3 y paquetes de `gix`).** Migrar el hashing interno a BLAKE3 (conservando los vectores SHA-256 de FIPS 180-4 como prueba propia y actualizando las etiquetas de dominio) y trasladar el almacenamiento de objetos Git a `gix` (`gitoxide`) para paquetes y referencias empaquetadas, seguido de una ida y vuelta sobre el historial de 1.000 repositorios.
- **M3 (`rcevc-gate` sobre Wasmtime).** Ejecutar los verificadores como módulos de WebAssembly deterministas, con límite de combustible (`fuel`) y digests fijados, de modo que el alcance declarado se haga cumplir exponiendo únicamente la porción declarada.
- **M4 (arrendamientos y canal monótono).** Streaming concurrente de cambios monótonos sin coordinación.
- **M5 (reproducción de corpus de conflictos).** Reproducir Merge-Bench, CONGRA y AgenticFlict a través de la escalera, contando las resoluciones en G0, G1, G2, G3 y G4.
- **M6 (`rcevc-meter`).** Sustituir `est_uj` por `reported_j` calibrado y por `measured_j` medido externamente desde los rieles de hardware.

<div id="12-copyright-and-license" class="anchor-alias" aria-hidden="true"></div>

## 12. Derechos de autor y licencia

Derechos de autor 2026 Open Interface Engineering, Inc.

La implementación de referencia en [openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc) en el commit `aba99fcec4414a32bff30ab075668350d3fb80bf` (`13 de noviembre de 2026`) está bajo la Licencia Apache, Versión 2.0. El archivo de licencia en ese árbol indica que los derechos de autor pertenecen a Open Interface Engineering, Inc., y el manifiesto del crate establece `license = "Apache-2.0"`. Esta página es el texto de estudio para esa referencia.
