---
title: "Mixture of Limits カスケードにおける下方 LUT6 コンパイル：Beneš ルーティング・ブールファブリック、コンフォーマル起動ゲート、および 4 ビット NVMe レイヤストリーミング"
deck: "まず浮動小数点演算ゼロ（0 FLOP）のページド 6 入力ルックアップテーブル（LUT6）回路を試行し、ミス時にのみ Mamba-3 および 4 ビット Non-Volatile Memory Express（NVMe）からレイヤ単位でストリーミングされる 2026 年ハイブリッドモデルを起動し、検証済みの起動結果を Beneš ルーティングされた 36 Kbit ブロック RAM（RAMB36E2）ページへと下方コンパイルする 4 段の Mixture of Limits（限界の混合）カスケード。openIE-dev/lut-adapt-ai（コミット a5e9bc1）に基づき、実経過時間、非バッファ Darwin F_NOCACHE（非バッファファイル読み取り）バイト数、アクティブなランダムアクセスメモリ（RAM）、および Yosys/Verilator による xck26 レジスタ転送レベル（RTL）シミュレーションを報告する。エネルギー数値はすべて解析的な est_j 推定値であり、ボード実測電力は測定していない。"
lang: "ja"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-4-bit-nvme-layer-streaming" class="anchor-alias" aria-hidden="true"></div>

*リビジョン 11dbc8c、2026年11月22日。参照実装および成果物：[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)（コミット [`a5e9bc1de280f973bc9051b4cc58942820a67eeb`](https://github.com/openIE-dev/lut-adapt-ai/tree/a5e9bc1de280f973bc9051b4cc58942820a67eeb)）。データ概要：[/data/#lut-adapt](/data/#lut-adapt)。LaTeX PDF：[/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf)（[ソース](/pdfs/latex/lut-adapt.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概要

本研究は、厳密な出力一致性を損なうことなく、また未検証の推測を信頼された規則へと昇格させることなく、反復されるニューラルモデルの計算処理を高速なブール真理値表ルックアップへと下方コンパイルする計算システムの構成法を検討する。本稿では、ソフトウェア測定値、レジスタ転送レベル（RTL）の論理合成およびサイクルシミュレーション結果、ならびに算出根拠を明記した解析的エネルギー推定値（`est_j`）を報告する。本リポジトリの実験ではコンセントや電源レールのジュール計は接続していない（`measured_j` は未設定であり、`board_metered` は false である）。

**平易な言葉で言えば**

1. 展開されたシステムが受け取る入力の大半はすでに解決済みのパターンを繰り返しているため、毎ステップ完全な浮動小数点ニューラルネットワークを実行すると計算資源とメモリ帯域幅が浪費される。
2. 本参照実装は、ストリーミング状態空間モデルおよび基盤モデルの前段に再構成可能な 6 入力真理値表（`LUT6`）ルックアップ層を配置し、明示的な検査によって回答が保証された後でのみ、それをルックアップメモリページへと下方コンパイルする。
3. 2026 年のハイブリッド言語モデルがソリッドステートドライブ（SSD）からレイヤごとに重みをストリーミングする際、浮動小数点演算ゼロ（0 FLOP）の `LUT6` ドラフタが複数トークンのバーストを提案し、ターゲットモデルが 1 回のディスクスイープでそれを一括検証することで、出力トークンを一切変えずにディスク読み取り量をほぼ `3×` 削減する。

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 用語、頭字語、および測定ラベル

<ul id="terms">
<li>MoL: Mixture of Limits（限界の混合）、『計量コミットゲート』第II部で定義されたカスケード規則 [same house]</li>
<li>LA: 本研究で用いる主張および反証条件の接頭辞（LA-1 から LA-8、LA-F1 から LA-F8）</li>
<li>LUT, LUT6, INIT: ルックアップテーブル、6 入力 Xilinx UltraScale+ ブールプリミティブ、およびその 64 ビット真理値表初期化マスク</li>
<li>BRAM, RAMB36E2, URAM: ブロック RAM、36 Kbit デュアルポート UltraScale+ ブロック RAM プリミティブ（xck26 上に 144 個搭載）、および UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: コンフィギュラブル・ロジック・ブロック、フリップフロップ、デジタル信号処理スライス、および AMD Kria KV260 ボード（xck26）</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: フィールド・プログラマブル・ゲート・アレイ、特定用途向け集積回路、レジスタ転送レベル、ルックアップあたりサイクル数、配置配線、最悪負スラック、および Field-Programmable Logic 国際会議</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML: Advanced eXtensible Interface、Zynq プロセッシングシステム、プログラマブルロジック、システム・オン・モジュール、オンボード電力モニタ IC、電源レール、Intel Running Average Power Limit、および NVIDIA Management Library</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: 状態空間双対性（State Space Duality）、状態空間モデル、多入力多出力、回転位置埋め込み、ゲート付き線形ユニット活性化関数、グループ化クエリアテンション、キー・バリュー・キャッシュ、バイト対符号化、大規模言語モデル、Mixture-of-Experts、多層パーセプトロン、および文脈自由文法</li>
<li>HC, SOINN, WNN, DWN: 階層コンテキスト自己増殖型ニューラルネットワーク（hierarchy-context Self-Organizing Incremental Neural Network）、重みなしニューラルネットワーク、および微分可能重みなしニューラルネットワーク（Differentiable Weightless Neural Network）</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: 結合埋め込み予測アーキテクチャ、エネルギーベース推論モデル、適応的コンフォーマル推論（Adaptive Conformal Inference）、分布外、受信者操作特性曲線下面積、最大ソフトマックス確率、およびモンテカルロ法（Monte Carlo）</li>
<li>PLD, REST, EAGLE, LFM2, HF: プロンプトルックアップデコーディング（Prompt Lookup Decoding）、検索ベース投機的デコーディング、言語モデル効率化のための外挿アルゴリズム、Liquid Foundation Model 2.5（LiquidAI/LFM2.5-350M）、および HuggingFace</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB: Non-Volatile Memory Express ストレージ、Darwin F_NOCACHE 非バッファファイルフラグ、Portable Operating System Interface、ランダムアクセスメモリ、動的 RAM、静的 RAM、入出力、キロバイト、メガバイト、およびギガバイト</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, SIMD, AD, FD, BPB, FP16, FP32, INT4: 浮動小数点演算、百万回浮動小数点演算、積和演算、単一命令複数データ、自動微分、有限差分、バイトあたりビット数、16/32 ビット浮動小数点、および 4 ビット整数</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house]、Wise Computer Automation [same house]、検証済み完了（verified completion）、およびソフトウェア工学ベンチマーク接頭辞</li>
<li>CLI, HTTP, SSE, API, ACL, OS, CPU, GPU, SW: コマンドラインインターフェース、Hypertext Transfer Protocol、Server-Sent Events、アプリケーション・プログラミング・インターフェース、計算言語学会（Association for Computational Linguistics）、オペレーティングシステム、中央/グラフィックス処理装置、およびソフトウェア</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CAM, XNOR: 仮想ローカルエリアネットワーク（IEEE 802.1Q）、Transport Layer Security、ディープパケットインスペクション、抽象構文木、JavaScript Object Notation、カンマ区切り値、セキュアハッシュアルゴリズム、連想メモリ（content-addressable memory）、および排他的否定論理和（exclusive-NOR）</li>
</ul>

