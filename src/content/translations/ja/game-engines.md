---
title: "ゲームを一度書いてどこでも動かす：厳密な再生が終わり許容誤差が始まる境界"
deck: "ゲームを1度だけチェック済み状態機械として記述し、複数のエンジン、命令セット、グラフィックススタックへ射影することは可能か。Q32.32整数物理演算下で25のマルチISAターゲット×ホストセルにおいて100,000ティック実行し（GE-H1: 0/20,500 SHA-256不一致（arm64 macOS、aarch64 Linux、AMD/Intel x86_64 Linux））、25,000回のクロスISA浮動小数点ティック（GE-H2: t_div = 10 Apple libm対GNU glibc sin/cos、t_div = 406 x86_64 FMA対arm64 fmadd（-ffast-mathなし））、およびMetalとVulkanに跨る4つの物理GPU（GE-H3: 1.3%-9.3% LSBピクセルドリフト、Δ_max ≤ 2、PSNR 64.2-72.1 dB、SSIM ≥ 0.99983）で検証され、遊べるジュール予算型Q32.32 WebXR/Canvasプロトタイプと対になっている。"
lang: "ja"
source: "game-engines"
complete: true
---

<div id="writing-a-game-once-and-running-it-everywhere-where-exact-replay-ends-and-tolerance-begins" class="anchor-alias" aria-hidden="true"></div>

*改訂 af57f48、2026年11月22日。対話型エクスプローラ、クロスGPU検査器、および操作可能な `Q32.32` Chrono-Budget Arena: [research.openie.dev/living/game-engines/](/living/game-engines/)。*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 要約

本研究は、検査済み状態機械として一度だけ記述されたゲームを、言語、中央処理装置（CPU）命令セットアーキテクチャ（ISA）、およびグラフィックス処理装置（GPU）バックエンドにわたって射影できるかどうかを問うものである。調査した仕様および3つの実行された経験的反証スイートは、いずれも明確な境界を示している：ゲーム規則および固定小数点整数演算で固定されたシミュレーションについては**肯定**（`(GE-H1)`：`0 / 20,500`個のSecure Hash Algorithm 256ビット（`SHA-256`）チェックポイント不一致が、`100,000`ティックの16物体2次元アリーナを`25`個のターゲット×ホストセルにわたって`arm64` `macOS 27.2.1`、`aarch64` `Linux 6.8`、およびAdvanced Micro Devices（`AMD`）Zen 5とIntel Raptor Lake `x86_64` `Linux 7.0`に射影した結果、`macOS`プロセスごとの`reported_j`で`0.073 J`から`13.60 J`、`Linux` Running Average Power Limit（`RAPL`）パッケージ`reported_j`で`1.89 J`から`181.87 J`の範囲）；ピン留めされていない浮動小数点超越関数または融合積和（`FMA`）低レベル化が混沌とした多物体衝突に入る場合には**否定**（`(GE-H2)`：`-ffast-math`を*使用しない*場合でも、Apple `libSystem` `libm`対Linuxシステム`glibc`の`std::sin`/`std::cos`がティック`10`で発散し、クロスISAの`x86_64` `-mavx2 -mfma`対`arm64` `fmadd`がティック`406`で発散し、V8 `Math.sin`がISA間でティック`66`で発散する）；GPUベンダー間のビット完全な画素については**否定**であるが、有界一方向許容ゲートの下では**肯定**（`(GE-H3)`：Apple `Metal`、`AMD` Mesa Radeon Vulkan（`RADV`）、Nvidia Vulkan（`NVIDIA`）、およびIntel Mesa Vulkan（`ANV`）にわたる`512×512` `RGBA8Unorm`で、`24 / 24`のクロスGPUフレーム対のうち生`SHA-256`で`1.30%`-`9.34%`の画素が異なるが、最大チャネルごと誤差$\Delta_{\max} \le 2 / 255$、ピーク信号対雑音比（`PSNR`）`64.16`-`72.06 dB`、および構造的類似性（`SSIM`）`0.99983`-`0.99999`を維持し、`measured_j = None`および`board_metered = false`である）。

**平易な言葉で**

1. **整数固定演算の場合、チップおよび言語をまたいだ厳密なシミュレーションは機能する。** `100,000` ティック（`20,500` 個の検証済み `SHA-256` チェックポイント）を超える範囲で、ネイティブ Rust、C++20（`Clang` および GCC）、WebAssembly（`Wasm`）、JavaScript `BigInt`、Python が、Apple Silicon（`arm64`）、NVIDIA Jetson Thor（`aarch64`）、AMD Zen 5（`x86_64`）、Intel Raptor Lake（`x86_64`）の各環境において、732 バイトの状態をビット単位で完全に同一に再現し、不一致はゼロであった。
2. **標準浮動小数点物理演算は、`-ffast-math` を用いなくともオペレーティングシステムおよび CPU ファミリ間でドリフトする。** 純粋代数的な `+`、`-`、`*`、`/` および `sqrt` を FMA 無効化（`-ffp-contract=off`）で用いた場合、`x86_64` と `arm64` の間で `25,000` ティックすべてにおいて一致するが、`std::sin`/`std::cos` を macOS `libm` と Linux `glibc` で呼び出すとティック `10`（`60 Hz` で `0.17 s`）でビットが反転し、ティック `9,798`（`163.3 s`）でゲームプレイスコアが非同期化する。一方、デフォルトの FMA 縮約を有効化（`-ffp-contract=fast`）すると `x86_64` と `arm64` の間でティック `406` で発散し、ティック `11,205` でゲームプレイが非同期化する。
3. **グラフィックスカードは同一のビットを描画しないため、レンダリングは一方向の許容誤差ゲートの下流に置くべきである。** Apple `Metal`、AMD `RADV` Vulkan、NVIDIA Vulkan、Intel `ANV` Vulkan の間で、`1.3%` から `9.3%` のピクセルが `1` から `2` LSB だけ異なる。このため、素朴なフレームバッファ `SHA-256` チェックは破綻するが、知覚的許容範囲（`PSNR > 64 dB`、`SSIM > 0.9998`）は満たされる。なぜなら、GPU 値がシミュレーション状態に逆流することはないからである。

![提案された分割の図。上の箱にはゲームの Form P = S, E, delta, D, lambda が入っており、型付けされたインタフェーススキーマと厳密なチェッカーを備える。矢印は 4 つの射影へ分岐する：左側の厳密領域にあるシミュレーション（Rust、WebAssembly、XState、SCXML、Python）およびスクリプティング（Rhai、Lua、Luau）はティックごとの状態ハッシュで判定され、右側の許容領域にあるシーン（BSN 類似、glTF、OpenUSD）およびレンダリング（Slang、WGSL、WESL）はピクセルごとの誤差で判定される。破線の垂直線が決定論的境界を示す。下部の帯には、ログ化されたイベントとしてのみ入力されるホスト効果（入力、クロック、オーディオ、ネットワーク、アセット入出力、GPU 描画、化粧的物理演算）が列挙されている。](/figures/game-engines/architecture.svg)

図 1. 提案された分割。一つの Form が四つの射影に供給される。シミュレーションおよびスクリプティングは厳密領域に位置し、ティックごとの状態ハッシュで判定される。シーンおよびレンダリングは許容領域に位置し、ピクセルごとの誤差で判定される。ホスト効果はログ化されたイベントとしてのみ入力される。

![11 の既存表現を行とし（Slang、Naga、WGSL および WESL、glTF、OpenUSD、BSN、SCXML および XState、VGDL、GameRule、nAIVE、SpacetimeDB）、7 つの能力列（挙動、シーン、シェーダ、実行順序、マルチターゲット、リプレイログ、クロスレイヤ検査）を持つグリッド。緑のセルは文書化された能力、琥珀色は部分的、灰色は欠如または未文書化を示す。クロスレイヤ列は Slang と nAIVE の部分的印を除きすべて灰色である。](/figures/game-engines/coverage.svg)

*図2. 本研究で読み込んだ文書のみに基づいて採点した既存表現の網羅状況。緑: 文書化された能力。黄: 部分的。灰: 不在または未文書化。最右列の層間検査は、ほぼ空白である。*

<div id="1-terms-notation-and-the-idea-under-test" class="anchor-alias" aria-hidden="true"></div>

## 1. 用語・記法、及び検証対象の概念

