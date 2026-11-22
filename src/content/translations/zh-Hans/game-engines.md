---
title: "一次编写游戏，随处运行：精确重放止于何处、容差始于何处"
deck: "一次编写游戏，作为已校验的状态机并投影到多个引擎、指令集和图形栈中是否可行？该游戏在 25 个多 ISA 目标 × 主机单元上以 Q32.32 整数物理执行 100,000 个时钟周期（GE-H1：在 arm64 macOS、aarch64 Linux 和 AMD/Intel x86_64 Linux 上出现 0 / 20,500 个 SHA-256 不匹配），25,000 个跨 ISA 浮点时钟周期（GE-H2：t_div = 10 的 Apple libm 与 GNU glibc sin/cos，t_div = 406 的 x86_64 FMA 与 arm64 fmadd（未使用 -ffast-math）），以及 4 个物理 GPU（跨越 Metal 和 Vulkan）（GE-H3：1.3%-9.3% LSB 像素漂移，Δ_max ≤ 2，PSNR 64.2-72.1 dB，SSIM ≥ 0.99983），并搭配一个可玩的、焦耳预算的 Q32.32 WebXR/Canvas 原型。"
lang: "zh-Hans"
source: "game-engines"
complete: true
---

<div id="writing-a-game-once-and-running-it-everywhere-where-exact-replay-ends-and-tolerance-begins" class="anchor-alias" aria-hidden="true"></div>

*修订版 af57f48，2026 年 11 月 22 日。交互式浏览器、跨 GPU 检查器，以及可游玩的 `Q32.32` Chrono-Budget Arena：[research.openie.dev/living/game-engines/](/living/game-engines/)。*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 摘要

对所调查的规范以及已执行的三套经验性反例套件的分析给出了明确的界限：**是** 在固定点整数算术下对游戏规则和仿真 (`(GE-H1)`: `0 / 20,500` Secure Hash Algorithm 256-bit (`SHA-256`) 检查点不匹配，跨 `100,000` 计时、在 16 体 2D 竞技场上投射至 `25` 目标×主机单元，运行于 `arm64` `macOS 27.2.1`、`aarch64` `Linux 6.8`、以及 Advanced Micro Devices (`AMD`) Zen 5 和 Intel Raptor Lake `x86_64` `Linux 7.0`，在 macOS 每进程 `reported_j` 能耗范围 `0.073 J` 至 `13.60 J`，在 Linux Running Average Power Limit (`RAPL`) 包 `reported_j` 能耗范围 `1.89 J` 至 `181.87 J`); **否** 当未固定的浮点超越函数或融合乘加 (`FMA`) 降低导致混沌多体碰撞时 (`(GE-H2)`: 即使 *without* `-ffast-math`，Apple `libSystem` `libm` 与 Linux 系统 `glibc` `std::sin`/`std::cos` 在计时 `10` 处出现分歧，跨 ISA `x86_64` `-mavx2 -mfma` 与 `arm64` `fmadd` 在计时 `406` 处出现分歧，且 V8 `Math.sin` 在计时 `66` 处跨 ISA 出现分歧); **否** 对跨 GPU 供应商的位精确像素，但在有界单向容差门下 **是** (`(GE-H3)`: 在 Apple `Metal`、`AMD` Mesa Radeon Vulkan (`RADV`)、Nvidia Vulkan (`NVIDIA`) 和 Intel Mesa Vulkan (`ANV`) 上，分辨率 `512×512` `RGBA8Unorm`，`24 / 24` 跨 GPU 帧对在原始 `SHA-256` 上在 `1.30%`-`9.34%` 像素上存在差异，但保持每通道最大误差 $\Delta_{\max} \le 2 / 255$，峰值信噪比 (`PSNR`) `64.16`-`72.06 dB`，结构相似度 (`SSIM`) `0.99983`-`0.99999`，且 `measured_j = None`、`board_metered = false`).

**简言之**

1. **跨芯片和语言的精确模拟在算术被整数固定时有效。** 在超过 `100,000` 个时钟周期（`20,500` 个已验证的 `SHA-256` 检查点）中，原生 Rust、C++20（`Clang` 和编译器集合（`GCC`））、WebAssembly（`Wasm`）、JavaScript `BigInt` 以及 Python 在 Apple Silicon（`arm64`）、NVIDIA Jetson Thor（`aarch64`）、AMD Zen 5（`x86_64`）和 Intel Raptor Lake（`x86_64`）上以位对位方式重放完全相同的 732 字节状态，零失配。
2. **标准浮点物理即使在未使用 `-ffast-math` 时也会跨操作系统和 CPU 系列发生漂移。** 纯代数 `+`、`-`、`*`、`/` 和 `sqrt` 在禁用 `FMA`（`-ffp-contract=off`）的情况下，在所有 `25,000` 个测试时钟周期内于 `x86_64` 和 `arm64` 上匹配，但跨 macOS `libm` 与 Linux `glibc` 调用 `std::sin`/`std::cos` 会在第 `10` 个时钟周期（`60 Hz` 下 `0.17 s`）翻转一位，并在第 `9,798` 个时钟周期（`163.3 s`）导致游戏分数去同步；而启用默认 `FMA` 收缩（`-ffp-contract=fast`）则会在第 `406` 个时钟周期于 `x86_64` 和 `arm64` 之间产生分歧，并在第 `11,205` 个时钟周期导致游戏去同步。
3. **图形卡不会绘制完全相同的位，因此渲染属于单向容差门下游。** 在 Apple `Metal`、AMD `RADV` Vulkan、NVIDIA Vulkan 和 Intel `ANV` Vulkan 中，`1.3%` 至 `9.3%` 的像素在最低有效位（`LSB`）上相差 `1` 至 `2` 位，这会破坏朴素的帧缓冲 `SHA-256` 检查，但通过感知容差（`PSNR > 64 dB`，`SSIM > 0.9998`），因为没有任何 GPU 值会回流到模拟状态中。

