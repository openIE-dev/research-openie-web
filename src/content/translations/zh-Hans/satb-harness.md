---
title: "饱足基准（Satiation Benchmark）：参考线束、适配器与遥测归因"
deck: "饱足基准（Satiation Benchmark）：参考线束、适配器与遥测归因  固定顺序的 Rust 参考线束（Lane B）、单代理强制适配器桥（Shapes D、M、H 和 I）、十二项一致性检查套件（C1 至 C12），以及五级无根遥测归因引擎（L0 至 L4 与标签 A1 至 N 交叉）。已在四种硬件原型上进行经验验证：Apple M5 Max（arm64 macOS IOReport 和 proc_pid_rusage `reported_j`）、NVIDIA Jetson AGX Thor（aarch64 Tegra Linux 物理 INA238 整板和 INA3221 轨道分离分流 `measured_j`）、Framework Desktop AMD Ryzen AI Max+ 395 Strix Halo（x86-64 Linux 0440 root:energy PLATYPUS 隔离 RAPL `reported_j` 加上 amdgpu PPT），以及 Intel Core i9-13900H Raptor Lake（x86-64 Linux RAPL psys L1 和 package-0 L2 `reported_j`）。原始 `measured_j`、`reported_j` 和 L4 逻辑通道保持严格分离，从不求和；由于共同租户工作负载在共享主机上运行（`dedicated_host` 为 false），A2 网络放置归因根据 Falsifier 6 被保留。"
lang: "zh-Hans"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*修订版 af57f48，2026 年 11 月 22 日。数据与摘要：[/data/#satb-harness](/data/#satb-harness)。交互式动态图表：[/living/satb-harness/](/living/satb-harness/)。LaTeX 存档版本：[/pdfs/latex/satb-harness.pdf](/pdfs/latex/satb-harness.pdf)（[源文件](/pdfs/latex/satb-harness.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概述

当两份智能体评测报告的任务完成率或能耗数字不一致时,差异往往来自模型的封装方式与宿主计数器的归因方式,而非模型本身。仅改变外围线束,就可使 `Gemini 2.5 Pro` 在 `Terminal-Bench 2` 上的任务解决率变化 `17` 个百分点;而若减去已漂移的空闲基线,或按处理器时间切分共享的硅片供电轨,则可能使能耗归因偏差超过 `30%`。

本研究规定并实证验证了**饱足基准(Satiation Benchmark,`SATB`)**的评测契约:包括一套固定的顺序执行 Rust 参考线束(**`Lane B`**);一座用于零模型对照、原始模型端点、外部命令行线束及公开基准求解器的代理隔离适配器桥(**`Shapes D、M、H 与 I`**);一个五块式被测系统(`SUT`)密码学指纹;十二项强制一致性检查;以及一套五级无 root 遥测引擎。我们并未停留在纸面设计,而是在**四种硬件原型**上执行了实时一致性与证伪基准测试:`Apple M5 Max` 工作站(`128` 吉字节统一内存,`macOS 27.2.1`,片上 `IOReport` 与内核 `proc_pid_rusage` 提供的 `reported_j`);Tegra `aarch64` 开发套件(`Jetson Thor`,`Linux 6.8.12-1021-tegra`,提供德州仪器整板及三通道分轨电流分流器的物理 `measured_j`);`Framework` Desktop `Strix Halo` 工作站(`Ryzen Max+ 395`,`Linux 7.0.0-43-generic x86-64`,由 `0440 root:energy` 组隔离的封装能耗 `reported_j` 及 `amdgpu` 封装功耗跟踪);以及 `Raptor Lake` 工作站(`Intel Core i9-13900H`,`Linux 7.0.0-43-generic x86-64`,平台与封装能耗 `reported_j`)。对于封闭的云服务器能耗,则严格标记为 `not_available`。

**通俗而言**

1. 代理的提示循环、上下文裁剪规则和工具沙箱可以使基准分数的波动程度相当于更换底层模型，因此 `Lane B` 在确定性 Rust 中将该包装器完全固定，而 `Lane O` 则通过一个经过审计的代理插件强制使用外部包装器。

2. 能量通道在其真实的物理边界处原始记录，包括整壁插座、板卡输入、芯片封装、操作系统进程估计或逻辑令牌账本，且绝不合并为单一未标记的数值，也不在证据类别（`measured_j` 与 `reported_j` 与 `est_j`）之间求和，或使用车队可持续性平均值进行回填。

3. 在四个平台硅芯片上进行的实时测试验证了精确的 `Shape D` 百万记录内存映射（`15027705736`）和 `C9` 重放（`149,747 B`、`0` 字节差异）确定性，`0.87-9.54 ms` 进程树杀死清理，云端 `temperature = 0` 在三家供应商之间的非确定性，硬件传感器采样率上限（`24.3-45.4 µs` `x86-64` 计数器读取在 `94-97 Hz` 与 `2.95 ms` 串行总线分流读取在 `66.6 Hz` 的 `Jetson Thor` 对比 `~8 Hz` 的 `macmon` `IOReport`），在按处理器时间划分顺序计算加存储阶段时出现 `32.59%-72.89%` 错误（`Falsifier 3`），以及物理图形与处理器分流轨道的分离，配合 `Falsifier 6` 共享主机漂移门控（`dedicated_host = false`）。

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语、首字母缩写词与归因标签

<ul id="terms">
<li>SATB、SUT、PFRK、OQ、SPEC、BUNDLE、SUBMIT、REFUSE、STOP：饱足基准（Satiation Benchmark）线束与归因规范、被测系统、四类尝试结果（通过、失败、拒绝、终止）、已解决的规范开放问题、规范性规范文档、任务包文件、终态答案提交调用、终态拒绝调用，以及顺序循环终止标记</li>
<li>ACI、SWE、CLI、MCP、SDK、ACP、ARC、AGI、GUI：智能体-计算机接口、软件工程基准前缀、命令行接口、模型上下文协议、软件开发工具包、智能体客户端协议、抽象与推理语料库、通用人工智能基准套件，以及图形用户界面</li>
<li>IO、JSON、JSONL、RPC、JCS、UTF、HTTP、SSE、URL：输入/输出协议、JavaScript 对象表示法、按行分隔的 JSON、远程过程调用、JSON 规范化方案（RFC 8785）、Unicode 转换格式、超文本传输协议、服务器发送事件，以及统一资源定位符</li>
<li>POSIX、MMAP、DNULLMM1、SHA、SIGKILL、ESRCH、EACCES、EOF：可移植操作系统接口、内存映射文件接口、二进制内存映射的确定性空索引格式、安全哈希算法（SHA-256）、不可捕获的 POSIX 进程终止信号、内核“进程不存在”状态、POSIX 权限拒绝错误状态，以及 heredoc 文件结束分隔符</li>
<li>AI、ML、LLM、MLX、GGUF、KV、TP、ENERGY：人工智能、机器学习、大语言模型、面向本地推理的 Apple 数组框架、GPT 生成统一格式量化权重、键值缓存、张量并行，以及 ML.ENERGY GPU 功耗基准联盟</li>
<li>CPU、GPU、APU、ANE、SoC、ALU、ISA、IPC、PID、UID、GID、OS、VM、EC、GB：中央处理器、图形处理器、加速处理单元、Apple 神经网络引擎、片上系统、算术逻辑单元、指令集架构、每周期指令数、进程标识符、用户标识符、组标识符、操作系统、虚拟机、嵌入式控制器，以及吉字节</li>
<li>RAM、DRAM、SLC、NVMe、PSU、PDU、AC、DC、DVFS、MSR、MMIO：随机存取存储器、动态随机存取存储器、系统级缓存、非易失性存储器快速访问协议、电源供应单元、配电单元、交流电、直流电、动态电压与频率调节、模型专用寄存器，以及内存映射输入/输出</li>
<li>RAPL、NVML、PPT、TI、I2C、ADC、INA、INA238、INA3221、AGX、VDD、SOC、MSS、VIN、SYS、PLATYPUS：英特尔/AMD 运行平均功率限制、NVIDIA 管理库、AMD 封装功率跟踪、德州仪器、集成电路间总线、模数转换器、德州仪器电流/功率监测芯片系列（`INA238`、`INA3221`）、NVIDIA Jetson AGX 模块等级、漏极供电电压轨、片上系统电压轨、存储子系统电压轨、输入系统电压轨，以及功耗泄漏攻击：利用软件攻击处理器（Power Leakage Attacks: Targeting Your Processor Using Software）</li>
<li>API、USD、CNCF、AISI、UK、AMD、NVIDIA：应用程序编程接口、美元、云原生计算基金会、AI 安全研究所、英国、先进微电子公司，以及 NVIDIA 公司</li>
<li>RCE、MoL、WCA、LUT6：Reality Code Engine [同一组织]、Mixture of Limits [同一组织]、Wise Computer Automation [同一组织]、以及 6 输入布尔查找表</li>
</ul>

在遥测等级 L0 至 L4 范围内，`SATB` 收据中记录的每个通道均须同时标注其物理边界，以及四类严格证据类别之一。

| 证据类别 | `SATB` 收据与表格中的适用范围 |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | 任务包的 `SHA-256` 与 `JCS`（`RFC 8785`）规范摘要、五块式 `SUT` 指纹及重放记录；代理记录的提示、缓存、推理与补全 token 计数；挂钟时长；以及带日期的 `API` 标价 `USD`。 |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | 仅当数据来自经校准的外部 `AC` 墙面功率分析仪（`L0`）或物理板级电流分流监测器（`L1`/`L2`）时才予以填充。已在 `NVIDIA Jetson AGX Thor` 上通过 `TI` `INA238`（`hwmon6` `VIN`，`L1`）与 `INA3221`（`hwmon5` `ch1 VDD_GPU`、`ch2 VDD_CPU_SOC_MSS`、`ch3 VIN_SYS_5V0`，`L2`/`L1`；`board_metered = true`）完成实时验证。由于采集期间活跃的同租户负载占用了 `VDD_GPU`（`dedicated_host = false`），原始轨道 `measured_j` 予以保留，而 `A2` 净放置归因则被扣留。`Apple M5 Max`、`AMD Strix Halo` 与 `Intel Raptor Lake` 上 `measured_j` 保持为 `None`，全程均未设置 `L0` 墙面功率。 |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | 无需 root 权限的片上遥测计数器：`Apple M5 Max` 通过 `IOReport` 在 `L1` 提供 `sys_power`，在 `L2` 经 `macmon` 提供 `chip_power`/`cpu_power`/`gpu_power`；`Intel Raptor Lake` 的 `RAPL` 在 `L1` 提供 `psys`，在 `L2` 提供 `package-0`/`core`/`uncore`；`Framework AMD Strix Halo` 的 `RAPL` 在 `L2` 提供 `package-0`/`core`，并附带 `amdgpu` `PPT` 瓦数。另有 `OS` 建模的逐进程估计：`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（`L3`，标签 `D`）。此类数值严禁与 `measured_j` 或 `est_j` 求和。 |
| **`Provider-Attested (P) vs. Not Available (N)`** | 闭源 `API` 的远端服务器能耗仅当服务商返回附带逐字方法说明的单请求能耗数值时记为 `P`，否则字面记为 `"not_available"`（标签 `N`）。未通过 `5.0%` 漂移上限（`Falsifier 6`）或 `Step 7` 求和校验的派生基线减法将被自动剔除，原始通道保持完整。 |

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

## 2. 代理驾驭框架综述与上下文策略为何属于系统组成部分

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

1. **保持包装器不变 (`Lane B`) 与评估外部包装器 (`Lane O`)**: `Lane B` (`satb-agent`) 在所有模型中固定单一可审计的 Rust 循环，而 `Lane O` 将完整的第三方线束（`Claude Code`、`Codex CLI`、`OpenHands`、`Terminus-2`、`Inspect`）封装为黑盒 `SUT`，其内部提示和压缩调用被哈希进 `harness` 指纹块，并 100% 通过 `satb-proxy` 路由。
2. **上下文策略解析 (`OQ-1`: `ContextRule_v0`)**: 直接终止且不省略的尝试会将多步推理与冗长的工具输出混为一谈，而 `LLM` 生成的摘要（`Claude Code` 自动压缩）会注入隐藏的随机模型调用，破坏确定性线束回放。`Lane B` 采用 **`ContextRule_v0`**：只要累计对话大小超过声明的上下文窗口的 **`80%`**，线束会确定性地用 `"[ELIDED_BY_CONTEXT_RULE_V0]"` 替换最早的工具输出，同时保留 `system(TEMPLATE_v0)`、初始的 `user(render(bundle))`，以及 **最近的 `8` 条工具输出**，使 **零模型调用**。仅当这些保留的消息本身仍超过窗口的 `100%` 时，才会触发硬性 `killed(context_ceiling)`。
3. **工具表面解析 (`OQ-2`: `TOOLS_v0`)**: 纯 `exec`（`mini` 风格）迫使模型对多行源码补丁和代数证明进行 shell 转义（`cat << 'EOF'`），导致与任务推理无关的 shell 引号错误，并使在 `macOS` 与 `Linux` 上实现可移植的无根沙箱变得复杂。`Lane B` 修复了 **`TOOLS_v0`**，包括四个工作区工具（`exec`、`read_file`、`write_file`、`list_dir`）以及两个终端工具（`submit`、`refuse`），通过 `JCS` 规范化为 `tools_hash`（`d5b102...`）。

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

### 4.1 一个主管和代理背后的四种适配器形状

`Lane B` 之外的任何系统均通过以下四种适配器形状之一连接到 `satb-supervisor`：

| 适配器形状 | 目标系统 | 执行与隔离契约 | 复用的标准 |
| :--- | :--- | :--- | :--- |
| **`Shape D` (`dnull` 控制)** | 确定性空模型（`N0` 严格无模型和 `N1` 开发结晶化）基于冻结的 `DNULLMM1` `mmap` 存储 | 在 `/work` 内以完全相同的 `TOOLS_v0` 和 `Verifier` 规则执行，在决策时刻进行 **`0` 次代理模型调用**。 | `POSIX mmap`、`SPEC v0.4` 64 位整数循环 |
| **`Shape M` (模型端点)** | 本地开源权重服务器和封闭云 `API` | 通过 `Chat Completions` 或 `Messages` 运行 `Lane B` `satb-agent`，附带工具调用和强制 `usage`，100% 经由 `satb-proxy` 路由。 | OpenAI 兼容 `API`（`llama.cpp`、`mlx_lm`、`vLLM`）；`Anthropic`、`Gemini`、`xAI` 转换器 |
| **`Shape H` (盒中线束)** | `Claude Code`、`Codex CLI`、`Gemini CLI`、`OpenHands`、`Terminus-2` | 任务写入 `/work/task/BUNDLE.md`。基础 `URL` 指向 `satb-proxy`（`127.0.0.1:<port>`）；真实 `API` 密钥不提供给 `/work`；通过 `MCP` `submit` 或 `refuse` 结束；无其他出口。 | `Inspect` 沙箱桥接环境变量；`--strict-mcp-config` `MCP`；可选 `ACP` |
| **`Shape I` (`Inspect` 代理)** | 现有的公开基准 `Inspect` 求解器 | 以 `attempts = 1` 将 `SATB` 任务束包装为 `submit` 和 `refuse` 工具，所有模型调用均通过 `satb-proxy` 路由。 | `UK AISI Inspect` `Task` 和 `Solver` 接口 |

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

### 4.3 强制性 `C1-C12` 适配器一致性测试套件

任何适配器或线束在通过全部十二项一致性检查（`C1` 至 `C12`）之前，均不得进入评测。

| 检查项 | 通过要求 |
| :--- | :--- |
| **`C1` 任务包往返** | 适配器回显输入任务包的 `JCS` `SHA-256` 摘要，须与其完全一致。 |
| **`C2` 提交路径** | 外部 `Verifier` 接收到的字节序列，须与 `satb-proxy` / `MCP` 终端捕获日志中记录的字节序列完全一致。 |
| **`C3` 拒绝路径** | 受指令触发的拒绝须干净地以 `refuse` 形式到达（`sub_reason = "other"`，`completion_score = 0`）。 |
| **`C4` 单次终端调用** | 在第一个 `submit` 或 `refuse` 之后发出的任何工具或终端调用均被忽略，并计数。 |
| **`C5` 无预言机** | 从 `/work` 无法访问 `Verifier` 与 `satb-supervisor` 的目录、套接字及父路径（`..`）。 |
| **`C6` 出站网络** | 模型流量仅能通过 `satb-proxy`（`127.0.0.1:<port>`）访问；`/work` 子进程无任何外部网络访问权限，且不持有上游 `API` 密钥。 |
| **`C7` 用量字段存在** | 每次模型调用均须携带 `usage`（缺失则触发 `missing -> killed(usage_missing)`）；代理侧的 token 总数须与上游引擎计数完全一致。 |
| **`C8` 指纹稳定** | 在执行 3 次尝试的试运行前后，五块式 `SUT` 指纹的 `SHA-256` 须保持一致。 |
| **`C9` 线束重放** | 重放已记录的 `satb-proxy` 响应，须复现字节级一致的转录文本（字节差异为 `0`；对 `Lane B` 为强制要求）。 |
| **`C10` 终止路径** | 失控的 `/work` 进程树（包括已脱离的子进程）须在 `< 2,000 ms` 内被回收，并记录为 `killed`。 |
| **`C11` 遥测握手** | 无特权的 `L3` 进程计数器（`cgroup v2` 或 `proc_pid_rusage`）须可读取，阶段标记须可到达，并记录单调时钟与墙钟之间的偏移量。 |
| **`C12` 确定性探测** | 执行 `8` 次相同请求，并记录不同输出的数量，作为经验性的 `SUT` 属性。 |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. 五级遥测归因（`L0-L4 × A1-N`），平台通道映射，以及无法归因的内容

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="五级遥测归因边界 L0 到 L4 与标签 A1 到 N 的交叉，以及七步原始优先求和检查流水线。" />
  <figcaption>图 2. 左：映射到归因标签 <code>A1</code>-<code>N</code> 的物理和逻辑遥测层级 <code>L0</code>-<code>L4</code>。右：七步原始优先计数器纪律，强制执行前后基线漂移界限（<code>Falsifier 6</code>）以及 <code>Step 7</code> 求和检查。</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 遥测边界（`L0-L4`）与归因标签（`A1-N`）

能量和活动传感器位于五个不同的边界，它们测量物理上不同的量，绝不能求和或混淆：

| 层级 | 物理/逻辑边界 | 代表性传感器 | 通道可诚实归因的内容 |
| :--- | :--- | :--- | :--- |
| **`L0` wall** | `AC` 墙插座 | 智能插座或 `PDU`（`Shelly` `apower`, `aenergy`；`Yokogawa` 分析仪） | 整机包括 `PSU` 转换热、风扇、`DRAM` 和 `NVMe`；`~1 s` 采样率。 |
| **`L1` platform** | 主板 `DC` 输入轨 | `Jetson Thor INA238` 载板；`Mac sys_power`；`RAPL psys` | 电源砖或 `PSU` 下游 `DC` 侧的整台计算机。 |
| **`L2` package / SoC** | `CPU` 封装、`GPU` 和 `SoC` 轨 | `RAPL pkg`；无根 `macmon IOReport`；`Thor INA3221`；`amdgpu hwmon`；`NVML` 累积能量（`mJ`） | `SoC` 上的整个 `SUT`（`A2`），或当某轨物理上独占时仅推理引擎（`A1`）。 |
| **`L3` process / cgroup** | 单个 `OS` 进程树 | `Linux cgroup v2`（`cpu.stat`、`memory.peak`、`io.stat`）、`perf`；`macOS proc_pid_rusage` `ri_energy_nj` | 资源活动份额（`C`），或 `OS` 内核自身的内部每进程能量模型（`D`）。 |
| **`L4` logical** | 模型/工具对话 | `satb-proxy` 令牌计数和调用延迟；线束轮次、工具调用和 `ContextRule_v0` 省略 | 每个 `SUT` 上的精确计数，无一例外，包括封闭的云 `API`。 |

收据中的每个能量值都携带七种归因标签之一：

- **`A1`（独占物理电源轨）**：在测量窗口内仅由单一分区接触的硬件电源轨传感器（例如仅本地推理引擎拥有 `GPU` 设备访问权限时的 `Jetson Thor INA3221 ch1 VDD_GPU`）。
- **`A2`（专用整机边界）**：在静默的专用机器（`SUT` 加空闲 `OS` 基线）上测得的整机（`L0`/`L1`）或整封装（`L2`）计数器。**依据 `OQ-4`，`A2` 下的整 `SUT` 原始窗口能量是用于放置决策的主要物理能量指标**，这可防止精简模型把未计量的暴力搜索卸载到 `/work` 子进程中，也可防止 `active - idle` 减法美化慢速运行的结果。
- **`B`（时间阶段划分）**：在由顺序阶段标记界定的互不重叠时间窗口上的计数器差值（`Lane B` 中的 `model_call` 与 `tool_call`）。
- **`C`（比例分摊，`Kepler` 模型）**：当并行进程重叠时（`Lane O` `Shape H`），依据 $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ 或 `GPU` 利用率，将共享硬件计数器按比例划分给各分区。
- **`D`（`OS` 建模估计）**：内核内部的逐进程能量模型（`macOS ri_energy_nj`）。它能将进程树与 `CPU` 同租户隔离开来，但其本质仍是固件或内核模型，而非物理分流器读数。
- **`P`（提供方证明）**：云服务提供方随其逐字测量方法一并返回的逐请求服务端能量数值。
- **`N`（`not_available`）**：未被观测，且**绝不进行估计**。

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 七步计数器纪律、无 root 采集（`OQ-5`）与平台映射

`satb-meter` 按七个有序步骤处理每一次尝试（attempt）：
1. **在每个事件边界读取累积计数器**（`attempt.start`、每次 `model_call` 与 `tool_call`、`attempt.close`，外加一个 `100 ms` 参考时钟节拍），从而使窗口能量为精确的计数器差值 $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$。
2. **先写入原始通道**：记录边界、传感器、起止读数、计数器回绕次数与采样数；将短于 `10` 个传感器周期的窗口标记为 `"below_resolution"`，将缺失的硬件标记为 `"not_available"`。
3. **划分顺序阶段（`B`）**：在 `Lane B` 中，模型推理与 `/work` 工具调用从不重叠；并行的 `Lane O` 线束将阶段划分降级为 `C` 或 `N`。
4. **隔离 `engine_resident_during_tools`**：当 `/work` 工具运行时，本地模型服务（`llama-server`、`vLLM`）会在 `GPU`/`DRAM` 上常驻权重。其在工具窗口内的空闲功耗被归入 `engine_resident_during_tools`，既不计入模型主动推理，也不计入工具执行。
5. **仅在分区重叠处按比例划分（`C`）**：将 $\Delta \text{CPU}$ 比例严格作为特征化回退方案使用，并认识到 `C` 态、睿频 `DVFS` 以及 `DRAM`/存储停顿会破坏比例性假设。
6. **将基线存储为派生通道**：以常驻基线包围各会话的前后两端；若前后空闲功率漂移超过 `5.0%`（`Falsifier 6`），则丢弃派生的净高于空闲值，同时保持原始通道完整不变。
7. **运行求和检验（`Falsifier 2`）**：验证派生的阶段分量之和能否在一个传感器量化单位（`1 mJ`）内还原为原始尝试计数器差值；若不能，则舍弃派生划分，仅保留原始通道。

**无 root 采集规则（`OQ-5`）。** 基准测试绝不可以 `root` 身份运行 `SUT` 编排。在 `macOS` 上，`satb-meter` 使用无 root 权限的 `macmon`（`IOReport` 订阅）以及 `libSystem` 的 `proc_pid_rusage(RUSAGE_INFO_V6)`，绝不使用 `sudo` 或 `powermetrics`。在 `Linux` 上（自内核 `5.10` 起，在 `PLATYPUS` 事件之后，`/sys/class/powercap/intel-rapl` 变为仅 root 可读），管理员需一次性配置 `udev` 规则，向专用的 `satb-meter` 用户组授予读取权限，该组**仅包含 `satb-supervisor` 的 `UID`**，从而确保 `/work` 沙箱进程既无法通过侧信道窃取 `RAPL`，也无法读取其自身的能量计量数据：

| 目标平台 | `L0` / `L1` 整系统通道 | `L2` 封装 / `SoC` 通道 | `L3` 进程与 `L4` 逻辑通道 | 关键验证状态 |
| :--- | :--- | :--- | :--- | :--- |
| **Apple Silicon Mac** (`M5 Max` 已验证) | `L0`：`Shelly` `PDU`（未插入时为 `not_available`）；`L1`：`macmon sys_power`（`reported_j`） | `macmon IOReport`：`chip_power`、`cpu_power`、`gpu_power`、`ane_power`、`ram_power`（`reported_j`） | `L3`：`proc_pid_rusage` `ri_energy_nj`（`D`）、`ri_instructions`、`ri_diskio_*`；`L4`：`satb-proxy` | Rootless `L1`-`L4` 在 `Apple M5 Max` 上实时验证；`L0` 插头开放。 |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`、`Linux x86-64` 已验证) | `L0`：`Shelly` `PDU`（未插入时为 `not_available`）；`L1`：`cros_ec`（`0` 功率属性） | `RAPL package-0` 与 `core`（`0440 root:energy` `udev`）`reported_j` + `amdgpu` `PPT` `power1_input`（`0444`；`energy1_input` 缺失） | `L3`：`cgroup v2` / `getrusage`（`C` 活动份额）；`L4`：`satb-proxy` | 实时验证（`0440 root:energy` `PLATYPUS` 隔离；`amdgpu PPT` `0444`）。 |
| **Intel Raptor Lake** (`Core i9-13900H`、`Linux x86-64` 已验证) | `L0`：`not_available`；`L1`：`RAPL psys`（`intel-rapl:1/energy_uj`，`0444` `reported_j`） | `RAPL package-0`、`core` 与 `uncore`（`MSR` + `MMIO` `energy_uj`，`0444` `reported_j`） | `L3`：`cgroup v2` / `getrusage`（`C` 活动份额）；`L4`：`satb-proxy` | 实时验证（`0 µJ` `Step 7` 残差跨越 `psys` `L1` 和 `package-0` `L2`）。 |
| **NVIDIA Jetson AGX Thor** (`Linux aarch64` Tegra 已验证) | `L1`：`TI INA238`（`hwmon6` `VIN`，`0444` `measured_j`）+ `INA3221 ch3 VIN_SYS_5V0`（`0444` `measured_j`） | `INA3221 ch1 VDD_GPU`（`0444` `measured_j`，独占时为 `A1`）；`ch2 VDD_CPU_SOC_MSS`（`0444` `measured_j`）；`NVML`（`unverified`） | `L3`：`cgroup v2` / `getrusage`（`C` 活动份额）；`L4`：`satb-proxy` | 实时验证（`INA238` + `INA3221 ch1-ch3` `0444` rootless；GPU `NVML` 在共同租户锁下开放）。 |
| **Closed Cloud `API`** (`Anthropic`、`xAI`、`Cerebras`、`OpenAI`、`Google`) | 本地 `L0`-`L1` 仅测量客户端主机（从服务器推理中排除） | 远程服务器 `L2`：严格为 **`N` (`not_available`)** 或按请求 **`P`**（`OQ-6`） | 本地 `/work` `L3`（`D`/`C`）用于沙盒工具；`L4`：**精确** `satb-proxy` 令牌、调用、`USD` | 通过 `satb-proxy` 在 `Anthropic`、`Cerebras` 和 `xAI` 上实时验证。 |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 八类硬件测量陷阱与七类不可归因量

