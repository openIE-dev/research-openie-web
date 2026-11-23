---
title: "ゲームを一度書いてどこでも動かす：厳密な再生が終わり許容誤差が始まる境界"
deck: "ゲームは一度だけチェックされた状態機械として記述され、複数のエンジン、命令セット、オペレーティングシステム、グラフィックスタックへ投影できるか。すべての九つの事前登録済み偽装スイートで実行された結果: 30 のマルチアーキテクチャターゲット × ホストセルで 100,000 ティックを Q32.32 整数物理で実行 (GE-H1: 0 / 25,500 状態ダイジェスト不一致、arm64 macOS、aarch64 Linux、Zen 5 および Raptor Lake x86_64 Linux、Tiger Lake x86_64 Windows 11)、25,000 のクロスプラットフォーム浮動小数点ティック (GE-H2: t_div = 10 Windows Universal C Runtime と Apple libm 対 Linux glibc sin/cos、t_div = 192-406 融合乗算加算低減、-ffast-math 無し)、Metal、Vulkan、DirectX 12 の 8 つのハードウェアグラフィックエンドポイント (GE-H3: 0.00%-9.34% ピクセルドリフト、Δ_max ≤ 2、ピーク信号対雑音比 ≥ 64.2 dB、構造類似度 ≥ 0.99983、全 28 ペア間)、17 のマルチエンジンゲーム動作 (GE-H4: Unity C# に対し -76.2% ソース行、0 / 680 トレース不一致)、10,000 アクターのスケーリング (GE-H5: 0.058-0.125 ms/ティック コンパイル時、N_20ms = 390 インタプリタ Python)、260 のインターフェース障害モジュール (GE-H6: 98.46% 再現率、F1 = 0.9922 対 0.1159 パース専用)、840 のカオス的リャプノフ軌道 (GE-H7: R²_mean = 0.994-1.000)、コンパクト入力ログのみからの 1 時間 216,000 ティック三システムリプレイ 3 件 (GE-H8: 0 / 6,480 不一致)、および 36 のヘッドレス Godot 4.7.2 タスク (GE-H9: 36 / 36 正確なトレース同等)。"
lang: "ja"
source: "game-engines"
complete: true
---

<div id="writing-a-game-once-and-running-it-everywhere-where-exact-replay-ends-and-tolerance-begins" class="anchor-alias" aria-hidden="true"></div>

*改訂 5c50a85、2026年11月23日。インタラクティブ・エクスプローラー、3 OS / 3 API にまたがるクロス GPU インスペクター、`GE-H4`-`GE-H9` の実証的閉包観測所、そして遊べる `Q32.32` Chrono-Budget Arena を収録: [インタラクティブ版（ゲームエンジン）](/living/game-engines/)。*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 要旨

本研究は、ゲームを一度チェック済みの状態機械として記述し、それを言語、オペレーティングシステム（OS）、中央処理装置（CPU）の命令セットアーキテクチャ（ISA）、グラフィックス処理装置（GPU）のアプリケーションプログラミングインターフェース（API）へ投影できるかを問うものである。調査した仕様と、実行された9つの実証的反証スイート（`GE-H1` から `GE-H9`）はいずれも、明確で閉じた境界を示している。ゲームルール、複数エンジンによる振る舞いの出力、高アクター数のシミュレーション、固定小数点整数演算を固定した条件でのOS横断の1時間規模のリプレイについては**はい**である。（`GE-H1`：Apple Silicon の `arm64` `macOS 27.2.1`、`aarch64` `Linux 6.8`、Advanced Micro Devices（`AMD`）Zen 5 と Intel Raptor Lake の `x86_64` `Linux 7.0`、Microsoft Visual C++（`MSVC`）`cl.exe` を含む Intel Tiger Lake の `x86_64` `Windows 11` ビルド `26300` のベアメタル環境にわたる30のターゲット×ホストの組において、16体の2Dアリーナを `100,000` ティック実行したところ、Secure Hash Algorithm 256ビット（`SHA-256`）のチェックポイント不一致は `0 / 25,500` であった。消費電力は macOS のプロセス単位の `reported_j` で `0.073 J` から `13.60 J`、Linux の Running Average Power Limit（`RAPL`）パッケージの `reported_j` で `1.89 J` から `181.87 J` に及んだ。（`GE-H4`：*Haunted Jaunt*、*Survival Shooter*、*Tanks* にまたがる17の振る舞いを Reality Code Engine（`RCE`）Forms で記述したところ、コメントを除く非空行のソースコード行数（`SLOC`）は、慣用的な Unity `MonoBehaviour` の C# 比で `76.22%` 削減（`326` 対 `1,371` `SLOC`、糊付けコードは `92.51%` 減）、Bevy 風の Rust エンティティコンポーネントシステム（`ECS`）コード比で `61.47%` 削減（`846` `SLOC`）、Godot 4 の `Node` GDScript 比で `51.99%` 削減（`679` `SLOC`）となり、トレースの不一致は `0 / 680` であった。）（`GE-H5`：`500` ティックにわたる $N \in [64, 10{,}000]$ のアクター数において、参照実装の `rce emit python` は $N_{20\text{ms}} = 390$ で `20 ms` の予算を超えた。これは GameRule の `308` アクターという上限付近にあたる。`rce emit js` は $N_{20\text{ms}} = 3{,}906$ に達した。コンパイル済みの WebAssembly（`Wasm`）、C++20 `-O3`、ネイティブ Rust `-O3` の各投影は、Linux の `RAPL` パッケージ `reported_j` で `1.69`-`3.67 mJ`/ティックの条件下、$N = 10{,}000$ を `0.058`-`0.125 ms`/ティックで実行した（`SHA-256` 不一致は `0 / 50`）。）（`GE-H6`：`26` のインターフェース欠陥パターンにまたがる `260` モジュールにおいて、Form による静的検査と4辺のマニフェスト検査は `128 / 130` の注入欠陥を検出した（再現率 `98.46%`、偽陽性 `0`、欠陥 `F1 = 0.9922`）。これに対し、中間表現（`IR`）を持たない構文解析のみの動的検査は `8 / 130`（`6.15%`、`F1 = 0.1159`）にとどまった。）（`GE-H8`：`60 Hz` の1時間（`216,000` ティック）のセッション3件は、圧縮された入力ログ $D$ のみ、すなわち `44.6` キロバイト（`KB`）から再生され（圧縮された状態スナップショットより `116×`-`292×` 小さい）、`macOS arm64`、`Linux x86_64`、`Windows 11 x86_64` の全体で `0 / 6,480` のチェックポイント `SHA-256` 不一致であった。）（`GE-H9`：Form から Godot 4 への出力器は、`Godot 4.7.2` のもとでヘッドレス同等性 `36 / 36`（`100.0%`、ティックハッシュの不一致 `0 / 18,000`）を達成した。）一方、固定されていない浮動小数点の超越関数や融合積和（`FMA`）の下位化がカオス的な力学に入り込む場合には**いいえ**である。（`GE-H2`：`-ffast-math` や `/fp:fast` を用いない場合でも、Windows の Universal C Runtime（`UCRT`）、Apple の `libSystem` の `libm`、Linux の `glibc` の `std::sin`/`std::cos` は、ティック `10` から `37` にかけて3者間で発散する三角形を形成した。また、`MSVC` の `/fp:precise` と `Clang` の `-ffp-contract=fast` はティック `192` で、`x86_64` と `arm64` の `FMA` はティック `406` で発散した。）（`GE-H7`：3種類のカオス的物理テンプレートにわたる $\delta_0 \in [2^{-52}, 2^{-10}]$ の範囲の `840` 組の対の軌道において、マクロな発散時刻 $t^*$ は $t^* = \hat{\alpha} + (1/\hat{\Lambda})\ln(\Delta/\delta_0)$ に従い、暗黙のリアプノフ指数は $\hat{\Lambda} \in \{1.95, 2.48, 5.07\}\ \text{s}^{-1}$、セル平均の $R^2 \in [0.9940, 0.9995]$、両側検定の $p \le 10^{-77.6}$ であった。）GPU のバックエンドをまたぐビット完全一致のピクセル出力については**いいえ**である。しかし、有界な一方向の許容誤差ゲートのもとでは**はい**である。（`GE-H3`：Apple `Metal`、Linux Mesa Radeon Vulkan（`RADV`）、Nvidia（`NVIDIA`）の Linux および Windows の `Vulkan` と Windows DirectX 12（`DX12`）、Intel の Linux Mesa Vulkan（`ANV`）、Windows の `Vulkan` と `DX12` にまたがる8つのハードウェアの `GPU × API` 組において、`512×512` の `RGBA8Unorm` で測定したところ、28組のハードウェア対のうち `27 / 28` は生の `SHA-256` が異なった。それにもかかわらず、`28 / 28` のすべてで、チャンネルごとの最大誤差 $\Delta_{\max} \le 2 / 255$、ピーク信号対雑音比（`PSNR`）`>= 64.16 dB`、構造類似度（`SSIM`）`>= 0.99983` を満たした。なお、`measured_j = None` および `board_metered = false` である。）

**平易な言葉での要約**

