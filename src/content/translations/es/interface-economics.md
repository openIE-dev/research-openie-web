---
title: "El precio de la interfaz no examinada"
deck: "Lo que cuestan las fallas de interfaz, usando solo cifras que declara una fuente primaria, cada una etiquetada como costo contabilizado, estimación de modelo o estimación de encuesta."
lang: "es"
source: "interface-economics"
complete: true
---

*Versión 1.0, 11 de octubre de 2026. PDF en LaTeX: [/pdfs/latex/interface-economics.pdf](/pdfs/latex/interface-economics.pdf) ([fuente](/pdfs/latex/interface-economics.tex)).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

Este ensayo reúne los costos publicados de las fallas que ocurren en los traspasos entre las partes de un sistema y etiqueta cada cifra según cómo se produjo. No las suma en un total.

**En palabras sencillas**

1. Algunas fallas en los traspasos tienen un precio exacto, como una sonda a Marte perdida que costó cientos de millones de dólares.
2. Las cifras nacionales más grandes son estimaciones obtenidas de encuestas y modelos, y ninguna de ellas cuenta solo las fallas en los traspasos.
3. Escribir y comprobar lo que supone cada parte es barato, pero quien lo hace paga mientras todos se benefician, así que suele quedar sin hacer.

<div id="0-definitions-and-scope" class="anchor-alias" aria-hidden="true"></div>

## 0. Definiciones y alcance

Una **interfaz** es un traspaso a través del cual la salida de una parte se convierte en la entrada de otra: de quienes enuncian lo que un sistema debe hacer (teóricos) a quienes lo construyen (constructores) y a quienes lo operan (usuarios), o entre dos niveles de una pila de software y hardware. Un **supuesto de interfaz** es una condición sobre los valores que cruzan un traspaso de la que el lado receptor depende para su propia corrección, como una unidad, un rango, un tipo, una versión o una envolvente de operación. Un supuesto está **no examinado** cuando se depende de él pero no se ha escrito ni comprobado. Una larga literatura de ingeniería, desde Garlan, Allen y Ockerbloom sobre el desajuste arquitectónico hasta Leveson sobre los accidentes como fallas de interacción, sitúa muchas fallas de sistemas en tales supuestos [19, 20]. Este ensayo pregunta cuánto cuestan esas fallas y responde solo con cifras que declara una fuente primaria. Cada cifra se etiqueta por tipo. Un **costo contabilizado** es lo que una agencia o empresa informa que realmente gastó o perdió. Una **estimación de modelo** es una cifra producida mediante un método declarado a partir de encuestas, entrevistas o datos secundarios. Una **proyección** es una afirmación sobre el futuro. Los tres tipos no se suman entre sí.

Los costos contabilizados de fallas de interfaz individuales son grandes y concretos: el proyecto Mars Surveyor 1998, que incluía Mars Climate Orbiter, costó 327,6 millones de dólares [1], y la ESA aprobó 214 millones de ECU para recuperar la misión Cluster perdida en el primer Ariane 5 [4]. Las estimaciones de modelo son mayores y más amplias: el NIST situó el costo anual de una infraestructura inadecuada de pruebas de software en Estados Unidos en 59.500 millones de dólares [6], y el costo de la interoperabilidad inadecuada en la industria estadounidense de instalaciones de capital en 15.800 millones de dólares al año [7]. CISQ estimó el costo de la mala calidad del software en Estados Unidos en no menos de 2,41 billones de dólares en 2022 y la deuda técnica acumulada en unos 1,52 billones de dólares [8]. Ninguna de estas cifras mide solo la falla de interfaz. Cada una la contiene.

<div id="1-kinds-of-number" class="anchor-alias" aria-hidden="true"></div>

## 1. Tipos de cifra

Las afirmaciones económicas sobre las fallas de software circulan en tres formas que se parecen y no son iguales. El presupuesto de un proyecto es un registro contable. Una estimación nacional de costos es la salida de un modelo cuyos insumos son encuestas, estudios de caso y supuestos sobre la escala. Un pronóstico no es ninguna de las dos cosas. Este ensayo sigue una regla: cada cifra lleva su tipo, su fuente y lo que realmente cuenta.

Circulan cifras del costo de la "falla de interfaz" como un único total anual sin un método declarado. Ninguna de las estimaciones primarias de la Sección 3 aísla las interfaces, así que este ensayo no las asigna a ningún total único.

<div id="2-single-failures-accounted" class="anchor-alias" aria-hidden="true"></div>

