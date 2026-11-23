---
title: "饱足基准（Satiation Benchmark）：参考线束、适配器与遥测归因"
deck: "固定顺序的 Rust 参考线束（Lane B）、单一代理强制执行的适配器桥接层（覆盖 Shapes D、M、H 和 I）、十二项一致性检查套件（C1 至 C12），以及五级无根权限遥测归因引擎（L0 至 L4 与标签 A1 至 N 的交叉组合）。该体系已在五种硬件原型上完成实证验证：Apple M5 Max（arm64 macOS，IOReport 与 proc_pid_rusage 提供的 reported_j）、Tegra aarch64 Jetson Thor（整板物理测量与三通道分轨电流分流器提供的 measured_j）、Framework Desktop Strix Halo（x86-64 Linux，由 0440 root:energy 组隔离保护的封装能耗 reported_j，并辅以图形封装功率跟踪）、Intel Core i9-13900H Raptor Lake（x86-64 Linux，平台级 L1 与 0 号封装级 L2 的 reported_j），以及 Windows 11 build 26300 上的 Intel Core i7-1165G7 Tiger Lake 与 GeForce 2060（x86-64，无根权限的独立显卡累计 L2 reported_j、Win32 Job Object 与周期计数，以及处理器封装级标签 N）。原始 measured_j、reported_j 与 L4 逻辑通道始终严格分离，绝不相加。由于共享主机上运行了同时存在的其他租户工作负载（dedicated_host 为 false），依据证伪条件 6（Falsifier 6），A2 净放置归因结果予以保留，不作报告。"
lang: "zh-Hans"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*修订版 af57f48，2026 年 11 月 22 日。数据与摘要：[/data/#satb-harness](/data/#satb-harness)。交互式动态图表：[/living/satb-harness/](/living/satb-harness/)。LaTeX 存档版本：[/pdfs/latex/satb-harness.pdf](/pdfs/latex/satb-harness.pdf)（[源文件](/pdfs/latex/satb-harness.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概述

当两个代理评估报告不同的任务完成率或不同的能耗数值时，差异常常来源于模型的包装方式以及主机计数的归因方式，而非模型本身。仅更换外围线束就使 `Gemini 2.5 Pro` 在 `Terminal-Bench 2` 上的任务解决率变化了 `17` 个百分点，而减去漂移的空闲基线或通过处理器时间分割共享硅轨道则可导致能耗归因误差超过 `30%`。

本研究规定并实证验证了 **饱足基准（Satiation Benchmark）(`SATB`)** 评估合同：一个固定的顺序 Rust 参考线束（**`Lane B`**），一个代理隔离的适配器桥接（**`Shapes D, M, H, and I`**）用于零模型控制、原始模型端点、外部命令行线束以及公共基准求解器，一个五块的系统待测（`SUT`）加密指纹，十二项强制一致性检查，和一个五层根less 遥测引擎。我们不再让设计悬而未测，而是在 **五种硬件原型** 跨 `macOS`、`Linux`、`Windows 11` 上执行实时一致性和伪造器基准：一台 `Apple M5 Max` 工作站（`128` GB 统一内存，`macOS 27.2.1`，芯片内 `IOReport` 与内核 `proc_pid_rusage` `reported_j`），一套 Tegra `aarch64` 开发套件（`Jetson Thor`，`Linux 6.8.12-1021-tegra`，物理 Texas Instruments 整板和三通道轨分离电流分流 `measured_j`），一台 `Framework` 桌面 `Strix Halo` 工作站（`Ryzen Max+ 395`，`Linux 7.0.0-43-generic x86-64`，`0440 root:energy` 组隔离的包能耗 `reported_j` 加上 `amdgpu` 包功率跟踪），一台 `Raptor Lake` 工作站（`Intel Core i9-13900H`，`Linux 7.0.0-43-generic x86-64`，平台与包能耗 `reported_j`），以及一台裸金属 `Windows 11` 工作站（`Intel Core i7-1165G7` 加 `GeForce 2060`，`Windows 11` 构建 `26300` `x86-64`，rootless 累计离散显卡 `reported_j`，Win32 Job Object 限制，以及严格标记为 `not_available` 的非特权处理器-包能耗），并附带闭源云服务器能耗（`not_available`）。

**用通俗语言**

1. 代理的提示循环、上下文裁剪规则和工具沙箱能够像更换底层模型一样显著影响基准分数，因此 `Lane B` 在确定性的 Rust 中将该包装器完全固定，而 `Lane O` 则通过一个经审计的代理插件强制使用外部包装器。  
2. 能量通道在其真实的物理边界处原始记录, , 整壁插头、板卡输入、芯片封装、操作系统进程估计或逻辑令牌账本, , 绝不合并为单一未标记的数值，也不跨证据类别（`measured_j` 与 `reported_j` 与 `est_j`）求和，或使用舰队可持续性平均值进行回填。  
3. 在五个硅片和操作系统平台（`macOS`、`Linux` 和 `Windows 11`）上的实时测试验证了精确的 `Shape D` 百万记录内存映射 (`15027705736`) 和 `C9` 回放 (`149,747 B`、`0` 换行或字节差异) 的确定性，`0.87-9.54 ms` 内核进程树清理（`Windows 11` 上通过 Win32 Job Objects 为 `2.46 ms`），云端 `temperature = 0` 在三家供应商间的非确定性，硬件传感器采样上限（Linux 计数器读取在 `94-97 Hz` 时为 `24.3-45.4 µs`，Windows 进程内图形计数器读取在 `64.6 Hz` 时为 `1.17 ms`，Jetson Thor 上串行总线分流读取在 `66.6 Hz` 时为 `2.95 ms`，以及约 `8 Hz` 的 `macmon` `IOReport`），在按处理器时间划分顺序计算加存储阶段时出现 `32.59%-89.88%` 的误差（`Falsifier 3`），以及物理图形与处理器分流轨道分离并伴随 `Falsifier 6` 共享主机漂移门控（`dedicated_host = false`）。

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语、缩写与归因标签

<ul id="terms">
<li>SATB、SUT、PFRK、OQ、SPEC、BUNDLE、SUBMIT、REFUSE、STOP：饱足基准（Satiation Benchmark）线束与归因规范、被测系统、四类尝试结果（通过、失败、拒绝、终止）、已解决的规范开放问题、规范性规范文档、任务包文件、终态答案提交调用、终态拒绝调用，以及顺序循环终止标记</li>
<li>ACI、SWE、CLI、MCP、SDK、ACP、ARC、AGI、GUI：智能体-计算机接口、软件工程基准前缀、命令行接口、模型上下文协议、软件开发工具包、智能体客户端协议、抽象与推理语料库、通用人工智能基准套件，以及图形用户界面</li>
<li>IO、JSON、JSONL、RPC、JCS、UTF、HTTP、SSE、URL：输入/输出协议、JavaScript 对象表示法、按行分隔的 JSON、远程过程调用、JSON 规范化方案（RFC 8785）、Unicode 转换格式、超文本传输协议、服务器发送事件，以及统一资源定位符</li>
<li>POSIX、MMAP、DNULLMM1、SHA、SIGKILL、ESRCH、EACCES、EOF、NT、NTFS、CRLF、MSVC、UCRT、FFI、DLL：便携式操作系统接口、内存映射文件接口、二进制内存映射确定性空索引格式、安全哈希算法（SHA-256）、不可捕获的POSIX进程终止信号、内核无此进程状态、POSIX权限拒绝错误状态、文件结束世系文档分隔符、Windows新技术内核（`Windows NT`）、新技术文件系统、回车换行（`\r\n`）换行序列、Microsoft Visual C++编译器（`cl.exe`）、Windows通用C运行时（`ucrtbase.dll`）、外部函数接口和动态链接库</li>
<li>AI、ML、LLM、MLX、GGUF、KV、TP、ENERGY：人工智能、机器学习、大语言模型、面向本地推理的 Apple 数组框架、GPT 生成统一格式量化权重、键值缓存、张量并行，以及 ML.ENERGY GPU 功耗基准联盟</li>
<li>CPU、GPU、APU、ANE、SoC、ALU、ISA、IPC、PID、UID、GID、OS、VM、EC、GB、TGL、RTX：中央处理器、图形处理器、加速处理器、Apple神经引擎、片上系统、算术逻辑单元、指令集架构、每周期指令数、进程标识符、用户标识符、组标识符、操作系统、虚拟机、嵌入式控制器、吉字节、英特尔Tiger Lake移动架构和NVIDIA GeForce RTX独立GPU系列</li>
<li>RAM、DRAM、SLC、NVMe、PSU、PDU、AC、DC、DVFS、MSR、MMIO、RDTSC、HVCI、WMI、EMI、SRUM：随机访问存储器、动态随机存取存储器、系统级缓存、非易失性存储器快速接口、供电单元、配电单元、交流电、直流电、动态电压与频率调节、特定模型寄存器、内存映射输入/输出、x86 读取时间戳计数器指令、Windows 超级管理程序保护代码完整性、Windows 管理工具、Windows 能源测量接口 (`\\.\EnergyMeter`)、以及 Windows 系统资源使用监视器</li>
<li>RAPL、NVML、PPT、TI、I2C、ADC、INA、INA238、INA3221、AGX、VDD、SOC、MSS、VIN、SYS、PLATYPUS：英特尔/AMD 运行平均功率限制、NVIDIA 管理库、AMD 封装功率跟踪、德州仪器、集成电路间总线、模数转换器、德州仪器电流/功率监测芯片系列（`INA238`、`INA3221`）、NVIDIA Jetson AGX 模块等级、漏极供电电压轨、片上系统电压轨、存储子系统电压轨、输入系统电压轨，以及功耗泄漏攻击：利用软件攻击处理器（Power Leakage Attacks: Targeting Your Processor Using Software）</li>
<li>API、USD、CNCF、AISI、UK、AMD、NVIDIA：应用程序编程接口、美元、云原生计算基金会、AI 安全研究所、英国、先进微电子公司，以及 NVIDIA 公司</li>
<li>RCE、MoL、WCA、LUT6：Reality Code Engine [同一组织]、Mixture of Limits [同一组织]、Wise Computer Automation [同一组织]、以及 6 输入布尔查找表</li>
</ul>

在遥测等级 L0 至 L4 上，`SATB` 回执中记录的每个通道都同时携带其物理边界和以下四类严格证据类别之一：

| 证据类别 | 在 `SATB` 回执与表格中的适用范围 |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | 任务包、五块 `SUT` 指纹和重放转录的 `SHA-256` 与 `JCS`（`RFC 8785`）规范化摘要；由代理记录的提示词、缓存、推理和补全 token 计数；墙钟时长；以及带日期的 `API` 标价 `USD`。 |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | 仅由经校准的外部 `AC` 墙插分析仪（`L0`）或物理板级电流分流监测器（`L1`/`L2`）填充。已在 `NVIDIA Jetson AGX Thor` 上通过 `TI` `INA238`（`hwmon6` `VIN`，`L1`）和 `INA3221`（`hwmon5` `ch1 VDD_GPU`、`ch2 VDD_CPU_SOC_MSS`、`ch3 VIN_SYS_5V0`，`L2`/`L1`；`board_metered = true`）完成现场验证。由于采集期间有活跃的共租户占用 `VDD_GPU`（`dedicated_host = false`），原始电轨 `measured_j` 予以保留，而 `A2` 净放置归因则被暂缓；在 `Apple M5 Max`、`AMD Strix Halo`、`Intel Raptor Lake` 和 `Windows 11`（`i7-1165G7` + `RTX 2060`）上，`measured_j` 仍为 `None`，且 `L0` 墙插功率在全程均未设置。 |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | 无需 root 权限的片上遥测计数器（`Apple M5 Max` 经 `macmon` 读取的 `IOReport`：`L1` 的 `sys_power` 以及 `L2` 的 `chip_power`/`cpu_power`/`gpu_power`；`Intel Raptor Lake` 的 `RAPL`：`L1` 的 `psys` 以及 `L2` 的 `package-0`/`core`/`uncore`；`Framework AMD Strix Halo` 的 `RAPL`：`L2` 的 `package-0`/`core`，外加 `amdgpu` `PPT` 瓦数；`Windows 11` 无需 root 的 `NVML` `nvmlDeviceGetTotalEnergyConsumption` 在 `NVIDIA GeForce RTX 2060` 上给出的累计 `mJ`，`L2`），以及由 `OS` 建模的进程级估计值（`L3` 的 `macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`，标记为 `D`）。绝不与 `measured_j` 或 `est_j` 相加。 |
| **`Provider-Attested (P) vs. Not Available (N)`** | 闭源 `API` 的远端服务器能耗（以及在禁用 ring-0 `RAPL` `MSR` 驱动的 Windows 11 上的用户态 `CPU` 封装能耗）仅当提供方返回逐请求能耗数值并附带原文方法说明时才记为 `P`，否则一律记为字面值 `"not_available"`（标记 `N`）。若推导出的基线扣减未通过 `5.0%` 漂移界限（`Falsifier 6`）或 `Step 7` 求和校验，则会被自动丢弃，而原始通道保持完整。 |

<div id="11-lineage-design-invariants-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 谱系、设计不变性与同室披露

`SATB` 直接构建于公开的智能体评估与功率归因工作，而非在已有标准之处发明定制协议：最小无状态 Shell 执行遵循 `mini-swe-agent`；求解器与外部 CLI 桥接借鉴 `UK AISI Inspect`（`react()` 与 `Inspect Agent Bridge`）及 `Terminal-Bench`（`Harbor` / `Terminus-2`）；工具模式采用经 `RFC 8785`（`JCS`）规范化的 `MCP`；GPU 累积计数器规范遵循 Chung 等人的 `ML.ENERGY` / `Zeus` 以及 Yang 等人在 `nvidia-smi` 部分时间采样陷阱方面的研究；比例 `CPU` 分割（标记为 `C`）针对 `CNCF Kepler` 模型进行评估；Linux `RAPL` 权限隔离遵循 Lipp 等人的 `PLATYPUS`。配套的开放接口工程研究 [计量提交门](/papers/gates/)、[任务饱足与聚合反弹](/papers/satiation/) 以及 [确定性空值](/papers/deterministic-null/) 均为 `[same house]` 工作，仅为共享架构定义而严格引用：

| 契约轴 | 所有通道均保持的不变性 |
| :--- | :--- |
| **尝试协议** | 固定任务阶梯；每次尝试至多一个终端 `SUBMIT` 或 `REFUSE`；每次尝试一个不可变的 `SHA-256` 收据；规范结果为 `pass`、`fail`、`refuse`、`killed`；测试尝试期间零验证器反馈。 |
| **系统身份** | 五块 `SUT` 指纹（`model` + `serving` + `sampling` + `harness` + `envelope`），在 `session.open` 时哈希，并在 `session.close` 时重新哈希。 |
| **可归因能量** | 在静默专用主机上的整 `SUT` 原始窗口能量（`A2`）；在独占物理轨上的推理引擎能量（`A1`）；在 `Lane B` 下顺序的模型与工具阶段能量（`B`）。 |
| **不可归因** | 未认证的封闭 `API` 服务器焦耳（`N`）；共享 `SoC` 或统一内存轨的精确每进程焦耳份额（`C` 和 `D` 是模型，而非物理轨计量器）；与引擎内核和硅片分离的模型权重。 |

---

<div id="2-survey-of-agent-harnesses-and-why-context-policy-is-part-of-the-system" class="anchor-alias" aria-hidden="true"></div>

## 2. 智能体线束综述，以及为何上下文策略是系统的组成部分

现代编码、终端与计算机使用类驾驭框架（harness）在工具暴露方式、文件编辑管控以及对不断增长的对话历史进行压缩等方面差异显著：

| 驾驭框架 | 循环与工具面 | 上下文与历史策略 |
| :--- | :--- | :--- |
| **`mini-swe-agent`** | 仅提供 `Bash`。每次动作都会启动一个全新的无状态 `subprocess.run`。 | 严格线性、仅追加的消息历史；不做自动压缩。 |
| **`SWE-agent`（`ACI`）** | 100 行窗口化文件查看器、受 linter 把关的编辑命令、简洁搜索。 | 历史处理器将较早的环境观测折叠为有界摘要。 |
| **`Inspect react()`** | 顺序工具循环，直至调用 `submit()`：`bash()`、`text_editor()`、`MCP` 工具。 | 可编辑的消息状态，并可插入可替换的历史截断或压缩求解器。 |
| **`Inspect Agent Bridge`** | 通过本地代理包装 `Claude Code`、`Codex CLI`、`Gemini CLI` 及自定义 `SDK` 代理。 | 将上下文管理完全委托给被包装的外部驾驭框架。 |
| **`Terminus-2`（`Harbor`）** | 单一工具：接收原始按键的持久化 `tmux` 终端会话。 | 三阶段上下文摘要（`3-stage` 渐进式转录压缩）。 |
| **`Codex CLI`** | 沙箱化 shell（`Landlock`/`seccomp` 或 `seatbelt`）、结构化 `apply_patch`、`MCP`。 | 在接近模型窗口上限时触发的原生滚动上下文压缩。 |
| **`Claude Code`** | `Bash`、结构化文件工具（`Read`、`Write`、`Edit`、`Glob`、`Grep`）、`MCP`。 | 由 LLM 驱动的自动对话压缩（`auto-compact`）以及提示缓存。 |
| **`OpenHands`** | 在容器中执行任意 `ACP` 或 `CodeAct` 编码代理的事件流运行时。 | 可配置的上下文压缩器（基于 `LLM` 摘要或窗口掩码）。 |
| **`ARC-AGI-3` 运行器** | 标准驾驭框架与作用于交互式网格状态的 Provider Adapter 驾驭框架并列。 | 每个适配器轨道声明一个有界的视觉/网格状态轨迹窗口。 |
| **`OSWorld run.py`** | 桌面 `GUI` 循环，在虚拟机截图之上输出 `pyautogui` 鼠标与键盘动作。 | 滑动轨迹窗口，仅保留最近 $K$ 张截图与动作。 |

在 `Terminal-Bench 2` 上，在保持底层模型检查点不变的情况下，`Gemini 2.5 Pro` 搭配 `Terminus-2` 所解决的任务数比搭配 `OpenHands` 时**多 `17%`**。因此，上下文管理、输出截断、编辑 linting 与重试规则属于被评测系统的一级组成部分，而非中性的管道设施。`SATB` 通过将评测拆分为两条显式轨道来消解这一混淆，并关闭开放问题 `OQ-1` 与 `OQ-2`：

1. **保持包装器不变（`Lane B`）与评估外部包装器（`Lane O`）**：`Lane B`（`satb-agent`）在所有模型上固定单个可审计的 Rust 循环，而 `Lane O` 将完整的第三方线束（`Claude Code`、`Codex CLI`、`OpenHands`、`Terminus-2`、`Inspect`）包装为黑盒 `SUT`，其内部提示和压缩调用被哈希到 `harness` 指纹块中，并 100% 通过 `satb-proxy` 路由。
2. **上下文策略解析（`OQ-1`：`ContextRule_v0`）**：以零省略硬终止尝试会将多步推理与冗长工具输出混淆，而 `LLM` 生成的摘要（`Claude Code` 自动压缩）会注入隐藏的随机模型调用，从而破坏确定性线束重放。`Lane B` 采用 **`ContextRule_v0`**：当累积对话大小超过声明的上下文窗口的 **`80%`** 时，线束确定性地将最旧的工具输出替换为 `"[ELIDED_BY_CONTEXT_RULE_V0]"`，同时完整保留 `system(TEMPLATE_v0)`、初始 `user(render(bundle))` 以及 **最近 `8` 个工具输出**，且 **不进行任何模型调用**。仅当这些保留的消息单独超过窗口的 `100%` 时，才触发硬 `killed(context_ceiling)`。
3. **工具表面解析（`OQ-2`：`TOOLS_v0`）**：纯 `exec` 模式（`mini` 风格）迫使模型对多行源代码补丁和代数证明进行 shell 转义（`cat << 'EOF'`），引入与任务推理正交的 shell 引用失败，并使跨 `macOS`、`Linux` 和 `Windows` 的可移植无根沙箱化变得复杂。`Lane B` 固定 **`TOOLS_v0`**，包括四个工作区工具（`exec`、`read_file`、`write_file`、`list_dir`）以及两个终端工具（`submit`、`refuse`），通过 `JCS` 规范化后得到 `tools_hash`（`d5b102...`）。

---

<div id="3-reference-harness-lane-b-contextrule_v0-and-satb-io-protocol" class="anchor-alias" aria-hidden="true"></div>

## 3. 参考线束（`Lane B`）、`ContextRule_v0` 与 `SATB-IO` 协议

<figure class="my-8">
  <img src="/figures/satb-harness/satb-lane-b-architecture.svg" alt="饱足基准 Lane B 组件隔离拓扑与确定性会话生命周期。" />
  <figcaption>图 1. 左：`Lane B` 组件隔离，分离无根的 <code>satb-meter</code>、<code>satb-supervisor</code>、<code>satb-agent</code>、网络阻断的 <code>satb-sandbox</code>、持有凭证的 <code>satb-proxy</code> 以及不可达的外部 <code>Verifier</code>。右：确定性的 <code>SATB-IO</code> 会话与尝试序列。</figcaption>
</figure>

<div id="31-sequential-execution-loop-and-fixed-versus-configurable-split" class="anchor-alias" aria-hidden="true"></div>

### 3.1 顺序执行循环与固定项、可配置项的划分

在 `satb-agent` 内部，每次尝试都执行严格顺序的单智能体循环，不存在重叠的后台工具线程，不进行 `best-of-k` 投票，也不接受验证器的 oracle 反馈：

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

每次 `Lane B` 运行将固定的基准常量（哈希至 `harness_id`）与声明的 `SUT` 参数（哈希至 `sut_fingerprint_sha256`）分离：

| 所有 `Lane B` 运行中固定的（`harness_id`） | 每个 `SUT` 可配置的（`sut_fingerprint_sha256`） |
| :--- | :--- |
| `TEMPLATE_v0` 提示、捆绑渲染器和 `CONTINUE_v0` 提示 | `model_id`、提供者快照日期，或本地 `GGUF`/safetensors `SHA-256` |
| `TOOLS_v0` 架构（`tools/list` `JCS` 摘要）和顺序分发 | 采样参数：`temperature`、`top_p`、`top_k`、`seed`、`max_tokens`、`reasoning_effort` |
| `ContextRule_v0`（`80%` 阈值，保留最近 `8`）和 `Truncate_v0`（`8 + 8 KiB`） | 服务引擎（`llama.cpp`、`MLX`、`vLLM`、云 `API`）以及批处理/缓存标志 |
| 单次尝试（`attempts = 1`），零验证器反馈，零内部投票 | 信封上限：`wall_ms`、`max_total_tokens`、`max_turns` |
| `satb-sandbox`：`/work` 限制、精简环境、零网络出口 | 沙箱 `CPU`/`RAM` 配额、宿主硅片、`OS` 内核以及隔离层级 |

<div id="32-canonical-four-way-outcome-mapping-oq-3" class="anchor-alias" aria-hidden="true"></div>

### 3.2 规范四路结局映射（`OQ-3`）

为防止基准测试悄无声息地丢弃崩溃运行，或将自愿的错误答案与基础设施超时混为一谈，`SATB` 将遗留的五状态完成码无损映射到 **`{pass, fail, refuse, killed}`**（`PFRK`），在每份收据中保留精确的 `sub_reason`：

1. **`completed` $\to$ `pass`（`sub_reason: "verified"`，得分 `1`）**：`SUT` 在上限到期前调用了 `submit(bytes)`，且外部 `Verifier` 在 `attempt.close` 之后接受了 `bytes`。
2. **`incorrect` $\to$ `fail`（`sub_reason: "incorrect"`，得分 `0`）**：`SUT` 干净地调用了 `submit(bytes)`；外部 `Verifier` 拒绝了该候选结果。
3. **`malformed` $\to$ `fail`（`sub_reason: "malformed_submission"`，得分 `0`）**：`SUT` 自愿调用 `submit(bytes)` 并提供了无法解析或不符合模式的內容。由 `SUT` 撰写的错误提交属于准确性失败，绝非基础设施终止。
4. **`refused` $\to$ `refuse`（`sub_reason: "policy" | "capability" | "other"`，得分 `0`）**：`SUT` 显式调用了 `refuse(reason)`。
5. **`no_submission` $\to$ `killed`（`sub_reason: "wall_ceiling" | "token_ceiling" | "turn_ceiling" | "context_ceiling" | "usage_missing" | "exec_timeout_killed" | "process_crash"`，得分 `0`）**：`satb-supervisor` 在任何终端工具调用到达前终止了该尝试。所有四种结局均保留在分母 $n$ 中。

---

<div id="4-adapter-bridge-shapes-d-m-h-i-five-block-sut-fingerprint-and-c1c12-conformance" class="anchor-alias" aria-hidden="true"></div>

## 4. 适配器桥接（`Shapes D, M, H, I`）、五块式 `SUT` 指纹与 `C1-C12` 一致性

<div id="41-four-adapter-shapes-behind-one-supervisor-and-proxy" class="anchor-alias" aria-hidden="true"></div>

### 4.1 四种适配器形状在单一监督者和代理后面

`Lane B` 之外的任何系统均通过以下四种适配器形状之一连接到 `satb-supervisor`：

| 适配器形态 | 目标系统 | 执行与隔离约定 | 复用标准 |
| :--- | :--- | :--- | :--- |
| **`Shape D` (`dnull` 对照)** | 确定性空模型（`N0` 严格无模型与 `N1` 开发期固化）作用于冻结的 `DNULLMM1` `mmap` 存储 | 在 `/work` 内执行，采用相同的 `TOOLS_v0` 与 `Verifier` 规则，决策时**零次**代理模型调用。 | POSIX `mmap` / Win32 `MapViewOfFile`，`SPEC v0.4` 64 位整数循环 |
| **`Shape M` (模型端点)** | 本地开源权重服务器与闭源云端应用程序接口（`API`） | 通过 `Chat Completions` 或 `Messages` 运行 `Lane B` 的 `satb-agent`，支持工具调用并强制返回 `usage`，全部 100% 经由 `satb-proxy` 路由。 | 兼容 OpenAI 的 `API`（`llama.cpp`、`mlx_lm`、`vLLM`）；`Anthropic`、`Gemini`、`xAI` 转换器 |
| **`Shape H` (盒装线束)** | `Claude Code`、`Codex CLI`、`Gemini CLI`、`OpenHands`、`Terminus-2` | 任务写入 `/work/task/BUNDLE.md`。基础 `URL` 指向 `satb-proxy`（`127.0.0.1:<port>`）；真实 `API` 密钥不写入 `/work`；通过 `MCP` 的 `submit` 或 `refuse` 结束；除此之外无其他出口流量。 | `Inspect` 沙箱桥接环境变量；`--strict-mcp-config` `MCP`；可选 `ACP` |
| **`Shape I` (`Inspect` 智能体)** | 现有公开基准的 `Inspect` 求解器 | 以 `attempts = 1` 将 `SATB` 任务包包装为带有 `submit` 与 `refuse` 工具的形式，模型调用经由 `satb-proxy` 路由。 | `UK AISI Inspect` 的 `Task` 与 `Solver` 接口 |

<div id="42-five-block-sut-fingerprint-and-session-validity" class="anchor-alias" aria-hidden="true"></div>

### 4.2 五块 `SUT` 指纹与会话有效性

在 `attempt.start` 能够触发之前，适配器需返回一个五块 JSON 结构，其规范 `JCS` `SHA-256` 摘要定义了 `SUT`。未知或不可观测字段必须按字面写为 `"not_available"`，绝不能省略或猜测：

| 指纹块 | 必填字段（不可用值按字面写为 `"not_available"`） |
| :--- | :--- |
| **`model`** | `provider`, `model_id`, `snapshot_date`, `weights_sha256`, `quantisation`, `tokenizer_hash`, `chat_template_hash`, `context_window`, `system_fingerprint` |
| **`serving`** | `engine`, `version`, `commit`, `binary_hash`, `flags_hash` (`cache_prompt`, `slots`, `batch_invariance`, `TP`), `drivers`, `devices` |
| **`sampling`** | `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `stop`, `reasoning_effort`, `tool_choice` |
| **`harness`** | `name`, `version`, `commit`, `binary_hash`, `prompt_hash`, `tools_hash`, `context_policy`, `internal_voting`, `sub_agents`, `config_hash` |
| **`envelope`** | `hardware`, `os_kernel`, `isolation_tier`, `cgroup_limits`, `cpuset`, `network_policy`, `ceilings`, `telemetry_config_hash` |

**会话作废与起止金丝雀。** 在 `session.close` 时任何块摘要发生变化、任何 `MCP` `tools/list_changed` 通知、推理引擎重启、`NVML` 计数器重置、会话中途回显的 `model` 或 `system_fingerprint` 发生变化，或 `OS`/驱动程序更新，均会将**该会话内的每一份结果标记为 `void`**。作废结果仍保留在公共归档中以供审计，但会被排除在基准排名之外。由于云提供商可在固定 `model_id` 背后交换权重或量化方式而不更新 `system_fingerprint`，因此每个会话还需在 `session.open` 和 `session.close` 处用确定性金丝雀环绕评估。

<div id="43-mandatory-c1c12-adapter-conformance-suite" class="anchor-alias" aria-hidden="true"></div>

### 4.3 强制性的 `C1-C12` 适配器一致性套件

任何适配器或线束在通过全部十二项一致性检查（`C1` 至 `C12`）之前，均不得进入评测。

| 检查 | 通过要求 |
| :--- | :--- |
| **`C1` 捆绑往返** | 适配器回显输入任务捆绑的精确 `JCS` `SHA-256` 摘要。 |
| **`C2` 提交路径** | 外部 `Verifier` 接收在 `satb-proxy` / `MCP` 终端捕获处记录的精确字节序列。 |
| **`C3` 拒绝路径** | 指令性拒绝以 `refuse`（`sub_reason = "other"`，`completion_score = 0`）干净到达。 |
| **`C4` 单终端调用** | 在首次 `submit` 或 `refuse` 之后发出的任何工具或终端调用均被忽略并计数。 |
| **`C5` 无预言机** | `Verifier` 和 `satb-supervisor` 目录、套接字以及父路径（`..`）从 `/work` 不可达。 |
| **`C6` 出站** | 仅 `satb-proxy`（`127.0.0.1:<port>`）可达以进行模型流量；`/work` 子进程具有零外部网络访问和零上游 `API` 密钥。 |
| **`C7` 用量存在** | 每个模型调用均携带 `usage`（`missing -> killed(usage_missing)`）；代理令牌总数与上游引擎计数精确匹配。 |
| **`C8` 指纹稳定** | 五块 `SUT` 指纹 `SHA-256` 在 3 次尝试空运行前后相同。 |
| **`C9` 线束重放** | 重放记录的 `satb-proxy` 响应可重现字节完全相同的转录（`0` 字节或 `CRLF` 差异；对 `Lane B` 强制要求）。 |
| **`C10` 终止路径** | 失控的 `/work` 进程树（`POSIX` 进程组或 Win32 Job Object，包括分离的子进程）在 `< 2,000 ms` 内被收割并记录为 `killed`。 |
| **`C11` 遥测握手** | 无根 `L3` 进程计数器（`cgroup v2`、`proc_pid_rusage` 或 Win32 `GetProcessTimes`/`QueryProcessCycleTime`）可读，阶段标记到达，且单调到墙钟偏移被记录。 |
| **`C12` 确定性探测** | 执行 `8` 个相同请求，并将不同输出的计数记录为经验性的 `SUT` 属性。 |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. 五级遥测归因（`L0-L4 × A1-N`），平台通道映射，以及无法归因的内容

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="五级遥测归因边界 L0 到 L4 与标签 A1 到 N 的交叉，以及七步原始优先求和检查流水线。" />
  <figcaption>图 2. 左：映射到归因标签 <code>A1</code>-<code>N</code> 的物理和逻辑遥测层级 <code>L0</code>-<code>L4</code>。右：七步原始优先计数器纪律，强制执行前后基线漂移界限（<code>Falsifier 6</code>）以及 <code>Step 7</code> 求和检查。</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 遥测边界（`L0-L4`）和归因标签（`A1-N`）

能量和活动传感器位于五个不同的边界，它们测量物理上不同的量，绝不能求和或混淆：

| 层级 | 物理 / 逻辑边界 | 代表性传感器 | 该通道可诚实归因的内容 |
| :--- | :--- | :--- | :--- |
| **`L0` 墙面** | 墙面插座处的 `AC` | 智能插座或 `PDU`（`Shelly` 的 `apower`、`aenergy`；`Yokogawa` 分析仪） | 整机功耗，包括 `PSU` 转换损耗产生的热量、风扇、`DRAM` 与 `NVMe`；采样周期约 ~1 s。 |
| **`L1` 平台** | 主板 `DC` 输入供电轨 | `Jetson Thor INA238` 载板；`Mac sys_power`；`RAPL psys` | 位于电源适配器或 `PSU` 下游、直流侧的整机功耗。 |
| **`L2` 封装 / SoC** | `CPU` 封装、`GPU` 与 `SoC` 供电轨 | `RAPL pkg`；免 root 的 `macmon IOReport`；`Thor INA3221`；`amdgpu hwmon`；`NVML` 累计能量（`mJ`） | 当 `SUT` 基于 `SoC`（`A2`）时，为整个 `SUT` 的功耗；当某一供电轨在物理上独占时，则仅为推理引擎的功耗（`A1`）。 |
| **`L3` 进程 / cgroup** | 单个 `OS` 进程树 | `Linux cgroup v2`（`cpu.stat`、`memory.peak`、`io.stat`）、`perf`；`macOS proc_pid_rusage` 的 `ri_energy_nj`；Win32 的 `GetProcessTimes` 与 `QueryProcessCycleTime` | 资源活动占比（`C`），或操作系统内核自身的逐进程能耗模型（`D`）。 |
| **`L4` 逻辑** | 模型/工具对话 | `satb-proxy` 的 token 计数与调用延迟；线束（harness）的轮次、工具调用及 `ContextRule_v0` 省略记录 | 对每个 `SUT` 均可获得精确计数，包括封闭的云端 `API`。 |

收据中的每个能量值都携带七种归因标签之一：

- **`A1`（独占物理电源轨）**：在测量窗口内仅由单一分区接触的硬件电源轨传感器（例如仅本地推理引擎拥有 `GPU` 设备访问权限时的 `Jetson Thor INA3221 ch1 VDD_GPU`）。
- **`A2`（专用整机边界）**：在静默的专用机器（`SUT` 加空闲 `OS` 基线）上测得的整机（`L0`/`L1`）或整封装（`L2`）计数器。**依据 `OQ-4`，`A2` 下的整 `SUT` 原始窗口能量是用于放置决策的主要物理能量指标**，这可防止精简模型把未计量的暴力搜索卸载到 `/work` 子进程中，也可防止 `active - idle` 减法美化慢速运行的结果。
- **`B`（时间阶段划分）**：在由顺序阶段标记界定的互不重叠时间窗口上的计数器差值（`Lane B` 中的 `model_call` 与 `tool_call`）。
- **`C`（比例分摊，`Kepler` 模型）**：当并行进程重叠时（`Lane O` `Shape H`），依据 $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ 或 `GPU` 利用率，将共享硬件计数器按比例划分给各分区。
- **`D`（`OS` 建模估计）**：内核内部的逐进程能量模型（`macOS ri_energy_nj`）。它能将进程树与 `CPU` 同租户隔离开来，但其本质仍是固件或内核模型，而非物理分流器读数。
- **`P`（提供方证明）**：云服务提供方随其逐字测量方法一并返回的逐请求服务端能量数值。
- **`N`（`not_available`）**：未被观测，且**绝不进行估计**。

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 七步计数纪律、无根采集（`OQ-5`）与平台映射

`satb-meter` 按七个有序步骤处理每一次尝试（attempt）：
1. **在每个事件边界读取累积计数器**（`attempt.start`、每次 `model_call` 与 `tool_call`、`attempt.close`，外加一个 `100 ms` 参考时钟节拍），从而使窗口能量为精确的计数器差值 $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$。
2. **先写入原始通道**：记录边界、传感器、起止读数、计数器回绕次数与采样数；将短于 `10` 个传感器周期的窗口标记为 `"below_resolution"`，将缺失的硬件标记为 `"not_available"`。
3. **划分顺序阶段（`B`）**：在 `Lane B` 中，模型推理与 `/work` 工具调用从不重叠；并行的 `Lane O` 线束将阶段划分降级为 `C` 或 `N`。
4. **隔离 `engine_resident_during_tools`**：当 `/work` 工具运行时，本地模型服务（`llama-server`、`vLLM`）会在 `GPU`/`DRAM` 上常驻权重。其在工具窗口内的空闲功耗被归入 `engine_resident_during_tools`，既不计入模型主动推理，也不计入工具执行。
5. **仅在分区重叠处按比例划分（`C`）**：将 $\Delta \text{CPU}$ 比例严格作为特征化回退方案使用，并认识到 `C` 态、睿频 `DVFS` 以及 `DRAM`/存储停顿会破坏比例性假设。
6. **将基线存储为派生通道**：以常驻基线包围各会话的前后两端；若前后空闲功率漂移超过 `5.0%`（`Falsifier 6`），则丢弃派生的净高于空闲值，同时保持原始通道完整不变。
7. **运行求和检验（`Falsifier 2`）**：验证派生的阶段分量之和能否在一个传感器量化单位（`1 mJ`）内还原为原始尝试计数器差值；若不能，则舍弃派生划分，仅保留原始通道。

**无根采集规则（`OQ-5`）。** 基准测试绝不得以 `root` 身份运行 `SUT` 编排，或加载自定义的 ring-0 驱动。在 `macOS` 上，`satb-meter` 使用无根的 `macmon`（`IOReport` 订阅）和 `libSystem` 的 `proc_pid_rusage(RUSAGE_INFO_V6)`，从不使用 `sudo` 或 `powermetrics`。在 `Linux` 上（自内核 `5.10` 起 `/sys/class/powercap/intel-rapl` 因 `PLATYPUS` 而变为仅 root 可读），一次性的管理员 `udev` 规则向仅包含 **仅 `satb-supervisor` 的 `UID`** 的专用 `satb-meter` 组授予读权限，确保 `/work` 沙箱进程既无法侧信道 `RAPL`，也无法读取自身的能耗计量。在 `Windows 11`（`NT 10.0.26300`）上，非特权的基本用户令牌（`0x20000`）通过 `nvml.dll`（`nvmlDeviceGetTotalEnergyConsumption`）直接读取离散 `GPU` 累积能耗（`mJ`）以及通过 Win32 `QueryProcessCycleTime` 读取 `L3` 进程周期，而 Intel `RAPL` `MSR` `0x611` 则需要被 `OQ-5` 和 `HVCI` 禁止的 ring-0 内核驱动（将 Windows `CPU` 封装能耗严格置于 `"not_available"`，标签 `N`）：

| 目标平台 | `L0` / `L1` 整体系统通道 | `L2` 包 / `SoC` 通道 | `L3` 进程 & `L4` 逻辑通道 | 关键验证状态 |
| :--- | :--- | :--- | :--- | :--- |
| **Apple Silicon Mac** (`M5 Max` 已验证) | `L0`：`Shelly` `PDU`（`not_available` 若拔掉）；`L1`：`macmon sys_power`（`reported_j`） | `macmon IOReport`：`chip_power`、`cpu_power`、`gpu_power`、`ane_power`、`ram_power`（`reported_j`） | `L3`：`proc_pid_rusage` `ri_energy_nj`（`D`），`ri_instructions`，`ri_diskio_*`；`L4`：`satb-proxy` | Rootless `L1`-`L4` 已在 `Apple M5 Max` 实时验证；`L0` 插孔打开。 |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`, `Linux x86-64` 已验证) | `L0`：`Shelly` `PDU`（`not_available` 若拔掉）；`L1`：`cros_ec`（`0` 功耗属性） | `RAPL package-0` 与 `core`（`0440 root:energy` `udev`）`reported_j` + `amdgpu` `PPT` `power1_input`（`0444`；`energy1_input` 缺失） | `L3`：`cgroup v2` / `getrusage`（`C` activity shares）；`L4`：`satb-proxy` | 已实时验证（`0440 root:energy` `PLATYPUS` 隔离；`amdgpu PPT` `0444`）。 |
| **Intel Raptor Lake** (`Core i9-13900H`, `Linux x86-64` 已验证) | `L0`：`not_available`；`L1`：`RAPL psys`（`intel-rapl:1/energy_uj`，`0444` `reported_j`） | `RAPL package-0`、`core` 与 `uncore`（`MSR` + `MMIO` `energy_uj`，`0444` `reported_j`） | `L3`：`cgroup v2` / `getrusage`（`C` activity shares）；`L4`：`satb-proxy` | 已实时验证（`0 µJ` `Step 7` 残留跨 `psys` `L1` 与 `package-0` `L2`）。 |
| **NVIDIA Jetson AGX Thor** (`Linux aarch64` Tegra 已验证) | `L1`：`TI INA238`（`hwmon6` `VIN`，`0444` `measured_j`）+ `INA3221 ch3 VIN_SYS_5V0`（`0444` `measured_j`） | `INA3221 ch1 VDD_GPU`（`0444` `measured_j`，`A1` 为独占时）；`ch2 VDD_CPU_SOC_MSS`（`0444` `measured_j`）；`NVML`（`unverified`） | `L3`：`cgroup v2` / `getrusage`（`C` activity shares）；`L4`：`satb-proxy` | 已实时验证（`INA238` + `INA3221 ch1-ch3` `0444` rootless；GPU `NVML` 在共租户锁下打开）。 |
| **Windows 11 `x86-64` + Discrete `RTX`** (`i7-1165G7` + `RTX 2060`, `NT 26300` 已验证) | `L0`：`not_available`；`L1`：`WMI` `EMI` `PowerMeter`（`0` 实例 -> `not_available`） | `RTX 2060`：rootless `nvml.dll` 累计 `mJ`（`reported_j`）；`CPU` `RAPL` `MSR 0x611`：**`N`（`not_available` 未使用 ring-0 驱动）** | `L3`：Win32 `GetProcessTimes` + `QueryProcessCycleTime`（`C` shares；`SRUM` 粗粒度 `OS` 背景排除）；`L4`：`satb-proxy` | 已在 Basic User `0x20000` 令牌下实时验证（`0 mJ` `Step 7` 残留；`2.46 ms` Job Object 终止）。 |
| **Closed Cloud `API`** (`Anthropic`, `xAI`, `Cerebras`, `OpenAI`, `Google`) | 本地 `L0`-`L1` 仅测量客户端主机（排除服务器推理） | 远程服务器 `L2`：严格 **`N`（`not_available`）** 或每请求 **`P`**（`OQ-6`） | 本地 `/work` `L3`（`D`/`C`）用于沙箱工具；`L4`：**exact** `satb-proxy` 令牌、调用、`USD` | 已通过 `satb-proxy` 在 `Anthropic`、`Cerebras` 与 `xAI` 间实时验证。 |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 八类硬件测量陷阱与七类不可归因量

