---
title: "Satiation Benchmark: arcabouço de referência, adaptadores e atribuição de telemetria"
deck: "Um harness de referência sequencial fixo em Rust (Faixa B), uma ponte adaptadora única imposta por proxy (Formas D, M, H e I), uma suíte de conformidade de doze verificações (C1 a C12) e um motor de atribuição de telemetria sem raiz de cinco níveis (L0 a L4 cruzado com rótulos A1 a N). Verificado empiricamente em cinco arquétipos de hardware: Apple M5 Max (arm64 macOS IOReport e `proc_pid_rusage` `reported_j`), Tegra aarch64 Jetson Thor (corrente total da placa física e corrente medida em três trilhas separadas `measured_j`), Framework Desktop Strix Halo (x86-64 Linux 0440 root:energy pacote de energia isolado por grupo `reported_j` mais rastreamento de energia do pacote gráfico), Intel Core i9-13900H Raptor Lake (plataforma x86-64 Linux L1 e pacote-0 L2 `reported_j`), e Intel Core i7-1165G7 Tiger Lake mais GeForce 2060 no Windows 11 (x86-64 build 26300 L2 cumulativo sem raiz para gráficos discretos `reported_j`, Objeto de Trabalho Win32 e contabilização de ciclos, e rótulo do processador-pacote N). Os valores brutos de `measured_j`, `reported_j` e os canais lógicos L4 permanecem estritamente separados e nunca são somados; como as cargas de trabalho co-inquilinas foram executadas nos hosts compartilhados (`dedicated_host` é falso), a atribuição de colocação neta A2 é retida conforme Falsificador 6."
lang: "pt"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*Revisão af57f48, 22 de novembro de 2026. Resumo de dados e digest: [/data/#satb-harness](/data/#satb-harness). Figuras vivas interativas: [/living/satb-harness/](/living/satb-harness/). Cópia de arquivo LaTeX: [/pdfs/latex/satb-harness.pdf](/pdfs/latex/satb-harness.pdf) ([fonte](/pdfs/latex/satb-harness.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Visão Geral

Quando duas avaliações de agentes reportam taxas de conclusão de tarefas ou valores de energia diferentes, a diferença frequentemente decorre de como o modelo foi encapsulado e de como os contadores do hospedeiro foram atribuídos, e não do próprio modelo. Alterar apenas o arcabouço ao redor do modelo deslocou a resolução de tarefas do `Gemini 2.5 Pro` em `17` pontos percentuais no `Terminal-Bench 2`, enquanto subtrair uma linha de base ociosa desviada ou dividir um trilho de silício compartilhado por tempo de processador pode distorcer a atribuição de energia em mais de `30%`.

Este estudo especifica e verifica empiricamente o contrato de avaliação **Satiation Benchmark (`SATB`)**: um arco de referência sequencial Rust fixo (**`Lane B`**), uma ponte adaptadora isolada por proxy (**`Shapes D, M, H, e I`**) para controles sem modelo, pontos finais de modelo bruto, arcos de linha de comando externos e solucionadores públicos de benchmark, uma impressão criptográfica de cinco blocos do sistema sob teste (`SUT`), doze verificações de conformidade obrigatórias e um motor de telemetria sem raiz de cinco níveis. Em vez de deixar o design não medido, executamos benchmarks de conformidade ao vivo e de falsificação em **cinco arquétipos de hardware** abrangendo `macOS`, `Linux` e `Windows 11`: uma estação de trabalho `Apple M5 Max` (`128` gigabytes de memória unificada, `macOS 27.2.1`, `IOReport` on-chip e kernel `proc_pid_rusage` `reported_j`), um kit de desenvolvedor Tegra `aarch64` (`Jetson Thor`, `Linux 6.8.12-1021-tegra`, Texas Instruments inteiro de placa física e três canais de corrente-shunt separados `measured_j`), uma estação de trabalho `Framework` Desktop `Strix Halo` (`Ryzen Max+ 395`, `Linux 7.0.0-43-generic x86-64`, pacote-energia isolado por grupo `0440 root:energy` `reported_j` mais rastreamento de energia de pacote `amdgpu`), uma estação de trabalho `Raptor Lake` (`Intel Core i9-13900H`, `Linux 7.0.0-43-generic x86-64`, energia de plataforma e de pacote `reported_j`), e uma estação de trabalho `Windows 11` bare-metal (`Intel Core i7-1165G7` mais `GeForce 2060`, `Windows 11` build `26300` `x86-64`, energia discreta acumulada sem raiz `reported_j`, confinamento Win32 Job Object e energia de processador-pacote não privilegiada estritamente marcada `not_available`), juntamente com energia de servidor de nuvem fechado (`not_available`).

**Em termos simples**

1. O *prompt loop* de um agente, a regra de corte de contexto e o *sandbox* de ferramentas podem alterar os escores de benchmark tanto quanto a troca do modelo subjacente. Por isso, `Lane B` mantém esse invólucro totalmente fixo em Rust determinístico, enquanto `Lane O` obriga os invólucros externos a passar por um único *proxy* auditado.

2. Os canais de energia são registrados em bruto em sua fronteira física verdadeira (tomada completa, entrada da placa, encapsulamento do chip, estimativa de processo do sistema operacional ou livro-razão lógico de tokens). Nunca são misturados em um único número sem rótulo, somados entre classes de evidência (`measured_j` vs. `reported_j` vs. `est_j`) ou preenchidos retroativamente com médias de sustentabilidade de frotas.

3. Testes ao vivo em cinco plataformas de silício e sistema operacional (`macOS`, `Linux` e `Windows 11`) verificam o determinismo exato do `Shape D` com um milhão de registros mapeados em memória (`15027705736`) e do replay `C9` (`149,747 B`, `0` diferenças de quebra de linha ou de bytes). Verificam também a limpeza da árvore de processos no nível do kernel, em `0.87-9.54 ms` (`2.46 ms` via Win32 Job Objects no `Windows 11`), e a não determinação em nuvem com `temperature = 0` em três fornecedores. Além disso, medem os limites de cadência dos sensores de hardware: leituras de contadores no Linux de `24.3-45.4 µs` a `94-97 Hz`, contra leituras de contadores gráficos in-process no Windows de `1.17 ms` a `64.6 Hz`, contra leituras de shunt em barramento serial no `Jetson Thor` de `2.95 ms` a `66.6 Hz`, contra o `macmon` `IOReport` de `~8 Hz`. Verificam ainda um erro de `32.59%-89.88%` ao dividir fases sequenciais de computação somada ao armazenamento por tempo de processador (`Falsifier 3`), a separação física dos trilhos de shunt de gráficos e de processador, e o controle de deriva em host compartilhado do `Falsifier 6` (`dedicated_host = false`).

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termos, siglas e rótulos de atribuição

<ul id="terms">
<li>SATB, SUT, PFRK, OQ, SPEC, BUNDLE, SUBMIT, REFUSE, STOP: arcabouço de referência e especificação de atribuição do Satiation Benchmark, sistema sob teste, quatro resultados de tentativa (aprovação, reprovação, recusa, encerramento), questão aberta de especificação resolvida, documento normativo de especificação, arquivo de pacote de tarefa, chamada terminal de submissão de resposta, chamada terminal de recusa e token de parada do laço sequencial</li>
<li>ACI, SWE, CLI, MCP, SDK, ACP, ARC, AGI, GUI: Interface Agente-Computador, prefixo de benchmark de engenharia de software, interface de linha de comando, Model Context Protocol, kit de desenvolvimento de software, Agent Client Protocol, Abstraction and Reasoning Corpus, suíte de benchmarks de inteligência artificial geral e interface gráfica do usuário</li>
<li>IO, JSON, JSONL, RPC, JCS, UTF, HTTP, SSE, URL: protocolo de entrada/saída, JavaScript Object Notation, JSON delimitado por linha, chamada de procedimento remoto, JSON Canonicalization Scheme (RFC 8785), Unicode Transformation Format, Hypertext Transfer Protocol, Server-Sent Events e Localizador Uniforme de Recursos</li>
<li>POSIX, MMAP, DNULLMM1, SHA, SIGKILL, ESRCH, EACCES, EOF, NT, NTFS, CRLF, MSVC, UCRT, FFI, DLL: Interface de Sistema Operacional Portátil, interface de ficheiro mapeado em memória, formato binário de índice Nulo Determinístico mapeado em memória, Algoritmo de Hash Seguro (SHA-256), sinal de terminação de processo POSIX não capturável, estado de kernel sem-tal-processo, estado de erro de permissão-negada POSIX, delimitador de heredoc de fim-de-ficheiro, núcleo Windows New Technology (`Windows NT`), Sistema de Ficheiros New Technology, sequência de nova linha carriage-return line-feed (`\r\n`), compilador Microsoft Visual C++ (`cl.exe`), Universal C Runtime do Windows (`ucrtbase.dll`), interface de função estrangeira e biblioteca de ligação dinâmica</li>
<li>AI, ML, LLM, MLX, GGUF, KV, TP, ENERGY: inteligência artificial, aprendizado de máquina, modelo de linguagem de grande porte, MLX (framework de array da Apple para inferência local), pesos quantizados GGUF (GPT-Generated Unified Format), cache chave-valor, paralelismo de tensores e o consórcio ML.ENERGY de benchmark de potência de GPUs</li>
<li>CPU, GPU, APU, ANE, SoC, ALU, ISA, IPC, PID, UID, GID, OS, VM, EC, GB, TGL, RTX: unidade central de processamento, unidade de processamento gráfico, unidade de processamento acelerado, Motor Neural da Apple, sistema-em-chip, unidade lógica aritmética, arquitetura de conjunto de instruções, instruções por ciclo, identificador de processo, identificador de utilizador, identificador de grupo, sistema operativo, máquina virtual, controlador incorporado, gigabytes, arquitetura móvel Intel Tiger Lake e família de GPU discreta NVIDIA GeForce RTX</li>
<li>RAM, DRAM, SLC, NVMe, PSU, PDU, AC, DC, DVFS, MSR, MMIO, RDTSC, HVCI, WMI, EMI, SRUM: memória de acesso aleatório, RAM dinâmica, cache de nível de sistema, Non-Volatile Memory Express, unidade de fonte de alimentação, unidade de distribuição de energia, corrente alternada, corrente contínua, escalonamento dinâmico de voltagem e frequência, registro específico de modelo, entrada/saída mapeada em memória, instrução x86 Read Time-Stamp Counter, Windows Hypervisor-Protected Code Integrity, Instrumentação de Gerenciamento do Windows, Interface de Medição de Energia do Windows (`\\.\EnergyMeter`), e Monitor de Uso de Recursos do Sistema Windows</li>
<li>RAPL, NVML, PPT, TI, I2C, ADC, INA, INA238, INA3221, AGX, VDD, SOC, MSS, VIN, SYS, PLATYPUS: Running Average Power Limit da Intel/AMD, NVIDIA Management Library, AMD Package Power Tracking, Texas Instruments, barramento Inter-Integrated Circuit, conversor analógico-digital, família de monitores de corrente/potência da Texas Instruments (`INA`), monitores `INA238` e `INA3221`, nível de módulo NVIDIA Jetson AGX, trilho de tensão de alimentação de dreno, trilho de sistema em chip, trilho de subsistema de memória, trilho de tensão de entrada do sistema e Ataques de vazamento de energia: visando seu processador por meio de software (PLATYPUS)</li>
<li>API, USD, CNCF, AISI, UK, AMD, NVIDIA: interface de programação de aplicativos, dólares dos Estados Unidos, Cloud Native Computing Foundation, AI Safety Institute, Reino Unido, Advanced Micro Devices e NVIDIA Corporation</li>
<li>RCE, MoL, WCA, LUT6: Reality Code Engine [mesma casa], Mixture of Limits [mesma casa], Wise Computer Automation [mesma casa], e tabela de busca booleana de 6 entradas</li>
</ul>

Em todos os níveis de telemetria L0 a L4, cada canal registrado em um recibo `SATB` carrega tanto a sua fronteira física quanto uma das quatro classes estritas de evidência:

| Classe de evidência | Escopo em recibos e tabelas `SATB` |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | Resumos canônicos `SHA-256` e `JCS` (`RFC 8785`) de pacotes de tarefas, de impressões digitais de cinco blocos do `SUT` e de transcrições de reprodução; contagens de tokens de prompt, cache, raciocínio e conclusão registradas pelo proxy; durações de relógio de parede; e `USD` de preço de tabela da `API`, datado. |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | Preenchida apenas a partir de um analisador externo de parede `AC` calibrado (`L0`) ou de um monitor físico de corrente em derivação (shunt) na placa (`L1`/`L2`). Verificada ao vivo no `NVIDIA Jetson AGX Thor` por meio do `INA238` da `TI` (`hwmon6` `VIN`, `L1`) e do `INA3221` (`hwmon5` `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS`, `ch3 VIN_SYS_5V0`, `L2`/`L1`; `board_metered = true`). Como um co-inquilino ativo mantinha `VDD_GPU` durante a captura (`dedicated_host = false`), o `measured_j` bruto do trilho é preservado, enquanto a atribuição líquida de alocação `A2` é retida; `measured_j` permanece `None` em `Apple M5 Max`, `AMD Strix Halo`, `Intel Raptor Lake` e `Windows 11` (`i7-1165G7` + `RTX 2060`), e a potência de parede `L0` permanece não definida em todos os casos. |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | Contadores de telemetria on-chip sem privilégio de root (`Apple M5 Max` `IOReport` `sys_power` em `L1` e `chip_power`/`cpu_power`/`gpu_power` em `L2` via `macmon`; `Intel Raptor Lake` `RAPL` `psys` em `L1` e `package-0`/`core`/`uncore` em `L2`; `Framework AMD Strix Halo` `RAPL` `package-0`/`core` em `L2` mais watts `PPT` do `amdgpu`; `Windows 11` `NVML` sem root `nvmlDeviceGetTotalEnergyConsumption`, `mJ` cumulativos na `NVIDIA GeForce RTX 2060` em `L2`) e estimativas por processo modeladas pelo `OS` (`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` em `L3`, rótulo `D`). Nunca somada a `measured_j` ou `est_j`. |
| **`Provider-Attested (P) vs. Not Available (N)`** | A energia de servidor remoto de `API` fechada (e a energia de pacote de `CPU` em modo usuário no Windows 11, onde os drivers `MSR` de `RAPL` em ring-0 são vedados) é registrada como `P` somente quando um provedor devolve uma cifra de energia por requisição com metodologia literal, e caso contrário é registrada literalmente como `"not_available"` (rótulo `N`). Subtrações derivadas de linha de base que violam o limite de deriva de `5.0%` (`Falsifier 6`) ou a verificação de soma do `Step 7` são descartadas automaticamente, enquanto os canais brutos permanecem intactos. |

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

## 2. Levantamento de arcabouços de agentes e por que a política de contexto faz parte do sistema

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
2. **Resolução da política de contexto (`OQ-1`: `ContextRule_v0`)**: Eliminar rigidamente uma tentativa com elisão zero confunde raciocínio multi-etapa com saída verbosa de ferramentas, enquanto a sumarização gerada por `LLM` (`Claude Code` auto-compact) injeta chamadas estocásticas ocultas de modelo que quebram a reprodução determinística do harness. `Lane B` adota **`ContextRule_v0`**: sempre que o tamanho acumulado da conversa excede **80%** da janela de contexto declarada, o harness substitui deterministicamente as saídas de ferramentas mais antigas por `"[ELIDED_BY_CONTEXT_RULE_V0]"` enquanto mantém `system(TEMPLATE_v0)`, o `user(render(bundle))` inicial e os **8 outputs de ferramentas mais recentes** verbatim, sem realizar **qualquer chamada de modelo**. O `killed(context_ceiling)` rígido é disparado apenas se as mensagens retidas sozinhas excederem 100% da janela.
3. **Resolução da superfície de ferramentas (`OQ-2`: `TOOLS_v0`)**: O uso puro de `exec`-only (estilo `mini`) força os modelos a escapar com shell patches de código multilinha e provas algébricas (`cat << 'EOF'`), introduzindo falhas de aspas de shell ortogonais ao raciocínio da tarefa e complicando o sandboxing rootless portátil em `macOS`, `Linux` e `Windows`. `Lane B` fixa **`TOOLS_v0`**, quatro ferramentas de espaço de trabalho (`exec`, `read_file`, `write_file`, `list_dir`) mais duas ferramentas de terminal (`submit`, `refuse`), canonizadas via `JCS` em `tools_hash` (`d5b102...`).

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

### 4.1 Quatro formas de adaptador atrás de um supervisor e proxy

Qualquer sistema fora de `Lane B` conecta-se ao `satb-supervisor` por meio de um dos quatro formatos de adaptadores:

| Forma do adaptador | Sistemas-alvo | Contrato de execução e isolamento | Padrões reutilizados |
| :--- | :--- | :--- | :--- |
| **`Shape D` (controle `dnull`)** | Nulo determinístico (`N0` estritamente livre de modelo e `N1` cristalizado em desenvolvimento) sobre armazenamentos `mmap` `DNULLMM1` congelados | Executa dentro de `/work` sob as mesmas regras `TOOLS_v0` e `Verifier`, com **`0` chamadas a modelo proxy** no momento da decisão. | `POSIX mmap` / Win32 `MapViewOfFile`, laço de inteiros de 64 bits do `SPEC v0.4` |
| **`Shape M` (endpoint de modelo)** | Servidores locais de pesos abertos e `API`s em nuvem de código fechado | Executa o `satb-agent` da `Lane B` sobre `Chat Completions` ou `Messages`, com chamadas de ferramenta e `usage` obrigatório, roteado 100% via `satb-proxy`. | `API` compatível com OpenAI (`llama.cpp`, `mlx_lm`, `vLLM`); tradutores para `Anthropic`, `Gemini`, `xAI` |
| **`Shape H` (harness em caixa)** | `Claude Code`, `Codex CLI`, `Gemini CLI`, `OpenHands`, `Terminus-2` | Tarefa escrita em `/work/task/BUNDLE.md`. URL base apontada para `satb-proxy` (`127.0.0.1:<port>`); chaves reais de `API` retidas fora de `/work`; encerra via `submit` ou `refuse` do `MCP`; nenhuma outra saída de rede. | Variáveis de ambiente da ponte de sandbox do `Inspect`; `MCP` com `--strict-mcp-config`; `ACP` opcional |
| **`Shape I` (agente `Inspect`)** | Solvers existentes de benchmarks públicos do `Inspect` | Envolve o pacote de tarefa do `SATB` com as ferramentas `submit` e `refuse` com `attempts = 1`, roteando as chamadas de modelo através do `satb-proxy`. | Interface `Task` e `Solver` do `UK AISI Inspect` |

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
| **`C1` Ronda de ida e volta do pacote** | O adaptador ecoa o resumo `SHA-256` `JCS` exato do pacote de tarefa de entrada. |
| **`C2` Caminho de submissão** | O `Verifier` externo recebe a sequência exata de bytes registada na captura terminal de `satb-proxy` / `MCP`. |
| **`C3` Caminho de recusa** | Uma recusa instruída chega de forma limpa como `refuse` (`sub_reason = "other"`, `completion_score = 0`). |
| **`C4` Uma chamada terminal** | Quaisquer chamadas de ferramenta ou terminal emitidas após o primeiro `submit` ou `refuse` são ignoradas e contadas. |
| **`C5` Sem oráculo** | Os diretórios, soquetes e caminhos pai (`..`) de `Verifier` e `satb-supervisor` são inacessíveis a partir de `/work`. |
| **`C6` Egresso** | Apenas `satb-proxy` (`127.0.0.1:<port>`) é acessível para tráfego do modelo; subprocessos de `/work` têm acesso zero à rede externa e chaves `API` upstream zero. |
| **`C7` Uso presente** | Cada chamada de modelo transporta `usage` (`missing -> killed(usage_missing)`); os totais de tokens do proxy coincidem exatamente com as contagens do motor upstream. |
| **`C8` Impressão digital estável** | A impressão digital `SHA-256` de `SUT` de cinco blocos é idêntica antes e depois de uma execução seca de 3 tentativas. |
| **`C9` Reprodução do arcabouço** | A reprodução das respostas registadas de `satb-proxy` reproduz uma transcrição idêntica em bytes (`0` byte ou diferenças `CRLF`; obrigatório para `Lane B`). |
| **`C10` Caminho de eliminação** | A árvore de processos `/work` descontrolada (`grupo de processos POSIX` ou `Win32 Job Object`, incluindo processos filhos destacados) é colhida em `< 2.000 ms` e registada como `killed`. |
| **`C11` Aperto de mão de telemetria** | Os contadores de processo `L3` sem raiz (`cgroup v2`, `proc_pid_rusage` ou `Win32 GetProcessTimes`/`QueryProcessCycleTime`) são legíveis, os marcadores de fase chegam e o desvio entre relógio monotónico e de parede é registado. |
| **`C12` Sonda de determinismo** | São executados `8` pedidos idênticos e a contagem de saídas distintas é registada como uma propriedade empírica de `SUT`. |

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

| Nível | Fronteira física / lógica | Sensores representativos | O que o canal pode atribuir honestamente |
| :--- | :--- | :--- | :--- |
| **`L0` tomada** | `AC` na tomada de parede | Tomada inteligente ou `PDU` (`Shelly` `apower`, `aenergy`; analisador `Yokogawa`) | Máquina inteira, incluindo o calor de conversão da `PSU`, ventoinhas, `DRAM` e `NVMe`; cadência de `~1 s`. |
| **`L1` plataforma** | Trilho de entrada `DC` da placa | `Jetson Thor INA238` carrier; `Mac sys_power`; `RAPL psys` | Computador inteiro do lado `DC`, a jusante do adaptador de energia ou da `PSU`. |
| **`L2` pacote / SoC** | Pacote de `CPU`, `GPU` e trilhos do `SoC` | `RAPL pkg`; `macmon IOReport` sem privilégios de root; `Thor INA3221`; `amdgpu hwmon`; energia acumulada do `NVML` (`mJ`) | `SUT` inteiro no `SoC` (`A2`), ou apenas o mecanismo de inferência quando um trilho é fisicamente exclusivo (`A1`). |
| **`L3` processo / cgroup** | Árvore de processos do `OS` | `Linux cgroup v2` (`cpu.stat`, `memory.peak`, `io.stat`), `perf`; `macOS proc_pid_rusage` `ri_energy_nj`; Win32 `GetProcessTimes` + `QueryProcessCycleTime` | Parcelas de atividade de recursos (`C`), ou o modelo interno de energia por processo do próprio kernel do `OS` (`D`). |
| **`L4` lógico** | A conversa com o modelo/ferramenta | Contagens de tokens e latências de chamadas do `satb-proxy`; turnos do arcabouço, chamadas de ferramentas e elisões do `ContextRule_v0` | Contagens exatas em todo `SUT`, sem exceção, incluindo APIs em nuvem fechadas. |

Todo valor de energia em um recibo carrega um dos sete rótulos de atribuição:

- **`A1` (Trilho físico exclusivo)**: Um sensor de trilho de hardware acionado exclusivamente por uma partição durante a janela de medição (por exemplo, `Jetson Thor INA3221 ch1 VDD_GPU` quando apenas o motor de inferência local tem acesso ao dispositivo `GPU`).
- **`A2` (Limite dedicado de todo o sistema)**: Um contador de máquina inteira (`L0`/`L1`) ou de pacote completo (`L2`) em uma máquina dedicada em repouso (`SUT` mais camada ociosa do `OS`). **Conforme `OQ-4`, a energia bruta da janela de todo o `SUT` em `A2` é a métrica física primária para alocação**, impedindo que modelos leves deleguem buscas por força bruta não contabilizadas para subprocessos `/work` e impedindo a subtração `ativo - ocioso` de melhorar execuções lentas.
- **`B` (Divisão de fase temporal)**: Diferenças de contador entre janelas de tempo não sobrepostas delimitadas por marcadores de fase sequenciais (`model_call` vs. `tool_call` em `Lane B`).
- **`C` (Participação proporcional, o modelo `Kepler`)**: Um contador de hardware compartilhado particionado por $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ ou utilização de `GPU` quando processos paralelos se sobrepõem (`Lane O` `Shape H`).
- **`D` (Estimativa modelada pelo `OS`)**: O modelo interno de energia por processo do kernel (`macOS ri_energy_nj`). Isola uma árvore de processos dos co-inquilinos de `CPU`, mas permanece um modelo de firmware/kernel em vez de uma leitura física de derivação.
- **`P` (Atestado pelo provedor)**: Um número de energia de servidor por requisição devolvido por um provedor de nuvem junto com sua metodologia de medição literal.
- **`N` (`not_available`)**: Não observado e **nunca estimado**.

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Disciplina de contadores em sete etapas, coleta sem privilégios de root (`OQ-5`) e mapas de plataforma

`satb-meter` processa cada tentativa em sete passos ordenados:
1. **Ler contadores cumulativos em cada fronteira de evento** (`attempt.start`, cada `model_call` e `tool_call`, `attempt.close`, além de um tick de referência de `100 ms`), de modo que a energia de cada janela seja uma diferença exata de contadores $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$.
2. **Escrever primeiro os canais brutos**: registrar fronteira, sensor, leituras inicial e final, sobreposições (wraps) de contadores e número de amostras; marcar janelas menores que `10` períodos do sensor como `"below_resolution"` e hardware ausente como `"not_available"`.
3. **Dividir fases sequenciais (`B`)**: no `Lane B`, a inferência do modelo e as chamadas de ferramenta `/work` nunca se sobrepõem; harnesses paralelos `Lane O` reduzem as divisões de fase para `C` ou `N`.
4. **Isolar `engine_resident_during_tools`**: enquanto uma ferramenta `/work` executa, um servidor de modelo local (`llama-server`, `vLLM`) mantém os pesos residentes na `GPU`/`DRAM`. Seu consumo ocioso durante a janela da ferramenta é alocado em `engine_resident_during_tools` e não é atribuído nem à inferência ativa do modelo nem à execução da ferramenta.
5. **Dividir por proporção (`C`) somente onde as partições se sobrepõem**: aplicar razões de $\Delta \text{CPU}$ estritamente como alternativa de caracterização, reconhecendo que estados `C`, `DVFS` com turbo e paradas de `DRAM`/armazenamento violam a proporcionalidade.
6. **Armazenar linhas de base como canais derivados**: delimitar as sessões com linhas de base residentes pré e pós; se a potência ociosa pré/pós divergir além de `5.0%` (`Falsifier 6`), descartar os valores derivados de energia líquida acima do ocioso, mantendo intactos os canais brutos.
7. **Executar a verificação de soma (`Falsifier 2`)**: verificar se as componentes derivadas de fase somam de volta à diferença bruta do contador da tentativa dentro de um quantum do sensor (`1 mJ`); caso contrário, descartar a divisão derivada e reter apenas o canal bruto.

**Regra de coleta sem privilégios (`OQ-5`).** Os benchmarks nunca devem executar a orquestração do `SUT` como `root` ou carregar drivers personalizados de anel-0. No `macOS`, o `satb-meter` utiliza `macmon` sem privilégios (`assinatura IOReport`) e `libSystem` `proc_pid_rusage(RUSAGE_INFO_V6)`, nunca `sudo` ou `powermetrics`. No `Linux` (onde `/sys/class/powercap/intel-rapl` passou a ser exclusivo de `root` no kernel `5.10` após `PLATYPUS`), uma regra `udev` de administrador de uso único concede acesso de leitura a um grupo `satb-meter` dedicado que contém **apenas o `UID` do `satb-supervisor`**, garantindo que os processos da área isolada `/work` não possam realizar ataques de canal lateral a `RAPL` nem ler o seu próprio medidor de energia. No `Windows 11` (`NT 10.0.26300`), tokens de Utilizador Básico sem privilégios (`0x20000`) leem a energia cumulativa da `GPU` discreta (`mJ`) diretamente via `nvml.dll` (`nvmlDeviceGetTotalEnergyConsumption`) e os ciclos de processo `L3` via Win32 `QueryProcessCycleTime`, ao passo que o `MSR` `0x611` de `RAPL` da Intel requer um driver de kernel de anel-0 proibido por `OQ-5` e `HVCI` (colocando a energia do pacote de `CPU` do Windows estritamente em `"not_available"`, rótulo `N`):

| Plataforma alvo | Canais `L0` / `L1` de sistema inteiro | Canais de pacote / `SoC` `L2` | Canais de processo `L3` e lógicos `L4` | Status de verificação-chave |
| :--- | :--- | :--- | :--- | :--- |
| **Apple Silicon Mac** (`M5 Max` verificado) | `L0`: `Shelly` `PDU` (`not_available` se desconectado); `L1`: `macmon sys_power` (`reported_j`) | `macmon IOReport`: `chip_power`, `cpu_power`, `gpu_power`, `ane_power`, `ram_power` (`reported_j`) | `L3`: `proc_pid_rusage` `ri_energy_nj` (`D`), `ri_instructions`, `ri_diskio_*`; `L4`: `satb-proxy` | `L1`-`L4` sem privilégios de root verificados em execução real no `Apple M5 Max`; canal `L0` (tomada) pendente. |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`, `Linux x86-64` verificado) | `L0`: `Shelly` `PDU` (`not_available` se desconectado); `L1`: `cros_ec` (atributos de potência `0`) | `RAPL package-0` e `core` (`0440 root:energy` `udev`) `reported_j` + `amdgpu` `PPT` `power1_input` (`0444`; `energy1_input` ausente) | `L3`: `cgroup v2` / `getrusage` (parcelas de atividade `C`); `L4`: `satb-proxy` | Verificado em execução real (isolamento `0440 root:energy` `PLATYPUS`; `amdgpu PPT` `0444`). |
| **Intel Raptor Lake** (`Core i9-13900H`, `Linux x86-64` verificado) | `L0`: `not_available`; `L1`: `RAPL psys` (`intel-rapl:1/energy_uj`, `0444` `reported_j`) | `RAPL package-0`, `core` e `uncore` (`MSR` + `MMIO` `energy_uj`, `0444` `reported_j`) | `L3`: `cgroup v2` / `getrusage` (parcelas de atividade `C`); `L4`: `satb-proxy` | Verificado em execução real (resíduo de `0 µJ` no `Passo 7` entre `psys` `L1` e `package-0` `L2`). |
| **NVIDIA Jetson AGX Thor** (Tegra `Linux aarch64` verificado) | `L1`: `TI INA238` (`hwmon6` `VIN`, `0444` `measured_j`) + `INA3221 ch3 VIN_SYS_5V0` (`0444` `measured_j`) | `INA3221 ch1 VDD_GPU` (`0444` `measured_j`, `A1` quando exclusivo); `ch2 VDD_CPU_SOC_MSS` (`0444` `measured_j`); `NVML` (`unverified`) | `L3`: `cgroup v2` / `getrusage` (parcelas de atividade `C`); `L4`: `satb-proxy` | Verificado em execução real (`INA238` + `INA3221 ch1-ch3` `0444` sem privilégios de root); `NVML` da GPU pendente sob bloqueio de co-tenant. |
| **Windows 11 `x86-64` + `RTX` discreta** (`i7-1165G7` + `RTX 2060`, `NT 26300` verificado) | `L0`: `not_available`; `L1`: `WMI` `EMI` `PowerMeter` (`0` instâncias -> `not_available`) | `RTX 2060`: `nvml.dll` cumulativo em `mJ` sem privilégios de root (`reported_j`); `CPU` `RAPL` `MSR 0x611`: **`N` (`not_available` sem driver de anel 0)** | `L3`: Win32 `GetProcessTimes` + `QueryProcessCycleTime` (parcelas `C`; `SRUM` grosseiro de segundo plano do `OS` excluído); `L4`: `satb-proxy` | Verificado em execução real sob token `0x20000` de Usuário Básico (resíduo de `0 mJ` no `Passo 7`; encerramento por Job Object em `2.46 ms`). |
| **Nuvem fechada `API`** (`Anthropic`, `xAI`, `Cerebras`, `OpenAI`, `Google`) | `L0`-`L1` medidos apenas no cliente local (excluídos da inferência no servidor) | `L2` do servidor remoto: estritamente **`N` (`not_available`)** ou **`P`** por requisição (`OQ-6`) | `L3` local em `/work` (`D`/`C`) para ferramentas de sandbox; `L4`: **tokens**, chamadas e `USD` **exatos** do `satb-proxy` | Verificado em execução real nos provedores `Anthropic`, `Cerebras` e `xAI` via `satb-proxy`. |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 Oito armadilhas de medição de hardware e sete grandezas não atribuíveis

Medições de potência padrão falham sistematicamente em `SoC`s e `GPU`s modernos:

| Armadilha de telemetria de hardware | Mitigação no `SATB` |
| :--- | :--- |
| **A potência em repouso oscila com a temperatura do die, os ventiladores, o `DVFS` e o turbo** | Aguardar o resfriamento da `GPU` (`<= 1.5 W`), delimitar cada janela com linhas de base pré e pós, registrar a temperatura máxima da `GPU` e invalidar os joules líquidos derivados acima de `5.0%` de deriva (`Falsifier 6`). |
| **Ambiguidade entre o repouso de máquina fria e o repouso com pesos residentes** | Medir e rotular explicitamente ambos no `Step 6`, em vez de subtrair um deles silenciosamente. |
| **A subtração `Active - idle` favorece execuções lentas** | A energia bruta da janela do `SUT` inteiro (`A2`) permanece como a principal figura de posicionamento (`OQ-4`). |
| **Janelas inferiores a um período de amostragem são lidas como zero, negativas ou ruído de quantização** | Marcar qualquer janela menor que `10` períodos do sensor como `"below_resolution"` (por exemplo, `< 1.2 s` com `macmon` em `~8 Hz` ou `< 10 s` com tomada inteligente de `1 Hz`). |
| **Amostradores de telemetria de alta taxa consomem potência de `CPU` significativa** | Ler os contadores cumulativos nas fronteiras de eventos (`0.011 mW` em `0 Hz`) mais um tick de `100 ms`; registrar a linha de base `observer_only`. |
| **O medidor instantâneo de potência do `NVML` em `A100`/`H100` amostra apenas `~25%` do tempo de execução** | Ler o contador cumulativo `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) por meio de `FFI` em processo (`1.17 ms` na `RTX 2060` contra `43.88 ms` no subprocesso `nvidia-smi`), e nunca por consulta instantânea de `nvmlDeviceGetPowerUsage` (Chung et al.; Yang et al.). |
| **As execuções externas com medidor de parede `L0` operam em um relógio não sincronizado** | Emitir um pulso de carga de calibração determinístico com ciclo de `50%` em `session.open` e `session.close` e correlacionar cruzadamente os carimbos de tempo. |
| **Daemons de segundo plano do host compartilhado ou tarefas de co-locatários** | Registrar a lista de processos, rebaixar as subtrações derivadas `L2` em host compartilhado via `Falsifier 6` e registrar a energia `L3` `ri_energy_nj` (`D`) isolada de co-locatários junto com a `L2` bruta. |

