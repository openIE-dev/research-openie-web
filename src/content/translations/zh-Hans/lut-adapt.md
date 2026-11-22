---
title: "Mixture of Limits 级联中的向下 LUT6 编译：Beneš 路由布尔架构、共形唤醒门槛与 4 位 NVMe 按层流式传输"
deck: "一种四级 Mixture of Limits（极限混合）级联架构：首先尝试零浮点运算（FLOP）的分页 6 输入查找表（LUT6）电路，仅在未命中时唤醒 Mamba-3 以及通过 4 位非易失性内存主机控制器接口规范（NVMe）按层流式传输的 2026 年混合模型，并将经认证的唤醒结果向下编译至 Beneš 路由的 36 Kbit 块随机存取存储器（RAMB36E2）页面中。本文报告了来自 openIE-dev/lut-adapt-ai（提交 a5e9bc1）的挂钟时间、无缓冲 Darwin F_NOCACHE（无缓冲文件读取）字节计数、活跃随机存取存储器（RAM）占用，以及针对 xck26 的 Yosys/Verilator 寄存器传输级（RTL）仿真结果。所有能量数值均为解析 est_j 估计值；未进行电路板实测功耗测量。"
lang: "zh-Hans"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-4-bit-nvme-layer-streaming" class="anchor-alias" aria-hidden="true"></div>

*修订版 11dbc8c，2026 年 11 月 22 日。参考实现与制品：[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)（提交 [`a5e9bc1de280f973bc9051b4cc58942820a67eeb`](https://github.com/openIE-dev/lut-adapt-ai/tree/a5e9bc1de280f973bc9051b4cc58942820a67eeb)）。数据摘要：[/data/#lut-adapt](/data/#lut-adapt)。LaTeX PDF：[/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf)（[源码](/pdfs/latex/lut-adapt.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概述

本研究探讨计算系统如何在不损失精确输出一致性、也不将未经验证的猜测提升为可信规则的前提下，将重复出现的神经模型计算工作向下编译为高速布尔查找表查询。本文报告了软件实测指标、寄存器传输级（RTL）综合与周期级仿真结果，以及带明确标签的解析能量估计值（`est_j`）。本代码仓库未连接墙插或供电轨焦耳计（`measured_j` 未设置；`board_metered` 为 false）。

**通俗解释**

1. 已部署系统所见到的大多数输入都在重复其已经解决过的模式，因此在每一步都运行完整的浮点神经网络会浪费算力与内存带宽。
2. 本参考架构在流式状态空间模型与基础模型之前部署了一个可重构的 6 输入真值表（`LUT6`）查找层，并且仅在显式检查对答案予以认证之后，才将其向下编译至查找内存页面中。
3. 当 2026 年的混合语言模型从固态硬盘逐层流式读取权重时，这一零浮点运算（零 FLOP）的 `LUT6` 草稿提议器会提出多词元突发序列，由目标模型在单次磁盘扫描中完成验证，从而在不改变任何输出词元的前提下将磁盘读取量削减近 `3×`。

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语、缩略语与测量标签

<ul id="terms">
<li>MoL: Mixture of Limits（极限混合），源自《计量提交门槛》第二部分的级联规则 [same house]</li>
<li>LA: 本研究中使用的主张与证伪条件前缀（LA-1 至 LA-8，LA-F1 至 LA-F8）</li>
<li>LUT, LUT6, INIT: 查找表、6 输入 Xilinx UltraScale+ 布尔原语及其 64 位真值表初始化掩码</li>
<li>BRAM, RAMB36E2, URAM: 块随机存取存储器（Block RAM）、36 Kbit 双端口 UltraScale+ 块 RAM 原语（xck26 上共有 144 个）以及 UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: 可配置逻辑块、触发器、数字信号处理切片，以及 AMD Kria KV260 开发板（xck26）</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: 现场可编程门阵列、专用集成电路、寄存器传输级、每次查找周期数、布局布线、最差负裕量，以及现场可编程逻辑国际会议（Field-Programmable Logic conference）</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML: 高级可扩展接口、Zynq 处理系统、可编程逻辑、核心板模块（System-on-Module）、板载功耗监测芯片、供电轨、Intel 运行平均功耗限制，以及 NVIDIA 管理库</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: 状态空间对偶（State Space Duality）、状态空间模型、多输入多输出、旋转位置编码、门控线性单元激活函数、分组查询注意力、键值缓存、字节对编码、大语言模型、混合专家模型、多层感知机，以及上下文无关文法</li>
<li>HC, SOINN, WNN, DWN: 层级上下文自组织增量神经网络（hierarchy-context Self-Organizing Incremental Neural Network）、无权重神经网络，以及可微无权重神经网络（Differentiable Weightless Neural Network）</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: 联合嵌入预测架构、基于能量的推理模型、自适应共形推理（Adaptive Conformal Inference）、分布外、受试者工作特征曲线下面积、最大 softmax 概率，以及蒙特卡洛（Monte Carlo）</li>
<li>PLD, REST, EAGLE, LFM2, HF: 提示词查找解码（Prompt Lookup Decoding）、基于检索的投机解码、面向更高语言模型效率的外推算法、Liquid 基础模型 2.5（LiquidAI/LFM2.5-350M），以及 HuggingFace</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB: 非易失性内存主机控制器接口规范存储、Darwin F_NOCACHE 无缓冲文件标志、可移植操作系统接口、随机存取存储器、动态 RAM、静态 RAM、输入/输出、千字节、兆字节与吉字节</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, SIMD, AD, FD, BPB, FP16, FP32, INT4: 浮点运算、百万次浮点运算、乘累加运算、单指令多数据流、自动微分、有限差分、每字节比特数、16/32 位浮点数，以及 4 位整数</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house]、Wise Computer Automation [same house]、经验证的完成（verified completion），以及软件工程基准测试前缀</li>
<li>CLI, HTTP, SSE, API, ACL, OS, CPU, GPU, SW: 命令行界面、超文本传输协议、服务器发送事件、应用程序编程接口、计算语言学协会、操作系统、中央/图形处理器，以及软件</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CAM, XNOR: 虚拟局域网（IEEE 802.1Q）、传输层安全协议、深度包检测、抽象语法树、JavaScript 对象表示法、逗号分隔值、安全哈希算法、内容可寻址存储器，以及同或门（exclusive-NOR）</li>
</ul>