![拟议拆分的示意图。顶部方框包含游戏形式 P 等于 S、E、delta、D、lambda，带有类型化接口模式和严格检查器。箭头指向四个投影：左侧精确区域中的模拟（Rust、WebAssembly、XState、SCXML、Python）和脚本（Rhai、Lua、Luau），由每时钟周期状态哈希判断；右侧容差区域中的场景（BSN 类、glTF、OpenUSD）和渲染（Slang、WGSL、WESL），由每像素误差判断。一条虚线垂直线标记确定性边界。底部带列出仅作为记录事件进入的主机效应：输入、时钟、音频、网络、资产输入和输出、GPU 绘制、装饰物理。](/figures/game-engines/architecture.svg)

*图 1. 拟议拆分。一个形式馈送四个投影。模拟和脚本位于精确区域，由每时钟周期状态哈希判断。场景和渲染位于容差区域，由每像素误差判断。主机效应仅作为记录事件进入。*

![网格，十一行现有表示形式（Slang、Naga、WGSL 和 WESL、glTF、OpenUSD、BSN、SCXML 和 XState、VGDL、GameRule、nAIVE、SpacetimeDB）和七列能力（行为、场景、着色器、执行顺序、多目标、重放日志、跨层检查）。绿色单元格标记已记录能力，琥珀色为部分，灰色为缺失或未记录。跨层列除 Slang 和 nAIVE 的部分标记外均为灰色。](/figures/game-engines/coverage.svg)

*图 2. 现有表示方法的覆盖情况,仅依据本研究所阅读文献进行评分。绿色:有文献记载的能力。琥珀色:部分具备。灰色:缺失或未有文献记载。最右侧一列即跨层检查,几乎全部为空。*

<div id="1-terms-notation-and-the-idea-under-test" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语、符号与待检验的概念

<ul id="terms">
<li>RCE, IR, ECS, FSM, SDF：现实代码引擎[同一家]、中间表示、实体组件系统、有限状态机和有符号距离场</li>
<li>CPU, GPU, ISA, ISAs, SIMD, AVX2, NEON, SFU, ROP, RPL：中央处理器、图形处理器、指令集架构（复数）、单指令多数据、高级向量扩展 2、Arm 高级单指令多数据、特殊函数单元、光栅操作流水线和英特尔 Raptor Lake 移动架构</li>
<li>IEEE, FMA, VFMADD, VFNMADD, FMADD, FMSUB, ULP, LSB, SHA, MAE, RMSE, PSNR, SSIM, SD, RGBA8：电气和电子工程师协会（IEEE 754 浮点数标准）、融合乘加、x86_64 向量融合乘加和取反乘加操作码、AArch64 标量融合乘加和乘减操作码、末位单位、最低有效位、安全散列算法（`SHA-256`）、平均绝对误差、均方根误差、峰值信噪比、结构相似性指数、标准差和每通道 8 位红绿蓝阿尔法帧缓冲格式</li>
<li>WGSL, WESL, SPIR-V, GLSL, HLSL, MSL, D3D11, D3D12, CUDA：WebGPU 着色语言、WebGPU 扩展着色语言、标准可移植中间表示 V、OpenGL 着色语言、高级着色语言、Metal 着色语言、Direct3D 11、Direct3D 12 和统一计算设备架构</li>
<li>RADV, ANV, LLVM, GNU, GCC, PE, OS, API, APIs, WebXR, WebMCP, URL, JSON, YAML, README, MB, CS0246, RE, ENGINE, DFU：Mesa Radeon Vulkan 驱动、Mesa Intel Vulkan 驱动、低级虚拟机编译器基础设施、GNU's Not Unix 项目、GNU 编译器集合、Windows 可移植可执行文件、操作系统、应用程序编程接口（复数）、Web 扩展现实 API、Web 模型上下文协议、统一资源定位符、JavaScript 对象表示法、YAML Ain't Markup Language、仓库 README 文档文件、兆字节、C# 编译器缺失类型诊断 CS0246、Capcom RE ENGINE（“Reach for the Moon” / “RE neXt” 引擎品牌）和 Dagstuhl Follow-Ups DOI 前缀</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG：状态图 XML、游戏描述语言、视频游戏描述语言、Bevy 场景表示法、Boldsea 语义语言、多级中间表示、原子性/一致性/隔离性/持久性事务、Good Game Peace Out 回滚网络库、图形语言传输格式（ISO/IEC 12113:2022）、开放通用场景描述、通用场景描述、局域网、人工智能和计算智能与游戏</li>
<li>SATB、RAPL、MSR、PID、RUSAGE、V6、AMD、NVIDIA、V100、GH200、CTC：饱和分层基准（Satiation Tiered Benchmark）遥测等级（`L2` 套接字/封装计数器，`L3` 每进程内核计数器）[同一机构]、运行平均功率限制、模型特定寄存器、进程标识符、`proc_pid_rusage`（`RUSAGE_INFO_V6`）、超威半导体公司、英伟达公司、Volta V100 图形处理器、Grace Hopper GH200 超级芯片和闭合类时曲线</li>
</ul>

为了使前向引用从上至下保持透明，第1节定义了 Form 符号，第2节审视现有的游戏表示，第3节分析浮点数分歧，第4节列举中间表示，第5节阐述提出的层拆分，第6节报告多 ISA 与跨 GPU 的伪造器运行，第7节列出不可行性标志，第8节记录来源与限制。

