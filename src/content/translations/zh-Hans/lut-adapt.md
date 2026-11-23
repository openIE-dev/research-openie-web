---
title: "Mixture of Limits 级联中的向下 LUT6 编译：Beneš 路由布尔架构、共形唤醒门槛与前沿稀疏 MoE NVMe 按层流式传输"
deck: "基于 Mixture of Limits 的级联结构首先尝试零浮点运算（FLOP）的分页式 6 输入查找表（LUT6）电路。仅在未命中时，它才借助定制的 Apple Metal Shading Language（MSL）着色器，通过非易失性内存高速接口（NVMe）以 4 位精度流式加载参数量最高达 34.66B 的混合与稀疏 Mixture-of-Experts（MoE）2026 年末模型。随后，确定性验证器对提交进行门控，并将已认证的唤醒（wake）向下编译为 Beneš 路由的 36 Kbit 块随机存储器（RAMB36E2）以及规范化的技能页面。墙钟时间、未缓冲的 Darwin F_NOCACHE（未缓冲文件读取）字节数、活动随机存取存储器（RAM 降至 970.0 兆字节，即 34.66B 模型中 16 位浮点权重的 1.47%）、双通道 Apple M5 Max 片上能量计数器（reported_j）、解析能量估计（est_j）以及 Yosys/Verilator xck26 寄存器传输级（RTL）仿真结果，均取自 openIE-dev/lut-adapt-ai 仓库的 af152ba 提交。未测得独立板级电源轨功耗（measured_j 未设置）。"
lang: "zh-Hans"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*修订 ff18890，2026年11月22日。参考实现和工件：[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) 于 [`af152ba2e63b5c55bcfad9b2fa41e675e8e3946c`](https://github.com/openIE-dev/lut-adapt-ai/tree/af152ba2e63b5c55bcfad9b2fa41e675e8e3946c)。数据摘要：[/data/#lut-adapt](/data/#lut-adapt)。LaTeX PDF：[/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf)（[源文件](/pdfs/latex/lut-adapt.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概述

本研究考察计算系统如何将重复的神经模型工作向下编译为快速布尔查找表并获得经过认证的规范技能，而不失去精确输出等价性，也不将未经验证的猜测提升为可信规则。它报告了软件和无缓冲输入/输出测量、寄存器传输级综合与周期仿真、双通道操作系统/芯片上能量计数器读数（`reported_j` 在 Apple M5 Max 和 Linux 平均功率限制计数器），以及标记的分析能量估计（`est_j`）。本仓库未连接墙式或轨式焦耳监视器（`measured_j` 未设置；`board_metered` 为 false）。

**用通俗的话**

1. 大多数输入的部署系统会看到已经解决过的重复模式，因此在每一步上运行完整的浮点神经网络会浪费计算和内存带宽。  
2. 参考在流式状态空间和基础模型之前放置一个可重构的 6 输入真值表（`LUT6`）查找层，并仅在显式检查认证后将答案向下编译到查找内存页。  
3. 当 2026 年底的混合稀疏专家模型语言模型规模达到 `34.66B` 参数，并通过自定义融合的 Apple Metal 着色器从固态存储流式传输 4 位权重时，路由稀疏专家读取配合该零 FLOP `LUT6` 起草器可将磁盘读取削减至最高 `12.30×`，并在 `970.0` 兆字节的活跃权重内存（占其 `66.11`-千兆字节 16 位浮点占用的 `1.47%`）下以 `6.773 J/tok` 的片上 `reported_j` 保持 `Qwen/Qwen3.6-35B-A3B`，对输出 token 零影响；在确定性的 `pytest` 检查之后，将门控代码和多文件 git 仓库提交置于其后，可在 `48` 任务（`16` 规格 × `3` 波）前沿编码竞赛和 `16` 任务（`8` git 仓库 × `2` 波）仓库补丁基准中实现 **`87.50%` 验证通过率**，且 **`0.00%` 损坏提交** 被接受，从而将结晶化 Wave-3 求解加速 **`15,401×`**（`2.89 ms`, `0.0424 J` `reported_j`）。

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语、首字母缩略词和测量标签

<ul id="terms">
<li>MoL: Mixture of Limits，即 Metered Commit Gates 第二部分中的级联规则 [同系列]</li>
<li>LA：本研究使用的主张与证伪前缀（LA-1 至 LA-14，LA-F1 至 LA-F14）</li>
<li>LUT、LUT6、INIT: 查找表（look-up table）、6 输入 Xilinx UltraScale+ 布尔原语，以及其 64 位真值表初始化掩码</li>
<li>BRAM、RAMB36E2、URAM: 块随机存储器（Block RAM）、36 Kbit 双端口 UltraScale+ 块 RAM 原语（xck26 上为 144 个），以及 UltraRAM</li>
<li>CLB、FF、DSP、DSP48、KV260: 可配置逻辑块（configurable logic block）、触发器（flip-flop）、数字信号处理片（digital signal processing slice）、DSP48 原语，以及 AMD Kria KV260 开发板（xck26）</li>
<li>FPGA、ASIC、RTL、CPI、PAR、WNS、FPL: 现场可编程门阵列（field-programmable gate array）、专用集成电路（application-specific integrated circuit）、寄存器传输级（register-transfer level）、每次查找周期数（cycles per lookup）、布局布线（place-and-route）、最差负时序裕量（worst negative slack），以及现场可编程逻辑会议（Field-Programmable Logic conference）</li>
<li>AXI、PS、PL、SOM、INA260、VCC、RAPL、NVML、PMU、SMC、L2、L3：高级可扩展接口、Zynq 处理系统、可编程逻辑、系统级模块、板载功率监测芯片、供电轨、英特尔平均功耗限制（Running Average Power Limit）、NVIDIA 管理库、macOS 电源管理单元、Apple 系统管理控制器、二级子系统能耗计数器（Apple IOReport GPU Energy），以及三级单进程 CPU 能耗计数器（Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj）</li>
<li>SSD、SSM、MIMO、RoPE、SwiGLU、GQA、KV、BPE、LLM、LLMs、MoE、MLP、CFG: 状态空间对偶（State Space Duality）、状态空间模型（state-space model）、多输入多输出（multiple-input multiple-output）、旋转位置编码（rotary position embedding）、门控线性单元激活（gated linear unit activation）、分组查询注意力（grouped-query attention）、键值缓存（key-value cache）、字节对编码（byte-pair encoding）、大语言模型（large language model）、混合专家模型（Mixture-of-Experts）、多层感知机（multilayer perceptron），以及上下文无关文法（context-free grammar）</li>
<li>HC、SOINN、WNN、DWN: 层级上下文自组织增量神经网络（hierarchy-context Self-Organizing Incremental Neural Network）、无权重神经网络（weightless neural network），以及可微无权重神经网络（Differentiable Weightless Neural Network）</li>
<li>JEPA、EBRM、ACI、OOD、AUROC、AUC、MSP、MC: 联合嵌入预测架构（Joint-Embedding Predictive Architecture）、基于能量的推理模型（Energy-Based Reasoning Model）、自适应共形推断（Adaptive Conformal Inference）、分布外（out-of-distribution）、接收者操作特征曲线下面积（area under the receiver operating characteristic）、曲线下面积（area under the curve）、最大 softmax 概率（maximum softmax probability），以及蒙特卡洛（Monte Carlo）</li>
<li>PLD、REST、EAGLE、LFM2、LFM3、HF: 提示查找解码（Prompt Lookup Decoding）、基于检索的投机解码（Retrieval-Based Speculative Decoding）、面向更高语言模型效率的外推算法（Extrapolation Algorithm for Greater Language-model Efficiency）、Liquid Foundation Model 2.5（LFM2.5-350M 与 LFM2.5-8B-A1B）、Liquid Foundation Model 3（2026 年 10 月发布的 LiquidAI/LFM3-1.7B），以及 HuggingFace</li>
<li>SVD、ITQ、SVID、QAT、PTQ、PPL、SNR: 奇异值分解（singular value decomposition）、超立方体旋转的迭代量化 Procrustes 方法（Iterative Quantization Procrustes hypercube rotation）、符号值独立分解（sign-value-independent decomposition）、量化感知训练（quantization-aware training）、训练后量化（post-training quantization）、困惑度（perplexity），以及信噪比（signal-to-noise ratio）</li>
<li>NVMe、NOCACHE、POSIX、RAM、DRAM、SRAM、IO、KB、MB、GB、GiB：非易失性存储器快速访问（NVMe）存储、Darwin F_NOCACHE 非缓冲文件标志、可移植操作系统接口（POSIX）、随机存取存储器（RAM）、动态随机存取存储器（DRAM）、静态随机存取存储器（SRAM）、输入/输出（IO）、千字节（KB）、兆字节（MB）、吉字节（GB）和吉比字节（GiB）</li>
<li>FLOP、FLOPs、MFLOP、MFLOPs、MAC、MACs、SIMD、AD、FD、BPB、BF16、FP16、FP32、INT4、ULP、MSL、MPS：浮点运算、百万浮点运算、乘累加运算、单指令多数据、自动微分、有限差分、每字节位数、脑浮点 16、16/32 位 IEEE 浮点数、4 位整数、末位单位、Apple Metal 着色语言和 PyTorch Metal 性能着色器</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house]，Wise Computer Automation [same house]，已验证完成，和 software-engineering benchmark 前缀</li>
<li>CLI、HTTP、GET、POST、SSE、API、MCP、RPC、IDE、SDK、CORS、ACL、ICML、ICLR、EMNLP、NAACL、CVPR、ICPE、ISSCC、JSAC、JASA、ACM、OS、CPU、GPU、SW、TDP：命令行界面、超文本传输协议及其 GET/POST 请求方法、服务器发送事件、应用程序编程接口、模型上下文协议、远程过程调用（JSON-RPC 2.0）、集成开发环境、软件开发工具包、跨源资源共享、学术计算机科学/工程会议、操作系统、中央/图形处理器、软件和热设计功耗</li>
<li>VLAN、IEEE、TLS、DPI、AST、JSON、CSV、SHA、CRC、ATM、RFC、SQL、DWARF、SLEB、CAM、XNOR、JWT、HMAC、DAG、CIDR、LRU、TTL、WAL、ETL：虚拟局域网（IEEE 802.1Q）、传输层安全、深度包检测、抽象语法树、JavaScript 对象表示法、逗号分隔值、安全哈希算法、循环冗余校验、异步传输模式（CRC-8/ATM）、请求评议、结构化查询语言、DWARF 有符号小端基数 128 编码、内容可寻址存储器、异或非、JSON Web 令牌、基于哈希的消息认证码、有向无环图、无类别域间路由、最久未使用缓存、存活时间过期、预写日志和抽取-转换-加载流水线</li>
<li>JTAG、XSDB、DAP、USB、FTDI、FT2232C、UART、FIFO、IC、EDA、OOC、AMBA、AXI4、IOB、IBUF、OBUF、FDRE、FDSE、LUT1、LUT2、LUT3、LUT4、LUT5、MUXF7、MUXF8、CARRY4、CARRY8、DSP48E2、URAM288、VCCINT、DS925、VCD、SDP、CE、XPE、CLAI、AMD：Joint Test Action Group 调试端口、Xilinx 软件命令行工具调试器、调试访问端口、通用串行总线、Future Technology Devices International 及其 FT2232C 双 UART/FIFO 桥接 IC、通用异步收发器、先进先出缓冲区、集成电路、电子设计自动化、超上下文合成模式、Advanced Microcontroller Bus Architecture、AXI4-Lite/AXI4-Stream 互连、输入/输出块、输入/输出缓冲器、同步复位/置位 D 触发器、UltraScale+ 1 至 5 输入查找表、UltraScale+ 7/8 输入多路复用器、4/8 位快速进位链、UltraScale+ DSP 切片、288 Kbit UltraRAM、内部核心供电轨（-2LV 上 0.72 V）、AMD Zynq UltraScale+ DC 与 AC 开关特性数据手册 DS925、值变化转储波形追踪、简单双端口块 RAM 模式、同步时钟使能、Xilinx 功耗估算器、子系统寄存器魔术标识符（“CLAI”），以及 Advanced Micro Devices。</li>
</ul>