<ul id="terms">
<li>RCE, IR, ECS, FSM, SDF: 現実コードエンジン[同一家], 中間表現, エンティティコンポーネントシステム, 有限状態機械, 符号付き距離場</li>
<li>CPU, GPU, ISA, ISAs, SIMD, AVX2, NEON, SFU, ROP, RPL: 中央処理装置, グラフィックス処理装置, 命令セットアーキテクチャ(群), 単一命令複数データ, Advanced Vector Extensions 2, Arm Advanced SIMD, 特殊関数ユニット, ラスター演算パイプライン, Intel Raptor Lakeモバイルアーキテクチャ</li>
<li>IEEE, FMA, VFMADD, VFNMADD, FMADD, FMSUB, ULP, LSB, SHA, MAE, RMSE, PSNR, SSIM, SD, RGBA8: Institute of Electrical and Electronics Engineers (IEEE 754浮動小数点におけるもの), 融合積和演算, x86_64ベクトル融合積和および否定積和オペコード, AArch64スカラー融合積和および積減算オペコード, 最終桁単位, 最下位ビット, Secure Hash Algorithm (`SHA-256`), 平均絶対誤差, 二乗平均平方根誤差, ピーク信号対雑音比, 構造的類似性指標, 標準偏差, および8ビット毎チャネル赤緑青アルファフレームバッファ形式</li>
<li>WGSL, WESL, SPIR-V, GLSL, HLSL, MSL, D3D11, D3D12, CUDA: WebGPUシェーディング言語, WebGPU拡張シェーディング言語, Standard Portable Intermediate Representation V, OpenGLシェーディング言語, High-Levelシェーディング言語, Metalシェーディング言語, Direct3D 11, Direct3D 12, およびCompute Unified Device Architecture</li>
<li>RADV, ANV, LLVM, GNU, GCC, PE, OS, API, APIs, WebXR, WebMCP, URL, JSON, YAML, README, MB, CS0246, RE, ENGINE, DFU: Mesa Radeon Vulkanドライバ, Mesa Intel Vulkanドライバ, Low Level Virtual Machineコンパイラ基盤, GNU's Not Unixプロジェクト, GNU Compiler Collection, Windows Portable Executable, オペレーティングシステム, アプリケーションプログラミングインタフェース(群), Web拡張現実API, Web Model Context Protocol, Uniform Resource Locator, JavaScript Object Notation, YAML Ain't Markup Language, リポジトリREADME文書ファイル, メガバイト, C#コンパイラ欠落型診断CS0246, Capcom RE ENGINE ("Reach for the Moon" / "RE neXt"エンジンブランディング), およびDagstuhl Follow-Ups DOI接頭辞</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG: State Chart XML, Game Description Language, Video Game Description Language, Bevy Scene Notation, Boldsea Semantic Language, Multi-Level Intermediate Representation, 原子性/一貫性/隔離性/永続性トランザクション, Good Game Peace Outロールバックネットワークライブラリ, Graphics Language Transmission Format (ISO/IEC 12113:2022), Open Universal Scene Description, Universal Scene Description, ローカルエリアネットワーク, 人工知能, およびComputational Intelligence and Games</li>
<li>SATB、RAPL、MSR、PID、RUSAGE、V6、AMD、NVIDIA、V100、GH200、CTC: Satiation Tiered Benchmark のテレメトリ水準（`L2` ソケット/パッケージ・カウンタ、`L3` プロセス単位のカーネル・カウンタ）[同一機関]、Running Average Power Limit、機種固有レジスタ（model-specific register）、プロセス識別子（process identifier）、`proc_pid_rusage`（`RUSAGE_INFO_V6`）、Advanced Micro Devices、NVIDIA Corporation、Volta V100 GPU、Grace Hopper GH200 スーパーチップ、および閉じた時間的曲線</li>
</ul>

前方参照を上から下へ明瞭に保つために、セクション1ではForm表記を定義し、セクション2では既存のゲーム表現を概観し、セクション3では浮動小数点の発散を分析し、セクション4では中間表現を表として示し、セクション5では提案されたレイヤ分割を述べ、セクション6ではマルチISAおよびクロスGPU偽装実行を報告し、セクション7では実現不可能フラグを列挙し、セクション8では情報源と制限を文書化する。

