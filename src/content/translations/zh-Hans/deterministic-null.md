---
title: "确定性零基线：面向神经与智能体基底的预注册对照实验"
deck: "一种零模型调用的 64 位整数案例循环（Shape D：严格 N0 与开发集结晶的 N1），使用 Rust、Go、Python、C++20 与 Julia 五种语言实现，在 League of Entropy drand 随机信标轮次之前通过 OpenTimestamps 比特币日历证明锁定，并在 4,030 个留出实例与 6 个多文件代码库上同前沿云端语言模型及本地开放权重语言模型进行对比。Apple Silicon 片上 IOReport 与内核 rusage 计数器均记录为 reported_j；未连接外部墙插或供电轨焦耳监测仪（board_metered 为 false；measured_j 未设置）。"
lang: "zh-Hans"
source: "deterministic-null"
complete: true
---

<div id="deterministic-null-a-pre-registered-control-experiment-for-neural-and-agentic-substrates" class="anchor-alias" aria-hidden="true"></div>

*修订版 7eb0ad5，2026 年 11 月 22 日。数据与摘要汇总：[/data/#deterministic-null](/data/#deterministic-null)。交互式动态图表：[/living/deterministic-null/](/living/deterministic-null/)。LaTeX 归档对偶版：[/pdfs/latex/deterministic-null.pdf](/pdfs/latex/deterministic-null.pdf)（[源文件](/pdfs/latex/deterministic-null.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概述

对智能体人工智能的实证评估通常只将一个随机语言模型与另一个随机语言模型进行比较，却未曾衡量任务完成在多大程度上确实需要决策时的神经基底，而非在已验证先验案例的显式存储库上运行的固定整数过程。本研究构建、冻结并审计这一缺失的对照基线：**确定性零基线（Deterministic Null，`Shape D`）**，并在两项经密码学预注册的验证性实验（共 `4,030` 个信标后留出实例）与一项多轮代码库缺陷修复研究（`6` 个多文件 Python 代码库）中，以边际阈值 $\delta = 0.05$（`5.0` 个百分点）检验逐类零假设 $H_{0,k}: \Delta_k = p_{\text{model},k} - p_{\text{null},k} \le \delta$。本地 Apple M5 Max 能量计数器（`IOReport` 与 `proc_pid_rusage`）记录为操作系统及片上层面的 `reported_j` 数值；闭源模型的远程服务器能量严格记录为 `not_available`；实验未连接任何硬件供电轨或墙插功率监测仪（`board_metered = false`，`measured_j = None`）。

**用平常话说**

1. 大多数智能体基准测试只比较模型 A 与模型 B，却没有追问：一个建立在已验证先验实例之上的零模型调用查找循环，本身已经能够解决多少问题。
2. 在取自有界代数、形式化证明与结构化事务族的 `2,840` 个实例上（`exp-001`，Track-A），冻结的整数案例表（决策时 `0` 次模型调用）在 `10` 个“任务类 × 层级”单元中的 `9` 个上与前沿云端模型表现持平，仅在 `12` 种未建立索引的自由文本客户习惯表达上落后（`Claude Opus 5.5` 高出 `+36.40` 个百分点）。
3. 在取自外部作者构建的公开基准的 `1,190` 个唯一实例（`exp-002`，Track-B：Berkeley Function-Calling Leaderboard `v3`、Sierra `tau-bench` Retail、`BigCodeBench v0.1.3` 以及 `SWE`（软件工程）-bench Verified）外加 `6` 个未见多文件代码库上，只要未见键质量保持高位，神经合成便能带来 `+52.80` 至 `+95.00` 个百分点的增益；然而在唯一的相变区 `3-satisfiability`（三元可满足性）公式上，单轮语言模型几乎彻底崩溃（`0.0%-5.2%`），不仅低于有界整数案例表（`69.6%`），也低于附带子句证明检查的独立冲突驱动子句学习求解器（`100.0%`）；而在重复出现的 Zipf 分布任务流下，在线结晶在不损失任务完成率的前提下将模型调用次数与能量开销同时削减 `3.59×`。

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语、缩略语与测量标签

<ul id="terms">
<li>AI, ML, LLM, LLMs, MoE, E4B, A3B: 人工智能（Artificial Intelligence）、机器学习（Machine Learning）、大语言模型（Large Language Model，单数与复数）、专家混合架构（Mixture-of-Experts）、等效 40 亿参数架构（effective 4B architecture），以及激活 30 亿参数路由（active 3B routing）</li>
<li>OBSERVE, REDUCE, FUZZ, LOOKUP, ACT, VERIFY, MUTATE, WRITE: 确定性零基线（Deterministic Null）整数决策循环依次执行的八个顺序步骤（观测、归约、模糊化、查找、行动、验证、变异、写入）</li>
<li>SATB, SUT, SUTs, PFRK, TH2, DOSSIER: 饱和基准（Satiation Benchmark）评测框架契约、被测系统（System Under Test，单数与复数）、四路尝试结果（通过 pass、失败 fail、拒绝 refuse、终止 killed）、红队威胁 2（行动原语内部严禁暗藏通用求解器），以及项目现有技术与红队审计档案</li>
<li>DNULLMM1, FT, LCB: 二进制内存映射存储索引格式、逐类函数表（per-class Function Table），以及 Hoeffding 置信下界（Lower Confidence Bound）</li>
<li>DRAT, RUP, CDCL, CNF, SAT, UNSAT: 删除消解非对称重言式（Deletion Resolution Asymmetric Tautology）、反向单位传播（Reverse Unit Propagation）、冲突驱动子句学习（Conflict-Driven Clause Learning）、合取范式（Conjunctive Normal Form）、可满足（Satisfiable），以及不可满足（Unsatisfiable）</li>
<li>BV, AST, XOR, IEEE, UC: 定宽模位向量（fixed-width modular bitvector）、抽象语法树（Abstract Syntax Tree）、按位异或（bitwise exclusive-OR）、电气与电子工程师协会（Institute of Electrical and Electronics Engineers，IEEE-754 浮点标准），以及加利福尼亚大学（University of California）</li>
<li>BFCL, BCB, SWE, SQL, DB, SAVEPOINT: Berkeley 函数调用排行榜（Berkeley Function-Calling Leaderboard）、BigCodeBench、软件工程基准前缀、结构化查询语言（Structured Query Language）、关系型数据库（relational database），以及事务回滚保存点（transactional rollback checkpoint）</li>
<li>API, CLI, MCP, HTTP, JSON, JSONL, UTF: 应用程序编程接口（Application Programming Interface）、命令行界面（Command-Line Interface）、模型上下文协议（Model Context Protocol）、超文本传输协议（Hypertext Transfer Protocol）、JavaScript 对象表示法（JavaScript Object Notation）、按行分隔的 JSON（line-delimited JSON），以及 Unicode 转换格式（Unicode Transformation Format）</li>
<li>POSIX, MMAP, SHA, OTS: 可移植操作系统接口（Portable Operating System Interface）、内存映射文件输入/输出（memory-mapped file I/O）、安全哈希算法（Secure Hash Algorithm，SHA-256），以及 OpenTimestamps 比特币日历证明</li>
<li>BCa, CI, CIs, UCL: 偏差校正加速自助法（bias-corrected and accelerated bootstrap）、置信区间（Confidence Interval，单数与复数），以及 Wilson 置信上限（Wilson Upper Confidence Limit）</li>
<li>CPU, GPU, ANE, SoC, PID, OS, RAM, DRAM, NVMe, PSU, AC: 中央处理器、图形处理器、Apple 神经网络引擎（Apple Neural Engine）、片上系统（System-on-Chip）、进程标识符、操作系统、随机存取存储器、动态随机存取存储器、非易失性内存主机控制器接口规范（Non-Volatile Memory Express）、电源供应单元，以及交流墙插电源</li>
<li>RAPL, NVML, KV, GGUF, RPM, RPD, USD, EDA: Intel 运行平均功率限制（Intel Running Average Power Limit）、NVIDIA 管理库（NVIDIA Management Library）、键值缓存（key-value cache）、GPT 生成统一格式量化权重（GPT-Generated Unified Format）、每分钟请求数、每日请求数、美元，以及电子设计自动化（Electronic Design Automation）</li>
<li>RCE, MoL, WCA, JEPA, LUT6: Reality Code Engine [同机构]、Mixture of Limits（极限混合）[同机构]、Wise Computer Automation [同机构]、联合嵌入预测架构（Joint-Embedding Predictive Architecture），以及 6 输入布尔查找表（6-input Boolean look-up table）</li>
</ul>

在 L0 至 L4 遥测层级上，本研究所有表格与图表严格区分以下四类测量标签：

| 测量标签 | 本研究中的含义 |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`**（精确：L4 逻辑与密码学级） | 逐位一致的 64 位定点存储库摘要（`SHA-256`）、OpenTimestamps `.ots` 日历证明、League of Entropy `drand` 信标轮次、由 `satb-proxy` 捕获的词元与调用计数，以及注明日期的 API 目录价美元金额（`USD`）。 |
| **`Reported (reported_j: L2 & L3 Counters)`**（报告值：L2 与 L3 计数器） | 免 root 权限的 Apple Silicon 片上 `IOReport` 时间窗焦耳读数（`macmon`，遥测层级 `L2`，共享宿主机标签 `A2`）与 macOS 内核按进程 `PID` 统计的 `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（`L3`，标签 `D`）。并非物理硬件供电轨功率计（`measured_j = None`，`board_metered = false`）。 |
| **`Not Available (label N)`**（不可用：标签 N） | 闭源 API 远程服务器能耗（`Claude Opus 5.5`、`Claude Sonnet 5.5`、`Gemini 2.5 Flash`）以及 `L0` 交流墙插能耗。绝不将机群中位数或文献换算乘数代填入收据。 |
| **`Invalidated Derived (Falsifier 6)`**（已失效派生值：证伪条件 6） | 每当共享宿主机上的共驻进程在 L0 至 L4 遥测层级上引起 `> 5.0%` 的运行前后空闲基线漂移时，自动丢弃扣除空闲基线后的净增能耗（`derived_marginal_j`），同时原样保留原始 `reported_j` 计数器读数。 |

<div id="11-lineage-prior-art-boundaries-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 学术谱系、现有技术边界与同机构披露

本研究不对决策循环本身主张任何算法首创性。基于案例的“检索-复用-修正-保留”循环可追溯至 Stanfill 与 Waltz（1986）以及 Aamodt 与 Plaza（1994）；表格化倒立摆平衡可追溯至 Michie 与 Chambers（1968）；模糊规则表可追溯至 Mamdani 与 Assilian（1975）以及 Wang 与 Mendel（1992）；通过 `RUP/DRAT` 进行的可满足性证明记录可追溯至 Goldberg 与 Novikov（2003）以及 Wetzler、Heule 与 Hunt（2014）。Open Interface Engineering 此前的系列工作（[计量提交门槛](/papers/gates/)、[任务饱和与 AI 需求的总体反弹](/papers/satiation/)、[Reality Code Engine](/papers/rce/) 以及 [Mixture of Limits 级联中的向下 LUT6 编译](/papers/lut-adapt/)）均为同机构（`[same house]`）姊妹研究，此处仅作为架构背景引用，绝不作为独立验证依据。

一项涵盖 69 份文献的现有技术审计与包含 36 项发现的红队审查（`docs/DOSSIER.md`）确立了 2024-2026 年智能体评估文献中的一个具体空白：现有智能体基准绝大多数省略了非神经对照基线，现有非神经基线缺乏预注册的留出存储库冻结机制，而现有针对语言模型智能体的能耗研究均未在同一宿主机上设置零模型调用对照组。

<figure class="my-8">
  <img src="/figures/deterministic-null/dnull-control-protocol.svg" alt="确定性零基线（Deterministic Null）的四阶段信标前锁定与配对评估协议。" />
  <figcaption>图 1. 横跨 <code>Shape D</code>（<code>N0</code>、<code>N1</code>）与神经基底（<code>B3</code>、<code>B6</code>、<code>Shape H</code>）的信标前预注册（<code>Gate G1</code> + OpenTimestamps + <code>drand</code>）及配对评估协议。本图为协议示意图，并非硬件供电轨读数。</figcaption>
</figure>

---

<div id="2-machine-specification-arms-and-five-language-conformance" class="anchor-alias" aria-hidden="true"></div>

## 2. 机器规范、实验组别与五语言一致性

<div id="21-the-eight-step-integer-loop-and-complexity-caps" class="anchor-alias" aria-hidden="true"></div>

### 2.1 八步整数循环与复杂度上限

每一个 `Shape D` 零基线组均执行一个八步 64 位有符号整数循环（采用 `Q = 1,000,000` 定点缩放，零条 IEEE-754 浮点指令，决策时零次神经模型调用）：

$$\texttt{OBSERVE} \;\to\; \texttt{REDUCE} \;\to\; \texttt{FUZZ} \;\to\; \texttt{LOOKUP} \;\to\; \texttt{ACT} \;\to\; \texttt{VERIFY} \;\to\; \texttt{MUTATE} \;\to\; \texttt{WRITE}.$$

在 `dev`（开发集）构建阶段，`WRITE` 将通过验证的记录（`src` 来源标签记为 `lit:`、`human:`、`mut:` 或 `llm:`）追加写入规范化的 `JSONL` 日志，并编译为零拷贝 `POSIX mmap` 开放寻址二进制哈希表（`DNULLMM1`：64 字节文件头加 48 字节槽位）。在进入 `test`（测试集）评估之前，存储库按 `SHA-256` 摘要冻结为只读状态；`VERIFY`、`MUTATE` 与 `WRITE` 在测试阶段执行零次更新，并断言运行前后的存储库摘要逐字节完全一致。为防止在逐类代码中暗中塞入通用求解器（`TH2`），每个任务类的函数表（`REDUCE` + `ACT`）均受限于压缩后 `<= 4,096` 字节（gzip）且每次调用 `<= 50,000` 次基本运算（`S-3`），并严禁使用任何经学习的自然语言归约器（`S-4`）。

<div id="22-operational-permutations-under-comparison" class="anchor-alias" aria-hidden="true"></div>

### 2.2 参与对比的运行组别配置

| 实验组别 | 定义 | 决策时 LLM 调用次数 | 构建来源 |
| :--- | :--- | :--- | :--- |
| **`B0`（底线组）** | 无条件输出该任务类的默认动作；用于强制执行测试阶段 $> 2\delta$（`10.0` 个百分点）的检测灵敏度门槛。 | `0` | 无 |
| **`B1`（经典求解组）** | 不带案例存储库的独立演绎求解器（`CDCL+DRAT`、迹零空间 Houdini、有理数域 Buchberger Gröbner 基）。 | `0` | 经典算法 |
| **`B2`（纯种子组）** | 仅以文献种子初始化存储库，禁用 `dev` 变异。 | `0` | 仅 `lit:` |
| **`N0`（严格零基线）** | 在 `dev` 上填充的固定整数循环，不含任何模型生成的记录、修复或逐类代码（`0` 条 `llm:` 来源记录）。 | `0` | `lit:`、`human:`、`mut:` |
| **`N1`（主零基线）** | 在 `dev` 上填充的固定整数循环，允许纳入任何来源的已验证条目，并将全部 `dev` 模型调用计入成本 $C_{N1}$。 | `0` | 任意已验证来源（计入 `C_N1`） |
| **`B5`（`code-once` 单次编码组）** | 由前沿 LLM 根据 `dev` 规范一次性编写确定性 Python 策略；在 `test_seed` 生成之前即予以冻结。 | `0` | 每类 `1` 次 `dev` LLM 调用 |
| **`B3`（云端前沿模型组）** | 逐实例调用云端模型进行评估（主模型 `Claude Opus 5.5`，次模型 `Claude Sonnet 5.5`，探测模型 `Gemini 2.5 Flash`）。 | `>= 1` / 实例 | 预训练云端 API |
| **`B6`（本地开放权重组）** | 同一宿主机上的本地推理（在 Apple M5 Max Metal GPU 上通过 `llama-server` 运行 `Alibaba Qwen 3.6 35B-A3B` 与 `Google Gemma 4 E4B-it`）。 | `>= 1` / 实例 | 本地 `reported_j` |
| **`Shape H`（封装工具箱组）** | 在 `/work` 目录内运行外部 `Claude Code 2.1.330` CLI，启用 `--strict-mcp-config` 且 100% 流量经由 `satb-proxy` 路由。 | 多轮交互 | 检验 `Lane B` 下界（证伪条件 8） |

<div id="23-gate-g2-five-language-conformance-and-positive-controls" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Gate G2 五语言一致性与阳性对照

由 `/usr/bin/bc` 与 `openssl` 独立生成的黄金测试向量验证了五种语言实现之间的逐位精确一致（`Gate G2`），同时完成了三项隔离的阳性对照测试（`ctl.setpoint`：`B0 = 0.110 -> N0 = 1.000`；`ctl.mamdani`：`B0 = 0.525 -> N0 = 1.000`；`ctl.cartpole`：`B0 = 0.000 -> N0 = 0.805`；上述阳性对照均排除在所有关于智能体的结论之外）：

| 语言实现 | 冻结存储库 `SHA-256` 摘要 | `1M` 条记录 `DNULLMM1` 挂载耗时 | 平均探测延迟 | `10k` 次探测校验和 |
| :--- | :--- | ---: | ---: | ---: |
| **Rust**（参考实现 + `SATB`） | `0da4df8d9ccbce1e...4485781` | `44.67 µs` | `582.57 ns` | `15027705736` |
| **C++20**（`clang++ -O3`） | `0da4df8d9ccbce1e...4485781` | `41.58 µs` | `388.43 ns` | `15027705736` |
| **Go `1.25`** | `0da4df8d9ccbce1e...4485781` | `60.63 µs` | `417.05 ns` | `15027705736` |
| **Julia `1.12`** | `0da4df8d9ccbce1e...4485781` | `125.92 µs` | `350.07 ns` | `15027705736` |
| **Python `3.13`**（`mmap`） | `0da4df8d9ccbce1e...4485781` | `8,655.58 µs` | `633.87 ns` | `15027705736` |

---

<div id="3-confirmatory-experiment-1-exp-001-track-a-bounded-template-stratum" class="anchor-alias" aria-hidden="true"></div>

## 3. 验证性实验 1（`exp-001`，Track-A 有界模板层）

<div id="31-pre-beacon-registration-reg-exp-001" class="anchor-alias" aria-hidden="true"></div>

### 3.1 信标前预注册（`reg-exp-001`）

五个任务类（`m = 5`：`formal.bv_superopt`、`formal.hoare_inv`、`formal.poly_ideal`、`formal.open_drat_synth` 以及 `tool.tau2_sqlite`）在 $J = 5$ 种 `dev` 轮次排列下完成填充（全部形式化填充尝试累计消耗 `966.2 J` `L2` `reported_j`；`tool.tau2_sqlite` 上的 `$0.00955` `Opus 5.5` `dev` 调用费用计入 `N1`）。样本量（每层级 `n = [420, 250, 250, 250, 250] = 1,420`，总计 `2,840`）按 `90%` 统计功效设计，以支持经多重性校正的 `99.0%`（$1 - 0.05/5$）、`10,000` 次重采样配对 `BCa` 置信区间。清单摘要 `cffb564cd9ad...` 与 OpenTimestamps 证明 `suite/manifest.json.ots`（`172 B`）于 `drand` 第 `6663731` 轮提交至 `git tag reg-exp-001`（`e5007a4`），严格早于目标轮次 `6663734`（`test_seed_u64 = 5861262844585529273`）。抽样审查的全部 `750/750` 条轨迹均通过独立的 `DRAT` 与 `SQLite SAVEPOINT` 评分器审计（`0` 例漏洞投机）。

<div id="32-track-a-confirmatory-results-2840-instances" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Track-A 验证性结果（`2,840` 个实例）

| 层级与任务类 | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Qwen36}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | `99.0%` BCa CI | `Qwen` 每次通过 `reported_j` | 裁定结论（$\delta = +0.05$） |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | ---: | :--- |
| **Tier 1** `formal.bv_superopt` | `420` | `0.000` | `1.000` | `1.000` | `0.998` | `0.836` | `-0.24 pts` | `[-1.43, +0.00]` | `14.17 J` | **相关性已排除** |
| **Tier 1** `formal.hoare_inv` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.508` | `+0.00 pts` | `[+0.00, +0.00]` | `23.32 J` | **相关性已排除** |
| **Tier 1** `formal.poly_ideal` | `250` | `0.348` | `1.000` | `1.000` | `0.996` | `1.000` | `-0.40 pts` | `[-2.80, +0.00]` | `7.26 J` | **相关性已排除** |
| **Tier 1** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.352` | `+0.00 pts` | `[+0.00, +0.00]` | `69.00 J` | **相关性已排除** |
| **Tier 1** `tool.tau2_sqlite` | `250` | `0.188` | `0.624` | `1.000` | `1.000` | `0.940` | `+0.00 pts` | `[+0.00, +0.00]` | `7.11 J` | **相关性已排除** |
| **Tier 2** `formal.bv_superopt` (`16b`) | `420` | `0.000` | `1.000` | `1.000` | `0.983` | `1.000` | `-1.67 pts` | `[-3.81, -0.48]` | `7.87 J` | **相关性已排除** |
| **Tier 2** `formal.hoare_inv` (`6b`) | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.600` | `+0.00 pts` | `[+0.00, +0.00]` | `16.41 J` | **相关性已排除** |
| **Tier 2** `formal.poly_ideal` ($k\in[7,15]$) | `250` | `0.376` | `1.000` | `1.000` | `1.000` | `1.000` | `+0.00 pts` | `[+0.00, +0.00]` | `6.74 J` | **相关性已排除** |
| **Tier 2** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.376` | `+0.00 pts` | `[+0.00, +0.00]` | `53.59 J` | **相关性已排除** |
| **Tier 2** `tool.tau2_sqlite`（改述） | `250` | `0.224` | `0.516` | `0.636` | `1.000` | `0.916` | **`+36.40 pts`** | **`[+28.80, +44.80]`** | `7.15 J` | **相关性已证实**（`12` 个未填充） |

