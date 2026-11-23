---
title: "一次编写游戏，随处运行：精确重放止于何处、容差始于何处"
deck: "可以将游戏一次性编写为受检查的状态机，并投射到多个引擎、指令集、操作系统和图形堆栈吗？在所有九个预注册的伪造者套件中执行：30 个多架构目标 × 主机单元，运行 100,000 个 tick，使用 Q32.32 整数物理（GE-H1：0 / 25,500 条状态摘要不匹配，跨 arm64 macOS、aarch64 Linux、Zen 5 和 Raptor Lake x86_64 Linux，以及 Tiger Lake x86_64 Windows 11），25,000 个跨平台浮点 tick（GE-H2：t_div = 10 Windows Universal C Runtime 与 Apple libm 对比 Linux glibc sin/cos，t_div = 192-406 融合乘加降级且未使用 -ffast-math），8 条硬件图形端点，覆盖 Metal、Vulkan 和 DirectX 12（GE-H3：0.00%-9.34% 像素漂移，Δ_max ≤ 2，峰值信噪比 ≥ 64.2 dB，结构相似度 ≥ 0.99983，涉及全部 28 对组合），17 种多引擎游戏行为（GE-H4：−76.2% 源代码行相对于 Unity C#，0 / 680 条追踪不匹配），10,000 个 actor 的扩展（GE-H5：0.058-0.125 ms/tick 编译后 vs N_20ms = 390 解释型 Python），260 个接口故障模块（GE-H6：98.46% 召回率，F1 = 0.9922 对比 0.1159 仅解析），840 条混沌 Lyapunov 轨迹（GE-H7：R²_mean = 0.994-1.000），三个 1 小时、216,000 tick 的三系统回放，仅使用紧凑输入日志（GE-H8：0 / 6,480 条不匹配），以及 36 个无头 Godot 4.7.2 任务（GE-H9：36 / 36 完全追踪相同）。"
lang: "zh-Hans"
source: "game-engines"
complete: true
---

<div id="writing-a-game-once-and-running-it-everywhere-where-exact-replay-ends-and-tolerance-begins" class="anchor-alias" aria-hidden="true"></div>