## 2. Fallas individuales, contabilizadas

**Mars Climate Orbiter.** La interfaz era una unidad: datos de impulso de los propulsores en libras-fuerza segundo leídos como newton segundo [2]. La ficha técnica del proyecto de la NASA da el costo del proyecto Mars Surveyor 1998 como 327,6 millones de dólares para el orbitador y el Mars Polar Lander juntos: 193,1 millones de dólares para el desarrollo de las naves, 91,7 millones de dólares para el lanzamiento y 42,8 millones de dólares para las operaciones [1]. Los informes de la época daban el orbitador por sí solo como una nave de 125 millones de dólares [3]. Tipo: costo contabilizado del proyecto, con una cifra informada para la nave individual.

**Ariane 501 y Cluster.** La interfaz era una envolvente: el software reutilizado del Ariane 4 suponía un rango de velocidad horizontal que el nuevo lanzador superó [5]. Se perdieron los cuatro satélites Cluster. El relato de la ESA sobre la recuperación registra las opciones que su Comité del Programa Científico valoró en 1996, entre ellas 351 millones de unidades de cuenta para reconstruir los cuatro satélites con el diseño original, y la ESA aprobó en 1997 una misión de recuperación, Cluster II, por 214 millones de ECU [4, 17]. Tipo: costo contabilizado de la recuperación que eligió la ESA, que es una cota inferior de la pérdida, no el valor de los satélites ni de la ciencia retrasada.

Estos dos casos fijan la forma del problema. En cada uno, cada organismo hizo su propio trabajo y el costo cayó en la interfaz. En cada uno, la comprobación que habría detectado el desajuste era barata en relación con la pérdida. Ninguno de los dos casos puede escalarse a una cifra nacional, porque los accidentes individuales no son una muestra.

<div id="3-national-estimates-modeled" class="anchor-alias" aria-hidden="true"></div>

## 3. Estimaciones nacionales, modeladas

![Gráfico de barras sobre un eje logarítmico en dólares de las estimaciones primarias citadas en este ensayo, coloreadas por tipo. Costos contabilizados: el proyecto Mars Surveyor 1998, 327,6 millones de dólares, y la recuperación Cluster II, 214 millones de ECU. Estimaciones de modelo: NIST 2004, interoperabilidad inadecuada en las instalaciones de capital de EE. UU., 15.800 millones de dólares al año; NIST 2002, infraestructura inadecuada de pruebas de software, 59.500 millones de dólares al año; Stripe 2018, tiempo de los desarrolladores dedicado a código malo, unos 85.000 millones de dólares al año; CISQ 2022, deuda técnica, unos 1,52 billones de dólares acumulados; CISQ 2022, costo de la mala calidad del software en EE. UU., al menos 2,41 billones de dólares en 2022.](/figures/interface-economics/estimates-by-kind.svg)

*Figura 1. Las estimaciones por tipo. Figura de datos, eje logarítmico. Valores tal como los imprimen las fuentes [1, 4, 6, 7, 8, 9]. Las barras no son aditivas: el total de CISQ contiene categorías que se solapan con las cifras del NIST y de Stripe, y un stock (la deuda técnica) se dibuja junto a flujos anuales. Se proporciona una [copia en PNG](/figures/interface-economics/estimates-by-kind.png).*

**Pruebas de software, NIST 2002.** RTI International, para el NIST, estimó que una infraestructura inadecuada para las pruebas de software costaba a la economía de Estados Unidos entre 22.200 y 59.500 millones de dólares al año, siendo la cifra superior el costo total y la inferior la parte que mejoras factibles podrían eliminar [6]. El método combinó encuestas a desarrolladores y usuarios de dos sectores, la fabricación de equipos de transporte y los servicios financieros, con una extrapolación a la economía nacional. Tipo: estimación de modelo.

**Interoperabilidad, NIST 2004.** Gallaher y sus colegas, para el NIST, estimaron el costo de la interoperabilidad inadecuada en la industria estadounidense de instalaciones de capital en 15.800 millones de dólares al año, a partir de entrevistas y encuestas a propietarios, operadores, arquitectos, ingenieros y contratistas [7]. Aquí, la interoperabilidad es la capacidad de intercambiar y usar datos de diseño y de operación entre sistemas de software, lo cual es una interfaz en el sentido definido en el Resumen. El informe declara que su cifra omite costos que no pudo cuantificar. Tipo: estimación de modelo, una sola industria, presentada como conservadora.

