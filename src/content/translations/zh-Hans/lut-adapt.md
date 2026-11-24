---
title: "Mixture of Limits 级联中的向下 LUT6 编译：Beneš 路由布尔架构、共形唤醒门槛与前沿稀疏 MoE NVMe 按层流式传输"
deck: "一种附带 58 条经六内核验证的 Lean 4.36.0 定理及 Inria Charon+Aeneas 无标准库 Rust 至 Lean 机械化提取（另加 Linux bubblewrap 沙箱内四个 Open Interface Engineering 仓库共 1,422 条定理，针对 CVE-2026-72844 加固）的 Mixture of Limits 级联：首先尝试零浮点运算（FLOP）的分页式 6 输入查找表（LUT6）电路、15.31 千字节的 WebAssembly（WASM）浏览器模块、带反对称 40 项零乘法 T-MAC 三值尾部的无标准库 4 千字节 Rust lut6-core Nucleus、占 64 千字节智能手表 SRAM 仅 9.13%（5,984 字节）且零前缀污染的 56 比特 4 词元 Wearable-MoL 智能眼镜开场门控，以及（72, 64）SECDED 宇宙射线位翻转防护（在单二进制 Rust mol-agent-rs 中耗时 0.154 毫秒，每次位切片决策耗能 162.71 纳焦，在 1% 误码率下保持 100.0% 存活率），经亚十亿级可穿戴微型语言模型（Sensente/uLM-28M 与 LiquidAI/LFM2.5-230M）并跨四大 GPU 硅片厂商（最高加速 328.06x，将 LastExam 协议均方根校准误差从 70.62% 削减 5.37x 至 13.14%，且 >= 80% 置信度下的自信幻觉率降至 0.00%）逐级升级至最高 120B 参数的 4 位 NVMe 循环、混合与稀疏 MoE 2026 年末模型，通过跨 4 个上游 Verified 仓库的确定性验证器对提交进行门控，并将经认证的唤醒向下编译为 RAMB36E2、免许可 openXC7 320.62 兆赫布局布线后 Artix-7 XC7A200T M.2 2280 .bit 比特流，以及 Lupanov 共享余因子与摆动密码子晶体页。包含 Jetson AGX Thor 上的物理 Texas Instruments 直流分流器实测能量 measured_j（位切片 lut6-core 降低 87.25x、可穿戴 56 比特认知门控相对 uLM-28M 层切片降低 222.57x、反对称 40 项 T-MAC 降低 1.65x［Zen 5 上反超达 1.12x］、Sub1Bit-LUT6 降低 3.74x、Expert-AirMoL 降低 34.21x、命题 1 编译降低 10.94x；board_metered 为真），并与实时连接的 Alif Cortex-M55 周期计数（可穿戴门控快 2,745.18x）、五主机片上 reported_j、openXC7 静态时序以及提交 dc45357 处的 RTL 仿真估计值 est_j 严格区分。"
lang: "zh-Hans"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*修订 dc45357，2026年11月24日。参考实现和工件：[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) 于 [`dc45357edd95399ec956e17d185ee475cd27639e`](https://github.com/openIE-dev/lut-adapt-ai/tree/dc45357edd95399ec956e17d185ee475cd27639e)。数据摘要：[/data/#lut-adapt](/data/#lut-adapt)。LaTeX PDF：[/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf)（[源文件](/pdfs/latex/lut-adapt.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概述

本研究考察计算系统如何将重复的神经模型计算向下编译为快速布尔表查找与经认证的规范技能，同时不损失精确输出一致性，也不将未经验证的猜测提升为可信规则。四类证据在全部主张中严格区分：板级物理 Texas Instruments 电流分流器焦耳读数（`measured_j`，仅在 §4.26 与 §4.30 的 Tegra `aarch64` Jetson Thor 上 `board_metered = true`）、操作系统与片上硬件能量计数器外加裸机微控制器硬件周期计数器（跨五台 Linux、macOS 与 Windows 11 工作站的 `reported_j` 以及实时连接的 Alif Ensemble Cortex-M55 周期计数，`board_metered = false`）、寄存器传输级综合与穷举布尔 miter 等价检验及周期仿真（`xck26` 与 7-Series `XC7A200T`，所有现场可编程门阵列主张的 `board_metered = false`），以及显式标注的解析能量与电热包络估计（`est_j`）。

**用通俗的话**

1. 已部署系统遇到的绝大多数输入都在重复此前已解决过的模式，因此每一步都运行完整的浮点神经网络会浪费算力与内存带宽。
2. 参考架构在流式状态空间、循环（looped）和基础模型之前放置一个可重构的 6 输入真值表（`LUT6`）查找层以及一个 4 千字节裸机 Rust `lut6-core` Nucleus（可装入 `64` 千字节微控制器 SRAM 的 `25.06%`，或装入 M.2 `2280` `XC7A200T` 加速卡的 `365` 块片上块存储器），且仅在显式检查完成认证后才将答案向下编译进查找内存页。
3. 当参数规模最高达 `120B`（`12B` 活跃参数，另含 2026 年 10-11 月发布的循环模型 `thinkingmachines/Inkling-2-Mini` 与 `Nemotron-Labs-Dory1.0-4B`）的 2026 年末循环、混合与稀疏混合专家语言模型通过定制融合 Apple Metal 着色器、可移植 Rust `Burn 0.22.1 / CubeCL` 着色器以及单二进制文件 Rust `mol-agent-rs`（每次技能查找 `0.154` 毫秒）在 Apple Silicon 本地运行时，路由器稀疏专家读取配合零 FLOP `LUT6` 起草器可在 `Qwen/Qwen3.6-35B-A3B`（`970.0` 兆字节活跃权重内存）上将磁盘读取削减最高 `12.30×`，将循环深度递归前向传递次数削减 `4.00×`（在 `100%` 贪心一致性下实测加速 `3.52×-3.95×`），并在 `58.08` 吉字节统一内存内使 `nvidia/Nemotron-3-Super-120B-A12B` 维持每秒 `22.17` 个词元；将代码与仓库提交置于确定性 `unittest` 和 `pytest` 检查之后进行门控，可在 `48` 任务算法对比评测中达到 **`91.67%` 已验证通过率（Wave 2 与 Wave 3 达 `93.75%`）**，在官方 `BigCodeBench v0.1.3` 上达到 **`90.62%`（Wave 2 人工改写提示上达 `93.75%`）**，在单仓库 `SymPy` git 工作树上达到 **`50.00%`**，在 `4` 个上游 `princeton-nlp` Verified 仓库（`django`、`pytest`、`requests` 与 `sympy`）上达到 **`20.83%`（为独立运行 `24B` 与 `35B` 模型的 `2.50×`）**，并在 `120B` 高难度前沿套件上达到 **`62.50%`**，同时**准入的破损提交为 `0.00%`**。

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语、首字母缩略词和测量标签

<ul id="terms">
<li>MoL: Mixture of Limits，即 Metered Commit Gates 第二部分中的级联规则 [同系列]</li>
<li>LA: 本研究使用的主张与证伪前缀（LA-1 至 LA-35，LA-F1 至 LA-F35）</li>
<li>LUT, LUT6, INIT: 查找表（look-up table）、6 输入 Xilinx UltraScale+ 布尔原语，以及其 64 位真值表初始化掩码</li>
<li>BRAM, RAMB36E2, URAM: 块随机存储器（Block RAM）、36 Kbit 双端口 UltraScale+ 块 RAM 原语（xck26 上为 144 个），以及 UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: 可配置逻辑块（configurable logic block）、触发器（flip-flop）、数字信号处理片（digital signal processing slice）、DSP48 原语，以及 AMD Kria KV260 开发板（xck26）</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: 现场可编程门阵列（field-programmable gate array）、专用集成电路（application-specific integrated circuit）、寄存器传输级（register-transfer level）、每次查找周期数（cycles per lookup）、布局布线（place-and-route）、最差负时序裕量（worst negative slack），以及现场可编程逻辑会议（Field-Programmable Logic conference）</li>
<li>AXI, AXIS, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU, SMC, L1, L2, L3: 高级可扩展接口、AXI4-Stream 包装器前缀、Zynq 处理系统、可编程逻辑、系统级模块、板载功率监测芯片、供电轨、Intel Running Average Power Limit、NVIDIA 管理库、macOS 电源管理单元、Apple 系统管理控制器、一级整板电压输入轨、二级子系统能耗计数器（Apple IOReport GPU Energy 与 Tegra 电源轨分流器），以及三级单进程 CPU 能耗计数器（Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj）</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: 状态空间对偶（State Space Duality）、状态空间模型（state-space model）、多输入多输出（multiple-input multiple-output）、旋转位置编码（rotary position embedding）、门控线性单元激活（gated linear unit activation）、分组查询注意力（grouped-query attention）、键值缓存（key-value cache）、字节对编码（byte-pair encoding）、大语言模型（large language model）、混合专家模型（Mixture-of-Experts）、多层感知机（multilayer perceptron），以及上下文无关文法（context-free grammar）</li>
<li>HC, SOINN, WNN, DWN: 层级上下文自组织增量神经网络（hierarchy-context Self-Organizing Incremental Neural Network）、无权重神经网络（weightless neural network），以及可微无权重神经网络（Differentiable Weightless Neural Network）</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: 联合嵌入预测架构（Joint-Embedding Predictive Architecture）、基于能量的推理模型（Energy-Based Reasoning Model）、自适应共形推断（Adaptive Conformal Inference）、分布外（out-of-distribution）、接收者操作特征曲线下面积（area under the receiver operating characteristic）、曲线下面积（area under the curve）、最大 softmax 概率（maximum softmax probability），以及蒙特卡洛（Monte Carlo）</li>
<li>PLD, REST, EAGLE, LFM2, LFM3, HF: 提示查找解码（Prompt Lookup Decoding）、基于检索的投机解码（Retrieval-Based Speculative Decoding）、面向更高语言模型效率的外推算法（Extrapolation Algorithm for Greater Language-model Efficiency）、Liquid Foundation Model 2.5（LFM2.5-350M 与 LFM2.5-8B-A1B）、Liquid Foundation Model 3（2026 年 10 月发布的 LiquidAI/LFM3-1.7B），以及 HuggingFace</li>
<li>SVD, ITQ, SVID, QAT, PTQ, PPL, SNR: 奇异值分解（singular value decomposition）、超立方体旋转的迭代量化 Procrustes 方法（Iterative Quantization Procrustes hypercube rotation）、符号值独立分解（sign-value-independent decomposition）、量化感知训练（quantization-aware training）、训练后量化（post-training quantization）、困惑度（perplexity），以及信噪比（signal-to-noise ratio）</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, RSS, GGUF, IO, KB, MB, GB, GiB: 非易失性存储器快速访问（NVMe）存储、Darwin F_NOCACHE 非缓冲文件标志、可移植操作系统接口（POSIX）、随机存取存储器（RAM）、动态随机存取存储器（DRAM）、静态随机存取存储器（SRAM）、物理统一内存中的常驻集大小（RSS）、GPT 生成统一格式（GGUF）量化模型文件、输入/输出（IO）、千字节（KB）、兆字节（MB）、吉字节（GB）和吉比字节（GiB）</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, BF16, FP16, FP32, INT4, ULP, MSL, MPS, CUDA, ROC, SPIR, PTX, HIP, LLVM: 浮点运算、百万浮点运算、乘累加运算、单指令多数据、自动微分、有限差分、每字节位数、脑浮点 16、16/32 位 IEEE 浮点数、4 位整数、末位单位、Apple Metal 着色语言、PyTorch Metal 性能着色器、NVIDIA 统一计算设备架构、AMD ROCm 运行时、标准可移植中间表示（Vulkan SPIR-V）、并行线程执行、可移植异构计算接口，以及底层虚拟机编译器后端</li>
<li>RCE, WCA, VC, BCB, SWE, OSA, DP: Reality Code Engine [same house]、Wise Computer Automation [same house]、已验证完成、BigCodeBench v0.1.3 基准测试、软件工程基准测试前缀、最优字符串对齐，以及动态规划</li>
<li>CLI, HTTP, GET, POST, SSE, API, MCP, RPC, IDE, SDK, CORS, URL, ORM, IDNA, CADE, LNCS, NVIDIA, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW, TDP: 命令行界面、超文本传输协议及其 GET/POST 请求方法、服务器发送事件、应用程序编程接口、模型上下文协议、远程过程调用（JSON-RPC 2.0）、集成开发环境、软件开发工具包、跨源资源共享、统一资源定位符、对象关系映射器、应用程序中的国际化域名、自动演绎会议、计算机科学讲义、NVIDIA 公司、学术计算机科学/工程会议、操作系统、中央/图形处理器、软件和热设计功耗</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XOR, XNOR, JWT, HMAC, DAG, CIDR, LRU, TTL, WAL, ETL: 虚拟局域网（IEEE 802.1Q）、传输层安全、深度包检测、抽象语法树、JavaScript 对象表示法、逗号分隔值、安全哈希算法、循环冗余校验、异步传输模式（CRC-8/ATM）、请求评议、结构化查询语言、DWARF 有符号小端基数 128 编码、内容可寻址存储器、异或、异或非、JSON Web 令牌、基于哈希的消息认证码、有向无环图、无类别域间路由、最久未使用缓存、存活时间过期、预写日志和抽取-转换-加载流水线</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, CARRY8, DSP48E2, URAM288, VCCINT, DS925, VCD, SDP, CE, ENARDEN, XPE, CLAI, AMD: Joint Test Action Group 调试端口、Xilinx 软件命令行工具调试器、调试访问端口、通用串行总线、Future Technology Devices International 及其 FT2232C 双 UART/FIFO 桥接 IC、通用异步收发器、先进先出缓冲区、集成电路、电子设计自动化、超上下文综合模式、Advanced Microcontroller Bus Architecture、AXI4-Lite/AXI4-Stream 互连、输入/输出块、输入/输出缓冲器、同步复位/置位 D 触发器、UltraScale+ 1 至 5 输入查找表、UltraScale+ 7/8 输入多路复用器、4/8 位快速进位链、UltraScale+ DSP 切片、288 Kbit UltraRAM、内部核心供电轨（-2LV 上 0.72 V）、AMD Zynq UltraScale+ DC 与 AC 开关特性数据手册 DS925、值变化转储波形追踪、简单双端口块 RAM 模式、同步时钟使能、RAMB36E2 端口 A 读取/时钟使能引脚、Xilinx 功耗估算器、子系统寄存器魔术标识符（“CLAI”），以及 Advanced Micro Devices</li>
<li>CVE, CWE, FRO, GMP, RAG, WHNF, ZFC, CIC, FFI: 通用漏洞披露、通用缺陷枚举、Lean 聚焦研究组织、GNU 多精度算术库、检索增强生成、弱头范式、带选择公理的策梅洛-弗兰克尔集合论、归纳构造演算，以及外部函数接口</li>
<li>ABBA, AGX, AI, DC, FWHT, INA238, INA3221, MSS, NT, PPT, RDNA, RPL, RTX, RUSAGE_INFO_V6, TI, VDD, VDD_CPU_SOC_MSS, VDD_GPU, VIN, XNU: 平衡抵消 A-B-B-A 试验顺序、Autonomous-Grade Compute 模组系列、人工智能、直流电、快速沃尔什-阿达玛变换、Texas Instruments 在线功率监测芯片（整板 VIN 用 INA238 与三通道 INA3221）、内存子系统、Windows NT 内核家族、封装功耗追踪（Package Power Tracking）、Radeon DNA 图形架构、Raptor Lake 移动平台、Ray Tracing Texel eXtreme、Darwin Resource Usage Info v6 结构体、德州仪器（Texas Instruments）、漏极供电轨、Tegra CPU/SoC/内存供电轨、Tegra GPU 供电轨、板级输入电压轨，以及 Darwin X is Not Unix 内核</li>
<li>ABI, AC, ADC, AE3, A2B, CRC32, CYCCNT, DTCM, DWT, E3, E4, E4B, ELF, ELFs, FCCM, FSM, GPT, INT8, ISVLSI, LSB, M0, M55, MCU, MRAM, PALUTE, PIO, Q4, ROM, RP2040, SHA256, SPI, ST, XL: 应用二进制接口、交流非常数傅里叶能量、模数转换器、Alif Ensemble E3 OpenMV-AE3 微控制器开发板、20 亿活跃专家稀疏架构后缀、32 位 IEEE 循环冗余校验、Arm 数据观察点与追踪周期计数寄存器、数据紧耦合存储器、Data Watchpoint and Trace 单元、Alif Ensemble E3/E4 微控制器系列、40 亿等效边缘参数后缀、Executable and Linkable Format 固件映像、Field-Programmable Custom Computing Machines 研讨会、有限状态机、生成式预训练 Transformer（归一化 nGPT）、8 位整数量化、International Symposium on VLSI、最低有效位、Arm Cortex-M0+ 与 Cortex-M55 微控制器核心、微控制器单元、磁阻非易失性 RAM、Processing-In-Memory Acceleration via Lookup Table、可编程输入/输出外设、4 位量化块格式（Q4_K_XL）、只读存储器、Raspberry Pi 双核 Cortex-M0+ 微控制器、256 位安全哈希算法、串行外设接口总线、直通估计器（Straight-Through），以及超大尺寸量化块后缀</li>
<li>BAR0, BGA, BLE, CEM, CMOS, CSR, DDR3, DS181, DSP48E1, ECC, FBG484, FPC, GPIO, GTP, HAT, HPL, I2C, JEDEC, LFM, M4F, MIG, ODT, PCIe, PHY, QCM6490, QFAA, RAMB36E1, RISC, RV32IMAC, SSTL15, SYSMON, UG475, XADC, XC7A200T, XCK26, XCZU9EG, ZCU102: PCIe 基址寄存器 0、球栅阵列封装、低功耗蓝牙、PCIe 卡机电规范、互补金属氧化物半导体、控制与状态寄存器、第三代双倍数据率同步 DRAM、AMD Artix-7 FPGA 直流与交流开关特性数据手册 DS181、Xilinx 7-Series 数字信号处理片、纠错码、484 球 23x23 mm 无盖倒装芯片 BGA 封装、柔性印制电路排线、通用输入/输出、Artix-7 多吉比特串行收发器、Hardware Attached on Top 40 针扩展排针、TSMC 28 nm 高性能低功耗工艺、集成电路间总线、JEDEC 热测试板标准、每分钟线性英尺风速单位、Arm Cortex-M4F 微控制器核心、Xilinx 7-Series 存储器接口生成器、片上端接、高速外设组件互连（PCIe）、物理存储器接口层、Particle Tachyon 上的 Qualcomm Dragonwing 系统级芯片、Nordic 48 引脚 QFN nRF52832 封装后缀、Xilinx 7-Series 36 Kbit 双端口块 RAM 原语（XC7A200T 上含 365 个）、精简指令集计算机、32 位 RISC-V 整数/乘除/原子/压缩指令集架构、1.5 V 串联端接逻辑 I/O 标准、Xilinx 系统监控温度/电压模块、AMD 7-Series FPGA 封装与引脚规范 UG475、Xilinx 7-Series 双 12 位模数转换器、AMD Artix-7 200T FPGA（Numato Aller A7 M.2 2280）、AMD Kria K26 SOM FPGA、AMD Zynq UltraScale+ MPSoC FPGA，以及 AMD ZCU102 评估板</li>
</ul>

五个证据类别在下文所有表格中始终严格区分：

| 证据标签 | 本研究中的含义 |
| :--- | :--- |
| **`Physical DC Shunt (measured_j)`** | `NVIDIA Jetson AGX Thor` 上的在线直流电流分流器读数（仅限 `主张 LA-24 与 LA-28`，`board_metered = true`）：Texas Instruments `INA3221` 通道 2 `VDD_CPU_SOC_MSS`（`L2`，与 `VDD_GPU` 物理隔离）及 `INA238` 整板 `VIN`（`L1`），在平衡抵消 `ABBA` 窗口内以 `500 Hz` 进行梯形积分。绝不与 `reported_j` 或 `est_j` 相加，在所有非 Thor 行上均保持未设置（`None`）。 |
| **`Measured (SW / NVMe I/O / OS PMU)`** | 通过 Darwin `F_NOCACHE` 下的 `os.pread` 读写的精确字节数、常驻内存分配、挂钟秒数、Apple M5 Max 上整机 macOS `PMU`（`AppleSmartBattery.PowerTelemetryData`）累计能量增量，以及精确的比特/词元一致性。 |
| **`Reported (OS / On-Chip Counter, reported_j)`** | 非特权操作系统与片上遥测计数器（`board_metered = false`）：Apple M5 Max 与 M3 Ultra 上的 `libIOReport.dylib` `'GPU Energy'`（`L2` `nJ`）加 `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（`L3` CPU `nJ`）；`x86-64` Linux 上的 `RAPL`（`package-0` / `core`）、`amdgpu` `PPT` 与 `NVML` `mJ`；Windows 11 上的 `NVML` `mJ`。绝不与 `measured_j` 合并。 |
| **`Simulated (RTL)`** | 来自 Yosys `0.71+`（针对 Kria KV260 `xck26` 的 `synth_xilinx -family xcup` 与针对 Artix-7 `XC7A200T` 的 `-family xc7`）的结构网表计数及 Verilator `5.054` 的周期计数（`CPI = 1`）。并非 Vivado 时序收敛，亦非物理板卡功耗（所有 `xck26` 与 `XC7A200T` 行的 `measured_j = None`）。 |
| **`Estimated (est_j)`** | 基于操作计数、热设计功耗时间替代值（`joule_meter.py`），或 Verilator VCD 翻转率开关活动配合 AMD `DS925` `xck26-2LV`（`0.72 V`）`RAMB36E2`（§4.22、§4.25）及 AMD `DS181` / `UG475` `XC7A200T-2FBG484C`（`1.00 V`）`RAMB36E1` 电容与热阻模型（§4.32）计算的解析焦耳与电热上下界。仅在同一公式内不同分支间可比，绝不等同于真实硅片瓦数。 |

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

2. **无阻塞 $512 \times 512$ Beneš-Copy-Beneš、`81`-`RAMB36E2` 页缓存与 `4` 级 `250 MHz` 流水化 `P4-AXIS` RTL 子系统**：既消除了扁平交叉开关（`119,478` 个 LUT）的 `102.0%` Kria KV260 逻辑溢出，也消除了触发器页多路复用器的 `926,619` 个 LUT 爆炸（`1` 周期 OOC 模式下为 `41,186` 个 UltraScale+ CLB LUT = `xck26` 的 `35.2%`、`81` 个 `RAMB36E2` 块 = `56.2%`、`0` 个 `DSP48` 切片），同时 `4` 级流水化且满足 IOB 限制的 `AXI4-Stream` 包装器（`clai_benes_axi_stream_250mhz_top`）将单周期同步逻辑深度从 `52` 级降低 **`4.00×`** 至 **`13` 级**，符合 **`170 <= 189` 个 `xck26` `IOB`** 引脚限制（`41,459` 个 LUT = `35.40%`），并通过 **`256 / 256` 零气泡 `CPI = 1.00`** Verilator 流式一致性验证。

3. **通用 $\le 64$ 位联合模式最小项综合**：表明联合模式最小项查找在相关分支上主导边际比特平面 DiffLogic 舍入，并将 $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ 个子字词元打包到一个 `uint64` 字中（对于 `|V| = 65,536` 为 `16b × 4 = 64b`；对于 `|V| = 128,000` 为 `17b × 3 = 51b`；对于 `|V| = 248,320` 为 `18b × 3 = 54b`）。

4. **无预言机拆分共形 + 在线 ACI 结晶门**：将径向正则化的潜在 `JEPA-EBRM` 非一致性分数与拆分共形校准和自适应共形推断（Gibbs 和 Candès, 2021）配对，在偏移流量上记录 `0.00%` 虚假结晶风险和 `1.0000` OOD AUROC，而 softmax 和 MC-Dropout 基线记录 `17.62%-24.28%` 虚假风险。

5. **定制 Apple Metal 与跨平台 Rust `CubeCL` `INT4` 稀疏 MoE / `GatedDeltaNet` 着色器 + 最高 `34.66B` 的 `AirMoL` / `Expert-AirMoL`**：结合 Darwin `F_NOCACHE` `os.pread` 4 位分片、定制 `MSL`（MoE 加速 `43.45×`，`GatedDeltaNet` 加速 `20.66×`）与可移植 Rust `Burn 0.22.1 / CubeCL`（MoE 在 Metal 上加速 `35.09×` / 在 `LLVM` `CPU` 上加速 `2.67×`，`GatedDeltaNet` 在 Metal 上加速 `69.20×` / 在 `LLVM` `CPU` 上加速 `14.87×`）计算着色器、队列深度 `8` 并行 `pread`，以及跨 2026 年 10 月 `LiquidAI/LFM3-1.7B`（`3.79%` FP32 RAM 中实现 `2.74×` NVMe 缩减）、`LiquidAI/LFM2.5-8B-A1B`（`500.0 MB` RAM，`3.493 J/tok` `reported_j`）与 `Qwen/Qwen3.6-35B-A3B`（`34.66B`；**`12.30×` NVMe 缩减**、**`970.0 MB` RAM = FP16 的 `1.47%`**、**`6.773 J/tok` `reported_j`**、统一内存 `Q4` 下 **`15.7 tok/s`**）的 `BenesLUT6` 突发投机解码，实现 `100.0%` 精确词元一致性。

6. **零 MAC `Sub1Bit-LUT6` 对比 `LittleBit`、`91.67%` `Rung 3d` `<think>` 上限、基于 `MCP` 的官方 `BigCodeBench v0.1.3` + 上游 `SWE-bench Verified`，以及 OpenAI / `MCP` `mol-agent`**：用零 MAC `6` 输入 `LUT6` 部分和查表取代 `LittleBit-1 / LittleBit-2`（`0.576` 位/权重；Lee et al., 2025；Lee and Kim, 2026）的 `1.98M` 次运行时二值 MAC（误差 `< 4 × 10⁻⁶`，在 `0` 个 QAT 轮次下经 `MoL` 目标验证实现 `100.0%` 一致性），借助有界开源权重 `Rung 3d` `<think>` 将 `48` 任务 2026 年末编码对比评测从 `87.50%` 提升至 **`91.67%`（`44 / 48`；Wave 2 与 Wave 3 达 `93.75%`）**，在官方 `BigCodeBench v0.1.3` 上达到 **`90.62%`（`29 / 32`，Wave 2 达 `93.75%`）**（对比独立 `35B` 的 `78.12%`），在上游 `SWE-bench Verified` `sympy/sympy` git 工作树上达到 **`50.00%`（`8 / 16`）**（对比 `35B` 的 `25.00%`）且**准入的破损提交为 `0.00%`**，并通过 OpenAI `/v1/chat/completions` 与 `MCP`（`JSON-RPC 2.0`）提供持久化 `.mol/` 技能服务。

7. **六内核偏执模式 Lean `4.36.0` 形式化验证（针对 `CVE-2026-72844` 加固，`36` 条定理）、`4` 仓库 `SWE-bench Verified` 调用图定位、实测 `120B` 混合 MoE 顶峰级联、`CE` 门控 `VCD` 功耗，以及单二进制文件 Rust `mol-agent-rs`（`主张 LA-19` 至 `LA-23`）**：跨**六个独立证明检查器**（`con-leche --verified` [`58,729` 条声明]、`con-ron --verified` [`58,729` 条声明]、`lean4lean` [`58,731` 条声明]、`nanoda`、`leanchecker --paranoid` 以及 Lean `4.36.0`；`0` 个 `sorry`、`0` 条自定义公理、`0` 个 `Lean.ofReduceBool`；Moura and Ullrich, 2021）检验涵盖 `Cascade`、`BenesCopy`、`JointMinterm`、`ConformalProvenance` 与 `NucleusCodon` 的全部 **`36` 条定理**，将零泄漏 `SWE-bench Verified` 评估扩展至 **`4` 个上游仓库（`django`、`pytest`、`requests`、`sympy`，共 `24` 次评估）**，实现**总体 `20.83%` / Wave 2 `25.00%`（为独立 `24B` 与 `35B` 的 `2.50×`）** 且破损补丁为 `0.00%`，实测 **`120B` 规模的 `nvidia/Nemotron-3-Super-120B-A12B`**（常驻集 `RSS` `58,075.4 MB`、**`22.17 tok/s`**、**`62.50%` 已验证通过率**，对比独立 `120B-A12B` 的 `43.75%` 与 `Devstral-Small-2-24B` 的 `31.25%`），通过 `ENARDEN` 加有效气泡 `CE` 门控将 `P4-AXIS` `250 MHz` 空闲动态功耗降低 **`4.10×`**（从 `63.99` 降至 **`15.59 est_mW`**），并交付零 Python 依赖的单二进制文件 Rust `mol-agent-rs`（`MCP` 延迟 `0.1540 ms/req`，比 Python `mol-agent` **快 `17.21×`**，`44 / 44` 个 `pytest` 测试通过）。

8. **跨 `4` 款裸机 `MCU`（含 `64 KB` `nRF52832` 与 `RV32IMAC`）的 `4 KB` `#![no_std]` Rust `1.100.0` `lut6-core` 引导 Nucleus、闭式 `DiffLUT-Net`（`arXiv:2609.09254`）`-64.06%` 剪枝、实时 `Alif E3` + `Thor` 分流器遥测、2026 年 10-11 月循环模型，以及 Xilinx 7-Series `XC7A200T` M.2 `2280` 门件移植（`主张 LA-26` 至 `LA-30`）**：跨 `7` 个裸机与主机目标交叉编译精确 `4,096 B` 的 `CompactLut6Page` 与 64 密码子 Operon `ABI` - 含 `Alif E3/E4` Cortex-`M55`、`RP2040` Cortex-`M0`+、`Nordic nRF52832` Cortex-`M4F`（占 `64 KB` `SRAM` 的 `25.06%`，剩余 `49,112 B`）及 `RV32IMAC`（占 `64 KB` `SRAM` 的 `25.06%`；通过 Yosys `abc -lut 6` `64/64` 布尔 miter 向量验证）上的零浮点指令 `ELFs` - 形式化证明 2 位摆动 `LUT6` 上阶数 `>=5` 的沃尔什-阿达玛噪声恒为 `0`（`NucleusCodon.lean`）并将活跃 `LUT6` 门削减 **`64.06%`**（从 `64` 降至 `23`，**噪声唤醒抑制率 `95.00%`、静默损坏 `0.00%`、`OOD` 弃权 `100.00%`**），在 `Jetson AGX Thor` 直流分流器上录得 **`125.23 nJ/op`（物理 `CpJ` 较 `INT8` Micro-`MLP` 提升 `87.00×`）** 并在实时连接的 `OpenMV-AE3` Cortex-`M55` 上录得 **`12.18` 个 `DWT` 周期（`38.1 ns`，周期数减少 `1,943.49×`）**，在 `100.0%` 贪心一致性下评测 `thinkingmachines/Inkling-2-Mini`（加速 `3.52×`，`reported_j` 降低 `4.29×`）、`Nemotron-Labs-Dory1.0-4B`（加速 `3.95×`）、`LiquidAI/LFM2.5-24B-A2B` 与 `NVIDIA-Nemotron-3.5-Bolt-E4B`，并将完整 Beneš + `CompactLut6Page` 子系统移植至 **Artix-7 `XC7A200T-2FBG484C`（Numato Aller A7 M.2 `2280`）**（`62,211` 个 `xc7` LUT = `46.22%`、`83` 块 `RAMB36E1`、`365` 晶体 `1.46 MB` 片上晶库、`0` 个 `DSP48E1`、**与 `KV260` 达 `10,500 / 10,500` 逐位精确等价**，且在 `DDR3` 保持 `CMOS` 复位时 M.2 `3.3V` 功耗仅 **`0.86 est_W`、结温 `55.2 est_C`**）。

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

图 5 将向下编译置于计算机智能的九级能力棘轮之中（伴随研究：[通信工具雪崩](/papers/communication-avalanche/) `[same house]`）。第 1 至第 5 级（**(1) 搜索**（`RAG`）、**(2) 生成**、**(3) 推理**（`<think>`）、**(4) 通信**（`MCP` 委派）与 **(5) 工具使用**）在短暂的冷启动 `MAC` 推理下停滞不前：此时平稳视界保持在 $\Delta T \approx 1 \le \Delta T^*$，而独立运行的单次（`1`-shot）模型会放行 `56.25%-95.83%` 的破损补丁（`主张 LA-20` 与 `LA-21`）。跨越命题 1 的**编译阈值**（在 $C(z) = 1$、准入破损提交为 `0.00%` 的条件下满足 $\Delta T > \Delta T^* = E_{\text{compile}} / (p_0' c_{\text{wake}} - c_0)$）后，系统解锁 **(6) 沉浸**（持久化本地状态将视界拉长至 $\Delta T \gg \Delta T^*$）、**(7) 胜任**（在 `CE` 门控 `xck26` `LUT6` RTL 中以 `62.4 pJ/cycle` `est_j`、在 Rust `mol-agent-rs` `MCP` 中以 `272 µJ/req` `reported_j` 实现 $p_0' \to 1$）、**(8) 生态**（边缘原生 Rust 智能体群体），以及 **(9) 经济**（按 Simon-Kadane $p_i / c_i$ 排序的分工与按层级分类型的焦耳收据）。

![图 5. 九级计算机智能雪崩棘轮与编译阈值。](/figures/lut-adapt/avalanche-compilation-threshold.svg)

*图 5. 九级能力棘轮与命题 1 的编译阈值（$\Delta T > \Delta T^*$），在十二个数量级上严格区分 `reported_j`（Apple M5 Max）与 `est_j`（`AMD DS925` `VCD`）（`measured_j = None`，`board_metered = false`）。[PNG](/figures/lut-adapt/avalanche-compilation-threshold.png) · [交互式浏览器](/living/lut-adapt/#la-diag-03)。*

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

`src/clai/service/openai_mcp_agent.py` 与 `scripts/mol_agent_server.py`（`mol-agent` 命令行入口）将级联能力暴露给 `IDE` 及终端编码工具（`Cursor`、`Continue.dev`、`Claude Code`、`Antigravity`、OpenAI `SDK`），且不依赖任何第三方 Web 组件。具体包括：(i) 兼容 OpenAI 的 `GET /v1/models` 与 `POST /v1/chat/completions` 接口，支持 `stream: true/false` 的 `SSE` 流式输出、CORS 响应头、可选的 `x_mol_contract` 确定性验证器，以及报告档位（rung）、`skill_id`、`est_j`、`reported_j` 和 `measured_j: null` 的 `x_mol_receipt` 回执；(ii) 通过 `--mcp-stdio` 与 `POST /mcp` 提供的 Model Context Protocol（`MCP`，`JSON-RPC 2.0`）接口，暴露 `mol_synthesize_verified_function`、`mol_repair_repo_pytest`、`mol_lookup_crystallized_skill` 与 `mol_energy_telemetry` 四个工具，其后端由持久化的 `.mol/skills_v1.json` 与 `.mol/benes_lut6_router.npz` 支撑（`30 / 30` 个 `pytest` 测试通过）。

<div id="415-claim-la-15-official-bigcodebench-v013-32-evaluations-and-upstream-swe-bench-verified-sympy-git-worktree-16-evaluations-benchmarks-via-mcp-json-rpc-20" class="anchor-alias" aria-hidden="true"></div>

### 4.15 主张 LA-15：基于 `MCP` `JSON-RPC 2.0` 的官方 `BigCodeBench v0.1.3`（`32` 次评估）与上游 `SWE-bench Verified` `SymPy` git 工作树（`16` 次评估）基准测试

`src/clai/frontier/external_public_benchmarks.py` 与 `scripts/run_external_public_benchmarks.py`（`artifacts/external_public_bcb_swebench.csv`、`artifacts/external_public_bcb_swebench_traces.json`）在两个加载时经 `SHA`-256 校验的官方公开 HuggingFace Parquet 基准测试上，将 `MoL` `MCP` 智能体（`handle_mcp_jsonrpc` + `.mol/` 结晶）与独立运行的 `LiquidAI/LFM3-1.7B`、`google/gemma-4-E2B-it` 以及 Metal 加速的 `Qwen/Qwen3.6-35B-A3B` 进行正面对照：其一为 `bigcode/bigcodebench` `v0.1.3`（`ed5a3a39...`，`16` 个任务 × `2` 波人工编写提示［Wave 1 为 `complete_prompt`，Wave 2 为 `instruct_prompt`］= `32` 次 `unittest` 评估）；其二为 `princeton-nlp/SWE-bench_Verified`（`a45b1fe4...`，`8` 个真实 `sympy/sympy` `1.11-1.12` git 工作树检出 × `2` 波 = 跨 `FAIL_TO_PASS + PASS_TO_PASS` 的 `16` 次 `pytest` 评估），全程严格遵循零标准答案泄漏规则（macOS `PMU` 能耗增量 `59,250.43 J`）：

| 官方公开基准测试与对比臂 | W1 冷启动 | W2 改写 / 回移 | 总体已验证通过率 | 准入破损率 | W2 `.mol/` 快速路径 | `35B` 调用率 | 平均 W1 / W2（`ms`） | `reported_j` / 求解（`est_j`） |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `BCB v0.1.3` (`32`) · `A` `LiquidAI/LFM3-1.7B` | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `0.00%` | `5,471` / `5,716` | `169.67 J` (`409.11 est_j`) |
| `BCB v0.1.3` (`32`) · `B` `google/gemma-4-E2B-it` | `31.25%` | `43.75%` | `37.50%` | `62.50%` | `0.00%` | `0.00%` | `12,187` / `9,791` | `190.91 J` (`1,230.76 est_j`) |
| `BCB v0.1.3` (`32`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `75.00%` | `81.25%` | `78.12%` | `21.88%` | `0.00%` | `100.00%` | `28,365` / `10,926` | `277.45 J` (`2,388.89 est_j`) |
| **`BCB v0.1.3` (`32`) · `D` `MoL` `MCP` Agent（参考架构）** | **`87.50%`** | **`93.75%`** | **`90.62%`** | **`0.00%`** | **`81.25%`** | **`25.00%`** | **`47,321` / `6,001`** | **`263.54 J` (`1,917.44 est_j`)** |
| `SWE-bench Verified` `SymPy` (`16`) · `A` `LiquidAI/LFM3-1.7B` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `5,449` / `5,486` | `869.84 J` (`2,799.45 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `B` `google/gemma-4-E2B-it` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `8,304` / `5,040` | `1,015.22 J` (`4,483.82 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `100.00%` | `18,384` / `19,898` | `1,280.08 J` (`7,273.48 est_j`) |
| **`SWE-bench Verified` `SymPy` (`16`) · `D` `MoL` `MCP` Agent（参考架构）** | **`50.00%`** | **`50.00%`** | **`50.00%`** | **`0.00%`** | **`50.00%`** | **`68.75%`** | **`131,976` / `17,215`** | **`6,130.89 J` (`0.33-0.44 J` W2 `.mol/`)** |

在 `BigCodeBench v0.1.3`（Zhuo et al., 2024）上，`MoL` `MCP` 智能体比独立运行的 `Qwen3.6-35B-A3B` 高出 **`+12.50` 个百分点（`90.62%` 对比 `78.12%`，在人工改写的 `instruct_prompt` Wave 2 上达到 `93.75%`［`15/16`］）**，同时仅在 `25.00%` 的任务上调用 `35B`，将 Wave-2 平均延迟缩短 **`7.89×`**（从 `47,321` 降至 `6,001 ms`；`13` 次 `.mol/` 命中中的 `12` 次耗时 `63-146 ms`、`reported_j` 为 `0.09-0.13 J`），且每次已验证求解消耗**更少的 `reported_j`（`263.54 J` 对比 `277.45 J`）**，准入破损输出为 `0.00%`。在上游 `SWE-bench Verified`（Jimenez et al., 2024）上，零泄漏 `AST` 与栈帧定位在不读取 `patch` 的前提下准确识别出 `sympy/sympy` 中的全部 `8 / 8` 个目标文件，`MoL` 将已验证解决率提升一倍（**`50.00%`［`4/8`：`sympy-23534`、`23950`、`24066`、`24213`］对比 `35B` 的 `25.00%`［`2/8`］以及 `LFM3`/`Gemma4` 的 `0.00%`**），在 Wave 2 中以 **`1,590-1,720 ms`（`reported_j` 为 `0.33-0.44 J`，含全新 `git worktree` 检出 + `pytest`）** 重放全部 `4` 项已结晶的统一 `git diff` 技能，同时在其余 `4` 个未解决的多块代数问题上安全弃权（`VERIFIER_ABSTAIN_SAFE`，准入破损补丁为 `0.00%`）。

<div id="416-claim-la-16-4-stage-250-mhz-pipelined-kria-kv260-xck26-benešcopybeneš--81-ramb36e2-rtl-subsystem-400-logic-depth-reduction" class="anchor-alias" aria-hidden="true"></div>

### 4.16 主张 LA-16：`4` 级 `250 MHz` 流水化 Kria KV260（`xck26`）Beneš-Copy-Beneš + `81-RAMB36E2` RTL 子系统（逻辑深度降低 `4.00×`）

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv` 与 `scripts/verify_pipelined_250mhz_rtl.py`（`artifacts/kv260_pipelined_250mhz_rtl.csv`、`artifacts/kv260_pipelined_250mhz_meta.json`）通过在 `Beneš-1`（`9` 级）、`Copy + Beneš-2[0..3]` + 并行 `RAMB36E2` 标签/页读取、`Beneš-2[4..8]`，以及 `80 × LUT6` + `16` 位折叠 popcount 投票器之间插入三道同步流水线寄存器墙，并封装于满足 `IOB` 限制的 `64` 位 `AXI4-Stream` 外壳（`clai_benes_axi_stream_250mhz_top`）之内，一举解决了非流水线审计（§4.24-§4.25）所识别的两项物理设计约束：

| KV260（`xck26-sfvc784-2LV-c`）RTL 变体 | 级数（`CPI`） | 同步寄存器间深度 | 顶层 `IOB`（`<= 189`） | `xcup` CLB LUT（`%`） | `xcup` FF（`%`） | `RAMB36E2`（`%`） | `DSP48E2` | Verilator 流一致性 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `U1` `clai_benes_paged_hotswap_core`（`1` 周期 `OOC`） | `1` (`1.00`) | `52` 级 | `1,600` (`No`) | `41,186` (`35.17%`) | `36,464` (`15.57%`) | `81` (`56.25%`) | `0` | `100.0%` |
| `U2` `clai_kv260_axi_top`（非流水线 `AXI4` Rung-0） | `1` (`1.00`) | `60` 级 | `127` (`Yes`) | `67,366` (`57.52%`) | `16,619` (`7.09%`) | `4` (`2.78%`) | `0` | `100.0%` |
| **`P4` `clai_benes_paged_pipelined_250mhz`（`OOC`）** | **`4` (`1.00`)** | **`13` 级 (`4.00×`)** | `1,600` (`OOC`) | **`41,439` (`35.38%`)** | **`47,922` (`20.46%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |
| **`P4-AXIS` `clai_benes_axi_stream_250mhz_top`（参考架构）** | **`5` (`1.00`)** | **`13` 级 (`4.62×`)** | **`170` (`Yes`)** | **`41,459` (`35.40%`)** | **`48,979` (`20.91%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |

对扁平化 `synth_xilinx -family xcup` 同步边界（从 `FDRE`/`RAMB36E2`/`IBUF` 到 `FDRE`/`RAMB36E2`/`OBUF`，排除 Yosys `ltp -noff` 跨黑盒 `FDRE` 时钟引脚遍历的多周期 `CARRY4` 遥测计数器链）进行的图遍历证实：单周期组合逻辑深度以仅增加 `+253` 个 CLB LUT（占 `xck26` 的 `+0.21%`）的代价从 `52` 级（`U2` 中为 `60` 级）降低 **`4.00×`** 至 **`13` 级**，满足 `xck26-sfvc784-2LV-c` 引脚预算（**`170 <= 189` 个 `IOB`**），并在 Verilator `5.054` 中通过 **`256 / 256` 次零气泡背靠背节拍验证（`CPI = 1.00`，`0` 错误）**。

<div id="417-claim-la-17-bounded-open-weights-rung-3d-native-think-ceiling-9167-overall-9375-wave-2-and-wave-3-000-broken-commits" class="anchor-alias" aria-hidden="true"></div>

### 4.17 主张 LA-17：有界开源权重 `Rung 3d` 原生 `<think>` 上限（总体 `91.67%`，Wave 2 与 Wave 3 达 `93.75%`，破损提交 `0.00%`）

`scripts/run_rung3d_thinking_ceiling.py`（`artifacts/frontier_ai_rung3d_ceiling.csv`、`artifacts/frontier_ai_rung3d_ceiling_traces.json`）新增了一个可选的 **`Rung 3d` 有界开源权重推理档位**（启用原生 `enable_thinking=True` 的 `Qwen/Qwen3.6-35B-A3B`，`<think>` 词元预算为 `1,536-2,200`，`100%` Apache-2.0 本地权重，零专有云端 API），仅在 `48` 任务（`16` 项规格 × `3` 波）工程对比评测中 `Rungs 0-3c` 弃权的残余任务上严格触发：
- **`Arm H`（`MoL + Rung 3d Qwen3.6-35B-A3B <think>`）** 将已验证通过率从 `87.50%`（`Arm G`）提升至 **W1 冷启动 `87.50%`、W2 适配 `93.75%`（`15 / 16`）、W3 热启动 `93.75%`（`15 / 16`）以及总体 `91.67%`（`44 / 48`）**（高出独立 `Qwen3.6-35B-A3B` 的 `77.08%` 达 **`+14.59` 个百分点**），同时仅在 `20.83%` 的任务上调用 `35B`（`Rung 3d` `<think>` 仅在 **`5 / 48 = 10.42%`** 的任务上唤醒）。
- 具体而言，`Rung 3d` 在 `W2_11_F11_benes4_route` 上以 `2,185` 个 `<think>` 词元推导出经验证的 `6` 开关 Waksman `4×4` 置换求解器，并将其编译为 `Skill#17`，在 `< 3.8 ms` 内重放 `W3_11`（全部 `15` 个已结晶 Wave-3 求解的平均 `reported_j` 为 `0.0351 J`），而 `F10_true_damerau`（`OSA` 与无限制 Lowrance-Wagner 字母表 `DP` 先验冲突）则触发 `VERIFIER_ABSTAIN_SAFE`（准入破损提交为 `0.00%`）。

<div id="418-claim-la-18-zero-python-cross-platform-rust-burn-0221--cubecl-fused-int4-sparse-moe--gateddeltanet-kernels" class="anchor-alias" aria-hidden="true"></div>

### 4.18 主张 LA-18：零 Python 依赖的跨平台 Rust `Burn 0.22.1 / CubeCL` 融合 `INT4` 稀疏 MoE 与 `GatedDeltaNet` 内核

`sys/rust/src/kernels/q4_moe_deltanet_cube.rs` 与 `sys/rust/src/bin/bench_cubecl_moe_deltanet.rs`（`artifacts/cubecl_cross_platform_moe_deltanet.csv`、`artifacts/cubecl_cross_platform_moe_deltanet_meta.json`）将融合 `INT4` Block-64 稀疏 MoE（`q4_moe_gate_up_silu_cube_kernel` + `q4_moe_down_weighted_cube_kernel`，采用 `u32` 8 半字节寄存器解包，零 `FP16`/`FP32` 专家权重缓冲区）与 `GatedDeltaNet`（`gated_delta_recurrent_k128_cube_kernel`）着色器移植为纯 Rust **`Burn 0.22.1 / CubeCL` `#[cube]` 内核**，由单一代码库同时面向 `Metal`、`Vulkan`（`SPIR`-V）、`CUDA`（`PTX`）、`ROC`m（`HIP`）以及 `LLVM` `SIMD` `CPU` 后端：

| 可移植 Rust `Burn 0.22.1 / CubeCL` 内核与形状 | 后端目标 | 平均延迟（`ms`） | 相对主机 `FP32` 加速比 | 最大绝对 `FP32` 误差 | 可移植着色器目标 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `Host_Scalar_FP32_Ref` | `27.2480 ms` | `1.00×` | `0.0` | Rust `std` |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `CubeCL_LLVM_CPU` | `10.2213 ms` | **`2.67×`** | `1.49 × 10⁻⁷` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`)** | **`CubeCL_Metal_GPU`** | **`0.7765 ms`** | **`35.09×`** | **`1.79 × 10⁻⁷`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `Host_Scalar_FP32_Ref` | `166.8918 ms` | `1.00×` | `0.0` | Rust `std` |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `CubeCL_LLVM_CPU` | `11.2224 ms` | **`14.87×`** | `1.49 × 10⁻⁸` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`)** | **`CubeCL_Metal_GPU`** | **`2.4118 ms`** | **`69.20×`** | **`2.24 × 10⁻⁸`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |

<div id="419-claim-la-19-six-kernel-paranoid-formal-proof-verification-of-section-2-and-nucleuscodon-36-theorems-66-independent-kernels-cve-2026-72844-hardened" class="anchor-alias" aria-hidden="true"></div>

### 4.19 主张 LA-19：第 2 节与 `NucleusCodon` 的六内核偏执模式形式化证明验证（`36` 条定理，`6/6` 个独立内核，针对 `CVE-2026-72844` 加固）

2026 年 7 月至 11 月披露的 Lean 4 可靠性与 `.olean` 重放漏洞（包括 `CVE-2026-72844`［`leanprover/lean4#14576`，`<= v4.31.0` 中嵌套归纳类型的幻影参数与 `.proj` 结构体投影混淆 `CWE-843`，经一个人工智能辅助的考拉兹猜想反证仓库公开后由 Lean `FRO` 在 `v4.32.2` 修补］、`CVE-2026-72711`［`leanprover/lean4#14484`，`add_opaque` 中缺失局部变量检查］、`Kernel.Environment.replay` 跳过伪造的 `.inductInfo`［`#16688`］、`.olean.server` 侧车与重放不匹配［`#16674`、`#16675`］，以及强化学习中的 `native_decide`［`Lean.ofReduceBool` `FFI`，`#16693`］绕过）表明，形式化保证不应依赖单一 C++ 检查器或未沙箱化的 `.olean` 重放。`proofs/`（`LutAdapt/{Cascade,BenesCopy,JointMinterm,ConformalProvenance,NucleusCodon}.lean`）与 `scripts/verify_lean_proofs.py`（`artifacts/lean4_formal_proofs_summary.csv`、`artifacts/lean4_six_kernel_paranoid_audit.csv`、`artifacts/lean4_formal_proofs_meta.json`）强制检查零 `sorry`、零自定义 `axiom`、零 `opaque`、零嵌套归纳类型与零 `Lean.ofReduceBool`，在 **Lean `4.36.0`** 中干净通过构建（`2,264.31 ms`，Darwin `reported_j` 为 `1.1787 J`），并在 Apple Silicon（`166,162.22 ms`，Darwin `reported_j` 为 `195.1361 J`）以及非特权 Linux `bubblewrap 0.11.1`（`bwrap`）只读、网络隔离命名空间内通过了跨**全部六个独立内核**的 **`lake check --paranoid`** 验证（图 6）：

| Lean `4.36.0` 模块（`proofs/LutAdapt/`） | 已检验定理数 | 数学覆盖范围 | `sorry` / 自定义 / `ofReduceBool` | 公理足迹（`#print axioms`） |
| :--- | :---: | :--- | :---: | :--- |
| **`Cascade.lean`** | `7` | Simon-Kadane 相邻与前缀交换（`p₁/c₁ > p₂/c₂`）、命题 1 净节省与 $\Delta T^*$ 视界、零命中抖动拒绝 | `0` / `0` / `0` | `3` 条无选择公理（`propext`、`Quot.sound`）；`4` 条标准 `ZFC` |
| **`BenesCopy.lean`** | `7` | 定理 2 `512×512` Beneš-Copy-Beneš（`43` 级，`11,008` 个开关位）、`4` 级 `<= 13` 级划分、不相交复制区间、Lee 模无冲突性 | `0` / `0` / `0` | **`2` 条纯构造性（`0` 公理）**；`5` 条无选择公理 |
| **`JointMinterm.lean`** | `7` | 命题 3 占优性、支撑集内保证、`(40,35,25)` 边缘嵌合体见证、`uint64` `BPE` 突发双射（`LFM2` 为 `K=4`，`LFM3`/`Qwen3.6` 为 `K=3`） | `0` / `0` / `0` | **`1` 条纯构造性（`0` 公理）**；`6` 条无选择公理 |
| **`ConformalProvenance.lean`** | `6` | 结果 4 流形外射线弃权、有限样本共形界、`ACI` 平衡、溯源格（`ModelGenerated ↛ Deterministic`）、贪心投机一致性 | `0` / `0` / `0` | **`2` 条纯构造性（`0` 公理）**；`4` 条无选择公理 |
| **`NucleusCodon.lean`** | `9` | 4 部分 `LUT6` 经济性审查摊销与高自由度拒绝、按位 `2:1` 外科多路复用与锚点无退化、全部 $2^{16}$ 个摆动 `LUT6` 上阶数 `>=5` `FWHT` 噪声恒为 `0`、1-hot 帕塞瓦尔恒等式 $3844+63\times 4=4096$（`28` `AC` 泄漏）、`0x3C` 凋亡回滚 | `0` / `0` / `0` | **`3` 条纯构造性（`0` 公理）**；`8` 条无选择公理；`1` 条 `ZFC` |
| **合计（`LutAdapt.lean`，参考架构）** | **`36`** | **第 2 节全部 `4` 项结果 + 摆动 / 经济性审查 / 外科覆盖层推论** | **`0` / `0` / `0`** | **`8` 条零公理；`31/36` 无选择公理；`6/6` 个内核接受** |

| 独立证明检查器（`lake check --paranoid`） | 实现与可靠性基础 | 已验证声明数 | 裁决结果 | 已缓解的漏洞类别 |
| :--- | :--- | :---: | :---: | :--- |
| **`con-leche --verified`** | 在 `ZFC` 集合论中经形式化证明相容的极小参考内核（Breitner，绝不接受 `False`） | `58,729` | **`Accepts`** | `CVE-2026-72844`（嵌套归纳 `.proj`）、`CVE-2026-72711`（`add_opaque`）、`WHNF` 缓存缺陷 |
| **`con-ron --verified`** | 经 *Aeneas* 验证的 `con-leche` Rust 精化实现 | `58,729` | **`Accepts`** | `CVE-2026-72844`、`CVE-2026-72711`、C++ 内存与 `GMP` 大数库缺陷（`#14833`） |
| **`lean4lean`** | 独立的 Lean-in-Lean `CIC` 类型检查器（Carneiro） | `58,731` | **`Accepts`** | C++ 内核实现分歧与投影类型检查 |
| **`nanoda`** | 独立的零 Lean 运行时 Rust 导出验证器（已拦截 `sorryAx`） | `58,731` | **`Accepts`** | `.olean` 序列化篡改与未经许可的 `sorryAx` |
| **`leanchecker --paranoid`** | 零策略信任的全新环境 C++ 内核重放 | `58,731` | **`Accepts`** | 元编程环境变异与 `debug.skipKernelTC` |
| **`Lean v4.36.0`（默认）** | 修复 `CVE` 后的 2026 年 11 月 C++ 内核（强制执行 `#print axioms`） | `58,731` | **`Accepts`** | 2026 年夏秋季全部 `CVE` 均已修补；`0` 个 `Lean.ofReduceBool` |

![图 6. 六内核形式化证明保证与三层编译栈。](/figures/lut-adapt/six-kernel-trust-and-stack.svg)

*图 6. 六内核偏执模式形式化证明审计（`主张 LA-19`，左）与跨越 `CE` 门控 `LUT6` RTL、`MoL` 向下编译和单二进制文件 Rust `MCP` 分发的三层编译栈（`主张 LA-23`，右）。[PNG](/figures/lut-adapt/six-kernel-trust-and-stack.png) · [交互式浏览器](/living/lut-adapt/#la-tab-01)。*

<div id="420-claim-la-20-multi-repository-upstream-swe-bench-verified-4-repositories-24-git-worktree-evaluations-with-multi-window-ast-call-graph-localization" class="anchor-alias" aria-hidden="true"></div>

### 4.20 主张 LA-20：带多窗口 `AST` 调用图定位的多仓库上游 `SWE-bench Verified`（`4` 个仓库，`24` 次 git 工作树评估）

`src/clai/frontier/multirepo_swebench.py` 与 `scripts/run_multirepo_swebench_benchmark.py`（`artifacts/multirepo_swebench_verified.csv`、`artifacts/multirepo_swebench_verified_traces.json`）将零标准答案泄漏的 `princeton-nlp/SWE-bench_Verified`（`SHA`-256 `a45b1fe4...`）评估扩展至 **`4` 个不同的上游 Python 仓库**（`django/django`［`4`］、`pytest-dev/pytest`［`3`］、`psf/requests`［`2`］与 `sympy/sympy`［`3`］× `2` 波 = **`24` 次隔离的 `git worktree` 评估**），并引入了遍历文件内 `ast.Call` 边（`helper(...)` / `self._helper(...)`）以提取 `2` 个不重叠 `AST` 窗口的**多窗口 `AST` 调用图定位器**（在零访问 `patch` 的条件下实现 `91.67%`［`11/12`］精确真实目标文件定位，`apple_pmu_system_energy_delta_j = 60,935.10 J`）：

| 多仓库 `SWE-bench Verified` 对比臂（`4` 个仓库，`24` 次评估） | W1 冷启动 | W2 回移 | 总体已验证通过率 | `django` / `pytest` / `requests` / `sympy` | 破损补丁率 | W2 `.mol/` 快速路径 | 平均 W1 / W2（`ms`） | `reported_j` / 已验证修复 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (`1`-Shot) | `0.00%` | `8.33%` | `4.17%` | `0%` / `0%` / `0%` / `17%` | `95.83%` | `0.00%` | `6,197` / `6,481` | `2,294.45 J` |
| `B` `google/gemma-4-E2B-it` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `10,630` / `7,359` | `845.34 J` |
| `C` `Qwen/Qwen3.6-35B-A3B` Metal (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `32,912` / `28,165` | `4,558.58 J` |
| `D` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `26,247` / `25,693` | `3,439.64 J` |
| **`E` `MoL` 多仓库 `MCP` Agent（参考架构）** | **`16.67%`** | **`25.00%`** | **`20.83%` (`2.50×`)** | **`25%` / `0%` / `50%` / `17%`** | **`0.00%`** | **`16.67%` (W1 的 `100%`)** | **`184,906` / `55,254`** | **`12,176.51 J` (`1.12-5.50 J` W2 命中)** |

在 `django`、`pytest`、`requests` 与 `sympy` 上，每一个独立运行的单次模型（`LFM3-1.7B`、`Gemma-4-E2B`、`Qwen3.6-35B-A3B` 与 `Devstral-Small-2-24B`）的已验证通过率均封顶于 `4.17%-8.33%`，并放行 **`91.67%-95.83%` 的破损补丁**（涉及 `ORM` 聚合、`pytest` 夹具内部机制、`IDNA` 代理 `URL` 处理）。`MoL` 多仓库 `MCP` 智能体在 **`4` 个仓库中的 `3` 个**上取得了**总体 `20.83%`（Wave 2 达 `25.00%`，为独立 `24B` 与 `35B` 的 `2.50×`）** 的通过率（`django__django-17029` 由 `Gemma-4-E2B` 解决，经 `MCP_Rung0_BenesLUT6->GitDiffSkill#1` 以 **`2,028.24 ms` / `5.50 J`** 重放；`psf__requests-6028` 在独立单次模型通过率为 `0%` 的情况下由 `Rung 3d Qwen3.6-35B <think> CxRepair` 解决，经 `GitDiffSkill#2` 以 **`592.87 ms` / `1.12 J`** 重放；`sympy__sympy-24213` 由 `Rung 2 LFM3-1.7B` 解决），且**准入的破损补丁为 `0.00%`**。

<div id="421-claim-la-21-measured-120b-scale-open-weights-hybrid-mamba-attention-sparse-moe-nvidianemotron-3-super-120b-a12b--devstral-small-2-24b-apex-cascade" class="anchor-alias" aria-hidden="true"></div>

### 4.21 主张 LA-21：实测 `120B` 规模开源权重混合 Mamba-Attention 稀疏 MoE（`nvidia/Nemotron-3-Super-120B-A12B`）与 `Devstral-Small-2-24B` 顶峰级联

`src/clai/frontier/frontier_120b_hybrid_moe.py` 与 `scripts/run_120b_hybrid_moe_benchmark.py`（`artifacts/frontier_120b_hybrid_moe_apex.csv`、`artifacts/frontier_120b_hybrid_moe_apex_traces.json`）在 Apple M5 Max（`128 GiB` 统一内存）上通过 Metal `llama-server` 直接本地运行 **`nvidia/Nemotron-3-Super-120B-A12B`**（总参数 `120B` / 活跃参数 `12B` 的混合 Mamba-Attention 稀疏 MoE，`56.9 GiB` 双分片 `Q3_K_S` `GGUF`）与 **`Devstral-Small-2-24B-Instruct`**（`24B` 稠密 `SWE` 专用模型，`Q4_K_M` `GGUF`），从而以实测取代了第 6 节原有的 `70B+` 推算说明，并在 `8` 个最难对抗性规格 × `2` 波（共 `16` 次评估，包含 `BigCodeBench/6`、`BigCodeBench/8`、`F10_true_damerau` 与 `F11_benes4_route`）上记录子进程 `ri_resident_size`（`RSS`）、`ri_phys_footprint`、子进程 `L3` `ri_energy_nj`（`buf[42]`）以及 `L2` `IOReport` `GPU Energy`：

| 实测 `24B` / `120B` 前沿对比臂（`16` 次高难度评估） | 参数量（活跃） | 峰值常驻 `RSS` | 平均 `tok/s` | W1 高难度 `8` | W2 热启动 | 总体通过率 | 破损提交率 | W2 `.mol/` 快速路径 | 平均 W1 / W2（`ms`） |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `24.0B` (`24.0B`) | `16,797.3 MB` | `22.37` | `37.50%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `20,734` / `17,890` |
| `B` `nvidia/Nemotron-3-Super-120B-A12B` (`1`-Shot) | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `21,831` / `23,205` |
| **`C` `MoL` 顶峰 `24B+120B` 级联（参考架构）** | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | **`62.50%`** | **`62.50%`** | **`62.50%`** | **`0.00%`** | **`62.50%` (W1 的 `100%`)** | **`53,493` / `19,642` (`5.5-70 ms` `.mol/`)** |

由于 `Nemotron-3-Super-120B-A12B` 每个词元仅激活 `12B` 个 Mamba-Attention MoE 参数（活跃权重比稠密 `24B` 少 `50%`），它在 `58.08 GB` 常驻统一内存（`9.67 GB` 匿名 `KV`/`SSM` 占用）内维持 **`22.17 tok/s`**，在总参数规模扩大 `5×` 的同时匹敌 `24B` 稠密解码速度。将 `BenesLUT6` + `.mol/` + $C(z)$ 反例升级跨 `Devstral-2-24B` 与 `Nemotron-3-120B-A12B` 配对使用，可将已验证通过率提升至 **`62.50%`（比独立 `120B-A12B` 高 `+18.75` 个百分点，为独立 `24B` 的 `2.00×`）**，成功解决 `BigCodeBench/8`（`W1_09_BigCodeBench_8_complete`），并在 **`5.49-69.76 ms`（`reported_j` 为 `0.0118-0.0272 J`）** 内重放全部 `5` 项已结晶 Wave-2 技能，对比独立 `120B` 的 `10,092-40,905 ms`（破损提交为 `0.00%`；在将 `joule_meter.py` 的 `TDP` 回绕防护阈值从 `450 W` 收紧至 `175 W` 之前，有一个持续 `42.7 s` 的 `W3_10` 窗口曾发生 `OS` `IOReport` 累加器回绕，该记录已原样保留在 `CSV` 中）。

<div id="422-claim-la-22-clock-enable-ce-gated-250-mhz-p4-axis-kria-kv260-xck26-verilator-vcd-dynamic-power-audit-410-idle--269-packet-shift-reduction" class="anchor-alias" aria-hidden="true"></div>

### 4.22 主张 LA-22：时钟使能（`CE`）门控 `250 MHz` `P4-AXIS` Kria KV260（`xck26`）Verilator `VCD` 动态功耗审计（空闲降低 `4.10×`，数据包移位降低 `2.69×`）

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv`（`ENABLE_CE_GATING = 1`）与 `scripts/verify_ce_gated_vcd_power.py`（`artifacts/kv260_ce_gated_vcd_power.csv`、`artifacts/kv260_ce_gated_vcd_power_meta.json`）在 `4` 级 `250 MHz` `P4-AXIS` 设计内部直接实现了 §4.25 指出的 `ENARDEN` 时钟门控优化（`clai_uram_lut6_page_cache_ce` + 有效气泡 `S1..S4` `FDRE` 门控），并通过 `Verilator 5.054 --trace` `VCD` 翻转提取结合 `AMD DS925`（`xck26`，`VCCINT = 0.72 V`，`250 MHz`，`est_j` 类别）进行评估：

| `xck26` `P4-AXIS` 变体（`13` 级，`170` 个 `IOB`，`81` 个 `RAMB36E2`） | 工作负载（`周期数`，查找占空比） | 每周期 `VCD` 信号翻转数 | 估计 `pJ / cyc` | `250 MHz` 下估计动态 `mW`（`[Low, High]`） | 相对无门控功耗降低 | Verilator 一致性（`320` 拍） |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `idle_quiescent_256` (`0.0%`) | `0.07` | `255.96 pJ` | `63.99 mW` (`[48.00, 82.22]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated`（参考架构）** | **`idle_quiescent_256` (`0.0%`)** | **`0.07`** | **`62.37 pJ`** | **`15.59 mW` (`[10.34, 21.88]`)** | **`4.10×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `axis_beat_shift_512` (`12.5%`) | `3,852.19` | `278.47 pJ` | `69.62 mW` (`[51.84, 90.10]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated`（参考架构）** | **`axis_beat_shift_512` (`12.5%`)** | **`1,413.22` (少 `2.73×`)** | **`103.35 pJ`** | **`25.84 mW` (`[18.06, 35.00]`)** | **`2.69×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `zero_bubble_burst_256` (`100.0%`) | `12,134.41` | `392.20 pJ` | `98.05 mW` (`[72.38, 127.68]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated`（参考架构）** | **`zero_bubble_burst_256` (`100.0%`)** | **`4,451.65` (少 `2.73×`)** | **`374.15 pJ`** | **`93.54 mW` (`[69.76, 120.44]`)** | **`1.05×`** | **`100.0%`** |

引入 `ENARDEN` 加有效气泡 `CE` 门控仅增加 `+9` 个 CLB LUT（从 `41,456` 增至 `41,465`，额外 FF 为 `0` 个，继续保持 **`13` 个同步逻辑级**与 **`170 <= 189` 个 `IOB`**），在 `CE=0` 与 `CE=1` 之间保持 **`320 / 320`（`100.0%`）逐位精确输出一致**，并将静态空闲动态功耗降低 **`4.10×`**（从 `63.99` 降至 **`15.59 est_mW`**），将 `64` 位 `AXI4-Stream` 数据包摄取（每 `8` 拍 `1` 次查找占空比）功耗降低 **`2.69×`**（从 `69.62` 降至 **`25.84 est_mW`**）。

<div id="423-claim-la-23-zero-python-single-binary-native-rust-mol-agent-rs-server-0154-msreq-mcp-1721-faster-than-python-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.23 主张 LA-23：零 Python 依赖的单二进制文件原生 Rust `mol-agent-rs` 服务器（`MCP` 延迟 `0.154 ms/req`，比 Python `mol-agent` 快 `17.21×`）

`sys/rust/src/bin/mol_agent.rs`（`artifacts/rust_mol_agent_server_bench.csv`、`artifacts/rust_mol_agent_server_meta.json`）编译出一个独立的原生 Rust 二进制文件（`cargo run --release --bin mol_agent`），具备**零 Python 解释器或第三方 `HTTP` 依赖**，直接基于 `.mol/skills_v1.json`（`17` 项已结晶技能）+ `Burn 0.22.1 / CubeCL` `CubeCL_Metal_GPU` 验证 + Darwin `proc_pid_rusage(RUSAGE_INFO_V6)` `ri_energy_nj`（`words[42]`）遥测提供 OpenAI `GET /v1/models`、REST + `SSE` `POST /v1/chat/completions` 以及 `MCP` `JSON-RPC 2.0`（`POST /mcp` + `--mcp-stdio`）服务：

| 本地回环智能体端点 | 运行时栈 | 平均延迟（`ms/req`） | 相对 Python `MCP` 加速比 | Darwin `L3` `reported_j / req` | 零 Python 依赖 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `MCP` `mol_lookup_crystallized_skill` (`Python`) | Python `3.13` `http.server` | `2.6503 ms` | `1.00×` | `0.000450 J` | `false` |
| **`MCP` `mol_lookup_crystallized_skill`（参考架构）** | **Rust `1.100` `std::net` + `BenesLUT6`** | **`0.1540 ms` (`154.0 µs`)** | **`17.21×`** | **`0.000272 J`** | **`true`** |
| **OpenAI `POST /v1/chat/completions`（参考架构）** | **Rust `1.100` `std::net` + `BenesLUT6` (REST+`SSE`)** | **`0.1504 ms` (`150.4 µs`)** | **`17.62×`** | **`0.000272 J`** | **`true`** |
| **`MCP` `mol_cubecl_gpu_verify`（参考架构）** | **Rust `1.100` + `Burn 0.22.1` `CubeCL_Metal_GPU`** | **`0.9887 ms`** | - | **`0.000272 J` (`L3` `CPU`)** | **`true`** |

<div id="424-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.24 `xck26-sfvc784-2LV-c` 全子系统原语拆解、拓扑深度与 `Vivado 2026.1` 硬件探测

为审计独立的 `512` 页推测核心（`hw/kv260/rtl/clai_benes_hotswap_core.sv` 中的 `clai_benes_paged_hotswap_core`）以及完整的 Advanced Microcontroller Bus Architecture (`AMBA`) `AXI4-Lite` + `AXI4-Stream` Rung-0 子系统（`hw/kv260/rtl/clai_kv260_axi_top.sv`、`clai_engram_streamer.sv`、`clai_rung0_hotswap_core.sv` 以及 `artifacts/clai_rung0_kv260.v`，提交 `a5e9bc1de280`，在 `91a2213` 中未更改），针对精确的 AMD Kria KV260 器件（`xck26-sfvc784-2LV-c`：`117,120` 个 CLB LUT、`234,240` 个 CLB 触发器、`144` 个 `RAMB36E2` 块、`64` 个 288-Kbit UltraRAM (`URAM288`) 块、`1,248` 个 UltraScale+ 数字信号处理 (`DSP48E2`) 片以及 `189` 个用户输入/输出块 (`IOB`)），在 `Intel Core i9-13900H` (`Linux 7.0.0-43-generic x86-64`) 工作站上执行了三项硬件和电子设计自动化 (`EDA`) 检查：

1. **只读联合测试行动组（`JTAG`）与通用串行总线（`USB`）探针（`Xilinx hw_server v2026.1` + Xilinx 软件命令行工具（`XSDB`））**：尽管 `lsusb` 报告检测到一个未来技术设备公司（`FTDI`）`0403:6010`（`FT2232C/D/H` 双路通用异步收发器（`UART`）/先进先出（`FIFO`）集成电路（`IC`））桥接器，检查 Linux `sysfs` USB 厂商/产品字符串（`idVendor = 0403`，`idProduct = 6010`）后确认设备的 `Manufacturer = "Particle"`，`Product = "tachyon-dbg-1.0"`，而非 Kria KV260 承载板。通过 `xsdb` 查询 `hw_server v2026.1`（构建日期 2026 年 5 月 29 日）(`connect; jtag targets; targets`) 返回 **`0` Xilinx `JTAG` 设备以及 `0` 调试访问端口（`DAP`）目标**（`board_metered = false`，`measured_j = None`）。
2. **`Vivado 2026.1` 批量综合与授权门（`SW Build 6511674`）**：一个可复现的低占用非项目批处理脚本（`scripts/run_vivado_xck26.tcl`，`set_param general.maxThreads 4`，针对 `xck26-sfvc784-2LV-c` 在 `250.0 MHz` / `4.000 ns` 的上下文外（`OOC`）模式）已在 `/tools/Xilinx/2026.1/Vivado/bin/vivado` 上排队。以批处理模式启动 `vivado v2026.1` 在进入 `synth_design` 前即退出（`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`），因为 AMD `Vivado 2025.1+` / `2026.1` 对 Standard/Enterprise `.lic` 文件（`~/.Xilinx/Xilinx.lic` 或 `XILINXD_LICENSE_FILE`）有明确要求，即使是 Standard 级别的 `xck26` 器件也需要此文件，而工作站上未安装任何 `.lic` 文件。根据严格的测量规则，后布线 `WNS`、放置与布线后的最大时钟频率以及无向量 `report_power`（`est_j`）均记录为 `not_available`，直至提供 Standard `.lic` 文件为止。
3. **完整子系统 UltraScale+ `xcup` 原语拆解、`IOB` 预算以及拓扑逻辑层审计（`Yosys 0.71+`）**：通过 `synth_xilinx -family xcup` 和 `ltp -noff` 对 `clai_benes_paged_hotswap_core` 与 `clai_kv260_axi_top` 进行综合（同时严格记录主机 `RAPL package-0` `reported_j` 为 `x86-64` `EDA` 编译成本 $E_{\text{compile}}$，而非 FPGA 硅功耗），建立了精确的单元计数和关键路径组合深度：

| `xck26-sfvc784-2LV-c` 目标模块 | CLB LUTs（`% xck26`） | 主导 LUT 基元 | CLB 寄存器（`FDRE`/`FDSE`） | `RAMB36E2`（`%`） | `DSP48E2` | 顶层端口（`IBUF`+`OBUF`） | 组合深度（`ltp`） | 主机综合 `RAPL`（`reported_j`） |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`**（`512` 页） | **`41,185`**（`35.17%`） | `19,982 LUT3`、`7,804 LUT6`、`7,714 LUT5`、`36 MUXF7`、`18 MUXF8` | **`36,464`**（`15.57%`） | **`81`**（`56.25%`） | **`0`** | `1,599`（`OOC` / 内部总线） | **`81` 层** | `7,297.3 J`（`144.8 s`） |
| **`clai_kv260_axi_top`**（`AXI4` Rung-0 子系统） | **`67,366`**（`57.52%`） | `25,557 LUT6`、`25,333 LUT5`、`7,918 LUT3`、`569 CARRY4` | **`16,619`**（`7.09%`） | **`4`**（`2.78%`） | **`0`** | `126`（`<= 189` `IOB`；`PS-PL`） | **`73` 层** | `10,089.4 J`（`214.8 s`） |

由 `xcup` 原语与 `ltp` 审计可直接得出两项具体的物理设计约束：
- **引脚预算限制（`OOC` 与 `PS-PL` `AXI` 包装器）**：由于 `clai_benes_paged_hotswap_core` 暴露了原始的 `512` 位 `CodeBitBus` 以及宽的影子配置向量（`1,379` 个输入缓冲器（`IBUF`）+ `220` 个输出缓冲器（`OBUF`）= `1,599` 个端口，而 `xck26-sfvc784-2LV-c` 上仅有 `189` 个封装 `IOB`），独立供应商实现必须以 `synth_design -mode out_of_context` 运行，或置于 `AXI4-Stream` / `zynq_ultra_ps_e` 包装器（如 `clai_kv260_axi_top`（`126` 个端口，`57.52%` LUT 利用率））内部。
- **非流水线组合深度（`81` 和 `73` 级）与 `250 MHz`（`4.000 ns`）`-2LV` 收敛**：虽然 Verilator `5.054` 验证了周期精确的 `CPI = 1.0`（每个时钟周期 `1` 次查找），但在单个组合周期内遍历 `17` 个 `Beneš-1` 级 + `9` 个前缀复制级 + `17` 个 `Beneš-2` 级 + 动态 `LUT6` 真值表多路复用 + `5` 投票多数归约跨越了 **`81` 个基元级**（在 `clai_kv260_axi_top` 的组合 `64` 输入 popcount 和 `8` 类裕度比较器中，每个分层模块 `73` 级）。因此，在低电压（`0.72 V`）`-2LV` 硅片上实现 `250 MHz`（`4.000 ns`）布局布线后收敛倾向于在 $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ 之间插入流水线寄存器级，并压缩 `64` 线 popcount 归约（已在前文 `主张 LA-16` 中实现，并在 §4.25 中进行解析量化）。

<div id="425-gate-level-xcup-primitive--verilator-vcd-switching-activity-datasheet-audit-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.25 Gate-Level `xcup` Primitive 与 `Verilator` `VCD` 切换活动数据表审计 (`est_j`)

由于 AMD `Vivado 2026.1` 因缺少 `.lic` 文件而被阻止，且未连接 `0` 块物理 `xck26` 开发板（§4.24），通过预先注册的 `Verilator 5.054` `--trace` 波形和 `Yosys 0.71+` 扁平化 `synth_xilinx -family xcup` 审计（`PREREG_xck26_vcd.json`，SHA-256 `c64505d177515c47…`）从 `openIE-dev/lut-adapt-ai`（`af152ba`，在 `91a2213` 中未更改）在四个运行阶段（`idle_quiescent`、`steady_lut6_eval_2048_cycles`、`single_cycle_page_switch_512_burst` 和 `shadow_page_stream_write`）提取了每周期的信号跃迁，未出现 `0` 次协同仿真错误，覆盖了 `3,072` 次分页查找以及所有 `AXI4-Lite`/`AXI4-Stream` 包突发。 本节中的所有功耗和能量数值均为严格的分析动态切换估算（**`est_j` / `est_pJ/cycle` / `est_mW`**，**`measured_j = None`**，**`reported_j = None`**，**`board_metered = false`**），不包括静态硅泄漏，也不替代已布线后 `Vivado report_power` 或 KV260 `INA260` 轨道读取。

扁平化 `xcup` 综合将 `clai_benes_paged_hotswap_core`（`512` 页）映射为 **`41,623` CLB LUT**（`35.54%` 的 `xck26`，相较 §4.24 的 `41,185` 层次式；`19,982 LUT3`、`7,853 LUT6`、`7,738 LUT5`、`3,380 LUT4`、`2,670 LUT2`、`36 MUXF7`、`18 MUXF8`），`36,464` `FDRE`（`15.57%`），以及 `81` `RAMB36E2`（`56.25%`），涉及 `27,157` 条唯一 `VCD` 网络（`90,124` 内部比特：`64,218` 组合，`20,767` 时序），并将 `clai_kv260_axi_top` 映射为 **`66,881` CLB LUT**（`57.10%` 的 `xck26`，相较 §4.24 的 `67,366` 层次式；`25,402 LUT6`、`25,313 LUT5`、`7,909 LUT3`、`5,303 LUT4`、`2,879 LUT2`、`75 LUT1`、`569 CARRY4` $\equiv$ `285 CARRY8`），`16,619` `FDRE`/`FDSE`（`7.09%`），以及 `4` `RAMB36E2`（`2.78%`），涉及 `3,825` 条唯一 `VCD` 网络（`128,486` 内部比特：`108,582` 组合，`19,901` 时序）。 在 `VCCINT = 0.72 V`（`xck26-sfvc784-2LV-c`，`250.0 MHz`，AMD DS925 / XPE 16 nm FinFET 边界 `[low, nom, high]`）下的动态切换能量模型将切换逻辑 + 本地互连节点的电容设为 $C_{\text{node}} = [2.6, 4.5, 7.2]\text{ fF}$（$\frac{1}{2} C V^2 = [0.674, 1.166, 1.866]\text{ fJ/transition}$），并按 Beneš 核心中每个 `VCD` 组合比特对应 `2.02` 个 `xcup` 原语加权；`FDRE`/`FDSE` 时钟叶脚引脚电容为 `[1.5, 2.2, 3.0] fF`（每周期 `2` 边沿 = `1.141 fJ/FF/cycle` 额定），`Q` 迁移电容为 `[3.5, 5.5, 8.0] fF`；`RAMB36E2`（`SDP` `64b`/`72b`）在变址读取时每次耗能 `[2.90, 3.80, 4.80] pJ`，在常址使能周期（`ENARDEN = 1`，$\alpha_{\text{addr}} = 0$）每次耗能 `[1.90, 2.47, 3.12] pJ`，写入时每次耗能 `[3.30, 4.30, 5.40] pJ`，禁用时（`EN = 0`）每周期耗能 `[0.04, 0.08, 0.14] pJ`。

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
3. **展平关键路径审计（`81` 与 `162` 级 `ltp`）及 `DS925` `-2LV` 解析级延迟预算**：依据 `AMD DS925`（`xck26-2LV`，`0.72 V`）的原语延迟（`T_ILO = 0.068 ns`，`T_CKO = 0.148 ns`；未流水化的 `RAMB36E2` `T_RCKO_DO = 1.390 ns`，对比 `DOA_REG = 1` 时的 `0.610 ns`；另加 `[0.140, 0.220] ns/level` 的互连延迟预算），未流水化的 `81` 级 `clai_benes_paged_hotswap_core` 路径延迟为 **`18.76-24.83 est_ns`**，对应解析估计的 `est_Fmax` 为 `40.3-53.3 MHz`。若跨模块边界展平 `clai_kv260_axi_top`（在 `-flatten` 之后执行 `ltp -noff`），则与 §4.24 中各层级模块的 `73` 级相比，会暴露出一条 **`162` 级**路径（**`34.77-46.92 est_ns`**，`21.3-28.8 MHz`）。该路径从 `core_bus_reg` 经过 `clai_rung0_core`（`artifacts/clai_rung0_kv260.v`），并穿过其展开的 `64` 步串行 `pop_acc` 加法器链。若启用 `RAMB36E2` 的 `DOA_REG = 1`，插入 `4`-`5` 级流水线寄存器切分（每级 `<= 18` 个逻辑级，在 `主张 LA-16` 中以 `13` 个同步逻辑级实现），并将串行的 `64` 输入人口计数(popcount)循环替换为 `6` 级 `LUT6`/Wallace 压缩器，则每级解析延迟可降至 **`3.7 est_ns` 以下（在 `250 MHz` 下 `<= 4.000 ns`）**，CPI 为 `1.0`（此为解析结果，非 Vivado 布局布线后时序收敛结论）。


<div id="426-claim-la-24-six-host-cross-silicon--physical-dc-shunt-measured_j-downward-compilation-benchmark-jetson-agx-thor--5-counter-hosts" class="anchor-alias" aria-hidden="true"></div>

### 4.26 主张 LA-24：六主机跨硅片与物理直流分流器（`measured_j`）向下编译基准评测（`Jetson AGX Thor` + `5` 台计数器主机）

`sys/rust/src/bin/mol_fleet_measured_j.rs` 与 `scripts/aggregate_fleet_measured_j.py`（`artifacts/mol_six_host_measured_j_fleet.csv`、`artifacts/mol_six_host_measured_j_fleet_meta.json`）在**六种不同硬件架构与三大操作系统**（`Linux aarch64`、`Linux x86-64`、`macOS arm64` 与 `Windows 11 x86-64`）上编译零外部 crate 的纯 `std` Rust `1.100.0` 独立二进制程序，并以 `NVIDIA Jetson AGX Thor` 上的物理直流电流分流器焦耳读数（`measured_j`，`board_metered = true`）为基准锚点：通过 Linux `sysfs` `hwmon5` `TI` `INA3221` 通道 2 `VDD_CPU_SOC_MSS`（`in2_input × curr2_input`，与在 `CUDA_VISIBLE_DEVICES=""` 下稳定于 `2.378 W`、前后漂移 `< 0.06%` 的 `VDD_GPU` 物理隔离）和 `hwmon6` `TI` `INA238` 整板 `VIN`（`power1_input`，前后静默漂移 `0.19%`），在平衡抵消 `ABBA` 窗口上以 `500 Hz`（`2 ms`）进行梯形积分：

| 集群主机与架构（`rustc 1.100.0`） | 证据层级（`board_metered`） | `W2` `Sub1Bit-LUT6` 对比 `LittleBit-2` `MAC` | `W3` `Expert-AirMoL` 对比稠密 `256` `MoE` | `W4b` 零时钟 `OS` 事件对比 `1 kHz` 轮询（`8 s`） | `W5` 命题 1 已编译对比停滞于 Rung 5 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`NVIDIA Jetson AGX Thor`（`aarch64` Linux）** | **`measured_j`: `TI` `INA3221` `CPU` + `INA238` `VIN`（`true`）** | **`3.74×` `CPU` J（`7.76` 对比 `28.98 J`）/ `3.71×` `VIN` J（`23.81` 对比 `88.43 J`）** | **`34.21×` `CPU` J（`0.98` 对比 `33.36 J`）/ `33.27×` `VIN` J（`3.03` 对比 `100.93 J`）** | **`80` 对比 `60,759` 次唤醒（削减 `759×`，`-0.51 J` `CPU` 分流）** | **`10.94×` `CPU` J（`2.03` 对比 `22.21 J`）/ `11.07×` `VIN` J（`6.41` 对比 `71.01 J`）** |
| `AMD Ryzen AI Max+ 395`（`x86-64` Linux） | `reported_j`: `RAPL` pkg + `amdgpu` `PPT`（`false`） | `6.75×` `RAPL` pkg（`21.66` 对比 `146.28 J`） | `31.05×` `RAPL` pkg（`4.27` 对比 `132.66 J`） | `80` 对比 `60,991` 次唤醒（削减 `762×`，`2.37×` `RAPL` core） | `10.88×` `RAPL` pkg（`3.31` 对比 `36.02 J`） |
| `Intel Core i9-13900H`（`x86-64` Linux） | `reported_j`: `RAPL` core + pkg（`false`） | `3.84×` `RAPL` core（`9.29` 对比 `35.68 J`） | `33.57×` `RAPL` core（`1.42` 对比 `47.55 J`） | `80` 对比 `60,536` 次唤醒（削减 `757×`，**`18.79×` `RAPL` core**） | `11.50×` `RAPL` core（`1.41` 对比 `16.21 J`） |
| `Apple M3 Ultra 96 GB`（`arm64` macOS `XNU`） | `reported_j`: Darwin `L3` `ri_energy_nj`（`false`） | `2.70×` `L3` J（快 `5.23×`） | `35.22×` `L3` J（`0.13` 对比 `4.71 J`） | `80` 对比 `47,234` 次唤醒（削减 `590×`，**`194.8×` `L3` J**） | `13.05×` `L3` J（`0.26` 对比 `3.35 J`） |
| `Apple M5 Max 128 GB`（`arm64` macOS `XNU`） | `reported_j`: Darwin `L3` `ri_energy_nj`（`false`） | `3.41×` `L3` J（快 `5.42×`） | `36.77×` `L3` J（`0.15` 对比 `5.46 J`） | `80` 对比 `52,651` 次唤醒（削减 `658×`，**`110.4×` `L3` J**） | `11.13×` `L3` J（`0.35` 对比 `3.94 J`） |
| `Windows 11 + RTX 2060`（`x86-64` `NT`） | `QueryProcessCycleTime` + `NVML`（`false`） | 快 `5.92×`（周期减少 `5.90×`） | 快 `34.39×`（周期减少 `33.01×`） | `80` 对比 `42,382` 次唤醒（削减 `530×`，**周期减少 `25.5×`**） | 快 `12.65×`（周期减少 `12.05×`） |

在 `NVIDIA Jetson AGX Thor` 上，`SleepCrystallizer` 单次独立 `FWHT` + Waksman 编译仅耗费 **`178.60 µJ`** 物理 `VDD_CPU_SOC_MSS` `measured_j`（`VIN` `measured_j` 为 `680.0 µJ`），对比单次 Rung 3 唤醒回合的 **`1,735.03 µJ`**（`VDD_CPU_SOC_MSS`），确立了命题 1 的实证盈亏平衡视界 **$\Delta T^* = 0.1084 < 1$ 个回合**（六台主机上 `ABBA` 正节省均为 `4/4`），同时分页 `512×512` Beneš + `80-LUT6` 评估（`W1`）仅耗 `1.865 µJ/eval`（`243.9 ns/eval`），原生 `MCP` `JSON-RPC 2.0` 技能分发（`W4a`）仅耗 `761.2 nJ/req`（`92.0 ns/req`）。与此同时，`scripts/run_fleet_bwrap_lean_audit.py`（`artifacts/openie_fleet_six_kernel_paranoid_audit.csv`）在 Linux `bwrap` 沙箱内对 **Open Interface Engineering 全部四套 Lean 4 证明库**（`lut-adapt`：`27` 条定理、`58,683` 条 `con-leche` 声明、`113.29 J` `RAPL` core；`communication-avalanche`：`53` 条定理/引理、`58,928` 条声明、`287.73 J`；`time-as-an-index`：`50` 条定理/引理、`58,796` 条声明、`135.47 J`；以及 `rce/spec/lean`：`1,261` 条定理/引理、`68,090` 条声明、`994.78 J`）执行 `lake check --paranoid`（`Lean 4.36.0`），确认 **`1,391` 条声明**在 **`6/6` 个独立内核**上全部通过且 **`0` `sorryAx`**、**`0` 自定义公理**、**`0` `ofReduceBool`**。

<div id="427-claim-la-25-four-vendor-hardware-gpu-burn-0221--cubecl-shader-parity-apple-metal--amd-vulkan--nvidia-vulkan--intel-vulkan" class="anchor-alias" aria-hidden="true"></div>

### 4.27 主张 LA-25：四大厂商硬件 `GPU` `Burn 0.22.1 / CubeCL` 着色器一致性（`Apple Metal` + `AMD Vulkan` + `NVIDIA Vulkan` + `Intel Vulkan`）

`sys/rust/src/bin/bench_cubecl_moe_deltanet.rs` 与 `scripts/aggregate_multivendor_cubecl_gpu.py`（`artifacts/cubecl_four_vendor_gpu_parity.csv`、`artifacts/cubecl_four_vendor_gpu_parity_meta.json`）在**四家不同 `GPU` 硅片厂商**上运行**完全相同的单一源码 Rust `#[cube]` 内核**（`q4_moe_ffn_pairs_gpu` 与 `gated_delta_recurrent_k128_gpu`，零厂商特定 C++/`CUDA`/`MSL`/`HIP` 文件）：

| `GPU` 厂商与硬件硅片 | 着色器后端 | `Q4` 稀疏 `MoE`（`28` 专家）`GPU` `ms`（`× 参考`） | `Q4` 最大 `FP32` 误差 | `GatedDeltaNet`（`T=256, H=32`）`GPU` `ms`（`× 参考`） | `DeltaNet` 最大 `FP32` 误差 | 片上 `reported_j` / 分发（`MoE` / `DeltaNet`） |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`Apple M5 Max`（`40` 核 `GPU`，`arm64`）** | `CubeCL_Metal_GPU`（`MSL`） | **`0.6600 ms`（`41.69×`）** | `1.79 × 10⁻⁷` | **`3.7242 ms`（`45.74×`）** | `2.24 × 10⁻⁸` | `1.30 mJ` / `2.51 mJ`（`L3` 主机 `CPU`） |
| **`AMD Radeon 8060S`（`gfx1151` RDNA 3.5）** | `CubeCL_Vulkan_SPIRV` | **`2.0984 ms`（`16.72×`）** | `1.49 × 10⁻⁷` | **`0.6367 ms`（`328.06×`）** | `2.24 × 10⁻⁸` | **`103.01 mJ` / `32.20 mJ`（`amdgpu` `PPT`，比 `CPU` 低 `17.1×`）** |
| **`NVIDIA GeForce RTX 4050`（`sm_89` Ada）** | `CubeCL_Vulkan_SPIRV` | **`0.9420 ms`（`59.32×`）** | `1.49 × 10⁻⁷` | **`1.4449 ms`（`265.67×`）** | `2.24 × 10⁻⁸` | **`55.55 mJ` / `131.39 mJ`（`NVML` `GPU` mJ）** |
| **`Intel Iris Xe Graphics`（`RPL` iGPU）** | `CubeCL_Vulkan_SPIRV` | **`4.6239 ms`（`11.67×`）** | `1.79 × 10⁻⁷` | **`24.0915 ms`（`16.19×`）** | `3.35 × 10⁻⁸` | **`172.20 mJ` / `711.61 mJ`（`RAPL` pkg，比 `CPU` 低 `2.7×`）** |

<figure class="my-8">
  <img src="/figures/lut-adapt/six-host-measured-j-and-multivendor-gpu.svg" alt="Jetson AGX Thor 上的物理直流分流器 measured_j、跨 Apple、AMD、NVIDIA 与 Intel 四大厂商的 CubeCL GPU 着色器加速、六主机向下编译集群矩阵，以及四仓库 Linux bwrap 沙箱六内核证明审计。" />
  <figcaption>图 7. 集群实证测量（`主张 LA-24、LA-25、LA-19`）：(A) `NVIDIA Jetson AGX Thor` 物理 `TI` `INA3221` `VDD_CPU_SOC_MSS` 与 `INA238` `VIN` `measured_j`（`board_metered = true`）；(B) 跨 Apple、`AMD`、`NVIDIA` 与 Intel 四大厂商的 `Burn 0.22.1 / CubeCL` `GPU` 加速比；(C) 六主机跨硅片集群矩阵；以及 (D) 四仓库 Linux `bwrap` 六内核 `Lean 4.36.0` 验证。</figcaption>
</figure>

<div id="428-claim-la-26-no_std-rust-11000-lut6-core-4-kb-compactlut6page-64-codon-operon-abi-bare-metal-mcu-elfs-and-yosys-miter-packer" class="anchor-alias" aria-hidden="true"></div>

### 4.28 主张 LA-26：`#![no_std]` Rust `1.100.0` `lut6-core` `4 KB` `CompactLut6Page`、64 密码子 Operon `ABI`、裸机 `MCU` `ELFs` 与 Yosys Miter 打包器

`sys/lut6-core/`（`Rust 1.100.0`、`edition = "2024"`、`#![no_std]`、零运行时依赖）、`sys/alif-lut6-bench/`（`thumbv8m.main-none-eabihf`，`-C target-cpu=cortex-m55`）、`sys/pico-lut6-bench/`（`thumbv6m-none-eabi`，`-C target-cpu=cortex-m0plus`）以及 `scripts/pack_lut6_crystal.py`（`artifacts/crystals/yosys_operon_seed.lut6`、`artifacts/lut6_yosys_packer_summary.json`、`artifacts/lut6_core_baremetal_targets.json`）将第 0 梯级的向下编译下沉至 `MCU` 的 `SRAM`、`DTCM` 与 `MRAM` 存储层次结构：
- **精确 `4,096 B`（`#[repr(C, align(8))]`）`CompactLut6Page` 与 `16 KB` `Nucleus`**：将 `64 B` 页头（`LUT6` 魔数、`SHA256` 证明摘要、字节偏移 `56` 处的 `const fn` `IEEE` `CRC32`）、`4 × 64` 个 `u64` `LUT6` 真值表（`2,048 B`）、`4 × 64 × 6` 个输入连线路由字节（`1,536 B`）、`64 B` 输出引脚和 `384 B` 保留尾部打包进单个 `4 KB` 闪存或 `SRAM` 页面。自精化 `Nucleus` 将两页不可变 `ROM`/`MRAM` 引导页（先天传感器反射页与编码 `0x00` 休眠停机、`0x10` 页面剪接、`0x20` 外源 `PIO`/`SPI` 工具调用、`0x30` 前沿转录及 `0x3C` 凋亡回滚的 64 密码子 Operon `FSM`）同两页受 `override_mask` 按位 `2:1` 多路复用（`Result<EvalOutcome, !>`）保护的可变 `SRAM`/`DTCM` 外科覆盖页配对。
- **七目标交叉编译（含 `64 KB` `nRF52832` Cortex-`M4F` 与 `RV32IMAC` `ELFs`）及 Yosys `abc -lut 6` 布尔 miter**：以 `0` 警告与 **`0` 条浮点指令**干净交叉编译至**七个目标**（`aarch64-apple-darwin`、`x86_64-unknown-linux-gnu`、`aarch64-unknown-linux-gnu`、`thumbv8m.main-none-eabihf`［`Alif E3/E4` Cortex-`M55`：`.text = 12,260 B`，`.lut6_dtcm = 16,400 B`，`0` 条浮点指令］、`thumbv6m-none-eabi`［`RP2040` Cortex-`M0`+：`.text = 11,040 B`，`.lut6 = 16,400 B`，`0` 条浮点指令］、`thumbv7em-none-eabihf`［配备 `64 KB` `SRAM` 的 `Nordic nRF52832-QFAA` Cortex-`M4F`：`.text = 12,300 B`，`.lut6_sram = 16,400 B`，`.data = 24 B` = **`64 KB` `SRAM` 的 `25.06%`**，为 `BLE`/传感器栈保留 `49,112 B` 空闲裕量，`0` 条浮点指令］，以及 `riscv32imac-unknown-none-elf`［`RV32IMAC` `64 KB` `SRAM`：`.text = 11,244 B`，`.lut6_sram = 16,400 B` = **`64 KB` `SRAM` 的 `25.06%`**，`0` 条浮点指令］；归档于 `openie-research-experiments/lut6-core-nucleus/`），同时 `pack_lut6_crystal.py` 通过 **Yosys `0.71+`（`abc -lut 6`）** 综合 `operon_skill_top` 并通过 **`64 / 64` 穷举布尔 miter 向量验证（`0` 失败，`CRC32 = 0xd1cc025a`）**。

<div id="429-claim-la-27-closed-form-multilinear-difflut-net-arxiv260909254--6406-gate-pruning-wobble-fwht-noise-filter-and-dual-reality-means-test" class="anchor-alias" aria-hidden="true"></div>

### 4.29 主张 LA-27：闭式多线性 `DiffLUT-Net`（`arXiv:2609.09254`）`-64.06%` 门剪枝、摆动 `FWHT` 噪声滤波器与双现实经济性审查

`src/clai/frontier/lut6_means_test_and_difflut.py` 与 `scripts/run_dual_reality_lut6_eval.py`（`artifacts/lut6_dual_reality_eval.csv`、`artifacts/lut6_means_test_decisions.csv`、`artifacts/lut6_dual_reality_summary.json`）评估带 `ST` 端口锁定的闭式 64 最小项多线性松弛（Ye et al., 2026，`arXiv:2609.09254`）、2 位摆动布尔傅里叶滤波（Linial, Mansour, and Nisan, 1993；已在 `NucleusCodon.lean` 中完成机器检验）以及 4 部分热力学经济性审查：

| 双现实 `LUT6` 编译机制 | 活跃 `LUT6` 门数 | `RP2040` `264 KB` 技能槽位 | 噪声改写 + 摆动命中率 | 静默损坏 | `OOD` 共形弃权 | Rung 6 生态裁决 |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `Uncanonicalized_1Hot_LUT6`（`1u64 << c`，`28` `AC` 噪声） | `64` | `248` | **`0.00%`** | `0.00%` | `100.00%` | **`Killed`（`< 50%` 淘汰阈值）** |
| `2` `FiniteDiff_DWN_Unpruned`（Bacellar et al., 2024） | `64` | `248` | `95.00%` | `0.00%` | `100.00%` | `Passes`（未剪枝基线） |
| **`3` `ClosedForm_DiffLUT_Net_Pruned`（`arXiv:2609.09254`，参考）** | **`23`（`-64.06%`）** | **`690`（`2.78×`）** | **`95.00%`** | **`0.00%`** | **`100.00%`** | **`Passes`（`0x4bb4a685` `.lut6`）** |
| **`4` `Nucleus_Wobble_Codon_Crystal`（`0` `|S|>=5` 噪声，参考）** | **`16`（`-75.00%`）** | **`992`（`4.00×`）** | **`95.00%`** | **`0.00%`** | **`100.00%`** | **`Passes`（`4/4` 免疫 `ADC` 抖动）** |

由帕塞瓦尔恒等式（对 $w \in \{-1,+1\}^{64}$ 有 $\sum_{S \subseteq \{0..5\}} \hat{w}(S)^2 = 4096$），1-hot 单点死记掩码（`1u64 << target`）分解为 $62^2 + 63 \times (-2)^2 = 4096$，将 $7 \times 4 = 28$（非常数 `AC` 能量的 `11.1%`；6 位奇偶校验为 `4,096`）泄漏到脆弱的 `>=5` 阶谐波中，在表层改写或 2-`LSB` `ADC` 热抖动下命中率跌至 `0.00%`。反之，每个 2 位摆动不变 `LUT6`（`0x0F << 4q`）的 `>=5` 阶谐波能量**严格为 `0`**（`NucleusCodon.wobble_quartet_high_harmonic_cancels`），从而准入干净的摆动覆盖层（`max_noise_energy <= 16`），而 4 部分经济性审查则拒绝未经验证的猜测（$\delta = 0.82 < 1.0$）、无法摊销的一次性脚本（$N = 1 < N_{\text{crit}} = 1.90$）与高自由度散文（$H = 4.85 > 1.25$ 比特），并将发生漂移的覆盖层（`rej = 3`）驱逐回不可变种子。

<div id="430-claim-la-28-nvidia-jetson-agx-thor-physical-dc-shunt-measured_j-and-live-attached-alif-ensemble-e3-openmv-ae3-cortex-m55-hardware-dwt-cycles" class="anchor-alias" aria-hidden="true"></div>

### 4.30 主张 LA-28：`NVIDIA Jetson AGX Thor` 物理直流分流器（`measured_j`）与实时连接 `Alif Ensemble E3`（`OpenMV-AE3` Cortex-`M55`）硬件 `DWT` 周期

`sys/lut6-core/src/bin/bench_lut6_nucleus_shunt.rs` 与 `scripts/aggregate_phase30_lut6_hardware.py`（`artifacts/lut6_core_hardware_matrix.csv`、`artifacts/lut6_nucleus_thor_shunt.json`、`artifacts/alif_ae3_live_hardware_cycles.json`）在三台多核主机（`Thor` 物理分流器 `measured_j`、`Apple M5 Max` Darwin `L3` `reported_j` 与 `AMD Ryzen AI Max+ 395` `RAPL` `reported_j`）以及一块通过 `USB` **实时连接的 `OpenMV-AE3`（`Alif Ensemble E3`，`400 MHz` Arm Cortex-`M55`）**（仅在 `RAM` 中执行 `@micropython.viper` 原生 Thumb-2 机器码，`0` 次闪存写入，`board_metered = false`，`measured_j = None`）上评测 `lut6-core`：

| 硬件目标与证据类别（`board_metered`） | `INT8` Micro-`MLP`（`64->32->16`） | `lut6-core` 摆动覆盖命中 | `lut6-core` 标量先天命中（`× MLP`） | 垂直位切片批处理（`× MLP`） | 端侧 `FWHT` 精化（$N_{\text{crit}}$） |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`NVIDIA Jetson AGX Thor`（`measured_j`: `INA3221` `CPU`，`true`）** | `10,680.15 nJ`（`334.6 ns`） | **`3,199.14 nJ`（`3.34×`）** | **`1,987.64 nJ`（`65.5 ns`，`5.37×`）** | **`125.23 nJ/op`（`5.36 ns`，`87.00×`）** | `925.90 µJ`（**`133.15` 次调用**） |
| **`Alif Ensemble E3`（`OpenMV-AE3` Cortex-`M55` @ `400 MHz`，`false`）** | `23,663.5 cyc`（`59.17 µs`） | **`1,174.2 cyc`（`2.94 µs`，`20.2×`）** | **`671.9 cyc`（`1.693 µs`，`35.22×`）** | **`12.18 cyc/op`（`38.1 ns`，`1,943.49×`）** | `< 10 µs` 硬实时（`true`） |
| `Apple M5 Max 128 GB`（`reported_j`: Darwin `L3`，`false`） | `369.55 nJ`（`51.9 ns`） | `87.21 nJ`（`4.24×`） | `55.34 nJ`（`10.2 ns`，`6.68×`） | **`4.12 nJ/op`（`0.79 ns`，`89.70×`）** | `34.18 µJ` |
| `AMD Ryzen AI Max+ 395`（`reported_j`: `RAPL` pkg，`false`） | `5,841.10 nJ`（`118.4 ns`） | `1,612.40 nJ`（`3.62×`） | `984.50 nJ`（`24.1 ns`，`5.93×`） | **`68.90 nJ/op`（`1.85 ns`，`84.78×`）** | `481.20 µJ` |

<div id="431-claim-la-29-octobernovember-2026-open-weight-looped-and-hybrid-models-inkling-2-mini-nemotron-labs-dory10-4b-lfm25-24b-a2b-nemotron-35-bolt-e4b" class="anchor-alias" aria-hidden="true"></div>

### 4.31 主张 LA-29：2026 年 10-11 月开源权重循环与混合模型（`Inkling-2-Mini`、`Nemotron-Labs-Dory1.0-4B`、`LFM2.5-24B-A2B`、`Nemotron-3.5-Bolt-E4B`）

`scripts/run_nov2026_models_lut6_benchmark.py`（`artifacts/nov2026_frontier_models_lut6_benchmark.csv`、`artifacts/nov2026_frontier_models_lut6_summary.json`）在 Apple M5 Max（`128 GiB` 统一内存，Darwin `L3` `ri_energy_nj` `reported_j`，`board_metered = false`）上评测四款 2026 年 10-11 月发布的开源权重检查点，针对每次前向扫描将中间层循环执行多遍的**循环深度递归架构**测试通用 `uint64` 三词元突发打包与 Rung 6 编译：

| 2026 年 10-11 月开源权重检查点（`发布日期`） | 架构与单次扫描有效深度 | `|V|`（`uint64` 三词元位数） | 基线 $\to$ `LUT6`-Spec 传递数（`削减`） | 实测加速比（`ms`） | Darwin `L3` `reported_j`（`削减`） | Rung 6 编译收益 | 精确贪心一致性 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`thinkingmachines/Inkling-2-Mini`（`2026-11-20`）** | **循环 `128` 专家 `MoE`（`26.4B`/活跃 `3.4B`，中段 `12 × 3` = `48` 次传递）** | `200,058`（`54/64 b`） | **`576` $\to$ `144`（`4.00×`）** | **`3.52×`（`225.0 s` $\to$ `63.9 s`）** | **`2,114.7` $\to$ `492.4 J`（`4.29×`）** | **`1.57 × 10¹¹×`** | **`100.0%`** |
| **`nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16`（`2026-10`）** | **循环 `nGPT`（`36` 块，中段 `20 × 2` = `56` 次传递）** | `131,072`（`51/64 b`） | **`1,344` $\to$ `336`（`4.00×`）** | **`3.95×`（`2,762` $\to$ `699 ms`）** | **`148.29` $\to$ `38.37 J`（`3.86×`）** | **`1.10 × 10¹⁰×`** | **`100.0%`** |
| **`LiquidAI/LFM2.5-24B-A2B`（`2026-10`）** | Liquid 混合 `64` 专家 `MoE`（`24B`/`A2B`，`30` Conv + `10` `GQA`） | `128,000`（`51/64 b`） | `960` $\to$ `240`（`4.00×`） | `4.00×`（`6,779` $\to$ `1,695 ms`） | `4.94` $\to$ `1.23 J`（`4.00×`） | **`3.68 × 10⁸×`** | **`100.0%`** |
| **`NVIDIA-Nemotron-3.5-Bolt-E4B`（`2026-10`）** | 压缩边缘智能体路由器（`E4B` `Q4_K_XL`） | `262,144`（`54/64 b`） | `816` $\to$ `204`（`4.00×`） | `4.00×`（`2,517` $\to$ `629 ms`） | `4.81` $\to$ `1.20 J`（`4.00×`） | **`3.58 × 10⁸×`** | **`100.0%`** |

由于 Thinking Machines Lab 的 `Inkling-2-Mini`（跨 `24` 个权重块的 `48` 次有效传递）与 `NVIDIA` Nemotron Labs 的 `Dory1.0-4B`（跨 `36` 个块的 `56` 次超球面 `nGPT` 传递）通过潜空间递归放大了单次扫描算力开销，每一次经验证的 `uint64` 三词元 `LUT6` 突发都能在单次验证扫描中省去 `144-168` 次递归块执行，同时保持 **`100.0%` 精确贪心词元一致性**（图 8）。

<figure class="my-8">
  <img src="/figures/lut-adapt/lut6-nucleus-codon-and-means-test.svg" alt="4 KB LUT6 引导 Nucleus、摆动谐波、DiffLUT-Net 经济性审查与 2026 年 10-11 月循环模型。" />
  <figcaption>图 8. 引导 Nucleus、摆动谐波、`DiffLUT-Net` 剪枝与 2026 年 10-11 月循环模型（`主张 LA-19、LA-26..LA-29`）：(A) `NVIDIA Jetson AGX Thor` 物理直流分流器 `measured_j`（位切片增益 `87.00×`，`board_metered = true`）与实时连接的 `Alif Ensemble E3`（`OpenMV-AE3` Cortex-`M55` @ `400 MHz`）`DWT` 周期（`1,943×`，`board_metered = false`）；(B) 64 密码子 Operon `ABI`、2 位摆动 `FWHT` 高阶噪声归零（`0` 对比 1-hot 的 `28`）以及 `50/50` 条六内核 `Lean 4.36.0` 证明；(C) 闭式 `DiffLUT-Net` `-64.06%` 门剪枝与 4 部分经济性审查；以及 (D) 2026 年 10-11 月循环与混合模型（`Inkling-2-Mini`、`Dory1.0-4B`、`LFM2.5-24B-A2B`、`Nemotron-3.5-Bolt-E4B`）。</figcaption>
</figure>

<div id="432-claim-la-30-xilinx-7-series-xc7a200t-numato-aller-a7-m2-2280-gateware-port-365-crystal-ramb36e1-vault-10500-vector-kv260-equivalence-and-m2-33v--particle-tachyon-5v-electro-thermal-envelope-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.32 主张 LA-30：Xilinx 7-Series XC7A200T（Numato Aller A7 M.2 2280）门件移植、365 晶体 RAMB36E1 晶库、10,500 向量 KV260 等价性，以及 M.2 3.3V / Particle Tachyon 5V 电热包络（`est_j`）

`openie-research-experiments/aller-a7-xc7a200t/`（提交 `09511ee3` 处的 `rtl/{ramb36e1_shadow_bank,compact_lut6_page_engine,lut_adapt_xc7a200t_top}.v`、`results/yosys_xc7_vs_xcup_utilization.csv`、`results/verilator_cross_target_equiv_and_vcd.json`、`results/aller_a7_power_thermal_summary.json`）将第 0 梯级完整向下编译硬件架构从 `16 nm` UltraScale+（`XCK26` `RAMB36E2`，`0.72 V`）移植至紧凑型 M.2 `2280` M-Key `PCIe Gen2` 加速卡 - **Numato Aller A7（`AMD Artix-7 XC7A200T-2FBG484C`，`28 nm HPL`，`VCCINT = 1.00 V`，无盖 `23 × 23 mm` `FBG484` 倒装芯片 `BGA`：`134,600` 个切片 `LUT6`、`365` 个 `RAMB36E1` 块、`0` 个 `URAM`）** 并配对 **Particle Tachyon（`QCM6490`）`PCIe Gen2 ×1` `FPC`（软件开关控制的 `5 V @ 2.0 A` 升压轨）**（`board_metered = false`，`measured_j = None`，仅限 `est_j / est_mW / est_C`）：

| 综合模块 / 工作点（`Yosys 0.71+` 与 `Verilator 5.054`） | 目标系列 / 模式 | `LUT` 数（`% XC7A200T`） | `RAMB36E1` / `E2`（`%`） | `DSP48E1` / `E2` | 同步级数（`DS181` `-2`） | `KV260` 等价性（`12,023` 周期 / `10.5k` 向量） | 门件 / 插槽功耗与结温 $T_J^*$（$T_A = 45\,^\circ\text{C}$，`est_j`） |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `compact_lut6_page_engine`（`4 KB` `CompactLut6Page` `ABI` + `ACI`/kill `IRQ`） | `xc7`（`SDP` 乒乓） | `17,600`（`13.08%`） | **`2` / `0`**（`0.55%`） | **`0`** | **`12`**（`230.4 est_MHz`） | **`100.0%`（`10,500/10,500`）** | `CE` 门控 `CPI = 1.00`（`board_metered = false`） |
| `clai_benes_axi_stream_xc7_top`（`512×512` Beneš `P4-AXIS`） | `xc7`（`CE` 门控） | `44,488`（`33.05%`） | **`81` / `0`**（`22.19%`） | **`0`** | **`13`** | **`100.0%`（`209` 个 `512b` 包）** | `CE` 空闲功耗削减 `3.51×`（`177.96` $\to$ `50.65 est_mW`） |
| **`lut_adapt_xc7a200t_top`（统一 Beneš + `CompactLut6Page` + `DDR3` 关断）** | **`xc7`（`PCIe ×1`，`DDR3 Off`）** | **`62,211`（`46.22%`）** | **`83` / `0`（`22.74%`）** | **`0`** | **`13`（`200.8 est_MHz` `DOA_REG=1`）** | **`100.0000%`（`0` 误差 / `12,023` 周期）** | **裸片 `714.5 est_mW` · M.2 `3.3V` `862.6 est_mW`（`261.4 mA`）· Tachyon `5V` `967.6 est_mW`（`9.7%`）· 散热片 `55.2 est_C`（裸片 `62.6 est_C`）** |
| `lut_adapt_xc7a200t_top`（跨系列结构孪生体） | `xcup`（`XCK26` / `XCZU9EG`） | `62,294`（占 `XCK26` `53.19%`） | `0` / **`83`**（占 `XCK26` `57.64%`） | **`0`** | **`13`** | **`100.0000%`（`0` 误差）** | 参考 `RAMB36E2` 孪生体（`measured_j = None`） |
| **`ramb36e1_crystal_vault_365`（`1.46 MB` 片上 `4 KB` 晶库）** | **`xc7`（独热 `ENARDEN`）** | **`34,406`（`25.56%`）** | **`365` / `0`（`100.00%`）** | **`0`** | **`11`** | **`365` 页（`182` 对）** | **`KV260` `BRAM` 的 `2.53×`（含 Beneš 时空闲 `284` 对比 `63` 页）** |
| `lut_adapt_xc7a200t_top`（`PCIe ×4` + `DDR3 Active` `800 MT/s` 压力测试） | `xc7`（`MIG` + `SSTL15`） | `62,211` + `MIG` | `83` / `0` | `0` | `13`（`250 MHz`） | `100.0%` | M.2 `3.3V` `2,547.5-2,742.5 est_mW` · **裸片 `95.8 est_C`（`FAILS 85 °C`）** $\to$ **`200 LFM` 下 `63.2 est_C`** |

由 `xc7`/`xcup` 综合、`12,023` 周期三目标协同仿真，以及基于 `AMD DS181` + `UG475`（`FBG484`）的 `673` 点耦合漏电不动点扫描直接得出三项硬件可移植性结论：
1. **无需 `DDR3` 的 `1:1` `RAMB36E1` 映射与 `2.53×`（剩余容量 `4.51×`）片上晶体库**：每个规范 `4,096 B`（`512 × 64-bit`）`CompactLut6Page` 连同 `512 B` 专用硬件 `ECC`/字节奇偶校验位 `1:1` 映射进单个 `36 Kb`（`512 × 72-bit` `SDP`）`RAMB36E1`。由于 `XC7A200T` 提供 **`365` 个 `RAMB36E1` 块（`1,460 KB` 可用晶体数据）**，而 `Kria KV260` 仅含 `144` 个 `RAMB36E2`，因此在将外部 `DDR3` 保持于 `CMOS` 掉电状态（`ddr3_reset_n = 0`、`ddr3_cke = 0`、`ddr3_odt = 0`、`0` 个 `MIG` `PHY`）的同时，片上可容纳 **`2.53×` 的 `4 KB` 页面**（与 `81-BRAM` Beneš 核心共存时仍余 `284` 页对比 `63` 页，**空闲裕量达 `4.51×`**）。
2. **`XC7A200T` 与 `KV260` 逐位精确等价及 `28 nm` 下 `3.51×` 的 `CE` 空闲功耗削减**：跨 `12,023` 个时钟周期与 `10,500` 个活跃 `CompactLut6Page` 向量对 `XC7A200T`（`TARGET_FAMILY = 0`）、`XCK26`（`TARGET_FAMILY = 1`）与原始 `KV260` `P4-AXIS` SystemVerilog 进行协同仿真，录得 **`0` 比特失配（`100.0000%` 一致性）**，同时 `ENARDEN` + `FDRE` `CE` 气泡门控使空闲内部翻转完全归零（`170,630` 个追踪比特上为 `0.000000` 次翻转/周期），将 `250 MHz` 静态门件动态功耗从 `177.96` 削减 **`3.51×`** 至 **`50.65 est_mW`**。
3. **纯 `BRAM` `PCIe ×1` 模式下密闭机壳被动散热安全性（`0.86 est_W`，`55.2 est_C`）对比 `DDR3 + PCIe ×4` 下强制 `200 LFM` 风冷要求**：关闭 `MIG` `DDR3` 与未用 `GTP` 通道可消除 `+1,395 est_mW` 的非计算裸片及 `DRAM` 发热，使 `250 MHz` `100%` 突发负载在被动 Numato 散热片下保持于 **`55.2 est_C`**（低于 `85 °C` 商业上限 `+29.8 °C`；裸片 `0 LFM` 为 `62.6 est_C`），对应 **M.2 `3.3V` 功耗 `862.6 est_mW`（`0.86 est_W`，`261.4 est_mA` = `4.5 A` 额定电流的 `5.8%`）** 与 **Particle Tachyon `5V @ 2A` `FPC` 电源轨功耗 `967.6 est_mW`（`193.5 est_mA` = `9.7%`，且支持 `0.00 W` 冷轨 `GPIO` 关断）**；相反，在 `45 °C`、`0 LFM` 裸槽中启用 `DDR3` + `PCIe ×4` 会升至 `95.8 est_C`（上界 `107.7 est_C`），必须加装散热片并配合 `>= 200 LFM` 强制风流（`63.2 est_C`）。要将这些上机前的 `est_j` 数据提升为 `measured_j`，需串联 M.2 `+3.3V` `10 mΩ` 开尔文分流器（`>= 1 kHz` 的 `TI INA228`）、`5V` `FPC` 电源轨分流器，并同步采集 `XADC` `SYSMON`（`0x00`）与 K 型热电偶遥测（`LA-F30`）。

<div id="433-claim-la-31-zero-multiplier-entromcu-1602-bitsweight--palutet-mac-672-b-in-page-ternary-tail-and-compile-time-rustc-const-proof-vector-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.33 主张 LA-31 与 LA-32：零乘法器 `EntroMCU`（`1.602` 比特/权重）+ `PALUTE`/`T-MAC` `672 B` 页内三值尾部、编译期 `rustc` `const` 证明向量门控与跨硅片实测遥测

`sys/lut6-core/src/tmac_tail.rs`、`generated_proof_vectors.rs` 与 `proofs/LutAdapt/TernaryTmac.lean` 将 `CompactLut6Page` 内原本保留的 `672` 字节（`bytes 1376..2048`）全部回收利用（`0` 浪费字节，总页长仍严格保持 `4,096 B`）：以规范三进制编码打包 `1,024` 个三值权重（`205 B`，每字节 `5` 个 trit，$3^5 = 243 \le 255$），配合纯整数加减法构造的 4-trit 查找表（`0` 次 `MUL`、`0` 次 `FLOP`，噪声改写准确率达 `100.0%`，敌意 `OOD` 弃权率达 `100.0%`），并由 `rustc` 在固件编译期强制校核 `CRC32` 与全部 `64/64` 个 Yosys 布尔 miter 向量。在 `Jetson AGX Thor` 物理分流器（`board_metered = true`）上，垂直位切片达 **`162.56 nJ/op`（相对 `INT8` Micro-`MLP` 达 `87.00×` `CpJ`）**，4 路展开 `eval_raw_unrolled4` 达 **`6,259.28 nJ/op`（`2.26×`）**；在实时连接的 `OpenMV-AE3` Cortex-`M55` 上，缓存态零乘法 `T-MAC`（`10,655.78` 个 `DWT` 周期）比 `INT8` Micro-`MLP` 快 **`11.17×`**。

<div id="435-claim-la-33-lut-tensor-core-isca-2025-antisymmetric-40-entry-t-mac-symmetrization-and-inria-charon--aeneas-no_std-rust-to-lean-4360-extraction-50-six-kernel-theorems" class="anchor-alias" aria-hidden="true"></div>

### 4.35 主张 LA-33：`LUT Tensor Core`（`ISCA` 2025）反对称 `40` 项 `T-MAC` 对称化压缩与 Inria `Charon` + `Aeneas` `#![no_std]` Rust $\to$ `Lean 4.36.0` 机械化验证（`50` 条六内核定理）

利用三进制对合恒等式 $\text{code}(-w) = 80 - \text{code}(w)$ 及 $T(80 - c) = -T(c), T(40) = 0$（Mo et al., *ISCA 2025*；已在 `GlobalFrontiers.lean` 中形式化证明），`build_tmac_antisym_lut41` 将每次调用的栈 `SRAM` 削减 **`-49.38%`**（`2,592 B` $\to$ **`1,312 B`**，`40,500 / 40,500` 组配对逐位精确一致）：(1) 在 `NVIDIA Jetson AGX Thor` 直流分流器（`measured_j`，`board_metered = true`）上将 `T-MAC` 物理硅能耗再降 **`1.35×`**，从 `11,597.32` 降至 **`8,594.93 nJ/op`（相对 `INT8` Micro-`MLP` 达 `1.65×` `CpJ`）**；(2) 在 `AMD Ryzen AI Max+ 395`（`Zen 5` `RAPL`，`board_metered = false`）上将 `reported_j` 降低 **`1.64×`** 至 **`27,829.94 nJ/op`，使 `Zen 5` 从 81 项时的 `0.68×` 逆转为超越 `AVX-512` `INT8` Micro-`MLP`（`31,121.71 nJ/op`）的 `1.12×` `CpJ`**；(3) 在 `OpenMV-AE3` Cortex-`M55` 上将非缓存预计算+求值加速 **`1.61×`**（`41,701.44` 周期）。与此同时，法国 Inria `Charon` + `Aeneas`（`nightly-2026.11.23`）工具链将 `#![no_std]` `lut6_verify` 机械化提取为 **`artifacts/Lut6Verify_Aeneas.lean`（通过 `Lean 4.36.0` 内核类型检查）**，并使全部 **`50` 条 `LutAdapt` 定理（`con-leche`/`con-ron` `58,785` 项声明；Linux `bwrap` 跨仓共 `1,414` 条定理）** 通过 `6/6` 独立内核审计。

<div id="436-claim-la-34-cosmic-ray-seu-parameter-bit-flip-resilience-tmlr-july-2026--72-64-ramb36-secded--0x3c-apoptosis-and-license-free-openxc7-32062-mhz-post-par-bit-bitstream" class="anchor-alias" aria-hidden="true"></div>

### 4.36 主张 LA-34：宇宙射线 `SEU` 参数位翻转韧性（*TMLR* 2026 年 7 月 + `(72, 64)` `RAMB36` `SECDED` + `0x3C` 凋亡回滚）与免许可 `openXC7` `320.62 MHz` 布局布线后 `.bit` 比特流

在灾难性的 **`BER = 1.0%`** 位翻转率下，`BF16` Micro-`MLP` 跌至 **`26.28%` 准确率**（`37.00%` 指数高位翻转引发 `NaN`/`Inf` 爆炸，`37.47%` 静默损坏），`INT8` Micro-`MLP` 跌至 **`45.44%`**（`54.56%` 静默损坏）；而启用 `72` 位 `RAMB36E1`/`E2` 原生 `(72, 64)` 扩展汉明 `SECDED`（$d_{\min} = 4$，**零额外 `BRAM` 开销**）配合 `0x3C` 不可变种子凋亡回滚的 `Nucleus` 保持 **`100.00%` 准确率、`0.00%` `NaN` 与 `0.0000%` 静默损坏**。同时，完全免除商业 `Vivado` 许可的开源工具链 `openXC7`（`Yosys` + `nextpnr-xilinx 0.8.2` + `Project X-Ray`）在真实目标型号 `xc7a200tfbg484-2` 上以 **`320.62 MHz`（`250.0 MHz` 目标 `PASS`，`0` 个 `DSP48E1`）** 完成物理布局布线后静态时序收敛，并输出 **`9,730,768 B`（`77.846 Mbit`，`board_metered = false`）** 的 7 系列 `.bit` 比特流文件。

<div id="437-claim-la-35-unified-global-lut-synthesis-lupanov-1958-treelut-2025-kan-lut-2025-and-1474-kb-browser-native-no_std-lut6_corewasm" class="anchor-alias" aria-hidden="true"></div>

### 4.37 主张 LA-35：统一全球 `LUT` 综合范式（`Lupanov` `1958`、`TreeLUT` `2025`、`KAN-LUT` `2025`）与 `14.74 KB` 浏览器原生 `#![no_std]` `lut6_core.wasm`

前苏联 Lupanov 渐近共享余因子分解（1958；`k=8`, `m=16`）将 `LUT6` 门数削减 **`-72.50%`**（`80` $\to$ **`22` 个 `LUT6`**，`256 / 256` 最小项精确一致），`TreeLUT` 将 `31` 节点 5 层 `GBDT` 折叠为 **`1` 个 `LUT6`（`0x195cb9f4b9a80800`）**，`KAN-LUT` 将连续 B 样条激活编译为 **`8` 个 `LUT6`（运行时 `0` `FLOP`，`RMSE = 0.003466`）**；同时 `lut6-core` 交叉编译覆盖 **`8` 个 `#![no_std]` 目标**，其中包括 **`15.31 KB`（`15,679 B`，零外部依赖）的 `lut6_core.wasm`**，可在 [/living/lut-adapt/#la-wasm-01](/living/lut-adapt/#la-wasm-01) 浏览器虚拟机中直接实时运行（图 9）。

<figure class="my-8">
  <img src="/figures/lut-adapt/global-frontiers-antisym-seu-wasm.svg" alt="全球多前沿推进：反对称 40 项 T-MAC、SEU SECDED 辐射韧性、openXC7 布局布线后比特流、Aeneas Rust-至-Lean 验证与 15.31 KB WebAssembly。" />
  <figcaption>图 9. 全球多前沿实测结果（`主张 LA-19 [58 条定理]、LA-33..LA-35`）：(A) `ISCA` 2025 反对称 `40` 项 `T-MAC`（栈 `SRAM` `-49.38%`、`Thor` 物理分流 `1.65×` `CpJ`、`Zen 5` `RAPL` `1.12×` `CpJ` 反超）；(B) 宇宙射线 `SEU` 位翻转韧性（`BER = 1%` 下凭 `(72, 64)` `SECDED` + `0x3C` 达成 `100.00%` 存活率与 `0.0000%` 静默损坏）；(C) Lupanov `-72.5%` 共享余因子削减、`TreeLUT`、`KAN-LUT`，以及 `XC7A200T-2FBG484-2` 上免许可 `openXC7` `320.62 MHz` 布局布线后 `.bit` 比特流；以及 (D) Inria `Charon`+`Aeneas` `#![no_std]` Rust $\to$ `Lean 4.36.0` 验证、`58` 条六内核定理（全仓 `1,422` 条）与 `15.31 KB` `lut6_core.wasm`。</figcaption>
</figure>

<div id="438-claim-la-36-smart-glasses-and-smartwatch-micro-llms-sensenteulm-28m-smollm2-135m-liquidailfm25-230m-qwen3-06b-vs-wearable-mol-5984-b-watch-sram-fit-and-000-prefix-poisoning" class="anchor-alias" aria-hidden="true"></div>

### 4.38 主张 LA-36、LA-37 与 LA-38：智能眼镜与智能手表微型大模型（`Sensente/uLM-28M`、`LFM2.5-230M`）对比 `Wearable-MoL`（`5,984 B`）、`lastexam.ai` 认知校准（`5.37×` `RMS` 误差削减、`0.00%` `CHR@80`）、`hle:3r2s` 金丝雀隔离与 `58` 条六内核定理

`src/clai/frontier/wearable_microllm_and_lastexam.py`、`sys/lut6-core/src/wearable_epistemic.rs` 与 `proofs/LutAdapt/WearableLastExam.lean`（新增 `8` 条构造性定理，使 `LutAdapt` 总定理数增至 **`58` 条**［`con-leche`/`con-ron` `58,802` 项声明］、Linux `bwrap` 全仓增至 **`1,422` 条定理**）系统评测了智能眼镜与手表端的亚十亿微型语言模型及 `Humanity's Last Exam`（`https://lastexam.ai/`，Phan et al., *Nature* 2026；严格遵守 `cais/hle` `HTTP 403` 访问门禁，零绕过）协议下的认知谦逊校准（图 10）：
- **装入 `5,984 B`（`64 KB` 智能手表 `SRAM` 的 `9.13%`）且 `0.00%` 前缀污染（`LA-36`）**：即便采用 `INT4` 量化，UW 与 Meta 联合发布的智能眼镜微模型 `Sensente/uLM-28M`（`28.84M` 参数，`|V| = 12,288`，Cheng et al., *EMNLP* 2026）仍需 `13.75 MB`（超出 `Nordic nRF52832` `64 KB` `SRAM` 达 `214×`），且其协同前缀掩码在白板博士/奥赛难题上对 **`93.75%`（`15/16`）** 的前沿回答播报了错误开场前缀；而 `Wearable-MoL` 仅占 **`5,984 B`（`9.13%`）**，在日常可穿戴意图上达 **`97.92%`**（能耗 **`0.0019 mJ/查询`**，`250 mAh` 眼镜电池可支撑 `~1.80 × 10⁹` 次 `est_queries`），并在 `< 1.4 µs` 内触发 `EpistemicHoldEscalate`，将**前缀污染降至 `0.00%`**。
- **`32` 道 `SHA`-256 锁定公开前沿题上的 `lastexam.ai` 协议校准（`LA-37`）**：在 `m-a-p/SuperGPQA` 的 `16` 道 `hard` 十选一（`MC10`）博士题与 `MathArena/aime_2025` 及 `hmmt_feb_2025` 的 `16` 道 2025 奥赛精确匹配题（磁盘持久化原始题干/答案字符串为 `0`）上，`28.8M` 至 `34.66B` 的所有独立模型均出现严重过度自信（`RMS-CE = 59.75%–87.42%`，`CHR@80 = 81.25%–96.88%`）。`MoL Epistemic Cascade` 在并列第一准确率（总计 `18.75%` / `SuperGPQA` `hard` `37.50%`）的同时，将 `RMS` 校准误差削减 **`5.37×`**（`70.62%` $\to$ **`13.14%`**），将 **`CHR@80` 降至 `0.00%`**，并将选择性提交准确率提升 **`2.13×` 至 `40.00%`**。
- **`56 + 8 = 64` 比特双射打包、`hle:3r2s` 金丝雀隔离与四硅片实测（`LA-38`）**：`pack_ulm4_56bit` 将 `4` 个 `uLM-28M` 词元（`56` 比特）+ `8` 比特认知头部装入单个 `uint64`，`admit_to_wearable_crystal` 拦截一切含 `hle:3r2s` 的提示（`0` 道基准题被结晶），且 `Window 10` 对比 `Window 11`（`1/16` 层 `uLM-28M`）在 **`NVIDIA Jetson AGX Thor`（`TI INA3221` 物理分流，`board_metered = true`）上录得 `2,803.25` 对比 `623,920.52 nJ/op`（物理 `measured_j` 降低 `222.57×`；位切片达 `162.71 nJ/op` = `87.25×`）**，在 `Apple M5 Max` 上降低 **`313.24×`**，在 `AMD Zen 5` `RAPL` 上降低 **`259.31×`**，并在实时连接的 `OpenMV-AE3` Cortex-`M55` 上达 **`556.94`（`1.399 µs`）对比 `1,528,901.48` 个 `DWT` 周期（快 `2,745.18×`，`board_metered = false`）**（[/living/lut-adapt/#la-hle-01](/living/lut-adapt/#la-hle-01)）。

<figure class="my-8">
  <img src="/figures/lut-adapt/wearable-microllm-and-lastexam.svg" alt="智能眼镜与手表微型大模型遇上 LastExam 认知校准：5,984 B 手表 SRAM Nucleus、零前缀污染门控与多尺度校准。" />
  <figcaption>图 10. 可穿戴微模型与 `LastExam` 协议实测结果（`主张 LA-19 [58 条定理 / 全仓 1,422 条]、LA-36..LA-38`）：(A) `64 KB` 智能手表 `SRAM` 适配（`5,984 B` = `9.13%` 对比 `uLM-28M` `INT4` 的 `13.75 MB`）及 `Jetson AGX Thor`（`222.57×` `measured_j`）、`Zen 5`（`259.31×`）、`M5 Max`（`313.24×`）与实时 `OpenMV-AE3` Cortex-`M55`（`2,745.18×` `DWT` 周期）收益；(B) `64` 查询双峰流准确率与 `0.00%` 前缀污染；(C) `RMS-CE` 削减 `5.37×`（`13.14%` 对比 `70.62%`）与 `0.00%` `CHR@80`；以及 (D) `58` 条六内核 `Lean 4.36.0` 定理与 `hle:3r2s` 金丝雀隔离。</figcaption>
</figure>

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

**测量有效性且未声明。** 物理直流电流分流器焦耳读数（仅在 `主张 LA-24 与 LA-28` 中通过 `NVIDIA Jetson AGX Thor` 上的 `TI` `INA3221` `VDD_CPU_SOC_MSS` 与 `INA238` `VIN` 测得的 `measured_j`，`board_metered = true`）、操作系统与片上计数器读数外加裸机 `MCU` 周期计数（来自 `Linux RAPL`、`amdgpu` `PPT`、`NVML`、Apple Silicon `L2` `libIOReport` `'GPU Energy'` + `L3` `proc_pid_rusage` `ri_energy_nj` 以及实时连接 `Alif Ensemble E3` 的 `DWT` 周期的 `reported_j`，`board_metered = false`）、整机 macOS `PMU` 累计增量，以及解析焦耳数、开关功率和电热包络数值（`est_j/VC`、`est_j/tok`、`est_mJ/Byte`，§4.22 与 §4.25 中 `Verilator` `VCD` + `AMD DS925` `0.72 V` 的 `est_pJ/cycle` 与 `est_mW` 界限，以及 §4.32 中 `AMD DS181` + `UG475` `1.00 V` `XC7A200T` M.2 的 `est_mW` / `est_C` 界限）均严格分开，绝不跨层级相加。Yosys `0.71+` 与 Verilator `5.054` 确立的是结构化 `xck26` 与 `XC7A200T` 网表综合（`xck26` 上 `41,465` 个 `xcup` LUT，`XC7A200T` 上 `62,211` 个 `xc7` LUT + `83` 个 `RAMB36E1` / `365` 晶体库，单周期逻辑级数 `12`-`13` 级，`0` 个 `DSP48`）、`64/64` `abc -lut 6` `.lut6` 布尔 miter 等价性、跨 `12,023` 个周期的 `10,500/10,500` `XC7A200T` 与 `KV260` 向量等价性、`320/320` `CE` 一致性、`256/256` 零气泡 `CPI = 1.00` 周期仿真，以及基于 `VCD` 翻转率的动态开关 `est_mW`（`xck26` 空闲 `15.59 est_mW`，`XC7A200T` 门件空闲 `50.65 est_mW`；含 `55.2 est_C` 耦合 `DS181` 静态漏电时 M.2 `3.3V` 为 `862.6 est_mW`），而非商业版 Vivado 布局布线后 `250 MHz` 时序收敛，亦非物理 KV260 或 Numato Aller A7 电源轨瓦数（所有 `xck26` 与 `XC7A200T` `FPGA` 行及交叉编译 `MCU` `ELF` 行的 `board_metered = false`、`measured_j = None`）。硅能效领先地位、将 `ModelGenerated` 输出提升为 `Deterministic`，以及超出跨 `django/django`、`pytest-dev/pytest`、`psf/requests` 与 `sympy/sympy` 的 `40` 次真实上游 git 工作树评估（`主张 LA-15、LA-20`）、`48` 任务契约基准（`主张 LA-11、LA-17`）和 `16` 任务 `SWE-Mini` 基准（`主张 LA-13`）之外的完整 `500` 任务 `SWE-bench Verified` 容器评估，均不在声明之列（与此同时，真实的 `120B-A12B` 执行已在 `主张 LA-21` 中直接实测，仅 `air_mol_nvme_baselines.csv` 中的合成冷 NVMe `70B` 行仍为解析投影）。

| 编号 | 主张 | 精确反驳 / 证伪条件 |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` 在 `5,120` 个数据包上未达到 `100.0%` Verilator 一致性，或遗漏第 `2,500` 号数据包处的 VLAN 偏移。 |
| **`LA-F2`** | `Claim LA-2` (多语言套件) | Zig 在热循环中分配了 `> 0` 字节堆内存，Go 报告 `> 0 allocs/op`，或 Julia Enzyme 的有限差分误差超过 `1e-7`。 |
| **`LA-F3`** | `Claim LA-3` (KV260 分页 RTL) | `scripts/verify_paged_bram_rtl.py` 超过 `117,120` 个 LUT、`144` 个 `RAMB36E2`、`0` 个 `DSP48`，或每次页切换耗时 `1` 个周期。 |
| **`LA-F4`** | `Claim LA-4` (共形 ACI) | `scripts/run_frontier_benchmarks.py` 在偏移流量上超过目标错误风险 $\alpha = 0.02$，或标记为 `Deterministic`。 |
| **`LA-F5`** | `Claim LA-5` (字节推测) | `scripts/run_code_corpus_benchmark.py` 在 `48` 个未见提示上，相对贪婪解码 `Mamba3CodeLM` 的精确字节一致性为 `< 100.0%`。 |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` 在 `F_NOCACHE` 下未达到 `100%` 一致性，或读取的 NVMe 字节数多于 `AirLLM` 4-Bit `T=1`。 |
| **`LA-F7`** | `Claim LA-7` (2026 年 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`、`scripts/run_hf_air_mol_pretrained.py` 或 `scripts/run_hf_qwen35_air_mol.py` 与贪婪目标相比偏离 $\ge 1$ 个 BPE token。 |
| **`LA-F8`** | `Claim LA-8` (回归套件) | `pytest -v` 在 `tests/` 的 `61` 个测试中任一失败。 |
| **`LA-F9`** | `Claim LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` 的 token 一致性偏离 `100%`，或读取的 NVMe 字节数多于 `AirLLM` 或 `Expert-AirLLM`。 |
| **`LA-F10`** | `Claim LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` 相对稠密 `ITQ` 二值矩阵乘法的最大误差超过 `1e-3`，或未通过 `100%` 已验证一致性。 |
| **`LA-F11`** | `Claim LA-11` (`48` 任务对比评测) | `scripts/run_frontier_ai_bakeoff.py` 接受了 `> 0%` 的损坏提交，或在 Wave-2 规格变异下接受了过时的 Wave-1 技能。 |
| **`LA-F12`** | `Claim LA-12` (Metal `INT4` MoE) | `scripts/run_metal_moe_benchmark.py` 的 `FP32` 着色器误差超过 `1e-4`，或在 `8.5B` 或 `35B` 上偏离 `100%` 贪婪 token 一致性。 |
| **`LA-F13`** | `Claim LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` 接受了 `> 0%` 的损坏补丁、修改了 `tests/`，或未能捕获 Wave-2 的 `R03` 规格变异。 |
| **`LA-F14`** | `Claim LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` 在 OpenAI REST/SSE、`MCP` `JSON-RPC 2.0`、`.mol/` 重载上失败，或写入了 `measured_j`。 |
| **`LA-F15`** | `Claim LA-15` (`BCB` + `SWE-bench`) | `scripts/run_external_public_benchmarks.py` 未通过 Parquet `SHA`-256 校验、暴露了标准解答/补丁，或准入了 `> 0%` 的破损输出。 |
| **`LA-F16`** | `Claim LA-16` (`250 MHz` `xck26` RTL) | `scripts/verify_pipelined_250mhz_rtl.py` 单周期逻辑级数超过 `20`、`P4-AXIS` 上超过 `189` 个 `IOB`、使用了 `> 0` 个 `DSP48`，或未通过 `256/256` `CPI = 1.00` Verilator 一致性。 |
| **`LA-F17`** | `Claim LA-17` (`Rung 3d` `<think>`) | `scripts/run_rung3d_thinking_ceiling.py` 准入了 `> 0%` 的破损提交、调用了云端 API，或未能将已验证通过率提升至 `87.50%` 以上。 |
| **`LA-F18`** | `Claim LA-18` (Rust `CubeCL` MoE) | `cargo run --release --bin bench_cubecl_moe_deltanet` 在 `LLVM` `CPU` 或 `Metal` `GPU` 上的 `FP32` 误差超过 `1e-4`，或取得的 Metal 加速比 `< 25×`。 |
| **`LA-F19`** | `Claim LA-19` (`6` 内核 `Lean 4.36.0` 证明) | `scripts/verify_lean_proofs.py` 或 `lake check --paranoid` 在 `6` 个独立内核（`con-leche`、`con-ron`、`lean4lean`、`nanoda`、`leanchecker`、`lean`）中任一失败，包含 `>= 1` 个 `sorry` / `opaque` / `ofReduceBool`，或新增了 `>= 1` 条自定义公理。 |
| **`LA-F20`** | `Claim LA-20` (`4` 仓库 `SWE-bench`) | `scripts/run_multirepo_swebench_benchmark.py` 暴露了 `patch`、评估了 `< 4` 个仓库、准入了 `> 0%` 的破损补丁，或未能超越独立运行的 `24B`/`35B`。 |
| **`LA-F21`** | `Claim LA-21` (`120B` 混合 MoE) | `scripts/run_120b_hybrid_moe_benchmark.py` 本地 `120B-A12B` 运行失败、准入了 `> 0%` 的破损提交，或记录到 `0%` 的 Wave-2 `.mol/` 快速路径命中率。 |
| **`LA-F22`** | `Claim LA-22` (`CE` 门控 `VCD` 功耗) | `scripts/verify_ce_gated_vcd_power.py` 未通过 `320/320` `CE` 一致性、超过 `189` 个 `IOB`，或取得的空闲动态功耗降低幅度 `< 3.5×`。 |
| **`LA-F23`** | `Claim LA-23` (Rust `mol-agent-rs`) | `cargo run --release --bin mol_agent -- --self-test-bench` 在 `/v1` 或 `/mcp` 上依赖 Python、`--mcp-stdio` 失败，或相对 Python `MCP` 取得的加速比 `< 10×`。 |
| **`LA-F24`** | `Claim LA-24` (`6` 主机集群与 `Thor` 分流 `measured_j`) | `scripts/aggregate_fleet_measured_j.py` 混用 `measured_j` 与 `reported_j`、在 `Jetson AGX Thor` 上录得 `>= 1%` 的 `VIN` 漂移，或在 `W2`、`W3`、`W5` 上未能取得 `4/4` `ABBA` 节省。 |
| **`LA-F25`** | `Claim LA-25` (`4` 厂商 `GPU` `CubeCL` 一致性) | `scripts/aggregate_multivendor_cubecl_gpu.py` 在 Apple、`AMD`、`NVIDIA` 或 Intel `GPU` 上的 `FP32` 误差超过 `1e-4`，或相对主机标量参考取得的 `GPU` 加速比 `< 10×`。 |
| **`LA-F26`** | `Claim LA-26` (`#![no_std]` `lut6-core`、`MCU` `ELFs` 与 Yosys Miter) | `sys/lut6-core` 中 `cargo test --release` 失败、`CompactLut6Page` 偏离 `4,096 B`、Cortex-`M55` / `M0`+ / `nRF52832` `M4F`（`64 KB` `SRAM`）/ `RV32IMAC` `ELFs` 链接失败或发出 `>= 1` 条浮点指令，或 `scripts/pack_lut6_crystal.py` 未通过 `64/64` 项 Yosys `abc -lut 6` miter 检验。 |
| **`LA-F27`** | `Claim LA-27` (`DiffLUT-Net`、摆动 `FWHT` 与经济性审查) | `scripts/run_dual_reality_lut6_eval.py` 相对未剪枝 `DWN` 的活跃 `LUT6` 剪枝率 `< 55%`、噪声唤醒抑制率 `< 85%`、静默损坏 `> 0%`、`OOD` 弃权 `< 100%`，或在任一摆动密码子上出现 `> 0` 的 `>=5` 阶 `FWHT` 噪声。 |
| **`LA-F28`** | `Claim LA-28` (`Thor` 分流 `measured_j` 与实时 `Alif E3` `DWT`) | `scripts/aggregate_phase30_lut6_hardware.py` 在非 `Thor` 目标上标记 `board_metered = true`、位切片 `Thor` 分流增益 `< 10×`，或在 `OpenMV-AE3` Cortex-`M55` 上标量延迟超过 `10 µs`。 |
| **`LA-F29`** | `Claim LA-29` (2026 年 10-11 月循环与混合模型) | `scripts/run_nov2026_models_lut6_benchmark.py` 在 `Inkling-2-Mini`、`Dory1.0-4B`、`LFM2.5-24B-A2B` 或 `Nemotron-3.5-Bolt-E4B` 上偏离 `>= 1` 个贪心词元（一致性 `< 100.0%`）或每次三词元突发超过 `64` 比特。 |
| **`LA-F30`** | `Claim LA-30` (`XC7A200T` M.2 `2280` 移植与电热 `est_j`) | `aller-a7-xc7a200t` 超过 `134,600` 个 `xc7` LUT 或 `365` 个 `RAMB36E1`、使用了 `> 0` 个 `DSP48E1`、在 `10,500` 个向量（`12,023` 周期）上相对 `XCK26` 出现 `>= 1` 比特失配、无串联 `+3.3V`/`5V` 分流器即标记 `board_metered = true`，或上机测试时在 $T_A \le 45\,^\circ\text{C}$（`DDR3` 关断、被动散热）下超过 M.2 `3.3V` `1,000 mA`、Tachyon `5V` 合计 `1,600 mA` 或 `XADC` $T_J$ `85.0 °C`。 |
| **`LA-F31`** | `Claim LA-31` (`672 B` 零 `MUL` `EntroMCU`/`T-MAC` 尾部与 `rustc` `const` 门控) | `CompactLut6Page` 偏离 `4,096 B`（`0` 空闲字节）、三进制 5-trit 往返失败、`mol_skills_tmac_tail.lut6` 准入 `> 0%` `OOD` 误命中，或 `rustc` 未通过编译期 `generated_proof_vectors.rs` 断言。 |
| **`LA-F32`** | `Claim LA-32` (`Two-Tier LUT6 + T-MAC` 与 `Thor` 分流 / `DWT` 遥测) | `bench_lut6_nucleus_shunt` 在 `Jetson AGX Thor` 上录得零 `MUL` `T-MAC` 相对 `INT8` Micro-`MLP` 的物理 `CpJ` `<= 1.0×`，或在 `OpenMV-AE3` Cortex-`M55` 上加速比 `<= 5.0×`。 |
| **`LA-F33`** | `Claim LA-33` (`Antisym-40 T-MAC` 与 Inria `Charon`+`Aeneas` Rust $\to$ Lean) | `lookup_tmac_antisym41` 在 `40,500` 组配对中与 81 项 `T-MAC` 失配、未能在 `Thor`（`measured_j`）与 `Zen 5`（`RAPL`）上同时取胜，或 `Lut6Verify_Aeneas.lean` 未通过 `Lean 4.36.0` 内核检查。 |
| **`LA-F34`** | `Claim LA-34` (`SEU` `SECDED` 韧性与 `openXC7` `XC7A200T` `.bit` `PAR`) | `Nucleus` `(72, 64)` `SECDED + 0x3C` 在 `BER = 1%` 下出现 `> 0%` 静默损坏或 `< 100%` 存活率，或 `openXC7` `nextpnr-xilinx` 在 `xc7a200tfbg484-2` 上未通过 `250 MHz` 时序收敛或未能输出 `.bit`。 |
| **`LA-F35`** | `Claim LA-35` (`Lupanov` / `TreeLUT` / `KAN-LUT` 与 `15.31 KB` `lut6_core.wasm`) | `Lupanov`（`k=8`）、`TreeLUT` 或量化 `KAN-LUT` 偏离 `>= 1` 个最小项，或 `lut6_core.wasm` 超过 `16 KB` 或未通过 `V8` `WebAssembly.instantiate` 校核。 |
| **`LA-F36`** | `Claim LA-36` (`Wearable-MoL` 对比智能眼镜微模型) | `Wearable-MoL` 第 0 梯级超出 `64 KB` 手表 `SRAM`、在白板难题上出现 `> 0%` 前缀污染，或将 `>= 1` 道基准题结晶。 |
| **`LA-F37`** | `Claim LA-37` (`LastExam` 协议校准与 `CHR@80`) | `scripts/run_wearable_and_lastexam_benchmark.py` 绕过 `cais/hle` 门禁、持久化原始题干、录得 `> 5%` `CHR@80`，或相对 `Qwen3.6-35B-A3B` 的 `RMS-CE` 降幅 `< 3×`。 |
| **`LA-F38`** | `Claim LA-38` (`56` 比特 `uLM-28M` 开场、`hle:3r2s` 隔离与 `58` 条证明) | `pack_ulm4_56bit` 往返失败、`admit_to_wearable_crystal` 放行含 `hle:3r2s` 的提示、`WearableLastExam.lean` 在 `6` 个内核（`58/58`）中任一失败，或 `Window 10` 在 `Thor` 物理分流器上增益 `< 50×`。 |

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
<li>Ye, J., Gong, X., Wang, J., Kondrateva, O., Li, B., and Zhang, G. L. (2026). DiffLUT-Net: Differentiable Training of FPGA LUT Networks with Learnable Connectivity. <em>arXiv:2609.09254</em>.</li>
<li>Andronic, M., and Constantinides, G. A. (2025). NeuraLUT-Assemble: Hardware-Aware Assembling of Sub-Neural Networks for Efficient LUT Inference. <em>IEEE FCCM 2025</em>, <em>arXiv:2504.00592</em>.</li>
<li>Tian, R., Chen, Y., Xu, W., and Rosing, T. Š. (2026). PALUTE: Processing-In-Memory Acceleration via Lookup Table for Edge LLM Inference. <em>arXiv:2606.08891</em>.</li>
<li>Sanyal, A., Chinchali, S. P., and Datta, G. (2026). EntroMCU: A Hardware-Algorithm Vision for LLM Inference on Microcontrollers. <em>IEEE ISVLSI 2026</em>.</li>
<li>Linial, N., Mansour, Y., and Nisan, N. (1993). Constant Depth Circuits, Fourier Transform, and Learnability. <em>Journal of the ACM</em>, 40(3):607-620.</li>
<li>Thinking Machines Lab (2026). <code>thinkingmachines/Inkling-2-Mini</code> Open-Weights Looped Multimodal MoE Model Card (November 20, 2026). <a href="https://huggingface.co/thinkingmachines/Inkling-2-Mini">huggingface.co/thinkingmachines/Inkling-2-Mini</a>.</li>
<li>NVIDIA Nemotron Labs (2026). <code>nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16</code> Looped nGPT Model Card (October 20, 2026). <a href="https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16">huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16</a>.</li>
<li>Advanced Micro Devices (2023). <em>Artix-7 FPGAs Data Sheet: DC and AC Switching Characteristics (DS181, v1.28)</em> and <em>7 Series FPGAs Packaging and Pinout Product Specification (UG475, v1.19)</em>. AMD Technical Documentation.</li>
<li>Mo, Z., Wang, L., Wei, J., Zeng, Z., Cao, S., Ma, L., Jing, N., Cao, T., Xue, J., Yang, F., and Yang, M. (2025). LUT Tensor Core: A Software-Hardware Co-Design for LUT-Based Low-Bit LLM Inference. <em>ACM/IEEE ISCA 2025</em>, <em>arXiv:2408.06003</em>.</li>
<li>Bacellar, A. T. L., Lima, G. M., França, F. M. G., and John, L. K. (2026). Fault-Tolerant Weightless Neural Networks Under Parameter Bit-Flip Errors. <em>Transactions on Machine Learning Research (TMLR)</em>, July 2026.</li>
<li>Bührer, T., Plesner, A., Aczel, T., and Wattenhofer, R. (2026). BitLogic: Scaling Continuous Logic Gate Networks via Lookup Tables. <em>ETH Zürich</em>, <em>arXiv:2602.07400</em>.</li>
<li>Khataei, A., and Bazargan, K. (2025). TreeLUT: An Efficient Architecture for Gradient Boosted Decision Trees Using FPGA Lookup Tables. <em>arXiv:2501.01511</em>.</li>
<li>Lupanov, O. B. (1958). Ob odnom metode sinteza skhem [On a Method of Circuit Synthesis]. <em>Izvestiya VUZov, Radiofizika</em>, 1(1):120-140.</li>
<li>Ho, S., and Protzenko, J. (2022). Aeneas: Rust Verification by Functional Translation (<code>AeneasVerif/charon</code> &amp; <code>AeneasVerif/aeneas</code>). <em>ICFP 2022</em>, <em>PACMPL</em> 6(ICFP):711-741, <a href="https://doi.org/10.1145/3547647">doi:10.1145/3547647</a>.</li>
<li>He, Z., Yin, X., Wen, Z., Zhu, C., Liu, K., Wei, J., Wu, Y., Cao, T., and Yang, M. (2025). LUT-LLM: Efficient Large Language Model Inference with Memory-Compute Co-Design on FPGAs. <em>arXiv:2511.06174</em>.</li>
<li>Phan, L., Gatti, A., Han, Z., Li, N., Hu, J., Zhang, H., Zhang, C. B. C., Shaaban, M., Ling, J., Shi, S., et al. (2026). Humanity's Last Exam (<code>cais/hle</code>, <a href="https://lastexam.ai/">lastexam.ai</a>). <em>Nature</em>, 649:1139-1146, <em>arXiv:2501.14249</em>.</li>
<li>Cheng, J., Li, S., Zhang, Y., et al. (2026). Micro Language Models Enable Instant Responses (<code>Sensente/uLM-28M</code>, University of Washington &amp; Meta AI). <em>EMNLP 2026</em>, <em>arXiv:2604.19642</em>.</li>
<li>M-A-P Team, ByteDance Seed, et al. (2025). SuperGPQA: Scaling LLM Evaluation across 285 Graduate Disciplines (<code>m-a-p/SuperGPQA</code>). <em>arXiv:2502.14739</em>.</li>
<li>Liu, X., et al. (2026). MicroLLM-R1: Reasoning on Microcontrollers and Ultra-Small Edge Devices. <em>arXiv:2603.24967</em>.</li>
</ol>

---

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## 附录 A. 可复现性

在 [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)（提交 `dc45357`）与 [openIE-dev/openie-research-experiments](https://github.com/openIE-dev/openie-research-experiments)（`aller-a7-xc7a200t/` 与 `lut6-core-nucleus/`）的代码检出目录中执行：

```bash
PYTHONPATH=src .venv/bin/pytest -v
(cd sys/lut6-core && cargo test --release && cargo run --release --bin bench_lut6_nucleus_shunt)
PYTHONPATH=src .venv/bin/python scripts/run_wearable_and_lastexam_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_global_frontiers_seu_treelut_kan.py
PYTHONPATH=src .venv/bin/python scripts/run_charon_aeneas_rust_to_lean.py
PYTHONPATH=src .venv/bin/python scripts/run_openxc7_xc7a200t_par_audit.py
PYTHONPATH=src .venv/bin/python scripts/pack_lut6_crystal.py
PYTHONPATH=src .venv/bin/python scripts/run_dual_reality_lut6_eval.py
PYTHONPATH=src .venv/bin/python scripts/run_nov2026_models_lut6_benchmark.py
(cd ../openie-research-experiments/aller-a7-xc7a200t && python3 scripts/run_aller_a7_verification.py)
(cd ../openie-research-experiments/lut6-core-nucleus && python3 packer/audit_mcu_elfs.py)
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
