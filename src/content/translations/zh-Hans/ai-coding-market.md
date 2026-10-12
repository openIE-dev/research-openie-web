---
title: "被许诺的万亿美元 AI 编程市场"
deck: "谁预测了万亿美元的人工智能编程市场，每项预测统计了什么，以及每项预测对能量、令牌和复用作了什么假设。"
lang: "zh-Hans"
source: "ai-coding-market"
complete: true
---

<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*版本 1.1，2026 年 10 月 11 日。数据与代码：[research.openie.dev/data/](/data/#economics)。LaTeX PDF：[/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf)（[源文件](/pdfs/latex/ai-coding-market.tex)）。*

*本文是 [《Reality Code Engine：一个无损形式，用于原生、可验证、低能耗的编程》](/papers/rce/) 的经济学姊妹篇。研究论文承载工程、理论与测量。本文是理论与经济学交汇之处。*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 摘要

万亿美元 AI 编程市场是 David Charlot 有依据的夸张论断，而真实的预测证实了它的量级。一项风险投资估计认为，全世界软件开发者的价值约为每年 3 万亿美元，并称 AI 编程是一个能够支撑"甚至一家万亿美元巨头"的市场 [1]。两家 AI 编程公司在相隔一年之内分别报告了超过 10 亿美元和超过 25 亿美元的年化收入 [5, 6]。一家前沿实验室估值 3,800 亿美元，其编程产品是它的招牌 [6]。一家提供商的词元量在两年内从每月 9.7 万亿增长到每月超过 3.2 千万亿 [8]。最大科技公司的资本支出在 2025 年超过 4,000 亿美元 [10]。

这些预测全都假设同一件事：自主计算机自动化的空间只有一个方向。沿着这个方向，能量、算力和熵一同上升，每个任务的回路中都有一个模型，每个任务都按词元支付租金。这个空间的方向不止于此。各种方法沿着若干连续轴排布：每个任务的能量、熵与确定性、验证强度、复用与复利，以及模型依赖。存在许多种组合，而真实系统会混合其中几种。这一叙事的错误不在于任何一种方法，而在于假设这个空间只有一个方向。

[RCE 研究论文](/papers/rce/)测量了该空间中的一个点，其选择是为了同时优化全部五条轴。RCE 是一个原生代码生态系统。一个程序从意图出发只编写一次，写成一个形式（Form），即对状态、事件和纯转换的无损编码，而每一种目标语言都是它的忠实投影。形式没有声明的状态无法被写出，因此错误的程序在入口处就被拒绝，而不是事后才被发现和修复。每个通过门槛的契合都被存储并复用，因此生态系统会复利累积。在 10,000 个预注册的形式上，在引擎冻结、模型调用为 0 的条件下，每个形式都往返还原为完全相同的字节，每个投影都是确定性的，每个格式错误的输入都在入口处被拒绝，而 Python 投影在其中 9,999 个上复现了参考轨迹（[RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n)）。其他语言的代码通过提升进入生态系统，在被提升的代码上，修复档位以 0 次模型调用修复了 520,821 个单词元缺陷中的 520,541 个，以及 21,320 个 Java 单语句缺陷的 63.7%（[RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)）。凡是 RCE 覆盖的任务，其边际成本都会降向运行它所需的能量，而一个按生成定价的市场在该任务上便失去了基础。本文把预测与测量分开，指出每项预测的假设，并说明它在何处失效。

**共同论点，为每篇论文陈述一次。** 运行所需的能量是计算机智能唯一真实的度量。其他一切因素都归于零。门槛形式定义了这句话的含义。在预算与期限内通过任务完成谓词 $C(z)$ 的运行中，系统按完成所需的焦耳 $J^*$ 排名。正确性、期限与任务规模是门槛，而不是得分中的项。参数、词元、基准分数与价格在排名中的权重为零（[能动性第 1 节](/papers/agency/#1-thesis)）。估计值从来不是 `measured_j`。

**价格，一个单独的论断，用于经济学姊妹篇。** 价格趋势是一个单独的论断，并作为单独论断加以标注。Epoch AI 报告，自 2023 年以来，达到给定水平 AI 性能的成本每季度下降约 47%，约为每年 13 倍（Emberson 与 Roodman，*The plunging price of thought*，2026 年 9 月 22 日）。如果该趋势持续，能量将成为推理的主导边际成本。这是一个带条件的被引趋势，而不是一次被测得的崩塌。[《拼写检查是全球性的》](/papers/spellcheck/) 是一个存在性证明：某些计算机智能会商品化为捆绑的零价格。这些姊妹篇所用的理论见 [能动性论文](/papers/agency/)、[《计量提交门槛》](/papers/gates/) 与 [Reality Code Engine](/papers/rce/)。

<div id="1-projections-and-measurements-are-different-objects" class="anchor-alias" aria-hidden="true"></div>

## 1. 预测与测量是不同的对象

下文每个数字都带有以下五种标签之一。

| 标签 | 含义 |
|---|---|
| **预测** | 基于明确假设的预测或价值估计 |
| **公司自报** | 公司关于自身给出的数字，例如年化运行率收入（最近一个月乘以十二）或融资估值 |
| **调查估计** | 来自买方调查的市场规模数字 |
| **备案** | 监管备案文件中的数字 |
| **测量** | 来自一次保留了全部产物的运行的计数或能量读数。在 RCE 中，能量自带标签：`est_j`、`reported_j` 或 `measured_j` |

只有最后一行是关于正确结果成本的证据。其余各行是关于市场预期的证据。

<div id="2-who-projects-what" class="anchor-alias" aria-hidden="true"></div>

## 2. 谁预测了什么

<div id="21-developer-value-the-trillion" class="anchor-alias" aria-hidden="true"></div>

### 2.1 开发者价值：那一万亿

| 论断 | 数字 | 标签 | 来源 |
|---|---|---|---|
| 全球软件开发者 | 约 3,000 万（各估计为 2,700 万至 4,700 万） | 预测输入 | Appenzeller 与 Li [1] |
| 每位开发者每年的价值 | 100,000 美元（假设） | 预测输入 | [1] |
| 年度经济贡献 | 约 3 万亿美元 | 预测 | [1] |
| GitHub 上的开发者 | 1.8 亿以上；当年合并 5.187 亿个拉取请求 | 公司自报 | GitHub Octoverse 2025 [17] |
| 生成式 AI 在 63 个用例中的价值 | 每年 2.6 万亿至 4.4 万亿美元；软件工程生产率为当前该职能年度支出的 20% 至 45% | 预测 | McKinsey [15] |
| 生成式 AI 对全球 GDP 的影响 | 十年期内 7% | 预测 | Goldman Sachs [16] |
| 简单助手带来的生产率提升 | 约 20% | 基于访谈的估计 | [1] |
| 同类最佳部署带来的生产率提升 | "至少翻倍" | "基于轶事证据"的估计 | [1] |

开发者人数是软数字：3,000 万是对专业人员的估计，而仅 GitHub 一家就统计了六倍于此的、在其上构建的账户 [17]。每位开发者的价值和生产率倍数同样是软数字（第 2.7 节）。McKinsey 2023 年的估计是这个市场最初的那一万亿，它是跨所有职能的价值估计 [15]。同一篇风险投资文章说，AI 编程生态系统能够"支撑数十家十亿美元公司，甚至一家万亿美元巨头" [1]。这句话就是那一万亿。它是价值估计，不是收入预测。

<div id="22-tool-revenue-and-enterprise-spend" class="anchor-alias" aria-hidden="true"></div>

### 2.2 工具收入与企业支出

| 论断 | 数字 | 标签 | 来源 |
|---|---|---|---|
| 2025 年企业在 AI 编程工具上的支出 | 40 亿美元，占部门级 AI 支出的 55% | 调查估计 | Menlo Ventures [2] |
| 2025 年企业生成式 AI 支出 | 370 亿美元 | 调查估计 | [2] |
| 2026 年 AI 代码工具市场 | 93.5 亿美元，到 2031 年达 299.6 亿美元 | 预测 | Mordor Intelligence [3] |

市场今天报告的收入以十亿计。那一万亿是市场希望攫取的价值。

<div id="23-company-revenue-and-valuations" class="anchor-alias" aria-hidden="true"></div>

### 2.3 公司收入与估值

| 公司论断 | 数字 | 日期 | 标签 | 来源 |
|---|---|---|---|---|
| Cursor 年化收入 | 超过 10 亿美元 | 2025 年 11 月 13 日 | 公司自报 | Cursor [5] |
| Cursor Pro 重新定价 | 从请求次数上限改为"每月 20 美元、按 API 定价计的前沿模型用量"，并为此变更退款 | 2025 年 6 月至 7 月 | 公司自报 | Cursor [18] |
| Cursor D 轮 | 23 亿美元，投后估值 293 亿美元 | 2025 年 11 月 13 日 | 公司自报 | [5] |
| Anthropic 运行率收入 | 140 亿美元 | 2026 年 2 月 12 日 | 公司自报 | Anthropic [6] |
| Claude Code 运行率收入 | 超过 25 亿美元 | 2026 年 2 月 12 日 | 公司自报 | [6] |
| Anthropic G 轮 | 300 亿美元，投后估值 3,800 亿美元 | 2026 年 2 月 12 日 | 公司自报 | [6] |

Anthropic 表示，该轮融资用于"基础设施扩张" [6]。收入、估值与算力是同一个赌注。

图 1 把第 2.1 至 2.3 节和第 2.6 节的美元数字放在同一条轴上，并以各来源所带的标签标注。

![本文各表中美元数字的对数坐标点图。预测：开发者贡献约 3 万亿美元，生成式 AI 价值 2.6 万亿至 4.4 万亿，全球 AI 支出 1.5 万亿，AI 代码工具市场 2026 年 93.5 亿、2031 年 299.6 亿。估计：资本支出超过 4,000 亿。调查估计：企业生成式 AI 支出 370 亿，AI 编程工具支出 40 亿。公司报告：Claude Code 年化收入超过 25 亿，Cursor 超过 10 亿。](/figures/ai-coding-market/spend-by-label.svg)

*图 1. 按标签划分的美元数字。数据图，对数坐标。来源：Appenzeller 与 Li [1]、Menlo Ventures [2]、Mordor Intelligence [3]、Cursor [5]、Anthropic [6]、IEA [10]、McKinsey [15]、Gartner [24]。另提供 [PNG 副本](/figures/ai-coding-market/spend-by-label.png)。*

<div id="24-inference-tokens-and-unit-economics" class="anchor-alias" aria-hidden="true"></div>

### 2.4 推理、词元与单位经济

| 论断 | 数字 | 标签 | 来源 |
|---|---|---|---|
| Google 每月处理的词元 | 9.7 万亿（2024），约 480 万亿（2025），超过 3.2 千万亿（2026 年 5 月） | 公司自报 | Pichai [8] |
| Google 内部 AI 开发者工具 | 2026 年 3 月每天 5,000 亿词元，5 月每天超过 3 万亿 | 公司自报 | [8] |
| 按标价计一次智能体编程查询的成本 | 2.50 美元：100,000 词元上下文与 10,000 输出词元，单价分别为每百万词元 15 美元和 75 美元 | 示例 | Appenzeller 与 Li [1] |
| 同上，每小时 3 次、每天 7 小时、每年 200 天 | 每位开发者每年约 10,000 美元 | 示例 | [1] |
| 智能体编程相对于代码推理和代码对话的词元用量 | 约多 1,000 倍；同一任务的不同运行相差可达 30 倍；更高的词元用量"并不转化为更高的准确率" | 测量（八个模型，SWE-bench Verified） | Bai、Huang 与 Wang [9] |
| 截至 2025 年 9 月 30 日的季度，Microsoft 对 OpenAI 投资的净亏损 | 税前 41 亿美元，为其权益法份额，计入其他费用；净利润减少 31 亿美元（每股摊薄 0.41 美元） | 备案与公司自报 | Microsoft Form 10-Q [7]；Microsoft FY26 Q1 performance [19] |

来源中有两句话直白地说出了这种经济学。Pichai："许多公司已经把全年的词元预算用光了，而现在才五月" [8]。Appenzeller 与 Li："几十年来，软件开发成本几乎完全是人力成本，但现在 LLM 增加了相当大的运营支出部分" [1]。

图 2 画出词元序列。

![Google 每月处理词元数的对数坐标折线图：2024 年 9.7 万亿，2025 年约 480 万亿，2026 年 5 月超过 3.2 千万亿，均为公司报告。](/figures/ai-coding-market/tokens.svg)

*图 2. Google 每月处理的词元。数据图，公司报告，对数坐标。来源：Pichai [8]；关于词元用量的说明来自 Bai、Huang 与 Wang [9]。另提供 [PNG 副本](/figures/ai-coding-market/tokens.png)。*

<div id="25-price-per-token" class="anchor-alias" aria-hidden="true"></div>

### 2.5 每词元价格

| 论断 | 数字 | 标签 | 来源 |
|---|---|---|---|
| 固定水平 AI 性能的成本 | 自 2023 年以来每季度下降约 47%，约每年 13 倍 | 测量的价格序列（五个基准） | Epoch AI [4] |
| 达到固定基准分数的价格 | 每年下降 9 至 900 倍，取决于里程碑；下降最快的是最近的，也最不确定能否持续 | 测量的价格序列（对数线性拟合） | Epoch AI [34] |
| 同等性能下的推理成本 | 约每年下降 10 倍：从 2021 年的每百万词元 60 美元降至 0.06 美元 | 估计 | Appenzeller, a16z [20] |
| DeepSeek API 降价，2025 年 9 月 29 日 | 开发者成本"降低 50% 以上" | 公司自报 | DeepSeek [21] |

[4] 的每年 13 倍只是一个宽区间中的一点 [34]。下降由竞争和开放权重驱动，正如 DeepSeek 的降价所示 [21]。它不需要任何能量核算。这是第 6 节的第一种下降。复用加上另一种下降：每个任务的调用次数。

图 3 画出两条价格序列。

![固定能力下每百万词元价格的对数坐标图。a16z 的一项估计从 2021 年的 60 美元降到 2024 年的 0.06 美元，约每年十倍。一条虚线表示 Epoch AI 自 2023 年以来约每年十三倍的斜率，以 2023 年的十美元为指数起点。](/figures/ai-coding-market/price-trend.svg)

*图 3. 固定能力水平的价格。数据图，对数坐标：a16z 的端点按原文所印 [20]；Epoch AI 线是自 2023 年以来约每年 13 倍的所述速率 [4]，以任意起点为指数，只用于显示斜率。按里程碑的区间来自 Epoch AI [34]。另提供 [PNG 副本](/figures/ai-coding-market/price-trend.png)。*

<div id="26-energy-and-capital" class="anchor-alias" aria-hidden="true"></div>

### 2.6 能源与资本

| 论断 | 数字 | 标签 | 来源 |
|---|---|---|---|
| 2024 年数据中心用电 | 约 415 TWh，约占全球用电的 1.5% | 估计 | IEA, *Energy and AI* [11] |
| 2030 年数据中心用电 | 约 945 TWh，基准情景 | 预测 | [11] |
| 数据中心用电，2025 年至 2030 年 | 485 TWh 至 950 TWh，约占全球需求的 3% | 估计与预测 | IEA, *Key Questions on Energy and AI* [10] |
| 最大科技公司的资本支出 | 2025 年超过 4,000 亿美元，预计 2026 年再增长 75% | 报告与预测 | [10] |
| Alphabet 资本支出 | 2022 年 310 亿美元；预计 2026 年约 1,800 亿至 1,900 亿美元 | 公司自报与指引 | Pichai [8] |
| 每任务能耗 | 每年至少下降一个数量级；推理与智能体任务"每次查询所用能量是简单文本生成的数百或数千倍" | 估计 | [10] |
| 向生产环境助手发出的一次中位文本提示 | 0.24 Wh | 运营方测量 | Elsworth et al. [12] |
| Stargate | 四年 5,000 亿美元，用于一家实验室的 AI 基础设施，其中 1,000 亿美元立即部署 | 公司公告 | OpenAI [22] |
| 2025 年全球 AI 支出 | 约 1.5 万亿美元 | 预测 | Gartner [24] |
| 资本支出必须赚回的收入 | "AI's \$600B question" | 分析 | Sequoia Capital [23] |

必须偿付的租金是硬件租金。这种规模的资本支出与承诺，要靠定价高于其能量成本的使用来回收。这正是复用在被覆盖任务上所移除的基础。

图 4 把预测的电网用电与一个任务的实测焦耳并列。

![两个面板。面板 a：数据中心用电，IEA 估计 2024 年为 415 TWh，2025 年至 2030 年为 485 至 950 TWh 的区间，2030 年预测为 945 TWh。面板 b，对数坐标：一个中位数文本提示，由其运营方测得 0.24 Wh，即 864 焦耳；RCE 已解决的修复任务，估计为 0.10 至 0.40 焦耳，在 RAPL 封装计数器上为 0.026 至 0.056 焦耳。](/figures/ai-coding-market/energy.svg)

*图 4. 电网处与任务处的能量。数据图。面板 a：IEA 的估计与预测 [10, 11]。面板 b，对数坐标：一个中位数文本提示，运营方测得 0.24 Wh [12]；RCE 已解决的修复任务，`est_j` 与 `reported_j`（[RCE §6.3](/papers/rce/#63-energy)）。两个面板单位不同，彼此不作换算。另提供 [PNG 副本](/figures/ai-coding-market/energy.png)。*

<div id="27-productivity-evidence" class="anchor-alias" aria-hidden="true"></div>

### 2.7 生产率证据

| 研究 | n | 设计 | 效应 | 来源 |
|---|---|---|---|---|
| a16z 文章 | 访谈 | 估计 | 简单助手约 20%；同类最佳"至少翻倍" | [1] |
| GitHub Copilot，HTTP 服务器任务 | 招募的开发者 | 对照实验 | 在一个玩具任务上快 55.8% | Peng et al. [27] |
| Google 企业试验 | 96 名工程师 | 随机对照试验 | 任务用时减少约 21% | Paradis et al. [28] |
| METR，2025 年初 | 16 名资深开源开发者，246 个任务 | 随机对照试验 | 使用 AI 时慢 19% | Becker et al. [25] |
| METR，2026 年更新 | 新队列 | 随机对照试验 | 作者称新数据是"不可靠的信号" | METR [26] |

测得的效应从慢 19% 到在一个玩具任务上快 56% 不等。价值估计的两个因子，即开发者人数和生产率倍数，都是软数字。这削弱了那一万亿。它也削弱了任何认为复用所释放的价值是一个已知数字的说法。

<div id="3-what-the-projections-assume" class="anchor-alias" aria-hidden="true"></div>

## 3. 预测假设了什么

合起来看，这些预测建立在四个假设之上。每一个都是关于设计空间中某一个方向的陈述，而不是关于软件价值的陈述。

1. **一个方向：生成。** 每个变更都由模型写出。价值估计按模型缩放生产率，成本示例为每一次查询定价 [1]。
2. **高能耗与高算力。** 词元量、数据中心用电与资本支出被预测为同步增长 [8, 10, 11]。每次查询的能耗在下降，而每个任务的词元增长得更快 [9, 10]。
3. **按词元收租。** 收入按词元计费，或按成本即为词元的席位计费。一位开发者的年度词元成本被预测为与一份薪水同一量级 [1]。
4. **AI 永远在回路中。** 第 10,000 个任务的成本与第 1 个任务相同，因为模型在第 1 个任务上学到的任何东西，在第 10,000 个任务上都无法脱离模型运行。

陈述那一万亿的文章也陈述了它的极限："虽然替代定价在早期市场中有效，但商品的成本最终会收敛到其边际成本，定价也是如此" [1]。本文同意这一点，并追问一个正确编程任务的边际成本是多少。

<div id="4-the-theory-that-prices-the-task" class="anchor-alias" aria-hidden="true"></div>

## 4. 为任务定价的理论

[RCE 研究论文](/papers/rce/)提供了三个结果，把这个问题变成一个量。

**正确性是门槛。** 当任务的完成谓词 $C(z)$ 成立时，任务即完成：其测试通过、存在证明，或一致性轨迹匹配（[RCE §1](/papers/rce/#1-thesis)）。买方为 $C(z) = 1$ 付费，而不是为词元付费。

**焦耳是排名。** 在通过门槛的系统中，完成所需焦耳 $J^*$ 最少者胜出（[能动性 §1](/papers/agency/#1-thesis)）。在竞争市场中，通过同一门槛的卖方在成本上竞争，而一个任务的成本下限是完成它所需的能量加上证明的价格。

**形式只编写一次并被复用。** 生态系统中的程序从意图出发只编写一次，写成一个形式，每个目标都是它的投影，因此一个契合的成本只支付一次，此后每次使用都在处理器的能量下限上运行（[RCE §1](/papers/rce/#1-thesis)）。**大多数契合已经存在。** 程序是一个元组 $P = (S, E, \delta, D, \lambda)$，并且根据 Gurevich 的抽象状态机定理，每个顺序算法都具有这个形状（[RCE §3](/papers/rce/#3-the-form)）。程序之间的差别在于契合，而大多数契合已经存在："GitHub 上 70% 的代码由先前创建的文件的克隆组成"（[RCE §7](/papers/rce/#7-reuse-evidence)）。等价的契合通过同一门槛，因此提取会选出焦耳最少的那一个（RCE 命题 3）。

**命题 E0（被覆盖任务的价格）。** 当一个已存储的契合通过某任务的门槛时，称该任务被覆盖。在通过门槛的卖方之间，竞争把被覆盖任务的价格推向 $c_J \cdot J^*_{\text{floor}} + c_{\text{proof}}$，其中 $c_J$ 是一焦耳的价格，$J^*_{\text{floor}}$ 是检索、应用并检查该契合所需的能量，$c_{\text{proof}}$ 是检查的成本。生成只在未被覆盖的任务上出现。

Mixture of Limits 是该命题背后的哲学：完成一个任务所需的任何东西都有一个最小量，多出的部分都是浪费（[《计量提交门槛》第二部分](/papers/gates/#part-ii-the-cascade-mixture-of-limits)）。超过下限的按词元收租，就是在为浪费计费。

<div id="5-the-measurements" class="anchor-alias" aria-hidden="true"></div>

## 5. 测量

以下是测量结果，按 RCE 的方式标注。它们来自 [RCE 研究论文](/papers/rce/)。前几行测量生态系统本身；其后各行测量对从其他语言提升而来的代码的修复（[RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)）。

| 测量 | 结果 | 标签 | 出处 |
|---|---|---|---|
| 形式生态系统，10,000 个预注册形式，无损往返与确定性投影 | 10,000 中的 10,000，0 次模型调用 | 测量计数 | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| 形式生态系统，格式错误的输入和规格在入口处被拒绝 | 10,000 中的 10,000，0 次模型调用 | 测量计数 | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| 形式生态系统，Python 投影逐字节复现参考轨迹 | 10,000 中的 9,999，0 次模型调用 | 测量计数 | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| 被提升的代码，L0 单词元缺陷，9 个真实仓库，留出测试集 | 520,821 中的 520,541（0.9995，95% CI 0.9994 至 0.9995），0 次模型调用 | 测量计数 | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| 被提升的代码，L0，4 个从未用于调优的仓库 | 23,015 中的 23,015（95% CI 0.9998 至 1.0000），0 次模型调用 | 测量计数 | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| 被提升的代码，L1 Java，ManySStuBs4J 2.0，留出，整个文件 | 21,320 中的 13,586（0.637，0.631 至 0.644），0 次模型调用；仅凭代码块为 24,072 中的 9,288（0.386） | 测量计数 | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| 被提升的代码，L1 Python，TSSB-3M v1.0.0，留出 | 157,089 中的 27,266（0.174，0.172 至 0.175），0 次模型调用 | 测量计数 | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| 每个已解决任务的能量，所有梯级 | 0.10 J 至 0.40 J | `est_j`（CPU 秒 × 10 W） | [RCE §6.3](/papers/rce/#63-energy) |
| 每个已解决任务的能量，RAPL 子样本 | 0.056 J（L0，3,000 个任务），0.026 J（L1，2,000 个中解决 690 个）；运行总量上 ±10 J | `reported_j`（封装计数器减去所述空闲基线） | [RCE §6.3](/papers/rce/#63-energy) |

`measured_j` 保留给墙插电表，在每一行中都为空。

<div id="6-where-the-projections-break" class="anchor-alias" aria-hidden="true"></div>

## 6. 预测在何处失效

**按词元收租在被覆盖任务上失效。** 以形式编写的程序以 0 个词元编译到每一个目标：10,000 个预注册形式中的 10,000 个在没有任何模型调用的情况下完成了编译、投影并通过了门槛 [RCE §2.3]。在被提升的代码上，每一次被覆盖的修复同样购买了 0 个词元：520,541 次单词元修复，以及来自真实历史的 40,852 次单语句修复 [RCE §6.1, §6.2]。按词元定价的收入线，在一个不需要任何词元的任务上一无所得。

**AI 永远在回路中在晋升处失效。** 模型为一个新案例只获付一次费用；门槛把该契合接纳为处理器，此后同一形状的案例无需模型即可关闭（[RCE §4.2](/papers/rce/#42-the-gears)）。在这一点成立之处，第 10,000 个任务的成本不再等于第 1 个任务。每轮模型调用能否在真实规格上降至零，由 [RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n) 在大 N 下测量。

**正确结果并不需要高能耗。** 一次留出修复以每个已解决任务 0.026 至 0.056 报告焦耳（封装计数器读数）通过了门槛，且没有使用模型 [RCE §6.3]。向生产环境助手发出的一次中位文本提示测得为 0.24 Wh，即 864 J [12]。一个智能体编程任务使用许多次提示，而 IEA 认为智能体查询的能耗是简单查询的数百或数千倍 [10]。这些是不同机器上的不同任务，因此不构成比值。它们是一个有待检验的数量级，按协议 E1 进行。

**覆盖率按类别测量。** 各梯级给出的是任务类别内的覆盖率：几乎全部单词元缺陷，以及单语句缺陷的 63.7%（Java，整个文件；仅凭代码块为 38.6%）和 17.4%（Python），其中未解决的案例是那些意图比特位于代码块之外或属于新意图的案例（[RCE §6.0](/papers/rce/#60-the-repair-ladder-on-lifted-code)）。全部真实编程量中落在被覆盖类别里的份额，是命题 E5。

**两种下降相乘。** 在固定性能下，每次调用的价格每年下降 9 至 900 倍，取决于任务 [4, 34]。晋升把被覆盖案例上每个任务的调用次数推向零 [RCE §8.6]。每个任务的成本是两者的乘积。外推词元量的预测只为第一种下降定价。

**拼写检查模式。** [《拼写检查是全球性的》](/papers/spellcheck/) 记录了一种能力：其边际成本降到约为零，并且与人人已有的工具互补。它被捆绑进编辑器，其单独价格消失了，正如捆绑经济学所预言的 [13, 14]。一个被覆盖的编程任务具有同样的两个性质：其边际成本降到处理器下限，并且与人们已有的编辑器和仓库互补。预言也相同：被覆盖的任务会被捆绑，仍然被定价的是未被覆盖的案例和证明。

**平台所有者的捆绑。** 拼写检查模式有一个所有者。捆绑由拥有编辑器、仓库或云的一方完成。Spolsky 为这一策略命名：将你的互补品商品化 [31]。Nalebuff 表明捆绑可以阻止进入 [32]，Adams 与 Yellen 表明捆绑会进行价格歧视 [33]。这正在发生：GitHub 自 2026 年 6 月 1 日起把 Copilot 个人计划改为按用量计费 [30]，Cursor 在 2025 年把 Pro 从请求次数上限改为按 API 价格转嫁 [18]。平台可以把模型层免费送出，而把租金留在 IDE 和云中。按能量定价的引擎只有在门槛向它开放的地方，才能与零价格的捆绑竞争：即测试、证明与收据属于买方而不属于平台的地方。

**以一个形式取代许多语言。** RCE 论文提出这样一个论题：一个普适的形式，以每种语言为投影、以每个程序为提升，取代了对任何其他语言的需要（[RCE §3.6](/papers/rce/#36-one-ecosystem-lossless-and-the-universality-thesis)）。从市场角度看，含义如下。预测所计入的支出中，有很大一部分用于在语言、框架及其版本之间进行翻译，以及调和彼此分歧的实现。在一个程序只编写一次、所有目标都由它生成的生态系统中，这部分支出没有任何任务可买。采用程度是尚未确定的量，它是一个市场问题，而不是一条定理。

**什么会留存。** 第 2.1 节的价值估计可以成立。开发者可以产出更多。失效的是这样一种论断：价值以生成租金的形式被攫取。结论是有条件的。在覆盖率高且平台不捆绑之处，以下降的边际成本创造的价值归于掌握门槛、证明和低熵下限的一方，其中大部分归于买方。在平台捆绑之处，证据表明掌握门槛的是平台。

<div id="7-demand" class="anchor-alias" aria-hidden="true"></div>

## 7. 需求

更便宜的任务可以提高总需求。那篇风险投资文章预期如此："我们相信在这种情况下 Jevon 悖论成立" [1]。[《任务饱和与 AI 需求的总体反弹》](/papers/satiation/) 区分了两种效应。单个任务的需求止于完成谓词。总体使用仍可增长，因为更便宜的合成会开启新任务。复用改变了第一种效应，而对第二种效应保持开放。一个由被覆盖任务构成的更大市场，是一个边际成本为下限而非前沿的市场。唯一已发表的弹性很小。在 Anthropic 的 API 样本中，跨任务而言，成本每增加 1%，使用频率下降 0.29% [29]。这是跨任务的横截面关系，而不是随时间的价格变化。按其原样解读，需求缺乏弹性：在固定的任务集合上，价格下降会使收入缩减，这支持本文对租金的解读，而价格下降本身并不会使编程的使用量大幅增加。

<div id="8-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 8. 命题与协议

**命题 E1（成本曲线相交）。** 对于一个仓库中的任务流，RCE 每个已解决任务的累计成本在有限个任务之后会低于生成型智能体。*协议：* 在墙插电表下，在同一问题流上运行 [RCE 协议 8.3](/papers/rce/#83-a-wall-meter) 和一个普通的生成型智能体。按任务序号报告每个已解决任务的 `measured_j` 和美元，并报告交叉点序号。

**命题 E2（价格追随下限）。** 当一项编程能力被检索与规则所覆盖时，其市场价格会降向运行它所需的能量加上证明的成本。*协议：* 仿照拼写检查价格序列的方法，随时间跟踪某一被覆盖能力类别的标价与其测得的运行能量。

**命题 E3（算力规模在被覆盖任务上不是护城河）。** 在 RCE 覆盖的任务上，解决率不随最后一个档位的算力而提高。*协议：* 以无模型、本地小模型和前沿模型分别作为最后一个档位运行 [RCE 协议 8.2](/papers/rce/#82-swe-bench-lite-offline)。比较在最后一个档位之前已关闭的任务上的解决率。

**命题 E4（收入中的词元份额）。** 在覆盖率增长的仓库中，以词元支付的任务成本份额随覆盖率下降。*协议：* 在带有计价模型解析器的 RCE 收敛协议中（[RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n)），按轮次记录每个已关闭任务的词元、焦耳和美元并加以标注，按轮次报告成本中的词元份额。

**命题 E5（覆盖率）。** 真实编程任务量中落在 RCE 所覆盖类别内的份额是可测量的。*协议：* 从公共仓库中随机抽取已合并的拉取请求（GitHub 报告一年合并 5.187 亿个 [17]），按冻结的 G0 至 G2 档位能否产生通过门槛的补丁对每个请求分类，并报告被覆盖比例及其 95% 区间。在这个数字出现之前，命题 E0 适用于一个未经测量的份额。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

[1] G. Appenzeller and Y. Li, "The Trillion Dollar AI Software Development Stack," 9 October 2025. https://a16z.com/the-trillion-dollar-ai-software-development-stack/

[2] Menlo Ventures, "2025: The State of Generative AI in the Enterprise," December 2025. https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/

[3] Mordor Intelligence, "AI Code Tools Market Size, Share and 2031 Growth Trends Report," fetched 11 October 2026. https://www.mordorintelligence.com/industry-reports/artificial-intelligence-code-tools-market

[4] B. Emberson and D. Roodman, "The plunging price of thought," Epoch AI, 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

[5] Cursor, "Past, Present, and Future" (Series D announcement), 13 November 2025. https://cursor.com/blog/series-d

[6] Anthropic, "Anthropic raises \$30 billion in Series G funding at \$380 billion post-money valuation," 12 February 2026. https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation

[7] Microsoft Corporation, Form 10-Q for the quarter ended 30 September 2025, Note 3 and Item 2. https://www.sec.gov/Archives/edgar/data/789019/000119312525256321/msft-20250930.htm

[8] S. Pichai, "I/O 2026: Welcome to the agentic Gemini era," 19 May 2026. https://blog.google/innovation-and-ai/sundar-pichai-io-2026/

[9] L. Bai, Z. Huang and X. Wang, "How Do AI Agents Spend Your Money? Analyzing and Predicting Token Consumption in Agentic Coding Tasks," 2026. arXiv:2604.22750. https://arxiv.org/abs/2604.22750

[10] International Energy Agency, *Key Questions on Energy and AI*, executive summary, 2026. https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary

[11] International Energy Agency, *Energy and AI*, executive summary, April 2025. https://www.iea.org/reports/energy-and-ai/executive-summary

[12] C. Elsworth et al., "Measuring the environmental impact of delivering AI at Google Scale," 2025. arXiv:2508.15734. https://arxiv.org/abs/2508.15734

[13] Y. Bakos and E. Brynjolfsson, "Bundling Information Goods: Pricing, Profits, and Efficiency," *Management Science* 45(12), 1999. doi:10.1287/mnsc.45.12.1613

[14] C. Shapiro and H. R. Varian, *Information Rules: A Strategic Guide to the Network Economy*, Harvard Business School Press, 1998.

[15] McKinsey & Company, "The economic potential of generative AI: The next productivity frontier," June 2023. https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier

[16] Goldman Sachs, "Generative AI could raise global GDP by 7%," April 2023. https://www.goldmansachs.com/intelligence/pages/generative-ai-could-raise-global-gdp-by-7-percent.html

[17] GitHub, "Octoverse: A new developer joins GitHub every second as AI leads TypeScript to #1," 2025. https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/

[18] Cursor, "Clarifying our pricing," June 2025 pricing post. https://cursor.com/blog/june-2025-pricing

[19] Microsoft Investor Relations, FY26 Q1 Performance. https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/performance

[20] G. Appenzeller, "Welcome to LLMflation: LLM inference cost is going down fast," a16z, November 2024. https://a16z.com/llmflation-llm-inference-cost/

[21] DeepSeek, DeepSeek-V3.2-Exp release and API price reduction, 29 September 2025 (in Chinese). https://api-docs.deepseek.com/zh-cn/news/news250929

[22] OpenAI, "Announcing The Stargate Project," 21 January 2025. https://openai.com/index/announcing-the-stargate-project/

[23] D. Cahn, "AI's \$600B Question," Sequoia Capital, 2024. https://www.sequoiacap.com/article/ais-600b-question/

[24] Gartner, "Gartner Says Worldwide AI Spending Will Total \$1.5 Trillion in 2025," 17 September 2025. https://www.gartner.com/en/newsroom/press-releases/2025-09-17-gartner-says-worldwide-ai-spending-will-total-1-point-5-trillion-in-2025

[25] J. Becker, N. Rush, E. Barnes and D. Rein, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity," METR, 2025. arXiv:2507.09089. https://arxiv.org/abs/2507.09089

[26] METR, uplift study update, 24 February 2026. https://metr.org/blog/2026-02-24-uplift-update/

[27] S. Peng, E. Kalliamvakou, P. Cihon and M. Demirer, "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot," 2023. arXiv:2302.06590. https://arxiv.org/abs/2302.06590

[28] E. Paradis, K. Grey, Q. Madison et al., "How much does AI impact development speed? An enterprise-based randomized controlled trial," 2024. arXiv:2410.12944. https://arxiv.org/abs/2410.12944

[29] Anthropic, "Anthropic Economic Index report: Uneven geographic and enterprise AI adoption," September 2025. https://www.anthropic.com/research/anthropic-economic-index-september-2025-report

[30] GitHub Japan blog, "GitHub Copilotの個人向けプラン: ProとPro+へのフレックス枠追加と新しいMaxプランのご紹介," 15 May 2026 (in Japanese). https://github.blog/jp/2026-05-15-github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/

[31] J. Spolsky, "Strategy Letter V," Joel on Software, 12 June 2002. https://www.joelonsoftware.com/2002/06/12/strategy-letter-v/

[32] B. Nalebuff, "Bundling as an Entry Barrier," *Quarterly Journal of Economics* 119(1), 2004. doi:10.1162/003355304772839551

[33] W. J. Adams and J. L. Yellen, "Commodity Bundling and the Burden of Monopoly," *Quarterly Journal of Economics* 90(3), 1976. doi:10.2307/1886045

[34] Epoch AI, "LLM inference prices have fallen rapidly but unequally across tasks," data insight. https://epoch.ai/data-insights/llm-inference-price-trends