标准功率测量捷径在现代`SoC`和`GPU`上会系统性地失效：

| 硬件遥测陷阱 | `SATB`缓解措施 |
| :--- | :--- |
| **空闲功率随管芯温度、风扇、`DVFS`和睿频而漂移** | 等待`GPU`冷却（`<= 1.5 W`），用前后基线括起每个窗口，记录峰值`GPU`温度，并在派生净焦耳高于`5.0%`漂移时使其无效（`Falsifier 6`）。 |
| **冷机器空闲与权重驻留空闲之间的歧义** | 在`Step 6`中明确测量并标记两者，而不是默默减去其中之一。 |
| **`Active - idle`减法会美化慢速运行** | 整个`SUT`原始窗口能量（`A2`）仍是主要放置指标（`OQ-4`）。 |
| **子周期窗口被读作零、负值或量化噪声** | 将任何短于`10`个传感器周期的窗口标记为`"below_resolution"`（例如，在`~8 Hz`的`macmon`上`< 1.2 s`，或在`1 Hz`智能插座上`< 10 s`）。 |
| **高频遥测采样器会消耗显著的`CPU`功率** | 在事件边界处读取累积计数器（`0.011 mW` at `0 Hz`）加一个`100 ms`滴答；记录`observer_only`基线。 |
| **`NVML`在`A100`/`H100`上的瞬时功率仪表仅采样运行时的`~25%`** | 读取累积的`nvmlDeviceGetTotalEnergyConsumption`（`mJ`），绝不使用瞬时的`nvmlDeviceGetPowerUsage`轮询（Chung et al.; Yang et al.）。 |
| **外部`L0`墙插运行在不同步的时钟上** | 在`session.open`和`session.close`处发出确定性的`50%`占空比校准负载脉冲，并进行时间戳互相关。 |
| **共享主机后台守护进程或共同租户作业** | 记录进程列表，通过`Falsifier 6`降级共享`L2`派生减法，并记录共同租户隔离的`L3` `ri_energy_nj`（`D`）以及原始`L2`。 |

