---
title: "Compilação descendente em LUT6 numa cascata Mixture of Limits: malhas booleanas roteadas por Beneš, portas de ativação conformais e streaming de camadas NVMe de 4 bits"
deck: "Uma cascata Mixture of Limits que tenta zero operação de ponto flutuante (FLOP) com circuitos de tabela de consulta de 6 entradas paginados (LUT6) primeiramente, transmite modelos híbridos e esparsos Mixture-of-Experts (MoE) de final de 2026 com até 34,66 B parâmetros apenas em faltas, controla commits por verificadores determinísticos e compila wakes certificados descendentes em páginas de Block RAM (RAMB36E2) de 36 Kbit roteadas por Beneš. Os tempos de relógio real, as contagens de bytes não armazenados em buffer Darwin F_NOCACHE (leitura de arquivo sem buffer), a memória de acesso aleatório ativa (RAM), os deltas cumulativos da unidade de gerenciamento de energia (PMU) do macOS em todo o sistema e as simulações de nível de transferência de registradores (RTL) Yosys/Verilator xck26 são relatados a partir de openIE-dev/lut-adapt-ai no commit a5e9bc1. As cifras de energia por tarefa são estimativas analíticas est_j; nenhuma potência de trilho isolado da placa foi medida."
lang: "pt"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*Revisão 30613ef, 22 de novembro de 2026. Implementação de referência e artefatos: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) em [`a5e9bc1de280f973bc9051b4cc58942820a67eeb`](https://github.com/openIE-dev/lut-adapt-ai/tree/a5e9bc1de280f973bc9051b4cc58942820a67eeb). Resumo dos dados: [/data/#lut-adapt](/data/#lut-adapt). PDF LaTeX: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([fonte](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Visão geral

Este estudo examina como um sistema computacional pode compilar, de forma descendente, trabalho repetido de modelos neurais em consultas booleanas rápidas em tabelas, sem perder a paridade exata das saídas e sem promover palpites não verificados a regras confiáveis. São apresentadas medições de software, sínteses em nível de transferência entre registradores (RTL) e simulações de ciclos, além de estimativas analíticas de energia rotuladas (`est_j`). Nenhum medidor de energia de parede ou de trilho foi conectado a este repositório (`measured_j` não está definido; `board_metered` é falso).

**Em termos simples**

1. A maioria das entradas que um sistema implantado recebe repete padrões que ele já resolveu; executar uma rede neural completa de ponto flutuante a cada passo desperdiça computação e largura de banda de memória.
2. A referência posiciona um nível de consulta em tabela-verdade reconfigurável de 6 entradas (`LUT6`) à frente de modelos de espaço de estados em fluxo e de modelos fundacionais, e compila as respostas descendentemente para páginas de memória de consulta somente depois que uma verificação explícita as certifica.
3. Quando modelos híbridos e esparsos de mistura de especialistas (sparse MoE) de final de 2026, com até `34.66B` de parâmetros, transmitem pesos de 4 bits a partir de armazenamento em estado sólido, as leituras de especialistas esparsos guiadas pelo roteador, combinadas com esse redator `LUT6` de custo zero em FLOPs, reduzem as leituras em disco em até `12.30×` (vazão de tokens `6.50×` mais rápida) com `2.53` gigabytes de memória ativa e nenhuma alteração nos tokens de saída; o código de controle de portas, submetido a uma verificação determinística, supera a acurácia independente de um modelo de `35B`, com `0.00%` de compromissos quebrados admitidos, e acelera tarefas cristalizadas da Onda 3 em `35,590×`.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termos, siglas e rótulos de medição

<ul id="terms">
<li>MoL: Mixture of Limits, a regra de cascata das Portas de Commit Medidas Parte II [mesma casa]</li>
<li>LA: prefixo de afirmação e falsificador (LA-1 a LA-11, LA-F1 a LA-F11) utilizado neste estudo</li>
<li>LUT, LUT6, INIT: tabela de consulta, primitivo booleano Xilinx UltraScale+ de 6 entradas e sua máscara de inicialização de tabela-verdade de 64 bits</li>
<li>BRAM, RAMB36E2, URAM: Block RAM, o primitivo Block RAM UltraScale+ de porta dupla de 36 Kbit (144 em xck26) e UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: bloco de lógica configurável, flip-flop, fatia de processamento de sinal digital, e placa AMD Kria KV260 (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: matriz de portas programáveis em campo, circuito integrado de aplicação específica, nível de transferência de registradores, ciclos por consulta, colocação e roteamento, folga negativa pior e conferência Field-Programmable Logic</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU: Advanced eXtensible Interface, sistema de processamento Zynq, lógica programável, sistema-em-módulo, circuito monitor de energia embarcado, trilho de alimentação, Intel Running Average Power Limit, NVIDIA Management Library e unidade de gerenciamento de energia do macOS</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: Dualidade de Espaço de Estados, modelo de espaço de estados, múltiplas entradas múltiplas saídas, incorporação posicional rotacional, unidade de ativação linear com portão, atenção de consulta agrupada, cache de chave-valor, codificação por pares de bytes, modelo(s) de linguagem grande(s), Mixture-of-Experts, perceptron multicamadas e gramática livre de contexto</li>
<li>HC, SOINN, WNN, DWN: Rede Neural Incremental Auto-Organizada de contexto hierárquico, rede neural sem peso e Rede Neural Sem Peso Diferenciável</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: Arquitetura Preditiva de Incorporação Conjunta, Modelo de Raciocínio Baseado em Energia, Inferência Conformal Adaptativa, fora da distribuição, área sob a característica de operação do receptor, probabilidade softmax máxima e Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF: Decodificação por Consulta de Prompt, Decodificação Especulativa Baseada em Recuperação, Algoritmo de Extrapolação para Maior Eficiência de Modelos de Linguagem, Liquid Foundation Model 2.5 (LFM2.5-350M e LFM2.5-8B-A1B), Liquid Foundation Model 3 (Oct 2026 LiquidAI/LFM3-1.7B) e HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR: decomposição em valores singulares, rotação de hipercubo de Procrustes por Quantização Iterativa, decomposição independente de sinal-valor, treinamento consciente de quantização, quantização pós-treinamento, perplexidade e razão sinal-ruído</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB: armazenamento Non-Volatile Memory Express, sinalizador de arquivo não armazenado em buffer Darwin F_NOCACHE, Portable Operating System Interface, memória de acesso aleatório, RAM dinâmica, RAM estática, entrada/saída, quilobyte, megabyte e gigabyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, FP16, FP32, INT4: operação(ões) de ponto flutuante, milhões de FLOPs, operação(ões) de multiplicação e acumulação, instrução única com múltiplos dados, diferenciação automática, diferença finita, bits por byte, ponto flutuante de 16/32 bits e inteiro de 4 bits</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [mesma casa], Wise Computer Automation [mesma casa], conclusão verificada e prefixo de benchmark de engenharia de software</li>
<li>CLI, HTTP, SSE, API, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW: interface de linha de comando, Protocolo de Transferência de Hipertexto, Eventos Enviados pelo Servidor, interface de programação de aplicações, conferências e periódicos acadêmicos de ciência e engenharia da computação, sistema operacional, unidade central e unidade gráfica de processamento, e software</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XNOR: rede local virtual (IEEE 802.1Q), Segurança da Camada de Transporte, inspeção profunda de pacotes, árvore de sintaxe abstrata, Notação de Objetos JavaScript, valores separados por vírgula, Algoritmo de Hash Seguro, verificação por redundância cíclica, Modo de Transferência Assíncrona (CRC-8/ATM), Solicitação de Comentários (Request for Comments), Linguagem de Consulta Estruturada, codificação DWARF de inteiros com sinal little-endian de base 128, memória endereçável por conteúdo e NÃO-OU exclusivo</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, DSP48E2, URAM288, AMD: porta de depuração Joint Test Action Group, depurador da Xilinx Software Command-Line Tool, Debug Access Port, Universal Serial Bus, Future Technology Devices International e seu circuito integrado ponte dupla UART/FIFO FT2232C, transmissor-receptor assíncrono universal, buffer do tipo primeiro a entrar, primeiro a sair, circuito integrado, automação de projeto eletrônico, modo de síntese fora de contexto, Advanced Microcontroller Bus Architecture, interconexão AXI4-Lite/AXI4-Stream, bloco de entrada/saída, buffers de entrada/saída, flip-flops D com reset/set síncrono, tabelas de consulta (LUT) de 1 a 5 entradas do UltraScale+, multiplexadores de 7/8 entradas do UltraScale+, cadeia rápida de propagação de vai-um de 4 bits, slice DSP do UltraScale+, UltraRAM de 288 Kbits e Advanced Micro Devices</li>
</ul>

Três classes de evidência permanecem separadas em todas as tabelas abaixo:

| Rótulo da evidência | Significado neste estudo |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Contagens exatas de bytes lidos ou gravados via `os.pread` sob Darwin `F_NOCACHE`, alocações de memória residente, segundos de relógio de parede, deltas cumulativos de energia do `PMU` completo do macOS (`AppleSmartBattery.PowerTelemetryData`) no Apple M5 Max, e concordância exata de bits/tokens. `measured_j` está indefinido (`None`). |
| **`Simulated (RTL)`** | Contagens estruturais de netlist provenientes do Yosys `0.71+` (`synth_xilinx -family xcup` direcionado ao Kria KV260 `xck26`) e contagens de ciclos (`CPI = 1`) do Verilator `5.054`. Não fechamento de temporização do Vivado e não potência da placa (`board_metered = false`). |
| **`Estimated (est_j)`** | Joules analíticos calculados a partir de contagens de operações ou substitutos de tempo de potência de projeto térmico (`joule_meter.py` fallback quando os contadores de hardware `RAPL`/`NVML` estão ausentes no macOS). Comparável apenas entre ramificações dentro da mesma fórmula; nunca watts de silício. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Contexto arquitetónico e contribuições

Em [Portas de Commit Medidas](/papers/gates/) `[same house]`, a Parte II define **Mixture of Limits**: experimentar engrenagens por ordem decrescente de probabilidade de passagem por joule $p_i / c_i$ (Simon e Kadane, 1975), parar assim que o predicado de conclusão da tarefa $C(z) = 1$ se verificar, e proibir o reforço da saída `ModelGenerated` em `Deterministic`. Um escalão de Lookup estático, no entanto, cobre apenas as entradas escritas nele antes da implantação. Por outro lado, as redes neuronais de tabela de consulta existentes, LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022) e Differentiable Weightless Neural Networks (Bacellar et al., 2024), fixam a conectividade dos fios no interior do encaminhamento estático de FPGA, exigindo colocação e encaminhamento do fabricante sempre que a distribuição de entrada se altera.

A referência `lut-adapt-ai` fecha o ciclo entre o topo e o fundo da cascata através de **compilação descendente online de `LUT6`**:

- **Degrau 0 (Lookup, Beneš paginado + `LUT6`)**: Avalia máscaras de tabela de verdade de 64 bits encaminhadas através de um comutador multicast não bloqueante $512 \times 512$ **Beneš-Copy-Beneš** e em cache em $81 \times \texttt{RAMB36E2}$ memórias de blocos de dupla porta (`0` operações de vírgula flutuante, comutação de página de ciclo único em simulação Verilator).
- **Degrau 1 (Stream, Dualidade de Espaço de Estados MIMO Complexo `Mamba-3`)**: Trata falhas que dependem da história da sequência utilizando um estado recorrente de tamanho constante $O(1)$ (`48 KB` de memória fixada na referência de `14.3M` parâmetros), evitando o crescimento $O(L)$ da cache de chave-valor.
- **Degrau 2 (Topologia, `HC-SOINN`)**: Mantém uma topologia de protótipos online sobre incorporações latentes, isolando fronteiras de regime e acionando um disjuntor (`Refuse` / escalar) quando chega uma mudança de distribuição não rotulada.
- **Degrau 3 (Modelo por último, `JEPA-EBRM`, `AirMoL` e `Expert-AirMoL` com Streaming NVMe de 4 bits)**: Invoca verificação latente baseada em energia ou transmite modelos de fundação híbridos e sparse-MoE pré-treinados do final de 2026 (`LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it`, `LiquidAI/LFM2.5-8B-A1B` e `Qwen/Qwen3.6-35B-A3B`, juntamente com `LiquidAI/LFM2.5-350M` e `Qwen/Qwen3.5-0.8B-Base`) apenas quando os degraus mais baratos se abstêm ou exigem verificação exata do alvo.
- **Descendente `SleepCrystallizer`**: Extrai traços de ativação recorrentes utilizando arranques a quente espectrais de Walsh-Hadamard, tabelas de verdade de mintermos de modo conjunto e escalonamentos de comutadores Waksman, invertendo bancos de memória de blocos sombra sem interromper a inferência ou executar colocação e encaminhamento de FPGA.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Contribuições

1. **Condição de compilação descendente amortizada**: Estende a ordenação $p_i/c_i$ de Simon-Kadane com um custo explícito de compilação $E_{\text{compile}}$ sobre o horizonte estacionário $\Delta T$.
2. **Arquitetura RTL não bloqueante Beneš-Copy-Beneš de $512 \times 512$ e `81`-`RAMB36E2`**: Elimina tanto o excesso lógico de `102.0%` do Kria KV260 causado por crossbars planos (`119,478` LUTs) quanto a explosão de `926,619` LUTs dos multiplexadores de página baseados em flip-flops, sintetizando para `41,186` LUTs de CLB do UltraScale+ (`35.2%` do `xck26`), `81` blocos `RAMB36E2` (`56.2%`) e `0` fatias `DSP48`, com comutação de página em `1` ciclo (`4.0 ns` a `250 MHz` nominais) em simulação.
3. **Síntese universal de minitermos conjuntos com $\le 64$ bits**: Mostra que a consulta conjunta de minitermos domina o arredondamento marginal de DiffLogic por planos de bits em ramos correlacionados, e empacota $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ tokens de subpalavra em uma única palavra `uint64` (`16b × 4 = 64b` para `|V| = 65,536`; `17b × 3 = 51b` para `|V| = 128,000`; `18b × 3 = 54b` para `|V| = 248,320`).
4. **Portão de cristalização Split-Conformal sem oráculo com ACI online**: Associa um escore de não conformidade latente `JEPA-EBRM`, regularizado radialmente, à calibração Split Conformal e ao Adaptive Conformal Inference (Gibbs e Candès, 2021), registrando `0.00%` de risco falso de cristalização e AUROC OOD de `1.0000` em tráfego deslocado, enquanto as linhas de base de softmax e MC-Dropout registram risco falso de `17.62%-24.28%`.
5. **Streaming NVMe de 4 bits para `AirMoL` e `Expert-AirMoL` com Sparse-MoE de até `34.66B`**: Combina fragmentação de 4 bits com `F_NOCACHE` `os.pread` do Darwin, leituras de experts com passo em bytes indexadas pelo roteador sobre `.experts.pack4`, reversão de estado híbrida e especulação em rajada de `LUT6` por token, nos modelos `LiquidAI/LFM3-1.7B` (outubro de 2026; redução de NVMe de `2.74×` com `3.79%` da RAM FP32), `LiquidAI/LFM2.5-8B-A1B` (`8.47B`; redução de NVMe de `6.90×`) e `Qwen/Qwen3.6-35B-A3B` (`34.66B`; **redução de NVMe de `12.30×`**, **`2,530.7 MB` de RAM = `3.83%` do FP16**, **aceleração de `6.50×`**), com `100.0%` de paridade exata de tokens.
6. **`Sub1Bit-LUT6` sem MACs frente ao `LittleBit` e cascata de codificação de fronteira de final de 2026 com verificação controlada**: Substitui os `1.98M` MACs binários de tempo de execução de `LittleBit-1 / LittleBit-2` (`0.576` bits por peso; Lee et al., 2025; Lee e Kim, 2026) por uma consulta de somas parciais `LUT6` de 6 entradas sem MACs (erro `< 4 × 10⁻⁶`, paridade de `100.0%` sob verificação-alvo `MoL` com `0` épocas de QAT), e supera o `LittleBit-2 0.55bpw` isolado, `LFM3-1.7B`, `Gemma-4-E2B-it`, `LFM2.5-8B-A1B`, `Qwen3.6-35B-A3B` e `RouteLLM` em um benchmark de codificação de `48` tarefas (`16` especificações × `3` ondas) (`43.75%` contra `0.00%-33.33%`), com **`0.00%` de commits quebrados admitidos** e **aceleração de `35,590×` nas habilidades cristalizadas da Onda 3**, respaldado por verificação poliglota em cinco linguagens.

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

O ficheiro `scripts/mol_code_cli.py` disponibiliza os backends `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` e `--air-nvme` através de endpoints CLI e SSE (`/v1/health`, `/v1/complete`, `/v1/crystallize`), fazendo avançar a residência de slots `RAMB36E2` de `438/512` para `460/512` em tempo real, com `22/22` testes aprovados em `tests/`.

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

### 4.11 Afirmação LA-11: bakeoff de codificação de fronteira de `48` tarefas (`16` especificações × `3` ondas) para final de 2026

| Sistema de Braço de Final de 2026 (`48` Tarefas = `16` Especificações × `3` Ondas) | W1 Frio | W2 Adaptação | W3 Quente | Aprovação Global | Commits Quebrados | Parcela W3 `Rung 0/1` | Chamadas `35B` | Latência Média W3 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT (`1`-Shot) | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `19.946 ms` |
| `B` `LiquidAI/LFM3-1.7B` (Oct 2026 Tri-Hybrid, `1`-Shot) | `18.75%` | `6.25%` | `6.25%` | `10.42%` | `89.58%` | `0.00%` | `0.0%` | `3.561 ms` |
| `C` `google/gemma-4-E2B-it` (`2026` Hybrid, `1`-Shot) | `6.25%` | `0.00%` | `0.00%` | `2.08%` | `97.92%` | `0.00%` | `0.0%` | `8.886 ms` |
| `D` `LiquidAI/LFM2.5-8B-A1B` (`8.47B` MoE, `1`-Shot) | `18.75%` | `12.50%` | `12.50%` | `14.58%` | `85.42%` | `0.00%` | `0.0%` | `14.221 ms` |
| `E` `Qwen/Qwen3.6-35B-A3B` (`34.66B` `Expert-AirMoL`, `1`-Shot) | `37.50%` | `31.25%` | `31.25%` | `33.33%` | `66.67%` | `0.00%` | `100.0%` | `98.435 ms` |
| `F` `RouteLLM` Confidence Router (`LFM3` $\to$ `Gemma4` $\to$ `8B`) | `18.75%` | `6.25%` | `6.25%` | `10.42%` | `89.58%` | `0.00%` | `0.0%` | `3.561 ms` |
| **`G` `MoL` `VerifiedCodeCascade` (Referência)** | **`43.75%`** | **`43.75%`** | **`43.75%`** | **`43.75%`** | **`0.00%`** | **`43.75%`** | **`62.5%`** | **`143.649 ms` (`2.54 ms` resolvido)** |

Ao longo do protocolo de `48` tarefas e benchmark de algoritmo (aritmética serial RFC 1982, linhas de varredura de intervalo ponderadas, ordenação topológica lexicográfica segura para ciclos, baldes de tokens em nanossegundos, CRC-8/ATM e CRC-8 mutado `0xFF`, escape de `~01` do ponteiro JSON RFC 6901, Bellman-Ford limitado por saltos, medianas de janela exatas `>2⁵³`, Damerau-Levenshtein irrestrito, roteamento Beneš `4×4`, parametrização literal de SQL, soma de subsequências com deque monotônico, DWARF SLEB128, hash consistente SHA-256 e quantis conformais; delta de `PMU` do sistema completo macOS `126.947,30 J`), o `VerifiedCodeCascade` supera todos os modelos autônomos e roteadores em todas as ondas (`43.75%` vs. `33.33%` para `35B`), admite **`0.00%` de commits quebrados** (vs. `66.67%-100.00%`), captura com segurança todas as `3` buscas adversariais de desvio de especificação das Ondas 2/3 via $C(z)$, e colapsa a latência média da Onda 3 nas `7` competências cristalizadas de **`90.324,2 ms`** para **`2.54 ms` (`35.590×` de aceleração)**.

<div id="412-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.12 `xck26-sfvc784-2LV-c` Detalhamento de Primitivas do Subsistema Completo, Profundidade Topológica e Sonda de Hardware `Vivado 2026.1`

Para auditar tanto o núcleo especulativo autônomo de `512` páginas (`clai_benes_paged_hotswap_core` em `hw/kv260/rtl/clai_benes_hotswap_core.sv`) quanto o subsistema Rung-0 completo, com barramentos AMBA (Advanced Microcontroller Bus Architecture) `AXI4-Lite` + `AXI4-Stream` (`clai_kv260_axi_top` em `hw/kv260/rtl/clai_kv260_axi_top.sv`, `clai_engram_streamer.sv`, `clai_rung0_hotswap_core.sv` e `artifacts/clai_rung0_kv260.v` no commit `a5e9bc1de280`), contra o dispositivo exato AMD Kria KV260 (`xck26-sfvc784-2LV-c`: `117,120` LUTs de CLB, `234,240` flip-flops de CLB, `144` blocos `RAMB36E2`, `64` blocos UltraRAM de 288 Kbit (`URAM288`), `1,248` fatias de processamento digital de sinais UltraScale+ (`DSP48E2`) e `189` blocos de entrada e saída do usuário (`IOB`s)), executamos três verificações de hardware e de automação de projeto eletrônico (`EDA`) em uma estação de trabalho Intel Core i9-13900H (`Linux 7.0.0-43-generic x86-64`):

1. **Joint Test Action Group (`JTAG`) de somente leitura e Barramento Serial Universal (`USB`) probe (`Xilinx hw_server v2026.1` + Ferramenta de Linha de Comando Xilinx (`XSDB`))**: Embora `lsusb` relatou um dispositivo Future Technology Devices International (`FTDI`) `0403:6010` (`FT2232C/D/H` transmissor assíncrono universal dual (`UART`) / primeiro-a-primeiro (`FIFO`) circuito integrado (`IC`)) bridge, a inspeção das strings de fornecedor/produto USB do `sysfs` do Linux (`idVendor = 0403`, `idProduct = 6010`) identificou o dispositivo como `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"` em vez de um carrier Kria KV260. Consultando `hw_server v2026.1` (Build 29 de maio de 2026) via `xsdb` (`connect; jtag targets; targets`) retornou **`0` dispositivos Xilinx `JTAG` e `0` alvos Debug Access Port (`DAP`)** (`board_metered = false`, `measured_j = None`).

2. **`Vivado 2026.1` síntese em lote e porta de licenciamento (`SW Build 6511674`)**: Um script em lote reproduzível de baixo consumo de recursos não-projeto (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, visando `xck26-sfvc784-2LV-c` a `250.0 MHz` / `4.000 ns` em modo out-of-context (`OOC`)) foi preparado contra `/tools/Xilinx/2026.1/Vivado/bin/vivado`. A execução de `vivado v2026.1` em modo batch terminou antes de `synth_design` (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`), porque o AMD `Vivado 2025.1+` / `2026.1` requer um arquivo `.lic` Standard/Enterprise gerado explicitamente pelo usuário (`~/.Xilinx/Xilinx.lic` ou `XILINXD_LICENSE_FILE`) mesmo para peças `xck26` de nível Standard, e nenhum arquivo `.lic` foi instalado na estação de trabalho. De acordo com as regras estritas de medição, o `WNS` pós-roteamento, a frequência de relógio máxima place-and-route, e o `report_power` sem vetor (`est_j`) permanecem registrados como `not_available` até que um arquivo `.lic` Standard seja provisionado.

3. **Decomposição de primitivas UltraScale+ `xcup` de subsistema completo, orçamento `IOB` e auditoria topológica de nível lógico (`Yosys 0.71+`)**: Sintetizando tanto `clai_benes_paged_hotswap_core` quanto `clai_kv260_axi_top` via `synth_xilinx -family xcup` e `ltp -noff` (enquanto registra o host `RAPL package-0` `reported_j` estritamente como custo de compilação `EDA` $E_{\text{compile}}$ em `x86-64`, nunca como potência de silício FPGA) estabeleceu contagens exatas de células e profundidades combinacionais do caminho crítico:

| `xck26-sfvc784-2LV-c` Módulo Alvo | LUTs CLB (`% xck26`) | Primitivas LUT Dominantes | Registos CLB (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | Portas de Topo (`IBUF`+`OBUF`) | Profundidade Combinatória (`ltp`) | `RAPL` de Síntese no Anfitrião (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` páginas) | **`41.185`** (`35,17%`) | `19.982 LUT3`, `7.804 LUT6`, `7.714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36.464`** (`15,57%`) | **`81`** (`56,25%`) | **`0`** | `1.599` (`OOC` / barramento interno) | **`81` níveis** | `7.297,3 J` (`144,8 s`) |
| **`clai_kv260_axi_top`** (subsistema `AXI4` Rung-0) | **`67.366`** (`57,52%`) | `25.557 LUT6`, `25.333 LUT5`, `7.918 LUT3`, `569 CARRY4` | **`16.619`** (`7,09%`) | **`4`** (`2,78%`) | **`0`** | `126` (`<= 189` `IOB`s; `PS-PL`) | **`73` níveis** | `10.089,4 J` (`214,8 s`) |

Duas restrições concretas de conceção física emergem da auditoria dos primitivos `xcup` e `ltp`:
- **Confinamento do orçamento de pinos (`OOC` vs. invólucro `AXI` `PS-PL`)**: Porque `clai_benes_paged_hotswap_core` expõe o `CodeBitBus` bruto de `512` bits e vetores largos de configuração-sombra (`1.379` buffers de entrada (`IBUF`) + `220` buffers de saída (`OBUF`) = `1.599` portas vs. `189` `IOB`s do encapsulamento em `xck26-sfvc784-2LV-c`), a implementação autónoma do fornecedor deve correr com `synth_design -mode out_of_context` ou dentro de um invólucro `AXI4-Stream` / `zynq_ultra_ps_e` tal como `clai_kv260_axi_top` (`126` portas, `57,52%` de utilização de LUT).
- **Profundidade combinatória não encadeada (`81` e `73` níveis) vs. fecho a `250 MHz` (`4,000 ns`) em `-2LV`**: Embora o Verilator `5.054` verifique `CPI = 1,0` (`1` pesquisa por ciclo de relógio) com exatidão de ciclo, percorrer `17` estágios `Beneš-1` + `9` estágios de cópia de prefixo + `17` estágios `Beneš-2` + multiplexação dinâmica de tabelas de verdade `LUT6` + redução por maioria de `5`-votantes num único ciclo combinatório abrange **`81` níveis primitivos** (`73` níveis no contador de população combinatória de `64` entradas e comparador de margem de `8` classes de `clai_kv260_axi_top`). O fecho a `250 MHz` (`4,000 ns`) pós-colocação-e-encaminhamento em silício de baixa tensão (`0,72 V`) `-2LV` favorece, portanto, a inserção de `2` a `3` estágios de registos de encadeamento ao longo de $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ (e `1` estágio de registo entre a árvore de contagem de população de `64` fios e o comparador top-`2`), preservando a taxa de transferência `CPI = 1,0` (`1` contexto por relógio) a uma latência de encadeamento de `3`-`4` ciclos.

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Trabalhos relacionados e observações de convergência

| Sistema | ID / Venue | O que estabelece | Custo conforme reportado | Diferença nesta referência |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Camadas neurais quantizadas esparsas compiladas em LUTs de FPGA. | Síntese de LUT de FPGA e Fmax. | Fios estáticos necessitam re-PAR no Vivado em deslocamento versus Beneš de `1` ciclo + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Portas booleanas diferenciáveis e redes LUT sem pesos. | Contagens de portas e acurácia. | Roteamento estático cai para `52.34%` em deslocamento VLAN e sofre quimeras marginais de plano de bits. |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Produtos de matriz ternária / baixo-bit via consulta de tabela em CPU/FPGA. | Latência e potência de FPGA. | Acelera álgebra linear dentro de uma engrenagem de modelo; não contorna a invocação de modelo. |
| **LittleBit** (Lee et al., 2025) & **LittleBit-2** (Lee and Kim, 2026) | `arXiv:2506.13771` · `arXiv:2603.00042` | Fatoração latente binária sub-1-bit (`0.1-0.58` bits/peso) via `SVD` / `ITQ` + QAT de `5` épocas. | Compressão (`11.6×-31×`), PPL e acurácia de QAT. | Desempacota bitpacks para MACs binários densos em tempo de execução e cai para `0.00%` em codificação exata (`Claim LA-11`); `Sub1Bit-LUT6` usa `0` MACs binários e `MoL` restaura paridade de `100.0%` em `0` épocas de QAT. |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Cascatas LLM de fraco-para-forte e roteadores de preferência. | Preço em dólar de API versus qualidade. | Carece de um portão determinístico $C(z)$ (`89.58%` de commits quebrados em `Claim LA-11`) e não possui compilador descendente `LUT6`. |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Roteamento bandit multi-LLM e serviço com escala de frequência. | Wh de GPU dos autores (`Zeus` / `pyNVML`). | Otimiza serviço de GPU; esta referência compila ativações em páginas `LUT6` de `0`-FLOP (`est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Rascunhos especulativos neurais MLP, de árvore de rascunho e em cascata. | Aceleração de relógio de parede. | Requerem FLOPs de rascunho e leituras de peso versus páginas `uint64` `LUT6` de `0`-FLOP. |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Rascunhos de n-grama de prompt de zero-FLOP e sufixo-trie de datastore. | Aceleração de latência (`0` FLOPs). | `PLD` perde tokens fora do prompt; `REST` usa tries variáveis versus páginas `RAMB36E2`. |
| **AirLLM** (lyogavin, 2023) | Open-source SSD streamer | Streaming de pesos SSD camada a camada em RAM pequena. | Pegada de RAM ativa. | `T=1` puro (`1.0 tok/sweep`) + derramamento de KV versus redução de varredura `AirMoL` de `2.74×-2.86×`. |
| **Metered Commit Gates** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Portas de commit (`11,428 pJ` KV260 `INA260` SOM reading), $p_i/c_i$ de MoL e `RCE-JEPA`. | KV260 SOM `measured_j` + `est_j`. | Fundação da mesma casa; estendida aqui com compilação descendente Beneš `LUT6` e `AirMoL`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. Limites, ameaças à validade, não reivindicado e falsificadores

**Validade interna e de constructo.** Sob ruído aleatório uniforme ou churn adversarial por passo ($\Delta T = 1$), a Proposição 1 fornece poupança de compilação descendente nula e reverte para `1.00 tok/sweep`. Paridade sem perdas (`100.0%`) garante concordância bit-a-bit com a decodificação gulosa do alvo sem elevar o teto de capacidade de um ponto de verificação base `350M` ou `0.8B`.

**Validade de medição e não reivindicado.** Os números de joules por tarefa (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`) são figuras analíticas `est_j` (`measured_j = None`), e os deltas cumulativos `PMU` do macOS incluem carga de exibição de todo o sistema, SSD e fundo do SO em vez de watts isolados do trilho do chip. Yosys `0.71+` e Verilator `5.054` estabelecem síntese de netlist estrutural `xck26` e simulação de ciclo `CPI = 1`, não o fechamento de temporização Vivado pós-PAR a `250 MHz` e não watts de trilho físico KV260 (`board_metered = false`). Liderança energética de silício, promoção de saídas `ModelGenerated` para `Deterministic`, avaliação em escala de repositório completo `SWE-bench` para além do benchmark de contrato de `48` tarefas, e execuções medidas `70B` (`air_mol_nvme_baselines.csv` reporta projeções analíticas `70B` para além das execuções medidas `34.66B` de `Qwen3.6-35B-A3B`) não são reivindicados.

| ID | Alegação | Condição Exata de Refutação / Falsificador |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` falha `100.0%` de paridade Verilator em `5,120` pacotes ou perde o deslocamento VLAN do pacote `2,500`. |
| **`LA-F2`** | `Claim LA-2` (Polyglot suite) | Zig aloca `> 0` bytes de heap em loop quente, Go relata `> 0 allocs/op`, ou Julia Enzyme excede `1e-7` erro FD. |
| **`LA-F3`** | `Claim LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` excede `117,120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s, ou `1` ciclo por troca de página. |
| **`LA-F4`** | `Claim LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` excede risco falso alvo $\alpha = 0.02$ em tráfego deslocado ou marca `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Byte speculation) | `scripts/run_code_corpus_benchmark.py` produz `< 100.0%` de paridade de bytes exata contra o ganancioso `Mamba3CodeLM` em `48` prompts não vistos. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` sob `F_NOCACHE` falha `100%` de paridade ou lê mais bytes NVMe que `AirLLM` 4-Bit `T=1`. |
| **`LA-F7`** | `Claim LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`, `scripts/run_hf_air_mol_pretrained.py` ou `scripts/run_hf_qwen35_air_mol.py` diverge por $\ge 1$ token BPE do alvo ganancioso. |
| **`LA-F8`** | `Claim LA-8` (Regression suite) | `pytest -v` falha em qualquer um dos `22` testes em `tests/`. |
| **`LA-F9`** | `Claim LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` diverge de paridade de token `100%` ou lê mais bytes NVMe que `AirLLM` ou `Expert-AirLLM`. |
| **`LA-F10`** | `Claim LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` excede erro máximo `1e-3` contra multiplicação binária densa `ITQ` ou falha `100%` de paridade verificada. |
| **`LA-F11`** | `Claim LA-11` (`48`-Task Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` admite `> 0%` de commits quebrados ou admite uma habilidade Wave-1 obsoleta sob mutação da especificação Wave-2. |

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
</ol>

---

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## Apêndice A. Reprodutibilidade

A partir de um checkout de [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit a5e9bc1`):

```bash
PYTHONPATH=src .venv/bin/pytest -v
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
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
```