1. **厳密なシミュレーション、簡潔な規則、大規模なアクター数、および1時間規模のリプレイは、演算と効果が検証済みの Form の範囲内にとどまる限り、いずれも成立する。** `100,000` 物理ティックにわたり（`GE-H1`、`30` セルにまたがる `0 / 25,500` 件の不一致。対象は、ネイティブ Rust、`Clang` を用いた C++20、コンパイラ群（`GCC`）、`MSVC`、`Wasm`、JavaScript の `BigInt`、Python である）、3 本の1時間・`216,000` ティックのゲームプレイ・セッションが、わずか `44.6 KB` の圧縮入力ログのみからリプレイされた（`GE-H8`、`macOS`、`Linux`、`Windows 11` にわたり `0 / 6,480` 件の不一致）。`17` 個のマルチエンジン・ゲーム挙動（`GE-H4`）では、Unity C# と比べて行数が `76.2%` 少なく、C# + GDScript + Rust の `ECS` を別々に保守する場合と比べて `88.7%` 少ない。`10,000` アクターの空間グリッド・アリーナ（`GE-H5`）では、コンパイル済み C++20 で `0.058 ms`/tick、`1.69 mJ`/tick であったのに対し、インタプリタ型 Python では `564.6 ms`、`13.09 J`/tick であった。`260` 件の静的インターフェース障害テスト（`GE-H6`）では、検出率が `98.46%` であり、構文解析のみの場合の `6.15%` を大きく上回った。`36` 件のヘッドレス `Godot 4.7.2` タスク（`GE-H9`）では、`36 / 36` で厳密なトレースの一致が得られた。いずれの投影においても、同一の正準状態ハッシュが再現された。

2. **浮動小数点の標準的な物理演算は、高速数学フラグを付けなくても、`Windows`、`macOS`、`Linux` の間で対数的に速く乖離する。** `FMA` を無効化（`/fp:strict` と `-ffp-contract=off`）した純粋な代数演算 `+`、`-`、`*`、`/`、`sqrt` は、試験したすべての OS と ISA において `25,000` ティックすべてで一致した。しかし、Windows の `UCRT`、macOS の `libm`、Linux の `glibc` にまたがる `std::sin`/`std::cos` では、`10` から `37` ティック以内にビットが反転し（`GE-H2`）、既定の `FMA` 規則では `192` から `406` ティックで乖離が生じた。さらに、`840` 件の制御された摂動軌道（`GE-H7`）により、初期摂動 $\delta_0$ を $2^{-10}$ から米国電気電子学会（`IEEE`）`754` `binary64` のイプシロン $2^{-52}$ まで縮小しても、得られる追加時間は `5.7` から `14.4` 秒にとどまることが確認された（$R^2_{\text{mean}} \ge 0.994$）。

3. **同一のグラフィックスカードであっても、`DirectX 12` と `Vulkan` の間でピクセルのビットが反転しうるため、描画は一方向の許容誤差ゲートの下流に置かれるべきである。** ハードウェアの `GPU × API` 組合せ8通り（`Metal`、`Vulkan`、`DirectX 12`）に加え、Windows Advanced Rasterization Platform（`WARP`）と `Mesa llvmpipe` を対象として、同一の `NVIDIA GeForce 2060`（`108.34 dB` の `PSNR`）または `Intel Iris Xe`（`79.52 dB` の `PSNR`）上で `DirectX 12` と `Vulkan` を切り替えると、シェーダーコンパイラの下位変換により `1` 最下位ビット（`LSB`）が変化する。一方、ベンダーの異なる組合せでは、`0.00%` から `9.34%` のピクセルが `<= 2` `LSB` だけ異なり（`PSNR >= 64.16 dB`、`SSIM >= 0.99983`）、いずれの場合もシミュレーション状態を破損することはなかった（`GE-H3`）。

![提案する分割の図。上部の箱にはゲームの形式 P = (S, E, δ, D, λ) が置かれ、型付きインターフェース・スキーマと厳密な検査器を備える。矢印は四つの射影へ伸びる。左側の厳密ゾーンには、シミュレーション(Rust、WebAssembly、XState、SCXML、Python)とスクリプティング(Rhai、Lua、Luau)があり、ティックごとの状態ハッシュで判定される。右側の許容誤差ゾーンには、シーン(BSN 風、glTF、OpenUSD)とレンダリング(Slang、WGSL、WESL)があり、ピクセルごとの誤差で判定される。決定性の境界を示す破線の縦線が中央を通る。下部の帯には、入力、時計、音声、ネットワーク、アセットの入出力、GPU 描画、装飾的な物理演算といったホスト側の効果が挙げられ、これらは記録されたイベントとしてのみ系に入る。](/figures/game-engines/architecture.svg)

*図1. 提案する分割。一つの形式から四つの射影が導かれる。シミュレーションとスクリプティングは厳密ゾーンに置かれ、ティックごとの状態ハッシュで判定される。シーンとレンダリングは許容誤差ゾーンに置かれ、ピクセルごとの誤差で判定される。ホスト側の効果は記録されたイベントとしてのみ系に入る。*

![既存の11の表現を行(Slang、Naga、WGSL と WESL、glTF、OpenUSD、BSN、SCXML と XState、VGDL、GameRule、nAIVE、SpacetimeDB)とし、7つの能力を列(振る舞い、シーン、シェーダ、実行順序、複数ターゲット、再生ログ、層を横断する検査)として並べた格子。緑のセルは文書化された能力、黄色は部分的な能力、灰色は欠如または未文書化を示す。層横断の列は、Slang と nAIVE に部分的な印がある以外はすべて灰色である。](/figures/game-engines/coverage.svg)

*図2. 既存の表現の対応範囲。本研究で精読した文書のみに基づいて採点した。緑は文書化された能力、黄色は部分的、灰色は欠如または未文書化を示す。最右列の層横断の検査はほぼ空白である。*

<div id="1-terms-notation-and-the-idea-under-test" class="anchor-alias" aria-hidden="true"></div>

## 1. 用語、表記法、および検証対象の考え方

<ul id="terms">
<li>RCE, IR, ECS, FSM, SDF, AST, DAG, LCG: 現実コードエンジン [同一家], 中間表現, エンティティコンポーネントシステム, 有限状態機械, 符号付き距離場, 抽象構文木, 有向非巡回グラフ, および線形合同法生成器</li>
<li>CPU, GPU, ISA, ISAs, SIMD, AVX2, NEON, SFU, ROP, RPL, TGL: 中央処理装置, グラフィックス処理装置, 命令セットアーキテクチャ(複数形), 単一命令多データ, Advanced Vector Extensions 2, Arm Advanced SIMD, 特殊機能ユニット, ラスタ操作パイプライン, Intel Raptor Lake モバイルアーキテクチャ, Intel Tiger Lake モバイルアーキテクチャ</li>
<li>IEEE, FMA, VFMADD, VFNMADD, FMADD, FMSUB, ULP, LSB, SHA, MAE, RMSE, PSNR, SSIM, SD, OLS, CI, TP, FP, FN, TN, RGBA8: 電気電子工学協会 (IEEE 754浮動小数点形式におけるもの), 融合乗加算, x86_64ベクトル融合乗加算および否定乗加算オペコード, AArch64スカラー融合乗加算および乗減算オペコード, 最終桁単位, 最下位ビット, セキュアハッシュアルゴリズム (`SHA-256`), 平均絶対誤差, 二乗平均平方根誤差, ピーク信号対雑音比, 構造的類似性指標, 標準偏差, 通常最小二乗法, 信頼区間, 真陽性, 偽陽性, 偽陰性, 真陰性, および8ビット毎チャネル赤緑青アルファフレームバッファ形式</li>
<li>WGSL, WESL, SPIR-V, GLSL, HLSL, MSL, D3D11, D3D12, DX12, VULKAN, METAL, DXIL, DXBC, DXC, FXC, WARP, WDDM, CUDA, UBO: WebGPUシェーディング言語, WebGPU拡張シェーディング言語, 標準可搬中間表現V, OpenGLシェーディング言語, 高水準シェーディング言語, Metalシェーディング言語, Direct3D 11, Direct3D 12, DirectX 12, `wgpu::Backends::VULKAN`および`wgpu::Backends::METAL`バックエンドフラグ, DirectX中間言語, DirectXバイトコード, DirectXシェーダーコンパイラ, 従来のDirect3Dエフェクトコンパイラツール, Windows高度ラスタライズプラットフォームソフトウェアDirectX 12ラスタライザ, Windowsディスプレイドライバモデル, 統一計算デバイスアーキテクチャ, およびユニフォームバッファオブジェクト</li>
<li>RADV、ANV、LLVM、GNU、GCC、MSVC、UCRT、NT、PE、OS、OSs、API、APIs、JIT、VM、SLOC、HUD、UI、SFX、LOS、AABB、HP、XP、AP、KB、MB、CRUD、NL、VLM、LLM、GFW、Xvfb、WebXR、WebMCP、URL、JSON、YAML、README、NTFS、CRLF、CS0246、RE、ENGINE、DFU：Mesa Radeon Vulkan ドライバ、Mesa Intel Vulkan ドライバ、Low Level Virtual Machine コンパイラ基盤、GNU の Not Unix プロジェクト、GNU Compiler Collection、Microsoft Visual C++ コンパイラ（`cl.exe`）、Windows Universal C Runtime（`ucrtbase.dll`）、Windows New Technology カーネル（`Windows NT`）、Windows Portable Executable、オペレーティングシステム群、アプリケーションプログラミングインタフェース群、ジャストインタイムコンパイラ、仮想マシン、コメントでも空白行でもないソースコード行数、ヘッドアップディスプレイ、ユーザインタフェース、サウンドエフェクト、視界ライン、軸整列バウンドボックス、ヒットポイント、経験ポイント、アクションポイント、キロバイト、メガバイト、作成/読み取り/更新/削除操作、自然言語、ビジョンランゲージモデル、ラージランゲージモデル、Great Firewall ネットワークフィルタ、X 仮想フレームバッファディスプレイサーバ、Web Extended Reality API、Web Model Context Protocol、Uniform Resource Locator、JavaScript Object Notation、YAML Ain't Markup Language、リポジトリ README 文書ファイル、New Technology File System、キャリッジリターン・ラインフィードシーケンス、C# コンパイラ欠損型診断 CS0246、Capcom RE ENGINE（「Reach for the Moon」／「RE neXt」 エンジンブランディング）、および Dagstuhl Follow-Ups DOI プレフィックス</li>
<li>SCXML, GDL, VGDL, BSN, BSL, MLIR, ACID, GGPO, glTF, OpenUSD, USD, LAN, AI, CIG: State Chart XML, Game Description Language, Video Game Description Language, Bevy Scene Notation, Boldsea Semantic Language, Multi-Level Intermediate Representation, 原子性/一貫性/隔離性/永続性トランザクション, Good Game Peace Outロールバックネットワークライブラリ, Graphics Language Transmission Format (ISO/IEC 12113:2022), Open Universal Scene Description, Universal Scene Description, ローカルエリアネットワーク, 人工知能, およびComputational Intelligence and Games</li>
<li>SATB, RAPL, MSR, PID, RUSAGE, V6, AMD, NVIDIA, RTX, V100, GH200, CTC: Satiation Tiered Benchmark（SATB）のテレメトリ水準（`L2` はソケット/パッケージのカウンタ、`L3` はプロセス単位のカーネルカウンタ）[同一組織]、Running Average Power Limit（平均電力制限）、モデル固有レジスタ（model-specific register）、プロセス識別子（process identifier）、`proc_pid_rusage`（`RUSAGE_INFO_V6`）、Advanced Micro Devices（AMD社）、NVIDIA Corporation（NVIDIA社）、NVIDIA GeForce RTX GPUファミリ、Volta V100 GPU、Grace Hopper GH200スーパーチップ、および閉じた時間的曲線（closed timelike curve）</li>
</ul>