**Mala calidad del software, CISQ 2022.** El Consortium for Information and Software Quality estimó que el costo de la mala calidad del software en Estados Unidos había crecido hasta al menos 2,41 billones de dólares en 2022, y que la deuda técnica acumulada había crecido hasta unos 1,52 billones de dólares [8]. El informe construye el total a partir de categorías (fallas operativas, proyectos fallidos, problemas de sistemas heredados y pérdidas por ciberdelito atribuidas a vulnerabilidades de software) y toma gran parte de sus insumos de fuentes secundarias; su componente de ciberdelito reparte a Estados Unidos un pronóstico mundial [8]. Tipo: estimación de modelo construida en parte sobre otras estimaciones. Es la mayor cifra documentada en este ámbito, y es una cifra para la calidad del software en su conjunto, no para las interfaces.

**Tiempo de los desarrolladores, Stripe 2018.** Una encuesta de Stripe realizada con Harris Poll informó que los desarrolladores dedican unas 17,3 horas a la semana a trabajo de mantenimiento como la depuración y la refactorización, y unas cuatro horas a la semana al "código malo", que el informe valora en casi 85.000 millones de dólares al año en todo el mundo [9]. Tipo: estimación basada en encuesta.

Lo que estas cifras comparten es una estructura, no un total. Cada una cuenta el costo de un supuesto del que se dependió y que no se comprobó: una ruta sin probar, un formato de datos que no se traslada, una vulnerabilidad en una frontera, un sistema heredado cuyos contratos nadie puede volver a enunciar. Un desajuste que no se comprueba donde surge pasa como entrada bien formada a cada nivel por encima de él, de modo que su costo aparece lejos de su causa, como en la solución de navegación del Mars Climate Orbiter, que era internamente coherente y errónea [2]. Por eso también las estimaciones nacionales deben modelarse en lugar de contarse.

<div id="4-technical-debt-is-an-interface-account" class="anchor-alias" aria-hidden="true"></div>

## 4. La deuda técnica es una cuenta de interfaces

Cunningham introdujo la deuda técnica en 1992 como el costo de entregar código cuya estructura aún no corresponde a lo que el equipo ha aprendido, con intereses que se pagan en cada cambio posterior hasta que la deuda se salda [10]. Sculley y sus colegas mostraron que en los sistemas de aprendizaje automático la mayor parte de esa deuda está fuera del modelo, en el código de pegamento, la configuración, las dependencias de datos y los consumidores no declarados [11]. En los términos definidos arriba, gran parte de la deuda técnica es un saldo de supuestos de interfaz no examinados que se lleva en los libros, y su interés es el costo que un desajuste no comprobado cobra a cada nivel por encima de él, en cada ejecución.

La estimación de CISQ de unos 1,52 billones de dólares de deuda técnica acumulada en Estados Unidos es un stock, medido en costo de reparación [8]. Las cifras anuales de la Sección 3 son flujos. La consecuencia económica es una hipótesis, que se pone a prueba en la Sección 7: una comprobación pagada una vez en una frontera puede costar menos, a lo largo de una carga de trabajo, que una falla pagada de nuevo en cada nivel al que llega.

<div id="5-standards-are-how-markets-close-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 5. Los estándares son la forma en que los mercados cierran las interfaces

Los economistas llevan décadas estudiando el problema de la interfaz bajo otro nombre: la compatibilidad. Katz y Shapiro mostraron que, cuando el valor de un producto aumenta con el número de usuarios con los que puede funcionar, los incentivos de las empresas para ser compatibles dependen de su tamaño y su posición, y el mercado puede ofrecer demasiado poca compatibilidad [12]. Farrell y Saloner mostraron que un mercado puede quedarse atascado en un estándar antiguo, o pasar a uno nuevo demasiado deprisa, porque la elección de cada usuario depende de lo que eligen los demás [13]. La historia del teclado QWERTY de David hizo concreta la dependencia de la trayectoria [14]. Baldwin y Clark mostraron que las reglas de diseño, interfaces visibles fijadas de antemano, son lo que permite que las industrias modulares lleguen siquiera a formarse [15]. La revisión de Swann para el gobierno del Reino Unido resumió la evidencia de que los estándares contribuyen a la productividad y al comercio [16].

El hilo común es que una interfaz es un bien público con costos privados. Escribir un supuesto y comprobarlo beneficia a cada parte que cruza la frontera, pero lo paga quien lo escribe. Cada parte tiene una razón para tratar el traspaso como trabajo de otro. Los organismos de normalización, los reguladores y los propietarios de plataformas son las instituciones que históricamente han pagado ese costo. Las representaciones comprobadas por máquina, como los tipos que llevan unidades de medida o las especificaciones formales comprobadas por un verificador de modelos [21, 22], reducen el costo privado de cerrar una interfaz hacia el costo de ejecutar su comprobación.