[Reality Code Engine（RCE）](https://research.openie.dev/about/rce/) はプログラムをFormと呼ばれる状態機械として取り扱い、$P = (S, E, \delta, D, \lambda)$ と表記する。

- $S$: 状態の集合；
- $E$: イベント（入力）の集合；
- $\delta : S \times E \to S$: 遷移関数；
- $D$: 取られたすべてのステップを追記専用で記録するログ；
- $\lambda$: 状態から観測可能な出力への写像。

厳密なチェッカはFormを受理するか、違反した規則を指摘する。エミッタは受理されたFormをRust、Python、JavaScript、Scalaに射影する。XState（JavaScriptおよびTypeScript用のステートチャートライブラリ）、SCXML（World Wide Web Consortium勧告）、WebAssembly（`Wasm`）はエミッタの対象には含まれず、本研究ではそれらを候補射影として扱う。すべてのステップが$D$に記録されるため、任意の実行は再現可能である。

ゲームエンジンははるかに大規模な機械である。固定ステップのシミュレーション、スクリプト層、シーン記述、そしてGPU上のレンダリングパイプラインを実行する。セクション1〜8では、これらの層のうちどれがForm内部に収容でき、どれがホスト効果として外部に留まるべきか、そして正確性が許容誤差に譲らねばならない場所を問う。

この概念は長い系譜を有する。スタンフォード大学の[ゲーム記述言語（GDL）仕様](http://ggp.stanford.edu/readings/gdl_spec.pdf)は「有限で離散的な決定論的マルチプレイヤーゲーム（完全情報）」を扱い、自然な基底モデルが「有限状態機械」であることを指摘している。ゲームエンジンにおいて新しいのは状態機械そのものではなく、その周辺すべて, 浮動小数点物理、スクリプト、シーン、GPUである。

<div id="2-what-the-landscape-shows" class="anchor-alias" aria-hidden="true"></div>

## 2. 先行研究の概観が示すもの

<div id="21-game-logic-as-data-already-works-on-one-backend" class="anchor-alias" aria-hidden="true"></div>

### 2.1 データとしてのゲームロジックはすでに機能し、単一バックエンド上で動作する

GameRule ([Multimedia Systems 32:564, 2026](https://doi.org/10.1007/s00530-026-02629-8)) は、14 個の作成・読み取り・更新・削除アクションと 6 つの条件にわたるアクターごとの *when-do* ルールとして振る舞いを表現する。その決定論的契約は具体的であり、単一の FixedUpdate から実行される中心スケジューラが宣言順に走り、最後の書き込みが優先され、生成と削除は走査の末端に延期される。著者らは Unity のマニュアルを引用し、スクリプト実行順序は「ビルド間、マシン間、Unity バージョン間で保証されない」として契約を正当化している。

3 つの Unity サンプルゲーム（Haunted Jaunt、Survival Shooter、Tanks）において、振る舞いコードは 572 行から 107 行へと縮小し（-81.3%）、大幅な削減が示された。

費用は測定された。ルール解釈は 1 アクターあたりステップごとに約 $c \approx 65\ \mu\text{s}$ のコストがかかる。ステップ予算 $T = 20$ ms では、アクター上限は

$$N_{\max} = \frac{T}{c} = \frac{20\ \text{ms}}{65\ \mu\text{s}} \approx 308,$$

となり、論文の観測（200 から 350 アクターで予算超過、350 アクターで 23.872 ms）と一致する。現在は Unity バックエンドのみが存在し、エンジン間の移植性は主張されているが実証はされていない。

<div id="22-order-of-execution-can-be-made-deterministic-by-construction" class="anchor-alias" aria-hidden="true"></div>

### 2.2 実行順序は構築によって決定論的にできる

ECSパターンは、ゲーム状態をエンティティ識別子に紐付けられたコンポーネントとして格納し、それらに対するシステムとして振る舞いを実行する。Redmond, Castello, Calderón TrillaおよびKuperはこれに形式モデルCore ECSを与えている([arXiv:2508.15264](https://arxiv.org/abs/2508.15264))。彼らは、同時実行される任意の変異ペアが可換であるスケジュールは決定論的であること、および互いに素なコンポーネントラベルの集合に書き込む2つのサブスケジュールは結果を変えることなく並列に実行できることを証明している。Bevy ECS, EnTT, Flecs, Specsおよびapecsを調査した結果、いずれも新たなコンポーネントを他の変異と同時に付加することを許容しないことを見出した。このような構造的変更は遅延され、逐次的に適用される。TasnimとZhao([SAC 2026, doi:10.1145/3748522.3779910](https://doi.org/10.1145/3748522.3779910))は、アーキタイプECSに対する操作的意味論と型システムを追加し、各システムごとの読み書き集合を追跡する。彼らは、並列アーキタイプ配置がオブジェクト指向ベースラインの36.13フレーム毎秒に対して109.54フレーム毎秒に達したタワーディフェンスシミュレーションについて報告している。GameRuleの遅延生成と削除は、これと同一の規律であり、独立に到達したものである。

<div id="23-compiling-is-not-the-same-as-being-right" class="anchor-alias" aria-hidden="true"></div>

### 2.3 コンパイルできることは正しいことと同じではない

Mageベンチマーク（[arXiv:2605.07342](https://arxiv.org/abs/2605.07342)）は、26種のUnityメカニクス・パターンにわたる858回の生成試行を実施した。IRを与えない場合、出力の43%が実行時テストに合格したが、メカニズムF1（要求されたメカニクスと実装されたメカニクスの一致度）は約0.12にとどまった。IRを条件として与えると、実行時合格率は14%から21%に低下した一方、メカニズムF1は0.82から1.00に上昇した。コンパイル成功率は機能的正しさと負の相関を示した。欠落型エラーであるCS0246は、IR条件下では469回出現したが、IRを与えない場合にはゼロ回であった。振る舞いのみを記述するIRと、シーン全体を記述するIRは統計的に区別できなかった（McNemar p = 1.0）。RCEへの含意は次のとおりである。「コンパイルが通ることのみを証明する」検査器は誤った量を測定している。インターフェースの検査は振る舞いに基づくものでなければならない。

<div id="24-public-benchmarks-with-replayable-traces-exist" class="anchor-alias" aria-hidden="true"></div>

### 2.4 再生可能なトレースを持つ公開ベンチマークが存在する

GameCraft-Bench ([arXiv:2606.17861](https://arxiv.org/abs/2606.17861); [リポジトリ](https://github.com/FreedomIntelligence/gamecraft-bench)) は、15 ファミリーにわたる 140 の Godot 4 二次元タスクを提供している。提出物は再生可能な入力トレースを伴う。論文での最も強力なエージェントは 41.46% のスコアを獲得し、リポジトリは後に 65.70% を報告している。Unity、Unreal、3D、マルチプレイヤー、あるいは大規模物理シーンはカバーされていない。 [Summer Engine](https://www.summerengine.com/templates) は、ラリー、プラットフォーマー、タワーディフェンス、メトロイドヴァニア、サバイバーズ、ファーストパーソンシューター、LAN マルチプレイヤー、ボクセルなど、17 のオープンソースゲームテンプレートを公開している。General Video Game AI フレームワークとその VGDL ([arXiv:1802.10363](https://arxiv.org/abs/1802.10363)) は、スプライト、インタラクション、終了条件、レベルマッピング集合で定義された 120 のシングルプレイヤーゲームと 60 の二人プレイヤーゲームを提供している。

<div id="25-convergence-across-industry-and-research" class="anchor-alias" aria-hidden="true"></div>

### 2.5 産業界と研究における収束

複数の取り組みが同じ形状へと収束しつつある：宣言的なシーンおよびパイプラインファイル、サンドボックス化されたスクリプティング層、現代的なシェーダ言語、そしてイベントログである。

- [nAIVE](https://github.com/poro/nAIVE)は`wgpu`を基盤としたRustで構築されており、ECS（hecs）、YAMLによるシーン・材質・レンダパイプライン、Lua 5.4によるエンティティごとのサンドボックス化、SlangシェーダをWGSLへクロスコンパイルしたもの、Rapier物理演算、YAMLスキーマ検証付きイベントバス、およびヘッドレステストランナーを備えている。その[サイト](https://naive.dev/)では92行のYAMLファイルで5パス遅延パイプラインを宣言する例を示している。READMEにはGPUコンピュートシミュレーションによる5万超のエンティティ駆動についても記述されており、これは次に示す境界の許容誤差側にシミュレーションを置く選択である。
- CapcomはREX（「RE neXt Engine」）を、約200名のエンジニアが関わるRE ENGINEの段階的進化として説明している（[Capcom IR](https://www.capcom.co.jp/ir/english/data/oar/2025/re-engine.html)）。報道（[PC Gamer](https://www.pcgamer.com/gaming-industry/game-development/capcom-announces-plans-to-transform-its-re-engine-into-an-ai-generation-game-engine/)）によれば6つのプログラムがあり、その中に異なる種類のデータを共通の規則集合へ翻訳するRe:Doxや、ゲームメカニクスのアイデアを標準化されたプログラミング言語へ変換するRE:Flowsが含まれる。また、2,000名超の人員がRE Engineを使用しているとも報じられている。
- BevyのBSN提案（[discussion 14437](https://github.com/bevyengine/bevy/discussions/14437)）は、シーンを合成可能なPatch、EntityPatch、DynamicScene値として定義し、`bsn!`マクロとアセット形式を提供する一方で、イベントハンドラについては未解決のままとしている。
- [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB)は、ゲームロジックをリデューサとして実行し、これをACIDトランザクションとしてテーブル上で処理するとともにコミットログを再生する。これはRCEログ$D$の別名である。
- Executable Ontologies（[doi:10.48550/arXiv.2601.07964](https://doi.org/10.48550/arXiv.2601.07964)）は、追記のみの不変イベントグラフ上でBSLによりゲーム挙動をモデル化する。同論文は、物理演算・レンダリング・アニメーションは従来の高周波アプローチを維持しつつ、クエストや決定はイベントグラフ上で実行し、集約イベントを通じて結合するというハイブリッドを推奨している。これは本稿で提案する層分割と同一である。

<div id="3-the-physics-of-divergence-why-exactness-is-binary" class="anchor-alias" aria-hidden="true"></div>

## 3. 発散の物理学: 厳密性がなぜ二値的なのか

浮動小数点加算は結合則を満たさない。並列ハードウェア上では、リダクションの順序が実行ごとに変動しうる。浮動小数点の非結合性を並列ハードウェア上で調べた研究([arXiv:2408.05148](https://arxiv.org/abs/2408.05148))は、スカラー変動量を次式で定義している。

$$V_s = 1 - \left| \frac{f_{nd}}{f_d} \right|,$$

ここで $f_d$ は決定的リダクション、$f_{nd}$ は非決定的リダクションの結果である。倍精度の正規分布に従う $10^6$ 個の値の総和について順序を入れ替えたところ、結果は最大で約 $4.26 \times 10^{-13}$ 変化し、最大の $|V_s|$ は $\sqrt{n}$ に比例して増大した。NVIDIA V100 上では、決定的なツリー型リダクションのコストは原子的累積に対して約 0.2% であり、GH200 上では最大 7.8% に達した。1,000 回のグラフネットワーク学習実行では、すべての実行が互いに異なる重みを生成した。

ゲームは、このような微小な差異を目に見える差異へと増幅する。剛体接触や多体力学は典型的にカオス的である。局所リアプノフ指数 $\Lambda$ の下では、摂動は次式に従って増大する。

$$\delta(t) = \delta_0 \, e^{\Lambda t},$$

したがって、摂動がゲームプレイ上知覚可能な大きさ $\Delta$ に達するまでの時間は次式で与えられる。

$$t^{*} = \frac{1}{\Lambda} \ln\frac{\Delta}{\delta_0}.$$

*例示的モデル:* $\delta_0 \approx 6 \times 10^{-8}$(単精度の相対的な 1 ULP)、$\Delta = 1$(壁の反対側にある物体)、仮定した $\Lambda = 2\ \text{s}^{-1}$ を取る。このとき $t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ s となる。ここで重要なのは対数である。$\delta_0$ を百万分の一に縮小しても、得られる時間の延長は約 6.9 s にすぎない。したがって、近似的な一致によってシミュレーションを救済することはできない。状態は、ビット単位で完全に同一であるか、さもなければやがて発散するかのいずれかである。この予測は、以下の 25,000 回のマルチ ISA 衝突ティックにわたって直接検証する(`GE-H2`)。

実践もこの見方と一致している。[Gaffer On Games](https://gafferongames.com/post/floating_point_determinism/) は、機器間の決定性にはコンパイラと命令セットの一致が必要であること、Battlezone 2 では AMD と Intel の間で超越関数の差異に直面したこと、MotoGP のリプレイは Xbox と個人用コンピュータの間で共有できなかったことを記録している。また、FMA の縮約と再結合を禁止すべきとする Markstein の助言を引用している。[Rapier ガイド](https://rapier.rs/docs/user_guides/rust/determinism/) は、動作する方法を示している。すなわち、クロスプラットフォームの決定性は、`enhanced-determinism` 機能(`simd8` とは非互換)を用い、IEEE 754-2008 対応のターゲット(Wasm は該当する)上で、ソフトウェアによる超越関数を使用する場合にのみ成立する。

レンダリングにおいて、[WGSL 仕様](https://www.w3.org/TR/WGSL/)は「WGSL は特定の機能に対して複数の可能な挙動を許容することがある。これは移植性上の危険である」と述べている。その浮動小数点セクションはさらに「WGSL は丸めモードを指定しない」「実装は演算を再結合できる」「変換後の式が元の式と同等かそれ以上に正確である場合、演算を融合できる」「多くの演算のサブノーマル入力および出力はゼロにフラッシュされる可能性がある」とし、`fma` ビルトインは「通常の乗算 ... と加算に展開される可能性がある」と記述している。したがってピクセルの結果は実装間で異なることが規定されている。[SPIR-V 仕様](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html)はより限定的な手段を提供し、その `NoContraction` デコレーションは「他の命令と組み合わせて単一の操作を形成することができない」算術命令を示し、これらの操作は再結合が許可されないと規定している。これはバックエンドごとの単一命令に対する保護であり、シェーダ全体に対する移植性の保証ではない。

<div id="4-the-ir-table" class="anchor-alias" aria-hidden="true"></div>

## 4. IR表

| 表現形式 | 層 | 文書化された最も強い性質 | Form に必要だが欠けている要素 |
|---|---|---|---|
| [Slang](https://shader-slang.org/) | シェーダ | モジュール IR; D3D12, Vulkan, Metal, D3D11, OpenGL, CUDA, WebGPU, CPU 向けバックエンド; capability システム | ゲーム状態がなく、イベントもなく、浮動小数点に関する厳密意味論の保証もない |
| [Naga](https://github.com/gfx-rs/wgpu/tree/trunk/naga) | シェーダ | 検証済み IR; 入力は WGSL, SPIR-V, GLSL; 出力は SPIR-V, WGSL, MSL, HLSL, GLSL | 上記と同様; シーンスキーマとの連携がない |
| [WGSL](https://www.w3.org/TR/WGSL/) / [WESL](https://wesl-lang.dev/) | シェーダ | 一様性解析; WESL はインポート, 条件付きコンパイル, パッケージ, `wgsl-test` を追加 | 再結合, 融合, flush-to-zero を許容する; ホスト側の型がない |
| [SPIR-V](https://registry.khronos.org/SPIR-V/specs/unified1/SPIRV.html) | シェーダバイナリ IR | NoContraction デコレーションにより命令単位で融合と再結合を禁止できる | 命令単位に限られる; ゲーム意味論がない |
| [MLIR](https://mlir.llvm.org/) | コンパイラ基盤 | 段階的な lowering のための多層 dialect | ゲームモデルではない; 意味論は各 dialect に委ねられる |
| [glTF 2.0](https://www.khronos.org/gltf/) (ISO/IEC 12113:2022) | アセットとシーン | ツール間で用いられる交換標準 | 振る舞いがなく、実行順序もない |
| [OpenUSD](https://openusd.org/release/intro.html) | シーン | コンポジション・アーク, 名前空間パス | 自己記述として「Not a rigging system」であり、シミュレーション意味論がない |
| [BSN](https://github.com/bevyengine/bevy/discussions/14437) | シーン | コンポーネントに対する型付きパッチ, バージョン管理されたインポート | イベントハンドラが未解決; Bevy 限定 |
| [SCXML](https://www.w3.org/TR/scxml/) / [XState](https://stately.ai/docs/xstate) | 振る舞い | マイクロステップおよびマクロステップの意味論, 文書順による優先度, 直列な並列領域 | データモデルがプラットフォーム固有である; 数値的な規律がなく、シーンやシェーダも扱わない |
| [GDL](http://ggp.stanford.edu/readings/gdl_spec.pdf) | ルール | 有限・離散・決定論的ゲームの論理的記述 | 連続的な物理演算がなく、描画もない |
| [VGDL](https://arxiv.org/abs/1802.10363) | ルール | コンパクトな 2 次元グリッドゲーム, 大規模な公開コーパス | 2 次元グリッドに限られる; 描画や物理的忠実度がない |
| [Core ECS](https://arxiv.org/abs/2508.15264) | 実行順序 | 決定論的な並行スケジュールが成立するための条件を与える定理 | 形式モデルであり、エンジン形式ではない; シーンやシェーダを扱わない |
| [GameRule](https://doi.org/10.1007/s00530-026-02629-8) | ルール | 決定論的スケジューラの契約, 計測されたコード削減効果 | Unity 限定; アクターあたり約 65 µs; 形式的な検証器がない |
| [nAIVE](https://github.com/poro/nAIVE) | エンジン全体 | YAML によるシーンとパイプライン, Lua, Slang, イベントスキーマの検証 | 公開された形式的意味論がなく、層を横断する型検査もない |
| [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) | サーバロジック | トランザクションとしてのリデューサ, コミットログの再生 | サーバ側に限られる; クライアントの描画やシーンを扱わない |

<div id="5-proposed-architecture" class="anchor-alias" aria-hidden="true"></div>

## 5. 提案されたアーキテクチャ

<div id="51-layer-split" class="anchor-alias" aria-hidden="true"></div>

### 5.1 レイヤ分割

1. **シミュレーション形式（厳密）.** $S$ は固定小数点または厳密な IEEE 754 値を保持し、FMA および再結合を無効化し、超越関数は整数または固定されたソフトウェアルーチンで実装される。$E$ はティックイベントと記録された入力を保持する。$\delta$ は SCXML マクロステップ意味論を用いる：各ティックごとに、キュー順序でイベントを処理し、文書順序で競合を解決し、並列領域を直列に実行する。コレクションは宣言された順序で反復し、GameRule の契約（宣言順序、最終書き込みが勝つ、構造的変更はティックの終了まで遅延）に従う。並列性が求められる場合、チェッカーは Core ECS の非交差条件を満たすスケジュールのみを許容する。
2. **スクリプティング射影（厳密）.** デザイナースクリプトは $S$ 上のガードおよびアクションにコンパイルされ、[Rhai](https://rhai.rs/book/about/features.html)（サンドボックス化され、「Don't Panic」保証、no-std および Wasm 対応）、Lua、または [Luau](https://luau.org/)（デフォルトでサンドボックス化され、段階的型付けを持つ）として出力される。スクリプトは宣言されたアクションを通じてのみ $\delta$ を呼び出せる。時計、ランダムソース、または GPU 結果を直接読み取ることはできない。
3. **シーン射影（下流で許容誤差）.** $\lambda$ は $S$ を BSN 類似のパッチツリーに写像し、その構成要素スキーマは Form の一部である。glTF および OpenUSD はアセットのエクスポート対象として機能する。
4. **レンダリング射影（許容誤差）.** マテリアルおよびパスは Slang または WGSL で記述され、Slang または Naga を介して Metal および Vulkan バックエンドに出力される。レンダリングは $\lambda(s)$ の純粋関数である。GPU 結果が $S$ に逆流することはない。

<div id="52-inside-the-form-versus-host-effects" class="anchor-alias" aria-hidden="true"></div>

### 5.2 形式の内側と外部ホスト効果

内側には、状態、遷移、規則の順序、ゲーム上重要な物体に対する不動点物理、シード $S$ を持つ乱数生成器、インターフェース・スキーマが含まれる。外側には、入力デバイス、壁時計時刻、ネットワークパケット、音声出力、アセットの入出力、GPU描画、そして見た目のみに用いられるサードパーティ製物理演算などが、ログされるイベントとして扱われる。再生時には、デバイスに触れることなく、記録された $D$ を $\delta$ に与え直す。記録に要する記憶コストは小さい。ティックレート $f_{\text{tick}} = 60$ Hz、ティックあたりの入力 $b = 16$ バイトとすると、ログは $f_{\text{tick}} \cdot b = 960$ B/s の速度で増加し、1時間あたり約3.5 MBとなる。

<div id="53-determinism-boundary" class="anchor-alias" aria-hidden="true"></div>

### 5.3 決定論的境界

- **厳密ゾーンの基準:** 対象AおよびBの任意のティック$t$について、$H(s_t^A) = H(s_t^B)$が成立しなければならない。ここで$H$は$S$の正準直列化に対する暗号学的ハッシュである。
- **許容誤差ゾーンの基準:** 同一の$s_t$から得られた描画フレーム$I^A$と$I^B$について、チャンネルごとの誤差が$\varepsilon$を超える画素の割合は$p_{\max}$を超えてはならない。これに、有界な構造類似度(`SSIM`)とピーク信号対雑音比(`PSNR`)の下限を併用する。第6.3節では、この較正を4種のGPUアーキテクチャ(`Metal`、`RADV` Vulkan、`NVIDIA` Vulkan、`ANV` Vulkan)にわたって実施する。
- [GGPO](https://github.com/pond3r/ggpo)に代表される、入力予測と投機的実行に依拠するロールバック型ネットワーキングは、この境界の厳密側においてのみ有効である。

<div id="54-cross-layer-interface-checking" class="anchor-alias" aria-hidden="true"></div>

### 5.4 クロスレイヤインタフェース検査

チェッカは、任意のエミッションの前に4種類の型付きエッジを検証する：(a) スクリプトからシミュレーションへ：すべてのアクションが、引数型が一致する宣言済み遷移を指名すること；(b) シミュレーションからシーンへ：$\lambda$の出力がコンポーネントスキーマに一致すること；(c) シーンからレンダリングへ：すべてのマテリアルバインディングが、互換性のある型、グループ、およびバインディングインデックスを持つSlangまたはWGSLリソースに一致すること；(d) イベントカバレッジ：スクリプトがリッスンするすべてのイベントが、何らかの遷移またはホストソースによって生成可能であること。Mageの発見（2.3節）が、エッジ検査をコンパイル成功ではなく動作トレースによって判定する理由である。

<div id="6-falsifier-first-test-plan-and-executed-multi-isa--cross-gpu-results" class="anchor-alias" aria-hidden="true"></div>

## 6. フォルスファイア先行テスト計画と実行されたマルチISA/クロスGPU結果

各仮説はその排除基準とともに列挙されている。基準が満たされた場合、該当する主張は取り下げられるである。サブセクション 6.1 から 6.4 は、実行された三つの実証的フォルスファイアスイート（`GE-H1` マルチISA `Q32.32` リプレイが 25 のターゲット × ホストセルにまたがる、`GE-H2` クロスISA 浮動小数点ドリフトが `x86_64` と `arm64`/`aarch64` にまたがる、`GE-H3` クロスGPU ヘッドレス `wgpu` レンダリング許容誤差が Apple `Metal` および AMD, NVIDIA, Intel `Vulkan` にまたがる）と、インタラクティブなジュール予算付き `Q32.32` プロトタイプ（`GE-H4` から `GE-H9` は未完成である）を報告するである

| ID | 仮説 | 検証コーパス | 測定量 | 棄却基準 | 状態 |
|---|---|---|---|---|---|
| GE-H1 | シミュレーション射影は、言語、OS、CPU ISA をまたいでビット単位で同一である | `arm64` macOS、`aarch64` Linux、AMD/Intel `x86_64` Linux 上の 16 体 2D アリーナ Form (`Q32.32` 固定小数点、`732` バイト状態) | Rust、Wasm32、C++20 (`Clang`/`GCC`)、Node.js `BigInt`、Python 3 における $10^5$ ティックにわたる $H(s_t)$ (`25` セル) | 任意の `(host, target)` セルの任意のチェックポイントでハッシュが 1 件でも不一致となること | **実施済み (`0 / 20,500` 件の不一致、6.1節)** |
| GE-H2 | 厳密モードと、ISA をまたぐ浮動小数点の境界および ライブラリ/FMA のドリフト | 16 体 2D カオス的アリーナ (`arm64` macOS、`aarch64` Linux、AMD/Intel `x86_64` Linux をまたぐ `25,000` ティック) | 厳密 `f64`、OS 間 `libm` の `sin/cos`、ISA 間 `FMA`、V8 `Math.sin`、`f32` における正確な発散ティック `t_div` | 固定された代数的算術の下での想定外の不一致、または予測されなかった無音のドリフト | **`arm64`、`aarch64`、`x86_64` にわたり実施済み (6.2節)** |
| GE-H3 | GPU 間のレンダリングが有界な許容誤差内に収まる (`wgpu` / WGSL) | 4 基の物理 GPU (`Metal`、`RADV`、`NVIDIA`、`ANV`) と `llvmpipe` および `CPU Q16.16` 上で `512×512` の `RGBA8Unorm` として描画した 4 つの標準 `Q32.32` 状態 (`t = 0, 250, 1k, 10k`) | フレームバッファの `SHA-256`、相違ピクセルの割合、$\Delta_{\max}$、MAE、RMSE、`PSNR`、`SSIM` | 任意の物理 GPU の組が `PSNR > 40 dB`、`SSIM > 0.999`、または $p(\Delta > 8) \le 0.001$ を満たさないこと | **実施済み (`24/24` が合格ゲートを通過: `PSNR 64.2-72.1 dB`、`SSIM ≥ 0.99983`、6.3節)** |
| GE-H4 | GameRule と同様に、Form で符号化したルールがコード量を削減する | Haunted Jaunt、Survival Shooter、Tanks の各挙動 | 挙動コードの行数 | 削減率が 50% 未満 (GameRule は 81.3% を達成) | 未着手 |
| GE-H5 | Form ランタイムが GameRule の上限を上回る | 合成アクターによるスケーリング | $N$ に対するステップ時間 | $N = 350$ 未満でステップ時間が 20 ms を超えること | 未着手 |
| GE-H6 | インターフェース検査が実際の欠陥を検出する | Mage の 26 パターン、注入したバインディング欠陥およびスキーマ欠陥 | 検出率、機構の F1 | 注入欠陥の検出率が 90% 未満、または F1 が IR なしの 0.12 を上回らないこと | 未着手 |
| GE-H7 | Summer Engine テンプレートにおける $\ln(\Delta/\delta_0)$ 傾きの全面掃引 | Form として再表現した、物理演算を多用する Summer Engine テンプレート | 注入した $\delta_0$ に対する発散時間 | $t^{*}$ の $\ln(1/\delta_0)$ に対する傾きがゼロと区別できないこと | 未着手 |
| GE-H8 | 再生が完全である | 1 時間分の記録セッション | $D$ のみから再現される最終ハッシュ | $D$ に含まれない状態を必要とする再生が 1 件でもあること | 未着手 |
| GE-H9 | ベンチマーク同等性 | Form から Godot へのエミッタを介した GameCraft-Bench の 140 タスク | ネイティブ Godot 提出物に対する合格率 | 挙動が同一の入力で合格率が低いこと | 未着手 |

![決定性境界をまたぐ2パネルの実証的要約。左パネルは厳密ゾーン GE-H1 (arm64 macOS, aarch64 Linux, AMD/Intel x86_64 Linux にわたる25セルで、20,500個の SHA-256 チェックポイントにおける不一致が0件) と、GE-H2 のクロスISA f64 発散の目盛り (Apple libm と GNU glibc の sin/cos では t_div = 10、-ffast-math を用いない x86_64 VFMADD と arm64 FMADD では t_div = 406) を示す。右パネルは許容ゾーン GE-H3 の最小 PSNR 棒グラフであり、6つの物理GPUペア (Apple Metal, AMD RADV Vulkan, Intel ANV Vulkan, NVIDIA Vulkan) にわたって 64.2 dB から 72.1 dB の範囲に分布し、40 dB のゲートを十分に上回る。1-2 LSB のピクセル差は 1.3% から 9.3% である。](/figures/game-engines/cross-gpu-tolerance.svg)

*図3. GE-H1, GE-H2, GE-H3 にまたがる実証的境界。上流の `Q32.32` シミュレーション状態 (`S`) は、3つのISAにまたがる5台のマシン上で `0 / 20,500` 件の `SHA-256` チェックポイント不一致を達成する。これに対し、ピン留めされていない `f64` の `sin/cos` と `FMA` は、OS/ISA の境界をまたぐと `10` から `406` ティック以内で発散する。$\lambda(s_t)$ の下流では、4つのGPUアーキテクチャすべてが相異なる `RGBA8Unorm` の `SHA-256` ダイジェストを生成する (1-2 LSB の `1.3%`-`9.3%` のピクセル差)。それにもかかわらず、`64.1 dB` を厳密に上回る `PSNR` と `0.99983` の `SSIM` を維持する (`measured_j = None`, `board_metered = false`)。*

<div id="61-ge-h1-multi-isa-and-multi-os-100000-tick-determinism-q3232-integer-physics" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `GE-H1`: マルチISA とマルチOS の 100,000 ティック決定論 (`Q32.32` 整数物理)

*プリ登録は `PREREG_wave3_multi_isa_wgpu.json` (`SHA-256: 1721e5bdffaf...`) に基づく。テレメトリは `SATB` レベル `L2` と `L3` の `reported_j` を厳密に分離する (`L2`: Linux `/sys/class/powercap/intel-rapl:0/energy_uj` ソケット/パッケージおよびコアカウンタ；`L3`: macOS per-PID `proc_pid_rusage(child_pid, RUSAGE_INFO_V6).ri_energy_nj`；`measured_j = None`、`board_metered = false`)。インタラクティブエクスプローラと生 JSON: [`/living/game-engines/`](/living/game-engines/) ([`results.json`](/living/game-engines/results.json))。*

16体 + 4ピックアップの 2D 弾性衝突およびクールダウン FSM アリーナ Form (`Q32.32` 符号付き 64 ビット固定小数点座標 `[-64, +64]`、`128` ビット中間積、整数フロア平方根 `isqrt_u128`、遅延構造ピックアップリスポーン、`732` バイトリトルエンディアン正規状態ベクトル) を `100,000` ティック実行した。対象は **5 台のマシン、3 つの ISA (`arm64`/`AArch64`、`x86_64`、`wasm32`)、2 つの OS (`macOS 27.2.1`、`Ubuntu Linux 6.8 / 7.0`)、および 6 種類の言語/コンパイラ投射 (`25` ターゲット × ホストセル)**:

| ホスト (`ISA` · `OS`) | ターゲット射影 | 壁掛け時間 ms / `100k` (平均 ± SD) | `ns / tick` | テレメトリーチャネル (`reported_j`) | `reported_j` / `100k` (J) | 検証済み `SHA-256` チェックポイント |
|---|---|---:|---:|---|---:|:---:|
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_native` (`rustc 1.100 -O`) | `22.333 ± 5.043` | `223.3` | `L3` per-PID `ri_energy_nj` | **`0.1028 ± 0.0247`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `cpp20_clang_o3` (`Apple Clang 21`) | `21.022 ± 1.657` | `210.2` | `L3` per-PID `ri_energy_nj` | **`0.1090 ± 0.0134`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `rust_wasm32_node` (`Node v26.13`) | `84.300 ± 11.334` | `843.0` | `L3` per-PID `ri_energy_nj` | **`0.4480 ± 0.0881`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `javascript_bigint_node` (`ES2024`) | `717.955 ± 36.304` | `7,179.6` | `L3` per-PID `ri_energy_nj` | **`4.4021 ± 0.4048`** | `100 / 100` (`stride 1,000`) |
| **Apple M5 Max** (`arm64` · `macOS 27.2.1`) | `python_3_13` (`CPython 3.13.14`) | `2,945.816 ± 284.033` | `29,458.2` | `L3` per-PID `ri_energy_nj` | **`13.5999 ± 1.9086`** | `100 / 100` (`stride 1,000`) |
| **Apple M3 Ultra** (`arm64` · `macOS 27.2.1`) | `rust_native` / `cpp20_clang_o3` | `32.711` / `33.727` | `327.1` / `337.3` | `L3` per-PID `ri_energy_nj` | **`0.0729` / `0.0755`** | `2 × 1,000 / 1,000` (`stride 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `21.793` / `23.061` / `26.677` | `217.9` - `266.8` | `L2` AMD RAPL pkg (core `0.13`-`0.21 J`) | **`1.958` / `2.349` / `2.932`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **AMD Ryzen AI Max+ 395** (`Zen 5` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `145.29` / `1,347.80` / `2,546.42` | `1,452.9` - `25,464.2` | `L2` AMD RAPL pkg (core `1.01`-`12.23 J`) | **`14.44` / `115.81` / `181.87`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `39.718` / `36.868` / `58.792` | `368.7` - `587.9` | `L2` Intel RAPL pkg (core `1.64`-`2.68 J`) | **`2.062` / `1.888` / `3.026`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **Intel Core i9-13900H** (`Raptor Lake` `x86_64` · `Linux 7.0`) | `rust_wasm32` / `js_bigint` / `python_3_14` | `158.35` / `1,390.46` / `3,375.07` | `1,583.5` - `33,750.7` | `L2` Intel RAPL pkg (core `5.65`-`124.90 J`) | **`6.89` / `60.79` / `149.48`** | `3 × 1,000 / 1,000` (`stride 100`) |
| **NVIDIA Jetson Thor** (`Armv9-A` `aarch64` · `Linux 6.8`) | `rust_native` / `clang` / `gcc` / `wasm32` / `js` / `py3.12` | `39.28` (`GCC`) - `4,407.89` (`Py`) | `392.8` - `44,078.9` | CPUのみ (`reported_j = null`, GPU未使用) | `null` | `6 × 1,000 / 1,000` (`stride 100`) |

- **判定**: **`PASS_ZERO_MISMATCHES`(検証済み `SHA-256` チェックポイント `0 / 20,500`;Wave 3 の完全トレース `20` セルにおける対ごとのストライド `100` 比較 `0 / 190,000`)**。すべてのホストにおけるすべてのターゲットが、tick `100` で `2683c3f7cb8b...`、tick `1,000` で `21fa688e4ee8...`、tick `50,000` で `ea01ba793841...`、tick `100,000` で `82e404df6475d64d...` を生成した。
- **テレメトリの範囲と OS の対応範囲**: `L2` と `L3` の `reported_j` を混同してはならない点に留意されたい。Apple の `L3` `ri_energy_nj` は CPU コアのエネルギーをベンチマーク対象の子 PID に厳密に帰属させる(ネイティブ Rust/C++ で `0.073`-`0.109 J`)。一方、Linux の `/sys/class/powercap/intel-rapl:0`(`L2`)は、すべてのバックグラウンドデーモンを含むソケット全体のパッケージ電力を積算する(パッケージ `1.89`-`2.06 J`、`core` サブドメイン `0.13`-`1.83 J`)。`x86_64-w64-mingw32-g++` / `wine64` によるクロスコンパイルは共有 Linux ランナーで確認したところ存在せず、ベアメタルの Windows `x86_64` ホストは実行中に電源が切られていた。したがって Windows PE の実行はベアメタル上では未検証のままである。ただし、OS に依存しない `wasm32-unknown-unknown` は、`arm64` と `x86_64` の双方において macOS と Linux で同一の結果を示した。

<div id="62-ge-h2-cross-isa-and-cross-os-25000-tick-floating-point-drift-ieee-754-f64" class="anchor-alias" aria-hidden="true"></div>

### 6.2 `GE-H2`: クロスISAおよびクロスOS 25,000ティックの浮動小数点ドリフト（`IEEE 754` `f64`）

`IEEE 754` `binary64` (`f64`) シミュレーションが `-ffast-math` が *禁止* された状態で `x86_64` と `arm64`/`aarch64` 間で同期を保つかどうかを検証するため、同一の 16 ボディ混沌アリーナを `25,000` ティック（`~6.94` 分、`60 Hz`）実行し、各ティックで正規化された `IEEE 754` ビット（`t_div_ieee_bits`）、量子化された `10^-3` アリーナ単位位置（`t_div_macro_1e3`）、および離散ゲームプレイ状態（`t_div_gameplay`）をハッシュした。

| ホスト / ターゲット A | ホスト / ターゲット B | 摂動メカニズム | `t_div_ieee_bits` | `t_div_macro_1e3` | `t_div_gameplay` |
|---|---|---|---:|---:|---:|
| `arm64` macOS `Clang 21` (`f64_strict`) | AMD Zen 5 & Intel RPL `x86_64` Linux `Clang 21` / `GCC 15.2` | クロスISAおよびクロスOS `f64` 代数演算 + `sqrt`、`FMA` オフ（`-ffp-contract=off`、三角関数なし） | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| `x86_64` Linux `glibc 2.43` (`f64_trig`) | `aarch64` Linux `glibc 2.39` (`f64_trig`) | クロスISA Linux GNU `glibc` `std::sin/cos`（`-ffp-contract=off`、`-ffast-math` なし) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| **Apple `arm64` macOS (`f64_trig`, `-ffp-contract=off`)** | **AMD/Intel `x86_64` & Thor `aarch64` Linux (`f64_trig`, `-ffp-contract=off`)** | **クロスOS 標準 `libm` `std::sin/cos`（`Apple libSystem` 対 `GNU glibc`、`-ffast-math` なし)** | **`10`** (`0.17 s`) | **`5,900`** | **`9,798`** (`163.3 s`) |
| **`x86_64` Linux (`-O3 -mavx2 -mfma -ffp-contract=fast`)** | **Apple `arm64` & Thor `aarch64` (`-O3 -ffp-contract=fast`)** | **クロスISA `FMA` 低減（`x86_64 VFMADD/VFNMADD` 対 `AArch64 FMADD/FMSUB`、代数演算のみ、`-ffast-math` なし)** | **`406`** (`6.77 s`) | **`7,422`** | **`11,205`** (`186.8 s`) |
| **`x86_64` Linux `Node v22.22` (`f64_trig`)** | **`aarch64` Linux `Node v24.22` (`f64_trig`)** | **クロスISA Node.js V8 `Math.sin/cos`（`x86_64` 対 `aarch64`）** | **`66`** (`1.10 s`) | **`7,617`** | **`10,093`** (`168.2 s`) |
| **`cpp_f64_strict` (`-ffp-contract=off`)** | **`cpp_f64_fma` / `-ffast-math`** | **同一ホスト `FMA` 縮小（`-ffp-contract=off` 対 `-ffp-contract=fast`）** | **`192`** (`3.20 s`) | **`5,927`-`6,576`** | **`8,869`-`10,093`** |
| **`cpp_f64_strict` / `trig`** | **`cpp_f32_strict` / `trig`** | **精度ステップダウン（`binary64` `f64` 対 `binary32` `f32`）** | **`1`** | **`8`-`9`** | **`1,370`-`2,240`** |

3つの鋭いクロスISAの発見が浮かび上がる：

1. **IEEE 754-2008における`+`, `-`, `*`, `/`, および`sqrt`は`FMA`を無効化した場合（`-ffp-contract=off`）に`x86_64`と`arm64`/`aarch64`の間でビット単位で移植可能である**（`Clang`, `GCC`, `Rustc`, `V8`の全組み合わせで`25,000`ティックにわたり`0`不一致）。これは5つの演算すべてが`0.5` ULPへの丸めを義務付けられているためである。
2. **標準C++の`std::sin`/`std::cos`は`-ffp-contract=off -fno-fast-math`を指定してもティック`10`（`0.17 s`）でクロスOS決定性を破る**：Appleの`libSystem` `libm`とGNU `glibc`はティック`10`において操舵インパルスを`1` ULP異なる丸めを行い、これが16物体衝突の混沌によってティック`5,900`までに`> 10^-3`の位置誤差へ増幅され、ティック`9,798`（`163.3 s`）で離散的なスコア/ピックアップの非同期化を引き起こす。
3. **コンパイラのデフォルト`FMA`縮約（`-ffp-contract=fast`、`-ffast-math`や三角関数なし）はティック`406`（`6.77 s`）でクロスISA決定性を破る**：AMD Zen 5とIntel Raptor Lakeは`x86_64`上でビット単位で完全に一致し（`844172b5...`）、Apple M3 UltraとJetson Thorは`AArch64`上でビット単位で完全に一致する（`deeb446c...`）一方、LLVMは否定付き乗算減算式を`x86_64`（`AVX2` `VFMADD`/`VFNMADD`）と`AArch64`（`NEON` `FMADD`/`FMSUB`）で異なって低レベル化するため、ティック`11,205`でゲームプレイを非同期化する。

<div id="63-ge-h3-cross-gpu-headless-wgpu-metal--vulkan-rendering-tolerance" class="anchor-alias" aria-hidden="true"></div>

### 6.3 `GE-H3`: 相互GPU間のヘッドレス`wgpu`（`Metal` / `Vulkan`）レンダリングにおける許容誤差

図1の右辺を実証的に検証するため、自己完結型のRust製ヘッドレス`wgpu`（`v22.1.0`）ベンチマーク（`ge_h3_wgpu_bench`）を実装した。本ベンチマークは、4つの標準的な`Q32.32`シミュレーションスナップショット（`ticks 0, 250, 1,000, 10,000`）を、`512×512`の`RGBA8Unorm`フレームバッファ（`262,144`画素、`1,048,576`バイト/フレーム）に描画する。描画は2段階のWGSLパイプラインにより行われる。第1段階は三角関数に基づく手続き的なレーダー・格子背景であり、第2段階は宣言順に適用される`20`個の`SrcAlpha / OneMinusSrcAlpha`アルファブレンディングによるSDFエンティティおよびBlinn-Phong陰影付き3D球体・トーラスである。これと並行して、浮動小数点演算を用いない`CPU Q16.16`整数ソフトウェア参照ラスタライザを基準として用いた。

| Adapter A（`API` · ドライバ） | Adapter B（`API` · ドライバ） | 平均差異画素率（`%`） | 最大 $|\Delta|$（`0..255`） | 平均MAE（`u8`） | 平均RMSE（`u8`） | 最小`PSNR`（`dB`） | 最小`SSIM` | `GE-H3` ゲート |
|---|---|---:|---:|---:|---:|---:|---:|:---:|
| **Apple M3 Ultra（`Metal` 4）** | **Intel Iris Xe（`Vulkan` · Mesa `ANV` 26.0.8）** | `1.301%` | `2` | `0.00386` | `0.06215` | **`72.06`** | **`0.999986`** | **合格** |
| **AMD Radeon 8060S（`Vulkan` · Mesa `RADV` 26.0.8）** | **Apple M3 Ultra（`Metal` 4）** | `3.103%` | `1` | `0.00788` | `0.08876` | **`69.09`** | **`0.999956`** | **合格** |
| **AMD Radeon 8060S（`Vulkan` · Mesa `RADV` 26.0.8）** | **Intel Iris Xe（`Vulkan` · Mesa `ANV` 26.0.8）** | `3.774%` | `2` | `0.01022` | `0.10116` | **`67.97`** | **`0.999951`** | **合格** |
| **AMD Radeon 8060S（`Vulkan` · Mesa `RADV` 26.0.8）** | **NVIDIA GeForce RTX 4050（`Vulkan` · `595.99.02`）** | `6.553%` | `2` | `0.01735` | `0.13179` | **`65.64`** | **`0.999874`** | **合格** |
| **Intel Iris Xe（`Vulkan` · Mesa `ANV` 26.0.8）** | **NVIDIA GeForce RTX 4050（`Vulkan` · `595.99.02`）** | `8.280%` | `2` | `0.02149` | `0.14667` | **`64.79`** | **`0.999844`** | **合格** |
| **Apple M3 Ultra（`Metal` 4）** | **NVIDIA GeForce RTX 4050（`Vulkan` · `595.99.02`）** | `9.337%` | `2` | `0.02467` | `0.15720` | **`64.16`** | **`0.999833`** | **合格** |
| 物理GPU（`4` ベンダー） | `Mesa llvmpipe`（`LLVM 21.1.8` CPU・`Vulkan`） | `1.541%` - `9.633%` | `2` - `3` | `0.00477` - `0.02601` | `0.06895` - `0.16173` | `63.86` - `70.87` | `0.999828` - `0.999984` | **合格** |
| 物理GPU（`4` ベンダー） | `CPU Q16.16` ゼロ浮動小数点整数参照実装 | `20.400%` - `27.626%` | `2` | `0.05612` - `0.07864` | `0.23689` - `0.28068` | `59.13` - `60.58` | `0.999556` - `0.999693` | **合格** |

- **ビット完全性は否定され、限定トレランスは確認された (`24 / 24` 物理GPUフレームペア)**: すべての物理GPUペアは異なる生 `RGBA8` `SHA-256` ダイジェストを生成した (`0 / 24` ビット単位で一致) であり、ハードウェアSFUの `sin`/`cos`/`pow` 近似や `unorm8` ROP ブレンドの丸めによるものである。しかし **任意の物理GPUペアにおいてピクセルが `2 / 255` を超えて変化したものはゼロである** ($p(|\Delta| > 8) = 0.000000 \le 0.001$)、`PSNR` は `64.16 dB` を超え (`> 40.0 dB` の閾値)、`SSIM` は `0.999833` を超え (`> 0.999` の閾値) であり、フレームあたり `0.31`-`2.80 ms` の処理時間であった。

- **ソフトウェアラスタライザの対照**: ゼロフロート `CPU Q16.16` 整数ソフトウェアラスタライザは `Apple M3 Ultra` (`arm64`)、`AMD Zen 5` (`x86_64`)、`Intel Raptor Lake` (`x86_64`) 上で `0` `SHA-256` フレームバッファ不一致を達成した (`9c693a38...` が tick `0`、`ce3b2cec...` が tick `10,000`)。さらに `Mesa llvmpipe` (`LLVM 21.1.8`) は AMD と Intel `x86_64` ホスト間でビット単位の一致を示し (`ccb291f6...` が tick `0`)、ピクセルの分岐は GPU シェーダ／ROP ハードウェアの変動に起因し、シーン投影 $\lambda(s_t)$ には起因しないことを示した。

<div id="64-playable-joule-native-q3232-chrono-budget-arena-livinggame-engines" class="anchor-alias" aria-hidden="true"></div>

### 6.4 プレイ可能な joule ネイティブ `Q32.32` Chrono-Budget アリーナ（`/living/game-engines/`）

本研究の厳密な `Q32.32` 再生契約と、[『Time as an Index』](/papers/time-as-an-index/)（第9.2節）のエネルギーネイティブな時間機構を結合し、[ゲームエンジン実験場（`/living/game-engines/`）](/living/game-engines/)の計器4は、JavaScript の `BigInt` で動作する `60 Hz` の決定論的軌道航行およびピックアップ防衛ミニゲームを提供する(シミュレーション内の浮動小数点演算は `0` 回である)。

- **ライブ `SHA-256` 状態テープと決定論的再生**: 各ティックでローリング `SHA-256` 状態ダイジェストを更新し、コンパクトな1バイトのプレイヤー入力イベントを $D$ に記録する。`Replay & Verify SHA-256` をクリックすると、`(seed, D)` から試合全体を再実行し、ビット単位のハッシュ一致(`replayed_sha256 === live_sha256`)を検証する。
- **joule 予算に基づく時間的先読みと巻き戻し(`est_j` 設計モデル)**: 将来の軌道の照会(`Hellman Branch Preview`。`K` ティック先までの候補操舵分岐 `3` 本をシミュレートする)や、永続的な因果チェックポイントへの巻き戻しは、明示的なマイクロジュール(`µJ`)のバッテリーを消費する。消費量は、投機的ティックごとの `step_cost_uj` と、選択されなかった未来や巻き戻された時間線を破棄する際のランダウアー消去コストから成る。操作はキーボード、マウス/タッチ、および `WebXR` / `Gamepad` コントローラー(Meta Quest Browser を含む)で行える。

<div id="7-infeasibility-flags" class="anchor-alias" aria-hidden="true"></div>

## 7. 実現不可能性に関するフラグ

1. **ハードウェアによるクロスGPUのビット単位一致レンダリング: 実現不可能(`GE-H3`において`Metal`、`RADV`、`NVIDIA`、`ANV`の全24組で`SHA-256`一致数は`0 / 24`)。一方、GPU出力が$S$に再投入されない場合には、有界な知覚的許容誤差(`PSNR > 64 dB`、`SSIM > 0.9998`、$\Delta_{\max} \le 2$)が成立する。**
2. **標準的な浮動小数点設定によるクロスプラットフォームの厳密な物理演算: 実現不可能。** `-ffast-math`を用いない場合でも、OS間の`std::sin`/`std::cos`(`Apple libm`と`GNU glibc`)は第10ティックで乖離し、ISA間の`FMA`の下位化(`x86_64`と`arm64`における`-ffp-contract=fast`)は第406ティックで乖離する。この乖離は`9,798`から`11,205`ティックの間にゲームプレイの非同期へと波及する(`GE-H2`)。
3. **シミュレーション内部でのGPU計算: 厳密な意味では実現不可能であり、決定論的リダクションを用いる場合に限り実現可能である。** 測定された対象ハードウェア上のコストは約0.2%から7.8%である。ただし、全ターゲットにおいて命令単位で保護(SPIR-V NoContraction)しない限り、コンパイラによる縮約(contraction)の影響を受ける。
4. **エンジン間で移植可能な振る舞い: 読解した外部資料では実証されていない。** 2次元物理演算カーネルのレベルでは、`GE-H1`において`25`組(ターゲット×ホスト、`5`台のマシン、`3`種のISA、`6`種のランタイムおよびコンパイラ)にわたり実証されている。一方、エンジン全体への投影(`GE-H4`、`GE-H9`)は未解決のままである。
5. **大規模なアクター数における解釈型ルール: 制約がある。** GameRuleの測定から、20 msにおけるアクター数の上限は約300と推定される。さらに`GE-H1`は、Pythonの`int`がIntel、AMD、Apple Silicon上で、ネイティブRustの`reported_j`と比較して`73×`から`132×`のコストを要することを示している。大規模な運用には、コンパイル済みのネイティブ実装またはWebAssemblyへの投影が必要である。
6. **厳密な対象としての独自エンジンおよびベアメタルWindowsターゲット: 未検証。** GameRuleが引用したUnityマニュアルは実行順序の保証を否認している。また、UnityおよびUnrealのテンプレートカタログは(ページがクライアントサイドで描画されるため)読解できなかった。Unreal の実行順序に関する資料も読解していない。さらに、ベアメタルWindowsの`PE`実行は、Wave 3のLinux/macOSランナープールでは稼働していなかった。

<div id="8-sources-and-limits" class="anchor-alias" aria-hidden="true"></div>

## 8. 情報源と限界

上記のすべての情報源は、引用された箇所において全文を読んだが、以下を除く：GameCraft-Bench 論文（要旨およびリポジトリの README を読んだ）、RCE の概要ページ（要約ページを読んだ）、および Capcom のプレスストーリー（1 記事）。テレメトリレベル（`SATB`）とジュール予算制御の時間的ゲームメカニクスに関する同伴ハウスの研究は、[Time as an Index](/papers/time-as-an-index/) と [Satiation Tiered Benchmark Harness](/papers/satb-harness/)（`[same house]`）である。証拠として引用されなかったが参照した情報源は、ゲームを構造化されたルーデムの集合として記述する [Ludii portal](https://ludii.games/) 、Game Grammar のホビーリポジトリ、そしてレンダリングライブラリを記述する [PlayCanvas](https://github.com/playcanvas/engine)、[Babylon.js](https://github.com/BabylonJS/Babylon.js) および [three.js](https://github.com/mrdoob/three.js) の README である。

未読、課金壁またはその他入手できない情報源は、T. Schaul, "A Video Game Description Language for Model-based or Interactive Learning," IEEE CIG 2013, doi:10.1109/CIG.2013.6633610; J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845; M. Ebner et al., "Towards a Video Game Description Language," doi:10.4230/DFU.Vol6.12191.85 であり、後者はオープンアクセスであるが本研究のためには読まれなかった。

第6節では、`GE-H1`、`GE-H2`、`GE-H3` がすべての実行において `measured_j = None` と `board_metered = false` を保持し（macOS `L3` のプロセス単位 `ri_energy_nj` と Linux `L2` のソケット/コア `RAPL` `reported_j` を切り離し、Chrono-Budget Arena の `est_j` メカニクスを厳密に解析的に保つ）、ベアメタル Windows `PE` 実行、Direct3D 12 `wgpu` レンダリング、およびマルチエンジンエミッタ（`GE-H4`-`GE-H9`）は依然として未解決の課題である。
