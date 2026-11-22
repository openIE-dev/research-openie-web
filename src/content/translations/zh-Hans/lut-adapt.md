---
title: "Mixture of Limits 级联中的向下 LUT6 编译：Beneš 路由布尔架构、共形唤醒门槛与前沿稀疏 MoE NVMe 按层流式传输"
deck: "Mixture of Limits 级联中的向下 LUT6 编译：Beneš 路由布尔架构、共形唤醒门槛与前沿稀疏 MoE NVMe 按层流式传输  一种 Mixture of Limits 级联，它首先尝试零浮点运算（FLOP）的分页 6 输入查找表（LUT6）电路，仅在缺失时流式传输 4 位 Non-Volatile Memory Express (NVMe) 混合与稀疏 Mixture-of-Experts (MoE) 2026 年底模型（参数量高达 34.66B），通过确定性验证器门控提交，并将认证唤醒向下编译为 Beneš 路由的 36-Kbit Block RAM (RAMB36E2) 页。报告了来自 openIE-dev/lut-adapt-ai 在提交 a5e9bc1 的壁钟时间、未缓冲 Darwin F_NOCACHE（未缓冲文件读取）字节计数、活动随机存取内存 (RAM)、整个系统 macOS 电源管理单元 (PMU) 累积增量，以及 Yosys/Verilator xck26 寄存器传输级 (RTL) 仿真。每任务能耗数据为分析性的 est_j 估计值；未测量隔离板级电源轨功率。"
lang: "zh-Hans"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*修订版 30613ef，2026年11月22日。参考实现与配套制品：[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)，版本 [`a5e9bc1de280f973bc9051b4cc58942820a67eeb`](https://github.com/openIE-dev/lut-adapt-ai/tree/a5e9bc1de280f973bc9051b4cc58942820a67eeb)。数据摘要：[/data/#lut-adapt](/data/#lut-adapt)。LaTeX PDF：[/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf)（[源文件](/pdfs/latex/lut-adapt.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概览

本研究考察计算系统如何将重复的神经模型工作向下编译为快速布尔表查找，同时不失去精确的输出一致性，也不将未经验证的猜测提升为可信规则。它报告了软件测量、寄存器传输级综合和周期仿真，以及标记的分析能量估计（`est_j`）。在此仓库中未连接墙功或轨功监视器（`measured_j` 未设置；`board_metered` 为 false）。

**用通俗的话**

1. 大多数部署系统所接收到的输入会出现已被解决的重复模式，因此在每一步都运行完整的浮点神经网络会浪费计算和内存带宽。  
2. 参考实现将在流式状态空间和基础模型之前放置一个可重构的 6 输入真值表（`LUT6`）查找层，并仅在显式检查通过后将答案向下编译为查找内存页。  
3. 当2026 年底的混合稀疏专家混合模型语言模型规模高达 `34.66B` 参数，并从固态存储流式传输 4 位权重时，路由稀疏专家读取与零 FLOP `LUT6` 起草器配对，可将磁盘读取量降低至最高 `12.30×`（令牌吞吐速率提升 `6.50×`），在 `2.53` GB 的活跃内存中实现且输出令牌保持零变化；在确定性检查之后进行门控代码提交，能够超越独立 `35B` 的准确度且不接受任何 `0.00%` 的破损提交，并将结晶化的 Wave-3 任务加速至 `35,590×`。

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语、首字母缩写词和测量标签

<ul id="terms">
<li>MoL: Mixture of Limits，即 Metered Commit Gates 第二部分中的级联规则 [同系列]</li>
<li>LA: 本研究使用的主张与证伪前缀（LA-1 至 LA-11、LA-F1 至 LA-F11）</li>
<li>LUT、LUT6、INIT: 查找表（look-up table）、6 输入 Xilinx UltraScale+ 布尔原语，以及其 64 位真值表初始化掩码</li>
<li>BRAM、RAMB36E2、URAM: 块随机存储器（Block RAM）、36 Kbit 双端口 UltraScale+ 块 RAM 原语（xck26 上为 144 个），以及 UltraRAM</li>
<li>CLB、FF、DSP、DSP48、KV260: 可配置逻辑块（configurable logic block）、触发器（flip-flop）、数字信号处理片（digital signal processing slice）、DSP48 原语，以及 AMD Kria KV260 开发板（xck26）</li>
<li>FPGA、ASIC、RTL、CPI、PAR、WNS、FPL: 现场可编程门阵列（field-programmable gate array）、专用集成电路（application-specific integrated circuit）、寄存器传输级（register-transfer level）、每次查找周期数（cycles per lookup）、布局布线（place-and-route）、最差负时序裕量（worst negative slack），以及现场可编程逻辑会议（Field-Programmable Logic conference）</li>
<li>AXI、PS、PL、SOM、INA260、VCC、RAPL、NVML、PMU: 高级可扩展接口（Advanced eXtensible Interface）、Zynq 处理系统（Zynq processing system）、可编程逻辑（programmable logic）、系统级模块（system-on-module）、板载功率监测芯片（onboard power monitor IC）、供电轨（supply rail）、Intel 运行平均功率限制（Intel Running Average Power Limit）、NVIDIA 管理库（NVIDIA Management Library），以及 macOS 电源管理单元（macOS power management unit）</li>
<li>SSD、SSM、MIMO、RoPE、SwiGLU、GQA、KV、BPE、LLM、LLMs、MoE、MLP、CFG: 状态空间对偶（State Space Duality）、状态空间模型（state-space model）、多输入多输出（multiple-input multiple-output）、旋转位置编码（rotary position embedding）、门控线性单元激活（gated linear unit activation）、分组查询注意力（grouped-query attention）、键值缓存（key-value cache）、字节对编码（byte-pair encoding）、大语言模型（large language model）、混合专家模型（Mixture-of-Experts）、多层感知机（multilayer perceptron），以及上下文无关文法（context-free grammar）</li>
<li>HC、SOINN、WNN、DWN: 层级上下文自组织增量神经网络（hierarchy-context Self-Organizing Incremental Neural Network）、无权重神经网络（weightless neural network），以及可微无权重神经网络（Differentiable Weightless Neural Network）</li>
<li>JEPA、EBRM、ACI、OOD、AUROC、AUC、MSP、MC: 联合嵌入预测架构（Joint-Embedding Predictive Architecture）、基于能量的推理模型（Energy-Based Reasoning Model）、自适应共形推断（Adaptive Conformal Inference）、分布外（out-of-distribution）、接收者操作特征曲线下面积（area under the receiver operating characteristic）、曲线下面积（area under the curve）、最大 softmax 概率（maximum softmax probability），以及蒙特卡洛（Monte Carlo）</li>
<li>PLD、REST、EAGLE、LFM2、LFM3、HF: 提示查找解码（Prompt Lookup Decoding）、基于检索的投机解码（Retrieval-Based Speculative Decoding）、面向更高语言模型效率的外推算法（Extrapolation Algorithm for Greater Language-model Efficiency）、Liquid Foundation Model 2.5（LFM2.5-350M 与 LFM2.5-8B-A1B）、Liquid Foundation Model 3（2026 年 10 月发布的 LiquidAI/LFM3-1.7B），以及 HuggingFace</li>
<li>SVD、ITQ、SVID、QAT、PTQ、PPL、SNR: 奇异值分解（singular value decomposition）、超立方体旋转的迭代量化 Procrustes 方法（Iterative Quantization Procrustes hypercube rotation）、符号值独立分解（sign-value-independent decomposition）、量化感知训练（quantization-aware training）、训练后量化（post-training quantization）、困惑度（perplexity），以及信噪比（signal-to-noise ratio）</li>
<li>NVMe、NOCACHE、POSIX、RAM、DRAM、SRAM、IO、KB、MB、GB: 非易失性内存快速访问存储（Non-Volatile Memory Express storage）、Darwin 的 F_NOCACHE 非缓冲文件标志（Darwin F_NOCACHE unbuffered file flag）、可移植操作系统接口（Portable Operating System Interface）、随机存取存储器（random-access memory）、动态随机存取存储器（dynamic RAM）、静态随机存取存储器（static RAM）、输入/输出（input/output）、千字节（kilobyte）、兆字节（megabyte），以及吉字节（gigabyte）</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, FP16, FP32, INT4: 浮点运算（次），百万 FLOP，乘加运算（次），单指令多数据，自动微分，有限差分，每字节位数，16/32 位浮点数，和 4 位整数</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house]，Wise Computer Automation [same house]，已验证完成，和 software-engineering benchmark 前缀</li>
<li>CLI, HTTP, SSE, API, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW: 命令行界面，超文本传输协议，服务器发送事件，应用程序编程接口，学术计算机科学/工程会议，操作系统，中央/图形处理单元，和软件</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XNOR: 虚拟局域网（IEEE 802.1Q），传输层安全，深度报文检查，抽象语法树，JavaScript 对象表示法，逗号分隔值，安全散列算法，循环冗余校验，异步传输模式（CRC-8/ATM），请求评论，结构化查询语言，DWARF 符号小端 base-128 编码，内容可寻址存储器，和异或非（XNOR）</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, DSP48E2, URAM288, AMD: Joint Test Action Group 调试端口，Xilinx 软件命令行工具调试器，调试访问端口，通用串行总线，Future Technology Devices International 及其 FT2232C 双 UART/FIFO 桥接 IC，通用异步收发器，先进先出缓冲区，集成电路，电子设计自动化，场景外综合模式，Advanced Microcontroller Bus Architecture，AXI4-Lite/AXI4-Stream 互连，输入/输出块，输入/输出缓冲器，同步复位/置位 D 触发器，1 到 5 输入 UltraScale+ 查找表，7/8 输入 UltraScale+ 多路复用器，4 位快速进位链，UltraScale+ DSP 切片，288 Kbit UltraRAM，和 Advanced Micro Devices</li>
</ul>

