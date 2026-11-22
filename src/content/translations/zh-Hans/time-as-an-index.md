---
title: "时间作为索引：查阅未来所需的条件"
deck: "一份针对将时间视为可查询维度的正式、数值与实证审计，涵盖复杂性理论、量子基础、模拟松弛硬件、密码学、Lean 4 内核验证的地平线模型（C1 至 C4，M1 至 M8），以及 195 个已编目的异常与悖论。未连接外部墙壁或导轨电源监测器（board_metered 为 false）。"
lang: "zh-Hans"
source: "time-as-an-index"
complete: true
---

<div id="time-as-an-index-what-it-would-take-to-look-up-tomorrow" class="anchor-alias" aria-hidden="true"></div>

*修订版 af57f48，2026 年 11 月 22 日。数据与摘要概览: [/data/#time-as-an-index](/data/#time-as-an-index). 交互式活跃图形: [/living/time-as-an-index/](/living/time-as-an-index/). LaTeX 归档副本: [/pdfs/latex/time-as-an-index.pdf](/pdfs/latex/time-as-an-index.pdf) ([source](/pdfs/latex/time-as-an-index.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概述

如果能够像查询关系表中的索引行一样直接查询物理或计算系统的未来状态，则顺序的暴力搜索：：密码密钥恢复、哈希原像逆算以及工作量证明谜题求解：：将不再能够保护机密，因为目标证据从未缺失，只是未被索引。本研究在计算复杂性理论、量子逆因果性、物理松弛硬件、密码游戏归约、Lean 4 中的形式化验证（`31` 个经内核检查的定理且没有 `sorry` 公理）、确定性数值与符号模型（`seed = 20261122`）以及三个结构化公共目录共计 `195` 条目（`81` 条报告的时间异常、`40` 条物理频域边缘案例和 `74` 条基础悖论）上检验该前提。未连接任何硬件轨道或交流墙电源计量器（`board_metered = false`）。

结论在形式闭合类时间曲线（CTC）与已知实验室物理之间的边界上呈现清晰分割。 在 Deutsch 的固定点闭合类时间曲线模型内部，多项式时间的经典和量子计算机均可达到完整的多项式空间计算能力，从而在一次固定点查询中崩溃椭圆曲线签名、对称分组密码、密码哈希、工作量证明谜题以及准备-测量量子密钥分发（QKD），仅保留一次性密码本等信息论方案。 在形式时间环之外，没有已知的物理过程能够实现提前查找：量子逆因果解释遵循无信号定理，后选传送环路需支付逆概率重复费用（$\sim 1/p$，在 $1/d^2$ 上达到 $d$ 状态证据电路），模拟动力学求解器以步数换取指数级能量波动或指数级频率精度，且每一个可实现的“未来索引”都归结为受 Hellman $T \cdot M^2 = N^2$ 权衡限制的预计算，在一次 $N$ 步填充后产生盐值并在构建开始前通过新挑战抵消。

**用平常话说**

1. **在数学时间环内部，几乎所有基于数学的锁一次性打开。** 如果硬件能够强制将寄存器送入自身过去并保持不变，仅一致性就会迫使非确定性和多项式空间答案以多项式门数出现；只有一次性密码本等信息论秘密能够存活。
2. **在已知物理中，没有任何东西能够将可读答案向后发送。** 量子延迟选择和逆因果模型严格遵守边际无信号，后选会丢弃大约 $1/p$ 次失败运行以保留一次一致运行；在 `81` 条审计的时间异常报告和 `40` 条频率图册异常中，零个 Grade A 或 Grade B 案例能够作为未解释的来自未来的接收存活。
3. **今天所有可行的“明日查找”都是提前支付的预计算。** 构建表格将搜索提前到填充成本 $N$，遵循 $T \cdot M^2 = N^2$，每擦除一位至少消耗 $k_B T \ln 2$，并且在出现新盐值或前块哈希阻止问题直至使用时刻时完全失效。

研究中的每一条实质性陈述都带有四种显式认识论标签之一。

| Claim label | Operational meaning in this study |
| :--- | :--- |
| **`Established`** | 在其所述的形式模型内通过数学证明，或在同行评审的实验物理中得到复现。 |
| **`Kernel-checked`** | 在 `Lean 4.36.0`（`code_and_proofs/lean/Horizon.lean` 和 `Paradox.lean`）中机械验证，使用零个 `sorry` 占位符且仅依赖标准基础公理（`propext`、`Classical.choice`、`Quot.sound`）。在形式结构上建立数学一致性，绝不涉及自然界的物理主张。 |
| **`Conjecture`** | 连贯的理论提议或有争议的经验异常，具备明确的假设和可检验的反例，既未被证明也未被否定。 |
| **`Speculation`** | 未得到复现测量的支持，除非出现新物理否则与已确立的界限相矛盾，或被追溯至误报/虚构（若有来源造假则标记为 `Debunked`）。 |

<div id="1-terms-and-acronyms" class="anchor-alias" aria-hidden="true"></div>

## 1. 术语与缩略语

<ul id="terms">
<li>CTC, CTCs, D-CTC, D-CTCs, P-CTC, P-CTCs: 闭合类时间曲线（们），Deutsch 固定点闭合类时间曲线（们），以及后选传送闭合类时间曲线（们）</li>
<li>CR, CV, CNOT, SWAP: 遵守时间顺序的寄存器，违反因果性的寄存器，受控非门，双量子比特状态交换门</li>
<li>PSPACE, NP, coNP, BQP, PP, PostBQP, HALT: 多项式空间复杂度类，非确定性多项式时间，NP 的补类，有界误差量子多项式时间，概率多项式时间，后选有界误差量子多项式时间，图灵停机预言机</li>
<li>SAT, CNF, QKD, BB84, B92, OTP: 布尔可满足性问题，合取范式，量子密钥分发，Bennett‑Brassard 1984 协议，Bennett 1992 双态协议，一次性密码本</li>
<li>IND-CPA, IND-CCA, UUF-CMA, EUF-CMA: 选择明文攻击下的不可区分性，选择密文攻击下的不可区分性，选择消息攻击下的通用不可伪造性，选择消息攻击下的存在性不可伪造性</li>
<li>ECDSA, RSA, AES, SHA, PoW, ASIC, ASICs, IACR: 椭圆曲线数字签名算法，Rivest‑Shamir‑Adleman 加密体系，高级加密标准，安全散列算法（SHA‑256 及双重散列 SHA‑256d），工作量证明，专用集成电路，专用集成电路，国际密码学研究协会</li>
<li>SQL, TSQL2, DAG, DFT, FFT, DPSS: 结构化查询语言，时序 SQL2 规范，有向无环图，离散傅里叶变换，快速傅里叶变换，离散平带球面序列</li>
<li>TOPS, ARIA, BCI, BCIs, LLM, RL, IMO: 每秒万亿次操作，高级研究与发明局，脑机接口，脑机接口，大语言模型，强化学习，国际数学奥林匹克</li>
<li>DRM, AUC, QRNG, VLF, SEP, KJV, ZFC: Deese‑Roediger‑McDermott 虚假记忆范式，受试者工作特征曲线下面积，量子随机数生成器，极低频，斯坦福哲学百科全书，钦定版圣经，带选择公理的 Zermelo‑Fraenkel 集合论</li>
<li>MOND, RAR, CDM, LIGO, EHT, FRB, CMB, GRB, AGN, PTA, JWST, ALMA: 修正牛顿动力学，径向加速度关系，冷暗物质（平坦 Lambda‑CDM），激光干涉引力波天文台，事件视界望远镜，快速射电暴，宇宙微波背景，伽马射线暴，活动星系核，脉冲星计时阵列，詹姆斯·韦伯太空望远镜，阿塔卡马大型毫米/亚毫米阵列</li>
<li>HVP, QCD, QED, EFT, AMPS, DESI, SH0ES: 强子真空极化，量子色动力学，量子电动力学，有效场论，Almheiri‑Marolf‑Polchinski‑Sully 防火墙论证，暗能量光谱仪，超新星及 $H_0$ 用于状态方程</li>
<li>OPERA, LSND, BEST, MICROSCOPE, GPS, RTG: 振荡项目与乳胶跟踪装置，液体闪烁体中微子探测器，Baksan 静止转变实验，微卫星等效原理观测实验，全球定位系统，放射性同位素热电发电机</li>
<li>AIR, SPR, DNA, NRC, TSVF, EPR, SNR, QNM, ULP, CODATA, DOI: 美国研究所，超心理学研究会，脱氧核糖核酸，国家研究委员会，两态矢量形式，爱因斯坦‑波多尔斯基‑罗森，信噪比，准常模，最后有效位，国际科学理事会数据委员会，数字对象标识符</li>
<li>TA, TA001, TA007, TA008, TA009, TA011, TA012, TA014, TA015, TA016, TA017, TA025, TA030, TA031, TA032, TA033, TA036, TA053, TA062, TA063, TA064, TA065, TA066, TA067, TA070, TA077, TA081: 时间异常目录条目标识符（`data/temporal-anomaly-catalog.csv`）</li>
<li>AA, AA01, AA02, AA03, AA04, AA05, AA06, AA07, AA08, AA09, AA10, AA11, AA12, AA17, AA18, AA19, AA26, AA31, AA32, AA34, AA37, AA38, AA40: 频率异常图集条目标识符（`data/anomaly-atlas.csv`）</li>
<li>CSV, JSON, API, PyPI, AGPL, GPL, IP, CD, PROJEKT, WebMCP, RCE, LUT6: 逗号分隔值，JavaScript 对象表示法，应用程序编程接口，Python 包索引，GNU Affero 通用公共许可证，GNU 通用公共许可证，知识产权，CD PROJEKT 公司商标持有者，Web 模型上下文协议，Reality Code Engine [same house]，6 输入布尔查找表 [same house]</li>
</ul>

为了使前向引用从上至下保持透明，第 1 节定义记号，第 2 节回顾时间循环复杂度，第 3 节讨论时间索引和 Hellman 预计算，第 4 节分析逆因果和物理松弛，第 5 节映射密码学存活性，第 6 节评估候选公理 `A1 to A8` 与零点条件 `Z1 to Z6`，第 7 节证明 Horizon 条件 `C1 to C4` 并运行模型 `M1 to M8`，第 8 节审计三个经验账本（`TA001` 到 `TA081`、`AA01` 到 `AA40`、以及 `P01 to P74`），第 9 节整合伪证 `F1 to F19` 以及游戏机制。此前的 Open Interface Engineering 研究 - [Thermodynamic Bounds and an Optimal Tempo](/papers/agency/)、[Metered Commit Gates](/papers/gates/)、[Deterministic Null](/papers/deterministic-null/)、以及 [Downward LUT6 Compilation](/papers/lut-adapt/) - 为 `[same house]` 伴随文献，仅作架构上下文引用。

<div id="2-formal-models-of-time-loops-in-computation-d-ctc--pspace-p-ctc--pp-unbounded-δ2" class="anchor-alias" aria-hidden="true"></div>

## 2. 计算中时间循环的正式模型（`D-CTC = PSPACE`，`P-CTC = PP`，无界 $\Delta_2$）

Deutsch（1991）通过要求闭合类时间曲线边界的运动学自洽性，解决了有限量子寄存器上的经典祖父悖论。设在 $\mathcal{H}_{\text{CR}}$ 上的遵循因果顺序的输入态 $\rho_{\text{in}}$ 通过联合酉算子 $U$ 与在 $\mathcal{H}_{\text{CV}}$ 上重新进入自身过去的违背因果性的寄存器 $\rho_{\text{CTC}}$ 发生相互作用。自洽性要求 $\rho_{\text{CTC}}$ 成为诱导量子信道（模型内部标记为 `Established`）的固定点：

$$\rho_{\text{CTC}} = \mathrm{Tr}_{\text{CR}}\!\left[\, U \left(\rho_{\text{in}} \otimes \rho_{\text{CTC}}\right) U^\dagger \,\right], \qquad \rho_{\text{out}} = \mathrm{Tr}_{\text{CV}}\!\left[\, U \left(\rho_{\text{in}} \otimes \rho_{\text{CTC}}\right) U^\dagger \,\right].$$

由于在有限维紧凑凸态空间上的每个完全正迹保持信道至少存在一个 Schauder‑Brouwer 固定点，任何电路都不会触发逻辑矛盾；相反，确定性的悖论会转化为混合态。关键在于，由于 $\rho_{\text{CTC}}$ 依赖于 $\rho_{\text{in}}$，有效的输入到输出映射 $\rho_{\text{in}} \mapsto \rho_{\text{out}}$ 在 $\rho_{\text{in}}$ 上是 **非线性** 的。正是这种非线性：：而非单纯的量子叠加：：推动了所有形式的 CTC 模型中的计算跃迁。

| 正式结果 | 数学陈述 | 出版地点 / 状态 | 认识论标签 |
| :--- | :--- | :--- | :--- |
| **Brun (2003)** | 经典固定点寄存器检查来自未来的候选因子，否则运行穷举回退搜索，仅在因子出现且不运行搜索时一致。 | *Found. Phys. Lett.* 16:245 | **`Established`** (classical model) |
| **Bacon (2004)** | 多项式门量子电路耦合 `D-CTC` 量子比特通过在环路传递中指数放大微小状态分离来求解 `NP` 完全 `SAT`。 | *Phys. Rev. A* 70:032309 | **`Established`** (in `D-CTC` model) |
| **Aaronson & Watrous (2009)** | 经典和量子多项式时间 `D-CTC` 机器具有相同的计算能力：$\mathrm{P}_{\text{CTC}} = \mathrm{BQP}_{\text{CTC}} = \mathrm{PSPACE}$。对抗性固定点选择保持在 $\mathrm{PSPACE}$ 内。 | *Proc. R. Soc. A* 465:631 | **`Established`** (in `D-CTC` model) |
| **Bennett, Leung, Smith & Smolin (2009)** | 在*标记*统计集合上，`D-CTC` 演化违反凸线性性；在标记混合上定义计算可消除状态判别捷径。 | *Phys. Rev. Lett.* 103:170502 | **`Established`** critique; interpretation contested |
| **Lloyd et al. (2011)** | `P-CTC` 通过基于贝尔态后选的量子遥传实现时间环路，对不一致分支赋予零权重；计算能力等价于 $\mathrm{PostBQP} = \mathrm{PP}$。 | *Phys. Rev. Lett.* 106:040403; *Phys. Rev. D* 84:025007 | **`Established`** (circuit model & photonic test of circuit, not a spacetime CTC) |
| **Brun, Wilde & Winter (2013)** | 多项式 `D-CTC` 电路以任意保真度克隆任意量子态，使 `D-CTC` 状态空间实际上可被经典访问。 | *Phys. Rev. Lett.* 111:190401 | **`Established`** (in `D-CTC` model) |
| **Aaronson, Bavarian, Gueltrini et al. (2024 v2)** | 无界宽度 `D-CTC` 图灵机恰好决定 $\Delta_2 = \mathrm{P}^{\mathrm{HALT}}$（可归约到停机问题的语言），纠正了 Raat (2023) 指出的 2016 预印本错误。 | `arXiv:1609.05507v2` (Oct 2024) | **`Established`** (corrected preprint) |

两个结构性细节支配每个固定点算法。首先，在 Brun (2003) 的知识创造构造中，回退的穷举循环在一致历史中从未执行，但**必须在电路描述中物理存在并能够终止**；删除回退会恢复诸如 `0` 的平凡非解固定点。其次，固定点不必唯一（`polchinski_multiplicity`）。复现 Bishop 的 `Qhronology`（`arXiv:2601.17459`, `v1.2.1`, AGPL-3.0-or-later non-commercial）祖父电路：：在 `CV` 上受控的 `CNOT` 以 `CR` 为目标，随后 `SWAP`，输入为 $|0\rangle\langle 0|_{\text{CR}}$：：在精确符号 SymPy（`M2`, `code_and_proofs/run_models_m1_m8.py`）下产生整个一参数对角族 $\rho_{\text{CR}} = \rho_{\text{CV}} = g|0\rangle\langle 0| + (1-g)|1\rangle\langle 1|$（$g \in [0,1]$）在 `D-CTC` 下，而 `P-CTC` 将 `CR` 唯一投影到 $|+\rangle\langle +|$，并伴随最大混合 $\rho_{\text{CV}} = I/2$。

<figure class="my-8">
  <img src="/figures/time-as-an-index/ctc-vs-physics-hierarchy.svg" alt="五层层级比较无限制 D-CTC、多项式 D-CTC、后选 P-CTC、标准量子 BQP 与已知物理索引对密码学存活性的影响。" />
  <figcaption>图 1. 复杂度上限与密码学存活性，从形式闭合类时间回路（<code>Δ₂</code> 和 <code>PSPACE</code>）一直到后选电路（<code>PP</code>）、标准量子算法（<code>BQP</code>）以及物理可实现的预计算（<code>Hellman T·M² = N²</code>）。合成图示，非硬件功耗读数。</figcaption>
</figure>

<div id="3-time-as-an-index-in-known-physics-temporal-databases-retroactive-lower-bounds-and-hellmans-tm2n2" class="anchor-alias" aria-hidden="true"></div>

## 3. 已知物理学中作为索引的时间：时间数据库、追溯下界与 Hellman's $T \cdot M^2 = N^2$

计算机科学已经将已记录的过去时间视为显式索引（`Established`）：

1. **时序关系表和事件日志**：`SQL:2011` 标准化了应用时间和系统版本化表，遵循 Snodgrass 的 `TSQL2` 设计（Kulkarni 和 Michels 2012），而确定性记录与重放调试器如 `rr`（O'Callahan 等 2017）通过记录非确定性输入并前向重执行转移来重建过去的程序状态。
2. **持久化与回溯数据结构**：Driscoll、Sarnak、Sleator 和 Tarjan（1989）证明，全持久化：：查询或分支任何过去版本且从不修改历史：：每步仅增加 $O(\log n)$ 开销。相比之下，Demaine、Iacono 和 Langerman（2007）证明，*回溯*数据结构：：在过去时间戳 $t_0$ 插入或删除操作并在随后 $r$ 次操作中查询更新后的现在：：一般情况下需要 $\Omega(r / \log r)$ 倍的乘法开销（`Established`）。重写早期步骤会迫使对其后链进行因果重新评估。
3. **预计算作为唯一的物理未来索引**：对一个 $N$-状态确定性映射 $f : \{0,\dots,N-1\} \to \{0,\dots,N-1\}$ 的未记录未来状态进行索引，需要提前评估 $f$。Hellman（1980）使用长度为 $t$ 的 $m$ 哈希链量化了这种权衡：存储 $(x_{\text{start}}, x_{\text{end}})$ 对占用 $M = m$ 词的内存，在线求逆需要在覆盖 $m t^2 = N$ 状态的 $t$ 张表中进行 $T = t^2$ 次评估，且组合内存 $M_{\text{tot}} = m t$ 满足（`Established`）：

$$T \cdot M_{\text{tot}}^2 = N^2 \qquad \text{after a one-time table fill of } \Theta(N) \text{ evaluations.}$$

在平衡运行点 $M_{\text{tot}} = T = N^{2/3}$（对于 $N = 2^{16} = 65{,}536$，$N^{2/3} \approx 1{,}625.5$）时，在线查找之所以快速，仅因为填充工作已在前期支付了完整的 $N$ 步穷举搜索，随后通过 Oechslin（2003）彩虹表在常数因子上进一步优化，并由 Fiat 和 Naor（2000）证明对通用随机函数是最优的，同时符合 Bennett（1989）可逆铺石界限。使用 $s$ 随机位进行加盐会将填充工作乘以 $2^s$，而将查询绑定到新挑战（请求后 nonce 或前一区块头哈希）则将预计算表的复用率降至零（在 `M7` 中对 `200` 次新块试验的复用率为 `0.0%`，而单表未加盐恢复的复用率为 `34.0%`）。

<div id="4-retrocausality-no-signalling-physical-settling-and-the-gabor-frequency-window" class="anchor-alias" aria-hidden="true"></div>

## 4. 逆因果律、无信号传输、物理沉降与 Gabor 频率窗

<div id="41-quantum-retrocausality-and-the-postselection-bill" class="anchor-alias" aria-hidden="true"></div>

### 4.1 量子逆因果律与后选择代价

若干基础方案使用未来边界条件描述量子关联：Aharonov‑Bergmann‑Lebowitz（1964）双态向量形式（`TSVF`，`Established` 为等价改写），Leifer 与 Pusey（2017）定理指出任何 $\lambda$‑介导的时间对称本体论若要再现纠缠必须容许逆因果关联（在给定假设下 `Established`），Price 与 Wharton（2015）之锯齿阅读（`Speculation` 为新物理），Castagnoli（2009‑2025）解释规则将量子查询计数与获得一半解位的经典学习者进行比较（`Conjecture`），以及 Aharonov 与 Elitzur（`arXiv:2611.12971`，2026 年 11 月预印本）提出的双支路时间平移模型，其中后选原子再激发仅在环境辐射记忆时间内存活：：大约为自由空间中的 $1\text{ fs}$：：随后要求指数衰减的后选概率（`Conjecture`）。同样，Ji、Lloyd 与 Wilde（*Phys. Rev. Lett.* 136:230801, 2026）从最大信息和正则化 Doeblin 信息推导出噪声 `P-CTC` 逆因果容量，并明确指出标准量子力学允许零后向信号传递（在 `P-CTC` 中 `Established`）。

这些框架皆未产生早期查找 oracle，因为标准量子力学满足 **no-signalling theorem**：对于任意双体或双时态 $\rho_{12}$ 以及任意通过设置 $y$ 自由选择的未来/远程仪器 $\{E_b^y\}$，只要满足 $\sum_b E_b^y = I_2$，则较早的边缘结果分布严格独立于 $y$：

$$P(a \mid x, y) = \mathrm{Tr}\!\left[(M_a^x \otimes I_2)\,\rho_{12}\right] = P(a \mid x).$$

以概率 $p$ 对期望的后选结果 $b = b^*$ 进行条件化，需要大约重复准备 $1/p$ 次（“anthropic computing”，Aaronson 2005）。在显式的幺正见证搜索模型 `M2b`（`3` 到 `6` 位，比特，希尔伯特维度 $d = 2^n \in \{8, 16, 32, 64\}$）中，`P-CTC` 贝尔投影以精确概率 $P_{\text{post}} = 1/d^2$ 成功，需要期望重复 `64`、`256`、`1,024`、`4,096` 次：：严格而言比经典 $d/2$ 穷举猜测（`4` 到 `32` 次查询）更昂贵。

<div id="42-analog-settling-hardware-and-the-gabor-uncertainty-barrier" class="anchor-alias" aria-hidden="true"></div>

### 4.2 模拟沉降硬件与 Gabor 不确定性屏障

Physical relaxation machines 用连续动力学取代离散时钟滴答，但每一种已分析的基底都将指数级组合硬度重新定位到另一种物理资源（`Established` 模式，Aaronson 2005）：

| Physical substrate | Mechanism | Limiting resource barrier | Status |
| :--- | :--- | :--- | :--- |
| **Physical reservoir computing** | 固定非线性介质投射过去的输入流；线性读出层训练（Tanaka et al. 2019）。 | 对过去到达的因果滤波；对未来输入零前瞻。 | **`Established`** |
| **Coherent Ising machines** | 简并光学参量振荡器松弛至低损耗自旋态（Inagaki et al. 2016; McMahon et al. 2016）。 | 启发式近似；连通性、校准以及硬实例求解时间仍未解决（*Nat. Rev. Phys.* 2026 年 11 月）。 | **`Established`**（启发式） |
| **Continuous-time analog `SAT`** | 具有解吸引子的确定性常微分方程（Ercsey-Ravasz & Toroczkai 2011）。 | 多项式连续坐标时间需要 **指数级辅助变量 / 能量波动** 跨越分形混沌盆地。 | **`Established`** |
| **Frequency-multiplexed memcomputing** | 将 $2^n$ 子集和编码到谐波频率中（Traversa & Di Ventra 2015）。 | 在有限带宽内分辨 $2^n$ 频率需要 $\delta f \sim 2^{-n}$，从而观察窗口 $\Delta t \gtrsim 2^n$ 和每条线的 $2^{-n}$ 振幅（Aaronson 2015）。 | **`Speculation`**（多项式尺度有争议） |
| **Thermodynamic & `p-bit` silicon** | Normal Computing `CN101`（2025 年 tape-out；ARIA 2026 年 bring-up）和 Extropic `Z1`（预计 `269,568` `p-bits`，`arXiv:2510.23972`）。 | 目标为线性代数/蒙特卡罗采样；`1,000x`-`10,000x` 效率数字为厂商目标/预测，而非硬件层面的 `NP` 证明。 | **`Speculation`**（厂商目标） |

在频域中表示轨迹 $x(t)$ 通过 $X(f) = \int x(t) e^{-2\pi i f t}\,dt$：：无论是数字上在 $O(N \log N)$ 运算（Cooley and Tukey 1965）还是光学上在硅金属透镜 `DFT` 阵列的单次传播（Tanuwijaya et al. 2025, `arXiv:2502.08770`）以及光子联合变换相关器（Yang et al. 2025, `arXiv:2504.01117`，投射 `305 TOPS/W`）：：都要求在变换之前完整的样本窗口已存在，并遵循 Gabor（1946）均方根不确定性乘积（`Established`）：

$$\Delta t \cdot \Delta f \;\ge\; \frac{1}{4\pi}.$$

频率变换以时间局部性换取频谱分辨率；它永不消除分离紧密模式所需的观察时长。

<div id="5-cryptographic-consequences-ecdsa-sha-256d-proof-of-work-symmetric-ciphers-qkd-stateful-rewinding" class="anchor-alias" aria-hidden="true"></div>

## 5. 密码学后果（`ECDSA`，`SHA-256d` 工作量证明，对称密码，`QKD`，有状态回溯）

每个标准的公钥、对称密钥和哈希谜题都能在多项式时间内验证候选见证，从而将密钥恢复和随机数搜索置于 $\mathrm{NP}$（或 $\mathrm{NP} \cap \mathrm{coNP}$）$\subseteq \mathrm{PSPACE}$。因此，一个多项式 `D-CTC` 预言机在一次固定点评估中即可破坏所有计算密码学，而现实中的量子和经典索引攻击则在代数结构和输入新鲜度上呈现明显分界：

| 加密目标 | 正式 `D-CTC` (`PSPACE`) | 标准量子 (`BQP`) | 物理预计算 (`已知物理`) |
| :--- | :--- | :--- | :--- |
| **`ECDSA` / `secp256k1`** | **已破**（`1` 固定点查询） | **已破** 在 $\mathrm{poly}(\log N)$ 通过 Shor 的群周期算法 (Aggarwal et al. 2018) | **安全** 对于 256 位随机曲线密钥的通用表格安全 |
| **`SHA-256d` Proof of Work** | **已破** (`M7`: `1` 查询解决 `8, 12, 16` 位谜题) | 二次 Grover $\frac{\pi}{4}\sqrt{N}$; **无净优势** 相较于专用 `ASIC` 时钟速率的近期情况 | **安全**：头部提交到 `prev_block_hash`，防止预块表填充（`M7` 中 `0.0%` 重用） |
| **静态哈希原像** | **已破** | $2^n \to 2^{n/2}$ 查询（Grover 最优） | **未加盐的密码** 降至 Hellman/彩虹表；每用户盐将填充乘以 $2^s$ |
| **Symmetric `AES-256`** | **已破**（已知明文密钥搜索） | $\sim 2^{128}$ Grover 查询（保留 $\approx 128$ 位后量子安全） | 固定明文 Hellman 表在 $N = 2^{256}$ 不可行（Landauer 填充下限 $\approx 3.32 \times 10^{56}\text{ J}$） |
| **Prepare-and-measure `QKD` (`BB84`, `B92`)** | **在 `D-CTC` 中已破** 通过非线性状态克隆/判别（Brun, Harrington & Wilde 2009；Bennett et al. 2009 对标记混合的争议） | **安全** 基于希尔伯特空间不可克隆性和单配性 | 不适用（在线物理通道） |
| **有状态 vs 无状态游戏** | 若密钥是计算性的则已破 | 取决于底层原语 | **Meier (2022)** (`IACR ePrint 2022/1148`): 多项式限制的状态回溯破坏有状态 `IND-CCA` 和 `EUF-CMA` 记账，而无状态 `IND-CPA` 和 `UUF-CMA` 保持 |
| **一次性密码本 (`OTP`) 与秘密共享** | **无条件安全** | **无条件安全** | **无条件安全**（所有明文保持等概率） |

<div id="6-candidate-searchable-time-axioms-a1a8-zero-point-ledger-z1z6-reconstruction-memory-and-bci-bits-per-joule" class="anchor-alias" aria-hidden="true"></div>

## 6. 候选可搜索时间公理（`A1`-`A8`）、零点账本（`Z1`-`Z6`）、重构记忆与 `BCI` 每焦耳比特数

<div id="61-testing-candidate-axioms-a1-to-a8-and-zero-point-ledger-z1-to-z6" class="anchor-alias" aria-hidden="true"></div>

### 6.1 测试候选公理 `A1 to A8` 与零点账本 `Z1 to Z6`

| Candidate axiom | Evaluation against established physics | Label |
| :--- | :--- | :--- |
| **`A1`** (Time = net count of irreversible transitions; restored transitions add zero) | 在概念上与 Connes‑Rovelli (1994) 的热时间以及 Barbour (2009) 的关系配置相联系，但光学钟确认相对论的固有时间 $d\tau/dt = 1 + \Phi/c^2$ 与滴答耗散无关 (`F1`). | **`Conjecture`** |
| **`A2`** (Each bit restoration costs $k_B T \ln 2$) | 对 *盲* 2‑to‑1 复位严格成立（在 `300 K` 下为 `2.87e-21 J`，Landauer 1961）；已知的可逆反计算在热力学上没有下限 (Bennett 1973, `F2`). | **`Established`** (blind reset); conflicts for reversible |
| **`A3`** (Local arrow reversal where restoration succeeds) | 子系统熵可以局部下降，而向外输出的热浴热量保持闭合系统熵在第二定律下不减. | **`Established`** locally |
| **`A4`** (Asynchronous cellular events stitched ~80 ms post‑hoc) | 成人人体包含 $\sim 3.0 \times 10^{13}$ 人体细胞和 $\sim 3.8 \times 10^{13}$ 细菌，日更换 $\sim 3.3 \times 10^{11}$ 细胞/天 (Sender, Fuchs & Milo 2016)，且闪光‑滞后感知整合随后出现的 $\sim 80\text{ ms}$ (Eagleman & Sejnowski 2000; `F7`). | **`Established`** biology/percept; **`Speculation`** as fundamental physics |
| **`A5`** (Same‑element atoms lead/lag; retain distribution rather than mean) | 光学钟在 $33\text{ cm}$ ($(4.1 \pm 1.6)\times 10^{-17}$, Chou et al. 2010) 以及跨越 $1\text{ mm}$ 的锶 $-9.8(2.3)\times 10^{-20}\text{ mm}^{-1}$（匹配 $g/c^2 = 1.09\times 10^{-19}\text{ mm}^{-1}$, Bothwell et al. 2022) 上解析引力时延。测量的是速率梯度，而非未来访问 (`F3`). | **`Established`** rates; **`Conjecture`** for extra information |
| **`A6`** (Temporal coexistence searchable like spatial coexistence) | Minkowski 符号 $(-,+,+,+)$ 将空间查询限制在沿过去光锥 $J^-(o)$ 到达的信号上；读取 $J^-(o)$ 之外的记录不违背无信号传递原则 (`F4`, `F6`). | **`Speculation`** (for future cone) |
| **`A7`** (Cycles queryable in invertible Fourier / Compton basis) | Plancherel 恒等式 $E = h\nu$ 与 Cs‑133 物质波钟接近 $\nu_C = 2.993 \times 10^{25}\text{ Hz}$ (Lan et al. 2013) 已得到验证，但受 Gabor $\Delta t \cdot \Delta f \ge 1/(4\pi)$ 窗口界限限制 (`F5`). | **`Established`** math; **`Speculation`** as lived frame |
| **`A8`** (Querying time is querying vacuum energy) | 时间平移 Noether 共轭 **保持** 能量而非提供自由功；受零点账本 `Z1 to Z6` 控制 (`F8`). | **`Established`** conjugacy; **`Speculation`** for net harvest |

