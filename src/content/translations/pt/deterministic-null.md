---
title: "Nulo determinístico: um experimento de controle pré-registrado para substratos neurais e agênticos"
deck: "Um laço de casos de inteiros de 64 bits com zero chamadas a modelo (Shape D: N0 estrito e N1 cristalizado em dev) implementado em Rust, Go, Python, C++20 e Julia, bloqueado sob provas de calendário Bitcoin do OpenTimestamps antes das rodadas de aleatoriedade drand da League of Entropy, e comparado com modelos de linguagem de fronteira em nuvem e locais de pesos abertos ao longo de 4,030 instâncias reservadas e 6 repositórios multiarquivo. Os contadores em chip IOReport do Apple Silicon e rusage do kernel são registrados como reported_j; nenhum monitor externo de joules de tomada ou de barramento de alimentação foi conectado (board_metered é false; measured_j não está definido)."
lang: "pt"
source: "deterministic-null"
complete: true
---

<div id="deterministic-null-a-pre-registered-control-experiment-for-neural-and-agentic-substrates" class="anchor-alias" aria-hidden="true"></div>

*Revisão 7eb0ad5, 22 de novembro de 2026. Resumo de dados e resumos criptográficos: [/data/#deterministic-null](/data/#deterministic-null). Figuras interativas dinâmicas: [/living/deterministic-null/](/living/deterministic-null/). Gêmeo de arquivo em LaTeX: [/pdfs/latex/deterministic-null.pdf](/pdfs/latex/deterministic-null.pdf) ([fonte](/pdfs/latex/deterministic-null.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Visão geral

As avaliações empíricas de inteligência artificial agêntica comparam rotineiramente um modelo de linguagem estocástico com outro, deixando sem medir que parcela da conclusão da tarefa exige um substrato neural no momento da decisão em vez de um procedimento fixo sobre inteiros aplicado a um armazenamento explícito de casos prévios verificados. Este estudo constrói, congela e audita esse controle ausente, o **Nulo determinístico (`Shape D`)**, e testa a hipótese nula por classe $H_{0,k}: \Delta_k = p_{\text{model},k} - p_{\text{null},k} \le \delta$ com margem $\delta = 0.05$ (`5.0` pontos percentuais) ao longo de dois experimentos confirmatórios pré-registrados criptograficamente (`4,030` instâncias reservadas totais posteriores ao farol de aleatoriedade) e de um estudo multiturno de reparo de defeitos em repositórios (`6` repositórios multiarquivo em Python). Os contadores locais de energia do Apple M5 Max (`IOReport` e `proc_pid_rusage`) são registrados como valores `reported_j` do sistema operacional e em chip; a energia de servidores remotos de modelos fechados é registrada estritamente como `not_available`; nenhum medidor físico de potência em barramento de hardware ou em tomada de parede foi conectado (`board_metered = false`, `measured_j = None`).

**Em palavras simples**

1. A maioria dos benchmarks de agentes compara o modelo A com o modelo B sem perguntar quanto um laço de busca com zero chamadas a modelo sobre exemplos prévios verificados já resolve.
2. Ao longo de `2,840` instâncias extraídas de famílias limitadas algébricas, de prova formal e de transações estruturadas (`exp-001`, Track-A), uma tabela congelada de casos em inteiros (`0` chamadas a modelo no momento da decisão) iguala os modelos de fronteira em nuvem em `9` de `10` células de classe e nível, falhando apenas em `12` expressões idiomáticas de clientes em texto livre não indexadas (`+36.40` pontos percentuais a favor do `Claude Opus 5.5`).
3. Ao longo de `1,190` instâncias únicas provenientes de benchmarks públicos de autoria externa (`exp-002`, Track-B: Berkeley Function-Calling Leaderboard `v3`, Sierra `tau-bench` Retail, `BigCodeBench v0.1.3` e `SWE` (engenharia de software)-bench Verified) mais `6` repositórios multiarquivo não vistos, a síntese neural acrescenta de `+52.80` a `+95.00` pontos percentuais onde quer que a massa de chaves não vistas permaneça alta; contudo, em fórmulas únicas de `3-satisfiability` (3-satisfatibilidade) na transição de fase, os modelos de linguagem de turno único entram em colapso (`0.0%-5.2%`), ficando abaixo tanto da tabela limitada de inteiros (`69.6%`) quanto do aprendizado de cláusulas dirigido por conflitos autônomo com verificação clausal de provas (`100.0%`), e sob fluxos recorrentes de lei de Zipf a cristalização on-line reduz as chamadas a modelo e a energia em `3.59×` sem perda na conclusão da tarefa.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termos, siglas e rótulos de medição

<ul id="terms">
<li>AI, ML, LLM, LLMs, MoE, E4B, A3B: inteligência artificial, aprendizado de máquina, grande(s) modelo(s) de linguagem, mistura de especialistas (Mixture-of-Experts), arquitetura efetiva de 4 bilhões de parâmetros e roteamento ativo de 3 bilhões de parâmetros</li>
<li>OBSERVE, REDUCE, FUZZ, LOOKUP, ACT, VERIFY, MUTATE, WRITE: as oito etapas sequenciais do laço de decisão em inteiros do Nulo determinístico (Deterministic Null)</li>
<li>SATB, SUT, SUTs, PFRK, TH2, DOSSIER: contrato do arcabouço do benchmark de saciedade (Satiation Benchmark), sistema(s) sob teste, resultados quádruplos de tentativa (aprovado pass, falho fail, recusa refuse, encerrado killed), ameaça de equipe vermelha 2 (ausência de solucionador oculto dentro das primitivas de ação) e dossiê de estado da técnica e revisão de equipe vermelha do projeto</li>
<li>DNULLMM1, FT, LCB: formato binário de índice de armazenamento mapeado em memória, tabela de funções por classe e limite inferior de confiança de Hoeffding</li>
<li>DRAT, RUP, CDCL, CNF, SAT, UNSAT: tautologia assimétrica de resolução com exclusão, propagação unitária reversa, aprendizado de cláusulas dirigido por conflitos, forma normal conjuntiva, satisfatível e insatisfatível</li>
<li>BV, AST, XOR, IEEE, UC: vetor de bits modular de largura fixa, árvore de sintaxe abstrata, disjunção exclusiva bit a bit, Instituto de Engenheiros Eletricistas e Eletrônicos (padrão de ponto flutuante IEEE-754) e Universidade da Califórnia</li>
<li>BFCL, BCB, SWE, SQL, DB, SAVEPOINT: classificação de chamadas de funções de Berkeley (Berkeley Function-Calling Leaderboard), BigCodeBench, prefixo de benchmarks de engenharia de software, linguagem de consulta estruturada, banco de dados relacional e ponto de controle de reversão transacional</li>
<li>API, CLI, MCP, HTTP, JSON, JSONL, UTF: interface de programação de aplicações, interface de linha de comando, protocolo de contexto de modelo (Model Context Protocol), protocolo de transferência de hipertexto, notação de objetos JavaScript, JSON delimitado por linhas e formato de transformação Unicode</li>
<li>POSIX, MMAP, SHA, OTS: interface portátil de sistema operacional, entrada/saída de arquivos mapeados em memória, algoritmo de resumo seguro (SHA-256) e prova de calendário Bitcoin do OpenTimestamps</li>
<li>BCa, CI, CIs, UCL: bootstrap com correção de viés e aceleração, intervalo(s) de confiança e limite superior de confiança de Wilson</li>
<li>CPU, GPU, ANE, SoC, PID, OS, RAM, DRAM, NVMe, PSU, AC: unidade central de processamento, unidade de processamento gráfico, Apple Neural Engine, sistema em chip, identificador de processo, sistema operacional, memória de acesso aleatório, RAM dinâmica, Non-Volatile Memory Express, unidade de fonte de alimentação e corrente alternada de tomada de parede</li>
<li>RAPL, NVML, KV, GGUF, RPM, RPD, USD, EDA: limite médio de potência em execução da Intel (Intel Running Average Power Limit), biblioteca de gerenciamento da NVIDIA, cache chave-valor, pesos quantizados em formato unificado gerado por GPT, requisições por minuto, requisições por dia, dólares norte-americanos e automação de projeto eletrônico</li>
<li>RCE, MoL, WCA, JEPA, LUT6: Reality Code Engine [mesma instituição], Mixture of Limits (mistura de limites) [mesma instituição], Wise Computer Automation [mesma instituição], arquitetura preditiva de incorporação conjunta (Joint-Embedding Predictive Architecture) e tabela de busca booleana de 6 entradas</li>
</ul>

Ao longo dos níveis de telemetria L0 a L4, quatro classes de medição permanecem estritamente separadas em todas as tabelas e figuras deste estudo:

| Rótulo de medição | Significado neste estudo |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** (Exato: L4 lógico e criptográfico) | Resumos criptográficos idênticos bit a bit do armazenamento em ponto fixo de 64 bits (`SHA-256`), provas de calendário `.ots` do OpenTimestamps, rodadas do farol `drand` da League of Entropy, contagens de tokens e chamadas capturadas pelo `satb-proxy`, e dólares norte-americanos (`USD`) a preço de tabela datado da API. |
| **`Reported (reported_j: L2 & L3 Counters)`** (Reportado: contadores L2 e L3) | Joules por janela em chip do Apple Silicon via `IOReport` sem privilégio root (`macmon`, nível de telemetria `L2`, rótulo de hospedeiro compartilhado `A2`) e energia do kernel do macOS por `PID` `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3`, rótulo `D`). Não constitui um medidor físico sobre barramento de hardware (`measured_j = None`, `board_metered = false`). |
| **`Not Available (label N)`** (Indisponível: rótulo N) | Energia em servidores remotos de APIs fechadas (`Claude Opus 5.5`, `Claude Sonnet 5.5`, `Gemini 2.5 Flash`) e energia de corrente alternada na tomada de parede `L0`. Medianas de frota e multiplicadores da literatura jamais são substituídos nos recibos. |
| **`Invalidated Derived (Falsifier 6)`** (Derivado invalidado: Falseador 6) | A subtração líquida acima do repouso (`derived_marginal_j`) é descartada automaticamente sempre que processos coabitantes no hospedeiro compartilhado induzem deriva de linha de base em repouso pré/pós `> 5.0%` nos níveis de telemetria L0 a L4, preservando intactos os contadores brutos `reported_j`. |