<div id="6-generated-code-crosses-the-same-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 6. El código generado cruza las mismas interfaces

El código producido por un generador automático cruza las mismas fronteras que el código escrito a mano: entre una especificación y una implementación, entre una biblioteca y sus usuarios, entre el software y el contrato de instrucciones que tiene debajo. Cada cruce lleva supuestos que un generador no comprueba a menos que esté construido para ello. Por tanto, las cifras de la Sección 3 también atañen a la generación automática de código. Si una gran parte del costo de la mala calidad del software es el costo de supuestos no comprobados en las fronteras, entonces el valor de cerrar interfaces puede superar el valor de escribir código más rápido. Esa es una hipótesis sobre dónde está el valor, no una medición. Los protocolos de la Sección 7 son la manera de medirlo.

<div id="7-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 7. Proposiciones y protocolos

**Proposición E1 (la proporción de interfaz).** En una población de fallas de software con costos contabilizados, la proporción del costo cuya causa es un supuesto de interfaz violado, tal como se define en el Resumen, supera la proporción cuya causa está enteramente dentro de un solo organismo.

*Protocolo.* Tome un corpus público de incidentes con campos de costo, como informes de percances de agencias o declaraciones regulatorias. Dos codificadores clasifican cada causa como de interfaz o interna usando las definiciones del Resumen, sin conocer el costo. Informe la proporción de interfaz ponderada por costo con un intervalo bootstrap y el acuerdo entre los codificadores.

**Proposición E2 (las comprobaciones se pagan solas).** Para una carga de trabajo fija, el costo de añadir una comprobación explícita en una interfaz es menor que el costo esperado de las fallas que rechaza, sumado sobre cada nivel al que la falla llegaría de otro modo. Formalmente, para una interfaz cruzada $N$ veces, sea $c$ el costo de una comprobación en dólares, $\pi$ la probabilidad de que un cruce viole el supuesto y $L_m$ el costo en dólares que una violación no detectada impone en el nivel $m$ de los $M$ niveles a los que llega. La comprobación se paga sola cuando $N c < N \pi \sum_{m=1}^{M} L_m$, es decir, cuando $c < \pi \sum_m L_m$. Los dos casos contabilizados de la Sección 2 tienen $\sum_m L_m$ del orden de $10^8$ dólares, así que la condición se cumple para cualquier comprobación que cueste menos de $10^8 \pi$ dólares por cruce.

*Protocolo.* En un sistema cuyos niveles tienen costos de operación conocidos, inyecte una violación de cada supuesto de interfaz registrado sobre un conjunto fijo de semillas, registrando el costo de cada comprobación y el costo de cada violación no detectada allí donde cae. Informe ambos en julios y en dólares a un precio declarado.

**Proposición E3 (cerrar una interfaz reduce su costo privado).** Cuando el supuesto de interfaz forma parte de una representación compartida y se comprueba por construcción, el costo de cerrarlo para una sola parte baja hacia el costo de ejecutar la comprobación.

*Protocolo.* Elija un traspaso real entre organizaciones, como una especificación entregada a un implementador. Llévelo en un brazo como documentación en prosa y en el otro como una representación comprobada por máquina. Registre las horas de trabajo a cada lado del traspaso y las fallas localizadas en la interfaz en cada brazo, con intervalos de Wilson al 95%.

<div id="8-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 8. Conclusión

El costo de las interfaces no examinadas es real, grande y mal medido. Las fallas individuales pueden valorarse con exactitud, y muestran que la pérdida cae en una frontera que cada organismo creía que pertenecía a otro. Las estimaciones nacionales son modelos, y las mayores de ellas describen la calidad del software en su conjunto. Ninguna fuente primaria declara el costo de la falla de interfaz por sí sola, y este ensayo no aporta uno. Lo que la evidencia respalda es una estructura: costos que surgen en las fronteras, se propagan hacia arriba y se acumulan como deuda, en mercados que proveen de forma insuficiente el bien público de una interfaz comprobada. Las proposiciones de la Sección 7 enuncian cómo puede ponerse a prueba esa estructura.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referencias

[1] NASA Jet Propulsion Laboratory, "Mars Climate Orbiter Fact Sheet," Mars Surveyor 1998 project. Archived copy: https://web.archive.org/web/20121003073752/http://mars.jpl.nasa.gov/msp98/orbiter/fact.html