对于真空能量提取（`Z1` 到 `Z6`），六条会计规则关闭每一个已知的实验室循环（`Established`）：（`Z1`）静止基态是被动的，$\mathrm{Tr}(U \rho_0 U^\dagger H) \ge E_0$（`500/500` Haar 随机酉矩阵在 `M6` 中得到验证，最小 $\Delta E = +0.347 > 0$）；（`Z2`）动态卡西米尔光子对 $\omega_1 + \omega_2 = \omega_d$ 直接从边界泵汲取能量（Wilson 等 2011；`M6` 在 $r = 5.0$ 处的参量压缩产生 $\sinh^2(5) = 5.51 \times 10^3$ 光子，由泵功支付）；（`Z3`）静态镜面吸引 $P = \pi^2 \hbar c / (240 a^4)$（在 $1\,\mu\text{m}$ 处为 `1.30e-3 Pa`，Lamoreaux 1997；在 $10\text{ nm}$ 处为 `1.30e5 Pa`）产生一次性功 $\pi^2 \hbar c / (720 a^3) = 4.33 \times 10^{-10}\text{ J/m}^2$，在 $1\,\mu\text{m}$ 处以相同方式在复位时偿还（$W_{\text{net}} = 0$）；（`Z4`）反馈排序为每个被抹去的比特支付 $\ge k_B T \ln 2$；（`Z5`）实验室参考系缺乏 CTC 或非静止度规泵；以及（`Z6`）任何主张都必须在 $5\sigma$（`F8`）之上拥有闭环热量计盈余。