因此，**七个量无法被诚实地归因**，且被禁止用于`SATB`声明：(1) 未经验证的封闭`API`服务器能量（仅`N`或`P`）；(2) 共享`SoC`或统一内存轨上的精确每进程物理焦耳（`C`和`D`是模型）；(3) 与服务内核、量化、批处理和硅片隔离的模型权重；(4) `OS`空闲基底和`DRAM`驻留权重功率的所有权（作为独立通道报告）；(5) 短于传感器周期的单个事件（例如在`1 s`插座下的`30 ms`工具调用）；(6) 缺少主机硬件计数器的共享云`VM`；以及(7) 静默的会话中提供商权重交换（由开始/结束金丝雀标记，绝不先验排除）。特别地（`OQ-6`），**提供商可持续性披露是机群中位数而非每请求测量，且绝不进入`SATB`收据**，包括Google的`0.24 Wh`中位数`Gemini Apps`提示、OpenAI的`0.34 Wh`数字（未附方法论发布）以及Mistral的每个`400`令牌响应的`1.14 gCO2e`。

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. 测得的一致性、确定性、观察者效应与多主机归因结果

为将未测量的设计假设替换为可审计的收据，我们在 `Apple M5 Max` 工作站（`arm64`，`128 GB` 统一内存，`macOS 27.2.1`，`macmon 0.12.0`）上执行了完整的 `SATB` 一致性套件和伪造器线束（`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`，总运行时间 `175.69 s`），同时进行了 `188` 窗口的跨研究审计。

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

