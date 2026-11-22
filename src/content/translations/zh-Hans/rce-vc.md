---
title: "RCE-VC：版本控制定律"
deck: "RCE-VC（版本控制参考实现，与 Reality Code Engine 语言无关）将每次变更接纳至单一规范仓库状态，或以记录的理由拒绝它，将 Rust 和 Python 文件拆分为无名称的顶层条目，并读写普通 Git 历史。里程碑 M0、M1 和 M2 已于公开提交 aba99fce 实现（49 个离线测试）。在 Apple M5 Max 上以 100000 单位运行时，接纳耗时 69.7 至 73.6 微秒，并消耗 317 至 365 微焦耳的每进程内核 rusage 能量（`reported_j`；`measured_j` 未设置）。"
lang: "zh-Hans"
source: "rce-vc"
complete: true
---

<div id="rce-vc-law-of-version-control" class="anchor-alias" aria-hidden="true"></div>

*修订版 af57f48，2026年11月22日。参考实现：[openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc)，位于 [`aba99fcec4414a32bff30ab075668350d3fb80bf`](https://github.com/openIE-dev/rce-vc/tree/aba99fcec4414a32bff30ab075668350d3fb80bf)（2026年11月13日），在初始 `8bf9c9af` 树的基础上更新，内容包括 `rcevc-keys` 顶层 Rust/Python 条目拆分、`rcevc-core::assure` 边界（`49` 项离线测试），以及 Apple M5 Max 于2026年11月22日记录的 `reported_j` 准入测量。*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 摘要

RCE-VC 是一种版本控制设计，也是 Rust 中的一个小型参考实现。许多作者、人员或程序向同一共享状态提交更改。具名检查接受结果，或者更改被拒绝并记录理由。作者可以继续使用 Git。该参考实现并非 Reality Code Engine 语言。它采用相同的框架：一个 Form、一次整体步骤、哈希链日志、无名键以及一个以模型为最后一步的齿轮层级。

**简明说明**

1. 任意数量的人员和程序可以同时写入。当具名检查接受结果时，更改进入共享历史。若检查未接受，则更改被排除，并记录原因。谁提交的更改并不决定其是否被接受。

2. 不涉及相同对象的更改无需相互等待。当它们重叠时，预先记录的代价对通过的结果进行排序，并且一次被接受的结果（包括已解决的冲突）会被复用。只有在较廉价的步骤失败后才会调用模型，其答案仍需通过检查。

3. 该参考实现读写普通 Git 历史，并将 Rust 和 Python 文件拆分为无名的顶层项（`rcevc-keys`），因此作者无需离开 Git。在 Apple M5 Max 上的 `aba99fce` 提交中，对一个包含 100,000 单元的仓库进行更改接受耗时 `69.7-73.6 µs`，能耗为 `317-365 µJ`，在操作系统每进程内核 `ri_energy_nj`（`reported_j`）中。收据 `est_uj` 字段保持为声明的整数表（在相同工作负载下平均 `424,153 µJ`），且未连接外部硬件轨道或墙壁监视器（`measured_j = None`，`board_metered = false`）。

<div id="terms-and-labels" class="anchor-alias" aria-hidden="true"></div>

## 术语和标签

<ul id="terms">
<li>SHA：SHA-256，参考实现用于密钥、内容摘要和日志的哈希函数</li>
<li>BLAKE3：一种密码学哈希函数，被设定为内部密钥的设计目标；参考实现目前尚未使用它</li>
<li>HAMT：哈希数组映射字典树（hash array mapped trie），用于保存仓库状态的持久化映射</li>
<li>UTF：UTF-8，Git 文件映射所接受的文本编码</li>
<li>MSRV：最低支持的 Rust 版本（`rcevc-core` 与 `rcevc-proj-git` 为 `1.85`，`rcevc-keys` 为 `1.90`）</li>
<li>CI：持续集成（在 `rustc 1.100.0` 上运行 `cargo test --locked --offline --all-targets`）</li>
<li>CAS：比较并交换（compare-and-swap）引用更新（`CasRef` 与 `GitDir::compare_and_swap_ref`）</li>
<li>FIPS：美国联邦信息处理标准（Federal Information Processing Standards）；SHA-256 检验使用 FIPS 180-4 测试向量</li>
<li>RFC：征求意见稿（Request for Comments）；inflate 代码遵循 RFC 1950 与 RFC 1951</li>
<li>SATB、CPU、GPU、PID、SMC、SoC：Satiation Benchmark 遥测规范、中央处理器、图形处理器、进程标识符、系统管理控制器与片上系统</li>
<li>VC1、VC2、VC3、VC4、VC5：参考实现所检验的五个命题，其检验测试见下文</li>
<li>CONGRA：项目笔记中提到的一个语料库，用于未来的重放；本页不展开其全称</li>
<li>README：参考实现仓库中随附的概述文件</li>
</ul>

在整片（L2）和每进程（L3）遥测中，此页上有三个标签分别独立：

- **测量（壁钟时间和计数）** 表示来自发布版的壁钟时间、指令计数或路径计数（`aba99fce` 在 Apple M5 Max 上，README 基准在 `8bf9c9af` 打印时）。
- **已报告 (`reported_j`：L2 和 L3 计数器)** 表示在 Apple M5 Max（`macOS 27.2.1`）上读取的操作系统或芯片内计数器：整片 `IOReport` 通过 `macmon`（L2，共享主机标签 `A2`，在 `<= 5.0%` 的前后空闲漂移下由 Falsifier 6 门控）以及每个 PID 的内核 `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（L3，标签 `D`）。未连接外部硬件电源轨或墙上电源探头（`measured_j = None`，`board_metered = false`）。
- **声明（`est_uj` / `est_j`）** 表示在 `rcevc-core` 中复制到收据上的默认整数成本表。它是源代码中编写的分析表，绝不是计数器或壁钟计量读取。

<div id="1-what-the-reference-is-and-what-it-is-not" class="anchor-alias" aria-hidden="true"></div>

## 1. 参考是什么，以及它不是什么

该项目的目标是一种历史，许多人类和代理可以同时写入，而无需要求写入者停止使用 Git。项目说明中的框架是：分支、差异化和合并到一条主线是一种旧接口，兼容性是维持该接口的原因，而确定性规则应在任何可能的地方决定规则，最后使用模型。

现实代码引擎（RCE）是一种在其自身论文中研究的编程语言，该论文位于本站点。RCE-VC 并非构建于该语言之上。它不解析 RCE 程序，不发出它们，也不调用 RCE 检查器。它所共享的是框架：仓库的表单、称为 δ 的完全确定性步骤、其折叠即为状态的哈希链式日志、无名称键，以及一个齿轮阶梯，其中模型最后运行且不受信任。

在提交 `aba99fce`（`13 November 2026`）时，公共工作区为版本 0.1.0 并包含**三个** crate：

1. `rcevc-core` 是确定性核心：无时钟、无随机性、无 I/O、无依赖，且 `#![forbid(unsafe_code)]`（MSRV `1.85`）。它现在还包括 `rcevc-core::assure`，这是一个保证边界，确保已检查的操作仅从该仓库日志中已有的结果铸造，并且仅应用于其所检查的头部和门，而 `CasRef` 重试一个操作标识符，因此另一个写入者的相同目标永远不会被误认为是成功。
2. `rcevc-keys` 使用供应商提供的 `tree-sitter 0.27.2`、`tree-sitter-rust 0.24.2` 和 `tree-sitter-python 0.25.0`（MSRV `1.90`，从 `vendor/` 离线构建，使用 C 编译器且零网络获取）将 Rust（`.rs`）和 Python（`.py`）源文件拆分为顶级项。每个项的标识符是规范化标记体的核心无名称键，对项重命名、空白和注释不变，而确切的原始字节保留在 `parts` 中，以便 `project` 无损地将它们连接回来；非 `.rs`/`.py` 路径或解析错误树干净地回退到原始字节上的一个叶。
3. `rcevc-proj-git` 是 Git 投影（`#![forbid(unsafe_code)]`，MSRV `1.85`），携带其自己的 SHA-1、zlib 和 Git 对象代码以及 `GitDir::compare_and_swap_ref`，以便核心保持无依赖。

CI 运行 `cargo test --locked --offline --all-targets` 和 `cargo clippy --locked --offline --all-targets -- -D warnings` 于 `rustc 1.100.0`，执行**49 个离线测试**（`29` 个在 `rcevc-core` 中、`8` 个在 `rcevc-keys` 中，以及 `12` 个在 `rcevc-proj-git` 中，针对 `git 2.43` 验证）。编号超过 VC5 的命题未在本页陈述。

<div id="2-law-of-version-control" class="anchor-alias" aria-hidden="true"></div>

## 2. 版本控制定律

参考实现给出如下表述。该段同时位于代码仓库 README 与 crate 文档的开头，此处仅引用一次。

> 版本控制即将变更准入一个规范的、无名称的仓库状态。每一项变更仅当具名检查器依据声明的契约接受其变更后状态时才被准入，否则以记录在案的理由被拒绝；依赖闭包不满足条件的变更无需协调即可准入；在可准入的整合方案之间，由明确给出的成本对候选方案排序；每一个已接受的结果，包括每一个已解决的冲突，都会被复用。

本页其余部分说明参考实现在提交 `aba99fce` 中实现了什么、在其上测得了什么，以及尚未实现什么。上述表述是参考实现所力求达到的标准，并非对现有版本控制工具行为的描述。

<div id="3-quantities" class="anchor-alias" aria-hidden="true"></div>

## 3. 数量

一个**单元**由一段文本体和一组依赖槽位组成。若依赖列表为空，则该单元为叶节点，其文本体为字面文本，因此 shell 脚本中的美元符号仍保持为美元符号。若依赖列表非空，则美元符号后接索引会选择对应的依赖，两个美元符号则表示字面美元符号。

单元的**键**是一种与名称无关的标识。重命名改变的是名称绑定到哪个槽位，但不改变键。参考实现定义如下：

$$
\mathrm{key}(u) = H(\texttt{rcevc/unit/v1},\; \mathrm{body}(u),\; \mathrm{key}(d_0), \ldots, \mathrm{key}(d_{m-1}))
$$

其中 $H$ 为经过带版本号且具域分离的编码器实现的 SHA-256，$d_i$ 为依赖单元。由字典树哈希的**内容摘要**则是另一个值：$H(\mathrm{body}, \text{dependency names})$。

**草稿**是未经验证的映射，用于创世以及任何从外部读取的内容。对草稿进行封印会检查它并产生一个**状态**。状态是良构的：依赖均可解析，文本体中的每个索引都已绑定，且依赖图中不存在环。状态持有三个持久映射。单元映射是 Merkle HAMT。键映射与反向依赖索引是持久的，但不属于 Merkle 根的一部分。复制状态与读取其根的代价均为 $O(1)$。当两个状态的根相等时，二者相等。差异计算只遍历哈希不同的子树，因此其代价取决于差异大小，而非仓库规模。键已改变但自身单元未改变的依赖者被有意排除在差异之外。下文定义的闭包会携带这些依赖者。若将其纳入差异，共享的依赖者会被误判为冲突。

**编辑**会改变若干槽位，并在最后对所触及槽位的反向依赖闭包进行一次验证。编辑过程中的中间状态可能是非良构的，这是有意为之，例如先删除再放入。

**变更**带有一个不透明的写入者标签、一个基准状态、一个层级、一组操作以及一条说明。操作包括 put、delete 和 rename。层级包括仅名称、勘误、含义变更与接口变更。仅名称层级由内核检查：键的多重集必须保持不变。变更标识符覆盖所有字段。说明是声明的意图，例如提交标题。准入时不读取说明，且它不依赖写入者标签。

对于变更 $c$ 相对于状态 $s$，

$$
\mathrm{writes}(c, s) = \mathrm{diff}(s,\; \mathrm{apply}(s, c)).
$$

读取集即 put 所依赖的单元以及 rename 的来源。变更 $c$ 在状态及后状态中的闭包，由写入集、变更前的依赖者、变更后的依赖者以及读取集共同构成。当两个变更各自的写入集都与对方的闭包不相交时，二者在 $s$ 上可交换：

$$
\mathrm{commutes}(a, b, s) \iff \mathrm{writes}(a) \cap \mathrm{closure}(b) = \emptyset \;\land\; \mathrm{writes}(b) \cap \mathrm{closure}(a) = \emptyset.
$$

参考测试表明，可交换的变更以任一顺序应用时，都得到相同的根。

步骤 **δ** 是 submit。它对用户输入是全函数的：返回带回执的接受结果，或带原因的拒绝结果，且无论哪种结果，都会追加一条哈希链式日志条目。头部（head）是该日志的折叠结果。重放（replay）会验证哈希链，并重新整合每个条目。对于冲突，重放使用记录下来的解决结果，而不调用提议者（proposer）。重放还会检查每个前状态根、每个后状态根以及每个拒绝原因。

<div id="4-the-repository-form" class="anchor-alias" aria-hidden="true"></div>

## 4. 仓库形式

README 将实现的形式划分为九个部分，并附加 `rcevc-keys` 项分割器和 `rcevc-core::assure` 边界。

| 部分 | 位置 | 功能 |
|---|---|---|
| R，无名键 | `model.rs`, `rcevc-keys` | 如上所述的键；`rcevc-keys` 将 `.rs` 和 `.py` 文件拆分为顶层项，并保持无损字节映射。重命名不会改变键。 |
| S，持久状态 | `hamt.rs`, `model.rs` | Merkle HAMT。克隆和根操作为 $O(1)$，差分成本为差异的大小，采用规范的 trie 形状。键以及逆向依赖索引在编辑时更新，而不是在整个仓库上更新。 |
| Δ，类型化更改 | `change.rs` | 在声明的基准上进行放置、删除和重命名，伴随声明的层级。仅名称的检查由内核完成。 |
| X，交换性 | `change.rs` | 写入即实际差分。闭包在前后添加依赖项，并进行读取。互不相交的闭包可以交换。 |
| K 与 G，检查器与门 | `gate.rs` | 每个检查器声明一个属性类、一个链接假设、一个受信任的基准、一个权威、一个范围以及一个摘要。 |
| δ，梯子 | `repo.rs`, `assure.rs` | 查找、交换、结构合并、重新验证、提议者，以及 CAS 引用保证(`CasRef`)。门在每条路径上运行。 |
| D，日志 | `repo.rs` | 哈希链式条目。头部是折叠。回放在没有提议者的情况下重建它。 |
| U，复用 | `repo.rs` | 解决方案存储在无名冲突签名下，且仅在门接受后才保存。 |
| C，成本 | `repo.rs` | 声明的每层表(`est_uj`)。收据携带该总和。 |

检查器的权威可以是 pinned、replay、proved、derived 或 inferred 之一。其范围分为三类。**单元**：对 delta 中的单元重新检查。**闭包**：判决取决于单元及其传递依赖，因此门还会重新检查依赖项。**全局**：检查整个状态。如果之前的头部通过且声明的范围为真，则范围内的重新检查等同于完整检查。测试 `delta_gate_agrees_with_full_gate` 在 600 次试验中记录了这种一致性，拒绝次数超过 100 次。对范围撒谎的检查器会破坏 VC2。范围被信任。此版本中没有通过隐藏其余状态来强制执行范围。

门的摘要覆盖每个检查器的声明，该摘要用于生成创世哈希。Trie 形状是规范的：前缀要么为空，要么是单个叶子，要么是包含两个或更多键的分支。根不依赖于到达的顺序历史。所有哈希的内容都会通过编码器，并附带形式为 `rcevc/<thing>/vN` 的带版本的域标签。更改标签覆盖的内容意味着需要升级版本。

<div id="5-the-transition" class="anchor-alias" aria-hidden="true"></div>

## 5. 变迁

`submit` 总是采取以下路径之一。齿轮名称即收据上所写的名称。

1. **G0，查找。** 针对同一头部的同一变更标识符，若已被拒绝，则返回存储的拒绝结果。该重试的声明成本仅为 G0 行。测试 `g0_identical_retry_costs_one_lookup` 记录了这一点。
2. **Base。** 基础快照必须存在，否则原因为未知基础。将操作应用于该基础必须成功，否则原因为应用错误或格式错误的单元。仅含名称的声明若未使键的多重集保持不变，则被拒绝。
3. **G1，交换。** 设移动集为从基础到当前头部的差分。若变更的闭包在基础和头部均未命中该集合，则直接将变更应用于头部，无需合并。
4. **G2，结构合并。** 否则，引用按槽逐一在头部移动内容与变更自身修改内容的并集上进行合并。一侧未变：取另一侧。两侧相等：任取其一。任何其他槽均为冲突。
5. **Conflict。** 签名形式为 $H(\mathrm{key}_{base}, \mathrm{key}_{head}, \mathrm{key}_{theirs})$，其中不使用槽的名称。G0 复用返回针对该签名的存储解析。若无存储解析，则 G4 询问提出者。若无提出者，或提出者未返回任何内容，则变更被拒绝并附带冲突槽。在重放期间使用记录的解析，且不调用提出者。
6. **G3，重新验证。** 合并后的赋值在头部上构建，并进行格式良好性检查。若该检查失败，则变更被拒绝并视为格式错误。
7. **Gate，在每条路径上，包括 G1。** 将候选变更及与当前头部的差分交给门控。检查器失败将拒绝该变更并指明检查器名称。
8. **Accept。** 提出者的解析仅在此刻被复制到复用存储中。新的头部被快照。收据记录所使用的齿轮、门控证据、解析结果以及 `est_uj`。

拒绝也会被记录。头部不发生移动。

<div id="6-propositions-the-tests-hold" class="anchor-alias" aria-hidden="true"></div>

## 6. 测试所保证的命题

在 `aba99fce` 提交处,`cargo test --offline` 运行 49 项测试(`29` 项核心测试、`8` 项密钥测试、`12` 项 git 测试),与下列命题一一对应:

| 主张 | 仓库中命名的测试 |
|---|---|
| VC1,全域性与无悬空状态:每次提交都被接受或附理由拒绝,并被记录 | `vc1_every_submission_is_accepted_or_refused_and_logged` |
| VC2,归纳式绿色:每个头部都结构良好且通过门禁(400 次随机提交、过期基线、被污染的变更) | `vc2_every_head_is_well_formed_and_passes_the_gate` |
| VC3,交换性蕴含与顺序无关的结果:可交换时,两种顺序得到相同结果(3,000 次随机试验,超过 500 对可交换的组合)以及不相交写入者在两种顺序下均在 G1 完成整合 | `vc3_commutation_implies_order_independence` 与 `vc3_disjoint_writers_integrate_at_g1_in_either_order` |
| VC4,文本无冲突时仍能捕获语义冲突(同名改动与新调用方之间的元数变更) | `vc4_identical_edits_merge_and_semantic_conflicts_are_caught_at_g3` |
| VC5,已解决的冲突可通过与名称无关的签名被复用 | `vc5_resolved_conflicts_are_reused_by_name_free_signature` |
| 模型结果只是候选,从不被直接信任 | `model_output_is_a_candidate_never_trusted` |
| 状态是日志的折叠结果 | `replay_reproduces_head_without_any_proposer` |
| 重命名不改变任何键,且仅改名的情形会被校验 | `renames_change_no_keys_and_name_only_is_verified` |
| G0 幂等重试只需一次查找 | `g0_identical_retry_costs_one_lookup` |
| 作用域门禁与完整门禁结果一致(600 次试验,拒绝次数超过 100) | `delta_gate_agrees_with_full_gate` |
| 快照不受后续编辑影响;增量计算与从零计算结果一致 | `snapshots_share_structure_and_diff_is_exact`,以及 `hamt.rs` 中的 HAMT 测试 |
| SHA-256 与公布的测试向量一致 | `hash.rs` 中的 FIPS 180-4 测试向量 |

VC5 的测试先经由提议者接受一个冲突,随后在另一个槽位名下提交同一冲突。第二次接受走的是 G0 查找档位,不经过 G4,也不再次调用提议者,其 `est_uj` 不足提议者路径回执值的百分之一。该比值仅是对所声明回执成本的比较。

另有一项测试向提议者输入被污染的结果。门禁拒绝了该结果,头部保持不变,被拒绝的解决方案也未被存储以供复用。

<div id="7-measured-wall-time" class="anchor-alias" aria-hidden="true"></div>

## 7. 实测墙上时间

工作负载，如 Swarm 示例所实现的那样：每个轮次中的每位写作者都基于该轮次的起始 HEAD 提交，因此轮次后期的提交会变得陈旧。每五个写作者中就有一位编辑热点模块（`below(5) == 0`）。每五十次提交中就有一次携带禁用令牌（`below(50) == 0`），这对应 README 中所述的 2% 中毒率。示例中的提议者是一个确定性的占位实现，它将两个实体合并。它不是一个学习模型。示例在每个模块中存储 10 单位。示例使用的固定种子为 `0x5eed`。

<div id="71-path-shares-at-400-units" class="anchor-alias" aria-hidden="true"></div>

### 7.1 400单元的路径份额

README的路径表是默认集群：64个写入者，20轮，40个模块，400个单元，1,280次提交。份额为所有提交的占比。

| 路径 | 份额 |
|---|---:|
| 在 G1 接受（交换，无合并） | 57.0% |
| 在 G2 接受，然后 G3（结构合并，重新验证） | 27.3% |
| 在 G2 接受，然后 G4，然后 G3（冲突，提议者，重新验证） | 13.8% |
| 被门拒绝 | 1.9% |

四个份额总和为 100%。每次拒绝都是污染变更，包括 6 个继承了污染的提议者输出。1,280 次提交中有 1,259 次基于过时基准，且这些过时提交中有 98.1% 在无写入者变基的情况下被接纳。该示例进行了 182 次提议者调用。从创世重放且无提议者时，复现了相同的头。

![在参考构建上测量的准入路径和墙上时间](/figures/rce-vc/swarm-and-timing.svg)

*图 1. 400 单元、20 轮集群的测量路径份额，以及在基准参考构建上 5 轮计时运行的每次提交测量墙上时间。发布版，单核。所述的接收成本未显示在本图中。*

<div id="72-integration-cost-against-repository-size" class="anchor-alias" aria-hidden="true"></div>

### 7.2 集成成本与仓库规模的关系

README 中的计时表与此前工作负载形态相同：64 名写入者、5 轮、同一随机种子、release 构建、单核运行。表中单元格为每次提交的实测墙钟时间。M0 是早期版本，采用克隆映射（cloned maps）的状态表示；M1 是持久化 Merkle 状态。

| 单元数 | 模块数 | M0，克隆映射 | M1，持久化状态（README 宿主机） | README 中打印的比值 |
|---:|---:|---:|---:|---:|
| 400 | 40 | 2,103 µs | 98 µs | 21 倍 |
| 4,000 | 400 | 27,536 µs | 105 µs | 262 倍 |
| 40,000 | 4,000 | 未运行 | 136 µs | |
| 100,000 | 10,000 | 未运行 | 188 µs | |

最后一行 100,000 单元的示例对应命令 `swarm -- 64 5 10000`，即 64 名写入者、5 轮、10,000 个模块。M0 的耗时随仓库规模增长，而 M1 基本保持平稳。M1 中剩余的上升来自字典树深度，以及每轮内发生变更的数量。这一结果得益于以下机制：快照共享结构，diff 与门控会跳过相同的子树，编辑只需对被修改的单元及其依赖者重新键化，门控仅需复核增量声明范围内的内容。

<div id="73-measured-wall-time-and-on-chip-reported_j-at-100000-units-commit-aba99fce" class="anchor-alias" aria-hidden="true"></div>

### 7.3 测量的墙时长和芯片上 `reported_j` 于 100,000 单位 (提交 `aba99fce`)

在 2026 年 11 月 22 日，`openIE-dev/rce-vc` 在提交 `aba99fce`（`rustc 1.100.0`，发布构建）在 Apple M5 Max（`macOS 27.2.1` `arm64`）上执行并进行仪器化，使用双通道 SATB `reported_j` 机制：通过 `macmon` 的全芯片 `IOReport`（L2，标签 `A2`，Falsifier 6 `<= 5.0%` 空闲漂移门）与每个 PID 内核 `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（L3，标签 `D`）配对，在 `100,000` 单位（`10,000` 模块 × `10` 单位）：

| `100,000` 单位工作负载（`aba99fce`，Apple M5 Max） | 录入 / 试验 | 试验 | 中位墙时长 / 录入 | 中位 L3 `reported_j` / 录入 | 指令数 / 录入 | 声明的 `CostTable` `est_uj` / 录入 |
|---|---:|---:|---:|---:|---:|---:|
| **README swarm（`64` 写入者 × `5` 轮次）** | `320` (`315` acc, `5` ref) | `5` | **`69.69 µs`** (`63.5-84.1 µs`) | **`365.35 µJ`** (`346.4-395.7 µJ`) | `1,147,137` | `438,530.4 µJ` |
| **Sustained window（`64` 写入者 × `500` 轮次）** | `32,000` (`31,357` acc, `643` ref) | `3` | **`73.56 µs`** (`69.3-75.7 µs`) | **`317.21 µJ`** (`278.9-369.0 µJ`) | `1,153,976` | `424,152.7 µJ` |

- **创世及路径细分**：构建 `100,000` 单位 Merkle HAMT 初始状态的中位耗时为 **`1.244 s`**（共 `5` 次试验）。在 `32,000` 提交的持续运行（`2.35 s` 窗口）中，`26,103` 提交（`81.6%`）在 `G1Commute` 被录入，`2,594`（`8.1%`）在 `G2Structural > G3Revalidate` 被录入，`2,660`（`8.3%`）通过 `G4Proposer` 录入并有 `2,660` 条冲突签名被提升以供复用，`643`（`2.0%`）有害提交被拒绝（`30,857` / `31,490` 的陈旧提交 = `98.0%` 在无写入者重基准的情况下被录入）。
- **L2 与 L3 一致性及 Falsifier 6**：在两个通过 Falsifier 6（空闲漂移 `2.67%` 和 `1.22%`）的持续试验中，全芯片 L2 `IOReport` 的净边际能量分别为 `9.22 J` 和 `4.66 J`（每次录入 `288.2 µJ` 和 `145.6 µJ`），而每个 PID L3 `ri_energy_nj` 为 `11.81 J` 和 `8.92 J`（每次录入 `369.0 µJ` 和 `278.9 µJ`），中间的试验（空闲漂移 `7.28% > 5.0%` 由于并发主机作业）其 L2 净扣减被 Falsifier 6 自动失效。注意占位符 `CostTable`（每次录入 `424-439 mJ`）高估了仅 CPU 录入约三个数量级，因为其 `5,000,000 µJ`（`5 J`）的 `Proposer` 条目预设了神经网络提议者，而非示例中的确定性占位符（`measured_j = None`，`board_metered = false`）。

<div id="8-stated-cost-on-receipts" class="anchor-alias" aria-hidden="true"></div>

## 8. 收据上的标价

`CostTable` 在 `aba99fce` 中的默认表格（单位为微焦耳）仍作为仓库收据中每行的标价：

| 行 | 何者添加 | 标价 µJ |
|---|---|---:|
| G0 | 在每次尝试开始时收取。对每个重用的冲突签名再次收取。记忆化的拒绝仅为此行。 | 1 |
| G1 | 当尝试到达交换测试时收取 | 10 |
| G2 | 当尝试执行结构合并时收取 | 100 |
| Checker | 对每个检查器收取一次，在到达门的每条路径上，包括 G1 | 1,000 |
| Proposer | 对每次提议器调用收取一次 | 5,000,000 |

G3 写在路径上，没有自己的行。收据的 `est_uj` 是尝试添加的各行之和。将此表替换为硬件轨道的 `measured_j` 是里程碑 M6，仍为开放状态；第 7.3 节提供了第一个操作系统 `reported_j` 校准（使用确定性替身提议器时，每个 `100,000` 单位准入为 `317-365 µJ`）。

<div id="9-the-git-projection" class="anchor-alias" aria-hidden="true"></div>

## 9. Git 投影

该投影对应里程碑 M2，位于 `rcevc-proj-git` 中。叶子单元即文件字节本身。带有依赖关系的单元则被写成一个带有简短头部的文件；参考实现将其视为 UTF-8 文件上的一个双射。

```
#rcevc-unit v1
#dep <slot>
#body
<body>
```

每个依赖项都写一行 `#dep`。

**输出.** `export` 为每个被接受的条目在 `main` 上写入一次提交。作者即写入者标签。主题为变更信息；若信息为空，则为一行命名变更标识符及其齿轮的内容。每个被接受的提交都携带如下 trailer：`RCE-VC-Change`、`RCE-VC-Pre`、`RCE-VC-Post`、`RCE-VC-Path`、`RCE-VC-Evidence`、`RCE-VC-Resolved`、`RCE-VC-Est-uJ` 与 `RCE-VC-Entry`。`RCE-VC-Est-uJ` 为声明的微焦耳总和，而非测量值。引用 `refs/rcevc/log` 对每条日志条目（包括拒绝）都有一次提交，且拒绝的提交还携带 `RCE-VC-Reason`。在相同日志和相同时间基准下，`export` 产生相同的提交标识符。

**输入.** `ingest` 从一个 tip 向上遍历父提交，直至找到其 `RCE-VC-Post` trailer 为快照的提交。该快照即为基底。tip 树相对于该基底形成一次变更，包括添加和删除。若内容多集未变，则层级为仅名称。该分支即为提案。梯子决定。写入者无需重新基底。

README 对 git 2.43 进行以下检查，位于 `tests/git_interop.rs`（`rcevc-proj-git` 中的 `12` 个测试，提交 `aba99fce`）：

| 检查 | README 中记录的结果 |
|---|---|
| 对导出的历史执行 `git fsck --full --strict` | 干净 |
| `main` 上的每个提交在其 `RCE-VC-Post` trailer 中重新导入到根目录 | 是 |
| 在不同目录下对同一日志进行两次 export | 提交标识符相同 |
| Git 的 trailer 解析器读取收据 | 是 |
| 在基底已过期的分支上有两个普通 Git 提交 | 被 ingest 为一次变更，在 G1 接受，`main` 向前推进 |
| Git 本身写入的对象，包括 dynamic-Huffman 压缩 | 已读取 |
| 包含禁止 token 的普通 Git 提交 | 被拒绝，记录于 `refs/rcevc/log`，`main` 未移动 |

该投影的限制如 README 所述：仅限松散对象和松散引用；导出时文件模式为 100644，因此可执行位尚未成为单独属性；符号链接、子模块以及非 UTF-8 文件会以原因被拒绝，而非猜测。

项目提及名为 Mergiraf 的结构化合并，它使用 tree-sitter，旨在处理解析形状的文件。这是一项收敛观察。此页面未对该参考进行评分，也未对任何其他版本控制系统进行评分。

<div id="10-limits-of-this-version" class="anchor-alias" aria-hidden="true"></div>

## 10. 本版本的限制

在提交 `aba99fce` 时：

1. `rcevc-keys` 将 Rust (`.rs`) 和 Python (`.py`) 文件拆分为顶层条目（依赖关系仅指向同一文件中较早的条目），但 TypeScript 拆分以及 50 个软件包 / 1,000 个仓库的往返评估尚未完成；其他文件类型仍作为整文件叶单元。
2. Git 存储采用松散对象和松散引用。没有 packfile，也没有打包引用。导出仅写入模式 100644。拒绝符号链接、子模块和非 UTF-8 文件。
3. 每次导出的提交都会重建整个树。
4. 反向依赖集合在更新时会被克隆。具有大量依赖者的单元会使该更新变得庞大。
5. 密钥计算是递归的。超过约 10,000 个单元的依赖链可能导致栈溢出。
6. 一个全内容根节点在单元数量上是线性的。摄入过程仅用它来猜测仅名称级别。内核的仅名称检查会遍历差异。
7. 快照保存在内存中，没有保留策略，也没有单独的存储。
8. `submit` 是单线程的（`CasRef` 保护引用交换，而 `submit` 按顺序接受可交换的变更）。租约尚未构建。
9. 检查器被信任会如实说明其作用域（Wasmtime 沙箱 M3 尚未构建）。
10. 片上 `reported_j`（每次 `100,000` 单元准入为 `317-365 µJ`）已通过内核 `ri_energy_nj` 在外部记录，而仓库内收据字段仍携带所述的 `est_uj` 表，外部硬件轨道的 `measured_j`（M6）仍处于开放状态（`measured_j = None`，`board_metered = false`）。

<div id="11-next-work" class="anchor-alias" aria-hidden="true"></div>

## 11. 后续工作

- **完成 M1（`rcevc-keys` 扩展与语料往返）。** 在 Rust 和 Python 之外加入 TypeScript 语法，支持跨文件的条目依赖，并在至少 50 个真实 crate 与 package 上验证字节级一致的往返。同一文件中对不同函数的独立编辑在 G1 层级应当可交换。
- **完成 M2（BLAKE3 内部键与 `gix` packfile）。** 将内部哈希迁移到 BLAKE3，同时保留 FIPS 180-4 SHA-256 向量作为独立测试并提升域标签版本；将 Git 对象存储迁移到 `gix`（`gitoxide`），以处理 packfile 与 packed refs，随后完成 1,000 个仓库历史的往返验证。
- **M3（基于 Wasmtime 的 `rcevc-gate`）。** 将检查器以带燃料限制、确定性的 WebAssembly 模块运行，并固定其摘要；通过只暴露声明切片的方式，强制执行所声明的作用范围。
- **M4（租约与单调通道）。** 面向单调变更的并发流式处理，无需协调。
- **M5（冲突语料重放）。** 将 Merge-Bench、CONGRA 与 AgenticFlict 通过阶梯进行重放，统计在 G0、G1、G2、G3 与 G4 各层级上的解决数量。
- **M6（`rcevc-meter`）。** 以校准后的 `reported_j` 和外部硬件电源轨的 `measured_j` 取代 `est_uj`。

<div id="12-copyright-and-license" class="anchor-alias" aria-hidden="true"></div>

## 12. 版权和许可证

版权 2026 Open Interface Engineering, Inc.

参考实现位于 [openIE-dev/rce-vc](https://github.com/openIE-dev/rce-vc) 的提交 `aba99fcec4414a32bff30ab075668350d3fb80bf`（2026年11月13日），采用 Apache License, Version 2.0。该树中的许可证文件将版权声明为 Open Interface Engineering, Inc.，而 crate 清单设置 `license = "Apache-2.0"`。本页是该参考实现的学习文本。