三类证据在下表中始终保持分离:

| 证据标签 | 本研究中的含义 |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | 通过 Darwin `F_NOCACHE` 下的 `os.pread` 读取或写入的精确字节数、常驻内存分配、挂钟秒数、Apple M5 Max 上全机 macOS `PMU`（`AppleSmartBattery.PowerTelemetryData`）累计能量增量，以及精确的比特与词元一致性。`measured_j` 未设置（`None`）。 |
| **`Simulated (RTL)`** | 来自 Yosys `0.71+`（`synth_xilinx -family xcup`，面向 Kria KV260 `xck26`）的结构化网表计数，以及来自 Verilator `5.054` 的周期计数（`CPI = 1`）。不是 Vivado 时序收敛结果，也不是板级功耗（`board_metered = false`）。 |
| **`Estimated (est_j)`** | 由操作计数或热设计功耗时间替代量计算得到的解析焦耳值（在 macOS 上缺少 `RAPL`/`NVML` 硬件计数器时，采用 `joule_meter.py` 回退方案）。仅可在同一公式内的各实验组之间比较，绝不代表硅片功率（瓦特）。 |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 架构背景与主要贡献

在[计量提交门](/papers/gates/)`[同系列]`中，第二部分定义了**极限混合（Mixture of Limits）**：按每焦耳通过概率 $p_i / c_i$ 递减的顺序尝试各档位（Simon and Kadane, 1975），一旦任务完成谓词 $C(z) = 1$ 成立即停止，并禁止将 `ModelGenerated` 输出强化为 `Deterministic`。然而，静态查找层仅覆盖部署前写入其中的条目。相反，现有的查找表神经网络，包括 LogicNets（Umuroglu et al., 2020）、DiffLogic（Petersen et al., 2022）以及可微无权神经网络（Bacellar et al., 2024），都将连线拓扑固定在静态 FPGA 布线之中，因而每当输入分布发生偏移，就必须重新进行厂商布局布线。

`lut-adapt-ai` 参考实现通过**在线向下 `LUT6` 编译**闭合了级联顶层与底层之间的回路：

- **第 0 级（查找，分页 Beneš + `LUT6`）**：对 64 位真值表掩码进行求值，这些掩码经由无阻塞的 $512 \times 512$ **Beneš-Copy-Beneš** 多播交换机路由，并缓存于 $81 \times \texttt{RAMB36E2}$ 双端口块存储器中（浮点运算次数为 `0`，在 Verilator 仿真中实现单周期页面切换）。
- **第 1 级（流式，`Mamba-3` 复数 MIMO 状态空间对偶）**：利用常数规模的 $O(1)$ 循环状态（在 `14.3M` 参数参考模型中为 `48 KB` 固定内存）处理依赖序列历史的未命中情况，避免 $O(L)$ 键值缓存的增长。
- **第 2 级（拓扑，`HC-SOINN`）**：在潜在嵌入上维护在线原型拓扑，隔离机制边界，并在出现无标签分布偏移时触发断路器（`Refuse` / 上报）。
- **第 3 级（模型最后手段，`JEPA-EBRM`、`AirMoL` 与 `Expert-AirMoL` 4 位 NVMe 流式传输）**：仅当较低级别放弃或需要精确的目标验证时，才调用潜在能量模型验证，或流式加载预训练的 2026 年末混合型与稀疏 MoE 基础模型（`LiquidAI/LFM3-1.7B`、`google/gemma-4-E2B-it`、`LiquidAI/LFM2.5-8B-A1B` 与 `Qwen/Qwen3.6-35B-A3B`，以及 `LiquidAI/LFM2.5-350M` 和 `Qwen/Qwen3.5-0.8B-Base`）。
- **向下的 `SleepCrystallizer`**：利用 Walsh-Hadamard 谱热启动、联合模式极小项真值表以及 Waksman 交换调度提取反复出现的唤醒轨迹，并切换影子块存储器存储体，无需中断推理，也无需运行 FPGA 布局布线。

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 贡献

1. **摊销的向下编译条件**: 将 Simon-Kadane $p_i/c_i$ 排序扩展为在静止视口 $\Delta T$ 上具有显式编译成本 $E_{\text{compile}}$。

2. **非阻塞 $512 \times 512$ Beneš-Copy-Beneš 与 `81`-`RAMB36E2` RTL 架构**: 消除 `102.0%` Kria KV260 逻辑溢出（平面交叉开关 `119,478` LUT）以及 `926,619` LUT 的翻转-页多路复用器爆炸，在仿真中综合得到 `41,186` UltraScale+ CLB LUT（占 `xck26` 的 `35.2%`），`81` 个 `RAMB36E2` 块（`56.2%`），以及 `0` 个 `DSP48` 切片，具备 `1`-cycle（在标称 `250 MHz` 下为 `4.0 ns`）的页切换。

3. **通用 $\le 64$ 位联合模式最小项合成**: 表明联合模式最小项查找在相关分支上的边缘位平面 DiffLogic 舍入中占主导，并将 $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ 子词记号打包进一个 `uint64` 词（`|V| = 65,536` 时 `16b × 4 = 64b`；`|V| = 128,000` 时 `17b × 3 = 51b`；`|V| = 248,320` 时 `18b × 3 = 54b`）。

4. **无预言机 Split-Conformal + 在线 ACI 晶化门**: 将径向正则化的潜在 `JEPA-EBRM` 非一致性得分与 Split Conformal 校准及自适应一致推断（Gibbs 与 Candès, 2021）配对，在偏移流量上记录 `0.00%` 的错误晶化风险和 `1.0000` OOD AUROC，而 softmax 与 MC-Dropout 基线记录 `17.62%-24.28%` 的错误风险。

5. **`AirMoL` 和 `Expert-AirMoL` 4 位 NVMe 流式传输，最高可达 `34.66B` 稀疏 MoE**: 结合 Darwin `F_NOCACHE` `os.pread` 4 位分片、路由器索引的 `.experts.pack4` 字节步长专家读取、混合状态回滚以及在线 token-`LUT6` 爆发式推测，跨 2026 年十月的 `LiquidAI/LFM3-1.7B`（在 FP32 RAM 的 `3.79%` 中实现 `2.74×` NVMe 减少）、`LiquidAI/LFM2.5-8B-A1B`（`8.47B`；实现 `6.90×` NVMe 减少）以及 `Qwen/Qwen3.6-35B-A3B`（`34.66B`；**`12.30×` NVMe reduction**，**`2,530.7 MB` RAM = `3.83%` of FP16**，**`6.50×` speedup**）在 `100.0%` 精确 token 等价下运行。

6. **Zero-MAC `Sub1Bit-LUT6` 与 `LittleBit` 以及验证器门控的 2026 年后期前沿编码级联**: 用零 MAC 的 `6` 输入 `LUT6` 部分和查找（`< 4 × 10⁻⁶` 错误，`MoL` 目标验证在 `0` QAT epoch 中保持 `100.0%` 等价）取代 `LittleBit-1 / LittleBit-2` 的 `1.98M` 运行时二进制 MAC（`0.576` 位/权重；Lee et al., 2025；Lee and Kim, 2026），并在 `48` 任务（`16` 规格 × `3` 波）编码基准中优于独立的 `LittleBit-2 0.55bpw`、`LFM3-1.7B`、`Gemma-4-E2B-it`、`LFM2.5-8B-A1B`、`Qwen3.6-35B-A3B` 与 `RouteLLM`（`43.75%` 对比 `0.00%-33.33%`），实现 **`0.00%` 已接受的破坏提交** 和 **`35,590×` Wave-3 晶化技能加速**，并得到五语言多语验证的支持。

<div id="13-same-house-disclosure-and-provenance-boundaries" class="anchor-alias" aria-hidden="true"></div>

### 1.3 同源研究披露与溯源边界

