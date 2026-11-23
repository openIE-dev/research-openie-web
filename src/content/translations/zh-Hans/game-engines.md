---
title: "一次编写游戏，随处运行：精确重放止于何处、容差始于何处"
deck: "一次编写的游戏可以作为已检查的状态机投射到多个引擎、指令集、操作系统和图形栈吗？在 Q32.32 整数物理下跨 30 个多 ISA 目标 × 主机单元执行 100 000 个 tick（GE-H1：在 arm64 macOS、aarch64 Linux、Zen 5 与 Raptor Lake x86_64 Linux、以及 Tiger Lake x86_64 Windows 11 上出现 0 / 25 500 次状态摘要不匹配），25 000 个跨平台浮点 tick（GE-H2：t_div = 10 Windows Universal C Runtime 和 Apple libm 与 Linux glibc sin/cos 的差异，t_div = 192-406 融合乘加在未使用 -ffast-math 的情况下的降低），以及 8 条硬件图形终端跨 Metal、Vulkan 和 DirectX 12（GE-H3：0.00%-9.34% 像素漂移，Δ_max ≤ 2，峰值信噪比 ≥ 64.2 dB，结构相似度 ≥ 0.99983，全部 28 对均符合），并配有可玩性焦耳预算的 Q32.32 原型。"
lang: "zh-Hans"
source: "game-engines"
complete: true
---

<div id="writing-a-game-once-and-running-it-everywhere-where-exact-replay-ends-and-tolerance-begins" class="anchor-alias" aria-hidden="true"></div>

*修订 1561a2a，2026年11月22日。交互式浏览器，3-OS / 3-API 跨 GPU 检查器，以及可玩 `Q32.32` 时间预算竞技场：[research.openie.dev/living/game-engines/](/living/game-engines/)。

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 摘要

本研究探讨是否可以一次编写为受检状态机的游戏，然后跨语言、每种操作系统（OS）、每种中央处理器（CPU）指令集架构（ISA）以及每种图形处理器（GPU）应用程序接口（API）进行投射。调查的规范以及三个已执行的经验否证套件给出了明确的界限：**是**，用于在固定点整数算术下的游戏规则和仿真（`(GE-H1)`：在 `100,000` 计时的 16 体 2D 竞技场中，跨 `30` 个目标×主机单元，涵盖三种操作系统和三种指令集，`arm64` `macOS 27.2.1`、`aarch64` `Linux 6.8`、AMD Zen 5 与 Intel Raptor Lake `x86_64` `Linux 7.0`，以及裸机 Intel Tiger Lake `x86_64` `Windows 11` 构建 `26300` 包含 Microsoft Visual C++ (`MSVC`) `cl.exe`，在 macOS 每进程 `reported_j` 为 `0.073 J` 至 `13.60 J`，在 Linux Running Average Power Limit (`RAPL`) 包 `reported_j` 为 `1.89 J` 至 `181.87 J`，且 **安全哈希算法 256 位 (`SHA-256`)** 检查点不出现不匹配）；**否**，当未钉住的浮点超越函数或融合乘加 (`FMA`) 降低导致混沌多体碰撞时（`(GE-H2)`：即使 **不使用** `-ffast-math` 或 `/fp:fast`，三种桌面 OS 的数学库形成配对发散三角形，Windows Universal C Runtime (`UCRT`) 与 Linux 系统 `glibc` `std::sin`/`std::cos` 在相同 `x86_64` ISA 的第 `10` 计时点出现分歧，Apple `libSystem` `libm` 与 Linux `glibc` 在第 `10` 计时点分歧，Windows `UCRT` 与 Apple `libm` 在第 `37` 计时点分歧，而 `MSVC` `/fp:precise` 与 `Clang` `-ffp-contract=fast` 在 `x86_64` 第 `192` 计时点分歧，`x86_64` `-mavx2 -mfma` 与 `arm64` `fmadd` 在第 `406` 计时点分歧）；以及 **否**，针对 GPU 后端的像素位精确匹配，**但**在有界单向容差门下为 **是**（`(GE-H3)`：跨八个硬件 `GPU × API` 端点，涵盖 Apple `Metal`、Linux Mesa Radeon Vulkan (`RADV`)、Nvidia (`NVIDIA`) Linux 与 Windows `Vulkan`、Windows DirectX 12 (`DX12`)、以及 Intel Linux Mesa Vulkan (`ANV`) 与 Windows `Vulkan` 与 `DX12`，在 `512×512` `RGBA8Unorm` 下，`27 / 28` 硬件对包括 **相同物理 GPU** 在 `DX12` 与 `Vulkan` 上的 `GeForce 2060` 与 `Iris Xe`，在原始 `SHA-256` 上存在差异，但所有 `28 / 28` 硬件对保持最大每通道误差 $\Delta_{\max} \le 2 / 255$，峰值信噪比 (`PSNR`) `>= 64.16 dB`，结构相似性 (`SSIM`) `>= 0.99983`，且 `measured_j = None`、`board_metered = false`）。

**简言之**

1. **跨操作系统、芯片和语言的精确仿真在算术为整数限定时可实现。** 在 `100,000` 计时点（`25,500` 经过验证的 `SHA-256` 检查点遍及 `30` 单元）中，原生 Rust、C++20（`Clang`、编译器套件（`GCC`）以及 Windows `MSVC`）、WebAssembly（`Wasm`）、JavaScript `BigInt` 与 Python 在 `macOS`（`arm64`）、`Linux`（`aarch64` 与 `x86_64`）和 `Windows 11`（`x86_64`）上均能逐位重放相同的 732 字节状态，零不匹配。

2. **标准浮点物理在 `Windows`、`macOS` 与 `Linux` 上会出现漂移，即使未使用 fast-math 标志。** 纯代数的 `+`、`-`、`*`、`/` 与 `sqrt` 在禁用 `FMA`（`/fp:strict` 与 `-ffp-contract=off`）的情况下，可在所有测试的操作系统和指令集上对齐 `25,000` 计时点的结果，但调用 `std::sin`/`std::cos` 时，在 Windows `UCRT`、macOS `libm` 与 Linux `glibc` 之间会在 `10` 至 `37` 计时点内翻转位（`0.17-0.62 s`，`60 Hz`），导致游戏得分在第 `9,798`-`10,392` 计时点（`163.3-173.2 s`）不同步；同时，默认编译器的 `FMA` 规则在 `MSVC`（`/fp:precise`）与 `Clang`（`-ffp-contract=fast`）之间于第 `192` 计时点出现分歧，在 `x86_64` 与 `arm64` 之间于第 `406` 计时点出现分歧。

3. **即使是相同显卡，在 `DirectX 12` 与 `Vulkan` 之间也可能翻转像素位，因此渲染属于单向容差门的下游。** 在八个硬件 `GPU × API` 端点（`Metal`、`Vulkan` 与 `DirectX 12`）以及 Windows 高级光栅化平台（`WARP`）和 `Mesa llvmpipe` 中，对完全相同的 `NVIDIA GeForce 2060`（`108.34 dB` `PSNR`）或 `Intel Iris Xe`（`79.52 dB` `PSNR`）切换 `DirectX 12` 与 `Vulkan` 会通过着色器编译器降级导致 `1` 个最低有效位（`LSB`）翻转；跨厂商组合在 `0.00%`-`9.34%` 的像素上出现最多 `2` 个 `LSB` 差异（`PSNR >= 64.16 dB`，`SSIM >= 0.99983`），但从不破坏仿真状态。

![拟议拆分的示意图。顶部方框包含游戏形式 P 等于 S、E、delta、D、lambda，带有类型化接口模式和严格检查器。箭头指向四个投影：左侧精确区域中的模拟（Rust、WebAssembly、XState、SCXML、Python）和脚本（Rhai、Lua、Luau），由每时钟周期状态哈希判断；右侧容差区域中的场景（BSN 类、glTF、OpenUSD）和渲染（Slang、WGSL、WESL），由每像素误差判断。一条虚线垂直线标记确定性边界。底部带列出仅作为记录事件进入的主机效应：输入、时钟、音频、网络、资产输入和输出、GPU 绘制、装饰物理。](/figures/game-engines/architecture.svg)

*图 1. 拟议拆分。一个形式馈送四个投影。模拟和脚本位于精确区域，由每时钟周期状态哈希判断。场景和渲染位于容差区域，由每像素误差判断。主机效应仅作为记录事件进入。*

![网格，十一行现有表示形式（Slang、Naga、WGSL 和 WESL、glTF、OpenUSD、BSN、SCXML 和 XState、VGDL、GameRule、nAIVE、SpacetimeDB）和七列能力（行为、场景、着色器、执行顺序、多目标、重放日志、跨层检查）。绿色单元格标记已记录能力，琥珀色为部分，灰色为缺失或未记录。跨层列除 Slang 和 nAIVE 的部分标记外均为灰色。](/figures/game-engines/coverage.svg)

*图 2. 现有表示方法的覆盖情况,仅依据本研究所阅读文献进行评分。绿色:有文献记载的能力。琥珀色:部分具备。灰色:缺失或未有文献记载。最右侧一列即跨层检查,几乎全部为空。*

<div id="1-terms-notation-and-the-idea-under-test" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语、记号与待检验的思路

