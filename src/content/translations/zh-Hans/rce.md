---
title: "现实代码引擎：一个形式、多种契合，以及通往自主编程的低熵路径"
deck: "RCE 是一个原生代码生态系统。程序由意图只写一次，写成一个形式：一个状态、一组事件和一个纯粹、全函数的转移。形式是该意图的无损编码，每个目标（状态图、Rust、Python、XState、SCXML、WASM）都是它的忠实投影，而形式没有声明的状态无法被写出，因此错误的程序在入口处就被拒绝，事后没有什么需要差异比对或追踪。契合被复用，每个通过门槛的契合都使生态系统复利累积。在 10,000 个预先注册的形式上，引擎冻结、模型调用为 0，每个形式都往返得到相同的字节，每个投影都是确定性的，每个畸形输入和规约都在入口处被拒绝，Python 投影在 9,999 个形式上逐字节重放参考轨迹。来自其他语言的代码通过提升进入，这是一种从每种语言的文法到其语法树再到形式的构造。"
lang: "zh-Hans"
source: "rce"
complete: true
---

*版本 1.1，2026 年 10 月 11 日。数据与代码：[research.openie.dev/data/](/data/#rce)。演练场：[/playground/rce/](/playground/rce/)。LaTeX PDF：[/pdfs/latex/rce.pdf](/pdfs/latex/rce.pdf)（[源文件](/pdfs/latex/rce.tex)）。*

*一个形式，由意图写成。多种投影。门槛是正确性，排名是焦耳。*

本文的经济学解读见其姊妹篇[《被许诺的万亿美元 AI 编程市场》](/papers/ai-coding-market/)。本文只讨论工程与理论。

<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. 论点

通往自主计算机自动化有两条路径。区分它们的是两个量：每个正确结果所消耗的能量，以及系统在运行时必须消解的熵。

第一条路径是生成。大语言模型（LLM），一种统计文本模型，根据提示写出每一处改动。每个任务都要重新为生成付费，每个输出都是从高熵分布中新抽取的样本。

第二条路径是收敛。人们已经编写了将来会被编写的绝大部分代码。程序是一个数据库函数式状态机：一个形式，多种契合。人的意图是高熵的。机器的下限是低熵的。代码在设计上就会收敛，因此大部分工作是检索一个已存在的契合、改编它并证明它。现实代码引擎（RCE）建立在第二条路径之上。

**核心论断。**RCE 是一个完整的代码生态系统，程序在其中由意图原生地编写。意图只写一次，写成一个形式：一个状态、一组事件和一个纯粹、全函数的转移。形式是该意图的无损编码。每个目标（状态图、Rust、Python、XState、SCXML、WASM）都是形式的一个投影，每个投影都逐字节重放形式的轨迹。形式没有声明的状态无法被写出，超出其契约的输入在入口处就被拒绝。因此，生态系统中的程序不会偏离其意图，而通用语言中的程序却会偏离其注释、测试或其他实现；它也不需要事后的差异比对或错误追踪。每个通过门槛的契合都被存储并复用，因此生态系统随着增长而复利累积（[§2.4](#24-gated-verified-recursive-self-improvement)）。用其他语言写成的代码是进入的一道门：它通过提升进入（[§6](#6-lift-entering-the-ecosystem-from-other-languages)）。

两条路径面对同一道门槛。门槛是正确性：任务的完成谓词 $C(z)$，在这里是任务的测试、一个证明或一条一致性轨迹。在通过门槛的运行之中，系统按完成所需的焦耳数 $J^*$ 排名。正确性是约束，不是分数。

极限混合（Mixture of Limits）是其哲学：完成一项任务所需的任何东西都有一个最小量，多出的部分即是浪费（[《计量提交门》第二部分](/papers/gates/#part-ii-the-cascade-mixture-of-limits)）。RCE 是极限混合的一个实例。它的档位从最便宜的开始运行，第一个通过门槛的档位就结束该任务。

flowG 是一个独立的语言项目。RCE 是它的第一个学术演示。两者保持为各自独立的项目。

能量数字按来源标注。`est_j` 是解析估计。`reported_j` 是操作系统或芯片上的计数器读数。`measured_j` 保留给墙插功率计，在本文的每个结果中都为空。

<div id="2-two-paths-to-autonomy" class="anchor-alias" aria-hidden="true"></div>

## 2. 通往自主的两条路径

![一句话进入，一个下限输出。人的意图是高熵的；从意图到规约、到 626 种表层语言、到中间表示、再到机器码的一连串转换，在每个边界上都会丢失信息；所有代码最终都落到少数几种机器形状；RCE 用一个规范形式把含义写一次，把每种表层语言视为它的投影，并让最便宜的正确形式胜出。](/figures/rce/intent-entropy.svg)

*图 1. 意图熵与机器下限。另提供 [PNG 副本](/figures/rce/intent-entropy.png)。来源：Shannon（1951）；Lopes 等（2017）；626 种语言的计数来自 David Charlot 尚未发表的降级路径调查，其清单与方法将随本文数据一并发布，在此之前该计数属于作者本人。Python 与 C 的结果是语言规范规定的行为；C 的有符号溢出是未定义行为。*

**意图是高熵的。**“让结账更快”有许多含义：页面加载更短、步骤更少、刷卡审批更快、购物车有缓存，或只在某一类设备上更快。语境是隐含的，从不写出来。Shannon 测得印刷英语每个字母约 0.6 到 1.3 比特 [1]。字母是可预测的，含义却不是。

**每一次转换都会丢失信息。**意图变成规约，语境丢失。规约变成数百种表层语言之一，备选方案和边界情况丢失。源代码变成中间表示（IR），名字、风格和作者的理由丢失。IR 变成机器码，类型变成大小，循环变成跳转。

**下限是低熵的。**每个程序最终都是加载、存储、算术和跳转。目的地只容得下少数几种形状，所以代码向它们弯曲。收敛是设计使然。

**边界是含义分岔的地方。**同一行代码在边界上给出不同答案。在 Python 中，`-3 % 2` 等于 1，`-7 / 2` 等于 -3.5。在 C 中，`-3 % 2` 等于 -1，`-7 / 2` 等于 -3，而有符号溢出是未定义的。一个在每个边界都重新生成代码的系统，就在每个边界上猜测。

**以量来表述两条路径。**

| 路径 | 每个任务运行什么 | 运行时消解的熵 | 每个正确结果的能量 |
|---|---|---|---|
| 生成 | 模型抽样出一个新改动 | 提示的完整分布 | 每个任务都重新支付 |
| 收敛（RCE） | 查找、规则、求解器；模型只在最后 | 只有已存契合都未覆盖的残余 | 每个新情形支付一次；之后为处理器下限 |

RCE 用一个规范形式把含义写一次。每种表层语言都是该形式的投影，并经检查与之一致。在等价的形式之中，运行最便宜的正确者。

<div id="21-programming-is-coding-theory" class="anchor-alias" aria-hidden="true"></div>

### 2.1 编程即编码理论

本节的论点出自 David Charlot：全部编程都是编码理论。程序员在两个熵区之间转换意图。意图是高熵的，是含义上的一个分布。代码是低熵的，每个状态只有一个确定的转移。软件工作的每一步，从需求到寄存器，都是这一转换的一步。七十年来，文献以多种语言零散地说过这一点。本节把这些片段组装成一个论证，并把 RCE 的每个档位放到它上面。

**度量。**Shannon 定义了信源的熵与信道的容量 [40]，并测得印刷英语每个字母约 0.6 到 1.3 比特 [1]。Kolmogorov 于 1965 年在俄文期刊《信息传输问题》（*Problemy Peredachi Informatsii*）上提出了信息量的三种途径，并以算法途径为首：一个对象中的信息，是产生它的最短程序的长度 [41]。Solomonoff 作为归纳推理理论已得出同一对象 [42]，Chaitin 则证明程序大小服从与 Shannon 形式上相同的恒等式 [43]。Rissanen 把这一思想变成选择模型的规则，即最小描述长度 [44]。合起来，它们说明程序是一个码字：对一种行为的描述，而最短的正确描述就是下限。RCE 的提取规则，即在等价契合中保留焦耳最少者（命题 3），就是把比特换成焦耳的同一规则。

**代码位于低熵区，而且人们测量过它。**Hindle、Barr、Su、Gabel 与 Devanbu 发现代码“非常重复，事实上比自然语言更甚”，在同样的 n 元模型下交叉熵更低 [35]。Gabel 与 Su 发现一个项目的大多数代码行已在别处存在 [34]，Lopes 等发现 GitHub 上大多数文件是克隆 [33]。Tu、Su 与 Devanbu 发现代码还具有局部性：附近写过的内容能预测接下来的内容 [46]。Ray 及其同事发现有缺陷的代码行更不自然、熵更高，而缺陷修复后熵会下降 [45]。2025 年，Yang、Kolak、Hellendoorn 与 Martins 用补丁引起的熵变来为修复候选排序，并把正确补丁与过拟合补丁区分开 [51]。Allamanis、Barr、Devanbu 与 Sutton 以“自然性”为名综述了这一领域 [47]。这一结果并非只属于英语世界。Prem Devanbu 在 2013 年印度软件工程会议上以主旨演讲阐述了它 [50]。IBM 印度研究院的 Sridhara、Sinha 与 Mani 在同一会议上测量了代码周围的自然语言制品，发现提交信息最规则，而 Stack Overflow 上的文字表现得像普通英语 [49]。在中国，《软件学报》于 2022 年发表了代码自然性研究综述，阐述了交叉熵度量以及缺陷代码熵更高这一发现 [48]。在日本，大阪大学的土井、肥后、有馬、下仲与楠本先在日文的电子信息通信学会技术报告中、随后在 ICPC 2018 上，用 n 元自然性区分机器生成的源文件与人写的源文件 [73, 74]。生成的代码在熵的尺度上比人写的代码更低，因为生成器是一个固定的转换。在巴西，Arrebola 的博士论文在按项目和维护者划分的 n 元与主题模型上构建代码建议，并以交叉熵即编码下一个词元所需的比特数来评估 [75]。两个熵区在同一个代码库中可见：代码周围的文字是高熵的，代码是低熵的。

**度量方式很重要。**来自委内瑞拉和墨西哥的 Febres、Jaffé 与 Gershenson 按每条消息长度的词汇多样性比较了英语、西班牙语和程序文本，发现程序文本更多样 [76]。Rahman、Palani 与 Rigby 发现代码的 n 元可预测性很大一部分来自语法词元，去掉这些之后代码仍然是重复的，只是不如最初报告的那样多，其中 API 用法最为重复 [77]。两个结果都使论断更精确，而不是推翻它。符号的多样性不等于可预测性，低熵区是下一步条件分布的性质，而这正是确定性转移所固定的。出于这个原因，RCE 的 G0 以形状而非表层词元为键。

**意图位于高熵区。**Zave 与 Jackson 指出，需求是关于环境的陈述，规约是关于接口的陈述，两者之间的鸿沟只能由往往未成文的领域知识来填补 [64]。Brooks 把软件的困难分为本质与偶然：本质是概念构造，其大部分是规约与设计，而不是表示 [61]。Naur 认为程序是程序员所持理论的可见部分，而该理论无法从文本中完全恢复 [62]。用 Shannon 的眼光看，三者说的是同一件事。意图携带的不确定性多于任何一个程序，而编写程序正是消除这种不确定性的行为。代码写完后仍留在程序员脑中的，是代码没有编码的那部分意图。

**转换是一种精化，而精化是一种收窄。**Hoare 为程序给出了一种逻辑，在其中程序相对于前置条件和后置条件而正确 [54]。Wirth 教授逐步精化：通过一连串决定把任务分解为指令，每个决定固定规约留下的一个选择 [53]。Dijkstra 的卫式命令把开放的选择明确为非确定性，并通过消除它从规约推导出程序 [52]。在慕尼黑，Bauer 与 Wössner 的 CIP 项目把程序开发构建为从规约到程序的一系列保持正确性的变换 [58]。在法国，Abrial 的 B 方法及其后的 Event-B 把精化推向工业规模，每一步都有证明义务 [55, 56]。在芬兰，Back 与 von Wright 为精化给出了格论演算 [57]。在每一种之中，规约表示一组可接受的行为，每一步精化都缩小这个集合，直到只剩一种确定的行为。这就是每一步都有证明的熵减。RCE 的形式是这条链的最后一环：一个在数据库状态上全函数的、确定的转移 $\delta$，所有选择都已消解（[§3.2](#32-definitions)）。

**综合是收窄假设空间的搜索。**Gulwani 的 FlashFill 从少量输入输出示例中学习字符串程序，方法是表示所有一致程序的集合，并与每个新示例求交 [59]。Gulwani、Polozov 与 Singh 把程序综合一般地表述为在受意图约束的程序空间中的搜索 [60]，Solar-Lezama 的草图法用求解器填补部分程序中的空洞 [27]。每个示例或约束都是一次排除假设的测量。Shannon 的度量计算需要多少次这样的测量。RCE 的 G2 就是这个档位。

**转换的产物只有一种形状。**Gurevich 证明了每个顺序算法都能在其自身的抽象层次上被一个抽象状态机刻画 [2]。Codd 把状态做成关系 [5]，事件溯源把状态做成只追加日志的折叠 [14]。在 Curry 与 Howard 之下，证明即程序，命题即类型 [18, 72]，所以经过验证的契合就是其规约的证明。这就是低熵区形状很少的原因：无论表层语言为何，目的地都是数据库之上的状态机。

**没有门槛，低熵就会衰退。**Lehman 在数十年的大型系统中观察到，使用中的程序必须不断变化，其复杂度会增长，除非有人做功去降低它 [63]。Torres、Baltes、Treude 与 Wagner 测量了 25 个项目提交历史上的结构熵与文本熵，发现两者一起上升 [78]。熵从环境回流进代码。要把代码保持在低熵区，系统就需要在每次改动上设一道门槛，而 RCE 的门槛是正确性（[§4.3](#43-the-gate)）。

**编译器已经在做信源编码。**Franz 与 Kistler 以压缩的抽象语法树发布程序，并在加载时生成本机代码，这是在程序自身文法上的信源编码 [67]。Fraser 从语料库中推断代码的统计模型以压缩代码 [68]。二村于 1971 年在日本期刊 *Systems, Computers, Controls* 上指出，把解释器针对一个程序特化会得到编译后的程序，而把特化器特化会得到编译器 [70]。新西伯利亚的 Ershov 把同一思想发展为混合计算 [71]。Cousot 夫妇的抽象解释为程序的每种行为计算出一个可靠的、信息量更低的描述 [69]。与信道编码的类比是本文的解读，而非被引用的定理：类型、测试和证明增加经过检查的冗余，使错误程序在运行前就被检测出来，正如奇偶校验检测出损坏的码字。

**擦除是焦耳的去处。**Landauer 证明，一个逻辑上不可逆的步骤，即擦除一个比特，至少耗散 $k_B T \ln 2$ [65]。Bennett 证明计算在原则上可以做成逻辑可逆的，因此承载这一界限的是擦除，而不是计算 [66]。把高熵的意图转换为一个低熵程序，会丢弃意图所允许的每一个备选。这种丢弃是对关于备选的信息的擦除，它有一个热力学下限。[能动性论文](/papers/agency/#1-thesis)按这一下限为每个确认的比特定价。RCE 对每个新情形只支付一次丢弃，并存储结果，因此重复的情形不会擦除任何新的东西。

<div id="22-how-rce-converts-and-where-each-gear-sits" class="anchor-alias" aria-hidden="true"></div>

### 2.2 RCE 如何转换，以及每个档位所处的位置

以编码理论来读，一个任务作为一条消息到达，其剩余的不确定性就是任何已存契合都尚未消解的部分。每个档位以不同的代价消除不确定性，档位按这一代价排序（[§4.2](#42-the-gears)）。

| 档位 | 它对不确定性做了什么 | 在上述论证中的谱系 |
|---|---|---|
| G0 查找 | 识别出意图已经被编码过；以检索消解它，代价为处理器下限 | 重复性与克隆 [33, 34, 35]；局部性 [46] |
| G1 规则 | 应用一个已知的带卫式重写；无需搜索即可消解反复出现的残余 | 保持正确性的变换 [52, 58]；带证明义务的精化 [55, 56] |
| G2 综合 | 搜索一个假设空间，并用示例、约束和求解器收窄它 | 作为搜索的程序综合 [27, 59, 60] |
| G3 至 G5 模型 | 当较低档位都无法填补缺口时，从学到的代码分布中抽样；只作为提议者 | 代码的交叉熵模型 [35, 47] |
| 门槛 | 只接受带有测试、覆盖率和证明证书的候选 | Hoare 逻辑 [54]；Curry-Howard [18, 72] |
| 晋升 | 存储被接受的契合，使同一残余下次只需 G0 的代价 | 最小描述长度 [44]；Landauer 擦除只付一次 [65] |

第 2 节表中的两条路径区别在于转换在何处支付。生成路径在每个任务上都抽样提示的完整分布，因此每次都重新支付高熵的一侧。收敛路径只为残余支付，而且只付一次。这一差异的经济学解读见[《被许诺的万亿美元 AI 编程市场》第 4 节](/papers/ai-coding-market/#4-the-theory-that-prices-the-task)。档位顺序背后的停止规则是[极限混合](/papers/gates/#part-ii-the-cascade-mixture-of-limits)，而每个任务上的停止是[任务饱和](/papers/satiation/)。

<div id="23-the-ecosystem-at-large-n" class="anchor-alias" aria-hidden="true"></div>

### 2.3 大 N 下的生态系统

[§1](#1-thesis) 的论断被直接测量。该基准在运行之前预先注册（[`bench/ecosystem/PREREG.json`](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ecosystem/)）。一个带种子的生成器写出 10,000 个形式，每个形式由一个源、一条规则和一个汇组成，规则体是在八个运算符上深度至多为 3 的随机算术项。引擎冻结在提交 `a079967`，不调用任何模型。

| 性质 | 每个形式检查什么 | N | 成立 | 模型调用 |
|---|---|---|---|---|
| 无损编码 | 形式 IR 到规范 JSON、再到形式 IR、再到规范 JSON 是恒等映射 | 10,000 | 10,000 | 0 |
| 确定性投影 | 两次编译得到相同字节；原始形式与往返后形式的 XState 和 SCXML 投影逐字节相同 | 10,000 | 10,000 | 0 |
| 忠实投影，Python | 生成的 Python 模块在 40 个带种子的事件上逐字节打印参考轨迹 | 10,000 | 9,999 | 0 |
| 入口门槛，输入 | 五类畸形载荷（类型错误、null、缺失字段、空、嵌套）全部被拒绝，没有任何被接受的结果 | 10,000 | 10,000 | 0 |
| 入口门槛，规约 | 含有指向未声明节点之流的规约在编译之前被拒绝 | 10,000 | 10,000 | 0 |

那一次 Python 未命中按未命中计；同一形式和事件在回归测试 `tests/form_ecosystem_regress.rs` 中于 32 个哈希种子下重放结果完全相同。这里的能量只有 `est_j`；整个运行在一个核心上耗费 393 秒 CPU 时间。生成的形式规模很小，因此该表测量的是编码、投影和门槛。来自真实程序的提升形式按 [§8.7](#87-lift-coverage-across-languages) 的协议测量。

<div id="24-gated-verified-recursive-self-improvement" class="anchor-alias" aria-hidden="true"></div>

### 2.4 有门槛、经验证的递归自我改进

Good（1965）[111] 把超智能机器定义为能够设计出更好机器的机器，于是改进会递归进行。Yudkowsky（2013）[113] 把这个问题表述为回报问题：每一单位改进究竟使下一单位更便宜还是更昂贵。Schmidhuber 的哥德尔机（2007）[112] 给出了第一个带保证的形式化回答：程序只有在证明某次重写会提高其期望效用之后，才会重写自身的任何部分，包括它自己的搜索。Löb 定理（1955）[114] 是一个信任自身的证明者会遇到的障碍，Yudkowsky 与 Herreshoff（2013）[115] 称之为 Löb 障碍：一个系统一般无法证明使用其自身证明系统的后继者是可靠的。近期的系统放弃了证明要求，改为按测得的分数选择：STOP（Zelikman 等，2023）[116] 改进那个用来改进代码的脚手架，Darwin Gödel Machine（Zhang 等，2025）[117] 保存一个按基准分数挑选的自我修改编程智能体档案库，AlphaEvolve（Novikov 等，2025）[118] 在自动评估器下演化程序，Voyager（Wang 等，2023）[119] 不断扩充一个经验证技能的库，供后续任务复用。

RCE 采用哥德尔机的结构和 Voyager 的库，但有两点不同，正是这两点消除了障碍。第一，被改进的对象不是证明者。RCE 晋升的是处理器、重写和档位，每一项都对照一个固定的、单独认证的内核加以检查：Kani 测试框架和 SMT 编码在晋升过程中从不改变，因此没有任何一步需要信任后继者的证明系统。第二，门槛是边界处的正确性证明，而不是分数。分数可以在某个接口假设被破坏时依然上升；而边界处的证明，任何破坏该假设的改动都无法通过。

**命题 R1（单调正确性）。**如果每个被晋升的改动都通过其边界的检查，并且其他边界的检查保持不变，那么晋升之前由这些检查确立的每一条性质，在晋升之后依然成立。

**命题 R2（复利累积）。**设工作负载是任务的多重集，并设一个被晋升的处理器关闭其形状的每一个任务。那么第 t 轮的升级次数关于 t 不增，并且在第 1 轮之前晋升的一次修正，会使每个时间跨度上的累计升级次数减少它在之后每一轮所关闭的升级次数。在演练场的参考工作负载中，八轮的累计升级次数在汇点处做一次修正后从 21 降到 15，两种情况下最后一轮都降为零，每个任务都被正确关闭，没有任何晋升被拒绝。

**命题 R3（成本下降）。**由于被晋升的处理器取代一次模型调用来执行，而它的成本是该处理器的操作数按底层基质价格表计价，因此随着升级次数趋向零，一轮的能量趋向仅由处理器构成的能量。

Futamura 投影（1971 年，1999 年重新发表）[120] 和 Turchin 的超级编译（1986）[121] 给出了这一过程的极限。把解释器针对一个程序特化，得到编译后的程序；把特化器本身特化，得到编译器。RCE 的晋升把通用的升级路径特化到实际出现的形状上，因此引擎收敛到其工作负载的残余程序：即仍须由模型或人提供的那部分计算。有门槛的递归自我改进就是这种收敛，以经过检查的步骤完成。[RCE 演练场](/playground/rce/#compounding)的 Compounding 层在浏览器中运行这一工作负载。

<div id="3-the-form" class="anchor-alias" aria-hidden="true"></div>

## 3. 形式

<div id="31-the-strongest-formal-statement-of-same-form" class="anchor-alias" aria-hidden="true"></div>

### 3.1 “同一形式”最强的形式化表述

先说明定理的范围。Gurevich 的顺序公设涵盖顺序算法；并行与交互式算法需要 Blass 与 Gurevich 的进一步公设 [3]。Blass、Dershowitz 与 Gurevich 认为，没有任何单一的算法等价关系能适合所有目的 [79]，Moschovakis 与 Vardi 阐述了关于“什么是算法”的争论 [80, 81]。一个做输入输出的 Web 处理器位于顺序定理之外。形式按交互式路线的方式处理交互：每个输入是 $E$ 中的一个事件，状态机据此前进一步。因此“一个形式”是一种建模选择，以顺序定理为基础并按惯例加以扩展，在生产中有 Elm 架构 [83]、持久化工作流的事件历史 [84] 以及 Flo 等流语义 [82] 作为先例。第 3.4 节的命题是针对这一选择陈述的。

Gurevich 的抽象状态机（ASM）定理是“每个算法都只有一种形状”最强的形式化表述 [2]。抽象状态机是这样一种机器：其状态是一阶结构，其一步是有限个带卫式的更新。Gurevich 给出三条公设。顺序时间：算法有状态、初始状态和一步映射 $\tau$。抽象状态：状态是同一固定词汇上的一阶结构，在同构下封闭。有界探索：有限个项决定每一步。他的主定理（定理 6.13）写道：“对每个顺序算法 A，存在一个等价的顺序抽象状态机 B。”Blass 与 Gurevich 将其推广到并行算法 [3]。Dershowitz 与 Gurevich 增加第四条公理，即初始运算是可计算的，并由此推出 Church 论题 [4]。

<div id="32-definitions" class="anchor-alias" aria-hidden="true"></div>

### 3.2 定义

**定义 1（形式）。**程序是一个元组

$$P = (S, E, \delta, D, \lambda)$$

- $S$，状态空间：固定词汇 $\Sigma$ 上的结构。每个状态都是 Codd 意义上的一个数据库实例 [5]。
- $E$，事件字母表，包括逻辑时钟的嘀嗒。
- $\delta : S \times E \to S$，转移：全函数、确定且纯，写成有限个形如“若 $\varphi$ 则 $f(\bar t) := t_0$”的带卫式更新，每一步读取有界个位置。
- $D = (s_0, L)$，持久存储：一个初始状态和一个只追加的事件日志 $L = e_1, \dots, e_n$。
- $\lambda : S \times E \to O$，输出映射。Mealy 机读取两个参数 [6]；Moore 机只读取状态 [7]。

**定义 2（形式与契合）。***形式*是带有四条不变式的元组形状：$\delta$ 是确定且纯的；探索是有界的；词汇是固定的；状态是日志的折叠，

$$\mathrm{state}(D) = \mathrm{foldl}(\delta, s_0, L).$$

*契合*是填充这一形状的数据：词汇 $\Sigma$、字母表 $E$ 与 $O$、定义 $\delta$ 的规则程序 $\Pi$、定义 $\lambda$ 的输出规则，以及初始数据 $s_0$。用 Gurevich 的术语，契合是词汇、ASM 程序和初始结构。用 Codd 的术语，$\Sigma$ 是模式，$s_0$ 是实例。用产品线的术语，契合是一次特性选择 [8]。用语法引导综合（SyGuS）的术语，契合是文法中满足规约的一个项 [9]。

**定义 3（契合等价）。**若对每个日志 $L$，两个契合在 $\lambda$ 下的输出序列都相等，则二者等价。

**定义 4（契合语言）。**一种其项表示契合的文法。编程语言、SCXML 文档、XState 配置和 `.rce` 规约都是契合语言。若 $\Sigma$ 上的每个 ASM 程序在某契合语言中都有一个项，则该语言是完备的。

**定义 5（控制投影）。**把 $\Sigma = \Sigma_c \cup \Sigma_d$ 分为有限的控制符号与数据关系。$P$ 的状态图是 $\delta$ 在 $\Sigma_c$ 上的投影：状态是 $\Sigma_c$ 的取值，转移携带一个事件和一个关于 $\Sigma_d$ 的卫式，动作是对 $\Sigma_d$ 的更新。Harel 的状态图给出层次结构与正交区域 [10]。

**定义 6（契合 e-图）。**对契合 $F$ 和一组可靠重写 $R$，契合 e-图 $EG(F, R)$ 是 $F$ 的规则项在 $R$ 下饱和后的 e-图 [11, 12]。每个 e-类包含按定义 3 等价的契合。

**定义 7（焦耳代价）。**$\mathrm{cost}_J(t)$ 是在指定基底上运行项 $t$ 一次的估计能量（`est_j`），按预期运行次数加权。

<div id="33-why-database-functional-state-machine" class="anchor-alias" aria-hidden="true"></div>

### 3.3 为什么是“数据库函数式状态机”

有限的关系结构就是数据库实例，所以 Gurevich 的状态是一个数据库，每一步是一个有界事务。*数据库*：$S$ 是关系结构。*函数式*：$\delta$ 与 $\lambda$ 是纯的。*状态机*：运行是 $\delta$ 在事件上的折叠。Moseley 与 Marks 在架构上划出同一条线 [13]。事件溯源在应用状态上划出这条线：“把对应用状态的所有改动捕获为一个事件序列” [14]。Dedalus 在逻辑中划出这条线，其中可变状态是以时间为索引的关系 [15]。

<div id="34-propositions" class="anchor-alias" aria-hidden="true"></div>

### 3.4 命题

**命题 1（形式刻画每个顺序算法）。**对每个顺序算法 $A$，存在一个形式实例 $P$，其运行就是 $A$ 的运行。

*证明梗概。*定理 6.13 给出一个具有 $A$ 的状态、初始状态和一步映射的 ASM $B$。令 $E = \{\varepsilon\}$，$\delta(s, \varepsilon) = \tau_B(s)$，$D = (s_0, \varepsilon^n)$，$\lambda$ 为恒等映射。$n$ 次嘀嗒后的折叠为 $\tau_A^n(s_0)$。由 Gurevich 的推论 3.3，$P$ 与 $A$ 有相同的运行。∎

**命题 1b（交互式程序）。**用一个零元输入符号扩展 $\Sigma$，在每一步之前将其置为 $e$；则 $\delta(s, e) = \tau(s[\mathit{in} := e])$ 是扩展词汇上的顺序算法，命题 1 适用。这一构造是我们的。

**命题 1c（可计算性）。**在 Dershowitz 与 Gurevich 的公理下，每个形式实例都计算一个图灵可计算函数 [4, 16, 17]。形式不增加计算能力。它让该类中的每个程序都具有同一形状。

**命题 1d（证明即契合）。**“对给定命题的每个证明，都存在一个相应类型的程序” [18]。类型是规约，证明是满足它的契合。正确性门槛就是这样一个证明或一个通过的验收测试的存在。

**命题 2（一个生成器）。**一个函数 $G : \mathrm{Fit} \to \mathrm{Program}$ 为每个契合生成可运行的程序，且不读取任何领域。*依据：*每个程序都是形式实例，所以 $G$ 输出一个带类型的存储、一个事件类型、编译后的规则、一个带折叠的日志和一个输出分派器。Rails 生成器、JHipster 和 Yeoman 等脚手架是限制在小型契合语言上的 $G$。产品线工程始于“对相关软件系统之间共性的系统性发现与利用” [8]；这一共性就是形式。

**命题 3（作为提取的极限混合）。**以 $\mathrm{cost}_J$ 进行的提取返回提取器在 $F$ 的 e-类中找到的焦耳最少的项。*证明梗概。*重写是可靠的，所以 e-类中的每个项都具有 $F$ 的可观察行为，并通过同一道门槛。提取最小化代价，而代价是焦耳。∎ 这就是应用于代码的极限混合：保留完成任务的最小契合，其余是浪费。

**命题 4（重放确定性）。**若 $\delta$ 不读取墙上时钟、不依赖名字排序更新并记录每个输入，则同一 $D$ 的两次重放在每一步都给出相同的状态哈希。

**命题 5（状态图投影是可靠的）。**把一次运行的每个状态投影到 $\Sigma_c$ 上。结果是所输出的状态图在相同事件下的一次运行。

**命题 6（协调预算）。**标记为单调的规则在副本上无需协调即可运行；只有非单调规则需要协调点。*依据：*CALM 定理，“具有一致、无协调分布式实现的程序，恰好是可以用单调逻辑表达的程序” [19]。

**命题 7（作为焦耳导数的智能）。**令 $X$ 计数通过门槛的任务，$J$ 为所耗焦耳。$\iota = dX/dJ$ 从 $D$ 中回溯读取，$D$ 记录了每个事件及其 `est_j`。在 $\mathrm{cost}_J$ 下的提取保持门槛不变且不提高 $J$，因此在相同 $X$ 下它不会降低 $\iota$（[能动性，第 2.3 节](/papers/agency/#23-layer-3-calculus-intelligence-as-a-derivative-read-in-hindsight)）。

<div id="35-graph-e-graph-and-statechart" class="anchor-alias" aria-hidden="true"></div>

### 3.5 图、e-图与状态图

| 结构 | 形式的哪一部分 | 它决定什么 |
|---|---|---|
| 状态图 | $\delta$ 在 $\Sigma_c$ 上的卫式 | 触发哪个转移 |
| 数据流图 | $\delta$ 与 $\lambda$ 的读写依赖（Kahn 进程网络 [20]） | 运行什么，以什么顺序 |
| E-图 | 契合的等价类 | 运行哪个等价契合 |

状态图和图描述一个契合。e-图描述与之等价的每个契合。提取按焦耳在其中选择。

<div id="36-one-ecosystem-lossless-and-the-universality-thesis" class="anchor-alias" aria-hidden="true"></div>

### 3.6 一个生态系统、无损，以及普适性论题

**构造即无损。**Shannon 的信源编码定理把无损编码的下限定在信源的熵上 [40]。形式在一种可检查的狭义上是意图的无损编码：形式的规范序列化是单射，因此在任何状态、事件或转移上不同的两个形式具有不同的形状哈希，而对序列化解码会得到同一个形式。到某个目标的每个投影都只是形式的函数。双向变换使往返变得精确。Foster、Greenwald、Moore、Pierce 和 Schmitt 把透镜定义为一对 get 与 put 函数，其往返条件使视图与其源保持一致 [122]；Hofmann、Pierce 和 Wagner 把这些条件推广到对称透镜 [123]；Czarnecki 及其同事综述了模型工程、数据库和编程语言中的同类一致性条件 [124]。RCE 的往返条件是整个程序层面上的 GetPut 条件：把一个投影提升回来，形状哈希不变。

**构造即正确。**Dijkstra 在 1968 年提出程序与其证明应一同开发，使正确性被设计进去而不是靠测试得出 [125]。Hall 和 Chapman 把这种方法带入一个商业安全系统，每一步都有形式化规约与精化 [126]。Minsky 为类型化函数式编程提出的规则，让非法状态无法表示，在类型层面说的是同一件事：一个无法容纳坏值的类型免去了对坏值的检查 [127]。Turner 的全函数式编程要求每个函数在每个输入上都终止，使程序表示一个没有隐藏失败的数学函数 [128]。RCE 的形式在 Turner 的意义上是全函数的，其契约类型在 Minsky 的意义上使未声明的状态无法表示，而 [§2.1](#21-programming-is-coding-theory) 的精化链在 Dijkstra 的意义上终止于它。其后果就是 [§1](#1-thesis) 所述：错误在入口处被拒绝，因此事后没有什么需要差异比对或追踪。

**普适性论题。**该论题属于 David Charlot：RCE，以及任何基于 RCE 框架构建的语言（flowG 是第一个），取代对任何其他语言的需求。用理论的语言表述，存在一个普适形式。程序在其中原生编写，每种现有语言都可作为忠实投影从它到达，每个现有程序都通过提升进入它。Gurevich 的论题提供了基础：每个顺序算法都在其自身的抽象层次上被一个抽象状态机逐步刻画 [2]，并行算法亦然 [3]。形式就是数据库状态之上的这样一台机器。

**命题 U1（刻画）。**若语言 $L$ 中的一个程序是 Gurevich 意义上的顺序或并行算法，则存在一个形式，其转移在该程序的抽象层次上逐步模拟它 [2, 3]。

**命题 U2（忠实投影）。**若形式到 $L$ 的投影 $\pi_L$ 在契约内的每个输入上都保持形式的轨迹，则对轨迹的每个观察者而言，形式与其投影可以互换，$L$ 不会增加形式所缺少的任何东西。

**命题 U3（构造式提升）。**每种在用的编程语言都有一套形式文法、一个产生具体语法树的解析器、一棵抽象语法树，以及由其规范或参考实现确定的语义。提升 $\lambda_L$ 按语言分三个阶段构建：先是文法，然后是抽象语法树，然后是形式，$L$ 的每个构造都按 $L$ 的语义得到其形式规则。如此构建的提升在行为上满足 $\pi_L(\lambda_L(p)) \equiv p$，在形状哈希上满足 $\lambda_L(\pi_L(F)) = F$，因此这一对是 [122] 意义上的透镜，$L$ 中的程序被无损地保存为一个形式。

**命题 U4（取代）。**若 U2 与 U3 对语言 $L$ 成立，则没有任何程序需要用 $L$ 来写：它作为形式写一次，在平台需要时以 $L$ 生成。

U1 是一个定理。U2 通过差分测试逐目标检查（[§5.1](#51-differential-testing-across-five-targets)），并在 [§2.3](#23-the-ecosystem-at-large-n) 中以大 N 检查。U3 是一种构造，从文法开始逐种语言构建，[§8.7](#87-lift-coverage-across-languages) 说明在构建过程中如何测量这一构造。关于采用的论断见[姊妹随笔](/papers/ai-coding-market/)。

<div id="4-the-engine-gears-gate-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## 4. 引擎：档位、门槛与收据

<div id="41-the-engine-is-a-form" class="anchor-alias" aria-hidden="true"></div>

### 4.1 引擎是一个形式

RCE 把软件作为由小型确定性处理器构成的图来运行。无法决定的处理器会提出一次升级。解析器对这次升级回答一次，答案被安装为永久处理器，因此同一形状的下一个情形无需解析器即可运行。引擎满足形式的每条不变式，每条都由 `tests/form_laws.rs` 中一个具名测试检查：

| 不变式 | 引擎做什么 |
|---|---|
| 重新加载是经过验证的折叠 | 重新加载逐字读取日志，重新计算每个哈希与链接，并用 $\delta$ 折叠其余部分。没有任何东西被重新打戳。断开的链拒绝加载。 |
| 与名字无关的嘀嗒顺序 | 处理器按拓扑秩顺序运行，再按与名字无关的节点键运行。输出先暂存，在所有处理器运行后再投递，与 ASM 语义一致。给每个节点改名后，每个条目处的匿名状态哈希都相同。 |
| 不静默丢弃 | 满的邮箱把消息放入有序队列并记录 `Backpressure`。容量为 1、任务为 10 时，记录 9 条 `Backpressure`，全部 10 个任务都关闭。 |
| 载荷在日志中 | 输入、嘀嗒、外部处理器结果、安装和故障都是日志条目。在 1,000 个随机日志上，每个条目后的状态哈希都与从空引擎开始的折叠一致。 |
| 逻辑时钟 | 活性按嘀嗒计数，而非墙上时间。 |
| 稳定哈希 | 对条目、状态、形状和规则 id，在规范 JSON 上（每一层的键都排序）计算 SHA-256（安全哈希算法，256 位）。 |

<div id="42-the-gears" class="anchor-alias" aria-hidden="true"></div>

### 4.2 档位

只有当下面的档位未通过门槛时，才尝试上一个档位。这个顺序是一个固定级联，而固定级联是极限混合的一个实例。

| 档位 | 方法 | 谱系 |
|---|---|---|
| G0 查找 | 以 SHA-256 形状哈希为键的共享处理器库；对于代码修复，定位到排好序的函数 | 代码搜索与检索 [21] |
| G1 规则 | 确定性的带卫式修复模板和由模式导出的校验器，每个都经过变异敏感性检查 | PAR、TBar、AVATAR、FixMiner [22, 23, 24, 25]；Coccinelle 等代码改写工具 [26] |
| G2 综合 | 在处理器文法上枚举、求解器与 e-图 | 草图法、SyGuS、egg [27, 9, 12] |
| G3 至 G5 模型 | 带类型的决策模型、本地小模型，最后才是远程模型 | 模型级联 [28] |

<div id="43-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.3 门槛

候选只有在通过门槛时才被晋升。门槛重放该节点记录的输入，在新样本上以影子方式运行候选并带有覆盖界（在声明的错误预算下使用三法则），检查输出模式，并要求第 5 节的证明证书。被拒绝的候选连同其反例一起记录。

<div id="44-receipts" class="anchor-alias" aria-hidden="true"></div>

### 4.4 收据

每一次晋升、拒绝、推迟和安装都是只追加日志中的一次变更，日志以 SHA-256 链接，因此篡改任何过去的条目都会破坏这条链 [29, 30]。每个处理器的代价根据解释器操作计数，用 flowG 的本机代码后端 FGIR 的主机代价表定价，并标注为 `est_j`。每次调度调用都带有其收据。阶梯运行在一个子样本上加入封装级能量计数器，标注为 `reported_j`。

<div id="45-the-form-compiler" class="anchor-alias" aria-hidden="true"></div>

### 4.5 形式编译器

`rce form` 接受一个规约及其契合，并从一个形式 IR 输出五个目标：

```
.rce spec + fit
  lower ─► normalize ─► egg e-graph, equality saturation (+ admitted proposals)
  ─► extract (cost = est_j) ─► Form IR (typed relations, regions, rules with SHA-256 ids)
     ├─ Rust crate (pure step, typed state, SHA-256 log and fold, tests)
     │  └─ WASM (the same crate on wasm32-wasip1)
     ├─ Python (standard library only)
     ├─ XState v5 machine
     └─ SCXML document, executed by SCION
```

IR 在每个数值边界上固定一种行为：经检查的 64 位整数溢出是错误，绝不回绕；整数 `/` 向零截断（$-7/2 = -3$）；`%` 取被除数的符号（$-3 \bmod 2 = -1$）；除以零是错误；浮点数为 IEEE 754 binary64，非有限结果是错误；null 与缺失不同；时间只用逻辑时钟。每个目标都是生成的，没有一个是手写的。

进程、HTTP 或闭包处理器没有项，因此其记录的结果被编译为一个以规范输入的 SHA-256 为键的记录预言机。`rce scan DIR --form` 把现有的 Rust、Python、TypeScript 和 Go 提升到形式的模式中，每个被提升的元素都标注为语法提升。

<div id="46-method-the-whole-stack-evaluated-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 4.6 方法：评估整个技术栈，每个接口假设都明确写出

程序是一摞层级：词元与语句；处理器；形式，即在由带类型关系、控制区域和时钟构成的数据库状态上的单一步进函数 δ；记录每个事件及其所产生状态之哈希的日志；变换形式的重写；以及执行它的底层基质。每一层都建立在对下一层的假设之上。RCE 不把任何一层视为固定不变。它评估整个技术栈，把每个接口假设写成可检查的陈述，并在每次运行时检查它。

| 边界 | 假设 | 检查 |
|---|---|---|
| 源到处理器 | 输入满足其源契约 | 在 δ 的输入事件处做契约检查 |
| 处理器到汇点 | 每个 Ok 输出都满足输出模式 | 处理器证明（verify::handler_proof），由经 Kani 检查的内核求值器保证全定义且确定 |
| 日志到状态 | 每个条目都带有它所产生状态的哈希 | 内核折叠，拒绝第一个哈希不匹配的条目（Kani 测试框架 `fold_rejects_wrong_state`） |
| 重写到形式 | 重写对每个输入都保持输出不变 | 随机化检查，然后用 Z3 做 SMT 证明 |
| 桩到工头 | 无法决定的处理器会升级而不是猜测 | 桩处理器发出升级；解决结果只能经由晋升路径晋升 |
| 形式到目标 | 每个生成的目标都计算同一个 δ | 每个目标都带有同一条参考轨迹 |

一次失败的检查会把断裂定位在它发生的边界上。修正在该层完成，通过该边界的检查，然后被晋升。被修正层之上的每一层无需进一步改动就继承这一修正，因为每个上层只通过其假设现已受检查的那个接口来使用被修正的层。修正正是在这个意义上向上传递并复利累积。[RCE 演练场](/playground/rce/)在浏览器中、在编译为 WebAssembly 的 RCE 核心上运行这一过程：它的 Interfaces 层逐一破坏每个假设并展示检测到破坏的检查，它的 Compounding 层展示修正如何延续到之后的每一轮。

<div id="5-verification" class="anchor-alias" aria-hidden="true"></div>

## 5. 验证

<div id="51-five-targets-one-trace" class="anchor-alias" aria-hidden="true"></div>

<div id="51-differential-testing-across-five-targets" class="anchor-alias" aria-hidden="true"></div>

### 5.1 五个目标之间的差分测试

`tests/form_targets.rs` 以 29 个边界事件加上 500 个带种子的随机边界值驱动一个含十一个运算符的算术规约。生成的 Rust、Python、WASM、XState 和 SCXML 目标逐字节打印出参考轨迹，包括算术边界。这是 McKeeman 与 Csmith 一脉的差分测试 [86]：多个独立实现在声明的输入集上取得一致。它不是翻译确认 [85]，也不是经过验证的编译器。它覆盖测试中的十一个运算符和 529 个事件，对其之外的输入不作任何断言。下面的 Z3 与 Kani 结果才是验证。

<div id="52-rewrites-proved-in-z3" class="anchor-alias" aria-hidden="true"></div>

### 5.2 在 Z3 中证明的重写

经过验证的重写规则有其谱系。Ruler 通过等式饱和推断并检查重写规则，回路中没有模型 [87]。因此第 5.5 节中被接纳的 16 条模型提议规则中的 3 条，是对门槛的陈述（它拒绝了 13 条），而不是在声称模型是最好的规则来源。

每一条内置 e-图重写都在 Z3 SMT 求解器（可满足性模理论）[31] 中，针对形式的项求值与算术的无量词编码得到证明：值作为数据类型，带溢出检查的 64 位位向量，符号随被除数的有符号除法与取余，以及 binary64 浮点数。改变溢出、升级顺序或消息的重写得不到证明。一个被提议的等价只有带着证明才能进入 e-图。

<div id="53-kani-proofs-of-the-kernel" class="anchor-alias" aria-hidden="true"></div>

### 5.3 内核的 Kani 证明

引擎的内核（哈希链、折叠、与名字无关的位置和处理器求值）用 Rust 的 Kani 模型检查器检查 [32]。处理器求值是一个非递归步骤的不动点，Kani 通过结构归纳证明该步骤对每个构造子都是全函数且确定的。十个验证线束通过验证，505 项检查中失败 0 项：

| 线束 | 性质 |
|---|---|
| `chain_appended_verifies` | 追加后的哈希链通过验证 |
| `chain_detects_tampering` | 被改动的条目会破坏链 |
| `fold_equals_replay` | 折叠等于重放 |
| `fold_rejects_wrong_state` | 与已存状态不一致的折叠被拒绝 |
| `position_is_name_independent` | 规则位置不依赖节点名字 |
| `reason_tokens_are_name_independent` | 理由以完整词元计与名字无关 |
| `handler_core_leaves` | 叶处理器是全函数且确定的 |
| `handler_core_validate` | 校验是全函数且确定的 |
| `handler_core_pipeline` | 流水线是全函数且确定的 |
| `handler_core_ifhas` | 卫式是全函数且确定的 |

<div id="54-promotion-gate-on-the-proof-certificate" class="anchor-alias" aria-hidden="true"></div>

### 5.4 基于证明证书的晋升门槛

Kani 运行写出一份证书，其哈希存于 `proofs/kani.cert`。引擎、日志、规则 id 和处理器求值都经过已证明的内核，晋升需要这份证书。

<div id="55-the-model-as-a-proposer-behind-the-check" class="anchor-alias" aria-hidden="true"></div>

### 5.5 作为检查之后的提议者的模型

模型可以提议等价，但不能接纳它们。在演示规约上使用一个本地 15 亿参数的编程模型（llama.cpp 下的 Qwen2.5-Coder-1.5B），提议者提出 16 个等价。检查通过随机试验和 Z3 证明接纳了 3 个，拒绝了 13 个。一个由 87 条常见恒等式组成的确定性提议者有 9 条被接纳，全部是结构性的，而每条算术恒等式都因故障顺序、非数值或溢出而被拒绝。

<div id="56-brownfield-agreement" class="anchor-alias" aria-hidden="true"></div>

### 5.6 存量代码的一致性

提升过程从 Rust、Python、TypeScript 和 Go 夹具中读出同一个订单状态机，在 40 个带种子的 30 次调用序列上运行原始代码，并在每种语言的全部 1,200 次调用上取得一致。一个在任何结果之前预先注册的冻结基准，把三个现有的销售拓展程序重新表达为形式。这些形式在 4,500 个记录输入中的 4,500 个上与原始代码一致，提取降低了每一个的 `est_j`（例如从 $1.69 \times 10^{-8}$ J 降至 $1.49 \times 10^{-8}$ J）。

<div id="6-lift-entering-the-ecosystem-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

## 6. 提升：从其他语言进入生态系统

<div id="6-importing-legacy-code-from-other-languages" class="anchor-alias" aria-hidden="true"></div>

提升是在别处写成的代码进入生态系统的门。它是一种构造，按语言用每种语言都已具备的工具完成：一套形式文法、一个产生语法树的解析器（例如 [tree-sitter](https://tree-sitter.github.io/tree-sitter/)）、抽象语法树，以及语言服务器工具所解析的符号（[Language Server Protocol](https://microsoft.github.io/language-server-protocol/)）。`rce scan DIR --form` 为 Rust、Python、TypeScript 和 Go 从这棵树构建形式（[§4.5](#45-the-form-compiler)、[§5.6](#56-brownfield-agreement)）。被提升的程序带有其源代码的缺陷，因此提升包含修复，下面在给定位置的公开缺陷语料上测量。在生态系统内部，这些缺陷无法被写出。

<div id="60-the-repair-ladder-on-lifted-code" class="anchor-alias" aria-hidden="true"></div>

### 6.0 被提升代码上的修复阶梯

<div id="23-per-rung-ladder-results" class="anchor-alias" aria-hidden="true"></div>

这里用一个编程任务所需的**意图比特**来度量它：必须从引擎已有内容（编辑周围的程序、库、测试、已知修复的索引）之外提供的比特。记 $H_{task}$ 为确定目标制品所需的比特，$H_{corpus}$ 为语料库已经固定的比特，则所提供的比特为 $I = H_{task} - H_{corpus}$。一个在其候选中把正确编辑排在第 $r$ 位的档位提供了 $\log_2 r$ 比特的搜索，其余由门槛提供。阶梯按编辑大小为任务排序，这是 $I$ 的客观代理：一个词元（L0）、一条语句（L1）、一个代码块（L2）、一个文件中的多个代码块（L3）、多个文件（L4）、根据规约或测试写出一个函数（L5）、议题级改动（L6），以及根据规约写出一个程序（L7）。各级、语料、划分和假设均在完整运行之前预先注册；文件见[公开代码库](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/)。

| 级 | 留出测试语料 | N | 已解决 | 比率 | Wilson 95% 置信区间 | 搜索比特中位数 | 模型调用 |
|---|---|---|---|---|---|---|---|
| L0 一个词元 | 9 个真实代码库在固定提交上的 PIT 式变异体 [109]（Java：commons-math、commons-collections、jsoup、joda-time、gson；Python：click、attrs、pydantic、sympy） | 520,821 | 520,541 | 0.9995 | 0.9994 至 0.9995 | 2.3 | 0 |
| L0 一个词元，从未用于调优的代码库 | commons-text、commons-io、more-itertools、httpx | 23,015 | 23,015 | 1.0000 | 0.9998 至 1.0000 | 2.0 | 0 |
| L1 一条语句，Java | ManySStuBs4J 2.0 单代码块修复 [107] | 24,072 | 9,288 | 0.386 | 0.380 至 0.392 | 3.5 | 0 |
| L1 一条语句，Java，整个文件 | ManySStuBs4J 2.0 [107]，父提交时的文件，附项目的方法索引与守卫条件索引 | 21,320 | 13,586 | 0.637 | 0.631 至 0.644 | 4.8 | 0 |
| L1 一条语句，Python | TSSB-3M v1.0.0，第 14 与 15 分片 [108] | 157,089 | 27,266 | 0.174 | 0.172 至 0.175 | 4.8 | 0 |

L2 至 L4 在 288 个缺陷的 Defects4J 留出集上测量（[第 8.1 节](#81-defects4j)）。L5 至 L7 遵循[第 8.2 节](#82-swe-bench-lite-offline)的协议。每一行的方法、门槛和能量见下文。

这些比率可以读作意图比特。在 L0，缺失的比特几乎都在该行上，一个按先验排序的单词元邻域以中位数 2.3 比特提供它们。在仅代码块的 L1 行上，引擎只看到 7 行的代码块。它解决了比特位于代码块内的类别（Java：运算符改变 91%，布尔字面量互换 84%，参数互换 82%；Python：布尔字面量改变 98.8%，参数互换 99.4%），而比特位于代码块之外的类别仍未解决：方法名（22%）和标识符（37%）需要文件及其类型，新增合取项（3% 至 7%）和整条语句重写（Python，占语料 34% 的一个类别中的 1.2%）则是新的意图。新的意图由某个供给者（规约、测试、人或本地模型）提供一次，之后该契合就进入索引。

**方法。**每个语料以固定种子打乱。每次打乱的前 2,000 个位置，以及 L0 的三个完整代码库（commons-lang、requests、flask），构成开发划分，可以在其上调优档位；开发结果不予报告。其余每个任务都在测试划分中。在测试运行之前，引擎被提交并记录其二进制哈希，运行期间没有任何档位改变。本节每一行都是冻结引擎仅在测试任务上的结果，模型调用为 0。预先注册（`PREREG.json`）、逐任务记录和报告脚本见[公开代码库](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/)。

**门槛。**在 L0 和 L1，位置是给定的，门槛是词元一致：修复后的行或语句必须与开发者的逐词元相等。这比通过测试更严格，因为补丁可能通过薄弱的测试套件却仍然是错的。Qi 及其同事发现，GenProg 报告为修复的大多数补丁看似合理却不正确 [92]；对测试的过拟合在基于搜索和基于语义的修复中都有记录 [93, 94]，并可用生成的测试来应对 [95]；工具在其调优所用的基准上得分更高 [96]；故障定位会使比较产生偏差 [97]。词元一致消除了这些级上的“看似合理”缺口，给定位置则消除了定位项，因此比率只度量修复档位本身。L2 及以上以测试为门槛，并分别报告看似合理和正确的数量（第 8.1 节）。

<div id="61-l0-one-token-faults" class="anchor-alias" aria-hidden="true"></div>

### 6.1 L0：单词元缺陷

L0 语料是九个真实代码库（五个 Java、四个 Python）在固定提交上、带有有效替换词元的全部 PIT 式变异体 [109]：547,448 个中的 520,821 个测试任务。引擎（提交 `65571d0`，档位 G0-T 与 G1-J）恢复了 520,541 个，比率为 0.9995（95% Wilson 区间 0.9994 至 0.9995），搜索比特中位数为 2.3。在 280 个未解决的任务中，108 个是浮点字面量内被变异的数字，2 个位于 Python 集合字面量中。一个浮点字面量档位（G0-F，提交 `ecfe5a1`）在四个从未用于调优的代码库（commons-text、commons-io、more-itertools、httpx）上测试：23,015 个任务中的 23,015 个，1.0000（0.9998 至 1.0000），搜索比特中位数为 2.0。变异体是真实单词元缺陷的替代品，Just 及其同事发现它们与真实缺陷相耦合 [110]。

<div id="62-l1-one-statement-bugs-from-real-histories" class="anchor-alias" aria-hidden="true"></div>

### 6.2 L1：来自真实历史的单语句缺陷

L1 使用两个从开源历史中挖掘出的真实单语句缺陷修复公开数据集。ManySStuBs4J 2.0 [107] 提供 24,072 个 Java 测试任务；引擎（提交 `f2701b7`）解决了 9,288 个，比率为 0.386（0.380 至 0.392）。TSSB-3M v1.0.0 [108] 从第 14 与 15 分片提供 157,089 个 Python 测试任务；同一引擎解决了 27,266 个，比率为 0.174（0.172 至 0.175）。引擎只接收 7 行代码块，因此该 Java 比率是仅代码块的结果。若给出父提交时的整个文件，附上项目的方法索引和守卫条件索引，并配备针对方法名更改、参数增加、守卫条件、throws 和修饰符的档位（提交 `62fb7a0`，二进制 sha256 前缀 `3682c6515acdf722`，在运行前预注册），引擎在能够定位到文件与缺陷语句的 21,320 个 Java 测试任务中解决了 13,586 个，比率为 0.637（0.631 至 0.644）。按类别，它关闭了运算符更改（95.9%）、操作数更改（92.1%）、调用者错误（87.9%）、布尔字面量互换（88.4%）、参数删除（85.1%）和参数互换（83.3%）；方法名更改达到 61.4%，参数增加达到 51.4%，而新增或收窄的条件（43.5% 与 51.7%）仍是主要的未覆盖意图。完整的分层表见代码库。这些数据集在此门槛（仅代码块、词元一致、给定位置）下没有已发表的修复排行榜，因此旁边没有列出学习式修复的数字；有排行榜的 Defects4J 在第 8.1 节中与 TBar 比较。

<div id="63-energy" class="anchor-alias" aria-hidden="true"></div>

### 6.3 能量

每一行都带有 `est_j`，即 CPU 秒数乘以 10 W 的估计：L0 每个已解决任务 0.40 J，新代码库上 0.13，ManySStuBs4J 上 0.10，TSSB-3M 上 0.27。一个子样本在 RAPL [105]（处理器的片上封装计数器）上读取，所用机器是一台搭载 Intel i9-13900H 的 Linux 笔记本（主机名 `jetson-hub`；不是 NVIDIA Jetson）。测试线束在 4 个固定的 CPU 上运行，`reported_j` 是整个运行（包括 Python 驱动）期间的封装增量，减去紧接在前的 10 s 采样得到的空闲功率乘以运行时长。持续集成运行器处于开启状态，因此空闲功率为 40 W 至 44 W，不确定度约为 ±1 W 乘以时长，即这些总量上 ±10 J。

| 子样本（测试划分） | 任务 | 已解决 | 原始 J | `reported_j` | 每个已解决任务的 `reported_j` | 秒 |
|---|---|---|---|---|---|---|
| L0，gson 变异体（带种子，前 3,000 个） | 3,000 | 3,000 | 648.3 | 167.5 | 0.056 | 11.8 |
| L1，ManySStuBs4J 第 2,000 至 3,999 位 | 2,000 | 690 | 377.2 | 17.9 | 0.026 | 8.2 |

L1 子样本只用其 2,000 个任务构建项目索引，因此其解决率（34.5%）低于完整运行。`measured_j`，即指定供电轨上的墙插功率计读数，在每一行都为空；其协议见第 8.3 节。

<div id="7-reuse-evidence" class="anchor-alias" aria-hidden="true"></div>

## 7. 复用证据

第二条路径建立在一个工程事实之上：代码在每个尺度上都被复用。下面每种方法以不同方式测量它。

| 方法 | 来源 | 发现 |
|---|---|---|
| 文件级克隆映射 | DéjàVu，Lopes 等 2017 [33] | 在 450 万个非分叉 GitHub 项目的 4.28 亿个文件中，8,500 万个是唯一的：“GitHub 上 70% 的代码由先前创建的文件的克隆构成。”在 JavaScript 中，6% 的文件是不同的。 |
| 行级冗余 | Gabel 与 Su 2010 [34] | 对照 4.2 亿行代码，在约一行的粒度上“每个项目有 50% 到 100% 是冗余的”。 |
| 统计语言模型 | Hindle 等 2012 [35] | 代码“非常重复，事实上比自然语言更甚”。 |
| 语料近似去重 | The Stack [36] | 近似去重移除了 The Stack v1 的 54.7%（6.4 TB 降至 2.9 TB）和 v2 的 52.4%（67.5 TB 降至 32.1 TB）。 |
| 整库保存 | Software Heritage | 来自 4.45 亿个来源的约 300 亿个源文件，每个按其字节哈希只存储一次。 |
| 挖掘出的修复模式 | PAR、TBar [22, 23] | PAR 在 60,000 多个人工补丁中发现了“若干常见修复模式”。TBar 的 15 个模式类别在标准流程中正确修复 43 个 Defects4J 缺陷，在完美故障定位下修复 101 个中的 74 个，无需学习。 |
| 跨语言任务 | Rosetta Code | 1,360 个任务，每个是在 1,009 种已知语言中的许多种里实现的同一概念。 |

每一行都是引擎的一种输入。克隆和去重说明契合通常已经存在，这就是 G0。反复出现的修复说明改编大多是一小批带卫式的重写，这就是 G1。行级冗余缩小 G2 的搜索空间。生态系统在每个晋升的契合上测量这一点（第 2.3 节），被提升代码上的修复阶梯则在留出划分上按规模测量它（第 6 节）。有两点告诫使这一解读更精确。若不去除，重复会抬高检索和模型的分数 [104]。而有缺陷的代码行比修复后的更不自然 [45]，因此缺陷本身恰是查找最难预测的情形；G0 和 G1 必须以修复形状而非缺陷行为键。在规模上做到这一点的规则挖掘路线，从 GenProg 的生成并验证搜索 [88]、Prophet 学到的正确性模型 [89]，到 Facebook 的 Getafix [90] 和 Sorald 对静态分析违规的无模型修复 [91]，都从不相交的历史中导出模板，并报告在未见情形上的精度 [98]。这就是第 8.4 节采用的标准。

<div id="8-measurement-protocols-for-what-comes-next" class="anchor-alias" aria-hidden="true"></div>

## 8. 后续工作的测量协议

每个协议都在其运行之前固定：预先注册已提交，种子与求解器提交已记录，每个制品都被保留。先门槛，后焦耳，始终标注。

<div id="81-defects4j" class="anchor-alias" aria-hidden="true"></div>

### 8.1 Defects4J

Defects4J 收录 854 个活跃的真实 Java 缺陷，每个都带有复现测试 [37]。

1. 离线地通过 `defects4j checkout` 在 100 个缺陷的子集上开发；只报告留出结果，留出集为运行前冻结的、不相交的 288 个缺陷（`FROZEN-heldout-v1`）。
2. 依次运行 G0、G1、G2，最后是本地模型。记录关闭每个缺陷的档位。
3. 门槛：触发测试和完整测试套件均通过。分别报告看似合理与正确的数量；正确指经审查与开发者补丁等价。
4. 报告每个正确修复的模型调用次数和焦耳数，并加标注。
5. 参照点：TBar 的 43 个正确修复，以及在完美定位下 101 个中的 74 个。
6. 污染检查：标记每个其修复逐字出现在 G0 索引中的缺陷，并分别报告包含与不包含被标记缺陷的结果。

<div id="82-swe-bench-lite-offline" class="anchor-alias" aria-hidden="true"></div>

### 8.2 SWE-bench Lite，离线

SWE-bench Lite 是由隐藏测试判定解决的 300 个真实 GitHub 议题子集 [38]。

1. 使用官方 Docker 测试线束，不联网。
2. 第一次运行：只用 G0 和 G1，模型调用为零。这是不用模型求解的下限。
3. 第二次运行：加入本地模型作为最后一个档位。
4. 报告解决率、每个已解决任务的模型调用次数和焦耳数，并加标注。
5. 污染检查同 8.1。SWE-Bench+ 发现 32.67% 的成功补丁在议题文本中已含有解答 [39]。

<div id="83-a-wall-meter" class="anchor-alias" aria-hidden="true"></div>

### 8.3 墙插功率计

1. 在主机电源上接入墙插功率计或分流电阻计，以声明的速率记录，其时钟与运行日志同步。
2. 空闲机器：停止 CI 运行器和其他构建，在每个区块之前检查并记录静默窗口门槛。
3. 减去测得的空闲基线，并说明方法。
4. 只用功率计的读数填写 `measured_j`。在相邻的单独列中报告 `reported_j`（RAPL）和 `est_j`。绝不跨标注求和。
5. 在功率计下重复第 6.3 节的 RAPL 子样本，然后是 Defects4J 留出集。

<div id="84-a-held-out-run-with-the-gears-frozen" class="anchor-alias" aria-hidden="true"></div>

### 8.4 冻结档位的留出运行

这是第 6 节的方法，扩展到新的语料。

1. 在一个打标签的提交上冻结 G0、G1 和 G2，记录二进制哈希，并连同编写时间戳发布规则集。
2. 抽取一个不相交的留出切片：Multi-SWE-bench [102] 和 BugsInPy [103] 中的 Rust 与 Python 实例，并对照 G0 的索引去重 [104]。
3. 在第一次运行前预先注册切片、种子和假设。
4. 分别报告已解决、看似合理和逐字节相同的数量，各带 95% 区间。

<div id="85-baselines-in-the-same-table" class="anchor-alias" aria-hidden="true"></div>

### 8.5 同一表格中的基线

1. 无模型：`cargo fix` 与 clippy [106]，以及 Sorald 或 TBar 移植版 [91]。
2. 廉价模型：使用本地模型的 Agentless [99]。
3. 远程模型：使用前沿模型的智能体，其能量根据提供方披露估计并标注为 `est_j`。
4. 为每一行报告以焦耳和美元计的单次通过成本 [101]，并按 Kapoor 及其同事的要求控制成本 [100]。

<div id="86-convergence-of-model-calls-at-large-n" class="anchor-alias" aria-hidden="true"></div>

### 8.6 大 N 下模型调用的收敛

晋升是模型离开回路的机制：解析器为一个新情形支付一次，门槛把契合作为处理器接纳，之后同一形状的每个情形都在 G0 或 G1 中关闭（[第 4.2 节](#42-the-gears)）。收敛是这样一个论断：在实时流量下，对于固定规约，每轮的模型调用会降到零。其测量方法如下。

1. 从公开代码库中按语言和规模分层抽取至少 1,000 个规约，并在第一轮之前冻结引擎和解析器。
2. 以固定大小的轮次重放记录的生产流量，每个规约至少 10,000 个事件。
3. 每轮记录：新升级、模型调用、晋升、推迟以及每个关闭任务的焦耳数，每项都加标注（`est_j`、`reported_j`、`measured_j`）。
4. 主要终点：在 20 轮内达到模型调用为零的一轮的规约所占比例，带 95% Wilson 区间。次要终点：按轮计的每个关闭任务的模型调用次数，以及最后一次模型调用所在的轮次。
5. 报告从未收敛的规约及其原因（卡住的输入、缺失的依赖、新的意图），并把卡住输入的推迟作为预先注册的一个组别来运行。

**命题 8（趋近下限）。**随着 G0 和 G1 覆盖率增长，每个已解决任务的焦耳数趋近于应用已知修复并运行测试这一黄金下限。在墙插功率计下的阶梯各级与 Defects4J 留出集对其进行检验。

<div id="87-lift-coverage-across-languages" class="anchor-alias" aria-hidden="true"></div>

### 8.7 跨语言的提升覆盖率

<div id="87-coverage-of-real-programs-across-languages" class="anchor-alias" aria-hidden="true"></div>

提升在构建过程中被测量。对于语言 $L$，当 $\pi_L(\lambda_L(p))$ 通过程序自身的测试并逐字节重放其记录的轨迹，且 $\lambda_L(\pi_L(\lambda_L(p)))$ 与 $\lambda_L(p)$ 具有相同的形状哈希时，该程序计为已提升。样本为至少十种语言、每种语言至少 10,000 个程序，以固定种子从固定版本的公开语料中抽取；每次运行之前提升器被冻结并记录其二进制哈希，模型调用为 0。每次运行报告已提升的比例及其 Wilson 95% 区间，每个尚未提升的构造都是该语言提升器的一项工作，在下一次运行之前构建并冻结。目标是每种语言中的每个程序。

<div id="9-ties-to-the-companion-papers" class="anchor-alias" aria-hidden="true"></div>

## 9. 与姊妹论文的联系

**极限混合。**[《计量提交门》第二部分](/papers/gates/#part-ii-the-cascade-mixture-of-limits)陈述了这一哲学：完成一项任务所需的任何东西都有一个最小量，多出的部分即是浪费。RCE 三次应用它。档位顺序先运行最便宜的足够档位。晋升对每个新情形只支付一次解析器，此后每次重复调用都是浪费。提取在等价契合中保留焦耳最少者（命题 3）。

**计量提交门。**[第一部分](/papers/gates/)指出提议不得自我授权。在 RCE 中，模型提议，门槛提交：候选只有在测试通过、满足覆盖界并带有证明证书时才能进入，每个决定都是哈希链中的一张收据。

**能动性普遍定律。**[能动性论文](/papers/agency/)把智能定义为能动性对焦耳的导数 $\iota = dX/dJ$，回溯读取。RCE 的日志就是这份回溯记录：$X$ 是通过门槛的任务，$J$ 是它们的焦耳数，均加标注。带收据的推迟就是门槛的拒绝条款。

**任务饱和。**[《任务饱和与 AI 需求的总体反弹》](/papers/satiation/)指出，一旦任务的完成谓词为真，在该任务上再做更多综合便买不到任何东西。RCE 是一个系统内部的逐任务饱和：一旦某个处理器覆盖了一个情形，对该情形的进一步推理就为零。总体需求问题属于那篇论文和[经济学姊妹篇](/papers/ai-coding-market/)。

<div id="10-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 10. 可证伪条件

在其所检验的运行之前固定。

| 编号 | 观察 | 推翻 |
|---|---|---|
| RCE-F1 | 在留出切片上，规则冻结的 G0 至 G2 以 0 次模型调用解决的任务不足 10% | 在这一规模上大多数修复契合已经存在的论断 |
| RCE-F2 | 逐字节相同或等价的补丁不足已解决留出任务的一半 | 把门槛解读为在已覆盖任务上不止于“看似合理” |
| RCE-F3 | 在墙插功率计下，RCE 求解器每个已解决任务的总焦耳数超过最廉价模型基线在两者都解决的任务上的数值 | 第二条路径在已覆盖任务上的焦耳优势 |
| RCE-F0 | 在至少 10,000 个形式的预先注册运行中，任一投影打印出与形式参考轨迹不同的轨迹，或任一畸形输入被接受 | 投影是忠实的、门槛在入口处拒绝这一论断 |
| RCE-F4 | 在第 8.6 节的收敛协议中，没有卡住输入的规约中，在 20 轮内达到模型调用为零的一轮者不足一半 | 把模型编译出回路 |

<div id="11-work-to-finish" class="anchor-alias" aria-hidden="true"></div>

## 11. 待完成的工作

每一项都已指明其协议。

1. 按第 8.7 节的协议，在至少十种语言上构建并测量提升。
2. 规约组：MBPP 与 HumanEval 风格的规约作为形式编写，并生成到每个目标。
3. L2 至 L4 的留出结果，即 288 个缺陷的 Defects4J 集（第 8.1 节），以及 L5 至 L7 的结果（第 8.2 节）。
4. 同一表格中的基线，以焦耳和美元计的单次通过成本（第 8.5 节）。
5. 第一个 `measured_j`：空闲主机上的墙插功率计，至少 10 次重复，总量与净量并列（第 8.3 节）。
6. 连同方法发布 626 种语言的调查（图 1）。
7. 冻结档位下的新留出语料：Multi-SWE-bench 与 BugsInPy（第 8.4 节）。
8. 至少 1,000 个规约上模型调用的收敛（第 8.6 节）。

<div id="12-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 12. 结论

RCE 是一个原生代码生态系统。程序由意图只写一次，写成一个形式：状态、事件与纯转移的无损编码，而每种目标语言都是它的忠实投影。非法状态无法被写出，畸形输入在入口处被拒绝，因此生态系统中的程序不会偏离其意图，也不需要事后的差异比对或错误追踪。每个通过门槛的契合都被存储并复用，生态系统在一个正确性单调的门槛之下复利累积。在 10,000 个预先注册的形式上，引擎冻结、模型调用为 0，每个形式都往返得到相同的字节，每个投影都是确定性的，每个畸形输入和规约都在入口处被拒绝，Python 投影在 9,999 个形式上重放参考轨迹。来自其他语言的代码通过提升进入，这是一种从每种语言的文法到其语法树再到形式的构造；在被提升的代码上，修复档位恢复了 520,821 个单词元缺陷中的 99.95% 以及 21,320 个单语句 Java 缺陷中的 63.7%。一个普适形式，每种语言都是它的投影，每个程序都是一次提升，这就是本文的论题；第 3.6 节和第 8.7 节陈述其命题以及如何测量其构造。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

[1] C. E. Shannon, "Prediction and Entropy of Printed English," *Bell System Technical Journal* 30(1), 1951. doi:10.1002/j.1538-7305.1951.tb01366.x

[2] Y. Gurevich, "Sequential Abstract State Machines Capture Sequential Algorithms," *ACM Transactions on Computational Logic* 1(1), 2000. doi:10.1145/343369.343384

[3] A. Blass and Y. Gurevich, "Abstract State Machines Capture Parallel Algorithms," *ACM Transactions on Computational Logic*, 2003. doi:10.1145/937555.937561

[4] N. Dershowitz and Y. Gurevich, "A Natural Axiomatization of Computability and Proof of Church's Thesis," *Bulletin of Symbolic Logic*, 2008. doi:10.2178/bsl/1231081370

[5] E. F. Codd, "A Relational Model of Data for Large Shared Data Banks," *Communications of the ACM*, 1970. doi:10.1145/362384.362685

[6] G. H. Mealy, "A Method for Synthesizing Sequential Circuits," *Bell System Technical Journal*, 1955. doi:10.1002/j.1538-7305.1955.tb03788.x

[7] E. F. Moore, "Gedanken-Experiments on Sequential Machines," *Automata Studies*, 1956. doi:10.1515/9781400882618-006

[8] K. Kang et al., "Feature-Oriented Domain Analysis (FODA) Feasibility Study," CMU/SEI-90-TR-021, 1990.

[9] R. Alur et al., "Syntax-Guided Synthesis," FMCAD 2013. doi:10.1109/FMCAD.2013.6679385

[10] D. Harel, "Statecharts: A Visual Formalism for Complex Systems," *Science of Computer Programming*, 1987. doi:10.1016/0167-6423(87)90035-9

[11] R. Tate, M. Stepp, Z. Tatlock and S. Lerner, "Equality Saturation," POPL 2009. doi:10.1145/1480881.1480915

[12] M. Willsey et al., "egg: Fast and Extensible Equality Saturation," POPL 2021. doi:10.1145/3434304

[13] B. Moseley and P. Marks, "Out of the Tar Pit," 2006.

[14] M. Fowler, "Event Sourcing," 2005. https://martinfowler.com/eaaDev/EventSourcing.html

[15] P. Alvaro et al., "Dedalus: Datalog in Time and Space," LNCS 2011. doi:10.1007/978-3-642-24206-9_16

[16] A. M. Turing, "On Computable Numbers," *Proceedings of the London Mathematical Society*, 1937. doi:10.1112/plms/s2-42.1.230

[17] A. Church, "An Unsolvable Problem of Elementary Number Theory," *American Journal of Mathematics*, 1936. doi:10.2307/2371045

[18] P. Wadler, "Propositions as Types," *Communications of the ACM*, 2015. doi:10.1145/2699407

[19] J. M. Hellerstein and P. Alvaro, "Keeping CALM," *Communications of the ACM*, 2020. doi:10.1145/3369736

[20] G. Kahn, "The Semantics of a Simple Language for Parallel Programming," IFIP 1974, pp. 471 to 475.

[21] H. Husain et al., "CodeSearchNet Challenge," 2019. arXiv:1909.09436

[22] D. Kim, J. Nam, J. Song and S. Kim, "Automatic Patch Generation Learned from Human-Written Patches" (PAR), ICSE 2013. doi:10.1109/ICSE.2013.6606626

[23] K. Liu et al., "TBar: Revisiting Template-based Automated Program Repair," ISSTA 2019. arXiv:1903.08409

[24] K. Liu et al., "AVATAR: Fixing Semantic Bugs with Fix Patterns of Static Analysis Violations," SANER 2019. arXiv:1812.07270

[25] A. Koyuncu et al., "FixMiner: Mining Relevant Fix Patterns for Automated Program Repair," 2018. arXiv:1810.01791

[26] Y. Padioleau et al., "Documenting and Automating Collateral Evolutions in Linux Device Drivers" (Coccinelle), EuroSys 2008. doi:10.1145/1352592.1352618

[27] A. Solar-Lezama et al., "Combinatorial Sketching for Finite Programs," ASPLOS 2006. doi:10.1145/1168857.1168907

[28] L. Chen, M. Zaharia and J. Zou, "FrugalGPT," 2023. arXiv:2305.05176

[29] S. Haber and W. S. Stornetta, "How to Time-Stamp a Digital Document," *Journal of Cryptology*, 1991. doi:10.1007/BF00196791

[30] S. A. Crosby and D. S. Wallach, "Efficient Data Structures for Tamper-Evident Logging," USENIX Security 2009.

[31] L. de Moura and N. Bjørner, "Z3: An Efficient SMT Solver," TACAS 2008. doi:10.1007/978-3-540-78800-3_24

[32] Kani Rust Verifier. https://github.com/model-checking/kani

[33] C. V. Lopes et al., "DéjàVu: A Map of Code Duplicates on GitHub," OOPSLA 2017. doi:10.1145/3133908

[34] M. Gabel and Z. Su, "A Study of the Uniqueness of Source Code," FSE 2010. doi:10.1145/1882291.1882315

[35] A. Hindle et al., "On the Naturalness of Software," ICSE 2012. doi:10.1109/ICSE.2012.6227135

[36] D. Kocetkov et al., "The Stack: 3 TB of Permissively Licensed Source Code," 2022. arXiv:2211.15533; The Stack v2 dataset card, https://huggingface.co/datasets/bigcode/the-stack-v2

[37] R. Just, D. Jalali and M. D. Ernst, "Defects4J: A Database of Existing Faults to Enable Controlled Testing Studies for Java Programs," ISSTA 2014. doi:10.1145/2610384.2628055

[38] C. E. Jimenez et al., "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" 2023. arXiv:2310.06770

[39] R. Aleithan et al., "SWE-Bench+: Enhanced Coding Benchmark for LLMs," 2024. arXiv:2410.06992

[40] C. E. Shannon, "A Mathematical Theory of Communication," *Bell System Technical Journal* 27, 1948. doi:10.1002/j.1538-7305.1948.tb01338.x

[41] A. N. Kolmogorov, "Three approaches to the quantitative definition of information," *Problemy Peredachi Informatsii* 1(1), 1965 (in Russian); English translation, *International Journal of Computer Mathematics* 2, 1968. doi:10.1080/00207166808803030

[42] R. J. Solomonoff, "A formal theory of inductive inference. Part I," *Information and Control* 7(1), 1964. doi:10.1016/S0019-9958(64)90223-2

[43] G. J. Chaitin, "A Theory of Program Size Formally Identical to Information Theory," *Journal of the ACM* 22(3), 1975. doi:10.1145/321892.321894

[44] J. Rissanen, "Modeling by shortest data description," *Automatica* 14(5), 1978. doi:10.1016/0005-1098(78)90005-5

[45] B. Ray, V. Hellendoorn, S. Godhane, Z. Tu, A. Bacchelli and P. Devanbu, "On the 'naturalness' of buggy code," ICSE 2016. doi:10.1145/2884781.2884848

[46] Z. Tu, Z. Su and P. Devanbu, "On the localness of software," FSE 2014. doi:10.1145/2635868.2635875

[47] M. Allamanis, E. T. Barr, P. Devanbu and C. Sutton, "A Survey of Machine Learning for Big Code and Naturalness," *ACM Computing Surveys* 51(4), 2018. doi:10.1145/3212695

[48] 陈浙哲, 刘忠鑫, 鄢萌, 徐洲, 夏鑫, 雷晏 (Z. Chen, Z. Liu, M. Yan, Z. Xu, X. Xia and Y. Lei), "代码自然性及其应用研究进展" (Research progress of code naturalness and its application), *软件学报 (Journal of Software)* 33(8), 3015 to 3034, 2022. doi:10.13328/j.cnki.jos.006355

[49] G. Sridhara, V. S. Sinha and S. Mani, "Naturalness of Natural Language Artifacts in Software," ISEC 2015 (India Software Engineering Conference). doi:10.1145/2723742.2723758

[50] P. Devanbu, "On the naturalness of software," keynote, ISEC 2013 (India Software Engineering Conference). doi:10.1145/2442754.2442763

[51] A. Z. H. Yang, S. Kolak, V. J. Hellendoorn, R. Martins et al., "Revisiting Unnaturalness for Automated Program Repair in the Era of Large Language Models," ICSE 2025. doi:10.1109/ICSE55347.2025.00089

[52] E. W. Dijkstra, "Guarded commands, nondeterminacy and formal derivation of programs," *Communications of the ACM* 18(8), 1975. doi:10.1145/360933.360975

[53] N. Wirth, "Program development by stepwise refinement," *Communications of the ACM* 14(4), 1971. doi:10.1145/362575.362577

[54] C. A. R. Hoare, "An axiomatic basis for computer programming," *Communications of the ACM* 12(10), 1969. doi:10.1145/363235.363259

[55] J.-R. Abrial, *The B-Book: Assigning Programs to Meanings*, Cambridge University Press, 1996. doi:10.1017/CBO9780511624162

[56] J.-R. Abrial, *Modeling in Event-B: System and Software Engineering*, Cambridge University Press, 2010. doi:10.1017/CBO9781139195881

[57] R.-J. Back and J. von Wright, *Refinement Calculus: A Systematic Introduction*, Springer, 1998. doi:10.1007/978-1-4612-1674-2

[58] F. L. Bauer and H. Wössner, *Algorithmic Language and Program Development*, Springer, 1982. doi:10.1007/978-3-642-61807-9

[59] S. Gulwani, "Automating string processing in spreadsheets using input-output examples," POPL 2011. doi:10.1145/1926385.1926423

[60] S. Gulwani, O. Polozov and R. Singh, "Program Synthesis," *Foundations and Trends in Programming Languages* 4(1-2), 2017. doi:10.1561/2500000010

[61] F. P. Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering," *Computer* 20(4), 1987. doi:10.1109/MC.1987.1663532

[62] P. Naur, "Programming as theory building," *Microprocessing and Microprogramming* 15(5), 1985. doi:10.1016/0165-6074(85)90032-8

[63] M. M. Lehman, "Programs, life cycles, and laws of software evolution," *Proceedings of the IEEE* 68(9), 1980. doi:10.1109/PROC.1980.11805

[64] P. Zave and M. Jackson, "Four dark corners of requirements engineering," *ACM Transactions on Software Engineering and Methodology* 6(1), 1997. doi:10.1145/237432.237434

[65] R. Landauer, "Irreversibility and Heat Generation in the Computing Process," *IBM Journal of Research and Development* 5(3), 1961. doi:10.1147/rd.53.0183

[66] C. H. Bennett, "Logical Reversibility of Computation," *IBM Journal of Research and Development* 17(6), 1973. doi:10.1147/rd.176.0525

[67] M. Franz and T. Kistler, "Slim binaries," *Communications of the ACM* 40(12), 1997. doi:10.1145/265563.265576

[68] C. W. Fraser, "Automatic inference of models for statistical code compression," PLDI 1999. doi:10.1145/301618.301672

[69] P. Cousot and R. Cousot, "Abstract interpretation: a unified lattice model for static analysis of programs by construction or approximation of fixpoints," POPL 1977. doi:10.1145/512950.512973

[70] Y. Futamura, "Partial evaluation of computation process: an approach to a compiler-compiler," *Systems, Computers, Controls* 2(5), 1971; reprinted in *Higher-Order and Symbolic Computation* 12(4), 1999. doi:10.1023/A:1010095604496

[71] A. P. Ershov, "Mixed computation: potential applications and problems for study," *Theoretical Computer Science* 18(1), 1982. doi:10.1016/0304-3975(82)90111-6

[72] W. A. Howard, "The formulae-as-types notion of construction," in J. P. Seldin and J. R. Hindley (eds.), *To H. B. Curry: Essays on Combinatory Logic, Lambda Calculus and Formalism*, Academic Press, 1980.

[73] 土居真之, 肥後芳樹, 有馬諒, 下仲健斗, 楠本真二 (M. Doi, Y. Higo, R. Arima, K. Shimonaka and S. Kusumoto), "ソースコードの「自然さ」を利用した自動生成ファイルの特定" (Identifying auto-generated files using the naturalness of source code), 電子情報通信学会技術研究報告 (IEICE Technical Report) 117(380), 19 to 24, January 2018. https://sdl.ist.osaka-u.ac.jp/pman/pman3.cgi?D=517

[74] M. Doi, Y. Higo, R. Arima, K. Shimonaka and S. Kusumoto, "On the naturalness of auto-generated code: can we identify auto-generated code automatically?" ICPC 2018. doi:10.1145/3196321.3196356

[75] F. V. Arrebola, "Modelo de sugestão de código-fonte baseado em modelos de linguagem organizados em um contexto hierárquico" (A source code suggestion model based on language models organized in a hierarchical context), doctoral thesis in electrical engineering, Fundação Educacional Inaciana Padre Sabóia de Medeiros (FEI), Brazil, 2018. Advisor R. A. C. Bianchi.

[76] G. Febres, K. Jaffé and C. Gershenson, "Complexity measurement of natural and artificial languages," *Complexity* 20(6), 2015. doi:10.1002/cplx.21529

[77] M. Rahman, D. Palani and P. C. Rigby, "Natural Software Revisited," ICSE 2019. doi:10.1109/ICSE.2019.00022

[78] A. Torres, S. Baltes, C. Treude and M. Wagner, "Applying Information Theory to Software Evolution," NLBSE 2023. doi:10.1109/NLBSE59153.2023.00017

[79] A. Blass, N. Dershowitz and Y. Gurevich, "When are two algorithms the same?," *Bulletin of Symbolic Logic* 15(2), 2009. arXiv:0811.0811. https://arxiv.org/abs/0811.0811

[80] Y. N. Moschovakis, "What is an algorithm?," in *Mathematics Unlimited: 2001 and Beyond*, Springer, 2001. https://www.math.ucla.edu/~ynm/papers/eng.pdf

[81] M. Y. Vardi, "What is an algorithm?," *Communications of the ACM* 55(3), 2012. doi:10.1145/2093548.2093549

[82] S. Laddad, A. Cheung, J. M. Hellerstein and M. Milano, "Flo: a Semantic Foundation for Progressive Stream Processing," POPL 2025. arXiv:2411.08274. https://arxiv.org/abs/2411.08274

[83] The Elm Architecture, Elm guide. https://guide.elm-lang.org/architecture/

[84] Temporal, "Workflows" (event history), documentation. https://docs.temporal.io/workflows

[85] A. Pnueli, M. Siegel and E. Singerman, "Translation validation," TACAS 1998. doi:10.1007/BFb0054170

[86] X. Yang, Y. Chen, E. Eide and J. Regehr, "Finding and understanding bugs in C compilers," PLDI 2011. doi:10.1145/1993498.1993532

[87] C. Nandi, M. Willsey, A. Zhu et al., "Rewrite Rule Inference Using Equality Saturation," OOPSLA 2021. arXiv:2108.10436. https://arxiv.org/abs/2108.10436

[88] C. Le Goues, T. Nguyen, S. Forrest and W. Weimer, "GenProg: A Generic Method for Automatic Software Repair," *IEEE TSE* 38(1), 2012. doi:10.1109/TSE.2011.104

[89] F. Long and M. Rinard, "Automatic patch generation by learning correct code," POPL 2016. doi:10.1145/2837614.2837617

[90] J. Bader, A. Scott, M. Pradel and S. Chandra, "Getafix: Learning to Fix Bugs Automatically," OOPSLA 2019. arXiv:1902.06111. https://arxiv.org/abs/1902.06111

[91] K. Etemadi, N. Harrand, S. Larsen et al., "Sorald: Automatic Patch Suggestions for SonarQube Static Analysis Violations," *IEEE TDSC*, 2022. arXiv:2103.12033. https://arxiv.org/abs/2103.12033

[92] Z. Qi, F. Long, S. Achour and M. Rinard, "An analysis of patch plausibility and correctness for generate-and-validate patch generation systems," ISSTA 2015. doi:10.1145/2771783.2771791

[93] E. K. Smith, E. T. Barr, C. Le Goues and Y. Brun, "Is the cure worse than the disease? Overfitting in automated program repair," ESEC/FSE 2015. doi:10.1145/2786805.2786825

[94] X.-B. D. Le, F. Thung, D. Lo and C. Le Goues, "Overfitting in semantics-based automated program repair," *Empirical Software Engineering* 23, 2018. doi:10.1007/s10664-017-9577-2

[95] Y. Xiong, X. Liu, M. Zeng, L. Zhang and G. Huang, "Identifying patch correctness in test-based program repair," ICSE 2018. doi:10.1145/3180155.3180182

[96] T. Durieux, F. Madeiral, M. Martinez and R. Abreu, "Empirical Review of Java Program Repair Tools: A Large-Scale Experiment on 2,141 Bugs and 23,551 Repair Attempts," ESEC/FSE 2019. arXiv:1905.11973. https://arxiv.org/abs/1905.11973

[97] K. Liu, A. Koyuncu, T. F. Bissyandé et al., "You Cannot Fix What You Cannot Find! An Investigation of Fault Localization Bias in Benchmarking Automated Program Repair Systems," ICST 2019. arXiv:1812.07283. https://arxiv.org/abs/1812.07283

[98] M. Monperrus, "Automatic Software Repair: A Bibliography," *ACM Computing Surveys* 51(1), 2018. doi:10.1145/3105906

[99] C. S. Xia, Y. Deng, S. Dunn and L. Zhang, "Agentless: Demystifying LLM-based Software Engineering Agents," 2024. arXiv:2407.01489. https://arxiv.org/abs/2407.01489

[100] S. Kapoor, B. Stroebl, Z. S. Siegel, N. Nadgir and A. Narayanan, "AI Agents That Matter," 2024. arXiv:2407.01502. https://arxiv.org/abs/2407.01502

[101] M. H. Erol, B. El, M. Suzgun, M. Yuksekgonul and J. Zou, "Cost-of-Pass: An Economic Framework for Evaluating Language Models," 2025. arXiv:2504.13359. https://arxiv.org/abs/2504.13359

[102] D. Zan, Z. Huang, W. Liu et al., "Multi-SWE-bench: A Multilingual Benchmark for Issue Resolving," 2025. arXiv:2504.02605. https://arxiv.org/abs/2504.02605

[103] R. Widyasari, S. Q. Sim, C. Lok et al., "BugsInPy: a database of existing bugs in Python programs to enable controlled testing and debugging studies," ESEC/FSE 2020. doi:10.1145/3368089.3417943

[104] M. Allamanis, "The Adverse Effects of Code Duplication in Machine Learning Models of Code," Onward! 2019. arXiv:1812.06469. https://arxiv.org/abs/1812.06469

[105] K. N. Khan, M. Hirki, T. Niemi, J. K. Nurminen and Z. Ou, "RAPL in Action: Experiences in Using RAPL for Power Measurements," *ACM TOMPECS* 3(2), 2018. doi:10.1145/3177754

[106] The Rust project, rustfix and `cargo fix`. https://github.com/rust-lang/rustfix

[107] R.-M. Karampatsis and C. Sutton, "How Often Do Single-Statement Bugs Occur? The ManySStuBs4J Dataset," MSR 2020. doi:10.1145/3379597.3387491

[108] C. Richter and H. Wehrheim, "TSSB-3M: Mining single statement bugs at massive scale," MSR 2022. doi:10.1145/3524842.3528505

[109] H. Coles, T. Laurent, C. Henard, M. Papadakis and A. Ventresque, "PIT: a practical mutation testing tool for Java," ISSTA 2016. doi:10.1145/2931037.2948707

[110] R. Just, D. Jalali, L. Inozemtseva, M. D. Ernst, R. Holmes and G. Fraser, "Are mutants a valid substitute for real faults in software testing?" FSE 2014. doi:10.1145/2635868.2635929

[111] I. J. Good, "Speculations Concerning the First Ultraintelligent Machine," *Advances in Computers* 6, 1965. doi:10.1016/S0065-2458(08)60418-0

[112] J. Schmidhuber, "Gödel Machines: Fully Self-referential Optimal Universal Self-improvers," in *Artificial General Intelligence*, Springer, 2007. doi:10.1007/978-3-540-68677-4_7

[113] E. Yudkowsky, "Intelligence Explosion Microeconomics," Technical report 2013-1, Machine Intelligence Research Institute, 2013. https://intelligence.org/files/IEM.pdf

[114] M. H. Löb, "Solution of a Problem of Leon Henkin," *Journal of Symbolic Logic* 20(2), 1955. doi:10.2307/2266895

[115] E. Yudkowsky and M. Herreshoff, "Tiling Agents for Self-Modifying AI, and the Löbian Obstacle," Machine Intelligence Research Institute, 2013. https://intelligence.org/files/TilingAgentsDraft.pdf

[116] E. Zelikman, E. Lorch, L. Mackey and A. T. Kalai, "Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation," 2023. doi:10.48550/arXiv.2310.02304

[117] J. Zhang, S. Hu, C. Lu, R. Lange and J. Clune, "Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents," 2025. doi:10.48550/arXiv.2505.22954

[118] A. Novikov et al., "AlphaEvolve: A coding agent for scientific and algorithmic discovery," 2025. doi:10.48550/arXiv.2506.13131

[119] G. Wang, Y. Xie, Y. Jiang, A. Mandlekar, C. Xiao, Y. Zhu, L. Fan and A. Anandkumar, "Voyager: An Open-Ended Embodied Agent with Large Language Models," 2023. doi:10.48550/arXiv.2305.16291

[120] Y. Futamura, "Partial Evaluation of Computation Process: An Approach to a Compiler-Compiler," *Higher-Order and Symbolic Computation* 12(4), 1999 (first published 1971). doi:10.1023/A:1010095604496

[121] V. F. Turchin, "The Concept of a Supercompiler," *ACM Transactions on Programming Languages and Systems* 8(3), 1986. doi:10.1145/5956.5957

[122] J. N. Foster, M. B. Greenwald, J. T. Moore, B. C. Pierce and A. Schmitt, "Combinators for Bidirectional Tree Transformations: A Linguistic Approach to the View-Update Problem," *ACM Transactions on Programming Languages and Systems* 29(3), 2007. doi:10.1145/1232420.1232424

[123] M. Hofmann, B. Pierce and D. Wagner, "Symmetric Lenses," *POPL*, 2011. doi:10.1145/1926385.1926428

[124] K. Czarnecki, J. N. Foster, Z. Hu, R. Lämmel, A. Schürr and J. F. Terwilliger, "Bidirectional Transformations: A Cross-Discipline Perspective," *ICMT*, LNCS 5563, 2009. doi:10.1007/978-3-642-02408-5_19

[125] E. W. Dijkstra, "A Constructive Approach to the Problem of Program Correctness," *BIT* 8(3), 1968. doi:10.1007/BF01933419

[126] A. Hall and R. Chapman, "Correctness by Construction: Developing a Commercial Secure System," *IEEE Software* 19(1), 2002. doi:10.1109/52.976937

[127] Y. Minsky, "OCaml for the Masses," *Communications of the ACM* 54(11), 2011. doi:10.1145/2018396.2018413

[128] D. A. Turner, "Total Functional Programming," *Journal of Universal Computer Science* 10(7), 2004. doi:10.3217/jucs-010-07-0751