标准功率测量捷径在现代`SoC`和`GPU`上会系统性地失效：

| 硬件遥测陷阱 | `SATB` 缓解措施 |
| :--- | :--- |
| **空闲功耗随核心温度、风扇、`DVFS` 与睿频而漂移** | 等待 `GPU` 冷却至 `<= 1.5 W`，用前后基线包围每个测量窗口，记录 `GPU` 峰值温度，并在漂移超过 `5.0%` 时作废派生净焦耳值（`Falsifier 6`）。 |
| **冷机空闲与权重驻留空闲之间的歧义** | 在 `Step 6` 中分别明确测量并标注两者，而不是静默地扣除其中一个。 |
| **`Active - idle` 扣减会使运行缓慢的实验结果显得更优** | 整个 `SUT` 的原始窗口能耗（`A2`）仍是主要的放置指标（`OQ-4`）。 |
| **短于采样周期的窗口被读作零、负值或量化噪声** | 将短于 `10` 个传感器周期的窗口标记为 `"below_resolution"`（例如，在 `~8 Hz` 的 `macmon` 上 `< 1.2 s`，或在 `1 Hz` 智能插座上 `< 10 s`）。 |
| **高频遥测采样器消耗大量 `CPU` 功耗** | 在事件边界读取累计计数器（`0 Hz` 时为 `0.011 mW`），并辅以 `100 ms` 时钟节拍；记录 `observer_only` 基线。 |
| **`A100`/`H100` 上的 `NVML` 瞬时功率计仅采样约 ~25% 的运行时间** | 通过进程内 `FFI` 读取累计值 `nvmlDeviceGetTotalEnergyConsumption`（单位 `mJ`）（在 `RTX 2060` 上为 `1.17 ms`，相较于 `nvidia-smi` 子进程的 `43.88 ms`），切勿轮询瞬时值 `nvmlDeviceGetPowerUsage`（Chung et al.; Yang et al.）。 |
| **外部 `L0` 壁挂插座运行于未同步的时钟** | 在 `session.open` 与 `session.close` 处发出确定性的 `50%` 占空比校准负载脉冲，并对时间戳进行互相关。 |
| **共享主机上的后台守护进程或同宿主任务** | 记录进程列表，通过 `Falsifier 6` 降级共享 `L2` 派生扣减结果，并与原始 `L2` 一并记录同宿主隔离的 `L3` `ri_energy_nj`（`D`）。 |