Open Interface Engineering 此前的研究，包括 [计量提交门槛](/papers/gates/)、[任务饱和与 AI 需求的总体反弹](/papers/satiation/)、[Reality Code Engine](/papers/rce/)、[RCE-JEPA](/papers/rce-jepa/) 以及 [RCE Compile](/papers/rce-compile/)，均属于 `[same house]` 同源工作，文中引用仅作背景披露与架构延续性说明，绝不作为外部独立佐证。以下两条不变量贯穿全文：

- **溯源非强化准则（`ModelGenerated ↛ Deterministic`）**：由确定性 `RCE` 规约检查编译生成的查找表在已验证的留出集上标记为 `Check-safe`（在线运行期间受 `HC-SOINN` / `RCE` 断路器保护）。在无神谕 `JEPA-EBRM` 共形门槛下结晶生成的查找表仅携带有限样本统计界（`Conformal-bounded`，$1-\alpha$），绝不会被提升为 `Deterministic`。
- **提议者与裁决权分离准则（`The drafter proposes; the target decides`）**：在投机解码中，`PagedBenesLUT6` 严格充当零 FLOP 提议者；每一个最终发出的字节或词元都经过目标模型贪心解码的逐一验证（`100.0%` 无损一致性）。

---

<div id="2-mathematical-formulations-and-four-results" class="anchor-alias" aria-hidden="true"></div>

## 2. 数学表述与四项理论结果

<div id="21-result-1-cascade-ordering-with-amortized-downward-compilation" class="anchor-alias" aria-hidden="true"></div>

### 2.1 结果 1：带摊销向下编译的级联排序

考虑针对输入 $x$ 按顺序依次尝试的各个档位 $i \in \{0, 1, 2, 3\}$。档位 $i$ 以概率 $p_i$ 满足完成性谓词 $C(z) = 1$，其期望解析能耗为 $c_i > 0$。根据 Simon and Kadane (1975)，期望总开销

$$\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j < k} \bigl(1 - p_{\sigma(j)}\bigr)$$

取得最小值的充要条件是各档位按 $p_{\sigma(k)} / c_{\sigma(k)}$ 的非递增顺序运行。假设某个平稳分布状态 $\mathcal{D}_r$ 在接下来的 $\Delta T$ 次查询中持续存在，在此期间唤醒路径以 $p_{\text{wake}} = 1$ 和代价 $c_{\text{wake}}$ 完成任务。在累积 $N_{\text{wake}}$ 次经认证的唤醒后，支出一次性编译能量 $E_{\text{compile}}$，即可生成一张经认证命中率为 $p_0' \in (0, 1]$ 且查找代价满足 $c_0 \ll c_{\text{wake}}$ 的第 0 级 `LUT6` 页面。

**命题 1（向下结晶的净能量判据）。** *向下编译在剩余跨度 $\Delta T$ 内降低期望累积解析能耗的充要条件为*

$$\Delta T \cdot \bigl(p_0' c_{\text{wake}} - c_0\bigr) > E_{\text{compile}}, \qquad \text{and} \qquad \frac{p_0'}{c_0} > \frac{1}{c_{\text{wake}}}.$$