**Track-A 范围审计。** 尽管 `exp-001` 清晰地将规范化形式验证（`9/9` 个单元排除神经相关性，节省 `$27.25` API 开支或 `31,619.9 J` 本地 `reported_j`）与未见表层改述区分开来（在 Tier 2 `tool.tau2_sqlite` 上高出 `+36.40` 个百分点，在 `Qwen 3.6` 上每额外通过一例消耗 `23.38 J`），运行后审计仍指出了一个关键结构性局限：Track-A 的生成器采样自模 `6` 至模 `12` 的模板族（$K_{\text{eff}} = 6\text{-}12$），使得仅凭 `120` 轮 `dev` 预算便足以将特征单元彻底饱和。

---

<div id="4-confirmatory-experiment-2-exp-002-track-b-external-public-benchmarks-keffn" class="anchor-alias" aria-hidden="true"></div>

## 4. 验证性实验 2（`exp-002`，Track-B 外部公开基准，$K_{\text{eff}} = n$）

<div id="41-course-corrected-unique-instance-design-and-registration-reg-exp-002" class="anchor-alias" aria-hidden="true"></div>

### 4.1 航向修正后的唯一实例设计与预注册（`reg-exp-002`）

为了在彻底摒弃合成模板菜单的条件下检验 `Shape D`，Track-B（`exp-002`）引入了四个由外部作者构建的公开基准（上游制品通过 `SHA-256` 哈希固定），外加结构唯一的随机相变区 `3-SAT` 实例（`12` 个变量、`50` 个子句，子句变量比 `4.17`），共构成 `1,190` 个唯一留出 `test` 实例（$K_{\text{eff}} = n = 1,190$）：