因此，**七个量值无法诚实归因**，且被禁止用于 `SATB` 声明：(1) 未经验证的封闭 `API` 服务器能耗（仅 `N` 或 `P`）；(2) 共享 `SoC` 或统一内存轨上的精确每进程物理焦耳（`C` 和 `D` 为模型）；(3) 与服务内核、量化、分批处理及硅片隔离的模型权重；(4) `OS` 空闲底板的所有权及 `DRAM` 常驻权重功耗（被报告为独立通道）；(5) 短于传感器周期的单个事件（例如在 `1 s` 插头下的 `30 ms` 工具调用）；(6) 共享云 `VM` 或缺乏用户态硬件计数器的非特权 Windows `CPU` 域；以及 (7) 无声的会话中提供者权重交换（由起始/结束金丝雀标记，从不先验排除）。特别地（`OQ-6`），**提供者可持续性披露是机群中位数而非每请求测量值，且从不进入 `SATB` 收据**，包括 Google 的 `0.24 Wh` 中位数 `Gemini Apps` 提示、OpenAI 的 `0.34 Wh` 数值（未附方法论发布）以及 Mistral 的每个 `400` 令牌响应的 `1.14 gCO2e`。

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 已测量的一致性、确定性、观察者效应与多主机归因结果

为了用可审计的收据取代未测量的设计假设，我们在 `Apple M5 Max` 工作站（`arm64`，`128 GB` 统一内存，`macOS 27.2.1`，`macmon 0.12.0`）上执行了完整的 `SATB` 一致性套件和伪造器线束（`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`，总运行时间 `175.69 s`），并同步进行了 `188` 窗口跨研究审计以及跨 `Linux` 与 `Windows 11` 的实时跨 OS 多硅片运行。

