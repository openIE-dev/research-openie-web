---
title: "RCE-JEPA：世界编码，以 JEPA 为前提"
deck: "RCE-JEPA（RCE 是 Reality Code Engine；JEPA 是 Joint Embedding Predictive Architecture）保留其名称以便工作可检索。主题是世界编码。JEPA 是前提：一个学习模型预测程序的紧凑摘要，而不是写出下一个文本片段。World of Code 是规范程序形式加上精确的转移与接受规则（Coding 法则）的空间。proposer 槽位是任意学习模型。checker 决定。论文中陈述了 H1 到 H15 的假设。已测量的结果覆盖 H1（在 185 个手写程序上中位描述长度比为 9.34），H2（checker 与模型能量比为 0.000582，或在 Apple M5 Max 上的芯片报告的 `reported_j` 中便宜 1,718 倍），H5 与 H11 在未见的离散 Form 形状上通过 FormEBM-v2（5.85M 参数：接收者操作特征曲线下面积（AUROC）0.8922 ≥ 0.85，顶部-1 可解率 84.05%，checker 调用次数减少 2.39 倍，且在 Spearman 0.9931 下严格 5 步累计缺陷单调性达 93.0% ≥ 80%，每候选 core `reported_j` 为 47.09 mJ）以及 span-归一化分解的 FormEBM-v3（6.05M 参数：未见形状 H5 AUROC 0.9437 ≥ 0.85，缺陷头部可解率 83.44%，复合可解率顶部-1 为 80.98%，H11 严格 5 步单调性在 E_depth 上为 94.0%（Spearman 0.9966），在 E_total 上为 92.0%（Spearman 0.9846），且零样本分布外 H15 多-proposer 汇总 AUROC 从 0.2585 提升至 0.5278，在大跨度有效候选 vs 短无效候选上为 0.6018，每候选 core `reported_j` 为 232.45 mJ），H7 模糊臂（在 1,275 个变体中 0 次不变量违例），H8（在 10,500 条流 across 六个目标上 0 次回放不匹配），H14（确定性梯子关闭 111/151 任务，73.5%，零模型调用，剩余 40 项任务），H15 单次并有限制 checker-feedback 的 H15-Iterative 在这 40 项残余任务上（单次 17/40 至 34/40；k=1 时 22/40，k=16 时 27/40 对于 8.42M FormJEPA-v1；在 Claude Opus 5.5 与 Claude Sonnet 5.5 上 40/40 闭合且在限制 checker 反馈下无矛盾并使用公共标准库头文件；在 xAI Grok 4.20 Reasoning 上 39/40；Gear-0 回放 0 次调用且每次查找 0.325 µs；以及 200/200 Zipf(0.85) 3-Gear 流接纳，前沿情节减少 16.67 倍），以及 151-任务 rce 修复 rung f 推广审计（3/119 = 2.5% > 2.0%，0 矛盾，保持 rung f 处于 observe 模式）。完整的 intent-to-Form 合成（H3），跨模块签名与追踪的分布外能量校准超过 0.5278，以及外部墙表能量（`measured_j`）仍待解决。"
lang: "zh-Hans"
source: "rce-jepa"
complete: true
---

<div id="rce-jepa-world-coding-with-jepa-as-premise" class="anchor-alias" aria-hidden="true"></div>

**状态**。本文阐述了一个论点、十五个假设（H1-H15）、六个证伪者以及一套工作方案，并在 [/living/rce-jepa/](/living/rce-jepa/) 提供了交互式工具。其测量结果现已覆盖 Phase 0 确定性底层（Form 语料库和 H1、H7 的对抗模糊臂、H8 的六目标确定性流以及 H14 的确定性修复阶梯）、本地 Apple M5 Max 检查器对模型 `reported_j` 比率 **H2**（`C_check / E_model = 0.000582 <= 0.05`，`1,718` 倍更廉价）、单次和受限检查器反馈 **H15** 在 **40 个开放剩余任务** 上的表现（`17/40` 至 `34/40` 单次；**`40/40`（100.0%）** 在受限 `<= 5` 回合检查器反馈加上公共标准库签名头的 `H15-Iterative` 中，于 `Claude Opus 5.5` 与 `Claude Sonnet 5.5` 上无矛盾，`xAI Grok 4.20 Reasoning` 上 `39/40`，以及 **`40/40` 零调用重放**，延迟为 `0.325 µs` / `1.77 µJ`，来源于内存映射 Gear-0），以及面向目的训练的潜在 Form JEPA 修复提议器 **`FormJEPA-v1`**（`8.42M` 可训练参数，针对不相交的 Form S 表达式，容纳 `177/200` 保留的合成缺陷和 `27/40` 剩余任务（`k = 16`），将重复的 `Zipf(0.85)` Gear-2 片段从 `200` 降至 `12`，提升 `16.67×`，在与 `H15-Iterative` 配对时实现 `200/200` 流接纳），对比多步边际能量模型（EBM）评分器 **`FormEBM-v2`**（`5.85M` 可训练参数，基于相同严格不相交的 `1,387`-Form 划分，将未见形状 **H5** 的受试者工作特征曲线下面积（AUROC）从 `0.618` 提升至 **`0.8922 >= 0.85`**，实现 `84.05%` 的可解 top-1 准确率并减少 `2.39×` 的检查调用；并将未见链 **H11** 的严格 5 步编辑单调性从 `36.0%` 提升至 **`93.0% >= 80%`**，Spearman `0.9931`，每候选核心 `reported_j` 消耗 `47.09 mJ`），跨度归一化的双头分解评分器 **`FormEBM-v3`**（`6.05M` 可训练参数，基于相同划分，将未见形状 **H5** AUROC 提升至 **`0.9437 >= 0.85`**，实现 `83.44%` 的缺陷头部和 `80.98%` 的复合可解 top-1 准确率；将未见链 **H11** 的严格 5 步单调性提升至 **`94.0%`**（在 `E_depth` 上 Spearman `0.9966`）以及 **`92.0%`**（在 `E_total` 上 Spearman `0.9846`），并通过提升多提议者池化 AUROC 从 `0.2585` 到 **`0.5278`**，以及大跨度有效对短无效 AUROC 从 `0.6018`，在零-shot 分布外（OOD）**H15** 上消除 Wave-4 跨任务编辑跨度倒置，候选核心 `reported_j` 能耗为 `232.45 mJ`），以及预注册的 151 任务 **`rce repair`** 阶段 `f` 推广审计（`3/119 = 2.5% > 2.0%` 随机份额，`3/3` 通过 `W-MUT-1`，`0` 矛盾，确认阶段 `f` 仍处于 `observe` 模式）。诚实披露：完整的意向到 Form 合成（H3）、端到端焦耳等价（H4）、跨模块签名与追踪 OOD 能量校准超越 `0.5278`（跨多模块 git-history 重写）、参考应用编码（H6）、成本表预测（H9）、商数数据节省（H10）、决策头校准（H12）、离散-连续长视程规划（H13）、扩散/演化 H15 臂以及外部墙表计 `measured_j` 均仍未完成。JEPA 为前提：预测意义的摘要，而非表层文本。研究主题是世界编码，任何在 Forms 上学习的提议器，遵循编码律作为接受规则。决定性部分（提交门、精确重放、投影以及整数成本单元）在[the RCE paper](/papers/rce/) 中描述；本文关注提议器：在循环中引导对 Forms 的搜索，而引擎负责渲染每个目标。回路中的任何模型，无论托管还是本地，仅提供提议，安全性永不依赖于它。

![流程图：陈述的意图交给任意可学习的提议器，图中以 JEPA 为例。解码器提出按能量分数排序的候选程序形式，确定性检查器接受候选或指出违反的规则，被接受的形式交给引擎进行精确重放、证明、其他语言的代码生成与放置](/figures/rce-jepa/pipeline.svg)

*图 1. 所提出的流程。任意可学习的提议器将陈述的意图映射为候选程序。图中绘出的实例是 JEPA，它在潜空间中进行预测。解码器将该提议转换为固定形式的候选程序，并按能量分数（越低表示拟合越好）排序。确定性检查器接受每个候选，或报告其需要修改，并返回违反的规则以供重新排序。虚线框内的全部内容都是可学习且不可信的，只有被接受的程序才会进入引擎。本地 Apple M5 Max 计数器的读数严格记录为 `reported_j`（`measured_j = None`，`board_metered = false`），远程云服务器的能耗记录为 `not_available`。*

通俗地说

1. 本研究的主题是世界编码。世界编码（World of Code）是程序形式（Form）的空间，外加关于下一状态以及何种形式被接受的精确规则，即编码定律（Laws of Coding）。JEPA 是前提，而不是方法的全部：它预测代码含义的摘要，而不是代码的下一个词元。此处的 AI（人工智能）指任何习得的提议者，而不是某一种特定架构。

2. 模型提出候选，检查器作出裁决。基于迹线训练的解码器、扩散模型、证明检查器内的强化学习、进化搜索、库学习以及约束解码，都可以占据这一位置。提议者改变时，门控机制不变。安全性不取决于提议者是否正确。

3. 实测下限与残差基准须严格标注。在 185 个手写程序上，描述长度比的中位数为 9.34（H1）。在 Apple M5 Max 上，于提交 `1762fb4b` 处，检查一个 Form 的成本为 `49.04 mJ`，而每次本地 35B 候选生成的成本为 `84.25 J`，即便宜 `1,718×`（支持 H2）。模糊测试在 1,275 个被接受的变异体中未发现不变量被破坏（0 次，H7）。在六个目标上的 10,500 条流中，重放结果一致（H8）。确定性阶梯在 151 个任务中闭合了 111 个（73.5%），且未调用任何模型，剩余 40 个真实历史任务（H14）。

在这 40 个残差任务上（H15），单次提议者的通过数从 `17/40` 到 `34/40` 不等。有界检查器反馈配合公开标准库头文件（`H15-Iterative`，无法接触原始 Form）在 `Claude Opus 5.5` 和 `Claude Sonnet 5.5` 上闭合了 **`40/40`（`100.0%`）**，矛盾数为 `0`（在 `xAI Grok 4.20 Reasoning` 上为 `39/40`）。并且，这 **`40/40` 被固化为 Gear 0（`DNULLMM1`）**，可零调用重放。专门训练的 `FormJEPA-v1`（`8.42M` 参数）在 `k = 16` 时通过 `27/40`。对比训练的 `FormEBM-v2`（`5.85M` 参数：AUROC `0.8922`，单调性 `93.0%`）以及跨度归一化的 `FormEBM-v3`（`6.05M` 参数：H5 上未见形状 AUROC `0.9437`，H11 上 `E_depth` 单调性 `94.0%`、`E_total` 单调性 `92.0%`，零样本 H15 合并 AUROC 从 `0.2585` 提升至 `0.5278`）无需调用检查器即可为 Form 候选排序。**三挡 Gear 级联**（3-Gear Cascade）在 `Zipf(0.85)` 的 200 次重复到达中通过 `200/200`，所需前沿模型回合减少 `16.67×`（`12` 对 `200`）。`rce repair` 的 `f` 档仍处于观察（`observe`）模式（`3/119 = 2.5% > 2.0%`，矛盾数为 `0`），且本文未声称任何外部壁式电表读数（`measured_j`）。

<div id="principles" class="anchor-alias" aria-hidden="true"></div>

## 原则

模型仅提出。  
检查器决定。  
安全从不依赖于模型。  
在 Reality Code Engine 自身的工具链循环中不运行任何模型。  
每个被接受的程序形式都可以逐位重放。  
任何决策模型，无论是托管的还是本地的，都是门外的提议者。  
首先确定性。自动化的第一条规则是拥有一个可行的手动过程：在任何模型之前，先运行一系列精确、确定性的提议者梯层，模型仅在该梯层留下的空白上行动（在下文的提议者部分中说明）。

<div id="terms-heading" class="anchor-alias" aria-hidden="true"></div>

## 本页使用的术语与缩略语

为使每个术语在使用前均已有定义，此处予以列出。仅出现在参考文献条目中的缩略语（如会议名称、报告系列）不在此列。

<ul id="terms">
<li>AGX: NVIDIA 的 Jetson AGX 系列嵌入式计算机</li>
<li>AILANG: 用于 AI 编写代码的编程语言（项目名称）</li>
<li>AIME: 美国邀请数学考试</li>
<li>AI: 人工智能</li>
<li>AIXI: Hutter 的通用智能体理论模型</li>
<li>AMD: 超威半导体公司</li>
<li>ANDF: 架构中立分发格式</li>
<li>API: 应用程序编程接口</li>
<li>APU：加速处理单元，将 CPU 核心与集成 GPU 合并于同一封装</li>
<li>ARC: 抽象与推理语料库，Chollet 度量和 ARC 奖使用的任务集</li>
<li>AST: 抽象语法树</li>
<li>AUROC: 接收者操作特征曲线下面积</li>
<li>BLAKE3: 加密哈希函数</li>
<li>BLEU: 双语评估替代指标，文本重叠得分</li>
<li>CALM: 作为逻辑单调性的连贯性</li>
<li>CEGIS: 反例引导的归纳综合</li>
<li>CPU: 中央处理单元</li>
<li>CUDA: NVIDIA 的 GPU 编程平台</li>
<li>CWM: 代码世界模型，一种在执行轨迹上部分训练的开源权重代码模型</li>
<li>Dafny: 一种在代码旁边放置规范和证明的编程语言</li>
<li>DBOS: 持久执行系统（项目名称）</li>
<li>DIR: 传递给命令的目录路径</li>
<li>DNULLMM1: 开放寻址二进制内存映射哈希表存储格式（64 字节头部加 48 字节槽位）</li>
<li>EB-JEPA: 基于能量的 JEPA 库（项目名称）</li>
<li>EBM：基于能量的模型</li>
<li>ECE: 期望校准误差</li>
<li>e-graph: 等式图，一种包含许多等价程序的结构</li>
<li>EMA: 指数移动平均</li>
<li>EWD: Edsger W. Dijkstra 的编号手稿系列</li>
<li>ESBMC: 高效基于 SMT 的有界模型检查器</li>
<li>FAIR: Meta 的基础人工智能研究组</li>
<li>FPR：假阳性率</li>
<li>GELU: 高斯误差线性单元激活函数</li>
<li>GPT: 生成式预训练变换模型，OpenAI 的模型系列</li>
<li>GPU: 图形处理单元</li>
<li>GRPO: DiffuCoder 报告中称为耦合 GRPO 的强化学习更新</li>
<li>GSM8K: LLM-JEPA 使用的中小学数学文字题集合</li>
<li>HVM2: Higher Order Company 的交互组合子计算模型</li>
<li>IBM: 国际商业机器公司</li>
<li>ICOT: 日本新一代计算机技术研究所</li>
<li>IEEE: 电气与电子工程师学会</li>
<li>IQR：四分位距</li>
<li>JACM: ACM 期刊（计算机协会）</li>
<li>LCM: 大概念模型，一种在句子嵌入空间而非词元上进行预测的模型</li>
<li>LHS: 示例事件轨迹的左侧</li>
<li>LLM: 大型语言模型</li>
<li>MBPP: 类型约束解码报告中提到的简短 Python 题目集</li>
<li>MDE: 模型驱动工程</li>
<li>METR: 报告 2025 年初开发者生产力试验的团队（Becker 等）</li>
<li>MLA: 多头潜在注意力</li>
<li>MLIPS: 每秒百万逻辑推理</li>
<li>MLIR: 多层次中间表示</li>
<li>MLP: 多层感知器</li>
<li>MoE: 专家混合模型</li>
<li>MPC: 模型预测控制，通过重复的短期推演进行规划</li>
<li>NAIL: 一种规范形式的编程语言（项目名称）</li>
<li>NVIDIA: GPU 制造商</li>
<li>OMG: 对象管理组</li>
<li>OOD：分布外（out-of-distribution）</li>
<li>PAR: 基于模式的自动程序修复</li>
<li>PID: 操作系统中的进程标识符</li>
<li>POSIX: 可移植操作系统接口</li>
<li>PTX: NVIDIA 的并行线程执行指令集</li>
<li>RAND RM: 兰德公司研究备忘录</li>
<li>RAPL: 英特尔的运行平均功耗限制能量计数器</li>
<li>README: 仓库的首页文档文件</li>
<li>RF: RCE 规范中外部提案梯级-f 规则的标签</li>
<li>RFC: 征求意见稿，一种互联网标准文档</li>
<li>RISC-V: 一种开放的精简指令集计算机架构</li>
<li>RJ-F: RCE-JEPA 前提的证伪者标签</li>
<li>RL: 强化学习</li>
<li>RMS：均方根（root mean square）</li>
<li>ROC：受试者工作特征（receiver operating characteristic）</li>
<li>ROCm：Radeon Open Compute 平台</li>
<li>SAT: 布尔可满足性</li>
<li>SATB: 饱和度基准遥测和测试规范</li>
<li>SFT: 监督式微调</li>
<li>SHA-256: 256 位摘要的安全哈希算法</li>
<li>SMC: 系统管理控制器</li>
<li>SoC: 片上系统</li>
<li>SONAR: 大型概念模型使用的句子嵌入空间，覆盖 200 种语言</li>
<li>STAN-CS: 斯坦福计算机科学技术报告系列</li>
<li>STOP: 自学优化器</li>
<li>SUT: 被测系统</li>
<li>SWE-bench: 一个基于真实代码仓库问题的基准测试集。SWE-bench Verified 是其经过人工审核的子集，多份代码报告在该子集上给出了 pass@1 指标</li>
<li>TOPLAS: ACM 编程语言与系统汇刊</li>
<li>TPR：真阳性率（true positive rate）</li>
<li>UNCOL: 通用计算机导向语言</li>
<li>USD: 美元</li>
<li>VAX: 数字设备公司的虚拟地址扩展计算机系列</li>
<li>Verus: 一种用于验证 Rust 语言子集的验证器</li>
<li>VICReg: 方差-不变性-协方差正则化</li>
<li>XML: 可扩展标记语言</li>
</ul>

<div id="outline" class="anchor-alias" aria-hidden="true"></div>

## 本页组织方式

页面应自上而下阅读。在“一目了然的假设与反驳”之后，按以下顺序包含这些部分：

1. 已有的内容以及本页所涉及的内容（提案者部分）
2. 论点，分为五部分：第 1 部分，计算作为有限信息系统；第 2 部分，压缩为形式与模板；第 3 部分，运动学；第 4 部分，物理完全已知的世界模型；第 5 部分，作为可检验预测的后果
3. 通过承诺实现收敛
4. 第 1 节 历史：七十年“说你想说的，得到程序”
5. 第 2 节 早期尝试为何停滞
6. 第 3 节 通往代码世界的三条路径：训练、混合体以及计算的再概念化
7. 第 4 节 为什么是现在
8. 第 5 节 JEPA 作为前提，以及其局限
9. 第 6 节 提案者位置对架构中立
10. 第 7 节 代码世界
11. 第 8 节 一个具体实例：Reality Code Engine，附带假设表和反驳
12. 状态与参考文献

<div id="hypotheses-overview" class="anchor-alias" aria-hidden="true"></div>

## 假设概览

