---
title: "被许诺的万亿美元 AI 编程市场"
deck: "谁预测了万亿美元的人工智能编程市场，每项预测统计了什么，以及每项预测对能量、令牌和复用作了什么假设。"
lang: "zh-Hans"
source: "ai-coding-market"
complete: true
---

<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*版本 1.1，2026 年 10 月 11 日。数据与代码：[research.openie.dev/data/](/data/#economics)。LaTeX PDF：[/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf)（[源文件](/pdfs/latex/ai-coding-market.tex)）。*


<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 摘要

预测称 AI 编程每年将价值数万亿美元。本文列出是谁这么说的，按每个数字实际是什么为其贴上标签，并指出这些预测所共有的假设。

**用平常话说**

1. 关于 AI 编程的大数字大多是对未来的猜测，而不是已经赚到的钱的计数。
2. 它们几乎全都假设：每一段新代码都需要一个大型 AI 模型，并永远按词付费。
3. 如果能把可用的代码保存并复用，重复任务的成本就会降向运行它所耗电力的成本，那些预测就会偏高。

<div id="1-projections-and-measurements-are-different-objects" class="anchor-alias" aria-hidden="true"></div>

## 1. 预测与测量是不同的对象

下文每个数字都带有以下五种标签之一。

| 标签 | 含义 |
|---|---|
| **预测** | 基于明确假设的预测或价值估计 |
| **公司自报** | 公司关于自身给出的数字，例如年化运行率收入（最近一个月乘以十二）或融资估值 |
| **调查估计** | 来自买方调查的市场规模数字 |
| **备案** | 监管备案文件中的数字 |
| **测量** | 来自一次保留了产物的运行的计数或能量读数。能量读数带有以下三种标签之一：`est_j` 表示分析估计，`reported_j` 表示操作系统或片上计数器，`measured_j` 表示外接功率计 |

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

[4] 的每年 13 倍只是一个宽区间中的一点 [34]。下降由竞争和开放权重驱动，正如 DeepSeek 的降价所示 [21]。它不需要任何能量核算。这是第 5 节的第一种下降。复用加上另一种下降：每个任务的调用次数。

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
| 资本支出必须赚回的收入 | "AI's \$600B Question" | 分析 | Sequoia Capital [23] |

必须偿付的租金是硬件租金。这种规模的资本支出与承诺，要靠定价高于其能量成本的使用来回收。在能靠复用收束的任务上，这一基础更小。

<div id="27-productivity-evidence" class="anchor-alias" aria-hidden="true"></div>

### 2.7 生产率证据

| 研究 | n | 设计 | 效应 | 来源 |
|---|---|---|---|---|
| a16z 文章 | 访谈 | 估计 | 简单助手约 20%；同类最佳"至少翻倍" | [1] |
| GitHub Copilot，HTTP 服务器任务 | 招募的开发者 | 对照实验 | 在一个玩具任务上快 55.8% | Peng et al. [27] |
| Google 企业试验 | 96 名工程师 | 随机对照试验 | 任务用时减少约 21% | Paradis et al. [28] |
| METR，2025 年初 | 16 名资深开源开发者，246 个任务 | 随机对照试验 | 使用 AI 时慢 19% | Becker et al. [25] |
| METR，2026 年更新 | 新队列 | 随机对照试验 | 作者称新数据是"不可靠的信号" | METR [26] |

测得的效应从慢 19% 到在一个玩具任务上快 56% 不等。价值估计的两个因子，即开发者人数和生产率倍数，都是软数字。这削弱了那一万亿。这也意味着，更便宜的编程所释放的任何价值都不是一个已知数字。

<div id="3-what-the-projections-assume" class="anchor-alias" aria-hidden="true"></div>

## 3. 预测假设了什么

合起来看，这些预测建立在四个假设之上。每一个都是关于设计空间中某一个方向的陈述，而不是关于软件价值的陈述。

1. **一个方向：生成。** 每个变更都由模型写出。价值估计按模型缩放生产率，成本示例为每一次查询定价 [1]。
2. **高能耗与高算力。** 词元量、数据中心用电与资本支出被预测为同步增长 [8, 10, 11]。每次查询的能耗在下降，而每个任务的词元增长得更快 [9, 10]。
3. **按词元收租。** 收入按词元计费，或按成本即为词元的席位计费。一位开发者的年度词元成本被预测为与一份薪水同一量级 [1]。
4. **AI 永远在回路中。** 第 10,000 个任务的成本与第 1 个任务相同，因为模型在第 1 个任务上学到的任何东西，在第 10,000 个任务上都无法脱离模型运行。

陈述那一万亿的文章也陈述了它的极限："虽然替代定价在早期市场中有效，但商品的成本最终会收敛到其边际成本，定价也是如此" [1]。本文同意这一点，并追问一个正确编程任务的边际成本是多少。

<div id="4-what-a-correct-task-costs" class="anchor-alias" aria-hidden="true"></div>

## 4. 正确任务的成本是多少

为一项编程任务定义：$C \in \{0, 1\}$ 为其验收检查的结果（测试通过、证明核对通过，或输出与参考一致），$J$ 为达到 $C = 1$ 所用的能量（焦耳），$c_J$ 为能量价格（美元每焦耳），$c_{\text{check}}$ 为运行该检查的成本（美元）。买方为 $C = 1$ 付费，而不是为词元付费。

**能量界定边际成本。** 一次运行的边际成本至少为 $c_J J$，因为电力必须购买。在竞争下，价格趋向边际成本 [1, 14]。

**大量代码被复用。** Gurevich 证明，每一个顺序算法都被一个顺序抽象状态机所刻画：一组状态与一条转移规则 [35]。Lopes 及其同事测得，GitHub 上约 70% 的代码是先前创建文件的克隆 [36]。凡是已有通过检查的解，任务就可以通过检索并检查它来收束，而不必再次生成。

**命题 E0（被覆盖任务的价格）。** 当一个已存储的解通过其检查时，称该任务被覆盖。令 $J_{\text{floor}}$ 为检索、应用并检查该解所需的能量。在结果通过同一检查的卖方之间的竞争下，被覆盖任务的价格趋向

$$p_{\text{covered}} \to c_J \, J_{\text{floor}} + c_{\text{check}}.$$

生成只在未被覆盖的任务上才需要。对于覆盖比例为 $f \in [0, 1]$、未被覆盖任务上平均生成成本为 $p_{\text{gen}}$ 的任务流，每个任务的期望价格为 $\bar p = f \, p_{\text{covered}} + (1 - f) \, p_{\text{gen}}$。比例 $f$ 尚未被测量（命题 E4）。

<div id="5-where-the-projections-are-fragile" class="anchor-alias" aria-hidden="true"></div>

## 5. 预测在何处脆弱

**按词元定价。** 靠复用收束的任务不需要词元，因此按词元计价的收入线在其上赚不到任何东西。一个任务流上的词元总收入随 $1 - f$ 缩放。

**每个回路中的模型。** 若一次找到的解被存储并检查，则同一形状的后续任务不再需要模型，因此每个任务的模型调用次数随 $f$ 增大而下降。它们在真实工作中是否如此，由命题 E3 测量。

**每任务能耗。** 向生产环境助手发出的一次中位文本提示，由其运营方测得为 0.24 Wh，即 864 J [12]，而 IEA 把推理与智能体查询的能耗定为简单查询的数百或数千倍 [10]。尚无公开测量在同一批任务上比较生成与检索，因此此处不陈述任何比值。

**两种下降相乘。** 把每个任务的成本写成 $p = n \cdot q$，其中 $n$ 为每个任务的模型调用次数，$q$ 为每次调用的美元数。固定性能下每次调用的价格每年下降 9 至 900 倍，取决于任务 [4, 34]。复用降低 $n$。外推词元量的预测只建模了 $q$。

**捆绑。** 边际成本接近零、且与人们已有的工具互补的商品，往往会捆绑进该工具，其单独价格随之消失 [13, 14]。Nalebuff 表明捆绑可以阻止进入 [32]，Adams 与 Yellen 表明它可以进行价格歧视 [33]；Spolsky 描述了把互补品商品化的策略 [31]。定价变化可见：GitHub 自 2026 年 6 月 1 日起把 Copilot 的个人计划改为按用量计费 [30]，Cursor 在 2025 年把 Pro 从请求次数上限改为透传 API 定价 [18]。

**什么仍然成立。** 第 2.1 节的价值估计可以成立。脆弱的是如下假设：该价值以对生成的收费来收取，因为那种收费只适用于比例 $1 - f$。

<div id="6-demand" class="anchor-alias" aria-hidden="true"></div>

## 6. 需求

更便宜的任务可以提高总需求。那篇风险投资文章预期如此："we believe Jevon's Paradox in this case holds" [1]。应把两种效应分开。一旦 $C = 1$，对某一任务的需求就停止。总使用量仍可增长，因为更便宜的工作会开启新任务。已发表的弹性很小。在 Anthropic API 样本的各任务之间，成本每上升 1% 与使用频率下降 0.29% 相关，弹性为 $\varepsilon \approx -0.29$ [29]。这是跨任务的截面，而不是随时间的价格变化。当 $|\varepsilon| < 1$ 时，固定任务集上的价格下降会降低收入，因为收入 $R = pQ$ 的变化为 $dR/R = (1 + \varepsilon)\, dp/p$。

<div id="7-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 7. 命题与协议

**命题 E1（成本曲线相交）。** 对于一个代码库中的任务流，存储并复用已检查之解的方法，其每个已解决任务的累积成本，在有限个任务之后会落到每次变更都生成的方法之下。*协议：* 在外接功率计下对同一问题流运行两种方法。按任务序号报告 `measured_j` 与每个已解决任务的美元数，以及相交序号。

**命题 E2（价格追随地板）。** 凡能靠检索与规则收束的编程能力，其标价趋向 $c_J J_{\text{floor}} + c_{\text{check}}$。*协议：* 跟踪此类能力档的标价，相对其随时间测得的运行能量。

**命题 E3（成本中的词元份额）。** 在复用增长的代码库中，作为词元支付的任务成本份额会下降。*协议：* 按轮次记录每个已收束任务的词元、焦耳与美元，并按轮次报告成本中的词元份额。

**命题 E4（覆盖）。** 真实编程任务量中的覆盖比例 $f$ 是可测的。*协议：* 从公共代码库中随机抽取已合并的拉取请求样本（GitHub 报告一年内合并了 5.187 亿个 [17]），测试每一个是否存在通过该库测试的检索解，并以 95% Wilson 区间报告 $f$。

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

[35] Y. Gurevich, "Sequential abstract-state machines capture sequential algorithms," *ACM Transactions on Computational Logic* 1(1), 2000, pp. 77 to 111. doi:10.1145/343369.343384

[36] C. V. Lopes, P. Maj, P. Martins, V. Saini, D. Yang, J. Zitny, H. Sajnani and J. Vitek, "DéjàVu: a map of code duplicates on GitHub," *Proceedings of the ACM on Programming Languages* 1(OOPSLA), 2017, article 84. doi:10.1145/3133908