<div id="62-constructive-memory-provenance-fidelity-textual-timelessness-and-bci-throughput" class="anchor-alias" aria-hidden="true"></div>

### 6.2 构造性记忆、溯源保真度、文本无时性与 `BCI` 吞吐量

神经科学和认知心理学将人类记忆牢牢置于 **允许的过去光锥重建** 分支 (`C4`) 中，其中绑定失败模式是 *来源* 而非向后因果 (`Established`)。

* **建构性回忆与编码后失真**：在蛋白质合成阻断下被重新激活的记忆变得易变（Nader, Schafe & LeDoux 2000）；Bartlett（1932）的建构性回忆和Schacter（1999）的来源误归因在Loftus和Palmer（1974）中以量化形式出现，其中将动词从*“smashed”*改为*“hit”*导致一周后错误的碎玻璃回忆率从`14%`上升到`32%`，在Roediger和McDermott（1995）的`DRM`范式中，从未出现的关键诱饵在实验1中被回忆的比例为`40%`，实验2为`55%`（`F10`）。海马逆向重放（Foster & Wilson 2006）、θ-γ相位编码（Lisman & Jensen 2013）、预测处理（Friston 2010; Clark 2013）以及在未探索轨道前对`14.2%`合格事件的休息前演示（Dragoi & Tonegawa 2011）反映的是内部生成的先验而非未来信号。来源保真度通过$I(R; E) / H(R)$在重建$R$与编码的过去记录$E$之间进行量化。