本页面测试十五个假设，H1 至 H15，在讨论任何一个之前先在此完整列出。每个假设均附有其度量指标与阈值，汇总于[第 8 节](#hypotheses)的一张表中，随后列出证伪项 RJ-F1 至 RJ-F6。

1. H1. Form 空间远小于同一程序的源程序空间。（在 185 个手写程序上得到支持：中位数 rho 为 9.34。）
2. H2. 检查器相对于生成的成本很低。（在 Apple M5 Max 的 `reported_j` 上得到支持：C_check / E_model = 0.000582 <= 0.05，便宜 `1,718×`。）
3. H3. 在表示空间中进行预测可以达到有用的接受率。
4. H4. 每个被接受程序的能耗下降。
5. H5. 能量排序将概率质量集中到有效 Form 上。（对比式 `FormEBM-v2` 达到 AUROC `0.8922 >= 0.85`，可解性 top-1 准确率为 `84.05%`；跨度归一化的 `FormEBM-v3` 将未见形状上的 AUROC 提升至 `0.9437 >= 0.85`，缺陷头 top-1 准确率为 `83.44%`，复合可解性 top-1 准确率为 `80.98%`，而未校准的 `FormJEPA-v1` 为 `0.618`；零样本 OOD H15 的汇总 AUROC 由 `0.2585` 提升至 `0.5278`，超过 `0.5278` 的跨模块签名/轨迹校准仍未解决。）
6. H6. 参考应用可以被编码为 Form。
7. H7. 安全性不依赖于模型。（模糊测试组实测：在 1,275 个变异体中出现 0 次违规。）
8. H8. 每个被接受的 Form 都可以确定性地重放。（在六个目标上的 10,500 条流中得到支持：0 次不匹配。）
9. H9. 成本可以在执行之前预测。
10. H10. 在商（规范 Form）上学习可以节省训练数据。
11. H11. 能量与编辑距离单调相关。（对比式 `FormEBM-v2` 达到 `93.0% >= 80%` 的严格 5 步单调性；分解式 `FormEBM-v3` 在 100 条未见累积缺陷链上，`E_depth` 达到 `94.0%`（Spearman `0.9966`），`E_total` 达到 `92.0%`（Spearman `0.9846`），而 `FormJEPA-v1` 为 `36.0%`；无约束的同线随机游走切片仍低于 `80%`。）
12. H12. 决策头在门控结果上是校准的。
13. H13. 在长编辑序列上，离散潜变量比连续潜变量的规划效果更好。
14. H14. 一个公开、确定性的精确提议器阶梯，在零模型调用的情况下，关闭了已登记任务集中可测量的一部分；该比例即为学习型提议器在残余任务上必须超越的基线。（已支持：151 个任务中的 111 个，即 73.5%，留下 40 个未解决任务。）
15. H15. 在匹配预算下，于 40 个任务的残余上比较各类提议器，并与 Gear-0 结晶及 3-Gear 级联一同评估。在六个单次调用的云端/本地提议器上进行了基准测试（`17/40` 至 `34/40`）；专门训练的 `FormJEPA-v1`（`k = 1` 时为 `22/40`，`k = 16` 时为 `27/40`；使用 `FormEBM-v2` 重排序的带类型 `k = 1` 时为 `25/40`；在 `FormEBM-v3` 的 `E_def` 下，带类型 `k = 1` 时为 `24/40`，多提议器 `k = 1` 时为 `27/40`）；使用公共标准库头文件的有界检查器反馈 `H15-Iterative`（在 `Opus 5.5` 和 `Sonnet 5.5` 上为 `40/40`，矛盾数为 `0`；在 `Grok 4.20` 上为 `39/40`）；以及 Shape D（`DNULLMM1`）的 Gear-0 重放（零调用下为 `40/40`；在 `Zipf(0.85)` 上 3-Gear 回合数缩减 `16.67×`，且 `200/200` 次准入）；扩散法与进化法仍未解决。

<div id="falsifiers-overview" class="anchor-alias" aria-hidden="true"></div>

## 证伪条件概览

六项观察会削弱部分前提，完整内容见第 8 节在其检验的假设之后。

1. RJ-F1. 在任意五种目标语言上，提升覆盖率在 80% 以下即出现平台期。
2. RJ-F2. 为参考应用编写意图规范的成本高于手工编写其表单的成本。
3. RJ-F3. H3 失效，而 token 分支在同一门限下通过。
4. RJ-F4. H11 失效且搜索在光束预算内未能达到可接受的表单。
5. RJ-F5. 决策头的校准始终不如基于形状哈希的频率表。
6. RJ-F6. 一个在痕迹上训练的 token 空间模型在相同能量和相同门限接受率下关闭了 40 项任务的残差，且未使用表单商。

<div id="proposer" class="anchor-alias" aria-hidden="true"></div>

## 已有的内容以及本页的主题

Reality Code Engine 在其公共参考检查器和引擎设计中保留了决定问题一半的内容。其公开论文[The Reality Code Engine](/papers/rce/) 描述了该部分的设计：一个在入口处检查每个候选的提交门、精确回放（运行时状态是对日志的转移函数的左折叠）、一种 Form 到其他语言的投影，以及整数成本核算（`est_j`），并严格与操作系统/芯片计数器读数（`reported_j`，首次在 Apple M5 Max 上的提交 `1762fb4b` 记录）以及外部墙表读数（`measured_j`，RCE 没有此类读数）分离。核心定理在证明助理 Lean 4.36.0 中得到检验（在 `f87d6af2` 处的 `64` 个模块中，由 `1,264` 条源代码声明生成 `5,393` 个内核定理常量，并经 `lake check --paranoid` 的全部六个独立证明检查器验证通过），其规范和 Lean 库均为公开。此页面仅引用该论文中模型提议者运行的公开记录，其余内容视为设计背景。

**本页面聚焦于提议器（proposer）**：即负责建议应尝试哪种 Form 的可学习部分。检查器、重放机制以及向其他语言的投影均为公开代码，引擎的门控（gate）与 `est_j` 计量则属于已规定的设计。第 8 节现报告六个现成模型的基准测试，以及内存映射的 Gear-0 结晶化结果，并给出首个专门训练的潜在 Form JEPA 修复提议器（`FormJEPA-v1`，可训练参数 `8.42M`，基于互不相交的规范 Form S 表达式训练）。在 `200` 个留出的合成 Form 缺陷中，它修复了 `177/200`；在 `40` 个开放的残余任务中，它修复了 `27/40`，且核心 `reported_j` 低于一焦耳。第 8 节还报告了对比式多步间隔能量评分器（`FormEBM-v2`，参数 `5.85M`，使用相同的 `1,387` 个 Form 互不相交划分），其在未见形状的 H5 AUROC 上达到 `0.8922`，在 H11 的严格 5 步编辑单调性上达到 `93.0%`，同时将可解的检查调用次数减少至 `2.39×`。此外是跨度归一化的双头分解评分器（`FormEBM-v3`，参数 `6.05M`，同一划分），它将未见形状的 H5 AUROC 提升至 `0.9437`，H11 严格 5 步单调性在 `E_depth` 上达到 `94.0%`、在 `E_total` 上达到 `92.0%`，并将零样本分布外 H15 多提议器合并 AUROC 从 `0.2585` 提高到 `0.5278`，其中大跨度有效重写与短跨度无效重写的 AUROC 为 `0.6018`。最后是有界的检查器反馈残余闭合，使用公开的标准库头文件（`H15-Iterative`），以 `0` 次矛盾闭合了 `40/40` 个残余任务，并通过 `40/40` 次零调用 Gear-0 重放验证。交互式实验工具见[交互式实验](/living/rce-jepa/)。而完整的意图到 Form 合成、跨模块签名与追踪的分布外能量校准，以及门控收据决策头，仍属未解决的问题。

<div id="ladder" class="anchor-alias" aria-hidden="true"></div>

### 确定性优先：提议器之下的阶梯

自动化的第一条规则是拥有一个可行的手动过程。RCE-JEPA 所提出的内容只有在已经可行的手动变体或确定性自动化变体之上才有意义；学习得到的提议者是添加在其上的，而不是取代它。因而设计将提议者按梯级排序，精确的提议者首先执行：

1. **复用。** 内容哈希（其规范文本的哈希）或无名形状（将每个名称替换为其位置的 Form，使得重命名不改变它）与已存 Form 匹配的 Form 将原样复用。
2. **按类型查找。** `rce search` 查找类型与任务所需类型匹配的已存处理器。
3. **确定性重写。** `rce fmt` 为规范规则表中方法为 “altered” 的规则写入重写；每条规则产生一个结果，第二次运行则找不到可重写的内容。
4. **有界枚举。** 在规范的无名投影中枚举所有不超过固定上限的微小编辑，每个候选由检查器评判。
5. **重命名。** 将一个值名称在其作用域内变为另一个值名称，或将一个绑定变为检查器报告中命名的名称，最多到固定上限，每个候选由检查器评判。

学习得到的提议者仅作用于梯级未覆盖的残余任务。它在规范 Form 编辑空间中提出编辑，且同一检查器对每个提议的评判方式与对梯级候选的评判完全相同。降低随机模型需要完成的工作量会缩小其动作空间，而较小的动作空间更易于掌握。这就是预期 H10（在商上学习可节省数据）成立的原因，也解释了 H14 为什么让梯级的基准份额成为学习提议者在残余上必须超越的基准。梯级是公开的，位于 `rce repair` 的 openIE-dev/rce 中，并在 openie-research-experiments 的 `rce/bench/ladder` 下注册了三次运行，其文件将梯级 1-5 标记为 a-e；第 5 阶梯为第三次运行新增。它们的结果在下文第 8 节与 H14 一起报告，表明它关闭了其梯级所逆转的突变类，并且在真实历史的 41 项变更中关闭了 1 项，因此残余几乎覆盖了所有真实缺陷。

<div id="rung-f" class="anchor-alias" aria-hidden="true"></div>

`rce repair` 在 openIE-dev/rce 主分支上拥有第六层梯级，标记为 f，仅在梯级 1-5 未关闭任何内容时运行。梯级 f 本身不调用模型。由模型在托管服务或本地机器上、或由人工在 RCE 之外编写的程序，仅以输入文件的形式到达此处，每个文件带有标记其来源的标签，并通过其 SHA-256 摘要记录。检查器对每个文件的评判方式与对梯级候选的评判相同，包括突变门：：该门拒绝任何示例或检查能够通过单一微小编辑使程序失效的程序；在检查器判断之前，改变示例、检查或法律的提议会被直接拒绝。梯级的模式由规范中的数据决定，可为 `off`、`observe` 或 `auto`，当前保持在 `observe`：每个提议都会被评判，检查器接受的每个提议都会随其 diff、摘要和来源一起报告，程序保持开放，且不会覆盖任何源文件。在 `auto` 模式下，首个被接受的提议将关闭程序，报告会将该关闭标记为随机的。

规范仅在记录的评估满足提升准则时才允许将 `observe` 更改为 `auto`。该准则已在 openIE-dev/rce 中于任何观察之前注册（`rce-repair-rung-f-promotion-2026-11-03`，`sha256: abf7f131f240e3f9...`），并在其旁边标注了 SHA-256，遵循的规则是：至少 98% 的关闭来自确定性 rung，至多 2% 来自随机 rung，且每个随机输出均受门控。在第 2、3 轮的 151 项任务中，每轮使用任务的原始程序作为已知良好版本，最多 2% 的关闭可来自 rung f；每个被观察为已接受的提案也必须通过突变门；且任何提案都不得与原始程序相矛盾，即在某些事件序列后表现不同。确定性命令 `rce repair criterion` 从观察记录中评估该准则，规范自身的检查在记录的评估满足准则之前会拒绝 `auto` 模式。在提交 `1762fb4b` 的已注册 151 项任务评估中（在下文第 8 节报告），rung 1 到 5 为每项任务的已知良好原始关闭提供了 `116` 项任务的 `0` 次模型调用，留下 `35` 项未完成任务（其中 `25` 项不可解析的 `W-SYN-1` 文件被 rung f 跳过，`10` 项为未完成的解析任务）。将组合的外部提案（`FormJEPA-v1` 加上记录的残余修复，`91` 项提案被评估）输入后得到 `3` 项观察到的 rung-f 接受：`3/3`（`100.0%`）通过突变门，且 `0` 项与原始冲突（`3/3` 已恢复），然而 `119` 项关闭中有 `3` 项为 `2.5% > 2.0%`，因此 `rce repair criterion` 确定返回 `holds: false` 并保持 rung f 处于 `observe` 模式。

<div id="steer" class="anchor-alias" aria-hidden="true"></div>

### 模型引导，引擎渲染

机器人已经以这种方式工作。在 V-JEPA 2-AC，即 V-JEPA 2 视频模型的动作条件版中，规划器通过最小化预测的未来表征与目标图像表征之间的距离来搜索机器人动作；它从不生成像素 [B1]。编码器在超过一百万小时的视频上进行预训练，动作条件预测器在不足 62 小时的未标记机器人视频上进行训练 [B1, abstract]。RCE-JEPA 对代码提出相同的划分：一个学习模型选择对 Form 的编辑，而引擎从接受的 Form 渲染每一种目标语言。没有模型会直接输出代码。

代码与机器人在一个决定性方面不同。机器人的世界模型必须 *学习* 世界如何运动，$z_{t+1}=g_\phi(z_t,a_t)$。在 RCE 中，转移函数 $\delta$ 已给出并得到证明，因此前向动力学根本不需要学习。剩下要学习的是逆向过程：哪种编辑将候选项移动到意图所要求的方向。MuZero 学习模型的原因正如其作者所述，规划方法 “依赖于对环境动力学的了解” [T1, Sec. 1]；这里这些动力学已经被写下来。

<div id="one-form" class="anchor-alias" aria-hidden="true"></div>

### 一个真实形式

在架构之前，是对象。这是来自公共仓库的完整程序（`examples/surface/counter.rce` 位于 openIE-dev/rce，提交 `1762fb4b`），共十四行 RCE 表面语法，未作编辑：

```text
intent "a counter that never goes negative"
    example Inc, Inc, Dec -> 1
    example Dec -> kept: Underflow

state Counter
    n: u64 = 0

event Inc
event Dec

error Underflow

step Counter on Inc -> n + 1
step Counter on Dec -> try n.checked_sub(1) else Underflow
```

将其读取为 $P=(S,E,\delta,D,\lambda)$。`state` 块为 S，一个从零开始的无符号 64 位整数。两个 `event` 行是 E。两个 `step` 行是 $\delta$。`intent` 块是对意图的简要规范，已在本页 $\sigma(I)$ 中给出：两个必需的轨迹，其中一个必须以保留步骤结束。零时的递减不适用：该步骤在 `Underflow` 时保持状态不变，且依据定理 T8 状态保持不变。提议者的任务，如本示例所述：仅依据 `intent` 块，找出门接受的 `state`、`event` 和 `step` 行。

<div id="architecture" class="anchor-alias" aria-hidden="true"></div>

### 架构

这里绘制的框是提议者接口。它并非一种架构。提议者读取意图和当前 Form 并返回候选编辑或候选 Form。门位于接口之外。JEPA 编码器在潜在空间中进行预测，是一种实例。经过轨迹训练的解码器、扩散代码模型、在形式环境中的强化学习、进化搜索、库学习以及受约束解码都是其他实例。下面第 6 节列出每一种实例、它对检查器的需求、已知的失效模式以及它将推动的假设。决策头是同一接口的一个小型类型化实例。任何实例仅负责提议，编码定律不依赖于它。

![Inside a dashed region labelled learned and untrusted: an intent encoder, a proposer acting as an inverse model, an exact rollout by the transition function, a Form encoder with energy, a tree search, and a decision head. Outside it: the gate, which alone admits programs, and the checker and engine, which replay and project. A requires-change arrow returns the broken rule to the search](/figures/rce-jepa/architecture.svg)

*图 2. 模型引导，引擎渲染。橙色框为学习且不可信；蓝色框为由转移函数进行的精确 rollout，作为搜索期间的模拟器使用；绿色框为 RCE 论文描述的部分，公开代码或指定设计（见该论文）。只有门允许。设计图，而非数据。*

| 组件 | 角色 | 初始设计 | 原因 |
| --- | --- | --- | --- |
| Form encoder $E_f$ | 将表单及其在示例事件上的追踪映射到潜在 $z_f$ | 对表单的规范 JSON（JavaScript 对象表示法）以及追踪标记使用小型 transformer，并通过 SIGReg（草绘各向同性高斯正则化）[B2] 正则化；第二支路使用离散或软码本瓶颈 [B3, B4, B5]（SC-JEPA 的软码本与 EMA（指数移动平均）教师和重建锚点 [B5, Sec. 4.4.1 and App. B.1] 一起稳定） | 追踪定义等价关系，且追踪是自由的因为 $\delta$ 是精确的。离散标记保持长时预测的稳定性，而连续潜在会累积误差 [B3]；布尔潜在通过按位相等实现精确状态重新识别，这是 [B4] 中对早期工作引用的动机 |
| Intent encoder $E_I$ | 将 $\sigma(I)$（必需的追踪、契约、测试、散文）映射到相同空间 | 共享架构，训练使得已知接受的拟合 $f^\star$ 中 $E_I(\sigma(I))$ 接近 $E_f(f^\star)$ | 将目标和候选放在同一度量中，正如 V-JEPA 2-AC 对目标图像的处理方式 [B1] |
| Proposer $\Pi_\theta$ | 在给定 $z_I$ 和当前 $z_f$ 的情况下，提出类型化的表单编辑 | 一个目标条件的逆模型，LeWAM 将其形状与 GC-IDM（目标条件逆动力学模型）进行比较，这是 Nguyen 等人 (2026) 的基线，LeWAM 对其进行评估，而非 LeWAM 作者提出的模型 [B6, Sec. 4.2 and App. A.2] | 当 $\delta$ 为精确时，逆过程即为可学习对象 |
| Energy $\mathcal{E}$ | 在门前对候选进行排序 | $\alpha V(f)+\beta\,d(z_{\tau(f)},z_{\sigma(I)})+\gamma\,C(f)$，其中 $C(f)$ 来自 `est_j` | 单独训练的能量函数不可比 [T2, Sec. 1.3]；$\alpha,\beta,\gamma$ 在保留切片上拟合，以最大化接受与需要更改之间的 AUROC（受试者工作特征曲线下面积），并随每次运行报告 |
| Planner | 在编辑上搜索 | 对 proposer 编辑进行束搜索或树搜索，使用 $\mathcal{E}$ 评分，并在每个节点进行精确 rollout | V-JEPA 2-AC 使用交叉熵方法（CEM）在连续动作上进行规划 [B1]；表单编辑是离散且组合的，故 CEM 不适用 |
| Decision head | 通过校准概率进行有界选择：每个空位的值、排名、等价性判决 | 由 RCE 项目构建的小型决策模型，基于门收据（下一小节）进行训练 | 校准概率 $p_i$ 对最便宜的级联进行排序 |

**从不学习:** $\delta$、$\lambda$、fold、hash 链、投影、gate 和 promotion 路径。它们是固定且已认证的，promotion 从不重新训练它们。

<div id="decision-head" class="anchor-alias" aria-hidden="true"></div>

### 决策头是提议器，位于门控之外

2026 年出现了一类小型、节能感知的决策模型。决策模型接受一段状态和一个固定问题，返回每个选项的类型化答案及其概率，且不生成文本；对同一状态的所有问题在一次请求中得到回答 [B7; B8]。答案受限：是或否、在调用方提供的选项集合中进行选择（Jev 最多 255 项；Laya 的准确率在约 20 项后下降），或在声明的尺度上给出分数 [B8]。本节列出的成员作为概念的收敛示例，而非 RCE 的组成部分：

- **Laya**，一种约 4.21 亿参数的开放权重模型，基于 ModernBERT-large 编码器并配有两层决策头，采用 Apache 2.0 许可证发布 [B8, B9]。
- **Kev**，一系列基于 Qwen 骨干的开放决策模型，参数规模从 0.8 到 270 亿不等，每个检查点均附带已校准的温度参数 [B10]。
- **Liquid AI 的开放 d1 模型**，d1-3B 与 d1-omni-600M，于 2026 年 10 月 7 日发布，面向边缘和物理系统：d1-3B 在 NVIDIA Jetson AGX Thor 上回答单个问题耗时 16 ms，在 Jetson Orin Nano 上耗时 50 ms，能够读取摄像头帧，并在 Isaac Sim 机器人模拟器中展示了在硬件在环设置下模型运行于 Jetson 上的环境导航能力 [B11]。

对该类中一个托管成员的独立基准测试表明，其选择概率校准良好，22 个选择数据集共计 279 925 条答案的期望校准误差（ECE）为 0.028 [B7]；其二元（是或否）概率校准较差（单标签 ECE 0.052，多标签 ECE 0.168），需要调节阈值 [B7, Sec. 4.3]。该类已记录的弱点包括计数、算术和日期比较，以及在状态被无关内容填充时准确率下降 [B8, B12]。

决策头是上述提议者接口中的一个插件。JEPA 编码器是另一种插件。无论是托管还是本地，决策头仅负责提出建议。

**RCE 项目的计划**：项目将自行构建决策头，并在自己的门控收据上进行训练和校准。在引擎设计中，每一次门控决策都会写入收据，记录候选项、结果、违规规则以及 `est_j`，因此校准数据无需额外标注。提供给决策头的状态是 Form 的规范化 JSON 及其追踪信息，天然体积小，这直接解决了已记录的填充状态弱点。决策头充当提议者。任何决策模型，无论是托管还是本地，由项目或他人构建，都仅提供建议；它永不接受 Form，RCE 的安全性从不依赖于该模型。

<div id="data" class="anchor-alias" aria-hidden="true"></div>

### 数据

V-JEPA 2 对非常大的被动预训练与一个小的动作条件集合 [B1]。RCE 类比有四个层级。

| 层级 | 来源 | 大小目标 | 训练方式 |
| --- | --- | --- | --- |
| 被动：形式与痕迹 | 从已固定的公共语料库中提升的形式，依据 RCE 论文（第 6 节）在代码公开后提升；来自该论文生态系统协议的种子生成器的形式（第 2.3 节），以及每个被提升的处理器 | $10^5$ 到 $10^6$ 形式带痕迹 | 形式编码器，通过在潜在空间中预测掩码规则和掩码痕迹段 |
| 配对：意图与适配 | 附加到提升程序的测试和合约；形式自身的痕迹作为自生成规范；预注册的棕地应用；以形式编写的基准规范 | $10^4$ 对开始 | 意图编码器和提议器 |
| 决策收据 | 每一次门控决策 | 无上限，无标注成本 | 决策头的校准 |
| 硬负例 | 需要更改的裁决，带有命名的破坏规则；模型提出的等价但门未接受的等价（在 RCE 论文第 5.5 节的模型-提议者运行公开记录中，18 个提议中 15 个，12 种不同改写） | 随每次运行增长 | 对比信号：有效对无效，有等价对无等价 |

近似重复的 Form 在任何拆分之前通过形状哈希去除，保留集的拆分也基于形状哈希，而非表面文本。第一个语料库已存在：Form 语料库第 1 版（2026 年 10 月 23 日）包含来自公共仓库（第 4 版，2026 年 10 月 24 日）的 192 种不同手写程序形状，其中 55 种带有意图块，负例 3,456 条（343 条需要更改的符合性程序，每条都有其诊断码，以及 3,113 条检查器验证的突变体，包含空白标记和类型信息，需要跨 31 种诊断码进行更改），配有数据集卡和基于形状哈希的拆分；其生成器位于仓库中的 `scripts/corpus.py`，数据行位于 [research.openie.dev/data/](/data/#rce-jepa)。这是配对和硬负例层级中最小的规模；被动层级（提升的程序）为空，直至提升流水线公开。在此基础上，H1 有首次测量，已在运行前预注册：185 个程序的 rho = b(code)/b(P) 中位数为 9.34，相对于生成的 Python（四分位距 8.45 到 10.81；第 1 版在 173 个程序上为 9.31，Rust 为 17.33，JavaScript 为 11.06，Scala 为 13.66），高于阈值 5；前 173 个程序中有 171 个超过 5（Wilson 95% 区间 0.96 到 1.00）。在压缩描述长度（gzip）下，Python 的比率为 3.57，Rust 为 5.73，随后在主要指标旁报告，以免将该数值误解为信息内容的声明：H1 关注的是提案者搜索的空间，即其词汇表下的 token 数量。生成的源代码是参考检查器自身的，排除共享运行时，且在人口中不存在提升或模型编写的程序。在 Apple M5 Max 上，提交 `1762fb4b`，H2 现在在操作系统/芯片 `reported_j` 中测量：`rce check` 对每个 Form 检查的中位耗时为 `7.32 ms`，能耗为 `0.04904 J`（内核 `ri_energy_nj`），相较于本地 `Qwen 3.6 35B-A3B` 上每个候选的 `84.25 J`（`C_check / E_model = 0.000582 <= 0.05`；详情见下文第 8 节）。以及意图块带来的收益测量，RJ-F2 和 H7 均基于此：在会改变程序行为的突变体中，其自身示例行捕获了 392 中的 317 条（0.81，Wilson 95% 区间 0.77 到 0.85；54 个程序中有 24 个捕获全部），未捕获的更改几乎全部是一个常量被移动了一位，而没有任何示例对其进行练习。

<div id="training" class="anchor-alias" aria-hidden="true"></div>

### 训练简述

- **编码器目标。** 潜在预测加 SIGReg，即 LeJEPA 的配方，只需一个权衡超参数且不需要停止梯度或师生方案 [B2, abstract]，以及 LeWorldModel，它通过两个损失项端到端训练 [B13, abstract]。同一系列工作给出两点警示：LeWorldModel 的作者将各向同性高斯目标标记为低内在维度环境中的可能限制 [B13, Sec. 4.2 and Sec. 6]，并将对比逆动力学提出为一种分布无关的替代方案 [B14]，然而该方案仅在连续控制上评估，并且在离散状态变化相似的组合拼图任务上明显逊于 SIGReg [B14, Appendix D]；此外 SIGReg 和 VISReg “并不保证学习到的潜在表征保留规划所需的所有关键信息” [B15, Sec. 4.1]。两条路径并行运行，配有辅助头部预测 Form 的精确、低成本属性（单调标签、燃料上限、规则计数）。
- **多步预测。** 使用 k 步递归预测进行训练在 EB-JEPA 消融实验中显著提升效果，因其降低了曝光偏差，Pareto 最优点约在 k = 4 附近 [B16, Fig. 3]；RoboJEPA 将自回归训练 rollout 从 K = 2 提升至 K = 10 步的长时程冷却，仅在大规模计算（约 10<sup>21</sup> FLOPs 以上）时才显现收益 [B17, Sec. 3.3 and App. C.2]；与规划器时域匹配的 rollout 一致性项来源于 Temporal-Distance JEPA [B18, abstract]。
- **单调能量。** 单调成本排序使得偏离达成目标轨迹的计划代价更高；若缺少此项，成本曲面的局部最小值可能导致规划器产生次优计划 [B19]。单调性并非任务所保证：EB-JEPA 导航任务是非单调的，因为最佳路径首先远离目标 [B16]。这里它是预注册的诊断 (H11)，而非假设。
- **提议者。** 在配对层级的意图、Form 与编辑三元组上进行监督学习，然后在其自身通过门控接受的轨迹上进一步改进：门控即奖励。
- **永不直接解码潜在。** MoRAE 报告在冻结的 JEPA 潜在空间中直接生成运动“失败得非常明显”，并将失败归因于潜在谱的病态条件以及小的潜在误差在解码后被放大为大幅伪影 [B20, abstract and Sec. 3]。提议者输出的是已类型化的编辑；潜在用于排序，而非渲染。

<div id="convergence" class="anchor-alias" aria-hidden="true"></div>

### 收敛：各部分的已有基础

没有任何单独的 RCE-JEPA 部件是全新 的。每个部件都有已有的归属，下面列出的是收敛关系，而非优先级。尚未测量的是整体系统，这正是假设所针对的对象。

| 部件 | 存在位置 | 建立的内容 | 与 RCE-JEPA 的区别 |
| --- | --- | --- | --- |
| 预测紧凑计划，然后解码程序 | Latent Programmer [B21] | 从规范预测离散潜在码，然后生成程序；字符串转换准确率提升 5 到 7 点（相对提升超过 10%），相较最佳基线；在从文档字符串生成 Python 代码的 BLEU 也更高 [B21, Sec. 5.1 and 5.3] | 开放目标语言，无规范形式，无检查器 |
| 学习执行，而非仅文本 | LaSynth [B22]; Code World Model (CWM) [B23]; analysis of CWMs [B24] | 潜在执行在受限 C 域中提升合成；CWM 在来自 Python 解释器和 Docker 环境的观察-动作轨迹上进行中期训练 | 动力学被学习；在 RCE 中它们是精确的 |
| 等价类作为学习目标 | EqNet, Allamanis et al. [B25] | 在等价类上训练的符号表达式的连续表示 | 表达式，而非完整程序 |
| 代理提出，求解器验证 | Agentic model checking [B26]; verified synthesis for concept design driven by a large language model (LLM) [B27]; AlphaProof, Clover, AutoVerus (Section 3 below) | “Agents propose, solvers verify” 被阐述为原则；针对 Alloy 不变式以及正负场景的 CEGIS 风格合成（反例引导归纳合成） | 提议者生成 token；无潜在规划，无能量计量 |
| JEPA 作为潜在推理器 | JEPA-Reasoner [B28] | 潜在推理与 token 生成解耦 | 文本领域 |
| 执行前预测成本 | Compiler world models [B29] | 一个转移模型在潜在空间中展开调度动作以预测终态表示，排序器利用该表示在更少硬件测量之前对候选进行排序；该分数是工作负载内部的排名，而非校准成本 [B29, Sec. 3.2 and Sec. 6] | 仅张量程序调度 |
| 离散潜在 | Discrete-JEPA [B3]; discrete world models via regularization [B4]; SC-JEPA [B5] | 离散 token 能保持长期符号预测的稳定性 [B3]；在无重建的情况下学习布尔潜在（规划留待未来工作）[B4]；软码本瓶颈，配合 EMA 教师和重建锚点，以稳定一步潜在预测，而非长期展开 [B5] | 合成图像、拼图、时间序列；而非程序 |
| 稳定的 JEPA 训练 | LeJEPA [B2]; LeWorldModel [B13] | 无 collapse 的训练，不使用 stop-gradient、教师网络或超参数调度器；仍采用标准学习率预热和余弦调度 [B2, abstract and Sec. 6.1]；不使用 stop-gradient、EMA 或预训练编码器，采用两项损失 [B13, Sec. 3.1] | 可作为目标函数复用；仅在图像 [B2] 和像素 [B13] 上验证，未在程序数据上测试 |
| 小型校准决策模型 | Laya [B9]; Kev [B10]; Liquid AI open d1 [B11]; benchmark [B7] | 带有每个选项概率的类型化答案。Kev 在每个检查点提供已拟合的温度 [B10]；Laya 提供过度自信的答案（平均 ECE 0.466），仅在进行每种类型的温度重新拟合后达到 0.081 [B9]。延迟：在 T4 GPU 上 Laya 每个问题约 33 到 40 毫秒，在 H100 上 Kev 对六个问题为 18.1 毫秒，但在 CPU 或 Mac 上为数百毫秒（Laya 在 CPU 上 193 到 464 毫秒，Kev-4B 在 M5 Mac 上 721 毫秒）[B9, B10]；d1-3B 在 Jetson AGX Thor 上每个问题 16 毫秒，在 Jetson Orin Nano 上 50 毫秒 [B11]；一位托管成员独立对校准进行基准测试 [B7] | 没有世界模型；在 RCE-JEPA 中，决策头是多个提议者之一 |
| 基于追踪训练的提议者 | Code World Model [B23], Section 3 below | 在 Python 执行追踪和代理轨迹上进行中期训练。SWE-bench 验证的 pass@1 为 53.9% 基线，使用最多 16 次采样时为 65.8%，如报告所述 | 动力学被学习。在 Form 中转移是精确的。作者将追踪预测称为“第一步” |
| 评估器门控的进化搜索 | AlphaEvolve (Novikov et al., Section 3 below) | 模型提出编辑。自动评估器决定。这里使用的核心示例是 4×4 复数矩阵乘法，需 48 次标量乘法 | 在存在评估器的情况下有效。该报告未使用 Form 商 |
| 采样时的约束 | Type-constrained decoding (Mündler et al., the Swiss Federal Institute of Technology Zurich and the University of California, Berkeley, Section 3 below) | 在 HumanEval 上编译错误下降 75.3%，在 MBPP 上下降 52.1%。仅语法错误：9.0% 和 4.9% | TypeScript 规模。类型并非完整的接受规则 |
| 规范到已验证代码 | Vericoding (Bursuc et al., Section 3 below) | 12,504 条规范。成功率为 Dafny 82.2%，Verus 44.2%，Lean 26.8%。摘要将这些比例四舍五入为 82%、44% 和 27% | 规范仍需编写。自然语言描述贡献有限 |

<div id="specification-cost" class="anchor-alias" aria-hidden="true"></div>

### 规范成本的命名

检查器保证 Form 有效；但它并不保证该 Form 是所期望的。在经验证的 LLM 驱动的概念设计合成中，仅使用不变式的合成“快速达到了已验证的设计，但往往在不同运行之间产生不一致的设计”，这表明“仅靠不变式会对设计任务约束不足”；情景引导的合成比自然语言提示更一致地恢复了预期设计，尽管最小情景可能出现过拟合 [B27, abstract]，在 3 种应用和 12 种变体以及一种 LLM 配置下 [B27, Sec. 5]。主要的失败“不是有界验证的失败，而是规范覆盖的失败” [B27, Sec. 5.6]。在 seL4 中，抽象规范大约耗时 4 人月，证明大约耗时 20 人年（Klein 等，2009，下面第 2 节）。封闭的程序世界使接受变得精确且搜索可解。它将意图的不确定性转移到 $\sigma(I)$；并未消除不确定性。下面的反例生成器 RJ-F2 将该成本公开并可度量。

<div id="h11-h13" class="anchor-alias" aria-hidden="true"></div>

### 提议器假设

提案者通过 H11（单调能量）、H12（决策头校准）和 H13（离散对抗连续潜变量）进行测试，并根据确定性梯形的残差（H14、H15）进行评分。所有十五个假设 H1 至 H15 按数值顺序列出，并在下文第 8 节的同一表格中给出阈值，遵循相同的约定：在运行前预注册，冻结引擎提交并记录二进制哈希，对每个臂使用相同的门。

H3 控制现在已固定：使用相同的门和相同的成本核算，Qwen2.5-Coder-1.5B 提出表面码，该臂已在 RCE 论文（第 5.5 节）中运行，其中该门未接受 18 个提议等价中的 15 个，仅接受了一个不同的重写规则，而该规则已在引擎中存在。

<div id="falsifiers-moved" class="anchor-alias" aria-hidden="true"></div>

**反驳者。** 对前提本身的反驳者 RJ-F1 至 RJ-F6 现在紧随它们所检验的假设，直接位于 [第 8 节以下的表格](#falsifiers)之后。

<div id="risks" class="anchor-alias" aria-hidden="true"></div>

### 风险与缓解措施

| 风险 | 证据 | 缓解措施 |
| --- | --- | --- |
| 解码潜在向量会放大微小错误 | 在冻结的 JEPA 潜在空间中直接生成运动时表现极差，原因在于光谱条件不良和解码器放大 [B20] | 永不解码潜在向量；提议者输出已标记的编辑，门控检查这些编辑 |
| 表征未收敛却学习了错误的内容 | SIGReg 下的 “物理表征懒惰” [B15] | 辅助的精确属性头；逆动力学正则化器 |
| 各向同性先验不匹配低维 Form 空间 | [B13]; [B14] | SIGReg 与对比逆动力学臂并列使用，需记住逆动力学臂在离散谜题状态上较弱 [B14] |
| 能量项不具可比性 | [T2, Sec. 1.3] | 为每个实验拟合 $\alpha,\beta,\gamma$ 并公开发布 |
| 决策头在填充状态下退化 | 类的已记录弱点 [B8, B12] | 仅输入规范的 Form JSON 并进行追踪 |
| 表达能力上限 | Rice 定理 [T3]; 受限语言 | 提升覆盖率即为度量；RJ-F1 为否定者 |
| 规范成本占主导 | seL4 工作量（下文第 2 节）；不变约束不足 [B27] | RJ-F2；捕获运行程序追踪并推断合约的工具，作为独立交付物 |
| 基准预言机弱点 | PatchDiff（Wang、Pradel 与 Liu，第 3 节）：7.8% 被计为正确的补丁在开发者测试中失败，解决率被高估约 6.4 点。METR 对 2025 年初工具的试验（Becker 等，第 3 节）：16 位开发者，246 项任务，测得完成时间高出 19%。预测值低 24%。事后估计低 20% | 接受即为门控加回放，而非测试套件。第 8 节 (H15) 强制 `rce check` 加上对每个候选的义务保持 |
| 学习的规划延迟 | V-JEPA 2 模型预测控制每个动作约耗时 16 秒 [B1] | 在 Form 上搜索并使用精确检查器（Apple M5 Max 上 `7.32 ms` / `49.04 mJ`）以及 Gear-0 晶体化（每次查找 `0.325 µs` / `1.77 µJ`）以限制重复 rollout |

分阶段试点计划从数据引擎到收敛，针对每一阶段设定预注册和退出标准，随项目工作笔记保存并在此概述：Phase 0 构建提升语料库和接收数据集，并测量 H14 的确定性阶梯，该阶段无需学习型提议者；Phase 1 训练 Form 编码器并测试 H1、H5 与 H11；Phase 2 构建并校准决策头 (H12)；Phase 3 训练专用 JEPA 提议者和规划器以满足令牌控制 (H3、H4、H10、H13)，扩展第 8 节报告的首个单次离线 H15 基线；Phase 4 将芯片上 `reported_j` (H2) 扩展至外部墙表计 `measured_j` (H8、H9)；Phase 5 运行收敛协议，其中 Gear-0 提升使模型在每个闭合形状上脱离循环。与 Phase 0 同时进行的是 vericoding 基准的一个切片（来源 C34，列于下文“通过承诺实现收敛”），选取其在 Dafny、Verus 与 Lean 中的状态机形任务，将其提升为 Forms 并在 RCE 门控下与已发布的 vericoding 结果一起评分，作为从规范到 Form 步骤的外部基准 (H6、H7 与 H8)。

<div id="proposer-references" class="anchor-alias" aria-hidden="true"></div>

### 提议者参考文献

标有 [T] 的参考文献列于下文的论文参考文献部分；对第 2、3 和 5 节的引用指向本页下文各节。标签遵循下文主要参考文献的惯例。此处 **Full** 表示已通读全文，包括参考文献和附录；对于 B9 和 B10，在 2026 年 10 月 14 日阅读了实时模型卡和 README。

1. [B1] M. Assran et al., "V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning", 2025. [arXiv:2506.09985](https://arxiv.org/abs/2506.09985). Full.
2. [B2] R. Balestriero and Y. LeCun, "LeJEPA: Provable and Scalable Self-Supervised Learning Without the Heuristics", 2025. [arXiv:2511.08544](https://arxiv.org/abs/2511.08544). Full.
3. [B3] J. Baek et al., "Discrete JEPA: Learning Discrete Token Representations without Reconstruction", 2025. [arXiv:2506.14373](https://arxiv.org/abs/2506.14373). Full.
4. [B4] D. Bizzaro and L. Serafini, "Discrete World Models via Regularization", 2026. [arXiv:2603.01748](https://arxiv.org/abs/2603.01748). Full.
5. [B5] Y. He et al., "SC-JEPA: Stabilizing Latent Predictive Learning for Time-Series Anomaly Prediction", 2026. [arXiv:2602.04643](https://arxiv.org/abs/2602.04643). Full.
6. [B6] M. Fu et al., "LeWAM: End-to-End World and Action Modeling with JEPAs", 2026. [arXiv:2610.12818](https://arxiv.org/abs/2610.12818). Full.
7. [B7] T. Deußer, L. Sparrenberg and R. Sifa, "Evaluating and Benchmarking the System One Model Jev", 2026. [arXiv:2609.37647](https://arxiv.org/abs/2609.37647). Full.
8. [B8] W. Wu, "Jev vs Laya: Comparing and Choosing Between Closed-Source and Open-Source System One Decision Models", 23 September 2026. [wilsonwu.me](https://wilsonwu.me/en/blog/2026/jev-vs-laya/). Full.
9. [B9] Nandakishor M (Convai Innovations), Laya model card. [Hugging Face](https://huggingface.co/convaiinnovations/laya). Full (read live 14 October 2026).
10. [B10] J. Palmer, Kev. [GitHub](https://github.com/jaredpalmer/kev). Full (README, read live 14 October 2026).
11. [B11] Liquid AI, "Open d1: Edge decision models for text, vision, and audio", 7 October 2026. [liquid.ai](https://www.liquid.ai/blog/d1-open). Full.
12. [B12] Sanity, "Decision model" (glossary). [sanity.io](https://www.sanity.io/glossary/decision-model). Full.
13. [B13] L. Maes, Q. Le Lidec, D. Scieur, Y. LeCun and R. Balestriero, "LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels", 2026. [arXiv:2603.19312](https://arxiv.org/abs/2603.19312). Full.
14. [B14] J. Boylan and C. Hokamp, "No Gaussian Required: Contrastive Inverse Dynamics for JEPA World Models", 2026. [arXiv:2608.17542](https://arxiv.org/abs/2608.17542). Full.
15. [B15] P. Zhu et al., "Spectral-Target Physical Latent Structuring for JEPA-Style World Models", 2026. [arXiv:2609.04264](https://arxiv.org/abs/2609.04264). Full.
16. [B16] B. Terver et al., "A Lightweight Library for Energy-Based Joint-Embedding Predictive Architectures", 2026. [arXiv:2602.03604](https://arxiv.org/abs/2602.03604). Full.
17. [B17] A. Zholus et al., "RoboJEPA: Scaling Robotic Latent World Models", 2026. [arXiv:2610.10515](https://arxiv.org/abs/2610.10515). Full.
18. [B18] J. Bai and J. Xiong, "Temporal-Distance JEPA: Plan-Aware Representation Learning for Latent World Model Predictive Control", 2026. [arXiv:2607.25337](https://arxiv.org/abs/2607.25337). Full.
19. [B19] A. Chahe, S. Cai and L. Zhou, "Latent World Models with Monotone Planning Costs for Image-Goal Navigation", 2026. [arXiv:2608.09073](https://arxiv.org/abs/2608.09073). Full.
20. [B20] Y. Zhu et al., "MoRAE: Flow-Friendly Self-Supervised Latents for Text-to-Motion Generation", 2026. [arXiv:2607.29180](https://arxiv.org/abs/2607.29180). Full.
21. [B21] J. Hong, D. Dohan, R. Singh, C. Sutton and M. Zaheer, "Latent Programmer: Discrete Latent Codes for Program Synthesis", ICML 2021. [PMLR PDF](https://proceedings.mlr.press/v139/hong21a/hong21a.pdf). Full.
22. [B22] X. Chen, D. Song and Y. Tian, "Latent Execution for Neural Program Synthesis", NeurIPS 2021. [arXiv:2107.00101](https://arxiv.org/abs/2107.00101). Full.
23. [B23] Meta FAIR CodeGen Team, "CWM: An Open-Weights LLM for Research on Code Generation with World Models", 2025. [arXiv:2510.02387](https://arxiv.org/abs/2510.02387). Full.
24. [B24] B. Rahmani, "Debugging Code World Models", 2026. [arXiv:2602.07672](https://arxiv.org/abs/2602.07672). Full.
25. [B25] M. Allamanis, P. Chanthirasegaran, P. Kohli and C. Sutton, "Learning Continuous Semantic Representations of Symbolic Expressions", ICML 2017. [arXiv:1611.01423](https://arxiv.org/abs/1611.01423). Full.
26. [B26] Y. Sun, J. Liu, D. Kroening and J. Xue, "Agentic Model Checking", 2026. [arXiv:2605.21434](https://arxiv.org/abs/2605.21434). Full.
27. [B27] A. Cunha, "Verified LLM-Driven Synthesis for Concept Design", 2026. [arXiv:2607.15718](https://arxiv.org/abs/2607.15718). Full.
28. [B28] B. K. Liu, Z. P. Chen and D. P. Woodruff, "JEPA-Reasoner: Decoupling Latent Reasoning from Token Generation", 2025. [arXiv:2512.19171](https://arxiv.org/abs/2512.19171). Full.
29. [B29] H. Pan et al., "Toward Compiler World Models: Learning Latent Dynamics for Efficient Tensor Program Search", 2026. [arXiv:2606.09312](https://arxiv.org/abs/2606.09312). Full.
30. [B30] Open Interface Engineering, "Exact-proposer ladder: registered run", openIE-dev/openie-research-experiments, `rce/bench/ladder/exact-proposers/`: registration committed before the run at `3030469d`, results at `70a0a776` (pull request #21); ladder openIE-dev/rce `6d04a096`. [GitHub](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/exact-proposers). Full.
31. [B31] Open Interface Engineering, "Exact-proposer ladder on real defects: registered run", openIE-dev/openie-research-experiments, `rce/bench/ladder/real-defects/`: registration committed before the run at `64e70389`, results at `00e3b005` (pull request #22); ladder openIE-dev/rce `7dc4eded`. [GitHub](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/real-defects). Full.
32. [B32] Open Interface Engineering, "Exact-proposer ladder with renames: registered run", openIE-dev/openie-research-experiments, `rce/bench/ladder/rung-e/`: registration committed before the run at `be5f370d`, results at `3a5227c2`, merged at `f76ba9d8` (pull request #23); ladder openIE-dev/rce `8a5d90ea`. [GitHub](https://github.com/openIE-dev/openie-research-experiments/tree/f76ba9d8d02d57b773afbf105333417d55f72e2c/rce/bench/ladder/rung-e). Full.
33. [B33] Open Interface Engineering, "RCE-JEPA H2, single-shot H15, and Shape D (DNULLMM1) Gear-0 on the 40 open residual tasks", registered 22 November 2026 (`rce-jepa-h15-and-shape-d-gear0-2026-11-22`, `sha256: b64c4c671ae85755...`) on `openIE-dev/rce` at commit `1762fb4b` (20 November 2026, binary `sha256: 1d3b0d07ff5b2e8f...`), Apple M5 Max dual-channel `reported_j` receipts (`measured_j = None`, `board_metered = false`). [research.openie.dev/data/](/data/#rce-jepa). Full.
34. [B34] Open Interface Engineering, "FormJEPA-v1 latent Form repair proposer, 3-Gear Cascade, and rce repair rung f criterion evaluation on the 151-task ladder and 40 residual tasks", registered 22 November 2026 (`rce-jepa-form-jepa-v1-2026-11-22`, `sha256: 22682e6e936ec120...`; `rce-repair-rung-f-wave3-eval-2026-11-22`, `sha256: 04aff4b2b44cdbea...`) on `openIE-dev/rce` at commit `1762fb4b` (Linux x86_64 binary `sha256: 5ef9931ff23a310f...`), AMD Ryzen AI Max+ 395 Linux powercap RAPL `reported_j` receipts (`measured_j = None`, `board_metered = false`). [research.openie.dev/data/](/data/#rce-jepa). Full.
35. [B35] Open Interface Engineering, "FormEBM-v2 contrastive multi-step margin latent energy scorer (H5, H11) and H15-Iterative bounded checker-feedback residual closure (40/40) with DNULLMM1 Gear-0 v2 crystallization", registered 23 November 2026 (`rce-jepa-form-ebm-v2-2026-11-23`, `sha256: 128f17e69361ea89...`; `rce-jepa-h15-iterative-2026-11-23`, `sha256: a7774d3bd03ae450...`) on `openIE-dev/rce` at commit `1762fb4b` (Linux x86_64 binary `sha256: 331464496009d98a...`), AMD Ryzen AI Max+ 395 / Radeon 8060S Linux powercap RAPL `reported_j` receipts (`measured_j = None`, `board_metered = false`). [research.openie.dev/living/rce-jepa/](/living/rce-jepa/) · [research.openie.dev/data/](/data/#rce-jepa). Full.
36. [B36] Open Interface Engineering, "FormEBM-v3 span-normalized two-head decomposed contrastive energy scorer (H5, H11, and zero-shot OOD H15 cross-span transfer)", registered 23 November 2026 (`rce-jepa-form-ebm-v3-2026-11-23`, `sha256: cb7ee1ac8dc5c594...`) on `openIE-dev/rce` at commit `1762fb4b` (Linux x86_64 binary `sha256: 386be0c26389550e...`; checkpoint `sha256: 71e642f1bb0b9c06...`), AMD Ryzen AI Max+ 395 / Radeon 8060S Linux powercap RAPL `reported_j` receipts (`measured_j = None`, `board_metered = false`). [research.openie.dev/living/rce-jepa/](/living/rce-jepa/) · [research.openie.dev/data/](/data/#rce-jepa). Full.

<div id="thesis" class="anchor-alias" aria-hidden="true"></div>

## 论点：软件构建处于「编码法则」确立之前

试想 1660 年代的欧洲。开普勒已在《新天文学》（1609）中发表了行星运动的两条规律，又在《世界的和谐》（1619）中发表了第三条 [T4]。伽利略与惠更斯从关于运动的假设中推导出了可检验的结论 [T5, Sec. 1]。炮手、磨坊工匠与造船工匠凭经验法则和漫长的学徒生涯从事建造。天空已被极为细心地观测了两千年，然而预测仍是一片拼凑之作。据乔治·史密斯记述，牛顿"熟悉计算行星轨道的七种不同方法，精度大致相当"，而计算所得的位置"有时偏差多达月球视直径的四分之一" [T5, Sec. 2]。当时有许多精良的星表，却没有任何一套理论能说明这些星表为何有效。

1687 年，《自然哲学的数学原理》问世。寥寥数条运动公理加上一个平方反比力，由此便可预先计算轨迹，在铸造炮管之前估算成本，而误差所指向的是新天体，而非运气不佳。史密斯总结了这一变革：《原理》之后，"物理理论在回答关于世界的具体问题时获得了凌驾于观测之上的首要地位" [T5, Sec. 1]。伽利略关于匀强重力的结果并未消失，而是成为平方反比引力的一个极限情形，该理论进而解释了行星偏离开普勒定律的种种偏差 [T5, Secs. 1 and 2]。

用平常话说，其前提是：**软件构造实践（包括当今大语言模型辅助编程）处于"编程定律"诞生之前的阶段。** 此处"软件构造实践"指从业者与系统，即人类开发者与代码生成模型，他们依靠经验性的试验、测试与审查来产出代码，而非从形式规则集推导得出。这一实践今日仍停留在17世纪60年代的水平。它具备细致的观察：pass@k（k个采样程序中至少一个通过测试的概率），用于下文第4节；以及SWE-bench Verified（一个经过审查的代码仓库问题集），用于下文第3节。它具备工艺技巧：提示词措辞、重试机制与反复试错。代码生成模型的输出是概率分布的采样结果，因此同一请求明天可能产生不同的程序；当ChatGPT（默认温度下的gpt-3.5-turbo）被问及同一编程问题五次时，在三个数据集中有47.56%至75.76%的问题不存在任何一个测试使五次回答的输出完全相同，且"将温度设为0并不能保证代码生成的确定性"（Ouyang et al., 2023，摘要）。实践中人类一侧所呈现的规律性，用Lehman的话说，是那些"源于人员与组织的习惯与实践"的规律 [T6, Sec. V-A, p. 1069]。Hoare及其同事于1987年指出了同样的缺口："那么，为软件工程专业提供形式基础的编程定律究竟是什么？许多程序员可能连一条定律都无法引述" [T7, p. 673]。Dijkstra早已标明了该实践至今仍依赖的经验方法的局限："程序测试可以是发现缺陷存在的有效手段，但对于证明缺陷不存在则完全无能为力" [T8, Argument three]。程序没有公认的守恒量，代码生成器也不遵循任何运动方程，成本是在事后以词元数和电能来度量的，而非在工作开始前计算得出。

"编程定律"命名的是工艺层，其定义与下文另外三个层次一并给出。RCE-JEPA提案作为猜想在此陈述：该工艺可以获得一小组规则，借助其下各层的成果，在代码运行之前即可计算出所产出代码的行为与成本。候选规则为：(L1) 确定性转换规则，(L2) 每次转换的信息与能量核算，(L3) 每个程序的规范形式（即压缩），以及(L4) 一条组合规则，使L1至L3在程序合并时得以保持。[Reality Code Engine (RCE)](/about/rce/) 为每项候选规则提出了具体方案；假设H1至H15是相应的检验，按数字顺序列于下文第8节的一张表中。本节中凡未附数字与来源的内容，均非实测结果。

该类比存在局限性，现陈述如下。牛顿描述的是一个无人设计的世界；程序则由人编写，因此其规则在一定程度上是被选择的，而非被发现的。力学涉及连续量与严格的能量守恒；程序的状态是离散且有限的，芯片所消耗的能量取决于硬件，而不仅仅取决于程序本身。Rice 定理 [T3] 表明，不存在通用过程能够判定任意程序所计算内容的任何非平凡性质，而停机问题 [T9] 是其中最广为人知的情形；RCE 仅通过在一种受限语言中工作来规避上述限制，该语言的程序携带终止界，而这一限制在可表达性方面是有代价的。最后，即便是《*自然哲学的数学原理*》本身也并非"钟表宇宙"：Smith 指出，该方面"由拉普拉斯所添加" [T5, Sec. 1]；单凭运动公理并不能解决力学中的所有问题，因为对于非质点的物体，这些公理"必须辅以进一步的原理" [T5, Sec. 5]；而且"牛顿理论现在被认为仅在有限条件下以高度近似的方式成立" [T5, Sec. 1]。这一主张是类比，而非等价。

<div id="not-yet" class="anchor-alias" aria-hidden="true"></div>

### 从理论到实践的四个法则层次

四个短语很容易混淆，本页将其严格区分。每个短语对应不同的层次，从理论到科学再到艺术依次排列，且各自在当今的形式化程度上有所不同。本文中这四个短语绝不互换使用。

![A spectrum from theory to art with four separate layers: "Laws of Computation", "Laws of Programming Languages", "Laws of Programming" and "Laws of Coding", each with its question, its representative work and how formalized it is today, and RCE-JEPA drawn as a bridge across the layers rather than a merger](/figures/rce-jepa/layers.svg)

*图 3. 该谱系。从左至右依次为："Laws of Computation"（理论）、"Laws of Programming Languages"与"Laws of Programming"（科学）、"Laws of Coding"（艺术）。每个层次下方的条形图表示其当今的形式化程度，这是一种定性判断，详见下表说明。RCE-JEPA 被绘制为一座在各层之间传递证据的桥梁，而非将各层合并。本图为定性示意图，非数据图。*

| 层次 | 定义 | 研究者 | 当今形式化程度 |
| --- | --- | --- | --- |
| "Laws of Computation" | 物理与信息极限：什么是可计算的，以及在信息、时间和能量方面的代价。 | Shannon [T10]；Landauer [T11]；Bennett 与 Landauer [T12, T13]；Turing [T9] 与 Rice [T3]；Lloyd [T14]；Wolpert [T15]；Carette、James 与 Sabry [T16]。 | 极限方面存在精确定理：以比特计量的信息量、擦除下界 $k_BT\ln 2$、不可判定性。目前尚无统一理论能预测给定程序在给定机器上的代价；Bennett 与 Landauer 指出，其极限"与现代技术的实际极限相距甚远"[T13, 第 48 页]。 |
| "Laws of Programming Languages" | 语义学与类型理论：确定某语言中程序含义的规则。 | Hoare 的公理语义 [T17]；Milner [T18]；Harel [T19]；Lamport [T20]；Berry 与 Gonthier [T21]；Halbwachs 等 [T22]；Leroy 的验证编译器与 Letouzey 的提取（见下文第 1 节）。 | 对于部分语言和编译器已完全形式化，并在 CompCert 中经过机器验证（见下文第 1 节）。形式化语义是语言被设计时所具备的属性，并非每种语言都具备。 |
| "Laws of Programming" | 正确程序构造的代数定律：用于对程序进行变换并从规约推导程序的等式。 | Hoare、Hayes、He、Morgan、Roscoe、Sanders、Sorensen、Spivey 与 Sufrin [T7]；Dijkstra 的程序推导方法与 Bird 的列表演算（见下文第 1 节）。 | 针对一种小型语言已整理出近百条定律 [T7]；据作者自述，"距离了解如何将其直接应用于现代技术所要求规模的正确高效程序设计，仍有很长的路要走"[T7, 第 686 页]。 |
| "Laws of Coding" | 由人或模型生成可运行代码的经验性技艺。这是当今 AI 编程所处的层次。 | Brooks [T23]；Lehman [T6]；Hindle 等 [T24]；下文第 3 节中的各项报告。 | 仅有经验性规律与基准测试，尚无定律。AI 编程工具的输出为采样结果，因此同一请求可能产生不同的程序（Ouyang 等，2023，见上文引用）。 |

**RCE-JEPA 与各层次的关系。** RCE-JEPA 是一座桥梁，而非一次融合。它工作于"编码定律"层，其中学习模型负责提出代码，并将每个提案与其下方各层相连：Form 具有固定含义（"编程语言定律"），已接受的 Form 可依据既定规则进行变换（"编程定律"），其代价须对照物理极限加以核算（"计算定律"）；RCE 目前以整数单位计量该代价，而非焦耳。下文每条假设均注明其所检验的层次。若此桥梁成立，则这门技艺将获得借鉴自科学与理论的规则，而各层次仍保持独立。

力学有其《自然哲学的数学原理》，计算科学尚无。上文所列"计算定律"的各组成部分是精确的，但它们尚未被整合为一套能够同时预测行为与代价的正式体系，正如《原理》将开普勒与伽利略的规律统一起来那样。这是一个悬而未决的开放问题，而非已解决的问题。

这一空白并非前人的失败。每个时代都在其机器、信息理论以及构建与优化程序的技艺所允许的范围内尽其所能。下方时间线说明了每个时代所拥有的条件，数据来自所引文献，并呈现了各时代的成就。

![从 1940 年代至今分为五个时代的时间线，每个时代包含三条轨道：硬件、信息理论，以及用于构建和优化算法的应用计算机科学，展示了来源注明的硬件数据与里程碑成果，以"计算定律"这一开放问题作为结尾](/figures/rce-jepa/eras.svg)

*图 4. 通往"计算定律"之路上的五个时代。上轨道：硬件，数据来自下表所列文献。中轨道：信息理论。下轨道：用于开发和优化算法的应用计算机科学（编译器、复杂性理论、综合、验证）。右侧方框为开放问题：统一的"计算定律"。本图为历史示意图，非实测数据。*

| 时代 | 硬件（存储、运算、能耗） | 信息论 | 算法应用计算机科学 | 所实现的可能性及其局限所在 |
| --- | --- | --- | --- | --- |
| 1940s 至 1950s | 单副本机器，其内存"通常过小"，运行速度"通常过慢"[T8]。在 IBM 704 上，一个包含 47 条语句的 FORTRAN（公式翻译）程序编译需"六分钟，生成约 1000 条指令"[T25, PDF p. 2]。 | Shannon（1948）将信息化为可度量的量："通信的基本问题在于在某一点精确或近似地再现在另一点所选取的消息"[T10, Introduction, p. 1]。 | 首批优化编译器[T25]。 | 从公式到机器码的翻译实现了自动化。每条指令与每个内存字都弥足珍贵，因此工作重心在于将程序压缩进机器，正如 Dijkstra 所回忆的那样[T8]。 |
| 1960s | IBM System/360（1964）的四种型号在内存容量上相差 16 倍，在性能上相差 50 倍，却共享同一指令集[T26]。 | Landauer（1961）将信息擦除与热量相关联[T11]；Solomonoff、Kolmogorov 与 Chaitin 将复杂性定义为最短描述长度[T27, T28, T29]。 | Hoare 提出用于程序正确性证明的公理化基础（1969）[T17]。 | 正确性与信息在理论层面获得了精确定义。Dijkstra（1972）指出：随着"可用机器的能力增长逾千倍，社会应用这些机器的雄心也随之同步膨胀"[T8]，软件危机随之而来。 |
| 1970s 至 1980s | Alto（1973）：具有 4,096 个 32 位字的可写控制存储器；VAX-11/780（1977）：具有 5,120 个 96 位字的控制存储器；Moore 于 1975 年预测晶体管密度每两年翻倍[T26]。 | Bennett（1973）证明通用计算机"可在每一步均实现逻辑可逆，同时保持其简洁性及执行通用计算的能力"[T30, abstract, p. 525]；Bennett 与 Landauer（1985）阐明了物理极限[T13]。 | Brooks（1986）将本质复杂性与偶然复杂性加以区分[T23]；Hoare 与八位合著者为一种编程语言给出了近百条代数定律[T7]；Lehman 提出软件演化的经验规律[T6]。 | 程序成为代数对象。Hoare 等人坦承尚存的差距："我们距离知晓如何将这些定律直接应用于现代技术所要求规模的正确且高效程序的设计，仍相去甚远"[T7, p. 686]。 |
| 1990s 至 2000s | 指令级并行与更快的晶体管使性能在 1986 年至约 2002 年间每年增长约 50% [T26]。 | Lloyd（2000）以能量为界约束每秒运算次数 [T14]。 | McKee（1995）提出计算的基本定律 [T31]；机器验证的编译器与内核，即 CompCert 与 seL4（见下文第 1 节）。 | 证明已触达真实系统，但代价高昂：seL4 的证明耗费约 20 人年（见下文第 1 节）。 |
| 2010s 至今 | Dennard 缩放"至 2012 年几乎归零"；一次 32 千字节缓存访问的能耗约为 32 位加法的 200 倍，片外 DRAM（动态随机存取存储器）的能耗约为末级缓存访问的 10 倍；谷歌 TPU（张量处理单元）v1 每周期执行 256 x 256 次乘累加运算，配备 24 兆字节本地存储器，在其工作负载上的能效是 CPU 的 80 倍以上 [T26]。一个拥有 650 亿参数的语言模型每输出一个词元约消耗 3 至 4 焦耳（Samsi 等，见下文第 4 节）。 | Wolpert 的计算随机热力学 [T15]；预测被证明等价于语言模型的压缩 [T32]；Carette、James 与 Sabry 基于信息守恒重建计算模型 [T16]。 | 学习型代码生成器；模型加验证器循环；确定性仿真测试（持此观点者见下文）。 | 在提议者廉价且充裕的情况下，验证既廉价又精确。针对硬件重写的 Python 矩阵乘法运行速度"提升逾 62,000 倍" [T26]：程序与其机器之间的距离如今已相当巨大，可被度量，且值得弥合。 |

**为何进展在当下成为可能（观点，待检验）。** 有三项条件从未同时具备，而今日均已实现。面向真实系统的机器验证工具已然存在，因此规则可被强制执行，而非仅凭期望。学习型模型能够批量提出候选程序，数量可达数千之多，从而使寻找满足规则之程序的搜索代价变得可承受。此外，能耗数据可直接从普通硬件的计数器中读取，因此成本可与预测相互印证，而非依赖猜测。此前的每个时代，上述三项条件中至少有一项付之阙如。这一切并不使"计算定律"的出现成为必然；而是使其变得可检验，这正是以下各假说的目的所在。

<div id="symbols-used-in-this-section" class="anchor-alias" aria-hidden="true"></div>

### 本节使用的符号

- $P=(S,E,\delta,D,\lambda)$：将程序视为函数式状态机。$S$ 为有限状态集；$E$ 为有限事件集（输入）；$\delta: S\times E\to S$ 为转移函数；$D$ 为推导集，即由纯函数从某一状态计算所得的值；$\lambda: S\times E\to O$ 为映射至有限输出集 $O$ 的输出函数。
- $\Omega_n$：规模至多为 $n$ 个符号的规范形式集合。形式（Form）是程序在 RCE 中经检查器验证的规范表示（第 8 节）。
- $X$：表层程序集合（即人或模型所编写的文本）。$\kappa: X\to\Omega$：从表层程序到形式的规范化映射。
- $H(\cdot)$：以比特为单位的香农熵 [T10]。$K(x)$：柯尔莫哥洛夫复杂度，即在固定通用机器上输出 $x$ 的最短程序的比特长度 [T27, T28]。
- $k_B=1.380649\times10^{-23}\ \mathrm{J\,K^{-1}}$：玻尔兹曼常数。$T$：以开尔文（K）为单位的温度。J：焦耳。
- JEPA：联合嵌入预测架构 [LeCun 2022，同上引]。MDL：最小描述长度 [T33]。EBM：基于能量的模型。

<div id="part-1-computation-as-a-finite-information-system" class="anchor-alias" aria-hidden="true"></div>

### 第 1 部分. 作为有限信息系统的计算

将一个程序剥去其语法、注释、缩进以及作者的编码习惯，剩下的便是一台从一个状态迁移到下一个状态、每次处理一个事件的机器。该机器是有限的，而有限之物可以被计数。

**定义。** 程序是一个确定性函数状态机 $P=(S,E,\delta,D,\lambda)$，其中 $S$ 与 $E$ 有限，$\delta$ 为全函数。确定性意味着 $\delta$ 是一个函数而非关系：一个状态与一个事件恰好给出唯一的下一个状态。

**信息量上界。** 若某一 Form 由任意分布从 $\Omega_n$ 中抽取，其熵至多等于均匀分布的熵：对于 $n$ 种等可能结果，"当所有 p<sub>i</sub> 相等时，H 取最大值且等于 log n" [T10, Sec. 6, property 2, p. 11]：

$$H(P)\;\le\;\log_2\lvert\Omega_n\rvert\ \text{bits}.$$

对于含 $a$ 个符号的字母表，$\lvert\Omega_n\rvert\le\sum_{k\le n}a^k$，故 $H(P)\le n\log_2 a+1$ 比特。每一个 Form，无论其行为序列多长，都是一条有限消息。

**压缩与理解。** Kolmogorov 复杂度 $K(x)$ [T27, T28] 度量一个对象的最短描述长度。Kolmogorov 将对象 y 在给定 x 条件下的"相对复杂度"定义为"从 x 生成 y 的'程序' p 的最小长度 l(p)" [T28, Sec. 3, p. 165]；Solomonoff 归纳法 [T27] 与 Rissanen 的最小描述长度准则 [T33] 将"偏好最短描述"转化为预测与模型选择的规则。连接学习的桥梁是 Shannon 的信源编码定理 [T10, Sec. 9, Theorem 9, p. 16]：一个好的编码对 $x$ 大约花费 $-\log_2 p(x)$ 比特（Shannon 的第二种证明为概率为 $p_s$ 的消息赋予长度为 $m_s$ 的二进制编码，满足 $\log_2(1/p_s)\le m_s<1+\log_2(1/p_s)$ [T10, Sec. 9, p. 17]），因此更好的预测器即是更好的压缩器。Delétang 等人直接指出："最大化（数据的）log2 似然等价于最小化每条消息所需的比特数" [T32, Sec. 1]。$K$ 本身不可计算：Kolmogorov 已指出，条件复杂度"即便已知对所有 x 和 y 均有限，也无法被有效计算（一般递归意义下）" [T28, Sec. 3, p. 165]；Schmidhuber 亦指出"不存在找到计算任意给定数据的最短程序的通用方法" [T34, Sec. 1]。在具有规范 Form 的受限语言中，Form 的长度是 $K$ 在加性常数意义下的一个可计算上界。

<div id="part-2-compression-into-form-and-template" class="anchor-alias" aria-hidden="true"></div>

### 第 2 部分. 压缩为形式与模板

**等价类。** 定义 $x\sim y \iff \kappa(x)=\kappa(y)$。每个形式 $f\in\Omega$ 是类 $[f]=\kappa^{-1}(f)$ 的代表元，该类包含 $m_f=\lvert[f]\rvert$ 个表层程序。由于 $\kappa$ 是一个函数，熵的链式法则 $H(x,y)=H(x)+H_x(y)$ [T10, Sec. 6, property 5, p. 12] 给出

$$H(X)\;=\;H(\kappa(X))\;+\;H\big(X\mid\kappa(X)\big).$$

输出形式而非表层文本的预测器无需承担第二项的代价。若同一类中各表层变体出现概率相等，则每个形式所节省的量为

$$\Delta H_f=\log_2 m_f\ \text{bits},\qquad \rho_f=\frac{\lvert x\rvert}{\lvert f\rvert}\quad(\text{bytes of surface code per byte of Form}).$$

这正是预测器在商空间 $X/\!\sim\;\cong\;\Omega$ 上工作的原因：它学习一个更小、更简洁的目标，且其中每个点都是检验器能够判断的对象。

**模板作为低维流形。** 模板或无代码模式是带有空洞的形式。若一个模板有 $h$ 个空洞，每个空洞可取 $v$ 个值之一，则它覆盖 $v^h$ 个形式，并由 $h\log_2 v$ 位寻址，通常远少于 $\log_2\lvert\Omega_n\rvert$。程序空间极为广阔，而人们实际需要的程序仅分布在其中的薄层之上。这是一个猜想，与以下观察相符：代码比自然语言更具可预测性 [T24]，且在已学习的代码嵌入中，"语义相似的对象被映射到相近的向量" [T35, Sec. 1]。

**语料库测量。** H1 对手写程序总体给出了一个已发布的下界。在 185 个程序上，$\rho$ = b(code)/b(P) 相对于生成的 Python 代码的中位数为 9.34，高于阈值 5。该运行在测量之前已完成注册。上述提案的数据部分给出了四分位距、173 个程序上版本 1 的数值 9.31，以及压缩描述检验。提升语料库上的节省量 $\Delta H$ 仍在计划之中，该语料库在提升流水线公开之前将保持为空。9.34 这一数值是针对手写程序的实测下界，并非对提升程序或模型生成程序的测量结果。

---

让一百位程序员编写一个购物车程序，你将得到一百个程序。在这一百个程序之下，或许只有三四种思路。表层是一片众声喧哗，而形式是它们共同呈现的面孔。

<div id="part-3-kinematics-a-newtonian-form-of-computing" class="anchor-alias" aria-hidden="true"></div>

### 第 3 部分. 运动学：计算的牛顿形式

扔出一块石头，已知其起始位置、速度以及所受外力，牛顿定律便能告诉你它落在何处。确定性程序具有同样的性质，且更为严格：没有空气，没有风，没有对世界的舍入。给定起始状态和到达的事件，其整个未来便已固定。

**轨迹。** 对于初始状态 $s_0$ 和事件流 $e_0,e_1,\dots,e_{T-1}$，

$$s_{t+1}=\delta(s_t,e_t),\qquad t=0,\dots,T-1.$$

此处提出的对应关系，作为类比：

- 状态 $s_t$ 扮演位置的角色；
- 事件 $e_t$ 扮演施加冲量的角色；
- $\delta$ 扮演运动方程的角色；
- 事件日志是一份记录，可从中精确重放轨迹，这是记录层面的可逆性，即便 $\delta$ 会丢弃信息；Bennett 指出，"只要允许计算保存其输入的副本，任何确定性计算均可被重新编程为一系列逻辑可逆步骤" [T12]；
- 步骤计数或燃料 $t$ 扮演时间的角色；
- 每次转换的能量（单位：焦耳）是代价。

**能量下限。** Landauer 论证道，逻辑不可逆性"与物理不可逆性相关联，每个机器周期需要最小热量产生，对于每个不可逆函数，通常约为 kT 量级" [T11, 摘要, 第 183 页]；重置一个比特使熵减少 k log<sub>e</sub> 2，从而"向环境提供每个恢复比特 0.6931 kT" [T11, 第 4 节, 第 187 页]。Landauer 原理，如 Bennett 后来所重述，认为逻辑不可逆操作（如擦除）"必须伴随着环境中相应的熵增" [T12, 摘要]。每个被擦除比特的下限为

$$E_{\min}=k_B T\ln 2\approx 2.87\times10^{-21}\ \mathrm{J}\quad\text{at } T=300\ \mathrm{K}.$$

若转换 $t$ 擦除 $b_t$ 个比特，则 $E_{\text{total}}\ge k_B T\ln 2\sum_t b_t$。Lloyd 补充了速度的上限："物理设备处理信息的速度受其能量限制" [T14, 摘要]，对于能量 $E$，每秒最多执行 $2E/\pi\hbar$ 次操作，其中 $\hbar=1.0546\times10^{-34}\ \mathrm{J\,s}$ 为约化普朗克常数。实际芯片每次操作的能耗比 Landauer 下限高出许多个数量级；RCE 项目在撰写本文时尚无实测的每操作焦耳数，H9（下文第 8 节）为计划中的测量项目。Kolmogorov 于 1965 年指出了缺失的代价维度：其复杂性度量"未考虑为从对象 x 过渡到对象 y 而准备程序 p 的'难度'" [T28, 第 4 节, 第 167 页]。Wolpert 引用 Boyd 的话，提出警示："同一计算（从输入到输出）的不同实现可能具有截然不同的热力学后果" [T15, 第 I.B 节]：能量属于程序与机器的共同属性。

**定义（运动学程序）。** $P$ 是运动学的，若对每个 $s_0$ 及每个有限事件流，

$$\text{(i)}\ \operatorname{Var}[s_T]=0,\qquad \text{(ii)}\ E_{\text{total}}=\sum_{t=0}^{T-1}c(s_t,e_t)\ \le\ c_{\max}\,F$$

其中 $c: S\times E\to\mathbb{R}_{\ge0}$ 为某特定机器的以焦耳为单位的代价表，$c_{\max}$ 为其最大条目，$F$ 为终止性证明给出的燃料上界（最大步数）。条件 (i) 表明轨迹方差为零；条件 (ii) 表明其代价可在运行前计算得出，或至少可被有界估计。RCE 规范附录 C.6.4 中的代价表采用整数单位，而非焦耳；以焦耳每单位表示某特定机器代价的表格目前作为提案存于规范仓库中，H9 即为相应测试。

**对比。** 随机生成器从参数为 $\theta$ 的模型中返回样本 $x\sim p_\theta(x\mid\text{prompt})$。其输出为一个分布，其正确性为一个概率，其代价仅在采样后方可知晓。RCE-JEPA 保留了生成器的随机性，但使其所生成的对象具有运动学确定性，并在二者之间引入一个确定性检验器。

<div id="part-4-a-world-model-whose-physics-is-known-exactly" class="anchor-alias" aria-hidden="true"></div>

### 第 4 部分. 物理规律精确已知的世界模型

大多数世界模型是在迷雾中构建的。机器人从模糊的摄像头中学习物理规律；游戏智能体推断它无法读取的规则。代码是规则被明确写下的罕见领域。

**世界模型。** 在 JEPA 的意义上 [LeCun 2022，见上引]，世界模型是一个预测器 $\hat z_{t+1}=g_\phi(z_t,a_t)$，从当前潜在表示 $z_{t+1}=\mathrm{enc}(s_{t+1})$ 和动作 $a_t$ 预测下一个潜在表示，具有可学习参数 $\phi$。对于代码而言，世界即 Form 的状态空间，动作即事件，因此目标由 $\delta$ 精确计算：

$$\mathcal{L}(\phi)=\mathbb{E}\,\big\lVert g_\phi\big(\mathrm{enc}(s_t),e_t\big)-\mathrm{enc}\big(\delta(s_t,e_t)\big)\big\rVert^2 .$$

目标中不存在偶然性（不可约）噪声。MuZero 从以下观察出发：前瞻规划算法"均依赖对环境动态的了解，例如游戏规则或精确的模拟器"，并转而学习一个模型 [T1，第 1 节]；对于代码，这些规则即 $\delta$，可完整获取。

**与学习物理规律的模型的对比。** CWM（代码世界模型）[B23] 是一个在 Python 执行轨迹和智能体轨迹上进行中间训练的解码器。该报告中的轨迹预测是一个已学习的解释器，作者将其称为"第一步"，并将神经调试器留作未来工作。V-JEPA 2 [B1] 从视频中学习物理规律，据报告摘要包含 62 小时的机器人视频，其动作条件预测器使用的无标注机器人视频不足 62 小时。其模型预测控制每个动作耗时约 16 秒。在 Form 中，$\delta$ 即物理规律，且是精确的，因此不存在需要拟合的偶然性噪声。提议器仍需学习的内容在下文第 7 节中阐述：意图到 Form 的映射、搜索引导，以及梯形结构未能闭合的残差。

**意图解码作为逆问题。** 给定以约束形式表述的意图 $I$，找到一个轨迹满足该意图的 Form。这被写成能量最小化问题，采用基于能量的模型的意义 [T36，T2]：

$$\mathcal{E}(I,f)=\alpha\,V(f)+\beta\,d\big(\tau(f),\sigma(I)\big)+\gamma\,C(f),\qquad z^\star=\arg\min_{z}\ \mathcal{E}\big(I,\mathrm{dec}(z)\big).$$

其中 $V(f)$ 为检查器违规次数（无量纲）；$\tau(f)$ 为 $f$ 在意图示例事件上的轨迹集合；$\sigma(I)$ 为意图所要求的轨迹；$d$ 为两者之间的距离（不匹配状态的无量纲计数）；$C(f)$ 为每次运行的预测能量，单位为焦耳；$\alpha,\beta\ge0$ 为无量纲权重，$\gamma\ge0$ 的单位为 $\mathrm{J}^{-1}$；$\mathrm{dec}$ 为从潜在点到 Form 的解码器。最小化结果被解码后接受检查；由检查器而非 $\mathcal{E}$ 决定是否接受。Du 与 Mordatch 指出："两个或多个能量的求和对应于满足其所有目标或约束" [T36，第 1 节]，这正是三项可以相加的原因。LeCun 等人补充了一项警示："将两个分别训练的基于能量的模型进行组合并不简单：无法先验地保证其能量尺度是可通约的" [T2，第 1.3 节，第 6 页]。因此，权重 $\alpha,\beta,\gamma$ 必须经过标定，而非直接假定，其值随每个实验一并报告。

<div id="part-5-consequences-as-testable-predictions" class="anchor-alias" aria-hidden="true"></div>

### 第 5 部分. 作为可检验预测的推论

一个无法被证伪的论题不是真正的论题。上述每个部分均对应一项可将其推翻的检验。

- 第 1 部分与 T2（压缩为形式）由 H1、H3 和 H10 检验。
- 第 3 部分（运动学、能量核算）由 H2、H4、H8 和 H9 检验。
- 第 4 部分（世界模型、逆问题）由 H5 至 H7 检验。
- 提议器由 H11 至 H13 检验，基于 H14 所测量的确定性阶梯的残差。H15 在该残差上比较各提议器类别，尚未完成。全部十五项假设（含度量指标与阈值）按数字顺序汇于下文第 8 节的一张表中。

![三个面板：一大片曲面程序云；箭头将其折叠到一张薄曲面的规范形式流形上，熵节省量为 log2 m 比特；状态 s0 至 s4 在转移函数 delta 下的轨迹，每步标注以焦耳为单位的能量，总量由燃料上界约束](/figures/rce-jepa/thesis.svg)

*图 5. 信息与运动学。左：程序空间，其中许多曲面程序 X 表达相同的行为。中：规范化映射 κ 将每个等价类折叠为低维流形 Ω 上的一个形式，对含 m 个等可能变体的等价类节省 ΔH = log2 m 比特。右：形式按确定性方式演化，s(t+1) = δ(s(t), e(t))，每次转移耗费 c 焦耳，执行前总量由 c_max · F 上界约束。概念示意图，非实验数据。*

<div id="chain" class="anchor-alias" aria-hidden="true"></div>

### 可证明链：假设、层次与证据

"编码定律"的主张，其可信度取决于最薄弱的环节。该表针对每条假设，指明其所检验的四层定律中的哪一层，再逐一追溯三个实现层面：算法层（Form 的数学结构与预测器）、软件环境层（检查器、语料库、测试框架）以及硬件层（机器及其计量器）。每个环节携带以下四种标签之一。**[C] 引用文献：** 已发表的结果，按账本所载内容读取。**[M] 实测数据：** 由 OpenIE 作者在运行前完成注册的某次运行中所测得的数值，其来源存于公开仓库。**[X] 已测，不支持：** 某次已注册测量的结果不支持所对应的假设。**[P] 计划实验：** 尚未执行的测试。若某环节部分已测，则同时携带 [M] 与 [P] 两个标签。如页面末尾的状态章节所述，目前有四条假设具有已测环节。H15 尚无已测环节。此四条分别为：H1（针对 Form 语料库的手写程序，即上方提案者的数据章节）、H7（仅针对其模糊测试分支）、H8（针对六个目标）以及 H14（其三次已注册运行 [B30, B31, B32] 按已注册规则支持该假设，详见下文第 8 节）。已测环节记录的是某次已注册运行的存在及其发现，其本身并不构成支持与否的裁定。该链条是将所有剩余 [P] 转化为 [M] 或 [X] 的计划，任何一个 [P] 仍有可能使其断裂。

![十四条假设 H1 至 H14 与算法、软件环境、硬件三个层面构成的网格图；每个单元格按证据类型着色，分别为：引用文献、实测数据、已测但不支持、计划实验或不适用。在软件层，H1 与 H7 同时携带实测数据与计划实验，H8 与 H14 携带实测数据；在硬件层，H8 携带引用文献与实测数据](/figures/rce-jepa/chain.svg)

*图 6. "编码定律"的可证链条。行：假设 H1 至 H14，每条均标注其所检验的定律层级。H15 未绘于图中，在下方表格中作为计划工作列出，尚无已测环节。列：实现层面，即算法、软件环境、硬件。蓝色：引用文献。绿色：实测数据。朱红色：已测，不支持。橙色：计划实验。灰色：不适用。下方表格给出每个单元格的内容及来源。*

| ID | 假设 | 测试的法律层 | 算法 | 软件环境 | 硬件 |
| --- | --- | --- | --- | --- | --- |
| H1 | Form 远小于源代码 | “编程语言定律”(规范含义)和“编码定律” | [C] 链式规则：预测 Form 可节省 $H(X\mid\kappa(X))$ 位 [T10] | [M] 中位数 $\rho$ 为 9.34，基于 185 个手写的 Form 语料库程序相对于生成的 Python，超过阈值 5，已在运行前登记（上述提案者的数据部分）。[P] $\rho$ 在提升语料库的规范序列化上，直到提升管线公开前为空 | 不适用（位计数） |
| H2 | 检查器相对于生成成本低 | “编程语言定律” | [C] 验证结果可能比证明生成器更容易：CompCert 的寄存器分配器（Leroy，以下第 4 节） | [P] 检查器每个候选的壁钟时间和周期 | [P] 在命名仪表上以焦耳计的 $C_{\text{check}}/E_{\text{model}}$ |
| H3 | 潜在预测达到有用的接受度 | “编码定律” | [C] 表征空间中的预测（I-JEPA 与 V-JEPA 2，以下第 4 节；LLM-JEPA，Huang、LeCun 与 Balestriero，以下第 5 节） | [P] 在保留的 intent-to-Form 任务上 pass@1 | 不适用 |
| H4 | 每个被接受程序的能耗下降 | “计算定律” | [C] Landauer 下限每擦除位 $k_BT\ln 2$ [T11, T12] | [P] 在单一测试平台中两臂的 $J_{\text{acc}}$ | [C] 对于 65B 模型每个 token 大约 3 到 4 J（Samsi 等）；内存访问主导算术运算 [T26]。[P] 设备仪表，减去空闲功耗 |
| H5 | 能量排序偏好有效的 Form | “编码定律” | [C] 能量相加以组合约束 [T36] | [P] 对已接受与需要更改的能量的 AUROC | 不适用 |
| H6 | 参考应用可编码 | “编程语言定律” | [C] 没有通用过程能够决定非平凡的语义属性 [T9, T3]，因此采用受限语言 | [P] 7 个参考应用全部作为已检查的 Form | [P] 在不同机器上重放相同的 Form（与 H8） |
| H7 | 安全性独立于模型 | “编程语言定律” | [C] 大约六 CPU 年后，Csmith 在 CompCert 中未发现错误代码错误（Yang 等，以下第 4 节） | [M] 模糊测试臂：在两次运行中对 1,275 个检查器接受的突变体的五个声明不变式均未违规，每次在运行前已登记（`rce/bench/adversarial/`）。[P] 模型生成的对抗 Form，尚未存在的臂 | [C] 投机执行侧信道超出指令集语义范围 [T26]；超出 Form 范畴，已声明 |
| H8 | 确定性 | “编程语言定律” and “计算定律” | [C] 任意确定性计算在给定其输入副本的情况下可以实现逻辑可逆 [T12] | [M] 对 10,500 条种子事件流进行位相同重放，未出现与参考的任何不匹配行，已在运行前登记 (`rce/bench/determinism/`) | [C] 中断在“不可预测且不可复现的时刻”到达 [T8]. [M] 同一运行在六个目标上：四种指令集 (x86_64, aarch64, s390x 大端, wasm32) 和三种操作系统 (Linux, macOS, Windows) |
| H9 | 执行前预测成本 | “计算定律” | [C] 能量限制速度 [T14]; 成本界限 $c_{\max}F$ (上述第 3 部分) | [P] 每种形式的成本表预测 | [C] 同一计算的实现其热力学成本不同 [T15]. [P] 中位误差在测得焦耳值的 20% 以内 |
| H10 | 在商上学习可节省数据 | “编码定律” | [C] 更好的预测即更好的压缩 [T32]; 最小描述长度 [T33] | [P] 在最多只有一半训练样本的情况下获得相同接受度 | [P] 对两个预测器的训练能耗均已测量 |
| H11 | 能量随编辑距离单调递增 | “编码定律” | [C] 单调成本排序使得偏离目标更远的计划成本更高 (Chahe 等, [B19] 在提议者章节) | [P] 能量随编辑距离上升的家族比例 | 不适用 |
| H12 | 决策头在门输出上校准 | “编码定律” and “计算定律” | [C] 校准的类型化决策是可测量的：对一个托管决策模型的汇总 Choice ECE 为 0.028 ([B7]) | [P] 在 10<sup>4</sup> 次接收后，每种决策类型的 ECE，基于频率表 | [P] 在指定设备上每次决策的延迟和焦耳数 |
| H13 | 离散相对于连续潜变量 | “编码定律” | [C] 在连续潜变量累计误差的情况下，离散 token 维持了长程预测的稳定性 ([B3]) | [P] 编辑长度为 1、5、20 时的规划成功率 | 不适用 |
| H14 | 确定性梯子共享 | “编码定律” | [C] 精确齿轮（查找、规则、合成）在 RCE 论文级联的任何模型之前运行，使用伪造器 RCE-F1 在它们关闭的共享上且不调用模型 | [M] 公开梯子在零模型调用下关闭的已登记任务集的比例：三次已登记运行 [B30, B31, B32]; 第 3 次运行关闭 111/151 (73.5%)，达到或超过已登记的 10%，因此 H14 由其已登记规则支持，且真实历史中 41 项变化中有 1 项改变 (2.4%) (见下文第 8 节) | 不适用 |
| H15 | 提议者类别在残差上。未完成 | “编码定律” | [P] 对 40 项残差任务的四类，能量相等，门接受度相同。未运行 | [P] 比较尚未运行 | [P] 当存在指定计量器时能量相等。未给出焦耳数值 |

<div id="who-holds" class="anchor-alias" aria-hidden="true"></div>

### 持有这些观点者及其原因

想法很少单独出现。论文的每一部分都呼应了先前的论点，这些论点出于各自的原因，由从未听说过 RCE 的人提出。它们被列为收敛观察：方向上的一致，而非对 RCE 项目主张的确认。对于 OpenIE 作者完整阅读的来源，会标注其章节并引用；对于未阅读的条目，则说明未阅读并不引用任何内容。

**那些已经持有此观点的人。** 编程和计算应拥有其自身法律的想法并非 RCE 项目首创，且早于该领域的大多数工作。此页加入了一场已持续至少四十年的讨论，并将其列为收敛，而非优先级。

- **Hoare 等人，《编程定律》（1987）。** 九位作者认为“传统的过程式程序是数学表达式，并且它们遵循一套与其他任何数学、工程或自然科学分支同样丰富且优雅的定律”[T7，第 672 页]，并列出了近百条定律。他们还指出仍然存在的空白（如上时间线所引）[T7，第 686 页]。  
- **Bennett 与 Landauer，《计算的基本物理极限》（1985）。** “我们正在寻找必须支配所有信息处理的通用定律，无论其实现方式如何”[T13，第 48 页]。他们补充了本页共享的警示：“就我们已发现的极限而言，它们离现代技术的真实极限仍相当遥远”[T13，第 48 页]。他们对可逆机器的结论是：“因此不存在必须消耗的最小能量来执行任何给定计算”[T13，第 51 页]，而擦除和错误纠正仍会耗散能量，因为正如他们所言，“任何纠正装置因此必须消耗一定能量”[T13，第 51 页]。  
- **McKee，《一些（提议的）计算基本定律》（1995）。** IEEE Computer 上的一篇短文，提出了该领域的定律[T31]。OpenIE 作者未能获得原文，故仅列出标题而未引用或概述。  
- **Carette、James 与 Sabry，《拥抱物理定律》（2022）。** 他们指出量子理论和热力学“暗示信息是物理过程乃至原始计算操作的守恒量”，并提出“重新构建基础计算模型，以拥抱信息守恒原理”[T16，摘要，PDF 第 2 页]。他们的结论概述：“整个计算机科学体系，包括其主流计算模型、编程语言和逻辑，都是建立在经典物理之上”[T16，第 5.5 节，第 45 页]。  
- **Lehman（1980）** 提出了软件演化的五条经验规律，适用于嵌入现实世界的程序[T6]。第一条“持续变化”：一个被使用且作为其规范实现的程序“反映某种其他现实”，会持续变化或逐渐失去效用[T6，表 I，第 1068 页]。他明确指出这些规律并非物理定律：“然而，它们显然不像物理和化学规律那样不可变”，因为它们“源自人和组织的习惯与实践”[T6，第 V-A 节，第 1069 页]，这与本页在“编码定律”和“计算定律”之间保持的距离相同。**Brooks** 将“本质任务：：构造组成抽象软件实体的复杂概念结构”与偶然任务区分开来[T23，PDF 第 1 页]。**Dijkstra** 观察到计算机跨越了“10<sup>10</sup> 或更高”的时间粒度比率，这使其成为“第一个为我们提供高度层次化人工制品既可能又必要的环境”[T8]。  

下面的各组分别体现了同一思想的不同分支。

**Compression as understanding (Part 1, T2).** Solomonoff、Kolmogorov 和 Chaitin 将复杂度定义为最短描述 [T27, T28, T29]；Rissanen 将其作为模型选择准则 [T33]；Hutter 的奖项、AIXI 以及 Sutskever 的演讲将其扩展到智能（此处未阅读；未引用）。Delétang 及其 DeepMind 同事认为“压缩效果好的模型泛化效果好” [T32, Sec. 1]，并展示了大语言模型能够压缩图像和音频。Schmidhuber 认为，如果宇宙的历史是可计算的，其最简解释“将是计算它的最短程序” [T34, Sec. 1]。分歧：Delétang 等人警告说“在超出某一点的规模扩展会恶化压缩性能，因为必须考虑模型参数” [T32, Sec. 1]，而 Chollet 主张“仅在给定任务上衡量技能不足以衡量智能” [T37, abstract]；固定语料库的压缩并不等同于对新技能的高效学习。

**Computation as physics (Part 3).** Landauer [T11]、Bennett [T12, T30] 和 Lloyd [T14] 认为信息处理是具有能量成本和限制的物理过程。Lloyd：“能量限制速度，熵限制记忆” [T14, Sec. 1.5]。Wolpert 的随机热力学将计算（包括有限自动机）视为非平衡物理：“计算机最突出的特性之一是它们本质上是非平衡系统” [T15, abstract]；有限自动机在第 XII 节中讨论 [T15]。Fredkin 和 Toffoli 的保守逻辑 [T38]、Feynman 的计算讲座、Wheeler 的“信息即实体”以及 Wolfram 的计算宇宙都指向同一方向（此处未阅读）。分歧：Bennett 记录了对 Landauer 原理的反对意见，认为该原理是错误的，或者作为热力学第二定律的推论，要么不必要要么不足以驱逐 Maxwell 恶魔，并对这些意见作出回应 [T12]；争论聚焦于基础而非地板大小。第二个分歧是历史性的：Landauer 写道“我们相信表现出逻辑不可逆性的装置对计算是必不可少的” [T11, Sec. 3, p. 186]，而 Bennett 1973 年的构造证明它们并非必需，代价是大约两倍的步骤数和大量的临时历史 [T30, pp. 525, 529]；随后 Bennett 估计“kT ln 2 如 Landauer 所论 [1]，仅对每步丢弃约一比特的机器是一个近似下界” [T30, p. 532]。

**状态机与确定性语义（第 1 部分，T3）。** 图灵机 [T9]、Milner 的演算 [T18]、Harel 的状态图 [T19]、Lamport 的 TLA：：将程序视为状态上行为集合的形式 [T20]、同步语言 Esterel 与 Lustre（Berry、Halbwachs）[T21, T22]、Elliott 的函数式响应式编程 [T39]、Elm 架构、FoundationDB 与 TigerBeetle 的确定性仿真测试，以及 Hoare 与 Dijkstra 将程序视为谓词的观点 [T17]，皆将程序视为具有精确定义语义的状态机。此处将其列为历史参考。FoundationDB、TigerBeetle 页面以及 Elm 指南已全文阅读，用于下文的收敛章节（其 FoundationDB、TigerBeetle 与 Elm Architecture 行）；其余文献未全文阅读，故未直接引用。限制：图灵 [T9] 与 Rice [T3] 界定了对任意程序可决定性的上限；确定性语义在封闭语言中易于陈述，却在真实硬件、线程和网络环境中难以保持。

**程序作为低维流形上的数据（第 2 部分）。** Hindle 等人发现软件“自然”，其重复性高于英语 [T24]（此处未全文阅读）。Alon 等人的 code2vec 将代码映射为向量，使“语义相似的对象映射到相近的向量” [T35, 第 1 节]。基于草图的合成（Solar-Lezama）、DreamCoder 的库学习（Ellis et al. 2021，见下文第 2 节；其补充材料将库学习描述为“自动重构” [Ellis et al. 2021, supplement S3.2, p. 39]）以及 Allamanis 对代码机器学习的综述，都指向相同的方向（Solar-Lezama 与 Allamanis 此处未阅读）。分歧：code2vec 的作者报告称“当给定无信息、混淆或对抗性的变量名时，标签的预测通常不够准确” [T35, 第 7 节]：学习到的嵌入可能追踪名称而非意义，这正是规范形式（canonical Form）试图弥合的缺口。

**世界模型与潜在预测（第 4 部分）。** LeCun 在 Meta FAIR 的 JEPA 项目（上文已引用）、Ha 与 Schmidhuber “学习环境的压缩空间和时间表征” [T40, 摘要]、MuZero [T1]、物理信息神经网络，其先验物理知识“可作为正则化因子，将可接受解的空间约束到可管理的规模” [T41, 第 1 节]，以及受模型模拟“随时间漂移至更高或更低能量状态”启发的 Hamiltonian 神经网络 [T42, 第 1 节]，皆在学习动力学中构建结构。Lagrangian 网络（Cranmer）、Dreamer（Hafner）与 Koopman 算子学习共享此目标（此处未阅读）。分歧：Ha 与 Schmidhuber 发现学习到的世界模型“会被控制器利用，即使在实际环境中不存在此类利用” [T40, 第 4.5 节]；Greydanus 等人指出其方法假设守恒量，因而无法建模摩擦 [T42, 第 3.2 节]。对于代码而言，检查器是防止利用模型错误的防护机制。

**基于能量的模型（第 4 部分）。** Hopfield [T43] 与 Hinton [T44] 将学习框定为塑造能量表面（此处不作阅读）；Du 和 Mordatch [T36] 展示了通过下降学习得到的能量实现隐式生成，LeCun（上述引用）则将能量最小化置于 JEPA 推理的核心。该领域内部的分歧在于训练稳定性和采样成本，Du 和 Mordatch 在 [T36] 中对此进行了讨论。

<div id="lane-3-views" class="anchor-alias" aria-hidden="true"></div>

### 从项目外部审视第三通道

第 3 节记录了重新构想计算、编程或编码的方案。这些是收敛观察。下面的承诺部分将相同的名称逐一映射到七个承诺上。

- **Unison。** 定义是其语法树的哈希。名称是一种视图。两个具有相同树的文本是相同的定义。这是规范形式的同一性一半。
- **egg。** e-graph 将一组等价程序作为一个结构保存（Willsey 等，下面第 3 节）。编码法则使用相同的商：许多表面程序，一个形式。
- **Interaction nets。** HVM2（Higher Order Company 的交互组合子模型）将计算视为局部重写，模型中固有并行。第 3 节引用了该模型，但未包含该论文的图示。
- **Proof assistants。** Lean、Dafny 和 Verus 将正确性设为可检查对象。vericoding 基准是第 3 节引用的测得底线。AlphaProof、DeepSeek-Prover-V2、Kimina-Prover Preview 和 Goedel-Prover 使用 Lean 内核作为入口。在此处阅读的报告中，领域是数学。
- **Elliott，denotational design。** “实例的意义是意义的实例”。语义模型定义正确性并将其传递到实现（Elliott，2009，2016 年修订）。这是一种手工学科。它与形式必须只有一种意义的要求相同。
- **Propagators。** Radul 和 Sussman（2009）将计算描述为向共享单元添加信息的自治机器，统一表达式和约束。报告为理论，附有 Scheme 实现。
- **Lean，作为工程项目。** Lean FRO（Focused Research Organization）第 1 年路线图，2023 年 8 月至 2024 年 7 月，列出标准库、模块系统、Lake 与 Reservoir、证明自动化、机器学习集成以及新代码生成器。后续年份此处未使用。
- **Chollet。** 智能即技能获取效率，使用抽象与推理语料库（ARC）作为衡量标准 [T37]。第 3 节中的 ARC 奖结果是该项目的后续测量。2019 年之后的演讲未单独引用。

![Grid mapping six research communities, compression, computation as physics, state machines, programs as data, world models and energy-based models, to thesis parts T1 to T4, with filled dots where a community's argument bears on a part](/figures/rce-jepa/groups.svg)

*图 7. 哪些社区涉及论点的哪些部分。实心点标记收敛观察，而非确认。第 1 部分：有限信息系统；T2：压缩为形式；T3：运动学与能量；T4：世界模型与逆问题。*

<div id="thesis-references" class="anchor-alias" aria-hidden="true"></div>

### 论点参考文献

账本：Full = 完全阅读; Partial = 部分阅读; Unavailable = 未阅读（付费墙或未检索），仅列出标识符且从不引用。

1. [T1] J. Schrittwieser et al., "Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model", Nature 588 (2020). [arXiv:1911.08265](https://arxiv.org/abs/1911.08265). Full.
2. [T2] Y. LeCun et al., "A tutorial on energy-based learning", 2006. [PDF](http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf). Full.
3. [T3] H. G. Rice, "Classes of recursively enumerable sets and their decision problems", Trans. AMS 74 (1953). [doi:10.1090/S0002-9947-1953-0053041-6](https://doi.org/10.1090/S0002-9947-1953-0053041-6). Unavailable.
4. [T4] M. A. Di Liscia, "Johannes Kepler", Stanford Encyclopedia of Philosophy. [plato.stanford.edu](https://plato.stanford.edu/entries/kepler/). Full.
5. [T5] G. E. Smith, "Newton's Philosophiae Naturalis Principia Mathematica", Stanford Encyclopedia of Philosophy. [plato.stanford.edu](https://plato.stanford.edu/entries/newton-principia/). Full.
6. [T6] M. M. Lehman, "Programs, life cycles, and laws of software evolution", Proceedings of the IEEE 68(9) (1980). [doi:10.1109/PROC.1980.11805](https://doi.org/10.1109/PROC.1980.11805). Full.
7. [T7] C. A. R. Hoare, I. J. Hayes, He Jifeng, C. C. Morgan, A. W. Roscoe, J. W. Sanders, I. H. Sorensen, J. M. Spivey and B. A. Sufrin, "Laws of Programming", Communications of the ACM 30(8), 672-686 (1987). [doi:10.1145/27651.27653](https://doi.org/10.1145/27651.27653); [PDF copy](https://www.cs.ox.ac.uk/bill.roscoe/publications/20.pdf). Full.
8. [T8] E. W. Dijkstra, "The Humble Programmer", ACM Turing Lecture 1972, EWD 340. [Transcription](https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/EWD340.html); [doi:10.1145/355604.361591](https://doi.org/10.1145/355604.361591). Full.
9. [T9] A. M. Turing, "On computable numbers", Proc. London Math. Soc. 42 (1936). [doi:10.1112/plms/s2-42.1.230](https://doi.org/10.1112/plms/s2-42.1.230). Unavailable.
10. [T10] C. E. Shannon, "A mathematical theory of communication", Bell System Technical Journal 27 (1948). [doi:10.1002/j.1538-7305.1948.tb01338.x](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x); [reprint](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf) (page numbers refer to this reprint). Full (all 55 pp. of the reprint, Parts I to V and Appendices 1 to 7).
11. [T11] R. Landauer, "Irreversibility and heat generation in the computing process", IBM J. Res. Dev. 5 (1961). [doi:10.1147/rd.53.0183](https://doi.org/10.1147/rd.53.0183). Full.
12. [T12] C. H. Bennett, "Notes on Landauer's principle, reversible computation, and Maxwell's Demon", 2003. [arXiv:physics/0210005](https://arxiv.org/abs/physics/0210005). Full.
13. [T13] C. H. Bennett and R. Landauer, "The Fundamental Physical Limits of Computation", Scientific American 253(1), 48-57 (1985). [doi:10.1038/scientificamerican0785-48](https://doi.org/10.1038/scientificamerican0785-48); [PDF copy](http://physics.bu.edu/~pankajm/PY541/Bennett-Landauer.pdf). Full (all text pages of the linked copy, pp. 48-56).
14. [T14] S. Lloyd, "Ultimate physical limits to computation", Nature 406 (2000). [arXiv:quant-ph/9908043](https://arxiv.org/abs/quant-ph/9908043). Full.
15. [T15] D. H. Wolpert, "The stochastic thermodynamics of computation", J. Phys. A 52 (2019). [arXiv:1905.05669](https://arxiv.org/abs/1905.05669). Full.
16. [T16] J. Carette, R. P. James and A. Sabry, "Embracing the laws of physics: Three reversible models of computation", Advances in Computers (2022). [doi:10.1016/bs.adcom.2021.11.009](https://doi.org/10.1016/bs.adcom.2021.11.009); [author copy](https://www.cas.mcmaster.ca/~carette/publications/EmbracingTheLaws.pdf). Full.
17. [T17] C. A. R. Hoare, "An axiomatic basis for computer programming", CACM 12 (1969). [doi:10.1145/363235.363259](https://doi.org/10.1145/363235.363259). Unavailable.
18. [T18] R. Milner, A Calculus of Communicating Systems, LNCS 92 (1980). [doi:10.1007/3-540-10235-3](https://doi.org/10.1007/3-540-10235-3). Unavailable.
19. [T19] D. Harel, "Statecharts: a visual formalism for complex systems", Sci. Comput. Program. 8 (1987). [doi:10.1016/0167-6423(87)90035-9](https://doi.org/10.1016/0167-6423(87)90035-9). Unavailable.
20. [T20] L. Lamport, "The temporal logic of actions", ACM TOPLAS 16 (1994). [doi:10.1145/177492.177726](https://doi.org/10.1145/177492.177726). Unavailable.
21. [T21] G. Berry and G. Gonthier, "The Esterel synchronous programming language", Sci. Comput. Program. 19 (1992). [doi:10.1016/0167-6423(92)90005-V](https://doi.org/10.1016/0167-6423(92)90005-V). Unavailable.
22. [T22] N. Halbwachs et al., "The synchronous data flow programming language LUSTRE", Proc. IEEE 79 (1991). [doi:10.1109/5.97300](https://doi.org/10.1109/5.97300). Unavailable.
23. [T23] F. P. Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering", IEEE Computer 20(4) (1987; first presented 1986). [doi:10.1109/MC.1987.1663532](https://doi.org/10.1109/MC.1987.1663532); [PDF copy](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf). Full.
24. [T24] A. Hindle et al., "On the naturalness of software", ICSE (International Conference on Software Engineering) 2012. [doi:10.1109/ICSE.2012.6227135](https://doi.org/10.1109/ICSE.2012.6227135). Unavailable.
25. [T25] J. W. Backus et al., "The FORTRAN Automatic Coding System", Western Joint Computer Conference (1957). [Computer History Museum copy](https://archive.computerhistory.org/resources/text/Fortran/102663113.05.01.acc.pdf). Full.
26. [T26] J. L. Hennessy and D. A. Patterson, "A New Golden Age for Computer Architecture", Communications of the ACM 62(2) (2019). [doi:10.1145/3282307](https://doi.org/10.1145/3282307); [CACM web text](https://cacm.acm.org/research/a-new-golden-age-for-computer-architecture/). Full.
27. [T27] R. J. Solomonoff, "A formal theory of inductive inference, Part I", Information and Control 7 (1964). [doi:10.1016/S0019-9958(64)90223-2](https://doi.org/10.1016/S0019-9958(64)90223-2). Unavailable.
28. [T28] A. N. Kolmogorov, "Three approaches to the quantitative definition of information", Problems of Information Transmission 1 (1965); English reprint, International Journal of Computer Mathematics 2 (1968), [doi:10.1080/00207166808803030](https://doi.org/10.1080/00207166808803030). Full (page numbers from the 1968 reprint).
29. [T29] G. J. Chaitin, "On the length of programs for computing finite binary sequences", J. ACM 13 (1966). [doi:10.1145/321356.321363](https://doi.org/10.1145/321356.321363). Unavailable.
30. [T30] C. H. Bennett, "Logical Reversibility of Computation", IBM J. Res. Dev. 17(6), 525-532 (1973). [doi:10.1147/rd.176.0525](https://doi.org/10.1147/rd.176.0525). Full.
31. [T31] G. McKee, "A Few (Proposed) Fundamental Laws of Computation", IEEE Computer 28(1), 120 (1995), Open Channel. No DOI located; [DBLP table of contents](https://vldb.org/dblp/db/journals/computer/computer28.html). Unavailable.
32. [T32] G. Delétang et al., "Language Modeling Is Compression", ICLR 2024. [arXiv:2309.10668](https://arxiv.org/abs/2309.10668). Full.
33. [T33] J. Rissanen, "Modeling by shortest data description", Automatica 14 (1978). [doi:10.1016/0005-1098(78)90005-5](https://doi.org/10.1016/0005-1098(78)90005-5). Unavailable.
34. [T34] J. Schmidhuber, "Driven by Compression Progress", 2009. [arXiv:0812.4360](https://arxiv.org/abs/0812.4360). Full.
35. [T35] U. Alon et al., "code2vec: Learning Distributed Representations of Code", POPL 2019. [arXiv:1803.09473](https://arxiv.org/abs/1803.09473). Full.
36. [T36] Y. Du and I. Mordatch, "Implicit Generation and Modeling with Energy-Based Models", NeurIPS 2019. [arXiv:1903.08689](https://arxiv.org/abs/1903.08689). Full.
37. [T37] F. Chollet, "On the Measure of Intelligence", 2019. [arXiv:1911.01547](https://arxiv.org/abs/1911.01547). Full.
38. [T38] E. Fredkin and T. Toffoli, "Conservative logic", Int. J. Theor. Phys. 21 (1982). [doi:10.1007/BF01857727](https://doi.org/10.1007/BF01857727). Unavailable.
39. [T39] C. Elliott and P. Hudak, "Functional reactive animation", ICFP 1997. [doi:10.1145/258948.258973](https://doi.org/10.1145/258948.258973). Unavailable.
40. [T40] D. Ha and J. Schmidhuber, "World Models", 2018. [arXiv:1803.10122](https://arxiv.org/abs/1803.10122). Full.
41. [T41] M. Raissi, P. Perdikaris and G. E. Karniadakis, "Physics Informed Deep Learning (Part I)", 2017. [arXiv:1711.10561](https://arxiv.org/abs/1711.10561). Full.
42. [T42] S. Greydanus, M. Dzamba and J. Yosinski, "Hamiltonian Neural Networks", NeurIPS 2019. [arXiv:1906.01563](https://arxiv.org/abs/1906.01563). Full.
43. [T43] J. J. Hopfield, "Neural networks and physical systems with emergent collective computational abilities", PNAS 79 (1982). [doi:10.1073/pnas.79.8.2554](https://doi.org/10.1073/pnas.79.8.2554). Unavailable.
44. [T44] G. E. Hinton, "Training products of experts by minimizing contrastive divergence", Neural Computation 14 (2002). [doi:10.1162/089976602760128018](https://doi.org/10.1162/089976602760128018). Unavailable.

<div id="convergence-commitments" class="anchor-alias" aria-hidden="true"></div>

## 以承诺实现收敛

RCE 论文基于七项承诺。每项承诺都是由不同的人独立达成的，往往不止一次，出于各自的动机。下表列出了其主要来源（论文、官方文档或代码库）已公开并与此处所写句子进行核对的项目。每一行说明了项目实现了什么，以及相对于承诺的停止位置。这些是收敛观察：方向上的一致性，而非对 RCE 主张的确认，也不构成排名。来自 OpenIE（RCE 背后的组织）的项目标记为 *same house*，且从不作为证据使用。

本节使用的缩写：RCE，Reality Code Engine；AST，抽象语法树；IR，中间表示；LLM，大型语言模型；JSON，JavaScript 对象表示法；WASM，WebAssembly；SMT，可满足性模理论（Z3 为 SMT 求解器）；DST，确定性仿真测试；CEGIS，反例引导归纳合成。

![Grid of seven commitments, canonical form, log and replay, projection, stored intent, deterministic gate, promotion and reuse, and energy or cost, against verified outside projects; a filled dot marks a commitment that the project's own primary source states](/figures/rce-jepa/convergence.svg)

*图 8. 根据每个已验证外部项目的主要来源，显示其达到的承诺。实心点表示收敛观察，而非得分；RCE 未绘制。点击图像可放大。*

<div id="cc1" class="anchor-alias" aria-hidden="true"></div>

### 1. 唯一规范形式，表层文本为视图

| 项目 | 建立的内容 | 停止的地方 |
| --- | --- | --- |
| Intentional Programming, Simonyi, 1995 [C1] | 程序是由节点组成的树，每个节点是一个意图的实例；用户编辑树并以任意记号查看；计算意图可以与实现分离 | 微软的研究系统；报告未描述确定性或重放模型（事务文件用于版本控制，但未给出重放语义） |
| Unison [C2] | 每个定义由其语法树的哈希标识；名称作为独立的元数据存储 | 哈希基于结构：行为相同但结构不同的两个定义会得到不同的哈希 |
| Equality saturation and egg [C3; C4] | e-graph 同时保存程序的许多等价版本；成本模型挑选其中一个（Tate 等人：基于静态成本模型的伪布尔求解器；egg：使用用户提供的成本函数的提取器） | 一种针对每个函数的优化与合成技术（Tate 等人为函数内部；egg 在用户定义的语言上处理项，且不内建绑定支持）；当不终止时饱和被限制，e-graph 并未作为程序的存储形式保留 |
| Tacit, 2026 [C5] | AST 为唯一真理；每个有效的 AST 对应唯一的字节精确规范文本；定义通过 BLAKE3 哈希寻址；错误代码会转化为带类型的 Hole 节点 | 单一目标（LLVM）；未声明状态机语义 |
| X07, 2026 [C6] | 规范源为 JSON AST，使用 JSON Patch 编辑；拥有 646 条诊断代码目录并强制快速修复覆盖 | 规范的字节，而非规范的行为 |
| Codifide, 2026 [C7] | 规范形式为带类型的超图，具有确定性的字节形式和 SHA-256 哈希；表层语法是其投影；意图是定义身份的一部分 | 作者将其描述为一种合同与分派语言，而非通用计算模型 |
| NAIL [C8] | `nail canonicalize` 将任意程序标准化；`nail check --strict` 拒绝非规范输入 | 受 RFC 8785 启发的 JSON 子集，作者自称不声称完全符合 RFC 8785；仅进行字节规范化 |
| EqNet, Allamanis et al., 2017 [C9] | 在已知等价类上训练神经表示，使等价表达式得到相同或高度相似的向量 | 布尔和多项式表达式（监督式），而非完整程序 |

<div id="cc2" class="anchor-alias" aria-hidden="true"></div>

### 2. 程序是日志上的确定性状态机

| 项目 | 建立的内容 | 停止的地方 |
| --- | --- | --- |
| Abstract State Machines, Gurevich, 2000 [C10] | 论文标题即结果：顺序抽象状态机捕获顺序算法 | 一个定理，而非系统：每个由三条公设（顺序时间、抽象状态、有限探索；Def. 6.1）定义的顺序算法，都存在等价的顺序抽象状态机，使其逐步匹配（主定理 6.13）。公设覆盖所有顺序算法的论证是提出的，而非证明的 |
| Event sourcing, Fowler, 2005 [C11] | “将对应用状态的所有更改捕获为事件序列” | 一种模式，作为草案发布；仅当网关记录外部查询响应并在回放期间抑制外部更新时，回放才能保持一致 |
| The Elm Architecture [C12] | Model, View, Update：状态、状态的视图以及来自消息的更新 | 单一语言和单一目标（浏览器） |
| Dedalus and the CALM theorem, Hellerstein, Alvaro et al. [C13; C14] | Dedalus：带显式时间的 Datalog，用于建模可变状态和异步消息。CALM：当且仅当程序是单调的，才存在一致的、无协调的分布式实现（由 Ameloot 等人证明；[C14] 提供了证明思路） | Dedalus 与 Bloom 为研究语言，CALM 为定理；均不向其他语言发射 |
| Durable execution: Temporal, Restate [C15; C16] | Temporal：工作流代码“必须是确定性的，以支持回放”。Restate：每一步及其结果都记录在日志中 | 回放用于弹性，而非程序身份 |
| TigerBeetle deterministic simulation testing, 2026 [C17] | 逻辑确定性（类似 FoundationDB）加上物理确定性：副本收敛到字节级相同的状态；真实代码在模拟器中运行 | 单一数据库，手工构建以遵循此纪律 |
| FoundationDB simulation testing [C18] | “在单线程进程中对整个 FoundationDB 集群进行确定性模拟”；确定性“允许对模拟运行进行完美可重复性” | 针对单一数据库的测试纪律，而非程序形式 |
| musil [C19] | 作为 Python 库的显式状态模型检查器；其 simulate 模式在带种子、可回放的模拟网络上运行真实节点代码 | 有界状态空间；检查模型，模拟发现缺陷而非证明其不存在 |
| AILANG; agent-scroll [C20; C21] | AILANG：每个构造都有确定性语义，支持可回放执行和结构化追踪。agent-scroll：规范的、字节确定的、哈希链式记录，配有验证器可捕获任何单字节更改 | AILANG 为函数式语言，不是状态机形式；agent-scroll 记录对话，而非程序 |

<div id="cc3" class="anchor-alias" aria-hidden="true"></div>

### 3. 每个目标是一种投影：一次编写，多次输出

| 项目 | 建立的内容 | 停止的层级 |
| --- | --- | --- |
| MLIR [C22] | 一个可复用的编译器基础设施，跨越抽象层次、硬件目标和领域 | 从源代码以下开始：它没有解析器生成或抽象语法树构建（第 7 节），其论文将跨可扩展方言生态系统的翻译验证列为未解决问题（第 2 节） |
| Model Driven Architecture, OMG, 2003 [C23] | 计算无关、平台无关和平台特定的视角 | Petre 报告称，来自 Forward 和 Lethbridge 的调查显示，保持模型与代码同步是最大的问题（68% 认同）[C24] |
| Protocol Buffers; Lumos [C25; C26] | 定义一次模式并在多种语言中生成绑定（Lumos：Rust 和 TypeScript 用于 Solana） | 数据形状，而非行为；同一 Protocol Buffers 消息可以有多种二进制序列化（“在未完全解析之前无法比较两个消息是否相等”） |
| Forge, 2026 [C27] | “许多前端提供一个已验证的中间表示，该表示再供给许多后端” | 板卡和外设描述，而非通用程序 |
| Faber Romanus, 2026 [C28] | 一个高级 IR 投射到 Rust、Go、TypeScript、Swift 和 Faber，并通过低级 IR 投射到 LLVM 和 WASM 文本，配合 Metal 和 CUDA 内核；支持情况按目标逐一衡量并声明 | 跨目标的一致性通过语料库覆盖率衡量，而非证明 |
| Intent, 2026 [C29] | 一个源文件编译为 Rust、JavaScript 和 WASM；合约在每个目标运行时强制执行，并可选地由 Z3 检查 | 三个目标 |
| NanoLang [C30] | 核心语义在 Coq 中证明且无公理；C 为生产目标 | PTX 和 RISC-V 为实验性；LLVM 和 WASM 为计划中目标 |

<div id="cc4" class="anchor-alias" aria-hidden="true"></div>

### 4. 存储意图，推导实现

| 项目 | 建立的内容 | 停止的地方 |
| --- | --- | --- |
| FORTRAN，Backus 等，1957；演绎合成，Manna 和 Waldinger，1980 [C31; C32] | 从公式自动生成代码；从构造性证明中提取程序 | FORTRAN 成为编译器；演绎合成当时没有实现 |
| 规范驱动开发，Böckeler 分类 [C33] | 三个层次：spec-first、spec-anchored 和 spec-as-source，其中“只有规范由人编辑，人从不接触代码”；在 Kiro、spec-kit 和 Tessl 中，只有 Tessl 探索 spec-as-source | 规范是自然语言，Böckeler 看到从同一规范重复生成的代码不同；没有检查代码是否等同于规范 |
| Vericoding 基准，2025 [C34] | 12,504 条 Dafny、Verus 和 Lean 的形式规范；至少一种九种现成 LLM，每种尝试五次，分别解决了 82%（Dafny）、44%（Verus）和 27%（Lean）的任务，最佳单模型达到了 67.5%、30.9% 和 17.9%（表 3）；在测试的一个子集（Verina，157 任务；第 4.1 节）中加入自然语言描述未产生统计显著的提升 | 规范语言即证明语言；没有运行时形式或多目标输出；在成功案例中约 9% 的规范过于薄弱，未能捕获意图（第 4 节） |
| Codifide [C7] | 每个定义都携带编译永不丢弃的意图 | 合约与分派范围 |

**推荐。** Vericoding 基准 [C34] 被用作从规范到 Form 的外部基准：其状态机形状的 Dafny、Verus 和 Lean 规范的一个切片被提升为 Forms，并在 RCE 门接受的共享旁边报告了相应的结果，以对比已发布的 vericoding 结果。

<div id="cc5" class="anchor-alias" aria-hidden="true"></div>

### 5. 模型提议，确定性门控决定

| 项目 | 所建立的内容 | 停止的地方 |
| --- | --- | --- |
| CompCert; seL4 [C35; C36] | 机器检查的编译器和内核；CompCert 用已验证的检查器验证未验证启发式的输出；seL4 的证明耗时约 20 人年 | 每件工件的证明工作量 |
| Sketching, Solar-Lezama 等, 2006（后被称为 CEGIS 的反例驱动循环）[C37] | 针对人工编写的部分程序（草图）和可执行规范，合成器提出候选，检查器返回反例，循环重复 | 提出者是 SAT 求解器，而非学习模型；仅限于有限程序（输入有界、保证终止），且只对有界实例提供保证 |
| AlphaProof; Clover; AutoVerus [C38; C39; C40] | 模型提出；Lean、Dafny 或 Verus 检查 | 对证明或代码文本设门限；没有规范的程序形式 |
| Agentic model checking, 2026; LLM 驱动的概念设计验证合成, 2026 [C41; C42] | “代理提出，求解器验证”（LLM 仍负责对反例进行现实性筛选）；在第二种情况下，仅凭不变式约束设计，运行多次会得到不同的设计，其中一些不合理 | [C41] 使用 LLM 推断的规范验证现有代码；检查有界（默认展开 4）且相对规范，作者将导致“静默漏掉错误”的过弱规范称为主要失效模式。[C42] 为设计模型（非代码）合成协同规则，仅在有界 Alloy 范围内检查，LLM 将设计翻译为 Alloy。两者均警告有效性不等同于意图 |
| Vera, 2026; Vow; Thermite [C43; C44; C45] | Vera：强制合同，由 Z3 SMT 求解器在可判定时证明，否则在运行时检查：“模型不必正确，只需可检查”。Vow：通过 ESBMC 有界模型检查静态验证合同。Thermite：合同在失败时提供反例并记录保证等级（Verus/Z3、Lean、Kani 有界、运行时） | 在函数处设门限；没有重放或提升 |
| Decision models, a class of concept [C46] | 整个输出为类型化答案的模型（从封闭集合中选一项、有限分数或是/否概率），每个选项都有概率，经过校准训练 | 需要封闭的选项集合。RCE 项目自行构建决策头部，未使用外部决策模型 |

<div id="cc6" class="anchor-alias" aria-hidden="true"></div>

### 6. 已接受的工作被晋级并复用

| 项目 | 建立内容 | 停止位置 |
| --- | --- | --- |
| Gödel machine, Schmidhuber; Löbian obstacle, Yudkowsky and Herreshoff [C47; C48] | 仅在获得证明后才进行自我重写，证明依据其自身公理，表明重写的效用高于继续搜索；在直接形式化中，基于证明的代理无法信任使用其自身证明系统的后继（Löb 定理），因此信任随每次重写而下降，论文的技术变通仅是部分的 | 理论 |
| Voyager; STOP; Darwin Gödel Machine; AlphaEvolve [C49; C50; C51; C52] | 不断扩展的可执行技能库；能够自我改进的支架（模型权重保持不变）；自我修改代理的存档（仅在仍能编译并可编辑代码时保留；父代由基准分数选择）；在自动评估器下进化的代码 | 通过分数或评估器进行选择，而非在接口处通过证明。Voyager 的评估器是 GPT-4 批评者；AlphaEvolve 的分数可能包含 LLM 评分反馈，其正确性来源于构造、随机测试或循环外的人为与验证审查 |
| Getafix; Sorald; TBar [C53; C54; C55] | 从过去的修复中挖掘或作为模板编写的修复模式，在没有模型的情况下复用于新案例；在完美的错误定位下，TBar 正确修复了 395 个 Defects4J 缺陷中的 74 个（对 101 个提供了合理补丁），并在标准错误定位下修复了 43 个 | 模式针对每个缺陷类别，针对一种语言学习或编写（Getafix 的方法本身与语言无关）；Getafix 仅通过重新运行静态分析器检查其最高排名的修复 |

<div id="cc7" class="anchor-alias" aria-hidden="true"></div>

### 7. 能耗或成本是目标

| 项目 | 建立内容 | 止于 |
| --- | --- | --- |
| Landauer, 1961; Bennett, 1973 [C56; C57] | 擦除比特存在热力学下限；计算原则上可以实现逻辑可逆 | 物理学，而非软件目标 |
| FrugalGPT, 2023 [C58] | 一系列模型的级联在其任务上匹配最佳单模型，同时成本降低最高 98% | 美元成本；模型下不存在确定性层级 |
| Cost-of-pass, 2025; AI Agents That Matter, 2024 [C59; C60] | 正确解的预期货币成本；报告并与准确率共同优化成本 | 美元和 token，而非焦耳；Cost-of-Pass 作者指出能量可替代美元但未进行测量 |
| Compiler world models, 2026 [C61] | 在潜在空间中通过调度动作推进张量程序状态，然后在工作负载内对候选调度进行排序，随后在硬件上测量（相对得分，而非延迟预测） | 仅限张量调度（TVM AutoScheduler）；对候选进行排序，不生成调度 |
| Codifide [C7] | 通过声明的成本在满足条件的候选中进行选择 | 声明的成本，而非测量的能量 |
| JouleOS (OpenIE) [same house] | 能量预算以及 `est_j`, `reported_j`, `measured_j` 标签 | 同机构：列出以作披露，而非作为证据 |

<div id="cc-lanes" class="anchor-alias" aria-hidden="true"></div>

### 四项承诺如何与后续通道衔接

第 3 节记录了三条通道。图 8 保持不变。此处的注释是已在表中出现的来源的收敛读数，加上通道报告，而非得分。

- **一种规范形式。** Unison [C2] 通过其语法树的哈希标识定义，名称是一个视图。egg [C4] 将等价程序存储为一个 e-graph。两者都将结构，而非表面文本，视为对象。
- **模型提出，确定性门决定。** AlphaEvolve [C52] 和 AlphaProof [C38] 是混合实例，连同 vericoding 基准 [C34]。第 3 节加入了 Lean 证明器 DeepSeek-Prover-V2、Kimina-Prover Preview 和 Goedel-Prover，其中 Lean 内核充当门，类型约束解码则在模型采样时由类型系统发挥作用。
- **提升与复用。** DreamCoder（Ellis 等，下面第 2 节）通过压缩学习库。LILO（Grand 等，下面第 3 节）将大语言模型与符号重构配对。库是这些系统中的复用步骤。它们报告的领域规模较小。
- **成本。** 在 CWM 报告中，测试时 16 次采样的最佳结果将 SWE-bench Verified 的 pass@1 从 53.9% 提升至 65.8% [B23]。这是一项针对单一基准的计算成本，而非焦耳测量。Mercury 报告在 H100 上的吞吐量分别为 1,109 和 737 token/秒（Inception Labs，下面第 3 节）。吞吐量不是焦耳。本页仍将成本视为电能，若有仪表读数则减去空闲功耗，且不将这些数值转换为焦耳。

<div id="cc-rce" class="anchor-alias" aria-hidden="true"></div>

### RCE 论文的陈述（OpenIE 自身工作）

以下内容摘自 [the RCE paper](/papers/rce/)（修订版 df38742，2026 年 11 月 6 日）。它们在此列为项目自身的工作，而非与上述项目的比较。

- **Canonical form.** 规范序列化在 Form 上是单射的，因此两个不同的 Form 会产生不同的形状哈希。行为等价性另行定义（适配等价），在引擎设计中等价变体通过 e-graph 中的声学重写进行分组；论文并未声称等价行为必然产生唯一的规范形式。
- **Proofs.** 在 Lean 4 上对核心演算证明了确定性、全局性、将日志重放为折叠以及保留步骤的原子性（不应用的事件保持状态）。Rust 程序发射器在核心上被证明为向 MiniRust 的验证翻译，MiniRust 是所发射 Rust 子集的深度嵌入；Rust 编译器实现 MiniRust 的部分被信任并经过测试。此证明覆盖程序发射器，而不涉及 Form 投影。
- **Gate.** 在引擎设计中，候选项需通过已记录输入的重放、带覆盖界限的影子运行、输出模式检查以及 Kani 证明证书；提出的重写还需 Z3 证明。在一次公开记录的运行中，一个本地 15 亿参数模型提出了 18 条建议，其中 13 条是不同的；门控未接受 15 条，接受的 3 条实际上是同一重写的三个名称，重复了引擎已有的规则。
- **Energy.** 在引擎设计中，每个收据都携带 `est_j`；未定价的模型调用绝不会被读取为零。`measured_j`（墙表计）在迄今所有结果中均为空。

<div id="cc-refs" class="anchor-alias" aria-hidden="true"></div>

### 本节来源

标签如账本所示：Full = 已完整阅读整个原始来源（论文、文档页面、README 或项目描述），包括其中的参考文献和附录（如有）。此处列出的每个来源均已在 2026 年 10 月 14 日或之前完整阅读；[C46] 指向决策标题部分列出的来源。

1. [C1] C. Simonyi, "The Death of Computer Languages, the Birth of Intentional Programming", Microsoft Research MSR-TR-95-52, September 1995. [Microsoft Research](https://www.microsoft.com/en-us/research/publication/the-death-of-computer-languages-the-birth-of-intentional-programming/); [PDF copy](https://uni.r-brause.de/seminare/SemSS07/simonyi95death.pdf). Full.
2. [C2] Unison, "The big idea". [unison-lang.org](https://www.unison-lang.org/docs/the-big-idea/). Full.
3. [C3] R. Tate, M. Stepp, Z. Tatlock and S. Lerner, "Equality Saturation: A New Approach to Optimization", Logical Methods in Computer Science 7(1:10), 2011 (extended version of POPL 2009). [arXiv:1012.1802](https://arxiv.org/abs/1012.1802). Full.
4. [C4] M. Willsey, C. Nandi, Y. R. Wang, O. Flatt, Z. Tatlock and P. Panchekha, "egg: Fast and Extensible Equality Saturation", POPL 2021. [arXiv:2004.03082](https://arxiv.org/abs/2004.03082). Full.
5. [C5] Tacit. [github.com/weetster/tacit](https://github.com/weetster/tacit). Full (README).
6. [C6] X07. [github.com/x07lang/x07](https://github.com/x07lang/x07). Full (README).
7. [C7] Codifide. [github.com/codifide/codifide-programming-language](https://github.com/codifide/codifide-programming-language). Full (README).
8. [C8] NAIL. [pypi.org/project/nail-lang](https://pypi.org/project/nail-lang/). Full (project description).
9. [C9] M. Allamanis, P. Chanthirasegaran, P. Kohli and C. Sutton, "Learning Continuous Semantic Representations of Symbolic Expressions", ICML 2017 (PMLR 70). [arXiv:1611.01423](https://arxiv.org/abs/1611.01423). Full.
10. [C10] Y. Gurevich, "Sequential Abstract State Machines Capture Sequential Algorithms", ACM TOCL 1(1), 2000. [doi:10.1145/343369.343384](https://doi.org/10.1145/343369.343384); [PDF copy](https://www.cs.tau.ac.il/~nachumd/models/gurevich.pdf). Full.
11. [C11] M. Fowler, "Event Sourcing", 2005. [martinfowler.com](https://martinfowler.com/eaaDev/EventSourcing.html). Full.
12. [C12] The Elm Architecture. [guide.elm-lang.org](https://guide.elm-lang.org/architecture/). Full.
13. [C13] P. Alvaro, W. R. Marczak, N. Conway, J. M. Hellerstein, D. Maier and R. Sears, "Dedalus: Datalog in Time and Space", UC Berkeley EECS-2009-173, December 2009. [PDF](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2009/EECS-2009-173.pdf). Full.
14. [C14] J. M. Hellerstein and P. Alvaro, "Keeping CALM: When Distributed Consistency is Easy", 2019. [arXiv:1901.01930](https://arxiv.org/abs/1901.01930). Full. The formal proof is T. J. Ameloot, F. Neven and J. Van den Bussche, "Relational transducers for declarative networking", JACM 60(2), 2013.
15. [C15] Temporal, "Workflow Definition". [docs.temporal.io](https://docs.temporal.io/workflow-definition). Full.
16. [C16] Restate, "Key Concepts: Durable Execution". [docs.restate.dev](https://docs.restate.dev/foundations/key-concepts#durable-execution). Full.
17. [C17] C. Bhandari, "Protocol-Aware Deterministic Simulation Testing", TigerBeetle, 20 August 2026. [tigerbeetle.com](https://tigerbeetle.com/blog/2026-08-20-protocol-aware-dst/). Full.
18. [C18] FoundationDB, "Simulation and Testing". [apple.github.io/foundationdb](https://apple.github.io/foundationdb/testing.html). Full.
19. [C19] musil (project description, version 0.35.6). [pypi.org/project/musil](https://pypi.org/project/musil/). Full.
20. [C20] AILANG. [github.com/sunholo-data/ailang](https://github.com/sunholo-data/ailang). Full (README).
21. [C21] agent-scroll. [github.com/p-vbordei/agent-scroll](https://github.com/p-vbordei/agent-scroll). Full (README).
22. [C22] C. Lattner et al., "MLIR: A Compiler Infrastructure for the End of Moore's Law", 2020. [arXiv:2002.11054](https://arxiv.org/abs/2002.11054). Full.
23. [C23] OMG, MDA Guide Version 1.0, 2003. [PDF](https://www.omg.org/mda/mda_files/MDA_Guide_Version1-0.pdf). Full.
24. [C24] M. Petre, "UML in practice", ICSE 2013. [author copy](https://oro.open.ac.uk/35805/). Full.
25. [C25] Protocol Buffers overview. [protobuf.dev](https://protobuf.dev/overview/). Full.
26. [C26] Lumos introduction. [docs.lumos-lang.org](https://docs.lumos-lang.org/getting-started/introduction). Full.
27. [C27] Forge. [github.com/Sanjith-Shan/Forge](https://github.com/Sanjith-Shan/Forge). Full (README).
28. [C28] Faber Romanus. [github.com/faberlang/faber](https://github.com/faberlang/faber). Full (README).
29. [C29] Intent. [github.com/lhaig/intent](https://github.com/lhaig/intent). Full (README).
30. [C30] NanoLang. [github.com/jordanhubbard/nanolang](https://github.com/jordanhubbard/nanolang). Full (README).
31. [C31] J. W. Backus et al., "The FORTRAN Automatic Coding System", 1957. [Computer History Museum copy](https://archive.computerhistory.org/resources/text/Fortran/102663113.05.01.acc.pdf). Full.
32. [C32] Z. Manna and R. Waldinger, "A Deductive Approach to Program Synthesis", ACM TOPLAS 2(1), 1980. [doi:10.1145/357084.357090](https://doi.org/10.1145/357084.357090). Full.
33. [C33] B. Böckeler, "Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl", martinfowler.com, 15 October 2025. [martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html). Full.
34. [C34] S. Bursuc, T. Ehrenborg, S. Lin et al., "A benchmark for vericoding: formally verified program synthesis", 2025. [arXiv:2509.22908](https://arxiv.org/abs/2509.22908). Full.
35. [C35] X. Leroy, "Formal verification of a realistic compiler", CACM, 2009. [PDF](https://xavierleroy.org/publi/compcert-CACM.pdf). Full.
36. [C36] G. Klein et al., "seL4: Formal Verification of an OS Kernel", SOSP 2009. [PDF](https://www.sigops.org/s/conferences/sosp/2009/papers/klein-sosp09.pdf). Full.
37. [C37] A. Solar-Lezama, L. Tancau, R. Bodik, V. Saraswat and S. Seshia, "Combinatorial Sketching for Finite Programs", ASPLOS 2006. [PDF](https://people.csail.mit.edu/asolar/papers/asplos06-final.pdf). Full.
38. [C38] T. Hubert et al., "Olympiad-level formal mathematical reasoning with reinforcement learning", Nature, 2025. [Nature](https://www.nature.com/articles/s41586-025-09833-y). Full.
39. [C39] C. Sun et al., "Clover: Closed-Loop Verifiable Code Generation". [arXiv:2310.17807](https://arxiv.org/abs/2310.17807). Full.
40. [C40] C. Yang et al., "AutoVerus". [arXiv:2409.13082](https://arxiv.org/abs/2409.13082). Full.
41. [C41] Y. Sun, J. Liu, D. Kroening and J. Xue, "Agentic Model Checking", 2026. [arXiv:2605.21434](https://arxiv.org/abs/2605.21434). Full.
42. [C42] A. Cunha, "Verified LLM-Driven Synthesis for Concept Design", 2026. [arXiv:2607.15718](https://arxiv.org/abs/2607.15718). Full.
43. [C43] Vera. [github.com/aallan/vera](https://github.com/aallan/vera). Full (README).
44. [C44] Vow. [github.com/vow-lang/vow](https://github.com/vow-lang/vow). Full (README).
45. [C45] Thermite. [github.com/dollspace-gay/Thermite](https://github.com/dollspace-gay/Thermite). Full (README).
46. [C46] Decision models as a class: see the decision-head section above and its sources [B7; B8; B12].
47. [C47] J. Schmidhuber, "Goedel Machines: Self-Referential Universal Problem Solvers Making Provably Optimal Self-Improvements", TR IDSIA-19-03 (v5, 2006). [arXiv:cs/0309048](https://arxiv.org/abs/cs/0309048). Full.
48. [C48] E. Yudkowsky and M. Herreshoff, "Tiling Agents for Self-Modifying AI, and the Löbian Obstacle", MIRI early draft, 7 October 2013. [PDF](https://intelligence.org/files/TilingAgentsDraft.pdf). Full.
49. [C49] G. Wang et al., "Voyager: An Open-Ended Embodied Agent with Large Language Models", 2023. [arXiv:2305.16291](https://arxiv.org/abs/2305.16291). Full.
50. [C50] E. Zelikman, E. Lorch, L. Mackey and A. T. Kalai, "Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation", COLM 2024. [arXiv:2310.02304](https://arxiv.org/abs/2310.02304). Full.
51. [C51] J. Zhang, S. Hu, C. Lu, R. Lange and J. Clune, "Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents", ICLR 2026. [arXiv:2505.22954](https://arxiv.org/abs/2505.22954). Full.
52. [C52] A. Novikov et al., "AlphaEvolve: A coding agent for scientific and algorithmic discovery", Google DeepMind white paper, 2025. [arXiv:2506.13131](https://arxiv.org/abs/2506.13131). Full.
53. [C53] J. Bader, A. Scott, M. Pradel and S. Chandra, "Getafix: Learning to Fix Bugs Automatically", OOPSLA 2019. [arXiv:1902.06111](https://arxiv.org/abs/1902.06111). Full.
54. [C54] K. Etemadi et al., "Sorald: Automatic Patch Suggestions for SonarQube Static Analysis Violations", 2021 (v2 2022). [arXiv:2103.12033](https://arxiv.org/abs/2103.12033). Full.
55. [C55] K. Liu et al., "TBar: Revisiting Template-based Automated Program Repair", 2019. [arXiv:1903.08409](https://arxiv.org/abs/1903.08409). Full.
56. [C56] R. Landauer, "Irreversibility and heat generation in the computing process", 1961. [doi:10.1147/rd.53.0183](https://doi.org/10.1147/rd.53.0183). Full.
57. [C57] C. H. Bennett, "Logical Reversibility of Computation", 1973. [doi:10.1147/rd.176.0525](https://doi.org/10.1147/rd.176.0525). Full.
58. [C58] L. Chen, M. Zaharia and J. Zou, "FrugalGPT", 2023. [arXiv:2305.05176](https://arxiv.org/abs/2305.05176). Full.
59. [C59] M. H. Erol, B. El, M. Suzgun, M. Yüksekgönül and J. Zou, "Cost-of-Pass: An Economic Framework for Evaluating Language Models", ICLR 2026. [arXiv:2504.13359](https://arxiv.org/abs/2504.13359). Full.
60. [C60] S. Kapoor, B. Stroebl, Z. S. Siegel, N. Nadgir and A. Narayanan, "AI Agents That Matter", 2024. [arXiv:2407.01502](https://arxiv.org/abs/2407.01502). Full.
61. [C61] H. Pan, L. Huang, X. Zhou, M. Xing and Y. Wu, "Toward Compiler World Models: Learning Latent Dynamics for Efficient Tensor Program Search", 2026. [arXiv:2606.09312](https://arxiv.org/abs/2606.09312). Full.

**Not carried over from the survey**, because the primary source was not obtained or did not support the claim: Smalltalk image claims, Darklang hashing, Pantograph and Grove, Codong, Lume, Magpie, Codex (Tedrow), Spec IR, Boruna, d-raft, Sockudo, DBOS, P language compilation to C, UNCOL and ANDF, Thrift and OpenAPI, Pact, Aver, Prove, reqlan, translation validation (Pnueli), SyGuS, Futamura and Turchin, PAR, DéjàVu and Gabel and Su, Simon and Kadane, and the comparative scoreboard.

<div id="1-history-seventy-years-of-say-what-you-want-get-the-program" class="anchor-alias" aria-hidden="true"></div>

## 1. 历史：七十年的「表达需求，获得程序」

这个主题背后的愿望由来已久。变化在于哪些部分现在变得廉价。下面的时间线列出了主要的尝试；其后的文字说明了每一次的成果以及停滞之处。

![Timeline from FORTRAN in 1954 through deductive synthesis, program derivation, fourth-generation languages and CASE tools, the Fifth Generation project, No Silver Bullet, refinement methods and Model Driven Architecture, verified systems CompCert and seL4, large language model code generation, constrained decoding and verifier loops, to the open question of learned proposers with deterministic checkers](/figures/rce-jepa/timeline.svg)

*图 9. 将意图声明转化为可运行程序的尝试。CASE 代表计算机辅助软件工程；UML 代表统一建模语言；Z、B 和 VDM（维也纳开发方法）是数学规范方法；Coq 是证明助理。绿色：机器检验系统。琥珀色：学习模型。蓝色：本主题研究的问题。*

- **自动编程，1950 年代。** FORTRAN（FORmula TRANslation）被称为 “The FORTRAN Automatic Coding System”。其作者写道，其目的是让 IBM 704 “自行编码问题并产生与人类编码员同等质量的程序（但没有错误）”（Backus 等，1957，第 188 页；PDF 第 2 页）。示例：科学家写出一个公式；系统生成机器码。今天这被称为编译器，而不是自动编程。  
- **演绎综合，1960-80 年代。** Simon 的启发式编译器（1963）将编程视为启发式问题求解：一种基于通用问题求解器（GPS）的手段-目标搜索，通过 “selective trial-and-error search” 编写例程（Simon，RAND RM-3588-PR，1963，Summary，第 vii 页）。Manna 和 Waldinger（1980）将程序视为从构造性证明中提取的产物，证明表明规范可以实现：“从这样的证明中，可以提取计算 z 的程序”（Manna 和 Waldinger，STAN-CS-78-690，1978，Specification 部分；同一句出现在 TOPLAS 文章，1980，第 92 页）；两个版本均指出 “不存在实现”（报告，Motivation，第 2 页；TOPLAS，第 91 页）。JACM 文章直接引用 Simon 的结论：“编译任务：：至少是简单的编译任务：：可以有益地被视为问题求解任务”（Simon，1963，Summary，第 505 页），且未作实际声明：“不会对本文所述的启发式编程过程作出作为编译器构建的实用方法的声明”（Introduction，第 493 页）。Manna 和 Waldinger 观察到，当足够强大的自动定理证明器的开发陷入停滞时，定理证明已被 “作为程序综合方法而被放弃”（TOPLAS，1980，第 120 页）。上述四篇文献均已全文阅读。  
- **程序推导，1975-86 年。** Dijkstra 将受保护命令 “作为程序的构建块” 引入，并提出从最终状态条件出发的 “程序的形式化推导”（Dijkstra，EWD 472，abstract）。Bird 的列表演算（Bird-Meertens 形式主义） “通过代数恒等式的重写来导出高效解”（Bird，1986，PDF 第 3 页）。示例：对于 Gries 的问题 “计算列表所有段的和的最小值”，直接程序需要 O(n³) 步，而使用演算重写可得到 “线性时间算法”（Sec. 4.2，PDF 第 34 页）。  
- **第四代语言、CASE 工具与专家系统，1980 年代。** 报表生成器、表单构建器和图形工具承诺从屏幕和图形直接生成程序。Brooks 在 1986 年回顾图形编程、自动编程和专家系统时指出，它们 “都未能带来数量级的改进”（Brooks，1986，PDF 第 1、8-11 页）。Kemerer 报告称，引用早期研究显示 “引入一年后，70% 的 CASE 工具和技术从未被使用”，且 “使用集成 CASE 工具编写的首个项目通常未能交付改进的结果”；他将部分放弃归因于学习曲线在超过旧技术之前先下降（Kemerer，1992，第 23-24 页，图 1）。  
- **日本第五代计算机系统项目，1982-92 年。** 该国家级计划基于 Prolog 系列的逻辑编程；ICOT 在十年间花费 “约 540 亿日元，即约 4.5 亿美元”（van de Riet，1993，第 1 节，第 83 页）。1981 年计划中的一个目标是 “减轻软件生成的负担，使高级需求规格足以进行自动处理”（第 3 节，第 85 页）。并行推理机达到了 100 MLIPS 的目标，但 van de Riet 将 “架构突破” 与 “软件突破” 评为失败，并将技术影响评为 “小”（第 6 节，第 103 页）；关于编程所需的努力，“几乎没有证据”（第 4.1 节，第 86 页）。  
- **细化与模型驱动方法，1980 年代-2000 年代。** Z、B 和 VDM 通过逐步细化数学规范直至代码。对象管理组织（OMG）的模型驱动架构指南 “规定了系统的三种视角：计算无关视角、平台无关视角和平台特定视角”（OMG，2003，第 2.2.5 节，PDF 第 13 页）。示例：一次绘制类图即可生成 Java 和 SQL（结构化查询语言）。Hutchinson 等人指出，MDE “在缺乏实证数据支持的情况下大多被开发”（2011，第 1 节，第 471 页）；在对 250 多名从业者的调查中，74% 表示 MDE “需要他们进行显著的额外培训”（第 4.3.1 节，第 475 页），且一位受访者报告内部生产率提升 4-8 倍，而对外宣称 “1.5-2 倍”（第 5.2.6 节，第 478 页）。作者将其结果称为 “有趣且具启示性，而非决定性的”（第 3.1 节，第 473 页）。  
- **机器检查系统，2008-09 年。** CompCert 是一个 C 编译器，其 “语义保持证明” 在 Coq 证明助理中完成（Leroy，2009，abstract，PDF 第 1 页）。seL4 是一个 “8,700 行 C 代码” 的微内核，拥有机器检查的 “功能正确性证明”（abstract，PDF 第 1 页）；该证明耗时约 “20 人年”（Klein 等，2009，第 5.2 节，PDF 第 13 页）。Coq 能将已证明的函数提取为普通代码，目标语言包括 “Ocaml、Haskell 或 Scheme 等函数式语言”（Letouzey，2008，第 1 节，PDF 第 1 页）；提取步骤本身尚未机械化验证，其正确性仍依赖纸面证明（第 6 节，PDF 第 10 页）。

<div id="2-why-the-earlier-attempts-stalled" class="anchor-alias" aria-hidden="true"></div>

## 2. 早期尝试停滞的原因

- **本质复杂度与偶然复杂度。** Brooks 将“本质任务，即构成抽象软件实体的复杂概念结构的构造”与“偶然任务，即在编程语言中表示这些抽象实体”（摘要，PDF 第 1 页）区分开来。他引用 Parnas 的话：“自动编程一直是对使用比当时程序员可用的语言更高级的语言进行编程的委婉说法”（PDF 第 9 页），并写道“即使是完美的程序验证也只能证明程序满足其规范”（PDF 第 11 页）（Brooks，1986）。例子：更好的工资规则记号并不能决定规则本身应为何。
- **自然语言是模糊的。** Dijkstra 认为形式化文本是，“当你仔细想想时，是一种极其有效的工具，用来排除所有在使用母语时几乎不可能避免的荒唐之事”（Dijkstra，EWD 667，第 6 段）。例子：“按姓名和日期对用户进行排序”至少有两种解释。
- **规格成本与程序本身等同。** 在 seL4 中，抽象规格花费“大约 4 个人月”，而证明花费约 20 人年，相比之下“包括 Haskell 工作在内的总成本为 2.2 人年”用于构建内核本身（Klein 等，2009，第 5.2 节，PDF 第 12-13 页）。这 20 人年中约有 9 人年用于研究和可重用的证明工具；seL4 特定的证明“为 11 人年”（PDF 第 13 页）。
- **组合搜索。** 搜索所有程序的复杂度随程序长度呈指数增长。DreamCoder 通过学习可重用片段库和神经网络“引导程序搜索”，在“醒-睡”循环中实现此目标（Ellis 等，2021，摘要，PDF 第 1 页）；论文称此类搜索“对通用算法而言是不可解的，因为搜索空间的组合性质”（引言，PDF 第 2 页）；补充材料再次指出寻找程序“困难在于无限大、组合性的搜索景观”（补充材料 S4.1，PDF 第 42 页），这正是限制演绎合成的同类搜索问题。
- **脆弱性与采纳。** 图到代码的工具生成的代码随后被手工编辑，导致模型与代码之间产生漂移。Petre 报告早期调查显示“模型中心方法最大的感知问题是保持模型与代码同步（68% 同意）”（Forward 和 Lethbridge，Petre 报告，2013，作者稿第 3 页）；在 Petre 的 50 位受访者中，35 人未使用 UML（统一建模语言），3 人使用自动代码生成（第 4-5 页）。CASE 和模型驱动工程的采纳研究列在账本中但未阅读，因此未引用其中的数据。
- **观点。** 共同的线索是，每种方法都解决了一个成本（记号、证明、生成），而另一个环节仍需手工完成：编写规格、搜索程序或检查结果。

<div id="3-three-lanes" class="anchor-alias" aria-hidden="true"></div>

## 3. 通向代码世界的三条通道

第 1 节中的愿望已经很久了。到 2026 年 11 月发生的变化是，多个研究项目出于各自的原因，现在在可以给出是或否的事物旁边放置了一位有学识的提议者。本节记录了三条路径。路径是一种收敛观察：方向上的一致性，而非排序，也不是声称某个项目取代了另一个项目。下文的每一幅图均由引用来源如实报告。除第 3.3 节的最后一行外，所有图都不是对 Reality Code Engine 的测量。

<div id="lane-training" class="anchor-alias" aria-hidden="true"></div>

### 3.1 在主流架构上训练

| 谁 | 据报告 | 该来源中未完成的内容 |
| --- | --- | --- |
| Meta FAIR CodeGen. CWM，一个 320 亿参数的密集解码器 [B23] | 当模型看到执行过程而非仅文本时，代码学习效果更佳。中间训练使用 Python 追踪和智能体轨迹。基础模型在 SWE-bench Verified 上的 pass@1 为 53.9%，测试时采用最优 16 个样本后达 65.8%。LiveCodeBench 68.6%。CruxEval-O 94.3%。1.2 亿条追踪函数。来自 1.02 万张图像的 300 万条 ForagerAgent 轨迹。一个 80 亿参数的消融实验：追踪将 CruxEval-O 从 44.6 提升至 73.9，Forager 将 SWE-bench Verified 从 18.4 提升至 22.1。 | 作者将追踪预测称为"第一步"。神经调试器及其在验证中的应用是该报告中的未来工作。 |
| SWE-RL，Wei 等人 | 基于拉取请求历史的强化学习。奖励为与参考补丁的相似度，而非语义等价。Llama3-SWE-RL-70B 在 SWE-bench Verified 上报告为 41.0%。 | 奖励并非语义等价。 |
| SWE-smith，Yang 等人 | 每个代码仓库的合成任务：50,000 个实例，128 个代码仓库。SWE-agent-LM-32B 的 pass@1 为 40.2%。 | 论文中仅使用监督微调。强化学习是一个名为 SkyRL 的外部系统。 |
| DiffuCoder，Gong 等人；Mercury，Inception Labs | 非自回归（掩码扩散）代码生成。DiffuCoder 是一个在 1,300 亿词元上训练的 70 亿参数模型；coupled-GRPO 在 EvalPlus 上额外提升 4.4%。Mercury 在 H100 上报告为每秒 1,109 和 737 个词元。 | 与自回归模型的质量对等性在本文所读来源中尚未确立。 |
| PatchDiff，Wang、Pradel 和 Liu；METR，Becker 等人 | 基准测试可能高估成功率，实际生产效率可能下降。PatchDiff：7.8% 被计为正确的补丁未能通过开发者测试，解决率被高估约 6.4 个百分点。METR 针对 2025 年初工具的研究：16 名开发者，246 项任务，实测完成时间高出 19%。预测降低 24% 以及事后估计降低 20% 的结论均与该测量结果不符。 | 两项检验均针对 2025 年初至中期的工具。 |
| SWE-Bench Pro，Scale AI。公开排行榜于 2026 年 11 月 6 日获取 | 旨在抵抗数据污染（采用著佐权及私有代码仓库）并要求长篇修改：平均跨 4.1 个文件修改 107.4 行。1,865 项任务，41 个代码仓库（731 个公开，276 个私有，858 个保留）。当日公开排行榜：Muse Spark 1.1 为 61.50 +/- 3.10；gpt-5.4 (xHigh) 为 59.10；Muse Spark 为 55.00；claude-opus-4-6 (thinking) 为 51.90；gemini-3.1-pro 为 46.10。其中前四名均使用 mini-swe-agent 运行。同页发布文本：GPT-5 为 23.3%，Opus 4.1 为 23.1%，而在 SWE-bench Verified 上超过 70%。私有集：Opus 4.1 为 17.8%，GPT-5 为 14.9%。该页面未显示更新日期。 | 参考标准仍为失败转通过及通过转通过测试。 |
| Multi-SWE-bench，ByteDance Seed | 跨 Java、TypeScript、JavaScript、Go、Rust、C 和 C++ 的问题解决。来自 2,456 个候选实例中的 1,632 个实例，由 68 名标注人员完成标注。 | 2026 年 11 月的排行榜数据未能获取，该页面亦未说明任何数据。 |

该通道保留了一种广泛使用的模型结构，通常为预测下一个词元（词片段）的解码器，并对训练数据或奖励进行调整。

**Lane reading.** 上述训练报告正向语义化迈进：执行轨迹、环境动态以及检查器可见的奖励。测试套件仍然是oracle，PatchDiff 证明测试套件不完整。SWE-Bench Pro 的板块高于其发布文本，仍然通过测试对补丁进行评分。这就是《编码法则》名称的开端。精确检查器将“测试通过”替换为已接受的表单。接受是世界的一部分，而非事后拟合的分数。

<div id="lane-hybrids" class="anchor-alias" aria-hidden="true"></div>

### 3.2 创造性混合方法

此通道将已学习的提议者与已存在的门配对：评估器、证明内核、类型系统或一组示例。

| 谁 | 如报告 | 在该来源中未完成 |
| --- | --- | --- |
| AlphaEvolve, Google DeepMind [C52] | 一个大型语言模型提出代码编辑。一个进化循环将其包装。自动评估器决定。使用 48 次标量乘法完成 4×4 复数矩阵乘法。还包括数据中心调度、电路简化，以及自身训练的加速，此处未使用进一步的图。 | 它在评估器存在的情况下有效。 |
| AlphaProof, Google DeepMind [C38] | 在 Lean 中采用 AlphaZero 风格的强化学习。形式化环境为推理提供基础。8000 万自动形式化的陈述。2024 年国际数学奥林匹克中，5 道非几何题中有 3 道取得银牌，使用 AlphaGeometry 2，进行多日计算。 | 计算成本。报告的是数学，而非软件。 |
| DeepSeek-Prover-V2-671B | 由 DeepSeek-V3 进行子目标分解，子目标的证明被拼接成链式思考的冷启动，然后进行强化学习。Lean 4 内核是门槛。miniF2F 测试通过率 88.9%。PutnamBench 658 题中通过 49 题。新建 ProverBench 包含 325 题。正式环境下 2024、2025 年 AIME 15 题中有 6 题通过，非正式多数投票下 DeepSeek-V3 为 8 题。 | 数学，而非软件。形式化与非形式化的差距仍然非零。 |
| Kimina-Prover Preview, Moonshot and Numina | 基于 Qwen2.5-72B。大规模强化学习结合 Lean 4 中的形式推理模式。miniF2F 在 pass@8192 上达到 80.7%。发布了 15 亿和 70 亿参数的蒸馏模型。 | 预览版发布。 |
| Goedel-Prover, Princeton | 自然语言问题自动形式化为 Lean（164 万条陈述）。专家迭代构建超过 80 万条证明。仅使用监督微调。miniF2F 在 pass@32 上为 57.6%。PutnamBench 在 pass@512 上为 7。 | 版本 1 中未使用强化学习。 |
| Vericoding benchmark, Beneficial AI Foundation [C34] | 从形式规范生成代码和证明。12,504 条规范。成功率为 Dafny 82.2%，Verus 44.2%，Lean 26.8%。摘要将这些比例四舍五入为 82%、44% 和 27%，这也是下文承诺部分的四舍五入方式。划分为 3,029 条 Dafny、2,334 条 Verus 和 7,141 条 Lean。Dafny 验证在该工作线上从 68% 提升至一年内的 96%。自然语言描述贡献甚微。 | 编写规范的成本仍然存在。 |
| Type-constrained decoding, Mündler et al. | 类型系统约束 token 采样。作者隶属于瑞士联邦理工学院苏黎世校区和加州大学伯克利分校。HumanEval 上编译错误下降 75.3%，MBPP（报告中提到的短 Python 集）下降 52.1%。仅语法约束在这两个集合上分别为 9.0% 和 4.9%。 | 仅限 TypeScript 规模。类型并未完全接受行为。 |
| DreamCoder, Ellis et al. LILO, Grand et al. | 通过压缩进行库学习。LILO 添加了大型语言模型和符号重构（Stitch）。DreamCoder 引自第 2 节的全文。LILO 在此阶段为抽象层级。 | 在读取车道的源代码中使用了小型领域特定语言。 |
| egg, Willsey et al. [C4] | 等价饱和：将一组等价程序存储为一个 e-graph。编程语言原理，2021。 | 仍需有人编写重写规则。 |
| ARC Prize 2024, Chollet, Knoop, Kamradt and Landers. Akyurek et al. | 通过深度学习指导的程序合成，加上测试时训练。ARC（抽象与推理语料库）在 ARC-AGI-1 上的私有得分在 2024 年从 33% 提升至 55.5%。未达到 85% 的目标。Akyurek 等人在任务示例上于推理时更新权重：在 ARC 公共验证集上使用 80 亿参数模型达到 53.0%，与程序合成集成时为 61.9%。 | 未达到 85% 的目标。Akyurek 方法为少样本。 |
| ARC Prize 2025 results page | ARC-AGI-2 私有赛道获胜者，任务成本上限为每任务 0.20 美元。NVARC（该页面列出的获胜作品）24.0%，使用合成数据、测试时训练和一个小型递归网络。ARChitects 16.5%，采用二维掩码扩散语言模型并进行递归细化。MindsAI 12.6%。该页面的论文奖项：约 700 万参数的小型递归网络在 ARC-AGI-1 上约 45%，在 ARC-AGI-2 上约 8%；SOAR（该页面称为自我微调的进化程序合成）在 ARC-AGI-1 上最高达 52%；CompressARC，一种无预训练的最小描述长度方法，在 ARC-AGI-1 上约 20% 至 34%，在 ARC-AGI-2 上约 4%。 | 大奖未被领取。ARC-AGI-3：：交互式赛道，正在开发中。 |
| Large Concept Models, Meta FAIR | 在句子嵌入空间进行自回归预测，SONAR（报告中命名的句子嵌入空间，支持 200 种语言），而非基于 token。均方误差、扩散和量化变体。16 亿参数模型，使用约 1.3 万亿 token。一个架构扩展至 70 亿参数，使用约 2.7 万亿 token。 | 在摘要中，概念被定义为句子，即代理。未给出任何代码层面的结果。 |

**通道读取。** 每个这些混合体都具有上述原则中所述的形状：模型提出，而确定性门决定。AlphaEvolve 和 AlphaProof 是明确的接触点。Lean 证明器具有相同的形状，内核充当门，它们报告的增益来自针对该内核生成的数据。ARC Prize 2025 页面展示了程序搜索、测试时训练、扩散和小型递归网络在一个循环中的应用：提出、针对示例检查、精炼。共享的限制也是共享的。它们需要一个评估器、一个内核或一组示例。编码定律声称，存在一种此类环境用于一般编码，而不仅限于数学和基准内核。大型概念模型是语言中 JEPA 的最接近的无标记相对物：在概念空间中进行预测，仍然没有精确的接受步骤。

<div id="lane-formula" class="anchor-alias" aria-hidden="true"></div>

### 3.3 计算、编程与编码的再概念化

这条路径并非始于某个基准测试分数，而是始于一个关于程序本质的问题。

| 主体 | 报告所述 | 该来源中未完成的部分 |
| --- | --- | --- |
| HVM2，Higher Order Company | 以交互组合子作为计算模型，并集成固有并行性。本页引用该模型。 | 本页不采用该论文中的数据。生产环境采用情况仍待观察。 |
| Unison [C2] | 定义即其语法树的哈希值。名称是该哈希之上的视图。该语言已投入生产使用。 | 生态规模。 |
| Lean、Dafny 与 Verus 社区，经由 vericoding 基准 [C34] | 证明即内核可检验的程序。正确性是一个可检验的对象。本页所用的实测下限为上表中的 vericoding 一行。 | 编写规约的成本依然存在。 |
| egg [C4] | 以数据形式表示的程序等价类。程序位于商空间之中。 | 重写规则的完备性。 |
| Lean FRO（Focused Research Organization，聚焦研究组织），第一年路线图，2023 年 8 月至 2024 年 7 月 | Lean 既是一门语言，也是面向数学以及软硬件验证的证明助手。该页面列出的交付物包括标准库、模块系统、Lake 与 Reservoir、证明自动化、机器学习集成以及新的代码生成器。 | 本页不采用后续年度的路线图。 |
| Conal Elliott，指称式设计 | “实例的含义即含义的实例。”语义模型界定正确性，并将其传递至实现。该文写于 2009 年，2016 年修订。 | 一种人工设计规范。 |
| Radul 与 Sussman，传播子（propagators） | 将计算视为向共享单元添加信息的自主机器。该理论统一了表达式式编程与约束编程，包括增量式分布式搜索。为 2009 年技术报告，附有 Scheme 实现。 | 采用情况。 |
| Chollet，关于智能度量 [T37] | 将智能视为技能习得的效率。ARC 是度量基准，程序合成是其框架。2019 年论文为引文依据。关于在任务发生时完成合成的后续演讲不单独引用。凡 ARC Prize 2024 报告提及深度学习引导的程序合成之处，以该报告为引文依据。 | 在本次审读的摘要中，形式化度量未超出 ARC 范围得到操作化。 |
| 本项目，Laws of Coding（编码定律） | 规范形式（canonical Form）是研究对象。表层文本是其投影。成本被计量。已测结果如下：H1 中 185 个程序的中位 rho 为 9.34；H2 中 `C_check / E_model = 0.000582 <= 0.05`（在 M5 Max 上便宜 `1,718×`）；H5 与 H11 在未见过的、互不相交的 Form 形态上，经由 `FormEBM-v2`（AUROC `0.8922`，5 步单调性 `93.0%`），以及跨度归一化的 `FormEBM-v3`（`6.05M` 参数：AUROC `0.9437`，`E_depth` 单调性 `94.0%` / `E_total` 单调性 `92.0%`，零样本 OOD 的 H15 汇总 AUROC 由 `0.2585` 提升至 `0.5278`）；H7 中，经模糊测试的分支上有 1,275 个变异体，违规数为 0；H8 中，10,500 个流、六个目标，失配数为 0；H14 第 3 轮中，151 项任务中有 111 项（73.5%）在 0 次模型调用下关闭；H15 在 40 项剩余任务上，单次尝试通过数由 17/40 升至 34/40，`FormJEPA-v1`（`8.42M` 参数，`474.76 mJ` RAPL 核心 `reported_j`）为 `27/40`（`k = 16`），`H15-Iterative` 在 `Opus 5.5` 与 `Sonnet 5.5` 上为 `40/40`（`0` 处矛盾）；`40/40` 的 0 调用 Gear-0 回放（`0.325 µs`，每次探测 `1.77 µJ`）；在 `Zipf(0.85)` 上三档（3-Gear）情节数减少 `16.67×`（`200/200` 被接纳）；以及对 151 项任务的 `rce repair` 第 `f` 级审计（`3/119 = 2.5% > 2.0%`，`0` 处矛盾，停留在 `observe`）。 | 完整的意图到 Form 合成（H3），超出 `0.5278` 的跨模块签名与轨迹 OOD 能量校准，H4、H6、H9、H10、H12、H13，H15 的扩散与进化分支，以及墙电表测得的 `measured_j`，仍未完成。 |

**通道读取。** Unison（身份是结构的哈希）、egg（程序作为等价类）、interaction nets（计算作为局部重写）和 proof assistants（正确性作为对象）各自持有《编码法则》共同阐述的一个要素：一个规范形式、精确重放、投射到目标以及可检查的接受。Elliott 的指示性设计和 propagator 说明是同一需求的早期表述：意义决定实现，计算添加信息而非仅仅输出文本。它们是独立的收敛，各自源自不同的起点。Chollet 的度量指出要计数的对象是系统获取技能的效率，这也是提案者比较同时跟踪调用预算和物理能量的原因（第 8 节）。

<div id="4-why-now-the-case-for-closed-form-deterministic-ai-proposed-code" class="anchor-alias" aria-hidden="true"></div>

## 4. 为何是现在：封闭形式、确定性、AI 提议代码的理由

**本节为观点，基于上述历史以及第 3 节中的三条路径构建。它是待测试的案例，而非结果。**

- **检查器廉价且可靠，弥补了早期尝试的不足。** 使用随机程序生成器 Csmith，作者发现 CompCert 是“我们测试的唯一一个 Csmith 找不到错误代码的编译器”，在“大约六 CPU 年”的尝试后（Yang 等，2011，Sec. 3.1，PDF 第 6 页）。机器检查的规则可以提供生成器无法提供的信任。CompCert 本身采用了这种模式：其寄存器分配器运行未经验证的图着色启发式算法，并使用在 Coq 中证明正确的验证器检查每个结果，因为图着色“比直接证明正确更容易事后验证”（Leroy，2009，Sec. 4.2，PDF 第 7 页）。
- **确定性语义解决非确定性问题。** 如果允许生成器变化，但接受的产物被精确检查并重放，则模型的运行间差异对结果不再重要。
- **循环验证证据已存在。** AlphaCode 的行为过滤、Codex-S 的 oracle 测试选择（77.5% 对比 44.5% 的对数概率排序）、Clover、AutoVerus 和 AlphaProof 在检查选择提案时均显示出显著提升。第 3 节记录了后续系统的相同模式：模型提出，评估器、证明内核或类型系统决定。
- **学习预测器现在在潜在空间工作。** I-JEPA 和 V-JEPA 2 表明，预测目标的摘要而非每个细节，在这些任务上表现良好：V-JEPA 2 在 5 项机器人任务中有 4 项成功率更高（1 项持平），并且在比较中规划速度约为生成式视频模型的 15 倍（表 3，PDF 第 15 页）。在程序中，标识符拼写、格式和目标语言等细节可以在结构确定后 deterministically 填充。第 5 节阐述了前提以及在出现 Forms 与 Coding 法则后其停止的条件。
- **逐标记生成成本高昂。** LLaMA 65B 在 8 到 32 块 V100 GPU 上分片运行，输出限制为 512 标记，使用“约 3-4 焦耳每个输出标记”，仅计入 GPU 能耗（Samsi 等，2023，Secs. III-C 和 IV-C，PDF 第 4-6 页）。在对 88 种模型的研究中，文本生成模型平均每 1,000 次查询消耗 0.047 kWh（千瓦时），每次查询仅生成 10 个新标记（表 2），并且“多用途生成架构的成本比特定任务系统高出数个数量级”，部分原因是生成器需要在“整个词汇表”中进行选择（Luccioni 等，2024，abstract，PDF 第 1 页；Sec. 4.1 和表 2，PDF 第 6 页；Sec. 4.2.1，PDF 第 8 页）。
- **同主机检查-模型比较（第 8 节，H2）。** 与其将外部 V100 数据与本地笔记本时间混合，第 8 节在同一 Apple M5 Max 主机上测量两者：每次 Form 检查 `0.04904 J`，而本地 `Qwen 3.6 35B-A3B` 的每个候选耗费 `84.25 J`（每次批准的残余修复 `124.81 J`）。

<div id="what-could-still-fail" class="anchor-alias" aria-hidden="true"></div>

### 潜在失败因素

- **表达能力上限 (H6)。** 如果真实程序需要形式无法陈述的副作用或非确定性，“全部代码”前提将失效。
- **意图可能成为瓶颈。** 更小的输出空间并不能解决意图未明确的问题。信号：H1 与 H2 成立而 H3 失效。
- **规格游戏。** 检查器证明 Form 结构良好且满足声明的属性，而不是它是否符合用户的真实意图。基准任务通过回放检查行为轨迹；剩余风险被标记而非解决。
- **语料稀缺。** 信号：随着语料库增长，H3 持平。
- **崩塌。** JEPA 需要防崩塌措施，例如 I-JEPA 与 V-JEPA 2 中的 EMA（指数移动平均）目标编码器；LeCun (2022) 提出 VICReg 风格的信息最大化方案（第 4.5 节）。崩塌的 Form 嵌入会导致 H5 失效。第 5 节将此限制与其他限制并列列出。
- **测量误差。** 无根计数器（macmon `IOReport` L2、内核 `ri_energy_nj` L3、RAPL）覆盖 SoC 或工艺计数器（`reported_j`），而不是交流（AC）墙壁功率（`measured_j`）。
- **基线漂移。** 共享主机上的共租进程会使 L2 空闲基线漂移（Falsifier 6），需要使用每进程标识符（PID）L3 计数器或专用空闲主机。

<div id="5-jepa-as-premise" class="anchor-alias" aria-hidden="true"></div>

## 5. JEPA 作为前提及其边界

前提保持不变。JEPA 在嵌入空间中进行预测，而不是在原始输入空间中。论文引用了 LeCun 2022 年关于该思想的表述。V-JEPA 2 报告了 62 小时的机器人视频以及从 65% 到 80% 的零样本抓取-放置成功率 [B1]。正如同一报告的提议者章节所述，动作条件预测器的训练使用的未标记机器人视频不足 62 小时。LLM-JEPA 报告称，在自然语言到正则表达式任务、GSM8K（小学数学集合）和 Spider（文本到数据库查询集合）上，嵌入空间损失优于 token 损失，规模为 10 亿参数（Huang、LeCun 和 Balestriero，2025）。对于代码，这与有用对象是意义而非 token 的直觉相吻合。

一旦 Form 存在，并且一旦编码法则固定了等价性和接受性，该前提就不是整个方法。随后列出六个限制，它们是扩展提议者的理由，而非放弃前提的理由。

1. **一种可以精确计算的近似几何。** JEPA 学习近似的潜在几何。编码法则提供了精确的几何：规范 Form 以及检查器已经决定的等价关系。通过自监督学习这些内容会在本可以直接计算的映射上消耗数据。H10 是检验在商空间上学习是否节省数据的测试。H10 尚未运行。
2. **坍塌。** 表征坍塌以及针对其的正则化器是 JEPA 训练中的未解问题。精确的规范化器不会坍塌。它通过规则而非损失将每个表层程序映射到一个 Form。
3. **缺乏原生接受。** JEPA 没有原生解码器，也没有接受步骤。代码需要离散、可检查的输出。能量分数对候选项进行排序，但不决定最终结果。检查器负责决定。
4. **点而非商。** 替代 Form 构成一个商。许多表层程序可以对应同一个 Form，而一个 Form 可以投射到多个目标。JEPA 嵌入的是点，它并不证明两个点属于同一 Form。e-graph 能做到，结构哈希也能做到。在第 8 节中，`rce fmt nameless` 将 `9` 个 alpha-重命名的局部变量突变中的 `7` 个映射到相同的内存映射 Gear-0（`DNULLMM1`）槽，模型调用次数为零。
5. **证据规模。** LLM-JEPA 的证据规模在 10 亿到 20 亿参数之间，且使用的是小数据集。此页的任何来源都未显示 JEPA 在仓库规模代码上的训练情况。
6. **学习规划的成本。** V-JEPA 2 的模型预测控制（MPC）每个动作约耗时 16 秒 [B1]。在使用廉价精确检查器（`7.32 ms`、`49.04 mJ` L3 `reported_j` 在 M5 Max 上）和 Gear-0 查找（`0.325 µs`、`1.77 µJ`）的情况下，对 Form 的搜索在任何学习规划器训练之前就已经限制了重复 rollout 的成本。

**后果。** JEPA 仍然是前提：预测意义，而非文本。提议者槽可以推广到任何基于 Form 的学习提议者。第 3 节中命名的实例包括在训练中期执行的自回归模型（CWM）、扩散代码模型、形式环境中的强化学习（AlphaProof 与 Lean prover）、进化搜索（AlphaEvolve）、库学习（DreamCoder 与 LILO）以及受约束的解码。大型概念模型在语言上与前提并列，尚未在代码上实现。所有这些的门槛是相同的。第 6 节给出了分类法。第 7 节说明了它们所提议的世界。

<div id="6-proposer-slot" class="anchor-alias" aria-hidden="true"></div>

## 6. 提议器槽与架构无关

图 1 绘制了一条管线。学习框是一个槽，而不是单一的架构。JEPA 是图中的实例。框外绘制的门在插入不同的提议者时不会改变。表格列出，对于第 3 节中读取的每种提议者，它学习了什么，需要来自编码定律的哪些组件（规范化器、检查器、成本计量器），已有来源命名的失效模式，以及它移动或将要移动的假设。第 8 节现在报告了第一种目的训练的潜在 Form JEPA 修复提议者（`FormJEPA-v1`，`8.42M` 可训练参数）以及在 40 项残差任务上使用的六种现成的自回归、推理和混合 Gated-DeltaNet / MoE 模型。

| 提案者 | 学习内容 | 需要检查者提供的内容 | 已知失败模式 | 推动/可能推动的假设 |
| --- | --- | --- | --- | --- |
| JEPA，嵌入预测器（`FormJEPA-v1` 在第 8 节） | Form 结构和编辑的近似潜在几何（EMA 目标编码器 + VICReg + 潜在条件化类型编辑解码器） | 规范化器、检查器、成本计量器和离散编辑头。能量分数不接受 | 无本地接受。未校准的潜在距离单独给出 AUROC `0.618`，且紧凑的非预训练模型在没有 Gear-2 回退的情况下错过开放的多模块 API 迁移（在 H15 上 `0/9`） | `FormJEPA-v1` 在 H15 上的测量（`k = 1` 时 `22/40`，`k = 16` 时 `27/40`）以及不相交的合成缺陷（`177/200`）；完整的 intent-to-Form H3、已校准的 H5/H11、H10 和 H13 仍待开放 |
| 自回归 / 推理 / 轨迹训练解码器（Claude、Grok、生成式预训练 Transformer 开源权重（GPT-OSS）、DeepSeek、Qwen 3.6、CWM 类） | 下一标记预测、链式思考推理、混合门控-DeltaNet / MoE，或执行轨迹 | 检查器作为接受，加上 Gear-0 晶化以防重复形状重新调用模型 | 标记空间重试每个局部候选消耗 `84.25 J`（`Qwen 3.6`），长推理轨迹可能耗尽固定完成上限（`DeepSeek V4.1` `17/40`） | 首次单次（`k = 1`）H15 臂在第 8 节测量（`17/40` 到 `34/40`）；RJ-F6 测试轨迹训练标记模型是否在等能量下匹配 Form-quotient 训练 |
| 扩散代码模型 | 掩码或去噪程序，而非从左到右的标记流 | 检查器作为接受。约束也可在采样时起作用 | 与自回归模型的质量等价性在此处阅读的来源中尚未确立 | H15 的扩散臂（开放） |
| 在形式化环境中的强化学习 | 核心接受的步骤，如 AlphaProof 和第 3 节的 Lean 证明器 | 核心即环境。对于软件而言，该角色是检查器 | 在此处阅读的报告中，领域是数学而非软件。计算成本是 AlphaProof 结果的一部分。Goedel-Prover 版本 1 没有强化学习 | H3 和 H12，如果相同循环在 Forms 上运行（开放） |
| 进化搜索 | 编辑，由评估器保留或丢弃，如 AlphaEvolve 和 ARC 奖 2025 页面上的 SOAR | 评估器。此处评估器是检查器，而非仅测试套件 | 循环在存在评估器的情况下工作。ARC 上的示例检查并非软件的一般接受规则 | H15 的进化臂，基于 H14 的残差（开放） |
| 库学习（DreamCoder、LILO） | 通过压缩得到的可重用库，是否在循环中使用大型语言模型 | 检查器用于库生成的程序 | 此通道阅读的来源中的领域较小 | H10（开放） |
| 受约束解码 | 权重中没有新内容。约束掩码非法标记，类似于类型约束报告 | 在采样时使用语法或类型系统，以及行为检查器 | 主要结果是 TypeScript 规模。语法和类型并未完全接受。编译错误在 HumanEval 上下降至 75.3%，在 MBPP 上下降至 52.1%，而仅语法时分别为 9.0% 和 4.9% | H3，仅针对类型失败的那部分错误比例 |
| 大规模概念模型 | 下一个句子嵌入，而非下一个标记 | 精确的接受步骤，摘要中未包含 | 概念即为句子。摘要中没有代码特定的结果 | 在出现代码结果之前，H1 至 H15 均不适用 |

在提议者部分的确定性梯形在任何这些操作之前运行（H14：`111/151` 在 `0` 次调用后关闭，留下 `40` 个残余任务）。第 8 节报告了六模型即用型 H15 基线加 Shape D（`DNULLMM1`）Gear-0 结晶，以及在这 40 个任务上使用专门训练的 `FormJEPA-v1` 手臂加 3-Gear 级联的结果，同时保持扩散和进化手臂、意图到 Form H3，以及墙式计量服务器焦耳等价显式开放。

<div id="7-world-of-code" class="anchor-alias" aria-hidden="true"></div>

## 7. 代码世界

**定义。** 代码世界是形式的状态空间，加上精确的转移和精确的接受规则。在论文的记号中，状态空间记为 S，转移记为函数 δ，接受记为检查器对形式的判定。对代码而言，“世界模型”指该空间的模型。不同于物理世界模型，物理规律是完全已知的。论文第 4 部分指出，对于 JEPA 风格的预测器，同一物理规律约束第 6 节中的每个提议者。CWM 从轨迹中学习解释器。V-JEPA 2 从视频中学习物理。在形式中，转移是已给定的。下一状态不存在不可约噪声。

**学习被移除的地方，仍然存在的地方。** 规范化、等价性和重放是计算过程。一旦编码定律固定它们，模型就不必再学习它们。仍需学习的是从声明意图到形式的映射、搜索的引导以及确定性层级留下的任何内容的排序（`40` 个真实历史任务在 H14 第 3 次运行后）。一旦任何提议者解决这些残余任务并通过门槛，Gear-0 晶化将每个递归（以及 `7/9` 在 `rce fmt nameless` 下的 alpha 重命名）转化为 `0.325 µs` 的确定性查找。

**评估。** 测试套件并非编码定律。PatchDiff 报告 7.8% 被计为正确的补丁在开发者测试中失败，且解决率被高估约 6.4 点。METR 试验报告 16 名开发者、246 项任务，使用 2025 年初工具时测得的完成时间高出 19%。SWE-Bench Pro 于 2026 年 11 月 6 日抓取的板块仍使用 fail-to-pass 和 pass-to-pass 测试作为判据。Multi-SWE-bench 将语言集合扩展至 Java、TypeScript、JavaScript、Go、Rust、C 和 C++。本页的接受即为门槛（`rce check` 退出 `0` 加上义务保持），并通过 `rce hash` 与 `rce equiv` 对历史原件进一步验证。

**对扩展主张的反驳者。** RJ-F6 与第 8 节中的其他内容一起指出，若一个 token 空间模型在相同能量和相同门槛接受下关闭 40 项任务的残余而不使用形式商，则会帮助提议者：单次前沿 token 模型在首次遇到时最多关闭 `34/40`（`85.0%`），而 `FormJEPA-v1`（`8.42M` 参数，基于商归一化的形式 S 表达式）在本地 35B token 空间修复中以 `27/40`（`k = 16`）匹配，且在 `reported_j` 低一个数量级的情况下，`rce fmt nameless` 在 alpha 重命名下提供 `7/9` 零调用商命中；等大小商对表面样本效率的受控测试（H10）和意图到形式的 H3 仍未解决。

<div id="8-one-concrete-instance-the-reality-code-engine" class="anchor-alias" aria-hidden="true"></div>

## 8. 一个具体实例：现实代码引擎

RCE 是一种封闭的程序形式，可能还有其他形式；上述问题适用于任何具有小且可检查程序形状的语言。在 RCE 中每个程序是一个形式 P = (S, E, δ, D, λ)：

- **S，状态：** 程序持有的类型化数据，例如编辑器的光标位置和文本缓冲区。
- **E，事件：** 程序可以接收的输入，例如“键被按下”或“文件打开”。
- **δ（delta），转移函数：** 给出当前状态和事件时的下一个状态的规则。
- **D，推导：** 记录的、哈希链式的步骤历史，使每一次运行都能逐位重放。
- **λ（lambda），输出：** 程序在给定状态下显示或发出的内容，例如可见的文本行。

检查器接受一个 Form，或给出它违反的规则名称。在提交 `f87d6af2`（2026 年 11 月 23 日；Rust 检查器二进制文件与 `1762fb4b` 保持一致）处，公共参考检查器能够精确重放一个接受的 Form，通过 `2,236` 项符合性测试中的 `2,221` 项且 `0` 项失败（`837` 个 Rust 单元测试），生成 Rust、Python、JavaScript 和 Scala 代码，并由跨 `64` 个模块、源自 `1,264` 条源代码声明的 `5,393` 个 Lean 4.36.0 内核定理常量支撑（定理 T1 到 T63，已在 Linux `bubblewrap` 内经 `lake check --paranoid` 的全部六个独立证明检查器验证通过）。 在 Apple M5 Max 上，双通道 `reported_j` 收据记录每次 Form 检查消耗 `49.04 mJ`（L3 `ri_energy_nj`，`7.32 ms`/Form）以及每次完整的 62-Form 检查、追踪运行和五目标发射套件消耗 `15.44 J`（`2.32 s`/pass；`measured_j = None`，`board_metered = false`）。完整描述见 [RCE 主题页](/about/rce/) 和 [github.com/openIE-dev/rce](https://github.com/openIE-dev/rce)。

**RCE-JEPA** 是工作名称，保留此名称以便线程可检索。主题是世界编码。JEPA，联合嵌入预测器，是前提：预测意义，而非表面文本。提议者槽是任何在 Form 上学习的提议者。检查、证明、推导、发射和定位仍由 RCE 负责。目标是每个时钟周期和每焦耳的最佳性能。*工作假设：* 如果所有代码都能编码在 Form 中，则所有代码都可以通过其上的联合嵌入或基于能量的模型生成。下面的假设设计为能够让证据否定该假设。

<div id="defined-quantities" class="anchor-alias" aria-hidden="true"></div>

### 定义量

- **输出空间。** 在词汇表 V 上长度为 L 的自由生成的原始空间为 |V|<sup>L</sup>。Ω<sub>n</sub>（omega）是大小为 n（Form 节点）的有效 Form 集；Ω<sub>n</sub><sup>✓</sup> ⊆ Ω<sub>n</sub> 是检查器接受的子集。以 log<sub>2</sub>|Ω<sub>n</sub>| 位报告，估计方法为语法计数和抽样。  
- **描述长度。** b(P) 为对 Form P 进行规范编码所需的位数；b(code) = tokens × log<sub>2</sub>|V| 为等价的生成源代码位数。比率 ρ（rho）= b(code) / b(P)。  
- **验证成本。** C<sub>check</sub>(P)：检查器决定 P 所需的墙时、周期和焦耳。单元测试给出 C<sub>test</sub>；通过的测试是证据，而非证明。  
- **接受概率。** a = P(检查器接受且任务规范满足 | 意图)，在基准上测量为 pass@1。  
- **每个接受程序的焦耳。** J<sub>acc</sub> = (E<sub>model</sub> + E<sub>check</sub> + E<sub>retry</sub>) / N<sub>accepted</sub>，在一次基准运行中求和（对 L2/L3 计数器标记为 `reported_j`，仅在外接硬件功率计时标记为 `measured_j`）。  
- **每个接受程序的周期。** K<sub>acc</sub>，在 CPU（中央处理单元）或 GPU 周期中相同，计数器可读时使用。  
- **AUROC**（受试者工作特征曲线下面积）：随机选取的接受 Form 获得的能量低于随机选取的需要修改的 Form 的概率；0.5 为随机水平，1.0 为完美。

**论点（观点，待验证）。** 一个 Form 具有五个带类型的槽位，且具有固定的组合规则。将输出约束到 Ω<sub>n</sub> 在模型被调用之前就去除大部分 |V|<sup>L</sup>，因此每个程序预测的位数更少（ρ > 1），检查器给出确定性的裁决：：接受或需要修改：：取代了概率性测试，而需要修改的裁决成本低且结构化，命名了具体规则，从而使重试有指导而非盲目。

<div id="hypotheses" class="anchor-alias" aria-hidden="true"></div>

### 可证伪假设 H1 至 H15

所有十五个假设按数字顺序列出。H1 到 H7 直接检验 RCE-JEPA 论点，H8 到 H10 检验上述“编码定律”论点，H11 到 H13 检验提议者，H14 测量其下的确定性阶梯，H15 在 40 任务残差以及 Shape D（`DNULLMM1`）Gear-0 结晶上比较提议者类别。

| 编号 | 假设 | 指标 | 成立条件 | 证伪条件 |
| --- | --- | --- | --- | --- |
| H1 | 对于同一程序，形式空间远小于源码空间。**在人工编写语料上得到支持**（185 个程序的中位数 ρ = 9.34） | ρ = b(code)/b(P)，语料上的中位数 | ρ ≥ 5 | ρ < 2 |
| H2 | 检查器相对于生成而言开销很低。**在 Apple M5 Max 的 `reported_j` 中得到支持**：`C_check / E_model = 0.04904 J / 84.25 J = 0.000582`（便宜 `1,718×`；`measured_j = None`） | 每个候选的 C<sub>check</sub> / E<sub>model</sub>（焦耳） | ≤ 0.05 | ≥ 0.5 |
| H3 | 表示空间中的预测能够达到有用的接受率 | 在留出的意图到形式任务上，被接受形式的 pass@1 | ≥ 同一任务上基线的 pass@1 | < 0.5 × 基线 |
| H4 | 每个被接受程序的能耗下降 | J<sub>acc</sub>(RCE-JEPA) / J<sub>acc</sub>(基线) | ≤ 0.1 | ≥ 1 |
| H5 | 能量排序将概率质量集中在有效形式上。**在未见过的测试形式形状上达到 AUROC 阈值**：对比学习的 `FormEBM-v2`（`5.85M` 参数）在未见形状上达到 AUROC **`0.8922 >= 0.85`**（可解 top-1 准确率 `84.05%`）；跨度归一化分解的 `FormEBM-v3`（`6.05M` 参数）将未见形状上的 AUROC 提升至 **`0.9437 >= 0.85`**（仅 `E_def` 时为 `0.9386`），测试覆盖 `200` 个未见测试 beam 上的 `3,064` 个候选（未校准的 `FormJEPA-v1` 为 `0.618`）。`E_def` 与 `E_total` 的可解 top-1 准确率分别为 `83.44%` 与 `80.98%`（在全部 `200` 个 beam 上的原始值分别为 `68.0%` 与 `66.0%`），`rce check` 调用次数分别减少 `2.23×` 与 `2.14×`。零样本 OOD 的 H15 合并 AUROC 由 `0.2585` 提升至 `0.5278`（大跨度有效样本与短跨度无效样本之间为 `0.6018`），而跨模块签名/追踪的 OOD 校准仍待解决 | 类型检查通过率（top-1）；E 对被接受与需要修改的形式之间的 AUROC | top-1 有效率 ≥ 0.8；AUROC ≥ 0.85 | AUROC ≤ 0.6 |
| H6 | 参考应用可被编码 | 6 个参考应用加 RCEdb 中，完整表示为通过检查器且可逐位重放的形式的比例 | 7 个全部通过 | 任一应用需要使用形式之外的逃逸机制 |
| H7 | 安全性与模型无关（模糊测试分支：1,275 个变异体中违规数为 0；模型分支仍待完成） | 被检查器接受、但违反既定不变式的对抗性形式（模糊生成与模型生成），按类别统计 | 0 | ≥ 1 个已确认 |
| H8 | 确定性：每个被接受的形式都能重放出逐位一致的轨迹与输出。**已得到支持**（在 6 个目标上的 10,500 条事件流中，不匹配数为 0） | 在至少 3 台不同机器与操作系统上记录的至少 10,000 条事件流中的不匹配数 | 0 | 出现任一不匹配 |
| H9 | 执行前即可预测成本 | 在指定机器上，成本表预测与实测能耗（焦耳，使用具名功率计）之间的中位误差，覆盖测试族 | ≤ 20% | > 50% |
| H10 | 在商空间上学习可节省数据 | 预测规范形式的预测器，要达到与在表层代码上训练、规模相同的预测器相同的测试接受率所需的训练样本数 | 至多一半（节省 2 倍或更多） | 节省低于 1.25 倍 |
| H11 | 能量随编辑距离单调递增。**在未见过的 5 步累积缺陷链上得到支持**：对比学习的 `FormEBM-v2` 达到 `93.0% >= 80%` 的严格 5 步单调性（Spearman `ρ = 0.9931`）；双头 `FormEBM-v3` 在 `E_depth` 上达到 **`94.0% >= 80%`**（`94/100`，Spearman `ρ = 0.9966`），在复合 `E_total` 上达到 **`92.0% >= 80%`**（`92/100`，Spearman `ρ = 0.9846`；未校准的 `FormJEPA-v1` 为 `36.0%`）。不受约束的同线随机游走切片中，`v2` 为 `38.0%`，`v3` 的 `E_depth` / `E_total` 分别为 `32.0%` / `18.0%` | 在测试族中，能量 E 随编辑距离从 1 增至 k（相对于一个已接受拟合）而上升的族所占比例 | ≥ 80% 的族 | < 80% 的族 |
| H12 | 决策头在闸门结果上经过校准 | 在 10<sup>4</sup> 份回执之后，按决策类型统计的 ECE | ECE ≤ 0.1，且优于按形状哈希构建的频数表 | ECE > 0.2，或不优于频数表 |
| H13 | 在长编辑序列上，离散潜变量的规划效果优于连续潜变量 | 在编辑序列长度为 1、5 和 20 时的规划成功率，离散分支对比连续 SIGReg 分支 | 长度为 20 时离散分支更高 | 两个分支均未达到 H3 阈值 |
| H14 | 确定性阶梯能够在不调用模型的情况下完成一部分任务。**依其预先登记的规则得到支持**：三次登记运行 [B30, B31, B32]，见表后报告 | 在一组登记任务中，公开的确定性阶梯（复用、按类型查找、确定性重写、有界枚举）在零次模型调用下完成的比例；每次完成都须通过检查器，且阶梯提交固定不变 | ≥ 10% 的登记任务，并报告完成每项任务的阶梯层级（登记阈值，保持不变）。实测：运行 1，120 个中的 118 个（98.3%），针对阶梯按构造可逆的变异；运行 2，151 个中的 31 个（20.5%），其中 27 个为守卫取反；运行 3，普通分支，151 个中的 111 个（73.5%），其中 110 个为守卫取反与重命名 | < 10% 的登记任务，与 RCE 论文的证伪项 RCE-F1 采用相同下限。三次运行均未达到。对于规则未特别针对的 41 个真实历史任务，运行 2 与运行 3 各完成 1 个（2.4%） |
| H15 | 在 40 个残余任务上，不同提议者类别存在差异。**已在以下各类上测量**：单次提议者 [B33]、`FormJEPA-v1` [B34]、有界检查器反馈的 `H15-Iterative` + `FormEBM-v2` [B35]，以及跨度归一化的 `FormEBM-v3` [B36]。单次模型通过 `17/40` 至 `34/40`；`FormJEPA-v1` 在 `k = 1` 时通过 `22/40`（使用 `FormEBM-v2` 时为 `25/40`；使用 `FormEBM-v3` 的 `E_def` 时，类型约束下为 `24/40`，多提议者下为 `27/40`），在 `k = 16` 时通过 `27/40`；`H15-Iterative` 在 `Opus 5.5` 与 `Sonnet 5.5` 上通过 **`40/40`（`100.0%`）**，无矛盾（在 `Grok 4.20` 上为 `39/40`）；热启动的 `DNULLMM1` Gear-0 以 **`0` 次调用**重放 **`40/40`**；三档 Cascade 对 `Zipf(0.85)` 到达的 `200/200` 次请求予以接受，Gear-2 回合减少 `16.67×`。扩散、进化以及墙上功率计分支仍待完成 | 来自 H14 运行 3 普通分支的 40 个残余任务中，闸门接受（`C(z) = 1`）的比例，由 `rce check`、义务保持性、`rce hash` 与 `rce equiv` 审计；并报告各分支份额及本地 `reported_j` [B33, B34, B35, B36] | 登记运行报告各分支份额及本地 `reported_j` [B33, B34, B35, B36]；扩散/进化分支与服务器墙上功率计的一致性仍待完成 | 各类别在不同任务上评分，或输出未经验证 |

<div id="h14-result" class="anchor-alias" aria-hidden="true"></div>

**H14，已测量。** 该梯子是 `rce repair` 的 openIE-dev/rce，梯级为上文提议者部分，枚举上限为 2000 个候选。它有三次运行，每次在运行前均已注册，三次运行的结果即为当前结果。运行 1 [B30] 在没有模型调用的情况下关闭了 120 项任务中的 118 项，但其 120 项任务中有 119 项是操作符和整数文字的变异，这在构造上限制了枚举的反转，且 118 项关闭中有 9 项在通过示例和检查后并非原始程序。运行 2 [B31] 没有操作符或文字变异：来自 openIE-dev/rce git 历史的 41 项更改，27 项 guard 否定和 83 项重命名，共计 151 项任务。它在没有模型调用的情况下关闭了其中的 31 项（20.5%）：41 项历史任务中的 1 项；全部 27 项 guard 否定，每一项均由删除 `not` 的枚举编辑实现，该编辑在构造上反转了该变异；以及 83 项重命名中的 3 项，均未恢复为原始程序。在 41 项历史任务中，39 项是因语言变更而更新的程序，而非缺陷；仅有 2 项是程序缺陷，梯子关闭了其中 1 项。若不计 guard 否定，则 124 项任务中有 4 项关闭（3.2%）。运行 2 的预测 P3，即 10% 到 40% 的重命名会关闭，未实现，其反例 F1 已满足：运行 1 的关闭率并未在真实历史的更改中延续。运行 3 [B32] 在 openIE-dev/rce `8a5d90ea` 上以不变的方式运行了运行 2 的 151 项任务，使用第 5 级梯级、重命名，在第 4 级之后；其注册记录表明第 5 级梯级是为运行 2 之后的重命名构建的。其普通臂，仅给出任务的梯子，关闭了 151 项中的 111 项（73.5%），且没有模型调用，其中 103 项恢复为原始程序：全部 83 项重命名（第 5 级 80 项，第 4 级 3 项），其中 77 项恢复；全部 27 项 guard 否定，结果同运行 2；以及 41 项历史任务中的 1 项，与运行 2 相同。若不计 guard 否定，则 124 项任务中有 84 项关闭（67.7%）。其已知良好臂为每个任务提供原始程序：关闭了 151 项中的 116 项，恢复 114 项，包括全部 83 项重命名恢复以及 41 项历史任务中的 6 项。运行 3 的预测 P6，即在已知良好臂中每个 guard 和历史任务保持其普通臂的结果，未实现：另外 5 项历史任务关闭，且普通臂中关闭的那项在第 5 级而非第 3 级关闭。运行 3 的六个反例均未满足，且梯子在两臂中报告的模型调用均为零。H14 的注册规则是：在已注册任务的 10% 或以上获得支持，且在公共确定性梯子在零模型调用下关闭的比例低于 10% 时视为伪造。普通臂满足这些条件。依据该规则，H14 获得支持：运行 3 的普通臂关闭了 151 项中的 111 项（73.5%），剩余 40 项来自 git 历史的未关闭残余任务。

<div id="h15-result" class="anchor-alias" aria-hidden="true"></div>

**H2、单次 H15 和 Shape D（`DNULLMM1`）Gear-0 在 40 项开放残差任务上的测量 [B33]。** 在执行前已注册（`rce-jepa-h15-and-shape-d-gear0-2026-11-22`，`sha256: b64c4c671ae85755...`），相对于 `openIE-dev/rce` 提交 `1762fb4b`（`2026-11-20`，二进制 `sha256: 1d3b0d07ff5b2e8f...`），这 40 项残差任务（`sha256: 3ca3a32769145e9b...`；`25` `W-SYN-1`，`5` `W-LEN-1`，`4` `W-NAME-1,W-TY-1`，`3` `W-NAME-1`，`1` `W-WORLD-1`，`1` `W-CAP-3,W-WORLD-1`，`1` `W-INT-1`）在严格门限谓词 `C(z) = 1` 下评估：(1) `rce check candidate.rce` 退出 `0`（强制 `W-UI-1` 和 `W-MUT-1` 非空），(2) `no_spec_deletion` 保留所有声明的 `state`、`event`、`error`、`struct`、`kind`、`fn`、`extern` 和 `step` 头部以及每个 `example` 左侧轨迹和突变体的 `check` 计数，(3) 通过 `rce hash`（`restored`）、`rce equiv fuel 2000`（`behaviour-equal`）和 `rce repair` 运行 `f` `observe` 模式进行二次等价审计。

| 臂 / 架构族 | 模型 | 调用次数 | 接纳数（`C(z)=1`） | 恢复 + 行为等价 | 输入 / 输出 Token | 成本（\$） | 片上 `reported_j` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Arm 0**：冷启动静态 Shape D Gear-0 | `DNULLMM1`（0 条记录）+ `a..e` | 0 | 0 / 40（0.0%） | 0 | 0 / 0 | \$0.0000 | < 0.001 J（37.7 µs） |
| **Arm 1a**：云端自回归 + 自适应思考 | `claude-opus-5-5` | 40 | **34 / 40（85.0%）** | 33（30 + 3） | 114,855 / 32,159 | \$1.3783 | `not_available`（N） |
| **Arm 1b**：云端自回归 + 自适应思考 | `claude-sonnet-5-5` | 40 | **32 / 40（80.0%）** | 32（30 + 2） | 114,855 / 30,764 | \$0.8060 | `not_available`（N） |
| **Arm 2c**：云端推理 Transformer | `xai:grok-4.20-0309-reasoning` | 40 | **31 / 40（77.5%）** | 30（28 + 2） | 76,546 / 18,474 | \$0.2747 | `not_available`（N） |
| **Arm 2a**：云端推理 MoE（Cerebras） | `cerebras:gpt-oss-120b` | 40 | **29 / 40（72.5%）** | 27（25 + 2） | 78,825 / 43,596 | \$0.1340 | `not_available`（N） |
| **Arm 3**：本地混合 Gated-DeltaNet + 稀疏 MoE | `Qwen3.6-35B-A3B`（量化 `Q5_K_M`） | 40 | **27 / 40（67.5%）** | 26（25 + 1） | 82,330 / 18,411 | \$0.0000 | **3,369.89 J** 被测系统（`124.81 J/adm`） |
| **Arm 2b**：云端多头潜在注意力（MLA）稀疏 MoE（Fireworks） | `deepseek-v4p1-flash` | 40 | **17 / 40（42.5%）** | 16（15 + 1） | 63,446 / 64,215 | \$0.0930 | `not_available`（N） |
| **Arm 5a**：专门训练的潜在 Form JEPA（`k = 1`）[B34] | `FormJEPA-v1`（`8.42M` 参数，贪心解码） | 40 | **22 / 40（55.0%）** | 22（20 + 2） | Form S 表达式 | \$0.0000 | **58.65 mJ** 核心 / **1.19 J** 封装 RAPL/prop |
| **Arm 5b**：专门训练的潜在 Form JEPA（`k = 16`）[B34] | `FormJEPA-v1`（`8.42M` 参数，潜在束搜索） | 40 | **27 / 40（67.5%）** | 27（25 + 2） | Form S 表达式 | \$0.0000 | **474.76 mJ** 核心 / **6.74 J** 封装 RAPL/prop |
| **Arm 6**：三档级联 v1（`t = 1` 冷启动 Gear-0 → `FormJEPA-v1` → 单次 `Opus 5.5`）[B34] | `DNULLMM1` + `FormJEPA-v1` + `Opus 5.5` | 13 G2 | **34 / 40（85.0%）** | 33 | Form + 13 次云端调用 | **\$0.8108** | `FormJEPA` RAPL + 13 次云端调用（N） |
| **Arm 4a**：温启动 Gear-0 v1（`t = 2` 回放）[B33] | `DNULLMM1`（34 个已结晶） | **0** | **34 / 40（85.0%）** | 33 | 0 / 0 | **\$0.0000** | **0.325 µs / 1.77 µJ** 探针 + `rce check` |
| **Arm 7a**：有界检查器反馈 + 标准库头文件（`<= 5` 轮）[B35] | `claude-opus-5-5`（`H15-Iterative`） | 42 | **40 / 40（100.0%）** | 39（34 + 5） | 133,527 / 45,711 | \$1.8104 | `not_available`（N） |
| **Arm 7b**：有界检查器反馈 + 标准库头文件（`<= 5` 轮）[B35] | `claude-sonnet-5-5`（`H15-Iterative`） | 43 | **40 / 40（100.0%）** | 39（35 + 4） | 137,385 / 46,668 | **\$1.1122** | `not_available`（N） |
| **Arm 7c**：有界检查器反馈 + 标准库头文件（`<= 5` 轮）[B35] | `xai:grok-4.20-0309-reasoning`（`H15-Iterative`） | 50 | **39 / 40（97.5%）** | 37（30 + 7） | 269,930 / 28,903 | \$4.0555 | `not_available`（N） |
| **Arm 4b**：温启动 Gear-0 v2（`t = 2` 完整回放）[B35] | `DNULLMM1`（40 个已结晶） | **0** | **40 / 40（100.0%）** | 39（34 + 5） | 0 / 0 | **\$0.0000** | **0.325 µs / 1.77 µJ** 探针 + `rce check` |

- **假设 H2 得到支持（本地检查相对于模型的能量优势为 1,718 倍）：** 在 Apple M5 Max 上，逐表单检查成本 `C_check = 0.049038 J`（L3 `ri_energy_nj`，`7.32 ms`），而一次本地 `Qwen 3.6 35B-A3B` 候选生成成本 `E_model = 84.247 J`（`3,303.62 J` L2 GPU + `66.26 J` L3 `llama-server` PID，跨 40 个候选；`14,476.18 J` 粗略 L2 SoC，`derived_marginal_j` 被 Falsifier 6 在 `68.31%` 空闲漂移时作废），得到 **`C_check / E_model = 0.000582 <= 0.05`**（`measured_j = None`，`board_metered = false`）。
- **形状 D（`DNULLMM1`）Gear-0 延迟、能量、无名不变性以及 `Zipf(0.85)` 摊销：** 对 40,000 次便携式操作系统接口（POSIX）`mmap` 查询针对冻结的 34 条记录存储（`sha256: d92a57b40de0b0ec...`，验证前后字节完全相同），平均探测延迟为 **`0.3246 µs`**（`324.6 ns`，`9,516.5` 条指令）和 **`1.771 µJ`**（`1,771.3 nJ` L3 `ri_energy_nj`）。按 `rce fmt nameless`（定理 T7）对槽位进行键控时，当本地变量进行 α 重命名时，可实现 **`7 / 9`（`77.8%`）** 的零调用命中率。在经验证的仅结晶化的 `Zipf(s = 0.85)` 递归流中，200 次到达的情况下，2-Gear `DNULLMM1` 将模型调用从 `200` 减少至 **`48`（`4.17×` 缩减）**，对应 `Opus 5.5`（`$6.81` 降至 `$2.63`；`5.41×` / `37` 次调用伴随未命中去重），`Sonnet 5.5` 为 `56`（`3.57×`），`Grok 4.20` 为 `57`（`3.51×`），`GPT-OSS-120B` 为 `66`（`3.03×`），本地 `Qwen 3.6` 为 `94`（`2.13×` 调用，**`1.56×` 本地能量降低**：`16,457.9 J` 降至 `10,553.5 J`）。
- **关于 H15 的范围披露：** 40 条历史原始记录中有两条早于 `W-MUT-1` 空洞示例规则（`spec/examples/57_float_vectors.rce@b2b932da` 和 `programs/multi/washer.rce@2cc82de7`），占接近 `34/40` 上限的一部分。扩散代码模型、进化表单搜索以及硬件墙表计 `measured_j` 仍保持开放。

<div id="form-jepa-and-rung-f-result" class="anchor-alias" aria-hidden="true"></div>

**`FormJEPA-v1` 潜在 Form 修复提议器、三档级联与 151 项任务 `rce repair` 第 `f` 级晋升审计，实测 [B34]。** 预先注册于数据集生成、权重初始化和第 `f` 级执行之前（`rce-jepa-form-jepa-v1-2026-11-22`，`sha256: 22682e6e936ec120...`；`rce-repair-rung-f-wave3-eval-2026-11-22`，`sha256: 04aff4b2b44cdbea...`），针对 `openIE-dev/rce` 提交 `1762fb4b`（Linux x86_64 二进制 `sha256: 5ef9931ff23a310f...`）。`FormJEPA-v1`（可训练参数 `8,424,073` 个，含 EMA 目标缓冲区为 `13,917,577` 个；检查点 `sha256: cbfbf2274175c737...`）以随机初始化（`seed = 20261122`）开始训练，所用数据为 `6,329` 个经检查器验证的缺陷对，覆盖 `1,106` 个互不重叠的有效 Form 形状。这些形状取自 `1,387` 个唯一 Form 形状，经四层路径、slug、声明名称及 `458` 个摘要的 `rce fmt nameless` 排除后得到，与 151 项阶梯任务或 40 项残余任务的重叠数为 `0`。该模型将一个 6 层 Pre-LN Transformer 上下文编码器（`d = 256`，作用于商归一化的 Form AST S 表达式词元）与一个 EMA 目标编码器（`τ = 0.996`）配对，并使用 3 层残差 MLP 潜在预测器，训练时采用 Smooth-L<sub>1</sub> 损失以及 VICReg 方差-协方差防坍缩正则化。训练后，上下文有效秩由第 0 轮的 `32.90` 提升至 **`85.24`**，坐标标准差由 `0.1038` 增至 `0.3830`，正例对的潜在 L<sub>2</sub> 能量由 `149.25` 降至 `10.57`，随机对则为 `13.02`。此外，模型包含一个 2 层、以潜在变量为条件的类型化编辑解码器，其候选按 `||z_hat_y - E_ema(y_cand)||_2^2` 重新排序。

- **离散合成、151 阶梯和 40 残差任务的准确率随模型规模变化:** 在 `200` 个未见 `shape_hash` 的离散合成 Form 缺陷上，`FormJEPA-v1` 在 `k = 1` 时取得 **`156/200` (`78.0%`)**，在 `k = 16` 时取得 **`177/200` (`88.5%`)**。在 151 任务阶梯（普通臂）上，单独的 `FormJEPA-v1` 在 `k = 1` 时取得 `27/151`，在 `k = 16` 时取得 `57/151`，将组合确定性阶梯（`111/151`）加上 `FormJEPA-v1 (k = 16)` 提升至 **`138/151` (`91.4%`)**，且未调用任何前沿函数。在 40 项开放残差任务（H15）上，`FormJEPA-v1` 在 `k = 1` 时取得 **`22/40` (`55.0%`)**，在 `k = 16` 时取得 **`27/40` (`67.5%`)**（`25` 项恢复 + `2` 项行为相等 = `27/27` 行为相同，平均每任务 `5.33` 次 `rce check` 调用），匹配本地 `Qwen 3.6 35B-A3B`（`27/40`）在结构化语法、长度方法和能力修复（`24/25` `W-SYN-1`，`2/5` `W-LEN-1`，`1/1` `W-WORLD-1`）上的表现，同时关闭 `0/9` 多模块密码学标准库迁移（`W-NAME-1` / `W-TY-1` 涉及 `hpke`、`mls`、`pq`、`pqxdh`、`energy`），复合任务 `W-CAP-3,W-WORLD-1`，以及在 Gear-2 前沿提议仍然必需的空示例合成任务。

- **推理 `reported_j`、3-Gear 级联以及诚实的 H5/H11 诊断:** 在 AMD Ryzen AI Max+ 395 Linux `powercap` RAPL 计数器（`measured_j = None`，`board_metered = false`，`derived_marginal_pkg_reported_j = None`，在 Falsifier 6 下 `33.38%` 共租包漂移）中，每个提议的 CPU 推理成本为 **`58.65 mJ`** RAPL 核心（`1.194 J` 整体封装，`10.15 ms`）在 `k = 1` 时，以及 **`474.76 mJ`** RAPL 核心（`6.736 J` 整体封装，`67.51 ms`）在 `k = 16` 时，分别比本地 35B 候选模型（`84.25 J`）低 `70.6×` 到 `1,436×`（`k = 1` 时 `12.5×` 到 `177.5×`，`k = 16` 时）。将 `FormJEPA-v1 (k = 16)` 作为 Gear 1 插入 `DNULLMM1` Gear 0 与 `Claude Opus 5.5` Gear 2 之间，可保持 `34/40` 单通路闭合，同时将 `Opus 5.5` 的调用次数从 `40` 降至 `13`（`$1.38` 到 `$0.81`），在 `200` 条 `Zipf(0.85)` 流中将 Gear-2 前沿调用从 `200`（无状态）和 `48`（2-Gear）削减至 **`23` 次（`8.70×` 缩减；`152` Gear-0 命中，`25` Gear-1 接纳，`7` Gear-2 接纳）**；使用本地 `Qwen 3.6` 作为 Gear 2 时，`Zipf(0.85)` 35B 调用降至 `49`（`4.08×` 缩减），接纳的到达次数从 `141/200` 增至 `154/200`。未校准的负 Latent L<sub>2</sub> 距离单独即可在 `925` 条束候选上获得 AUROC **`0.618`**（H5 结果不确定：高于 `0.60` 否定下限，低于 `0.85` 支持上限），并随累计编辑距离 `0..4` 上升（`0.00, 0.99, 2.26, 3.27, 3.89`，随后在 `d = 5` 为 `3.72`；`18/50 = 36.0% < 80%` 严格 5 步单调性在 H11 上），表明此处的修复准确率来源于将类型化编辑解码器条件化于 `(z_x, z_hat_y)`，而非仅靠平滑的未校准潜在能量。

- **151 任务 `rce repair` 阶梯 `f` 提升判决:** 在 `observe` 模式下运行 `rce repair`（`bound 2000`，针对每个任务的已知良好原始文件和外部提议文件）遍历全部 151 阶梯任务，并依据 2026 年 11 月 3 日注册的 `rce repair` 标准（`sha256: abf7f131f240e3f9...`）评估 `rce repair criterion`，记录 `116/151` 项精确闭合（由阶梯 `a..e` 完成）以及 `35` 项未完成任务（`25` 项不可解析的 `W-SYN-1` 文件因规则 RF-2 被跳过，`10` 项开放解析任务判定为缺失覆盖为 `0`）。在合并外部提议（`FormJEPA-v1` + 已记录的 H15 修复，共计 `91` 项提议）下，阶梯 `f` 观察到 **`3` 项接纳任务**（`hpke`、`mls_key_schedule`、`energy`），**`3/3`（`100.0%`）** 通过 `W-MUT-1` 突变门，并且 **`0`** 与已知良好原始相冲突（`3/3` 已恢复）；由于 `3 / 119 = 2.5% > 2.0%`，`rce repair criterion` 返回 **`holds: false`**（`exit = 1`），保持阶梯 `f` 处于 `observe` 模式。

![左：通过 Gear 0 DNULLMM1（40/40 预热重放）、Gear 1 FormJEPA-v1 加 FormEBM-v2、以及 Gear 2 H15-Iterative 在确定性提交门后产生的三个齿轮残差级联，从精确梯级 `a` 到 `e`（共 200 次 Zipf(0.85) 到达）。右：测量得到的 FormEBM-v2 H5 ROC 曲线（AUROC 0.8922 对比 Siamese L2 0.7208）以及 H11 5 步编辑距离能量图（严格单调性 93.0%，Spearman rho 0.9931）](/figures/rce-jepa/three-gear-and-ebm.svg)

*图 10. 测量的三齿轮残差级联及 `FormEBM-v2` 潜在能量诊断，位于 `openIE-dev/rce` 提交 `1762fb4b` [B35]。左：确定性梯级 `a..e`（`111/151`），Gear 0 `DNULLMM1`（`40/40` 预热零调用重放），Gear 1 `FormJEPA-v1` + `FormEBM-v2`，以及 Gear 2 `H15-Iterative` 由 `rce check` + `W-MUT-1` + `no_spec_deletion` 门控（`200/200` 在 `Zipf(0.85)` 上被接受，出现次数比 Gear-2 少 `16.67×`）。右：未见形状 H5 ROC 曲线（`AUROC = 0.8922`）和未见链路 H11 5 步累计缺陷能量曲线（严格单调性 `93.0%`，IQR 阴影）。交互式浏览器：[/living/rce-jepa/](/living/rce-jepa/).*

<div id="form-ebm-and-h15-iterative-result" class="anchor-alias" aria-hidden="true"></div>

**对比式多步间隔能量评分器（FormEBM-v2，H5 与 H11）与 40/40 有界检查器反馈残差闭合（H15-Iterative + Gear-0 v2），测量结果 [B35]。** 两项针对性评估均在语料生成、权重初始化和 API 执行之前预先注册（rce-jepa-form-ebm-v2-2026-11-23，sha256: 128f17e69361ea89...；rce-jepa-h15-iterative-2026-11-23，sha256: a7774d3bd03ae450...），并基于 openIE-dev/rce 提交 1762fb4b（Linux x86_64 二进制文件 sha256: 331464496009d98a...）进行。两项评估分别检验：(A) 在完全相同且严格不相交的 1,387 个 Form 划分上，以对比式加成对编辑深度间隔能量头取代未经校准的坐标距离，能否闭合 H5 与 H11；(B) 提供公开的 stdlib/lib 模块头文件以及有界的确定性检查器诊断信息（max_turns = 5，完全不访问 original），能否闭合单次 H15 遗留的六个残余任务。

- **`FormEBM-v2` 架构、分词器修复，以及未见形状的 H5 / H11 结果（`137` 个未见测试 Form 形状，`0` 重叠）：** 两个结构性原因解释了 `FormJEPA-v1` 在 H5 上仅达到 `0.618` AUROC、在 H11 上仅达到 `36.0%` 严格 5 步单调性的原因。其一，其单文件 S 表达式分词器把活跃但未使用的绑定（`let x`，被 `W-UNUSED-1` 拒绝）与下划线前缀绑定（`let _x`，被接受）映射到同一个 `<ID:k>` 槽位，并且每当出现未绑定标识符时都会移动后续 `<ID:j>` 的索引。其二，其坐标式 Smooth-L<sub>1</sub> 损失不包含对比有效性或编辑深度间隔。`FormEBM-v2` 拥有 `5,851,649` 个可训练参数，检查点 `sha256: 2204a0b9cbd0d96c...`，在 AMD Ryzen AI Max+ 395 / Radeon 8060S APU 上训练耗时 `857.2 s`，核心 RAPL 为 `5,375.0 J`，APU 封装 RAPL 为 `40,602.4 J`。它引入了以参考为锚点的 `PairFormTokenizer`（`504` 个活跃令牌，区分下划线前缀绑定、新引入的标识符槽位，以及模 32 的整数类别，并使用纯句法的差异标签且不调用检查器）、一个 5 层共享孪生 Transformer、一个 1 层交叉注意力 RMS 差分模块，以及一个 softplus 能量头。该能量头仅在 `1,106` 个训练 Form 上训练，使用 `5,955` 个有效性间隔三元组（`m = 1.0`）和 `600` 条 5 步累积破坏链（`γ = 0.50(j − i)`）。VICReg 有效秩在 `z_ref` 上由 `26.48` 扩展到 `55.70`，在 `z_cand` 上由 `46.44` 扩展到 `74.72`。在 `137` 个未见的留出测试 Form 形状上：
  - **H5（`N = 200` 个未见测试束，`3,064` 个候选）：** 标量能量达到 **AUROC `0.8922 >= 0.85`**（对比 `FormJEPA-v1` 的 `0.6180` 和未校准孪生 L<sub>2</sub> 的 `0.7208`）。在不对束内条目调用 `rce check` 的前提下（`k = 1`），前一位有效选择率从未重排序时的 `22.5%`（`45/200`）和孪生 L<sub>2</sub> 的 `25.0%`（`50/200`）提升至可解束上的 **`84.05%`**（`137/163`；全部 `200` 个束的原始率为 `68.50%`）。同时，首个有效 Form 所需的平均 `rce check` 调用次数降低了 **`2.39×`**（每束 `3.577` 次降至 `1.497` 次）。十线程 CPU 打分每个候选的核心 RAPL 成本为 **`47.09 mJ`**（`6.30 ms`）；每个 16 项束的核心能耗为 `752.03 mJ`，封装总能耗为 `11.88 J`。在 Falsifier 6 下，由于 `13.7%` 的空闲漂移，`derived_marginal_pkg_reported_j = None`。
  - **H11（`N = 100` 条未见的 5 步累积缺陷链）：** 严格 5 步单调性（`E_0 < E_1 < E_2 < E_3 < E_4 < E_5`）从 `FormJEPA-v1` 的 `36.0%` 和孪生 L<sub>2</sub> 的 `18.0%` 提升至 **`93.0%`（`93/100 >= 80%`）**。平均 Spearman 秩相关系数为 **`ρ = 0.9931`**（中位数 `1.0000`），在 `d = 0..5` 上的平均能量为 `[0.0007, 2.36, 5.16, 7.99, 12.21, 17.25]`，且没有 `d = 5` 的回绕。
  - **坦率的领域边界：** 在无约束的 5 步随机游走（`N = 50`）上，允许对已损坏的行进行两次覆写而不增加新的 AST 缺陷，平均能量仍从 `0.0007` 攀升至 `7.07`（平均 `ρ = 0.8513`，中位数 `0.9429`），但逐步严格递增的比例仅为 `38.0%`（非递减比例为 `46.0%`）。对 OOD 的 `40` 个任务 git 历史残差的零样本迁移，使任务内 `k = 1` 类型化编辑的通过数从 `FormJEPA-v1` 的 `22/40` 提升至 `25/40`（束容量为 `30/40`）。然而，跨任务合并 AUROC 反转为 `0.2630`（在 `332` 个多提议者候选上为 `0.2585`），原因是单行编辑深度训练会给大型有效多行标准库迁移分配比 1 个令牌的句法编辑更高的原始能量。
- **`H15-Iterative` 有界检查器反馈 + 公开 `stdlib/lib` 头文件（`40 / 40` 已关闭，`0` 处矛盾，`40 / 40` Gear-0 重放）：** 为导入的 `stdlib/lib` 模块（`crypto.cat`、`crypto.unhex`、`crypto.tohex`、`core.bytes`、`pq`）提供公开声明签名（`pub const`、`pub struct`、`pub kind`、`pub fn`，函数体已剥离，严格排除任务文件本身），并在最多 `max_turns = 5` 的范围内提供逐字的确定性 `rce check` 与 `W-MUT-1` 诊断（且不访问 `original`），可将准入率从单次尝试的 `34/40` 提升至 **`40/40`（`100.0%`）**。这一结果在 **`Claude Opus 5.5`** 上成立（第 1 轮 `38` 个，第 2 轮 `2` 个；共 `42` 次调用，`1.8104 美元`；`34` 个精确恢复加 `5` 个行为等价，即 `39` 个行为一致，**`0` 处矛盾**），在 **`Claude Sonnet 5.5`** 上亦然（第 1 轮 `38` 个，第 2 轮 `1` 个，第 3 轮 `1` 个；共 `43` 次调用，**`1.1122 美元`**；`35` 个精确恢复加 `4` 个行为等价，**`0` 处矛盾**）。在 **xAI Grok 4.20 Reasoning** 上为 **`39/40`（`97.5%`）**（第 1 轮 `35` 个，第 2 轮 `2` 个，第 3 轮 `2` 个；共 `50` 次调用，`4.0555 美元`，**`0` 处矛盾**）。此前未解决的四个密码学迁移（`stdlib/lib/hpke.rce`、`stdlib/lib/mls.rce`、`stdlib/lib/pq.rce`、`programs/ecosystem/pqxdh.rce`）全部实现了**精确哈希 `restored`**（在 `Opus 5.5` 和 `Sonnet 5.5` 上于第 1 轮完成，在 `Grok 4.20` 上于第 1 至 3 轮完成）。两个历史上存在 `W-MUT-1` 之前空洞示例问题的任务（`57_float_vectors.rce`、`washer.rce`）均在 `rce equiv fuel 2000` 下以 **`behaviour-equal`** 关闭（仅 `washer.rce` 在 `Grok 4.20` 上经过 5 轮后仍未关闭）。将全部 40 个已验证修复固化为 `DNULLMM1` Gear-0 v2（`sha256: 80cf265038bcd5eb...`）后，重放可达 **`40/40`（`100.0%`）**，且**模型调用为 `0` 次**。在更新后的三档 `Zipf(0.85)` 请求流（`M = 200` 个到达）中，系统准入了 **`200/200`（`100.0%`）** 的到达请求，其中包括 `163` 次 Gear-0 命中、`25` 次本地 Gear-1 准入，以及 `12` 个 Gear-2 片段，共消耗 `14` 轮 API 调用，费用为 `0.9822 美元`。与无状态的 `200` 次调用相比，片段数减少了 **`16.67×`**。

<div id="form-ebm-v3-result" class="anchor-alias" aria-hidden="true"></div>

**跨度归一化的双头分解评分器（`FormEBM-v3`，H5、H11 以及零样本 OOD H15 跨跨度迁移），测量值 [B36]。** 在合成多跨度对生成、权重初始化和评估之前预先注册（`rce-jepa-form-ebm-v3-2026-11-23`，`sha256: cb7ee1ac8dc5c594...`），针对 `openIE-dev/rce` 提交 `1762fb4b`（Linux x86_64 二进制文件 `sha256: 386be0c26389550e...`），`FormEBM-v3`（`6,052,802` 个可训练参数，纯 `float32` ROCm `Radeon 8060S` 检查点 `sha256: 71e642f1bb0b9c06...`；训练耗时 `2,528.3 s`，核心 RAPL 能耗 `13,312.3 J`，APU 封装 RAPL 能耗 `48,422.2 J`）测试是否将缺陷有效性与累积编辑深度在完全不相交的相同 `1,387` 形式拆分（`1,106` 训练、`144` 验证、`137` 未见测试形状；与 151 阶梯或 40 个 H15 任务 `0` 重叠，且评分期间 `0` 次 `rce check` 调用）上解耦，能够解决 `FormEBM-v2` 的跨任务 OOD 编辑大小反转（`0.2585`），同时不使 H5 或 H11 性能退化：

- **支持对齐的分词与双头分解:** `PairFormTokenizerv3`（`max_seq_len = 384`，`560` 个活跃 token）用行移位不变的序列对齐取代原始行索引比较，将词法绑定/导入的新标识符（`<BOUND_NEW_ID:0..31>`）与未绑定的自由符号（`<UNBOUND_NEW_ID:0..15>`）分离，并计算显式归一化的差分比例 `ρ_diff = Δ_tok / max(1, L_cand)`。在共享的 5 层 Siamese 编码器和交叉差分块上，跨度不变缺陷头 `E_def(x, y, r) = softplus(g_def(feats_def))`（在束内加所有对跨任务批次 margin `m = 2.5`，并使用 L<sub>2</sub> 正锚，对 `4,983` 对包括 `219` 个 `k = 2..10` 多跨度有效重写（严格来源于 `train_forms`）进行训练）与累计腐败深度头 `E_depth(y_0, y_d) = softplus(g_depth(feats_depth))` 分离，通过 `E_total = E_def + 0.15 · E_depth / log2(2 + Δ_tok)` 组合（VICReg 有效秩 `42.79` 在 `z_ref` 上，`57.93` 在 `z_cand` 上，坐标标准差 `0.3332 / 0.3113 >= 0.25`）。
- **强化未见形状 H5 (`0.9437`) 与未见链路 H11 (`94.0%` / `92.0%`):** 在 `200` 条未见保留测试束（`3,064` 个候选）上，`FormEBM-v3` 将 **H5 AUROC 从 `0.8922`（`FormEBM-v2`）提升至 `0.9437 >= 0.85`**（单独 `E_def` 为 `0.9386`，在 `FPR = 4.6%` 时达到 `TPR = 78.9%`），实现 **`83.44%`（`136/163`，`E_def`）和 `80.98%`（`132/163`，`E_total`）的可解 top-1 准确率**（均 `>= 80.0%`；`1.601` / `1.669` 次平均 `rce check` 调用 vs `3.577` 次未重新排序），并将 **H11 在 `100` 条未见腐败链上严格的 5 步单调性提升至 `94.0%`（`E_depth`，Spearman `ρ = 0.9966`，中位数 `1.0000`）以及 `92.0%`（`E_total`，`ρ = 0.9846`，中位数 `1.0000`）**。十线程 CPU 在 `max_seq_len = 384` 时每个候选的核心 RAPL 能耗为 `232.45 mJ`（`32.55 ms`，比本地 35B 生成低 `362×`；`derived_marginal_pkg_reported_j = None` 在 `37.7%` 同租户包漂移）。
- **零-shot OOD H15 反演已解决 (`0.2585 → 0.5278`)，以及跨模块候选:** 将零-shot 转移至 `40` 任务 git 历史残差（`303` 个多提议者候选，涵盖所有 `40/40` 封闭的多百行 `hpke`、`mls`、`pq` 与 `pqxdh` 迁移），`FormEBM-v3` 将跨任务 pooled AUROC 从 `0.2585`（`FormEBM-v2`）提升至 **`0.5278`**（提升 `+0.2693`，清除 falsifier F4 `> 0.50`；在 Δ_tok ≥ 10 的大跨度有效重写上为 **`0.6018`**，相较于短 `0/1` token 无效候选），并在 `286` 项 typed-edit 池上从 `0.2630` → `0.4985`，同时在 `E_def` 下实现 **`27/40` 多提议者和 `24/40` typed-edit 任务内 `k = 1` 接受**（`E_total` 下为 `25/40` 与 `22/40`），将平均 typed-beam 检查次数从 `5.55` 降至 `5.10`。在 `279` 行 `stdlib/lib/hpke.rce` 迁移（`Δ_tok = 146`）上，有效能降至 `E_total = 0.9645`（`E_def = 0.8826`），但在未见多模块密码 API（`mls.rce`、`pq.rce`、`pqxdh.rce`）和 vacuous-example 义务（`washer.rce`）上，零-shot pooled 校准仍停留在约 `0.53`，因为单文件语法未导入 `stdlib/lib` 类型签名或精确 `rce trace` 回滚，无法验证跨模块调用合约。

<div id="falsifiers" class="anchor-alias" aria-hidden="true"></div>

### 对前提本身的证伪者 RJ-F1 至 RJ-F6

每个伪造者都是一种会削弱前提部分的观测；其中若干以上述假设的形式给出（RJ-F3 对 H3，RJ-F4 对 H11，RJ-F6 对 H3 和 H10）。

| 编号 | 观察结果 | 所否定的主张 |
| --- | --- | --- |
| RJ-F1 | 穷尽构造列表后，在五种目标语言中的任一种上，提升覆盖率都停滞于 80% 以下 | 「可由 RCE 生成全部代码」的主张，以及面向 Form 的自主编码的适用范围 |
| RJ-F2 | 为 7 个参考应用编写 σ(I) 所需的人时成本，高于手工编写其 Form | 「闭合消除了规约成本」的主张（实际上只是转移了规约成本） |
| RJ-F3 | 在同一门限下，H3 失败而词元分支通过 | Form 空间上的潜在提议；门限依然成立，JEPA 的一半不成立 |
| RJ-F4 | H11 失败，且搜索在束预算内未能到达被接受的 Form | Form 空间中的能量引导规划（在未见过的累计 1..5 缺陷链上未被触发：`FormEBM-v2` 达到 `93.0%`，`FormEBM-v3` 达到 `94.0%` 的 `E_depth` 与 `92.0%` 的 `E_total` 严格单调性，H5 AUROC 为 `0.9437`；跨模块签名/轨迹的 OOD 能量校准超出 `0.5278` 的部分仍待解决） |
| RJ-F5 | 决策头的校准从未超过基于形状哈希的频率表 | 决策模型一支；相较于已提升处理器的统计数据，它并无增益 |
| RJ-F6 | 以执行轨迹训练的 CWM 类词元空间模型，在能量相同且以同一门限作为接受规则的条件下，能够解决 H14 第 3 轮普通分支残留的 40 个任务 | 在训练/提议阶段，Form 商（quotient）对提议者有增益的主张（注：对于 Gear-0 复用，`rce fmt nameless` 已可在 0 次调用下恢复 `7/9` 个 alpha 重命名；与 H3/H10 的训练型提议者对等性，有待训练好的 JEPA 分支后方可评估） |

如果 H4 失效（每个接受的程序没有焦耳优势）或 H6 失效（表单无法表达参考应用），则整体论点被否定。任一单独失效即足以否定。

<div id="what-will-be-delivered" class="anchor-alias" aria-hidden="true"></div>

### 将交付的成果

范围，组织为平行工作流，在评估平台汇合。每个交付物要么生成表单，要么生成提出表单的模型，或测量结果。

- **W1. 表单语料库和数据集卡。** 表单与意图陈述和检查器判决配对，来源于手写表单、参考应用表单和检查器验证的变体；卡片涵盖来源、许可证、规模分布、负例生成、已知缺口和污染控制；H1 的规范序列化。
- **W2. 编码器和预测器。** 意图编码器、EMA 表单目标编码器、表示空间预测器以及能量头 E(intent, P)，配备防崩塌措施、嵌入空间与标记空间损失消融实验，及带有测量训练能量的模型卡。
- **W3. 检查器约束解码器。** 语法约束的候选表单按能量排序后提交给检查器，生成 requires-change 诊断，每条诊断标明其规则，在固定的重试预算下反馈；检查器是唯一的接受权威，且无绕过路径至引擎。
- **W4. 意图到表单基准。** 单元和复合任务，参考应用（游戏引擎、文本编辑器、视频播放器、聊天应用、浏览器、终端）以及 RCEdb；每个任务包含意图、参考表单、回放轨迹以及等价的源语言基线任务；使用留出划分。
- **W5. 以焦耳计量的评估平台。** 两个分支在相同硬件和任务上运行；pass@1、pass@k、ρ、C<sub>check</sub>、J<sub>acc</sub>、K<sub>acc</sub>、每次接受的重试次数、能量排序 AUROC；无根计数器（`reported_j`）、空闲漂移 Falsifier 6 门控、原始日志保留、不可用的云计数器报告为 `not_available` 而非估计值。
- **W6. 研究文章。** 本案例扩展至 H1 到 H15 的结果，包括负面结果、图表、表格和可复现性说明。
- **W7. 开放制品。** 公开：表单规范、参考检查器及其发射器、基准任务和轨迹、平台、数据集和模型卡，以及在许可证允许的情况下的权重。仅在所有复现所需材料均公开时才报告数字。
- **W8. 演示。** 将声明的意图映射到预测表单再到检查器判决（包括显示的 requires-change 判决），随后回放并由参考检查器以两种语言输出代码，屏幕上显示焦耳读数。

<div id="status" class="anchor-alias" aria-hidden="true"></div>

## 状态

研究主题（开放），于 2026 年 11 月 23 日依据 `openIE-dev/rce` 提交 `f87d6af2`（2026 年 11 月 23 日；跨 `64` 个模块、由 `1,264` 条源代码声明生成的 `5,393` 个 Lean 4.36.0 定理常量，涵盖定理 T1 至 T63，经 `lake check --paranoid` 的全部六个独立证明检查器验证通过，`2,221/2,236` 项一致性测试通过且 `0` 项失败，`837` 项 Rust 检查器单元测试；实证基准测试针对 `1762fb4b` 注册；交互式观测台见 [/living/rce-jepa/](/living/rce-jepa/)）更新。

第 0 阶段的确定性基线已完成测量。H1 在手工编写的程序总体上获得支持：185 个程序的中位 rho 为 `9.34`（W1 第 1 版为 173 个程序，结果为 `9.31`）。H8 在六个目标上的 `10,500` 条种子事件流中获得支持，`0` 次不一致（`rce/bench/determinism/`）。H7 的模糊测试分支在 `1,275` 个通过检查器的变异体中发现 `0` 次不变式违反（`rce/bench/adversarial/`）。H14 在 `rce repair` 的三次注册运行 [B30, B31, B32] 中获得支持：在第 3 次运行的基础方案中，共关闭 `111/151` 项任务（`73.5%`），且未进行任何模型调用；另有 `40` 项git历史遗留任务仍未关闭。

2026 年 11 月 22 日至 23 日 [B33, B34, B35, B36]，基于 Apple M5 Max 与 AMD Ryzen AI Max+ 395 / Radeon 8060S 的 `reported_j` 凭据（`measured_j = None`，`board_metered = false`），H2 获得支持：`C_check / E_model = 0.04904 J / 84.25 J = 0.000582 <= 0.05`，成本降低为 `1,718×`；62 个 Form 的完整检查、运行与输出套件耗能 `15.44 J`。训练并评估了 **`FormJEPA-v1`**（`8.42M` 参数）：在 `200` 个未见过的合成缺陷中正确识别 `177` 个；在 H15 上，`k = 1` 时为 `22/40`，`k = 16` 时为 `27/40`，单次能耗为 `58.65-474.76 mJ`（RAPL 核心 `reported_j`）。对比式 **`FormEBM-v2`**（`5.85M` 参数）：H5 AUROC `0.8922 >= 0.85`，可解问题的 top-1 准确率为 `84.05%`；H11 在严格的 5 步单调性上达到 **`93.0% >= 80%`**，Spearman 相关系数为 `0.9931`，每个候选的核心 `reported_j` 为 `47.09 mJ`。经跨度归一化并分解的 **`FormEBM-v3`**（`6.05M` 参数，使用完全相同且互不重叠的 `1,387` 个 Form 划分）：H5 AUROC `0.9437 >= 0.85`，基于 `E_def` 的可解问题 top-1 准确率为 `83.44%`，基于 `E_total` 的为 `80.98%`；H11 在 `E_depth` 上的严格 5 步单调性为 **`94.0%`**（Spearman `0.9966`），在 `E_total` 上为 **`92.0%`**（Spearman `0.9846`）；零样本 OOD 的 H15 多提议者汇总 AUROC 由 `0.2585` 提升至 **`0.5278`**，其中大跨度有效改写与短跨度无效改写之间为 `0.6018`，每个候选的核心 `reported_j` 为 `232.45 mJ`。在 **`H15-Iterative`** 中，于有界的 `<= 5` 轮检查器反馈，并提供公共 `stdlib/lib` 签名头的条件下，**`Claude Opus 5.5`**（`1.81` 美元）与 **`Claude Sonnet 5.5`**（`1.11` 美元）关闭了 **`40/40`**（`100.0%`）项遗留开放任务，且 `0` 次矛盾（`xAI Grok 4.20 Reasoning` 为 `39/40`）。全部 `40/40` 项已固化为 **`DNULLMM1` Gear-0 v2**（`0` 次模型调用，探测耗时 `0.325 µs`，能耗 `1.77 µJ`）；在 `200/200` 个 `Zipf(0.85)` 的 3-Gear 流式准入中，Gear-2 的回放次数减少为 `16.67×` 分之一。对 151 项任务的 `rce repair` 第 `f` 级晋升进行了审计：`3/119 = 2.5% > 2.0%`，其中 `3/3` 通过 `W-MUT-1`，且 `0` 次矛盾，确认第 `f` 级仍处于观察模式。

仍未完成的工作包括：完整的意图到 Form 的合成（H3）；端到端焦耳级对等（H4）；超出 `0.5278` 的跨模块签名与轨迹 OOD 能量校准，适用于多模块 git 历史改写；参考应用编码（H6）；成本表预测（H9）；商数样本效率（H10）；门控凭据决策头校准（H12）；离散与连续长时程规划的对比（H13）；扩散与进化式 H15 分支；以及外部硬件功率计量（`measured_j`）。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

每个来源都有一个阅读标签。**Full:** 完整阅读。**Partial:** 已检索全文并搜索引用段落，已在其上下文中核查，但未通读整部作品。**Unavailable:** 未获取。"PDF p." 给出链接副本中的页码；Sec. 给出章节。

- Assran et al. 2023. Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture. CVPR. [arXiv:2301.08243](https://arxiv.org/abs/2301.08243). Full.
- Assran et al. 2025. V-JEPA 2. [arXiv:2506.09985](https://arxiv.org/abs/2506.09985). Full.
- Backus et al. 1957. The FORTRAN Automatic Coding System. Western Joint Computer Conference. [Computer History Museum copy](https://archive.computerhistory.org/resources/text/Fortran/102663113.05.01.acc.pdf). Full.
- Bird 1986. An Introduction to the Theory of Lists. Oxford PRG-56. [PDF](https://www.cs.ox.ac.uk/files/3378/PRG56.pdf). Full.
- Brooks 1986. No Silver Bullet: Essence and Accident in Software Engineering. [PDF](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf) (page numbers refer to this copy). Full.
- Chen et al. 2021. Evaluating Large Language Models Trained on Code. [arXiv:2107.03374](https://arxiv.org/abs/2107.03374). Full.
- Dijkstra. EWD 472, Guarded commands, non-determinacy and formal derivation of programs. [Transcription](https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD472.html). Full.
- Dijkstra. EWD 667, On the foolishness of "natural language programming". [Transcription](https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html). Full.
- Ellis et al. 2021. DreamCoder. PLDI. [arXiv:2006.08381](https://arxiv.org/abs/2006.08381); [version with supplement](https://www.cs.cornell.edu/~ellisk/documents/dreamcoder_with_supplement.pdf). Full (main text and supplement S1 to S4.8, PDF pp. 23-68, read in full).
- Hubert et al. 2025. Olympiad-level formal mathematical reasoning with reinforcement learning (AlphaProof). Nature. [Nature](https://www.nature.com/articles/s41586-025-09833-y). Full.
- Klein et al. 2009. seL4: Formal Verification of an OS Kernel. SOSP. [PDF](https://www.sigops.org/s/conferences/sosp/2009/papers/klein-sosp09.pdf). Full.
- Leroy 2009. Formal verification of a realistic compiler. CACM. [PDF](https://xavierleroy.org/publi/compcert-CACM.pdf). Full.
- Letouzey 2008. Extraction in Coq: an Overview. CiE. [PDF](https://www.irif.fr/~letouzey/download/letouzey_extr_cie08.pdf). Full.
- Li et al. 2022. Competition-Level Code Generation with AlphaCode. [arXiv:2203.07814](https://arxiv.org/abs/2203.07814). Full.
- Luccioni, Jernite, Strubell 2024. Power Hungry Processing. FAccT. [arXiv:2311.16863](https://arxiv.org/abs/2311.16863). Full.
- OMG 2003. MDA Guide Version 1.0. [PDF](https://www.omg.org/mda/mda_files/MDA_Guide_Version1-0.pdf). Full.
- Ouyang et al. 2023. An Empirical Study of the Non-determinism of ChatGPT in Code Generation (v1 title: LLM is Like a Box of Chocolates). [arXiv:2308.02828](https://arxiv.org/abs/2308.02828). Full.
- Samsi et al. 2023. From Words to Watts. IEEE HPEC. [arXiv:2310.03003](https://arxiv.org/abs/2310.03003). Full.
- Sun et al. 2024. Clover: Closed-Loop Verifiable Code Generation. [arXiv:2310.17807](https://arxiv.org/abs/2310.17807). Full.
- Yang et al. 2011. Finding and Understanding Bugs in C Compilers (Csmith). PLDI. [PDF](https://users.cs.utah.edu/~regehr/papers/pldi11-preprint.pdf). Full.
- Yang et al. 2024. AutoVerus. [arXiv:2409.13082](https://arxiv.org/abs/2409.13082). Full.
- LeCun 2022. A Path Towards Autonomous Machine Intelligence, version 0.9.2. [OpenReview](https://openreview.net/forum?id=BZ5a1r-kVsf). Full.
- Simon 1963. Experiments with a Heuristic Compiler. Journal of the ACM 10(4), 493-506. [DOI 10.1145/321186.321192](https://doi.org/10.1145/321186.321192). Full.
- Manna and Waldinger 1980. A Deductive Approach to Program Synthesis. ACM TOPLAS 2(1), 90-121. [DOI 10.1145/357084.357090](https://doi.org/10.1145/357084.357090). Full.
- van de Riet 1993. An overview and appraisal of the Fifth Generation Computer System project. Future Generation Computer Systems 9, 83-103. [DOI 10.1016/0167-739X(93)90002-7](https://doi.org/10.1016/0167-739X(93)90002-7). Full.
- Kemerer 1992. How the Learning Curve Affects CASE Tool Adoption. IEEE Software 9(3), 23-28. [DOI 10.1109/52.136161](https://doi.org/10.1109/52.136161). Full.
- Hutchinson, Whittle, Rouncefield and Kristoffersen 2011. Empirical Assessment of MDE in Industry. ICSE, 471-480. [DOI 10.1145/1985793.1985858](https://doi.org/10.1145/1985793.1985858). Full.
- Petre 2013. UML in practice. ICSE. [DOI 10.1109/ICSE.2013.6606618](https://doi.org/10.1109/ICSE.2013.6606618); [author copy, Open Research Online](https://oro.open.ac.uk/35805/) (page numbers refer to this copy). Full.
- Simon 1963. Experiments with a Heuristic Compiler. RAND RM-3588-PR. [Internet Archive](https://archive.org/details/bitsavers_randiplRM3mpilerMay63_4935437); a memorandum related to but distinct from the JACM article. Full (prose pp. iii-63; program listings in Appendices A and B scanned).
- Manna and Waldinger 1978. A Deductive Approach to Program Synthesis. Stanford STAN-CS-78-690. [Report version](http://i.stanford.edu/TR/CS-TR-78-690.html), which predates the TOPLAS article. Full.
- Huang, LeCun and Balestriero 2025. LLM-JEPA. [arXiv:2509.14252](https://arxiv.org/abs/2509.14252). Partial (abstract, repository README and run script).
- Wei et al. 2025. SWE-RL. [arXiv:2502.18449](https://arxiv.org/abs/2502.18449). Partial (abstract and method summary).
- Yang et al. 2025. SWE-smith. [arXiv:2504.21798](https://arxiv.org/abs/2504.21798). Partial (abstract and repository README).
- Shansan Gong, Ruixiang Zhang, Huangjie Zheng, Jiatao Gu, Navdeep Jaitly, Lingpeng Kong and Yizhe Zhang 2025. DiffuCoder. [arXiv:2506.20639](https://arxiv.org/abs/2506.20639). Partial (abstract). Author list from arXiv metadata, not a PDF title page.
- Inception Labs 2025. Mercury. [arXiv:2506.17298](https://arxiv.org/abs/2506.17298). Partial (abstract).
- Wang, Pradel and Liu 2025. Are "Solved Issues" in SWE-bench Really Solved Correctly? [arXiv:2503.15223](https://arxiv.org/abs/2503.15223). ICSE (International Conference on Software Engineering) 2026. Partial (findings summary).
- Becker, Rush, Barnes and Rein 2025. Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity. [arXiv:2507.09089](https://arxiv.org/abs/2507.09089). Partial (summary, and the abstract via arXiv metadata). Author list from arXiv metadata, not a PDF title page.
- Niels Mündler, Jingxuan He, Hao Wang, Koushik Sen, Dawn Song and Martin Vechev 2025. Type-Constrained Code Generation with Language Models. [arXiv:2504.09246](https://arxiv.org/abs/2504.09246). Partial (headline result). Affiliation: the Swiss Federal Institute of Technology Zurich and the University of California, Berkeley, from the author list, not a PDF title page.
- Grand et al. 2023. LILO. [arXiv:2310.19791](https://arxiv.org/abs/2310.19791). Partial (abstract).
- Higher Order Company. HVM2. [PDF](https://raw.githubusercontent.com/HigherOrderCO/HVM/main/paper/HVM2.pdf). Partial (summary). The model is cited. Figures from that paper are not used.
- DeepSeek 2025. DeepSeek-Prover-V2. [arXiv:2504.21801](https://arxiv.org/abs/2504.21801). Partial (arXiv metadata and abstract).
- Moonshot and Numina 2025. Kimina-Prover Preview. [arXiv:2504.11354](https://arxiv.org/abs/2504.11354). Partial (abstract).
- Princeton 2025. Goedel-Prover. [arXiv:2502.07640](https://arxiv.org/abs/2502.07640). Partial (abstract).
- Scale AI. SWE-Bench Pro public leaderboard, page text fetched 6 November 2026. [scale.com/leaderboard/swe_bench_pro_public](https://scale.com/leaderboard/swe_bench_pro_public). Full (page text). The page prints no update date.
- ByteDance Seed 2025. Multi-SWE-bench. [arXiv:2504.02605](https://arxiv.org/abs/2504.02605). Partial (abstract). No November 2026 leaderboard figure was retrieved, and none is stated.
- Meta FAIR 2024. Large Concept Models. [arXiv:2412.08821](https://arxiv.org/abs/2412.08821). Partial (abstract).
- Chollet, Knoop, Kamradt and Landers 2024. ARC Prize 2024 Technical Report. [arXiv:2412.04604](https://arxiv.org/abs/2412.04604). Partial (abstract).
- Akyurek et al. 2024. Test-time training on ARC. [arXiv:2411.07279](https://arxiv.org/abs/2411.07279). Partial (abstract).
- ARC Prize 2025 results page. [arcprize.org/competitions/2025/](https://arcprize.org/competitions/2025/). Full (page).
- Lean FRO (Focused Research Organization). Year 1 roadmap, August 2023 to July 2024. [lean-fro.org/about/roadmap/](https://lean-fro.org/about/roadmap/). Partial (deliverables list). Later-year roadmaps are not used.
- Conal Elliott 2009, revised 2016. Denotational design with type class morphisms. [conal.net/papers/type-class-morphisms/](https://conal.net/papers/type-class-morphisms/). Partial (abstract page).
- Radul and Sussman 2009. The Art of the Propagator. MIT-CSAIL-TR-2009-002. [dspace.mit.edu/handle/1721.1/44215](https://dspace.mit.edu/handle/1721.1/44215). Partial (abstract).