<div id="61-c1c12-conformance-c9-deterministic-replay-and-c10-process-tree-cleanup" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `C1-C12` 一致性检查、`C9` 确定性重放与 `C10` 进程树清理

所有 **`12 / 12` 项 Rust 参考一致性检查**（`dnull_cli satb-conformance`）以及所有扩展操作系统检查均已通过：

- **Bundle、终端、隔离与指纹检查（`C1`-`C8`、`C11`）**：`C1` 回显了规范化 bundle 摘要 `455e941f51f8ffef`；`C2` 通过 `satb-proxy` 将逐字节一致的 `submit` 载荷投递至 Verifier；`C3` 将空的或带指令的拒绝映射为 `refuse:other`；`C4` 忽略了 `submit` 之后的尾随工具调用（`ignored_trailing_calls = 1`）；`C5` 阻止了 `../`、`/etc/passwd` 与 `verifier_oracle/*` 的越界访问；`C6` 在 `/work` 内剥离了代理与凭据环境变量（`NP=*|HTTP=`），同时对未列出的代理路径返回 `HTTP 404`；`C7` 在缺失 usage 的响应上立即中止，并标记为 `killed(usage_missing)`；`C8` 在多次干跑中保持了逐字节一致的五块指纹 `8b741c27bf364e5d`，同时对模拟的 `system_fingerprint` 替换标记 `session_void = true`；`C11` 验证了免 root 的 `RUSAGE_INFO_V6` 计数器可见性（`sudo_invoked = false`）。
- **扩展 `C9` 多轮 `ContextRule_v0` + `Truncate_v0` 重放**：在一条 `14` 轮轨迹中（每轮生成 `24 KiB` 的原始文件读取，`14` 个输出经 `Truncate_v0` 截断为 `8,192 B + 8,192 B`），处于 `48,000` 词元窗口内（`80%` 阈值 = `38,400` 词元），`ContextRule_v0` 确定性地省略了**最早的 `5` 个工具输出**，且**额外模型调用为 `0` 次**，生成了 `149,747` 字节的规范化转写（`SHA-256` `d697ed1476129939...`），在独立的 `/work` 重放之间**字节差异为 `0`**。在 `16,000` 词元窗口下重复同一轨迹（此时保留的 `8` 个 `16 KiB` 输出超过 `100%`），则确定性地触发了 `killed(context_ceiling)`。
- **扩展 `C10` 多进程 `SIGKILL` 清理（`< 2,000 ms` 规范上限）**：在 `5` 次试验中，生成了一个 `4` 进程的树（`sh` 父进程加上位于隔离进程组中的 `3` 个分离后台 Python sleep 进程），`SIGKILL` 投递与内核回收的平均耗时为 **`2.073 ms`**（最小 `1.429 ms`，最大 `2.571 ms`，比 `2,000 ms` 上限低 **`778×`**），**残留 `PID` 数为 `0`**，结果为 `killed(wall_ceiling)`。