* **媒体密度、目击者转述衰减与既视感**：纠正早期草稿中术语互换的错误，McLuhan的《Understanding Media》（1964）将*热*媒体（如字母印刷）定义为高分辨率/低参与度，而*冷*媒体定义为稀疏/高参与度；中性表述时，通道重建需求$D = 1 - I(X; C)/H(C)$利用内部生成的先验（`Conjecture`）。在人类链条中（Wells & Olson 2003; NRC 2014），每跳保留率$f$随$f^k$（$0.9^{10} = 0.35$）衰减。调查显示约三分之二的成年人经历过既视感（Brown 2004），但虚拟导航实验确认即使有增强的知觉，下一转预测仍保持在随机水平（Cleary & Claxton 2018; `F12`），Bem（2011）的$d = 0.22$事后促进在大规模复制中失败（Ritchie et al. 2012, $p = 0.83$; Galak et al. 2012, $N = 3{,}289$, $d = 0.04$; `F11`）。

* **经文与哲学的永恒性映射到因果锥**：经典文本：：`2 Samuel 23:2`（*“The Spirit of the Lord spake by me”*）、`Psalm 90:4`（*“a thousand years in thy sight are but as yesterday”*）、奥古斯丁《忏悔录》XI.18-20（过去的事物作为记忆的现在，作为视野的现在，作为期待的未来，阅读现在的迹象和因果），波爱修斯《慰藉》V.6（永恒作为超越时间序列的同步占有），Weyl（1949）以及Barbour的时间胶囊：：区分位于时空之外的非时间立场（神学/形而上学，实验物理学之外）与位于时空内部的具身观察者，对后者而言，从过去光锥的星光和档案中组装更宽广的“现在”是`Established`，而从外部接收特定未来结果$J^-(o)$将构成类时空信号（`F4`, `F6`, `F11`, `Speculation`）。

* **人类输出带宽与`BCI`每焦耳比特数**：相对于$\sim 20\text{ W}$全脑代谢功率（Balasubramanian 2021）和$\sim 10^9\text{ bit/s}$感官摄入，人类行为吞吐量平均为$\sim 10\text{ bit/s}$（Zheng & Meister 2025），跨语言语音在`17`种语言中平均为`39 bit/s`（Coupé et al. 2019），产生$\eta = R/P \approx 0.5$至$1.95\text{ bit/J}$：：约为$310\text{ K}$Landauer上限$1/(k_B T \ln 2) = 3.37 \times 10^{20}\text{ bit/J}$的$1.7 \times 10^{20}$倍（`M5`）。皮层内语音`BCI`：：`78`词/分钟（$\approx 19\text{ bit/s}$, Metzger et al. 2023），`62`词/分钟（$\approx 15\text{ bit/s}$, Willett et al. 2023），以及`31.6`词/分钟（$\approx 7.7\text{ bit/s}$, Card et al. 2024）：：仍低于自然语音，并依赖语言模型先验，其作者身份比例必须审计（`F13a`, `F13b`）。

<figure class="my-8">
  <img src="/figures/time-as-an-index/past-cone-provenance-dag.svg" alt="因果有向无环图，比较实线的过去光锥记录重建边与虚线的推测时空信号边。" />
  <figcaption>图 2. 允许的过去光锥重建（实线：有损编码、已存记录、模式/解码器先验以及来源门 <code>I(R;E)/H(R)</code>）与来自外部 <code>J⁻(o)</code> 的推测时空接收（虚线边，在 <code>5σ</code> 下由 <code>F4, F6, F11, F12, F19</code> 测试）进行对比。</figcaption>
</figure>

<div id="7-the-horizon-theorem-c1c4-explicit-models-m1m8-and-lean-4-kernel-checked-proofs" class="anchor-alias" aria-hidden="true"></div>

## 7. 地平线定理（`C1`-`C4`）、显式模型（`M1`-`M8`）与 Lean 4 内核验证证明

<div id="71-formal-horizon-and-consistency-theorems-code_and_proofsleanhorizonlean" class="anchor-alias" aria-hidden="true"></div>

### 7.1 正式地平线与一致性定理（`code_and_proofs/lean/Horizon.lean`）

在任意时刻 $t$ 系统的状态何时是当前记录 $R$ 的一个定义良好的数学函数，且不违反相对论或量子力学？第 7 节将四个联合相容的充分条件（`C1 to C4`）连同粗粒记录视界（`H-coarse`）形式化，并在自包含的 `Lean 4.36.0` 中验证了 `17` 条视界定理与 `14` 条悖论定理（共 `31` 条，零 `sorry`）（灵感来源于内核验证工作流，如 AlphaProof，Hubert et al. 2025）：

| 视界条款 | 形式数学陈述 | 已验证的 Lean 4 定理（`TQ`） | 状态 |
| :--- | :--- | :--- | :--- |
| **`C1` 忠实索引** | 每个有限严格无环因果序均存在一个单射线性扩展嵌入 $\mathbb{N}$，保持因果先后关系（$u \prec v \implies \mathrm{idx}(u) < \mathrm{idx}(v)$）。 | `M1.exists_time_index`，`M1.dag_irrefl`，`M1.dag_asymm` | **`Kernel-checked`**（`propext`，`Quot.sound`） |
| **`C2` 无损动力学** | 在单射/双射步进演化 $T$（有限幺正性）下，$T^t(R)$ 被唯一确定，不同当前态映射到不同未来态，且 $T^{-t}(T^t(R)) = R$ 与 $I(R; X_t) = H(X_t) = 4.000\text{ bits}$ 在 `16` 个状态上成立。 | `future_determined`，`iterate_injective`，`past_recovered` | **`Kernel-checked`**（`0` 公理 / `propext`） |
| **`C3` 带限结构** | 任意 $d$ 模多项式/三角信号（$z = e^{i\omega t}$）在任意 $d$ 个两两不同的过去采样点处被唯一确定于每个未来点；$\mathbb{Z}/4\mathbb{Z}$ 上的 `DFT` 满足精确 Plancherel 范数守恒 $\sum |X_k|^2 = 4 \sum |x_n|^2$。 | `M3.future_from_past_samples`，`M3.plancherel_z4` | **`Kernel-checked`**（标准 3） |
| **`C4` 过去光锥局域性** | 在 $1+1$ 闵可夫斯基空间中，$(\Delta t)^2 - (\Delta x)^2 = du \cdot dv$，时序先后关系是非自反且传递的，且 $I^+(o)$ 与 $J^-(o)$ 严格不相交（`past_cone_no_future_access`）。 | `M4.interval_lightcone`，`M4.future_timelike`，`M4.future_irrefl`，`M4.future_trans`，`M4.past_cone_no_future_access` | **`Kernel-checked`**（标准 3） |
| **`H-coarse` 视界边界** | 任何非单射粗粒记录（例如双原子均值 `(-1, 1)` 与 `(0, 0)` 之比较，或 4 位状态的 2 位分箱）均**不**存在精确解码器；噪声与有限 Slepian 窗口使外推误差在窗口视界处发散。 | `M1.coarse_record_horizon`，`M1.mean_not_injective`，`M5.erase_not_injective` | **`Kernel-checked`**（`0` 公理） |
| **联合可满足性** | 存在显式非空见证，同时满足 `C1`、`C2`、`C3` 与 `C4`，以及基态被动性（`M6.ground_state_passive_two_level`）。 | `horizon_conditions_consistent`，`M6.ground_state_passive_two_level` | **`Kernel-checked`**（`propext`，`Quot.sound`） |

