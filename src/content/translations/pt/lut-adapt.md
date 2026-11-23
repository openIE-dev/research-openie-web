---
title: "Compilação descendente em LUT6 numa cascata Mixture of Limits: malhas booleanas roteadas por Beneš, portas de ativação conformais e streaming de camadas NVMe de 4 bits"
deck: "Uma cascata Mixture of Limits com 27 teoremas Lean 4.36.0 verificados por seis kernels (con-leche e con-ron --verified, zero sorry, endurecida contra Common Vulnerabilities and Exposures (CVE)-2026-72844) que tenta primeiro circuitos paginados de tabela de consulta de 6 entradas (LUT6) com zero operações de ponto flutuante (FLOP) (0.154 milissegundos em Rust mol-agent-rs de binário único), escala através de modelos híbridos e esparsos Mixture-of-Experts (MoE) de 4 bits por Non-Volatile Memory Express (NVMe) de final de 2026 com até 120B parâmetros (12B ativos) apenas em caso de falha, controla os commits por meio de verificadores determinísticos em 4 repositórios upstream Verified de engenharia de software e compila ativações certificadas de forma descendente em Block RAM de 36 Kbits (RAMB36E2) roteada por Beneš com clock-enable controlado e em páginas canônicas de habilidades. Tempos de relógio de parede, contagens de bytes sem buffer no Darwin F_NOCACHE (leitura de arquivo sem buffer), memória de acesso aleatório ativa (RAM reduzida até 970.0 megabytes em 34.66B e 58.08 gigabytes de Memória Unificada residente a 22.17 tokens por segundo em 120B-A12B), contadores de energia on-chip de canal duplo do Apple M5 Max (reported_j), estimativas analíticas de energia (est_j) e simulações em nível de transferência entre registradores (RTL) Yosys/Verilator para xck26 (núcleo em pipeline de 4 estágios, 13 níveis e 250 megahertz com redução de 4.10x na potência ociosa controlada por clock) são reportados a partir de openIE-dev/lut-adapt-ai no commit 86d0ab5; nenhuma potência de trilho de placa isolada foi medida (measured_j não definido)."
lang: "pt"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*Revisão ff18890, 23 de novembro de 2026. Implementação de referência e artefatos: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) em [`86d0ab5299c03a537639762ea2f430d7da358f26`](https://github.com/openIE-dev/lut-adapt-ai/tree/86d0ab5299c03a537639762ea2f430d7da358f26). Resumo dos dados: [/data/#lut-adapt](/data/#lut-adapt). PDF LaTeX: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([fonte](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Visão geral

Este estudo examina como um sistema computacional pode compilar, em direção descendente, o trabalho repetido de modelos neurais em buscas rápidas em tabelas booleanas e em habilidades canônicas certificadas, sem perder a paridade exata das saídas e sem promover palpites não verificados a regras confiáveis. São relatadas medições de software e de entrada/saída não bufferizada, simulações de síntese em nível de transferência entre registradores e de ciclos, leituras de contadores de energia em dois canais (do sistema operacional / on-chip) em Apple M5 Max e em contadores Linux Running Average Power Limit (`reported_j`), além de estimativas analíticas de energia rotuladas (`est_j`). Nenhum medidor de energia de parede ou de trilho foi conectado neste repositório (`measured_j` não definido; `board_metered` falso).

**Em termos simples**

1. A maioria das entradas que um sistema implantado vê repete padrões que ele já resolveu, de modo que executar uma rede neural de ponto flutuante completa em cada passo desperdiça computação e largura de banda de memória.
2. A referência coloca uma camada reconfigurável de tabela-verdade de 6 entradas (`LUT6`) à frente de modelos de espaço de estados em streaming e de modelos de fundação, e compila as respostas para baixo em páginas de memória de consulta apenas após uma verificação explícita as certificar.
3. Quando modelos de linguagem híbridos e de mistura esparsa de especialistas de final de 2026 com até `120B` parâmetros (`12B` ativos) são executados localmente em Apple Silicon através de shaders Apple Metal fundidos personalizados, shaders portáteis em Rust `Burn 0.22.1 / CubeCL` e `mol-agent-rs` em Rust de binário único (`0.154` milissegundos por consulta de habilidade), leituras de especialistas esparsos por roteador combinadas com esse esboçador `LUT6` de zero FLOP reduzem as leituras de disco em até `12.30×` no `Qwen/Qwen3.6-35B-A3B` (`970.0` megabytes de memória ativa de pesos) e sustentam `22.17` tokens por segundo no `nvidia/Nemotron-3-Super-120B-A12B` dentro de `58.08` gigabytes de Memória Unificada; controlar commits de código e de repositório atrás de verificações determinísticas `unittest` e `pytest` alcança **`91.67%` de taxa de aprovação verificada (`93.75%` na Onda 2 e na Onda 3)** no comparativo algorítmico de `48` tarefas, **`90.62%` (`93.75%` nas paráfrases humanas da Onda 2)** no `BigCodeBench v0.1.3` oficial, **`50.00%`** em git worktrees de repositório único `SymPy`, **`20.83%` (`2.50×` modelos autônomos de `24B` e `35B`)** em `4` repositórios upstream Verified de `princeton-nlp` (`django`, `pytest`, `requests` e `sympy`), e **`62.50%`** na suíte de fronteira difícil de `120B` com **`0.00%` de commits quebrados admitidos**.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termos, acrônimos e rótulos de medição

<ul id="terms">
<li>MoL: Mixture of Limits, a regra de cascata das Portas de Commit Medidas Parte II [mesma casa]</li>
<li>LA: prefixo de afirmação e de falsificador (LA-1 a LA-23, LA-F1 a LA-F23) utilizado neste estudo</li>
<li>LUT, LUT6, INIT: tabela de consulta, primitivo booleano Xilinx UltraScale+ de 6 entradas e sua máscara de inicialização de tabela-verdade de 64 bits</li>
<li>BRAM, RAMB36E2, URAM: Block RAM, o primitivo Block RAM UltraScale+ de porta dupla de 36 Kbit (144 em xck26) e UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: bloco de lógica configurável, flip-flop, fatia de processamento de sinal digital, e placa AMD Kria KV260 (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: matriz de portas programáveis em campo, circuito integrado de aplicação específica, nível de transferência de registradores, ciclos por consulta, colocação e roteamento, folga negativa pior e conferência Field-Programmable Logic</li>
<li>AXI, AXIS, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU, SMC, L2, L3: Advanced eXtensible Interface (interface extensível avançada), prefixo de wrapper AXI4-Stream, sistema de processamento Zynq, lógica programável, system-on-module, circuito integrado monitor de potência embarcado, trilho de alimentação, Intel Running Average Power Limit (limite médio de potência em execução da Intel), NVIDIA Management Library, unidade de gerenciamento de energia do macOS, Apple System Management Controller, contador de energia de subsistema de nível 2 (Apple IOReport GPU Energy) e contador de energia de CPU por processo de nível 3 (Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj)</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: Dualidade de Espaço de Estados, modelo de espaço de estados, múltiplas entradas múltiplas saídas, incorporação posicional rotacional, unidade de ativação linear com portão, atenção de consulta agrupada, cache de chave-valor, codificação por pares de bytes, modelo(s) de linguagem grande(s), Mixture-of-Experts, perceptron multicamadas e gramática livre de contexto</li>
<li>HC, SOINN, WNN, DWN: Rede Neural Incremental Auto-Organizada de contexto hierárquico, rede neural sem peso e Rede Neural Sem Peso Diferenciável</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: Arquitetura Preditiva de Incorporação Conjunta, Modelo de Raciocínio Baseado em Energia, Inferência Conformal Adaptativa, fora da distribuição, área sob a característica de operação do receptor, probabilidade softmax máxima e Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF: Decodificação por Consulta de Prompt, Decodificação Especulativa Baseada em Recuperação, Algoritmo de Extrapolação para Maior Eficiência de Modelos de Linguagem, Liquid Foundation Model 2.5 (LFM2.5-350M e LFM2.5-8B-A1B), Liquid Foundation Model 3 (Oct 2026 LiquidAI/LFM3-1.7B) e HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR: decomposição em valores singulares, rotação de hipercubo de Procrustes por Quantização Iterativa, decomposição independente de sinal-valor, treinamento consciente de quantização, quantização pós-treinamento, perplexidade e razão sinal-ruído</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, RSS, GGUF, IO, KB, MB, GB, GiB: armazenamento Non-Volatile Memory Express, flag de arquivo sem buffer do Darwin F_NOCACHE, Portable Operating System Interface, memória de acesso aleatório, RAM dinâmica, RAM estática, tamanho do conjunto residente na Memória Unificada física, arquivo de modelo quantizado no formato GPT-Generated Unified Format, entrada/saída, quilobyte, megabyte, gigabyte e gibibyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, BF16, FP16, FP32, INT4, ULP, MSL, MPS, CUDA, ROC, SPIR, PTX, HIP, LLVM: operação(ões) de ponto flutuante, milhão de FLOPs, operação(ões) de multiplicação e acumulação, instrução única com múltiplos dados, diferenciação automática, diferença finita, bits por byte, brain float 16, ponto flutuante IEEE de 16/32 bits, inteiro de 4 bits, unidade no último lugar, Apple Metal Shading Language, PyTorch Metal Performance Shaders, NVIDIA Compute Unified Device Architecture, runtime AMD ROCm, Standard Portable Intermediate Representation (Vulkan SPIR-V), Parallel Thread Execution, Heterogeneous-Compute Interface for Portability e backend de compilador Low Level Virtual Machine</li>
<li>RCE, WCA, VC, BCB, SWE, OSA, DP: Reality Code Engine [mesma casa], Wise Computer Automation [mesma casa], conclusão verificada, benchmark BigCodeBench v0.1.3, prefixo de benchmark de engenharia de software, alinhamento ótimo de strings e programação dinâmica</li>
<li>CLI, HTTP, GET, POST, SSE, API, MCP, RPC, IDE, SDK, CORS, URL, ORM, IDNA, CADE, LNCS, NVIDIA, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW, TDP: interface de linha de comando, Protocolo de Transferência de Hipertexto e seus métodos de requisição GET/POST, Server-Sent Events, interface de programação de aplicações, Model Context Protocol, chamada de procedimento remoto (JSON-RPC 2.0), ambiente de desenvolvimento integrado, kit de desenvolvimento de software, Compartilhamento de Recursos entre Origens Diferentes, Uniform Resource Locator, mapeador objeto-relacional, Internationalized Domain Names in Applications, Conference on Automated Deduction, Lecture Notes in Computer Science, NVIDIA Corporation, venues acadêmicos de ciência da computação e engenharia, sistema operacional, unidade central/gráfica de processamento, software e potência térmica de projeto</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XOR, XNOR, JWT, HMAC, DAG, CIDR, LRU, TTL, WAL, ETL: rede local virtual (IEEE 802.1Q), Segurança da Camada de Transporte, inspeção profunda de pacotes, árvore de sintaxe abstrata, Notação de Objetos JavaScript, valores separados por vírgula, Algoritmo de Hash Seguro, verificação de redundância cíclica, Modo de Transferência Assíncrono (CRC-8/ATM), Requisição de Comentários, Linguagem de Consulta Estruturada, codificação DWARF de inteiros com sinal em little-endian de base 128, memória endereçável por conteúdo, OU exclusivo, NOR exclusivo, Token Web JSON, código de autenticação de mensagem baseado em hash, grafo acíclico dirigido, Roteamento Interdomínio Sem Classes, cache de uso menos recente, expiração por tempo de vida, log de escrita antecipada e pipeline de extração, transformação e carga</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, CARRY8, DSP48E2, URAM288, VCCINT, DS925, VCD, SDP, CE, ENARDEN, XPE, CLAI, AMD: Grupo de Ação de Teste Conjunto porta de depuração, depurador de ferramenta de linha de comando de software da Xilinx, Porta de Acesso de Depuração, Barramento Serial Universal, Future Technology Devices International e o seu circuito integrado ponte FT2232C de dupla UART/FIFO, receptor-transmissor assíncrono universal, memória intermédia primeiro-a-entrar primeiro-a-sair, circuito integrado, automação de projeto eletrónico, modo de síntese fora de contexto, Arquitetura de Barramento de Microcontrolador Avançado, interligação AXI4-Lite/AXI4-Stream, bloco de entrada/saída, memórias intermédias de entrada/saída, flip-flops D síncronos com reset/set, tabelas de consulta UltraScale+ de 1 a 5 entradas, multiplexadores UltraScale+ de 7/8 entradas, cadeias de transporte rápido de 4/8 bits, fatia DSP UltraScale+, UltraRAM de 288 Kbit, trilho de alimentação interna do núcleo (0,72 V em -2LV), folha de características de comutação DC e AC AMD Zynq UltraScale+ DS925, traço de forma de onda de despejo de alteração de valor, modo de RAM de bloco de porta dupla simples, ativação de relógio síncrono, pino de leitura/ativação de relógio da porta A do RAMB36E2, Estimador de Potência da Xilinx, identificador mágico de registo de subsistema («CLAI») e Advanced Micro Devices</li>
<li>CVE, CWE, FRO, GMP, RAG, WHNF, ZFC, CIC, FFI: Common Vulnerabilities and Exposures, Common Weakness Enumeration, Lean Focused Research Organization, Biblioteca Aritmética de Múltipla Precisão GNU (GNU Multiple Precision Arithmetic Library), Geração Aumentada por Recuperação (Retrieval-Augmented Generation), forma normal de cabeça fraca (weak head normal form), teoria dos conjuntos de Zermelo-Fraenkel com Escolha, Cálculo de Construções Indutivas e interface de função estrangeira</li>
</ul>

Quatro classes de evidência permanecem separadas em todas as tabelas abaixo:

| Rótulo da Evidência | Significado neste estudo |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Contagens exatas de bytes lidos ou escritos via `os.pread` sob Darwin `F_NOCACHE`, alocações de memória residente, segundos de relógio de parede, PMU de máquina inteira macOS (`AppleSmartBattery.PowerTelemetryData`) deltas de energia cumulativos no Apple M5 Max, e concordância exata de bits/token. `measured_j` está indefinido (`None`). |
| **`Reported (OS / On-Chip Counter, reported_j)`** | Contadores de telemetria do sistema operacional e on-chip não privilegiados: no Apple M5 Max (`joule_meter.py`), `libIOReport.dylib` de canal duplo "Energy Model" 'GPU Energy' (`L2` com resolução de nanosegundo `nJ`) mais `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3` por processo CPU `nJ`); em Linux `x86-64` (na auditoria de síntese EDA `xck26` abaixo), joules `RAPL` `package-0`. Nunca combinados com `measured_j` (`None`). |
| **`Simulated (RTL)`** | Contagens da netlist estrutural do Yosys `0.71+` (`synth_xilinx -family xcup` direcionado ao Kria KV260 `xck26`) e contagens de ciclos (`CPI = 1`) do Verilator `5.054`. Não inclui fechamento de tempo Vivado nem potência da placa (`board_metered = false`). |
| **`Estimated (est_j)`** | Joules analíticos calculados a partir de contagens de operações, substitutos de tempo de potência de projeto térmico (`joule_meter.py`), ou atividade de comutação de taxa de toggle VCD do Verilator emparelhada com lógica AMD `DS925` `xck26-2LV` (`0.72 V`) e limites de capacitância `RAMB36E2` (§4.22, §4.25). Comparável apenas entre ramos dentro da mesma fórmula; nunca watts de silício. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Contexto arquitetural e contribuições

Em [Portas de Commit Medidas](/papers/gates/) `[same house]`, a Parte II define **Mixture of Limits**: experimentar engrenagens por ordem decrescente de probabilidade de passagem por joule $p_i / c_i$ (Simon e Kadane, 1975), parar assim que o predicado de conclusão da tarefa $C(z) = 1$ se verificar, e proibir o reforço da saída `ModelGenerated` em `Deterministic`. Um escalão de Lookup estático, no entanto, cobre apenas as entradas escritas nele antes da implantação. Por outro lado, as redes neuronais de tabela de consulta existentes, LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022) e Differentiable Weightless Neural Networks (Bacellar et al., 2024), fixam a conectividade dos fios no interior do encaminhamento estático de FPGA, exigindo colocação e encaminhamento do fabricante sempre que a distribuição de entrada se altera.

A referência `lut-adapt-ai` fecha o ciclo entre o topo e o fundo da cascata através de **compilação descendente online de `LUT6`**:

- **Degrau 0 (Consulta, Beneš paginada + `LUT6`)**: Avalia máscaras de tabela-verdade de 64 bits roteadas por um comutador multicast não bloqueante Beneš-Copy-Beneš de $512 \times 512$ e armazenadas em cache em $81 \times \texttt{RAMB36E2}$ de memórias de bloco de porta dupla (`0` operações de ponto flutuante, troca de página em um único ciclo na simulação Verilator).
- **Degrau 1 (Fluxo, Dualidade de Espaço de Estados Complexo MIMO do `Mamba-3`)**: Trata as falhas que dependem do histórico da sequência por meio de um estado recorrente de tamanho constante $O(1)$ (`48 KB` fixados na memória no modelo de referência de `14.3M` parâmetros), evitando o crescimento $O(L)$ do cache de chaves e valores.
- **Degrau 2 (Topologia, `HC-SOINN`)**: Mantém uma topologia online de protótipos sobre embeddings latentes, isolando fronteiras de regime e acionando um disjuntor (`Refuse` / escalar) quando surge um deslocamento de distribuição sem rótulos.
- **Degrau 3 (Modelo por último, `JEPA-EBRM`, `AirMoL` e `Expert-AirMoL` com streaming NVMe de 4 bits fundido em Metal)**: Invoca a verificação por energia latente ou transmite modelos fundacionais pré-treinados híbridos e MoE esparsos do final de 2026 (`LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it`, `LiquidAI/LFM2.5-8B-A1B` e `Qwen/Qwen3.6-35B-A3B`, junto com `LiquidAI/LFM2.5-350M` e `Qwen/Qwen3.5-0.8B-Base`) por meio de shaders de computação Apple Metal `MSL` personalizados, somente quando os degraus mais baratos se abstêm ou exigem verificação exata do alvo.
- **`SleepCrystallizer` descendente**: Extrai traços recorrentes de vigília usando warm-starts espectrais de Walsh-Hadamard, tabelas-verdade de minitermos em modo conjunto, habilidades canônicas em AST e cronogramas de comutação de Waksman, alternando bancos de memória de bloco sombra sem interromper a inferência nem executar place-and-route de FPGA.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Contribuições