<div id="66-multi-platform-hardware-attribution-across-four-silicon-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 跨四种硅架构的多平台硬件归因

为了验证 `SATB` 一致性、`Shape D` 定点确定性、无根 `PLATYPUS` 权限边界以及物理分流轨分离在 `macOS` 和 `Apple Silicon` 之外仍然成立，我们在 `Apple M5 Max` 之外的三个额外 `Linux` 硬件架构上执行了 `run_multi_host_satb.py`（`multi_host_satb_receipts.json`）：

| 硬件架构与 `OS` 内核 | 无根传感器边界与证据类别 | `Shape D` `1M` `DNULLMM1`（`10k` 探测） | `C9` 重放与 `C10` `SIGKILL` 均值 | 单次读取延迟与 `100 Hz` 达成情况 | `Step 7` 残差与 `Falsifier 3`（`C` vs. `B`） |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`**（`arm64`，`128 GB`，`macOS 27.2.1`） | `IOReport` `L1`/`L2` + `rusage` `L3`（`reported_j`；`measured_j = None`） | `15027705736`（`388.43 ns` `C++`，`582.57 ns` Rust） | `149,747 B`（`0` 差异）· `2.073 ms`（`0` `PID`） | `~120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`** Phase 2（`+35.86%` Ph. 1） |
| **`NVIDIA Jetson AGX Thor`**（`aarch64`，`122.9 GiB`，`Linux 6.8.12-1021-tegra`） | `TI INA238`（`hwmon6` `VIN` `L1`）+ `INA3221`（`hwmon5` `ch1-ch3` `L2`/`L1`，`0444` **`measured_j`**） | `15027705736`（`984.86 ns` `C -O3`，`2,489.4 ns` Py） | `149,747 B`（`0` 差异）· `9.544 ms`（`0` `PID`） | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2`（`-67.02%` `VIN`） |
| **`Framework AMD Ryzen AI Max+ 395`**（`x86-64`，`122.8 GiB`，`Linux 7.0.0-43`） | `RAPL package-0` & `core`（`0440 root:energy` **`reported_j`**）+ `amdgpu PPT`（`0444`；`measured_j = None`） | `15027705736`（`376.61 ns` `C -O3`，`1,341.7 ns` Py） | `149,747 B`（`0` 差异）· `0.868 ms`（`0` `PID`） | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0`（`-63.34%` `core`） |
| **`Intel Core i9-13900H`**（`x86-64`，`14.7 GiB`，`Linux 7.0.0-43`） | `RAPL psys`（`L1`）+ `package-0`，`core`，`uncore`（`L2`，`0444` **`reported_j`**；`measured_j = None`） | `15027705736`（`420.93 ns` `C -O3`，`863.6 ns` Py） | `149,747 B`（`0` 差异）· `1.120 ms`（`0` `PID`） | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0`（`-73.62%` `psys`） |

