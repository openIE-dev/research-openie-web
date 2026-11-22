---
title: "RCE Compile: una ley de la compilación, probada como forma normal frente a compiladores reales"
deck: "RCE Compile (un proyecto de investigación en el repositorio del Reality Code Engine) pregunta si un único enunciado sobre qué es compilar se cumple para todo compilador, con independencia del propio Reality Code Engine. Contrastado con doce familias de compiladores, el candidato se sostiene como estándar con el que medir un compilador, no como descripción de lo que hacen hoy. Este estudio expone ese estándar de siete partes, la evidencia a favor y en contra de cada parte, un reemplazo medible para su función de convergencia, siete hipótesis con sus falsadores y tres experimentos ejecutados hasta ahora: comparaciones byte a byte en tres máquinas, conteos de borrado y longitud de descripción en 96 compilaciones sin contador de energía, y un hash sin nombres que emparejó copias renombradas sin falsos positivos en 16 núcleos pequeños y 4 programas."
lang: "es"
source: "rce-compile"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

RCE Compile pregunta si una única Ley de la Compilación vale para cualquier compilador con independencia del Reality Code Engine (RCE). El enunciado candidato afirma que compilar es descender preservando el significado entre representaciones canónicas, ordenado por un costo cuyo piso es el límite de Landauer y cuyo objetivo es el programa equivalente más corto, controlado por una compuerta de verificación y compuesto por reutilización. Contrastado con doce familias de compiladores de producción, falla como descripción: ningún compilador examinado calcula hashes sobre una representación sin nombres, el descenso no es total ni demuestra preservar el significado en general, y ninguno contabiliza la energía. Reescritas tres cláusulas, se sostiene como forma normal normativa con dos cotas y una distancia medida, acompañada de siete hipótesis con falsadores y tres experimentos iniciales (comparación de bytes en tres máquinas, conteos de borrado y longitud en 96 compilaciones sin lectura de energía, y un hash sin nombres probado en 16 núcleos y 4 programas).

**En palabras sencillas**

1. La pregunta es si todos los compiladores obedecen una sola regla. Los compiladores reales no lo hacen, así que la regla se reformula como un estándar de siete partes frente al cual medir cualquier compilador; ninguno lleva registro de la energía ni demuestra traducir correctamente todo programa.
2. Los límites físicos y matemáticos del enunciado original son reales pero no computables tal como están formulados, por lo que se sustituyen por dos cantidades contables que pueden compararse con un medidor de energía.
3. Se construyó y probó una pieza ausente en los compiladores revisados: una huella del programa compilado que ignora los nombres internos. En un corpus pequeño (16 núcleos y 4 programas) reconoció copias renombradas con más frecuencia que las huellas de bytes crudos o del texto fuente, sin dar jamás la misma huella a dos núcleos que calculan cosas distintas.

*Texto completo en inglés: [/papers/rce-compile/](/papers/rce-compile/).*