<div id="72-numerical--symbolic-verification-across-m1-to-m8-and-f5-seed--20261122" class="anchor-alias" aria-hidden="true"></div>

### 7.2 跨 `M1 to M8` 与 `F5` 的数值与符号验证（`seed = 20261122`）

执行 `code_and_proofs/run_models_m1_m8.py` 会生成确定性的 JSON 验证（`code_and_proofs/models_m1_m8_results.json`），覆盖所有八个模型以及预先注册的 `F5` 谱测试。

| Model | Verified computation (`seed = 20261122`) | Quantitative output | Physical falsifier |
| :--- | :--- | :--- | :--- |
| **`M1` Indexed dataset** | `n = 1,000,000` 条有序记录；直接索引 vs 二分查找 vs 线性扫描至 `777,777`；4 位世界上的 2 位粗糙记录；在 $t=5$ 进行 2 对 1 的有损步。 | `1` 步 vs `20` 步 ($\lfloor \log_2 10^6 \rfloor + 1$) vs `777,778` 步；粗糙互信息 `2.000` vs `4.000` 位；在 $t=5$ 有 `8/16` 未来存活。 | `F3` |
| **`M2` & `M2b` Loops** | 马尔可夫不动点；`Qhronology` CNOT+SWAP 符号检查；在 `D-CTC` 与 `P-CTC` 下的 `3..6` 位（`d = 8..64`）幺正见证循环。 | `D-CTC` 在 `1` 次查询中收敛到见证（`residual = 0.0`）；`P-CTC` 在 $P = 1/d^2$（`64, 256, 1,024, 4,096` 次试验）中成功。 | `F4`, `F6` |
| **`M3` Frequency index** | `N = 128` Plancherel 检查；精确 $d = 8$ Vandermonde 恢复；`128` 样本的次奈奎斯特外推（`W = 0.035`，`20` 次运行）。 | Plancherel 误差 `2.34e-16`；`DPSS` 特征值 `[0.991, 0.928, 0.681, 0.289, 0.063, 0.008]`；`cond = 1.94e9`；前导 `1..8` 误差 `2.5e-5`（无噪声）$\to$ `5.3e-3`（`80 dB`）$\to$ `0.470`（`20 dB`），在前导 `57..64` 处上升至 `0.600`‑`1.294`。 | `F5` |
| **`M4` Gödel spacetime** | 对 $ds^2 = -dt^2 - 2e^{\sqrt{2}\omega x} dt\,dy - \frac{1}{2}e^{2\sqrt{2}\omega x} dy^2 + dx^2 + dz^2$ 进行精确 SymPy Christoffel、Ricci 与 Einstein 张量求值。 | $\det g = -\frac{1}{2}e^{2\sqrt{2}\omega x} < 0$；$R = -2\omega^2$；$g_{yy} < 0$ 在所有位置（$\partial_y$ 类时空）；$G_{\mu\nu} + (-\omega^2)g_{\mu\nu} - 2\omega^2 u_\mu u_\nu \equiv \mathbf{0}$（`4x4` 零矩阵）。 | `F4`, `F6` |
| **`M5` Count time** | `16` 状态置换 Shannon 熵守恒 vs 位复位；Landauer 房间/主体层。 | 双射 $\Delta H = 4.44 \times 10^{-16}\text{ nats}$；`300 K` 层 `2.871e-21 J/bit`（`0.0179 eV`）；$2^{128}$ 位 $= 9.77 \times 10^{17}\text{ J}$；$2^{256}$ 位 $= 3.32 \times 10^{56}\text{ J}$。 | `F1`, `F2` |
| **`M6` Energy query** | 对基态施加 `500` 个 Haar 随机 $4\times 4$ 幺正；在 $r = 5.0$ 进行压缩；静态 Casimir 板。 | $\min \Delta E = +0.347 > 0$（被动）；$\sinh^2(5) = 5,506.1$ 光子（Monte Carlo `5,558.4`），由泵驱动支付；闭环 $W_{\text{net}} = 0.0\text{ J}$。 | `F8` |
| **`M7` Crypto PoW** | 真实 `SHA-256d` `8, 12, 16` 位谜题（`10` 次运行）+ `16` 位 Hellman 链（`m = 256, t = 64`）在未加盐与新块挑战上。 | 有效 nonce `392, 4245, 9459`（`1` 次 `D-CTC` 查询 vs 平均后选试验 `243.9, 5,294.2, 27,078.9`）；Hellman 重用在新块哈希上下降 `34.0%` $\to$ **`0.0%`**。 | `F5` |
| **`M8` Compton bridge** | CODATA `e⁻` 与 `Cs-133` 康普顿频率 $\nu_C = mc^2/h$ 以及 `1 mm` 垂直红移跨 `1` 儒略年。 | $\nu_{C,e} = 1.235590 \times 10^{20}\text{ Hz}$；$\nu_{C,\text{Cs}} = 2.993486 \times 10^{25}\text{ Hz}$；$\Delta\tau = 3.443 \times 10^{-12}\text{ s/yr}$（`6.48e14 rad` 康普顿，`0.199 rad` 超精细）。 | `F3` |
| **`F5` `SHA-256` FFT test** | 预注册 `rfft` 周期图，跨 `N = 65,536` 连续 `SHA-256` 摘要（`32,767` 内部箱）+ `k = 1, 2, 4, 8` 位前缀预测器。 | 最大箱 `10.5368` 对比 Gumbel 中位数 `10.7637`（Šidák $p = 0.5809$；**`0` 箱** $< 10^{-6}$）；前缀 $z = -0.32, -0.50, +0.11, +1.82$（全部在 $\pm 5\sigma$ 内；保留原假设）。 | `F5`（已执行，原假设成立） |

<div id="8-empirical-ledgers-81-temporal-anomalies-40-entry-frequency-atlas-and-74-paradox-constraint-accounting" class="anchor-alias" aria-hidden="true"></div>

## 8. 实证账本：81 个时间异常、40 条目频率图谱与 74 个悖论约束核算

<div id="81-temporal-anomaly-catalog-ta001-to-ta081-datatemporal-anomaly-catalogcsv" class="anchor-alias" aria-hidden="true"></div>

### 8.1 时间异常编目（`TA001` 至 `TA081`，`data/temporal-anomaly-catalog.csv`）

审计 `81` 篇被广泛引用的人类 (`65`) 和非人类 (`16`) 时间异常报告，涵盖人类类别 `H1`（时间滑移，`7`）、`H2`（错位人物/文物，`17`）、`H3`（预知/预感，`8`）、`H4`（既视感/梦境，`4`）、`H5`（已证实的宗教/文化睡眠膨胀文本，`8`）、`H6`（临床/感知扭曲，`8`）和 `H7`（物理/时钟测量，`13`），以及非人类类别 `N1`（动物灾害前兆，`3`）、`N2`（伴侣动物，`2`）、`N3`（机械性昼夜节律/首要预期，`6`）、`N4`（千年休眠/隐生状态，`4`）和 `N5`（非平衡松弛，`1`），得到 `33` 项 A 级同行评议测量、`20` 项 B 级同期/文本记录、`11` 项 C 级后期转述和 `17` 项 D 级骗局/虚构/误认：

* **零未解释的 A 级或 B 级未来信号案例存活。** 著名的病毒式“时间旅行者”在原始资料检查后崩塌：Rudolph Fentz（`TA012`）是 Jack Finney 1951 年短篇小说《I'm Scared》；John Titor（`TA014`）、Andrew Carlssin（`TA015`）、Håkan Nordkvist（`TA017`）和 Sergei Ponomarenko（`TA016`）可追溯至论坛虚构、*Weekly World News* 讽刺、瑞典养老金广告以及 2012 年乌克兰电视剧情；1928 年查理·卓别林首映剪辑（`TA009`）、1941 年南叉桥照片（`TA008`）和 1860 年 Waldmüller 画作（`TA011`）显示当时的助听器、太阳镜/相机和祈祷书；`OPERA` 超光速中微子（`TA053`）可追溯至 `73 ns` 的松动光纤连接器。
* **目录中真实、可重复的时间旅行严格为单向相对论膨胀或代谢悬浮**：Hafele‑Keating 时钟（`TA062`）、`GPS` `+38.6 µs/day` 的净时钟前进（`TA063`）、Sergei Krikalev 的 `~0.02 s` 轨道运动偏移（`TA064`）、`1 mm` 锶光学钟红移（`TA065`）以及 `46,000` 年西伯利亚线虫隐生状态（`TA077`，Shatilovich et al. 2023）。未解决的 A/B 级报告：：凡尔赛 1901（`TA001`）、回顾性 Aberfan 信件（`TA025`）、预感元分析（`TA031`）和前震蟾蜍（`TA067`）：：直接映射到前瞻性封闭协议 `F11`、`F12`、`F14` 和 `F15`。

<div id="82-frequency-anomaly-atlas-aa01-to-aa40-dataanomaly-atlascsv" class="anchor-alias" aria-hidden="true"></div>

### 8.2 频率异常图谱（`AA01` 至 `AA40`，`data/anomaly-atlas.csv`）

撰写 `40` 个天空（`21`）和地球实验室（`19`）前沿异常的频率形式（`16` `已解决`，`17` `未解决`，`7` `有争议`），将最尖锐的物理边界置于黑洞和宇宙视界（`图 3`）：

1. **黑洞视界振荡衰减和混沌延迟（`AA01`-`AA08`）**：每个 Kerr-Schwarzschild 视界尺度随 $c^3/(GM)$ 变化。对于一个 $62\,M_\odot$ 残余（`GW150914`，`AA04`），基频振荡 $f_{\text{QNM}} \approx 195\text{ Hz}$ 位于 $9.39 \times \nu_H$（$\nu_H = 20.7\text{ Hz}$，`AA03`），而 `GW250114`（`AA05`）探测视界角速度 $2\Omega_H$ 和表面重力衰减 $\kappa$（`F16`）。在二维引力岛模型（Penington 2019；Almheiri 等 2019）中，内部信息在 Page 时间后通过 Hawking 辐射返回，混沌延迟为 $t_{\text{scr}} = (4GM/c^3)\ln S \approx 0.23\text{ s}$，位于 $62\,M_\odot$（$1/t_{\text{scr}} \approx 4.35\text{ Hz}$），与 `AA06` 中声称并被否定的 `4.4 Hz` 普朗克回声间隔相匹配；`F17`。
2. **宇宙膨胀率与星系加速（`AA09`-`AA12`）**：将 Milgrom 的 `MOND` 尺度 $a_0 \approx 1.2 \times 10^{-10}\text{ m/s}^2$ 转换为频率得到 $a_0/c = 4.00 \times 10^{-19}\text{ Hz}$，在 `6%`-`15%` 范围内与 $H_0 / (2\pi) = 3.48 \times 10^{-19}$ 到 $3.77 \times 10^{-19}\text{ Hz}$ 在普朗克和 `SH0ES`（`AA09`）之间一致。$a_0(z)$ 是否随 $H(z)$ 变化（在平坦 $\Lambda\text{CDM}$ 中 $z = 2$ 处约高 `3.0x`）或保持不变，可通过高红移动力学旋转曲线直接检验（`F18`）。

