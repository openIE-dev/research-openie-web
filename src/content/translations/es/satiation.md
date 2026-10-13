---
title: "Saciedad de la tarea frente al rebote agregado en la demanda de IA"
deck: "El desplome publicado del precio de la inferencia digital no identifica energía gratuita, actuación gratuita ni valor ilimitado una vez completada una tarea."
lang: "es"
source: "satiation"
complete: true
---

<div id="satiation-and-scarcity-after-free-ai" class="anchor-alias" aria-hidden="true"></div>

*Versión 1.1, 11 de octubre de 2026. Datos y código: [research.openie.dev/data/](/data/#economics). PDF en LaTeX: [/pdfs/latex/satiation.pdf](/pdfs/latex/satiation.pdf) ([fuente](/pdfs/latex/satiation.tex)).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

Una vez terminada una tarea, más esfuerzo de máquina sobre esa tarea no añade nada. Este artículo define esa parada con precisión y la separa de la cuestión distinta de si la demanda total de trabajo de máquina sigue creciendo.

**En palabras sencillas**

1. Todo trabajo tiene una línea de meta. Pasada esa línea, más trabajo del ordenador sobre ese trabajo es desperdicio.
2. Un trabajo de ordenador más barato aún puede hacer que la gente empiece muchos más trabajos, así que el uso total puede seguir subiendo.
3. Los precios en dinero de la IA están cayendo deprisa, pero la electricidad que consume nunca es gratuita.

Muchos modelos de planificación tratan la demanda de inteligencia artificial como si no tuviera línea de meta. La teoría del consumidor ya contiene el objeto opuesto. La saciedad, y el punto de dicha relacionado con ella, es la región en la que unidades adicionales de un bien no elevan la utilidad y pueden reducirla (Andersen, 2001). Este artículo define un pariente operativo para el trabajo y el cuidado: un bucle alcanza la finalización de la tarea cuando se cumple un predicado de completitud enunciado, las llamadas posteriores no cambian ninguna cláusula de ese predicado de falsa a verdadera, y las llamadas que deshacen el predicado son daño, no valor. El tiempo de interacción, el número de tokens y el número de licencias son variables distintas. Pueden crecer después de la completitud.

Hay que mantener separadas dos afirmaciones. La saciedad a nivel de tarea se cumple por definición: una vez que el predicado de completitud de una tarea es verdadero, más síntesis sobre esa tarea no compra nada. La saciedad agregada es una afirmación sobre la demanda total, y no está implicada. Una síntesis más barata puede abrir tareas nuevas (Acemoglu y Restrepo, 2019) y elevar el uso total, del mismo modo que un carbón más barato elevó el uso total de carbón (Jevons, 1865). Cada quehacer puede quedar saciado mientras la demanda total de quehaceres crece sin límite. Este rebote es el problema central de identificación del artículo. La Sección 5.1 enuncia dos hipótesis contrastables y los datos que las identificarían.

Un segundo hecho se refiere al precio, no a la física. Epoch AI informa de grandes descensos en el precio de un rendimiento de inferencia fijo (Epoch AI, 2025; Emberson y Roodman, 2026). Este artículo llama a la situación resultante gratuito en el margen, para quehaceres digitales cuyo resultado es información y cuya prueba de completitud es finita. La expresión no significa que los julios sean gratuitos, que una planta pueda moverse sin un certificado ni que el trabajo de cuidado haya quedado automatizado. La cota de Landauer es una cota inferior del borrado, no una descripción de los aceleradores actuales (Landauer, 1961; Horowitz, 2014).

El artículo no presenta un ensayo aleatorizado, ni una tasa de error de un detector de terminado, ni un reparto entre la energía gastada antes de la completitud y la gastada después. Esas mediciones están especificadas en la Sección 3.3 y están ausentes.

<div id="notation" class="anchor-alias" aria-hidden="true"></div>

## Notación

| Término | Definición en este artículo |
|------|--------------------------|
| Saciedad | En la teoría citada, una caída de la utilidad marginal a cero o por debajo. En la cláusula operativa de este artículo, tras la completitud, las llamadas posteriores no cambian ninguna cláusula de `C` de falsa a verdadera; las llamadas que deshacen `C` son daño, no valor (Sección 3.1). |
| Punto de dicha | Una canasta en la que una cantidad adicional del bien reduce la utilidad. Un objeto de manual. Aquí no se estima. |
| Finalización de la tarea | El evento en que el predicado de completitud se vuelve verdadero. Ortogonal a la escala del modelo. |
| Completitud del trabajo | Una parada de trabajo enunciada: ticket cerrado, parche fusionado, informe presentado, libro contable conciliado o una prueba escrita equivalente. |
| Completitud del cuidado | Una parada de cuidado enunciada: valoración terminada, medicación conciliada, parte receptora notificada, persona en un estado seguro o una prueba escrita equivalente. |
| Gratuito en el margen | El precio marginal de un paso de síntesis digital tiende a un precio monetario incluido en un paquete o despreciable. Los julios y las confirmaciones siguen siendo costosos. |
| Inteligencia artificial general (AGI) | Un objetivo amplio de capacidad. No es una observación de precios ni un resultado de este artículo. |
| Rebote directo | Uso adicional de un servicio cuando cae su precio efectivo, sobre el mismo servicio (Gillingham, Rapson y Wagner). |
| Modelado / simulado / medido en placa | Fórmula, ejecución de programa o medidor. Las cifras nuevas de este artículo no pertenecen a ninguna de las tres clases; su contenido empírico es la cita de series y documentos publicados. |

Alcance. La Sección 2 revisa la teoría de la saciedad, la automatización de tareas, los mercados de la atención, la evidencia sobre ciclos tecnológicos y los precios de la inferencia. La Sección 3 escribe los predicados y dice cuáles no se estimaron. La Sección 4 enumera las afirmaciones que se apoyan en citas, y las separa de las reglas de diseño. La Sección 5 responde sobre el rebote, los costes del cuidado y la demanda militar. La Sección 6 enumera las amenazas a la validez.

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>

## 1. Introducción

Una curva de demanda con pendiente positiva constante en «inteligencia» recomendará más licencias, más tokens y más agentes después de terminado un trabajo. Esa recomendación es una elección de modelización. No es un teorema sobre el trabajo. La teoría estándar del consumidor permite que la utilidad marginal disminuya y cruce el cero. Si un quehacer tiene un predicado de completitud, la pregunta relevante es si más salida del modelo cambia ese predicado. Si no lo cambia, la salida adicional es un coste sin incremento en el objetivo que se dejó por escrito.

La evidencia reciente de precios apunta en sentido contrario a la escasez de síntesis. Las series de Epoch muestran que el precio monetario de un rendimiento dado en un benchmark cae con rapidez. Los pesos abiertos y los procedimientos de decisión tipados, entre ellos System One, son vías adicionales por las que un paso de generación antes escaso se vuelve barato. Los equipos que tasan un quehacer cerrado como si la síntesis siguiera siendo escasa usan una restricción obsoleta.

Las restricciones que no se siguen de una serie de precios son físicas e institucionales. El cómputo disipa energía. Horowitz (2014) documenta que el movimiento de datos y la memoria dominan la energía práctica de CMOS, a escalas muy por encima de la cota ideal de borrado de Landauer. Un actuador no es un token. Una firma, un traspaso clínico y un pago no se revierten muestreando otro párrafo. Baumol (1967) mostró cómo los sectores con un crecimiento débil de la productividad pueden absorber una proporción creciente del gasto. Acemoglu y Restrepo (2019) modelan la automatización como desplazamiento de tareas más la posible creación de tareas nuevas. Ninguno de estos resultados dice que un modelo de lenguaje ponga fin a la enfermedad de los costes. Sí dicen que «más capacidad» no es una descripción suficiente del valor.

La afirmación positiva de este artículo es definicional y bibliográfica. La saciedad es un objeto coherente. Los precios publicados de la inferencia han caído bruscamente. Las métricas de interacción no son métricas de completitud. Una parada por «no gastar» y una parada por «no mover» son predicados distintos. La afirmación negativa es igual de importante. Este artículo no identifica un sistema de demanda estructural, no estima el rebote y no informa de energía medida.

<div id="2-related-work" class="anchor-alias" aria-hidden="true"></div>

## 2. Trabajo relacionado

<div id="21-satiation-and-bliss-points" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Saciedad y puntos de dicha

Andersen (2001) trata la saciedad dentro de un modelo evolutivo del cambio estructural, no como una preferencia verbal. El elemento duradero para este artículo es el económico: la valoración marginal de un bien puede llegar a cero. Los puntos de dicha de manual hacen explícita la geometría. Para una canasta `x*`, la utilidad no aumenta en una coordenada más allá de `x*`, y una representación suave puede tener ahí una utilidad marginal negativa. Una ilustración cuadrática, `U(x) = -a (x - x*)^2` para `a > 0`, tiene un máximo en `x*` y una derivada negativa más allá. Esa función es un modelo usado para enseñar la definición. No se ajusta a registros de agentes en este estudio. No se informa de ningún coeficiente `a`.

La traducción operativa requiere un predicado que el modelo no conoce a menos que alguien lo enuncie. Sea `C(z) = 1` cuando se cumple la prueba de completitud escrita para el episodio `z`, y 0 en caso contrario. La saciedad en ese episodio significa que existe un instante `t*` tal que `C` vale 1 en `t*` y, para todas las llamadas posteriores, ninguna cláusula de `C` cambia de falsa a verdadera. Las llamadas que deshacen `C` son daño, no valor. La Sección 3.1 enuncia la misma regla. El evento interno **terminado económico** ocurre cuando `C` pasa a valer 1; este artículo llama a ese evento finalización de la tarea. Esto es una definición. Solo se convierte en una afirmación empírica con un conjunto etiquetado de episodios y un detector cuyos errores se cuentan. La Sección 4 no contiene ese recuento.

Keynes trazó la misma línea en 1930. Dividió las necesidades en absolutas, que se sienten sea lo que sea lo que tengan los demás, y relativas, que se sienten porque satisfacerlas nos eleva por encima de los demás. Sostuvo que las necesidades absolutas podían cubrirse. El predicado de completitud es la necesidad absoluta de una tarea, puesta por escrito. Los deseos relativos y abiertos no tienen tal predicado, y la Sección 5.2 los deja fuera de la afirmación.

<div id="22-tasks-displacement-and-cost-disease" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Tareas, desplazamiento y enfermedad de los costes

Baumol (1967) analiza el crecimiento desequilibrado. Si la productividad de un sector aumenta y la de otro no, el coste relativo del sector estancado aumenta, y puede dominar el gasto aunque su cantidad crezca despacio. La sanidad, la educación y las artes escénicas son los ejemplos habituales. Artículos posteriores de economía de la salud discuten magnitudes y mecanismos. Este artículo usa a Baumol para una instrucción negativa: no inferir, a partir de una caída del precio del token, que el cuidado se ha convertido en un bien de software. El cuidado sigue dependiendo del tiempo, la confianza y la responsabilidad legal en el sentido institucional ordinario. Un modelo de documentación puede aumentar la actividad registrada, lo cual es una ambigüedad relevante para Baumol: la producción medida puede moverse mientras el predicado de cuidado no se mueve.

La literatura laboral asociada a David Autor descompone los empleos en tareas que las máquinas pueden o no realizar. El enunciado de referencia es Acemoglu y Restrepo (2019), «Automation and New Tasks: How Technology Displaces and Reinstates Labor», Journal of Economic Perspectives 33(2), https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3. Sostienen que el desplazamiento reduce la proporción de tareas del trabajo y que las tareas nuevas pueden restablecerla. Una parada orientada a la completitud está más cerca de terminar una tarea que de crear una nueva tarea de interacción. Un bucle de agente sin parada puede elevar las medidas de actividad sin ganancia de productividad. Esa posibilidad es coherente con su advertencia sobre la automatización débil.

<div id="23-attention-and-engagement" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Atención e interacción

El libro de Wu «The Attention Merchants» (página de la editorial: https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/) describe empresas que cosechan atención y la revenden. La visión general del Center for Humane Technology sobre la economía de la atención (https://www.humanetech.com/youth/the-attention-economy) es un resumen militante del mismo patrón, no un ensayo. La inferencia que se usa aquí es limitada. Si el objetivo de un producto es el tiempo dedicado a la tarea, una sesión que continúa después de `C = 1` puede parecer exitosa. Si el objetivo es `C`, la misma sesión es desperdicio o daño. Los dos objetivos no son observacionalmente equivalentes en un registro de tokens. Ningún experimento de este artículo estima la brecha de bienestar.

<div id="24-historical-cycles" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Ciclos históricos

Los mercados tecnológicos muestran a menudo una fase especulativa, una fase de uso y una fase posterior de mercancía. La evidencia es desigual.

Quinn (2019), «Technological revolutions and speculative finance: evidence from the British Bicycle Mania», Cambridge Journal of Economics 43(2), 271-294, https://doi.org/10.1093/cje/bey029, estudia los precios de las acciones de empresas de bicicletas de 1895 a 1900. Los precios subieron más del 200 por ciento y luego cayeron más del 75 por ciento. El resultado del artículo trata de la financiación especulativa y los fundamentos, no de un predicado medido de «bicicleta suficiente» para los hogares. Usarlo como imagen de la financiación en la fase de carrera está respaldado. Usarlo como prueba de saciedad en el transporte no lo está.

Los automóviles, la aviación regular y la televisión tienen mercados de tipo mercancía en el sentido cotidiano: vehículos usados, asientos gestionados por rendimiento y paneles vendidos como insumos para contenidos. Las filas sirven de orientación histórica. No son regresiones. La gestión del rendimiento de las aerolíneas tras la desregulación es una institución de precios para un asiento, lo cual es evidencia de un mercado de mercancía en asientos, no evidencia de que la demanda de viajes de los pasajeros esté saciada a escala global.

La ficha informativa sobre móviles del Pew Research Center (https://www.pewresearch.org/internet/fact-sheet/mobile/) es la fuente de saturación usada para los teléfonos. El archivo del proyecto registra una posesión de smartphones en EE. UU. cercana al 91 por ciento en las lecturas de las fichas de 2024 y 2025. Quien cite la cifra debería abrir la ficha en vivo, porque las fichas se revisan. Una posesión alta es evidencia de difusión. No es, por sí sola, evidencia de que el valor marginal de otra cámara de teléfono sea cero.

La fila del quehacer digital es la que este artículo defiende con una serie de precios en lugar de con una analogía. Véase la Sección 4.2.

<div id="25-inference-prices-and-open-weights" class="anchor-alias" aria-hidden="true"></div>

### 2.5 Precios de la inferencia y pesos abiertos

Epoch AI (2025), «LLM inference price trends», https://epoch.ai/data-insights/llm-inference-price-trends, informa de descensos de precio a rendimiento fijo del orden de 9 a 900 veces por año en los benchmarks de esa nota. Emberson y Roodman para Epoch AI (2026), «The plunging price of thought», https://epoch.ai/publications/the-plunging-price-of-thought, informan de un descenso de alrededor del 47 por ciento por trimestre en el coste de un rendimiento dado desde aproximadamente 2023, resumido como unas 13 veces por año, más rápido cerca de la frontera. Son los resúmenes de los autores sobre sus datos. Este artículo no vuelve a estimar el índice. La lectura económica es estrecha: el precio monetario de la síntesis para un rendimiento medido fijo ha caído deprisa. Un precio de oferta decreciente desplaza la cantidad demandada si la demanda es elástica. No crea un nuevo predicado de completitud, y no fija en cero el precio de la energía.

Las herramientas de la clase System One son relevantes como mecanismo de una rebaja adicional del precio en problemas de decisión con un conjunto de opciones conocido. Un modelo System One devuelve una respuesta tipada y una probabilidad para cada opción permitida en una sola pasada hacia delante, sin texto libre. TypeSafe AI dio nombre a la categoría con su modelo alojado Jev (15 de septiembre de 2026). Siguieron modelos abiertos, entre ellos Laya de Convai Innovations. Un modelo System One propone. No es una evaluación de completitud.

Una regla empírica de planificación según la cual la competencia de frontera llega a dispositivos más baratos en unos seis meses no es una constante medida en ninguna de las fuentes citadas aquí. La destilación, la cuantización y la inferencia por consulta de tablas (Ma et al., 2024; Wei et al., 2024) son mecanismos publicados por los que una competencia dada puede trasladarse a hardware más barato. La velocidad es una cuestión empírica para cada par de modelos.

<div id="26-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### 2.6 Coste físico

Landauer (1961) acota el borrado. Bennett (1973) muestra que el cómputo reversible puede evitar esa cota en teoría. Horowitz (2014) es el enunciado práctico para CMOS: la energía por operación y la energía del movimiento de datos fijan la restricción de diseño, muchos órdenes de magnitud por encima de `kT ln 2` para la lógica CMOS irreversible. A $T = 300$ K la cota es $k_B T \ln 2 \approx 2.87 \times 10^{-21}$ J por bit borrado, con $k_B = 1.380649 \times 10^{-23}$ J/K.

Goldman Sachs publicó una nota de análisis titulada «Gen AI: Too Much Spend, Too Little Benefit?» (https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit). La existencia de una nota importante del lado vendedor que cuestiona el gasto en infraestructura en relación con el beneficio es un hecho documental. Las cifras en dólares de la nota no se citan aquí, porque las estimaciones del lado vendedor no son una contabilidad científica de la energía.

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## 3. Definiciones y métodos

<div id="31-predicates" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Predicados

Sea un episodio una secuencia de llamadas a modelos o herramientas `z_1, ..., z_T` junto con un estado orientado a las personas. Un predicado de completitud `C` asigna al prefijo del episodio un valor en `{0, 1}`. Ejemplos que pueden escribirse sin una puntuación de modelo:

- Trabajo: las pruebas pasan y el cambio está fusionado; o la discrepancia del libro contable es cero; o los campos obligatorios de un informe están rellenados y el informe está presentado.
- Cuidado: la lista de medicación coincide con la fuente, el clínico receptor tiene la nota y los elementos de la lista de seguridad que la institución marcó como críticos son verdaderos.

`C` no es una probabilidad. Un detector que produce una puntuación necesita todavía un umbral y una tabla de errores antes de ser un predicado en el sentido del experimento ausente de la Sección 4.

El evento interno **terminado económico** en el instante `t*` significa `C = 0` en el prefijo anterior a `t*` y `C = 1` en `t*`, para la prueba elegida. Este artículo llama a la capa del catálogo **finalización de la tarea**. La saciedad relativa a las llamadas al modelo significa que para todo `t > t*`, las llamadas adicionales no cambian ninguna cláusula de `C` de falsa a verdadera. Las llamadas que deshacen `C` son daño, no valor. La definición no dice que las personas siempre conozcan `t*`. Dice que, si no se ha escrito ningún `C`, la afirmación de saciedad todavía no es un enunciado sobre ese producto.

Gratuito en el margen es un enunciado sobre el precio monetario. Sea `p_t(q)` el precio del servicio de síntesis `q` en la fecha `t`. La evidencia de precios archivada es que `p_t` para un rendimiento fijo en un benchmark ha caído a las tasas que informa Epoch. Gratuito en el margen significa que `p_t` es lo bastante bajo para que una licencia por puesto explique débilmente el coste de ese quehacer. No significa que la integral de la potencia en el tiempo sea cero.

Por tanto, una regla de parada puede tener dos tipos de motivo: económico (el predicado se cumple, o se alcanza un límite de presupuesto o de política) y físico (se alcanza un límite de seguridad o de energía). Los dos tipos son predicados distintos y deben registrarse como motivos distintos.

<div id="32-what-was-done-in-this-study" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Qué se hizo en este estudio

Este estudio es una lectura estructurada. Las fuentes son la columna de citas comprobada en el proyecto del 29 al 30 de septiembre de 2026 y las notas sobre saciedad. La Sección 3.3 nombra las mediciones que harían empírica la definición operativa.

Las reglas de diseño de la Sección 4.10 son recomendaciones condicionadas a las definiciones. No son efectos de tratamiento estimados. Un lector puede rechazar una regla sin rechazar la serie de precios de Epoch, y puede aceptar la serie de precios sin aceptar una recomendación de producto.

<div id="33-measurements-specified-and-not-taken" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Mediciones especificadas y no realizadas

**El predicado es endógeno.** Witt (2001) sostiene que los deseos se aprenden, de modo que el predicado de completitud $C(z)$ puede ir subiendo a medida que cae el precio. Un estudio de la saciedad a través de un cambio de precio debe por tanto congelar $C(z)$ en su prerregistro antes del cambio e informar de cualquier cambio del predicado como un tratamiento aparte.

**H1 puede leerse ya en datos públicos.** Chen y colaboradores (2024) miden los tokens gastados después de la primera respuesta correcta; Cuadron y colaboradores (2025) puntúan el exceso de reflexión en trayectorias de agentes; Bai, Huang y Wang (2026) encuentran que el uso de tokens para una misma tarea en la programación agéntica varía hasta 30 veces entre ejecuciones. Aplicar a posteriori el $C(z)$ de este artículo a esas trayectorias da una estimación exploratoria de H1, etiquetada como exploratoria. Es la próxima medición.

**Tokens y julios.** H1 y H2 se enuncian en tokens; la tesis está en julios. Masanet y colaboradores (2020) encontraron que el cómputo de los centros de datos creció unas seis veces de 2010 a 2018 mientras la energía subía mucho menos, así que una elasticidad en tokens no es una elasticidad en energía. Cada hipótesis debe informarse en ambas unidades, nombrando la unidad que identifican los datos.

1. Cuenta dividida. Para cada episodio, sumar la energía analítica o, más adelante, medida en placa de las llamadas con `t <= t*` y de las llamadas con `t > t*`. El rebote directo sobre ese quehacer solo es visible si se estima la integral posterior al terminado. El repositorio no contiene esta división.
2. Errores del detector. En un corpus etiquetado, falso terminado (predicado declarado verdadero cuando una cláusula es falsa) y falso continuar (`C` verdadero y el sistema sigue llamando). Aquí no se publican tasas.
3. Traspaso de cuidado. Tiempo hasta el estado seguro y una lista de traspaso, contrastados con la duración de la sesión. No medido.
4. Tabla de segmentos. Qué productos tienen un `C` corto y cuáles son investigación abierta o carreras adversariales. No estimada. El caso militar se excluye de la afirmación de saciedad en la Sección 5 en lugar de forzarlo dentro de ella.
5. Energía medida. Un medidor de potencia externo sobre una carga de trabajo enunciada. No realizada.

Mientras no existan, las frases sobre «julios de exceso» son hipótesis. Las frases sobre los precios de Epoch son citas.

<div id="34-illustrative-episodes-not-data" class="anchor-alias" aria-hidden="true"></div>

### 3.4 Episodios ilustrativos, no datos

Mesa de soporte. Completitud: el problema del cliente está resuelto, la respuesta está enviada y el estado del ticket es Done. Los borradores adicionales no cambian `C`. Un contador de tokens puede seguir aumentando. El episodio es un ejemplo construido para mostrar las variables. No es una muestra de un servicio de asistencia.

Traspaso de cuidado. Completitud: campos críticos rellenados, lista de medicación conciliada, parte receptora confirmada, persona en un estado seguro. La duración de la sesión es otra variable. El episodio es construido. No se analizó ningún conjunto de datos hospitalario.

Quehacer de programación. Completitud: el artefacto coincide con un oráculo escrito (pruebas, o una comprobación bit a bit). Regenerar un artefacto que ya pasa no eleva `C`.

<div id="28-fidelity-criteria-and-stop-rules" class="anchor-alias" aria-hidden="true"></div>

<div id="36-fidelity-criteria-and-stop-rules" class="anchor-alias" aria-hidden="true"></div>

### 3.6 Criterios de fidelidad y reglas de parada

Shannon (1959) define una función de tasa-distorsión: la menor tasa de descripción que mantiene la distorsión esperada en o por debajo de una fidelidad elegida. El objeto es la comunicación bajo una restricción que enuncia el usuario. No es una curva de demanda de inteligencia. El parecido con este artículo es solo estructural. Un predicado de completitud `C` es una fidelidad dura: o se cumplen las cláusulas enunciadas o no se cumplen. Una pérdida de un modelo de lenguaje se parece más a una distorsión media sobre una distribución de entrenamiento. Una pérdida decreciente, y un precio decreciente a benchmark fijo, pueden leerse como un movimiento a lo largo de una curva tasa-recurso del tipo que Kaplan et al. (2020) y Hoffmann et al. (2022) estiman para el entrenamiento. Ese movimiento no elige `C` para un quehacer concreto. Confundir la distorsión del benchmark con la completitud del quehacer es el error de categoría que hay detrás de los planes de licencias ilimitadas para trabajo cerrado.

Cover y Thomas (2006) es la vía de manual hacia la tasa-distorsión si el lector quiere el desarrollo formal. El artículo usa la existencia del concepto de fidelidad para mantener separados dos números: una puntuación que siempre puede mejorarse en una fracción y un predicado que ya es verdadero.

<div id="29-rebound-taxonomy-without-a-new-estimate" class="anchor-alias" aria-hidden="true"></div>

<div id="37-rebound-taxonomy-without-a-new-estimate" class="anchor-alias" aria-hidden="true"></div>

### 3.7 Taxonomía del rebote, sin una nueva estimación

El canon del rebote es el marco para H2. Khazzoom (1980) mostró que la eficiencia obligatoria puede aumentar el uso del servicio, Brookes (1990) sostuvo lo mismo a escala de la economía y Saunders (1992) derivó las condiciones en el crecimiento neoclásico. Sorrell y Dimitropoulos (2008) dieron las definiciones microeconómicas y sus límites. Brockway, Sorrell, Semieniuk, Heun y Court (2021) revisaron la evidencia y encontraron que el rebote de toda la economía puede erosionar más de la mitad del ahorro de energía esperado. La saciedad de la tarea no contradice ese hallazgo. Es una parada por tarea, y el rebote agregado de H2 es donde se aplica la evidencia del canon. La iluminación es el caso histórico con el que contrastarla: Fouquet y Pearson (2006) siguen siete siglos del precio y el uso de la luz en el Reino Unido, y Tsao y colaboradores (2010) encuentran que el uso de la luz aumentó con la eficiencia, un servicio saciable con un gran rebote.

La revisión del rebote de Gillingham, Rapson y Wagner separa canales que un solo eslogan funde. El rebote directo es el uso adicional del mismo servicio cuando cae su coste efectivo. El rebote indirecto es el gasto de los recursos ahorrados en otros servicios. El rebote de toda la economía pasa por los precios y el crecimiento. El ámbito de política de la revisión es la eficiencia energética, no los tokens. Aun así, la taxonomía se transfiere como advertencia sobre la identificación. Una caída medida de `p_t` (afirmación S-2) no identifica por sí sola ninguno de los tres canales. El rebote directo sobre un quehacer con `C` ya verdadero requiere que los compradores sigan pagando llamadas que no cambian `C`. Los canales indirecto y de toda la economía pueden ser grandes cuando aparecen tareas nuevas (Acemoglu y Restrepo, 2019). Un artículo que informara de una sola elasticidad y la llamara «el rebote» estaría infraespecificado. Este artículo no informa de ninguna elasticidad.

El patrón es antiguo. Jevons sostuvo en 1865 que máquinas de vapor más eficientes elevarían, y no reducirían, el uso total de carbón de Gran Bretaña. Alcott sigue ese argumento y el debate posterior (*Ecological Economics* 54(1), 2005). Nordhaus midió el precio del cómputo durante más de un siglo y encontró que caía muchos órdenes de magnitud mientras el cómputo total aumentaba (*Journal of Economic History* 67(1), 2007). Las cargas de trabajo de agentes ya muestran el lado del uso. El equipo de ingeniería de Anthropic informó, para su propio sistema, de que los agentes usan unas 4 veces los tokens de una interacción de chat y los sistemas multiagente unas 15 veces (13 de junio de 2025). Esa cifra la informa el operador, no está auditada. Es coherente con un apetito por tarea que crece a medida que las tareas cambian de forma, que es exactamente lo que la cuenta dividida de la Sección 3.3 debe separar del desperdicio posterior a la finalización.

<div id="210-scarce-joules-and-the-economic-stop-20252026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="210-scarce-joules-and-the-economic-stop-2025-to-2026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="38-scarce-joules-and-the-economic-stop-2025-to-2026-peers" class="anchor-alias" aria-hidden="true"></div>

### 3.8 Julios escasos y la parada económica (trabajos de 2025 a 2026)

Las series de precios de Epoch (S-2) muestran que la síntesis se abarata en dinero. Las publicaciones recientes sobre energía muestran que los julios siguen siendo escasos, y que a menudo crecen en el agregado.

Chung, Wu, Ma y Chowdhury (arXiv:[2601.22076](https://arxiv.org/abs/2601.22076), 2026) diagnostican la energía de la inferencia en 1,858 configuraciones: el tipo de tarea por sí solo puede mover la energía de un LLM por respuesta unas 25×; la generación de vídeo puede superar la energía de una imagen en dos órdenes de magnitud. El artículo de *Joule* «Energy use of AI inference, efficiency pathways, and test-time scaling» ([cell.com/joule/fulltext/S2542-4351(26)00114-5](https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5), en línea el 22 de abr. de 2026) estima consultas optimizadas a escala de frontera en un rango mediano por debajo del vatio-hora, a la vez que informa de que el razonamiento largo y las consultas agénticas pueden elevar la energía en más de un orden de magnitud; las ganancias de eficiencia de 8 a 20× están a la vista, no son julios gratuitos. Luccioni, Strubell y Crawford (FAccT 2025) ([doi:10.1145/3715275.3732007](https://doi.org/10.1145/3715275.3732007)) advierten de que la eficiencia sin una parada puede amplificar el gasto total (Jevons). La visión general sobre energía de Epoch AI ([epoch.ai/publications/ai-energy](https://epoch.ai/publications/ai-energy), actualizada en jul. de 2026) separa los modestos costes por consulta de la potencia agregada de los centros de datos, que se duplica con rapidez.

**Lectura para este artículo.** Gratuito en el margen es un enunciado sobre el precio monetario. Los julios escasos son un enunciado físico. La parada operativa es la finalización de la tarea: cuando `C(z) = 1`, más síntesis no eleva el objetivo escrito, y una parada por motivos de presupuesto o de política es un éxito. Las estimaciones no son energía medida.

<div id="36-protocol-for-a-done-detector-study-not-executed" class="anchor-alias" aria-hidden="true"></div>

<div id="39-protocol-for-a-done-detector-study-not-executed" class="anchor-alias" aria-hidden="true"></div>

### 3.9 Protocolo para un estudio del detector de terminado (no ejecutado)

El protocolo siguiente es un método para una medición futura. No se ha ejecutado ningún paso. Está escrito para que el resultado que falta tenga un criterio de salida en lugar de un eslogan.

Población. Episodios extraídos de una sola superficie de producto, no una mezcla de investigación abierta y cierre de tickets. Cada episodio tiene un `C` escrito con un número finito de cláusulas, cada una observable por una persona que no operó el modelo. El tamaño objetivo es una decisión de diseño; este artículo no finge que se haya hecho un cálculo de potencia. Una primera tabla utilizable necesita suficientes positivos y negativos para que una tasa no sea una sola anécdota. El archivo no contiene esa tabla.

Etiqueta. Dos anotadores marcan cada cláusula como verdadera o falsa en el momento en que el sistema declara por primera vez que ha terminado, y de nuevo al final de la sesión. Los desacuerdos se resuelven y se cuentan. La decisión del detector se registra por separado de la etiqueta.

Tasas primarias.

- Falso terminado: el sistema declara `C = 1` mientras alguna cláusula crítica es falsa.
- Falso continuar: todas las cláusulas críticas son verdaderas y el sistema emite más llamadas a modelos o herramientas.
- La duración de la sesión y el número de llamadas son covariables, no criterios de valoración.

División secundaria, solo si existe una contabilidad de energía. Sumar la energía, analítica o medida en placa, de las llamadas anteriores y posteriores al `t*` resuelto. Enunciar la clase de medición en la misma frase que el número. Un total analítico del OpCounter no sustituye a un medidor y no es comparable con las tablas de Horowitz.

Exclusión. Los episodios sin un `C` escrito no se etiquetan como «no saciados». Quedan fuera del alcance. Los episodios adversariales quedan fuera del alcance del criterio de saciedad y aun así pueden puntuarse por rechazo físico si hay un certificado.

Fallo del protocolo. Si los anotadores no pueden ponerse de acuerdo sobre las cláusulas, el predicado no estaba escrito. Si el sistema no tiene un evento de declarar terminado, el falso continuar no está identificado. Publicar una clasificación de modelos en lugar de las dos tasas no ejecutaría este protocolo.

<div id="37-a-numerical-illustration-of-a-bliss-point-model-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

<div id="310-a-numerical-illustration-of-a-bliss-point-model-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

### 3.10 Una ilustración numérica de un punto de dicha (modelo, no ajuste estadístico)

Sea una coordenada `x` el número de llamadas al modelo en un solo quehacer, y sea

```text
U(x) = -(x - 4)^2
```

para un quehacer cuyo máximo construido está en cuatro llamadas. Entonces `U(0) = -16`, `U(4) = 0`, `U(8) = -16`. La utilidad marginal es `dU/dx = -2(x - 4)`, que es positiva antes de 4, cero en 4 y negativa después. La ilustración usa enteros para que el cambio de signo sea visible sin un ajuste estadístico. No se usó ningún conjunto de datos para elegir 4. Sustituir 4 por otro entero desplaza el pico y no cambia la definición. Una métrica de producto igual a `x` sitúa `x = 8` por encima de `x = 4`. Una métrica de producto igual a `U` hace lo contrario. La afirmación S-3 es esta no identidad, aquí en una función de juguete completamente especificada y en la Sección 3.4 en episodios construidos. Ninguna de las dos es una estimación de bienestar para una empresa.

Puede añadirse un precio del token sin confundir unidades. Supongamos que una llamada cuesta `p` en dinero y que el comprador paga `p * x` mientras el valor sigue a `U`. El indicador aproximado del excedente del comprador `U(x) - p x` sigue teniendo un maximizador finito para cualquier `p >= 0`. Una caída de `p` desplaza el maximizador, que es la lógica del rebote en este juguete, y el maximizador sigue siendo finito. El juguete no dice dónde está el maximizador para ningún comprador real. Bloquea la inferencia de que un `p` menor elimina el máximo.

La Figura 1 dibuja el modelo de juguete y la afirmación agregada, que es aparte.

![Izquierda: ilustración de modelo de un punto de dicha. El valor U de x es igual a menos x menos 4 al cuadrado, con excedente U menos p x a precios 0, 2 y 4; los maximizadores son 4, 3 y 2 llamadas, finitos a todo precio. Derecha: un esquema del rebote agregado, en el que precios más bajos abren más tareas, cada una de las cuales sigue deteniéndose en su propio predicado.](/figures/satiation/satiation-rebound.svg)

*Figura 1. Saciedad de la tarea y rebote agregado. Ilustración de modelo del ejemplo de juguete de esta sección, no un ajuste estadístico: el maximizador de $U(x) - p\,x$ es $x = 4 - p/2$, finito a todo precio. El panel derecho es un esquema; este artículo no estima ningún rebote. Se ofrece una [copia PNG](/figures/satiation/satiation-rebound.png).*

<div id="38-reason-codes-as-a-partition-not-a-welfare-function" class="anchor-alias" aria-hidden="true"></div>

<div id="311-reason-codes-as-a-partition-not-a-welfare-function" class="anchor-alias" aria-hidden="true"></div>

### 3.11 Los códigos de motivo como partición, no como función de bienestar

Sea `R` el conjunto de códigos de rechazo en una traza. Se particiona `R` en `R_econ = {policy, budget_exceeded}` y `R_phys = {lut_veto, energy_veto, cbf_veto}`, de acuerdo con la taxonomía del esquema. Otros códigos, si se añaden más adelante, deben asignarse por escrito antes de contarse. Un intervalo de la traza contribuye al rechazo económico posterior al terminado solo si `C` ya vale 1 y el código está en `R_econ`. Contribuye al rechazo físico si el código está en `R_phys`, valga o no `C` 1. Una acción insegura después del terminado está en ambas historias y debería contarse en ambas columnas, no promediarse. El rechazo irreversible de la demostración MCP es un ejemplo físico: códigos de energía y de barrera, 0 llamadas al ejecutor. No es un ejemplo de `R_econ`. Un episodio futuro con `policy` después de un parche fusionado sería el ejemplo económico. El repositorio no incluye ese episodio. La partición es la manera en que se puntuaría.

<div id="4-evidence" class="anchor-alias" aria-hidden="true"></div>

## 4. Evidencia

<div id="41-claim-s-1-satiation-is-a-defined-economic-object" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Afirmación S-1. La saciedad es un objeto económico definido

Andersen (2001), https://doi.org/10.1007/PL00003852, y la construcción de manual del punto de dicha de la Sección 2.1 respaldan S-1. La afirmación es teórica. No es una función de utilidad medida para ninguna población de usuarios en este estudio.

<div id="42-claim-s-2-published-inference-prices-fell-sharply-at-fixed-performance" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Afirmación S-2. Los precios publicados de la inferencia cayeron bruscamente a rendimiento fijo

Respaldada por Epoch AI (2025) y Emberson y Roodman (2026), con las magnitudes que esas notas enuncian (Sección 2.5). La afirmación trata de índices de precios que esos autores publican. No afirma que la factura de cada organización haya caído 13 veces, y no es una afirmación sobre vatios.

<div id="43-claim-s-3-engagement-variables-are-not-the-completeness-predicate" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Afirmación S-3. Las variables de interacción no son el predicado de completitud

Respaldada por las definiciones de la Sección 3.1 y por la descripción que hace la literatura sobre la atención de los objetivos de tiempo dedicado a la tarea (Wu; visión general del Center for Humane Technology). No se reivindica ninguna estimación causal de pérdida de bienestar. La afirmación lógica es la no identidad de las variables: el número de tokens puede aumentar mientras `C` se mantiene constante. Los episodios construidos de la Sección 3.4 ilustran la no identidad, no son conjuntos de datos.

<div id="44-claim-s-4-bicycle-mania-prices-detached-from-a-simple-fundamental-story" class="anchor-alias" aria-hidden="true"></div>

### 4.4 Afirmación S-4. Los precios de la manía de las bicicletas se separaron de una historia simple de fundamentos

Respaldada por Quinn (2019): subidas de más del 200 por ciento y caídas posteriores de más del 75 por ciento en las acciones de bicicletas, de 1895 a 1900, no explicadas del todo por los fundamentos ni por un simple desplazamiento del riesgo en las pruebas de ese artículo. La afirmación se detiene ahí. No cuantifica la saciedad de los hogares en bicicletas.

<div id="45-claim-s-5-us-smartphone-ownership-is-high-in-the-cited-fact-sheet" class="anchor-alias" aria-hidden="true"></div>

### 4.5 Afirmación S-5. La posesión de smartphones en EE. UU. es alta en la ficha citada

La lectura que hace el archivo del proyecto de la ficha sobre móviles de Pew es una posesión cercana al 91 por ciento en las filas de 2024 y 2025. La afirmación que usa este artículo es una difusión de ese orden, condicionada a que la ficha en vivo coincida con el archivo. Es un hecho de saturación sobre la posesión, no una estimación de un punto de dicha.

<div id="46-claim-s-6-care-is-not-priced-as-a-pure-software-good-by-the-baumol-framework" class="anchor-alias" aria-hidden="true"></div>

### 4.6 Afirmación S-6. El marco de Baumol no tasa el cuidado como un bien de software puro

Baumol (1967) aporta el marco. Acemoglu y Restrepo (2019) aportan el lenguaje de las tareas. La afirmación es que estos marcos no implican el fin de los requisitos de trabajo, confianza o responsabilidad legal del cuidado cuando caen los precios de los tokens. La afirmación no es una previsión del gasto sanitario.

<div id="47-claim-s-7-a-sell-side-note-questions-spend-versus-benefit" class="anchor-alias" aria-hidden="true"></div>

### 4.7 Afirmación S-7. Una nota del lado vendedor cuestiona el gasto frente al beneficio

La página de Goldman Sachs mencionada en la Sección 2.6 existe y plantea la pregunta en su título.

<div id="49-claim-s-9-physical-law-is-not-priced-to-zero-by-epoch" class="anchor-alias" aria-hidden="true"></div>

### 4.9 Afirmación S-9. Epoch no tasa a cero la ley física

Landauer (1961) y Horowitz (2014) respaldan una brecha permanente entre una cota ideal de borrado y la práctica CMOS. S-9 dice solo que una cita de Epoch no sustituye a una cita de Landauer.

<div id="410-design-rules-marked-as-design" class="anchor-alias" aria-hidden="true"></div>

### 4.10 Reglas de diseño, marcadas como diseño

Estas reglas se siguen si se aceptan las definiciones y se quiere un producto que optimice `C` y no los tokens. No son efectos.

1. Escribir `C` antes de añadir capacidad de modelo.
2. Tratar como temporal una prima de precio de la síntesis cuando las series del tipo de Epoch y los pesos abiertos se aplican a ese quehacer.
3. No describir como energía medida la energía modelada o simulada.
4. Preferir un detector de `C` con una tabla de errores a un aumento sin etiquetar del tamaño del modelo, una vez que el quehacer es el producto.
5. Exigir una comprobación de seguridad física separada antes de cualquier acción irreversible.
6. Informar por separado de la energía anterior y posterior al terminado cuando exista la división. Todavía no existe.
7. No aplicar el predicado de saciedad a carreras adversariales o militares (Sección 5.3).
8. Si el objetivo del producto es la atención, decirlo. Las afirmaciones de completitud no se aplican entonces.

Pruebas eliminatorias para una hoja de ruta, también de diseño: un plan que supone un apetito ilimitado por un quehacer con un `C` corto; un precio que requiere una escasez permanente de síntesis y ninguna cuña física ni de responsabilidad legal; una historia de seguridad que usa solo una cadena de confianza; una afirmación de «gratuito» que borra los julios; un bucle de agente sin `C`.

<div id="411-what-would-be-a-result-and-is-not" class="anchor-alias" aria-hidden="true"></div>

### 4.11 Qué sería un resultado y no lo es

Una tabla de tasas de falso terminado y falso continuar. Una serie temporal de llamadas después de `t*`. Una lectura de medidor de la energía sobre una carga de trabajo enunciada. Una estimación estructural del rebote. Una prima de precio de AGI estimada sobre un quehacer saciado. Nada de esto aparece entre las afirmaciones respaldadas de la Sección 4.

<div id="412-non-identity-stated-as-a-comparison-of-objectives" class="anchor-alias" aria-hidden="true"></div>

### 4.12 La no identidad, enunciada como comparación de objetivos

Sea `x` el número de llamadas, `s` la duración de la sesión, `J_pre` y `J_post` la energía antes y después del terminado resuelto, y `C` el predicado. Las implicaciones siguientes son definicionales.

| Observación | No implica |
|-------------|----------------|
| `x` aumentó | `C` aumentó |
| `s` aumentó | el bienestar aumentó |
| `p` cayó (S-2) | `J_post = 0` |
| `C = 1` | se conoce la tasa de error del detector |
| la posesión de teléfonos es alta (S-5) | el valor marginal de otra llamada al modelo es cero |
| los precios de las acciones de bicicletas tuvieron auge y caída (S-4) | los hogares alcanzaron un punto de dicha en el transporte |

La columna de la derecha es la lista de inferencias que este artículo rechaza. Cada observación de la izquierda es una cita de la Sección 4 o una variable de la Sección 3. La tabla es la discusión comprimida en una comprobación. Una frase que afirma una afirmación de la derecha ha abandonado la evidencia.

<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>

## 5. Discusión

<div id="51-rebound-the-central-identification-problem" class="anchor-alias" aria-hidden="true"></div>

### 5.1 El rebote: el problema central de identificación

Tres resultados limitan el experimento natural. Gundlach y colaboradores (2025) encuentran que los precios a rendimiento fijo en un benchmark caen deprisa mientras que los precios de frontera no, y Du (2026) encuentra una ruptura estructural y una prima por razonamiento en la evolución de los precios, de modo que las rebajas llegan junto con cambios de modelo. El Economic Index de Anthropic (septiembre de 2025) informa de que, entre tareas, cada aumento del 1% en el coste se asocia con un descenso del 0.29% en la frecuencia de uso, una cifra transversal inelástica, no un cambio de precio en el tiempo. Un diseño a nivel de proveedor no puede identificar el rebote a nivel de mercado; el diseño necesita precios y cantidades a nivel de mercado.

Gillingham, Rapson y Wagner revisan el rebote de las políticas de eficiencia energética. El mecanismo es la elasticidad residual de la demanda. Si cae el precio monetario de la síntesis, el uso aumenta allí donde los compradores siguen valorando otra unidad. En un punto de dicha para un quehacer cerrado, la derivada directa del valor respecto de más síntesis sobre ese quehacer no es positiva, así que el rebote directo sobre ese quehacer no está implicado. El rebote indirecto, las tareas nuevas y los desplazamientos de la atención pueden persistir. El margen de tareas nuevas de Acemoglu y Restrepo es un lugar por donde la cantidad puede reaparecer. Por tanto, la afirmación S-2 no implica un tope global al cómputo. Implica un tope solo respecto de un `C` enunciado. Negar el rebote global requeriría la división de la Sección 3.3 y un sistema de demanda. Este artículo no niega el rebote global. Se niega a tratar «Jevons» como una razón para no escribir `C`.

Dos hipótesis hacen contrastable la cuestión.

- **H1. Gasto posterior a la finalización.** La fracción del cómputo de agentes gastada después de `C(z) = 1`, julios o llamadas con `t > t*` sobre el total de julios o llamadas del episodio, está mensurablemente por encima de cero. H1 es el desperdicio directo que elimina la parada por completitud. Es estimable a partir de registros de agentes con un `t*` etiquetado por episodio (Sección 3.3, punto 1).
- **H2. Jevons en tareas.** H2 es la elasticidad del rebote directo de Khazzoom (1980), enunciada para tareas. Cuando cae el precio de la síntesis, la elasticidad del número de tareas ejecutadas supera la caída del gasto por tarea. Entonces el gasto total aumenta aunque cada tarea esté saciada. H2 es rebote agregado.

**Identificación.** H1 no necesita variación de precios: un corpus etiquetado, las tasas de error del detector de la Sección 3.3, punto 2, y la cuenta dividida. H2 necesita cambios de precio exógenos. Las rebajas de precio de los proveedores a calidad de modelo fija, anunciadas en una fecha conocida, son experimentos naturales. El diseño es un panel de cuentas con el precio pagado, las tareas abiertas, las llamadas por tarea y una etiqueta de completitud por episodio, antes y después de cada rebaja. Comparar cuentas en un modelo con nuevo precio con cuentas en modelos cuyo precio no se movió da una estimación de diferencias en diferencias de la elasticidad del número de tareas y de la respuesta del gasto por tarea por separado. El gasto por tarea puede caer mientras el número de tareas sube. Se necesitan ambos números. La parada por completitud es una afirmación sobre el primero. Jevons es una afirmación sobre el segundo. Ninguno se estimó aquí.

<div id="52-status-and-creative-goods" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Bienes de estatus y creativos

Algunos bienes se valoran porque no están terminados: el estatus, el arte abierto, la investigación cuyo `C` no es una lista finita. La definición de la Sección 3.1 no impone un punto de dicha a esos bienes. Impone una segmentación. Un quehacer finito y una práctica abierta pueden venderlos la misma empresa y no deberían compartir un supuesto de demanda. Tasar un quehacer finito como si fuera una carrera abierta de capacidad es un error de categoría, no un hallazgo sobre la AGI.

<div id="53-adversarial-demand" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Demanda adversarial

Si la ganancia de la otra parte es la pérdida de esta, «suficiente» no se define con una lista local. Las carreras armamentistas y algunas competiciones de seguridad están en esa clase. Las restricciones físicas de confirmación pueden seguir aplicándose: una acción insegura puede rechazarse mientras la demanda estratégica sigue abierta. El alcance forma parte de la afirmación, no es una nota al pie que la anule.

<div id="54-incomplete-knowledge-of-done" class="anchor-alias" aria-hidden="true"></div>

### 5.4 Conocimiento incompleto del terminado

Las personas juzgan mal la finalización. Los detectores producirán falsos terminados y falsos continuar. Ese es un argumento para medir el error del detector, que la Sección 3.3 enumera como ausente. No es un argumento para que la duración de la sesión sustituya a `C` en un ámbito en el que un traspaso omitido tiene una parte responsable. Donde no puede escribirse ningún predicado, la afirmación operativa de este artículo guarda silencio.

<div id="55-baumol-is-not-solved" class="anchor-alias" aria-hidden="true"></div>

### 5.5 Baumol no está resuelto

Un modelo que redacta una nota más deprisa puede elevar el rendimiento en notas y dejar el examen, el juicio y la responsabilidad en manos de una persona. Las proporciones del gasto pueden seguir moviéndose como describió Baumol si el residuo humano no se acelera. Decir lo contrario sería una previsión que esta bibliografía no contiene. El enunciado permitido es S-6.

<div id="56-free-synthesis-is-not-free-actuation" class="anchor-alias" aria-hidden="true"></div>

### 5.6 La síntesis gratuita no es actuación gratuita

Que caiga el precio monetario de la inferencia no dice nada sobre la energía necesaria para mover un sistema físico. Mover una masa $m$ a través de un cambio de velocidad $\Delta v$ desde el reposo requiere al menos $\tfrac12 m (\Delta v)^2$ julios de trabajo, sea cual sea el precio de la instrucción que lo ordenó. Los precios de Epoch están en un eje distinto del de ese trabajo. Fundirlos en «IA gratuita» borra la clase de medición.

<div id="57-confidence-is-not-a-certificate" class="anchor-alias" aria-hidden="true"></div>

### 5.7 La confianza no es un certificado

Una puntuación alta de un modelo puede ordenar propuestas. No es un predicado de completitud: una puntuación necesita un umbral y una tabla de errores (tasas de falsos y verdaderos positivos frente a un conjunto etiquetado) antes de decidir `C`.

<div id="58-sell-side-skepticism-is-not-a-measurement" class="anchor-alias" aria-hidden="true"></div>

### 5.8 El escepticismo del lado vendedor no es una medición

S-7 impide que una revisión de la literatura ignore una duda pública importante sobre el gasto y el beneficio. No permite que una nota de análisis sustituya a un medidor o a una estimación de la demanda. Si más adelante se citan las cifras de la nota, la fuente debe ser el PDF primario, y la etiqueta es estimación del lado vendedor.

<div id="59-what-a-structural-demand-estimate-would-require" class="anchor-alias" aria-hidden="true"></div>

### 5.9 Qué requeriría una estimación estructural de la demanda

S-2 es un hecho sobre el precio de oferta procedente de series publicadas secundarias. Una estimación de la demanda es una regresión distinta. Como mínimo necesita una cantidad (llamadas, tareas cerradas o ambas), un precio y una forma de separar el movimiento a lo largo de una curva de demanda del desplazamiento de la curva. El precio de benchmark de Epoch no es una factura a nivel de empresa, y la factura de una empresa no es `C`. Vincularlos requiere un panel que este estudio no tiene: cuentas que registren el precio pagado, las llamadas hechas y una etiqueta de completitud resuelta sobre el mismo episodio. Sin ese panel, la pendiente de la demanda después de `t*` no está identificada. El excedente de juguete de la Sección 3.10 muestra solo que un punto de dicha cuadrático mantiene un óptimo finito cuando `p` cae. No es la regresión que falta.

La segmentación pertenece al mismo diseño. Codificar cada producto como `C` finito o abierto antes de agrupar. Agrupar una mesa de tickets con una herramienta de investigación abierta promedia dos regímenes de demanda y puede fabricar una apariencia de apetito ilimitado. La exclusión militar de la Sección 5.3 es la misma regla aplicada a un ámbito en el que el objetivo del oponente impide un punto de dicha local. Una tabla con esos códigos, incluso sin precios todavía, sería más informativa que una sola cifra de mercado total direccionable. La tabla no se construyó.

<div id="510-why-no-multiple-of-kt-ln-2-is-stated" class="anchor-alias" aria-hidden="true"></div>

### 5.10 Por qué no se enuncia ningún múltiplo de `kT ln 2`

El resultado de Landauer es una desigualdad para un borrado idealizado a temperatura `T`. Horowitz (2014) informa de energías para operaciones CMOS concretas y para el tráfico de memoria, en picojulios, bajo los supuestos de ese tutorial. Dividir una por otra produce un número solo después de que alguien elija la operación, el factor de actividad, la temperatura y el dispositivo. Ninguna de esas elecciones se mide en este artículo. Enunciar un múltiplo por encima de la cota de Landauer fingiría que esas elecciones se hicieron. El enunciado científico es la dirección de la desigualdad: el CMOS irreversible práctico, en el relato de Horowitz, se sitúa muy por encima de la cota, y un índice de precios no lleva a ningún dispositivo hasta la cota.

<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## 6. Límites y amenazas a la validez

Validez de constructo. La saciedad operativa depende de `C`. Un `C` hostil o vago vuelve arbitrario el predicado. La defensa del artículo es exigir que `C` se escriba en cláusulas observables. Muchos productos reales aún no tienen esa redacción. Para esos productos la teoría todavía no se aplica empíricamente.

Validez interna de la afirmación de precios. S-2 hereda la identificación que haya usado Epoch (ajuste por calidad, elección de benchmark, precios publicados frente a facturas realizadas). Este artículo no auditó los microdatos. Una revisión de las series de Epoch revisaría las magnitudes de S-2 y podría no revisar la dirección. S-2 debería releerse frente a las páginas primarias antes de usarse como cifra ejecutiva.

Validez externa. El trabajo y el cuidado, tal como se definen, excluyen la rivalidad militar y pueden excluir la investigación. La posesión de teléfonos no se transfiere a los productos de agentes. Los precios de las acciones de bicicletas no se transfieren a los márgenes del software. Los episodios construidos no son una muestra.

Validez de la medición. Sin julios divididos, sin matriz de confusión del detector y sin medidor de energía en ningún dispositivo. Las especificaciones de hardware del fabricante no son mediciones de energía.

Variable omitida. Las tareas nuevas pueden absorber el gasto liberado por la síntesis barata. La Sección 5.1 lo enuncia. Una hoja de ruta que trate la saciedad por quehacer como una previsión de la demanda agregada de cómputo no está autorizada por este artículo.

Sesgo de publicación y tipo de documento. Wu es un libro. La página de Humane Technology es militancia. Goldman Sachs es lado vendedor. Quinn, Epoch, Baumol, Acemoglu y Restrepo, Landauer y Horowitz son las citas que soportan la carga, y respaldan frases distintas. La estructura del artículo es un intento de impedir que esas frases se promedien hasta convertirse en un estado de ánimo.

Falsadores. S-1 falla si la teoría citada no contiene una región de utilidad marginal cero. La contiene. S-2 falla si las páginas primarias de Epoch no informan de descensos de ese tipo. Un corpus etiquetado futuro en el que las llamadas adicionales después de un `C` correcto eleven sistemáticamente un valor especificado de forma independiente falsaría la saciedad para ese corpus. Un corpus así no falsaría la definición. Acotaría su dominio.

Las especificaciones de hardware del fabricante enumeran capacidades, no la actividad de conmutación, la potencia estática ni la energía de una carga de trabajo. Un informe de energía tiene que nombrar el hardware, el reloj, la carga de trabajo, el medidor y la duración.

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 7. Conclusión

La saciedad es un objeto estándar en la teoría citada, y tiene una forma operativa estrecha: un predicado de completitud escrito que la síntesis adicional no hace avanzar. Las series publicadas de Epoch documentan una caída brusca del precio monetario de la inferencia a rendimiento fijo. Esa caída respalda una descripción de los quehaceres digitales como gratuitos en el margen y no respalda julios gratuitos, movimiento gratuito de la planta ni el fin de la estructura de costes del cuidado. Los precios de las acciones de bicicletas, la difusión de los smartphones y los mercados de la atención son más débiles y más fuertes de las maneras concretas que enuncia la Sección 4. Los objetos científicos que faltan son un detector de terminado etiquetado, una división de la energía antes y después del terminado y una estimación de la demanda capaz de ver el rebote. Mientras no existan, el contenido empírico del artículo es el registro citado, y su contenido formal es el predicado.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referencias

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Acemoglu, D., and Restrepo, P. Automation and new tasks: how technology displaces and reinstates labor. Journal of Economic Perspectives 33(2), 2019. https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3

Ames, A. D., et al. Control barrier functions: theory and applications. ECC 2019. https://doi.org/10.23919/ECC.2019.8796030

Andersen, E. S. Satiation in an evolutionary model of structural economic dynamics. Journal of Evolutionary Economics, 2001. https://doi.org/10.1007/PL00003852

Baumol, W. J. Macroeconomics of unbalanced growth: the anatomy of urban crisis. American Economic Review 57, 415-426, 1967.

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Center for Humane Technology. The attention economy. https://www.humanetech.com/youth/the-attention-economy

Emberson, L., and Roodman, D. / Epoch AI. The plunging price of thought. 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

Epoch AI. LLM inference price trends. 12 March 2025. https://epoch.ai/data-insights/llm-inference-price-trends

Gillingham, K., Rapson, D., and Wagner, G. The rebound effect and energy efficiency policy. Review of Environmental Economics and Policy 10(1), 68-88, 2016. https://doi.org/10.1093/reep/rev017 Working text: https://gwagner.com/wp-content/uploads/Gillingham-Rapson-Wagner-2015-Rebound-Effect.pdf

Alcott, B. Jevons' paradox. Ecological Economics 54(1), 9-21, 2005. https://doi.org/10.1016/j.ecolecon.2005.03.020

Anthropic. How we built our multi-agent research system. 13 June 2025. https://www.anthropic.com/engineering/multi-agent-research-system

Jevons, W. S. The Coal Question. London: Macmillan, 1865.

Keynes, J. M. Economic possibilities for our grandchildren. 1930. Reprinted in Essays in Persuasion, 1931.

Nordhaus, W. D. Two centuries of productivity growth in computing. Journal of Economic History 67(1), 128-159, 2007. https://doi.org/10.1017/S0022050707000058

Goldman Sachs. Gen AI: too much spend, too little benefit? https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit

Horowitz, M. Computing's energy problem (and what we can do about it). ISSCC 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Ma, S., et al. The era of 1-bit LLMs. arXiv:2402.17764.

Pew Research Center. Mobile fact sheet. https://www.pewresearch.org/internet/fact-sheet/mobile/

Quinn, W. Technological revolutions and speculative finance: evidence from the British Bicycle Mania. Cambridge Journal of Economics 43(2), 271-294, 2019. https://doi.org/10.1093/cje/bey029

Wei, J., et al. T-MAC. arXiv:2407.00088.

Wu, T. The Attention Merchants. Knopf. https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/

Chung, J.-W., Wu, R., Ma, J. J., and Chowdhury, M. Where Do the Joules Go? Diagnosing Inference Energy Consumption. arXiv:2601.22076. https://arxiv.org/abs/2601.22076

Energy use of AI inference, efficiency pathways, and test-time scaling. *Joule*, 2026. https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5

Luccioni, A. S., Strubell, E., and Crawford, K. From efficiency gains to rebound effects: the problem of Jevons' Paradox in AI's polarized environmental debate. *FAccT* 2025. https://doi.org/10.1145/3715275.3732007

Ostrovsky, N. / Epoch AI. What you need to know about AI energy use. Updated 14 July 2026. https://epoch.ai/publications/ai-energy

Anthropic. Anthropic Economic Index report: uneven geographic and enterprise AI adoption. September 2025. https://www.anthropic.com/research/anthropic-economic-index-september-2025-report

Bai, L., Huang, Z., Wang, X., et al. How do AI agents spend your money? Analyzing and predicting token consumption in agentic coding. arXiv:2604.22750, 2026. https://arxiv.org/abs/2604.22750

Brockway, P. E., Sorrell, S., Semieniuk, G., Heun, M. K., and Court, V. Energy efficiency and economy-wide rebound effects: a review of the evidence and its implications. Renewable and Sustainable Energy Reviews 141, 110781, 2021. https://doi.org/10.1016/j.rser.2021.110781

Brookes, L. The greenhouse effect: the fallacies in the energy efficiency solution. Energy Policy 18(2), 199-201, 1990. https://doi.org/10.1016/0301-4215(90)90145-T

Chen, X., Xu, J., Liang, T., et al. Do NOT think that much for 2+3=? On the overthinking of o1-like LLMs. arXiv:2412.21187, 2024. https://arxiv.org/abs/2412.21187

Cuadron, A., Li, D., Ma, W., et al. The danger of overthinking: examining the reasoning-action dilemma in agentic tasks. arXiv:2502.08235, 2025. https://arxiv.org/abs/2502.08235

Du, M. Tiered super-Moore's law: price evolution, production frontiers, and market competition in large language models. arXiv:2603.28576, 2026. https://arxiv.org/abs/2603.28576

Fouquet, R., and Pearson, P. J. G. Seven centuries of energy services: the price and use of light in the United Kingdom (1300-2000). The Energy Journal 27(1), 2006. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol27-No1-8

Gundlach, H., Lynch, J., Mertens, M., et al. The price of progress: price performance and the future of AI. arXiv:2511.23455, 2025. https://arxiv.org/abs/2511.23455

Khazzoom, J. D. Economic implications of mandated efficiency in standards for household appliances. The Energy Journal 1(4), 1980. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol1-No4-2

Masanet, E., Shehabi, A., Lei, N., Smith, S., and Koomey, J. Recalibrating global data center energy-use estimates. Science 367(6481), 984-986, 2020. https://doi.org/10.1126/science.aba3758

Saunders, H. D. The Khazzoom-Brookes postulate and neoclassical growth. The Energy Journal 13(4), 1992. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol13-No4-7

Sorrell, S., and Dimitropoulos, J. The rebound effect: microeconomic definitions, limitations and extensions. Ecological Economics 65(3), 636-649, 2008. https://doi.org/10.1016/j.ecolecon.2007.08.013

Tsao, J. Y., Saunders, H. D., Creighton, J. R., Coltrin, M. E., and Simmons, J. A. Solid-state lighting: an energy-economics perspective. Journal of Physics D: Applied Physics 43(35), 354001, 2010. https://doi.org/10.1088/0022-3727/43/35/354001

Witt, U. Learning to consume: a theory of wants and the growth of demand. Journal of Evolutionary Economics 11(1), 23-36, 2001. https://doi.org/10.1007/PL00003851

<div id="appendix-a-decision-rules-and-non-results" class="anchor-alias" aria-hidden="true"></div>

## Apéndice A. Reglas de decisión y no resultados

| Id | Enunciado | Clase |
|----|-----------|-------|
| R1 | Escribir el predicado de completitud antes de añadir capacidad. | Diseño |
| R2 | Esperar que las primas de precio de la síntesis se erosionen donde se aplica evidencia del tipo de Epoch. | Diseño, condicionado a S-2 |
| R3 | No afirmar energía gratuita ni actuación gratuita. | Restricción derivada de S-9 |
| R4 | Separar los motivos de parada económicos de los motivos de parada físicos. | Diseño |
| R5 | Publicar las tasas de error del detector antes de tratar una parada como precisa. | Todavía no es un resultado |
| R6 | Dividir la energía antes y después del terminado. | Todavía no es un resultado |
| R7 | Mantener las carreras adversariales fuera de la afirmación de saciedad. | Alcance |
| R8 | Releer las fuentes primarias de Pew y Epoch antes de citar una magnitud más fina. | Método |

<div id="appendix-c-claim-map" class="anchor-alias" aria-hidden="true"></div>

## Apéndice C. Mapa de afirmaciones

Respaldadas ahora: S-1 a S-9, con las frases de alcance de la Sección 4.

No respaldadas: el fin de la enfermedad de los costes de Baumol; el movimiento gratuito de la planta; la saciedad de la demanda militar; un rebote global numérico de cero; el funcionamiento de un modelo de lenguaje a escala de Landauer; vatios en placa; un precio de AGI como hecho sobre quehaceres saciados; un retardo universal de destilación; el liderazgo en rendimiento del silicio.

Mediciones abiertas: Sección 3.3.