Consequentemente, **sete quantidades não podem ser honestamente atribuídas** e estão barradas de alegações de `SATB`: (1) energia de servidor de `API` fechada não atestada (`N` ou `P` apenas); (2) joules físicos exatos por processo em um `SoC` compartilhado ou trilho de memória unificada (`C` e `D` são modelos); (3) pesos de modelo isolados de núcleos de serviço, quantização, agrupamento em lotes e silício; (4) propriedade do piso ocioso do `OS` e potência de pesos residentes em `DRAM` (reportados como canais autônomos); (5) eventos individuais mais curtos que o período do sensor (como uma chamada de ferramenta de `30 ms` sob uma tomada de `1 s`); (6) `VM`s de nuvem compartilhadas ou domínios de `CPU` do Windows sem privilégios que carecem de contadores de hardware em modo de usuário; e (7) trocas silenciosas de pesos de provedor em meio à sessão (sinalizadas por canários de início/fim, nunca descartadas a priori). Em particular (`OQ-6`), **as divulgações de sustentabilidade do provedor são medianas de frota em vez de medições por solicitação e nunca entram em um recibo de `SATB`**, incluindo a mediana de `0.24 Wh` do Google para prompts de `Gemini Apps`, o valor de `0.34 Wh` da OpenAI (publicado sem metodologia) e o `1.14 gCO2e` da Mistral por resposta de `400` tokens.

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. Resultados de Conformidade Medida, Determinismo, Efeito de Observador e Atribuição Multi-Hospedeiro

