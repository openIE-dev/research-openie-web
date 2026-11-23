---
title: "ゲームを一度書いてどこでも動かす：厳密な再生が終わり許容誤差が始まる境界"
deck: "ゲームは一度だけチェックされた状態機械として記述され、複数のエンジン、命令セット、オペレーティングシステム、グラフィックススタックへと投影できるか。30 のマルチ ISA ターゲット × ホストセル上で 100,000 ティックを実行し、Q32.32 整数物理を適用した結果（GE-H1: 0 / 25,500 の状態ダイジェスト不一致が arm64 macOS、aarch64 Linux、Zen 5 および Raptor Lake x86_64 Linux、Tiger Lake x86_64 Windows 11 に跨って観測された）、25,000 のクロスプラットフォーム浮動小数点ティックにおいて（GE-H2: t_div = 10 が Windows Universal C Runtime と Apple libm と Linux glibc の sin/cos とで差異、t_div = 192-406 の融合乗算加算低減が -ffast-math を使用しない条件下で実施された）、そして Metal、Vulkan、DirectX 12 の 8 つのハードウェアグラフィックスエンドポイントに対して（GE-H3: ピクセルドリフトが 0.00%-9.34%、Δ_max ≤ 2、ピーク信号対雑音比 ≥ 64.2 dB、構造類似度 ≥ 0.99983 が全 28 ペアで維持された）実行された結果、プレイ可能なジュール予算制限付き Q32.32 プロトタイプと組み合わせて評価された。"
lang: "ja"
source: "game-engines"
complete: true
---

<div id="writing-a-game-once-and-running-it-everywhere-where-exact-replay-ends-and-tolerance-begins" class="anchor-alias" aria-hidden="true"></div>

*改訂 1561a2a, 2026年11月22日。インタラクティブエクスプローラ、3-OS / 3-API クロスGPUインスペクタ、そしてプレイ可能な `Q32.32` クロノ・バジェットアリーナ: [research.openie.dev/living/game-engines/](/living/game-engines/).*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 要旨

本研究は、ゲームを検査可能な状態機械として一度記述し、それを各言語、各オペレーティングシステム（OS）、各中央処理装置（CPU）命令セットアーキテクチャ（ISA）、各グラフィックス処理装置（GPU）アプリケーションプログラミングインターフェース（API）へ投影できるかを問う。調査対象の仕様と、実行された3種類の経験的反証スイートの双方が明確な境界を示した。固定小数点整数演算を固定（pinned）した場合のゲーム規則およびシミュレーションについては**可能**である（`(GE-H1)`：3つのオペレーティングシステムと3つの命令セットにまたがる30の対象×ホストの組（`arm64` `macOS 27.2.1`、`aarch64` `Linux 6.8`、Advanced Micro Devices（`AMD`）Zen 5およびIntel Raptor Lake `x86_64` `Linux 7.0`、ならびにMicrosoft Visual C++（`MSVC`）`cl.exe`を用いたベアメタルのIntel Tiger Lake `x86_64` `Windows 11` ビルド`26300`を含む）に投影した16体の2次元アリーナの`100,000`ティックにわたり、チェックポイントの`SHA-256`不一致は`0 / 25,500`であった。消費電力は、macOSのプロセス単位`reported_j`で`0.073 J`から`13.60 J`、LinuxのRunning Average Power Limit（`RAPL`）パッケージ`reported_j`で`1.89 J`から`181.87 J`に及ぶ）。

浮動小数点の超越関数または融合積和（`FMA`）の下位化が固定されていない場合、多体衝突はカオス的に発展するため**不可能**である（`(GE-H2)`：*用いなくても*、`-ffast-math`や`/fp:fast`を指定しないときでも、3つのデスクトップOSの数学ライブラリはいずれも互いに発散する三角形を形成する。同一の`x86_64` ISA上で、Windows Universal C Runtime（`UCRT`）とLinuxのシステム`glibc`の`std::sin`/`std::cos`はティック`10`で発散し、Apple `libSystem`の`libm`とLinuxの`glibc`もティック`10`で発散し、WindowsのUCRTとApple `libm`はティック`37`で発散する。また、`MSVC`の`/fp:precise`と`Clang`の`-ffp-contract=fast`はx86_64上でティック`192`において、`x86_64`の`-mavx2 -mfma`と`arm64`の`fmadd`はティック`406`において発散する）。

GPUバックエンド間でのビット単位で一致するピクセルは**不可能**である。一方、有界な一方向の許容誤差ゲートの下では**可能**である（`(GE-H3)`：Apple `Metal`、Linux Mesa Radeon Vulkan（`RADV`）、Nvidia（`NVIDIA`）のLinuxおよびWindowsの`Vulkan`とWindowsのDirectX 12（`DX12`）、ならびにIntel Linux Mesa Vulkan（`ANV`）およびWindowsの`Vulkan`と`DX12`にまたがる8つのハードウェアの`GPU × API`エンドポイントにおいて、`512×512` `RGBA8Unorm`で測定した。`GeForce 2060`と`Iris Xe`のそれぞれについて`DX12`と`Vulkan`の間で同一の物理GPUを用いた組を含め、`28`組中`27`組のハードウェア対は生の`SHA-256`が異なった。それにもかかわらず、`28 / 28`のハードウェア対すべてにおいて、最大チャネル誤差$\Delta_{\max} \le 2 / 255$、ピーク信号対雑音比（`PSNR`）`>= 64.16 dB`、構造的類似性（`SSIM`）`>= 0.99983`を満たした。なお、測定値は`measured_j = None`、`board_metered = false`である）。

**平易な言葉で**

1. **整数で固定された演算を用いれば、オペレーティングシステム、チップ、言語をまたぐ厳密なシミュレーションが成立する。** 100,000ティック(30セルにわたる25,500個の検証済み`SHA-256`チェックポイント)にわたり、ネイティブRust、C++20(`Clang`、コンパイラコレクション(`GCC`)、Windowsの`MSVC`)、WebAssembly(`Wasm`)、JavaScriptの`BigInt`、Pythonは、`macOS`(`arm64`)、`Linux`(`aarch64`および`x86_64`)、`Windows 11`(`x86_64`)上で、732バイトの同一の状態をビット単位で完全に再現した。不一致は0件であった。

2. **標準的な浮動小数点物理演算は、fast-mathフラグを使用しなくても、`Windows`、`macOS`、`Linux`の間で乖離する。** FMAを無効化した(`/fp:strict`および`-ffp-contract=off`)純粋な代数演算`+`、`-`、`*`、`/`、`sqrt`は、検証したすべてのOSおよびISAにおいて25,000ティックにわたり一致した。一方、`std::sin`および`std::cos`を呼び出すと、Windowsの`UCRT`、macOSの`libm`、Linuxの`glibc`の間でビットが10〜37ティックの範囲で反転した(60Hzで0.17〜0.62秒)。その結果、ゲームプレイのスコアは9,798〜10,392ティック(163.3〜173.2秒)の時点で非同期化した。さらに、コンパイラ既定のFMA規則は、`MSVC`(`/fp:precise`)と`Clang`(`-ffp-contract=fast`)の間では192ティック目で、`x86_64`と`arm64`の間では406ティック目で乖離した。

3. **同一のグラフィックスカードであっても、`DirectX 12`と`Vulkan`の間でピクセルのビットが反転しうるため、描画は一方向の許容誤差ゲートの下流に配置すべきである。** `Metal`、`Vulkan`、`DirectX 12`によるハードウェアの`GPU × API`の8つの実行環境に加え、Windowsの Advanced Rasterization Platform(`WARP`)および`Mesa llvmpipe`を対象に検証した。同一の`NVIDIA GeForce 2060`(`PSNR` 108.34 dB)または`Intel Iris Xe`(`PSNR` 79.52 dB)上で`DirectX 12`と`Vulkan`を切り替えると、シェーダーコンパイラの低位化により最下位ビット(`LSB`)が1だけ変化した。異なるベンダー間の組み合わせでは、ピクセルの0.00%から9.34%が`<= 2` `LSB`の差異を示した(PSNR >= 64.16 dB、SSIM >= 0.99983)。ただし、これらのいずれもシミュレーション状態を破損させることはなかった。