四个证据类别在下表中保持独立：

| 证据标签 | 本研究中的含义 |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | 通过 Darwin `F_NOCACHE` 下的 `os.pread` 读取或写入的精确字节数、常驻内存分配、壁钟秒数、整机 macOS `PMU`（`AppleSmartBattery.PowerTelemetryData`）累计能量增量（Apple M5 Max）以及精确的比特/标记一致性。`measured_j` 为未设置 (`None`)。 |
| **`Reported (OS / On-Chip Counter, reported_j)`** | 非特权操作系统和片上遥测计数器：在 Apple M5 Max 上（`joule_meter.py`），双通道 `libIOReport.dylib` “Energy Model” `'GPU Energy'`（`L2` 纳秒分辨率 `nJ`）以及 `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（`L3` 每进程 CPU `nJ`）；在 `x86-64` Linux（下文 `xck26` EDA 综合审计中），`RAPL` `package-0` 焦耳。永不与 `measured_j` 合并 (`None`)。 |
| **`Simulated (RTL)`** | 来自 Yosys `0.71+`（`synth_xilinx -family xcup` 针对 Kria KV260 `xck26`）的结构网表计数以及 Verilator `5.054` 的周期计数（`CPI = 1`）。不涉及 Vivado 时序闭合，也不涉及板级功耗（`board_metered = false`）。 |
| **`Estimated (est_j)`** | 基于操作计数、热设计功率时间替代值（`joule_meter.py`）或 Verilator VCD 切换率活动与 AMD `DS925` `xck26-2LV`（`0.72 V`）逻辑及 `RAMB36E2` 电容上限（§4.16）配对计算的分析焦耳。仅在同一公式的不同臂之间可比；不表示硅片功率。 |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 架构背景与贡献

在[计量提交门](/papers/gates/)`[同系列]`中，第二部分定义了**极限混合（Mixture of Limits）**：按每焦耳通过概率 $p_i / c_i$ 递减的顺序尝试各档位（Simon and Kadane, 1975），一旦任务完成谓词 $C(z) = 1$ 成立即停止，并禁止将 `ModelGenerated` 输出强化为 `Deterministic`。然而，静态查找层仅覆盖部署前写入其中的条目。相反，现有的查找表神经网络，包括 LogicNets（Umuroglu et al., 2020）、DiffLogic（Petersen et al., 2022）以及可微无权神经网络（Bacellar et al., 2024），都将连线拓扑固定在静态 FPGA 布线之中，因而每当输入分布发生偏移，就必须重新进行厂商布局布线。

`lut-adapt-ai` 参考实现通过**在线向下 `LUT6` 编译**闭合了级联顶层与底层之间的回路：

- **第 0 梯级（查找，分页 Beneš + `LUT6`）**：通过无阻塞的 $512 \times 512$ **Beneš-Copy-Beneš** 多播交换机路由 64 位真值表掩码，并在 $81 \times \texttt{RAMB36E2}$ 双端口块存储器上进行缓存（`0` 浮点操作，在 Verilator 仿真中实现单周期页面切换）。
- **第 1 梯级（流式传输，`Mamba-3` 复数 MIMO 状态空间对偶性）**：使用常数规模 $O(1)$ 循环状态（参考模型中为 `48 KB` 固定内存，参数量 `14.3M`）处理依赖于序列历史的缺失，避免 $O(L)$ 键值缓存增长。
- **第 2 梯级（拓扑，`HC-SOINN`）**：在潜在嵌入上维护在线原型拓扑，隔离体制边界，并在出现未标记分布偏移时触发断路器（`Refuse` / 升级）。
- **第 3 梯级（模型最后，`JEPA-EBRM`、`AirMoL` 以及金属融合 `Expert-AirMoL` 4 位 NVMe 流式传输）**：仅在较低梯级弃权或需要精确目标验证时，通过自定义 Apple Metal `MSL` 计算着色器调用潜在能量基验证，或流式传输预训练的 2026 年晚期混合与稀疏 MoE 基础模型（`LiquidAI/LFM3-1.7B`、`google/gemma-4-E2B-it`、`LiquidAI/LFM2.5-8B-A1B` 和 `Qwen/Qwen3.6-35B-A3B`，以及 `LiquidAI/LFM2.5-350M` 和 `Qwen/Qwen3.5-0.8B-Base`）。
- **向下 `SleepCrystallizer`**：使用 Walsh-Hadamard 谱热启动、联合模式最小项真值表、规范 AST 技能和 Waksman 交换机调度提取循环唤醒轨迹，在不中断推理或运行 FPGA 布局布线的情况下翻转影子块存储器组。

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 贡献

1. **分摊向下编译条件**：将 Simon-Kadane $p_i/c_i$ 排序扩展为在平稳视界 $\Delta T$ 上显式包含编译代价 $E_{\text{compile}}$。

2. **非阻塞 $512 \times 512$ Beneš-Copy-Beneš 和 `81`-`RAMB36E2` RTL 架构**：消除了平面交叉开关（`119,478` LUT）的 `102.0%` Kria KV260 逻辑溢出以及触发器页复用器的 `926,619`-LUT 爆炸，在仿真中综合为 `41,186` UltraScale+ CLB LUT（`xck26` 的 `35.2%`）、`81` 个 `RAMB36E2` 块（`56.2%`）和 `0` 个 `DSP48` 片，实现 `1` 周期（`250 MHz` 标称下 `4.0 ns`）的页切换。

3. **通用 $\le 64$ 位联合模式最小项综合**：表明联合模式最小项查找在相关分支上主导边际比特平面 DiffLogic 舍入，并将 $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ 个子字词元打包到一个 `uint64` 字中（对于 `|V| = 65,536` 为 `16b × 4 = 64b`；对于 `|V| = 128,000` 为 `17b × 3 = 51b`；对于 `|V| = 248,320` 为 `18b × 3 = 54b`）。

4. **无预言机拆分共形 + 在线 ACI 结晶门**：将径向正则化的潜在 `JEPA-EBRM` 非一致性分数与拆分共形校准和自适应共形推断（Gibbs 和 Candès, 2021）配对，在偏移流量上记录 `0.00%` 虚假结晶风险和 `1.0000` OOD AUROC，而 softmax 和 MC-Dropout 基线记录 `17.62%-24.28%` 虚假风险。

5. **定制 Apple Metal `INT4` 稀疏 MoE 和 `GatedDeltaNet` 着色器 + `AirMoL` / `Expert-AirMoL` 至 `34.66B`**：结合 Darwin `F_NOCACHE` `os.pread` 4 位分片、定制 `MSL` `q4_moe_*`（`43.45×` 更快）和 `gated_delta_recurrent_k128`（`20.66×` 更快）计算着色器、队列深度 `8` 并行 `pread`，以及跨 2026 年 10 月 `LiquidAI/LFM3-1.7B`（`3.79%` FP32 RAM 中 `2.74×` NVMe 减少）、`LiquidAI/LFM2.5-8B-A1B`（`500.0 MB` RAM，`3.493 J/tok` `reported_j`）和 `Qwen/Qwen3.6-35B-A3B`（`34.66B`；**`12.30×` NVMe 减少**，**`970.0 MB` RAM = FP16 的 `1.47%`**，**`6.773 J/tok` `reported_j`**，**`15.7 tok/s`** 统一内存 `Q4`）的 `BenesLUT6` 突发推测，实现 `100.0%` 精确词元一致性。

6. **零 MAC `Sub1Bit-LUT6` 与 `LittleBit`、`87.50%` 验证器门控前沿编码及 `SWE-Mini` git 仓库级联，以及 OpenAI / `MCP` `mol-agent`**：将 `LittleBit-1 / LittleBit-2`（`0.576` 位/权重；Lee et al., 2025；Lee and Kim, 2026）的 `1.98M` 运行时二进制 MAC 替换为零 MAC `6` 输入 `LUT6` 部分和查找（`< 4 × 10⁻⁶` 误差，在 `0` 个 QAT 周期下针对 `MoL` 目标验证的 `100.0%` 奇偶性），在 `48` 任务的 2026 年晚期编码烘焙测试中实现 **`87.50%`（`42 / 48`）验证通过**（`0.00%` 损坏提交，`22.92%` `35B` 调用，`2.89 ms` / `0.0424 J` `reported_j` Wave-3 晶化重放 = `15,401×` 快于 `35B`），在 `16` 任务（`8` 个多文件 git 仓库 × `2` 波）的 `SWE-Mini` `pytest` 基准测试中实现 **`87.50%`（`14 / 16`）**（`0.00%` 损坏补丁），并公开一个即插即用的 OpenAI `/v1/chat/completions` + `MCP`（`JSON-RPC 2.0`）`mol-agent` 服务器（`26 / 26` `pytest` 测试通过）。

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

### 4.8 主张 LA-8：实时 CLI 与 HTTP/SSE 流式服务器 (`mol_code_cli.py`)

`scripts/mol_code_cli.py` 提供 `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` 和 `--air-nvme`，通过 CLI 和 SSE 端点（`/v1/health`、`/v1/complete`、`/v1/crystallize`）服务，将 `RAMB36E2` 插槽驻留从 `438/512` 提升至 `460/512`，实时通过 `26/26` 的测试在 `tests/` 中。

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

### 4.11 主张 LA-11：`48` 任务（`16` 规格 × `3` 波）2026 年后期前沿编码比拼

| 2026 年后期系统臂（`48` 任务 = `16` 规格 × `3` 波） | W1 冷 | W2 适配 | W3 暖 | 整体通过率 | 破损提交率 | W3 `Rung 0/1` 占比 | `35B` 调用次数 | 平均 W1 / W3（`ms`） | `reported_j` / 求解（`est_j`） |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT (`1`-Shot) | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `22,413` / `22,708` | `8,020.13` (`32,558 est_j`) |
| `B` `LiquidAI/LFM3-1.7B` (Oct 2026 Tri-Hybrid, `1`-Shot) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `8,460` / `9,791` | `152.77` (`957.21 est_j`) |
| `C` `google/gemma-4-E2B-it` (`2026` Hybrid, `1`-Shot) | `37.50%` | `18.75%` | `18.75%` | `25.00%` | `75.00%` | `0.00%` | `0.0%` | `18,924` / `23,578` | `5,800.68*` (`3,700.44 est_j`) |
| `D` `LiquidAI/LFM2.5-8B-A1B` (`8.47B` MoE, `1`-Shot) | `6.25%` | `6.25%` | `6.25%` | `6.25%` | `93.75%` | `0.00%` | `0.0%` | `53,123` / `53,885` | `33,415.04` (`47,196 est_j`) |
| `E` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL` (`1`-Shot) | `81.25%` | `75.00%` | `75.00%` | `77.08%` | `22.92%` | `0.00%` | `100.0%` | `49,887` / `44,447` | `1,069.65` (`5,701.32 est_j`) |
| `F` `RouteLLM` Confidence Router (`LFM3` $\to$ `Gemma4` $\to$ `8B`) | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `9,735` / `11,294` | `171.09` (`1,148.96 est_j`) |
| **`G` `MoL` `VerifiedCodeCascade` (Reference)** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`87.50%`** | **`22.92%`** | **`116,626` / `44,052` (`2.89 ms` solved)** | **`3,655.51*` (`0.0424 J` in W3)** |