第1節はForm記法を定義し、第2節は既存のゲーム表現を概観し、第3節は浮動小数点の乖離を分析し、第4節は中間表現を表形式でまとめ、第5節は提案する層分割を述べ、第6節は3種類のOS、3種類のISA、3種類のGPU API、および4種類のゲーム動作ツールチェインにわたる9つの実行済み偽造検出スイート（`GE-H1`から`GE-H9`）を報告し、第7節は実行不可能フラグを列挙し、第8節は出典と限界を文書化する。

[現実コードエンジン (RCE)](https://research.openie.dev/about/rce/) はプログラムをFormと呼ばれる状態機械として扱い、$P = (S, E, \delta, D, \lambda)$ と書く。

- $S$: 状態の集合;
- $E$: 事象（入力）の集合;
- $\delta : S \times E \to S$: 遷移関数;
- $D$: 実行されたすべてのステップを追記するログ;
- $\lambda$: 状態から観測可能な出力への写像.

厳密な検査器はFormを受け入れるか、違反した規則の名称を返す。次にエミッタが受理されたFormをRust、Python、JavaScriptおよびScalaに射影する。XState（JavaScriptおよびTypeScriptの状態チャートライブラリ）、SCXML（World Wide Web Consortium勧告）、WebAssembly（`Wasm`）、およびGodot 4 GDScriptはコア検査器における組み込みの`rce emit`対象ではない。第6節はコンパイルされた`Wasm`射影（`GE-H1`、`GE-H5`）を試験し、`rce emit form`の上にForm-to-Godot 4 GDScriptエミッタを単独で構築する（`GE-H9`）。あらゆるステップが$D$に記録されるため、任意の実行を再生できる。

ゲームエンジンははるかに大きな機械である。それは固定ステップシミュレーション、スクリプト層、シーン記述、およびGPU上のレンダリングパイプラインを実行する。第1節から第8節は、これらの層のうちどれがForm内に存在し得るか、どれがホスト効果として外部に留まる必要があるか、そして厳密性が許容誤差に譲らなければならない境界はどこにあるかを問う。

この考え方には長い系譜がある。Stanfordの[ゲーム記述言語 (GDL) 仕様](http://ggp.stanford.edu/readings/gdl_spec.pdf)は「有限で離散的、決定論的、完全情報多人数ゲーム」を対象とし、そのようなゲームの自然な基礎モデル「は有限状態機械である」と述べている。ゲームエンジンにおいて新しいのは状態機械そのものではなく、その周囲にあるすべて、すなわち浮動小数点物理、スクリプト、シーン、およびGPUである。

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

### 2.4 再生可能なトレースを備えた公開ベンチマークは存在する

GameCraft-Bench（[arXiv:2606.17861](https://arxiv.org/abs/2606.17861)；[リポジトリ](https://github.com/FreedomIntelligence/gamecraft-bench)）は、Godot 4 による2次元タスク140件を15のファミリーに分けて提供する。提出物には再生可能な入力トレースが含まれる。論文中で最も強力なエージェントの得点は41.46%であり、リポジトリでは後に65.70%から75.86%という値が報告されている。ただし、Unity、Unreal、3次元、マルチプレイヤー、大規模な物理シーンは対象外である。[Summer Engine](https://www.summerengine.com/templates)は、ラリー、プラットフォーマー、タワーディフェンス、メトロイドヴァニア、サバイバーズ、一人称シューター、LANマルチプレイヤー、ボクセル等を含む17件のオープンソースのゲームテンプレートを公開している。General Video Game AI フレームワークおよびその記述言語VGDL（[arXiv:1802.10363](https://arxiv.org/abs/1802.10363)）は、スプライト集合、相互作用集合、終了条件集合、レベル対応集合によって定義される、単一プレイヤーゲーム120件と二人プレイヤーゲーム60件を提供する。

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

*例示モデル：* $\delta_0 \approx 6 \times 10^{-8}$（単精度浮動小数点数の1 ULP，相対値），$\Delta = 1$（壁の反対側にある物体），および仮定された$\Lambda = 2\ \text{s}^{-1}$とする。このとき$t^{*} \approx 0.5 \ln(1.7 \times 10^{7}) \approx 8.3$ sとなる。対数が鍵である：$\delta_0$を100万分の1に縮小しても，わずか6.9秒程度しか得られない。したがって近似的一致はシミュレーションを救済し得ない。状態はビット単位で同一であるか，やがて発散するかのいずれかであり，この予測は25,000件のマルチISA・3 OS衝突ティック（`GE-H2`）および840軌道の$\ln(\Delta/\delta_0)$傾き掃引（`GE-H7`）により直接検証されている。

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

### 5.1 レイヤー分割

1. **シミュレーション形態（正確）.** $S$ は固定小数点または厳密な IEEE 754 値を保持し、FMA と再結合を無効化し、超越関数は整数または固定ソフトウェア例程で実装する。$E$ はティックイベントと記録入力を保持する。$\delta$ は SCXML マクロステップセマンティクスを使用し、ティック毎にキュー順にイベントを処理し、文書順で競合を解決し、並列領域を逐次実行する。コレクションは宣言順に走査し、GameRule の契約（宣言順、後書きが勝ち、構造変更はティック終端に遅延）に従う。並列性が要求される場合、チェッカーは Core ECS の非交叉条件を満たすスケジュールのみを許容する。
2. **スクリプト投影（正確）.** デザイナースクリプトは $S$ 上のガードとアクションにコンパイルされ、[Rhai](https://rhai.rs/book/about/features.html)（サンドボックス化、"Don't Panic" 保証、no-std と Wasm 対応）、Lua、[Luau](https://luau.org/)（デフォルトでサンドボックス化、段階的型付け）または Godot 4 GDScript (`GE-H9`) のような型付エンジンスクリプトとして出力される。スクリプトは宣言されたアクションを介してのみ $\delta$ を呼び出すことができ、クロック、乱数源、GPU 結果を直接読むことはできない。
3. **シーン投影（下流許容）.** $\lambda$ は $S$ を BSN ライクなパッチツリーへ写像し、そのコンポーネントスキーマは Form の一部となる。glTF と OpenUSD がアセットのエクスポート先として使用される。
4. **レンダリング投影（許容）.** マテリアルとパスは Slang または WGSL で作成され、Slang または Naga を通じて `DirectX 12`、`Metal`、`Vulkan` バックエンドへ出力される。レンダリングは $\lambda(s)$ の純粋関数であり、GPU の結果が $S$ に逆流することはない。

<div id="52-inside-the-form-versus-host-effects" class="anchor-alias" aria-hidden="true"></div>

### 5.2 フォーム内部対ホスト効果

内部：状態、遷移、規則順序、ゲームプレイ関連物体に対する固定小数点物理、シードが$S$にある乱数生成器、インタフェーススキーマ。外部は、記録されたイベントとして：デバイス入力、壁時計時間、ネットワークパケット、オーディオ出力、アセット入出力、GPU描画、および化粧効果に用いられる任意の第三者物理。再生はデバイスに触れることなく$D$を$\delta$を通してフィードバックする。記憶コストは控えめである。ティックレート$f_{\text{tick}} = 60$ Hzおよびティックあたり$b = 2$から$16$バイトの入力で、生ログは$120$から$960$ B/sで成長する（生で`0.43`から`3.5` MB/時、6.8節でgzip圧縮後`44.6 KB`/時）。

<div id="53-determinism-boundary" class="anchor-alias" aria-hidden="true"></div>

### 5.3 決定性の境界

- **厳密領域の判定基準:** 対象 A と B のすべての tick $t$ について、$H(s_t^A) = H(s_t^B)$ が成り立つ。ここで $H$ は $S$ の正準直列化に対する暗号学的ハッシュ関数である。
- **許容誤差領域の判定基準:** 同一の $s_t$ から得られた描画フレーム $I^A$ と $I^B$ について、チャネルごとの誤差が $\varepsilon$ を超えるピクセルの割合は $p_{\max}$ を超えてはならない。さらに、構造的類似度 (`SSIM`) およびピーク信号対雑音比 (`PSNR`) の下限を併せて課す。第6.3節では、`DirectX 12`、`Metal`、`Vulkan` にまたがる8種類のハードウェア `GPU × API` エンドポイント（`Apple Metal`、`AMD RADV Vulkan`、`NVIDIA` の Linux/Windows `Vulkan` および Windows `DX12`、`Intel` の Linux `ANV Vulkan` および Windows `Vulkan` / `DX12`）を対象として、このキャリブレーションを実施する。
- [GGPO](https://github.com/pond3r/ggpo) の様式に倣ったロールバックネットワーキングは、入力予測と投機的実行に依拠するため、この境界の厳密側においてのみ有効である。

<div id="54-cross-layer-interface-checking" class="anchor-alias" aria-hidden="true"></div>

### 5.4 クロスレイヤインタフェース検査

チェッカは、任意のエミッションの前に4種類の型付きエッジを検証する：(a) スクリプトからシミュレーションへ：すべてのアクションが、引数型が一致する宣言済み遷移を指名すること；(b) シミュレーションからシーンへ：$\lambda$の出力がコンポーネントスキーマに一致すること；(c) シーンからレンダリングへ：すべてのマテリアルバインディングが、互換性のある型、グループ、およびバインディングインデックスを持つSlangまたはWGSLリソースに一致すること；(d) イベントカバレッジ：スクリプトがリッスンするすべてのイベントが、何らかの遷移またはホストソースによって生成可能であること。Mageの発見（2.3節）が、エッジ検査をコンパイル成功ではなく動作トレースによって判定する理由である。

<div id="6-falsifier-first-test-plan-and-full-ge-h1ge-h9-empirical-closure" class="anchor-alias" aria-hidden="true"></div>

## 6. 反証優先の検証計画と `GE-H1`-`GE-H9` の実証的閉鎖

各仮説には反証基準を併記する。反証基準が充足された場合、当該主張は撤回される。6.1 から 6.10 では、9 件の実行済み実証的反証スイート (`GE-H1` から `GE-H9`、事前登録ファイル `PREREG_wave3_multi_isa_wgpu.json` `1721e5bdffaf...` および `PREREG_wave5_ge_h4_h9.json` `7d02115e37d3...` に基づく) の結果を、対話型かつジュール予算制約付きの `Q32.32` Chrono-Budget Arena とあわせて報告する。

| ID | 仮説 | 検証コーパス | 測定量 | 棄却基準 | 状態 |
|---|---|---|---|---|---|
| GE-H1 | シミュレーションの射影は、言語、OS、CPU の ISA をまたいでビット単位で一致する | `arm64` macOS、`aarch64` Linux、AMD/Intel `x86_64` Linux、Tiger Lake `x86_64` Windows 11 にわたる 16 体 2D アリーナの Form (`Q32.32` 固定小数点、`732` バイトの状態) | Rust、Wasm32、C++20 (`Clang`/`GCC`/`MSVC`)、Node.js `BigInt`、Python 3 における $10^5$ ティック分の $H(s_t)$ (`30` セル) | 任意の `(host, target)` セルの任意のチェックポイントでハッシュが 1 つでも不一致 | **実行済み (`3` OS・`3` ISA で `0 / 25,500` 件の不一致、6.1 節)** |
| GE-H2 | 厳密モードと、3 OS・ISA 横断の浮動小数点境界およびライブラリ/FMA のドリフト | 16 体 2D カオスアリーナ (`arm64` macOS、`aarch64` Linux、`x86_64` Linux、`x86_64` Windows 11 にわたる `25,000` ティック) | 厳密 `f64`、3 OS の `UCRT`/`libSystem`/`glibc` による `sin/cos`、`MSVC` 対 `Clang` の `FMA`、V8 の `Math.sin`、`f32` における正確な発散ティック `t_div` | 固定した代数的演算の下での想定外の不一致、または予測されなかった暗黙のドリフト | **`macOS`、`Linux`、`Windows 11` で実行済み (6.2 節)** |
| GE-H3 | GPU および API をまたぐ描画は、有界な許容誤差内に収まる (`wgpu` / WGSL) | 4 つの標準 `Q32.32` 状態 (`t = 0, 250, 1k, 10k`) を、`8` 個のハードウェア `GPU × API` エンドポイント (`DX12`、`Metal`、`Vulkan`)、`WARP`、`llvmpipe`、`CPU Q16.16` 上で `512×512` の `RGBA8Unorm` として描画 | フレームバッファの `SHA-256`、相違画素の割合 (%)、$\Delta_{\max}$、MAE、RMSE、`PSNR`、`SSIM` | 物理 GPU のいずれかの対が `PSNR > 40 dB`、`SSIM > 0.999`、または $p(\Delta > 8) \le 0.001$ を満たさない | **実行済み (`28/28` 対 = `112/112` フレームがゲートを通過: `PSNR ≥ 64.16 dB`、`SSIM ≥ 0.99983`、6.3 節)** |
| GE-H4 | Form で符号化したルールは GameRule と同様にコードを削減する | *Haunted Jaunt* (`5`)、*Survival Shooter* (`7`)、*Tanks* (`5`) にわたる `17` 個の振る舞い × `4` 言語 (`68` モジュール、`680` トレース) | コメントを除く `SLOC`、字句トークン数、グルー行数、言語間のトレース一致 | Unity C# に対する振る舞い `SLOC` 削減率が `< 50%` (GameRule: `81.3%`)、またはトレース不一致が `> 0` 件 | **実行済み (Unity C# に対し `−76.22%` SLOC、Rust ECS に対し `−61.47%`、GDScript に対し `−51.99%`、`0 / 680` 件の不一致、6.4 節)** |
| GE-H5 | Form ランタイムは GameRule の上限を超える | 複数アクターの `Q32.32` `16×16` 空間グリッドアリーナ (`N = 64..10,000`、`500` ティック/セル、`5` ティア + Linux `RAPL` の `reported_j`) | p50/p99 のステップ時間 `ms/tick`、`RAPL` の `mJ/tick`、$N_{20\text{ms}}$、ティア間の `SHA-256` | コンパイル済み Form のステップ時間が $N = 350$ 未満で `> 20 ms`、またはハッシュ不一致が `> 0` 件 | **実行済み (`N_20ms = 390` Py、`3,906` Node.js、コンパイル済みは `N = 10,000` で `0.058-0.125 ms/tick`、`0 / 50` 件の不一致、6.5 節)** |
| GE-H6 | インタフェース検査は実際の欠陥を捕捉する | `26` 種の欠陥パターン × `10` モジュール (`130` 件の注入故障 + `130` 件の有効な対照 = `260` モジュール) | `TP`、`FP`、`FN`、`TN`、検出再現率 (%)、適合率 (%)、故障 `F1` | 注入故障の検出が `< 90%`、または `F1` が IR なしの `0.12` を上回らない | **実行済み (`128 / 130` = 再現率 `98.46%`、`0` FP、`F1 = 0.9922` 対 構文解析のみのベースライン `0.1159`、6.6 節)** |
| GE-H7 | カオス的物理テンプレートに対する $\ln(\Delta/\delta_0)$ の傾きの全面掃引 | `3` 種のカオステンプレート (`GE-T1`..`GE-T3`) × `7` 種の摂動 $\delta_0 \in [2^{-52}, 2^{-10}]$ × `40` シード (`840` 本の軌道、`60 Hz`) | OLS 傾き $\hat{\beta} = 1/\hat{\Lambda}$、含意される $\hat{\Lambda}$、$R^2$、95% ブートストラップ信頼区間、両側 $p$ | $t^*$ の $\ln(\Delta/\delta_0)$ に対する傾きがゼロと区別できない ($p \ge 0.01$) | **実行済み ($\hat{\Lambda} \in \{1.95, 2.48, 5.07\}\ \text{s}^{-1}$、$R^2_{\text{mean}} = 0.9940\text{-}0.9995$、$p \le 10^{-77.6}$、6.7 節)** |
| GE-H8 | 再生は完全である | `macOS`、`Linux`、`Windows 11` にわたり、コンパクトな入力ログ $D$ のみから再生した 1 時間 (`60 Hz` で `216,000` ティック) のセッション 3 件 + `4` 件のリーク対照 | `2,160` 個のストライド `100` ダイジェストと最終 `SHA-256` ダイジェスト、圧縮後の $|D|$ と状態ストリームの比較 | $D$ のみからの再生で OS 間のハッシュ不一致が 1 件でもある、またはリーク対照が発散しない | **実行済み (`3` OS で `0 / 6,480` 件のチェックポイント不一致、`44.6 KB` の gzip 圧縮 $D$ = `116×-292×` の縮小、`4/4` のリークが `t = 1` で発散、6.8 節)** |
| GE-H9 | ベンチマークの同等性 | `Godot 4.7.2 --headless` 上で `form_to_gdscript.py` を `36` 件の決定論的タスク (`15` 個の GameCraft-Bench ファミリー × `2` + `6` 個のコアシステム、`18,000` ティック) に適用 + 140 タスクのアーカイブ監査 | 手書きのネイティブ GDScript に対する合格率とティックごとの `SHA-256` の同等性 | 合格率が低い、または同一の入力ストリームで状態トレースの不一致が `> 0` 件 | **実行済み (`36 / 36` = 合格率の同等性 `100.0%`、`0 / 18,000` 件のティックハッシュ不一致、6.9 節)** |

![決定性境界を横断する2パネルの実証的要約。左パネルは厳密領域 GE-H1 (arm64 macOS、aarch64 Linux、AMD/Intel x86_64 Linux、Intel x86_64 Windows 11 の4環境、30セルにわたる25,500個の SHA-256 チェックポイントで不一致0件) と GE-H2 の3 OS における f64 発散時刻 (Windows UCRT と Apple libm の sin/cos を GNU glibc と比較した場合は t_div = 10、Windows UCRT と Apple libm の比較では t_div = 37、MSVC /fp:precise と Clang -ffp-contract=fast の比較では t_div = 192、x86_64 VFMADD と arm64 FMADD の比較では t_div = 406) を示す。右パネルは許容領域 GE-H3 の最小 PSNR 棒グラフであり、DirectX 12、Metal、Vulkan にまたがる8つのハードウェア GPU × API の組み合わせを示す。同一 GPU 上での DX12 と Vulkan のコンパイラ差異 (RTX 2060 で 108.3 dB、Iris Xe で 79.5 dB) と、ベンダー間のラスタライズ差異 (64.2 から 72.1 dB) を分離しており、いずれも 40 dB のゲート値を大きく上回る。](/figures/game-engines/cross-gpu-tolerance.svg)

*図3. `GE-H1`、`GE-H2`、`GE-H3` にわたる経験的境界。上流の `Q32.32` シミュレーション状態（`S`）は、6台のマシン、3種のOS（`macOS`、`Linux`、`Windows 11`）、3種のISAにまたがって `0 / 25,500` の `SHA-256` チェックポイント不一致を達成する。一方、固定されていない `f64` の `sin/cos` と `FMA` は、OS・コンパイラ・ISAの境界をまたぐと `10` から `406` ティック以内に乖離する。$\lambda(s_t)$ の下流では、同一の Windows 11 GPU上で `DirectX 12` と `Vulkan` を切り替えると、シェーダーのローワリングにより 1 LSB の差が生じる（`79.5-108.3 dB` の PSNR）。その一方で、全 `28 / 28` のハードウェア `GPU × API` の組み合わせは、いずれも `64.16 dB` を厳密に上回る PSNR と、0.99983 を上回る SSIM を維持した（`measured_j = None`、`board_metered = false`）。*

![4パネルからなる実証的要約：GE-H4 から GE-H9 の閉鎖。パネル A は 17 モジュールにわたる GE-H4 の SLOC 挙動を示し、326 行の RCE SLOC と 679 行の Godot 4 GDScript、846 行の Bevy Rust ECS、1,371 行の Unity MonoBehaviour C# を比較し、680 件のトレース不一致は 0 件である。パネル B は 64 人から 10,000 人のアクターに対する GE-H5 の対数-対数ステップ時間を示し、rce emit Python が N=390 で 20 ms を超え、rce emit js が N=3,906 で同様に超え、コンパイル済み Wasm32、C++20、Rust は N=10,000 で 0.058〜0.125 ms/ティックに留まる。パネル C は GE-H6 のフォールト検出（リコール 98.46%、F1=0.9922）を示し、解析のみの場合の 6.15%、F1=0.1159 と比較し、さらに GE-H7 の t* 対 ln(Delta/delta0) 軌跡を 3 つのカオス的テンプレート上で示し、決定係数 R2=0.994 から 1.000 の範囲であることを示す。パネル D は 44.6 KB の gzip ログからの 1 時間 216,000 ティック 3-OS リプレイ（6,480 件の不一致は 0 件）と、GE-H9 の Godot 4.7.2 ヘッドレスパリティ（36 件のタスクすべて成功、18,000 ティックの不一致は 0 件）を要約する。](/figures/game-engines/ge-h4-h9-closure.svg)

*図4. `GE-H4` から `GE-H9` までの経験的閉包の全体(`openIE-dev/rce` コミット `1762fb4b`、`Godot 4.7.2 --headless`、`macOS arm64`、`Linux x86_64`、`Windows 11 x86_64`; `measured_j = None`、`board_metered = false`)。*

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

<div id="64-ge-h4-form-encoded-behavior-rules-across-17-modules-and-4-languages-haunted-jaunt-survival-shooter-tanks" class="anchor-alias" aria-hidden="true"></div>

### 6.4 `GE-H4`：17モジュールと4言語にわたるフォーム符号化の行動規則（`Haunted Jaunt`、`Survival Shooter`、`Tanks`）

*本検証は、事前登録ファイル `PREREG_wave5_ge_h4_h9.json`（`SHA-256: 7d02115e37d3...`）に基づいて実施した。すべての `.rce` モジュールは、ゲート段階において `openIE-dev/rce`（コミット `1762fb4bb65a`、仕様草案 `0.9`）により、`rce check` および `rce test` で検査と試験を受けた。*

一般目的の `.rce` フォームが GameRule が研究した厳密な 3 つの参照ゲーム（2.1 節）において少なくとも `50%` の動作コード削減を達成しつつ複数のエンジンパラダイムに投影できるかどうかを検証するため **17** 個の全アクターおよびディレクター動作 `Haunted Jaunt`（`PlayerStealth`、`GhostPatrol`、`GargoyleSpotter`、`ObserverLineOfSight`、`ExitTrigger`）、**Survival Shooter**（`PlayerAvatar`、`GunRaycaster`、`ZombunnyChaser`、`ZomBearBruiser`、`HellephantBoss`、`WaveSpawner`、`ScoreHUD`）、および **Tanks**（`TankChassis`、`ShellBallisticsQ32`、`ExplosionFalloff`、`TankHealthShield`、`RoundDirector`）を `.rce` フォームとして記述し、動作的に同一の慣用的な実装と対にした。これらの実装は **Unity `MonoBehaviour` C#**（Microsoft Visual C# `csc.exe 4.0.30319` でコンパイルおよび Windows 11 上で実行）、**Godot 4 `Node` GDScript**（`Godot 4.7.2 --headless` で Linux 上で実行）、および **Bevy スタイルの Rust `ECS`**（`Component` + `Event` + `Query` システム、`rustc 1.100` でコンパイル）である。モジュールごとに `10` 個の決定論的 20 イベントトレース（`170` トレース × `4` ツールチェーン = `680` 実行）において言語間の状態ダイジェスト不整合は **`0 / 680`** であった：

| ゲームスイート（`modules`） | `.rce` フォーム挙動 `SLOC`（`intent`付き） | Unity `MonoBehaviour` C# `SLOC` | Bevy Rust `ECS` `SLOC` | Godot 4 `Node` GDScript `SLOC` | Unity C# との差分（`intent`付き） | Rust `ECS` / GDScript との差分 | Glue 行数（`.rce` / C# / `ECS` / `.gd`） |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Haunted Jaunt (`5`)** | **`90`** (`105`) | `391` | `238` | `190` | **`−76.98%`** (`−73.15%`) | `−62.18%` / `−52.63%` | `17` / `230` / `112` / `54` |
| **Survival Shooter (`7`)** | **`148`** (`169`) | `590` | `367` | `288` | **`−74.92%`** (`−71.36%`) | `−59.67%` / `−48.61%` | `27` / `351` / `168` / `81` |
| **Tanks (`5`)** | **`88`** (`103`) | `390` | `241` | `201` | **`−77.44%`** (`−73.59%`) | `−63.49%` / `−56.22%` | `17` / `233` / `111` / `57` |
| **総計（`17` modules）** | **`326`** (`377`) | **`1,371`** | **`846`** | **`679`** | **`−76.22%`** (`−72.50%`) | **`−61.47%` / `−51.99%`** | **`61` / `814` / `391` / `192`** |

- **`>= 50%` の閾値の通過と、GameRule が `81.3%` に到達した理由の切り分け**: 純粋な `.rce` の振る舞いルールは、慣用的な Unity `MonoBehaviour` C# に対して `SLOC` を **`76.22%`** 削減する。また、三つの基準スクリプトのいずれも持たない埋め込みの `intent` 51 行と、ゲート検査付きの `example` アサーション 34 件を `.rce` 側に含めて数えた場合でも、削減率は **`72.50%`** にとどまる。字句トークンは **`66.15%`** (`2,348` 対 `6,937`) 減少し、ライフサイクル、キュー、シリアライズの定型部分 (`61` 対 `814` 行) は **`92.51%`** 排除される。GameRule の `81.3%` (`572 -> 107` 行) との約 `5` ポイントの差は、表現力の汎用性に起因する。GameRule は Unity の CRUD 動詞 14 個を C# 内にハードコードしているのに対し、`.rce` は任意の算術演算、ビットマスク、`Q32.32` の弾道計算を言語で直接表現する。三つの別々のエンジン向けコードベース (合計 `2,896` SLOC) を一つの `.rce` Form に置き換えることで、維持対象となる振る舞いの `SLOC` は **`88.74%`** 削減される。

<div id="65-ge-h5-multi-actor-q3232-runtime-scaling-and-rapl-energy-across-5-projection-tiers-n--64-to-10000" class="anchor-alias" aria-hidden="true"></div>

### 6.5 `GE-H5`: 5つの投影階層（`N = 64` から `10,000`）における多アクター `Q32.32` 実行時スケーリングと `RAPL` エネルギー

Form 投影が GameRule の `~308` アクター（`20 ms`）規則解釈上限を突破するかを検証するため、`Q32.32` の 2 次元アリーナ Form（`ge_h5_actor_arena.rce`、`rce check` で検査）を用いた。この Form は、`16 × 16` の一様空間格子（`[-64, +64]^2` 上の `256` セル）と、巡回、追跡、混雑回避、パルス冷却遷移を組み合わせたものである。$N \in \{64, 128, 256, 300, 350, 500, 1{,}000, 2{,}500, 5{,}000, 10{,}000\}$ の各条件について、アイドル状態の `Intel Core i9-13900H`（`Linux 7.0`、`SATB` `L2` `intel-rapl:0` のソケットおよびコアの `energy_uj`、`measured_j = None`、`board_metered = false`）上で **`500` ティック** 進行させ、5 つの Form 投影階層で比較した。

| 投影階層 | 中央値 `p50 ms/tick`（`N = 300`） | 中央値 `p50 ms/tick`（`N = 350`） | 中央値 `p50 ms/tick`（`N = 1,000`） | 中央値 / `p99 ms/tick`（`N = 10,000`） | `L2` `RAPL` パッケージ `mJ/tick`（`N = 10,000`） | アクター上限 $N_{20\text{ms}}$ | `500` ティックの `SHA-256` 一致 |
|---|---:|---:|---:|---:|---:|---:|:---:|
| **`rce emit python`（`CPython 3.14`）** | `13.662` | `18.115` | `55.525` | `564.575` / `648.061` | `13,090.57`（コア `10,826.87`） | **`390`**（実測） | `10 / 10` |
| **`rce emit js`（`Node.js v22.22.1`）** | `1.479` | `1.846` | `4.769` | `57.050` / `66.313` | `1,559.77`（コア `1,183.86`） | **`3,906`**（実測、`11.2×`） | `10 / 10` |
| **Form `Rust -> Wasm32`（`Node V8`）** | `0.0040` | `0.0044` | `0.0089` | **`0.0724`** / `0.0810` | **`2.211`**（コア `1.908`） | **`> 10,000`**（線形外挿 `~2.76M`） | `10 / 10` |
| **Form `C++20`（`clang++ -O3`）** | `0.0033` | `0.0036` | `0.0073` | **`0.0583`** / `0.0654` | **`1.694`**（コア `1.454`） | **`> 10,000`**（線形外挿 `~3.43M`） | `10 / 10` |
| **Form `Rust`（`rustc -C opt-level=3`）** | `0.0035` | `0.0041` | `0.0129` | **`0.1248`** / `0.1274` | **`3.673`**（コア `3.156`） | **`> 10,000`**（線形外挿 `~1.60M`） | `10 / 10` |

- **`300` アクター上限の説明と突破**: 参照実装の `rce emit python`（`rt.py`。整数をボックス化し、すべての式で範囲とフューエルの不変条件を検査する）は、アクターあたり `45.5`-`56.5 µs` を要し、`20.0 ms` を $N_{20\text{ms}} = 390$ で超えた。これは GameRule が測定した厳密な解釈器の領域（`65 µs`/アクター、$N_{\max} \approx 308$）を再現するものである。V8 の `BigInt` JIT（`rce emit js`）に切り替えると $N_{20\text{ms}}$ は `10.0×` 増加して **`3,906` アクター** となった。一方、ボックス化されない컴파일済み投影（`Wasm32`、`C++20 -O3`、`Rust -O3`）は **`10,000` アクターを `0.058`-`0.125 ms` で処理**した（アクターあたり `5.8`-`12.5 ns`）。これは `10,000` アクターで `20 ms` 予算の `< 0.63%` に相当し、ソケット `RAPL` の `reported_j`/ティックを `rce emit python` に対して `3,564×` から `7,728×` 削減した。その間、状態の `SHA-256` 不一致は **`0 / 50`** であった。

<div id="66-ge-h6-static-4-edge-interface-checking-across-26-defect-patterns-260-modules-zero-runtime-ticks" class="anchor-alias" aria-hidden="true"></div>

### 6.6 `GE-H6`: 26の欠陥パターンにわたる静的4エッジインタフェース検査 (`260`モジュール, ランタイムティック数ゼロ)

第5.4節の4辺チェッカーを第2.3節のMageの病理（「コンパイルが通ることは正しいことと同じではない」）に対して検証するため、26種のゲームインターフェース欠陥パターン（`P01` ノードパスの誤記、`P02` シグナルハンドラの欠落、`P03` シグナルのペイロード引数数の不一致、`P04` ペイロード型の不一致、`P05` 方向付き物理のレイヤー/マスクの反転、`P06` 未処理の `kind` バリアント、`P07` nullのシーンリソースハンドル、`P08` エンティティタグの誤記、`P09` アニメーションコールバックのイベント欠落、`P10` ミリ秒と秒のデルタ時間の不一致、`P11` 描画パスによるシミュレーション状態 $S$ の変更、`P12` セーブスキーマのフィールド欠落、`P13` ネットワークパケットのフィールド順序の入れ替え、`P14` 未マップのホスト入力アクション、`P15` `u64` クールダウンのアンダーフロー、`P16` 死亡エンティティへのアクションディスパッチ、`P17` シングルトンの起動順序による読み取り競合、`P18` 参照切れのアセット識別子、`P19` ローカル座標とワールド座標の混同、`P20` 衝突走査中の再入的な削除、`P21` WGSLのuniformバインディングの欠落、`P22` WGSLの `vec3`/`vec4` における `16` バイトUBOアライメントの不一致、`P23` 未宣言のオーディオバス、`P24` 古いHUD状態バインディング、`P25` インベントリスロットのオーバーフロー、`P26` ポータル遷移時の永続状態の欠落）を、**`260` 個の具体的なモジュールバンドル**（パターンごとに故障注入の `5` 件と正常対照の `5` 件、すなわち故障 `130` 件と正常 `130` 件）として実体化した。

| 検証ゲート（エンジン実行ティック `0`） | `TP`（`/ 130`） | `FP`（`/ 130`） | `FN`（`/ 130`） | `TN`（`/ 130`） | 欠陥検出再現率（%） | 適合率（%） | 欠陥 `F1` | 採用済みプールにおける有効データ比率 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **静的フォーム検査（`rce check` + `rce test`）+ 4辺マニフェスト検証器** | **`128`** | **`0`** | **`2`** | **`130`** | **`98.46%`**（`≥ 90%` ゲート） | **`100.00%`** | **`0.9922`** | **`0.9848`**（`130 / 132`） |
| **未型付け動的スクリプト構文解析ベースライン（`godot --headless --check-only`）** | `8` | `0` | `122` | `130` | `6.15%` | `100.00%` | **`0.1159`** | `0.5159`（`130 / 252`） |

- **構文解析のみの動的検査が `F1 = 0.1159`（`≈ 0.12`）にとどまる理由**: `Godot 4.7.2 --headless --check-only` の実行で検出されたのは、直接的なGDScript呼び出しにおいて引数数（`P03`）または静的な `int`/`String` 型注釈（`P04`）が衝突する `8` 個のモジュールに限られた。その一方で、文字列キーによる `get_node("...")` および `emit_signal("...")`、物理マスク、UBOオフセット、セーブ/ネットワーク辞書、不変条件に関する `122` 件の欠陥は、すべて検出されずに通過した。
- **静的フォーム検査の正確な境界（検査可能な `FN` は `2 / 130` 件）**: 実際の `rce check` と `rce test`（`W-STEP-2`、`W-TY-1`、`W-NAME-1`、`W-INT-1`、検査付き `u64` 減算）に4辺マニフェスト検証器を加えた検査により、`128 / 130` 件の欠陥を、偽陽性 `0` 件で検出した。残る2件の欠陥（`P10_fault_5` と `P19_fault_5`）は、`LocalX`/`WorldX` のニュータイプ構造体で包まれていない裸の `i64` スカラーであり、かつ非ゼロの `example` アサーションを欠くために生じたものである。このことは、次元の誤りと座標系の誤りを静的に検出するには、個別のニュータイプによるラップか、定量的な `intent` の例示が必要であることを示している。

<div id="67-ge-h7-full-lnδδ0-lyapunov-slope-sweep-across-3-chaotic-physics-templates-840-trajectories" class="anchor-alias" aria-hidden="true"></div>

### 6.7 `GE-H7`: 3つのカオス物理テンプレートにわたる完全 $\ln(\Delta / \delta_0)$ リヤプノフ勾配掃引 (`840` 軌道)

第3節の対数的視界 $t^* = (1/\Lambda)\ln(\Delta/\delta_0)$ を連続物理トポロジーにわたって直接検証するため, `60 Hz` `IEEE 754` `binary64` (`-fp-contract=off`) テンプレート3種, すなわち **`GE-T1`** (5個の凸Sinaiバンパーをもつ`16-Body Chaotic Bumper Arena`), **`GE-T2`** (重力下の弾性床復帰を伴う`12-Peg Galton/Pinball Elastic Lattice`), および **`GE-T3`** (立方硬化ばねと中央橋脚をもつ`8-Node Coupled Spring-Pendulum Bridge`) を, `40` 個の決定論的シード×`7` 個の単一座標摂動 $\delta_0 \in \{2^{-52}, 2^{-44}, 2^{-36}, 2^{-28}, 2^{-23}, 2^{-16}, 2^{-10}\}$ から段階的に実行した (`840` 対の参照対摂動軌道, マクロ発散閾値 $\Delta = 1.0$ アリーナ単位, サブ単位初期 `|x_0| < 1` であるため `+2^-52` は初回接触以前に丸め離脱しない):

| テンプレート (`280` 軌道ずつ, `0` 右側打ち切り) | $\delta_0 = 2^{-10}$ における平均 $t^*$ (`s`) | $\delta_0 = 2^{-23}$ における平均 $t^*$ (`f32` ULP, `s`) | $\delta_0 = 2^{-52}$ における平均 $t^*$ (`f64` ULP, `s`) | OLS勾配 $\hat{\beta} = 1/\hat{\Lambda}$ (`s/nat`, `95%` ブートストラップ CI) | 示唆される $\hat{\Lambda}$ ($\text{s}^{-1}$, `95%` ブートストラップ CI) | $R^2_{\text{traj}}$ / $R^2_{\text{mean}}$ | 両側 $t_{278}$ ($p$値) |
|---|---:|---:|---:|---:|---:|---:|---:|
| **`GE-T1`: 16-Body Bumper Arena** | `2.80 ± 0.92` | `6.52 ± 1.38` | `14.49 ± 2.43` | **`0.4025`** (`[0.3823, 0.4246]`) | **`2.4846`** (`[2.3554, 2.6157]`) | `0.8569` / **`0.99953`** | `40.81` (**$10^{-118.7}$**) |
| **`GE-T2`: 12-Peg Galton Lattice** | `1.85 ± 0.61` | `3.88 ± 0.98` | `7.57 ± 1.64` | **`0.1974`** (`[0.1804, 0.2145]`) | **`5.0671`** (`[4.6611, 5.5436]`) | `0.7176` / **`0.99629`** | `26.58` (**$10^{-77.6}$**) |
| **`GE-T3`: 8-Node Coupled Bridge** | `2.94 ± 1.14` | `7.99 ± 2.02` | `17.36 ± 3.16` | **`0.5121`** (`[0.4802, 0.5440]`) | **`1.9528`** (`[1.8382, 2.0823]`) | `0.8169` / **`0.99395`** | `35.21` (**$10^{-103.7}$**) |

- **近似浮動小数点一致がなぜ失敗するかの経験的確認**: $\delta_0$ の`12.6` 桁にわたって ($2^{-10}$ から $2^{-52}$ への $4.2 \times 10^{12}$ 倍減少), セル平均発散時間は $\ln(\Delta/\delta_0)$ に対して厳密に線形に増大する ($R^2_{\text{mean}} \in [0.9940, 0.9995]$, $p \le 10^{-77.6}$)。単精度 (`2^-23`) から倍精度 (`2^-52`, $5.37 \times 10^8$ 倍小さな摂動) への更新は, 可視的マクロ発散を `GE-T2` でわずか **`3.69 s`**, `GE-T1` で **`7.97 s`**, `GE-T3` で **`9.37 s`** しか遅らせない。

<div id="68-ge-h8-complete-1-hour-216000-tick-replay-from-compact-input-stream-d-alone-across-3-oss" class="anchor-alias" aria-hidden="true"></div>

### 6.8 `GE-H8`: 3つのOSにおける、入力ストリーム$D$のみからの完全な1時間(`216,000`ティック)再生

長時間にわたる複数サブシステムのゲームプレイセッションが、隠れたエンジン状態に依存せず入力ストリーム$D$のみから完全に再生できることを検証するため、3つの**1時間(`60 Hz`で`216,000`ティック)**の`Q32.32`セッション(`HauntedJaunt_1h`、`SurvivalShooter_1h`、`TanksQ32_1h`)を再生した。入力ログは同一のバイナリ形式で、サイズは各`432,024`バイト(`24`バイトのヘッダ + ティックあたり`2`バイト)である。再生は**`macOS 27.2.1 arm64`**(`Apple M5 Max`)、**`Linux 7.0 x86_64`**(`Intel Core i9-13900H`)、**`Windows 11 Pro 26300 x86_64`**(`Intel Core i7-1165G7`)の3環境で実施した。

| 1時間セッション(`60 Hz`で`216,000`ティック) | 生 / gzip圧縮の$|D|$ | 生 / gzip圧縮の全状態ストリーム | gzipサイズ比(`Snap / D`) | 再生壁時計時間`ms`(`macOS` / `Win11`) | `3`OSストライド`100`チェックポイント | 最終1時間`SHA-256`(`tick 216,000`、3OS全体) |
|---|---:|---:|---:|---:|:---:|---|
| **`HauntedJaunt_1h`**(`169`B状態) | `432.0 KB` / **`44.60 KB`** | `36.50 MB` / `5.19 MB` | **`116.28×`**(生で`84.5×`) | `4.19` / `7.30 ms` | **`2,160 / 2,160`** | `b4120d81a8fb5b6916ef443b2e3ebc59...` |
| **`SurvivalShooter_1h`**(`365`B状態) | `432.0 KB` / **`44.60 KB`** | `78.84 MB` / `7.00 MB` | **`156.97×`**(生で`182.5×`) | `8.32` / `11.02 ms` | **`2,160 / 2,160`** | `6cce1282304dfdc5b623ad5be42357de...` |
| **`TanksQ32_1h`**(`222`B状態) | `432.0 KB` / **`44.58 KB`** | `47.95 MB` / `13.03 MB` | **`292.27×`**(生で`111.0×`) | `3.90` / `4.94 ms` | **`2,160 / 2,160`** | `ca627edaf8cb56532a33ee83997a8487...` |

- **OS間のドリフトの不在と、周囲ホスト漏洩に対する正の反証**: 純粋形式(Pure Form)の再生は、`macOS arm64`、`Linux x86_64`、`Windows 11 x86_64`の間で**`0 / 6,480`件**のチェックポイント`SHA-256`不一致を達成した。`44.6 KB`の圧縮ログから、`60 Hz`で1時間分のゲームプレイを`3.9`-`11.0 ms`で再シミュレーションした。一方、`HauntedJaunt_1h`において4種の周囲ホスト漏洩制御(`GE-L1`の壁時計ナノ秒、`GE-L2`のスタックアドレスエントロピー、`GE-L3`のランダム化された`HashMap`反復順序、`GE-L4`のホスト`f64::sin`)のいずれかを有効化すると、入力$D$からの再生は**`t_div = 1`**で破綻した。特に`GE-L4`(`f64::sin`)は、`macOS`(`0d1722cf...`)、`Linux`(`50f9ff25...`)、`Windows 11`(`54d0f774...`)において、互いに異なる3つの1時間ダイジェストを生じた。

<div id="69-ge-h9-form-to-godot-472-headless-gdscript-emitter-and-36-task-parity-suite" class="anchor-alias" aria-hidden="true"></div>

### 6.9 `GE-H9`: フォームからGodot 4.7.2 ヘッドレス GDScript エミッタおよび36タスク等価性スイート

- **外部 `GameCraft-Bench` 140タスクアーカイブの率直な監査**: [`FreedomIntelligence/gamecraft-bench`](https://github.com/FreedomIntelligence/gamecraft-bench) の直接検査により、`15` の2Dゲームファミリにわたる全`140` タスクディレクトリ（`instruction.md`、`tests/rubric.json`、およびオラクル `solution/files/`）がGitHub上で公開ダウンロード可能であることが確認された。しかし、各タスクは形式的な遷移仕様ではなくオープンエンドの自然言語ゲームプロンプトであり、その公式検証器（`gamecraft_bench.verifier`）はエージェント生成の `demo_outputs/*.json` トレースを `Xvfb`、`xdotool`、`ffmpeg`（`x11grab`）の下で再生した後、外部のマルチモーダルVLM判定器（`GAMECRAFT_BENCH_JUDGE`、`140`タスクエージェント実行あたり`148.5M`-`2.24B` LLMトークンを消費）で捕捉したビデオフレームを採点する。エンドツーエンドのLLM+VLMビデオルーブリック評価は、自然言語合成およびVLM判定器の分散をコンパイラの正しさと混同する。
- **決定論的36タスク Form-to-Godot 4.7.2（`godot --headless`）等価性ベンチマーク**: フォームからエンジンへのエミッションをGodot 4の実ランタイム内で直接試験するため、`form_to_gdscript.py` は受理された `.rce` Form（`openIE-dev/rce` コミット `1762fb4bb65a` 由来の `rce emit form` JSON AST 経由）を、64ビット `int` 強制変換、`Q32.32` リム分割ヘルパ、およびトランザクション的 `fail`/`kept` 状態ロールバックを伴うスタンドアロン静的型付け **Godot 4 GDScript**（`extends SceneTree`）にコンパイルする。**36の決定論的ゲームプレイタスク** にわたり、`GameCraft-Bench` の`15` ファミリ（`Platformer`、`Strategy`、`Tycoon`、`Open-world`、`Roguelike`、`Visual novel`、`Puzzle`、`Shooter`、`Simulation`、`Card game`、`Horror`（`horror-signal-lost` のラジオ電池ジャミング機構を含む）、`Rhythm`、`Idle`、`Racing`、`Sports`）の各々から`2` タスクに加え、`6` の参照およびマルチプレイヤシステム（`Haunted Jaunt`、`Survival Shooter`、`Tanks Q32.32`、`Inventory/Crafting`、`Quest DAG`、`4-Player Lockstep Arena`）について、FormエミットGDScriptと独立に記述された慣用的なネイティブGDScript実装の両方を `Godot Engine v4.7.2.stable.official.ed1daf0bf --headless` の下でタスクあたり`500` の決定論的入力イベント（片腕あたり`18,000` ティック＝`36,000` Godot VMティック）で実行した：
  - **Form受理（`rce check` + `rce test`）**: **`36 / 36`（`100.0%`）**。
  - **Godot 4.7.2 `--headless` 実行パス率**: Formエミット **`36 / 36`（`100.0%`）** 対 ネイティブGDScript **`36 / 36`（`100.0%`）**。
  - **ティックごとおよびローリング `SHA-256` 状態トレース等価性**: **`36 / 36` タスク（ティックごと `0 / 18,000` の `SHA-256` 不一致）**。

<a id="playable-joule-native-q3232-chrono-budget-arena-livinggame-engines"></a>

<div id="610-playable-joule-native-q3232-chrono-budget-arena-livinggame-engines" class="anchor-alias" aria-hidden="true"></div>

### 6.10 プレイ可能なジュール・ネイティブ `Q32.32` クロノ予算アリーナ（`/living/game-engines/`）

本研究の厳密な `Q32.32` 再生契約と、[『Time as an Index』](/papers/time-as-an-index/)（第9.2節）のエネルギーネイティブな時間機構を結合し、[ゲームエンジン実験場（`/living/game-engines/`）](/living/game-engines/)の計器4は、JavaScript の `BigInt` で動作する `60 Hz` の決定論的軌道航行およびピックアップ防衛ミニゲームを提供する(シミュレーション内の浮動小数点演算は `0` 回である)。

- **ライブ `SHA-256` 状態テープと決定論的再生**: 各ティックでローリング `SHA-256` 状態ダイジェストを更新し、コンパクトな1バイトのプレイヤー入力イベントを $D$ に記録する。`Replay & Verify SHA-256` をクリックすると、`(seed, D)` から試合全体を再実行し、ビット単位のハッシュ一致(`replayed_sha256 === live_sha256`)を検証する。
- **joule 予算に基づく時間的先読みと巻き戻し(`est_j` 設計モデル)**: 将来の軌道の照会(`Hellman Branch Preview`。`K` ティック先までの候補操舵分岐 `3` 本をシミュレートする)や、永続的な因果チェックポイントへの巻き戻しは、明示的なマイクロジュール(`µJ`)のバッテリーを消費する。消費量は、投機的ティックごとの `step_cost_uj` と、選択されなかった未来や巻き戻された時間線を破棄する際のランダウアー消去コストから成る。操作はキーボード、マウス/タッチ、および `WebXR` / `Gamepad` コントローラー(Meta Quest Browser を含む)で行える。

<div id="7-infeasibility-flags" class="anchor-alias" aria-hidden="true"></div>

## 7. 実現不可能フラグ

1. **GPU と API を跨いだビット単位のハードウェア描画: 不可能 (`27 / 28` ハードウェア `GPU × API` ペア、`2 / 2` 同一 GPU の `DirectX 12` 対 `Vulkan` ペアを含む、`GE-H3` において生の `SHA-256` が分岐) 一方で、知覚的許容誤差 (`PSNR >= 64.16 dB`, `SSIM >= 0.99983`, $\Delta_{\max} \le 2$) は `DirectX 12`, `Metal`, `Vulkan` 全てで保持され、GPU 出力が $S$ にフィードバックしない限り成立する。**
2. **標準浮動小数点設定でのクロスプラットフォーム正確物理シミュレーション: 不可能 (`Windows`, `macOS`, `Linux` 間)。** `-ffast-math` や `/fp:fast` を使用しなくても、標準 `std::sin`/`std::cos` は `Windows UCRT`, `Apple libSystem`, `GNU glibc` の間で 3 項分岐三角形を形成し (`t_div = 10` から `37`)、デフォルト `MSVC /fp:precise` と `Clang -ffp-contract=fast` は `x86_64` 上で `t_div = 192` に分岐し、ISA 間 `FMA` (`x86_64` 対 `arm64`) は `t_div = 406` (`GE-H2`) で分岐し、`840` のカオス軌道は $t^* \propto \ln(\Delta/\delta_0)$ を示し、$\hat{\Lambda} = 1.95$-$5.07\ \text{s}^{-1}$ (`GE-H7`) である。
3. **シミュレーション内部の GPU 計算: 正確性は不可能であり、決定的リダクションのみで実現可能**。測定されたコストは対象ハードウェア上で約 0.2% から 7.8% であり、全ターゲットで命令単位の保護 (SPIR-V NoContraction) がなければコンパイラ収縮の影響を受ける。
4. **マルチエンジン決定的挙動の出力: `GE-H4`, `GE-H8`, `GE-H9` の検査済み Form からは実現可能、型なし文字列キーのスクリプト (`GE-H6`) からは不可能。** `17` 種類のゲーム挙動 (`.rce`, Windows 11 C#, Godot 4 GDScript, Rust `ECS` の間で `0 / 680` 不一致) と `36` のヘッドレス `Godot 4.7.2` タスク (`0 / 18,000` ティック不一致) に対し、Form 投影はビット単位の挙動同等性を保つが、パースのみの動的チェックは注入されたクロスレイヤー・セマンティック障害の `93.85%` (`122 / 130`) を見逃し、`F1 = 0.1159` を示す。
5. **大量アクターに対する解釈ルール: ボックス化インタプリタでは制約あり (`N_20ms = 390` in `rce emit python`)、JIT またはコンパイル投影 (`GE-H5`) により解決。** ボックス化されていない `Wasm32`, `C++20 -O3`, `Rust -O3` 投影は `10,000` `Q32.32` アクターを `0.058`-`0.125 ms`/ティックでステップし (`3,564×`-`7,728×` の低速 Linux `RAPL` `reported_j`/ティック vs `rce emit python`)、`SHA-256` ドリフトはゼロである。
6. **プロプライエタリなサードパーティゲームエンジンの内部スケジューラを保護なし正確ホストとして利用: 未検証。** ベアメタル Windows 11 `PE` (`rustc`, `MSVC`, `csc.exe`)、`DirectX 12` (`wgpu`)、ヘッドレス `Godot 4.7.2` `SceneTree` の実行は第 6 節で検証済みであるが、Unity のマニュアルは GameRule に引用される限り `MonoBehaviour` スクリプトの順序保証を否定しており、単一決定的スケジューラループから駆動されない限り保証されない。Unity および Unreal のテンプレートカタログはクライアント側でレンダリングされ読むことができず、Unreal の実行順序ソースも取得できなかった。

<div id="8-sources-and-limits" class="anchor-alias" aria-hidden="true"></div>

## 8. 出典と限界

上記のすべての出典は、引用した箇所に限って全文を読んだ。ただし次の例外がある。GameCraft-Bench 論文については、概要、リポジトリの README、タスクディレクトリの構成、および `tests/test.sh` 検証スクリプトを読んだ。RCE の概要ページは、`openIE-dev/rce` のコミット `1762fb4bb65a` の仕様およびチェッカーのソースとあわせて読んだ。Capcom のプレスストーリーについては、記事1本のみを読んだ。時間の段階に関する計測レベル（`SATB`）およびジュール予算による時間的ゲーム機構について引用した姉妹研究は、[Time as an Index](/papers/time-as-an-index/) と [Satiation Tiered Benchmark Harness](/papers/satb-harness/)（`[same house]`）である。参照したが証拠としては引用しなかった出典は次のとおりである。ゲームを構造化されたルードム集合として記述する [Ludii ポータル](https://ludii.games/)、ホビー的な Game Grammar リポジトリ、そして描画ライブラリを説明するものであり、ゲーム記述形式を説明するものではない [PlayCanvas](https://github.com/playcanvas/engine)、[Babylon.js](https://github.com/BabylonJS/Babylon.js)、[three.js](https://github.com/mrdoob/three.js) の各 README である。

未読、課金壁またはその他入手できない情報源は、T. Schaul, "A Video Game Description Language for Model-based or Interactive Learning," IEEE CIG 2013, doi:10.1109/CIG.2013.6633610; J. Gregory, *Game Engine Architecture*, doi:10.1201/9781315267845; M. Ebner et al., "Towards a Video Game Description Language," doi:10.4230/DFU.Vol6.12191.85 であり、後者はオープンアクセスであるが本研究のためには読まれなかった。

全9件の実証スイート（`GE-H1` から `GE-H9`）において、6台のホストすべてで `measured_j = None` かつ `board_metered = false` である。これは、macOS の `L3` におけるプロセス単位の `ri_energy_nj`、Linux の `L2` におけるソケット/コア単位の RAPL `reported_j`、Windows 11 の `L3` における `GetProcessTimes` / `QueryProcessCycleTime` による活動量カウンタを厳密に区別するとともに、Chrono-Budget Arena の `est_j` の算出機構を厳密に解析的なものにとどめた結果である。静的な制約として2点が文書化されたまま残されている。第一に、`GE-H6` では、単位や座標空間を表すnewtype構造体を伴わない裸の無タグ `i64` スカラーが、130件中2件の偽陰性を生じさせた。第二に、`GE-H9` では、140件の自然言語プロンプトに対する公式 `GameCraft-Bench` のVLM判定による視覚的採点は実施していない。同評価は、開かれた形式のLLMによるアセット・プロジェクト合成と外部VLMルーブリックによる採点を対象とするものであり、決定論的なForm-to-engine振る舞いのコンパイルを対象とするものではないためである。