以下のすべての表において、3 つの証拠クラスを厳密に区別する。

| 証拠ラベル | 本研究における意味 |
| :--- | :--- |
| **`Measured (SW / NVMe I/O)`** | Darwin `F_NOCACHE` 下で `os.pread` を介して読み書きされた正確なバイト数、常駐メモリ割り当て量、Apple M5 Max 上の実経過秒数、およびビット/トークン単位の厳密な一致率。`measured_j` は未設定（`None`）である。 |
| **`Simulated (RTL)`** | Yosys `0.71+`（Kria KV260 `xck26` を対象とする `synth_xilinx -family xcup`）による構造ネットリスト素子数、および Verilator `5.054` によるサイクル数（`CPI = 1`）。Vivado のタイミング収束結果ではなく、ボード実測電力でもない（`board_metered = false`）。 |
| **`Estimated (est_j)`** | 演算回数または熱設計電力（TDP）時間換算から算出された解析的ジュール値（macOS 上に `RAPL`/`NVML` ハードウェアカウンタが存在しない場合の `joule_meter.py` フォールバック）。同一計算式内の条件間でのみ比較可能であり、シリコン上の実測ワット数ではない。 |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 アーキテクチャの背景と貢献

[計量コミットゲート](/papers/gates/) `[same house]` の第II部では **Mixture of Limits（限界の混合）** を定義している。すなわち、1ジュールあたりの合格確率 $p_i / c_i$ の非増加順にギアを試行し（Simon and Kadane, 1975）、タスク完了述語 $C(z) = 1$ が成立した時点で直ちに停止し、かつ `ModelGenerated` の出力を `Deterministic` へと格上げすることを禁じる規則である。しかし、静的なルックアップ層は展開前に書き込まれたエントリしかカバーできない。その一方で、既存のルックアップテーブル型ニューラルネットワークである LogicNets（Umuroglu et al., 2020）、DiffLogic（Petersen et al., 2022）、および微分可能重みなしニューラルネットワーク（Bacellar et al., 2024）は、結線構造を静的な FPGA 配線内に固定しているため、入力分布がシフトするたびにベンダツールの配置配線を再実行しなければならない。

`lut-adapt-ai` 参照実装は、**オンライン下方 `LUT6` コンパイル**によってカスケードの最上段と最下段の間のループを閉じる。

- **第0段（ルックアップ - ページド Beneš + `LUT6`）**：非ブロッキング $512 \times 512$ **Beneš-Copy-Beneš** マルチキャストスイッチを介してルーティングされ、$81 \times \texttt{RAMB36E2}$ デュアルポート・ブロックメモリ群にキャッシュされた 64 ビット真理値表マスクを評価する（浮動小数点演算 `0` 回、Verilator シミュレーションにおいて 1 サイクルでのページ切り替えを実現）。
- **第1段（ストリーム - `Mamba-3` 複素 MIMO 状態空間双対性）**：一定サイズ $O(1)$ の再帰状態（`14.3M` パラメータ参照実装で `48 KB` のピン留めメモリ）を用いて系列履歴に依存するミスを処理し、$O(L)$ のキー・バリュー・キャッシュ肥大化を回避する。
- **第2段（トポロジ - `HC-SOINN`）**：潜在埋め込み空間上でオンラインのプロトタイプ・トポロジを維持し、レジーム境界を分離するとともに、ラベルなし分布シフトが到来した際にサーキットブレーカ（`Refuse` 拒否または上位段へのエスカレーション）を作動させる。
- **第3段（最終段モデル - `JEPA-EBRM` および `AirMoL` 4 ビット NVMe ストリーミング）**：より安価な段が棄権した場合、または厳密なターゲット検証が必要な場合にのみ、潜在エネルギーベース検証やレイヤ単位でストリーミングされる 2026 年の事前学習済み基盤モデル（`LiquidAI/LFM2.5-350M` および `Qwen/Qwen3.5-0.8B-Base`）を呼び出す。
- **下方 `SleepCrystallizer`**：Walsh-Hadamard スペクトル・ウォームスタート、結合最頻値最小項真理値表、および Waksman スイッチスケジュールを用いて反復する起動トレースを抽出し、推論を停止することなく、また FPGA の配置配線を走らせることなくシャドウ・ブロックメモリバンクを切り替える。

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 主な貢献