在 **`48` 项**协议与算法基准测试中（涵盖 RFC 1982 序列号算术、加权区间扫描线、循环安全的字典序拓扑排序、纳秒级令牌桶、CRC-8/ATM 与变异 `0xFF` 的 CRC-8、RFC 6901 JSON Pointer 的 `~01` 反转义、跳数受限的 Bellman-Ford、`>2⁵³` 精确窗口中位数、无限制 Damerau-Levenshtein 距离、`4×4` Beneš 路由、SQL 字面量参数化、单调双端队列子序列和、DWARF SLEB128、SHA-256 一致性哈希以及共形分位数；全系统 macOS `PMU` 能耗增量为 `117,166.40 J`，共 `6,646` 个采样周期）中，`VerifiedCodeCascade` 在三个批次中的总体通过率达到 **`87.50%`（`42 / 48`）**，超过独立运行的 `Qwen3.6-35B-A3B`（`77.08%`）。该系统仅在 **`22.92%`（`11 / 48`）** 的任务上调用 `35B` 模型。其中，`LFM3-1.7B` 直接解决了 `7` 项第一批次规范；`Gemma-4-E2B-it` 结合结构化反例修复解决了 `3` 项；`Metal-Qwen3.6-35B-A3B` 解决了 `4` 项，并解决了变异后的 `W2_01`。系统提交的破损提交率为 **`0.00%`**（对比基线的 `22.92%-100.00%`）。通过 $C(z)$ 检验，系统捕获了两项第二批次对抗性规范变异，并在 `artifacts/.mol_verified_skills` 中认证了 `16` 项技能。在 **`14` 项已固化求解（`87.50%`）** 上，第三批次的平均重放耗时降至 **`2.89 ms`**，`reported_j` 降至 **`0.0424 J`**（相较独立运行的 `35B`，速度提升 `15,401×`，`reported_j` 降低 `25,227×`）。*（脚注 `*`：一次 `W2_10` 的 `Gemma-4` 调用遇到了非特权 macOS `IOReport` `'GPU Energy'` 硬件累加器回绕尖峰，峰值为 `+59.2 kJ`。该数据已原样保留在 `frontier_ai_head_to_head_bakeoff.csv` 中，并在后续运行中被 `joule_meter.py` 的 `> 450 W` 回绕防护机制过滤。）*

