---
title: "任务饱和与 AI 需求的总体反弹"
deck: "已公布的数字推理价格暴跌，并不能证明能量免费、执行免费，也不能证明一件杂务完成后价值无界。"
lang: "zh-Hans"
source: "satiation"
complete: true
---

<div id="satiation-and-scarcity-after-free-ai" class="anchor-alias" aria-hidden="true"></div>

*版本 1.1，2026 年 10 月 11 日。数据与代码：[research.openie.dev/data/](/data/#economics)。LaTeX PDF：[/pdfs/latex/satiation.pdf](/pdfs/latex/satiation.pdf)（[源文件](/pdfs/latex/satiation.tex)）。*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 摘要

一旦一项任务完成，在该任务上投入更多的机器工作便不会再增加任何东西。本文精确地定义这一停止点，并把它与另一个独立的问题区分开来：对机器工作的总需求是否会持续增长。

**用平常话说**

1. 每项工作都有一条终点线。越过它之后，在这项工作上再多做的计算机工作都是浪费。
2. 更便宜的计算机工作仍然可能让人们开始多得多的工作，因此总使用量可以继续上升。
3. AI 的货币价格正在快速下降，但它所消耗的电力从来都不是免费的。

许多规划模型把对机器智能的需求当作没有终点线。消费者理论早已包含相反的对象。饱和，以及与之相关的极乐点，是这样一个区域：在其中，某种商品的更多单位不会提高效用，甚至可能降低效用（Andersen，2001）。本文为工作与照护定义一个可操作的近亲概念：当一个明确陈述的完成性谓词成立、后续调用不会把该谓词的任何子句由假变真、并且撤销该谓词的调用属于损害而非价值时，一个循环便达到了任务完成。参与时长、词元数量与席位数量是不同的变量。它们可以在完成之后继续上升。

必须把两种论断分开。任务层面的饱和按定义成立：一旦某项任务的完成性谓词为真，在该任务上更多的合成就买不到任何东西。总体饱和是关于总需求的论断，它并不由前者推出。更便宜的合成可以开启新的任务（Acemoglu 和 Restrepo，2019）并提高总使用量，正如更便宜的煤提高了煤的总使用量（Jevons，1865）。每一项杂务都可以饱和，而对杂务的总需求却可以无界增长。这种反弹是本文的核心识别问题。第 5.1 节给出两个可检验的假设，以及能够识别它们的数据。

第二个事实关乎价格，而非物理。Epoch AI 报告了固定推理性能价格的大幅下降（Epoch AI，2025；Emberson 和 Roodman，2026）。对于输出为信息且完成性检验有限的数字杂务，本文把由此产生的状况称为边际免费。这个说法并不意味着焦耳是免费的，不意味着受控对象可以在没有证书的情况下动作，也不意味着照护劳动已被自动化取代。Landauer 界是擦除的下界，而不是对当前加速器的描述（Landauer，1961；Horowitz，2014）。

本文不报告随机对照试验，不报告完成检测器的错误率，也不报告完成之前与完成之后所耗能量的划分。这些测量已在第 3.3 节中规定，但尚不存在。

<div id="notation" class="anchor-alias" aria-hidden="true"></div>

## 符号与术语

| 术语 | 本文中的定义 |
|------|--------------------------|
| 饱和 | 在所引理论中，指边际效用降到零或零以下。在本文的操作性条款中，指完成之后，后续调用不会把 `C` 的任何子句由假变真；撤销 `C` 的调用属于损害而非价值（第 3.1 节）。 |
| 极乐点 | 一个商品组合，在该点上该商品的额外数量会降低效用。教科书中的对象。本文不作估计。 |
| 任务完成 | 完成性谓词变为真的事件。与模型规模正交。 |
| 工作完成性 | 一个明确陈述的工作停止点：工单关闭、补丁合并、报告提交、账目核对一致，或一个等价的书面检验。 |
| 照护完成性 | 一个明确陈述的照护停止点：评估完成、用药核对完毕、接收方已获通知、当事人处于安全状态，或一个等价的书面检验。 |
| 边际免费 | 一个数字合成步骤的边际价格趋向于捆绑价格或可忽略的货币价格。焦耳与提交仍然有成本。 |
| 通用人工智能（AGI） | 一个宽泛的能力目标。不是价格观测，也不是本文的结果。 |
| 直接反弹 | 当某项服务的有效价格下降时，对同一服务的额外使用（Gillingham、Rapson 和 Wagner）。 |
| 建模 / 仿真 / 板上实测 | 公式、程序执行或仪表。本文的新数字不属于这三类中的任何一类；其经验内容是对已发表序列与文件的引用。 |

范围。第 2 节回顾饱和理论、任务自动化、注意力市场、技术周期证据与推理价格。第 3 节写出各个谓词，并说明哪些未作估计。第 4 节列出依赖于引用的论断，并把它们与设计规则分开。第 5 节回应反弹、照护成本与军事需求。第 6 节列出效度威胁。

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>

## 1. 引言

一条对“智能”具有恒定正斜率的需求曲线，会在一项工作完成之后仍然建议更多席位、更多词元和更多智能体。这一建议是一种建模选择。它不是关于工作的定理。标准的消费者理论允许边际效用下降并越过零。如果一项杂务有完成性谓词，相关的问题就是：更多的模型输出是否会改变该谓词。如果不会，额外的输出就是一种成本，在已写下的目标上没有任何增量。

最近的价格证据所指的方向与合成稀缺相反。Epoch 的序列显示，达到某一给定基准性能的货币价格正在快速下降。开放权重与类型化决策程序（包括 System One）是另外的途径，使一个原本稀缺的生成步骤变得便宜。那些把一项已关闭的杂务仍按合成稀缺来定价的团队，使用的是一个过时的约束。

不能从价格序列推出的约束是物理的和制度的。计算会耗散能量。Horowitz（2014）记录了数据移动与存储器在实际 CMOS 能耗中占主导地位，其量级远高于 Landauer 的理想擦除界。执行器不是词元。签名、临床交接和一笔付款，都不会因为再采样一段文字而被撤回。Baumol（1967）说明了生产率增长缓慢的部门如何吸收不断上升的支出份额。Acemoglu 和 Restrepo（2019）把自动化建模为任务替代，加上可能出现的新任务创造。这些结果都没有说语言模型会终结成本病。它们确实说明，“更多能力”不足以描述价值。

本文的正面论断是定义性的和文献性的。饱和是一个自洽的对象。已发表的推理价格已经急剧下降。参与度指标不是完成性指标。“不要花费”的停止点与“不要动作”的停止点是不同的谓词。反面论断同样重要。本文不识别结构性需求系统，不估计反弹，也不报告实测能量。

<div id="2-related-work" class="anchor-alias" aria-hidden="true"></div>

## 2. 相关工作

<div id="21-satiation-and-bliss-points" class="anchor-alias" aria-hidden="true"></div>

### 2.1 饱和与极乐点

Andersen（2001）在结构变迁的演化模型中处理饱和，而不是把它当作一种口头偏好。对本文而言，持久的要素是经济学上的那一点：对一种商品的边际估值可以降到零。教科书中的极乐点使其几何结构变得明确。对于商品组合 `x*`，效用在某一坐标上超过 `x*` 后不再增加，而一个光滑的表示在那里可以有负的边际效用。一个二次函数的例子，`U(x) = -a (x - x*)^2`，其中 `a > 0`，在 `x*` 处取得最大值，越过该点后导数为负。这个函数是用于讲授定义的模型。它在本研究中并未拟合到任何智能体日志上。本文不报告任何系数 `a`。

操作性的转译需要一个谓词，除非有人把它陈述出来，否则模型并不知道它。当回合 `z` 的书面完成性检验成立时令 `C(z) = 1`，否则为 0。在该回合上饱和，意味着存在一个时刻 `t*`，使得 `C` 在 `t*` 处为 1，并且对之后的所有调用，`C` 的任何子句都不会由假变真。撤销 `C` 的调用属于损害而非价值。第 3.1 节陈述了同一条规则。内部事件**经济完成**是 `C` 变为 1 的时刻；本文把这一事件称为任务完成。这是一个定义。只有在拥有一个带标注的回合集合，以及一个其错误被计数的检测器时，它才成为经验论断。第 4 节不包含这一计数。

Keynes 在 1930 年划出了同一条界线。他把需要分为绝对需要，即无论他人拥有什么都会感到的需要，以及相对需要，即因为满足它能使我们高于他人才会感到的需要。他认为绝对需要是可以被满足的。完成性谓词就是一项任务的绝对需要，被写了下来。相对的和开放式的欲求没有这样的谓词，第 5.2 节把它们排除在论断之外。

<div id="22-tasks-displacement-and-cost-disease" class="anchor-alias" aria-hidden="true"></div>

### 2.2 任务、替代与成本病

Baumol（1967）分析了不平衡增长。如果一个部门的生产率上升而另一个部门没有，停滞部门的相对成本就会上升，即使其数量增长缓慢，它也可能主导支出。医疗、教育与现场表演是常见的例子。后来的卫生经济学论文对其幅度与机制有所争论。本文把 Baumol 用于一条否定性的指示：不要从词元价格的下降推断照护已经变成了一种软件商品。在通常的制度意义上，照护仍然依赖于时间、信任与法律责任。一个文档模型可以增加记录在案的活动，这是一种与 Baumol 相关的含混：被测量的产出可以变动，而照护谓词并不变动。

与 David Autor 相关的劳动经济学文献把工作分解为机器可能执行、也可能不执行的任务。本文所依据的表述是 Acemoglu 和 Restrepo（2019），“Automation and New Tasks: How Technology Displaces and Reinstates Labor”，Journal of Economic Perspectives 33(2)，<https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3>。他们认为，替代会降低劳动的任务份额，而新任务可以使其恢复。一个面向完成性的停止点更接近于完成一项任务，而不是创造一项新的参与型任务。一个没有停止点的智能体循环，可以在没有生产率增益的情况下提高活动指标。这种可能性与他们关于弱自动化的警告是一致的。

<div id="23-attention-and-engagement" class="anchor-alias" aria-hidden="true"></div>

### 2.3 注意力与参与度

Wu 的著作 “The Attention Merchants”（出版社页面：<https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/>）描述了收割注意力并将其转售的企业。Center for Humane Technology 关于注意力经济的概述（<https://www.humanetech.com/youth/the-attention-economy>）是对同一模式的倡导性总结，而不是一项试验。这里使用的推论是有限的。如果一个产品的目标是任务时长，那么一个在 `C = 1` 之后仍然继续的会话可能看起来是成功的。如果目标是 `C`，同一个会话就是浪费或损害。在词元日志中，这两个目标在观测上并不等价。本文中没有任何实验估计福利差距。

<div id="24-historical-cycles" class="anchor-alias" aria-hidden="true"></div>

### 2.4 历史周期

技术市场常常呈现投机阶段、使用阶段和之后的商品化阶段。证据并不均衡。

Quinn（2019），“Technological revolutions and speculative finance: evidence from the British Bicycle Mania”，Cambridge Journal of Economics 43(2)，271-294，<https://doi.org/10.1093/cje/bey029>，研究了 1895 年至 1900 年自行车公司的股价。股价上涨超过 200%，随后下跌超过 75%。该论文的结果关乎投机金融与基本面，而不是关于家庭层面一个经过测量的“自行车已足够”谓词。用它来描绘竞赛阶段的金融是有依据的。把它当作交通饱和的证明则没有依据。

汽车、定期航空与电视在日常意义上拥有类似商品的市场：二手车辆、经收益管理定价的座位，以及作为内容投入品出售的面板。这些行只作历史参照。它们不是回归。放松管制之后航空公司的收益管理是针对一个座位的定价制度，这是座位商品市场存在的证据，而不是旅客的出行需求已在全球饱和的证据。

Pew Research Center 的移动设备情况说明（<https://www.pewresearch.org/internet/fact-sheet/mobile/>）是本文用于手机的普及饱和来源。项目档案记录了在 2024 年和 2025 年的情况说明读数中，美国智能手机拥有率接近 91%。引用这一数字的读者应当打开实时页面，因为情况说明会被修订。高拥有率是扩散的证据。它本身并不是“再多一个手机摄像头的边际价值为零”的证据。

数字杂务这一行，是本文用价格序列而非类比来辩护的那一行。见第 4.2 节。

<div id="25-inference-prices-and-open-weights" class="anchor-alias" aria-hidden="true"></div>

### 2.5 推理价格与开放权重

Epoch AI（2025），“LLM inference price trends”，<https://epoch.ai/data-insights/llm-inference-price-trends>，报告在该说明所涉及的各项基准上，固定性能下的价格每年下降约 9 倍到 900 倍。Emberson 和 Roodman 为 Epoch AI 撰写的（2026）“The plunging price of thought”，<https://epoch.ai/publications/the-plunging-price-of-thought>，报告自大约 2023 年以来，达到给定性能的成本每季度下降约 47%，概括为每年约 13 倍，在前沿附近更快。这些是作者对其数据的总结。本文不重新估计该指数。经济学上的解读是狭窄的：对于固定的已测性能，合成的货币价格一直在快速下降。如果需求有弹性，下降的供给价格会改变需求量。它不会创造新的完成性谓词，也不会把能量价格设为零。

System One 类工具作为一种机制是相关的，它能在具有已知选项集合的决策问题上进一步压低价格。System One 模型在一次前向传播中为每个允许的选项返回一个类型化答案和一个概率，不产生自由文本。TypeSafe AI 以其托管的 Jev 模型为这一类别命名（2026 年 9 月 15 日）。随后出现了开放模型，其中包括 Convai Innovations 的 Laya。System One 模型负责提议。它不是完成性评估。

“前沿能力大约六个月后会到达更便宜的设备”这一规划经验法则，并不是本文所引任何来源中经过测量的常数。蒸馏、量化与查表推理（Ma 等，2024；Wei 等，2024）是已发表的机制，借助它们，某一给定能力可以迁移到更便宜的硬件上。迁移速度是每一对模型各自的经验问题。

<div id="26-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### 2.6 物理成本

Landauer（1961）给出了擦除的界。Bennett（1973）表明，可逆计算在理论上可以避开该界。Horowitz（2014）是关于 CMOS 的实践性表述：每次操作的能量与数据移动的能量决定了设计约束，对于不可逆 CMOS 逻辑，其量级比 `kT ln 2` 高出许多个数量级。在 $T = 300$ K 时，该界为每个被擦除比特 $k_B T \ln 2 \approx 2.87 \times 10^{-21}$ J，其中 $k_B = 1.380649 \times 10^{-23}$ J/K。

Goldman Sachs 发表过一份题为 “Gen AI: Too Much Spend, Too Little Benefit?” 的研究报告（<https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit>）。一份重要的卖方报告质疑基础设施支出相对于收益是否过多，这一点本身是一个文件事实。报告中的美元数字在此不予引用，因为卖方估计值不是科学的能量核算。

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## 3. 定义与方法

<div id="31-predicates" class="anchor-alias" aria-hidden="true"></div>

### 3.1 谓词

设一个回合是一串模型调用或工具调用 `z_1, ..., z_T`，连同一个面向人的状态。完成性谓词 `C` 把回合前缀映射到 `{0, 1}`。下面是一些无需模型评分即可写出的例子：

- 工作：测试通过且改动已合并；或账目差异为零；或报告的必填字段已填写且报告已提交。
- 照护：用药清单与来源一致，接收方临床人员已拿到记录，并且机构标记为关键的安全核查项均为真。

`C` 不是概率。一个输出分数的检测器，仍然需要一个阈值和一张错误表，才能成为第 4 节所缺实验意义上的谓词。

时刻 `t*` 处的内部事件**经济完成**，意味着对所选检验而言，在 `t*` 之前的前缀上 `C = 0`，而在 `t*` 处 `C = 1`。本文把目录中的这一层称为**任务完成**。相对于模型调用的饱和，意味着对所有 `t > t*`，额外的调用都不会把 `C` 的任何子句由假变真。撤销 `C` 的调用属于损害而非价值。这个定义并不是说人总是知道 `t*`。它说的是，如果没有写下任何 `C`，饱和论断就还不是关于该产品的陈述。

边际免费是关于货币价格的陈述。设 `p_t(q)` 为合成服务 `q` 在日期 `t` 的价格。存档的价格证据是：对固定的基准性能，`p_t` 以 Epoch 所报告的速率下降。边际免费意味着 `p_t` 低到这样的程度，以至于席位许可已难以解释该杂务的成本。它并不意味着功率对时间的积分为零。

因此，一条停止规则可以有两类原因：经济原因（谓词成立，或达到预算或策略限制）与物理原因（达到安全或能量限制）。这两类是不同的谓词，应当记录为不同的原因。

<div id="32-what-was-done-in-this-study" class="anchor-alias" aria-hidden="true"></div>

### 3.2 本研究做了什么

本研究是一项结构化的阅读。资料来源是项目在 2026 年 9 月 29 日至 30 日核对过的引用主干，以及关于饱和的笔记。第 3.3 节列出那些能使操作性定义成为经验性定义的测量。

第 4.10 节中的设计规则是以这些定义为条件的建议。它们不是经过估计的处理效应。读者可以拒绝某条规则而不拒绝 Epoch 的价格序列，也可以接受价格序列而不接受某项产品建议。

<div id="33-measurements-specified-and-not-taken" class="anchor-alias" aria-hidden="true"></div>

### 3.3 已规定但尚未进行的测量

**谓词是内生的。** Witt（2001）认为欲求是习得的，因此完成性谓词 $C(z)$ 可能随价格下降而逐步抬高。因此，一项跨越价格变化的饱和研究必须在价格变化之前，在其预注册中冻结 $C(z)$，并把谓词的任何变化作为单独的处理来报告。

**H1 现在就可以从公开数据中读出。** Chen 等人（2024）测量了在第一个正确答案之后所花费的词元；Cuadron 等人（2025）对智能体轨迹中的过度思考进行评分；Bai、Huang 和 Wang（2026）发现，在智能体编程中，同一任务的词元用量在不同运行之间相差可达 30 倍。把本文的 $C(z)$ 事后应用于这些轨迹，可以得到一个探索性的 H1 估计值，并标注为探索性。这是下一项测量。

**词元与焦耳。** H1 和 H2 以词元来表述；本文的论点以焦耳来表述。Masanet 等人（2020）发现，2010 年至 2018 年数据中心的计算量增长了约六倍，而能耗的增长要小得多，因此词元弹性不等于能量弹性。每个假设都应以两种单位报告，并注明数据所识别的是哪一种单位。

1. 分账。对每个回合，分别对 `t <= t*` 的调用和 `t > t*` 的调用求和其解析能量，或日后求和其板上实测能量。只有当完成后的积分被估计出来时，该杂务上的直接反弹才是可见的。本仓库不包含这一划分。
2. 检测器错误。在一个带标注的语料库上，统计误判完成（某个子句为假时却宣布谓词为真）和误判继续（`C` 为真而系统仍在继续调用）。本文不公布任何比率。
3. 照护交接。到达安全状态的时间以及一份交接核查清单，与会话时长相对照。未测量。
4. 细分表。哪些产品具有简短的 `C`，哪些是开放式研究或对抗性竞赛。未估计。军事情形在第 5 节被排除在饱和论断之外，而不是被强行纳入其中。
5. 实测能量。在一个明确陈述的工作负载上使用外接功率计。尚未完成。

在这些测量存在之前，关于“过量焦耳”的句子都是假设。关于 Epoch 价格的句子是引用。

<div id="34-illustrative-episodes-not-data" class="anchor-alias" aria-hidden="true"></div>

### 3.4 说明性回合，而非数据

支持服务台。完成性：客户的问题已解决，回复已发送，工单状态为 Done。更多草稿不会改变 `C`。词元计数器仍然可以继续递增。这个回合是为展示变量而构造的例子。它不是来自某个服务台的样本。

照护交接。完成性：关键字段已填写，用药清单已核对，接收方已确认，当事人处于安全状态。会话时长是另一个变量。这个回合是构造的。本文没有分析任何医院数据集。

编程杂务。完成性：产物与一个书面判定器（测试，或逐位精确检查）相符。重新生成一个已经通过的产物不会提高 `C`。

<div id="28-fidelity-criteria-and-stop-rules" class="anchor-alias" aria-hidden="true"></div>

<div id="36-fidelity-criteria-and-stop-rules" class="anchor-alias" aria-hidden="true"></div>

### 3.6 保真度准则与停止规则

Shannon（1959）定义了率失真函数：在期望失真不超过所选保真度的前提下，所需的最小描述速率。其对象是在用户陈述的约束下的通信。它不是智能的需求曲线。与本文的相似之处仅是结构上的。完成性谓词 `C` 是一种硬保真度：所陈述的子句要么成立，要么不成立。语言模型的损失更接近于在训练分布上的平均失真。损失的下降，以及在固定基准下价格的下降，可以被解读为沿着一条速率与资源曲线的移动，即 Kaplan 等（2020）和 Hoffmann 等（2022）为训练所估计的那类曲线。这种移动并不会为某项具体杂务选定 `C`。把基准失真与杂务完成性混为一谈，正是为已关闭的工作制定无上限席位计划背后的范畴错误。

如果读者想了解正式的推导，Cover 和 Thomas（2006）是进入率失真理论的教科书路径。本文借助保真度这一概念的存在，把两个数分开：一个总能再改进一点点的分数，以及一个已经为真的谓词。

<div id="29-rebound-taxonomy-without-a-new-estimate" class="anchor-alias" aria-hidden="true"></div>

<div id="37-rebound-taxonomy-without-a-new-estimate" class="anchor-alias" aria-hidden="true"></div>

### 3.7 反弹的分类，不作新的估计

反弹的经典文献是 H2 的框架。Khazzoom（1980）表明，强制性的能效标准可以提高对该服务的使用；Brookes（1990）在整个经济的层面上提出了同样的论点；Saunders（1992）在新古典增长模型中推导了相应条件。Sorrell 和 Dimitropoulos（2008）给出了微观经济学定义及其局限。Brockway、Sorrell、Semieniuk、Heun 和 Court（2021）回顾了证据，发现全经济反弹可能侵蚀一半以上的预期节能量。任务饱和与这一发现并不矛盾。它是按任务计的停止点，而 H2 的总体反弹才是经典文献的证据所适用之处。照明是用来检验它的历史案例：Fouquet 和 Pearson（2006）追溯了英国七个世纪以来光的价格与使用，Tsao 等人（2010）发现光的使用随效率提高而上升，这是一种可饱和但反弹很大的服务。

Gillingham、Rapson 和 Wagner 关于反弹的综述，区分了被一句口号混为一谈的各个渠道。直接反弹是当同一服务的有效成本下降时对它的额外使用。间接反弹是把节省下来的资源花在其他服务上。全经济反弹通过价格与增长发挥作用。该综述的政策领域是能源效率，而不是词元。尽管如此，这一分类仍可作为关于识别的警示而迁移过来。`p_t` 的一次测得下降（论断 S-2）本身并不能识别这三个渠道中的任何一个。在一项 `C` 已经为真的杂务上出现直接反弹，要求买方仍在为不改变 `C` 的调用付费。当新任务出现时，间接渠道与全经济渠道可能很大（Acemoglu 和 Restrepo，2019）。一篇只报告一个弹性并称之为“那个反弹”的论文，其设定是不充分的。本文不报告任何弹性。

这一模式由来已久。Jevons 在 1865 年论证，更高效的蒸汽机会提高而不是降低英国的煤炭总用量。Alcott 追溯了这一论证及其后的争论（*Ecological Economics* 54(1)，2005）。Nordhaus 测量了一个多世纪以来计算的价格，发现它下降了许多个数量级，而计算总量却在上升（*Journal of Economic History* 67(1)，2007）。智能体工作负载已经显示出使用这一侧的情况。Anthropic 的工程团队报告，就其自身系统而言，智能体使用的词元约为一次聊天交互的 4 倍，多智能体系统约为 15 倍（2025 年 6 月 13 日）。这一数字由运营方报告，未经审计。它与“随着任务形态的改变，每项任务的需求胃口上升”相一致，而这正是第 3.3 节的分账必须与完成后的浪费区分开来的东西。

<div id="210-scarce-joules-and-the-economic-stop-20252026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="210-scarce-joules-and-the-economic-stop-2025-to-2026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="38-scarce-joules-and-the-economic-stop-2025-to-2026-peers" class="anchor-alias" aria-hidden="true"></div>

### 3.8 稀缺的焦耳与经济停止点（2025 年至 2026 年的同类研究）

Epoch 的价格序列（S-2）显示合成在货币上变得更便宜。最近关于能量的出版物显示，焦耳仍然稀缺，而且在总量上往往还在增长。

Chung、Wu、Ma 和 Chowdhury（arXiv:[2601.22076](https://arxiv.org/abs/2601.22076)，2026）在 1,858 种配置上诊断推理能耗：仅任务类型一项就能使 LLM 每次响应的能耗变化约 25×；视频生成的能耗可比图像高出两个数量级。*Joule* 文章 “Energy use of AI inference, efficiency pathways, and test-time scaling”（[cell.com/joule/fulltext/S2542-4351(26)00114-5](https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5)，2026 年 4 月 22 日在线发表）估计，经过优化的前沿规模查询的中位能耗低于一瓦时，同时报告长推理与智能体查询可使能耗提高一个数量级以上；8 到 20× 的效率提升已在视野之内，但并不是免费的焦耳。Luccioni、Strubell 和 Crawford（FAccT 2025）（[doi:10.1145/3715275.3732007](https://doi.org/10.1145/3715275.3732007)）警告，没有停止点的效率提升可能放大总支出（Jevons）。Epoch AI 的能源概述（[epoch.ai/publications/ai-energy](https://epoch.ai/publications/ai-energy)，2026 年 7 月更新）把适度的单次查询成本与快速倍增的数据中心总功率区分开来。

**对本文的解读。** 边际免费是关于货币价格的陈述。稀缺的焦耳是物理陈述。操作性的停止点是任务完成：当 `C(z) = 1` 时，更多的合成不会提高书面目标，而基于预算或策略理由的停止就是成功。估计值不是实测能量。

<div id="36-protocol-for-a-done-detector-study-not-executed" class="anchor-alias" aria-hidden="true"></div>

<div id="39-protocol-for-a-done-detector-study-not-executed" class="anchor-alias" aria-hidden="true"></div>

### 3.9 完成检测器研究的方案（未执行）

下面的方案是一种针对未来测量的方法。其中没有任何步骤已被执行。写下它，是为了让所缺的结果有一个退出准则，而不是一句口号。

总体。回合取自同一个产品界面，而不是开放式研究与工单关闭的混合。每个回合都有一个写成文字的 `C`，包含有限个子句，每个子句都能由一个未操作该模型的人观察到。目标样本量是一项设计选择；本文并不假装做过功效计算。第一张可用的表需要足够的正例和负例，使得一个比率不只是一则轶事。本档案不包含这张表。

标注。两名标注者在系统第一次宣布完成时，以及在会话结束时，分别把每个子句标为真或假。分歧经裁定并计数。检测器的决策与标注分开记录。

主要比率。

- 误判完成：系统宣布 `C = 1`，而某个关键子句为假。
- 误判继续：所有关键子句均为真，而系统仍发出更多的模型调用或工具调用。
- 会话时长与调用次数是协变量，不是终点指标。

次要划分，仅当存在能量账目时进行。分别对经裁定的 `t*` 之前和之后的调用求和能量，无论是解析能量还是板上实测能量。在给出数字的同一句话中注明测量类别。OpCounter 的解析总量不能替代仪表，也不能与 Horowitz 的表格相比较。

排除。没有书面 `C` 的回合不被标为“未饱和”。它们不在范围之内。对抗性回合不在饱和终点指标的范围之内；如果存在证书，它们仍可以就物理拒绝进行评分。

方案的失败。如果标注者无法就子句达成一致，说明谓词并没有被写出来。如果系统没有宣布完成的事件，误判继续就无法识别。发布一份模型排行榜来代替这两个比率，并不等于执行了本方案。

<div id="37-a-numerical-illustration-of-a-bliss-point-model-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

<div id="310-a-numerical-illustration-of-a-bliss-point-model-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

### 3.10 极乐点的数值示例（模型，而非拟合）

令一个坐标 `x` 为单项杂务上的模型调用次数，并设

```text
U(x) = -(x - 4)^2
```

用于一项其构造的最大值位于四次调用处的杂务。于是 `U(0) = -16`，`U(4) = 0`，`U(8) = -16`。边际效用为 `dU/dx = -2(x - 4)`，在 4 之前为正，在 4 处为零，在 4 之后为负。这个示例使用整数，使符号的变化无需拟合即可看见。选取 4 时没有使用任何数据集。用另一个整数替换 4 会移动峰值，但不会改变定义。一个等于 `x` 的产品指标会把 `x = 8` 排在 `x = 4` 之上。一个等于 `U` 的产品指标则相反。论断 S-3 就是这种非同一性，在这里体现于一个完全确定的玩具函数中，在第 3.4 节则体现于构造的回合中。两者都不是针对某家企业的福利估计。

可以附加词元价格而不混淆单位。假设一次调用的货币成本为 `p`，买方支付 `p * x`，而价值遵循 `U`。买方剩余的代理量 `U(x) - p x` 对任意 `p >= 0` 仍有一个有限的最大化点。`p` 的下降会移动这个最大化点，这正是该玩具模型上的反弹逻辑，而最大化点依然有限。这个玩具模型并不说明任何真实买方的最大化点位于何处。它阻断的是“更低的 `p` 会消除最大值”这一推论。

图 1 画出了这个玩具模型以及另一个独立的总体论断。

![左：极乐点的模型示意。价值 U(x) 等于 x 减 4 的平方的相反数，并绘出价格为 0、2 和 4 时的剩余 U 减 p 乘以 x；最大化点分别为 4 次、3 次和 2 次调用，在每个价格下都是有限的。右：总体反弹的示意图，更低的价格开启更多任务，而每项任务仍在其自身的谓词处停止。](/figures/satiation/satiation-rebound.svg)

*图 1. 任务饱和与总体反弹。本节玩具模型的模型示意，而非拟合：$U(x) - p\,x$ 的最大化点为 $x = 4 - p/2$，在每个价格下都是有限的。右侧面板是示意图；本文不估计任何反弹。另提供 [PNG 副本](/figures/satiation/satiation-rebound.png)。*

<div id="38-reason-codes-as-a-partition-not-a-welfare-function" class="anchor-alias" aria-hidden="true"></div>

<div id="311-reason-codes-as-a-partition-not-a-welfare-function" class="anchor-alias" aria-hidden="true"></div>

### 3.11 原因码是一种划分，而非福利函数

令 `R` 为一条轨迹上拒绝代码的集合。按照模式中的分类法，把 `R` 划分为 `R_econ = {policy, budget_exceeded}` 和 `R_phys = {lut_veto, energy_veto, cbf_veto}`。日后若增加其他代码，必须先以书面形式归类，然后才能计数。一个轨迹区间只有在 `C` 已为 1 且代码属于 `R_econ` 时，才计入完成后的经济拒绝。只要代码属于 `R_phys`，无论 `C` 是否为 1，它都计入物理拒绝。完成之后的一次不安全动作同时属于两种情形，应当在两列中都计数，而不是取平均。MCP 演示中的不可逆拒绝是一个物理例子：能量代码与屏障代码，执行器调用次数为 0。它不是 `R_econ` 的例子。将来一个在补丁合并之后出现 `policy` 的回合，才是经济的例子。本仓库不包含那样的回合。这一划分说明了它将如何被评分。


<div id="4-evidence" class="anchor-alias" aria-hidden="true"></div>

## 4. 证据

<div id="41-claim-s-1-satiation-is-a-defined-economic-object" class="anchor-alias" aria-hidden="true"></div>

### 4.1 论断 S-1。饱和是一个有定义的经济对象

Andersen（2001），<https://doi.org/10.1007/PL00003852>，以及第 2.1 节中教科书式的极乐点构造支持 S-1。该论断是理论性的。它不是本研究中任何用户群体经过测量的效用函数。

<div id="42-claim-s-2-published-inference-prices-fell-sharply-at-fixed-performance" class="anchor-alias" aria-hidden="true"></div>

### 4.2 论断 S-2。在固定性能下，已发表的推理价格急剧下降

由 Epoch AI（2025）以及 Emberson 和 Roodman（2026）支持，其幅度以这些说明所陈述的为准（第 2.5 节）。该论断关乎这些作者所发布的价格指数。它不是说每个组织的账单都下降了 13 倍，也不是关于瓦特的论断。

<div id="43-claim-s-3-engagement-variables-are-not-the-completeness-predicate" class="anchor-alias" aria-hidden="true"></div>

### 4.3 论断 S-3。参与度变量不是完成性谓词

由第 3.1 节的定义以及注意力文献对任务时长目标的描述支持（Wu；Center for Humane Technology 的概述）。本文不主张任何关于福利损失的因果估计。其逻辑论断是变量之间的非同一性：词元数量可以增加，而 `C` 保持不变。第 3.4 节中构造的回合是非同一性的示例，而不是数据集。

<div id="44-claim-s-4-bicycle-mania-prices-detached-from-a-simple-fundamental-story" class="anchor-alias" aria-hidden="true"></div>

### 4.4 论断 S-4。自行车狂热时期的股价脱离了简单的基本面叙事

由 Quinn（2019）支持：1895 年至 1900 年，自行车股价上涨超过 200%，随后下跌超过 75%，在该论文的检验中，这既不能完全由基本面解释，也不能由简单的风险转移解释。论断到此为止。它并不量化家庭对自行车的饱和。

<div id="45-claim-s-5-us-smartphone-ownership-is-high-in-the-cited-fact-sheet" class="anchor-alias" aria-hidden="true"></div>

### 4.5 论断 S-5。在所引情况说明中，美国的智能手机拥有率很高

项目档案对 Pew 移动设备情况说明的读数是：2024 年和 2025 年两行的拥有率接近 91%。本文所用的论断是这一量级的扩散，前提是实时页面与档案一致。这是关于拥有率的普及饱和事实，不是对极乐点的估计。

<div id="46-claim-s-6-care-is-not-priced-as-a-pure-software-good-by-the-baumol-framework" class="anchor-alias" aria-hidden="true"></div>

### 4.6 论断 S-6。在 Baumol 框架下，照护不被定价为纯软件商品

Baumol（1967）提供了框架。Acemoglu 和 Restrepo（2019）提供了任务的语言。该论断是：当词元价格下降时，这些框架并不意味着照护在劳动、信任或法律责任上的要求就此终结。该论断不是对医疗支出的预测。

<div id="47-claim-s-7-a-sell-side-note-questions-spend-versus-benefit" class="anchor-alias" aria-hidden="true"></div>

### 4.7 论断 S-7。一份卖方报告质疑支出与收益之比

第 2.6 节提到的 Goldman Sachs 页面确实存在，并在其标题中提出了这个问题。

<div id="49-claim-s-9-physical-law-is-not-priced-to-zero-by-epoch" class="anchor-alias" aria-hidden="true"></div>

### 4.9 论断 S-9。Epoch 并未把物理定律的价格降为零

Landauer（1961）和 Horowitz（2014）支持理想擦除界与 CMOS 实践之间存在永久性的差距。S-9 只是说，引用 Epoch 并不能免除对 Landauer 的引用。

<div id="410-design-rules-marked-as-design" class="anchor-alias" aria-hidden="true"></div>

### 4.10 设计规则，标明为设计

如果接受这些定义，并希望产品优化的是 `C` 而不是词元，这些规则就随之成立。它们不是效应。

1. 在增加模型容量之前写下 `C`。
2. 当 Epoch 类序列与开放权重适用于某项杂务时，把合成价格溢价视为暂时的。
3. 不要把建模或仿真得到的能量描述为实测能量。
4. 一旦杂务本身就是产品，就应优先选择带有错误表的 `C` 检测器，而不是未经标注地扩大模型规模。
5. 在任何不可逆动作之前，要求一项单独的物理安全检查。
6. 当划分存在时，分别报告完成之前与完成之后的能量。它目前还不存在。
7. 不要把饱和谓词应用于对抗性竞赛或军事竞赛（第 5.3 节）。
8. 如果产品的目标是注意力，就明说。此时完成性论断不适用。

路线图的否决检验，同样属于设计：一个为具有简短 `C` 的杂务假定无界需求的计划；一个需要合成永久稀缺、且没有任何物理或法律责任楔子的定价；一个只使用置信度字符串的安全叙事；一个抹去焦耳的“免费”主张；一个没有 `C` 的智能体循环。

<div id="411-what-would-be-a-result-and-is-not" class="anchor-alias" aria-hidden="true"></div>

### 4.11 什么才算结果，而本文没有

一张误判完成率与误判继续率的表。一条 `t*` 之后调用次数的时间序列。在一个明确陈述的工作负载上的一次能量仪表读数。一个结构性的反弹估计。在一项已饱和杂务上估计出的 AGI 价格溢价。这些都没有出现在第 4 节所支持的论断之中。


<div id="412-non-identity-stated-as-a-comparison-of-objectives" class="anchor-alias" aria-hidden="true"></div>

### 4.12 非同一性，表述为目标之间的比较

令 `x` 为调用次数，`s` 为会话时长，`J_pre` 与 `J_post` 为经裁定的完成之前与之后的能量，`C` 为谓词。下列蕴含关系是定义性的。

| 观测 | 并不意味着 |
|-------------|----------------|
| `x` 增加了 | `C` 增加了 |
| `s` 增加了 | 福利增加了 |
| `p` 下降了（S-2） | `J_post = 0` |
| `C = 1` | 检测器的错误率已知 |
| 手机拥有率很高（S-5） | 再多一次模型调用的边际价值为零 |
| 自行车股价经历了繁荣与崩溃（S-4） | 家庭达到了交通方面的极乐点 |

右侧一列是本文拒绝作出的推论清单。左侧每一项观测，要么是第 4 节中的一条引用，要么是第 3 节中的一个变量。这张表是把讨论压缩成的一项核查。一个断言右侧论断的句子，已经离开了证据。

<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>

## 5. 讨论

<div id="51-rebound-the-central-identification-problem" class="anchor-alias" aria-hidden="true"></div>

### 5.1 反弹：核心识别问题

有三项结果限制了自然实验。Gundlach 等人（2025）发现，固定基准性能下的价格下降很快，而前沿价格并未下降；Du（2026）在价格演变中发现了结构性断点与推理溢价，因此降价是与模型变化捆绑在一起出现的。Anthropic 的 Economic Index（2025 年 9 月）报告，在不同任务之间，成本每上升 1%，使用频率就下降 0.29%，这是一个缺乏弹性的横截面数字，而不是随时间变化的价格变动。提供方层面的设计无法识别市场层面的反弹；该设计需要市场层面的价格与数量。

Gillingham、Rapson 和 Wagner 综述了能源效率政策带来的反弹。其机制是剩余的需求弹性。如果合成的货币价格下降，在买方仍然看重再多一个单位的地方，使用量就会上升。在一项已关闭杂务的极乐点上，价值对该杂务上更多合成的直接导数不为正，因此该杂务上的直接反弹并不被蕴含。间接反弹、新任务与注意力的转移仍可能存在。Acemoglu 和 Restrepo 的新任务边际，是数量可能重新出现的一个地方。因此，论断 S-2 并不意味着计算有一个全局上限。它只意味着相对于一个明确陈述的 `C` 存在上限。否认全局反弹需要第 3.3 节的划分和一个需求系统。本文并不否认全局反弹。它拒绝把“Jevons”当作不写 `C` 的理由。

两个假设使这一问题变得可检验。

- **H1. 完成后的花费。** 在 `C(z) = 1` 之后所花费的智能体计算所占的比例，即 `t > t*` 的焦耳或调用占该回合全部焦耳或调用的比例，可测量地高于零。H1 是完成性停止点所消除的直接浪费。它可以从智能体日志中估计，只要每个回合都有一个经过标注的 `t*`（第 3.3 节，第 1 项）。
- **H2. 任务中的 Jevons。** H2 是 Khazzoom（1980）的直接反弹弹性，针对任务来表述。当合成价格下降时，所运行任务数量的弹性超过每项任务花费的下降。于是，即使每项任务都已饱和，总花费仍会上升。H2 是总体反弹。

**识别。** H1 不需要价格变动：只需要一个带标注的语料库、第 3.3 节第 2 项中的检测器错误率，以及分账。H2 需要外生的价格变化。提供方在固定模型质量下、于已知日期宣布的降价，就是自然实验。其设计是一个账户面板，记录每次降价前后的支付价格、开启的任务、每项任务的调用次数，以及每个回合的完成性标注。把使用了重新定价模型的账户，与使用价格未变模型的账户相比较，就能分别得到任务数量弹性和每项任务花费响应的双重差分估计。每项任务的花费可以下降，而任务数量上升。两个数字都需要。完成性停止点是关于前者的论断。Jevons 是关于后者的论断。本文对两者都未作估计。

<div id="52-status-and-creative-goods" class="anchor-alias" aria-hidden="true"></div>

### 5.2 地位商品与创意商品

有些商品之所以有价值，恰恰是因为它们没有完成：地位、开放式的艺术、其 `C` 不是有限核查清单的研究。第 3.1 节的定义并不把极乐点强加于这些商品。它强加的是一种细分。一项有限的杂务与一种开放式的实践可以由同一家企业出售，但不应共享同一个需求假设。把一项有限的杂务当作开放式的能力竞赛来定价，是一种范畴错误，而不是关于 AGI 的发现。

<div id="53-adversarial-demand" class="anchor-alias" aria-hidden="true"></div>

### 5.3 对抗性需求

如果对方的收益就是本方的损失，“足够”就无法由一份局部的核查清单来定义。军备竞赛和某些安全竞争属于这一类。物理提交约束仍然可以适用：一个不安全的动作可以被拒绝，而战略需求仍然是开放的。范围是论断的一部分，而不是一条把它抵消掉的脚注。

<div id="54-incomplete-knowledge-of-done" class="anchor-alias" aria-hidden="true"></div>

### 5.4 对完成的不完全认知

人会误判完成。检测器也会出现误判完成与误判继续。这是测量检测器错误的理由，而第 3.3 节把这一测量列为缺失。它并不能成为理由，让会话时长在一个漏掉交接就有责任方的领域中替代 `C`。凡是无法写出谓词之处，本文的操作性论断便不置一词。

<div id="55-baumol-is-not-solved" class="anchor-alias" aria-hidden="true"></div>

### 5.5 Baumol 问题并未解决

一个能更快起草记录的模型，可以提高记录的产出量，而把检查、判断与责任留给一个人。如果人的那部分残差没有加速，支出份额仍然可能像 Baumol 所描述的那样变动。若说不是这样，那就是一项本文献所不包含的预测。允许作出的陈述是 S-6。

<div id="56-free-synthesis-is-not-free-actuation" class="anchor-alias" aria-hidden="true"></div>

### 5.6 免费的合成不等于免费的执行

推理的货币价格下降，对于移动一个物理系统所需的能量没有任何说明。让质量为 $m$ 的物体从静止开始获得速度变化 $\Delta v$，至少需要 $\tfrac12 m (\Delta v)^2$ 焦耳的功，无论下达这一命令的指令价格如何。Epoch 的价格与这份功处在不同的轴上。把它们合并为“免费的 AI”，就抹去了测量类别。

<div id="57-confidence-is-not-a-certificate" class="anchor-alias" aria-hidden="true"></div>

### 5.7 置信度不是证书

一个高的模型分数可以为各个提议排序。它不是完成性谓词：一个分数需要一个阈值和一张错误表（相对于一个带标注集合的假阳性率与真阳性率），然后才能决定 `C`。

<div id="58-sell-side-skepticism-is-not-a-measurement" class="anchor-alias" aria-hidden="true"></div>

### 5.8 卖方的怀疑不是测量

S-7 使文献综述不能忽视一个关于支出与收益的重要公开质疑。它并不允许一份研究报告代替仪表或需求估计。如果日后引用该报告的数字，来源必须是原始 PDF，标签是卖方估计值。


<div id="59-what-a-structural-demand-estimate-would-require" class="anchor-alias" aria-hidden="true"></div>

### 5.9 结构性需求估计需要什么

S-2 是一个来自二手已发表序列的供给价格事实。需求估计是另一种回归。它至少需要一个数量（调用次数、已关闭的任务，或两者兼有）、一个价格，以及一种把沿需求曲线的移动与曲线本身的移动区分开的方法。Epoch 的基准价格不是企业层面的账单，而一家企业的账单也不是 `C`。要把它们联系起来，需要一个本研究所没有的面板：在同一回合上记录支付价格、所做调用以及经裁定的完成性标注的账户。没有这样的面板，`t*` 之后需求的斜率就无法识别。第 3.10 节的玩具剩余只表明，一个二次极乐点在 `p` 下降时仍保持一个有限的最优点。它不是所缺的那项回归。

细分属于同一个设计。在合并之前，把每个产品编码为有限 `C` 或开放式。把一个工单服务台与一个开放式研究工具合并在一起，会把两种需求机制平均掉，并可能制造出需求无界的假象。第 5.3 节中的军事排除，正是同一条规则在这样一个领域中的应用：对手的目标使局部极乐点无法存在。一张带有这些编码的表，即使暂时没有价格，也会比一个单一的总可寻址市场数字更有信息量。这张表没有被建立。

<div id="510-why-no-multiple-of-kt-ln-2-is-stated" class="anchor-alias" aria-hidden="true"></div>

### 5.10 为什么不陈述 `kT ln 2` 的任何倍数

Landauer 的结果是关于温度 `T` 下理想化擦除的一个不等式。Horowitz（2014）在其教程的假设下，以皮焦耳为单位报告了特定 CMOS 操作和存储器访问的能量。把一者除以另一者，只有在有人选定了操作、活动因子、温度和器件之后才能得出一个数。这些选择都没有在本文中测量过。陈述一个高于 Landauer 界的倍数，就等于假装这些选择已经做出。科学的陈述是不等式的方向：在 Horowitz 的描述中，实际的不可逆 CMOS 远高于该界，而价格指数并不会把任何器件推到该界上。


<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## 6. 局限与效度威胁

构念效度。操作性饱和依赖于 `C`。一个带有敌意或含糊的 `C` 会使谓词变得任意。本文的防御是要求以可观察的子句写出 `C`。许多真实产品还没有这样的书面表述。对于这些产品，该理论在经验上尚不适用。

价格论断的内部效度。S-2 继承了 Epoch 所使用的任何识别方式（质量调整、基准选择、标价与实际账单之别）。本文没有审计微观数据。Epoch 序列的修订会修订 S-2 的幅度，但未必会修订其方向。在把 S-2 用作面向决策层的数字之前，应当对照原始页面重新阅读。

外部效度。按定义，工作与照护排除了军事对抗，也可能排除研究。手机拥有率不能迁移到智能体产品上。自行车股价不能迁移到软件利润率上。构造的回合不是样本。

测量效度。没有焦耳的划分，没有检测器的混淆矩阵，也没有任何设备上的能量计。厂商的硬件规格不是能量测量。

遗漏变量。新任务可以吸收廉价合成所释放出来的支出。第 5.1 节陈述了这一点。一份把按杂务计的饱和当作总体计算需求预测的路线图，并不能从本文得到依据。

发表偏倚与文件类型。Wu 的是一本书。Humane Technology 的页面是倡导材料。Goldman Sachs 属于卖方。Quinn、Epoch、Baumol、Acemoglu 和 Restrepo、Landauer 以及 Horowitz 是承担论证重量的引用，它们各自支持不同的句子。本文的结构是一种尝试，防止这些句子被平均成一种情绪。

证伪条件。如果所引理论不包含边际效用为零的区域，S-1 就不成立。它包含。如果 Epoch 的原始页面没有报告这类下降，S-2 就不成立。将来如果有一个带标注的语料库，其中在一个正确的 `C` 之后的额外调用系统性地提高了一个独立规定的价值，那就会在该语料库上证伪饱和。一个这样的语料库并不会证伪定义。它会界定定义的适用领域。



厂商的硬件规格列出的是容量，而不是开关活动、静态功耗或某个工作负载的能量。一份能量报告必须写明硬件、时钟、工作负载、仪表与持续时间。

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 7. 结论

饱和是所引理论中的一个标准对象，并且具有一个狭窄的操作形式：一个额外合成无法推进的书面完成性谓词。Epoch 已发表的序列记录了固定性能推理的货币价格急剧下降。这一下降支持把数字杂务描述为边际免费，但不支持焦耳免费、受控对象动作免费，也不支持照护成本结构的终结。自行车股价、智能手机的扩散以及注意力市场，在第 4 节所陈述的具体方面上各有强弱。所缺的科学对象是：一个带标注的完成检测器，一个完成前与完成后的能量划分，以及一个能够看见反弹的需求估计。在它们出现之前，本文的经验内容是所引用的记录，其形式内容是谓词。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Acemoglu, D., and Restrepo, P. Automation and new tasks: how technology displaces and reinstates labor. Journal of Economic Perspectives 33(2), 2019. https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3

Ames, A. D., et al. Control barrier functions: theory and applications. ECC 2019. https://doi.org/10.23919/ECC.2019.8796030

Andersen, E. S. Satiation in an evolutionary model of structural economic dynamics. Journal of Evolutionary Economics, 2001. https://doi.org/10.1007/PL00003852

Baumol, W. J. Macroeconomics of unbalanced growth: the anatomy of urban crisis. American Economic Review 57, 415-426, 1967.

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Center for Humane Technology. The attention economy. https://www.humanetech.com/youth/the-attention-economy

Emberson, L., and Roodman, D. / Epoch AI. The plunging price of thought. 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

Epoch AI. LLM inference price trends. 12 March 2025. https://epoch.ai/data-insights/llm-inference-price-trends

Gillingham, K., Rapson, D., and Wagner, G. The rebound effect and energy efficiency policy. Review of Environmental Economics and Policy 10(1), 68-88, 2016. https://doi.org/10.1093/reep/rev017 Working text: https://gwagner.com/wp-content/uploads/Gillingham-Rapson-Wagner-2015-Rebound-Effect.pdf

Alcott, B. Jevons' paradox. Ecological Economics 54(1), 9-21, 2005. https://doi.org/10.1016/j.ecolecon.2005.03.020

Anthropic. How we built our multi-agent research system. 13 June 2025. https://www.anthropic.com/engineering/multi-agent-research-system

Jevons, W. S. The Coal Question. London: Macmillan, 1865.

Keynes, J. M. Economic possibilities for our grandchildren. 1930. Reprinted in Essays in Persuasion, 1931.

Nordhaus, W. D. Two centuries of productivity growth in computing. Journal of Economic History 67(1), 128-159, 2007. https://doi.org/10.1017/S0022050707000058

Goldman Sachs. Gen AI: too much spend, too little benefit? https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit

Horowitz, M. Computing's energy problem (and what we can do about it). ISSCC 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Ma, S., et al. The era of 1-bit LLMs. arXiv:2402.17764.

Pew Research Center. Mobile fact sheet. https://www.pewresearch.org/internet/fact-sheet/mobile/

Quinn, W. Technological revolutions and speculative finance: evidence from the British Bicycle Mania. Cambridge Journal of Economics 43(2), 271-294, 2019. https://doi.org/10.1093/cje/bey029

Wei, J., et al. T-MAC. arXiv:2407.00088.

Wu, T. The Attention Merchants. Knopf. https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/

Chung, J.-W., Wu, R., Ma, J. J., and Chowdhury, M. Where Do the Joules Go? Diagnosing Inference Energy Consumption. arXiv:2601.22076. https://arxiv.org/abs/2601.22076

Energy use of AI inference, efficiency pathways, and test-time scaling. *Joule*, 2026. https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5

Luccioni, A. S., Strubell, E., and Crawford, K. From efficiency gains to rebound effects: the problem of Jevons' Paradox in AI's polarized environmental debate. *FAccT* 2025. https://doi.org/10.1145/3715275.3732007

Ostrovsky, N. / Epoch AI. What you need to know about AI energy use. Updated 14 July 2026. https://epoch.ai/publications/ai-energy

Anthropic. Anthropic Economic Index report: uneven geographic and enterprise AI adoption. September 2025. https://www.anthropic.com/research/anthropic-economic-index-september-2025-report

Bai, L., Huang, Z., Wang, X., et al. How do AI agents spend your money? Analyzing and predicting token consumption in agentic coding. arXiv:2604.22750, 2026. https://arxiv.org/abs/2604.22750

Brockway, P. E., Sorrell, S., Semieniuk, G., Heun, M. K., and Court, V. Energy efficiency and economy-wide rebound effects: a review of the evidence and its implications. Renewable and Sustainable Energy Reviews 141, 110781, 2021. https://doi.org/10.1016/j.rser.2021.110781

Brookes, L. The greenhouse effect: the fallacies in the energy efficiency solution. Energy Policy 18(2), 199-201, 1990. https://doi.org/10.1016/0301-4215(90)90145-T

Chen, X., Xu, J., Liang, T., et al. Do NOT think that much for 2+3=? On the overthinking of o1-like LLMs. arXiv:2412.21187, 2024. https://arxiv.org/abs/2412.21187

Cuadron, A., Li, D., Ma, W., et al. The danger of overthinking: examining the reasoning-action dilemma in agentic tasks. arXiv:2502.08235, 2025. https://arxiv.org/abs/2502.08235

Du, M. Tiered super-Moore's law: price evolution, production frontiers, and market competition in large language models. arXiv:2603.28576, 2026. https://arxiv.org/abs/2603.28576

Fouquet, R., and Pearson, P. J. G. Seven centuries of energy services: the price and use of light in the United Kingdom (1300-2000). The Energy Journal 27(1), 2006. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol27-No1-8

Gundlach, H., Lynch, J., Mertens, M., et al. The price of progress: price performance and the future of AI. arXiv:2511.23455, 2025. https://arxiv.org/abs/2511.23455

Khazzoom, J. D. Economic implications of mandated efficiency in standards for household appliances. The Energy Journal 1(4), 1980. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol1-No4-2

Masanet, E., Shehabi, A., Lei, N., Smith, S., and Koomey, J. Recalibrating global data center energy-use estimates. Science 367(6481), 984-986, 2020. https://doi.org/10.1126/science.aba3758

Saunders, H. D. The Khazzoom-Brookes postulate and neoclassical growth. The Energy Journal 13(4), 1992. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol13-No4-7

Sorrell, S., and Dimitropoulos, J. The rebound effect: microeconomic definitions, limitations and extensions. Ecological Economics 65(3), 636-649, 2008. https://doi.org/10.1016/j.ecolecon.2007.08.013

Tsao, J. Y., Saunders, H. D., Creighton, J. R., Coltrin, M. E., and Simmons, J. A. Solid-state lighting: an energy-economics perspective. Journal of Physics D: Applied Physics 43(35), 354001, 2010. https://doi.org/10.1088/0022-3727/43/35/354001

Witt, U. Learning to consume: a theory of wants and the growth of demand. Journal of Evolutionary Economics 11(1), 23-36, 2001. https://doi.org/10.1007/PL00003851

<div id="appendix-a-decision-rules-and-non-results" class="anchor-alias" aria-hidden="true"></div>

## 附录 A. 决策规则与非结果

| 编号 | 陈述 | 类别 |
|----|-----------|-------|
| R1 | 在增加容量之前写下完成性谓词。 | 设计 |
| R2 | 在 Epoch 类证据适用之处，预期合成价格溢价会被侵蚀。 | 设计，以 S-2 为条件 |
| R3 | 不要声称能量免费或执行免费。 | 源自 S-9 的约束 |
| R4 | 把经济停止原因与物理停止原因分开。 | 设计 |
| R5 | 在把一个停止点视为准确之前，公布检测器的错误率。 | 尚不是结果 |
| R6 | 划分完成之前与完成之后的能量。 | 尚不是结果 |
| R7 | 把对抗性竞赛排除在饱和论断之外。 | 范围 |
| R8 | 在引用更精细的幅度之前，重新阅读 Pew 与 Epoch 的原始资料。 | 方法 |




<div id="appendix-c-claim-map" class="anchor-alias" aria-hidden="true"></div>

## 附录 C. 论断地图

目前得到支持：S-1 至 S-9，连同第 4 节中的范围说明。

未得到支持：Baumol 成本病的终结；受控对象动作免费；军事需求的饱和；数值上为零的全局反弹；语言模型以 Landauer 量级运行；板卡瓦特数；把 AGI 价格当作关于已饱和杂务的事实；普遍适用的蒸馏滞后；硅片性能领先地位。

尚待进行的测量：第 3.3 节。
