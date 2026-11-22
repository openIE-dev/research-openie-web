---
title: "Escribir un juego una vez y ejecutarlo en todas partes: dónde termina la reproducción exacta y empieza la tolerancia"
deck: "¿Puede escribirse un juego una sola vez como una máquina de estados comprobada y proyectarse hacia varios motores y lenguajes? Para las reglas y la simulación, sí, bajo aritmética estricta. Para los píxeles entre distinto hardware gráfico, no: solo es alcanzable el acuerdo dentro de una tolerancia medida."
lang: "es"
source: "game-engines"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

Este estudio pregunta si un juego puede escribirse una sola vez como una máquina de estados comprobada (una Forma $P = (S, E, \delta, D, \lambda)$) y proyectarse después hacia varios motores y lenguajes. Las fuentes responden: sí para las reglas del juego y la simulación bajo disciplina numérica estricta; no para píxeles idénticos bit a bit entre distinto hardware gráfico, donde solo es alcanzable un acuerdo basado en tolerancias, acompañado de una división en cuatro capas (simulación, scripting, escena y renderizado), una frontera de determinismo y un plan de pruebas guiado por falsadores.

**En palabras sencillas**

1. Las reglas de un juego (quién se mueve, qué colisiona, quién gana) pueden enunciarse una vez y reproducirse con exactitud siempre que se fije la aritmética.
2. Las imágenes que dibuja un juego no pueden hacerse idénticas en todas las tarjetas gráficas, pero sí comprobarse dentro de un error medido.
3. Los formatos actuales de descripción de juegos cubren cada uno una franja (sombreadores, escenas o reglas); casi ninguno comprueba las costuras entre franjas, y en esa costura concentra su esfuerzo este diseño.

*Texto completo en inglés: [/papers/game-engines/](/papers/game-engines/).*