在下文所有表格中，三类证据始终严格区分：

| 证据标签 | 本研究中的含义 |
| :--- | :--- |
| **`Measured (SW / NVMe I/O)`** | 在 Darwin `F_NOCACHE` 标志下通过 `os.pread` 读取或写入的精确字节计数、常驻内存分配量、Apple M5 Max 上的挂钟秒数，以及精确的比特/词元一致性。`measured_j` 未设置（`None`）。 |
| **`Simulated (RTL)`** | 来自 Yosys `0.71+`（采用 `synth_xilinx -family xcup`，目标器件为 Kria KV260 `xck26`）的结构网表资源计数，以及来自 Verilator `5.054` 的周期计数（`CPI = 1`）。并非 Vivado 时序收敛结果，亦非电路板实测功耗（`board_metered = false`）。 |
| **`Estimated (est_j)`** | 根据运算次数或热设计功耗（TDP）时间替代量计算出的解析焦耳值（当 macOS 上缺少 `RAPL`/`NVML` 硬件计数器时由 `joule_meter.py` 回退计算得出）。仅可在同一公式内部的各实验组之间进行相对比较，绝不等同于硅片实测瓦特数。 |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 架构背景与贡献概述

在 [计量提交门槛](/papers/gates/) `[same house]` 中，第二部分定义了 **Mixture of Limits（极限混合）**：按每焦耳通过概率 $p_i / c_i$ 的非递增顺序依次尝试各个档位（Simon and Kadane, 1975），一旦任务完成性谓词 $C(z) = 1$ 成立便立即停止，并严禁将 `ModelGenerated` 输出强化为 `Deterministic`。然而，静态查找层只能覆盖部署前预先写入其中的条目。反过来，现有的查找表神经网络，包括 LogicNets（Umuroglu et al., 2020）、DiffLogic（Petersen et al., 2022）以及可微无权重神经网络（Bacellar et al., 2024），都将连线拓扑固定在静态 FPGA 路由内部，每当输入分布发生偏移时，就必须重新运行厂商的布局布线流程。

`lut-adapt-ai` 参考实现通过**在线向下 `LUT6` 编译**闭合了级联顶部与底部之间的回路：