[Reality Code Engine (RCE)](https://research.openie.dev/about/rce/) 将程序视为一种称为 Form 的状态机，记作 $P = (S, E, \delta, D, \lambda)$：

- $S$: 状态集合;
- $E$: 事件（输入）集合;
- $\delta : S \times E \to S$: 转移函数;
- $D$: 记录每一步的追加式日志;
- $\lambda$: 从状态到可观察输出的映射。

严格检查器要么接受 Form，要么指出其违背的规则。随后，发射器将接受的 Form 投射为 Rust、Python、JavaScript 和 Scala。XState（一个 JavaScript 与 TypeScript 状态图库）、SCXML（万维网联盟推荐标准）以及 WebAssembly（`Wasm`）不在发射器的目标之列；本研究将其视为候选投射。由于每一步都记录在 $D$ 中，任何运行都可以重放。

游戏引擎是一个更大的机器。它在 GPU 上运行固定步长仿真、脚本层、场景描述以及渲染管线。第1至第8节探讨这些层中哪些可以嵌入 Form，哪些必须作为主机效应保持在外，以及在何处精确性必须让位于容差。

这一思想源远流长。斯坦福大学的 [Game Description Language (GDL) 规范](http://ggp.stanford.edu/readings/gdl_spec.pdf) 涵盖“有限、离散、确定性的多玩家完全信息游戏”，并指出此类游戏的自然底层模型“是有限状态机”。在游戏引擎中新出现的并非状态机本身，而是围绕它的一切：浮点物理、脚本、场景以及 GPU。

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

## 3. 分歧的物理机制：为何精确性是二元的

浮点加法不满足结合律。在并行硬件上，归约的执行顺序会因运行而异。一项关于并行硬件上浮点非结合性的研究（[arXiv:2408.05148](https://arxiv.org/abs/2408.05148)）定义了标量变异性

$$V_s = 1 - \left| \frac{f_{nd}}{f_d} \right|,$$

其中 $f_d$ 为确定性归约，$f_{nd}$ 为非确定性归约。对 $10^6$ 个服从正态分布的双精度数求和并改变其顺序后，结果最多变化约 $4.26 \times 10^{-13}$，且 $|V_s|$ 的最大值以 $\sqrt{n}$ 的速度增长。在 NVIDIA V100 上，确定性树形归约相对于原子累加的开销约为 0.2%；在 GH200 上则最高达 7.8%。在 1,000 次图网络训练中，每次运行都得到了不同的权重。

游戏会将这些微小差异放大为可见的结果。刚体接触与多体动力学通常具有混沌性。在局部 Lyapunov 指数 $\Lambda$ 下，扰动按如下规律增长

$$\delta(t) = \delta_0 \, e^{\Lambda t},$$

因此扰动增长到游戏中可见尺度 $\Delta$ 所需的时间为

$$t^{*} = \frac{1}{\Lambda} \ln\frac{\Delta}{\delta_0}.$$

*示意模型：* 取 $\delta_0 \approx 6 \times 10^{-8}$（单精度相对意义下的一个 ULP）、$\Delta = 1$（物体位于墙的另一侧），并假定 $\Lambda = 2\ \text{s}^{-1}$。于是 $t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ s。关键在于对数：将 $\delta_0$ 缩小一百万倍，仅能再延长约 6.9 s。因此，近似一致无法挽救仿真。状态要么逐位相同，要么最终必然发散。下文将在 25,000 个跨指令集碰撞时间步上直接检验这一预测（`GE-H2`）。

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

### 5.1 层拆分

1. **仿真形式（精确）。** $S$ 持有定点数或严格 IEEE 754 值，禁用 FMA 和重关联，转导函数以整数或固定的软件例程实现。$E$ 持有 tick 事件和已记录的输入。$\delta$ 采用 SCXML 宏步语义：每个 tick 按队列顺序处理事件，按文档顺序解决冲突，串行运行并行区域。集合按声明顺序迭代，遵循 GameRule 的契约（声明顺序，最后写入胜出，结构变更推迟到 tick 结束）。在需要并行性的地方，检查器只接受满足 Core ECS 不相交性条件的调度。
2. **脚本投影（精确）。** 设计者脚本编译为作用于 $S$ 的守卫和动作，以 [Rhai](https://rhai.rs/book/about/features.html)（沙箱化，具有“Don’t Panic”保证，支持 no-std 和 Wasm）、Lua 或 [Luau](https://luau.org/)（默认沙箱化，支持渐进类型）形式发出。脚本只能通过声明的动作调用 $\delta$。它们不能直接读取时钟、随机源或 GPU 结果。
3. **场景投影（下游容差）。** $\lambda$ 将 $S$ 映射为 BSN 风格的补丁树，其组件模式是 Form 的一部分。glTF 和 OpenUSD 作为资产的导出目标。
4. **渲染投影（容差）。** 材质和 pass 使用 Slang 或 WGSL 编写，并通过 Slang 或 Naga 发出到 Metal 和 Vulkan 后端。渲染是 $\lambda(s)$ 的纯函数。GPU 结果永不回流到 $S$。

<div id="52-inside-the-form-versus-host-effects" class="anchor-alias" aria-hidden="true"></div>

### 5.2 内部形式 vs 主机效应

内部：状态、转移、规则顺序、针对游戏相关实体的定点物理、随机生成器，其种子在 $S$ 中、接口模式。外部，记录为事件：设备输入、实时时间、网络数据包、音频输出、资源输入与输出、GPU 绘制，以及任何用于视觉效果的第三方物理。重放通过 $\delta$ 将 $D$ 反馈回去，而不直接操作设备。存储成本适中。在 $f_{\text{tick}} = 60$ Hz 的滴答率和每滴答 $b = 16$ 字节的输入下，日志以 $f_{\text{tick}} \cdot b = 960$ B/s 的速度增长，约为每小时 3.5 MB。

<div id="53-determinism-boundary" class="anchor-alias" aria-hidden="true"></div>

### 5.3 确定性边界

- **精确区判据:** 对于目标 A 与 B 以及每个时刻 $t$,有 $H(s_t^A) = H(s_t^B)$,其中 $H$ 为对 $S$ 的规范化序列化结果计算的密码学哈希。
- **容差区判据:** 对于同一 $s_t$ 渲染得到的帧 $I^A$ 与 $I^B$,单通道误差超过 $\varepsilon$ 的像素比例不得超过 $p_{\max}$,并同时满足结构相似性(`SSIM`)与峰值信噪比(`PSNR`)的下界约束。第 6.3 节在四种 GPU 架构(`Metal`、`RADV` Vulkan、`NVIDIA` Vulkan 与 `ANV` Vulkan)上执行了该校准。
- 基于 [GGPO](https://github.com/pond3r/ggpo) 风格的回滚网络依赖输入预测与推测执行,仅在该边界的精确一侧有效。

<div id="54-cross-layer-interface-checking" class="anchor-alias" aria-hidden="true"></div>

### 5.4 跨层接口检查

在任何产物输出之前，检查器会验证四类有类型的边。(a) 脚本到仿真:每个动作都必须指向一个已声明的转移，且参数类型一致;(b) 仿真到场景:$\lambda$ 的输出必须与组件模式相匹配;(c) 场景到渲染:每个材质绑定都必须对应一个类型、组与绑定索引兼容的 Slang 或 WGSL 资源;(d) 事件覆盖:脚本监听的每个事件都必须能由某个转移或宿主来源产生。正因为 Mage 的发现(见第 2.3 节),这些边的检查以行为轨迹而非编译是否通过为判定依据。

<div id="6-falsifier-first-test-plan-and-executed-multi-isa--cross-gpu-results" class="anchor-alias" aria-hidden="true"></div>

## 6. 伪造者首要测试计划与已执行的多ISA/跨GPU结果

每个假设均列出其淘汰标准。若满足该标准，则该主张被撤回。第6.1至6.4节报告了已执行的三套经验性伪造者套件（`GE-H1` 多ISA `Q32.32` 重放，覆盖 25 个目标×宿主单元；`GE-H2` 跨ISA 浮点漂移，涉及 `x86_64` 与 `arm64`/`aarch64`；`GE-H3` 跨GPU 无头 `wgpu` 渲染容差，跨 Apple `Metal`、AMD、NVIDIA 和 Intel `Vulkan`），以及一个交互式功耗预算的 `Q32.32` 原型（`GE-H4` 至 `GE-H9` 仍未完成）。

| ID | 假设 | 测试语料 | 度量 | 终止准则 | 状态 |
|---|---|---|---|---|---|
| GE-H1 | 模拟投影在语言、操作系统和 CPU ISA 间按位完全相同 | 16 体 2D 竞技场 Form（`Q32.32` 定点数，`732` 字节状态），跨越 `arm64` macOS、`aarch64` Linux 以及 AMD/Intel `x86_64` Linux | Rust、Wasm32、C++20（`Clang`/`GCC`）、Node.js `BigInt`、Python 3 下 $10^5$ 步（`25` 个格子）的 $H(s_t)$ | 任何 `(host, target)` 格子在任意检查点出现哈希不匹配 | **已执行（`0 / 20,500` 不匹配，第 6.1 节）** |
| GE-H2 | 严格模式与跨 ISA 浮点边界及库/FMA 漂移 | 16 体 2D 混沌竞技场（跨越 `arm64` macOS、`aarch64` Linux 以及 AMD/Intel `x86_64` Linux 的 `25,000` 步） | 严格 `f64`、跨 OS `libm` `sin/cos`、跨 ISA `FMA`、V8 `Math.sin` 及 `f32` 下的精确发散步数 `t_div` | 在固定代数运算下出现意外不匹配，或出现未预测的静默漂移 | **已在 `arm64`、`aarch64` 和 `x86_64` 上执行（第 6.2 节）** |
| GE-H3 | 跨 GPU 渲染保持在有界容差内（`wgpu` / WGSL） | 在 4 个物理 GPU（`Metal`、`RADV`、`NVIDIA`、`ANV`）+ `llvmpipe` + `CPU Q16.16` 上以 `512×512` `RGBA8Unorm` 渲染的 4 个规范 `Q32.32` 状态（`t = 0, 250, 1k, 10k`） | 帧缓冲 `SHA-256`、不同像素百分比、$\Delta_{\max}$、MAE、RMSE、`PSNR` 和 `SSIM` | 任意物理 GPU 对未能满足 `PSNR > 40 dB`、`SSIM > 0.999` 或 $p(\Delta > 8) \le 0.001$ | **已执行（`24/24` 通过门限：`PSNR 64.2-72.1 dB`，`SSIM ≥ 0.99983`，第 6.3 节）** |
| GE-H4 | Form 编码规则对代码的精简程度与 GameRule 相当 | Haunted Jaunt、Survival Shooter、Tanks 行为 | 行为代码行数 | 精简率低于 50%（GameRule 达到 81.3%） | 开放 |
| GE-H5 | Form 运行时超过 GameRule 上限 | 合成 Actor 缩放 | 针对 $N$ 的步进时间 | 在 $N = 350$ 以下步进时间超过 20 ms | 开放 |
| GE-H6 | 接口检查能捕获真实缺陷 | Mage 的 26 个模式；注入的绑定与模式错误 | 检测率；机制 F1 | 对注入错误的检测率低于 90%，或 F1 不优于无 IR 的 0.12 | 开放 |
| GE-H7 | 对 Summer Engine 模板进行完整的 $\ln(\Delta/\delta_0)$ 斜率扫描 | 物理密集型 Summer Engine 模板重新表达为 Form | 针对注入 $\delta_0$ 的发散时间 | $t^{*}$ 对 $\ln(1/\delta_0)$ 的斜率与零无显著差异 | 开放 |
| GE-H8 | 重放是完备的 | 一小时录制会话 | 仅从 $D$ 即可重现最终哈希 | 任何需要 $D$ 中不存在的状态的重放 | 开放 |
| GE-H9 | 基准一致性 | 通过 Form-to-Godot 发射器执行的 GameCraft-Bench 140 项任务 | 与原生 Godot 提交相比的通过率 | 在行为完全相同的输入上通过率更低 | 开放 |

![跨确定性边界的双面板经验总结。左面板为精确区 GE-H1（在 arm64 macOS、aarch64 Linux 以及 AMD/Intel x86_64 Linux 上，25 个单元共 20,500 个 SHA-256 检查点，0 次不匹配）与 GE-H2 跨 ISA f64 发散刻度（Apple libm 与 GNU glibc 的 sin/cos 相比 t_div = 10；x86_64 VFMADD 与 arm64 FMADD 在未启用 -ffast-math 时 t_div = 406）。右面板为容差区 GE-H3 在全部 6 个物理 GPU 组合（Apple Metal、AMD RADV Vulkan、Intel ANV Vulkan、NVIDIA Vulkan）上的最小 PSNR 柱状图，范围为 64.2 至 72.1 dB，远高于 40 dB 门限，像素差异为 1.3% 至 9.3%，差值为 1 至 2 个 LSB。](/figures/game-engines/cross-gpu-tolerance.svg)

*图 3. `GE-H1`、`GE-H2` 与 `GE-H3` 的经验边界。上游 `Q32.32` 仿真状态（`S`）在五台机器、三种 ISA 上实现 `0 / 20,500` 次 `SHA-256` 检查点不匹配，而未固定的 `f64` `sin/cos` 与 `FMA` 在跨操作系统/ISA 边界时于 `10` 至 `406` 个刻度内发生发散。在 $\lambda(s_t)$ 的下游，四种 GPU 架构产生各不相同的 `RGBA8Unorm` `SHA-256` 摘要（像素差异 `1.3%`-`9.3%`，差值为 `1-2` LSB），同时严格高于 `64.1 dB` 的 `PSNR` 与 `0.99983` 的 `SSIM`（`measured_j = None`，`board_metered = false`）。*

<div id="61-ge-h1-multi-isa-and-multi-os-100000-tick-determinism-q3232-integer-physics" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `GE-H1`: 多 ISA 与多 OS 的 100,000 tick 确定性（`Q32.32` 整数物理）

*预先注册于 `PREREG_wave3_multi_isa_wgpu.json` (`SHA-256: 1721e5bdffaf...`). 遥测严格区分 `SATB` 等级 `L2` 与 `L3` `reported_j` (`L2`：Linux `/sys/class/powercap/intel-rapl:0/energy_uj` 套接字/包和核心计数器；`L3`：macOS per-PID `proc_pid_rusage(child_pid, RUSAGE_INFO_V6).ri_energy_nj`；`measured_j = None`，`board_metered = false`)。交互式浏览器和原始 JSON：[`/living/game-engines/`](/living/game-engines/)（[`results.json`](/living/game-engines/results.json)）。*

在 **五台机器、三种 ISA（`arm64`/`AArch64`、`x86_64`、`wasm32`）、两种操作系统（`macOS 27.2.1`、`Ubuntu Linux 6.8 / 7.0`）以及六种语言/编译器投影（`25` 目标 × 主机单元）** 上，执行了一个 16 体 + 4 拾取的 2D 弹性碰撞与冷却 FSM 竞技场 Form（`Q32.32` 有符号 64 位定点坐标，范围 `[-64, +64]`，`128` 位中间乘积，整数向下取整平方根 `isqrt_u128`，延迟结构化拾取重生，`732` 字节小端序规范状态向量），共计 `100,000` tick：

| 主机（`ISA` · `OS`） | 目标投影 | 墙钟时间 ms / `100k`（均值 ± 标准差） | `ns / tick` | 遥测通道（`reported_j`） | `reported_j` / `100k`（J） | 经验证的 `SHA-256` 检查点 |
|---|---|---:|---:|---|---:|:---:|
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `rust_native`（`rustc 1.100 -O`） | `22.333 ± 5.043` | `223.3` | `L3` 按 PID `ri_energy_nj` | **`0.1028 ± 0.0247`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `cpp20_clang_o3`（`Apple Clang 21`） | `21.022 ± 1.657` | `210.2` | `L3` 按 PID `ri_energy_nj` | **`0.1090 ± 0.0134`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `rust_wasm32_node`（`Node v26.13`） | `84.300 ± 11.334` | `843.0` | `L3` 按 PID `ri_energy_nj` | **`0.4480 ± 0.0881`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `javascript_bigint_node`（`ES2024`） | `717.955 ± 36.304` | `7,179.6` | `L3` 按 PID `ri_energy_nj` | **`4.4021 ± 0.4048`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `python_3_13`（`CPython 3.13.14`） | `2,945.816 ± 284.033` | `29,458.2` | `L3` 按 PID `ri_energy_nj` | **`13.5999 ± 1.9086`** | `100 / 100`（`stride 1,000`） |
| **Apple M3 Ultra**（`arm64` · `macOS 27.2.1`） | `rust_native` / `cpp20_clang_o3` | `32.711` / `33.727` | `327.1` / `337.3` | `L3` 按 PID `ri_energy_nj` | **`0.0729` / `0.0755`** | `2 × 1,000 / 1,000`（`stride 100`） |
| **AMD Ryzen AI Max+ 395**（`Zen 5` `x86_64` · `Linux 7.0`） | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `21.793` / `23.061` / `26.677` | `217.9` - `266.8` | `L2` AMD RAPL pkg（核心 `0.13`-`0.21 J`） | **`1.958` / `2.349` / `2.932`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **AMD Ryzen AI Max+ 395**（`Zen 5` `x86_64` · `Linux 7.0`） | `rust_wasm32` / `js_bigint` / `python_3_14` | `145.29` / `1,347.80` / `2,546.42` | `1,452.9` - `25,464.2` | `L2` AMD RAPL pkg（核心 `1.01`-`12.23 J`） | **`14.44` / `115.81` / `181.87`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **Intel Core i9-13900H**（`Raptor Lake` `x86_64` · `Linux 7.0`） | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `39.718` / `36.868` / `58.792` | `368.7` - `587.9` | `L2` Intel RAPL pkg（核心 `1.64`-`2.68 J`） | **`2.062` / `1.888` / `3.026`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **Intel Core i9-13900H**（`Raptor Lake` `x86_64` · `Linux 7.0`） | `rust_wasm32` / `js_bigint` / `python_3_14` | `158.35` / `1,390.46` / `3,375.07` | `1,583.5` - `33,750.7` | `L2` Intel RAPL pkg（核心 `5.65`-`124.90 J`） | **`6.89` / `60.79` / `149.48`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **NVIDIA Jetson Thor**（`Armv9-A` `aarch64` · `Linux 6.8`） | `rust_native` / `clang` / `gcc` / `wasm32` / `js` / `py3.12` | `39.28`（`GCC`） - `4,407.89`（`Py`） | `392.8` - `44,078.9` | 仅 CPU（`reported_j = null`，GPU 未触碰） | `null` | `6 × 1,000 / 1,000`（`stride 100`） |

- **结论**: **`PASS_ZERO_MISMATCHES`(`0 / 20,500` 个已验证的 `SHA-256` 检查点;20 个完整轨迹第三波单元的 `0 / 190,000` 次成对步长为 `100` 的比较)**。每个目标在每台主机上都在第 `100` 个 tick 产生 `2683c3f7cb8b...`,在第 `1,000` 个 tick 产生 `21fa688e4ee8...`,在第 `50,000` 个 tick 产生 `ea01ba793841...`,在第 `100,000` 个 tick 产生 `82e404df6475d64d...`。
- **遥测范围与操作系统覆盖**: 必须注意 `L2` 与 `L3` 的 `reported_j` 绝不可混为一谈。Apple 的 `L3` `ri_energy_nj` 严格将 CPU 核心能耗归因于被测子进程 PID(原生 Rust/C++ 为 `0.073`-`0.109 J`),而 Linux 的 `/sys/class/powercap/intel-rapl:0`(`L2`)则对整个插槽范围内所有后台守护进程的封装功率进行积分(封装功率为 `1.89`-`2.06 J`,`core` 子域为 `0.13`-`1.83 J`)。在共享 Linux 运行器上,已检查 `x86_64-w64-mingw32-g++` / `wine64` 的交叉编译环境,二者均不存在;并且运行期间裸机 Windows `x86_64` 主机处于关机状态。因此,Windows PE 的执行在裸机上仍未得到验证。不过,与操作系统无关的 `wasm32-unknown-unknown` 在 macOS 与 Linux 上、于 arm64 与 x86_64 两种架构下结果完全一致。

<div id="62-ge-h2-cross-isa-and-cross-os-25000-tick-floating-point-drift-ieee-754-f64" class="anchor-alias" aria-hidden="true"></div>

### 6.2 `GE-H2`：跨 ISA 与跨 OS 的 25,000 tick 浮点漂移（`IEEE 754` `f64`）

为了测试在禁用 `-ffast-math` 的情况下，`IEEE 754` `binary64`（`f64`）仿真在 `x86_64` 与 `arm64`/`aarch64` 上是否能够保持同步，对相同的 16 体混沌竞技场执行了 `25,000` tick（在 `60 Hz` 下约 `6.94` 分钟）的步进，在每个 tick 上对标准化的 `IEEE 754` 位（`t_div_ieee_bits`）、量化至 `10^-3` 竞技场单位位置（`t_div_macro_1e3`）以及离散的游戏状态（`t_div_gameplay`）进行哈希：

| 主机 / 目标 A | 主机 / 目标 B | 扰动机制 | `t_div_ieee_bits` | `t_div_macro_1e3` | `t_div_gameplay` |
|---|---|---|---:|---:|---:|
| `arm64` macOS `Clang 21` (`f64_strict`) | AMD Zen 5 & Intel RPL `x86_64` Linux `Clang 21` / `GCC 15.2` | 跨 ISA 与跨 OS `f64` 代数 + `sqrt`，`FMA` 关闭（`-ffp-contract=off`，无三角函数） | `无（>25,000）` | `无（>25,000）` | `无（>25,000）` |
| `x86_64` Linux `glibc 2.43` (`f64_trig`) | `aarch64` Linux `glibc 2.39` (`f64_trig`) | 跨 ISA Linux GNU `glibc` `std::sin/cos`（`-ffp-contract=off`，无 `-ffast-math`） | `无（>25,000）` | `无（>25,000）` | `无（>25,000）` |
| **Apple `arm64` macOS (`f64_trig`, `-ffp-contract=off`)** | **AMD/Intel `x86_64` & Thor `aarch64` Linux (`f64_trig`, `-ffp-contract=off`)** | **跨 OS 标准 `libm` `std::sin/cos`（`Apple libSystem` 对比 `GNU glibc`，无 `-ffast-math`）** | **`10` (`0.17 s`)** | **`5,900`** | **`9,798` (`163.3 s`)** |
| **`x86_64` Linux (`-O3 -mavx2 -mfma -ffp-contract=fast`)** | **Apple `arm64` & Thor `aarch64` (`-O3 -ffp-contract=fast`)** | **跨 ISA `FMA` 降级（`x86_64 VFMADD/VFNMADD` 对比 `AArch64 FMADD/FMSUB`，仅代数，未使用 `-ffast-math`）** | **`406` (`6.77 s`)** | **`7,422`** | **`11,205` (`186.8 s`)** |
| **`x86_64` Linux `Node v22.22` (`f64_trig`)** | **`aarch64` Linux `Node v24.22` (`f64_trig`)** | **跨 ISA Node.js V8 `Math.sin/cos`（`x86_64` 对比 `aarch64`）** | **`66` (`1.10 s`)** | **`7,617`** | **`10,093` (`168.2 s`)** |
| **`cpp_f64_strict` (`-ffp-contract=off`)** | **`cpp_f64_fma` / `-ffast-math`** | **同主机 `FMA` 合并（`-ffp-contract=off` 对比 `-ffp-contract=fast`）** | **`192` (`3.20 s`)** | **`5,927`-`6,576`** | **`8,869`-`10,093`** |
| **`cpp_f64_strict` / `trig`** | **`cpp_f32_strict` / `trig`** | **精度降级（`binary64` `f64` 对比 `binary32` `f32`）** | **`1`** | **`8`-`9`** | **`1,370`-`2,240`** |

三次跨 ISA 的显著发现如下：

1. **IEEE 754-2008 `+`、`-`、`*`、`/` 以及 `sqrt` 在禁用 `FMA`（`-ffp-contract=off`）时可在 `x86_64` 与 `arm64`/`aarch64` 之间实现按位可移植**（在 `Clang`、`GCC`、`Rustc` 和 `V8` 上对 `25,000` 个时钟周期的测试中 `0` 次失配），因为这五种运算均被强制要求舍入到 `0.5` ULP。
2. **标准 C++ `std::sin`/`std::cos` 即使在 `-ffp-contract=off -fno-fast-math` 下也会在第 `10` 个时钟周期（`0.17 s`）打破跨操作系统确定性**：Apple 的 `libSystem` `libm` 与 GNU `glibc` 在第 `10` 个时钟周期对转向冲量的舍入相差 `1` ULP，这种差异被混沌的 16 体碰撞放大为第 `5,900` 个时钟周期时超过 `10^-3` 的位置误差，并在第 `9,798` 个时钟周期（`163.3 s`）导致离散得分/拾取物不同步。
3. **编译器默认的 `FMA` 融合（`-ffp-contract=fast`，不使用 `-ffast-math` 或任何三角函数）在第 `406` 个时钟周期（`6.77 s`）打破跨 ISA 确定性**：虽然 AMD Zen 5 和 Intel Raptor Lake 在 `x86_64` 上按位完全一致（`844172b5...`），Apple M3 Ultra 和 Jetson Thor 在 `AArch64` 上也按位完全一致（`deeb446c...`），但 LLVM 对取反乘减表达式的 lowering 在 `x86_64`（`AVX2` `VFMADD`/`VFNMADD`）与 `AArch64`（`NEON` `FMADD`/`FMSUB`）之间存在差异，导致游戏在第 `11,205` 个时钟周期出现不同步。

<div id="63-ge-h3-cross-gpu-headless-wgpu-metal--vulkan-rendering-tolerance" class="anchor-alias" aria-hidden="true"></div>

### 6.3 `GE-H3`：跨 GPU 无头 `wgpu`（`Metal` / `Vulkan`）渲染容差

为了对图 1 右侧的情形进行实证检验，我们使用一个自包含的 Rust 无头 `wgpu`（`v22.1.0`）基准程序（`ge_h3_wgpu_bench`），将四个典型的 `Q32.32` 仿真快照（`ticks 0, 250, 1,000, 10,000`）渲染到 `512×512` 的 `RGBA8Unorm` 帧缓冲区中（每帧 `262,144` 像素，`1,048,576` 字节）。渲染采用两遍 WGSL 流水线：先绘制基于三角函数的程序化雷达/网格背景，再以声明顺序依次叠加 `20` 个采用 `SrcAlpha / OneMinusSrcAlpha` 混合的 SDF 图元与 Blinn-Phong 光照的三维球体/环面实体。同时，我们还运行了一个零浮点的 `CPU Q16.16` 整数软件参考光栅化器作为对照。

| 适配器 A（`API` · 驱动） | 适配器 B（`API` · 驱动） | 平均差异像素（`%`） | 最大 $|\Delta|$（`0..255`） | 平均 MAE（`u8`） | 平均 RMSE（`u8`） | 最小 `PSNR`（`dB`） | 最小 `SSIM` | `GE-H3` 判定 |
|---|---|---:|---:|---:|---:|---:|---:|:---:|
| **Apple M3 Ultra（`Metal` 4）** | **Intel Iris Xe（`Vulkan` · Mesa `ANV` 26.0.8）** | `1.301%` | `2` | `0.00386` | `0.06215` | **`72.06`** | **`0.999986`** | **通过** |
| **AMD Radeon 8060S（`Vulkan` · Mesa `RADV` 26.0.8）** | **Apple M3 Ultra（`Metal` 4）** | `3.103%` | `1` | `0.00788` | `0.08876` | **`69.09`** | **`0.999956`** | **通过** |
| **AMD Radeon 8060S（`Vulkan` · Mesa `RADV` 26.0.8）** | **Intel Iris Xe（`Vulkan` · Mesa `ANV` 26.0.8）** | `3.774%` | `2` | `0.01022` | `0.10116` | **`67.97`** | **`0.999951`** | **通过** |
| **AMD Radeon 8060S（`Vulkan` · Mesa `RADV` 26.0.8）** | **NVIDIA GeForce RTX 4050（`Vulkan` · `595.99.02`）** | `6.553%` | `2` | `0.01735` | `0.13179` | **`65.64`** | **`0.999874`** | **通过** |
| **Intel Iris Xe（`Vulkan` · Mesa `ANV` 26.0.8）** | **NVIDIA GeForce RTX 4050（`Vulkan` · `595.99.02`）** | `8.280%` | `2` | `0.02149` | `0.14667` | **`64.79`** | **`0.999844`** | **通过** |
| **Apple M3 Ultra（`Metal` 4）** | **NVIDIA GeForce RTX 4050（`Vulkan` · `595.99.02`）** | `9.337%` | `2` | `0.02467` | `0.15720` | **`64.16`** | **`0.999833`** | **通过** |
| 物理 GPU（`4` 家厂商） | `Mesa llvmpipe`（`LLVM 21.1.8` CPU `Vulkan`） | `1.541%` - `9.633%` | `2` - `3` | `0.00477` - `0.02601` | `0.06895` - `0.16173` | `63.86` - `70.87` | `0.999828` - `0.999984` | **通过** |
| 物理 GPU（`4` 家厂商） | `CPU Q16.16` 零浮点整数参考实现 | `20.400%` - `27.626%` | `2` | `0.05612` - `0.07864` | `0.23689` - `0.28068` | `59.13` - `60.58` | `0.999556` - `0.999693` | **通过** |

- **比特精确性被证伪，已确认有界容差（`24 / 24` 物理 GPU 帧对）**: 每个物理 GPU 对产生了不同的原始 `RGBA8` `SHA-256` 摘要（`0 / 24` 位匹配），原因是硬件 SFU `sin`/`cos`/`pow` 近似以及 `unorm8` ROP 混合取整，然而 **任何物理 GPU 对上没有像素的差异超过 `2 / 255`** ($p(|\Delta| > 8) = 0.000000 \le 0.001$)，`PSNR` 超过 `64.16 dB`（`> 40.0 dB` 门限），`SSIM` 超过 `0.999833`（`> 0.999` 门限）且每帧耗时 `0.31`-`2.80 ms`。

- **软件光栅化器对比**: 零浮点 `CPU Q16.16` 整数软件光栅化器在 `Apple M3 Ultra`（`arm64`）、`AMD Zen 5`（`x86_64`）和 `Intel Raptor Lake`（`x86_64`）上实现了 `0` `SHA-256` 帧缓冲不匹配（`9c693a38...` 在 tick `0`，`ce3b2cec...` 在 tick `10,000`），而 `Mesa llvmpipe`（`LLVM 21.1.8`）在 AMD 与 Intel `x86_64` 主机之间实现了位匹配（`ccb291f6...` 在 tick `0`），说明像素差异特定来源于 GPU 着色器/ROP 硬件的可变性，而非场景投影 $\lambda(s_t)$。

<div id="64-playable-joule-native-q3232-chrono-budget-arena-livinggame-engines" class="anchor-alias" aria-hidden="true"></div>

### 6.4 可运行的焦耳原生 `Q32.32` 时序预算竞技场（`/living/game-engines/`）

将本研究的精确 `Q32.32` 重放契约与[时间作为索引](/papers/time-as-an-index/)（第 9.2 节）的能量原生时序机制相结合，[`/living/game-engines/`](/living/game-engines/) 的仪器 4 提供了一款可在 JavaScript `BigInt` 中运行的、可玩的 `60 Hz` 确定性轨道导航与拾取防御小游戏（仿真内部 0 次浮点运算）：

- **实时 `SHA-256` 状态磁带与确定性重放**：每个时钟周期更新滚动 `SHA-256` 状态摘要，并将紧凑的 1 字节玩家输入事件记录到 $D$ 中；点击 `Replay & Verify SHA-256` 将从 `(seed, D)` 重新执行整场比赛，并验证按位哈希相等性（`replayed_sha256 === live_sha256`）。
- **焦耳预算时序前瞻与回溯（`est_j` 设计模型）**：查询未来轨迹（`Hellman Branch Preview`，在 `K` 个时钟周期前模拟 `3` 个候选转向分支）或回溯至持久因果检查点时，会从显式微焦耳（`µJ`）电池中扣除费用（每个推测时钟周期的 `step_cost_uj` 加上丢弃非选中未来或回溯时间线时的朗道分支擦除成本），支持通过键盘、鼠标/触控以及 `WebXR` / `Gamepad` 控制器（包括 Meta Quest Browser）进行游玩。

<div id="7-infeasibility-flags" class="anchor-alias" aria-hidden="true"></div>

## 7. 不可行性标记

1. **跨 GPU 的逐位相同硬件渲染:不可行(在 `GE-H3` 中,跨 `Metal`、`RADV`、`NVIDIA` 与 `ANV` 的 `SHA-256` 匹配数为 `0 / 24`),而当 GPU 输出从不回馈到 $S$ 时,有界感知容差(`PSNR > 64 dB`、`SSIM > 0.9998`、$\Delta_{\max} \le 2$)成立。**
2. **在默认浮点设置下实现跨平台精确物理:不可行。** 即使*不*使用 `-ffast-math`,跨操作系统的 `std::sin`/`std::cos`(`Apple libm` 与 `GNU glibc`)仍在第 `10` 个 tick 出现分歧,跨指令集的 `FMA` 降级(`x86_64` 与 `arm64` 上的 `-ffp-contract=fast`)则在第 `406` 个 tick 出现分歧,并在 `9,798`-`11,205` 个 tick 内级联为玩法层面的失步(`GE-H2`)。
3. **模拟内部的 GPU 计算:作为精确计算不可行;仅在采用确定性归约时可行**,在所引用硬件上的测得开销约为 0.2% 至 7.8%。此外,除非在每条指令上于所有目标平台启用防护(SPIR-V NoContraction),否则仍受编译器收缩(contraction)影响。
4. **引擎可移植行为:在所读取的任何外部来源中均未得到证明;在 `GE-H1` 中,于 2D 物理内核层面在 `25` 个目标 × 宿主单元(`5` 台机器、`3` 种指令集、`6` 种运行时/编译器)上得到验证,而完整的引擎投影(`GE-H4`、`GE-H9`)仍属未决。**
5. **大规模角色数量下的解释型规则:受限。** GameRule 的测量表明,在 20 ms 下的上限约为 300 个角色(`GE-H1` 进一步显示,在 Intel、AMD 与 Apple Silicon 上,Python `int` 的开销是原生 Rust `reported_j` 的 `73×`-`132×`);规模化运行需要编译型原生或 WebAssembly 投影。
6. **将专有引擎与裸机 Windows 目标作为精确目标:未经验证。** GameRule 所引用的 Unity 手册声明不提供执行顺序保证;Unity 与 Unreal 的模板目录无法读取(其页面为客户端渲染);未读取到任何 Unreal 执行顺序的来源;并且在 Wave 3 的 Linux/macOS 运行器池中,裸机 Windows `PE` 执行未被激活。

<div id="8-sources-and-limits" class="anchor-alias" aria-hidden="true"></div>

## 8. 来源与局限

所有上述来源均已在引用段落处完整阅读，例外情况包括：GameCraft-Bench 论文（仅阅读了摘要和仓库 README）、RCE 关于页面（仅阅读了概要页面）以及 Capcom 新闻报道（仅一篇文章）。伴随研究中引用的用于遥测水平（`SATB`）和焦耳预算化时间游戏机制的同一家研究机构的工作分别为 [Time as an Index](/papers/time-as-an-index/) 和 [Satiation Tiered Benchmark Harness](/papers/satb-harness/)（`[same house]`）。已查阅但未作为证据引用的来源包括 [Ludii portal](https://ludii.games/)，该站点将游戏描述为结构化的 ludeme 集合；Game Grammar 爱好者仓库；以及 [PlayCanvas](https://github.com/playcanvas/engine)、[Babylon.js](https://github.com/BabylonJS/Babylon.js) 和 [three.js](https://github.com/mrdoob/three.js) 的 README，这些文档主要描述渲染库，而非游戏描述格式。

未阅读、付费墙阻挡或其他方式不可获取的文献有：T. Schaul, “A Video Game Description Language for Model-based or Interactive Learning,” IEEE CIG 2013, doi:10.1109/CIG.2013.6633610；J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845。M. Ebner 等, “Towards a Video Game Description Language,” doi:10.4230/DFU.Vol6.12191.85，虽为开放获取但本研究未阅读。

在第 6 节中，`GE-H1`、`GE-H2` 与 `GE-H3` 在所有运行中保持 `measured_j = None` 且 `board_metered = false`（将 macOS `L3` 每进程 `ri_energy_nj` 与 Linux `L2` 插槽/核心 `RAPL` `reported_j` 分离，并使 Chrono-Budget Arena 的 `est_j` 机制严格保持分析性）。裸机 Windows `PE` 执行、Direct3D 12 `wgpu` 渲染以及多引擎发射器（`GE-H4`-`GE-H9`）仍属未完成工作。