<div id="62-live-c12-eight-request-determinism-probes-across-four-model-substrates" class="anchor-alias" aria-hidden="true"></div>

### 6.2 实时 `C12` 八请求确定性探针跨四种模型基底

Routing `8` identical algebraic-synthesis requests per model (`32` live cloud calls plus `8` local `Shape D` runs) through `satb-proxy` verified `100%` exact `C7` token-count parity (`32/32` calls) and exposed three distinct determinism regimes:

| `SUT` / 端点经 `satb-proxy` | `temperature = 0` 预检查 | 记录的 `sampling.temperature` | 不同原始输出 (`/ 8`) | 不同代数形式 (`/ 8`) | `system_fingerprint` | 平均延迟 |
| :--- | :---: | :--- | :---: | :---: | :--- | ---: |
| **`Shape D`：`dnull N1`**（Rust 本地） | `Exact i64` | `0 (exact_i64_q1e6)` | **`1 / 8`** | **`1 / 8`** | `0da4df8d9ccbce1e…` | `1,474.0 ms` |
| **`Anthropic claude-opus-5-5`** | **`HTTP 400`** | `not_available` (deprecated) | **`8 / 8`** | **`4 / 8`** | `not_available` | `3,389.1 ms` |
| **`Anthropic claude-sonnet-5-5`** | **`HTTP 400`** | `not_available` (deprecated) | **`8 / 8`** | **`2 / 8`** | `not_available` | `2,914.3 ms` |
| **`Cerebras gpt-oss-120b`** | `HTTP 200` | `0.0 (seed=42)` | **`2 / 8`** | **`2 / 8`** | `fp_fd4dff7eed92aaf38281` | `484.2 ms` |
| **`xAI grok-4.20-0309-non-reasoning`** | `HTTP 200` | `0.0 (seed=42)` | **`8 / 8`** | **`1 / 8`** | `fp_9974b11849` | `942.7 ms` |

