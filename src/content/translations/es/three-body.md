---
title: "La búsqueda de la AGI resuelve el problema de los tres cuerpos en la computación"
deck: "Los sistemas informáticos fallan con mayor frecuencia en las transferencias entre las personas que los especifican, construyen y utilizan. Verificar cada suposición en cada transferencia proporciona una pila en la que una corrección permanece donde se realiza."
lang: "es"
source: "three-body"
complete: true
---

<div id="the-pursuit-of-agi-resolves-the-three-body-problem-in-computing" class="anchor-alias" aria-hidden="true"></div>

*Revisión 395f081, 4 de noviembre de 2026. LaTeX PDF: [/pdfs/latex/three-body.pdf](/pdfs/latex/three-body.pdf) ([source](/pdfs/latex/three-body.tex))*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

Los grandes fallos de ingeniería a menudo comienzan donde un grupo entrega trabajo a otro y una suposición nunca se escribe. Este artículo define esas entregas, indica cuándo verificarlas hace que un sistema sea estable y ofrece pruebas que podrían demostrar lo contrario.

**En palabras sencillas**

1. La mayoría de los grandes fallos informáticos ocurren en la entrega entre equipos o partes, no dentro de ellos.
2. La causa suele ser una conjetura que nadie anotó, como la unidad en la que está un número.
3. Si cada una de esas conjeturas se escribe y se verifica mediante una máquina, una corrección realizada en un lugar permanece corregida y no rompe nada por encima de ella.

<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. Tesis

En la novela de Liu Cixin *The Three-Body Problem* [1], una civilización vive en un planeta que orbita tres soles. Sus estaciones no tienen ritmo, porque nadie puede predecir dónde estarán tres cuerpos bajo gravedad mutua. El título de este artículo toma esa imagen para la computación y luego la invierte: la inestabilidad es real, pero tiene una causa que puede localizarse, y la causa puede eliminarse.

La computación tiene tres cuerpos. **Teóricos** establecen lo que un sistema debe hacer: la matemática, la especificación, el algoritmo, el modelo físico. **Constructores** lo construyen: los diseñadores de chips, los escritores de compiladores y núcleos, los autores de bibliotecas, los integradores. **Usuarios** lo ejecutan: los operadores, los programas descendentes, las personas y las máquinas que dependen de su salida. Cada cuerpo es competente y coherente internamente. Un teorema se mantiene. Un chip cumple su hoja de datos. Un usuario sigue la documentación.

El problema reside entre ellos. Cada transferencia de un cuerpo a otro conlleva suposiciones: sobre unidades, voltajes, rangos, temporización, memoria, codificaciones, versiones, envolventes operativas e intención. Cuando cada cuerpo asume que la transferencia no existe, o que es responsabilidad de otro, la suposición nunca se escribe, y una suposición que no se escribe nunca se verifica.

**La afirmación central.** La inestabilidad de los sistemas informáticos se localiza en sus interfaces no examinadas, no en los cuerpos. Perseguir la inteligencia artificial general (AGI) de forma seria, como un sistema que debe actuar correctamente en cada cuerpo y en cada nivel de la pila, obliga a que todas las suposiciones de interfaz se hagan explícitas y se verifiquen. Una pila cuyas suposiciones de interfaz son todas explícitas y verificadas es estable en un sentido preciso: una corrección realizada en un nivel permanece correcta en ese nivel y se propaga a todos los niveles superiores. Esa es la resolución que el título nombra.

