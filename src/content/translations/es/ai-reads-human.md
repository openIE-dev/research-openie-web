---
title: "La \"IA\" lee lenguaje humano: codificación legible por humanos a velocidad de máquina y su costo energético"
deck: "Trabajo en curso. Por qué gran parte de lo que intercambian las máquinas está escrito para personas, cuánto cuesta hoy en bytes, tokens y tiempo, y cómo se medirá el costo en energía."
lang: "es"
source: "ai-reads-human"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

Los agentes de software se pasan datos entre sí en formatos pensados para que los lean personas, como JSON, YAML, Markdown, XML y CSV. Llamamos impuesto de impedancia al trabajo adicional que esto provoca, lo definimos con unidades y medimos dos de sus partes sobre un corpus reproducible de 20,000 registros: tiempo de análisis sintáctico y conteo de tokens. Un primer intento de medir energía en dos portátiles (sección 5b) no logró resolver ninguna energía neta del análisis frente al consumo de fondo, por lo que no se hace ninguna afirmación en julios.

**En palabras sencillas**

1. Los ordenadores y las personas suelen compartir un mismo formato escrito: resulta fácil de leer para las personas, pero obliga al ordenador a realizar trabajo adicional al volver a leerlo.
2. En nuestros datos de prueba, leer los mismos registros llevó unas 8 veces más tiempo como JSON (lector integrado de Python) y unas 735 veces más como YAML que con un diseño binario fijo; leído por un modelo de IA, YAML usó unas 2.2 veces más tokens que CSV.
3. Medimos tiempos y conteos de tokens; también intentamos medir energía en dos portátiles, pero la señal fue demasiado pequeña para separarla de la potencia de fondo, así que esta página no afirma cuántos julios se ahorran.

*Texto completo en inglés: [/papers/ai-reads-human/](/papers/ai-reads-human/).*