1. **提供者对 `temperature = 0` 的弃用**：`claude-opus-5-5` 与 `claude-sonnet-5-5` 均拒绝了 `"temperature": 0.0`，返回 **`HTTP 400` (`"`temperature` is deprecated for this model."`)**，实证验证了 `SATB` 的规则，即不可用的采样控制应归一化为 `"not_available"`，而非默默地假设为零。在 `8` 次相同调用中，`claude-opus-5-5`（`1,047` 自适应思考标记）产生了 `8` 份不同的原始文本，覆盖了 `4` 种代数上不同的位向量等价式（`(x | y) - (x & y)`，`(x | y) & ~(x & y)`，`(x & ~y) | (~x & y)`，以及 `(x + y) - ((x & y) + (x & y))`）。
2. **在 `temperature = 0, seed = 42` 下的残余非确定性**：即使 `temperature = 0.0` 和 `seed = 42` 被接受（`HTTP 200`），且 `system_fingerprint` 稳定，`Cerebras gpt-oss-120b`（`2,976` 推理标记）在 `8` 次相同调用中产生了 `2` 份不同的输出，而 `xAI grok-4.20-0309-non-reasoning` 在全部 `8` 次调用中保持了 `1` 个代数公式（`(x | y) & ~(x & y)`），但其文字证明句在所有 `8/8` 响应中均有所变化。因此，需要将 **在已记录响应情况下的装置确定性 (`C9`)** 与 **测量的 `SUT` 输出分散度 (`C12`)** 分离开来。

<div id="63-falsifier-5-observer-effect-benchmark-across-telemetry-cadences-10-s-windows" class="anchor-alias" aria-hidden="true"></div>

### 6.3 伪造器 5：跨遥测节奏的观察者效应基准（`10 s` 窗口）

测量组合采样器（`Python` + 子进程 `macmon` `IOReport` 管道）的 `CPU` 时间、`L3` `ri_energy_nj`（`observer_only` `reported_j`）以及全 `SoC` `L2` `reported_j`，在 `Apple M5 Max` 上交错的 `10.0 s` 窗口中，量化了精确的观察者开销：

| 采样节奏 | 达成速率 | 采样器 `CPU` 时间 / `10 s` | 观察者 `L3` `reported_j` | 观察者功率（`mW`） | `L2` 窗口占比 | 全 `SoC` `L2` 窗口（`reported_j`） |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`0 Hz` 边界专用**（`2` 次 `rusage` 系统调用） | `0.20 Hz` | **`0.004 ms`** | **`0.000108 J`** | **`0.011 mW`** | **`0.0000%`** | `-`（零 `IOReport` 守护进程） |
| **`1 Hz`（`1,000 ms` 滴答）** | `0.90 Hz` | `9.323 ms` | `0.194237 J` | `19.371 mW` | `0.0521%` | `372.769 J`（`37.17 W`） |
| **`10 Hz`（`100 ms` `SATB` 参考滴答）** | `8.12 Hz` | `36.434 ms` | `0.666596 J` | **`66.439 mW`** | **`0.1770%`** | `376.603 J`（`37.53 W`） |
| **`100 Hz`（`10 ms` 压力伪造器）** | `7.44 Hz` | `35.636 ms` | `0.598721 J` | `58.971 mW` | `0.1618%` | `369.926 J`（`36.44 W`） |

本次测量直接得出两个硬件事实：
1. **可忽略的扰动（`< 0.18%`）**：仅边界 `proc_pid_rusage` 读取消耗 `108 µJ`（`0.011 mW`），比 `10 Hz` `IOReport` 轮询（`66.44 mW`）**低 `6,040×` 功率**，即使 `100 ms` 参考滴答也仅占全 `SoC` 窗口能量的 **`0.177%`**（`-i 10` 与 `-i 1000` 之间的 `L2` 窗口总差异为 `0.76%`，从而通过伪造器 5）。
2. **`IOReport` 订阅节奏上限（`~8 Hz`）**：从 `macmon 0.12.0` 请求 `-i 10`（`100 Hz`）仅达成 **`7.44 Hz`**（`10.15 s` 内 `75.5` 个样本），因为每个无根 `IOReport` 订阅周期在 macOS 用户空间阻塞约 `120 ms`。因此，步骤 2 的 `10` 周期 `below_resolution` 地板在 `macmon` `L2` 窗口上物理对应 **`~1.2 s`**，而亚秒级操作必须依赖 `0 Hz` 边界 `L3` `ri_energy_nj` 计数器或批量窗口。

<div id="64-falsifier-3--step-7-b-temporal-boundary-vs-c-proportional-kepler-attribution" class="anchor-alias" aria-hidden="true"></div>

### 6.4 证伪器 3 与 Step 7：`B` 时间边界与 `C` 比例（`Kepler`）归因

在 `Apple M5 Max` 上进行的 `3` 次重复实验中，单个 `SUT` 先顺序执行 **阶段 1**（`2.50 s` 的 ALU 密集型 `SHA-256` 摘要突发：平均 `CPU` 时间 `29.27 ms`，每 `CPU`-ms `38.63 mJ`），随后执行 **阶段 2**（`2.51 s` 的 `192 MiB` `DRAM` 缓存未命中扫描，并伴随同步 `fsync` 磁盘刷写和 `8 ms` `I/O` 等待：平均 `CPU` 时间 `15.94 ms`，每 `CPU`-ms `27.73 mJ`），同时有一个稳定占空比运行的后台工作负载。

| 归因检查（`n = 3` 次顺序两阶段 + 同租户重复实验） | 阶段 1（计算 `2.50 s`） | 阶段 2（`DRAM + fsync` I/O `2.51 s`） | 证伪/Step 7 判定 |
| :--- | ---: | ---: | :--- |
| **精确 `B` 时间边界 `L3` 差值（`reported_j`）** | `1.1272 J`（`1,127,172 µJ`） | `0.4433 J`（`443,317 µJ`） | **`Step 7` 残差 `<= 1 µJ`（`3/3` 通过）** |
| **`C`（`Kepler` $\Delta\text{CPU}$ 份额：`64.58%` 对 `35.42%`）作用于 `L3`** | `1.0145 J`（`-10.00%`） | `0.5560 J`（**平均误差 `+25.21%`**） | `DRAM`/停顿能量每毫秒 $\ne$ `ALU` 能量每毫秒 |
| **精确 `B` 时间 `L2` 全 `SoC` 窗口（`reported_j`）** | `82.246 J` | `90.975 J` | `DRAM`、`NVMe` 与主机功耗在 `I/O` 等待期间持续存在 |
| **`C`（`Kepler` $\Delta\text{CPU}$ 份额）应用于 `L2` 窗口** | `111.758 J`（**误差 `+35.86%`**） | `61.464 J`（**误差 `-32.59%`**） | **触发 `Falsifier 3`（误差 `> 20%`）** |

虽然在边界计数器差值（`B`）下，`Step 7` 的求和检验在所有试验中（`100.0%`）均保持在 `0-1 µJ` 范围内，但基于 `CPU` 时间的比例归因（`C`）在共享 `L2` 上将计算突发高估了 **`+35.86%`**，并将内存与 `fsync` 阶段低估了 **`-32.59%`**（即使在每进程 `L3` 上也有 **`25.21%`** 的误差）。这从实证上说明了为何 `SATB` 将 `C` 限制在重叠的并行线束（`Shape H`）中使用，并通过 `Falsifier 3` 标记 `> 20%` 的顺序发散。