<div id="11-lineage-prior-art-boundaries-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Linhagem, fronteiras perante o estado da técnica e declaração da mesma instituição

Nenhuma novidade é reivindicada para o laço de decisão em si. Os ciclos baseados em casos de recuperação-reutilização-revisão-retenção remontam a Stanfill e Waltz (1986) e a Aamodt e Plaza (1994); o equilíbrio tabular de pêndulo invertido remonta a Michie e Chambers (1968); as tabelas de regras nebulosas remontam a Mamdani e Assilian (1975) e a Wang e Mendel (1992); o registro de provas de satisfatibilidade via `RUP/DRAT` remonta a Goldberg e Novikov (2003) e a Wetzler, Heule e Hunt (2014). Os trabalhos anteriores da Open Interface Engineering ([Portas de confirmação medidas](/papers/gates/), [Saciedade da tarefa versus rebote agregado na demanda por IA](/papers/satiation/), [O Reality Code Engine](/papers/rce/) e [Compilação descendente para LUT6](/papers/lut-adapt/)) são estudos companheiros da mesma instituição (`[same house]`), citados para contexto arquitetural e jamais como confirmação independente.

Uma auditoria do estado da técnica com 69 fontes e uma revisão de equipe vermelha com 36 achados (`docs/DOSSIER.md`) estabeleceram uma lacuna específica na literatura de avaliação de agentes de 2024-2026: os benchmarks de agentes existentes omitem de forma esmagadora controles não neurais, as linhas de base não neurais existentes carecem de congelamentos pré-registrados de armazenamento sobre conjuntos reservados, e os estudos de energia existentes sobre agentes baseados em modelos de linguagem não incluem nenhum braço de controle com zero chamadas a modelo no mesmo hospedeiro.

