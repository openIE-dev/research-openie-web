---
title: "通信工具雪崩：阈值信号外部化、事件驱动编排和每焦耳相干性"
deck: "一个涉及外部化信号棘轮的生物学、形式学、历史学以及五主机硬件审计，覆盖自古代群体开关与门控纳米孔的七十六年人工智能发展，至十范式数字酶合成、闭环向下编译和同意门控神经接口。包括在 Tegra aarch64 Jetson Thor 上对整板及三通道轨道电流分流 `measured_j` 的物理测量，并行四主机片上 `reported_j`（`board_metered` 为 true）。"
lang: "zh-Hans"
source: "communication-avalanche"
complete: true
---

<div id="the-communication-tool-avalanche-thresholded-signal-externalization-event-driven-orchestration-and-coherence-per-joule" class="anchor-alias" aria-hidden="true"></div>

*修订版 bdb6b96，2026年11月23日。数据与摘要：[数据与摘要](/data/#communication-avalanche)。交互式动态观测站（4 个仪器 + 10 图图库）：[动态观测站](/living/communication-avalanche/)。5秒至90秒短片：[短视频](/tv/)。交互式教程（实验 1-5）：[教程](/tutorials/)。音频深度解读：[音频](/radio/)。存档副本：[PDF](/pdfs/communication-avalanche.pdf) · [LaTeX PDF](/pdfs/latex/communication-avalanche.pdf)（[源文件](/pdfs/latex/communication-avalanche.tex)）。*

<div id="0-abstract-and-epistemic-scope" class="anchor-alias" aria-hidden="true"></div>

## 0. 摘要与认知范围

只要个体参与者把结构化状态外部化到共享媒介中，邻近参与者能够跨越选择性阈值或验证门限接收该信号，并由此产生的状态转移锁定有用的工作成果而不退回先前的噪声状态，集体能动性就会随之扩展。在长达38亿年的生物演化中，集体能力的重大跃升多次与新的细胞间或个体间通信基质相伴出现，而不是源于孤立细胞体积的单纯增大。这些基质包括原始膜泡、细菌群体协同的开关式切换、钙门控的蓝细菌纳米孔、盘基网柄菌类的环核苷酸波、领鞭毛虫的电活动钙瞬变、后生动物的间隙连接、信息素痕迹介导的激励协同、拓扑群集，以及组合性的人类语言、文字、印刷术和分组交换网络。当代人工智能在稀疏专家混合架构和多智能体验证回路中实现了其数字对应物。新兴的神经与旁分泌技术则指向一种未来的双向类比对应物，但这一设想目前仍属推测。

本研究形式化、仿真并审计了该跨尺度论点，沿两条具体可交付成果展开：计算编排效率（以每焦耳相干性量化）和候选神经补充通路。使用 Lean 4.36.0 机械验证的证明（QuorumRatchet、OrchestrationFlow 和 EnzymaticSynthesis 共 45 个定理，无不完整占位符，无自定义公理）确立了门控外部化棘轮的非退化、零时钟亚阈值空闲守恒、合作 Hill 噪声抑制、隔膜纳米孔故障包容、确定性优先模型升级的焦耳主导性、逐次最短路径减费最优性，以及在可选多代理桥接下个体自主不变量的保持。预注册的确定性仿真（种子 `20261123`）量化了细菌群体代谢节省（低密度下调控子能量节省 `95.49%` 至 `99.17%`）、蓝细菌丝状体存活率（快速孔闭合时 `95.0%` 存活，对比无门控时的 `0.0%`）、三维拓扑集群内聚性（四倍扩展后 `100.0%` 连通，对比固定度量半径的 `0.68%` 至 `4.30%`）、适应性原质团最短路径剪枝（超线性反馈下 `100.0%` 通量集中），以及合成示范移除后 20 代文化保留（经认证外部化人工制品时 `100.0%` 最优保留，对比未验证模仿下的 `29.27%`）。跨越五种硬件和操作系统原型，包括物理 Texas Instruments 整板和轨分离电流分流器在 Tegra `aarch64` 开发者套件上（`board_metered = true`，处理器和内存轨上每 `1` 千字节边沿 `measured_j` = `927.30` 微焦耳）以及 Running Average Power Limit (RAPL)、Darwin 内核和图形驱动能量计数器在四台 Linux、macOS 和 Windows 11 工作站上（`reported_j`），编译的 Rust 密码哈希（BLAKE3）加 `Ed25519` 通道认证在 `25.95` 至 `37.39` 微秒内验证信封（每边沿 `64` 字节至 `64` 千字节为 `643` 至 `926` 微焦耳），零时钟 `eventfd` 阈值节点比 `1,000` 赫兹时钟轮询在 `1%` 突发占空比下少用 `2.21x` 套接字能量（`136.32 J` 对比 `300.73 J`，`2.58 ms` 对比 `570.38 ms`，频率 `10 Hz`），且在预注册的 60 任务 Python 代码修复基准（`240` 轮次）中，异构认证编排器匹配单体前沿模型的 `59 / 60`（`98.33%`）通过率，伴随 `0 / 60`（`0.00%`）虚假提交，在本地套接字 `reported_j` 为 `432.75 J` 和 `21` 次模型调用下（`0.136` 任务每焦耳，比 `902.51 J` 单体基线高 `2.09x` 每焦耳相干性，比退化为 `52 / 60 = 86.67%` 且有 `8 / 60 = 13.33%` 虚假提交的未认证四代理级联高 `14.97x`），同时包容 `200 / 200`（`100.0%`）注入的拜占庭通道故障，并在 `2.40` 微秒内重计算最小成本故障转移路由。将 `1950` 至 `2026` 年的 `38` 个历史人工智能里程碑映射到相同的三相棘轮，既诊断了历史寒冬，又通过亚毫焦耳数字酶（比自然语言代理切换快 `78,855x` 且物理分流 `measured_j` 低 `75,374x`）统一了十个竞争范式孤岛：在每孤立单一范式停滞于或低于 `49%`（`48%` 单模型，`49%` 三代理辩论）的 `100` 任务五体制基准中，立即的十阵营数字酶合成达到 `98 / 100`（`98.0%`），伴随 `1%` 虚假提交和 `9.26x` 至 `26.87x` 更高的物理轨每焦耳相干性，锚定了一个可证伪的月、季度、年度和十年向下编译蓝图。在 18 种神经接口模态和 16 项主要细胞外囊泡研究中，在复制的临床前动物拯救与未验证的人类临床疗效之间强制实施严格分离。

<div id="terms-and-acronyms" class="anchor-alias" aria-hidden="true"></div>

### 术语和首字母缩略词

<ul id="terms">
<li>AD、ADSC、AHL、AI、AIP、AKI、AMP、API、APP、ASIC、AST、ATP：阿尔茨海默病、脂肪来源干细胞、酰基高丝氨酸内酯、人工智能、自诱导肽、急性肾损伤、腺苷一磷酸、应用程序编程接口、淀粉样前体蛋白、专用集成电路、抽象语法树和腺苷三磷酸</li>
<li>BBB、BBI、BCE、BCI、BCIs、BLAKE3、BM、BMI、BMSC、BMSCs、BOLD、BTBR：血脑屏障、脑对脑接口、公元前（Before Common Era）、脑-计算机接口（brain-computer interface(s)）、加密哈希函数 BLAKE3、Brain-Modality 目录前缀、脑-机接口（brain-machine interface）、骨髓间充质干细胞（bone marrow mesenchymal stem cell(s)）、血氧水平依赖信号，以及 Black and Tan Brachyury 近交小鼠品系</li>
<li>BM01、BM02、BM03、BM04、BM05、BM06、BM07、BM08、BM09、BM10、BM11、BM12、BM13、BM14、BM15、BM16、BM17、BM18：神经与旁分泌接口目录标识符（`openie-research-experiments/communication-avalanche/catalogs/bci-sensing-modulation-matrix.csv`）</li>
<li>CA、CA1、CCE、CE、CI、CIS、CL、CNS、COX2、CPU、CRC、CT、CTA、CpJ：通信雪崩模型与假说前缀（`CA-M1` 至 `CA-M5`、`CA-H1` 至 `CA-H8`）、海马角回1区、累积文化演化、公元纪年、持续集成、连续交错采样、通信阶梯目录前缀、中枢神经系统、环氧合酶-2、中央处理器、循环冗余校验（`CRC`）、计算机断层扫描、通信工具雪崩（`CTA-T1` 至 `CTA-T45`）以及每焦耳相干性</li>
<li>CL01、CL02、CL03、CL04、CL05、CL06、CL07、CL08、CL09、CL10、CL11、CL12、CL13、CL14、CL15、CL16、CL17、CL18、CL19、CL20、CL21、CL22、CL23、CL24：进化通信阶梯目录标识符（`openie-research-experiments/communication-avalanche/catalogs/evolutionary-communication-ladder.csv`）</li>
<li>DAG、DAGs、DBS、DNA、DOI、DPSC：有向无环图、脑深部电刺激、脱氧核糖核酸、数字对象标识符，以及牙髓干细胞</li>
<li>ECoG、EEG、EOD、ESC、ESCs、ESCRT、EV、EVs：皮层脑电图、脑电图、电器官放电、胚胎干细胞、运输所需内体分选复合体、细胞外囊泡</li>
<li>EV01、EV02、EV03、EV04、EV05、EV06、EV07、EV08、EV09、EV10、EV11、EV12、EV13、EV14、EV15、EV16：分泌组与细胞外囊泡原始研究标识符（`openie-research-experiments/communication-avalanche/catalogs/secretome-ev-evidence-ledger.csv`）</li>
<li>FDA、FLOPs、FP16、FT：美国食品药品监督管理局、浮点运算次数、16位浮点格式，以及单链路容错</li>
<li>GABA、GABARB1、GMP、GPCR、GPU、GSH、GST、GSTM2：γ-氨基丁酸、GABA B型受体亚基1、药品生产质量管理规范、G蛋白偶联受体、图形处理器、还原型谷胱甘肽、谷胱甘肽S-转移酶，以及谷胱甘肽S-转移酶μ2</li>
<li>ICMS、IDE、IDO、IFN、IL、INT4、IP3、ISA、ITR：皮层内微刺激、研究性器械豁免、吲哚胺 2,3-双加氧酶、干扰素、白细胞介素、4 位整数格式、1,4,5-三磷酸肌醇、指令集架构和信息传输速率</li>
<li>JASN、JMLR、JSON：美国肾脏病学会会刊（Journal of the American Society of Nephrology）、《机器学习研究杂志》（Journal of Machine Learning Research）和 JavaScript 对象表示法（JavaScript Object Notation）</li>
<li>KV、KV260：键值（KV）注意力缓存和 AMD Xilinx Kria KV260 视觉开发板</li>
<li>LCC、LLM、LLMs、LPS、LUCA、LUT、LUT6：最大连通分量、大语言模型、脂多糖、末次通用共同祖先、布尔查找表，以及 6 输入布尔查找表 `[same house]`</li>
<li>M1、MACs、MCAO、MD、MEF、MEFs、MEG、ML、MR、MSC、MSCs、MST、MV、MVs、MoE：初级运动皮层、乘累加运算、大脑中动脉闭塞、平均最短路径距离、小鼠胚胎成纤维细胞、脑磁图、机器学习、磁共振、间充质干细胞、最小生成树、微囊泡和专家混合模型（Mixture of Experts）</li>
<li>NAD、NLRP3、NMDA、NSC、NSCs、NVMe：烟酰胺腺嘌呤二核苷酸、含 NACHT、LRR 和 PYD 结构域蛋白 3（NOD-like receptor family pyrin domain containing 3）、N-甲基-D-天冬氨酸、神经干细胞、非易失性内存快速通道（Non-Volatile Memory Express）</li>
<li>OD、ODE、OPM、ORF、ORFs：起讫点（OD）对、常微分方程、光泵磁力计和开放阅读框</li>
<li>PD、PDE、PGC、PMC、PMCID、PMID、PMU、PNAS、POLIS、PRIMA、PRIME、PS1：帕金森病、磷酸二酯酶、过氧化物酶体增殖物激活受体 γ 共激活因子、PubMed Central、PubMed Central 标识符、PubMed 标识符、性能监控单元、美国国家科学院院刊、群体协同学习与推断学会（Population Orchestrated Learning and Inference Society）、光伏视网膜植入微阵列、精准机器人植入脑机接口试验，以及早老素 1</li>
<li>RAPL、RCT、RGECO1、RK4、RL、RNA、RNase、ROS、RVG：运行平均功率限制、随机对照试验、红色遗传编码钙指示剂 1、四阶龙格-库塔积分器、强化学习、核糖核酸、核糖核酸酶、活性氧和狂犬病病毒糖蛋白肽</li>
<li>S1、SA、SHA、SHED、SLOC、SNR、SSP、SSVEP、STN、SWITCH：初级体感皮层、衰老相关（如 SA-beta-galactosidase 中的 SA）、安全哈希算法、人脱落乳牙干细胞、源代码行数、信噪比、连续最短路径最小费用流算法、稳态视觉诱发电位、丘脑底核，以及 Stentrode With Thought-Controlled Digital Switch 研究</li>
<li>TBI、TCP、TL、TLS、TMS、TNF：创伤性脑损伤、传输控制协议、总归一化网络长度、传输层安全协议、经颅磁刺激和肿瘤坏死因子</li>
<li>VGCC, VGCCs, SoC, INA260：电压门控钙通道、片上系统和德州仪器INA260在线功率传感器</li>
<li>aDBS, cAMP, cDBS, cGMP, eNAMPT, fNIRS, hNSC, hiPSC, mRNA, mTOR, miRNA, sEV, sEVs, tACS, tDCS, tFUS：自适应深脑刺激、环磷酸腺苷、常规连续深脑刺激、环磷酸鸟苷、细胞外烟酰胺磷酸核糖转移酶、功能性近红外光谱、人神经干细胞、人诱导多能干细胞、信使RNA、雷帕霉素机制靶点、微RNA、小细胞外囊泡、经颅交流电刺激、经颅直流电刺激和经颅聚焦超声</li>
<li>AI01, AI02, AI03, AI04, AI05, AI06, AI07, AI08, AI09, AI10, AI11, AI12, AI13, AI14, AI15, AI16, AI17, AI18, AI19, AI20, AI21, AI22, AI23, AI24, AI25, AI26, AI27, AI28, AI29, AI30, AI31, AI32, AI33, AI34, AI35, AI36, AI37, AI38：1950-2026人工智能棘轮里程碑标识符（`openie-research-experiments/communication-avalanche/catalogs/ai-history-ratchet-1950-2026.csv`）</li>
<li>AR, AUROC, CEC, CF, CNF, CoT, CVE, CVPR：代数规则、受试者工作特征曲线下面积、恒定误差轮、确定性因子、合取范式、思维链、常见漏洞与暴露以及IEEE/CVF计算机视觉与模式识别会议</li>
<li>DD, DENDRAL, DES, DNULLMM1, DQN, DSP48E2：演绎数据库、树突算法专家质谱系统、数字酶促合成（`DES-10`）、确定性空二进制内存映射存储格式v1、深度Q网络和AMD UltraScale+ 48位数字信号处理片</li>
<li>EBM, EC, EFD_CLOEXEC, EMA, FPGA, GAN, GPT, GRPO：基于能量的模型、嵌入式控制器、Linux关闭时执行事件文件描述符标志、指数移动平均、可现场编程门阵列、生成对抗网络、生成式预训练变换器和群相对策略优化</li>
<li>HBM, HD01, HD02, HD03, HD04, HM01, HM02, HM03, HM04, HQ01, HQ02, HQ03, HQ04, HY01, HY02, HY03, HY04, HY05, HY06：高带宽内存和十年（`HD01`-`HD04`）、月（`HM01`-`HM04`）、季度（`HQ01`-`HQ04`）和年（`HY01`-`HY06`）酶促视界路线图标识符（`openie-research-experiments/communication-avalanche/catalogs/enzymatic-horizon-roadmap.csv`）</li>
<li>ICLR, ICML, IJCAI, ILSVRC, INA238, INA3221, IPA, IPL, IR, JEPA, I-JEPA：国际学习表征会议、国际机器学习会议、国际人工智能联合会议、ImageNet大规模视觉识别挑战、德州仪器在线功率监视器（`INA238`、`INA3221`）、不变点注意力、信息处理语言、中间表示、联合嵌入预测架构和基于图像的联合嵌入预测架构</li>
<li>KKT、KL、KS、KSs、LNCS、LSTM、MAXIM、MCP、MCTS、MGU、MIPS、MPNN、MSA、MSE、MYCIN：Karush-Kuhn-Tucker 最优性条件、Kullback-Leibler 散度、Hearsay-II 知识来源（们）、Lecture Notes in Computer Science、长短期记忆、Dallas/Maxim 1-Wire 循环冗余多项式（`CRC-8/MAXIM`）、模型上下文协议、蒙特卡罗树搜索、最一般统一子句、最大内积搜索、消息传递神经网络、多序列比对、均方误差，以及抗菌生成规则专家系统（`MYCIN`）</li>
<li>NL、NLP、OEM、OS、PET、PMLR、POSIX、PPO、RAG、RAMB36E2、RCE、RPC、ReAct、ReLU、ResNet、RFC、RLHF、RNN、RTL、SATB、SE、SMT、SOM、SSM、SVM、TD、UCT、URI、URIs、USD、VC、WNS、XOR、pLDDT：自然语言、自然语言处理、原始设备制造商、操作系统、正电子发射断层扫描、Proceedings of Machine Learning Research、可移植操作系统接口、近端策略优化、检索增强生成、AMD UltraScale+ 36-Kilobit Block RAM 原语、Reality Code Engine、远程过程调用、Reasoning and Acting 循环、修正线性单元、深度残差网络、Request for Comments、来自人类反馈的强化学习、循环神经网络、寄存器-传输级、沙箱代理测试平台、特殊欧氏群（`SE(3)`）、可满足性模理论、系统级模块、结构化状态空间模型、支持向量机、时序差分学习、树的上限置信界、统一资源标识符（们）、United States dollars、Vapnik-Chervonenkis 维度、最坏负松弛、异或谓词，以及预测局部距离差异测试</li>
<li>AGX、CAN、CRT、CUDA、DC、DE10、FD、FSM、LRU、MDP、MSS、NVIDIA、NVML、PID、PPT、RUSAGE_INFO_V6、RTX、SAT、TI、UCB1、VDD、VDD_CPU_SOC、VDD_CPU_SOC_MSS、VDD_GPU、VIN、VIN_SYS_5V0、XNU：Autonomous-Grade Compute 模块系列、控制器局域网络、华氏剩余定理、统一计算设备架构、直流、电数字酶 10-camp 二进制帧魔术头、有限域约束求解器、有限状态机、最近最少使用缓存策略、马尔可夫决策过程、内存子系统、加速计算硬件供应商 NVIDIA、NVIDIA Management Library、进程标识符、功耗跟踪、Darwin Resource Usage Info v6 结构体、Ray Tracing Texel eXtreme、布尔可满足性、Texas Instruments、上限置信界 1、电压漏-漏供电轨、Tegra CPU/SoC 供电轨、Tegra CPU/SoC/内存供电轨、Tegra GPU 供电轨、板卡电压-输入轨、5 伏系统输入轨，以及 Darwin X is Not Unix kernel</li>
</ul>

<div id="measurement-and-evidence-class-ledger" class="anchor-alias" aria-hidden="true"></div>

### 测量与证据类别台账

**路线图。** 第 1 节定义守恒的三阶段外部化算子和每焦耳相干性（`CpJ`）。第 2 节审查 38 亿年的生物进化阶梯（`CL01` 至 `CL06`）。第 3 节考察跨物种的刺激协同（stigmergy）、拓扑群集、菌根证据与引文偏倚批判（`CL07` 至 `CL13`），以及预注册模型 `CA-M1` 至 `CA-M5`。第 4 节追溯人类文化棘轮、延展心智、稀疏 `MoE` 基础模型和人机混合文化传递（`CL14` 至 `CL19`）。第 5 节介绍事件驱动的可证明编排栈、60 项代码修复基准（`CTA-E1` 至 `CTA-E3`）、五主机跨硅片能量审计（包括物理 Tegra 直流轨分流器，`CTA-E4`），以及 100 项十范式基准（`CTA-E5`、`CL20`）。第 6 节形式化十个孤立 AI 阵营（`C1` 至 `C10`）之间的数字酶促工程，5 环向下编译强制机制，以及 `月 / 季 / 年 / 十年` 路线图（`HM01` 至 `HD04`）。第 7 节详述全部 45 个 Lean 4.36.0 定理（`CTA-T1` 至 `CTA-T45`）。第 8 节梳理 18 种 `BCI` 与旁分泌模式（`BM01` 至 `BM18`）以及 16 项主要分泌组/`EV` 研究（`EV01` 至 `EV16`）。第 9 节登记十项可证伪假设（`CA-H1` 至 `CA-H10`）、明确的范围限制和结语不变量。开放界面工程的配套专著（[热力学界限与最优节奏](/papers/agency/)，阐述 OpenIE 作者提出的拟议代理普适定律；[计量提交门控](/papers/gates/)；[确定性空模型](/papers/deterministic-null/)；以及[向下 LUT6 编译](/papers/lut-adapt/)）仅出于架构连续性而以 `[same house]` 标记引用 [44]。

理论性、形式化（`CTA-T1` 至 `CTA-T45`）和生物物理模型（`CA-M1` 至 `CA-M5`）章节不包含任何硬件功率声明。相比之下，第 5 节（`CTA-E4` 与 `CTA-E5`）记录了 `NVIDIA Jetson AGX Thor`（`board_metered = true`）上的板级 `measured_j` 数据，来源为德州仪器 `INA238`（`VIN`）和三通道 `INA3221`（`VDD_CPU_SOC_MSS`）电流分流器。这些数据与四主机 `RAPL`、`kqueue`/`ri_energy_nj` 和 `NVML` 的 `reported_j`（`CTA-E1` 至 `CTA-E5`）以及解析性 `est_j` 投影严格区分。每项声明均附有明确的证据类别标签：

| 标签 | 证据类别 | 本研究中的操作边界 |
| :--- | :--- | :--- |
| **`[E]`** | **已确立的实证科学** | 微生物学、进化细胞生物学、动物集体行为、认知科学或人类临床神经技术中经过复现的同行评议研究结果，并附有经核验的 `DOI` 或 `PMID` 标识符。 |
| **`[T]`** | **经内核检验的形式定理** | 在 `Lean 4.36.0` 中机械证明（`QuorumRatchet.lean`、`OrchestrationFlow.lean` 与 `EnzymaticSynthesis.lean`，共 `45` 条定理，编号 `CTA-T1` 至 `CTA-T45`，`0` 个 `sorry`，`0` 条自定义公理）。仅证明所述形式结构的演绎有效性，从不证明未经测量的物理主张。 |
| **`[M]`** | **确定性计算模型** | 依据预注册配置 `PREREG_cta_models.json`（`SHA-256: 475a89e3...ac9fa`，固定随机种子 `20261123`），在 `CA-M1` 至 `CA-M5` 上执行。 |
| **`measured_j` / `reported_j` / `est_j`** | **物理分流器、硬件计数器或解析能量** | 物理 `TI INA238` / `INA3221` 直流分流器电源轨（`Jetson AGX Thor` 上的 `measured_j`，`CTA-E4`/`CTA-E5`），`CPU`/`SoC`/`GPU` 计数器（`RAPL`、`ri_energy_nj`、`NVML` 的 `reported_j`，`CTA-E1`-`CTA-E5`），以及解析查表界限（`est_j`）。三者严格分列保存，从不相加。 |
| **`[S]`** | **推测性假说** | 未经验证的工程或临床前景，包括 `N` 维心智语义 `BCI` 桥接，以及超出动物或类器官模型的人类神经退行性分泌组/囊泡疗效。 |

---

<div id="1-thesis-and-the-conserved-externalize-ingest-transform-operator" class="anchor-alias" aria-hidden="true"></div>

## 1. 论题与守恒的外部化-摄取-转化算子

在生物进化、文化历史和分布式计算中，孤立主体的能力在集体任务复杂性饱和之前很久就会遇到陡峭的代谢和热力学收益递减。反复解锁超线性能力的是**通信工具雪崩**：一种守恒的三相算子，其中主体将内部状态写入外部物理基质，相邻主体仅在激活阈值和有效性门控满足时选择性地摄取该基质，而摄取的信号转化接收者状态同时保留先前已验证的增益（`图 1`）。

设一个由 $N$ 个主体组成的人群携带局部状态 $s_i(t) \in \mathcal{S}$（$i \in \{1,\dots,N\}$），这些状态耦合到一个共享的物理或数字介质 $\mathcal{M}$。雪崩的每一级均实例化三个映射（`[T]`，在 `Avalanche.QuorumRatchet.CycleOperator` 中形式化）：

1. **外部化 ($\mathcal{E} : \mathcal{S} \to \Sigma$)**：主体 $i$ 消耗有界的信令能量 $e_{\text{ext}} > 0$，向 $\mathcal{M}$ 发射一个结构化的物理人工制品或分组 $m = \mathcal{E}(s_i)$（一个酰基高丝氨酸内酯分子、一个黏液鞘、一个声学轮廓、一道印刷方程，或一个 `BLAKE3`-哈希、`Ed25519`-签名的信道载荷）。
2. **阈值化和门控摄取 ($\mathcal{G} : \mathcal{S} \times \Sigma^* \to \{0,1\}$)**：接收者 $j$ 累积加权传入信号 $A_j = \sum_k w_{kj}\,m_k$，并且当且仅当 $A_j \ge \theta_j$ 且受体/验证器特异性 $V_j(m_k) = 1$ 成立时才触发：
   $$s_j(t + 1) = \begin{cases} \mathcal{T}\!\left(s_j(t),\, \{m_k\}\right) & \text{if } \sum_k w_{kj}\,\mathbb{I}[V_j(m_k)=1] \ge \theta_j, \\ s_j(t) & \text{otherwise.} \end{cases}$$
   亚阈值到达（$A_j < \theta_j$）和未验证载荷（$V_j(m_k) = 0$）触发零下游状态转移（`CTA-T7`、`CTA-T8`、`CTA-T17`、`CTA-T18`）。
3. **棘轮转化与向下结晶 ($\mathcal{T} : \mathcal{S} \times \Sigma^* \to \mathcal{S}$)**：被接受的信号同时更新集体协调与个体能力。当已验证的人工制品以质量非退化 $Q(s_j(t+1)) \ge Q(s_j(t))$ 持久存在于 $\mathcal{M}$ 中时，高能量的探索性发现就成为后续世代低成本的可重用模板（`CTA-T5`、`CTA-T6`、`CTA-T23`）。

没有选择性门 $V_j$ 时，具有每跳保真度 $f \in (0, 1)$ 的 $k$ 跳中继链会呈指数衰减为 $f^k$（`CTA-T2`），且加性噪声 $\epsilon > 0$ 会线性增长为 $k\epsilon$（`CTA-T1`）。在使用可靠的验证门并持久外部化存储的情况下，质量会成为单调非递减的棘轮（`CTA-T5`）。为在相同基准上比较生物基质和硅基质的协同架构，设 $Q \ge 0$ 表示经任务验证的相干输出（例如经测试验证的缺陷修复、保留的代谢活性或无错误的传输比特），并设 $E_{\text{total}} = E_{\text{compute}} + E_{\text{comm}} + E_{\text{idle}} > 0$ 表示总耗能。**每焦耳相干性** 定义为：

$$\mathrm{CpJ} = \frac{Q}{E_{\text{compute}} + E_{\text{comm}} + E_{\text{idle}}}\;\; \left[\text{verified coherence units} \cdot \mathrm{J}^{-1}\right].$$

原始组件计数（`5,570` 细菌开放阅读框、$8.6 \times 10^{10}$ 人类神经元，或 $2 \times 10^{12}$ 前沿神经网络权重）仅设定了上限容量包络；实际 $\mathrm{CpJ}$ 受通信通道是否阈值化、事件驱动以及是否对下游错误级联进行门控（`CTA-T19` 到 `CTA-T23`）所支配。

<figure class="my-8">
  <img src="/figures/communication-avalanche/biological-to-bci-avalanche.svg" alt="暗色主题综合图，展示带 A（保守的 Externalize-Gate-Transform 操作符及从 3.8 Ga EV 到 N-mind BCI 的 24 级时间线）、带 B（预登记模型 CA-M1 至 CA-M5 的经验曲线）和带 C（四阶段神经与旁分泌接口演进）。" />
  <figcaption>图 1. 保守的外部化-摄取-棘轮环路跨越 24 级进化目录（<code>CL01</code> 到 <code>CL24</code>），预登记模拟输出（<code>CA-M1</code> 到 <code>CA-M5</code>，<code>seed = 20261123</code>，<code>board_metered = false</code>），以及已建立临床神经技术（<code>[E]</code>）与投机性多脑桥接（<code>[S]</code>）之间的边界。</figcaption>
</figure>

---

<div id="2-the-38-billion-year-biological-escalation-ladder-cl01-to-cl06" class="anchor-alias" aria-hidden="true"></div>

## 2. 38亿年生物升级阶梯（`CL01` 至 `CL06`）

目录 `openie-research-experiments/communication-avalanche/catalogs/evolutionary-communication-ladder.csv`（`CL01` 至 `CL24`）记录了 24 个进化、文化、计算与神经技术层级，并明确给出了各层级的底层载体、受体门控、测量尺度与证伪条件。六个奠基性生物学转变（`CL01` 至 `CL06`）表明，多细胞化主要是在基本保守的胞内机制之上，通过创新**细胞间通信与封闭性门控**而实现的（`[E]`）：

| 层级 | 大致年代 | 生物系统 | 外化底物与受体门控 | 实测基因组或生理尺度 | 证伪判据 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`CL01`** | `~3.8 Ga`（前`LUCA`候选） | 三域膜泡（`EVs`） | `20-400 nm`脂双层小包，携带`RNA`、蛋白质和代谢物；经内吞或融合摄取 [25] | 在细菌、古菌和真核生物中保守；保护不稳定的货物免受胞外核酸酶/蛋白酶降解 | 在基础古菌与细菌类群中缺乏保守的囊泡形成生物物理机制 |
| **`CL02`** | `~3.5 Ga` | 细菌群体感应（*Vibrio fischeri*、*Pseudomonas aeruginosa*） | 可扩散的`AHL`/`AIP`自诱导素，与`LuxR`/`LasR`/`RhlR`或`LuxPQ`结合，协同Hill指数$n_H \ge 2$ [37, 42] | 在*P. aeruginosa*中调控`>300`至`~600`个（约`~5,570`个`ORFs`中的`~6%-10%`，即基因组的`~6%-10%`）`ORFs` [37] | 在低密度平流冲刷条件下，组成型胞外产物分泌者胜过受群体感应调控的野生型 |
| **`CL03`** | `~3.43至2.6 Ga` | 丝状蓝细菌（*Anabaena*/*Nostoc*；太古宙叠层石） | 通过`SepJ`、`FraC`/`FraD`和`SepI`纳米孔阵列进行胞质蔗糖/谷氨酸交换，并由`Ca2+`触发塞子/帽闭合 [1, 24, 49] | 在约`~100`个细胞的固氮丝状体中，有`~15 nm`门控通道；受胁迫细胞可在数秒内被封闭 [49] | 锁定开放的`SepJ`/`FraCD`塞子突变体，在单细胞裂解后未表现出多细胞丝状体的额外死亡 |
| **`CL04`** | `~1.0至0.6 Ga` | 社会性变形虫聚集（*Dictyostelium discoideum*） | 螺旋状胞外`cAMP`脉冲（周期约`~6 min`），由具有不应期适应的`cAR1-cAR4` `GPCRs`感知 [19, 26] | 聚集$10^4$至$10^5$个细胞；发育必需基因中约`~80%`（`76%-84%`）为古老基因，而新出现的约`~20%`富集分泌型和跨膜型传感器 [26] | 清除胞外`cAMP`接力和细胞黏附识别后，子实体形态发生仍保持完整 |
| **`CL05`** | `~0.8至0.6 Ga` | 群体领鞭毛虫（*Choanoeca flexa*、*Salpingoeca rosetta*） | 视紫红质-`cGMP`收缩性 [8]，以及由`VGCC`介导的群体`Ca2+`瞬变（`RGECO1`成像） [15] | 在真正的神经元出现之前，同步`10`至`500`个领细胞的纤毛停止运动和顶-基翻转 | 遗传或药理学阻断`VGCC`后，群体范围的同步纤毛停止和去极化仍然保留 |
| **`CL06`** | `~0.54 Ga`（寒武纪） | 早期后生动物/刺胞动物及脊索动物缝隙连接 | 通过趋同的innexin/pannexin及脊索动物connexin半通道实现直接离子耦合以及`<1 kDa`的`IP3`/`cAMP`耦合 [45] | 组织尺度的上皮和神经肌肉片层（$10^5$至$10^{11}$个细胞），受电压、`pH`和损伤`Ca2+`门控 | 高`Ca2+`连接处去耦联功能丧失后，旁观细胞的代谢崩溃不再沿耦联上皮传播 |

以下三条定量结论直接来自原始生物学记录（`[E]`）：

1. **阈值公共品门控（`CL02`）**：首先由 Nealson、Platt 和 Hastings 通过 *Vibrio fischeri* 生物发光的自诱导作用表征（1970、1979 年）[42]，并由 Miller 和 Bassler（2001 年）[37] 在革兰氏阴性和革兰氏阳性电路中进行了调查，群体感应在胞外自诱导物浓度跨越合作解离阈值 $K$ 之前，会抑制代谢代价高昂的分泌毒力因子、铁载体、弹性蛋白酶和生物膜。Schuster 等人（2003 年）[37] 在 *Pseudomonas aeruginosa* 中的微阵列转录组学研究表明，有 `315` 至 `>500` 个基因（约占其 `~5,570` 个 `ORF` 的 `~6%` 至 `10%`）受 `LasR`/`RhlR` 酰基高丝氨酸内酯级联调控。细胞并非轮询中央时钟，而是局部整合化学浓度梯度。

2. **物理电路断路器使多细胞共享得以存活（`CL03`、`CL06`）**：在细胞间共享细胞质会产生直接脆弱性：局部捕食或膜破裂将耗尽整个丝状体，除非连接在损伤时关闭。早期太古宙叠层石礁（`~3.43 Ga`，Allwood 等人 2006 年）[1] 证明了古代微生物垫的组织，而 Weiss 等人（2019 年）[49] 对 *Anabaena* 隔膜连接的冷冻电子断层扫描，以及 `SepJ` 和 `SepI` 的分裂体/隔膜表征（Flores 等人 2018 年；Springstein 等人 2020 年）[24] 揭示了一种蛋白质纳米孔管-帽-塞组件，其功能上与后生动物的 pannexin/connexin 间隙连接趋同（Panchin 等人 2000 年）[45]。应激或离子载体诱导的 `Ca2+` 内流会重排帽-塞模块以可逆地封闭孔道，从而隔离裂解细胞，同时在完整邻近细胞间保留固氮异形胞代谢物交换（`CTA-T15`）。

3. **多细胞性复用胞内计算并发明外部化输入/输出（`CL04`、`CL05`）**：对 *Dictyostelium discoideum*（`~12,500` 个基因，Eichinger 等人 2005 年）[19] 的测序以及对所有主要网柄菌纲分支的基因组比较（Glockner 等人 2016 年）[26] 显示，大约 `80%` 的发育必需基因在孤独变形虫亲缘中先于多细胞性存在；谱系特异的 `~20%` 则高度富集于分泌型和跨膜识别/信号蛋白。同样，在领鞭毛虫（动物最近的单细胞和群体姐妹群）中，Brunet 等人（2019 年）[8] 在 *Choanoeca flexa* 中发现了光调控的集体片状反转，而 Colgren 和 Burkhardt（2025 年）[15] 在 *Salpingoeca rosetta* 中证明，电压门控钙通道（`VGCCs`）在突触进化出现之前即可传播群体范围的电/钙波，协调同步纤毛停滞和收缩。

<figure class="my-8">
  <img src="/figures/communication-avalanche/three-phase-ratchet-anatomy.svg" alt="四行微观解剖比较保守的 Externalize、Threshold-and-Gate Ingest 和 Non-Regressing Ratchet Transform 阶段在细菌/蓝绿菌、动物信息素/群体、 人类文化以及已证实的数字/神经基质中的差异。" />
  <figcaption><strong>图 2.</strong> 保守的三相算子 $(\mathcal{E}, \mathcal{G}, \mathcal{T})$ 在四类基质中的微观解剖：微生物群体感应及 <code>SepJ</code> 纳米孔门控、非神经/动物场协调、人类外部账本以及加密证实的多器官软件和可选神经桥接。</figcaption>
</figure>

---

<div id="3-cross-species-stigmergy-mycorrhizal-critique-and-executed-models-ca-m1-to-ca-m5" class="anchor-alias" aria-hidden="true"></div>

## 3. 跨物种刺激协作（Stigmergy）、菌根批判与已执行模型（`CA-M1` 至 `CA-M5`）

<div id="31-cross-species-decentralized-coordination-and-candid-evidence-boundaries-cl07-to-cl13" class="anchor-alias" aria-hidden="true"></div>

### 3.1 跨物种去中心化协调与审慎的证据边界（`CL07` 至 `CL13`）

除组织连接之外，自由运动的生物体还会将空间与运动学状态直接外化到环境场中（`[E]`）：

* **群聚信息素与原质团外部化记忆（`CL08`，`CL10`）**：Grasse (1959) 和 Theraulaz 与 Bonabeau (1999) [27] 在社会性昆虫（*Bellicositermes*、*Cubitermes*）中证明，建筑本身即为通信信道：工蚁对局部浸有信息素的土壤曲率作出响应，而无需蓝图。在无神经合胞体黏菌 *Physarum polycephalum* 中，Nakagaki、Yamada 和 Toth (2000) [40] 展示了最短路径迷宫求解，Tero 等 (2010) [40] 表明适应性 Poiseuille 原生质管在成本、运输效率和容错性上与东京铁路网相当，而 Reid 等 (2012) [40] 证明 *Physarum* 会沉积细胞外非活黏液垫，作为外部化空间记忆以逃脱 U 形陷阱，若置于预涂黏液的琼脂上则失效。
* **符号矢量舞蹈、拓扑集群、特征哨声与集体电感知（`CL09`，`CL11`，`CL12`，`CL13`）**：蜜蜂（*Apis mellifera*）将花源距离和太阳方位编码为摇摆舞持续时间与角度（von Frisch 1967）[48]。Ballerini 等 (2008) [3] 和 Cavagna 等 (2010) [11] 对椋鸟（*Sturnus vulgaris*）群飞的三维立体重建揭示，每只鸟跟踪一个 **拓扑** 邻域，即 `k ~ 6 to 7` 个最近邻居，与集群密度无关，从而产生无标度速度涨落关联，其关联长度随集群尺度线性增长（$\xi \propto L$，$\xi / L \approx 0.35$）。宽吻海豚（*Tursiops truncatus*）广播并声学复制个体化的调频特征哨声，这些哨声作为指称性身份标签独立于嗓音音色（Caldwell 和 Caldwell 1965；Janik 和 Sayigh 2013）[10, 30]。集群鱼类将 `<10 ms` 侧线流体力学耦合（Partridge 和 Pitcher 1980）与集体主动感知相结合：Pedraja 和 Sawtell (2024) [46] 在弱电鱼 *Gnathonemus petersii* 中证明，同种鱼的电器官放电（`EODs`）可照亮阴影物体，并将电定位范围扩展两至三倍。
* **菌根真菌转移与母树过度诠释（`CL07`）**：Simard 等 (1997) [48] 在野外采用互惠 $^{13}\mathrm{C}$ 和 $^{14}\mathrm{C}$ 脉冲标记，证明 *Betula papyrifera* 与 *Pseudotsuga menziesii* 幼苗间通过外生菌根菌丝实现双向碳转移，且净转移受遮荫调控。然而，科学诚实性要求将该发现与 Karst、Jones 和 Hoeksema (2023) [32] 的系统审计配对，后者遍历林业文献后指出，正向引用偏差和未受控混杂因素（根接、土壤扩散、真菌保有碳保留以及幼苗死亡率）**不** 支持流行的“母树”亲缘利他或目的论预警广播主张。在我们的框架中，菌根转移仍为真实源-汇生物物理耦合（`[E]` 表示菌丝资源通量），而适应性母体信号意图则被归类为未经证实的（`[S]` / 有争议）。

<div id="32-pre-registered-deterministic-model-suite-ca-m1-to-ca-m5-seed--20261123" class="anchor-alias" aria-hidden="true"></div>

### 3.2 预注册确定性模型套件（`CA-M1` 到 `CA-M5`，`seed = 20261123`）

为可复现地测试 Rungs `CL02`、`CL03`、`CL08`、`CL12` 和 `CL19` 的数学机制，`PREREG_cta_models.json`（`SHA-256: 475a89e3fe6157238560ac5876b52791b22a67a9d3260c68111a1b76b89ac9fa`）在执行 `run_cta_models.py`（`seed = 20261123`，`cta_models_results.json` `SHA-256: 54a7b2c177bc063e2536ae487cdb44b372f0ba6281514d8154c34b115b0b7914`）之前已锁定。所有五个预注册通过标准均已成功（`[M]`）：

| 模型 ID | 所建模的生物或文化机制 | 参数扫描（`seed = 20261123`） | 关键定量结果（`cta_models_results.json`） | 预注册结论 |
| :--- | :--- | :--- | :--- | :--- |
| **`CA-M1`** | 合作希尔群体感应开关（`600 / 5,000` 个基因；分泌的公共品成本为持家基因的 `3x`） | `13` 种密度 $\rho/\rho_K \in [0.05, 4.0]$ $\times$ `3` 种扩散损失 $\times$ $n_H \in \{1, 2, 4\}$ + `2,000` 次噪声试验（$\bar{A}/K = 0.25$，$\sigma = 0.25\,K$） | 在 $\rho/\rho_K = 0.20$ 时：调控子 `ATP` 节约 `95.49%`（$n_H = 2$）和 `99.17%`（$n_H = 4$）（全细胞 `ATP` 分别节约 `27.72%` 和 `28.79%`）；过早噪声激发从 `51.90%`（$n_H=1$）$\to$ `17.75%`（$n_H=2$，`2.92x`）$\to$ `4.45%`（$n_H=4$，`11.66x`） | **通过**（`>= 70%` 节约；`>= 2.0x` 噪声抑制） |
| **`CA-M2`** | `20` 个细胞的蓝细菌丝状体，在细胞 `0` 裂解后具有 `Ca2+` 门控的 `SepJ` 纳米孔 | `RK4`（`dt = 0.002 s`，`20.0 s` 时域）跨越 $\tau_{\text{close}} \in \{0.05, 0.15, 0.30, 0.60, 1.20, 2.50, 5.00\}\text{ s}$ 与无门控比较 | $\tau_{\text{close}} = 0.05\text{ s}$ 保留 `19 / 20`（`95.0%`）存活细胞和 `87.56%` 代谢池（`0.15-0.30 s` 时为 `90.0%`；`1.20 s` 时为 `80.0%`；`5.00 s` 时为 `25.0%`）；无门控孔塌陷至 `0 / 20`（`0.0%` 存活，`14.28%` 代谢池） | **通过**（`>= 90%` 快速门控 vs `<= 10%` 无门控） |
| **`CA-M3`** | 三维拓扑 $k = 7$ 群相对于固定度量半径 $R_0$ 群在捕食者攻击和 `4x` 径向扩张下的表现 | $N \in \{64, 128, 256, 512\}$，每个 $(N, \text{rule})$ 有 `8` 次三维试验，`64x` 体积扩张 | 拓扑 $k = 7$ 在所有 $N$ 下保持 `100.0%` 单组分 `LCC` 凝聚力（`1.0` 个组分，极化度 `0.976-0.986`，平均 $\xi / L = 0.3689$）；度量 $R_0$ 碎裂为 `57.0` 至 `467.5` 个片段（`LCC` 从 `4.30%` 降至 `0.68%`） | **通过**（`>= 98%` 拓扑 `LCC`；$\xi/L \in [0.25, 0.45]$；度量 `<= 40%`） |
| **`CA-M4`** | *Physarum* 泊肃叶网络 $\dot{D}_{ij} = |Q_{ij}|^\mu / (1 + |Q_{ij}|^\mu) - D_{ij}$ | `8` 节点多路径桥（$\mu \in \{0.6, 1.0, 1.3, 1.8\}$）和 `16` 节点区域 `OD` 网格（$\mu \in [0.8, 2.0]$） | `8` 节点最短路径通量份额从 `42.72%`（$\mu=0.6$）$\to$ `77.05%`（$\mu=1.0$）$\to$ `100.00%`（$\mu=1.3, 1.8$，非最短路径 $D = 0.0$）；`16` 节点 $\mu=1.4$ 修剪 `30 -> 20` 条管道（`TL/MST = 1.3903`，`MD/MST = 0.8252`，`FT = 1.0000`，`FT/TL = 0.7192`） | **通过**（$\mu > 1$ 时 `>= 99%` 最短路径通量） |
| **`CA-M5`** | `20` 代混合棘轮（每代 $N = 32$ 个代理，`30` 个谱系；在 `Gen 5` 移除 `4` 个合成示范者） | 在 `6` 步非近视谷景观上的 `4` 种体制（陷阱 `0.40` vs 全局最优 `1.00`） | `Gen 20` 最优代理份额：`0.00%`（`no_machine_baseline`，得分 `0.3689`），`29.27%`（`unverified_imitation`，得分 `0.6522`），`76.25%`（`prestige_biased_imitation`，得分 `0.9221`），以及 `100.00%`（`attested_externalized_library`，得分 `1.0000`，`30/30` 个谱系） | **通过**（`>= 99%` 经证实的保留；严格优于未验证） |

值得注意的是，`CA-M4` 突出了一个精确的动力学边界：因为 $f(Q) = Q^\mu / (1 + Q^\mu)$ 在 $\mu > 1$ 时于 $Q_{\text{infl}} = ((\mu - 1)/(\mu + 1))^{1/\mu}$ 处存在一个拐点，超线性最短路径选择严格运行在未饱和的生物通量窗口内（$|Q| < Q_{\text{infl}}$）；将源通量过驱动至饱和会使 $f(Q)$ 转变为一个凹形平台，从而保留并行冗余管道。

<figure class="my-8">
  <img src="/figures/communication-avalanche/cross-species-thresholds-infographic.svg" alt="四面板定量汇总，展示预注册模型 CA-M1 至 CA-M5 的希尔群体 ATP 节省、SepJ 丝状体存活与闭合时间常数、三维拓扑 k=7 与度量集群凝聚，以及 Physarum 剪枝加 Gen-20 文化锁定。" />
  <figcaption><strong>图 3。</strong> 来自预注册确定性仿真套件 <code>CA-M1</code> 至 <code>CA-M5</code>（<code>seed = 20261123</code>，<code>SHA-256: 54a7b2c1…</code>）的定量曲线：合作希尔噪声抑制与 <code>ATP</code> 守恒、<code>SepJ</code> 快速孔道封闭、无标度 <code>k = 7</code> 三维集群在 <code>64x</code> 体积膨胀下的凝聚、<em>Physarum</em> 超线性最短路径选择，以及使用经认证人工制品库的 <code>100.0%</code> 移除后文化保留。</figcaption>
</figure>

<div id="worked-example-1-biophysical-threshold-economics--why-a-lone-secreting-bacterium-goes-bankrupt-and-why-sepj-must-seal-in--030-s-ca-m1-ca-m2-cta-t11cta-t15" class="anchor-alias" aria-hidden="true"></div>

### 生物物理阈值经济学，为什么单个分泌细菌会破产以及为什么 `SepJ` 必须在 `<= 0.30 s` 内密封（`CA-M1`，`CA-M2`，`CTA-T11`-`CTA-T15`）

要理解生物外部化为何既需要**协同激活阈值**，也需要**快速故障遏制门控**，请追踪 `CA-M1` 与 `CA-M2` 中执行的精确三磷酸腺苷（`ATP`）及代谢物方程（`seed = 20261123`，`board_metered = false`，`[M]`）：

1. **阶段 1（有界示踪信号外部化与全分泌组成本对比）**：考虑一个模型细菌，具有 `5,000` 个开放阅读框（`ORFs`），其基因组规模与 *Pseudomonas aeruginosa*（约 `~5,570` 个 `ORFs`）相当。`4,400` 个胞内管家代谢基因每个每细胞周期需要 `1.0` 个归一化 `ATP` 单位（共 `4,400.0 ATP`），而 `600` 个群体感应调控基因（占基因组的 `12.0%`：分泌型弹性蛋白酶、铁载体、生物膜胞外多糖或 *Vibrio* 荧光素酶）具有 `3.0x` 的胞外合成与输出成本（`1,800.0 ATP`）。一个无条件表达全部 `5,000` 个基因的组成型突变体，其能量消耗为：
   $$E_{\text{const}} = 4{,}400.0 + 1{,}800.0 = 6{,}200.0\;\text{ATP/cycle},$$
   其全部细胞能量预算的 `29.03%`（`1,800 / 6,200`）被用于输出大分子，而当局部细胞密度 $\rho$ 远低于群体感应阈值 $\rho_K$ 时，这些大分子会因平流冲刷而稀释至功能浓度以下。相比之下，野生型 `LuxI`/`LasI` 只外排一种微小的酰基高丝氨酸内酯（`AHL`）示踪分子，其成本为 $e_{\text{ext}} = 12.0\;\text{ATP/cycle}$（占 $E_{\text{const}}$ 的 `0.19%`）。

2. **阶段 2（亚阈值噪声下的协同 Hill 门控）**：在浮游低密度条件 $\rho / \rho_K = 0.20$ 下（胞外自诱导物比值 $A / K = 0.20$，扩散损失为 `0.50`），理性 Hill 受体开关 $H_{n_H}(A/K) = (A/K)^{n_H} / [1 + (A/K)^{n_H}]$（`CTA-T11` 至 `CTA-T14`）在协同指数 $n_H \in \{1, 2, 4\}$ 下产生截然不同的代谢预算：
   - **单体受体（$n_H = 1$）**：$H_1(0.20) = 0.20 / 1.20 = 1/6 \approx 0.1667$，调控子耗能 $E_{\text{reg}}(1) = 12.0 + 1{,}800 \times (1/6) = 312.0\;\text{ATP}$（总计 `4,712.0 ATP`）。更糟的是，当扩散性微涡流注入亚阈值浓度涨落（$\bar{A}/K = 0.25$，高斯 $\sigma = 0.25\,K$，共 `2,000` 次试验）时，$H_1$ 在 **`51.90%`**（`1,038 / 2,000`）的周期中出现过早的调控子激活（$H_1 > 0.20$）。
   - **协同二聚体（$n_H = 2$，`LuxR` 类）**：$H_2(0.20) = 0.04 / 1.04 = 1/26 \approx 0.03846$，将调控子耗能大幅降至 $E_{\text{reg}}(2) = 12.0 + 69.231 = \mathbf{81.231\;\text{ATP}}$（调控子 `ATP` 节省 **`95.49%`**，全细胞 `ATP` 节省 `27.72%`，总计 `4,481.23 ATP`），并将过早的噪声唤醒降低 `2.92x`，降至 **`17.75%`**。
   - **协同四聚体（$n_H = 4$）**：$H_4(0.20) = 0.0016 / 1.0016 \approx 0.001597$，将调控子耗能降至 $E_{\text{reg}}(4) = 12.0 + 2.875 = \mathbf{14.875\;\text{ATP}}$（调控子 `ATP` 节省 **`99.17%`**，全细胞 `ATP` 节省 `28.79%`，总计 `4,414.88 ATP`），并将误唤醒降低 `11.66x`，降至 **`4.45%`**（`CTA-T13`）。

3. **第3阶段（多细胞 `SepJ` 断路器时序）**：当细胞通过约15 nm的蓝藻隔膜纳米孔直接耦合（`CA-M2`，$L = 20$ 个耦合细胞，采用四阶龙格-库塔法 `RK4`，以 $\Delta t = 0.002\;\text{s}$ 积分，时长 `20.0 s`）时，终端 `cell 0` 在 $t = 0$ 发生膜裂解，形成即时的胞质汇。若由 $\text{Ca}^{2+}$ 触发的 `SepJ` 帽塞关闭在 $\tau_{\text{close}} = 0.05\;\text{s}$ 内完成，`junction (0,1)` 将封闭至开放分数 `0.000`，保留 `cell 1` 代谢物池的 `90.48%`（远端 `cell 19` 为 `93.86%`），并存活 **`19 / 20`（`95.0%`）** 个活细胞（丝状体总容量的 `87.56%`）。当 $\tau_{\text{close}} \in [0.15\;\text{s}, 0.30\;\text{s}]$ 时，`cell 1` 经历急剧的瞬时下降（代谢物从 `17.66%` 降至 `13.19%`），但封闭速度仍足够快，可挽救 **`18 / 20`（`90.0%`）** 个细胞（容量由 `85.11%` 降至 `77.85%`）。关闭时间延长至 `0.30 s` 以上会引发渐进性旁观者细胞崩溃（`1.20 s` 时为 `16 / 20 = 80.0%`；`5.00 s` 时为 `5 / 20 = 25.0%`），而未受控的锁定开放突变体会使整条丝状体降至 **`0 / 20`（`0.0%`）** 个活细胞（残余代谢物池 `14.28%`，`CTA-T15`）。

---

<div id="4-human-cultural-ratchet-extended-mind-machine-culture-and-the-digital-hive-mind-cl14-to-cl19" class="anchor-alias" aria-hidden="true"></div>

## 4. 人类文化棘轮、延展心智、机器文化与数字蜂群心智（`CL14` 至 `CL19`）

人类认知演化在不重写皮层神经元生物物理特性的前提下扩大了集体产出，其途径是逐步降低信号损耗，并使人工制品的寿命与个体寿命脱钩（`[E]`）：

1. **共享意向性、外部化账本与累积文化（`CL14` 至 `CL17`）**：相对于成人大脑约 `20 W` 的功率预算（Balasubramanian 2021）[2]，显性人类行为吞吐量平均约为 `~10 bit/s`（Zheng and Meister 2025）[50]，而跨 `17` 种语言的口语自然语言编码速率约为 `~39 bit/s`（Coupe et al. 2019）[17]。尽管个体的串行瓶颈十分狭窄，共享意向性（Tomasello et al. 2005）与高保真的社会确认仍形成了**文化棘轮**（Tennie, Call, and Tomasello 2009）[48]。社会学与哲学著述将由此产生的宏观结构界定为：集体意识（Durkheim 1893）、智慧圈（noosphere，Teilhard de Chardin 1955）[18]、**延展心智**（extended mind，外部笔记与符号构成认知加工的组成部分，Clark and Chalmers 1998）[14]，以及跨分组交换网络的全球信息素式协调（stigmergic coordination，Heylighen 2007）[28]。书写（`CL15`）、活字印刷与同行评议（`CL16`），以及基于内容寻址的版本控制（`Git` 加自动化 `CI` 闸门，`CL17`），相继取代了有损的口述记忆（$f^k$ 多跳衰减），转而提供持久、可检视的外部记录。

2. **作为数字蜂群心智的稀疏 `MoE` 基础模型（`CL18`）**：前沿神经架构日益将存储参数总量（达到 $1 \times 10^{12}$ 至 $3 \times 10^{12}$ 个参数）与每个 token 的活跃计算量分离开来，其手段是稀疏 `MoE` 的 top-$k$ 路由（Fedus, Zoph, and Shazeer 2022）[21]，使每个 token 仅激活约 `~3%` 至 `12%` 的专家权重。这类似于专化的多细胞分化（硬件分页路由参见 *Downward LUT6 Compilation* [44]，`[same house]`）。原始参数量之于原始细胞数量，而协调路由与验证决定 $\mathrm{CpJ}$。

3. **混合机器-人类文化棘轮与 `POLIS` 社会 (`CL19`)**：Brinkmann 等 (2023) [6] 形式化了**机器文化**，表明智能机器现已充当文化变异生成器、选择器和传播者。关键的是，Brinkmann 等 (2026) [7] 的多代人机实验室实验表明，当深度强化学习代理发现了一种反直觉的非近视策略（`600` 名孤立人类参与者中有 `599` 名未能发现），且在初始世代后**完全移除**机器代理时，基于声望的人类社会学习在 `15` 个混合种群中的 `9` 个（`60%`）中将机器发现的策略保存至最终世代，使这些谱系中每一位最终世代参与者均为被移除机器代理的文化后代（`CA-M5` 同时再现了这种 `~60%-76%` 的声望模仿持久性及其相对于 `100%` 认证人工制品库的拷贝噪声脆弱性）。作为补充，Zhuang (2025) [50] 引入了 `POLIS`（*The Ratchet Effect in Silico*），表明规模为 `1B` 至 `4B` 的 `LLM` 微型社会通过世代循环、同伴验证、共享文化记忆和内化，可获得 `+8.8` 至 `+18.9` 的基准点提升，机制消融实验确认**同伴验证**是主要的防退化棘轮算子。

<div id="44-the-19502026-artificial-intelligence-ratchet-audit-ai01-to-ai38" class="anchor-alias" aria-hidden="true"></div>

### 4.4 1950-2026 人工智能齿轮审计（`AI01` 到 `AI38`）

目录 `openie-research-experiments/communication-avalanche/catalogs/ai-history-ratchet-1950-2026.csv`（`AI01` 到 `AI38`）审计了跨越 76 年（`1950` 到 `2026`）的 38 项基础里程碑，通过将每个系统映射到精确保持的元组 `(externalized_signal_substrate, ingestion_routing_rule, threshold_or_verifier_gate, bottleneck_broken, failure_boundary_or_winter_cause)`（`[E]` 表示已发表的历史里程碑；`[T]`/`[M]` 表示 2026 年的下行编译综合）。从该结构视角审视，机器智能的历史既不是一连串不相关的架构时尚，也不是平滑均匀的密集浮点吞吐曲线。每一次持久的拐点都解锁了 **新的外部化通信通道并配以选择性接纳或保存门**，而 **AI 冬季** 正好出现在外部化状态在缺乏可追溯搜索或可靠验证门的情况下 proliferated：

<figure class="my-8">
  <img src="/figures/communication-avalanche/ai-history-ratchet-1950-2026.svg" alt="七个时代的阶梯式齿轮时间线，从 1950 年的图灵、IPL、感知器、Lisp 到 AI 冬季 I 与 II、反向传播、LSTM、AlphaGo、稀疏 MoE、FunSearch、AlphaGeometry，以及 2026 年的 DES-10 数字酶合成。" />
  <figcaption><strong>图 4.</strong> 七十六年人工智能齿轮审计（<code>AI01</code> 到 <code>AI38</code>，<code>1950-2026</code>）。每一次向上跨越都将外部化表示与选择性阈值或验证门配对；<strong>AI 冬季 I</strong>（<code>1974-1980</code>）和 <strong>AI 冬季 II</strong>（<code>1988-1993</code>）对应于精确的门/摄取失效，其中无指导的 $O(b^d)$ 搜索、非贝叶斯确定因素漂移（<code>CTA-T1</code>、<code>CTA-T2</code>）或梯度消失阻碍了每焦耳相干性。</figcaption>
</figure>

1. **第一时代（`1950-1965` · 符号与阈值起源，`AI01`-`AI06`）**：图灵（1950）[87]以可外部观测的电传令牌通道取代了不可观测的心智主义，开创了该领域（`AI01`）。不过，纯粹的对话不可区分性缺乏内部真值验证器。两年后，香农的机电老鼠 *Theseus*（`1952`，`AI02`）[82]在硅前体硬件中展示了物理层面的痕迹协同：迷宫下方的 `75` 个电话继电器以 `5 × 5` 的结构存储了 `2` 位的最近出口向量，使老鼠能将试错过程中的撞墙事件外部化为 $O(1)$ 的持久空间查找表。纽厄尔与西蒙的 *逻辑理论家*（`1956`，`AI03`）[75]在信息处理语言（`IPL`）中发明了动态指针链表结构，用于外部化子目标证明树（证明了 *Principia Mathematica* 中 `52` 条定理里的 `38` 条）。麦卡锡（`1960`，`AI05`）[71]以同像性的 `Lisp` S 表达式统一了可执行代码与符号数据。罗宾逊（`1965`，`AI06`）[78]则将一阶演绎压缩为单一的、可由机器检验的归结与合一关口（推导出空子句 `[]`）。与此同时，罗森布拉特（`1958`，`AI04`）[80]提出了亚符号的 `Perceptron`，它在硬线性阶跃门 $\mathbf{w}^\top \mathbf{x} \ge \theta$ 之下对感光信号进行加权求和。

2. **第二时代（`1969-1981` · 规则库、Actor、黑板与 AI寒冬I的精确诊断，`AI07`-`AI10`）**：明斯基与帕珀特（`1969`，`AI07`）[73]以代数方法证明，单层的 `1` 阶阈值门无法表示奇偶性（`XOR`）或全局拓扑连通性。由于当时没有能够穿越多层阶跃门的低成本信用分配通道，亚符号研究陷入停滞。符号工程则以三种方式作出回应：将人类领域启发式经验外部化为模块化的 `if-then` 产生式规则（`Heuristic DENDRAL` 与 `MYCIN`，`1971-1976`，`AI08`）[55, 84]；异步点对点的 `Actor` 邮箱（`Hewitt, Bishop, and Steiger 1973`，`AI09`）[64]；以及多专家的 `Hearsay-II` 黑板工作区（`Erman et al. 1980`，`AI10`）[60]。**`Hearsay-II` 揭示了AI寒冬I（`1974-1980`）的精确机制成因**：相互独立的知识源（`KSs`）通过共享的多层黑板实现了清晰通信，**但人工编写的确定性规则既缺乏从嘈杂声学波形进行可微感知输入的能力，也缺乏低成本的习得搜索先验**。在缺少可靠梯度或可采纳剪枝关口的情况下，相互竞争的句法假设引发了 $O(b^d)$ 的组合分支爆炸；与此同时，启发式的 `MYCIN` 式确定性因子（`CF`）在多跳传播中累积了非贝叶斯漂移（`CTA-T1`）。随着词表规模与规则数量超过 $10^3$，`CpJ` 随之崩塌。

3. **第三时代（`1982-1998`，梯度通道、图形化消息传递与门控记忆，`AI11`-`AI17`）**：复苏源于发明了连续且具有概率合理性的通信通道。Hopfield（`1982`，`AI11`）[66] 将联想回忆刻画为 Lyapunov 能量松弛（$\Delta E \le 0$）；Rumelhart、Hinton 与 Williams（`1986`，`AI12`）[81] 确立了反向模式反向传播，将其作为一种向后传播误差的通道，突破了隐藏层 `XOR` 障碍；Pearl（`1988`，`AI13`）[77] 以基于 `d`-分离门控的信念传播取代了不一致的确定性因子（Certainty Factors），其作用对象为贝叶斯有向无环图（`DAGs`）；Watkins 与 Dayan（`1989/1992`，`AI14`）[89] 通过时序差分（`TD`）`Q-learning` 将延迟的环境奖励向后广播；LeCun 等人（`1989/1998`，`AI15`）[69] 在 `ConvNets`（`LeNet-5`）中实施了平移等变的权重共享；Cortes 与 Vapnik（`1995`，`AI16`）[56] 将决策边界外部化为稀疏的 Karush-Kuhn-Tucker（`KKT`）支持向量。关键在于，**第二次 AI 寒冬（`1988-1993`）**既反映了专用 Lisp 硬件在通用微处理器冲击下的经济性崩溃，也反映了深层饱和 Sigmoid 网络中梯度指数级消失的问题（即反向形式的 `CTA-T2`）。Hochreiter 与 Schmidhuber（`1997`，`AI17`）[65] 通过发明长短期记忆网络（`LSTM`）解决了时间维度上的梯度消失问题：其核心是一个线性的恒定误差传送带（`CEC`），并受到取值于 $[0,1]$ 的乘性输入门、遗忘门与输出门保护，**这正是蓝藻 `SepJ` 纳米孔（`CL03`）的精确计算类比**，能够在 `>1,000` 个循环步中，将存储的梯度状态密封起来，抵御噪声化的读写扰动。

4. **时代 IV (`2006-2016` · 共享语料库、跳过高速公路、软注意力与自我对弈棘轮、`AI18`-`AI23`)**：Coulom (`2006`) 和 Kocsis 及 Szepesvari (`2006`) (`AI18`) [57] 将非对称前瞻统计外部化为置信上限树 (`UCT`) 蒙特卡罗树搜索 (`MCTS`)。Deng 等人的众包验证 `14M` 图像 `ImageNet` 账本 (`2009`) 与 Krizhevsky、Sutskever 和 Hinton 的双 `GPU` `ReLU` `AlexNet` (`2012`, `AI19`) [59, 68] 点燃了现代规模；Mikolov 等人的 `Word2Vec` (`2013`) 和 Mnih 等人的 `DQN` 循环经验回放缓冲区 (`2015`, `AI20`) [72, 74] 稳定了连续向量几何和离策略 `RL`；Goodfellow 等人的生成对抗网络 (`GANs`, `2014`) 以及 Bahdanau、Cho 和 Bengio 的基于内容的软注意力 (`2015`, `AI21`) [53, 62] 引入了竞争性判别器门控和动态对齐；He 等人的 `ResNet` (`2016`, `AI22`) [63] 在 `152+` 层之间创建了无衰减的恒等跳跃高速公路 ($\mathbf{y} = \mathbf{x} + \mathcal{F}(\mathbf{x})$)。时代 IV 的高潮是 Silver 等人的 `AlphaGo` 和 `AlphaZero` (`2016-2017`, `AI23`) [85] 闭合了一个双向 **`MCTS` $\leftrightarrow$ 策略/价值自我对弈蒸馏棘轮**：神经直觉修剪 `MCTS` 分支，`MCTS` 搜索外部化改进的访问分布 $\pi_{\text{MCTS}}$，以及一个精确的确定性游戏规则验证器 (`>= 55%` Elo 门控) 防止了退化 (`CTA-T5`)。

5. **时代 V (`2017-2022` · 全对全注意力、稀疏 `MoE`、`Evoformer` 与人类反馈门控、`AI24`-`AI28`)**：Vaswani 等人的 `Transformer` 和 Gilmer 等人的消息传递神经网络 (`MPNN`, `2017`, `AI24`) [61, 88] 用 $O(1)$ 跳随机访问键值 (`KV`) 和分子图消息传递取代了序列循环。Shazeer 等人 (`2017`) 和 Fedus、Zoph 及 Shazeer (`2022`, `AI25`, `CL18`) [21, 83] 引入了 top-$k$ `Sparse MoE` 条件路由 (`~3%-12%` 活跃权重/词元)。Brown 等人的 `GPT-3` 和 Lewis 等人的检索增强生成 (`RAG`, `2020`, `AI26`) [54, 70] 将网络语料库上下文条件化与非参数化文档索引配对。Jumper 等人的 `AlphaFold 2` (`2021`, `AI27`) [67] 通过将多序列比对 (`MSA`) 协同进化统计与成对残基几何经三角形更新和 `SE(3)` 等变不变点注意力 (`IPA`) 耦合，解决了单体蛋白质折叠问题。最后，Ouyang 等人的 `InstructGPT` (`RLHF`)、Wei 等人的思维链 (`CoT`) 以及 Yao 等人的 `ReAct` (`2022-2023`, `AI28`) [76, 90] 将中间工作记忆外部化为自然语言词元草稿本和工具观测循环，解锁了多步合成，同时也暴露了时代 V 的失效模式：$O(L^2)$ `KV` 焦耳消耗、谄媚的人类偏好漂移，以及 `3.71x` 未经验证的多智能体转录膨胀 (`Arm C` in `CTA-E2`)。

6. **时代 VI (`2023-2025` · Verifier-Gated Search, Latent World Models & Machine Culture, `AI29`-`AI34`)**: Assran, LeCun 等人 的 `I-JEPA` (`2023`, `AI29`) [52] 通过在抽象潜在空间直接预测掩码目标，消除了浪费的表面像素重建。Brinkmann 等人 (`2023, 2026`) 与 Zhuang 的 `POLIS` (`2025`, `AI30`, `CL19`) [6, 7, 50] 证明了去除后文化锁定以及同行验证的 `LLM` 档位收益。Romera-Paredes 等人的 `FunSearch` (`2024`, `AI31`) [79] 将 `LLM` 代码突变与跨进化岛屿的精确沙箱适应度评估器耦合，Trinh 等人的 `AlphaGeometry` (`2024`, `AI32`) [86] 将神经辅助点提议与可靠的演绎数据库加代数规则 (`DD+AR`) 引擎配对（在 30 道奥林匹克几何题中 25 题零幻觉证明）。Anthropic 的 `Model Context Protocol` (`MCP`, `2024`, `AI33`) [51] 标准化了带类型的 `JSON-RPC 2.0` 工具模式（`N + M` 与 $N \times M$ 适配器），`DeepSeek-R1` (`2025`, `AI34`) [58] 通过群相对策略优化 (`GRPO`) 证明了纯强化学习对确定性数学/编译验证器的自我验证能力，然而仍在重复的结构化问题类上重新消耗数千个思考代币（`~10-50+ J`）。  

7. **时代 VII (`2026` · Downward Crystallization & Digital Enzymatic Synthesis, `AI35`-`AI38`)**: 伴随的 Open Interface Engineering 研究 `[same house]` [44] 与本工作共同闭合了缺失的向下循环：`Shape D` (`DNULLMM1`, `AI35`) 将已验证的修复冻结为 $O(1)$ `1.77 µJ` 内存映射哈希表；`AirMoL` 与 `Downward LUT6 Compilation` (`AI36`) 将热点决策路径编译为 `81 × RAMB36E2` 单周期硬件查找页（`0` `DSP48E2` 切片，`~12 pJ` `est_j`）；`RCE` + `FormEBM` (`AI37`) 将 `47.09 mJ` 潜能预过滤器（`0.8922` `AUROC`，`2.39x` 更少的检查调用）与 `~49 mJ` Reality Code Engine (`RCE`) 检查器（比前沿模型调用便宜 `1,718x`）配对；`CTA` / `DES-10` (`AI38`, `CL20`) 将所有 `10` 人工智能阵营统一在 `< 1 mJ` `BLAKE3` + `Ed25519` 数字酶以及可证明的四层向下编译器（`CTA-T32` 到 `CTA-T45`）之下。

| 时代与目录跨度 | 代表性里程碑（`ai-history-ratchet-1950-2026.csv`） | 外部化信号基底（$\mathcal{E}$） | 选择性阈值或验证门（$\mathcal{G}$） | 解锁的瓶颈（$\mathcal{T}$） | 停滞边界或AI寒冬机制 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **时代 I（`1950-1965`）** `AI01`-`AI06` | 图灵电传对话 [87]；Shannon *Theseus* [82]；*Logic Theorist* `IPL` [75]；`Perceptron` [80]；`Lisp` [71]；Robinson 归结 [78] | 电传字符令牌、`75` 继电器迷宫锁存器、堆链接的 `IPL`/`Lisp` S-表达式、电位器权重、`CNF` 子句 | 人类对话裁判、触须继电器锁存、公理恒等、步进裕量 $\mathbf{w}^\top \mathbf{x} \ge \theta$、空子句 `[]` | 物理化的符号递归、同像性代码即数据、$O(1)$ 继电器信息素式协同，以及单规则合一 | `Perceptron` 一阶 `XOR` 上限 [73] 与指数级 $O(b^d)$ 符号子句爆炸 |
| **时代 II（`1969-1981`）** `AI07`-`AI10` | Minsky-Papert `XOR` [73]；`DENDRAL`/`MYCIN` [55, 84]；`Actors` [64]；`Hearsay-II` 黑板 [60] | 模块化 `if-then` 产生式规则、异步 `Actor` 消息、共享的多层级语音 `Blackboard` | 前提阈值（`CF > 0.2`）、邮箱封装、机会主义 `KS` 焦点评分 | 将领域启发式与并发专家模块从单体控制回路中解耦 | **AI 寒冬 I（`1974-1980`）**：生硬的手工编写 `KSs` 缺乏可微摄入或低成本搜索先验 $\to$ $O(b^d)$ 停滞与 `CF` 漂移 |
| **时代 III（`1982-1998`）** `AI11`-`AI17` | Hopfield [66]；反向传播 [81]；Pearl `DAG` [77]；`Q-learning` [89]；`ConvNet` [69]；`SVM` [56]；`LSTM` [65] | Ising 耦合、反向模式 $\partial\mathcal{L}/\partial z$、`DAG` $\pi/\lambda$ 消息、`TD` 误差、共享核、`CEC` 细胞状态 | Lyapunov $\Delta E \le 0$、`d`-分离、Bellman 压缩、`KKT` 间隔、`LSTM` 乘性门（`SepJ` 模拟） | 解锁多层表示、相干因果推断、原始像素视觉以及 `>1,000` 步的时序记忆 | **AI 寒冬 II（`1988-1993`）**：Lisp 硬件崩溃、饱和 sigmoid 梯度消失，以及 $O(T)$ 顺序 `RNN` 瓶颈 |
| **时代 IV（`2006-2016`）** `AI18`-`AI23` | `MCTS`/`UCT` [57]；`ImageNet`+`AlexNet` [59, 68]；`Word2Vec`+`DQN` [72, 74]；`GAN`+注意力 [53, 62]；`ResNet` [63]；`AlphaGo`/`Zero` [85] | `UCT` 展开树、`14M` 图像账本、回放缓冲、软注意力对齐、恒等跳跃总线、自博弈 $\pi_{\text{MCTS}}$ | `UCT` 置信界、`ILSVRC` 预言机、冻结目标网络、判别器极小极大、`>= 55%` Elo 对局规则门 | 点燃 `GPU` 深度学习、`152+` 层梯度流，以及超人级神经 $\leftrightarrow$ 符号自博弈蒸馏 | 在平凡输入上进行密集的全层前向扫描，以及兆焦耳级封闭世界模拟器依赖 |
| **时代 V（`2017-2022`）** `AI24`-`AI28` | `Transformer`+`MPNN` [61, 88]；`Sparse MoE` [21, 83]；`GPT-3`+`RAG` [54, 70]；`AlphaFold 2` [67]；`InstructGPT`+`CoT`+`ReAct` [76, 90] | 全对 `KV` 缓存、top-$k$ 专家路由（`CL18`）、`MIPS` 文档段落、`MSA`$\leftrightarrow$配对张量、`CoT` 草稿区 | 缩放 softmax、top-$k$ 路由器（`3%-12%` 激活）、`SE(3)` `IPA` 三角一致性、`RLHF` 奖励 + 工具返回码 | 并行化的 $O(1)$ 跳全局上下文、万亿权重条件容量、原子级蛋白质折叠，以及零样本工具循环 | $O(L^2)$ `KV` 焦耳税、谄媚性 `RLHF` 奖励破解，以及 `3.71x` 未经证实的多智能体文本漂移（`CTA-E2` `Arm C`） |
| **时代 VI（`2023-2025`）** `AI29`-`AI34` | `I-JEPA` [52]；*Machine Culture*+`POLIS` [6, 7, 50]；`FunSearch` [79]；`AlphaGeometry` [86]；`MCP` [51]；`DeepSeek-R1` [58] | 潜在目标块、文化制品存储（`CL19`）、进化代码岛、欧几里得证明状态、`MCP` 模式、`<think>` 轨迹 | `EMA` 非坍缩、同侪验证、沙箱适应度、`DD+AR` 证明引擎、`JSON` Schema、`GRPO` 编译器/数学验证器 | 已证明的外部验证器可将随机性 `LLM` 转化为不回退的发现引擎（奥赛 `25/30`、极值数学） | 临时性的两派桥接，以及在重复的结构类别上从头重新执行的 `10-50+ J` 思维轨迹 |
| **时代 VII（`2026`）** `AI35`-`AI38` | `Shape D` `DNULLMM1`；`AirMoL`/`LUT6`；`RCE`+`FormEBM`；`CTA` / `DES-10` [44] `[同一 house]` | 冻结的 `mmap` 案例槽、`81 × RAMB36E2` `LUT6` 页、规范程序 `Forms`、`BLAKE3`+`Ed25519` `Phi_IR` 信封（`CL20`） | `SHA-256` 存储冻结、`1` 周期真值表奇偶校验、`~49 mJ` `RCE` 检查器、`< 1 mJ` 加密 + `eventfd` + `SSP` + 沙箱门 | **闭合向下回路**：`~15 J` 发现结晶为 `~15-49 mJ` 规则 $\to$ `1.77 µJ` 案例 $\to$ `~12 pJ` `LUT6` 反射（`0` 次错误提交） | 由精确摊销证伪条件 $h_{\min} = E_{\text{comp}} / (N (c_{\text{high}} - c_{\text{low}}))$ 支配（`CTA-T45`） |

---

<div id="worked-example-2-historical-ratchet-diagnosis-19502026--why-1975-mycin-and-1980-hearsay-ii-stalled-into-ai-winter-i-while-2016-alphago-and-2024-funsearch-ignited-cta-t1cta-t6" class="anchor-alias" aria-hidden="true"></div>

### 实例2：历史棘轮诊断（`1950`-`2026`），为何 `1975` 年的 `MYCIN` 与 `1980` 年的 `Hearsay-II` 在第一次AI寒冬中停滞，而 `2016` 年的 `AlphaGo` 与 `2024` 年的 `FunSearch` 点燃了新一轮浪潮（`CTA-T1`-`CTA-T6`）

将历史人工智能架构映射到三阶段算子 $(\mathcal{E}, \mathcal{G}, \mathcal{T})$ 上，可以解释为什么早期多模块系统会停滞，而现代的生成-验证循环能够实现超人类水平的锁定（`[E]`，`[T]`）：

1. **为什么 `MYCIN` (`1975`) 和 `Hearsay-II` (`1980`) 停滞不前**：
   - *外部化 ($\mathcal{E}$)*：`MYCIN` 将约 `450` 条人工编写的 `Lisp` 产生式规则外部化，这些规则携带主观确定性因子 (`CF`，$\mathrm{CF} \in [-1, 1]$)；`Hearsay-II` 将多粒度语音假设（声学、音素、音节、词法、短语）外部化到全局共享黑板上，由 $K$ 个并发知识源 (`KS`) 轮询。
   - *不健全门控 ($\mathcal{G}$)*：两种架构均不具备精确保真接纳门控 ($V(m) = 1 \not\Rightarrow \text{valid}(m)$)。由于 `MYCIN` 的 `CF` 组合代数将相关临床证据视为条件独立而未使用有向无环图 (`DAG`) `d`-分离，链接 $k$ 条规则会累积校准漂移 $\mathrm{err}_0 + k\epsilon$ (`CTA-T1`) 并遭受乘性保真衰减 $f^k$ (`CTA-T2`：在每跳规则精度 $f = 0.92$、链接 $k = 12$ 条规则时，联合有效性降至 $0.92^{12} = 0.3677$）。同时，`Hearsay-II` 的无阈值黑板迫使在噪声自底向上音节片段上进行 $O(K \cdot |B|)$ 次调度器检查 (`CTA-T9`)，将大部分计算仲裁花费在假阳性部分解析上。
   - *缺失向下提炼 ($\mathcal{T}$)*：将覆盖范围从 `450` 条扩展到 `4,500` 条规则需要人类专家手动审计成对规则交互，当维护能耗超过诊断收益时，便停滞进入 **AI Winter I**。

2. **为什么 `AlphaGo` (`2016`) 和 `FunSearch` (`2024`) 点燃火花**：
   - *外部化 ($\mathcal{E}$)*：`AlphaGo` 将习得的策略和价值先验 $(p_\theta, v_\theta)$ 外部化到显式的蒙特卡罗树搜索 (`MCTS`) 状态-动作表 $(N(s,a), Q(s,a))$ 中；`FunSearch` 将紧凑的 Python 优先级函数（`10` 至 `30` 行代码，而非自然语言论文）外部化到多岛进化程序数据库中。
   - *健全确定性门控 ($\mathcal{G}$)*：`AlphaGo` 通过精确的围棋棋盘规则门控合法转移和终局结果；`FunSearch` 通过确定性组合见证检查器门控每个语言模型变异（在毫秒内验证精确的 cap-set 独立性或装箱容量）。任何幻觉或次优代码均获得 `admittedWeight = 0` (`CTA-T3`, `CTA-T17`)，即使原始模型样本中 >`99%` 为非改进样本，也将岛污染严格保持在 `0.0%`。
   - *非退化锁定 ($\mathcal{T}$)*：`AlphaGo` 将昂贵的多千次 rollout `MCTS` 分布向下提炼为快速单遍神经权重，而 `FunSearch` 在各岛间保留严格更高分的已验证程序 ($Q(t+1) \ge Q(t)$, `CTA-T5`, `CTA-T6`)，将噪声随机提议转化为永久的数学棘轮。

---

<div id="5-event-driven-attested-orchestration-five-host-fleet-telemetry-and-ten-camp-synthesis-cta-e1-to-cta-e5" class="anchor-alias" aria-hidden="true"></div>

## 5. 事件驱动的已证明编排、五主机舰队遥测和十营合成 (`CTA-E1` 到 `CTA-E5`)

生物协作在第 2 节和第 3 节中考察的所有进化层级上依赖局部浓度梯度、协同激活阈值和选择性孔封闭，而非全局时钟滴答或未经验证的广播噪声。将这些机制转化为软件工程可得到一种事件驱动的编排架构，其中异构计算内核和语言模型通过能量预算、密码学已证明的通道进行通信。本节阐述通信工具雪崩（CTA）编排器的四个结构组件，列出已预注册的伪造者（`F1` 至 `F6`，在执行前已通过安全散列算法 `SHA-256` 摘要 `5739bcdd6c35662833a470bc56bd64f991774c2d920a5a9c059c0acebdf55e7f` 锁定），并报告在三项实验（`CTA-E1`、`CTA-E2`、`CTA-E3`）中于 20 线程 `13th Gen Intel Core i9-13900H` Linux 主机（`rustc 1.100.0`、`Python 3.14.4`）上执行的硬件测量。

<div id="51-measurement-grammar-and-telemetry-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 5.1 测量语法与遥测披露

所有 `CTA-E1` 至 `CTA-E3` 中的本地处理器能耗数值均读取自 Linux `sysfs` `powercap` 运行平均功率限制（Running Average Power Limit，RAPL）计数器，并采用包裹安全（wrap-safe）的 64 位累加，模数为 `max_energy_range_uj = 262,143,328,850` 微焦耳（`262.143 J`）。每项测量均严格遵循以下三条分离规则：

1. **片上 `reported_j` 与外部墙面功率的区分**：未接入外部串联分流器或交流（AC）整机功率分析仪（`measured_j = None`，`board_metered = false`）。所有本地能量数值均标记为 `reported_j`。
2. **三路 RAPL 披露（`package-0`、`core` 与 `psys`）**：每项实验均记录 `intel-rapl:0`（`package-0`，中央处理器（CPU）与片上系统（SoC）插槽能量 `pkg_reported_j`）、`intel-rapl:0:0`（`core`，处理器核心平面能量 `core_reported_j`）以及 `intel-rapl:1`（`psys`，平台计数器 `psys_reported_j`）。在该笔记本主机上，原始设备制造商（OEM）嵌入式控制器（EC）固件使 `intel-rapl:1`（`psys`）维持在约 `~0.202 W`（`~0.20 J/s`）的静态待机速率，且当 `package-0` 从约 `~5.0 W` 的空闲功率升至单核负载下的约 `~27.7 W` 时，该速率并不随之变化。因此，主要的本地每焦耳相干性（CpJ）依据动态 `pkg_reported_j` 计算（并同时报告 `core_reported_j`），而 `psys_reported_j` 则在每个 JSON 制品与账本条目中原样保留。
3. **本地焦耳与远程云端令牌的严格分离**：当某一实验组调用远程应用程序编程接口（API）大语言模型（LLM）时，远程数据中心服务器能耗严格记录为 `not_available`，且绝不根据启发式常数进行推算。精确的 API 调用次数、提示与补全令牌数，以及按公开标价计算的美元（USD）金额（`Claude Sonnet 5.5` 每百万输入令牌 `\$3.00`、每百万输出令牌 `\$15.00`）均与本地 `pkg_reported_j` 并列，单独列为专用栏目报告。

<div id="52-orchestrator-architecture-attested-channels-and-min-cost-flow" class="anchor-alias" aria-hidden="true"></div>

### 5.2 编排器架构、可验证通道与最小成本流

$G = (V, E)$ 表示由执行节点 $u \in V$ 构成的有向无环图（DAG），节点间通过类型化有向通道 $(i, u) \in E$ 连接：

1. **异构执行池与 `cost_lut.json`**：确定性节点执行词法和抽象语法树（AST）解析（`parse_kernel`）、作用域、可变默认值以及类型强制分析（`static_type_scope_kernel`）、文档字符串与代数不变量综合（`test_gen_kernel`）、有界 AST/词元修复（`det_patch_kernel`）以及隔离的行为准入（`diff_verifier_kernel`）。非确定性综合（`llm_patch_proposer`）位于高成本升级分支。在编排运行之前，每个确定性内核和密码学原语均在三个输入规模桶（`< 320 B`、`320-640 B`、`> 640 B`）下进行性能剖析，并生成硬件密钥化的查找表（`cost_lut.json`）。
2. **恒定时间密码学通道认证**：每条通道边携带由发送方确定性 `Ed25519` 密钥对签名的信封（通过 `ed25519-dalek` 实现的 `64` 字节请求评议（RFC）`8032` 严格签名），签名覆盖域分离的头部和负载字节的 `256` 位 `BLAKE3` 摘要。接收节点在改变节点状态之前，检查发送方授权、恒定时间 `BLAKE3` 摘要相等性、严格 `Ed25519` 签名有效性以及 JavaScript 对象表示法（JSON）帧完整性。
3. **逐次最短路径（SSP）最小成本流调度器**：给定来自 `cost_lut.json` 的边容量 $c(i, u)$ 和微焦耳缩放权重 $w(i, u)$，编译后的 Rust 调度器计算从源 $s$ 到提交汇 $t$ 的需求 $D$ 的最小成本流：

$$
\min_{f} \sum_{(i, u) \in E} w(i, u)\, f(i, u) \quad \text{subject to} \quad 0 \le f(i, u) \le c(i, u), \quad \sum_{i} f(i, u) - \sum_{v} f(u, v) = b(u),
$$

使用 Bellman-Ford 初始节点势 $\pi(u)$ 后接 Johnson 缩减成本 Dijkstra 增广 $w_{\pi}(i, u) = w(i, u) + \pi(i) - \pi(u) \ge 0$。由于调度仅依赖图拓扑和 `cost_lut.json`，`SSP` 仅在拓扑周期 `0` 执行一次（对于 `CTA-E2` 池为 `2.11 µs`），且仅当节点退出或加入时重新计算（每时钟调度开销为 `0`）。
4. **阈值积分-发放唤醒（零时钟，零轮询）**：每个节点 $u$ 针对传入加权信号 $s_i$ 维护累积膜电位 $V_u$：

$$
V_u(t) = \sum_{(i, u) \in E} w_{iu}\, s_i(t), \qquad \text{fire}(u) \iff V_u(t) \ge \theta_u.
$$

工作线程通过 `eventfd`（`EFD_CLOEXEC`）在 Linux 内核中阻塞，当 $V_u < \theta_u$ 时消耗零 CPU 周期。上游节点 $i$ 仅在阈值跨越跃迁 $V_u < \theta_u \to V_u \ge \theta_u$ 时向 `eventfd` 写入。每次发放均向能量账本追加一条不可变收据 `(trace_id, step_idx, node_id, input_blake3, output_blake3, ed25519_sig_prefix, verify_ns, psys_reported_j, pkg_reported_j, latency_ms, potential_v, threshold_theta)`。

| 池组件 / 原语 | 桶 / 负载 | 平均延迟 | `pkg_reported_j` 每次操作 | `core_reported_j` 每次操作 | 在编排图中的角色 |
| :--- | :--- | ---: | ---: | ---: | :--- |
| `parse_kernel` | `320-640 B` (`200` runs) | `56.90 µs` | `1.38 mJ` | `1.16 mJ` | 词法括号栈与抽象语法树定位 |
| `static_type_scope_kernel` | `320-640 B` (`200` runs) | `29.26 µs` | `0.64 mJ` | `0.55 mJ` | 未绑定符号、可变默认值、强制转换 |
| `test_gen_kernel` | `320-640 B` (`200` runs) | `13.33 µs` | `0.36 mJ` | `0.30 mJ` | 公开文档测试与代数不变式合成 |
| `det_patch_kernel` | `320-640 B` (`200` runs) | `601.60 µs` | `15.73 mJ` | `13.35 mJ` | 受限抽象语法树/标记补丁合成（`<= 16` 次尝试） |
| `diff_verifier_kernel` | `320-640 B` (`200` runs) | `47.67 µs` | `1.12 mJ` | `0.95 mJ` | 隔离执行、重复调用与属性门 |
| Rust `BLAKE3` + `Ed25519` verify | `64 B` (`50,000` runs) | `26.05 µs` (`p50 25.95 µs`) | `643.03 µJ` | `543.65 µJ` | 常时通道封装验证 |
| Rust `BLAKE3` + `Ed25519` verify | `1 KiB` (`50,000` runs) | `27.35 µs` (`p50 27.04 µs`) | `650.59 µJ` | `546.58 µJ` | 典型抽象语法树诊断包验证 |
| Rust `BLAKE3` + `Ed25519` verify | `16 KiB` (`50,000` runs) | `29.36 µs` (`p50 29.32 µs`) | `696.16 µJ` | `584.07 µJ` | 多功能补丁负载验证 |
| Rust `BLAKE3` + `Ed25519` verify | `64 KiB` (`50,000` runs) | `37.47 µs` (`p50 37.39 µs`) | `926.42 µJ` | `784.95 µJ` | 大上下文通道验证（`< 1 mJ`） |

在通道负载大小从 `64 B` 增至 `64 KiB`（`1,024x`）的情况下，编译后的 Rust `BLAKE3` + `Ed25519` 验证延迟提升至 `1.44x`（中位数从 `25.95 µs` 到 `37.39 µs`），而套接字能耗保持在 `1 mJ` 以下（从 `643.03 µJ` 到 `926.42 µJ`），满足预登记的 `Falsifier 2`（每条边 `< 100 µs` 且 `< 5 mJ`）。

<figure class="fig">
  <img src="/figures/communication-avalanche/orchestration-coherence-per-joule.svg" alt="深色主题双面板摘要：CTA-E1 零时钟阈值与轮询式 RAPL 焦耳对比，以及 CTA-E2 的 60 任务每焦耳相干性">
  <figcaption><strong>图 5.</strong> 在 <code>13th Gen Intel Core i9-13900H</code> 上执行的硬件基准测试（Linux <code>RAPL</code> <code>reported_j</code>，<code>board_metered = false</code>，<code>measured_j = None</code>）。<strong>左（<code>CTA-E1</code>）</strong>：16 节点编排 DAG 在 <code>1%</code>、<code>5%</code> 和 <code>20%</code> 突发占空比下的插槽能耗（<code>10.0 s</code> 窗口 × <code>5</code> 次重复），以及 Rust <code>BLAKE3</code> + <code>Ed25519</code> 验证成本。<strong>右（<code>CTA-E2</code> 与 <code>CTA-E3</code>）</strong>：<code>60</code> 任务 Python 代码修复通过率、误提交率、本地 <code>RAPL</code> 与云端 token/USD 成本分列统计、每焦耳相干性，以及 <code>0 / 200</code> 拜占庭故障遏制。交互式探索器：<a href="/living/communication-avalanche/">/living/communication-avalanche/</a>。</figcaption>
</figure>

<div id="53-cta-e1-event-driven-thresholded-gradients-vs-clocked-polling-tax" class="anchor-alias" aria-hidden="true"></div>

### 5.3 `CTA-E1`：事件驱动阈值梯度与时钟轮询税

`CTA-E1` 实例化了一个 5 层、16 节点的已认证编排 DAG（`16` 个工作 OS 线程交换 `BLAKE3` + `Ed25519` 信封，其中内部层在跨越 $\theta_u = 1.0$ 之前整合 `2` 至 `4` 个上游输入），由突发式微批次到达驱动，目标活跃占空比分别为 `1%`、`5%` 与 `20%`（每次运行 `10.0 s` 窗口，每个 `5` 次重复中交错 `4` 种调度机制 = `60` 个窗口，总运行时间 `600 s`）。线程范围的 OS 上下文切换数通过对 `/proc/self/task/*/status` 求和得到。

**`CTA-E1` 上的 `Falsifier 6` 基线漂移披露**：负载前静默 `5.0 s` 空闲功率实测为 `3.95 W`（`pkg_reported_j = 19.77 J`），而 `600 s` 负载结束后紧接的 `5.0 s` 尾段实测为 `20.13 W`（`410.2%` 的热/后台尾段漂移，超过 `10.0%` 的 `Falsifier 6` 门限；瞬态热/后台平台也使 `5%` 占空比重复的原始读数相对 `20%` 占空比重复有所抬高）。依据预注册的 `Falsifier 6`，`CTA-E1` 的扣除空闲后净焦耳导出值**予以保留不报**，仅报告未扣除的原始 `reported_j` 数值以及重复内交错比较结果。

| 占空比 (`10.0 s` × `5` reps) | 调度机制 | 平均 `pkg_reported_j` | 平均 `core_reported_j` | 平均 `psys_reported_j` | 节点唤醒 (`空轮询`) | 操作系统线程上下文切换 | 事件到提交 `p50` / `p99` (`ms`) |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| `1%` (`51` events/win) | **零时钟 `eventfd` ($V \ge \theta$)** | **`136.32 J`** | **`96.24 J`** | `2.03 J` | **`559.4` (`0.0`)** | **`811.4`** | **`2.58` / `1,016.18`** |
| `1%` (`51` events/win) | `10 Hz` 时钟轮询 | `143.42 J` | `103.76 J` | `2.04 J` | `1,600.0` (`1,284.8`) | `1,963.0` | `570.38` / `1,354.16` |
| `1%` (`51` events/win) | `100 Hz` 时钟轮询 | `198.51 J` | `157.35 J` | `2.06 J` | `15,799.8` (`15,475.6`) | `16,156.2` | `55.22` / `1,057.93` |
| `1%` (`51` events/win) | `1,000 Hz` 时钟轮询 | `300.73 J` | `259.17 J` | `2.08 J` | `150,139.8` (`149,844.2`) | `150,574.8` | `7.34` / `1,015.30` |
| `5%` (`255` events/win) | **零时钟 `eventfd` ($V \ge \theta$)** | **`318.78 J`** | **`275.34 J`** | `2.52 J` | **`2,792.6` (`0.0`)** | **`2,603.8`** | **`2.75` / `208.12`** |
| `5%` (`255` events/win) | `10 Hz` 时钟轮询 | `315.24 J` | `274.76 J` | `2.54 J` | `1,598.6` (`335.0`) | `1,965.2` | `558.26` / `766.20` |
| `5%` (`255` events/win) | `100 Hz` 时钟轮询 | `331.84 J` | `290.23 J` | `2.56 J` | `15,795.0` (`14,132.2`) | `16,173.6` | `51.98` / `254.40` |
| `5%` (`255` events/win) | `1,000 Hz` 时钟轮询 | `406.75 J` | `360.50 J` | `2.61 J` | `149,823.8` (`148,335.8`) | `150,240.0` | `7.46` / `216.57` |
| `20%` (`1,020` events/win) | **零时钟 `eventfd` ($V \ge \theta$)** | **`236.43 J`** | **`196.07 J`** | `2.39 J` | **`10,260.8` (`0.0`)** | **`9,002.4`** | **`2.76` / `55.19`** |
| `20%` (`1,020` events/win) | `10 Hz` 时钟轮询 | `231.45 J` | `186.90 J` | `2.37 J` | `1,582.0` (`81.0`) | `2,046.2` | `547.62` / `721.74` |
| `20%` (`1,020` events/win) | `100 Hz` 时钟轮询 | `234.04 J` | `188.89 J` | `2.35 J` | `15,649.6` (`9,280.2`) | `16,117.0` | `52.07` / `99.54` |
| `20%` (`1,020` events/win) | `1,000 Hz` 时钟轮询 | `269.13 J` | `223.87 J` | `2.32 J` | `148,023.6` (`142,013.6`) | `148,638.2` | `7.43` / `59.39` |

时钟轮询在多跳图中面临结构性的延迟与焦耳权衡 (`Falsifier 1`)。将时钟降至 `10 Hz` 可保持唤醒能耗低（每 `10 s` 约 `1,600` 次唤醒），但多阶段时钟对齐使中位事件-到-提交延迟膨胀至原来的 `200x`-`221x`（`547.62-570.38 ms` 对比 `2.58-2.76 ms`）。将时钟提升至 `1,000 Hz` 可将中位延迟缩小至 `7.34-7.46 ms`（仍比直接 `eventfd` 转交慢 `2.7x`），却导致每 `10 s` 窗口约 `~150,000` 次线程唤醒（`99.8%` 空闲在 `1%` 占空比下），阻止处理器 C 状态驻留，并在 `1%` 占空比下每 `10 s` 窗口消耗 `+164.40 J`（相当于套接字能耗的 `2.21x`、核心能耗的 `2.69x`），其中 `5 / 5` 成对重复实验均为正值：从 `+82.32 J` 到 `+313.29 J`；在 `5%` 占空比下额外增加 `+87.97 J`（增长 `+27.6%`），`5 / 5` 成对重复实验均为正值：从 `+60.87 J` 到 `+140.18 J`。零时钟阈值的 `eventfd` 触发实现了 `0` 次空唤醒、最低的 `1%` 占空比能耗，并同时保持 `2.58-2.76 ms` 的中位提交延迟。

<div id="54-cta-e2-60-task-multi-category-code-repair-benchmark-240-episodes" class="anchor-alias" aria-hidden="true"></div>

### 5.4 `CTA-E2`：60 项任务多类别代码修复基准（`240` 个回合）

`CTA-E2` 评估了一个冻结的 `60` 任务 Python 代码修复语料库（`corpus_sha256 = b4ea0228270b8e6ae06f935fe8b92ed45cf2da4d9aa0d4868d0a42d4e6e9e802`），该语料库被分层为三个 `20` 任务类别：
- **类别 1（`C1_01`-`C1_20`）**：语法、缩进、括号分隔符、C 运算符以及缺失的标准库导入缺陷。
- **类别 2（`C2_01`-`C2_20`）**：未绑定标识符拼写错误、可变默认参数状态泄漏（`=[]`、`={}`、`=set()`）、原地改变器返回（`return xs.sort()`）、浮点到整数除法强制转换以及容器 API 缺陷。
- **类别 3（`C3_01`-`C3_20`）**：算法、数值和状态机缺陷（包括 Tarjan 强连通分量反向边更新、无限制 Damerau-Levenshtein 换位、字典序最小跳 Dijkstra、重叠 Knuth-Morris-Pratt 边界、Neumaier 补偿求和、双 Fenwick 范围更新、银行家舍入 `Q16.16` 饱和、非互素中国剩余定理、分数令牌桶上限钳制、反射 `CRC-8/MAXIM`、目标特定的负环 Bellman-Ford、转义游程长度分块以及 Raft 图 2 `AppendEntries` 前缀安全冲突截断）。

每个任务在提交后针对隔离的留出预言机进行评分（在同一函数对象上执行两次 `>= 8` 个单位向量以捕获状态泄漏，修复期间 `0` 次预言机访问；`Falsifier 3` 满足）。基准测试前与基准测试后 `5.0 s` 静默空闲套接字功率测量值为 `6.10 W` 与 `5.49 W`（`9.93%` 漂移，通过 `Falsifier 6` `<= 10.0%`）。将已验证的本地每焦耳相干性定义为：

$$
\mathrm{CpJ}_{\text{pkg}} = \frac{N_{\text{verified\_correct}}}{E_{\text{pkg\_reported\_j}}}, \qquad \mathrm{CpJ}_{\text{core}} = \frac{N_{\text{verified\_correct}}}{E_{\text{core\_reported\_j}}}.
$$

| 臂（每个 `60` 任务 · 总计 `240` 轮次） | 验证通过率 | 错误提交（`Broken Accepted`） | LLM 调用次数 | 提示 + 输出令牌数 | 云 API 花费（`USD`） | 本地 `pkg_reported_j`（`core_reported_j`） | 墙上时间（`s`） | `CpJ_pkg`（任务 / J） |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **臂 A（`Det-Only` 池）** | `40 / 60`（`66.67%`） | **`0 / 60`（`0.00%`）** | `0` | `0` | `\$0.00` | **`1.51 J`**（`1.28 J`） | `0.06 s` | **`26.539`** |
| **臂 B（`Monolithic-LLM`，`Sonnet 5.5`）** | `59 / 60`（`98.33%`） | `1 / 60`（`1.67%`） | `60` | `44,843`（`21.0k` + `23.8k`） | `\$0.42` | `902.51 J`（`160.93 J`） | `193.88 s` | `0.065` |
| **臂 C（`Unattested-4-Agent` 雪崩）** | `52 / 60`（`86.67%`） | `8 / 60`（`13.33%`） | `240` | `288,583`（`190.0k` + `98.6k`） | `\$2.05` | `5,710.77 J`（`1,043.40 J`） | `1,229.15 s` | `0.009` |
| **臂 D（`CTA-Orchestrator`）** | **`59 / 60`（`98.33%`）** | **`0 / 60`（`0.00%`）** | **`21`** | **`28,452`**（`14.1k` + `14.4k`） | **`\$0.26`** | **`432.75 J`**（`74.08 J`） | **`95.12 s`** | **`0.136`** |

| 类别细分（每单元 `20` 任务） | 方案 A（仅检测） | 方案 B（单体-LLM） | 方案 C（未验证-4-代理） | 方案 D（CTA-编排器） |
| :--- | :--- | :--- | :--- | :--- |
| **类别 1：语法与导入（`20`）** | `20/20`（`0` 错误，`0` 调用，`0.40 J`） | `20/20`（`0` 错误，`20` 调用，`\$0.09`，`175.95 J`） | `20/20`（`0` 错误，`80` 调用，`\$0.55`，`1,745.66 J`） | **`20/20`（`0` 错误，`0` 调用，`\$0.00`，`0.79 J`）** |
| **类别 2：范围、类型与 API（`20`）** | `20/20`（`0` 错误，`0` 调用，`0.34 J`） | `20/20`（`0` 错误，`20` 调用，`\$0.08`，`219.51 J`） | `20/20`（`0` 错误，`80` 调用，`\$0.58`，`2,163.94 J`） | **`20/20`（`0` 错误，`0` 调用，`\$0.00`，`0.71 J`）** |
| **类别 3：算法与状态逻辑（`20`）** | `0/20`（`0` 错误，`20` 拒绝，`0.77 J`） | `19/20`（`1` 错误 `C3_05`，`20` 调用，`\$0.25`，`507.06 J`） | `12/20`（`8` 错误，`80` 调用，`\$0.92`，`1,801.18 J`） | **`19/20`（`0` 错误，`1` 拒绝 `C3_17`，`21` 调用，`\$0.26`，`431.25 J`）** |

三个经验性发现凸显（`Falsifier 4`）：

1. **确定性预过滤在毫焦耳尺度上消除了 `66.67%`（`40 / 60`）的缺陷**：`Arm A` 在 `57 ms` 和 `1.51 J` 内解决了 `20 / 20` 个第一类任务和 `20 / 20` 个第二类任务（每个已验证修复耗能 `37.7 mJ`，模型调用次数为 `0`），同时拒绝了全部 `20` 个第三类逻辑缺陷（错误提交次数为 `0`）。若对这 `40` 个结构性任务分别调用单体大语言模型（`Arm B`）或四智能体链（`Arm C`），则分别耗费 `395.45 J`（`40` 次调用，`\$0.17`）和 `3,909.60 J`（`160` 次调用，`\$1.13`），而准确率并无任何提升。

2. **未经证明的多智能体对话引发真实的通信雪崩（通过率 `86.67%`，错误提交率 `13.33%`）**：在 `Arm C`（`Planner -> Coder -> Reviewer -> Summarizer`）中，未经验证的自然语言对话记录逐跳传递，使平均提示上下文在各跳之间放大 `3.71x`（每跳输入令牌数为 `330.6 -> 600.0 -> 1,011.2 -> 1,225.1`，总令牌数为 `288,583`）。在 `20` 个第三类算法任务中的 `8` 个（`C3_02`、`C3_03`、`C3_06`、`C3_11`、`C3_13`、`C3_15`、`C3_17`、`C3_18`）上，累积的对话性评论与自适应推理耗尽了 `Summarizer` 的 `1,000` 令牌输出窗口，导致函数写到一半被截断，截断的 Python 代码块未经验证即被提交（第三类错误提交率为 `40.0%`）。即便是单次调用的 `Arm B`，也出现了 `1` 次因截断导致的错误提交（`C3_05`）。

3. **阈值升级加提交门控（`Arm D`）在安全性、成本与 `CpJ` 上全面占优**：`Arm D` 在全部 `40` 个第一类和第二类任务上使 `llm_patch_proposer` 保持休眠（$V_{\text{esc}} = 0 < \theta_{\text{esc}} = 1.0$），在 `60` 条轨迹中共生成 `322` 份 Rust 实现的 `BLAKE3` + `Ed25519` 账本回执（总计 `1.50 J`）；仅在 `20` 个第三类任务上唤醒 `Claude Sonnet 5.5`（共 `21` 次调用），修复了 `C3_05`（已验证通过率 `59 / 60 = 98.33%`），并在两次有界提案均未通过 `diff_verifier_kernel` 时干净地拒绝了 `C3_17`（错误提交率 `0 / 60 = 0.00%`）。相对于 `Arm B`，`Arm D` 将大语言模型调用次数减少 `2.86x`，API 美元成本降低 `1.63x`，本地套接字焦耳数降低 `2.09x`（`CpJ_pkg` 为 `0.136` 对 `0.065`）。相对于未经证明的四智能体链（`Arm C`），`Arm D` 将通过率提高 `+11.67` 个百分点，消除了全部 `8 / 8` 次错误提交，令牌数减少 `10.14x`，API 美元成本减少 `7.95x`，挂钟延迟降低 `12.92x`，本地套接字每焦耳相干性提高 `14.97x`（以 `core_reported_j` 计为 `15.98x`）。

<div id="worked-example-3-step-by-step-hardware-receipt-walk-through-on-cta-e2-task-c3_20-raft_append_entries" class="anchor-alias" aria-hidden="true"></div>

### 工作示例 3：在任务 `C3_20`（`raft_append_entries`）上的逐步硬件回执演练

为了在真实硬件（13th Gen Intel Core i9-13900H、Linux `RAPL` `reported_j`、`board_metered = false`）上对比未经验证的多智能体聊天级联（`Arm C`）与经阈值控制、密码学认证的编排（`Arm D`），请检查第 3 类任务 `C3_20`（`raft_append_entries`，实现 Raft `§5.3` 中具有前缀安全性的日志冲突截断）所记录的精确执行回执：

1. **缺陷**：有缺陷的实现无条件地执行 `out = out[:prev_log_index] + list(entries)`。每当一个过时且较短的匹配心跳前缀 `[(1, 'b')]` 在 `prev_log_index = 1` 处到达时，它就会静默删除已提交的后缀条目 `(2, 'c')`。

2. **Arm A（Det-Only 池，安全的毫焦耳级弃权）**：确定性内核解析并测试 `C3_20`，耗时 `1.34 ms`（`19.59 mJ` `pkg_reported_j`，`0` 次模型调用）。它检测到 `16` 个有界 AST/token 模板均无法修复这一多行循环缺陷，并**干净地拒绝提交**（`false_commit = false`）。

3. **Arm C（未认证的 4 智能体聊天，转录雪崩）**：未经验证的自然语言评论依次在 `Planner -> Coder -> Reviewer -> Summarizer` 之间传递（共 `4` 次顺序调用 `Claude Sonnet 5.5`）。在 `C3_20` 上，提示词 token 数几乎增至三倍（输入 token 数为 `581 -> 884 -> 1,642 -> 1,692`；总计输入 `4,799` + 输出 `2,213` = `7,012` 个 token，费用 `\$0.0476`，`67.70 J` `pkg_reported_j`，墙钟时间 `17,659.76 ms`）。在 `60` 个任务的整个测试集上，平均输入 token 数增长 `3.71x`（`330.6 -> 600.0 -> 1,011.2 -> 1,225.1`，总能耗 `5,710.77 J`）。更严重的是，在 `8` 个同类第 3 类任务上，例如 `C3_18`（输入 token 数 `502 -> 802 -> 1,343 -> 1,357`，`71.60 J`），冗长的对话内容会使 `Summarizer` 的 `1,000` token 输出窗口在函数中途溢出，并提交一个原始的 `SyntaxError`（全套件误提交率为 `13.33%`）。

4. **Arm D（`CTA-Orchestrator`，证明式 `eventfd` 升级与提交门控）**：每条边验证 `256`-bit `BLAKE3` 摘要与 `64`-byte `Ed25519` 签名（微基准中 `1 KiB` 下 `27.04 µs` `p50`），并在 `cta_e2_firing_ledger.jsonl`（`trace_id = cta_e2_C3_20`）中记录六条不可变回执：
   - **第 `0` 步（`parse_kernel`）**：以 `29.38 µs` 验证输入 `7ae1414e…`（`sig = 993161b1…`）；以 `0.210 ms` 输出 AST 诊断 `9f868fad…`。
   - **第 `1` 步（`static_type_scope_kernel`）**：以 `25.93 µs` 验证 `9f868fad…`（`sig = 48e2700c…`）；以 `0.336 ms` 确认词法/类型作用域干净，结果为 `3d82a573…`。
   - **第 `2` 步（`test_gen_kernel`）**：以 `26.19 µs` 验证 `3d82a573…`（`sig = 6d264e0c…`）；以 `0.068 ms` 提取公开 doctest 不变量 `92bf4238…`。
   - **第 `3` 步（`det_patch_kernel`）**：以 `31.08 µs` 验证 `92bf4238…`（`sig = 8b10b040…`）；以 `0.755 ms`（`18.62 mJ`）测试有界 AST 修复，发现陈旧前缀保持相关的 doctest 失败，并向 Linux `eventfd` 写入 `1`，使 $V_{\text{esc}} = 1.0 \ge \theta_{\text{esc}} = 1.0$。
   - **第 `4` 步（`llm_patch_proposer`）**：从零时钟内核休眠中唤醒，执行**一次**结构化调用（输入 `738` + 输出 `569` = `1,307` tokens，`\$0.0107`）；以 `50.12 µs` 验证信封 `c2bfa1ba…`（`sig = b1d75063…`），并输出基于索引遍历的冲突检查结果 `ad1fc058…`（`2,957.59 ms`，`17.56 J` `pkg_reported_j`）。
   - **第 `5` 步（`diff_verifier_kernel`）**：以 `59.48 µs` 验证 `f138e9ca…`（`sig = 7ffe7c3f…`）；以 `1.009 ms`（`14.16 mJ`）执行隔离的 doctest 与重复调用状态泄漏检查；提交 `62ccce23…`。在 `C3_20` 上，单回合总计 `17.65 J`，插座焦耳数低 `3.84x`，tokens 少 `5.36x`，速度比 `Arm C` 快 `5.96x`；在整个基准测试中，**`0 / 60` 次误提交**。

<div id="55-cta-e3-byzantine-channel-injection-and-ssp-topology-failover" class="anchor-alias" aria-hidden="true"></div>

### 5.5 `CTA-E3`：拜占庭信道注入与 `SSP` 拓扑故障转移

`CTA-E3` 通过在四个各含 `50` 个事件的故障类别中注入 `200` 个损坏信道事件，同时伴随 `200` 个有效控制信封（`200 / 200` 准入，`p50 = 27.51 µs`），随后在 `14` 节点主备编排拓扑（`Falsifier 5`）中进行 `20` 次流中单至四节点掉线，来压力测试信道完整性和动态图生存性。

| 注入故障类别（各 `50` 事件） | 活跃 CTA 防御层 | 拒绝 `p50` / `p99`（µs） | CTA 损坏提交 | 未认证链级联 |
| :--- | :--- | ---: | ---: | ---: |
| 载荷位翻转（`50`） | `BLAKE3` `256` 位常时摘要相等性 | `0.19` / `0.23 µs` | **`0 / 50`（`0.0%`）** | `43 / 50`（`86.0%`） |
| 伪造发送者身份（`50`） | `Ed25519` RFC `8032` 严格密钥环验证 | `27.56` / `32.44 µs` | **`0 / 50`（`0.0%`）** | `50 / 50`（`100.0%`） |
| 截断 JSON/AST 帧（`50`） | 类型化信道模式与帧防护 | `27.55` / `30.96 µs` | **`0 / 50`（`0.0%`）** | `26 / 50`（`52.0%`） |
| 语义回归补丁（`50`） | `diff_verifier_kernel` 提交门（`21.12 mJ`/门） | `332.43` / `1,941.25 µs` | **`0 / 50`（`0.0%`）** | `50 / 50`（`100.0%`） |
| **总计（`200` 个损坏事件）** | **分层密码学 + 行为门** | ,  | **`0 / 200`（`0.00%`）** | **`169 / 200`（`84.50%`）** |

正如蓝藻 `SepJ` 纳米孔在钙胁迫下局部封闭以防止丝状体广泛裂解，分层信道认证 + 行为门控遏制了 `200 / 200`（`100.0%`）注入故障（`0.00%` 损坏提交，对比未认证正则提取链中 `84.50%` 的下游传播）。在所有 `20` 次流中节点掉线场景（`1` 至 `4` 个同时发生的主内核/提议者/验证者故障，流量需求 `D = 8`）下，精确 `SSP` 拓扑重计算在 `2.40 µs` 中位数（`mean = 2.41 µs`，`p99 = 3.58 µs`，`max = 3.58 µs`）内将流量重路由至备用路径，满足 `20 / 20`（`100%`）流量需求且零丢弃迹线。

<div id="56-communication-tool-avalanche-cta-experiment-cta-e4-five-host-cross-silicon-and-cross-kernel-fleet-energy-audit" class="anchor-alias" aria-hidden="true"></div>

### 5.6 通信工具雪崩 (`CTA`) 实验 `CTA-E4`：五主机跨硅片与跨内核舰队能耗审计

单主机基准测试未能说明在异构指令集架构和操作系统 (OS) 内核上，零时钟阈值编排和恒时密码通道验证是否仍保持亚毫焦并且免唤醒。实验 `CTA-E4`（在执行前已通过安全哈希算法 256 位（`SHA-256`）预注册摘要 `3efe68407530d203d7e8a1f13d9943713f763fe24034301f85e5330bb2a65b` 锁定）编译统一的跨平台 Rust 引擎（`cta_fleet_rust`, `rustc 1.100.0`），面向五种硬件和内核目标，涵盖物理板级直流分流（`measured_j`, `board_metered = true`）以及四种片上或驱动遥测基底（`reported_j`, `board_metered = false`），并在全板输入（`(L1)`）、轨道或插槽平面（`(L2)`）以及每进程（`(L3)`）遥测范围内组织。

1. **NVIDIA（加速计算系统）Jetson AGX（自动驾驶级计算）Thor（`aarch64` Tegra Linux `6.8`，仅中央处理器（CPU）执行）**：在尊重活跃图形处理器（GPU）共享占用锁（`CUDA_VISIBLE_DEVICES=""`，统一计算设备架构（CUDA）已禁用）的前提下，`cta_fleet_rust` 以 `200 Hz` 频率通过 `sysfs` `hwmon` 对物理德州仪器（TI）分流电阻进行采样：`INA238`（整板分流监测器）电压输入轨 `VIN` `(L1)`（`l1_vin_ina238_measured_j`），以及 `INA3221`（三通道轨道监测器）通道 2 供电轨 `VDD_CPU_SOC_MSS`（面向 CPU、片上系统（SoC）及内存子系统（MSS）的供电电压）`(L2)`（`l2_vdd_cpu_soc_mss_measured_j`，与通道 1 `VDD_GPU` 物理隔离）。
2. **`13th Gen Intel Core i9-13900H`（`20` 线程 Raptor Lake `x86_64` Linux `7.0`）**：读取防回绕的 `powercap` 运行平均功率限制（RAPL）`intel-rapl:0`（`package-0`）与 `intel-rapl:0:0`（`core`）`(L2)` `reported_j`。
3. **超威半导体（AMD）Ryzen 人工智能（AI）Max+ `395`（`32` 线程 Zen 5 Strix Halo 与 `Radeon 8060S`，`x86_64` Linux `7.0`）**：读取 `intel-rapl:0:0`（`core`）、`intel-rapl:0` 加速处理单元（APU）插槽，以及 `amdgpu` 封装功耗跟踪（PPT）`(L2)` `reported_j`。
4. **`Apple M3 Ultra`（`arm64` macOS Darwin X is Not Unix（XNU）`27.2.0`，运行于 `memguard` 之下）**：通过 `kqueue` 与可移植操作系统接口（POSIX）`pipe` 内核事件阻塞，读取每进程标识符（PID）的 `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（资源使用信息第 6 版（`RUSAGE_INFO_V6`））`(L3)` `reported_j`。
5. **`Windows 11 Pro x86-64` 裸机与 GeForce 光线追踪纹理极致版（RTX）`2060`（新技术（NT）内核 `10.0.26300`）**：采用原生 Win32 `CreateEventW` / `WaitForSingleObject` 阻塞机制，与 1,000 Hz 高分辨率可等待定时器（`CreateWaitableTimerExW`）进行对比；同时记录免 root 的 NVIDIA 管理库（NVML）`nvml.dll` 累计毫焦耳值 `(L2)` `reported_j`，以及 `QueryProcessCycleTime` `(L3)` CPU 周期数（Windows NT 内核不对外暴露免 root 的 CPU RAPL 数据）。

每项测量均严格区分物理分流电阻的 `measured_j` 与基于计数器的 `reported_j`；不同证据类别的数值绝不相加。依据预注册的证伪项 6，当存在共享主机的共占用负载（`Jetson AGX Thor` 的 GPU 共占用在 `VIN` 上约 `~55 W`；`AMD Ryzen AI Max+ 395` 的 APU 共占用约 `~120 W`），或 `5.0 s` 的前后空闲基线漂移超过 `10.0%` 时，则撤回单窗口空闲扣减，改用未扣减的原始读数，并在四个交错的 `5.0 s` 窗口中、以 `1%` 突发占空比（`16` 节点有向无环图（DAG））进行对称交替顺序的组内配对 `(poll_1000hz - event_threshold)` 差值测量。

| 主机与操作系统事件原语 | `1 KiB` / `16 KiB` 校验 `p50`（`µs`） | 每条边的物理分流表 `measured_j`（`50k` 次迭代） | 每条边的片上/驱动 `reported_j`（`50k` 次迭代） | `16` 节点 DAG 零时钟对比 `1,000 Hz` 轮询（`5.0 s` × `4` 组交替配对，`1%` 占空比） | 线程唤醒次数（`Event` 对比 `1 kHz`） | `p50` 提交（`ms`） |
| :--- | ---: | ---: | ---: | :--- | ---: | ---: |
| **NVIDIA Jetson AGX Thor**（`linux_eventfd`，仅 CPU） | `50.13` / `62.24` | **`927.30` / `879.53 µJ`**（`VDD_CPU_SOC`）；`3.89` / `4.22 mJ`（`VIN`） | `not_applicable`（`board_metered = true`） | **`63.72 J`（`12.74 W`）对比 `65.07 J`（`13.01 W`）** `VDD_CPU_SOC`（`+1.34 J`/窗口；`VIN`：`344.02` 对比 `350.71 J`，`+6.69 J`/窗口） | **`284.5`（`0` 为空）** 对比 `75,140.8` | **`5.28`** 对比 `10.04` |
| **Intel Core i9-13900H**（`linux_eventfd`，`20t`） | `23.84` / `26.16` | `None`（`board_metered = false`） | **`642.38` / `700.36 µJ`**（`pkg`）；`550.59` / `599.56 µJ`（`core`） | **`25.50 J`（`5.10 W`）对比 `82.00 J`（`16.40 W`）** `pkg`（**`3.22x`**；`core`：`6.27` 对比 `62.52 J`，**`9.97x`**，`4/4` 组配对 `+`） | **`275.5`（`0` 为空）** 对比 `75,035.0` | **`2.45`** 对比 `7.30` |
| **AMD Ryzen AI Max+ 395**（`linux_eventfd`，`32t`） | `33.12` / `31.83` | `None`（`board_metered = false`） | **`201.27` / `156.84 µJ`**（`core`）；`4.76` / `3.78 mJ`（共享 APU `pkg`） | 进程 CPU **`623.7 ms` 对比 `1,040.8 ms`**（**`1.67x`** 降幅；`120.0 W` 的共享 APU 负载掩盖了插座供电轨） | **`279.8`（`0` 为空）** 对比 `75,587.2` | **`2.52`** 对比 `7.39` |
| **Apple M3 Ultra**（`darwin_kqueue_pipe`） | `29.54` / `36.88` | `None`（`board_metered = false`） | **`90.81` / `108.66 µJ`**（`L3` `ri_energy_nj`） | **`0.0261 J`（`5.2 mW`）对比 `0.1624 J`（`32.5 mW`）**（**`6.22x`** `L3` 进程降幅，`4/4` 组配对 `+`） | **`274.8`（`0` 为空）** 对比 `54,132.2` | **`6.82`** 对比 `13.29` |
| **Windows 11 Pro + RTX 2060**（`win32_event_wait`） | `30.50` / `30.90` | `None`（`board_metered = false`） | `255.62` / `259.76 µJ`（空闲 GPU `L2`）；`93.2k` / `95.6k` CPU 周期 | 进程 CPU **`89.84 ms` 对比 `335.94 ms`**（**`3.74x`** 降幅；空闲 GPU `L2` 稳定在 `38.57` 对比 `38.62 J`） | **`268.2`（`0` 为空）** 对比 `54,414.0` | **`2.41`** 对比 `10.35` |

在所有五种硅架构和所有三种操作系统内核（Linux `eventfd`、macOS XNU `kqueue` + `pipe` 以及 Windows NT `Event`）中，`BLAKE3`（`256` 位）+ `Ed25519`（`64` 字节请求评议（RFC）`8032`）验证在 `1 KiB` 时以 `23.84-50.13 µs` 中位数完成，在 `16 KiB` 时以 `26.16-62.24 µs` 完成，同时在隔离处理器轨道上消耗 `< 1 mJ`（`M3 Ultra` `L3` 上为 `90.81 µJ`，`Zen 5` `core` 上为 `201.27 µJ`，`i9-13900H` `pkg` 上为 `642.38 µJ`，以及 **`Jetson AGX Thor` `VDD_CPU_SOC_MSS` 上为 `927.30 µJ` 物理分流 `measured_j`**），在每个主机上均满足 `Falsifier 2`（每边缘 `< 100 µs` 和 `< 5 mJ`）。零时钟阈值唤醒消除了 `100%` 的空轮询唤醒（`0.0` 相对于每个 `5.0 s` 窗口 `53,864-75,307` 个空唤醒），将所有五个主机上的中位提交延迟降低 `1.90x` 至 `4.29x`，并可测量地降低了 `Jetson AGX Thor` 上的物理 `INA3221` `VDD_CPU_SOC_MSS` 功率和能量（`13.01 W -> 12.74 W`，在 `1%` 突发占空比下即使与共享主机共同租户一起，每个 `5.0 s` 窗口仍节省 `+1.34 J` `VDD_CPU_SOC_MSS` 和 `+6.69 J` `INA238` `VIN`），以及 `i9-13900H` 上的 `3.22x` 套接字 `reported_j`（核心上 `9.97x`）和 `M3 Ultra` 上的 `6.22x` 每进程 `reported_j`（支持 `Falsifier 1`）。

<figure class="fig">
  <img src="/figures/communication-avalanche/five-host-fleet-energy-and-des10.svg" alt="两面板暗主题 CTA-E4 五主机舰队能量审计摘要，包括 NVIDIA Jetson AGX Thor INA3221/INA238 measured_j 以及 CTA-E5 十个孤立 AI 范式阵营对比 DES-10 数字酶促合成">
  <figcaption><strong>图 6.</strong> 跨舰队硬件测量和十范式数字酶促合成（<code>DES</code>，实例化为 <code>DES-10</code>）在严格证据分离下（预注册 <code>SHA-256: 3efe6840…</code>）。<strong>左侧（<code>CTA-E4</code>）</strong>：五主机零时钟操作系统事件阈值唤醒对比 <code>1,000 Hz</code> 时钟轮询（<code>5.0 s</code> × <code>4</code> 平衡交替对在 <code>1%</code> 占空比下）以及 <code>50,000</code> 迭代 Rust <code>BLAKE3</code> + <code>Ed25519</code> 验证成本，跨越物理 TI <code>INA3221</code>/<code>INA238</code> 分流 <code>measured_j</code> 在 <code>NVIDIA Jetson AGX Thor</code>（仅 CPU）上和 <code>reported_j</code> 在 <code>Intel Core i9-13900H</code>、<code>AMD Ryzen AI Max+ 395</code>、<code>Apple M3 Ultra</code> 以及 <code>Windows 11 Pro</code> + <code>RTX 2060</code> 上。<strong>右侧（<code>CTA-E5</code>）</strong>：<code>100</code> 任务、五体制通过率、虚假提交率、分离双主机能量以及跨十个独立 AI 阵营（<code>C1</code>-<code>C10</code>）对比 <code>DES-10</code> 的数字酶激活势垒坍缩。</figcaption>
</figure>

<div id="57-cta-e5-ten-siloed-ai-paradigm-camps-versus-immediate-digital-enzymatic-synthesis-des-10" class="anchor-alias" aria-hidden="true"></div>

### 5.7 `CTA-E5`：十个孤立 AI 范式营与即时数字酶合成（`DES-10`）

当代 AI 研究仍然分割成竞争的单机制营：自回归大语言模型（LLM）解码、符号布尔可满足性（SAT）与模理论可满足性（SMT）/ 有限域（FD）求解器、潜在能量基模型（EBM）兼容性评分器、使用上置信上界 1（`UCB1`）的蒙特卡罗树搜索（MCTS）规划器、情景案例存储、进化抽象语法树（AST）突变器、结构因果 `do`-演算引擎、编译查找表（LUT）和有限状态机（FSM）自动机、自然语言（NL）多代理辩论社群以及具身黑箱沙盒爬坡者，每个营都把其局部表征视为通用代理的充分条件。 在生物进化中，多细胞复杂性并未等候某一种细胞吸收所有代谢功能；分泌的信号分子、选择性的间隙连接以及催化酶降低了器官间的激活屏障，使得不同组织能够立即专门化并协同工作。

实验 `CTA-E5` 测试 `CTA` 编排是否能够在所有十个范式之间实现即时 `DES-10` 多器官合成。 使用规范二进制中间表征（IR）帧时，连接上游营 $a$ 与下游营 $b$ 的数字酶定义为四元组：

$$
\mathcal{E}_{a \to b} = \bigl(\Phi_{\mathrm{IR}},\, \mathrm{BLAKE3} + \mathrm{Ed25519},\, V_{\mathrm{gate}},\, \theta_b\bigr),
$$

其中 $\Phi_{\mathrm{IR}}$ 打包规范零拷贝二进制 IR 帧（`DE10` 头部加类型负载字节，消除 NL 文本序列化与重新解析），$\mathrm{BLAKE3} + \mathrm{Ed25519}$ 通过 `cta_fleet_rust` 提供常时间加密证明，$V_{\mathrm{gate}}$ 强制确定性结构和隔离沙箱不变式（对保留的测试预言机 `0` 访问；`Falsifier 3`），$\theta_b$ 仅在上游信号在连续最短路径（SSP）最小成本流调度下跨过阈值时唤醒器官 $b$，该调度在 `15` 个保留校准探针上校准（`cost_lut_10camp.json`，与 `100` 测试任务 `0` 重叠）。 来自演绎与开放世界合成范式的已验证解 **向下在线结晶** 到规范 De Bruijn 情景案例存储（`C5`）。

我们在一个冻结的 `100` 项确定性预言机语料库（`corpus_sha256 = 79b7f7512c3a5e18eb8a13ed5323d7803a9538decf665a213ced6abdf87eb8d2`，每个规则类 `20` 项任务，每台主机 `1,100` 个回合，两台主机共 `2,200` 个经硬件插桩的回合）上，单独评估全部 `10` 个阵营（`C1`-`C10`）与第 11 组（`DES-10`）的对比。实验调用 `GPT-OSS-120B`（生成式预训练 Transformer 开源系列，`temperature = 0.0`），`C1`、`C9` 和 `DES-10` 通过远程应用程序编程接口（API）调用，并以美元（USD）计费。实验同时在 **`Intel Core i9-13900H`**（`RAPL` `reported_j`）和 **`NVIDIA Jetson AGX Thor`**（仅使用 CPU，`TI INA3221` 的 `VDD_CPU_SOC_MSS` 与 `INA238` 的 `VIN` 物理分流器测得的 `measured_j`）两个平台上执行：

- **`R1`（`20` 个任务，情景性 alpha 重命名 Zipf 递归）**：包含 `8` 个既有典型模式的置换与 alpha 重命名实例（共 `16` 个任务），以及 `4` 个新出现的 `R3`/`R5` 模式的重复出现，用于检验在线结晶能力。
- **`R2`（`20` 个任务，位向量、布尔门与协议成帧）**：`6` 至 `10` 位的仲裁奇偶校验，控制器局域网的填充位保护，`3` 态 Mealy 型帧头/帧尾有限状态机，以及 `LUT6` 级联（`16` 字位压缩输出）。
- **`R3`（`20` 个任务，精确演绎/算术/有限域可满足性约束）**：`5` 变量两两互异的整数方程组，取值范围为 `1..8`，综合了顺序约束、加权线性丢番图方程、模同余式和按位异或子句，且具有唯一解。
- **`R4`（`20` 个任务，结构因果模型 `do(X=x)` 与非近视视野规划）**：`10` 个辛普森悖论混杂因果有向无环图（`|P(Y=1|X=1) - P(Y=1|do(X=1))| >= 0.18`），以及 `10` 个 `6` 步欺骗性谷底马尔可夫决策过程（MDP）树。在这些树中，贪心的 `t=0` 奖励会导致后期 `-72` 的惩罚，而 `-5` 的桥接通行费可解锁 `+85..+112` 的峰顶奖励。
- **`R5`（`20` 个任务，开放世界的规范到程序合成）**：根据自然语言规范及 `2` 个公开输入/输出（I/O）示例合成独立的 Python 3 程序，涵盖分块游程编码、平衡转义定界符、字典序的环检测拓扑排序、精确 Farey 分数约分、带并列打破规则的背包问题、广义非互素中国剩余定理（CRT）、最近最少使用（LRU）缓存模拟、嵌套括号解码、`k` 面墙网格最短路径、Horner 模导数以及加权区间调度。合成程序在提交后，依据 `10` 个保留的边界情况和状态隔离测试向量进行评分。

| 范式臂（`100` 个任务 · `C1`/`C9`/`DES-10` 使用 `GPT-OSS-120B`） | 经验证通过（`R1`/`R2`/`R3`/`R4`/`R5`） | 错误提交 | 云 API 调用 / 令牌（`USD`） | `i9-13900H` 本地 / 端到端 `pkg_reported_j` | `i9-13900H` `CpJ_e2e`（`tasks/J`） | `Jetson Thor` 本地 / 端到端 `VDD_CPU_SOC` **`measured_j`**（`VIN` **`measured_j`**） | `Jetson Thor` `CpJ_e2e`（`tasks/J`） |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| `C1` 自回归大语言模型单独运行（`GPT-OSS-120B`） | **`48%`**（`17`/`1`/`1`/`11`/`18`） | `52%` | `100` / `67,146`（`\$0.0359`） | `0.110 J` / `3,637.81 J` | `0.0132` | `0.079 J` / `5,513.77 J`（`28,161.53 J`） | `0.0087` |
| `C2` 符号约束单独运行（`FD/SAT`） | **`30%`**（`0`/`10`/`20`/`0`/`0`） | **`0%`** | `0` / `0`（`\$0.00`） | `0.087 J` / `0.09 J` | `346.6885` | `0.070 J` / `0.07 J`（`0.33 J`） | `429.5963` |
| `C3` 潜在能量模型打分器单独运行（未验证） | **`0%`**（`0`/`0`/`0`/`0`/`0`） | `100%` | `0` / `0`（`\$0.00`） | `5.156 J` / `5.16 J` | `0.0000` | `3.991 J` / `3.99 J`（`17.61 J`） | `0.0000` |
| `C4` 蒙特卡洛树搜索展开搜索单独运行（`UCB1`，`256`） | **`11%`**\*（`0`/`0`/`1`\*`/`10`/`0`） | `19%`\* | `0` / `0`（`\$0.00`） | `0.785 J` / `0.78 J` | `14.0197` | `0.617 J` / `0.62 J`（`2.43 J`） | `16.2199` |
| `C5` 情节式案例存储单独运行（`Shape D`） | **`16%`**（`16`/`0`/`0`/`0`/`0`） | **`0%`** | `0` / `0`（`\$0.00`） | `0.005 J` / `0.005 J` | `3,363.4644` | `0.003 J` / `0.003 J`（`0.012 J`） | `6,254.8866` |
| `C6` 进化式 AST 变异器单独运行（`300` 次评估） | **`4%`**（`0`/`0`/`0`/`0`/`4`） | `20%` | `0` / `0`（`\$0.00`） | `5.959 J` / `5.96 J` | `0.6713` | `4.936 J` / `4.94 J`（`22.13 J`） | `0.8104` |
| `C7` 因果贝叶斯 `do(X)` 引擎单独运行 | **`10%`**（`0`/`0`/`0`/`10`/`0`） | **`0%`** | `0` / `0`（`\$0.00`） | `0.003 J` / `0.003 J` | `3,980.8917` | `0.002 J` / `0.002 J`（`0.007 J`） | `6,506.1809` |
| `C8` 亚符号 `LUT6`/FSM 自动机单独运行 | **`20%`**（`0`/`20`/`0`/`0`/`0`） | **`0%`** | `0` / `0`（`\$0.00`） | `0.010 J` / `0.010 J` | `1,974.7235` | `0.009 J` / `0.009 J`（`0.041 J`） | `2,218.5247` |
| `C9` 多智能体自然语言辩论单独运行（`3` 个智能体） | **`49%`**（`19`/`1`/`0`/`12`/`17`） | `51%` | `300` / `253,968`（`\$0.1282`） | `0.116 J` / `10,913.22 J` | `0.0045` | `0.120 J` / `16,541.19 J`（`84,483.80 J`） | `0.0030` |
| `C10` 具身沙箱扰动单独运行（`200` 次探测） | **`4%`**（`0`/`0`/`0`/`0`/`4`） | `30%` | `0` / `0`（`\$0.00`） | `3.243 J` / `3.24 J` | `1.2334` | `3.045 J` / `3.05 J`（`13.39 J`） | `1.3135` |
| **`DES-10`（数字酶促复合体）** | **`98%`（`20`/`20`/`20`/`20`/`18`）** | **`1%`** | **`22` / `12,745`（`\$0.0067`）** | **`2.155 J` / `802.45 J`** | **`0.1221`** | **`2.760 J` / `1,215.77 J`（`6,208.87 J`）** | **`0.0806`** |

在`Jetson AGX Thor`（`Python 3.12`）上，`C4`得分`10%`通过（`R3: 0/20`，`R4: 10/20`）并产生`20%`虚假提交；所有其他`10`个臂在两台主机上产生相同的任务判决。远程应用程序编程接口（API）服务器焦耳为`not_available`，并通过显式令牌和United States dollars (USD)列与本地`reported_j`和`measured_j`严格分开。

四个定量结果确立了酶促合成论点（`Falsifiers 4`和`5`）：

1. **每个孤立范式在隔离时达到至多`49%`的制度上限**：确定性专家在其原生领域内实现`100%`精度（`0%`虚假提交）和`1,975`至`6,506`任务/J每焦耳相干性（CpJ），`C5`在已知`R1`重复上（`16/20`），`C8`在`R2`布尔/FSM位向量上（`20/20`），`C2`在`R3`多子句约束上（`20/20`），以及`C7`在`R4`辛普森悖论`do(X=1)`干预上（`10/10`），但拒绝更广泛套件的`70%`至`90%`。相反，单次`C1`（`GPT-OSS-120B`）解决了`18/20`开放世界`R5`合成任务，但在`R2`（`1/20`）和`R3`（`1/20`）上幻觉位打包整数和近失约束见证，产生`48%`验证通过和`52%`虚假提交。未验证`C3`EBM评分（校准探针上`6/15`）在样本外崩溃至`0/100`（`100%`虚假提交），通过选择混杂观测和贪婪谷吸引子，而近视`C10`沙盒爬山（`4%`通过）仍被困在`R4`的`a_0 = 0`欺骗谷（`0/10`）。

2. **未经证实的自然语言辩论（`C9`）将能量和令牌乘以`3x`-`3.8x`以获得`+1%`准确性**：在`Proposer -> Critic -> Judge`（`300` LLM调用）间传递会话散文使平均提示长度膨胀`2.21x`（`328.3 -> 415.0 -> 726.8`输入令牌，`253,968`总令牌），将端到端本地能量提高至`10,913.22 J`（`i9-13900H` `reported_j`）和`16,541.19 J`（`Jetson Thor` `VDD_CPU_SOC_MSS` `measured_j`；`84,483.80 J` `VIN`），但将通过率从`48%`提升至`49%`，同时仍提交`51%`错误答案（`R3`上`20/20`错误，`R2`上`19/20`错误）。

3. **数字酶将营地间交接能量和延迟降低 `> 16,000x` 至 `> 155,000x`（`Falsifier 5`）**：在 `Intel Core i9-13900H`（`RAPL` `reported_j`）上，`1 KiB` 的进程内 Rust 数字酶验证耗时 `23.00 µs`、能耗 `0.689 mJ`（跨进程 stdio 签名-验证管道为 `44.43 µs` 和 `1.140 mJ`），相比实时 `Camp 9` NL 序列化及多跳 LLM 重新解析的 `3,577.58 ms` 和 `36.38 J`，实现 **`155,554x` 延迟加速（`80,522x` 管道）** 和 **`52,815x` 套接字能量降低（`31,921x` 管道）**。在 `NVIDIA Jetson AGX Thor`（`INA3221` `VDD_CPU_SOC_MSS` `measured_j`）上，数字酶交接测得 `49.95 µs` 和 `0.732 mJ`（`INA238` `VIN` 为 `3.591 mJ`；跨 stdio 管道 `186.98 µs` 和 `3.406 mJ` `VDD_CPU_SOC_MSS`），相较实时 NL 交接的 `3,938.49 ms` 与 **`55.14 J` `VDD_CPU_SOC_MSS` `measured_j`（`281.61 J` `INA238` `VIN` `measured_j`）**，实现 **`78,855x` 延迟加速（`21,064x` 管道）** 和 **`75,374x` 物理直流分流能量降低（`16,189x` 管道）**。

4. **`DES-10` 立即统一所有十个器官（`98%` 通过，`1%` 错误提交，`9.3x`-`27.1x` 更高 `CpJ`）**：在其 epoch-`0` `SSP` 调度下（`i9-13900H` 为 `3.24 µs`，`Thor` 为 `14.20 µs`）并凭借 `225` 份经验证的 JSON / 二进制 `DE10` 酶收据，`DES-10` 将 `R1`-`R4`（`80` 任务）通过 `C5`、`C8`、`C7`、`C2` 和 `C4 + C2`（`80 / 80 = 100%` 通过，`0` 错误提交，`0` LLM 调用）在 `C5` 中结晶 `4` 条已验证的 `R3`/`R5` 模式，以将 `R1` 从 `16/20`（仅 `C5`）提升至 `20/20`，通过 `C3 + C6 + C10` 本地过滤 `3/20` 的 `R5` 任务（`0` LLM 调用），并在剩余 `17` 条 `R5` 合成任务上严格唤醒 `C1`（共计 `22` 次调用，`12,745` 令牌，`\$0.0067`）。相较于仅 `C1`（`48%`）和 `C9` NL 辩论（`49%`），`DES-10`（`98%`）将已验证准确率提升两倍，将错误提交降低 `51x`-`52x`，将令牌使用量分别降低 `5.27x`（`C1`）和 `19.93x`（`C9`），并使端到端每焦耳相干性提升 **`9.25x`（`i9-13900H` `reported_j`）/ `9.26x`（`Thor` `measured_j`）相较于 `C1`**，以及 **`27.13x`（`i9-13900H` `reported_j`）/ `26.87x`（`Thor` `measured_j`）相较于 `C9`**。

---

<div id="6-resolving-the-10-siloed-ai-camps-via-digital-enzymatic-engineering--the-testable-forcing-function-blueprint" class="anchor-alias" aria-hidden="true"></div>

## 6. 通过数字酶促工程与可检验强制函数蓝图弥合10个相互隔离的AI阵营

<div id="61-atlas-of-the-10-siloed-ai-camps-c1-to-c10-and-the-refutation-of-monocultures" class="anchor-alias" aria-hidden="true"></div>

### 6.1 十个孤立 AI 流派（`C1` 至 `C10`）图谱与对单一范式的反驳

七十六年的人工智能研究（`AI01` 至 `AI38`）产生了十种各异的计算范式（`C1` 至 `C10`）。每一种范式都只优化智能的某一个组成部分，而在其原生适用范围之外，要么失明，要么热力学上高度浪费（见图 7 左栏）。

<figure class="my-8">
  <img src="/figures/communication-avalanche/ten-siloed-ai-camps-map.svg" alt="左栏展示全部 10 个孤立 AI 流派 C1 至 C10，标出每个流派的原生优势与单独运行时的失效模式；右栏展示数字酶促合成 DES-10 如何将全部 10 个流派连接为阈值化的最小成本级联，并伴随向下的结晶过程。" />
  <figcaption><strong>图 7.</strong> 十个孤立人工智能流派（<code>C1</code> 至 <code>C10</code>）与数字酶促合成（<code>DES-10</code>）的对比。每一种孤立的单一范式都会在其结构适用范围之外失效；亚毫焦耳级的数字酶将全部 10 个流派连接为一个阈值化的连续最短路径（<code>SSP</code>）最小费用流级联，并伴随向下的技能结晶（<code>CTA-T32</code> 至 <code>CTA-T45</code>）。</figcaption>
</figure>

| 阵营 ID 与范式 | 历史起源 (`AI01`-`AI38`) | 原生生态位超级能力 (`+`) | 单体单培失败模式 (`-`) | 典型单体能量包络 | 在 `DES-10` 生物体中的角色 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`C1` · 自回归 `LLMs`** | `AI01`, `AI24`-`AI26`, `AI28` | 广义自然语言意图解析与开放式代码/假设合成 | `~15+ J/call`、辛普森混杂以及无外部门控时的 $f^k$ 幻觉漂移 | `~10` 至 `50+ J` / 查询 | **第 3 层开放世界提议者**（严格在 `V_u >= theta_u` 确定性缺失时唤醒） |
| **`C2` · 演绎符号 / `SMT` / `Lean`** | `AI03`, `AI06`, `AI08`, `AI32`, `AI37` | 可靠的机器检查证明与 `0.00%` 错误提交形式保证 | 无法单独摄入原始歧义散文或发明开放世界感知先验 | `0.4` 至 `49 mJ` / 检查 | **第 2 层确定性内核与终端可靠性门控**（`RCE`、`Lean 4`、`AST`） |
| **`C3` · 潜在 `JEPA` / `FormEBM`** | `AI11`, `AI16`, `AI29`, `AI37` | 快速毫焦耳级连续合理性排序（未见 `Forms` 上 `0.8922` `AUROC`） | 连续能量极小值无法单独认证精确离散边缘情况正确性 | `~5` 至 `47.09 mJ` / 排序 | **第 3 层预过滤门控**（在检查器/展开前剪除 `2.39x` 无效候选） |
| **`C4` · `RL` / `MCTS` 树搜索** | `AI14`, `AI18`, `AI20`, `AI23`, `AI34` | 非近视多步序贯前瞻，逃离贪婪局部陷阱 | 在无快速习得价值/能量先验时对高方差展开消耗兆焦耳 | `1` 至 `10^3+ J` / 片段 | **第 3 层序贯规划器**（由 `C3` `FormEBM` 先验与 `C2` 终端规则引导） |
| **`C5` · 情景 `RAG` / `Shape D`** | `AI02`, `AI20`, `AI26`, `AI35` | 亚微秒级 $O(1)$ `1.77 µJ` 内存映射验证召回（`DNULLMM1`） | 余弦 `RAG` 检索无效邻居；精确 `Shape D` 遗漏新颖结构 | `1.77 µJ`（`mmap`）至 `~50 mJ` | **第 1 层冻结验证案例存储**（以零 `FLOPs` 吸收循环出现的 Zipfian 头部） |
| **`C6` · 进化代码搜索** | `AI05`, `AI31`（`FunSearch`） | 种群多样性通过代码变异逃离梯度/提示局部最优 | 无亚毫秒级适应度预筛选时浪费数千次采样器调用 | `10` 至 `10^3 J` / 岛 | **第 3 层组合探索器**（将获胜程序向下晶化至 `C2`/`C5`） |
| **`C7` · 因果 Do-演算 / `DAGs`** | `AI13`（Pearl `DAGs`）、`AI24`（`MPNN`） | 精确干预 $P(Y \mid \mathrm{do}(X))$ 去混杂与后门调整 | 需要类型化因果图模式；无法单独从原始文本提取变量 | `0.5` 至 `10 mJ` / 查询 | **第 2 层因果与图内核**（在策略提交前消除虚假相关） |
| **`C8` · 亚符号 / `SSM` / `LUT6`** | `AI04`, `AI15`, `AI17`, `AI22`, `AI36` | 单周期 `4 ns` 组合 `LUT6`（`81 × RAMB36E2`，`~12 pJ` `est_j`，`0` `FLOPs`） | 每页有界布尔输入宽度；无法单独合成新颖多跳算法 | `~12 pJ` `est_j`（`FPGA`） | **第 0 层物理反射底板**（在 1 个周期内执行晶化的热路径谓词） |
| **`C9` · 多智能体 `NL` 辩论** | `AI09`, `AI10`, `AI28`, `AI30`, `AI33` | 跨专门化角色生成多样化多视角候选分解 | 未验证散文中继遭受 `3.71x` 提示膨胀与 `13.33%` 错误提交（`CTA-E2`） | `~95` 至 `110+ J` / 任务 | **作为传输被替换**；严格保留为并行验证的 `Phi_IR` 提议者 |
| **`C10` · 具身沙盒 / 控制** | `AI02`, `AI27`, `AI28`, `AI31`, `AI38` | 接地物理/执行反馈与重复调用状态泄漏证伪 | 在无上游类型/哈希门控时执行未筛选原始提议不安全或缓慢 | `1.12` 至 `25 mJ` / 预言机 | **终端行为预言机**（`diff_verifier_kernel` 强制 `0` 状态泄漏提交） |

<div id="62-formal-theory-of-digital-enzymes-and-10-camp-pareto-dominance-cta-t32-to-cta-t40" class="anchor-alias" aria-hidden="true"></div>

### 6.2 数字酶的形式理论及 10-Camp 帕累托支配 (`CTA-T32` 到 `CTA-T40`)

在生物化学中，跨越不相容化学中间体的代谢途径，在**酶**将底物结合到精确的过渡态几何构型之前，动力学上一直处于冻结状态。酶能将活化能 $E^\ddagger$ 降低几个数量级，实施立体化学专一性，并且在反应后**完全不被消耗**。当代多智能体人工智能存在与无催化热反应完全对应的数字类比问题：借助自由形式自然语言文本（`Camp C9`，`CTA-E2` 中的 `Arm C`）把范式阵营 $a$ 连接到阵营 $b$，会产生随重试倍增的序列化/解析能量 $k_{\text{retry}} \cdot c_{\text{nl}}$（`~15` 至 `110 J`）、`3.71x` 的上下文膨胀，以及每一跳的语义漂移 $\epsilon > 0$（`CTA-T1`）。

模块 `Avalanche/EnzymaticSynthesis.lean`（`[T]`）在源阵营状态 $\mathcal{S}_a$ 与接收阵营状态 $\mathcal{S}_b$ 之间定义了一个**数字酶** $\mathcal{E}_{a \to b} = (\Phi_{\text{IR}},\, \mathrm{attest\_ok},\, V_{\text{det}},\, \mathrm{decode},\, c_{\text{enz}})$：

1. **规范底物编码器（$\Phi_{\text{IR}} : \mathcal{S}_a \to \mathcal{I}_{ab}$）**：将阵营 $a$ 的内部状态投影为最小化、带模式类型的中间表示（`AST` 补丁差异、`RCE` 规范 `Form`、`DAG` 后门元组或 `DNULLMM1` 密钥），并剥离会话性评论（`3.71x -> 1.00x`）。
2. **恒定时间认证与确定性门控（$\mathrm{attest\_ok} \wedge V_{\text{det}} : \mathcal{I}_{ab} \to \{0,1\}$）**：在总开销 $c_{\text{enz}} < 1\text{ mJ}$（`CTA-E1` 中为 `643-926 µJ`）的条件下，验证 `256` 位 `BLAKE3` 完整性、`64` 字节 `Ed25519` 发送者授权以及确定性的结构可容许性。
3. **催化剂状态不变性与序列复合（`CTA-T32` 至 `CTA-T35`）**：对于任意 $M \ge 1$ 次反应的序列（`runEnzymaticChain`），酶实例在结构上保持不变（$\mathcal{E}' = \mathcal{E}$，权重零变异）。当 $c_{\text{enz}} < c_{\text{nl}}$ 时，每次交接的活化能降低量为 $\Delta E^\ddagger = k_{\text{retry}} c_{\text{nl}} - c_{\text{enz}} > 0$（`CTA-T32`）；跨 $M$ 次交接线性节省 $M \cdot \Delta E^\ddagger$ 焦耳（`CTA-T33`）；与无催化散文漂移 $M\epsilon > 0$ 相比，传播的未经验证语义漂移为**零**（`CTA-T34`）；并且在多器官链 $\mathcal{E}_2 \circ \mathcal{E}_1$ 上满足结合律，节省量可加，即 $\Delta E^\ddagger_1 + \Delta E^\ddagger_2$（`CTA-T35`）。

借助跨 $K \ge 2$ 个范式阵营（实例化为 $K = \mathrm{TenCamps} = 10$）且成本低于 $< 1\text{ mJ}$ 的数字酶，以及 $R \ge 1$ 个任务场景，其中验证通过指示符为 $p(k, r) \in \{0, 1\}$，执行焦耳数为 $c(k, r) > 0$，可执行的**酶促生态位路由器**（`selectNicheCamp`）按如下方式选择：

$$k^*(r) \in \arg\min_{k \in \{1,\dots,K\}} \bigl\{\, c(k, r) \;\big|\; p(k, r) = 1 \,\bigr\}, \qquad E_{\text{DES}}(r) = c\!\left(k^*(r),\, r\right) + c_{\text{enz}}.$$

源自五个经内核检验的定理，说明了为何**数字酶促合成（`DES-10`）**严格优于每一种孤立的 AI 单一培养范式（`[T]`）：
- **覆盖并集（`CTA-T36`）**：对于每个环境 $r$ 和单一求解阵营 $k_0$，都有 $\mathrm{Pass}_{\text{DES}}(r) = \bigvee_{k=1}^K p(k, r) \ge p(k_0, r)$；而当 $p(k_0, r) = 1$ 时，又有 $c(k^*(r), r) \le c(k_0, r)$。
- **严格全局通过优势，单一培养范式的反驳（`CTA-T37`）**：若每个环境 $r \in \{1,\dots,R\}$ 都至少被一个专业阵营解决，而不存在能解决全部 $R$ 个环境的单一阵营（$\forall k,\, \exists r,\, p(k, r) = 0$），则 `DES-10` 可实现完整的全局覆盖 $R$，并严格超过每一个单一阵营：$\sum_r p(k_0, r) < \sum_r \mathrm{Pass}_{\text{DES}}(r) = R$。
- **严格总焦耳与 `CpJ` 优势（`CTA-T38`、`CTA-T39`）**：即使与一个理想化的通用阵营 $k_{\text{univ}}$ 相比（该阵营可解决全部 $R$ 个环境，例如在每项语法、作用域、因果和证明任务上都调用前沿模型），只要累积的细分领域节省量超过路由开销，`DES-10` 消耗的总焦耳数仍严格更少（$E_{\text{DES}} < E_{\text{solo}}$），且每焦耳相干性也严格更高（$\mathrm{CpJ}_{\text{DES}} > \mathrm{CpJ}_{\text{solo}}$）：
  $$\sum_{r=1}^{R} \bigl(c(k_{\text{univ}}, r) - c(k^*(r), r)\bigr) > R \cdot c_{\text{enz}}.$$
  在 `CTA-E2`（`60` 个任务）上，`c_enz < 1 mJ`，而在 40 个类别 1/2 任务上，$c(k_{\text{univ}}, r) - c(k^*(r), r) \approx 15\text{ J}$，超过 `CTA-T38` 阈值的 10,000 倍以上。
- **零等待单遍校准（`CTA-T40`）**：确定 $k^*(r)$ 无需任何梯度训练轮次。一次确定性的剖析遍历（共 $K \cdot m$ 次探测，$m \ge 1$）即可填充 `cost_lut.json`，并立即以构造方式证明 $k^*(r)$。

<div id="worked-example-4-ten-camp-digital-enzymatic-synthesis-des-10-on-a-confounded-causal--exact-integer--code-generation-task" class="anchor-alias" aria-hidden="true"></div>

### 工作示例 4：十营数字酶促合成（`DES-10`）在混杂因果 + 精确整数 + 代码生成任务上的应用

考虑一个复合操作分诊查询，该查询耦合三种不同的推理模式：(a) 按工作负载严重程度 $Z \in \{\text{Light}, \text{Heavy}\}$（`50%` 基础流行率各占一半）进行分层的自然语言事件日志，(b) 精确有理干预估计 $P(Y=1 \mid \mathrm{do}(X=x))$，以及 (c) Python 整数配额分配 `allocate_quota(budget_units: int) -> tuple[int, int]`：

- **观测分层计数（`800` 总事件）**：
  - 在 $Z = \text{Light}$ 下：`Policy X=1` 成功 `81 / 90`（`90.00%`），而 `Policy X=0` 成功 `266 / 310`（`85.81%`）。
  - 在 $Z = \text{Heavy}$ 下：`Policy X=1` 成功 `192 / 310`（`61.94%`），而 `Policy X=0` 成功 `50 / 90`（`55.56%`）。
  - **混杂池化陷阱**：由于操作员将 `310 / 400`（`77.5%`）的 `X=1` 运行路由到 `Heavy` 事件，朴素未调整条件化逆转了真实效应：$P(Y=1 \mid X=1) = 273 / 400 = 68.25\% < P(Y=1 \mid X=0) = 316 / 400 = 79.00\%$（辛普森悖论）。

1. **为何孤立 AI 营地单独失败**:
   - **`Camp 1`（自回归 `LLM` 单独，`~15.0 J`）**：比较合并经验率 `79.00% > 68.25%` 或对浮点中间值四舍五入不一致，推荐劣化的 `Policy X=0`（`-5.29` 百分点真实干预损失）。
   - **`Camp 2`（演绎符号/可满足模理论 (`SMT`) 单独）**：需要预先形式化的 `DAG` 与精确有理约束；在输入解析时拒绝原始散文事件日志。
   - **`Camp 5`（情景检索增强生成 (`RAG`) / 二进制内存映射存储 (`DNULLMM1`) 单独，`1.77 µJ`）**：对未见的 `(Z -> X, Z -> Y, X -> Y)` 变量模式计算规范结构哈希，发现一次查找 `miss`，并放弃。

2. **`DES-10` 如何通过 `< 1 mJ` 数字酶解决复合任务**:
   - **步骤 `1`（`C5` 探针 → `C1` 模式解析器）**：`DNULLMM1` 查找（`1.77 µJ`）返回 `miss` 并触发 `eventfd` 唤醒受限的 `C1` 文法解析器（`parse_kernel` + 模式提取器），其输出规范中间表示 (`IR`) $\Phi_{\text{IR}} = (\text{DAG}: \{Z \to X, Z \to Y, X \to Y\},\; \text{table}: ((81,90),(266,310),(192,310),(50,90)))$，不含散文注释。
   - **步骤 `2`（数字酶 $\mathcal{E}_{1 \to 7}$：`643 µJ`，`26.0 µs`）**：验证 `BLAKE3` + `Ed25519` 签名，检查 `DAG` 的无环性，并确认精确行和守恒（`400 + 400 = 800`）。
   - **步骤 `3`（`C7` Do-Calculus 后门内核：`0.64 mJ`）**：识别 $\{Z\}$ 为有效后门调整集，阻断 $X \leftarrow Z \to Y$，并评估精确有理干预成功率：
     $$P(Y=1 \mid \mathrm{do}(X=1)) = \frac{1}{2}\!\left(\frac{81}{90} + \frac{192}{310}\right) = \frac{471}{620} \approx 75.97\%, \qquad P(Y=1 \mid \mathrm{do}(X=0)) = \frac{1}{2}\!\left(\frac{266}{310} + \frac{50}{90}\right) = \frac{986}{1{,}395} \approx 70.68\%,$$
     得到精确正向因果提升 $\Delta_{\text{do}} = \frac{471}{620} - \frac{986}{1{,}395} = +\frac{295}{5{,}580} \approx +5.29\%$，严格倾向 `X=1`。
   - **步骤 `4`（数字酶 $\mathcal{E}_{7 \to 2}$ + `C2` 精确见证 + `C10` 沙箱门：`18.15 mJ`）**：$\mathcal{E}_{7 \to 2}$（`651 µJ`）将 `(x_opt = 1, lift = 295/5580)` 传递给 `C2` 确定性代码合成（`15.73 mJ`），后者输出整数守恒的 `allocate_quota`，并由 `C10` `diff_verifier_kernel`（`1.12 mJ`，`0` 状态泄漏）在 `8` 个边界预算（`0, 1, 7, 100, ...`）上验证, , 本地内核 + 酶管线总计 **`19.44 mJ`**，`< 50 mJ`。
   - **步骤 `5`（向下结晶回 `C5`）**：经验证的规范映射结晶回 `DNULLMM1`，因此每次该混淆三元分流模式的后续到达仅消耗 **`1.77 µJ`**（`0` 解析器或求解器调用）。

<div id="63-the-5-loop-testable-forcing-function-blueprint-and-4-tier-downward-crystallization-cta-t41-to-cta-t45" class="anchor-alias" aria-hidden="true"></div>

### 6.3 5 回路可检验强制函数蓝图与 4 层向下结晶（`CTA-T41` 至 `CTA-T45`）

静态路由覆盖十个阵营，可捕获即时的单任务节省（`CTA-T38`）。但生物与文化演化依靠**闭环向下强制函数**获得复合指数增益：高能探索性解决方案只需验证一次，便被逐步编译进低能确定性基底（`Figure 8`）。令四个执行层的每次到达能量严格有序，满足 $c_3 > c_2 > c_1 > c_0 > 0$（`EnzymaticSynthesis.lean` 中的 `FourTierCosts`）：
- **第 3 层（`c_3 ~ 10-50+ J` · 前沿合成与搜索）**：阵营 `C1`、`C4` 与 `C6`（`LLMs`、`MCTS`、进化代码岛），由 `C3`（`FormEBM`，`47.09 mJ`）预先筛选。
- **第 2 层（`c_2 ~ 0.4-49 mJ` · 已验证的符号与因果规则）**：阵营 `C2` 与 `C7`（`AST`/`SMT` 修复内核、`RCE` 规范检查器、`DAG` 后门调整）。
- **第 1 层（`c_1 ~ 1.77 µJ` · 冻结的情景案例存储）**：阵营 `C5`（`Shape D` `DNULLMM1` 零拷贝 `POSIX mmap` 哈希表）。
- **第 0 层（`c_0 ~ 12 pJ` `est_j` · 单周期硬件自动机）**：阵营 `C8`（`xck26` 上的 `81 × RAMB36E2` Beneš 路由 `LUT6` 页，`0` 个 `DSP48E2` 切片）。

<figure class="my-8">
  <img src="/figures/communication-avalanche/digital-enzymatic-forcing-function.svg" alt="左侧面板以 log10 焦耳为单位绘制计算活化能垒，从约 110 J 的未验证对话下降到小于 1 mJ 的数字酶门控与 1.77 uJ 的结晶案例井；右侧面板详述 5 回路闭环强制函数蓝图。" />
  <figcaption><strong>图 8.</strong> 计算反应坐标能垒的降低（<strong>左</strong>，<code>CTA-T32</code> 至 <code>CTA-T35</code>）与 5 回路闭环向下强制函数蓝图（<strong>右</strong>，<code>CTA-T41</code> 至 <code>CTA-T45</code>），驱动重复性工作负载从 <code>~15 J</code> 的第 3 层合成向下，降至 <code>1.77 µJ</code> 的情景回忆与 <code>~12 pJ</code> 的 <code>est_j</code> 单周期 <code>LUT6</code> 反射。</figcaption>
</figure>

以下 **5 回路可检验强制函数蓝图** 将全部十个阵营连接为一个自我收紧的热力学棘轮：

1. **`Loop 1`，通用可证明封装（`Phi_IR` + `BLAKE3` + `Ed25519`）**：每条阵营间边都用规范的 `Phi_IR` 载荷替代自由格式的对话文本，该载荷携带 `256` 位 `BLAKE3` 摘要和 `64` 字节 `Ed25519` 签名（`25.95-37.39 µs`，`643-926 µJ`，在 `CTA-E3`、`CTA-T16`-`CTA-T18` 中实现 `0 / 200` 次拜占庭逃逸）。
2. **`Loop 2`，单遍校准与 `SSP` 生态位路由器**：一次 `K * m` 剖析遍历（`CTA-T40`）填充 `cost_lut.json`，其数据来自 `RAPL` 的 `reported_j`，或来自内联分流器的 `measured_j`。Bellman-Ford 节点势能加上 Johnson 约化代价 Dijkstra（`SSP`）可在 `2.11 µs` 内计算出精确的最小代价流路由（节点失效故障转移时为 `2.40 µs`，`CTA-T24`-`CTA-T28`）。
3. **`Loop 3`，验证器门控的新颖性升级（`eventfd` + `FormEBM`）**：当膜电位 $V_u < \theta_u$ 时，下游 Tier-3 节点通过 `eventfd` 在操作系统内核中阻塞，CPU 周期为零（`CTA-T7`-`CTA-T10`）。只有确定性的 Tier-0/1/2 未命中会越过 $\theta_u = 1.0$。此时 `Camp C3`（`FormEBM`，`47.09 mJ`）对候选 `Forms` 排序（`AUROC` 为 `0.8922`），从而将下游检查器和 rollout 调用次数减少 `2.39` 倍，然后再唤醒 `C1`/`C4`/`C6`。
4. **`Loop 4`，自动向下结晶（`C1/C4/C6 -> C5 -> C2 -> C8`）**：每个新候选都必须通过终端可靠性校验与沙箱重复调用门（`C2` + `C10`，`0 / 60` 次错误提交）。一旦经验证的结构见证在阈值 $\tau_j$ 次到达中反复出现，`promoteVerifiedTier` 就会向下编译它：`Tier 3 -> Tier 2` 为规则提取，`Tier 2 -> Tier 1` 为 `DNULLMM1` 槽位冻结，`Tier 1 -> Tier 0` 为经等价性检验的 `LUT6` 真值表页。一次性编译成本为 $E_{\text{comp}, j}$，且四个层级之间的语义可靠性得以保持（`CTA-T44`，以**零公理**证明）。
5. **`Loop 5`，硬件供电轨/计数器焦耳账本与命中率自动剪枝**：每次触发都会追加一条哈希链式焦耳回执（`pkg_reported_j`、`core_reported_j`、`psys_reported_j`，以及已接入的内联 `INA238`/`INA260` `measured_j`），并在滑动窗口 $N$ 上审计每个已编译技能。根据**定理 `CTA-T45`（`downward_compilation_falsifier_hit_rate_iff`）**，一个向下编译的技能在 $N$ 次到达中有 $H$ 次命中，当且仅当其经验命中率 $h = H / N$ 严格超过精确的证伪下界时，才能严格回本：
   $$h > h_{\min} = \frac{E_{\text{comp}}}{N \cdot (c_{\text{high}} - c_{\text{low}})}, \qquad \text{and fails to pay back iff } h \le h_{\min}.$$
   任何满足 $h \le h_{\min}$ 的已编译规则都会自动从 `cost_lut.json` 中逐出，以防止分布偏移下的缓存膨胀；而保留下来的技能会使边际任务能耗从 $c_3$ 单调下降到 $c_0$（`CTA-T41`，`CTA-T42`）。

<div id="worked-example-5-closed-loop-forcing-function--exact-1000-arrival-zipfian-downward-crystallization-trajectory-cta-t23-cta-t41-cta-t45" class="anchor-alias" aria-hidden="true"></div>

### 工作示例 5：闭环强迫函数、精确 `1,000` 次到达的 Zipfian 向下结晶轨迹（`CTA-T23`、`CTA-T41`、`CTA-T45`）

跟踪 `M = 1,000` 个顺序任务到达，这些到达分布在 `K = 22` 个结构等价类上，采用偏斜的 Zipfian 工作负载（`4` 个热门有限域类分别接收 `260`、`115`、`80`、`65` 次到达，共 `520` 次；`18` 个中等类共接收 `480` 次到达，每个类被观测到 $\ge 8$ 次）：

1. **四级执行层级和每次调用能耗**：
   - **第 `3` 级（前沿 `LLM` 升级）**：$c_3 = 15.000\;\text{J/task}$（`CTA-E2` `Arm B` 测得 `15.30 J` `pkg_reported_j`/验证任务）。
   - **第 `2` 级（合成符号 / AST 规则）**：$c_2 = 0.0150\;\text{J/task}$（`15.0 mJ`，匹配 `det_patch_kernel` `15.73 mJ`），加上 `< 0.7 mJ` 信道认证 = `0.0157 J`。
   - **第 `1` 级（`DNULLMM1` 二进制内存映射案例存储 `[same house]`）**：$c_1 = 1.77 \times 10^{-6}\;\text{J/task}$（`1.77 µJ` mmap 探测；带跨进程 `Ed25519` 信封时为 `644.8 µJ`）。
   - **第 `0` 级（`xck26` 36-Kbit 块 RAM（`RAMB36E2`）分页 `LUT6` 电路 `[same house]`）**：$c_0 = 1.2 \times 10^{-11}\;\text{J/task}$（`~12 pJ` 分析 `est_j` 单周期 `4.0 ns` 求值；`board_metered = false`）。

2. **精确盈亏平衡摊销步骤（$N^*$、`CTA-T23` / `CTA-T41`）**：
   - 将已验证的第 `3` 级解决方案提炼为可重用的第 `2` 级规则的成本为 $E_{\text{synth},3\to 2} = 0.450\;\text{J}$，由此得到的盈亏平衡重复计数为：
     $$N^*_{3\to 2} = \left\lceil \frac{E_{\text{synth},3\to 2}}{c_3 - c_2} \right\rceil = \left\lceil \frac{0.450}{15.000 - 0.015} \right\rceil = \lceil 0.03003 \rceil = \mathbf{1\;\text{repeat arrival}},$$
     在该类的下一次出现时即可完全收回其全部合成成本。
   - 将经过 `3` 次验证的第 `2` 级规则冻结到 `DNULLMM1` 第 `1` 级槽位的成本为 $E_{\text{synth},2\to 1} = 0.045\;\text{J}$，在 $N^*_{2\to 1} = \lceil 0.045 / (0.015 - 0.00000177) \rceil = \mathbf{4\;\text{subsequent hits}}$ 时达到盈亏平衡。
   - 将 `4` 个热门有限域类（在累计 `50` 次命中之后）分别编译为常驻 `LUT6` 页面的成本为 $E_{\text{synth},1\to 0} = 0.250\;\text{J}$（`4` 个类总计 `1.000 J`）。

3. **累计 `1,000` 次抵达能量账单 vs. 单体基线**：
   - **单体 Tier-`3` 基线（`1,000` 次 `LLM` 调用）**： $E_{\text{mono}} = 1{,}000 \times 15.000\;\text{J} = \mathbf{15{,}000.00\;\text{J}}$，得到 $\mathrm{CpJ}_{\text{mono}} = 1{,}000 / 15{,}000 = \mathbf{0.0667\;\text{tasks/J}}$。
   - **向下结晶级联（`1,000` 次已验证求解，`0` 次错误提交）**：
     - `22` 次首次新类缺失（Tier-`1/2` 缺失 `0.002 J` + Tier-`3` `15.000 J` + 规则蒸馏 `0.450 J`）：`22 x 15.452 J = 339.944 J`。
     - `66` 次第二至第四次抵达遍及 `22` 类的 Tier `2`（`66 x 0.0157 J = 1.036 J`）+ `22` 次 Tier-`1` `DNULLMM1` 槽冻结（`22 x 0.045 J = 0.990 J`）：`2.026 J`。
     - `576` 次 Tier-`1` `DNULLMM1` 命中（`184` 次 pre-`LUT6` 命中在 `4` 个热点类 + `392` 次其余命中在 `18` 个中等类，包含完整 `644.8 µJ` 跨进程验证信封）+ `4` 次 Tier-`0` 页面编译（`1.000 J`）：`0.371 J + 1.000 J = 1.371 J`。
     - `336` 次后提升 Tier-`0` `LUT6` 命中在 `4` 个热点类（`336 x 12 pJ`）：`4.03 nJ`（`0.000000004 J`）。
     - **级联总能量**： $E_{\text{cascade}} = 339.944 + 2.026 + 1.371 = \mathbf{343.34\;\text{J}}$，实现 $\mathrm{CpJ}_{\text{cascade}} = 1{,}000 / 343.34 = \mathbf{2.913\;\text{tasks/J}}$，在 `1,000` 任务视野内产生 **`43.69x` 累计 `CpJ` 乘增**，以及 **`1.25 x 10^{12}x` 边际能量下降**（`15.0 J -> 12 pJ` `est_j`）于结晶热点路径（`CTA-T45`）。

<div id="64-provable-month--quarter--year--decade-horizon-roadmap-hm01-to-hd04" class="anchor-alias" aria-hidden="true"></div>

### 6.4 可证明的 `Month / Quarter / Year / Decade` 时域路线图（`HM01` 至 `HD04`）

定理 **`CTA-T43`**（`horizon_cpj_monotonicity_month_quarter_year_decade`）证明：一旦将初始发现与向下编译能量 $E_{\text{init}} > 0$ 投入稳态成本为 $c_0$ 的已验证结晶内核，累积每焦耳相干性 $\mathrm{CpJ}(T) = (q \cdot T) / (E_{\text{init}} + T \cdot c_0)$ 便会在每个逐步拓宽的运行时间尺度 $0 < t_{\text{month}} < t_{\text{quarter}} < t_{\text{year}} < t_{\text{decade}}$ 上**严格单调递增**：

$$\mathrm{CpJ}(t_{\text{month}}) < \mathrm{CpJ}(t_{\text{quarter}}) < \mathrm{CpJ}(t_{\text{year}}) < \mathrm{CpJ}(t_{\text{decade}}).$$

目录 `openie-research-experiments/communication-avalanche/catalogs/enzymatic-horizon-roadmap.csv`（`HM01` 至 `HD04`，共 `18` 个里程碑；`Figure 9`）将 `CTA-T32`-`CTA-T45` 定理，以及预先注册的临床与神经技术门控 `CA-H6`-`CA-H8`，转化为细粒度、可证伪的路线图，覆盖第 `1-3` 个月、第 `1-4` 季度、第 `1-5` 年以及第 `1` 个十年（`2026-2036`）。

<figure class="my-8">
  <img src="/figures/communication-avalanche/month-quarter-year-decade-roadmap.svg" alt="四列时域路线图，覆盖第 1-3 个月、第 1-4 季度、第 1-5 年及第 1 个十年（2026-2036），包含目标 CpJ 条形图、Lean 定理锚点以及红色证伪终止标准。" />
  <figcaption><strong>图 9.</strong> 可证伪的时域路线图，覆盖<strong>第 1-3 个月</strong>（<code>HM01</code>-<code>HM04</code>）、<strong>第 1-4 季度</strong>（<code>HQ01</code>-<code>HQ04</code>）、<strong>第 1-5 年</strong>（<code>HY01</code>-<code>HY06</code>）以及<strong>第 1 个十年，2026-2036</strong>（<code>HD01</code>-<code>HD04</code>）。图中将已执行的内核与硬件结果（<code>[E]</code>/<code>[T]</code>）与针对推测性临床及神经衔接时域（<code>[S]</code>）的明确红色终止标准配对呈现。</figcaption>
</figure>

| ID 与窗口 | 里程碑与桥接孤岛 | 强制函数机制与精益锚点 | 定量门控度量 | 证伪器 / 红色终止准则 | 状态 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`HM01`** 月 `1` | **认证 `Phi_IR` 总线与零时钟 `eventfd`** (`C9 -> C2 -> C10`) | `Loop 1` + `V_u >= theta_u` (`CTA-T7`-`CTA-T10`, `CTA-T16`-`CTA-T18`, `CTA-T32`-`CTA-T35`) | `25.95-37.39 µs` (`643-926 µJ` `reported_j`); `0` 空轮询; `2.21x` `1%`-占空比能耗削减; `200/200` 故障阻断 | 边缘验证 `> 100 µs` 或 `> 5 mJ`; 损坏提交 `> 0`; 或 `eventfd` 未能实现 `1%`-占空比焦耳胜出 (`Falsifiers 1, 2, 5`) | **已验证 `[T/E]`** (`CTA-E1`, `CTA-E3`) |
| **`HM02`** 月 `1-2` | **单遍 `cost_lut.json` 与 `SSP` 利基路由器** (`C2+C5+C7 -> C1`) | `Loop 2` + `Loop 3` (`CTA-T19`-`CTA-T22`, `CTA-T24`-`CTA-T28`, `CTA-T36`-`CTA-T40`) | `2.11 µs` `SSP` (`2.40 µs` 故障转移); `59/60` (`98.33%`) 通过, `0/60` 虚假提交, `2.09x` / `14.97x` `CpJ` | `SSP` 故障转移 `> 100 µs`, 虚假提交 `> 0%`, 或 `CpJ <= 1.0x` 单片 `LLM` (`CA-H6` / `Falsifier 4`) | **已验证 `[T/E]`** (`CTA-E2`, `CTA-E3`) |
| **`HM03`** 月 `2` | **冻结 `Shape D` (`DNULLMM1`) `CI` 案例结晶器** (`C1/C10 -> C5`) | `Loop 4` 层级 `3/2 -> 1` (`CTA-T3`-`CTA-T6`, `CTA-T23`, `CTA-T41`, `CTA-T44`) | `1.77 µJ` $O(1)$ `POSIX mmap` 查找; `0` 测试时 `LLM` 调用于结晶类; 冻结 `SHA-256` | 任何未验证输出, 测试时字节突变, 或 `> 4 KiB` / `> 50k`-操作类归约器 | **已验证 `[T/E]`** (`Shape D`) |
| **`HM04`** 月 `3` | **双轨焦耳账本与命中率自动剪枝** (`C1`-`C10` 集群) | `Loop 5` 收据 + 驱逐 (`CTA-T20`, `CTA-T41`, `CTA-T45`) | 前/后安静漂移 `<= 10.0%` (`9.93%` `CTA-E2`); 自动驱逐技能若 $h \le h_{\min}$ | 漂移 `> 10.0%` 声称为净焦耳 (`Falsifier 6`) 或未摊销 $h \le h_{\min}$ 被保留 (`CTA-T45`) | **已验证 `[T/E]`** (`CTA-E4` 5主机 + `Thor` `INA238`/`INA3221` `measured_j`) |
| **`HQ01`** 季度 `1` | **完整 `DES-10` 十营 `Phi_IR` 统一** (`All C1`-`C10`) | `Loop 1` + `Loop 2` 顺序酶 (`CTA-T35`-`CTA-T40`) | `100%` `DES-10` 体制联合其中每个单独营 `< 85%`; `15x-30x` `CpJ` 对通用 `LLM` | 任何单个单独单培养匹配 `100%` 通过率在 `<= DES-10` 焦耳 (`CTA-T37`/`CTA-T38`) | **已验证 `[T/E]`** (`CTA-E5` `DES-10` `98/100` 对 `<=49%` 单独, `9.3x-27.1x` `CpJ`) |
| **`HQ02`** 季度 `2` | **`FormEBM` 预过滤门控 `MCTS`, `FunSearch` 与 `RCE`** (`C3 -> C4/C6 -> C2`) | `Loop 3` 潜在排序 (`CTA-T21`, `CTA-T22`, `CTA-T34`, `CTA-T35`) | `>= 0.85` 未见形状 `AUROC` (`0.8922` 在 `47.09 mJ`); `>= 2.3x` 更少 `~49 mJ` 校验器调用 (`2.39x`) | 预过滤导致终端验证求解率下降 `> 1.0%` 或未能满足 $E_{\text{gate}} < F E_{\text{down}}$ (`CTA-T21`) | `FormEBM-v3` 已验证 `[E]` (`0.9437` `AUROC`); 搜索钩子已排队 |
| **`HQ03`** 季度 `3` | **自动化 `Tier 3 -> 2 -> 1` 技能结晶器** (`C1/C4/C6 -> C7/C2 -> C5`) | `Loop 4` 递归提升 $\ge \tau_j$ (`CTA-T41`, `CTA-T42`, `CTA-T44`, `CTA-T45`) | `1,000`-任务 `Zipf(0.85)` 流: `>= 80%` 闭合 `<= 16 mJ`, `>= 15x` 更少 `Tier 3` 唤醒 (`16.67x`), `25x-60x` `CpJ` | 提升的 `Tier 2` 规则导致 `>= 1` 回归 (`CTA-T44`) 或未能通过 $E_{\text{comp}}$ 回馈于 $N=1,000$ | 3档流已验证 `[E]`; 泛化器活跃 |
| **`HQ04`** 季度 `4` | **`KV260` 板级计量 `Tier 1 -> 0` `LUT6` 闭合** (`C5/C2 -> C8`) | `Loop 4` + `Loop 5` `81 × RAMB36E2` (`CTA-T41`-`CTA-T45`) | `>= 250 MHz` `xck26` (`0` `DSP48E2`), `1`-周期页切换, `100%` 奇偶校验, `INA260` `measured_j` `> 100x` 低于 CPU | 时序 `< 250 MHz`, `DSP48E2 > 0`, `< 100%` 奇偶校验, 或 `INA260` `measured_j` 未能实现 CPU `Tier 1` 胜出 | `RTL` 已审计; Vivado `.lic` 与 `INA260` 已排队 |
| **`HY01`** 年 `1-2` | **携带证明的自维护 `OS` / 编译器织构** (`C1+C6 <-> C2 <-> C5/C8`) | `Loops 1-5` 跨越 $10^5$-$10^6$ `SLOC` (`CTA-T5`, `CTA-T6`, `CTA-T39`, `CTA-T43`, `CTA-T44`) | `100%` 证明认证提交 (`0` `CVE` 回归); `>= 100x` `CpJ`; $\mathrm{CpJ}(\text{Year}) > \mathrm{CpJ}(\text{Quarter})$ | 准许提交违反安全不变量或 12个月 `CpJ` 未能实现严格视界增长 (`CTA-T43`) | 计划 `[T-Anchored]` |
| **`HY02`** 年 `2-3` | **异步零时钟 `LUT6` + 密码硅瓦** (`C8+C3+C2`) | 硬件阈值累加器 (`CTA-T7`-`CTA-T10`, `CTA-T16`-`CTA-T18`, `CTA-T42`) | `< 10 nJ` 硬件认证切换; `~0` 空闲时钟功耗; `250x-500x` `measured_j` 边缘 `CpJ` | `1%`-占空比泄漏 + 握手功耗 `>= 50%` 时钟 `ASIC` 基线 (`CTA-T10`) | 计划硅 `[S/T]` |
| **`HY03`** 年 `2-3` | **联邦零原始数据密码技能公域** (`C5+C2+C7`) | 跨组织验证内核共享 (`CTA-T5`, `CTA-T6`, `CTA-T34`, `CTA-T44`) | `100%` 移除后技能保留 (`CA-H5`); `0%` 木马接受; `0` 私有数据泄漏 | 联邦摄入准许 `> 0%` 木马回归或泄漏私有训练记录 | 计划 `[T/M-Anchored]` |
| **`HY04`** 年 `3-4` | **单用户双向 `BCI` `> 39 bit/s`** (`BM07/08 + BM09/12 + C3/C8`) | 亚`10 mW` 植入潜在循环 (`CTA-T7`-`CTA-T10`, `CTA-T29`) | `FDA` `IDE` 试验: `> 39 bit/s` 双向互信息 (`< 50 ms` 延迟, `< 15 mW` 植入) | 双向 `ITR <= 19 bit/s` (`BM07` 上限), `> 1 °C` 升温, 或安全违规 (`CA-H7`) | 推测 `[S]` |
| **`HY05`** 年 `3-5` | **硬件本地主权门 (`g_i = 1`) 二元 `BCI`** (`BM15/16 -> BM18`) | 物理接收者防火墙 `bridgedStep` (`CTA-T29`-`CTA-T31`) | `0 / 10,000` 写入泄漏在 $g_i = 0$; 盲认证 `>= 0.90`; 二元加速在 $g_i = 1$ | **立即终止** 若 $g_i = 0$ 泄漏 `> 0` 状态扰动或认证 `< 0.90` (`CA-H7`) | 推测 `[S + T]` |
| **`HY06`** 年 `3-5` | **`GMP` I/II期人鼻内 `EV` 试验** (`EV01`-`EV16` + `C7/C3`) | 批次认证 `GMP` `sEV` 效力门 (`CTA-T3`, `CTA-T16` 模拟) | `< 10%` 批次效力方差, `0` 致癌 `miR-290`, 人类 `CNS` `PET`/体液靶点接合 | 人类鼻内给药未能实现 `CNS` 靶点接合高于假对照或显示毒性 (`CA-H8`) | 推测 `[S]` |
| **`HD01`** `2031-2036` | **行星零回归酶公域 (`> 1,000x CpJ`)** (`C1`-`C10`) | 全局 `Tier 3 -> Tier 0/1` 收敛 (`CTA-T42`-`CTA-T45`) | `> 95%` 循环世界计算在 `pJ-µJ` `Tier 0/1`; `> 1,000x` `measured_j` `CpJ` 对 `2026` `LLMs` | 真实世界漂移将 `Tier 0/1` 命中率永久钉在 `<= h_min` (`CTA-T45`) | 十年目标 `[S/T]` |
| **`HD02`** `2032-2036` | **跨脑流形对齐酶 ($N \ge 3$)** (`BM18 + C3 + C2`) | 受试者特异 `Phi_brain` 潜在酶 (`CTA-T30`-`CTA-T32`, `CTA-T34`) | $N \ge 3$ 同意用户在 `> 39 bit/s`, `>= 0.95` 保真度, `>= 0.90`  authorship, `>= 24`-月稳定性 | 禁止性每日重校准, 胶质增生 `SNR` 崩溃 `< 24` 月, 或目标覆写 (`CTA-T31`/`CA-H7`) | 推测 `[S]` |
| **`HD03`** `2032-2036` | **多中心双盲 III期人类 `EV` `RCTs`** (`CL01/CL23`) | III期临床证伪门 (`CA-H8`) | `n >= 300` 双盲 `RCT` 在 $p < 0.01$ 优于假对照载体于 `12-24`-月 `AD`/`PD`/`TBI` 终点 | 主要人类终点未能优于假对照载体在 $p < 0.01$ 或 `24`-月安全性 (`CA-H8`) | 推测 `[S]` |
| **`HD04`** `2034-2036` | **混合合成生物认知补充** (`DES-10 + BM18 + EV`) | 统一生物数字棘轮 (`CTA-T5`, `CTA-T6`, `CTA-T29`-`CTA-T45`) | 受损电路借用 `DES-10` 计算经由 `< 20 mW` $g_i = 1$ 桥接, 优于辅助外设 | 未能通过盲日常独立 `RCT` 对非侵入性外设或侵犯能动性 | 推测 `[S]` |

---

<div id="7-formal-verification-in-lean-4360-cta-t1-to-cta-t45" class="anchor-alias" aria-hidden="true"></div>

## 7. Lean 4.36.0 中的形式化验证（`CTA-T1` 至 `CTA-T45`）

为保证将阈值信号、验证门、最小成本路由、选择性神经桥接、数字酶催化、10 营位利基路由和 4 层向下结晶联系起来的数学论断不含任何隐藏假设，我们在 `openie-research-experiments/communication-avalanche/lean/` 的三个自包含 `Lean 4.36.0` 模块中形式化了 **`45` 个定理**（`lake build` 退出码 `0`，`0` 个警告，`0` 个 `sorry`，`0` 个自定义公理；其中 `4` 个定理不依赖任何公理，`41` 个仅使用标准 Lean 内核公理 `propext`、`Classical.choice` 和 `Quot.sound`，`[T]`）：

| 定理组 | Lean 4.36.0 模块和导出的标识符 | 形式数学保证（`[T]`） | 公理足迹 |
| :--- | :--- | :--- | :--- |
| **`CTA-T1` 至 `CTA-T2`**（未验证衰减） | `QuorumRatchet`：`unverified_error_closed_form_and_growth`，`unverified_retention_strict_decay` | 未验证 $k$ 跳链累积加性误差 $\mathrm{err}_0 + k\epsilon > \mathrm{err}_0$（$\epsilon, k \ge 1$）并服从严格有理保真度衰减 $(f/B)^{k+1} < (f/B)^k$（对于 $0 < f < B$）。 | `propext`, `Quot.sound` |
| **`CTA-T3` 至 `CTA-T6`**（棘轮非退化） | `QuorumRatchet`：`ratchet_gate_soundness`，`ratchet_non_regression_step`，`ratchet_non_regression_chain`，`ratchet_strict_advance_and_lock_in` | 任何可靠确定性门（`G a = true -> a.isValid`）在任意对抗性候选列表上保持有效性，保证 $Q(\text{init}) \le Q(\text{final})$，并在生产者移除后永久锁定 $Q(w) \le Q(\text{final})$。 | `propext`, `Quot.sound` |
| **`CTA-T7` 至 `CTA-T10`**（零时钟静止） | `QuorumRatchet`：`subthreshold_step_quiescent`，`subthreshold_trace_zero_firings`，`clocked_vs_event_quiescent_checks`，`zero_clock_idle_energy_dominance` | 积分-发放节点在 $\mathrm{acc} + \sum x_t < \theta$ 时执行 `0` 次发放和 `0` 次状态转移，而同步时钟轮询执行 $N \cdot T > 0$ 次检查，成本为 $N \cdot T \cdot c_{\text{poll}} > 0$。 | `CTA-T10`：**`0` 公理**；`CTA-T7`-`CTA-T9`：`propext`, `Quot.sound` |
| **`CTA-T11` 至 `CTA-T14`**（合作 Hill 开关） | `QuorumRatchet`：`hill_half_maximal_at_threshold`，`hill_monotone_concentration`，`hill_cooperative_subthreshold_suppression`，`hill_cooperative_superthreshold_sharpening` | 精确有理清除的 Hill 开关 $H_n(c, K) = c^n/(K^n+c^n)$ 满足 $H_n(K,K)=1/2$，关于 $c$ 的全局单调性，严格亚阈值噪声抑制 $H_{n+1}(c,K) < H_n(c,K)$（对于 $0 < c < K$），以及严格超阈值锐化 $H_{n+1}(c,K) > H_n(c,K)$（对于 $c > K$）。 | `propext`, `Quot.sound` |
| **`CTA-T15`**（`SepJ` 孔包容） | `QuorumRatchet`：`sepj_gated_containment_vs_collapse` | 在 $L$ 细胞丝状体（$L \ge 2$）中从终端裂解经过 $\ge L - 1$ 次扩散跳跃后，未门控孔使 `0` 个存活细胞，而 `SepJ` 关闭将损伤限制为 `1` 个细胞（`L - 1 >= 1` 个存活）。 | `propext`, `Quot.sound` |
| **`CTA-T16` 至 `CTA-T18`**（认证信道） | `OrchestrationFlow`：`attested_edge_accept_iff`，`tampered_digest_zero_activation`，`invalid_signature_zero_activation` | 常量时间有效负载检查 `digest_eq && sig_ok` 以 `admittedWeight = 0` 拒绝任何哈希不匹配或无效签名。 | `propext` |
| **`CTA-T19` 至 `CTA-T23`**（`CpJ` 主导性） | `OrchestrationFlow`：`cascade_joule_dominance_iff`，`cascade_exact_joule_savings`，`upstream_gate_reduces_pipeline_energy`，`cpj_strict_improvement_from_gating`，`cpj_crystallized_skill_amortization` | 确定性优先升级优于单块模型能耗当 $N c_{\text{det}} < H c_{\text{model}}$（$c_{\text{det}} < p_{\text{hit}} c_{\text{model}}$）时，节省量为 $H c_{\text{model}} - N c_{\text{det}}$；在 $E_{\text{gate}} < F E_{\text{down}}$ 处停止 $F$ 个无效运行严格增加 $\mathrm{CpJ}$，技能结晶超出视界 $E_{\text{synth}} < K(c_{\text{model}} - c_{\text{det}})$ 亦然。 | `propext`, `Classical.choice`, `Quot.sound` |
| **`CTA-T24` 至 `CTA-T28`**（`SSP` 最小成本流） | `OrchestrationFlow`：`reduced_cost_walk_telescoping`，`reduced_cost_cycle_invariance`，`nonneg_reduced_cost_no_negative_cycles`，`ssp_tight_path_shortest_certificate`，`ssp_augmentation_preserves_flow_conservation` | 势约化成本 $c_\pi(u,v) = c(u,v) + \pi(u) - \pi(v)$ 沿游走望远镜，在环上恒为零，当 $c_\pi \ge 0$ 时排除负剩余环，认证紧（$c_\pi = 0$）路径的最短路径最优性，并在增广下保持精确节点流平衡。 | `propext`, `Classical.choice`, `Quot.sound` |
| **`CTA-T29` 至 `CTA-T31`**（保持主体性的 `BCI`） | `OrchestrationFlow`：`agency_preserving_single_step`，`agency_preserving_n_mind_sequence`，`forced_assimilation_violates_invariant` | 在任意 $N$ 参与者网格和任意对抗性消息流上，不变式可靠的局部选择门控 `bridgedStep` 保持每个参与者的私有目标不变式 $I_i(s_i)$，而未门控 `forcedStep` 在 `1` 条消息中覆盖 $I_i$，而 `bridgedStep` 仍累积对齐的集体知识。 | `CTA-T29`, `CTA-T30`：**`0` 公理**；`CTA-T31`：`propext` |
| **`CTA-T32` 至 `CTA-T35`**（数字酶催化） | `EnzymaticSynthesis`：`digital_enzyme_barrier_lowering_and_invariance`，`digital_enzyme_linear_cumulative_savings`，`digital_enzyme_zero_unverified_drift`，`digital_enzyme_sequential_composition` | 任何 `DigitalEnzyme`（$\Phi_{\text{IR}}$，`attest_ok`，$V_{\text{det}}$，$c_{\text{enz}} < c_{\text{nl}}$）在 $M$ 次反应中保持结构上未消耗，将每次交接激活能降低 $\Delta E^\ddagger = k_{\text{retry}} c_{\text{nl}} - c_{\text{enz}} > 0$（`M * DeltaE` 累积），传播 `0` 未验证漂移而非 $M\epsilon > 0$，并顺序复合（$\mathcal{E}_2 \circ \mathcal{E}_1$）。 | `propext`, `Quot.sound`（`CTA-T34`：`propext`） |
| **`CTA-T36` 至 `CTA-T40`**（`DES-10` 生态位主导性） | `EnzymaticSynthesis`：`des_coverage_union_dominates_solo`，`des_strict_global_pass_superiority`，`des_strict_total_joule_dominance`，`des_strict_cpj_dominance`，`des_one_pass_calibration_identifies_niche_router` | 在 $K \ge 2$ 个阵营（`TenCamps = 10`）和 $R$ 个体制下，可执行 `selectNicheCamp` 实现覆盖并集 $\bigvee_k p(k,r)$，在没有单一阵营解决所有 $R$ 个体制时严格优于每个单一单培养，在 $\sum_r (c_{\text{univ}} - c^*) > R c_{\text{enz}}$ 时在总焦耳和 `CpJ` 上严格主导任何通用单阵营，并以 $K \cdot m$ 次探测的 `1` 次通过校准（`0` 梯度周期）。 | `propext`, `Quot.sound` |
| **`CTA-T41` 至 `CTA-T45`**（4 层向下强制与视界界限） | `EnzymaticSynthesis`：`downward_step_amortization_dominance`，`four_tier_downward_convergence_to_c0`，`horizon_cpj_monotonicity_month_quarter_year_decade`，`downward_compilation_preserves_soundness_all_tiers`，`downward_compilation_falsifier_hit_rate_iff` | 在有序层 $c_3 > c_2 > c_1 > c_0 > 0$ 上，向下提升当 $E_{\text{comp}} < N(c_j - c_{j-1})$ 时回本，从 $c_3$ 单调收敛到 $c_0$，保证严格 $\mathrm{CpJ}(t_M) < \mathrm{CpJ}(t_Q) < \mathrm{CpJ}(t_Y) < \mathrm{CpJ}(t_D)$，在所有 4 层上保持可靠性，并建立精确杀伤底板 $h_{\min} = E_{\text{comp}} / (N(c_{\text{high}} - c_{\text{low}}))$。 | `CTA-T44`：**`0` 公理**；`CTA-T41`-`CTA-T43`, `CTA-T45`：`propext`, `Classical.choice`, `Quot.sound` |

---

<div id="8-predicted-analog-hive-mind-neural-interface-matrix-bm01-to-bm18-opt-in-n-mind-bridging-and-paracrine-secretome-audit-ev01-to-ev16" class="anchor-alias" aria-hidden="true"></div>

## 8. 预测的模拟蜂群心智：神经接口矩阵（`BM01` 至 `BM18`）、选择加入式 `N` 心智桥接与旁分泌分泌组审计（`EV01` 至 `EV16`）

<div id="81-from-asymmetric-neural-readout-to-closed-loop-modulation-bm01-to-bm18" class="anchor-alias" aria-hidden="true"></div>

### 8.1 从非对称神经读出到闭环调制（`BM01` 至 `BM18`）

目录 `openie-research-experiments/communication-avalanche/catalogs/bci-sensing-modulation-matrix.csv`（`BM01` 至 `BM18`）从空间分辨率、时间延迟、信息传输速率（`ITR`）、通道数、能动性门控和临床成熟度等维度，梳理了18种已有和拟议中的神经/旁分泌接口。当代人类 `BCIs` 表现出显著的方向性非对称性（`[E]`）：

* **高速率传感（只读输出，`BM01` 至 `BM03`，`BM06` 至 `BM08`，`BM10`）**：非侵入性头皮 `EEG`（`0.2-2.5 bit/s`，Wolpaw et al. 2002）[39]、可穿戴 `OPM-MEG`（`1-4 bit/s`，Boto et al. 2018）[4]、`fNIRS`（`0.05-0.3 bit/s`，Ferrari and Quaresima 2012）[22]，以及微创血管内 `Stentrode` 阵列在 `SWITCH` 瘫痪试验中（`n = 4` 名患者，`16` 个上矢状窦电极，12 个月内零设备相关严重不良事件，Mitchell, Oxley et al. 2023）[38]，均优先考虑以适中比特率实现安全读出。穿透性皮层内 `Utah` 微阵列和高密度 `253` 通道硬膜下 `ECoG` 可达到 `90` 字符/分钟的手写速度（Willett et al. 2021）[50]、`62` 词/分钟（`~15 bit/s`）的皮层内言语（Willett et al. 2023）[50]，以及 `78` 词/分钟（`~19 bit/s`）的多模态言语与化身合成（Metzger et al. 2023）[36]，同时还有 `1,024+` 通道柔性聚合物线束（Musk and Neuralink 2019）[39]。然而，所有这些通道仍为**单向外部化器**，其流畅文本输出高度依赖外部语言模型先验和视觉屏幕反馈。
* **单脑感觉与治疗性调制（写入与闭环，`BM04`，`BM05`，`BM09`，`BM11` 至 `BM14`）**：成熟的临床写入技术已存在于外周感觉假体：`CIS` 人工耳蜗（`>1,000,000` 名接受者，在安静环境中 `~20-40 bit/s` 的言语接收，Wilson et al. 1991）和 `Argus II` 视网膜上阵列（`~1-5 bit/s`，Humayun et al. 2012）[29]。非侵入性皮层写入包括弥散的 `tDCS`/`tACS` 兴奋性偏置（Nitsche and Paulus 2000）[22] 和毫米焦点的 `tFUS` 对人类 `S1` 的调制（Legon et al. 2014）[33]，而毫秒级细胞类型特异性光遗传学（`BM11`，Boyden et al. 2005）[5] 因病毒 opsin 递送要求仍主要处于临床前阶段。关键在于，在单个人脑内闭合读写环路已显著提升功能能动性（`[E]`）：双向 `M1` 读取加 `S1` 触觉 `ICMS`（`BM09`，Flesher et al. 2016, 2021）[23] 将机器人物体转移时间大致缩短一半（`~20.9 s` 降至 `~10.2 s`），而帕金森病慢性自适应 `DBS` 的盲法随机交叉试验（`BM12`，Oehrn et al. 2024; Shanechi 2019）[43] 在症状控制上优于开环连续刺激。
* **多脑中继概念验证与预测的 `N` 脑桥接（`BM15`，`BM16`，`BM18`）**：现有的脑对脑演示，特别是啮齿动物 `ICMS` 感觉运动双体（`BM15`，Pais-Vieira et al. 2013）[45] 以及人类非侵入性 `EEG` 至 `TMS` 协议（最终实现三人 `BrainNet` 协作 `Tetris`，`BM16`，`81.25%` 准确率，跨 `5` 个三人组，Rao et al. 2014; Jiang et al. 2019）[31]，确立了原理验证（`[E]`），但吞吐量极低（`~0.02` 至 `0.5 bit/s`，二元磷烯或条件线索）。从 `~0.05 bit/s` 磷烯扩展到高带宽语义 `N` 脑桥接（`BM18`，目标 `>39 bit/s`）严格属于**推测性（`[S]`）**，并面临三个硬性障碍：个体间表征对齐（不同大脑的皮层流形各异）、慢性高通道读写生物相容性，以及**能动性保存**。定理 `CTA-T29` 至 `CTA-T31` 形式化了不可协商的架构边界：能动性保存的桥接**不是**共享全局状态覆写；每个参与者 $i$ 必须保留一个本地的、硬件强制的最优门控 $g_i(s_i, m) \in \{0, 1\}$，该门控允许传入的潜在数据包进入工作感知/记忆工作空间，而不绕过意志执行控制，从而使最优桥接成为强制同化的数学逆运算（`CTA-T31`）。

<div id="worked-example-6-consent-gated-n-mind-bridging-vs-forced-assimilation-cta-t29cta-t31" class="anchor-alias" aria-hidden="true"></div>

### 工作示例 6：同意门控 `N`-思维桥接 vs. 强制同化 (`CTA-T29`-`CTA-T31`)

为了使 **选择加入的神经补充** 与 **强制同化** 的形式区分具体化（`[T]` 表示门控逻辑；`[S]` 表示未来高频多脑硬件），追踪一个由人类操作员 `Alice` ($i=1$)、`Bob` ($i=2$) 和 `Synthetic Co-Processor` ($i=3$) 构成的 3 人网格：

1. **因子化参与者状态与主权不变量**：设每个参与者的状态因子化为 $s_i(t) = (\mathbf{g}_i(t),\, \mathbf{w}_i(t)) \in \{0,1\}^4 \times \mathbb{Q}^3$，其中 $\mathbf{g}_i(t)$ 编码私有意志承诺（例如 `Alice` 的基线 $\mathbf{g}_1(0) = (1, 0, 1, 1)$），$\mathbf{w}_i(t)$ 为选择加入的感官/工作记忆工作空间 `(slip_force_N, azimuth_deg, confidence)`。`Alice` 的本地自主性不变量为：
   $$I_1(s_1) \iff \bigl(\mathbf{g}_1 = (1, 0, 1, 1)\bigr) \;\wedge\; \bigl(|q_{\text{stim}}| \le 30.0\;\mu\text{C/cm}^2\bigr).$$
   `Alice` 的硬件强制本地门评估 $g_1(s_1, m) = \mathbb{I}[\text{sig\_valid}(m) \wedge (\Delta\mathbf{g}(m) = \mathbf{0}) \wedge (|q_{\text{stim}}(m)| \le 30.0) \wedge (\text{consent\_switch}_1 = 1)]$。
2. **跟踪步骤 `t = 0 -> 1`（已批准的协作义体数据包 $m_1$）**：`Synthetic Co-Processor` 与 `Bob` 共同签署触觉抓取数据包 $m_1 = (\Delta\mathbf{g} = (0,0,0,0),\; \Delta\mathbf{w} = (+0.42, -15.0, +0.94),\; q_{\text{stim}} = 11.5\;\mu\text{C/cm}^2)$。`Alice` 的本地门验证 `BLAKE3+Ed25519` 真实性并检查 $I_1(\mathcal{T}(s_1(0), m_1)) = \text{true}$，输出 $g_1(s_1(0), m_1) = 1$。操作符 `bridgedStep` 更新 `Alice` 的感知工作空间 $\mathbf{w}_1(1) = (0.42, -15.0, 0.94)$，同时保持 $\mathbf{g}_1(1) = (1, 0, 1, 1)$ 不变（`CTA-T29`）。
3. **跟踪步骤 `t = 1 -> 2`（阻断的对抗性 / 不对齐脉冲 $m_2$）**：现在注入对抗性或损坏的数据包 $m_2 = (\Delta\mathbf{g} = (0, +1, 0, 0),\; \Delta\mathbf{w} = (0.0, 0.0, 1.0),\; q_{\text{stim}} = 44.0\;\mu\text{C/cm}^2)$，尝试同时翻转意志位 $\mathbf{g}_1[1] : 0 \to 1$ 并超出皮层电荷密度限制：
   - **在未门控广播下 (`forcedStep`, `CTA-T31`)**：没有 $g_1$，状态立即变为 $\mathbf{g}_1^{\text{forced}}(2) = (1, 1, 1, 1) \ne \mathbf{g}_1(0)$，在 $44.0\;\mu\text{C/cm}^2$ 时伪造 $I_1$，产生 **`1` 条信息**。
   - **在同意门控桥接下 (`bridgedStep`, `CTA-T29`, `CTA-T30`, 通过 `0` Lean 公理证明)**：`Alice` 的本地硬件互锁评估 $\Delta\mathbf{g}(m_2) \ne \mathbf{0}$ 且 $q_{\text{stim}} > 30.0$，设 $g_1(s_1(1), m_2) = 0$，将刺激电流钳制为零，并保持 $s_1(2) = s_1(1) = ((1,0,1,1),\, (0.42,-15.0,0.94))$，在任意消息序列中 **`0` 次自主性不变量违规**。

<div id="82-preclinical-versus-clinical-audit-of-paracrine-and-ev-neuro-supplementation-ev01-to-ev16" class="anchor-alias" aria-hidden="true"></div>

### 8.2 神经系统分泌组与 `EV` 补充的临床前与临床审计（`EV01` 至 `EV16`）

交接论文还指出了与计算借用相对应的一种生化类比：**神经系统补充**，即受损细胞通过摄取经干细胞分泌组或 `EVs` 外部化释放的功能性 `mRNAs`、`miRNAs` 或代谢酶来实现补充，而不完全依赖内源性修复。目录 `openie-research-experiments/communication-avalanche/catalogs/secretome-ev-evidence-ledger.csv`（`EV01` 至 `EV16`）审计了 16 项经核实的原始同行评议研究，涵盖肾损伤、细胞衰老、缺血性卒中、`TBI`、癫痫、`AD`、`PD` 以及单基因或特发性自闭症模型：

| 领域 | 经验证的临床前动物/体外证据（`[E]`） | 强制临床转化缺口（`[S]` 表示人类中枢神经系统疗效） |
| :--- | :--- | :--- |
| **肾脏与全身衰老逆转（`EV01`、`EV07`、`EV08`、`EV13` 至 `EV15`）** | 人 `BM-MSC` 微囊泡通过水平 `mRNA` 转移挽救小鼠急性肾小管损伤（`AKI`），该转移可被 `RNase` 消除（Bruno et al. 2009）[9]。年轻循环 `eNAMPT`-`EVs`（`EV07`，Yoshida et al. 2019）[49]、年轻成纤维细胞 `GSTM2` `sEVs`（`EV08`，Fafian-Labora et al. 2020）[20]、年轻 `ADSC`-`sEVs`（`EV13`，Sanz-Ros et al. 2022）[49]、`ESC`-`EVs` 携带 `miR-15b-5p`/`miR-290a-5p`（`EV14`，Yu et al. 2023）[49] 以及年轻血浆 `sEVs` 上调线粒体 `PGC-1alpha`（`EV15`，小鼠中位寿命 `+12.4%`，Chen et al. 2024）[13] 可逆转小鼠衰老标志物。 | 多能 `ESC` `miR-290` 货物携带致癌增殖风险；供体血浆/原代细胞 `sEV` 批次效力不一；**零项 III 期随机人类抗衰老或神经再生试验** 已确立临床疗效。 |
| **卒中、癫痫与 `TBI` 神经挽救（`EV02` 至 `EV04`、`EV11`、`EV16`）** | 全身 `MSC` 外泌体促进大鼠卒中后神经血管重构（`EV02`，Xin et al. 2013），`hNSC`-`EVs` 减少回脑猪卒中模型的病灶体积（`EV04`，Webb et al. 2018）[41]。鼻内 `MSC` `A1` 外泌体在癫痫持续状态后抑制海马炎症（`EV03`，Long et al. 2017）[34]，`hiPSC-NSC` `EVs` 增强神经发生（`EV11`，Upadhya et al. 2020）[34]，工程化/缺氧预处理的鼻内 `BMSC`-`EVs` 加速小鼠 `TBI` 恢复（`EV16`，Chen et al. 2025；Li et al. 2025）[12]。 | 啮齿动物嗅上皮覆盖鼻腔约 `~50%`，而成人人类仅约 `~3%-5%`，形成陡峭的解剖学鼻-脑给药缺口；静脉推注遭受严重的肝/脾清除。 |
| **神经退行性 `AD` / `PD` 与 `BTBR` / `Shank3B` 自闭症模型（`EV05`、`EV06`、`EV09`、`EV10`、`EV12`）** | 鼻内 `SHED`-`EVs` 在 `6-OHDA` `PD` 大鼠中使步态正常化并恢复黑质纹状体酪氨酸羟化酶（`EV06`，Narbute et al. 2019）[41]；鼻内 `MSC`-`EVs` 增加 `3xTg` `AD` 小鼠的棘密度（`EV09`，Losurdo et al. 2020）[35] 并减少 `5XFAD` 小鼠的斑块负荷/记忆缺陷（`EV12`，Cone et al. 2021）[16]。鼻内 `MSC` 外泌体挽救 `BTBR`（`EV05`，Perets et al. 2018）和 `Shank3B` 敲除小鼠（`EV10`，Perets et al. 2020）的社交互动、发声和重复梳理行为 [47]。 | 急性 `6-OHDA` 病变和转基因 `APP`/`PS1` 过表达不能重现散发性人类路易体/tau 进展；小鼠梳理/超声发声变化 **不能** 在缺乏 `GMP` 效力标准和双盲人类 `RCTs`（`[S]`）的情况下确立人类语言或认知临床获益。 |

<figure class="my-8">
  <img src="/figures/communication-avalanche/bci-modulation-and-ev-boundary.svg" alt="双面板证据图，绘制18种神经接口模态（BM01至BM18）在比特率、侵入性和方向性方面的分布，以及16项研究的临床前至临床细胞外囊泡转化漏斗（EV01至EV16）。" />
  <figcaption><strong>图10。</strong> 经验性与推测性神经补充边界。<strong>左侧（<code>BM01</code>-<code>BM18</code>）</strong>：十八种神经接口模态按信息传输速率、手术侵入性、读/写对称性以及硬件本地同意门控（<code>CTA-T29</code>-<code>CTA-T31</code>）进行映射。<strong>右侧（<code>EV01</code>-<code>EV16</code>）</strong>：十六项主要分泌组和细胞外囊泡挽救研究，显示已复制的临床前动物疗效（<code>[E]</code>），与未经验证的III期人体中枢神经系统临床疗效（<code>[S]</code>）严格分离。</figcaption>
</figure>

---

<div id="9-pre-registered-hypotheses-ca-h1-to-ca-h10-kill-criteria-scope-limits-and-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 预注册假设（`CA-H1` 到 `CA-H10`），终止标准，范围限制，以及结论

<div id="91-hypothesis-and-falsifier-registry-ca-h1-to-ca-h10" class="anchor-alias" aria-hidden="true"></div>

### 9.1 假设与证伪条件注册表（`CA-H1` 至 `CA-H10`）

| 编号 | 目标论断与范围类别 | 定量协议与否决/证伪阈值 | 本研究中的当前状态 |
| :--- | :--- | :--- | :--- |
| **`CA-H1`** | 合作式法定人数阈值下的 ATP/焦耳守恒 (`[M]` / `[E]`) | 扫描 $\rho/\rho_K \in [0.05, 4.0]$ 及亚阈值噪声 ($\sigma = 0.25\,K$):若 $n_H \ge 2$ 在 $\rho/\rho_K \le 0.20$ 时未能节省 $\ge 70\%$ 的调控子能量,或相较 $n_H = 1$ 未能将错误触发降低 $\ge 2\times$,则**被否决**。 | **存活(`CA-M1` + `CTA-T13`)**:节省 `95.49%`($n_H=2$)与 `99.17%`($n_H=4$);错误触发减少 `2.92x` 与 `11.66x` |
| **`CA-H2`** | `SepJ` 式快速纳米孔故障隔离 (`[M]` / `[T]`) | 在 $L = 20$ 的耦合丝状结构中进行单细胞裂解:若快速关闭($\tau_{\text{close}} \le 0.15\text{ s}$)保留的存活细胞 $< 90\%$,或未受控丝状结构保留 $> 10\%$,则**被否决**。 | **存活(`CA-M2` + `CTA-T15`)**:`0.05 s` 时存活 `95.0%`,`0.15 s` 时存活 `90.0%`,未受控组存活 `0.0%` |
| **`CA-H3`** | 拓扑 $k \approx 7$ 与度量 $R_0$ 在 `4x` 扩张下的无标度内聚性 (`[M]` / `[E]`) | 在 $N \in \{64, 128, 256, 512\}$ 的打击后 `64x` 体积扩张中:若拓扑 `LCC` 下降 $< 98\%$,或 $\xi / L \notin [0.25, 0.45]$,则**被否决**。 | **存活(`CA-M3`)**:拓扑 `LCC` 为 `100.0%`($\overline{\xi/L} = 0.3689$),度量 `LCC` 为 `0.68%-4.30%` |
| **`CA-H4`** | 超线性 *Physarum* 管道修剪与区域效率-故障权衡 (`[M]`) | 在未饱和区域中,精确方程 $\dot{D}_{ij} = |Q_{ij}|^\mu/(1+|Q_{ij}|^\mu)-D_{ij}$:若 $\mu > 1$(`1.3, 1.8`)时最短路径通量集中度 $< 99\%$,或 `16` 节点 $\mu=1.4$ 发生断连(`FT < 0.60`),则**被否决**。 | **存活(`CA-M4`)**:$\mu \in \{1.3, 1.8\}$ 时最短路径通量为 `100.00%`;`TL/MST = 1.39`,`FT = 1.00` |
| **`CA-H5`** | 移除后经验证的外部化文库所致的文化锁定 (`[M]` / `[T]`) | 在 `30` 个谱系中于 `Gen 5` 移除合成示范者:若经验证文库在 `Gen 20` 时保留的最优技能 $< 99\%$,或未能超越未经验证的模仿,则**被否决**。 | **存活(`CA-M5` + `CTA-T6`)**:经验证组 `100.00%`,声望组 `76.25%`,未经验证组 `29.27%` |
| **`CA-H6`** | 事件驱动、经验证的 `DAG` 在多智能体代码修复上的 `CpJ` 优势 (`reported_j`) | 与单体大模型进行匹配的代码修复测试:若异构的确定性优先 `DAG` 通过率更低,或在 $c_{\text{det}} < p_{\text{hit}} c_{\text{model}}$ 时 `CpJ`(`Q / reported_j`)提升 $\le 1.0\times$,则**被否决**。 | **存活(`CTA-E2` + `CTA-T19` 至 `CTA-T22`)**:`59/60`(`98.33%`)通过(`0` 次错误提交);`CpJ_pkg = 0.136`,单体为 `0.065`(`2.09x`),未经验证的 4 智能体为 `0.009`(`14.97x`) |
| **`CA-H7`** | 保持能动性的双向 `BCI` 吞吐量与作者归属 (`[S]` 未来测试) | 盲法人类闭环 `BCI` 试验:若作为语义桥接的意图内容互信息 $\le 39\text{ bit/s}$,盲法下用户与解码器的作者归属区分度 $< 0.90$,或局部门控 $g_i = 0$ 未能阻断状态扰动(泄漏容忍度为 `0`),则**被否决**。 | **未决(`[S]`)**:当前 `BCIs` 读出约为 `~15-19 bit/s`(`BM07`,`BM08`),`BrainNet` 约为 `~0.05 bit/s`(`BM16`);`CTA-T29` 至 `CTA-T31` 规定了门控契约 |
| **`CA-H8`** | 鼻内 `EV` / 分泌组神经补充的人类临床疗效 (`[S]` 临床) | 多中心双盲安慰剂对照 II/III 期人类 `RCT`,并进行 `GMP` 批次放行货物检测:若主要临床神经认知终点未能在 $p < 0.01$ 水平上超越假鼻内载体对照,则**被否决**。 | **未决(`[S]`)**:`16/16` 项已审计研究(`EV01` 至 `EV16`)均为临床前的啮齿类/猪/体外研究;`0` 项 III 期人类 `CNS` 批准 |
| **`CA-H9`** | 五种宿主跨硅片的亚毫焦耳认证与零时钟唤醒一致性 (`measured_j` 与 `reported_j`) | 统一 Rust `BLAKE3` + `Ed25519` + OS 事件基准,覆盖 `aarch64` Tegra 物理分流器、`x86_64` Linux `RAPL`、`arm64` macOS `XNU` 及 `Windows 11 NT`:若边缘验证在任一隔离处理器电源轨上超过 `100 µs` 或 `5 mJ`,或零时钟唤醒未能消除空轮询,则**被否决**。 | **存活(`CTA-E4`)**:`1 KiB` 下 `p50` 为 `23.84-50.13 µs`;`Jetson Thor` 的 `INA3221` `VDD_CPU_SOC_MSS` **`measured_j`** 为 `927.30 µJ`(`reported_j` 为 `90.81-642.38 µJ`);`5/5` 台宿主的空唤醒为 `0.0` |
| **`CA-H10`** | 相较单一 AI 单体与自然语言辩论,10 阵营数字酶促方案的即时优势 (`measured_j` 与 `reported_j`) | 在 `100` 项任务、`5` 种体制的基准上比较 `C1`-`C10` 单独运行与 `DES-10`:若任一单独阵营在 `<= DES-10` 焦耳下达到 `>= 80%` 通过率,或数字酶移交相较 `C9` 自然语言移交未能实现 `>= 1,000x` 的焦耳/延迟降低,则**被否决**。 | **存活(`CTA-E5` + `CTA-T36` 至 `CTA-T40`)**:所有单独阵营 `<= 49%`,而 **`DES-10` 为 `98/100`(`98.0%`)**(`1%` 错误提交);**`Thor` 的 `measured_j` `CpJ` 分别高 `9.26x` / `26.87x`**;相较 `C9` 自然语言移交,**`measured_j` 低 `75,374x`,速度快 `78,855x`** |

<div id="92-explicit-scope-limits-and-what-is-not-claimed" class="anchor-alias" aria-hidden="true"></div>

### 9.2 明确范围限制及非声明内容

1. **严格硬件轨道与计数器及云边界（`board_metered = true` 严格限于 `Jetson AGX Thor` 在 `CTA-E4`/`CTA-E5` 中）**：物理电流分流 `measured_j`（`TI INA238` `VIN` 和 `INA3221` `VDD_CPU_SOC_MSS`）仅针对 CPU 专用的 `NVIDIA Jetson AGX Thor` 在 `CTA-E4` 和 `CTA-E5` 中的运行进行声明（因存在活跃 `GPU` 共同租户而按 `Falsifier 6` 扣留 `A2` 单窗口空闲减法）。其余四个舰队主机报告 `RAPL`、`ri_energy_nj` 或 `NVML` `reported_j`，`Tier 0` `LUT6` 数值仍为分析性 `est_j`，且远程云 `LLM` 服务器能耗仍为 `not_available`。
2. **无目的论生物学或母树拟人化**：进化转变（`CL01` 至 `CL13`）源于对局部生物物理相互作用的自然选择；遵循 Karst、Jones 和 Hoeksema (2023) [32]，常见菌根碳通量不被声明为有意的亲本信息传递。
3. **`1` 位 `BrainNet` 磷烯与语义心灵融合之间无等价性**：现有多脑实验（`BM15`、`BM16`）传输 `~0.02` 至 `0.5 bit/s` 的二进制线索；高带宽 `N` 心灵桥接（`BM18`）仍是一个未经证实的未来工程前景（`[S]`）。
4. **对 `EVs`/分泌组无人类临床处方或治疗功效声明**：在 `BTBR`/`Shank3B`、`3xTg`/`5XFAD`、`6-OHDA`、`MCAO` 和 `TBI` 动物模型（`EV01` 至 `EV16`）中的临床前挽救并未确立人类患者的安全性、剂量或临床益处。

<div id="93-conclusion" class="anchor-alias" aria-hidden="true"></div>

### 9.3 结论

从 `3.8 Ga` 细胞外囊泡和 `3.5 Ga` 合作群体开关到 `SepJ` 蓝藻纳米孔、`Dictyostelium` `cAMP` 中继、海绵动物 `VGCC` 钙浪、星子拓扑群、人体打印/网络档案，以及稀疏 `MoE` / 多代理验证社群，集体能力的指数跃迁遵循一个结构不变量：**将状态外部化到共享基底上，在合作阈值和常数时间验证上门控摄取，并将已验证的发现锁定到持久共享记忆中，使下游世代能够继承能力而无需重新支付全部搜索能量**。在 `Lean 4.36.0` 中形式化该不变量（`45` 个内核检查定理 `CTA-T1` 至 `CTA-T45`），将 `76` 年的人工智能（`AI01` 至 `AI38`）映射到同一操作符，并执行预注册模拟（`CA-M1` 至 `CA-M5`）以及五宿主物理分流和对照基准（`CTA-E1` 至 `CTA-E5`），将进化综合转化为三项可测试的工程规范：即时十范式数字酶合成（`DES-10`，`98%` 验证通过，在 `9.26x`-`27.13x` 更高 `CpJ` 下），跨月、季、年、十年视野的闭环四层向下编译（`HM01` 至 `HD04`），以及硬件强制的自愿代理门（$g_i = 1$），将未来协作神经技术与强制同化分离。

---

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

*透明度与数据库核验说明：生物医学、进化、行为学和神经技术类文献（`[1]`-`[50]`）已通过欧洲 PMC 开放获取文献 API（`europepmc_api.py`）以及原始 `DOI`/`PMID` 记录（`verified_references.json`）进行核验；历史与当代人工智能类文献（`[51]`-`[90]`）已分别依据实时 CrossRef（`31/31` 个 `DOI`）和 arXiv Atom（`15/15` 篇预印本）元数据审计（`verified_crossref_audit.json`、`verified_arxiv_audit.json`）进行核验。*

<ol data-refs>
<li>Allwood, A. C., Walter, M. R., Kamber, B. S., Marshall, C. P., &amp; Burch, I. W. (2006). Stromatolite reef from the Early Archaean era of Australia. <em>Nature</em>, 441(7094), 714-718. doi:10.1038/nature04764; PMID:16760969.</li>
<li>Balasubramanian, V. (2021). Brain power. <em>Proceedings of the National Academy of Sciences</em>, 118(32), e2107022118. doi:10.1073/pnas.2107022118; PMID:34341108.</li>
<li>Ballerini, M., Cabibbo, N., Candelier, R., Cavagna, A., Cisbani, A., Giardina, I., Lecomte, V., Orlandi, A., Parisi, G., Procaccini, A., Viale, M., &amp; Zdravkovic, V. (2008). Interaction ruling animal collective behavior depends on topological rather than metric distance: Evidence from a field study. <em>Proceedings of the National Academy of Sciences</em>, 105(4), 1232-1237. doi:10.1073/pnas.0711437105; PMID:18227508.</li>
<li>Boto, E., Holmes, N., Leggett, J., Roberts, G., Shah, V., Meyer, S. S., et al. (2018). Moving magnetoencephalography towards real-world applications with a wearable system. <em>Nature</em>, 555(7698), 657-661. doi:10.1038/nature26147; PMID:29562238.</li>
<li>Boyden, E. S., Zhang, F., Bamberg, E., Nagel, G., &amp; Deisseroth, K. (2005). Millisecond-timescale, genetically targeted optical control of neural activity. <em>Nature Neuroscience</em>, 8(9), 1263-1268. doi:10.1038/nn1525; PMID:16116447.</li>
<li>Brinkmann, L., Baumann, F., Bonnefon, J.-F., Derex, M., Muller, T. F., Nussberger, A.-M., Czaplicka, A., Acerbi, A., Griffiths, T. L., Henrich, J., Leibo, J. Z., McElreath, R., Oudeyer, P.-Y., Stray, J., &amp; Rahwan, I. (2023). Machine culture. <em>Nature Human Behaviour</em>, 7(11), 1855-1868. doi:10.1038/s41562-023-01742-2; PMID:37985914.</li>
<li>Brinkmann, L., Eisenmann, T. F., Nussberger, A.-M., Derex, M., Bonati, S., Chirkov, V., &amp; Rahwan, I. (2026). Propagation and preservation of AI-discovered problem-solving strategies in human culture. <em>Nature Communications</em>. doi:10.1038/s41467-026-76113-2; PMID:42613335.</li>
<li>Brunet, T., Larson, B. T., Linden, T. A., Vermeij, M. J. A., McDonald, K., &amp; King, N. (2019). Light-regulated collective contractility in a multicellular choanoflagellate. <em>Science</em>, 366(6463), 326-334. doi:10.1126/science.aay2346; PMID:31624208.</li>
<li>Bruno, S., Grange, C., Deregibus, M. C., Calogero, R. A., Saviozzi, S., Collino, F., et al., &amp; Camussi, G. (2009). Mesenchymal stem cell-derived microvesicles protect against acute tubular injury. <em>Journal of the American Society of Nephrology</em>, 20(5), 1053-1067. doi:10.1681/ASN.2008070798; PMID:19389847.</li>
<li>Caldwell, M. C., &amp; Caldwell, D. K. (1965). Individualized whistle contours in bottle-nosed dolphins (<em>Tursiops truncatus</em>). <em>Nature</em>, 207(4995), 434-435. doi:10.1038/207434a0.</li>
<li>Cavagna, A., Cimarelli, A., Giardina, I., Parisi, G., Santagati, R., Stefanini, F., &amp; Viale, M. (2010). Scale-free correlations in starling flocks. <em>Proceedings of the National Academy of Sciences</em>, 107(26), 11865-11870. doi:10.1073/pnas.1005766107; PMID:20547832.</li>
<li>Chen, L., Yang, Y., Chen, J., Lin, Y., Xian, L., et al., &amp; Wang, S. (2025). Intranasal delivery of hypoxia-preconditioned extracellular vesicles derived from BMSCs alleviates neuroinflammation and brain dysfunction in TBI. <em>Stem Cell Research &amp; Therapy</em>, doi:10.1186/s13287-025-04572-3, PMID:41057947; and Li, P., Sun, S., Zhu, X., et al., &amp; Han, Q. (2025). Intranasal delivery of engineered extracellular vesicles promotes neurofunctional recovery in traumatic brain injury. <em>Journal of Nanobiotechnology</em>, doi:10.1186/s12951-025-03181-9, PMID:40114197.</li>
<li>Chen, X., Luo, Y., Zhu, Q., Zhang, J., Huang, H., Kan, Y., et al., &amp; Chen, X. (2024). Small extracellular vesicles from young plasma reverse age-related functional declines by improving mitochondrial energy metabolism. <em>Nature Aging</em>, 4(6), 814-838. doi:10.1038/s43587-024-00612-4; PMID:38627524.</li>
<li>Clark, A., &amp; Chalmers, D. J. (1998). The extended mind. <em>Analysis</em>, 58(1), 7-19. doi:10.1093/analys/58.1.7.</li>
<li>Colgren, J., &amp; Burkhardt, P. (2025). Electrical signaling and coordinated behavior in the closest relative of animals. <em>Science Advances</em>, 11(2), eadr7434. doi:10.1126/sciadv.adr7434; PMID:39772683.</li>
<li>Cone, A. S., Yuan, X., Sun, L., Duke, L. C., Vreones, M. P., et al., &amp; Meckes, D. G. (2021). Mesenchymal stem cell-derived extracellular vesicles ameliorate Alzheimer's disease-like phenotypes in a preclinical mouse model. <em>Theranostics</em>, 11(17), 8129-8142. doi:10.7150/thno.62069; PMID:34373732.</li>
<li>Coupe, C., Oh, Y. M., Dediu, D., &amp; Pellegrino, F. (2019). Different languages, similar encoding efficiency: Comparable information rates across the human communicative niche. <em>Science Advances</em>, 5(9), eaaw2594. doi:10.1126/sciadv.aaw2594; PMID:32047854.</li>
<li>Durkheim, E. (1893). <em>De la division du travail social</em>. Felix Alcan, Paris; and Teilhard de Chardin, P. (1955). <em>Le Phenomene humain</em>. Editions du Seuil, Paris.</li>
<li>Eichinger, L., Pachebat, J. A., Glockner, G., Rajandream, M.-A., Sucgang, R., Berriman, M., et al. (2005). The genome of the social amoeba <em>Dictyostelium discoideum</em>. <em>Nature</em>, 435(7038), 43-57. doi:10.1038/nature03481; PMID:15875012.</li>
<li>Fafian-Labora, J. A., Rodriguez-Navarro, J. A., &amp; O'Loghlen, A. (2020). Small extracellular vesicles have GST activity and ameliorate senescence-related tissue damage. <em>Cell Metabolism</em>, 32(1), 71-86.e5. doi:10.1016/j.cmet.2020.06.004; PMID:32574561.</li>
<li>Fedus, W., Zoph, B., &amp; Shazeer, N. (2022). Switch Transformers: Scaling to trillion parameter models with simple and efficient sparsity. <em>Journal of Machine Learning Research</em>, 23(120), 1-39. <code>arXiv:2101.03961</code>.</li>
<li>Ferrari, M., &amp; Quaresima, V. (2012). A brief review on the history of human functional near-infrared spectroscopy (fNIRS) development and fields of application. <em>NeuroImage</em>, 63(2), 921-935, doi:10.1016/j.neuroimage.2012.03.049, PMID:22510258; and Nitsche, M. A., &amp; Paulus, W. (2000). Excitability changes induced in the human motor cortex by weak transcranial direct current stimulation. <em>The Journal of Physiology</em>, 527(Pt 3), 633-639, doi:10.1111/j.1469-7793.2000.t01-1-00633.x, PMID:10990547.</li>
<li>Flesher, S. N., Downey, J. E., Weiss, J. M., Hughes, C. L., Herrera, A. J., Tyler-Kabara, E. C., Boninger, M. L., Collinger, J. L., &amp; Gaunt, R. A. (2021). A brain-computer interface that evokes tactile sensations improves robotic arm control. <em>Science</em>, 372(6544), 831-836, doi:10.1126/science.abd0380, PMID:34016775; extending Flesher, S. N., et al. (2016). Intracortical microstimulation of human somatosensory cortex. <em>Science Translational Medicine</em>, 8(361), 361ra141, doi:10.1126/scitranslmed.aaf8083, PMID:27738096.</li>
<li>Flores, E., Nieves-Morion, M., &amp; Mullineaux, C. W. (2018). Cyanobacterial septal junctions: properties and regulation. <em>Life</em>, 9(1), 1, doi:10.3390/life9010001, PMID:30626071; and Springstein, B. L., Arevalo, S., Helbig, A. O., Herrero, A., Stucken, K., Flores, E., &amp; Dagan, T. (2020). A novel septal protein of multicellular heterocystous cyanobacteria is associated with the divisome. <em>Molecular Microbiology</em>, 113(6), 1140-1154, doi:10.1111/mmi.14483, PMID:32145082.</li>
<li>Gill, S., Catchpole, R., &amp; Forterre, P. (2019). Extracellular membrane vesicles in the three domains of life and beyond. <em>FEMS Microbiology Reviews</em>, 43(3), 273-303. doi:10.1093/femsre/fuy042; PMID:30476045.</li>
<li>Glockner, G., Lawal, H. M., Felder, M., Singh, R., Singer, G., Weijer, C. J., &amp; Schaap, P. (2016). The multicellularity genes of dictyostelid social amoebas. <em>Nature Communications</em>, 7, 12085. doi:10.1038/ncomms12085; PMID:27357338.</li>
<li>Grasse, P.-P. (1959). La reconstruction du nid et les coordinations interindividuelles chez <em>Bellicositermes natalensis</em> et <em>Cubitermes</em> sp. La theorie de la stigmergie. <em>Insectes Sociaux</em>, 6(1), 41-80, doi:10.1007/BF02223791; and Theraulaz, G., &amp; Bonabeau, E. (1999). A brief history of stigmergy. <em>Artificial Life</em>, 5(2), 97-116, doi:10.1162/106454699568700, PMID:10633572.</li>
<li>Heylighen, F. (2007). Accelerating socio-technological evolution: from ephemeralization and stigmergy to the Global Brain. In <em>Globalization as Evolutionary Process: Modeling Global Change</em>, Routledge. <code>arXiv:cs/0703004</code>; doi:10.48550/arXiv.cs/0703004.</li>
<li>Humayun, M. S., Dorn, J. D., da Cruz, L., et al. (2012). Interim results from the international trial of Second Sight's visual prosthesis. <em>Ophthalmology</em>, 119(4), 779-788, doi:10.1016/j.ophtha.2011.09.028, PMID:22244176; and Wilson, B. S., Finley, C. C., Lawson, D. T., Wolford, R. D., Eddington, D. K., &amp; Rabinowitz, W. M. (1991). Better speech recognition with cochlear implants. <em>Nature</em>, 352(6332), 236-238, doi:10.1038/352236a0, PMID:1857418.</li>
<li>Janik, V. M., &amp; Sayigh, L. S. (2013). Communication in bottlenose dolphins: 50 years of signature whistle research. <em>Journal of Comparative Physiology A</em>, 199(6), 479-489. doi:10.1007/s00359-013-0817-7; PMID:23584552.</li>
<li>Jiang, L., Stocco, A., Losey, D. M., Abernethy, J. A., Prat, C. S., &amp; Rao, R. P. N. (2019). BrainNet: A multi-person brain-to-brain interface for direct collaboration between brains. <em>Scientific Reports</em>, 9, 6115, doi:10.1038/s41598-019-41895-7, PMID:30992474; and Rao, R. P. N., Stocco, A., Bryan, M., et al. (2014). A direct brain-to-brain interface in humans. <em>PLOS ONE</em>, 9(11), e111332, doi:10.1371/journal.pone.0111332, PMID:25372285.</li>
<li>Karst, J., Jones, M. D., &amp; Hoeksema, J. D. (2023). Positive citation bias and overinterpreted results lead to misinformation on common mycorrhizal networks in forests. <em>Nature Ecology &amp; Evolution</em>, 7(4), 501-511. doi:10.1038/s41559-023-01986-1; PMID:36782032.</li>
<li>Legon, W., Sato, T. F., Opitz, A., Mueller, J., Barbour, A., Williams, A., &amp; Tyler, W. J. (2014). Transcranial focused ultrasound modulates the activity of primary somatosensory cortex in humans. <em>Nature Neuroscience</em>, 17(2), 322-329. doi:10.1038/nn.3620; PMID:24413698.</li>
<li>Long, Q., Upadhya, D., Hattiangady, B., et al., &amp; Shetty, A. K. (2017). Intranasal MSC-derived A1-exosomes ease inflammation, and prevent abnormal neurogenesis and memory dysfunction after status epilepticus. <em>Proceedings of the National Academy of Sciences</em>, 114(17), E3536-E3545, doi:10.1073/pnas.1703920114, PMID:28396435; and Upadhya, D., Zingg, B., Shetty, S., et al., &amp; Shetty, A. K. (2020). Extracellular vesicles from human iPSC-derived neural stem cells: miRNA and protein signatures, and anti-inflammatory and neurogenic properties. <em>Journal of Extracellular Vesicles</em>, 9(1), 1809064, doi:10.1080/20013078.2020.1809064, PMID:32942055.</li>
<li>Losurdo, M., Pedrazzoli, M., D'Agostino, C., Elia, C. A., Massenzio, F., et al., &amp; Coco, S. (2020). Intranasal delivery of mesenchymal stem cell-derived extracellular vesicles exerts immunomodulatory and neuroprotective effects in a 3xTg model of Alzheimer's disease. <em>Stem Cells Translational Medicine</em>, 9(9), 1068-1084. doi:10.1002/sctm.19-0327; PMID:32496649.</li>
<li>Metzger, S. L., Littlejohn, K. T., Silva, A. B., Moses, D. A., Seaton, M. P., et al., &amp; Chang, E. F. (2023). A high-performance neuroprosthesis for speech decoding and avatar control. <em>Nature</em>, 620(7976), 1037-1046. doi:10.1038/s41586-023-06443-4; PMID:37612505.</li>
<li>Miller, M. B., &amp; Bassler, B. L. (2001). Quorum sensing in bacteria. <em>Annual Review of Microbiology</em>, 55, 165-199, doi:10.1146/annurev.micro.55.1.165, PMID:11544353; and Schuster, M., Lostroh, C. P., Ogi, T., &amp; Greenberg, E. P. (2003). Identification, timing, and signal specificity of <em>Pseudomonas aeruginosa</em> quorum-controlled genes: a transcriptome analysis. <em>Journal of Bacteriology</em>, 185(7), 2066-2079, doi:10.1128/JB.185.7.2066-2079.2003, PMID:12644476.</li>
<li>Mitchell, P., Lee, S. C. M., Yoo, P. E., Morokoff, A., et al., Oxley, T. J., &amp; Campbell, B. C. V. (2023). Assessment of safety of a fully implanted endovascular brain-computer interface for severe paralysis in 4 patients: The Stentrode With Thought-Controlled Digital Switch (SWITCH) study. <em>JAMA Neurology</em>, 80(3), 270-278. doi:10.1001/jamaneurol.2022.4847; PMID:36622685.</li>
<li>Musk, E., &amp; Neuralink (2019). An integrated brain-machine interface platform with thousands of channels. <em>Journal of Medical Internet Research</em>, 21(10), e16194, doi:10.2196/16194, PMID:31642810; and Wolpaw, J. R., Birbaumer, N., McFarland, D. J., Pfurtscheller, G., &amp; Vaughan, T. M. (2002). Brain-computer interfaces for communication and control. <em>Clinical Neurophysiology</em>, 113(6), 767-791, doi:10.1016/S1388-2457(02)00057-3, PMID:12048038.</li>
<li>Nakagaki, T., Yamada, H., &amp; Toth, A. (2000). Intelligence: Maze-solving by an amoeboid organism. <em>Nature</em>, 407(6803), 470, doi:10.1038/35035159, PMID:11028990; Tero, A., Takagi, S., Saigusa, T., et al., &amp; Nakagaki, T. (2010). Rules for biologically inspired adaptive network design. <em>Science</em>, 327(5964), 439-442, doi:10.1126/science.1177894, PMID:20093467; and Reid, C. R., Latty, T., Dussutour, A., &amp; Beekman, M. (2012). Slime mold uses an externalized spatial "memory" to navigate in complex environments. <em>Proceedings of the National Academy of Sciences</em>, 109(43), 17490-17494, doi:10.1073/pnas.1215037109, PMID:23045640.</li>
<li>Narbute, K., Pilipenko, V., Pupure, J., et al., &amp; Pivoriunas, A. (2019). Intranasal administration of extracellular vesicles derived from human teeth stem cells in 6-hydroxydopamine-treated rats. <em>Stem Cells Translational Medicine</em>, 8(5), 490-499, doi:10.1002/sctm.18-0162, PMID:30706999; Webb, R. L., Kaiser, E. E., Jurgielewicz, B. J., et al., &amp; Stice, S. L. (2018). Human neural stem cell extracellular vesicles improve recovery in a porcine model of ischemic stroke. <em>Stroke</em>, 49(5), 1248-1256, doi:10.1161/STROKEAHA.117.020353, PMID:29650593; and Xin, H., Li, Y., Cui, Y., Yang, J. J., Zhang, Z. G., &amp; Chopp, M. (2013). Systemic administration of exosomes released from mesenchymal stromal cells promote functional recovery after stroke in rats. <em>Journal of Cerebral Blood Flow &amp; Metabolism</em>, 33(11), 1711-1715, doi:10.1038/jcbfm.2013.152, PMID:23963371.</li>
<li>Nealson, K. H., Platt, T., &amp; Hastings, J. W. (1970). Cellular control of the synthesis and activity of the bacterial luminescent system. <em>Journal of Bacteriology</em>, 104(1), 313-322, doi:10.1128/jb.104.1.313-322.1970, PMID:5473898; and Nealson, K. H., &amp; Hastings, J. W. (1979). Bacterial bioluminescence: its control and ecological significance. <em>Microbiological Reviews</em>, 43(4), 496-518, doi:10.1128/mr.43.4.496-518.1979, PMID:396467.</li>
<li>Oehrn, C. R., Cernera, S., Hammer, L. H., Shcherbakova, M., Yao, J., Hahn, A., Wang, S., Ostrem, J. L., Little, S., &amp; Starr, P. A. (2024). Chronic adaptive deep brain stimulation versus conventional stimulation in Parkinson's disease: a blinded randomized feasibility trial. <em>Nature Medicine</em>, 30(11), 3345-3356, doi:10.1038/s41591-024-03196-z, PMID:39160351; and Shanechi, M. M. (2019). Brain-machine interfaces from motor to mood. <em>Nature Neuroscience</em>, 22(10), 1554-1564, doi:10.1038/s41593-019-0488-y, PMID:31551595.</li>
<li>Open Interface Engineering (2026). Thermodynamic Bounds and an Optimal Tempo; Metered Commit Gates; Deterministic Null; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Pais-Vieira, M., Lebedev, M., Kunicki, C., Wang, J., &amp; Nicolelis, M. A. L. (2013). A brain-to-brain interface for real-time sharing of sensorimotor information. <em>Scientific Reports</em>, 3, 1319, doi:10.1038/srep01319, PMID:23448946; and Panchin, Y., Kelmanson, I., Matz, M., Lukyanov, K., Usman, N., &amp; Lukyanov, S. (2000). A ubiquitous family of putative gap junction molecules. <em>Current Biology</em>, 10(13), R473-R474, doi:10.1016/s0960-9822(00)00576-5, PMID:10899028.</li>
<li>Partridge, B. L., &amp; Pitcher, T. J. (1980). The sensory basis of fish schools: relative roles of lateral line and vision. <em>Journal of Comparative Physiology A</em>, 135(4), 315-325, doi:10.1007/BF00657627; and Pedraja, F., &amp; Sawtell, N. B. (2024). Collective sensing in electric fish. <em>Nature</em>, 628(8006), 139-144, doi:10.1038/s41586-024-07157-x, PMID:38448593.</li>
<li>Perets, N., Hertz, S., London, M., &amp; Offen, D. (2018). Intranasal administration of exosomes derived from mesenchymal stem cells ameliorates autistic-like behaviors of BTBR mice. <em>Molecular Autism</em>, 9, 57, doi:10.1186/s13229-018-0240-6, PMID:30479733; and Perets, N., Oron, O., Herman, S., Elliott, E., &amp; Offen, D. (2020). Exosomes derived from mesenchymal stem cells improved core symptoms of genetically modified mouse model of autism Shank3B. <em>Molecular Autism</em>, 11, 65, doi:10.1186/s13229-020-00366-x, PMID:32807217.</li>
<li>Simard, S. W., Perry, D. A., Jones, M. D., Myrold, D. D., Durall, D. M., &amp; Molina, R. (1997). Net transfer of carbon between ectomycorrhizal tree species in the field. <em>Nature</em>, 388(6642), 579-582, doi:10.1038/41557; Tomasello, M., Carpenter, M., Call, J., Behne, T., &amp; Moll, H. (2005). Understanding and sharing intentions: The origins of cultural cognition. <em>Behavioral and Brain Sciences</em>, 28(5), 675-691, doi:10.1017/S0140525X05000129, PMID:16262930; Tennie, C., Call, J., &amp; Tomasello, M. (2009). Ratcheting up the ratchet: on the evolution of cumulative culture. <em>Philosophical Transactions of the Royal Society B</em>, 364(1528), 2405-2415, doi:10.1098/rstb.2009.0052, PMID:19620111; and von Frisch, K. (1967). <em>The Dance Language and Orientation of Bees</em>. Harvard University Press.</li>
<li>Weiss, G. L., Kieninger, A.-K., Maldener, I., Forchhammer, K., &amp; Pilhofer, M. (2019). Structure and function of a bacterial gap junction analog. <em>Cell</em>, 178(2), 374-384.e15, doi:10.1016/j.cell.2019.05.055, PMID:31299201; Sanz-Ros, J., Romero-Garcia, N., Mas-Bargues, C., et al., &amp; Borras, C. (2022). Small extracellular vesicles from young adipose-derived stem cells prevent frailty, improve health span, and decrease epigenetic age in old mice. <em>Science Advances</em>, 8(42), eabq2226, doi:10.1126/sciadv.abq2226, PMID:36260670; Yoshida, M., Satoh, A., Lin, J. B., et al., &amp; Imai, S.-I. (2019). Extracellular vesicle-contained eNAMPT delays aging and extends lifespan in mice. <em>Cell Metabolism</em>, 30(2), 329-342.e5, doi:10.1016/j.cmet.2019.05.015, PMID:31204283; and Yu, L., Wen, H., Liu, C., et al., &amp; Liu, N. (2023). Embryonic stem cell-derived extracellular vesicles rejuvenate senescent cells and antagonize aging in mice. <em>Bioactive Materials</em>, 29, 85-97, doi:10.1016/j.bioactmat.2023.06.011, PMID:37449253.</li>
<li>Willett, F. R., Avansino, D. T., Hochberg, L. R., Henderson, J. M., &amp; Shenoy, K. V. (2021). High-performance brain-to-text communication via handwriting. <em>Nature</em>, 593(7858), 249-254, doi:10.1038/s41586-021-03506-2, PMID:33981047; Willett, F. R., Kunz, E. M., Fan, C., et al., &amp; Henderson, J. M. (2023). A high-performance speech neuroprosthesis. <em>Nature</em>, 620(7976), 1031-1036, doi:10.1038/s41586-023-06377-x, PMID:37612500; Zheng, J., &amp; Meister, M. (2025). The unbearable slowness of being: Why do we live at 10 bits/s? <em>Neuron</em>, 113(2), 192-204, doi:10.1016/j.neuron.2024.11.008; and Zhuang, R. (2025). The Ratchet Effect in Silico: How interaction drives cumulative intelligence in large language models (POLIS). <code>arXiv:2507.21166</code>.</li>
<li>Anthropic (2024). <em>Model Context Protocol (MCP) Open Specification</em>. <a href="https://modelcontextprotocol.io/">https://modelcontextprotocol.io/</a></li>
<li>Assran, M., Duval, Q., Misra, I., Bojanowski, P., Vincent, P., Rabbat, M., LeCun, Y., &amp; Ballas, N. (2023). Self-supervised learning from images with a joint-embedding predictive architecture. <em>Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)</em>, 15619-15629. doi:10.1109/CVPR52729.2023.01499; <code>arXiv:2301.08243</code>.</li>
<li>Bahdanau, D., Cho, K., &amp; Bengio, Y. (2015). Neural machine translation by jointly learning to align and translate. <em>International Conference on Learning Representations (ICLR)</em>. <code>arXiv:1409.0473</code>.</li>
<li>Brown, T. B., Mann, B., Ryder, N., Subbiah, M., Kaplan, J., et al., &amp; Amodei, D. (2020). Language models are few-shot learners. <em>Advances in Neural Information Processing Systems</em>, 33, 1877-1901. <code>arXiv:2005.14165</code>.</li>
<li>Buchanan, B. G., &amp; Feigenbaum, E. A. (1978). Dendral and meta-dendral: Their applications dimension. <em>Artificial Intelligence</em>, 11(1-2), 5-24. doi:10.1016/0004-3702(78)90010-3.</li>
<li>Cortes, C., &amp; Vapnik, V. (1995). Support-vector networks. <em>Machine Learning</em>, 20(3), 273-297. doi:10.1007/BF00994018.</li>
<li>Coulom, R. (2006). Efficient selectivity and backup operators in Monte-Carlo tree search. <em>Computers and Games (CG 2006), Lecture Notes in Computer Science</em>, 4630, 72-83, doi:10.1007/978-3-540-75538-8_7; and Kocsis, L., &amp; Szepesvari, C. (2006). Bandit based Monte-Carlo planning. <em>ECML 2006, Lecture Notes in Computer Science</em>, 4212, 282-293, doi:10.1007/11871842_29.</li>
<li>DeepSeek-AI, Guo, D., Yang, D., Zhang, H., Song, J., et al. (2025). DeepSeek-R1 incentivizes reasoning in LLMs through reinforcement learning. <em>Nature</em>, 645, 633-638. doi:10.1038/s41586-025-09422-z; <code>arXiv:2501.12948</code>.</li>
<li>Deng, J., Dong, W., Socher, R., Li, L.-J., Li, K., &amp; Fei-Fei, L. (2009). ImageNet: A large-scale hierarchical image database. <em>IEEE Conference on Computer Vision and Pattern Recognition (CVPR)</em>, 248-255. doi:10.1109/CVPR.2009.5206848.</li>
<li>Erman, L. D., Hayes-Roth, F., Lesser, V. R., &amp; Reddy, D. R. (1980). The Hearsay-II speech-understanding system: Integrating knowledge to resolve uncertainty. <em>ACM Computing Surveys</em>, 12(2), 213-253. doi:10.1145/356810.356816.</li>
<li>Gilmer, J., Schoenholz, S. S., Riley, P. F., Vinyals, O., &amp; Dahl, G. E. (2017). Neural message passing for quantum chemistry. <em>Proceedings of the 34th International Conference on Machine Learning (ICML), PMLR</em>, 70, 1263-1272. <code>arXiv:1704.01212</code>.</li>
<li>Goodfellow, I. J., Pouget-Abadie, J., Mirza, M., Xu, B., Warde-Farley, D., Ozair, S., Courville, A., &amp; Bengio, Y. (2014). Generative adversarial nets. <em>Advances in Neural Information Processing Systems</em>, 27, 2672-2680 (<code>arXiv:1406.2661</code>); archival republication <em>Communications of the ACM</em>, 63(11), 139-144 (2020), doi:10.1145/3422622.</li>
<li>He, K., Zhang, X., Ren, S., &amp; Sun, J. (2016). Deep residual learning for image recognition. <em>IEEE Conference on Computer Vision and Pattern Recognition (CVPR)</em>, 770-778. doi:10.1109/CVPR.2016.90.</li>
<li>Hewitt, C., Bishop, P., &amp; Steiger, R. (1973). A universal modular ACTOR formalism for artificial intelligence. <em>Proceedings of the 3rd International Joint Conference on Artificial Intelligence (IJCAI-73)</em>, Stanford, 235-245.</li>
<li>Hochreiter, S., &amp; Schmidhuber, J. (1997). Long short-term memory. <em>Neural Computation</em>, 9(8), 1735-1780. doi:10.1162/neco.1997.9.8.1735; PMID:9377276.</li>
<li>Hopfield, J. J. (1982). Neural networks and physical systems with emergent collective computational abilities. <em>Proceedings of the National Academy of Sciences</em>, 79(8), 2554-2558. doi:10.1073/pnas.79.8.2554; PMID:6953413.</li>
<li>Jumper, J., Evans, R., Pritzel, A., Green, T., Figurnov, M., et al., &amp; Hassabis, D. (2021). Highly accurate protein structure prediction with AlphaFold. <em>Nature</em>, 596(7873), 583-589. doi:10.1038/s41586-021-03819-2; PMID:34265844.</li>
<li>Krizhevsky, A., Sutskever, I., &amp; Hinton, G. E. (2012). ImageNet classification with deep convolutional neural networks. <em>Advances in Neural Information Processing Systems</em>, 25, 1097-1105; archival republication <em>Communications of the ACM</em>, 60(6), 84-90 (2017), doi:10.1145/3065386.</li>
<li>LeCun, Y., Boser, B., Denker, J. S., Henderson, D., Howard, R. E., Hubbard, W., &amp; Jackel, L. D. (1989). Backpropagation applied to handwritten zip code recognition. <em>Neural Computation</em>, 1(4), 541-551, doi:10.1162/neco.1989.1.4.541; and LeCun, Y., Bottou, L., Bengio, Y., &amp; Haffner, P. (1998). Gradient-based learning applied to document recognition. <em>Proceedings of the IEEE</em>, 86(11), 2278-2324, doi:10.1109/5.726791.</li>
<li>Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., et al., &amp; Kiela, D. (2020). Retrieval-augmented generation for knowledge-intensive NLP tasks. <em>Advances in Neural Information Processing Systems</em>, 33, 9459-9474. <code>arXiv:2005.11401</code>.</li>
<li>McCarthy, J. (1960). Recursive functions of symbolic expressions and their computation by machine, Part I. <em>Communications of the ACM</em>, 3(4), 184-195. doi:10.1145/367177.367199.</li>
<li>Mikolov, T., Sutskever, I., Chen, K., Corrado, G. S., &amp; Dean, J. (2013). Distributed representations of words and phrases and their compositionality. <em>Advances in Neural Information Processing Systems</em>, 26, 3111-3119. <code>arXiv:1310.4546</code>.</li>
<li>Minsky, M., &amp; Papert, S. (1969). <em>Perceptrons: An Introduction to Computational Geometry</em>. MIT Press, Cambridge, MA (expanded archival ed. 2017, doi:10.7551/mitpress/11301.001.0001).</li>
<li>Mnih, V., Kavukcuoglu, K., Silver, D., Rusu, A. A., Veness, J., et al., &amp; Hassabis, D. (2015). Human-level control through deep reinforcement learning. <em>Nature</em>, 518(7540), 529-533. doi:10.1038/nature14236; PMID:25719670.</li>
<li>Newell, A., &amp; Simon, H. (1956). The logic theory machine, A complex information processing system. <em>IRE Transactions on Information Theory</em>, 2(3), 61-79. doi:10.1109/TIT.1956.1056797.</li>
<li>Ouyang, L., Wu, J., Jiang, X., Almeida, D., Wainwright, C. L., et al., &amp; Lowe, R. (2022). Training language models to follow instructions with human feedback. <em>Advances in Neural Information Processing Systems</em>, 35, 27730-27744. <code>arXiv:2203.02155</code>.</li>
<li>Pearl, J. (1988). <em>Probabilistic Reasoning in Intelligent Systems: Networks of Plausible Inference</em>. Morgan Kaufmann, San Mateo, CA. doi:10.1016/C2009-0-27609-4.</li>
<li>Robinson, J. A. (1965). A machine-oriented logic based on the resolution principle. <em>Journal of the ACM</em>, 12(1), 23-41. doi:10.1145/321250.321253.</li>
<li>Romera-Paredes, B., Barekatain, M., Novikov, A., Balog, M., Kumar, M. P., et al., &amp; Fawzi, A. (2024). Mathematical discoveries from program search with large language models. <em>Nature</em>, 625(7995), 468-475. doi:10.1038/s41586-023-06924-6; PMID:38096900.</li>
<li>Rosenblatt, F. (1958). The perceptron: A probabilistic model for information storage and organization in the brain. <em>Psychological Review</em>, 65(6), 386-408. doi:10.1037/h0042519; PMID:13602029.</li>
<li>Rumelhart, D. E., Hinton, G. E., &amp; Williams, R. J. (1986). Learning representations by back-propagating errors. <em>Nature</em>, 323(6088), 533-536. doi:10.1038/323533a0.</li>
<li>Shannon, C. E. (1952). Presentation of a maze-solving machine. In <em>Cybernetics: Circular Causal and Feedback Mechanisms in Biological and Social Systems, Transactions of the Eighth Conference</em> (pp. 173-180), Josiah Macy, Jr. Foundation, New York (reprinted in C. Pias, Ed., <em>Cybernetics: The Macy Conferences 1946-1953</em>, pp. 474-479).</li>
<li>Shazeer, N., Mirhoseini, A., Maziarz, K., Davis, A., Le, Q., Hinton, G., &amp; Dean, J. (2017). Outrageously large neural networks: The sparsely-gated mixture-of-experts layer. <em>International Conference on Learning Representations (ICLR)</em>. <code>arXiv:1701.06538</code>.</li>
<li>Shortliffe, E. H., &amp; Buchanan, B. G. (1975). A model of inexact reasoning in medicine. <em>Mathematical Biosciences</em>, 23(3-4), 351-379. doi:10.1016/0025-5564(75)90047-4.</li>
<li>Silver, D., Huang, A., Maddison, C. J., Guez, A., Sifre, L., et al., &amp; Hassabis, D. (2016). Mastering the game of Go with deep neural networks and tree search. <em>Nature</em>, 529(7587), 484-489, doi:10.1038/nature16961, PMID:26819042; and Silver, D., Schrittwieser, J., Simonyan, K., Antonoglou, I., Huang, A., et al., &amp; Hassabis, D. (2017). Mastering the game of Go without human knowledge. <em>Nature</em>, 550(7676), 354-359, doi:10.1038/nature24270, PMID:29052630.</li>
<li>Trinh, T. H., Wu, Y., Le, Q. V., He, H., &amp; Luong, T. (2024). Solving olympiad geometry without human demonstrations. <em>Nature</em>, 625(7995), 476-482. doi:10.1038/s41586-023-06747-5; PMID:38233616.</li>
<li>Turing, A. M. (1950). Computing machinery and intelligence. <em>Mind</em>, 59(236), 433-460. doi:10.1093/mind/LIX.236.433.</li>
<li>Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, L., &amp; Polosukhin, I. (2017). Attention is all you need. <em>Advances in Neural Information Processing Systems</em>, 30, 5998-6008. <code>arXiv:1706.03762</code>.</li>
<li>Watkins, C. J. C. H., &amp; Dayan, P. (1992). Q-learning. <em>Machine Learning</em>, 8(3-4), 279-292, doi:10.1007/BF00992698 (extending Watkins, C. J. C. H., 1989, <em>Learning from Delayed Rewards</em>, PhD thesis, King's College, Cambridge).</li>
<li>Wei, J., Wang, X., Schuurmans, D., Bosma, M., Ichter, B., Xia, F., Chi, E., Le, Q. V., &amp; Zhou, D. (2022). Chain-of-thought prompting elicits reasoning in large language models. <em>Advances in Neural Information Processing Systems</em>, 35, 24824-24837, <code>arXiv:2201.11903</code>; and Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., &amp; Cao, Y. (2023). ReAct: Synergizing reasoning and acting in language models. <em>International Conference on Learning Representations (ICLR)</em>, <code>arXiv:2210.03629</code>.</li>
</ol>
