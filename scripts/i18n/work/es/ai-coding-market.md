<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*Versión 1.1, 11 de octubre de 2026. Datos y código: [research.openie.dev/data/](/data/#economics). PDF en LaTeX: [/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf) ([fuente](/pdfs/latex/ai-coding-market.tex)).*

*Compañero económico del artículo [El Reality Code Engine: una Forma sin pérdida para una programación nativa, verificada y de bajo consumo energético](/papers/rce/). El artículo de investigación contiene la ingeniería, la teoría y las mediciones. Este ensayo es el lugar donde se encuentran la teoría y la economía.*

## Resumen

El mercado billonario de la programación con IA es la afirmación hiperbólica e informada de David Charlot, y las proyecciones reales confirman su escala. Una estimación de capital riesgo sitúa el valor de los desarrolladores de software del mundo en unos 3 billones de dólares al año y llama a la programación con IA un mercado capaz de sostener "incluso a un gigante de un billón de dólares" [1]. Dos empresas de programación con IA declararon más de 1.000 millones y más de 2.500 millones de dólares de ingresos anualizados con un año de diferencia [5, 6]. Un laboratorio de frontera está valorado en 380.000 millones de dólares, y su producto de programación es su escaparate [6]. El volumen de tokens de un proveedor pasó de 9,7 billones a más de 3,2 mil billones de tokens al mes en dos años [8]. La inversión de capital de las mayores empresas tecnológicas superó los 400.000 millones de dólares en 2025 [10].

Todas estas proyecciones suponen lo mismo. Existe un solo camino hacia la automatización informática autónoma. Es de alta energía, alto cómputo, alta entropía y desorden. Un modelo está en el bucle de cada tarea, y cada tarea paga una renta por token.

El [artículo de investigación de RCE](/papers/rce/) mide un segundo camino. RCE es un ecosistema de código nativo. Un programa se escribe una sola vez, a partir de la intención, como una Forma, una codificación sin pérdidas del estado, los eventos y las transiciones puras, y cada lenguaje de destino es una proyección fiel de ella. Un estado que la Forma no declara no puede escribirse, de modo que un programa erróneo se rechaza en el punto de entrada en lugar de encontrarse y corregirse después. Cada ajuste que pasa la compuerta se almacena y se reutiliza, de modo que el ecosistema crece de forma acumulativa. En 10.000 Formas prerregistradas, con un motor congelado y 0 llamadas a modelos, cada Forma hace el viaje de ida y vuelta a bytes idénticos, cada proyección es determinista, cada entrada malformada se rechaza en el punto de entrada y la proyección en Python reproduce la traza de referencia en 9.999 ([RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n)). El código de otros lenguajes entra por elevación, y en el código elevado los engranajes de reparación restauran 520.541 de 520.821 fallos de un token y el 63,7% de 21.320 errores de una sentencia en Java con 0 llamadas a modelos ([RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)). Donde ese camino cubre una tarea, el coste marginal de la tarea cae hacia la energía necesaria para ejecutarla, y un mercado con precios basados en la generación pierde su base en esa tarea. Este ensayo separa las proyecciones de las mediciones, nombra lo que supone cada proyección y señala dónde se rompe.

**Tesis compartida, enunciada una vez para todos los artículos.** La energía para ejecutar es la única métrica verdadera de la inteligencia computacional. Todos los demás factores se reducen a cero. La forma de compuerta define lo que eso significa. Entre las ejecuciones que cumplen el predicado de completitud de la tarea $C(z)$ dentro del presupuesto y el plazo declarados, los sistemas se clasifican por julios hasta la finalización, $J^*$. La corrección, los plazos y el tamaño de la tarea son la compuerta, no términos de la puntuación. Los parámetros, los tokens, las puntuaciones en benchmarks y los precios tienen peso cero en la clasificación ([Agencia, Sección 1](/papers/agency/#1-thesis)). Las estimaciones nunca son `measured_j`.

**El precio, una afirmación aparte, para los compañeros económicos.** Una tendencia de precios es una afirmación aparte, etiquetada como tal. Epoch AI informa de que el coste de un nivel dado de rendimiento de IA ha caído alrededor de un 47 por ciento por trimestre desde 2023, unas 13 veces al año (Emberson y Roodman, *The plunging price of thought*, 22 de septiembre de 2026). Si esa tendencia continúa, la energía se convierte en el coste marginal dominante de la inferencia. Es una tendencia citada con una condición, no un colapso medido. [La corrección ortográfica es global](/papers/spellcheck/) es una prueba de existencia de que cierta inteligencia computacional se mercantiliza hasta un precio cero incluido en un paquete. La teoría que usan estos compañeros está en [el artículo sobre agencia](/papers/agency/), [Compuertas de confirmación medidas](/papers/gates/) y [Reality Code Engine](/papers/rce/).

## 1. Las proyecciones y las mediciones son objetos distintos

Cada número que sigue lleva una de cinco etiquetas.

| Etiqueta | Significado |
|---|---|
| **Proyección** | Un pronóstico o una estimación de valor construida sobre supuestos declarados |
| **Declarado por la empresa** | Una cifra que una empresa declara sobre sí misma, como los ingresos anualizados (el último mes por doce) o una valoración de financiación |
| **Estimación por encuesta** | Una cifra de tamaño de mercado procedente de una encuesta a compradores |
| **Registrado** | Una cifra de un documento presentado ante un regulador |
| **Medido** | Un recuento o una lectura de energía de una ejecución cuyos artefactos se conservan. En RCE, la energía lleva su propia etiqueta: `est_j`, `reported_j` o `measured_j` |

Solo la última fila es evidencia sobre el coste de un resultado correcto. Las demás son evidencia sobre lo que espera el mercado.

## 2. Quién proyecta qué

### 2.1 El valor de los desarrolladores: el billón

| Afirmación | Número | Etiqueta | Fuente |
|---|---|---|---|
| Desarrolladores de software en el mundo | unos 30 millones (de 27 a 47 millones según la estimación) | Insumo de proyección | Appenzeller y Li [1] |
| Valor por desarrollador y año | 100.000 dólares (supuesto) | Insumo de proyección | [1] |
| Contribución económica anual | unos 3 billones de dólares | Proyección | [1] |
| Desarrolladores en GitHub | más de 180 millones; 518,7 millones de pull requests fusionadas en el año | Declarado por la empresa | GitHub Octoverse 2025 [17] |
| Valor de la IA generativa en 63 casos de uso | de 2,6 a 4,4 billones de dólares al año; productividad de la ingeniería de software del 20% al 45% del gasto anual actual de la función | Proyección | McKinsey [15] |
| Efecto de la IA generativa en el PIB mundial | 7% en un periodo de diez años | Proyección | Goldman Sachs [16] |
| Ganancia de productividad de un asistente simple | alrededor del 20% | Estimación a partir de entrevistas | [1] |
| Ganancia de productividad de un despliegue de lo mejor de su clase | "al menos el doble" | Estimación "basada en evidencia anecdótica" | [1] |

El recuento de desarrolladores es blando: 30 millones es una estimación de profesionales, y solo GitHub cuenta seis veces más cuentas que desarrollan sobre él [17]. El valor por desarrollador y el múltiplo de productividad también son blandos (sección 2.7). La estimación de McKinsey de 2023 es el billón original de este mercado, y es una estimación de valor para todas las funciones [15]. El mismo ensayo de capital riesgo dice que el ecosistema de programación con IA puede "sostener decenas de empresas de mil millones de dólares e incluso a un gigante de un billón de dólares" [1]. Esa frase es el billón. Es una estimación de valor. No es un pronóstico de ingresos.

### 2.2 Ingresos de herramientas y gasto empresarial

| Afirmación | Número | Etiqueta | Fuente |
|---|---|---|---|
| Gasto empresarial en herramientas de programación con IA, 2025 | 4.000 millones de dólares, el 55% del gasto departamental en IA | Estimación por encuesta | Menlo Ventures [2] |
| Gasto empresarial en IA generativa, 2025 | 37.000 millones de dólares | Estimación por encuesta | [2] |
| Mercado de herramientas de código con IA, 2026 | 9.350 millones de dólares, hasta 29.960 millones en 2031 | Proyección | Mordor Intelligence [3] |

Los ingresos que el mercado declara hoy están en los miles de millones. El billón es el valor que el mercado espera capturar.

### 2.3 Ingresos y valoraciones de empresas

| Afirmación de la empresa | Número | Fecha | Etiqueta | Fuente |
|---|---|---|---|---|
| Ingresos anualizados de Cursor | más de 1.000 millones de dólares | 13 de noviembre de 2025 | Declarado por la empresa | Cursor [5] |
| Nuevo precio de Cursor Pro | de límites de solicitudes a "20 dólares de uso de modelos de frontera al mes a precios de API", con reembolsos por el cambio | junio a julio de 2025 | Declarado por la empresa | Cursor [18] |
| Serie D de Cursor | 2.300 millones de dólares con una valoración post-money de 29.300 millones | 13 de noviembre de 2025 | Declarado por la empresa | [5] |
| Ingresos anualizados de Anthropic | 14.000 millones de dólares | 12 de febrero de 2026 | Declarado por la empresa | Anthropic [6] |
| Ingresos anualizados de Claude Code | más de 2.500 millones de dólares | 12 de febrero de 2026 | Declarado por la empresa | [6] |
| Serie G de Anthropic | 30.000 millones de dólares con una valoración post-money de 380.000 millones | 12 de febrero de 2026 | Declarado por la empresa | [6] |

Anthropic declara que la ronda financia "ampliaciones de infraestructura" [6]. Ingresos, valoración y cómputo son una sola apuesta.

### 2.4 Inferencia, tokens y economía unitaria

| Afirmación | Número | Etiqueta | Fuente |
|---|---|---|---|
| Tokens procesados por Google al mes | 9,7 billones (2024), unos 480 billones (2025), más de 3,2 mil billones (mayo de 2026) | Declarado por la empresa | Pichai [8] |
| Herramientas internas de IA para desarrolladores de Google | medio billón de tokens al día en marzo de 2026, más de tres billones al día en mayo | Declarado por la empresa | [8] |
| Coste de una consulta de programación agéntica a precios de lista | 2,50 dólares: un contexto de 100.000 tokens y 10.000 tokens de salida a 15 y 75 dólares por millón de tokens | Ilustración | Appenzeller y Li [1] |
| Lo mismo a 3 consultas por hora, 7 horas al día, 200 días | unos 10.000 dólares al año por desarrollador | Ilustración | [1] |
| Tokens en programación agéntica frente a razonamiento sobre código y chat de código | unas 1.000 veces más; las ejecuciones de una misma tarea difieren hasta 30 veces; un mayor uso de tokens "no se traduce en mayor precisión" | Medido (ocho modelos, SWE-bench Verified) | Bai, Huang y Wang [9] |
| Pérdidas netas de la inversión de Microsoft en OpenAI, trimestre cerrado el 30 de septiembre de 2025 | 4.100 millones de dólares antes de impuestos, su participación por el método de la participación, en otros gastos; una reducción de 3.100 millones del beneficio neto (0,41 dólares por acción diluida) | Registrado y declarado por la empresa | Microsoft Form 10-Q [7]; Microsoft FY26 Q1 performance [19] |

Dos frases de las fuentes enuncian la economía sin rodeos. Pichai: "muchas empresas ya están agotando sus presupuestos anuales de tokens, y solo estamos en mayo" [8]. Appenzeller y Li: "Durante décadas, el coste del desarrollo de software fue casi exclusivamente coste de personas, pero ahora los LLM añaden un componente sustancial de gasto operativo" [1].

### 2.5 Precio por token

| Afirmación | Número | Etiqueta | Fuente |
|---|---|---|---|
| Coste de un nivel fijo de rendimiento de IA | baja alrededor de un 47% por trimestre, unas 13 veces al año, desde 2023 | Serie de precios medida (cinco benchmarks) | Epoch AI [4] |
| Precio para alcanzar una puntuación fija en un benchmark | cae de 9 a 900 veces al año, según el hito; las caídas más rápidas son las más recientes y las menos seguras de persistir | Serie de precios medida (ajustes log-lineales) | Epoch AI [34] |
| Coste de inferencia a rendimiento equivalente | baja unas 10 veces al año: de 60 dólares por millón de tokens en 2021 a 0,06 dólares | Estimación | Appenzeller, a16z [20] |
| Rebaja del precio de la API de DeepSeek, 29 de septiembre de 2025 | coste para los desarrolladores "reducido en más del 50%" | Declarado por la empresa | DeepSeek [21] |

Las 13 veces al año de [4] son un punto dentro de un rango amplio [34]. La caída la impulsan la competencia y los pesos abiertos, como muestra la rebaja de DeepSeek [21]. No necesita ninguna contabilidad energética. Es el primer descenso de la sección 6. El segundo camino añade otro distinto: las llamadas por tarea.

### 2.6 Energía y capital

| Afirmación | Número | Etiqueta | Fuente |
|---|---|---|---|
| Electricidad de centros de datos, 2024 | unos 415 TWh, alrededor del 1,5% de la electricidad mundial | Estimación | IEA, *Energy and AI* [11] |
| Electricidad de centros de datos, 2030 | unos 945 TWh, escenario base | Proyección | [11] |
| Actualización: de 2025 a 2030 | de 485 TWh a 950 TWh, alrededor del 3% de la demanda mundial | Estimación y proyección | IEA, *Key Questions on Energy and AI* [10] |
| Inversión de capital de las mayores empresas tecnológicas | más de 400.000 millones de dólares en 2025, con un aumento previsto de otro 75% en 2026 | Declarado y proyectado | [10] |
| Inversión de capital de Alphabet | 31.000 millones de dólares en 2022; entre 180.000 y 190.000 millones previstos en 2026 | Declarado por la empresa y previsión | Pichai [8] |
| Energía por tarea | baja al menos un orden de magnitud al año; las tareas de razonamiento y agénticas usan "cientos o miles de veces más energía por consulta que la generación de texto simple" | Estimación | [10] |
| Una instrucción de texto mediana a un asistente en producción | 0,24 Wh | Medido por el operador | Elsworth et al. [12] |
| Stargate | 500.000 millones de dólares en cuatro años para la infraestructura de IA de un laboratorio, con 100.000 millones desplegados de inmediato | Anunciado por la empresa | OpenAI [22] |
| Gasto mundial en IA, 2025 | alrededor de 1,5 billones de dólares | Proyección | Gartner [24] |
| Ingresos que la inversión de capital debe recuperar | "AI's $600B question" | Análisis | Sequoia Capital [23] |

La renta que hay que servir es renta de hardware. Inversiones y compromisos de este tamaño se amortizan mediante un uso con precio superior a su energía. Esa es la base que el segundo camino elimina en las tareas cubiertas.

### 2.7 Evidencia de productividad

| Estudio | n | Diseño | Efecto | Fuente |
|---|---|---|---|---|
| Ensayo de a16z | entrevistas | Estimación | alrededor del 20% para un asistente simple; "al menos el doble" lo mejor de su clase | [1] |
| GitHub Copilot, tarea de servidor HTTP | desarrolladores reclutados | Experimento controlado | 55,8% más rápido en una tarea de juguete | Peng et al. [27] |
| Ensayo empresarial de Google | 96 ingenieros | Ensayo controlado aleatorizado | alrededor de un 21% menos de tiempo en la tarea | Paradis et al. [28] |
| METR, principios de 2025 | 16 desarrolladores experimentados de código abierto, 246 tareas | Ensayo controlado aleatorizado | 19% más lentos con IA | Becker et al. [25] |
| METR, actualización de 2026 | nueva cohorte | Ensayo controlado aleatorizado | los autores llaman a los nuevos datos "una señal poco fiable" | METR [26] |

Los efectos medidos van de una ralentización del 19% a una aceleración del 56% en una tarea de juguete. Los dos factores de la estimación de valor, el recuento de desarrolladores y el múltiplo de productividad, son blandos. Eso debilita el billón. También debilita cualquier afirmación de que el valor que libera el segundo camino sea un número conocido.

## 3. Lo que suponen las proyecciones

Leídas en conjunto, las proyecciones descansan sobre cuatro supuestos. Cada uno es un enunciado sobre el camino, no sobre el valor del software.

1. **Un solo camino: la generación.** Cada cambio lo escribe un modelo. La estimación de valor escala la productividad por el modelo, y la ilustración de costes pone precio a cada consulta [1].
2. **Alta energía y alto cómputo.** Se proyecta que el volumen de tokens, la electricidad de los centros de datos y la inversión de capital crezcan juntos [8, 10, 11]. La energía por consulta cae, y los tokens por tarea suben más deprisa [9, 10].
3. **Renta por token.** Los ingresos se facturan por token o por puesto cuyo coste son tokens. Se proyecta que el coste anual en tokens de un desarrollador alcance la escala de un salario [1].
4. **La IA en el bucle para siempre.** La tarea 10.000 cuesta lo que cuesta la tarea 1, porque nada de lo que el modelo aprendió en la tarea 1 se ejecuta sin el modelo en la tarea 10.000.

El ensayo que enuncia el billón también enuncia su límite: "aunque la fijación de precios por sustitución funciona en los mercados incipientes, al final el coste de un bien converge a su coste marginal, y lo mismo ocurre con el precio" [1]. Este ensayo está de acuerdo, y pregunta cuál es el coste marginal de una tarea de programación correcta.

## 4. La teoría que pone precio a la tarea

El [artículo de investigación de RCE](/papers/rce/) aporta tres resultados que convierten la pregunta en una cantidad.

**La corrección es la compuerta.** Una tarea está hecha cuando se cumple su predicado de completitud $C(z)$: sus pruebas pasan, existe una demostración o coincide una traza de acuerdo ([RCE §1](/papers/rce/#1-thesis)). Un comprador paga por $C(z) = 1$, no por tokens.

**Los julios son la clasificación.** Entre los sistemas que pasan la compuerta, gana el que necesita menos julios hasta la finalización, $J^*$ ([Agencia §1](/papers/agency/#1-thesis)). En un mercado competitivo, los vendedores que pasan la misma compuerta compiten en coste, y el suelo de coste de una tarea es la energía para completarla más el precio de la demostración.

**La Forma se escribe una vez y se reutiliza.** Un programa del ecosistema se escribe una sola vez, a partir de la intención, como una Forma, y cada destino es una proyección de ella, de modo que el coste de un ajuste se paga una vez y cada uso posterior se ejecuta en el suelo del manejador ([RCE §1](/papers/rce/#1-thesis)). **La mayoría de los ajustes ya existen.** Un programa es una tupla $P = (S, E, \delta, D, \lambda)$, y por el teorema de las máquinas de estados abstractas de Gurevich todo algoritmo secuencial tiene esa forma ([RCE §3](/papers/rce/#3-the-form)). Los programas difieren en el ajuste, y la mayoría de los ajustes ya existen: "el 70% del código de GitHub consiste en clones de archivos creados previamente" ([RCE §7](/papers/rce/#7-reuse-evidence)). Los ajustes equivalentes pasan la misma compuerta, de modo que la extracción elige el de menos julios (Proposición 3 de RCE).

**Proposición E0 (precio de una tarea cubierta).** Dígase que una tarea está cubierta cuando un ajuste almacenado pasa su compuerta. Entre los vendedores que pasan la compuerta, la competencia lleva el precio de una tarea cubierta hacia $c_J \cdot J^*_{\text{floor}} + c_{\text{proof}}$, donde $c_J$ es el precio de un julio, $J^*_{\text{floor}}$ es la energía para recuperar, aplicar y comprobar el ajuste, y $c_{\text{proof}}$ es el coste de la comprobación. La generación solo interviene en las tareas no cubiertas.

Mixture of Limits es la filosofía detrás de la proposición: hay una cantidad mínima de cualquier cosa para cumplir una tarea, y todo lo que excede es desperdicio ([Compuertas de confirmación medidas, Parte II](/papers/gates/#part-ii-the-cascade-mixture-of-limits)). La renta por token por encima del suelo factura desperdicio.

## 5. Las mediciones

Son mediciones, etiquetadas como las etiqueta RCE. Proceden del [artículo de investigación de RCE](/papers/rce/). Las primeras filas miden el propio ecosistema; las filas siguientes miden la reparación de código elevado desde otros lenguajes ([RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)).

| Medición | Resultado | Etiqueta | Dónde |
|---|---|---|---|
| Ecosistema de Formas, 10.000 Formas prerregistradas, ida y vuelta sin pérdidas y proyección determinista | 10.000 de 10.000, 0 llamadas a modelos | Recuentos medidos | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Ecosistema de Formas, entradas y especificaciones malformadas rechazadas en el punto de entrada | 10.000 de 10.000, 0 llamadas a modelos | Recuentos medidos | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Ecosistema de Formas, la proyección en Python reproduce la traza de referencia byte a byte | 9.999 de 10.000, 0 llamadas a modelos | Recuentos medidos | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| Código elevado, L0 fallos de un token, 9 repositorios reales, partición de prueba reservada | 520.541 de 520.821 (0,9995, IC 95% de 0,9994 a 0,9995), 0 llamadas a modelos | Recuentos medidos | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| Código elevado, L0, 4 repositorios nunca usados para el ajuste | 23.015 de 23.015 (IC 95% de 0,9998 a 1,0000), 0 llamadas a modelos | Recuentos medidos | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| Código elevado, L1 Java, ManySStuBs4J 2.0, reservado, archivo completo | 13.586 de 21.320 (0,637, de 0,631 a 0,644), 0 llamadas a modelos; 9.288 de 24.072 (0,386) solo con el fragmento | Recuentos medidos | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| Código elevado, L1 Python, TSSB-3M v1.0.0, reservado | 27.266 de 157.089 (0,174, de 0,172 a 0,175), 0 llamadas a modelos | Recuentos medidos | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| Energía por tarea resuelta, todos los peldaños | de 0,10 J a 0,40 J | `est_j` (segundos de CPU × 10 W) | [RCE §6.3](/papers/rce/#63-energy) |
| Energía por tarea resuelta, submuestra RAPL | 0,056 J (L0, 3.000 tareas), 0,026 J (L1, 690 resueltas de 2.000); ±10 J sobre los totales de ejecución | `reported_j` (contador del paquete menos una línea base de reposo declarada) | [RCE §6.3](/papers/rce/#63-energy) |

`measured_j` está reservado para un medidor de pared y está vacío en todas las filas.

## 6. Dónde se rompen las proyecciones

**La renta por token se rompe en las tareas cubiertas.** Un programa escrito como Forma se compila a todos los destinos con 0 tokens: 10.000 de 10.000 Formas prerregistradas se compilaron, proyectaron y pasaron la compuerta sin ninguna llamada a modelos [RCE §2.3]. En el código elevado, cada reparación cubierta compró también 0 tokens: 520.541 reparaciones de un token y 40.852 reparaciones de una sentencia procedentes de historiales reales [RCE §6.1, §6.2]. Una línea de ingresos con precio por token no gana nada en una tarea que no necesita ningún token.

**La IA en el bucle para siempre se rompe en la promoción.** Al modelo se le paga una vez por un caso nuevo; la compuerta admite el ajuste como manejador, y los casos posteriores de la misma forma se cierran sin él ([RCE §4.2](/papers/rce/#42-the-gears)). Donde eso se cumple, la tarea 10.000 no cuesta lo que costó la tarea 1. Si las llamadas a modelos por ronda llegan a cero en especificaciones reales se mide a gran N en [RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n).

**Un resultado correcto no requiere alta energía.** Una reparación reservada pasó la compuerta con 0,026 a 0,056 julios declarados por tarea resuelta en un contador del paquete, sin modelo [RCE §6.3]. Una instrucción de texto mediana a un asistente en producción se mide en 0,24 Wh, es decir, 864 J [12]. Una tarea de programación agéntica usa muchas instrucciones, y la IEA sitúa las consultas agénticas en cientos o miles de veces la energía de una simple [10]. Son tareas distintas en máquinas distintas, de modo que no forman una razón. Son un orden de magnitud por comprobar, según el Protocolo E1.

**La cobertura se mide por clase.** Los peldaños dan la cobertura dentro de clases de tareas: casi todos los fallos de un token, y el 63,7% (Java, archivo completo; el 38,6% solo con el fragmento) y el 17,4% (Python) de los errores de una sentencia, donde los casos abiertos son aquellos cuyos bits de intención están fuera del fragmento o son nuevos ([RCE §6.0](/papers/rce/#60-the-repair-ladder-on-lifted-code)). La proporción de todo el volumen real de programación que cae en clases cubiertas es la Proposición E5.

**Dos descensos se multiplican.** El precio por llamada cae de 9 a 900 veces al año a rendimiento fijo, según la tarea [4, 34]. La promoción lleva las llamadas por tarea a cero en los casos cubiertos [RCE §8.6]. El coste por tarea es el producto de ambos. Una proyección que extrapola el volumen de tokens solo pone precio al primero.

**El patrón del corrector ortográfico.** [La corrección ortográfica es global](/papers/spellcheck/) documenta una capacidad cuyo coste marginal cayó a casi cero y que complementaba una herramienta que todos ya tenían. Se incluyó en el editor y su precio separado desapareció, como predice la economía de la venta en paquete [13, 14]. Una tarea de programación cubierta tiene las mismas dos propiedades: su coste marginal cae al suelo del manejador, y complementa los editores y repositorios que la gente ya tiene. La predicción es la misma: la tarea cubierta se incluye en un paquete, y lo que sigue teniendo precio es el caso no cubierto y la demostración.

**El paquete del propietario de la plataforma.** El patrón del corrector ortográfico tiene un propietario. El paquete lo hace quien posee el editor, el repositorio o la nube. Spolsky dio nombre a la táctica: mercantiliza tu complemento [31]. Nalebuff mostró que un paquete puede bloquear la entrada [32], y Adams y Yellen que discrimina en precio [33]. Está ocurriendo: GitHub pasó los planes individuales de Copilot a facturación por uso a partir del 1 de junio de 2026 [30], y Cursor pasó Pro de límites de solicitudes a precios de API repercutidos en 2025 [18]. Una plataforma puede regalar la capa del modelo y quedarse con la renta en el IDE y en la nube. Un motor con precio por energía compite con un paquete de precio cero solo donde la compuerta le está abierta: donde las pruebas, la demostración y el recibo son del comprador, no de la plataforma.

**Una Forma en lugar de muchos lenguajes.** El artículo de RCE enuncia la tesis de que una Forma universal, con cada lenguaje como proyección y cada programa como elevación, sustituye la necesidad de cualquier otro lenguaje ([RCE §3.6](/papers/rce/#36-one-ecosystem-lossless-and-the-universality-thesis)). La lectura de mercado es esta. Gran parte del gasto que cuentan las proyecciones es traducción entre lenguajes, marcos y sus versiones, y conciliación de implementaciones que divergen. En un ecosistema en el que un programa se escribe una vez y se emiten todos los destinos, ese gasto no tiene ninguna tarea que comprar. La adopción es la magnitud abierta, y es una cuestión de mercado, no un teorema.

**Lo que sobrevive.** La estimación de valor de la sección 2.1 puede mantenerse. Los desarrolladores pueden producir más. Lo que se rompe es la afirmación de que el valor se captura como renta sobre la generación. La conclusión es condicional. Donde la cobertura es alta y la plataforma no empaqueta, el valor creado a un coste marginal decreciente va a quien controla la compuerta, la demostración y el suelo de baja entropía, y buena parte va al comprador. Donde la plataforma empaqueta, la evidencia indica que quien controla la compuerta es la plataforma.

## 7. Demanda

Tareas más baratas pueden aumentar la demanda total. El ensayo de capital riesgo lo espera: "creemos que en este caso se cumple la paradoja de Jevons" [1]. [Saciedad de la tarea frente al rebote agregado en la demanda de IA](/papers/satiation/) separa los dos efectos. El apetito por tarea se detiene en el predicado de completitud. El uso agregado aún puede crecer, porque una síntesis más barata abre tareas nuevas. El segundo camino cambia el primer efecto y deja abierto el segundo. Un mercado mayor de tareas cubiertas es un mercado cuyo coste marginal es el suelo, no la frontera. La única elasticidad publicada es pequeña. Entre tareas de la muestra de la API de Anthropic, cada aumento del 1% en el coste se asocia con una disminución del 0,29% en la frecuencia de uso [29]. Es una relación transversal entre tareas, no un cambio de precio en el tiempo. Leída tal cual, la demanda es inelástica: las bajadas de precio reducen los ingresos sobre un conjunto fijo de tareas, lo que respalda la lectura de la renta que hace este ensayo, y por sí solas no hacen que la programación se use mucho más.

## 8. Proposiciones y protocolos

**Proposición E1 (las curvas de coste se cruzan).** Para un flujo de tareas en un repositorio, el coste acumulado por tarea resuelta del segundo camino cae por debajo del de un agente de generación tras un número finito de tareas. *Protocolo:* ejecutar el [Protocolo 8.3 de RCE](/papers/rce/#83-a-wall-meter) y un agente de generación simple sobre el mismo flujo de incidencias bajo un medidor de pared. Informar de `measured_j` y de los dólares por tarea resuelta según el índice de la tarea, y del índice de cruce.

**Proposición E2 (el precio sigue al suelo).** Donde una capacidad de programación está cubierta por recuperación y reglas, su precio de mercado cae hacia la energía para ejecutarla más el coste de la demostración. *Protocolo:* seguir en el tiempo los precios de lista de una clase de capacidad cubierta frente a su energía de ejecución medida, a la manera de la serie de precios del corrector ortográfico.

**Proposición E3 (la escala de cómputo no es un foso en las tareas cubiertas).** En las tareas que cubre el segundo camino, la tasa de resolución no aumenta con el cómputo del último engranaje. *Protocolo:* ejecutar el [Protocolo 8.2 de RCE](/papers/rce/#82-swe-bench-lite-offline) sin modelo, con un modelo local pequeño y con un modelo de frontera como último engranaje. Comparar las tasas de resolución en las tareas cerradas antes del último engranaje.

**Proposición E4 (la parte de los tokens en los ingresos).** En un repositorio donde la cobertura crece, la parte del coste de la tarea pagada en tokens cae con la cobertura. *Protocolo:* registrar tokens, julios y dólares por tarea cerrada y por ronda en el protocolo de convergencia de RCE con un resolutor de modelo con precio ([RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n)), etiquetados, e informar de la parte de los tokens en el coste por ronda.

**Proposición E5 (cobertura).** La proporción del volumen real de tareas de programación que cae en clases cubiertas por el segundo camino es medible. *Protocolo:* extraer una muestra aleatoria de pull requests fusionadas de repositorios públicos (GitHub informa de 518,7 millones fusionadas en un año [17]), clasificar cada una según si los engranajes congelados G0 a G2 producen un parche que pasa la compuerta, e informar de la fracción cubierta con un intervalo del 95%. Hasta que exista ese número, la Proposición E0 se aplica a una proporción no medida.

## Referencias
