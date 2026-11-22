---
title: "Satiation Benchmark: arcabouço de referência, adaptadores e atribuição de telemetria"
deck: "Um arcabouço de referência sequencial fixo em Rust (Lane B), uma única ponte adaptadora isolada por proxy local (Shapes D, M, H e I), uma bateria de doze testes de conformidade (C1 a C12) e um motor de atribuição de telemetria sem privilégios root em cinco níveis (L0 a L4 cruzados com os rótulos A1 a N). Verificado empiricamente em Apple M5 Max com sondas de determinismo em múltiplos provedores de nuvem, cadências de amostragem do observador (0 Hz nas fronteiras contra 1 Hz, 10 Hz e 100 Hz), falsificadores de atribuição temporal contra proporcional por tempo de processador e 188 janelas em host compartilhado. Os contadores internos do Apple Silicon são registrados como reported_j; nenhum medidor externo de tomada ou de barramento foi conectado (board_metered é false; measured_j não está definido)."
lang: "pt"
source: "satb-harness"
complete: false
---

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## Resumo

Quando duas avaliações de agentes relatam taxas de conclusão ou valores de energia distintos, a diferença frequentemente decorre do invólucro ao redor do modelo e da forma como os contadores do host são atribuídos, e não do próprio modelo. No `Terminal-Bench 2`, trocar apenas o arcabouço deslocou a resolução de tarefas do `Gemini 2.5 Pro` em `17` pontos percentuais, enquanto subtrair uma linha de base ociosa instável ou dividir um barramento compartilhado pelo tempo de processador pode distorcer a atribuição de energia em mais de `30%`. Este estudo especifica e audita empiricamente em um `Apple M5 Max` (`128 GB` de memória unificada, `macOS 27.2.1`) o contrato do Satiation Benchmark (`SATB`): um arcabouço sequencial determinístico em Rust (`Lane B`, com elisão determinística `ContextRule_v0` aos `80%` da janela sem chamadas ao modelo e truncamento `Truncate_v0` de `8 + 8 KiB`), uma ponte proxy local (`Shapes D, M, H, I`), uma impressão digital de cinco blocos, doze testes de conformidade (`C1` a `C12`) e telemetria em cinco níveis (`L0` a `L4` com rótulos `A1` a `N`), registrando os contadores locais como `reported_j` e a energia de servidor em APIs fechadas estritamente como `not_available`.

**Em palavras simples**

1. O laço de instruções, a regra de corte de contexto e a caixa de areia de ferramentas alteram as pontuações tanto quanto trocar o modelo; por isso a `Lane B` mantém esse invólucro fixo em Rust determinístico enquanto a `Lane O` conduz agentes externos por um único proxy auditado.
2. Os canais de energia são gravados brutos em sua fronteira física real (tomada AC, entrada da placa, pacote do chip, estimativa por processo do sistema operacional ou livro lógico de tokens), sem jamais fundi-los em um número sem rótulo nem preenchê-los com medianas de frota.
3. Os testes reais no `Apple M5 Max` confirmam `12/12` verificações de conformidade (`0` bytes de desvio na repetição e `2.07 ms` para encerrar a árvore de processos com `SIGKILL`), mostram por que `temperature = 0` não garante saídas idênticas em três provedores de nuvem, medem o custo do observador (`0.011 mW` nas fronteiras contra `66.44 mW` a `10 Hz`) e demonstram divergência de `32.59%` a `35.86%` na divisão proporcional por tempo de processador frente aos contadores sequenciais exatos.

*Texto completo em inglês: [/papers/satb-harness/](/papers/satb-harness/).*