1. **`formal.unique_3sat_drat`（`n = 250`）**：唯一的 `12` 变量、`50` 子句 `3-CNF` 公式；`Shape D` 采用多项式时间的 1 层失败文字传播与 `45` 次翻转局部随机游走（压缩后函数表 `3,108 B`），而附带双监视文字 `RUP/DRAT` 证明检查的独立 `CDCL` 求解器作为经典基线组 `B1`。
2. **`external.bfcl_v3_live`（自 `1,292` 实例池中抽取 `n = 250`）**：UC Berkeley Gorilla Function-Calling Leaderboard `v3`（由用户贡献的 `live_multiple` 多工具模式与 `irrelevance` 拒答弃权任务交错构成；压缩后函数表 `1,381 B`）。
3. **`external.tau_bench_retail`（自 `635` 实例池中抽取 `n = 220`）**：Sierra Research `tau-bench` 零售策略与关系型数据库状态变更测试集（含 `500` 名用户、`1,000` 笔订单、`50` 种商品；压缩后函数表 `1,298 B`）。
4. **`external.bigcodebench_exec`（自 `487` 个本地验证可运行池中抽取 `n = 220`）**：`BigCodeBench v0.1.3` 多库 Python 编程规范任务，通过隔离环境下的 `unittest` 执行评分（压缩后函数表 `286 B`；实例池中 `100%` 的任务均经离线验证确保标准解通过且拒绝 `return None`）。
5. **`external.swebench_verified`（自 `500` 实例池中抽取 `n = 250`）**：`princeton-nlp/SWE-bench_Verified` 经人工核验的 GitHub 缺陷工单，在 `12` 选一的代码库 `(file_path :: symbol)` 故障定位任务上进行评估（压缩后函数表 `718 B`）。