[2] Mars Climate Orbiter Mishap Investigation Board, *Phase I Report*. NASA, 10 November 1999. https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf

[3] A. Pollack, "Two Teams, Two Measures Equaled One Lost Spacecraft," *The New York Times*, 1 October 1999. https://archive.nytimes.com/www.nytimes.com/library/national/science/100199sci-nasa-mars.html

[4] European Space Agency, "Cluster will fly again!," press release N° 12 1997, 26 March 1997. https://www.esa.int/Newsroom/Press_Releases/Cluster_will_fly_again

[5] J. L. Lions (chair), *Ariane 5 Flight 501 Failure: Report by the Inquiry Board*. European Space Agency, 19 July 1996. https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf

[6] RTI International for the National Institute of Standards and Technology, *The Economic Impacts of Inadequate Infrastructure for Software Testing*, Planning Report 02-3, May 2002. https://www.nist.gov/system/files/documents/director/planning/report02-3.pdf

[7] M. P. Gallaher, A. C. O'Connor, J. L. Dettbarn and L. T. Gilday, *Cost Analysis of Inadequate Interoperability in the U.S. Capital Facilities Industry*, NIST GCR 04-867, 2004. doi:10.6028/NIST.GCR.04-867

[8] H. Krasner, *The Cost of Poor Software Quality in the US: A 2022 Report*. Consortium for Information and Software Quality, 2022. https://www.it-cisq.org/the-cost-of-poor-quality-software-in-the-us-a-2022-report/

[9] Stripe, *The Developer Coefficient*, with Harris Poll, September 2018. https://stripe.com/files/reports/the-developer-coefficient.pdf

[10] W. Cunningham, "The WyCash portfolio management system," *OOPSLA 1992 Addendum*, *ACM SIGPLAN OOPS Messenger* 4(2), 1993, pp. 29 to 30. doi:10.1145/157710.157715

[11] D. Sculley, G. Holt, D. Golovin, E. Davydov, T. Phillips, D. Ebner, V. Chaudhary, M. Young, J.-F. Crespo and D. Dennison, "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems* 28, 2015. https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

[12] M. L. Katz and C. Shapiro, "Network Externalities, Competition, and Compatibility," *American Economic Review* 75(3), June 1985, pp. 424 to 440. RePEc:aea:aecrev:v:75:y:1985:i:3:p:424-40. https://www.jstor.org/stable/1814809

[13] J. Farrell and G. Saloner, "Standardization, Compatibility, and Innovation," *RAND Journal of Economics* 16(1), 1985, pp. 70 to 83. doi:10.2307/2555589

[14] P. A. David, "Clio and the Economics of QWERTY," *American Economic Review* 75(2), Papers and Proceedings, May 1985, pp. 332 to 337. RePEc:aea:aecrev:v:75:y:1985:i:2:p:332-37. https://www.jstor.org/stable/1805621

[15] C. Y. Baldwin and K. B. Clark, *Design Rules, Volume 1: The Power of Modularity*. MIT Press, 2000. doi:10.7551/mitpress/2366.001.0001

[16] G. M. P. Swann, *The Economics of Standardization: An Update*. Report for the UK Department for Business, Innovation and Skills, 2010. https://www.gov.uk/government/publications/economics-of-standardisation-update-to-report

[17] European Space Agency, "The Resurrection of the Cluster Scientific Mission," *ESA Bulletin* 91, 1997. https://www.esa.int/esapub/bulletin/bullet91/b91cred.htm

[19] D. Garlan, R. Allen and J. Ockerbloom, "Architectural mismatch: why reuse is so hard," *IEEE Software* 12(6), 1995, pp. 17 to 26. doi:10.1109/52.469757

[20] N. G. Leveson, *Engineering a Safer World: Systems Thinking Applied to Safety*. MIT Press, 2012. doi:10.7551/mitpress/8179.001.0001

[21] A. Kennedy, "Types for Units-of-Measure: Theory and Practice," in *Central European Functional Programming School*, Lecture Notes in Computer Science 6299, Springer, 2010, pp. 268 to 305. doi:10.1007/978-3-642-17685-2_8

[22] C. Newcombe, T. Rath, F. Zhang, B. Munteanu, M. Brooker and M. Deardeuff, "How Amazon Web Services uses formal methods," *Communications of the ACM* 58(4), 2015, pp. 66 to 73. doi:10.1145/2699417
