---
title: "El prometido mercado billonario de la programación con IA"
deck: "Quién proyecta un mercado de un billón de dólares para la programación con IA, qué cuenta cada proyección y qué supone cada una sobre energía, tokens y reutilización."
lang: "es"
source: "ai-coding-market"
complete: true
---

<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*Versión 1.1, 11 de octubre de 2026. Datos y código: [research.openie.dev/data/](/data/#economics). PDF en LaTeX: [/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf) ([fuente](/pdfs/latex/ai-coding-market.tex)).*


<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

Los pronósticos dicen que la programación con IA valdrá billones de dólares al año. Este ensayo enumera quién lo afirma, etiqueta cada cifra según lo que es y nombra los supuestos que los pronósticos comparten.

**En palabras sencillas**

1. Las grandes cifras sobre la programación con IA son, en su mayoría, conjeturas sobre el futuro, no recuentos de dinero ya ganado.
2. Casi todas suponen que cada trozo nuevo de código necesita un modelo grande de IA, cobrado por palabra, para siempre.
3. Si el código que funciona puede guardarse y reutilizarse, el coste de un trabajo repetido cae hacia el coste de la electricidad para ejecutarlo, y esos pronósticos serían demasiado altos.

<div id="1-projections-and-measurements-are-different-objects" class="anchor-alias" aria-hidden="true"></div>

## 1. Las proyecciones y las mediciones son objetos distintos

Cada número que sigue lleva una de cinco etiquetas.

| Etiqueta | Significado |
|---|---|
| **Proyección** | Un pronóstico o una estimación de valor construida sobre supuestos declarados |
| **Declarado por la empresa** | Una cifra que una empresa declara sobre sí misma, como los ingresos anualizados (el último mes por doce) o una valoración de financiación |
| **Estimación por encuesta** | Una cifra de tamaño de mercado procedente de una encuesta a compradores |
| **Registrado** | Una cifra de un documento presentado ante un regulador |
| **Medido** | Un recuento o una lectura de energía de una ejecución cuyos artefactos se conservan. Las lecturas de energía llevan una de tres etiquetas: `est_j` para una estimación analítica, `reported_j` para un contador del sistema operativo o en chip, `measured_j` para un medidor de potencia externo |

Solo la última fila es evidencia sobre el coste de un resultado correcto. Las demás son evidencia sobre lo que espera el mercado.

<div id="2-who-projects-what" class="anchor-alias" aria-hidden="true"></div>

## 2. Quién proyecta qué

<div id="21-developer-value-the-trillion" class="anchor-alias" aria-hidden="true"></div>

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

<div id="22-tool-revenue-and-enterprise-spend" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Ingresos de herramientas y gasto empresarial

| Afirmación | Número | Etiqueta | Fuente |
|---|---|---|---|
| Gasto empresarial en herramientas de programación con IA, 2025 | 4.000 millones de dólares, el 55% del gasto departamental en IA | Estimación por encuesta | Menlo Ventures [2] |
| Gasto empresarial en IA generativa, 2025 | 37.000 millones de dólares | Estimación por encuesta | [2] |
| Mercado de herramientas de código con IA, 2026 | 9.350 millones de dólares, hasta 29.960 millones en 2031 | Proyección | Mordor Intelligence [3] |

Los ingresos que el mercado declara hoy están en los miles de millones. El billón es el valor que el mercado espera capturar.

<div id="23-company-revenue-and-valuations" class="anchor-alias" aria-hidden="true"></div>

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

La Figura 1 sitúa en un solo eje las cifras en dólares de las Secciones 2.1 a 2.3 y 2.6, marcadas con la etiqueta que lleva cada fuente.

![Gráfico de puntos en escala logarítmica de las cifras en dólares de las tablas del ensayo. Proyecciones: contribución de los desarrolladores, unos 3 billones de dólares; valor de la IA generativa, de 2,6 a 4,4 billones; gasto mundial en IA, 1,5 billones; mercado de herramientas de código con IA, 9.350 millones en 2026 y 29.960 millones en 2031. Estimación: inversión de capital de más de 400.000 millones. Estimaciones por encuesta: gasto empresarial en IA generativa, 37.000 millones, y gasto en herramientas de programación con IA, 4.000 millones. Declarado por la empresa: ingresos anualizados de Claude Code de más de 2.500 millones y de Cursor de más de 1.000 millones.](/figures/ai-coding-market/spend-by-label.svg)

*Figura 1. Cifras en dólares por etiqueta. Figura de datos, escala logarítmica. Fuentes: Appenzeller y Li [1], Menlo Ventures [2], Mordor Intelligence [3], Cursor [5], Anthropic [6], IEA [10], McKinsey [15], Gartner [24]. Se ofrece una [copia PNG](/figures/ai-coding-market/spend-by-label.png).*

<div id="24-inference-tokens-and-unit-economics" class="anchor-alias" aria-hidden="true"></div>

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

La Figura 2 representa la serie de tokens.

![Gráfico de líneas en escala logarítmica de los tokens procesados por mes en Google: 9,7 billones en 2024, unos 480 billones en 2025 y más de 3,2 mil billones en mayo de 2026, declarado por la empresa.](/figures/ai-coding-market/tokens.svg)

*Figura 2. Tokens procesados por mes en Google. Figura de datos, declarado por la empresa, escala logarítmica. Fuente: Pichai [8]; la nota sobre el uso de tokens es de Bai, Huang y Wang [9]. Se ofrece una [copia PNG](/figures/ai-coding-market/tokens.png).*

<div id="25-price-per-token" class="anchor-alias" aria-hidden="true"></div>

### 2.5 Precio por token

| Afirmación | Número | Etiqueta | Fuente |
|---|---|---|---|
| Coste de un nivel fijo de rendimiento de IA | baja alrededor de un 47% por trimestre, unas 13 veces al año, desde 2023 | Serie de precios medida (cinco benchmarks) | Epoch AI [4] |
| Precio para alcanzar una puntuación fija en un benchmark | cae de 9 a 900 veces al año, según el hito; las caídas más rápidas son las más recientes y las menos seguras de persistir | Serie de precios medida (ajustes log-lineales) | Epoch AI [34] |
| Coste de inferencia a rendimiento equivalente | baja unas 10 veces al año: de 60 dólares por millón de tokens en 2021 a 0,06 dólares | Estimación | Appenzeller, a16z [20] |
| Rebaja del precio de la API de DeepSeek, 29 de septiembre de 2025 | coste para los desarrolladores "reducido en más del 50%" | Declarado por la empresa | DeepSeek [21] |

Las 13 veces al año de [4] son un punto dentro de un rango amplio [34]. La caída la impulsan la competencia y los pesos abiertos, como muestra la rebaja de DeepSeek [21]. No necesita ninguna contabilidad energética. Es el primero de los dos descensos de la sección 5. La reutilización añade otro distinto: las llamadas por tarea.

La Figura 3 dibuja las dos series de precios.

![Gráfico en escala logarítmica del precio por millón de tokens a capacidad fija. Una estimación de a16z cae de 60 dólares en 2021 a 0,06 dólares en 2024, unas diez veces al año. Una pendiente discontinua de Epoch AI de unas trece veces al año desde 2023 se dibuja indexada a diez dólares en 2023.](/figures/ai-coding-market/price-trend.svg)

*Figura 3. Precio de un nivel fijo de capacidad. Figura de datos, escala logarítmica: los extremos de a16z son los publicados [20]; la línea de Epoch AI es la tasa declarada de unas 13 veces al año desde 2023 [4], indexada a un inicio arbitrario solo para mostrar la pendiente. El rango por hito procede de Epoch AI [34]. Se ofrece una [copia PNG](/figures/ai-coding-market/price-trend.png).*

<div id="26-energy-and-capital" class="anchor-alias" aria-hidden="true"></div>

### 2.6 Energía y capital

| Afirmación | Número | Etiqueta | Fuente |
|---|---|---|---|
| Electricidad de centros de datos, 2024 | unos 415 TWh, alrededor del 1,5% de la electricidad mundial | Estimación | IEA, *Energy and AI* [11] |
| Electricidad de centros de datos, 2030 | unos 945 TWh, escenario base | Proyección | [11] |
| Electricidad de centros de datos, de 2025 a 2030 | de 485 TWh a 950 TWh, alrededor del 3% de la demanda mundial | Estimación y proyección | IEA, *Key Questions on Energy and AI* [10] |
| Inversión de capital de las mayores empresas tecnológicas | más de 400.000 millones de dólares en 2025, con un aumento previsto de otro 75% en 2026 | Declarado y proyectado | [10] |
| Inversión de capital de Alphabet | 31.000 millones de dólares en 2022; entre 180.000 y 190.000 millones previstos en 2026 | Declarado por la empresa y previsión | Pichai [8] |
| Energía por tarea | baja al menos un orden de magnitud al año; las tareas de razonamiento y agénticas usan "cientos o miles de veces más energía por consulta que la generación de texto simple" | Estimación | [10] |
| Una instrucción de texto mediana a un asistente en producción | 0,24 Wh | Medido por el operador | Elsworth et al. [12] |
| Stargate | 500.000 millones de dólares en cuatro años para la infraestructura de IA de un laboratorio, con 100.000 millones desplegados de inmediato | Anunciado por la empresa | OpenAI [22] |
| Gasto mundial en IA, 2025 | alrededor de 1,5 billones de dólares | Proyección | Gartner [24] |
| Ingresos que la inversión de capital debe recuperar | "AI's 600B Question" | Análisis | Sequoia Capital [23] |

La renta que hay que servir es renta de hardware. Inversiones y compromisos de este tamaño se amortizan mediante un uso con precio superior a su energía. En las tareas que pueden cerrarse por reutilización, esa base es más pequeña.

<div id="27-productivity-evidence" class="anchor-alias" aria-hidden="true"></div>

### 2.7 Evidencia de productividad

| Estudio | n | Diseño | Efecto | Fuente |
|---|---|---|---|---|
| Ensayo de a16z | entrevistas | Estimación | alrededor del 20% para un asistente simple; "al menos el doble" lo mejor de su clase | [1] |
| GitHub Copilot, tarea de servidor HTTP | desarrolladores reclutados | Experimento controlado | 55,8% más rápido en una tarea de juguete | Peng et al. [27] |
| Ensayo empresarial de Google | 96 ingenieros | Ensayo controlado aleatorizado | alrededor de un 21% menos de tiempo en la tarea | Paradis et al. [28] |
| METR, principios de 2025 | 16 desarrolladores experimentados de código abierto, 246 tareas | Ensayo controlado aleatorizado | 19% más lentos con IA | Becker et al. [25] |
| METR, actualización de 2026 | nueva cohorte | Ensayo controlado aleatorizado | los autores llaman a los nuevos datos "una señal poco fiable" | METR [26] |

Los efectos medidos van de una ralentización del 19% a una aceleración del 56% en una tarea de juguete. Los dos factores de la estimación de valor, el recuento de desarrolladores y el múltiplo de productividad, son blandos. Eso debilita el billón. También significa que cualquier valor liberado por una programación más barata no es un número conocido.

<div id="3-what-the-projections-assume" class="anchor-alias" aria-hidden="true"></div>

## 3. Lo que suponen las proyecciones

Leídas en conjunto, las proyecciones descansan sobre cuatro supuestos. Cada uno es un enunciado sobre una dirección del espacio de diseño, no sobre el valor del software.

1. **Una sola dirección: la generación.** Cada cambio lo escribe un modelo. La estimación de valor escala la productividad por el modelo, y la ilustración de costes pone precio a cada consulta [1].
2. **Alta energía y alto cómputo.** Se proyecta que el volumen de tokens, la electricidad de los centros de datos y la inversión de capital crezcan juntos [8, 10, 11]. La energía por consulta cae, y los tokens por tarea suben más deprisa [9, 10].
3. **Renta por token.** Los ingresos se facturan por token o por puesto cuyo coste son tokens. Se proyecta que el coste anual en tokens de un desarrollador alcance la escala de un salario [1].
4. **La IA en el bucle para siempre.** La tarea 10.000 cuesta lo que cuesta la tarea 1, porque nada de lo que el modelo aprendió en la tarea 1 se ejecuta sin el modelo en la tarea 10.000.

El ensayo que enuncia el billón también enuncia su límite: "aunque la fijación de precios por sustitución funciona en los mercados incipientes, al final el coste de un bien converge a su coste marginal, y lo mismo ocurre con el precio" [1]. Este ensayo está de acuerdo, y pregunta cuál es el coste marginal de una tarea de programación correcta.

<div id="4-what-a-correct-task-costs" class="anchor-alias" aria-hidden="true"></div>

## 4. Cuánto cuesta una tarea correcta

Defínase, para una tarea de programación, $C \in \{0, 1\}$ el resultado de su comprobación de aceptación (pasan las pruebas, se verifica una demostración o una salida coincide con una referencia), $J$ la energía usada para alcanzar $C = 1$, en julios, $c_J$ el precio de la energía, en dólares por julio, y $c_{\text{check}}$ el coste de ejecutar la comprobación, en dólares. Un comprador paga por $C = 1$, no por tokens.

**La energía acota el coste marginal.** El coste marginal de una ejecución es al menos $c_J J$, porque hay que comprar la electricidad. Bajo competencia, el precio tiende al coste marginal [1, 14].

**Gran parte del código se reutiliza.** Gurevich demostró que todo algoritmo secuencial queda capturado por una máquina de estados abstracta secuencial: un conjunto de estados y una regla de transición [35]. Lopes y colegas midieron que alrededor del 70% del código en GitHub consiste en clones de archivos creados previamente [36]. Donde ya existe una solución que pasa, una tarea puede cerrarse recuperándola y comprobándola en lugar de generarla de nuevo.

**Proposición E0 (precio de una tarea cubierta).** Dígase que una tarea está cubierta cuando una solución almacenada pasa su comprobación. Sea $J_{\text{floor}}$ la energía para recuperar, aplicar y comprobar esa solución. Bajo competencia entre vendedores cuyos resultados pasan la misma comprobación, el precio de una tarea cubierta tiende hacia

$$p_{\text{covered}} \to c_J \, J_{\text{floor}} + c_{\text{check}}.$$

La generación solo hace falta en las tareas no cubiertas. Para un flujo de tareas con fracción cubierta $f \in [0, 1]$ y coste medio de generación $p_{\text{gen}}$ en las tareas no cubiertas, el precio esperado por tarea es $\bar p = f \, p_{\text{covered}} + (1 - f) \, p_{\text{gen}}$. La fracción $f$ aún no está medida (Proposición E4).

<div id="5-where-the-projections-are-fragile" class="anchor-alias" aria-hidden="true"></div>

## 5. Dónde son frágiles las proyecciones

**Precios por token.** Una tarea cerrada por reutilización no necesita tokens, así que una línea de ingresos con precio por token no gana nada en ella. Los ingresos totales por tokens en un flujo de tareas escalan con $1 - f$.

**El modelo en cada bucle.** Si una solución encontrada una vez se almacena y se comprueba, las tareas posteriores de la misma forma no necesitan el modelo, así que las llamadas a modelo por tarea caen a medida que crece $f$. Si lo hacen en el trabajo real lo mide la Proposición E3.

**Energía por tarea.** Una instrucción de texto mediana a un asistente en producción la mide su operador en 0,24 Wh, o 864 J [12], y la IEA sitúa las consultas de razonamiento y agénticas en cientos o miles de veces la energía de una simple [10]. No hay ninguna medición pública que compare generación y recuperación en las mismas tareas, así que aquí no se enuncia ninguna razón.

**Dos descensos se multiplican.** Escríbase el coste por tarea como $p = n \cdot q$, con $n$ llamadas a modelo por tarea y $q$ dólares por llamada. El precio por llamada a rendimiento fijo cae por un factor de 9 a 900 al año, según la tarea [4, 34]. La reutilización baja $n$. Una proyección que extrapola el volumen de tokens solo modela $q$.

**Empaquetado.** Un bien cuyo coste marginal está cerca de cero, y que complementa una herramienta que la gente ya tiene, tiende a empaquetarse en esa herramienta, y su precio separado desaparece [13, 14]. Nalebuff mostró que un paquete puede disuadir la entrada [32], y Adams y Yellen que puede discriminar en precio [33]; Spolsky describió la estrategia de mercantilizar un complemento [31]. Los cambios de precios son visibles: GitHub pasó los planes individuales de Copilot a facturación por uso a partir del 1 de junio de 2026 [30], y Cursor pasó Pro de límites de solicitudes a precios de API repercutidos en 2025 [18].

**Lo que sobrevive.** La estimación de valor de la sección 2.1 puede mantenerse. Lo frágil es el supuesto de que el valor se cobra como un cargo sobre la generación, porque ese cargo solo se aplica a la fracción $1 - f$.

<div id="6-demand" class="anchor-alias" aria-hidden="true"></div>

## 6. Demanda

Tareas más baratas pueden aumentar la demanda total. El ensayo de capital riesgo lo espera: "we believe Jevon's Paradox in this case holds" [1]. Hay que separar dos efectos. La demanda de una tarea se detiene una vez que $C = 1$. El uso total aún puede crecer, porque un trabajo más barato abre tareas nuevas. La única elasticidad publicada es pequeña. Entre tareas de la muestra de la API de Anthropic, cada aumento del 1% en el coste se asocia con una disminución del 0,29% en la frecuencia de uso, una elasticidad de $\varepsilon \approx -0.29$ [29]. Es una relación transversal entre tareas, no un cambio de precio en el tiempo. Con $|\varepsilon| < 1$, una bajada de precio sobre un conjunto fijo de tareas reduce los ingresos, porque los ingresos $R = pQ$ cambian según $dR/R = (1 + \varepsilon)\, dp/p$.

<div id="7-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 7. Proposiciones y protocolos

**Proposición E1 (las curvas de coste se cruzan).** Para un flujo de tareas en un repositorio, el coste acumulado por tarea resuelta de un método que almacena y reutiliza soluciones comprobadas cae por debajo del de un método que genera cada cambio, tras un número finito de tareas. *Protocolo:* ejecutar ambos sobre el mismo flujo de incidencias bajo un medidor de potencia externo. Informar de `measured_j` y de los dólares por tarea resuelta según el índice de la tarea, y del índice de cruce.

**Proposición E2 (el precio sigue al suelo).** Donde una capacidad de programación puede cerrarse por recuperación y reglas, su precio de lista cae hacia $c_J J_{\text{floor}} + c_{\text{check}}$. *Protocolo:* seguir en el tiempo los precios de lista de una clase de capacidad de ese tipo frente a su energía de ejecución medida.

**Proposición E3 (la parte de los tokens en el coste).** En un repositorio donde la reutilización crece, la parte del coste de la tarea pagada en tokens cae. *Protocolo:* registrar tokens, julios y dólares por tarea cerrada y por ronda, e informar de la parte de los tokens en el coste por ronda.

**Proposición E4 (cobertura).** La fracción cubierta $f$ del volumen real de tareas de programación es medible. *Protocolo:* extraer una muestra aleatoria de pull requests fusionadas de repositorios públicos (GitHub informa de 518,7 millones fusionadas en un año [17]), comprobar en cada una si existe una solución recuperada que pase las pruebas del repositorio, e informar de $f$ con un intervalo de Wilson del 95%.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referencias

[1] G. Appenzeller and Y. Li, "The Trillion Dollar AI Software Development Stack," 9 October 2025. https://a16z.com/the-trillion-dollar-ai-software-development-stack/

[2] Menlo Ventures, "2025: The State of Generative AI in the Enterprise," December 2025. https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/

[3] Mordor Intelligence, "AI Code Tools Market Size, Share and 2031 Growth Trends Report," fetched 11 October 2026. https://www.mordorintelligence.com/industry-reports/artificial-intelligence-code-tools-market

[4] B. Emberson and D. Roodman, "The plunging price of thought," Epoch AI, 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

[5] Cursor, "Past, Present, and Future" (Series D announcement), 13 November 2025. https://cursor.com/blog/series-d

[6] Anthropic, "Anthropic raises \$30 billion in Series G funding at \$380 billion post-money valuation," 12 February 2026. https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation

[7] Microsoft Corporation, Form 10-Q for the quarter ended 30 September 2025, Note 3 and Item 2. https://www.sec.gov/Archives/edgar/data/789019/000119312525256321/msft-20250930.htm

[8] S. Pichai, "I/O 2026: Welcome to the agentic Gemini era," 19 May 2026. https://blog.google/innovation-and-ai/sundar-pichai-io-2026/

[9] L. Bai, Z. Huang and X. Wang, "How Do AI Agents Spend Your Money? Analyzing and Predicting Token Consumption in Agentic Coding Tasks," 2026. arXiv:2604.22750. https://arxiv.org/abs/2604.22750

[10] International Energy Agency, *Key Questions on Energy and AI*, executive summary, 2026. https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary

[11] International Energy Agency, *Energy and AI*, executive summary, April 2025. https://www.iea.org/reports/energy-and-ai/executive-summary

[12] C. Elsworth et al., "Measuring the environmental impact of delivering AI at Google Scale," 2025. arXiv:2508.15734. https://arxiv.org/abs/2508.15734

[13] Y. Bakos and E. Brynjolfsson, "Bundling Information Goods: Pricing, Profits, and Efficiency," *Management Science* 45(12), 1999. doi:10.1287/mnsc.45.12.1613

[14] C. Shapiro and H. R. Varian, *Information Rules: A Strategic Guide to the Network Economy*, Harvard Business School Press, 1998.

[15] McKinsey & Company, "The economic potential of generative AI: The next productivity frontier," June 2023. https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier

[16] Goldman Sachs, "Generative AI could raise global GDP by 7%," April 2023. https://www.goldmansachs.com/intelligence/pages/generative-ai-could-raise-global-gdp-by-7-percent.html

[17] GitHub, "Octoverse: A new developer joins GitHub every second as AI leads TypeScript to #1," 2025. https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/

[18] Cursor, "Clarifying our pricing," June 2025 pricing post. https://cursor.com/blog/june-2025-pricing

[19] Microsoft Investor Relations, FY26 Q1 Performance. https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/performance

[20] G. Appenzeller, "Welcome to LLMflation: LLM inference cost is going down fast," a16z, November 2024. https://a16z.com/llmflation-llm-inference-cost/

[21] DeepSeek, DeepSeek-V3.2-Exp release and API price reduction, 29 September 2025 (in Chinese). https://api-docs.deepseek.com/zh-cn/news/news250929

[22] OpenAI, "Announcing The Stargate Project," 21 January 2025. https://openai.com/index/announcing-the-stargate-project/

[23] D. Cahn, "AI's \$600B Question," Sequoia Capital, 2024. https://www.sequoiacap.com/article/ais-600b-question/

[24] Gartner, "Gartner Says Worldwide AI Spending Will Total \$1.5 Trillion in 2025," 17 September 2025. https://www.gartner.com/en/newsroom/press-releases/2025-09-17-gartner-says-worldwide-ai-spending-will-total-1-point-5-trillion-in-2025

[25] J. Becker, N. Rush, E. Barnes and D. Rein, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity," METR, 2025. arXiv:2507.09089. https://arxiv.org/abs/2507.09089

[26] METR, uplift study update, 24 February 2026. https://metr.org/blog/2026-02-24-uplift-update/

[27] S. Peng, E. Kalliamvakou, P. Cihon and M. Demirer, "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot," 2023. arXiv:2302.06590. https://arxiv.org/abs/2302.06590

[28] E. Paradis, K. Grey, Q. Madison et al., "How much does AI impact development speed? An enterprise-based randomized controlled trial," 2024. arXiv:2410.12944. https://arxiv.org/abs/2410.12944

[29] Anthropic, "Anthropic Economic Index report: Uneven geographic and enterprise AI adoption," September 2025. https://www.anthropic.com/research/anthropic-economic-index-september-2025-report

[30] GitHub Japan blog, "GitHub Copilotの個人向けプラン: ProとPro+へのフレックス枠追加と新しいMaxプランのご紹介," 15 May 2026 (in Japanese). https://github.blog/jp/2026-05-15-github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/

[31] J. Spolsky, "Strategy Letter V," Joel on Software, 12 June 2002. https://www.joelonsoftware.com/2002/06/12/strategy-letter-v/

[32] B. Nalebuff, "Bundling as an Entry Barrier," *Quarterly Journal of Economics* 119(1), 2004. doi:10.1162/003355304772839551

[33] W. J. Adams and J. L. Yellen, "Commodity Bundling and the Burden of Monopoly," *Quarterly Journal of Economics* 90(3), 1976. doi:10.2307/1886045

[34] Epoch AI, "LLM inference prices have fallen rapidly but unequally across tasks," data insight. https://epoch.ai/data-insights/llm-inference-price-trends

[35] Y. Gurevich, "Sequential abstract-state machines capture sequential algorithms," *ACM Transactions on Computational Logic* 1(1), 2000, pp. 77 to 111. doi:10.1145/343369.343384

[36] C. V. Lopes, P. Maj, P. Martins, V. Saini, D. Yang, J. Zitny, H. Sajnani and J. Vitek, "DéjàVu: a map of code duplicates on GitHub," *Proceedings of the ACM on Programming Languages* 1(OOPSLA), 2017, article 84. doi:10.1145/3133908
