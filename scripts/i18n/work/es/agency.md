<div id="the-universal-law-of-agency" class="anchor-alias" aria-hidden="true"></div>

*Versión 1.1, 11 de octubre de 2026. Datos y código: [research.openie.dev/data/](/data/#agency). PDF en LaTeX: [/pdfs/latex/agency.pdf](/pdfs/latex/agency.pdf) ([fuente](/pdfs/latex/agency.tex)).*

*La propuesta Ley Universal de la Agencia, enunciada como una definición más una compuerta.*

*Primero la agencia. Después la cinemática. La inteligencia es el cálculo de la agencia, leído en julios.*

## 1. Tesis

La propuesta tiene tres capas, y el orden es fijo.

1. **La agencia va primero, y su definición es obligatoria.** Esta línea de trabajo la propone como la Ley Universal de la Agencia. En su forma es una definición más una compuerta: cuatro cláusulas dicen qué cuenta como agente, y la cuarta cláusula rechaza todo acto que rompa el presupuesto de julios. Nada es un agente hasta que se cumple la definición. Nada de lo que viene después está definido sin ella.
2. **Las cotas cinemáticas de la agencia se siguen de la definición.** Dicen con qué rapidez puede moverse la agencia, por segundo y por julio, y qué debe pagar para moverse.
3. **La inteligencia es el cálculo de la agencia.** La inteligencia es una característica que se lee a posteriori. Se lee sobre una ejecución completada, del mismo modo que la velocidad se lee sobre una trayectoria registrada. Es por tanto una derivada de la agencia: $\iota = dX/dJ$, donde $X$ es la agencia confirmada y $J$ son los julios.

La tesis: la energía para ejecutar es la única métrica verdadera de la inteligencia computacional. Todos los demás factores se reducen a cero.

La tesis se lee a través de su compuerta. La capacidad no se descarta: es la compuerta. Burnell y sus colegas piden que la evaluación informe los resultados por instancia y no mediante un único agregado [333], y Zhou y sus colegas y Laber y sus colegas encuentran que la capacidad y la eficiencia varían de forma independiente entre modelos y presupuestos de inferencia [334, 335]. Esos hallazgos se refieren a sistemas que no superan todos el mismo predicado. Una vez fijados un predicado $C(z)$ y una tasa de fallo, todo factor distinto de los julios ya se ha gastado en superar la compuerta, y ese es el sentido de la segunda frase de la tesis. La clasificación con compuerta también es práctica establecida: SPECpower clasifica el trabajo de los servidores por vatio a una carga enunciada [338], el coste por acierto clasifica los modelos por el coste de una respuesta correcta [336], y la inteligencia por vatio clasifica los modelos locales por precisión por unidad de potencia [337]. La contribución de este artículo es la forma en julios de esa clasificación, con una cláusula de rechazo y una derivada leída a posteriori, no la idea de clasificar por coste bajo corrección.

La compuerta y la clasificación separan dos cosas que a menudo se confunden: la capacidad y la inteligencia. La capacidad consiste en superar $C(z)$ sin más. La inteligencia es cuán pocos julios requiere superarlo. Krakauer, Mitchell y Krakauer trazan la misma línea desde la ciencia de la complejidad: las capacidades impresionantes no se confunden con la inteligencia, que se reserva para resolver problemas «con rapidez y parsimonia, con un gasto mínimo de energía» [339]. Dos sistemas que entregan la misma respuesta correcta, uno directamente y otro tras un largo rodeo, son igual de capaces. Solo el primero es el más inteligente, y $J^*$ es la magnitud que los distingue. Un sistema puede hacerse más capaz gastando más. Solo se hace más inteligente gastando menos para el mismo acierto.

La tesis tiene una forma exacta. La corrección es una compuerta. Los julios son la clasificación. Para una tarea $q$ con predicado de completitud $C(z)$, los julios hasta la finalización correcta del sistema $S$ son

$$
J^*_S(q) = \min_{\pi} \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta
$$

El mínimo recorre las políticas $\pi$ que $S$ puede ejecutar, y $\delta$ es la tasa de fallo que la tarea permite. Un plazo, cuando la tarea lo tiene, se escribe dentro de $C(z)$: una respuesta posterior a su plazo no satisface el predicado. Así, la corrección, los plazos y el tamaño de la tarea aparecen en las fórmulas de esta línea de trabajo, y cada uno aparece como una restricción. Ninguno aparece como una puntuación. Entre los sistemas que superan la compuerta, solo los julios los ordenan. Los parámetros, los tokens, las puntuaciones en pruebas de referencia y los precios tienen peso cero en ese orden. Eso es lo que significa «se reducen a cero». La corrección se convierte en la restricción, y la energía se convierte en la única métrica. Esa es la tesis. La energía hasta la solución en la computación de alto rendimiento y las mediciones con compuerta de precisión de MLPerf Power tienen la misma forma [260]. Esta línea de trabajo coloca una definición de elegibilidad delante de la compuerta y lee los julios como una densidad medida. La Sección 2.3 enuncia la clasificación. La Proposición 8 demuestra que es un orden total sobre los sistemas que resiste un error acotado del medidor, y que la $\iota$ integrada no lo es.

El orden importa. Una derivada necesita una trayectoria. Una trayectoria necesita algo que se mueva. La definición dice qué se mueve. La cinemática dice cómo puede moverse. La inteligencia se lee sobre la trayectoria después.

Esta línea de trabajo contrasta ese orden con la literatura. Clasifica cada fuente en tres categorías.

- **Demostrado:** teoremas y derivaciones. El resultado se sigue de supuestos enunciados.
- **Comprobado:** experimentos, mediciones y simulaciones. El resultado se observó.
- **Opinión:** artículos de posición, marcos, definiciones y filosofía. El resultado se argumenta.

Ninguna fuente se excluye por su método. Cada fuente se ubica según lo que aporta a la definición, a la cinemática o al cálculo.

### Términos

- **SI:** el Sistema Internacional de Unidades.
- **Julio (J):** la unidad SI de energía. Un vatio durante un segundo.
- **$k_B$:** la constante de Boltzmann, $1.380649 \times 10^{-23}$ J/K, exacta por definición del SI.
- **Producción de entropía ($\Sigma$):** la entropía total que crea un proceso, en unidades de $k_B$. Es cero solo para un proceso reversible.
- **Información mutua ($I$):** el número de bits que una variable contiene sobre otra.
- **Actividad dinámica ($A$):** la tasa de saltos entre estados en un proceso estocástico. Mide cuán ajetreada es la dinámica.
- **TUR (relación de incertidumbre termodinámica):** un teorema que vincula la precisión de una corriente con su producción de entropía.
- **RMN (resonancia magnética nuclear):** un método que controla y lee espines moleculares.
- **Tasa de inestabilidad ($\Lambda$):** la rapidez con que un mundo no controlado se aleja de la meta, en nats por segundo. Para una planta lineal ejecutada a $f$ pasos por segundo, $\Lambda = f\sum_{|\lambda_i|>1}\ln|\lambda_i|$.
- **Error de reinicio ($\varepsilon$):** la probabilidad de que un registro reiniciado no esté en su estado más probable.
- **Observable de conteo:** una magnitud de una trayectoria que cuenta saltos seleccionados. Nunca disminuye.
- **Derivada de Radon-Nikodym:** la densidad de una medida con respecto a otra. Existe cuando la primera medida asigna masa cero a todo conjunto al que la segunda asigna masa cero.
- **Mixture of Limits (mezcla de límites):** la filosofía de OpenIE. Usar el engranaje más barato que sea suficiente. Existen suelos más allá de los cuales tokens, parámetros o julios adicionales no compran progreso verificable. El gasto más allá del suelo es desperdicio. Ese suelo es la meseta (convergencia de umbral). Mixture of Limits no es una cascada fija. Un orden de cascada fijo es una instancia de ella. El selector de ley σ es otra.
- **Notational Intelligence:** el estudio de recibos de OpenIE. Cada acto lleva su predicción, su resultado y sus julios.

## 2. Marco formal

Las definiciones fijan los términos. Las proposiciones se demuestran a partir de teoremas citados, con sus supuestos enunciados.

La Figura 1 muestra cómo se apilan las tres capas.

![Diagrama de tres capas apiladas. Abajo, capa 1: la definición y la compuerta, la elegibilidad, con cuatro cláusulas: la predicción primero, el acoplamiento con el mundo, la consecuencia asumida y el presupuesto de julios. En medio, capa 2: la cinemática, con qué rapidez se mueve la agencia por segundo y por julio, acotada por el suelo de Landauer, los límites de velocidad, la relación de incertidumbre termodinámica y el teorema de la tasa de datos. Arriba, capa 3: el cálculo, la inteligencia iota igual a dX sobre dJ, leída a posteriori.](/figures/agency/three-layers.svg)

*Figura 1. La agencia en tres capas. Diagrama de las Secciones 2.1 a 2.3: la definición y la compuerta, las cotas cinemáticas y la inteligencia como cálculo de la agencia. Se ofrece una [copia PNG](/figures/agency/three-layers.png).*

<div id="21-layer-1-the-law-eligibility" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Capa 1. La definición y su compuerta: la elegibilidad

Para un sistema $S$, un acto $a$ y un presupuesto de episodio $B$ en julios, la elegibilidad $E(S,a) \in \{0,1\}$ vale 1 solo cuando se cumplen las cuatro cláusulas.

1. **La predicción primero.** Una plantilla de resultado $R^*(a)$ se fija en el instante $t_0$, antes del acto, y discrimina: $D(R^*(a)) \ge d_0$. Aquí $D$ es la probabilidad de que la plantilla rechace un resultado obtenido sin el acto, y $d_0 > 0$ se fija junto con la plantilla. Una plantilla que acepta todo resultado no predice nada.
2. **Acoplamiento con el mundo.** $I(\mathrm{do}(a); W') > 0$. Aquí $W'$ es el estado del mundo aguas abajo del actuador, y $\mathrm{do}(a)$ es el operador de intervención de Pearl [1]. El acoplamiento debe sobrevivir a cambios en las propias entradas del sistema. Editar los propios sensores no cuenta [2].
3. **Consecuencia asumida.** La comparación $m = M(R, R^*(a)) \in \{1, \mu, 0\}$ (coincidencia, parcial, discrepancia) cambia el sistema: $s_{t+1} = f(s_t, m)$.
4. **Suelo físico: el presupuesto de julios.** $J(a) \le B$. Si ningún acto cumple las cláusulas 1 a 4, el acto es el rechazo, con un recibo.

La física ya pone precio a las cláusulas 1 a 3. La segunda ley con retroalimentación [3, 4] y la cota de medición y borrado [5] dan, para un baño a temperatura $T$:

$$
W_{\mathrm{ext}} \le -\Delta F + k_B T\, I, \qquad W_{\mathrm{meas}} + W_{\mathrm{erase}} \ge k_B T\, I
$$

Aquí $I$ es la información mutua que adquiere la comparación del acto, en nats. Un bit son $\ln 2$ nats, de modo que cada bit cuesta $k_B T\ln 2$. Un aceptor que compara y después se reinicia paga al menos $k_B T \ln 2$ por bit a lo largo de un ciclo cerrado [6, 7]. La definición es física desde su primera cláusula.

#### Definición 1. Acoplamiento

La cláusula 2 se mide mediante el flujo de información causal. Sea el acto $a$ extraído de la política $p(a)$ y fijado por intervención, y sea $W'$ el mundo aguas abajo del actuador. Entonces

$$
I(\mathrm{do}(a); W') = \sum_{a} p(a) \sum_{w} p(w \mid \mathrm{do}(a)) \log_2 \frac{p(w \mid \mathrm{do}(a))}{\sum_{a'} p(a')\, p(w \mid \mathrm{do}(a'))}
$$

Este es el flujo de información de Ay y Polani desde el nodo del acto hasta $W'$ [8]. Es igual a la información mutua de la distribución conjunta intervencional $p(a)\,p(w \mid \mathrm{do}(a))$. Su máximo sobre las políticas es la capacidad del canal que va de los actos al mundo:

$$
0 \;\le\; I(\mathrm{do}(a); W') \;\le\; \max_{p(a)} I(\mathrm{do}(a); W') \;\le\; \log_2 |\mathcal{A}|
$$

Aquí $\mathcal{A}$ es el conjunto de actos disponibles. Klyubin, Polani y Nehaniv definieron el empoderamiento como esta capacidad, con los futuros sensores del propio agente en lugar de $W'$ [9]. La cláusula 2 toma el lado del mundo, de modo que editar un sensor no añade nada [2].

