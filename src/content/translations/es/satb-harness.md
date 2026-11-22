---
title: "Satiation Benchmark: arnés de referencia, adaptadores y atribución de telemetría"
deck: "Un arnés de referencia secuencial fijo en Rust (Lane B), un único puente adaptador aislado mediante proxy local (Shapes D, M, H e I), una batería de doce pruebas de conformidad (C1 a C12) y un motor de atribución de telemetría sin privilegios de superusuario en cinco niveles (L0 a L4 cruzados con las etiquetas A1 a N). Verificado empíricamente en Apple M5 Max mediante sondeos de determinismo en la nube, cadencias de muestreo del observador (0 Hz en frontera frente a 1 Hz, 10 Hz y 100 Hz), falsadores de atribución temporal frente a proporcional por tiempo de procesador y 188 ventanas en host compartido. Los contadores integrados de Apple Silicon se registran como reported_j; no se conectó ningún medidor físico de enchufe ni de riel (board_metered es false; measured_j no está definido)."
lang: "es"
source: "satb-harness"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumen

Cuando dos evaluaciones de agentes informan tasas de resolución o cifras de energía distintas, la diferencia suele provenir del envoltorio que rodea al modelo y del modo en que se atribuyen los contadores del sistema, más que del propio modelo. En `Terminal-Bench 2`, cambiar únicamente el arnés desplazó la resolución de tareas de `Gemini 2.5 Pro` en `17` puntos porcentuales, mientras que restar una línea base inactiva con deriva o repartir un riel compartido según el tiempo de procesador puede distorsionar la atribución energética en más de un `30%`. Este estudio especifica y verifica empíricamente en un equipo `Apple M5 Max` (`128 GB` de memoria unificada, `macOS 27.2.1`) el contrato del Satiation Benchmark (`SATB`): un arnés secuencial determinista en Rust (`Lane B`, con elisión determinista `ContextRule_v0` al `80%` de la ventana sin llamadas al modelo y truncamiento `Truncate_v0` de `8 + 8 KiB`), un puente proxy local (`Shapes D, M, H, I`), una huella criptográfica de cinco bloques, doce pruebas de conformidad (`C1` a `C12`) y un motor de telemetría en cinco niveles (`L0` a `L4` con etiquetas `A1` a `N`), registrando los contadores locales como `reported_j` y la energía remota de APIs cerradas estrictamente como `not_available`.

**En palabras sencillas**

1. El bucle de instrucciones, la política de recorte de contexto y el aislamiento de herramientas alteran las puntuaciones tanto como cambiar de modelo; por ello `Lane B` fija ese envoltorio en Rust determinista y `Lane O` obliga a los agentes externos a pasar por un único proxy auditado.
2. Cada canal de energía se registra en bruto en su frontera física real (enchufe de pared, entrada de placa, paquete del chip, estimación por proceso del sistema operativo o libro lógico de tokens), sin mezclarlos jamás en una cifra sin etiqueta ni rellenarlos con medianas de flota.
3. Las mediciones reales en `Apple M5 Max` superan las `12/12` pruebas de conformidad (`0` bytes de deriva en repetición y `2.07 ms` de limpieza `SIGKILL` del árbol de procesos), muestran por qué `temperature = 0` no garantiza salidas idénticas en tres proveedores en la nube, cuantifican el consumo del observador (`0.011 mW` leyendo fronteras frente a `66.44 mW` a `10 Hz`) y demuestran que el reparto proporcional por tiempo de procesador diverge entre un `32.59%` y un `35.86%` respecto a los contadores secuenciales exactos.

*Texto completo en inglés: [/papers/satb-harness/](/papers/satb-harness/).*