<div id="412-claim-la-12-native-apple-metal-msl-fused-int4-sparse-moe--gateddeltanet-shaders--dual-channel-reported_j" class="anchor-alias" aria-hidden="true"></div>

### 4.12 声明 LA-12：原生 Apple Metal (`MSL`) 融合 `INT4` 稀疏 MoE 与 `GatedDeltaNet` 着色器 + 双通道 `reported_j`

`src/clai/frontier/metal_moe_kernels.py` 和 `scripts/run_metal_moe_benchmark.py`（`artifacts/metal_moe_air_mol_speedup.csv`、`artifacts/metal_moe_air_mol_meta.json`）通过 `torch.mps.compile_shader` 编译了三个自定义 `MSL` 内核：（i）`gated_delta_recurrent_k128`，利用递归状态 $\mathbf{S}[b, h_v, :, v]$ 在 $v \in \{0, \dots, V_{\text{dim}}-1\}$ 上的列独立性，将 `128` 个 `FP32` 状态元素保存在 GPU 寄存器中，跨所有 $T$ 令牌 **`20.66×` 加速**：`34.523` 毫秒降至 `1.671 ms`，**`46.2×` 降低 `reported_j`**：`1.4989` 降至 `0.0325 J`，最大状态误差 `1.19 × 10⁻⁷`；以及（ii）`q4_moe_gate_up_silu` + `q4_moe_down_weighted`，在 `simd_sum` 寄存器内直接对 `4.50 bpw` `INT4` 块-64 专家权重进行解量化，零 `FP16`/`FP32` 权重分配 **`43.45×` 加速**：在 `28` 个活跃专家上从 `22.408` 降至 `0.516 ms`，**`29.8×` 降低 `reported_j`**：`0.3959` 降至 `0.0133 J`，最大 `FP32` 误差 `7.2 × 10⁻⁷`，`BF16` 误差 `≤ 1 ULP`，并配合深度为 `8` 的并行 `pread` 与 `BenesLUT6` 符号草图路由器前瞻：

| 稀疏-MoE 检查点 & 冷-NVMe 引擎变体 | 一致性 | 令牌 / 扫描 | NVMe 读取 / 令牌 | 峰值活跃 RAM | `tok/s` (`× PyTorch`) | 芯片上 `reported_j / tok` (`GPU` + `CPU`) | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `1` PyTorch-Ref `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | `1,408.3 MB` | `0.394` (`1.00×`) | `10.978 J` (`5.25` + `5.73`) | `266.66` |
| `LFM2.5-8B-A1B` · `2` Metal-Fused `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | **`500.0 MB`** | `0.689` (`1.75×`) | `6.979 J` (`1.30` + `5.68`) | `152.42` |
| **`LFM2.5-8B-A1B` · `3` Metal-Fused + `BenesLUT6`（参考）** | **`100%`** | **`2.67`** | **`0.791 GB`** | **`500.0 MB`** | **`1.671` (`4.24×`)** | **`3.493 J` (`1.22` + `2.28`)** | **`62.85`** |
| `Qwen3.6-35B-A3B` · `1` PyTorch-Ref `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | `2,434.7 MB` | `0.191` (`1.00×`) | `20.765 J` (`8.76` + `12.00`) | `549.49` |
| `Qwen3.6-35B-A3B` · `2` Metal-Fused `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | **`970.0 MB` (`1.47%`)** | `0.241` (`1.26×`) | `15.440 J` (`3.93` + `11.51`) | `436.26` |
| **`Qwen3.6-35B-A3B` · `3` Metal-Fused + `BenesLUT6`（参考）** | **`100%`** | **`2.67`** | **`1.447 GB`** | **`970.0 MB` (`1.47%`)** | **`0.621` (`3.25×`)** | **`6.773 J` (`2.31` + `4.47`)** | **`169.03`** |

消除 `FP16`/`FP32` 专家解包将 `Qwen/Qwen3.6-35B-A3B` 上的冷-NVMe 峰值活跃权重 RAM 降低 **`2.51×`** 至 **`970.0 MB`（`1.47%` 的 `66.11 GB` FP16）**，并将双通道 `reported_j / tok` **`3.07×`**（从 `20.765` 降至 **`6.773 J/tok`**）在 `100.0%` 完全令牌一致性下实现（在 `>= 36 GiB` 工作站上保持 `16.8 GB` `INT4` 专家包在统一内存中固定时，可达 **`15.7 tok/s`**）。

<div id="413-claim-la-13-16-task-8-multi-file-git-repositories--2-waves-swe-mini-pytest-patching-benchmark" class="anchor-alias" aria-hidden="true"></div>

### 4.13 声明 LA-13：`16` 任务（`8` 多文件 git 仓库 × `2` 波）`SWE-Mini` `pytest` 补丁基准

`src/clai/frontier/repo_patch_cascade.py` 与 `scripts/run_repo_patch_benchmark.py`（`artifacts/repo_patch_swebench_mini.csv`, `artifacts/repo_patch_swebench_mini_traces.json`）评估跨模块仓库错误修复，覆盖 `8` 个独立 git 仓库（`billing`、`scheduler` DAG、`auth` JWT/HMAC、`wal` CRC32、`http_client` CIDR、`semver`、`ttlcache` LRU/TTL、以及 `etl` CSV）× `2` 波（共 `16` 次评估，包含对 `R03_jwt_clock_skew` 的 Wave-2 安全突变，即添加对未来 `iat` 的拒绝），其中 $C(z)$ 强制 `tests/` 字节一致并运行子进程 `pytest -q`：

