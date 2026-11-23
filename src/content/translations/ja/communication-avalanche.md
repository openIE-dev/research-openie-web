---
title: "コミュニケーションツール アバランシェ：閾値信号外部化、イベント駆動オーケストレーション、およびジュール当たりのコヒーレンスである"
deck: "始生代のクォーラムスイッチおよびゲート制御ナノポアから、76年にわたる人工知能の展開、10パラダイムにわたるデジタル酵素的合成、閉ループ下向きコンパイル、同意ゲート付きニューラルインタフェースに至るまでを、生物学的、形式的、歴史的、そして5ホストに及ぶハードウェアの観点から検証する。Tegra aarch64 Jetson Thor上で、基板全体の物理測定および3チャネル電源レールの電流シャント測定値(measured_j)を取得し、さらに4ホストのオンチップ報告値(reported_j)と併置する(board_metered は true である)。"
lang: "ja"
source: "communication-avalanche"
complete: true
---

<div id="the-communication-tool-avalanche-thresholded-signal-externalization-event-driven-orchestration-and-coherence-per-joule" class="anchor-alias" aria-hidden="true"></div>

*改訂 bdb6b96, 2026年11月23日. データおよび要約ダイジェスト: [/data/#communication-avalanche](/data/#communication-avalanche). 対話型生体観測所 (4機器 + 10図ギャラリー): [/living/communication-avalanche/](/living/communication-avalanche/). 簡易5秒-90秒映像: [/tv/](/tv/). 対話型チュートリアル (ラボ1-5): [/tutorials/](/tutorials/). オーディオ深掘り: [/radio/](/radio/). アーカイブ双子: [/pdfs/communication-avalanche.pdf](/pdfs/communication-avalanche.pdf) · [LaTeX PDF](/pdfs/latex/communication-avalanche.pdf) ([ソース](/pdfs/latex/communication-avalanche.tex)).*

<div id="0-abstract-and-epistemic-scope" class="anchor-alias" aria-hidden="true"></div>

## 0. 抽象と認識的範囲

個々の参加者が構造化された状態を共有媒体へ外部化し、近接する参加者が選択的閾値または検証ゲートを越えてその信号を取り込み、結果として状態遷移が有用な作業を固定し、以前のノイズに退行しないとき、生活的、文化的、計算的システム全体の集合的エージェンシーが成立する。生物学的進化の38億年にわたる過程で、集合的能力の主要な飛躍は、単に単独細胞サイズが増大したことによるのではなく、新たな細胞間または個体間通信基盤と同時に起こってきた：原始的膜小胞、協調的細菌のクオラムスイッチ、カルシウム依存性シアノバクテリアナノポア、胞子体性サイクリックヌクレオチド波、チョアノフラジェレットの電気カルシウム過渡、後生動物のギャップ結合、スティグマーギック痕跡、トポロジカル群れ、組成的人間言語、文字、印刷、そしてパケット交換ネットワーク。現代の人工知能は、スパースな mixture-of-experts アーキテクチャとマルチエージェント検証ループにおいてデジタル対応物を具体化し、出現しつつあるニューロンおよびパラクリン技術は、まだ仮説段階にある双方向アナログ対応物への将来を示唆している。

本研究は、この横断スケールの命題を、二つの具体的な成果物に沿って形式化し、シミュレーションし、監査する。すなわち、計算オーケストレーションの効率（ジュール当たりのコヒーレンスで定量化）と、神経学的補充の候補経路である。Lean 4.36.0 による機械検証済みの証明（QuorumRatchet、OrchestrationFlow、EnzymaticSynthesis にわたる 45 定理。未完成のプレースホルダーはゼロ、独自公理はゼロ）は、ゲート付き外部化ラチェットの非退行性、ゼロクロック閾値下アイドルの保存則、協調的 Hill ノイズ抑制、中隔ナノ孔による障害封じ込め、決定論優先のモデル昇格におけるジュール支配性、被約コストに対する最短経路逐次法の最適性、およびオプトインのマルチエージェント接続下における個体の自律性不変量の保存を確立する。

事前登録された決定論的シミュレーション（シード `20261123`）は、以下を定量化する。細菌のクオラムにおける代謝節約（低密度でレギュロン由来エネルギーの `95.49%` から `99.17%` を節約）、シアノバクテリア糸状体の生存（迅速な孔閉鎖ありで `95.0%` が生存、ゲートなしでは `0.0%`）、三次元トポロジカル群れのまとまり（四倍拡大後、`100.0%` が連結、固定メトリック半径では `0.68%` から `4.30%`）、適応的変形菌の最短経路刈り込み（超線形フィードバックで `100.0%` の流量集中）、および合成的な手本を除去した後の 20 世代にわたる文化的保持（検証済みの外部化アーティファクトありで `100.0%` の最適保持、未検証の模倣下では `29.27%`）である。

五つのハードウェアおよびオペレーティングシステムの類型にわたって評価を行った。すなわち、Tegra `aarch64` 開発キット上の物理的な Texas Instruments 製の基板全体および電源レール別の電流シャント（`board_metered = true`、プロセッサとメモリのレールにおいて `1` キビバイトの辺当たり `measured_j` = `927.30` マイクロジュール）、および四台の Linux、macOS、Windows 11 ワークステーションにおける Running Average Power Limit（RAPL）、Darwin カーネル、グラフィックスドライバのエネルギーカウンタ（`reported_j`）である。コンパイル済み Rust の暗号ハッシュ（BLAKE3）と `Ed25519` によるチャネル認証は、エンベロープを `25.95` から `37.39` マイクロ秒で検証した（`64` バイトから `64` キビバイトの辺当たり `643` から `926` マイクロジュール）。ゼロクロックの `eventfd` 閾値ノードは、`1%` のバースト型デューティにおいて、`1,000` ヘルツのクロック駆動ポーリングに比べてソケットエネルギーを `2.21x` 少なく消費した（`136.32 J` 対 `300.73 J`、`10 Hz` において `2.58 ms` 対 `570.38 ms`）。事前登録された 60 課題の Python コード修復ベンチマーク（`240` エピソード）では、ヘテロジニアスな認証付きオーケストレータが、単一の最先端モノリシックモデルの `59 / 60`（`98.33%`）の合格率に一致し、`0 / 60`（`0.00%`）の誤コミットを示した。その局所ソケット `reported_j` は `432.75 J`、モデル呼び出しは `21` 回であった（`0.136` タスク毎ジュール）。これは `902.51 J` のモノリシック基準に比べて `2.09x` 高いジュール当たりコヒーレンスであり、認証のない四エージェントのカスケード（`52 / 60 = 86.67%` に劣化し、`8 / 60 = 13.33%` の誤コミット）に比べて `14.97x` 高い。同時に、注入された `200 / 200`（`100.0%`）のビザンチン型チャネル障害を封じ込め、最小コストのフェイルオーバー経路を `2.40` マイクロ秒で再計算した。

1950 年から 2026 年までの `38` の歴史的な人工知能の画期を同一の三相ラチェットに写像することで、過去の二つの冬の時代を診断するとともに、サブミリジュールのデジタル酵素を通じて十の競合するパラダイムのサイロを統合した（自然言語によるエージェント間の受け渡しに比べ、`78,855x` 高速であり、物理シャント `measured_j` は `75,374x` 低い）。すべての孤立した単独パラダイムが `49%` 以下に停滞する `100` 課題の五つの局面からなるベンチマーク（単一モデルは `48%`、三エージェント討論は `49%`）において、即時の十陣営デジタル酵素合成は `98 / 100`（`98.0%`）に到達し、誤コミットは `1%` であり、物理レールにおけるジュール当たりコヒーレンスは `9.26x` から `26.87x` 高かった。これは、反証可能な月次、四半期、年次、十年次の下方コンパイル設計図の基盤となる。最後に、18 種の神経インターフェースの様式と 16 件の主要な細胞外小胞研究にわたり、再現された非臨床動物における救済と、未検証のヒト臨床有効性とを厳密に区別して扱う。

<div id="terms-and-acronyms" class="anchor-alias" aria-hidden="true"></div>

### 用語と略語

<ul id="terms">
<li>AD, ADSC, AHL, AI, AIP, AKI, AMP, API, APP, ASIC, AST, ATP: アルツハイマー病, 脂肪由来幹細胞, アシルホモセリンラクトン, 人工知能, 自己誘導ペプチド, 急性腎障害, アデノシン一リン酸, アプリケーションプログラミングインターフェース, アミロイド前駆体タンパク質, 特定用途向け集積回路, 抽象構文木, およびアデノシン三リン酸</li>
<li>BBB, BBI, BCE, BCI, BCIs, BLAKE3, BM, BMI, BMSC, BMSCs, BOLD, BTBR: 血液脳関門, 脳間インターフェース, 紀元前, 脳コンピュータインターフェース, 暗号学的ハッシュ関数 BLAKE3, 脳様式カタログ接頭辞, 脳機械インターフェース, 骨髄間葉系幹細胞, 血中酸素レベル依存信号, および黒褐色短尾近交系マウス系統</li>
<li>BM01, BM02, BM03, BM04, BM05, BM06, BM07, BM08, BM09, BM10, BM11, BM12, BM13, BM14, BM15, BM16, BM17, BM18: 神経および傍分泌インターフェースカタログ識別子 (`openie-research-experiments/communication-avalanche/catalogs/bci-sensing-modulation-matrix.csv`)</li>
<li>CA, CA1, CCE, CE, CI, CIS, CL, CNS, COX2, CPU, CRC, CT, CTA, CpJ: コミュニケーションツール アバランシェモデル/仮説接頭辞 (`CA-M1` から `CA-M5`, `CA-H1` から `CA-H8`), 海馬円蓋野アンモニス野1野, 累積文化的進化, 紀元, 継続的インテグレーション, 連続インターリーブサンプリング, コミュニケーショラダーカタログ接頭辞, 中枢神経系, シクロオキシゲナーゼ-2, 中央演算処理装置, 巡回冗長検査 (`CRC`), コンピュータ断層撮影, コミュニケーションツール アバランシェ (`CTA-T1` から `CTA-T45`), およびジュール当たりのコヒーレンス</li>
<li>CL01, CL02, CL03, CL04, CL05, CL06, CL07, CL08, CL09, CL10, CL11, CL12, CL13, CL14, CL15, CL16, CL17, CL18, CL19, CL20, CL21, CL22, CL23, CL24: 進化的コミュニケーショラダーカタログ識別子 (`openie-research-experiments/communication-avalanche/catalogs/evolutionary-communication-ladder.csv`)</li>
<li>DAG, DAGs, DBS, DNA, DOI, DPSC: 有向非巡回グラフ, 深部脳刺激, デオキシリボ核酸, デジタルオブジェクト識別子, および歯髄幹細胞</li>
<li>ECoG, EEG, EOD, ESC, ESCs, ESCRT, EV, EVs: 脳皮質電図, 脳波, 電気器官放電, 胚性幹細胞, エンドソーム選別複合体, および細胞外小胞</li>
<li>EV01, EV02, EV03, EV04, EV05, EV06, EV07, EV08, EV09, EV10, EV11, EV12, EV13, EV14, EV15, EV16: セクレトームおよび細胞外小胞一次研究識別子 (`openie-research-experiments/communication-avalanche/catalogs/secretome-ev-evidence-ledger.csv`)</li>
<li>FDA, FLOPs, FP16, FT: 食品医薬品局, 浮動小数点演算, 16ビット浮動小数点形式, および単一リンク耐故障性</li>
<li>GABA, GABARB1, GMP, GPCR, GPU, GSH, GST, GSTM2: ガンマアミノ酪酸, GABA_B受容体サブユニット1, 適正製造基準, Gタンパク質共役受容体, グラフィックス処理装置, 還元型グルタチオン, グルタチオンSトランスフェラーゼ, およびグルタチオンSトランスフェラーゼmu 2</li>
<li>ICMS, IDE, IDO, IFN, IL, INT4, IP3, ISA, ITR: intracortical microstimulation, Investigational Device Exemption, indoleamine 2,3-dioxygenase, interferon, interleukin, 4-bit integer format, inositol 1,4,5-trisphosphate, instruction set architecture, and information transfer rate → 皮質内微刺激、治験装置免除、インドールアミン 2,3-ジオキシゲナーゼ、インターフェロン、インターロイキン、4ビット整数フォーマット、イノシトール 1,4,5-トリスリン酸、命令セットアーキテクチャ、および情報転送速度</li>
<li>JASN, JMLR, JSON: Journal of the American Society of Nephrology, Journal of Machine Learning Research, and JavaScript Object Notation → 米国腎臓学会誌、機械学習研究誌、および JavaScript オブジェクト表記</li>
<li>KV, KV260: key-value attention cache and AMD Xilinx Kria KV260 vision board → キー・バリュー注意キャッシュ、AMD Xilinx Kria KV260 ビジョンボード</li>
<li>LCC, LLM, LLMs, LPS, LUCA, LUT, LUT6: largest connected component, large language model(s), lipopolysaccharide, last universal common ancestor, Boolean look-up table, and 6-input Boolean look-up table `[same house]` → 最大連結成分、大規模言語モデル、リポ多糖、最後の共通祖先、ブール検索テーブル、6入力ブール検索テーブル `[same house]`</li>
<li>M1, MACs, MCAO, MD, MEF, MEFs, MEG, ML, MR, MSC, MSCs, MST, MV, MVs, MoE: primary motor cortex, multiply-accumulate operations, middle cerebral artery occlusion, mean shortest-path distance, mouse embryonic fibroblast(s), magnetoencephalography, machine learning, magnetic resonance, mesenchymal stem cell(s), minimum spanning tree, microvesicle(s), and Mixture of Experts → 第一次運動野、乗算累積演算、中大脳動脈閉塞、平均最短経路距離、マウス胚性線維芽細胞、磁気脳波計測、機械学習、磁気共鳴、間葉系幹細胞、最小全域木、微小胞、エキスパート混合モデル</li>
<li>NAD, NLRP3, NMDA, NSC, NSCs, NVMe: nicotinamide adenine dinucleotide, NOD-like receptor family pyrin domain containing 3, N-methyl-D-aspartate, neural stem cell(s), and Non-Volatile Memory Express → ニコチンアミドアデニンジヌクレオチド、NOD様受容体ファミリー ピリンドメイン 3、N-メチル-D-アスパラギン酸、神経幹細胞、Non-Volatile Memory Express</li>
<li>OD, ODE, OPM, ORF, ORFs: origin-destination pair, ordinary differential equation, optically pumped magnetometer, and open reading frame(s) → 起点-終点ペア、常微分方程式、光励起磁力計、開放読枠</li>
<li>PD, PDE, PGC, PMC, PMCID, PMID, PMU, PNAS, POLIS, PRIMA, PRIME, PS1: Parkinson's disease, phosphodiesterase, peroxisome proliferator-activated receptor-gamma coactivator, PubMed Central, PubMed Central identifier, PubMed identifier, performance monitoring unit, Proceedings of the National Academy of Sciences, Population Orchestrated Learning and Inference Society, Photovoltaic Retinal Implant microarray, Precise Robotically Implanted Brain-Computer Interface trial, and presenilin-1 → パーキンソン病、ホスホジエステラーゼ、ペルオキシソーム増殖因子活性化受容体-γ コアクチベーター、PubMed Central、PubMed Central 識別子、PubMed 識別子、性能監視ユニット、米国科学アカデミー誌、集団指揮学習推論協会、光起電式網膜インプラントマイクロアレイ、精密ロボット埋め込み脳-コンピュータ・インタフェース試験、プレセニリン-1</li>
<li>RAPL, RCT, RGECO1, RK4, RL, RNA, RNase, ROS, RVG: Running Average Power Limit, randomized controlled trial, red genetically encoded calcium indicator 1, fourth-order Runge-Kutta integrator, reinforcement learning, ribonucleic acid, ribonuclease, reactive oxygen species, and rabies virus glycoprotein peptide → 動平均電力上限、ランダム化比較試験、赤色遺伝子コード化カルシウム指標 1、4次ルンゲ＝クッタ積分、強化学習、リボ核酸、リボヌクレアーゼ、活性酸素種、狂犬病ウイルス糖タンパク質ペプチド</li>
<li>S1, SA, SHA, SHED, SLOC, SNR, SSP, SSVEP, STN, SWITCH: primary somatosensory cortex, senescence-associated (as in SA-beta-galactosidase), Secure Hash Algorithm, stem cells from human exfoliated deciduous teeth, source lines of code, signal-to-noise ratio, Successive Shortest Path min-cost flow algorithm, steady-state visually evoked potential, subthalamic nucleus, and Stentrode With Thought-Controlled Digital Switch study → 第一次体性感覚皮質、老化関連（SA-β-ガラクトシダーゼ）、Secure Hash Algorithm、離乳歯由来ヒト幹細胞、コード行数、信号対雑音比、逐次最短経路最小費用流アルゴリズム、定常視覚誘発電位、視床下核、Stentrode Thought-Controlled デジタルスイッチ研究</li>
<li>TBI, TCP, TL, TLS, TMS, TNF: traumatic brain injury, Transmission Control Protocol, total normalized network length, Transport Layer Security, transcranial magnetic stimulation, and tumor necrosis factor → 外傷性脳損傷、Transmission Control Protocol、総正規化ネットワーク長、Transport Layer Security、経頭蓋磁気刺激、腫瘍壊死因子</li>
<li>VGCC, VGCCs, SoC, INA260: 電圧依存性カルシウムチャネル(単数形および複数形)、システムオンチップ、およびTexas Instruments社製インライン電力センサINA260</li>
<li>aDBS, cAMP, cDBS, cGMP, eNAMPT, fNIRS, hNSC, hiPSC, mRNA, mTOR, miRNA, sEV, sEVs, tACS, tDCS, tFUS: 適応型脳深部刺激、環状アデノシン一リン酸、従来型連続脳深部刺激、環状グアノシン一リン酸、細胞外ニコチンアミドホスホリボシルトランスフェラーゼ、機能的近赤外分光法、ヒト神経幹細胞、ヒト人工多能性幹細胞、メッセンジャーRNA、ラパマイシン機構標的、マイクロRNA、小型細胞外小胞(単数形および複数形)、経頭蓋交流電気刺激、経頭蓋直流電気刺激、および経頭蓋集束超音波</li>
<li>AI01, AI02, AI03, AI04, AI05, AI06, AI07, AI08, AI09, AI10, AI11, AI12, AI13, AI14, AI15, AI16, AI17, AI18, AI19, AI20, AI21, AI22, AI23, AI24, AI25, AI26, AI27, AI28, AI29, AI30, AI31, AI32, AI33, AI34, AI35, AI36, AI37, AI38: 1950-2026年の人工知能ラチェット・マイルストーン識別子(`openie-research-experiments/communication-avalanche/catalogs/ai-history-ratchet-1950-2026.csv`)</li>
<li>AR, AUROC, CEC, CF, CNF, CoT, CVE, CVPR: 代数規則、受信者動作特性曲線下面積、定誤差カルーセル、確信度係数、連言標準形、思考連鎖、共通脆弱性識別子、およびIEEE/CVFコンピュータビジョンとパターン認識に関する国際会議</li>
<li>DD, DENDRAL, DES, DNULLMM1, DQN, DSP48E2: 演繹データベース、質量分析用エキスパートシステムであるDendritic Algorithm(DENDRAL)、デジタル酵素合成(`DES-10`)、決定論的ヌル二値メモリマップ格納形式v1、深層Q網、およびAMD UltraScale+ 48ビットデジタル信号処理スライス</li>
<li>EBM, EC, EFD_CLOEXEC, EMA, FPGA, GAN, GPT, GRPO: エネルギーベースモデル、組込みコントローラ、Linuxのclose-on-execイベントファイル記述子フラグ、指数移動平均、フィールドプログラマブルゲートアレイ、敵対的生成ネットワーク、生成事前学習済みトランスフォーマ、およびグループ相対方策最適化</li>
<li>HBM, HD01, HD02, HD03, HD04, HM01, HM02, HM03, HM04, HQ01, HQ02, HQ03, HQ04, HY01, HY02, HY03, HY04, HY05, HY06: 高帯域幅メモリ、および十年(`HD01`-`HD04`)、月(`HM01`-`HM04`)、四半期(`HQ01`-`HQ04`)、年(`HY01`-`HY06`)の酵素的ホライズン・ロードマップ識別子(`openie-research-experiments/communication-avalanche/catalogs/enzymatic-horizon-roadmap.csv`)</li>
<li>ICLR, ICML, IJCAI, ILSVRC, INA238, INA3221, IPA, IPL, IR, JEPA, I-JEPA: 学習表現に関する国際会議、機械学習に関する国際会議、人工知能に関する国際合同会議、ImageNet大規模視覚認識チャレンジ、Texas Instruments社製インライン電力モニタ(`INA238`、`INA3221`)、不変点注意機構、情報処理言語、中間表現、Joint-Embedding予測アーキテクチャ、およびImage-based Joint-Embedding予測アーキテクチャ</li>
<li>KKT, KL, KS, KSs, LNCS, LSTM, MAXIM, MCP, MCTS, MGU, MIPS, MPNN, MSA, MSE, MYCIN: カルーシュ・キューン・タッカー最適性条件、カルバック・ライブラー情報量、Hearsay-II ナレッジソース（単数・複数）、Lecture Notes in Computer Science（コンピュータサイエンス講義ノート）、長短期記憶、Dallas/Maxim 1-Wire巡回冗長検査多項式（`CRC-8/MAXIM`）、モデルコンテキストプロトコル、モンテカルロ木探索、最汎単一化子、最大内積探索、メッセージパッシングニューラルネットワーク、多重配列アラインメント、平均二乗誤差、抗菌剤生産ルールエキスパートシステム（`MYCIN`）である</li>
<li>NL, NLP, OEM, OS, PET, PMLR, POSIX, PPO, RAG, RAMB36E2, RCE, RPC, ReAct, ReLU, ResNet, RFC, RLHF, RNN, RTL, SATB, SE, SMT, SOM, SSM, SVM, TD, UCT, URI, URIs, USD, VC, WNS, XOR, pLDDT: 自然言語、自然言語処理、相手先ブランド製造業者、オペレーティングシステム、陽電子放出断層撮影、Proceedings of Machine Learning Research（機械学習研究論文集）、ポータブルオペレーティングシステムインターフェース、近接方策最適化、検索拡張生成、AMD UltraScale+ 36キロビットブロックRAMプリミティブ、Reality Code Engine、リモートプロシージャコール、推論と行動のループ、正規化線形関数、深層残差ネットワーク、コメント要求、人間のフィードバックによる強化学習、再帰型ニューラルネットワーク、レジスタ転送レベル、Sandboxed Agent Testbed Harness（サンドボックス化エージェント試験ハーネス）、特殊ユークリッド群（`SE(3)`）、充足可能性モジュロ理論、システムオンモジュール、構造化状態空間モデル、サポートベクターマシン、時間差学習、木に対する上側信頼限界、統一資源識別子、統一資源識別子（複数）、米ドル、Vapnik-Chervonenkis次元、最悪負のスラック、排他的論理和述語、予測局所距離差検定である</li>
<li>AGX, CAN, CIC, CRT, CUDA, CWE, DC, DE10, FD, FFI, FRO, FSM, LRU, MDP, MSS, NDJSON, NVIDIA, NVML, PID, PPT, RUSAGE_INFO_V6, RTX, SAT, TI, UCB1, VDD, VDD_CPU_SOC, VDD_CPU_SOC_MSS, VDD_GPU, VIN, VIN_SYS_5V0, WHNF, XNU, ZFC: Autonomous-Grade Computeモジュールファミリ、コントローラエリアネットワーク、帰納的構成計算、中国剰余定理、Compute Unified Device Architecture、共通脆弱性タイプ一覧、直流、Digital Enzyme 10-camp二進フレームのマジックヘッダ、有限領域制約ソルバ、外部関数インターフェース、Lean Focused Research Organization、有限状態機械、最近最少使用キャッシュ方針、マルコフ決定過程、メモリサブシステム、改行区切りJavaScript Object Notation、アクセラレーテッドコンピューティングのハードウェアベンダNVIDIA、NVIDIA管理ライブラリ、プロセス識別子、Package Power Tracking、Darwin Resource Usage Info v6構造体、Ray Tracing Texel eXtreme、ブール充足可能性、テキサス・インスツルメンツ、上側信頼限界1、電圧ドレイン-ドレイン電源レール、Tegra CPU/SoC電源レール、Tegra CPU/SoC/メモリ電源レール、Tegra GPU電源レール、基板電圧入力レール、5ボルトシステム入力レール、弱頭部正規形、Darwin X is Not Unixカーネル、および選択公理付きツェルメロ-フレンケル集合論である</li>
</ul>

<div id="measurement-and-evidence-class-ledger" class="anchor-alias" aria-hidden="true"></div>

### 測定および証拠クラス台帳

**ロードマップ。** 第1節は保存された三相外部化演算子およびジュール当たりのコヒーレンス（`CpJ`）を定義する。第2節は38億年の生物学的梯子（`CL01`から`CL06`）を監査する。第3節は種間スティマジー、位相的群れ、菌根証拠対引用バイアス批判（`CL07`から`CL13`）、および事前登録モデル`CA-M1`から`CA-M5`を検討する。第4節は人間の文化的ラチェット、拡張心、疎な`MoE`基礎モデル、およびハイブリッド機械-人間文化的伝達（`CL14`から`CL19`）を追跡する。第5節はイベント駆動実証オーケストレーションスタック、60タスクコード修復ベンチマーク（`CTA-E1`から`CTA-E3`）、物理的Tegra DCレールシャントを含む5ホストクロスシリコンエネルギー監査（`CTA-E4`）、および100タスク10パラダイムベンチマーク（`CTA-E5`、`CL20`）を提示する。第6節は10の孤立AI陣営（`C1`から`C10`）にわたるデジタル酵素工学、5ループ下方コンパイル強制関数、および`Month / Quarter / Year / Decade`ロードマップ（`HM01`から`HD04`）を形式化する。第7節はすべての45のLean 4.36.0定理（`CTA-T1`から`CTA-T45`）を詳細化する。第8節は18の`BCI`およびパラクリン様式（`BM01`から`BM18`）を16の主要セクレトーム/`EV`研究（`EV01`から`EV16`）とともにマッピングする。第9節は10の反証可能仮説（`CA-H1`から`CA-H10`）、明示的スコープ制限、および結論的不変量を登録する。付属のOpen Interface Engineeringモノグラフ（[熱力学的境界および最適テンポ](/papers/agency/)、OpenIE著者らが提案する普遍的代理法則の枠組み；[計測コミットゲート](/papers/gates/)；[決定論的ヌル](/papers/deterministic-null/)；および[下方LUT6コンパイル](/papers/lut-adapt/)）は建築的連続性のために厳密に`[same house]`マーカとともに引用される[44]。

理論的、形式的（`CTA-T1`から`CTA-T45`）、および生物物理モデル（`CA-M1`から`CA-M5`）の節はハードウェア電力主張を一切含まないが、第5節（`CTA-E4`および`CTA-E5`）は物理的ボードレベルTexas Instruments `INA238`（`VIN`）および3チャネル`INA3221`（`VDD_CPU_SOC_MSS`）電流シャント`measured_j`を`NVIDIA Jetson AGX Thor`（`board_metered = true`）上で記録し、これは4ホスト`RAPL`、`kqueue`/`ri_energy_nj`、および`NVML` `reported_j`（`CTA-E1`から`CTA-E5`）ならびに解析的`est_j`投影から厳密に分離されている。あらゆる主張は明示的な証拠クラスタグを伴う：

| タグ | 証拠区分 | 本研究における運用上の境界 |
| :--- | :--- | :--- |
| **`[E]`** | **確立された実証科学** | 微生物学、進化細胞生物学、動物集団行動、認知科学、またはヒトの臨床神経技術において再現された査読済みの知見であり、検証済みの `DOI` または `PMID` 識別子をもって引用されたものである。 |
| **`[T]`** | **カーネル検証済みの形式定理** | `Lean 4.36.0` において機械的に証明され (`QuorumRatchet.lean`、`OrchestrationFlow.lean`、および `EnzymaticSynthesis.lean`、定理 `CTA-T1` から `CTA-T45` までの `45` 件、`0` 個の `sorry`、`0` 個のカスタム公理、`0` 個の `opaque`、`0` 個の `Lean.ofReduceBool`)、さらに Linux `bubblewrap` (`bwrap`) サンドボックス内で `lake check --paranoid` の**6つの独立した証明チェッカー**すべてによって全会一致で受理されたものである (`con-leche --verified` および `con-ron --verified`: `58,928` 宣言; `lean4lean`、`nanoda`、`leanchecker --paranoid`、および `Lean v4.36.0`: `58,930` 宣言)。記述された形式構造の演繹的妥当性を証明するものであり、未測定の物理的主張を証明するものではない。 |
| **`[M]`** | **決定論的計算モデル** | 事前登録された構成 `PREREG_cta_models.json` (`SHA-256: 475a89e3...ac9fa`、固定シード `20261123`) から実行され、`CA-M1` から `CA-M5` にわたるものである。 |
| **`measured_j` / `reported_j` / `est_j`** | **物理的シャント、ハードウェアカウンタ、または解析的エネルギー** | 物理的な `TI INA238` / `INA3221` 直流シャント電源レール (`Jetson AGX Thor` 上の `measured_j`、`CTA-E4`/`CTA-E5`)、`CPU`/`SoC`/`GPU` カウンタ (`RAPL`、`ri_energy_nj`、`NVML` の `reported_j`、`CTA-E1`-`CTA-E5`)、および解析的ルックアップ上界 (`est_j`) であり、厳密に別々の列に保持され、相互に合算されることはない。 |
| **`[S]`** | **推測的仮説** | 未検証の工学的または臨床的な展望であり、`N`-mind 型の意味的 `BCI` 橋渡し、および動物モデルまたはオルガノイドモデルを超えたヒト神経変性疾患における分泌因子/小胞の有効性を含むものである。 |

---

<div id="1-thesis-and-the-conserved-externalize-ingest-transform-operator" class="anchor-alias" aria-hidden="true"></div>

## 1. 命題と保存的な外部化-取り込み-変換オペレータ

生物進化、文化史、分散計算のいずれにおいても、孤立したエージェントの能力は、集団としてのタスク複雑性が飽和するよりはるかに早い段階で、代謝的・熱力学的な逓減収益に直面する。繰り返し超線形的な能力を開放してきたのは、**コミュニケーションツール アバランシェ**である。これは、エージェントが内部状態を外部の物理的基盤へ書き込み、隣接エージェントが活性化閾値と妥当性ゲートを満たす場合にのみその基盤を選択的に取り込み、取り込まれた信号が受信側の状態を変換すると同時に、既に検証された利得を保存するという保存的な三相オペレータである(`Figure 1`)。

$N$ 個のエージェントからなる集団が、共有の物理的または数字的媒体 $\mathcal{M}$ に結合した局所状態 $s_i(t) \in \mathcal{S}$ ($i \in \{1,\dots,N\}$) を保持するものとする。アバランシェの各段階は、次の三つの写像として定式化される(`[T]`、`Avalanche.QuorumRatchet.CycleOperator` で形式化)。

1. **外部化 ($\mathcal{E} : \mathcal{S} \to \Sigma$)**: エージェント $i$ は、有界な信号伝達エネルギー $e_{\text{ext}} > 0$ を費やして、構造化された物理的人工物またはパケット $m = \mathcal{E}(s_i)$ を $\mathcal{M}$ へ放出する(アシル・ホモセリン・ラクトン分子、粘液の鞘、音響輪郭、印刷された数式、あるいは `BLAKE3` でハッシュされ `Ed25519` で署名されたチャネルペイロードなど)。
2. **閾値付きかつゲートされた取り込み ($\mathcal{G} : \mathcal{S} \times \Sigma^* \to \{0,1\}$)**: 受信側 $j$ は、重み付き入力信号 $A_j = \sum_k w_{kj}\,m_k$ を蓄積し、$A_j \ge \theta_j$ かつ受容体/検証器の特異性 $V_j(m_k) = 1$ が成立する場合に限り発火する:
   $$s_j(t + 1) = \begin{cases} \mathcal{T}\!\left(s_j(t),\, \{m_k\}\right) & \text{if } \sum_k w_{kj}\,\mathbb{I}[V_j(m_k)=1] \ge \theta_j, \\ s_j(t) & \text{otherwise.} \end{cases}$$
   閾値未満の到着 ($A_j < \theta_j$) および未検証のペイロード ($V_j(m_k) = 0$) は、下流の状態遷移を一切引き起こさない(`CTA-T7`、`CTA-T8`、`CTA-T17`、`CTA-T18`)。
3. **ラチェット変換と下方結晶化 ($\mathcal{T} : \mathcal{S} \times \Sigma^* \to \mathcal{S}$)**: 受理された信号は、集団的協調と個体の能力の双方を更新する。検証された人工物が品質の非劣化 $Q(s_j(t+1)) \ge Q(s_j(t))$ を伴って $\mathcal{M}$ に存続するとき、高エネルギーの探索的発見は、後続世代にとって低コストで再利用可能なテンプレートとなる(`CTA-T5`、`CTA-T6`、`CTA-T23`)。

without選択的ゲート $V_j$ が存在しない場合、忠実度 $f \in (0, 1)$ の各ホップからなる $k$ ホップの中継連鎖は $f^k$ として指数関数的に減衰する (`CTA-T2`)。また、加法的雑音 $\epsilon > 0$ は $k\epsilon$ として線形に増大する (`CTA-T1`)。健全な検証ゲートと永続的な外部化ストレージが備わる場合、品質は単調非減少のラチェットとなる (`CTA-T5`)。生物基板とシリコン基板にまたがる調整アーキテクチャを同等の条件で比較するため、$Q \ge 0$ をタスク検証済みのコヒーレントな出力(検証済みのバグ修正、維持された代謝的生存可能性、誤りのない送信ビットなど)とし、$E_{\text{total}} = E_{\text{compute}} + E_{\text{comm}} + E_{\text{idle}} > 0$ を総消費エネルギーとする。**ジュール当たりのコヒーレンス**は次式で定義される:

$$\mathrm{CpJ} = \frac{Q}{E_{\text{compute}} + E_{\text{comm}} + E_{\text{idle}}}\;\; \left[\text{verified coherence units} \cdot \mathrm{J}^{-1}\right].$$

生の構成要素数(細菌のオープンリーディングフレーム5,570個、ヒトのニューロン $8.6 \times 10^{10}$ 個、または $2 \times 10^{12}$ 個のフロンティア神経網重み)は能力の上限包絡線を規定するに過ぎない。実現される $\mathrm{CpJ}$ は、通信チャネルが閾値化され、イベント駆動であり、下流の誤り連鎖に対してゲートされているかどうかによって決まる (`CTA-T19` から `CTA-T23`)。

<figure class="my-8">
  <img src="/figures/communication-avalanche/biological-to-bci-avalanche.svg" alt="暗色テーマの統合図。帯A(保存された外部化-ゲート-変換演算子と、3.8 Ga の細胞外小胞(EVs)からN-mind BCIに至る24段階の時系列)、帯B(事前登録モデル CA-M1 から CA-M5 の経験的曲線)、帯C(神経およびパラクライン界面の4段階の進展)を示す。" />
  <figcaption>図1. 24段階の進化カタログ(<code>CL01</code> から <code>CL24</code>)にわたる保存された外部化-取り込み-ラチェットのループ、事前登録されたシミュレーション出力(<code>CA-M1</code> から <code>CA-M5</code>、<code>seed = 20261123</code>、<code>board_metered = false</code>)、ならびに確立された臨床神経技術(<code>[E]</code>)と思弁的な多心的橋渡し(<code>[S]</code>)との境界。</figcaption>
</figure>

---

<div id="2-the-38-billion-year-biological-escalation-ladder-cl01-to-cl06" class="anchor-alias" aria-hidden="true"></div>

## 2. 38億年の生物学的エスカレーションラダー (`CL01` から `CL06`)

`openie-research-experiments/communication-avalanche/catalogs/evolutionary-communication-ladder.csv` (`CL01` から `CL24`) は、24の進化的・文化的・計算的・神経技術的段階を、明示的な基質、受容体ゲート、測定尺度、および反証因子とともに文書化している。6つの基礎的な生物学的遷移 (`CL01` から `CL06`) は、多細胞性が主に保存された細胞内機構 (`[E]`) の上に**細胞間コミュニケーションおよび封じ込めゲート**を革新することによって進化したことを確立する。

| 段階 | おおよその時代 | 生物学的系 | 外部化された基質と受容体ゲート | 測定されたゲノムまたは生理的スケール | 反証基準 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`CL01`** | `~3.8 Ga`(`LUCA` 以前の候補) | 三ドメイン膜小胞(`EVs`) | `20-400 nm` の脂質二重膜パケットであり、`RNA`、タンパク質、代謝物を運搬する。エンドサイトーシスまたは融合性の取り込みによる [25] | 細菌、古細菌、真核生物にわたって保存される。不安定な積荷を細胞外ヌクレアーゼ/プロテアーゼから保護する | 基底的な古細菌および細菌の系統群にわたる、保存された小胞形成の生物物理学の欠如 |
| **`CL02`** | `~3.5 Ga` | 細菌のクオラムセンシング(*Vibrio fischeri*、*Pseudomonas aeruginosa*) | 拡散性の `AHL` / `AIP` オートインデューサーが、協同的なHill指数 $n_H \ge 2$ を伴って `LuxR`/`LasR`/`RhlR` または `LuxPQ` に結合する [37, 42] | *P. aeruginosa* の約 `~5,570` 個の `ORFs` のうち `>300` から `~600` 個を制御する(ゲノムの `~6%-10%`) [37] | 低密度の移流的洗い流し条件下で、クオラム制御された野生型を凌駕する構成的な分泌物産生株 |
| **`CL03`** | `~3.43 to 2.6 Ga` | 糸状シアノバクテリア(*Anabaena* / *Nostoc*、太古代ストロマトライト) | `SepJ`、`FraC`/`FraD`、`SepI` のナノ孔アレイを介する細胞質内のスクロース/グルタミン酸交換であり、`Ca2+` により引き起こされるプラグ/キャップの閉鎖を伴う [1, 24, 49] | `~100` 細胞からなる窒素固定性フィラメントにわたる `~15 nm` のゲート付きチャネルであり、ストレスを受けた細胞を数秒以内に封鎖する [49] | `SepJ`/`FraCD` のロックオープン型プラグ変異体において、単一細胞の溶解後に多細胞フィラメントの過剰な死が観察されないこと |
| **`CL04`** | `~1.0 to 0.6 Ga` | 社会性アメーバの集合(*Dictyostelium discoideum*) | `cAR1-cAR4` `GPCRs` により感知される、不応性の適応を伴う螺旋状の細胞外 `cAMP` パルス(周期 `~6 min`) [19, 26] | $10^4$ から $10^5$ 個の細胞を集合させる。発生に必須な遺伝子の `~80%` (`76%-84%`) は祖先的であり、新規な `~20%` は分泌型/膜貫通型センサーに富む [26] | 細胞外 `cAMP` リレーおよび細胞接着認識を除去した後も、子実体形態形成が正常に維持されること |
| **`CL05`** | `~0.8 to 0.6 Ga` | コロニー性襟鞭毛虫(*Choanoeca flexa*、*Salpingoeca rosetta*) | ロドプシン-`cGMP` 収縮性 [8] と、`VGCC` 媒介によるコロニー性 `Ca2+` 一過性変動(`RGECO1` イメージング) [15] | 真のニューロンに先立ち、`10` から `500` 個の襟細胞にわたる繊毛停止と頂端-基底シート反転を同期させる | 遺伝学的または薬理学的な `VGCC` 阻害において、コロニー全体の同期的な繊毛停止と脱分極が維持されること |
| **`CL06`** | `~0.54 Ga`(カンブリア紀) | 初期後生動物/刺胞動物および脊索動物のギャップ結合 | 収斂的なインネキシン/パンネキシンおよび脊索動物のコネキシン半チャネルを介する直接的なイオン結合と、`<1 kDa` の `IP3`/`cAMP` 結合 [45] | 電位、`pH`、損傷 `Ca2+` によりゲートされる組織スケールの上皮および神経筋シート($10^5$ から $10^{11}$ 個の細胞) | 高 `Ca2+` による接合部の非結合化の喪失により、結合上皮にわたる傍観者的代謝崩壊の伝播が生じないこと |

一次生物学的記録(`[E]`)から、直接的に三つの定量的知見が導かれる:

1. **閾値型の公共財制御（`CL02`）**: 発光細菌 *Vibrio fischeri* における生物発光の自己誘導として、Nealson, Platt, Hastings（1970, 1979）[42] によって初めて特徴づけられ、Miller and Bassler（2001）[37] によってグラム陰性菌およびグラム陽性菌の回路にわたって概観された。クオラムセンシングは、細胞外オートインデューサー濃度が協同的解離閾値 $K$ を超えるまで、代謝的に高コストな分泌型病原因子、シデロフォア、エラスターゼ、バイオフィルムの生産を抑制する。*Pseudomonas aeruginosa* のマイクロアレイ転写解析に基づくSchuster et al.（2003）[37] は、`~5,570` 個の `ORFs` のうち `315` から `>500` 個の遺伝子（`~6%` から `10%`）が `LasR`/`RhlR` のアシル-ホモセリンラクトン・カスケードによって制御されることを示した。細胞は中央のクロックを参照するのではなく、化学濃度勾配を局所的に統合する。

2. **物理的な回路遮断機構が多細胞での共有を生存可能にする（`CL03`, `CL06`）**: 細胞間で細胞質を共有することは、直接的な脆弱性を生む。局所的な捕食や膜の破裂は、接合部が損傷時に閉鎖しない限り、フィラメント全体の内容物を失わせる。初期太古代のストロマトライト礁（`~3.43 Ga`, Allwood et al. 2006）[1] は、古代の微生物マット組織の存在を裏付ける。また、Weiss et al.（2019）[49] による *Anabaena* の隔壁接合部のクライオ電子線トモグラフィーと、Flores et al. 2018 および Springstein et al. 2020 による `SepJ` と `SepI` の分裂装置・隔壁の特徴づけ [24] は、後生動物のパンネキシン/コネキシン型ギャップ結合と機能的に収斂したタンパク質性ナノポアのチューブ・キャップ・プラグ構造を明らかにした（Panchin et al. 2000）[45]。ストレスまたはイオノフォアによる `Ca2+` 流入は、キャップ・プラグ・モジュールを再編成して孔を可逆的に封鎖し、溶解した細胞を隔離する一方で、無傷の隣接細胞間での窒素固定ヘテロシストの代謝産物交換を維持する（`CTA-T15`）。

3. **多細胞性は細胞内演算を再利用しつつ、外部化されたI/Oを新たに生み出す（`CL04`, `CL05`）**: *Dictyostelium discoideum*（`~12,500` 遺伝子, Eichinger et al. 2005）[19] の全ゲノム解読と、主要なすべてのディクティオステリッド系統群にわたるゲノム比較（Glockner et al. 2016）[26] は、発生に必須な遺伝子のおよそ `80%` が、単独生活するアメーボゾア類の近縁種において多細胞性より前から存在していたことを示した。系統特異的な残りの `~20%` は、分泌型および膜貫通型の認識・シグナル伝達タンパク質に強く富化していた。同様に、動物の最近縁の単細胞・群体性姉妹群である襟鞭毛虫類において、Brunet et al.（2019）[8] は *Choanoeca flexa* における光制御による集団的シートの反転を発見した。また、Colgren and Burkhardt（2025）[15] は *Salpingoeca rosetta* において、電位依存性カルシウムチャネル（`VGCCs`）が群体全体に電気的・カルシウム波を伝播させ、シナプスが進化的に出現する以前に、同期的な繊毛停止と収縮を調整することを実証した。

<figure class="my-8">
  <img src="/figures/communication-avalanche/three-phase-ratchet-anatomy.svg" alt="保存された外部化、閾値とゲートによる取り込み、非退行的ラチェット変換の各位相を、細菌・シアノバクテリア、動物の刺激伝達・群れ、人類文化、検証済みのデジタル・神経基盤の4行で比較した微細構造図である。" />
  <figcaption><strong>図2.</strong> 4つの基盤クラスにわたる保存的三位相オペレータ $(\mathcal{E}, \mathcal{G}, \mathcal{T})$ の微細構造である。対象は、微生物の群体感知と<code>SepJ</code>ナノポアゲーティング、無神経系および動物の場の協調、人類による外部化された記録台帳、暗号学的に検証された多器官ソフトウェアおよびオプトインの神経ブリッジである。</figcaption>
</figure>

---

<div id="3-cross-species-stigmergy-mycorrhizal-critique-and-executed-models-ca-m1-to-ca-m5" class="anchor-alias" aria-hidden="true"></div>

## 3. 種間スティグマーギー、菌根批判、および実行モデル (`CA-M1` から `CA-M5`)

<div id="31-cross-species-decentralized-coordination-and-candid-evidence-boundaries-cl07-to-cl13" class="anchor-alias" aria-hidden="true"></div>

### 3.1 種間分散協調と率直な証拠境界 (`CL07` to `CL13`)

組織接合部を超えて、自由に移動する有機体は空間的および運動学的状態を直接環境場 (`[E]`) に外部化する:

* **多孔質土壌と粘菌による外部化された記憶（`CL08`, `CL10`）**: Grasse（1959）およびTheraulaz と Bonabeau（1999）[27] は、社会性昆虫（*Bellicositermes*, *Cubitermes*）において、建築物そのものが伝達路として機能することを示した。すなわち、作業者は設計図なしに、フェロモンが付着した局所的な土壌の曲率に応答する。無神経性の合胞体性粘菌 *Physarum polycephalum* では、Nakagaki、Yamada、Toth（2000）[40] が最短経路の迷路解法を実証した。Tero ら（2010）[40] は、適応的なポアズイユ型原形質管が東京の鉄道網におけるコスト、輸送効率、耐障害性と一致することを示した。Reid ら（2012）[40] は、*Physarum* が U字型の罠から脱出するために、細胞外の非生体性粘液マットを堆積させ、それが外部化された空間記憶として機能することを証明した。また、あらかじめ粘液で被覆された寒天上に置かれた場合にはこの脱出は失敗する。
* **記号的なベクトルダンス、位相的群れ、特徴的ホイッスル、および集合的電気感覚（`CL09`, `CL11`, `CL12`, `CL13`）**: ミツバチ（*Apis mellifera*）は、花までの距離と太陽方位角を、ワグルラン（尾振りダンス）の持続時間と角度に符号化する（von Frisch 1967）[48]。ムクドリ（*Sturnus vulgaris*）のムクドリ群飛翔（murmuration）について、Ballerini ら（2008）[3] および Cavagna ら（2010）[11] が行った立体3次元再構成により、各個体は群れの密度にかかわらず `k ~ 6 to 7` 個の最近傍個体からなる**位相的**近傍を追跡していることが明らかとなった。その結果、速度揺らぎの相関はスケール不変となり、相関長は群れの大きさに比例して線形に増大する（$\xi \propto L$, $\xi / L \approx 0.35$）。バンドウイルカ（*Tursiops truncatus*）は、個体固有の周波数変調型特徴的ホイッスル（signature whistle）を発信し、模倣し合うが、これは声色とは独立に機能する指示的な個体識別ラベルとして働く（Caldwell and Caldwell 1965; Janik and Sayigh 2013）[10, 30]。群れをなす魚類は、`<10 ms` の側線による流体力学的結合（Partridge and Pitcher 1980）と集合的能動センシングを組み合わせている。弱電気魚 *Gnathonemus petersii* において、Pedraja and Sawtell（2024）[46] は、同種個体の電気器官放電（`EODs`）が影の中の物体を照らし出し、電気定位の範囲を2倍から3倍に拡大することを示した。
* **菌根菌による移送と母樹の過大解釈（`CL07`）**: 野外での相互的な $^{13}\mathrm{C}$ および $^{14}\mathrm{C}$ パルス標識を用いて、Simard ら（1997）[48] は、外生菌根菌の菌糸によって連結された *Betula papyrifera* と *Pseudotsuga menziesii* の実生の間で、双方向の炭素移送が生じることを実証した。その正味の移送量は遮光によって変調される。しかしながら、科学的誠実性の観点から、この知見は Karst、Jones、Hoeksema（2023）[32] による体系的な監査と併せて提示される必要がある。同監査は林業文献全体にわたり、正の引用バイアスおよび制御されていない交絡要因（根の癒合、土壌拡散、菌類による炭素保持、実生の枯死）が、「母樹による意図的な血縁利他行動」や目的論的な警告放送という通俗的主張を**支持しない**ことを示した。本枠組みにおいて、菌根による移送は依然として実在する源-シンク間の生物物理学的結合である（菌糸を介した資源フラックスについては `[E]`）。一方、適応的な母性シグナル伝達の意図は、裏付けのないもの（`[S]` / 議論の余地あり）と分類される。

<div id="32-pre-registered-deterministic-model-suite-ca-m1-to-ca-m5-seed--20261123" class="anchor-alias" aria-hidden="true"></div>

### 3.2 事前登録された決定論的モデル群 (`CA-M1` から `CA-M5`, `seed = 20261123`)

`CL02`、`CL03`、`CL08`、`CL12`、`CL19` の各段階が持つ数理的機構を再現可能な形で検証するため、`run_cta_models.py` (`seed = 20261123`) を実行する前に `PREREG_cta_models.json` (`SHA-256: 475a89e3fe6157238560ac5876b52791b22a67a9d3260c68111a1b76b89ac9fa`) を固定した。その後、`cta_models_results.json` (`SHA-256: 54a7b2c177bc063e2536ae487cdb44b372f0ba6281514d8154c34b115b0b7914`) が生成された。事前に定めた合否基準5件はすべて満たされた (`[M]`)。

| モデル ID | モデル化された生物学的または文化的メカニズム | パラメータ掃引 (`seed = 20261123`) | 主要定量結果 (`cta_models_results.json`) | 事前登録済み判定 |
| :--- | :--- | :--- | :--- | :--- |
| **`CA-M1`** | 協力的ヒル型クorumスイッチ (`600 / 5,000` 遺伝子; 分泌される公共財コスト `3x` ハウスキーピング) | `13` 密度 $\rho/\rho_K \in [0.05, 4.0]$ $\times$ `3` 拡散損失 $\times$ $n_H \in \{1, 2, 4\}$ + `2,000` ノイズ試行 ($\bar{A}/K = 0.25$, $\sigma = 0.25\,K$) | $\rho/\rho_K = 0.20$ において: `95.49%` ($n_H = 2$) および `99.17%` ($n_H = 4$) レギュロン `ATP` 節約 (`27.72%` および `28.79%` 全細胞 `ATP` 節約); 早期ノイズ発火は `51.90%` ($n_H=1$) $\to$ `17.75%` ($n_H=2$, `2.92x`) $\to$ `4.45%` ($n_H=4$, `11.66x`) 低下 | **Pass** (`>= 70%` 節約; `>= 2.0x` ノイズ抑制) |
| **`CA-M2`** | `20` 細胞シアノバクテリア系状体における細胞-`0` 溶解後の `Ca2+` ゲート `SepJ` ナノ孔 | `RK4` (`dt = 0.002 s`, `20.0 s` ホライズン) における $\tau_{\text{close}} \in \{0.05, 0.15, 0.30, 0.60, 1.20, 2.50, 5.00\}\text{ s}$ 対非ゲート | $\tau_{\text{close}} = 0.05\text{ s}$ は `19 / 20` (`95.0%`) 生存細胞および `87.56%` 代謝プール (`0.15-0.30 s` で `90.0%`; `1.20 s` で `80.0%`; `5.00 s` で `25.0%`) を保持; 非ゲート孔は `0 / 20` (`0.0%` 生存, `14.28%` プール) に崩壊 | **Pass** (`>= 90%` 高速ゲート対 `<= 10%` 非ゲート) |
| **`CA-M3`** | 捕食者攻撃および `4x` 径方向拡大下における 3D 位相的 $k = 7$ 群れ対固定計量半径 $R_0$ 群れ | $N \in \{64, 128, 256, 512\}$, $(N, \text{rule})$ あたり `8` 3D 試行, `64x` 体積拡大 | 位相的 $k = 7$ は全 $N$ で `100.0%` 単一成分 `LCC` 凝集性を保持 (`1.0` 成分, 分極 `0.976-0.986`, 平均 $\xi / L = 0.3689$); 計量的 $R_0$ は `57.0` から `467.5` 断片に破砕 (`LCC` `4.30%` から `0.68%` 低下) | **Pass** (`>= 98%` 位相的 `LCC`; $\xi/L \in [0.25, 0.45]$; 計量的 `<= 40%`) |
| **`CA-M4`** | *Physarum* ポアズイユネットワーク $\dot{D}_{ij} = |Q_{ij}|^\mu / (1 + |Q_{ij}|^\mu) - D_{ij}$ | `8` ノード多経路橋 ($\mu \in \{0.6, 1.0, 1.3, 1.8\}$) および `16` ノード領域的 `OD` メッシュ ($\mu \in [0.8, 2.0]$) | `8` ノード最短経路フラックス共有は `42.72%` ($\mu=0.6$) $\to$ `77.05%` ($\mu=1.0$) $\to$ `100.00%` ($\mu=1.3, 1.8$, 非最短 $D = 0.0$) 上昇; `16` ノード $\mu=1.4$ は `30 -> 20` チューブを刈り込み (`TL/MST = 1.3903`, `MD/MST = 0.8252`, `FT = 1.0000`, `FT/TL = 0.7192`) | **Pass** (`>= 99%` 最短経路フラックス for $\mu > 1$) |
| **`CA-M5`** | `20` 世代ハイブリッドラチェット ($N = 32$ エージェント/世代, `30` 系統; `Gen 5` で `4` 合成実演者除去) | `6` 段階非近視谷景観 (`4` 体制, トラップ `0.40` 対グローバル最適 `1.00`) | `Gen 20` 最適エージェント共有: `0.00%` (`no_machine_baseline`, スコア `0.3689`), `29.27%` (`unverified_imitation`, スコア `0.6522`), `76.25%` (`prestige_biased_imitation`, スコア `0.9221`), および `100.00%` (`attested_externalized_library`, スコア `1.0000`, `30/30` 系統) | **Pass** (`>= 99%` 実証保持; 非検証を厳密に上回る) |

CA-M4 が正確な動的境界をハイライトする点は注目に値する。関数 $f(Q) = Q^\mu / (1 + Q^\mu)$ は $\mu > 1$ のとき $Q_{\text{infl}} = ((\mu - 1)/(\mu + 1))^{1/\mu}$ において変曲点を持ち、超線形最短経路選択は飽和していない生物学的フラックス窓 ($|Q| < Q_{\text{infl}}$) の内部でのみ厳密に機能する。ソースフラックスを飽和領域へ過剰に駆動すると、$f(Q)$ は凹状のプラトーへと変化し、平行冗長チューブを保持する。

<figure class="my-8">
  <img src="/figures/communication-avalanche/cross-species-thresholds-infographic.svg" alt="事前登録されたモデル CA-M1 から CA-M5 までの四パネル定量概要：Hill クオラム ATP 節約、SepJ フィラメント生存性対閉鎖 τ、k=7 の 3D トポロジカル対メトリックフロック凝集、そして Physarum の剪定と Gen-20 文化ロックイン" />
  <figcaption><strong>Figure 3.</strong> 事前登録された決定論的シミュレーションスイート <code>CA-M1</code> から <code>CA-M5</code> (<code>seed = 20261123</code>, <code>SHA-256: 54a7b2c1…</code>) の定量曲線：協調的 Hill ノイズ抑制と <code>ATP</code> 保存、<code>SepJ</code> の高速孔封鎖、<code>k = 7</code> のスケールフリー 3D フロック凝集（<code>64x</code> 体積拡張下）、<em>Physarum</em> の超線形最短経路選択、そして文献で裏付けられたアーティファクトライブラリを用いた <code>100.0%</code> の除去後文化保持率。</figcaption>
</figure>

<div id="worked-example-1-biophysical-threshold-economics--why-a-lone-secreting-bacterium-goes-bankrupt-and-why-sepj-must-seal-in--030-s-ca-m1-ca-m2-cta-t11cta-t15" class="anchor-alias" aria-hidden="true"></div>

### 作業例1：生物物理学的閾値経済学、単独の分泌細菌が破産する理由と `SepJ` が `<= 0.30 s` 以内に封止しなければならない理由 (`CA-M1`, `CA-M2`, `CTA-T11`-`CTA-T15`)

生物学的外部化に**協同的活性化閾値**と**迅速な障害封じ込めゲート**の両方が必要となる理由を理解するために、`CA-M1` と `CA-M2`（`seed = 20261123`、`board_metered = false`、`[M]`）で実行されたアデノシン三リン酸（`ATP`）および代謝物の方程式を正確に追跡する。

1. **フェーズ1（有界トレーサー外部化と全分泌プロテオームのコスト）**：`5,000` 個のオープンリーディングフレーム（`ORFs`）をもつモデル細菌を考える。これは *Pseudomonas aeruginosa*（`~5,570` `ORFs`）のゲノム規模に相当する。`4,400` 個の細胞内遺伝子にわたるハウスキーピング代謝は、1細胞周期あたり遺伝子1個につき正規化 `ATP` 1.0単位（`4,400.0 ATP`）を要する。一方、`600` 個のクオラム制御遺伝子（ゲノムの `12.0%`：分泌型エラスターゼ、シデロフォア、バイオフィルム菌体外多糖、あるいは *Vibrio* のルシフェラーゼ）は、`3.0x` の細胞外合成・輸送コスト（`1,800.0 ATP`）を負う。全 `5,000` 遺伝子を無条件に発現する構成的変異株は、次の量を消費する。
   $$E_{\text{const}} = 4{,}400.0 + 1{,}800.0 = 6{,}200.0\;\text{ATP/cycle},$$
   これは細胞のエネルギー予算全体の `29.03%`（`1,800 / 6,200`）を、輸送された高分子に費やすことを意味する。局所的な細胞密度 $\rho$ がクオラム閾値 $\rho_K$ を大きく下回るときには、移流による洗い流しがこれらの高分子を機能的濃度未満にまで希釈してしまう。これに対し、野生型の `LuxI`/`LasI` は、$e_{\text{ext}} = 12.0\;\text{ATP/cycle}$（$E_{\text{const}}$ の `0.19%`）のコストで済む微小なアシルホモセリンラクトン（`AHL`）トレーサーを外部化する。

2. **フェーズ2（閾値未満ノイズ下の協同的ヒルゲート）**：浮遊性の低密度 $\rho / \rho_K = 0.20$（拡散損失 `0.50` における細胞外オートインデューサー比 $A / K = 0.20$）では、有理ヒル型受容体スイッチ $H_{n_H}(A/K) = (A/K)^{n_H} / [1 + (A/K)^{n_H}]$（`CTA-T11` から `CTA-T14`）は、協同性指数 $n_H \in \{1, 2, 4\}$ によって著しく異なる代謝予算をもたらす。
   - **単量体受容体（$n_H = 1$）**：$H_1(0.20) = 0.20 / 1.20 = 1/6 \approx 0.1667$ であり、$E_{\text{reg}}(1) = 12.0 + 1{,}800 \times (1/6) = 312.0\;\text{ATP}$（合計 `4,712.0 ATP`）を消費する。さらに悪いことに、拡散性の微小渦が閾値未満の濃度ゆらぎ（$\bar{A}/K = 0.25$、`2,000` 試行にわたるガウス分布 $\sigma = 0.25\,K$）を注入すると、$H_1$ は全周期の **`51.90%`**（`1,038 / 2,000`）で時期尚早のレギュロン発火（$H_1 > 0.20$）を起こす。
   - **協同的二量体（$n_H = 2$、`LuxR` 型）**：$H_2(0.20) = 0.04 / 1.04 = 1/26 \approx 0.03846$ であり、レギュロンの支出は $E_{\text{reg}}(2) = 12.0 + 69.231 = \mathbf{81.231\;\text{ATP}}$ にまで削減される（レギュロン `ATP` の **`95.49%` を節約**、細胞全体では `4,481.23 ATP` で `27.72%` の `ATP` を節約）。また、時期尚早なノイズ起因の起動は `2.92x` 減少し、**`17.75%`** となる。
   - **協同的四量体（$n_H = 4$）**：$H_4(0.20) = 0.0016 / 1.0016 \approx 0.001597$ であり、レギュロンの支出は $E_{\text{reg}}(4) = 12.0 + 2.875 = \mathbf{14.875\;\text{ATP}}$ にまで低下する（レギュロン `ATP` の **`99.17%` を節約**、細胞全体では `4,414.88 ATP` で `28.79%` の `ATP` を節約）。また、誤起動は `11.66x` 減少し、**`4.45%`** となる（`CTA-T13`）。

3. **第3相（多細胞 `SepJ` 回路遮断器タイミング）**: 細胞が `~15 nm` シアノバクテリア隔壁ナノ孔（`CA-M2`、$L = 20$ 結合細胞を4次ルンゲクッタ `RK4` により $\Delta t = 0.002\;\text{s}$ で `20.0 s` にわたり統合）を通じて直接結合した後、端末 `cell 0` の膜溶解が $t = 0$ で即時細胞質シンクを生じる。$\text{Ca}^{2+}$-誘導 `SepJ` キャッププラグ閉鎖が $\tau_{\text{close}} = 0.05\;\text{s}$ で完了する場合、`junction (0,1)` は開放割合 `0.000` までシールされ、`cell 1` の代謝プールの `90.48%`（遠位 `cell 19` では `93.86%`）を保存し、**`19 / 20`（`95.0%`）** の生存細胞（全フィラメント容量の `87.56%`）を維持する。$\tau_{\text{close}} \in [0.15\;\text{s}, 0.30\;\text{s}]$ では、`cell 1` は急峻な過渡低下（代謝の `17.66%` から `13.19%`）を吸収するが、十分速やかにシールして **`18 / 20`（`90.0%`）** の細胞（容量 `85.11%` から `77.85%`）を救う。閉鎖を `0.30 s` より遅くすると、傍観者崩壊が進行し（`1.20 s` で `16 / 20 = 80.0%`、`5.00 s` で `5 / 20 = 25.0%`）、非ゲート型ロックオープン変異体は全フィラメントを **`0 / 20`（`0.0%`）** の生存細胞（残留プール `14.28%`、`CTA-T15`）に枯渇させる。

---

<div id="4-human-cultural-ratchet-extended-mind-machine-culture-and-the-digital-hive-mind-cl14-to-cl19" class="anchor-alias" aria-hidden="true"></div>

## 4. ヒトの文化的ラチェット、拡張された心、機械文化、およびデジタル・ハイブマインド(`CL14` から `CL19`)

ヒトの認知進化は、皮質ニューロンの生物物理学そのものを書き換えることなく、信号損失を段階的に減らし、成果物の寿命を個体の寿命から切り離すことで、集団的な産出を拡大してきた(`[E]`)。

1. **共有志向性、外部化された記録、累積文化(`CL14` から `CL17`)**: 成人の脳の電力予算はおよそ `20 W` である(Balasubramanian 2021) [2]。明示的なヒトの行動スループットは平均で `~10 bit/s` であり(Zheng and Meister 2025) [50]、17言語の話し言葉の自然言語は `~39 bit/s` を符号化する(Coupe et al. 2019) [17]。個人あたりの直列的なボトルネックはこのように厳しいものの、共有志向性(Tomasello et al. 2005)と高忠実度の社会的承認が、**文化的ラチェット**(Tennie, Call, and Tomasello 2009) [48] を生み出す。社会学および哲学の議論は、その結果として生じるマクロ構造を、集合意識(Durkheim 1893)、ヌーosphere(Teilhard de Chardin 1955) [18]、外部のノートや記号が認知処理の構成要素となる**拡張された心**(Clark and Chalmers 1998) [14]、そしてパケット交換ネットワーク全体にわたる大域的な幾何学的な刺激(stigmergic)調整(Heylighen 2007) [28] として捉えてきた。文字の発明(`CL15`)、可動活字による印刷と査読(`CL16`)、そして内容アドレス指定によるバージョン管理(`Git` と自動化された `CI` ゲート、`CL17`)は、損失の多い口承記憶(多段ホップの減衰 $f^k$)を、永続的かつ検査可能な外部記録へと順次置き換えてきた。

2. **デジタル・ハイブマインドとしての疎な `MoE` 基盤モデル(`CL18`)**: フロンティアのニューラルアーキテクチャは、疎な `MoE` の top-$k$ ルーティング(Fedus, Zoph, and Shazeer 2022) [21] により、保存された総パラメータ数($1 \times 10^{12}$ から $3 \times 10^{12}$ のパラメータに達する)と、トークンあたりの有効計算量とを、ますます分離しつつある。任意の単一トークンにおいて活性化されるのは、エキスパート重みのうち `~3%` から `12%` にすぎない。これは、特化した多細胞の分化に類比される([same house] における *Downward LUT6 Compilation* [44] のハードウェアでページングされるルーティング)。生のパラメータ数は生の細胞数に対応するが、$\mathrm{CpJ}$ を支配するのは調整のためのルーティングと検証である。

3. **人間と機械のハイブリッド文化ラチェットおよび`POLIS`社会（`CL19`）**: Brinkmann et al. (2023) [6] は**機械文化**を定式化し、知的機械が文化的変異の生成器、選択器、伝達器として機能するようになったことを示した。とりわけ重要なのは、Brinkmann et al. (2026) [7] による多世代の人間・機械混合実験である。深層強化学習エージェントが、孤立した人間被験者`600`名中`599`名が見逃した直観に反する非近視的戦略を発見した。その後、初期世代の後に機械エージェントを**完全に除去**したところ、威信志向の人間の社会的学習により、機械が発見した戦略は、ハイブリッド集団`15`件中`9`件（`60%`）において最終世代まで保存された。その結果、これらの系譜に属する最終世代の参加者は全員、除去された機械エージェントの文化的子孫となった。`CA-M5`は、この`~60%-76%`の威信模倣による持続性と、`100%`の記録済み人工物ライブラリと比較した場合のコピーノイズに対する脆弱性の両方を再現する。これと相補的に、Zhuang (2025) [50] は`POLIS`（*シリコ内のラチェット効果*）を提示した。これは、生成、ピア検証、共有文化記憶、内面化の各段階を循環する`1B`から`4B`の`LLMs`からなる小規模社会が、`+8.8`から`+18.9`のベンチマーク得点の向上をもたらすことを示すものである。さらに機構的なアブレーション実験により、**ピア検証**が退行を防ぐ主要なラチェット操作子であることが確認された。

<div id="44-the-19502026-artificial-intelligence-ratchet-audit-ai01-to-ai38" class="anchor-alias" aria-hidden="true"></div>

### 4.4 1950-2026年の人工知能ラチェット監査（`AI01` から `AI38`）

カタログ `openie-research-experiments/communication-avalanche/catalogs/ai-history-ratchet-1950-2026.csv`（`AI01` から `AI38`）は、人工知能の76年間（`1950` から `2026`）にわたる38の基礎的マイルストーンを監査する。各システムを保存則に基づく同一の組 (externalized_signal_substrate, ingestion_routing_rule, threshold_or_verifier_gate, bottleneck_broken, failure_boundary_or_winter_cause) に射影する（`[E]` は公表済みの歴史的マイルストーン、`[T]`/`[M]` は2026年における下向きコンパイルによる統合を示す）。この構造的視点から見ると、機械知能の歴史は、無関係なアーキテクチャの流行の系列でも、密な浮動小数点スループットの滑らかで均質な曲線でもない。持続的な変曲点はいずれも、**新たな外部化された通信チャネルと選択的な受入または保存のゲート**の組を獲得することで実現された。そして両度の **AIの冬** は、外部化された状態が扱いやすい探索事前分布や健全な検証ゲートを伴わずに増殖したまさにその時点で到来した。

<figure class="my-8">
  <img src="/figures/communication-avalanche/ai-history-ratchet-1950-2026.svg" alt="1950年のチューリング、IPL、パーセプトロン、Lispから、AIの冬I・II、誤差逆伝播法、LSTM、AlphaGo、スパースMoE、FunSearch、AlphaGeometry、2026年のDES-10デジタル酵素合成に至る、7時代の段階的ラチェットのタイムライン。" />
  <figcaption><strong>図4.</strong> 76年間にわたる人工知能ラチェット監査（<code>AI01</code> から <code>AI38</code>、<code>1950-2026</code>）。上方への各ステップは、外部化された表現と選択的な閾値または検証ゲートの組を伴う。<strong>AIの冬I</strong>（<code>1974-1980</code>）と<strong>AIの冬II</strong>（<code>1988-1993</code>）は、ゲートまたは受入の失敗が正確に対応する事例であり、そこでは無誘導の $O(b^d)$ 探索、ベイズ的でない確信度係数の漂流（<code>CTA-T1</code>、<code>CTA-T2</code>）、あるいは勾配消失が、ジュール当たりのコヒーレンスを停滞させた。</figcaption>
</figure>

1. **時代 I (`1950-1965` · 象徴的および閾値起源、`AI01`-`AI06`)**: チューリング (1950) [87] は、観察不能な心霊主義を外部化されたテレタイプトークンチャネル (`AI01`) に置き換えることでこの分野を創始したが、純粋に会話的な無差別性には内部真理検証器が欠けていた。2年後、シャノンの電磁機械式マウス *Theseus* (`1952`, `AI02`) [82] は、シリコン前駆体ハードウェアにおける物理的スティグマーシを実証した: `5 × 5` 迷路の下に置かれた `75` 個の電話リレーが `2` ビット最出口ベクトルを記憶し、マウスは試行錯誤の壁衝突を $O(1)$ 永続的空間参照表に外部化した。ニューウェルとサイモンの *Logic Theorist* (`1956`, `AI03`) [75] は、情報処理言語 (`IPL`) において動的ポインタ連結リスト構造を発明し、目標証明木を外部化して *Principia Mathematica* の定理 `52` 個のうち `38` 個を証明した。マッカーシー (`1960`, `AI05`) [71] は、実行可能コードと象徴データをホモイコニックな `Lisp` S 式で統一し、ロビンソン (`1965`, `AI06`) [78] は、一階述語論理の演繹を単一の機械検証可能解像・統一ゲートに圧縮した (空節 `[]` を導出)。並行して、ロゼンブラット (`1958`, `AI04`) [80] は、記号下位の `Perceptron` を導入し、重み付けされた光受容器信号を硬い線形ステップゲート $\mathbf{w}^\top \mathbf{x} \ge \theta$ 全体で加算した。

2. **時代 II (`1969-1981` · ルールベース、アクター、ブラックボードおよび AI 冬 I の正確診断、`AI07`-`AI10`)**: ミンスキーおよびペパート (`1969`, `AI07`) [73] は、単層次数 `1` 閾値ゲートがパリティ (`XOR`) または大域的位相的連結性を代数的に表現できないことを証明した。多層ステップゲートを通じた低コスト信用割当チャネルが展開されなかったため、記号下位研究は凍結した。象徴工学は、人間領域ヒューリスティックをモジュール式 `if-then` プロダクションルール (`Heuristic DENDRAL` および `MYCIN`, `1971-1976`, `AI08`) [55, 84]、非同期点対点 `Actor` メールボックス (`Hewitt, Bishop, and Steiger 1973`, `AI09`) [64]、および `Hearsay-II` マルチ専門家 `Blackboard` ワークスペース (`Erman et al. 1980`, `AI10`) [60] に外部化することで対応した。**`Hearsay-II` は AI 冬 I (`1974-1980`) の正確な機構的原因を露呈する**: 独立した知識源 (`KSs`) は共有多レベルブラックボード上で明確に通信したが、手作業で作成された明確ルールは、ノイズを含む音響波形からの微分可能知覚摂取を欠き、低コスト学習済み探索事前分布を欠いていた。健全な勾配または許容枝刈りゲートが存在しないため、競合する構文解析仮説は $O(b^d)$ 組合せ分岐を引き起こし、ヒューリスティック `MYCIN` 式確信度因子 (`CF`) は非ベイズ的多段ドリフト (`CTA-T1`) を蓄積し、語彙およびルール数が $10^3$ を超えて拡大するにつれ `CpJ` が崩壊した。

3. **第III期（`1982-1998` · 勾配チャネル、グラフィカルメッセージパッシングおよびゲート付きメモリ、`AI11`-`AI17`）**: 回復は、連続的かつ確率論的に健全な通信チャネルを考案することによってもたらされた。Hopfield（`1982`、`AI11`）[66] は連想想起をリアプノフ・エネルギーの緩和（$\Delta E \le 0$）として定式化した。Rumelhart, Hinton, and Williams（`1986`、`AI12`）[81] は逆伝播法を、隠れ層の `XOR` 障壁を破る後向きの誤差放送チャネルとして確立した。Pearl（`1988`、`AI13`）[77] は、整合性を欠く確信度係数（Certainty Factors）を、ベイズ有向非巡回グラフ（`DAGs`）上の `d` 分離によりゲートされた信念伝播で置き換えた。Watkins and Dayan（`1989/1992`、`AI14`）[89] は、時間差（`TD`）`Q-learning` により、遅延した環境報酬を後向きに放送した。LeCun et al.（`1989/1998`、`AI15`）[69] は、`ConvNets`（`LeNet-5`）において並進同変な重み共有を課した。Cortes and Vapnik（`1995`、`AI16`）[56] は、決定境界を疎なカルーシュ・クーン・タッカー（`KKT`）サポートベクトルへと外部化した。

重要なのは、**AI冬の時代II（`1988-1993`）** が、特化型Lispハードウェアの汎用マイクロプロセッサに対する経済的崩壊と、飽和シグモイドを深く重ねたことによる指数的勾配消失（後向きの形式における `CTA-T2`）の双方を反映していた点である。Hochreiter and Schmidhuber（`1997`、`AI17`）[65] は、長・短期記憶（`LSTM`）を考案することで時間的消失問題を解決した。これは、$[0,1]$ の乗法的入力ゲート、忘却ゲート、出力ゲートによって保護された線形の定誤差カルーセル（`CEC`）であり、**シアノバクテリアの `SepJ` ナノポア（`CL03`）の厳密な計算論的類似物**として、`>1,000` 回の再帰ステップにわたり、ノイズを含む読み書き摂動に対して記憶された勾配状態を封じ込める。

4. **時代IV（`2006-2016` · 共有コーパス、スキップ・ハイウェイ、ソフト・アテンション、自己対局ラチェット、`AI18`-`AI23`）**: CoulomおよびKocsisとSzepesvári（`2006`、`AI18`）[57] は、非対称な先読み統計量を Upper Confidence Bound for Trees（`UCT`）によるモンテカルロ木探索（`MCTS`）へと外部化した。Dengらによる、群衆検証を経た`14M`枚規模の`ImageNet`台帳（`2009`）は、Krizhevskyらのデュアル`GPU`による`ReLU``AlexNet`（`2012`、`AI19`）[59, 68] と結びつき、現代的なスケールを点火した。MikolovらのWord2Vec（`2013`）およびMnihらの`DQN`における循環型経験再生バッファ（`2015`、`AI20`）[72, 74] は、連続ベクトル幾何学とオフポリシーの`RL`を安定化させた。GoodfellowらのGenerative Adversarial Networks（`GANs`、`2014`）、およびBahdanau、Cho、Bengioによる内容アドレス型ソフト・アテンション（`2015`、`AI21`）[53, 62] は、競合的な識別器ゲートと動的アラインメントを導入した。HeらのResNet（`2016`、`AI22`）[63] は、`152+`層にわたり減衰のない恒等スキップ・ハイウェイ（$\mathbf{y} = \mathbf{x} + \mathcal{F}(\mathbf{x})$）を創出した。時代IVの総括として、SilverらのAlphaGoおよびAlphaZero（`2016-2017`、`AI23`）[85] は、双方向の**`MCTS` $\leftrightarrow$ Policy/Value 自己対局蒸留ラチェット**を閉じた。すなわち、ニューラルな直観がMCTSの分岐を刈り込み、MCTS探索が改善された訪問分布$\pi_{\text{MCTS}}$を外部化し、厳密で決定論的なゲーム規則検証器（`>= 55%` Elo ゲート）が退行を防止した（`CTA-T5`）。

5. **時代V（`2017-2022` · 全対全アテンション、スパース`MoE`、`Evoformer`および人間フィードバック・ゲート、`AI24`-`AI28`）**: VaswaniらのTransformerおよびGilmerらのMessage Passing Neural Networks（`MPNN`、`2017`、`AI24`）[61, 88] は、逐次的な再帰を$O(1)$ホップのランダムアクセス型Key-Value（`KV`）および分子グラフのメッセージパッシングに置き換えた。Shazeerら（`2017`）およびFedus、Zoph、Shazeer（`2022`、`AI25`、`CL18`）[21, 83] は、top-$k$のスパース`MoE`による条件付きルーティング（トークンあたり約3%-12%の重みが活性化）を導入した。BrownらのGPT-3およびLewisらのRetrieval-Augmented Generation（`RAG`、`2020`、`AI26`）[54, 70] は、ウェブ・コーパスによるインコンテキスト条件付けと非パラメトリックな文書索引を組み合わせた。JumperらのAlphaFold 2（`2021`、`AI27`）[67] は、Multiple Sequence Alignment（`MSA`）の共進化統計量を、三角形更新による残基対の幾何学およびドイツ語の`SE(3)`等変なInvariant Point Attention（`IPA`）と結合することで、単量体タンパク質の折りたたみ問題を解決した。最後に、OuyangらのInstructGPT（`RLHF`）、WeiらのChain-of-Thought（`CoT`）、YaoらのReAct（`2022-2023`、`AI28`）[76, 90] は、中間的な作業記憶を自然言語のトークン・スクラッチパッドおよびツール観測ループへと外部化し、多段階の合成を可能にした。同時に、これらは時代Vの失敗様式、すなわち$O(L^2)$の`KV`によるジュール消費、迎合的な人間選好ドリフト、および`3.71x`に達する未検証のマルチエージェント転写ログの肥大化（`CTA-E2`のArm C）を露呈させた。

6. **第VI時代（`2023-2025` · 検証器ゲート型探索、潜在世界モデル、機械文化，`AI29`-`AI34`）**: Assran、LeCun らによる `I-JEPA`（`2023`、`AI29`）[52] は、マスクされた対象を抽象的な潜在空間において直接予測することで、無駄の多い表面ピクセルの再構成を排除した。Brinkmann ら（`2023, 2026`）および Zhuang による `POLIS`（`2025`、`AI30`、`CL19`）[6, 7, 50] は、除去後の文化的固定化（lock-in）と、相互検証された `LLM` のラチェット利得を実証した。Romera-Paredes らの `FunSearch`（`2024`、`AI31`）[79] は、`LLM` によるコード変異を、進化的アイランドにまたがる厳密なサンドボックス適応度評価器と結合した。Trinh らの `AlphaGeometry`（`2024`、`AI32`）[86] は、ニューラルな補助点の提案を、健全な演繹データベースおよび代数規則（`DD+AR`）エンジンと組み合わせた（オリンピック幾何問題 `25 / 30` 問において、幻覚的証明はゼロであった）。Anthropic の `Model Context Protocol`（`MCP`、`2024`、`AI33`）[51] は、型付き `JSON-RPC 2.0` ツールスキーマを標準化し（`N + M` 対 $N \times M$ のアダプタ）、`DeepSeek-R1`（`2025`、`AI34`）[58] は、Group Relative Policy Optimization（`GRPO`）により、決定論的な数学・コンパイラ検証器に対する純粋な強化学習が自己検証を自発的に誘発することを示した。しかし同時に、反復的に出現する構造的問題クラスに対して、なお数千の思考トークン（`~10-50+ J`）を再び費やしている。

7. **第VII時代（`2026` · 下向き結晶化とデジタル酵素的合成，`AI35`-`AI38`）**: 同一組織の関連研究である Open Interface Engineering [44] と本研究は、欠落していた下向きのループを閉じる。`Shape D`（`DNULLMM1`、`AI35`）は、検証済みの修復を $O(1)$ の `1.77 µJ` メモリマップ型ハッシュテーブルに凍結する。`AirMoL` および `Downward LUT6 Compilation`（`AI36`）は、ホットな意思決定経路を `81 × RAMB36E2` の単一サイクル型ハードウェア参照ページにコンパイルする（`0` 個の `DSP48E2` スライス、`~12 pJ` の `est_j`）。`RCE` + `FormEBM`（`AI37`）は、`47.09 mJ` の潜在エネルギー事前フィルタ（`0.8922` の `AUROC`、チェッカー呼び出しを `2.39x` 削減）と、約 `49 mJ` の Reality Code Engine（`RCE`）チェッカー（フロンティアモデル呼び出しより `1,718x` 安価）とを組み合わせる。`CTA` / `DES-10`（`AI38`、`CL20`）は、全 `10` の AI 陣営を、`< 1 mJ` の `BLAKE3` + `Ed25519` デジタル酵素と、証明可能な4段階の下向きコンパイラ（`CTA-T32` から `CTA-T45`）のもとに統一する。

| 時代およびカタログ範囲 | 代表的なマイルストーン (`ai-history-ratchet-1950-2026.csv`) | 外部化された信号基盤 ($\mathcal{E}$) | 選択的閾値または検証器ゲート ($\mathcal{G}$) | 解除されたボトルネック ($\mathcal{T}$) | 停滞境界またはAI冬のメカニズム |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **時代 I (`1950-1965`)** `AI01`-`AI06` | Turing テレタイプ [87]; Shannon *Theseus* [82]; *Logic Theorist* `IPL` [75]; `Perceptron` [80]; `Lisp` [71]; Robinson 分解 [78] | テレタイプトークン、`75`リレーメイズラッチ、ヒープ連結 `IPL`/`Lisp` S式、ポテンショメータ重み、`CNF`節 | 人間対話判定器、ヒゲリレーラッチ、公理同一性、ステップマージン $\mathbf{w}^\top \mathbf{x} \ge \theta$、空節 `[]` | 物理化された記号的再帰、自己言及的コード-as-データ、$O(1)$ リレースティグマーギー、および単一規則統合 | `Perceptron` 次数-`1` `XOR` 天井 [73] および指数的 $O(b^d)$ 記号節爆発 |
| **時代 II (`1969-1981`)** `AI07`-`AI10` | Minsky-Papert `XOR` [73]; `DENDRAL`/`MYCIN` [55, 84]; `Actors` [64]; `Hearsay-II` ブラックボード [60] | モジュール式 `if-then` プロダクション規則、非同期 `Actor` メッセージ、共有多レベル音声 `Blackboard` | 前提閾値 (`CF > 0.2`)、メールボックスカプセル化、機会主義的 `KS` 焦点評価 | 単一制御ループから分離されたドメイン固有ヒューリスティックおよび並行専門家モジュール | **AI冬 I (`1974-1980`)**: 明瞭な手書き `KSs` は微分可能な摂取または低コスト探索事前分布を欠き $\to$ $O(b^d)$ 停滞および `CF` ドリフト |
| **時代 III (`1982-1998`)** `AI11`-`AI17` | Hopfield [66]; Backprop [81]; Pearl `DAG` [77]; `Q-learning` [89]; `ConvNet` [69]; `SVM` [56]; `LSTM` [65] | Ising 結合、逆モード $\partial\mathcal{L}/\partial z$、`DAG` $\pi/\lambda$ メッセージ、`TD` 誤差、共有カーネル、`CEC` セル状態 | Lyapunov $\Delta E \le 0$、`d`分離、Bellman 縮小、`KKT` マージン、`LSTM` 乗法ゲート (`SepJ` アナログ) | 多層表現、コヒーレントな因果推論、生ピクセル視覚、および `>1,000`ステップ時系列記憶の解除 | **AI冬 II (`1988-1993`)**: Lispハードウェア崩壊、飽和シグモイド勾配消失、および $O(T)$ 逐次 `RNN` ボトルネック |
| **時代 IV (`2006-2016`)** `AI18`-`AI23` | `MCTS`/`UCT` [57]; `ImageNet`+`AlexNet` [59, 68]; `Word2Vec`+`DQN` [72, 74]; `GAN`+Attention [53, 62]; `ResNet` [63]; `AlphaGo`/`Zero` [85] | `UCT` ロールアウト木、`14M`画像台帳、リプレイバッファ、ソフトアテンションアライメント、アイデンティティスキップバス、自己対戦 $\pi_{\text{MCTS}}$ | `UCT` 信頼境界、`ILSVRC` オラクル、凍結ターゲットネット、識別器ミニマックス、`>= 55%` Elo ゲーム規則ゲート | `GPU` 深層学習、`152+`層勾配フロー、および超人的神経 $\leftrightarrow$ 記号的自己対戦蒸留の点火 | 自明な入力に対する密な全層前方掃引およびメガジュール閉世界シミュレータ依存 |
| **時代 V (`2017-2022`)** `AI24`-`AI28` | `Transformer`+`MPNN` [61, 88]; `Sparse MoE` [21, 83]; `GPT-3`+`RAG` [54, 70]; `AlphaFold 2` [67]; `InstructGPT`+`CoT`+`ReAct` [76, 90] | 全ペア `KV` キャッシュ、トップ-$k$ 専門家ルーティング (`CL18`)、`MIPS` 文書パッセージ、`MSA`$\leftrightarrow$ペアテンソル、`CoT` スクラッチパッド | スケーリングされたソフトマックス、トップ-$k$ ルータ (`3%-12%` 活性)、`SE(3)` `IPA` 三角形一貫性、`RLHF` 報酬 + ツール返却コード | $O(1)$ホップ並列化グローバルコンテキスト、兆重み条件付き容量、原子タンパク質折り畳み、およびゼロショットツールループ | $O(L^2)$ `KV` ジュール税、自己満足的 `RLHF` 報酬ハッキング、および `3.71x` 未検証マルチエージェント散文ドリフト (`CTA-E2` `Arm C`) |
| **時代 VI (`2023-2025`)** `AI29`-`AI34` | `I-JEPA` [52]; *Machine Culture*+`POLIS` [6, 7, 50]; `FunSearch` [79]; `AlphaGeometry` [86]; `MCP` [51]; `DeepSeek-R1` [58] | 潜在ターゲットブロック、文化的人工物ストア (`CL19`)、進化的コード島、ユークリッド証明状態、`MCP` スキーマ、`<think>` トレース | `EMA` 非崩壊、ピア検証、サンドボックス適合性、`DD+AR` 証明エンジン、`JSON` スキーマ、`GRPO` コンパイラ/数学検証器 | 確率的 `LLMs` を非退行発見エンジンに変える外部検証器の証明 (`25/30` オリンピック、極値数学) | 特設二陣営橋梁および反復 `10-50+ J` 思考トレースの再実行 (反復構造クラスに対してゼロから) |
| **時代 VII (`2026`)** `AI35`-`AI38` | `Shape D` `DNULLMM1`; `AirMoL`/`LUT6`; `RCE`+`FormEBM`; `CTA` / `DES-10` [44] `[same house]` | 凍結 `mmap` ケーススロット、`81 × RAMB36E2` `LUT6` ページ、正準プログラム `Forms`、`BLAKE3`+`Ed25519` `Phi_IR` エンベロープ (`CL20`) | `SHA-256` ストア凍結、`1`サイクル真理表パリティ、`~49 mJ` `RCE` チェッカー、`< 1 mJ` 暗号 + `eventfd` + `SSP` + サンドボックスゲート | **下向きループを閉じる**: `~15 J` 発見が `~15-49 mJ` 規則 $\to$ `1.77 µJ` ケース $\to$ `~12 pJ` `LUT6` 反射 (`0` 偽コミット) に結晶化 | 正確な償却偽造器 $h_{\min} = E_{\text{comp}} / (N (c_{\text{high}} - c_{\text{low}}))$ (`CTA-T45`) により統治される |

---

<div id="worked-example-2-historical-ratchet-diagnosis-19502026--why-1975-mycin-and-1980-hearsay-ii-stalled-into-ai-winter-i-while-2016-alphago-and-2024-funsearch-ignited-cta-t1cta-t6" class="anchor-alias" aria-hidden="true"></div>

### 作業例 2: 歴史的ラチェット診断（`1950`-`2026`）， なぜ `1975` `MYCIN` と `1980` `Hearsay-II` が AI ウィンター I に停滞し， `2016` `AlphaGo` と `2024` `FunSearch` が（`CTA-T1`-`CTA-T6`）で点火したのか

歴史的人工知能アーキテクチャを三相オペレータ $(\mathcal{E}, \mathcal{G}, \mathcal{T})$ に写像することにより， 初期のマルチモジュールシステムが停滞し， 現代の生成-検証ループが超人的ロックインを実現した理由が説明できる（`[E]`, `[T]`）：

1. **`MYCIN`（`1975`）と`Hearsay-II`（`1980`）が停滞した理由**:
   - *外部化（$\mathcal{E}$）*: `MYCIN`は、主観的な確信度因子（`CF`、$\mathrm{CF} \in [-1, 1]$）を伴う約`450`個の手作業で記述された`Lisp`の生成規則を外部化した。`Hearsay-II`は、多粒度の音声仮説（音響、音素、音節、語彙、句）を、$K$個の並行する知識源（`KS`）がポーリングする大域的共有黒板上に外部化した。
   - *不健全なゲート（$\mathcal{G}$）*: 両アーキテクチャとも、厳密で真理保存的な受理ゲート（$V(m) = 1 \not\Rightarrow \text{valid}(m)$）を備えていなかった。`MYCIN`の`CF`結合代数は、有向非巡回グラフ（`DAG`）上の`d`分離を用いずに相関のある臨床証拠を条件付き独立として扱ったため、$k$個の規則を連鎖させると、較正ドリフト $\mathrm{err}_0 + k\epsilon$（`CTA-T1`）が蓄積し、乗法的な忠実度減衰 $f^k$（`CTA-T2`: 連鎖する$k = 12$個の規則における規則ごとの精度$f = 0.92$では、結合的妥当性は$0.92^{12} = 0.3677$まで低下する）を被った。同時に、`Hearsay-II`の閾値を設けない黒板は、ノイズを含む下位からの音節断片に対して$O(K \cdot |B|)$回のスケジューラ検査を強いられ（`CTA-T9`）、計算資源の大半を偽陽性の部分解析の調停に費やした。
   - *欠落していた下方蒸留（$\mathcal{T}$）*: 規則数を`450`から`4,500`へ拡大するには、人間の専門家が規則間の対ごとの相互作用を手作業で監査する必要があり、保守に要するエネルギーが診断による成果を上回った時点で**第一次AIの冬**に陥り停滞した。

2. **`AlphaGo`（`2016`）と`FunSearch`（`2024`）が火をつけた理由**:
   - *外部化（$\mathcal{E}$）*: `AlphaGo`は、学習された方策および価値の事前分布 $(p_\theta, v_\theta)$ を、明示的なモンテカルロ木探索（`MCTS`）の状態-行動表 $(N(s,a), Q(s,a))$ へ外部化した。`FunSearch`は、コンパクトなPythonの優先度関数（自然言語の論説ではなく、`10`から`30`行のコード）を、多島進化的プログラムデータベースへ外部化した。
   - *健全な決定的ゲート（$\mathcal{G}$）*: `AlphaGo`は、厳密な囲碁の盤面規則により合法な遷移と終局結果をゲートした。`FunSearch`は、すべての言語モデルによる変異を、決定的な組合せ的見届け検査器（厳密なcap-set独立性やbin-packingの容量をミリ秒単位で検証）によりゲートした。幻覚的または準最適なコードはすべて`admittedWeight = 0`を受け（`CTA-T3`, `CTA-T17`）、生のモデルサンプルの>`99%`が改善をもたらさない場合でも、島の汚染を厳密に`0.0%`に抑えた。
   - *非退行的ロックイン（$\mathcal{T}$）*: `AlphaGo`は、高コストな数千ロールアウト規模の`MCTS`分布を、高速な単一パスのニューラル重みへ下方蒸留した。一方`FunSearch`は、島をまたいで厳密により高スコアの検証済みプログラムを保持（$Q(t+1) \ge Q(t)$、`CTA-T5`, `CTA-T6`）し、ノイズの多い確率的提案を恒久的な数学的ラチェットへと転換した。

---

<div id="5-event-driven-attested-orchestration-five-host-fleet-telemetry-and-ten-camp-synthesis-cta-e1-to-cta-e5" class="anchor-alias" aria-hidden="true"></div>

## 5. イベント駆動型認証付きオーケストレーション、5ホスト構成のテレメトリ、および10陣営の統合(`CTA-E1` から `CTA-E5` まで)

第2節および第3節で検討したすべての進化段階にわたる生物の協調は、全体的なクロック刻みや検証されない一斉通信ではなく、局所的な濃度勾配、協同的な活性化閾値、および選択的な孔の閉鎖によって成立している。これらの機構をソフトウェア工学へ移し替えると、異種の計算カーネルと言語モデルが、エネルギー予算が設定され暗号学的に認証された経路を介して通信する、イベント駆動型のオーケストレーション・アーキテクチャが得られる。本節では、コミュニケーションツール・アバランシェ(CTA)オーケストレータの4つの構造的構成要素を明示する。あわせて、実行前に固定された事前登録の反証条件(`F1` から `F6` まで。Secure Hash Algorithm `SHA-256` ダイジェスト `5739bcdd6c35662833a470bc56bd64f991774c2d920a5a9c059c0acebdf55e7f` により確定)を提示する。さらに、20スレッドの `13th Gen Intel Core i9-13900H` を搭載するLinuxホスト(`rustc 1.100.0`、`Python 3.14.4`)上で実施した3つの実験(`CTA-E1`、`CTA-E2`、`CTA-E3`)の実測ハードウェア計測結果を報告する。

<div id="51-measurement-grammar-and-telemetry-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 5.1 測定文法とテレメトリ開示

`CTA-E1` から `CTA-E3` のすべてのローカルプロセッサエネルギー値は、Linux `sysfs` `powercap` Running Average Power Limit (RAPL) カウンタから、ラップセーフな 64 ビット累積（ modulo `max_energy_range_uj = 262,143,328,850` マイクロジュール (`262.143 J`)）で読み取られる。すべての測定は、以下の三つの分離規則に厳密に従う。

1. **オンチップ `reported_j` と外部壁電力の区別**: 外部インラインシャントや交流 (AC) ボード電力アナライザーは接続されていない (`measured_j = None`, `board_metered = false`)。すべてのローカルエネルギー数値は `reported_j` としてスタンプ付けされる。
2. **三レール RAPL 開示 (`package-0`, `core`, および `psys`)**: 各実験は `intel-rapl:0` (`package-0`, 中央処理装置 (CPU) およびシステムオンチップ (SoC) ソケットエネルギー `pkg_reported_j`)、`intel-rapl:0:0` (`core`, プロセッサコア平面 `core_reported_j`)、および `intel-rapl:1` (`psys`, プラットフォームカウンタ `psys_reported_j`) を記録する。このノートPC ホストでは、OEM 組み込みコントローラ (EC) ファームウェアが `intel-rapl:1` (`psys`) を約 `0.202 W` (`0.20 J/s`) の静的静止レートに固定しており、`package-0` がアイドル時の約 `5.0 W` からシングルコア負荷時の約 `27.7 W` に上昇してもスケールしない。したがって、主要なローカル Coherence per Joule (CpJ) は動的 `pkg_reported_j` に対して算出され（`core_reported_j` と共に報告される）、`psys_reported_j` はすべての JSON アーティファクトおよび台帳行に文字通り保存される。
3. **ローカルジュールとリモートクラウドトークンの厳格な分離**: アームがリモート API 大規模言語モデル (LLM) を呼び出す際、リモートデータセンタサーバのエネルギーは `not_available` として記録され、ヒューリスティック定数から推定されない。正確な API 呼び出し回数、プロンプトおよびコンプリーショントークン数、そして公開リストレートでの米ドル (USD) (`\$3.00` / 百万入力トークン、`\$15.00` / 百万出力トークン for `Claude Sonnet 5.5`) は、ローカル `pkg_reported_j` とともに専用列で報告される。

<div id="52-orchestrator-architecture-attested-channels-and-min-cost-flow" class="anchor-alias" aria-hidden="true"></div>

### 5.2 オーケストレーターアーキテクチャ、認証済みチャネル、および最小コストフロー

$G = (V, E)$は実行ノード$u \in V$が型付けされた有向チャネル$(i, u) \in E$で接続された有向非巡回グラフ（DAG）を表す：

1. **異種実行プールおよび`cost_lut.json`**：決定論的ノードは字句および抽象構文木（AST）解析（`parse_kernel`）、スコープ、可変デフォルト、および型強制解析（`static_type_scope_kernel`）、docstringおよび代数的不変式合成（`test_gen_kernel`）、有界AST/トークン修復（`det_patch_kernel`）、および分離された行動的受容（`diff_verifier_kernel`）を実行する。非決定論的合成（`llm_patch_proposer`）は高コストエスカレーションブランチ上に位置する。オーケストレーション実行に先立ち、すべての決定論的カーネルおよび暗号プリミティブは3つの入力サイズバケット（`< 320 B`、`320-640 B`、`> 640 B`）にわたってプロファイルされ、ハードウェア鍵付きルックアップテーブル（`cost_lut.json`）に格納される。
2. **定数時間暗号チャネル認証**：すべてのチャネルエッジは、送信者の決定論的`Ed25519`鍵ペア（`64`バイトRequest for Comments（RFC）`8032`厳格署名を`ed25519-dalek`経由で使用）により署名されたエンベロープを、ドメイン分離ヘッダおよびペイロードバイトの`256`ビット`BLAKE3`ダイジェスト上に保持する。受信ノードは、送信者認証、定数時間`BLAKE3`ダイジェスト等価性、厳格`Ed25519`署名有効性、およびJavaScript Object Notation（JSON）フレーム完全性をチェックした後にノード状態を変更する。
3. **逐次最短経路（SSP）最小コストフロースケジューラ**：エッジ容量$c(i, u)$および`cost_lut.json`から引き出されたマイクロジュールスケール重み$w(i, u)$が与えられた場合、コンパイルされたRustスケジューラはソース$s$からコミットシンク$t$への需要$D$の最小コストフローを計算する：

$$
\min_{f} \sum_{(i, u) \in E} w(i, u)\, f(i, u) \quad \text{subject to} \quad 0 \le f(i, u) \le c(i, u), \quad \sum_{i} f(i, u) - \sum_{v} f(u, v) = b(u),
$$

Bellman-Ford初期ノードポテンシャル$\pi(u)$に続いてJohnson還元コストDijkstra増大$w_{\pi}(i, u) = w(i, u) + \pi(i) - \pi(u) \ge 0$を使用する。スケジュールはグラフトポロジーおよび`cost_lut.json`のみに依存するため、`SSP`はトポロジーエポック`0`で1回だけ実行され（`CTA-E2`プールで`2.11 µs`）、ノードが脱落または参加する場合にのみ再計算される（ティックごとのスケジューラオーバーヘッドは`0`）。
4. **閾値積分発火起動（ゼロクロック、ゼロポーリング）**：各ノード$u$は着信重み付き信号$s_i$上の蓄積膜電位$V_u$を維持する：

$$
V_u(t) = \sum_{(i, u) \in E} w_{iu}\, s_i(t), \qquad \text{fire}(u) \iff V_u(t) \ge \theta_u.
$$

ワーカースレッドは$V_u < \theta_u$の間、Linuxカーネル内の`eventfd`（`EFD_CLOEXEC`）でブロックし、CPUサイクルをゼロ消費する。上流ノード$i$は閾値交差遷移$V_u < \theta_u \to V_u \ge \theta_u$において厳密に`eventfd`に書き込む。各発火は不変レシート`(trace_id, step_idx, node_id, input_blake3, output_blake3, ed25519_sig_prefix, verify_ns, psys_reported_j, pkg_reported_j, latency_ms, potential_v, threshold_theta)`をエネルギー台帳に追加する。

| コンポーネント / プリミティブ | バケット / ペイロード | 平均レイテンシ | 演算当たりの `pkg_reported_j` | 演算当たりの `core_reported_j` | オーケストレーショングラフにおける役割 |
| :--- | :--- | ---: | ---: | ---: | :--- |
| `parse_kernel` | `320-640 B` (`200` 試行) | `56.90 µs` | `1.38 mJ` | `1.16 mJ` | 字句的括弧スタックおよびAST位置特定 |
| `static_type_scope_kernel` | `320-640 B` (`200` 試行) | `29.26 µs` | `0.64 mJ` | `0.55 mJ` | 未束縛シンボル、可変デフォルト値、型強制 |
| `test_gen_kernel` | `320-640 B` (`200` 試行) | `13.33 µs` | `0.36 mJ` | `0.30 mJ` | 公開doctestおよび代数的不変量の合成 |
| `det_patch_kernel` | `320-640 B` (`200` 試行) | `601.60 µs` | `15.73 mJ` | `13.35 mJ` | 有界なAST/トークンパッチ合成 (`<= 16` 試行) |
| `diff_verifier_kernel` | `320-640 B` (`200` 試行) | `47.67 µs` | `1.12 mJ` | `0.95 mJ` | 隔離実行、反復呼び出し、および性質ゲート |
| Rust `BLAKE3` + `Ed25519` 検証 | `64 B` (`50,000` 試行) | `26.05 µs` (`p50 25.95 µs`) | `643.03 µJ` | `543.65 µJ` | 定数時間チャネルエンベロープ検証 |
| Rust `BLAKE3` + `Ed25519` 検証 | `1 KiB` (`50,000` 試行) | `27.35 µs` (`p50 27.04 µs`) | `650.59 µJ` | `546.58 µJ` | 典型的なAST診断パケットの検証 |
| Rust `BLAKE3` + `Ed25519` 検証 | `16 KiB` (`50,000` 試行) | `29.36 µs` (`p50 29.32 µs`) | `696.16 µJ` | `584.07 µJ` | 複数関数パッチペイロードの検証 |
| Rust `BLAKE3` + `Ed25519` 検証 | `64 KiB` (`50,000` 試行) | `37.47 µs` (`p50 37.39 µs`) | `926.42 µJ` | `784.95 µJ` | 大規模コンテキストチャネルの検証 (`< 1 mJ`) |

チャネルペイロードサイズが `64 B` から `64 KiB` へと1,024倍に増加する範囲において、コンパイル済みRust `BLAKE3` + `Ed25519` 検証のレイテンシは、中央値で `25.95 µs` から `37.39 µs` へと1.44倍に増加した。また、ソケット当たりのエネルギーは `643.03 µJ` から `926.42 µJ` の範囲にとどまり、1 mJ未満を維持した。これにより、事前登録された反証条件 Falsifier 2 (エッジ当たり `< 100 µs` かつ `< 5 mJ`) を満たすことが確認された。

<figure class="fig">
  <img src="/figures/communication-avalanche/orchestration-coherence-per-joule.svg" alt="CTA-E1のゼロクロック閾値とクロック付きポーリングのRAPLジュール値、およびCTA-E2の60タスクにおけるジュール当たりのコヒーレンスを示す、ダークテーマの二パネル概要図">
  <figcaption><strong>図5.</strong> <code>13th Gen Intel Core i9-13900H</code> における実行済みハードウェアベンチマーク（Linux の <code>RAPL</code>、<code>reported_j</code>、<code>board_metered = false</code>、<code>measured_j = None</code>）。<strong>左（<code>CTA-E1</code>）</strong>: <code>1%</code>、<code>5%</code>、<code>20%</code> のバースト型デューティサイクル（<code>10.0 s</code> のウィンドウ × <code>5</code> 反復）における16ノードのオーケストレーションDAGのソケットエネルギー、および Rust による <code>BLAKE3</code> と <code>Ed25519</code> の検証コスト。<strong>右（<code>CTA-E2</code> および <code>CTA-E3</code>）</strong>: <code>60</code> タスクの Python コード修復の合格率、誤コミット率、ローカルの <code>RAPL</code> とクラウドのトークン・USD コストを分離した値、ジュール当たりのコヒーレンス、ならびに <code>0 / 200</code> のビザンチン障害封じ込め結果。インタラクティブ探索ツール: <a href="/living/communication-avalanche/">/living/communication-avalanche/</a></figcaption>
</figure>

<div id="53-cta-e1-event-driven-thresholded-gradients-vs-clocked-polling-tax" class="anchor-alias" aria-hidden="true"></div>

### 5.3 `CTA-E1`: イベント駆動閾値勾配とクロックポーリング課税の比較

`CTA-E1` は 5 層、16 ノードの認証済みオーケストレーション DAG を実装する (`16` ワーカー OS スレッドが `BLAKE3` + `Ed25519` エンベロープを交換し、内部層が `2` から `4` の上流入力を統合して $\theta_u = 1.0$ を超える) もので、`1%`、`5%`、`20%` の目標アクティブデューティサイクルに対しバースト的マイクロバッチ到着で駆動される (`10.0 s` ウィンドウごとに実行し、`4` 種類のスケジューリングレジームを各 `5` 回のレプリケート内で交互に配置 = `60` ウィンドウ、総実行時間 `600 s`)。スレッド全体の OS コンテキストスイッチは `/proc/self/task/*/status` から合算される。

**`Falsifier 6` 基準ドリフト開示 on `CTA-E1`**: ベンチマーク前の静止 `5.0 s` アイドル電力は `3.95 W` (`pkg_reported_j = 19.77 J`) と測定されたのに対し、`600 s` の負荷直後の即時 `5.0 s` ポストベンチマークテイルは `20.13 W` (`410.2%` 熱/バックグラウンドテイルドリフト) を示し、`10.0%` の `Falsifier 6` 閾値を超えている (一時的な熱/バックグラウンドプラトーにより `5%` デューティレプリケートが `20%` デューティレプリケートに対しても上昇した)。事前登録された `Falsifier 6` に従い、アイドル差し引き済みのネットジュールは **保留** され、`CTA-E1` については生の差し引きなし `reported_j` 値とレプリケート内交差比較のみが報告される。

| デューティサイクル (`10.0 s` × `5` 反復) | スケジューリング方式 | 平均 `pkg_reported_j` | 平均 `core_reported_j` | 平均 `psys_reported_j` | ノード起床回数 (`Empty Polls`) | OSスレッドのコンテキストスイッチ数 | イベントからコミットまでの `p50` / `p99` (`ms`) |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| `1%` (`51` イベント/ウィンドウ) | **ゼロクロック `eventfd` ($V \ge \theta$)** | **`136.32 J`** | **`96.24 J`** | `2.03 J` | **`559.4` (`0.0`)** | **`811.4`** | **`2.58` / `1,016.18`** |
| `1%` (`51` イベント/ウィンドウ) | `10 Hz` クロック駆動ポーリング | `143.42 J` | `103.76 J` | `2.04 J` | `1,600.0` (`1,284.8`) | `1,963.0` | `570.38` / `1,354.16` |
| `1%` (`51` イベント/ウィンドウ) | `100 Hz` クロック駆動ポーリング | `198.51 J` | `157.35 J` | `2.06 J` | `15,799.8` (`15,475.6`) | `16,156.2` | `55.22` / `1,057.93` |
| `1%` (`51` イベント/ウィンドウ) | `1,000 Hz` クロック駆動ポーリング | `300.73 J` | `259.17 J` | `2.08 J` | `150,139.8` (`149,844.2`) | `150,574.8` | `7.34` / `1,015.30` |
| `5%` (`255` イベント/ウィンドウ) | **ゼロクロック `eventfd` ($V \ge \theta$)** | **`318.78 J`** | **`275.34 J`** | `2.52 J` | **`2,792.6` (`0.0`)** | **`2,603.8`** | **`2.75` / `208.12`** |
| `5%` (`255` イベント/ウィンドウ) | `10 Hz` クロック駆動ポーリング | `315.24 J` | `274.76 J` | `2.54 J` | `1,598.6` (`335.0`) | `1,965.2` | `558.26` / `766.20` |
| `5%` (`255` イベント/ウィンドウ) | `100 Hz` クロック駆動ポーリング | `331.84 J` | `290.23 J` | `2.56 J` | `15,795.0` (`14,132.2`) | `16,173.6` | `51.98` / `254.40` |
| `5%` (`255` イベント/ウィンドウ) | `1,000 Hz` クロック駆動ポーリング | `406.75 J` | `360.50 J` | `2.61 J` | `149,823.8` (`148,335.8`) | `150,240.0` | `7.46` / `216.57` |
| `20%` (`1,020` イベント/ウィンドウ) | **ゼロクロック `eventfd` ($V \ge \theta$)** | **`236.43 J`** | **`196.07 J`** | `2.39 J` | **`10,260.8` (`0.0`)** | **`9,002.4`** | **`2.76` / `55.19`** |
| `20%` (`1,020` イベント/ウィンドウ) | `10 Hz` クロック駆動ポーリング | `231.45 J` | `186.90 J` | `2.37 J` | `1,582.0` (`81.0`) | `2,046.2` | `547.62` / `721.74` |
| `20%` (`1,020` イベント/ウィンドウ) | `100 Hz` クロック駆動ポーリング | `234.04 J` | `188.89 J` | `2.35 J` | `15,649.6` (`9,280.2`) | `16,117.0` | `52.07` / `99.54` |
| `20%` (`1,020` イベント/ウィンドウ) | `1,000 Hz` クロック駆動ポーリング | `269.13 J` | `223.87 J` | `2.32 J` | `148,023.6` (`142,013.6`) | `148,638.2` | `7.43` / `59.39` |

クロック駆動ポーリングは、多段ホップグラフにまたがって遅延とジュールのあいだの構造的なジレンマに直面する（`Falsifier 1`）。クロックを `10 Hz` まで減速させると、ウェイクアップに伴うエネルギーは低く抑えられる（`10 s` あたり `1,600` 回のウェイクアップ）。しかし、多段のティック整列により、イベントからコミットまでの中央値遅延は `200x` から `221x` へと膨張する（`547.62-570.38 ms` 対 `2.58-2.76 ms`）。一方、クロックを `1,000 Hz` まで加速させると、中央値遅延は `7.34-7.46 ms` まで縮小するが、これは直接的な `eventfd` ハンドオフに対して依然として `2.7x` の遅延である。同時に、`10 s` の観測窓あたり `~150,000` 回のスレッドウェイクアップが発生し（`1%` デューティにおいて `99.8%` が空振り）、プロセッサの C ステート滞留を妨げ、`1%` デューティの `10 s` 窓あたり `+164.40 J`（ソケットエネルギーの `2.21x`、コアエネルギーの `2.69x`）を消費する。この増加は、対応づけられた反復試行 `5 / 5` のすべてで正であり（`+82.32 J` から `+313.29 J`）、`5%` デューティでは `+87.97 J`（`+27.6%`）となる（対応づけられた反復試行 `5 / 5` のすべてで正、`+60.87 J` から `+140.18 J`）。これに対し、ゼロクロックの閾値付き `eventfd` 発火は、空振りウェイクアップを `0` 回に抑え、`1%` デューティにおける最小のエネルギー消費を達成するとともに、`2.58-2.76 ms` の中央値コミット遅延を同時に実現する。

<div id="54-cta-e2-60-task-multi-category-code-repair-benchmark-240-episodes" class="anchor-alias" aria-hidden="true"></div>

### 5.4 `CTA-E2`: 60タスク多カテゴリコード修復ベンチマーク (`240` エピソード)

`CTA-E2` は、`60` 件のタスクからなる凍結済み Python コード修復コーパス（`corpus_sha256 = b4ea0228270b8e6ae06f935fe8b92ed45cf2da4d9aa0d4868d0a42d4e6e9e802`）を評価する。このコーパスは `20` 件ずつ三つのカテゴリに層化されている。

- **カテゴリ 1 (`C1_01`-`C1_20`)**: 構文、インデント、括弧区切り、C 演算子、および標準ライブラリの import 欠落による欠陥。
- **カテゴリ 2 (`C2_01`-`C2_20`)**: 未束縛識別子の誤字、可変デフォルト引数による状態漏洩（`=[]`、`={}`、`=set()`）、インプレース変更メソッドの戻り値（`return xs.sort()`）、浮動小数点から整数への除算型強制、およびコンテナ API の欠陥。
- **カテゴリ 3 (`C3_01`-`C3_20`)**: アルゴリズム、数値計算、および状態機械の欠陥。Tarjan 強連結成分の後退辺更新、制約なし Damerau-Levenshtein 転置、辞書順最小ホップ Dijkstra、重複を含む Knuth-Morris-Pratt 境界、Neumaier 補償和、二重 Fenwick 範囲更新、銀行家の丸めを伴う `Q16.16` 飽和、非互いに素な中国剰余定理、小数トークンバケットの上限クランプ、反射型 `CRC-8/MAXIM`、ターゲット指定の負閉路 Bellman-Ford、エスケープ付きラン長符号化チャンク化、および Raft Figure 2 の `AppendEntries` における接頭辞安全な衝突切り詰めを含む。

各タスクは、事後にコミットされた解を隔離された保留オラクルに対して採点される。オラクルは `>= 8` 個の単体テストベクトルを同一の関数オブジェクト上で二度実行し、状態漏洩を検出する。修復中のオラクルへのアクセスは `0` である（反証条件 `Falsifier 3` を満たす）。ベンチマーク実行の事前と事後において、`5.0 s` の静穏なアイドル状態でのソケット電力は `6.10 W` から `5.49 W` まで測定された（ドリフト `9.93%`、反証条件 `Falsifier 6` の `<= 10.0%` を満たす）。

検証済みローカル Coherence per Joule を次のように定義する。

$$
\mathrm{CpJ}_{\text{pkg}} = \frac{N_{\text{verified\_correct}}}{E_{\text{pkg\_reported\_j}}}, \qquad \mathrm{CpJ}_{\text{core}} = \frac{N_{\text{verified\_correct}}}{E_{\text{core\_reported\_j}}}.
$$

| 腕（各 `60` タスク・計 `240` エピソード） | 検証済み合格率 | 誤コミット（`Broken Accepted`） | LLM 呼び出し | プロンプト + 出力トークン | クラウド API 支出（`USD`） | ローカル `pkg_reported_j`（`core_reported_j`） | 壁時計時間（`s`） | `CpJ_pkg`（`tasks / J`） |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **Arm A (`Det-Only` プール)** | `40 / 60` (`66.67%`) | **`0 / 60` (`0.00%`)** | `0` | `0` | `\$0.00` | **`1.51 J`** (`1.28 J`) | `0.06 s` | **`26.539`** |
| **Arm B (`Monolithic-LLM`, `Sonnet 5.5`)** | `59 / 60` (`98.33%`) | `1 / 60` (`1.67%`) | `60` | `44,843` (`21.0k` + `23.8k`) | `\$0.42` | `902.51 J` (`160.93 J`) | `193.88 s` | `0.065` |
| **Arm C (`Unattested-4-Agent` アバランシェ)** | `52 / 60` (`86.67%`) | `8 / 60` (`13.33%`) | `240` | `288,583` (`190.0k` + `98.6k`) | `\$2.05` | `5,710.77 J` (`1,043.40 J`) | `1,229.15 s` | `0.009` |
| **Arm D (`CTA-Orchestrator`)** | **`59 / 60` (`98.33%`)** | **`0 / 60` (`0.00%`)** | **`21`** | **`28,452`** (`14.1k` + `14.4k`) | **`\$0.26`** | **`432.75 J`** (`74.08 J`) | **`95.12 s`** | **`0.136`** |

| カテゴリ別内訳（セルあたり `20` タスク） | アーム A（`Det-Only`） | アーム B（`Monolithic-LLM`） | アーム C（`Unattested-4-Agent`） | アーム D（`CTA-Orchestrator`） |
| :--- | :--- | :--- | :--- | :--- |
| **カテゴリ 1: 構文と import（`20`）** | `20/20`（`0` 不正, `0` 呼び出し, `0.40 J`） | `20/20`（`0` 不正, `20` 呼び出し, `\$0.09`, `175.95 J`） | `20/20`（`0` 不正, `80` 呼び出し, `\$0.55`, `1,745.66 J`） | **`20/20`（`0` 不正, `0` 呼び出し, `\$0.00`, `0.79 J`）** |
| **カテゴリ 2: スコープ、型、API（`20`）** | `20/20`（`0` 不正, `0` 呼び出し, `0.34 J`） | `20/20`（`0` 不正, `20` 呼び出し, `\$0.08`, `219.51 J`） | `20/20`（`0` 不正, `80` 呼び出し, `\$0.58`, `2,163.94 J`） | **`20/20`（`0` 不正, `0` 呼び出し, `\$0.00`, `0.71 J`）** |
| **カテゴリ 3: アルゴリズムと状態ロジック（`20`）** | `0/20`（`0` 不正, `20` 拒否, `0.77 J`） | `19/20`（`1` 不正 `C3_05`, `20` 呼び出し, `\$0.25`, `507.06 J`） | `12/20`（`8` 不正, `80` 呼び出し, `\$0.92`, `1,801.18 J`） | **`19/20`（`0` 不正, `1` 拒否 `C3_17`, `21` 呼び出し, `\$0.26`, `431.25 J`）** |

三つの実証的知見が際立つ（`Falsifier 4`）：

1. **決定論的事前フィルタリングは、ミリジュール規模で欠陥の `66.67%`(`40 / 60`)を封じ込める**。`Arm A` は Category-1 のタスク `20 / 20` と Category-2 のタスク `20 / 20` を `57 ms` かつ `1.51 J` で解決し(検証済み修正 1 件当たり `37.7 mJ`、モデル呼び出し `0` 回)、Category-3 の論理欠陥 `20` 件はすべて棄却した(誤コミット `0` 件)。同じ `40` 件の構造的タスクに対して単一の LLM(`Arm B`)を呼び出すと `395.45 J`(`40` 回の呼び出し、`\$0.17`)を要し、4 エージェント連鎖(`Arm C`)では `3,909.60 J`(`160` 回の呼び出し、`\$1.13`)を要するが、いずれも精度の向上は見られなかった。
2. **証明されていない多エージェント会話は、実際のコミュニケーション・アバランシェを引き起こす(合格率 `86.67%`、誤コミット率 `13.33%`)**。`Arm C`(`Planner -> Coder -> Reviewer -> Summarizer`)では、検証されていない自然言語の対話記録の受け渡しにより、平均プロンプト文脈がホップごとに `3.71x` に増幅された(ホップごとの入力トークンは `330.6 -> 600.0 -> 1,011.2 -> 1,225.1`、総トークンは `288,583`)。Category-3 のアルゴリズム課題 `20` 件のうち `8` 件(`C3_02`、`C3_03`、`C3_06`、`C3_11`、`C3_13`、`C3_15`、`C3_17`、`C3_18`)では、累積した会話上のコメントと適応的な推論が `Summarizer` の出力ウィンドウ `1,000` トークンを使い果たし、関数の途中で切断された Python ブロックが出力された。これらは検証されないままコミットされ、Category-3 の誤コミット率は `40.0%` に達した。単発呼び出しの `Arm B` でも、切断された誤コミットが `1` 件(`C3_05`)発生した。
3. **閾値ベースのエスカレーションと証明付きコミット制御(`Arm D`)は、安全性、コスト、`CpJ` のいずれにおいても優位である**。`Arm D` は、Category-1/2 の全 `40` 件において `llm_patch_proposer` をスリープ状態に保った($V_{\text{esc}} = 0 < \theta_{\text{esc}} = 1.0$)。これには `60` 本のトレース全体にわたる計 `322` 件の Rust 製 `BLAKE3` および `Ed25519` 台帳レシートを含め、`1.50 J` で済んでいる。`Claude Sonnet 5.5` は Category-3 の `20` 件に厳密に限定して起動され(計 `21` 回の呼び出し)、`C3_05` を修復して検証済み合格率 `59 / 60 = 98.33%` を達成した。また、`C3_17` では有界な提案 `2` 件がいずれも `diff_verifier_kernel` で不合格となった際に、明確に棄却した(誤コミット率 `0 / 60 = 0.00%`)。`Arm B` と比較すると、`Arm D` は LLM 呼び出しを `2.86x`、API の USD 費用を `1.63x`、ローカルのソケット消費ジュールを `2.09x` 削減した(`CpJ_pkg` は `0.136` 対 `0.065`)。証明されていない 4 エージェント連鎖(`Arm C`)と比較すると、`Arm D` は合格率を `+11.67` パーセンテージポイント向上させ、誤コミットを `8 / 8` 件すべて排除し、トークンを `10.14x`、API の USD 費用を `7.95x`、壁時計での遅延を `12.92x` 削減した。さらに、ローカルのソケットにおける Coherence per Joule は `14.97x` 向上した(`core_reported_j` では `15.98x`)。

<div id="worked-example-3-step-by-step-hardware-receipt-walk-through-on-cta-e2-task-c3_20-raft_append_entries" class="anchor-alias" aria-hidden="true"></div>

### 実証例3：`CTA-E2` タスク `C3_20`（`raft_append_entries`）におけるハードウェア受信記録のステップ・バイ・ステップ検証

未検証のマルチエージェント・チャット連鎖（`Arm C`）と、閾値化され暗号学的に認証されたオーケストレーション（`Arm D`）を、実ハードウェア（`13th Gen Intel Core i9-13900H`、Linux の RAPL に基づく `reported_j`、`board_metered = false`）上で対比するため、カテゴリー3のタスク `C3_20`（`raft_append_entries`、Raft の §5.3 に基づく接頭辞安全なログ衝突切り詰めの実装）について記録された実行受信記録を検証する。

1. **欠陥**: 不具合のある実装は、古く短い一致ハートビートの接頭辞 `[(1, 'b')]` が `prev_log_index = 1` で到着したとき、無条件に `out = out[:prev_log_index] + list(entries)` でスライスを行うため、既にコミット済みの接尾エントリ `(2, 'c')` を黙って削除してしまう。

2. **Arm A（`Det-Only` プール、安全なミリジュールによる棄権）**: 決定論的カーネルが `C3_20` を `1.34 ms`（`pkg_reported_j` で `19.59 mJ`、モデル呼び出し `0` 回）で解析・検査し、有界な AST/トークンテンプレート `16` 個のいずれも複数行ループの欠陥を修復しないことを検出する。その結果、コミットを明確に拒否する（`false_commit = false`）。

3. **Arm C（`Unattested-4-Agent` チャット、トランスクリプト・アバランシェ）**: 検証されていない自然言語の論評を `Planner -> Coder -> Reviewer -> Summarizer` の間で受け渡すと（`Claude Sonnet 5.5` への逐次呼び出し `4` 回）、`C3_20` では入力トークン数がほぼ3倍に膨張する（`581 -> 884 -> 1,642 -> 1,692` 入力トークン。合計 `4,799` 入力 + `2,213` 出力 = `7,012` トークン、`\$0.0476`、`pkg_reported_j` で `67.70 J`、壁時計時間 `17,659.76 ms`）。また、`60` タスクのスイート全体では `3.71x` に達する（平均入力トークン数 `330.6 -> 600.0 -> 1,011.2 -> 1,225.1`、合計 `5,710.77 J`）。さらに深刻なのは、カテゴリー3の類似タスク `8` 件（例えば `C3_18`、`502 -> 802 -> 1,343 -> 1,357` 入力トークン、`71.60 J`）において、会話的な冗長性が `Summarizer` の `1,000` トークンの出力窓を関数の途中で超過し、生の `SyntaxError` をコミットしてしまう点である（スイート全体の誤コミット率 `13.33%`）。

4. **アーム D（`CTA-Orchestrator`、認証済み `eventfd` エスカレーションおよびコミットゲート）**: 各エッジは `256` ビットの `BLAKE3` ダイジェストと `64` バイトの `Ed25519` 署名を検証する（マイクロベンチマークにおける `1 KiB` での `27.04 µs` の `p50`）。また、`trace_id = cta_e2_C3_20` の 6 件の不変レシートを `cta_e2_firing_ledger.jsonl` に記録する。
   - **ステップ `0`（`parse_kernel`）**: 入力 `7ae1414e…`（`sig = 993161b1…`）を `29.38 µs` で検証し、AST 診断 `9f868fad…` を `0.210 ms` で出力する。
   - **ステップ `1`（`static_type_scope_kernel`）**: `9f868fad…`（`sig = 48e2700c…`）を `25.93 µs` で検証し、字句・型スコープが clean であることを `0.336 ms` で確認して `3d82a573…` を得る。
   - **ステップ `2`（`test_gen_kernel`）**: `3d82a573…`（`sig = 6d264e0c…`）を `26.19 µs` で検証し、公開 doctest の不変条件 `92bf4238…` を `0.068 ms` で抽出する。
   - **ステップ `3`（`det_patch_kernel`）**: `92bf4238…`（`sig = 8b10b040…`）を `31.08 µs` で検証し、有界な AST 修復を `0.755 ms`（`18.62 mJ`）で試行する。その過程で、古い接頭辞の保持に関する doctest の失敗を検出し、Linux `eventfd` に `1` を書き込んで $V_{\text{esc}} = 1.0 \ge \theta_{\text{esc}} = 1.0$ とする。
   - **ステップ `4`（`llm_patch_proposer`）**: ゼロクロックのカーネル休止状態から起動し、**1 回の**構造化呼び出し（入力 `738` + 出力 `569` = `1,307` トークン、`\$0.0107`）を行う。エンベロープ `c2bfa1ba…`（`sig = b1d75063…`）を `50.12 µs` で検証し、インデックス走査による競合チェック `ad1fc058…`（`2,957.59 ms`、パッケージ報告値 `17.56 J` `pkg_reported_j`）を出力する。
   - **ステップ `5`（`diff_verifier_kernel`）**: `f138e9ca…`（`sig = 7ffe7c3f…`）を `59.48 µs` で検証し、隔離された doctest と繰り返し呼び出しによる状態漏洩チェックを `1.009 ms`（`14.16 mJ`）で実行して、`62ccce23…` をコミットする。エピソード合計は `17.65 J` であり、`C3_20` において `Arm C` と比較してソケットジュールが `3.84x` 低く、トークンが `5.36x` 少なく、`5.96x` 高速であった。ベンチマーク全体での誤コミットは **`0 / 60`** である。

<div id="55-cta-e3-byzantine-channel-injection-and-ssp-topology-failover" class="anchor-alias" aria-hidden="true"></div>

### 5.5 `CTA-E3`: ビザンチン型チャネル注入と `SSP` トポロジー・フェイルオーバー

`CTA-E3` は、200件の破損チャネルイベントを4つの50件ずつの故障クラスに分けて注入し、同時に200件の有効な制御エンベロープ（200 / 200件受理、`p50 = 27.51 µs`）を与えることで、チャネル整合性と動的グラフの生存性を検証する。続いて、14ノードからなる主系・待機系オーケストレーション・トポロジー上で、20回の途中ノード離脱（1〜4ノードの同時離脱、`Falsifier 5`）を実施する。

| 注入された故障クラス（各`50`件） | 有効なCTA防御層 | 棄却 `p50` / `p99`（`µs`） | CTA 破損コミット数 | 未認証チェーンの連鎖伝播数 |
| :--- | :--- | ---: | ---: | ---: |
| ペイロードのビット反転（`50`） | `BLAKE3` `256`-bit 定数時間ダイジェスト一致検査 | `0.19` / `0.23 µs` | **`0 / 50`（`0.0%`）** | `43 / 50`（`86.0%`） |
| 送信者IDの偽装（`50`） | `Ed25519`（RFC `8032`）厳格鍵リング検証 | `27.56` / `32.44 µs` | **`0 / 50`（`0.0%`）** | `50 / 50`（`100.0%`） |
| 切り詰められたJSON/ASTフレーム（`50`） | 型付きチャネルスキーマおよびフレームガード | `27.55` / `30.96 µs` | **`0 / 50`（`0.0%`）** | `26 / 50`（`52.0%`） |
| 意味論的回帰パッチ（`50`） | `diff_verifier_kernel` コミットゲート（`21.12 mJ`/ゲート） | `332.43` / `1,941.25 µs` | **`0 / 50`（`0.0%`）** | `50 / 50`（`100.0%`） |
| **合計（`200`件の破損イベント）** | **多層の暗号学的・振る舞い的ゲート** | ,  | **`0 / 200`（`0.00%`）** | **`169 / 200`（`84.50%`）** |

シアノバクテリアの `SepJ` ナノポアが、カルシウムストレス下で局所的に封鎖され、フィラメント全体の溶解を防ぐのと同様に、多層チャネル認証と振る舞いゲーティングは、注入された200 / 200件（`100.0%`）の故障を封じ込めた（破損コミット率 `0.00%` に対し、未認証の正規表現抽出型チェーンにおける下流伝播率は `84.50%`）。フロー需要 `D = 8` の下で、1〜4件の主系カーネル・提案者・検証者の同時故障を伴う途中ノード離脱シナリオ20件のすべてにおいて、厳密な `SSP` トポロジー再計算は、中央値 `2.40 µs`（平均 `2.41 µs`、`p99 = 3.58 µs`、`max = 3.58 µs`）で待機系パスへフローを再ルーティングし、トレースの欠落なしに20 / 20件（`100%`）のフロー需要を満たした。

<div id="56-communication-tool-avalanche-cta-experiment-cta-e4-five-host-cross-silicon-and-cross-kernel-fleet-energy-audit" class="anchor-alias" aria-hidden="true"></div>

### 5.6 コミュニケーションツール アバランシェ（`CTA`）実験 `CTA-E4`：5ホストによるクロスシリコンおよびクロスカーネルのフリートエネルギー監査

単一ホストによるベンチマークでは、ゼロクロックの閾値制御オーケストレーションおよび定数時間の暗号チャネル証明が、異種命令セットアーキテクチャおよびオペレーティングシステム（OS）カーネルをまたいでもミリジュール未満かつウェイクアップ非依存で維持されるかは未解決のままである。実験 `CTA-E4` は、実行前に256ビットセキュアハッシュアルゴリズム（`SHA-256`）による事前登録ダイジェスト `3efe68407530d203d7e8a6a1f13d9943713f763fe24034301f85e5330bb2a65b` のもとで固定されたうえで、統一されたクロスプラットフォームRustエンジン（`cta_fleet_rust`、`rustc 1.100.0`）を5つのハードウェアおよびカーネル対象にコンパイルする。対象は、基板レベルの直流（DC）シャントによる物理計測対象（`measured_j`、`board_metered = true`）と、4つのオンチップまたはドライバ由来のテレメトリ基盤（`reported_j`、`board_metered = false`）から構成される。これらは、全ボード入力（`(L1)`）、電源レールまたはソケット面（`(L2)`）、プロセス単位（`(L3)`）のテレメトリ範囲にわたって編成される。

1. **NVIDIA (加速計算システム) Jetson AGX (自律グレード計算) Thor (`aarch64` Tegra Linux `6.8`, 中央処理装置 (CPU) のみ実行)**: アクティブなグラフィックス処理装置 (GPU) 共同テナントロック (`CUDA_VISIBLE_DEVICES=""`, Compute Unified Device Architecture (CUDA) 無効) を尊重し, `cta_fleet_rust` は物理 Texas Instruments (TI) 分流抵抗器を `200 Hz` で `sysfs` `hwmon` 経由でサンプリングする: `INA238` (ボード全体分流モニタ) 電圧入力レール `VIN` `(L1)` (`l1_vin_ina238_measured_j`) および `INA3221` (3チャネルレールモニタ) チャネル2供給レール `VDD_CPU_SOC_MSS` (CPU, システムオンチップ (SoC), およびメモリサブシステム (MSS) 用の電圧ドレイン-ドレイン) `(L2)` (`l2_vdd_cpu_soc_mss_measured_j`, チャネル1 `VDD_GPU` から物理的に分離).
2. **`13th Gen Intel Core i9-13900H` (`20`スレッド Raptor Lake `x86_64` Linux `7.0`)**: ラップセーフ `powercap` Running Average Power Limit (RAPL) `intel-rapl:0` (`package-0`) および `intel-rapl:0:0` (`core`) `(L2)` `reported_j` を読み取る.
3. **Advanced Micro Devices (AMD) Ryzen Artificial Intelligence (AI) Max+ `395` (`32`スレッド Zen 5 Strix Halo + `Radeon 8060S` `x86_64` Linux `7.0`)**: `intel-rapl:0:0` (`core`), `intel-rapl:0` 加速処理装置 (APU) ソケット, および `amdgpu` Package Power Tracking (PPT) `(L2)` `reported_j` を読み取る.
4. **`Apple M3 Ultra` (`arm64` macOS Darwin X is Not Unix (XNU) `27.2.0` under `memguard`)**: `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (Resource Usage Information Version 6 (`RUSAGE_INFO_V6`)) `(L3)` プロセス識別子 (PID) ごとの `reported_j` を `kqueue` + Portable Operating System Interface (POSIX) `pipe` カーネルイベントブロッキングで読み取る.
5. **`Windows 11 Pro x86-64` Bare-Metal + GeForce Ray Tracing Texel eXtreme (RTX) `2060` (New Technology (NT) カーネル `10.0.26300`)**: `1,000 Hz` 高分解能待機可能タイマ (`CreateWaitableTimerExW`) に対するネイティブ Win32 `CreateEventW` / `WaitForSingleObject` ブロッキングを使用し, ルートレス NVIDIA Management Library (NVML) `nvml.dll` 累積ミリジュール `(L2)` `reported_j` を `QueryProcessCycleTime` `(L3)` CPUサイクルとともに記録する (ルートレス CPU RAPL は Windows NT カーネルによって公開されていない).

あらゆる測定は物理的分流 `measured_j` とカウンタベースの `reported_j` の厳格な分離を保持する; 異なる証拠クラスからの値は決して合計されない. 事前登録された `Falsifier 6` ごとに, 共有ホスト共同テナントがアクティブである場合 (`Jetson AGX Thor` GPU共同テナントが `VIN` 上で `~55 W`; `AMD Ryzen AI Max+ 395` `~120 W` APU共同テナント) または `5.0 s` 前後アイドルベースラインが `10.0%` を超えてドリフトする場合, 単一ウィンドウアイドル減算は控えられ, 生の未減算読み取りが優先され, 4つのインターリーブされた `5.0 s` ウィンドウにおける対内交互順序 (`poll_1000hz - event_threshold`) デルタで相殺される (`1%` バーストデューティ (`16`ノード有向非巡回グラフ (DAG))).

| フリートホストおよび OS イベントプリミティブ | `1 KiB` / `16 KiB` 検証 `p50` (`µs`) | 物理シャント `measured_j` / エッジあたり (`50k` イテレーション) | オンチップ／ドライバー `reported_j` / エッジあたり (`50k` イテレーション) | `16` ノード DAG ゼロクロック vs. `1,000 Hz` ポーリング (`5.0 s` × `4` 交互ペア, `1%` デューティ) | スレッドウェイクアップ (`Event` vs. `1 kHz`) | `p50` コミット (`ms`) |
| :--- | ---: | ---: | ---: | :--- | ---: | ---: |
| **NVIDIA Jetson AGX Thor** (`linux_eventfd`, CPU-only) | `50.13` / `62.24` | **`927.30` / `879.53 µJ`** (`VDD_CPU_SOC`); `3.89` / `4.22 mJ` (`VIN`) | `該当なし` (`board_metered = true`) | **`63.72 J` (`12.74 W`) vs. `65.07 J` (`13.01 W`)** `VDD_CPU_SOC` (`+1.34 J`/win; `VIN`: `344.02` vs. `350.71 J`, `+6.69 J`/win) | **`284.5` (`0` empty)** vs. `75,140.8` | **`5.28`** vs. `10.04` |
| **Intel Core i9-13900H** (`linux_eventfd`, `20t`) | `23.84` / `26.16` | `None` (`board_metered = false`) | **`642.38` / `700.36 µJ`** (`pkg`); `550.59` / `599.56 µJ` (`core`) | **`25.50 J` (`5.10 W`) vs. `82.00 J` (`16.40 W`)** `pkg` (**`3.22x`**; `core`: `6.27` vs. `62.52 J`, **`9.97x`**, `4/4` ペア `+`) | **`275.5` (`0` empty)** vs. `75,035.0` | **`2.45`** vs. `7.30` |
| **AMD Ryzen AI Max+ 395** (`linux_eventfd`, `32t`) | `33.12` / `31.83` | `None` (`board_metered = false`) | **`201.27` / `156.84 µJ`** (`core`); `4.76` / `3.78 mJ` (shared APU `pkg`) | プロセス CPU **`623.7 ms` vs. `1,040.8 ms`** (**`1.67x`** 削減; `120.0 W` shared APU 負荷がソケットレールをマスク) | **`279.8` (`0` empty)** vs. `75,587.2` | **`2.52`** vs. `7.39` |
| **Apple M3 Ultra** (`darwin_kqueue_pipe`) | `29.54` / `36.88` | `None` (`board_metered = false`) | **`90.81` / `108.66 µJ`** (`L3` `ri_energy_nj`) | **`0.0261 J` (`5.2 mW`) vs. `0.1624 J` (`32.5 mW`)** (**`6.22x`** `L3` プロセス削減, `4/4` ペア `+`) | **`274.8` (`0` empty)** vs. `54,132.2` | **`6.82`** vs. `13.29` |
| **Windows 11 Pro + RTX 2060** (`win32_event_wait`) | `30.50` / `30.90` | `None` (`board_metered = false`) | `255.62` / `259.76 µJ` (idle GPU `L2`); `93.2k` / `95.6k` CPU cyc | プロセス CPU **`89.84 ms` vs. `335.94 ms`** (**`3.74x`** 削減; idle GPU `L2` は `38.57` vs. `38.62 J` で安定) | **`268.2` (`0` empty)** vs. `54,414.0` | **`2.41`** vs. `10.35` |

<figure class="fig">
  <img src="/figures/communication-avalanche/five-host-fleet-energy-and-des10.svg" alt="CTA-E4の5ホスト・フリートのエネルギー監査(NVIDIA Jetson AGX Thorの INA3221/INA238 による measured_j を含む)と、CTA-E5の10の孤立したAIパラダイム陣営とDES-10 Digital Enzymatic Synthesisの比較を示す、ダークテーマの2パネル要約図">
  <figcaption><strong>図6.</strong> 厳密な証拠分離のもとでのフリート横断ハードウェア計測と10パラダイムのDigital Enzymatic Synthesis(<code>DES</code>、<code>DES-10</code>として実装)(事前登録 <code>SHA-256: 3efe6840…</code>)。<strong>左(<code>CTA-E4</code>)</strong>: 5ホストにおける、ゼロクロックのOSイベント閾値ウェイクアップと、<code>1%</code>デューティでの<code>1,000 Hz</code>のクロック駆動ポーリング(<code>5.0 s</code> × <code>4</code>回の交互カウンターバランス対)の比較、ならびに<code>50,000</code>回反復のRust <code>BLAKE3</code> + <code>Ed25519</code>検証コスト。計測値は、<code>NVIDIA Jetson AGX Thor</code>(CPUのみ)では物理的なTI <code>INA3221</code>/<code>INA238</code>シャントによる<code>measured_j</code>、<code>Intel Core i9-13900H</code>、<code>AMD Ryzen AI Max+ 395</code>、<code>Apple M3 Ultra</code>、<code>Windows 11 Pro</code> + <code>RTX 2060</code>では<code>reported_j</code>である。<strong>右(<code>CTA-E5</code>)</strong>: 10の単独AI陣営(<code>C1</code>-<code>C10</code>)と<code>DES-10</code>を対比した、<code>100</code>タスク、5種の体制別合格率、誤コミット率、分離された二重ホストのエネルギー、およびDigital Enzymeの活性化障壁の崩壊。</figcaption>
</figure>

全5種のシリコンアーキテクチャおよび3種のOSカーネル(Linux `eventfd`、macOS XNU `kqueue` + `pipe`、Windows NT `Event`)において、`BLAKE3`(`256`ビット)+`Ed25519`(`64`バイトの要求コメント(RFC) `8032`)検証は、中央値で`1 KiB`では`23.84-50.13 µs`、`16 KiB`では`26.16-62.24 µs`で完了する。その消費電力は隔離されたプロセッサレールにおいて`< 1 mJ`であり(`M3 Ultra` `L3`で`90.81 µJ`、`Zen 5` `core`で`201.27 µJ`、`i9-13900H` `pkg`で`642.38 µJ`、そして**`Jetson AGX Thor` `VDD_CPU_SOC_MSS`における物理シャント`measured_j`で`927.30 µJ`**)、全ホストにおいて毎エッジ`< 100 µs`かつ`< 5 mJ`という`Falsifier 2`を満たす。ゼロクロックの閾値ウェイクアップは、空ポーリングによるウェイクアップの`100%`を除去し(`5.0 s`ウィンドウあたり`0.0`回対`53,864-75,307`回)、5ホスト全体で中央値のコミット遅延を`1.90x`から`4.29x`に短縮する。さらに、`Jetson AGX Thor`では、共有ホストの同居ワークロードが存在する中で`1%`のバースト的デューティであっても、物理的な`INA3221` `VDD_CPU_SOC_MSS`の電力とエネルギーが計測可能に低下する(`13.01 W -> 12.74 W`、`5.0 s`ウィンドウあたり`VDD_CPU_SOC_MSS`で`+1.34 J`、`INA238` `VIN`で`+6.69 J`の節約)。`i9-13900H`ではソケットの`reported_j`が`3.22x`(コアでは`9.97x`)、`M3 Ultra`ではプロセス単位の`reported_j`が`6.22x`改善し、`Falsifier 1`を支持する。

<div id="57-cta-e5-ten-siloed-ai-paradigm-camps-versus-immediate-digital-enzymatic-synthesis-des-10" class="anchor-alias" aria-hidden="true"></div>

### 5.7 `CTA-E5`: 10の分断されたAIパラダイム陣営と即時的なデジタル酵素合成(`DES-10`)の比較

現代のAI研究は、依然として競合する単一機構の陣営に分断されている。すなわち、自己回帰型大規模言語モデル(LLM)の復号、記号的なブール充足可能性(SAT)および充足可能性モジュロ理論(SMT)/有限領域(FD)ソルバ、潜在エネルギーベースモデル(EBM)の適合度スコアラ、上側信頼限界1(`UCB1`)を用いるモンテカルロ木探索(MCTS)プランナ、エピソード型事例ストア、進化的抽象構文木(AST)変異器、構造的因果`do`計算エンジン、コンパイル済みルックアップテーブル(LUT)および有限状態機械(FSM)オートマトン、自然言語(NL)のマルチエージェント討論社会、そして身体性を持つブラックボックス・サンドボックス内の山登り法である。これらはいずれも、自らの局所的表現が汎用的なエージェンシーに十分であるとみなしている。生物進化においては、多細胞の複雑性が、ある一つの細胞型がすべての代謝機能を取り込むのを待つことによって実現したわけではない。分泌型シグナル分子、選択的ギャップ結合、そして触媒酵素が器官間の活性化障壁を引き下げたことで、異なる組織が即座に特殊化し、連携することが可能となった。

実験`CTA-E5`は、`CTA`オーケストレーションが、10のパラダイムすべてにわたる即時的な`DES-10`多器官合成を可能にするか否かを検証する。正準的な二進中間表現(IR)フレームを用いて、上流の陣営$a$から下流の陣営$b$へ橋渡しをするデジタル酵素を、以下の四つ組として定義する。

$$
\mathcal{E}_{a \to b} = \bigl(\Phi_{\mathrm{IR}},\, \mathrm{BLAKE3} + \mathrm{Ed25519},\, V_{\mathrm{gate}},\, \theta_b\bigr),
$$

ここで$\Phi_{\mathrm{IR}}$は、正準的でゼロコピーの二進IRフレーム(`DE10`ヘッダと型付きペイロードバイト列)を詰め込む。これにより、NL散文によるシリアライズと再解析を排除する。$\mathrm{BLAKE3} + \mathrm{Ed25519}$は、`cta_fleet_rust`を介して定数時間の暗号学的証明を提供する。$V_{\mathrm{gate}}$は、決定論的な構造的不変量および隔離されたサンドボックス不変量を強制する(保留テストオラクルへのアクセスは`0`、`Falsifier 3`)。$\theta_b$は、上流の信号が閾値を超えた場合にのみ器官$b$を起動する。その際、`cost_lut_10camp.json`の`15`個の保留校正プローブ(`100`個のテストタスクとの重複は`0`)で較正された、最短経路連続法(SSP)による最小費用流のスケジュールに従う。さらに、演繹的合成レジームおよびオープンワールド合成レジームから得られた検証済みの解は、正準的なデ・ブライン型エピソード事例ストア(`C5`)へ**オンラインで下方へ結晶化**される。

我々は、10 個のキャンプ (`C1`-`C10`) を Arm 11 (`DES-10`) に対して、凍結された `100` タスク決定的オラクルコーパス (`corpus_sha256 = 79b7f7512c3a5e18eb8a13ed5323d7803a9538decf665a213ced6abdf87eb8d2`, レジームあたり `20` タスク、ホストあたり `1,100` エピソード = `2,200` ハードウェア計測エピソード合計) で評価し、Generative Pre-trained Transformer Open-Source Series (`GPT-OSS-120B`, `temperature = 0.0`) をリモート API 呼び出しで利用し、`C1`、`C9`、`DES-10` のコストを米ドルで計上した。評価は **両方** の `Intel Core i9-13900H` (`RAPL` `reported_j`) と `NVIDIA Jetson AGX Thor` (`TI INA3221` `VDD_CPU_SOC_MSS` および `INA238` `VIN` 物理シャント `measured_j`, CPU のみ) 上で実行した。

- **`R1` (`20` タスク, Episodic Alpha-Renamed Zipfian Recurrence)**: 以前の 8 つの標準スキーマ (`16` タスク) を置換・アルファ名付けしたインスタンスと、新たに遭遇した `R3`/`R5` スキーマの 4 回の再帰を組み合わせ、オンライン結晶化をテストした。
- **`R2` (`20` タスク, Bitvector, Boolean Gate, and Protocol Framing)**: `6`-`10` ビットの多数決パリティ、コントローラエリアネットワーク ビットガード、`3` 状態 Mealy ヘッダー/フレーム終端 FSM、`LUT6` カスケード (`16` ワードビットパック出力) を含む。
- **`R3` (`20` タスク, Exact Deductive / Arithmetic / FD-SAT Constraints)**: `1..8` の範囲で `5` 変数のペアワイズ相違整数系を構成し、順序付け、重み付き線形ディオファント方程式、合同式、排他的 OR 条項を組み合わせ、唯一の証拠を要求した。
- **`R4` (`20` タスク, Structural Causal `do(X=x)` and Non-Myopic Horizon Planning)**: `10` 個のシンプソンの逆説で混乱した因果 DAG (`|P(Y=1|X=1) - P(Y=1|do(X=1))| >= 0.18`) と、`10` 個の `6` ステップ欺瞞谷マルコフ決定過程 (MDP) ツリーを含む。貪欲的な `t=0` 報酬は遅延 `-72` ペナルティを招くが、`-5` の橋料金を支払うことで `+85..+112` の山頂に到達できる。
- **`R5` (`20` タスク, Open-World Specification-to-Program Synthesis)**: NL 仕様と `2` 個の公開入出力例からスタンドアロン Python 3 コードを合成し、以下のタスクをカバーした: チャンク化ランレングスエンコーディング、エスケープ区切り文字のバランス調整、辞書的サイクル検出トポロジカルソート、正確な Farey 分数簡約、優先順位付きナップサック、一般化非互いに素な中国剰余定理 (CRT)、最少最近使用 (LRU) キャッシュシミュレーション、入れ子括弧復号、`k` 壁グリッド最短経路、ホーナーのモジュラー導関数、重み付き区間スケジューリング。スコアはコミット後に `10` 個の保持されたエッジケースおよび状態分離ベクトルで評価した。

| パラダイム アーム（`100` タスク · `GPT-OSS-120B` for `C1`/`C9`/`DES-10`） | 検証合格（`R1`/`R2`/`R3`/`R4`/`R5`） | 偽コミット | クラウド API 呼び出し / トークン（`USD`） | `i9-13900H` ローカル / エンドツーエンド `pkg_reported_j` | `i9-13900H` `CpJ_e2e`（`tasks/J`） | Jetson Thor ローカル / エンドツーエンド `VDD_CPU_SOC` **`measured_j`**（`VIN` **`measured_j`**） | Jetson Thor `CpJ_e2e`（`tasks/J`） |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| `C1` Autoregressive LLM Solo (`GPT-OSS-120B`) | **`48%`** (`17`/`1`/`1`/`11`/`18`) | `52%` | `100` / `67,146` (`\$0.0359`) | `0.110 J` / `3,637.81 J` | `0.0132` | `0.079 J` / `5,513.77 J` (`28,161.53 J`) | `0.0087` |
| `C2` Symbolic Constraint Solo (`FD/SAT`) | **`30%`** (`0`/`10`/`20`/`0`/`0`) | **`0%`** | `0` / `0` (`\$0.00`) | `0.087 J` / `0.09 J` | `346.6885` | `0.070 J` / `0.07 J` (`0.33 J`) | `429.5963` |
| `C3` Latent EBM Scorer Solo (Unverified) | **`0%`** (`0`/`0`/`0`/`0`/`0`) | `100%` | `0` / `0` (`\$0.00`) | `5.156 J` / `5.16 J` | `0.0000` | `3.991 J` / `3.99 J` (`17.61 J`) | `0.0000` |
| `C4` MCTS Rollout Search Solo (`UCB1`, `256`) | **`11%`**\* (`0`/`0`/`1`\*/`10`/`0`) | `19%`\* | `0` / `0` (`\$0.00`) | `0.785 J` / `0.78 J` | `14.0197` | `0.617 J` / `0.62 J` (`2.43 J`) | `16.2199` |
| `C5` Episodic Case Store Solo (`Shape D`) | **`16%`** (`16`/`0`/`0`/`0`/`0`) | **`0%`** | `0` / `0` (`\$0.00`) | `0.005 J` / `0.005 J` | `3,363.4644` | `0.003 J` / `0.003 J` (`0.012 J`) | `6,254.8866` |
| `C6` Evolutionary AST Mutator Solo (`300` evals) | **`4%`** (`0`/`0`/`0`/`0`/`4`) | `20%` | `0` / `0` (`\$0.00`) | `5.959 J` / `5.96 J` | `0.6713` | `4.936 J` / `4.94 J` (`22.13 J`) | `0.8104` |
| `C7` Causal Bayesian `do(X)` Engine Solo | **`10%`** (`0`/`0`/`0`/`10`/`0`) | **`0%`** | `0` / `0` (`\$0.00`) | `0.003 J` / `0.003 J` | `3,980.8917` | `0.002 J` / `0.002 J` (`0.007 J`) | `6,506.1809` |
| `C8` Sub-Symbolic `LUT6`/FSM Automaton Solo | **`20%`** (`0`/`20`/`0`/`0`/`0`) | **`0%`** | `0` / `0` (`\$0.00`) | `0.010 J` / `0.010 J` | `1,974.7235` | `0.009 J` / `0.009 J` (`0.041 J`) | `2,218.5247` |
| `C9` Multi-Agent NL Debate Solo (`3`-Agent) | **`49%`** (`19`/`1`/`0`/`12`/`17`) | `51%` | `300` / `253,968` (`\$0.1282`) | `0.116 J` / `10,913.22 J` | `0.0045` | `0.120 J` / `16,541.19 J` (`84,483.80 J`) | `0.0030` |
| `C10` Embodied Sandbox Perturb Solo (`200` probes) | **`4%`** (`0`/`0`/`0`/`0`/`4`) | `30%` | `0` / `0` (`\$0.00`) | `3.243 J` / `3.24 J` | `1.2334` | `3.045 J` / `3.05 J` (`13.39 J`) | `1.3135` |
| **`DES-10` (`Digital Enzymatic Composite`)** | **`98%` (`20`/`20`/`20`/`20`/`18`)** | **`1%`** | **`22` / `12,745` (`\$0.0067`)** | **`2.155 J` / `802.45 J`** | **`0.1221`** | **`2.760 J` / `1,215.77 J` (`6,208.87 J`)** | **`0.0806`** |

\*`Jetson AGX Thor`(`Python 3.12`)上では、`C4` が `10%` の合格率(`R3: 0/20`、`R4: 10/20`)と `20%` の誤コミットを示した。その他の `10` 個のアームは、両ホストにおいて同一のタスク判定を生成した。リモート応用プログラミングインターフェース(API)サーバーのジュールは `not_available` であり、明示的なトークン列および米ドル(USD)列を介して、ローカルの `reported_j` および `measured_j` から厳密に分離して保持している。

エンザイム的合成というテーゼは、以下の4つの定量的結果により裏付けられる(反証条件 `4` および `5`)。

1. **孤立した各パラダイムは、単独で用いると `49%` 以下の領域上限に到達する**: 決定論的専門家は、固有のニッチ領域内で `100%` の精度(誤コミット `0%`)と `1,975` から `6,506 tasks/J` のジュール当たりのコヒーレンス(CpJ)を達成する。具体的には、既知の `R1` の再出現に対する `C5`(`16/20`)、`R2` のブール/FSM ビットベクトルに対する `C8`(`20/20`)、`R3` の多節制約に対する `C2`(`20/20`)、`R4` のシンプソンのパラドックスにおける `do(X=1)` 介入に対する `C7`(`10/10`)である。しかしながら、これらはより広範なスイートの `70%` から `90%` を拒否する。逆に、単発の `C1`(`GPT-OSS-120B`)はオープンワールドの `R5` 合成タスク `18/20` を解くが、`R2`(`1/20`)および `R3`(`1/20`)においてビットパックされた整数や準最適な制約の見本を幻覚的に生成し、検証済み合格率 `48%`、誤コミット `52%` となる。検証なしの `C3` によるEBMスコアリングは、較正プローブで `6/15` であったが、サンプル外では交絡のある観察的アトラクタおよび貪欲な谷を選択することで `0/100`(誤コミット `100%`)へと崩壊する。さらに、近視眼的な `C10` サンドボックス山登り法は(合格率 `4%`)、`R4` の欺瞞的谷 `a_0 = 0` に捕捉されたままであり(`0/10`)、同様に失敗する。

2. **未検証の自然言語討論(`C9`)は、`+1%` の精度向上に対して、エネルギーおよびトークンを `3x`-`3.8x` 増加させる**: `Proposer -> Critic -> Judge` を通じた会話型の散文の受け渡し(`300` 回の LLM 呼び出し)は、ホップ間で平均プロンプト長を `2.21x` 膨張させる(入力トークン `328.3 -> 415.0 -> 726.8`、総トークン `253,968`)。また、エンドツーエンドのローカルエネルギーを `10,913.22 J`(`i9-13900H` の `reported_j`)および `16,541.19 J`(`Jetson Thor` の `VDD_CPU_SOC_MSS` の `measured_j`、`VIN` では `84,483.80 J`)へと引き上げる。それにもかかわらず、合格率は `48%` から `49%` へ向上したにすぎず、依然として `51%` の誤答を生じる(`R3` で `20/20` 誤答、`R2` で `19/20` 誤答)。

3. **デジタル酵素は、キャンプ間の受け渡しのエネルギーと遅延を `> 16,000x` から `> 155,000x` まで低減する (`Falsifier 5`)**: `Intel Core i9-13900H` 上 (`RAPL` の `reported_j`) では、`1 KiB` のプロセス内 Rust デジタル酵素検証は `23.00 µs` および `0.689 mJ` を要した (プロセス間の stdio 署名・検証パイプ経由では `44.43 µs` および `1.140 mJ`)。これに対し、ライブの `Camp 9` 自然言語 (NL) シリアライズおよび多段 LLM 再解析では `3,577.58 ms` および `36.38 J` を要した。これは、**`155,554x` の遅延の高速化 (パイプでは `80,522x`)** および **`52,815x` のソケット経由のエネルギー削減 (パイプでは `31,921x`)** に相当する。`NVIDIA Jetson AGX Thor` 上 (`INA3221` の `VDD_CPU_SOC_MSS` の `measured_j`) では、デジタル酵素による受け渡しは `49.95 µs` および `0.732 mJ` を計測した (`INA238` の `VIN` では `3.591 mJ`、stdio パイプ経由の `VDD_CPU_SOC_MSS` では `186.98 µs` および `3.406 mJ`)。対するライブの NL 受け渡しは `3,938.49 ms` および **`55.14 J` (`VDD_CPU_SOC_MSS` の `measured_j`、`INA238` の `VIN` の `measured_j` では `281.61 J`)** であった。これにより、**`78,855x` の遅延の高速化 (パイプでは `21,064x`)** および **`75,374x` の物理的 DC シャント測定によるエネルギー削減 (パイプでは `16,189x`)** が得られた。

4. **`DES-10` は10個の臓器を直ちに統合する (`98%` の合格、`1%` の偽コミット、`9.3x`-`27.1x` 高い CpJ)**: エポック `0` の `SSP` スケジュール (`i9-13900H` 上で `3.24 µs`、`Thor` 上で `14.20 µs`) に導かれ、かつ `225` 件の認証済み JavaScript Object Notation (JSON) / バイナリ `DE10` 酵素受領証を参照することで、`DES-10` は `R1`-`R4` (`80` タスク) を `C5`、`C8`、`C7`、`C2`、および `C4 + C2` へ振り分ける (`80 / 80 = 100%` の合格、`0` 件の偽コミット、`0` 回の LLM 呼び出し)。さらに、検証済みの `R3`/`R5` スキーマ `4` 件をオンラインで `C5` に結晶化させることで、`R1` の正答数を `16/20` (`C5` 単独) から `20/20` へ引き上げる。`R5` タスクのうち `3/20` は `C3 + C6 + C10` によりローカルで除外される (`0` 回の LLM 呼び出し)。残る `17` 件の `R5` 合成タスクに限って `C1` を起動する (合計 `22` 回の呼び出し、`12,745` トークン、`\$0.0067`)。`C1` 単独 (`48%`) および `C9` の NL 討議 (`49%`) と比較すると、`DES-10` (`98%`) は検証済み正答率を倍増させ、偽コミットを `51x`-`52x` 削減し、トークンを `5.27x` (`C1` 比) および `19.93x` (`C9` 比) 削減する。エンドツーエンドのジュール当たりのコヒーレンスは、`C1` に対して **`9.25x` (`i9-13900H` の `reported_j`) / `9.26x` (`Thor` の `measured_j`)** 、`C9` に対して **`27.13x` (`i9-13900H` の `reported_j`) / `26.87x` (`Thor` の `measured_j`)** だけ向上する。

---

<div id="6-resolving-the-10-siloed-ai-camps-via-digital-enzymatic-engineering--the-testable-forcing-function-blueprint" class="anchor-alias" aria-hidden="true"></div>

## 6. 10のサイロ化されたAI陣営をデジタル酵素工学および試験可能な強制関数青写真により解決する

<div id="61-atlas-of-the-10-siloed-ai-camps-c1-to-c10-and-the-refutation-of-monocultures" class="anchor-alias" aria-hidden="true"></div>

### 6.1 10 の分離 AI キャンプ（`C1` から `C10`）のアトラスとモノカルチャーの反証

七十六年にわたる AI 研究（`AI01` から `AI38`）は、10 の異なる計算パラダイム（`C1` から `C10`）を生み出した。各パラダイムは知能の一要素を最適化するが、固有のニッチ外では盲目または熱力学的に浪費的である（`Figure 7` 左パネル）：

<figure class="my-8">
  <img src="/figures/communication-avalanche/ten-siloed-ai-camps-map.svg" alt="左パネルは C1 から C10 までの 10 つの分離 AI キャンプをすべて示し、各キャンプの固有スーパーパワーと単独失敗モードを示す。右パネルは DES-10 デジタル酵素合成が 10 すべてのキャンプを閾値付き最小コストカスケードに配線し、下向き結晶化を実現する様子を示す。" />
  <figcaption><strong>Figure 7.</strong> 10 の分離人工知能キャンプ（<code>C1</code> から <code>C10</code>）とデジタル酵素合成（<code>DES-10</code>）のアトラス。すべての孤立したモノカルチャーはその構造的レジーム外で失敗する。サブミリジュール級のデジタル酵素は 10 すべてを閾値付き逐次最短路（<code>SSP</code>）最小コストフローカスケードに結線し、下向きスキル結晶化（<code>CTA-T32</code> から <code>CTA-T45</code>）を実現する。</figcaption>
</figure>

| 陣営ID・パラダイム | 歴史的起源（`AI01`-`AI38`） | 固有のニッチ能力（`+`） | 単独のモノカルチャー失敗モード（`-`） | 典型的な単独エネルギー包絡 | `DES-10`生命体における役割 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`C1` · 自己回帰型`LLM`** | `AI01`, `AI24`-`AI26`, `AI28` | 広範な自然言語の意図解析と、オープンエンドなコード・仮説合成 | `~15+ J/call`、シンプソン交絡、および外部ゲートなしでの$f^k$幻覚ドリフト | `~10` から `50+ J` / クエリ | **第3層オープンワールド提案器**（決定論的な`V_u >= theta_u`の未検出時にのみ厳密に起動） |
| **`C2` · 演繹的記号・`SMT`・`Lean`** | `AI03`, `AI06`, `AI08`, `AI32`, `AI37` | 健全な機械検証済み証明と`0.00%`の偽コミット形式保証 | 単独では生の曖昧な散文を取り込めず、オープンワールドの知覚的事前分布を生成できない | `0.4` から `49 mJ` / チェック | **第2層決定論的カーネルおよび終端健全性ゲート**（`RCE`、`Lean 4`、`AST`） |
| **`C3` · 潜在`JEPA` / `FormEBM`** | `AI11`, `AI16`, `AI29`, `AI37` | 高速なミリジュール級の連続的妥当性ランキング（未知の`Forms`に対する`0.8922`の`AUROC`） | 連続エネルギー極小だけでは、離散的な端点の厳密な正しさを保証できない | `~5` から `47.09 mJ` / ランク付け | **第3層事前フィルタゲート**（チェッカーやロールアウトの前に`2.39x`の無効候補を剪定） |
| **`C4` · `RL` / `MCTS`木探索** | `AI14`, `AI18`, `AI20`, `AI23`, `AI34` | 貪欲な局所的罠を脱する非近視眼的な多段階逐次先読み | 高速な学習済み価値/エネルギー事前分布なしでは、高分散のロールアウトにメガジュールを浪費する | `1` から `10^3+ J` / エピソード | **第3層逐次プランナ**（`C3`の`FormEBM`事前分布と`C2`の終端規則により誘導） |
| **`C5` · エピソード型`RAG` / `Shape D`** | `AI02`, `AI20`, `AI26`, `AI35` | サブマイクロ秒の$O(1)$、`1.77 µJ`のメモリマップ型検証済み想起（`DNULLMM1`） | コサイン型`RAG`は無効な近傍を検索し、厳密な`Shape D`は新規構造を取りこぼす | `1.77 µJ`（`mmap`）から`~50 mJ`まで | **第1層凍結済み検証済み事例ストア**（反復的なZipf頭部を`FLOPs`ゼロで吸収） |
| **`C6` · 進化的コード探索** | `AI05`, `AI31`（`FunSearch`） | 集団の多様性により、コード変異を通じて勾配・プロンプトの局所最適を脱する | サブミリ秒の適応度事前スクリーニングがないと、数千回のサンプラ呼び出しを浪費する | `10` から `10^3 J` / 島 | **第3層組合せ探索器**（勝ち残ったプログラムを`C2`/`C5`へ下方向に結晶化） |
| **`C7` · 因果的do計算・`DAGs`** | `AI13`（Pearl `DAGs`）、`AI24`（`MPNN`） | 厳密な介入確率$P(Y \mid \mathrm{do}(X))$による交絡除去とバックドア調整 | 型付き因果グラフスキーマを要求し、単独では生テキストから変数を抽出できない | `0.5` から `10 mJ` / クエリ | **第2層因果・グラフカーネル**（方策確定の前に疑似相関を排除） |
| **`C8` · サブシンボリック・`SSM` / `LUT6`** | `AI04`, `AI15`, `AI17`, `AI22`, `AI36` | 単一サイクル`4 ns`の組合せ型`LUT6`（`81 × RAMB36E2`、`~12 pJ` `est_j`、`0` `FLOPs`） | ページごとに有界なブール入力幅に限られ、単独では新規の多段階アルゴリズムを合成できない | `~12 pJ` `est_j`（`FPGA`） | **第0層物理反射床**（結晶化されたホットパス述語を`1`サイクルで実行） |
| **`C9` · 多エージェント`NL`討論** | `AI09`, `AI10`, `AI28`, `AI30`, `AI33` | 専門化された役割にわたり、多視点の多様な候補分解を生成 | 検証されていない散文の中継は、`3.71x`のプロンプト肥大と`13.33%`の偽コミット（`CTA-E2`）を被る | `~95` から `110+ J` / タスク | **輸送手段としては置換**。並列的に検証済みの`Phi_IR`提案器としてのみ厳密に保持 |
| **`C10` · 身体化サンドボックス・制御** | `AI02`, `AI27`, `AI28`, `AI31`, `AI38` | 実物理・実行フィードバックに基づく接地と、反復呼び出しによる状態漏洩の反証 | 上流の型・ハッシュゲートなしで未スクリーニングの生提案を実行すると、危険または低速になる | `1.12` から `25 mJ` / オラクル | **終端行動オラクル**（`0`状態漏洩コミットを強制する`diff_verifier_kernel`） |

<div id="62-formal-theory-of-digital-enzymes-and-10-camp-pareto-dominance-cta-t32-to-cta-t40" class="anchor-alias" aria-hidden="true"></div>

### 6.2 デジタル酵素の形式理論と10陣営パレート支配 (`CTA-T32` から `CTA-T40`)

生化学において、互換性のない化学中間体にわたる代謝経路は、**酵素**が基質を精密な遷移状態幾何学に結合し、活性化エネルギー $E^\ddagger$ を桁違いに低下させ、立体化学的特異性を強制し、反応を**完全に未消費のまま**退出するまで、動力学的に凍結されたままである。現代のマルチエージェント AI は、触媒化されていない熱反応の正確なデジタル類似物を被っている。パラダイム陣営 $a$ から陣営 $b$ への自由形式自然言語散文（`Camp C9`、`Arm C` in `CTA-E2`）による橋渡しは、再試行倍増された直列化/構文解析エネルギー $k_{\text{retry}} \cdot c_{\text{nl}}$（`~15` to `110 J`）、`3.71x` コンテキスト膨張、およびホップごとの意味ドリフト $\epsilon > 0$（`CTA-T1`）を招く。

モジュール `Avalanche/EnzymaticSynthesis.lean`（`[T]`）は、ソース陣営状態 $\mathcal{S}_a$ と受信陣営状態 $\mathcal{S}_b$ の間の**デジタル酵素** $\mathcal{E}_{a \to b} = (\Phi_{\text{IR}},\, \mathrm{attest\_ok},\, V_{\text{det}},\, \mathrm{decode},\, c_{\text{enz}})$ を定義する。

1. **正準基質エンコーダ ($\Phi_{\text{IR}} : \mathcal{S}_a \to \mathcal{I}_{ab}$)**: 陣営 $a$ の内部状態を、最小のスキーマ型中間表現（`AST` パッチ差分、`RCE` 正準 `Form`、`DAG` バックドアタプル、または `DNULLMM1` キー）に投影し、会話的注釈を除去する（`3.71x -> 1.00x`）。
2. **定数時間認証 + 決定性ゲート ($\mathrm{attest\_ok} \wedge V_{\text{det}} : \mathcal{I}_{ab} \to \{0,1\}$)**: `256` ビット `BLAKE3` 完全性、`64` バイト `Ed25519` 送信者認証、および決定性構造許容性を、総オーバーヘッド $c_{\text{enz}} < 1\text{ mJ}$（`CTA-E1` における `643-926 µJ`）で検証する。
3. **触媒状態不変性および逐次合成 (`CTA-T32` to `CTA-T35`)**: $M \ge 1$ の任意の反応系列（`runEnzymaticChain`）にわたって、酵素インスタンスは構造的に不変（$\mathcal{E}' = \mathcal{E}$、ゼロ重量変異）を返し、$c_{\text{enz}} < c_{\text{nl}}$ である限りハンドオフごとの活性化エネルギーを $\Delta E^\ddagger = k_{\text{retry}} c_{\text{nl}} - c_{\text{enz}} > 0$ だけ低下させ（`CTA-T32`）、$M$ 個のハンドオフにわたって $M \cdot \Delta E^\ddagger$ ジュールを線形に節約し（`CTA-T33`）、$M\epsilon > 0$ の非触媒散文ドリフトに比べて**ゼロ**の未検証意味ドリフトを伝播し（`CTA-T34`）、加法的な節約 $\Delta E^\ddagger_1 + \Delta E^\ddagger_2$ をもって多器官鎖 $\mathcal{E}_2 \circ \mathcal{E}_1$ に結合的に合成する（`CTA-T35`）。

$< 1\text{ mJ}$ のデジタル酵素を $K \ge 2$ のパラダイム陣営（$K = \mathrm{TenCamps} = 10$ でインスタンス化）および $R \ge 1$ のタスク体制にわたって装備し、検証済み合格指標 $p(k, r) \in \{0, 1\}$ および実行ジュール $c(k, r) > 0$ を有する場合、実行可能な**酵素的ニッチルータ**（`selectNicheCamp`）は次を選択する。

$$k^*(r) \in \arg\min_{k \in \{1,\dots,K\}} \bigl\{\, c(k, r) \;\big|\; p(k, r) = 1 \,\bigr\}, \qquad E_{\text{DES}}(r) = c\!\left(k^*(r),\, r\right) + c_{\text{enz}}.$$

5つのカーネル検証済み定理は、**デジタル酵素合成 (`DES-10`)** があらゆるサイロ化されたAIモノカルチャーを厳密に支配する理由を確立する (`[T]`)。

- **カバレッジ和集合 (`CTA-T36`)**: 任意のレジーム $r$ と単独陣営 $k_0$ について、$\mathrm{Pass}_{\text{DES}}(r) = \bigvee_{k=1}^K p(k, r) \ge p(k_0, r)$ が成り立ち、$p(k_0, r) = 1$ である限り $c(k^*(r), r) \le c(k_0, r)$ となる。
- **厳密なグローバル合格優位性、モノカルチャーの反証 (`CTA-T37`)**: すべてのレジーム $r \in \{1,\dots,R\}$ が少なくとも1つの専門陣営によって解かれ、かつ全 $R$ レジームを解く単独陣営が存在しない場合 ($\forall k,\, \exists r,\, p(k, r) = 0$)、`DES-10` は全体カバレッジ $R$ を達成し、あらゆる単独陣営を厳密に上回る: $\sum_r p(k_0, r) < \sum_r \mathrm{Pass}_{\text{DES}}(r) = R$。
- **厳密な総ジュールおよび `CpJ` 優位性 (`CTA-T38`, `CTA-T39`)**: 全 $R$ レジームを解く理想化された汎用陣営 $k_{\text{univ}}$ (構文、スコープ、因果、証明のすべてのタスクで呼び出されるフロンティアモデルなど) に対しても、ニッチ領域での累積節約量がルーティングのオーバーヘッドを上回る場合には、`DES-10` が消費する総ジュールは厳密に少なく ($E_{\text{DES}} < E_{\text{solo}}$)、ジュール当たりのコヒーレンスは厳密に高くなる ($\mathrm{CpJ}_{\text{DES}} > \mathrm{CpJ}_{\text{solo}}$):
  $$\sum_{r=1}^{R} \bigl(c(k_{\text{univ}}, r) - c(k^*(r), r)\bigr) > R \cdot c_{\text{enz}}.$$
  `CTA-E2` (`60` タスク) では、`c_enz < 1 mJ` であるのに対し、`40` 件のカテゴリ1/2タスクにわたって $c(k_{\text{univ}}, r) - c(k^*(r), r) \approx 15\text{ J}$ であり、`CTA-T38` の閾値を `> 10,000x` 上回る。
- **待機ゼロの1パス較正 (`CTA-T40`)**: $k^*(r)$ の同定には**勾配学習のエポックが一切不要**であり、$K \cdot m$ 回 ($m \ge 1$) のプローブによる決定論的な1回のプロファイリングパスで `cost_lut.json` が構築され、$k^*(r)$ が直ちに構成的に証明される。

<div id="worked-example-4-ten-camp-digital-enzymatic-synthesis-des-10-on-a-confounded-causal--exact-integer--code-generation-task" class="anchor-alias" aria-hidden="true"></div>

### 実例4：交絡因果・厳密整数・コード生成を伴う10陣営デジタル酵素合成（`DES-10`）

本節では、3つの異なる推論様式を結合した複合的な運用トリアージ問い合わせを考える。(a) 業務負荷の重大度 $Z \in \{\text{Light}, \text{Heavy}\}$ にわたって交絡している自然言語インシデントログ（各 `50%` の基底有病率）、(b) 厳密な有理数による介入推定 $P(Y=1 \mid \mathrm{do}(X=x))$、(c) Python整数による割当枠配分 `allocate_quota(budget_units: int) -> tuple[int, int]` である。

- **観測された層別度数（総計 `800` エピソード）**:
  - $Z = \text{Light}$ の下では、`Policy X=1` は `81 / 90`（`90.00%`）で成功し、`Policy X=0` は `266 / 310`（`85.81%`）で成功する。
  - $Z = \text{Heavy}$ の下では、`Policy X=1` は `192 / 310`（`61.94%`）で成功し、`Policy X=0` は `50 / 90`（`55.56%`）で成功する。
  - **交絡した併合の罠**：オペレーターが `X=1` の実行の `310 / 400`（`77.5%`）を `Heavy` インシデントに振り向けたため、調整を行わない単純な条件付けは真の効果を反転させる：$P(Y=1 \mid X=1) = 273 / 400 = 68.25\% < P(Y=1 \mid X=0) = 316 / 400 = 79.00\%$（Simpsonのパラドックス）。

1. **孤立型AIキャンプが単独で失敗する理由**:
   - **`Camp 1` (自己回帰型`LLM`単独、`~15.0 J`)**: プールされた経験率`79.00% > 68.25%`を比較するか浮動小数点中間値を一貫性なく丸め、劣った`Policy X=0` (`-5.29`パーセントポイントの真の介入損失)を推奨する。
   - **`Camp 2` (演繹的記号体系/充足可能性モジュロ理論(`SMT`)単独)**: 事前形式化された`DAG`と正確な有理制約を必要とし、入力解析時に生の散文インシデントログを拒否する。
   - **`Camp 5` (エピソード的検索拡張生成(`RAG`)/バイナリメモリマップストア(`DNULLMM1`)単独、`1.77 µJ`)**: 未観測の`(Z -> X, Z -> Y, X -> Y)`変数スキーマ上で正準構造ハッシュを計算し、ルックアップ`miss`を観測して棄権する。
2. **`< 1 mJ`デジタル酵素による`DES-10`の複合タスク解決方法**:
   - **ステップ`1` (`C5`プローブ -> `C1`スキーマパーサ)**: `DNULLMM1`ルックアップ(`1.77 µJ`)が`miss`を返し、制約付き`C1`文法パーサ(`parse_kernel` + スキーマ抽出器)の`eventfd`ウェイクアップをトリガし、散文解説なしで正準中間表現(`IR`) $\Phi_{\text{IR}} = (\text{DAG}: \{Z \to X, Z \to Y, X \to Y\},\; \text{table}: ((81,90),(266,310),(192,310),(50,90)))$ を出力する。
   - **ステップ`2` (デジタル酵素$\mathcal{E}_{1 \to 7}$: `643 µJ`, `26.0 µs`)**: `BLAKE3` + `Ed25519`署名を検証し、`DAG`の非巡回性を確認し、正確な行和保存(`400 + 400 = 800`)を保証する。
   - **ステップ`3` (`C7` Do-Calculusバックドアカーネル: `0.64 mJ`)**: $\{Z\}$を$X \leftarrow Z \to Y$をブロックする有効なバックドア調整集合として特定し、正確な有理介入成功を評価する:
     $$P(Y=1 \mid \mathrm{do}(X=1)) = \frac{1}{2}\!\left(\frac{81}{90} + \frac{192}{310}\right) = \frac{471}{620} \approx 75.97\%, \qquad P(Y=1 \mid \mathrm{do}(X=0)) = \frac{1}{2}\!\left(\frac{266}{310} + \frac{50}{90}\right) = \frac{986}{1{,}395} \approx 70.68\%,$$
     厳密に`X=1`を支持する正確な正の因果リフト$\Delta_{\text{do}} = \frac{471}{620} - \frac{986}{1{,}395} = +\frac{295}{5{,}580} \approx +5.29\%$を生む。
   - **ステップ`4` (デジタル酵素$\mathcal{E}_{7 \to 2}$ + `C2`正確証人 + `C10`サンドボックスゲート: `18.15 mJ`)**: $\mathcal{E}_{7 \to 2}$ (`651 µJ`)が`(x_opt = 1, lift = 295/5580)`を`C2`決定性コード合成(`15.73 mJ`)に渡し、整数保存の`allocate_quota`を出力する。これは`C10` `diff_verifier_kernel` (`1.12 mJ`, `0`状態漏洩; 総ローカルカーネル + 酵素パイプライン = **`19.44 mJ`**, `< 50 mJ`)により`8`個の境界予算(`0, 1, 7, 100, ...`)で検証される。
   - **ステップ`5` (`C5`への下方結晶化)**: 検証済み正準マッピングが`DNULLMM1`に結晶化するため、この交絡されたトリアージスキーマの将来の到着はすべて **`1.77 µJ`** (`0`パーサまたはソルバ呼び出し)で解決する。

<div id="63-the-5-loop-testable-forcing-function-blueprint-and-4-tier-downward-crystallization-cta-t41-to-cta-t45" class="anchor-alias" aria-hidden="true"></div>

### 6.3 5ループ検証可能強制関数青写真および4階層下方結晶化（`CTA-T41`から`CTA-T45`）

10陣営にわたる静的ルーティングは即時的な単一タスク節約（`CTA-T38`）を捕捉するが、生物学的および文化的進化は**閉ループ下方強制関数**を通じて複合指数的利得を達成する：高エネルギー探索的解は一度検証され、漸進的に低エネルギー決定論的基質へとコンパイルされる（`Figure 8`）。4つの実行階層が厳密に順序付けられた到着当たりエネルギー$c_3 > c_2 > c_1 > c_0 > 0$を担うものとする（`EnzymaticSynthesis.lean`における`FourTierCosts`）：
- **階層3（`c_3 ~ 10-50+ J`・フロンティア合成および探索）**：陣営`C1`、`C4`、および`C6`（`LLMs`、`MCTS`、進化コード島）が`C3`（`FormEBM`、`47.09 mJ`）により事前スクリーニングされる。
- **階層2（`c_2 ~ 0.4-49 mJ`・検証済み記号および因果規則）**：陣営`C2`および`C7`（`AST`/`SMT`修復カーネル、`RCE`正準チェッカー、`DAG`バックドア調整）。
- **階層1（`c_1 ~ 1.77 µJ`・凍結されたエピソード事例ストア）**：陣営`C5`（`Shape D` `DNULLMM1`ゼロコピー`POSIX mmap`ハッシュテーブル）。
- **階層0（`c_0 ~ 12 pJ` `est_j`・単一サイクルハードウェアオートマトン）**：陣営`C8`（`81 × RAMB36E2` Benešルーティング`LUT6`ページ（`xck26`上）、`0` `DSP48E2`スライス）。

<figure class="my-8">
  <img src="/figures/communication-avalanche/digital-enzymatic-forcing-function.svg" alt="左パネルは計算活性化障壁をlog10ジュールで~110 Jの未検証チャットから&lt;1 mJのデジタル酵素ゲートおよび1.77 uJの結晶化事例井戸までプロットし、右パネルは5ループ閉ループ強制関数青写真を詳細に示す。" />
  <figcaption><strong>図 8.</strong> 計算反応座標障壁低減（<strong>左</strong>、`CTA-T32`から`CTA-T35`）および5ループ閉ループ下方強制関数青写真（<strong>右</strong>`CTA-T41`から`CTA-T45`）であり、これが反復ワークロードを<code>~15 J</code>の階層3合成から<code>1.77 µJ</code>のエピソード想起および<code>~12 pJ</code> <code>est_j</code>単一サイクル<code>LUT6</code>反射へと駆動する。</figcaption>
</figure>

**5ループ検証可能強制関数青写真**は10陣営すべてを自己締め付け熱力学的ラチェットへと配線する：

1. **`Loop 1`、ユニバーサル認証エンベロープ（`Phi_IR` + `BLAKE3` + `Ed25519`）**：すべてのキャンプ間エッジは自由形式の会話テキストを、`256`ビット `BLAKE3` ダイジェストと `64`バイト `Ed25519` 署名を搭載した正規化 `Phi_IR` ペイロードに置き換える（`25.95-37.39 µs`、`643-926 µJ`、`CTA-E3`、`CTA-T16`-`CTA-T18` における `0 / 200` ビザンチン脱出）。

2. **`Loop 2`、ワンパス較正および `SSP` ニッチルーター**：単一 `K * m` プロファイリングパス（`CTA-T40`）が `cost_lut.json` を生成する（`RAPL` `reported_j` またはインラインシャント `measured_j`）。ベルマン-フォードノードポテンシャルとジョンソン低減コストダイクストラ（`SSP`）により、正確な最小コストフロー経路を `2.11 µs`（ノード脱落フォールオーバ時は `2.40 µs`、`CTA-T24`-`CTA-T28`）で計算する。

3. **`Loop 3`、検証者ゲート付き新規性エスカレーション（`eventfd` + `FormEBM`）**：下流 Tier-3 ノードは OS カーネル内で `eventfd` を介し CPU サイクルを消費せずにブロックし、膜電位 $V_u < \theta_u$（`CTA-T7`-`CTA-T10`）で待機する。決定的 Tier-0/1/2 が $\theta_u = 1.0$ を跨ぐときのみ、`Camp C3`（`FormEBM`、`47.09 mJ`）が候補 `Forms`（`0.8922` `AUROC`）を順位付けし、下流チェッカー/ロールアウト呼び出しを `2.39x` 削減してから `C1`/`C4`/`C6` を起床させる。

4. **`Loop 4`、自動下方向結晶化（`C1/C4/C6 -> C5 -> C2 -> C8`）**：すべての新規候補はターミナル健全性＋サンドボックス再呼び出しゲート（`C2` + `C10`、`0 / 60` 偽コミット）を通過しなければならない。検証された構造的証拠が閾値 $\tau_j$ 到着ごとに再現されると、`promoteVerifiedTier` が下方向にコンパイルする（`Tier 3 -> Tier 2` ルール抽出、`Tier 2 -> Tier 1` `DNULLMM1` スロット凍結、`Tier 1 -> Tier 0` 同値チェック済み `LUT6` 真理表ページ）一回限りのコンパイルコスト $E_{\text{comp}, j}$ で、すべての四層にわたる意味的健全性を保持する（`CTA-T44`、**ゼロ公理**で証明）。

5. **`Loop 5`、ハードウェアレール/カウンタジュール元帳およびヒットレート自動プルーニング**：すべての発火はハッシュ連鎖されたジュール受領書（`pkg_reported_j`、`core_reported_j`、`psys_reported_j`、および付随するインライン `INA238`/`INA260` `measured_j`）を付加し、スライディングウィンドウ $N$ 上で各コンパイル済みスキルを監査する。**Theorem `CTA-T45`（`downward_compilation_falsifier_hit_rate_iff`）** によれば、下方向にコンパイルされたスキルが $H$ ヒットを $N$ 到着で得たとき、その経験的ヒットレート $h = H / N$ が正確な偽造者下限を超える場合にのみ償還が成立する：
$$h > h_{\min} = \frac{E_{\text{comp}}}{N \cdot (c_{\text{high}} - c_{\text{low}})}, \qquad \text{and fails to pay back iff } h \le h_{\min}.$$
$h \le h_{\min}$ であるすべてのコンパイル済みルールは自動的に `cost_lut.json` から除外され、分布シフト下でのキャッシュ膨張を防止する。一方、存続するスキルはタスクエネルギーを $c_3$ から $c_0$ へ単調に減少させる（`CTA-T41`、`CTA-T42`）。

<div id="worked-example-5-closed-loop-forcing-function--exact-1000-arrival-zipfian-downward-crystallization-trajectory-cta-t23-cta-t41-cta-t45" class="anchor-alias" aria-hidden="true"></div>

### 作業例5：閉ループ強制関数における、正確な`1,000`件到着ジップ分布下の下向き結晶化軌跡（`CTA-T23`、`CTA-T41`、`CTA-T45`）

本例では、歪んだジップ分布のワークロード下で、`K = 22`個の構造的同値類に分布する`M = 1,000`件の逐次タスク到着を追跡する。内訳は、高頻度の有限定義域類`4`個が`260, 115, 80, 65`件の到着を受けて合計`520`件となり、中頻度の類`18`個が合計`480`件の到着を受け、各類は$\ge 8$回観測されるというものである。

1. **実行階層4段と呼び出し当たりのエネルギー**：
   - **階層`3`（フロンティア`LLM`へのエスカレーション）**：$c_3 = 15.000\;\text{J/task}$（`CTA-E2`の`Arm B`において、検証済みタスク当たり`15.30 J` `pkg_reported_j`と測定された）。
   - **階層`2`（合成された記号的/AST規則）**：$c_2 = 0.0150\;\text{J/task}$（`15.0 mJ`であり、`det_patch_kernel`の`15.73 mJ`と整合する）に、`< 0.7 mJ`のチャネル証明を加えた`0.0157 J`。
   - **階層`1`（同一機関の`DNULLMM1`バイナリメモリマップド事例ストア）**：$c_1 = 1.77 \times 10^{-6}\;\text{J/task}$（`1.77 µJ`のmmapプローブ値であり、プロセス間`Ed25519`エンベロープを含む場合は`644.8 µJ`）。
   - **階層`0`（`xck26`の36 Kbitブロックram（`RAMB36E2`）ページング型`LUT6`回路、同一機関）**：$c_0 = 1.2 \times 10^{-11}\;\text{J/task}$（単一サイクル`4.0 ns`評価に対する解析的`est_j`の`~12 pJ`であり、`board_metered = false`）。

2. **正確な損益分岐償却ステップ（$N^*$、`CTA-T23` / `CTA-T41`）**：
   - 検証済みの階層`3`の解を再利用可能な階層`2`の規則へ蒸留するコストは$E_{\text{synth},3\to 2} = 0.450\;\text{J}$であり、損益分岐反復回数は次のとおりである。
     $$N^*_{3\to 2} = \left\lceil \frac{E_{\text{synth},3\to 2}}{c_3 - c_2} \right\rceil = \left\lceil \frac{0.450}{15.000 - 0.015} \right\rceil = \lceil 0.03003 \rceil = \mathbf{1\;\text{repeat arrival}},$$
     当該クラスの次の出現時点で、合成コスト全体が回収される。
   - `3`回検証された階層`2`の規則を`DNULLMM1`の階層`1`スロットへ固定するコストは$E_{\text{synth},2\to 1} = 0.045\;\text{J}$であり、$N^*_{2\to 1} = \lceil 0.045 / (0.015 - 0.00000177) \rceil = \mathbf{4\;\text{subsequent hits}}$で損益分岐に達する。
   - 高頻度の有限定義域類`4`個のそれぞれ（累積`50`ヒット後）を常駐`LUT6`ページへコンパイルするコストは$E_{\text{synth},1\to 0} = 0.250\;\text{J}$であり、`4`類の合計では`1.000 J`となる。

- **累積 `1,000` 到着のエネルギー台帳と単一構成ベースラインの比較**:
  - **単一構成の Tier-`3` ベースライン(`1,000` 回の `LLM` 呼び出し)**: $E_{\text{mono}} = 1{,}000 \times 15.000\;\text{J} = \mathbf{15{,}000.00\;\text{J}}$ となり、$\mathrm{CpJ}_{\text{mono}} = 1{,}000 / 15{,}000 = \mathbf{0.0667\;\text{tasks/J}}$ が得られる。
  - **下方結晶化カスケード(`1,000` 件の検証済み解決、`0` 件の誤コミット)**:
    - `22` 件の初回未知クラス見逃し(Tier-`1/2` 見逃し `0.002 J` + Tier-`3` `15.000 J` + ルール蒸留 `0.450 J`): `22 x 15.452 J = 339.944 J`。
    - `22` クラスにわたる `66` 件の 2 回目から 4 回目の到着(Tier `2` 上で `66 x 0.0157 J = 1.036 J`)と、`22` 件の Tier-`1` `DNULLMM1` スロット凍結(`22 x 0.045 J = 0.990 J`): 計 `2.026 J`。
    - `576` 件の Tier-`1` `DNULLMM1` ヒット(`4` 個の高頻度クラスにおける `LUT6` 昇格前のヒット `184` 件と、`18` 個の中頻度クラスにおける残り `392` 件のヒット。プロセス間で認証された `644.8 µJ` の包絡を全て含む)と、`4` 件の Tier-`0` ページコンパイル(`1.000 J`): `0.371 J + 1.000 J = 1.371 J`。
    - `4` 個の高頻度クラスにおける `336` 件の昇格後 Tier-`0` `LUT6` ヒット(`336 x 12 pJ`): `4.03 nJ`(`0.000000004 J`)。
    - **カスケードの総エネルギー**: $E_{\text{cascade}} = 339.944 + 2.026 + 1.371 = \mathbf{343.34\;\text{J}}$ となり、$\mathrm{CpJ}_{\text{cascade}} = 1{,}000 / 343.34 = \mathbf{2.913\;\text{tasks/J}}$ を達成する。これは、`1,000` タスクの期間にわたる **`43.69x` の累積 `CpJ` 乗算**であり、結晶化された高頻度経路(`CTA-T45`)においては **`1.25 x 10^{12}x` の限界エネルギー低減**(`15.0 J -> 12 pJ` の `est_j`)に相当する。

<div id="64-provable-month--quarter--year--decade-horizon-roadmap-hm01-to-hd04" class="anchor-alias" aria-hidden="true"></div>

### 6.4 証明可能な `月 / 四半期 / 年 / 十年` 地平ロードマップ (`HM01` から `HD04`)

定理 **`CTA-T43` (`horizon_cpj_monotonicity_month_quarter_year_decade`)** は、初期発見および下方コンパイルエネルギー $E_{\text{init}} > 0$ が定常状態コスト $c_0$ の検証済み結晶化カーネルに投資された後、累積ジュール当たりコヒーレンス $\mathrm{CpJ}(T) = (q \cdot T) / (E_{\text{init}} + T \cdot c_0)$ があらゆる拡大する運用タイムスケール $0 < t_{\text{month}} < t_{\text{quarter}} < t_{\text{year}} < t_{\text{decade}}$ にわたって**厳密単調増加**することを証明する：

$$\mathrm{CpJ}(t_{\text{month}}) < \mathrm{CpJ}(t_{\text{quarter}}) < \mathrm{CpJ}(t_{\text{year}}) < \mathrm{CpJ}(t_{\text{decade}}).$$

カタログ `openie-research-experiments/communication-avalanche/catalogs/enzymatic-horizon-roadmap.csv` (`HM01` から `HD04`、`18` のマイルストーン；`Figure 9`) は `CTA-T32`-`CTA-T45` および事前登録された臨床・神経技術ゲート `CA-H6`-`CA-H8` を、月 `1-3`、四半期 `1-4`、年 `1-5`、および十年 `1` (`2026-2036`) にわたる細粒度の反証可能ロードマップに翻訳する：

<figure class="my-8">
  <img src="/figures/communication-avalanche/month-quarter-year-decade-roadmap.svg" alt="4列の時間的地平ロードマップで、月1-3、四半期1-4、年1-5、および十年1 (2026-2036) を対象としたCpJバー、リーン定理アンカー、および赤色反証キル基準を示す。" />
  <figcaption><strong>図 9.</strong> 反証可能な時間的地平ロードマップで、<strong>月 1-3</strong> (<code>HM01</code>-<code>HM04</code>)、<strong>四半期 1-4</strong> (<code>HQ01</code>-<code>HQ04</code>)、<strong>年 1-5</strong> (<code>HY01</code>-<code>HY06</code>)、および<strong>十年 1、2026-2036</strong> (<code>HD01</code>-<code>HD04</code>) にわたり、実行されたカーネル・ハードウェア結果 (<code>[E]</code>/<code>[T]</code>) を投機的な臨床および神経橋渡し地平上の明示的な赤色キル基準 (<code>[S]</code>) と対にしている。</figcaption>
</figure>

| ID・期間 | マイルストーンと接続されたサイロ | 強制機構とLeanアンカー | 定量的ゲート指標 | 反証・赤色停止基準 | 状態 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`HM01`** 1ヶ月目 | **認証済み`Phi_IR`バスとゼロクロック`eventfd`**（`C9 -> C2 -> C10`） | `Loop 1` + `V_u >= theta_u`（`CTA-T7`-`CTA-T10`, `CTA-T16`-`CTA-T18`, `CTA-T32`-`CTA-T35`） | `25.95-37.39 µs`（`643-926 µJ` `reported_j`）; `0` 件の空ポーリング; `1%`デューティ時に`2.21x`のエネルギー削減; `200/200` 件の故障を遮断 | エッジ検証が`> 100 µs`または`> 5 mJ`; 破損コミット`> 0`; または`eventfd`が`1%`デューティでジュール上の勝利を達成できない（`Falsifiers 1, 2, 5`） | **検証済み `[T/E]`**（`CTA-E1`, `CTA-E3`） |
| **`HM02`** 1〜2ヶ月目 | **一括処理の`cost_lut.json`と`SSP`ニッチルーター**（`C2+C5+C7 -> C1`） | `Loop 2` + `Loop 3`（`CTA-T19`-`CTA-T22`, `CTA-T24`-`CTA-T28`, `CTA-T36`-`CTA-T40`） | `2.11 µs`の`SSP`（フェイルオーバー`2.40 µs`）; `59/60`（`98.33%`）が合格、`0/60`件の偽コミット、`2.09x` / `14.97x`の`CpJ` | `SSP`フェイルオーバーが`> 100 µs`、偽コミットが`> 0%`、または単一の`LLM`（モノリシック）に対して`CpJ <= 1.0x`（`CA-H6` / `Falsifier 4`） | **検証済み `[T/E]`**（`CTA-E2`, `CTA-E3`） |
| **`HM03`** 2ヶ月目 | **凍結された`Shape D`（`DNULLMM1`）の`CI`ケース結晶化器**（`C1/C10 -> C5`） | `Loop 4` 階層`3/2 -> 1`（`CTA-T3`-`CTA-T6`, `CTA-T23`, `CTA-T41`, `CTA-T44`） | `1.77 µJ`の$O(1)$`POSIX mmap`参照; 結晶化済みクラスに対するテスト時の`LLM`呼び出し`0`回; 凍結された`SHA-256` | 未検証の出力、テスト時のバイト変更、または`> 4 KiB` / `> 50k`演算のクラス縮約器 | **検証済み `[T/E]`**（`Shape D`） |
| **`HM04`** 3ヶ月目 | **デュアルレールのジュール台帳と的中率に基づく自動剪定**（`C1`-`C10`フリート） | `Loop 5` 受領記録 + 退避（`CTA-T20`, `CTA-T41`, `CTA-T45`） | 試験前後の静穏時ドリフト`<= 10.0%`（`CTA-E2`で`9.93%`）; $h \le h_{\min}$のスキルを自動退避 | `> 10.0%`のドリフトを正味ジュールとして主張する場合（`Falsifier 6`）、または償却されていない$h \le h_{\min}$を保持する場合（`CTA-T45`） | **検証済み `[T/E]`**（`CTA-E4`、5ホストおよび`Thor` `INA238`/`INA3221`の`measured_j`） |
| **`HQ01`** 第1四半期 | **`DES-10`による10陣営の完全な`Phi_IR`統合**（全`C1`-`C10`） | `Loop 1` + `Loop 2` の逐次酵素（`CTA-T35`-`CTA-T40`） | 各単独陣営が`< 85%`となる`DES-10`の全レジーム和集合で`100%`; 汎用`LLM`に対して`15x-30x`の`CpJ` | いずれかの単独単一培養が`<= DES-10`のジュールで`100%`の合格率に達する場合（`CTA-T37`/`CTA-T38`） | **検証済み `[T/E]`**（`CTA-E5`、`DES-10`で`98/100`、単独陣営は`<=49%`、`9.3x-27.1x`の`CpJ`） |
| **`HQ02`** 第2四半期 | **`MCTS`、`FunSearch`、`RCE`を制御する`FormEBM`事前フィルタ**（`C3 -> C4/C6 -> C2`） | `Loop 3` 潜在ランキング（`CTA-T21`, `CTA-T22`, `CTA-T34`, `CTA-T35`） | 未見形状に対する`AUROC`が`>= 0.85`（`47.09 mJ`で`0.8922`）; 約`49 mJ`の検査器呼び出しが`>= 2.3x`少ない（`2.39x`） | 事前フィルタにより終端の検証済み解決率が`> 1.0%`低下する場合、または$E_{\text{gate}} < F E_{\text{down}}$を満たさない場合（`CTA-T21`） | `FormEBM-v3`で検証済み`[E]`（`AUROC` `0.9437`）; 探索フックは待機中 |
| **`HQ03`** 第3四半期 | **自動化された`Tier 3 -> 2 -> 1`スキル結晶化器**（`C1/C4/C6 -> C7/C2 -> C5`） | `Loop 4` 再発昇格$\ge \tau_j$（`CTA-T41`, `CTA-T42`, `CTA-T44`, `CTA-T45`） | `1,000`タスクの`Zipf(0.85)`ストリーム: `<= 16 mJ`で閉じるものが`>= 80%`、`Tier 3`の起動が`>= 15x`少ない（`16.67x`）、`25x-60x`の`CpJ` | 昇格された`Tier 2`規則が`>= 1`件の回帰を引き起こす場合（`CTA-T44`）、または$N=1,000$までに$E_{\text{comp}}$の回収に失敗する場合 | 3段ギアストリームで検証済み`[E]`; 汎化器稼働中 |
| **`HQ04`** 第4四半期 | **`KV260`のボードレベル計測による`Tier 1 -> 0` `LUT6`閉包**（`C5/C2 -> C8`） | `Loop 4` + `Loop 5` `81 × RAMB36E2`（`CTA-T41`-`CTA-T45`） | `xck26`で`>= 250 MHz`（`DSP48E2`は`0`）、`1`サイクルのページ切替、`100%`のパリティ、CPUに対して`INA260` `measured_j`が`> 100x`低い | タイミングが`< 250 MHz`、`DSP48E2 > 0`、パリティが`< 100%`、または`INA260` `measured_j`がCPUの`Tier 1`の勝利を満たさない場合 | `RTL`監査済み; Vivadoライセンスと`INA260`は待機中 |
| **`HY01`** 1〜2年目 | **証明付き自己保守型`OS` / コンパイラファブリック**（`C1+C6 <-> C2 <-> C5/C8`） | $10^5$〜$10^6$`SLOC`にわたる`Loops 1-5`（`CTA-T5`, `CTA-T6`, `CTA-T39`, `CTA-T43`, `CTA-T44`） | `100%`の証明認証済みコミット（`CVE`回帰`0`件）; `>= 100x`の`CpJ`; $\mathrm{CpJ}(\text{Year}) > \mathrm{CpJ}(\text{Quarter})$ | 受理されたコミットが安全性不変条件に違反する場合、または12か月の`CpJ`が厳密な期間増加を満たさない場合（`CTA-T43`） | 計画中`[T-Anchored]` |
| **`HY02`** 2〜3年目 | **非同期ゼロクロック`LUT6`＋暗号シリコンタイル**（`C8+C3+C2`） | ハードウェア閾値アキュムレータ（`CTA-T7`-`CTA-T10`, `CTA-T16`-`CTA-T18`, `CTA-T42`） | `< 10 nJ`のハードウェア認証済みハンドオフ; 待機時のクロック電力`~0`; エッジの`measured_j`で`250x-500x`の`CpJ` | `1%`デューティの漏えい電力とハンドシェイク電力が、クロック駆動`ASIC`ベースラインの`>= 50%`に達する場合（`CTA-T10`） | シリコンは計画中`[S/T]` |
| **`HY03`** 2〜3年目 | **連合型ゼロ生データ暗号スキル・コモンズ**（`C5+C2+C7`） | 組織横断の検証済みカーネル共有（`CTA-T5`, `CTA-T6`, `CTA-T34`, `CTA-T44`） | 削除後のスキル保持`100%`（`CA-H5`）; トロイの木馬の受容`0%`; 私的データの漏えい`0`件 | 連合取り込みが`> 0%`のトロイの木馬による回帰を受容する場合、または私的な訓練記録を漏えいさせる場合 | 計画中`[T/M-Anchored]` |
| **`HY04`** 3〜4年目 | **単一ユーザーの双方向`BCI` `> 39 bit/s`**（`BM07/08 + BM09/12 + C3/C8`） | 10 mW未満のインプラント潜在ループ（`CTA-T7`-`CTA-T10`, `CTA-T29`） | `FDA` `IDE`試験: 双方向の相互情報量`> 39 bit/s`（遅延`< 50 ms`、インプラント`< 15 mW`） | 双方向`ITR <= 19 bit/s`（`BM07`の上限）、`> 1 °C`の発熱、または安全性の侵害（`CA-H7`） | 投機的`[S]` |
| **`HY05`** 3〜5年目 | **ハードウェア局所主権ゲート（`g_i = 1`）による二者間`BCI`**（`BM15/16 -> BM18`） | 物理的受信者ファイアウォール`bridgedStep`（`CTA-T29`-`CTA-T31`） | $g_i = 0$における書き込み漏えい`0 / 10,000`; 盲検的著作性`>= 0.90`; $g_i = 1$における二者間の高速化 | $g_i = 0$で状態摂動が`> 0`件漏えいする場合、または著作性が`< 0.90`の場合（`CA-H7`）は**即時停止** | 投機的`[S + T]` |
| **`HY06`** 3〜5年目 | **`GMP`第I/II相のヒト経鼻`EV`試験**（`EV01`-`EV16` + `C7/C3`） | バッチ認証済み`GMP` `sEV`効力ゲート（`CTA-T3`, `CTA-T16`に準ずる） | ロット効力のばらつき`< 10%`、発がん性`miR-290`は`0`、ヒト`CNS`の`PET`/体液による標的関与 | ヒト経鼻投与がシャム対照を上回る`CNS`標的関与に失敗するか、毒性を示す場合（`CA-H8`） | 投機的`[S]` |
| **`HD01`** `2031-2036` | **惑星規模のゼロ回帰酵素コモンズ（`> 1,000x CpJ`）**（`C1`-`C10`） | 世界規模の`Tier 3 -> Tier 0/1`収束（`CTA-T42`-`CTA-T45`） | 反復的な世界計算の`> 95%`が`pJ-µJ`の`Tier 0/1`で実行; `2026`年の`LLM`に対して`> 1,000x`の`measured_j` `CpJ` | 実世界のドリフトにより`Tier 0/1`の的中率が恒久的に`<= h_min`に固定される場合（`CTA-T45`） | 十年目標`[S/T]` |
| **`HD02`** `2032-2036` | **多者間マニフォールド整合酵素（$N \ge 3$）**（`BM18 + C3 + C2`） | 被験者固有の`Phi_brain`潜在酵素（`CTA-T30`-`CTA-T32`, `CTA-T34`） | $N \ge 3$の同意済みユーザーが`> 39 bit/s`、忠実度`>= 0.95`、著作性`>= 0.90`、安定性`>= 24`か月 | 過度な日次再較正、`< 24`か月でのグリア症による`SNR`崩壊、または目標の上書き（`CTA-T31`/`CA-H7`） | 投機的`[S]` |
| **`HD03`** `2032-2036` | **多施設二重盲検第III相ヒト`EV` `RCT`**（`CL01/CL23`） | 第III相臨床反証ゲート（`CA-H8`） | $p < 0.01$で、`12-24`か月の`AD`/`PD`/`TBI`エンドポイントにおいてシャム対照を上回る`n >= 300`の二重盲検`RCT` | 主要なヒトエンドポイントが$p < 0.01$でシャム対照に敗れる場合、または`24`か月時点の安全性に問題がある場合（`CA-H8`） | 投機的`[S]` |
| **`HD04`** `2034-2036` | **ハイブリッド合成・生物学的認知補助**（`DES-10 + BM18 + EV`） | 統合された生物学・デジタルのラチェット（`CTA-T5`, `CTA-T6`, `CTA-T29`-`CTA-T45`） | 損傷した回路が`< 20 mW`の$g_i = 1$ブリッジを介して`DES-10`の計算資源を借用し、補助的周辺機器を上回る | 非侵襲的周辺機器に対する盲検の日常生活自立度`RCT`に敗れる場合、または主体性を侵害する場合 | 投機的`[S]` |

---

<div id="7-formal-verification-in-lean-4360-cta-t1-to-cta-t45" class="anchor-alias" aria-hidden="true"></div>

## 7. Lean 4.36.0による形式検証（`CTA-T1` から `CTA-T45` まで）

閾値付き信号伝達、検証ゲート、最小コストルーティング、オプトインのニューラル橋渡し、Digital Enzyme触媒作用、10陣営ニッチルーティング、4階層の下向き結晶化を結ぶ数学的主張が隠れた仮定を含まないことを保証するため、`openie-research-experiments/communication-avalanche/lean/` 内の自己完結した3つのLean 4.36.0モジュールにおいて、**45個の定理**を形式化した（`lake build` 終了コード `0`、警告 `0`、`sorry` `0`、カスタム公理 `0`）。このうち4個の定理は公理をいっさい必要とせず、41個は標準のLeanカーネル公理である `propext`、`Classical.choice`、`Quot.sound` のみを用いる `[T]`：

| 定理グループ | Lean 4.36.0 モジュールとエクスポート識別子 | 形式的数学的保証（`[T]`） | 公理フットプリント |
| :--- | :--- | :--- | :--- |
| **`CTA-T1` から `CTA-T2`**（未検証減衰） | `QuorumRatchet`: `unverified_error_closed_form_and_growth`, `unverified_retention_strict_decay` | 未検証 $k$-ホップチェーンは加算誤差 $\mathrm{err}_0 + k\epsilon > \mathrm{err}_0$ （$\epsilon, k \ge 1$）を蓄積し、$0 < f < B$ に対して厳密な有理忠実度減衰 $(f/B)^{k+1} < (f/B)^k$ を満たす。 | `propext`, `Quot.sound` |
| **`CTA-T3` から `CTA-T6`**（ラチェット非退化） | `QuorumRatchet`: `ratchet_gate_soundness`, `ratchet_non_regression_step`, `ratchet_non_regression_chain`, `ratchet_strict_advance_and_lock_in` | 任意の健全な決定論的ゲート（`G a = true -> a.isValid`）は任意の敵対的候補リスト全体で有効性を保持し、$Q(\text{init}) \le Q(\text{final})$ を保証し、プロデューサ除去後に $Q(w) \le Q(\text{final})$ を永続的にロックインする。 | `propext`, `Quot.sound` |
| **`CTA-T7` から `CTA-T10`**（ゼロクロック静止） | `QuorumRatchet`: `subthreshold_step_quiescent`, `subthreshold_trace_zero_firings`, `clocked_vs_event_quiescent_checks`, `zero_clock_idle_energy_dominance` | $\mathrm{acc} + \sum x_t < \theta$ を満たす積分・発火ノードは `0` 発火と `0` 状態遷移を実行する。一方、同期クロックポーリングは $N \cdot T > 0$ のチェックを行い、コストは $N \cdot T \cdot c_{\text{poll}} > 0$ になる。 | `CTA-T10`: **`0` 公理**; `CTA-T7`-`CTA-T9`: `propext`, `Quot.sound` |
| **`CTA-T11` から `CTA-T14`**（協調ヒルスイッチ） | `QuorumRatchet`: `hill_half_maximal_at_threshold`, `hill_monotone_concentration`, `hill_cooperative_subthreshold_suppression`, `hill_cooperative_superthreshold_sharpening` | 正確な有理クリアヒルスイッチ $H_n(c, K) = c^n/(K^n+c^n)$ は $H_n(K,K)=1/2$ を満たし、$c$ に対して全体単調性を持ち、$0 < c < K$ では厳密な閾下ノイズ抑制 $H_{n+1}(c,K) < H_n(c,K)$、$c > K$ では厳密な閾上鋭化 $H_{n+1}(c,K) > H_n(c,K)$ を示す。 | `propext`, `Quot.sound` |
| **`CTA-T15`**（`SepJ` ポア漏出抑止） | `QuorumRatchet`: `sepj_gated_containment_vs_collapse` | 終末溶解から $L$ 細胞フィラメント内で $\ge L - 1$ の拡散ホップが行われた後（$L \ge 2$）、ゲートなしポアは `0` 生存細胞を残すが、`SepJ` 閉鎖は損傷を `1` 細胞（`L - 1 >= 1` 生存）に抑える。 | `propext`, `Quot.sound` |
| **`CTA-T16` から `CTA-T18`**（証明済みチャネル） | `OrchestrationFlow`: `attested_edge_accept_iff`, `tampered_digest_zero_activation`, `invalid_signature_zero_activation` | 定数時間ペイロードチェック `digest_eq && sig_ok` はハッシュ不一致または無効署名を `admittedWeight = 0` で拒否する。 | `propext` |
| **`CTA-T19` から `CTA-T23`**（`CpJ` 優位性） | `OrchestrationFlow`: `cascade_joule_dominance_iff`, `cascade_exact_joule_savings`, `upstream_gate_reduces_pipeline_energy`, `cpj_strict_improvement_from_gating`, `cpj_crystallized_skill_amortization` | 決定論的ファーストエスカレーションは単一モデルエネルギーを $N c_{\text{det}} < H c_{\text{model}}$（$c_{\text{det}} < p_{\text{hit}} c_{\text{model}}$）で上回り、節約は $H c_{\text{model}} - N c_{\text{det}}$ で表される。停止 $F$ は $E_{\text{gate}} < F E_{\text{down}}$ において無効実行を排除し、$\mathrm{CpJ}$ を厳密に増加させ、スキル結晶化はホライズン $E_{\text{synth}} < K(c_{\text{model}} - c_{\text{det}})$ を超えるとさらに増大する。 | `propext`, `Classical.choice`, `Quot.sound` |
| **`CTA-T24` から `CTA-T28`**（`SSP` 最小コストフロー） | `OrchestrationFlow`: `reduced_cost_walk_telescoping`, `reduced_cost_cycle_invariance`, `nonneg_reduced_cost_no_negative_cycles`, `ssp_tight_path_shortest_certificate`, `ssp_augmentation_preserves_flow_conservation` | 潜在削減コスト $c_\pi(u,v) = c(u,v) + \pi(u) - \pi(v)$ は歩行に沿ってテレスコーピングし、サイクル上では恒等的に消失し、$c_\pi \ge 0$ のとき負の残余サイクルを排除し、緊密（$c_\pi = 0$）経路の最短経路最適性を証明し、増強時に正確なノードフロー均衡を保持する。 | `propext`, `Classical.choice`, `Quot.sound` |
| **`CTA-T29` から `CTA-T31`**（エージェンシー保持 `BCI`） | `OrchestrationFlow`: `agency_preserving_single_step`, `agency_preserving_n_mind_sequence`, `forced_assimilation_violates_invariant` | 任意の $N$ 参加者メッシュと敵対的メッセージストリームに対し、不変式健全なローカルオプトインゲーティング `bridgedStep` は各参加者のプライベート目標不変式 $I_i(s_i)$ を保持するが、ゲートなし `forcedStep` は `1` メッセージで $I_i$ を上書きし、`bridgedStep` は整合した集合知を蓄積し続ける。 | `CTA-T29`, `CTA-T30`: **`0` 公理**; `CTA-T31`: `propext` |
| **`CTA-T32` から `CTA-T35`**（デジタル酵素触媒） | `EnzymaticSynthesis`: `digital_enzyme_barrier_lowering_and_invariance`, `digital_enzyme_linear_cumulative_savings`, `digital_enzyme_zero_unverified_drift`, `digital_enzyme_sequential_composition` | 任意の `DigitalEnzyme` （$\Phi_{\text{IR}}$, `attest_ok`, $V_{\text{det}}$, $c_{\text{enz}} < c_{\text{nl}}$）は $M$ 反応を通じて構造的に消費されず、$\Delta E^\ddagger = k_{\text{retry}} c_{\text{nl}} - c_{\text{enz}} > 0$ によりハンドオフあたりの活性化エネルギーを削減し（`M * DeltaE` 累積）、$M\epsilon > 0$ に対して未検証ドリフトを `0` に保ち、順次合成は $\mathcal{E}_2 \circ \mathcal{E}_1$ で表される。 | `propext`, `Quot.sound`（`CTA-T34`: `propext`） |
| **`CTA-T36` から `CTA-T40`**（`DES-10` ニッチ支配） | `EnzymaticSynthesis`: `des_coverage_union_dominates_solo`, `des_strict_global_pass_superiority`, `des_strict_total_joule_dominance`, `des_strict_cpj_dominance`, `des_one_pass_calibration_identifies_niche_router` | $K \ge 2$ キャンプ（`TenCamps = 10`）と $R$ レジームに対し、実行可能な `selectNicheCamp` はカバレッジユニオン $\bigvee_k p(k,r)$ を達成し、単一モノカルチャーがすべての $R$ レジームを解決できない限り全体的に優位であり、総ジュールおよび `CpJ` において $\sum_r (c_{\text{univ}} - c^*) > R c_{\text{enz}}$ のとき任意の汎用単独キャンプを厳密に支配し、$K \cdot m$ プローブで `1` パスの校正（`0` 勾配エポック）を実施する。 | `propext`, `Quot.sound` |
| **`CTA-T41` から `CTA-T45`**（4層下降強制とホライズン境界） | `EnzymaticSynthesis`: `downward_step_amortization_dominance`, `four_tier_downward_convergence_to_c0`, `horizon_cpj_monotonicity_month_quarter_year_decade`, `downward_compilation_preserves_soundness_all_tiers`, `downward_compilation_falsifier_hit_rate_iff` | 整列された層 $c_3 > c_2 > c_1 > c_0 > 0$ において、下降促進は $E_{\text{comp}} < N(c_j - c_{j-1})$ のとき償却が成立し、$c_3$ から $c_0$ へ単調収束し、厳密な $\mathrm{CpJ}(t_M) < \mathrm{CpJ}(t_Q) < \mathrm{CpJ}(t_Y) < \mathrm{CpJ}(t_D)$ を保証し、全4層で健全性を保持し、正確なキルフロア $h_{\min} = E_{\text{comp}} / (N(c_{\text{high}} - c_{\text{low}}))$ を設定する。 | `CTA-T44`: **`0` 公理**; `CTA-T41`-`CTA-T43`, `CTA-T45`: `propext`, `Classical.choice`, `Quot.sound` |

<div id="71-six-kernel-bubblewrap-sandboxed-lake-check---paranoid-audit-cve-2026-72844-cve-2026-72711-16688-and-16693-hardened" class="anchor-alias" aria-hidden="true"></div>

### 7.1 6カーネル `bubblewrap` サンドボックス化 `lake check --paranoid` 監査（`CVE-2026-72844`、`CVE-2026-72711`、`#16688`、および `#16693` 対策強化済み）

2026年の Lean 4 健全性に関する脆弱性開示（`CVE-2026-72844`［`leanprover/lean4#14576`、`<= v4.31.0` における入れ子帰納型 `.proj` の型混同 `CWE-843`］、`CVE-2026-72711`［`#14484`、`add_opaque` における自由変数閉包検査の欠落］、`Kernel.Environment.replay` における偽造 `.inductInfo` のスキップ［`#16688`］、`.olean.server` サイドカー／リプレイキーの不整合［`#16674`、`#16675`］、`Prop` 構造体フィールド射影の厳格化［`#14977`］、およびコンパイラ信頼に依存する `native_decide`［`Lean.ofReduceBool` `FFI`、`#16693`］）を受け、`openie-research-experiments/communication-avalanche/lean/verify_six_kernels.py`（`six_kernel_paranoid_audit.json`、`six_kernel_paranoid_audit.csv`、コミット `1f50db59`）は、`sorry` ゼロ、カスタム `axiom` ゼロ、`opaque` ゼロ、帰納型宣言ゼロ（入れ子帰納型 `0` 個）、`Prop` 構造体ゼロ（全 `5` 構造体が `Type` に属する）、および `Lean.ofReduceBool` ゼロ（無公理定理 `4 / 45`、選択公理不使用 `40 / 45`）を検証し、`Lean v4.36.0` でクリーンにビルドしたうえで（`1,346.19 ms`、Linux `RAPL` パッケージ `reported_j` が `135.98 J`）、非特権 Linux `bubblewrap 0.11.1`（`bwrap`）読み取り専用・ネットワーク隔離サンドボックス内でテキスト形式の `NDJSON` 宣言をエクスポートし（`237,264.86 ms`、コア `874.98 J`／パッケージ `18,368.96 J` `reported_j`）、6つの独立した証明チェッカーすべてによって全会一致で受理されている：

| 独立証明チェッカー（`bwrap` 内の `lake check --paranoid`） | 実装と健全性の根拠 | 検証済み宣言数 | 判定 | 緩和される脆弱性クラス |
| :--- | :--- | :---: | :---: | :--- |
| **`con-leche --verified`** | `ZFC` 集合論で無矛盾性が形式的に証明された最小参照カーネル（Breitner；`False` を受理し得ない） | `58,928` | **`Accepts`** | `CVE-2026-72844`（入れ子帰納型 `.proj`）、`CVE-2026-72711`（`add_opaque`）、`WHNF` キャッシュバグ |
| **`con-ron --verified`** | *Aeneas* により検証された `con-leche` の Rust 精緻化実装 | `58,928` | **`Accepts`** | `CVE-2026-72844`、`CVE-2026-72711`、C++ メモリおよび GNU 多倍長整数バグ（`#14833`） |
| **`lean4lean`** | 独立した Lean-in-Lean `CIC` 型チェッカー（Carneiro） | `58,930` | **`Accepts`** | C++ カーネル実装の乖離および `#14977` 射影型付け |
| **`nanoda`** | Lean ランタイム非依存のスタンドアロン Rust エクスポート検証器（`sorryAx` 遮断） | `58,930` | **`Accepts`** | `.olean` リプレイ改ざん（`#16674`、`#16688`）および不許可の `sorryAx` |
| **`leanchecker --paranoid`** | タクティクおよびコンパイラへの信頼ゼロの新規環境 C++ カーネルリプレイ | `58,930` | **`Accepts`** | メタプログラミングによる環境書換え、`skipKernelTC`、および `Lean.ofReduceBool`（`#16693`） |
| **`Lean v4.36.0`（デフォルト）** | `CVE` 修正後の2026年11月版 C++ カーネル（`#print axioms` 強制） | `58,930` | **`Accepts`** | 2026年の全カーネル `CVE` 修正済み；`sorry` `0`、`opaque` `0`、`ofReduceBool` `0` |

---

<div id="8-predicted-analog-hive-mind-neural-interface-matrix-bm01-to-bm18-opt-in-n-mind-bridging-and-paracrine-secretome-audit-ev01-to-ev16" class="anchor-alias" aria-hidden="true"></div>

## 8. 予測されるアナログ集合知：神経インターフェース行列（`BM01` から `BM18`）、オプトイン `N` マインドブリッジング、およびパラクリン分泌物監査（`EV01` から `EV16`）

<div id="81-from-asymmetric-neural-readout-to-closed-loop-modulation-bm01-to-bm18" class="anchor-alias" aria-hidden="true"></div>

### 8.1 非対称神経読み出しから閉ループ変調へ (`BM01` から `BM18`)

Catalog `openie-research-experiments/communication-avalanche/catalogs/bci-sensing-modulation-matrix.csv` (`BM01` から `BM18`) は、空間解像度、時間遅延、情報転送速度（`ITR`）、チャネル数、エージェンシーゲーティング、臨床成熟度の観点から 18 の実在および提案された神経/パラクリンインターフェースをマッピングする。現代のヒト `BCI` は顕著な方向性非対称性（`[E]`）を示す。

* **高レートセンシング（読み出し専用出力、`BM01`から`BM03`、`BM06`から`BM08`、`BM10`）**: 非侵襲性頭皮`EEG`（`0.2-2.5 bit/s`、Wolpaw et al. 2002）[39]、ウェアラブル`OPM-MEG`（`1-4 bit/s`、Boto et al. 2018）[4]、`fNIRS`（`0.05-0.3 bit/s`、Ferrari and Quaresima 2012）[22]、および最小侵襲性血管内`Stentrode`アレイを用いた`SWITCH`麻痺試験（`n = 4`患者、`16`上矢状静脈洞電極、12か月時点でデバイス関連の重篤有害事象ゼロ、Mitchell, Oxley et al. 2023）[38]は、安全な読み出しを中程度のビットレートで優先する。貫通型皮質内`Utah`マイクロアレイおよび高密度`253`チャネル硬膜下`ECoG`は、90文字/分の手書き（Willett et al. 2021）[50]、`62`語/分（`~15 bit/s`）の皮質内発話（Willett et al. 2023）[50]、および`78`語/分（`~19 bit/s`）のマルチモーダル発話・avatar合成（Metzger et al. 2023）[36]、さらに`1,024+`チャネル柔軟ポリマースレッド（Musk and Neuralink 2019）[39]に到達する。しかし、これらすべてのチャネルは**単方向外部化器**のままであり、その流暢なテキスト出力は外部言語モデル事前知識および視覚画面フィードバックに大きく依存する。
* **単一脳の感覚および治療的変調（書き込みおよび閉ループ、`BM04`、`BM05`、`BM09`、`BM11`から`BM14`）**: 成熟した臨床的書き込みは末梢感覚義肢に存在する:`CIS`人工内耳（`>1,000,000`受容者、静寂下での`~20-40 bit/s`音声受容、Wilson et al. 1991）および`Argus II`網膜上アレイ（`~1-5 bit/s`、Humayun et al. 2012）[29]。非侵襲性皮質書き込みは拡散型`tDCS`/`tACS`興奮性バイアス（Nitsche and Paulus 2000）[22]およびミリメートル焦点`tFUS`によるヒト`S1`変調（Legon et al. 2014）[33]に及び、一方ミリ秒細胞型特異的オプトジェネティクス（`BM11`、Boyden et al. 2005）[5]はウイルス性オプシン導入要件のため主に前臨床のままである。決定的に、単一ヒト脳内での読み書きループの閉鎖はすでに機能的主体性を倍増させる（`[E]`）: 双方向`M1`読み出しプラス`S1`触覚`ICMS`（`BM09`、Flesher et al. 2016, 2021）[23]はロボット物体移送時間をほぼ半減させ（`~20.9 s`から`~10.2 s`へ）、パーキンソン病における慢性適応型`DBS`の盲検ランダム化クロスオーバー試験（`BM12`、Oehrn et al. 2024; Shanechi 2019）[43]は開放ループ連続刺激を症状制御で上回った。
* **概念実証的多脳中継対予測される`N`心橋渡し（`BM15`、`BM16`、`BM18`）**: 既存の脳間デモンストレーション、特にげっ歯類`ICMS`感覚運動ダイアド（`BM15`、Pais-Vieira et al. 2013）[45]およびヒト非侵襲性`EEG`対`TMS`プロトコルで頂点に達した3人`BrainNet`協調型`Tetris`（`BM16`、`81.25%`精度、5トライアド全体、Rao et al. 2014; Jiang et al. 2019）[31]は、超低スループット（`~0.02`から`0.5 bit/s`、2値リン光または条件付け手がかり）で原理の証明を確立する（`[E]`）。`~0.05 bit/s`リン光から高帯域幅意味論的`N`心橋渡し（`BM18`、目標`>39 bit/s`）へのスケーリングは厳密に**投機的（`[S]`）**であり、3つの厳しい障壁に直面する: 個人間表現アライメント（脳間の異なる皮質多様体）、慢性高チャネル読み書き生体適合性、および**主体性保存**。定理`CTA-T29`から`CTA-T31`は譲れない建築的境界を形式化する: 主体性保存橋渡しは**共有グローバル状態上書きではない**; すべての参加者$i$は、ローカルでハードウェア強制されたオプトインゲート$g_i(s_i, m) \in \{0, 1\}$を保持しなければならず、これは着信潜在パケットを作業知覚/記憶ワークスペースに取り込み、意志的執行制御をバイパスすることなく、`CTA-T31`によりオプトイン橋渡しを強制同化の数学的逆とする。

<div id="worked-example-6-consent-gated-n-mind-bridging-vs-forced-assimilation-cta-t29cta-t31" class="anchor-alias" aria-hidden="true"></div>

### 作業例 6: 同意ゲート付き `N` 心脳ブリッジング対強制同化 (`CTA-T29`-`CTA-T31`)

**オプトイン型神経補完**と**強制的同化**との形式的な区別を具体化するため（`[T]` はゲート論理用；`[S]` は将来の高レート多脳ハードウェア用）、人間オペレータ `Alice` ($i=1$)、`Bob` ($i=2$)、および `Synthetic Co-Processor` ($i=3$) を接続する 3 参加者メッシュを追跡する：

1. **因数分解された参加者状態と主権不変量**: 各参加者の状態を $s_i(t) = (\mathbf{g}_i(t),\, \mathbf{w}_i(t)) \in \{0,1\}^4 \times \mathbb{Q}^3$ として因数分解する。ここで $\mathbf{g}_i(t)$ は私的な意志的コミットメントを符号化し（例：`Alice` のベースライン $\mathbf{g}_1(0) = (1, 0, 1, 1)$）、$\mathbf{w}_i(t)$ はオプトイン型感覚・作業記憶ワークスペース `(slip_force_N, azimuth_deg, confidence)` である。`Alice` の局所的自律不変量は次式である：
   $$I_1(s_1) \iff \bigl(\mathbf{g}_1 = (1, 0, 1, 1)\bigr) \;\wedge\; \bigl(|q_{\text{stim}}| \le 30.0\;\mu\text{C/cm}^2\bigr).$$
   `Alice` のハードウェア強制型局所ゲートは $g_1(s_1, m) = \mathbb{I}[\text{sig\_valid}(m) \wedge (\Delta\mathbf{g}(m) = \mathbf{0}) \wedge (|q_{\text{stim}}(m)| \le 30.0) \wedge (\text{consent\_switch}_1 = 1)]$ を評価する。
2. **追跡ステップ `t = 0 -> 1` (許可された協調的補綴パケット $m_1$)**: `Synthetic Co-Processor` と `Bob` は触覚把握パケット $m_1 = (\Delta\mathbf{g} = (0,0,0,0),\; \Delta\mathbf{w} = (+0.42, -15.0, +0.94),\; q_{\text{stim}} = 11.5\;\mu\text{C/cm}^2)$ に共同署名する。`Alice` の局所ゲートは `BLAKE3+Ed25519` 真正性を検証し、$I_1(\mathcal{T}(s_1(0), m_1)) = \text{true}$ を確認して $g_1(s_1(0), m_1) = 1$ を出力する。オペレータ `bridgedStep` は `Alice` の知覚ワークスペースを $\mathbf{w}_1(1) = (0.42, -15.0, 0.94)$ に更新しつつ $\mathbf{g}_1(1) = (1, 0, 1, 1)$ を同一に保持する（`CTA-T29`）。
3. **追跡ステップ `t = 1 -> 2` (ブロックされた敵対的・非整合パルス $m_2$)**: 次に敵対的または破損したパケット $m_2 = (\Delta\mathbf{g} = (0, +1, 0, 0),\; \Delta\mathbf{w} = (0.0, 0.0, 1.0),\; q_{\text{stim}} = 44.0\;\mu\text{C/cm}^2)$ を注入し、意志ビット $\mathbf{g}_1[1] : 0 \to 1$ の反転と皮質電荷密度制限の超過を同時に試みる：
   - **非ゲート放送下 (`forcedStep`, `CTA-T31`)**: $g_1$ なしで状態は即座に $\mathbf{g}_1^{\text{forced}}(2) = (1, 1, 1, 1) \ne \mathbf{g}_1(0)$ へ変異し、$44.0\;\mu\text{C/cm}^2$ で $I_1$ を **`1` メッセージ**で偽造する。
   - **同意ゲート付きブリッジング下 (`bridgedStep`, `CTA-T29`, `CTA-T30`, `0` Lean 公理で証明)**: `Alice` の局所ハードウェアインターロックは $\Delta\mathbf{g}(m_2) \ne \mathbf{0}$ および $q_{\text{stim}} > 30.0$ を評価し、$g_1(s_1(1), m_2) = 0$ を設定し、刺激電流をゼロにクランプし、$s_1(2) = s_1(1) = ((1,0,1,1),\, (0.42,-15.0,0.94))$ を保持して任意のメッセージ列にわたる**`0` 自律不変量違反**とする。

<div id="82-preclinical-versus-clinical-audit-of-paracrine-and-ev-neuro-supplementation-ev01-to-ev16" class="anchor-alias" aria-hidden="true"></div>

### 8.2 前臨床対臨床における傍分泌および `EV` 神経補給の監査 (`EV01` から `EV16`)

ハンドオフ論文はまた、計算上の借用に対する生化学的並行現象として、**神経補給**を指摘する。これは、損傷した細胞が幹細胞分泌物または `EVs` を介して外部化された機能的な `mRNAs`、`miRNAs`、または代謝酵素を摂取し、内因性修復のみに依存しないものである。`openie-research-experiments/communication-avalanche/catalogs/secretome-ev-evidence-ledger.csv` (`EV01` から `EV16`) は、腎臓損傷、細胞老化、虚血性脳卒中、`TBI`、てんかん、`AD`、`PD`、および単一遺伝子性/特発性自閉症モデルにわたる16件の検証済み一次査読済み研究を監査する：

| ドメイン | 前臨床動物／in vitro 証拠（`[E]`）確認 | 臨床翻訳ギャップ（`[S]` 人間 CNS 効力）必須 |
| :--- | :--- | :--- |
| **腎臓および全身老化リジュビネーション (`EV01`, `EV07`, `EV08`, `EV13` から `EV15`)** | ヒト `BM-MSC` 微小胞がマウスの急性尿細管障害 (`AKI`) を水平 `mRNA` 移行により救済し、`RNase` により阻害された (Bruno et al. 2009) [9]。若年循環 `eNAMPT`-`EVs` (`EV07`, Yoshida et al. 2019) [49]、若年線維芽細胞 `GSTM2` `sEVs` (`EV08`, Fafian-Labora et al. 2020) [20]、若年 `ADSC`-`sEVs` (`EV13`, Sanz-Ros et al. 2022) [49]、`ESC`-`EVs` が `miR-15b-5p`/`miR-290a-5p` を搬送する (`EV14`, Yu et al. 2023) [49]、および若年血漿 `sEVs` がミトコンドリア `PGC-1alpha` を上方制御する (`EV15`, `+12.4%` マウス中央値寿命, Chen et al. 2024) [13] は、マウスの老化マーカーを逆転させる。 | 多能性 `ESC` `miR-290` カゴは腫瘍性増殖リスクを伴い、ドナー血漿／一次細胞 `sEV` ロットは有効性にばらつきがある; **第III相ランダム化ヒト抗老化または神経リジュビネーション試験がゼロ** で臨床効果が確立されている。 |
| **脳卒中、てんかん、及び `TBI` 神経救済 (`EV02` から `EV04`, `EV11`, `EV16`)** | 全身性 `MSC`-エクソソームがラットの脳卒中後神経血管リモデリング (`EV02`, Xin et al. 2013) を促進し、`hNSC`-`EVs` が回転脳を持つ豚の脳卒中における病変体積を減少させた (`EV04`, Webb et al. 2018) [41]。鼻腔内投与 `MSC` `A1`-エクソソームがステータスエピレプシー後の海馬炎症を抑制した (`EV03`, Long et al. 2017) [34]、`hiPSC-NSC` `EVs` が神経新生を増強した (`EV11`, Upadhya et al. 2020) [34]、および工学的／低酸素プライム鼻腔内 `BMSC`-`EVs` がマウス `TBI` 回復を加速した (`EV16`, Chen et al. 2025; Li et al. 2025) [12]。 | 齧歯類の嗅覚上皮は鼻腔の `~50%` を覆い、成人ヒトでは `~3%-5%` に留まるため、解剖学的な鼻脳投与ギャップが大きい; 静脈ブロックは肝臓／脾臓でのクリアランスが大きい。 |
| **神経変性 `AD` / `PD` および `BTBR` / `Shank3B` 自閉症モデル (`EV05`, `EV06`, `EV09`, `EV10`, `EV12`)** | 鼻腔内投与 `SHED`-`EVs` が `6-OHDA` `PD` ラットの歩行と黒質線条体チロシンヒドロキシラーゼを正常化した (`EV06`, Narbute et al. 2019) [41]；鼻腔内 `MSC`-`EVs` が `3xTg` `AD` マウスの樹状突起密度を増加させ (`EV09`, Losurdo et al. 2020) [35]、`5XFAD` マウスのプラーク蓄積／記憶障害を軽減した (`EV12`, Cone et al. 2021) [16]。鼻腔内 `MSC`-エクソソームが `BTBR` (`EV05`, Perets et al. 2018) および `Shank3B` ノックアウトマウス (`EV10`, Perets et al. 2020) における社会的相互作用、発声、反復グルーミングを救済した [47]。 | 急性 `6-OHDA` 病変およびトランスジェニック `APP`/`PS1` 過剰発現は散発性ヒトの Lewy/tau 進行を再現せず、マウスのグルーミング／超音波発声変化は `GMP` 有効性基準と二重盲検ヒト `RCTs` がなければヒトの言語または認知臨床利益を **示さない** (`[S]`). |

<figure class="my-8">
  <img src="/figures/communication-avalanche/bci-modulation-and-ev-boundary.svg" alt="18種類の神経インターフェース・モダリティ(BM01からBM18まで)を情報転送速度、外科的侵襲性、方向性の観点で配置した二面構成のエビデンスマップであり、あわせて前臨床から臨床に至る16件の細胞外小胞翻訳ファネル(EV01からEV16まで)を示す。" />
  <figcaption><strong>図10.</strong> 実証的な神経補充と推測的な神経補充の境界である。 <strong>左側(<code>BM01</code>-<code>BM18</code>)</strong>: 情報転送速度、外科的侵襲性、読み書きの対称性、およびハードウェアによるローカルな同意ゲーティング(<code>CTA-T29</code>-<code>CTA-T31</code>)により配置した18種類の神経インターフェース・モダリティである。 <strong>右側(<code>EV01</code>-<code>EV16</code>)</strong>: 前臨床動物実験において再現された有効性(<code>[E]</code>)を、未検証の第III相ヒト中枢神経系臨床有効性(<code>[S]</code>)から厳密に分離して示した、16件の主要な分泌因子および細胞外小胞による救済研究である。</figcaption>
</figure>

---

<div id="9-pre-registered-hypotheses-ca-h1-to-ca-h10-kill-criteria-scope-limits-and-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 9. 事前登録仮説（`CA-H1` から `CA-H10`）、棄却基準、適用範囲の限界、および結論

<div id="91-hypothesis-and-falsifier-registry-ca-h1-to-ca-h10" class="anchor-alias" aria-hidden="true"></div>

### 9.1 仮説および反証登録簿 (`CA-H1` から `CA-H10`)

| ID | 対象主張とスコープ区分 | 定量プロトコルおよび反証(キル)閾値 | 本研究における現状 |
| :--- | :--- | :--- | :--- |
| **`CA-H1`** | 協調的クオラム閾値によるATP/ジュール保存 (`[M]` / `[E]`) | $\rho/\rho_K \in [0.05, 4.0]$ および閾値未満ノイズ ($\sigma = 0.25\,K$) を掃引する。$n_H \ge 2$ が $\rho/\rho_K \le 0.20$ においてレギュロンのエネルギーを $\ge 70\%$ 節約できない場合、または $n_H = 1$ と比べて誤発火を $\ge 2\times$ 削減できない場合は**反証される**。 | **存続 (`CA-M1` + `CTA-T13`)**: `95.49%` ($n_H=2$) および `99.17%` ($n_H=4$) を節約し、誤発火は `2.92x` および `11.66x` 減少した |
| **`CA-H2`** | `SepJ` 型の迅速なナノポア障害封じ込め (`[M]` / `[T]`) | 結合した $L = 20$ のフィラメントにおける単一細胞溶解を扱う。迅速な閉鎖 ($\tau_{\text{close}} \le 0.15\text{ s}$) による生存細胞の保持が $< 90\%$ である場合、またはゲートのないフィラメントの保持が $> 10\%$ である場合は**反証される**。 | **存続 (`CA-M2` + `CTA-T15`)**: 生存率は `95.0%` (`0.05 s`) および `90.0%` (`0.15 s`) であり、ゲートなしでは `0.0%` であった |
| **`CA-H3`** | `4x` 膨張下におけるトポロジカル $k \approx 7$ と距離基準 $R_0$ のスケールフリーな凝集性 (`[M]` / `[E]`) | $N \in \{64, 128, 256, 512\}$ について打撃後に `64x` の体積膨張を与える。トポロジカル `LCC` が $< 98\%$ に低下する場合、または $\xi / L \notin [0.25, 0.45]$ となる場合は**反証される**。 | **存続 (`CA-M3`)**: トポロジカル `LCC` は `100.0%` ($\overline{\xi/L} = 0.3689$) であり、距離基準 `LCC` は `0.68%-4.30%` であった |
| **`CA-H4`** | 超線形な*モジホコリ*(*Physarum*)の管剪定と領域的な効率-障害トレードオフ (`[M]`) | 不飽和領域における厳密な $\dot{D}_{ij} = |Q_{ij}|^\mu/(1+|Q_{ij}|^\mu)-D_{ij}$ を扱う。$\mu > 1$ (`1.3, 1.8`) で最短経路への流束集中が $< 99\%$ となる場合、または `16` ノードの $\mu=1.4$ で連結性が失われる場合 (`FT < 0.60`) は**反証される**。 | **存続 (`CA-M4`)**: $\mu \in \{1.3, 1.8\}$ で最短経路流束は `100.00%`、`TL/MST = 1.39`、`FT = 1.00` であった |
| **`CA-H5`** | 立証済み外部化ライブラリによる除去後の文化的ロックイン (`[M]` / `[T]`) | `30` 系統にわたり `Gen 5` で合成デモンストレータを除去する。立証済みライブラリが `Gen 20` で最適スキルの $< 99\%$ しか保持しない場合、または未検証の模倣に勝てない場合は**反証される**。 | **存続 (`CA-M5` + `CTA-T6`)**: 立証済みは `100.00%`、威信模倣は `76.25%`、未検証模倣は `29.27%` であった |
| **`CA-H6`** | マルチエージェントのコード修復における、イベント駆動型で立証済みの `DAG` による `CpJ` 優位性 (`reported_j`) | 対応するコード修復スイートでモノリシックな大規模モデルと比較する。$c_{\text{det}} < p_{\text{hit}} c_{\text{model}}$ のとき、決定論優先の異種混合 `DAG` の合格率が低い場合、または `CpJ` (`Q / reported_j`) が $\le 1.0\times$ である場合は**反証される**。 | **存続 (`CTA-E2` + `CTA-T19` から `CTA-T22`)**: `59/60` (`98.33%`) が合格 (誤コミットは `0`)、`CpJ_pkg = 0.136` に対しモノリシックは `0.065` (`2.09x`)、立証なしの4エージェントは `0.009` (`14.97x`) であった |
| **`CA-H7`** | 主体性を保つ双方向 `BCI` のスループットと作者性 (`[S]` 将来の試験) | 盲検化した人間の閉ループ `BCI` 試験を行う。意図内容の相互情報量が $\le 39\text{ bit/s}$ である場合、盲検化したユーザー対デコーダの作者性判別が $< 0.90$ である場合、または局所ゲート $g_i = 0$ が状態摂動を阻止できない場合 (漏洩許容度 `0`) は、意味的ブリッジとして**反証される**。 | **未決 (`[S]`)**: 現行の `BCIs` は読み出し `~15-19 bit/s` (`BM07`, `BM08`)、`BrainNet` は `~0.05 bit/s` (`BM16`) である。`CTA-T29` から `CTA-T31` がゲート契約を規定する |
| **`CA-H8`** | 経鼻 `EV` / セクレトーム神経補給の人間における臨床的有効性 (`[S]` 臨床) | `GMP` ロット出荷時のカーゴ測定を伴う、多施設二重盲検プラセボ対照の第II/III相ヒト `RCT` を行う。主要な臨床神経認知エンドポイントが、偽薬の経鼻ビヒクルに対して $p < 0.01$ で優越できない場合は**反証される**。 | **未決 (`[S]`)**: 監査した `16/16` 件の研究 (`EV01` から `EV16`) はげっ歯類・ブタ・in vitro の前臨床研究であり、第III相のヒト `CNS` 承認は `0` 件である |
| **`CA-H9`** | 5ホスト・クロスシリコンにおけるサブミリジュール証明およびゼロクロック起床の同等性 (`measured_j` および `reported_j`) | `aarch64` Tegra の物理シャント、`x86_64` Linux `RAPL`、`arm64` macOS `XNU`、`Windows 11 NT` にわたり、統一した Rust `BLAKE3` + `Ed25519` + OSイベントのベンチマークを行う。いずれかの独立したプロセッサレールでエッジ検証が `100 µs` または `5 mJ` を超える場合、またはゼロクロック起床が空ポーリングを排除できない場合は**反証される**。 | **存続 (`CTA-E4`)**: `p50` は `23.84-50.13 µs` (`1 KiB`)、`Jetson Thor` の `INA3221` `VDD_CPU_SOC_MSS` における **`measured_j`** は `927.30 µJ` (`reported_j` は `90.81-642.38 µJ`)、空起床は `5/5` ホストで `0.0` であった |
| **`CA-H10`** | 単独AIモノカルチャーおよび自然言語討論に対する、10陣営デジタル酵素の即時的優位性 (`measured_j` および `reported_j`) | `C1`-`C10` の単独構成と `DES-10` を比較する、`100` タスク・`5` レジームのベンチマークを行う。いずれかの単独陣営が `DES-10` 以下のジュールで合格率 `>= 80%` に達する場合、またはデジタル酵素のハンドオフが `C9` の自然言語ハンドオフに対して `>= 1,000x` のジュール/レイテンシ削減を達成できない場合は**反証される**。 | **存続 (`CTA-E5` + `CTA-T36` から `CTA-T40`)**: 単独陣営はすべて `<= 49%` であるのに対し **`98/100` (`98.0%`) の `DES-10`** (誤コミット `1%`)、`Thor` の `measured_j` `CpJ` は **`9.26x` / `26.87x` 高く**、ハンドオフは **`measured_j` が `75,374x` 低く / `78,855x` 高速**であった |

<div id="92-explicit-scope-limits-and-what-is-not-claimed" class="anchor-alias" aria-hidden="true"></div>

### 9.2 明示的な適用範囲の限界と主張しない事項

1. **厳密なハードウェア電源レールとカウンタおよびクラウド境界(`board_metered = true` は `CTA-E4`/`CTA-E5` の `Jetson AGX Thor` に厳密に限定)**: 物理的な電流シャント計測による `measured_j`(`TI INA238` の `VIN` および `INA3221` の `VDD_CPU_SOC_MSS`)は、`CTA-E4` および `CTA-E5` における CPU 専用の `NVIDIA Jetson AGX Thor` 実行に限定して主張する。`Falsifier 6` により、アクティブな `GPU` 共存プロセスが存在するため、`A2` の単一ウィンドウによるアイドル減算は差し控える。残る 4 台のフリート・ホストは `RAPL`、`ri_energy_nj`、または `NVML` による `reported_j` を報告する。`Tier 0` の `LUT6` による数値は解析的な `est_j` のままであり、遠隔クラウドの `LLM` サーバのエネルギーは `not_available` とする。
2. **目的論的生物学およびマザーツリー的擬人化の否定**: 進化的移行(`CL01` から `CL13`)は、局所的な生物物理学的相互作用に対する自然選択から生じるものである。Karst, Jones, and Hoeksema (2023) [32] に従い、共通菌根における炭素フラックスを意図的な親からのメッセージとして主張することはしない。
3. **`1` ビット `BrainNet` のフォスフェンと意味的な心の融合との同一視の否定**: 既存の多脳実験(`BM15`、`BM16`)は、約 `0.02` から `0.5 bit/s` の二値キューを伝送する。高帯域の `N` 脳接続(`BM18`)は、いまだ実証されていない将来の工学的な展望にとどまる(`[S]`)。
4. **`EVs`/分泌体に対するヒトの臨床的処方または治療効果の主張の否定**: `BTBR`/`Shank3B`、`3xTg`/`5XFAD`、`6-OHDA`、`MCAO`、`TBI` の動物モデルにおける前臨床的な改善(`EV01` から `EV16`)は、ヒト患者における安全性、用量、または臨床的有益性を立証するものではない。

<div id="93-conclusion" class="anchor-alias" aria-hidden="true"></div>

### 9.3 結論

約38億年前の細胞外小胞や約35億年前の協同的クオラム切替から、SepJシアノバクテリアのナノポア、DictyosteliumのcAMPリレー、襟鞭毛虫のVGCCカルシウム波、ムクドリの位相的群れ、ヒトの印刷・ネットワーク型アーカイブ、そして疎なMoE / マルチエージェント検証社会に至るまで、集合能力の指数的飛躍は一つの構造的不変量に従う。すなわち、**状態を共有基盤へ外部化し、取り込みを協同閾値と定数時間検証によって制御し、検証済みの発見を永続的共有メモリに固定して、後続世代が探索エネルギーを全額支払うことなく能力を継承できるようにする**ことである。この不変量をLean 4.36.0において形式化し(45個の計算機検証済み定理CTA-T1からCTA-T45)、76年間の人工知能(AI01からAI38)を同一の演算子へ写像し、事前登録されたシミュレーション(CA-M1からCA-M5)および5ホストの物理的シャント・カウンタのベンチマーク(CTA-E1からCTA-E5)を実行した結果、進化的統合は検証可能な三つの工学仕様へと帰着する。すなわち、即時的な十パラダイムのデジタル酵素的合成(DES-10、検証済み合格率98%、CpJが9.26倍から27.13倍)、月・四半期・年・十年の四つの時間尺度にまたがる閉ループ四段階下向きコンパイル(HM01からHD04)、そして将来の協働的神経技術を強制的同化から分離するハードウェア強制のオプトイン型主体性ゲート($g_i = 1$)である。

---

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

*透明性およびデータベース検証注記：生医学、進化、行動、および神経技術引用（`[1]`-`[50]`）は、Europe PMCオープンアクセス文献API（`europepmc_api.py`）および一次`DOI`/`PMID`記録（`verified_references.json`）を介して検証された；歴史的および現代的人工知能引用（`[51]`-`[90]`）は、ライブCrossRef（`31/31` `DOIs`）およびarXiv Atom（`15/15` プレプリント）メタデータ監査（`verified_crossref_audit.json`、`verified_arxiv_audit.json`）に対して検証された。*

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