1. **Condição de compilação descendente amortizada**: Estende a ordenação $p_i/c_i$ de Simon-Kadane com um custo explícito de compilação $E_{\text{compile}}$ sobre horizonte estacionário $\Delta T$.
2. **Beneš-Copy-Beneš não bloqueante de $512 \times 512$, cache de página `81`-`RAMB36E2` e subsistema RTL `P4-AXIS` em pipeline de `4` estágios a `250 MHz`**: Elimina tanto o transbordamento lógico de `102.0%` no Kria KV260 dos crossbars planos (`119,478` LUTs) quanto a explosão de `926,619` LUTs dos multiplexadores de página em flip-flops (`41,186` LUTs CLB UltraScale+ = `35.2%` do `xck26`, `81` blocos `RAMB36E2` = `56.2%`, `0` fatias `DSP48` em `1` ciclo OOC), enquanto um wrapper `AXI4-Stream` seguro para `IOB` em pipeline de `4` estágios (`clai_benes_axi_stream_250mhz_top`) reduz a profundidade lógica síncrona de ciclo único em **`4.00×`**, de `52` para **`13` níveis**, cabe em **`170 <= 189` `IOB`s do `xck26`** (`41,459` LUTs = `35.40%`) e aprova **`256 / 256` em paridade de streaming sem bolhas (`CPI = 1.00`)** no Verilator.
3. **Síntese universal de mintermos em modo conjunto de $\le 64$ bits**: Mostra que a pesquisa de mintermos em modo conjunto domina o arredondamento marginal DiffLogic de plano de bits em ramos correlacionados e empacota $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ tokens de subpalavra num único word `uint64` (`16b × 4 = 64b` para `|V| = 65,536`; `17b × 3 = 51b` para `|V| = 128,000`; `18b × 3 = 54b` para `|V| = 248,320`).
4. **Porta de cristalização Split-Conformal + Online ACI livre de oráculo**: Emparelha uma pontuação de não conformidade latente `JEPA-EBRM` regularizada radialmente com calibração Split Conformal e Inferência Conformal Adaptativa (Gibbs e Candès, 2021), registando risco de cristalização falso de `0.00%` e AUROC OOD de `1.0000` em tráfego deslocado onde as linhas de base softmax e MC-Dropout registam risco falso de `17.62%-24.28%`.
5. **Shaders personalizados Apple Metal e Rust multiplataforma `CubeCL` `INT4` Sparse-MoE / `GatedDeltaNet` + `AirMoL` / `Expert-AirMoL` até `34.66B`**: Combina fragmentação de 4 bits via Darwin `F_NOCACHE` `os.pread`, shaders de computação personalizados em `MSL` (`43.45×` MoE, `20.66×` `GatedDeltaNet`) e portáteis em Rust `Burn 0.22.1 / CubeCL` (`35.09×` Metal / `2.67×` `LLVM` `CPU` em MoE, `69.20×` Metal / `14.87×` `LLVM` `CPU` em `GatedDeltaNet`), `pread` paralelo de Profundidade-de-Fila-`8` e especulação em rajada `BenesLUT6` em `LiquidAI/LFM3-1.7B` de outubro de 2026 (`2.74×` de redução NVMe em `3.79%` da RAM FP32), `LiquidAI/LFM2.5-8B-A1B` (`500.0 MB` de RAM, `3.493 J/tok` de `reported_j`) e `Qwen/Qwen3.6-35B-A3B` (`34.66B`; **`12.30×` de redução NVMe**, **`970.0 MB` de RAM = `1.47%` do FP16**, **`6.773 J/tok` de `reported_j`**, **`15.7 tok/s`** em `Q4` de Memória Unificada) com `100.0%` de paridade exata de tokens.
6. **Zero-MAC `Sub1Bit-LUT6` versus `LittleBit`, teto `<think>` de `91.67%` no `Rung 3d`, `BigCodeBench v0.1.3` oficial + `SWE-bench Verified` upstream via `MCP`, e `mol-agent` OpenAI / `MCP`**: Substitui os `1.98M` MACs binários em tempo de execução de `LittleBit-1 / LittleBit-2` (`0.576` bits por peso; Lee et al., 2025; Lee e Kim, 2026) por consulta de soma parcial `LUT6` de `6` entradas sem MAC (`< 4 × 10⁻⁶` de erro, `100.0%` de paridade sob verificação do alvo `MoL` em `0` épocas de QAT), eleva o comparativo de codificação de `48` tarefas do final de 2026 de `87.50%` para **`91.67%` (`44 / 48`; `93.75%` na Onda 2 e na Onda 3)** com `Rung 3d` `<think>` limitado em pesos abertos, alcança **`90.62%` (`29 / 32`, `93.75%` na Onda 2)** no `BigCodeBench v0.1.3` oficial (vs. `78.12%` no `35B` autônomo) e **`50.00%` (`8 / 16`)** em git worktrees upstream `sympy/sympy` do `SWE-bench Verified` (vs. `25.00%` no `35B`) com **`0.00%` de commits quebrados admitidos**, e serve habilidades `.mol/` persistentes sobre OpenAI `/v1/chat/completions` e `MCP` (`JSON-RPC 2.0`).
7. **Formalização paranoica em seis kernels no Lean `4.36.0` (endurecida contra `CVE-2026-72844`), localização por grafo de chamadas em `4` repositórios do `SWE-bench Verified`, ápice MoE Híbrido medido de `120B`, potência `VCD` controlada por `CE` e `mol-agent-rs` em Rust de binário único (`Claims LA-19` a `LA-23`)**: Verifica todos os `27` teoremas da Seção 2 em **seis verificadores de provas independentes** (`con-leche --verified` [`58,683` decls], `con-ron --verified` [`58,683` decls], `lean4lean` [`58,685` decls], `nanoda`, `leanchecker --paranoid` e Lean `4.36.0`; `0` `sorry`, `0` axiomas customizados, `0` `Lean.ofReduceBool`; Moura e Ullrich, 2021), expande a avaliação sem vazamento do `SWE-bench Verified` em **`4` repositórios upstream (`django`, `pytest`, `requests`, `sympy`, `24` avaliações)** com **`20.83%` no geral / `25.00%` na Onda 2 (`2.50×` modelos autônomos de `24B` e `35B`)** e `0.00%` de patches quebrados, mede o **`nvidia/Nemotron-3-Super-120B-A12B` na escala de `120B`** (`58,075.4 MB` de `RSS`, **`22.17 tok/s`**, **`62.50%` de aprovação verificada** vs. `43.75%` no `120B-A12B` autônomo e `31.25%` no `Devstral-Small-2-24B`), reduz a potência dinâmica ociosa do `P4-AXIS` a `250 MHz` em **`4.10×`** (`63.99` para **`15.59 est_mW`**) via gating de `ENARDEN` + `CE` por bolha de validade, e entrega um `mol-agent-rs` em Rust de binário único sem Python (`0.1540 ms/req` em `MCP`, **`17.21×` mais rápido** que o `mol-agent` em Python, `35 / 35` testes `pytest` aprovados).

<div id="13-same-house-disclosure-and-provenance-boundaries" class="anchor-alias" aria-hidden="true"></div>

### 1.3 Divulgação de trabalhos da mesma casa e fronteiras de proveniência

Estudos anteriores da Open Interface Engineering, a saber, [Portas de confirmação medidas](/papers/gates/), [Saciedade da tarefa versus rebote agregado na demanda por IA](/papers/satiation/), [O Reality Code Engine](/papers/rce/), [RCE-JEPA](/papers/rce-jepa/) e [RCE Compile](/papers/rce-compile/), são trabalhos `[same house]` (da mesma organização) citados para fins de transparência e continuidade arquitetural, jamais como confirmação externa independente. Dois invariantes vigoram em todo o texto:

- **Não fortalecimento de proveniência (`ModelGenerated ↛ Deterministic`)**: Tabelas compiladas a partir de uma verificação determinística de especificação `RCE` recebem o rótulo `Check-safe` em conjuntos reservados verificados (protegidas online por um disjuntor `HC-SOINN` / `RCE`). Tabelas cristalizadas sob a porta conformal `JEPA-EBRM` sem oráculo carregam apenas um limite estatístico de amostra finita (`Conformal-bounded`, $1-\alpha$) e nunca são promovidas a `Deterministic`.
- **Proponente versus autoridade (`The drafter proposes; the target decides`)**: Na decodificação especulativa, o `PagedBenesLUT6` atua estritamente como um proponente de zero FLOP; cada byte ou token emitido é verificado contra a decodificação gulosa do modelo-alvo (`100.0%` de paridade sem perdas).

---

<div id="2-mathematical-formulations-and-four-results" class="anchor-alias" aria-hidden="true"></div>

## 2. Formulações matemáticas e quatro resultados

<div id="21-result-1-cascade-ordering-with-amortized-downward-compilation" class="anchor-alias" aria-hidden="true"></div>

### 2.1 Resultado 1: Ordenação em cascata com compilação descendente amortizada

Considerem-se as engrenagens $i \in \{0, 1, 2, 3\}$ testadas sequencialmente sobre uma entrada $x$. A engrenagem $i$ fecha $C(z) = 1$ com probabilidade $p_i$ a um custo energético analítico esperado $c_i > 0$. Por Simon e Kadane (1975), o gasto esperado

$$\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j < k} \bigl(1 - p_{\sigma(j)}\bigr)$$

é minimizado se e somente se as engrenagens forem executadas em ordem não crescente de $p_{\sigma(k)} / c_{\sigma(k)}$. Suponha-se que um regime estacionário $\mathcal{D}_r$ persista por $\Delta T$ consultas restantes nas quais o caminho de ativação fecha com $p_{\text{wake}} = 1$ ao custo $c_{\text{wake}}$. Despender uma energia única de compilação $E_{\text{compile}}$ após $N_{\text{wake}}$ ativações certificadas produz uma página `LUT6` no Degrau 0 com taxa de acerto certificada $p_0' \in (0, 1]$ e custo de busca $c_0 \ll c_{\text{wake}}$.

**Proposição 1 (Condição de energia líquida para cristalização descendente).** *A compilação descendente reduz o gasto analítico acumulado esperado ao longo do horizonte $\Delta T$ se e somente se*

$$\Delta T \cdot \bigl(p_0' c_{\text{wake}} - c_0\bigr) > E_{\text{compile}}, \qquad \text{and} \qquad \frac{p_0'}{c_0} > \frac{1}{c_{\text{wake}}}.$$

