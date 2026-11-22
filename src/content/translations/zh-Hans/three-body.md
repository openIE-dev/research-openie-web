---
title: "AGI 的追求解决了计算中的三体问题"
deck: "计算系统最常在规范、构建和使用它们的人员之间的交接点失败。在每个交接点检查每个假设，可以得到一个修正停留在其发生之处的堆栈。"
lang: "zh-Hans"
source: "three-body"
complete: true
---

<div id="the-pursuit-of-agi-resolves-the-three-body-problem-in-computing" class="anchor-alias" aria-hidden="true"></div>

*修订版 395f081，2026 年 11 月 4 日。LaTeX PDF：[/pdfs/latex/three-body.pdf](/pdfs/latex/three-body.pdf) ([源文件](/pdfs/latex/three-body.tex)).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 摘要

大型工程失效常常起始于一个团队向另一个团队交接工作且假设未被书面记录的情形。本文定义了这些交接，说明何时检查它们能够使系统保持稳定，并给出可能证伪的测试。

**用平常话说**

1. 大多数重大计算机失效发生在团队或部件之间的交接处，而非内部。
2. 原因通常是一项未被记录的猜测，例如某个数值的单位。
3. 若将每一项此类猜测书面化并由机器进行检查，则在某处进行的修复能够保持不变且不会破坏其上层的任何内容。

<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. 论点

在刘慈欣的小说《三体》[1]中，文明居住在围绕三颗恒星运行的行星上。由于无法预测相互引力下的三体位置，其季节没有规律。本文的标题借用了这一计算图景，并将其反转：不稳定性是真实存在的，但它有可定位的原因，且该原因可以被消除。

计算系统由三体构成。**理论家**规定系统应当如何工作：数学、规范、算法、物理模型。**制造者**实现系统：芯片设计者、编译器和内核编写者、库作者、集成者。**用户**运行系统：操作员、下游程序、依赖其输出的人员和机器。每一体都具备能力并内部一致。定理成立。芯片符合其数据手册。用户遵循文档。

问题出现在它们之间。每一次从一体到另一体的交接都携带假设：关于单位、电压、范围、时序、内存、编码、版本、运行包线以及意图。当每一体假设交接不存在，或认为这是他人的职责时，这些假设从未被写下来，而未写下的假设永远不会被检查。

**核心论点。** 计算系统的不稳定性位于其未检验的接口，而非各体本身。认真追求通用人工智能（AGI），将其视为必须在每一体和每一层堆栈上都能正确运行的系统，迫使所有接口假设必须明确并经检验。所有接口假设均明确且经检验的堆栈在精确意义上是稳定的：在某一层做出的修正在该层保持正确，并传递至其上的每一层。这就是标题所指的解决方案。