<figure class="my-8">
  <img src="/figures/time-as-an-index/frequency-anomaly-atlas.svg" alt="Logarithmic frequency map of 28 single-frequency entries from AA01 to AA40 across open, contested, and resolved lanes." />
  <figcaption>图 3. 频率异常图谱（<code>AA01</code> 到 <code>AA40</code>）：<code>28</code> 个单频天空和实验室边缘案例绘于 <code>61</code> 个十倍频程，从 <code>MOND a₀/c = 4.0×10⁻¹⁹ Hz</code> 到 <code>ν_Planck = 2.95×10⁴² Hz</code>（<code>12</code> 个多尺度条目列于 <code>data/anomaly-atlas.csv</code>）。</figcaption>
</figure>

<div id="83-paradox-ledger-p01-to-p74-dataparadox-ledgercsv-and-code_and_proofsleanparadoxlean" class="anchor-alias" aria-hidden="true"></div>

### 8.3 悖论账本（`P01` 至 `P74`，`data/paradox-ledger.csv` 与 `code_and_proofs/lean/Paradox.lean`）

对理论物理（`36`）、数学与逻辑（`20`）、信息与计算（`9`）、概率与决策理论（`7`）以及网络/资源经济学（`2`）中 **`74`** 个悖论进行目录化（`45` `已解决`，`15` `部分解决`，`14` `未解决`），将表面矛盾转化为 **十一条明确的价格标签**，这些标签经由 `TQ.Paradox` 中的 `14` 条 Lean 定理以及 `run_models_m1_m8.py` 中的数值检查得到验证：

| Lean 4 定理（`TQ.Paradox`） | 悖论约束已证明 | 公理足迹 |
| :--- | :--- | :--- |
| `no_total_self_oracle` | 没有全域布尔预言机 $O : Q \to \mathrm{Bool}$ 与其否定对角线 $d$ 相一致（`Liar` `P45`，`Halting` `P48`，`F19`）。 | **None**（`0` 公理） |
| `no_universal_answer_table` | 不存在满射 $Q \to (Q \to \mathrm{Bool})$（`Cantor` `P41`，`Russell` `P40`）。 | **None**（`0` 公理） |
| `mixed_answer_unique` | 在 $\mathbb{Q}$ 上，$p = 1 - p$ 具有唯一不动点 $p = 1/2 \in [0, 1]$（Deutsch 混合规避用于 `P01`，`P45`）。 | Standard 3 |
| `grandfather_no_pure` & `polchinski_multiplicity` | `!b ≠ b` 禁止纯 NOT 循环不动点（`P01`），而 `id` 允许多个不同的不动点（`Polchinski` `P06`，`Novikov` `P05`）。 | **None**（`0` 公理） |
| `no_injection_gt` & `incompressible` | 有限鸽巢原理禁止满射 $\mathrm{Fin}(2^n - 1) \to \mathrm{Fin}(2^n)$（`Bootstrap` `P02`，`Kolmogorov` `P66`）。 | Standard 3 |
| `recurrence` | 任意 $\mathrm{Fin}\,n$ 上的双射在 $x$ 步内返回每个状态 $1 \le d \le n$（`Poincaré` `P25`，迫使付费的 Past Hypothesis `P28`）。 | Standard 3 |
| `zeno_dichotomy`, `instant_measure_zero`, `countable_instants_null` | 精确缩放的几何部分和 $2^n - 1$、零单例区间时长以及有界有限前缀覆盖（`Zeno` `P51`，`P52`，`Skolem` `P50`）。 | Standard 3 |
| `hilbert_hotel`, `galileo_squares`, `monty_hall` | `Nat.succ` 与 $n \mapsto n^2$ 在无限 $\mathbb{N}$ 上是单射但非满射（`P60`，`P61`，在有限 Bekenstein 区域 `2.58e43 bits`（`1 m, 1 kg`）被阻断，`P69`）；知情的门选择获胜概率为 `2/3`（`P64`）。 | Standard 3 |

这十一条会计规则：：（1）无全域布尔自预言机，（2）付费不动点选择，（3）每个不可压缩比特的来源或 $\mathrm{PSPACE}$ 债务，（4）需要邻域积分的零测度瞬间，（5）帧标记的世界线固有时间，（6）付费低熵 Past Hypothesis 边界，（7）Landauer $k_B T \ln 2$ 重置下限加 Zeno 测量反作用，（8）Bekenstein（$2.58 \times 10^{43}\text{ bits}$）和全息（$1.38 \times 10^{69}\text{ bits/m}^2$）容量上限，（9）量子关联区别于经典记录，（10）适当的先验与有界效用（`Two Envelopes` `P56`，`St Petersburg` `P57`，`Bertrand` `P59`），以及（11）观察者声明的记录（`Wigner's Friend` `P15`，`Firewall` `P37`）：：留下 `14` 项真正的未解决债务（`P03, P04, P07, P14, P15, P28, P29, P32..P37, P39`）。

<div id="9-falsifiers-f1f19-and-energy-native-game-design-translation" class="anchor-alias" aria-hidden="true"></div>

## 9. 证伪因子（`F1`-`F19`）与能源原生游戏设计转化

<div id="91-consolidated-falsifier-registry-f1-to-f19" class="anchor-alias" aria-hidden="true"></div>

### 9.1 综合证伪因子注册表（`F1 to F19`）

本研究中的每一项推测或猜想性主张，都对应着一个具体的决策规则。

