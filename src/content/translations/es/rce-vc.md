---
title: "RCE-VC: ley del control de versiones"
deck: "RCE-VC (una referencia de control de versiones separada del lenguaje Reality Code Engine) admite cada cambio en un único estado canónico de repositorio sin nombres o lo rechaza dejando registrado el motivo, y lee y escribe historial ordinario de Git. Los hitos M0, M1 y M2 están implementados en el commit público 8bf9c9af. Los tiempos de reloj de esta página se midieron en esa compilación (188 microsegundos frente a 100,000 unidades en un núcleo). Los costos en los recibos provienen de una tabla declarada; no se midieron julios."
lang: "es"
source: "rce-vc"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

RCE-VC es un diseño de control de versiones y una pequeña implementación de referencia en Rust (`openIE-dev/rce-vc` en el commit `8bf9c9af`). Muchos autores, personas o programas, envían cambios contra un estado compartido: una comprobación con nombre admite el resultado o el cambio se rechaza conservando el motivo, mientras los autores pueden seguir trabajando en Git. La referencia no es el lenguaje Reality Code Engine, pero emplea el mismo encuadre: una Forma, un paso total determinista, un registro encadenado por hash, claves sin nombres y una escalera de engranajes con el modelo en último lugar.

**En palabras sencillas**

1. Cualquier número de personas y programas puede escribir a la vez. Un cambio entra en el historial compartido cuando una comprobación con nombre acepta el resultado; si no lo acepta, queda fuera con el motivo registrado, sin importar quién lo escribió.
2. Los cambios que no tocan las mismas dependencias no esperan unos a otros. Cuando se solapan, un precio declarado de antemano ordena los resultados que pasan y todo resultado aceptado, incluido un conflicto resuelto, se reutiliza; solo se consulta a un modelo tras fallar los pasos más baratos.
3. La referencia lee y escribe historial ordinario de Git. En la compilación medida, admitir un cambio se mantuvo por debajo de dos décimas de milisegundo desde unos cientos hasta 100,000 unidades en un solo núcleo (188 microsegundos); los precios `est_uj` de los recibos son una tabla declarada y no se midieron julios.

*Texto completo en inglés: [/papers/rce-vc/](/papers/rce-vc/).*