- **第 0 级（查找层 - 分页 Beneš + `LUT6`）**：对通过无阻塞 $512 \times 512$ **Beneš-Copy-Beneš** 多播交换网络路由、并缓存在 $81 \times \texttt{RAMB36E2}$ 双端口块存储器中的 64 位真值表掩码进行求值（`0` 次浮点运算，在 Verilator 仿真中实现单周期页面切换）。
- **第 1 级（流式层 - `Mamba-3` 复数 MIMO 状态空间对偶）**：利用恒定大小 $O(1)$ 的循环状态（在 `14.3M` 参数参考模型中占用 `48 KB` 锁定内存）处理依赖序列历史的未命中情形，从而避免 $O(L)$ 键值缓存膨胀。
- **第 2 级（拓扑层 - `HC-SOINN`）**：在潜在嵌入空间上维护在线原型拓扑，隔离分布状态边界，并在无标签分布偏移到来时触发断路器（`Refuse` 拒绝或向上升级）。
- **第 3 级（兜底模型层 - `JEPA-EBRM` 与 `AirMoL` 4 位 NVMe 流式传输）**：仅当更低成本的各级弃权或需要精确目标验证时，才调用潜空间能量验证器或按层流式传输的 2026 预训练基础模型（`LiquidAI/LFM2.5-350M` 与 `Qwen/Qwen3.5-0.8B-Base`）。
- **向下 `SleepCrystallizer`（睡眠结晶器）**：利用 Walsh-Hadamard 谱热启动、联合众数最小项真值表以及 Waksman 交换调度提取反复出现的唤醒轨迹，在不中断推理且无需运行 FPGA 布局布线的情况下翻转影子块存储体（shadow BRAM banks）。

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 主要贡献

1. **摊销向下编译条件**：将平稳时间跨度 $\Delta T$ 内的显式编译能耗 $E_{\text{compile}}$ 引入 Simon-Kadane 的 $p_i/c_i$ 档位排序准则。
2. **无阻塞 $512 \times 512$ Beneš-Copy-Beneš 与 `81`-`RAMB36E2` RTL 架构**：既消除了扁平交叉开关在 Kria KV260 上的 `102.0%` 逻辑资源溢出（`119,478` 个 LUT），也避免了触发器页面多路复用器高达 `926,619` 个 LUT 的面积爆炸；综合结果为 `41,186` 个 UltraScale+ CLB LUT（占 `xck26` 的 `35.2%`）、`81` 个 `RAMB36E2` 块（占 `56.2%`）以及 `0` 个 `DSP48` 切片，并在仿真中实现 `1` 周期（标称 `250 MHz` 下为 `4.0 ns`）页面切换。
3. **通用 $\le 64$ 位联合众数最小项综合**：证明在相关分支上联合众数最小项查找严格优于边缘位平面 DiffLogic 舍入，并将 $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ 个子词词元紧凑打包进单个 `uint64` 字中（当 `|V| = 65,536` 时为 `16b × 4 = 64b`；当 `|V| = 248,320` 时为 `18b × 3 = 54b`）。
4. **无神谕拆分共形 + 在线 ACI 结晶门槛**：将径向正则化的潜空间 `JEPA-EBRM` 非一致性得分与拆分共形校准及自适应共形推理（Gibbs and Candès, 2021）相结合，在偏移流量上录得 `0.00%` 误结晶风险与 `1.0000` OOD AUROC，而相同条件下 softmax 与 MC-Dropout 基线的误结晶风险高达 `17.62%-24.28%`。
5. **面向 2026 混合模型的 `AirMoL` 零额外扫描 4 位 NVMe 流式传输**：在 `LiquidAI/LFM2.5-350M`（2026 年 3 月）与 `Qwen/Qwen3.5-0.8B-Base`（2026 年 2 月）上，将基于 Darwin `F_NOCACHE` `os.pread` 的 4 位分组量化按层流式读取、RAM 内混合状态回滚以及在线词元级 `LUT6` 突发投机相结合，在保持 `100.0%` 精确词元一致性以及活跃权重 RAM 仅为 FP32 模型大小 `8.45%-9.47%` 的同时，将 NVMe 磁盘读取量分别削减 `2.86×` 与 `2.74×`。
6. **多语言系统实现套件与实时 HTTP/SSE 服务器**：跨越 Python/PyTorch/Triton、Rust `Burn 0.22.1 / CubeCL` Metal、Zig `0.17.1`、Go `1.27.4` SIMD、Julia `1.13.4` Enzyme 以及 `mol_code_cli.py` 对整套级联进行了交叉验证。

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