| ID | 目标主张 | 协议与 $5\sigma$ / 正式决策阈值 | 当前状态 |
| :--- | :--- | :--- | :--- |
| **`F1`** | `A1` 耗散计数固有时间 | 共置光钟在每滴答的耗散上相差 $\ge 10^6\times$，在 $10^6\text{ s}$ 期间：如果已逝比例在 $10^{-15}$ 内等于 `1`，则 `A1` 作为物理固有时间失效。 | 未直接测试；标准相对论预测 `1` |
| **`F2`** | `A2` 可逆与盲重置热 | 已知的可逆反计算在 $5\sigma$ 处耗散 $< 0.5\,k_B T \ln 2$，驳斥 `A2` 的普遍成本；盲重置 $< 0.9\,k_B T \ln 2$ 驳斥 Landauer。 | 已确认盲 Landauer 下限；`A2` 受限 |
| **`F3`** | `A5` 原子分辨时钟残差 | 在 $t$ 处的每原子光钟残差与 $t + \tau$ 处的 `QRNG` 位之间的互信息：在 $10^7$ 个样本中低于 $10^{-3}\text{ bit/sample}$ 时失效。 | 开放（`Conjecture`） |
| **`F4`** | 类时间信号 (`A6`, 逆因果) | 在 $10^7$ 次 `QRNG` 切换试验中出现 $\sigma \approx 3\times 10^{-4}$ 的双时间边际位移 $|P(a \mid x, y) - P(a \mid x, y')|$：在 $5\sigma$ 内失效。 | 对无信号保持成立（`0` 违规） |
| **`F5`** | `A7` 谱 `SHA-256` / `PoW` 快捷方式 | `FFT` 功率谱和对连续 `SHA-256` 摘要的 $k$ 位前缀测试（$p < 10^{-6}$ 家族层面；$2^{-k} \pm 5\sigma$）。 | **此处执行 (`N = 65,536`)**：`0` 桶 $< 10^{-6}$，空保持 |
| **`F6`** | `A6` 超光速 / 早到 | 在 $10^9$ 次计时事件（`NANOGrav`、`GRB`、中微子基线）中，抵达时间比 $t_{\text{emit}} + L/c$ 早 $> 5\times$ 的时序抖动。 | 对因果保持成立（`OPERA` 连接器已修正） |
| **`F7`** | `A4` 全身全局相位锁定 | 在 $\ge 7\text{ days}$ 期间，跨越 $\ge 3$ 条独立体细胞系的相位锁定值为 $> 0.9$，驳斥异步 `A4`。 | `A4` 由周转数据支持 |
| **`F8`** | `A8` / `Z6` 闭环真空功 | 在闭合重置循环中，密封热量计净功为 $W_{\text{net}} > 0$，高于 $5\sigma$，且未消耗外部驱动。 | 零正值；被动性保持 |
| **`F9`** | `A1`-`A8` 的形式不一致性 | 经内核检查的 Lean 4 推导，从形式化的 `A1`-`A8`、有限维量子信道和 Minkowski 因果性得到 `False`。 | 弱化的 `C1`-`C4` 被证明一致（`Horizon.lean`） |
| **`F10`** | 建构记忆来源 | 预注册的 `DRM` 加上误导信息测试（$n \ge 200$）：若诱饵回忆比无关侵入高出 $< 0.05$ 且 `AUC >= 0.95`，则为伪造。 | 存活（`40-55%` `DRM`，`32%` 对比 `14%` Loftus） |
| **`F11`** | 人类预知 (`TA025, TA030..TA032`) | `SHA-256` 提交的响应在 $t_1$ 与在 $t_2 \ge t_1 + 24\text{ h}$ 抽取的 `QRNG` 位（$N \ge 10^5$，$\sigma \approx 1.58\times 10^{-3}$）比较：需要 $> 0.5 + 5\sigma \approx 0.508$ 复制 + `F4`。 | 先前复制结果为偶然（`d = 0.04`） |
| **`F12`** | 似曾相识 / 梦境导航 (`TA033, TA036`) | 在 `QRNG` 选择的迷宫转向之前的预先提交报告（$N \ge 10^4$ 标记的试验，$5\sigma$ 阈值）。 | 在 Cleary 与 Claxton (2018) 中被证伪 |
| **`F13`** | 更密集的 `BCI` 协议与作者身份 | （a）意图内容的互信息 $> 39\text{ bit/s}$ 超过 $\ge 10\text{ h}$；（b）盲态用户与解码器作者身份的辨别 $\ge 0.90$。 | 当前 `BCI` 为 `7.7`-`19 bit/s` |
| **`F14`** | 动物灾害前兆 (`TA066..TA070`) | 针对去聚类地震目录的持续多年监测 + 并行 `VLF`/氡/地震记录（$\ge 20$ 事件，增益 $> 2$ 于 $p < 10^{-3}$）。 | 对物理前兆开放 |
| **`F15`** | 封存档案逆向认知 (`TA001..TA007`) | 在第三方托管的未公开过去状态的现场预先哈希见证报告与匹配对照（$\ge 500$ 次访问，$5\sigma$）。 | 在托管下未测试 |
| **`F16`** | 视界直接波读取 (`AA04, AA05`) | $\ge 10$ 合并后事件（`SNR >= 30`）测试 $2\Omega_H$ 与 $\kappa$，在 inspiral Kerr 参数的 `10%` 范围内，贝叶斯因子上升。 | `猜想`（`GW250114` 激励） |
| **`F17`** | 扰乱回声梳与电路延迟 (`AA01, AA06`) | （a）堆叠 $\ge 20$ 合并以获得 $t_{\text{scr}} = (4GM/c^3)\ln S$ 梳在 $5\sigma$；（b）$S = 4..10$ 量子比特扰乱解码延迟 $\propto \log S$ 与线性比较。 | `O1`-`O3` 回声与噪声一致 |
| **`F18`** | `MOND` 的宇宙尺度 $a_0(z)$ (`AA09, AA12`) | 跨越 $1 \le z \le 2.5$ 的动力学 `RAR`（$\ge 30$ 星系/箱）：在 $z=2$ 处 $a_0(z)/a_0(0) = H(z)/H_0 \approx 3.0$ 与在 $5\sigma$ 处常数 $1 \pm 0.2$ 对比。 | `猜想`（JWST/ALMA 可检验） |
| **`F19`** | Novikov 对角阴谋审计 (`P01, P05, P45`) | 在 $t_1$ 提交预测；自动硬件在 $t_2$ 否定预测。相对于对照的硬件驱动失效率过剩用于检验向后一致性。 | `推测`（基线预测 `0` 过剩） |

<div id="92-translating-time-indexing-physics-into-honest-energy-native-game-mechanics" class="anchor-alias" aria-hidden="true"></div>

### 9.2 将时间索引物理学转化为诚实的能源原生游戏机制

在策略与谜题设计中（在 [/living/time-as-an-index/](/living/time-as-an-index/) 的仪器 4 中交互式探索），用明确的焦耳、热量、记忆和新鲜度预算取代幻想的自由时间旅行，会将第 2 节到第 8 节的定理转化为跨越四个时代的可触摸玩家权衡：

* **Era 1 - Sweep (`Sequential Brute Search`)**：实时顺序猜测对每个哈希消耗确定性的焦耳，并在未索引的金库上暴露出破坏性的尾部方差，而已验证的确定性脚本则拥有可预测的能量包络。
* **Era 2 - Ledger vs Salt Storms & Freshness Seals (`Hellman T·M² = N²`)**：预填 Hellman 账本需一次性支付 $N$ 焦耳以购买廉价的 $N^{2/3}$ 在线查询，直至防御者部署 *Salt Storms*（将填充成本乘以 $2^s$，触发 `stale ledger` 失效）或 *Freshness Seals*（将挑战链至最新区块哈希，使零预计算无法提前启动）。*Rewind Charms* 能击败有状态守卫（`IND-CCA` / `EUF-CMA`），同时在无状态守卫（`Meier 2022`）上弹跳。
* **Era 3 - Fourier Lens & Settling Basin (`Gabor & Analog Relaxation`)**：*Fourier Lens* 仅在观测窗口满足 $\Delta t \ge 1/(4\pi\,\Delta f)$ 时以 $O(N \log N)$ 成本揭示周期性金库调度（否则因 `smear` 失败）；*Settling Basin* 在相位转变实例上快速放宽易解实例，却在指数热波动上出现尖峰（`Ercsey-Ravasz & Toroczkai 2011`），并配合 *Landauer Counter* 对每个被擦除位收取 $k_B T \ln 2$，除非时间用于可逆逆计算。
* **Era 4 - Postselection Gamble & Consistency Loop (`PP` and `PSPACE` Endgame)**：*Postselection Gamble* 在 $1/p$ 能量消耗下保证得到见证（`PP` 上限）；*Consistency Loop* 解锁单查询 `PSPACE` 固定点，同时面临对手固定点选择的风险（`paradox lockout`）和柯西视界热耗（`chronology collapse`），而 *One-Time Pad* 设置的金库在每个时代仍在数学上不可破解。叙事承诺机制（`Surprise Pact`，将玩家绑定至稍后在无信号传递下揭示的哈希当前状态）从经典民间传说以及 Andrzej Sapkowski 1993 年短篇《A Question of Price》（收录于 *The Last Wish*）的远距离主题灵感中汲取惊喜债务动机；*The Witcher* 为 CD PROJEKT S.A. 的注册商标，本独立研究与模拟工作未使用这些作品中的任何名称、角色、文本或资产，也未与 CD PROJEKT S.A. 或 Andrzej Sapkowski 有任何关联或获得其认可。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

*透明性说明：源代码访问主要来自 arXiv 预印本、开放获取会议论文、Lean 4 / SymPy / Python 代码，以及直接执行或检查的 `Qhronology v1.2.1`；付费墙后的历史专著和期刊文章（`Deutsch 1991`、`Gödel 1949`、`Landauer 1961`、`Cooley & Tukey 1965`、`Gabor 1946`、`Hellman 1980`、`Hawking 1992`、`Friedman et al. 1990`、`Bennett 1973/1989`、`Fiat & Naor 2000`、`Oechslin 2003`、`Bartlett 1932`、`McLuhan 1964`、`Weyl 1949`）通过已验证的数字对象标识符（DOI）以及开放获取文献中的二次数学重述进行引用。

<ol data-refs>
<li>Aaronson, S. (2005). NP-complete problems and physical reality. <em>ACM SIGACT News</em>, 36(1), 30-52. <code>arXiv:quant-ph/0502072</code>.</li>
<li>Aaronson, S. (2005). Quantum computing, postselection, and probabilistic polynomial-time. <em>Proceedings of the Royal Society A</em>, 461(2063), 3473-3482. doi:10.1098/rspa.2005.1546.</li>
<li>Aaronson, S. (2015). Memrefuting (technical critique of polynomial-resource memcomputing claims). <em>Shtetl-Optimized</em>.</li>
<li>Aaronson, S., &amp; Watrous, J. (2009). Closed timelike curves make quantum and classical computing equivalent. <em>Proceedings of the Royal Society A</em>, 465(2102), 631-647. doi:10.1098/rspa.2008.0350; <code>arXiv:0808.2669</code>.</li>
<li>Aaronson, S., Bavarian, M., Gueltrini, G., Cubitt, T., O'Donnell, R., Grewal, S., &amp; Raat, F. (2024). Computability theory of closed timelike curves (v2 correction). <code>arXiv:1609.05507v2</code>.</li>
<li>Aggarwal, D., Brennen, G. K., Lee, T., Santha, M., &amp; Tomamichel, M. (2018). Quantum attacks on Bitcoin, and how to protect against them. <em>Ledger</em>, 3, 41-62. <code>arXiv:1710.10377</code>.</li>
<li>Aharonov, Y., Bergmann, P. G., &amp; Lebowitz, J. L. (1964). Time symmetry in the quantum process of measurement. <em>Physical Review</em>, 134(6B), B1410-B1416. doi:10.1103/PhysRev.134.B1410.</li>
<li>Aharonov, Y., &amp; Elitzur, A. C. (2026). Time running backwards, and where it stops (preprint). <code>arXiv:2611.12971</code>.</li>
<li>Almheiri, A., Engelhardt, N., Marolf, D., &amp; Maxfield, H. (2019). The entropy of bulk quantum fields and the entanglement wedge of an evaporating black hole. <em>Journal of High Energy Physics</em>, 2019(12), 063.</li>
<li>Almheiri, A., Marolf, D., Polchinski, J., &amp; Sully, J. (2013). Black holes: Complementarity or firewalls? <em>Journal of High Energy Physics</em>, 2013(2), 062.</li>
<li>Bacon, D. (2004). Quantum computational complexity in the presence of closed timelike curves. <em>Physical Review A</em>, 70(3), 032309. doi:10.1103/PhysRevA.70.032309; <code>arXiv:quant-ph/0309189</code>.</li>
<li>Balasubramanian, V. (2021). Brain power. <em>Proceedings of the National Academy of Sciences</em>, 118(32), e2107022118.</li>
<li>Bekenstein, J. D. (1981). Universal upper bound on the entropy-to-energy ratio for bounded systems. <em>Physical Review D</em>, 23(2), 287-298.</li>
<li>Bem, D. J. (2011). Feeling the future: Experimental evidence for anomalous retroactive influences on cognition and affect. <em>Journal of Personality and Social Psychology</em>, 100(3), 407-425; failed replications in Ritchie, Wiseman &amp; French (2012), <em>PLOS ONE</em> 7(3):e32719, and Galak et al. (2012), <em>JPSP</em> 103(6):933-948.</li>
<li>Bennett, C. H. (1973). Logical reversibility of computation. <em>IBM Journal of Research and Development</em>, 17(6), 525-532; and Bennett, C. H. (1989). Time/space trade-offs for reversible computation. <em>SIAM Journal on Computing</em>, 18(4), 766-776. doi:10.1137/0218053.</li>
<li>Bennett, C. H., Leung, D., Smith, G., &amp; Smolin, J. A. (2009). Can closed timelike curves or nonlinear quantum mechanics improve quantum state discrimination or help solve hard problems? <em>Physical Review Letters</em>, 103(17), 170502. <code>arXiv:0908.3023</code>.</li>
<li>Bishop, L. G. (2026). Qhronology: Simulating quantum mechanics with closed timelike curves in Python. <code>arXiv:2601.17459</code> (software package <code>qhronology</code> v1.0.0-v1.2.1).</li>
<li>Bothwell, T., Kennedy, C. J., Aeppli, A., Kedar, D., Robinson, J. M., Oelker, E., Staron, A., &amp; Ye, J. (2022). Resolving the gravitational redshift across a millimetre-scale atomic sample. <em>Nature</em>, 602, 420-424.</li>
<li>Brown, A. S. (2004). <em>The Déjà Vu Experience</em>. Psychology Press; and Cleary, A. M., &amp; Claxton, A. B. (2018). Déjà vu: An illusion of prediction. <em>Psychological Science</em>, 29(4), 635-644.</li>
<li>Brun, T. A. (2003). Computers with closed timelike curves can solve hard problems. <em>Foundations of Physics Letters</em>, 16(3), 245-253. <code>arXiv:gr-qc/0209061</code>.</li>
<li>Brun, T. A., Harrington, J., &amp; Wilde, M. M. (2009). Localized closed timelike curves can perfectly distinguish quantum states. <em>Physical Review Letters</em>, 102(21), 210402. <code>arXiv:0811.1209</code>.</li>
<li>Brun, T. A., Wilde, M. M., &amp; Winter, A. (2013). Quantum state cloning using Deutschian closed timelike curves. <em>Physical Review Letters</em>, 111(19), 190401. <code>arXiv:1306.1795</code>.</li>
<li>Card, N. S., Wairagkar, M., Iacobacci, C., et al. (2024). An accurate and rapidly calibrating speech neuroprosthesis. <em>New England Journal of Medicine</em>, 391(7), 609-618.</li>
<li>Castagnoli, G. (2025). Quantum computational speedup and retrocausality. <code>arXiv:2505.08346</code> (extending <em>Int. J. Theor. Phys.</em> 2009 and <code>arXiv:1603.02246</code>).</li>
<li>Chou, C. W., Hume, D. B., Rosenband, T., &amp; Wineland, D. J. (2010). Optical clocks and relativity. <em>Science</em>, 329(5999), 1630-1633.</li>
<li>Connes, A., &amp; Rovelli, C. (1994). Von Neumann algebra automorphisms and time-thermodynamics relation in generally covariant quantum theories. <em>Classical and Quantum Gravity</em>, 11(12), 2899-2917.</li>
<li>Cooley, J. W., &amp; Tukey, J. W. (1965). An algorithm for the machine calculation of complex Fourier series. <em>Mathematics of Computation</em>, 19(90), 297-301. doi:10.1090/S0025-5718-1965-0178586-1.</li>
<li>Coupé, C., Oh, Y. M., Dediu, D., &amp; Pellegrino, F. (2019). Different languages, similar encoding efficiency: Comparable information rates across the human communicative niche. <em>Science Advances</em>, 5(9), eaaw2594.</li>
<li>Demaine, E. D., Iacono, J., &amp; Langerman, S. (2007). Retroactive data structures. <em>ACM Transactions on Algorithms</em>, 3(2), Article 13.</li>
<li>Deutsch, D. (1991). Quantum mechanics near closed timelike lines. <em>Physical Review D</em>, 44(10), 3197-3217. doi:10.1103/PhysRevD.44.3197.</li>
<li>Dragoi, G., &amp; Tonegawa, S. (2011). Preplay of future place cell sequences by hippocampal cellular assemblies. <em>Nature</em>, 469, 397-401; and Foster, D. J., &amp; Wilson, M. A. (2006). Reverse replay of behavioural sequences in hippocampal place cells during the awake state. <em>Nature</em>, 440, 680-683.</li>
<li>Driscoll, J. R., Sarnak, N., Sleator, D. D., &amp; Tarjan, R. E. (1989). Making data structures persistent. <em>Journal of Computer and System Sciences</em>, 38(1), 86-124.</li>
<li>Eagleman, D. M., &amp; Sejnowski, T. J. (2000). Motion integration and postdiction in visual awareness. <em>Science</em>, 287(5460), 2036-2038.</li>
<li>Echeverria, F., Klinkhammer, G., &amp; Thorne, K. S. (1991). Billiard balls in wormhole spacetimes with closed timelike curves: Classical theory. <em>Physical Review D</em>, 44(4), 1077-1099; and Friedman, J., Morris, M. S., Novikov, I. D., Echeverria, F., Klinkhammer, G., Thorne, K. S., &amp; Yurtsever, U. (1990). Cauchy problem in spacetimes with closed timelike curves. <em>Physical Review D</em>, 42(6), 1915-1930. doi:10.1103/PhysRevD.42.1915.</li>
<li>Ercsey-Ravasz, M., &amp; Toroczkai, Z. (2011). Optimization hardness as transient chaos in an analog approach to constraint satisfaction. <em>Nature Physics</em>, 7, 966-970. <code>arXiv:1208.0526</code>.</li>
<li>Fiat, A., &amp; Naor, M. (2000). Rigorous time-space trade-offs for inverting functions. <em>SIAM Journal on Computing</em>, 29(3), 790-803. doi:10.1137/S0097539795280512.</li>
<li>Gabor, D. (1946). Theory of communication. <em>Journal of the Institution of Electrical Engineers - Part III</em>, 93(26), 429-457. doi:10.1049/ji-3-2.1946.0074.</li>
<li>Gödel, K. (1949). An example of a new type of cosmological solutions of Einstein's field equations of gravitation. <em>Reviews of Modern Physics</em>, 21(3), 447-450. doi:10.1103/RevModPhys.21.447.</li>
<li>Grover, L. K. (1996). A fast quantum mechanical algorithm for database search. <em>Proceedings of the 28th Annual ACM Symposium on Theory of Computing (STOC)</em>, 212-219.</li>
<li>Hawking, S. W. (1992). Chronology protection conjecture. <em>Physical Review D</em>, 46(2), 603-611. doi:10.1103/PhysRevD.46.603.</li>
<li>Hellman, M. E. (1980). A cryptanalytic time-memory trade-off. <em>IEEE Transactions on Information Theory</em>, 26(4), 401-406.</li>
<li>Hubert, T., Mehta, R., Sartran, L., et al. (2025). Olympiad-level formal mathematical reasoning with reinforcement learning (AlphaProof). <em>Nature</em>.</li>
<li>Inagaki, T., Haribara, Y., Igarashi, K., et al. (2016). A coherent Ising machine for 2000-node optimization problems. <em>Science</em>, 354(6312), 603-606. doi:10.1126/science.aah4243; and McMahon, P. L., et al. (2016). A fully programmable 100-spin coherent Ising machine. <em>Science</em>, 354(6312), 614-617. doi:10.1126/science.aah5178.</li>
<li>Ji, Z., Lloyd, S., &amp; Wilde, M. M. (2026). Retrocausal quantum and classical capacities of noisy closed timelike curves. <em>Physical Review Letters</em>, 136, 230801. <code>arXiv:2509.08965</code>.</li>
<li>Kulkarni, K., &amp; Michels, J.-E. (2012). Temporal features in SQL:2011. <em>ACM SIGMOD Record</em>, 41(3), 34-43. doi:10.1145/2380776.2380786.</li>
<li>Lamoreaux, S. K. (1997). Demonstration of the Casimir force in the 0.6 to 6 µm range. <em>Physical Review Letters</em>, 78(1), 5-8; and Wilson, C. M., Johansson, G., Pourkabirian, A., et al. (2011). Observation of the dynamical Casimir effect in a superconducting circuit. <em>Nature</em>, 479, 376-379.</li>
<li>Lan, S.-Y., Kuan, P.-C., Estey, B., English, D., Brown, J. M., Hohensee, M. A., &amp; Müller, H. (2013). A clock directly linking time to a particle's mass. <em>Science</em>, 339(6119), 554-557.</li>
<li>Landauer, R. (1961). Irreversibility and heat generation in the computing process. <em>IBM Journal of Research and Development</em>, 5(3), 183-191. doi:10.1147/rd.53.0183.</li>
<li>Leifer, M. S., &amp; Pusey, M. F. (2017). Is a time symmetric interpretation of quantum theory possible without retrocausality? <em>Proceedings of the Royal Society A</em>, 473(2202), 20160607. <code>arXiv:1607.07871</code>.</li>
<li>Lloyd, S., Maccone, L., Garcia-Patron, R., Giovannetti, V., Shikano, Y., Pirandola, S., Rozema, L. A., Darabi, A., Soudagar, Y., Shalm, L. K., &amp; Steinberg, A. M. (2011). Closed timelike curves via postselection: Theory and experimental test of consistency. <em>Physical Review Letters</em>, 106(4), 040403; <em>Physical Review D</em>, 84(2), 025007. <code>arXiv:1005.2219</code>.</li>
<li>Loftus, E. F., &amp; Palmer, J. C. (1974). Reconstruction of automobile destruction: An example of the interaction between language and memory. <em>Journal of Verbal Learning and Verbal Behavior</em>, 13(5), 585-589; and Roediger, H. L., &amp; McDermott, K. B. (1995). Creating false memories: Remembering words not presented in lists. <em>JEP: Learning, Memory, and Cognition</em>, 21(4), 803-814.</li>
<li>Meier, R. (2022). Security against time-traveling adversaries. <em>IACR Cryptology ePrint Archive</em>, Paper 2022/1148.</li>
<li>Metzger, S. L., Littlejohn, K. T., Silva, A. B., et al. (2023). A high-performance neuroprosthesis for speech decoding and avatar control. <em>Nature</em>, 620, 1037-1046; and Willett, F. R., Kunz, E. M., Fan, C., et al. (2023). A high-performance speech neuroprosthesis. <em>Nature</em>, 620, 1031-1036.</li>
<li>Nader, K., Schafe, G. E., &amp; LeDoux, J. E. (2000). Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval. <em>Nature</em>, 406, 722-726. doi:10.1038/35021052; and Schacter, D. L. (1999). The seven sins of memory. <em>American Psychologist</em>, 54(3), 182-203.</li>
<li>O'Callahan, R., Jones, C., Froyd, N., Huey, K., Noll, A., &amp; Partush, N. (2017). Engineering record and replay for deployability (<code>rr</code>). <em>USENIX ATC 2017</em>, 377-389.</li>
<li>Oechslin, P. (2003). Making a faster cryptanalytic time-memory trade-off. <em>Advances in Cryptology - CRYPTO 2003</em>, LNCS 2729, 617-630. doi:10.1007/978-3-540-45146-4_36.</li>
<li>Open Interface Engineering (2026). Thermodynamic Bounds and an Optimal Tempo; Metered Commit Gates; Deterministic Null; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Penington, G. (2020). Entanglement wedge reconstruction and the information paradox. <em>Journal of High Energy Physics</em>, 2020(9), 002 (preprint 2019).</li>
<li>Sender, R., Fuchs, S., &amp; Milo, R. (2016). Revised estimates for the number of human and bacteria cells in the body. <em>PLOS Biology</em>, 14(8), e1002533; and Shatilovich, A., Gade, V. R., Pippel, M., et al. (2023). A novel nematode species from the Siberian permafrost shares adaptive mechanisms for cryptobiotic survival with C. elegans dauer larva. <em>PLOS Genetics</em>, 19(7), e1010798.</li>
<li>Tanuwijaya, R., et al. (2025). Complex discrete Fourier transform on a metalens array. <code>arXiv:2502.08770</code>; and Yang, Y., et al. (2025). Photonic joint-transform correlator for high-efficiency convolution. <code>arXiv:2504.01117</code>.</li>
<li>Woith, H., Petersen, G. M., Hainzl, S., &amp; Dahm, T. (2018). Review: Can animals predict earthquakes? <em>Bulletin of the Seismological Society of America</em>, 108(3A), 1031-1045.</li>
<li>Zheng, J., &amp; Meister, M. (2025). The unbearable slowness of being: Why do we live at 10 bits/s? <em>Neuron</em>, 113(2), 192-204.</li>
</ol>