该论点属于工程与理论范畴。它在[第 5 节](#5-definitions-and-propositions)中给出定义，基于[第 4 节](#4-the-interface-literature)中回顾的接口文献，证据来源于独立测试验证的系统（[第 6 节](#6-the-stabilized-configuration)），并提供了可以击败该论点的协议和反例（[第 8 节](#8-protocols)和[第 9 节](#9-falsifiers)）。

<div id="2-the-three-body-problem-and-what-the-analogy-carries" class="anchor-alias" aria-hidden="true"></div>

## 2. 三体问题，以及类比的含义

<div id="21-what-the-physics-says" class="anchor-alias" aria-hidden="true"></div>

### 2.1 物理学原理

牛顿以闭式解求得了相互引力作用下两体的运动：每个体围绕它们的共同质心沿圆锥曲线运动。加入第三体后，问题的性质发生了改变。庞加莱为奥斯卡二世国王奖撰写的论文，于 1890 年发表在 *Acta Mathematica* 上，表明除经典积分外，三体问题不存在能够将其化为求积的进一步积分；在纠正其首次提交中的错误时，他发现了围绕一个周期轨道的轨迹纠结，这被认为是决定性混沌的首次出现 [2, 3]。Barrow‑Green 的历史著作追溯了从奖项到纠正后论文的整个过程 [3]。

“没有一般的闭式解”需要谨慎使用，因为这一说法常被夸大。Sundman 在 1912 年和 1913 年发表的工作表明，只要总角动量不为零，三体问题确实存在一个对所有时间收敛的级数解 [4]，而 Wang 在 1991 年将全局级数解推广到 n 体问题 [5]。这些级数收敛极其缓慢，以至于在预测上毫无用处。庞加莱结果的实际意义仍然成立：不存在简单公式，且相近的初始条件可以呈指数分离，因此无法对一般配置进行远程预测。Lorenz 在 1963 年的三变量对流模型中发现了相同的敏感性 [6]。Stone 和 Leigh 在 2019 年表明，混沌的、非层次的三体问题可以用统计方式描述，即通过其结果的分布来描述，尽管单个轨迹无法预测 [7]。

<div id="22-the-special-stable-configurations" class="anchor-alias" aria-hidden="true"></div>

### 2.2 特殊稳定构型

混沌是一般情形，而非唯一情形。拉格朗日于 1772 年发现，三个天体可以在共同旋转的同时保持各自的相对位置：排列成一条直线，或位于等边三角形的三个顶点处 [3]。在限制性问题中，当第三个天体质量极小时，这五个点即为拉格朗日点。当较大主天体相对于较小主天体足够重时，三角形平动点是线性稳定的；这一条件由劳斯于 1874 年给出（质量比约大于 25）[8]。正因如此，航天器如今停泊于日地拉格朗日点附近。此外还存在更多周期解：穆尔于 1993 年通过数值方法发现了八字形轨道 [9]，陈西纳和蒙哥马利于 2000 年对等质量情形证明了其存在性 [10]，苏瓦科夫和德米特拉希诺维奇于 2013 年发现了新的轨道族 [11]。

本文从这些解的形态中汲取启示。每一种稳定构型都是一种特殊排列，在随天体一同运动的参考系中，天体之间的力恰好达到平衡。稳定性并非任何单个天体的属性，而是天体之间关系的属性，以及使这些关系保持不变的参考系的属性。

<div id="23-analogy-and-mechanism" class="anchor-alias" aria-hidden="true"></div>

### 2.3 类比与机制

从物理学借用的比喻可能产生误导。下表将本文用作类比的内容与本文主张为机制的内容加以区分。

| 三体问题 | 在计算中 | 本文中的地位 |
|---|---|---|
| 三个质量体，各自单独时简单明了 | 理论家、制造者与用户，各自单独时内部一致 | 类比 |
| 不稳定性源于相互作用，而非源于任何单个质量体 | 故障发生在接口处，而非发生在各主体内部 | 机制，由第 3 节的故障研究及第 4 节的文献支持 |
| 对初始条件的敏感依赖性 | 某一接口处未经检查的微小不匹配，在跨层传播过程中不断放大 | 机制，表述为命题 2 |
| 不存在有用的一般封闭形式 | 没有任何单个主体能够仅凭自身模型预测整个系统的行为 | 类比；计算领域不存在运动方程 |
| 在共转参考系中存在稳定构型 | 若一个栈的所有接口假设均经过检验，则修正在其产生之处得以保持 | 机制，表述为命题 3 |
| 混沌结果的统计描述 [7] | 即便无法预测单次故障，在大 N 条件下仍可测量故障率 | 方法，用于第 8 节的协议 |

本文从不主张计算服从牛顿动力学、接口施加力，或可为某个组织计算李雅普诺夫指数。物理学提供了词汇与一条结构性启示：稳定性来自关系，且存在于特殊构型之中，而非存在于一般情形之中。

<div id="3-the-three-bodies-of-computing-and-their-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 3. 计算的三体及其接口

![三体（理论家、制造者和用户）的示意图，绘制为三角形角上的圆。每两个体之间的边缘是一个接口，标注跨越它的假设：理论家到制造者携带规范、其单位和工作范围；制造者到用户携带 API、版本以及电压和时序限制；用户到理论家携带实际使用、观察到的失效以及从未书写的意图。每条带的虚线部分标记了未被任何主体记录或检查的假设。](/figures/three-body/three-bodies.svg)

*图 1. 三体及其三条接口。示意图。各体绘制为实心，因为每个体单独是连贯的。虚线带是未检验的假设，失效由此产生。提供了一个 [PNG 副本](/figures/three-body/three-bodies.png)。*

<div id="31-theorist-to-maker" class="anchor-alias" aria-hidden="true"></div>

### 3.1 理论家到制造者

理论家的陈述假设了一个域：单位、范围、工作包线、理想化机器。制造者的实现假设该陈述是完整的。当双方都未将包线写下来时，实现只能在一个并非其实际运行环境的世界中是正确的。

1999 年火星气候轨道器的损失是教材式的案例。事故调查委员会发现，地面软件提供的推进剂脉冲数据使用英制单位（磅力·秒），而导航软件期望的是公制单位（牛顿·秒），且该错误在巡航阶段累计，导致飞船进入大气层时的高度远低于计划高度[12]。每一方各自完成了自己的工作。单位是一个无人检查的接口假设。

<div id="32-maker-to-user" class="anchor-alias" aria-hidden="true"></div>

### 3.2 制造者到使用者

制造者发布接口，用户依赖该接口。文档中说明了部分契约，剩余部分则由实现的实际行为决定。Hyrum 的观察给出其后果：只要有足够多的 API 使用者，系统的每一种可观察行为都会被某人依赖，无论契约承诺了什么 [13]。Spolsky 关于泄漏抽象的文章提出互补观点：每个非平凡抽象在某种程度上都会暴露其原本要隐藏的内容 [14]。

1996 年 Ariane 5 的首次飞行展示了制造者假设如何传递给新用户。调查委员会发现，来自 Ariane 4 的惯性参考软件将与水平速度相关的 64 位浮点值转换为 16 位有符号整数；在更快的 Ariane 5 轨道上，该值超出范围，转换引发异常，两个参考单元均关闭，发射器在飞行序列开始约 40 秒后解体 [15]。该软件对其编写时的工作包是正确的。工作包是一种随代码一起传播、未被重新声明或检查的接口假设 [15, 16]。

相同的模式也出现在硬件边界。指令集是一种供应商会修订的契约。RISC‑V 的非特权规范列出了若干已批准的基础指令集以及一个日益增长的已批准扩展列表 [17]。Apple 在 2020 年将 Mac 从 Intel 处理器迁移到 Apple silicon，并提供 Rosetta 作为面向早期契约构建的应用程序的翻译层；Apple 的页面还说明，从 macOS 28 起 Rosetta 将仅保留用于某些较旧的游戏 [18]。翻译层本身也是一个有明确终点的接口。软件如果假设指令契约是固定的，就会遇到未预期的修订，解决办法是再添加一个接口层。

<div id="33-user-to-theorist" class="anchor-alias" aria-hidden="true"></div>

### 3.3 使用者到理论家

返回路径是最少被检视的环节。用户了解系统实际的行为、失效之处以及他们原本想要询问的内容。除非这些认识以修订后的陈述返回给理论家，否则下一次规格说明仍会重复旧有假设。Zave 与 Jackson 对需求的阐述将这一差距明确化：需求是关于环境的陈述，规格说明是接口层面的陈述，而连接两者的领域知识往往未被书写[19]。Hooker 的“硬件彩票”展示了返回路径的逆向工作方式：研究思路的成败取决于当时可获得的硬件和软件，而非仅凭其本身价值，因此制造者的构建方式决定了理论家能够思考的范围[20]

<div id="34-why-the-instability-looks-irreducible" class="anchor-alias" aria-hidden="true"></div>

### 3.4 为什么不稳定性看起来不可约简

每个主体只能看到其自身连贯的模型。从任一主体内部来看，上述失效表现为运气不佳或他人的错误，因为原因位于没有任何主体拥有的边界上。这是对“三体没有简单公式”这一论断的计算对应：没有单一参与者的模型能够预测整体。Sculley 等人发现机器学习系统内部存在相同的结构，其中模型代码仅是系统的一小部分，而大部分维护成本存在于胶水代码、配置、数据依赖以及未声明的消费者，即接口[21]。

<div id="4-the-interface-literature" class="anchor-alias" aria-hidden="true"></div>

## 4. 接口文献

本论文的各个组成部分并非新颖之见，其贡献在于将它们整合为一个统一的论断，并附以一套稳定化配置与一项测试。

**结构遵循通信。** Conway 于 1968 年观察到，设计系统的组织所产生的设计会复制该组织的通信结构 [22]。MacCormack、Baldwin 与 Rusnak 对由紧耦合与松耦合组织分别构建的配对产品进行了镜像假说检验，发现产品架构的差异方向与预测一致 [23]。若各主体之间不跨越某条边界进行通信，则系统在该边界处存在一个未经审查的接口。

**接口是设计知识的所在。** Parnas 于 1972 年提出，系统应按各模块所隐藏的决策来划分模块，使得某一决策的变更被限制在单一模块之内 [24]。Baldwin 与 Clark 将此推广为设计规则：预先固定可见的接口决策，隐藏模块则可在其后自由变化 [25]。Henderson 与 Clark 表明，成熟企业在架构创新方面往往遭遇失败，所谓架构创新是指改变已知组件之间的连接方式，原因在于其对接口的知识嵌入于组织结构之中，从未得到审视 [26]。

**正确性必须在端点处加以验证。** Saltzer、Reed 与 Clark 的端到端论证认为，一项功能只有借助端点处应用层的知识才能完整而正确地实现，因此低层的检查至多是性能辅助手段 [27]。该论证并非主张中间接口无需检查，而是指出，凡是关乎实质的属性，必须在其语义可知之处加以验证。

**契约使假设显式化。** Hoare 于 1969 年为程序引入了前置条件与后置条件 [28]。Meyer 将其发展为契约式设计，其中每个例程均声明其所要求的条件与所保证的结果 [29]。Liskov 与 Wing 定义了一个组件可替换另一个组件的条件：即在保留其用户所依赖的行为的前提下 [30]。上述每一种方式都是将接口假设明确记录下来，以便对其进行检验。

**复用在假设不匹配时失败。** Garlan、Allen 与 Ockerbloom 于 1995 年发现，由现有部件构建系统之所以失败，是因为每个部件对其他部件均存在隐式假设，涉及控制、数据、协议及环境等方面，且这些假设相互冲突 [31]。2009 年重新审视该问题时，他们发现问题依然存在 [32]。

**事故是交互失效的结果。** Leveson 的系统理论方法将安全视为一个控制问题：事故源于各组件之间的不安全交互，而这些组件本身均满足各自的规格说明 [33]。Cook 关于复杂系统失效的简短论述从运维角度得出了相同结论：灾难性事故需要多重失效的共同作用，且系统通常在降级模式下运行 [34]。Lehman 关于软件演化的观察进一步引入了时间维度：在现实世界中被使用的程序必须持续变更，且若不主动加以控制，其复杂性将不断增长 [35]。

**经过验证的内核表明，边界可以成为一项证明。** seL4 是首个具有机器检验证明的通用操作系统内核，该证明确认其实现满足其规格说明 [36]。该证明是一次完全化的接口检查：在规格说明与代码之间，不存在任何假设。

<div id="5-definitions-and-propositions" class="anchor-alias" aria-hidden="true"></div>

## 5. 定义与命题

<div id="51-definitions" class="anchor-alias" aria-hidden="true"></div>

### 5.1 定义

**定义 1（主体）。** 主体是对系统拥有内部一致模型的参与方：理论家、制造者或使用者。主体可以是个人、团队、组织或程序。

**定义 2（接口）。** 接口是两个主体之间，或堆栈的两个层级之间的交接点，其中一方的输出成为另一方的输入。

**定义 3（接口假设）。** 接口假设是一个关于跨越接口的值的谓词 $a$，接收方依赖该假设以保证自身的正确性。示例：单位、范围、类型、电压、时序界限、版本、包络。

**定义 4（已检查和未检查）。** 当机制在每一次交叉时评估 $a$，并在 $a$ 失败时拒绝该交叉时，假设被视为已检查。未检查的假设是指其被依赖但既未书面记录也未进行评估。

**定义 5（堆栈）。** 堆栈是一个层级序列 $L_0, \dots, L_n$，其中每一层仅通过它们之间的接口消费下层的输出。一个主体可以拥有多个层级；一个接口可以连接两个主体或同一主体的两个层级。

**定义 6（通用代理）。** 根据 Legg 和 Hutter 的定义，通用代理是其性能在广泛环境类中进行衡量的代理，而非针对单一任务 [37]。Morris 等人通过性能和通用性两方面对 AGI 水平进行操作化 [38]。本文关注的属性是跨主体的通用性：代理必须能够作为理论家、制造者和使用者，并在堆栈的每一层级上发挥作用。

<div id="52-propositions" class="anchor-alias" aria-hidden="true"></div>

### 5.2 命题

**命题 1（故障源于未检查的接口）。** 如果每个主体相对于其自身模型都是正确的，则组合系统的每一次故障必然违背至少一个接口假设；若每个假设都被检查，则首次被违背的假设将在其出现的接口处被拒绝。

*证明思路。* 若每个主体相对于其输入是正确的，并且每个输入满足该主体依赖的假设，则通过对堆栈的归纳可得组合是正确的。因此，故障必然涉及某个交叉点上假设的失效。若该假设已被检查，则在该交叉点即被拒绝，故障定位于该接口且不会传播。 ∎

**命题 2（未检查的不匹配会传播）。** 若 $L_k$ 与 $L_{k+1}$ 之间的接口假设未被检查，则该接口的违背可能在 $k$ 之上的每一层产生错误值，并且在 $k$ 之上仅以该层自身术语表述的检查无法定位该错误。

*思路。* $k$ 之上的层仅看到 $L_{k+1}$ 的输出，而这些输出相对于 $L_{k+1}$ 的模型是形式良好的。火星气候轨道器即为实例：其导航解在内部是一致的，却是错误的 [12]。

**命题 3（稳定配置）。** 在一个每个接口假设都明确且已检查的堆栈中，若在 $k$ 层进行的校正通过了其自身边界的检查，则其他边界的所有已建立属性保持不变，且 $k$ 之上的每一层都以原样继承该校正。

*思路。* 其他边界的检查对跨越这些边界的值求值谓词。校正后的 $L_k$ 仅改变跨越 $L_k$ 边界的值，其输出满足上层边界已检查的假设。每个 $k$ 之上的层仅通过已检查的接口消费 $L_k$，因此只要校正后的 $L_k$ 满足该接口，消费者就会得到正确的输入。 ∎

**命题 4（追求 AGI 强制显式化）。** 设定义 6 中的通用代理必须在跨越所有三体及堆栈所有层的任务上通过正确性门。则对于每个被任务分布跨越的接口，要么代理将接口假设显式化并进行检查，要么存在一个任务，其成功依赖于对该假设的未检查猜测。

*论证。* 一个狭窄系统可以依赖其唯一环境的约定：固定的单位制、固定的指令集、固定的版本。通用代理面临的环境在这些约定上可能各不相同，这是通用性的构造所致。必须检测到在一种环境中成立而在另一环境中失效的假设才能处理它，而检测本身即是检查。正确性门是一种测试，运行要么通过要么失败，没有部分得分。在此门下，恰好错误的猜测等同于任务失败，而非部分得分。因此，在门的约束下追求通用性会促使代理在其触及的每个边界上采用显式、已检查的接口。该命题并未声称任何现有系统已满足此标准，只是说明目标的要求。

**命题 5（焦耳对稳定构型进行排序）。** 在通过门的堆栈中，优先选择以最小能量完成每个接口的那一个，并且在接口处一次性进行的显式检查，其工作负载成本低于在其上层每一级都重新发现的失败。

*概述。* 排序顺序为先门后排名：正确性是每个候选者必须满足的约束，而以焦耳计的完成能量仅对满足该约束的候选者进行排序，类似于在约束优化中目标函数仅在可行集合上比较。边界处的检查在每次跨越时具有固定成本。未检查的不匹配在其到达的每一级都会产生成本，并且该成本会在每次运行中重复，直至发现不匹配。

<div id="6-the-stabilized-configuration" class="anchor-alias" aria-hidden="true"></div>

## 6. 稳定构型

![Diagram of the same three bodies, now arranged at the corners of an equilateral triangle inside a rotating frame, in the manner of the Lagrange configuration. Each interface band is solid and carries a check mark and a short label: the specification written once, the gate at entry, and the trace and receipt that return to the theorist. At the centre sits a shared frame labeled one specification, one gate, joules as the ranking.](/figures/three-body/stabilized.svg)

*图 2. 稳定配置。示意图。在物理学中，三体在随它们一起旋转的坐标系中保持相对位置不变。在计算中，共享框架是一种显式、机器可检验的意图声明，所有接口假设均已检查，从而三体在系统变化时保持其关系。提供了一个 [PNG copy](/figures/three-body/stabilized.png)。*

<div id="61-the-shared-frame" class="anchor-alias" aria-hidden="true"></div>

### 6.1 共享框架

拉格朗日的配置仅在随物体运动的参考系中保持稳定。其计算对应物是所有三个实体共同读取和写入的共享表示，其中每个接口假设都是可检查的陈述：形式规范、机器检查的合约或类型。当理论家的陈述、制造者的实现以及用户的观测行为通过对这种表示的检查相互关联时，它们之间的交接是检查而非翻译。

<div id="62-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 6.2 每个接口假设都明确

![Diagram of a stack with six levels from intent at the top through specification, gate, projections and runtime to hardware and energy. Between each pair of adjacent levels sits an interface drawn as a small gate with its assumption and its check written beside it. A correction made at the runtime level is drawn with arrows rising through each checked interface to the levels above.](/figures/three-body/stack-checks.svg)

*图 3. 每个接口均已检查的堆栈。图示。提供了一个 [PNG copy](/figures/three-body/stack-checks.png)。*

该方法包括三步。列出堆栈的每一个边界。对于每个边界，写出接收方依赖的假设（以谓词形式），并命名在每次跨越时评估该假设的机制。当检查失败时，断点位于该边界；在该层进行纠正，通过该边界的检查后，纠正结果被上层继承。

<div id="63-evidence-from-verified-systems" class="anchor-alias" aria-hidden="true"></div>

### 6.3 来自已验证系统的证据

存在符合命题 3 所述的稳定配置的证据，来自于独立团队构建并测试的系统。

- **在随机测试下的已验证编译器。** CompCert 是一款 C 编译器，其优化的中端和后端携带机器检查的证明，保证生成的代码保持源代码的语义[39]。Yang、Chen、Eide 和 Regehr 使用随机程序生成器 Csmith 对 CompCert 以及许多其他编译器进行测试。他们在其他编译器中报告了数百个此前未知的 bug。在 CompCert 中他们未发现已验证中端的错误代码错误。所发现的缺陷位于证明之外的部分，例如前端以及对目标的未验证假设[40]。正如命题 1 和命题 2 预测的那样，错误出现在未检查的假设处，而不是已检查的边界上。
- **已验证的内核边界。** seL4 的证明将其 C 实现关联到抽象规范，使得在规范与代码之间不作任何假设[36]。该证明相对于关于编译器、汇编代码和硬件的显式假设陈述，这展示了第 6.2 节方法的实际应用：剩余假设被写成剩余接口。
- **工业实践中的规范。** Newcombe 等人报告称，亚马逊网络服务的工程师为核心分布式系统编写了 TLA+ 规范，模型检查发现了细微的设计缺陷，其中一些需要很长的事件序列，且在审查和测试中未被发现[41]。
- **作为检查接口的单位。** Kennedy 的维度类型将量的单位作为其类型的一部分，因此 pound‑force‑second 值在没有显式转换的情况下不能传递给期望 newton‑second 值的地方[42]。导致火星气候轨道器失效的接口假设[12]在编译时即被拒绝。

这些证据来自于每个单独系统，且在构建时已考虑检查。它表明稳定配置确实存在并且可以维持。但它并未表明该配置能够扩展到跨越多个组织的堆栈。第 8 节的协议正是为此而编写的，以进行测试。

<div id="7-the-hardware-side" class="anchor-alias" aria-hidden="true"></div>

## 7. 硬件方面

硬件边界是接口假设变为物理现实之处：供电电压、热包络、内存模型、指令契约。第 3.2 节以指令契约为例，说明了制造者接口随时间修订的情况 [17, 18]。如果一个技术栈将硬件视为固定不变，那么其最底层就存在一个未经审查的接口，而命题 2 表明，该处的失配可以波及上方的每一个层级。

在本论文中，硬件侧是一系列待明确化的接口，且硬件结果与软件在相同的准入门槛和相同的能源排名下进入系统。

<div id="8-protocols" class="anchor-alias" aria-hidden="true"></div>

## 8. 协议

每个协议在运行前已固定。能量数值带有三种标签之一：`est_j` 表示分析估计，`reported_j` 表示来自操作系统或片上计数器的读取，`measured_j` 表示来自外部功率计的读取。

<div id="81-interface-inventory" class="anchor-alias" aria-hidden="true"></div>

### 8.1 接口清单

对于目标系统，列举所有主体之间以及层级之间的接口。对于每一个接口，记录假设作为谓词、其所有者以及是否有机制对其进行检查。报告被检查的假设所占比例，以及没有所有者的假设所占比例。两位独立审计员对同一系统进行清点；报告他们的一致性。

<div id="82-break-and-catch" class="anchor-alias" aria-hidden="true"></div>

### 8.2 中断与捕获

对于每条已记录的假设，在固定种子集上于该接口处注入一次违规。记录该违规是在该接口处被拒绝、在后续层级被捕获，还是未被捕获。命题 1 预测，已检查的假设将在其自身接口处被拒绝。命题 2 预测，未经审查的假设即便被捕获，也会在更后的层级被捕获，且无法定位其来源。

<div id="83-compounding" class="anchor-alias" aria-hidden="true"></div>

### 8.3 复合

在 $R$ 轮固定工作负载下，分别在未提升和在选定层级提升一个校正的情况下运行。记录每轮的升级次数、失败次数和能耗。命题 3 预测，加入校正后各轮的累计升级次数不高于未加入时，并且在提升前检查的属性在提升后不会失效。

<div id="84-cross-body-handoff" class="anchor-alias" aria-hidden="true"></div>

### 8.4 跨体交接

选择一次真实的组织间交接：向实现者传递的规范、向下游用户提供的库，或向软件交付的硬件修订。将交接表达为具有明确假设的共享表示，执行跨其的 break and catch 协议，并与通过文字文档进行的相同交接进行比较。报告每一侧在接口处定位的失败，并给出 Wilson 95% 区间。

<div id="85-generality-under-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 8.5 门下的通用性

构建一个任务集合，使接口的约定多样化：单位、指令合约、库版本、编码。对代理进行正确性门限评估。命题 4 预测，要在多样化集合中取得成功，需要检测约定，因此显式检查接口假设的代理应在多样化任务中通过的比例高于假设默认约定的代理，而在默认任务上的成功率相匹配。按完成所消耗的焦耳数对通过的代理进行排序。

<div id="9-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 9. 证伪者

在所测试的运行之前固定。

| ID | 观测内容 | 推翻对象 |
|---|---|---|
| TBP-F1 | 在中断与捕获协议中，对某一已检查假设的违反在其自身接口处被接受 | 命题 1（就被测系统而言） |
| TBP-F2 | 在复合协议中，通过自身边界检查的修正导致另一边界处原本通过的检查失败 | 命题 3 |
| TBP-F3 | 在跨主体协议中，共享表示在区间内定位到的接口失效数量不多于散文文档 | 显式已检查接口能稳定主体间交接的论断 |
| TBP-F4 | 在泛化协议中，采用默认假设的智能体在匹配默认性能的条件下，通过多样化任务的比率不低于进行检查的智能体 | 命题 4 |
| TBP-F5 | 对一个运行中系统的接口清单发现了若干失效，其成因无法归因于任何接口假设，且每个主体就其自身模型而言均正确 | 关于不稳定性的接口解释 |

<div id="10-limits-of-the-argument" class="anchor-alias" aria-hidden="true"></div>
<div id="10-scope-and-method" class="anchor-alias" aria-hidden="true"></div>

## 10. 范围与方法

物理作为结构进入。它提供了实体、关系和稳定配置的词汇表，且每个命题都以计算本身的术语陈述并检验。对灵敏度的主张实际上是关于结果如何依赖未检视的不匹配的主张，这些主张在大样本下以统计方式测量，方式类似 Stone 和 Leigh [7]。

显式性是被保持的，而非被声明的。假设在系统遇到新环境时浮现，而程序所服务的世界持续变化 [35]。因此该方法将每个被发现的假设视为需要关闭的新接口：以谓词形式书写，给出检查，并在命题 3 下保持检查。稳定的配置如同在拉格朗日点附近的航天器通过持续站位保持来维持。

分析单元是角色之间的交接。一个人在一个下午内可以是理论家、制造者和使用者，因此该方法适用于任何交接发生的场景，无论是在同一团队内部还是跨组织之间。所有构建系统的方法：：从形式化方法到带测试的大模型，再到手写代码加审查：：都通过同一度量进行定位：其接口假设中显式且已检查的比例，取自第 8.1 节的清单协议。

<div id="11-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 11. 结论

三体问题教会物理学：不稳定性可以源于简单部件之间的关系，而当稳定性出现时，它是这些关系在共享框架中的一种特殊排列。计算也有其自身的三体：：理论家、制造者和使用者，其不稳定性来源于它们之间的接口，在这些接口上假设会交叉且未被书面记录或检查。一个旨在实现通用智能的系统必须在所有三体以及堆栈的每一层上进行操作，因此不能将这些假设隐含留下。认真对待这一目标意味着要把每一个接口假设写下来，并在每一次交叉时进行检查。在这样构建的堆栈中，修正会保留在产生的地方并向上传播，系统在变化时仍保持其形态。这就是 AGI 追求如何在计算中解决三体问题的方式。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

[1] Liu Cixin, *The Three-Body Problem*, translated by Ken Liu. Tor Books, 2014. Original Chinese edition 三体, Chongqing Publishing House, 2008. ISBN 978-0-7653-7706-7.

[2] H. Poincaré, "Sur le problème des trois corps et les équations de la dynamique," *Acta Mathematica* 13, 1890, pp. 1 to 270. Introduction: doi:10.1007/BF02392506

[3] J. Barrow-Green, *Poincaré and the Three Body Problem*. History of Mathematics 11, American Mathematical Society, 1997. doi:10.1090/hmath/011

[4] K. F. Sundman, "Mémoire sur le problème des trois corps," *Acta Mathematica* 36, 1913, pp. 105 to 179. doi:10.1007/BF02422379

[5] Q. Wang, "The global solution of the N-body problem," *Celestial Mechanics and Dynamical Astronomy* 50, 1991, pp. 73 to 88. doi:10.1007/BF00048987

[6] E. N. Lorenz, "Deterministic Nonperiodic Flow," *Journal of the Atmospheric Sciences* 20(2), 1963, pp. 130 to 141. doi:10.1175/1520-0469(1963)020<0130:DNF>2.0.CO;2

[7] N. C. Stone and N. W. C. Leigh, "A statistical solution to the chaotic, non-hierarchical three-body problem," *Nature* 576, 2019, pp. 406 to 410. doi:10.1038/s41586-019-1833-8

[8] E. J. Routh, "On Laplace's Three Particles, with a Supplement on the Stability of Steady Motion," *Proceedings of the London Mathematical Society* s1-6, 1874, pp. 86 to 97. doi:10.1112/plms/s1-6.1.86

[9] C. Moore, "Braids in classical dynamics," *Physical Review Letters* 70, 1993, pp. 3675 to 3679. doi:10.1103/PhysRevLett.70.3675

[10] A. Chenciner and R. Montgomery, "A Remarkable Periodic Solution of the Three-Body Problem in the Case of Equal Masses," *Annals of Mathematics* 152(3), 2000, pp. 881 to 901. doi:10.2307/2661357

[11] M. Šuvakov and V. Dmitrašinović, "Three Classes of Newtonian Three-Body Planar Periodic Orbits," *Physical Review Letters* 110, 114301, 2013. doi:10.1103/PhysRevLett.110.114301

[12] Mars Climate Orbiter Mishap Investigation Board, *Phase I Report*. NASA, 10 November 1999. https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf

[13] H. Wright, "Hyrum's Law." https://www.hyrumslaw.com/

[14] J. Spolsky, "The Law of Leaky Abstractions," *Joel on Software*, 11 November 2002. https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/

[15] J. L. Lions (chair), *Ariane 5 Flight 501 Failure: Report by the Inquiry Board*. European Space Agency, 19 July 1996. https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf

[16] G. Le Lann, "An analysis of the Ariane 5 flight 501 failure: a system engineering perspective," *Proceedings of the IEEE International Conference on the Engineering of Computer-Based Systems*, 1997, pp. 339 to 346. doi:10.1109/ECBS.1997.581900

[17] RISC-V International, *The RISC-V Instruction Set Manual, Volume I: Unprivileged Architecture*, version 20250508, preface. https://docs.riscv.org/reference/isa/v20250508/unpriv/colophon.html

[18] Apple, "Using Intel-based apps on a Mac with Apple silicon," Apple Support, article 102527, published 21 September 2026. https://support.apple.com/en-us/102527

[19] P. Zave and M. Jackson, "Four Dark Corners of Requirements Engineering," *ACM Transactions on Software Engineering and Methodology* 6(1), 1997, pp. 1 to 30. doi:10.1145/237432.237434

[20] S. Hooker, "The Hardware Lottery," *Communications of the ACM* 64(12), 2021, pp. 58 to 65. doi:10.1145/3467017

[21] D. Sculley, G. Holt, D. Golovin, E. Davydov, T. Phillips, D. Ebner, V. Chaudhary, M. Young, J.-F. Crespo and D. Dennison, "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems* 28, 2015. https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

[22] M. E. Conway, "How Do Committees Invent?" *Datamation* 14(4), April 1968, pp. 28 to 31. https://www.melconway.com/Home/Committees_Paper.html

[23] A. MacCormack, C. Baldwin and J. Rusnak, "Exploring the duality between product and organizational architectures: A test of the 'mirroring' hypothesis," *Research Policy* 41(8), 2012, pp. 1309 to 1324. doi:10.1016/j.respol.2012.04.011

[24] D. L. Parnas, "On the criteria to be used in decomposing systems into modules," *Communications of the ACM* 15(12), 1972, pp. 1053 to 1058. doi:10.1145/361598.361623

[25] C. Y. Baldwin and K. B. Clark, *Design Rules, Volume 1: The Power of Modularity*. MIT Press, 2000. doi:10.7551/mitpress/2366.001.0001

[26] R. M. Henderson and K. B. Clark, "Architectural Innovation: The Reconfiguration of Existing Product Technologies and the Failure of Established Firms," *Administrative Science Quarterly* 35(1), 1990, pp. 9 to 30. doi:10.2307/2393549

[27] J. H. Saltzer, D. P. Reed and D. D. Clark, "End-to-end arguments in system design," *ACM Transactions on Computer Systems* 2(4), 1984, pp. 277 to 288. doi:10.1145/357401.357402

[28] C. A. R. Hoare, "An axiomatic basis for computer programming," *Communications of the ACM* 12(10), 1969, pp. 576 to 580. doi:10.1145/363235.363259

[29] B. Meyer, "Applying 'design by contract'," *Computer* 25(10), 1992, pp. 40 to 51. doi:10.1109/2.161279

[30] B. H. Liskov and J. M. Wing, "A behavioral notion of subtyping," *ACM Transactions on Programming Languages and Systems* 16(6), 1994, pp. 1811 to 1841. doi:10.1145/197320.197383

[31] D. Garlan, R. Allen and J. Ockerbloom, "Architectural mismatch: why reuse is so hard," *IEEE Software* 12(6), 1995, pp. 17 to 26. doi:10.1109/52.469757

[32] D. Garlan, R. Allen and J. Ockerbloom, "Architectural Mismatch: Why Reuse Is Still So Hard," *IEEE Software* 26(4), 2009, pp. 66 to 69. doi:10.1109/MS.2009.86

[33] N. G. Leveson, *Engineering a Safer World: Systems Thinking Applied to Safety*. MIT Press, 2012. doi:10.7551/mitpress/8179.001.0001

[34] R. I. Cook, "How Complex Systems Fail," Cognitive Technologies Laboratory, University of Chicago, 1998. https://how.complexsystems.fail/

[35] M. M. Lehman, "Programs, life cycles, and laws of software evolution," *Proceedings of the IEEE* 68(9), 1980, pp. 1060 to 1076. doi:10.1109/PROC.1980.11805

[36] G. Klein, K. Elphinstone, G. Heiser, J. Andronick, D. Cock, P. Derrin, D. Elkaduwe, K. Engelhardt, R. Kolanski, M. Norrish, T. Sewell, H. Tuch and S. Winwood, "seL4: Formal Verification of an OS Kernel," *Proceedings of the 22nd ACM Symposium on Operating Systems Principles*, 2009, pp. 207 to 220. doi:10.1145/1629575.1629596

[37] S. Legg and M. Hutter, "Universal Intelligence: A Definition of Machine Intelligence," *Minds and Machines* 17(4), 2007, pp. 391 to 444. doi:10.1007/s11023-007-9079-x

[38] M. R. Morris, J. Sohl-Dickstein, N. Fiedel, T. Warkentin, A. Dafoe, A. Faust, C. Farabet and S. Legg, "Levels of AGI for Operationalizing Progress on the Path to AGI," *Proceedings of the 41st International Conference on Machine Learning*, 2024. arXiv:2311.02462

[39] X. Leroy, "Formal verification of a realistic compiler," *Communications of the ACM* 52(7), 2009, pp. 107 to 115. doi:10.1145/1538788.1538814

[40] X. Yang, Y. Chen, E. Eide and J. Regehr, "Finding and understanding bugs in C compilers," *Proceedings of the 32nd ACM SIGPLAN Conference on Programming Language Design and Implementation*, 2011, pp. 283 to 294. doi:10.1145/1993498.1993532

[41] C. Newcombe, T. Rath, F. Zhang, B. Munteanu, M. Brooker and M. Deardeuff, "How Amazon Web Services uses formal methods," *Communications of the ACM* 58(4), 2015, pp. 66 to 73. doi:10.1145/2699417

[42] A. Kennedy, "Types for Units-of-Measure: Theory and Practice," in *Central European Functional Programming School*, Lecture Notes in Computer Science 6299, Springer, 2010, pp. 268 to 305. doi:10.1007/978-3-642-17685-2_8
