---
title: "“AI”阅读人类语言：机器速度下的人类语言编码及其能量代价"
deck: "工作进行中。为何机器之间交换的大量内容是为人类编写的，这在字节、token、时间以及 34 个解析与分词工作负载的每进程 Apple Silicon 内核 rusage 能耗（reported_j）方面带来了何种代价，以及为何外部壁式电表能耗（measured_j）仍是未解决的问题。"
lang: "zh-Hans"
source: "ai-reads-human"
complete: true
---

<div id="ai-reads-human-human-language-encoding-at-machine-speed-and-the-energy-cost" class="anchor-alias" aria-hidden="true"></div>

*进行中，版本 af57f48，2026 年 11 月 22 日。交互式观测台、数据、代码与阅读账本：[research.openie.dev/living/ai-reads-human/](/living/ai-reads-human/)。共享术语：[词汇表](/glossary/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 摘要

软件智能体之间交换数据时，常用的是为人类阅读设计的格式，例如 JSON、YAML、Markdown、XML 和 CSV。本研究将由此产生的额外计算负担称为“阻抗税”（impedance tax），给出其定义与单位，并在一个含 20,000 条记录的固定种子语料上测量其中三个部分：解析时间、五种开源分词器的词元数量，以及跨全部 34 个解析与 `tiktoken` 工作负载（第5c节）的双通道 Apple M5 Max 操作系统/片上 `reported_j` 计数器。

早期在两台繁忙笔记本电脑上进行的未隔离全芯片测量，无法将解析开销与后台共存负载的漂移区分开（第5b节）。随后，我们在专用工作子进程中隔离每个工作负载，并使用 macOS 内核的每进程计数器 `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（`L3`，标签 `D`）进行测量，得到解析能耗的 `2,053.8×` 跨度：定长二进制（`struct.iter_unpack`）为 `280.4 nJ/record`，标准库 JSON 为 `2,212.1 nJ/record`（`7.89×`），C 语言实现的 `libyaml` 为 `69,922.1 nJ/record`（`249.4×`），纯 Python YAML 为 `575,799.3 nJ/record`（`2,053.8×`）。测量还表明，对紧凑 JSON 进行 `cl100k_base` 分词耗能 `27,679.2 nJ/record`（为定长二进制的 `98.7×`），是 `json.loads()` 本身片上 `reported_j` 的 `12.5×`。

与此同时，全芯片 `IOReport`（`L2`，标签 `A2`）在 170 个共享主机测量窗口中的 `109` 个上触发了证伪条件 6（`> 5.0%` 的前后空闲基线漂移），这证实了在活跃主机上直接扣减未隔离的封装功耗为何不可靠。本研究未连接外部内联功率探针或电表（`measured_j = None`，`board_metered = false`），GPU 模型预填充/解码的焦耳数仍处于计划阶段（M4）。

**通俗概述**

1. 计算机与人类常使用同一种书面格式。这类格式便于人阅读，但计算机回读时需要额外的工作。
2. 在我们的 20,000 条记录测试语料上，读取定长二进制（`struct.iter_unpack`）在 Apple M5 Max 上的每进程内核 `ri_energy_nj`（`reported_j`）为 `280.4 nJ/record`；相比之下，Python 内置 JSON 读取器为 `2,212 nJ/record`（`7.89×`），C 加速的 YAML 为 `69,922 nJ/record`（`249.4×`），纯 Python YAML 为 `575,799 nJ/record`（`2,053.8×`）。
3. 用 `tiktoken`（`cl100k_base`）为 AI 模型对紧凑 JSON 进行分词，耗能 `27,679 nJ/record`（为 CSV 分词的 `1.69×`，为 `json.loads()` 解析本身的 `12.5×`），而此时语言模型尚未执行任何矩阵乘法。本页所有能耗数字均为内核/片上 `reported_j` 计数器（`measured_j = None`，`board_metered = false`）；GPU 模型预填充/解码能耗以及外部硬件功率探针仍在计划之中。

> **状态：工作仍在进行中，内容将持续扩充。** 标注为*计划中*的章节（例如 GPU 预填充/解码计数器 M4、自然语言语料 M6 以及跨语言 C/Rust 解析器 M8）尚未完成。本页所有数字均由 `/living/ai-reads-human/` 下可供下载的文件重新计算得出。片上能量计数器严格限定为 `reported_j`（`measured_j = None`，`board_metered = false`）。

<div id="1-background-formats-written-for-people" class="anchor-alias" aria-hidden="true"></div>

## 1. 背景：为人类编写的格式

大多数今天代理之间交换的数据采用的规范把人类置于机器之上。下面引用的段落已供本页阅读；每个来源的阅读状态（FULL、PARTIAL 或 UNAVAILABLE）列于 [read ledger](/living/ai-reads-human/READ_LEDGER.md)。

- **TeX** 起始于 1982 年：源文件 `tex.web`（已读取标题及前 19,000 字节；PARTIAL）记录了版本 0 于 1982 年 9 月发布，并从 3.0 版（1990 年 3 月）起标注后续版本的日期。
- **Markdown** 由 John Gruber 在 Aaron Swartz 的帮助下开发，并于 2004 年作为语法说明和将 Markdown 转换为 HTML 的 Perl 脚本发布；CommonMark 规范（版本 0.31.2，2024 年 1 月 28 日）指出该说明“并未对语法做出明确的规定”，并列出了其仍未解决的问题（CommonMark 0.31.2，第 1.1 节和第 1.2 节）。
- **CSV** 于 2005 年 10 月由 RFC 4180 记录，这是一份*信息性* RFC，声明“不存在正式的规范”，并写下了大多数实现似乎遵循的做法。
- **JSON** 由 RFC 8259（2017 年 12 月，取代 RFC 7159）定义，为“一种轻量级、基于文本、语言无关的数据交换格式”。RFC 7493（2015 年 3 月，I-JSON）对协议进一步限定了其使用方式。
- **规范化和二进制形式** 也出现在标准记录中：RFC 8785（2020 年 6 月）定义了 JSON 规范化方案，RFC 8949（2020 年 12 月，取代 RFC 7049）定义了 CBOR，这是一种带有确定性编码章节（第 4.2 节）的二进制数据格式，供协议采用。
- **YAML** 1.2.2 版（2021 年 10 月 1 日）列出了其“按优先级递减”的设计目标，最高优先级目标是“YAML 应当易于人类阅读”（第 1.1 节）。

![本主题已阅读的各规范的时间线](/living/ai-reads-human/charts/format-timeline.svg)

*图 1. 读取账本中列出的文档所标注的日期。由 `scripts/make_charts.py` 生成。*

这些事实并不意味着面向人类的格式是错误的。它们说明，可读性是明确的设计目标，而机器对其再次读取的成本并未被最小化。当其他研究转向机器导向的形式（CBOR、规范化 JSON、Protocol Buffers、Avro、safetensors、GGUF）时，本研究将其记录为一种趋同观察：多个社区在保留文本供人类使用的同时，为机器交换制定了固定或确定性的编码方案。

<div id="2-the-impedance-tax-defined" class="anchor-alias" aria-hidden="true"></div>

## 2. 阻抗税的定义

设记录集合 R 携带机器消费者所需的信息。设 F 为一种格式，其编码器为 enc_F，解码器为 dec_F；设 M 为规范机器形式：每个值对应唯一一个有效字节串。

| 符号 | 含义 | 单位 |
|---|---|---|
| B_F | R 在格式 F 下的编码大小 | 字节 |
| N | 记录数 | 1 |
| k | 分词器 | 不适用 |
| T_{F,k} | k 对 R 的编码所产生的词元数 | 词元 |
| d_{F,k} = B_F / T_{F,k} | 每词元字节数 | 字节/词元 |
| t_parse(F) | 将 R 解码为内存值的墙钟时间 | s |
| P | 某项操作期间的平均功率 | W = J/s |
| E | 某项操作的能量，E = ∫ P dt，近似为 P_avg · t | J |
| e_prefill | 模型处理每个输入词元的能量 | J/词元 |

F 相对于 M 的**阻抗税**，是消费者因信息以 F 形式到达而额外消耗的能量：

Z(F) = E_enc(F) + E_parse(F) + E_tok(F,k) + e_prefill · T_{F,k} + E_ctx(F)（各项依次为编码、解析、分词、预填充与上下文能耗）

τ(F) = Z(F) − Z(M)（单位：焦耳），θ(F) = Z(F) / Z(M)（无量纲）

E_ctx(F) 是更长上下文所引起的额外解码成本，其系数取决于模型，属于待测量目标（下文 M4）。第 5c 节在 Apple M5 Max 上，以每进程内核 `reported_j`（`ri_energy_nj`）测量 `E_parse(F)` 与 `E_tok(F,k)`。

以下三个无量纲比值无需任何能量计数器即可测得：

- 字节比 β_F = B_F / B_ref
- 词元比 κ_{F,k} = T_{F,k} / T_{ref,k}
- 解析时间比 π_F = t_parse(F) / t_parse(ref)

它们由一个恒等式联系起来，下文的词元数据均满足该恒等式：

κ_F = β_F · (d_ref / d_F)

因此，一种格式消耗更多词元，可能是因为字节更多，可能是因为其字节被切分成更多片段，也可能二者兼有。

![阻抗税的支付环节：编码、传输、解析、分词、模型读取](/living/ai-reads-human/charts/impedance-pipeline.svg)

*图 2. Z(F) 的各项构成。当路径中没有模型时（机器到机器），仅适用编码、传输与解析；当模型读取文本时，还需加上分词与读取。*

<div id="21-physical-scale-and-what-this-page-does-not-claim" class="anchor-alias" aria-hidden="true"></div>

### 2.1 物理尺度，以及本页不作的断言

在温度 T 下擦除一位信息的热力学下限是 Landauer 极限 E = k_B T ln 2。取 k_B = 1.380649e-23 J/K（依据 2019 年国际单位制定义为精确值；该数值已于 2026 年 10 月 18 日对照 NIST CODATA 2022 玻尔兹曼常数页面核对），在 T = 300 K 时，该值为每位 **2.871e-21 J**，由 `scripts/verify_numbers.py` 重新计算。八位即 2.297e-20 J。这是不可逆逻辑的下界，并非对解析成本的估计。实际软件的能耗要高出数个数量级，其开销来自内存访问、指令执行和散热。本页不使用该极限来预测任何数值。

模型推理的能量数据来自其他作者在各自硬件上的测量，仅作为背景资料，并非我们的测量结果：

- Samsi 等人的 "From Words to Watts: Benchmarking the Energy Costs of Large Language Model Inference"（arXiv:2310.03003）将每个输出 token 的能量定义为 GPU 总能耗除以解码输出的 token 数，并报告在最大生成长度为 512 的条件下，一个 650 亿参数 LLaMA 模型每个输出 token 约耗能 3 至 4 J。测量使用 NVIDIA DCGM，运行于其 MIT SuperCloud 环境（8、16 和 32 分片运行使用 V100 GPU）。该论文未将预填充（prefill）与解码（decode）阶段的能耗分开统计。
- Luccioni、Jernite 与 Strubell 的 "Power Hungry Processing: Watts Driving the Cost of AI Deployment?"（ACM FAccT 2024，DOI 10.1145/3630106.3658542）使用 CodeCarbon，在一台 8 GPU A100 节点上按任务类型测量每 1,000 次推理的能耗；其表 2 报告文本分类的平均值为 0.002 kWh，文本生成为 0.047 kWh。这些数值已对照 ACM 更正版正式记录 V1.1（2024 年 11 月 6 日）核对，该版本的表 2 数值及实验设置（AWS 上 8 块 A100 80GB GPU，使用 CodeCarbon）均与此一致。引用时应采用 V1.1：该论文指出，早期版本在一项比较中使用的是 0.012 kWh。论文其余部分仅经过部分阅读。

本页不使用广为引用的每词 DRAM 读取能耗数值（每次 32 位读取 640 pJ）。其所注明的出处 Horowitz（2014）已经过阅读：该论文给出每次 DRAM 访问约 1 至 2 nJ；其全会报告幻灯片给出每次 64 位访问为 1.3 至 2.6 nJ。640 pJ 这一数值仅出现在引用该文献的后续幻灯片中。第 9 节记录了这一情况。

<div id="3-what-was-measured" class="anchor-alias" aria-hidden="true"></div>

## 3. 测量内容

初始的解析时间和 token 计数基准在一台虚拟化的 Intel Xeon 机器上运行 (8 vCPU, Linux 6.12, Python 3.13.5)，该机器不暴露 RAPL 能量计数器（`/sys/class/powercap` 不存在），随后进行了 Apple M5 Max 能量实验，报告见第 5b 节和 5c 节。语料库为合成且已设种子（`scripts/gen_corpus.py`，种子 20261016）：共 20,000 条记录，每条包含一个 id、一个三词名称、一个浮点分数、一个布尔值、三个标签和一个 31 位整数。

![五种编码方式中的一条记录](/living/ai-reads-human/charts/one-record-five-ways.svg)

*图 3. 记录 0 的 CSV、紧凑 JSON、YAML、XML 和 23 字节的固定二进制布局。二进制布局将每个单词存储为指向 24 个共享单词列表的单字节索引，因此读取时需要该列表。文本形式的字节计数包括换行符。*

<div id="31-parse-time" class="anchor-alias" aria-hidden="true"></div>

### 3.1 解析时间

![每记录解析时间：固定二进制 116 ns，JSON 标准库 904 ns，YAML libyaml 85300 ns](/living/ai-reads-human/charts/parse-time-headline.svg)

*图 4. 在 Linux Xeon 基准平台上对 20,000 条记录进行至少 9 次重复测量的最小值。数据来源：`/living/ai-reads-human/data/parse_time.tsv`，列 `ns_per_record`。对数刻度。*

| 格式与解析器 | Xeon 每记录 ns | 与固定二进制的比率 |
|---|---|---|
| 固定二进制，`struct.iter_unpack` | 116 | 1.0 |
| JSON，Python 标准库 | 904 | 7.8 |
| YAML，PyYAML 配合 libyaml | 85,300 | 735.3 |

在同一 Xeon 主机上，YAML 的耗时是 stdlib JSON 的 94.4 倍（在 Apple M5 Max 上，C `libyaml` 为 `22,404 ns` 对 `570 ns` = `39.3×`，纯 Python YAML 为 `161,227 ns` = `282.9×`，见第 5c 节）。图 5 给出了 Xeon 平台上测试过的所有格式与解析器的完整表格。

![测试过的所有格式的每记录解析时间](/living/ai-reads-human/charts/parse-time-all.svg)

*图 5. `data/parse_time.tsv` 的所有行（除零拷贝 numpy 行外，该行不构建对象，无法比较）。*

**本测量的局限性。** (a) 各解析器完成的工作不同：固定二进制读取器返回元组，JSON 和 YAML 构建带类型的 Python 对象，CSV 返回字符串，而 XML 和 Markdown 行则构建树或标记流但不转换数值，因此这些比率反映的是端到端库行为，而非各格式的内在成本。(b) 单一语言运行时（CPython 3.13）。(c) 语料为合成数据且标识符较少。(d) 时间本身并非能量：因此第 5c 节直接测量了全部 34 个解析与标记化工作负载的每进程内核 `ri_energy_nj`（`reported_j`）。

<div id="32-tokens" class="anchor-alias" aria-hidden="true"></div>

### 3.2 词元

语言模型读取的是词元（token），而不是字节。以下是对同一批记录，使用 `cl100k_base` 分词器在每种视图的前 2,000 条记录上统计的结果（并在第 5c 节对全部 20,000 条记录进行了验证）：

![每条记录的词元数相对 CSV 的比值](/living/ai-reads-human/charts/tokens-vs-csv.svg)

*图 6. κ 为某视图每条记录的词元数除以 CSV 每条记录的词元数。数据来源：`/living/ai-reads-human/data/tokens.tsv`。*

| 视图 | 每条记录词元数 | κ（相对 CSV） |
|---|---|---|
| CSV | 22.9 | 1.00 |
| JSON，紧凑格式 | 36.2 | 1.58 |
| YAML | 51.4 | 2.24 |
| JSON，美化格式（缩进 2） | 65.6 | 2.86 |

第 2 节中的恒等式在这些数据上成立：对于紧凑 JSON，β = 1.912，d_CSV/d_JSON = 0.826，因此 κ = 1.58；对于 YAML，2.028 × 1.107 = 2.24；对于美化 JSON，3.056 × 0.936 = 2.86。紧凑 JSON 的词元成本较高，主要是因为其字节数约为 CSV 的 1.9 倍；美化 JSON 的情况大体相同，另外还需加上缩进的开销。YAML 既字节更多，词元又更短。

![五种分词器下相对 CSV 的词元比值](/living/ai-reads-human/charts/tokens-five-tokenizers.svg)

*图 7. 同一比值在 `cl100k_base`、`o200k_base`、GPT-2、Mistral-7B-v0.1 和 Qwen2.5-0.5B 分词器下的表现。五种分词器的排序一致，但差距大小并不一致（美化 JSON 在 GPT-2 下为 CSV 的 3.66 倍，在 Qwen2.5 下为 2.22 倍）。未测试任何封闭的商用分词器。*

![每条记录的编码字节数](/living/ai-reads-human/charts/bytes-per-record.svg)

*图 8. 每条记录的字节数。23 字节的二进制数值未计入共享词表；任何关于二进制形式大小的严谨论断，都必须注明其所依赖的词表（或字典）及版本与哈希值。*

**一个值得明确陈述的负面结果。** 将二进制布局以文本形式写给模型，并不能消除这一额外成本：以 base64 表示时为每条记录 20.3 个词元（κ = 0.89），以十六进制表示时为 22.7 个（κ = 0.99），与 CSV 大致相当，因为文本模型需要的是文本形式的视图。对模型而言，节省来自于发送更少、选择更得当的字段，而非改变所发送内容的编码方式。该结论属于计划中的验证项（M7），尚未经过测量。

<div id="4-why-the-hazards-come-with-the-readability" class="anchor-alias" aria-hidden="true"></div>

## 4. 为什么可读性伴随风险

为人类和松耦合程序设计的格式，使得同一输入对不同的读取者可能产生不同的含义。表格列出了在读取规范中发现的风险，以及在指定库版本上运行的测试中发现的风险（Python 3.13.5、Node v20.19.2、jq 1.7、PyYAML 6.0.2、lxml 6.1.3）。测试行（T、U、X、Y、C 代码）位于 `tests-formats/RESULTS.txt` 中，仅描述这些版本。“Spec”指引用文档的文本。

| 类 | 格式 | 危害 | 证据 |
|---|---|---|---|
| 歧义 | JSON | 重复成员名导致“不可预测”的行为；实现会报告最后一个、全部或失败。测试的三个工具均保留最后一个值。 | RFC 8259 第 4 节；T1 |
| 歧义 | Markdown | 原始描述未明确指定语法；方言因此分化。 | CommonMark 0.31.2 第 1.2 节 |
| 解析器差异 | JSON 数值 | 9007199254740993 在 Python 中精确，在 Node 中舍入为 ...992。 | RFC 8259 第 6 节；T2 和 N2 |
| 解析器差异 | JSON | Python 的 `json` 接受裸 `NaN` 和 `Infinity`，而规范规定这些值不允许。 | RFC 8259 第 6 节；T6 |
| 非规范形式 | JSON | `1`、`1.0`、`1e0`、`10E-1`、`0.1e1` 是同一个数的五种写法，对应两种 Python 类型。 | U3 |
| 非规范形式 | JSON | 成员顺序不改变含义，但会改变字节序列及其任何哈希值。 | T8 |
| 顺序 | JSON 规范化 | 按 UTF-16 码元排序与码点顺序在 U+1F600 与 U+FFEE 上不同。 | RFC 8785 第 3.2.3 节；U2 |
| 非规范形式 | CBOR | 确定性编码是一个可选的配置文件，协议可选择采用；它不是默认行为。 | RFC 8949 第 4.2 节 |
| 非规范形式 | Protocol Buffers | “不要假定序列化消息的字节输出是稳定的。” | Protobuf 编码指南，“影响” |
| 数值危害 | JSON | 实现可能限制范围和精度；精确可表示的整数范围为 ±(2^53)−1。 | RFC 8259 第 6 和 9 节；RFC 7493 第 2.2 节 |
| 数值危害 | JSON | `1e400` 在 Python 和 Node 中均变为 `inf`；`-0` 的处理方式不同。 | T3, N3, T4, N4 |
| 数值危害 | YAML 1.1 解析器 | 在 PyYAML 中，`010` 是 8，`12:30:45` 是 45045，而 `country: NO` 是 `{country: False}`。 | Y 行 |
| 数值危害 | TOML | 规范规定无法无损存储的整数是错误；Python 的 `tomllib` 接受了 2^63。 | TOML 1.0.0；T 行 |
| Unicode | JSON | `"\uDEAD"`（未配对代理）被语法允许；它能解析，但在 UTF-8 编码时失败。 | RFC 8259 第 8.2 节；T5 |
| Unicode | JSON | 同一文本的 NFC 和 NFD 形式是不同的键。 | U1 |
| 注入 | CSV | 以 `=` 开头的单元格对解析器是纯数据，对某些电子表格程序则是公式。 | OWASP CSV 注入；C 行 |
| 注入 | XML | 启用实体解析后，lxml 通过外部实体读取本地文件。 | X 行 |
| 资源膨胀 | YAML | 166 字节的别名扩展为 59,049 个逻辑叶节点。 | Y 别名测试 |
| 资源膨胀 | XML | 202 字节的内部实体扩展为 10,000 个字符（49.5 倍）。 | X 行 |
| 资源膨胀 | JSON | 深度限制由实现定义；Python 在 100,000 层嵌套时引发 `RecursionError`。 | RFC 8259 第 9 节；T9 |
| 全性 | 任何解析器 | 库异常是函数返回类型之外的控制流。 | T5, T9 |

这些理由都不构成为了人类而避开这些格式的依据。每一条理由所说明的，只是同一段文本不应在机器之间充当唯一的权威来源。

<div id="5-planned-measuring-energy" class="anchor-alias" aria-hidden="true"></div>

## 5. 计划：能量测量

测量路线图将已完成的解析/分词 `reported_j` 计数器与开放的 GPU 推理及外部硬件功率探针区分开来：

| ID | 测量内容 | 状态 |
|---|---|---|
| M1, M2, M3 | 解析时间、词元数、分词器吞吐量 | **已完成**（`data/parse_time.tsv`、`data/tokens.tsv`、`data/tokenize_time.tsv`） |
| M5 | 针对全部 34 个工作负载的解析和 `tiktoken` 能量测量，通过双通道 Apple M5 Max `reported_j`（`L3` 每进程 `ri_energy_nj` + `L2` 整芯片 `IOReport`，采用 Falsifier 6 空闲漂移门控） | **已完成 `reported_j`**（第 5c 节；`data/energy_reported_j.tsv`；`measured_j = None`，`board_metered = false`） |
| M4 | 针对上下文长度的预填充能量和每词元解码能量，相同模型、GPU，采用硬件能量计数器或外部轨/壁探针 | 计划中（需要专用 GPU 计数器或在线功率探针） |
| M6 | 第二个语料库：自然语言文档和日志，对比标识符密集的遥测数据 | 计划中 |
| M7 | 任务层面：代理回答一组固定问题所需词元数，来自其所需字段的投影与完整文档的对比 | 计划中 |
| M8 | 其他格式的解析器（simdjson、rapidyaml、libxml2 C、pulldown-cmark），以界定语言-运行时效应 | 计划中 |

外部壁插或在线 USB-C 功率探针读数（`measured_j`）仍未收集；第 5c 节严格报告操作系统/芯片上 `reported_j` 计数器。

<div id="5b-measured-energy-no-net-effect-resolved" class="anchor-alias" aria-hidden="true"></div>

## 5b. 实测能耗：未解析出净效应

*首次全芯片减法尝试，于2026-10-18在两台Apple M5 Max笔记本电脑上运行（48 GB机型使用电池供电，128 GB机型使用交流电源），macOS 27.0.1，Python 3.13.16，功率计数器macmon 0.10.0（48 GB机型）和0.9.0（128 GB机型），读取整个SoC的`IOReport`和SMC传感器（`all_power`和`sys_power`）。在相同的20,000条记录上进行九种解析工作负载，每种工作负载在单线程上循环10 s，共10轮交错运行，每轮前后均设置10 s空闲窗口。数据文件：`/living/ai-reads-human/data/energy_joules.tsv`，以及原始样本位于`/living/ai-reads-human/data/energy_raw_m5max48/`和`energy_raw_m5max128/`。*

**非隔离全芯片尝试的结果：净高于空闲的封装减法无法在繁忙主机上解析单线程解析任务。** 在两台笔记本电脑上（一分钟负载平均值为41至68），前后空闲基线在窗口间移动2至7 W，而单个解析线程仅向功耗为18至36 W的芯片增加1至5 W，导致每个净均值均处于零的1.5个标准误差范围内（其中若干为负值）。这一失败促使了5c节中双通道协议的提出：将全芯片`IOReport`（`L2`，由Falsifier 6门控，从而自动拒绝漂移的净减法）与macOS内核的per-PID `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（`L3`）配对，后者将CPU能耗严格归因于执行各工作负载的专用工作子进程。

<div id="5c-dual-channel-apple-m5-max-reported_j-across-all-34-parse-and-tokenize-workloads" class="anchor-alias" aria-hidden="true"></div>

## 5c. 覆盖全部 34 个解析与分词工作负载的双通道 Apple M5 Max `reported_j` 测量

*执行时间为 2026-11-22(`16:44:52` 至 `16:53:22 UTC`),平台为 Apple M5 Max(`128 GB` 内存,`macOS 27.2.1` `arm64`,`Python 3.13.14`,`macmon 0.12.0`),随机语料种子 `20261016`(`20,000` 条记录,分布于 12 个经 SHA-256 固定的文件中),共进行 `5` 轮交错随机化实验,即 `34` 个工作负载 × `5` 轮 = `170` 个独立工作子进程时间窗口。数据文件:[`/living/ai-reads-human/data/energy_reported_j.tsv`](/living/ai-reads-human/data/energy_reported_j.tsv) 与 [`/living/ai-reads-human/data/energy_reported_j_summary.json`](/living/ai-reads-human/data/energy_reported_j_summary.json)。交互式浏览器:[`/living/ai-reads-human/`](/living/ai-reads-human/)。*

<div id="telemetry-channels-and-falsifier-6-demonstration" class="anchor-alias" aria-hidden="true"></div>

### 遥测通道与 Falsifier 6 演示

每个测量窗口同时记录了两个无根遥测通道，同时保持 `measured_j = None` 和 `board_metered = false`：

1. **进程级 `L3` `reported_j`（共享主机标签 `D`，共租户隔离）**：`proc_pid_rusage(worker_pid, RUSAGE_INFO_V6).ri_energy_nj`，由 XNU 内核严格在专用于该单一格式/分词器遍历的工作子进程线程上进行积分。
2. **全 SoC `L2` `reported_j`（共享主机标签 `A2`，Falsifier 6 门控）**：`macmon pipe` 采样 Apple Silicon `IOReport` `chip_power`，并伴随 `0.8 s` 的窗口前后空闲基线。 在 **Falsifier 6** 下，任何前后空闲基线漂移超过 `> 5.0%` 的窗口，其 `derived_marginal_j` 将自动作废而不是报告。 在此共享主机上（平均 1 分钟负载 `12.92`，空闲芯片功耗 `30.5-35.4 W`），Falsifier 6 在 34 个工作负载中使 **`109` / `170` 窗口（`64.1%`）** 失效（其中 `61 / 170` 窗口有效，`0 / 34` 工作负载在全部 `5 / 5` 副本中均通过），定量复现了第 5b 节的诊断，而 `L3` `ri_energy_nj` 则干净地解析了每一个工作负载。

<div id="parse-stage-l3-reported_j-16-workloads-20000-records" class="anchor-alias" aria-hidden="true"></div>

### 解析阶段 `L3` `reported_j`（`16` 个工作负载，`20,000` 条记录）

| 格式和解析器 | 语料库字节数 | 每 `20k` 记录的墙钟时间（ms）（均值 ± 标准差） | `L3` 每记录 `nJ`（均值 ± 标准差） | `L3` 每字节 `nJ` | 每记录指令数 | `L3` 相对于二进制的能耗比 |
|---|---:|---:|---:|---:|---:|---:|
| 固定二进制（`numpy.frombuffer`，零拷贝视图） | `460,000` | `0.0002 ± 0.0000` | `0.04 ± 0.01` | `0.002` | `0.3` | `0.00×`（仅视图） |
| **固定二进制（`struct.iter_unpack`，参考实现）** | `460,000` | `1.359 ± 0.351` | **`280.36 ± 111.38`** | `12.19` | `1,397.4` | **`1.00×`** |
| JSON（`orjson`，C/Rust SIMD） | `2,325,428` | `7.053 ± 1.359` | **`1,405.93 ± 372.34`** | `12.09` | `6,187.0` | **`5.01×`** |
| CSV（`csv`，Python 标准库） | `1,205,469` | `8.804 ± 1.309` | **`1,798.22 ± 435.28`** | `29.83` | `8,812.4` | **`6.41×`** |
| MessagePack（`msgpack`） | `1,660,773` | `10.817 ± 3.321` | **`1,802.46 ± 593.84`** | `21.71` | `9,593.3` | **`6.43×`** |
| **JSON（`json.loads`，Python 标准库）** | `2,325,428` | `11.396 ± 1.219` | **`2,212.12 ± 409.29`** | `19.03` | `12,700.6` | **`7.89×`** |
| JSON 格式化（`json.loads`，缩进 2） | `3,685,429` | `11.716 ± 2.225` | **`2,648.45 ± 669.32`** | `14.37` | `13,433.3` | **`9.45×`** |
| CBOR（`cbor2`） | `1,660,877` | `15.286 ± 1.250` | **`2,719.58 ± 365.78`** | `32.75` | `14,514.3` | **`9.70×`** |
| XML（`lxml` C 库） | `2,885,487` | `22.204 ± 2.392` | **`3,800.46 ± 331.49`** | `26.34` | `19,521.4` | **`13.56×`** |
| XML（`xml.etree.ElementTree`） | `2,885,487` | `26.354 ± 0.750` | **`6,029.30 ± 370.65`** | `41.79` | `27,495.7` | **`21.51×`** |
| JSON Lines（每行 `json.loads`） | `2,325,427` | `22.729 ± 1.481` | **`6,130.27 ± 946.08`** | `52.72` | `27,414.8` | **`21.87×`** |
| Markdown 表格（`markdown-it-py`，词元） | `1,525,499` | `115.160 ± 7.576` | **`22,824.50 ± 2,464.64`** | `299.24` | `115,255.0` | **`81.41×`** |
| TOML（`tomllib`，Python 标准库） | `2,505,426` | `298.582 ± 60.674` | **`57,803.43 ± 16,269.64`** | `461.43` | `260,140.9` | **`206.17×`** |
| **YAML（`PyYAML` 配合 C `libyaml`）** | `2,445,427` | `448.071 ± 95.009` | **`69,922.12 ± 13,405.09`** | `571.86` | `371,347.0` | **`249.40×`** |
| Markdown 列表（`markdown-it-py`，词元） | `1,925,427` | `417.700 ± 54.289` | **`99,595.04 ± 17,044.11`** | `1,034.52` | `377,878.0` | **`355.23×`** |
| **YAML（`PyYAML`，纯 Python）** | `2,445,427` | `3,224.548 ± 375.725` | **`575,799.27 ± 56,674.36`** | `4,709.19` | `2,706,372.9` | **`2,053.75×`** |

<div id="tokenization-stage-l3-reported_j-18-tiktoken-workloads-20000-records" class="anchor-alias" aria-hidden="true"></div>

### 分词阶段 `L3` `reported_j`（`18` 个 `tiktoken` 工作负载，`20,000` 条记录）

当语言模型摄入的是文本而非结构化内存时，字节对分词（第 2 节中的 `E_tok(F,k)`）在紧凑格式上主导了 CPU 解码开销：

| 分词器与视图 | 每 `20k` 词元数 | 每 `20k` 墙钟耗时（ms，均值 ± 标准差） | `L3` `nJ / 记录`（均值 ± 标准差） | `L3` `nJ / 词元` | 相对 CSV 的比值（`同词元`） | 相对固定二进制解析的比值 |
|---|---:|---:|---:|---:|---:|---:|
| `cl100k_base` · CSV（`recs.csv`） | `459,916` | `73.442 ± 20.454` | **`16,384.84 ± 4,362.40`** | `712.51` | `1.000×` | `58.44×` |
| `cl100k_base` · Markdown 表格 | `569,973` | `105.364 ± 18.819` | **`23,385.73 ± 5,597.57`** | `820.59` | `1.427×` | `83.41×` |
| `cl100k_base` · Markdown 列表 | `649,947` | `105.199 ± 11.723` | **`26,749.70 ± 4,445.05`** | `823.13` | `1.633×` | `95.41×` |
| `cl100k_base` · JSONL（`recs.jsonl`） | `753,109` | `154.114 ± 43.130` | **`26,983.02 ± 9,347.95`** | `716.58` | `1.647×` | `96.24×` |
| **`cl100k_base` · JSON 紧凑格式（`recs.json`）** | `733,111` | `124.295 ± 7.051` | **`27,679.19 ± 2,697.37`** | `755.12` | **`1.689×`** | **`98.73×`**（相对 `json.loads` 为 `12.51×`） |
| `cl100k_base` · XML（`recs.xml`） | `1,046,596` | `171.844 ± 21.381` | **`36,730.51 ± 6,968.26`** | `701.90` | `2.242×` | `131.01×` |
| `cl100k_base` · TOML（`recs.toml`） | `933,109` | `178.111 ± 23.760` | **`38,499.73 ± 6,633.02`** | `825.19` | `2.350×` | `137.32×` |
| `cl100k_base` · YAML（`recs.yaml`） | `1,029,947` | `208.434 ± 33.837` | **`51,880.14 ± 12,381.40`** | `1,007.43` | `3.166×` | `185.05×` |
| **`cl100k_base` · JSON 美化格式（`recs_pretty.json`）** | `1,313,111` | `266.827 ± 21.754` | **`70,590.45 ± 10,239.93`** | `1,075.16` | **`4.308×`** | **`251.78×`**（相对美化 JSON 的 `json.loads` 为 `26.65×`） |
| `o200k_base` · CSV（`recs.csv`） | `464,995` | `51.864 ± 5.906` | **`9,570.91 ± 1,012.53`** | `411.66` | `1.000×` | `34.14×` |
| `o200k_base` · JSON 紧凑格式（`recs.json`） | `754,794` | `93.277 ± 8.521` | **`15,125.65 ± 1,287.77`** | `400.79` | `1.580×` | `53.95×`（相对 `json.loads` 为 `6.84×`） |
| `o200k_base` · Markdown 表格 / 列表 | `574,818` / `654,792` | `68.091` / `68.666` | **`15,693.90`** / **`17,362.58`** | `546.05` / `530.32` | `1.640×` / `1.814×` | `55.98×` / `61.93×` |
| `o200k_base` · JSONL / XML / TOML | `774.8k` / `1,054.8k` / `934.8k` | `83.02` / `114.79` / `106.68` | **`21,530.58`** / **`22,997.48`** / **`25,307.32`** | `555.78` / `436.05` / `541.45` | `2.250×`-`2.644×` | `76.79×`-`90.27×` |
| `o200k_base` · YAML（`recs.yaml`） | `1,034,792` | `141.338 ± 24.980` | **`29,401.44 ± 7,308.15`** | `568.26` | `3.072×` | `104.87×` |
| `o200k_base` · JSON 美化格式（`recs_pretty.json`） | `1,314,794` | `193.648 ± 18.210` | **`37,070.18 ± 3,651.35`** | `563.89` | `3.873×` | `132.22×` |

由 `170` 个窗口的测量活动可以得出以下三项发现：

1. **对 JSON 进行分词的 CPU `reported_j` 消耗约高一个数量级，相比于解析**：`tiktoken`（`cl100k_base`，使用编译型 Rust 实现）在紧凑 JSON 上耗费 `27,679.2 nJ/record`（每 `20,000` 条记录 `0.554 J`，每条记录 `129,192` 条指令），**`12.51×` Python 的 `json.loads()`（`2,212.1 nJ/record`）**，**`19.69×` `orjson.loads()`（`1,405.9 nJ/record`）**，以及 **`98.73×` `struct.iter_unpack`（`280.4 nJ/record`）**。将 JSON 缩进（`indent=2`）会导致 `cl100k_base` 分词能耗进一步增加 `2.55×`，达到 `70,590.5 nJ/record`（相当于 CSV 分词的 `4.31×`），仅用于扫描空白字符序列。

2. **解析能耗比例紧随指令比例，且有效功耗变化幅度较小（每个 worker PID `3.28-5.65 W`）**：C `libyaml` 消耗 `3.31 W` 的有效 worker 功率（相较于 `329.8×` 壁挂时间，二进制 `reported_j` 为 `249.4×`），而逐行 `jsonl` 与美化后 JSON `tiktoken` 的功率为 `5.37-5.46 W`（`reported_j` 分别为 `21.87×` 与 `251.78×`，而壁挂时间分别为 `16.73×` 与 `196.37×`），这进一步说明直接使用 per-process `ri_energy_nj` 计数器比通过壁挂时间乘以固定功率估算更为合理。

3. **来源边界**：`ri_energy_nj` 是操作系统/固件计数器（`reported_j`，遥测层级 `L3`），而非外部硬件分流或插座功率分析仪（`measured_j = None`，`board_metered = false`），且仍然覆盖神经网络前向传播之前的主机 CPU/内存工作（`e_prefill · T_{F,k}` 在 M4 中）。

<div id="6-where-a-canonical-machine-form-fits" class="anchor-alias" aria-hidden="true"></div>

## 6. 规范机器形式适用的位置

应对该税的一种方法是保留一种规范的机器形式用于存储和交换，仅在有人请求阅读时才发出人类文本。若干项目已为此问题的部分环节采用了该路线：确定性 CBOR、规范 JSON、模式绑定的二进制格式。这样一种形式所需的属性是可测试的：每个值对应一个有效的字节字符串、声明的版本、封闭模式、解码前声明的大小和深度界限，以及一个指明其所依赖字典的大小声明。

<div id="61-an-open-design-question" class="anchor-alias" aria-hidden="true"></div>

### 6.1 一个开放的设计问题

哪一种规范交换格式最合适，本文不作定论。规范 JSON（RFC 8785）保留了文本形式，但需要为数字格式化和键顺序制定规则；确定性 CBOR（RFC 8949 第 4.2 节）为二进制格式，在 Python `cbor2` 中为 `2,719.6 nJ/record`，相对基准为 `9.70×`，但具体选择仍留给各协议自行决定。长度前缀或定长步长的二进制格式（在 `struct.iter_unpack` 中为 `280.4 nJ/record`，零拷贝缓冲区视图则为 `0.04 nJ/record`）几乎消除了机器之间的全部解析开销，而文本模型仍需要投影后的文本视图（在 `cl100k_base` 下，CSV 为 `16,384.8 nJ/record`，美化格式 JSON 为 `70,590.5 nJ/record`）。一旦把 GPU 模型预填充（`M4`）和字段投影任务（`M7`）纳入考量，何种端到端权衡最终占优，仍有待研究。

<div id="7-reproduce-this-page" class="anchor-alias" aria-hidden="true"></div>

## 7. 复现此页面

此站点中，所有必需内容位于 `/living/ai-reads-human/` 下：

- `data/parse_time.tsv`、`data/tokens.tsv`、`data/tokenize_time.tsv`、`data/ENV.txt`、`data/SUMMARY.txt`：Linux Xeon 的时间和 token 基准。
- `data/energy_reported_j.tsv` 与 `data/energy_reported_j_summary.json`：34 项工作负载、170 窗口的 Apple M5 Max 双通道 `reported_j`（`L3` `ri_energy_nj` + `L2` `IOReport` Falsifier 6）数据集（`data/energy_joules.tsv` 保留了 2026 年十月的早期未隔离全芯片空运行）。
- `scripts/gen_corpus.py`（已种子化语料库）、`bench_parse.py`、`bench_tokens.py`、`bench_tokenize_time.py`、`summarize.py`：用于测量的脚本。
- `scripts/make_charts.py`：从结果文件重新生成所有图表，并校验标题数值。
- `scripts/verify_numbers.py`：重新计算文中引用的所有数字；若不匹配则以非零状态退出。
- `tests-formats/`：危害测试行背后的脚本。

```
python3 -m venv --system-site-packages venv
venv/bin/pip install tiktoken tokenizers msgpack cbor2 orjson ruamel.yaml markdown-it-py psutil
venv/bin/python scripts/gen_corpus.py 20000
venv/bin/python scripts/bench_parse.py 9 > results/parse_time.tsv
venv/bin/python scripts/bench_tokens.py 2000 > results/tokens.tsv
venv/bin/python scripts/make_charts.py charts && venv/bin/python scripts/verify_numbers.py
```

GPT-2、Mistral-7B-v0.1 和 Qwen2.5-0.5B 的分词器词汇表由 `bench_tokens.py` 从模型中心下载。时序和 `ri_energy_nj` 计数器依赖于主机处理器和操作系统；预计不同格式之间的多数量级排序关系保持不变，而绝对纳秒和纳焦耳数值会随硬件变化。

<div id="8-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## 8. 有效性威胁

- 内核 `ri_energy_nj`（`L3` 的 `reported_j`）是 Apple Silicon 上基于模型的操作系统计数器，而非内联直流电轨或交流墙插计量表（`measured_j = None`，`board_metered = false`）；GPU 模型预填充/解码焦耳数（`M4`）在此尚未实测。
- 在共享主机上，全SoC `IOReport`（`L2`）的净高于空闲值扣减容易受到同机租户负载漂移的影响（第5c节中 Falsifier 6 使 `109 / 170` 个窗口失效；第5b节为零结果）。
- Python 对象分配开销对若干解析项有贡献（`M8` 中的编译型 C/Rust 解析器将限定运行时开销；需注意 `orjson` 与 `tiktoken` 本身已执行编译后的原生代码）。
- 仅测试了一个合成的、标识符较少的语料库（`seed = 20261016`）；自然语言文本与遥测日志仍未检验（`M6`）。
- 所测试的分词器均为开源分词器；闭源商业分词器未经测试。
- 23 字节的二进制布局依赖于一个共享的 24 字词典（`SHA-256` 固定记录于 `data/energy_reported_j_summary.json`），而每条记录的字节数统计并未重复列出该词典。

<div id="9-read-ledger-and-references" class="anchor-alias" aria-hidden="true"></div>

## 9. 读取账本与参考文献

各来源的状态见[读取账本](/living/ai-reads-human/READ_LEDGER.md)（FULL、PARTIAL、UNAVAILABLE）。已引用：RFC 8259、RFC 7493、RFC 8785、RFC 8949、RFC 4180、CommonMark 0.31.2、YAML 1.2.2（第 1.1 节）、TOML 1.0.0、Protocol Buffers 编码指南、OWASP CSV Injection、`tex.web`（仅头部，PARTIAL）、Samsi 等 arXiv:2310.03003、Luccioni 等 DOI 10.1145/3630106.3658542。HTML 来源均以去除标签的纯文本形式读取，因此其中的图表未被读取。

**未读取（付费墙或不可用），列出标识符且未用于任何论断：**

| 项目 | 标识符 |
|---|---|
| ISO 32000-1:2008, Portable Document Format | ISO 目录（付费墙） |
| ISO/IEC 29500, Office Open XML | ISO/IEC 29500（免费等价物 ECMA-376 仅部分读取） |
| ISO/IEC 26300, OpenDocument | ISO/IEC 26300（免费 OASIS ODF 1.3 第 1 部分已读） |
| IEEE 754-2019, Floating-Point Arithmetic | DOI 10.1109/IEEESTD.2019.8766229 |
| Sennrich, Haddow, Birch, "Neural Machine Translation of Rare Words with Subword Units" | DOI 10.18653/v1/P16-1162 |
| The Unicode Standard and UAX #15 | unicode.org（未获取） |
| ECMA-262（RFC 8785 引用的数值序列化） | 未获取 |
| The TeXbook, printed edition | ISBN 978-0-201-13447-6 |
| Horowitz, "Computing's energy problem", 640 pJ per 32-bit DRAM read 引文的归属来源 | **已读；在论文或全体会议幻灯片中未找到 640 pJ（其给出 1 至 2 nJ，以及每 64 位访问 1.3 至 2.6 nJ）；未使用** |
| Strubell 等 2019；Patterson 等 2021 和 2022；Wu 等 2021 | 仅在 Samsi 和 Luccioni 论文内部被引用；未读取，未提出任何论断 |

<div id="10-what-will-be-added" class="anchor-alias" aria-hidden="true"></div>

## 10. 将要添加的内容

计划的扩展（不按固定顺序）：GPU 模型预填充和解码的每 token 能量（`M4`）以及外部在线壁挂式电表验证（`measured_j`）；编译后的 C/Rust 原生解析器（`M8`）；自然语言和结构化日志语料库（`M6`）；面向代理字段投影工作负载的每任务 token 计数（`M7`）；来自账本的更多格式（PDF 2.0、C2PA、Markdown 方言、LaTeX）及其风险；以及模型规范二进制投影的详细比较。

*© 2026 Open Interface Engineering, Inc. 文本、图表、数据和脚本：MIT 或 Apache-2.0，由您选择。*