## 3. 参考架构、多语言实现套件与 KV260 RTL

图 1 展示了 `src/clai/` 中的四级级联结构以及向下的 `SleepCrystallizer` 闭环。

![图 1. 四级 Mixture of Limits 级联中的向下编译架构。](/figures/lut-adapt/mol-downward-cascade.svg)

*图 1. 四级 Mixture of Limits 级联中的向下编译架构。此图为架构设计图，并非电路板功耗实测图。[PNG](/figures/lut-adapt/mol-downward-cascade.png) · [交互式浏览器](/living/lut-adapt/#la-diag-01)。*

`openIE-dev/lut-adapt-ai` 中的五套系统级实现对该级联进行了交叉核验：Python/PyTorch/Triton（`src/clai/`）、Rust `Burn 0.22.1 / CubeCL` Metal（`sys/rust/`）、Zig `0.17.1`（`sys/zig/`）、Go `1.27.4` SIMD（`sys/go/`）以及 Julia `1.13.4` Enzyme（`sys/julia/`）。

图 2 展示了 `hw/kv260/rtl/clai_benes_hotswap_core.sv` 中面向 Kria KV260（`xck26`）的 RTL 数据通路：它将 `512` 个常驻 `LUT6` 页面（每页含 `5,120` 个 `INIT` 位、`48` 位上下文标签以及有效位）映射至 `81` 块并行的 `RAMB36E2` 双端口存储器上，以实现单周期（标称 `250 MHz` 下为 `4.0 ns`，`CPI = 1.0`）上下文页面切换。

![图 2. Beneš-Copy-Beneš 多播网络与单周期 BRAM LUT6 页面缓存。](/figures/lut-adapt/benes-paged-silicon.svg)

*图 2. 在 Yosys `0.71+` 与 Verilator `5.054` 仿真（`board_metered = false`）中面向 AMD Kria KV260（`xck26`）的 `512×512` Beneš-Copy-Beneš 多播交换网络与 `81 × RAMB36E2` 单周期 `LUT6` 页面缓存。[PNG](/figures/lut-adapt/benes-paged-silicon.png) · [交互式浏览器](/living/lut-adapt/#la-diag-02)。*

图 3 展示了 `AirMoL`（位于 `src/clai/frontier/air_mol_streamer.py` 与 `hf_air_mol_pretrained.py`）：它通过 Darwin `F_NOCACHE` `os.pread` 流式读取 4 位分组量化权重分片，在单次全层扫描中并行验证 `[last_tok, d_1..d_K]`，并在 RAM 中为紧凑混合状态（`Short-Conv/SSM` 或 `Gated DeltaNet` 外加稀疏的 `6` 层 `GQA` KV 裁剪缓存）保存快照，从而在部分草稿词元被拒绝时实现**零额外 NVMe 扫描**。

![图 3. 结合通用 64 位词元 LUT6 投机的 AirMoL 4 位 NVMe 按层流式传输。](/figures/lut-adapt/airmol-nvme-speculation.svg)

*图 3. 在 `LiquidAI/LFM2.5-350M` 与 `Qwen/Qwen3.5-0.8B-Base` 上结合通用 `≤64` 位词元 `LUT6` 投机的 `AirMoL` 零额外扫描 4 位 NVMe 按层流式传输。[PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [交互式浏览器](/living/lut-adapt/#la-run-01)。*

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

<div id="47-claim-la-7-pretrained-2026-hybrid-models-under-airmol-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 主张 LA-7：`AirMoL` 下的 2026 预训练混合模型（`LFM2.5-350M` 与 `Qwen3.5-0.8B-Base`）

| 2026 模型检查点与实验组 | 一致性 | 每次扫描词元数 | 每次扫描字符数 | 扫描次数 | NVMe 读取量 | 峰值活跃 RAM（占 `FP32` 比例） | `tok/s` | 证据类别 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | 实测（`F_NOCACHE`） |
| `LFM2.5-350M` · `AirLLM` 4 位 (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | 实测（`F_NOCACHE`） |
| `LFM2.5-350M` · `AirLLM` 4 位 + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | 实测（`F_NOCACHE`） |
| **`LFM2.5-350M` · `AirMoL` 冷启动 `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **实测（`F_NOCACHE`）** |
| **`LFM2.5-350M` · `AirMoL` 唤醒后结晶** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **实测（`F_NOCACHE`）** |
| `Qwen3.5-0.8B` · `AirLLM` 4 位 (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | 实测（`F_NOCACHE`） |
| `Qwen3.5-0.8B` · `AirLLM` 4 位 + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | 实测（`F_NOCACHE`） |
| **`Qwen3.5-0.8B` · `AirMoL` 冷启动 `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **实测（`F_NOCACHE`）** |
| **`Qwen3.5-0.8B` · `AirMoL` 唤醒后结晶** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **实测（`F_NOCACHE`）** |

值得注意的是一处如实保留的性能权衡：在 `Qwen3.5-0.8B-Base` 处理冷启动未见提示词时，`AirMoL` 虽然将 NVMe 磁盘读取量从 `12.674 GB` 降至 `8.581 GB`，但由于 CPU 上 Gated DeltaNet 对 `4` 个候选词元执行批量验证的计算开销，挂钟吞吐率暂时下降（`0.32` 对比 `0.53 tok/s`）；直至在线唤醒向 `LUT6` 的向下结晶将每轮接受率提升至 `2.74 tok/sweep`（读取量降至 `4.621 GB`，吞吐率升至 `1.11 tok/s`）。

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 主张 LA-8：实时 CLI 与 HTTP/SSE 流式服务器（`mol_code_cli.py`）

`scripts/mol_code_cli.py` 通过命令行与 SSE 端点（`/v1/health`、`/v1/complete`、`/v1/crystallize`）提供 `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b}` 与 `--air-nvme` 服务，在实时运行中将 `RAMB36E2` 槽位驻留数从 `438/512` 推进至 `460/512`，且全部 `18/18` 个 `pytest` 测试套件均顺利通过。

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. 相关工作与收敛性观察

| 系统名称 | 编号 / 发表会议 | 已确立的核心机制 | 原文报告的代价指标 | 与本参考架构的差异 |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | 将稀疏量化神经网络层编译进 FPGA LUT。 | FPGA LUT 数量与最高工作频率（Fmax）综合结果。 | 静态连线在分布偏移时需重新运行 Vivado PAR，而本文采用 `1` 周期 Beneš + `RAMB36E2` 切换。 |
| **DiffLogic** (Petersen et al., 2022) 与 **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | 可微布尔逻辑门网络与无权重 LUT 网络。 | 逻辑门计数与分类准确率。 | 静态路由在 VLAN 偏移下准确率跌至 `52.34%`，且存在边缘位平面嵌合体问题。 |
| **T-MAC** (Wei et al., 2024) 与 **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | 在 CPU/FPGA 上通过查找表加速三值/低比特矩阵乘法。 | 推理延迟与 FPGA 功耗。 | 仅加速模型档位内部的线性代数运算，无法旁路模型调用本身。 |
| **FrugalGPT** (Chen et al., 2023) 与 **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | 由弱到强的 LLM 级联与偏好路由器。 | API 美元开销与生成质量权衡。 | 仅限模型到模型的路由，没有 `LUT6` 查找底层，也不具备向下编译能力。 |
| **GreenServ** (2026) 与 **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | 多 LLM 多臂赌博机路由与动态调频推理服务。 | 原作者报告的 GPU 瓦时数（`Zeus` / `pyNVML`）。 | 优化的是 GPU 在线服务功耗；本参考架构则将唤醒结果编译为 `0`-FLOP 的 `LUT6` 页面（`est_j`）。 |
| **Medusa** (2024)、**EAGLE-2** (2024)、**HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | 基于神经 MLP、动态草稿树与级联结构的投机草稿器。 | 挂钟时间加速比。 | 需要额外的草稿模型 FLOPs 与权重读取，而本文使用 `0`-FLOP 的 `uint64` `LUT6` 页面。 |
| **PLD** (Saxena, 2023) 与 **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | 零 FLOP 的提示词 n-gram 查找与语料库后缀字典树草稿器。 | 延迟加速比（`0` FLOPs）。 | `PLD` 无法命中提示词之外的词元；`REST` 遍历变长字典树，而本文使用固定周期 `RAMB36E2` 页面。 |
| **AirLLM** (lyogavin, 2023) | 开源 SSD 流式推理框架 | 在极小 RAM 占用下从 SSD 逐层流式加载权重。 | 活跃 RAM 内存占用。 | 纯 `T=1`（`1.0 tok/sweep`）加 KV 落盘溢出，而 `AirMoL` 实现了 `2.74×-2.86×` 的扫描次数削减。 |
| **计量提交门槛** 与 **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | 提交门槛（KV260 `INA260` 核心板 `11,428 pJ` 读数）、MoL $p_i/c_i$ 排序与 `RCE-JEPA`。 | KV260 SOM `measured_j` + `est_j`。 | 同源研究基石；本文在此基础上扩展了 Beneš `LUT6` 向下编译与 `AirMoL`。 |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. 局限性、效度威胁、未主张事项与证伪条件

**内部效度与构念效度。** 在均匀随机噪声或每步对抗性剧烈抖动（$\Delta T = 1$）下，由命题 1 可知向下编译的净能量节省为零，系统将回退至 `1.00 tok/sweep`。无损一致性（`100.0%`）保证输出结果与目标模型贪心解码保持逐比特完全一致，但并不会提高 `350M` 或 `0.8B` 基座模型本身的能力上限。

**测量效度与未主张事项。** 本研究中的每一个焦耳数值均为解析 `est_j` 估计值（`measured_j = None`）。Yosys `0.71+` 与 Verilator `5.054` 确立的是面向 `xck26` 的结构网表综合与 `CPI = 1` 周期级功能仿真，并非 Vivado 布局布线后在 `250 MHz` 下的时序收敛，亦非物理 KV260 供电轨上的实测瓦特数（`board_metered = false`）。本文不主张硅片级实测能效领先地位，不主张将 `ModelGenerated` 输出提升为 `Deterministic`，也不主张已完成 `70B` 模型的实测运行（`air_mol_nvme_baselines.csv` 中仅报告了 `70B` 规模的解析推算值）。

| 编号 | 对应主张 | 精确反证 / 证伪条件 |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1`（`.pcap` + RTL） | `scripts/run_realworld_domain.py` 在全部 `5,120` 个数据包上未能达到 `100.0%` Verilator 一致性，或漏检第 `2,500` 个数据包处的 VLAN 偏移。 |
| **`LA-F2`** | `Claim LA-2`（多语言套件） | Zig 在热循环中分配了 `> 0` 字节堆内存，Go 报告 `> 0 allocs/op`，或 Julia Enzyme 相对于有限差分的梯度误差超过 `1e-7`。 |
| **`LA-F3`** | `Claim LA-3`（KV260 分页 RTL） | `scripts/verify_paged_bram_rtl.py` 超出 `117,120` 个 LUT、`144` 个 `RAMB36E2`、`0` 个 `DSP48`，或每次页面切换超过 `1` 个时钟周期。 |
| **`LA-F4`** | `Claim LA-4`（共形 ACI） | `scripts/run_frontier_benchmarks.py` 在偏移流量上的误结晶风险超过目标水平 $\alpha = 0.02$，或错误打上 `Deterministic` 标签。 |
| **`LA-F5`** | `Claim LA-5`（字节级投机） | `scripts/run_code_corpus_benchmark.py` 在 `48` 条未见提示词上相对于贪心 `Mamba3CodeLM` 的精确字节一致性低于 `100.0%`。 |
| **`LA-F6`** | `Claim LA-6`（`AirMoL` 14.3M） | 在 `F_NOCACHE` 下运行的 `scripts/run_air_mol_benchmark.py` 未能保持 `100%` 一致性，或读取的 NVMe 字节数多于 `AirLLM` 4 位 `T=1` 基线。 |
| **`LA-F7`** | `Claim LA-7`（2026 HF `AirMoL`） | `scripts/run_hf_air_mol_pretrained.py` 或 `scripts/run_hf_qwen35_air_mol.py` 的输出与目标模型贪心解码出现 $\ge 1$ 个 BPE 词元的偏差。 |
| **`LA-F8`** | `Claim LA-8`（回归测试套件） | `pytest -v` 在 `tests/` 目录下的 `18` 个测试套件中有任意一项失败。 |

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

## 附录 A. 可复现性

在检出 [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)（`commit a5e9bc1`）的源码目录后，运行以下命令：

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