Para substituir suposições de design não medidas por recibos auditáveis, executamos a suíte completa de conformidade `SATB` e o harness de falsificação (`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`, tempo total de execução `175.69 s`) em uma estação de trabalho `Apple M5 Max` (`arm64`, `128 GB` de memória unificada, `macOS 27.2.1`, `macmon 0.12.0`), juntamente com uma auditoria cruzada de estudo de `188` janelas e execuções ao vivo multi-silício cruzadas entre `Linux` e `Windows 11`.

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

<div id="66-multi-platform-hardware-attribution-across-five-silicon-and-os-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 Atribuição de hardware multiplataforma em cinco arquétipos de silício e sistema operacional

Para verificar que a conformidade com `SATB`, a determinismo de ponto fixo do `Shape D`, os limites de permissão sem privilégios de `PLATYPUS` / `HVCI` e a atribuição física por shunt ou acumulativa via `NVML` se mantêm em `macOS`, `Linux` e `Windows 11`, executamos `run_multi_host_satb.py` (`multi_host_satb_receipts.json`) e `run_windows_suite.py` (`windows_satb_receipts.json`) em quatro arquétipos adicionais de hardware `Linux` e `Windows 11`, juntamente com `Apple M5 Max`:

| Arquétipo de hardware e kernel do `OS` | Limite de sensor sem privilégios e classe de evidência | `Shape D` `1M` `DNULLMM1` (`10k` sondagens) | Média de `C9` replay e `C10` tree-kill | Latência de leitura única e `100 Hz` alcançado | Resíduo do `Step 7` e `Falsifier 3` (`C` vs. `B`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`** (`arm64`, `128 GB`, `macOS 27.2.1`) | `IOReport` `L1`/`L2` + `rusage` `L3` (`reported_j`; `measured_j = None`) | `15027705736` (`388.43 ns` `C++`, `582.57 ns` Rust) | `149,747 B` (`0` diferenças) · `2.073 ms` (`0` `PID`s) | `~120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`** Fase 2 (`+35.86%` Fase 1) |
| **`NVIDIA Jetson AGX Thor`** (`aarch64`, `122.9 GiB`, `Linux 6.8.12-1021-tegra`) | `TI INA238` (`hwmon6` `VIN` `L1`) + `INA3221` (`hwmon5` `ch1-ch3` `L2`/`L1`, `0444` **`measured_j`**) | `15027705736` (`984.86 ns` `C -O3`, `2,489.4 ns` Py) | `149,747 B` (`0` diferenças) · `9.544 ms` (`0` `PID`s) | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2` (`-67.02%` `VIN`) |
| **`Framework AMD Ryzen AI Max+ 395`** (`x86-64`, `122.8 GiB`, `Linux 7.0.0-43`) | `RAPL package-0` e `core` (`0440 root:energy` **`reported_j`**) + `amdgpu PPT` (`0444`; `measured_j = None`) | `15027705736` (`376.61 ns` `C -O3`, `1,341.7 ns` Py) | `149,747 B` (`0` diferenças) · `0.868 ms` (`0` `PID`s) | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0` (`-63.34%` `core`) |
| **`Intel Core i9-13900H`** (`x86-64`, `14.7 GiB`, `Linux 7.0.0-43`) | `RAPL psys` (`L1`) + `package-0`, `core`, `uncore` (`L2`, `0444` **`reported_j`**; `measured_j = None`) | `15027705736` (`420.93 ns` `C -O3`, `863.6 ns` Py) | `149,747 B` (`0` diferenças) · `1.120 ms` (`0` `PID`s) | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0` (`-73.62%` `psys`) |
| **`Intel Core i7-1165G7 + RTX 2060`** (`x86-64`, `63.7 GiB`, `Windows 11 26300`) | `nvml.dll` `RTX 2060` acumulativo em `mJ` (`L2` **`reported_j`**) + Win32 `L3`; `CPU RAPL` = `N` (`measured_j = None`) | `15027705736` (`1,474.22 ns` `MSVC /O2`, `2,885.6 ns` Py) | `149,747 B` (`0` `CRLF`) · `2.458 ms` JobObj (`0` `PID`s) | `1,174.2 µs` `NVML` · **`64.64 Hz`** (tick `NT`) | `0 mJ` · **`-89.88%`** tempo (`-77.05%` `RDTSC`) |

Cinco achados multiplataforma de hardware e sistema operacional emergem desses recibos ao vivo:

1. **Invariância de replay bit a bit de `Shape D` e `Lane B` em `macOS`, `Linux` e `Windows 11` (`arm64`/`aarch64` e `x86-64`)**: Todos os cinco hosts, incluindo Win32 `CreateFileMappingA` + `MapViewOfFile` compilado com `MSVC 19.44 /O2` e E/S de arquivo `NTFS` no `Windows 11` (`NT 10.0.26300`), produziram o checksum exato de `10.000` sondagens `DNULLMM1`, **`15027705736`**, o digest congelado exato de `test.setpoint`, `0da4df8d9ccbce1e...4485781`, e a transcrição `C9` exata de `149.747` bytes (`SHA-256` `d697ed1476129939...`, com **`0` bytes de desvio `CRLF` no `NTFS`**). Ao mesmo tempo, encerraram árvores de processos descontroladas de `4`-`PID` em `0,868 ms` a `9,544 ms` por meio de primitivas do kernel (`SIGKILL` em `macOS`/`Linux` e Win32 `TerminateJobObject`, com **média de `2,458 ms` no `Windows 11`**, **`50,0×` mais rápido** que a criação de `taskkill.exe /F /T /PID`, com média de `122,817 ms`, e `> 200×` abaixo do teto de especificação de `2.000 ms`).

2. **Separação de shunts físicos `INA238` / `INA3221` e `Falsificador 6` sob co-residência ativa de `GPU` no `NVIDIA Jetson AGX Thor`**: No `Linux 6.8.12-1021-tegra`, tanto `hwmon6` (`ti,ina238` em `i2c@c600000/ina238@44`, entrada `VIN` de toda a placa `DC` em `~27,97 V`) quanto os três canais de `hwmon5` (`ina3221@40`: `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS` e `ch3 VIN_SYS_5V0`) são legíveis por todos (`0444`) sem `sudo`. Durante nossa sondagem estritamente somente `CPU` (`dedicated_host = false`), um `llama-server` co-residente independente manteve o bloqueio da `GPU` do host:

| `Jetson AGX Thor` canal físico de shunt (`sysfs` `0444` sem `root`) | Fronteira | Linha de base prévia (`W`) | Fase 1 Computação (`measured_j` / `W`) | Fase 2 `DRAM+fsync` (`measured_j` / `W`) | Linha de base posterior (`W`) | Deriva (`F6`) e erro da Fase 2 de `Kepler` `C` |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`** (entrada do módulo + placa portadora) | **`L1`** | `100,70 W` | `122,12 J` (`101,66 W`) | `99,02 J` (`81,94 W`) | `97,21 W` | `3,47%` (`A2` retido: co-residente) · **`-67,02%`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`** (`LLM` co-residente) | **`L2`** | `29,26 W` | `40,29 J` (`33,54 W`) | `26,00 J` (`21,52 W`) | `28,13 W` | Co-residente externo da `GPU` (oscilação de `-36,1%` em `F5`) |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36,68 W` | `45,73 J` (`38,07 W`) | `44,37 J` (`36,71 W`) | `36,08 W` | `1,64%` (domínio `CPU`/`SoC`/`MSS`) · **`-70,01%`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`** (trilho de `5,08 V`) | **`L1`** | `14,89 W` | `18,66 J` (`15,53 W`) | `16,82 J` (`13,92 W`) | `13,98 W` | **`6,13% > 5,0%` (`F6` acionado)** · **`-68,85%`** |

Através das quatro janelas de cadência do `Falsifier 5`, solicitações de co-inquilino `LLM` flutuantes deslocaram o `ch1 VDD_GPU` de `35.36 J` para baixo até `22.60 J` (`-36.1%`), puxando o `INA238 VIN` (`L1`) de placa inteira de `107.48 J` para baixo até `81.73 J` (`-24.0%`) mesmo enquanto o `ch2 VDD_CPU_SOC_MSS` permaneceu dentro de `35.76-39.31 J`. Porque `dedicated_host = false` (e o `ch3 VIN_SYS_5V0` excedeu a deriva de `5.0%` em `6.13%`), o `SATB` retém as afirmações de colocação de rede `A2` de `SUT` inteiro enquanto preserva os `measured_j` exatos separados por trilho (os canais `L1` e `L2` nunca foram somados).

3. **Isolamento `PLATYPUS` `0440 root:energy` e verificação de domínio `Strix Halo` `APU` em `Framework` `AMD`**: No `Framework` Desktop (`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`, `Linux 7.0.0-43-generic`), a regra `udev` `90-energy-read.rules` define `/sys/class/powercap/intel-rapl:0/energy_uj` (`package-0`) e `intel-rapl:0:0/energy_uj` (`core`) para o modo **`0440` (`root:energy`, `world_readable = false`)**: os `UID`s de sandbox `/work` não agrupados recebem `EACCES` (bloqueando canais laterais `PLATYPUS`), enquanto o `GID` supervisor (`energy`) lê microjoules cumulativos sem raiz em latência mediana de `24.34 µs` (`0 µJ` resíduo da Etapa 7). A inspeção adicional de `hwmon9` (`amdgpu`) resolveu um detalhe de especificação aberto: o `Radeon 8060S` integrado do `Strix Halo` expõe `PPT` de potência legível pelo mundo (`0444`) (`power1_input` / `power1_average` em `µW`, `75.38 W` Fase 1 / `69.72 W` Fase 2) em vez de um contador separado `energy1_input`, enquanto o `cros_ec` (`hwmon8`) expõe apenas ventiladores e térmicos de placa.

4. **Limite sem raiz bare-metal `Windows 11` (`0x20000` Usuário Básico `NVML` versus bloco `RAPL` ring-0) e aliasing de tique de relógio `NT` de `15.625 ms`**: Sob um token de Usuário Básico explicitamente deselevado (`runas.exe /trustlevel:0x20000`, `IsUserAnAdmin() == false`) no `Windows 11 Pro` (`NT 10.0.26300`, `Intel Core i7-1165G7` + `NVIDIA GeForce RTX 2060`), chamadas `FFI` no processo para `nvml.dll` `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) e `nvmlDeviceGetPowerUsage` (`mW`) sucedem sem raiz em **`1,174.15 µs` mediano** (**`37.4×` mais rápido** do que gerar `nvidia-smi.exe` em `43.88 ms` por chamada), limpando a Etapa 7 com resíduo de **`0 mJ`** (`8.769 J + 8.816 J = 17.585 J`, deriva pré/pós de `3.0%`). Em contraste, leituras em modo de usuário sem privilégios de Intel `RAPL` `MSR 0x611` são bloqueadas pelo kernel `Windows NT` sem um driver ring-0 assinado (barrado por `OQ-5` e `HVCI`), e o `WMI` `EMI` (`\\.\EnergyMeter` / `Win32_PerfRawData_Counters_PowerMeter`) expõe `0` instâncias, colocando o pacote `CPU` `L2` do Windows estritamente em `Label N` (`"not_available"`). Além disso, porque as atualizações não ajustadas do `Windows NT` atualizam `GetProcessTimes` em interrupções de relógio de `~15.625 ms`, os surtos de `8 ms` de sleep-plus-`FlushFileBuffers` na Fase 2 foram aliasados para baixo até `62.5 ms` (participação de `CPU` de `5.06%` versus `1,171.9 ms` na Fase 1), causando que a atribuição `Kepler` `C` errasse em **`-89.88%`** (`-77.05%` mesmo ao usar ciclos sub-tique `RDTSC` `QueryProcessCycleTime` em participação de `11.48%`).

5. **Física da cadência do barramento do sensor e do temporizador do `OS` em todas as cinco plataformas**: Enquanto leituras do `sysfs` `powercap` do Linux `x86-64` são concluídas em `24.34-45.37 µs` (`94.28-97.12 Hz` obtidas a `100 Hz`), o quantum de sono padrão de `15.625 ms` do `Windows NT` limita loops não ajustados de `NVML` a **`64.64 Hz`** enquanto entrega **`9.45 Hz`** de forma limpa no tick de referência de `100 ms` (`10 Hz`) do `SATB`, correspondendo ao teto de `66.55 Hz` do `I2C` do `Jetson AGX Thor` (`9.49 Hz` a `100 ms` de referência) e contrastando com o teto de `7.44 Hz` do `IOReport` do `macmon`. Em **`5 / 5` silício e arquiteturas de `OS`**, a divisão proporcional ao `CPU` (`C`) subcreditou a fase `DRAM` de `192 MiB` + sincronização de disco em **`32.59%` a `89.88%`**, confirmando universalmente por que o `SATB` restringe `C` a execuções paralelas sobrepostas.

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. Verificação em hardware aberto e limitações

| Falsificador de sessão | Consequência quando acionado | Status empírico neste estudo |
| :--- | :--- | :--- |
| **`F1` Divergência no replay (`C9`)** | Arcabouço de referência é não determinístico | **Descartado em `5/5` hosts (`0` diferenças de byte/`CRLF` em `149.747 B`, `14` turnos)** |
| **`F2` Verificação de soma falha em `> 5%` das tentativas** | Divisão de atribuição quebrada no host | **Descartado em `5/5` hosts (`0 µJ` Linux; `0 mJ` Win11 `NVML`; `<= 1 µJ` `M5 Max`)** |
| **`F3` `B` e `C` divergem em `> 20%` sequencialmente** | `C` (`Kepler`) marcado como não confiável no host | **Acionado em `5/5` hosts (erro de `32,59%-89,88%`); `C` restrito** |
| **`F4` Carga de pulso conhecida fora da precisão do sensor** | Sensor rebaixado para a sessão | **Aberto (rig de pulso de sincronização `L0` com tomada inteligente ainda não acoplado)** |
| **`F5` Janelas de `10 ms` vs. `1 s` deslocam a energia da janela** | Efeito de observador na telemetria | **Descartado (delta de `0,76%` na `L2` do `M5 Max`; `9,45-10,48 Hz` alcançados com referência de `100 ms`)** |
| **`F6` Linhas de base residentes pré/pós derivam `> 5,0%`** | Canais líquidos derivados invalidados | **Ativo (`124/188` janelas do `M5 Max` e derivas de co-locatário no Linux controladas de forma limpa)** |
| **`F7` Adaptador passa em `C1`-`C12`, falha no canário** | Conformidade insuficiente; sessão `void` | **Verificado em simulação (`session_void = true` na troca)** |
| **`F8` `Lane B` fica abaixo de arcabouços `Lane O` fortes** | `Lane B` reportada estritamente como piso | **Descartado (paridade de `24/24` e `6/6` vs. `Claude Code 2.1.330`)** |

1. **Sessões dedicadas e quiescentes `A2` e calibração de tomada `AC` `L0`:** Embora os trilhos `measured_j` dos shunts físicos `TI INA238` (`L1`) e `INA3221` (`L2`/`L1`) já estejam verificados em operação no `NVIDIA Jetson AGX Thor`, junto com contadores `reported_j` sem privilégios de root no `Apple M5 Max`, no `Framework AMD Strix Halo`, no `Intel Raptor Lake` e no `Windows 11` (`RTX 2060` via `NVML`), todas as cinco máquinas de bancada executaram serviços compartilhados ou cargas de outros locatários (`dedicated_host = false`). Por isso, as alegações de posicionamento `A2` para o `SUT` inteiro estão retidas. O próximo passo é conectar um medidor `AC` `L0` de tomada com pulso de sincronização (`Shelly` / `Yokogawa`) em um host dedicado e quiescente.

2. **Verificação do contador `NVML` da `GPU` integrada no `Jetson AGX Thor`:** Enquanto o contador cumulativo de energia `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) de `GPU` discreta já foi verificado sem privilégios de root via `nvml.dll` na `NVIDIA GeForce RTX 2060` (`Windows 11`), a sondagem da energia cumulativa do `NVML` na `GPU` Tegra unificada do `Jetson AGX Thor`, juntamente com o shunt `INA3221 ch1 VDD_GPU` `0444`, já verificado, aguarda uma janela ociosa em que a trava compartilhada da `GPU` esteja livre.

3. **Lista ativa ampliada de `Shape H` e `Shape I`:** As execuções ativas com harness externo deste estudo exercitaram o `Shape H` no `Claude Code 2.1.330`, em conjunto com `Lane B` e `Shape D`. A próxima etapa é executar a certificação ativa `C1-C12` no `Codex CLI`, no `OpenHands`, no `Terminus-2` e nos solvers `Inspect` do `Shape I`.

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