清单摘要 `5fe640f00298...`（含 `355` 次 `Opus 5.5` `dev` 调用，共计 `$7.1902` 计入 $C_{N1}$）与 OpenTimestamps 收据 `suite_exp002/manifest.json.ots`（`207 B`）于 `drand` 第 `6664086` 轮提交至 `git tag reg-exp-002`（`d6bfae5`），严格早于目标轮次 `6664089`（`test_seed_u64 = 9069507899917430179`）。一项纯机械性的评测框架修正（`amendment_01_b6_slot_ctx.json`）将 `llama-server` 的总上下文窗口从 `-c 16384`（`4` 个并发槽位平分导致每槽仅 `4,096` 个词元，在 `10k-13.7k` 词元的 `BFCL`/`tau-bench` 工具模式上返回 `HTTP 400`）提升至 `-c 81920`（每槽 `20,480` 个词元），而所有冻结存储库、提示词、验证器、样本量及 `drand` 第 `6664089` 轮随机种子均保持分毫未动。抽样审查的全部 `515/515` 条轨迹均通过独立评分器复核验证（`0` 例漏洞投机）。

<div id="42-track-b-multi-vendor-confirmatory-results-1190-unique-instances" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Track-B 多厂商验证性结果（`1,190` 个唯一实例）

全部 `1,190` 个实例上的 `Shape D`（`N0`、`N1`）、`B0` 与 `B1`（`CDCL+DRAT`）评估在 **`0.9213 s`** 内全部完成（消耗 `35.72 J` `L2` `reported_j`、`0.36 J` `GPU`、`2.58 J` `L3` `ri_energy_nj`、执行 `6.57 × 10^9` 条指令，运行前后空闲基线漂移为 `3.09% <= 5.0%`）。