从这些实时收据中得出了四项跨平台硬件发现：

1. **位精确的 `Shape D` 和 `Lane B` 在 `arm64`/`aarch64` 与 `x86-64` 上的重放不变性**：所有四台主机均产生精确的 `10,000` 探针 `DNULLMM1` 校验和 **`15027705736`**、精确的 `test.setpoint` 冻结摘要 `0da4df8d9ccbce1e...4485781`，以及精确的 `149,747` 字节 `C9` 转录记录（`SHA-256` 为 `d697ed1476129939...`，`0` 字节差异），同时在 `0.868 ms` 至 `9.544 ms` 内通过 `SIGKILL` 回收 `4` 个失控 `PID` 进程组（即使在 `Jetson AGX Thor` 上 `loadavg_1m = 52.39` 时，仍远低于 `2,000 ms` 规范上限 `> 200×`）。
2. **物理 `INA238` / `INA3221` 分流隔离与实时 `GPU` 共租下的 `Falsifier 6`（在 `NVIDIA Jetson AGX Thor` 上）**：在 `Linux 6.8.12-1021-tegra` 上，`hwmon6`（位于 `i2c@c600000/ina238@44` 的 `ti,ina238`，`VIN` 为整板 `DC` 输入，电压约为 `~27.97 V`）以及 `hwmon5` 的全部三个通道（`ina3221@40`：`ch1 VDD_GPU`、`ch2 VDD_CPU_SOC_MSS` 和 `ch3 VIN_SYS_5V0`）均可全局读取（`0444`），无需 `sudo`。在我们严格的仅 `CPU` 探针（`dedicated_host = false`）期间，一个独立的共租 `llama-server` 持有主机 `GPU` 锁：