1. **償却型下方コンパイル条件**：Simon-Kadane の $p_i/c_i$ 順序付けを拡張し、定常ホライズン $\Delta T$ にわたる明示的なコンパイルコスト $E_{\text{compile}}$ を組み込んだ条件を導出した。
2. **非ブロッキング $512 \times 512$ Beneš-Copy-Beneš および `81`-`RAMB36E2` RTL アーキテクチャ**：フラットなクロスバにおける Kria KV260 の `102.0%` ロジック溢れ（`119,478` LUT）と、フリップフロップ・ページマルチプレクサにおける `926,619` LUT 爆発の双方を解消し、`41,186` 個の UltraScale+ CLB LUT（`xck26` の `35.2%`）、`81` 個の `RAMB36E2` ブロック（`56.2%`）、`0` 個の `DSP48` スライスへと論理合成され、シミュレーション上で `1` サイクル（公称 `250 MHz` 時に `4.0 ns`）のページ切り替えを達成した。
3. **汎用 $\le 64$ ビット結合最頻値最小項合成**：相関する分岐において結合最頻値最小項ルックアップが周辺ビットプレーン DiffLogic 丸めを優越することを示し、1 つの `uint64` ワードに $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ 個のサブワードトークンを格納する方式を構築した（`|V| = 65,536` で `16b × 4 = 64b`、`|V| = 248,320` で `18b × 3 = 54b`）。
4. **オラクル不要な分割コンフォーマル + オンライン ACI 結晶化ゲート**：動径方向正則化を備えた潜在 `JEPA-EBRM` 非適合度スコアを分割コンフォーマル校正および適応的コンフォーマル推論（Gibbs and Candès, 2021）と組み合わせ、ソフトマックスや MC-Dropout ベースラインが `17.62%-24.28%` の誤結晶化リスクを示すシフトトラフィック上で、`0.00%` の誤結晶化リスクと `1.0000` の OOD AUROC を記録した。
5. **2026 年ハイブリッドモデル上の `AirMoL` 追加スイープゼロ 4 ビット NVMe ストリーミング**：Darwin `F_NOCACHE` `os.pread` による 4 ビット・グループ量子化レイヤストリーミング、RAM 内ハイブリッド状態ロールバック、およびオンライン・トークン `LUT6` バースト投機を `LiquidAI/LFM2.5-350M`（2026年3月）と `Qwen/Qwen3.5-0.8B-Base`（2026年2月）に適用し、アクティブな重み RAM を FP32 モデルサイズの `8.45%-9.47%` に抑え、`100.0%` の厳密トークン一致性を維持したまま NVMe ディスク読み取り量をそれぞれ `2.86×` および `2.74×` 削減した。
6. **多言語システムスイートとライブ HTTP/SSE サーバ**：Python/PyTorch/Triton、Rust `Burn 0.22.1 / CubeCL` Metal、Zig `0.17.1`、Go `1.27.4` SIMD、Julia `1.13.4` Enzyme、および `mol_code_cli.py` にわたりカスケード全体を相互検証した。

<div id="13-same-house-disclosure-and-provenance-boundaries" class="anchor-alias" aria-hidden="true"></div>

### 1.3 同一組織内の開示と来歴の境界

Open Interface Engineering による先行研究である [計量コミットゲート](/papers/gates/)、[AI需要におけるタスク飽和と総量リバウンド](/papers/satiation/)、[Reality Code Engine](/papers/rce/)、[RCE-JEPA](/papers/rce-jepa/)、および [RCE Compile](/papers/rce-compile/) はいずれも `[same house]`（同一組織）の研究であり、開示およびアーキテクチャ上の連続性を示すためにのみ引用し、外部からの独立した裏付けとしては一切扱わない。本稿全体を通じて以下の 2 つの不変条件が拘束力を持つ。

- **来歴の非強化原則（`ModelGenerated ↛ Deterministic`）**：決定論的な `RCE` 仕様検査からコンパイルされたテーブルは、検証済み保留セット上で `Check-safe` とラベル付けされる（オンライン実行時は `HC-SOINN` / `RCE` サーキットブレーカにより保護される）。オラクル不要な `JEPA-EBRM` コンフォーマルゲートの下で結晶化されたテーブルは有限標本統計的限界（`Conformal-bounded`、$1-\alpha$）を伴うにとどまり、`Deterministic` へ昇格されることは決してない。
- **提案者と決定権者の分離（`The drafter proposes; the target decides`）**：投機的デコーディングにおいて、`PagedBenesLUT6` は厳密に 0 FLOP の提案者としてのみ機能し、出力されるすべてのバイトまたはトークンはターゲットモデルの貪欲デコーディングに対して検証される（`100.0%` 可逆一致）。

---

<div id="2-mathematical-formulations-and-four-results" class="anchor-alias" aria-hidden="true"></div>

## 2. 数学的定式化と4つの理論結果

<div id="21-result-1-cascade-ordering-with-amortized-downward-compilation" class="anchor-alias" aria-hidden="true"></div>

### 2.1 結果 1：償却型下方コンパイルを伴うカスケード順序付け

入力 $x$ に対して逐次的に試行されるギア $i \in \{0, 1, 2, 3\}$ を考える。ギア $i$ は確率 $p_i$、期待解析エネルギー $c_i > 0$ で完了述語 $C(z) = 1$ を満たす。Simon and Kadane (1975) により、期待消費エネルギー

$$\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j < k} \bigl(1 - p_{\sigma(j)}\bigr)$$

が最小化されるための必要十分条件は、ギアを $p_{\sigma(k)} / c_{\sigma(k)}$ の非増加順に実行することである。いま、定常レジーム $\mathcal{D}_r$ が残り $\Delta T$ クエリにわたり持続し、その間は起動パスが $p_{\text{wake}} = 1$ かつコスト $c_{\text{wake}}$ で完了するものとする。検証済み起動が $N_{\text{wake}}$ 回蓄積した後に一度限りのコンパイルエネルギー $E_{\text{compile}}$ を投じると、検証済みヒット率 $p_0' \in (0, 1]$ かつルックアップコスト $c_0 \ll c_{\text{wake}}$ を持つ第0段 `LUT6` ページが生成される。

**命題 1（下方結晶化の純エネルギー条件）。** *ホライズン $\Delta T$ にわたる期待累積解析消費エネルギーが下方コンパイルによって削減されるための必要十分条件は、次式が成り立つことである。*

$$\Delta T \cdot \bigl(p_0' c_{\text{wake}} - c_0\bigr) > E_{\text{compile}}, \qquad \text{and} \qquad \frac{p_0'}{c_0} > \frac{1}{c_{\text{wake}}}.$$

