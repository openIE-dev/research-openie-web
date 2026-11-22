---
title: "Satiation Benchmark: arcabouço de referência, adaptadores e atribuição de telemetria"
deck: "Um arcabouço de referência Rust sequencial fixo (Lane B), uma ponte adaptadora única imposta por proxy (Shapes D, M, H e I), uma suíte de conformidade de doze verificações (C1 a C12) e um motor de atribuição de telemetria sem raiz de cinco níveis (L0 a L4 cruzados com rótulos A1 a N). Verificado empiricamente em quatro arquétipos de hardware: Apple M5 Max (arm64 macOS IOReport e proc_pid_rusage `reported_j`), NVIDIA Jetson AGX Thor (aarch64 Tegra Linux INA238 física de placa inteira e INA3221 com shunt separado por trilho `measured_j`), Framework Desktop AMD Ryzen AI Max+ 395 Strix Halo (x86-64 Linux 0440 root:energy PLATYPUS-isolado RAPL `reported_j` mais amdgpu PPT) e Intel Core i9-13900H Raptor Lake (x86-64 Linux RAPL psys L1 e package-0 L2 `reported_j`). Os canais `measured_j`, `reported_j` e L4 lógicos brutos permanecem estritamente separados e nunca são somados; como cargas de trabalho de co-inquilinos foram executadas nos hospedeiros compartilhados (dedicated_host é false), a atribuição de colocação líquida A2 é retida conforme o Falsificador 6."
lang: "pt"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*Revisão af57f48, 22 de novembro de 2026. Resumo de dados e digest: [/data/#satb-harness](/data/#satb-harness). Figuras vivas interativas: [/living/satb-harness/](/living/satb-harness/). Cópia de arquivo LaTeX: [/pdfs/latex/satb-harness.pdf](/pdfs/latex/satb-harness.pdf) ([fonte](/pdfs/latex/satb-harness.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Visão geral

Quando duas avaliações de agentes reportam taxas de conclusão de tarefas ou valores de energia diferentes, a diferença frequentemente decorre de como o modelo foi encapsulado e de como os contadores do hospedeiro foram atribuídos, e não do próprio modelo. Alterar apenas o arcabouço ao redor do modelo deslocou a resolução de tarefas do `Gemini 2.5 Pro` em `17` pontos percentuais no `Terminal-Bench 2`, enquanto subtrair uma linha de base ociosa desviada ou dividir um trilho de silício compartilhado por tempo de processador pode distorcer a atribuição de energia em mais de `30%`.

Este estudo especifica e verifica empiricamente o contrato de avaliação **Satiation Benchmark (`SATB`)**: um arcabouço de referência sequencial e fixo em Rust (**`Lane B`**), uma ponte de adaptadores isolada por proxy (**`Shapes D, M, H e I`**) para controles sem modelo, endpoints de modelos brutos, arcabouços externos de linha de comando e solucionadores de benchmarks públicos, uma impressão digital criptográfica do sistema sob teste (`SUT`) com cinco blocos, doze verificações obrigatórias de conformidade e um mecanismo de telemetria de energia com cinco níveis e sem necessidade de privilégios de root. Em vez de deixar o projeto sem medição, executamos verificações de conformidade e benchmarks falsificadores em tempo real em **quatro arquiteturas de hardware**: uma estação de trabalho `Apple M5 Max` (`128` gigabytes de memória unificada, `macOS 27.2.1`, com `IOReport` no chip e `proc_pid_rusage` do kernel como `reported_j`), um kit de desenvolvimento Tegra `aarch64` (`Jetson Thor`, `Linux 6.8.12-1021-tegra`, com `measured_j` físico proveniente de sensores de corrente em shunt de todo o placa da Texas Instruments e de três canais separados por trilho), uma estação de trabalho `Framework` Desktop `Strix Halo` (`Ryzen Max+ 395`, `Linux 7.0.0-43-generic x86-64`, com energia de pacote `reported_j` isolada por grupo `0440 root:energy` mais rastreamento de potência de pacote do `amdgpu`), e uma estação de trabalho `Raptor Lake` (`Intel Core i9-13900H`, `Linux 7.0.0-43-generic x86-64`, com energia de plataforma e de pacote `reported_j`), marcando a energia de servidores em nuvem fechados estritamente como `not_available`.

**Em termos simples**

1. O loop de prompt de um agente, a regra de corte de contexto e a sandbox de ferramentas podem mudar pontuações de benchmark tanto quanto trocar o modelo subjacente, de modo que `Lane B` mantém esse wrapper completamente fixo em Rust determinístico, enquanto `Lane O` impõe wrappers externos por meio de um plugue proxy auditado.  
2. Os canais de energia são registrados em bruto na sua verdadeira fronteira física, tomada total de parede, entrada da placa, pacote do chip, estimativa de processo do sistema operacional ou livro-razão lógico de tokens, e nunca são combinados em um único número sem rótulo, somados entre classes de evidência (`measured_j` vs. `reported_j` vs. `est_j`), ou retroalimentados com médias de sustentabilidade da frota.  
3. Testes ao vivo em quatro plataformas de silício verificam determinismo exato de `Shape D` mapeamento de memória de milhões de registros (`15027705736`) e reprodução `C9` (`149,747 B`, `0` diffs de byte), limpeza de finalização de árvore de processos de `0.87-9.54 ms`, não-determinismo da nuvem `temperature = 0` entre três fornecedores, tetos de cadência de sensores de hardware (`24.3-45.4 µs` leituras de contador `x86-64` a `94-97 Hz` versus leituras de shunt de barramento serial de `2.95 ms` a `66.6 Hz` no `Jetson Thor` versus `~8 Hz` `macmon` `IOReport`), erro de `32.59%-72.89%` ao dividir fases sequenciais de computação-mais-armazenamento por tempo de processador (`Falsifier 3`), e separação física de trilho shunt gráfico-versus-processador juntamente com gating de deriva de host compartilhado `Falsifier 6` (`dedicated_host = false`).

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termos, acrônimos e rótulos de atribuição

<ul id="terms">
<li>SATB, SUT, PFRK, OQ, SPEC, BUNDLE, SUBMIT, REFUSE, STOP: arcabouço de referência e especificação de atribuição do Satiation Benchmark, sistema sob teste, quatro resultados de tentativa (aprovação, reprovação, recusa, encerramento), questão aberta de especificação resolvida, documento normativo de especificação, arquivo de pacote de tarefa, chamada terminal de submissão de resposta, chamada terminal de recusa e token de parada do laço sequencial</li>
<li>ACI, SWE, CLI, MCP, SDK, ACP, ARC, AGI, GUI: Interface Agente-Computador, prefixo de benchmark de engenharia de software, interface de linha de comando, Model Context Protocol, kit de desenvolvimento de software, Agent Client Protocol, Abstraction and Reasoning Corpus, suíte de benchmarks de inteligência artificial geral e interface gráfica do usuário</li>
<li>IO, JSON, JSONL, RPC, JCS, UTF, HTTP, SSE, URL: protocolo de entrada/saída, JavaScript Object Notation, JSON delimitado por linha, chamada de procedimento remoto, JSON Canonicalization Scheme (RFC 8785), Unicode Transformation Format, Hypertext Transfer Protocol, Server-Sent Events e Localizador Uniforme de Recursos</li>
<li>POSIX, MMAP, DNULLMM1, SHA, SIGKILL, ESRCH, EACCES, EOF: Interface Portátil de Sistema Operacional, interface de arquivo mapeado em memória, formato binário mapeado em memória de índice Deterministic Null (DNULLMM1), Secure Hash Algorithm (SHA-256), sinal POSIX de término de processo não capturável, status de kernel de processo inexistente, status de erro POSIX de permissão negada e delimitador de heredoc de fim de arquivo</li>
<li>AI, ML, LLM, MLX, GGUF, KV, TP, ENERGY: inteligência artificial, aprendizado de máquina, modelo de linguagem de grande porte, MLX (framework de array da Apple para inferência local), pesos quantizados GGUF (GPT-Generated Unified Format), cache chave-valor, paralelismo de tensores e o consórcio ML.ENERGY de benchmark de potência de GPUs</li>
<li>CPU, GPU, APU, ANE, SoC, ALU, ISA, IPC, PID, UID, GID, OS, VM, EC, GB: unidade central de processamento, unidade de processamento gráfico, unidade de processamento acelerado, Apple Neural Engine, sistema em chip, unidade lógica aritmética, arquitetura do conjunto de instruções, instruções por ciclo, identificador de processo, identificador de usuário, identificador de grupo, sistema operacional, máquina virtual, controlador embarcado e gigabytes</li>
<li>RAM, DRAM, SLC, NVMe, PSU, PDU, AC, DC, DVFS, MSR, MMIO: memória de acesso aleatório, RAM dinâmica, cache de nível de sistema, Non-Volatile Memory Express, unidade de fonte de alimentação, unidade de distribuição de energia, corrente alternada, corrente contínua, escalonamento dinâmico de tensão e frequência, registrador específico de modelo e entrada/saída mapeada em memória</li>
<li>RAPL, NVML, PPT, TI, I2C, ADC, INA, INA238, INA3221, AGX, VDD, SOC, MSS, VIN, SYS, PLATYPUS: Running Average Power Limit da Intel/AMD, NVIDIA Management Library, AMD Package Power Tracking, Texas Instruments, barramento Inter-Integrated Circuit, conversor analógico-digital, família de monitores de corrente/potência da Texas Instruments (`INA`), monitores `INA238` e `INA3221`, nível de módulo NVIDIA Jetson AGX, trilho de tensão de alimentação de dreno, trilho de sistema em chip, trilho de subsistema de memória, trilho de tensão de entrada do sistema e Ataques de vazamento de energia: visando seu processador por meio de software (PLATYPUS)</li>
<li>API, USD, CNCF, AISI, UK, AMD, NVIDIA: interface de programação de aplicativos, dólares dos Estados Unidos, Cloud Native Computing Foundation, AI Safety Institute, Reino Unido, Advanced Micro Devices e NVIDIA Corporation</li>
<li>RCE, MoL, WCA, LUT6: Reality Code Engine [mesma casa], Mixture of Limits [mesma casa], Wise Computer Automation [mesma casa], e tabela de busca booleana de 6 entradas</li>
</ul>

Em todos os níveis de telemetria L0 a L4, cada canal registrado em um recibo `SATB` contém tanto sua fronteira física quanto uma de quatro classes estritas de evidência:

| Classe de Evidência | Escopo em recibos e tabelas `SATB` |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | `SHA-256` e `JCS` (`RFC 8785`) resumos canônicos de pacotes de tarefas, impressões digitais de `SUT` de cinco blocos e transcrições de replay; contagens de tokens de prompt, cache, raciocínio e conclusão registradas por proxy; durações de relógio wall-clock; e preço de lista `API` datado em `USD`. |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | Populado apenas a partir de um analisador de parede `AC` calibrado externo (`L0`) ou monitor de corrente de shunt da placa física (`L1`/`L2`). Verificado ao vivo em `NVIDIA Jetson AGX Thor` via `TI` `INA238` (`hwmon6` `VIN`, `L1`) e `INA3221` (`hwmon5` `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS`, `ch3 VIN_SYS_5V0`, `L2`/`L1`; `board_metered = true`). Como um co-inquilino ativo manteve `VDD_GPU` durante a captura (`dedicated_host = false`), o rail bruto `measured_j` é preservado enquanto a atribuição de posicionamento de rede `A2` é retida; `measured_j` permanece `None` em `Apple M5 Max`, `AMD Strix Halo` e `Intel Raptor Lake`, e a energia de parede `L0` permanece indefinida ao longo. |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | Contadores de telemetria on-chip sem raiz (`Apple M5 Max` `IOReport` `sys_power` em `L1` e `chip_power`/`cpu_power`/`gpu_power` em `L2` via `macmon`; `Intel Raptor Lake` `RAPL` `psys` em `L1` e `package-0`/`core`/`uncore` em `L2`; `Framework AMD Strix Halo` `RAPL` `package-0`/`core` em `L2` mais watts `amdgpu` `PPT`) e estimativas por processo modeladas pelo `OS` (`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` em `L3`, rótulo `D`). Nunca somado com `measured_j` ou `est_j`. |
| **`Provider-Attested (P) vs. Not Available (N)`** | Energia de servidor remoto de `API` fechado é registrada como `P` apenas quando o provedor devolve uma figura de energia por solicitação com metodologia verbatim, e caso contrário literalmente como `"not_available"` (rótulo `N`). Subtrações de linha de base derivadas que falham o limite de desvio de `5.0%` (`Falsifier 6`) ou a verificação de soma `Step 7` são descartadas automaticamente enquanto os canais brutos permanecem intactos. |

<div id="11-lineage-design-invariants-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Linhagem, invariantes de projeto e divulgação de mesma casa

O `SATB` baseia-se diretamente em trabalhos públicos sobre avaliação de agentes e atribuição de energia, em vez de criar protocolos específicos quando já existem padrões: a execução mínima de shell sem estado segue o `mini-swe-agent`; a ponte entre solucionadores e CLIs externas baseia-se no `UK AISI Inspect` (`react()` e `Inspect Agent Bridge`) e no `Terminal-Bench` (`Harbor` / `Terminus-2`); os esquemas de ferramentas usam `MCP` canonicalizado via `RFC 8785` (`JCS`); a disciplina de contadores cumulativos de GPU segue Chung et al. (`ML.ENERGY` / `Zeus`) e Yang et al. sobre armadilhas de amostragem parcial do `nvidia-smi`; a divisão proporcional de `CPU` (`label C`) é avaliada frente ao modelo `CNCF Kepler`; e o isolamento de permissões do `RAPL` no Linux segue Lipp et al. (`PLATYPUS`). Os estudos complementares da Open Interface Engineering, [Metered Commit Gates](/papers/gates/), [Task Satiation vs. Aggregate Rebound](/papers/satiation/) e [Deterministic Null](/papers/deterministic-null/), são trabalhos `[same house]` citados estritamente por definições arquiteturais compartilhadas:

| Eixo do contrato | Invariante preservado em todas as lanes |
| :--- | :--- |
| **Protocolo de tentativa** | Escada de tarefas fixa; no máximo um `SUBMIT` ou `REFUSE` terminal por tentativa; um recibo `SHA-256` imutável por tentativa; resultados canônicos `pass`, `fail`, `refuse`, `killed`; zero feedback do verificador durante as tentativas de teste. |
| **Identidade do sistema** | Impressão digital do `SUT` em cinco blocos (`model` + `serving` + `sampling` + `harness` + `envelope`), calculada com hash em `session.open` e recalculada com hash em `session.close`. |
| **Energia atribuível** | Energia da janela bruta do `SUT` inteiro (`A2`) em host dedicado e em quiescência; energia do motor de inferência em trilho físico exclusivo (`A1`); energia sequencial por fase de modelo versus ferramenta (`B`) sob `Lane B`. |
| **Não atribuível** | Joules de servidor de `API` fechada não atestada (`N`); parcelas exatas de joules por processo em um trilho compartilhado de `SoC` ou de memória unificada (`C` e `D` são modelos, não medidores físicos de trilho); pesos do modelo desvinculados dos kernels do motor e do silício. |

---

<div id="2-survey-of-agent-harnesses-and-why-context-policy-is-part-of-the-system" class="anchor-alias" aria-hidden="true"></div>

## 2. Levantamento de Arcabouços de Agentes e Por Que a Política de Contexto Faz Parte do Sistema

Os arcabouços modernos de codificação, terminal e uso de computador diferem acentuadamente na forma como expõem ferramentas, controlam edições de arquivos e compactam históricos de conversas em crescimento:

| Arcabouço | Ciclo e superfície de ferramentas | Política de contexto e histórico |
| :--- | :--- | :--- |
| **`mini-swe-agent`** | Apenas `Bash`. Toda ação gera um `subprocess.run` fresco e sem estado. | Histórico de mensagens estritamente linear e apenas de acréscimo; sem compactação automática. |
| **`SWE-agent` (`ACI`)** | Visualizador de arquivos em janela de 100 linhas, comando de edição controlado por linter, busca sucinta. | Processador de histórico dobra observações antigas do ambiente em resumos limitados. |
| **`Inspect react()`** | Ciclo sequencial de ferramentas até `submit()`: `bash()`, `text_editor()`, ferramentas `MCP`. | Estado de mensagens editável com truncamento de histórico ou solucionadores de compactação plugáveis. |
| **`Inspect Agent Bridge`** | Envolve `Claude Code`, `Codex CLI`, `Gemini CLI` e agentes `SDK` personalizados por trás de um proxy local. | Delega o gerenciamento de contexto inteiramente ao arcabouço externo envolvido. |
| **`Terminus-2` (`Harbor`)** | Ferramenta única: sessão persistente de terminal `tmux` que recebe pressionamentos de teclas brutos. | Resumização de contexto em três estágios (`3-stage` de compressão progressiva de transcrição). |
| **`Codex CLI`** | Shell em sandbox (`Landlock`/`seccomp` ou `seatbelt`), `apply_patch` estruturado, `MCP`. | Compactação nativa e contínua de contexto acionada perto dos limites da janela do modelo. |
| **`Claude Code`** | `Bash`, ferramentas estruturadas de arquivos (`Read`, `Write`, `Edit`, `Glob`, `Grep`), `MCP`. | Compactação automática de conversa conduzida por LLM (`auto-compact`) mais cache de prompts. |
| **`OpenHands`** | Runtime de fluxo de eventos que executa qualquer agente de codificação `ACP` ou `CodeAct` em contêineres. | Condensador de contexto configurável (resumização por `LLM` ou mascaramento de janela). |
| **`ARC-AGI-3` runner** | Arcabouço padrão versus arcabouços de adaptadores de provedores sobre estados de grade interativos. | Janela limitada de trajetória de estado visual/de grade declarada por trilha de adaptador. |
| **`OSWorld run.py`** | Ciclo de `GUI` de desktop que emite ações de mouse/teclado `pyautogui` sobre capturas de tela de VM. | Janela deslizante de trajetória que retém apenas as $K$ capturas de tela e ações mais recentes. |

No `Terminal-Bench 2`, o `Gemini 2.5 Pro` resolveu **`17%` mais tarefas** quando emparelhado com `Terminus-2` do que quando emparelhado com `OpenHands`, mantendo o ponto de verificação do modelo subjacente constante. O gerenciamento de contexto, a truncagem de saída, a verificação de edição por linter e as regras de nova tentativa são, portanto, componentes de primeira ordem do sistema avaliado, e não infraestrutura neutra. O `SATB` resolve essa confusão ao dividir a avaliação em duas faixas explícitas e ao fechar as Perguntas Abertas `OQ-1` e `OQ-2`:

1. **Manter o invólucro constante (`Lane B`) versus avaliar invólucros externos (`Lane O`)**: `Lane B` (`satb-agent`) fixa um único laço Rust auditável em todos os modelos, ao passo que `Lane O` envolve harnesses completos de terceiros (`Claude Code`, `Codex CLI`, `OpenHands`, `Terminus-2`, `Inspect`) como `SUT`s de caixa-preta cujos prompts internos e chamadas de compactação são hasheados no bloco de impressão digital `harness` e roteados 100% através de `satb-proxy`.
2. **Resolução da política de contexto (`OQ-1`: `ContextRule_v0`)**: Eliminar rigidamente uma tentativa com elisão zero confunde raciocínio multi-etapa com saída verbosa de ferramentas, enquanto a sumarização gerada por `LLM` (`Claude Code` auto-compact) injeta chamadas estocásticas ocultas de modelo que quebram a reprodução determinística do harness. `Lane B` adota **`ContextRule_v0`**: sempre que o tamanho acumulado da conversa exceder **80%** da janela de contexto declarada, o harness substitui deterministicamente as saídas de ferramentas mais antigas por `"[ELIDED_BY_CONTEXT_RULE_V0]"` enquanto mantém `system(TEMPLATE_v0)`, o `user(render(bundle))` inicial e os **8 outputs de ferramentas mais recentes** verbatim, sem realizar **qualquer chamada de modelo**. O `killed(context_ceiling)` rígido é disparado apenas se as mensagens retidas sozinhas excederem 100% da janela.
3. **Resolução da superfície de ferramentas (`OQ-2`: `TOOLS_v0`)**: O uso puro de `exec`-only (estilo `mini`) força os modelos a escapar com shell patches de código multilinha e provas algébricas (`cat << 'EOF'`), introduzindo falhas de aspas de shell ortogonais ao raciocínio da tarefa e complicando a sandboxing portátil sem raiz entre `macOS` e `Linux`. `Lane B` fixa **`TOOLS_v0`**, quatro ferramentas de espaço de trabalho (`exec`, `read_file`, `write_file`, `list_dir`) mais duas ferramentas de terminal (`submit`, `refuse`), canonizadas via `JCS` em `tools_hash` (`d5b102...`).

---

<div id="3-reference-harness-lane-b-contextrule_v0-and-satb-io-protocol" class="anchor-alias" aria-hidden="true"></div>

## 3. Arcabouço de referência (`Lane B`), `ContextRule_v0` e protocolo `SATB-IO`

<figure class="my-8">
  <img src="/figures/satb-harness/satb-lane-b-architecture.svg" alt="Topologia de isolamento de componentes da Lane B do Satiation Benchmark e ciclo de vida determinístico da sessão." />
  <figcaption>Figura 1. À esquerda: isolamento de componentes da <code>Lane B</code>, separando o <code>satb-meter</code> sem privilégios de root, o <code>satb-supervisor</code>, o <code>satb-agent</code>, o <code>satb-sandbox</code> com rede bloqueada, o <code>satb-proxy</code> que mantém credenciais e o <code>Verifier</code> externo inalcançável. À direita: sequência determinística de sessão e de tentativas do <code>SATB-IO</code>.</figcaption>
</figure>

<div id="31-sequential-execution-loop-and-fixed-versus-configurable-split" class="anchor-alias" aria-hidden="true"></div>

### 3.1 Loop de execução sequencial e divisão fixa versus configurável

Dentro do `satb-agent`, cada tentativa executa um loop de agente único estritamente sequencial, sem sobreposição de threads de ferramentas em segundo plano, sem votação `best-of-k` e sem feedback de oráculo verificador:

```text
msgs <- [system(TEMPLATE_v0), user(render(bundle))]
loop:
  ContextRule_v0(msgs)        # >= 80% window -> elide oldest tool outputs; keep last 8; 0 model calls
  r <- proxy.chat(msgs, TOOLS_v0)   # missing usage -> immediate killed(usage_missing)
  if no tool calls: append CONTINUE_v0; continue
  for call in r.tool_calls (sequential):
    submit | refuse -> attempt.close; ignore trailing calls (C4); STOP
    exec | read_file | write_file | list_dir -> fresh sandboxed process in /work,
      Truncate_v0 (8 KiB head + 8 KiB tail), no network egress (C6)
  envelope ceiling reached -> killed(wall_ceiling | token_ceiling | turn_ceiling | context_ceiling)
```

Cada execução de `Lane B` separa as constantes fixas do benchmark (hasheadas em `harness_id`) dos parâmetros declarados do `SUT` (hasheados em `sut_fingerprint_sha256`):

| Fixo em todas as execuções de `Lane B` (`harness_id`) | Configurável por `SUT` (`sut_fingerprint_sha256`) |
| :--- | :--- |
| Prompt `TEMPLATE_v0`, renderizador de pacotes e nudge `CONTINUE_v0` | `model_id`, data do snapshot do provedor ou `GGUF`/safetensors `SHA-256` local |
| Esquemas `TOOLS_v0` (resumo `JCS` de `tools/list`) e despacho sequencial | Parâmetros de amostragem: `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `reasoning_effort` |
| `ContextRule_v0` (limiar de `80%`, manter últimos `8`) e `Truncate_v0` (`8 + 8 KiB`) | Motor de serviço (`llama.cpp`, `MLX`, `vLLM`, `API` na nuvem) e sinalizadores de lote/cache |
| Tentativa única (`attempts = 1`), zero retorno de verificador, zero votação interna | Tetos do envelope: `wall_ms`, `max_total_tokens`, `max_turns` |
| `satb-sandbox`: confinamento em `/work`, ambiente despojado, zero egresso de rede | Quotas de `CPU`/`RAM` da sandbox, silício do hospedeiro, kernel do `OS` e nível de isolamento |

<div id="32-canonical-four-way-outcome-mapping-oq-3" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Mapeamento canônico de quatro vias dos resultados (`OQ-3`)

Para evitar que benchmarks descartem silenciosamente execuções interrompidas ou confundam respostas incorretas voluntárias com timeouts de infraestrutura, o `SATB` mapeia de forma sem perdas os códigos de conclusão legados de cinco estados para **`{pass, fail, refuse, killed}`** (`PFRK`), preservando o `sub_reason` exato em cada recibo:

1. **`completed` $\to$ `pass` (`sub_reason: "verified"`, pontuação `1`)**: o `SUT` chamou `submit(bytes)` antes da expiração do teto e o `Verifier` externo aceitou `bytes` após `attempt.close`.
2. **`incorrect` $\to$ `fail` (`sub_reason: "incorrect"`, pontuação `0`)**: o `SUT` chamou `submit(bytes)` de forma regular; o `Verifier` externo rejeitou o candidato.
3. **`malformed` $\to$ `fail` (`sub_reason: "malformed_submission"`, pontuação `0`)**: o `SUT` chamou voluntariamente `submit(bytes)` com conteúdo não analisável ou inválido em relação ao esquema. Uma submissão inadequada produzida pelo `SUT` é uma falha de acurácia, nunca uma interrupção por infraestrutura.
4. **`refused` $\to$ `refuse` (`sub_reason: "policy" | "capability" | "other"`, pontuação `0`)**: o `SUT` invocou explicitamente `refuse(reason)`.
5. **`no_submission` $\to$ `killed` (`sub_reason: "wall_ceiling" | "token_ceiling" | "turn_ceiling" | "context_ceiling" | "usage_missing" | "exec_timeout_killed" | "process_crash"`, pontuação `0`)**: o `satb-supervisor` encerrou a tentativa antes que qualquer chamada de ferramenta terminal chegasse. Todos os quatro resultados permanecem no denominador $n$.

---

<div id="4-adapter-bridge-shapes-d-m-h-i-five-block-sut-fingerprint-and-c1c12-conformance" class="anchor-alias" aria-hidden="true"></div>

## 4. Ponte de Adaptador (`Formas D, M, H, I`), Impressão Digital de Cinco Blocos do `SUT`, e Conformidade `C1-C12`

<div id="41-four-adapter-shapes-behind-one-supervisor-and-proxy" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Quatro formatos de adaptadores por trás de um supervisor e proxy

Qualquer sistema fora de `Lane B` conecta-se ao `satb-supervisor` por meio de um dos quatro formatos de adaptadores:

| Formato de adaptador | Sistemas-alvo | Contrato de execução e isolamento | Padrões reutilizados |
| :--- | :--- | :--- | :--- |
| **`Shape D` (`dnull` control)** | Deterministic Null (`N0` strict model-free e `N1` dev-crystallized) sobre repositórios `DNULLMM1` `mmap` congelados | Executa dentro de `/work` sob regras idênticas de `TOOLS_v0` e `Verifier` com **`0` chamadas de modelo proxy** no momento da decisão. | `POSIX mmap`, `SPEC v0.4` 64-bit integer loop |
| **`Shape M` (Model endpoint)** | Servidores locais de pesos abertos e `API`s de nuvem fechada | Executa `Lane B` `satb-agent` sobre `Chat Completions` ou `Messages` com chamadas de ferramentas e `usage` obrigatório, roteado 100% via `satb-proxy`. | `API` compatível com OpenAI (`llama.cpp`, `mlx_lm`, `vLLM`); tradutores `Anthropic`, `Gemini`, `xAI` |
| **`Shape H` (Harness in a box)** | `Claude Code`, `Codex CLI`, `Gemini CLI`, `OpenHands`, `Terminus-2` | Tarefa escrita em `/work/task/BUNDLE.md`. `URL` base apontada para `satb-proxy` (`127.0.0.1:<port>`); chaves reais de `API` retidas de `/work`; termina via `MCP` `submit` ou `refuse`; zero outro egresso. | Variáveis de ambiente da ponte de sandbox `Inspect`; `--strict-mcp-config` `MCP`; `ACP` opcional |
| **`Shape I` (`Inspect` agent)** | Solvers `Inspect` de benchmarks públicos existentes | Envolve o pacote de tarefas `SATB` com ferramentas `submit` e `refuse` em `attempts = 1`, roteando chamadas de modelo através de `satb-proxy`. | Interface `Task` e `Solver` do `UK AISI Inspect` |

<div id="42-five-block-sut-fingerprint-and-session-validity" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Estrutura de impressão digital `SUT` em cinco blocos e validade da sessão

Antes que `attempt.start` seja disparado, o adaptador retorna uma estrutura JSON de cinco blocos, cujo resumo `SHA-256` canônico em `JCS` define o `SUT`. Campos desconhecidos ou não observáveis devem ser escritos literalmente como `"not_available"`, nunca omitidos ou estimados:

| Bloco de impressão digital | Campos obrigatórios (valores indisponíveis escritos literalmente como `"not_available"`) |
| :--- | :--- |
| **`model`** | `provider`, `model_id`, `snapshot_date`, `weights_sha256`, `quantisation`, `tokenizer_hash`, `chat_template_hash`, `context_window`, `system_fingerprint` |
| **`serving`** | `engine`, `version`, `commit`, `binary_hash`, `flags_hash` (`cache_prompt`, `slots`, `batch_invariance`, `TP`), `drivers`, `devices` |
| **`sampling`** | `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `stop`, `reasoning_effort`, `tool_choice` |
| **`harness`** | `name`, `version`, `commit`, `binary_hash`, `prompt_hash`, `tools_hash`, `context_policy`, `internal_voting`, `sub_agents`, `config_hash` |
| **`envelope`** | `hardware`, `os_kernel`, `isolation_tier`, `cgroup_limits`, `cpuset`, `network_policy`, `ceilings`, `telemetry_config_hash` |

**Anulação de sessão e canários de início/fim.** Qualquer resumo de bloco alterado em `session.close`, qualquer notificação `MCP` `tools/list_changed`, uma reinicialização do motor de inferência, uma redefinição do contador `NVML`, um campo `model` ou `system_fingerprint` ecoado e alterado durante a sessão, ou uma atualização de `OS`/driver marca **todos os recibos da sessão** como `void`. Recibos `void` permanecem no arquivo público para fins de auditabilidade, mas são excluídos do posicionamento no benchmark. Como um provedor de nuvem pode trocar pesos ou quantização por trás de um `model_id` fixo sem atualizar `system_fingerprint`, toda sessão também delimita a avaliação com um degrau canário determinístico em `session.open` e `session.close`.

<div id="43-mandatory-c1c12-adapter-conformance-suite" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Suíte obrigatória de conformidade dos adaptadores `C1-C12`

Nenhum adaptador ou arcabouço entra em avaliação até que passe todas as doze verificações de conformidade (`C1` a `C12`):

| Verificação | Requisito para aprovação |
| :--- | :--- |
| **`C1` Ida e volta do pacote** | O adaptador ecoa o resumo `SHA-256` `JCS` exato do pacote de tarefa de entrada. |
| **`C2` Caminho de submissão** | O `Verifier` externo recebe a sequência exata de bytes registada na captura terminal de `satb-proxy` / `MCP`. |
| **`C3` Caminho de recusa** | Uma recusa instruída chega de forma limpa como `refuse` (`sub_reason = "other"`, `completion_score = 0`). |
| **`C4` Uma chamada terminal** | Quaisquer chamadas de ferramenta ou terminal emitidas após o primeiro `submit` ou `refuse` são ignoradas e contadas. |
| **`C5` Sem oráculo** | Os diretórios, soquetes e caminhos pai (`..`) de `Verifier` e `satb-supervisor` são inacessíveis a partir de `/work`. |
| **`C6` Egresso** | Apenas `satb-proxy` (`127.0.0.1:<port>`) é acessível para tráfego do modelo; subprocessos de `/work` têm acesso zero à rede externa e chaves `API` upstream zero. |
| **`C7` Uso presente** | Toda chamada de modelo transporta `usage` (`missing -> killed(usage_missing)`); os totais de tokens do proxy coincidem exatamente com as contagens do motor upstream. |
| **`C8` Impressão digital estável** | A impressão digital `SHA-256` do `SUT` de cinco blocos é idêntica antes e depois de uma execução seca de 3 tentativas. |
| **`C9` Reprodução do arcabouço** | A reprodução das respostas registadas de `satb-proxy` reproduz uma transcrição idêntica em bytes (`0` diferenças de bytes; obrigatório para `Lane B`). |
| **`C10` Caminho de terminação** | A árvore de processos `/work` descontrolada (incluindo processos filhos destacados) é colhida em `< 2,000 ms` e registada como `killed`. |
| **`C11` Aperto de mão de telemetria** | Os contadores de processo `L3` sem raiz (`cgroup v2` ou `proc_pid_rusage`) são legíveis, os marcadores de fase chegam e o desvio entre relógio monotónico e de parede é registado. |
| **`C12` Sonda de determinismo** | São executados `8` pedidos idênticos e a contagem de saídas distintas é registada como propriedade empírica do `SUT`. |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. Atribuição de Telemetria de Cinco Níveis (`L0-L4 × A1-N`), Mapas de Canais da Plataforma e o que Não Pode Ser Atribuído

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="Limites de atribuição de telemetria de cinco níveis L0 a L4 cruzados com rótulos A1 a N e o pipeline de verificação de soma bruta-primeiro de sete etapas." />
  <figcaption>Figura 2. Esquerda: níveis de telemetria físicos e lógicos <code>L0</code>-<code>L4</code> mapeados para rótulos de atribuição <code>A1</code>-<code>N</code>. Direita: disciplina de contador bruto-primeiro de sete etapas que impõe limites de desvio de linha de base pré/pós (<code>Falsifier 6</code>) e a verificação de soma da <code>Etapa 7</code>.</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 Limites de telemetria (`L0-L4`) e rótulos de atribuição (`A1-N`)

Sensores de energia e de atividade situam-se em cinco limites distintos, que medem grandezas fisicamente diferentes e que nunca devem ser somados nem confundidos:

| Nível | Limite físico / lógico | Sensores representativos | O que o canal pode atribuir com honestidade |
| :--- | :--- | :--- | :--- |
| **`L0` tomada** | `AC` na tomada de parede | Tomada inteligente ou `PDU` (`Shelly` `apower`, `aenergy`; analisador `Yokogawa`) | Máquina inteira, incluindo o calor de conversão da `PSU`, ventoinhas, `DRAM` e `NVMe`; cadência de `~1 s`. |
| **`L1` plataforma** | Trilho de entrada `DC` da placa | `Jetson Thor INA238` (placa carregadora); `Mac sys_power`; `RAPL psys` | Computador inteiro no lado `DC`, a jusante da fonte externa ou da `PSU`. |
| **`L2` pacote / SoC** | Pacote de `CPU`, `GPU` e trilhos do `SoC` | `RAPL pkg`; `macmon IOReport` sem privilégios de root; `Thor INA3221`; `amdgpu hwmon`; energia cumulativa do `NVML` (`mJ`) | Todo o `SUT` no `SoC` (`A2`), ou o mecanismo de inferência isoladamente, quando um trilho é fisicamente exclusivo (`A1`). |
| **`L3` processo / cgroup** | Árvore de processos do `OS` | `Linux cgroup v2` (`cpu.stat`, `memory.peak`, `io.stat`), `perf`; `macOS proc_pid_rusage` `ri_energy_nj` | Parcelas de atividade de recursos (`C`), ou o modelo interno de energia por processo do próprio núcleo do `OS` (`D`). |
| **`L4` lógico** | A conversa com o modelo/ferramenta | Contagens de tokens e latências de chamada do `satb-proxy`; turnos do arcabouço, chamadas de ferramenta e elisões do `ContextRule_v0` | Contagens exatas em todo `SUT`, sem exceção, incluindo as `API`s comerciais fechadas em nuvem. |

Todo valor de energia em um recibo carrega um dos sete rótulos de atribuição:

- **`A1` (Trilho físico exclusivo)**: Um sensor de trilho de hardware acionado exclusivamente por uma partição durante a janela de medição (por exemplo, `Jetson Thor INA3221 ch1 VDD_GPU` quando apenas o motor de inferência local tem acesso ao dispositivo `GPU`).
- **`A2` (Limite dedicado de todo o sistema)**: Um contador de máquina inteira (`L0`/`L1`) ou de pacote completo (`L2`) em uma máquina dedicada em repouso (`SUT` mais camada ociosa do `OS`). **Conforme `OQ-4`, a energia bruta da janela de todo o `SUT` em `A2` é a métrica física primária para alocação**, impedindo que modelos leves deleguem buscas por força bruta não contabilizadas para subprocessos `/work` e impedindo a subtração `ativo - ocioso` de melhorar execuções lentas.
- **`B` (Divisão de fase temporal)**: Diferenças de contador entre janelas de tempo não sobrepostas delimitadas por marcadores de fase sequenciais (`model_call` vs. `tool_call` em `Lane B`).
- **`C` (Participação proporcional, o modelo `Kepler`)**: Um contador de hardware compartilhado particionado por $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ ou utilização de `GPU` quando processos paralelos se sobrepõem (`Lane O` `Shape H`).
- **`D` (Estimativa modelada pelo `OS`)**: O modelo interno de energia por processo do kernel (`macOS ri_energy_nj`). Isola uma árvore de processos dos co-inquilinos de `CPU`, mas permanece um modelo de firmware/kernel em vez de uma leitura física de derivação.
- **`P` (Atestado pelo provedor)**: Um número de energia de servidor por requisição devolvido por um provedor de nuvem junto com sua metodologia de medição literal.
- **`N` (`not_available`)**: Não observado e **nunca estimado**.

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Disciplina de contagem em sete passos, coleta sem privilégios de root (`OQ-5`) e mapas por plataforma

`satb-meter` processa cada tentativa em sete passos ordenados:
1. **Ler contadores cumulativos em cada fronteira de evento** (`attempt.start`, cada `model_call` e `tool_call`, `attempt.close`, além de um tick de referência de `100 ms`), de modo que a energia de cada janela seja uma diferença exata de contadores $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$.
2. **Escrever primeiro os canais brutos**: registrar fronteira, sensor, leituras inicial e final, sobreposições (wraps) de contadores e número de amostras; marcar janelas menores que `10` períodos do sensor como `"below_resolution"` e hardware ausente como `"not_available"`.
3. **Dividir fases sequenciais (`B`)**: no `Lane B`, a inferência do modelo e as chamadas de ferramenta `/work` nunca se sobrepõem; harnesses paralelos `Lane O` reduzem as divisões de fase para `C` ou `N`.
4. **Isolar `engine_resident_during_tools`**: enquanto uma ferramenta `/work` executa, um servidor de modelo local (`llama-server`, `vLLM`) mantém os pesos residentes na `GPU`/`DRAM`. Seu consumo ocioso durante a janela da ferramenta é alocado em `engine_resident_during_tools` e não é atribuído nem à inferência ativa do modelo nem à execução da ferramenta.
5. **Dividir por proporção (`C`) somente onde as partições se sobrepõem**: aplicar razões de $\Delta \text{CPU}$ estritamente como alternativa de caracterização, reconhecendo que estados `C`, `DVFS` com turbo e paradas de `DRAM`/armazenamento violam a proporcionalidade.
6. **Armazenar linhas de base como canais derivados**: delimitar as sessões com linhas de base residentes pré e pós; se a potência ociosa pré/pós divergir além de `5.0%` (`Falsifier 6`), descartar os valores derivados de energia líquida acima do ocioso, mantendo intactos os canais brutos.
7. **Executar a verificação de soma (`Falsifier 2`)**: verificar se as componentes derivadas de fase somam de volta à diferença bruta do contador da tentativa dentro de um quantum do sensor (`1 mJ`); caso contrário, descartar a divisão derivada e reter apenas o canal bruto.

**Regra de coleta sem privilégios de root (`OQ-5`).** Os benchmarks nunca devem executar a orquestração do `SUT` como `root`. No `macOS`, o `satb-meter` usa `macmon` sem privilégios (assinatura de `IOReport`) e `proc_pid_rusage(RUSAGE_INFO_V6)` da `libSystem`, nunca `sudo` ou `powermetrics`. No `Linux` (onde `/sys/class/powercap/intel-rapl` passou a ser acessível apenas ao root no kernel `5.10`, após o `PLATYPUS`), uma regra `udev` única concedida por um administrador concede acesso de leitura a um grupo dedicado `satb-meter` que contém **apenas o `UID` do `satb-supervisor`**, garantindo que os processos de sandbox `/work` não possam realizar ataques de canal lateral contra o `RAPL` nem ler o próprio medidor de energia:

| Plataforma alvo | Canais `L0` / `L1` de todo o sistema | Canais `L2` de pacote / `SoC` | Canais `L3` de processo e `L4` lógicos | Estado chave de verificação |
| :--- | :--- | :--- | :--- | :--- |
| **Apple Silicon Mac** (`M5 Max` verificado) | `L0`: `Shelly` `PDU` (`not_available` se desligado); `L1`: `macmon sys_power` (`reported_j`) | `macmon IOReport`: `chip_power`, `cpu_power`, `gpu_power`, `ane_power`, `ram_power` (`reported_j`) | `L3`: `proc_pid_rusage` `ri_energy_nj` (`D`), `ri_instructions`, `ri_diskio_*`; `L4`: `satb-proxy` | `L1`-`L4` sem raiz verificados ao vivo em `Apple M5 Max`; `L0` com tomada aberta. |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`, `Linux x86-64` verificado) | `L0`: `Shelly` `PDU` (`not_available` se desligado); `L1`: `cros_ec` (atributos de energia `0`) | `RAPL package-0` e `core` (`0440 root:energy` `udev`) `reported_j` + `amdgpu` `PPT` `power1_input` (`0444`; `energy1_input` ausente) | `L3`: `cgroup v2` / `getrusage` (partilhas de atividade `C`); `L4`: `satb-proxy` | Verificado ao vivo (`0440 root:energy` isolamento `PLATYPUS`; `amdgpu PPT` `0444`). |
| **Intel Raptor Lake** (`Core i9-13900H`, `Linux x86-64` verificado) | `L0`: `not_available`; `L1`: `RAPL psys` (`intel-rapl:1/energy_uj`, `0444` `reported_j`) | `RAPL package-0`, `core` e `uncore` (`MSR` + `MMIO` `energy_uj`, `0444` `reported_j`) | `L3`: `cgroup v2` / `getrusage` (partilhas de atividade `C`); `L4`: `satb-proxy` | Verificado ao vivo (`0 µJ` resíduo da Etapa 7 entre `psys` `L1` e `package-0` `L2`). |
| **NVIDIA Jetson AGX Thor** (`Linux aarch64` Tegra verificado) | `L1`: `TI INA238` (`hwmon6` `VIN`, `0444` `measured_j`) + `INA3221 ch3 VIN_SYS_5V0` (`0444` `measured_j`) | `INA3221 ch1 VDD_GPU` (`0444` `measured_j`, `A1` quando exclusivo); `ch2 VDD_CPU_SOC_MSS` (`0444` `measured_j`); `NVML` (`unverified`) | `L3`: `cgroup v2` / `getrusage` (partilhas de atividade `C`); `L4`: `satb-proxy` | Verificado ao vivo (`INA238` + `INA3221 ch1-ch3` `0444` sem raiz; GPU `NVML` aberto sob bloqueio de co-inquilino). |
| **`API` de Nuvem Fechada** (`Anthropic`, `xAI`, `Cerebras`, `OpenAI`, `Google`) | Medição local `L0`-`L1` apenas do hospedeiro cliente (excluída da inferência no servidor) | Servidor remoto `L2`: estritamente **`N` (`not_available`)** ou por pedido **`P`** (`OQ-6`) | `/work` local `L3` (`D`/`C`) para ferramentas de sandbox; `L4`: tokens, chamadas e `USD` **exatos** de `satb-proxy` | Verificado ao vivo em `Anthropic`, `Cerebras` e `xAI` via `satb-proxy`. |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Oito armadilhas na medição de hardware e sete quantidades não atribuíveis

Medições de potência padrão falham sistematicamente em `SoC`s e `GPU`s modernos:

| Armadilha de telemetria de hardware | Mitigação do `SATB` |
| :--- | :--- |
| **A potência em ociosidade deriva com a temperatura do die, ventoinhas, `DVFS` e turbo** | Aguardar o arrefecimento da `GPU` (`<= 1,5 W`), delimitar cada janela com linhas de base pré e pós, registar a temperatura de pico da `GPU` e invalidar joules líquidos derivados acima de `5,0%` de deriva (`Falsifier 6`). |
| **Ambiguidade entre ociosidade de máquina fria e ociosidade com pesos residentes** | Medir e rotular ambas explicitamente no `Step 6` em vez de subtrair uma silenciosamente. |
| **A subtração `Active - idle` favorece execuções lentas** | A energia bruta da janela de todo o `SUT` (`A2`) permanece a figura primária de colocação (`OQ-4`). |
| **Janelas de subperíodos lidas como zero, negativas ou ruído de quantização** | Marcar qualquer janela mais curta do que `10` períodos do sensor como `"below_resolution"` (por exemplo, `< 1,2 s` em `macmon` de `~8 Hz` ou `< 10 s` em uma tomada inteligente de `1 Hz`). |
| **Amostradores de telemetria de alta taxa consomem potência significativa de `CPU`** | Ler contadores cumulativos nos limites dos eventos (`0,011 mW` a `0 Hz`) mais um tique de `100 ms`; registar linha de base `observer_only`. |
| **O medidor de potência instantânea `NVML` em `A100`/`H100` amostra apenas `~25%` do tempo de execução** | Ler o cumulativo `nvmlDeviceGetTotalEnergyConsumption` (`mJ`), nunca a sondagem instantânea `nvmlDeviceGetPowerUsage` (Chung et al.; Yang et al.). |
| **A tomada de parede externa `L0` funciona com um relógio não sincronizado** | Emitir uma pulsação de carga de calibração determinística de `50%` de ciclo em `session.open` e `session.close` e fazer correlação cruzada dos carimbos de data/hora. |
| **Daemons de fundo do anfitrião partilhado ou tarefas de co-inquilinos** | Registar a lista de processos, despromover subtrações derivadas partilhadas de `L2` via `Falsifier 6` e registar `ri_energy_nj` (`D`) isolado de co-inquilinos de `L3` juntamente com `L2` bruto. |

Consequentemente, **sete quantidades não podem ser honestamente atribuídas** e estão barradas de afirmações do `SATB`: (1) energia de servidor de `API` fechada não atestada (`N` ou `P` apenas); (2) joules físicos exatos por processo em um `SoC` partilhado ou trilho de memória unificada (`C` e `D` são modelos); (3) pesos do modelo isolados de núcleos de serviço, quantização, agrupamento em lotes e silício; (4) propriedade do piso de ociosidade do `OS` e potência de pesos residentes em `DRAM` (reportados como canais autónomos); (5) eventos individuais mais curtos do que o período do sensor (tais como uma chamada de ferramenta de `30 ms` sob uma tomada de `1 s`); (6) `VM`s de nuvem partilhadas sem contadores de hardware do anfitrião; e (7) trocas silenciosas de pesos do fornecedor em meio à sessão (sinalizadas por canários de início/fim, nunca descartadas a priori). Em particular (`OQ-6`), **as divulgações de sustentabilidade dos fornecedores são medianas de frota em vez de medições por pedido e nunca entram num recibo `SATB`**, incluindo a mediana de `0,24 Wh` do Google para prompts de `Gemini Apps`, o valor de `0,34 Wh` da OpenAI (publicado sem metodologia) e o `1,14 gCO2e` da Mistral por resposta de `400` tokens.

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. Resultados de Conformidade Medida, Determinismo, Efeito-Observador e Atribuição Multi-Hospedeiro

Para substituir suposições de projeto não medidas por recibos auditáveis, executamos o conjunto completo de conformidade `SATB` e o arcabouço falsificador (`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`, tempo total de execução `175.69 s`) em uma estação de trabalho `Apple M5 Max` (`arm64`, `128 GB` de memória unificada, `macOS 27.2.1`, `macmon 0.12.0`), juntamente com uma auditoria cruzada de `188` janelas.

<div id="61-c1c12-conformance-c9-deterministic-replay-and-c10-process-tree-cleanup" class="anchor-alias" aria-hidden="true"></div>

### 6.1 conformidade `C1-C12`, reprodução determinística `C9` e limpeza da árvore de processos `C10`

Todas as **`12 / 12` verificações de conformidade de referência Rust** (`dnull_cli satb-conformance`) e todas as verificações estendidas do sistema operacional passaram:

- **Verificações de pacote, terminal, confinamento e impressão digital (`C1`-`C8`, `C11`)**: `C1` ecoou o digest canônico do pacote `455e941f51f8ffef`; `C2` entregou payloads `submit` byte-exatos através de `satb-proxy` ao `Verifier`; `C3` mapeou recusas vazias/instruídas para `refuse:other`; `C4` ignorou chamadas de ferramenta posteriores ao `submit` (`ignored_trailing_calls = 1`); `C5` bloqueou escapes `../`, `/etc/passwd` e `verifier_oracle/*`; `C6` removeu variáveis de ambiente proxy/credencial dentro de `/work` (`NP=*|HTTP=`) retornando `HTTP 404` em caminhos de proxy não listados; `C7` abortou respostas de uso ausente imediatamente como `killed(usage_missing)`; `C8` preservou impressão digital de cinco blocos byte-igual `8b741c27bf364e5d` em execuções a seco, sinalizando trocas simuladas de `system_fingerprint` com `session_void = true`; e `C11` verificou a visibilidade do contador rootless `RUSAGE_INFO_V6` (`sudo_invoked = false`).

- **Reprodução estendida `C9` de múltiplas voltas `ContextRule_v0` + `Truncate_v0`**: Em um rastreio de `14` voltas gerando `24 KiB` leituras de arquivo brutas por volta (`14` saídas truncadas para `8,192 B + 8,192 B` por `Truncate_v0`) dentro de uma janela de `48,000` tokens (`80%` de limiar = `38,400` tokens), `ContextRule_v0` elidiu deterministicamente as **`5` saídas de ferramenta mais antigas** com **`0` chamadas extra de modelo**, produzindo uma transcrição canônica de `149,747` bytes (`SHA-256` `d697ed1476129939...`) com **`0` diferenças de byte** em repetições independentes de `/work`. Repetir o mesmo rastreio sob uma janela restrita de `16,000` tokens (onde `8` saídas retidas de `16 KiB` excedem `100%`) disparou deterministicamente `killed(context_ceiling)`.

- **Limpeza estendida `C10` de múltiplos processos `SIGKILL` (`< 2,000 ms` teto da especificação)**: Em `5` ensaios gerando uma árvore de `4` processos (`sh` pai mais `3` dorminhocos Python em segundo plano desacoplados em um grupo de processos isolado), a entrega de `SIGKILL` e o recolhimento do kernel foram concluídos com **`2.073 ms` média** (`1.429 ms` mínimo, `2.571 ms` máximo, **`778×` abaixo** do teto de `2,000 ms`) com **`0` `PID`s` sobreviventes** e resultado `killed(wall_ceiling)`.

<div id="62-live-c12-eight-request-determinism-probes-across-four-model-substrates" class="anchor-alias" aria-hidden="true"></div>

### 6.2 Sondas de determinismo de oito solicitações `C12` em tempo real em quatro substratos de modelos

O encaminhamento de `8` solicitações idênticas de síntese algébrica por modelo (`32` chamadas em nuvem em tempo real mais `8` execuções locais de `Shape D`) através de `satb-proxy` verificou paridade exata de contagem de tokens `C7` em `100%` (`32/32` chamadas) e expôs três regimes distintos de determinismo:

| `SUT` / Endpoint via `satb-proxy` | `temperature = 0` preflight | `sampling.temperature` registada | Saídas brutas distintas (`/ 8`) | Formas algébricas distintas (`/ 8`) | `system_fingerprint` | Latência média |
| :--- | :---: | :--- | :---: | :---: | :--- | ---: |
| **`Shape D`: `dnull N1`** (Rust local) | `Exact i64` | `0 (exact_i64_q1e6)` | **`1 / 8`** | **`1 / 8`** | `0da4df8d9ccbce1e…` | `1,474.0 ms` |
| **`Anthropic claude-opus-5-5`** | **`HTTP 400`** | `not_available` (obsoleto) | **`8 / 8`** | **`4 / 8`** | `not_available` | `3,389.1 ms` |
| **`Anthropic claude-sonnet-5-5`** | **`HTTP 400`** | `not_available` (obsoleto) | **`8 / 8`** | **`2 / 8`** | `not_available` | `2,914.3 ms` |
| **`Cerebras gpt-oss-120b`** | `HTTP 200` | `0.0 (seed=42)` | **`2 / 8`** | **`2 / 8`** | `fp_fd4dff7eed92aaf38281` | `484.2 ms` |
| **`xAI grok-4.20-0309-non-reasoning`** | `HTTP 200` | `0.0 (seed=42)` | **`8 / 8`** | **`1 / 8`** | `fp_9974b11849` | `942.7 ms` |

1. **Descontinuação do fornecedor de `temperature = 0`**: Tanto `claude-opus-5-5` como `claude-sonnet-5-5` rejeitaram `"temperature": 0.0` com **`HTTP 400` (`"temperature` is deprecated for this model."`)**, validando empiricamente a regra do `SATB` de que os controlos de amostragem indisponíveis devem ser normalizados para `"not_available"` em vez de serem assumidos silenciosamente como iguais a zero. Em `8` chamadas idênticas, `claude-opus-5-5` (`1,047` tokens de pensamento adaptativo) emitiu `8` textos brutos distintos abrangendo `4` identidades de vetores de bits algebricamente distintas (`(x | y) - (x & y)`, `(x | y) & ~(x & y)`, `(x & ~y) | (~x & y)` e `(x + y) - ((x & y) + (x & y))`).
2. **Não-determinismo residual sob `temperature = 0, seed = 42`**: Mesmo quando `temperature = 0.0` e `seed = 42` foram aceites (`HTTP 200`) com um `system_fingerprint` estável, `Cerebras gpt-oss-120b` (`2,976` tokens de raciocínio) produziu `2` saídas distintas em `8` chamadas idênticas, enquanto `xAI grok-4.20-0309-non-reasoning` estabilizou em `1` fórmula algébrica (`(x | y) & ~(x & y)`) em todas as `8` chamadas, mas variou a sua frase de prova em prosa em todas as `8/8` respostas. Separar o **determinismo do arcabouço dado respostas registadas (`C9`)** da **dispersão de saída medida do `SUT` (`C12`)** é, portanto, essencial.

<div id="63-falsifier-5-observer-effect-benchmark-across-telemetry-cadences-10-s-windows" class="anchor-alias" aria-hidden="true"></div>

### 6.3 Falsificador 5: efeito de observador em benchmark com diferentes cadências de telemetria (janelas de `10 s`)

Medição do sampler combinado (`Python` + pipe `IOReport` do `macmon` filho) em tempo de `CPU`, `L3` `ri_energy_nj` (`reported_j` apenas do observador) e `reported_j` de `L2` para todo o `SoC`, em janelas intercaladas de `10.0 s` no `Apple M5 Max`, quantificou com precisão o overhead do observador:

| Cadência de amostragem | Taxa alcançada | Tempo de `CPU` do sampler / `10 s` | `reported_j` do observador em `L3` | Potência do observador (`mW`) | Participação na janela `L2` | Janela `L2` de todo o `SoC` (`reported_j`) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`0 Hz` apenas nas fronteiras** (`2` syscalls `rusage`) | `0.20 Hz` | **`0.004 ms`** | **`0.000108 J`** | **`0.011 mW`** | **`0.0000%`** | `-` (sem daemon `IOReport`) |
| **`1 Hz` (tick de `1.000 ms`)** | `0.90 Hz` | `9.323 ms` | `0.194237 J` | `19.371 mW` | `0.0521%` | `372.769 J` (`37.17 W`) |
| **`10 Hz` (tick de referência `SATB` de `100 ms`)** | `8.12 Hz` | `36.434 ms` | `0.666596 J` | **`66.439 mW`** | **`0.1770%`** | `376.603 J` (`37.53 W`) |
| **`100 Hz` (falsificador de estresse de `10 ms`)** | `7.44 Hz` | `35.636 ms` | `0.598721 J` | `58.971 mW` | `0.1618%` | `369.926 J` (`36.44 W`) |

Dois fatos de hardware emergem diretamente desta medição:
1. **Perturbação desprezível (`< 0,18%`)**: As leituras de `proc_pid_rusage` apenas nas fronteiras consomem `108 µJ` (`0,011 mW`), **`6.040×` menos potência** que a amostragem `IOReport` a `10 Hz` (`66,44 mW`), e até mesmo o tick de referência de `100 ms` representa apenas **`0,177%`** da energia da janela de todo o `SoC` (diferença total de `0,76%` na janela `L2` entre `-i 10` e `-i 1000`, satisfazendo o `Falsificador 5`).
2. **Teto de cadência de assinatura do `IOReport` (`~8 Hz`)**: Solicitar `-i 10` (`100 Hz`) ao `macmon 0.12.0` resultou em **`7,44 Hz`** (`75,5` amostras em `10,15 s`), pois cada ciclo de assinatura `IOReport` sem privilégios de root bloqueia por `~120 ms` no espaço de usuário do macOS. Consequentemente, o piso `below_resolution` de `10` períodos do `Passo 2` corresponde fisicamente a **`~1,2 s`** nas janelas `L2` do `macmon`, enquanto operações com duração inferior a um segundo devem depender dos contadores `L3` `ri_energy_nj` de fronteira com `0 Hz` ou de janelas em lote.

<div id="64-falsifier-3--step-7-b-temporal-boundary-vs-c-proportional-kepler-attribution" class="anchor-alias" aria-hidden="true"></div>

### 6.4 Falsificador 3 & Etapa 7: `B` limite temporal vs. `C` proporcional (`Kepler`) atribuição

Em `3` replicatas no `Apple M5 Max`, um único `SUT` executou **Fase 1** (`2.50 s` explosão de digestão `SHA-256` densa em ALU: `29.27 ms` tempo médio de `CPU`, `38.63 mJ` por `CPU`-ms) seguida sequencialmente pela **Fase 2** (`2.51 s` varredura de falhas de cache de `192 MiB` `DRAM` + descargas síncronas de disco `fsync` e esperas de `8 ms` de `I/O`: `15.94 ms` tempo médio de `CPU`, `27.73 mJ` por `CPU`-ms) juntamente com um trabalhador de fundo com ciclo de trabalho constante:

| Verificação de atribuição (`n = 3` replicatas sequenciais de duas fases + replicatas co-inquilinas) | Fase 1 (`Compute` `2.50 s`) | Fase 2 (`DRAM + fsync I/O` `2.51 s`) | Falsificador / Veredicto da Etapa 7 |
| :--- | ---: | ---: | :--- |
| **Delta exato da fronteira temporal `B` `L3` (`reported_j`)** | `1.1272 J` (`1,127,172 µJ`) | `0.4433 J` (`443,317 µJ`) | **`Step 7` resíduo `<= 1 µJ` (`3/3` aprovado)** |
| **`C` (`Kepler` $\Delta\text{CPU}$ participação: `64.58%` vs. `35.42%`) em `L3`** | `1.0145 J` (`-10.00%`) | `0.5560 J` (**`+25.21%` erro médio**) | `DRAM`/stall energia/ms $\ne$ `ALU` energia/ms |
| **Delta exato da fronteira temporal `B` `L2` janela total do `SoC` (`reported_j`)** | `82.246 J` | `90.975 J` | `DRAM`, `NVMe`, e consumo do host persiste em espera de `I/O` |
| **`C` (`Kepler` $\Delta\text{CPU}$ participação) aplicada à janela `L2`** | `111.758 J` (**`+35.86%` erro**) | `61.464 J` (**`-32.59%` erro**) | **`Falsifier 3` disparado (`> 20%` erro)** |

Embora a verificação de soma da `Step 7` tenha mantido `0-1 µJ` (`100.0%` das tentativas) sob diferenças de contagem de fronteira (`B`), a atribuição proporcional ao tempo de `CPU` (`C`) creditou excessivamente o pico de computação em **`+35.86%`** e creditou insuficientemente a fase de memória e `fsync` em **`-32.59%`** no `L2` compartilhado (e errou em **`25.21%`** mesmo no `L3` por processo), confirmando empiricamente por que o `SATB` restringe `C` a harnesses paralelos sobrepostos (`Shape H`) e sinaliza divergência sequencial `> 20%` via `Falsifier 3`.

<div id="65-multi-session-falsifier-6-audit-188-windows-and-falsifier-8-harness-floor-check" class="anchor-alias" aria-hidden="true"></div>

### 6.5 Auditoria multissessão do `Falsifier 6` (`188` janelas) e verificação do piso do arcabouço no `Falsifier 8`

A auditoria de **`188` janelas `IOReport` `L2` reais**, coletadas em três campanhas experimentais no host compartilhado `Apple M5 Max` e em duas avaliações pareadas `Lane B` versus `Shape H` (`Claude Code 2.1.330`), confirma as duas salvaguardas de nível de sessão:

1. **Auditoria de deriva de linha de base do `Falsifier 6` (`188` janelas)**: Em `exp-001` (`11` janelas: `1` dentro de `5,0%`, `10` com deriva para cima de até `44,5%`), `exp-002` + multiturno (`7` janelas: `2` dentro de `5,0%`, lote `dnull` de `1.190` instâncias com deriva de `3,09%` e `BigCodeBench` com `Qwen 3.6` com deriva de `1,02%`, e `5` com deriva de `12,16%-65,11%` sob síntese concorrente com `yosys-abc`) e `ai-reads-human` (`170` janelas com `loadavg_1m = 12,92`: `61` dentro de `5,0%`, `109` com deriva), **`64 / 188` janelas (`34,04%`)** mantiveram um `derived_marginal_j` válido, enquanto **`124 / 188` (`65,96%`)** invalidaram automaticamente a subtração líquida acima da ociosidade, sem perder uma única leitura bruta `reported_j` de `L2` ou de `L3` por `PID` (sobrevivência bruta de `188 / 188 = 100,0%`).
2. **`Falsifier 8` (`Lane B` versus `Shape H` `Claude Code 2.1.330`)**: Em `24` pacotes pareados de políticas formais e `SQLite` em `/work`, `Lane B` atingiu **`24 / 24` (`100,0%`)** tanto com `Claude Opus 5.5` (`44` chamadas de modelo, `63.568` tokens de prompt+cache, `\$0,5477`) quanto com `Claude Sonnet 5.5` (`43` chamadas, `60.284` tokens, `\$0,3413`), igualando o `Shape H` (`Claude Code 2.1.330`: **`24 / 24`**, `89` chamadas / `218.449` tokens no `Opus 5.5`; `83` chamadas / `196.128` tokens no `Sonnet 5.5`) e reduzindo o tráfego de tokens de prompt+cache em **`3,44×` e `3,25×`**. Em `6` repositórios inéditos de correção de bugs em Python com múltiplos arquivos (`config-defaults`, `interval-merge`, `pagination`, `precedence`, `rate-window`, `retry-backoff`), `Lane B` (`Opus 5.5`: `28` chamadas / `52.045` tokens; `Sonnet 5.5`: `31` chamadas; `Qwen 3.6 35B-A3B` local: `42` chamadas / `2.342,05 J` de `L2`) novamente igualou o `Shape H` (`Claude Code 2.1.330` + `Opus 5.5`: **`6 / 6`**, `30` chamadas / `86.744` tokens, `1,67×` mais tokens), confirmando que `Lane B` **não** é um piso de arcabouço prejudicado.

<div id="66-multi-platform-hardware-attribution-across-four-silicon-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 Atribuição de hardware multiplataforma em quatro arquétipos de silício

Para verificar que a conformidade `SATB`, o determinismo de ponto fixo do `Shape D`, os limites de permissão rootless do `PLATYPUS` e a separação física das trilhas de shunt permanecem fora do `macOS` e do Apple Silicon, executamos `run_multi_host_satb.py` (`multi_host_satb_receipts.json`) em três arquétipos adicionais de hardware `Linux` além do `Apple M5 Max`:

| Arquétipo de hardware & `OS` kernel | Limite de sensor sem root & classe de evidência | `Shape D` `1M` `DNULLMM1` (`10k` sondas) | `C9` repetição & `C10` `SIGKILL` média | Latência de leitura única & `100 Hz` atingido | `Step 7` residual & `Falsifier 3` (`C` vs. `B`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`** (`arm64`, `128 GB`, `macOS 27.2.1`) | `IOReport` `L1`/`L2` + `rusage` `L3` (`reported_j`; `measured_j = None`) | `15027705736` (`388.43 ns` `C++`, `582.57 ns` Rust) | `149,747 B` (`0` diffs) · `2.073 ms` (`0` `PID`s) | `~120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`** Phase 2 (`+35.86%` Ph. 1) |
| **`NVIDIA Jetson AGX Thor`** (`aarch64`, `122.9 GiB`, `Linux 6.8.12-1021-tegra`) | `TI INA238` (`hwmon6` `VIN` `L1`) + `INA3221` (`hwmon5` `ch1-ch3` `L2`/`L1`, `0444` **`measured_j`**) | `15027705736` (`984.86 ns` `C -O3`, `2,489.4 ns` Py) | `149,747 B` (`0` diffs) · `9.544 ms` (`0` `PID`s) | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2` (`-67.02%` `VIN`) |
| **`Framework AMD Ryzen AI Max+ 395`** (`x86-64`, `122.8 GiB`, `Linux 7.0.0-43`) | `RAPL package-0` & `core` (`0440 root:energy` **`reported_j`**) + `amdgpu PPT` (`0444`; `measured_j = None`) | `15027705736` (`376.61 ns` `C -O3`, `1,341.7 ns` Py) | `149,747 B` (`0` diffs) · `0.868 ms` (`0` `PID`s) | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0` (`-63.34%` `core`) |
| **`Intel Core i9-13900H`** (`x86-64`, `14.7 GiB`, `Linux 7.0.0-43`) | `RAPL psys` (`L1`) + `package-0`, `core`, `uncore` (`L2`, `0444` **`reported_j`**; `measured_j = None`) | `15027705736` (`420.93 ns` `C -O3`, `863.6 ns` Py) | `149,747 B` (`0` diffs) · `1.120 ms` (`0` `PID`s) | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0` (`-73.62%` `psys`) |

Quatro conclusões de hardware multiplataforma emergem destes recibos ao vivo:

1. **Invariância de reprodução bit-exata de `Shape D` e `Lane B` entre `arm64`/`aarch64` e `x86-64`**: Os quatro hospedeiros produziram o checksum exato de `10.000` sondas `DNULLMM1` igual a **`15027705736`**, o digest exato congelado de `test.setpoint` `0da4df8d9ccbce1e...4485781` e a transcrição exata de `149.747` bytes `C9` (`SHA-256` `d697ed1476129939...`, `0` bytes de diferença), ao mesmo tempo que colheram grupos de processos descontrolados de `4` `PID` via `SIGKILL` em `0,868 ms` a `9,544 ms` (`> 200×` abaixo do teto de especificação de `2.000 ms`, mesmo com `loadavg_1m = 52,39` no `Jetson AGX Thor`).
2. **Separação física de shunt `INA238` / `INA3221` e `Falsifier 6` sob co-titularidade ativa de `GPU` no `NVIDIA Jetson AGX Thor`**: No `Linux 6.8.12-1021-tegra`, tanto o `hwmon6` (`ti,ina238` em `i2c@c600000/ina238@44`, entrada `DC` de placa inteira `VIN` a `~27,97 V`) como os três canais do `hwmon5` (`ina3221@40`: `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS` e `ch3 VIN_SYS_5V0`) são legíveis por todos (`0444`) sem `sudo`. Durante a nossa sonda estritamente apenas de `CPU` (`dedicated_host = false`), um co-titular independente `llama-server` deteve o bloqueio de `GPU` do hospedeiro:

| Canal físico de shunt (`0444` `sysfs` sem raiz) no `Jetson AGX Thor` | Limite | Pré-linha de base (`W`) | Fase 1 de computação (`measured_j` / `W`) | Fase 2 `DRAM+fsync` (`measured_j` / `W`) | Pós-linha de base (`W`) | Deriva (`F6`) e erro de fase-2 `Kepler` `C` |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`** (módulo + entrada da placa) | **`L1`** | `100,70 W` | `122,12 J` (`101,66 W`) | `99,02 J` (`81,94 W`) | `97,21 W` | `3,47%` (`A2` retido: co-titular) · **`-67,02%`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`** (co-titular `LLM`) | **`L2`** | `29,26 W` | `40,29 J` (`33,54 W`) | `26,00 J` (`21,52 W`) | `28,13 W` | Co-titular externo de `GPU` (oscilação de `-36,1%` em `F5`) |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36,68 W` | `45,73 J` (`38,07 W`) | `44,37 J` (`36,71 W`) | `36,08 W` | `1,64%` (domínio `CPU`/`SoC`/`MSS`) · **`-70,01%`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`** (trilho de `5,08 V`) | **`L1`** | `14,89 W` | `18,66 J` (`15,53 W`) | `16,82 J` (`13,92 W`) | `13,98 W` | **`6,13% > 5,0%` (`F6` ativado)** · **`-68,85%`** |

1. Ao longo das quatro janelas de cadência do `Falsifier 5`, as requisições de `LLM` de co-locatários, com intensidade variável, reduziram `ch1 VDD_GPU` de `35.36 J` para `22.60 J` (`-36.1%`) e levaram `INA238 VIN` (`L1`), na placa inteira, de `107.48 J` para `81.73 J` (`-24.0%`). Ainda assim, `ch2 VDD_CPU_SOC_MSS` permaneceu dentro da faixa de `35.76-39.31 J`. Como `dedicated_host = false` (e `ch3 VIN_SYS_5V0` excedeu o desvio de `5.0%`, com `6.13%`), o `SATB` retém as alegações de atribuição líquida do `SUT` inteiro do `A2`, preservando o `measured_j` exato separado por trilho (os canais `L1` e `L2` nunca são somados).

3. **Isolamento `0440 root:energy` do `PLATYPUS` e verificação do domínio `APU` do `Strix Halo` na `Framework` `AMD`**: Na `Framework` Desktop (`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`, `Linux 7.0.0-43-generic`), a regra `udev` `90-energy-read.rules` define o modo **`0440` (`root:energy`, `world_readable = false`)** para `/sys/class/powercap/intel-rapl:0/energy_uj` (`package-0`) e `intel-rapl:0:0/energy_uj` (`core`). UIDs de sandbox `/work` sem grupo recebem `EACCES`, o que bloqueia canais laterais do `PLATYPUS`, enquanto o GID do supervisor (`energy`) lê microjoules acumulados sem privilégios de root, com latência mediana de `24.34 µs` e resíduo de `0 µJ` no `Step 7`. A inspeção de `hwmon9` (`amdgpu`) também resolveu um detalhe de especificação em aberto: a `Radeon 8060S` integrada do `Strix Halo` expõe a potência `PPT` legível por todos (`0444`) em `power1_input` / `power1_average` (em `µW`, `75.38 W` na Fase 1 e `69.72 W` na Fase 2), e não um contador separado `energy1_input`. Já o `cros_ec` (`hwmon8`) expõe apenas ventoinhas e termais da placa.

4. **Física de cadência dos barramentos de sensores (`I2C` vs. `MSR`/`MMIO` vs. `IOReport`) e gatilho universal do `Falsifier 3`**: Enquanto as leituras `sysfs` do `powercap` em `x86-64` se completam em `24.34-45.37 µs` (`94.28-97.12 Hz` alcançados com `100 Hz` nominais), cada instantâneo de nove registradores `INA238`+`INA3221` no `Jetson AGX Thor` percorre o `i2c@c600000` físico em **`2,948.8 µs` de mediana** (`4.48 ms` de média), limitando a amostragem de `100 Hz` a **`66.55 Hz`** (`8.9×` acima do teto de `7.44 Hz` do `IOReport` do `macmon`), enquanto alcança **`9.49 Hz`** sem problemas no tique de referência de `100 ms` (`10 Hz`) do `SATB`. Em todos os três hosts `Linux`, a divisão de `C` proporcional ao tempo de `CPU`, no estilo `Kepler`, subcreditou a fase de `DRAM` de `192 MiB` + `fsync` em **`67.02%` a `73.62%`**. Isso confirma, em quatro arquiteturas de silício, por que o `SATB` restringe `C` a execuções paralelas sobrepostas.

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. Verificação de Hardware Aberto e Limitações

| Falsificador de sessão | Consequência quando acionado | Status empírico neste estudo |
| :--- | :--- | :--- |
| **`F1` Replay mismatch (`C9`)** | O arcabouço de referência é não-determinístico | **Liberado em `4/4` hosts (`0` diffs de bytes ao longo de `149,747 B`, `14` turnos)** |
| **`F2` Sum check fails on `> 5%` of attempts** | Divisão de atribuição quebrada no host | **Liberado em `4/4` hosts (`0 µJ` Linux `RAPL`/shunt; `<= 1 µJ` `M5 Max`)** |
| **`F3` `B` and `C` disagree by `> 20%` sequentially** | `C` (`Kepler`) marcado como não confiável no host | **Acionado em `4/4` hosts (`32.59%-73.62%` de erro); `C` restrito** |
| **`F4` Known pulse load outside sensor accuracy** | Sensor rebaixado para a sessão | **Aberto (`L0` smart-plug sync-pulse rig ainda não conectado)** |
| **`F5` `10 ms` vs. `1 s` tick shifts window energy** | Efeito observador de telemetria | **Liberado (`0.76%` `M5 Max` `L2` delta; `9.49-10.48 Hz` alcançado em referência `100 ms`)** |
| **`F6` Pre/post resident baselines drift `> 5.0%`** | Canais líquidos derivadas invalidados | **Ativo (`124/188` janelas `M5 Max` + deriva de co-inquilino Linux devidamente controlada)** |
| **`F7` Adapter passes `C1`-`C12`, fails canary** | Conformidade insuficiente; sessão `void` | **Verificado em simulação (`session_void = true` na troca)** |
| **`F8` `Lane B` places below strong `Lane O` harnesses** | `Lane B` relatada estritamente como piso | **Liberado (`24/24` e `6/6` paridade vs. `Claude Code 2.1.330`)** |

Três itens concretos de hardware e adaptador permanecem em aberto (`OQ-5`):
1. **Sessões `A2` quiesced dedicadas e calibração de tomada `L0` `AC`**: Embora o físico `TI INA238` (`L1`) e `INA3221` (`L2`/`L1`) shunt `measured_j` rails estejam agora verificados ao vivo no `NVIDIA Jetson AGX Thor` ao lado de contadores rootless `reported_j` no `Apple M5 Max`, `Framework AMD Strix Halo` e `Intel Raptor Lake`, todas as quatro máquinas-banco rodaram cargas de co-inquilino concorrentes (`dedicated_host = false`), retendo as alegações de posicionamento `A2` de todo o `SUT`; conectar um medidor `L0` `AC` sincronizado por pulso (`Shelly` / `Yokogawa`) em um host dedicado em repouso é o próximo passo.
2. **Verificação de contador integrado `GPU` `NVML` no `Jetson AGX Thor`**: Permissões `sysfs` rootless (`0444`) para `INA238` e `INA3221 ch1-ch3` (`VDD_GPU`, `VDD_CPU_SOC_MSS`, `VIN_SYS_5V0`) e `Framework AMD Strix Halo` `0440 root:energy` `RAPL` + `amdgpu PPT` (`energy1_input` ausente) estão agora verificadas no dispositivo; a sondagem de `nvmlDeviceGetTotalEnergyConsumption` no `Jetson AGX Thor` aguarda uma janela ociosa quando o bloqueio `GPU` compartilhado está livre.
3. **Roster ao vivo mais amplo de `Shape H` e `Shape I`**: Execuções externas de arco de teste ao vivo neste estudo exercitaram `Shape H` no `Claude Code 2.1.330` juntamente com `Lane B` e `Shape D`; a certificação ao vivo `C1-C12` em `Codex CLI`, `OpenHands`, `Terminus-2` e solucionadores `Shape I` `Inspect` é o próximo passo.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## Referências

<ol data-refs>
<li>Anthropic (2026). Claude Code sandboxing and MCP configuration documentation. <a href="https://docs.anthropic.com/en/docs/claude-code/security">https://docs.anthropic.com/en/docs/claude-code/security</a></li>
<li>ARC Prize Foundation (2026). ARC-AGI-3 interactive benchmarking and adapter harness specification. <a href="https://github.com/arcprize/">https://github.com/arcprize/</a></li>
<li>Chung, J.-W., Gu, Y., Jang, I., Meng, L., Bansal, N., &amp; Chowdhury, M. (2024). Zeus / ML.ENERGY: Understanding and optimizing GPU energy consumption of DNN training and inference. <em>NSDI 2023 / ML.ENERGY</em>. <a href="https://ml.energy/">https://ml.energy/</a></li>
<li>Cloud Native Computing Foundation (2025). Kepler (Kubernetes-based Efficient Power Level Exporter): Proportional CPU/GPU power attribution model. <a href="https://github.com/sustainable-computing-io/kepler">https://github.com/sustainable-computing-io/kepler</a></li>
<li>gerganov, g., &amp; contributors (2026). <code>llama.cpp</code> HTTP server and prompt-cache determinism documentation. <a href="https://github.com/ggml-org/llama.cpp">https://github.com/ggml-org/llama.cpp</a></li>
<li>Kwon, W., Li, Z., Zhuang, S., Sheng, Y., Zheng, L., Yu, C. H., et al. (2023/2026). Efficient memory management for large language model serving with PagedAttention and vLLM batch invariance notes. <em>SOSP 2023 / vLLM Docs</em>. <a href="https://docs.vllm.ai/">https://docs.vllm.ai/</a></li>
<li>Lipp, M., Kogler, A., Oswald, D., Schwarz, M., Easdon, C., Canella, C., &amp; Gruss, D. (2021). PLATYPUS: Software-based power side-channel attacks on x86. <em>IEEE Symposium on Security and Privacy (SP)</em>, 355-371. <a href="https://platypusattack.com/">https://platypusattack.com/</a></li>
<li>Luccioni, A. S., Jernite, Y., &amp; Strubell, E. (2024/2026). Power hungry processing and comparative disclosures of commercial AI energy figures. <em>FAccT / Hugging Face Blog</em>. <a href="https://huggingface.co/blog">https://huggingface.co/blog</a></li>
<li>Model Context Protocol (2025). MCP specification: Tools (`tools/list`, `tools/call`, and `tools/list_changed`). <a href="https://modelcontextprotocol.io/specification">https://modelcontextprotocol.io/specification</a></li>
<li>NVIDIA Corporation (2025/2026). Jetson Thor series power management, INA238 carrier, and INA3221 rail monitoring guide. <a href="https://docs.nvidia.com/jetson/">https://docs.nvidia.com/jetson/</a></li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; Deterministic Null [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>OpenAI (2025/2026). Codex CLI Linux Landlock/seccomp and macOS Seatbelt sandboxing architecture. <a href="https://github.com/openai/codex">https://github.com/openai/codex</a></li>
<li>Rundgren, A., Jordan, B., &amp; Erdtman, S. (2020). JSON Canonicalization Scheme (JCS). <em>IETF RFC 8785</em>. <a href="https://www.rfc-editor.org/rfc/rfc8785">https://www.rfc-editor.org/rfc/rfc8785</a></li>
<li>Terminal-Bench Team (2025/2026). Terminal-Bench 2 and Terminus-2 (Harbor) terminal agent evaluation benchmark. <em>arXiv / GitHub</em>. <a href="https://github.com/laude-institute/terminal-bench">https://github.com/laude-institute/terminal-bench</a></li>
<li>UK AI Safety Institute (2025/2026). Inspect Evals: ReAct solver (`react()`) and Inspect Agent Bridge documentation. <a href="https://inspect.aisi.org.uk/">https://inspect.aisi.org.uk/</a></li>
<li>vladkens (2025/2026). <code>macmon</code>: Sudoless Apple Silicon power and performance monitoring CLI over <code>IOReport</code>. <a href="https://github.com/vladkens/macmon">https://github.com/vladkens/macmon</a></li>
<li>Wang, X., Li, B., Song, Y., Xu, F. F., Tang, X., Zhuge, M., et al. (2025). OpenHands: An open platform for AI software developers as generalist agents. <em>ICLR 2025</em>.</li>
<li>Xie, T., Zhang, D., Chen, J., Li, X., Zhao, S., Cao, R., et al. (2024). OSWorld: Benchmarking multimodal agents for open-ended tasks in real computer environments. <em>NeurIPS 2024</em>.</li>
<li>Yang, J., Jimenez, C. E., Wettig, A., Lieret, K., Yao, S., Narasimhan, K., &amp; Press, O. (2024/2025). SWE-agent: Agent-computer interfaces enable automated software engineering, and <code>mini-swe-agent</code> reference implementation. <em>NeurIPS 2024 / GitHub</em>. <a href="https://github.com/SWE-agent/mini-swe-agent">https://github.com/SWE-agent/mini-swe-agent</a></li>
<li>Yang, Z., Adamek, K., &amp; Armour, W. (2024). Accurate and convenient energy measurements for GPUs: Detailed study of <code>nvidia-smi</code> part-time power sampling. <em>arXiv:2312.12741</em>.</li>
</ol>