![提案された分割の図。上の箱にはゲームの Form P = S, E, delta, D, lambda が入っており、型付けされたインタフェーススキーマと厳密なチェッカーを備える。矢印は 4 つの射影へ分岐する：左側の厳密領域にあるシミュレーション（Rust、WebAssembly、XState、SCXML、Python）およびスクリプティング（Rhai、Lua、Luau）はティックごとの状態ハッシュで判定され、右側の許容領域にあるシーン（BSN 類似、glTF、OpenUSD）およびレンダリング（Slang、WGSL、WESL）はピクセルごとの誤差で判定される。破線の垂直線が決定論的境界を示す。下部の帯には、ログ化されたイベントとしてのみ入力されるホスト効果（入力、クロック、オーディオ、ネットワーク、アセット入出力、GPU 描画、化粧的物理演算）が列挙されている。](/figures/game-engines/architecture.svg)

図 1. 提案された分割。一つの Form が四つの射影に供給される。シミュレーションおよびスクリプティングは厳密領域に位置し、ティックごとの状態ハッシュで判定される。シーンおよびレンダリングは許容領域に位置し、ピクセルごとの誤差で判定される。ホスト効果はログ化されたイベントとしてのみ入力される。

![11 の既存表現を行とし（Slang、Naga、WGSL および WESL、glTF、OpenUSD、BSN、SCXML および XState、VGDL、GameRule、nAIVE、SpacetimeDB）、7 つの能力列（挙動、シーン、シェーダ、実行順序、マルチターゲット、リプレイログ、クロスレイヤ検査）を持つグリッド。緑のセルは文書化された能力、琥珀色は部分的、灰色は欠如または未文書化を示す。クロスレイヤ列は Slang と nAIVE の部分的印を除きすべて灰色である。](/figures/game-engines/coverage.svg)

*図2. 本研究で読み込んだ文書のみに基づいて採点した既存表現の網羅状況。緑: 文書化された能力。黄: 部分的。灰: 不在または未文書化。最右列の層間検査は、ほぼ空白である。*

<div id="1-terms-notation-and-the-idea-under-test" class="anchor-alias" aria-hidden="true"></div>

## 1. 用語、表記法、および検証対象の考え方

<ul id="terms">
<li>RCE, IR, ECS, FSM, SDF: 現実コードエンジン[同一家], 中間表現, エンティティコンポーネントシステム, 有限状態機械, 符号付き距離場</li>
<li>CPU, GPU, ISA, ISAs, SIMD, AVX2, NEON, SFU, ROP, RPL, TGL: 中央処理装置, グラフィックス処理装置, 命令セットアーキテクチャ(複数形), 単一命令多データ, Advanced Vector Extensions 2, Arm Advanced SIMD, 特殊機能ユニット, ラスタ操作パイプライン, Intel Raptor Lake モバイルアーキテクチャ, Intel Tiger Lake モバイルアーキテクチャ</li>
<li>IEEE, FMA, VFMADD, VFNMADD, FMADD, FMSUB, ULP, LSB, SHA, MAE, RMSE, PSNR, SSIM, SD, RGBA8: Institute of Electrical and Electronics Engineers (IEEE 754浮動小数点におけるもの), 融合積和演算, x86_64ベクトル融合積和および否定積和オペコード, AArch64スカラー融合積和および積減算オペコード, 最終桁単位, 最下位ビット, Secure Hash Algorithm (`SHA-256`), 平均絶対誤差, 二乗平均平方根誤差, ピーク信号対雑音比, 構造的類似性指標, 標準偏差, および8ビット毎チャネル赤緑青アルファフレームバッファ形式</li>
<li>WGSL, WESL, SPIR-V, GLSL, HLSL, MSL, D3D11, D3D12, DX12, VULKAN, METAL, DXIL, DXBC, DXC, FXC, WARP, WDDM, CUDA: WebGPU Shading Language, WebGPU Extended Shading Language, Standard Portable Intermediate Representation V, OpenGL Shading Language, High-Level Shading Language, Metal Shading Language, Direct3D 11, Direct3D 12, DirectX 12, `wgpu::Backends::VULKAN` と `wgpu::Backends::METAL` バックエンドフラグ, DirectX Intermediate Language, DirectX バイトコード, DirectX Shader Compiler, 従来の Direct3D Effect-Compiler ツール, Windows Advanced Rasterization Platform ソフトウェア DirectX 12 ラスタライザ, Windows Display Driver Model, Compute Unified Device Architecture</li>
<li>RADV, ANV, LLVM, GNU, GCC, MSVC, UCRT, NT, PE, OS, OSs, API, APIs, JIT, WebXR, WebMCP, URL, JSON, YAML, README, MB, CS0246, RE, ENGINE, DFU: Mesa Radeon Vulkan ドライバ, Mesa Intel Vulkan ドライバ, Low Level Virtual Machine コンパイラ基盤, GNU's Not Unix プロジェクト, GNU Compiler Collection, Microsoft Visual C++ コンパイラ (`cl.exe`), Windows Universal C Runtime (`ucrtbase.dll`), Windows New Technology カーネル (`Windows NT`), Windows Portable Executable, オペレーティングシステム(複数形), アプリケーションプログラミングインタフェース(複数形), just-in-time コンパイラ, Web Extended Reality API, Web Model Context Protocol, Uniform Resource Locator, JavaScript Object Notation, YAML Ain't Markup Language, リポジトリ README 文書ファイル, メガバイト, C# コンパイラ欠如型診断 CS0246, Capcom RE ENGINE (「Reach for the Moon」／「RE neXt」エンジンブランディング), および Dagstuhl Follow-Ups DOI プレフィックス</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG: State Chart XML, Game Description Language, Video Game Description Language, Bevy Scene Notation, Boldsea Semantic Language, Multi-Level Intermediate Representation, 原子性/一貫性/隔離性/永続性トランザクション, Good Game Peace Outロールバックネットワークライブラリ, Graphics Language Transmission Format (ISO/IEC 12113:2022), Open Universal Scene Description, Universal Scene Description, ローカルエリアネットワーク, 人工知能, およびComputational Intelligence and Games</li>
<li>SATB, RAPL, MSR, PID, RUSAGE, V6, AMD, NVIDIA, RTX, V100, GH200, CTC: Satiation Tiered Benchmark（SATB）のテレメトリ水準（`L2` はソケット/パッケージのカウンタ、`L3` はプロセス単位のカーネルカウンタ）[同一組織]、Running Average Power Limit（平均電力制限）、モデル固有レジスタ（model-specific register）、プロセス識別子（process identifier）、`proc_pid_rusage`（`RUSAGE_INFO_V6`）、Advanced Micro Devices（AMD社）、NVIDIA Corporation（NVIDIA社）、NVIDIA GeForce RTX GPUファミリ、Volta V100 GPU、Grace Hopper GH200スーパーチップ、および閉じた時間的曲線（closed timelike curve）</li>
</ul>

前方参照を上から下へ見通しやすくするため、第1節ではForm表記を定義し、第2節では既存のゲーム表現を概観し、第3節では浮動小数点数による乖離を分析し、第4節では中間表現を一覧にし、第5節では提案する階層分割を述べ、第6節では3 OS・複数ISA・3 APIにわたるクロスGPUの反証実験の結果を報告し、第7節では実現不可能性のフラグを列挙し、第8節では出典と限界を記録する。