<div id="65-multi-session-falsifier-6-audit-188-windows-and-falsifier-8-harness-floor-check" class="anchor-alias" aria-hidden="true"></div>

### 6.5 多会话 `Falsifier 6` 审计（`188` 个窗口）与 `Falsifier 8` 线束下限检查

在共享 `Apple M5 Max` 主机上采集的 `188` 个真实 `L2` `IOReport` 窗口，覆盖三轮实验战役，外加两组配对的 `Lane B` 与 `Shape H`（`Claude Code 2.1.330`）评估。审计结果确认了两项会话级保障措施：

1. **`Falsifier 6` 基线漂移审计（`188` 个窗口）**：在 `exp-001`（`11` 个窗口：`1` 个位于 `5.0%` 以内，`10` 个向上漂移，最高达 `44.5%`）、`exp-002` 加多轮对话（`7` 个窗口：`2` 个位于 `5.0%` 以内，其中 `dnull` `1,190` 实例批次漂移 `3.09%`，`BigCodeBench` `Qwen 3.6` 漂移 `1.02%`；另有 `5` 个在并发 `yosys-abc` 综合期间漂移 `12.16%`至`65.11%`），以及 `ai-reads-human`（`170` 个窗口，`loadavg_1m = 12.92`：`61` 个位于 `5.0%` 以内，`109` 个发生漂移）中，`64 / 188` 个窗口（`34.04%`）保留了有效的 `derived_marginal_j`，而 `124 / 188`（`65.96%`）的净高于空闲值扣减被自动判定为无效。所有原始 `L2` 与逐 `PID` `L3` `reported_j` 读数均完整保留，原始数据留存率为 `188 / 188 = 100.0%`。

2. **`Falsifier 8`（`Lane B` 对比 `Shape H` `Claude Code 2.1.330`）**：在 `24` 组配对的 `/work` 正式与 `SQLite` 策略任务包中，`Lane B` 在 `Claude Opus 5.5`（`44` 次模型调用，`63,568` 个提示词加缓存 token，`\$0.5477`）与 `Claude Sonnet 5.5`（`43` 次调用，`60,284` 个 token，`\$0.3413`）上均达到 **`24 / 24`（`100.0%`）**，与 `Shape H`（`Claude Code 2.1.330`：在 `Opus 5.5` 上为 **`24 / 24`**，`89` 次调用 / `218,449` 个 token；在 `Sonnet 5.5` 上为 `83` 次调用 / `196,128` 个 token）持平，同时将提示词加缓存的 token 流量分别降低至 **`3.44×`** 与 **`3.25×`** 的倍数关系。在 `6` 个未见过的多文件 Python 缺陷修复仓库（`config-defaults`、`interval-merge`、`pagination`、`precedence`、`rate-window`、`retry-backoff`）上，`Lane B` 再次与 `Shape H` 持平：`Lane B`（`Opus 5.5` 为 `28` 次调用 / `52,045` 个 token；`Sonnet 5.5` 为 `31` 次调用；本地 `Qwen 3.6 35B-A3B` 为 `42` 次调用 / `2,342.05 J` `L2`）与 `Shape H`（`Claude Code 2.1.330` 加 `Opus 5.5`：**`6 / 6`**，`30` 次调用 / `86,744` 个 token，token 用量多出 `1.67×`）结果一致，证实 `Lane B` **并非** 能力受限的线束下限。

<div id="66-multi-platform-hardware-attribution-across-five-silicon-and-os-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 跨五类硬件与操作系统原型的多平台硬件归因

为验证 `SATB` 一致性、`Shape D` 定点确定性、免 root 的 `PLATYPUS` / `HVCI` 权限边界，以及物理分流器或累计 `NVML` 归因在 `macOS`、`Linux` 和 `Windows 11` 上均成立，我们在 `Apple M5 Max` 之外，又在四类额外的 `Linux` 和 `Windows 11` 硬件原型上运行了 `run_multi_host_satb.py`（`multi_host_satb_receipts.json`）和 `run_windows_suite.py`（`windows_satb_receipts.json`），结果如下：

| 硬件原型与 `OS` 内核 | 免 root 传感器边界与证据类别 | `Shape D` `1M` `DNULLMM1`（`10k` 次探测） | `C9` 重放与 `C10` 进程树终止均值 | 单次读取延迟与 `100 Hz` 实际达到频率 | `Step 7` 残差与 `Falsifier 3`（`C` 相对 `B`） |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`**（`arm64`，`128 GB`，`macOS 27.2.1`） | `IOReport` `L1`/`L2` + `rusage` `L3`（`reported_j`；`measured_j = None`） | `15027705736`（`388.43 ns` `C++`，`582.57 ns` Rust） | `149,747 B`（`0` 处差异）· `2.073 ms`（`0` 个 `PID`） | 约 `120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`**（阶段 2，阶段 1 为 `+35.86%`） |
| **`NVIDIA Jetson AGX Thor`**（`aarch64`，`122.9 GiB`，`Linux 6.8.12-1021-tegra`） | `TI INA238`（`hwmon6` `VIN` `L1`）+ `INA3221`（`hwmon5` `ch1-ch3` `L2`/`L1`，`0444` **`measured_j`**） | `15027705736`（`984.86 ns` `C -O3`，`2,489.4 ns` Py） | `149,747 B`（`0` 处差异）· `9.544 ms`（`0` 个 `PID`） | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2`（`VIN` 为 `-67.02%`） |
| **`Framework AMD Ryzen AI Max+ 395`**（`x86-64`，`122.8 GiB`，`Linux 7.0.0-43`） | `RAPL package-0` 与 `core`（`0440 root:energy` **`reported_j`**）+ `amdgpu PPT`（`0444`；`measured_j = None`） | `15027705736`（`376.61 ns` `C -O3`，`1,341.7 ns` Py） | `149,747 B`（`0` 处差异）· `0.868 ms`（`0` 个 `PID`） | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0`（`core` 为 `-63.34%`） |
| **`Intel Core i9-13900H`**（`x86-64`，`14.7 GiB`，`Linux 7.0.0-43`） | `RAPL psys`（`L1`）+ `package-0`、`core`、`uncore`（`L2`，`0444` **`reported_j`**；`measured_j = None`） | `15027705736`（`420.93 ns` `C -O3`，`863.6 ns` Py） | `149,747 B`（`0` 处差异）· `1.120 ms`（`0` 个 `PID`） | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0`（`psys` 为 `-73.62%`） |
| **`Intel Core i7-1165G7 + RTX 2060`**（`x86-64`，`63.7 GiB`，`Windows 11 26300`） | `nvml.dll` `RTX 2060` 累计 `mJ`（`L2` **`reported_j`**）+ Win32 `L3`；`CPU RAPL` = `N`（`measured_j = None`） | `15027705736`（`1,474.22 ns` `MSVC /O2`，`2,885.6 ns` Py） | `149,747 B`（`0` 处 `CRLF`）· `2.458 ms` JobObj（`0` 个 `PID`） | `1,174.2 µs` `NVML` · **`64.64 Hz`**（`NT` 时钟节拍） | `0 mJ` · **`-89.88%`** 时间（`RDTSC` 为 `-77.05%`） |

这些实时回执得出以下五项跨平台硬件与操作系统方面的发现：

1. **`Shape D` 与 `Lane B` 重放在 `macOS`、`Linux` 和 `Windows 11`（`arm64`/`aarch64` 与 `x86-64`）上的逐位不变性**：全部五台主机（包括在 `MSVC 19.44 /O2` 下编译的 Win32 `CreateFileMappingA` + `MapViewOfFile`，以及 `Windows 11`（`NT 10.0.26300`）上的 `NTFS` 文件 I/O）均产生了精确的 `10,000` 次探测 `DNULLMM1` 校验和 **`15027705736`**、精确的 `test.setpoint` 冻结摘要 `0da4df8d9ccbce1e...4485781`，以及精确的 `149,747` 字节 `C9` 转录文本（`SHA-256` 为 `d697ed1476129939...`，**`NTFS` `CRLF` 字节漂移为 `0`**）。同时，经由内核原语回收了 `4` 个 `PID` 的失控进程树，耗时 `0.868 ms` 至 `9.544 ms`（`macOS`/`Linux` 上使用 `SIGKILL`；`Windows 11` 上使用 Win32 `TerminateJobObject`，平均耗时 **`2.458 ms`**）。相比平均耗时 `122.817 ms` 的 `taskkill.exe /F /T /PID` 调用，该方法快 **`50.0×`**，并且远低于 `2,000 ms` 的规格上限（超过 `200×` 的余量）。
2. **在 `NVIDIA Jetson AGX Thor` 上于实时 `GPU` 共置条件下的物理 `INA238` / `INA3221` 分流分离与 `Falsifier 6`**：在 `Linux 6.8.12-1021-tegra` 上，`hwmon6`（`ti,ina238`，位于 `i2c@c600000/ina238@44`，`VIN` 为整板 `DC` 输入，约 `27.97 V`）以及 `hwmon5`（`ina3221@40`）的全部三个通道（`ch1 VDD_GPU`、`ch2 VDD_CPU_SOC_MSS` 和 `ch3 VIN_SYS_5V0`）均可在无需 `sudo` 的情况下读取（权限 `0444`）。在我们严格仅使用 `CPU` 的探测（`dedicated_host = false`）期间，一个独立的共置 `llama-server` 占用了主机 `GPU` 锁。