*修订 5c50a85，2026年11月23日。交互式探索器，3-OS / 3-API 跨 GPU 检查器，`GE-H4`-`GE-H9` 实证闭合观测站，以及可玩 `Q32.32` 时间预算竞技场： [research.openie.dev/living/game-engines/](/living/game-engines/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 摘要

本研究探讨一款游戏能否先编写为经过检验的状态机，再投影到不同语言、各类操作系统（OS）、各种中央处理器（CPU）指令集架构（ISA）以及各类图形处理器（GPU）应用程序接口（API）上。所考察的规范与全部九个已执行的实证证伪套件（`GE-H1` 至 `GE-H9`）共同确立了一个清晰且封闭的边界。对于游戏规则、多引擎行为输出、高角色数模拟，以及在固定点整数运算下的跨操作系统一小时级重放，结论为**是**。其中，`(GE-H1)` 显示：在 `100,000` 个刻度的 16 体二维竞技场模拟中，投影到 `30` 个目标×主机组合上（覆盖 `arm64` `macOS 27.2.1`、`aarch64` `Linux 6.8`、超威半导体（Advanced Micro Devices，`AMD`）Zen 5 与英特尔 Raptor Lake `x86_64` `Linux 7.0`，以及裸机英特尔 Tiger Lake `x86_64` `Windows 11` 26300 版本，包括 Microsoft Visual C++（`MSVC`）编译器 `cl.exe`），共 `0 / 25,500` 个 256 位安全哈希算法（Secure Hash Algorithm 256-bit，`SHA-256`）检查点不匹配；其能耗在 macOS 每进程 `reported_j` 中为 `0.073 J` 至 `13.60 J`，在 Linux 运行平均功率限制（Running Average Power Limit，`RAPL`）封装 `reported_j` 中为 `1.89 J` 至 `181.87 J`。`(GE-H4)` 显示：在 *Haunted Jaunt*、*Survival Shooter* 与 *Tanks* 中，于 Reality Code Engine（`RCE`）Forms 中编写 `17` 个行为，相较于惯用的 Unity `MonoBehaviour` C# 代码，非注释源代码行数（`SLOC`）减少 `76.22%`（`326` 对 `1,371` 行 `SLOC`；胶水代码行减少 `92.51%`）；相较于 Bevy 风格的 Rust 实体组件系统（`ECS`）代码（`846` 行 `SLOC`）减少 `61.47%`；相较于 Godot 4 `Node` GDScript（`679` 行 `SLOC`）减少 `51.99%`，且轨迹不匹配数为 `0 / 680`。`(GE-H5)` 显示：在 `500` 个刻度内，对 $N \in [64, 10{,}000]$ 个角色进行测试时，参考实现 `rce emit python` 在接近 GameRule 的 `308` 个角色上限时，于 $N_{20\text{ms}} = 390$ 处越过 `20 ms` 预算；`rce emit js` 则在 $N_{20\text{ms}} = 3{,}906$ 处达到该预算。编译后的 WebAssembly（`Wasm`）、C++20 `-O3` 与原生 Rust `-O3` 投影在 $N = 10{,}000$ 时，每刻度耗时 `0.058`-`0.125 ms`，Linux `RAPL` 封装 `reported_j` 为每刻度 `1.69`-`3.67 mJ`，`SHA-256` 不匹配数为 `0 / 50`。`(GE-H6)` 显示：在覆盖 `26` 种接口缺陷模式的 `260` 个模块中，结合静态 Form 与四边清单检查的方法捕获了 `128 / 130` 个注入故障（召回率 `98.46%`，误报 `0`，故障 `F1 = 0.9922`）；相比之下，没有中间表示（`IR`）的纯解析动态检查仅捕获 `8 / 130`（`6.15%`，`F1 = 0.1159`）。`(GE-H8)` 显示：三段 1 小时（`60 Hz` 下 `216,000` 个刻度）的会话，仅凭 `44.6` 千字节（`KB`）压缩输入日志 $D$ 即可完成重放（比压缩状态快照小 `116×`-`292×`），并且在 `macOS arm64`、`Linux x86_64` 与 `Windows 11 x86_64` 上，检查点 `SHA-256` 不匹配数为 `0 / 6,480`。`(GE-H9)` 显示：Form 到 Godot 4 的发射器在 `Godot 4.7.2` 下无头运行的对等性达到 `36 / 36`（`100.0%`，刻度哈希不匹配数为 `0 / 18,000`）。

当不固定的浮点超越函数或融合乘加（`FMA`）降级进入混沌动力学时，结论为**否**。`(GE-H2)` 显示：即使不使用 `-ffast-math` 或 `/fp:fast`，Windows 通用 C 运行时（`UCRT`）、Apple `libSystem` `libm` 与 Linux `glibc` 的 `std::sin`/`std::cos` 仍会在刻度 `10` 至 `37` 处形成三方发散三角；`MSVC` `/fp:precise` 与 `Clang` `-ffp-contract=fast` 在刻度 `192` 处发散；`x86_64` 与 `arm64` 的 `FMA` 则在刻度 `406` 处发散。`(GE-H7)` 显示：在三个混沌物理模板上，跨越 $\delta_0 \in [2^{-52}, 2^{-10}]$ 的 `840` 条成对轨迹中，宏观发散时间 $t^*$ 服从 $t^* = \hat{\alpha} + (1/\hat{\Lambda})\ln(\Delta/\delta_0)$，隐含的李雅普诺夫指数为 $\hat{\Lambda} \in \{1.95, 2.48, 5.07\}\ \text{s}^{-1}$，单元均值 $R^2 \in [0.9940, 0.9995]$，双侧 $p \le 10^{-77.6}$。

对于跨 GPU 后端的逐位精确像素，结论为**否**；但在有界单向容差门限下，结论为**是**。`(GE-H3)` 显示：在八个硬件 `GPU × API` 端点上（包括 Apple `Metal`；Linux Mesa Radeon Vulkan（`RADV`）；英伟达（Nvidia，`NVIDIA`）的 Linux 与 Windows `Vulkan`、Windows DirectX 12（`DX12`）；以及英特尔 Linux Mesa Vulkan（`ANV`）、Windows `Vulkan` 与 `DX12`），在 `512×512` `RGBA8Unorm` 下，`27 / 28` 个硬件组合的原始 `SHA-256` 存在差异；然而，全部 `28 / 28` 组合都保持最大逐通道误差 $\Delta_{\max} \le 2 / 255$、峰值信噪比（`PSNR`）`>= 64.16 dB`，以及结构相似性（`SSIM`）`>= 0.99983`，且 `measured_j = None`，`board_metered = false`。

**简明概述**

1. **只要算术运算与效果都位于受检的 Form 之内，精确模拟、紧凑规则、高角色数量与长达一小时的重放便都能成立。** 在 `100,000` 个物理 tick 上（`GE-H1`，覆盖原生 Rust、使用 `Clang` 的 C++20、编译器集合（`GCC`）与 `MSVC`、`Wasm`、JavaScript `BigInt` 以及 Python，共 `30` 个单元，`0 / 25,500` 次失配），三段 1 小时、`216,000` 个 tick 的游戏会话仅凭 `44.6 KB` 压缩输入日志即可重放（`GE-H8`，覆盖 `macOS`、`Linux` 与 `Windows 11`，`0 / 6,480` 次失配）。`17` 个多引擎游戏行为（`GE-H4`）相较 Unity C# 减少 `76.2%` 的行为代码行，相较分别维护 C# + GDScript + Rust `ECS` 减少 `88.7%`。`10,000` 个角色的空间网格竞技场（`GE-H5`）在编译型 C++20 中每 tick 耗时 `0.058 ms`、能耗 `1.69 mJ`，而解释执行的 Python 中每 tick 耗时 `564.6 ms`、能耗 `13.09 J`。`260` 项静态接口故障测试（`GE-H6`）的检出率为 `98.46%`，仅做解析的方法为 `6.15%`。`36` 个无头 `Godot 4.7.2` 任务（`GE-H9`）实现 `36 / 36` 次精确轨迹一致。每一种投影都复现出完全相同的规范状态哈希。

2. **即便不启用快速数学标志，标准浮点物理在 `Windows`、`macOS` 与 `Linux` 之间的漂移速度仍呈对数级加快。** 纯代数运算 `+`、`-`、`*`、`/` 与 `sqrt`，在禁用 `FMA`（`/fp:strict` 与 `-ffp-contract=off`）时，于所有测试的操作系统与指令集架构下，全部 `25,000` 个 tick 均保持一致。但跨 Windows `UCRT`、macOS `libm` 与 Linux `glibc` 的 `std::sin`/`std::cos` 会在第 `10` 至 `37` 个 tick 内翻转一个比特（`GE-H2`），默认 `FMA` 规则则在第 `192` 至 `406` 个 tick 处发生分歧。`840` 条受控扰动轨迹（`GE-H7`）表明，将 $\delta_0$ 从 $2^{-10}$ 缩小到电气与电子工程师学会（`IEEE`）754 `binary64` 机器精度 $2^{-52}$，只能额外换得 `5.7` 至 `14.4` 秒（$R^2_{\text{mean}} \ge 0.994$）。

3. **即便是同一块显卡，`DirectX 12` 与 `Vulkan` 之间也可能翻转像素比特，因此渲染应置于单向容差闸门的下游。** 在八个硬件 `GPU × API` 端点（`Metal`、`Vulkan` 与 `DirectX 12`）以及 Windows Advanced Rasterization Platform（`WARP`）与 `Mesa llvmpipe` 上，在同一块 `NVIDIA GeForce 2060` 上切换 `DirectX 12` 与 `Vulkan`（`108.34 dB` `PSNR`），或在 `Intel Iris Xe` 上切换（`79.52 dB` `PSNR`），会通过着色器编译器的降级过程改变 `1` 个最低有效位（`LSB`）。跨厂商组合则在 `0.00%` 至 `9.34%` 的像素上相差 `<= 2` `LSB`（`PSNR >= 64.16 dB`，`SSIM >= 0.99983`），且从未破坏模拟状态（`GE-H3`）。

![拟议拆分的示意图。顶部方框包含游戏形式 P = S, E, δ, D, λ，带有类型化接口模式和严格检查器。箭头指向四个投影：左侧精确区中的仿真（Rust、WebAssembly、XState、SCXML、Python）和脚本（Rhai、Lua、Luau），由每时刻状态哈希判断；右侧容差区中的场景（类BSN、glTF、OpenUSD）和渲染（Slang、WGSL、WESL），由每像素误差判断。一条虚线垂直线标出确定性边界。底部带列出仅作为已记录事件进入的主机效应：输入、时钟、音频、网络、资产输入和输出、GPU绘制、装饰物理。](/figures/game-engines/architecture.svg)

*图 1. 拟议拆分。一个形式馈送四个投影。仿真和脚本位于精确区，由每时刻状态哈希判断。场景和渲染位于容差区，由每像素误差判断。主机效应仅作为已记录事件进入。*

![网格图，十一行表示现有表示形式（Slang、Naga、WGSL 和 WESL、glTF、OpenUSD、BSN、SCXML 和 XState、VGDL、GameRule、nAIVE、SpacetimeDB），七列表示能力（行为、场景、着色器、执行顺序、多目标、重放日志、跨层检查）。绿色单元格标记已记录能力，琥珀色为部分，灰色为缺失或未记录。跨层列除 Slang 和 nAIVE 有部分标记外均为灰色。](/figures/game-engines/coverage.svg)

*图 2. 现有表示形式的覆盖范围，仅根据本研究阅读的文档评分。绿色：已记录能力。琥珀色：部分。灰色：缺失或未记录。最右侧列（跨层检查）几乎为空。*

<div id="1-terms-notation-and-the-idea-under-test" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语、记号与待检验的思路

<ul id="terms">
<li>RCE、IR、ECS、FSM、SDF、AST、DAG、LCG：Reality Code Engine（同一家），中间表示，实体组件系统，有限状态机，有符号距离场，抽象语法树，有向无环图，线性同余生成器</li>
<li>中央处理器, 图形处理器, 指令集架构, 指令集架构, 单指令多数据, 高级向量扩展 2, Arm 高级单指令多数据, 特殊功能单元, 光栅操作流水线, Intel 猛禽湖移动架构, Intel 虎湖移动架构</li>
<li>IEEE、FMA、VFMADD、VFNMADD、FMADD、FMSUB、ULP、LSB、SHA、MAE、RMSE、PSNR、SSIM、SD、OLS、CI、TP、FP、FN、TN、RGBA8：Institute of Electrical and Electronics Engineers（如 IEEE 754 浮点数），融合乘加，x86_64 向量融合乘加和取负乘加操作码，AArch64 标量融合乘加和乘减操作码，单位最后位，最低有效位，Secure Hash Algorithm（`SHA-256`），平均绝对误差，均方根误差，峰值信噪比，结构相似性指数，标准差，普通最小二乘，置信区间，真阳性，假阳性，假阴性，真阴性，以及每通道 8 位的红绿蓝 alpha 帧缓冲格式</li>
<li>WGSL、WESL、SPIR-V、GLSL、HLSL、MSL、D3D11、D3D12、DX12、VULKAN、METAL、DXIL、DXBC、DXC、FXC、WARP、WDDM、CUDA、UBO：WebGPU 着色语言，WebGPU 扩展着色语言，Standard Portable Intermediate Representation V，OpenGL 着色语言，高级着色语言，Metal 着色语言，Direct3D 11，Direct3D 12，DirectX 12，`wgpu::Backends::VULKAN` 和 `wgpu::Backends::METAL` 后端标志，DirectX 中间语言，DirectX 字节码，DirectX 着色器编译器，传统 Direct3D Effect 编译工具，Windows 高级光栅化平台软件 DirectX 12 光栅化器，Windows 显示驱动模型，统一计算设备架构，以及统一缓冲对象</li>
<li>RADV、ANV、LLVM、GNU、GCC、MSVC、UCRT、NT、PE、OS、OSs、API、APIs、JIT、VM、SLOC、HUD、UI、SFX、LOS、AABB、HP、XP、AP、KB、MB、CRUD、NL、VLM、LLM、GFW、Xvfb、WebXR、WebMCP、URL、JSON、YAML、README、NTFS、CRLF、CS0246、RE、ENGINE、DFU：Mesa Radeon Vulkan 驱动、Mesa Intel Vulkan 驱动、Low Level Virtual Machine 编译器基础设施、GNU 的 Not Unix 项目、GNU 编译器集合、Microsoft Visual C++ 编译器（`cl.exe`）、Windows 通用 C 运行时（`ucrtbase.dll`）、Windows 新技术内核（Windows NT）、Windows 可移植可执行文件、操作系统、应用程序编程接口、即时编译器、虚拟机、非注释非空白源代码行数、抬头显示、用户界面、声音效果、视线范围、轴对齐包围盒、生命值、经验值、行动点、千字节、兆字节、创建/读取/更新/删除操作、自然语言、视觉语言模型、大型语言模型、Great Firewall 网络过滤器、X 虚拟帧缓冲显示服务器、Web 扩展现实 API、Web 模型上下文协议、统一资源定位符、JavaScript 对象表示法、YAML 不是标记语言、仓库 README 文档文件、新技术文件系统、回车换行序列、C# 编译器缺失类型诊断 CS0246、Capcom RE ENGINE（“Reach for the Moon” / “RE neXt” 引擎品牌）、以及 Dagstuhl Follow-Ups DOI 前缀</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG：状态图 XML、游戏描述语言、视频游戏描述语言、Bevy 场景表示法、Boldsea 语义语言、多级中间表示、原子性/一致性/隔离性/持久性事务、Good Game Peace Out 回滚网络库、图形语言传输格式（ISO/IEC 12113:2022）、开放通用场景描述、通用场景描述、局域网、人工智能和计算智能与游戏</li>
<li>SATB, RAPL, MSR, PID, RUSAGE, V6, AMD, NVIDIA, RTX, V100, GH200, CTC: 饱和分层基准遥测级别（`L2` 插座/封装计数器，`L3` 每进程内核计数器）[同一家]，运行平均功率限制，特定模型寄存器，进程标识符，`proc_pid_rusage` (`RUSAGE_INFO_V6`)，超威半导体，NVIDIA 公司，NVIDIA GeForce RTX GPU 系列，Volta V100 GPU，Grace Hopper GH200 超芯片，以及闭时间曲线</li>
</ul>

为了让前向引用从头到尾保持透明，第 1 节定义 Form 记号，第 2 节综述现有的游戏表示方法，第 3 节分析浮点发散，第 4 节列出各类中间表示，第 5 节给出拟议的分层方案，第 6 节报告全部九个已执行的证伪测试套件（`GE-H1` 至 `GE-H9`），覆盖三种操作系统、三种指令集架构、三种 GPU 应用程序接口以及四种游戏行为工具链，第 7 节列出不可行性标记，第 8 节记录来源与局限。

[现实代码引擎（RCE）](https://research.openie.dev/about/rce/) 把程序视为一个称为 Form 的状态机，记为 $P = (S, E, \delta, D, \lambda)$：

- $S$：状态集合；
- $E$：事件集合（输入）；
- $\delta : S \times E \to S$：转移函数；
- $D$：记录每一步操作的仅追加日志；
- $\lambda$：从状态到可观察输出的输出映射。

严格检查器要么接受一个 Form，要么指出它违反了哪条规则。随后，发射器将通过检查的 Form 投影为 Rust、Python、JavaScript 和 Scala 代码。XState（一个 JavaScript 与 TypeScript 状态图库）、SCXML（万维网联盟（W3C）推荐标准）、WebAssembly（`Wasm`）以及 Godot 4 GDScript 并非核心检查器内置的 `rce emit` 目标。第 6 节对编译后的 `Wasm` 投影进行测试（`GE-H1`、`GE-H5`），并直接基于 `rce emit form` 构建了独立的 Form 到 Godot 4 GDScript 发射器（`GE-H9`）。由于每一步都写入 $D$，任何一次运行都可以被重放。

游戏引擎是一台规模大得多的机器。它运行固定步长模拟、脚本层、场景描述以及在 GPU 上执行的渲染管线。第 1 至第 8 节要探讨的是：这些层次中哪些可以置于 Form 之内，哪些必须作为宿主效应留在外部，以及精确性在何处必须让位于容差。

这一思路由来已久。斯坦福大学的[游戏描述语言（GDL）规范](http://ggp.stanford.edu/readings/gdl_spec.pdf)涵盖 “有限、离散、确定性的多人完全信息游戏”，并指出此类游戏的自然底层模型 “是一个有限状态机”。游戏引擎的新颖之处不在于状态机本身，而在于其周边的一切：浮点物理、脚本、场景以及 GPU。

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

### 2.4 存在可重放轨迹的公开基准

GameCraft-Bench（[arXiv:2606.17861](https://arxiv.org/abs/2606.17861)；[仓库](https://github.com/FreedomIntelligence/gamecraft-bench)）提供了15个家族中的140个Godot 4二维任务。提交内容携带可重放输入轨迹。论文中最强的代理得分41.46%，仓库后续报告65.70%至75.86%。它未涵盖Unity、Unreal、3D、多人游戏或大型物理场景。[Summer Engine](https://www.summerengine.com/templates)发布了17个开源游戏模板（赛车、平台跳跃、塔防、类银河战士恶魔城、幸存者、第一人称射击、局域网多人、体素及其他）。通用视频游戏人工智能框架及其VGDL（[arXiv:1802.10363](https://arxiv.org/abs/1802.10363)）提供了120个单人游戏和60个双人游戏，这些游戏由精灵、交互、终止和关卡映射集定义。

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

*示例模型：* 取 $\delta_0 \approx 6 \times 10^{-8}$（单精度的一个 ULP，相对误差），$\Delta = 1$（墙另一侧的对象），并假设 $\Lambda = 2\ \text{s}^{-1}$。则 $t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ s。对数是关键：将 $\delta_0$ 缩小百万倍仅能获得约 6.9 秒的额外时间。因此，近似一致性无法拯救仿真。状态要么是位级相同，要么最终会发散，这一预测已在 25,000 条多 ISA 与 3 种操作系统的碰撞计数（`GE-H2`）以及 840 条轨迹的 $\ln(\Delta/\delta_0)$ 斜率扫描（`GE-H7`）中直接验证。

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

### 5.1 分层划分

1. **仿真形式（精确）。** $S$ 保存定点数或严格 IEEE 754 数值，禁用 FMA 与重结合，超越函数由整数或固定版本的软件例程实现。$E$ 保存 tick 事件与记录的输入。$\delta$ 采用 SCXML 宏步语义：每个 tick 内，按队列顺序处理事件，依文档顺序解决冲突，并以串行方式执行并行区域。集合按声明顺序遍历，遵循 GameRule 的契约（声明顺序、后写覆盖、结构性变更延迟到 tick 末尾）。若需要并行，检查器仅接受满足 Core ECS 不相交条件的调度。
2. **脚本投影（精确）。** 设计者脚本编译为作用于 $S$ 的守卫与动作，输出形式可为 [Rhai](https://rhai.rs/book/about/features.html)（沙箱化，具备“Don't Panic”保证，支持 no-std 与 Wasm）、Lua、[Luau](https://luau.org/)（默认沙箱化，支持渐进式类型），或带类型的引擎脚本，如 Godot 4 GDScript（`GE-H9`）。脚本只能通过声明的动作调用 $\delta$，不能直接读取时钟、随机源或 GPU 结果。
3. **场景投影（容差下游）。** $\lambda$ 将 $S$ 映射为类 BSN 的补丁树，其组件模式属于形式的一部分。glTF 与 OpenUSD 作为资产的导出目标。
4. **渲染投影（容差）。** 材质与渲染通道以 Slang 或 WGSL 编写，并经 Slang 或 Naga 输出至 `DirectX 12`、`Metal` 与 `Vulkan` 后端。渲染是 $\lambda(s)$ 的纯函数。GPU 结果从不回流至 $S$。

<div id="52-inside-the-form-versus-host-effects" class="anchor-alias" aria-hidden="true"></div>

### 5.2 Form 内部与宿主效应

Form 内部包括：状态、状态转移、规则执行顺序、面向玩法相关刚体的定点物理，以及种子位于 $S$ 中的随机数生成器和接口模式。Form 外部的效应以日志事件的形式记录，包括设备输入、挂钟时间、网络数据包、音频输出、资产输入与输出、GPU 绘制，以及用于装饰性效果的任何第三方物理计算。重放时将 $D$ 重新输入 $\delta$，而不再访问设备。存储开销适中。在逻辑帧速率 $f_{\text{tick}} = 60$ Hz、每帧输入 $b = 2$ 至 $16$ 字节的条件下，原始日志以 $120$ 至 $960$ B/s 的速度增长（每小时原始数据 `0.43` 至 `3.5` MB，经第 6.8 节所述 gzip 压缩后每小时为 `44.6 KB`）。

<div id="53-determinism-boundary" class="anchor-alias" aria-hidden="true"></div>

### 5.3 决定性边界

- **精确区准则：** 对于目标 A 和 B 的每个 tick $t$，$H(s_t^A) = H(s_t^B)$，其中 $H$ 是对 $S$ 的规范序列化进行的密码学哈希。
- **容差区准则：** 对于相同 $s_t$ 的渲染帧 $I^A$ 与 $I^B$，每通道误差超过 $\varepsilon$ 的像素比例不得超过 $p_{\max}$，并配合受限的结构相似度（`SSIM`）和峰值信噪比（`PSNR`）下限。第 6.3 节在八个硬件 `GPU × API` 端点上执行此校准，覆盖 `DirectX 12`、`Metal` 与 `Vulkan`（`Apple Metal`、`AMD RADV Vulkan`、`NVIDIA` Linux/Windows `Vulkan` 与 Windows `DX12`，以及 `Intel` Linux `ANV Vulkan` 与 Windows `Vulkan` / `DX12`）。
- 回滚网络采用 [GGPO](https://github.com/pond3r/ggpo) 风格，依赖输入预测和投机执行，仅在该边界的精确侧有效。

<div id="54-cross-layer-interface-checking" class="anchor-alias" aria-hidden="true"></div>

### 5.4 跨层接口检查

在任何产物输出之前，检查器会验证四类有类型的边。(a) 脚本到仿真:每个动作都必须指向一个已声明的转移，且参数类型一致;(b) 仿真到场景:$\lambda$ 的输出必须与组件模式相匹配;(c) 场景到渲染:每个材质绑定都必须对应一个类型、组与绑定索引兼容的 Slang 或 WGSL 资源;(d) 事件覆盖:脚本监听的每个事件都必须能由某个转移或宿主来源产生。正因为 Mage 的发现(见第 2.3 节),这些边的检查以行为轨迹而非编译是否通过为判定依据。

<div id="6-falsifier-first-test-plan-and-full-ge-h1ge-h9-empirical-closure" class="anchor-alias" aria-hidden="true"></div>

## 6. 伪造者优先测试计划与完整的 `GE-H1`-`GE-H9` 经验闭包

每个假设均列出其杀灭准则。若准则满足，则撤回该主张。6.1 至 6.10 小节报告了全部九个已执行的经验伪造者套件（`GE-H1` 至 `GE-H9`，预注册于 `PREREG_wave3_multi_isa_wgpu.json` `1721e5bdffaf...` 和 `PREREG_wave5_ge_h4_h9.json` `7d02115e37d3...`），并附带交互式焦耳预算的 `Q32.32` 时序预算竞技场。

| 编号 | 假设 | 测试语料 | 度量指标 | 终止判据 | 状态 |
|---|---|---|---|---|---|
| GE-H1 | 仿真投影在不同语言、操作系统与 CPU 指令集之间按位完全一致 | 16 体二维竞技场 Form(`Q32.32` 定点数,`732` 字节状态),覆盖 `arm64` macOS、`aarch64` Linux、AMD/Intel `x86_64` Linux 以及 Tiger Lake `x86_64` Windows 11 | 在 Rust、Wasm32、C++20(`Clang`/`GCC`/`MSVC`)、Node.js `BigInt`、Python 3 中计算 $H(s_t)$,运行 $10^5$ 个时间步(`30` 个单元) | 任一 `(host, target)` 单元在任一检查点出现哈希不匹配 | **已执行(`3` 个操作系统与 `3` 种指令集上 `0 / 25,500` 次不匹配,见第 6.1 节)** |
| GE-H2 | 严格模式与三操作系统/跨指令集浮点边界及库/FMA 漂移 | 16 体二维混沌竞技场(`25,000` 个时间步,覆盖 `arm64` macOS、`aarch64` Linux、`x86_64` Linux 与 `x86_64` Windows 11) | 精确发散时间步 `t_div`,涵盖严格 `f64`、三操作系统 `UCRT`/`libSystem`/`glibc` 的 `sin/cos`、`MSVC` 与 `Clang` 的 `FMA`、V8 `Math.sin` 以及 `f32` | 在固定代数运算下出现非预期不匹配,或出现未预测的静默漂移 | **已在 `macOS`、`Linux` 与 `Windows 11` 上执行(见第 6.2 节)** |
| GE-H3 | 跨 GPU 与跨 API 渲染保持在有界容差之内(`wgpu` / WGSL) | 4 个标准 `Q32.32` 状态(`t = 0, 250, 1k, 10k`),在 `8` 个硬件 `GPU × API` 端点(`DX12`、`Metal`、`Vulkan`)+ `WARP` + `llvmpipe` + `CPU Q16.16` 上以 `512×512` `RGBA8Unorm` 渲染 | 帧缓冲 `SHA-256`、差异像素 `%`、$\Delta_{\max}$、MAE、RMSE、`PSNR` 与 `SSIM` | 任一物理 GPU 配对未满足 `PSNR > 40 dB`、`SSIM > 0.999` 或 $p(\Delta > 8) \le 0.001$ | **已执行(`28/28` 个配对 = `112/112` 帧通过门限:`PSNR ≥ 64.16 dB`、`SSIM ≥ 0.99983`,见第 6.3 节)** |
| GE-H4 | 形式化编码的规则比 GameRule 减少代码量 | 跨 *Haunted Jaunt*(`5`)、*Survival Shooter*(`7`)与 *Tanks*(`5`)共 `17` 个行为 × `4` 种语言(`68` 个模块,`680` 条轨迹) | 非注释 `SLOC`、词法记号、胶水代码行数、跨语言轨迹一致性 | 相对 Unity C# 的行为 `SLOC` 削减 `< 50%`(GameRule: `81.3%`),或轨迹不匹配数 `> 0` | **已执行(相对 Unity C# 为 `−76.22%` SLOC,相对 Rust ECS 为 `−61.47%`,相对 GDScript 为 `−51.99%`;`0 / 680` 次不匹配,见第 6.4 节)** |
| GE-H5 | Form 运行时超过 GameRule 的上限 | 多主体 `Q32.32` `16×16` 空间网格竞技场(`N = 64..10,000`,每单元 `500` 个时间步,`5` 个层级 + Linux `RAPL` `reported_j`) | p50/p99 每步 `ms/tick`、`RAPL` `mJ/tick`、$N_{20\text{ms}}$、跨层级 `SHA-256` | 在 $N = 350$ 以下编译后 Form 单步时间 `> 20 ms`,或哈希不匹配数 `> 0` | **已执行(Python 为 `N_20ms = 390`,Node.js 为 `3,906`;编译版在 `N = 10,000` 时为 `0.058-0.125 ms/tick`,`0 / 50` 次不匹配,见第 6.5 节)** |
| GE-H6 | 接口检查能够捕获真实缺陷 | `26` 类缺陷模式 × `10` 个模块(`130` 个注入故障 + `130` 个有效对照 = `260` 个模块) | `TP`、`FP`、`FN`、`TN`、检出召回率 `%`、精确率 `%`、故障 `F1` | 对注入故障的检出率 `< 90%`,或 `F1` 不优于无 IR 基线 `0.12` | **已执行(`128 / 130` = `98.46%` 召回率,`0` 个假阳性,`F1 = 0.9922`,而仅解析基线为 `0.1159`,见第 6.6 节)** |
| GE-H7 | 混沌物理模板上完整的 $\ln(\Delta/\delta_0)$ 斜率扫描 | `3` 个混沌模板(`GE-T1`..`GE-T3`)× `7` 个扰动 $\delta_0 \in [2^{-52}, 2^{-10}]$ × `40` 个随机种子(`840` 条轨迹,`60 Hz`) | OLS 斜率 $\hat{\beta} = 1/\hat{\Lambda}$、隐含 $\hat{\Lambda}$、$R^2$、95% 自助法置信区间、双侧 $p$ | $t^*$ 对 $\ln(\Delta/\delta_0)$ 的斜率与零不可区分($p \ge 0.01$) | **已执行($\hat{\Lambda} \in \{1.95, 2.48, 5.07\}\ \text{s}^{-1}$,$R^2_{\text{mean}} = 0.9940\text{-}0.9995$,$p \le 10^{-77.6}$,见第 6.7 节)** |
| GE-H8 | 重放是完备的 | 三段 1 小时(`216,000` 个时间步,`60 Hz`)会话,仅依据紧凑输入日志 $D$ 在 `macOS`、`Linux` 与 `Windows 11` 上重放 + `4` 个泄漏对照 | `2,160` 个步长为 `100` 的检查点 + 最终 `SHA-256` 摘要,压缩后的 $|D|$ 与状态流对比 | 仅凭 $D$ 在任一操作系统间出现哈希不匹配,或泄漏对照未能产生分歧 | **已执行(`3` 个操作系统上 `0 / 6,480` 次检查点不匹配;gzip 压缩后 `44.6 KB` 的 $D$ 比状态流小 `116×-292×`;`4/4` 个泄漏在 `t = 1` 处产生分歧,见第 6.8 节)** |
| GE-H9 | 基准对等性 | `form_to_gdscript.py` 在 `Godot 4.7.2 --headless` 中运行 `36` 个确定性任务(`15` 个 GameCraft-Bench 族 × `2` + `6` 个核心系统,`18,000` 个时间步)及 140 个任务的归档审计 | 通过率与逐时间步 `SHA-256` 对等性,对比手写原生 GDScript | 在相同输入流上通过率更低,或状态轨迹不匹配数 `> 0` | **已执行(`36 / 36` = `100.0%` 通过对等,`0 / 18,000` 次时间步哈希不匹配,见第 6.9 节)** |

![跨越确定性边界的双面板实证摘要。左面板展示精确区 GE-H1（在 arm64 macOS、aarch64 Linux、AMD/Intel x86_64 Linux 以及 Intel x86_64 Windows 11 上，30 个单元共 25,500 个 SHA-256 检查点，不匹配数为 0）以及 GE-H2 三操作系统 f64 发散刻度（Windows UCRT 与 Apple libm 相对 GNU glibc sin/cos 的 t_div = 10；Windows UCRT 与 Apple libm 的 t_div = 37；MSVC /fp:precise 与 Clang -ffp-contract=fast 的 t_div = 192；x86_64 VFMADD 与 arm64 FMADD 的 t_div = 406）。右面板展示容差区 GE-H3 在 8 个硬件 GPU×API 端点上的最小 PSNR 柱状图，涵盖 DirectX 12、Metal 和 Vulkan，并将同一 GPU 上 DX12 与 Vulkan 编译器漂移（RTX 2060 为 108.3 dB，Iris Xe 为 79.5 dB）与跨厂商光栅化差异（64.2 至 72.1 dB）区分开来，所有数值均远高于 40 dB 的门限。](/figures/game-engines/cross-gpu-tolerance.svg)

*图 3. `GE-H1`、`GE-H2` 和 `GE-H3` 的实证边界。上游 `Q32.32` 仿真状态 (`S`) 在六台机器、三种操作系统（`macOS`、`Linux`、`Windows 11`）和三种 ISA 上实现了 `0 / 25,500` 次 `SHA-256` 检查点不匹配，而未固定的 `f64` `sin/cos` 和 `FMA` 在 `10` 到 `406` tick 之间跨 OS/编译器/ISA 边界出现偏差。下游的 $\lambda(s_t)$，在完全相同的 Windows 11 GPU 上切换 `DirectX 12` 与 `Vulkan` 会通过着色器降低导致 `1` 个最低有效位翻转（`79.5-108.3 dB` `PSNR`），同时所有 `28 / 28` 硬件 `GPU × API` 对的 `PSNR` 严格保持在 `64.16 dB` 以上，`SSIM` 为 `0.99983`（`measured_j = None`，`board_metered = false`）。*

![四面板实证总结，闭合 GE-H4 至 GE-H9。面板 A 显示 GE-H4 在 17 个模块中的行为 SLOC（326 行 RCE SLOC 对比 679 行 Godot 4 GDScript、846 行 Bevy Rust ECS 和 1,371 行 Unity MonoBehaviour C#，在 680 条跟踪中未出现不匹配）。面板 B 显示 GE-H5 从 64 到 10,000 个角色的对数-对数步进时间，rce emit python 在 N=390 时跨过 20 ms，rce emit js 在 N=3,906 时跨过，编译的 Wasm32、C++20 和 Rust 在 N=10,000 时保持在 0.058 至 0.125 ms/滴之间。面板 C 显示 GE-H6 故障检测（召回率 98.46%，F1=0.9922 对比 6.15%，F1=0.1159 仅解析）以及 GE-H7 线性 t* 与 ln(Delta/delta0) 轨迹在三个混沌模板上的表现（R²=0.994 至 1.000）。面板 D 总结 GE-H8 1 小时 216,000 滴的 3-OS 重放，使用 44.6 KB gzip 日志（在 6,480 条中无不匹配）以及 GE-H9 Godot 4.7.2 无头等价性（36 项任务全部通过，18,000 滴中无不匹配）。](/figures/game-engines/ge-h4-h9-closure.svg)

*图 4. `GE-H4` 至 `GE-H9` 的完整实证闭合（`openIE-dev/rce` 提交 `1762fb4b`，`Godot 4.7.2 --headless`，`macOS arm64`、`Linux x86_64` 与 `Windows 11 x86_64`；`measured_j = None`，`board_metered = false`）。*

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

<div id="64-ge-h4-form-encoded-behavior-rules-across-17-modules-and-4-languages-haunted-jaunt-survival-shooter-tanks" class="anchor-alias" aria-hidden="true"></div>

### 6.4 `GE-H4`：跨 17 个模块和 4 种语言的表单编码行为规则（`Haunted Jaunt`、`Survival Shooter`、`Tanks`）

*预注册于 `PREREG_wave5_ge_h4_h9.json`（`SHA-256: 7d02115e37d3...`）。每个 `.rce` 模块均由 `openIE-dev/rce`（`commit 1762fb4bb65a`，规范草案 `0.9`）在入口处通过 `rce check` 和 `rce test` 进行检查和测试。*

为了检验通用 `.rce` 表单在 GameRule（第 2.1 节）所研究的恰好三个参考游戏上是否实现至少 `50%` 的行为代码缩减，并在多个引擎范式间进行投射，所有 **17** 个演员和导演行为，**Haunted Jaunt**（`PlayerStealth`、`GhostPatrol`、`GargoyleSpotter`、`ObserverLineOfSight`、`ExitTrigger`）、**Survival Shooter**（`PlayerAvatar`、`GunRaycaster`、`ZombunnyChaser`、`ZomBearBruiser`、`HellephantBoss`、`WaveSpawner`、`ScoreHUD`）以及 **Tanks**（`TankChassis`、`ShellBallisticsQ32`、`ExplosionFalloff`、`TankHealthShield`、`RoundDirector`）被编写为 `.rce` 表单，并与行为相同的惯用实现配对，分别使用 **Unity `MonoBehaviour` C#**（通过 Microsoft Visual C# `csc.exe 4.0.30319` 在 Windows 11 上编译和执行）、**Godot 4 `Node` GDScript**（通过 `Godot 4.7.2 --headless` 在 Linux 上执行）以及 **Bevy 式 Rust `ECS`**（`Component` + `Event` + `Query` 系统，使用 `rustc 1.100` 编译）。在每个模块的 `10` 条确定性 20 事件轨迹（`170` 条轨迹 × `4` 套工具链 = `680` 次执行）中，跨语言状态摘要不匹配为 **`0 / 680`**：

| 游戏套件（`modules`） | `.rce` 表单行为 `SLOC`（含 `intent`） | Unity `MonoBehaviour` C# `SLOC` | Bevy Rust `ECS` `SLOC` | Godot 4 `Node` GDScript `SLOC` | 相对 Unity C# 的削减（`with intent`） | 相对 Rust `ECS` / GDScript 的削减 | 胶水代码行数（`.rce` / C# / `ECS` / `.gd`） |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Haunted Jaunt（`5`）** | **`90`**（`105`） | `391` | `238` | `190` | **`−76.98%`**（`−73.15%`） | `−62.18%` / `−52.63%` | `17` / `230` / `112` / `54` |
| **Survival Shooter（`7`）** | **`148`**（`169`） | `590` | `367` | `288` | **`−74.92%`**（`−71.36%`） | `−59.67%` / `−48.61%` | `27` / `351` / `168` / `81` |
| **Tanks（`5`）** | **`88`**（`103`） | `390` | `241` | `201` | **`−77.44%`**（`−73.59%`） | `−63.49%` / `−56.22%` | `17` / `233` / `111` / `57` |
| **总计（`17` 个模块）** | **`326`**（`377`） | **`1,371`** | **`846`** | **`679`** | **`−76.22%`**（`−72.50%`） | **`−61.47%` / `−51.99%`** | **`61` / `814` / `391` / `192`** |

- **通过 `>= 50%` 阈值，并分析 GameRule 达到 `81.3%` 的原因**：纯 `.rce` 行为规则相较于惯用的 Unity `MonoBehaviour` C# 将 `SLOC` 减少了 **`76.22%`**。即使计入 `.rce` 中嵌入的 `51` 行 `intent` 以及 `34` 条经门控检查的 `example` 断言（三个基线脚本均不包含这些内容），减幅仍为 `72.50%`。词法记号减少了 **`66.15%`**（`2,348` 对 `6,937`），生命周期、队列与序列化胶水代码减少了 **`92.51%`**（`61` 对 `814` 行）。与 GameRule 的 `81.3%`（`572 -> 107` 行）相比，约 `5` 个百分点的差距反映了表达能力的通用性差异：GameRule 在 C# 中硬编码了 14 个 Unity CRUD 动词，而 `.rce` 则直接在语言中表达任意算术、位掩码以及 `Q32.32` 弹道计算。以一个 `.rce` Form 取代三个独立的引擎代码库（合计 `2,896` 行 `SLOC`），可将可维护的行为 `SLOC` 减少 **`88.74%`**。

<div id="65-ge-h5-multi-actor-q3232-runtime-scaling-and-rapl-energy-across-5-projection-tiers-n--64-to-10000" class="anchor-alias" aria-hidden="true"></div>

### 6.5 `GE-H5`：多行动者 `Q32.32` 运行时扩展性与 `RAPL` 能耗（5 个投影层级，`N = 64` 至 `10,000`）

为检验 Form 投影是否能突破 GameRule 的约 308 行动者（20 ms）规则解释上限，使用 `Q32.32` 二维竞技场 Form（`ge_h5_actor_arena.rce`，经 `rce check` 验证），该 Form 结合 16×16 均匀空间网格（256 个单元格，范围 `[-64, +64]^2`）与巡逻、追逐、拥挤规避及脉冲冷却转移，在空载 `Intel Core i9-13900H`（`Linux 7.0`，`SATB` `L2` `intel-rapl:0` 套接字与核心 `energy_uj`，`measured_j = None`，`board_metered = false`）上，对 $N \in \{64, 128, 256, 300, 350, 500, 1{,}000, 2{,}500, 5{,}000, 10{,}000\}$ 进行了 **500** 个时步的步进，跨越五个 Form 投影层级：

| 投影层级 | `p50 ms/tick`（`N = 300`） | `p50 ms/tick`（`N = 350`） | `p50 ms/tick`（`N = 1,000`） | `p50` / `p99 ms/tick`（`N = 10,000`） | `L2` `RAPL` pkg `mJ/tick`（`N = 10,000`） | 行动者上限 $N_{20\text{ms}}$ | `500`-tick `SHA-256` 奇偶性 |
|---|---:|---:|---:|---:|---:|---:|:---:|
| **`rce emit python`（`CPython 3.14`）** | `13.662` | `18.115` | `55.525` | `564.575` / `648.061` | `13,090.57`（`core 10,826.87`） | **`390`** *（实测）* | `10 / 10` |
| **`rce emit js`（`Node.js v22.22.1`）** | `1.479` | `1.846` | `4.769` | `57.050` / `66.313` | `1,559.77`（`core 1,183.86`） | **`3,906`** *（实测，`11.2×`）* | `10 / 10` |
| **Form `Rust -> Wasm32`（`Node V8`）** | `0.0040` | `0.0044` | `0.0089` | **`0.0724`** / `0.0810` | **`2.211`**（`core 1.908`） | **`> 10,000`**（`~2.76M` 线性） | `10 / 10` |
| **Form `C++20`（`clang++ -O3`）** | `0.0033` | `0.0036` | `0.0073` | **`0.0583`** / `0.0654` | **`1.694`**（`core 1.454`） | **`> 10,000`**（`~3.43M` 线性） | `10 / 10` |
| **Form `Rust`（`rustc -C opt-level=3`）** | `0.0035` | `0.0041` | `0.0129` | **`0.1248`** / `0.1274` | **`3.673`**（`core 3.156`） | **`> 10,000`**（`~1.60M` 线性） | `10 / 10` |

- **解释并超越 300 行动者上限**：参考 `rce emit python`（`rt.py`，其对每个表达式进行整数装箱并检查范围与燃料不变量）每个行动者的开销为 `45.5`-`56.5 µs`，在 **$N_{20\text{ms}} = 390$** 时跨越 `20.0 ms`，重现了 GameRule 测得的精确解释器机制（`65 µs`/行动者，$N_{\max} \approx 308$）。切换至 V8 的 `BigInt` JIT（`rce emit js`）将 $N_{20\text{ms}}$ 提升 `10.0×` 至 **`3,906`** 个行动者，而无装箱的编译投影（`Wasm32`、`C++20 -O3`、`Rust -O3`）在 **`0.058`-`0.125 ms`** 内步进 **`10,000`** 个行动者（`5.8`-`12.5 ns`/行动者，在 `10,000` 个行动者时使用少于 `20 ms` 预算的 `0.63%`，并将套接字 `RAPL` `reported_j`/tick 相对 `rce emit python` 降低 **`3,564×` 至 `7,728×`**），同时出现 **`0 / 50`** 个 `SHA-256` 状态不匹配。

<div id="66-ge-h6-static-4-edge-interface-checking-across-26-defect-patterns-260-modules-zero-runtime-ticks" class="anchor-alias" aria-hidden="true"></div>

### 6.6 `GE-H6`: 静态 4 边接口检查，跨越 26 种缺陷模式（`260` 模块，零运行时刻）

对第 5.4 节四边检查器与第 2.3 节法师病理（“编译不等于正确”）的测试，所有 **26** 种游戏接口缺陷模式（`P01` 节点路径拼写错误、`P02` 缺失信号处理程序、`P03` 信号载荷元数不匹配、`P04` 载荷类型不匹配、`P05` 方向物理层/掩码反转、`P06` 未处理的 `kind` 变体、`P07` 空场景资源句柄、`P08` 实体标签拼写错误、`P09` 动画回调缺失事件、`P10` 毫秒与秒增量时间不匹配、`P11` 渲染通道对模拟状态 $S$ 的变异、`P12` 保存模式缺失字段、`P13` 网络数据包字段重排序、`P14` 未映射的主机输入动作、`P15` `u64` 冷却时间下溢、`P16` 死亡实体动作分派、`P17` 单例启动顺序读取竞争、`P18` 悬空资产标识符、`P19` 局部与世界坐标混淆、`P20` 重入碰撞遍历删除、`P21` 缺失 WGSL 统一绑定、`P22` WGSL `vec3`/`vec4` `16` 字节 UBO 对齐不匹配、`P23` 未声明的音频总线、`P24` 陈旧 HUD 状态绑定、`P25` 库存槽溢出，以及 `P26` 传送门过渡持久状态丢失）被实例化为 **`260` 个具体模块束**（每个模式 `5` 个故障注入 + `5` 个有效对照 = `130` 个故障 + `130` 个有效）：

| 验证门（`0` 引擎运行时滴答） | `TP`（/ 130） | `FP`（/ 130） | `FN`（/ 130） | `TN`（/ 130） | 故障检测召回率（%） | 精确率（%） | 故障 `F1` | 准入池有效份额 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **静态形式（`rce check` + `rce test`）+ 4 边清单验证器** | **`128`** | **`0`** | **`2`** | **`130`** | **`98.46%`**（`≥ 90%` 门） | **`100.00%`** | **`0.9922`** | **`0.9848`**（`130 / 132`） |
| **无类型动态脚本解析基线（`godot --headless --check-only`）** | `8` | `0` | `122` | `130` | `6.15%` | `100.00%` | **`0.1159`** | `0.5159`（`130 / 252`） |

- **为什么仅解析的动态检查落在 `F1 = 0.1159`（`≈ 0.12`）**：运行 `Godot 4.7.2 --headless --check-only` 仅捕获了 `8` 个在直接 GDScript 调用上元数（`P03`）或静态 `int`/`String` 注解（`P04`）冲突的模块，静默通过了所有 `122` 个基于字符串键的 `get_node("...")`、`emit_signal("...")`、物理掩码、UBO 偏移、保存/网络字典以及不变量缺陷。
- **静态形式检查的精确边界（`2 / 130` 个可检查 `FN`）**：真实的 `rce check` 和 `rce test`（`W-STEP-2`、`W-TY-1`、`W-NAME-1`、`W-INT-1`，检查 `u64` 减法）加上四边清单验证器捕获了 `128 / 130` 个故障且 `0` 个假阳性。幸存的 `2` 个故障（`P10_fault_5` 和 `P19_fault_5`）是故意未包装的 `i64` 标量，缺少 `LocalX`/`WorldX` 新类型结构体或非零 `example` 断言，证明维度和坐标帧错误需要不同的新类型包装器或定量的 `intent` 示例才能被静态捕获。

<div id="67-ge-h7-full-lnδδ0-lyapunov-slope-sweep-across-3-chaotic-physics-templates-840-trajectories" class="anchor-alias" aria-hidden="true"></div>

### 6.7 `GE-H7`：完整的 $\ln(\Delta / \delta_0)$ Lyapunov 斜率扫描，覆盖 3 个混沌物理模板（`840` 条轨迹）

为直接检验第3节的对数时域 $t^* = (1/\Lambda)\ln(\Delta/\delta_0)$ 在不同连续物理拓扑中的适用性，我们使用三个 `60 Hz`、`IEEE 754` `binary64`（`-fp-contract=off`）模板进行步进计算：**`GE-T1`**（带五个凸形 Sinai 挡板的 `16-Body Chaotic Bumper Arena`，即16体混沌挡板竞技场）、**`GE-T2`**（在重力与弹性地面回弹作用下的 `12-Peg Galton/Pinball Elastic Lattice`，即12钉 Galton/弹球弹性点阵）以及 **`GE-T3`**（带三次硬化弹簧与中央桥墩的 `8-Node Coupled Spring-Pendulum Bridge`，即8节点耦合弹簧摆桥）。每个模板从 `40` 个确定性种子出发，施加 `7` 种单坐标扰动 $\delta_0 \in \{2^{-52}, 2^{-44}, 2^{-36}, 2^{-28}, 2^{-23}, 2^{-16}, 2^{-10}\}$，共得到 `840` 对参考轨迹与扰动轨迹。宏观发散阈值取 $\Delta = 1.0$ 个竞技场单位，初始值满足亚单位条件 `|x_0| < 1`，因此 `+2^-52` 在首次接触之前不会被舍入掉。

| 模板（每个模板 `280` 条轨迹，`0` 条右删失） | $\delta_0 = 2^{-10}$ 时的平均 $t^*$（`s`） | $\delta_0 = 2^{-23}$ 时的平均 $t^*$（`f32` ULP，`s`） | $\delta_0 = 2^{-52}$ 时的平均 $t^*$（`f64` ULP，`s`） | OLS 斜率 $\hat{\beta} = 1/\hat{\Lambda}$（`s/nat`，`95%` 自助法置信区间） | 隐含 $\hat{\Lambda}$（$\text{s}^{-1}$，`95%` 自助法置信区间） | $R^2_{\text{traj}}$ / $R^2_{\text{mean}}$ | 双侧 $t_{278}$（$p$ 值） |
|---|---:|---:|---:|---:|---:|---:|---:|
| **`GE-T1`：16体挡板竞技场** | `2.80 ± 0.92` | `6.52 ± 1.38` | `14.49 ± 2.43` | **`0.4025`**（`[0.3823, 0.4246]`） | **`2.4846`**（`[2.3554, 2.6157]`） | `0.8569` / **`0.99953`** | `40.81`（**$10^{-118.7}$**） |
| **`GE-T2`：12钉 Galton 点阵** | `1.85 ± 0.61` | `3.88 ± 0.98` | `7.57 ± 1.64` | **`0.1974`**（`[0.1804, 0.2145]`） | **`5.0671`**（`[4.6611, 5.5436]`） | `0.7176` / **`0.99629`** | `26.58`（**$10^{-77.6}$**） |
| **`GE-T3`：8节点耦合桥** | `2.94 ± 1.14` | `7.99 ± 2.02` | `17.36 ± 3.16` | **`0.5121`**（`[0.4802, 0.5440]`） | **`1.9528`**（`[1.8382, 2.0823]`） | `0.8169` / **`0.99395`** | `35.21`（**$10^{-103.7}$**） |

- **实验确认近似浮点一致性为何失效**：在 $\delta_0$ 跨越 `12.6` 个数量级的范围内（从 $2^{-10}$ 降至 $2^{-52}$，缩小 $4.2 \times 10^{12}$ 倍），单元格均值发散时间严格随 $\ln(\Delta/\delta_0)$ 线性增长（$R^2_{\text{mean}} \in [0.9940, 0.9995]$，$p \le 10^{-77.6}$）。将单精度（`2^-23`）升级为双精度（`2^-52`，扰动缩小 $5.37 \times 10^8$ 倍）后，可见的宏观发散仅被推迟：`GE-T2` 中为 **`3.69 s`**，`GE-T1` 中为 **`7.97 s`**，`GE-T3` 中为 **`9.37 s`**。

<div id="68-ge-h8-complete-1-hour-216000-tick-replay-from-compact-input-stream-d-alone-across-3-oss" class="anchor-alias" aria-hidden="true"></div>

### 6.8 `GE-H8`：仅从紧凑输入流 $D$ 出发在 3 个操作系统上完成 1 小时（`216,000`-tick）的重放

为验证长时间多子系统游戏会话能否仅从输入流 $D$ 出发完整重放而无需隐藏引擎状态，三个 **1 小时（`216,000`-tick，`60 Hz`）** `Q32.32` 会话（`HauntedJaunt_1h`、`SurvivalShooter_1h`、`TanksQ32_1h`）使用完全相同的 `432,024`-byte 二进制输入日志（`24`-byte 头部 + 每 tick `2` 字节）在 **`macOS 27.2.1 arm64`**（`Apple M5 Max`）、**`Linux 7.0 x86_64`**（`Intel Core i9-13900H`）和 **`Windows 11 Pro 26300 x86_64`**（`Intel Core i7-1165G7`）上进行了重放：

| 1 小时会话（`216,000` ticks @ `60 Hz`） | 原始 / gzip $|D|$ | 原始 / gzip 完整状态流 | Gzip 大小比率（`Snap / D`） | 重放墙钟时间 `ms`（`macOS` / `Win11`） | `3`-OS 步长 `100` 检查点 | 最终 1 小时 `SHA-256`（tick 216,000，所有 `3` 个 OS） |
|---|---:|---:|---:|---:|:---:|---|
| **`HauntedJaunt_1h`**（`169`-B 状态） | `432.0 KB` / **`44.60 KB`** | `36.50 MB` / `5.19 MB` | **`116.28×`**（`84.5×` 原始） | `4.19` / `7.30 ms` | **`2,160 / 2,160`** | `b4120d81a8fb5b6916ef443b2e3ebc59...` |
| **`SurvivalShooter_1h`**（`365`-B 状态） | `432.0 KB` / **`44.60 KB`** | `78.84 MB` / `7.00 MB` | **`156.97×`**（`182.5×` 原始） | `8.32` / `11.02 ms` | **`2,160 / 2,160`** | `6cce1282304dfdc5b623ad5be42357de...` |
| **`TanksQ32_1h`**（`222`-B 状态） | `432.0 KB` / **`44.58 KB`** | `47.95 MB` / `13.03 MB` | **`292.27×`**（`111.0×` 原始） | `3.90` / `4.94 ms` | **`2,160 / 2,160`** | `ca627edaf8cb56532a33ee83997a8487...` |

- **零跨操作系统漂移与正向环境泄漏证伪器**：纯形式重放实现了 **`0 / 6,480`** 个检查点 `SHA-256` 不匹配，跨越 `macOS arm64`、`Linux x86_64` 和 `Windows 11 x86_64`，从 `44.6 KB` 压缩日志中以 `3.9`-`11.0 ms` 重新模拟了 1 小时 `60 Hz` 游戏过程。相反，在 `HauntedJaunt_1h` 上启用四个环境主机泄漏控制中的任意一个（`GE-L1` 墙钟纳秒、`GE-L2` 栈地址熵、`GE-L3` 随机化 `HashMap` 迭代顺序或 `GE-L4` 主机 `f64::sin`），均导致从 $D$ 的重放在 **`t_div = 1`** 处中断，其中 `GE-L4`（`f64::sin`）在 `macOS`（`0d1722cf...`）、`Linux`（`50f9ff25...`）和 `Windows 11`（`54d0f774...`）上产生了三个互不相同的 1 小时摘要。

<div id="69-ge-h9-form-to-godot-472-headless-gdscript-emitter-and-36-task-parity-suite" class="anchor-alias" aria-hidden="true"></div>

### 6.9 `GE-H9`：Form 到 Godot 4.7.2 无头 GDScript 发射器与 36 任务等价测试套件

- **对外部 `GameCraft-Bench` 140 任务存档的客观审计**：直接检查 [`FreedomIntelligence/gamecraft-bench`](https://github.com/FreedomIntelligence/gamecraft-bench) 可确认，所有 `140` 个任务目录遍布 `15` 种 2D 游戏族（包括 `instruction.md`、`tests/rubric.json` 与 oracle `solution/files/`），均可在 GitHub 公共下载。然而，每个任务本质上是开放式自然语言游戏提示，而非正式的状态转换规格；其官方验证器（`gamecraft_bench.verifier`）在 `Xvfb`、`xdotool` 与 `ffmpeg`（`x11grab`）下回放代理生成的 `demo_outputs/*.json` 轨迹，再通过外部多模态 VLM 判官（`GAMECRAFT_BENCH_JUDGE`，在 140 任务代理运行中消耗 `148.5M`-`2.24B` LLM 令牌）对捕获的视频帧进行评分。对端到端 LLM + VLM 视频评分标准的评估会把自然语言合成与 VLM 判官的方差混入编译器正确性之中。

- **确定性 36 任务 Form 到 Godot 4.7.2（`godot --headless`）等价基准**：为直接在 Godot 4 的真实运行时测试 Form 到引擎的发射，`form_to_gdscript.py` 将已批准的 `.rce` Form（通过 `rce emit form` JSON AST，来自 `openIE-dev/rce` 提交 `1762fb4bb65a`）编译为独立的静态类型 **Godot 4 GDScript**（`extends SceneTree`），使用 64 位 `int` 强制转换、`Q32.32` 肢体拆分辅助函数以及事务性的 `fail`/`kept` 状态回滚。针对 **36 项确定性游戏任务**，在 `GameCraft-Bench` 的 `15` 个家族（`Platformer`、`Strategy`、`Tycoon`、`Open-world`、`Roguelike`、`Visual novel`、`Puzzle`、`Shooter`、`Simulation`、`Card game`、`Horror`（含 `horror-signal-lost` 的无线电电池干扰机制）、`Rhythm`、`Idle`、`Racing`、`Sports`）中各选取 `2` 任务，再加上 `6` 项参考与多人系统（`Haunted Jaunt`、`Survival Shooter`、`Tanks Q32.32`、`Inventory/Crafting`、`Quest DAG`、`4-Player Lockstep Arena`），Form 发射的 GDScript 与独立编写的惯用原生 GDScript 实现均在 `Godot Engine v4.7.2.stable.official.ed1daf0bf --headless` 下执行，每任务 `500` 条确定性输入事件（每臂 `18,000` tick = `36,000` Godot VM tick）：

  - **Form 接收（`rce check` + `rce test`）**：**`36 / 36`（`100.0%`）**。
  - **Godot 4.7.2 `--headless` 执行通过率**：Form 发射 **`36 / 36`（`100.0%`）** 对比原生 GDScript **`36 / 36`（`100.0%`）**。
  - **每 tick 与滚动 `SHA-256` 状态追踪等价性**：**`36 / 36` 任务（每 tick `0 / 18,000` `SHA-256` 不匹配）**。

<a id="playable-joule-native-q3232-chrono-budget-arena-livinggame-engines"></a>

<div id="610-playable-joule-native-q3232-chrono-budget-arena-livinggame-engines" class="anchor-alias" aria-hidden="true"></div>

### 6.10 基于焦耳原生 `Q32.32` 的可玩 Chrono-Budget 竞技场（`/living/game-engines/`）

将本研究的精确 `Q32.32` 重放契约与[时间作为索引](/papers/time-as-an-index/)（第 9.2 节）的能量原生时序机制相结合，[`/living/game-engines/`](/living/game-engines/) 的仪器 4 提供了一款可在 JavaScript `BigInt` 中运行的、可玩的 `60 Hz` 确定性轨道导航与拾取防御小游戏（仿真内部 0 次浮点运算）：

- **实时 `SHA-256` 状态磁带与确定性重放**：每个时钟周期更新滚动 `SHA-256` 状态摘要，并将紧凑的 1 字节玩家输入事件记录到 $D$ 中；点击 `Replay & Verify SHA-256` 将从 `(seed, D)` 重新执行整场比赛，并验证按位哈希相等性（`replayed_sha256 === live_sha256`）。
- **焦耳预算时序前瞻与回溯（`est_j` 设计模型）**：查询未来轨迹（`Hellman Branch Preview`，在 `K` 个时钟周期前模拟 `3` 个候选转向分支）或回溯至持久因果检查点时，会从显式微焦耳（`µJ`）电池中扣除费用（每个推测时钟周期的 `step_cost_uj` 加上丢弃非选中未来或回溯时间线时的朗道分支擦除成本），支持通过键盘、鼠标/触控以及 `WebXR` / `Gamepad` 控制器（包括 Meta Quest Browser）进行游玩。

<div id="7-infeasibility-flags" class="anchor-alias" aria-hidden="true"></div>

## 7. 不可行性标记

1. **跨 GPU 与跨 API 的逐位一致硬件渲染：不可行。** 在 `GE-H3` 中，`27 / 28` 个硬件 `GPU × API` 组合的原始 `SHA-256` 发生分歧，其中包括 `2 / 2` 个同一 GPU 上的 `DirectX 12` 与 `Vulkan` 组合。而当 GPU 输出从不回馈至 $S$ 时，有界感知容差（`PSNR >= 64.16 dB`、`SSIM >= 0.99983`、$\Delta_{\max} \le 2$）在 `DirectX 12`、`Metal` 与 `Vulkan` 之间成立。

2. **使用标准浮点设置实现跨平台精确物理：在 `Windows`、`macOS` 与 `Linux` 之间不可行。** 即使*不*使用 `-ffast-math` 或 `/fp:fast`，标准的 `std::sin`/`std::cos` 形式仍会在 `Windows UCRT`、`Apple libSystem` 与 `GNU glibc` 之间形成三方分歧（`t_div = 10` 至 `37`）。默认的 `MSVC /fp:precise` 与 `Clang -ffp-contract=fast` 在 `x86_64` 上于 `t_div = 192` 处分歧。跨指令集的 `FMA`（`x86_64` 与 `arm64`）在 `t_div = 406` 处分歧（`GE-H2`）。`840` 条混沌轨迹证实了 $t^* \propto \ln(\Delta/\delta_0)$，并给出 $\hat{\Lambda} = 1.95$-$5.07\ \text{s}^{-1}$（`GE-H7`）。

3. **仿真内部的 GPU 计算：作为精确计算不可行，仅在使用确定性归约时可行。** 在所引硬件上，其实测开销约为 0.2% 至 7.8%。除非在所有目标上对每条指令加以防护（使用 SPIR-V NoContraction），否则仍会受到编译器收缩（contraction）的影响。

4. **多引擎确定性行为生成：从受检 Form 降级时可行（`GE-H4`、`GE-H8`、`GE-H9`），从无类型、以字符串为键的脚本生成时不可行（`GE-H6`）。** 在 `17` 个游戏行为中（涵盖 `.rce`、Windows 11 C#、Godot 4 GDScript 与 Rust `ECS`），共 `0 / 680` 次不一致；在 `36` 个无头 `Godot 4.7.2` 任务中，共 `0 / 18,000` 次 tick 不一致。Form 投影保持了逐位一致的行为对等性。相比之下，仅解析的动态检查漏检了 `93.85%`（`122 / 130`）的注入跨层与语义故障（`F1 = 0.1159`）。

5. **大规模角色数量下的解释型规则：在封装式解释器中受限（`rce emit python` 中 `N_20ms = 390`），可通过 JIT 或编译投影解决（`GE-H5`）。** 未封装的 `Wasm32`、`C++20 -O3` 与 `Rust -O3` 投影在 `10,000` 个 `Q32.32` 角色上，每 tick 耗时 `0.058`-`0.125 ms`。其 Linux `RAPL` `reported_j`/tick 比 `rce emit python` 低 `3,564×`-`7,728×`，且 `SHA-256` 无漂移。

6. **专有第三方游戏引擎的内部调度器作为无防护的精确宿主：未经验证。** 第 6 节已验证裸机 Windows 11 `PE`（`rustc`、`MSVC` 与 `csc.exe`）、`DirectX 12`（`wgpu`）以及无头 `Godot 4.7.2` `SceneTree` 执行。然而，GameRule 所引 Unity 手册声明，除非由单一确定性调度循环驱动，否则不保证 `MonoBehaviour` 脚本的执行顺序。Unity 与 Unreal 的模板目录均无法读取（其页面为客户端渲染），且未读取任何 Unreal 执行顺序的来源。

<div id="8-sources-and-limits" class="anchor-alias" aria-hidden="true"></div>

## 8. 来源与局限

上文引用的每一项来源都已在所引段落处通读，以下情况除外：GameCraft-Bench 论文（仅读取了摘要、代码仓库 README、任务目录结构以及 `tests/test.sh` 验证脚本）；RCE 的 about 页面（阅读了该摘要页面，并结合 `openIE-dev/rce` 提交 `1762fb4bb65a` 的规范与检查器源代码）；以及 Capcom 的新闻报道（仅阅读了一篇文章）。用于说明遥测层级（`SATB`）和以焦耳为预算的时间性游戏机制的配套本室研究，为 [Time as an Index](/papers/time-as-an-index/) 与 [Satiation Tiered Benchmark Harness](/papers/satb-harness/)（`[same house]`）。以下来源已查阅但未作为证据引用：[Ludii 门户](https://ludii.games/)（将游戏描述为由 ludeme 构成的结构化集合）、Game Grammar 爱好者代码仓库，以及 [PlayCanvas](https://github.com/playcanvas/engine)、[Babylon.js](https://github.com/BabylonJS/Babylon.js) 和 [three.js](https://github.com/mrdoob/three.js) 的 README 文件；这些文件描述的是渲染库，而非游戏描述格式。

未阅读、付费墙阻挡或其他方式不可获取的文献有：T. Schaul, “A Video Game Description Language for Model-based or Interactive Learning,” IEEE CIG 2013, doi:10.1109/CIG.2013.6633610；J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845。M. Ebner 等, “Towards a Video Game Description Language,” doi:10.4230/DFU.Vol6.12191.85，虽为开放获取但本研究未阅读。

在所有九个经验套件（`GE-H1` 至 `GE-H9`）中，`measured_j = None` 且 `board_metered = false` 在全部六台主机上（严格分离 macOS `L3` 每进程 `ri_energy_nj`、Linux `L2` 套接字/核心 `RAPL` `reported_j` 以及 Windows 11 `L3` `GetProcessTimes`/`QueryProcessCycleTime` 活动计数器，并将 Chrono-Budget Arena 的 `est_j` 机制保持为严格解析）。两个故意的静态限制仍被记录：在 `GE-H6` 中，未带标签的裸 `i64` 标量（无单位或坐标空间新类型结构体）导致了 `2 / 130` 个假阴性；而在 `GE-H9` 中，未运行官方 `GameCraft-Bench` VLM 判断的视觉评分（超过 `140` 个自然语言提示），因为它评估的是开放式 LLM 资产/项目合成及外部 VLM 量规评分，而非确定性的 Form 到引擎的行为编译。