*Demonstração.* Sem cristalização, $\Delta T$ consultas custam $\Delta T \cdot c_{\text{wake}}$. Com cristalização ao custo $E_{\text{compile}}$, o Degrau 0 precede o caminho de ativação sempre que $p_0'/c_0 > 1/c_{\text{wake}} \iff c_0 < p_0' c_{\text{wake}}$, e cada consulta custa $c_0 + (1 - p_0') c_{\text{wake}}$, economizando $p_0' c_{\text{wake}} - c_0 > 0$ por passo. Somando ao longo de $\Delta T$ passos obtém-se a economia líquida $\Delta T(p_0' c_{\text{wake}} - c_0) - E_{\text{compile}} > 0$. Sob alternância rápida de regimes ($\Delta T \le \Delta T^*$), a compilação perde energia, motivando o buffer mínimo de ativações $N_{\text{wake}}$ e a porta sobre o conjunto reservado $\tau_{\text{agree}} = 0.985$ do `SleepCrystallizer`. $\blacksquare$

<div id="22-result-2-non-blocking-512512-benešcopybeneš-multicast-routing" class="anchor-alias" aria-hidden="true"></div>

### 2.2 Resultado 2: Roteamento multicast sem bloqueio $512 \times 512$ Beneš-Copy-Beneš

Um banco no Degrau 0 composto por $G = 80$ células `LUT6` dinâmicas requer $M = 6G = 480$ pinos de entrada selecionados a partir de um barramento de $N = 512$ bits com fan-out arbitrário. Uma rede de permutação bijetiva de Beneš não consegue replicar fios com alto fan-out, ao passo que matrizes crossbar planas de multiplexadores $512:1$ transbordam a capacidade do KV260 (`119,478` LUTs de CLB já em `384` portas).

**Teorema 2 (Multicast livre de contenção via Beneš-Copy-Beneš).** *Para $N = 2^n$ ($n=9, N=512$) e $M \le N$ ($M=480$), qualquer mapeamento multicast muitos-para-um $\phi: \{0, \dots, M-1\} \to \{0, \dots, N-1\}$ é roteado sem contenção através de $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ em*

$$D(N) = 2(2\log_2 N - 1) + \log_2 N = 5\log_2 N - 2 = 43 \text{ stages}$$

*de $N/2 = 256$ comutadores $2 \times 2$ configurados por SRAM ($11,008$ bits de configuração), computados em tempo $O(N \log N)$ com zero posicionamento e roteamento em FPGA.*

*Demonstração.* Seja $U = \{s_1, \dots, s_r\}$ o conjunto de entradas ativas distintas com fan-outs $\sum_{j=1}^r m_j = M \le N$ e somas parciais $S_0 = 0, S_j = \sum_{i=1}^j m_i$. A rede de concentração $\mathcal{B}_1$ ($17$ estágios) mapeia $\pi_1(s_j) = S_{j-1}$ via bicoloração bipartida de Waksman (Beneš, 1965; Waksman, 1968). A rede de cópia $\mathcal{C}$ ($9$ estágios em borboleta) replica cada $S_{j-1}$ ao longo do intervalo monótono disjunto $[S_{j-1}, S_j - 1]$ sem contenção de enlaces pela construção de cópia monótona de Thompson (Thompson, 1978; Lee, 1988). A rede de Beneš de saída $\mathcal{B}_2$ ($17$ estágios) permuta bijetivamente $[S_{j-1}, S_j - 1]$ sobre $\phi^{-1}(s_j)$. $\blacksquare$

<div id="23-result-3-joint-mode-minterm-synthesis-vs-marginal-coordinate-argmax" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Resultado 3: Síntese de mintermos de moda conjunta versus argmax coordenado marginal

Camadas DiffLogic de planos de bits independentes preveem rajadas multibit $\mathbf{Y} = (Y_1, \dots, Y_B)$ por meio de arredondamento coordenada a coordenada $\hat{y}_b(c) = \mathbb{I}[\Pr(Y_b = 1 \mid c) > 1/2]$, o que mistura ramos correlacionados produzindo tokens **quimera** inválidos.

**Proposição 3 (Dominância e propriedade de zero quimeras dos mintermos de moda conjunta).** *Para um contexto discreto $\psi(X) = c$ e espaço de rajadas $\mathcal{Y}$ de $B \le 64$ bits, a tabela de moda conjunta $T^*(c) = \arg\max_{\mathbf{y} \in \mathcal{Y}} \Pr(\mathbf{Y} = \mathbf{y} \mid c)$ satisfaz $\Pr[\mathbf{Y} = T^*(\psi(X))] \ge \Pr[\mathbf{Y} = \hat{\mathbf{y}}^{\text{marg}}(\psi(X))]$, permanece dentro de $\operatorname{supp}(\mathbf{Y} \mid c)$ e evita quimeras marginais (onde massas de probabilidade $0.40, 0.35, 0.25$ em $(1,1,0), (1,0,1), (0,1,1)$ são arredondadas marginalmente para o vetor inválido $(1,1,1)$ com `0%` de correspondência exata contra `40%` de $T^*$). Para um vocabulário $|V|$ com $b_V = \lceil \log_2 |V| \rceil$, uma palavra `uint64` empacota $K = \lfloor 64 / b_V \rfloor$ tokens BPE (`16b × 4 = 64b` no `LFM2.5-350M`; `18b × 3 = 54b` no `Qwen3.5-0.8B-Base`).* $\blacksquare$

<div id="24-result-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 2.4 Resultado 4: Porta Split-Conformal + ACI online com `JEPA-EBRM` latente sem oráculo

Para evitar autodestilação alucinada quando nenhuma verificação determinística `RCE` está disponível, a referência pontua pares candidatos usando uma energia latente radialmente regularizada:

$$E_\phi(x, y) = \frac{1}{2}\|f_\theta(x) - \mu_y\|_2^2 + \frac{\lambda_r}{2}\|f_\theta(x)\|_2^2 + \psi_\phi(f_\theta(x), y), \qquad \lambda_r > 0, \quad |\psi_\phi| \le C_\psi.$$

A calibração Split Conformal sobre um conjunto reservado define $\hat{Q}_{1-\alpha}$, e a Inferência Conformal Adaptativa (ACI) online atualiza $\alpha_{t+1} = \alpha_t + \gamma(\alpha - \text{err}_t)$ (Gibbs e Candès, 2021), admitindo $(x, \hat{y})$ no `SleepCrystallizer` apenas quando $|\mathcal{C}_t(x)| = |\{y : E_\phi(x,y) \le \hat{Q}_{1-\alpha_t}\}| = 1$ (`Conformal-bounded`). Por Vovk et al. (2005) e Gibbs e Candès (2021), a cobertura marginal sob permutabilidade é de pelo menos $1-\alpha$, a falha de cobertura de longo prazo sob deslocamento converge para $\alpha$, e todo raio fora da variedade que exceda o raio $R(\alpha_t) = \sqrt{2(\hat{Q}_{1-\alpha_t} + C_\psi)/\lambda_r}$ resulta em $\mathcal{C}_t(x) = \emptyset$ (`Refuse` de recusa ou abstenção).

---

<div id="3-reference-architecture-polyglot-suite-and-kv260-rtl" class="anchor-alias" aria-hidden="true"></div>

## 3. Arquitetura de referência, suíte poliglota e RTL KV260

A Figura 1 mostra a cascata de quatro degraus e o loop descendente `SleepCrystallizer` em `src/clai/`.

![Figura 1. Compilação descendente ao longo de uma cascata Mixture of Limits de quatro degraus.](/figures/lut-adapt/mol-downward-cascade.svg)

*Figura 1. Compilação descendente ao longo de uma cascata Mixture of Limits de quatro degraus. Diagrama de design, não medição de potência da placa. [PNG](/figures/lut-adapt/mol-downward-cascade.png) · [Explorador interativo](/living/lut-adapt/#la-diag-01).*

Cinco implementações de sistemas em `openIE-dev/lut-adapt-ai` verificam a cascata: Python/PyTorch/Triton (`src/clai/`), Rust `Burn 0.22.1 / CubeCL` Metal (`sys/rust/`), Zig `0.17.1` (`sys/zig/`), Go `1.27.4` SIMD (`sys/go/`), e Julia `1.13.4` Enzyme (`sys/julia/`).

A Figura 2 ilustra o caminho de dados RTL do Kria KV260 (`xck26`) em `hw/kv260/rtl/clai_benes_hotswap_core.sv`, mapeando `512` páginas residentes de `LUT6` (`5,120` bits `INIT` + tag de contexto de `48`-bit + bit válido) através de `81` memórias paralelas `RAMB36E2` de dupla porta para troca de contexto em ciclo único (`4.0 ns` a `250 MHz` nominal, `CPI = 1.0`).

![Figura 2. Malha multicast Beneš-Copy-Beneš e cache de página LUT6 em BRAM de ciclo único.](/figures/lut-adapt/benes-paged-silicon.svg)

*Figura 2. Malha multicast `512×512` Beneš-Copy-Beneš e cache de página `LUT6` de ciclo único `81 × RAMB36E2` direcionada ao AMD Kria KV260 (`xck26`) nas simulações Yosys `0.71+` e Verilator `5.054` (`board_metered = false`). [PNG](/figures/lut-adapt/benes-paged-silicon.png) · [Explorador interativo](/living/lut-adapt/#la-diag-02).*

A Figura 3 mostra `AirMoL` (`src/clai/frontier/air_mol_streamer.py` e `hf_air_mol_pretrained.py`), que transmite fragmentos quantizados em grupos de 4 bits via `F_NOCACHE` do Darwin `os.pread`, verifica `[last_tok, d_1..d_K]` em uma única varredura, e captura instantâneos de estados híbridos compactos (`Short-Conv/SSM` ou `Gated DeltaNet` + `GQA` esparso de `6` camadas KV) na RAM, de modo que rejeições parciais de rascunho requerem **zero varreduras NVMe extras**.

![Figura 3. Transmissão de camada NVMe de 4 bits AirMoL com especulação universal de token LUT6 de até 64 bits.](/figures/lut-adapt/airmol-nvme-speculation.svg)

*Figura 3. Transmissão de camada NVMe de 4 bits `AirMoL` sem varredura extra, com especulação universal de token `LUT6` de `≤64`-bit em `LiquidAI/LFM3-1.7B`, `LiquidAI/LFM2.5-350M` e `Qwen/Qwen3.5-0.8B-Base`. [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [Explorador interativo](/living/lut-adapt/#la-run-01).*

Figura 4 mostra `Expert-AirMoL` (`src/clai/frontier/moe_air_mol.py`) e `VerifiedCodeCascade` (`verified_code_cascade.py`). O `AirLLM` padrão com descarregamento em disco varre todos os $E$ peritos por camada MoE (`32` em `LiquidAI/LFM2.5-8B-A1B`, `256` em `Qwen/Qwen3.6-35B-A3B`) apesar de o roteador ativar apenas $k \ll E$ peritos por ficha (`4/32` e `8/256`). O `Expert-AirMoL` particiona cada camada MoE num fragmento de cabeçalho compacto e num ficheiro NVMe `INT4` `.experts.pack4` de passo fixo, emitindo leituras `F_NOCACHE` `os.pread` unicamente para a união de peritos ativos $\mathcal{U}_l$ nas $K+1$ posições de rajada. Para tarefas de síntese novas, o `VerifiedCodeCascade` coloca todos os commits nas Escadas `0-3c` atrás de uma AST limitada a `0.35s`, execução em sandbox e verificação de invariante de fronteira $C(z) \in \{0, 1\}$, compilando soluções certificadas em `BenesLUT6` e páginas de competências AST canónicas.

![Figura 4. Transmissão em fluxo NVMe esparsa por roteador de 4 bits Expert-AirMoL e VerifiedCodeCascade controlada por verificador.](/figures/lut-adapt/moe-expert-cascade.svg)

*Figura 4. Transmissão em fluxo NVMe indexada por perito de 4 bits esparsa por roteador `Expert-AirMoL` (`12.30×` de redução de E/S em `Qwen/Qwen3.6-35B-A3B`) e `VerifiedCodeCascade` controlada por `C(z)`. [PNG](/figures/lut-adapt/moe-expert-cascade.png) · [Explorador interativo](/living/lut-adapt/#la-run-01).*

A Figura 5 situa a compilação descendente ao longo da catraca de capacidade de nove degraus da inteligência computacional (estudo companheiro: [A Ferramenta de Comunicação Avalanche](/papers/communication-avalanche/) `[same house]`). Os degraus 1 a 5 - **(1) Busca** (`RAG`), **(2) Geração**, **(3) Raciocínio** (`<think>`), **(4) Comunicação** (delegação `MCP`) e **(5) Uso de Ferramentas** - estagnam sob inferência efêmera `MAC` de partida a frio, onde o horizonte estacionário permanece em $\Delta T \approx 1 \le \Delta T^*$ e modelos autônomos `1`-shot admitem `56.25%-95.83%` de patches quebrados (`Claims LA-20` e `LA-21`). Cruzar o **Limiar de Compilação** da Proposição 1 ($\Delta T > \Delta T^* = E_{\text{compile}} / (p_0' c_{\text{wake}} - c_0)$ sob $C(z) = 1$, `0.00%` de commits quebrados admitidos) desbloqueia **(6) Imersão** (o estado local persistente estende $\Delta T \gg \Delta T^*$), **(7) Competência** ($p_0' \to 1$ a `62.4 pJ/cycle` `est_j` em RTL `LUT6` `xck26` controlado por `CE` e `272 µJ/req` `reported_j` em `MCP` Rust `mol-agent-rs`), **(8) Ecologia** (populações de agentes em Rust nativos de borda) e **(9) Economia** (divisão do trabalho ordenada por $p_i / c_i$ de Simon-Kadane e recibos de joules tipados por camada).

![Figura 5. A Catraca de Avalanche de Nove Degraus da Inteligência Computacional e o Limiar de Compilação.](/figures/lut-adapt/avalanche-compilation-threshold.svg)

*Figura 5. A catraca de capacidade de nove degraus e o Limiar de Compilação da Proposição 1 ($\Delta T > \Delta T^*$), separando `reported_j` (Apple M5 Max) e `est_j` (`AMD DS925` `VCD`) ao longo de doze ordens de grandeza (`measured_j = None`, `board_metered = false`). [PNG](/figures/lut-adapt/avalanche-compilation-threshold.png) · [Explorador interativo](/living/lut-adapt/#la-diag-03).*

---

<div id="4-claims-and-results" class="anchor-alias" aria-hidden="true"></div>

## 4. Alegações e resultados

<div id="41-claim-la-1-analytical-est_jvc-reduction-on-synthetic-tasks-and-real-pcap-traffic" class="anchor-alias" aria-hidden="true"></div>

### 4.1 Alegação LA-1: Redução analítica de `est_j/VC` em tarefas sintéticas e tráfego `.pcap` real

| Carga de trabalho e janela | Fração Degrau 0 | Taxa de aprovação | `est_j / VC` analítico | Paridade Verilator | Classe de evidência |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Sintético ep. `1-512` (ativação a frio) | `0.00%` | `0.0% → 52.0%` | `2,323.18 est_j` | - | SW + `est_j` |
| Sintético ep. `3,073-3,584` (cristalizado) | `52.73%` | `60.55%` | `2.59 est_j` (`895×`) | `100.0%` | Verilator + `est_j` |
| Pacotes `.pcap` `1-512` (IPv4 a frio) | `0.00%` | `73.05%` | `3.3351 est_j` | `100.0%` | Verilator + `est_j` |
| Pacotes `.pcap` `1,537-2,048` (cristalizado) | `100.00%` | `100.00%` | `0.000140 est_j` | `100.0%` | Verilator + `est_j` |
| Pacotes `.pcap` `2,049-2,560` (mudança VLAN `0x8100`) | `2.73%` | `68.55%` | `3.0485 est_j` | `100.0%` | Disjuntor + `est_j` |
| **Pacotes `.pcap` `2,561-3,072` (recristalizado)** | **`100.00%`** | **`100.00%`** | **`0.000131 est_j` (`25,458×`)** | **`100.0%` (`5,120/5,120`)** | **Verilator + `est_j`** |

<div id="42-claim-la-2-five-language-polyglot-parity-and-zero-allocation-dataplanes" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Alegação LA-2: Paridade poliglota em cinco linguagens e planos de dados com alocação zero

| Implementação | Alvo / Backend | Resultado principal | Classe de evidência |
| :--- | :--- | :--- | :--- |
| **Rust (`sys/rust/`)** | `Burn 0.22.1` + GPU Metal `CubeCL` | `2,331.42 → 0.19 est_j/VC`, `95.31%` no Degrau 0, emite `.v` para KV260 | SW medido + `est_j` |
| **Zig `0.17.1` (`sys/zig/`)** | `@Vector(8, f32)` SIMD + `@popCount` | `0` bytes de heap no laço crítico; `87 ns/pkt` (`11.49M pkts/s`) | SW medido (M5 Max) |
| **Go `1.27.4` (`sys/go/`)** | Pool de trabalhadores + `OnesCount64` | `0 B/op`, `0 allocs/op`; `31.86 ns/op` (`31.39M evals/s`) | Medido (`go test`) |
| **Julia `1.13.4` (`sys/julia/`)** | AD em modo reverso com `Enzyme.jl` | Discrepância máxima de gradiente vs. FD centrada: `6.11 × 10⁻¹⁰` | Verificação numérica medida |

<div id="43-claim-la-3-kv260-xck26-benešcopybeneš-and-ramb36e2-paged-synthesis" class="anchor-alias" aria-hidden="true"></div>

### 4.3 Alegação LA-3: Síntese paginada Beneš-Copy-Beneš e `RAMB36E2` no KV260 (`xck26`)

| Arquitetura RTL | Páginas | Latência de troca | LUTs CLB `xcup` (`% xck26`) | `RAMB36E2` | `DSP48` | Acurácia pós-deriva | Classe de evidência |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `2A` Crossbar plana `512:1` (`64` LUT6) | `1` | `82 cyc` | `119,478` (**`102.0%` estouro**) | `0` | `0` | `98.44%` | Simulado (Yosys) |
| `2B` Crossbar compacta (`32` LUT6) | `1` | `82 cyc` | `59,739` (`51.0%`) | `0` | `0` | `95.94%` | Simulado (Yosys) |
| `2C` Fiação fixa DiffLogic / WNN | `1` | Re-PAR no Vivado | `160` (`0.14%`) | `0` | `0` | **`52.34%`** | Simulado (Yosys) |
| `2D` Beneš-Copy-Beneš de página única | `1` | `82 cyc` | `40,155` (`34.3%`) | `0` | `0` | `98.44%` | Simulado (Yosys + Verilator) |
| `P2` FFs distribuídos + Mux `512:1` | `512` | `1 cyc` | `926,619` (**`791.2%` estouro**) | `0` | `0` | `98.44%` | Simulado |
| **`P3` Beneš + `81` `RAMB36E2` (Referência)** | **`512`** | **`1 cyc` (`4.0 ns`)** | **`41,186` (`35.2%`)** | **`81` (`56.2%`)** | **`0`** | **`98.44%`** | **Simulado (Yosys + Verilator)** |

<div id="44-claim-la-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.4 Alegação LA-4: Porta Split-Conformal + ACI online com `JEPA-EBRM` latente sem oráculo

| Porta de cristalização | Passagens | Risco de falsa cristalização | AUROC OOD | Cobertura ID segura | Acurácia `LUT6` limpa | Detectou mudança? | Classe de evidência |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `3A` Softmax MSP ($\max p \ge 0.95$) | `1` | `17.62%` | `0.8552` | `90.93%` | `99.22%` | `False` | SW medido |
| `3B` Margem escalonada por temperatura | `1` | `17.66%` | `0.8422` | `91.12%` | `98.83%` | `False` | SW medido |
| `3C` Energia de logits de Helmholtz | `1` | `24.28%` | `0.8045` | `97.17%` | `99.80%` | `False` | SW medido |
| `3D` MC-Dropout (`5` passagens) | `5` | `18.24%` | `0.8494` | `91.03%` | `99.61%` | `False` | SW medido |
| **`3E` `JEPA-EBRM` latente + ACI conformal** | **`1`** | **`0.00%`** | **`1.0000`** | **`95.66%`** | **`99.02%`** | **`True`** | **SW medido** |

<div id="45-claim-la-5-lossless-byte-level-speculative-decoding-on-520-kb-polyglot-source-code" class="anchor-alias" aria-hidden="true"></div>

### 4.5 Alegação LA-5: Decodificação especulativa sem perdas em nível de byte sobre `520 KB` de código-fonte poliglota

| Arquitetura | Paridade exata | Bytes / Passagem | Passagens (`64 B`) | FLOPs de rascunho | MFLOPs / Byte | `est_mJ / Byte` | Classe de evidência |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` Transformer causal (`RoPE+SwiGLU`) | `100.0%` | `1.00` | `64.00` | `0` | `7.209` | `58.94` | SW medido + `est_j` |
| `B` `Mamba-3` MIMO complexo (`T=1`) | `100.0%` | `1.00` | `64.00` | `0` | `2.257` | `20.84` | SW medido + `est_j` |
| `C` Busca no prompt `PLD` | `100.0%` | `2.13` | `29.98` | `0` | `1.322` | `11.52` | SW medido + `est_j` |
| `D` Trie de sufixos de corpus `REST` | `100.0%` | `3.84` | `16.65` | `0` | `0.734` | `6.40` | SW medido + `est_j` |
| `E` Cabeças MLP paralelas `Medusa` | `100.0%` | `2.62` | `24.44` | `428,288` | `1.241` | `9.46` | SW medido + `est_j` |
| `F` Árvore neural de rascunho `EAGLE-2` | `100.0%` | `2.75` | `23.29` | `1,122,560` | `1.435` | `9.07` | SW medido + `est_j` |
| **`G` `MoL` Beneš paginado `LUT6` (Referência)** | **`100.0%`** | **`3.84`** | **`16.69`** | **`0`** | **`0.736`** | **`6.41`** | **SW medido + `est_j`** |

<div id="46-claim-la-6-controlled-airmol-4-bit-nvme-streaming-143m-matched-pair" class="anchor-alias" aria-hidden="true"></div>

### 4.6 Alegação LA-6: Streaming NVMe controlado de 4 bits `AirMoL` (par pareado de `14.3M`)

| Arquitetura de streaming descarregado | Paridade | Bytes / Varredura | Varreduras | Leitura NVMe | Escrita NVMe | RAM de pico | `ms / Byte` | Classe de evidência |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `AirLLM` Transformer FP16 + despejo KV | `100%` | `1.00` | `64.00` | `2,130.0 MB` | `407.6 MB` | `8.81 MB` | `60.64` | Medido (`F_NOCACHE`) |
| `2` `AirLLM` Transformer 4 bits + despejo KV | `100%` | `1.00` | `64.00` | `887.6 MB` | `407.6 MB` | `8.81 MB` | `64.87` | Medido (`F_NOCACHE`) |
| `3` `AirMamba-3` 4 bits + `EAGLE-2` paginado | `100%` | `2.86` | `22.38` | `175.3 MB` | `0.0 MB` | `7.20 MB` | `19.20` | Medido (`F_NOCACHE`) |
| `4` `AirMamba-3` 4 bits + $O(1)$ fixado (`T=1`) | `100%` | `1.00` | `64.00` | `488.3 MB` | `0.0 MB` | `7.20 MB` | `37.72` | Medido (`F_NOCACHE`) |
| **`5` `AirMoL` 4 bits + `LUT6` a frio (Referência)** | **`100%`** | **`3.74`** | **`17.12`** | **`130.7 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.18`** | **Medido (`F_NOCACHE`)** |
| **`6` `AirMoL` 4 bits + pós-ativação (Referência)** | **`100%`** | **`4.27`** | **`15.00`** | **`114.4 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.09`** | **Medido (`F_NOCACHE`)** |

<div id="47-claim-la-7-pretrained-2026-dense--tri-hybrid-models-under-airmol-lfm3-17b-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 Afirmação LA-7: Modelos densos e tri-híbridos pré-treinados de 2026 sob `AirMoL` (`LFM3-1.7B`, `LFM2.5-350M` e `Qwen3.5-0.8B-Base`)

| Checkpoint de 2026 e Braço | Paridade | Tok / Varredura | Caracteres / Varredura | Varreduras | Leitura NVMe | RAM Ativa de Pico (`% FP32`) | `tok/s` | Classe de Evidência |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM3-1.7B` (out 2026) · `AirLLM` 4 bits (`T=1`) | `100%` | `1.00` | `2.30` | `24.00` | `25.045 GB` | `250.0 MB` (`3.79%`) | `0.53` | Medido (`F_NOCACHE`) |
| `LFM3-1.7B` (out 2026) · `AirLLM` 4 bits + `PLD` | `100%` | `1.37` | `3.16` | `17.50` | `18.262 GB` | `250.0 MB` (`3.79%`) | `0.73` | Medido (`F_NOCACHE`) |
| **`LFM3-1.7B` (out 2026) · `AirMoL` `LUT6` a frio** | **`100%`** | **`1.55`** | **`3.56`** | **`15.50`** | **`16.175 GB`** | **`250.0 MB` (`3.79%`)** | **`0.81`** | **Medido (`F_NOCACHE`)** |
| **`LFM3-1.7B` (out 2026) · `AirMoL` Pós-Wake** | **`100%`** | **`2.74`** | **`6.31`** | **`8.75`** | **`9.131 GB`** | **`250.0 MB` (`3.79%`)** | **`1.32`** | **Medido (`F_NOCACHE`)** |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Medido (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4 bits (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Medido (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4 bits + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Medido (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` `LUT6` a frio** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Medido (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` Pós-Wake** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Medido (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4 bits (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Medido (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4 bits + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Medido (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` `LUT6` a frio** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Medido (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` Pós-Wake** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Medido (`F_NOCACHE`)** |

Em outubro de 2026 `LiquidAI/LFM3-1.7B` (`13` convoluções curtas + `5` camadas de atenção de janela deslizante + `6` camadas de atenção completa, `|V| = 128,000`), o `AirMoL` pós-despertar reduz a transferência NVMe em `2.74×` (`25.045 GB` para `9.131 GB`) e aumenta a velocidade de decodificação em `2.49×` (`0.53` para `1.32 tok/s`) em `250.0 MB` de RAM ativa de pesos (`3.79%` de FP32) a `100.0%` de paridade sem perdas. Observe a troca preservada em prompts frios não vistos restritos à CPU em `Qwen3.5-0.8B-Base`: o `AirMoL` reduz leituras de disco NVMe (`12.674 GB` para `8.581 GB`), porém a verificação em lote do DeltaNet Gated da CPU de `4` tokens diminui o throughput de relógio de parede (`0.32` vs. `0.53 tok/s`) até que a cristalização online wake-to-`LUT6` eleve a aceitação para `2.74 tok/sweep` (`1.11 tok/s`).

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 Afirmação LA-8: Servidor de streaming CLI e HTTP/SSE em tempo real (`mol_code_cli.py`)

O ficheiro `scripts/mol_code_cli.py` disponibiliza os backends `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` e `--air-nvme` através de endpoints CLI e SSE (`/v1/health`, `/v1/complete`, `/v1/crystallize`), avançando a residência de slots `RAMB36E2` de `438/512` para `460/512` em tempo real, com `26/26` testes aprovados em `tests/`.

<div id="49-claim-la-9-frontier-sparse-moe-expert-airmol-liquidailfm25-8b-a1b-847b--qwenqwen36-35b-a3b-3466b" class="anchor-alias" aria-hidden="true"></div>

### 4.9 Afirmação LA-9: `Expert-AirMoL` de Sparse-MoE de fronteira (`LiquidAI/LFM2.5-8B-A1B` `8.47B` e `Qwen/Qwen3.6-35B-A3B` `34.66B`)

| Checkpoint Sparse-MoE e Braço | Paridade | Especialistas Ativos | Tok / Varredura | Leitura NVMe / Tok | Redução de E/S | RAM de Pico (`% FP16`) | `tok/s` | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `AirLLM` Denso 4-Bit (`T=1`) | `100%` | `100.00%` | `1.00` | `4.574 GB` | `1.00×` | `1.408,3 MB` (`8.72%`) | `0.28` | `368.80` |
| `LFM2.5-8B-A1B` · `Expert-AirLLM` (`T=1`) | `100%` | `16.93%` | `1.00` | `1.200 GB` | `3.81×` | `1.408,3 MB` (`8.72%`) | `0.58` | `181.26` |
| `LFM2.5-8B-A1B` · `Expert-AirMoL` + `PLD` | `100%` | `28.82%` | `1.78` | `0.883 GB` | `5.18×` | `1.408,3 MB` (`8.72%`) | `0.79` | `132.57` |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` Cold `LUT6`** | **`100%`** | **`33.91%`** | **`1.85`** | **`1.002 GB`** | **`4.56×`** | **`1.408,3 MB` (`8.72%`)** | **`0.72`** | **`145.42`** |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` Pós-Wake** | **`100%`** | **`36.46%`** | **`3.00`** | **`0.663 GB`** | **`6.90×`** | **`1.408,3 MB` (`8.72%`)** | **`1.10`** | **`95.67`** |
| `Qwen3.6-35B-A3B` · `AirLLM` Denso 4-Bit (`T=1`) | `100%` | `100.00%` | `1.00` | `18.159 GB` | `1.00×` | `3.214,7 MB` (`4.86%`) | `0.06` | `1,696.81` |
| `Qwen3.6-35B-A3B` · `Expert-AirLLM` (`T=1`) | `100%` | `6.35%` | `1.00` | `2.356 GB` | `7.71×` | `2.530,7 MB` (`3.83%`) | `0.22` | `471.87` |
| `Qwen3.6-35B-A3B` · `Expert-AirMoL` + `PLD` | `100%` | `11.58%` | `1.89` | `1.708 GB` | `10.63×` | `2.530,7 MB` (`3.83%`) | `0.32` | `326.24` |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` Cold `LUT6`** | **`100%`** | **`12.91%`** | **`2.00`** | **`1.722 GB`** | **`10.54×`** | **`2.530,7 MB` (`3.83%`)** | **`0.31`** | **`334.42`** |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` Pós-Wake** | **`100%`** | **`14.97%`** | **`2.57`** | **`1.477 GB`** | **`12.30×`** | **`2.530,7 MB` (`3.83%`)** | **`0.39`** | **`267.08`** |

Em `Qwen/Qwen3.6-35B-A3B` (`34.66B` parâmetros, `66.11 GB` em FP16 fragmentados em arquivos `.experts.pack4` de `18.60 GB` em 4 bits; variação total do sistema medida pelo `PMU` do macOS de `20.070,18 J`), o `Expert-AirMoL` pós-wake reduz a transferência NVMe sem buffer em **`12.30×`** (`18.159` para `1.477 GB/tok`) e acelera a decodificação em **`6.50×`** (`0.06` para `0.39 tok/s`) com **`2.530,7 MB` de RAM ativa (`3.83%` do FP16)** e paridade de tokens sem perdas de `100.0%`.

<div id="410-claim-la-10-sub-1-bit-latent-factorization-littlebit-1--littlebit-2-vs-zero-mac-sub1bit-lut6" class="anchor-alias" aria-hidden="true"></div>

### 4.10 Reivindicação LA-10: Fatoração latente sub-1-bit (`LittleBit-1 / LittleBit-2`) vs. zero-MAC `Sub1Bit-LUT6`

| Método de Fatoração (`LFM2.5-8B-A1B` `w1 [1792, 2048]`) | Bits / Peso | SNR do Peso | Similaridade Cosseno | `16K` Acerto Top-1 | MACs Binários / Tok | Épocas QAT | Classe de Evidência |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` SVD não rotacionado SVID (`LittleBit-1` estilo PTQ) | `0.576` (`27.8×`) | `1.76 dB` | `0.5761` | `3.12%` | `1,981,440` | `0` (`5` no artigo) | SW Medido |
| `B` Procrustes `ITQ` SVID (`LittleBit-2` estilo PTQ) | `0.576` (`27.8×`) | `2.42 dB` | `0.6487` | `10.94%` | `1,981,440` | `0` (`5` no artigo) | SW Medido |
| **`C` `Sub1Bit-LUT6` Busca em Tabela (`0` MACs, Rascunho)** | **`0.576` (`27.8×`)** | **`2.42 dB`** | **`0.6487`** | **`10.94%`** | **`0`** | **`0`** | **Medido (`< 4e-6` vs. `B`)** |
| `D` `Expert-AirMoL` `INT4` Alvo Bloco-64 | `4.500` (`3.56×`) | `20.77 dB` | `0.9958` | `82.81%` | `0` (`INT4`) | `0` | SW Medido |
| **`E` `MoL`: `Sub1Bit-LUT6` Rascunho + Verificação de Alvo** | **`0.576` rascunho** | **`148.84 dB`** | **`1.0000`** | **`100.00%`** | **`0` MACs rascunho** | **`0`** | **Paridade sem perdas medida** |

<div id="411-claim-la-11-48-task-16-specifications--3-waves-late-2026-frontier-coding-bakeoff" class="anchor-alias" aria-hidden="true"></div>

### 4.11 Reivindicação LA-11: Bakeoff de codificação frontier late-2026 de 48 tarefas (16 especificações × 3 ondas)

| Sistema Late-2026 Arm (48 Tarefas = 16 Especificações × 3 Ondas) | W1 Frio | W2 Adap | W3 Quente | Passagem Geral | Commits Quebrados | Compartilhamento W3 `Rung 0/1` | `35B` Chamadas | Média W1 / W3 (ms) | `reported_j` / Resolver (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT (`1`-Shot) | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `22,413` / `22,708` | `8,020.13` (`32,558 est_j`) |
| `B` `LiquidAI/LFM3-1.7B` (Oct 2026 Tri-Hybrid, `1`-Shot) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `8,460` / `9,791` | `152.77` (`957.21 est_j`) |
| `C` `google/gemma-4-E2B-it` (`2026` Hybrid, `1`-Shot) | `37.50%` | `18.75%` | `18.75%` | `25.00%` | `75.00%` | `0.00%` | `0.0%` | `18,924` / `23,578` | `5,800.68*` (`3,700.44 est_j`) |
| `D` `LiquidAI/LFM2.5-8B-A1B` (`8.47B` MoE, `1`-Shot) | `6.25%` | `6.25%` | `6.25%` | `6.25%` | `93.75%` | `0.00%` | `0.0%` | `53,123` / `53,885` | `33,415.04` (`47,196 est_j`) |
| `E` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (`1`-Shot) | `81.25%` | `75.00%` | `75.00%` | `77.08%` | `22.92%` | `0.00%` | `100.0%` | `49,887` / `44,447` | `1,069.65` (`5,701.32 est_j`) |
| `F` `RouteLLM` Confidence Router (`LFM3` $\to$ `Gemma4` $\to$ `8B`) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `9,735` / `11,294` | `171.09` (`1,148.96 est_j`) |
| **`G` `MoL` `VerifiedCodeCascade` (Reference)** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`87.50%`** | **`22.92%`** | **`116,626` / `44,052` (`2.89 ms` solved)** | **`3,655.51*` (`0.0424 J` in W3)** |

Ao longo do benchmark de protocolos e algoritmos com `48` tarefas (aritmética serial RFC 1982, varredura de intervalos ponderados, ordenação topológica lexicográfica segura a ciclos, buckets de tokens em nanossegundos, CRC-8/ATM e CRC-8 com `0xFF` mutado, desescape `~01` de JSON Pointer RFC 6901, Bellman-Ford limitado por saltos, medianas de janela exatas com `>2⁵³`, Damerau-Levenshtein irrestrito, roteamento Beneš `4×4`, parametrização de literais SQL, soma de subsequências com deque monotônico, SLEB128 do DWARF, hashing consistente SHA-256 e quantis conformais; delta de `PMU` de todo o sistema no macOS de `117,166.40 J` em `6,646` ticks), o `VerifiedCodeCascade` atinge **`87.50%` (`42 / 48`)** nas três ondas. Esse resultado supera o `Qwen3.6-35B-A3B` isolado (`77.08%`), chamando o `35B` em apenas **`22.92%` (`11 / 48`)** das tarefas (`LFM3-1.7B` resolve `7` especificações da Onda-1 diretamente; `Gemma-4-E2B-it` com reparo estruturado por contraexemplo resolve `3`; `Metal-Qwen3.6-35B-A3B` resolve `4` mais a `W2_01` mutada). O sistema admite **`0.00%` de commits quebrados** (contra `22.92%-100.00%`), captura as duas mutações adversariais de especificação da Onda-2 via $C(z)$ (`16` habilidades certificadas em `artifacts/.mol_verified_skills`) e reduz a reprodução média da Onda-3 entre as **`14` soluções cristalizadas (`87.50%`)** para **`2.89 ms`** e **`0.0424 J` `reported_j`** (`15,401×` mais rápido e `25,227×` menor `reported_j` do que o `35B` isolado). *(Nota `*`: Uma invocação da `W2_10` com `Gemma-4` sofreu um pico de `+59.2 kJ` causado por um transbordamento do acumulador de hardware `'GPU Energy'` do `IOReport` do macOS, sem privilégios. Esse pico foi preservado sem edições em `frontier_ai_head_to_head_bakeoff.csv` e filtrado pela proteção contra transbordamento `> 450 W` do `joule_meter.py` nas execuções seguintes.)*

<div id="412-claim-la-12-native-apple-metal-msl-fused-int4-sparse-moe--gateddeltanet-shaders--dual-channel-reported_j" class="anchor-alias" aria-hidden="true"></div>

### 4.12 Afirmação LA-12: shaders nativos Apple Metal (`MSL`) com fusão `INT4` para Sparse-MoE e `GatedDeltaNet` + `reported_j` em dois canais

`src/clai/frontier/metal_moe_kernels.py` e `scripts/run_metal_moe_benchmark.py` (`artifacts/metal_moe_air_mol_speedup.csv`, `artifacts/metal_moe_air_mol_meta.json`) compilam três núcleos `MSL` personalizados via `torch.mps.compile_shader`: (i) `gated_delta_recurrent_k128`, explorando a independência exata de colunas em $v \in \{0, \dots, V_{\text{dim}}-1\}$ do estado recorrente $\mathbf{S}[b, h_v, :, v]$ para manter `128` elementos de estado `FP32` nos registos da GPU ao longo de todos os $T$ tokens (**`20.66×` mais rápido**: `34.523` a `1.671 ms`, **`46.2×` menor `reported_j`**: `1.4989` a `0.0325 J`, `1.19 × 10⁻⁷` erro máximo de estado); e (ii) `q4_moe_gate_up_silu` + `q4_moe_down_weighted`, desquantizando pesos de peritos `INT4` de `4.50 bpw` em blocos de 64 diretamente dentro dos registos `simd_sum` sem alocações de pesos `FP16`/`FP32` (**`43.45×` mais rápido**: `22.408` a `0.516 ms` em `28` peritos ativos, **`29.8×` menor `reported_j`**: `0.3959` a `0.0133 J`, `7.2 × 10⁻⁷` erro máximo `FP32`, `<= 1 ULP` `BF16`), emparelhados com `pread` paralelo de profundidade de fila-`8` e roteador de antevisão de esboço de sinal `BenesLUT6`:

| Ponto de Verificação Sparse-MoE e Variante de Motor Cold-NVMe | Paridade | Tok / Varrida | Leitura NVMe / Tok | RAM Ativa de Pico | `tok/s` (`× PyTorch`) | `reported_j / tok` no dispositivo (`GPU` + `CPU`) | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `1` PyTorch-Ref `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | `1,408.3 MB` | `0.394` (`1.00×`) | `10.978 J` (`5.25` + `5.73`) | `266.66` |
| `LFM2.5-8B-A1B` · `2` Metal-Fused `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | **`500.0 MB`** | `0.689` (`1.75×`) | `6.979 J` (`1.30` + `5.68`) | `152.42` |
| **`LFM2.5-8B-A1B` · `3` Metal-Fused + `BenesLUT6` (Referência)** | **`100%`** | **`2.67`** | **`0.791 GB`** | **`500.0 MB`** | **`1.671` (`4.24×`)** | **`3.493 J` (`1.22` + `2.28`)** | **`62.85`** |
| `Qwen3.6-35B-A3B` · `1` PyTorch-Ref `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | `2,434.7 MB` | `0.191` (`1.00×`) | `20.765 J` (`8.76` + `12.00`) | `549.49` |
| `Qwen3.6-35B-A3B` · `2` Metal-Fused `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | **`970.0 MB` (`1.47%`)** | `0.241` (`1.26×`) | `15.440 J` (`3.93` + `11.51`) | `436.26` |
| **`Qwen3.6-35B-A3B` · `3` Metal-Fused + `BenesLUT6` (Referência)** | **`100%`** | **`2.67`** | **`1.447 GB`** | **`970.0 MB` (`1.47%`)** | **`0.621` (`3.25×`)** | **`6.773 J` (`2.31` + `4.47`)** | **`169.03`** |

A eliminação do desempacotamento de peritos `FP16`/`FP32` reduz a RAM Ativa de Pesos de Pico Cold-NVMe em `Qwen/Qwen3.6-35B-A3B` em **`2.51×`** para **`970.0 MB` (`1.47%` de `66.11 GB` FP16)** e diminui o `reported_j / tok` de canal duplo em **`3.07×`** (`20.765` para **`6.773 J/tok`**) com paridade exata de tokens de `100.0%` (alcançando **`15.7 tok/s`** quando pacotes de peritos `INT4` de `16.8 GB` permanecem fixados na Memória Unificada em estações de trabalho com `>= 36 GiB`).

<div id="413-claim-la-13-16-task-8-multi-file-git-repositories--2-waves-swe-mini-pytest-patching-benchmark" class="anchor-alias" aria-hidden="true"></div>

### 4.13 Reivindicação LA-13: benchmark de patch `pytest` `SWE-Mini` de `16` tarefas (`8` repositórios git multi-arquivo × `2` ondas)

`src/clai/frontier/repo_patch_cascade.py` e `scripts/run_repo_patch_benchmark.py` (`artifacts/repo_patch_swebench_mini.csv`, `artifacts/repo_patch_swebench_mini_traces.json`) avaliam a correção de bugs cruzados entre módulos em `8` repositórios git isolados (`billing`, `scheduler` DAG, `auth` JWT/HMAC, `wal` CRC32, `http_client` CIDR, `semver`, `ttlcache` LRU/TTL, e `etl` CSV) × `2` ondas (`16` avaliações, incluindo uma mutação de segurança da Onda-2 em `R03_jwt_clock_skew` adicionando rejeição de `iat` futuro), onde $C(z)$ impõe a identidade byte a byte de `tests/` e executa o subprocesso `pytest -q`:

| Repositório Git Multi-Arquivo (`16` Tarefas = `8` Repos × `2` Ondas) | W1 Frio | W2 Quente | Aprovação Geral | Patches Quebrados | Compartilhamento de Acertos `.mol/` na W2 | Média W1 / W2 (`ms`) | `reported_j` / Correção (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (Patch Repo 1-Shot) | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `4,943` / `5,020` | `371.61 J` (`637.68 est_j`) |
| `B` `google/gemma-4-E2B-it` (Patch Repo 1-Shot) | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `6,865` / `7,117` | `133.48 J` (`469.79 est_j`) |
| `C` `LiquidAI/LFM2.5-8B-A1B` (Patch Repo 1-Shot) | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `61,430` / `61,416` | `17,882.33 J` (`54,052 est_j`) |
| `D` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (1-Shot) | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `20,270` / `20,502` | `288.39 J` (`3,098.71 est_j`) |
| **`E` `MoL` `RepoPatchCascade` (Referência)** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`75.00%`** | **`59,341` / `30,663` (`594 ms` `.mol/`)** | **`692.38 J` (`1.10 J` `.mol/`)** |

`RepoPatchCascade` resolve **`87.50%` (`14 / 16`)** dos bugs de repositório multi-arquivo (**+25.0** pontos percentuais acima do `35B` autônomo e do `Gemma 4`), com **`0.00%`** de patches quebrados, captura a mutação de especificação Wave-2 `R03` via subprocesso `pytest` $C(z)$ e recristaliza `Patch#8` (`2,905 ms`), e reproduz os `6` patches recorrentes Wave-2 `.mol/` em **`594.0 ms` (`1.10 J` `reported_j`, incluindo `git init` + `pytest`)** versus `38,937.5 ms` (`590.38 J` `reported_j`) na Onda 1 (**`65.6×` mais rápido, `537×` menor `reported_j`**).

<div id="414-claim-la-14-drop-in-openai-v1chatcompletions-and-mcp-json-rpc-20-local-coding-agent-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.14 Afirmação LA-14: Agente local de codificação compatível com OpenAI (`/v1/chat/completions`) e `MCP` (`JSON-RPC 2.0`) (`mol-agent`)

`src/clai/service/openai_mcp_agent.py` e `scripts/mol_agent_server.py` (ponto de entrada da CLI `mol-agent`) expõem a cascata a ferramentas de codificação em IDE e em terminal (`Cursor`, `Continue.dev`, `Claude Code`, `Antigravity`, `SDK` da OpenAI) sem dependências web de terceiros: (i) `GET /v1/models` e `POST /v1/chat/completions` compatíveis com OpenAI (`stream: true/false` via `SSE`, cabeçalhos CORS, verificador determinístico opcional `x_mol_contract` e `x_mol_receipt`, que reporta `rung`, `skill_id`, `est_j`, `reported_j` e `measured_j: null`); e (ii) Model Context Protocol (`MCP` `JSON-RPC 2.0` sobre `--mcp-stdio` e `POST /mcp`), que expõe `mol_synthesize_verified_function`, `mol_repair_repo_pytest`, `mol_lookup_crystallized_skill` e `mol_energy_telemetry`, apoiados em `.mol/skills_v1.json` e `.mol/benes_lut6_router.npz` persistentes (`30 / 30` testes de `pytest` aprovados).

<div id="415-claim-la-15-official-bigcodebench-v013-32-evaluations-and-upstream-swe-bench-verified-sympy-git-worktree-16-evaluations-benchmarks-via-mcp-json-rpc-20" class="anchor-alias" aria-hidden="true"></div>

### 4.15 Afirmação LA-15: Benchmarks públicos oficiais `BigCodeBench v0.1.3` (`32` avaliações) e `SWE-bench Verified` upstream `SymPy` em git-worktree (`16` avaliações) via `MCP` `JSON-RPC 2.0`

`src/clai/frontier/external_public_benchmarks.py` e `scripts/run_external_public_benchmarks.py` (`artifacts/external_public_bcb_swebench.csv`, `artifacts/external_public_bcb_swebench_traces.json`) avaliam o Agente `MoL` `MCP` (`handle_mcp_jsonrpc` + cristalização `.mol/`) frente a frente contra `LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it` e `Qwen/Qwen3.6-35B-A3B` acelerado por Metal, executados de forma autônoma em dois benchmarks públicos oficiais Parquet da HuggingFace verificados por `SHA`-256 no carregamento (`bigcode/bigcodebench` `v0.1.3`: `ed5a3a39...`, `16` tarefas × `2` ondas de prompts escritos por humanos [`complete_prompt` na Onda 1 + `instruct_prompt` na Onda 2] = `32` avaliações `unittest`; e `princeton-nlp/SWE-bench_Verified`: `a45b1fe4...`, `8` checkouts reais em git-worktree de `sympy/sympy` `1.11-1.12` × `2` ondas = `16` avaliações `pytest` em `FAIL_TO_PASS + PASS_TO_PASS`) sob estrita ausência de vazamento de soluções padrão (delta de `PMU` do macOS `59,250.43 J`):

| Benchmark Público Oficial e Braço | W1 a Frio | W2 Paráfrase / Backport | Aprovação Verificada Geral | Quebrados Admitidos | Caminho Rápido `.mol/` W2 | Chamadas `35B` | Média W1 / W2 (`ms`) | `reported_j` / Resolução (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `BCB v0.1.3` (`32`) · `A` `LiquidAI/LFM3-1.7B` | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `0.00%` | `5,471` / `5,716` | `169.67 J` (`409.11 est_j`) |
| `BCB v0.1.3` (`32`) · `B` `google/gemma-4-E2B-it` | `31.25%` | `43.75%` | `37.50%` | `62.50%` | `0.00%` | `0.00%` | `12,187` / `9,791` | `190.91 J` (`1,230.76 est_j`) |
| `BCB v0.1.3` (`32`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `75.00%` | `81.25%` | `78.12%` | `21.88%` | `0.00%` | `100.00%` | `28,365` / `10,926` | `277.45 J` (`2,388.89 est_j`) |
| **`BCB v0.1.3` (`32`) · `D` Agente `MoL` `MCP` (Referência)** | **`87.50%`** | **`93.75%`** | **`90.62%`** | **`0.00%`** | **`81.25%`** | **`25.00%`** | **`47,321` / `6,001`** | **`263.54 J` (`1,917.44 est_j`)** |
| `SWE-bench Verified` `SymPy` (`16`) · `A` `LiquidAI/LFM3-1.7B` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `5,449` / `5,486` | `869.84 J` (`2,799.45 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `B` `google/gemma-4-E2B-it` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `8,304` / `5,040` | `1,015.22 J` (`4,483.82 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `100.00%` | `18,384` / `19,898` | `1,280.08 J` (`7,273.48 est_j`) |
| **`SWE-bench Verified` `SymPy` (`16`) · `D` Agente `MoL` `MCP` (Referência)** | **`50.00%`** | **`50.00%`** | **`50.00%`** | **`0.00%`** | **`50.00%`** | **`68.75%`** | **`131,976` / `17,215`** | **`6,130.89 J` (`0.33-0.44 J` W2 `.mol/`)** |

No `BigCodeBench v0.1.3` (Zhuo et al., 2024), o Agente `MoL` `MCP` supera o `Qwen3.6-35B-A3B` autônomo em **`+12.50` pontos percentuais (`90.62%` vs. `78.12%`, atingindo `93.75%` [`15/16`] na Onda 2 `instruct_prompt` parafraseada por humanos)** enquanto invoca o `35B` em apenas `25.00%` das tarefas, reduzindo a latência média da Onda 2 em **`7.89×`** (`47,321` para `6,001 ms`; `63-146 ms` e `0.09-0.13 J` de `reported_j` em `12` dos `13` acertos `.mol/`), e gastando **menos `reported_j` por resolução verificada (`263.54 J` vs. `277.45 J`)** com `0.00%` de saídas quebradas admitidas. No `SWE-bench Verified` upstream (Jimenez et al., 2024), a localização por `AST` e quadros de pilha sem vazamento identifica todos os `8 / 8` arquivos-alvo em `sympy/sympy` sem ler `patch`, e o `MoL` dobra a taxa de resolução verificada (**`50.00%` [`4/8`: `sympy-23534`, `23950`, `24066`, `24213`] vs. `25.00%` [`2/8`] no `35B` e `0.00%` no `LFM3`/`Gemma4`**), reproduzindo todas as `4` habilidades cristalizadas de `git diff` unificado na Onda 2 em **`1,590-1,720 ms` (`0.33-0.44 J` de `reported_j`, incluindo novo checkout `git worktree` + `pytest`)** enquanto se abstém com segurança (`VERIFIER_ABSTAIN_SAFE`) nas `4` questões algébricas multi-hunk não resolvidas (`0.00%` de patches quebrados admitidos).

<div id="416-claim-la-16-4-stage-250-mhz-pipelined-kria-kv260-xck26-benešcopybeneš--81-ramb36e2-rtl-subsystem-400-logic-depth-reduction" class="anchor-alias" aria-hidden="true"></div>

### 4.16 Afirmação LA-16: Subsistema RTL Beneš-Copy-Beneš + `81-RAMB36E2` em pipeline de `4` estágios a `250 MHz` no Kria KV260 (`xck26`) (redução de `4.00×` na profundidade lógica)

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv` e `scripts/verify_pipelined_250mhz_rtl.py` (`artifacts/kv260_pipelined_250mhz_rtl.csv`, `artifacts/kv260_pipelined_250mhz_meta.json`) abordam ambas as restrições de projeto físico identificadas na auditoria sem pipeline (§4.24-§4.25) inserindo três paredes de registradores síncronos de pipeline através de `Beneš-1` (`9` estágios), `Copy + Beneš-2[0..3]` + leitura paralela de tag/página em `RAMB36E2`, `Beneš-2[4..8]` e `80 × LUT6` + votante popcount dobrado de `16` bits, encapsulados dentro de uma casca `AXI4-Stream` de `64` bits segura para `IOB` (`clai_benes_axi_stream_250mhz_top`):

| Variante RTL do KV260 (`xck26-sfvc784-2LV-c`) | Estágios (`CPI`) | Profundidade Síncrona Reg-a-Reg | `IOB`s de Topo (`<= 189`) | LUTs CLB `xcup` (`%`) | FFs `xcup` (`%`) | `RAMB36E2` (`%`) | `DSP48E2` | Paridade de Stream no Verilator |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `U1` `clai_benes_paged_hotswap_core` (`1`-cyc `OOC`) | `1` (`1.00`) | `52` níveis | `1,600` (`No`) | `41,186` (`35.17%`) | `36,464` (`15.57%`) | `81` (`56.25%`) | `0` | `100.0%` |
| `U2` `clai_kv260_axi_top` (`AXI4` Rung-0 sem pipeline) | `1` (`1.00`) | `60` níveis | `127` (`Yes`) | `67,366` (`57.52%`) | `16,619` (`7.09%`) | `4` (`2.78%`) | `0` | `100.0%` |
| **`P4` `clai_benes_paged_pipelined_250mhz` (`OOC`)** | **`4` (`1.00`)** | **`13` níveis (`4.00×`)** | `1,600` (`OOC`) | **`41,439` (`35.38%`)** | **`47,922` (`20.46%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |
| **`P4-AXIS` `clai_benes_axi_stream_250mhz_top` (Referência)** | **`5` (`1.00`)** | **`13` níveis (`4.62×`)** | **`170` (`Yes`)** | **`41,459` (`35.40%`)** | **`48,979` (`20.91%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |

A travessia de grafo através das fronteiras síncronas achatadas de `synth_xilinx -family xcup` (`FDRE`/`RAMB36E2`/`IBUF` até `FDRE`/`RAMB36E2`/`OBUF`, excluindo cadeias multiciclo de contadores de telemetria `CARRY4` que o `ltp -noff` do Yosys percorre através dos pinos de relógio caixa-preta de `FDRE`) estabelece que a profundidade combinacional de ciclo único cai em **`4.00×`**, de `52` níveis (`60` em `U2`) para **`13` níveis**, ao custo de apenas `+253` LUTs CLB (`+0.21%` do `xck26`), respeita o orçamento de pinos do `xck26-sfvc784-2LV-c` (**`170 <= 189` `IOB`s**) e aprova **`256 / 256` batidas consecutivas sem bolhas (`CPI = 1.00`, `0` erros)** no Verilator `5.054`.

<div id="417-claim-la-17-bounded-open-weights-rung-3d-native-think-ceiling-9167-overall-9375-wave-2-and-wave-3-000-broken-commits" class="anchor-alias" aria-hidden="true"></div>

### 4.17 Afirmação LA-17: Teto nativo `<think>` limitado em pesos abertos no `Rung 3d` (`91.67%` no geral, `93.75%` na Onda 2 e na Onda 3, `0.00%` de commits quebrados)

`scripts/run_rung3d_thinking_ceiling.py` (`artifacts/frontier_ai_rung3d_ceiling.csv`, `artifacts/frontier_ai_rung3d_ceiling_traces.json`) adiciona um **degrau opcional de raciocínio `Rung 3d` limitado em pesos abertos** (`Qwen/Qwen3.6-35B-A3B` com `enable_thinking=True` nativo, orçamento de `1,536-2,200` tokens `<think>`, `100%` pesos locais Apache-2.0, zero APIs proprietárias na nuvem) invocado estritamente nas tarefas residuais em que os degraus `0-3c` se abstêm ao longo do comparativo de engenharia de `48` tarefas (`16` especificações × `3` ondas):
- **`Arm H` (`MoL + Rung 3d Qwen3.6-35B-A3B <think>`)** eleva a taxa de aprovação verificada de `87.50%` (`Arm G`) para **`87.50%` W1 a Frio, `93.75%` (`15 / 16`) W2 Adaptação, `93.75%` (`15 / 16`) W3 Quente e `91.67%` (`44 / 48`) no Geral** (**`+14.59` pontos percentuais** acima dos `77.08%` do `Qwen3.6-35B-A3B` autônomo), invocando o `35B` em `20.83%` das tarefas (`Rung 3d` `<think>` desperta em **`5 / 48 = 10.42%`** das tarefas).
- Especificamente, o `Rung 3d` deriva um solucionador verificado de permutação `4×4` de Waksman de `6` chaves em `W2_11_F11_benes4_route` em `2,185` tokens `<think>` e o compila em `Skill#17`, reproduzindo `W3_11` em `< 3.8 ms` (`0.0351 J` de `reported_j` médio nas `15` resoluções cristalizadas da Onda 3), enquanto `F10_true_damerau` (conflito de prior `OSA` vs. `DP` alfabética irrestrita de Lowrance-Wagner) aciona `VERIFIER_ABSTAIN_SAFE` (`0.00%` de commits quebrados admitidos).

<div id="418-claim-la-18-zero-python-cross-platform-rust-burn-0221--cubecl-fused-int4-sparse-moe--gateddeltanet-kernels" class="anchor-alias" aria-hidden="true"></div>

### 4.18 Afirmação LA-18: Kernels fundidos `INT4` Sparse-MoE e `GatedDeltaNet` em Rust `Burn 0.22.1 / CubeCL` multiplataforma sem Python

`sys/rust/src/kernels/q4_moe_deltanet_cube.rs` e `sys/rust/src/bin/bench_cubecl_moe_deltanet.rs` (`artifacts/cubecl_cross_platform_moe_deltanet.csv`, `artifacts/cubecl_cross_platform_moe_deltanet_meta.json`) portam os shaders fundidos `INT4` Block-64 Sparse-MoE (`q4_moe_gate_up_silu_cube_kernel` + `q4_moe_down_weighted_cube_kernel`, desempacotamento em registrador `u32` de 8 nibbles sem buffers de pesos de especialistas em `FP16`/`FP32`) e `GatedDeltaNet` (`gated_delta_recurrent_k128_cube_kernel`) para **kernels `#[cube]` em Rust puro `Burn 0.22.1 / CubeCL`**, mirando `Metal`, `Vulkan` (`SPIR`-V), `CUDA` (`PTX`), `ROC`m (`HIP`) e `LLVM` `SIMD` `CPU` a partir de uma única base de código:

| Kernel Portátil Rust `Burn 0.22.1 / CubeCL` e Formato | Backend Alvo | Latência Média (`ms`) | Aceleração vs. Host `FP32` | Erro Máx. Abs. `FP32` | Alvos Portáteis de Shader |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `Host_Scalar_FP32_Ref` | `27.2480 ms` | `1.00×` | `0.0` | Rust `std` |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `CubeCL_LLVM_CPU` | `10.2213 ms` | **`2.67×`** | `1.49 × 10⁻⁷` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`)** | **`CubeCL_Metal_GPU`** | **`0.7765 ms`** | **`35.09×`** | **`1.79 × 10⁻⁷`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `Host_Scalar_FP32_Ref` | `166.8918 ms` | `1.00×` | `0.0` | Rust `std` |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `CubeCL_LLVM_CPU` | `11.2224 ms` | **`14.87×`** | `1.49 × 10⁻⁸` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`)** | **`CubeCL_Metal_GPU`** | **`2.4118 ms`** | **`69.20×`** | **`2.24 × 10⁻⁸`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |

<div id="419-claim-la-19-six-kernel-paranoid-formal-proof-verification-of-section-2-27-theorems-66-independent-kernels-cve-2026-72844-hardened" class="anchor-alias" aria-hidden="true"></div>

### 4.19 Afirmação LA-19: Verificação formal paranoica de provas da Seção 2 em seis kernels (`27` teoremas, `6/6` kernels independentes, endurecida contra `CVE-2026-72844`)

Entre julho e novembro de 2026, divulgações de solidez e de reprodução de `.olean` no Lean 4 - `CVE-2026-72844` (`leanprover/lean4#14576`, parâmetros fantasmas em tipos indutivos aninhados combinados com confusão de projeção de estrutura `.proj` `CWE-843` em `<= v4.31.0`, tornada pública por meio de um repositório de refutação de Collatz assistido por inteligência artificial e corrigida pela Lean `FRO` na `v4.32.2`), `CVE-2026-72711` (`leanprover/lean4#14484`, verificação ausente de variável local em `add_opaque`), omissão de `.inductInfo` forjado em `Kernel.Environment.replay` (`#16688`), divergências de reprodução/sidecar `.olean.server` (`#16674`, `#16675`) e contornos de `native_decide` (`Lean.ofReduceBool` `FFI`, `#16693`) explorados por aprendizado por reforço - demonstraram que a garantia formal não deve repousar em um único verificador C++ ou em reprodução de `.olean` fora de sandbox. `proofs/` (`LutAdapt/{Cascade,BenesCopy,JointMinterm,ConformalProvenance}.lean`) e `scripts/verify_lean_proofs.py` (`artifacts/lean4_formal_proofs_summary.csv`, `artifacts/lean4_six_kernel_paranoid_audit.csv`, `artifacts/lean4_formal_proofs_meta.json`) impõem zero `sorry`, zero `axiom` customizados, zero `opaque`, zero indutivos aninhados e zero `Lean.ofReduceBool`, compilam de forma limpa no **Lean `4.36.0`** (`1,041.55 ms`, `0.3236 J` de `reported_j` no Darwin) e aprovam em **`lake check --paranoid`** tanto em Apple Silicon (`175,798.92 ms`, `77.7477 J` de `reported_j` no Darwin) quanto dentro de um namespace Linux não privilegiado `bubblewrap 0.11.1` (`bwrap`) somente leitura e isolado de rede (`237,823.64 ms`, `1,461.62 J` no núcleo / `22,371.48 J` no pacote `RAPL` `reported_j`, arquivado em `openie-research-experiments/lut-adapt-bwrap-paranoid/` no commit `1f50db59`) em **todos os seis kernels independentes** (Figura 6):

| Módulo Lean `4.36.0` (`proofs/LutAdapt/`) | Teoremas Verificados | Cobertura da Seção 2 | `sorry` / Custom / `ofReduceBool` | Pegada de Axiomas (`#print axioms`) |
| :--- | :---: | :--- | :---: | :--- |
| **`Cascade.lean`** | `7` | Trocas adjacentes e de prefixo de Simon-Kadane (`p₁/c₁ > p₂/c₂`), economia líquida e horizonte $\Delta T^*$ da Proposição 1, recusa sob churn sem acertos | `0` / `0` / `0` | `3` livres de escolha (`propext`, `Quot.sound`); `4` `ZFC` padrão |
| **`BenesCopy.lean`** | `7` | Teorema 2 `512×512` Beneš-Copy-Beneš (`43` estágios, `11,008` bits de chave), partição de `4` estágios `<= 13` níveis, intervalos disjuntos de cópia, não contenção modular de Lee | `0` / `0` / `0` | **`2` puramente construtivos (`0` axiomas)**; `5` livres de escolha |
| **`JointMinterm.lean`** | `7` | Dominância da Proposição 3, garantia dentro do suporte, testemunha quimera marginal `(40,35,25)`, bijeção de rajada `BPE` em `uint64` (`K=4` `LFM2`, `K=3` `LFM3`/`Qwen3.6`) | `0` / `0` / `0` | **`1` puramente construtivo (`0` axiomas)**; `6` livres de escolha |
| **`ConformalProvenance.lean`** | `6` | Abstenção em raio fora da variedade do Resultado 4, limite conformal em amostra finita, equilíbrio `ACI`, reticulado de proveniência (`ModelGenerated ↛ Deterministic`), paridade especulativa gulosa | `0` / `0` / `0` | **`2` puramente construtivos (`0` axiomas)**; `4` livres de escolha |
| **Total (`LutAdapt.lean`, Referência)** | **`27`** | **Todos os `4` Resultados da Seção 2 + Corolários de Hardware / Proveniência** | **`0` / `0` / `0`** | **`5` sem axiomas; `23/27` livres de escolha; `6/6` kernels aceitam** |

| Verificador de Provas Independente (`lake check --paranoid`) | Implementação e Base de Solidez | Declarações Verificadas | Veredito | Classes de Vulnerabilidade Mitigadas |
| :--- | :--- | :---: | :---: | :--- |
| **`con-leche --verified`** | Kernel mínimo de referência (Breitner) provado formalmente consistente na teoria dos conjuntos `ZFC` (não pode aceitar `False`) | `58,683` | **`Accepts`** | `CVE-2026-72844` (`.proj` indutivo aninhado), `CVE-2026-72711` (`add_opaque`), bugs de cache `WHNF` |
| **`con-ron --verified`** | Refinamento em Rust de `con-leche` verificado com *Aeneas* | `58,683` | **`Accepts`** | `CVE-2026-72844`, `CVE-2026-72711`, bugs de memória C++ e bignum `GMP` (`#14833`) |
| **`lean4lean`** | Verificador de tipos `CIC` independente Lean-em-Lean (Carneiro) | `58,685` | **`Accepts`** | Divergência de implementação do kernel C++ e tipagem de projeção |
| **`nanoda`** | Verificador autônomo de exportação em Rust sem runtime Lean (`sorryAx` bloqueado) | `58,685` | **`Accepts`** | Adulteração de serialização `.olean` e `sorryAx` não permitido |
| **`leanchecker --paranoid`** | Reprodução do kernel C++ em ambiente limpo com zero confiança em táticas | `58,685` | **`Accepts`** | Mutação de ambiente por metaprogramação e `debug.skipKernelTC` |
| **`Lean v4.36.0` (padrão)** | Kernel C++ pós-`CVE` de novembro de 2026 (`#print axioms` imposto) | `58,685` | **`Accepts`** | Todos os `CVE`s do verão/outono de 2026 corrigidos; `0` `Lean.ofReduceBool` |

![Figura 6. Garantia Formal de Provas em Seis Kernels e Pilha Compilada em Três Camadas.](/figures/lut-adapt/six-kernel-trust-and-stack.svg)

*Figura 6. Auditoria formal paranoica de provas em seis kernels (`Claim LA-19`, esquerda) e a pilha compilada em três camadas abrangendo RTL `LUT6` controlado por `CE`, compilação descendente `MoL` e despacho `MCP` em Rust de binário único (`Claim LA-23`, direita). [PNG](/figures/lut-adapt/six-kernel-trust-and-stack.png) · [Explorador interativo](/living/lut-adapt/#la-tab-01).*

<div id="420-claim-la-20-multi-repository-upstream-swe-bench-verified-4-repositories-24-git-worktree-evaluations-with-multi-window-ast-call-graph-localization" class="anchor-alias" aria-hidden="true"></div>

### 4.20 Afirmação LA-20: `SWE-bench Verified` upstream multirrepositório (`4` repositórios, `24` avaliações em git-worktree) com localização por grafo de chamadas `AST` em múltiplas janelas

`src/clai/frontier/multirepo_swebench.py` e `scripts/run_multirepo_swebench_benchmark.py` (`artifacts/multirepo_swebench_verified.csv`, `artifacts/multirepo_swebench_verified_traces.json`) estendem a avaliação sem vazamento de solução padrão de `princeton-nlp/SWE-bench_Verified` (`SHA`-256 `a45b1fe4...`) por **`4` repositórios Python upstream distintos** (`django/django` [`4`], `pytest-dev/pytest` [`3`], `psf/requests` [`2`] e `sympy/sympy` [`3`] × `2` ondas = **`24` avaliações isoladas em `git worktree`**), adicionando um **Localizador de Grafo de Chamadas `AST` em Múltiplas Janelas** que percorre arestas `ast.Call` intra-arquivo (`helper(...)` / `self._helper(...)`) para extrair `2` janelas `AST` não sobrepostas (`91.67%` [`11/12`] de localização exata do arquivo-verdade sem nenhum acesso a `patch`, `apple_pmu_system_energy_delta_j = 60,935.10 J`):

| Braço Multirrepositório `SWE-bench Verified` (`4` Repos, `24` Evals) | W1 a Frio | W2 Backport | Verificado Geral | `django` / `pytest` / `requests` / `sympy` | Patches Quebrados | Caminho Rápido `.mol/` W2 | Média W1 / W2 (`ms`) | `reported_j` / Correção Verificada |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (`1`-Shot) | `0.00%` | `8.33%` | `4.17%` | `0%` / `0%` / `0%` / `17%` | `95.83%` | `0.00%` | `6,197` / `6,481` | `2,294.45 J` |
| `B` `google/gemma-4-E2B-it` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `10,630` / `7,359` | `845.34 J` |
| `C` `Qwen/Qwen3.6-35B-A3B` Metal (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `32,912` / `28,165` | `4,558.58 J` |
| `D` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `26,247` / `25,693` | `3,439.64 J` |
| **`E` Agente `MoL` `MCP` Multirrepositório (Referência)** | **`16.67%`** | **`25.00%`** | **`20.83%` (`2.50×`)** | **`25%` / `0%` / `50%` / `17%`** | **`0.00%`** | **`16.67%` (`100%` da W1)** | **`184,906` / `55,254`** | **`12,176.51 J` (`1.12-5.50 J` acertos W2)** |

Em `django`, `pytest`, `requests` e `sympy`, cada modelo autônomo `1`-shot (`LFM3-1.7B`, `Gemma-4-E2B`, `Qwen3.6-35B-A3B` e `Devstral-Small-2-24B`) estagna em `4.17%-8.33%` de aprovação verificada e admite **`91.67%-95.83%` de patches quebrados** (agregação em `ORM`, estruturas internas de fixtures do `pytest`, tratamento de `URL` de proxy `IDNA`). O Agente `MoL` `MCP` Multirrepositório atinge **`20.83%` no geral (`25.00%` na Onda 2, `2.50×` os modelos autônomos de `24B` e `35B`)** em **`3` dos `4` repositórios** (`django__django-17029` via `Gemma-4-E2B`, reproduzido em **`2,028.24 ms` / `5.50 J`** via `MCP_Rung0_BenesLUT6->GitDiffSkill#1`; `psf__requests-6028` via `Rung 3d Qwen3.6-35B <think> CxRepair`, reproduzido em **`592.87 ms` / `1.12 J`** via `GitDiffSkill#2`, onde `0%` dos modelos autônomos `1`-shot passaram; e `sympy__sympy-24213` via `Rung 2 LFM3-1.7B`), admitindo **`0.00%` de patches quebrados**.

<div id="421-claim-la-21-measured-120b-scale-open-weights-hybrid-mamba-attention-sparse-moe-nvidianemotron-3-super-120b-a12b--devstral-small-2-24b-apex-cascade" class="anchor-alias" aria-hidden="true"></div>

### 4.21 Afirmação LA-21: Cascata de ápice medida em escala `120B` de pesos abertos com Mamba-Attention Híbrido Sparse-MoE (`nvidia/Nemotron-3-Super-120B-A12B`) e `Devstral-Small-2-24B`

`src/clai/frontier/frontier_120b_hybrid_moe.py` e `scripts/run_120b_hybrid_moe_benchmark.py` (`artifacts/frontier_120b_hybrid_moe_apex.csv`, `artifacts/frontier_120b_hybrid_moe_apex_traces.json`) substituem a ressalva de projeção `70B+` da Seção 6 pela execução local direta de **`nvidia/Nemotron-3-Super-120B-A12B`** (`120B` totais / `12B` ativos em Mamba-Attention Híbrido Sparse-MoE, `56.9 GiB` em `GGUF` `Q3_K_S` de 2 fragmentos) e **`Devstral-Small-2-24B-Instruct`** (especialista denso de `24B` em `SWE`, `GGUF` `Q4_K_M`) no Apple M5 Max (`128 GiB` de Memória Unificada) via `llama-server` com Metal, registrando `ri_resident_size` (`RSS`) do processo filho, `ri_phys_footprint`, `ri_energy_nj` (`buf[42]`) `L3` do filho e `GPU Energy` `IOReport` `L2` nas `8` especificações adversariais mais difíceis × `2` ondas (`16` avaliações, incluindo `BigCodeBench/6`, `BigCodeBench/8`, `F10_true_damerau` e `F11_benes4_route`):

| Braço de Fronteira Medido `24B` / `120B` (`16` Avaliações Difíceis) | Parâmetros (Ativos) | Pico de `RSS` Residente | Média de `tok/s` | W1 Difícil-`8` | W2 Quente | Aprovação Geral | Commits Quebrados | Caminho Rápido `.mol/` W2 | Média W1 / W2 (`ms`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `24.0B` (`24.0B`) | `16,797.3 MB` | `22.37` | `37.50%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `20,734` / `17,890` |
| `B` `nvidia/Nemotron-3-Super-120B-A12B` (`1`-Shot) | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `21,831` / `23,205` |
| **`C` Cascata de Ápice `MoL` `24B+120B` (Referência)** | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | **`62.50%`** | **`62.50%`** | **`62.50%`** | **`0.00%`** | **`62.50%` (`100%` da W1)** | **`53,493` / `19,642` (`5.5-70 ms` `.mol/`)** |

Como o `Nemotron-3-Super-120B-A12B` ativa `12B` parâmetros MoE Mamba-Attention por token (`50%` menos pesos ativos do que o modelo denso de `24B`), ele sustenta **`22.17 tok/s`** dentro de `58.08 GB` de Memória Unificada residente (`9.67 GB` de pegada anônima `KV`/`SSM`), igualando a velocidade de decodificação densa de `24B` com `5×` a escala total de parâmetros. Combinar `BenesLUT6` + `.mol/` + escalonamento por contraexemplo de $C(z)$ entre `Devstral-2-24B` e `Nemotron-3-120B-A12B` eleva a aprovação verificada para **`62.50%` (`+18.75` pontos percentuais acima do `120B-A12B` autônomo, `2.00×` o `24B` autônomo)**, fecha `BigCodeBench/8` (`W1_09_BigCodeBench_8_complete`) e reproduz todas as `5` habilidades cristalizadas na Onda 2 em **`5.49-69.76 ms` (`0.0118-0.0272 J` de `reported_j`)** contra `10,092-40,905 ms` no `120B` autônomo (`0.00%` de commits quebrados; uma janela `W3_10` de `42.7 s` sofreu um transbordamento do acumulador `IOReport` do `OS` antes do ajuste da proteção de transbordamento de `TDP` em `joule_meter.py` de `450 W` para `175 W`, preservado sem edição no `CSV`).

<div id="422-claim-la-22-clock-enable-ce-gated-250-mhz-p4-axis-kria-kv260-xck26-verilator-vcd-dynamic-power-audit-410-idle--269-packet-shift-reduction" class="anchor-alias" aria-hidden="true"></div>

### 4.22 Afirmação LA-22: Auditoria de potência dinâmica `VCD` no Verilator para `P4-AXIS` a `250 MHz` com clock-enable (`CE`) controlado no Kria KV260 (`xck26`) (redução de `4.10×` em repouso e `2.69×` no deslocamento de pacotes)

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv` (`ENABLE_CE_GATING = 1`) e `scripts/verify_ce_gated_vcd_power.py` (`artifacts/kv260_ce_gated_vcd_power.csv`, `artifacts/kv260_ce_gated_vcd_power_meta.json`) implementam a otimização de clock-gating de `ENARDEN` identificada na §4.25 diretamente dentro do projeto `P4-AXIS` de `4` estágios a `250 MHz` (`clai_uram_lut6_page_cache_ce` + gating de `FDRE` nos estágios `S1..S4` por bolha de validade), avaliada via extração de alternâncias `VCD` do `Verilator 5.054 --trace` + `AMD DS925` (`xck26`, `VCCINT = 0.72 V`, `250 MHz`, classe `est_j`):

| Variante `P4-AXIS` do `xck26` (`13` Níveis, `170` `IOB`s, `81` `RAMB36E2`) | Carga de Trabalho (`Ciclos`, Ciclo Útil de Consulta) | Transições de Sinal `VCD` / Cic | `pJ / cyc` Est. | `mW` Dinâmicos Est. @ `250 MHz` (`[Baixo, Alto]`) | Redução de Potência vs. Sem Gating | Paridade no Verilator (`320` Batidas) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `idle_quiescent_256` (`0.0%`) | `0.07` | `255.96 pJ` | `63.99 mW` (`[48.00, 82.22]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Referência)** | **`idle_quiescent_256` (`0.0%`)** | **`0.07`** | **`62.37 pJ`** | **`15.59 mW` (`[10.34, 21.88]`)** | **`4.10×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `axis_beat_shift_512` (`12.5%`) | `3,852.19` | `278.47 pJ` | `69.62 mW` (`[51.84, 90.10]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Referência)** | **`axis_beat_shift_512` (`12.5%`)** | **`1,413.22` (`2.73×` menos)** | **`103.35 pJ`** | **`25.84 mW` (`[18.06, 35.00]`)** | **`2.69×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `zero_bubble_burst_256` (`100.0%`) | `12,134.41` | `392.20 pJ` | `98.05 mW` (`[72.38, 127.68]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (Referência)** | **`zero_bubble_burst_256` (`100.0%`)** | **`4,451.65` (`2.73×` menos)** | **`374.15 pJ`** | **`93.54 mW` (`[69.76, 120.44]`)** | **`1.05×`** | **`100.0%`** |

Adicionar gating de `ENARDEN` + `CE` por bolha de validade acrescenta `+9` LUTs CLB (`41,456` para `41,465`, `0` FFs extras, retendo **`13` níveis lógicos síncronos** e **`170 <= 189` `IOB`s**), preserva **`320 / 320` (`100.0%`) de paridade de saída exata bit a bit** entre `CE=0` e `CE=1`, e corta a potência dinâmica em repouso em **`4.10×`** (`63.99` para **`15.59 est_mW`**) e a potência de ingestão de pacotes `AXI4-Stream` de `64` bits (ciclo útil de consulta `1`-de-`8`) em **`2.69×`** (`69.62` para **`25.84 est_mW`**).

<div id="423-claim-la-23-zero-python-single-binary-native-rust-mol-agent-rs-server-0154-msreq-mcp-1721-faster-than-python-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.23 Afirmação LA-23: Servidor nativo em Rust `mol-agent-rs` de binário único sem Python (`0.154 ms/req` em `MCP`, `17.21×` mais rápido que o `mol-agent` em Python)

`sys/rust/src/bin/mol_agent.rs` (`artifacts/rust_mol_agent_server_bench.csv`, `artifacts/rust_mol_agent_server_meta.json`) compila um binário nativo autônomo em Rust (`cargo run --release --bin mol_agent`) com **zero interpretador Python ou dependências `HTTP` de terceiros**, servindo OpenAI `GET /v1/models`, REST + `SSE` `POST /v1/chat/completions` e `MCP` `JSON-RPC 2.0` (`POST /mcp` + `--mcp-stdio`) diretamente sobre `.mol/skills_v1.json` (`17` habilidades cristalizadas) + verificação `Burn 0.22.1 / CubeCL` em `CubeCL_Metal_GPU` + telemetria Darwin `proc_pid_rusage(RUSAGE_INFO_V6)` `ri_energy_nj` (`words[42]`):

| Endpoint Local Loopback do Agente | Pilha de Execução | Latência Média (`ms/req`) | Aceleração vs. `MCP` Python | `reported_j / req` Darwin `L3` | Zero Deps Python |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `MCP` `mol_lookup_crystallized_skill` (`Python`) | Python `3.13` `http.server` | `2.6503 ms` | `1.00×` | `0.000450 J` | `false` |
| **`MCP` `mol_lookup_crystallized_skill` (Referência)** | **Rust `1.100` `std::net` + `BenesLUT6`** | **`0.1540 ms` (`154.0 µs`)** | **`17.21×`** | **`0.000272 J`** | **`true`** |
| **OpenAI `POST /v1/chat/completions` (Referência)** | **Rust `1.100` `std::net` + `BenesLUT6` (REST+`SSE`)** | **`0.1504 ms` (`150.4 µs`)** | **`17.62×`** | **`0.000272 J`** | **`true`** |
| **`MCP` `mol_cubecl_gpu_verify` (Referência)** | **Rust `1.100` + `Burn 0.22.1` `CubeCL_Metal_GPU`** | **`0.9887 ms`** | - | **`0.000272 J` (`L3` `CPU`)** | **`true`** |

<div id="424-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.24 Decomposição de Primitivas do Subsistema Completo, Profundidade Topológica e Sondagem de Hardware em `xck26-sfvc784-2LV-c` com `Vivado 2026.1`

Para auditar tanto o núcleo especulativo independente de 512 páginas (`clai_benes_paged_hotswap_core` em `hw/kv260/rtl/clai_benes_hotswap_core.sv`) quanto o subsistema Rung-0 completo, com barramentos AXI4-Lite e AXI4-Stream da Arquitetura de Barramento para Microcontroladores Avançados (`AMBA`) (`clai_kv260_axi_top` em `hw/kv260/rtl/clai_kv260_axi_top.sv`, `clai_engram_streamer.sv`, `clai_rung0_hotswap_core.sv` e `artifacts/clai_rung0_kv260.v`, no commit `a5e9bc1de280`, sem alterações em `91a2213`), contra a parte exata AMD Kria KV260 (`xck26-sfvc784-2LV-c`: 117,120 LUTs de CLB, 234,240 flip-flops de CLB, 144 blocos `RAMB36E2`, 64 blocos UltraRAM de 288 Kbit (`URAM288`), 1.248 slices de processamento digital de sinais UltraScale+ (`DSP48E2`) e 189 blocos de entrada/saída do usuário (`IOB`s)), foram executadas três verificações de hardware e de automação de projeto eletrônico (EDA) em uma estação de trabalho Intel Core i9-13900H (`Linux 7.0.0-43-generic x86-64`):

1. **Grupo de Ação de Teste Conjunto (`JTAG`) somente de leitura e sonda de Barramento Serial Universal (`USB`) (`Xilinx hw_server v2026.1` + Ferramenta de Linha de Comando de Software Xilinx (`XSDB`))**: Embora `lsusb` tenha reportado uma ponte Future Technology Devices International (`FTDI`) `0403:6010` (`FT2232C/D/H` dual universal asynchronous receiver-transmitter (`UART`) / first-in first-out (`FIFO`) circuito integrado (`IC`)) anexada, a inspeção das cadeias de fornecedor/produto USB `sysfs` do Linux (`idVendor = 0403`, `idProduct = 6010`) identificou o dispositivo como `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"` em vez de um portador Kria KV260. A consulta a `hw_server v2026.1` (Build May 29, 2026) via `xsdb` (`connect; jtag targets; targets`) retornou **`0` dispositivos Xilinx `JTAG` e `0` alvos de Porta de Acesso de Depuração (`DAP`)** (`board_metered = false`, `measured_j = None`).
2. **`Vivado 2026.1` portão de síntese em lote e licenciamento (`SW Build 6511674`)**: Um script de lote não-projeto de baixo consumo reproduzível (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, visando `xck26-sfvc784-2LV-c` a `250.0 MHz` / `4.000 ns` em modo fora de contexto (`OOC`)) foi preparado contra `/tools/Xilinx/2026.1/Vivado/bin/vivado`. O lançamento de `vivado v2026.1` em modo de lote saiu antes de `synth_design` (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`), porque AMD `Vivado 2025.1+` / `2026.1` requer um arquivo `.lic` Standard/Enterprise gerado explicitamente pelo utilizador (`~/.Xilinx/Xilinx.lic` ou `XILINXD_LICENSE_FILE`) mesmo para peças `xck26` de nível Standard e zero arquivos `.lic` foram instalados na estação de trabalho. De acordo com regras de medição estritas, `WNS` pós-rota, frequência máxima de relógio colocada e roteada, e `report_power` vectorless (`est_j`) permanecem registados como `not_available` até que um arquivo `.lic` Standard seja provisionado.
3. **Decomposição primitiva UltraScale+ `xcup` de subsistema completo, orçamento `IOB` e auditoria de nível lógico topológico (`Yosys 0.71+`)**: A síntese de ambos `clai_benes_paged_hotswap_core` e `clai_kv260_axi_top` via `synth_xilinx -family xcup` e `ltp -noff` (enquanto se regista o `RAPL package-0` do anfitrião `reported_j` estritamente como custo de compilação `x86-64` `EDA` $E_{\text{compile}}$, nunca como potência de silício FPGA) estabeleceu contagens exatas de células e profundidades combinacionais do caminho crítico:

| `xck26-sfvc784-2LV-c` Módulo Alvo | LUTs CLB (`% xck26`) | Primitivas LUT Dominantes | Registradores CLB (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | Portas Top (`IBUF`+`OBUF`) | Profundidade Combinacional (`ltp`) | Host Synth `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` páginas) | **`41,185`** (`35.17%`) | `19,982 LUT3`, `7,804 LUT6`, `7,714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36,464`** (`15.57%`) | **`81`** (`56.25%`) | **`0`** | `1,599` (`OOC` / bus interno) | **`81` níveis** | `7,297.3 J` (`144.8 s`) |
| **`clai_kv260_axi_top`** (`subsys Rung-0 AXI4`) | **`67,366`** (`57.52%`) | `25,557 LUT6`, `25,333 LUT5`, `7,918 LUT3`, `569 CARRY4` | **`16,619`** (`7.09%`) | **`4`** (`2.78%`) | **`0`** | `126` (`<= 189` `IOB`s; `PS-PL`) | **`73` níveis** | `10,089.4 J` (`214.8 s`) |

Duas restrições concretas de projeto físico emergem do primitivo `xcup` e da auditoria `ltp`:

- **Confinamento do orçamento de pinos (`OOC` vs. wrapper `AXI` `PS-PL`)**: Como `clai_benes_paged_hotswap_core` expõe o barramento bruto `CodeBitBus` de `512` bits e vetores largos de configuração sombra (`1.379` buffers de entrada (`IBUF`) + `220` buffers de saída (`OBUF`) = `1.599` portas vs. `189` `IOB`s do pacote `xck26-sfvc784-2LV-c`), a implementação autônoma no fornecedor deve ser executada com `synth_design -mode out_of_context` ou dentro de um wrapper `AXI4-Stream` / `zynq_ultra_ps_e`, como `clai_kv260_axi_top` (`126` portas, utilização de LUT de `57,52%`).
- **Profundidade combinacional sem pipeline (`81` e `73` níveis) versus fechamento de `250 MHz` (`4.000 ns`) em `-2LV`**: Embora o Verilator `5.054` verifique `CPI = 1.0` ciclo a ciclo (`1` consulta por ciclo de relógio), percorrer `17` estágios `Beneš-1` + `9` estágios de cópia por prefixo + `17` estágios `Beneš-2` + multiplexação dinâmica de tabela-verdade `LUT6` + redução por maioria de `5` votantes em um único ciclo combinacional abrange **`81` níveis de primitivas** (`73` níveis por módulo hierárquico no popcount combinacional de `64` entradas e no comparador de margem de `8` classes de `clai_kv260_axi_top`). Fechar `250 MHz` (`4.000 ns`) após place-and-route em silício `-2LV` de baixa tensão (`0,72 V`) favorece, portanto, a inserção de estágios de registradores de pipeline ao longo de $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ e a compressão da redução popcount de `64` fios (implementada na `Claim LA-16` acima e quantificada analiticamente na §4.25).

<div id="425-gate-level-xcup-primitive--verilator-vcd-switching-activity-datasheet-audit-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.25 Primitivo `xcup` em Nível de Porta e Auditoria de Folha de Dados de Atividade de Comutação `VCD` do `Verilator` (`est_j`)

Como o AMD `Vivado 2026.1` foi bloqueado por um ficheiro `.lic` em falta e zero placas físicas `xck26` estavam ligadas (§4.24), uma forma de onda pré-registada `Verilator 5.054` `--trace` e uma auditoria `Yosys 0.71+` achatada `synth_xilinx -family xcup` (`PREREG_xck26_vcd.json`, SHA-256 `c64505d177515c47…`) extraiu transições exatas de sinal por ciclo de `openIE-dev/lut-adapt-ai` (`af152ba`, inalterado em `91a2213`) em quatro fases operacionais (`idle_quiescent`, `steady_lut6_eval_2048_cycles`, `single_cycle_page_switch_512_burst` e `shadow_page_stream_write`, zero erros de co-simulação em `3.072` pesquisas paginadas e em todos os pacotes de rajada `AXI4-Lite`/`AXI4-Stream`). Todos os números de potência e energia nesta subsecção são estritamente uma estimativa analítica de comutação dinâmica (**`est_j` / `est_pJ/cycle` / `est_mW`**, **`measured_j = None`**, **`reported_j = None`**, **`board_metered = false`**), excluindo fugas estáticas de silício e nunca substituindo o `Vivado report_power` colocado e roteado ou leituras dos trilhos `INA260` do KV260.

A síntese achatada `xcup` mapeia `clai_benes_paged_hotswap_core` (`512` páginas) para **`41.623` CLB LUTs** (`35,54%` de `xck26`, versus `41.185` hierárquicos na §4.24; `19.982 LUT3`, `7.853 LUT6`, `7.738 LUT5`, `3.380 LUT4`, `2.670 LUT2`, `36 MUXF7`, `18 MUXF8`), `36.464` `FDRE` (`15,57%`) e `81` `RAMB36E2` (`56,25%`) em `27.157` redes `VCD` únicas (`90.124` bits internos: `64.218` combinacionais, `20.767` sequenciais), e mapeia `clai_kv260_axi_top` para **`66.881` CLB LUTs** (`57,10%` de `xck26`, versus `67.366` hierárquicos na §4.24; `25.402 LUT6`, `25.313 LUT5`, `7.909 LUT3`, `5.303 LUT4`, `2.879 LUT2`, `75 LUT1`, `569 CARRY4` $\equiv$ `285 CARRY8`), `16.619` `FDRE`/`FDSE` (`7,09%`) e `4` `RAMB36E2` (`2,78%`) em `3.825` redes `VCD` únicas (`128.486` bits internos: `108.582` combinacionais, `19.901` sequenciais). A energia de comutação dinâmica a `VCCINT = 0,72 V` (`xck26-sfvc784-2LV-c`, `250,0 MHz`, limites `AMD DS925` / `XPE` 16 nm FinFET `[low, nom, high]`) modela nós de lógica comutada + interligação local a $C_{\text{node}} = [2.6, 4.5, 7.2]\text{ fF}$ ($\frac{1}{2} C V^2 = [0.674, 1.166, 1.866]\text{ fJ/transition}$, ponderado por `2,02` primitivos `xcup` por bit combinacional `VCD` no núcleo Beneš), pinos de folha de relógio `FDRE`/`FDSE` a `[1.5, 2.2, 3.0] fF` (`2` arestas/ciclo = `1,141 fJ/FF/ciclo` nominal) mais `[3.5, 5.5, 8.0] fF` por transição `Q`, e `RAMB36E2` (`SDP` `64b`/`72b`) a `[2,90, 3,80, 4,80] pJ` por leitura de endereço variável, `[1,90, 2,47, 3,12] pJ` por ciclo ativado de endereço constante (`ENARDEN = 1`, $\alpha_{\text{addr}} = 0$), `[3,30, 4,30, 5,40] pJ` por escrita e `[0,04, 0,08, 0,14] pJ/ciclo` quando desativado (`EN = 0`):

| Módulo Alvo & carga `VCD` (`250 MHz`, `0.72 V`) | Ciclos | Transições combinacionais / Cic ($\alpha_{\text{comb}}$) | Transições sequenciais / Cic ($\alpha_{\text{seq}}$) | `RAMB36E2` duty (`Rd` / `Wr`) | Dinâmico `est_pJ / cycle` | Dinâmico `est_mW` (`[baixo, alto]`) |
| :--- | ---: | ---: | ---: | :---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** · `idle_quiescent` | `256` | `0.00` (`0.0000`) | `0.00` (`0.0000`) | `100.0%` const-addr / `0%` | **`241.66`** (`53.74` CE-gated) | **`60.41`** (`[47.25, 76.21]`; `13.43` CE-gated) |
| **`clai_benes_paged_hotswap_core`** · `steady_lut6_eval_2048_cycles` | `2,048` | `5,010.21` (`0.0780`) | `90.97` (`0.0044`) | `100.0%` ativo / `0%` | **`361.68`** | **`90.42`** (`[69.29, 116.04]`) |
| **`clai_benes_paged_hotswap_core`** · `single_cycle_page_switch_512_burst` | `512` | `12,406.84` (`0.1932`) | `269.46` (`0.0130`) | `100.0%` ativo / `0%` | **`380.07`** | **`95.02`** (`[72.58, 122.60]`) |
| **`clai_benes_paged_hotswap_core`** · `shadow_page_stream_write` | `512` | `1,987.31` (`0.0310`) | `74.47` (`0.0036`) | `100.0%` le / `1.23%` es (`1/81`) | **`358.86`** | **`89.72`** (`[68.82, 114.89]`) |
| **`clai_kv260_axi_top`** · `idle_quiescent` | `256` | `0.00` (`0.0000`) | `0.00` (`0.0000`) | `0.0%` (`EN = 0`) / `0%` | **`19.55`** | **`4.89`** (`[3.26, 6.66]`) |
| **`clai_kv260_axi_top`** · `steady_lut6_eval_2048_cycles` | `2,048` | `120.31` (`0.0011`) | `15.27` (`0.0008`) | `3.12%` le / `0%` | **`20.40`** | **`5.10`** (`[5.04, 5.18]`) |
| **`clai_kv260_axi_top`** · `single_cycle_page_switch_512_burst` | `512` | `325.21` (`0.0030`) | `25.56` (`0.0013`) | `11.13%` le / `0%` | **`22.07`** | **`5.52`** (`[5.34, 5.75]`) |
| **`clai_kv260_axi_top`** · `shadow_page_stream_write` | `512` | `31.95` (`0.0003`) | `71.92` (`0.0036`) | `0.0%` le / `8.20%` es | **`21.80`** | **`5.45`** (`[5.30, 5.64]`) |

Três conclusões de projeto de hardware decorrem diretamente da decomposição de atividade `VCD` e do modelo de atraso `DS925`:

1. **Pré-carga ociosa incondicional do `ENARDEN` do `RAMB36E2` (`82,8%` da potência de núcleo em repouso) e redução de `4,50×` por clock-gating de `CE`**: Embora `clai_benes_paged_hotswap_core` apresente `0.00` transições de dados por ciclo quando ocioso, `clai_uram_lut6_page_cache` mantém `ENARDEN = 1'b1` continuamente nos `81` blocos `RAMB36E2`, consumindo `200.07 est_pJ/cycle` (`50.02 est_mW`) em pré-carga das linhas de bit, junto com `41.59 est_pJ/cycle` (`10.40 est_mW`) nos nós de clock `FDRE` (**`60.41 est_mW`** em repouso). Em contraste, `clai_engram_streamer`, dentro de `clai_kv260_axi_top`, aplica gating aos seus `4` blocos `RAMB36E2` com `accept_byte && s_axis_tlast`, ficando ocioso em **`4.89 est_mW`** (`19.55 est_pJ/cycle`) e operando em regime permanente na inferência de pacotes `AXI4-Stream` de `31` bytes (`core_bus_reg` capturado uma vez por pacote, $\alpha_{\text{comb}} = 0.0011$) em **`5.10 est_mW`**. Aplicar gating ao `ENARDEN` de `clai_uram_lut6_page_cache` com `bus_valid` reduz a potência dinâmica em repouso do núcleo paginado **`4,50×`, para `13.43 est_mW` (`53.74 est_pJ/cycle`)**, sem penalidade de latência.
2. **Amplificação de toggle combinacional na Beneš (`2,48×`) versus potência ativa dominada pelo `RAMB36E2` (`+5,1%`)**: Alternar `page_id` em todos os `512` slots em ciclos de clock consecutivos (`single_cycle_page_switch_512_burst`) leva `81 × 64 = 5.184` linhas de bit `INIT` das `LUT6` a dirigir simultaneamente as árvores seletoras, elevando as transições combinacionais em `2,48×` (de `5.010,2` para `12.406,8` transições/ciclo, de `11,80` para `29,22 est_pJ/cycle`). Ainda assim, a potência dinâmica total do núcleo paginado sobe apenas `+4,60 est_mW` (de `90,42` para `95,02 est_mW`, `+5,1%`), porque as `81` leituras dos amplificadores de sensibilidade do `RAMB36E2` (`307,80 est_pJ/cycle`) respondem por `85,1%`-`80,9%` da energia dinâmica ativa (`358,86 est_pJ/cycle` / `89,72 est_mW` durante o `shadow_page_stream_write` concorrente).
3. **Auditoria do caminho crítico achatado (níveis `ltp` de `81` e `162`) e orçamento analítico de atraso por estágio `DS925` `-2LV`**: Aplicando os atrasos de primitivas do `AMD DS925` (`xck26-2LV`, `0,72 V`): `T_ILO = 0,068 ns`, `T_CKO = 0,148 ns`, `T_RCKO_DO = 1,390 ns` do `RAMB36E2` sem pipeline versus `0,610 ns` com `DOA_REG = 1`, além de um orçamento de interconexão de `[0,140, 0,220] ns/nível`, o caminho de `81` níveis do `clai_benes_paged_hotswap_core` sem pipeline fica em **`18,76-24,83 est_ns`** (`est_Fmax` analítico de `40,3-53,3 MHz`). Achatar `clai_kv260_axi_top` através das fronteiras de módulo (`ltp -noff` após `-flatten`, em contraste com `73` níveis por módulo hierárquico na §4.24) expõe um caminho de **`162` níveis** (**`34,77-46,92 est_ns`**, `21,3-28,8 MHz`) que vai de `core_bus_reg` até `clai_rung0_core` (`artifacts/clai_rung0_kv260.v`) e sua cadeia de somadores seriais `pop_acc` desenrolada em `64` passos. Ao habilitar `DOA_REG = 1` do `RAMB36E2`, inserir `4`-`5` cortes com registradores de pipeline (`<= 18` níveis lógicos por estágio, realizado em `13` níveis síncronos na `Claim LA-16`) e substituir o laço serial de popcount de `64` entradas por um compressor de `6` níveis em `LUT6`/Wallace, o atraso analítico por estágio cai abaixo de **`3,7 est_ns` (`<= 4.000 ns` a `250 MHz`)** com `CPI = 1,0` (`not` fechamento de timing pós-PAR no Vivado).

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Trabalhos relacionados e observações de convergência

| Sistema | ID / Venue | O que estabelece | Custo reportado | Diferença nesta referência |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Camadas neurais quantizadas e esparsas compiladas em LUTs de FPGA. | Síntese de LUTs e Fmax em FPGA. | Fios estáticos exigem re-PAR no Vivado a cada deslocamento, em contraste com a Beneš de `1` ciclo + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Redes booleanas diferenciáveis de portas e redes LUT sem pesos. | Contagens de portas e acurácia. | O roteamento estático cai para `52.34%` no deslocamento de VLAN e sofre quimeras marginais nos planos de bits. |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Produtos matriciais ternários e de baixa precisão via consulta em tabela em CPU/FPGA. | Latência e potência em FPGA. | Acelera a álgebra linear dentro de uma marcha do modelo; não evita a invocação do modelo. |
| **LittleBit** (Lee et al., 2025) & **LittleBit-2** (Lee and Kim, 2026) | `arXiv:2506.13771` · `arXiv:2603.00042` | Fatoração latente binária abaixo de 1 bit (`0.1-0.58` bits/peso) via `SVD` / `ITQ` + QAT de `5` épocas. | Compressão (`11.6×-31×`), PPL e acurácia de QAT. | Desempacota bitpacks em MACs binários densos em tempo de execução e cai para `0.00%` na codificação exata (`Claim LA-11`); `Sub1Bit-LUT6` usa `0` MACs binários e `MoL` restaura paridade de `100.0%` em `0` épocas de QAT. |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Cascatas de LLMs de fraco para forte e roteadores por preferência. | Preço em dólares de API vs. qualidade. | Não possui uma porta determinística $C(z)$ (`68.75%` de commits quebrados em `Claim LA-11`) e não tem compilador descendente para `LUT6`. |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Roteamento por bandidos entre múltiplos LLMs e serviço com escalonamento de frequência. | Wh de GPU medidos pelos autores (`Zeus` / `pyNVML`). | Otimiza o serviço em GPU; esta referência compila ativações em `LUT6` de `0` FLOPs e em páginas canônicas de habilidades (`reported_j` / `est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Rascunhadores especulativos baseados em MLP neural, em árvore de rascunhos e em cascata. | Aceleração em tempo de relógio. | Exigem FLOPs de rascunho e leituras de pesos, em contraste com as páginas `uint64` `LUT6` de `0` FLOPs. |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Rascunhadores de n-gramas do prompt e tries de sufixos de datastore, sem FLOPs. | Aceleração de latência (`0` FLOPs). | `PLD` não captura tokens fora do prompt; `REST` usa tries de tamanho variável, em contraste com as páginas `RAMB36E2`. |
| **AirLLM** (lyogavin, 2023) | Streamer de SSD de código aberto | Streaming de pesos por camada a partir de SSD em pouca RAM. | Footprint de RAM ativa. | `T=1` puro (`1.0 tok/sweep`) + transbordo de KV, em contraste com a redução de I/O de `2.74×-12.30×` do `AirMoL` e com `970 MB` de RAM `INT4` em Metal. |
| **Metered Commit Gates** & **RCE-JEPA** `[mesma casa]` | `/papers/gates/` · `/papers/rce-jepa/` | Commit gates (leitura do SOM KV260 `INA260` de `11,428 pJ`), MoL $p_i/c_i$ e `RCE-JEPA`. | `measured_j` do SOM KV260 + `reported_j` / `est_j`. | Fundação da mesma casa; estendida aqui com compilação descendente Beneš `LUT6`, `Expert-AirMoL` em Metal e `mol-agent`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## Limitações, ameaças à validade, não reivindicado, e falsificadores

**Validade interna e de constructo.** Sob ruído aleatório uniforme ou churn adversarial por passo ($\Delta T = 1$), a Proposição 1 fornece poupança de compilação descendente nula e reverte para `1.00 tok/sweep`. Paridade sem perdas (`100.0%`) garante concordância bit-a-bit com a decodificação gulosa do alvo sem elevar o teto de capacidade de um ponto de verificação base `350M` ou `0.8B`.

**Validade das medições e itens não reivindicados.** As estimativas analíticas de energia e potência de chaveamento (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`, e os limites `est_pJ/cycle` e `est_mW` obtidos com `Verilator` `VCD` + `AMD DS925` a `0.72 V` nas §4.22 e §4.25), as leituras de contadores do sistema operacional e do chip (`reported_j` a partir de `libIOReport` `'GPU Energy'` no Apple Silicon `L2` + `ri_energy_nj` via `proc_pid_rusage` em `L3`, além de um filtro de transbordamento de registrador estreito ajustado de `450 W` para `175 W`) e os deltas cumulativos de `PMU` de toda a máquina no macOS são mantidos estritamente separados das medições físicas em trilhos de alimentação (`measured_j = None`). O Yosys `0.71+` e o Verilator `5.054` estabelecem a síntese estrutural de netlist para `xck26` (`41,465` LUTs, `13` níveis lógicos de ciclo único e `170 <= 189` `IOB`s no `P4-AXIS` controlado por `CE`), `320/320` em paridade `CE`, `256/256` em simulação de ciclos sem bolhas com `CPI = 1.00` e `est_mW` de chaveamento dinâmico por taxa de alternância `VCD` (`15.59 est_mW` em repouso, excluindo fuga estática), e não o fechamento de timing pós-PAR comercial do Vivado a `250 MHz` nem watts físicos nos trilhos do KV260 (`board_metered = false`). Não se reivindicam liderança em eficiência energética em silício, promoção de saídas `ModelGenerated` para `Deterministic`, nem avaliação completa em contêiner de `500` tarefas do `SWE-bench Verified` além das `40` avaliações reais em git-worktree upstream em `django/django`, `pytest-dev/pytest`, `psf/requests` e `sympy/sympy` (`Claims LA-15, LA-20`), do benchmark contratual de `48` tarefas (`Claims LA-11, LA-17`) e do benchmark `SWE-Mini` de `16` tarefas (`Claim LA-13`) (ao passo que a execução real de `120B-A12B` é diretamente medida na `Claim LA-21`, e apenas a linha sintética de `70B` em NVMe a frio em `air_mol_nvme_baselines.csv` permanece uma projeção analítica).

| ID | Reivindicação | Condição Exata de Refutação / Falsificador |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` falha `100.0%` na paridade Verilator em `5,120` pacotes ou perde o deslocamento VLAN do pacote-`2,500`. |
| **`LA-F2`** | `Claim LA-2` (Polyglot suite) | Zig aloca `> 0` bytes de heap em loop quente, Go relata `> 0 allocs/op`, ou Julia Enzyme excede erro FD de `1e-7`. |
| **`LA-F3`** | `Claim LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` excede `117,120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s, ou `1` ciclo por troca de página. |
| **`LA-F4`** | `Claim LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` excede o risco falso alvo $\alpha = 0.02$ no tráfego deslocado ou marca `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Byte speculation) | `scripts/run_code_corpus_benchmark.py` produz paridade exata de bytes `< 100.0%` versus o `Mamba3CodeLM` ganancioso em `48` prompts não vistos. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` sob `F_NOCACHE` falha na paridade `100%` ou lê mais bytes NVMe que `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Claim LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`, `scripts/run_hf_air_mol_pretrained.py` ou `scripts/run_hf_qwen35_air_mol.py` diverge por $\ge 1$ token BPE do alvo ganancioso. |
| **`LA-F8`** | `Claim LA-8` (Regression suite) | `pytest -v` falha em qualquer um dos `35` testes em `tests/`. |
| **`LA-F9`** | `Claim LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` diverge da paridade de tokens `100%` ou lê mais bytes NVMe que `AirLLM` ou `Expert-AirLLM`. |
| **`LA-F10`** | `Claim LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` excede erro máximo `1e-3` vs. multiplicação densa binária `ITQ` ou falha na paridade verificada `100%`. |
| **`LA-F11`** | `Claim LA-11` (`48`-Task Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` admite `> 0%` commits quebrados ou admite uma habilidade Wave-1 obsoleta sob mutação de especificação Wave-2. |
| **`LA-F12`** | `Claim LA-12` (Metal `INT4` MoE) | `scripts/run_metal_moe_benchmark.py` excede erro de shader `FP32` `1e-4` ou diverge da paridade de tokens gananciosa `100%` em `8.5B` ou `35B`. |
| **`LA-F13`** | `Claim LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` admite `> 0%` patches quebrados, altera `tests/`, ou perde a mutação de especificação Wave-2 `R03`. |
| **`LA-F14`** | `Claim LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` falha OpenAI REST/SSE, `MCP` `JSON-RPC 2.0`, recarregamento `.mol/`, ou marca `measured_j`. |
| **`LA-F15`** | `Claim LA-15` (`BCB` + `SWE-bench`) | `scripts/run_external_public_benchmarks.py` falha na verificação `SHA`-256 de Parquet, expõe soluções/patches padrão ou admite `> 0%` de saídas quebradas. |
| **`LA-F16`** | `Claim LA-16` (`250 MHz` `xck26` RTL) | `scripts/verify_pipelined_250mhz_rtl.py` excede `20` níveis lógicos de ciclo único, excede `189` `IOB`s no `P4-AXIS`, utiliza `> 0` `DSP48`s ou falha na paridade `256/256` `CPI = 1.00` no Verilator. |
| **`LA-F17`** | `Claim LA-17` (`Rung 3d` `<think>`) | `scripts/run_rung3d_thinking_ceiling.py` admite `> 0%` de commits quebrados, invoca APIs na nuvem ou falha em elevar a taxa de aprovação verificada acima de `87.50%`. |
| **`LA-F18`** | `Claim LA-18` (Rust `CubeCL` MoE) | `cargo run --release --bin bench_cubecl_moe_deltanet` excede erro `FP32` de `1e-4` em `LLVM` `CPU` ou `Metal` `GPU`, ou alcança aceleração `< 25×` em Metal. |
| **`LA-F19`** | `Claim LA-19` (`6`-Kernel `Lean 4.36.0` proofs) | `scripts/verify_lean_proofs.py` ou `lake check --paranoid` falha em qualquer um dos `6` kernels independentes (`con-leche`, `con-ron`, `lean4lean`, `nanoda`, `leanchecker`, `lean`), contém `>= 1` `sorry` / `opaque` / `ofReduceBool`, ou adiciona `>= 1` axioma customizado. |
| **`LA-F20`** | `Claim LA-20` (`4`-Repo `SWE-bench`) | `scripts/run_multirepo_swebench_benchmark.py` expõe `patch`, avalia `< 4` repositórios, admite `> 0%` de patches quebrados ou falha em superar os modelos autônomos de `24B`/`35B`. |
| **`LA-F21`** | `Claim LA-21` (`120B` Hybrid MoE) | `scripts/run_120b_hybrid_moe_benchmark.py` falha na execução local de `120B-A12B`, admite `> 0%` de commits quebrados ou registra `0%` de acertos de caminho rápido `.mol/` na Onda 2. |
| **`LA-F22`** | `Claim LA-22` (`CE`-Gated `VCD` Power) | `scripts/verify_ce_gated_vcd_power.py` falha na paridade `CE` `320/320`, excede `189` `IOB`s ou alcança redução `< 3.5×` na potência dinâmica ociosa. |
| **`LA-F23`** | `Claim LA-23` (Rust `mol-agent-rs`) | `cargo run --release --bin mol_agent -- --self-test-bench` exige Python para `/v1` ou `/mcp`, falha em `--mcp-stdio` ou alcança aceleração `< 10×` vs. `MCP` em Python. |

---

<div id="7-references" class="anchor-alias" aria-hidden="true"></div>

## 7. Referências

<ol data-refs>
<li>Bacellar, A., et al. (2024). Differentiable Weightless Neural Networks. <em>arXiv:2410.11112</em>.</li>
<li>Beneš, V. E. (1965). <em>Mathematical Theory of Connecting Networks and Telephone Traffic</em>. Academic Press.</li>
<li>Cai, T., Li, Y., Geng, Z., Peng, H., Lee, J. D., Chen, D., and Dao, T. (2024). Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads. <em>ICML 2024</em>, <em>arXiv:2401.10774</em>.</li>
<li>Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. <em>arXiv:2305.05176</em>.</li>
<li>Dao, T., and Gu, A. (2024). Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality. <em>ICML 2024</em>, <em>arXiv:2405.21060</em>.</li>
<li>Furao, S., and Hasegawa, O. (2006). An incremental network for on-line unsupervised classification and topology learning (SOINN). <em>Neural Networks</em>, 19(1):90-106.</li>
<li>Gibbs, I., and Candès, E. (2021). Adaptive Conformal Inference Under Distribution Shift. <em>NeurIPS 2021</em>, <em>arXiv:2106.00170</em>.</li>
<li>Google Gemma Team (2026). <code>google/gemma-4-E2B-it</code> On-Device Hybrid Instruction Model Card (2026). <a href="https://huggingface.co/google/gemma-4-E2B-it">huggingface.co/google/gemma-4-E2B-it</a>.</li>
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., and Narasimhan, K. (2024). SWE-bench: Can Language Models Resolve Real-World GitHub Issues? <em>ICLR 2024</em>, <em>arXiv:2310.06770</em>.</li>
<li>Lee, H., Kim, M., Baek, S., Kim, J., Hwang, S., Shin, J., Lee, J., and Kim, E. (2025). LittleBit: Ultra Low-Bit Quantization via Latent Matrix Factorization. <em>NeurIPS 2025</em>, <em>arXiv:2506.13771</em>.</li>
<li>Lee, H., and Kim, E. (2026). LittleBit-2: Pushing the Frontier of Extreme LLMs Quantization into 0.1-Bit (<code>SamsungLabs/LittleBit</code>). <em>ICML 2026</em>, <em>arXiv:2603.00042</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455-1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094-1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026a). <code>LiquidAI/LFM2.5-350M</code> and <code>LiquidAI/LFM2.5-8B-A1B</code> Hybrid and Sparse-MoE Open-Weights Model Cards. <a href="https://huggingface.co/LiquidAI/LFM2.5-8B-A1B">huggingface.co/LiquidAI/LFM2.5-8B-A1B</a>.</li>
<li>Liquid AI (2026b). <code>LiquidAI/LFM3-1.7B</code> Tri-Hybrid Open-Weights Model Card (October 23, 2026). <a href="https://huggingface.co/LiquidAI/LFM3-1.7B">huggingface.co/LiquidAI/LFM3-1.7B</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026a). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
<li>Qwen Team (2026b). <code>Qwen/Qwen3.6-35B-A3B</code> Sparse-MoE Hybrid Gated DeltaNet + Attention Model Card (2026). <a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B">huggingface.co/Qwen/Qwen3.6-35B-A3B</a>.</li>
<li>Saxena, A. (2023). Prompt Lookup Decoding. <a href="https://github.com/apoorvumang/prompt-lookup-decoding">github.com/apoorvumang/prompt-lookup-decoding</a>.</li>
<li>Simon, H. A., and Kadane, J. B. (1975). Optimal Problem-Solving Search: All-or-None Solutions. <em>Artificial Intelligence</em>, 6(3):235-247.</li>
<li>Thompson, C. D. (1978). Generalized Connection Networks for Parallel Processor Intercommunication. <em>IEEE Trans. Comput.</em>, C-27(12):1119-1125.</li>
<li>Umuroglu, Y., Akhauri, Y., Fraser, N. J., and Blott, M. (2020). LogicNets. <em>FPL 2020</em>, <em>arXiv:2004.03021</em>.</li>
<li>VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. <em>arXiv:2509.04827</em>.</li>
<li>Vovk, V., Gammerman, A., and Shafer, G. (2005). <em>Algorithmic Learning in a Random World</em>. Springer.</li>
<li>Waksman, A. (1968). A Permutation Network. <em>Journal of the ACM</em>, 15(1):159-163.</li>
<li>Wei, J., et al. (2024). T-MAC: CPU Renaissance via Table Lookup for Low-Bit LLM Deployment. <em>arXiv:2407.00088</em>.</li>
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2024). BigCodeBench: Benchmarking Code Generation with Diverse Function Calls and Complex Instructions. <em>ICLR 2025</em>, <em>arXiv:2406.15877</em>.</li>
<li>Moura, L. de, and Ullrich, S. (2021). The Lean 4 Theorem Prover and Programming Language. <em>CADE 28</em>, <em>LNCS</em> 12699:625-635.</li>
<li>NVIDIA (2026). <code>nvidia/Nemotron-3-Super-120B-A12B</code> Hybrid Mamba-Attention Sparse-MoE Open-Weights Model Card. <a href="https://huggingface.co/nvidia/Nemotron-3-Super-120B-A12B-BF16">huggingface.co/nvidia/Nemotron-3-Super-120B-A12B-BF16</a>.</li>
<li>Mistral AI (2025). <code>mistralai/Devstral-Small-2-24B-Instruct-2512</code> Open-Weights Software Engineering Model Card. <a href="https://huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512">huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512</a>.</li>
</ol>

---

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## Apêndice A. Reprodutibilidade

A partir de um checkout de [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit 86d0ab5`):

```bash
PYTHONPATH=src .venv/bin/pytest -v
(cd proofs && lake build) && PYTHONPATH=src .venv/bin/python scripts/verify_lean_proofs.py
PYTHONPATH=src .venv/bin/python scripts/run_multirepo_swebench_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_120b_hybrid_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/verify_ce_gated_vcd_power.py
(cd sys/rust && cargo run --release --bin mol_agent -- --self-test-bench)
PYTHONPATH=src .venv/bin/python scripts/run_external_public_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_pipelined_250mhz_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_rung3d_thinking_ceiling.py
(cd sys/rust && cargo test --release && cargo run --release --bin bench_cubecl_moe_deltanet)
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_lfm3_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_moe_8b_35b_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_sub1bit_lut_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_metal_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
PYTHONPATH=src .venv/bin/python scripts/run_repo_patch_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/mol_agent_server.py --host 127.0.0.1 --port 8090 --mol-dir .mol
```