| `Jetson AGX Thor` 物理分流通道（`0444` 免 root `sysfs`） | 边界 | 预基线（`W`） | 阶段 1 计算（`measured_j` / `W`） | 阶段 2 `DRAM+fsync`（`measured_j` / `W`） | 后基线（`W`） | 漂移（`F6`）与 `Kepler` `C` 阶段 2 误差 |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`**（模块 + 载板输入） | **`L1`** | `100.70 W` | `122.12 J`（`101.66 W`） | `99.02 J`（`81.94 W`） | `97.21 W` | `3.47%`（`A2` 因共置负载而保留）· **`-67.02%`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`**（共置 `LLM`） | **`L2`** | `29.26 W` | `40.29 J`（`33.54 W`） | `26.00 J`（`21.52 W`） | `28.13 W` | 外部 `GPU` 共置负载（`F5` 中摆幅为 `-36.1%`） |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36.68 W` | `45.73 J`（`38.07 W`） | `44.37 J`（`36.71 W`） | `36.08 W` | `1.64%`（`CPU`/`SoC`/`MSS` 域）· **`-70.01%`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`**（`5.08 V` 轨） | **`L1`** | `14.89 W` | `18.66 J`（`15.53 W`） | `16.82 J`（`13.92 W`） | `13.98 W` | **`6.13% > 5.0%`（触发 `F6`）** · **`-68.85%`** |

在四个 `Falsifier 5` 节奏窗口中，波动的共同租户 `LLM` 请求将 `ch1 VDD_GPU` 从 `35.36 J` 拉低至 `22.60 J`（`-36.1%`），即使 `ch2 VDD_CPU_SOC_MSS` 保持在 `35.76-39.31 J` 范围内，仍将整板 `INA238 VIN`（`L1`）从 `107.48 J` 拉低至 `81.73 J`（`-24.0%`）。由于 `dedicated_host = false`（且 `ch3 VIN_SYS_5V0` 在 `6.13%` 处超过 `5.0%` 漂移），`SATB` 拒绝给出 `A2` 整-`SUT` 网络布局声明，同时保留精确的轨道分离 `measured_j`（`L1` 和 `L2` 通道从未求和）。

3. **`PLATYPUS` `0440 root:energy` 隔离与 `Strix Halo` `APU` 域在 `Framework` `AMD` 上的验证**：在 `Framework` Desktop（`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`，`Linux 7.0.0-43-generic`）上，`udev` 规则 `90-energy-read.rules` 将 `/sys/class/powercap/intel-rapl:0/energy_uj`（`package-0`）和 `intel-rapl:0:0/energy_uj`（`core`）设置为模式 **`0440`（`root:energy`，`world_readable = false`）**：未分组的 `/work` 沙箱 `UID` 收到 `EACCES`（阻断 `PLATYPUS` 侧信道），而监管者 `GID`（`energy`）以无根方式读取累积微焦耳，中位延迟为 `24.34 µs`（`0 µJ` `Step 7` 残差）。进一步检查 `hwmon9`（`amdgpu`）解决了开放规范细节：`Strix Halo` 的集成 `Radeon 8060S` 暴露世界可读（`0444`）的 `PPT` 功率（`power1_input` / `power1_average`，单位 `µW`，Phase 1 为 `75.38 W` / Phase 2 为 `69.72 W`），而非单独的 `energy1_input` 计数器，而 `cros_ec`（`hwmon8`）仅暴露风扇和板级热量。

4. **裸金属 `Windows 11` 无根边界（`0x20000` 基本用户 `NVML` 与 ring-0 `RAPL` 块）以及 `15.625 ms` `NT` 时钟滴答混叠**：在明确降权的 Basic User 令牌（`runas.exe /trustlevel:0x20000`，`IsUserAnAdmin() == false`）下，于 `Windows 11 Pro`（`NT 10.0.26300`，`Intel Core i7-1165G7` + `NVIDIA GeForce RTX 2060`），进程内对 `nvml.dll` 的 `FFI` 调用 `nvmlDeviceGetTotalEnergyConsumption`（`mJ`）和 `nvmlDeviceGetPowerUsage`（`mW`）以无根方式成功，中位时间为 **`1,174.15 µs`**（**`37.4×` 快于** 每次调用生成 `nvidia-smi.exe` 的 `43.88 ms`），以 **`0 mJ` 残差** 清空 `Step 7`（`8.769 J + 8.816 J = 17.585 J`，前后漂移 `3.0%`）。相比之下，非特权用户态读取 Intel `RAPL` `MSR 0x611` 被 `Windows NT` 内核阻断（无签名 ring-0 驱动，由 `OQ-5` 和 `HVCI` 禁止），且 `WMI` `EMI`（`\\.\EnergyMeter` / `Win32_PerfRawData_Counters_PowerMeter`）暴露 `0` 个实例，将 Windows `CPU` 封装 `L2` 严格置于 `Label N`（`"not_available"`）。此外，由于未调整的 `Windows NT` 在约 `15.625 ms` 时钟中断上更新 `GetProcessTimes`，Phase 2 中的 `8 ms` 睡眠加 `FlushFileBuffers` 突发被混叠至 `62.5 ms`（`CPU` 份额 `5.06%`，而 Phase 1 为 `1,171.9 ms`），导致 `Kepler` `C` 归因误差达 **`-89.88%`**（即使使用亚滴答 `RDTSC` `QueryProcessCycleTime` 周期份额 `11.48%`，误差仍为 `-77.05%`）。

5. **传感器总线与 `OS` 定时器节奏物理在全部五个平台上的表现**：相较于 Linux `x86-64` `powercap` `sysfs` 在 `24.34-45.37 µs`（实现 `94.28-97.12 Hz`，在 `100 Hz` 时达到）内完成读取，`Windows NT` 的默认 `15.625 ms` 睡眠量子将未调节的 `10 ms` `NVML` 循环限制在 **`64.64 Hz`**，但在 `SATB` 的 `100 ms`（`10 Hz`）参考时钟下能够平稳输出 **`9.45 Hz`**，这与 `Jetson AGX Thor` 的 `66.55 Hz` `I2C` 分流上限（`100 ms` 参考时为 `9.49 Hz`）相匹配，而 `macmon` 的 `7.44 Hz` `IOReport` 上限则形成对比。在 **`5 / 5` 硅片与 `OS` 架构** 中，`CPU`-比例拆分（`C`）对 `192 MiB` `DRAM` + 磁盘同步阶段的计量被 **`32.59%` 到 `89.88%`** 的低估，从而在全局层面验证了 `SATB` 限制 `C` 只能在并行运行重叠时使用的原因。

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. 开放硬件验证与局限性

| 会话证伪条件 | 触发后的后果 | 本研究中的实证状态 |
| :--- | :--- | :--- |
| **`F1` 重放不一致（`C9`）** | 参考线束具有非确定性 | **在 `5/5` 台主机上已排除（`149,747 B`、`14` 轮中 `0` 字节/`CRLF` 差异）** |
| **`F2` 在 `> 5%` 的尝试中求和校验失败** | 主机上的归因拆分失效 | **在 `5/5` 台主机上已排除（Linux `0 µJ`；Win11 `NVML` `0 mJ`；`M5 Max` `<= 1 µJ`）** |
| **`F3` `B` 与 `C` 顺序测量相差 `> 20%`** | 主机上 `C`（`Kepler`）被标记为不可靠 | **在 `5/5` 台主机上已触发（误差 `32.59%-89.88%`）；`C` 受限使用** |
| **`F4` 已知脉冲负载超出传感器精度** | 会话中传感器降级 | **未解决（`L0` 智能插座同步脉冲装置尚未接入）** |
| **`F5` `10 ms` 与 `1 s` 采样周期导致窗口能量偏移** | 遥测观测者效应 | **已排除（`M5 Max` `L2` 差值 `0.76%`；`100 ms` 参考下达到 `9.45-10.48 Hz`）** |
| **`F6` 前后驻留基线漂移 `> 5.0%`** | 派生的净通道失效 | **生效中（`M5 Max` 的 `124/188` 个窗口，以及 Linux 共驻负载漂移，已被干净地门控）** |
| **`F7` 适配器通过 `C1`-`C12` 但未通过金丝雀测试** | 一致性不足；会话作废 | **已在仿真中验证（替换时 `session_void = true`）** |
| **`F8` `Lane B` 低于强 `Lane O` 线束** | `Lane B` 严格作为下限报告 | **已排除（与 `Claude Code 2.1.330` 相比 `24/24` 与 `6/6` 一致）** |

仍有三项硬件与适配器相关事项待解决（`OQ-5`）：

1. **专用静默 `A2` 会话与 `L0` `AC` 墙插校准**：尽管 `NVIDIA Jetson AGX Thor` 上已实时验证物理 `TI INA238`（`L1`）及 `INA3221`（`L2`/`L1`）分流器 `measured_j` 供电轨，并且 `Apple M5 Max`、`Framework AMD Strix Halo`、`Intel Raptor Lake` 与 `Windows 11`（`RTX 2060` `NVML`）上已验证免 root 的 `reported_j` 计数器，但五台测试设备均运行了共享服务或共驻工作负载（`dedicated_host = false`），因此暂不支持整机 `A2` 的功耗归属结论。下一步是在静默的专用主机上接入同步脉冲的 `L0` `AC` 电表（`Shelly` / `Yokogawa`）。
2. **`Jetson AGX Thor` 集成 `GPU` 的 `NVML` 计数器检验**：独立 `GPU` 的 `nvmlDeviceGetTotalEnergyConsumption`（`mJ`）已在 `NVIDIA GeForce RTX 2060`（`Windows 11`）上通过 `nvml.dll` 免 root 验证。针对 `Jetson AGX Thor` 统一 Tegra `GPU` 的 `NVML` 累计能量探测，以及其已验证的 `0444` `INA3221 ch1 VDD_GPU` 分流器，仍需等待共享 `GPU` 锁空闲的时段进行。
3. **更广泛的 `Shape H` 与 `Shape I` 实时线束清单**：本研究中的实时外部线束运行在 `Claude Code 2.1.330` 上执行了 `Shape H`，并与 `Lane B` 及 `Shape D` 一同运行。下一步是在 `Codex CLI`、`OpenHands`、`Terminus-2` 以及 `Shape I` 的 `Inspect` 求解器上执行实时 `C1-C12` 认证。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

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
