---
title: "Compilação descendente em LUT6 numa cascata Mixture of Limits: malhas booleanas roteadas por Beneš, portas de ativação conformais e streaming de camadas NVMe de 4 bits"
deck: "Uma cascata Mixture of Limits (mistura de limites) de quatro degraus que testa primeiro circuitos paginados de tabelas de busca de 6 entradas (LUT6) com zero operações de ponto flutuante (FLOP), aciona o Mamba-3 e modelos híbridos de 2026 transmitidos por camadas a partir de Non-Volatile Memory Express (NVMe) de 4 bits apenas em falhas de busca, e compila de forma descendente as ativações certificadas para páginas de Block RAM de 36 Kbits (RAMB36E2) roteadas por Beneš. Tempos de relógio real, contagens de bytes sem buffer sob Darwin F_NOCACHE (leitura de arquivo sem cache), memória ativa de acesso aleatório (RAM) e simulações em nível de transferência entre registradores (RTL) no Yosys/Verilator para o xck26 são relatados a partir de openIE-dev/lut-adapt-ai no commit 9dbf745. Os valores de energia são estimativas analíticas est_j; nenhuma potência física na placa foi medida."
lang: "pt"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-4-bit-nvme-layer-streaming" class="anchor-alias" aria-hidden="true"></div>