| `Jetson AGX Thor` 物理分流通道（`0444` 无需 root 的 `sysfs`） | 边界 | 基线前（`W`） | 阶段 1 计算（`measured_j` / `W`） | 阶段 2 `DRAM+fsync`（`measured_j` / `W`） | 基线后（`W`） | 漂移（`F6`）与 `Kepler` `C` 阶段-2 误差 |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`**（模块 + 载板输入） | **`L1`** | `100.70 W` | `122.12 J`（`101.66 W`） | `99.02 J`（`81.94 W`） | `97.21 W` | `3.47%`（`A2` 暂不提供：共租）· **`-67.02%`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`**（共租 `LLM`） | **`L2`** | `29.26 W` | `40.29 J`（`33.54 W`） | `26.00 J`（`21.52 W`） | `28.13 W` | 外部 `GPU` 共租（`F5` 中 `-36.1%` 摆动） |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36.68 W` | `45.73 J`（`38.07 W`） | `44.37 J`（`36.71 W`） | `36.08 W` | `1.64%`（`CPU`/`SoC`/`MSS` 域）· **`-70.01%`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`**（`5.08 V` 轨） | **`L1`** | `14.89 W` | `18.66 J`（`15.53 W`） | `16.82 J`（`13.92 W`） | `13.98 W` | **`6.13% > 5.0%`（触发 `F6`）** · **`-68.85%`** |