*证明。* 若不进行结晶，$\Delta T$ 次查询的总代价为 $\Delta T \cdot c_{\text{wake}}$。若付出代价 $E_{\text{compile}}$ 进行结晶，则当 $p_0'/c_0 > 1/c_{\text{wake}} \iff c_0 < p_0' c_{\text{wake}}$ 时，第 0 级排在唤醒路径之前，此时每次查询的期望代价为 $c_0 + (1 - p_0') c_{\text{wake}}$，每步节省 $p_0' c_{\text{wake}} - c_0 > 0$。对 $\Delta T$ 步求和即可得到净节省能量 $\Delta T(p_0' c_{\text{wake}} - c_0) - E_{\text{compile}} > 0$。在剧烈抖动场景下（$\Delta T \le \Delta T^*$），向下编译反而会净耗散更多能量，这直接导出了 `SleepCrystallizer` 中设置最小唤醒缓冲区 $N_{\text{wake}}$ 与留出集一致性门槛 $\tau_{\text{agree}} = 0.985$ 的设计动机。$\blacksquare$

<div id="22-result-2-non-blocking-512512-benešcopybeneš-multicast-routing" class="anchor-alias" aria-hidden="true"></div>

### 2.2 结果 2：无阻塞 $512 \times 512$ Beneš-Copy-Beneš 多播路由

一个由 $G = 80$ 个动态 `LUT6` 单元组成的第 0 级存储体，需要从宽度为 $N = 512$ 位的总线上以任意扇出选出 $M = 6G = 480$ 个输入引脚。双射 Beneš 置换网络无法复制高扇出连线，而扁平的 $512:1$ 多路复用交叉开关又会超出 KV260 的资源上限（仅在 `384` 端口规模下就已消耗 `119,478` 个 CLB LUT）。

**定理 2（基于 Beneš-Copy-Beneš 的无冲突多播路由）。** *对于 $N = 2^n$（$n=9, N=512$）且 $M \le N$（$M=480$），任意多对一多播映射 $\phi: \{0, \dots, M-1\} \to \{0, \dots, N-1\}$ 均可通过级联网络 $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ 在*

$$D(N) = 2(2\log_2 N - 1) + \log_2 N = 5\log_2 N - 2 = 43 \text{ stages}$$

*内无冲突地完成路由；每级包含 $N/2 = 256$ 个由 SRAM 配置的 $2 \times 2$ 交换单元（总计 $11,008$ 个配置位），路由配置可在 $O(N \log N)$ 时间内算出，且无需任何 FPGA 布局布线。*

*证明。* 设 $U = \{s_1, \dots, s_r\}$ 为互不相同的活跃输入集合，其各自扇出满足 $\sum_{j=1}^r m_j = M \le N$，并定义部分和 $S_0 = 0, S_j = \sum_{i=1}^j m_i$。集中网络 $\mathcal{B}_1$（共 $17$ 级）通过 Waksman 二分图二着色算法将输入映射至 $\pi_1(s_j) = S_{j-1}$（Beneš, 1965；Waksman, 1968）。复制网络 $\mathcal{C}$（共 $9$ 个蝶形级）依据 Thompson 单调复制构造（Thompson, 1978；Lee, 1988），在无链路冲突的前提下将每个 $S_{j-1}$ 复制到互不相交的单调区间 $[S_{j-1}, S_j - 1]$ 上。输出端 Beneš 网络 $\mathcal{B}_2$（共 $17$ 级）再将区间 $[S_{j-1}, S_j - 1]$ 双射置换到目标引脚集合 $\phi^{-1}(s_j)$ 上。$\blacksquare$

<div id="23-result-3-joint-mode-minterm-synthesis-vs-marginal-coordinate-argmax" class="anchor-alias" aria-hidden="true"></div>

### 2.3 结果 3：联合众数最小项综合与边缘坐标 argmax 对比

相互独立的位平面 DiffLogic 层通过逐坐标独立舍入 $\hat{y}_b(c) = \mathbb{I}[\Pr(Y_b = 1 \mid c) > 1/2]$ 来预测多比特突发输出 $\mathbf{Y} = (Y_1, \dots, Y_B)$，这种做法会将彼此关联的分支混成非法的**嵌合体（chimera）**词元。

**命题 3（联合众数最小项的占优性与零嵌合体性质）。** *对于离散上下文 $\psi(X) = c$ 以及 $B \le 64$ 位的突发输出空间 $\mathcal{Y}$，联合众数表 $T^*(c) = \arg\max_{\mathbf{y} \in \mathcal{Y}} \Pr(\mathbf{Y} = \mathbf{y} \mid c)$ 恒满足 $\Pr[\mathbf{Y} = T^*(\psi(X))] \ge \Pr[\mathbf{Y} = \hat{\mathbf{y}}^{\text{marg}}(\psi(X))]$，始终保持在支撑集 $\operatorname{supp}(\mathbf{Y} \mid c)$ 内部，并彻底消除边缘嵌合体（例如当概率质量 $0.40, 0.35, 0.25$ 分别落在 $(1,1,0), (1,0,1), (0,1,1)$ 上时，逐坐标边缘舍入会输出非法向量 $(1,1,1)$，精确匹配率为 `0%`，而 $T^*$ 的精确匹配率为 `40%`）。对于词表大小为 $|V|$、编码位宽为 $b_V = \lceil \log_2 |V| \rceil$ 的分词器，单个 `uint64` 字可打包 $K = \lfloor 64 / b_V \rfloor$ 个 BPE 词元（在 `LFM2.5-350M` 上为 `16b × 4 = 64b`；在 `Qwen3.5-0.8B-Base` 上为 `18b × 3 = 54b`）。* $\blacksquare$

<div id="24-result-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 2.4 结果 4：无神谕潜空间 `JEPA-EBRM` 拆分共形 + 在线 ACI 门槛

为防止在缺乏确定性 `RCE` 检查器时发生幻觉式自蒸馏，本参考实现对候选输入输出对采用径向正则化的潜空间能量函数进行评分：

$$E_\phi(x, y) = \frac{1}{2}\|f_\theta(x) - \mu_y\|_2^2 + \frac{\lambda_r}{2}\|f_\theta(x)\|_2^2 + \psi_\phi(f_\theta(x), y), \qquad \lambda_r > 0, \quad |\psi_\phi| \le C_\psi.$$

留出集上的拆分共形校准负责确定分位数阈值 $\hat{Q}_{1-\alpha}$，在线自适应共形推理（ACI）则按 $\alpha_{t+1} = \alpha_t + \gamma(\alpha - \text{err}_t)$ 动态更新误覆盖水平（Gibbs and Candès, 2021），仅当预测集基数满足 $|\mathcal{C}_t(x)| = |\{y : E_\phi(x,y) \le \hat{Q}_{1-\alpha_t}\}| = 1$ 时，才允许候选对 $(x, \hat{y})$ 进入 `SleepCrystallizer`（标记为 `Conformal-bounded`）。根据 Vovk et al. (2005) 与 Gibbs and Candès (2021)，可交换样本下的边缘覆盖率不低于 $1-\alpha$，长期分布偏移下的误覆盖率收敛至 $\alpha$，且任何超出半径 $R(\alpha_t) = \sqrt{2(\hat{Q}_{1-\alpha_t} + C_\psi)/\lambda_r}$ 的流形外射线均满足 $\mathcal{C}_t(x) = \emptyset$（触发 `Refuse` 拒绝或弃权）。

---

<div id="3-reference-architecture-polyglot-suite-and-kv260-rtl" class="anchor-alias" aria-hidden="true"></div>

## 3. 参考架构、多语言套件与 KV260 RTL

图 1 展示了四级级联和 `src/clai/` 中的向下 `SleepCrystallizer` 环路。

![图 1. Mixture of Limits 级联中的向下编译。](/figures/lut-adapt/mol-downward-cascade.svg)

*图 1. Mixture of Limits 级联中的向下编译。设计示意图，非板级功耗测量。[PNG](/figures/lut-adapt/mol-downward-cascade.png) · [交互式浏览器](/living/lut-adapt/#la-diag-01)。*

`openIE-dev/lut-adapt-ai` 中的五个系统实现对该级联进行了交叉验证：Python/PyTorch/Triton（`src/clai/`）、Rust `Burn 0.22.1 / CubeCL` Metal（`sys/rust/`）、Zig `0.17.1`（`sys/zig/`）、Go `1.27.4` SIMD（`sys/go/`）以及 Julia `1.13.4` Enzyme（`sys/julia/`）。

图 2 展示了 `hw/kv260/rtl/clai_benes_hotswap_core.sv` 中 Kria KV260（`xck26`）RTL 数据通路，将 `512` 个常驻 `LUT6` 页（`5,120` 个 `INIT` 位 + `48` 位上下文标签 + 有效位）映射到 `81` 个并行 `RAMB36E2` 双端口存储器上，以实现单周期（`4.0 ns` 在 `250 MHz` 标称频率下，`CPI = 1.0`）上下文切换。

![图 2. Beneš-Copy-Beneš 多播架构与单周期 BRAM LUT6 页缓存。](/figures/lut-adapt/benes-paged-silicon.svg)

*图 2. `512×512` Beneš-Copy-Beneš 多播架构与 `81 × RAMB36E2` 单周期 `LUT6` 页缓存，针对 AMD Kria KV260（`xck26`），使用 Yosys `0.71+` 和 Verilator `5.054` 仿真（`board_metered = false`）。[PNG](/figures/lut-adapt/benes-paged-silicon.png) · [交互式浏览器](/living/lut-adapt/#la-diag-02)。*

图 3 展示了 `AirMoL`（`src/clai/frontier/air_mol_streamer.py` 和 `hf_air_mol_pretrained.py`），它通过 Darwin `F_NOCACHE` `os.pread` 流式传输 4 位分组量化分片，在单次扫描中验证 `[last_tok, d_1..d_K]`，并将紧凑的混合状态（`Short-Conv/SSM` 或 `Gated DeltaNet` + 稀疏 `6` 层 `GQA` KV 裁剪）快照到 RAM 中，从而使部分草稿拒绝只需 **零额外 NVMe 扫描**。

![图 3. AirMoL 4 位 NVMe 层流式传输与通用 64 位 token LUT6 推测。](/figures/lut-adapt/airmol-nvme-speculation.svg)

*图 3. `AirMoL` 零额外扫描的 4 位 NVMe 层流式传输，在 `LiquidAI/LFM3-1.7B`、`LiquidAI/LFM2.5-350M` 和 `Qwen/Qwen3.5-0.8B-Base` 上使用通用 `≤64` 位 token `LUT6` 推测。[PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [交互式浏览器](/living/lut-adapt/#la-run-01)。*

图 4 展示了 `Expert-AirMoL` (`src/clai/frontier/moe_air_mol.py`) 和 `VerifiedCodeCascade` (`verified_code_cascade.py`)。

标准磁盘卸载的 `AirLLM` 在每个 MoE 层遍历全部 $E$ 个专家（在 `LiquidAI/LFM2.5-8B-A1B` 中为 `32`，在 `Qwen/Qwen3.6-35B-A3B` 中为 `256`），即使路由器每个 token 只激活 $k \ll E$ 个专家（分别为 `4/32` 和 `8/256`）。  
`Expert-AirMoL` 将每个 MoE 层划分为紧凑的头部碎片和固定步幅的 `INT4` `.experts.pack4` NVMe 文件，仅对活跃专家集合 $\mathcal{U}_l$ 在 $K+1$ 的突发位置发出 `F_NOCACHE` `os.pread` 读取。  
针对新颖的合成任务，`VerifiedCodeCascade` 在 `0.35s` 限时的 AST、沙箱执行以及边界不变检查 $C(z) \in \{0, 1\}$ 之下，对跨 Rungs `0-3c` 的每一次提交进行门控，并将经过认证的解编译为 `BenesLUT6` 与规范的 AST 技能页。

![图 4. `Expert-AirMoL` 路由稀疏 4 位专家索引 NVMe 流式传输（在 `Qwen/Qwen3.6-35B-A3B` 上实现 `12.30×` I/O 降低）以及 `C(z)` 门控的 `VerifiedCodeCascade`.](/figures/lut-adapt/moe-expert-cascade.svg)

*图 4. `Expert-AirMoL` 路由稀疏 4 位专家索引 NVMe 流式传输（在 `Qwen/Qwen3.6-35B-A3B` 上实现 `12.30×` I/O 降低）和 `C(z)` 门控的 `VerifiedCodeCascade`。* [PNG](/figures/lut-adapt/moe-expert-cascade.png) · [交互式浏览器](/living/lut-adapt/#la-run-01)

---

<div id="4-claims-and-results" class="anchor-alias" aria-hidden="true"></div>

## 4. 主张与实验结果

<div id="41-claim-la-1-analytical-est_jvc-reduction-on-synthetic-tasks-and-real-pcap-traffic" class="anchor-alias" aria-hidden="true"></div>

### 4.1 主张 LA-1：合成任务与真实 `.pcap` 流量上的解析 `est_j/VC` 降低

| 工作负载与窗口 | 第 0 级占比 | 通过率 | 解析 `est_j / VC` | Verilator 一致性 | 证据类别 |
| :--- | :---: | :---: | :---: | :---: | :--- |
| 合成任务轮次 `1-512`（冷启动唤醒） | `0.00%` | `0.0% → 52.0%` | `2,323.18 est_j` | - | SW + `est_j` |
| 合成任务轮次 `3,073-3,584`（已结晶） | `52.73%` | `60.55%` | `2.59 est_j` (`895×`) | `100.0%` | Verilator + `est_j` |
| `.pcap` 数据包 `1-512`（冷启动 IPv4） | `0.00%` | `73.05%` | `3.3351 est_j` | `100.0%` | Verilator + `est_j` |
| `.pcap` 数据包 `1,537-2,048`（已结晶） | `100.00%` | `100.00%` | `0.000140 est_j` | `100.0%` | Verilator + `est_j` |
| `.pcap` 数据包 `2,049-2,560`（VLAN `0x8100` 偏移） | `2.73%` | `68.55%` | `3.0485 est_j` | `100.0%` | 断路器 + `est_j` |
| **`.pcap` 数据包 `2,561-3,072`（重结晶完成）** | **`100.00%`** | **`100.00%`** | **`0.000131 est_j` (`25,458×`)** | **`100.0%` (`5,120/5,120`)** | **Verilator + `est_j`** |

<div id="42-claim-la-2-five-language-polyglot-parity-and-zero-allocation-dataplanes" class="anchor-alias" aria-hidden="true"></div>

### 4.2 主张 LA-2：五种编程语言一致性与零内存分配数据平面

| 实现版本 | 目标平台 / 后端 | 关键结果 | 证据类别 |
| :--- | :--- | :--- | :--- |
| **Rust (`sys/rust/`)** | `Burn 0.22.1` + `CubeCL` Metal GPU | `2,331.42 → 0.19 est_j/VC`，第 0 级占比 `95.31%`，生成 KV260 `.v` 网表 | 实测 SW + `est_j` |
| **Zig `0.17.1` (`sys/zig/`)** | `@Vector(8, f32)` SIMD + `@popCount` | 热循环堆分配为 `0` 字节；`87 ns/pkt`（`11.49M pkts/s`） | 实测 SW（M5 Max） |
| **Go `1.27.4` (`sys/go/`)** | 工作协程池 + `OnesCount64` | `0 B/op`，`0 allocs/op`；`31.86 ns/op`（`31.39M evals/s`） | 实测（`go test`） |
| **Julia `1.13.4` (`sys/julia/`)** | `Enzyme.jl` 反向模式自动微分（AD） | 相对于中心有限差分（FD）的最大梯度偏差：`6.11 × 10⁻¹⁰` | 实测数值检验 |

<div id="43-claim-la-3-kv260-xck26-benešcopybeneš-and-ramb36e2-paged-synthesis" class="anchor-alias" aria-hidden="true"></div>

### 4.3 主张 LA-3：KV260（`xck26`）Beneš-Copy-Beneš 与 `RAMB36E2` 分页综合

| RTL 架构 | 页面数 | 切换延迟 | `xcup` CLB LUT 数（占 `xck26` 百分比） | `RAMB36E2` | `DSP48` | 漂移后准确率 | 证据类别 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `2A` 扁平 `512:1` 交叉开关（`64` 个 LUT6） | `1` | `82 cyc` | `119,478`（**`102.0%` 溢出**） | `0` | `0` | `98.44%` | 仿真（Yosys） |
| `2B` 紧凑型交叉开关（`32` 个 LUT6） | `1` | `82 cyc` | `59,739`（`51.0%`） | `0` | `0` | `95.94%` | 仿真（Yosys） |
| `2C` 固定连线 DiffLogic / WNN | `1` | 需重新运行 Vivado PAR | `160`（`0.14%`） | `0` | `0` | **`52.34%`** | 仿真（Yosys） |
| `2D` 单页 Beneš-Copy-Beneš | `1` | `82 cyc` | `40,155`（`34.3%`） | `0` | `0` | `98.44%` | 仿真（Yosys + Verilator） |
| `P2` 分布式触发器 + `512:1` 多路复用器 | `512` | `1 cyc` | `926,619`（**`791.2%` 溢出**） | `0` | `0` | `98.44%` | 仿真 |
| **`P3` Beneš + `81` `RAMB36E2`（参考架构）** | **`512`** | **`1 cyc` (`4.0 ns`)** | **`41,186` (`35.2%`)** | **`81` (`56.2%`)** | **`0`** | **`98.44%`** | **仿真（Yosys + Verilator）** |

<div id="44-claim-la-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.4 主张 LA-4：无神谕潜空间 `JEPA-EBRM` 拆分共形 + 在线 ACI 门槛

| 结晶门槛方案 | 前向次数 | 误结晶风险 | OOD AUROC | 安全分布内覆盖率 | 净 `LUT6` 准确率 | 是否捕获偏移？ | 证据类别 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `3A` Softmax MSP ($\max p \ge 0.95$) | `1` | `17.62%` | `0.8552` | `90.93%` | `99.22%` | `False` | 实测 SW |
| `3B` 温度缩放间隔（Temp-Scaled Margin） | `1` | `17.66%` | `0.8422` | `91.12%` | `98.83%` | `False` | 实测 SW |
| `3C` Helmholtz 对数几率能量 | `1` | `24.28%` | `0.8045` | `97.17%` | `99.80%` | `False` | 实测 SW |
| `3D` MC-Dropout（`5` 次前向） | `5` | `18.24%` | `0.8494` | `91.03%` | `99.61%` | `False` | 实测 SW |
| **`3E` 潜空间 `JEPA-EBRM` + 共形 ACI** | **`1`** | **`0.00%`** | **`1.0000`** | **`95.66%`** | **`99.02%`** | **`True`** | **实测 SW** |

<div id="45-claim-la-5-lossless-byte-level-speculative-decoding-on-520-kb-polyglot-source-code" class="anchor-alias" aria-hidden="true"></div>

### 4.5 主张 LA-5：`520 KB` 多语言源代码上的无损字节级投机解码

| 架构方案 | 精确一致性 | 每轮字节数 | 总轮数（`64 B`） | 草稿 FLOPs | MFLOPs / 字节 | `est_mJ / Byte` | 证据类别 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` 因果 Transformer（`RoPE+SwiGLU`） | `100.0%` | `1.00` | `64.00` | `0` | `7.209` | `58.94` | 实测 SW + `est_j` |
| `B` `Mamba-3` 复数 MIMO（`T=1`） | `100.0%` | `1.00` | `64.00` | `0` | `2.257` | `20.84` | 实测 SW + `est_j` |
| `C` `PLD` 提示词内查找 | `100.0%` | `2.13` | `29.98` | `0` | `1.322` | `11.52` | 实测 SW + `est_j` |
| `D` `REST` 语料库后缀字典树 | `100.0%` | `3.84` | `16.65` | `0` | `0.734` | `6.40` | 实测 SW + `est_j` |
| `E` `Medusa` 并行 MLP 预测头 | `100.0%` | `2.62` | `24.44` | `428,288` | `1.241` | `9.46` | 实测 SW + `est_j` |
| `F` `EAGLE-2` 神经草稿树 | `100.0%` | `2.75` | `23.29` | `1,122,560` | `1.435` | `9.07` | 实测 SW + `est_j` |
| **`G` `MoL` 分页 Beneš `LUT6`（参考架构）** | **`100.0%`** | **`3.84`** | **`16.69`** | **`0`** | **`0.736`** | **`6.41`** | **实测 SW + `est_j`** |

<div id="46-claim-la-6-controlled-airmol-4-bit-nvme-streaming-143m-matched-pair" class="anchor-alias" aria-hidden="true"></div>

### 4.6 主张 LA-6：受控 `AirMoL` 4 位 NVMe 流式传输（`14.3M` 配对对照）

| 卸载式流式传输架构 | 一致性 | 每次扫描字节数 | 扫描次数 | NVMe 读取量 | NVMe 写入量 | 峰值 RAM | `ms / Byte` | 证据类别 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `AirLLM` Transformer FP16 + KV 溢出落盘 | `100%` | `1.00` | `64.00` | `2,130.0 MB` | `407.6 MB` | `8.81 MB` | `60.64` | 实测（`F_NOCACHE`） |
| `2` `AirLLM` Transformer 4 位 + KV 溢出落盘 | `100%` | `1.00` | `64.00` | `887.6 MB` | `407.6 MB` | `8.81 MB` | `64.87` | 实测（`F_NOCACHE`） |
| `3` `AirMamba-3` 4 位 + 换页式 `EAGLE-2` | `100%` | `2.86` | `22.38` | `175.3 MB` | `0.0 MB` | `7.20 MB` | `19.20` | 实测（`F_NOCACHE`） |
| `4` `AirMamba-3` 4 位 + 锁定 $O(1)$ 状态（`T=1`） | `100%` | `1.00` | `64.00` | `488.3 MB` | `0.0 MB` | `7.20 MB` | `37.72` | 实测（`F_NOCACHE`） |
| **`5` `AirMoL` 4 位 + 冷启动 `LUT6`（参考架构）** | **`100%`** | **`3.74`** | **`17.12`** | **`130.7 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.18`** | **实测（`F_NOCACHE`）** |
| **`6` `AirMoL` 4 位 + 唤醒后结晶（参考架构）** | **`100%`** | **`4.27`** | **`15.00`** | **`114.4 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.09`** | **实测（`F_NOCACHE`）** |

<div id="47-claim-la-7-pretrained-2026-dense--tri-hybrid-models-under-airmol-lfm3-17b-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 声明 LA-7：预训练 2026 稠密与三混合模型在 `AirMoL` (`LFM3-1.7B`, `LFM2.5-350M`, 与 `Qwen3.5-0.8B-Base`) 下

| 2026 检查点 & 臂 | 等价性 | 令牌 / 扫描 | 字符 / 扫描 | 扫描次数 | NVMe 读取 | 峰值活动内存 (`% FP32`) | `tok/s` | 证据类别 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM3-1.7B` (Oct 2026) · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.30` | `24.00` | `25.045 GB` | `250.0 MB` (`3.79%`) | `0.53` | Measured (`F_NOCACHE`) |
| `LFM3-1.7B` (Oct 2026) · `AirLLM` 4-Bit + `PLD` | `100%` | `1.37` | `3.16` | `17.50` | `18.262 GB` | `250.0 MB` (`3.79%`) | `0.73` | Measured (`F_NOCACHE`) |
| **`LFM3-1.7B` (Oct 2026) · `AirMoL` 冷 `LUT6`** | **`100%`** | **`1.55`** | **`3.56`** | **`15.50`** | **`16.175 GB`** | **`250.0 MB` (`3.79%`)** | **`0.81`** | **Measured (`F_NOCACHE`)** |
| **`LFM3-1.7B` (Oct 2026) · `AirMoL` 后唤醒** | **`100%`** | **`2.74`** | **`6.31`** | **`8.75`** | **`9.131 GB`** | **`250.0 MB` (`3.79%`)** | **`1.32`** | **Measured (`F_NOCACHE`)** |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | Measured (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | Measured (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | Measured (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` 冷 `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **Measured (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` 后唤醒** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **Measured (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | Measured (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4-Bit + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | Measured (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` 冷 `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **Measured (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` 后唤醒** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **Measured (`F_NOCACHE`)** |

2026 年 10 月 `LiquidAI/LFM3-1.7B`（`13` 个短卷积 + `5` 个滑动窗口注意力层 + `6` 个全注意力层，`|V| = 128,000`），唤醒后 `AirMoL` 将 NVMe 传输量减少 `2.74×`（`25.045 GB` 至 `9.131 GB`），并将解码速度提升 `2.49×`（`0.53` 至 `1.32 tok/s`），在 `250.0 MB` 活跃权重 RAM（FP32 的 `3.79%`）下实现 `100.0%` 无损等价性。注意在 CPU 受限的 `Qwen3.5-0.8B-Base` 冷未见提示上的保留权衡：`AirMoL` 减少了 NVMe 磁盘读取（`12.674 GB` 至 `8.581 GB`），但 CPU 门控 DeltaNet 对 `4` 个 token 的批验证降低了壁钟吞吐量（`0.32` 对 `0.53 tok/s`），直到在线唤醒至 `LUT6` 结晶将接受率提高至 `2.74 tok/sweep`（`1.11 tok/s`）。

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 声明 LA-8：实时 CLI 与 HTTP/SSE 流式服务器（`mol_code_cli.py`）

`scripts/mol_code_cli.py` 通过 CLI 和 SSE 端点（`/v1/health`、`/v1/complete`、`/v1/crystallize`）提供 `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` 与 `--air-nvme` 服务，并在实时运行中将 RAMB36E2 槽位驻留从 `438/512` 推进至 `460/512`，`tests/` 中 `22/22` 项测试通过。

<div id="49-claim-la-9-frontier-sparse-moe-expert-airmol-liquidailfm25-8b-a1b-847b--qwenqwen36-35b-a3b-3466b" class="anchor-alias" aria-hidden="true"></div>

### 4.9 主张 LA-9：前沿稀疏 MoE `Expert-AirMoL` (`LiquidAI/LFM2.5-8B-A1B` `8.47B` 与 `Qwen/Qwen3.6-35B-A3B` `34.66B`)

| 稀疏 MoE 检查点 & 臂 | 等价性 | 活跃专家 | 标记 / 扫描 | NVMe 读取 / 标记 | I/O 降低 | 峰值 RAM (`% FP16`) | `tok/s` | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `AirLLM` 密集 4 位 (`T=1`) | `100%` | `100.00%` | `1.00` | `4.574 GB` | `1.00×` | `1,408.3 MB` (`8.72%`) | `0.28` | `368.80` |
| `LFM2.5-8B-A1B` · `Expert-AirLLM` (`T=1`) | `100%` | `16.93%` | `1.00` | `1.200 GB` | `3.81×` | `1,408.3 MB` (`8.72%`) | `0.58` | `181.26` |
| `LFM2.5-8B-A1B` · `Expert-AirMoL` + `PLD` | `100%` | `28.82%` | `1.78` | `0.883 GB` | `5.18×` | `1,408.3 MB` (`8.72%`) | `0.79` | `132.57` |
| **`LFM2.5-8B-A1B`·`Expert-AirMoL` 冷 `LUT6`** | **`100%`** | **`33.91%`** | **`1.85`** | **`1.002 GB`** | **`4.56×`** | **`1,408.3 MB` (`8.72%`)** | **`0.72`** | **`145.42`** |
| **`LFM2.5-8B-A1B`·`Expert-AirMoL` 后唤醒** | **`100%`** | **`36.46%`** | **`3.00`** | **`0.663 GB`** | **`6.90×`** | **`1,408.3 MB` (`8.72%`)** | **`1.10`** | **`95.67`** |
| `Qwen3.6-35B-A3B` · `AirLLM` 密集 4 位 (`T=1`) | `100%` | `100.00%` | `1.00` | `18.159 GB` | `1.00×` | `3,214.7 MB` (`4.86%`) | `0.06` | `1,696.81` |
| `Qwen3.6-35B-A3B` · `Expert-AirLLM` (`T=1`) | `100%` | `6.35%` | `1.00` | `2.356 GB` | `7.71×` | `2,530.7 MB` (`3.83%`) | `0.22` | `471.87` |
| `Qwen3.6-35B-A3B` · `Expert-AirMoL` + `PLD` | `100%` | `11.58%` | `1.89` | `1.708 GB` | `10.63×` | `2,530.7 MB` (`3.83%`) | `0.32` | `326.24` |
| **`Qwen3.6-35B-A3B`·`Expert-AirMoL` 冷 `LUT6`** | **`100%`** | **`12.91%`** | **`2.00`** | **`1.722 GB`** | **`10.54×`** | **`2,530.7 MB` (`3.83%`)** | **`0.31`** | **`334.42`** |
| **`Qwen3.6-35B-A3B`·`Expert-AirMoL` 后唤醒** | **`100%`** | **`14.97%`** | **`2.57`** | **`1.477 GB`** | **`12.30×`** | **`2,530.7 MB` (`3.83%`)** | **`0.39`** | **`267.08`** |

在 `Qwen/Qwen3.6-35B-A3B`（`34.66B` 参数，`66.11 GB` FP16 分片至 `18.60 GB` 4 位 `.experts.pack4` 文件；全系统 macOS `PMU` 增量 `20,070.18 J`），后唤醒 `Expert-AirMoL` 将未缓存的 NVMe 传输降低 **`12.30×`**（从 `18.159` 降至 `1.477 GB/tok`），并在 **`2,530.7 MB`** 活跃 RAM（FP16 的 `3.83%`）下将解码速度提升 **`6.50×`**（从 `0.06` 到 `0.39 tok/s`），保持 `100.0%` 无损标记等价性。

<div id="410-claim-la-10-sub-1-bit-latent-factorization-littlebit-1--littlebit-2-vs-zero-mac-sub1bit-lut6" class="anchor-alias" aria-hidden="true"></div>

### 4.10 声明 LA-10：亚 1 比特潜在因子分解（`LittleBit-1 / LittleBit-2`）与零 MAC `Sub1Bit-LUT6`

| 因子分解方法（`LFM2.5-8B-A1B` `w1 [1792, 2048]`） | 比特 / 权重 | 权重 SNR | 余弦相似度 | `16K` Top-1 匹配度 | 二元 MAC / Tok | QAT 轮数 | 证据类别 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` 未旋转 `SVD` SVID（`LittleBit-1` PTQ 风格） | `0.576`（`27.8×`） | `1.76 dB` | `0.5761` | `3.12%` | `1,981,440` | `0`（论文中为 `5`） | 实测 SW |
| `B` Procrustes `ITQ` SVID（`LittleBit-2` PTQ 风格） | `0.576`（`27.8×`） | `2.42 dB` | `0.6487` | `10.94%` | `1,981,440` | `0`（论文中为 `5`） | 实测 SW |
| **`C` `Sub1Bit-LUT6` 查表（`0` MAC，草稿）** | **`0.576`（`27.8×`）** | **`2.42 dB`** | **`0.6487`** | **`10.94%`** | **`0`** | **`0`** | **实测（与 `B` 相比 `< 4e-6`）** |
| `D` `Expert-AirMoL` `INT4` Block-64 目标 | `4.500`（`3.56×`） | `20.77 dB` | `0.9958` | `82.81%` | `0`（`INT4`） | `0` | 实测 SW |
| **`E` `MoL`：`Sub1Bit-LUT6` 草稿 + 目标验证** | **`0.576` 草稿** | **`148.84 dB`** | **`1.0000`** | **`100.00%`** | **`0` 草稿 MAC** | **`0`** | **实测无损奇偶性** |

<div id="411-claim-la-11-48-task-16-specifications--3-waves-late-2026-frontier-coding-bakeoff" class="anchor-alias" aria-hidden="true"></div>

### 4.11 主张 LA-11：`48` 项任务（`16` 个规约 × `3` 个波次）的 `2026` 年末前沿编码对比测试

| 2026 年末系统组（`48` 项任务 = `16` 个规约 × `3` 个波次） | W1 冷启动 | W2 适应 | W3 热启动 | 总体通过率 | 破损提交率 | W3 `Rung 0/1` 占比 | `35B` 调用率 | W3 平均延迟 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT（`1`-Shot） | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `19,946 ms` |
| `B` `LiquidAI/LFM3-1.7B`（2026年10月 三混合架构，`1`-Shot） | `18.75%` | `6.25%` | `6.25%` | `10.42%` | `89.58%` | `0.00%` | `0.0%` | `3,561 ms` |
| `C` `google/gemma-4-E2B-it`（`2026` 混合架构，`1`-Shot） | `6.25%` | `0.00%` | `0.00%` | `2.08%` | `97.92%` | `0.00%` | `0.0%` | `8,886 ms` |
| `D` `LiquidAI/LFM2.5-8B-A1B`（`8.47B` MoE，`1`-Shot） | `18.75%` | `12.50%` | `12.50%` | `14.58%` | `85.42%` | `0.00%` | `0.0%` | `14,221 ms` |
| `E` `Qwen/Qwen3.6-35B-A3B`（`34.66B` `Expert-AirMoL`，`1`-Shot） | `37.50%` | `31.25%` | `31.25%` | `33.33%` | `66.67%` | `0.00%` | `100.0%` | `98,435 ms` |
| `F` `RouteLLM` 置信度路由器（`LFM3` $\to$ `Gemma4` $\to$ `8B`） | `18.75%` | `6.25%` | `6.25%` | `10.42%` | `89.58%` | `0.00%` | `0.0%` | `3,561 ms` |
| **`G` `MoL` `VerifiedCodeCascade`（参考基线）** | **`43.75%`** | **`43.75%`** | **`43.75%`** | **`43.75%`** | **`0.00%`** | **`43.75%`** | **`62.5%`** | **`143,649 ms`（已解决部分为 `2.54 ms`）** |

在 `48` 项任务的协议与算法基准测试中（涵盖 RFC 1982 序列号算术、加权区间扫描线、循环安全的字典序拓扑排序、纳秒级令牌桶、CRC-8/ATM 与变异 `0xFF` CRC-8、RFC 6901 JSON Pointer `~01` 反转义、跳数受限的 Bellman-Ford、`>2⁵³` 精确窗口中位数、无限制 Damerau-Levenshtein 距离、`4×4` Beneš 路由、SQL 字面量参数化、基于单调队列的子序列和、DWARF SLEB128、SHA-256 一致性哈希以及共形分位数；全系统 macOS `PMU` 能耗增量为 `126,947.30 J`）中，`VerifiedCodeCascade` 在每个波次上都超过了所有独立模型与路由器（`43.75%` 对比 `33.33%`，后者为 `35B`），破损提交率为 **`0.00%`**（对比 `66.67%-100.00%`），并且通过 $C(z)$ 安全拦截了全部 `3` 次 W2/W3 对抗性规约漂移查询。同时，在 `7` 项已固化技能上，W3 平均延迟由 **`90,324.2 ms`** 降至 **`2.54 ms`**（加速 `35,590×`）。

<div id="412-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.12 `xck26-sfvc784-2LV-c` 完整子系统原语拆分、拓扑深度以及 `Vivado 2026.1` 硬件探针

为了审计独立的 `512` 页投机核心（`clai_benes_paged_hotswap_core` 位于 `hw/kv260/rtl/clai_benes_hotswap_core.sv`）以及完整的高级微控制器总线架构（`AMBA`）`AXI4-Lite` + `AXI4-Stream` Rung-0 子系统（`clai_kv260_axi_top` 位于 `hw/kv260/rtl/clai_kv260_axi_top.sv`、`clai_engram_streamer.sv`、`clai_rung0_hotswap_core.sv`，以及 `artifacts/clai_rung0_kv260.v`，提交为 `a5e9bc1de280`），相对于精确的 AMD Kria KV260 器件（`xck26-sfvc784-2LV-c`：`117,120` CLB LUT、`234,240` CLB 触发器、`144` `RAMB36E2` 块、`64` 288-Kbit UltraRAM（`URAM288`）块、`1,248` UltraScale+ 数字信号处理（`DSP48E2`）切片，以及 `189` 用户输入/输出块（`IOB`s）），我们在一台 `Intel Core i9-13900H`（`Linux 7.0.0-43-generic x86-64`）工作站上执行了三项硬件和电子设计自动化（`EDA`）检查：

1. **只读联合测试行动组 (`JTAG`) 与通用串行总线 (`USB`) 探针 (`Xilinx hw_server v2026.1` + Xilinx 软件命令行工具 (`XSDB`))**：虽然 `lsusb` 报告了已连接的 Future Technology Devices International (`FTDI`) `0403:6010` (`FT2232C/D/H` 双通用异步收发器 (`UART`) / 先入先出 (`FIFO`) 集成电路 (`IC`)) 桥接器，但检查 Linux `sysfs` USB 供应商/产品字符串 (`idVendor = 0403`, `idProduct = 6010`) 后，确定该设备为 `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"` 而非 Kria KV260 载板。通过 `xsdb` (`connect; jtag targets; targets`) 查询 `hw_server v2026.1` (Build May 29, 2026) 返回了 **0 个 Xilinx `JTAG` 设备和 0 个调试访问端口 (`DAP`) 目标** (`board_metered = false`, `measured_j = None`)。
2. **`Vivado 2026.1` 批处理综合与许可门控 (`SW Build 6511674`)**：一个可复现的低占用非工程批处理脚本 (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, 针对 `xck26-sfvc784-2LV-c` 在 250.0 MHz / 4.000 ns 的上下文外 (`OOC`) 模式) 已针对 `/tools/Xilinx/2026.1/Vivado/bin/vivado` 进行准备。以批处理模式启动 `vivado v2026.1` 在 `synth_design` 之前退出 (`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`)，因为 AMD `Vivado 2025.1+` / `2026.1` 即使对于标准层 `xck26` 器件也需要显式用户生成的 Standard/Enterprise `.lic` 文件 (`~/.Xilinx/Xilinx.lic` 或 `XILINXD_LICENSE_FILE`)，而工作站上未安装任何 `.lic` 文件。根据严格测量规则，后布线 `WNS`、布局布线后最高时钟频率以及矢量无关 `report_power` (`est_j`) 在提供 Standard `.lic` 文件之前仍记录为 `not_available`。
3. **全子系统 UltraScale+ `xcup` 原语分解、`IOB` 预算与拓扑逻辑级审计 (`Yosys 0.71+`)**：通过 `synth_xilinx -family xcup` 和 `ltp -noff` 综合 `clai_benes_paged_hotswap_core` 和 `clai_kv260_axi_top` (同时严格将主机 `RAPL package-0` `reported_j` 记录为 `x86-64` `EDA` 编译成本 $E_{\text{compile}}$，而非 FPGA 硅功耗) 确立了精确单元计数和关键路径组合深度：

| `xck26-sfvc784-2LV-c` 目标模块 | CLB LUT（`% xck26`） | 主要 LUT 原语 | CLB 寄存器（`FDRE`/`FDSE`） | `RAMB36E2`（`%`） | `DSP48E2` | 顶层端口（`IBUF`+`OBUF`） | 组合深度（`ltp`） | 主机综合 `RAPL`（`reported_j`） |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`**（`512` 页） | **`41,185`**（`35.17%`） | `19,982 LUT3`、`7,804 LUT6`、`7,714 LUT5`、`36 MUXF7`、`18 MUXF8` | **`36,464`**（`15.57%`） | **`81`**（`56.25%`） | **`0`** | `1,599`（`OOC` / 内部总线） | **`81` 级** | `7,297.3 J`（`144.8 s`） |
| **`clai_kv260_axi_top`**（`AXI4` Rung-0 子系统） | **`67,366`**（`57.52%`） | `25,557 LUT6`、`25,333 LUT5`、`7,918 LUT3`、`569 CARRY4` | **`16,619`**（`7.09%`） | **`4`**（`2.78%`） | **`0`** | `126`（`<= 189` 个 `IOB`；`PS-PL`） | **`73` 级** | `10,089.4 J`（`214.8 s`） |

由 `xcup` 原语与 `ltp` 审计可归纳出两项具体的物理设计约束：

- **引脚预算约束（`OOC` 与 `PS-PL` `AXI` 封装）**：由于 `clai_benes_paged_hotswap_core` 直接暴露原始的 `512` 位 `CodeBitBus` 以及宽位移影子配置向量（`1,379` 个输入缓冲器（`IBUF`）+ `220` 个输出缓冲器（`OBUF`）= `1,599` 个端口，而 `xck26-sfvc784-2LV-c` 封装仅有 `189` 个 `IOB`），独立的厂商实现必须使用 `synth_design -mode out_of_context` 运行，或置于 `AXI4-Stream` / `zynq_ultra_ps_e` 封装之内，例如 `clai_kv260_axi_top`（`126` 个端口，`57.52%` LUT 利用率）。
- **未流水化的组合深度（`81` 与 `73` 级）与 `250 MHz`（`4.000 ns`）`-2LV` 时序收敛**：虽然 Verilator `5.054` 验证了周期精确的 `CPI = 1.0`（每个时钟周期 `1` 次查找），但若在单个组合周期内穿越 `17` 个 `Beneš-1` 级、`9` 个前缀复制级、`17` 个 `Beneš-2` 级、动态 `LUT6` 真值表多路复用以及 `5` 路投票多数归约，则跨越 **`81` 个原语级**（在 `clai_kv260_axi_top` 的组合式 `64` 输入 popcount 与 `8` 类裕量比较器中为 `73` 级）。要在低电压（`0.72 V`）`-2LV` 硅片上于布局布线后收敛 `250 MHz`（`4.000 ns`），因此宜在 $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ 之间插入 `2` 至 `3` 个流水寄存器级，并在 `64` 线 popcount 树与 top-`2` 比较器之间插入 `1` 个寄存器级，在 `3`-`4` 个周期的流水线延迟下保持 `CPI = 1.0` 的吞吐量（每时钟 `1` 个上下文）。

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. 相关工作与收敛观察

| 系统 | 编号 / 发表场所 | 确立的内容 | 报告成本 | 本参考的差异 |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets**（Umuroglu 等，2020） | `arXiv:2004.03021` · FPL 2020 | 编译为 FPGA LUT 的稀疏量化神经层。 | FPGA LUT 与 Fmax 综合结果。 | 静态连线在移位时需要 Vivado 重新布局布线，而本文方案为 `1` 周期 Beneš 加 `RAMB36E2`。 |
| **DiffLogic**（Petersen 等，2022）与 **DWN**（Bacellar 等，2024） | `arXiv:2210.08277` · `arXiv:2410.11112` | 可微布尔门与无权重 LUT 网络。 | 门数与精度。 | 静态路由在 VLAN 移位时降至 `52.34%`，并出现边际位平面嵌合伪影。 |
| **T-MAC**（Wei 等，2024）与 **TeLLMe**（Qiao 等，2025） | `arXiv:2407.00088` · `arXiv:2504.16266` | 基于 CPU/FPGA 查表实现的三值与低比特矩阵乘积。 | 延迟与 FPGA 功耗。 | 加速模型"档位"内的线性代数运算，但不绕过模型调用。 |
| **LittleBit**（Lee 等，2025）与 **LittleBit-2**（Lee 和 Kim，2026） | `arXiv:2506.13771` · `arXiv:2603.00042` | 通过 `SVD` / `ITQ` 与 `5` 轮 QAT 实现的亚 1 比特（`0.1-0.58` bits/weight）二值潜在分解。 | 压缩比（`11.6×-31×`）、PPL 与 QAT 精度。 | 将位包解包为稠密运行时二值 MAC，并在精确编码上降至 `0.00%`（`Claim LA-11`）；`Sub1Bit-LUT6` 使用 `0` 次二值 MAC，且 `MoL` 在 `0` 轮 QAT 中恢复 `100.0%` 的对等精度。 |
| **FrugalGPT**（Chen 等，2023）与 **RouteLLM**（Ong 等，2024） | `arXiv:2305.05176` · `arXiv:2406.18665` | 弱到强的 LLM 级联与偏好路由器。 | API 美元价格与质量对比。 | 缺少确定性 $C(z)$ 门（`Claim LA-11` 中 `89.58%` 的失效提交），也没有 `LUT6` 向下编译器。 |
| **GreenServ**（2026）与 **VoltanaLLM**（2025） | `arXiv:2601.17551` · `arXiv:2509.04827` | 多 LLM 赌博机路由与频率缩放服务。 | 作者报告的 GPU Wh（`Zeus` / `pyNVML`）。 | 优化 GPU 服务；本参考将唤醒编译为 `0`-FLOP `LUT6` 页面（`est_j`）。 |
| **Medusa**（2024）、**EAGLE-2**（2024）、**HCSpec**（2026） | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | 神经 MLP、草稿树与级联推测草稿器。 | 墙钟加速比。 | 需要草稿 FLOP 与权重读取，对比 `0`-FLOP `uint64` `LUT6` 页面。 |
| **PLD**（Saxena，2023）与 **REST**（He 等，2024） | GitHub · `arXiv:2311.08252` | 零 FLOP 的提示 n-gram 与数据存储后缀树草稿器。 | 延迟加速（`0` FLOPs）。 | `PLD` 无法覆盖提示之外的词元；`REST` 使用可变树结构，对比 `RAMB36E2` 页面。 |
| **AirLLM**（lyogavin，2023） | 开源 SSD 流式传输器 | 在小内存中基于 SSD 的逐层权重流式传输。 | 活动内存占用。 | 纯 `T=1`（`1.0 tok/sweep`）加 KV 溢出，对比 `AirMoL` 的 `2.74×-2.86×` 扫描次数缩减。 |
| **Metered Commit Gates** 与 **RCE-JEPA** `[同一团队]` | `/papers/gates/` · `/papers/rce-jepa/` | 提交门（KV260 `INA260` SOM 读数 `11,428 pJ`）、MoL $p_i/c_i$ 与 `RCE-JEPA`。 | KV260 SOM `measured_j` 与 `est_j`。 | 同团队的基础工作；本文在此扩展了 Beneš `LUT6` 向下编译与 `AirMoL`。 |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. 局限性、有效性威胁、未主张事项与证伪条件

**内部效度与构念效度。** 在均匀随机噪声或逐步对抗性扰动（$\Delta T = 1$）下，命题 1 给出的向下编译节省为零，并退化为 `1.00 tok/sweep`。无损一致性（`100.0%`）保证了与贪心目标解码逐位一致，但并不能提升 `350M` 或 `0.8B` 基础检查点的能力上限。

**测量效度与未主张事项。** 逐任务焦耳数值（`est_j/VC`、`est_j/tok`、`est_mJ/Byte`）均为解析性 `est_j` 估计值（`measured_j = None`）；macOS `PMU` 累积增量包含整机显示、SSD 与操作系统后台负载，而非孤立的芯片供电轨功率。Yosys `0.71+` 与 Verilator `5.054` 仅能证明面向 `xck26` 的结构化网表综合与 `CPI = 1` 周期级仿真，不能证明 Vivado 布局布线后 `250 MHz` 时序收敛，也不能给出 KV260 实际供电轨功率（`board_metered = false`）。以下内容均不作主张：硅级能效领先；将 `ModelGenerated` 输出提升为 `Deterministic`；超出 `48` 项合同基准之外的全仓库规模 `SWE-bench` 评测；以及 `70B` 的实测运行（`air_mol_nvme_baselines.csv` 中的 `70B` 数据为解析投影，超出了实测 `34.66B` `Qwen3.6-35B-A3B` 运行的范围）。

| ID | 声明 | 精确证伪 / 证伪条件 |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` 无法在 `5,120` 个数据包上达到 `100.0%` Verilator 一致性，或错过数据包-`2,500` VLAN 偏移。 |
| **`LA-F2`** | `Claim LA-2` (Polyglot suite) | Zig 分配 `> 0` 热循环堆字节，Go 报告 `> 0 allocs/op`，或 Julia Enzyme 超过 `1e-7` FD 误差。 |
| **`LA-F3`** | `Claim LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` 超过 `117,120` LUTs、`144` `RAMB36E2`s、`0` `DSP48`s，或每页切换 `1` 个周期。 |
| **`LA-F4`** | `Claim LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` 在偏移流量上超过目标虚假风险 $\alpha = 0.02$，或标记 `Deterministic`。 |
| **`LA-F5`** | `Claim LA-5` (Byte speculation) | `scripts/run_code_corpus_benchmark.py` 在 `48` 个未见提示上产生相对于贪婪 `Mamba3CodeLM` 的 `< 100.0%` 精确字节一致性。 |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` 在 `F_NOCACHE` 下无法达到 `100%` 一致性，或读取比 `AirLLM` 4-Bit `T=1` 更多的 NVMe 字节。 |
| **`LA-F7`** | `Claim LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`、`scripts/run_hf_air_mol_pretrained.py` 或 `scripts/run_hf_qwen35_air_mol.py` 与贪婪目标偏离 $\ge 1$ 个 BPE 词元。 |
| **`LA-F8`** | `Claim LA-8` (Regression suite) | `pytest -v` 未能通过 `tests/` 中 `22` 个测试中的任意一个。 |
| **`LA-F9`** | `Claim LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` 与 `100%` 词元一致性偏离，或读取比 `AirLLM` 或 `Expert-AirLLM` 更多的 NVMe 字节。 |
| **`LA-F10`** | `Claim LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` 相对于稠密 `ITQ` 二值矩阵乘法的最大误差超过 `1e-3`，或未能通过 `100%` 验证一致性。 |
| **`LA-F11`** | `Claim LA-11` (`48`-Task Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` 承认 `> 0%` 损坏提交，或承认在 Wave-2 规范变异下存在过时的 Wave-1 技能。 |

---

<div id="7-references" class="anchor-alias" aria-hidden="true"></div>

## 7. 参考文献

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

## 附录 A. 可复现性

从 [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) 的检出版本(`commit a5e9bc1`)开始:

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