| 多文件 Git 仓库臂 (`16` 任务 = `8` 仓库 × `2` 波) | W1 冷启动 | W2 热启动 | 综合通过率 | 破损补丁 | W2 `.mol/` 命中份额 | 平均 W1 / W2（`ms`） | `reported_j` / 修复 (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B`（`1`-Shot 仓库补丁） | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `4,943` / `5,020` | `371.61 J`（`637.68 est_j`） |
| `B` `google/gemma-4-E2B-it`（`1`-Shot 仓库补丁） | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `6,865` / `7,117` | `133.48 J`（`469.79 est_j`） |
| `C` `LiquidAI/LFM2.5-8B-A1B`（`1`-Shot 仓库补丁） | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `61,430` / `61,416` | `17,882.33 J`（`54,052 est_j`） |
| `D` `Qwen/Qwen3.6-35B-A3B` 金属 `AirMoL`（`1`-Shot） | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `20,270` / `20,502` | `288.39 J`（`3,098.71 est_j`） |
| **`E` `MoL` `RepoPatchCascade`（参考）** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`75.00%`** | **`59,341` / `30,663`（`594 ms` `.mol/`）** | **`692.38 J`（`1.10 J` `.mol/`）** |

`RepoPatchCascade` 解决 **`87.50%`（`14 / 16`）** 的多文件仓库错误（比独立 `35B` 与 `Gemma 4` 高 `25.0` 百分点），提交 **`0.00%` 破损补丁**，通过子进程 `pytest` $C(z)$ 捕获 Wave-2 `R03` 规范突变并重新结晶 `Patch#8`（`2,905 ms`），并在 **`594.0 ms`（`1.10 J` `reported_j`，包括 `git init` + `pytest`）** 内重放 `6` 条重复的 Wave-2 `.mol/` 补丁，相较于 Wave 1 的 `38,937.5 ms`（`590.38 J` `reported_j`）实现 **`65.6×` 加速，`537×` 降低 `reported_j`**。

<div id="414-claim-la-14-drop-in-openai-v1chatcompletions-and-mcp-json-rpc-20-local-coding-agent-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.14 声明 LA-14：兼容 OpenAI（`/v1/chat/completions`）与 `MCP`（`JSON-RPC 2.0`）的本地编码智能体（`mol-agent`）

`src/clai/service/openai_mcp_agent.py` 与 `scripts/mol_agent_server.py`（`mol-agent` 命令行入口）将级联能力暴露给 `IDE` 及终端编码工具（`Cursor`、`Continue.dev`、`Claude Code`、`Antigravity`、OpenAI `SDK`），且不依赖任何第三方 Web 组件。具体包括：(i) 兼容 OpenAI 的 `GET /v1/models` 与 `POST /v1/chat/completions` 接口，支持 `stream: true/false` 的 `SSE` 流式输出、CORS 响应头、可选的 `x_mol_contract` 确定性验证器，以及报告档位（rung）、`skill_id`、`est_j`、`reported_j` 和 `measured_j: null` 的 `x_mol_receipt` 回执；(ii) 通过 `--mcp-stdio` 与 `POST /mcp` 提供的 Model Context Protocol（`MCP`，`JSON-RPC 2.0`）接口，暴露 `mol_synthesize_verified_function`、`mol_repair_repo_pytest`、`mol_lookup_crystallized_skill` 与 `mol_energy_telemetry` 四个工具，其后端由持久化的 `.mol/skills_v1.json` 与 `.mol/benes_lut6_router.npz` 支撑（`26 / 26` 个 `pytest` 测试通过）。

<div id="415-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.15 `xck26-sfvc784-2LV-c` 全子系统原语拆解、拓扑深度与 `Vivado 2026.1` 硬件探测

为审计独立的 `512` 页推测核心（`hw/kv260/rtl/clai_benes_hotswap_core.sv` 中的 `clai_benes_paged_hotswap_core`）以及完整的 Advanced Microcontroller Bus Architecture (`AMBA`) `AXI4-Lite` + `AXI4-Stream` Rung-0 子系统（`hw/kv260/rtl/clai_kv260_axi_top.sv`、`clai_engram_streamer.sv`、`clai_rung0_hotswap_core.sv` 以及 `artifacts/clai_rung0_kv260.v`，提交 `a5e9bc1de280`，在 `af152ba` 中未更改），针对精确的 AMD Kria KV260 器件（`xck26-sfvc784-2LV-c`：`117,120` 个 CLB LUT、`234,240` 个 CLB 触发器、`144` 个 `RAMB36E2` 块、`64` 个 288-Kbit UltraRAM (`URAM288`) 块、`1,248` 个 UltraScale+ 数字信号处理 (`DSP48E2`) 片以及 `189` 个用户输入/输出块 (`IOB`)），在 `Intel Core i9-13900H` (`Linux 7.0.0-43-generic x86-64`) 工作站上执行了三项硬件和电子设计自动化 (`EDA`) 检查：

1. **只读联合测试行动组（`JTAG`）与通用串行总线（`USB`）探针（`Xilinx hw_server v2026.1` + Xilinx 软件命令行工具（`XSDB`））**：尽管 `lsusb` 报告检测到一个未来技术设备公司（`FTDI`）`0403:6010`（`FT2232C/D/H` 双路通用异步收发器（`UART`）/先进先出（`FIFO`）集成电路（`IC`））桥接器，检查 Linux `sysfs` USB 厂商/产品字符串（`idVendor = 0403`，`idProduct = 6010`）后确认设备的 `Manufacturer = "Particle"`，`Product = "tachyon-dbg-1.0"`，而非 Kria KV260 承载板。通过 `xsdb` 查询 `hw_server v2026.1`（构建日期 2026 年 5 月 29 日）(`connect; jtag targets; targets`) 返回 **`0` Xilinx `JTAG` 设备以及 `0` 调试访问端口（`DAP`）目标**（`board_metered = false`，`measured_j = None`）。
2. **`Vivado 2026.1` 批量综合与授权门（`SW Build 6511674`）**：一个可复现的低占用非项目批处理脚本（`scripts/run_vivado_xck26.tcl`，`set_param general.maxThreads 4`，针对 `xck26-sfvc784-2LV-c` 在 `250.0 MHz` / `4.000 ns` 的上下文外（`OOC`）模式）已在 `/tools/Xilinx/2026.1/Vivado/bin/vivado` 上排队。以批处理模式启动 `vivado v2026.1` 在进入 `synth_design` 前即退出（`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`），因为 AMD `Vivado 2025.1+` / `2026.1` 对 Standard/Enterprise `.lic` 文件（`~/.Xilinx/Xilinx.lic` 或 `XILINXD_LICENSE_FILE`）有明确要求，即使是 Standard 级别的 `xck26` 器件也需要此文件，而工作站上未安装任何 `.lic` 文件。根据严格的测量规则，后布线 `WNS`、放置与布线后的最大时钟频率以及无向量 `report_power`（`est_j`）均记录为 `not_available`，直至提供 Standard `.lic` 文件为止。
3. **完整子系统 UltraScale+ `xcup` 原语拆解、`IOB` 预算以及拓扑逻辑层审计（`Yosys 0.71+`）**：通过 `synth_xilinx -family xcup` 和 `ltp -noff` 对 `clai_benes_paged_hotswap_core` 与 `clai_kv260_axi_top` 进行综合（同时严格记录主机 `RAPL package-0` `reported_j` 为 `x86-64` `EDA` 编译成本 $E_{\text{compile}}$，而非 FPGA 硅功耗），建立了精确的单元计数和关键路径组合深度：

| `xck26-sfvc784-2LV-c` 目标模块 | CLB LUTs（`% xck26`） | 主导 LUT 基元 | CLB 寄存器（`FDRE`/`FDSE`） | `RAMB36E2`（`%`） | `DSP48E2` | 顶层端口（`IBUF`+`OBUF`） | 组合深度（`ltp`） | 主机综合 `RAPL`（`reported_j`） |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`**（`512` 页） | **`41,185`**（`35.17%`） | `19,982 LUT3`、`7,804 LUT6`、`7,714 LUT5`、`36 MUXF7`、`18 MUXF8` | **`36,464`**（`15.57%`） | **`81`**（`56.25%`） | **`0`** | `1,599`（`OOC` / 内部总线） | **`81` 层** | `7,297.3 J`（`144.8 s`） |
| **`clai_kv260_axi_top`**（`AXI4` Rung-0 子系统） | **`67,366`**（`57.52%`） | `25,557 LUT6`、`25,333 LUT5`、`7,918 LUT3`、`569 CARRY4` | **`16,619`**（`7.09%`） | **`4`**（`2.78%`） | **`0`** | `126`（`<= 189` `IOB`；`PS-PL`） | **`73` 层** | `10,089.4 J`（`214.8 s`） |

- **引脚预算限制（`OOC` 与 `PS-PL` `AXI` 包装器）**：由于 `clai_benes_paged_hotswap_core` 暴露了原始的 `512` 位 `CodeBitBus` 以及宽的影子配置向量（`1,379` 个输入缓冲器（`IBUF`）+ `220` 个输出缓冲器（`OBUF`）= `1,599` 个端口，而 `xck26-sfvc784-2LV-c` 上仅有 `189` 个封装 `IOB`），独立供应商实现必须以 `synth_design -mode out_of_context` 运行，或置于 `AXI4-Stream` / `zynq_ultra_ps_e` 包装器（如 `clai_kv260_axi_top`（`126` 个端口，`57.52%` LUT 利用率））内部。
- **非流水线组合深度（`81` 和 `73` 级）与 `250 MHz`（`4.000 ns`）`-2LV` 收敛**：虽然 Verilator `5.054` 验证了周期精确的 `CPI = 1.0`（每个时钟周期 `1` 次查找），但在单个组合周期内遍历 `17` 个 `Beneš-1` 级 + `9` 个前缀复制级 + `17` 个 `Beneš-2` 级 + 动态 `LUT6` 真值表多路复用 + `5` 投票多数归约跨越了 **`81` 个基元级**（在 `clai_kv260_axi_top` 的组合 `64` 输入 popcount 和 `8` 类裕度比较器中，每个分层模块 `73` 级）。因此，在低电压（`0.72 V`）`-2LV` 硅片上实现 `250 MHz`（`4.000 ns`）布局布线后收敛倾向于在 $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ 之间插入流水线寄存器级，并压缩 `64` 线 popcount 归约，该过程在 §4.16 中进行了解析量化。

<div id="416-gate-level-xcup-primitive--verilator-vcd-switching-activity-datasheet-audit-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.16 Gate-Level `xcup` Primitive 与 `Verilator` `VCD` 切换活动数据表审计 (`est_j`)

由于 AMD `Vivado 2026.1` 因缺少 `.lic` 文件而被阻止，且未连接 `0` 块物理 `xck26` 开发板（§4.15），通过预先注册的 `Verilator 5.054` `--trace` 波形和 `Yosys 0.71+` 扁平化 `synth_xilinx -family xcup` 审计（`PREREG_xck26_vcd.json`，SHA-256 `c64505d177515c47…`）从 `openIE-dev/lut-adapt-ai`（`af152ba`）在四个运行阶段（`idle_quiescent`、`steady_lut6_eval_2048_cycles`、`single_cycle_page_switch_512_burst` 和 `shadow_page_stream_write`）提取了每周期的信号跃迁，未出现 `0` 次协同仿真错误，覆盖了 `3,072` 次分页查找以及所有 `AXI4-Lite`/`AXI4-Stream` 包突发。 本节中的所有功耗和能量数值均为严格的分析动态切换估算（**`est_j` / `est_pJ/cycle` / `est_mW`**，**`measured_j = None`**，**`reported_j = None`**，**`board_metered = false`**），不包括静态硅泄漏，也不替代已布线后 `Vivado report_power` 或 KV260 `INA260` 轨道读取。

扁平化 `xcup` 综合将 `clai_benes_paged_hotswap_core`（`512` 页）映射为 **`41,623` CLB LUT**（`35.54%` 的 `xck26`，相较 §4.15 的 `41,185` 层次式；`19,982 LUT3`、`7,853 LUT6`、`7,738 LUT5`、`3,380 LUT4`、`2,670 LUT2`、`36 MUXF7`、`18 MUXF8`），`36,464` `FDRE`（`15.57%`），以及 `81` `RAMB36E2`（`56.25%`），涉及 `27,157` 条唯一 `VCD` 网络（`90,124` 内部比特：`64,218` 组合，`20,767` 时序），并将 `clai_kv260_axi_top` 映射为 **`66,881` CLB LUT**（`57.10%` 的 `xck26`，相较 §4.15 的 `67,366` 层次式；`25,402 LUT6`、`25,313 LUT5`、`7,909 LUT3`、`5,303 LUT4`、`2,879 LUT2`、`75 LUT1`、`569 CARRY4` $\equiv$ `285 CARRY8`），`16,619` `FDRE`/`FDSE`（`7.09%`），以及 `4` `RAMB36E2`（`2.78%`），涉及 `3,825` 条唯一 `VCD` 网络（`128,486` 内部比特：`108,582` 组合，`19,901` 时序）。 在 `VCCINT = 0.72 V`（`xck26-sfvc784-2LV-c`，`250.0 MHz`，AMD DS925 / XPE 16 nm FinFET 边界 `[low, nom, high]`）下的动态切换能量模型将切换逻辑 + 本地互连节点的电容设为 $C_{\text{node}} = [2.6, 4.5, 7.2]\text{ fF}$（$\frac{1}{2} C V^2 = [0.674, 1.166, 1.866]\text{ fJ/transition}$），并按 Beneš 核心中每个 `VCD` 组合比特对应 `2.02` 个 `xcup` 原语加权；`FDRE`/`FDSE` 时钟叶脚引脚电容为 `[1.5, 2.2, 3.0] fF`（每周期 `2` 边沿 = `1.141 fJ/FF/cycle` 额定），`Q` 迁移电容为 `[3.5, 5.5, 8.0] fF`；`RAMB36E2`（`SDP` `64b`/`72b`）在变址读取时每次耗能 `[2.90, 3.80, 4.80] pJ`，在常址使能周期（`ENARDEN = 1`，$\alpha_{\text{addr}} = 0$）每次耗能 `[1.90, 2.47, 3.12] pJ`，写入时每次耗能 `[3.30, 4.30, 5.40] pJ`，禁用时（`EN = 0`）每周期耗能 `[0.04, 0.08, 0.14] pJ`。

| 目标模块与 `VCD` 工作负载（`250 MHz`，`0.72 V`） | 周期数 | 组合逻辑翻转 / 周期（$\alpha_{\text{comb}}$） | 时序逻辑翻转 / 周期（$\alpha_{\text{seq}}$） | `RAMB36E2` 占空比（`Rd` / `Wr`） | 动态 `est_pJ / cycle` | 动态 `est_mW`（`[low, high]`） |
| :--- | ---: | ---: | ---: | :---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** · `idle_quiescent` | `256` | `0.00`（`0.0000`） | `0.00`（`0.0000`） | `100.0%` 常地址 / `0%` | **`241.66`**（`53.74` CE 门控） | **`60.41`**（`[47.25, 76.21]`；`13.43` CE 门控） |
| **`clai_benes_paged_hotswap_core`** · `steady_lut6_eval_2048_cycles` | `2,048` | `5,010.21`（`0.0780`） | `90.97`（`0.0044`） | `100.0%` 活跃 / `0%` | **`361.68`** | **`90.42`**（`[69.29, 116.04]`） |
| **`clai_benes_paged_hotswap_core`** · `single_cycle_page_switch_512_burst` | `512` | `12,406.84`（`0.1932`） | `269.46`（`0.0130`） | `100.0%` 活跃 / `0%` | **`380.07`** | **`95.02`**（`[72.58, 122.60]`） |
| **`clai_benes_paged_hotswap_core`** · `shadow_page_stream_write` | `512` | `1,987.31`（`0.0310`） | `74.47`（`0.0036`） | `100.0%` 读 / `1.23%` 写（`1/81`） | **`358.86`** | **`89.72`**（`[68.82, 114.89]`） |
| **`clai_kv260_axi_top`** · `idle_quiescent` | `256` | `0.00`（`0.0000`） | `0.00`（`0.0000`） | `0.0%`（`EN = 0`）/ `0%` | **`19.55`** | **`4.89`**（`[3.26, 6.66]`） |
| **`clai_kv260_axi_top`** · `steady_lut6_eval_2048_cycles` | `2,048` | `120.31`（`0.0011`） | `15.27`（`0.0008`） | `3.12%` 读 / `0%` | **`20.40`** | **`5.10`**（`[5.04, 5.18]`） |
| **`clai_kv260_axi_top`** · `single_cycle_page_switch_512_burst` | `512` | `325.21`（`0.0030`） | `25.56`（`0.0013`） | `11.13%` 读 / `0%` | **`22.07`** | **`5.52`**（`[5.34, 5.75]`） |
| **`clai_kv260_axi_top`** · `shadow_page_stream_write` | `512` | `31.95`（`0.0003`） | `71.92`（`0.0036`） | `0.0%` 读 / `8.20%` 写 | **`21.80`** | **`5.45`**（`[5.30, 5.64]`） |

基于 `VCD` 活动分解与 `DS925` 延迟模型，可直接得出以下三项硬件设计结论：

1. **无条件 `RAMB36E2` `ENARDEN` 空闲预充电（静态核心功耗的 `82.8%`）与 `4.50×` 的 `CE` 门控降幅**：虽然 `clai_benes_paged_hotswap_core` 在空闲时数据翻转率为 `0.00` 次/周期，但 `clai_uram_lut6_page_cache` 将全部 `81` 个 `RAMB36E2` 模块的 `ENARDEN` 持续绑定为 `1'b1`，导致位线预充电消耗 `200.07 est_pJ/cycle`（`50.02 est_mW`），同时 `FDRE` 时钟叶节点消耗 `41.59 est_pJ/cycle`（`10.40 est_mW`），静态合计为 **`60.41 est_mW`**。相比之下，`clai_kv260_axi_top` 中的 `clai_engram_streamer` 以 `accept_byte && s_axis_tlast` 对其 `4` 个 `RAMB36E2` 模块进行门控，空闲时功耗为 **`4.89 est_mW`**（`19.55 est_pJ/cycle`）；在持续进行 `31` 字节 `AXI4-Stream` 数据包推理时（`core_bus_reg` 每个数据包锁存一次，$\alpha_{\text{comb}} = 0.0011$），功耗为 **`5.10 est_mW`**。将 `clai_uram_lut6_page_cache` 的 `ENARDEN` 与 `bus_valid` 进行门控，可使分页核心的静态动态功耗降低 **`4.50×`**，降至 **`13.43 est_mW`**（`53.74 est_pJ/cycle`），且不引入任何延迟代价。
2. **Beneš 组合翻转放大（`2.48×`）与以 `RAMB36E2` 为主的有功功耗（`+5.1%`）对比**：在连续时钟周期内对全部 `512` 个槽位切换 `page_id`（`single_cycle_page_switch_512_burst`），会使 `81 × 64 = 5,184` 条 `LUT6` `INIT` 位线同时驱动选择器树，组合翻转由 `5,010.2` 次/周期升至 `12,406.8` 次/周期（即 `2.48×`，功耗由 `11.80` 增至 `29.22 est_pJ/cycle`）。然而，分页核心的动态总功耗仅增加 `+4.60 est_mW`（由 `90.42` 增至 `95.02 est_mW`，`+5.1%`）。原因在于 `81` 个 `RAMB36E2` 的灵敏放大器读出（`307.80 est_pJ/cycle`）在有功动态能量中占比为 `85.1%`-`80.9%`（并发执行 `shadow_page_stream_write` 时，有功动态能量为 `358.86 est_pJ/cycle`，功耗为 `89.72 est_mW`）。
3. **展平关键路径审计（`81` 与 `162` 级 `ltp`）及 `DS925` `-2LV` 解析级延迟预算**：依据 `AMD DS925`（`xck26-2LV`，`0.72 V`）的原语延迟（`T_ILO = 0.068 ns`，`T_CKO = 0.148 ns`；未流水化的 `RAMB36E2` `T_RCKO_DO = 1.390 ns`，对比 `DOA_REG = 1` 时的 `0.610 ns`；另加 `[0.140, 0.220] ns/level` 的互连延迟预算），未流水化的 `81` 级 `clai_benes_paged_hotswap_core` 路径延迟为 **`18.76-24.83 est_ns`**，对应解析估计的 `est_Fmax` 为 `40.3-53.3 MHz`。若跨模块边界展平 `clai_kv260_axi_top`（在 `-flatten` 之后执行 `ltp -noff`），则与第 4.15 节中各层级模块的 `73` 级相比，会暴露出一条 **`162` 级**路径（**`34.77-46.92 est_ns`**，`21.3-28.8 MHz`）。该路径从 `core_bus_reg` 经过 `clai_rung0_core`（`artifacts/clai_rung0_kv260.v`），并穿过其展开的 `64` 步串行 `pop_acc` 加法器链。若启用 `RAMB36E2` 的 `DOA_REG = 1`，插入 `4`-`5` 级流水线寄存器切分（每级 `<= 18` 个逻辑级），并将串行的 `64` 输入人口计数(popcount)循环替换为 `6` 级 `LUT6`/Wallace 压缩器，则每级解析延迟可降至 **`3.7 est_ns` 以下（在 `250 MHz` 下 `<= 4.000 ns`）**，CPI 为 `1.0`（此为解析结果，非 Vivado 布局布线后时序收敛结论）。

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. 相关工作与收敛性观察

| 系统 | ID / 场地 | 其确立内容 | 报告的成本 | 本参考文献中的差异 |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | 稀疏量化神经层编译为 FPGA LUT。 | FPGA LUT 和 Fmax 综合。 | 静态连线需要 Vivado 在移位时重新 PAR，而非 `1` 周期 Beneš + `RAMB36E2`。 |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | 可微分布尔门和无权重 LUT 网络。 | 门计数和准确率。 | 静态路由在 VLAN 移位时下降至 `52.34%`，并出现边缘位平面嵌合体。 |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | 通过 CPU/FPGA 表查找实现的三值 / 低比特矩阵乘积。 | 延迟和 FPGA 功耗。 | 在模型齿轮内加速线性代数；不绕过模型调用。 |
| **LittleBit** (Lee et al., 2025) & **LittleBit-2** (Lee and Kim, 2026) | `arXiv:2506.13771` · `arXiv:2603.00042` | 通过 `SVD` / `ITQ` + `5` 轮 QAT 实现的亚 1 比特 (`0.1-0.58` 比特/权重) 二值潜在因子分解。 | 压缩 (`11.6×-31×`)、PPL 和 QAT 准确率。 | 将位打包解包为稠密运行时二值 MAC 并在精确编码时下降至 `0.00%` (`Claim LA-11`)；`Sub1Bit-LUT6` 使用 `0` 个二值 MAC 且 `MoL` 在 `0` 个 QAT 轮次中恢复 `100.0%` 奇偶性。 |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | 弱到强 LLM 级联和偏好路由器。 | API 美元价格与质量。 | 缺少确定性 $C(z)$ 门 (`Claim LA-11` 中 `68.75%` 损坏提交) 且没有 `LUT6` 向下编译器。 |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | 多 LLM 赌博路由和频率缩放服务。 | 作者的 GPU Wh (`Zeus` / `pyNVML`)。 | 优化 GPU 服务；本参考文献将唤醒编译为 `0`-FLOP `LUT6` 和规范技能页 (`reported_j` / `est_j`)。 |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | 神经 MLP、草稿树和级联推测草稿器。 | 挂钟加速。 | 需要草稿 FLOP 和权重读取，而非 `0`-FLOP `uint64` `LUT6` 页。 |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | 零 FLOP 提示 n-gram 和数据存储后缀 trie 草稿器。 | 延迟加速 (`0` FLOP)。 | `PLD` 遗漏非提示令牌；`REST` 使用可变 trie 而非 `RAMB36E2` 页。 |
| **AirLLM** (lyogavin, 2023) | 开源 SSD 流式传输器 | 小 RAM 中逐层 SSD 权重流式传输。 | 活动 RAM 占用。 | 纯 `T=1` (`1.0 tok/sweep`) + KV 溢出，而非 `AirMoL` `2.74×-12.30×` I/O 减少和 `970 MB` Metal `INT4` RAM。 |
| **Metered Commit Gates** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | Commit 门 (`11,428 pJ` KV260 `INA260` SOM 读数)、MoL $p_i/c_i$ 和 `RCE-JEPA`。 | KV260 SOM `measured_j` + `reported_j` / `est_j`。 | 同屋基础；在此通过 Beneš `LUT6` 向下编译、Metal `Expert-AirMoL` 和 `mol-agent` 进行扩展。 |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. 局限、有效性威胁、未声明以及证伪者

**内部效度与构念效度。** 在均匀随机噪声或逐步对抗性扰动（$\Delta T = 1$）下，命题 1 给出的向下编译节省为零，并退化为 `1.00 tok/sweep`。无损一致性（`100.0%`）保证了与贪心目标解码逐位一致，但并不能提升 `350M` 或 `0.8B` 基础检查点的能力上限。

**测量有效性且未声明。** 分析焦耳数和开关功率数值（`est_j/VC`、`est_j/tok`、`est_mJ/Byte`，以及 §4.16 中 `Verilator` `VCD` + `AMD DS925` `0.72 V` 的 `est_pJ/cycle` 和 `est_mW` 界限），操作系统/片上计数器读数（来自 Apple Silicon `L2` `libIOReport` `'GPU Energy'` + `L3` `proc_pid_rusage` `ri_energy_nj`，以及 `Claim LA-11` 中记载的 `> 450 W` 窄寄存器翻转过滤器），以及整机 macOS `PMU` 累积增量，均与物理轨道测量（`measured_j = None`）严格分开。Yosys `0.71+` 和 Verilator `5.054` 确立了结构 `xck26` 网表综合、`CPI = 1` 周期仿真，以及 `VCD` 翻转率动态开关 `est_mW`（不含静态泄漏），而非 Vivado 后布局布线 `250 MHz` 时序收敛，也非物理 KV260 轨道瓦数（`board_metered = false`）。硅能效领先地位、将 `ModelGenerated` 输出提升为 `Deterministic`、超出 `48` 任务合同基准的完整 `500` 任务 `SWE-bench Verified` 容器评估（`Claim LA-11`）和 `16` 任务多文件 git 仓库 `SWE-Mini` `pytest` 基准（`Claim LA-13`），以及测量的 `70B` 运行（`air_mol_nvme_baselines.csv` 报告了超出测量的 `34.66B` `Qwen3.6-35B-A3B` 运行的分析 `70B` 投影），均未声明。

| 编号 | 主张 | 精确反驳 / 证伪条件 |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` 在 `5,120` 个数据包上未达到 `100.0%` Verilator 一致性，或遗漏第 `2,500` 号数据包处的 VLAN 偏移。 |
| **`LA-F2`** | `Claim LA-2` (多语言套件) | Zig 在热循环中分配了 `> 0` 字节堆内存，Go 报告 `> 0 allocs/op`，或 Julia Enzyme 的有限差分误差超过 `1e-7`。 |
| **`LA-F3`** | `Claim LA-3` (KV260 分页 RTL) | `scripts/verify_paged_bram_rtl.py` 超过 `117,120` 个 LUT、`144` 个 `RAMB36E2`、`0` 个 `DSP48`，或每次页切换耗时 `1` 个周期。 |
| **`LA-F4`** | `Claim LA-4` (共形 ACI) | `scripts/run_frontier_benchmarks.py` 在偏移流量上超过目标错误风险 $\alpha = 0.02$，或标记为 `Deterministic`。 |
| **`LA-F5`** | `Claim LA-5` (字节推测) | `scripts/run_code_corpus_benchmark.py` 在 `48` 个未见提示上，相对贪婪解码 `Mamba3CodeLM` 的精确字节一致性为 `< 100.0%`。 |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` 在 `F_NOCACHE` 下未达到 `100%` 一致性，或读取的 NVMe 字节数多于 `AirLLM` 4-Bit `T=1`。 |
| **`LA-F7`** | `Claim LA-7` (2026 年 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`、`scripts/run_hf_air_mol_pretrained.py` 或 `scripts/run_hf_qwen35_air_mol.py` 与贪婪目标相比偏离 $\ge 1$ 个 BPE token。 |
| **`LA-F8`** | `Claim LA-8` (回归套件) | `pytest -v` 在 `tests/` 的 `26` 个测试中任一失败。 |
| **`LA-F9`** | `Claim LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` 的 token 一致性偏离 `100%`，或读取的 NVMe 字节数多于 `AirLLM` 或 `Expert-AirLLM`。 |
| **`LA-F10`** | `Claim LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` 相对稠密 `ITQ` 二值矩阵乘法的最大误差超过 `1e-3`，或未通过 `100%` 已验证一致性。 |
| **`LA-F11`** | `Claim LA-11` (`48` 任务对比评测) | `scripts/run_frontier_ai_bakeoff.py` 接受了 `> 0%` 的损坏提交，或在 Wave-2 规格变异下接受了过时的 Wave-1 技能。 |
| **`LA-F12`** | `Claim LA-12` (Metal `INT4` MoE) | `scripts/run_metal_moe_benchmark.py` 的 `FP32` 着色器误差超过 `1e-4`，或在 `8.5B` 或 `35B` 上偏离 `100%` 贪婪 token 一致性。 |
| **`LA-F13`** | `Claim LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` 接受了 `> 0%` 的损坏补丁、修改了 `tests/`，或未能捕获 Wave-2 的 `R03` 规格变异。 |
| **`LA-F14`** | `Claim LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` 在 OpenAI REST/SSE、`MCP` `JSON-RPC 2.0`、`.mol/` 重载上失败，或写入了 `measured_j`。 |

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

在 [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) 的代码检出版本(提交 `af152ba`)中:

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
PYTHONPATH=src .venv/bin/python scripts/run_metal_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
PYTHONPATH=src .venv/bin/python scripts/run_repo_patch_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/mol_agent_server.py --host 127.0.0.1 --port 8090 --mol-dir .mol
```