<figure class="my-8">
  <img src="/figures/deterministic-null/dnull-control-protocol.svg" alt="Bloqueio pré-farol em quatro estágios do Nulo determinístico (Deterministic Null) e protocolo de avaliação pareada." />
  <figcaption>Figura 1. Pré-registro anterior ao farol (<code>Gate G1</code> + OpenTimestamps + <code>drand</code>) e protocolo de avaliação pareada entre o <code>Shape D</code> (<code>N0</code>, <code>N1</code>) e os substratos neurais (<code>B3</code>, <code>B6</code>, <code>Shape H</code>). Diagrama de protocolo, não leitura física de barramento de hardware.</figcaption>
</figure>

---

<div id="2-machine-specification-arms-and-five-language-conformance" class="anchor-alias" aria-hidden="true"></div>

## 2. Especificação da máquina, braços experimentais e conformidade em cinco linguagens

<div id="21-the-eight-step-integer-loop-and-complexity-caps" class="anchor-alias" aria-hidden="true"></div>

### 2.1 O laço de oito etapas em inteiros e os tetos de complexidade

Todo braço nulo `Shape D` executa um laço de oito etapas em inteiros com sinal de 64 bits (escalonamento de ponto fixo `Q = 1,000,000`, zero instruções de ponto flutuante IEEE-754, zero chamadas neurais no momento da decisão):

$$\texttt{OBSERVE} \;\to\; \texttt{REDUCE} \;\to\; \texttt{FUZZ} \;\to\; \texttt{LOOKUP} \;\to\; \texttt{ACT} \;\to\; \texttt{VERIFY} \;\to\; \texttt{MUTATE} \;\to\; \texttt{WRITE}.$$

Durante a construção em `dev`, `WRITE` acrescenta registros verificados (`src` rotulado como `lit:`, `human:`, `mut:` ou `llm:`) a um log canônico `JSONL` e compila uma tabela hash binária de endereçamento aberto via `POSIX mmap` sem cópia (`DNULLMM1`: cabeçalho de 64 bytes mais posições de 48 bytes). Antes da avaliação em `test`, o armazenamento é congelado somente para leitura mediante resumo `SHA-256`; `VERIFY`, `MUTATE` e `WRITE` executam zero atualizações em tempo de teste, e assegura-se que os resumos pré e pós-execução do armazenamento sejam idênticos byte a byte. Para impedir o contrabando de um solucionador geral para dentro do código específico de cada classe (`TH2`), a tabela de funções de cada classe (`REDUCE` + `ACT`) é limitada a `<= 4,096` bytes compactados com gzip e a `<= 50,000` operações primitivas por chamada (`S-3`), não sendo permitido nenhum redutor aprendido de linguagem natural (`S-4`).

<div id="22-operational-permutations-under-comparison" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Permutações operacionais sob comparação