*証明。* 結晶化を行わない場合、$\Delta T$ クエリのコストは $\Delta T \cdot c_{\text{wake}}$ である。コスト $E_{\text{compile}}$ をかけて結晶化を行う場合、$p_0'/c_0 > 1/c_{\text{wake}} \iff c_0 < p_0' c_{\text{wake}}$ が成り立つ限り第0段が起動パスに先行し、各クエリのコストは $c_0 + (1 - p_0') c_{\text{wake}}$ となって 1 ステップあたり $p_0' c_{\text{wake}} - c_0 > 0$ が節約される。これを $\Delta T$ ステップにわたり合計すると、純節約量は $\Delta T(p_0' c_{\text{wake}} - c_0) - E_{\text{compile}} > 0$ となる。激しい分布変動下（$\Delta T \le \Delta T^*$）ではコンパイルはかえってエネルギー損失を招くため、`SleepCrystallizer` では最小起動バッファ $N_{\text{wake}}$ と保留セット一致率ゲート $\tau_{\text{agree}} = 0.985$ を設けている。$\blacksquare$

<div id="22-result-2-non-blocking-512512-benešcopybeneš-multicast-routing" class="anchor-alias" aria-hidden="true"></div>

### 2.2 結果 2：非ブロッキング $512 \times 512$ Beneš-Copy-Beneš マルチキャストルーティング

$G = 80$ 個の動的 `LUT6` セルからなる第0段バンクは、任意のファンアウトを許容しつつ $N = 512$ ビット幅のバスから $M = 6G = 480$ 本の入力ピンを選択する必要がある。全単射の Beneš 置換網では高ファンアウト配線を複製できず、一方でフラットな $512:1$ マルチプレクサ・クロスバは KV260 のリソース上限を超過する（`384` ポートの時点ですでに `119,478` CLB LUT を消費する）。

**定理 2（Beneš-Copy-Beneš による無競合マルチキャスト）。** *$N = 2^n$（$n=9, N=512$）かつ $M \le N$（$M=480$）に対し、任意の多対一マルチキャスト写像 $\phi: \{0, \dots, M-1\} \to \{0, \dots, N-1\}$ は、$\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ を通じて*

$$D(N) = 2(2\log_2 N - 1) + \log_2 N = 5\log_2 N - 2 = 43 \text{ stages}$$

*の段数（各段は $N/2 = 256$ 個の SRAM 構成型 $2 \times 2$ スイッチ、合計 $11,008$ 構成ビット）でリンク競合なしにルーティングでき、そのスイッチ設定は FPGA 配置配線を一切要さず $O(N \log N)$ 時間で計算可能である。*

*証明。* 相異なるアクティブ入力を $U = \{s_1, \dots, s_r\}$ とし、そのファンアウトが $\sum_{j=1}^r m_j = M \le N$ を満たすものとし、部分和を $S_0 = 0, S_j = \sum_{i=1}^j m_i$ とおく。集約網 $\mathcal{B}_1$（$17$ 段）は Waksman の二部グラフ 2 彩色法（Beneš, 1965; Waksman, 1968）により $\pi_1(s_j) = S_{j-1}$ へと写像する。コピー網 $\mathcal{C}$（$9$ バタフライ段）は Thompson の単調コピー構成法（Thompson, 1978; Lee, 1988）により、各 $S_{j-1}$ を互いに素な単調区間 $[S_{j-1}, S_j - 1]$ 上へリンク競合なしに複製する。出力側 Beneš 網 $\mathcal{B}_2$（$17$ 段）は $[S_{j-1}, S_j - 1]$ を $\phi^{-1}(s_j)$ の上へと全単射置換する。$\blacksquare$

<div id="23-result-3-joint-mode-minterm-synthesis-vs-marginal-coordinate-argmax" class="anchor-alias" aria-hidden="true"></div>

### 2.3 結果 3：結合最頻値最小項合成と周辺座標 argmax の比較

独立したビットプレーンごとの DiffLogic 層は、複数ビットのバースト $\mathbf{Y} = (Y_1, \dots, Y_B)$ を座標ごとの丸め $\hat{y}_b(c) = \mathbb{I}[\Pr(Y_b = 1 \mid c) > 1/2]$ によって予測するため、相関した複数の分岐が混ざり合って無効な**キメラ（chimera）**トークンが生成されてしまう。

**命題 3（結合最頻値最小項の優越性とゼロ・キメラ特性）。** *離散コンテキスト $\psi(X) = c$ および $B \le 64$ ビットのバースト空間 $\mathcal{Y}$ に対し、結合最頻値テーブル $T^*(c) = \arg\max_{\mathbf{y} \in \mathcal{Y}} \Pr(\mathbf{Y} = \mathbf{y} \mid c)$ は $\Pr[\mathbf{Y} = T^*(\psi(X))] \ge \Pr[\mathbf{Y} = \hat{\mathbf{y}}^{\text{marg}}(\psi(X))]$ を満たし、常に台 $\operatorname{supp}(\mathbf{Y} \mid c)$ の内部にとどまり、周辺丸めによるキメラを回避する（例えば $(1,1,0), (1,0,1), (0,1,1)$ にそれぞれ確率質量 $0.40, 0.35, 0.25$ がある場合、周辺丸めは無効な $(1,1,1)$ へと丸められて完全一致率が `0%` となるのに対し、$T^*$ は `40%` を達成する）。語彙サイズ $|V|$、ビット幅 $b_V = \lceil \log_2 |V| \rceil$ に対し、1 つの `uint64` ワードには $K = \lfloor 64 / b_V \rfloor$ 個の BPE トークンが格納される（`LFM2.5-350M` では `16b × 4 = 64b`、`Qwen3.5-0.8B-Base` では `18b × 3 = 54b`）。* $\blacksquare$

<div id="24-result-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 2.4 結果 4：オラクル不要な潜在 `JEPA-EBRM` 分割コンフォーマル + オンライン ACI ゲート

決定論的な `RCE` 検査が利用できない状況でハルシネーションによる自己蒸留を防ぐため、本参照実装は動径方向に正則化された潜在エネルギーを用いて候補ペアを評価する。

$$E_\phi(x, y) = \frac{1}{2}\|f_\theta(x) - \mu_y\|_2^2 + \frac{\lambda_r}{2}\|f_\theta(x)\|_2^2 + \psi_\phi(f_\theta(x), y), \qquad \lambda_r > 0, \quad |\psi_\phi| \le C_\psi.$$

保留セットによる分割コンフォーマル校正が分位点閾値 $\hat{Q}_{1-\alpha}$ を設定し、オンライン適応的コンフォーマル推論（ACI）が $\alpha_{t+1} = \alpha_t + \gamma(\alpha - \text{err}_t)$（Gibbs and Candès, 2021）を更新し、予測集合の要素数が $|\mathcal{C}_t(x)| = |\{y : E_\phi(x,y) \le \hat{Q}_{1-\alpha_t}\}| = 1$（`Conformal-bounded`）を満たすときにのみ $(x, \hat{y})$ の `SleepCrystallizer` への受け入れを許可する。Vovk et al. (2005) および Gibbs and Candès (2021) により、交換可能な分布下での周辺被覆率は少なくとも $1-\alpha$ となり、分布シフト下での長期的な非被覆率は $\alpha$ に収束し、さらに半径 $R(\alpha_t) = \sqrt{2(\hat{Q}_{1-\alpha_t} + C_\psi)/\lambda_r}$ を超える多様体外のすべての半直線上で $\mathcal{C}_t(x) = \emptyset$（`Refuse` 拒否 / 棄権）となる。

---

<div id="3-reference-architecture-polyglot-suite-and-kv260-rtl" class="anchor-alias" aria-hidden="true"></div>

## 3. 参照アーキテクチャ、多言語実装スイート、および KV260 RTL

図 1 に、`src/clai/` における 4 段カスケードおよび下方 `SleepCrystallizer` ループを示す。

![図 1. 4段 Mixture of Limits カスケードにおける下方コンパイル。](/figures/lut-adapt/mol-downward-cascade.svg)

*図 1. 4段 Mixture of Limits カスケードにおける下方コンパイル。設計図であり、ボード電力の実測値ではない。[PNG](/figures/lut-adapt/mol-downward-cascade.png) · [インタラクティブ・エクスプローラ](/living/lut-adapt/#la-diag-01)。*

`openIE-dev/lut-adapt-ai` 内の 5 つのシステム実装がこのカスケードを相互検証している。すなわち、Python/PyTorch/Triton（`src/clai/`）、Rust `Burn 0.22.1 / CubeCL` Metal（`sys/rust/`）、Zig `0.17.1`（`sys/zig/`）、Go `1.27.4` SIMD（`sys/go/`）、および Julia `1.13.4` Enzyme（`sys/julia/`）である。

図 2 は `hw/kv260/rtl/clai_benes_hotswap_core.sv` における Kria KV260（`xck26`）向け RTL データパスを示しており、`512` 個の常駐 `LUT6` ページ（`5,120` 個の `INIT` ビット + `48` ビットのコンテキストタグ + 有効ビット）を `81` 個の並列 `RAMB36E2` デュアルポートメモリにマッピングすることで、単一サイクル（公称 `250 MHz` で `4.0 ns`、`CPI = 1.0`）のコンテキスト切り替えを実現する。

![図 2. Beneš-Copy-Beneš マルチキャストファブリックと単一サイクル BRAM LUT6 ページキャッシュ。](/figures/lut-adapt/benes-paged-silicon.svg)

*図 2. Yosys `0.71+` および Verilator `5.054` シミュレーション（`board_metered = false`）における AMD Kria KV260（`xck26`）向け `512×512` Beneš-Copy-Beneš マルチキャストファブリックおよび `81 × RAMB36E2` 単一サイクル `LUT6` ページキャッシュ。[PNG](/figures/lut-adapt/benes-paged-silicon.png) · [インタラクティブ・エクスプローラ](/living/lut-adapt/#la-diag-02)。*

図 3 は `AirMoL`（`src/clai/frontier/air_mol_streamer.py` および `hf_air_mol_pretrained.py`）を示している。Darwin `F_NOCACHE` `os.pread` を介して 4 ビット・グループ量子化シャードをストリーミングし、単一スイープ内で `[last_tok, d_1..d_K]` を一括検証するとともに、コンパクトなハイブリッド状態（`Short-Conv/SSM` または `Gated DeltaNet` + スパースな `6` 層 `GQA` KV クロップ）を RAM 内にスナップショット保持することで、ドラフトの部分棄却時にも**追加の NVMe スイープを一切不要**にしている。

![図 3. 汎用 64 ビット・トークン LUT6 投機を備えた AirMoL 4 ビット NVMe レイヤストリーミング。](/figures/lut-adapt/airmol-nvme-speculation.svg)

*図 3. `LiquidAI/LFM2.5-350M` および `Qwen/Qwen3.5-0.8B-Base` における汎用 `≤64` ビット・トークン `LUT6` 投機を備えた `AirMoL` 追加スイープゼロ 4 ビット NVMe レイヤストリーミング。[PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [インタラクティブ・エクスプローラ](/living/lut-adapt/#la-run-01)。*

---

<div id="4-claims-and-results" class="anchor-alias" aria-hidden="true"></div>

## 4. 主張と実験結果

<div id="41-claim-la-1-analytical-est_jvc-reduction-on-synthetic-tasks-and-real-pcap-traffic" class="anchor-alias" aria-hidden="true"></div>

### 4.1 主張 LA-1：合成タスクおよび実 `.pcap` トラフィックにおける解析的 `est_j/VC` の削減

| ワークロードとウィンドウ | 第0段比率 | 合格率 | 解析的 `est_j / VC` | Verilator 一致率 | 証拠クラス |
| :--- | :---: | :---: | :---: | :---: | :--- |
| 合成タスク ep. `1-512`（コールド起動） | `0.00%` | `0.0% → 52.0%` | `2,323.18 est_j` | - | SW + `est_j` |
| 合成タスク ep. `3,073-3,584`（結晶化後） | `52.73%` | `60.55%` | `2.59 est_j` (`895×`) | `100.0%` | Verilator + `est_j` |
| `.pcap` パケット `1-512`（コールド IPv4） | `0.00%` | `73.05%` | `3.3351 est_j` | `100.0%` | Verilator + `est_j` |
| `.pcap` パケット `1,537-2,048`（結晶化後） | `100.00%` | `100.00%` | `0.000140 est_j` | `100.0%` | Verilator + `est_j` |
| `.pcap` パケット `2,049-2,560`（VLAN `0x8100` シフト） | `2.73%` | `68.55%` | `3.0485 est_j` | `100.0%` | ブレーカ + `est_j` |
| **`.pcap` パケット `2,561-3,072`（再結晶化後）** | **`100.00%`** | **`100.00%`** | **`0.000131 est_j` (`25,458×`)** | **`100.0%` (`5,120/5,120`)** | **Verilator + `est_j`** |

<div id="42-claim-la-2-five-language-polyglot-parity-and-zero-allocation-dataplanes" class="anchor-alias" aria-hidden="true"></div>

### 4.2 主張 LA-2：5言語実装の一致性とゼロアロケーション・データプレーン

| 実装 | ターゲット / バックエンド | 主な結果 | 証拠クラス |
| :--- | :--- | :--- | :--- |
| **Rust (`sys/rust/`)** | `Burn 0.22.1` + `CubeCL` Metal GPU | `2,331.42 → 0.19 est_j/VC`、第0段比率 `95.31%`、KV260 `.v` を出力 | 実測 SW + `est_j` |
| **Zig `0.17.1` (`sys/zig/`)** | `@Vector(8, f32)` SIMD + `@popCount` | ホットループ内のヒープ割り当て `0` バイト、`87 ns/pkt`（`11.49M pkts/s`） | 実測 SW（M5 Max） |
| **Go `1.27.4` (`sys/go/`)** | ワーカプール + `OnesCount64` | `0 B/op`、`0 allocs/op`、`31.86 ns/op`（`31.39M evals/s`） | 実測（`go test`） |
| **Julia `1.13.4` (`sys/julia/`)** | `Enzyme.jl` リバースモード自動微分（AD） | 中心有限差分（FD）に対する最大勾配誤差：`6.11 × 10⁻¹⁰` | 実測数値検証 |

<div id="43-claim-la-3-kv260-xck26-benešcopybeneš-and-ramb36e2-paged-synthesis" class="anchor-alias" aria-hidden="true"></div>

### 4.3 主張 LA-3：KV260（`xck26`）Beneš-Copy-Beneš および `RAMB36E2` ページド論理合成

| RTL アーキテクチャ | ページ数 | 切替レイテンシ | `xcup` CLB LUT 数（`% xck26`） | `RAMB36E2` | `DSP48` | ドリフト後精度 | 証拠クラス |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `2A` フラット `512:1` クロスバ（`64` LUT6） | `1` | `82 cyc` | `119,478`（**`102.0%` 溢れ**） | `0` | `0` | `98.44%` | シミュレーション（Yosys） |
| `2B` コンパクト・クロスバ（`32` LUT6） | `1` | `82 cyc` | `59,739`（`51.0%`） | `0` | `0` | `95.94%` | シミュレーション（Yosys） |
| `2C` 固定結線 DiffLogic / WNN | `1` | Vivado 再 PAR | `160`（`0.14%`） | `0` | `0` | **`52.34%`** | シミュレーション（Yosys） |
| `2D` 単一ページ Beneš-Copy-Beneš | `1` | `82 cyc` | `40,155`（`34.3%`） | `0` | `0` | `98.44%` | シミュレーション（Yosys + Verilator） |
| `P2` 分散 FF + `512:1` マルチプレクサ | `512` | `1 cyc` | `926,619`（**`791.2%` 溢れ**） | `0` | `0` | `98.44%` | シミュレーション |
| **`P3` Beneš + `81` `RAMB36E2`（参照実装）** | **`512`** | **`1 cyc` (`4.0 ns`)** | **`41,186` (`35.2%`)** | **`81` (`56.2%`)** | **`0`** | **`98.44%`** | **シミュレーション（Yosys + Verilator）** |

<div id="44-claim-la-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.4 主張 LA-4：オラクル不要な潜在 `JEPA-EBRM` 分割コンフォーマル + オンライン ACI ゲート

| 結晶化ゲート | パス数 | 誤結晶化リスク | OOD AUROC | 安全 ID 被覆率 | クリーン `LUT6` 精度 | シフト検知 | 証拠クラス |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `3A` Softmax MSP ($\max p \ge 0.95$) | `1` | `17.62%` | `0.8552` | `90.93%` | `99.22%` | `False` | 実測 SW |
| `3B` 温度スケーリング・マージン | `1` | `17.66%` | `0.8422` | `91.12%` | `98.83%` | `False` | 実測 SW |
| `3C` ヘルムホルツ・ロジットエネルギー | `1` | `24.28%` | `0.8045` | `97.17%` | `99.80%` | `False` | 実測 SW |
| `3D` MC-Dropout（`5` パス） | `5` | `18.24%` | `0.8494` | `91.03%` | `99.61%` | `False` | 実測 SW |
| **`3E` 潜在 `JEPA-EBRM` + コンフォーマル ACI** | **`1`** | **`0.00%`** | **`1.0000`** | **`95.66%`** | **`99.02%`** | **`True`** | **実測 SW** |

<div id="45-claim-la-5-lossless-byte-level-speculative-decoding-on-520-kb-polyglot-source-code" class="anchor-alias" aria-hidden="true"></div>

### 4.5 主張 LA-5：`520 KB` 多言語ソースコードにおける可逆バイトレベル投機的デコーディング

| アーキテクチャ | 厳密一致率 | パスあたりバイト数 | パス数（`64 B`） | ドラフト FLOPs | MFLOPs / Byte | `est_mJ / Byte` | 証拠クラス |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` 因果 Transformer（`RoPE+SwiGLU`） | `100.0%` | `1.00` | `64.00` | `0` | `7.209` | `58.94` | 実測 SW + `est_j` |
| `B` `Mamba-3` 複素 MIMO（`T=1`） | `100.0%` | `1.00` | `64.00` | `0` | `2.257` | `20.84` | 実測 SW + `est_j` |
| `C` `PLD` プロンプト内ルックアップ | `100.0%` | `2.13` | `29.98` | `0` | `1.322` | `11.52` | 実測 SW + `est_j` |
| `D` `REST` コーパス接尾辞トライ | `100.0%` | `3.84` | `16.65` | `0` | `0.734` | `6.40` | 実測 SW + `est_j` |
| `E` `Medusa` 並列 MLP ヘッド | `100.0%` | `2.62` | `24.44` | `428,288` | `1.241` | `9.46` | 実測 SW + `est_j` |
| `F` `EAGLE-2` ニューラル・ドラフト木 | `100.0%` | `2.75` | `23.29` | `1,122,560` | `1.435` | `9.07` | 実測 SW + `est_j` |
| **`G` `MoL` ページド Beneš `LUT6`（参照実装）** | **`100.0%`** | **`3.84`** | **`16.69`** | **`0`** | **`0.736`** | **`6.41`** | **実測 SW + `est_j`** |

<div id="46-claim-la-6-controlled-airmol-4-bit-nvme-streaming-143m-matched-pair" class="anchor-alias" aria-hidden="true"></div>

### 4.6 主張 LA-6：統制された `AirMoL` 4ビット NVMe ストリーミング（`14.3M` 対照ペア）

| オフロード型ストリーミング構成 | 一致率 | スイープあたりバイト数 | スイープ数 | NVMe 読取量 | NVMe 書込量 | ピーク RAM | `ms / Byte` | 証拠クラス |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `AirLLM` Transformer FP16 + KV スピル | `100%` | `1.00` | `64.00` | `2,130.0 MB` | `407.6 MB` | `8.81 MB` | `60.64` | 実測（`F_NOCACHE`） |
| `2` `AirLLM` Transformer 4 ビット + KV スピル | `100%` | `1.00` | `64.00` | `887.6 MB` | `407.6 MB` | `8.81 MB` | `64.87` | 実測（`F_NOCACHE`） |
| `3` `AirMamba-3` 4 ビット + スワップ型 `EAGLE-2` | `100%` | `2.86` | `22.38` | `175.3 MB` | `0.0 MB` | `7.20 MB` | `19.20` | 実測（`F_NOCACHE`） |
| `4` `AirMamba-3` 4 ビット + ピン留め $O(1)$（`T=1`） | `100%` | `1.00` | `64.00` | `488.3 MB` | `0.0 MB` | `7.20 MB` | `37.72` | 実測（`F_NOCACHE`） |
| **`5` `AirMoL` 4 ビット + コールド `LUT6`（参照実装）** | **`100%`** | **`3.74`** | **`17.12`** | **`130.7 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.18`** | **実測（`F_NOCACHE`）** |
| **`6` `AirMoL` 4 ビット + 起動結晶化後（参照実装）** | **`100%`** | **`4.27`** | **`15.00`** | **`114.4 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.09`** | **実測（`F_NOCACHE`）** |

<div id="47-claim-la-7-pretrained-2026-hybrid-models-under-airmol-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 主張 LA-7：`AirMoL` 下の 2026 年事前学習済みハイブリッドモデル（`LFM2.5-350M` & `Qwen3.5-0.8B-Base`）

| 2026 年チェックポイントと条件 | 一致率 | スイープあたり Tok | スイープあたり文字数 | スイープ数 | NVMe 読取量 | ピーク・アクティブ RAM（`% FP32`） | `tok/s` | 証拠クラス |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | 実測（`F_NOCACHE`） |
| `LFM2.5-350M` · `AirLLM` 4 ビット (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | 実測（`F_NOCACHE`） |
| `LFM2.5-350M` · `AirLLM` 4 ビット + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | 実測（`F_NOCACHE`） |
| **`LFM2.5-350M` · `AirMoL` コールド `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **実測（`F_NOCACHE`）** |
| **`LFM2.5-350M` · `AirMoL` 起動結晶化後** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **実測（`F_NOCACHE`）** |
| `Qwen3.5-0.8B` · `AirLLM` 4 ビット (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | 実測（`F_NOCACHE`） |
| `Qwen3.5-0.8B` · `AirLLM` 4 ビット + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | 実測（`F_NOCACHE`） |
| **`Qwen3.5-0.8B` · `AirMoL` コールド `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **実測（`F_NOCACHE`）** |
| **`Qwen3.5-0.8B` · `AirMoL` 起動結晶化後** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **実測（`F_NOCACHE`）** |

ここで、`Qwen3.5-0.8B-Base` の未知プロンプトに対するコールド実行において生じるトレードオフをそのまま記しておく。`AirMoL` は NVMe ディスク読み取り量を `12.674 GB` から `8.581 GB` へと削減するものの、CPU 上での Gated DeltaNet による `4` トークン一括検証の計算負荷により、オンラインの起動から `LUT6` への結晶化によって受理率が `2.74 tok/sweep`（読み取り量 `4.621 GB`、`1.11 tok/s`）に引き上げられるまでは、実経過スループットが低下する（`0.32` 対 `0.53 tok/s`）。

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 主張 LA-8：ライブ CLI および HTTP/SSE ストリーミングサーバ（`mol_code_cli.py`）

`scripts/mol_code_cli.py` は CLI および SSE エンドポイント（`/v1/health`、`/v1/complete`、`/v1/crystallize`）を介して `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b}` と `--air-nvme` を提供し、ライブ実行中に `RAMB36E2` スロット常駐数を `438/512` から `460/512` へと更新しつつ、`18/18` 個すべての `pytest` スイートに合格している。

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. 関連研究と収束に関する考察

| システム | ID / 発表会議 | 確立された内容 | 報告されているコスト指標 | 本参照実装との相違点 |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | スパース量子化ニューラル層を FPGA LUT へコンパイル。 | FPGA LUT 数および Fmax 論理合成値。 | 静的配線のためシフト時に Vivado 再 PAR が必要であるのに対し、本実装は `1` サイクルの Beneš + `RAMB36E2` を用いる。 |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | 微分可能ブール論理ゲート網および重みなし LUT 網。 | ゲート数と分類精度。 | 静的配線は VLAN シフト時に精度が `52.34%` へ低下し、周辺ビットプレーンのキメラ問題を受ける。 |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | CPU/FPGA 上のテーブルルックアップによる三値/低ビット行列積。 | レイテンシおよび FPGA 消費電力。 | モデルギア内部の線形代数を高速化するものであり、モデル呼び出し自体はバイパスしない。 |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | 弱モデルから強モデルへの LLM カスケードおよび選好ルータ。 | API のドル料金対品質。 | モデル間のルーティングのみであり、`LUT6` ルックアップ最下層や下方コンパイルを持たない。 |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | マルチ LLM バンディット・ルーティングおよび周波数スケーリング配信。 | 著者報告の GPU Wh（`Zeus` / `pyNVML`）。 | GPU サービングを最適化する手法であり、本参照実装は起動結果を `0` FLOP の `LUT6` ページへコンパイルする（`est_j`）。 |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | ニューラル MLP、ドラフト木、およびカスケード型投機的ドラフタ。 | 実経過時間の高速化倍率。 | ドラフト計算の FLOPs と重み読み取りを要するのに対し、本実装は `0` FLOP の `uint64` `LUT6` ページを用いる。 |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | 0 FLOP のプロンプト n-gram およびデータストア接尾辞トライ・ドラフタ。 | レイテンシ高速化（`0` FLOPs）。 | `PLD` はプロンプト外のトークンを捕捉できず、`REST` は固定 `RAMB36E2` ページではなく可変長トライを用いる。 |
| **AirLLM** (lyogavin, 2023) | オープンソース SSD ストリーマ | 小容量 RAM での SSD レイヤ単位重みストリーミング。 | アクティブ RAM 使用量。 | 純粋な `T=1`（`1.0 tok/sweep`）+ KV スピルであるのに対し、`AirMoL` はスイープ数を `2.74×-2.86×` 削減する。 |
| **計量コミットゲート** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | コミットゲート（KV260 `INA260` SOM 実測 `11,428 pJ`）、MoL $p_i/c_i$、および `RCE-JEPA`。 | KV260 SOM の `measured_j` + `est_j`。 | 同一組織の基礎研究であり、本稿では Beneš `LUT6` 下方コンパイルおよび `AirMoL` により拡張している。 |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. 限界、妥当性への脅威、主張しない事項、および反証条件

**内的妥当性と構成概念妥当性。** 一様ランダム雑音またはステップごとの敵対的変動（$\Delta T = 1$）の下では、命題 1 により下方コンパイルの節約量はゼロとなり、システムは `1.00 tok/sweep` へとフォールバックする。可逆一致性（`100.0%`）はターゲットの貪欲デコーディングとのビット単位の完全一致を保証するものであるが、`350M` や `0.8B` ベースチェックポイント自体の能力上限を引き上げるものではない。

**測定妥当性と主張しない事項。** 本研究におけるすべてのジュール数値は解析的な `est_j` 推定値である（`measured_j = None`）。Yosys `0.71+` および Verilator `5.054` が示すのは `xck26` 構造ネットリスト合成と `CPI = 1` のサイクルシミュレーションであり、Vivado 配置配線後の `250 MHz` タイミング収束や KV260 実機電源レールのワット数ではない（`board_metered = false`）。シリコン実測エネルギーにおける優位性、`ModelGenerated` 出力の `Deterministic` への昇格、および `70B` モデルの実測実行（`air_mol_nvme_baselines.csv` は `70B` の解析的推計のみを記載）はいずれも主張しない。

| ID | 対象の主張 | 厳密な反証 / 棄却条件 |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1`（`.pcap` + RTL） | `scripts/run_realworld_domain.py` が `5,120` パケットにわたり `100.0%` の Verilator 一致率を達成できないか、パケット `2,500` での VLAN シフトを見逃す場合。 |
| **`LA-F2`** | `Claim LA-2`（多言語スイート） | Zig がホットループ内で `> 0` ヒープバイトを割り当てるか、Go が `> 0 allocs/op` を報告するか、Julia Enzyme の FD 誤差が `1e-7` を超える場合。 |
| **`LA-F3`** | `Claim LA-3`（KV260 ページド RTL） | `scripts/verify_paged_bram_rtl.py` が `117,120` LUT、`144` 個の `RAMB36E2`、`0` 個の `DSP48`、またはページ切替あたり `1` サイクルのいずれかを超過する場合。 |
| **`LA-F4`** | `Claim LA-4`（コンフォーマル ACI） | `scripts/run_frontier_benchmarks.py` がシフトトラフィック上で目標誤リスク $\alpha = 0.02$ を超えるか、`Deterministic` ラベルを付与した場合。 |
| **`LA-F5`** | `Claim LA-5`（バイト投機） | `scripts/run_code_corpus_benchmark.py` が未知の `48` プロンプト上で貪欲 `Mamba3CodeLM` に対し `< 100.0%` のバイト一致率しか得られない場合。 |
| **`LA-F6`** | `Claim LA-6`（`AirMoL` 14.3M） | `F_NOCACHE` 下の `scripts/run_air_mol_benchmark.py` が `100%` 一致率を損なうか、`AirLLM` 4 ビット `T=1` より多くの NVMe バイトを読み取る場合。 |
| **`LA-F7`** | `Claim LA-7`（2026 HF `AirMoL`） | `scripts/run_hf_air_mol_pretrained.py` または `scripts/run_hf_qwen35_air_mol.py` がターゲットの貪欲出力から $\ge 1$ 個の BPE トークンで乖離する場合。 |
| **`LA-F8`** | `Claim LA-8`（回帰テストスイート） | `pytest -v` が `tests/` 内の `18` 個のテストスイートのいずれか 1 つでも失敗する場合。 |

---

<div id="7-references" class="anchor-alias" aria-hidden="true"></div>

## 7. 参考文献

<ol data-refs>
<li>Bacellar, A., et al. (2024). Differentiable Weightless Neural Networks. <em>arXiv:2410.11112</em>.</li>
<li>Beneš, V. E. (1965). <em>Mathematical Theory of Connecting Networks and Telephone Traffic</em>. Academic Press.</li>
<li>Cai, T., Li, Y., Geng, Z., Peng, H., Lee, J. D., Chen, D., and Dao, T. (2024). Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads. <em>ICML 2024</em>, <em>arXiv:2401.10774</em>.</li>
<li>Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. <em>arXiv:2305.05176</em>.</li>
<li>Dao, T., and Gu, A. (2024). Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality. <em>ICML 2024</em>, <em>arXiv:2405.21060</em>.</li>
<li>Furao, S., and Hasegawa, O. (2006). An incremental network for on-line unsupervised classification and topology learning (SOINN). <em>Neural Networks</em>, 19(1):90-106.</li>
<li>Gibbs, I., and Candès, E. (2021). Adaptive Conformal Inference Under Distribution Shift. <em>NeurIPS 2021</em>, <em>arXiv:2106.00170</em>.</li>
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455-1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094-1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026). <code>LiquidAI/LFM2.5-350M</code> Open-Weights Hybrid Model Card (March 2026). <a href="https://huggingface.co/LiquidAI/LFM2.5-350M">huggingface.co/LiquidAI/LFM2.5-350M</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
<li>Saxena, A. (2023). Prompt Lookup Decoding. <a href="https://github.com/apoorvumang/prompt-lookup-decoding">github.com/apoorvumang/prompt-lookup-decoding</a>.</li>
<li>Simon, H. A., and Kadane, J. B. (1975). Optimal Problem-Solving Search: All-or-None Solutions. <em>Artificial Intelligence</em>, 6(3):235-247.</li>
<li>Thompson, C. D. (1978). Generalized Connection Networks for Parallel Processor Intercommunication. <em>IEEE Trans. Comput.</em>, C-27(12):1119-1125.</li>
<li>Umuroglu, Y., Akhauri, Y., Fraser, N. J., and Blott, M. (2020). LogicNets. <em>FPL 2020</em>, <em>arXiv:2004.03021</em>.</li>
<li>VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. <em>arXiv:2509.04827</em>.</li>
<li>Vovk, V., Gammerman, A., and Shafer, G. (2005). <em>Algorithmic Learning in a Random World</em>. Springer.</li>
<li>Waksman, A. (1968). A Permutation Network. <em>Journal of the ACM</em>, 15(1):159-163.</li>
<li>Wei, J., et al. (2024). T-MAC: CPU Renaissance via Table Lookup for Low-Bit LLM Deployment. <em>arXiv:2407.00088</em>.</li>
</ol>

---

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## 付録 A. 再現性

[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)（`commit a5e9bc1`）をチェックアウトしたディレクトリから以下を実行する。

```bash
PYTHONPATH=src .venv/bin/pytest -v
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
```