| 唯一实例任务类 | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Sonnet}}$ | $p_{\text{Qwen36}}$ | $p_{\text{Gemma4}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | `99.0%` BCa CI | 裁定结论（$\delta = +0.05$） |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | :--- |
| `formal.unique_3sat_drat` ($p_{B1}=1.000$) | `250` | `0.000` | **`0.696`** | **`0.696`** | `0.052` | `0.008` | `0.000` | `0.000` | **`-64.40 pts`** | `[-72.00, -56.00]` | **不可评估**（$p_{\text{LLM}} < 2\delta$） |
| `external.bfcl_v3_live` | `250` | `0.180` | `0.200` | `0.228` | `0.828` | **`0.840`** | `0.804` | `0.720` | **`+60.00 pts`** | `[+51.20, +68.40]` | **相关性已证实**（`28` 个未填充） |
| `external.tau_bench_retail` | `220` | `0.005` | `0.396` | `0.259` | **`0.864`** | `0.805` | `0.755` | `0.623` | **`+60.45 pts`** | `[+51.82, +68.64]` | **相关性已证实**（`14` 个未填充） |
| `external.bigcodebench_exec` | `220` | `0.000` | `0.000` | `0.000` | **`0.950`** | `0.836` | `0.473` | `0.391` | **`+95.00 pts`** | `[+90.00, +97.73]` | **相关性已证实**（`218` 个未填充） |
| `external.swebench_verified` | `250` | `0.096` | **`0.460`** | `0.456` | **`0.984`** | `0.952` | `0.900` | `0.812` | **`+52.80 pts`** | `[+44.40, +60.40]` | **相关性已证实**（`4` 个未填充） |

*（在 AI Studio 免费层每日 `20 RPD` 限额内对 `Google Gemini 2.5 Flash` 进行的 15 次在线云端探测，按相同顺序在五个任务类上分别录得 `0/3`、`3/3`、`2/3`、`1/3` 与 `3/3`。）*

第 4.2 节呈现出三项突出的实证发现：

1. **演绎组合悬崖（`formal.unique_3sat_drat`）**：一旦从形式可满足性任务中移除模板菜单（`K_eff = 250` 个唯一相变区 `3-CNF` 公式），单轮神经模型几乎全线溃败（`Opus 5.5` 为 `5.2%`、耗资 `$13.55`；`Sonnet 5.5` 为 `0.8%`、耗资 `$8.17`；`Qwen 3.6` 为 `0.0%`、耗能 `7,588 J`；`Gemma 4` 为 `0.0%`、耗能 `4,698 J`），而零模型调用的多项式案例表解决了 `69.6%`（`174/250`），独立的经典 `CDCL+DRAT`（`B1`）则解决了 **`100.0%`（`250/250`）**。由于 `Opus 5.5` 自身未能以超过 $2\delta = 10.0$ 个百分点的优势越过底线组 `B0`（`95%` `BCa` 置信区间为 `[+2.80, +8.40]` 个百分点），预注册判定规则不予给出 `"Relevance excluded"`（相关性已排除）结论，而是将该单元严格归类为 **`Not assessable`**（不可评估）。
2. **不容忽视的零模型基线与确凿的神经增量并存**：即便完全不使用任何神经参数（`N0`），基于词法与模式的案例规则依然解决了 **`46.0%`** 的 `SWE-bench Verified` `12` 选一故障定位任务（底线组为 `9.6%`）以及 **`39.6%`** 的 `tau-bench` 零售策略数据库变更任务（底线组为 `0.5%`）。在 `tau-bench` 上，`N1` 在 `dev` 阶段的贪心二元词组（bigram）抽取反而对嘈杂的客户措辞产生了过拟合（`25.9%` 对比 `N0` 的 `39.6%`），印证了将严格 `N0` 与 `N1` 并列报告的必要性（`S4`）。尽管如此，在全部四个外部公开基准上，云端前沿模型与本地开放权重模型均取得了幅度巨大且统计上具有决定性的净增量（相比 `N0` 与 `N1` 均提升 `+46.82` 至 `+95.00` 个百分点）。
3. **本地神经增量（`B6`）的双通道 `reported_j` 能量代价**：在共享的 Apple M5 Max 宿主机上（其间并发运行的 `yosys-abc` 逻辑综合在 `5` 个多分钟级窗口中的 `4` 个上触发了证伪条件 6，从而干净地使 `derived_marginal_j` 失效，同时完整保留了原始 `L2` `IOReport` 与按进程统计的 `L3` `ri_energy_nj` 计数器），`Qwen 3.6 35B-A3B` 相比 `N1` 每多完成一项任务，在原始 `L2` `reported_j` 口径下分别消耗 **`49.90 J`**（`SWE-bench`）、**`70.33 J`**（`BFCL v3`）、**`238.80 J`**（`BigCodeBench`）以及 **`407.12 J`**（`tau-bench` Retail）。

---

<div id="5-goodturing-unseen-mass-multi-turn-work-repair-and-online-crystallization" class="anchor-alias" aria-hidden="true"></div>

## 5. Good-Turing 未见质量、多轮 `/work` 修复与在线结晶

<figure class="my-8">
  <img src="/figures/deterministic-null/s3-good-turing-regimes.svg" alt="由 Good-Turing 未见键质量 N1(t)/t 与 Zipf 在线结晶所划分的两种运行区间。" />
  <figcaption>图 2. Good-Turing 未见键质量 <em>N</em><sub>1</sub>(<em>t</em>) / <em>t</em> 能够预测冻结的 <code>Shape D</code> 何时趋于饱和，以及何时必须依赖神经合成或在线结晶（<code>measured_j = None</code>）。</figcaption>
</figure>

<div id="51-goodturing-unseen-mass-n1tt-across-the-five-track-b-streams" class="anchor-alias" aria-hidden="true"></div>

### 5.1 五条 Track-B 任务流上的 Good-Turing 未见质量（$N_1(t)/t$）

沿着每一条长度为 $t = 1 \dots T$ 的 `dev + cal` 任务流，Good-Turing 孤例比率（singleton ratio）$N_1(t)/t$ 给出了下一个到达键属于未见键的概率估计值：

| 任务类（`dev + cal` 任务流） | 流长度 $T$ | 粗粒度单元 $N_1(T)/T$ | 细粒度模式/实例 $N_1(T)/T$ | 留出集 `N0` / `N1` 完成率 |
| :--- | ---: | ---: | ---: | ---: |
| `formal.unique_3sat_drat` | `270` | `0.0000` | `1.0000` | `69.6%` / `69.6%` |
| `external.swebench_verified` | `250` | `0.0080` | `0.5960` | `46.0%` / `45.6%` |
| `external.tau_bench_retail` | `285` | `0.0035` | `0.6386` | `39.6%` / `25.9%` |
| `external.bfcl_v3_live` | `300` | `0.0233` | `0.4033` | `20.0%` / `22.8%` |
| `external.bigcodebench_exec` | `240` | **`0.9917`** | **`0.9917`** | **`0.0%` / `0.0%`** |

即便在 `N1` 已将 `BigCodeBench` `dev` 上通过单元测试的 `108` 个 `Claude Opus 5.5` Python 解答结晶入库之后，$N_1(T)/T = 0.9917$ 依然准确预测出未见组合式编程规范上的键重叠率近乎为零，这与留出 `test` 集上观测到的 `0.0%` 完成率（`218` 个未填充键）完全吻合。

<div id="52-multi-turn-work-software-engineering-repair-6-multi-file-repositories" class="anchor-alias" aria-hidden="true"></div>

### 5.2 多轮 `/work` 软件工程修复（`6` 个多文件代码库）

为验证第 4 节中的单轮提示词并未人为限制或扭曲多步编程框架的表现，本研究在隔离的 `/work` 沙箱（`max_turns = 10`）内评估了六个多函数、多文件 Python 缺陷修复代码库（涵盖 `loader.py` + `schema.py` 的 `config-defaults`、`interval-merge`、`pagination`、涵盖 `calc.py` + `lexer.py` 的 `precedence`、涵盖 `window.py` + `limiter.py` 的 `rate-window` 以及 `retry-backoff`），并在执行 `pytest -q` 评分前用纯净的上游副本强制覆盖所有 `test_*.py` 测试文件：

| 多轮 `/work` 评测通道 | 通过代码库数 | `SATB` `P/F/R/K` | 模型调用次数 | 工具调用次数 | API `USD` / 本地 `reported_j` |
| :--- | ---: | :---: | ---: | ---: | :--- |
| **`Shape D` 冷启动未见流（`t = 1`）** | `0 / 6`（`0.0%`） | `0/6/0/0` | `0` | `0` | `$0.0000` / `< 1 J` |
| **`Lane B`（`Claude Opus 5.5`）** | **`6 / 6`（`100.0%`）** | `6/0/0/0` | `28` | `29` | `$0.3613`（`not_available`） |
| **`Lane B`（`Claude Sonnet 5.5`）** | **`6 / 6`（`100.0%`）** | `6/0/0/0` | `31` | `34` | `$0.2080`（`not_available`） |
| **`Shape H`（`Claude Code 2.1.330` + `Opus 5.5`）** | **`6 / 6`（`100.0%`）** | `6/0/0/0` | `30` | `MCP` | `$0.2646`（`not_available`；证伪条件 8 通过） |
| **`Lane B` 本地（`Qwen 3.6 35B-A3B`）** | **`6 / 6`（`100.0%`）** | `6/0/0/0` | `42` | `42` | **`2,342.0 J`** `L2`（每代码库 `390.3 J`） |
| **`Shape D` 在线重放（`t = 2` 流）** | **`6 / 6`（`100.0%`）** | `6/0/0/0` | `0` | `0` | `$0.0000`（已验证补丁重放） |

<div id="53-online-crystallization-on-recurring-zipfian-traffic-bigcodebench" class="anchor-alias" aria-hidden="true"></div>

### 5.3 重复 Zipf 流量下的在线结晶（`BigCodeBench`）

在次要的在线评估轨道上（从 `220` 个唯一 `BigCodeBench` 测试任务上按 Zipf-$0.85$ 分布抽取 `600` 次请求，其中 `Shape D` 仅在未见键未命中时调用 `B3`/`B6`，并将通过 `unittest` 验证的解答缓存入库），在线结晶的任务完成率与逐请求纯调用 `Opus 5.5` 完全一致（**`98.0%` 对比 `98.0%`**），同时将 `155` 个已验证函数结晶至存储库中，使累计 LLM 调用次数削减 **`72.17%`（`167` 次对比 `600` 次）**，API 开支从 **`$7.33` 降至 `$2.04`（降低 `3.59×`）**，本地 `Qwen 3.6` 的 `reported_j` 能耗从 **`67,729.6 J` 降至 `18,851.4 J`（降低 `3.59×`）**。

---

<div id="6-limitations-falsifiers-and-unfinished-work" class="anchor-alias" aria-hidden="true"></div>

## 6. 局限性、证伪条件与未完成工作

1. **未接入物理供电轨或交流墙插功率计（`board_metered = false`，`measured_j = None`）**：本研究报告的所有能量数值均来自运行并发作业的宿主机上的 Apple Silicon 片上 `IOReport`（`L2`）与内核 `ri_energy_nj`（`L3`）`reported_j` 计数器；在静默隔离的目标机器上开展涵盖电源转换（PSU）、DRAM 与 NVMe 损耗的 `L0` 交流墙插实测（如使用 `Shelly` 或 `Yokogawa` 功率计）仍有待完成。
2. **自主管理的基准选择与外部独立第三方 Tier 3 基准**：尽管 Track-B（`exp-002`）已用四个在 `drand` 第 `6664089` 轮之前锁定的外部公开基准取代了合成模板，但由独立人类第三方编写并托管封存的 Tier-3 盲测基准尚未运行。
3. **有限预算下的非必然性边界**：每一项 `"Relevance shown"`（相关性已证实）裁定均严格相对于已声明的 `dev` 样本量（`100-150` 个实例）以及 `4,096 B` 函数表容量上限而言；未填充键仅证明在该预算内未能覆盖对应案例，绝不构成对非神经过程在数学上不可行性的证明。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

<ol data-refs>
<li>Aamodt, A., &amp; Plaza, E. (1994). Case-based reasoning: Foundational issues, methodological variations, and system approaches. <em>AI Communications</em>, 7(1), 39-59.</li>
<li>Efron, B. (1987). Better bootstrap confidence intervals. <em>Journal of the American Statistical Association</em>, 82(397), 171-185.</li>
<li>Goldberg, E., &amp; Novikov, Y. (2003). Verification of proofs of unsatisfiability for CNF formulas. <em>DATE 2003</em>, 886-891.</li>
<li>Good, I. J. (1953). The population frequencies of species and the estimation of population parameters. <em>Biometrika</em>, 40(3-4), 237-264.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., &amp; Narasimhan, K. (2024). SWE-bench: Can language models resolve real-world GitHub issues? <em>ICLR 2024</em>.</li>
<li>Mamdani, E. H., &amp; Assilian, S. (1975). An experiment in linguistic synthesis with a fuzzy logic controller. <em>International Journal of Man-Machine Studies</em>, 7(1), 1-13.</li>
<li>Michie, D., &amp; Chambers, R. A. (1968). BOXES: An experiment in adaptive control. <em>Machine Intelligence</em>, 2, 137-152.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Patil, S. G., Mao, H., Cheng-Jie Ji, C., Yan, F., Suresh, V., Stoica, I., &amp; Gonzalez, J. E. (2024). Gorilla: Large language model connected with massive APIs (Berkeley Function-Calling Leaderboard). <em>NeurIPS 2024</em>.</li>
<li>Simon, H. A., &amp; Kadane, J. B. (1975). Optimal problem-solving search: All-or-none solutions. <em>Artificial Intelligence</em>, 6(3), 235-247.</li>
<li>Stanfill, C., &amp; Waltz, D. (1986). Toward memory-based reasoning. <em>Communications of the ACM</em>, 29(12), 1213-1228.</li>
<li>Wang, L.-X., &amp; Mendel, J. M. (1992). Generating fuzzy rules by learning from examples. <em>IEEE Transactions on Systems, Man, and Cybernetics</em>, 22(6), 1414-1427.</li>
<li>Wetzler, N., Heule, M. J. H., &amp; Hunt, W. A. (2014). DRAT-trim: Efficient checking and trimming using expressive clausal proofs. <em>SAT 2014</em>, 422-429.</li>
<li>Yao, S., Shinn, N., Razavi, P., &amp; Narasimhan, K. (2024). tau-bench: A benchmark for tool-agent-user interaction in real-world domains. <em>arXiv:2406.12045</em>.</li>
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2025). BigCodeBench: Benchmarking code generation with diverse function calls and complex instructions. <em>ICLR 2025</em>.</li>
</ol>