| Braço | Definição | Chamadas a LLM na decisão | Proveniência de construção |
| :--- | :--- | :--- | :--- |
| **`B0` (Piso)** | Emite incondicionalmente a ação padrão da classe; impõe a porta de sensibilidade de ensaio em teste $> 2\delta$ (`10.0` pontos percentuais). | `0` | Nenhuma |
| **`B1` (Clássico)** | Solucionador dedutivo autônomo sem armazenamento de casos (`CDCL+DRAT`, Houdini por espaço nulo de traços, Buchberger Gröbner racional). | `0` | Algoritmo clássico |
| **`B2` (Somente semente)** | Armazenamento semeado pela literatura com a mutação em `dev` desativada. | `0` | Somente `lit:` |
| **`N0` (Nulo estrito)** | Laço fixo de inteiros preenchido em `dev` com zero registros, reparos ou código por classe derivados de modelos (`0` entradas com proveniência `llm:`). | `0` | `lit:`, `human:`, `mut:` |
| **`N1` (Nulo primário)** | Laço fixo de inteiros preenchido em `dev` admitindo entradas verificadas de qualquer proveniência, debitando todas as chamadas a modelo em `dev` a $C_{N1}$. | `0` | Qualquer verificada (debitada em `C_N1`) |
| **`B5` (`code-once`)** | Um LLM de fronteira redige uma única vez uma política determinística em Python a partir das especificações `dev`; congelada antes de `test_seed` existir. | `0` | `1` chamada a LLM em `dev` / classe |
| **`B3` (Fronteira em nuvem)** | Avaliação por instância com modelos em nuvem (`Claude Opus 5.5` primário, `Claude Sonnet 5.5` secundário, sonda `Gemini 2.5 Flash`). | `>= 1` / instância | API pré-treinada em nuvem |
| **`B6` (Local de pesos abertos)** | Inferência local no mesmo hospedeiro (`Alibaba Qwen 3.6 35B-A3B` e `Google Gemma 4 E4B-it` via `llama-server` na GPU Metal do Apple M5 Max). | `>= 1` / instância | `reported_j` local |
| **`Shape H` (Caixa de arcabouço)** | CLI externo `Claude Code 2.1.330` dentro de `/work` com `--strict-mcp-config` roteado 100% pelo `satb-proxy`. | Multiturno | Testa o piso da `Lane B` (Falseador 8) |

<div id="23-gate-g2-five-language-conformance-and-positive-controls" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Conformidade em cinco linguagens do Gate G2 e controles positivos

Vetores-padrão independentes gerados via `/usr/bin/bc` e `openssl` verificam a concordância exata bit a bit em cinco linguagens (`Gate G2`), ao lado de três controles positivos segregados (`ctl.setpoint`: `B0 = 0.110 -> N0 = 1.000`; `ctl.mamdani`: `B0 = 0.525 -> N0 = 1.000`; `ctl.cartpole`: `B0 = 0.000 -> N0 = 0.805`, excluídos de todas as afirmações relativas a agentes):

| Implementação | Resumo `SHA-256` do armazenamento congelado | Montagem `DNULLMM1` de `1M` registros | Latência média de sondagem | Soma de verificação de `10k` sondagens |
| :--- | :--- | ---: | ---: | ---: |
| **Rust** (Referência + `SATB`) | `0da4df8d9ccbce1e...4485781` | `44.67 µs` | `582.57 ns` | `15027705736` |
| **C++20** (`clang++ -O3`) | `0da4df8d9ccbce1e...4485781` | `41.58 µs` | `388.43 ns` | `15027705736` |
| **Go `1.25`** | `0da4df8d9ccbce1e...4485781` | `60.63 µs` | `417.05 ns` | `15027705736` |
| **Julia `1.12`** | `0da4df8d9ccbce1e...4485781` | `125.92 µs` | `350.07 ns` | `15027705736` |
| **Python `3.13`** (`mmap`) | `0da4df8d9ccbce1e...4485781` | `8,655.58 µs` | `633.87 ns` | `15027705736` |

---

<div id="3-confirmatory-experiment-1-exp-001-track-a-bounded-template-stratum" class="anchor-alias" aria-hidden="true"></div>

## 3. Experimento confirmatório 1 (`exp-001`, estrato de modelos limitados da Track-A)

<div id="31-pre-beacon-registration-reg-exp-001" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Pré-registro anterior ao farol (`reg-exp-001`)

Cinco classes (`m = 5`: `formal.bv_superopt`, `formal.hoare_inv`, `formal.poly_ideal`, `formal.open_drat_synth` e `tool.tau2_sqlite`) foram preenchidas ao longo de $J = 5$ permutações de episódios `dev` (`966.2 J` de `reported_j` em `L2` somando todas as tentativas formais de preenchimento; `$0.00955` de custo `dev` no `Opus 5.5` debitados em `N1` sobre `tool.tau2_sqlite`). Os tamanhos amostrais (`n = [420, 250, 250, 250, 250] = 1,420` por nível; `2,840` no total) foram dimensionados com poder estatístico de `90%` para intervalos `BCa` pareados de `10,000` reamostragens a `99.0%` ($1 - 0.05/5$) ajustados para multiplicidade. O manifesto `cffb564cd9ad...` e a prova OpenTimestamps `suite/manifest.json.ots` (`172 B`) foram confirmados em `git tag reg-exp-001` (`e5007a4`) na rodada `drand` `6663731`, estritamente antes da rodada-alvo `6663734` (`test_seed_u64 = 5861262844585529273`). Todas as `750/750` trajetórias amostradas passaram por auditorias independentes de avaliação com `DRAT` e `SQLite SAVEPOINT` (`0` explorações indevidas).

<div id="32-track-a-confirmatory-results-2840-instances" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Resultados confirmatórios da Track-A (`2,840` instâncias)