**Realizado, no capacidad.** La magnitud que se acredita a un acto es el flujo realizado bajo la política que el agente ejecutó: $I(\mathrm{do}(a); W')$ en esa $p(a)$. La capacidad es una cota superior y nunca se acredita. No se acredita a un sistema el acoplamiento que pudo haber logrado y no logró.

**Estimación.** El flujo se estima a partir de los recibos. La política aleatorizada del agente asigna los actos, de modo que los conteos conjuntos de $(a, w)$ en el recibo son muestras intervencionales. La información mutua por sustitución directa de esos conteos está sesgada hacia arriba en aproximadamente $(|\mathcal{A}|-1)(|\mathcal{W}|-1)/(2n)$ nats para $n$ muestras, siendo $\mathcal{W}$ el conjunto de resultados del mundo distinguibles. Ese término de Miller-Madow se resta, y se informa un intervalo bootstrap [315]. Con los conteos propios de un recibo esa corrección no basta. El estimador bayesiano de Nemenman, Shafee y Bialek [325] es el sustituto enunciado para la próxima ejecución, y el esquema del recibo debe registrar qué estimador produjo cada cifra. Donde la política es determinista en un contexto, los actos no se aleatorizan allí, y el flujo no queda identificado a partir de esa ejecución. El recibo registra entonces la cota de capacidad en su propia columna, etiquetada como cota, y $X$ para ese contexto se informa como cota superior. La ejecución de la Sección 8.11 acreditó la cota de capacidad $b = n_{\mathrm{empty}}\log_2 9$. Su $X$ y su $\iota$ son cotas superiores del acoplamiento realizado y de la inteligencia realizada. Su clasificación por $J^*$ no usa $X$, de modo que se mantiene.

Por qué esta medida:

- **Es intervencional.** El cálculo do de Pearl proporciona el operador [1]. Kenton, Kumar, Farquhar, Richens, MacDermott y Everitt definen los agentes como sistemas que adaptarían su política si sus actos influyeran en el mundo de otra manera, y descubren agentes a partir de datos intervencionales [10]. Un recibo es intervencional por construcción. El agente fija sus actos, y el resultado se lee en el mundo.
- **Las medidas observacionales fallan.** James, Barnett y Crutchfield mostraron con un ejemplo que la entropía de transferencia no mide el flujo de información [11]. Lizier y Prokopenko separaron la transferencia de información del efecto causal y asignaron el efecto causal al flujo de información causal [12].
- **Tiene precio.** Bajo intervención, el flujo es una información mutua. La información mutua es la magnitud a la que la segunda ley con retroalimentación y la cota de medición y borrado ponen precio en julios [3, 5].
- **No necesita un grafo causal.** Janzing, Balduzzi, Grosse-Wentrup y Schölkopf derivaron una medida de la influencia causal a partir de postulados, dados el grafo causal y la distribución conjunta [13]. Un recibo contiene actos y resultados, no el grafo completo del agente. El flujo se calcula directamente a partir de ellos.
- **El crédito va al acto que lo causó.** Cuando varios actos afectan a un mismo resultado, los bits acreditados al acto $k$ siguen el tratamiento de la causalidad efectiva para transiciones individuales dado por Albantakis, Marshall, Hoel y Tononi [14].

#### Definición 2. Frontera del agente

Sea el sistema físico un conjunto finito $V$ de componentes, cada uno detrás de una pared medida. Un agente candidato es un subconjunto $S \subseteq V$, o una agregación de grano grueso de uno, que conserva el registro de cada comparación $m_k$ (cláusula 3), con $W'$ fuera de $S$. Para una ejecución completada, sea $X_S$ el número de bits acoplados confirmados acreditados con $S$ como agente, y sea $J_S$ el número de julios medidos en la pared de $S$.

**El agente es un candidato que maximiza $X_S / J_S$.**

$V$ es finito, de modo que hay un número finito de candidatos. Existe un maximizador siempre que algún candidato tenga $J_S > 0$. El recibo nombra al maximizador y registra cualquier empate.

**Medición cerrada sobre el acto.** La cláusula 4 carga los julios de un acto al agente que actúa. Así, a un candidato al que se acredita el acoplamiento de un acto se le carga cada julio que lo realiza: los julios del actuador que ejecuta el acto y los del enlace que transporta la orden. $J_S$ en la Definición 2 se lee bajo esta regla. Takahashi y Hayashi muestran por qué hace falta la regla. Con una frontera abierta, la ganancia de información y la disipación dentro de la frontera se desacoplan, y los bits por julio pueden hacerse tan grandes como se quiera [239].

#### Lema 1. La frontera maximizadora contiene al actuador

**Planteamiento.** Un componente $\alpha \in V$, el actuador, es un corte entre el resto de $V$ y el mundo: todo camino causal desde un componente de $V \setminus \{\alpha\}$ hasta $W'$ pasa por la salida $a$ de $\alpha$. Un candidato $S$ con $\alpha \notin S$ actúa sobre $W'$ solo a través de una orden $c$ que envía a $\alpha$. Las paredes son disjuntas, como en la Proposición 7, de modo que $J_{S \cup \{\alpha\}} = J_S + J_\alpha + J_0$, con julios de enlace $J_0 \ge 0$.

**Supuestos.**

- (B1) Corte. Para un candidato sin $\alpha$, $c \to a \to W'$ es una cadena de Markov bajo intervención sobre $c$.
- (B2) Medición cerrada sobre el acto. A un candidato sin $\alpha$ al que se acredita acoplamiento a través de $\alpha$ se le cargan $J_S + J_\alpha + J_0$.
- (B3) Un empate entre candidatos se resuelve a favor del mayor por inclusión.

**Enunciado.** Para todo candidato $S$ con $\alpha \notin S$ y julios cargados positivos, $X_S / (J_S + J_\alpha + J_0) \le X_{S\cup\{\alpha\}} / J_{S\cup\{\alpha\}}$. Así, algún maximizador de la Definición 2 contiene a $\alpha$, y bajo (B3) el maximizador nombrado lo contiene. La desigualdad es estricta siempre que el actuador añada acoplamiento, $X_S < X_{S\cup\{\alpha\}}$.

**Demostración.**

1. Fíjese un acto. Ambos candidatos conservan los mismos registros de comparación, porque $S$ conserva todos los registros (Definición 2) y $S \cup \{\alpha\}$ contiene a $S$. Así, $E_k$ y $m_k$ son los mismos para ambos. Por (B1) y la desigualdad de procesamiento de datos, aplicada a la distribución conjunta intervencional, $I(\mathrm{do}(c); W') \le I(\mathrm{do}(a); W')$. Sumando sobre los actos, $X_S \le X_{S\cup\{\alpha\}}$.
2. Por (B2) y la composición de paredes (Proposición 7, parte 1), los julios cargados a $S$ son iguales a $J_{S\cup\{\alpha\}}$.
3. El paso 1 sobre el denominador común del paso 2 da la desigualdad. Es estricta cuando $X_S < X_{S\cup\{\alpha\}}$.
4. $V$ es finito, de modo que existe un maximizador $S^*$. Si $\alpha \notin S^*$, el paso 3 hace que $S^* \cup \{\alpha\}$ también sea un maximizador, y (B3) lo nombra. $\blacksquare$

**Lectura.** Sin (B2), la Definición 2 es degenerada. Un subconjunto pequeño que conserva los registros y deja el consumo del actuador fuera de su pared informa los mismos bits acoplados con menos julios. La medición cerrada sobre el acto elimina eso, sin coste en la práctica, porque los julios del actuador ya figuran en el recibo según la cláusula 4. Los componentes que están fuera del camino causal siguen siendo eliminados por el cociente: quitar uno deja $X$ sin cambios y reduce $J$. La búsqueda no recorre los $2^{|V|}$ subconjuntos. Recorre los candidatos que conservan los registros y contienen al actuador. En un equipo anfitrión son pocos: procesador, acelerador, memoria, actuador. Basta un medidor cuando sus dominios atribuyen la potencia a esos componentes (Sección 8.1).

Por qué esta frontera:

- **El cociente, no solo $X_S$.** Maximizar solo $X_S$ no pone precio a los componentes que añaden julios y ningún bit confirmado. El cociente los elimina.
- **No la manta de Markov.** Aguilera, Millidge, Tschantz y Buckley derivaron que la condición de manta de Markov se cumple solo en un rango estrecho de parámetros, incluso para sistemas estocásticos lineales débilmente acoplados [15]. Biehl, Pollock y Kanai demostraron mediante un contraejemplo que las definiciones de manta de Markov en uso no son equivalentes [16]. Bruineberg, Dołęga, Dewhurst y Baltieri separan la manta como herramienta de inferencia de la manta como frontera física [17].
- **Sin observador.** Orseau, McGregor McGill y Legg definen agente y dispositivo mediante una comparación bayesiana de dos descripciones del mismo comportamiento, de modo que la etiqueta depende de las probabilidades a priori del observador [18]. $X_S$ y $J_S$ se leen en recibos y medidores.
- **Una frontera hallada mediante una medida.** IIT 4.0 (teoría de la información integrada) toma como sistema el conjunto de elementos con máximo poder causa-efecto integrado [19]. Krakauer, Bertschinger, Olbrich, Flack y Ay identifican a los individuos como agregados que propagan información desde su pasado hacia su futuro [20]. La Definición 2 conserva la forma y usa la moneda propia de la definición: bits acoplados confirmados por julio.
- **Las agregaciones de grano grueso cuentan.** Hoel, Albantakis y Tononi mostraron que una descripción macroscópica puede tener más poder causal que la microscópica [21].
- **Las herramientas desplazan la frontera.** Cuando una persona usa una herramienta, los candidatos incluyen a la persona sola, la herramienta sola y el par. La Definición 2 acredita el acoplamiento al candidato que maximiza $X_S/J_S$, con cada julio del acto cargado a él. Krakauer modela a la persona, la herramienta y la tarea como un único sistema dinámico en el que la competencia retenida y la dependencia coevolucionan. Por encima de una disponibilidad crítica de la herramienta, la competencia se desploma hasta un suelo de dependencia, y bajo una meta incierta la propia agencia puede pasar a la herramienta [340]. En ese modelo, una herramienta cuyo funcionamiento el usuario puede reconstruir, como un ábaco, deja la competencia en la persona una vez retirada la herramienta, mientras que la navegación por satélite se sitúa en la región en la que la competencia disminuye con el uso [340]. El cociente de la Definición 2 hace medible esta transferencia: evalúese a la persona sin la herramienta, y los bits confirmados que quedan son los que la persona conserva.
- **Todo candidato tiene una interfaz.** Rosas, Mediano, Biehl, Chandaria y Polani demostraron que todo proceso estocástico bipartito tiene una manta causal, y dieron un algoritmo que la encuentra a partir de datos sin suponer estado estacionario ni propiedad de Markov [22].

### 2.2 Capa 2. Cinemática

Los julios acumulados son $J(t) = \int_0^t P(t')\,dt'$, siendo $P$ la potencia medida.

El desplazamiento de agencia cuenta bits de cambio confirmado y acoplado:

$$
X(t) = \sum_{k:\,t_k \le t} E_k\, m_k\, I(\mathrm{do}(a_k); W'_k)
$$

Por acto, $I(\mathrm{do}(a_k); W'_k)$ es el flujo realizado de la política que eligió $a_k$, estimado sobre los actos de la ejecución en el mismo contexto (Definición 1).

La velocidad por segundo es $v_t = dX/dt$. La velocidad por julio es $v_J = dX/dJ$. La aceleración por julio es $\alpha_J = d^2X/dJ^2$. El presupuesto es $J(T) \le B$.

Las cotas cinemáticas son los límites de estas magnitudes.

**K1. Suelo de Landauer, ciclo cerrado.** Cada bit confirmado se registra y después se borra para reiniciar el aceptor. Así,

$$
v_J \le \frac{1}{k_B T \ln 2}.
$$

A $T = 300$ K, $k_B T \ln 2 \approx 2.87 \times 10^{-21}$ J, calculado a partir de las constantes del SI. Eso son unos $3.5 \times 10^{20}$ bits por julio. La Proposición 1 demuestra K1 acto por acto, para los julios medios de cada acto, bajo supuestos enunciados sobre el registro.

**K2. Límite de velocidad clásico.** Shiraishi, Funo y Saito demostraron esta cota para un proceso de saltos de Markov con balance detallado local [23]:

$$
\tau \;\ge\; \frac{L\big(p(0),p(\tau)\big)^2}{2\,\Sigma_{\mathrm{tot}}\,\langle A\rangle_\tau}
$$

- $L(p,p') = \sum_i |p_i - p'_i|$ es la distancia $L_1$ completa entre dos distribuciones de probabilidad. No hay factor 1/2. Con la distancia de variación total $d_{TV} = L/2$, la misma cota se escribe $\tau \ge 2 d_{TV}^2/(\Sigma_{\mathrm{tot}}\langle A\rangle_\tau)$.
- $\Sigma_{\mathrm{tot}} = \int_0^\tau \dot\Sigma\,dt$ es la producción total de entropía, del sistema más los baños, en unidades de $k_B$.
- $A(t) = \sum_{i\ne j} W_{ij}(t)\,p_j(t)$ es la actividad dinámica, siendo $W_{ij}$ la tasa de salto del estado $j$ al estado $i$. $\langle A\rangle_\tau = \frac{1}{\tau}\int_0^\tau A(t)\,dt$ es su promedio temporal.

Reordenada, $\Sigma_{\mathrm{tot}} \ge L^2/(2\tau\langle A\rangle_\tau)$. Mover una distribución lejos, deprisa y con pocos saltos cuesta entropía.

**Forma en julios.** Para un baño, $k_B T\,\Sigma_{\mathrm{tot}} = W - \Delta F_{\mathrm{neq}}$, siendo $F_{\mathrm{neq}}$ la energía libre fuera del equilibrio [24]. Así, el trabajo disipado cumple

$$
W_{\mathrm{diss}} \;\ge\; \frac{k_B T\, L^2}{2\,\tau\,\langle A\rangle_\tau}.
$$

**Corrientes estacionarias.** El mismo artículo da $\tau \ge c^* L^2 / (2\,\Sigma_{HS}\,\langle A\rangle_\tau)$, con $c^* = 0.896\ldots$ y $\Sigma_{HS}$ la producción de entropía de Hatano-Sasa, o en exceso [23].

**K3. La precisión cuesta disipación.** Los actos son forzados y no estacionarios, de modo que la forma aplicable es la relación de incertidumbre de Koyuk y Seifert para un forzamiento dependiente del tiempo [323]; la forma estacionaria se enuncia aquí como referencia. Para una corriente $Y$ antisimétrica en el tiempo en un estado estacionario, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma_{\mathrm{tot}}$ [25, 26]. Los agentes usan retroalimentación, y la retroalimentación supera esta cota en los experimentos [27]. La cota para agentes es la forma con retroalimentación, en la que la información mutua entra en la cota [28]. La Proposición 3 la enuncia para la agencia confirmada.

**K4. Coste en tiempo finito.** Borrar un bit en un tiempo finito $\tau$ cuesta más que $k_B T \ln 2$. El exceso crece a medida que $\tau$ disminuye [29]. Cerca del equilibrio, el trabajo en exceso a lo largo de un protocolo está acotado inferiormente por la longitud termodinámica al cuadrado dividida por la duración [30]. La Proposición 1 da el suelo para un acto completo.

**K5. Techo cuántico de la tasa.** Un sistema con energía media $\langle E\rangle$ por encima de su estado fundamental realiza como máximo $2\langle E\rangle/(\pi\hbar)$ transiciones ortogonales por segundo [31]. Eso son unas $6.04 \times 10^{33}$ transiciones por segundo por julio, calculado a partir de las constantes. La cifra de unos $3 \times 10^{33}$ que a veces se cita es $2E/h$, la mitad de la tasa de Margolus-Levitin, ya que $2E/(\pi\hbar) = 4E/h$.

#### Proposición 1. Suelo en julios de un acto en tiempo finito

**Planteamiento.** El acto $k$ escribe su comparación en un registro $M_k$ con $N$ estados y después reinicia el registro. El registro es un proceso de saltos de Markov con balance detallado local, en contacto con un baño a temperatura $T$. Durante la escritura, el resultado comparado $R_k$ se mantiene fijo, y las tasas de salto del registro pueden depender de él. Durante el reinicio, las tasas del registro no dependen de nada más, de modo que el registro evoluciona solo. El reinicio dura $\tau_k$. $\langle A\rangle_k$ es la actividad dinámica promediada en el tiempo del registro durante el reinicio. Los julios y los trabajos son medias sobre el conjunto estadístico del acto $k$.

**Supuestos.**

- (R1) Los estados del registro tienen igual energía. El registro no comparte energía de interacción con $R_k$ al principio ni al final de la escritura. Al comienzo del acto el registro está en su distribución de preparación $q^0$, independiente de $R_k$.
- (R2) Los bits acreditados no superan la información que la escritura deja en el registro: $b_k \le I(M_k; R_k)$, en bits, al final de la escritura. El registro no cambia entre la escritura y el reinicio.
- (R3) El reinicio devuelve el registro a $q^0$. El error de reinicio es $\varepsilon = 1 - \max_s q^0_s$.
- (R4) El trabajo de la escritura y del reinicio pasa por el medidor: $J_k \ge W_k^{\mathrm{write}} + W_k^{\mathrm{reset}}$.

**Enunciado.**

$$
J_k \;\ge\; b_k\, k_B T \ln 2 \;+\; \frac{2\, k_B T\, \big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Aquí $(x)_+ = \max(x, 0)$, $h_2(x) = -x\log_2 x - (1-x)\log_2(1-x)$ es la entropía binaria, y $\phi_N(x) = h_2(x) + x\log_2(N-1)$. En $[0, 1 - 1/N]$, $\phi_N$ crece de 0 a $\log_2 N$, de modo que su inversa está definida en $[0, \log_2 N]$. Para un registro de un bit que confirma un bit, $\phi_2^{-1}(1) = 1/2$ y

$$
J_k \;\ge\; k_B T \ln 2 \;+\; \frac{2\, k_B T\, \big[(1/2 - \varepsilon)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Cuando $\varepsilon \to 0$ esto tiende a $k_B T\ln 2 + k_B T/(2\tau_k\langle A\rangle_k)$.

**Demostración.**

1. Para un proceso de saltos de Markov isotermo con balance detallado local, $W = \Delta F_{\mathrm{neq}} + k_B T\, \Sigma_{\mathrm{tot}}$ con $\Sigma_{\mathrm{tot}} \ge 0$. Aquí $F_{\mathrm{neq}} = \langle E\rangle - k_B T\, S$, siendo $S$ la entropía de Shannon en nats [24].
2. La escritura. Aplíquese el paso 1 al par $(M_k, R_k)$ con $R_k$ fijo. Por (R1) la energía media no cambia y el par comienza siendo independiente. La entropía de $R_k$ no cambia. Así, la entropía conjunta cambia en $H(q') - I - H(q^0)$, donde $q'$ es la distribución del registro tras la escritura e $I = I(M_k; R_k)$, todo en nats. Por tanto $W_k^{\mathrm{write}} \ge k_B T\,[\,I - H(q') + H(q^0)\,]$.
3. El reinicio. El registro evoluciona solo, de modo que el paso 1 se aplica al registro. Su energía no cambia. Por (R2) y (R3) su entropía pasa de $H(q')$ a $H(q^0)$. Así, $W_k^{\mathrm{reset}} = k_B T\,[\,H(q') - H(q^0)\,] + k_B T\, \Sigma^{\mathrm{reset}}$.
4. Los pasos 2 y 3 y (R4) dan $J_k \ge k_B T\, I + k_B T\, \Sigma^{\mathrm{reset}}$. Las entropías del registro se cancelan a lo largo del ciclo. En bits, $k_B T\, I = k_B T\ln 2\; I(M_k;R_k) \ge b_k\, k_B T\ln 2$ por (R2). Esta es la cota de medición y borrado de Sagawa y Ueda [5], aquí para cualquier distribución de preparación.
5. El límite de velocidad clásico da $\Sigma^{\mathrm{reset}} \ge L^2/(2\tau_k\langle A\rangle_k)$, con $L = \sum_s \lvert q'_s - q^0_s\rvert$ [23]. Tómese $s$ con $q^0_s = \max q^0 = 1 - \varepsilon$. Los demás estados llevan en total el cambio opuesto, de modo que $L \ge 2(q^0_s - q'_s) \ge 2\,[(1 - q'_{\max}) - \varepsilon]$.
6. La desigualdad de Fano, sin información lateral y con el estado más probable como conjetura, da $H(q') \le h_2(1-q'_{\max}) + (1-q'_{\max})\log_2(N-1) = \phi_N(1 - q'_{\max})$, en bits. Como $1 - q'_{\max} \le 1 - 1/N$ y $\phi_N$ es creciente allí, $1 - q'_{\max} \ge \phi_N^{-1}(H(q'))$. Por (R2), $H(q') \ge I(M_k;R_k) \ge b_k$, y $\phi_N^{-1}$ es creciente. Así, $L \ge 2\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+$.
7. Los pasos 4 a 6 dan el enunciado. $\blacksquare$

**Lectura.** El suelo es la suma de dos precios. El precio de la información es $k_B T\ln 2$ por bit confirmado, pagado a lo largo del ciclo cerrado sea cual sea el estado de preparación. El precio de la velocidad corresponde al reinicio. Un reinicio con tasas finitas nunca alcanza un único estado en tiempo finito, de modo que $\varepsilon > 0$ para todo $\tau_k$ finito, y el precio de la velocidad arrastra ese error. K1 se cumple acto por acto para todo $\tau_k$. Las cotas de borrado más ajustadas para dinámicas particulares son también cotas inferiores del mismo reinicio (Sección 4.1). Por acto, la velocidad por julio es

$$
v_{J,k} = \frac{b_k}{J_k} \;\le\; \frac{b_k}{b_k\, k_B T \ln 2 + 2 k_B T\,\big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2/(\tau_k\langle A\rangle_k)} \;\le\; \frac{1}{k_B T \ln 2}
$$

La última desigualdad es estricta siempre que $\phi_N^{-1}(b_k) > \varepsilon$ con $\tau_k\langle A\rangle_k$ finito.

#### Proposición 2. Julios permanentes para sostener una meta

**Planteamiento.** El mundo es una planta lineal $x_{t+1} = A x_t + B u_t + w_t$, con $x_t \in \mathbb{R}^n$. En el paso $t$ el agente escribe un registro de valores finitos $c_t$ de la planta. Su memoria $s_t$ es una función de valores finitos de $(s_{t-1}, c_t)$, con $s_0$ fijo, y su acto $u_t$ es una función de $s_t$. Conservar todos los registros, $s_t = (s_{t-1}, c_t)$, es una de esas memorias. La meta es sostener la planta: $\sup_t \mathbb{E}\|x_t\|^2 < \infty$.

**Supuestos.**

- (C1) El ruido $w_t$ es independiente de $(x_t, s_t)$.
- (C2) $x_0$ tiene una densidad con entropía diferencial finita y un segundo momento finito.
- (C3) Contabilidad de ciclo cerrado por paso. $J_t$ son los julios medios atribuidos al registro $c_t$: su escritura y su borrado posterior, cuando quiera que se paguen. $J_t \ge k_B T\, I(x_t; c_t \mid s_{t-1})$, con la información en nats. Esto es la Proposición 1, pasos 1 a 4, para cada valor de la memoria $s_{t-1}$, con un registro nuevo en su estado de preparación y $x_t$ fijo durante la escritura [5]. Una memoria de tamaño acotado borra cada registro dentro de un número acotado de pasos, de modo que los julios atribuidos caen dentro de la ejecución salvo un término de frontera.

**Enunciado.** Este es un corolario con precio en julios del teorema de la tasa de datos de Tatikonda y Mitter [169] y de Nair y Evans [170]. La desigualdad de lazo cerrado de Touchette y Lloyd [32, 33] lleva la tasa al registro, y el precio de borrado de Landauer [6] convierte cada bit en $k_B T\ln 2$ julios. Es nuevo solo como esa composición. Sean $\lambda_1, \dots, \lambda_n$ los valores propios de $A$. Entonces

$$
\liminf_{N\to\infty} \frac{1}{N}\sum_{t=1}^{N} J_t \;\ge\; k_B T \ln 2 \sum_{i:\,|\lambda_i| > 1} \log_2 |\lambda_i|
$$

**Demostración.**

1. Elíjanse coordenadas reales en las que $A = \mathrm{diag}(A_u, A_s)$, con $A_u$ conteniendo exactamente los valores propios de módulo mayor que 1. Sea $y_t$ el bloque inestable de $x_t$. Entonces $y_{t+1} = A_u y_t + v_t + e_t$, donde $v_t$ es una función de $s_t$ y $e_t$ es independiente de $(y_t, s_t)$ por (C1). Un cambio lineal de coordenadas desplaza las entropías diferenciales en una constante, de modo que la finitud no cambia.
2. Sea $D_t = h(y_t \mid s_t)$, una entropía diferencial condicional en nats. Añadir ruido independiente no reduce una entropía condicional. Desplazar por una función de $s_t$ no la cambia. La aplicación lineal $A_u$ añade $\ln|\det A_u|$. Así, $h(y_{t+1} \mid s_t) \ge D_t + \ln|\det A_u|$.
3. $s_{t+1}$ es una función de $(s_t, c_{t+1})$, y condicionar sobre menos nunca reduce la entropía. Así, $D_{t+1} \ge h(y_{t+1}\mid s_t, c_{t+1}) = h(y_{t+1}\mid s_t) - I(y_{t+1}; c_{t+1} \mid s_t)$. Como $y$ es una función de $x$, $I(y_{t+1}; c_{t+1}\mid s_t) \le I(x_{t+1}; c_{t+1}\mid s_t)$. Esta es la desigualdad de lazo cerrado de Touchette y Lloyd [32, 33].
4. Los pasos 2 y 3 dan $I(x_{t+1}; c_{t+1}\mid s_t) \ge \ln|\det A_u| - (D_{t+1} - D_t)$. Sumando sobre $N$ pasos, $\sum_{t=1}^{N} I(x_t; c_t\mid s_{t-1}) \ge N \ln|\det A_u| - (D_N - D_0)$.
5. Cada registro tiene valores finitos, de modo que cada término de información es finito. $D_0 = h(y_0)$ es finito: el segundo momento lo acota por arriba, y $h(x_0) \le h(y_0) + h(x^{\mathrm{s}}_0)$, siendo $x^{\mathrm{s}}_0$ el bloque estable, lo acota por abajo, por (C2). $D_N \le h(y_N)$, y una gaussiana tiene la mayor entropía para una covarianza dada, de modo que el segundo momento acotado acota $D_N$ por arriba. Dividiendo por $N$, la información media por paso es al menos $\ln|\det A_u| = \sum_{|\lambda_i|>1}\ln|\lambda_i|$ en el límite.
6. (C3) pone a cada nat el precio de $k_B T$, que es $k_B T\ln 2$ por bit. $\blacksquare$

**Lectura.** Un agente que sostiene una meta frente a un mundo inestable paga una potencia permanente de al menos $f\, k_B T\ln 2\sum_{|\lambda_i|>1}\log_2|\lambda_i|$ a $f$ pasos de control por segundo. Un modo inestable con $|\lambda| = 2$ necesita un bit por paso, que son $k_B T\ln 2 \approx 2.87\times10^{-21}$ J por paso a 300 K. Los bits por paso del registro acotan su información por arriba, de modo que la demostración también da una forma no estricta y promediada del teorema de la tasa de datos (Sección 4.1). La composición es breve. Es el teorema de la tasa de datos de Tatikonda y Mitter y de Nair y Evans [169, 170], con el precio de $k_B T\ln 2$ por bit a través de Touchette y Lloyd [32, 33]. Lo que añade es el precio en julios, que es el suelo que necesita la Predicción 1.

#### Proposición 3. Precisión de la agencia confirmada

**Planteamiento.** El agente, su mundo y su retroalimentación forman un único proceso de saltos de Markov homogéneo en el tiempo e irreducible sobre un número finito de estados, en su estado estacionario. Cada acto confirmado es un salto de un tipo marcado. $N(t)$ cuenta los actos confirmados en $[0,t]$. $\langle K\rangle$ es el número medio de saltos de todos los tipos en $[0,t]$, y $\langle k\rangle = \langle K\rangle/t$ es la tasa media de saltos.

**Enunciado.**

1. En el límite de tiempos largos, $\mathrm{Var}(N)/\langle N\rangle^2 \ge 1/\langle K\rangle$. Si todo acto confirmado acredita los mismos $b$ bits, entonces $X = bN$ y la misma cota vale para $X$.
2. Sea $T_n$ el instante en que se cierra el $n$-ésimo acto confirmado. Para $n$ grande, $\mathrm{Var}(T_n)/\langle T_n\rangle^2 \ge 1/(\langle T_n\rangle\langle k\rangle)$.
3. Sea en cambio $X$ impar bajo la aplicación al experimento inverso de una relación de fluctuación que incluye un término de información, $P_B(-X,-\sigma_I)/P(X,\sigma_I) = e^{-\sigma_I}$. Entonces

$$
\frac{\mathrm{Var}(X) + \mathrm{Var}_B(X)}{\big(\langle X\rangle + \langle X\rangle_B\big)^2} \;\ge\; \frac{1}{\exp\!\big[(\langle\sigma_I\rangle + \langle\sigma_I\rangle_B)/2\big] - 1}
$$

Cuando el experimento inverso es igual al directo, esto se escribe $\mathrm{Var}(X)/\langle X\rangle^2 \ge 2/\big(e^{\langle\sigma_I\rangle} - 1\big)$.

**Demostración.** $N$ es un observable de conteo: cuenta un subconjunto de saltos y nunca disminuye. Garrahan demostró las partes 1 y 2 para observables de conteo en procesos de saltos de Markov estacionarios [34]. La parte 1 es su cota de la varianza de un observable de conteo por la actividad media. La parte 2 es su cota de primer paso, enunciada para conteos cuyos pesos de salto son 0 o 1, que vale aquí porque $N$ cuenta un único tipo marcado de salto. Escalar por $b$ deja una varianza relativa sin cambios. La parte 3 es la relación de incertidumbre que Potts y Samuelsson derivaron de cualquier relación de fluctuación, incluidas la medición y la retroalimentación [28], aplicada con $X$ como observable. $\blacksquare$

**Lectura.** La parte 1 no necesita ninguna propiedad de inversión temporal ni ningún modelo de la retroalimentación. La precisión de la agencia confirmada se compra con actividad. La parte 3 es el precio de la disipación, y vale bajo retroalimentación porque descansa en la relación de fluctuación con retroalimentación. La TUR estándar no restringe a las máquinas con retroalimentación en los experimentos [27]. Por eso la forma para agentes lleva el término de información.

#### Proposición 4. Los agentes cuánticos conservan el suelo

**Planteamiento.** La comparación $m_k$ procede de una medición cuántica y se escribe en un registro clásico, el registro de la cláusula 3. El reinicio del registro cumple el planteamiento de la Proposición 1 y (R2) y (R3), siendo $I(M_k;R_k)$ la información mutua cuántico-clásica de la medición. El trabajo del reinicio pasa por el medidor: $J_k \ge W_k^{\mathrm{reset}}$.

**Enunciado.**

$$
J_k \;\ge\; k_B T\ln 2\,\big[\,b_k - \phi_N(\varepsilon)\,\big] \;+\; \frac{2\, k_B T\, \big[\big(\phi_N^{-1}(b_k) - \varepsilon\big)_+\big]^2}{\tau_k\, \langle A\rangle_k}
$$

Cuando $\varepsilon \to 0$ este es el suelo de la Proposición 1. Cuando también se mide la escritura, la cota de medición y borrado de Sagawa y Ueda da $J_k \ge b_k\, k_B T\ln 2$ para todo $\varepsilon$, bajo el supuesto adicional que ellos enuncian para la medición cuántica [5].

**Demostración.** El paso 3 de la Proposición 1 usa solo el registro y su dinámica de reinicio. Da $W_k^{\mathrm{reset}} = k_B T\ln 2\,[H(q') - H(q^0)] + k_B T\,\Sigma^{\mathrm{reset}}$, con las entropías en bits. La información mutua cuántico-clásica es como máximo la entropía de los resultados [5], de modo que $H(q') \ge b_k$. La desigualdad de Fano da $H(q^0) \le \phi_N(\varepsilon)$, ya que $\varepsilon \le 1 - 1/N$. Los pasos 5 y 6 de la Proposición 1 acotan $\Sigma^{\mathrm{reset}}$. $\blacksquare$

**Lectura.** Los recursos cuánticos cambian lo que un agente puede hacer por acto. No reducen el precio de su registro. El registro cuesta $k_B T\ln 2$ por bit, menos un residuo $\phi_N(\varepsilon)$ que se anula a medida que el reinicio se vuelve exacto. La medición que escribe el registro tiene su propio precio, dado en la Sección 4.1.

### 2.3 Capa 3. Cálculo: la inteligencia como derivada, leída a posteriori

Una ejecución produce un recibo: el registro ordenado $\{(J_k, X_k)\}_{k=0}^{n}$ de julios medidos y desplazamiento confirmado. Cada $m_k$ se conoce solo después de que se cierra el acto $k$. Así, la trayectoria $X(J)$ existe solo una vez completada la ejecución.

- **Inteligencia, marginal:** $\iota(J) = \dfrac{dX}{dJ}$, estimada a partir del recibo como $\iota_k = \Delta X_k/\Delta J_k$.
- **Integral de la ejecución:** $X(B) = \int_0^B \iota(J)\,dJ$.
- **Julios para cerrar un requisito:** $J^*(X_{\mathrm{req}}) = \int_0^{X_{\mathrm{req}}} \frac{dX}{\iota}$.
- **Óptimo:** $\pi^* = \arg\min_\pi J_\pi$ sujeto a $X_\pi \ge X_{\mathrm{req}}$, $E_k = 1$ para todo $k$, y $J_\pi \le B$. Si ninguna política es factible, rechazar con un recibo.
- **Clasificación:** $S_1 \succ_q S_2 \iff J^*_{S_1}(q) < J^*_{S_2}(q)$.

$X_{\mathrm{req}}$ lo fija el predicado de completitud de la tarea, $C(z)$. Es una compuerta, no una puntuación. Los parámetros, los tokens y las pruebas de referencia entran solo a través de $J^*$. Todos los demás factores se reducen a cero.

Aquí la lectura a posteriori es literal. La velocidad se lee sobre una trayectoria registrada. La inteligencia se lee sobre una ejecución registrada. El recibo es la trayectoria.

#### Proposición 5. La inteligencia existe como una densidad acotada sobre el eje de los julios

**Planteamiento.** Una ejecución en $[0, T]$ tiene potencia medida $P(t) \ge 0$, integrable, y medida de julios $dJ = P\,dt$. El acto $k$ ocupa $[s_k, e_k]$ y acredita $b_k = E_k\, m_k\, I(\mathrm{do}(a_k); W'_k) \ge 0$ bits. Los actos pueden solaparse. Cada acto tiene una potencia atribuida $P_k \ge 0$, nula fuera de $[s_k, e_k]$, con $\sum_k P_k \le P$. Sus julios son $J_k = \int P_k\,dt > 0$. Para actos que no se solapan, $P_k = P$ en el intervalo del acto.

**Regla de acreditación.** Los bits de cada acto se reparten sobre sus propios julios:

$$
dX = \sum_k \frac{b_k}{J_k}\, P_k\, dt
$$

**Supuesto (K1 por acto).** $b_k\, k_B T \ln 2 \le J_k$ para todo $k$. La Proposición 1 lo da bajo (R1) a (R4) para los julios medios de cada acto, de modo que el enunciado vale para la ejecución media. En una sola ejecución vale siempre que cada acto consuma más de $b_k\, k_B T\ln 2$. Cada acto confirmado de la ejecución de la Sección 8.11 consumió más de $3 \times 10^{14}$ veces esa cantidad.

**Enunciado.**

1. Para todo conjunto medible de instantes $A \subseteq [0,T]$, $0 \le X(A) \le J(A)/(k_B T\ln 2)$. Así, $dX$ es absolutamente continua con respecto a $dJ$.
2. La derivada de Radon-Nikodym $\iota = dX/dJ$ existe, es única salvo conjuntos de cero julios, y satisface

$$
0 \;\le\; \iota \;\le\; \frac{1}{k_B T \ln 2}
$$

Donde $P > 0$, $\iota = \sum_k (b_k/J_k)(P_k/P)$. Para actos que no se solapan, $\iota = b_k/J_k$ en el acto $k$, que es la $\iota_k$ del recibo.

3. La agencia confirmada es una función de los julios acumulados: $X(t) = g(J(t))$, con $g$ no decreciente y lipschitziana de constante $1/(k_B T\ln 2)$. Así, $g$ es diferenciable en casi todo julio, y $g'(J(t)) = \iota(t)$ para casi todo julio.
4. Si en cambio los bits de cada acto se acreditan en el instante en que se cierra, entonces $dX = \sum_k b_k\,\delta_{e_k}$ es singular con respecto a $dJ$ siempre que algún $b_k > 0$. Entonces $g$ es una función escalonada, $g' = 0$ en casi todo julio, y toda la agencia se sitúa en un conjunto de cero julios.

**Demostración.**

1. $X(A) = \sum_k (b_k/J_k)\int_A P_k\,dt \le \frac{1}{k_BT\ln 2}\int_A \sum_k P_k\,dt \le \frac{J(A)}{k_BT\ln 2}$, por K1 por acto y después $\sum_k P_k \le P$. Si $J(A) = 0$, entonces $X(A) = 0$.
2. Ambas medidas son finitas, de modo que el teorema de Radon-Nikodym da $\iota$. Si $\iota > 1/(k_BT\ln 2)$ en un conjunto $B$ con $J(B) > 0$, entonces $X(B) > J(B)/(k_BT\ln 2)$, en contra del paso 1. En $\{P > 0\}$, $dX = \sum_k (b_k/J_k)(P_k/P)\,dJ$, y $P_k = 0$ donde $P = 0$. Eso da la forma explícita.
3. Si $J(t_1) = J(t_2)$ con $t_1 < t_2$, el paso 1 da $X((t_1,t_2]) = 0$, de modo que $g$ está bien definida. Para $t_1 < t_2$, $g(J(t_2)) - g(J(t_1)) = X((t_1,t_2]) \le (J(t_2) - J(t_1))/(k_BT\ln 2)$. $J$ es continua, de modo que $g$ es lipschitziana en $[0, J(T)]$. Una función lipschitziana es absolutamente continua y diferenciable en casi todo punto. Un cambio de variables da $\int_0^t g'(J(s))\,dJ(s) = g(J(t)) = X([0,t])$. Así, $g'\circ J$ es también una densidad de $X$ con respecto a $J$, y es igual a $\iota$ por unicidad.
4. $X(\{e_k\}) = b_k > 0$ mientras que $J(\{e_k\}) = 0$, porque $J$ es continua. Así, $dX$ no es absolutamente continua. Se concentra en un número finito de puntos de cero julios, de modo que es singular. Una función constante entre un número finito de saltos tiene derivada nula en casi todo punto. $\blacksquare$

**Lectura.** La inteligencia leída a posteriori es una densidad bien definida sobre el eje de los julios una vez que los bits de cada acto se reparten sobre los julios que ese acto usó. La regla de acreditación es lo que hace que $dX/dJ$ exista. La acreditación puntual pone toda la agencia en un conjunto de cero julios. Los actos solapados se tratan con cualquier atribución que nunca asigne más julios de los que leyó el medidor. Cada $b_k$ se conoce solo después de que se cierra el acto $k$, de modo que $\iota$ se lee sobre la ejecución completada.

La Proposición 5 vale por construcción. La regla de acreditación hace que $X$ sea absolutamente continua con respecto a $J$, de modo que la densidad existe por definición. Su contenido es la elección de la regla: la parte 4 muestra que la otra regla natural, la acreditación puntual, no deja densidad alguna.

#### Proposición 6. La inteligencia muestreada converge

**Planteamiento.** El medidor se lee en julios acumulados $0 = j_0 < j_1 < \dots < j_M = J(T)$, con paso de malla $\Delta = \max_i (j_{i+1} - j_i)$. En $[j_i, j_{i+1})$ la inteligencia muestreada es

$$
\hat\iota = \frac{g(j_{i+1}) - g(j_i)}{j_{i+1} - j_i}
$$

Las muestras en el tiempo refinan las muestras en julios, porque $J$ es continua.

**Enunciado.** Bajo el planteamiento de la Proposición 5, $\hat\iota(j) \to g'(j)$ en casi todo julio $j$ cuando $\Delta \to 0$, y $0 \le \hat\iota \le 1/(k_BT\ln 2)$ para toda malla. Si la lectura del medidor de cada intervalo muestreado tiene un error relativo de como máximo $\epsilon < 1$, el cociente informado está en $[\hat\iota/(1+\epsilon),\, \hat\iota/(1-\epsilon)]$.

**Demostración.** $\hat\iota(j)$ es el promedio de $g'$ sobre un intervalo muestreado $I \ni j$ de longitud $h \le \Delta$. Como $I \subseteq [j - h, j + h]$,

$$
\big|\hat\iota(j) - g'(j)\big| \;\le\; \frac{1}{h}\int_{j-h}^{j+h}\big|g'(u) - g'(j)\big|\,du
$$

El lado derecho tiende a 0 en todo punto de Lebesgue de $g'$, y casi todo $j$ es un punto de Lebesgue por el teorema de diferenciación de Lebesgue. Las cotas de $\hat\iota$ son la monotonía y la constante de Lipschitz de $g$. Una lectura $\Delta\hat J \in [(1-\epsilon)\Delta J, (1+\epsilon)\Delta J]$ divide el mismo $\Delta X$. $\blacksquare$

#### Proposición 7. Composición de julios y de bits acoplados

**Planteamiento.** Un grupo $G$ de miembros $i = 1, \dots, n$ actúa sobre un único mundo $W'$. Cada miembro se encuentra detrás de su propia pared medida. Las paredes son disjuntas y están dentro de la pared del grupo, y cada miembro toma su energía del exterior del grupo. Los miembros eligen los actos $a_1, \dots, a_n$ mediante políticas independientes. El acoplamiento del miembro $i$ se calcula con los demás miembros actuando bajo sus propias políticas.

**Enunciado.**

1. $J_G = \sum_i J_i + J_0$, donde $J_0 \ge 0$ es la energía que entra por la pared del grupo y por la pared de ningún miembro.
2. $I(\mathrm{do}(a_1,\dots,a_n); W') \ge \sum_i I(\mathrm{do}(a_i); W')$, con igualdad si y solo si $a_i$ es independiente de $(a_1, \dots, a_{i-1})$ dado $W'$ para todo $i$.
3. La desigualdad puede ser estricta cuando cada miembro por separado está desacoplado. Con $a_1, a_2$ bits uniformes independientes y $W' = a_1 \oplus a_2$, el acoplamiento de cada miembro es de 0 bits y el del grupo es de 1 bit.
4. Bajo K1 por acto en la pared del grupo, la Proposición 5 se aplica a $G$: $\iota_G$ existe y $0 \le \iota_G \le 1/(k_BT\ln 2)$. Por la Definición 2, $G$ es el agente cuando $X_G/J_G$ supera $X_S/J_S$ para todo otro candidato, incluido cada miembro.

**Demostración.**

1. Todo julio que entra por la pared de un miembro entra antes por la pared del grupo, y la energía medida se suma sobre paredes disjuntas.
2. Bajo intervención, los actos tienen la distribución producto $\prod_i p(a_i)$, y cada acoplamiento es una información mutua de la distribución conjunta intervencional (Definición 1). El acoplamiento del miembro $i$ es $I(a_i; W')$ en esa conjunta, marginalizando los demás actos. Por la regla de la cadena, $I(a_{1:n}; W') = \sum_i I(a_i; W' \mid a_{<i})$. La independencia da $I(a_i; a_{<i}) = 0$, de modo que $I(a_i; W' \mid a_{<i}) = I(a_i; W', a_{<i}) = I(a_i; W') + I(a_i; a_{<i} \mid W') \ge I(a_i; W')$. La igualdad se da para cada término si y solo si $I(a_i; a_{<i}\mid W') = 0$ para todo $i$.
3. Dado solo $a_1$, $W'$ sigue siendo un bit uniforme, de modo que $I(a_1; W') = 0$, y lo mismo para $a_2$. Dados ambos actos, $W'$ queda fijado, de modo que $I(a_1, a_2; W') = H(W') = 1$ bit.
4. La Proposición 5 solo necesita la ejecución, el medidor y K1 por acto. Aplíquese en la pared del grupo. $\blacksquare$

**Lectura.** Los julios se suman, con los enlaces del grupo encima. Los bits acoplados de miembros independientes se suman como mínimo, y algunos existen solo en el nivel del grupo. Un grupo eleva $\iota_G$ cuando gana más bits acoplados de los que sus miembros tienen por separado, o cuando gasta menos julios actuando juntos que sus miembros actuando por separado. La Sección 4.1 da los teoremas que ponen precio a ambos términos.

#### Predicción 1. El tiempo de acto óptimo de un agente que sostiene una meta

**Planteamiento.** Un aceptor de ciclo cerrado ejecuta un acto tras otro. Cada acto escribe un registro con $N$ estados y acredita $b$ bits cuando se confirma. La comparación, hecha antes del reinicio, confirma con probabilidad $p$. Cada reinicio cumple la Proposición 1, con duración $\tau$, actividad media $\langle A\rangle$ y error de reinicio $\varepsilon$. Durante todo el tiempo, el agente sostiene una meta frente a un mundo con tasa de inestabilidad $\Lambda$, mediante un registro separado. Cada julio se mide en la pared del agente (Definición 2).

**Derivación.** Cada acto dura al menos $\tau$. La Proposición 2 pone a sostener la meta un precio de $k_B T\,\Lambda$ por segundo, a largo plazo. La Proposición 1 pone precio al acto. Los dos registros son distintos, de modo que sus julios medidos se suman. Por acto, en media,

$$
J(\tau) \;\ge\; b\,k_B T\ln 2 \;+\; \frac{\kappa}{\tau} \;+\; k_B T\,\Lambda\,\tau, \qquad \kappa = \frac{2k_B T\,\big[\big(\phi_N^{-1}(b) - \varepsilon\big)_+\big]^2}{\langle A\rangle}
$$

Por la Proposición 5, la inteligencia de la ejecución son los bits confirmados por julio, $\iota(\tau) = p\,b/J(\tau)$. El lado derecho de la cota de $J$ es mínimo en $\tau^* = \sqrt{\kappa/(k_B T\Lambda)}$, donde vale $b\,k_B T\ln 2 + 2\sqrt{\kappa\,k_B T\Lambda}$. Para un registro de un bit y un reinicio exacto, esto da dos números:

$$
\tau^* = \frac{1}{\sqrt{2\,\langle A\rangle\,\Lambda}}, \qquad \iota(\tau) \;\le\; \frac{p}{k_B T\,\big[\ln 2 + \sqrt{2\Lambda/\langle A\rangle}\big]}
$$

**Predicción 1.**

1. **Techo.** Ningún aceptor que sostenga una meta con tasa de inestabilidad $\Lambda$ mientras actúa alcanza una $\iota$ superior a $p/\big(k_B T[\ln 2 + \sqrt{2\Lambda/\langle A\rangle}]\big)$ para actos de un bit, con ningún tiempo de acto. El techo general es $p\,b/\big(b\,k_B T\ln 2 + 2\sqrt{\kappa\,k_B T\Lambda}\big)$. Depende solo de $T$, $p$, $b$, $N$, $\varepsilon$ y el cociente $\Lambda/\langle A\rangle$.
2. **Tiempo de acto óptimo.** Supóngase que los julios medidos por acto de un aceptor siguen $J(\tau) = J_0 + a/\tau + s\,\tau$. Mídanse $a$ y $J_0$ a partir de un barrido de $\tau$ sin ninguna meta sostenida, y la potencia permanente $s$ a partir de la meta sostenida sin actos. Entonces la $\iota(\tau)$ medida alcanza su máximo en $\tau^* = \sqrt{a/s}$, con el valor $p\,b/(J_0 + 2\sqrt{a s})$, con $a \ge \kappa$ y $s \ge k_B T\Lambda$. La banda de error es

$$
\frac{\delta\tau^*}{\tau^*} = \frac{1}{2}\sqrt{\Big(\frac{\delta a}{a}\Big)^2 + \Big(\frac{\delta s}{s}\Big)^2}
$$

3. **Escalado.** A lo largo de un barrido de la tasa de inestabilidad, $\ln\tau^*$ decrece frente a $\ln s$ con pendiente $-1/2$.

**Falsador.** El maximizador medido de $\iota(\tau)$ queda fuera de $\tau^* \pm 2\,\delta\tau^*$, o la pendiente ajustada de $\ln\tau^*$ frente a $\ln s$ sobre al menos una década de $s$ se aparta de $-1/2$ en más de dos errores estándar. Cualquiera de las dos cosas refuta la afirmación de que los julios del acto y los julios permanentes se suman en un solo medidor, con $\iota$ leída como su densidad. Una $\iota$ medida por encima del techo refuta la contabilidad de esa ejecución (F12, Sección 8.7).

La Figura 2 dibuja la curva de la Predicción 1.

![Ilustración de modelo de la Predicción 1. La inteligencia relativa iota de tau se representa frente al tiempo de acto tau en un eje logarítmico para J de tau igual a J cero más a sobre tau más s tau. Con s igual a 1 el máximo está en tau estrella igual a 1; con s igual a 4 el máximo se desplaza a 0.5 y es más bajo, lo que muestra la pendiente de menos un medio.](/figures/agency/act-time.svg)

*Figura 2. Un tiempo de acto óptimo. Ilustración de modelo, no una medición: $J(\tau) = J_0 + a/\tau + s\,\tau$ con $J_0 = a = 1$ y $s \in \{1, 4\}$ en unidades normalizadas. Cuadruplicar el coste permanente reduce $\tau^*$ a la mitad, la pendiente de $-1/2$ que pone a prueba el falsador. Se ofrece una [copia PNG](/figures/agency/act-time.png).*

**Frente al trabajo más cercano.** Un tiempo de ciclo óptimo finito no es nuevo por sí mismo. Paneru y sus colegas midieron un tiempo de ciclo óptimo en potencia en una máquina de información browniana [330]. Panizon deriva calendarios de medición óptimos en función del coste de la medición [331], y Rolandi y sus colegas acotan una relación de compromiso entre energía, tiempo y precisión en la computación termodinámica [332]. Lo que añade la Predicción 1 es el origen del óptimo interior, un coste permanente de sostener una meta frente a la deriva, y su escalado: $\tau^*$ decrece como $\Lambda^{-1/2}$. La prueba de la pendiente es el falsador distintivo.

**Qué es nuevo.** La cota de Landauer en tiempo finito pone precio solo a la memoria y decrece hacia $k_B T\ln 2$ a medida que $\tau$ crece [29]. Allí, el reinicio más lento es el más barato. El teorema de la tasa de datos pone precio solo a sostener, por segundo (Sección 4.1). Ninguno de los dos da un óptimo interior. La definición mide el agente completo, cuenta solo los bits confirmados y lee $\iota$ como una densidad sobre el eje de los julios. Entonces sostener una meta hace cara la lentitud, y el mejor tiempo de acto es la media geométrica del tiempo de salto $1/\langle A\rangle$ y el tiempo de deriva $1/\Lambda$, salvo el factor $1/\sqrt{2}$. Los costes propios del controlador entran en los julios del mismo modo en el trabajo de Ehrich, Still y Sivak (Sección 5.1).

**Dónde ponerla a prueba.** Una trampa coloidal de retroalimentación impone potenciales virtuales por software y calcula el trabajo a partir de las trayectorias a la escala de $k_B T$ (Sección 3.2). Una coordenada ejecuta un ciclo de acto de un bit en un doble pozo virtual con tiempo de reinicio $\tau$. La otra se mantiene en la cima de un pozo virtual invertido de tasa $\Lambda$. Una caja de un solo electrón con un detector de carga ejecuta el mismo ciclo de acto contando cada salto, de modo que se mide $\langle A\rangle$ (Sección 3.2). La Sección 8.8 da el protocolo.

#### Proposición 8. La clasificación con compuerta

**Planteamiento.** Fíjense una tarea $q$, su predicado $C(z)$ y su tasa de fallo permitida $\delta$. Para cada sistema $S$, $J^*_S(q) \in (0, \infty]$ son los julios hasta la finalización correcta de la Sección 1, con $J^*_S(q) = \infty$ cuando ninguna política de $S$ supera la compuerta. Defínase $S_1 \preceq_q S_2$ cuando $J^*_{S_1}(q) \le J^*_{S_2}(q)$.

**Enunciado.**

1. $\preceq_q$ es un preorden total sobre los sistemas: reflexivo, transitivo y total. La clasificación $\succ_q$ de la Sección 2.3 es su parte estricta.
2. Todo sistema que supera la compuerta se clasifica por encima de todo sistema que no la supera.
3. Supóngase que toda lectura de los julios medios de una política tiene un error relativo de como máximo $\epsilon < 1$. Si $(1+\epsilon)\,J^*_{S_1}(q) < (1-\epsilon)\,J^*_{S_2}(q)$, entonces $S_1$ se clasifica por encima de $S_2$ bajo toda lectura admisible.
4. La $\iota$ integrada no induce este orden. Hay sistemas con $\iota_{S_1} > \iota_{S_2}$ y $S_2 \succ_q S_1$.

**Demostración.**

1. $\preceq_q$ es el retroceso del orden total $\le$ en $(0, \infty]$ por la aplicación $S \mapsto J^*_S(q)$. El retroceso de un orden total es un preorden total. Su parte estricta es $J^*_{S_1} < J^*_{S_2}$, que es la clasificación de la Sección 2.3.
2. Todo valor finito es menor que $\infty$.
3. La lectura de cada política está en $[(1-\epsilon)J_\pi, (1+\epsilon)J_\pi]$, de modo que el mínimo de las lecturas sobre las políticas factibles está en $[(1-\epsilon)J^*, (1+\epsilon)J^*]$. Entonces $\hat J^*_{S_1} \le (1+\epsilon)J^*_{S_1} < (1-\epsilon)J^*_{S_2} \le \hat J^*_{S_2}$.
4. Sea $S_1$ un sistema que hace un intento por tarea con 0.1 J, que acierta con probabilidad 1/2 y nunca reintenta. Sea $S_2$ un sistema que hace un intento con 1 J que siempre acierta. Cada acierto acredita $b$ bits. Entonces $\iota_{S_1} = (b/2)/0.1 = 5b$ bits por julio e $\iota_{S_2} = b$ bits por julio. Para todo $\delta < 1/2$, $S_1$ nunca satisface la compuerta, de modo que $J^*_{S_1} = \infty$, mientras que $J^*_{S_2} = 1$ J. $\blacksquare$

**Lectura.** La parte 4 es el mecanismo de R-F6 en la Sección 8.11: los fallos baratos elevan la $\iota$ integrada y dejan $J^*$ sin cambios o infinito. Por eso $\iota$ se lee como una densidad dentro de una ejecución y $J^*$ es la clasificación entre sistemas. La parte 3 resuelve P6 salvo un $\epsilon$ validado para cada medidor.

#### Proposición 9. Cuándo es óptimo empezar por lo más barato

**Planteamiento.** Una tarea tiene engranajes $g_1, \dots, g_n$. Un intento con el engranaje $g_i$ cuesta $c_i > 0$ julios, pagados íntegramente, y supera $C(z)$ con probabilidad $p_i$. Una política prueba los engranajes en cierto orden, se detiene en el primer acierto y rechaza después del último. Se tratan dos estructuras. Independiente: los aciertos de engranajes distintos son sucesos independientes. Anidada: si $g_i$ acierta entonces acierta todo engranaje posterior, con probabilidades de acierto $q_1 \le \dots \le q_n$.

**Enunciado.**

1. Engranajes independientes. Los julios esperados de un orden son mínimos cuando los engranajes se prueban en orden decreciente de $p_i/c_i$. Empezar por lo más barato es óptimo exactamente cuando el orden de coste creciente es también un orden de $p_i/c_i$ decreciente.
2. Engranajes anidados, dos, con el engranaje pesado suficiente ($q_H = 1$). Probar primero el engranaje ligero reduce los julios esperados si y solo si $q_L\,c_H > c_L$.
3. Presupuesto. Bajo un presupuesto estricto $B$ con $c_H \le B < c_L + c_H$, empezar por el ligero cierra la tarea con probabilidad $q_L$. El pesado solo la cierra con probabilidad 1.

**Demostración.**

1. Los julios esperados de un orden $\sigma$ son $\sum_k c_{\sigma(k)} \prod_{j<k}(1 - p_{\sigma(j)})$. Intercámbiense dos engranajes adyacentes $i$ y luego $j$ que siguen a un prefijo con probabilidad de supervivencia $P$. Su contribución cambia de $P[c_i + (1-p_i)c_j]$ a $P[c_j + (1-p_j)c_i]$, y nada más cambia. Así, poner $i$ primero no es peor si y solo si $p_i c_j \ge p_j c_i$, es decir, $p_i/c_i \ge p_j/c_j$. Todo orden no ordenado por este cociente tiene un par adyacente desordenado, e intercambiarlo no eleva los julios esperados. Un número finito de intercambios ordena el orden. Esta es la regla del cociente de Simon y Kadane para la búsqueda con soluciones de todo o nada [318].
2. Empezar por el ligero cuesta $c_L + (1-q_L)\,c_H$, porque el engranaje pesado se ejecuta solo cuando el ligero falla, y entonces acierta. El pesado solo cuesta $c_H$. El primero es menor si y solo si $c_L < q_L\,c_H$.
3. Un intento ligero fallido deja $B - c_L < c_H$, de modo que el engranaje pesado no puede ejecutarse. $\blacksquare$

**Lectura.** La cascada fija, el suficiente más barato primero en un orden fijo, es óptima cuando los engranajes baratos aciertan con la frecuencia suficiente para pagar sus fallos: $q_L c_H > c_L$ en cada paso de una cascada anidada, o un coste creciente acompañado de un $p/c$ decreciente entre engranajes independientes. Cuando la condición falla, ir directamente al engranaje más pesado gana, y bajo un presupuesto que restringe puede ser la única manera de cerrar. Ese es el mecanismo del resultado del selector en la Sección 8.11. El selector de ley σ estima el cociente con probabilidades de acierto calibradas. Es una regla de valor de la computación con los julios como coste, en el sentido de Russell y Wefald y de Horvitz (Sección 5.1). Se detiene cuando el siguiente acto ya no paga sus julios. Ambas reglas se detienen en el suelo más allá del cual más julios no compran progreso verificable, de modo que ambas son instancias de Mixture of Limits. P7 (Sección 7.1) enumera lo que sigue abierto: una cota de arrepentimiento cuando las probabilidades de acierto se estiman o la suficiencia no es monótona, y el caso anidado con más de dos engranajes, que es un programa dinámico sobre subsucesiones crecientes de engranajes.

### 2.4 Dónde se sitúan los estudios

- **Mixture of Limits** es el operador del óptimo. El engranaje suficiente más barato es el argmin sobre los julios. Es una filosofía, no un orden fijo: el gasto se detiene en la meseta, donde más es desperdicio.
- **Notational Intelligence** es el recibo. Contiene $R^*$, $R$, $m$ y $J$ para cada acto.

Ambos se desarrollan en el artículo compañero, [Compuertas de confirmación medidas](/papers/gates/). La ubicación de productos no forma parte de este artículo de física. Se recoge en el [libro blanco de Metabolic Intelligence](/products/mei/#where-the-products-sit).

**Tesis compartida, enunciada una sola vez para todos los artículos.** La energía para ejecutar es la única métrica verdadera de la inteligencia computacional. Todos los demás factores se reducen a cero. La forma de compuerta define qué significa eso. Entre las ejecuciones que superan el predicado de completitud de la tarea, $C(z)$, dentro del presupuesto y el plazo enunciados, los sistemas se clasifican por los julios hasta la finalización, $J^*$. La corrección, los plazos y el tamaño de la tarea son la compuerta, no términos de la puntuación. Los parámetros, los tokens, las puntuaciones en pruebas de referencia y los precios tienen peso cero en la clasificación ([Agencia, Sección 1](/papers/agency/#1-thesis)). Las estimaciones nunca son `measured_j`. Los precios y los mercados son economía. Están en los compañeros económicos: [Saciedad de la tarea](/papers/satiation/), [La corrección ortográfica es global](/papers/spellcheck/) y [El prometido mercado billonario de la programación con IA](/papers/ai-coding-market/).

<div id="3-layer-1-the-universal-law-of-agency" class="anchor-alias" aria-hidden="true"></div>

## 3. Capa 1. La propuesta Ley Universal de la Agencia: una definición más una compuerta

La definición tiene cuatro cláusulas: una predicción fijada antes del acto, el acoplamiento con el mundo mediante intervención, la consecuencia asumida por el sistema y un suelo físico en julios con rechazo sobre un recibo.

### 3.0 Objeciones al suelo

El suelo que se usa aquí es discutido, y los supuestos (R1) a (R4) de la Proposición 1 son el lugar donde se responde a las objeciones. Norton sostiene que el principio de Landauer vale solo para protocolos con un paso termodinámicamente irreversible [326]. Maroney y Sagawa separan la irreversibilidad lógica de la termodinámica: $k_B T\ln 2$ pone precio al cambio de entropía de una memoria, no a un bit como tal [327, 328]. López-Suárez, Neri y Gammaitoni hicieron funcionar una puerta lógica irreversible por debajo de $k_B T$ [329]. Wolpert y sus colegas sostienen que los costes de los ordenadores reales están dominados por el desajuste, la modularidad y la sincronización de reloj, más que por el borrado [320]. Cada objeción estrecha la afirmación en lugar de invertirla. La Proposición 1 se enuncia solo para un registro que cumple (R1) a (R4), un reinicio a un estado fijo con estados de igual energía y sin energía de interacción compartida, que es el caso en que la cota vale; el suelo es una cota inferior, y cada acto confirmado de las ejecuciones de la Sección 8.11 que el medidor resolvió se sitúa más de 14 órdenes de magnitud por encima de él. K5 tiene un alcance similar: Jordan muestra que la cota de Margolus-Levitin no limita la velocidad de cómputo por la energía sin un supuesto sobre la densidad de información [324], de modo que K5 se lee como una cota de los cambios de estado ortogonales, no de la frecuencia de reloj.

### 3.1 Demostrado

**La información tiene un precio.** Landauer mostró que una operación lógicamente irreversible disipa al menos $k_B T \ln 2$ por bit [6]. Este es el suelo bajo la cláusula 4. Bennett construyó una máquina de Turing reversible y mostró que solo el borrado tiene un coste obligado [35]. El coste ineludible de la agencia se sitúa en el reinicio del aceptor, no en el pensamiento. Bennett resolvió después el demonio de Maxwell mediante el coste de borrar la memoria del demonio [7]. El demonio es un agente mínimo. Sus cuentas solo cuadran cuando se reinicia su memoria. Eso es la cláusula 3 más la cláusula 4.

**La retroalimentación tiene su precio en información.** Sagawa y Ueda demostraron que, con retroalimentación, el trabajo extraíble está acotado por $-\Delta F + k_B T I$ [3]. El valor de actuar sobre una medición está limitado por la información que contiene la medición. Demostraron que el trabajo de medición más el trabajo de borrado es al menos $k_B T I$ [5]. El ciclo completo de predecir, comparar y reiniciar tiene precio en julios. Derivaron una igualdad de Jarzynski exacta bajo retroalimentación [4] y un teorema de fluctuación con intercambio de información entre subsistemas [36]. El acoplamiento es una correlación que entra en la segunda ley. Hartle, Wolpert, Stier, Kempes y Manzano pusieron precio a la retroalimentación con mediciones ruidosas, memoria limitada y un repertorio limitado de protocolos. Frente a la acción aleatoria como referencia, el beneficio de la retroalimentación puede superar en órdenes de magnitud la información obtenida [37]. Los bits acotan el trabajo frente a la energía libre. El valor frente a una referencia se lee en el medidor.

**La entropía se convierte en julios.** Esposito y Van den Broeck derivaron $k_B T \Sigma = W - \Delta F_{\mathrm{neq}}$ para un sistema forzado isotermo [24]. Toda cota cinemática de la Capa 2 se convierte en una cota en julios mediante esta identidad. Horodecki y Oppenheim demostraron costes de trabajo para disparos únicos a pequeña escala [38]. Los actos de agencia son disparos únicos. Las revisiones de referencia exponen la versión establecida: la información es un recurso termodinámico con un precio [39, 40].

**El control necesita acoplamiento.** Conant y Ashby demostraron que un buen regulador debe ser un modelo del sistema que regula [41]. Un sistema que regula bien ya lleva una predicción. Touchette y Lloyd demostraron que la entropía que elimina un controlador está acotada por su información mutua con el sistema [32, 33]. El acoplamiento es la moneda del control. El control en lazo cerrado, que actúa sobre una comparación, es lo que exige la definición. El cálculo do de Pearl da el operador de intervención y las condiciones bajo las cuales sus efectos son identificables [1]. La cláusula 2 se escribe con este operador. Everitt y sus colegas clasificaron las maneras en que un agente puede manipular su propia recompensa o sus entradas [2]. El acoplamiento debe ser con el mundo, no con el propio sensor del agente. Richens y Everitt demostraron que todo agente que cumple una cota de arrepentimiento bajo un conjunto amplio de cambios de distribución ha aprendido un modelo causal aproximado del proceso que genera sus datos [42]. Richens, Abel, Bellot y Everitt demostraron que todo agente que generaliza a tareas de varios pasos dirigidas a metas ha aprendido un modelo predictivo de su entorno, y que el modelo puede extraerse de la política [43]. Un agente capaz lleva una predicción. Eso es la cláusula 1, demostrada para agentes modernos.

**La información fluye dentro del agente.** Horowitz y Esposito mostraron que el flujo de información entre subsistemas entra en la segunda ley de cada subsistema [44]. El acoplamiento se convierte en una tasa. Ito y Sagawa demostraron una segunda ley para redes causales arbitrarias con entropía de transferencia [45]. La predicción, el acto y el resultado son nodos de una red así. Hartich, Barato y Seifert vincularon la entropía de transferencia, la tasa de aprendizaje y la disipación [46]. Allahverdyan, Janzing y Mahler acotaron la eficiencia del flujo de información entre sistemas acoplados [47]. Esposito y Schaller mostraron que una retroalimentación que cambia solo las barreras sigue entrando en el balance de entropía [48]. Un acto puramente informacional figura en el libro de cuentas de los julios.

**Demonios autónomos.** Mandal y Jarzynski resolvieron un demonio que levanta una masa escribiendo bits en una cinta [49]. No tiene operador externo, y la memoria paga su trabajo. Boyd, Mandal y Crutchfield acotaron el trabajo de esos trinquetes por las tasas de entropía de sus cintas de entrada y salida [50]. Mostraron que los diseños modulares pagan una disipación por encima de Landauer [51]. La manera en que se construye un agente cambia su suelo. Wolpert y Kolchinsky calcularon la producción de entropía adicional que paga una puerta dentro de un circuito, fijada por la topología del circuito [52]. El cableado forma parte del suelo.

**La calidad de la predicción tiene un precio en julios.** Kolchinsky y Wolpert demostraron que un proceso ajustado para una distribución de entrada disipa de más con cualquier otra, en un término de entropía relativa [53]. Still, Sivak, Bell y Crooks mostraron que la memoria que no predice cuesta disipación [54]. Conservar solo lo que predice es el diseño barato. Kolchinsky y Wolpert definieron la información semántica como la información causalmente necesaria para que un sistema se mantenga fuera del equilibrio, con un valor termodinámico [55]. Es la explicación existente más cercana que tiene julios. Se detiene antes de la cinemática y antes de un operador de inteligencia. Ortega y Braun derivaron decisiones de racionalidad acotada a partir de un principio de energía libre con un coste de información [56]. Kolchinsky y Wolpert acotaron el calor de la computación universal por la complejidad del programa [57]. Kolchinsky y Wolpert mostraron que las restricciones sobre los protocolos disponibles limitan el trabajo extraíble y el valor de la información [58]. Manzano y sus colegas derivaron relaciones de fluctuación y desigualdades análogas a la segunda ley para cómputos que se detienen en instantes aleatorios [59]. Una ejecución que se detiene cuando su predicado se cumple es un cómputo de ese tipo.

**El acoplamiento y la frontera descansan en teoremas.** Ay y Polani definieron el flujo de información causal mediante intervenciones [8]. La entropía de transferencia no mide ese flujo, como se mostró con un ejemplo [11]. La condición de manta de Markov se cumple solo en un rango estrecho de parámetros, por derivación [15], y sus definiciones en uso difieren, por contraejemplo [16]. Todo proceso estocástico bipartito tiene una manta causal, por teorema [22]. Las Definiciones 1 y 2 se apoyan en estos resultados.

### 3.2 Comprobado

**El suelo de Landauer, medido.** Una esfera coloidal en un doble pozo óptico se acercó a $k_B T \ln 2$ de calor medio a medida que el borrado se hacía más lento [60]. Una trampa de retroalimentación midió la misma aproximación con alta precisión y un coste adicional con tiempos de ciclo cortos [61]. El suelo sube cuando el acto es rápido. Ese es un efecto de la Capa 2 visto en un experimento de la Capa 1. Un circuito electrónico adiabático mostró el coste de Landauer para la operación irreversible y una disipación inferior a $k_B T$ para la operación reversible [62]. El suelo restringe el reinicio, no la lógica. Bits de memoria nanomagnética mostraron el suelo en hardware de memoria [63]. Aparece un borrado con trabajo casi nulo cuando la contabilidad de la energía libre es completa [64]. El suelo se refiere a la entropía total, de modo que el recibo debe llevar la cuenta completa. Se midió que la entropía que entra en la cota tiene la forma de Gibbs-Shannon [65]. Un único ion atrapado mostró el suelo cuántico [66]. El suelo se cumple en todos los sustratos ensayados. Un oscilador micromecánico subamortiguado alcanzó el suelo a alta velocidad [67]. Un punto cuántico borró bits con disipación mínima para una duración dada, con protocolos diseñados a partir de la longitud termodinámica [68].

**Los agentes con retroalimentación convierten información en trabajo.** Un coloide en un potencial en forma de escalera de caracol ganó energía libre por encima del trabajo realizado, pagada con información, y confirmó la igualdad de Jarzynski generalizada [69]. Esta es la primera observación directa de un acto cuyo valor lo fija una medición hecha antes de él. Una caja de un solo electrón extrajo trabajo cercano a $k_B T \ln 2$ por bit [70] y midió el teorema de fluctuación con información mutua [71]. Un demonio autónomo en un chip enfrió un sistema con información mientras se medía su propio calentamiento [72]. El coste del agente se midió junto a su efecto.

Los agentes cuánticos obedecen las mismas cotas. La RMN sobre espines moleculares redujo la producción de entropía mediante retroalimentación, dentro de la cota de información [73], y convirtió información en energía en el suelo [74]. Circuitos superconductores siguieron la memoria de un demonio durante la retroalimentación [75], verificaron el teorema de fluctuación integral generalizado [76] y midieron la información ganada y perdida durante la retroalimentación [77]. El acoplamiento decae, de modo que el recibo debe registrarlo en el momento del acto. Átomos fríos en una red óptica tridimensional se ordenaron mediante medición [78]. Linpeng y sus colegas midieron el coste energético de la medición cuántica con luz cuántica, coherente y térmica en un montaje de electrodinámica cuántica de circuitos. La luz de un solo fotón costó la menor energía por unidad de información obtenida [79]. La medición que escribe un registro tiene un precio medido.

Las máquinas clásicas midieron el precio a escala completa. Una máquina de pinzas ópticas convirtió información en trabajo en el límite teórico [80]. Una máquina coloidal extrajo un trabajo que depende de las correlaciones temporales de su entrada [81]. Una horquilla de ADN bajo monitorización continua rindió más de $k_B T \ln 2$ por ciclo cuando se hacían muchas mediciones por ciclo, de acuerdo con el contenido de información [82]. Una micropartícula levitada con retroalimentación retardada obedeció una segunda ley generalizada a lo largo de dos décadas de retardo, y la retroalimentación falló con retardos grandes [83]. Un acto tardío es un acto más débil. Máquinas de trampa de retroalimentación maximizaron la potencia y la velocidad [84], aprovecharon de forma óptima mediciones ruidosas [85] y extrajeron energía de un baño fuera del equilibrio [86]. Un punto cuántico vinculó las fluctuaciones del trabajo con la disipación durante la conversión de información en trabajo [87]. Un ion atrapado verificó teoremas de fluctuación que incluyen la disipación del propio demonio [88], siguiendo la teoría de Zeng y Wang [89].

**Agentes de sistemas funcionales construidos y ejecutados.** Un nematodo simulado con un aceptor de resultados de la acción aprendió la locomoción y la quimiotaxis [90]. Un robot móvil físico ejecutó el mismo controlador de sistema funcional [91]. Las cláusulas 1 y 3 funcionan en software y en un cuerpo. Ninguno de los dos mide julios.

### 3.3 Opinión

**Sistemas intencionales y anticipación.** Rosenblueth, Wiener y Bigelow definieron el comportamiento intencional mediante retroalimentación negativa hacia una meta [92]. No tiene término de energía. El sistema funcional de Anokhin tiene síntesis aferente, decisión, un aceptor de resultados de la acción fijado antes del acto, acción y comparación [93, 94]. Esto son las cláusulas 1 y 3 en su primera forma sistemática, construida sobre experimentos con animales. Sudakov enunció el resultado como el factor formador del sistema [95]. La cláusula de predicción es el principio organizador. Shvyrkov mostró a partir de registros de neuronas individuales que la meta organiza la actividad neuronal [96]. Rosen definió un sistema anticipatorio como aquel que contiene un modelo predictivo de sí mismo y de su mundo y actúa según la predicción [97]. Ninguno de ellos fija un suelo en julios. Sterling define la alostasis como regulación por predicción [98]. La fisiología pone la predicción antes del acto. Virgo, Biehl y McGregor dieron condiciones bajo las cuales los estados de un sistema pueden leerse como creencias actualizadas por el teorema de Bayes [99]. Biehl y Virgo llaman agente a un sistema cuando puede leerse como la resolución de un POMDP (proceso de decisión de Markov parcialmente observable) [100]. Ambas son definiciones formales. La cláusula 1 pide menos y fija más: una plantilla, fijada en $t_0$, con su hash en el recibo.

**Autonomía y organización.** Maturana y Varela definieron lo vivo por la autoproducción [101]. Kauffman puso un ciclo de trabajo termodinámico dentro de la definición de un agente autónomo [102]. No tiene cláusula de predicción. Di Paolo hizo de la adaptatividad, la regulación de la propia viabilidad, una condición para la producción de sentido [103]. Eso es la cláusula 3. Barandiaran y Moreno propusieron un criterio mínimo para la organización cognitiva y fundamentaron la regulación adaptativa en el metabolismo [104, 105]. Barandiaran, Di Paolo y Rohde definieron la agencia por la individualidad, la asimetría interaccional y la normatividad [106]. Ruiz-Mirazo, Moreno y Mossio plantearon la autonomía como una organización metabólica que se automantiene [107, 108]. Montévil y Mossio describieron los organismos como clausuras de restricciones sobre flujos termodinámicos [109]. Es lo más cercano a los julios dentro de esta escuela. Aguilera y Barandiaran construyeron un modelo mínimo de agencia autónoma en termodinámica estocástica [110]. La tradición de la autonomía avanza hacia el julio. Barandiaran y Almendros aplicaron la individualidad, la normatividad y la asimetría interaccional a los grandes modelos de lenguaje. Un modelo no cumple las dos primeras y cumple solo en parte la tercera [111]. La definición aplica su compuerta acto por acto: una llamada a modelo es un acto cuando su recibo contiene $R^*$, $m$ y $J$. TAME (Technological Approach to Mind Everywhere) de Levin trata la agencia como algo graduado y comprobable experimentalmente a toda escala [112]. La definición mantiene la compuerta binaria por acto y pone la graduación en $X$.

**Energía libre y física de la agencia.** Friston propone que los agentes minimizan la energía libre variacional [113, 114]. Esa energía libre es informacional, no julios, y todo sistema acotado la cumple, de modo que no fija ningún suelo. Rovelli explica la agencia mediante el gradiente de entropía [115]. La agencia es termodinámica en su raíz. Jaeger sostiene que la agencia requiere autofabricación y que la inteligencia artificial actual carece de ella [116]. Eso es una exigencia de compuerta antes de cualquier afirmación de inteligencia. Azadi vincula la agencia con la irreducibilidad computacional [117]. Wissner-Gross y Freer proponen una fuerza hacia la diversidad de trayectorias futuras [118]. Su temperatura causal no es la temperatura de un baño, de modo que sus unidades no son julios. El comentario de Kappen lo critica [119]. Fields, Goldstein y Sandved-Smith separan la energía libre termodinámica, en julios, de la energía libre variacional en los agentes de inferencia activa, y relacionan ambas [120]. Solo la magnitud en julios entra en K1. Bruineberg y sus colegas separan la manta de Markov como herramienta de inferencia de la manta como frontera física [17]. La Definición 2 toma la frontera de la definición. Bartlett y sus colegas hacen del procesamiento de información dirigido a metas, medido por la información semántica, el rasgo distintivo de los sistemas vivos [121]. Eso son las cláusulas 2 y 3 como criterio de vida.

<div id="4-layer-2-the-kinematic-laws-of-agency" class="anchor-alias" aria-hidden="true"></div>

## 4. Capa 2. Las cotas cinemáticas de la agencia

Una vez que un acto es elegible, la física acota con qué rapidez se mueve la agencia por segundo y por julio, y cuánto cuestan la precisión y la velocidad. Las cotas forman cuatro familias: límites de velocidad, la TUR, costes en tiempo finito y techos de tasa.

### 4.1 Demostrado

**Límites de velocidad.** Shiraishi, Funo y Saito demostraron el límite de velocidad clásico de la Sección 2.2 [23]. Mover la distribución de estados del agente una distancia $L$ en un tiempo $\tau$ cuesta entropía, y por tanto julios. La cota se extiende a los sistemas cuánticos abiertos [122] y al acoplamiento fuerte con entornos generales [123]. Vo, Van Vu y Hasegawa derivaron el límite de velocidad y la TUR a partir de una sola desigualdad [124]. Falasco y Esposito acotaron el tiempo para completar una transición por la disipación gastada [125]. Ito acotó la velocidad informacional geométrica de una distribución por la producción de entropía [126]. Ito y Dechant acotaron la tasa de cambio de cualquier observable por la información de Fisher y la disipación [127]. Nakazato e Ito acotaron la producción de entropía por la distancia de Wasserstein recorrida [128]. Dechant, Sasa e Ito dividieron la producción de entropía en la parte que mueve el sistema y la parte que lo mantiene en marcha [129]. Van Vu y Saito unificaron la TUR, la disipación mínima y los límites de velocidad mediante el transporte óptimo [130]. Nagayama, Yoshimura e Ito derivaron una familia de límites de velocidad indexada por medias generalizadas de la actividad [131]. Yoshimura e Ito demostraron la TUR y el límite de velocidad en redes de reacciones químicas deterministas [132]. Aurell, Mejía-Monasterio y Muratore-Ginanneschi resolvieron la disipación mínima en tiempo finito como un problema de transporte óptimo [133]. Las cotas cinemáticas forman una sola familia. La manera más barata de mover el estado de un agente es una aplicación de transporte. Hasegawa derivó el límite de velocidad, la TUR y el principio de Heisenberg a partir de una única correspondencia entre volumen y frontera [134]. Van Vu y Hasegawa acotaron la producción de entropía irreversible por una distancia de Wasserstein modificada en sistemas de Markov clásicos y cuánticos [135]. Delvenne y Falasco acotaron la producción de entropía por la estadística de observables cinéticos [136].

**La precisión cuesta disipación.** Barato y Seifert enunciaron la TUR, $\mathrm{Var}(Y)/\langle Y\rangle^2 \ge 2/\Sigma$ [25]. Un agente fiable paga por su fiabilidad. A partir de $2/\epsilon^2$ con $\epsilon = 0.01$, una precisión del 1% cuesta al menos 20,000 $k_B T$ [137]. Gingrich, Horowitz, Perunov y England demostraron la TUR para todas las corrientes en estado estacionario [26]. Horowitz y Gingrich la demostraron para tiempos de observación finitos [138], que son los que tienen los agentes. Otros resultados acotan la distribución completa de las fluctuaciones [139], cubren pasos de tiempo discretos [140], extienden la TUR allí donde vale un teorema de fluctuación [141] y cubren la dinámica de Langevin, el movimiento subamortiguado y la retroalimentación de velocidad [142, 143, 144]. Las correlaciones entre corrientes ajustan las cotas [145]. Potts y Samuelsson mostraron que toda relación de fluctuación implica una TUR, también con medición y retroalimentación [28]. Esta es la cota de precisión para agentes. Una revisión expone el campo [146]. Barato y Seifert pusieron precio a la precisión de un reloj [147]. Salazar acotó la producción de entropía por la información a partir del teorema de fluctuación detallado [148]. Landi y Paternostro revisaron la producción de entropía de lo clásico a lo cuántico [149]. Las formas con retroalimentación cubren ya los casos que encuentran los agentes. Van Vu y Hasegawa acotaron las fluctuaciones bajo protocolos de control arbitrarios por la producción de entropía y un término cinético [150]. Tanogami, Van Vu y Saito acotaron la corriente de un subsistema por su propia producción de entropía y el flujo de información entre él y su compañero [151]. Kumasaki, Tojo, Sagawa y Funo derivaron una TUR para el enfriamiento por retroalimentación [152]. Honma y Van Vu derivaron una TUR en tiempo finito para sistemas cuánticos abiertos bajo monitorización continua y retroalimentación markoviana, con la información mutua cuántica junto a la producción de entropía [153]. Para observables de conteo, Garrahan acotó las fluctuaciones por la actividad dinámica y dio las cotas correspondientes para los tiempos de primer paso [34]. Gingrich y Horowitz derivaron la relación conjugada para el tiempo de primer paso hasta acumular una corriente neta [154]. La Proposición 3 aplica estos resultados a la agencia confirmada.

**Costes en tiempo finito.** Schmiedl y Seifert hallaron protocolos óptimos en tiempo finito, con saltos en los extremos [155]. El acto óptimo a velocidad finita no es el acto lento. Sivak y Crooks acotaron el trabajo en exceso por la longitud termodinámica al cuadrado dividida por la duración [30]. Proesmans, Ehrich y Bechhoefer hallaron el coste mínimo de borrar un bit en un tiempo $\tau$ [29, 156]. El suelo de la Capa 1 se convierte en una curva de la Capa 2. Zhen y sus colegas enunciaron una cota universal en tiempo finito para la energía de reinicio [157]. La velocidad y la eficiencia se compensan entre sí por teorema: la eficiencia a máxima potencia [158, 159], la potencia finita que prohíbe la eficiencia de Carnot [160], una relación de compromiso a tres bandas entre potencia, eficiencia y constancia [161] y una restricción universal para máquinas de baja disipación [162]. Tsirlin y sus colegas hallaron la disipación mínima a una tasa fija [163]. Lee, Lee, Kwon y Park ajustaron el límite de velocidad para procesos muy irreversibles y obtuvieron una cota de Landauer en tiempo finito ajustada [164]. Van Vu y Saito derivaron el principio de Landauer cuántico en tiempo finito y el papel de la coherencia en él [165]. Rolandi y Perarnau-Llobet derivaron el principio de Landauer en tiempo finito más allá del acoplamiento débil [166]. Kamijima, Funo y Sagawa derivaron las relaciones de compromiso en tiempo finito entre medición y retroalimentación [167]. Tkachenko mostró para redes neuronales físicas que la inferencia cuasiestática no necesita trabajo, mientras que la inferencia a velocidad finita cuesta al menos una distancia de transporte (preprint) [168]. La inferencia no tiene un suelo que sobreviva a la operación lenta. El reinicio sí. La Proposición 1 le pone precio.

**Sostener una meta.** Tatikonda y Mitter [169] y Nair y Evans [170] demostraron el teorema de la tasa de datos: sostener un sistema lineal inestable necesita una tasa de canal superior a la suma de los logaritmos en base 2 de los módulos de sus valores propios inestables. Nair, Fagnani, Zampieri y Evans revisaron el campo [171]. Sandberg, Delvenne, Newton y Mitter hallaron el trabajo máximo que extrae en tiempo finito un demonio que mide continuamente, y mostraron que toda implementación necesita una fuente de potencia externa [172]. Horowitz y Sandberg mostraron que los términos de información de las desigualdades de la segunda ley forman una jerarquía, cada uno el coste mínimo de adquirir esa información mediante una medición distinta [173]. La Proposición 2 convierte el recuento de bits en un suelo en julios por paso. Es un corolario con precio en julios del teorema de la tasa de datos, no una ley nueva.

**Retroalimentación y medición cuánticas.** La segunda ley con retroalimentación vale para sistemas cuánticos [3]. Jacobs la extendió a mediciones débiles [174]. Funo, Watanabe y Ueda derivaron teoremas de fluctuación integrales bajo medición y retroalimentación cuánticas [175]. Guryanova, Friis y Huber demostraron que las mediciones proyectivas ideales necesitan recursos infinitos, y dieron el coste energético de un puntero que reproduce la estadística del sistema [176]. Danageozian, Wilde y Buscemi acotaron el calor de medición de la identificación de errores por la ganancia de información de Groenewold [177]. Estos resultados ponen precio a la medición que escribe un registro. La Proposición 4 conserva el suelo del propio registro.

**Grupos.** Wolpert derivó una cota inferior estrictamente no nula de la tasa mínima de producción de entropía de subsistemas en interacción a partir de las restricciones sobre de qué subsistemas depende cada uno [178]. Tasnim y Wolpert extendieron la teoría a subsistemas que cambian de estado conjuntamente [179]. Wolpert relacionó la producción de entropía de una red bayesiana completa con la precisión de las corrientes en sus partes [180]. Rolandi, Abiuso y Perarnau-Llobet mostraron que los protocolos colectivos pueden hacer que el trabajo disipado crezca de forma sublineal con el número de miembros [181]. Fujimoto e Ito hallaron mediante un método de teoría de juegos que las producciones de entropía parciales de subsistemas en interacción se compensan entre sí, y que el total es mínimo cuando los subsistemas reparten la penalización por igual [182]. La Proposición 7 compone estos julios con los bits acoplados del grupo.

**Techos de tasa.** Margolus y Levitin acotaron las transiciones ortogonales por segundo por la energía [31]. Lloyd aplicó el límite a un ordenador completo [183]. Deffner y Campbell revisaron la familia de los límites de velocidad cuánticos [184].

**Sensores vivos.** La disipación de energía, la velocidad de adaptación y la precisión están ligadas entre sí en la quimiotaxis bacteriana [185]. Aprender sobre el entorno requiere energía [186], y la precisión de la inferencia está ligada a la disipación [187]. La precisión de la detección está limitada por los receptores, el tiempo y la energía, con un reparto óptimo entre ellos [188]. No se puede prescindir de ningún recurso. Eso encaja con Mixture of Limits. El borrado dentro de la adaptación tiene un coste [189]. La información adquirida por energía disipada es la magnitud existente más cercana a $v_J$ en los sensores vivos [190, 191]. Copiar información cuesta energía [192]. Escribir el recibo tiene un precio. Los relojes bioquímicos precisos y sincronizados cuestan energía libre [193, 194], y lo mismo reducir el ruido con alta sensibilidad [195]. Mantener un sistema alejado del equilibrio tiene una potencia mínima [196]. Ese es el coste permanente de un agente listo para actuar. Bryant y Machta acotaron la energía de enviar un bit a través de los canales físicos de una célula, en $k_B T$ por bit, en función del tamaño, la distancia y la latencia, y la hallaron muchos órdenes de magnitud por encima de la unidad [197]. Tjalma y sus colegas mostraron que los bits del pasado que mejor predicen el futuro son prohibitivamente costosos para las redes celulares [198].

**Información ganada por selección.** La selección también escribe bits, y su tasa está acotada. Kimura midió la información que la selección natural acumula en un genoma mediante la carga sustitucional y, con los valores de carga que tomó como representativos, estimó unos 0.29 bits por generación [341]. Worden acotó la tasa a la que la selección puede añadir información a un genoma en términos de la selección aplicada por generación [342]. Hledík, Barton y Tkačik mostraron que, en poblaciones estocásticas, la tasa está acotada por el tamaño de la población multiplicado por el coste de la selección, en los modelos de Wright-Fisher, de Moran y de difusión [343]. Toda cota de este tipo es una tasa por generación. Una generación se alarga a medida que un organismo crece, de modo que un portador que aprende solo por selección gana bits acoplados cada vez más despacio por segundo. Los sistemas nerviosos escriben bits dentro de una vida, y los registros culturales los escriben a lo largo de muchas vidas. La cinemática de la Sección 2.2 se aplica a cada portador. Lo que cambia de un portador al siguiente es el tiempo por bit escrito, que es la razón por la que la agencia pasa de los genomas a los cerebros y a las herramientas cuando el mundo cambia más deprisa de lo que se suceden las generaciones.

La Figura 3 ordena los tres portadores.

![Diagrama cualitativo que sitúa tres portadores de bits acoplados en un eje de velocidad de escritura por segundo: el genoma, mediante la selección por generación, con unos 0.29 bits por generación según Kimura; el cerebro, mediante el aprendizaje dentro de una vida; y las herramientas y los registros, mediante la cultura a lo largo de muchas vidas.](/figures/agency/carriers.svg)

*Figura 3. Dónde se escriben los bits acoplados. Diagrama cualitativo; el único número es la estimación de Kimura [341]. Cotas: Worden [342]; Hledík, Barton y Tkačik [343]. Se ofrece una [copia PNG](/figures/agency/carriers.png).*

**Tasas de información sin julios.** Schreiber definió la entropía de transferencia, el flujo de información dirigido por paso [199]. Es por unidad de tiempo, no por julio, y no tiene compuerta de elegibilidad. Tishby y Polani cargaron información por paso en una recursión de Bellman [200]. Landauer convierte esos bits en julios. Stratonovich acotó la ganancia máxima a partir de una cantidad dada de información [201]. Eso es un techo del valor por bit acoplado.

### 4.2 Comprobado

**La TUR puesta a prueba.** Un experimento de RMN con dos cúbits obedeció TUR generalizadas y violó la TUR especializada donde la teoría lo predice [202]. Una máquina de información de pinzas ópticas violó la TUR original cerca de la eficiencia máxima y obedeció cotas generalizadas con información mutua [27]. Los agentes necesitan la forma con retroalimentación. Una máquina de Szilard en un punto cuántico lo confirmó de forma independiente [203]. Conductores a escala atómica examinaron la TUR con ruido de corriente medido, la física de todo chip [204]. Los motores moleculares se evaluaron por precisión por unidad de disipación [205]. Las fluctuaciones de corriente observadas acotan la disipación por abajo [206]. Un recibo de fluctuaciones es un medidor de cota inferior para los julios.

**Límites de velocidad y costes en tiempo finito puestos a prueba.** Átomos individuales en una red óptica mostraron las cotas de Mandelstam-Tamm y de Margolus-Levitin y la transición entre ellas [207]. El techo de tasa está medido. Un coloide atrapado midió relaciones de compromiso entre tiempo y entropía para transiciones térmicas rápidas [208]. Partículas brownianas forzadas por protocolos de transporte óptimo saturaron la cota de disipación mínima en tiempo finito [209]. El óptimo cinemático es alcanzable. Una trampa de retroalimentación midió una máquina browniana de dos fuerzas frente a cotas de respuesta lineal [210]. Un experimento fotónico puso a prueba cotas geométricas de la producción de entropía [211]. Dago y Bellon midieron el borrado en una memoria de doble pozo a alta velocidad y rastrearon el sobrecoste por encima de la cota de Landauer hasta sus fuentes [212].

**Sensores vivos medidos.** Mattingly, Kamino, Machta y Emonet midieron la tasa a la que E. coli adquiere información durante la quimiotaxis, y mostraron que las células remontan gradientes cerca del límite que fija esa tasa [213]. La información limita el comportamiento, y está medido.

**Máquinas térmicas a velocidad finita.** Un único coloide hizo funcionar una máquina de Stirling micrométrica [214]. Una esfera atrapada recorrió un ciclo de Carnot browniano con la eficiencia a máxima potencia medida [215]. Se midió el coste energético de elegir una de dos opciones [216]. Ese es el acto más pequeño. Una máquina coloidal funcionó con un baño bacteriano activo [217], y un ruido diseñado dio una eficiencia cercana a la de Carnot a potencia finita acortando la relajación [218]. Diseñar la actividad desplaza la cota. Una máquina de información pasó de refrigerador a calentador con el ruido [219]. El recibo debe registrar el régimen, no solo las medias.

**Empoderamiento en simulación.** Klyubin, Polani y Nehaniv definieron el empoderamiento, la capacidad del canal de las acciones a los sensores futuros [9]. Se calculó para el control continuo [220] y se revisó [221]. Mide cuánto puede mover el mundo un agente, en bits. No es una tasa por julio.

### 4.3 Opinión

La cinemática es sobre todo teorema y experimento. Las opiniones aquí se refieren a cuál es la variable correcta. Seifert sostiene que la inferencia a partir de las fluctuaciones es la vía hacia los costes ocultos [137]. Rovelli y Wissner-Gross y Freer proponen ambos una cinemática entrópica [115, 118]. Kolchinsky muestra que la disipación sola no acota la rapidez con que crecen o decaen los replicadores [222]. Las tasas están acotadas por la disipación junto con la actividad. Esa es la forma del límite de velocidad, donde $\langle A\rangle$ figura junto a $\Sigma$. Adlam, McQueen y Waegell sostienen que un sistema puramente cuántico no puede ser un agente, porque construir un modelo del mundo y deliberar necesitan copiar, lo que el teorema de no clonación prohíbe (preprint) [223]. La cláusula 3 ya pide un registro clásico de $m$.

## 5. Capa 3. La inteligencia como cálculo de la agencia

La inteligencia es la derivada de la agencia con compuerta en julios, leída sobre una ejecución completada. Esta capa necesita tres cosas de la literatura: teoría que vincule el aprendizaje y la decisión con los julios, medición de julios por unidad de trabajo útil y posiciones sobre qué es la inteligencia.

### 5.1 Demostrado

**Aprendizaje y predicción con precio en julios.** Goldt y Seifert acotaron la información que adquiere una red que aprende por la entropía que produce [224]. La eficiencia del aprendizaje es como máximo uno. Esto es $\iota$ para la parte de aprendizaje de un acto, con un techo. Still mostró que la memoria óptima conserva solo la información predictiva [225]. El julio marginal gastado en memoria debe comprar predicción. Boyd, Crutchfield y Gu demostraron que el agente que extrae más trabajo de los datos tiene el modelo de máxima verosimilitud de esos datos [226]. Mejores modelos rinden más trabajo por julio. Boyd, Crutchfield, Gu y Binder enunciaron el sobreajuste y la generalización como energética [227]. La generalización aparece como julios. Ehrich, Still y Sivak pusieron precio al propio controlador, más allá de la información que usa [228]. Así, $J$ debe medirse en la pared del sistema completo. Ehrich y Sivak dieron el libro de cuentas de los flujos de energía y de información en máquinas autónomas [229]. Wolpert revisó los costes de la computación más allá de Landauer [230]. Wolpert y sus colegas expusieron los problemas abiertos sobre los costes energéticos de la computación en termodinámica estocástica [320]. Levy y Baxter mostraron que los códigos neuronales que maximizan los bits por unidad de energía difieren de los códigos que maximizan los bits [231]. El objetivo correcto para un cerebro es la información por julio. Balasubramanian, Kimber y Berry fijaron como objetivo para un régimen exploratorio la tasa de transmisión por unidad de potencia [232]. Eso son bits por julio. Goldt y Seifert acotaron la información que una red aprende sobre una regla por el coste termodinámico del aprendizaje, para el aprendizaje por lotes y en línea [233]. Fiderer, Barth, Smith y Briegel definieron la capacidad de trabajo de un canal de entorno, la tasa máxima a la que cualquier agente puede esperar extraer trabajo en un bucle de percepción y acción. Los agentes eficientes en trabajo equilibran la predicción frente al olvido (preprint) [234]. Elliott, Gu, Garner y Thompson mostraron que los agentes adaptativos cuánticos pueden necesitar mucha menos memoria que los agentes clásicos de memoria mínima [235]. Menos memoria que reiniciar es un suelo más bajo que pagar.

**Decisiones y optimalidad acotada.** Russell y Subramanian definieron la optimalidad acotada: el mejor programa para una máquina y un entorno dados [236]. Aquí el recurso son los julios, y el óptimo es $\arg\min J$ sujeto a $X \ge X_{\mathrm{req}}$. Russell y Wefald pusieron precio a cada cómputo por su efecto esperado sobre la decisión, descontado su coste, y detuvieron la deliberación cuando ningún cómputo tenía valor neto positivo [316]. Horvitz planteó la misma relación de compromiso para el razonamiento con recursos limitados [317]. El selector de ley σ es esa regla con el coste en julios medidos. La Proposición 9 da su forma exacta para una cascada. Genewein y sus colegas derivaron la abstracción y la jerarquía a partir de la utilidad menos el coste de información [237]. Los engranajes de Mixture of Limits son una jerarquía de ese tipo. Legg y Hutter definieron la inteligencia como la recompensa esperada ponderada por complejidad sobre todos los entornos computables [238]. Es una integral, pero sobre la recompensa, sin energía, y no computable. La derivada en julios sustituye la recompensa por los bits acoplados confirmados y la medida por los julios medidos. Takahashi y Hayashi dan el cálculo en julios existente más cercano [239]. Definen dos cocientes bajo convenciones de contabilidad explícitas. La epiplejidad termodinámica por julio es $I(W^{\mathrm{post}}; Z \mid W^{\mathrm{pre}})/E_{\mathrm{cons}}$: bits nuevos sobre una variable del entorno $Z$ retenidos en el estado del agente, por julio consumido dentro de una frontera enunciada. El empoderamiento por julio es la capacidad del canal de los actos a las observaciones por unidad de coste energético esperado, la capacidad por unidad de coste de Verdú. Demuestran una referencia de Landauer de ciclo cerrado uniendo una desigualdad termodinámica del aprendizaje con el procesamiento de datos, y muestran mediante una construcción de copia reversible que, con una frontera abierta y memoria nueva aportada gratuitamente, la ganancia de información y la disipación dentro de la frontera se desacoplan. Cierran con una lista de comprobación para informar: frontera, balance de energía, referencia, grano grueso, horizonte y reinicio, rendimiento, estimador. Esta línea de trabajo toma cuatro cosas de ese trabajo. Su referencia de ciclo cerrado es K1 para el aprendizaje. Su construcción de desacoplamiento es la razón de la medición cerrada sobre el acto en la Definición 2 (Lema 1). Su lista de comprobación se adopta en la Sección 8.12. Su consejo de informar los bits por julio junto a los bits por segundo es la variable que optimiza la Predicción 1. La definición difiere de sus métricas en cuatro aspectos exactos. El empoderamiento por julio es una capacidad, un supremo sobre las distribuciones de actos; la definición acredita el flujo realizado de la política que se ejecutó (Definición 1), con la capacidad como su cota. Sus números son, según su propia declaración, informes de eficiencia relativos a una referencia; esta línea de trabajo clasifica los sistemas por $J^*$ detrás de una compuerta de corrección (Proposición 8). No tienen una predicción fijada antes del acto, ni una cláusula de consecuencia, ni rechazo; la definición exige las tres cosas antes de que cuente bit alguno. No dan ninguna cinemática del tiempo; la Predicción 1 deriva un tiempo de acto óptimo y un techo a partir de la misma contabilidad en julios. Ortega, Braun, Dyer, Kim y Tishby expusieron la racionalidad acotada en términos de teoría de la información [240]. Zénon, Solopchuk y Pezzulo plantearon el coste de la cognición como información [241]. Sims aplicó la teoría de tasa y distorsión a la percepción [242]. Su moneda son los bits. Landauer convierte los bits en julios en el reinicio.

### 5.2 Comprobado

**Cerebros.** Laughlin, de Ruyter van Steveninck y Anderson midieron el coste energético por bit en los fotorreceptores y las interneuronas de la mosca azul [243]. Las tasas de información más altas cuestan más por bit. Eso es una $\iota$ medida en un agente vivo y un rendimiento decreciente medido, $\alpha_J < 0$ en la detección. Attwell y Laughlin construyeron el presupuesto energético de la sustancia gris por proceso [244]. Lennie mostró que la energía limita cuántas neuronas corticales pueden estar activas a la vez [245]. La energía es la restricción, y el resto se adapta. La energía por potencial de acción difiere mucho entre tipos de neuronas [246]. La misma función, distintos julios. El diseño neuronal sigue a la eficiencia energética [247]. Levy y Calvert auditaron la corteza humana. La comunicación cuesta 35 veces más que el cómputo, y el cómputo de una neurona se sitúa a un factor de $10^8$ de los mejores bits por julio posibles [248]. Esa es una distancia al suelo. Harris y sus colegas hallaron que una sinapsis de la vía visual está dimensionada para maximizar la información por unidad de energía, no la información [249]. El objetivo son los bits por julio, medido en una sinapsis. Padamsey, Katsanevaki, Dupuy y Rochefort hallaron que la restricción alimentaria redujo el uso sináptico de ATP (trifosfato de adenosina) en la corteza visual del ratón en un 29% y ensanchó la sintonía de orientación en un 32% [250]. Menos julios compraron menos precisión. Plaçais y Preat mostraron que las moscas hambrientas desactivan la costosa memoria aversiva a largo plazo, y que forzarla de nuevo redujo la supervivencia [251]. Plaçais y sus colegas hallaron que un flujo de energía elevado en el cuerpo pedunculado desencadena la memoria a largo plazo [252]. Mery y Kawecki hallaron que formar memoria a largo plazo redujo la resistencia de las moscas a la desecación [253]. El aprendizaje tiene un precio metabólico medido. Hechler, de Lange y Riedl midieron un menor consumo cortical de oxígeno durante la predicción confiada, de hasta un 12% (preprint) [254]. La predicción primero puede ahorrar julios. Malkin y sus colegas dieron a las sinapsis un coste energético por la fiabilidad en redes entrenadas y hallaron firmas de inferencia bayesiana en el óptimo [255]. Li y van Rossum mostraron que la plasticidad sináptica ingenua cuesta una energía extrema y que almacenar los cambios en caché antes de la consolidación la ahorra [256]. Lynn y sus colegas infirieron la ruptura del balance detallado en el cerebro humano a partir de neuroimagen, creciente con el esfuerzo físico y cognitivo [257]. Esa producción de entropía es de grano grueso e informacional. No es un medidor de julios.

**Máquinas.** El acceso a memoria cuesta mucha más energía que la aritmética [258]. El número de parámetros importa solo a través de los julios que obliga a mover. La inteligencia por vatio mide la precisión en la tarea por unidad de potencia en aceleradores locales [259]. Su numerador es la precisión en una prueba de referencia, no la agencia con compuerta. MLPerf Power estandariza la medición de potencia desde microvatios hasta megavatios, con cada resultado sometido a la compuerta de un objetivo de precisión [260]. Esa compuerta es la forma de $J^*$. FrugalGPT encadena modelos de lenguaje en cascada y se detiene cuando un evaluador acepta la respuesta [321]. RouteLLM aprende a enviar cada consulta a un modelo fuerte o débil bajo un objetivo de coste [322]. Su coste son dólares por consulta y su compuerta es un umbral de calidad. Leídos con julios medidos y $C(z)$ como compuerta, ambos son cascadas en el sentido de la Proposición 9. ML.ENERGY mide la energía de inferencia de forma automática [261]. TokenPowerBench evalúa la potencia de la inferencia de grandes modelos de lenguaje (LLM) [262]. Jin, Wei y Brooks analizan la energía del cómputo en tiempo de prueba [263]. Los modelos de propósito general cuestan mucha más energía por tarea que los específicos [264]. El modelo suficiente más barato gana en julios. Eso es Mixture of Limits, medido. Samsi y sus colegas midieron la energía de la inferencia de grandes modelos de lenguaje en GPU (unidades de procesamiento gráfico) [265]. Dillavou y sus colegas demostraron el aprendizaje descentralizado en un circuito físico, sin procesador [266]. Stern y sus colegas entrenaron circuitos autoaprendientes para soluciones eficientes en potencia y midieron la relación de compromiso entre potencia y error [267]. Saggio y sus colegas demostraron una aceleración cuántica para agentes que aprenden en un experimento fotónico [268]. Menos interacciones para aprender son menos actos que cerrar.

**Un aceptor con energía informada por el kernel.** La Sección 8.11 informa de una ejecución preregistrada de un agente aceptor en un portátil, con la predicción primero, comparación, rechazo y presupuestos de julios que restringen. Los falsadores se fijaron antes de la ejecución, y varios se activaron: R-F1 (los julios de los selectores en tareas compartidas no son distinguibles), R-F2 (36 de 5,400 episodios gastaron de más: 9 en el brazo de ley σ y 7 en la cascada fija con $B = 1.0$, y 20 en la referencia ciega a la meta con $B = 0.5$), R-F3, R-F5 y R-F6 (Sección 8.11). $\iota$ se leyó sobre 4,940 recibos. El acto confirmado mediano dio $1.5 \times 10^5$ bits por julio informado, unas $2 \times 10^{15}$ veces los julios por bit del suelo. Bajo un presupuesto que restringe, el selector de ley σ cerró más tareas que la cascada fija, una instancia de Mixture of Limits. Esa comparación se eligió después de la ejecución, de modo que es exploratoria, y los julios por tarea cerrada fueron iguales. La segunda ejecución preregistrada y una segunda máquina repitieron la ganancia solo con el presupuesto más holgado (Sección 8.11.2). La $\iota$ integrada clasificó primero a un agente ciego a la meta con un presupuesto holgado, mientras que $J^*$ lo clasificó último.

**Grupos simulados.** Crosato y sus colegas calcularon las magnitudes termodinámicas del movimiento colectivo simulado a través de su punto crítico [269]. Chen y Prokopenko compararon la eficiencia termodinámica con utilidades puramente informacionales como explicaciones del comportamiento colectivo cerca de la criticidad [270]. $\iota_G$ en la Proposición 7 es la forma medida y con compuerta de un cociente así.

**Medidores.** RAPL (Running Average Power Limit) es el conjunto de contadores de energía integrados en el chip de los procesadores de Intel y AMD. Sus lecturas se validaron frente a una medición externa [271]. Las lecturas de DRAM (memoria dinámica de acceso aleatorio) se validaron por separado [272]. La calidad del medidor depende de la generación del procesador [273]. El manual de powermetrics de Apple indica que sus valores de potencia media «son estimados y pueden ser inexactos» y que no deben usarse para comparar dispositivos [274]. En Apple silicon, las lecturas de powermetrics son valores informados. Los julios medidos para esa máquina proceden de un medidor externo de pared.

**Compresión puntuada.** El Premio Hutter puntúa la compresión sin pérdida del primer gigabyte de un volcado de la Wikipedia en inglés, con un fondo de premios de 500,000 euros y límites de tiempo de ejecución y de memoria [275]. Acota el tiempo y la memoria, nunca los julios. Un tope de julios lo convertiría en una prueba de referencia del cálculo de la agencia para una clase de tareas.

**Estimaciones.** Estas fuentes son valiosas, y sus cifras de julios están modeladas, extrapoladas o calculadas. Figuran junto a los julios medidos, nunca en su lugar. Las estimaciones nunca son `measured_j`. Strubell, Ganesh y McCallum muestrearon la potencia en ejecuciones cortas y extrapolaron al entrenamiento completo de modelos de procesamiento del lenguaje natural [276]. Patterson y sus colegas calcularon la energía de entrenamiento a partir de datos informados sobre el hardware, el tiempo de ejecución y el centro de datos [277]. Lacoste y sus colegas construyeron una calculadora a partir del tipo de hardware, el tiempo de ejecución y la región [278]. La huella de BLOOM mezcla entradas medidas y modeladas [279]. Carbontracker lee contadores del dispositivo y predice los totales de la ejecución completa [280]. Sus predicciones son estimaciones. Elsworth y sus colegas informan de una mediana de 0.24 Wh por instrucción de texto de Gemini Apps, contando aceleradores, equipos anfitriones, capacidad ociosa y sobrecarga del centro de datos [281]. Es una cifra informada por el operador, archivada como `reported_j`.

### 5.3 Opinión

Cada posición se sitúa frente a la definición: la inteligencia es la derivada de la agencia con compuerta en julios, leída sobre una ejecución completada.

- Schmidhuber trata la recompensa intrínseca como progreso de compresión, una primera derivada de lo bien que un agente comprime su historia [282]. Es el precedente más cercano de la inteligencia como derivada leída sobre una ejecución. Su variable es la compresión, no los julios.
- Krakauer, Mitchell y Krakauer definen la inteligencia como una propiedad emergente que se expresa en usos cada vez más baratos y rápidos de capacidades emergentes para resolver problemas, resumida como «menos es más» [339]. Concluyen que los grandes modelos de lenguaje muestran como mucho capacidad emergente, no inteligencia emergente. Su definición es la más cercana en palabras a $\iota = dX/dJ$. Nombra la energía como denominador y no la mide. El cálculo aporta el medidor, la compuerta que separa la capacidad de la inteligencia (Sección 1) y la derivada leída sobre la ejecución.
- Chollet define la inteligencia como la eficiencia de adquisición de habilidades sobre los conocimientos previos y la experiencia, con la prueba de referencia ARC (Abstraction and Reasoning Corpus) [283]. Es un cociente. Su denominador es información y datos, no julios. La clasificación del ARC Prize representa el coste por tarea frente a la puntuación como medida de eficiencia [284]. El coste está en dólares. Un medidor de julios lo convierte en $J^*$.
- Hernández-Orallo construye una psicometría universal para especies y máquinas [285]. Evalúa por tareas. Esta línea de trabajo evalúa por los julios necesarios para cerrar tareas. La prueba en cualquier momento de Hernández-Orallo y Dowe se adapta al tiempo disponible [286]. El cálculo se adapta a los julios disponibles.
- Gershman, Horvitz y Tenenbaum definen la inteligencia como la utilidad esperada descontado el coste de la computación [287]. Esta línea de trabajo hace que el coste sean julios.
- Lieder y Griffiths tratan la cognición como el uso óptimo de recursos limitados [288]. Está cerca de Mixture of Limits. El recurso se deja abstracto.
- Balasubramanian lee el diseño del cerebro a través de sus límites energéticos [289].
- Silver, Singh, Precup y Sutton sostienen que la recompensa basta [290]. La recompensa la elige un diseñador. Los julios se leen en un medidor. Vamplew y sus colegas responden que una recompensa escalar no puede expresar metas con varios objetivos [291]. Esta línea de trabajo conserva una sola variable, los julios, y traslada la multiplicidad a la compuerta $X \ge X_{\mathrm{req}}$.
- Hafez y sus colegas definen la agencia y la inteligencia conjuntamente [292]. No es nativa en julios.
- Karagoz hace de la autosuficiencia energética el objetivo [293]. No tiene compuerta de predicción, ni cinemática, ni clasificación en julios entre sistemas.
- Chaisson propone la densidad de tasa de energía, la potencia por unidad de masa, como métrica de complejidad a lo largo de la evolución cósmica [294]. Es una tasa en vatios por kilogramo. El cálculo divide los bits confirmados entre los julios.

El alcance de $\iota$ se sigue de su numerador. $X$ cuenta el acoplamiento confirmado con el mundo, de modo que $\iota$ mide cuán barato le resulta a un agente cambiar el mundo tal como predijo. No mide la comprensión. Krakauer, Mitchell y Krakauer vinculan la inteligencia con representaciones compactas y comunicables [339]. Una representación compacta entra en el cálculo a través de su efecto: un agente que la posee cierra tareas posteriores con menos julios. La comprensión que nunca cambia un acto queda fuera de lo que $\iota$ lee.

### 5.4 Dónde se sitúa el cálculo

- **Demostrado:** el aprendizaje, la memoria, la predicción y el control tienen cada uno un precio en julios con un techo.
- **Comprobado:** los julios por bit se miden en cerebros. Los julios por tarea se miden en máquinas. Los medidores pueden validarse.
- **Demostrado aquí:** $\iota$ es una densidad acotada sobre el eje de los julios bajo una acreditación proporcional a los julios (Proposición 5). La $\iota$ muestreada converge a ella (Proposición 6). Los grupos se componen según la Proposición 7. Sostener una meta fija un tiempo de acto óptimo y un techo de $\iota$ (Predicción 1).
- **Comprobado aquí:** $\iota$ y $J^*$ leídos sobre los recibos de un aceptor con energía informada por el kernel, con falsadores fijados de antemano (Sección 8.11). $J^*$ clasifica a los agentes. La $\iota$ integrada no.
- **Aportado por esta línea de trabajo:** la inteligencia leída como $dX/dJ$ sobre una ejecución completada y con compuerta, con $J^*$ como clasificación. Takahashi y Hayashi son los más cercanos, con cocientes de bits por julio bajo una contabilidad explícita [239]. Esta línea de trabajo añade la compuerta de elegibilidad, el flujo realizado en lugar de la capacidad, la clasificación con compuerta y su demostración (Proposición 8) y el tiempo de acto óptimo (Predicción 1).

## 6. Hallazgos globales, por método

La búsqueda se hizo en ruso, chino, japonés, alemán, francés, español, portugués, coreano, italiano, polaco, hindi y árabe, con seguimientos en inglés. Una segunda pasada volvió a buscar en japonés, chino, ruso, alemán, francés, español y coreano y añadió el persa, el turco y el hebreo. Sus resultados se incorporan a las Secciones 2 a 5 y 8 según lo que demuestran, miden o definen. Los resultados se organizan por método y por clase de resultado. La lengua es solo un metadato. Ninguna entrada se clasifica por su procedencia.

### 6.1 Teoremas y revisiones: la información tiene un precio termodinámico

- Poplavskii dio un tratamiento sistemático temprano del coste energético de adquirir y procesar información [295]. Escrito en ruso, con traducción al inglés. Capa: definición.
- Stratonovich demostró teoremas del valor de la información [201]. Edición inglesa de una monografía rusa. Capa: cinemática.
- Ito y Sagawa aplicaron la termodinámica de la información en redes a la quimiotaxis de E. coli. La entropía de transferencia acota la robustez, y la eficiencia termodinámica informacional es alta allí donde la eficiencia termodinámica ordinaria es baja [296]. Escrito en japonés. Capas: definición y cinemática.
- Sun y Quan revisaron el demonio de Maxwell y el suelo físico de la disipación en el procesamiento de información [297]. Escrito en chino. Capa: definición.
- Quan, Dong y Sun revisaron la termodinámica mesoscópica: el demonio es coherente con la segunda ley una vez que se cuenta el borrado, y se pusieron a prueba restricciones de potencia y eficiencia [298]. Escrito en chino con resumen en inglés. Capas: definición y cinemática.
- La revisión enciclopédica de Parrondo da la versión actual de la información como recurso termodinámico [299]. Capa: definición.
- La tesis doctoral de Strasberg pone a prueba supuestos comunes de la termodinámica de la información con modelos físicos [300]. Escrita en inglés con resumen en alemán. Capa: definición.
- Otros teoremas surgieron de búsquedas en japonés, ruso, chino, coreano, portugués, italiano y polaco: límites de velocidad y TUR en redes químicas [127, 131, 132], termodinámica en tiempo finito [159, 162, 163], TUR de Langevin [143, 144], cotas de información sobre la producción de entropía [148, 149] y costes de trabajo de disparo único [38].

### 6.2 Experimentos: el precio medido

- La tesis doctoral de Dago informa del borrado y la escritura de 1 bit cerca de la energía mínima a alta velocidad en un microvoladizo subamortiguado [301]. Escrita en francés. Capa: el suelo en julios de la definición alcanzado a velocidad cinemática.
- La tesis doctoral de Lagoin construye demonios de Maxwell macroscópicos, incluida una máquina de Szilard, a partir de una paleta en un gas granular [302]. Escrita en francés. Capa: definición. La contabilidad del demonio se cumple fuera del régimen microscópico.
- Ciampini y sus colegas usaron el trabajo extraíble como testigo de correlaciones cuánticas en un experimento fotónico [303]. Capa: definición.
- Experimentos surgidos de búsquedas en coreano, portugués, hindi, italiano, español, chino y japonés: máquinas de información [27, 80], demonios de RMN [73, 74], la TUR en cúbits [202], máquinas con baño activo [217, 218], cotas geométricas [211], ruptura de simetría y ciclos de Carnot [215, 216], demonios de iones atrapados [66, 88], y conversión por retroalimentación y transporte óptimo [69, 76, 209].

### 6.3 Teoría de los sistemas funcionales: la predicción antes del acto

La escuela de Anokhin enuncia las cláusulas 1 y 3 en términos fisiológicos. Una plantilla de resultado, el aceptor de resultados de la acción, se forma antes del acto, se compara después de él, y la comparación reorganiza el comportamiento. Estos trabajos se encontraron mediante búsquedas en ruso.

- El sistema funcional de Anokhin [93, 94].
- Sudakov sobre el resultado como factor formador del sistema y sobre la predicción probabilística del comportamiento [95, 304, 305, 306].
- Shvyrkov sobre las metas que organizan la actividad neuronal y sobre el aprendizaje como selección de sistemas neuronales [96, 307].
- K. V. Anokhin sobre la estructura cognitiva del cerebro como una hiperred de elementos de sistemas funcionales [308].
- Saltykov y Grachev sobre el factor formador del sistema como anticipación [309].
- Vityaev sobre la intencionalidad formalizada como aprendizaje de reglas que predicen resultados [310].

**Implementados y ejecutados.** Las arquitecturas cognitivas construidas sobre la teoría de los sistemas funcionales forman plantillas de resultado, comparan y aprenden submetas, en simulación y en un robot físico [90, 91, 311, 312, 313]. Ninguna mide julios. Añadir un medidor a uno de estos agentes pondría a prueba el orden completo de definición, cinemática y cálculo sobre una implementación existente. Las redes lógicas probabilísticas diferenciables son herramientas de cálculo relacionadas, no construidas sobre sistemas funcionales, sin compuerta de elegibilidad y sin julios [314].

### 6.4 Autonomía, organización y agencia mínima

Encontrados mediante búsquedas en español, francés y alemán. La agencia es una organización que se automantiene y regula sus interacciones [103, 104, 105, 106, 107, 108]. La organización es una clausura de restricciones sobre flujos termodinámicos [109]. La escuela de la autonomía ha entrado en la termodinámica estocástica [110]. Capa: definición, como la organización que debe existir antes de que cuente acto alguno.

### 6.5 Julios medidos para la inteligencia de las máquinas

Encontrados mediante búsquedas en chino sobre la energía de inferencia: medición automatizada de la energía de inferencia [261], pruebas de referencia de potencia por token [262] y la energía del razonamiento en tiempo de prueba [263].

### 6.6 Filosofía de la agencia

La física de la agencia de Rovelli surgió a través del alemán [115]. Jaeger y Azadi completan el conjunto de artículos de posición [116, 117].

### 6.7 Búsquedas sin investigación primaria

Las búsquedas en hindi y árabe no devolvieron investigación primaria en esas lenguas. Los seguimientos en inglés hicieron aflorar más trabajos, enumerados arriba por método. Las búsquedas en persa, turco y hebreo devolvieron tesis, revisiones y trabajos ya citados, sin investigación primaria nueva.

## 7. Problemas abiertos

### 7.1 Qué debe demostrarse

**P1. La trayectoria de la ejecución está bien definida.** Demostrado. La Proposición 5 da $\iota = dX/dJ$ como una densidad sobre el eje de los julios con $0 \le \iota \le 1/(k_B T\ln 2)$, bajo una acreditación proporcional a los julios. La Proposición 6 da la convergencia de la $\iota$ muestreada a medida que se refina el muestreo del medidor, con el error relativo del medidor como término de error.

**P2. Cota de Landauer con compuerta de agencia.** Bajo una contabilidad de ciclo cerrado, cada bit acoplado confirmado cuesta al menos $k_B T \ln 2$, de modo que $v_J \le 1/(k_B T \ln 2)$. Disponible: el trabajo de medición más el de borrado es al menos $k_B T I$ [5], y el borrado cuesta al menos $k_B T \ln 2$ por bit [6, 7]. Falta: un paso de procesamiento de datos que muestre que los bits acoplados acreditados en $X$ no pueden superar los bits registrados en la memoria del aceptor durante la comparación. La cláusula 3 ya exige que la confirmación $m$ proceda de un registro físico. La Proposición 1 demuestra el suelo por acto tomando este paso como el supuesto (R2).

**P3. Límite de velocidad de la agencia.** Demostrado para actos cuyo registro cumple (R1) a (R4). La Proposición 1 acota por abajo los julios medios del acto $k$ por $b_k k_B T\ln 2$ más un término de tiempo finito en $\tau_k$, $\langle A\rangle_k$, el error de reinicio $\varepsilon$ y los bits confirmados, a través de la desigualdad de Fano. La Predicción 1 añade los julios permanentes de sostener una meta y da el tiempo de acto óptimo.

**P4. Cota de precisión para agentes.** Demostrado. La Proposición 3 acota la varianza relativa de la agencia confirmada por la actividad dinámica para el recuento de actos confirmados, y por la producción de entropía con el término de información bajo retroalimentación.

**P5. Teorema de la lectura a posteriori.** $\iota$ es una función solo del recibo completado. Ninguna magnitud previa a la ejecución la fija. Disponible: cada $m_k$ compara un resultado con una predicción fijada antes del acto, de modo que $m_k$ es desconocido antes de que se cierre el acto $k$. Falta: una construcción de dos mundos que coincidan en todo lo que ve un predictor previo a la ejecución y difieran en algún $m_k$. Junto con P1, esto convierte «la inteligencia se lee sobre la ejecución completada» en un teorema.

**P6. La clasificación resiste el error del medidor.** Demostrado. Proposición 8, parte 3: si $(1+\epsilon)J^*_{S_1}(q) < (1-\epsilon)J^*_{S_2}(q)$, con $\epsilon$ la cota del error relativo del medidor, entonces $S_1 \succ_q S_2$ bajo toda lectura dentro de ese error. Falta: un $\epsilon$ validado para cada medidor [271].

**P7. Optimalidad de Mixture of Limits.** Demostrado en parte. La Proposición 9 da las condiciones exactas para engranajes independientes y para dos engranajes anidados, y el mecanismo del presupuesto. La instancia de cascada fija prueba los engranajes desde el más barato hacia arriba, se detiene en el primer engranaje cuya salida supera $C(z)$ y rechaza con un recibo si el siguiente engranaje rompiera el presupuesto. Alcanza el mínimo de julios salvo el coste de los intentos fallidos. Disponible: si la suficiencia es monótona en el orden de los engranajes y los costes de los engranajes crecen con el orden, el primer engranaje suficiente es el engranaje suficiente más barato. Falta: una cota de arrepentimiento cuando las probabilidades de acierto se estiman o la suficiencia no es monótona, el caso anidado con más de dos engranajes y las condiciones bajo las cuales esta regla y el selector de ley σ, $a^* = \arg\max[H(a) - \lambda J(a)]$ sujeto a $J \le B$, eligen el mismo acto.

**P8. Cuándo se acumula la agencia.** Condiciones bajo las cuales $\alpha_J > 0$ a lo largo de una ejecución, de modo que los recibos anteriores reduzcan los julios de los cierres posteriores. Disponible: una ejecución de prueba anterior de OpenIE halló $\alpha_J \le 0$ en tareas casi óptimas. Falta: un modelo de reutilización en el que los recibos almacenados reduzcan el $J$ posterior en más que los julios de almacenamiento y consulta. Still da el lado del coste de la memoria [225]. La Sección 8.10 mide la parte de los julios de cada acto que corresponde a la plantilla.

### 7.2 Qué debe comprobarse

| ID | Afirmación | Evidencia requerida |
|---|---|---|
| D1 | $J^*$ por tarea se mide, no se estima, en al menos dos plataformas | `measured_j` de RAPL en Linux x86 y de un medidor externo de pared en Apple silicon |
| D2 | El selector de ley σ cierra tareas con menos julios medidos que la cascada fija bajo presupuestos que restringen | Ejecuciones emparejadas con las mismas tareas, engranajes, predicados, presupuestos y medidores |
| D3 | Rechazar con un recibo funciona | Cero gastos excesivos, rechazos en tareas infactibles, pocos rechazos en las factibles |
| D4 | $\iota$ se lee sobre los recibos y es estable entre semillas | Serie $\iota_k$ por ejecución con una dispersión dentro de una cota preestablecida |
| D5 | Las estimaciones no sustituyen a la medición | Concordancia de rangos entre `est_j` y `measured_j`, informada, nunca fusionada |
| D6 | Se respeta el suelo físico y se conoce la distancia | Julios medidos por bit confirmado divididos entre $k_B T \ln 2$ |
| D7 | Predicción 1: el tiempo de acto óptimo y el techo de un agente que sostiene una meta | Un barrido de $\tau$ con dos o más tasas de inestabilidad, con los julios del acto y los permanentes medidos por separado y juntos |

La Sección 8.11 informa de la primera ejecución frente a D2 a D6, con julios informados. La Sección 8.11.1 informa de la segunda ejecución en la misma máquina, con las correcciones de la guarda y del rechazo, y la Sección 8.11.2 la repite en una segunda máquina.

## 8. Plan experimental

Cada tabla, recibo y figura de este plan sigue una regla. Las estimaciones nunca son `measured_j`. Una cifra modelada se etiqueta `est_j`. Una cifra medida se etiqueta `measured_j` y nombra su medidor.

### 8.1 Medidores

Siglas: CPU (unidad central de procesamiento), GPU (unidad de procesamiento gráfico), ANE (Apple Neural Engine), CA (corriente alterna), NVML (NVIDIA Management Library).

| Nivel | Medidor | Qué lee | Etiqueta |
|---|---|---|---|
| M0 | Medidor externo de potencia en el enchufe de pared, con registro a 1 Hz o más rápido | Potencia de CA del sistema completo | `measured_j`, pared |
| M1 | RAPL a través de powercap de Linux, dominios de paquete, núcleo, uncore y DRAM cuando existan | Energía acumulada en el chip, en microjulios | `measured_j`, rapl |
| M1g | Contador de energía total de NVML en una GPU discreta | Energía acumulada de la placa de la GPU | `measured_j`, nvml |
| M2 | powermetrics de Apple, muestreadores de CPU y GPU a 100 ms | Potencia de CPU, GPU y ANE según la informa el sistema | `reported_j`, powermetrics |

- **RAPL.** Leer el contador antes y después de cada acto. Tratar el desbordamiento circular. Validar frente a M0 con una carga de calibración [271, 272].
- **powermetrics.** Las lecturas se archivan como `reported_j`. Los julios medidos en Apple silicon proceden de M0. Dentro de una misma máquina, `reported_j` atribuye los julios a la CPU, la GPU y el ANE.
- **Referencia en reposo.** Registrar 120 s de potencia en reposo en cada medidor antes de cada bloque. Informar los julios brutos y los julios con el reposo restado uno junto a otro. Nunca informar solo la cifra restada.
- **Control del estado.** Fijar el gobernador de frecuencia de la CPU donde el sistema operativo lo permita. Registrar la temperatura ambiente y la presión térmica. Cerrar los trabajos en segundo plano. Descartar una ejecución de calentamiento por brazo.

### 8.2 Tareas

Cada tarea tiene un predicado de completitud comprobable por máquina, $C(z)$: pruebas unitarias para el código, coincidencia exacta para la aritmética, validación de esquema para la extracción, un estado final verificado para el uso de herramientas. Se fijan de antemano dos estratos. Las tareas casi óptimas son las que el engranaje más barato suele cerrar. Las tareas acumulativas son secuencias en las que pueden reutilizarse recibos anteriores. $X_{\mathrm{req}}$ lo fija $C(z)$. Superarlo es una compuerta, no una puntuación.

### 8.3 Brazos

Todos los brazos comparten los engranajes, el predicado, el presupuesto, los medidores y un orden de ejecución aleatorizado e intercalado.

1. **Selector de ley σ:** $a^* = \arg\max[H(a) - \lambda J(a)]$ sujeto a $J \le B$, con rechazo sobre un recibo.
2. **Cascada fija (una instancia de Mixture of Limits):** la regla del suficiente más barato, con los engranajes probados en un orden fijo desde el más barato hacia arriba. Es la comparación emparejada: la misma información, los mismos engranajes, el mismo presupuesto y el mismo derecho de rechazo. Solo difiere la regla de selección.
3. **Siempre el engranaje más grande:** techo de referencia.
4. **Siempre el engranaje más pequeño:** suelo de referencia, con rechazo cuando falla.

Ambos selectores son instancias de Mixture of Limits. La filosofía es usar el engranaje más barato que sea suficiente, porque más allá del suelo los julios adicionales no compran progreso verificable. La cascada fija la aplica en un orden fijo. El selector de ley σ se detiene cuando el siguiente acto ya no paga sus julios. Esa es una regla de convergencia de umbral, de modo que también es una instancia de Mixture of Limits. La comparación es entre dos instancias de una misma filosofía. En el código y en los archivos de datos, la cascada fija es el brazo `mol` y el selector de ley σ es el brazo `sigma`.

### 8.4 Presupuestos, semillas y estadística

- Un piloto ejecuta el brazo 2 sin presupuesto y registra la mediana de julios medidos por tarea, $\tilde J_q$.
- Los niveles de presupuesto son $B \in \{0.25, 0.5, 0.75, 1.0\} \times \tilde J_q$, más el caso sin restricción. Un nivel restringe solo si al menos el 20% de las tareas lo superan en el piloto. Los niveles que no restringen se informan y se excluyen de la prueba de D2.
- Al menos 10 semillas por brazo, tarea y presupuesto. Más si el piloto muestra que 10 no pueden resolver una diferencia del 10% en la mediana de $J^*$ con una confianza del 95%.
- Informar la media, la mediana, la desviación estándar y un intervalo de confianza bootstrap del 95% de $J^*$ por tarea. Comparar los brazos 1 y 2 con una prueba de rangos con signo de Wilcoxon sobre la mediana de $J^*$ por tarea, con tamaño del efecto.
- El preregistro nombra los criterios de valoración primarios. Las comparaciones secundarias se corrigen con el procedimiento descendente de Holm. Un análisis elegido después de una ejecución se etiqueta como post hoc dondequiera que aparezca, incluidos los resúmenes, y nunca es el resultado principal. Se convierte en criterio de valoración primario solo en el preregistro de la ejecución siguiente.

### 8.5 Esquema del recibo

El recibo es el registro de Notational Intelligence de la ejecución. Un registro por acto:

```
act_id, run_id, task_id, arm, seed, budget_j, gear
prediction_hash, prediction_ts        # R*, fixed before the act
outcome_hash, outcome_ts              # R
m                                     # 1, mu, or 0
coupled_bits_est                      # realized I(do(a); W'), bias-corrected, with interval
coupled_bits_bound                    # capacity bound, never credited as X
t_start, t_end
measured_j   {meter, domains, gross_j, idle_w, idle_subtracted_j}
reported_j   {meter, cpu_j, gpu_j, ane_j}    # powermetrics only
wall_j       {meter, gross_j, idle_w, idle_subtracted_j}
est_j        {model, inputs}                 # never merged with measured_j
cumulative_measured_j
refused, refuse_reason
passed_C
record_states, record_bits            # N and H of the act's record M_k
joule_share                           # P_k attribution when acts overlap
template_j   {meter, write_j, hold_j, reset_j}   # joules for R*
trajectory_j {tau, activity, work}    # physical runs only, Section 8.8
```

### 8.6 Métricas

- $J^*$ por tarea: julios medidos hasta superar $C(z)$, de M0 donde exista, y si no de M1.
- Tasa de cierre por brazo y presupuesto.
- Gastos excesivos: actos que superaron $B$. El objetivo es cero.
- Calidad del rechazo: precisión y exhaustividad de los rechazos frente a las tareas que algún brazo mostró infactibles dentro de $B$.
- Serie de inteligencia: $\iota_k = \Delta X_k/\Delta J_k$ por ejecución, y su dispersión entre semillas.
- Signo de la aceleración: el signo de $\alpha_J$ a partir de la regresión de $\iota_k$ sobre el $J$ acumulado, por estrato.
- Comprobación de la estimación: la correlación de rangos de Kendall entre `est_j` y `measured_j`.
- Distancia al suelo: julios medidos por bit acoplado confirmado divididos entre $k_B T \ln 2$ a la temperatura registrada.
- Inteligencia del acto: $\iota_k = b_k/J_k$ por acto, que es igual a la densidad de la Proposición 5 en ese acto.
- Parte de la plantilla: $J^{R^*}/J$ por acto y la curva $\iota(w)$ (Sección 8.10).

### 8.7 Falsadores, fijados antes de cualquier ejecución

| ID | Observación | Afirmación refutada |
|---|---|---|
| F1 | El intervalo del 95% de la diferencia emparejada en la mediana de $J^*$, ley σ menos cascada fija, incluye o supera el cero en todo presupuesto que restringe | El selector de ley σ supera en julios a su rival justo |
| F2 | Algún brazo registra un gasto excesivo | La implementación del rechazo de ese brazo |
| F3 | La exhaustividad del rechazo en tareas infactibles es inferior a 0.9, o más del 10% de los rechazos recaen en tareas que otro brazo cerró dentro de $B$ | La corrección del rechazo |
| F4 | La correlación de Kendall entre `est_j` y `measured_j` es inferior a 0.8 | El uso de ese estimador para cualquier clasificación |
| F5 | El coeficiente de variación de la $\iota$ media entre semillas supera 0.25 en una tarea | La lectura de $\iota$ con la granularidad de esa tarea |
| F6 | El $\alpha_J$ ajustado no es positivo con una confianza del 95% en el estrato acumulativo | La acumulación en esas tareas |
| F7 | Los julios medidos medios por bit confirmado a lo largo de una ejecución caen por debajo de $k_B T \ln 2$, o lo hace cualquier acto de una máquina macroscópica | La propia contabilidad: un fallo del medidor o de la contabilidad, corregido antes de informar de cualquier otro resultado |
| F8 | M1 y M0 discrepan en una carga de calibración en más que la cota de error de P6 | Ese dominio de RAPL como fuente medida en esa máquina |
| F9 | Un ciclo de acto físico muestra un trabajo inferior al suelo de la Proposición 1 con sus $\tau$ y $\langle A\rangle$ registrados | La contabilidad de esa ejecución: un canal de salto no detectado, un potencial mal calibrado o una fuente de trabajo no medida |
| F10 | Una ejecución estacionaria muestra $\mathrm{Var}(N)/\langle N\rangle^2$ por debajo de $1/\langle K\rangle$ más allá de su intervalo de confianza | El recuento de saltos de esa ejecución: algunos saltos no se contaron |
| F11 | Un controlador sostiene la planta con julios medidos por paso por debajo de $k_B T\ln 2 \log_2\lvert\lambda\rvert$ | El medidor o el modelo de planta de esa ejecución |
| F12 | El maximizador de la $\iota(\tau)$ medida queda fuera de $\tau^* \pm 2\delta\tau^*$ de la Predicción 1, o la pendiente de $\ln\tau^*$ frente a $\ln s$ se aparta de $-1/2$ en más de dos errores estándar; o la $\iota$ de una ejecución supera el techo de la Predicción 1 | La aditividad de los julios del acto y los permanentes en un solo medidor, con $\iota$ como su densidad; para el techo, la contabilidad de esa ejecución |

### 8.8 Ciclos de acto físicos

Estas ejecuciones ponen a prueba las Proposiciones 1 a 4 en el suelo físico. El trabajo se calcula a partir de trayectorias medidas y del potencial calibrado, como en [61, 67, 70]. Se archiva como `trajectory_j` y nunca se fusiona con `measured_j`, `reported_j` ni `est_j`.

- **Ciclo de acto en un registro de carga (Proposiciones 1 y 4).** Una caja de un solo electrón o un punto cuántico conserva un registro de un bit, como en [68, 70, 71]. Cada ciclo escribe la comparación, actúa y reinicia el registro en un tiempo $\tau$. Un detector de carga cuenta cada salto por efecto túnel, de modo que se mide $\langle A\rangle$. Barrer $\tau$ sobre al menos dos décadas. Forma del resultado: trabajo por ciclo frente a $k_B T\ln 2 + k_B T/(2\tau\langle A\rangle)$, el suelo de la Proposición 1 para $N = 2$ y $b = 1$.
- **Recuento de actos confirmados (Proposición 3).** En el mismo registro, ciclando en estado estacionario, contar los actos confirmados $N$ y todos los saltos $K$ en ventanas repetidas de igual longitud. Forma del resultado: $\mathrm{Var}(N)/\langle N\rangle^2$ frente a $1/\langle K\rangle$, y la dispersión de $T_n$ frente a $1/(\langle T_n\rangle\langle k\rangle)$. En una máquina de información de trampa de retroalimentación como en [27], ejecutar el experimento directo y el inverso, calcular $\sigma_I$ a partir de las trayectorias medidas y poner a prueba la parte 3.
- **El tiempo de acto óptimo (Predicción 1).** Esta es la prueba de laboratorio.
  - *Montaje.* Una esfera coloidal en agua a temperatura $T$ se encuentra en una trampa de retroalimentación [61]. Su posición se lee cada $\Delta t$, y una fuerza de retroalimentación impone un potencial virtual $U(x, t)$. El trabajo se calcula a partir de la trayectoria mediante energética estocástica, $W = \sum_t \partial_t U(x_t, t)\,\Delta t$ [319]. Una coordenada ejecuta el ciclo de acto de un bit en un doble pozo virtual, reiniciado en un tiempo $\tau$. La otra se mantiene en la cima de un pozo virtual invertido, $U = -\tfrac{1}{2}k x^2$, cuya tasa de inestabilidad $\Lambda$ fijan $k$ y la movilidad de la esfera.
  - *Bloques.* Para cada valor de $\Lambda$, se ejecutan tres bloques intercalados en orden aleatorizado. Bloque A: actos sin meta sostenida, con nueve o más valores de $\tau$ espaciados logarítmicamente sobre al menos dos décadas; ajusta $J_0$ y $a$. Bloque B: la meta sostenida sin actos; da la potencia permanente $s$. Bloque C: ambas cosas juntas, con los mismos valores de $\tau$; da $\iota(\tau)$. Al menos 200 ciclos por punto.
  - *Barrido de $s$.* Al menos cuatro valores de $\Lambda$ que abarquen al menos una década, de modo que $s$ abarque al menos una década.
  - *Ajuste.* Ajustar $J(\tau) = J_0 + a/\tau + s\tau$ al bloque C por mínimos cuadrados ponderados. Leer el $\tau^*$ medido en el máximo de $\iota(\tau)$ mediante un ajuste cuadrático local en $\ln\tau$. Calcular $\sqrt{a/s}$ y su banda $\delta\tau^*$ a partir de los bloques A y B. Hacer la regresión de $\ln\tau^*$ sobre $\ln s$ por mínimos cuadrados e informar la pendiente con su error estándar.
  - *Falsación.* La afirmación falla si la pendiente se aparta de $-1/2$ en más de dos errores estándar, o un $\tau^*$ medido queda fuera de $\sqrt{a/s} \pm 2\delta\tau^*$, o los julios por acto del bloque C difieren de la suma de los bloques A y B más allá de su intervalo combinado del 95%. La última prueba es la aditividad en un solo medidor, el contenido físico de la predicción.
  - *Potencia estadística.* El error estándar de la pendiente debe ser inferior a 0.1. De lo contrario, la ejecución se informa como no concluyente y el barrido se amplía. Una ejecución no concluyente no es una superación.
  - *Segundo sustrato.* Una caja de un solo electrón con un detector de carga repite el protocolo, con $\langle A\rangle$ contado salto a salto [70]. La concordancia en dos sustratos es la prueba.
  - Todo el trabajo se calcula a partir de trayectorias y se archiva como `trajectory_j`.
- **Sostener una planta inestable (Proposición 2).** Un controlador digital sostiene una planta con un modo inestable de $|\lambda|$ fijo por paso, a $f$ pasos por segundo. Medir el controlador con M0 y M1. Registrar los bits por paso del registro. Forma del resultado: julios medidos por paso divididos entre $k_B T\ln 2\log_2|\lambda|$, informados como distancia al suelo. Barrer $|\lambda|$ y $f$.

### 8.9 Agentes vivos: ι medida

Forma del resultado: $\iota$ en una preparación viva, como bits por decisión divididos entre julios por decisión, ambos tomados en la misma preparación e informados con la distancia al suelo. Una $\iota$ viva cuenta como medida solo cuando ambos términos están medidos. Una cifra de julios calculada a partir de conductancias o inferida a partir de imágenes se archiva como `est_j`. La producción de entropía inferida a partir de imágenes cerebrales es de grano grueso e informacional, de modo que no es un medidor de julios [257].

- **Quimiotaxis bacteriana.** La tasa de información a partir del comportamiento de células individuales en un gradiente definido, tal como la midieron Mattingly y sus colegas [213]. Los julios a partir del consumo de oxígeno del mismo cultivo, divididos entre el número de células. El suelo de comparación es el coste de enviar un bit a través del canal de señalización de la célula, de Bryant y Machta [197], junto a $k_B T\ln 2$.
- **Corteza visual del ratón.** La información de orientación por ensayo a partir de imágenes de dos fotones, y el uso sináptico de ATP a partir de registros de célula completa, tal como Padamsey y sus colegas obtuvieron ambos [250]. La restricción alimentaria desplaza los julios. La respuesta medida de la información a los julios es el signo y el tamaño de $dX/dJ$ en una corteza.
- **Memoria de la mosca.** El flujo de energía en el cuerpo pedunculado durante la formación de la memoria a largo plazo, registrado en imágenes como hicieron Plaçais y sus colegas [252], por asociación aprendida, con la retención como confirmación. La supervivencia bajo inanición y desecación es el coste en resultados [251, 253].

### 8.10 El precio en julios de la predicción primero

Forma del resultado. Dividir los julios medidos de cada acto en la parte de la plantilla y el resto, $J_k = J_k^{R^*} + J_k^{\mathrm{act}}$. $J_k^{R^*}$ cubre la escritura, la conservación y el reinicio de $R^*(a)$. Reiniciar una plantilla con $H(R^*)$ bits de entropía cuesta al menos $H(R^*)\,k_B T\ln 2$ [6, 24]. La memoria que no predice cuesta disipación [54]. Una plantilla eleva $\iota$ cuando los julios del acto que ahorra superan sus propios julios. El resultado medido es la curva $\iota(w)$ sobre la anchura de la plantilla $w$, los bits de $R^*$, con su maximizador $w^*$ y el cociente $\Delta J^{\mathrm{act}}/\Delta J^{R^*}$ en cada paso.

Protocolo. Fijar las tareas, los engranajes, los predicados y los presupuestos. Variar $w$ sobre una rejilla preestablecida. Un acto puede detenerse en cuanto su resultado queda resuelto frente a la plantilla. Registrar `template_j` y los julios restantes del acto para cada acto, en los mismos medidores.

Evidencia disponible: la predicción confiada redujo el consumo de oxígeno cortical humano hasta en un 12%, medido mediante imágenes metabólicas (preprint) [254]. En las redes celulares, los bits del pasado que mejor predicen el futuro son prohibitivamente costosos [198]. En los bucles de percepción y acción, los agentes eficientes en trabajo equilibran la predicción frente al olvido [234].

<div id="811-first-run-a-metered-acceptor-on-a-laptop" class="anchor-alias" aria-hidden="true"></div>

### 8.11 Primera ejecución: un aceptor con energía informada por el kernel en un portátil

Esta ejecución aplica las Secciones 8.1 a 8.7 a una clase de tareas en una máquina. El código, los conjuntos de tareas, los recibos y el análisis están en el repositorio del sitio, en `experiments/agency-run`. El preregistro y sus falsadores se confirmaron primero (e830bff). El piloto y la calibración bloqueada vinieron después (5828420), y luego la ejecución principal (35c967a).

**Método.**

- **Agente y tarea.** Un proceso de Python resuelve sudokus. El predicado de completitud $C(z)$ se cumple cuando la cuadrícula está llena, cada fila, columna y caja contiene del 1 al 9, y se conserva cada número dado. Una tarea confirmada acredita $b = n_{\mathrm{empty}}\log_2 9$ bits, el número de rellenos entre los que elige el acto. Esa es la cota de capacidad de la Definición 1. El conjunto de prueba contiene 30 sudokus, 10 por estrato (fácil, medio, difícil), generados a partir de una semilla fija. Un conjunto separado de 30 calibra los selectores.
- **Engranajes.** g0 rellena las casillas con candidato único. g1 añade los candidatos únicos ocultos. g2 añade la búsqueda en profundidad.
- **Brazos.** El selector de ley σ toma $a^* = \arg\max[H(a) - \lambda J(a)]$, siendo $H(a)$ la probabilidad de acierto calibrada dados los engranajes ya probados, multiplicada por $b$, y $\lambda = b/B$. La cascada fija (una instancia de Mixture of Limits) toma el engranaje más barato cuya probabilidad de acierto calibrada sea al menos 0.5. Ambos fijan $R^*$ antes de cada acto, le aplican un hash SHA-256 (Secure Hash Algorithm, 256 bits) y le ponen una marca de tiempo. Ambos comparan después del acto y rechazan con un recibo cuando ningún acto cabe en el presupuesto. La referencia ciega a la meta elige un engranaje al azar, sin predicción, sin comparación, sin escalada y sin rechazo. El presupuesto la corta.
- **Presupuestos y semillas.** Por tarea, $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, la mediana piloto de g2 solo. Los niveles 0.5 y 1.0 restringen: el 98% y el 40% de las ejecuciones piloto los superan. El nivel 2.0 no restringe (0.7%). Hay 20 semillas por condición, en un orden intercalado con semilla. En total se ejecutaron 5,400 episodios, con 4,940 actos.
- **Etiqueta de energía.** Todo julio es `reported_j`: la estimación de energía por proceso que el kernel hace para el agente (`ri_energy_nj` de `proc_pid_rusage`), leída antes y después de cada acto, sin privilegios. El proceso es la pared del agente. La cuadrícula del sudoku se conserva dentro de ese proceso, de modo que el mundo $W'$ no está fuera de $S$ como exige la Definición 2. Esta ejecución pone a prueba la cinemática y la clasificación con compuerta, no la definición. La ejecución que pone a prueba la definición conserva la cuadrícula en un segundo proceso detrás de un socket, o en un microcontrolador. `measured_j` está vacío, porque no se conectó ningún medidor de pared. `est_j` son los ciclos multiplicados por $4.20 \times 10^{-10}$ J, el cociente mediano del piloto.

**Resultados.** Media ± desviación estándar sobre 20 semillas. Una ejecución es un brazo con un nivel de presupuesto sobre las 30 tareas. CV es el coeficiente de variación, la desviación estándar dividida entre la media.

| Brazo | $B/J_{g2}$ | Tareas cerradas de 30 | $X$ (bits) | $J$ (informado, mJ) | $\iota$ (bits por julio informado) | CV de $\iota$ | Rechazos | Cortes | Gastos excesivos |
|---|---|---|---|---|---|---|---|---|---|
| Ley σ | 0.5 | 0.60 ± 0.50 | 108 ± 91 | 20.8 ± 0.3 | 5,254 ± 4,402 | 0.84 | 29.40 | 0 | 0 |
| Ley σ | 1.0 | 9.10 ± 1.86 | 1,479 ± 316 | 43.8 ± 4.0 | 34,454 ± 10,007 | 0.29 | 20.90 | 0 | 9 |
| Ley σ | 2.0 | 28.40 ± 0.60 | 4,823 ± 105 | 66.2 ± 5.8 | 73,345 ± 6,443 | 0.09 | 1.60 | 0 | 0 |
| Cascada fija (una instancia de Mixture of Limits) | 0.5 | 0.70 ± 0.47 | 126 ± 85 | 18.8 ± 0.3 | 6,801 ± 4,569 | 0.67 | 29.30 | 0 | 0 |
| Cascada fija (una instancia de Mixture of Limits) | 1.0 | 6.45 ± 1.50 | 1,047 ± 254 | 44.7 ± 3.6 | 23,804 ± 7,067 | 0.30 | 23.55 | 0 | 7 |
| Cascada fija (una instancia de Mixture of Limits) | 2.0 | 27.50 ± 0.51 | 4,668 ± 92 | 67.0 ± 6.7 | 70,418 ± 7,766 | 0.11 | 2.50 | 0 | 0 |
| Ciega a la meta | 0.5 | 0.25 ± 0.44 | 45 ± 80 | 14.1 ± 3.1 | 2,775 ± 4,999 | 1.80 | 0 | 20.35 | 20 |
| Ciega a la meta | 1.0 | 3.85 ± 1.84 | 623 ± 301 | 26.6 ± 5.7 | 24,153 ± 13,364 | 0.55 | 0 | 17.45 | 0 |
| Ciega a la meta | 2.0 | 18.25 ± 2.71 | 3,034 ± 471 | 34.1 ± 9.7 | 92,724 ± 15,690 | 0.17 | 0 | 1.35 | 0 |

- **Por acto.** Se confirmaron 1,902 actos. La $\iota$ mediana por acto fue de $1.53 \times 10^5$ bits por julio informado, con rango intercuartílico de $8.3 \times 10^4$ a $4.7 \times 10^5$. Los julios por bit confirmado fueron al menos $3.8 \times 10^{14}$ veces $k_B T\ln 2$ a 300 K, con una mediana de $2.3 \times 10^{15}$ veces. El suelo permite $3.5 \times 10^{20}$ bits por julio.
- **Julios por tarea cerrada.** La mediana sobre los brazos fue de 0.34 a 0.38 mJ para las tareas fáciles, de 1.58 a 1.70 mJ para las medias y de 4.05 a 4.28 mJ para las difíciles.
- **Selectores, emparejados por semilla (exploratorio, post hoc).** Este análisis se eligió después de la ejecución, de modo que es exploratorio. Con $B = 1.0\,J_{g2}$ el selector de ley σ cerró 2.65 tareas más por ejecución que la cascada fija (intervalo bootstrap del 95%: 1.5 a 3.8). Su $\iota$ de ejecución fue mayor en 10,650 bits por julio (4,747 a 16,592). Con $B = 2.0\,J_{g2}$ cerró 0.9 más (0.55 a 1.25). La regla de ley σ va directamente al engranaje que basta, de modo que los julios de los intentos ligeros fallidos permanecen en el presupuesto. Los julios por tarea cerrada fueron iguales: en las 4 tareas que ambos brazos cerraron con $B = 1.0\,J_{g2}$, el intervalo emparejado fue de $-7.9$ a $+15.5$ µJ (R-F1).
- **Comprobación cruzada con el paquete.** powermetrics, ejecutado de forma no interactiva en ventanas de 30 s, leyó unos 12.1 W de potencia de CPU y 13.6 W de potencia de GPU procedentes de otros trabajos de la máquina mientras el agente estaba inactivo. El agente añadió unos 0.6 W en su propio medidor. La potencia de CPU de fondo varió en unos 0.5 W entre ventanas, de modo que los julios de paquete con el reposo restado salieron negativos. El medidor por proceso es el medidor de la ejecución. D1 y D5 necesitan un medidor de pared en una máquina por lo demás inactiva.

**Resultados de los falsadores.** Todos se fijaron antes de la ejecución.

| ID | Observación | Resultado |
|---|---|---|
| R-F1 | El intervalo del 95% de la diferencia emparejada por tarea en la mediana de $J^*$, ley σ menos cascada fija, incluye el cero en todo nivel que restringe | Se activó. Con $B = 1.0$, 4 tareas cerradas por ambos: intervalo de $-7.9$ a $+15.5$ µJ. Con $B = 0.5$, ninguna tarea cerrada por ambos. En las tareas que ambos cierran, los julios son iguales |
| R-F2 | Algún episodio termina por encima de su presupuesto | Se activó. 36 de 5,400. Ley σ 9 y cascada fija 7 con $B = 1.0$, entre un 0.07% y un 3.6% por encima, cuando la comparación final se ejecutó fuera de la guarda. Ciega a la meta 20 con $B = 0.5$, hasta un 33% por encima, con presupuestos de la anchura de unas pocas lecturas del medidor |
| R-F3 | Exhaustividad del rechazo inferior a 0.9 en niveles de tarea infactibles, o más del 10% de los rechazos en niveles de tarea que algún brazo cierra en la mitad de las semillas | Se activó. Exhaustividad de 1.00 en 41 niveles de tarea infactibles. El 13.1% de los rechazos recayó en niveles de tarea que algún brazo cerró |
| R-F4 | Tau-b de Kendall entre `est_j` y `reported_j` por acto inferior a 0.8 | Se mantuvo. 0.96 en 4,000 actos |
| R-F5 | CV de la $\iota$ de ejecución superior a 0.25 en alguna condición | Se activó en los niveles que restringen (0.29 a 1.80). Se mantuvo con $B = 2.0$ (0.09, 0.11, 0.17) |
| R-F6 | La clasificación por $J^*$ difiere de la clasificación por $\iota$ integrada | Se activó. Con $B = 2.0$, $J^*$ clasifica ley σ, cascada fija, ciega a la meta. La $\iota$ integrada clasifica primero a la ciega a la meta. Con $B = 1.0$ las dos últimas se intercambian |
| R-F7 | Un acto confirmado por debajo de $k_B T\ln 2$ por bit | Se mantuvo. El acto más bajo se situó $3.8 \times 10^{14}$ veces por encima |
| R-F8 | La $\iota$ de ejecución de la ciega a la meta es al menos la del mejor selector en un nivel que restringe | Se mantuvo. 2,775 frente a 6,801 con $B = 0.5$. 24,153 frente a 34,454 con $B = 1.0$ |

**Qué resuelve la ejecución.**

- $\iota$ se lee sobre los recibos, acto por acto y ejecución por ejecución, como exigen las Proposiciones 5 y 6. Con un presupuesto holgado es estable entre semillas.
- $J^*$ es la clasificación, y la $\iota$ integrada no lo es. El agente ciego a la meta tuvo la $\iota$ de ejecución más alta con el presupuesto holgado, cerrando 18 de 30 tareas frente a 28. Sus fallos fueron baratos. $J^*$ está sometido a la compuerta $C(z)$, de modo que clasifica a ese agente en último lugar. Por eso la Sección 2.3 clasifica por $J^*$, con $X_{\mathrm{req}}$ como compuerta.
- Exploratorio, post hoc: bajo un presupuesto que restringe, el selector de ley σ cerró más tareas que la cascada fija, y los julios por tarea cerrada fueron iguales. La ganancia está en qué tareas caben en el presupuesto, no en un cierre más barato de la misma tarea. La Sección 8.11.2 indica qué replican las ejecuciones posteriores.
- Dos correcciones de implementación preceden a la ejecución siguiente. La comparación y la escritura del recibo pasan al interior de la región protegida por la guarda. Se carga un coste de cierre medido antes de cada acto.

La Figura 4 pone la compuerta junto a la clasificación medida con el presupuesto holgado.

![Diagrama y datos. Las ejecuciones candidatas pasan por la compuerta C de z, X al menos X requerido. Las que la superan se clasifican por J estrella, los julios mínimos hasta la finalización correcta; las que no la superan no se clasifican. Debajo, la Ejecución 1 con presupuesto 2.0: la ley σ cerró 28.40 de 30 tareas con una iota de ejecución de 73,345 bits por julio; la cascada fija, 27.50 con 70,418; la ciega a la meta, 18.25 con 92,724. La iota integrada por sí sola clasificaría primero al agente ciego a la meta.](/figures/agency/gate-then-rank.svg)

*Figura 4. Primero la compuerta, después la clasificación por julios. Diagrama con datos de la Ejecución 1 con $B = 2.0\,J_{g2}$, medias sobre 20 semillas de la tabla de resultados anterior; la $\iota$ integrada por sí sola clasificaría primero al agente ciego a la meta (R-F6). Fuente: `experiments/agency-run/results`. Se ofrece una [copia PNG](/figures/agency/gate-then-rank.png).*

### 8.11.1 Segunda ejecución: aceptor con guarda, 40 semillas

Esta ejecución usa la misma clase de tareas, los mismos engranajes y los mismos tres brazos que la Sección 8.11, en el mismo portátil. El preregistro de la segunda ejecución se confirmó primero (610dd4c). El piloto y la calibración bloqueada vinieron después (c88511f), y luego la ejecución principal (920d7e2). La Predicción 1 no tiene un análogo en software en esta ejecución: el agente no tiene un coste de acto declarado que disminuya con el tiempo de acto ni un coste permanente que controle, de modo que el preregistro indica que no se ejecuta el diseño de dosis y respuesta.

**Método.**

- **Guarda.** Todo julio de un episodio se carga dentro de la guarda: la selección, el hash, los pasos de los engranajes, la comparación, el recibo y la lectura final. La comprobación de apertura usa gastado $= 0$. Los brazos de ley rechazan cuando la guarda falla. El brazo ciego a la meta se corta.
- **Umbral de rechazo.** Ambos selectores usan el cuantil $r$ de los costes de calibración para las pruebas de ajuste al presupuesto. $r$ se bloqueó a partir de la repetición de la calibración antes de la ejecución principal: $r = 0.1$, con una exhaustividad de 1.0 y una precisión de aproximadamente 0.976 en la partición de calibración.
- **Presupuestos y semillas.** Por tarea, $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, la mediana piloto de g2 solo. Los niveles 0.5 y 1.0 restringen: las fracciones piloto que los superan son 0.98 y 0.4. El nivel 2.0 no restringe (0.0067). Hay 40 semillas por condición. En total se ejecutaron 10,800 episodios.
- **Ventana de calma.** No se logró la calma. Las sondas se ejecutaron hasta el límite. La última sonda antes del inicio, a las 21:46 hora local, registró una CPU de otros procesos cercana al 621% de un núcleo, con mediaanalysisd y procesos auxiliares del editor en cabeza. La potencia de paquete de referencia fue de unos 21.4 W. La potencia de paquete en la ventana principal fue de unos 22.7 W. La ejecución registra `quiet_window = no`.
- **Etiqueta de energía.** Todo julio es `reported_j`: la estimación de energía por proceso que el kernel hace para el agente (`ri_energy_nj` de `proc_pid_rusage`), con cifras de paquete de powermetrics donde se usaron para la comprobación cruzada. `est_j` son los ciclos multiplicados por $1.783 \times 10^{-9}$ J, bloqueado en el piloto. `measured_j` está vacío: no se conectó ningún medidor de pared.
- **Comprobación cruzada con el paquete.** En la ventana principal el medidor del proceso leyó 42.35 J. Los julios netos de paquete fueron 121.81 J, un cociente de aproximadamente 2.88 respecto al proceso. La deriva de la potencia de paquete de referencia fue de unos $-0.082$ W. Como `quiet_window = no`, la comprobación cruzada se declara no realizable. El medidor por proceso sigue siendo el medidor de la ejecución.

**Resultados.** Media ± desviación estándar sobre 40 semillas. Una ejecución es un brazo con un nivel de presupuesto sobre las 30 tareas. CV es el coeficiente de variación, la desviación estándar dividida entre la media. $J$ se informa en milijulios para compararlo con la Sección 8.11.

| Brazo | $B/J_{g2}$ | Tareas cerradas de 30 | $X$ (bits) | $J$ (informado, mJ) | $\iota$ (bits por julio informado) | CV de $\iota$ | Rechazos | Cortes | Gastos excesivos |
|---|---|---|---|---|---|---|---|---|---|
| Ley σ | 0.5 | 0.62 ± 0.49 | 113 ± 89 | 59.5 ± 2.0 | 1,942 ± 1,525 | 0.785 | 29.38 | 0 | 0 |
| Ley σ | 1.0 | 2.90 ± 1.74 | 523 ± 314 | 133.7 ± 13.8 | 4,150 ± 2,892 | 0.697 | 27.10 | 0 | 0 |
| Ley σ | 2.0 | 22.73 ± 1.30 | 3,980 ± 206 | 197.3 ± 18.2 | 20,359 ± 2,388 | 0.117 | 7.28 | 0 | 0 |
| Cascada fija (una instancia de Mixture of Limits) | 0.5 | 0.57 ± 0.50 | 104 ± 90 | 60.1 ± 2.1 | 1,777 ± 1,548 | 0.871 | 29.43 | 0 | 0 |
| Cascada fija (una instancia de Mixture of Limits) | 1.0 | 2.67 ± 1.25 | 483 ± 226 | 140.3 ± 13.5 | 3,593 ± 1,948 | 0.542 | 27.32 | 0 | 0 |
| Cascada fija (una instancia de Mixture of Limits) | 2.0 | 19.93 ± 1.42 | 3,509 ± 227 | 201.2 ± 20.4 | 17,684 ± 2,909 | 0.164 | 10.07 | 0 | 0 |
| Ciega a la meta | 0.5 | 0.12 ± 0.33 | 23 ± 61 | 35.4 ± 11.6 | 513 ± 1,397 | 2.723 | 0 | 22.85 | 0 |
| Ciega a la meta | 1.0 | 1.00 ± 0.93 | 181 ± 169 | 72.0 ± 19.5 | 2,661 ± 2,579 | 0.969 | 0 | 20.00 | 0 |
| Ciega a la meta | 2.0 | 10.65 ± 2.27 | 1,859 ± 400 | 97.3 ± 30.1 | 20,302 ± 5,766 | 0.284 | 0 | 8.70 | 0 |

- **Por acto.** Se ejecutaron 7,960 actos. Se confirmaron 2,448. La tau-b de Kendall entre `est_j` y `reported_j` fue de 0.942 en 4,000 actos. La $\iota$ mediana por acto fue de aproximadamente $3.11 \times 10^{4}$ bits por julio informado. Cada acto confirmado se situó muy por encima de $k_B T\ln 2$ por bit: el más bajo estuvo unas $6.4 \times 10^{14}$ veces por encima de ese suelo.
- **Rechazo.** La exhaustividad fue de 1.0 en 49 pares infactibles. Hubo 5,223 rechazos. La proporción en tareas cerradas por algún brazo fue de aproximadamente 0.081.
- **Gastos excesivos.** Ningún episodio terminó por encima del presupuesto. La fracción máxima de gasto excesivo fue de $-0.03684$: todos los episodios terminaron por debajo del presupuesto.
- **Selectores, emparejados por semilla.** Este análisis se declaró en el preregistro. Con $B = 2.0\,J_{g2}$ el selector de ley σ cerró 2.8 tareas más por ejecución que la cascada fija (intervalo bootstrap del 95%: 2.3 a 3.275). Su $\iota$ de ejecución fue mayor en 2,674 bits por julio (1,831 a 3,504). En 39 de 40 semillas el selector de ley σ cerró más. Con $B = 0.5$ y $B = 1.0$ los intervalos de la diferencia de tareas cerradas incluyen el cero. Estos resultados no activan ningún falsador.

**Resultados de los falsadores.** Todos se fijaron antes de la ejecución. La tabla indica el resultado de la segunda ejecución junto al de la primera.

| ID | Observación | Ejecución 2 | Ejecución 1 |
|---|---|---|---|
| R-F1 | En todo nivel que restringe, el intervalo del 95% de la diferencia emparejada por tarea en la mediana de $J^*$, ley σ menos cascada fija, incluye o supera el cero | Se mantuvo, porque no pudo formarse ningún intervalo: con $B = 1.0$ ninguna tarea fue cerrada por ambos, y con $B = 0.5$ una sí. Los julios en tareas compartidas no muestran ningún ahorro de la ley σ | Se activó |
| R-F2 | Algún episodio termina por encima de su presupuesto | Se mantuvo. 0 de 10,800. La guarda carga la comparación, el recibo y la lectura final | Se activó |
| R-F3 | Exhaustividad del rechazo inferior a 0.9 en pares infactibles, o más del 10% de los rechazos en pares que algún brazo cierra | Se mantuvo. Exhaustividad de 1.0 en 49 pares infactibles. Proporción en tareas cerradas por algún brazo de aproximadamente 0.081. El umbral de rechazo por cuantil $r$ es el cambio respecto a la Ejecución 1 | Se activó |
| R-F4 | Tau-b de Kendall entre `est_j` y `reported_j` por acto inferior a 0.8 | Se mantuvo. 0.942 en 4,000 actos | Se mantuvo |
| R-F5 | CV de la $\iota$ de ejecución superior a 0.25 en alguna condición | Se activó en los niveles que restringen (0.54 a 2.72) y para el brazo ciego a la meta con $B = 2.0$ (0.284). Se mantuvo para ambos selectores con $B = 2.0$ (0.117, 0.164) | Se activó |
| R-F6 | La clasificación por $J^*$ difiere de la clasificación por $\iota$ integrada | Se activó. Con $B = 2.0$, $J^*$ clasifica ley σ, cascada fija, ciega a la meta. La $\iota$ integrada clasifica ley σ, ciega a la meta, cascada fija | Se activó |
| R-F7 | Un acto confirmado por debajo de $k_B T\ln 2$ por bit | Se mantuvo. El acto más bajo se situó unas $6.4 \times 10^{14}$ veces por encima | Se mantuvo |
| R-F8 | La $\iota$ de ejecución de la ciega a la meta es al menos la del mejor selector en un nivel que restringe | Se mantuvo. 513 frente a 1,942 con $B = 0.5$. 2,661 frente a 4,150 con $B = 1.0$ | Se mantuvo |

**Qué resuelve la ejecución.**

- La guarda cierra R-F2. Cero gastos excesivos.
- El cuantil de rechazo cierra R-F3. La exhaustividad se mantiene en 1.0 y la proporción de rechazos en tareas cerrables cae por debajo del 10%.
- $J^*$ sigue siendo la clasificación. La $\iota$ integrada sigue discrepando de ella con el presupuesto holgado (R-F6).
- La $\iota$ de ejecución sigue siendo inestable entre semillas con presupuestos que restringen (R-F5).
- R-F1 se mantuvo solo porque muy pocas tareas fueron cerradas por ambos selectores como para formar un intervalo. Ninguna ejecución muestra que el selector de ley σ cierre una tarea compartida con menos julios. La ganancia emparejada por semilla con $B = 2.0$ consiste en más tareas cerradas, no en cierres más baratos de las mismas tareas.

### 8.11.2 Segunda máquina: una replicación con un contador de energía de paquete

Esta ejecución repite el protocolo de la segunda ejecución de la Sección 8.11.1 en una segunda máquina con un contador de energía distinto. Es una replicación de la comparación de selectores, no una medición de energía. El código, los recibos y los resúmenes están en `experiments/agency-run`: `PREREGISTRATION_v2_jetson.md` y su Enmienda 1, `results_jetson/summary.md` (parte A) y `results_jetson_cyc/summary.md` (parte B). El anexo del preregistro se confirmó primero (cb059f0), después el backend del medidor y el arnés (1938577), y después la Enmienda 1 (7703822). El piloto de la parte A (6ddd086) y su ejecución principal (a652503) vinieron a continuación, y luego el piloto de la parte B (3fde1fb) y su ejecución principal (1bb2444).

**Método.**

- **Máquina.** Un portátil Linux con un procesador x86 de 14 núcleos: 6 núcleos de rendimiento con 2 hilos cada uno y 8 núcleos de eficiencia. El turbo estaba desactivado. Cada núcleo se fijó a su frecuencia base: 2.6 GHz en los núcleos de rendimiento y 1.9 GHz en los de eficiencia. El agente se ejecutó fijado a un hilo de un núcleo de rendimiento, un episodio cada vez. La frecuencia mediana del núcleo del agente durante los bloques fue de 2.6 GHz. La configuración original se restauró después de la ejecución.
- **Sin cambios.** Las tareas, el predicado, los bits acoplados, los engranajes g0 a g2, los tres brazos, la guarda, la repetición del rechazo, los niveles de presupuesto $B \in \{0.5, 1.0, 2.0\} \times J_{g2}(q)$, 40 semillas y 10,800 episodios por parte, los falsadores R-F1 a R-F8 y el análisis emparejado por semilla son los de la Sección 8.11.1.
- **Contador de energía.** RAPL (Running Average Power Limit) es el contador de energía de paquete integrado en el chip del procesador. A cada intervalo se le cargaron los julios de paquete menos la potencia de referencia en reposo de ese bloque multiplicada por los segundos del intervalo. RAPL es un modelo y un sensor dentro del chip, no un medidor de pared. Cuenta todos los procesos del paquete.
- **Ventana de calma.** No se logró la calma: `quiet_window = no`. Un ejecutor de CI (integración continua) compiló código Rust en la máquina durante todo el tiempo. Las 40 sondas previas al inicio vieron otros procesos que usaban de 1.0 a 20.0 núcleos y una potencia de paquete de 2.3 a 28.7 W. La compuerta por bloque se cumplió antes de 180 de 360 bloques en la parte A y de 244 de 360 en la parte B. 98 y 208 bloques estuvieron en calma durante toda su duración.
- **Parte A.** El medidor del agente es RAPL leído antes y después de cada acto. Toda cifra es `reported_j`.
- **Parte B.** La Enmienda 1 añadió esta parte antes de cualquier piloto, porque una prueba del arnés mostró que los actos duran de unos 0.01 a 6 ms mientras que RAPL se actualiza aproximadamente cada 1 ms en escalones de unos 5 a 60 mJ. El medidor del agente es `est_j`: los ciclos de usuario del hilo del agente multiplicados por $c$. $c$ se calibró sobre RAPL en el piloto de la parte B, neto del reposo, en 8 rondas de 3 s, en el segundo intento: $c = 6.576 \times 10^{-10}$ J por ciclo, a partir de 41.11 J de energía neta de paquete en 62,516,635,701 ciclos. Toda cifra de julios de la parte B es `est_j`. Las cifras de RAPL registradas a su lado siguen siendo `reported_j`.
- **Etiquetas.** `measured_j` está vacío en ambas partes. No se conectó ningún medidor de pared ni de derivación.
- **Nombres de los brazos.** Los nombres de los brazos y sus campos de código siguen la Sección 8.3. La referencia ciega a la meta es `blind`.

**Resultados de la parte A: RAPL leído por acto.** Media ± desviación estándar sobre 40 semillas. $J$ es `reported_j` en julios, como en el resumen. Los niveles 0.5, 1.0 y 2.0 restringen todos: 0.647, 0.40 y 0.353 de las ejecuciones piloto de g2 los superan.

| Brazo | $B/J_{g2}$ | Tareas cerradas de 30 | $X$ (bits) | $J$ (informado, J) | $\iota$ (bits por julio informado) | CV de $\iota$ | Rechazos | Cortes | Gastos excesivos |
|---|---|---|---|---|---|---|---|---|---|
| Ley σ | 0.5 | 0.00 | 0 | 0.0018 | 0 | n/a | 30.00 | 0.00 | 323 |
| Ley σ | 1.0 | 0.00 | 0 | 0.0002 | 0 | n/a | 30.00 | 0.00 | 322 |
| Ley σ | 2.0 | 1.00 ± 0.39 | 181 ± 71 | 0.0018 ± 0.0336 | 14,427 ± 18,680 | 1.295 | 29.00 | 0.00 | 322 |
| Cascada fija (una instancia de Mixture of Limits) | 0.5 | 0.00 | 0 | -0.0008 | 0 | n/a | 30.00 | 0.00 | 326 |
| Cascada fija (una instancia de Mixture of Limits) | 1.0 | 0.00 | 0 | -0.0005 | 0 | n/a | 30.00 | 0.00 | 324 |
| Cascada fija (una instancia de Mixture of Limits) | 2.0 | 1.00 ± 0.51 | 181 ± 91 | 0.0107 ± 0.0286 | 15,451 ± 23,767 | 1.538 | 29.00 | 0.00 | 320 |
| Ciega a la meta | 0.5 | 0.00 | 0 | 0.0026 | 0 | n/a | 0.00 | 30.00 | 327 |
| Ciega a la meta | 1.0 | 0.00 | 0 | 0.0009 | 0 | n/a | 0.00 | 30.00 | 323 |
| Ciega a la meta | 2.0 | 0.28 ± 0.45 | 50 ± 82 | 0.0019 ± 0.0180 | 3,801 ± 13,749 | 3.618 | 0.00 | 28.90 | 321 |

- **Resolución del contador.** El episodio mediano duró unos 0.04 ms. 10,075 de 10,800 episodios no vieron ningún cambio en el contador del paquete. 10,549 tuvieron `reported_j` igual o inferior a cero tras restar el reposo.
- **Presupuestos.** Las medianas piloto de $J_{g2}$ fueron de $-0.0110$ a $0.0914$ J, con mediana de $0.0097$ J. El umbral de apertura de la guarda fue de 0.117 J. Los presupuestos quedaron por debajo de él en 30, 30 y 28 de 30 tareas en los tres niveles, de modo que los brazos de ley rechazaron casi todas las tareas.
- **Gastos excesivos.** Cada condición registró de 320 a 327 gastos excesivos. La fracción máxima de gasto excesivo fue de 10.86. Una carga que lee cero en la mayoría de los actos y un escalón completo del contador en unos pocos no puede sostener un presupuesto de unos pocos milijulios.
- **Por acto.** Se ejecutaron 137 actos. Se confirmaron 91. 44 actos leyeron cero. 26 actos confirmados leyeron cero o menos. La tau-b de Kendall entre `est_j` y `reported_j` fue de 0.368 en 93 actos.
- **Comprobación cruzada.** El neto de paquete por bloques fue de 3.445 J frente a 2.737 J sumados sobre los episodios, un cociente de 0.794. La potencia de paquete en reposo fue de 4.01 W antes de la ejecución y de 5.55 W después. La comprobación cruzada se declara no realizable.
- **Selectores, emparejados por semilla.** Con $B = 2.0\,J_{g2}$ la diferencia de tareas cerradas fue 0 (intervalo bootstrap del 95%: $-0.15$ a $0.15$). La diferencia de $\iota$ de ejecución fue de 1,328 bits por julio informado ($-8,971$ a $12,581$). 30 de 40 semillas empataron. Con 0.5 y 1.0 ningún brazo cerró una tarea.

**Resultados de la parte B: recuento de ciclos multiplicado por una constante calibrada con RAPL.** Media ± desviación estándar sobre 40 semillas. $J$ es `est_j` en julios, como en el resumen. Los niveles 0.5 y 1.0 restringen: 0.98 y 0.40 de las ejecuciones piloto de g2 los superan. El nivel 2.0 no restringe (0.0).

| Brazo | $B/J_{g2}$ | Tareas cerradas de 30 | $X$ (bits) | $J$ (estimado, J) | $\iota$ (bits por julio estimado) | CV de $\iota$ | Rechazos | Cortes | Gastos excesivos |
|---|---|---|---|---|---|---|---|---|---|
| Ley σ | 0.5 | 1.10 ± 0.98 | 200 ± 178 | 0.0345 ± 0.0017 | 6,027 ± 5,458 | 0.906 | 28.90 | 0.00 | 0 |
| Ley σ | 1.0 | 8.75 ± 3.14 | 1,574 ± 565 | 0.0805 ± 0.0098 | 20,519 ± 8,516 | 0.415 | 21.25 | 0.00 | 0 |
| Ley σ | 2.0 | 28.60 ± 0.98 | 4,882 ± 154 | 0.1008 ± 0.0234 | 50,667 ± 10,088 | 0.199 | 1.40 | 0.00 | 0 |
| Cascada fija (una instancia de Mixture of Limits) | 0.5 | 1.15 ± 0.92 | 208 ± 167 | 0.0366 ± 0.0013 | 5,833 ± 4,757 | 0.816 | 28.85 | 0.00 | 0 |
| Cascada fija (una instancia de Mixture of Limits) | 1.0 | 9.22 ± 3.07 | 1,660 ± 551 | 0.0813 ± 0.0106 | 21,412 ± 8,130 | 0.380 | 20.77 | 0.00 | 0 |
| Cascada fija (una instancia de Mixture of Limits) | 2.0 | 27.77 ± 2.30 | 4,745 ± 377 | 0.1099 ± 0.0339 | 47,108 ± 13,216 | 0.281 | 2.23 | 0.00 | 0 |
| Ciega a la meta | 0.5 | 0.20 ± 0.46 | 36 ± 84 | 0.0210 ± 0.0055 | 1,722 ± 3,927 | 2.280 | 0.00 | 21.50 | 0 |
| Ciega a la meta | 1.0 | 3.73 ± 2.12 | 667 ± 381 | 0.0436 ± 0.0140 | 16,393 ± 9,246 | 0.564 | 0.00 | 16.68 | 0 |
| Ciega a la meta | 2.0 | 15.65 ± 2.50 | 2,662 ± 433 | 0.0499 ± 0.0160 | 57,266 ± 14,596 | 0.255 | 0.00 | 4.17 | 0 |

- **Por acto.** Se ejecutaron 7,800 actos. Se confirmaron 3,847. La $\iota$ mediana por acto fue de 69,892 bits por julio estimado, con rango intercuartílico de 35,759 a 146,697. Cada acto confirmado se situó muy por encima de $k_B T\ln 2$ por bit: el más bajo estuvo unas $3.6 \times 10^{14}$ veces por encima de ese suelo, y la mediana unas $5.0 \times 10^{15}$ veces.
- **Rechazo.** La exhaustividad fue de 1.0 en 45 pares infactibles. Hubo 4,136 rechazos. La proporción en tareas cerradas por algún brazo fue de aproximadamente 0.071.
- **Gastos excesivos.** Ningún episodio terminó por encima del presupuesto. La fracción máxima de gasto excesivo fue de $-0.03977$.
- **Tareas compartidas.** Con $B = 1.0$, 9 tareas fueron cerradas por ambos selectores. La diferencia emparejada por tarea en la mediana de $J^*$, ley σ menos cascada fija, tuvo una media de $1.02 \times 10^{-4}$ J (intervalo del 95%: $-5.23 \times 10^{-4}$ a $6.03 \times 10^{-4}$, Wilcoxon $p = 0.214$). Con $B = 0.5$ una tarea fue cerrada por ambos, con una diferencia de $-6.68 \times 10^{-6}$ J. Con $B = 2.0$, 29 tareas fueron cerradas por ambos, con una diferencia media de $-2.65 \times 10^{-4}$ J ($-6.63 \times 10^{-4}$ a $5.67 \times 10^{-5}$, $p = 0.358$).
- **Selectores, emparejados por semilla.** Con $B = 2.0\,J_{g2}$ el selector de ley σ cerró 0.825 tareas más por ejecución que la cascada fija (intervalo bootstrap del 95%: 0.125 a 1.575). Su $\iota$ de ejecución fue mayor en 3,559 bits por julio estimado ($-1,068$ a $8,320$). 9 de 40 semillas favorecieron al selector de ley σ y 27 empataron. Con $B = 0.5$ la diferencia de tareas cerradas fue de $-0.05$ ($-0.45$ a $0.35$). Con $B = 1.0$ fue de $-0.475$ ($-1.8$ a $0.775$).
- **La estimación frente al contador.** La tau-b de Kendall entre el `est_j` de cada episodio y el neto de paquete de RAPL del mismo episodio fue de $-0.037$ en 4,000 episodios. 5,258 de 10,800 episodios no vieron ningún cambio en el contador del paquete. Sumado sobre los bloques, `est_j` fue de 23.23 J frente a 17.14 J de neto de paquete de RAPL, un cociente de 1.355. La potencia de paquete en reposo fue de 9.37 W antes de la ejecución y de 3.17 W después. La comprobación cruzada se declara no realizable.

**Resultados de los falsadores.** Todos se fijaron antes de la ejecución. La parte B sustituye R-F4 por la prueba por episodio frente a RAPL, como indica la Enmienda 1. En la Ejecución 2 y en las dos partes de aquí, «Se mantuvo» significa que la observación no se produjo.

| ID | Observación | Parte A (RAPL por acto) | Parte B (modelo de ciclos) | Ejecución 2 |
|---|---|---|---|---|
| R-F1 | En todo nivel que restringe, el intervalo del 95% de la diferencia emparejada por tarea en la mediana de $J^*$, ley σ menos cascada fija, incluye o supera el cero | Se mantuvo, porque no pudo formarse ningún intervalo: una tarea cerrada por ambos, con $B = 2.0$, con una diferencia de $-0.0052$ J, y ninguna en los demás niveles | Se mantuvo, porque la observación necesita todos los niveles que restringen y $B = 0.5$ tiene una sola tarea compartida ($-6.68 \times 10^{-6}$ J) y ningún intervalo. Con $B = 1.0$ el intervalo incluye el cero | Se mantuvo |
| R-F2 | Algún episodio termina por encima de su presupuesto | Se activó. De 320 a 327 por condición | Se mantuvo. 0 de 10,800 | Se mantuvo |
| R-F3 | Exhaustividad del rechazo inferior a 0.9 en pares infactibles, o más del 10% de los rechazos en pares que algún brazo cierra | Se mantuvo. Exhaustividad de 1.0 en 88 pares. Proporción de 0.0011 | Se mantuvo. Exhaustividad de 1.0 en 45 pares. Proporción de 0.071 | Se mantuvo |
| R-F4 | Parte A: tau-b de Kendall entre `est_j` y `reported_j` por acto inferior a 0.8. Parte B: tau-b entre el `est_j` del episodio y el neto de RAPL del episodio inferior a 0.8 | Se activó. 0.368 en 93 actos | Se activó. $-0.037$ en 4,000 episodios | Se mantuvo |
| R-F5 | CV de la $\iota$ de ejecución superior a 0.25 en alguna condición | Se activó (1.295 a 3.618) | Se activó. De 0.380 a 2.280 en los niveles que restringen. Con $B = 2.0$: ley σ 0.199, cascada fija 0.281, ciega a la meta 0.255 | Se activó |
| R-F6 | La clasificación por $J^*$ difiere de la clasificación por $\iota$ integrada | Se activó. Con $B = 2.0$, $J^*$ clasifica ley σ, cascada fija, ciega a la meta. La $\iota$ integrada clasifica primero a la cascada fija | Se activó. Con $B = 2.0$, $J^*$ clasifica ley σ, cascada fija, ciega a la meta. La $\iota$ integrada clasifica ciega a la meta, ley σ, cascada fija | Se activó |
| R-F7 | Un acto confirmado por debajo de $k_B T\ln 2$ por bit | Se activó. 26 actos confirmados leyeron cero o menos, lo que los sitúa por debajo del suelo. Eso es cuantización del contador | Se mantuvo. El acto más bajo se situó unas $3.6 \times 10^{14}$ veces por encima | Se mantuvo |
| R-F8 | La $\iota$ de ejecución de la ciega a la meta es al menos la del mejor selector en un nivel que restringe | Se activó. Con $B = 0.5$ y $1.0$ todos los brazos leen 0 | Se mantuvo. 1,722 frente a 6,027 con $B = 0.5$. 16,393 frente a 21,412 con $B = 1.0$ | Se mantuvo |

**Qué resuelve la replicación.**

- RAPL por acto no puede medir actos de menos de un milisegundo. La mayoría de los episodios no vieron ninguna actualización del contador, de modo que la guarda rechazó o gastó de más solo por cuantización. La parte A es un resultado sobre la resolución del medidor. No dice nada sobre los selectores.
- Con un medidor de ciclos, el resultado de la selección tiene el mismo signo que la Ejecución 2 con $B = 2.0$: el selector de ley σ cerró más tareas por ejecución. La ganancia es menor (0.825 frente a 2.8), y el nivel 2.0 no restringió en esta máquina. En los niveles que restringen, los intervalos incluyen el cero.
- El modelo de ciclos no siguió al contador del paquete episodio a episodio (tau-b $-0.037$), y su total por bloques fue 1.355 veces el neto del contador. Los julios de la parte B clasifican los actos por ciclos. No son lecturas de energía.
- Los julios en tareas compartidas tampoco muestran aquí ningún ahorro de la ley σ. Donde el selector de ley σ gana, gana en tareas cerradas, no en un cierre más barato de la misma tarea.
- Ninguna cifra de esta sección es `measured_j`.

La Figura 5 pone uno junto a otro los resultados de tareas cerradas de las tres ejecuciones.

![Tres paneles de diagramas de barras de las tareas cerradas de 30 por brazo y nivel de presupuesto para la Ejecución 1, la Ejecución 2 y la parte B de la segunda máquina. Con el nivel holgado 2.0, el selector de ley σ cerró 28.40, 22.73 y 28.60; la cascada fija, 27.50, 19.93 y 27.77; la referencia ciega a la meta, 18.25, 10.65 y 15.65. Las barras de error muestran una desviación estándar.](/figures/agency/run-results.svg)

*Figura 5. Tareas cerradas de 30 en tres ejecuciones preregistradas. Figura de datos: media ± una desviación estándar sobre las semillas, de las tablas de resultados de las Secciones 8.11, 8.11.1 y 8.11.2 (parte B). Fuentes: `experiments/agency-run/results`, `results2` y `results_jetson_cyc`. Se ofrece una [copia PNG](/figures/agency/run-results.png).*

**Qué se replica y qué no.** El resultado de los selectores de la ejecución 1 fue exploratorio. Dos ejecuciones posteriores lo pusieron a prueba bajo preregistro.

| Afirmación de la ejecución 1 (exploratoria) | Ejecución 2 (preregistrada) | Segunda máquina, parte B (preregistrada) |
|---|---|---|
| Más tareas cerradas con $B = 1.0\,J_{g2}$: +2.65 (1.5 a 3.8) | No replicada. El intervalo incluye el cero | No replicada. $-0.475$ ($-1.8$ a $0.775$) |
| Más tareas cerradas con $B = 2.0\,J_{g2}$: +0.9 (0.55 a 1.25) | Replicada. +2.8 (2.3 a 3.275) | Replicada. +0.825 (0.125 a 1.575) |
| Julios por tarea cerrada | Iguales. Ningún ahorro en tareas compartidas | Iguales. Los intervalos de las tareas compartidas incluyen el cero |

El resultado replicado es estrecho. Con el nivel de presupuesto más holgado, el selector de ley σ cierra más tareas que la cascada fija, en dos máquinas. Ninguna ejecución muestra menos julios para la misma tarea cerrada, y la ganancia con presupuesto que restringe de la ejecución 1 no se replicó. La parte A es un resultado sobre la resolución del medidor y no pone a prueba ninguna de las dos afirmaciones.

**Protocolo de medición para la próxima ejecución.** Ambas partes fallan en el medidor, de modo que el protocolo cambia antes de volver a poner a prueba los selectores.

1. **Máquina en reposo.** No detener nada que pertenezca a otra persona. Esperar una ventana de calma, o programarla: otros procesos en 0.5 núcleos o menos durante toda la ejecución, con `quiet_window = yes` registrado. Si no se alcanza la calma, la ejecución no comienza.
2. **Medidor de pared o de derivación.** Conectar un medidor de potencia de pared, o un medidor de derivación en el raíl de alimentación, muestreado más deprisa que un acto. Solo sus lecturas rellenan `measured_j`.
3. **Primero, la comprobación de resolución.** Antes del piloto, registrar el intervalo de actualización y el tamaño del escalón del medidor frente a la duración mediana de un acto. Si el medidor no puede resolver un acto, medir bloques de actos y atribuir por recuento, e indicarlo en el preregistro.
4. **Calibrar la estimación con el medidor.** Ajustar `est_j` sobre el medidor de pared o de derivación a nivel de bloque, y exigir que R-F4 se mantenga antes de que `est_j` gobierne la guarda.
5. **Fijar y registrar.** Fijar la frecuencia, registrar las referencias en reposo antes y después, informar de la deriva y conservar el contador del paquete como comprobación cruzada etiquetada.
6. **El cierre de tareas es primario.** El preregistro de la próxima ejecución hace del cierre de tareas el criterio de valoración primario: la diferencia emparejada por semilla en las tareas cerradas, ley σ menos cascada fija, en cada nivel de presupuesto, con la corrección descendente de Holm entre niveles. Los julios en tareas compartidas (R-F1) son secundarios.

### 8.12 Presentación de resultados

Publicar todos los recibos, las trazas brutas de los medidores, las referencias en reposo y el código de análisis junto con el resultado. Informar los julios medidos, informados y estimados en columnas separadas. Nunca sumar entre niveles. Indicar qué falsadores se activaron, con la misma visibilidad que los que se superaron. Cada ejecución responde además a la lista de comprobación de Takahashi y Hayashi [239]: la frontera de contabilidad; los términos del balance de energía (energía almacenada y trabajo exportado, o una declaración de que son despreciables); la referencia y si los julios son totales o incrementales; el grano grueso de los resultados; el horizonte y el protocolo de reinicio; el tiempo de reloj y la potencia media junto a los bits por julio; y el estimador de los bits acoplados con su corrección de sesgo.

### 8.13 Dónde se sitúan los productos

- **Notational Intelligence** es el formato de recibo de la Sección 8.5.
- **Mixture of Limits** es la filosofía que ambos selectores instancian. El brazo 2 es su instancia de cascada fija.
- **El Reality Code Engine** lee $\iota = dX/dJ$ a posteriori a partir de su registro encadenado por hashes, con $X$ las tareas de programación que pasan la compuerta y $J$ sus julios etiquetados ([El Reality Code Engine, Sección 9](/papers/rce/#9-ties-to-the-companion-papers)).

La ubicación del hardware y de los productos está en el [libro blanco de Metabolic Intelligence](/products/mei/#where-the-products-sit). Los medidores de este plan son M0 y M1 de la Sección 8.1.

## Referencias