La afirmación es de ingeniería y teoría. Se expone con definiciones en [Sección 5](#5-definitions-and-propositions), se apoya en la literatura de interfaces revisada en [Sección 4](#4-the-interface-literature), su evidencia proviene de sistemas verificados y probados de forma independiente ([Sección 6](#6-the-stabilized-configuration)), y lleva protocolos y falsificadores que pueden refutarla ([Sección 8](#8-protocols) y [Sección 9](#9-falsifiers)).

<div id="2-the-three-body-problem-and-what-the-analogy-carries" class="anchor-alias" aria-hidden="true"></div>

## 2. El problema de los tres cuerpos y lo que conlleva la analogía

<div id="21-what-the-physics-says" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Lo que dice la física

Newton resolvió el movimiento de dos cuerpos bajo gravedad mutua en forma cerrada: cada uno se mueve sobre una sección cónica alrededor de su centro de masa común. Añadir un tercer cuerpo cambia el carácter del problema. El memorándum de Poincaré para el premio del rey Oscar II, publicado en *Acta Mathematica* en 1890, mostró que, más allá de los integrales clásicos, el problema de tres cuerpos no posee integrales adicionales del tipo que lo reducirían a cuadraturas, y al corregir un error en su primera presentación encontró el enredo de trayectorias cerca de una órbita periódica que ahora se reconoce como la primera aparición del caos determinista [2, 3]. La historia de Barrow-Green rastrea el episodio desde el premio hasta el memorándum corregido [3].

«No hay forma cerrada general» requiere precisión, porque a menudo se exagera. Sundman demostró, en trabajos publicados en 1912 y 1913, que el problema de tres cuerpos sí tiene una solución en serie convergente para todo el tiempo, siempre que el momento angular total no sea cero [4], y Wang extendió una solución en serie global al problema de n cuerpos en 1991 [5]. Las series convergen tan lentamente que resultan inútiles para la predicción. El contenido práctico del resultado de Poincaré perdura: no existe una fórmula simple, y condiciones iniciales cercanas pueden separarse exponencialmente, de modo que la predicción a largo plazo de una configuración genérica no está disponible. Lorenz encontró la misma sensibilidad en un modelo de tres variables de convección en 1963 [6]. Stone y Leigh demostraron en 2019 que el problema caótico y no jerárquico de tres cuerpos puede describirse estadísticamente, mediante la distribución de sus resultados, aunque las trayectorias individuales no puedan predecirse [7].

<div id="22-the-special-stable-configurations" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Las configuraciones estables especiales

El caos es el caso genérico, no el único caso. Lagrange descubrió en 1772 que tres cuerpos pueden mantener sus posiciones relativas mientras giran juntos: en una línea recta, o en los vértices de un triángulo equilátero [3]. En el problema restringido, donde el tercer cuerpo es ligero, estos son los cinco puntos de Lagrange. Los puntos triangulares son linealmente estables cuando el primario mayor es lo suficientemente pesado en relación con el menor, una condición que Routh señaló en 1874 (relación de masas superior a aproximadamente 25) [8]. Las naves espaciales ahora se estacionan cerca de los puntos de Lagrange del Sol y la Tierra por esa razón. Existen más soluciones periódicas: Moore encontró la órbita de ocho figura numéricamente en 1993 [9], Chenciner y Montgomery demostraron su existencia para masas iguales en 2000 [10], y Šuvakov y Dmitrašinović hallaron nuevas familias en 2013 [11].

La lección de este artículo está en la forma de esas soluciones. Cada configuración estable es un arreglo especial en el que las fuerzas entre los cuerpos están equilibradas en un marco que se mueve con ellos. La estabilidad no es una propiedad de un solo cuerpo. Es una propiedad de las relaciones entre los cuerpos, y de un marco en el que esas relaciones se mantienen fijas.

<div id="23-analogy-and-mechanism" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Analogía y mecanismo

Una metáfora tomada de la física puede inducir a error. La tabla separa lo que este artículo usa como analogía de lo que afirma como mecanismo.

| El problema de los tres cuerpos | En computación | Estado en este artículo |
|---|---|---|
| Tres masas, cada una simple por sí sola | Teóricos, creadores y usuarios, cada uno coherente por sí solo | Analogía |
| La inestabilidad surge de las interacciones, no de ningún cuerpo | El fallo surge en las interfaces, no dentro de los cuerpos | Mecanismo, respaldado por los estudios de fallos en la Sección 3 y la literatura en la Sección 4 |
| Dependencia sensible de las condiciones iniciales | Un pequeño desajuste no controlado en una interfaz crece a medida que se propaga a través de los niveles | Mecanismo, enunciado como Proposición 2 |
| No hay forma cerrada general útil | Ningún cuerpo único puede predecir el comportamiento del sistema completo a partir de su propio modelo | Analogía; la computación no tiene ecuaciones de movimiento |
| Configuraciones estables existen en un marco co-rotante | Una pila cuyas suposiciones de interfaz están todas verificadas mantiene una corrección donde se realiza | Mecanismo, enunciado como Proposición 3 |
| Descripción estadística de resultados caóticos [7] | Las tasas de fallo pueden medirse a gran N incluso cuando los fallos individuales no se predicen | Método, usado en los protocolos de la Sección 8 |

El artículo nunca afirma que la computación obedece a la dinámica newtoniana, que las interfaces ejercen fuerzas, o que se pueda calcular un exponente de Lyapunov para una organización. La física aporta vocabulario y una lección estructural: la estabilidad proviene de las relaciones, y se encuentra en configuraciones especiales, no en el caso genérico.

<div id="3-the-three-bodies-of-computing-and-their-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 3. Los tres cuerpos de la computación y sus interfaces

![Diagram of three bodies, theorists, makers and users, drawn as circles at the corners of a triangle. Each edge between two bodies is an interface drawn as a band, labeled with the assumptions that cross it: theorist to maker carries the specification, its units and its operating envelope; maker to user carries the API, the version and the voltage and timing limits; user to theorist carries the actual use, the observed failures and the intent that was never written. Dashed portions of each band mark assumptions that no body writes down or checks.](/figures/three-body/three-bodies.svg)

*Figura 1. Los tres cuerpos y sus tres interfaces. Diagrama. Los cuerpos se dibujan sólidos porque cada uno es coherente por sí mismo. Las bandas discontinuas son las suposiciones no examinadas donde se originan los fallos. Se proporciona una [copia PNG](/figures/three-body/three-bodies.png)*.

<div id="31-theorist-to-maker" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Del teórico al creador

Una declaración de un teórico asume un dominio: unidades, rangos, un sobrecuerpo operativo, una máquina idealizada. La implementación de un creador asume que la declaración está completa. Cuando ninguno de los dos escribe el sobrecuerpo, la implementación es correcta para un mundo que no es el que va a ejecutar.

La pérdida del Mars Climate Orbiter en 1999 es el caso de libro de texto. La Junta de Investigación de Incidentes encontró que el software terrestre suministró datos de impulso de los propulsores en unidades inglesas (pound‑force seconds) donde el software de navegación esperaba unidades métricas (newton seconds), y que el error se acumuló durante el crucero hasta que la nave espacial entró en la atmósfera muy por debajo de la altitud planificada [12]. Cada parte realizó su propio trabajo. La unidad fue una suposición de interfaz que nadie verificó.

<div id="32-maker-to-user" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Del creador al usuario

Un fabricante publica una interfaz y un usuario depende de ella. La documentación indica parte del contrato. El resto es lo que la implementación haga. La observación de Hyrum indica la consecuencia: con suficientes usuarios de una API, cada comportamiento observable del sistema será dependido por alguien, sea cual sea la promesa del contrato [13]. El ensayo de Spolsky sobre abstracciones con fugas hace el punto complementario: toda abstracción no trivial expone, en algún grado, lo que fue construida para ocultar [14].

El primer vuelo del Ariane 5 en 1996 muestra cómo la suposición de un fabricante se traslada a un nuevo usuario. La junta de investigación encontró que el software de referencia inercial reutilizado del Ariane 4 convirtió un valor de punto flotante de 64 bits relacionado con la velocidad horizontal en un entero con signo de 16 bits; en la trayectoria más rápida del Ariane 5 el valor excedió el rango, la conversión generó una excepción, ambas unidades de referencia se apagaron y el lanzador se desintegró aproximadamente 40 segundos después del inicio de la secuencia de vuelo [15]. El software era correcto para el sobre‑cuerpo para el que fue escrito. El sobre‑cuerpo era una suposición de interfaz que viajó con el código sin ser restablecida ni verificada [15, 16].

El mismo patrón aparece en el límite del hardware. Un conjunto de instrucciones es un contrato que los proveedores revisan. La especificación no privilegiada de RISC‑V enumera varias bases ratificadas y una lista larga y creciente de extensiones ratificadas [17]. Apple trasladó el Mac de procesadores Intel a Apple silicon, anunciado en 2020, y suministra Rosetta como capa de traducción para aplicaciones construidas para el contrato anterior; la página de Apple también indica que a partir de macOS 28 Rosetta permanecerá solo para ciertos juegos antiguos [18]. La capa de traducción es ella misma una interfaz con un fin publicado. El software escrito como si el contrato de instrucción fuera fijo se encuentra con una revisión que no esperaba, y la solución es otra capa de interfaz.

<div id="33-user-to-theorist" class="anchor-alias" aria-hidden="true"></div>

### 3.3 Del usuario al teórico

La ruta de retorno es la menos examinada. Los usuarios aprenden lo que un sistema realmente hace, dónde falla y qué pretendían solicitar. A menos que ese conocimiento regrese a los teóricos como una declaración revisada, la siguiente especificación repite las suposiciones anteriores. El relato de Zave y Jackson sobre los requisitos hace precisa la brecha: un requisito es una declaración sobre el entorno, una especificación es una declaración en la interfaz, y el conocimiento del dominio que los conecta suele estar sin escribir [19]. La “lotería de hardware” de Hooker muestra la ruta de retorno funcionando en sentido inverso: las ideas de investigación tienen éxito o fracasan según el hardware y el software que estén disponibles, no solo por sus méritos, por lo que lo que los creadores construyen determina lo que los teóricos pueden pensar [20].

<div id="34-why-the-instability-looks-irreducible" class="anchor-alias" aria-hidden="true"></div>

### 3.4 Por qué la inestabilidad parece irreducible

Cada cuerpo ve solo su propio modelo coherente. Desde el interior de cualquier cuerpo, los fallos descritos aparecen como mala suerte o error de otro, porque la causa se encuentra en un borde que ningún cuerpo posee. Esta es la contraparte computacional de la afirmación de que tres cuerpos no tienen una fórmula simple: ningún modelo de un solo participante predice el conjunto. Sculley y colegas encontraron la misma estructura dentro de los sistemas de aprendizaje automático, donde el código del modelo es una pequeña parte del sistema y la mayor parte del costo de mantenimiento reside en el código de unión, la configuración, las dependencias de datos y los consumidores no declarados, es decir, en las interfaces [21].

<div id="4-the-interface-literature" class="anchor-alias" aria-hidden="true"></div>

## 4. La literatura sobre interfaces

La tesis no es nueva en sus partes. Su contribución consiste en ensamblarlas en una única declaración y adjuntar una configuración estabilizadora y una prueba.

**La estructura sigue la comunicación.** Conway observó en 1968 que las organizaciones que diseñan sistemas producen diseños que copian la estructura de comunicación de la organización [22]. MacCormack, Baldwin y Rusnak probaron esta hipótesis de espejo en pares de productos construidos por organizaciones fuertemente y débilmente acopladas y encontraron que las arquitecturas de los productos difieren en la dirección predicha [23]. Si los cuerpos no se comunican a través de un borde, el sistema tiene una interfaz no examinada en ese borde.

**Las interfaces son donde se asienta el conocimiento de diseño.** Parnas argumentó en 1972 que un sistema debe dividirse en módulos según las decisiones que cada módulo oculta, de modo que un cambio en una decisión se limite a un módulo [24]. Baldwin y Clark generalizaron esto en reglas de diseño: decisiones de interfaz visibles fijadas de antemano, detrás de las cuales los módulos ocultos pueden variar [25]. Henderson y Clark demostraron que las empresas establecidas fracasan en la innovación arquitectónica, un cambio en cómo se enlazan los componentes conocidos, porque su conocimiento de las interfaces está incrustado en su organización y no se examina [26].

**La corrección debe verificarse en los extremos.** El argumento de extremo a extremo de Saltzer, Reed y Clark sostiene que una función puede implementarse completa y correctamente solo con el conocimiento de la aplicación en los puntos finales, por lo que las verificaciones en capas inferiores son, como máximo, ayudas de rendimiento [27]. El argumento no dice que las interfaces intermedias no necesiten verificaciones. Dice que la propiedad que importa debe comprobarse donde su significado es conocido.

**Los contratos hacen explícitas las suposiciones.** Hoare dio a los programas precondiciones y postcondiciones en 1969 [28]. Meyer las convirtió en diseño por contrato, donde cada rutina indica lo que requiere y lo que garantiza [29]. Liskov y Wing definieron cuándo un componente puede reemplazar a otro: cuando preserva el comportamiento del que sus usuarios dependen [30]. Cada una es una forma de registrar una suposición de interfaz para que pueda verificarse.

**La reutilización falla por suposiciones incompatibles.** Garlan, Allen y Ockerbloom descubrieron en 1995 que construir un sistema a partir de partes existentes falló porque cada parte hacía suposiciones implícitas sobre las demás, sobre control, datos, protocolos y el entorno, y esas suposiciones entraban en conflicto [31]. Al revisar el problema en 2009, encontraron que aún persistía [32].

**Los accidentes son fallos de interacción.** La exposición teórico-sistémica de Leveson trata la seguridad como un problema de control: los accidentes surgen de interacciones inseguras entre componentes que cumplen cada uno su propia especificación [33]. El breve tratado de Cook sobre fallos en sistemas complejos dice lo mismo desde la operación: una catástrofe requiere múltiples fallos, y el sistema suele funcionar en modo degradado [34]. Las observaciones de Lehman sobre la evolución del software añaden el factor tiempo: un programa usado en el mundo debe seguir cambiando, y su complejidad crece a menos que se realice trabajo para reducirla [35].

**Los núcleos verificados demuestran que un límite puede ser una prueba.** seL4 fue el primer núcleo de sistema operativo de propósito general con una prueba verificada por máquina de que su implementación cumple su especificación [36]. La prueba es una verificación de interfaz total: entre la especificación y el código, no se asume nada.

<div id="5-definitions-and-propositions" class="anchor-alias" aria-hidden="true"></div>

## 5. Definiciones y proposiciones

<div id="51-definitions" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Definiciones

**Definición 1 (cuerpo).** Un cuerpo es una parte con un modelo internamente coherente de un sistema: un teórico, un creador o un usuario. Un cuerpo puede ser una persona, un equipo, una organización o un programa.

**Definición 2 (interfaz).** Una interfaz es una transferencia entre dos cuerpos, o entre dos niveles de una pila, a través de la cual la salida de un lado se convierte en la entrada del otro lado.

**Definición 3 (supuesto de interfaz).** Un supuesto de interfaz es un predicado $a$ sobre los valores que cruzan una interfaz, del que depende el lado receptor para su propia corrección. Ejemplos: una unidad, un rango, un tipo, un voltaje, un límite de tiempo, una versión, un sobre.

**Definición 4 (comprobado y no examinado).** Un supuesto se considera comprobado cuando un mecanismo evalúa $a$ en cada cruce y rechaza el cruce cuando $a$ falla. Se considera no examinado cuando se confía en él pero no está escrito ni evaluado.

**Definición 5 (pila).** Una pila es una secuencia de niveles $L_0, \dots, L_n$ donde cada nivel consume el nivel inferior solo a través de la interfaz entre ellos. Un cuerpo puede poseer varios niveles; una interfaz puede unir dos cuerpos o dos niveles de un mismo cuerpo.

**Definición 6 (agente general).** Siguiendo a Legg y Hutter, un agente general es aquel cuyo rendimiento se mide a través de una amplia clase de entornos, no en una sola tarea [37]. Morris y colegas operacionalizan niveles de AGI tanto por rendimiento como por generalidad [38]. Para este artículo la propiedad relevante es la generalidad entre cuerpos: el agente debe actuar como teórico, creador y usuario, y a través de cada nivel de la pila.

<div id="52-propositions" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Proposiciones

**Proposición 1 (las fallas se originan en interfaces no examinadas).** Si cada cuerpo es correcto con respecto a su propio modelo, entonces toda falla del sistema compuesto viola al menos una suposición de interfaz, y si cada suposición se verifica, la primera suposición violada se rechaza en la interfaz donde ocurre.

*Esbozo de prueba.* Si cada cuerpo es correcto respecto a sus entradas y cada entrada satisface las suposiciones de las que depende el cuerpo, la composición es correcta por inducción sobre la pila. Por lo tanto, una falla requiere algún cruce en el que una suposición falle. Si esa suposición se verifica, el cruce se rechaza allí, de modo que la falla se localiza en esa interfaz y no se propaga. ∎

**Proposición 2 (las incompatibilidades no verificadas se propagan).** Si una suposición en la interfaz entre $L_k$ y $L_{k+1}$ no se examina, una violación en esa interfaz puede producir valores incorrectos en todos los niveles superiores a $k$, y ninguna verificación en un nivel superior a $k$ que se formule solo en los términos de ese nivel puede localizarla.

*Esbozo.* Los niveles superiores a $k$ ven solo las salidas de $L_{k+1}$, que están bien formadas respecto al propio modelo de $L_{k+1}$. El Mars Climate Orbiter es el caso: la solución de navegación era internamente consistente y errónea [12].

**Proposición 3 (la configuración estabilizada).** En una pila donde cada suposición de interfaz es explícita y verificada, una corrección realizada en el nivel $k$ que pasa la verificación de su propio límite deja intactas todas las propiedades establecidas por las verificaciones de los demás límites, y todo nivel superior a $k$ hereda la corrección sin cambios.

*Esbozo.* Las verificaciones en los demás límites evalúan predicados sobre los valores que cruzan esos límites. El $L_k$ corregido solo modifica los valores que cruzan los límites de $L_k$, y sus valores salientes satisfacen la suposición verificada del límite superior. Cada nivel superior a $k$ consume $L_k$ solo a través de una interfaz verificada, de modo que si el $L_k$ corregido satisface esa interfaz, los consumidores ven una entrada correcta. ∎

**Proposición 4 (la búsqueda de AGI obliga a la explicitud).** Sea un agente general en el sentido de la Definición 6 requerido para pasar una puerta de corrección en tareas extraídas de los tres cuerpos y de todos los niveles de la pila. Entonces, para cada interfaz que la distribución de tareas cruza, o el agente hace explícita la suposición de interfaz y la verifica, o existe una tarea en la que el éxito del agente depende de una conjetura no verificada sobre esa suposición.

*Argumento.* Un sistema estrecho puede confiar en la convención de su único entorno: un sistema de unidades fijo, un conjunto de instrucciones fijo, una versión fija. Un agente general se enfrenta a entornos en los que esas convenciones difieren, por construcción de generalidad. Una suposición que vale en un entorno y falla en otro debe ser detectada para ser manejada, y detectarla implica verificarla. Una puerta de corrección es una prueba que una ejecución pasa o falla, sin crédito parcial. Bajo tal puerta, una conjetura que resulta ser incorrecta es una tarea fallida, no crédito parcial. Por lo tanto, la búsqueda de generalidad bajo una puerta genera presión hacia interfaces explícitas y verificadas en cada límite que el agente toque. La proposición no afirma que algún sistema actual cumpla este estándar. Afirma lo que el objetivo requiere.

**Proposición 5 (los julios clasifican las configuraciones estables).** Entre las pilas que atraviesan la compuerta, se prefiere la que resuelve cada interfaz con la menor energía hasta su finalización, y una verificación explícita realizada una sola vez en una interfaz resulta más barata a lo largo de una carga de trabajo que un fallo redescubierto en cada nivel superior.

*Esbozo.* El orden es compuerta y luego rango: la corrección es una restricción que todo candidato debe cumplir, y la energía hasta la finalización, en julios, ordena solo a los candidatos que la cumplen, como en la optimización con restricciones donde el objetivo se compara únicamente sobre el conjunto factible. Una verificación en el límite tiene un coste fijo por cruce. Una discordancia no examinada genera un coste en cada nivel al que llega, y ese coste se repite en cada ejecución hasta que se detecta la discordancia.

<div id="6-the-stabilized-configuration" class="anchor-alias" aria-hidden="true"></div>

## 6. La configuración estabilizada

![Diagram of the same three bodies, now arranged at the corners of an equilateral triangle inside a rotating frame, in the manner of the Lagrange configuration. Each interface band is solid and carries a check mark and a short label: the specification written once, the gate at entry, and the trace and receipt that return to the theorist. At the centre sits a shared frame labeled one specification, one gate, joules as the ranking.](/figures/three-body/stabilized.svg)

*Figura 2. La configuración estabilizada. Diagrama. En la física, tres cuerpos mantienen sus posiciones relativas en un marco que gira con ellos. En la informática, el marco compartido es una declaración explícita y verificable por máquina de la intención, con cada suposición de interfaz comprobada, de modo que los tres cuerpos conservan sus relaciones a medida que el sistema cambia. Se proporciona una [copia PNG](/figures/three-body/stabilized.png)*

<div id="61-the-shared-frame" class="anchor-alias" aria-hidden="true"></div>

### 6.1 El marco compartido

Las configuraciones de Lagrange son estables solo en un marco que se desplaza con los cuerpos. La contraparte computacional es una representación compartida que los tres cuerpos leen y escriben, en la que cada suposición de interfaz es una afirmación verificable: una especificación formal, un contrato verificado por máquina, o un tipo. Cuando la afirmación del teórico, la implementación del creador y el comportamiento observado por el usuario se relacionan mediante verificaciones contra una de esas representaciones, los traspasos entre ellos son verificaciones en lugar de traducciones.

<div id="62-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Cada suposición de interfaz explícita

![Diagram of a stack with six levels from intent at the top through specification, gate, projections and runtime to hardware and energy. Between each pair of adjacent levels sits an interface drawn as a small gate with its assumption and its check written beside it. A correction made at the runtime level is drawn with arrows rising through each checked interface to the levels above.](/figures/three-body/stack-checks.svg)

*Figura 3. La pila con cada interfaz verificada. Diagrama. Se proporciona una [copia PNG](/figures/three-body/stack-checks.png)*.

El método tiene tres pasos. Enumere cada límite de la pila. Para cada uno, escriba la suposición en la que confía el lado receptor como un predicado, y nombre el mecanismo que lo evalúa en cada cruce. Cuando una verificación falla, la ruptura se localiza en ese límite; la corrección se realiza en ese nivel, se pasa a través de la verificación de ese límite y se hereda por los niveles superiores.

<div id="63-evidence-from-verified-systems" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Evidencia de sistemas verificados

La existencia de configuraciones estabilizadas, en el sentido de la Proposición 3, está respaldada por sistemas construidos y probados por grupos independientes.

- **Un compilador verificado bajo pruebas aleatorias.** CompCert es un compilador de C cuyo medio y back‑end de optimización llevan una prueba verificada por máquina de que el código generado preserva la semántica del origen [39]. Yang, Chen, Eide y Regehr ejecutaron Csmith, un generador de programas aleatorios, contra CompCert y muchos otros compiladores. Informaron cientos de errores previamente desconocidos en los demás compiladores. En CompCert no encontraron errores de código incorrecto en el medio verificado. Los defectos que sí hallaron se encontraban en partes fuera de la prueba, como el front‑end y una suposición no verificada sobre el objetivo [40]. Los fallos aparecieron donde una suposición quedó sin comprobar, como predicen las Proposiciones 1 y 2, y no a través de límites verificados.
- **Un límite de kernel verificado.** La prueba de seL4 relaciona su implementación en C con una especificación abstracta, de modo que entre la especificación y el código no se asume nada [36]. La prueba se enuncia respecto a suposiciones explícitas sobre el compilador, el código ensamblador y el hardware, lo que muestra el método de la Sección 6.2 en la práctica: las suposiciones residuales se anotan como las interfaces restantes.
- **Especificaciones en la práctica industrial.** Newcombe y colegas informan que ingenieros de Amazon Web Services redactaron especificaciones TLA+ para sistemas distribuidos centrales, y que la verificación de modelos encontró fallos de diseño sutiles, algunos que requerían largas secuencias de eventos, que la revisión y las pruebas habían pasado por alto [41].
- **Unidades como una interfaz verificada.** Los tipos de dimensión de Kennedy hacen que la unidad de una cantidad forme parte de su tipo, de modo que un valor de libra‑fuerza‑segundo no puede pasarse donde se espera un valor de newton‑segundo sin una conversión explícita [42]. La suposición de interfaz detrás de la pérdida del Mars Climate Orbiter [12] se convierte en una denegación en tiempo de compilación.

Esta evidencia proviene de sistemas individuales, cada uno construido con verificaciones en mente. Muestra que la configuración estabilizada existe y puede mantenerse. No muestra que la configuración se extienda a pilas que abarquen varias organizaciones. Los protocolos de la Sección 8 están redactados para probar eso.

<div id="7-the-hardware-side" class="anchor-alias" aria-hidden="true"></div>

## 7. El lado del hardware

El límite del hardware es donde las suposiciones de la interfaz se vuelven físicas: un voltaje de alimentación, un sobrecalentamiento térmico, un modelo de memoria, un contrato de instrucción. La Sección 3.2 presentó el contrato de instrucción como un ejemplo de la interfaz de un fabricante que se revisa con el tiempo [17, 18]. Una pila que trata el hardware como fijo tiene una interfaz no examinada en su nivel más bajo, y la Proposición 2 indica que una discordancia allí puede alcanzar todos los niveles superiores.

En este artículo, el lado del hardware es un conjunto de interfaces que deben hacerse explícitas, y un resultado de hardware se introduce bajo la misma puerta y la misma clasificación de energía que el software.

<div id="8-protocols" class="anchor-alias" aria-hidden="true"></div>

## 8. Protocolos

Cada protocolo se fija antes de su ejecución. Las cifras de energía llevan una de tres etiquetas: `est_j` para una estimación analítica, `reported_j` para una lectura del sistema operativo o de un contador en el chip, y `measured_j` para una lectura de un medidor de potencia externo.

<div id="81-interface-inventory" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Inventario de interfaces

Para un sistema objetivo, enumere cada interfaz entre cuerpos y entre niveles. Para cada una, registre la suposición como un predicado, su propietario y si un mecanismo la verifica. Informe la fracción de suposiciones que son verificadas y la fracción que no tiene propietario. Dos auditores independientes inventarían el mismo sistema; informe su acuerdo.

<div id="82-break-and-catch" class="anchor-alias" aria-hidden="true"></div>

### 8.2 Ruptura y captura

Para cada suposición registrada, inyecte una violación en esa interfaz sobre un conjunto de semillas fijo. Registre si la violación es rechazada en esa interfaz, capturada en un nivel posterior, o no capturada. La Proposición 1 predice que las suposiciones verificadas son rechazadas en su propia interfaz. La Proposición 2 predice que las suposiciones no examinadas, cuando son capturadas, lo son en una etapa posterior y no se localizan.

<div id="83-compounding" class="anchor-alias" aria-hidden="true"></div>

### 8.3 Composición

Ejecute una carga de trabajo fija durante $R$ rondas con y sin una corrección promovida a un nivel elegido. Registre escaladas, fallas y energía por ronda. La Proposición 3 predice que las escaladas acumulativas con la corrección no son más altas en ninguna ronda, y que ninguna propiedad verificada antes de la promoción falla después de ella.

<div id="84-cross-body-handoff" class="anchor-alias" aria-hidden="true"></div>

### 8.4 Transferencia entre cuerpos

Elija una transferencia real entre organizaciones: una especificación entregada a un implementador, una biblioteca entregada a usuarios descendentes, o una revisión de hardware entregada a software. Exprese la transferencia como una representación compartida con supuestos explícitos, ejecute el protocolo de ruptura y captura sobre ella, y compárela con la misma transferencia realizada mediante documentación en prosa. Informe los fallos ubicados en la interfaz en cada rama, con intervalos Wilson del 95 %.

<div id="85-generality-under-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 8.5 Generalidad bajo la puerta

Construya un conjunto de tareas que varíe las convenciones en las interfaces: unidades, contratos de instrucción, versiones de bibliotecas, codificaciones. Evalúe a los agentes bajo una puerta de corrección. La Proposición 4 predice que el éxito en todo el conjunto variado requiere detectar la convención, por lo que los agentes que verifiquen explícitamente las suposiciones de la interfaz deberían aprobar una mayor proporción de las tareas variadas que los agentes que asumen un valor predeterminado, con éxito equiparable en las tareas predeterminadas. Clasifique a los agentes aprobados por julios hasta la finalización.

<div id="9-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 9. Falsificadores

Fijado antes de las ejecuciones que prueban.

| ID | Observación | Derrotas |
|---|---|---|
| TBP-F1 | En el protocolo de interrupción y captura, una violación de una suposición verificada se acepta en su propia interfaz | Proposición 1 tal como se indica para el sistema bajo prueba |
| TBP-F2 | En el protocolo de composición, una corrección que supera su propia verificación de límite provoca que una verificación previamente aprobada en otro límite falle | Proposición 3 |
| TBP-F3 | En el protocolo cruzado de cuerpos, la representación compartida localiza no más fallos de interfaz que la documentación en prosa, dentro de los intervalos | La afirmación de que las interfaces verificadas explícitamente estabilizan las transferencias entre cuerpos |
| TBP-F4 | En el protocolo de generalidad, los agentes que asumen valores predeterminados completan las tareas variadas a una tasa no inferior a la de los agentes que verifican, con rendimiento predeterminado equiparado | Proposición 4 |
| TBP-F5 | Un inventario de interfaces de un sistema operativo encuentra fallas cuya causa no puede asignarse a ninguna suposición de interfaz, con cada cuerpo correcto respecto a su propio modelo | El informe de interfaz de inestabilidad |

<div id="10-limits-of-the-argument" class="anchor-alias" aria-hidden="true"></div>
<div id="10-scope-and-method" class="anchor-alias" aria-hidden="true"></div>

## 10. Alcance y método

La física entra como estructura. Proporciona el vocabulario de cuerpos, relaciones y configuraciones estables, y cada proposición se enuncia y se prueba en los propios términos de la computación. Las afirmaciones sobre sensibilidad son afirmaciones sobre cómo los resultados dependen de desajustes no examinados, y se miden estadísticamente a gran N, al estilo de Stone y Leigh [7].

Se mantiene la explicitud, no se declara. Las suposiciones aparecen a medida que un sistema se adapta a nuevos entornos, y el mundo al que sirve un programa sigue cambiando [35]. Por lo tanto, el método trata cada suposición descubierta como una nueva interfaz que cerrar: escrita como un predicado, dotada de una verificación y mantenida bajo verificación según la Proposición 3. La configuración estabilizada se mantiene de la misma forma que una nave espacial cerca de un punto de Lagrange, mediante el mantenimiento continuo de la posición.

La unidad de análisis es la transferencia entre roles. Una persona puede ser teórico, creador y usuario en una tarde, por lo que el método se aplica donde ocurra una transferencia, dentro de un equipo o entre organizaciones. Cada enfoque para construir sistemas, desde métodos formales hasta grandes modelos con pruebas, o código escrito a mano con revisión, se evalúa con la misma medida: la fracción de sus suposiciones de interfaz que son explícitas y verificadas, leída del protocolo de inventario de la Sección 8.1.

<div id="11-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 11. Conclusión

El problema de los tres cuerpos enseñó a la física que la inestabilidad puede surgir de las relaciones entre partes simples, y que la estabilidad, cuando existe, es una disposición especial de esas relaciones en un marco compartido. La computación tiene sus propios tres cuerpos: teóricos, creadores y usuarios, y su inestabilidad proviene de las interfaces entre ellos, donde las suposiciones se cruzan sin estar escritas ni verificadas. Un sistema que aspira a la inteligencia general debe actuar sobre los tres cuerpos y en todos los niveles de la pila, por lo que no puede dejar esas suposiciones implícitas. Tomar ese objetivo en serio implica registrar cada suposición de interfaz y comprobarla en cada cruce. En una pila construida de esa manera, una corrección permanece donde se produce y se propaga hacia arriba, y el sistema mantiene su forma a medida que cambia. Así es como la búsqueda de la AGI resuelve el problema de los tres cuerpos en la computación.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referencias

[1] Liu Cixin, *The Three-Body Problem*, translated by Ken Liu. Tor Books, 2014. Original Chinese edition 三体, Chongqing Publishing House, 2008. ISBN 978-0-7653-7706-7.

[2] H. Poincaré, "Sur le problème des trois corps et les équations de la dynamique," *Acta Mathematica* 13, 1890, pp. 1 to 270. Introduction: doi:10.1007/BF02392506

[3] J. Barrow-Green, *Poincaré and the Three Body Problem*. History of Mathematics 11, American Mathematical Society, 1997. doi:10.1090/hmath/011

[4] K. F. Sundman, "Mémoire sur le problème des trois corps," *Acta Mathematica* 36, 1913, pp. 105 to 179. doi:10.1007/BF02422379

[5] Q. Wang, "The global solution of the N-body problem," *Celestial Mechanics and Dynamical Astronomy* 50, 1991, pp. 73 to 88. doi:10.1007/BF00048987

[6] E. N. Lorenz, "Deterministic Nonperiodic Flow," *Journal of the Atmospheric Sciences* 20(2), 1963, pp. 130 to 141. doi:10.1175/1520-0469(1963)020<0130:DNF>2.0.CO;2

[7] N. C. Stone and N. W. C. Leigh, "A statistical solution to the chaotic, non-hierarchical three-body problem," *Nature* 576, 2019, pp. 406 to 410. doi:10.1038/s41586-019-1833-8

[8] E. J. Routh, "On Laplace's Three Particles, with a Supplement on the Stability of Steady Motion," *Proceedings of the London Mathematical Society* s1-6, 1874, pp. 86 to 97. doi:10.1112/plms/s1-6.1.86

[9] C. Moore, "Braids in classical dynamics," *Physical Review Letters* 70, 1993, pp. 3675 to 3679. doi:10.1103/PhysRevLett.70.3675

[10] A. Chenciner and R. Montgomery, "A Remarkable Periodic Solution of the Three-Body Problem in the Case of Equal Masses," *Annals of Mathematics* 152(3), 2000, pp. 881 to 901. doi:10.2307/2661357

[11] M. Šuvakov and V. Dmitrašinović, "Three Classes of Newtonian Three-Body Planar Periodic Orbits," *Physical Review Letters* 110, 114301, 2013. doi:10.1103/PhysRevLett.110.114301

[12] Mars Climate Orbiter Mishap Investigation Board, *Phase I Report*. NASA, 10 November 1999. https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf

[13] H. Wright, "Hyrum's Law." https://www.hyrumslaw.com/

[14] J. Spolsky, "The Law of Leaky Abstractions," *Joel on Software*, 11 November 2002. https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/

[15] J. L. Lions (chair), *Ariane 5 Flight 501 Failure: Report by the Inquiry Board*. European Space Agency, 19 July 1996. https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf

[16] G. Le Lann, "An analysis of the Ariane 5 flight 501 failure: a system engineering perspective," *Proceedings of the IEEE International Conference on the Engineering of Computer-Based Systems*, 1997, pp. 339 to 346. doi:10.1109/ECBS.1997.581900

[17] RISC-V International, *The RISC-V Instruction Set Manual, Volume I: Unprivileged Architecture*, version 20250508, preface. https://docs.riscv.org/reference/isa/v20250508/unpriv/colophon.html

[18] Apple, "Using Intel-based apps on a Mac with Apple silicon," Apple Support, article 102527, published 21 September 2026. https://support.apple.com/en-us/102527

[19] P. Zave and M. Jackson, "Four Dark Corners of Requirements Engineering," *ACM Transactions on Software Engineering and Methodology* 6(1), 1997, pp. 1 to 30. doi:10.1145/237432.237434

[20] S. Hooker, "The Hardware Lottery," *Communications of the ACM* 64(12), 2021, pp. 58 to 65. doi:10.1145/3467017

[21] D. Sculley, G. Holt, D. Golovin, E. Davydov, T. Phillips, D. Ebner, V. Chaudhary, M. Young, J.-F. Crespo and D. Dennison, "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems* 28, 2015. https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

[22] M. E. Conway, "How Do Committees Invent?" *Datamation* 14(4), April 1968, pp. 28 to 31. https://www.melconway.com/Home/Committees_Paper.html

[23] A. MacCormack, C. Baldwin and J. Rusnak, "Exploring the duality between product and organizational architectures: A test of the 'mirroring' hypothesis," *Research Policy* 41(8), 2012, pp. 1309 to 1324. doi:10.1016/j.respol.2012.04.011

[24] D. L. Parnas, "On the criteria to be used in decomposing systems into modules," *Communications of the ACM* 15(12), 1972, pp. 1053 to 1058. doi:10.1145/361598.361623

[25] C. Y. Baldwin and K. B. Clark, *Design Rules, Volume 1: The Power of Modularity*. MIT Press, 2000. doi:10.7551/mitpress/2366.001.0001

[26] R. M. Henderson and K. B. Clark, "Architectural Innovation: The Reconfiguration of Existing Product Technologies and the Failure of Established Firms," *Administrative Science Quarterly* 35(1), 1990, pp. 9 to 30. doi:10.2307/2393549

[27] J. H. Saltzer, D. P. Reed and D. D. Clark, "End-to-end arguments in system design," *ACM Transactions on Computer Systems* 2(4), 1984, pp. 277 to 288. doi:10.1145/357401.357402

[28] C. A. R. Hoare, "An axiomatic basis for computer programming," *Communications of the ACM* 12(10), 1969, pp. 576 to 580. doi:10.1145/363235.363259

[29] B. Meyer, "Applying 'design by contract'," *Computer* 25(10), 1992, pp. 40 to 51. doi:10.1109/2.161279

[30] B. H. Liskov and J. M. Wing, "A behavioral notion of subtyping," *ACM Transactions on Programming Languages and Systems* 16(6), 1994, pp. 1811 to 1841. doi:10.1145/197320.197383

[31] D. Garlan, R. Allen and J. Ockerbloom, "Architectural mismatch: why reuse is so hard," *IEEE Software* 12(6), 1995, pp. 17 to 26. doi:10.1109/52.469757

[32] D. Garlan, R. Allen and J. Ockerbloom, "Architectural Mismatch: Why Reuse Is Still So Hard," *IEEE Software* 26(4), 2009, pp. 66 to 69. doi:10.1109/MS.2009.86

[33] N. G. Leveson, *Engineering a Safer World: Systems Thinking Applied to Safety*. MIT Press, 2012. doi:10.7551/mitpress/8179.001.0001

[34] R. I. Cook, "How Complex Systems Fail," Cognitive Technologies Laboratory, University of Chicago, 1998. https://how.complexsystems.fail/

[35] M. M. Lehman, "Programs, life cycles, and laws of software evolution," *Proceedings of the IEEE* 68(9), 1980, pp. 1060 to 1076. doi:10.1109/PROC.1980.11805

[36] G. Klein, K. Elphinstone, G. Heiser, J. Andronick, D. Cock, P. Derrin, D. Elkaduwe, K. Engelhardt, R. Kolanski, M. Norrish, T. Sewell, H. Tuch and S. Winwood, "seL4: Formal Verification of an OS Kernel," *Proceedings of the 22nd ACM Symposium on Operating Systems Principles*, 2009, pp. 207 to 220. doi:10.1145/1629575.1629596

[37] S. Legg and M. Hutter, "Universal Intelligence: A Definition of Machine Intelligence," *Minds and Machines* 17(4), 2007, pp. 391 to 444. doi:10.1007/s11023-007-9079-x

[38] M. R. Morris, J. Sohl-Dickstein, N. Fiedel, T. Warkentin, A. Dafoe, A. Faust, C. Farabet and S. Legg, "Levels of AGI for Operationalizing Progress on the Path to AGI," *Proceedings of the 41st International Conference on Machine Learning*, 2024. arXiv:2311.02462

[39] X. Leroy, "Formal verification of a realistic compiler," *Communications of the ACM* 52(7), 2009, pp. 107 to 115. doi:10.1145/1538788.1538814

[40] X. Yang, Y. Chen, E. Eide and J. Regehr, "Finding and understanding bugs in C compilers," *Proceedings of the 32nd ACM SIGPLAN Conference on Programming Language Design and Implementation*, 2011, pp. 283 to 294. doi:10.1145/1993498.1993532

[41] C. Newcombe, T. Rath, F. Zhang, B. Munteanu, M. Brooker and M. Deardeuff, "How Amazon Web Services uses formal methods," *Communications of the ACM* 58(4), 2015, pp. 66 to 73. doi:10.1145/2699417

[42] A. Kennedy, "Types for Units-of-Measure: Theory and Practice," in *Central European Functional Programming School*, Lecture Notes in Computer Science 6299, Springer, 2010, pp. 268 to 305. doi:10.1007/978-3-642-17685-2_8