| Nível e classe de tarefa | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Qwen36}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | IC `BCa` `99.0%` | `reported_j`/acerto no `Qwen` | Veredito ($\delta = +0.05$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | ---: | :--- |
| **Tier 1** `formal.bv_superopt` | `420` | `0.000` | `1.000` | `1.000` | `0.998` | `0.836` | `-0.24 pts` | `[-1.43, +0.00]` | `14.17 J` | **Relevância excluída** |
| **Tier 1** `formal.hoare_inv` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.508` | `+0.00 pts` | `[+0.00, +0.00]` | `23.32 J` | **Relevância excluída** |
| **Tier 1** `formal.poly_ideal` | `250` | `0.348` | `1.000` | `1.000` | `0.996` | `1.000` | `-0.40 pts` | `[-2.80, +0.00]` | `7.26 J` | **Relevância excluída** |
| **Tier 1** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.352` | `+0.00 pts` | `[+0.00, +0.00]` | `69.00 J` | **Relevância excluída** |
| **Tier 1** `tool.tau2_sqlite` | `250` | `0.188` | `0.624` | `1.000` | `1.000` | `0.940` | `+0.00 pts` | `[+0.00, +0.00]` | `7.11 J` | **Relevância excluída** |
| **Tier 2** `formal.bv_superopt` (`16b`) | `420` | `0.000` | `1.000` | `1.000` | `0.983` | `1.000` | `-1.67 pts` | `[-3.81, -0.48]` | `7.87 J` | **Relevância excluída** |
| **Tier 2** `formal.hoare_inv` (`6b`) | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.600` | `+0.00 pts` | `[+0.00, +0.00]` | `16.41 J` | **Relevância excluída** |
| **Tier 2** `formal.poly_ideal` ($k\in[7,15]$) | `250` | `0.376` | `1.000` | `1.000` | `1.000` | `1.000` | `+0.00 pts` | `[+0.00, +0.00]` | `6.74 J` | **Relevância excluída** |
| **Tier 2** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.376` | `+0.00 pts` | `[+0.00, +0.00]` | `53.59 J` | **Relevância excluída** |
| **Tier 2** `tool.tau2_sqlite` (paráfrase) | `250` | `0.224` | `0.516` | `0.636` | `1.000` | `0.916` | **`+36.40 pts`** | **`[+28.80, +44.80]`** | `7.15 J` | **Relevância demonstrada** (`12` não preenchidos) |

**Auditoria de escopo da Track-A.** Embora o `exp-001` tenha separado com nitidez a verificação formal canonizável (`9/9` células excluídas, poupando `$27.25` em gasto de API ou `31,619.9 J` de `reported_j` local) das paráfrases superficiais não vistas (`+36.40` pontos no Tier 2 `tool.tau2_sqlite`, custando `23.38 J` por acerto adicional no `Qwen 3.6`), uma auditoria pós-execução identificou uma limitação estrutural decisiva: os geradores da Track-A amostravam a partir de famílias de modelos módulo `6` a módulo `12` ($K_{\text{eff}} = 6\text{-}12$), permitindo que um orçamento `dev` de `120` episódios saturasse completamente as células de atributos.

---

<div id="4-confirmatory-experiment-2-exp-002-track-b-external-public-benchmarks-keffn" class="anchor-alias" aria-hidden="true"></div>

## 4. Experimento confirmatório 2 (`exp-002`, benchmarks públicos externos da Track-B, $K_{\text{eff}} = n$)

<div id="41-course-corrected-unique-instance-design-and-registration-reg-exp-002" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Desenho corrigido de instâncias únicas e pré-registro (`reg-exp-002`)

Para testar o `Shape D` sem menus de modelos sintéticos, a Track-B (`exp-002`) incorporou quatro benchmarks públicos de autoria externa (artefatos originais fixados por `SHA-256`) ao lado de instâncias aleatórias estruturalmente únicas de `3-SAT` na transição de fase (`12` variáveis, `50` cláusulas, razão cláusulas/variáveis `4.17`), produzindo `1,190` instâncias únicas reservadas de `test` ($K_{\text{eff}} = n = 1,190$):

1. **`formal.unique_3sat_drat` (`n = 250`)**: Fórmulas `3-CNF` únicas de `12` variáveis e `50` cláusulas; o `Shape D` utiliza propagação polinomial de literais falhos de nível 1 e caminhada local de `45` inversões (`3,108 B` de FT compactada com gzip), enquanto o `CDCL` autônomo com verificação de provas `RUP/DRAT` de dois literais monitorados atua como o braço clássico `B1`.
2. **`external.bfcl_v3_live` (`n = 250` de um conjunto de `1,292`)**: UC Berkeley Gorilla Function-Calling Leaderboard `v3` (esquemas multiferramenta contribuídos por usuários em `live_multiple` intercalados com tarefas de abstenção por `irrelevance`; `1,381 B` de FT compactada com gzip).
3. **`external.tau_bench_retail` (`n = 220` de um conjunto de `635`)**: Conjunto de políticas de varejo e mutações de banco de dados relacional `tau-bench` da Sierra Research (`500` usuários, `1,000` pedidos, `50` produtos; `1,298 B` de FT compactada com gzip).
4. **`external.bigcodebench_exec` (`n = 220` de um conjunto executável verificado localmente de `487`)**: Especificações de programação Python com múltiplas bibliotecas do `BigCodeBench v0.1.3` avaliadas por execução isolada de `unittest` (`286 B` de FT compactada com gzip; `100%` das tarefas do conjunto verificadas off-line para aprovar as soluções canônicas e rejeitar `return None`).
5. **`external.swebench_verified` (`n = 250` de um conjunto de `500`)**: Ocorrências do GitHub validadas por humanos do `princeton-nlp/SWE-bench_Verified`, avaliadas na localização de falhas em repositórios entre `12` opções `(file_path :: symbol)` (`718 B` de FT compactada com gzip).

O manifesto `5fe640f00298...` (`355` chamadas `dev` ao `Opus 5.5` = `$7.1902` debitados em $C_{N1}$) e o recibo OpenTimestamps `suite_exp002/manifest.json.ots` (`207 B`) foram confirmados em `git tag reg-exp-002` (`d6bfae5`) na rodada `drand` `6664086`, estritamente antes da rodada-alvo `6664089` (`test_seed_u64 = 9069507899917430179`). Uma emenda mecânica do arcabouço (`amendment_01_b6_slot_ctx.json`) elevou o contexto total do `llama-server` de `-c 16384` (`4,096` tokens divididos entre `4` posições, o que retornava `HTTP 400` em esquemas `BFCL`/`tau-bench` de `10k-13.7k` tokens) para `-c 81920` (`20,480` tokens por posição), mantendo inalterados todos os armazenamentos congelados, instruções, verificadores, tamanhos amostrais e a rodada `drand` `6664089`. Todas as `515/515` trajetórias amostradas passaram pela reverificação independente do avaliador (`0` explorações indevidas).

<div id="42-track-b-multi-vendor-confirmatory-results-1190-unique-instances" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Resultados confirmatórios multifornecedor da Track-B (`1,190` instâncias únicas)

Todas as `1,190` avaliações do `Shape D` (`N0`, `N1`), `B0` e `B1` (`CDCL+DRAT`) foram concluídas em **`0.9213 s`** (`35.72 J` de `reported_j` em `L2`, `0.36 J` em `GPU`, `2.58 J` de `ri_energy_nj` em `L3`, `6.57 × 10^9` instruções, deriva em repouso pré/pós `3.09% <= 5.0%`).

| Classe de instâncias únicas | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Sonnet}}$ | $p_{\text{Qwen36}}$ | $p_{\text{Gemma4}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | IC `BCa` `99.0%` | Veredito ($\delta = +0.05$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | :--- |
| `formal.unique_3sat_drat` ($p_{B1}=1.000$) | `250` | `0.000` | **`0.696`** | **`0.696`** | `0.052` | `0.008` | `0.000` | `0.000` | **`-64.40 pts`** | `[-72.00, -56.00]` | **Não avaliável** ($p_{\text{LLM}} < 2\delta$) |
| `external.bfcl_v3_live` | `250` | `0.180` | `0.200` | `0.228` | `0.828` | **`0.840`** | `0.804` | `0.720` | **`+60.00 pts`** | `[+51.20, +68.40]` | **Relevância demonstrada** (`28` não preenchidos) |
| `external.tau_bench_retail` | `220` | `0.005` | `0.396` | `0.259` | **`0.864`** | `0.805` | `0.755` | `0.623` | **`+60.45 pts`** | `[+51.82, +68.64]` | **Relevância demonstrada** (`14` não preenchidos) |
| `external.bigcodebench_exec` | `220` | `0.000` | `0.000` | `0.000` | **`0.950`** | `0.836` | `0.473` | `0.391` | **`+95.00 pts`** | `[+90.00, +97.73]` | **Relevância demonstrada** (`218` não preenchidos) |
| `external.swebench_verified` | `250` | `0.096` | **`0.460`** | `0.456` | **`0.984`** | `0.952` | `0.900` | `0.812` | **`+52.80 pts`** | `[+44.40, +60.40]` | **Relevância demonstrada** (`4` não preenchidos) |

*(Uma sondagem ativa em nuvem de 15 chamadas no `Google Gemini 2.5 Flash`, dentro do limite gratuito de `20 RPD` do AI Studio, registrou `0/3`, `3/3`, `2/3`, `1/3` e `3/3` nas cinco classes, na mesma ordem).*

Três achados empíricos destacam-se na Seção 4.2:

1. **Penhasco combinatório dedutivo (`formal.unique_3sat_drat`)**: Quando os menus de modelos são removidos da satisfatibilidade formal (`K_eff = 250` fórmulas `3-CNF` únicas na transição de fase), os modelos neurais de turno único falham quase por completo (`Opus 5.5` atinge `5.2%` por `$13.55`, `Sonnet 5.5` `0.8%` por `$8.17`, `Qwen 3.6` `0.0%` com `7,588 J`, `Gemma 4` `0.0%` com `4,698 J`), ao passo que a tabela polinomial de casos com zero chamadas resolve `69.6%` (`174/250`) e o solucionador clássico autônomo `CDCL+DRAT` (`B1`) resolve **`100.0%` (`250/250`)**. Como o próprio `Opus 5.5` não conseguiu superar o `B0` por $2\delta = 10.0$ pontos percentuais (intervalo `BCa` de `95%` em `[+2.80, +8.40]` pontos), a regra de decisão pré-registrada abstém-se de declarar `"Relevance excluded"` (relevância excluída) e classifica estritamente a célula como **`Not assessable`** (não avaliável).
2. **Linhas de base não triviais com zero modelos ao lado de incrementos neurais genuínos**: Mesmo com zero parâmetros neurais (`N0`), regras de casos lexicais e de esquemas resolvem **`46.0%`** da localização de falhas entre `12` opções do `SWE-bench Verified` (contra o piso de `9.6%`) e **`39.6%`** das mutações de políticas de varejo do `tau-bench` (contra o piso de `0.5%`). No `tau-bench`, a extração gulosa de bigramas em `dev` dentro do `N1` chegou a sobreajustar formulações ruidosas de clientes (`25.9%` contra `39.6%` do `N0`), confirmando a importância de reportar o `N0` estrito ao lado do `N1` (`S4`). Ainda assim, em todos os quatro benchmarks públicos, os modelos de fronteira e os modelos locais de pesos abertos entregam incrementos amplos e estatisticamente decisivos (`+46.82` a `+95.00` pontos percentuais acima tanto de `N0` quanto de `N1`).
3. **Custo em `reported_j` de canal duplo do incremento local (`B6`)**: No hospedeiro compartilhado Apple M5 Max (onde a síntese concorrente `yosys-abc` acionou o Falseador 6 em `4` de `5` janelas de vários minutos, invalidando de forma limpa `derived_marginal_j` enquanto preservava os contadores brutos `IOReport` de `L2` e `ri_energy_nj` por `PID` de `L3`), cada tarefa adicional concluída pelo `Qwen 3.6 35B-A3B` acima do `N1` custou **`49.90 J`** (`SWE-bench`), **`70.33 J`** (`BFCL v3`), **`238.80 J`** (`BigCodeBench`) e **`407.12 J`** (`tau-bench` Retail) em `reported_j` bruto de nível `L2`.

---

<div id="5-goodturing-unseen-mass-multi-turn-work-repair-and-online-crystallization" class="anchor-alias" aria-hidden="true"></div>

## 5. Massa não vista de Good-Turing, reparo multiturno em `/work` e cristalização on-line

<figure class="my-8">
  <img src="/figures/deterministic-null/s3-good-turing-regimes.svg" alt="Dois regimes separados pela massa de chaves não vistas de Good-Turing N1(t)/t e pela cristalização on-line sob lei de Zipf." />
  <figcaption>Figura 2. A massa de chaves não vistas de Good-Turing <em>N</em><sub>1</sub>(<em>t</em>) / <em>t</em> prevê onde o <code>Shape D</code> congelado satura versus onde a síntese neural ou a cristalização on-line é necessária (<code>measured_j = None</code>).</figcaption>
</figure>

<div id="51-goodturing-unseen-mass-n1tt-across-the-five-track-b-streams" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Massa não vista de Good-Turing ($N_1(t)/t$) ao longo dos cinco fluxos da Track-B

Ao longo de cada fluxo de tarefas `dev + cal` $t = 1 \dots T$, a razão de ocorrências únicas (singletons) de Good-Turing $N_1(t)/t$ estima a probabilidade de que a próxima chave recebida ainda não tenha sido vista:

| Classe de tarefa (fluxo `dev + cal`) | Comprimento do fluxo $T$ | Célula grossa $N_1(T)/T$ | Esquema/instância fina $N_1(T)/T$ | Conclusão reservada `N0` / `N1` |
| :--- | ---: | ---: | ---: | ---: |
| `formal.unique_3sat_drat` | `270` | `0.0000` | `1.0000` | `69.6%` / `69.6%` |
| `external.swebench_verified` | `250` | `0.0080` | `0.5960` | `46.0%` / `45.6%` |
| `external.tau_bench_retail` | `285` | `0.0035` | `0.6386` | `39.6%` / `25.9%` |
| `external.bfcl_v3_live` | `300` | `0.0233` | `0.4033` | `20.0%` / `22.8%` |
| `external.bigcodebench_exec` | `240` | **`0.9917`** | **`0.9917`** | **`0.0%` / `0.0%`** |

Mesmo depois de o `N1` cristalizar `108` soluções Python do `Claude Opus 5.5` aprovadas em testes unitários no conjunto `dev` do `BigCodeBench`, $N_1(T)/T = 0.9917$ previu sobreposição de chaves quase nula sobre especificações composicionais de programação não vistas, coincidindo com os `0.0%` de conclusão observados no conjunto reservado `test` (`218` chaves não preenchidas).

<div id="52-multi-turn-work-software-engineering-repair-6-multi-file-repositories" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Reparo multiturno de engenharia de software em `/work` (`6` repositórios multiarquivo)

Para verificar que as instruções de turno único da Seção 4 não prejudicaram nem distorceram arcabouços de programação em múltiplas etapas, seis repositórios de correção de defeitos em Python com múltiplas funções e múltiplos arquivos (`config-defaults` abrangendo `loader.py` + `schema.py`, `interval-merge`, `pagination`, `precedence` abrangendo `calc.py` + `lexer.py`, `rate-window` abrangendo `window.py` + `limiter.py` e `retry-backoff`) foram avaliados dentro de ambientes isolados `/work` (`max_turns = 10`), sobrescrevendo `test_*.py` a partir de cópias originais intactas antes da avaliação via `pytest -q`:

| Faixa de arcabouço multiturno em `/work` | Repositórios aprovados | `SATB` `P/F/R/K` | Chamadas a modelo | Chamadas a ferramenta | `USD` de API / `reported_j` local |
| :--- | ---: | :---: | ---: | ---: | :--- |
| **`Shape D` frio não visto (`t = 1`)** | `0 / 6` (`0.0%`) | `0/6/0/0` | `0` | `0` | `$0.0000` / `< 1 J` |
| **`Lane B` (`Claude Opus 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `28` | `29` | `$0.3613` (`not_available`) |
| **`Lane B` (`Claude Sonnet 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `31` | `34` | `$0.2080` (`not_available`) |
| **`Shape H` (`Claude Code 2.1.330` + `Opus 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `30` | `MCP` | `$0.2646` (`not_available`; Falseador 8 aprovado) |
| **`Lane B` local (`Qwen 3.6 35B-A3B`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `42` | `42` | **`2,342.0 J`** `L2` (`390.3 J`/repositório) |
| **`Shape D` repetição on-line (fluxo `t = 2`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `0` | `0` | `$0.0000` (repetição de patch verificado) |

<div id="53-online-crystallization-on-recurring-zipfian-traffic-bigcodebench" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Cristalização on-line sobre tráfego recorrente de Zipf (`BigCodeBench`)

Na trilha secundária on-line (`600` requisições extraídas de uma distribuição Zipf-$0.85$ sobre as `220` tarefas únicas de teste do `BigCodeBench`, em que o `Shape D` invoca `B3`/`B6` apenas diante de uma falha por chave não vista e armazena em cache as soluções que passam no `unittest`), a conclusão da tarefa iguala o uso puro por requisição do `Opus 5.5` (**`98.0%` contra `98.0%`**) enquanto `155` funções verificadas são cristalizadas no armazenamento, reduzindo as chamadas acumuladas a LLM em **`72.17%` (`167` contra `600`)**, o gasto de API de **`$7.33` para `$2.04` (`3.59×`)** e o consumo local `reported_j` do `Qwen 3.6` de **`67,729.6 J` para `18,851.4 J` (`3.59×`)**.

---

<div id="6-limitations-falsifiers-and-unfinished-work" class="anchor-alias" aria-hidden="true"></div>

## 6. Limitações, falseadores e trabalho em aberto

1. **Ausência de medidor físico em barramento ou tomada de parede em corrente alternada (`board_metered = false`, `measured_j = None`)**: Todos os números de energia neste estudo correspondem a contadores `reported_j` em chip `IOReport` (`L2`) do Apple Silicon e `ri_energy_nj` (`L3`) do kernel em um hospedeiro executando tarefas concorrentes; medições `L0` de corrente alternada na tomada de parede (`Shelly`/`Yokogawa`, capturando perdas de PSU, DRAM e NVMe) em uma máquina-alvo estabilizada permanecem em aberto.
2. **Seleção autoadministrada de benchmarks versus Tier 3 por terceiro humano externo**: Embora a Track-B (`exp-002`) tenha substituído os modelos sintéticos por quatro benchmarks públicos de autoria externa bloqueados antes da rodada `drand` `6664089`, um benchmark selado de Tier-3 elaborado e mantido sob custódia por um terceiro humano independente ainda não foi executado.
3. **Não necessidade sob orçamento finito**: Todo veredito `"Relevance shown"` (relevância demonstrada) é estritamente relativo à amostra `dev` declarada (`100-150` instâncias) e ao teto de `4,096 B` para a tabela de funções; uma chave não preenchida demonstra cobertura não alcançada dentro desse orçamento, jamais impossibilidade matemática de um procedimento não neural.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referências

<ol data-refs>
<li>Aamodt, A., &amp; Plaza, E. (1994). Case-based reasoning: Foundational issues, methodological variations, and system approaches. <em>AI Communications</em>, 7(1), 39-59.</li>
<li>Efron, B. (1987). Better bootstrap confidence intervals. <em>Journal of the American Statistical Association</em>, 82(397), 171-185.</li>
<li>Goldberg, E., &amp; Novikov, Y. (2003). Verification of proofs of unsatisfiability for CNF formulas. <em>DATE 2003</em>, 886-891.</li>
<li>Good, I. J. (1953). The population frequencies of species and the estimation of population parameters. <em>Biometrika</em>, 40(3-4), 237-264.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., &amp; Narasimhan, K. (2024). SWE-bench: Can language models resolve real-world GitHub issues? <em>ICLR 2024</em>.</li>
<li>Mamdani, E. H., &amp; Assilian, S. (1975). An experiment in linguistic synthesis with a fuzzy logic controller. <em>International Journal of Man-Machine Studies</em>, 7(1), 1-13.</li>
<li>Michie, D., &amp; Chambers, R. A. (1968). BOXES: An experiment in adaptive control. <em>Machine Intelligence</em>, 2, 137-152.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Patil, S. G., Mao, H., Cheng-Jie Ji, C., Yan, F., Suresh, V., Stoica, I., &amp; Gonzalez, J. E. (2024). Gorilla: Large language model connected with massive APIs (Berkeley Function-Calling Leaderboard). <em>NeurIPS 2024</em>.</li>
<li>Simon, H. A., &amp; Kadane, J. B. (1975). Optimal problem-solving search: All-or-none solutions. <em>Artificial Intelligence</em>, 6(3), 235-247.</li>
<li>Stanfill, C., &amp; Waltz, D. (1986). Toward memory-based reasoning. <em>Communications of the ACM</em>, 29(12), 1213-1228.</li>
<li>Wang, L.-X., &amp; Mendel, J. M. (1992). Generating fuzzy rules by learning from examples. <em>IEEE Transactions on Systems, Man, and Cybernetics</em>, 22(6), 1414-1427.</li>
<li>Wetzler, N., Heule, M. J. H., &amp; Hunt, W. A. (2014). DRAT-trim: Efficient checking and trimming using expressive clausal proofs. <em>SAT 2014</em>, 422-429.</li>
<li>Yao, S., Shinn, N., Razavi, P., &amp; Narasimhan, K. (2024). tau-bench: A benchmark for tool-agent-user interaction in real-world domains. <em>arXiv:2406.12045</em>.</li>
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2025). BigCodeBench: Benchmarking code generation with diverse function calls and complex instructions. <em>ICLR 2025</em>.</li>
</ol>
