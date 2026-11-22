---
title: "计量提交门：智能体系统的能量至正确完成度量"
deck: "一种仅在检查通过后才允许智能体行动的门控机制、一种优先尝试最低成本方法的级联策略，以及两者的能量测量结果，并按各自获取方式加以标注。"
lang: "zh-Hans"
source: "gates"
complete: true
---

<div id="notational-intelligence-as-commit-law" class="anchor-alias" aria-hidden="true"></div>
<div id="metered-commit-gates-energy-to-correct-completion-for-agentic-systems" class="anchor-alias" aria-hidden="true"></div>

*修订版 db13599，2026 年 11 月 5 日。数据与代码：[research.openie.dev/data/](/data/#gates)。LaTeX PDF：[/pdfs/latex/gates.pdf](/pdfs/latex/gates.pdf)（[来源](/pdfs/latex/gates.tex)）。

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概述

本文定义了一种门控机制，使机器仅在检查通过后才执行操作，并提出一种先尝试成本最低方法的规则。文中报告了软件实验结果以及一次板级能耗测量，每项结果均标注了获取方式。

**用平常话说**

1. 计算机在简单检查确认安全之前，不应执行不可撤销的操作。
2. 应首先尝试成本最低的完成任务方式，只有在没有更便宜的方案时才使用大型 AI 模型。
3. 每一次决策都记录其能耗，以便后续任何人核查。

本文包含两部分，共用一条规则：正确性是门，焦耳是排序依据。第一部分是提交门。提案不得自行授权。不可逆操作仅在证书后执行，且每一次提交或拒绝都写入收据。第二部分是限制混合：任务需要最小的期望能量才能结束，任务完成后所消耗的能量不产生已验证的进展。其标准实例是一个级联流程，先尝试成本最低的方式：Lookup、Formula、Solver、Model。级联在任务完成谓词 $C(z)$ 成立时立即停止；若下一步会超出预算，则以收据形式拒绝。在所有正确完成任务的系统中，所需焦耳更少的排名更高。

一次板级测量为门控结构提供了基准。在 AMD Kria KV260 上，板载 INA260 读取到的 SOM 级别 A/B/A 差异为每个门控周期 11,428 pJ（标准误差 129 pJ，N = 4），对应 WCA 门控结构；种子结构每个种子周期为 98.0 pJ（标准误差 30.8 pJ，N = 4）。INA260 位于 `VCC_SOM`，该电源为处理系统、可编程逻辑、DDR 内存以及模块调节器供电（[KV260 设备树，`ina260@40`](https://gbmc.googlesource.com/linux/+/ccd1cdca5cd433c8a5dff78b69a79b31d9b77ee1/arch/arm64/boot/dts/xilinx/zynqmp-sck-kv-g-revB.dtso)），因此这些是整模块的差异，而非核心轨或仅 PL 的数值（见 Section I.3.7）。Section I.4.9 表中的种子结构差异为 +0.0098 W（标准误差 0.0031 W），即 9.8 mW，等同于约 100 MHz 时每个种子周期的 98.0 pJ。按本比较所用的 5 V 电源计算，电流为 1.96 mA，接近器件 1.25 mA 的电流分辨率，且该差异被报告为不确定，直至使用 PL 轨电表并进行至少 10 次测量。

<div id="01-contributions" class="anchor-alias" aria-hidden="true"></div>

### 0.1 贡献

1. 一个提交信封：提案、随后是证书、然后是提交或拒绝、再随后是收据。证书是合取式的：查找允许 AND 一个能量谓词，可选地 AND 一个控制屏障函数。拒绝原因是带类型的。Rust 软件参考实现 Wise Computer Automation（WCA）运行它（第 I 部分）。
2. 一个带类型的来源不变式。标记为 `ModelGenerated` 的输出永不可提升为 `Deterministic`（第 I 部分和第 II 部分）。
3. 一个带命名拒绝的级联，以及在期望焦耳下最便宜优先是最优的条件，该条件来源于 Simon 与 Kadane 对顺序搜索的排序结果：按 $p_i / c_i$ 降序尝试齿轮，其中 $p_i$ 是齿轮 $i$ 完成任务的概率，$c_i$ 是其期望能量（焦耳）（Simon 与 Kadane，1975）（第 II 部分）。
4. 将完成纠正的能量作为排序，定义见第 0.2 节。
5. 收据作为一种工具。每张收据保存行为前的预测哈希及其时间戳、结果、匹配、按层级划分的焦耳（测量、报告、估计、从不求和）以及拒绝原因。

<div id="02-energy-to-correct-completion" class="anchor-alias" aria-hidden="true"></div>

### 0.2 能量至正确完成

设 $C(z)$ 为任务完成谓词，其中写入任何截止时间。对于具有策略 $\pi$ 且允许失效率为 $\delta$ 的系统 $S$，

$$
J^*(S) = \min_{\pi} \; \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta .
$$

正确性和截止时间是约束条件。在通过门限的系统中，仅凭焦耳值对它们进行排序。按照实数 $J^*$ 对系统进行排序形成全序预序，因为任意两个实数都可比较。如果每次读取的计量误差最多为 $\epsilon$ 焦耳，则两系统的 $J^*$ 差异大于 $2\epsilon$ 时仍保持其顺序。MLPerf Power 在每个功率结果后面都附加一个准确性目标。$J^*$ 具有相同的形式。

<div id="03-how-to-read-this-paper" class="anchor-alias" aria-hidden="true"></div>

### 0.3 如何阅读本文

章节 I 部分的章节编号为 I.n，章节 II 部分的章节编号为 II.n。每个部分都有各自的参考文献列表。两幅图阐述了主要思想：图 1（第 I.1 节）绘制了提交门，图 2（第 II.1 节）绘制了极限混合的底部和平台。本文不讨论价格和需求。

<div id="part-i" class="anchor-alias" aria-hidden="true"></div>
<div id="part-i-the-commit-gate" class="anchor-alias" aria-hidden="true"></div>

## 第 I 部分. 提交门

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="i-abstract" class="anchor-alias" aria-hidden="true"></div>

## I. 摘要

代理提出动作。只有在允许动作运行时才会开始不可逆工作。本文将该许可步骤视为一个形式对象。Linus Lee 的记号智能是指符号的变化可以使某些思考变得廉价而其他思考可表达。此处的主张更为狭窄。对于能够移动物质或调用不可逆工具的机器，有用的记号是一条运行时规则：提案不得自行授权。软件参考 Wise Computer Automation (WCA) 将该规则记录为 schema `wca.commit.v1` 下的四个对象：提案、证书、类型化拒绝原因和提交决定。参考中使用的证书是合取式的。查找表 (LUT) 允许位必须为真，能量谓词必须为真。可选的控制屏障函数 (CBF) 可以添加。只读调用可以绕过门禁。不可逆调用则不行。

本文中的能量数值是操作计数与分析能量常数的乘积（OpCounter 模型），而非板级功率。现场可编程门阵列 (FPGA) 行为在此分为三类。Icarus Verilog 仿真检查所生成的寄存器传输逻辑。Alchitry Pt V2 运行闭环门，并在每一次决策上与软件保持一致。它没有计量仪表，因此其能量未计量。AMD Kria KV260 在其板载 INA260 功率监视器下运行门阵列。对同一比特流进行停止‑运行‑停止的交替 A/B/A 操作，在 25 MHz 下对 LUT 允许位、能量谓词和屏障的八路并行评估，得到每个门周期 11,428 pJ 的板级计量差异（标准误差 129 pJ，N = 4）。较小的种子阵列在每个种子周期产生 98.0 pJ（标准误差 30.8 pJ，N = 4）。这些是 `measured_j` 在板级的测量值。它们不是核心轨道读取，也不是闭环植物的焦耳成本（第 I.3.7 节）。Stage B 作为浏览器仪器可在 https://research.openie.dev/living/fpga-sim/ 访问。它将相同的 Rust 门编译为 WebAssembly (WASM)，并通过 WebGPU API 显示 LUT 状态和提交追踪。该仪器是仿真，并非受测设备 (DUT) 测量，也不是 Alchitry 板的功率。

测得的软件结果有界。在一次 16 步的摆动情景（种子 1）中，参考提交 1 步并拒绝 15 步。该情景的分析能量为 8.6795e-10 焦耳。在报告的 Safe 定点端口-哈密顿检查中，对连续能量预言 `Vdot <= epsilon` 的错误允许在所述网格上为 0，且在 209,261 次决策中出现 79 次错误拒绝（第 I.4.3 节）。这就是该测试集上的安全性与活性配对（第 I.4.10 节）。Model Context Protocol (MCP) 演示在不调用执行器的情况下拒绝不可逆工具调用。一个带能量集合屏障和离散盾牌的玩具比较显示在安全定义上存在分歧。这些结果均不宣称硅能量领先、工业控制性能或核心轨道测量。

<div id="notation" class="anchor-alias" aria-hidden="true"></div>
<div id="i-notation" class="anchor-alias" aria-hidden="true"></div>

## I. 记号与术语

术语在首次科学使用时定义，并在此处汇总，以便后续章节使用简写。

| 术语 | 本文中的定义 |
|------|--------------------------|
| 符号智能 | Lee 的主张：更好的记号能够提升个人或系统的可靠能力，超出仅添加工具的效果。 |
| 提交门 | 在运行时的规则，要么应用提议的动作，要么拒绝它。提议者没有第二条非正式渠道。 |
| 智能计算机自动化 (WCA) | 实现提交门的软体参考，位于提议与不可逆效果之间的边界。 |
| 能源优先架构 (EFA) | 设计选择：将能源谓词放入权限记录中，而不仅在后续报告中出现。 |
| 提议 | 候选动作 `u`、状态以及可选的分析能源提示。它不能提交。 |
| 证书 | 门记录：LUT 允许、能源谓词、可选 CBF 谓词、原因和度量。 |
| 拒绝原因 | 类型化代码，如 `lut_veto`、`energy_veto`、`cbf_veto`、`budget_exceeded` 或 `policy`。 |
| 提交决定 | 将植物动作设为 `u` 或设为零的封装。 |
| 查找表 (LUT) | 从紧凑代码到允许或拒绝的离散映射。 |
| 三元查找矩阵乘法器 (TLMM) | 参考的廉价三元表查找提议路径。 |
| 控制障碍函数 (CBF) | 当其不等式成立时的集合不变性证书（Ames et al., 2019）。 |
| 模型上下文协议 (MCP) | 工具调用传输。在本文中它是被测试的适配器，而非植物证书。 |
| 系统一 | 类型化决策过程（Laya / Jev 类），在软件中于已知选项间进行选择。它们是提议者。 |
| 端口-哈密顿 | 用于对玩具植物进行被动式检查的结构化能源模型。 |
| 运行时验证 (RV) | 在执行轨迹上检查属性。与提交记录相关但不相同。 |
| 被测设备 (DUT) | 在声明的工作负载和计量器下测量的硬件。第 I.3.7 节的 KV260 运行是本文唯一的 DUT 测量。 |
| 现场可编程门阵列 (FPGA) | 可重构逻辑。本文报告了 Verilog 仿真、使用未计量能源的 Alchitry Pt V2 编程（SRAM 加载）以及板级 KV260 计量读数（第 I.3.7 节）。 |
| WebAssembly (WASM) | 浏览器的可移植编译目标。Stage B WASM FPGA 仿真器可在 https://research.openie.dev/living/fpga-sim/ 获取。 |
| WebGPU | 该仿真器的显示和网格评估路径所使用的浏览器 GPU API。 |
| Alchitry Pt V2 | 厂商文档标识为 Xilinx Artix-7 XC7A100T。FPGA 已编程（SRAM 加载）闭环提交门；能源未计量（第 I.3.7 节）。 |
| DiffLogic | 可微分逻辑门网络，训练以逼近布尔结构（Petersen et al., 2022）。 |
| 分析能源估计 | `J = sum_op count_op * E_op`，使用具名常数。非板级功率。 |
| 建模值 | 由给定公式或拟合结构所得的量。 |
| 仿真值 | 通过执行软件或 Verilog 模型所得的量。 |
| 板级实测值 | 来自特定设备与负载上仪表的量。仅 KV260 的 NI-9 读数属于此类。 |
| Oracle 安全 | 与连续能量 oracle `Vdot <= epsilon` 在给定被控对象上的一致性。 |
| Check 安全 | 在门电路中近似该 oracle 的离散安全不动点 / Q16.16 残差。 |
| Set 安全 | 在屏障或屏蔽谓词（例如能量集 CBF）下的集合不变性，可能与 oracle 安全不一致。 |

<div id="terms-used-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i-terms-used-here" class="anchor-alias" aria-hidden="true"></div>

### I. 本文使用的术语

本文已区分三类安全谓词。**Oracle-safe** 指连续 `Vdot <= epsilon` 的 oracle。**Check-safe** 指在门内跟踪该 oracle 的离散 Safe Q16.16 残差。**Set-safe** 指在屏障或护盾下的集合不变性。NI-4 表明 check-safe 与 set-safe 可能不一致。软件参考是生成此处所有仿真结果的 Rust 实现。证据类别在记号表中定义：modeled、simulated、board-measured。页面标志 `board_metered` 为 true，仅因 KV260 读取。

**分析常数。** `E_LUT_READ = 1e-12` J 以及第 I.3.4 节中的其他 OpCounter 常数是用于模型内部相对比较的工程替代值。它们不是经过校准的板上测量值。不要将其视为硅片焦耳。针对命名 oracle 的 zero-false-allows 计数保持原报告值。

**活体图。** 提交栈：[/living/ni/#ni-diag-02](/living/ni/#ni-diag-02)。Seed-1 运行器：[/living/ni/#ni-run-01](/living/ni/#ni-run-01)。Safe false-allow=0：[/living/ni/#ni-run-02](/living/ni/#ni-run-02)。Stage B 仿真器：[/living/fpga-sim/](/living/fpga-sim/)。

**Part I 的范围。** 第 I.2 节将提交记录置于记号研究、信息论、尺度结果、LUT 网络、控制证书和运行时强制的背景下。第 I.3 节定义对象、被控对象、分析能量模型、浏览器仪器以及板卡。第 I.4 节仅报告由软件参考、板卡或引用的外部来源产生的量。第 I.5 节回答已有出版形式的异议。第 I.6 节说明哪些情况会否定声明以及哪些未被测量。

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>
<div id="i1-introduction" class="anchor-alias" aria-hidden="true"></div>

## I.1. 引言

语言模型可以对动作进行排序。排序并不等同于授权。对工厂、外壳、支付或破坏性实验步骤而言，重要的失效模式是提交：动作实际执行。软分数在上游仍有用，但在不可逆分支上属于错误类型，因为概率既未指明哪个谓词失效，也未将执行器命令强制为零。

Lee（2022）清晰地阐述了先前的主张。记号并非装饰。能够使操作可执行的记号会改变哪些错误可以被记录，哪些可以被隐藏。Iverson（1980）对数组语言提出了相同的观点：记号是思考的工具。Engelbart（1962）将语言、人工制品、方法和培训视为一个系统。Kay（1972）和 Victor（2013；2012 讲座）主张表示应将后果保持在被编辑的概念附近。Matuschak 与 Nielsen 询问为何思考工具会在作为产品时停滞。该文献涉及认知与媒介，但本身并未规定机器在移动前必须遵守的记录。

近期人工智能的工业中心是规模。Kaplan 等（2020）和 Hoffmann 等（2022）报告了参数、数据和计算的损失尺度关系。Hooker（2021）认为思想在符合可用硬件和内核时才会传播。这些结果描述了提议者的能力如何随投入资源而增长，却未定义提交谓词。

本文的贡献是该谓词的软件参考实现，以及在玩具工厂上的实际表现报告。贡献是组合性的。布尔 LUT 保护、能量证书、三元表查找和工具传输在先前工作中已有实现。参考实现将它们串联为一个可审计的决策：提议、随后证书、然后类型化的拒绝或提交。本文的主张是该参考实现的存在及其行为，而非优先级。

三条测量声明约束所有后续数值。第一，OpCounter 计算的焦耳为分析估计。第二，Verilog 结果为仿真。第三，唯一的板级焦耳是第 I.3.7 节中 KV260 板级差异，记录为 `measured_j` 并标明仪表名称。板级结果标志仅在这些 KV260 运行时为真。Pt V2 未计量。读者应能够根据数值附带的方法条款区分建模、仿真和板级测量。

图 1 绘制了提交门。

![Flow diagram: propose, then certify against the predicate and certificate, then either commit an act on the world or refuse with no act. Both outcomes write a receipt with a hash, joules and a reason.](/figures/gates/commit-gate.svg)

*图 1. 提交门。提议、认证、提交或拒绝以及收据的示意图，定义于第 I.3 节。提供了一个 [PNG copy](/figures/gates/commit-gate.png)。*

<div id="i2-related-work" class="anchor-alias" aria-hidden="true"></div>

## I.2. 相关工作

<div id="21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>
<div id="i21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>

### I.2.1 记号与思维工具

Lee（2022）认为发明记号可能比发明额外的自动化工具更重要，因为记号会改变那些廉价的思考方式。与 The Gradient 的访谈记录与该论文观点一致，且并非独立的实证结果。Iverson（1980）在图灵奖演讲中给出了经典的计算机科学论断：记号是思维的工具，可执行性是检验的一部分。Engelbart（1962）将智能定位于人类与人工制品的系统，而非单纯的大脑。Kay（1972）提出了个人动态媒介的概念。Victor 的《Media for Thinking the Unthinkable》和《Inventing on Principle》主张创作者需要在想法尚在形成时即可看到其后果的表征。Matuschak 与 Nielsen 在《How can we develop transformative tools for thought?》中记录了此类工具的采纳情况以及制度性失效模式。

本文沿用上述脉络进行一次有限的推理。如果记号是可执行的，则一些失败会成为普通数据，而非未被表征的偶然。一个带类型的拒绝原因即是一个实例。这并不支持强 Sapir‑Whorf 命题：：语言决定思维。强命题在第 I.5 节被否定。弱命题，即 Iverson 所述的观点，是可执行记号会改变操作成本以及错误的可表征性。

Chollet（2019）将智能定义为技能获取效率，并将该定义基于算法信息论。该定义关注的是学习新技能，而非提交行为。

<div id="22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>
<div id="i22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### I.2.2 信息、描述长度与物理代价

Shannon（1948）定义了熵和信道容量。Shannon（1959）定义了率失真：在给定保真度下需要多少描述。Kolmogorov（1965）通过程序大小定义描述长度。Solomonoff（1964）通过对程序的混合定义归纳推理。Chaitin（1977）发展了程序大小复杂度。Cover 和 Thomas（2006）是教材的主干。Jaynes（1957）在约束下使用最大熵作为分布的规则。Brillouin（1956）在 Maxwell 恶魔的论述中将信息与物理负熵联系起来。

语言模型的交叉熵训练是对数据分布的 信息论 目标。Sutskever 2023 年在 Simons Institute 的演讲（该演讲不是论文）讨论了无监督学习即压缩。该事实并未为特定字符串提供 Kolmogorov 证书，也未产生提交位。对训练分布的统计压缩并非在植物约束下的运行时允许集合。

Landauer（1961）证明了下界：在理想模型中，逻辑不可逆擦除每比特至少耗散 `kT ln 2`。Bennett（1973）表明逻辑可逆计算在极限情况下可以避免该擦除成本。Horowitz（2014）报告了 CMOS 在操作和存储移动上的实际能耗在皮焦耳量级，远高于 Landauer 界限，并将能量而非晶体管数量视为约束。Mead（1990）提出了模拟效率的神经形态论证。Sandberg（2016）警告说，约 20 瓦的脑功率并不能界定从零开始训练的工程系统的能耗。一个关于皮层划分的预印本（arXiv:2102.06273）进一步警示不要将所有生物功率等同于可比的计算。本论文使用 Landauer 和 Horowitz 作为界限并列出实践表格。它并未声称参考中的任何模型接近 `kT ln 2`。

<div id="23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-and-hardware-fit" class="anchor-alias" aria-hidden="true"></div>

### I.2.3 规模与硬件适配

Hestness 等（2017）、Kaplan 等（2020）和 Hoffmann 等（2022）记录了深度学习损失的经验尺度。Amodei 和 Hernandez（2018）在 OpenAI 博客中描述了里程碑成果的训练算力的快速增长。该页面是一篇供应商随笔。本文并不依赖于其中的具体倍增时间。Sutton（2019）认为，使用计算的一般方法已经超越了将人类知识内容编码为固定特征的系统。该随笔并非对所有约束的反驳。提交谓词是对行为的约束，而非手工构建的棋类特征。Hooker（2021）解释了为何在已装配的芯片和库奖励密集矩阵乘法时，替代方案会失利。

本文按纠正完成所需的焦耳数进行排序，并将提案成本与许可成本分离。价格在两者中均不作为术语。

<div id="24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>
<div id="i24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>

### I.2.4 LUT 网络、三值查找与可微逻辑

Umuroglu 等人（2020）将稀疏低位网络映射到 FPGA 真值表（LogicNets）。Petersen 等人（2022）使用可微分松弛训练逻辑门网络（DiffLogic）。Bacellar 等人（2024）训练无权 LUT 网络（可微分无权神经网络）。Ma 等人（2024）研究三值权重语言模型（BitNet b1.58）。Wei 等人（2024）在 CPU 上通过表查找实现低位矩阵乘法（T-MAC）。TeLLMe 系列（arXiv:2504.16266）是一种面向 FPGA 执行的三值 LUT 矩阵乘法设计。这些系统表明表和门是真正的计算基底。但在所引用的论文中，它们并未在工具执行器上附加端口-哈密顿能量否决和类型化提交信封。

该参考文献将 DiffLogic 用作玩具特征上的薄允许表，并将 TLMM 作为提案路径。这与将逻辑网络用作整个分类器的工作不同，后者是常规 DiffLogic 评估的对象（视觉基准，大规模门计数）。第 I.6 节记录了容量差距。

<div id="25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>
<div id="i25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>

### I.2.5 证书、屏障与运行时监控

Ames 等人（2019）将控制屏障函数概述为集合不变性证书，通常通过滤波器或二次规划强制实现。Alshiekh 等人（2018 预印本 arXiv:1708.08611）引入盾牌，将不安全动作替换为安全动作，尽可能保持最小干预。Dawson、Gao 和 Fan（2022）综述了学习的 Lyapunov 与屏障证书以及将神经网络视为证书而不进行检查的失效模式。Manek 和 Kolter（2020）学习具有 Lyapunov 结构的稳定动力学。Greydanus、Dzamba 和 Yosinski（2019）学习 Hamiltonian 神经网络。Roth 等人（2025）研究稳定的端口-Hamiltonian 神经网络。Yu、Zikelic 和 Henzinger（2024）使用运行时监视器修复神经证书。Leung 和 Paré（arXiv:2512.24493）为具有学习能量函数的端口-Hamiltonian 系统提供贝叶斯安全保证。他们的能量是植物的物理 Hamiltonian，而非计算能量。该参考文献的 Safe path 使用相同的物理意义的能量。计算的焦耳是另一个账户（第 I.3.4 节）。Sanchez 等人（2018）综述了运行时验证分类法。

**门是 Simplex。** Sha 的 Simplex 架构在未验证的高性能控制器旁运行一个已验证的安全控制器，决策模块在植物离开其可恢复区域之前将控制权交给安全控制器（Sha 2001）。“提案可能无法自行授权”是该规则，从控制回路延伸到工具调用和执行器。运行时保证是其在航空电子和机器人领域的名称。三个较早的结果固定了其余形状。Saltzer 和 Schroeder 命名了完整中介：每次访问都要检查权限（1975）。参考监视器是执行检查的机制。Gray 的两阶段提交将准备与提交分离，使得没有参与者单独提交（1978）。Necula 的证明携带代码在未受信代码运行前由主机检查（1997）。此处的提交记录是位于不可逆效果前的参考监视器，配有 Simplex 开关以拒绝以及主机检查的证书，类似于证明携带代码。该参考文献在该血统上添加了一个合取和一个账本：证书内部的能量谓词，以及与决策同记录的焦耳。

该参考文献并未取代这些数学。Safe path 是对已知能量恒等式在摆上的保守不动点测试，`V = (1/2)(g theta^2 + omega^2)`，其导数 `Vdot = omega * u`。玩具对决中使用的 CBF 是对相同 `V` 的能量集合不等式，而非声称已在机械手上求解 Ames 二次规划。卡车-杆上的学习 Lyapunov 结构是第二个玩具，报告于第 I.4 节，并非任意植物的吸引域定理。

<div id="26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>
<div id="i26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>

### I.2.6 世界模型、类型化决策与工具传输

Ha 和 Schmidhuber（2018）以及 Hafner 等人（DreamerV3，arXiv:2301.04104）表明，学习得到的模型可以从想象的轨迹中提出动作。LeCun 的 JEPA 论文（Meta research blog）主张使用预测性世界模型。LeCun 等人（2006）是更早的基于能量的学习教程。预测误差在这些系统中并非严格为零。预测器可以位于门的上游。除非其预测是完美的且植物模型本身就是植物，否则它不能取代该门。本文并未在预测基准上与这些系统竞争。

System One 模型在一次前向传播中返回每个允许选项的类型化答案和概率，且不产生自由形式文本。TypeSafe AI 将该类别命名为其托管的 Jev 模型（2026 年 9 月 15 日）。随后出现了开放模型，其中包括 Convai Innovations 的 Laya，一种带有决策头的编码器。当选项集合是类型化且已知时，它们会降低生成成本。Anthropic 的 Model Context Protocol 公告规定了工具的发现和传输。传输会发送一次调用。它不评估 `Vdot`。在参考文献的 MCP 适配器中，不可逆工具在执行器运行前需要证书。这是关于该适配器的工程声明，由第 I.4 节的演示进行测试，而非对所有生产环境中的 MCP 服务器的声明。

<div id="27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>
<div id="i27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>

### I.2.7 组合所带来的增益

屏蔽机制可拒绝不安全的动作，但在所引文献中，并未以参考文献所述的四字段提交记录形式导出，也不包含分析性焦耳账户。DiffLogic 与 LUT 网络用于计算函数，在上述文献中，它们并非置于独立提议器与工具执行器之前的否决机制。能量感知屏障滤波器是连续的，而参考文献中的允许位是一张表。组合性主张在于其连接方式：LUT 允许位、能量谓词与可选屏障三者相与，以带类型的原因加以记录，在不可逆效应发生之前施加，且分析性能量与板级功耗保持明确区分。第 I.4 节说明了上述连接方式中哪些部分已被执行。

<div id="28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-2025-to-2026" class="anchor-alias" aria-hidden="true"></div>

### I.2.8 认证与提交对等体（2025 至 2026 年）

最近的多个系统在不可逆工具运行之前强制做出决策。

Shi 等人，**Progent**（arXiv:[2504.11703](https://arxiv.org/abs/2504.11703)），在每次工具调用时检查符号最小特权规则，并使用 SMT 求解器使特权只能在未经批准的情况下收窄（单调约束）。Chen、Kang 和 Li，**ShieldAgent**（ICML 2025；[proceedings.mlr.press/v267/chen25ae.html](https://proceedings.mlr.press/v267/chen25ae.html)），在屏蔽之前对代理行为轨迹强制可验证的安全策略电路。Yu、Žikelić 和 Henzinger（AAAI 2025；[doi:10.1609/aaai.v39i25.34840](https://doi.org/10.1609/aaai.v39i25.34840)）通过运行时监控修复神经证书。伴随的工作在线上对 ReLU 控制屏障证书进行前瞻区域验证（arXiv:[2507.11987](https://arxiv.org/abs/2507.11987)）。

**What Part I adds.** 这些同行工作分别是策略、屏蔽或证书修复对象。本文献提供了一个四字段提交信封（`proposal` → `certificate` → `commit|refuse` → receipt），其中包含一个合取 LUT 允许位和能量谓词、类型化的拒绝原因，以及与板级功率区分开的分析焦耳。传输层（MCP）仍然是 proposal。板级焦耳仅在第 I.3.7 节的 KV260 运行中出现，位于板级。

<div id="i29-runtime-enforcement" class="anchor-alias" aria-hidden="true"></div>

### I.2.9 运行时强制执行

该门控装置是一种安全自动机。Schneider 证明了执行监控器恰好能够强制执行安全属性 [Schneider 2000](https://doi.org/10.1145/353323.353382)，Ligatti、Bauer 与 Walker 将监控器扩展为可抑制或插入动作的编辑自动机 [Ligatti et al. 2005](https://doi.org/10.1007/s10207-004-0046-8)。Falcone 阐明了何时应强制执行而非仅作验证 [Falcone 2010](https://doi.org/10.1007/978-3-642-16612-9_9)，Bauer、Leucker 与 Schallhart 为运行时判决赋予了三个取值 [Bauer et al. 2011](https://doi.org/10.1145/2000799.2000800)，分别对应允许、拒绝与 `settle_refuse`。本文在上述研究脉络中的贡献在于：在证书与收据中引入了能量谓词。2024 年至 2026 年间的智能体守卫具有相同的结构形式，即对拟议工具调用及其效果之间进行检查：GuardAgent [arXiv:2406.09187](https://arxiv.org/abs/2406.09187) 与 AgentSpec [arXiv:2503.18666](https://arxiv.org/abs/2503.18666)。PolicyGuide 指出，对每个动作逐一进行检查无法引导多步骤工作流 [arXiv:2608.19861](https://arxiv.org/abs/2608.19861)；正因如此，第二部分将停止条件置于任务谓词 $C(z)$ 之上，而非单一动作之上。多步骤不可逆操作还需要补偿机制，此由 saga 事务提供 [Garcia-Molina and Salem 1987](https://doi.org/10.1145/38713.38742)；而"提案不得自我授权"则是引用监控器原则，seL4 等能力内核通过形式化证明对其加以强制执行 [Klein et al. 2009](https://doi.org/10.1145/1629575.1629596)。第 I.4 节中的零误允扫描是对网格的测试，而非证明；第 I.6 节明确说明了这一局限，该局限适用于对上述结果的一切概括性陈述。

<div id="i210-reference-points-for-the-board-figure" class="anchor-alias" aria-hidden="true"></div>

### I.2.10 板级图的参考基准

FPGA 实现某一功能所消耗的能量预计高于 ASIC；Kuon 与 Rose 测量了动态功耗差距 [Kuon and Rose 2007](https://doi.org/10.1109/TCAD.2006.884574)，Horowitz 给出了用于框定此类数据的 CMOS 每次操作能耗 [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323)。针对同一比特流的厂商功耗估算值与 SOM 读数并列，作为 PL 电源轨协议的组成部分。

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>
<div id="i3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## I.3. 定义与方法

<div id="31-objects" class="anchor-alias" aria-hidden="true"></div>
<div id="i31-objects" class="anchor-alias" aria-hidden="true"></div>

### I.3.1 对象

固定状态 `x` 与候选动作集 `U` 中的候选动作 `u`，提案为如下元组

```text
Proposal = (u, x, hints)
```

`hints` 可包含解析能量量。提案不具有许可的语义。

证书为如下元组

```text
Certificate = (lut_allow, energy_ok, cbf_ok, reasons, metrics)
```

`lut_allow` 与 `energy_ok` 为布尔值。`cbf_ok` 在所选组合模式要求时为布尔值，否则缺省。`reasons` 为拒绝原因列表。`metrics` 包含解析能量账目及板级结果标志。

模式 README 中的组合模式为：

```text
lut_and_energy        : commit <=> lut_allow AND energy_ok
lut_and_safe          : commit <=> lut_allow AND safe_energy_ok
lut_and_safe_and_cbf  : commit <=> lut_allow AND safe_energy_ok AND cbf_ok
```

消融模式 `energy_only` 与 `lut_only` 的存在是为了在对比实验中可移除其中一个合取项，它们并非不可逆工具的默认模式。

提交决策为

```text
if commit then plant_action = u else plant_action = 0
```

并附有证书。不可逆工具的执行器仅在第一分支中被调用。

示例记录。文件 `artifacts/schemas/wca.commit.v1/examples/commit_decision_refuse.json` 存储了一条拒绝记录，其中 `lut_allow` 为真而 `energy_ok` 为假，原因码为 `energy_veto`，不动点详情字符串为 `Vdot_q=1461 > eps_q=13`，`plant_action` 为 `[0.0]`，该记录将板级结果标志置为假。单个合取项为真不触发提交。

<div id="32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>
<div id="i32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>

### I.3.2 被控对象与预言机

主要被控对象为摆。安全检查所使用的连续参考量为 `g = 9.81`、`epsilon = 0.05`、`V = (1/2)(g theta^2 + omega^2)` 以及 `Vdot = omega * u`。连续预言机中的 `energy_ok` 表示 `Vdot <= epsilon`。

遗留离散检查采用 Q8.8 定点近似，在仿真中与 Verilog 模块 `wca_ph_energy.v` 逐位匹配。安全检查（`SafeFixedPointPHCertificate`）采用 Q16.16 格式及精确整数余量。所报告的谓词为

```text
energy_ok <=> 4*omega_q*u_q + 2*(abs(omega_q)+abs(u_q)) + 1
              <= floor(4*epsilon*S^2)
```

舍入论证见 `artifacts/RESULTS.md`：在最近舍入且误差不超过半个最低有效位的条件下，`Vdot` 的上界为 `(prod + (1/2) abs + 1/4) / S^2`。设计目标为单侧方向：若安全谓词允许，则连续预言机亦允许；反之不作要求。额外的拒绝是可量化的代价，而非对安全方向的矛盾。

第二个被控对象为倒立摆小车，仅用于已学习 Lyapunov 函数的仿真。状态为 `[x, xdot, theta, thetadot]`，参数取 `g = 9.81`，小车质量 1.0，摆杆质量 0.1，摆长 0.5。`V` 为二次型 `xi^T P xi / 2`，其中 `P` 通过 Cholesky 分解加单位矩阵倍数的方式保证正定性。拟合过程采用线性策略下 `Vdot + alpha V` 铰链损失的随机梯度法，随机种子为 42，迭代 400 次，批大小 32，`alpha = 0.15`，详见 `RESULTS.md`。连续门限条件为 `Vdot <= 0.05`。安全离散规则在此基础上叠加 Lipschitz 余量乘以半个最低有效位。本结果仅为单一拟合二次型在单一区域上的仿真验证，不构成对其他被控对象的证明。

<div id="33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>
<div id="i33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>

### I.3.3 LUT 允许路径与提案路径

所报告实验中的允许查找表（allow LUT）是以掩码 `21887` 对四个特征（绝对 theta、绝对 omega、绝对 `u` 及一个能量位）进行 DiffLogic 导出所得，除非某节另有说明。TLMM 是一种用作提议器的分组三值表查找方法。等正确性（Iso-correctness）是指与朴素三值矩阵乘积在绝对容差 1e-12 范围内的一致性，`RESULTS.md` 将其记录为软件层面的测量结果。规模行为是指 `wca-tlmm-scale` 在给定解析前向预算下所输出的内容。结果部分所讨论的默认预算为每次前向传播 2e-10 焦耳，属于解析预算，而非电气预算。

<div id="34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>
<div id="i34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>

### I.3.4 解析能量模型

`RESULTS.md` 将两类事实分开处理。操作计数在 OpCounter 中是精确值。焦耳数等于计数乘以常数：

| 常数 | 值（焦耳） | 作用 |
|----------|----------------|------|
| `E_LUT_READ` | 1e-12 | LUT 读取 |
| `E_BRAM_WORD` | 1e-11 | BRAM 字 |
| `E_BITMASK_OP` | 5e-14 | 位掩码操作 |
| `E_ADD` | 5e-13 | 加法 |
| `E_PACK` | 2e-13 | 打包 |
| `E_COMMIT_BASE` | 2e-11 | 提交开销 |
| `E_REFUSE_OVERHEAD` | 5e-12 | 拒绝开销 |

`J = sum count_op * E_op`。这些常数是工程替代值，并非实测数据。结构计数器（如共享 BRAM 命中次数）会被记录，但除非其改变了已计数的读取操作，否则不计入费用。修改某一常数将等比例重新缩放所有分析焦耳值。正因如此，这些数值不能与供应商的每焦耳令牌数、MLPerf Tiny 能耗数据或轨道测量值进行比较，只能在同一模型内部的不同模式之间相互比较。

内部表格中的效用指标为提交次数。提交次数并非任务奖励。提交次数更多的策略可能在每焦耳效用上得分更高，同时却违反能量预言机的约束。因此，第 I.4 节不将每焦耳效用视为安全指标。

<div id="35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>
<div id="i35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>

### I.3.5 工具适配器

`wca-mcp-gate` 对工具进行分类。只读工具可在无提交记录的情况下执行。未知工具被视为不可逆工具。不可逆工具需要在已配置的组合模式下提供证书，默认模式为 `lut_and_safe_and_cbf`，配置文件为 `artifacts/mcp_gate_demo.json`。拒绝执行时，`executed` 为 false，`executor_calls` 为 0。演示执行器记录调用次数，不执行宿主机的输入或输出操作。演示文件中的方法字符串为 `rust_mcp_commit_gate_v1`。

<div id="36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>
<div id="i36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>

### I.3.6 Verilog 仿真

该代码仓库为允许查找表（LUT）及提交门电路生成 Verilog 文件与内存镜像（`artifacts/fpga/`）。`wca-rtl-verify` 与 Icarus Verilog 对上述模型的逐位精确行为进行验证，并与软件预言机（oracle）进行比对。Icarus 执行仿真，不执行布局布线，也不对芯片进行实测。Vivado 报告仅出现于第 I.3.7 节的 KV260 运行中，内容为资源利用率与时序收敛结果。Vivado 功耗估算不属于实验结果。

<div id="37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>
<div id="i37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>

### I.3.7 浏览器仪器与开发板

复制完整性路径分为三个阶段。A 阶段和 B 阶段已存在。C 阶段包含两块板：一块用于决策一致性，一块用于焦耳计量。

A 阶段，已就绪。`wca-commit` 中的 Rust 二进制文件运行回合、Safe 检查、工具演示及解析焦耳账目。Icarus 在工作站上仿真所生成的 Verilog。

B 阶段，已发布。纯决策核心（提案输入、证书输出、植物步进、解析焦耳更新）编译至 `wasm32`（`crates/wca-fpga-sim`）。位于 https://research.openie.dev/living/fpga-sim/ 的静态页面加载该模块。WebGPU 保存 LUT 字及 `(step, lut_allow, energy_ok, cbf_ok, decision)` 的追踪缓冲区以供显示。WebGPU 时间戳不等于焦耳。在种子 1（16 步，theta 1.5，omega 3.0）下，WASM 回合报告：提交 1 次，拒绝 15 次，解析焦耳值 8.6795e-10，与 A 阶段一致。WASM 模块是对同一 Rust crate 所运行函数的仿真，既非 Artix-7 的周期精确模型，也非开关活动功耗模型，更不能替代 Icarus 对 Verilog 的仿真。B 阶段不声明 Alchitry Pt V2 DUT。

C 阶段，板已烧录，能量未计量。一块 Alchitry Pt V2 已被检测并以闭环 WCA 提交门比特流加载（SRAM）：片上种子 1 摆锤植物动力学、TLMM 提案、允许 LUT、Safe Q16.16 端口哈密顿残差，以及 Ames 风格能量集控制障碍函数（CBF）残差。织物提交条件为 `lut_allow ∧ energy_ok ∧ cbf_ok`。115200 8N1 UART 与软件复合黄金标准在允许/拒绝/提交上一致（提交 1 次，拒绝 15 次，唯一提交发生在第 6 步）。在该种子 1 闭环回合中，CBF 合取项相对于仅使用 LUT 和 Safe PH 时未改变允许/拒绝追踪（唯一的 PH 提交满足 u=0，因此 CBF Lie 检验成立）。此处**闭环**是指植物状态由织物上的门提交与拒绝演化而来，而非植物/提案状态的流式刺激 ROM。Pt V2 **无板载焦耳计**。未连接 USB 串联电表或分流器。Vivado 及后布局布线功耗估算均非 DUT 实测读数。SparkFun 产品页面标注 FPGA 型号为 XC7A100T-2FGG84I，并列出 101,440 个逻辑单元、240 个 DSP48E1 切片、4,860 Kb 块 RAM 及 256 MB DDR3L（<https://www.sparkfun.com/alchitry-pt-v2.html>）；上述数据仍为供应商规格参数。构建者计量方法：[/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy)。

C 阶段，板级计量。AMD Kria KV260 搭载板载 INA260 功率监测器（`ina260_u14`）。2026 年 9 月 30 日共进行三轮测试，每轮均采用交错 A/B/A 方式，N = 4，稳定时间 15 秒，采样时间 25 秒，采样频率约 4 Hz。第 1 轮将自由运行的种子逻辑（439 个 LUT）与板载基线比特流进行比较。该轮仅输出瓦特数，无操作计数，因此无法给出每次操作的焦耳数。第 2 轮停止并运行一个种子比特流（975 个 LUT），在片上操作计数器下以约 100 MHz 运行。差值为 +0.0098 W（标准误差 0.0031 W），即每个种子周期 98.0 pJ（标准误差 30.8 pJ）。第 3 轮停止并运行门控比特流：八条通道，每条通道均为允许 LUT、Safe Q16.16 能量残差与屏障残差的合取，共使用 6,370 个 LUT 和 128 个 DSP 切片，时序在 25 MHz 下收敛。差值为 +0.2857 W（标准误差 0.0032 W）。在每秒 2.4999 × 10⁷ 个门控周期下，每个门控周期为 11,428 pJ（标准误差 129 pJ），每条通道决策约为 1.43 nJ。A2 减 A1 的漂移为 +0.0047 W（标准误差 0.0040 W）。比特流哈希值与日志存于参考文献的 `wca-kv260-meter` 制品中。

计量仪的可见范围与局限。INA260 规定最大偏置电流为 5 mA，最大系统增益误差为 0.15%，电流步进为 1.25 mA（TI INA260 数据手册）。偏置对同一板卡同一电源轨上的 A 和 B 均相同，因此停止与运行之差可消除该偏置。增益误差对差值的影响至多为 0.15%。计量仪感测的是板级功耗，因此差值包含由使能信号切换的时钟树与布线功耗，而非仅门控逻辑本身的功耗。第 2 轮的差值距零约三个标准误差。第 3 轮的差值距零约九十个标准误差。后续协议已固定：通过模块稳压器遥测或源测量单元读取核心电源轨（VCCINT）；至少进行 30 对随机交错 A/B 测量；每块至少完成 10⁹ 次门控评估；在每块测量前以空闲基线记录芯片温度；同时报告原始值与扣除值；将 Vivado 功耗估算值与实测值及其偏差一并报告。第 3 轮并非闭环系统的焦耳成本，第 I.3.4 节的解析常数亦未经其校准。

B 阶段的科学意义在于复现与检验，而非提出新的物理主张。读者通过浏览器逐步重现同一 seed-1 片段，可读取与机架打印结果相同的允许位和原因码。与 A 阶段的一致性是 B 阶段的验收测试，该测试在 seed 1 上通过。决策一致性是 Pt V2 的验收测试，该测试在 seed 1 上通过。在规定工作负载下的计量读数是 KV260 的验收测试，第 2 轮和第 3 轮在板级均满足该要求。

<div id="38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>
<div id="i38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>

### I.3.8 本文方法范围之外的内容

无人类受试者研究。除第 I.5 节中的否定性陈述外，不涉及任何语言相对论主张。无训练算力外推。无经济饱和点识别。无针对 Groq、Etched 或 Taalas 吞吐量的优化。无世界模型基准测试。

<div id="4-results" class="anchor-alias" aria-hidden="true"></div>
<div id="i4-results" class="anchor-alias" aria-hidden="true"></div>

## I.4. 结果

本节中所有数值均在软件参考中进行仿真，除非某句话引用了外部文献。解析焦耳值采用第 I.3.4 节的方法。仅 NI-9 为板级实测值。

<div id="41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>
<div id="i41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>

### I.4.1 声明 NI-1. 提交记录以模式和 Rust 类型的形式存在

模式 `Proposal`、`Certificate`、`RefuseReason` 与 `CommitDecision` 位于 `artifacts/schemas/wca.commit.v1/` 目录下。Rust 类型定义位于 `crates/wca-commit/src/schema.rs`。往返测试命令为 `cargo test -p wca-commit`。本结论为关于参考实现版本 `wca.commit.v1` 的存在性结果，而非唯一性定理。

<div id="42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>
<div id="i42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>

### I.4.2 声明 NI-2. Seed-1 摆锤实验片段

来自 `RESULTS.md` 的命令：

```text
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

报告结果：committed = 1，refused = 15，分析回合能量 = 8.6795e-10 焦耳。在该种子下，`--safe-ph` 的 committed 与 refused 计数及分析能量均与上述相同。`RESULTS.md` 指出，唯一的 commit 发生在第 6 步。该文件中的工具链说明：Rust 1.98。重新运行二进制文件即可复现。该能量并非芯片的实测值。

<div id="43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>
<div id="i43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>

### I.4.3 声明 NI-3. 安全能量检查的误允许情况

`wca-ph-tighten` 将离散决策与连续预言机 `Vdot <= epsilon` 进行比较。在 21 的三次方网格加 200,000 个近阈值蒙特卡洛样本（共 209,261 个决策）上：

| 路径 | 误允许 | 误拒绝 | 均允许 | 均拒绝 |
|------|--------|--------|--------|--------|
| 旧版 Q8.8 | 30836 | 105 | 104711 | 73609 |
| Safe v1（Q8.8 过近似） | 0 | 42430 | 62386 | 104445 |
| Safe v2（Q16.16 残差） | 0 | 79 | 104737 | 104445 |

`RESULTS.md` 还指出，在 41 的三次方网格加 50,000 个蒙特卡洛样本的更密网格上，通过 `cargo test` 检验，断言误允许等于 0。相对于 Safe v1，Safe v2 在保持误允许为 0 的同时，将误拒绝从 42,430 降至 79。旧版 Q8.8 在此定义下不安全：其记录了 30,836 次误允许。这些计数是数值测试的属性，而非物理摆的属性。

<div id="44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>
<div id="i44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>

### I.4.4 声明 NI-4. 玩具屏障比较，两种定义互不占优

`wca-cbf-bakeoff` 运行种子 0 至 4，共 40 步，时间步长 0.05，动作缩放系数 2.5，共享演示 TLMM 与 DiffLogic 掩码 `21887`。能量集屏障使用 `h = 18 - V`，允许条件为 `h >= 0` 且 `omega * u <= kappa * h`，其中 `kappa = 0.05`。离散盾允许绝对值 theta 至多为 2、绝对值 omega 至多为 4 的步骤通过。闭环均值因轨迹发散而存在差异。文件报告每回合的提交均值与违规计数之和。选定行如下：

| 过滤器 | 提交 | 拒绝 | 解析 J | 误允许 vs PH | `h < 0` | `Vdot > epsilon` |
|--------|------|------|--------|-------------|---------|------------------|
| `lut_and_safe_ph` | 1 | 38 | 2.153e-09 | 0 | 4 | 0 |
| `cbf_energy_set` | 1 | 38 | 2.056e-09 | 3 | 0 | 3 |
| `shield_discrete` | 18 | 21 | 2.306e-09 | 90 | 38 | 90 |
| `lut_only` | 40 | 0 | 2.544e-09 | 194 | 220 | 194 |

在该被控对象与该预言机上，`lut_and_safe_ph` 的 `Vdot` 违规次数为零，`h < 0` 事件为四次。能量集屏障的 `h < 0` 事件为零，`Vdot` 违规为三次。盾提交次数更多，且频繁违反能量预言机。`lut_only` 在报告表中的违规情况与 `always_allow` 一致。在共享的 200 步始终允许流上进行离线一致性检验，`lut_and_safe_ph` 与 `cbf_energy_set` 之间存在 4 处分歧，与盾之间存在 70 处分歧。

测试内部解读：无源性与集不变性是不同的谓词。LUT 与能量门控的组合不等价于 Ames 过滤器，且并非在每一列上均占优。更丰富被控对象上的完整二次规划基线不在本表之列，该比较仍属开放问题。现有结果为上述分歧，这是反对将两类证书合并为同一概念的证据。

<div id="45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>
<div id="i45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>

### I.4.5 声明 NI-5. 倒立摆安全 Lyapunov 仿真

在第 I.3.2 节所述的审计中（网格 n = 7 加上 Lipschitz 盒内 20,000 个边界样本，共 26,487 次决策），Safe 学习 Lyapunov 与连续 `Vdot` 预言机的对比记录如下：误允许 0 次，误拒绝 3 次，双方均允许 15,925 次，双方均拒绝 10,559 次。五个随机种子的闭环均值：`lut_and_safe_lyap` 提交 11 次，拒绝 28 次，解析 J 为 2.719e-09，对该预言机记录零次误允许。同一 `V` 上的水平集屏障提交 14 次，记录 15 次能量预言机违规。离散屏障提交 29 次，记录 95 次违规。与摆系统相同的规律：Safe 合取项跟踪其自身的预言机；不同的证书跟踪不同的预言机；脱离预言机的宽松性并不等同于安全性。

这是一个额外的仿真被控对象，不足以在工业动力学上确立提交门控标准。

<div id="46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>
<div id="i46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>

### I.4.6 声明 NI-6. MCP 演示

`artifacts/mcp_gate_demo.json` 记录了四个案例。文件中的板级结果标志为 false。

| 案例 | 类别 | 已执行 | 执行器调用次数 | 提交 |
|------|------|--------|----------------|------|
| `read_only_bypass` | 只读 | true | （无提交记录） | 缺失 |
| `irreversible_refuse` | 不可逆 | false | 0 | false |
| `irreversible_allow` | 不可逆 | true | 1 | true |
| `shell_exec_gated` | 不可逆 | true | （已门控） | true |

拒绝案例列出了 `energy_veto`（`vdot` 为 6.0，对应 `eps` 为 0.05）和 `cbf_veto`。该案例的被控对象动作为 `[0.0]`。允许案例使用组合策略 `lut_and_safe_and_cbf`，被控对象动作为 `[-0.02]`。文件中的备注指出，拒绝案例从不执行。这是适配器的演示，而非针对计算机使用代理的实地研究。

<div id="47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>
<div id="i47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>

### I.4.7 声明 NI-7. 解析预算下的 TLMM

`RESULTS.md` 报告了在正向预算下，接近 4.24e-11 分析焦耳的 2×4、组 2 配置的演示。仍然保持在 2e-10 正向预算内的最大配置止于 64 参数。宽度为 8×16 及以上的配置即使经过优化器也会超出该预算。针对朴素三元算术的等价性校验是一种容差为 1e-12 的软件比较。这些陈述并未说明该设计匹配 TeLLMe 吞吐量或任何板级能耗。

<div id="48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>
<div id="i48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>

### I.4.8 声明 NI-8. DiffLogic 允许与能量教师对比，仅限玩具场景

在 `RESULTS.md` 中的硬多种子门基准上，经过阈值校准和更密集的标签后，DiffLogic 在拒绝率 50.0 ± 15.9% 、阈值精度 0.890 ± 0.067 和召回率 0.802 ± 0.076 上匹配能量教师。位掩码参考的拒绝率更高（71.0 ± 14.9%），召回率更低（0.454 ± 0.266）。校准前，DiffLogic 的拒绝率为 57.5 ± 14.1%，召回率为 0.724 ± 0.163。该匹配基于此玩具标注设置，并非 ImageNet 或控制套件的结果。根据分析模型，校准后门的每焦耳内部效用提升至 3.570e9（校准前为 3.212e9）。正如第 I.3.4 节所述，该比率使用提交计数作为效用。

<div id="49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>
<div id="i49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>

### I.4.9 声明 NI-9. 门电路结构的板级焦耳数

| 梯级 | 结构 | 时钟 | 差值 (W) | 操作 | 每次操作焦耳数 | 标签 |
|---|---|---|---|---|---|---|
| 1 | 种子自由运行 vs 板级基线 | 不适用 | −0.8212（SE 0.0024） | 无 | 无 | `measured_j`，仅瓦特 |
| 2 | 种子，停止 vs 运行 | 约 100 MHz | +0.0098（SE 0.0031） | 一个种子周期 | 98.0 pJ（SE 30.8） | `measured_j`，INA260，SOM 电源轨（`VCC_SOM`） |
| 3 | 门控，8 通道，停止 vs 运行 | 25 MHz | +0.2857（SE 0.0032） | 一个门控周期，8 次决策 | 11,428 pJ（SE 129） | `measured_j`，INA260，SOM 电源轨（`VCC_SOM`） |

每梯级 N = 4 次交错 A/B/A 测量。梯级 1 的负号表示种子比特流的功耗低于板级基线比特流，并不意味着种子是免费的。第 I.3.7 节给出了板级读数的限制。

<div id="410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>
<div id="i410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>

### I.4.10 安全性与活性

零误放行即为安全。一个拒绝一切的门控同样安全，却毫无用处。活性是另一个维度：误拒绝率，以及被门控智能体完成的任务占比。NI-3 在 Safe 网格上同时报告两项指标。Safe v2 在零误放行的前提下，将误拒绝次数从 42,430 次降至 79 次。seed-1 回合在 16 步中仅执行 1 步，仅凭该计数无法判断装置是否达成目标。所需报告为每个装置的前沿曲线：任务完成率对误放行率，NI-4 的每种组合模式（`lut_only`、`shield_discrete`、`cbf_energy_set`、`lut_and_safe_ph`）对应一个数据点，每个数据点附带其种子及分布范围。在智能体工作负载上，同一前沿曲线以攻击套件衡量误放行，以良性任务套件衡量完成率。门控的评判依据是前沿曲线，而非单一维度。

<div id="411-what-the-scan-supports" class="anchor-alias" aria-hidden="true"></div>
<div id="i411-what-the-literature-search-supports" class="anchor-alias" aria-hidden="true"></div>

### I.4.11 文献检索所支持的结论

2026 年 9 月的文献检索（第 I.2.4 至 I.2.9 节）未发现任何已发表的系统，将可学习布尔允许 LUT、端口哈密顿或李雅普诺夫能量谓词，以及三值 LUT 提案组合为一个提交边界，同时具备位精确 RTL 仿真与解析焦耳核算。最近邻工作包括：屏蔽机制、能量感知屏障滤波器、以逻辑网络作为完整模型的方案，以及不含能量证书的 TLMM 设计。该检索支持针对所检索文献的空白陈述，不支持对未发表工作的优先权主张，亦不支持能量领先性主张。

<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>
<div id="i5-discussion" class="anchor-alias" aria-hidden="true"></div>

## I.5. 讨论

<div id="51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>
<div id="i51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>

### I.5.1 规模无法回答提交问题

Kaplan、Hoffmann、Hooker 与 Sutton 描述了损失与提案能力如何随规模变化。更大的提案器仍可能生成一个不满足 `Vdot <= epsilon` 的动作。将该提案器置于证书之后，是在证据表明规模有效之处使用规模，并在规模无从置喙之处使用谓词。苦涩教训所反对的，是那些阻碍学习的固化人工特征，而非要求删除安全谓词。若未来某项结果表明，无约束策略能以更低的分析代价和相同的任务误差通过同等的误允许测试，则 NI-3 对该门控机制的工程偏好在该对象上将有所削弱。然而，提案与许可之间的逻辑区分将依然成立。

<div id="52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>
<div id="i52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>

### I.5.2 自然语言与 MCP 是传输与提案机制

MCP 解决了发现与调用形态的问题。System One 在无需自由生成的情况下解决了部分决策问题。两者均非 `energy_ok`。NI-6 中的演示展示了一个不调用执行器的拒绝示例。生产部署可能绕过适配器。此处的主张并非协议使绕过成为不可能，而是：若不可逆效果需具备可审计性，则权限必须作为独立记录存在。

<div id="53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>
<div id="i53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>

### I.5.3 强语言决定论并非本文主张

语言决定思维的强假设并非前提。操作性陈述是局部的。在此模式中，未附通过证书的提交不构成成功记录。无类型的置信字符串可与成功标志并存储储，但仍使原因处于未陈述状态。枚举类型消除了这一特定歧义，而非描述人类认知。

<div id="54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>
<div id="i54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>

### I.5.4 形式化方法可能代价高昂，本谓词规模较小

在每个步骤都要求对整个智能体进行证明，将会占据绝大部分预算。参考文献对一个边界进行了形式化。只读调用可绕过此要求。Safe 残差是一个不动点不等式，而非一般性的 SMT 查询。在所述常数条件下，NI-2 的分析性片段能量为 8.6795e-10 焦耳。该值无法表示为生成模型板级能量的某个分数，因为该对比并未经过实测。在真实智能体工作负载下，提案焦耳与门控焦耳之间的分配并未出现在结果中。在此得到验证之前，成本方面的异议对于这一玩具门控而言已得到解答，但对于大型证书而言仍是一个悬而未决的问题。

<div id="55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>
<div id="i55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>

### I.5.5 模型错误而绿灯放行是真实的失效情形

若 `V` 并非该装置的能量函数，则 `energy_ok` 可在装置并不安全的情况下为真。参考文献中所采用的缓解措施包括：在玩具系统上设置连续孪生体、引入独立的原因码，以及拒绝将概率视为证书。未采用的缓解措施则包括：扰动输入-状态稳定性、经验证的吸引域，或 Leung 与 Paré 所研究的那类贝叶斯可信度预算。NI-4 是两份受认可证书相互矛盾的证据。这一矛盾是为该谓词命名的理由，而非在各自测试范围之外信任其中任何一份的理由。

<div id="56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>

### I.5.6 本文不重复已有证书理论

Ames、Alshiekh、Dawson 以及运行时监控相关文献已对滤波器与监控器作出定义。NI-1 的新增贡献在于：将乘积记录、LUT 导出与工具执行器的组合纳入同一参考框架之中。在集合不变性方面，凡玩具屏障优于现有方法之处，论文均已明确指出（NI-4、NI-5）。当 `cbf_ok` 谓词为所需条件时，组合即以该谓词作为另一合取项。这并非声称 LUT 计算了 Ames 二次规划。

<div id="57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>
<div id="i57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>

### I.5.7 预测器与专用推理芯片

世界模型能够减少部分预测误差，但仍会留有残差。专用推理设备改变了提案的成本结构。供应商吞吐量数据在经独立计量设备复现之前，仅为供应商自报数据。门控的职责在于不可逆分支的执行。若某设备的唯一接口为令牌流，则在执行器或不可逆工具运行之前，提交记录仍须存储于某处。

<div id="58-analytical-joules-are-not-a-costume-for-watts" class="anchor-alias" aria-hidden="true"></div>
<div id="i58-analytical-joules-are-not-watts" class="anchor-alias" aria-hidden="true"></div>

### I.5.8 解析焦耳数不等于瓦特数

Section I.3.4 中的常数是选取的工程数值。它们使得计数在仓库内部可比。它们并未针对 Artix-7 电源进行校准。将其报告为板上瓦特将是错误的测量报告。正确的报告是已有的：计算操作计数；对焦耳进行分析建模；板上焦耳仅来自 KV260 测量仪，并单独归档。Section I.3.7 的 Stage B 使相同模型可在浏览器中检查，地址为 <https://research.openie.dev/living/fpga-sim/>。它并未改变测量类别。KV260 的 rung 对其运行的 fabric 起作用。

<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>
<div id="i6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## I.6. 局限性与效度威胁

内部效度。Seed-1 是一个初始条件。Safe 网格较大，但仍是一个经过选择的边界框和一个经过选择的 epsilon。蒙特卡洛样本在阈值附近对设计者选择施压的边界进行压力测试。不同的 epsilon 或不同的对象标识会使数值结论失效，直至重新运行。对比测试中的 CBF 是在同一 crate 中实现的能量集不等式，并非来自 Ames 参考实现的独立编码求解器。分歧具有参考价值，但尚未建立与文献代码的绝对排名。

构造效度。以提交次数作为效用指标并不能衡量任务成功与否。误允许是针对一个具名预言机定义的。一个系统可以同时满足预言机安全和检查安全（对 `Vdot <= epsilon` 的误允许次数为零），但仍可能不满足集合安全（`h >= 0`），NI-4 对此有所展示。将"安全"视为单一概念的读者将会误读该表格。

外部效度。两个对象均为玩具模型，不涉及机械臂、四旋翼飞行器或人在回路的试验。MCP 演示未调用网络，Verilog 为仿真运行，浏览器仪器以 B 阶段仿真形式交付。Alchitry Pt V2 在决策上与之一致，且未计量。KV260 的读数为板级开环读数，供应商逻辑单元数量未在此处得到确认。

测量效度。分析常数可被编辑为任意量级。在此类常数下，与 Horowitz 皮焦耳表、Landauer 界限或供应商每焦耳令牌数的比较均无效。KV260 的运行梯级是在规定工作负载下的板级计量读数，闭环运行期间的核心电源轨读数是缺失的测量项。布局布线后工具功耗属于第三类，仍非计量读数，且未作为结果报告。

统计报告。凡 `RESULTS.md` 给出均值和标准差之处，本文均予以引用，不添加未经计算的置信区间。多种子覆盖为对比测试及硬门基准测试报告分布上的五个种子，这不构成大样本声明。

未声明事项。以下内容不属于研究结果：硅芯片焦耳领先地位；在 Landauer 界限附近运行；等效大脑功耗；在延迟上优于 System One；在世界模型基准测试上取得胜利；强语言决定论；以提交次数认定"智能"。

证伪条件。若在所述 crate 修订版上执行所述命令未能打印相应计数，则 NI-2 为假。若 Safe v2 测试在所述网格上报告误允许，则 NI-3 为假。若演示文件中的拒绝用例得以执行，则 NI-6 为假。若模式与运行时发生分歧，则 NI-1 为假。若 B 阶段模拟器在种子 1 上与 A 阶段结果不一致，则其自身验收测试失败。若未来的计量仪器在未进行校准研究的情况下将板级能量归因于分析数值，则不能视为对分析模型的确认。

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>
<div id="i7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## I.7. 结论

本文将提交决策定义为对 LUT 允许位和能量谓词的合取证书，可选障碍，并展示了在不可逆效应之前发出决策的软件参考。在报告的摆实验中，Safe 固定点规则在所述测试集上对其连续 oracle `Vdot <= epsilon` 的零误报，代价是 209,261 次决策中出现 79 次误拒。在报告的比较中，该 oracle 与集合不变性不同。种子 1 运行的分析情节能量在已发布常数下为 8.6795e-10 焦耳。MCP 演示中的工具拒绝不调用执行器。Verilog 检查是仿真。浏览器 WASM 和 WebGPU 仪器可在 https://research.openie.dev/living/fpga-sim/ 获得，以便在无需板卡的情况下检查相同决策。它仍然是仿真，而非 DUT 结果。Alchitry Pt V2 在种子 1 的每一次决策上都与软件一致，并保持未计量。KV260 在板级对门布线进行计量：在 25 MHz 时每个八通道门周期 11,428 pJ。参考是测量得到的软件制品和板级计量的布线。闭环芯片焦耳是下一步测量。

<div id="references" class="anchor-alias" aria-hidden="true"></div>
<div id="i-references" class="anchor-alias" aria-hidden="true"></div>

## I. 参考文献

Simon, H. A., and Kadane, J. B. Optimal problem-solving search: all-or-none solutions. Artificial Intelligence 6(3), 235-247, 1975. https://doi.org/10.1016/0004-3702(75)90002-8

Alshiekh, M., Bloem, R., Ehlers, R., Konighofer, B., Niekum, S., and Topcu, U. Safe reinforcement learning via shielding. arXiv:1708.08611.

Ames, A. D., Coogan, S., Egerstedt, M., Notomista, G., Sreenath, K., and Tabuada, P. Control barrier functions: theory and applications. European Control Conference, 2019. https://doi.org/10.23919/ECC.2019.8796030

Amodei, D., and Hernandez, D. AI and compute. OpenAI, 2018. https://openai.com/index/ai-and-compute/

Anthropic. Introducing the Model Context Protocol. https://www.anthropic.com/news/model-context-protocol

Bacellar, A., et al. Differentiable weightless neural networks. arXiv:2410.11112.

Bauer, A., Leucker, M., and Schallhart, C. Runtime verification for LTL and TLTL. ACM Transactions on Software Engineering and Methodology 20(4), 14, 2011. https://doi.org/10.1145/2000799.2000800

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Brillouin, L. Science and Information Theory. Academic Press, 1956.

Chaitin, G. J. Algorithmic information theory. IBM Journal of Research and Development, 1977. https://doi.org/10.1147/rd.214.0350

Chen, Z., Kang, M., and Li, B. ShieldAgent: Shielding Agents via Verifiable Safety Policy Reasoning. ICML 2025 (PMLR v267). arXiv:2503.22738. https://proceedings.mlr.press/v267/chen25ae.html

Chollet, F. On the measure of intelligence. arXiv:1911.01547.

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Dawson, C., Gao, S., and Fan, C. Safe control with learned certificates: a survey of neural Lyapunov, barrier, and contraction methods. arXiv:2202.11762.

Engelbart, D. C. Augmenting human intellect: a conceptual framework. 1962. https://www.dougengelbart.org/pubs/augment-3906-Framework.html

Falcone, Y. You should better enforce than verify. Runtime Verification (RV 2010), Lecture Notes in Computer Science 6418, 89-105. Springer, 2010. https://doi.org/10.1007/978-3-642-16612-9_9

Garcia-Molina, H., and Salem, K. Sagas. Proceedings of ACM SIGMOD 1987, 249-259. https://doi.org/10.1145/38713.38742

Gray, J. Notes on data base operating systems. In Operating Systems: An Advanced Course, Lecture Notes in Computer Science 60, 393-481. Springer, 1978. https://doi.org/10.1007/3-540-08755-9_9

Greydanus, S., Dzamba, M., and Yosinski, J. Hamiltonian neural networks. arXiv:1906.01563.

Ha, D., and Schmidhuber, J. World models. arXiv:1803.10122.

Hafner, D., Pasukonis, J., Ba, J., and Lillicrap, T. Mastering diverse domains through world models. arXiv:2301.04104.

Henzinger, T. A., Kueffner, K., and Yu, E. Formal verification of neural certificates done dynamically. arXiv:2507.11987. https://arxiv.org/abs/2507.11987

Hestness, J., et al. Deep learning scaling is predictable, empirically. arXiv:1712.00409.

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Hooker, S. The hardware lottery. arXiv:2009.06489. Communications of the ACM, 2021. https://doi.org/10.1145/3467017

Horowitz, M. Computing's energy problem (and what we can do about it). IEEE International Solid-State Circuits Conference, 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Iverson, K. E. Notation as a tool of thought. Communications of the ACM, 1980. https://dl.acm.org/doi/10.1145/358896.358899

Jaynes, E. T. Information theory and statistical mechanics. Physical Review 106, 620, 1957. https://doi.org/10.1103/PhysRev.106.620

Kang, S., Yu, T., and Hwang, S. J. PolicyGuide: from guarding one action to guiding the whole workflow for policy-compliant LLM agents. arXiv:2608.19861. https://arxiv.org/abs/2608.19861

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Kay, A. A personal computer for children of all ages. 1972. https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf

Klein, G., et al. seL4: formal verification of an OS kernel. Proceedings of SOSP 2009, 207-220. https://doi.org/10.1145/1629575.1629596

Kolmogorov, A. N. Three approaches to the quantitative definition of information. 1965. English: International Journal of Computer Mathematics, 1968. https://doi.org/10.1080/00207166808803030

Kuon, I., and Rose, J. Measuring the gap between FPGAs and ASICs. IEEE Transactions on Computer-Aided Design 26(2), 203-215, 2007. https://doi.org/10.1109/TCAD.2006.884574

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

LeCun, Y. Path towards autonomous machine intelligence / JEPA discussion. Meta AI blog. https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/

LeCun, Y., Chopra, S., Hadsell, R., Ranzato, M., and Huang, F. J. A tutorial on energy-based learning. 2006. http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf

Lee, L. Notational intelligence. 2022. https://thesephist.com/posts/notation/

Leung, C. H., and Paré, P. E. Bayesian safety guarantees for port-Hamiltonian systems with learned energy functions. arXiv:2512.24493.

Levy, W. B., and Calvert, V. G. Cerebral cortical communication overshadows computational energy-use, but these combine to predict synapse number. arXiv:2102.06273.

Ligatti, J., Bauer, L., and Walker, D. Edit automata: enforcement mechanisms for run-time security policies. International Journal of Information Security 4, 2-16, 2005. https://doi.org/10.1007/s10207-004-0046-8

Ma, S., et al. The era of 1-bit LLMs: all large language models are in 1.58 bits. arXiv:2402.17764.

Manek, G., and Kolter, J. Z. Learning stable deep dynamics models. arXiv:2001.06116.

Matuschak, A., and Nielsen, M. How can we develop transformative tools for thought? https://numinous.productions/ttft/

Mead, C. Neuromorphic electronic systems. Proceedings of the IEEE, 1990. https://doi.org/10.1109/5.58356

Necula, G. C. Proof-carrying code. Proceedings of the 24th ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL '97), 106-119, 1997. https://doi.org/10.1145/263699.263712

Petersen, F., et al. Deep differentiable logic gate networks. arXiv:2210.08277.

Qiao, Y., Chen, Z., Zhang, Y., Wang, Y., et al. TeLLMe: an energy-efficient ternary LLM accelerator for prefilling and decoding on edge FPGAs. arXiv:2504.16266.

Roth, F., et al. Stable port-Hamiltonian neural networks. arXiv:2502.02480.

Saltzer, J. H., and Schroeder, M. D. The protection of information in computer systems. Proceedings of the IEEE 63(9), 1278-1308, 1975. https://doi.org/10.1109/PROC.1975.9939

Sanchez, C., et al. A survey of challenges for runtime verification from advanced application domains. arXiv:1811.06740.

Sandberg, A. Energetics of the brain and AI. arXiv:1602.04019.

Schneider, F. B. Enforceable security policies. ACM Transactions on Information and System Security 3(1), 30-50, 2000. https://doi.org/10.1145/353323.353382

Sha, L. Using simplicity to control complexity. IEEE Software 18(4), 20-28, 2001. https://doi.org/10.1109/MS.2001.936213

Shannon, C. E. A mathematical theory of communication. Bell System Technical Journal, 1948. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Shi, T., He, J., Wang, Z., et al. Progent: Securing AI Agents with Privilege Control. arXiv:2504.11703. https://arxiv.org/abs/2504.11703

Solomonoff, R. J. A formal theory of inductive inference, parts I and II. Information and Control, 1964.

SparkFun. Alchitry Pt V2 product page. https://www.sparkfun.com/alchitry-pt-v2.html

Sutskever, I. An observation on generalization. Simons Institute talk, 2023. https://www.youtube.com/watch?v=AKMuA_TVz3A

Sutton, R. The bitter lesson. 13 March 2019. http://www.incompleteideas.net/IncIdeas/BitterLesson.html

Texas Instruments. INA260 precision digital current and power monitor, data sheet. https://www.ti.com/lit/ds/symlink/ina260.pdf

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Umuroglu, Y., et al. LogicNets. arXiv:2004.03021.

Victor, B. Inventing on principle. 2012. https://www.youtube.com/watch?v=PUv66718DII

Victor, B. Media for thinking the unthinkable. https://worrydream.com/MediaForThinkingTheUnthinkable/

Wang, H., Poskitt, C. M., and Sun, J. AgentSpec: customizable runtime enforcement for safe and reliable LLM agents. arXiv:2503.18666. https://arxiv.org/abs/2503.18666

Wei, J., et al. T-MAC. arXiv:2407.00088.

Xiang, Z., Zheng, L., Li, Y., Hong, J., et al. GuardAgent: safeguard LLM agents by a guard agent via knowledge-enabled reasoning. arXiv:2406.09187. https://arxiv.org/abs/2406.09187

Yu, E., Žikelić, Đ., and Henzinger, T. A. Neural control and certificate repair via runtime monitoring. AAAI 2025. https://doi.org/10.1609/aaai.v39i25.34840 (arXiv:2412.12996).

Local measurement record: `artifacts/RESULTS.md` in the `wca-lut-edge` software reference. KV260 meter record: `artifacts/stage-c/wca-kv260-meter/` (protocol, claim status, A/B/A logs and summaries). Schema examples: `artifacts/schemas/wca.commit.v1/examples/`. Demo: `artifacts/mcp_gate_demo.json`.

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## I. 附录 A. 可复现性

用于生成所引日志的工作站路径：`wca-lut-edge` 树，Rust 1.98，如 `RESULTS.md` 中所记录。日常命令：

```text
cargo test -p wca-commit
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1 --safe-ph
cargo run --release --bin wca-ph-tighten -- --grid 21 --out artifacts/ph_tighten_report.json
cargo run --release --bin wca-cbf-bakeoff -- --out artifacts/cbf_bakeoff_report.json
cargo run --release --bin wca-lyap-plant -- --out artifacts/lyap_plant_report.json
cargo run --release --bin wca-mcp-gate -- --demo
cargo run --release --bin wca-tlmm-scale -- --out artifacts/tlmm_scale_report.json
```

Icarus Verilog 版本为 12.0，详见 `RESULTS.md` 中的环境说明。RTL 检查均为仿真结果。请勿将分析所得焦耳值视为板级功耗。

板级结果标志仅对 KV260 阶段 C 第 1 至第 3 梯级为真（第 I.3.7 节），属板级测量。本文其余所有结果均为仿真或分析结果。

<div id="appendix-b-browser-fpga-emulator-architecture-to-build" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-b-browser-fpga-emulator-architecture" class="anchor-alias" aria-hidden="true"></div>

## I. 附录 B. 浏览器 FPGA 仿真器：体系结构

本附录描述了 Stage B 仿真器的架构，运行地址为 <https://research.openie.dev/living/fpga-sim/>。下面的 Seed-1 协议数字来源于针对 Stage A 金色模型的 WASM 运行结果。

模块。

1. `decision_core`。纯函数已由 Rust 证书、植物步骤和焦耳累加器表示。无需文件系统，也不需要线程。目标 `wasm32-unknown-unknown`。
2. `lut_image`。与 Verilog 路径加载的内存映像相同（`artifacts/fpga/wca_allow_lut.mem` 及其后续文件）。浏览器副本必须与用于 Icarus 检查的文件哈希匹配。
3. `trace`。固定模式：步骤索引、状态、`u`、`lut_allow`、`energy_ok`、`cbf_ok`、原因码、分析焦耳增量、植物动作。字段名称与 `wca.commit.v1` 完全相同，因而可以将转储与 crate 的 JSON 进行差异比较。
4. `webgpu_view`。设备、队列以及用于 LUT 和跟踪的存储缓冲区。着色器绘制允许和拒绝。第二次调度可以在网格上映射 Safe 剩余。缓冲区用于检查，并非功率模型。
5. `workstation_oracle`。Icarus 仍然是 RTL 参考。浏览器不取代它。WASM 与 Rust 二进制之间的不一致导致构建失败。WASM 与 Icarus 在共享 LUT 映像上的不一致也导致构建失败。两者的比较均不涉及瓦特。

接受测试。Seed-1 测试通过（第 I.3.7 节）。其余测试为模块的指定检查。

- Seed-1，16 步，初始 theta 1.5，omega 3.0：已提交 1，已拒绝 15，分析焦耳 8.6795e-10，匹配 NI-2。
- Safe 网格冒烟：在已发布的 209,261 决策测试子集上 false allow 为 0，匹配 NI-3 的方向。
- MCP 拒绝向量：执行器调用计数为 0，匹配 NI-6。
- 单元测试：WebGPU 缓冲区回读等于 WASM 跟踪。如果回读不可用，页面必须显示 GPU 路径未确认跟踪，CPU WASM 跟踪仍为结果。

板卡 **joules** 的物理后续。Stage C 已在 Alchitry Pt V2 上使用 UART 决策协议编程了闭环提交门；板卡仍未配备板载焦耳计。使用 USB 在线功率计或在 5 V 轨上使用分流电阻加示波器，在声明的工作负载下，可实现板卡测量的焦耳。Vivado / 后 PAR 估算并非该计量。供应商的逻辑单元和存储数据仍保持为供应商数据。参见 [/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy)。

仿真器不在范围内的内容：在浏览器中训练 DiffLogic 以及从着色器估算 Artix-7 动态功耗。

<div id="part-ii" class="anchor-alias" aria-hidden="true"></div>
<div id="mixture-of-limits-navigation-law-for-computer-intelligence" class="anchor-alias" aria-hidden="true"></div>
<div id="part-ii-the-cascade-mixture-of-limits" class="anchor-alias" aria-hidden="true"></div>

## 第 II 部分. 级联策略（限制混合）

<div id="mol-abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="ii1-the-rule" class="anchor-alias" aria-hidden="true"></div>

## II.1. 规则

一项任务由其状态 $z$ 上的完备性谓词 $C(z) \in \{0, 1\}$ 给定。**齿轮**是可能完成任务的机制：查找（读取已存储的经验证值）、公式（求值封闭形式）、求解器（运行搜索、优化器或以证书结算）或模型（运行已学习的生成器）。齿轮 $i$ 具有通过概率 $p_i$，即其在该任务类上达到 $C(z) = 1$ 的概率，以及以焦耳（J）为单位的期望能耗 $c_i$。

任务的**下限**是某一齿轮策略以不超过 $\delta$ 的失败概率达到 $C(z) = 1$ 所需的最小期望能耗，等于第 0.2 节中的 $J^*$。**平台区**是超出下限后的支出区域：一旦 $C(z) = 1$，任何进一步的计算均无法提升 $C$，因此额外的焦耳在既定目标上毫无收益。

**限制混合**规则如下：按使首次完成的期望能耗最小化的顺序依次尝试各齿轮，在第一个完成 $C(z)$ 的齿轮处停止，当下一个齿轮将超出预算或无法改变决策时，以收据拒绝。查找 → 公式 → 求解器 → 模型为标准顺序。该顺序仅在第 II.2 节推导的条件下最优。每次完成均经由第一部分的记录：提议、认证、提交或拒绝、收据。

**模型的位置。** 模型置于最后是一种试验顺序，而非对模型能力的裁定。Snell 等人（2024）表明，测试时计算的计算最优调度在效率上比 best-of-N 高出 4 倍以上，且在某些问题上测试时计算可替代更大的模型。该结果涉及模型齿轮内部的调度，其与其他齿轮一样以焦耳计价。模型齿轮在更廉价的齿轮无法完成 $C(z)$ 时开启，当这些齿轮的通过率过低以至于无法覆盖其失败成本时，模型齿轮优先开启。

图 2 绘制了某一任务的下限与平台区。

![针对某一任务，经验证进展与支出关系的示意图。随着级联从查找升级至公式再至求解器，进展呈阶梯式上升；求解器完成任务，标记下限。超出下限后，模型阶段增加支出但无进一步经验证进展，即信息价值为零的平台区。](/figures/gates/mol-plateau.svg)

*图 2. 某一任务上的限制混合。示意图，非实测数据。另提供 [PNG 副本](/figures/gates/mol-plateau.png)。*

**限制混合不是专家混合。** 专家混合（MoE）路由在单一生成模型内部选择参数（Shazeer 等，2017；Fedus 等，2022）。限制混合则在各齿轮之间选择是否支出以及在何处支出，MoE 模型可作为其模型齿轮。

| | MoE | 限制混合 |
|---|---|---|
| 选择发生的位置 | 单一模型内部 | 跨齿轮，在任何模型运行之前 |
| 选择的对象 | 运行哪些参数 | 哪个齿轮完成，或拒绝 |
| 成功标准 | 下一词元似然 | $C(z) = 1$，经认证的提交及收据 |
| 拒绝 | 非原生结果 | 带收据的类型化结果 |

<div id="ii2-expected-energy-of-a-cascade-and-the-optimal-order" class="anchor-alias" aria-hidden="true"></div>

## II.2. 级联的期望能量与最优排序

**两个齿轮。** 设轻齿轮 L 的通过概率为 $q_L$，能量为 $c_L$，其后接一个始终通过的重齿轮 H，能量为 $c_H$。先尝试 L 的期望代价为 $c_L + (1 - q_L)\,c_H$，先尝试 H 的期望代价为 $c_H$。因此，L 优先当且仅当

$$
c_L + (1 - q_L)\,c_H < c_H \iff c_L < q_L\, c_H .
$$

例如，一次代价为 $c_L = 10^{-9}$ J 的查找在 $q_L = 0.3$ 的任务上通过，置于代价为 $c_H = 10$ J 的模型调用之前，每个任务期望节省 $q_L c_H - c_L \approx 3$ J。若 $q_L$ 低于 $c_L / c_H = 10^{-10}$，则顺序反转。

**多个齿轮。** 对于 $n$ 个齿轮依次尝试直至首次通过，各结果相互独立，顺序 $\sigma$ 的期望能量为

$$
\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j<k} \bigl(1 - p_{\sigma(j)}\bigr).
$$

交换相邻两个齿轮 $a$ 与 $b$ 的顺序，该求和式的变化量等于两项共同因子乘以 $(c_a + (1-p_a)c_b) - (c_b + (1-p_b)c_a) = c_a p_b - c_b p_a$。因此，$a$ 应先于 $b$ 当且仅当 $p_a / c_a > p_b / c_b$，最优顺序按 $p_i / c_i$ 降序排列齿轮（Simon 与 Kadane，1975）。当且仅当较廉价的齿轮同时具有更高的每焦耳通过概率时，最廉价优先才是最优策略。若该条件不满足，级联从较重的齿轮开始。在预算约束下，失败的轻量尝试所消耗的焦耳数已不可收回，因此能够估计每任务 $p_i / c_i$ 的选择器可以关闭固定顺序无法关闭的任务。

**物理下界。** 任何在温度 $T$ 下不可逆地擦除 $n$ 比特的齿轮，至少耗散

$$
E_{\text{Landauer}}(n, T) = n\, k_B T \ln 2, \qquad k_B = 1.380649 \times 10^{-23}\ \text{J/K},
$$

即在 300 K 时每比特 $2.87 \times 10^{-21}$ J（Landauer，1961；Bennett，1973，关于可逆极限）。实测 CMOS 操作的代价约为：45 nm 工艺下 32 位浮点加法约 0.9 pJ，DRAM 访问约 1 至 2 nJ（Horowitz，2014，论文正文；全体会议幻灯片给出 64 位访问为 1.3 至 2.6 nJ），比该下界高出八到十二个数量级。常被引用的每次 32 位 DRAM 读取 640 pJ 并未出现在该论文或其幻灯片中，本文亦不采用此数值。因此，收据上的 Landauer 数值是一个标注的下界，而非任何测量结果。

**目录代价模型。** 在齿轮运行之前，软件将其参考定价为

$$
E_{\text{est}}(x) = \theta(D)\,\mu(S, V),
$$

其中 $\theta(D)$（无量纲）随动作 $x$ 的难度类别 $D$ 缩放，$\mu(S, V)$（J）为原语 $S$ 在硬件视图 $V$ 下的目录能量。两者均为已声明的目录常数，因此 $E_{\text{est}}$ 是用于排列齿轮顺序的估计值，既非源自物理推导，也不作为测量结果报告。在关闭任务的系统之间进行排名时，使用实测焦耳数（第 0.2 节）。

<div id="ii3-stopping-conditions" class="anchor-alias" aria-hidden="true"></div>

## II.3. 停止条件

**信息价值。** 设 $B$ 为某决策的收益，$x$ 为当前信息状态，$y$ 为进一步的观测或计算，$c(y)$ 为其能量，$\lambda$ 为收益与焦耳之间的换算率。净价值为

$$
\Delta(x, y) = \mathbb{E}[B \mid x, y] - \mathbb{E}[B \mid x] - \lambda\, c(y)
$$

（Howard, 1966；Russell and Wefald, 1991）。当 $\Delta \le 0$ 时，该规则拒绝升级。一旦 $C(z) = 1$，对于该任务上任意进一步的 $y$，前两项相等，因此 $\Delta = -\lambda c(y) < 0$，随即触发停止。

**语法覆盖。** 设 $G$ 为 Lookup、Formula 与 Solver 可用的已验证推导集合。当存在推导 $q \vdash_G a$ 时，查询 $q$ 被覆盖。当 $q$ 被覆盖时，Model 齿轮不会被开启，因为被覆盖的齿轮以概率 1 通过且能量低于 Model 齿轮，故依据第 II.2 节的双齿轮不等式，其优先执行并关闭任务。当 $q$ 未被覆盖且策略禁止使用 Model 齿轮时，该规则拒绝。

**求解拒绝。** 搜索低能量配置的 Solver 齿轮，要么到达经认证的不动点（提交），要么报告其在预算范围内无法收敛（拒绝）。

软件参考中的具名拒绝原因：

| 原因 | 条件 |
|---|---|
| `voi` | 对每个可用的下一步均有 $\Delta \le 0$ |
| `grammar` | 未被覆盖且不允许使用 Model 齿轮 |
| `energy` | 下一齿轮的估计能量超出剩余预算 |
| `efa_certificate` | 提交前证书校验失败 |
| `settle_refuse` | Solver 在预算范围内未能收敛 |
| `primitive_gap` | 所需原语在目录中缺失 |
| `safety` | 能力检查拒绝该操作 |

<div id="ii4-provenance-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## II.4. 来源追溯与收据

每条答复均附带一个**回放类别**，说明其生成方式：`Deterministic`（查找、公式或经认证的求解器）、`RetrievedCited`、`Composed` 或 `ModelGenerated`。类型系统禁止提升类别等级：`ModelGenerated` 不得被改写为 `Deterministic`。收据上的能耗携带三种标签之一：**Estimated**（目录值、Landauer 值或指令燃料值）、**Unmetered**（无读数）或 **Metered**（某具名仪表返回了读数）。除非仪表返回读数，否则软件参考实现不设置 `measured_j`。本文将参考实现所导航的原语目录（按族分组）称为**周期栈**（Periodic Stack）；每个单元格的状态为 Present（已实现）或 Gap（缺失）。

<div id="ii5-software-reference" class="anchor-alias" aria-hidden="true"></div>

## II.5. 软件参考实现

软件参考实现 `mixture-of-limits`（Apache-2.0 或 MIT 许可）附带一个测试工具 `cargo run -p mol-cli -- prove`，该工具对每项准则打印 `VERIFIED` 并以退出码 0 结束。工作区测试套件（`cargo test --workspace`）通过（P0），测试工具以退出码 0 结束（P1）。标记为已验证的准则意味着存在相应实现且该实现通过了其所述规范；这既非定理，亦非独立复现，也非能耗测量。截至 2026 年 10 月 2 日的运行结果，测试工具打印了 43 条 `VERIFIED` 准则（此数字取代了此前约 29 条的统计）；下表逐项列出 P2 至 P24，II.5.1 至 II.5.3 描述了此后新增的乘积间隙准则 A11 至 A14。其余准则未在本文中逐项列出，详见软件参考实现的 `PLAN.md` 及 `product/ACCEPTANCE`。

<div id="6-prove--claim-map" class="anchor-alias" aria-hidden="true"></div>

| 证明编号 | 准则 | 声明编号 | 声明 | 范围说明 | 测量 |
|---|---|---|---|---|---|
| 证明号 | 标准 (PLAN) | 论文主张编号 | 主张（单句） | 软件参考 / 范围说明 | 测量 |
|---|---|---|---|---|---|
| P2 | 确定性关闭（双运行） | `claim.mol.deterministic_close` | 相同的请求产生相同的提交/拒绝 + 限制标识。 | 无 | 未计量 |
| P3 | 公式/查找关闭（无模型） | `claim.mol.formula_lookup_no_model` | Landauer / 单位转换在查找或公式时关闭提交；模型从未回答。 | 无 | 未计量 / 估计（收据上的 Landauer 下限） |
| P4 | 当 `!allow_model` 时的 VoI 拒绝 | `claim.mol.voi_refuse` | 自由形式请求 → 拒绝 `voi`。 | 无 | 未计量 |
| P5 | 结算提交 + 结算拒绝 | `claim.mol.settle_ternary` | 三元结算 → 提交；`will not settle` → 拒绝 `settle_refuse`。 | 软件参考结算存根；无 VM / FPGA | 未计量 |
| P6 | 在分歧时的证书拒绝 | `claim.mol.efa_certificate_refuse` | 公式 + `diverge` → 拒绝 `efa_certificate`。 | 树内证书 | 未计量 |
| P7 | 能力默认拒绝变异 | `claim.mol.capability_deny_mutate` | `AutomateGate::default().gate(Mutate)` → 拒绝。 | 无 | 未计量 |
| P8 | 收据标签 | `claim.mol.receipt_honesty` | 软件参考：`measured_j=None`，估计标记为（`EstimateKind`）。 | 实时 RAPL/NVML 默认关闭 超出范围 | 未计量 / 估计 |
| P9 | `ModelGenerated` 不导致 `Deterministic` | `claim.mol.replay_no_strengthen` | `TypedAnswer::weaken_to` 返回 `ReplayCoercion`。 | 无 | 无 |
| P10 | 周期性堆栈实时目录导航 | `claim.mol.stack_live_catalog` | 家族 + 当前 + 规模 → 在查找时提交；258 个实时查找/公式/求解/导航齿轮。 | μ 校准 + 硅硬件 超出范围；软件参考证明中的 Gap 仿真 | 未计量 |
| P11 | 通过注册表探测的 `primitive_gap` | `claim.mol.primitive_gap` | Gap 标记 `physical_settle` + 名称缺失 → 拒绝 `primitive_gap`（非仅字符串）。 | 无 | 未计量 |
| P12 | μ / 阻抗目录 | `claim.mol.mu_catalog` | 收据标记 `mu_source=catalog`、`mu`、`landauer_floor_ratio`；`E≈θ·μ`（目录估计，非 RAPL/`measured_j`）。 | μ **校准语料库** 超出范围 | 估计 |
| P13 | 收据记录回放 | `claim.mol.receipt_replay` | JSONL/内存回放再现提交/拒绝 + 限制标识；模型从未回答。 | 无 | 未计量 |
| P14 | Z2 检索+引用 | `claim.mol.z2_retrieve_cite` | 种子事实命中 → 提交 `RetrievedCited` + 引用标识；未知 → 拒绝 `claim_unknown`（不虚构）。 | 种子语料库仅树内 | 未计量 |
| P15 | Z1 组合/合成 | `claim.mol.z1_compose` | ≥2 条被引用的主张 → 提交 `Composed` + `synthesis.composed_from`；缺失 → 拒绝 `compose_missing`；从不单独作为确定性/已检索引用洗白。 | 无 | 未计量 |
| P16 | 代理邮箱循环 | `claim.mol.agent_mailbox` | 目标/消息/行动 → 关闭 → 提交\|拒绝 + 转录中的回执；演示命中公式/引用/撰写 COMMIT 及 voi/settle_refuse REFUSE；模型冷启动；测量标志保持。 | 无 | 未计量 |
| P17 | 双时态状态 + 记忆 | `claim.mol.bitemporal_memory` | 仅在混合限制关闭 COMMIT 时写入；变更拒绝/自由形式记忆 → REFUSE；召回 → `RetrievedCited` + `memory:` 引用；未知 → `memory_unknown`。 | 无 | 未计量 |
| P18 | 织物路由 + 软件参考清单 | `claim.mol.fabric_soft_ref` | 离线清单有效（`source=software_ref`，Cpu 始终可用）；查找/公式 → Cpu；结算 → ThermoSettle\|Cpu；模型 → Gpu* 或 REFUSE `fabric_unavailable`；检测 ≠ 实测焦耳值。 | 实时 wgpu 存在可选/证明不要求 | 未计量 |
| P19 | 桌面 Shell 无头模式 | `claim.mol.desktop_headless` | `ShellSession` 请求/关闭 → 回执视图（zone/fabric/limit/estimated_j/`measured_j=None`）；焦耳账本；VoI 拒绝；无需 GUI。 | egui GUI 可选 | 未计量/估算 |
| P20 | 操作系统计量标签 | `claim.mol.os_meter_honesty` | 功能关闭/虚拟机/无权限 → `measured_j=None`，组件为空，`measure_source=unavailable`；固件标记已标注来源；默认关闭保持未计量。 | 实时探针可选（`energy-meter`） | 未计量（默认）/仅当探针返回时计量 |
| P21 | WASM 胶囊认证 | `claim.mol.wasm_capsule` | 在存根运行时下执行 `add.wasm`；燃料 → 仅 estimated_j；FS/网络授权/燃料超限/宿主共享 → REFUSE；关闭时为胶囊加盖戳记。 | 可选 `wasmtime` 特性 | 未计量/估算（燃料） |
| P22 | 代理通道会话路径 | `claim.mol.agent_lane` | 通道分区；无来源证明的 `host_invoke` 拒绝；关键字确认不足；需要 `GrantReceipt`；允许时加盖 `AgentLaneReceipt` 戳记。 | 无 | 未计量 |
| P23 | 多织物计算回执 | `claim.mol.fabric_compute_receipt` | 软件参考清单；`ComputeFabric` / `ScheduleDecision` / `ComputeStepReceipt` 含 `fabric_id`；级联加盖 `fabric:route` 戳记；CPU 公式 COMMIT；模型残差可能 `fabric_unavailable`；软件参考路径上 `measured_j=None`。 | 无 | 未计量 |
| P23b | 实时织物软检测 | `claim.mol.fabric_live_soft` | 功能关闭时保持 software_ref；模拟/实时 Metal 可加盖 `gpu_metal` 戳记；公式保持 Cpu；缺失 Gpu* 时故障关闭；证明不要求 GPU；除非计量否则 `measured_j=None`。 | 软/可选检测 | 未计量 |
| P23c | wgpu / Metal 微内核 | `claim.mol.kernel_vector_add` | 洁室 WGSL 向量加法；软存根离线（校验和相同）；Gpu* 打印 `kernel:vector_add` + `execution_proof` 戳记；可选的重叠计量器可在包上打印 `measured_j`，字段名为 `energy_honesty=measured`；无轨道求和包焦耳值。 | 实时 Metal 可选；夹具可用于证明 | 未计量（默认）/ 仅在计量器返回时计量 |
| P24 | 生态系统端到端认证（单一收据） | `claim.mol.ecosystem_e2e` | 通道 → 织构（Cpu 软件参考）→ WASM → 能量标签（估算燃料；可选 meter_sample）→ 仅凭 `GrantReceipt` 调用宿主 → 对**单一**收据执行提交或拒绝；无授权拒绝 → `grant_receipt_required`。 | 无 | 未计量 / 估算 |

在测试框架之外：实时能耗计数器（RAPL、NVML）作为默认的近似手段、实时 GPU 检测、设备端证书硬件、已训练的模型权重，以及用于 Gap 单元的硅级计量器。以上均不在声明范围之内。

<div id="ii51-phase-1-micro-perception-on-the-arena-a11-a14" class="anchor-alias" aria-hidden="true"></div>

### II.5.1 竞技场上的第一阶段微感知（A11，A14）

竞技场针对类型化任务（决策、工单关闭、风险）对级联系统进行评分，基准线包括一个"始终调用模型"基准和一个小型叶节点基准。类型化基准以 `phase1=false` 运行。当 `phase1=true` 时，非结构化的工单、风险或决策字符串首先经过树内规则 AST 转换器（`mol phase1`）处理，之后才进入级联；无法识别的输入将被拒绝，因此该转换器从不作为模型使用，Model LAST 始终保持在最末位置。在 2026 年 10 月 2 日的软件参考运行中（n = 36，America/New_York），级联在 36 个案例中全部正确关闭，并在 5 个饱和案例中全部拒绝（5/5），而"始终调用模型"基准和叶节点基准在 36 个案例中各得 28 分，在饱和案例中均得 0 分（0/5）。级联的平均估算焦耳数约为 2.1e-11，"始终调用模型"基准约为 5.0e-1，叶节点基准约为 2.5e-4。上述数据均为目录估算值；`measured_j` 未设置，相关数字来自参考文献自身发布的表格，并非为本文重新运行所得。

<div id="ii52-tier-1-os-meters-a13" class="anchor-alias" aria-hidden="true"></div>

### II.5.2 第一层操作系统计量器（A13）

一项可选的构建特性添加了包级探针，使 `measured_j` 仅从真实读数中填充：Linux RAPL（powercap `energy_uj` 增量）、NVIDIA（`nvidia-smi` 功率乘以时间窗口，或能量消耗增量，作为设备总 GPU 能量）以及 macOS（SMC `PSTR` 瓦特数乘以时间窗口，无需 sudo；Energy Model 包通道不被使用，各电源轨从不求和）。测试框架在该特性关闭的情况下运行，因此 `measured_j` 在其中保持未设置状态。准则 A13 对 RAPL、NVML 和 SMC 固定值加以标注，并禁止从利用率百分比推算数值。第二部分中的任何图表均非来自上述探针的读数。

<div id="ii53-primitive-distillation-a12" class="anchor-alias" aria-hidden="true"></div>

### II.5.3 原语蒸馏（A12）

在经过认证的 Model LAST 提交之后，`mol distill` 会将一条 Lookup 或 Formula 条目追加至具有确定性重放功能的存储中；未经认证的提案永远不会被蒸馏。对蒸馏后模式的第二次遍历随后在 Lookup 或 Formula 处关闭，而不会打开 Model LAST（A12）。收据将 `estimated_j` 保持标记为估算值。

复现方式：`cargo run -p mol-cli -- prove`（共 43 项标准，涵盖 A1 至 A14）、`-- arena`、`-- phase1 "please close ticket as R-OK"`、`-- distill "ticket summary" --gear lookup --store product/fixtures/distill_store.json`。代码：[openIE-dev/mixture-of-limits](https://github.com/openIE-dev/mixture-of-limits)。

<div id="ii6-related-work" class="anchor-alias" aria-hidden="true"></div>

## II.6. 相关工作

**级联与元推理。** Viola 与 Jones（2001）运行了一个由提升分类器组成的级联，其中低成本阶段拒绝大多数输入。Russell 与 Wefald（1991）按每次计算对决策网络的预期价值减去其成本来定价，并在没有任何计算具有正净价值时停止。Horvath（1987）为有界推理设定了相同的权衡。随时算法以可中断的停止方式在计算量与质量之间进行权衡（Dean 与 Boddy，1988；Zilberstein，1996）。模型级联仅在较小模型不确定时才将输入发送给较大模型（Varshney 与 Baral，2022），FrugalGPT 则在学习到的评分器接受答案时停止（Chen、Zaharia 与 Zou，2023）。混合限制（Mixture of Limits）在三个方面有所不同：档位包含位于任何模型之前的非神经机制；停止条件是谓词 $C(z)$，而非学习得到的分数；成本是收据上的焦耳数，而非美元或延迟。

**超出答案的消耗。** 推理模型在给出第一个正确答案后仍继续消耗词元，而答案本身并未改变（Chen 等，2024），一项综述收集了提前停止的方法（Sui 等，2025）。推测解码（Leviathan 等，2023）、混合深度（Mixture-of-Depths，Raposo 等，2024）、量化（Frantar 等，2022；Lin 等，2024）以及分页 KV 缓存（Kwon 等，2023）降低了模型档位运行时的能耗，但并不决定其是否运行。

**公式恢复。** AI Feynman（Udrescu 与 Tegmark，2020）、SINDy（Brunton 等，2016）与 PySR（Cranmer，2023）从数据中恢复封闭形式；AlphaGeometry（Trinh 等，2024）与 AlphaProof（Hubert 等，2025）将提议器与符号验证器或 Lean 验证器配对使用。每种方法均产生公式（Formula）或经认证的求解器（Solver）档位，以低于生成器的能耗完成所覆盖的任务。

**模型间路由。** 这些系统选择由哪个模型作答，但均未优先尝试非神经档位，也未以带类型的原因拒绝请求。

| 系统 | 标题 | ID | 类别 | 路由或加速对象 | 能耗或成本（如报告所示） | 差异 |
|---|---|---|---|---|---|---|
| **RouteLLM** | *RouteLLM: Learning to Route LLMs with Preference Data*（arXiv）；ICLR 2025 会场标题使用 *from Preference Data* | arXiv:[2406.18665](https://arxiv.org/abs/2406.18665) · ICLR 2025 | 偏好路由器（强↔弱 LLM） | 查询 → 强或弱 LLM | 成本/质量（API \$）；由作者报告 | 模型↔模型；无查找表/公式下限；无类型化拒绝提交 |
| **PEARL**（路由） | *PEARL: Performance and energy aware routing for LLMs* | DOI:[10.1016/j.future.2025.108218](https://doi.org/10.1016/j.future.2025.108218) · FGCS 176:108218 | 能耗感知多 LLM 路由器 | 查询 → 能耗上限下的 LLM（EMM 预测能耗） | 作者报告能耗感知路由（GPU/基础设施） | 仍选择某一模型；限制混合机制可在任何模型介入前拒绝 |
| **GreenServ** | *GreenServ: Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference* | arXiv:[2601.17551](https://arxiv.org/abs/2601.17551) · ICPE 2026 | 上下文赌博机多 LLM 路由器 | 查询特征 → LLM；精度对比**实测 GPU 能耗**（Zeus） | **已计量**（作者通过 Zeus 测量 GPU Wh）于其 LLM 池上 | 模型池路由；限制混合级联的首级为非神经网络 |
| **VoltanaLLM** | *VoltanaLLM: Energy-Efficient and SLO-Aware Disaggregated LLM Serving via Adaptive Frequency Control and State-Space Routing* | arXiv:[2509.04827](https://arxiv.org/abs/2509.04827) | P/D 分离服务 + 频率调节 + 状态空间路由 | 预填充/解码实例 + TTFT/ITL SLO 约束下的 GPU 频率 | **已计量**（作者；pyNVML 于 A100/GH200）端到端 GPU 能耗较最大频率基线最高降低约 36.3%（现场服务结果） | 路由**同一生成栈的实例**；限制混合机制可能从不开启解码 |
| **HCSpec** | *HCSpec: Two-Tier Horizontal Cascade Speculative Decoding for High-Efficiency Large Language Model Inference* | DOI:[10.18653/v1/2026.acl-long.353](https://doi.org/10.18653/v1/2026.acl-long.353) · ACL 2026 | 推测解码（草稿↔目标） | 位置专用草稿级联 → 目标验证 | 延迟加速比（对比 EAGLE-3 / AR） | 加速生成；不在下限处拒绝生成 |
| **CAS-Spec** | *CAS-Spec: Cascade Adaptive Self-Speculative Decoding for On-the-Fly Lossless Inference Acceleration of LLMs* | arXiv:[2510.26843](https://arxiv.org/abs/2510.26843) · NeurIPS 2025 | 自推测级联（DSIA 草稿） | 来自目标模型的草稿阶段（稀疏性/量化）+ DyTC | 延迟加速比约 1.1×-2.3×（作者；相对 AR）；无损 token | 模型内部草稿层级 ≠ 限制混合机制下限 |
| **GCD** | *Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning* | arXiv:[2305.13971](https://arxiv.org/abs/2305.13971) · DOI:[10.18653/v1/2023.emnlp-main.674](https://doi.org/10.18653/v1/2023.emnlp-main.674) · EMNLP 2023 | 语法约束 LLM 解码 | 将 logit 掩码至 CFG | 未计量/质量指标 | 约束 **token**；限制混合机制约束**提交** |

<div id="ii7-baselines-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## II.7. 基线与证伪方案

级联主张在一个有类型的任务集上进行测试，以每任务焦耳数对闭合率作为前沿边界。各参与方案为：始终使用大模型；始终使用小模型；学习型路由器（Ong 等，2024）；评分级联（Chen、Zaharia 与 Zou，2023）；一个估计每任务 $p_i / c_i$ 的选择器；以及一个已知每任务最廉价充分配置的预言机。固定的 Lookup → Formula → Solver → Model 顺序仅在其曲线低于所有方案时才占据前沿。若在某一任务类别上实测的 $p_i / c_i$ 沿该顺序不单调递减，则根据第 II.2 节的推导，该顺序即被证伪。若 `mol prove` 在所述修订版上未以退出码 0 退出，则测试框架主张被证伪。

<div id="ii8-limits" class="anchor-alias" aria-hidden="true"></div>

## II.8. 局限性

该线束在软件中是构造性的存在。没有 Part II 图是仪表读数：目录和 Landauer 能量是估计值，`measured_j` 在线束路径上未设置。最优顺序结果假设齿轮结果相互独立；相关失效会改变期望能量，并需要使用第 II.2 节的完整求和以及条件概率。通过概率 $p_i$ 必须针对每个任务类别进行估计，估计误差会影响顺序。第 II.7 节的前沿比较尚未运行。

<div id="ii-references" class="anchor-alias" aria-hidden="true"></div>

## II. 参考文献

Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development* 17(6):525-532. https://doi.org/10.1147/rd.176.0525

Brunton, S. L., Proctor, J. L., and Kutz, J. N. (2016). Discovering governing equations from data by sparse identification of nonlinear dynamical systems. *PNAS* 113(15):3932-3937. https://doi.org/10.1073/pnas.1517384113

Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. arXiv:2305.05176.

Chen, X., et al. (2024). Do NOT Think That Much for 2+3=? On the Overthinking of o1-Like LLMs. arXiv:2412.21187.

CAS-Spec (2025). Cascade Adaptive Self-Speculative Decoding. NeurIPS. arXiv:2510.26843.

Cranmer, M. (2023). Interpretable Machine Learning for Science with PySR and SymbolicRegression.jl. arXiv:2305.01582.

Dean, T., and Boddy, M. (1988). An analysis of time-dependent planning. AAAI-88, 49-54.

Fedus, W., Zoph, B., and Shazeer, N. (2022). Switch Transformers. *JMLR* 23(120).

Frantar, E., et al. (2022). GPTQ. arXiv:2210.17323.

Geng, S., et al. (2023). Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning. EMNLP. https://doi.org/10.18653/v1/2023.emnlp-main.674

GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. ICPE. arXiv:2601.17551.

HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. ACL. https://doi.org/10.18653/v1/2026.acl-long.353

Horowitz, M. (2014). Computing's energy problem (and what we can do about it). ISSCC. https://doi.org/10.1109/ISSCC.2014.6757323

Horvitz, E. J. (1987). Reasoning about beliefs and actions under computational resource constraints. UAI. arXiv:1304.2759.

Howard, R. A. (1966). Information value theory. *IEEE Transactions on Systems Science and Cybernetics* 2(1):22-26. https://doi.org/10.1109/TSSC.1966.300074

Hubert, T., et al. (2025). Olympiad-level formal mathematical reasoning with reinforcement learning. *Nature*. https://doi.org/10.1038/s41586-025-09833-y

Kwon, W., et al. (2023). Efficient Memory Management for Large Language Model Serving with PagedAttention. arXiv:2309.06180.

Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development* 5(3):183-191. https://doi.org/10.1147/rd.53.0183

Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. ICML.

Lin, J., et al. (2024). AWQ. MLSys. arXiv:2306.00978.

Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. arXiv:2406.18665.

PEARL (2025). Performance and energy aware routing for LLMs. *Future Generation Computer Systems* 176:108218. https://doi.org/10.1016/j.future.2025.108218

Raposo, D., et al. (2024). Mixture-of-Depths. arXiv:2404.02258.

Russell, S., and Wefald, E. (1991). Principles of metareasoning. *Artificial Intelligence* 49:361-395. https://doi.org/10.1016/0004-3702(91)90015-C

Shazeer, N., et al. (2017). Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer. ICLR. arXiv:1701.06538.

Simon, H. A., and Kadane, J. B. (1975). Optimal problem-solving search: all-or-none solutions. *Artificial Intelligence* 6(3):235-247. https://doi.org/10.1016/0004-3702(75)90002-8

Snell, C., Lee, J., Xu, K., and Kumar, A. (2024). Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters. arXiv:2408.03314.

Sui, Y., et al. (2025). Stop Overthinking: A Survey on Efficient Reasoning for Large Language Models. arXiv:2503.16419.

Trinh, T. H., et al. (2024). Solving olympiad geometry without human demonstrations. *Nature* 625:476-482. https://doi.org/10.1038/s41586-023-06747-5

Udrescu, S.-M., and Tegmark, M. (2020). AI Feynman. *Science Advances* 6(16). https://doi.org/10.1126/sciadv.aay2631

Varshney, N., and Baral, C. (2022). Model cascading. EMNLP. https://doi.org/10.18653/v1/2022.emnlp-main.756

Viola, P., and Jones, M. (2001). Rapid object detection using a boosted cascade of simple features. CVPR. https://doi.org/10.1109/CVPR.2001.990517

VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. arXiv:2509.04827.

Zilberstein, S. (1996). Using anytime algorithms in intelligent systems. *AI Magazine* 17(3).

<div id="ii-appendix-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## II. 附录. 可复现性

```bash
cargo test --workspace
cargo run -p mol-cli -- prove   # expect 43 VERIFIED lines (A1 to A14 included), exit 0
cargo run -p mol-cli -- arena   # refresh the arena table from a real run only
```