<ul id="terms">
<li>RCE, IR, ECS, FSM, SDF：现实代码引擎[同一家]、中间表示、实体组件系统、有限状态机和有符号距离场</li>
<li>中央处理器, 图形处理器, 指令集架构, 指令集架构, 单指令多数据, 高级向量扩展 2, Arm 高级单指令多数据, 特殊功能单元, 光栅操作流水线, Intel 猛禽湖移动架构, Intel 虎湖移动架构</li>
<li>IEEE, FMA, VFMADD, VFNMADD, FMADD, FMSUB, ULP, LSB, SHA, MAE, RMSE, PSNR, SSIM, SD, RGBA8：电气和电子工程师协会（IEEE 754 浮点数标准）、融合乘加、x86_64 向量融合乘加和取反乘加操作码、AArch64 标量融合乘加和乘减操作码、末位单位、最低有效位、安全散列算法（`SHA-256`）、平均绝对误差、均方根误差、峰值信噪比、结构相似性指数、标准差和每通道 8 位红绿蓝阿尔法帧缓冲格式</li>
<li>WebGPU 着色语言, WebGPU 扩展着色语言, 标准可移植中间表示 V, OpenGL 着色语言, 高级着色语言, Metal 着色语言, Direct3D 11, Direct3D 12, DirectX 12, `wgpu::Backends::VULKAN` 和 `wgpu::Backends::METAL` 后端标志, DirectX 中间语言, DirectX 字节码, DirectX 着色器编译器, 传统 Direct3D 效果编译器工具, Windows 高级光栅化平台软件 DirectX 12 光栅化器, Windows 显示驱动程序模型, 计算统一设备架构</li>
<li>Mesa Radeon Vulkan 驱动程序, Mesa Intel Vulkan 驱动程序, 低级虚拟机编译器基础设施, GNU's Not Unix 项目, GNU 编译器集合, Microsoft Visual C++ 编译器 (`cl.exe`), Windows 通用 C 运行时 (`ucrtbase.dll`), Windows 新技术内核 (`Windows NT`), Windows 可移植可执行文件, 操作系统, 应用程序编程接口, 即时编译器, Web 扩展现实 API, Web 模型上下文协议, 统一资源定位符, JavaScript 对象表示法, YAML Ain't Markup Language, 仓库 README 文档文件, 兆字节, C# 编译器缺失类型诊断 CS0246, Capcom RE ENGINE (“Reach for the Moon” / “RE neXt” 引擎品牌), Dagstuhl Follow-Ups DOI 前缀</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG：状态图 XML、游戏描述语言、视频游戏描述语言、Bevy 场景表示法、Boldsea 语义语言、多级中间表示、原子性/一致性/隔离性/持久性事务、Good Game Peace Out 回滚网络库、图形语言传输格式（ISO/IEC 12113:2022）、开放通用场景描述、通用场景描述、局域网、人工智能和计算智能与游戏</li>
<li>SATB, RAPL, MSR, PID, RUSAGE, V6, AMD, NVIDIA, RTX, V100, GH200, CTC: 饱和分层基准遥测级别（`L2` 插座/封装计数器，`L3` 每进程内核计数器）[同一家]，运行平均功率限制，特定模型寄存器，进程标识符，`proc_pid_rusage` (`RUSAGE_INFO_V6`)，超威半导体，NVIDIA 公司，NVIDIA GeForce RTX GPU 系列，Volta V100 GPU，Grace Hopper GH200 超芯片，以及闭时间曲线</li>
</ul>

为了使前向引用自上而下透明，第 1 节定义 Form 符号，第 2 节概述现有游戏表示，第 3 节分析浮点数分歧，第 4 节列举中间表示，第 5 节阐述所提层划分，第 6 节报告 3-OS 多 ISA 与 3-API 跨 GPU 伪造器运行结果，第 7 节列出不可行标记，第 8 节记录来源与限制。