[現実コードエンジン (RCE)](https://research.openie.dev/about/rce/)は、プログラムを状態機械として扱う。この状態機械をFormと呼び、$P = (S, E, \delta, D, \lambda)$ と記述する。

- $S$: 状態の集合;
- $E$: 事象(入力)の集合;
- $\delta : S \times E \to S$: 遷移関数;
- $D$: 実行されたすべてのステップを記録する追記専用のログ;
- $\lambda$: 状態から観測可能な出力への写像。

厳密な検査器は、Formを受理するか、違反した規則を明示して拒否する。受理されたFormは、エミッタによってRust、Python、JavaScript、Scalaへ射影される。XState(JavaScriptおよびTypeScript向けのステートチャートライブラリ)、SCXML(World Wide Web Consortiumの勧告)、WebAssembly(`Wasm`)は、エミッタの対象には含まれていない。本研究では、これらを射影先の候補として扱う。すべてのステップは $D$ に記録されるため、任意の実行を再生できる。

ゲームエンジンは、はるかに大きな機械である。固定ステップのシミュレーション、スクリプト層、シーン記述、そしてGPU上のレンダリングパイプラインを実行する。第1節から第8節では、これらの層のうちどれをForm内に置けるか、どれを外部のホスト効果として外に置くべきか、そして厳密性がどこで許容誤差に譲歩しなければならないかを検討する。

この着想には長い系譜がある。スタンフォード大学の[Game Description Language (GDL)仕様書](http://ggp.stanford.edu/readings/gdl_spec.pdf)は、対象を「有限・離散・決定論的な、完全情報をもつ複数プレイヤーのゲーム」と定め、そのようなゲームの自然な基礎モデルは「有限状態機械である」と指摘している。ゲームエンジンにおいて新しいのは状態機械そのものではなく、その周囲にある要素、すなわち浮動小数点数による物理演算、スクリプト、シーン、そしてGPUである。

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

## 3. 発散の物理学：厳密性が二値的である理由

浮動小数点加算は結合則を満たさない。並列ハードウェア上では、リダクションの順序が実行ごとに変動しうる。浮動小数点の非結合性を並列ハードウェア上で調べた研究([arXiv:2408.05148](https://arxiv.org/abs/2408.05148))は、スカラー変動量を次式で定義している。

$$V_s = 1 - \left| \frac{f_{nd}}{f_d} \right|,$$

ここで $f_d$ は決定的リダクション、$f_{nd}$ は非決定的リダクションの結果である。倍精度の正規分布に従う $10^6$ 個の値の総和について順序を入れ替えたところ、結果は最大で約 $4.26 \times 10^{-13}$ 変化し、最大の $|V_s|$ は $\sqrt{n}$ に比例して増大した。NVIDIA V100 上では、決定的なツリー型リダクションのコストは原子的累積に対して約 0.2% であり、GH200 上では最大 7.8% に達した。1,000 回のグラフネットワーク学習実行では、すべての実行が互いに異なる重みを生成した。

ゲームは、このような微小な差異を目に見える差異へと増幅する。剛体接触や多体力学は典型的にカオス的である。局所リアプノフ指数 $\Lambda$ の下では、摂動は次式に従って増大する。

$$\delta(t) = \delta_0 \, e^{\Lambda t},$$

したがって、摂動がゲームプレイ上知覚可能な大きさ $\Delta$ に達するまでの時間は次式で与えられる。

$$t^{*} = \frac{1}{\Lambda} \ln\frac{\Delta}{\delta_0}.$$

*例示モデル:* $\delta_0 \approx 6 \times 10^{-8}$ (単精度の 1 ULP、相対) 、$\Delta = 1$ (壁の向こう側のオブジェクト) 、仮定された $\Lambda = 2\ \text{s}^{-1}$ とする。すると $t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ s になる。対数が鍵であり、$\delta_0$ を百万倍縮小しても約 6.9 秒しか増えない。したがって近似的一致はシミュレーションを救うことはできない。状態はビット単位で同一であるか、最終的に発散するかのいずれかであり、この予測は 25,000 のマルチ ISA と 3-OS の衝突ティック以下で直接検証された (`GE-H2`)。

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

1. **シミュレーション形式（厳密）。** $S$ は固定小数点または厳密な IEEE 754 値を保持し、FMA および再結合を無効化する。超越関数は整数演算またはピン留めされたソフトウェアルーチンで実装する。$E$ はティックイベントと記録された入力を保持する。$\delta$ は SCXML のマクロステップ意味論に従う。すなわち各ティックにおいて、イベントをキューの順序で処理し、競合は文書順序によって解決し、並列領域は直列に実行する。コレクションは宣言された順序で反復する。これは GameRule の契約（宣言順序、後勝ちの書き込み、構造変更はティックの末尾に遅延）に従う。並列性が望まれる場合、検査器は Core ECS の非交差条件を満たすスケジュールのみを許容する。
2. **スクリプト射影（厳密）。** 設計者のスクリプトは $S$ 上のガードおよびアクションにコンパイルされ、[Rhai](https://rhai.rs/book/about/features.html)（サンドボックス化され、"Don't Panic" 保証、no-std および Wasm 対応）、Lua、または [Luau](https://luau.org/)（既定でサンドボックス化され、漸進的型を備える）として出力される。スクリプトは宣言されたアクションを通じてのみ $\delta$ を呼び出せる。時計、乱数源、GPU の結果を直接読むことはできない。
3. **シーン射影（下流における許容誤差）。** $\lambda$ は $S$ を BSN 風のパッチ木へ写像する。その構成要素スキーマは形式の一部である。アセットの書き出し先として glTF および OpenUSD を用いる。
4. **描画射影（許容誤差）。** マテリアルおよびパスは Slang または WGSL で記述し、Slang または Naga を経由して `DirectX 12`、`Metal`、`Vulkan` の各バックエンドへ出力する。描画は $\lambda(s)$ の純粋関数である。GPU の結果が $S$ へ逆流することはない。

<div id="52-inside-the-form-versus-host-effects" class="anchor-alias" aria-hidden="true"></div>

### 5.2 形式の内側と外部ホスト効果

内側には、状態、遷移、規則の順序、ゲーム上重要な物体に対する不動点物理、シード $S$ を持つ乱数生成器、インターフェース・スキーマが含まれる。外側には、入力デバイス、壁時計時刻、ネットワークパケット、音声出力、アセットの入出力、GPU描画、そして見た目のみに用いられるサードパーティ製物理演算などが、ログされるイベントとして扱われる。再生時には、デバイスに触れることなく、記録された $D$ を $\delta$ に与え直す。記録に要する記憶コストは小さい。ティックレート $f_{\text{tick}} = 60$ Hz、ティックあたりの入力 $b = 16$ バイトとすると、ログは $f_{\text{tick}} \cdot b = 960$ B/s の速度で増加し、1時間あたり約3.5 MBとなる。

<div id="53-determinism-boundary" class="anchor-alias" aria-hidden="true"></div>

### 5.3 決定性の境界

- **厳密領域の判定基準:** 対象 A と B のすべての tick $t$ について、$H(s_t^A) = H(s_t^B)$ が成り立つ。ここで $H$ は $S$ の正準直列化に対する暗号学的ハッシュ関数である。
- **許容誤差領域の判定基準:** 同一の $s_t$ から得られた描画フレーム $I^A$ と $I^B$ について、チャネルごとの誤差が $\varepsilon$ を超えるピクセルの割合は $p_{\max}$ を超えてはならない。さらに、構造的類似度 (`SSIM`) およびピーク信号対雑音比 (`PSNR`) の下限を併せて課す。第6.3節では、`DirectX 12`、`Metal`、`Vulkan` にまたがる8種類のハードウェア `GPU × API` エンドポイント（`Apple Metal`、`AMD RADV Vulkan`、`NVIDIA` の Linux/Windows `Vulkan` および Windows `DX12`、`Intel` の Linux `ANV Vulkan` および Windows `Vulkan` / `DX12`）を対象として、このキャリブレーションを実施する。
- [GGPO](https://github.com/pond3r/ggpo) の様式に倣ったロールバックネットワーキングは、入力予測と投機的実行に依拠するため、この境界の厳密側においてのみ有効である。

<div id="54-cross-layer-interface-checking" class="anchor-alias" aria-hidden="true"></div>

### 5.4 クロスレイヤインタフェース検査

チェッカは、任意のエミッションの前に4種類の型付きエッジを検証する：(a) スクリプトからシミュレーションへ：すべてのアクションが、引数型が一致する宣言済み遷移を指名すること；(b) シミュレーションからシーンへ：$\lambda$の出力がコンポーネントスキーマに一致すること；(c) シーンからレンダリングへ：すべてのマテリアルバインディングが、互換性のある型、グループ、およびバインディングインデックスを持つSlangまたはWGSLリソースに一致すること；(d) イベントカバレッジ：スクリプトがリッスンするすべてのイベントが、何らかの遷移またはホストソースによって生成可能であること。Mageの発見（2.3節）が、エッジ検査をコンパイル成功ではなく動作トレースによって判定する理由である。

<div id="6-falsifier-first-test-plan-and-executed-3-os--3-isa--3-api-results" class="anchor-alias" aria-hidden="true"></div>

## 6. 偽造者優先テスト計画および実行された3-OS/3-ISA/3-API結果

各仮説は、その殺却基準とともに列挙される。基準が満たされた場合、主張は撤回される。6.1節から6.4節は、3つの実行された経験的偽造者スイート（`GE-H1` 3-OS×3-ISA `Q32.32` リプレイ（30のターゲット×ホストセル間）、`GE-H2` 3-OS×3-ISA浮動小数点ドリフト（`Windows 11 UCRT`、`macOS libSystem`、および`Linux glibc`間）、および`GE-H3` 3-OS×3-APIヘッドレス`wgpu`レンダリング許容誤差（`DirectX 12`、`Metal`、および`Vulkan`間））、ならびにインタラクティブなジュール予算付き`Q32.32`プロトタイプ（`GE-H4`から`GE-H9`は未解決のまま）を報告する。

| ID | 仮説 | テストコーパス | 測定量 | 棄却基準 | ステータス |
|---|---|---|---|---|---|
| GE-H1 | シミュレーションの射影は言語・OS・CPU ISA を横断してビット単位で同一である | 16体 2D アリーナ Form（`Q32.32` 固定小数点、`732` バイトの状態）を `arm64` macOS、`aarch64` Linux、AMD/Intel `x86_64` Linux、Tiger Lake `x86_64` Windows 11 上で実行 | Rust、Wasm32、C++20（`Clang`/`GCC`/`MSVC`）、Node.js `BigInt`、Python 3 にわたる $10^5$ ティックの $H(s_t)$（`30` セル） | 任意の `(host, target)` セルの任意のチェックポイントでハッシュ不一致が生じた場合 | **実施済み（`3` OS・`3` ISA にわたり `0 / 25,500` 件の不一致、第6.1節）** |
| GE-H2 | 厳密モードと、3 OS・クロス ISA における浮動小数点の境界およびライブラリ/FMA によるドリフトとの比較 | 16体 2D カオティックアリーナ（`arm64` macOS、`aarch64` Linux、`x86_64` Linux、`x86_64` Windows 11 にわたる `25,000` ティック） | 厳密な `f64`、3 OS の `UCRT`/`libSystem`/`glibc` による `sin/cos`、`MSVC` 対 `Clang` の `FMA`、V8 の `Math.sin`、および `f32` にわたる厳密な乖離ティック `t_div` | 固定された代数演算の下での予期しない不一致、または予測されなかった無音のドリフト | **`macOS`、`Linux`、`Windows 11` にわたり実施済み（第6.2節）** |
| GE-H3 | GPU・API を横断したレンダリングは有界な許容誤差内に収まる（`wgpu` / WGSL） | 正準 `Q32.32` 状態 4 件（`t = 0, 250, 1k, 10k`）を、`8` 個の `GPU × API` エンドポイント（`DX12`、`Metal`、`Vulkan`）、`WARP`、`llvmpipe`、`CPU Q16.16` 上で `512×512` の `RGBA8Unorm` にレンダリング | フレームバッファの `SHA-256`、差分ピクセルの `%`、$\Delta_{\max}$、MAE、RMSE、`PSNR`、`SSIM` | いずれかの物理 GPU の組で `PSNR > 40 dB`、`SSIM > 0.999`、または $p(\Delta > 8) \le 0.001$ を満たさない場合 | **実施済み（`28/28` の組、すなわち `112/112` フレームが合格基準を満たす：`PSNR ≥ 64.16 dB`、`SSIM ≥ 0.99983`、第6.3節）** |
| GE-H4 | Form で符号化された規則は、GameRule と同程度にコードを削減する | Haunted Jaunt、Survival Shooter、Tanks の振る舞い | 振る舞いコードの行数 | 削減率が 50% 未満である場合（GameRule は 81.3% に到達） | 未着手 |
| GE-H5 | Form ランタイムは GameRule の上限を超える | 合成アクタのスケーリング | アクタ数 $N$ に対するステップ時間 | $N = 350$ 未満で、ステップ時間が 20 ms を超える場合 | 未着手 |
| GE-H6 | インタフェース検査は実際の欠陥を検出する | Mage の 26 パターン、および注入されたバインディングおよびスキーマの欠陥 | 検出率、メカニズム F1 | 注入された欠陥の検出率が 90% 未満である場合、または F1 が IR を用いない場合の 0.12 を上回らない場合 | 未着手 |
| GE-H7 | Summer Engine のテンプレートに対する完全な $\ln(\Delta/\delta_0)$ の傾き掃引 | 物理演算を多用する Summer Engine のテンプレートを Form として再表現したもの | 注入された $\delta_0$ に対する乖離時刻 | $t^{*}$ と $\ln(1/\delta_0)$ の傾きが 0 と区別できない場合 | 未着手 |
| GE-H8 | リプレイは完全である | 1 時間分の記録されたセッション | $D$ のみから再現された最終ハッシュ | $D$ に含まれない状態を必要とするリプレイが存在する場合 | 未着手 |
| GE-H9 | ベンチマークの同等性 | Form-to-Godot エミッタを経由した GameCraft-Bench の 140 タスク | ネイティブ Godot による提出との合格率の比較 | 振る舞いが同一の入力に対して合格率が低い場合 | 未着手 |

![決定性境界を横断する2パネルの実証的要約。左パネルは厳密領域 GE-H1 (arm64 macOS、aarch64 Linux、AMD/Intel x86_64 Linux、Intel x86_64 Windows 11 の4環境、30セルにわたる25,500個の SHA-256 チェックポイントで不一致0件) と GE-H2 の3 OS における f64 発散時刻 (Windows UCRT と Apple libm の sin/cos を GNU glibc と比較した場合は t_div = 10、Windows UCRT と Apple libm の比較では t_div = 37、MSVC /fp:precise と Clang -ffp-contract=fast の比較では t_div = 192、x86_64 VFMADD と arm64 FMADD の比較では t_div = 406) を示す。右パネルは許容領域 GE-H3 の最小 PSNR 棒グラフであり、DirectX 12、Metal、Vulkan にまたがる8つのハードウェア GPU × API の組み合わせを示す。同一 GPU 上での DX12 と Vulkan のコンパイラ差異 (RTX 2060 で 108.3 dB、Iris Xe で 79.5 dB) と、ベンダー間のラスタライズ差異 (64.2 から 72.1 dB) を分離しており、いずれも 40 dB のゲート値を大きく上回る。](/figures/game-engines/cross-gpu-tolerance.svg)

*図3. `GE-H1`、`GE-H2`、`GE-H3` にわたる経験的境界。上流の `Q32.32` シミュレーション状態（`S`）は、6台のマシン、3種のOS（`macOS`、`Linux`、`Windows 11`）、3種のISAにまたがって `0 / 25,500` の `SHA-256` チェックポイント不一致を達成する。一方、固定されていない `f64` の `sin/cos` と `FMA` は、OS・コンパイラ・ISAの境界をまたぐと `10` から `406` ティック以内に乖離する。$\lambda(s_t)$ の下流では、同一の Windows 11 GPU上で `DirectX 12` と `Vulkan` を切り替えると、シェーダーのローワリングにより 1 LSB の差が生じる（`79.5-108.3 dB` の PSNR）。その一方で、全 `28 / 28` のハードウェア `GPU × API` の組み合わせは、いずれも `64.16 dB` を厳密に上回る PSNR と、0.99983 を上回る SSIM を維持した（`measured_j = None`、`board_metered = false`）。*

<div id="61-ge-h1-three-os-and-three-isa-100000-tick-determinism-q3232-integer-physics" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `GE-H1`: 3OSおよび3ISAにおける100,000ティック決定性 (`Q32.32`整数物理)

*`PREREG_wave3_multi_isa_wgpu.json` (`SHA-256: 1721e5bdffaf...`) の下で事前登録済みである。テレメトリは `SATB` レベル `L2` と `L3` の `reported_j` を厳密に分離する (`L2`: Linux `/sys/class/powercap/intel-rapl:0/energy_uj` ソケット/パッケージおよびコアカウンタ; `L3`: macOS per-PID `proc_pid_rusage(child_pid, RUSAGE_INFO_V6).ri_energy_nj` および Windows 11 上の Win32 `GetProcessTimes` と `QueryProcessCycleTime` による活動量計測; ただし特権のないリング3 `RAPL` `MSR` アクセスがブロックされるため `measured_j = None`, `board_metered = false` である)。対話的エクスプローラおよび生JSON: [`/living/game-engines/`](/living/game-engines/) ([`results.json`](/living/game-engines/results.json))。*

16体 + 4ピックアップの 2D 弾性衝突およびクールダウン FSM アリーナ Form（座標は `[-64, +64]` の `Q32.32` 符号付き 64 ビット固定小数点、`128` ビット中間積、整数床平方根 `isqrt_u128`、構造ピックアップの遅延リスポーン、`732` バイトのリトルエンディアン正規状態ベクタ）を `100,000` ティック実行した。対象は **6 台のマシン、3 種類の ISA（`arm64`/`AArch64`、`x86_64`、`wasm32`）、3 種類の OS（`macOS 27.2.1`、`Ubuntu Linux 6.8 / 7.0`、`Microsoft Windows 11 Pro` ビルド `26300`）および 7 種類の言語/コンパイラ投影（`30` ターゲット × ホストセル）** である。

| ホスト（`ISA` · `OS`） | 対象射影 | 実時間 ms / `100k`（平均 ± 標準偏差） | `ns / tick` | 計測チャネル（`reported_j`） | `reported_j` / `100k`（J） | 検証済み `SHA-256` チェックポイント |
|---|---|---:|---:|---|---:|:---:|
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `rust_native`（`rustc 1.100 -O`） | `22.333 ± 5.043` | `223.3` | `L3` プロセス別 `ri_energy_nj` | **`0.1028 ± 0.0247`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `cpp20_clang_o3`（`Apple Clang 21`） | `21.022 ± 1.657` | `210.2` | `L3` プロセス別 `ri_energy_nj` | **`0.1090 ± 0.0134`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `rust_wasm32_node`（`Node v26.13`） | `84.300 ± 11.334` | `843.0` | `L3` プロセス別 `ri_energy_nj` | **`0.4480 ± 0.0881`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `javascript_bigint_node`（`ES2024`） | `717.955 ± 36.304` | `7,179.6` | `L3` プロセス別 `ri_energy_nj` | **`4.4021 ± 0.4048`** | `100 / 100`（`stride 1,000`） |
| **Apple M5 Max**（`arm64` · `macOS 27.2.1`） | `python_3_13`（`CPython 3.13.14`） | `2,945.816 ± 284.033` | `29,458.2` | `L3` プロセス別 `ri_energy_nj` | **`13.5999 ± 1.9086`** | `100 / 100`（`stride 1,000`） |
| **Apple M3 Ultra**（`arm64` · `macOS 27.2.1`） | `rust_native` / `cpp20_clang_o3` | `32.711` / `33.727` | `327.1` / `337.3` | `L3` プロセス別 `ri_energy_nj` | **`0.0729` / `0.0755`** | `2 × 1,000 / 1,000`（`stride 100`） |
| **AMD Ryzen AI Max+ 395**（`Zen 5` `x86_64` · `Linux 7.0`） | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `21.793` / `23.061` / `26.677` | `217.9` - `266.8` | `L2` AMD RAPL パッケージ（コア `0.13`-`0.21 J`） | **`1.958` / `2.349` / `2.932`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **AMD Ryzen AI Max+ 395**（`Zen 5` `x86_64` · `Linux 7.0`） | `rust_wasm32` / `js_bigint` / `python_3_14` | `145.29` / `1,347.80` / `2,546.42` | `1,452.9` - `25,464.2` | `L2` AMD RAPL パッケージ（コア `1.01`-`12.23 J`） | **`14.44` / `115.81` / `181.87`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **Intel Core i9-13900H**（`Raptor Lake` `x86_64` · `Linux 7.0`） | `rust_native` / `cpp20_clang_o3` / `cpp20_gcc_o3` | `39.718` / `36.868` / `58.792` | `368.7` - `587.9` | `L2` Intel RAPL パッケージ（コア `1.64`-`2.68 J`） | **`2.062` / `1.888` / `3.026`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **Intel Core i9-13900H**（`Raptor Lake` `x86_64` · `Linux 7.0`） | `rust_wasm32` / `js_bigint` / `python_3_14` | `158.35` / `1,390.46` / `3,375.07` | `1,583.5` - `33,750.7` | `L2` Intel RAPL パッケージ（コア `5.65`-`124.90 J`） | **`6.89` / `60.79` / `149.48`** | `3 × 1,000 / 1,000`（`stride 100`） |
| **NVIDIA Jetson Thor**（`Armv9-A` `aarch64` · `Linux 6.8`） | `rust_native` / `clang` / `gcc` / `wasm32` / `js` / `py3.12` | `39.28`（`GCC`） - `4,407.89`（`Py`） | `392.8` - `44,078.9` | CPU のみ（`reported_j = null`、GPU は未計測） | `null` | `6 × 1,000 / 1,000`（`stride 100`） |
| **Intel Core i7-1165G7**（`Tiger Lake` `x86_64` · `Windows 11 26300`） | `rust_native`（`x86_64-pc-windows-msvc`） / `cpp20_msvc_o2`（`cl.exe 19.44`） | `49.730 ± 1.727` / `343.363 ± 3.827` | `497.3` / `3,433.6` | Win32 `L3` サイクル数（`138.9M` / `958.9M`；CPU `RAPL` はブロック） | `null` | `2 × 1,000 / 1,000`（`stride 100`） |
| **Intel Core i7-1165G7**（`Tiger Lake` `x86_64` · `Windows 11 26300`） | `rust_wasm32`（`Node v26.13`） / `js_bigint` / `python_3_10` | `198.01` / `1,776.96` / `8,899.23` | `1,980.1` - `88,992.3` | Win32 `L3` サイクル数（`553.8M` - `24,722.2M`；CPU `RAPL` はブロック） | `null` | `3 × 1,000 / 1,000`（`stride 100`） |

- **判定**: **`PASS_ZERO_MISMATCHES`(`30` セルにわたる検証済み `SHA-256` チェックポイント `0 / 25,500` 件、ならびに `macOS`、`Linux`、`Windows 11` にまたがる `25` の全トレースセルにおけるストライド `100` の対比較 `0 / 300,000` 件)**。すべてのホストにおけるすべてのターゲットが、tick `100` で `2683c3f7cb8b...`、tick `1,000` で `21fa688e4ee8...`、tick `50,000` で `ea01ba793841...`、tick `100,000` で `82e404df6475d64d...` を生成した。
- **Windows における `MSVC` `<__msvc_int128.hpp>` と `LLVM` `i128` のコード生成の比較**: ベアメタルの Windows 11 (`x86_64` `PE`) 上では、`MSVC` (`cl.exe 19.44.35207 /std:c++20 /O2 /fp:strict`) は組み込みの `__int128` スカラー型を備えておらず、`<__msvc_int128.hpp>` の `std::_Signed128` および `std::_Unsigned128` の演算を複数ワードのライブラリルーチンへと lower する。その結果、10 万 tick あたり `343.36 ms`、`958.9M` CPU サイクルを要し、`rustc 1.100` の LLVM ネイティブ `x86_64-pc-windows-msvc` (`49.73 ms`、`138.9M` サイクル) に比べて `6.90×` 遅く、`Node.js` の `Wasm32` JIT (`198.01 ms`) に比べて `1.73×` 遅い。それでも、全 `1,000` チェックポイントにおいて `100%` のビット単位の状態一致を保持する。
- **`macOS`、`Linux`、`Windows 11` にわたるテレメトリの対象範囲**: `L2` チャネルと `L3` チャネルを混同してはならない理由に注意が必要である。Apple の `L3` `ri_energy_nj` は CPU コアのエネルギーを、ベンチマーク対象の子 PID のみに厳密に帰属させる(ネイティブの Rust/C++ で `0.073`-`0.109 J`)。Linux の `/sys/class/powercap/intel-rapl:0` (`L2`) はソケット全体のパッケージ電力を積算する(パッケージで `1.89`-`2.06 J`、`core` で `0.13`-`1.83 J`)。Windows `NT 10.0.26300` は、ring-0 のカーネルドライバなしでは非特権のユーザモードからの Intel `RAPL` `MSR` 読み取りをブロックする一方で、`QueryProcessCycleTime` により PID 単位の正確な `L3` サイクル数を提供する。

<div id="62-ge-h2-three-os-and-cross-isa-25000-tick-floating-point-drift-ieee-754-f64" class="anchor-alias" aria-hidden="true"></div>

### 6.2 `GE-H2`: 3OSおよびクロスISAにおける25,000ティックの浮動小数点ドリフト (`IEEE 754` `f64`)

`IEEE 754` `binary64` (`f64`) シミュレーションが `-ffast-math` および `/fp:fast` を*禁止*した場合に `Windows 11`、`macOS`、および `Linux` (`x86_64` および `arm64`/`aarch64`) 間で同期を維持するかどうかを検証するため、同一の16体カオスアリーナを25,000ティック (`60 Hz` で `~6.94` 分) ステップ実行し、すべてのティックにおいて正準 `IEEE 754` ビット (`t_div_ieee_bits`)、量子化された `10^-3` アリーナ単位位置 (`t_div_macro_1e3`)、および離散的なゲームプレイ状態 (`t_div_gameplay`) をハッシュ化した。

| ホスト / ターゲット A | ホスト / ターゲット B | 摂動メカニズム | `t_div_ieee_bits` | `t_div_macro_1e3` | `t_div_gameplay` |
|---|---|---|---:|---:|---:|
| `Windows 11 x86_64` (`MSVC /fp:strict`, `Rust`, `V8`, `Py`) | `arm64 macOS` & `x86_64`/`aarch64 Linux` (`Clang`/`GCC`/`Rust`) | 3-OS と 3-ISA の `f64` と `f32` 代数演算 + `sqrt`, `FMA` 無効 (`/fp:strict`, `-ffp-contract=off`, 三角関数なし) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| `x86_64 Linux glibc 2.43` (`f64_trig`) | `aarch64 Linux glibc 2.39` (`f64_trig`) | クロス ISA Linux GNU `glibc` `std::sin/cos` (`-ffp-contract=off`, `-ffast-math` 無し) | `None (>25,000)` | `None (>25,000)` | `None (>25,000)` |
| **`Windows 11 x86_64 UCRT` (`MSVC /fp:strict` & `Rust`)** | **`x86_64 Linux GNU glibc 2.43` (`Clang` & `Rust`, `-ffp-contract=off`)** | **クロス OS 同一 ISA (`x86_64`) `std::sin/cos` (`ucrtbase.dll` vs `glibc`, fast-math 無し)** | **`10`** (`0.17 s`) | **`7,899`** | **`10,392`** (`173.2 s`) |
| **Apple `arm64` macOS (`f64_trig`, `-ffp-contract=off`)** | **AMD/Intel `x86_64` & Thor `aarch64` Linux (`f64_trig`, `-ffp-contract=off`)** | **クロス OS 標準 `libm` `std::sin/cos` (`Apple libSystem` vs `GNU glibc`, `-ffast-math` 無し)** | **`10`** (`0.17 s`) | **`5,900`** | **`9,798`** (`163.3 s`) |
| **`Windows 11 x86_64 UCRT` (`MSVC /fp:strict` & `Rust`)** | **Apple `arm64` macOS (`libSystem`, `-ffp-contract=off`)** | **クロス OS・クロス ISA `std::sin/cos` (`Windows UCRT` vs `Apple libSystem`, fast-math 無し)** | **`37`** (`0.62 s`) | **`5,900`** | **`9,798`** (`163.3 s`) |
| **`Windows 11 MSVC` (`/O2 /arch:AVX2 /fp:precise` default)** | **`x86_64 Linux Clang 21` (`-O3 -mavx2 -mfma -ffp-contract=fast` default)** | **クロスコンパイラ `x86_64` `FMA` デフォルト (`MSVC /fp:precise` 無契約 vs `Clang` `FMA`, 代数のみ)** | **`192`** (`3.20 s`) | **`5,927`** | **`8,869`** (`147.8 s`) |
| **`x86_64` Linux (`-O3 -mavx2 -mfma -ffp-contract=fast`)** | **Apple `arm64` & Thor `aarch64` (`-O3 -ffp-contract=fast`)** | **クロス ISA `FMA` 降格 (`x86_64 VFMADD/VFNMADD` vs `AArch64 FMADD/FMSUB`, 代数のみ, `-ffast-math` 無し)** | **`406`** (`6.77 s`) | **`7,422`** | **`11,205`** (`186.8 s`) |
| **`Windows 11` & `Linux x86_64` `Node.js` (`V8 Math.sin/cos`)** | **`macOS arm64` & `Linux aarch64` `Node.js` (`V8 Math.sin/cos`)** | **クロス ISA Node.js V8 `Math.sin/cos` (`0` ドリフト Win11 vs Linux `x86_64`; arm64/aarch64 では乖離)** | **`66`** (`1.10 s`) | **`7,617`** | **`10,093`** (`168.2 s`) |
| **`cpp_f64_strict` (`/fp:strict`, `-ffp-contract=off`)** | **`MSVC /fp:fast`, `Rust mul_add`, or `Clang -ffast-math`** | **同一ホスト `FMA` 縮約 (`/fp:strict` vs `/fp:fast` または明示的 `mul_add`)** | **`192`** (`3.20 s`) | **`5,927`-`6,576`** | **`8,869`-`10,093`** |
| **`cpp_f64_strict` / `trig`** | **`cpp_f32_strict` / `trig`** | **精度ステップダウン (`binary64` `f64` vs `binary32` `f32`)** | **`1`** | **`8`-`9`** | **`1,370`-`2,240`** |

1. **IEEE 754-2008 の `+`、`-`、`*`、`/`、`sqrt` は、`FMA` を無効化した状態（`/fp:strict` および `-ffp-contract=off`）では、`x86_64` と `arm64`/`aarch64` の両ISAにおいて、`Windows 11`、`macOS`、`Linux` の間でビット単位の移植性を持つ**（`MSVC`、`Clang`、`GCC`、`Rustc`、`V8`、`CPython` にわたる `25,000` ティックで不一致は `0` 件）。これは、この5つの演算がいずれも `0.5` ULP への丸めを義務づけられているためである。

2. **3大OSの数学ライブラリ（`Windows UCRT`、`macOS libSystem`、`Linux GNU glibc`）は、厳密な `f64`（fast-math 無効）のもとで、両対ごとに乖離する三角形を形成する**。同一の `x86_64` ISA であっても、Windows の `ucrtbase.dll`（`10.0.26100.9711`）は Linux の `glibc 2.43` とティック `10`（`t_div_gameplay = 10,392`）で乖離する。また、`Windows UCRT` は `Apple libSystem` とティック `37`（`t_div_gameplay = 9,798`）で乖離し、`Apple libSystem` は `glibc` とティック `10`（`t_div_gameplay = 9,798`）で乖離する。Windows 11 内では、`MSVC /fp:strict`、`Rust x86_64-pc-windows-msvc`、`CPython 3.10` がいずれも `ucrtbase.dll` にリンクし、`> 25,000` ティックにわたって一致する（`b1fbc91788a59cff`）一方、Windows 上の `Node.js V8` とはティック `149` で乖離する。

3. **既定のコンパイラにおける `FMA` の方針は、同一の `x86_64` ISA 上でも `MSVC` と `Clang` の間で乖離し（`t = 192`）、`x86_64` と `AArch64` の間でも乖離する（`t = 406`）**。`MSVC` の既定である `/O2 /arch:AVX2 /fp:precise` は `a + b * c` を縮約しない（`/fp:strict` と `> 25,000` ティックにわたり同一）。そのため、`Clang 21` の既定である `-O3 -mavx2 -mfma`（既定で `-ffp-contract=fast` が有効）とはティック `192`（`t_div_gameplay = 8,869`）で乖離する。両コンパイラがともに縮約を有効にした場合でも、LLVM は符号反転を伴う乗算減算の lowering を `x86_64`（`VFMADD`/`VFNMADD`）と `AArch64`（`FMADD`/`FMSUB`）で異なるように行い、ティック `406`（`t_div_gameplay = 11,205`）で乖離する。

4. **JavaScript V8 の `Math.sin`/`Math.cos` は、`x86_64` 上では OS に依存しない**（`Windows 11 Node v26.13` は `> 25,000` ティックにわたり `Linux x86_64 Node v22.22` と一致する）。一方で、ISA には依存する（`x86_64` と `arm64`/`aarch64` はティック `66` で乖離する）。

<div id="63-ge-h3-three-os-three-api-headless-wgpu-directx-12--metal--vulkan-rendering-tolerance" class="anchor-alias" aria-hidden="true"></div>

### 6.3 `GE-H3`: 三 OS・三 API にまたがるヘッドレス `wgpu`（`DirectX 12` / `Metal` / `Vulkan`）のレンダリング許容誤差

図1の右側に対応する許容誤差の領域を、主要なデスクトップ向けグラフィックス API の三者すべてについて検証するため、`ge_h3_wgpu_bench`（`wgpu v22.1.0` を `Backends::DX12 | Backends::VULKAN | Backends::METAL` 指定で使用）は、4 つの標準的な `Q32.32` シミュレーションスナップショット（`ticks 0, 250, 1,000, 10,000`）を、同一の二パス WGSL シェーダを用いて `512×512` の `RGBA8Unorm` フレームバッファ（`262,144` ピクセル、`1,048,576` バイト/フレーム）へ描画した。描画は **8 つのハードウェア `GPU × API` エンドポイント**（`Apple M3 Ultra Metal`、`AMD Radeon 8060S Linux RADV Vulkan`、`Intel Iris Xe RPL-P Linux ANV Vulkan`、`NVIDIA RTX 4050 Linux Vulkan`、`NVIDIA RTX 2060 Win11 DirectX 12`、`NVIDIA RTX 2060 Win11 Vulkan`、`Intel Iris Xe TGL Win11 DirectX 12`、`Intel Iris Xe TGL Win11 Vulkan`）に加え、**`Microsoft Basic Render Driver`（`Win11 DirectX 12 WARP`）**、**`Mesa llvmpipe`（`Linux CPU Vulkan`）**、そして浮動小数点を一切用いない整数参照ラスタライザである **`CPU Q16.16`** において実施した。

| アダプタ A (`OS` · `API` · ドライバ) | アダプタ B (`OS` · `API` · ドライバ) | 平均異なる画素数 (`%`) | 最大 $|\Delta|$ (`0..255`) | 平均 MAE (`u8`) | 平均 RMSE (`u8`) | 最小 `PSNR` (`dB`) | 最小 `SSIM` | `GE-H3` ゲート |
|---|---|---:|---:|---:|---:|---:|---:|:---:|
| **NVIDIA RTX 2060 (`Win11 DirectX 12` · `591.74`)** | **NVIDIA RTX 4050 (`Linux Vulkan` · `595.99.02`)** | **`0.000%`** (`0` px) | **`0`** | `0.00000` | `0.00000` | **`∞` (`4/4` exact)** | **`1.000000`** | **Pass** |
| **NVIDIA RTX 2060 (`Win11 DirectX 12` · `HLSL`/`DXIL`)** | **NVIDIA RTX 2060 (`Win11 Vulkan` · `SPIR-V`)** *(同一 GPU)* | **`0.0002%`** (`0-1` px) | **`1`** | `0.000001` | `0.00049` | **`108.34`** | **`1.000000`** | **Pass** |
| **Intel Iris Xe (`Win11 DirectX 12` · `31.0.101.3222`)** | **Intel Iris Xe (`Linux Vulkan` · Mesa `ANV` 26.0.8)** | `0.0003%` | `1` | `0.000001` | `0.00059` | **`105.33`** | **`1.000000`** | **Pass** |
| **Intel Iris Xe (`Win11 DirectX 12` · `HLSL`/`DXIL`)** | **Intel Iris Xe (`Win11 Vulkan` · `SPIR-V`)** *(同一 GPU)* | **`0.283%`** (`729-758` px) | **`1`** | `0.00071` | `0.02665` | **`79.52`** | **`0.999996`** | **Pass** |
| **Apple M3 Ultra (`macOS Metal` 4)** | **Intel Iris Xe (`Win11 DirectX 12` / `Linux ANV Vulkan`)** | `1.301%` | `2` | `0.00386` | `0.06215` | **`72.06`** | **`0.999986`** | **Pass** |
| **Apple M3 Ultra (`macOS Metal` 4)** | **Intel Iris Xe (`Win11 Vulkan` · `31.0.101.3222`)** | `1.573%` | `2` | `0.00455` | `0.06743` | **`71.39`** | **`0.999982`** | **Pass** |
| **AMD Radeon 8060S (`Linux Vulkan` · Mesa `RADV`)** | **Apple M3 Ultra (`macOS Metal` 4)** | `3.103%` | `1` | `0.00788` | `0.08876` | **`69.09`** | **`0.999956`** | **Pass** |
| **AMD Radeon 8060S (`Linux Vulkan` · Mesa `RADV`)** | **Intel Iris Xe (`Win11 DirectX 12` / `Win11 Vulkan`)** | `3.774%` / `3.565%` | `2` | `0.01022` / `0.00968` | `0.10116` / `0.09844` | **`67.97`** / **`68.20`** | **`0.999951`** | **Pass** |
| **AMD Radeon 8060S (`Linux Vulkan` · Mesa `RADV`)** | **NVIDIA RTX 2060 (`Win11 DX12` / `Vulkan`) & RTX 4050** | `6.554%` | `2` | `0.01735` | `0.13180` | **`65.64`** | **`0.999874`** | **Pass** |
| **NVIDIA RTX 2060 (`Win11 DirectX 12`)** | **Intel Iris Xe (`Win11 DirectX 12`)** *(同一 Win11 ホスト)* | `8.279%` | `2` | `0.02149` | `0.14667` | **`64.79`** | **`0.999844`** | **Pass** |
| **Apple M3 Ultra (`macOS Metal` 4)** | **NVIDIA RTX 2060 (`Win11 DX12` / `Vulkan`) & RTX 4050** | `9.337%` | `2` | `0.02467` | `0.15721` | **`64.16`** | **`0.999833`** | **Pass** |
| **Apple M3 Ultra (`macOS Metal` 4)** | **`Microsoft WARP` (`Win11 DirectX 12` CPU)** | `0.003%` | `1` | `0.000008` | `0.00271` | **`98.79`** | **`1.000000`** | **Pass** |
| **`Microsoft WARP` (`Win11 DirectX 12` CPU)** | **`Mesa llvmpipe` (`Linux LLVM 21.1.8` CPU `Vulkan`)** | `1.591%` | `2` | `0.00543` | `0.07359` | **`70.35`** | **`0.999983`** | **Pass** |
| ハードウェア GPU (`8` エンドポイント `DX12`/`Metal`/`Vulkan` 間) | **`CPU Q16.16` ゼロ浮動小数点整数参照 (`4` ホスト)** | `20.400%` - `27.626%` | `2` | `0.05612` - `0.07864` | `0.23689` - `0.28068` | `59.13` - `60.58` | `0.999556` - `0.999693` | **Pass** |

- **同一GPU上での`DX12`(`HLSL`/`DXIL`)と`Vulkan`(`SPIR-V`)のドリフトの切り分け: 物理GPUに由来する差異の分離**: 同一のWindows 11マシン上で、同一の物理GPUを`DirectX 12`と`Vulkan`で比較することにより、コンパイラの変換処理(`Naga`による`WGSL -> HLSL`と`WGSL -> SPIR-V`)とハードウェアのSFUやROPの設計に由来する差異を切り分けた。`NVIDIA GeForce RTX 2060`では、`Win11 DirectX 12`と`Win11 Vulkan`がティック`0`および`250`でビット単位で同一の`SHA-256`フレームバッファを生成した。一方、ティック`1,000`および`10,000`では、斜めに入射する鏡面反射の1ピクセルにおいて`1` LSBの差異が生じた(平均差異`0.0002%`、`PSNR` `108.34 dB`)。また、`RTX 2060 (Win11 DirectX 12)`は`RTX 4050 (Linux Vulkan)`と`4 / 4`フレームすべてでビット単位で一致した(差異ピクセル`0`。Turingと Ada Lovelace の比較、およびWindowsの`DX12`とLinuxの`Vulkan`の比較にまたがる)。`Intel Iris Xe Graphics`(`Tiger Lake`)では、`Win11 DirectX 12`と`Win11 Vulkan`の間で、全4フレームにわたり`0.283%`のピクセルが異なった(`PSNR` `79.52 dB`、$\Delta_{\max} = 1$)。これに対し、`Win11 DirectX 12`と`Linux Mesa ANV Vulkan`の間の差異は`0.0003%`にとどまり(`105.33 dB`、ティック`0`および`1,000`ではビット単位で同一)であった。
- **全`28 / 28`のハードウェア`GPU × API`組合せ(`112 / 112`フレーム)における許容誤差の有界性の確認**: `27 / 28`のハードウェア端点の組合せでは、生の`RGBA8`の`SHA-256`ダイジェストが異なった。しかし、`DirectX 12`、`Metal`、`Vulkan`にまたがるいずれのハードウェアの組合せにおいても、`2 / 255`を超えて異なったピクセルは皆無であった($p(|\Delta| > 8) = 0.000000 \le 0.001$)。`PSNR`は`64.16 dB`を超え(`> 40.0 dB`の判定基準を`+24.16 dB`上回る)、`SSIM`は`0.999833`を超えた(`> 0.999`の判定基準)。処理時間はフレームあたり`0.29`-`6.04 ms`であった。
- **ソフトウェアラスタライザとの対比(`WARP`、`llvmpipe`、`CPU Q16.16`)**: CPU上で動作するソフトウェアのGPU APIエミュレータであっても、APIごとに結果は乖離する。`Microsoft Basic Render Driver`(`Win11 DirectX 12 WARP`)と`Mesa llvmpipe`(`Linux Vulkan`)の間では、1.591%のピクセルが異なった(`PSNR` `70.35 dB`、$\Delta_{\max} = 2$)。これに対し、浮動小数点演算を用いない整数ソフトウェアラスタライザ`CPU Q16.16`は、4つのOS/ISAホスト(`macOS arm64`、`Linux AMD x86_64`、`Linux Intel x86_64`、`Windows 11 x86_64`)にわたり、`SHA-256`フレームバッファの不一致を**0件**に抑えた(ティック`0`では`9c693a38...`、ティック`10,000`では`ce3b2cec...`)。

<div id="64-playable-joule-native-q3232-chrono-budget-arena-livinggame-engines" class="anchor-alias" aria-hidden="true"></div>

### 6.4 プレイ可能な joule ネイティブ `Q32.32` Chrono-Budget アリーナ（`/living/game-engines/`）

本研究の厳密な `Q32.32` 再生契約と、[『Time as an Index』](/papers/time-as-an-index/)（第9.2節）のエネルギーネイティブな時間機構を結合し、[ゲームエンジン実験場（`/living/game-engines/`）](/living/game-engines/)の計器4は、JavaScript の `BigInt` で動作する `60 Hz` の決定論的軌道航行およびピックアップ防衛ミニゲームを提供する(シミュレーション内の浮動小数点演算は `0` 回である)。

- **ライブ `SHA-256` 状態テープと決定論的再生**: 各ティックでローリング `SHA-256` 状態ダイジェストを更新し、コンパクトな1バイトのプレイヤー入力イベントを $D$ に記録する。`Replay & Verify SHA-256` をクリックすると、`(seed, D)` から試合全体を再実行し、ビット単位のハッシュ一致(`replayed_sha256 === live_sha256`)を検証する。
- **joule 予算に基づく時間的先読みと巻き戻し(`est_j` 設計モデル)**: 将来の軌道の照会(`Hellman Branch Preview`。`K` ティック先までの候補操舵分岐 `3` 本をシミュレートする)や、永続的な因果チェックポイントへの巻き戻しは、明示的なマイクロジュール(`µJ`)のバッテリーを消費する。消費量は、投機的ティックごとの `step_cost_uj` と、選択されなかった未来や巻き戻された時間線を破棄する際のランダウアー消去コストから成る。操作はキーボード、マウス/タッチ、および `WebXR` / `Gamepad` コントローラー(Meta Quest Browser を含む)で行える。

<div id="7-infeasibility-flags" class="anchor-alias" aria-hidden="true"></div>

## 7. 実現不可能性の判定

1. **GPU とグラフィックス API をまたぐビット単位で一致するハードウェア描画：実現不可能**。ハードウェアの `GPU × API` 組合せ `28` 通りのうち `27` 通りが、`GE-H3` において生の `SHA-256` で発散した（同一 GPU 上の `DirectX 12` と `Vulkan` の組合せ `2` 通りを含む `2 / 2`）。一方、GPU の出力が $S$ へフィードバックされない場合、有界な知覚的許容誤差（`PSNR >= 64.16 dB`、`SSIM >= 0.99983`、$\Delta_{\max} \le 2$）は `DirectX 12`、`Metal`、`Vulkan` の全域で成立する。

2. **標準的な浮動小数点設定による、プラットフォームをまたぐ厳密な物理演算：`Windows`、`macOS`、`Linux` の間では実現不可能**。`-ffast-math` や `/fp:fast` を用いない場合でも、標準の `std::sin`/`std::cos` は `Windows UCRT`、`Apple libSystem`、`GNU glibc` の間で3者間の発散の三角形を形成する（`t_div = 10` から `37`）。また、既定の `MSVC /fp:precise` と `Clang -ffp-contract=fast` は `x86_64` 上で `t_div = 192` において発散し、ISA をまたぐ `FMA`（`x86_64` と `arm64`）は `t_div = 406` において発散する。これらは `8,869` から `11,205` ティック以内にゲームプレイの非同期化へと波及する（`GE-H2`）。

3. **シミュレーション内部における GPU 計算：厳密な意味では実現不可能であり、決定論的リダクションを用いる場合に限り実現可能**。これは引用されたハードウェア上で約 0.2% から 7.8% のコストが測定されている。ただし、各命令に対してコンパイラの演算融合（contraction）を抑止（SPIR-V NoContraction）しない限り、すべての対象環境においてコンパイラによる演算融合の影響を受ける。

4. **エンジン間で移植可能な振る舞い：読み込んだ外部資料では実証されていない。2D 物理カーネルの水準では `GE-H1` において実証されており、これは `30` 通りの対象×ホストの組合せ（`6` 台のマシン、`3` 種の OS `macOS`/`Linux`/`Windows 11`、`3` 種の ISA、`7` 種のランタイム/コンパイラ）にわたる。ただし、エンジン全体への投影（`GE-H4`、`GE-H9`）は未解決のままである。**

5. **大量のアクタ数における解釈されたルール：制約がある**。GameRule の測定結果から、20 ms において約 300 アクタ付近に上限があることが示唆される。また `GE-H1` は、Python の `int` が Linux/macOS において native Rust の `reported_j` の `73×` から `132×` のコストを要し、Windows 11 においては壁時計時間で `179×` を要することをさらに示す。規模を拡大する場合には、コンパイル済みのネイティブ実装または WebAssembly への投影が必要である。

6. **厳密な対象としての、プロプライエタリなサードパーティ製ゲームエンジン：未検証**。第6節においてベアメタルの Windows 11 `PE`（`rustc` および `MSVC`）と `DirectX 12`（`wgpu`）による実行は検証されている一方、GameRule が引用する Unity のマニュアルは順序保証を否定している。また、Unity および Unreal のテンプレートカタログは読み込めなかった（当該ページがクライアントサイドで描画されるため）。さらに、Unreal の実行順序に関する資料は一件も読み込めていない。

<div id="8-sources-and-limits" class="anchor-alias" aria-hidden="true"></div>

## 8. 出典と限界

上記のすべての情報源は、引用された箇所において全文を読んだが、以下を除く：GameCraft-Bench 論文（要旨およびリポジトリの README を読んだ）、RCE の概要ページ（要約ページを読んだ）、および Capcom のプレスストーリー（1 記事）。テレメトリレベル（`SATB`）とジュール予算制御の時間的ゲームメカニクスに関する同伴ハウスの研究は、[Time as an Index](/papers/time-as-an-index/) と [Satiation Tiered Benchmark Harness](/papers/satb-harness/)（`[same house]`）である。証拠として引用されなかったが参照した情報源は、ゲームを構造化されたルーデムの集合として記述する [Ludii portal](https://ludii.games/) 、Game Grammar のホビーリポジトリ、そしてレンダリングライブラリを記述する [PlayCanvas](https://github.com/playcanvas/engine)、[Babylon.js](https://github.com/BabylonJS/Babylon.js) および [three.js](https://github.com/mrdoob/three.js) の README である。

未読、課金壁またはその他入手できない情報源は、T. Schaul, "A Video Game Description Language for Model-based or Interactive Learning," IEEE CIG 2013, doi:10.1109/CIG.2013.6633610; J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845; M. Ebner et al., "Towards a Video Game Description Language," doi:10.4230/DFU.Vol6.12191.85 であり、後者はオープンアクセスであるが本研究のためには読まれなかった。

第6節では、`GE-H1`、`GE-H2`、および`GE-H3`は6台の全機械において`measured_j = None`および`board_metered = false`のままとする（macOSの`L3`プロセスごとの`ri_energy_nj`、Linuxの`L2`ソケット/コアの`RAPL` `reported_j`、およびWindows 11の`L3` `GetProcessTimes`/`QueryProcessCycleTime`活動カウンタを分離し、Chrono-Budget Arenaの`est_j`機構を厳密に解析的なものに保つ）。完全なマルチエンジンシーン/動作エミッタ（`GE-H4`-`GE-H9`）は未解決の課題のままである。