*Revisão 11dbc8c, 22 de novembro de 2026. Implementação de referência e artefatos: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) em [`9dbf745f6ea7aecba26a70482138e0f2d8bbe9c0`](https://github.com/openIE-dev/lut-adapt-ai/tree/9dbf745f6ea7aecba26a70482138e0f2d8bbe9c0). Resumo de dados: [/data/#lut-adapt](/data/#lut-adapt). PDF em LaTeX: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([código-fonte](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. Visão geral

Este estudo examina como um sistema de computação pode compilar de forma descendente o trabalho repetido de modelos neurais em buscas rápidas em tabelas booleanas sem perder a paridade exata de saída nem promover palpites não verificados à condição de regras confiáveis. Relatam-se medições de software, síntese em nível de transferência entre registradores (RTL) e simulações por ciclo, além de estimativas analíticas de energia devidamente rotuladas (`est_j`). Nenhum medidor de joules de tomada ou de barramento de alimentação foi conectado neste repositório (`measured_j` não está definido; `board_metered` é falso).

**Em palavras simples**

1. A maioria das entradas vistas por um sistema implantado repete padrões que ele já resolveu antes, de modo que executar uma rede neural completa em ponto flutuante a cada passo desperdiça cômputo e largura de banda de memória.
2. A arquitetura de referência posiciona uma camada reconfigurável de busca em tabelas-verdade de 6 entradas (`LUT6`) à frente dos modelos de espaço de estados em fluxo e dos modelos fundacionais, compilando as respostas para baixo em páginas de memória de busca somente depois que uma verificação explícita as certifica.
3. Quando um modelo de linguagem híbrido de 2026 transmite seus pesos camada por camada a partir de uma unidade de estado sólido, esse rascunhador `LUT6` de zero FLOP propõe rajadas de múltiplos tokens que o modelo-alvo verifica numa única varredura de disco, reduzindo as leituras de disco em quase `3×` com alteração zero nos tokens de saída.

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. Termos, siglas e rótulos de medição

<ul id="terms">
<li>MoL: Mixture of Limits (mistura de limites), a regra de cascata definida em Portas de confirmação medidas, Parte II [same house]</li>
<li>LA: prefixo de alegações e falseadores (LA-1 a LA-8, LA-F1 a LA-F8) utilizado neste estudo</li>
<li>LUT, LUT6, INIT: tabela de busca (look-up table), primitiva booleana de 6 entradas do Xilinx UltraScale+ e sua máscara de inicialização de tabela-verdade de 64 bits</li>
<li>BRAM, RAMB36E2, URAM: Block RAM, a primitiva Block RAM de porta dupla de 36 Kbits do UltraScale+ (144 unidades no xck26) e UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: bloco lógico configurável, flip-flop, fatia de processamento digital de sinais e placa AMD Kria KV260 (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: matriz de portas programáveis em campo, circuito integrado de aplicação específica, nível de transferência entre registradores, ciclos por busca, posicionamento e roteamento (place-and-route), pior folga negativa (worst negative slack) e conferência Field-Programmable Logic</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML: Advanced eXtensible Interface, sistema de processamento Zynq, lógica programável, sistema em módulo, circuito integrado monitor de potência na placa, barramento de alimentação, Intel Running Average Power Limit e NVIDIA Management Library</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: dualidade de espaço de estados (State Space Duality), modelo de espaço de estados, múltiplas entradas e múltiplas saídas, codificação posicional rotacional, ativação de unidade linear com porta, atenção de consultas agrupadas, cache chave-valor, codificação por pares de bytes, grande(s) modelo(s) de linguagem, mistura de especialistas (Mixture-of-Experts), perceptron multicamadas e gramática livre de contexto</li>
<li>HC, SOINN, WNN, DWN: rede neural incremental auto-organizável de contexto hierárquico (hierarchy-context Self-Organizing Incremental Neural Network), rede neural sem pesos e rede neural diferenciável sem pesos (Differentiable Weightless Neural Network)</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: arquitetura preditiva de incorporação conjunta, modelo de raciocínio baseado em energia, inferência conformal adaptativa (Adaptive Conformal Inference), fora de distribuição, área sob a curva característica de operação do receptor, probabilidade softmax máxima e Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, HF: decodificação por busca no prompt (Prompt Lookup Decoding), decodificação especulativa baseada em recuperação, algoritmo de extrapolação para maior eficiência em modelos de linguagem, Liquid Foundation Model 2.5 (LiquidAI/LFM2.5-350M) e HuggingFace</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB: armazenamento Non-Volatile Memory Express, sinalizador Darwin F_NOCACHE de leitura sem buffer, interface portátil de sistema operacional, memória de acesso aleatório, RAM dinâmica, RAM estática, entrada/saída, kilobyte, megabyte e gigabyte</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, SIMD, AD, FD, BPB, FP16, FP32, INT4: operação(ões) de ponto flutuante, milhões de FLOPs, multiplicação-acumulação, instrução única sobre múltiplos dados, diferenciação automática, diferenças finitas, bits por byte, ponto flutuante de 16/32 bits e inteiro de 4 bits</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house], Wise Computer Automation [same house], conclusão verificada (verified completion) e prefixo de benchmarks de engenharia de software</li>
<li>CLI, HTTP, SSE, API, ACL, OS, CPU, GPU, SW: interface de linha de comando, protocolo de transferência de hipertexto, eventos enviados pelo servidor (Server-Sent Events), interface de programação de aplicações, Association for Computational Linguistics, sistema operacional, unidade central ou gráfica de processamento e software</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CAM, XNOR: rede local virtual (IEEE 802.1Q), segurança da camada de transporte, inspeção profunda de pacotes, árvore de sintaxe abstrata, JavaScript Object Notation, valores separados por vírgulas, algoritmo de hash seguro, memória endereçável por conteúdo e porta NOR exclusiva</li>
</ul>

Três classes de evidência permanecem estritamente separadas em todas as tabelas abaixo:

| Rótulo de evidência | Significado neste estudo |
| :--- | :--- |
| **`Measured (SW / NVMe I/O)`** | Contagens exatas de bytes lidos ou gravados via `os.pread` sob Darwin `F_NOCACHE`, alocações de memória residente, segundos de relógio real no Apple M5 Max e concordância exata de bits ou tokens. `measured_j` não está definido (`None`). |
| **`Simulated (RTL)`** | Contagens estruturais de netlist obtidas pelo Yosys `0.71+` (`synth_xilinx -family xcup` direcionado ao Kria KV260 `xck26`) e contagens de ciclos (`CPI = 1`) pelo Verilator `5.054`. Não representa fechamento de temporização no Vivado nem potência medida na placa (`board_metered = false`). |
| **`Estimated (est_j)`** | Joules analíticos calculados a partir de contagens de operações ou substitutos temporais de potência térmica de projeto (modo de contingência do `joule_meter.py` quando os contadores de hardware `RAPL`/`NVML` estão ausentes no macOS). Comparáveis apenas entre braços dentro da mesma fórmula; nunca representam watts medidos no silício. |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 Contexto arquitetural e contribuições

Em [Portas de confirmação medidas](/papers/gates/) `[same house]`, a Parte II define **Mixture of Limits (mistura de limites)**: tentar as engrenagens em ordem decrescente de probabilidade de aprovação por joule $p_i / c_i$ (Simon e Kadane, 1975), parar assim que o predicado de conclusão da tarefa $C(z) = 1$ for satisfeito, e proibir o fortalecimento de uma saída `ModelGenerated` para `Deterministic`. Uma camada de busca estática, contudo, cobre apenas as entradas gravadas nela antes da implantação. Inversamente, as redes neurais baseadas em tabelas de busca existentes (LogicNets de Umuroglu et al., 2020; DiffLogic de Petersen et al., 2022; e Differentiable Weightless Neural Networks de Bacellar et al., 2024) fixam a conectividade dos fios dentro do roteamento estático do FPGA, exigindo novo posicionamento e roteamento pela ferramenta do fabricante sempre que a distribuição de entrada se desloca.

A implementação de referência `lut-adapt-ai` fecha o ciclo entre o topo e a base da cascata por meio da **compilação descendente online em `LUT6`**:

- **Degrau 0 (Busca - Beneš paginado + `LUT6`)**: Avalia máscaras de tabelas-verdade de 64 bits roteadas através de um comutador multicast sem bloqueio $512 \times 512$ **Beneš-Copy-Beneš** e armazenadas em cache ao longo de $81 \times \texttt{RAMB36E2}$ memórias em bloco de porta dupla (`0` operações de ponto flutuante, troca de página em ciclo único na simulação Verilator).
- **Degrau 1 (Fluxo - Dualidade de Espaço de Estados MIMO Complexa `Mamba-3`)**: Trata as falhas de busca que dependem do histórico da sequência usando um estado recorrente de tamanho constante $O(1)$ (`48 KB` de memória fixada na referência de `14.3M` parâmetros), evitando o crescimento $O(L)$ do cache chave-valor.
- **Degrau 2 (Topologia - `HC-SOINN`)**: Mantém online uma topologia de protótipos sobre incorporações latentes, isolando fronteiras de regime e acionando um disjuntor (`Refuse` de recusa ou escalonamento) quando chega um deslocamento de distribuição não rotulado.
- **Degrau 3 (Modelo por último - `JEPA-EBRM` e streaming NVMe de 4 bits `AirMoL`)**: Invoca a verificação baseada em energia latente ou modelos fundacionais pré-treinados de 2026 transmitidos por camadas (`LiquidAI/LFM2.5-350M` e `Qwen/Qwen3.5-0.8B-Base`) somente quando os degraus mais baratos se abstêm ou exigem verificação exata pelo modelo-alvo.
- **`SleepCrystallizer` descendente**: Extrai rastros recorrentes de ativação usando partidas a quente espectrais de Walsh-Hadamard, tabelas-verdade de mintermos de moda conjunta e escalonamentos de comutadores de Waksman, alternando bancos de memória em bloco em sombra sem interromper a inferência nem executar posicionamento e roteamento no FPGA.

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 Contribuições

1. **Condição de compilação descendente amortizada**: Estende a ordenação $p_i/c_i$ de Simon-Kadane com um custo explícito de compilação $E_{\text{compile}}$ ao longo de um horizonte estacionário $\Delta T$.
2. **Arquitetura RTL sem bloqueio $512 \times 512$ Beneš-Copy-Beneš e `81` blocos `RAMB36E2`**: Elimina tanto o transbordamento lógico de `102.0%` no Kria KV260 causado por matrizes crossbar planas (`119,478` LUTs) quanto a explosão de `926,619` LUTs dos multiplexadores de páginas em flip-flops, sintetizando em `41,186` LUTs de CLB UltraScale+ (`35.2%` do `xck26`), `81` blocos `RAMB36E2` (`56.2%`) e `0` fatias `DSP48`, com troca de página em `1` ciclo (`4.0 ns` a `250 MHz` nominais) em simulação.
3. **Síntese universal de mintermos de moda conjunta de $\le 64$ bits**: Demonstra que a busca por mintermos de moda conjunta domina o arredondamento marginal por planos de bits da DiffLogic em ramos correlacionados e empacota $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ tokens de subpalavra numa única palavra `uint64` (`16b × 4 = 64b` para `|V| = 65,536`; `18b × 3 = 54b` para `|V| = 248,320`).
4. **Porta de cristalização Split-Conformal + ACI online sem oráculo**: Combina um escore de não conformidade `JEPA-EBRM` latente radialmente regularizado com calibração Split Conformal e Inferência Conformal Adaptativa (Gibbs e Candès, 2021), registrando `0.00%` de risco de falsa cristalização e `1.0000` de AUROC fora de distribuição em tráfego deslocado, onde as linhas de base softmax e MC-Dropout registram `17.62%-24.28%` de falso risco.
5. **Streaming NVMe de 4 bits `AirMoL` sem varreduras extras em modelos híbridos de 2026**: Combina o streaming de camadas quantizadas em grupos de 4 bits via `os.pread` com Darwin `F_NOCACHE`, reversão em RAM do estado híbrido e especulação online por rajadas de tokens em `LUT6` nos modelos `LiquidAI/LFM2.5-350M` (março de 2026) e `Qwen/Qwen3.5-0.8B-Base` (fevereiro de 2026), reduzindo as leituras NVMe em disco em `2.86×` e `2.74×` com `100.0%` de paridade exata de tokens enquanto mantém a RAM ativa de pesos em `8.45%-9.47%` do tamanho do modelo em FP32.
6. **Suíte poliglota de sistemas e servidor HTTP/SSE ao vivo**: Realiza verificação cruzada da cascata em Python/PyTorch/Triton, Rust `Burn 0.22.1 / CubeCL` Metal, Zig `0.17.1`, Go `1.27.4` SIMD, Julia `1.13.4` Enzyme e `mol_code_cli.py`.

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

## 3. Arquitetura de referência, suíte poliglota e RTL no KV260

A Figura 1 mostra a cascata de quatro degraus e o laço descendente do `SleepCrystallizer` em `src/clai/`.

![Figura 1. Compilação descendente ao longo de uma cascata Mixture of Limits de quatro degraus.](/figures/lut-adapt/mol-downward-cascade.svg)

*Figura 1. Compilação descendente ao longo de uma cascata Mixture of Limits de quatro degraus. Diagrama de projeto, não uma medição de potência na placa. [PNG](/figures/lut-adapt/mol-downward-cascade.png) · [Explorador interativo](/living/lut-adapt/#la-diag-01).*

Cinco implementações de sistemas em `openIE-dev/lut-adapt-ai` realizam a verificação cruzada da cascata: Python/PyTorch/Triton (`src/clai/`), Rust `Burn 0.22.1 / CubeCL` Metal (`sys/rust/`), Zig `0.17.1` (`sys/zig/`), Go `1.27.4` SIMD (`sys/go/`) e Julia `1.13.4` Enzyme (`sys/julia/`).

A Figura 2 ilustra o caminho de dados RTL do Kria KV260 (`xck26`) em `hw/kv260/rtl/clai_benes_hotswap_core.sv`, mapeando `512` páginas `LUT6` residentes (`5,120` bits `INIT` + tag de contexto de `48` bits + bit de validade) em `81` memórias `RAMB36E2` de porta dupla em paralelo para troca de contexto em ciclo único (`4.0 ns` a `250 MHz` nominais, `CPI = 1.0`).

![Figura 2. Malha multicast Beneš-Copy-Beneš e cache de páginas LUT6 em BRAM de ciclo único.](/figures/lut-adapt/benes-paged-silicon.svg)

*Figura 2. Malha multicast `512×512` Beneš-Copy-Beneš e cache de páginas `LUT6` de ciclo único em `81 × RAMB36E2` direcionados ao AMD Kria KV260 (`xck26`) em simulação no Yosys `0.71+` e Verilator `5.054` (`board_metered = false`). [PNG](/figures/lut-adapt/benes-paged-silicon.png) · [Explorador interativo](/living/lut-adapt/#la-diag-02).*

A Figura 3 mostra o `AirMoL` (`src/clai/frontier/air_mol_streamer.py` e `hf_air_mol_pretrained.py`), que transmite fragmentos quantizados em grupos de 4 bits via `os.pread` sob Darwin `F_NOCACHE`, verifica `[last_tok, d_1..d_K]` numa única varredura e captura instantâneos em RAM de estados híbridos compactos (`Short-Conv/SSM` ou `Gated DeltaNet` + recorte KV esparso de `GQA` em `6` camadas), de modo que rejeições parciais do rascunho exijam **zero varreduras NVMe extras**.

![Figura 3. Streaming de camadas NVMe de 4 bits AirMoL com especulação universal LUT6 de tokens de 64 bits.](/figures/lut-adapt/airmol-nvme-speculation.svg)

*Figura 3. Streaming de camadas NVMe de 4 bits `AirMoL` sem varreduras extras com especulação universal `LUT6` de tokens de `≤64` bits nos modelos `LiquidAI/LFM2.5-350M` e `Qwen/Qwen3.5-0.8B-Base`. [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [Explorador interativo](/living/lut-adapt/#la-run-01).*

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

<div id="47-claim-la-7-pretrained-2026-hybrid-models-under-airmol-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 Alegação LA-7: Modelos híbridos pré-treinados de 2026 sob `AirMoL` (`LFM2.5-350M` e `Qwen3.5-0.8B-Base`)

| Checkpoint 2026 e braço experimental | Paridade | Tok / Varredura | Caract. / Varredura | Varreduras | Leitura NVMe | RAM ativa de pico (`% FP32`) | `tok/s` | Classe de evidência |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Medido (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4 bits (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Medido (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4 bits + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Medido (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` `LUT6` a frio** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Medido (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` pós-ativação** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Medido (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4 bits (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Medido (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4 bits + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Medido (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` `LUT6` a frio** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Medido (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` pós-ativação** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Medido (`F_NOCACHE`)** |

Observe-se o compromisso de desempenho preservado no `Qwen3.5-0.8B-Base` em prompts inéditos a frio: o `AirMoL` reduz as leituras NVMe em disco de `12.674 GB` para `8.581 GB`, mas a verificação em lote de `4` tokens pelo Gated DeltaNet em CPU reduz a vazão em tempo de relógio (`0.32` contra `0.53 tok/s`) até que a cristalização online das ativações em `LUT6` eleve a aceitação para `2.74 tok/sweep` (`4.621 GB` lidos, `1.11 tok/s`).

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 Alegação LA-8: CLI ao vivo e servidor de streaming HTTP/SSE (`mol_code_cli.py`)

O script `scripts/mol_code_cli.py` disponibiliza `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b}` e `--air-nvme` por meio de CLI e endpoints SSE (`/v1/health`, `/v1/complete`, `/v1/crystallize`), elevando ao vivo a ocupação de slots `RAMB36E2` de `438/512` para `460/512` com aprovação em `18/18` suítes de teste `pytest`.

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. Trabalhos relacionados e observações de convergência

| Sistema | ID / Veículo | O que estabelece | Custo conforme relatado | Diferença nesta referência |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | Camadas neurais esparsas quantizadas compiladas em LUTs de FPGA. | Síntese de LUTs em FPGA e Fmax. | Fiação estática exige re-PAR no Vivado após mudança, contra troca em `1` ciclo via Beneš + `RAMB36E2`. |
| **DiffLogic** (Petersen et al., 2022) e **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | Redes diferenciáveis de portas booleanas e redes LUT sem pesos. | Contagem de portas e acurácia. | Roteamento estático cai para `52.34%` na mudança de VLAN e sofre quimeras marginais por planos de bits. |
| **T-MAC** (Wei et al., 2024) e **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | Produtos matriciais ternários ou de poucos bits via busca em tabela em CPU/FPGA. | Latência e potência em FPGA. | Acelera a álgebra linear dentro de uma engrenagem de modelo; não contorna a invocação do modelo. |
| **FrugalGPT** (Chen et al., 2023) e **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | Cascatas de LLMs do fraco ao forte e roteadores de preferência. | Preço em dólares de API versus qualidade. | Roteamento apenas entre modelos; sem piso de busca `LUT6` nem compilação descendente. |
| **GreenServ** (2026) e **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | Roteamento bandit multi-LLM e serviço com escalonamento de frequência. | Wh de GPU relatados pelos autores (`Zeus` / `pyNVML`). | Otimiza o serviço em GPU; esta referência compila ativações em páginas `LUT6` de `0` FLOP (`est_j`). |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | Rascunhadores especulativos baseados em MLP neural, árvore de rascunho e cascata. | Aceleração em tempo de relógio real. | Exigem FLOPs de rascunho e leituras de pesos, contra páginas `LUT6` `uint64` de `0` FLOP. |
| **PLD** (Saxena, 2023) e **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | Rascunhadores de zero FLOP por n-gramas no prompt e trie de sufixos em repositório. | Aceleração de latência (`0` FLOPs). | `PLD` perde tokens fora do prompt; `REST` percorre tries variáveis contra páginas fixas `RAMB36E2`. |
| **AirLLM** (lyogavin, 2023) | Streamer SSD de código aberto | Streaming de pesos do SSD camada por camada em pouca RAM. | Pegada de RAM ativa. | Puro `T=1` (`1.0 tok/sweep`) + despejo KV contra redução de varreduras de `2.74×-2.86×` no `AirMoL`. |
| **Portas de confirmação medidas** e **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Portas de confirmação (leitura SOM `INA260` no KV260 de `11,428 pJ`), MoL $p_i/c_i$ e `RCE-JEPA`. | `measured_j` + `est_j` no SOM KV260. | Base da mesma casa; estendida aqui com compilação descendente Beneš `LUT6` e `AirMoL`. |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. Limites, ameaças à validade, o que não é alegado e falseadores

**Validade interna e de construto.** Sob ruído aleatório uniforme ou alternância adversária passo a passo ($\Delta T = 1$), a Proposição 1 resulta em economia zero pela compilação descendente e recua para `1.00 tok/sweep`. A paridade sem perdas (`100.0%`) garante concordância bit a bit com a decodificação gulosa do modelo-alvo sem elevar o teto de capacidade de um checkpoint base de `350M` ou `0.8B` parâmetros.

**Validade de medição e o que não é alegado.** Todo valor em joules neste estudo é uma estimativa analítica `est_j` (`measured_j = None`). O Yosys `0.71+` e o Verilator `5.054` estabelecem a síntese estrutural de netlist para o `xck26` e a simulação por ciclos com `CPI = 1`, não o fechamento de temporização pós-PAR no Vivado a `250 MHz` nem watts físicos nos barramentos do KV260 (`board_metered = false`). Liderança energética medida em silício, promoção de saídas `ModelGenerated` para `Deterministic` e execuções medidas em modelos de `70B` (`air_mol_nvme_baselines.csv` relata apenas projeções analíticas para `70B`) não são alegadas.

| ID | Alegação | Condição exata de refutação / falseador |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` falha em atingir `100.0%` de paridade no Verilator ao longo de `5,120` pacotes ou perde a mudança de VLAN no pacote `2,500`. |
| **`LA-F2`** | `Claim LA-2` (Suíte poliglota) | Zig aloca `> 0` bytes de heap no laço crítico, Go relata `> 0 allocs/op` ou o Enzyme em Julia excede erro de `1e-7` frente a diferenças finitas. |
| **`LA-F3`** | `Claim LA-3` (RTL paginado KV260) | `scripts/verify_paged_bram_rtl.py` excede `117,120` LUTs, `144` blocos `RAMB36E2`, `0` fatias `DSP48` ou `1` ciclo por troca de página. |
| **`LA-F4`** | `Claim LA-4` (ACI conformal) | `scripts/run_frontier_benchmarks.py` excede o risco falso-alvo $\alpha = 0.02$ em tráfego deslocado ou rotula saídas como `Deterministic`. |
| **`LA-F5`** | `Claim LA-5` (Especulação em bytes) | `scripts/run_code_corpus_benchmark.py` produz `< 100.0%` de paridade exata em bytes contra o `Mamba3CodeLM` guloso em `48` prompts inéditos. |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` sob `F_NOCACHE` falha em manter `100%` de paridade ou lê mais bytes NVMe que o `AirLLM` de 4 bits `T=1`. |
| **`LA-F7`** | `Claim LA-7` (`AirMoL` HF 2026) | `scripts/run_hf_air_mol_pretrained.py` ou `scripts/run_hf_qwen35_air_mol.py` diverge em $\ge 1$ token BPE em relação ao alvo guloso. |
| **`LA-F8`** | `Claim LA-8` (Suíte de regressão) | `pytest -v` falha em qualquer uma das `18` suítes de teste em `tests/`. |

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
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455-1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094-1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026). <code>LiquidAI/LFM2.5-350M</code> Open-Weights Hybrid Model Card (March 2026). <a href="https://huggingface.co/LiquidAI/LFM2.5-350M">huggingface.co/LiquidAI/LFM2.5-350M</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
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

A partir de uma cópia local de [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit 9dbf745`):

```bash
PYTHONPATH=src .venv/bin/pytest -v
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
```