[Reality Code Engine (RCE)](https://research.openie.dev/about/rce/) 将程序视为名为 Form 的状态机，记为 $P = (S, E, \delta, D, \lambda)$：

- $S$：状态集合；
- $E$：事件（输入）集合；
- $\delta : S \times E \to S$：转移函数；
- $D$：记录每一步的追加日志；
- $\lambda$：从状态到可观测输出的映射。

严格检查器要么接受一个 Form，要么指明其违背的规则。随后发射器将接受的 Form 投射为 Rust、Python、JavaScript 和 Scala。XState（一个 JavaScript 与 TypeScript 状态图库）、SCXML（万维网联盟推荐标准）以及 WebAssembly（`Wasm`）并非发射器的目标；本研究将它们视为候选投射。由于每一步都记录在 $D$ 中，任何运行都可被重放。

游戏引擎是更庞大的机器。它在 GPU 上运行固定步长仿真、脚本层、场景描述以及渲染管线。第 1-8 节探讨哪些层可以放入 Form，哪些必须作为宿主效应保留在外，以及何时必须从精确性转向容差。

该思想有悠久的渊源。斯坦福的 [Game Description Language (GDL) 规范](http://ggp.stanford.edu/readings/gdl_spec.pdf) 涵盖“有限、离散、确定性的多玩家完全信息游戏”，并指出此类游戏的自然底层模型“是有限状态机”。在游戏引擎中新出现的不是状态机本身，而是其周围的一切：浮点物理、脚本、场景和 GPU。

<div id="2-what-the-landscape-shows" class="anchor-alias" aria-hidden="true"></div>

## 2. 景观所示

<div id="21-game-logic-as-data-already-works-on-one-backend" class="anchor-alias" aria-hidden="true"></div>

### 2.1 游戏逻辑作为数据已在单一后端生效

GameRule（[Multimedia Systems 32:564, 2026](https://doi.org/10.1007/s00530-026-02629-8)）将行为表达为每个行动者（per-actor）的 *when-do* 规则，涵盖 14 种创建、读取、更新和删除动作以及 6 种条件。其确定性契约非常具体：一个中央调度器以声明顺序从单个 FixedUpdate 运行，最后一次写入胜出，且生成与删除操作被推迟到遍历结束时执行。作者通过引用 Unity 手册来论证该契约，手册指出脚本执行顺序“在不同构建、机器或 Unity 版本间无法保证”。在三个 Unity 示例游戏（Haunted Jaunt、Survival Shooter、Tanks）中，行为代码从 572 行缩减至 107 行（−81.3%）。

代价是可量化的。规则解释的开销约为每个行动者每步 $c \approx 65\ \mu\text{s}$。在步长预算 $T = 20$ ms 下，行动者上限为

$$N_{\max} = \frac{T}{c} = \frac{20\ \text{ms}}{65\ \mu\text{s}} \approx 308,$$

这与论文观察结果一致：预算在 200 到 350 个行动者之间被超出（350 个行动者时为 23.872 ms）。目前仅存在 Unity 后端，因此跨引擎的可移植性仅被论证而未得到实际验证。

<div id="22-order-of-execution-can-be-made-deterministic-by-construction" class="anchor-alias" aria-hidden="true"></div>

### 2.2 执行顺序可通过构造实现确定性

ECS 模式将游戏状态存储为附加到实体标识符的组件，并以系统形式在其上运行行为。Redmond、Castello、Calderón Trilla 和 Kuper 为其给出了形式模型 Core ECS（[arXiv:2508.15264](https://arxiv.org/abs/2508.15264)）。他们证明，如果每个并发变异对均可交换，则调度是确定的；并且写入不相交组件标签集合的两个子调度可并行运行而不会改变结果。通过调研 Bevy ECS、EnTT、Flecs、Specs 和 apecs，他们发现没有一个允许在与其他变异并发时附加新组件；此类结构变更会被推迟并串行应用。Tasnim 和 Zhao（[SAC 2026, doi:10.1145/3748522.3779910](https://doi.org/10.1145/3748522.3779910)）为原型 ECS 增加了操作语义和类型系统，该系统跟踪每个系统的读写集合，并报告了一个塔防模拟：在并行原型布局下达到 109.54 帧每秒，而面向对象基线为 36.13 帧每秒。GameRule 的推迟生成和删除采用了相同的规则，是独立得出的。

<div id="23-compiling-is-not-the-same-as-being-right" class="anchor-alias" aria-hidden="true"></div>

### 2.3 编译通过不等于结果正确

Mage 基准测试（[arXiv:2605.07342](https://arxiv.org/abs/2605.07342)）在 26 个 Unity 机制模式上共进行了 858 次生成尝试。在没有 IR 的情况下，43% 的输出在运行时通过了检验，但机制 F1（请求机制与实现机制之间的一致性）仅约为 0.12。以 IR 为条件后，运行时通过率降至 14% 至 21%，但机制 F1 提升至 0.82 至 1.00。编译通过率与功能正确性呈负相关：缺失类型错误 CS0246 在 IR 条件下出现了 469 次，而在无 IR 条件下出现次数为零。仅含行为的 IR 与完整场景 IR 在统计上无显著差异（McNemar p = 1.0）。这对 RCE 的启示是：仅能证明"能够编译"的检查器衡量的是错误的量。接口检查必须是行为层面的。

<div id="24-public-benchmarks-with-replayable-traces-exist" class="anchor-alias" aria-hidden="true"></div>

### 2.4 公共基准含可重放轨迹的存在

GameCraft-Bench ([arXiv:2606.17861](https://arxiv.org/abs/2606.17861); [代码仓库](https://github.com/FreedomIntelligence/gamecraft-bench)) 提供 140 个 Godot 4 的二维任务，分布在 15 个家族。提交时附带可重放的输入轨迹。论文中最强的代理得分为 41.46%，而代码仓库后续报告为 65.70%。它未涵盖 Unity、Unreal、3D、多玩家或大型物理场景。[Summer Engine](https://www.summerengine.com/templates) 发布了 17 个开源游戏模板（rally、platformer、tower defense、metroidvania、survivors、first-person shooter、LAN multiplayer、voxel 等）。通用视频游戏 AI 框架及其 VGDL ([arXiv:1802.10363](https://arxiv.org/abs/1802.10363)) 提供了 120 个单人游戏和 60 个双人游戏，这些游戏由 sprite、interaction、termination 和 level-mapping 集定义。

<div id="25-convergence-across-industry-and-research" class="anchor-alias" aria-hidden="true"></div>

### 2.5 工业界与研究界的趋同

多项工作正在趋同于相同的形态：声明式场景与管线文件、沙盒化脚本层、现代着色器语言以及事件日志。

- [nAIVE](https://github.com/poro/nAIVE) 使用 Rust 基于 `wgpu` 构建，采用 ECS（hecs）、YAML 场景、材质与渲染管线、带每个实体沙盒化的 Lua 5.4、交叉编译为 WGSL 的 Slang 着色器、Rapier 物理、带 YAML 模式验证的事件总线，以及无头测试运行器。其[网站](https://naive.dev/)展示了一个 92 行 YAML 文件声明的五遍延迟管线。其 README 还描述了 GPU 计算模拟驱动 50,000+ 实体的方案，这一选择将其置于下文所绘边界中容差一侧。
- Capcom 将 REX（“RE neXt Engine”）描述为 RE ENGINE 的分阶段演进，涉及约 200 名工程师（[Capcom IR](https://www.capcom.co.jp/ir/english/data/oar/2025/re-engine.html)）。媒体报道（[PC Gamer](https://www.pcgamer.com/gaming-industry/game-development/capcom-announces-plans-to-transform-its-re-engine-into-an-ai-generation-game-engine/)）指出其中包含六个程序，包括将不同类型数据转换为一组通用规则的 Re:Dox，以及将游戏机制思想转换为标准化编程语言的 RE:Flows；报道还称有超过 2,000 人使用 RE Engine。
- Bevy 的 BSN 提案（[讨论 14437](https://github.com/bevyengine/bevy/discussions/14437)）将场景定义为可组合的 Patch、EntityPatch 和 DynamicScene 值，并提供 `bsn!` 宏与资产格式，同时将事件处理器留待解决。
- [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) 将游戏逻辑作为约简器（reducers）运行，这些约简器以 ACID 事务形式在表上执行，并重放提交日志，该日志实质上是换名的 RCE 日志 $D$。
- 可执行本体论（[doi:10.48550/arXiv.2601.07964](https://doi.org/10.48550/arXiv.2601.07964)）在仅追加、不可变的事件图上使用 BSL 对游戏行为建模。该论文推荐一种混合方法，其中物理、渲染和动画保持传统的高频方法，而任务与决策则在事件图上运行，通过聚合事件进行连接。这正是本文所提出的同一层拆分。

<div id="3-the-physics-of-divergence-why-exactness-is-binary" class="anchor-alias" aria-hidden="true"></div>

## 3. 分歧的物理学：为什么精确性是二元的

浮点加法不满足结合律。在并行硬件上，归约的执行顺序会因运行而异。一项关于并行硬件上浮点非结合性的研究（[arXiv:2408.05148](https://arxiv.org/abs/2408.05148)）定义了标量变异性

$$V_s = 1 - \left| \frac{f_{nd}}{f_d} \right|,$$

其中 $f_d$ 为确定性归约，$f_{nd}$ 为非确定性归约。对 $10^6$ 个服从正态分布的双精度数求和并改变其顺序后，结果最多变化约 $4.26 \times 10^{-13}$，且 $|V_s|$ 的最大值以 $\sqrt{n}$ 的速度增长。在 NVIDIA V100 上，确定性树形归约相对于原子累加的开销约为 0.2%；在 GH200 上则最高达 7.8%。在 1,000 次图网络训练中，每次运行都得到了不同的权重。

游戏会将这些微小差异放大为可见的结果。刚体接触与多体动力学通常具有混沌性。在局部 Lyapunov 指数 $\Lambda$ 下，扰动按如下规律增长

$$\delta(t) = \delta_0 \, e^{\Lambda t},$$

因此扰动增长到游戏中可见尺度 $\Delta$ 所需的时间为

$$t^{*} = \frac{1}{\Lambda} \ln\frac{\Delta}{\delta_0}.$$

*说明性模型：* 取 $\delta_0 \approx 6 \times 10^{-8}$（单精度的一个ULP，相对值），$\Delta = 1$（墙另一侧的一个物体），以及假设的 $\Lambda = 2\ \text{s}^{-1}$。则 $t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ s。对数是关键：将 $\delta_0$ 缩小一百万倍仅能多获得约 6.9 秒。因此近似一致无法挽救仿真。要么状态按位完全相同，要么最终发生偏离，这一预测在下面 25,000 个多 ISA 和 3-OS 碰撞时钟中直接进行了测试（`GE-H2`）。

实践也印证了这一点。[Gaffer On Games](https://gafferongames.com/post/floating_point_determinism/) 指出，跨机器的确定性要求相同的编译器与指令集；Battlezone 2 曾遭遇 AMD 与 Intel 在超越函数上的差异；MotoGP 的回放数据无法在 Xbox 与个人电脑之间共享。该文还引述了 Markstein 的建议，即禁止 FMA 收缩与重结合。[Rapier 指南](https://rapier.rs/docs/user_guides/rust/determinism/) 展示了一条可行路径：只有启用其 `enhanced-determinism` 特性（与 `simd8` 不兼容）、运行于 IEEE 754-2008 目标平台（Wasm 符合要求）并使用软件实现的超越函数时，跨平台确定性才能成立。

为了渲染，[WGSL 规范](https://www.w3.org/TR/WGSL/) 声明：“WGSL 有时允许对给定特性出现多种可能的行为。这是可移植性风险。” 其浮点章节进一步指出：“WGSL 未指定舍入模式”；“实现可以重新关联运算”；它“如果转换后的表达式至少与原始表达式同等精确，则可以融合运算”；许多运算的次正规输入输出“可能被冲零”；以及 `fma` 内建“可能展开为普通乘法…和加法”。因此像素在不同实现之间被规定为可能不同。[SPIR-V 规范](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) 提供了更窄的工具：其 NoContraction 装饰标记了一个算术指令，声明“不能与其他指令合并为单一操作”，并且此类指令“不得重新关联”。这仅是针对某一后端的单指令保护，而不是对整个着色器的可移植保证。

<div id="4-the-ir-table" class="anchor-alias" aria-hidden="true"></div>

## 4. IR 表

| 表示 | 层 | 最强属性（已文档化） | 为形成所缺失的要素 |
|---|---|---|---|
| [Slang](https://shader-slang.org/) | 着色器 | 模块 IR；针对 D3D12、Vulkan、Metal、D3D11、OpenGL、CUDA、WebGPU、CPU 的后端；能力系统 | 缺少游戏状态、事件，对浮点数没有精确语义保证 |
| [Naga](https://github.com/gfx-rs/wgpu/tree/trunk/naga) | 着色器 | 已验证的 IR；支持 WGSL、SPIR-V 和 GLSL 输入；输出 SPIR-V、WGSL、MSL、HLSL 和 GLSL | 同上；缺少对场景模式的链接 |
| [WGSL](https://www.w3.org/TR/WGSL/) / [WESL](https://wesl-lang.dev/) | 着色器 | 一致性分析；WESL 额外提供导入、条件编译、包、`wgsl-test` | 允许重新关联、融合和清零；缺少主机端类型 |
| [SPIR-V](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) | 着色器二进制 IR | NoContraction 装饰禁止在指令层面进行融合和重新关联 | 仅限于指令层面；缺乏游戏语义 |
| [MLIR](https://mlir.llvm.org/) | 编译器基础设施 | 用于下降的多层方言 | 不是游戏模型；语义由各方言自行定义 |
| [glTF 2.0](https://www.khronos.org/gltf/) (ISO/IEC 12113:2022) | 资产与场景 | 跨工具的互换标准 | 缺乏行为描述和执行顺序 |
| [OpenUSD](https://openusd.org/release/intro.html) | 场景 | 组合弧、命名空间路径 | 自称“非绑定系统”；缺乏仿真语义 |
| [BSN](https://github.com/bevyengine/bevy/discussions/14437) | 场景 | 针对组件的类型化补丁、版本化导入 | 事件处理器未解析；仅限 Bevy |
| [SCXML](https://www.w3.org/TR/scxml/) / [XState](https://stately.ai/docs/xstate) | 行为 | 微步和宏步语义、文档顺序优先级、串行并行区域 | 数据模型平台特定；缺乏数值约束、场景或着色器 |
| [GDL](http://ggp.stanford.edu/readings/gdl_spec.pdf) | 规则 | 对有限、离散、确定性游戏的逻辑描述 | 缺乏连续物理和渲染 |
| [VGDL](https://arxiv.org/abs/1802.10363) | 规则 | 紧凑的 2D 网格游戏，大型公共语料库 | 仅限 2D 网格；缺乏渲染或物理保真度 |
| [Core ECS](https://arxiv.org/abs/2508.15264) | 执行顺序 | 提供确定性并发调度条件的定理 | 形式模型，而非引擎格式；缺少场景或着色器 |
| [GameRule](https://doi.org/10.1007/s00530-026-02629-8) | 规则 | 确定性调度器合同，测得的代码节省 | 仅限 Unity；每个 actor 约 65 µs；缺乏形式检查器 |
| [nAIVE](https://github.com/poro/nAIVE) | 完整引擎 | YAML 场景和管线、Lua、Slang、事件模式验证 | 未公布正式语义或跨层类型检查 |
| [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) | 服务器逻辑 | 将 reducer 作为事务、提交日志重放 | 仅限服务器端；缺少客户端渲染或场景 |

<div id="5-proposed-architecture" class="anchor-alias" aria-hidden="true"></div>

## 5. 拟议架构

<div id="51-layer-split" class="anchor-alias" aria-hidden="true"></div>

### 5.1 层划分

1. **仿真形式（精确）。** $S$ 保存定点或严格 IEEE 754 值，禁用 FMA 与重新关联，并在整数或固定软件例程中实现超越函数。$E$ 保存时钟事件和已记录的输入。$\delta$ 使用 SCXML 宏步语义：每个时钟，按队列顺序处理事件，按文档顺序解决冲突，串行运行并行区域。集合按声明顺序迭代，遵循 GameRule 的约定（声明顺序、后写优先、结构变更延后至时钟结束）。在需要并行时，检查器仅接受满足 Core ECS 不相交条件的调度。
2. **脚本投影（精确）。** 设计者脚本编译为针对 $S$ 的守卫和动作，输出为 [Rhai](https://rhai.rs/book/about/features.html)（沙箱化，具 “Don’t Panic” 保证，no-std 与 Wasm 支持）、Lua 或 [Luau](https://luau.org/)（默认沙箱化，支持渐进类型）。脚本只能通过声明的动作调用 $\delta$。它们不能直接读取时钟、随机源或 GPU 结果。
3. **场景投影（下游容差）。** $\lambda$ 将 $S$ 映射为类似 BSN 的补丁树，其组件模式是 Form 的一部分。glTF 与 OpenUSD 用作资产的导出目标。
4. **渲染投影（容差）。** 材质和通道使用 Slang 或 WGSL 编写，并通过 Slang 或 Naga 输出到 `DirectX 12`、`Metal` 与 `Vulkan` 后端。渲染是 $\lambda(s)$ 的纯函数。GPU 结果永不回流至 $S$。

<div id="52-inside-the-form-versus-host-effects" class="anchor-alias" aria-hidden="true"></div>

### 5.2 内部形式 vs 主机效应

内部：状态、转移、规则顺序、针对游戏相关实体的定点物理、随机生成器，其种子在 $S$ 中、接口模式。外部，记录为事件：设备输入、实时时间、网络数据包、音频输出、资源输入与输出、GPU 绘制，以及任何用于视觉效果的第三方物理。重放通过 $\delta$ 将 $D$ 反馈回去，而不直接操作设备。存储成本适中。在 $f_{\text{tick}} = 60$ Hz 的滴答率和每滴答 $b = 16$ 字节的输入下，日志以 $f_{\text{tick}} \cdot b = 960$ B/s 的速度增长，约为每小时 3.5 MB。

<div id="53-determinism-boundary" class="anchor-alias" aria-hidden="true"></div>

### 5.3 决定性边界

- **精确区准则：** 对于目标 A 和 B 的每个 tick $t$，$H(s_t^A) = H(s_t^B)$，其中 $H$ 是对 $S$ 的规范序列化进行的密码学哈希。
- **容差区准则：** 对于相同 $s_t$ 的渲染帧 $I^A$ 与 $I^B$，每通道误差超过 $\varepsilon$ 的像素比例不得超过 $p_{\max}$，并配合受限的结构相似度（`SSIM`）和峰值信噪比（`PSNR`）下限。第 6.3 节在八个硬件 `GPU × API` 端点上执行此校准，覆盖 `DirectX 12`、`Metal` 与 `Vulkan`（`Apple Metal`、`AMD RADV Vulkan`、`NVIDIA` Linux/Windows `Vulkan` 与 Windows `DX12`，以及 `Intel` Linux `ANV Vulkan` 与 Windows `Vulkan` / `DX12`）。
- 回滚网络采用 [GGPO](https://github.com/pond3r/ggpo) 风格，依赖输入预测和投机执行，仅在该边界的精确侧有效。

<div id="54-cross-layer-interface-checking" class="anchor-alias" aria-hidden="true"></div>

### 5.4 跨层接口检查

在任何产物输出之前，检查器会验证四类有类型的边。(a) 脚本到仿真:每个动作都必须指向一个已声明的转移，且参数类型一致;(b) 仿真到场景:$\lambda$ 的输出必须与组件模式相匹配;(c) 场景到渲染:每个材质绑定都必须对应一个类型、组与绑定索引兼容的 Slang 或 WGSL 资源;(d) 事件覆盖:脚本监听的每个事件都必须能由某个转移或宿主来源产生。正因为 Mage 的发现(见第 2.3 节),这些边的检查以行为轨迹而非编译是否通过为判定依据。

<div id="6-falsifier-first-test-plan-and-executed-3-os--3-isa--3-api-results" class="anchor-alias" aria-hidden="true"></div>

## 6. 证伪优先的测试方案与已执行的 3-OS / 3-ISA / 3-API 结果

每项假设均列出其证伪判据。若满足判据，则撤回相应主张。第 6.1 至 6.4 节报告三组已执行的经验证伪测试套件（`GE-H1`：跨 `30` 个目标×宿主单元的 3-OS × 3-ISA `Q32.32` 重放；`GE-H2`：跨 `Windows 11 UCRT`、`macOS libSystem` 与 `Linux glibc` 的 3-OS × 3-ISA 浮点漂移；`GE-H3`：跨 `DirectX 12`、`Metal` 与 `Vulkan` 的 3-OS × 3-API 无头 `wgpu` 渲染容差），并给出一个交互式、焦耳预算受限的 `Q32.32` 原型（`GE-H4` 至 `GE-H9` 仍处于开放状态）。

| ID | 假设 | 测试语料 | 度量 | 终止准则 | 状态 |
|---|---|---|---|---|---|
| GE-H1 | 模拟投影在语言、操作系统和 CPU ISA 间按位完全相同 | 16 体 2D 竞技场 Form（`Q32.32` 定点数，`732` 字节状态），跨越 `arm64` macOS、`aarch64` Linux、AMD/Intel `x86_64` Linux 以及 Tiger Lake `x86_64` Windows 11 | $H(s_t)$，在 Rust、Wasm32、C++20（`Clang`/`GCC`/`MSVC`）、Node.js `BigInt`、Python 3 下运行 $10^5$ 步（`30` 个单元） | 任何检查点上任何 `(host, target)` 单元出现哈希不匹配 | **已执行（`0 / 25,500` 个不匹配，跨越 `3` 个 OS 与 `3` 个 ISA，6.1 节）** |
| GE-H2 | 严格模式与 3-OS / 跨 ISA 浮点边界及库/FMA 漂移 | 16 体 2D 混沌竞技场（跨越 `arm64` macOS、`aarch64` Linux、`x86_64` Linux 以及 `x86_64` Windows 11 的 `25,000` 步） | 严格 `f64`、3-OS `UCRT`/`libSystem`/`glibc` `sin/cos`、`MSVC` 与 `Clang` `FMA`、V8 `Math.sin` 以及 `f32` 下的精确分歧步数 `t_div` | 在固定代数运算下出现意外不匹配，或出现未预测的静默漂移 | **已在 macOS、Linux 和 Windows 11 上执行（6.2 节）** |
| GE-H3 | 跨 GPU 与跨 API 渲染保持在有界容差内（`wgpu` / WGSL） | 4 个规范 `Q32.32` 状态（`t = 0, 250, 1k, 10k`），在 `512×512` `RGBA8Unorm` 下于 `8` 个硬件 `GPU × API` 端点（`DX12`、`Metal`、`Vulkan`）+ `WARP` + `llvmpipe` + `CPU Q16.16` 上渲染 | 帧缓冲 `SHA-256`、不同像素 `%`、$\Delta_{\max}$、MAE、RMSE、`PSNR` 以及 `SSIM` | 任何物理 GPU 对未能满足 `PSNR > 40 dB`、`SSIM > 0.999` 或 $p(\Delta > 8) \le 0.001$ | **已执行（`28/28` 对 = `112/112` 帧通过门限：`PSNR ≥ 64.16 dB`，`SSIM ≥ 0.99983`，6.3 节）** |
| GE-H4 | Form 编码规则缩减代码量与 GameRule 相当 | Haunted Jaunt、Survival Shooter、Tanks 行为 | 行为代码行数 | 缩减率低于 50%（GameRule 达到 81.3%） | 开放 |
| GE-H5 | Form 运行时超过 GameRule 上限 | 合成 Actor 缩放 | 针对 $N$ 的步进时间 | 在 $N = 350$ 以下步进时间超过 20 ms | 开放 |
| GE-H6 | 接口检查能捕获真实缺陷 | Mage 的 26 个模式；注入的绑定与模式错误 | 检测率；机制 F1 | 检测率低于注入错误的 90%，或 F1 不优于无 IR 的 0.12 | 开放 |
| GE-H7 | 对 Summer Engine 模板进行完整的 $\ln(\Delta/\delta_0)$ 斜率扫描 | 物理密集型 Summer Engine 模板重新表达为 Form | 针对注入 $\delta_0$ 的分歧时间 | $t^{*}$ 对 $\ln(1/\delta_0)$ 的斜率与零无法区分 | 开放 |
| GE-H8 | 重放是完备的 | 一小时录制会话 | 仅从 $D$ 即可重现最终哈希 | 任何需要 $D$ 中不存在的状态的重放 | 开放 |
| GE-H9 | 基准一致性 | 通过 Form-to-Godot 发射器处理的 GameCraft-Bench 140 项任务 | 与原生 Godot 提交相比的通过率 | 在行为完全相同的输入上通过率更低 | 开放 |

![跨越确定性边界的双面板实证摘要。左面板展示精确区 GE-H1（在 arm64 macOS、aarch64 Linux、AMD/Intel x86_64 Linux 以及 Intel x86_64 Windows 11 上，30 个单元共 25,500 个 SHA-256 检查点，不匹配数为 0）以及 GE-H2 三操作系统 f64 发散刻度（Windows UCRT 与 Apple libm 相对 GNU glibc sin/cos 的 t_div = 10；Windows UCRT 与 Apple libm 的 t_div = 37；MSVC /fp:precise 与 Clang -ffp-contract=fast 的 t_div = 192；x86_64 VFMADD 与 arm64 FMADD 的 t_div = 406）。右面板展示容差区 GE-H3 在 8 个硬件 GPU×API 端点上的最小 PSNR 柱状图，涵盖 DirectX 12、Metal 和 Vulkan，并将同一 GPU 上 DX12 与 Vulkan 编译器漂移（RTX 2060 为 108.3 dB，Iris Xe 为 79.5 dB）与跨厂商光栅化差异（64.2 至 72.1 dB）区分开来，所有数值均远高于 40 dB 的门限。](/figures/game-engines/cross-gpu-tolerance.svg)

*图 3. `GE-H1`、`GE-H2` 和 `GE-H3` 的实证边界。上游 `Q32.32` 仿真状态 (`S`) 在六台机器、三种操作系统（`macOS`、`Linux`、`Windows 11`）和三种 ISA 上实现了 `0 / 25,500` 次 `SHA-256` 检查点不匹配，而未固定的 `f64` `sin/cos` 和 `FMA` 在 `10` 到 `406` tick 之间跨 OS/编译器/ISA 边界出现偏差。下游的 $\lambda(s_t)$，在完全相同的 Windows 11 GPU 上切换 `DirectX 12` 与 `Vulkan` 会通过着色器降低导致 `1` 个最低有效位翻转（`79.5-108.3 dB` `PSNR`），同时所有 `28 / 28` 硬件 `GPU × API` 对的 `PSNR` 严格保持在 `64.16 dB` 以上，`SSIM` 为 `0.99983`（`measured_j = None`，`board_metered = false`）。*

<div id="61-ge-h1-three-os-and-three-isa-100000-tick-determinism-q3232-integer-physics" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `GE-H1`:三操作系统与三指令集架构的 10 万 tick 确定性（`Q32.32` 整数物理）

*预注册于 `PREREG_wave3_multi_isa_wgpu.json`（`SHA-256: 1721e5bdffaf...`）。遥测严格区分 `SATB` 等级 `L2` 与 `L3` 的 `reported_j`。`L2` 为 Linux 下的 `/sys/class/powercap/intel-rapl:0/energy_uj` 套接字/封装（socket/package）及核心计数器；`L3` 为 macOS 下按进程（per-PID）调用 `proc_pid_rusage(child_pid, RUSAGE_INFO_V6).ri_energy_nj` 所得数据，以及 Windows 11 上基于 Win32 `GetProcessTimes` 与 `QueryProcessCycleTime` 的活动记账（该系统上非特权 ring-3 的 `RAPL` `MSR` 访问被阻止）。此时 `measured_j = None`，`board_metered = false`。交互式探索器与原始 JSON 见 [`/living/game-engines/`](/living/game-engines/)（[`results.json`](/living/game-engines/results.json)）。*

一个 16 体 + 4 拾取物的二维弹性碰撞与冷却有限状态机竞技场形式（`Q32.32` 有符号 64 位定点坐标，取值范围 `[-64, +64]`，`128` 位中间乘积，整数向下取整平方根 `isqrt_u128`，延迟的结构性拾取物重生，`732` 字节小端序规范状态向量）在 **六台机器、三种指令集架构（`arm64`/`AArch64`、`x86_64`、`wasm32`）、三种操作系统（`macOS 27.2.1`、`Ubuntu Linux 6.8 / 7.0`、`Microsoft Windows 11 Pro` 构建版本 `26300`）以及七种语言/编译器投影（`30` 个目标 × 宿主单元）** 上执行了 `100,000` 个时钟周期：

| 主机（`ISA` · `OS`） | 目标投影 | 壁钟 ms / `100k`（均值 ± 标准差） | `ns / tick` | 遥测通道（`reported_j`） | `reported_j` / `100k`（J） | 已验证 `SHA-256` 检查点 |
|---|---|---:|---:|---|---:|:---:|
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `rust_native`（`rustc 1.100 -O`） | `22.333 ± 5.043` | `223.3` | 每PID `ri_energy_nj` 的 `L3` | **`0.1028 ± 0.0247`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `cpp20_clang_o3`（`Apple Clang 21`） | `21.022 ± 1.657` | `210.2` | 每PID `ri_energy_nj` 的 `L3` | **`0.1090 ± 0.0134`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `rust_wasm32_node`（`Node v26.13`） | `84.300 ± 11.334` | `843.0` | 每PID `ri_energy_nj` 的 `L3` | **`0.4480 ± 0.0881`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `javascript_bigint_node`（`ES2024`） | `717.955 ± 36.304` | `7,179.6` | 每PID `ri_energy_nj` 的 `L3` | **`4.4021 ± 0.4048`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `python_3_13`（`CPython 3.13.14`） | `2,945.816 ± 284.033` | `29,458.2` | 每PID `ri_energy_nj` 的 `L3` | **`13.5999 ± 1.9086`** | `100 / 100`（`stride 1,000`） |
| **Apple M3 Ultra**（`arm64` · `macOS 27.2.1`） | `rust_native` / `cpp20_clang_o3` | `32.711` / `33.727` | `327.1` / `337.3` | 每PID `ri_energy_nj` 的 `L3` | **`0.0729` / `0.0755`** | `2 × 1,000 / 1,000`（`stride 100`） |
| **AMD Ryzen AI Max+ 395**（`Zen 5` `x86_64` · `Linux 7.0`） | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `21.793` / `23.061` / `26.677` | `217.9` - `266.8` | `L2` AMD RAPL 包（核心 `0.13`-`0.21 J`） | **`1.958` / `2.349` / `2.932`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **AMD Ryzen AI Max+ 395**（`Zen 5` `x86_64` · `Linux 7.0`） | `rust_wasm32` / `js_bigint` / `python_3_14` | `145.29` / `1,347.80` / `2,546.42` | `1,452.9` - `25,464.2` | `L2` AMD RAPL 包（核心 `1.01`-`12.23 J`） | **`14.44` / `115.81` / `181.87`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **Intel Core i9-13900H**（`Raptor Lake` `x86_64` · `Linux 7.0`） | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `39.718` / `36.868` / `58.792` | `368.7` - `587.9` | `L2` Intel RAPL 包（核心 `1.64`-`2.68 J`） | **`2.062` / `1.888` / `3.026`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **Intel Core i9-13900H**（`Raptor Lake` `x86_64` · `Linux 7.0`） | `rust_wasm32` / `js_bigint` / `python_3_14` | `158.35` / `1,390.46` / `3,375.07` | `1,583.5` - `33,750.7` | `L2` Intel RAPL 包（核心 `5.65`-`124.90 J`） | **`6.89` / `60.79` / `149.48`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **NVIDIA Jetson Thor**（`Armv9-A` `aarch64` · `Linux 6.8`） | `rust_native` / `clang` / `gcc` / `wasm32` / `js` / `py3.12` | `39.28`（`GCC`）- `4,407.89`（`Py`） | `392.8` - `44,078.9` | 仅CPU（`reported_j = null`，GPU未触及） | `null` | `6 × 1,000 / 1,000`（`stride 100`） |
| **Intel Core i7-1165G7**（`Tiger Lake` `x86_64` · `Windows 11 26300`） | `rust_native`（`x86_64-pc-windows-msvc`） / `cpp20_msvc_o2`（`cl.exe 19.44`） | `49.730 ± 1.727` / `343.363 ± 3.827` | `497.3` / `3,433.6` | Win32 `L3` 周期（`138.9M` / `958.9M`；CPU `RAPL` 被阻止） | `null` | `2 × 1,000 / 1,000`（`stride 100`） |
| **Intel Core i7-1165G7**（`Tiger Lake` `x86_64` · `Windows 11 26300`） | `rust_wasm32`（`Node v26.13`） / `js_bigint` / `python_3_10` | `198.01` / `1,776.96` / `8,899.23` | `1,980.1` - `88,992.3` | Win32 `L3` 周期（`553.8M` - `24,722.2M`；CPU `RAPL` 被阻止） | `null` | `3 × 1,000 / 1,000`（`stride 100`） |

- **判定**：**`PASS_ZERO_MISMATCHES`（`0 / 25,500` 已验证 `SHA-256` 检查点遍及 `30` 单元格；`0 / 300,000` 成对 stride-`100` 比较遍及 `25` 完整轨迹单元格，涵盖 `macOS`、`Linux` 与 `Windows 11`）**。每个目标在每台主机上均在 tick `100` 时产生 `2683c3f7cb8b...`，在 tick `1,000` 时产生 `21fa688e4ee8...`，在 tick `50,000` 时产生 `ea01ba793841...`，在 tick `100,000` 时产生 `82e404df6475d64d...`。
- **Windows `MSVC` `<__msvc_int128.hpp>` 与 `LLVM` `i128` 代码生成**：在裸机 Windows 11（`x86_64` `PE`）上，`MSVC`（`cl.exe 19.44.35207 /std:c++20 /O2 /fp:strict`）缺乏内建 `__int128` 标量类型，将 `<__msvc_int128.hpp>` 中的 `std::_Signed128` 与 `std::_Unsigned128` 算术降级为多字库例程（`343.36 ms`、`958.9M` CPU 周期每 `100k` tick，较 `rustc 1.100` LLVM 本地 `x86_64-pc-windows-msvc` 的 `49.73 ms` / `138.9M` 周期慢 `6.90×`，且较 `Node.js` `Wasm32` JIT 的 `198.01 ms` 慢 `1.73×`），但在全部 `1,000` 检查点上仍保持 `100%` 位对位状态一致性。
- **跨 `macOS`、`Linux` 与 `Windows 11` 的遥测范围**：请注意为何 `L2` 与 `L3` 通道绝不可混用：Apple `L3` `ri_energy_nj` 将 CPU 核心能耗严格归属到基准子进程 PID（原生 Rust/C++ 为 `0.073`-`0.109 J`），Linux `/sys/class/powercap/intel-rapl:0`（`L2`）汇总整个插槽的封装功耗（封装 `1.89`-`2.06 J` 对比 `core` `0.13`-`1.83 J`），而 Windows `NT 10.0.26300` 在未加载环-0 内核驱动的情况下阻止非特权用户模式的 Intel `RAPL` `MSR` 读取，同时提供精确的每 PID `L3` 周期计数（`QueryProcessCycleTime`）。

<div id="62-ge-h2-three-os-and-cross-isa-25000-tick-floating-point-drift-ieee-754-f64" class="anchor-alias" aria-hidden="true"></div>

### 6.2 `GE-H2`：三操作系统及跨指令集的 25,000 tick 浮点漂移（`IEEE 754` `f64`）

为检验在禁用 `-ffast-math` 与 `/fp:fast` 的前提下，`IEEE 754` `binary64`（`f64`）模拟能否在 `Windows 11`、`macOS` 和 `Linux`（`x86_64` 与 `arm64`/`aarch64`）之间保持同步，我们将同一个 16 体混沌竞技场推进 `25,000` 个 tick（按 `60 Hz` 计，合 `~6.94` 分钟）。在每一个 tick 上，我们分别对规范化的 `IEEE 754` 比特位（`t_div_ieee_bits`）、量化至 `10^-3` 竞技场单位的位置（`t_div_macro_1e3`）以及离散的游戏玩法状态（`t_div_gameplay`）计算哈希。

| 主机 / 目标 A | 主机 / 目标 B | 扰动机制 | `t_div_ieee_bits` | `t_div_macro_1e3` | `t_div_gameplay` |
|---|---|---|---:|---:|---:|
| `Windows 11 x86_64` (`MSVC /fp:strict`, `Rust`, `V8`, `Py`) | `arm64 macOS` & `x86_64`/`aarch64 Linux` (`Clang`/`GCC`/`Rust`) | 3-OS & 3-ISA `f64` & `f32` 代数运算 + `sqrt`，`FMA` 关闭 (`/fp:strict`, `-ffp-contract=off`，无三角函数) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| `x86_64 Linux glibc 2.43` (`f64_trig`) | `aarch64 Linux glibc 2.39` (`f64_trig`) | 跨 ISA Linux GNU `glibc` `std::sin/cos` (`-ffp-contract=off`，无 `-ffast-math`) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| **`Windows 11 x86_64 UCRT` (`MSVC /fp:strict` & `Rust`)** | **`x86_64 Linux GNU glibc 2.43` (`Clang` & `Rust`, `-ffp-contract=off`)** | **跨 OS 同 ISA (`x86_64`) `std::sin/cos` (`ucrtbase.dll` vs `glibc`，无 fast-math)** | **`10`** (`0.17 s`) | **`7,899`** | **`10,392`** (`173.2 s`) |
| **Apple `arm64` macOS (`f64_trig`, `-ffp-contract=off`)** | **AMD/Intel `x86_64` & Thor `aarch64` Linux (`f64_trig`, `-ffp-contract=off`)** | **跨 OS 标准 `libm` `std::sin/cos` (`Apple libSystem` vs `GNU glibc`，无 `-ffast-math`)** | **`10`** (`0.17 s`) | **`5,900`** | **`9,798`** (`163.3 s`) |
| **`Windows 11 x86_64 UCRT` (`MSVC /fp:strict` & `Rust`)** | **Apple `arm64` macOS (`libSystem`, `-ffp-contract=off`)** | **跨 OS & 跨 ISA `std::sin/cos` (`Windows UCRT` vs `Apple libSystem`，无 fast-math)** | **`37`** (`0.62 s`) | **`5,900`** | **`9,798`** (`163.3 s`) |
| **`Windows 11 MSVC` (`/O2 /arch:AVX2 /fp:precise` 默认)** | **`x86_64 Linux Clang 21` (`-O3 -mavx2 -mfma -ffp-contract=fast` 默认)** | **跨编译器 `x86_64` `FMA` 默认 (`MSVC /fp:precise` 无收缩 vs `Clang` `FMA`，仅代数运算)** | **`192`** (`3.20 s`) | **`5,927`** | **`8,869`** (`147.8 s`) |
| **`x86_64` Linux (`-O3 -mavx2 -mfma -ffp-contract=fast`)** | **Apple `arm64` & Thor `aarch64` (`-O3 -ffp-contract=fast`)** | **跨 ISA `FMA` 降低 (`x86_64 VFMADD/VFNMADD` vs `AArch64 FMADD/FMSUB`，仅代数运算，无 `-ffast-math`)** | **`406`** (`6.77 s`) | **`7,422`** | **`11,205`** (`186.8 s`) |
| **`Windows 11` & `Linux x86_64` `Node.js` (`V8 Math.sin/cos`)** | **`macOS arm64` & `Linux aarch64` `Node.js` (`V8 Math.sin/cos`)** | **跨 ISA Node.js V8 `Math.sin/cos` (`0` 漂移 Win11 vs Linux `x86_64`；与 `arm64`/`aarch64` 发散)** | **`66`** (`1.10 s`) | **`7,617`** | **`10,093`** (`168.2 s`) |
| **`cpp_f64_strict` (`/fp:strict`, `-ffp-contract=off`)** | **`MSVC /fp:fast`, `Rust mul_add`, 或 `Clang -ffast-math`** | **同主机 `FMA` 收缩 (`/fp:strict` vs `/fp:fast` 或显式 `mul_add`)** | **`192`** (`3.20 s`) | **`5,927`-`6,576`** | **`8,869`-`10,093`** |
| **`cpp_f64_strict` / `trig`** | **`cpp_f32_strict` / `trig`** | **精度降级 (`binary64` `f64` vs `binary32` `f32`)** | **`1`** | **`8`-`9`** | **`1,370`-`2,240`** |

四项尖锐的 3-OS 与跨 ISA 发现如下：
1. **IEEE 754-2008 `+`, `-`, `*`, `/`, 与 `sqrt` 在禁用 `FMA`（`/fp:strict` 与 `-ffp-contract=off`）时在 `Windows 11`、`macOS` 与 `Linux` 上的 `x86_64` 与 `arm64`/`aarch64` 上实现位级可移植**（在 `MSVC`、`Clang`、`GCC`、`Rustc`、`V8` 与 `CPython` 上共计 `25,000` tick 中 `0` 次不匹配），因为所有五个操作均被规定向 `0.5` ULP 舍入。
2. **所有三大 OS 数学库（`Windows UCRT`、`macOS libSystem` 与 `Linux GNU glibc`）在严格 `f64`（`no fast-math`）下形成两两分歧的三角形**：即使在同一 `x86_64` ISA 上，`Windows` 的 `ucrtbase.dll`（`10.0.26100.9711`）在 tick `10`（`t_div_gameplay = 10,392`）即与 `Linux glibc 2.43` 分歧，而 `Windows UCRT` 在 tick `37`（`t_div_gameplay = 9,798`）与 `Apple libSystem` 分歧，`Apple libSystem` 在 tick `10`（`t_div_gameplay = 9,798`）又与 `glibc` 分歧。于 `Windows 11` 中，`MSVC /fp:strict`、`Rust x86_64-pc-windows-msvc` 与 `CPython 3.10` 均链接 `ucrtbase.dll` 并在 `> 25,000` tick 上保持一致（`b1fbc91788a59cff`），但在 tick `149` 与 `Windows Node.js V8` 分歧。
3. **默认编译器 `FMA` 策略在相同 `x86_64` ISA 上的 `MSVC` 与 `Clang`（`t = 192`）以及跨 `x86_64` 与 `AArch64`（`t = 406`）之间出现分歧**：`MSVC` 的默认 `/O2 /arch:AVX2 /fp:precise` 不会折叠 `a + b * c`（`> 25,000` tick 与 `/fp:strict` 完全相同），因此在 tick `192`（`t_div_gameplay = 8,869`）与 `Clang 21` 的默认 `-O3 -mavx2 -mfma`（默认开启 `-ffp-contract=fast`）产生分歧。即使两者均启用折叠，LLVM 在 `x86_64`（`VFMADD`/`VFNMADD`）与 `AArch64`（`FMADD`/`FMSUB`）上对取负乘减的降级方式不同，也在 tick `406`（`t_div_gameplay = 11,205`）出现分歧。
4. **JavaScript V8 的 `Math.sin`/`Math.cos` 在 `x86_64` 上的 OS 无关（`Windows 11 Node v26.13` 与 `Linux x86_64 Node v22.22` 在 `> 25,000` tick 上保持一致），但在 ISA 上存在依赖（`x86_64` 与 `arm64`/`aarch64` 在 tick `66` 分歧）**。

<div id="63-ge-h3-three-os-three-api-headless-wgpu-directx-12--metal--vulkan-rendering-tolerance" class="anchor-alias" aria-hidden="true"></div>

### 6.3 `GE-H3`：三系统、三 API 无头 `wgpu`（`DirectX 12` / `Metal` / `Vulkan`）渲染容差

为检验图 1 右侧在三大主流桌面图形 API 上的情况，`ge_h3_wgpu_bench`（`wgpu v22.1.0`，`Backends::DX12 | Backends::VULKAN | Backends::METAL`）通过同一套两遍式 WGSL 着色器，将四个标准 `Q32.32` 仿真快照（`ticks 0, 250, 1,000, 10,000`）渲染到 `512×512` 的 `RGBA8Unorm` 帧缓冲中（每帧 `262,144` 像素，`1,048,576` 字节）。测试覆盖八个硬件 **`GPU × API` 端点**（`Apple M3 Ultra Metal`、`AMD Radeon 8060S Linux RADV Vulkan`、`Intel Iris Xe RPL-P Linux ANV Vulkan`、`NVIDIA RTX 4050 Linux Vulkan`、`NVIDIA RTX 2060 Win11 DirectX 12`、`NVIDIA RTX 2060 Win11 Vulkan`、`Intel Iris Xe TGL Win11 DirectX 12` 和 `Intel Iris Xe TGL Win11 Vulkan`），并纳入 **`Microsoft Basic Render Driver`（`Win11 DirectX 12 WARP`）**、**`Mesa llvmpipe`（`Linux CPU Vulkan`）** 以及零浮点的 **`CPU Q16.16`** 整数参考光栅化器作为对照。

| 适配器 A (`OS` · `API` · 驱动) | 适配器 B (`OS` · `API` · 驱动) | 平均差异像素 (`%`) | 最大 $|\Delta|$ (`0..255`) | 平均 MAE (`u8`) | 平均 RMSE (`u8`) | 最小 `PSNR` (`dB`) | 最小 `SSIM` | `GE-H3` 门限 |
|---|---|---:|---:|---:|---:|---:|---:|:---:|
| **NVIDIA RTX 2060 (`Win11 DirectX 12` · `591.74`)** | **NVIDIA RTX 4050 (`Linux Vulkan` · `595.99.02`)** | **`0.000%`** (`0` px) | **`0`** | `0.00000` | `0.00000` | **`∞` (`4/4` 精确)** | **`1.000000`** | **通过** |
| **NVIDIA RTX 2060 (`Win11 DirectX 12` · `HLSL`/`DXIL`)** | **NVIDIA RTX 2060 (`Win11 Vulkan` · `SPIR-V`)** *(同一 GPU)* | **`0.0002%`** (`0-1` px) | **`1`** | `0.000001` | `0.00049` | **`108.34`** | **`1.000000`** | **通过** |
| **Intel Iris Xe (`Win11 DirectX 12` · `31.0.101.3222`)** | **Intel Iris Xe (`Linux Vulkan` · Mesa `ANV` 26.0.8)** | `0.0003%` | `1` | `0.000001` | `0.00059` | **`105.33`** | **`1.000000`** | **通过** |
| **Intel Iris Xe (`Win11 DirectX 12` · `HLSL`/`DXIL`)** | **Intel Iris Xe (`Win11 Vulkan` · `SPIR-V`)** *(同一 GPU)* | **`0.283%`** (`729-758` px) | **`1`** | `0.00071` | `0.02665` | **`79.52`** | **`0.999996`** | **通过** |
| **Apple M3 Ultra (`macOS Metal` 4)** | **Intel Iris Xe (`Win11 DirectX 12` / `Linux ANV Vulkan`)** | `1.301%` | `2` | `0.00386` | `0.06215` | **`72.06`** | **`0.999986`** | **通过** |
| **Apple M3 Ultra (`macOS Metal` 4)** | **Intel Iris Xe (`Win11 Vulkan` · `31.0.101.3222`)** | `1.573%` | `2` | `0.00455` | `0.06743` | **`71.39`** | **`0.999982`** | **通过** |
| **AMD Radeon 8060S (`Linux Vulkan` · Mesa `RADV`)** | **Apple M3 Ultra (`macOS Metal` 4)** | `3.103%` | `1` | `0.00788` | `0.08876` | **`69.09`** | **`0.999956`** | **通过** |
| **AMD Radeon 8060S (`Linux Vulkan` · Mesa `RADV`)** | **Intel Iris Xe (`Win11 DirectX 12` / `Win11 Vulkan`)** | `3.774%` / `3.565%` | `2` | `0.01022` / `0.00968` | `0.10116` / `0.09844` | **`67.97`** / **`68.20`** | **`0.999951`** | **通过** |
| **AMD Radeon 8060S (`Linux Vulkan` · Mesa `RADV`)** | **NVIDIA RTX 2060 (`Win11 DX12` / `Vulkan`) & RTX 4050** | `6.554%` | `2` | `0.01735` | `0.13180` | **`65.64`** | **`0.999874`** | **通过** |
| **NVIDIA RTX 2060 (`Win11 DirectX 12`)** | **Intel Iris Xe (`Win11 DirectX 12`)** *(同一 Win11 主机)* | `8.279%` | `2` | `0.02149` | `0.14667` | **`64.79`** | **`0.999844`** | **通过** |
| **Apple M3 Ultra (`macOS Metal` 4)** | **NVIDIA RTX 2060 (`Win11 DX12` / `Vulkan`) & RTX 4050** | `9.337%` | `2` | `0.02467` | `0.15721` | **`64.16`** | **`0.999833`** | **通过** |
| **Apple M3 Ultra (`macOS Metal` 4)** | **`Microsoft WARP` (`Win11 DirectX 12` CPU)** | `0.003%` | `1` | `0.000008` | `0.00271` | **`98.79`** | **`1.000000`** | **通过** |
| **`Microsoft WARP` (`Win11 DirectX 12` CPU)** | **`Mesa llvmpipe` (`Linux LLVM 21.1.8` CPU `Vulkan`)** | `1.591%` | `2` | `0.00543` | `0.07359` | **`70.35`** | **`0.999983`** | **通过** |
| 硬件 GPU (`DX12`/`Metal`/`Vulkan` 上的 `8` 个端点) | **`CPU Q16.16` 零浮点整数参考 (`4` 台主机)** | `20.400%` - `27.626%` | `2` | `0.05612` - `0.07864` | `0.23689` - `0.28068` | `59.13` - `60.58` | `0.999556` - `0.999693` | **通过** |

- **隔离着色器编译器（`DX12` `HLSL`/`DXIL` 与 `Vulkan` `SPIR-V`）漂移与 GPU 硅片差异**：在**完全相同的物理 GPU 和完全相同的 Windows 11 机器**上对比 `DirectX 12` 与 `Vulkan`，可将编译器翻译（`Naga` `WGSL -> HLSL` 与 `WGSL -> SPIR-V`）与硬件 SFU/ROP 设计区分开来。在 `NVIDIA GeForce RTX 2060` 上，`Win11 DirectX 12` 与 `Win11 Vulkan` 在第 `0` 和 `250` 拍产生位完全相同的 `SHA-256` 帧缓冲，随后在第 `1,000` 和 `10,000` 拍于单个掠射镜面像素上以 `1` LSB 发生偏离（均值差异 `0.0002%`，`PSNR` 为 `108.34 dB`），而 `RTX 2060 (Win11 DirectX 12)` 与 `RTX 4050 (Linux Vulkan)` 在 `4 / 4` 帧上实现位完全匹配（Turing 与 Ada Lovelace 架构以及 Windows `DX12` 与 Linux `Vulkan` 之间 `0` 个差异像素）！在 `Intel Iris Xe Graphics`（`Tiger Lake`）上，`Win11 DirectX 12` 与 `Win11 Vulkan` 在全部 `4` 帧中存在 `0.283%` 像素差异（`PSNR` 为 `79.52 dB`，$\Delta_{\max} = 1$），而 `Win11 DirectX 12` 与 `Linux Mesa ANV Vulkan` 的差异仅为 `0.0003%`（`PSNR` 为 `105.33 dB`，在第 `0` 和 `1,000` 拍实现位完全相同）。
- **在全部 `28 / 28` 硬件 `GPU × API` 配对（`112 / 112` 帧）中确认有界容差**：`27 / 28` 硬件端点配对的原始 `RGBA8` `SHA-256` 摘要存在差异，然而**任何硬件配对在 `DirectX 12`、`Metal` 和 `Vulkan` 下均无像素差异超过 `2 / 255`**（$p(|\Delta| > 8) = 0.000000 \le 0.001$），`PSNR` 超过 `64.16 dB`（比 `> 40.0 dB` 门限高 `+24.16 dB`），且 `SSIM` 超过 `0.999833`（高于 `0.999` 门限），单帧耗时为 `0.29`-`6.04 ms`。
- **软件光栅化器对比（`WARP` 与 `llvmpipe` 与 `CPU Q16.16`）**：即使是软件 CPU GPU-API 模拟器也会跨 API 产生差异，`Microsoft Basic Render Driver`（`Win11 DirectX 12 WARP`）与 `Mesa llvmpipe`（`Linux Vulkan`）存在 `1.591%` 像素差异（`PSNR` 为 `70.35 dB`，$\Delta_{\max} = 2$），而零浮点 `CPU Q16.16` 整数软件光栅化器在**全部四个 OS/ISA 宿主机上均实现 `0` 个 `SHA-256` 帧缓冲失配**（`macOS arm64`、`Linux AMD x86_64`、`Linux Intel x86_64` 以及 `Windows 11 x86_64`：第 `0` 拍为 `9c693a38...`，第 `10,000` 拍为 `ce3b2cec...`）。

<div id="64-playable-joule-native-q3232-chrono-budget-arena-livinggame-engines" class="anchor-alias" aria-hidden="true"></div>

### 6.4 可运行的焦耳原生 `Q32.32` 时序预算竞技场（`/living/game-engines/`）

将本研究的精确 `Q32.32` 重放契约与[时间作为索引](/papers/time-as-an-index/)（第 9.2 节）的能量原生时序机制相结合，[`/living/game-engines/`](/living/game-engines/) 的仪器 4 提供了一款可在 JavaScript `BigInt` 中运行的、可玩的 `60 Hz` 确定性轨道导航与拾取防御小游戏（仿真内部 0 次浮点运算）：

- **实时 `SHA-256` 状态磁带与确定性重放**：每个时钟周期更新滚动 `SHA-256` 状态摘要，并将紧凑的 1 字节玩家输入事件记录到 $D$ 中；点击 `Replay & Verify SHA-256` 将从 `(seed, D)` 重新执行整场比赛，并验证按位哈希相等性（`replayed_sha256 === live_sha256`）。
- **焦耳预算时序前瞻与回溯（`est_j` 设计模型）**：查询未来轨迹（`Hellman Branch Preview`，在 `K` 个时钟周期前模拟 `3` 个候选转向分支）或回溯至持久因果检查点时，会从显式微焦耳（`µJ`）电池中扣除费用（每个推测时钟周期的 `step_cost_uj` 加上丢弃非选中未来或回溯时间线时的朗道分支擦除成本），支持通过键盘、鼠标/触控以及 `WebXR` / `Gamepad` 控制器（包括 Meta Quest Browser）进行游玩。

<div id="7-infeasibility-flags" class="anchor-alias" aria-hidden="true"></div>

## 7. 不可行性标志

1. **跨 GPU 与跨 API 位精确硬件渲染：不可行（`27 / 28` 硬件 `GPU × API` 配对，包含 `2 / 2` 同 GPU `DirectX 12` 与 `Vulkan` 配对，在 `GE-H3` 中的原始 `SHA-256` 不一致），而有界感知容差（`PSNR >= 64.16 dB`，`SSIM >= 0.99983`，$\Delta_{\max} \le 2$）在 `DirectX 12`、`Metal` 与 `Vulkan` 上保持，只要 GPU 输出从不反馈到 $S$。**
2. **跨平台精确物理且使用默认浮点设置：在 `Windows`、`macOS` 与 `Linux` 上不可行。** 即使*不使用* `-ffast-math` 或 `/fp:fast`，标准 `std::sin`/`std::cos` 在 `Windows UCRT`、`Apple libSystem` 与 `GNU glibc` 之间形成 3 路分歧三角形（`t_div = 10` 到 `37`），默认 `MSVC /fp:precise` 与 `Clang -ffp-contract=fast` 在 `x86_64` 上于 `t_div = 192` 处出现分歧，跨 ISA `FMA`（`x86_64` 与 `arm64`）在 `t_div = 406` 处分歧，进而导致 `8,869`-`11,205` tick 内的游戏不同步（`GE-H2`）。
3. **模拟内部的 GPU 计算：不可作为精确实现；仅在确定性归约下可行**，测得成本约为所引用硬件的 0.2% 到 7.8%，且除非在每条指令上使用 SPIR-V NoContraction 否则仍会受到编译器收缩的影响。
4. **引擎可移植行为：在任何外部来源中未见证明；在 `GE-H1` 的 2D 物理内核层面上已在 `30` 个目标 × 主机单元（`6` 台机器，`3` 种 OS `macOS`/`Linux`/`Windows 11`，`3` 种 ISA，`7` 种运行时/编译器）中展示，而完整引擎投影（`GE-H4`、`GE-H9`）仍未完成。
5. **大规模参与者的解释型规则：受限。** GameRule 测量暗示在 20 ms 内演员数量上限约为 300（`GE-H1` 进一步显示 Python `int` 在 Linux/macOS 上相较于本机 Rust `reported_j` 耗时 `73×`-`132×`，在 Windows 11 上耗时 `179×` 墙时）；在规模化时需要编译成本地或 WebAssembly 的投影。
6. **专有第三方游戏引擎作为精确目标：未验证。** 虽然第 6 节已验证裸金属 Windows 11 `PE`（`rustc` 与 `MSVC`）以及 `DirectX 12`（`wgpu`）的执行，但 Unity 手册（由 GameRule 引用）声明没有顺序保证；Unity 与 Unreal 的模板目录无法读取（页面在客户端渲染），且未读取到任何 Unreal 执行顺序的来源。

<div id="8-sources-and-limits" class="anchor-alias" aria-hidden="true"></div>

## 8. 来源与局限

所有上述来源均已在引用段落处完整阅读，例外情况包括：GameCraft-Bench 论文（仅阅读了摘要和仓库 README）、RCE 关于页面（仅阅读了概要页面）以及 Capcom 新闻报道（仅一篇文章）。伴随研究中引用的用于遥测水平（`SATB`）和焦耳预算化时间游戏机制的同一家研究机构的工作分别为 [Time as an Index](/papers/time-as-an-index/) 和 [Satiation Tiered Benchmark Harness](/papers/satb-harness/)（`[same house]`）。已查阅但未作为证据引用的来源包括 [Ludii portal](https://ludii.games/)，该站点将游戏描述为结构化的 ludeme 集合；Game Grammar 爱好者仓库；以及 [PlayCanvas](https://github.com/playcanvas/engine)、[Babylon.js](https://github.com/BabylonJS/Babylon.js) 和 [three.js](https://github.com/mrdoob/three.js) 的 README，这些文档主要描述渲染库，而非游戏描述格式。

未阅读、付费墙阻挡或其他方式不可获取的文献有：T. Schaul, “A Video Game Description Language for Model-based or Interactive Learning,” IEEE CIG 2013, doi:10.1109/CIG.2013.6633610；J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845。M. Ebner 等, “Towards a Video Game Description Language,” doi:10.4230/DFU.Vol6.12191.85，虽为开放获取但本研究未阅读。

在第6节中，`GE-H1`、`GE-H2` 和 `GE-H3` 在全部六台机器上均保持 `measured_j = None` 与 `board_metered = false`：区分 macOS 的 L3 每进程 `ri_energy_nj`、Linux 的 L2 套接字/核心 RAPL `reported_j`，以及 Windows 11 的 L3 `GetProcessTimes`/`QueryProcessCycleTime` 活动计数器，并使 Chrono-Budget Arena 的 `est_j` 机制严格保持为解析性质。完整的多引擎场景/行为发射器（`GE-H4`-`GE-H9`）仍属于待完成的工作。