跨越四个 `Falsifier 5` 节拍窗口，波动的同宿 `LLM` 请求使 `ch1 VDD_GPU` 从 `35.36 J` 降至 `22.60 J`（`-36.1%`），并带动整板 `INA238 VIN`（`L1`）从 `107.48 J` 降至 `81.73 J`（`-24.0%`）。与此同时，`ch2 VDD_CPU_SOC_MSS` 仍保持在 `35.76-39.31 J` 范围内。由于 `dedicated_host = false`（且 `ch3 VIN_SYS_5V0` 的漂移超过 `5.0%`，达到 `6.13%`），`SATB` 撤回 `A2` 级别的整机 `SUT` 净归属结论，同时保留逐轨精确的 `measured_j`（`L1` 与 `L2` 通道从不求和）。

3. **`Framework` `AMD` 平台上 `PLATYPUS` `0440 root:energy` 隔离与 `Strix Halo` `APU` 域验证**：在 `Framework` Desktop（`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`，`Linux 7.0.0-43-generic`）上，`udev` 规则 `90-energy-read.rules` 将 `/sys/class/powercap/intel-rapl:0/energy_uj`（`package-0`）与 `intel-rapl:0:0/energy_uj`（`core`）的模式设为 **`0440`（`root:energy`，`world_readable = false`）**：未分组的 `/work` 沙箱 `UID` 会收到 `EACCES`（阻断 `PLATYPUS` 侧信道），而监管者 `GID`（`energy`）可以无特权读取累计微焦耳值，中位延迟为 `24.34 µs`（`Step 7` 残差为 `0 µJ`）。进一步检查 `hwmon9`（`amdgpu`）后，解决了一个尚未明确的规格细节：`Strix Halo` 集成的 `Radeon 8060S` 暴露的是全局可读（`0444`）的 `PPT` 功率（以 `µW` 计的 `power1_input` / `power1_average`，阶段 1 为 `75.38 W`，阶段 2 为 `69.72 W`），而非独立的 `energy1_input` 计数器；`cros_ec`（`hwmon8`）则仅暴露风扇与板级温度。

4. **传感器总线节拍物理特性（`I2C` 对比 `MSR`/`MMIO` 对比 `IOReport`）与通用 `Falsifier 3` 触发条件**：`x86-64` `powercap` `sysfs` 读取耗时为 `24.34-45.37 µs`（在名义 `100 Hz` 下实际达到 `94.28-97.12 Hz`），而在 `Jetson AGX Thor` 上，每次九寄存器的 `INA238`+`INA3221` 快照需经过物理 `i2c@c600000`，中位耗时为 **`2,948.8 µs`**（均值 `4.48 ms`），使 `100 Hz` 轮询上限被压制在 **`66.55 Hz`**（约为 `macmon` `7.44 Hz` `IOReport` 上限的 `8.9×`）；而在 `SATB` 的 `100 ms`（`10 Hz`）参考节拍下，则可稳定达到 **`9.49 Hz`**。在全部三台 `Linux` 主机上，基于 `CPU` 时间比例划分的 `Kepler` 式方法（`C`）对 `192 MiB` `DRAM` + `fsync` 阶段的归因偏低了 **`67.02%` 至 `73.62%`**，这在四种硅架构上印证了 `SATB` 将 `C` 限定于重叠并行运行的原因。

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. 开放硬件验证与限制

| 会话伪造器 | 触发时的后果 | 本研究中的经验状态 |
| :--- | :--- | :--- |
| **`F1` Replay mismatch (`C9`)** | 参考线束是非确定性的 | **已在 `4/4` 主机上通过（`149,747 B` 中 `0` 字节差异，`14` 次迭代）** |
| **`F2` Sum check fails on `> 5%` of attempts** | 主机上的归因拆分破坏 | **已在 `4/4` 主机上通过（`0 µJ` Linux `RAPL`/分流；`<= 1 µJ` `M5 Max`）** |
| **`F3` `B` and `C` disagree by `> 20%` sequentially** | `C`（`Kepler`）在主机上标记为不可靠 | **在 `4/4` 主机上触发（错误率 `32.59%-73.62%`）；`C` 受限** |
| **`F4` Known pulse load outside sensor accuracy** | 会话的传感器降级 | **开放（`L0` 智能插座同步脉冲装置尚未连接）** |
| **`F5` `10 ms` vs. `1 s` tick shifts window energy** | 遥测观察者效应 | **已通过（`0.76%` `M5 Max` `L2` 差异；在 `100 ms` 基准下达成 `9.49-10.48 Hz`）** |
| **`F6` Pre/post resident baselines drift `> 5.0%`** | 派生的净通道失效 | **活跃（`124/188` `M5 Max` 窗口 + Linux 共租户漂移已清晰门控）** |
| **`F7` Adapter passes `C1`-`C12`, fails canary** | 符合性不足；会话 `void` | **在仿真中验证（在切换时 `session_void = true`）** |
| **`F8` `Lane B` places below strong `Lane O` harnesses** | `Lane B` 被严格报告为基准 | **已通过（相对于 `Claude Code 2.1.330` 的 `24/24` 与 `6/6` 奇偶性）** |

仍有三项具体硬件与适配器待解决（`OQ-5`）：

1. **专用静止 `A2` 会话和 `L0` `AC` 插座校准**：虽然物理 `TI INA238`（`L1`）和 `INA3221`（`L2`/`L1`）分流 `measured_j` 轨道已在 `NVIDIA Jetson AGX Thor` 上实时验证，并且在 `Apple M5 Max`、`Framework AMD Strix Halo` 与 `Intel Raptor Lake` 上的无根 `reported_j` 计数器也已验证，但所有四台基准机器均运行了并行的共租户工作负载（`dedicated_host = false`），从而保留了 `A2` 整体 `SUT` 放置的声明；下一步是将同步脉冲的 `L0` `AC` 仪表（`Shelly` / `Yokogawa`）连接到静止的专用主机上。

2. **集成 `GPU` `NVML` 计数器检查在 `Jetson AGX Thor` 上**：对 `INA238` 与 `INA3221 ch1-ch3`（`VDD_GPU`、`VDD_CPU_SOC_MSS`、`VIN_SYS_5V0`）的无根 `sysfs` 权限（`0444`）以及 `Framework AMD Strix Halo` 的 `0440 root:energy` `RAPL` + `amdgpu PPT`（缺少 `energy1_input`）现已在设备上验证；对 `Jetson AGX Thor` 上的 `nvmlDeviceGetTotalEnergyConsumption` 进行探测仍需等到共享 `GPU` 锁空闲的空闲窗口。

3. **更广泛的 `Shape H` 与 `Shape I` 实时名单**：本研究中的实时外部线束运行在 `Claude Code 2.1.330` 上使用了 `Shape H`，并与 `Lane B` 与 `Shape D` 一同运行；下一步是对 `Codex CLI`、`OpenHands`、`Terminus-2` 与 `Shape I` `Inspect` 求解器执行实时 `C1-C12` 认证。

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
