---
title: "Mixture of Limits カスケードにおける下方 LUT6 コンパイル：Beneš ルーティング・ブールファブリック、コンフォーマル起動ゲート、およびフロンティア疎 MoE NVMe ストリーミング"
deck: "Mixture of Limits カスケードは、まず zero-floating-point-operation (FLOP) ページド 6 入力 ルックアップテーブル (LUT6) 回路を試行し、4 ビット Non-Volatile Memory Express (NVMe) ハイブリッドおよびスパース Mixture-of-Experts (MoE) 2026 年後半モデル（最大 34.66B パラメータ）をミス時のみストリームし、決定的検証器を介してゲートコミットを行い、認証済みウェイクを Beneš ルーティングされた 36-Kbit Block RAM (RAMB36E2) ページへ下方にコンパイルする。壁時計時間、バッファなし Darwin F_NOCACHE（バッファなしファイル読み取り）バイト数、アクティブ ランダムアクセス メモリ (RAM)、全システム macOS 電源管理ユニット (PMU) の累積デルタ、及び Yosys/Verilator xck26 レジスタ転送レベル (RTL) シミュレーションは、openIE-dev/lut-adapt-ai のコミット a5e9bc1 にて報告された。タスクごとのエネルギー値は解析的 est_j 推定であり、個別ボードレール電力は測定されていない。"
lang: "ja"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*Revision 30613ef, 22 November 2026. 参照実装および成果物: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) at [`a5e9bc1de280f973bc9051b4cc58942820a67eeb`](https://github.com/openIE-dev/lut-adapt-ai/tree/a5e9bc1de280f973bc9051b4cc58942820a67eeb). データ要約: [/data/#lut-adapt](/data/#lut-adapt). LaTeX PDF: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([ソース](/pdfs/latex/lut-adapt.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概要

本研究は、計算システムが反復的なニューラルモデルの処理を、出力の厳密な一致を損なうことなく高速なブール真理値表の参照へ下方コンパイルする方法を検討する。未検証の推定を信頼される規則へ昇格させない方式を前提とする。報告は、ソフトウェアによる計測、レジスタ転送レベルの合成およびサイクル単位のシミュレーション、ならびにラベル付けされた解析的エネルギー推定値(`est_j`)から成る。本リポジトリには壁面または電源レールの電力計は接続されていない(`measured_j` は未設定、`board_metered` は偽)。

**平易な言い換え**

1. 展開されたシステムが受け取る入力の多くは、既に解いたことのあるパターンの反復である。そのため、すべてのステップで浮動小数点のニューラルネットワーク全体を実行することは、計算資源とメモリ帯域の浪費となる。
2. 本参照設計は、再構成可能な6入力真理値表(`LUT6`)参照層を、ストリーミング型の状態空間モデルおよび基盤モデルの前段に配置する。回答は、明示的な検査によって認証された後にのみ、参照メモリのページへ下方コンパイルされる。
3. 2026年後半のハイブリッド型およびスパースな混合専門家(MoE)言語モデルは、パラメータ数が最大`34.66B`に及び、4ビット重みを固体記憶装置からストリーミングで読み込む。ルーターによって疎となった専門家の読み出しを、ゼロFLOPの`LUT6`ドラフターと組み合わせることで、ディスク読み出し量を最大`12.30×`削減し(トークン処理速度は`6.50×`向上)、有効メモリ`2.53`ギガバイトで動作させる。このとき出力トークンは一切変化しない。決定論的な検査によってゲーティングされたコードのコミットは、単体の`35B`モデルの精度を上回り、不正なコミットの混入率は`0.00%`に抑えられ、結晶化済みのWave-3タスクを`35,590×`高速化する。

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 用語、頭字語、及び測定ラベル

<ul id="terms">
<li>MoL: Mixture of Limits、カスケード規則（Metered Commit Gates Part II [same house]より）</li>
<li>LA: 本研究で用いた主張と反証接頭辞（LA-1からLA-11、LA-F1からLA-F11）</li>
<li>LUT、LUT6、INIT: ルックアップテーブル、6入力Xilinx UltraScale+ブール原始子、およびその64ビット真理値表初期化マスク</li>
<li>BRAM、RAMB36E2、URAM: ブロックRAM、36-KbitデュアルポートUltraScale+ブロックRAM原始子（xck26では144個）、およびUltraRAM</li>
<li>CLB、FF、DSP、DSP48、KV260: 構成可能ロジックブロック、フリップフロップ、デジタル信号処理スライス、およびAMD Kria KV260ボード（xck26）</li>
<li>FPGA、ASIC、RTL、CPI、PAR、WNS、FPL: フィールドプログラマブルゲートアレイ、特定用途集積回路、レジスタ転送レベル、ルックアップあたりのサイクル数、配置配線、最悪負スラック、およびField-Programmable Logic会議</li>
<li>AXI、PS、PL、SOM、INA260、VCC、RAPL、NVML、PMU: Advanced eXtensible Interface、Zynq処理システム、プログラマブルロジック、システムオンモジュール、オンボード電源監視IC、電源レール、Intel Running Average Power Limit、NVIDIA Management Library、およびmacOS電源管理ユニット</li>
<li>SSD、SSM、MIMO、RoPE、SwiGLU、GQA、KV、BPE、LLM、LLMs、MoE、MLP、CFG: State Space Duality、状態空間モデル、多入力多出力、ロータリ位置埋め込み、ゲート付き線形ユニット活性化、グループ化クエリアテンション、キー・バリューキャッシュ、バイトペアエンコーディング、大規模言語モデル（群）、Mixture-of-Experts、多層パーセプトロン、および文脈自由文法</li>
<li>HC、SOINN、WNN、DWN: 階層文脈自己組織化増分ニューラルネットワーク、重みなしニューラルネットワーク、および微分可能重みなしニューラルネットワーク</li>
<li>JEPA、EBRM、ACI、OOD、AUROC、AUC、MSP、MC: Joint-Embedding Predictive Architecture、エネルギーベース推論モデル、適応型コンフォーマル推論、分布外、受信者動作特性曲線下面積、最大ソフトマックス確率、およびモンテカルロ</li>
<li>PLD、REST、EAGLE、LFM2、LFM3、HF: Prompt Lookup Decoding、検索ベース投機的デコーディング、Greater Language-model Efficiencyのための外挿アルゴリズム、Liquid Foundation Model 2.5（LFM2.5-350MおよびLFM2.5-8B-A1B）、Liquid Foundation Model 3（2026年10月LiquidAI/LFM3-1.7B）、およびHuggingFace</li>
<li>SVD、ITQ、SVID、QAT、PTQ、PPL、SNR: 特異値分解、Iterative Quantization Procrustes超立方体回転、符号値独立分解、量子化認識訓練、訓練後量子化、perplexity、および信号対雑音比</li>
<li>NVMe、NOCACHE、POSIX、RAM、DRAM、SRAM、IO、KB、MB、GB: Non-Volatile Memory Expressストレージ、Darwin F_NOCACHE非バッファファイルフラグ、Portable Operating System Interface、ランダムアクセスメモリ、ダイナミックRAM、スタティックRAM、入出力、キロバイト、メガバイト、およびギガバイト</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, FP16, FP32, INT4: 浮動小数点演算(単数・複数)、百万FLOP、積和演算(単数・複数)、単一命令複数データ、自動微分、有限差分、バイト当たりビット数、16/32ビット浮動小数点数、4ビット整数</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [同一組織]、Wise Computer Automation [同一組織]、検証済み完了、ソフトウェア工学ベンチマークの接頭辞</li>
<li>CLI, HTTP, SSE, API, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW: コマンドラインインタフェース、ハイパーテキスト転送プロトコル、Server-Sent Events、アプリケーションプログラミングインタフェース、計算機科学・工学分野の学術会議、オペレーティングシステム、中央処理装置・画像処理装置、ソフトウェア</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XNOR: 仮想LAN(IEEE 802.1Q)、トランスポート層セキュリティ、深層パケット検査、抽象構文木、JavaScript Object Notation、カンマ区切り値、Secure Hash Algorithm、巡回冗長検査、Asynchronous Transfer Mode(CRC-8/ATM)、Request for Comments、Structured Query Language、DWARF符号付きリトルエンディアン base-128 符号化、内容参照メモリ、排他的論理和否定</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, DSP48E2, URAM288, AMD: Joint Test Action Group デバッグポート、Xilinx Software Command-Line Tool デバッガ、Debug Access Port、Universal Serial Bus、Future Technology Devices International およびその FT2232C デュアルUART/FIFOブリッジIC、汎用非同期送受信器、先入れ先出しバッファ、集積回路、電子設計自動化、コンテキスト外合成モード、Advanced Microcontroller Bus Architecture、AXI4-Lite/AXI4-Stream相互接続、入出力ブロック、入出力バッファ、同期リセット/セット付きDフリップフロップ、1〜5入力UltraScale+ルックアップテーブル、7/8入力UltraScale+マルチプレクサ、4ビット高速桁上げ連鎖、UltraScale+ DSPスライス、288キビットUltraRAM、Advanced Micro Devices</li>
</ul>

以下の全ての表において、3 つのエビデンスクラスは分離されたままである。

| エビデンスラベル | 本研究における意味 |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Darwin `F_NOCACHE` 下で `os.pread` により読み書きされた正確なバイト数、常駐メモリ割り当て、実時間秒数、Apple M5 Max 上の全機械 macOS `PMU` (`AppleSmartBattery.PowerTelemetryData`) の累積エネルギー差分、および正確なビット/トークンの一致。`measured_j` は未設定 (`None`)。 |
| **`Simulated (RTL)`** | Yosys `0.71+` (`synth_xilinx -family xcup` による Kria KV260 `xck26` 対象) から取得した構造的ネットリストカウントと、Verilator `5.054` から取得したサイクルカウント (`CPI = 1`)。Vivado タイミングクロージャーではなく、ボード電力 (`board_metered = false`) でもない。 |
| **`Estimated (est_j)`** | 操作数または熱設計電力時間代替 (`joule_meter.py` が `RAPL`/`NVML` ハードウェアカウンタが macOS 上に存在しない場合のフォールバック) から算出された解析的ジュール。同一式内の各アーム間でのみ比較可能であり、シリコンワットとしては使用しない。 |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 建築的背景と貢献

[Metered Commit Gates](/papers/gates/) `[same house]` において、Part II は **Mixture of Limits** を定義する：ジュールあたりの通過確率 $p_i / c_i$ の降順でギアを試し (Simon and Kadane, 1975)、タスク完了述語 $C(z) = 1$ が成立した時点で停止し、`ModelGenerated` 出力を `Deterministic` に強化することを禁じる。ただし静的な Lookup 階層は、展開前に書き込まれたエントリのみをカバーする。逆に、既存のルックアップテーブル型ニューラルネットワークである LogicNets (Umuroglu et al., 2020)、DiffLogic (Petersen et al., 2022)、および Differentiable Weightless Neural Networks (Bacellar et al., 2024) は、静的 FPGA ルーティング内部で配線接続を固定するため、入力分布が変化するたびにベンダーの配置配線を必要とする。

`lut-adapt-ai` 参照は、カスケードの頂点と底辺の間を **オンライン下方 `LUT6` コンパイル** によって閉じる：

- **Rung 0 (Lookup, Paged Beneš + `LUT6`)**：非ブロッキング $512 \times 512$ **Beneš-Copy-Beneš** マルチキャストスイッチを通じてルーティングされた 64 ビット真理値表マスクを評価し、$81 \times \texttt{RAMB36E2}$ デュアルポートブロックメモリ群にキャッシュする (`0` 浮動小数点演算、Verilator シミュレーションにおける単一サイクルページ切り替え)。
- **Rung 1 (Stream, `Mamba-3` Complex MIMO State Space Duality)**：シーケンス履歴に依存するミスを、定数サイズ $O(1)$ 再帰状態 (`14.3M` パラメータ参照における `48 KB` ピン留めメモリ) で処理し、$O(L)$ キー・バリューキャッシュの増大を回避する。
- **Rung 2 (Topology, `HC-SOINN`)**：潜在埋め込み上でオンライン原型トポロジを維持し、レジーム境界を分離するとともに、ラベルなし分布シフトが発生した際に回路ブレーカ (`Refuse` / エスカレーション) を作動させる。
- **Rung 3 (Model last, `JEPA-EBRM`, `AirMoL`, and `Expert-AirMoL` 4-Bit NVMe Streaming)**：安価な下位ラングが棄権するか正確な対象検証を必要とする場合にのみ、潜在エネルギー基盤検証を呼び出すか、事前学習済み 2026 年後半のハイブリッドおよび疎 MoE 基盤モデル (`LiquidAI/LFM3-1.7B`, `google/gemma-4-E2B-it`, `LiquidAI/LFM2.5-8B-A1B`, および `Qwen/Qwen3.6-35B-A3B`、ならびに `LiquidAI/LFM2.5-350M` および `Qwen/Qwen3.5-0.8B-Base`) をストリーミングする。
- **下方 `SleepCrystallizer`**：Walsh-Hadamard スペクトルウォームスタート、共同モード最小項真理値表、および Waksman スイッチスケジュールを用いて再帰的起動トレースを抽出し、推論を停止させたり FPGA 配置配線を実行したりすることなく、シャドウブロックメモリバンクを反転させる。

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 貢献

1. **償却下方コンパイル条件**: Simon-Kadane の $p_i/c_i$ 順序を、定常区間 $\Delta T$ 上の明示的なコンパイルコスト $E_{\text{compile}}$ によって拡張する。
2. **非ブロッキング $512 \times 512$ Beneš-Copy-Beneš および `81`-`RAMB36E2` RTL アーキテクチャ**: フラットクロスバーの Kria KV260 論理オーバーフロー(`102.0%`、`119,478` LUT)と、フリップフロップ型ページマルチプレクサの `926,619` LUT への爆発的増大の双方を解消する。本構成は `xck26` に対して `41,186` UltraScale+ CLB LUT(`35.2%`)、`81` 個の `RAMB36E2`(`56.2%`)、`0` 個の `DSP48` スライスに合成され、シミュレーションにおいて `1` サイクル(公称 `250 MHz` で `4.0 ns`)のページ切替を達成する。
3. **普遍的な $\le 64$ ビット同時モード最小項合成**: 同時モードの最小項ルックアップが、相関のある分岐において周辺ビットプレーン DiffLogic の丸めを上回ることを示す。また、$K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ 個のサブワードトークンを 1 個の `uint64` ワードに詰め込む(`|V| = 65,536` では `16b × 4 = 64b`、`|V| = 128,000` では `17b × 3 = 51b`、`|V| = 248,320` では `18b × 3 = 54b`)。
4. **オラクル不要の分割コンフォーマル・オンライン ACI 結晶化ゲート**: 放射状正則化された潜在 `JEPA-EBRM` の非適合度スコアを、分割コンフォーマル較正および適応的コンフォーマル推論(Gibbs and Candès, 2021)と組み合わせる。シフトしたトラフィックにおいて、本手法は `0.00%` の誤結晶化リスクと `1.0000` の OOD AUROC を記録した。これに対し、ソフトマックスおよび MC-Dropout のベースラインは `17.62%-24.28%` の誤リスクを記録した。
5. **`AirMoL` および `Expert-AirMoL` による最大 `34.66B` 疎 MoE の 4 ビット NVMe ストリーミング**: Darwin の `F_NOCACHE` と `os.pread` による 4 ビットシャーディング、ルーターによって索引される `.experts.pack4` のバイトストライド型エキスパート読み出し、ハイブリッド状態ロールバック、およびオンライントークン `LUT6` バースト推測を統合する。評価は 2026 年 10 月時点の `LiquidAI/LFM3-1.7B`(FP32 RAM の `3.79%` で NVMe を `2.74×` 削減)、`LiquidAI/LFM2.5-8B-A1B`(`8.47B`、NVMe を `6.90×` 削減)、`Qwen/Qwen3.6-35B-A3B`(`34.66B`、**NVMe を `12.30×` 削減**、**RAM `2,530.7 MB` = FP16 の `3.83%`**、**`6.50×` の高速化**)を対象とし、いずれも `100.0%` の厳密なトークン一致を達成した。
6. **ゼロ MAC の `Sub1Bit-LUT6` と `LittleBit` の比較、および検証器によるゲート付きの 2026 年後期フロンティア符号化カスケード**: `LittleBit-1 / LittleBit-2` が有する実行時 `1.98M` 個の二値 MAC(重み当たり `0.576` ビット; Lee et al., 2025; Lee and Kim, 2026)を、ゼロ MAC の `6` 入力 `LUT6` 部分和ルックアップに置き換える。本手法は `< 4 × 10⁻⁶` の誤差を示し、`0` 回の QAT エポックで `MoL` 目標検証の下に `100.0%` の一致を達成する。さらに、`48` タスク(`16` 仕様 × `3` 波)の符号化ベンチマークにおいて、単独の `LittleBit-2 0.55bpw`、`LFM3-1.7B`、`Gemma-4-E2B-it`、`LFM2.5-8B-A1B`、`Qwen3.6-35B-A3B`、`RouteLLM` を上回る(`43.75%` 対 `0.00%-33.33%`)。加えて、**`0.00%` の破損コミットの採用**と**`35,590×` の第 3 波における結晶化スキルの高速化**を達成し、5 言語のポリグロット検証によって裏付けられる。

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

## 3. 参照アーキテクチャ、多言語スイート、および KV260 RTL

図 1 は `src/clai/` における 4 段カスケードおよび下方 `SleepCrystallizer` ループを示す。

![4 段 Mixture of Limits カスケードにおける下方コンパイル。](/figures/lut-adapt/mol-downward-cascade.svg)

図 1. Mixture of Limits カスケードにおける 4 段下方コンパイル。設計図であり、基板電力測定ではない。[PNG](/figures/lut-adapt/mol-downward-cascade.png) · [対話型エクスプローラ](/living/lut-adapt/#la-diag-01)。

`openIE-dev/lut-adapt-ai` における 5 つのシステム実装がカスケードを相互検証する：Python/PyTorch/Triton (`src/clai/`)、Rust `Burn 0.22.1 / CubeCL` Metal (`sys/rust/`)、Zig `0.17.1` (`sys/zig/`)、Go `1.27.4` SIMD (`sys/go/`)、および Julia `1.13.4` Enzyme (`sys/julia/`)。

図 2 は `hw/kv260/rtl/clai_benes_hotswap_core.sv` における Kria KV260 (`xck26`) RTL データパスを示し、`81` 個の並列 `RAMB36E2` デュアルポートメモリにわたって `512` 個の常駐 `LUT6` ページ (`5,120` `INIT` ビット + `48` ビットコンテキストタグ + 妥当ビット) をマッピングし、単一サイクル (`250 MHz` 公称で `4.0 ns`、`CPI = 1.0`) のコンテキスト切り替えを実現する。

![Beneš-Copy-Beneš マルチキャストファブリックおよび単一サイクル BRAM LUT6 ページキャッシュ。](/figures/lut-adapt/benes-paged-silicon.svg)

図 2. `512×512` Beneš-Copy-Beneš マルチキャストファブリックおよび `81 × RAMB36E2` 単一サイクル `LUT6` ページキャッシュで、AMD Kria KV260 (`xck26`) を Yosys `0.71+` および Verilator `5.054` シミュレーション (`board_metered = false`) で対象とする。[PNG](/figures/lut-adapt/benes-paged-silicon.png) · [対話型エクスプローラ](/living/lut-adapt/#la-diag-02)。

図 3 は `AirMoL` (`src/clai/frontier/air_mol_streamer.py` および `hf_air_mol_pretrained.py`) を示し、これは Darwin `F_NOCACHE` `os.pread` 経由で 4 ビットグループ量子化シャードをストリーミングし、単一走査で `[last_tok, d_1..d_K]` を検証し、コンパクトなハイブリッド状態 (`Short-Conv/SSM` または `Gated DeltaNet` + 疎 `6` 層 `GQA` KV クロップ) を RAM にスナップショットするため、部分ドラフト拒否は **余分な NVMe 走査をゼロ** とする。

![AirMoL 4 ビット NVMe 層ストリーミングと汎用 64 ビットトークン LUT6 投機。](/figures/lut-adapt/airmol-nvme-speculation.svg)

図 3. `AirMoL` ゼロ余分走査 4 ビット NVMe 層ストリーミングと `LiquidAI/LFM3-1.7B`、`LiquidAI/LFM2.5-350M`、および `Qwen/Qwen3.5-0.8B-Base` 上の汎用 `≤64` ビットトークン `LUT6` 投機。[PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [対話型エクスプローラ](/living/lut-adapt/#la-run-01)。

図 4 は `Expert-AirMoL` (`src/clai/frontier/moe_air_mol.py`) および `VerifiedCodeCascade` (`verified_code_cascade.py`) を示す。標準的なディスクオフロード `AirLLM` は各 MoE 層ごとにすべての $E$ 専門家を走査する (`LiquidAI/LFM2.5-8B-A1B` では `32`、`Qwen/Qwen3.6-35B-A3B` では `256`) が、ルータはトークンごとに $k \ll E$ 専門家のみを活性化する (`4/32` および `8/256`)。`Expert-AirMoL` は各 MoE 層をコンパクトなヘッダシャードと固定ストライド `INT4` `.experts.pack4` NVMe ファイルに分割し、$K+1$ バースト位置にわたる活性専門家合併集合 $\mathcal{U}_l$ のみに対して `F_NOCACHE` `os.pread` 読み出しを発行する。新規合成タスクに対しては、`VerifiedCodeCascade` は Rung `0-3c` の全コミットを `0.35s` 境界付き AST、サンドボックス実行、および境界不変性検査 $C(z) \in \{0, 1\}$ の背後にゲートし、認定された解を `BenesLUT6` および正規 AST スキルページにコンパイルする。

![図 4. Expert-AirMoL ルータ疎 4 ビット NVMe ストリーミングおよび検証器ゲート VerifiedCodeCascade。](/figures/lut-adapt/moe-expert-cascade.svg)

*図 4. `Expert-AirMoL` ルータ疎 4 ビット専門家インデックス NVMe ストリーミング (`Qwen/Qwen3.6-35B-A3B` において `12.30×` I/O 削減) および `C(z)` ゲート `VerifiedCodeCascade`。[PNG](/figures/lut-adapt/moe-expert-cascade.png) · [対話型エクスプローラ](/living/lut-adapt/#la-run-01).*

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

<div id="47-claim-la-7-pretrained-2026-dense--tri-hybrid-models-under-airmol-lfm3-17b-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 主張 LA-7: `AirMoL` 下における 2026 年事前学習済み密および三重ハイブリッドモデル (`LFM3-1.7B`, `LFM2.5-350M`, `Qwen3.5-0.8B-Base`)

| 2026 年チェックポイントおよび条件 | パリティ | トークン / スイープ | 文字 / スイープ | スイープ数 | NVMe 読み出し | ピーク時アクティブ RAM (`% FP32`) | `tok/s` | 証拠区分 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM3-1.7B` (2026 年 10 月) · `AirLLM` 4 ビット (`T=1`) | `100%` | `1.00` | `2.30` | `24.00` | `25.045 GB` | `250.0 MB` (`3.79%`) | `0.53` | 測定 (`F_NOCACHE`) |
| `LFM3-1.7B` (2026 年 10 月) · `AirLLM` 4 ビット + `PLD` | `100%` | `1.37` | `3.16` | `17.50` | `18.262 GB` | `250.0 MB` (`3.79%`) | `0.73` | 測定 (`F_NOCACHE`) |
| **`LFM3-1.7B` (2026 年 10 月) · `AirMoL` コールド `LUT6`** | **`100%`** | **`1.55`** | **`3.56`** | **`15.50`** | **`16.175 GB`** | **`250.0 MB` (`3.79%`)** | **`0.81`** | **測定 (`F_NOCACHE`)** |
| **`LFM3-1.7B` (2026 年 10 月) · `AirMoL` 起動後** | **`100%`** | **`2.74`** | **`6.31`** | **`8.75`** | **`9.131 GB`** | **`250.0 MB` (`3.79%`)** | **`1.32`** | **測定 (`F_NOCACHE`)** |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | 測定 (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4 ビット (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | 測定 (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4 ビット + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | 測定 (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` コールド `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **測定 (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` 起動後** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **測定 (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4 ビット (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | 測定 (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4 ビット + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | 測定 (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` コールド `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **測定 (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` 起動後** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **測定 (`F_NOCACHE`)** |

2026年10月に `LiquidAI/LFM3-1.7B` (`13` short convolutions + `5` sliding-window attention layers + `6` full-attention layers, `|V| = 128,000`) において、ポストウェイク `AirMoL` は NVMe 転送量を `2.74×`（`25.045 GB` から `9.131 GB`）に削減し、デコード速度を `2.49×`（`0.53` から `1.32 tok/s`）に向上させ、`250.0 MB` のアクティブウェイト RAM（FP32 の `3.79%`）で `100.0%` のロスレスパリティを実現した。CPU バウンドの `Qwen3.5-0.8B-Base` のコールド未見プロンプトに対するトレードオフは保たれ、`AirMoL` は NVMe ディスク読み込みを (`12.674 GB` から `8.581 GB`) に削減するが、`4` トークンの CPU Gated DeltaNet バッチ検証により実時間スループットが (`0.32` 対 `0.53 tok/s`) 低下し、オンラインウェイク-to-`LUT6` 結晶化が受容率を `2.74 tok/sweep`（`1.11 tok/s`）に上昇させるまでである。

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 主張 LA-8: ライブ CLI および HTTP/SSE ストリーミングサーバ (`mol_code_cli.py`)

`scripts/mol_code_cli.py` は `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` および `--air-nvme` を CLI および SSE エンドポイント (`/v1/health`, `/v1/complete`, `/v1/crystallize`) 経由で提供し、`tests/` における `22/22` の合格テストとともに `RAMB36E2` スロット常駐性を `438/512` から `460/512` へライブで進展させる。

<div id="49-claim-la-9-frontier-sparse-moe-expert-airmol-liquidailfm25-8b-a1b-847b--qwenqwen36-35b-a3b-3466b" class="anchor-alias" aria-hidden="true"></div>

### 4.9 主張 LA-9: フロンティア疎 MoE `Expert-AirMoL` (`LiquidAI/LFM2.5-8B-A1B` `8.47B` および `Qwen/Qwen3.6-35B-A3B` `34.66B`)

| スパース MoE チェックポイントと方式 | パリティ | 活性エキスパート率 | トークン / スイープ | NVMe 読み出し / トークン | I/O 削減率 | ピーク RAM (`% FP16`) | `tok/s` | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `AirLLM` 密 4 ビット (`T=1`) | `100%` | `100.00%` | `1.00` | `4.574 GB` | `1.00×` | `1,408.3 MB` (`8.72%`) | `0.28` | `368.80` |
| `LFM2.5-8B-A1B` · `Expert-AirLLM` (`T=1`) | `100%` | `16.93%` | `1.00` | `1.200 GB` | `3.81×` | `1,408.3 MB` (`8.72%`) | `0.58` | `181.26` |
| `LFM2.5-8B-A1B` · `Expert-AirMoL` + `PLD` | `100%` | `28.82%` | `1.78` | `0.883 GB` | `5.18×` | `1,408.3 MB` (`8.72%`) | `0.79` | `132.57` |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` コールド `LUT6`** | **`100%`** | **`33.91%`** | **`1.85`** | **`1.002 GB`** | **`4.56×`** | **`1,408.3 MB` (`8.72%`)** | **`0.72`** | **`145.42`** |
| **`LFM2.5-8B-A1B` · `Expert-AirMoL` ウェイク後** | **`100%`** | **`36.46%`** | **`3.00`** | **`0.663 GB`** | **`6.90×`** | **`1,408.3 MB` (`8.72%`)** | **`1.10`** | **`95.67`** |
| `Qwen3.6-35B-A3B` · `AirLLM` 密 4 ビット (`T=1`) | `100%` | `100.00%` | `1.00` | `18.159 GB` | `1.00×` | `3,214.7 MB` (`4.86%`) | `0.06` | `1,696.81` |
| `Qwen3.6-35B-A3B` · `Expert-AirLLM` (`T=1`) | `100%` | `6.35%` | `1.00` | `2.356 GB` | `7.71×` | `2,530.7 MB` (`3.83%`) | `0.22` | `471.87` |
| `Qwen3.6-35B-A3B` · `Expert-AirMoL` + `PLD` | `100%` | `11.58%` | `1.89` | `1.708 GB` | `10.63×` | `2,530.7 MB` (`3.83%`) | `0.32` | `326.24` |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` コールド `LUT6`** | **`100%`** | **`12.91%`** | **`2.00`** | **`1.722 GB`** | **`10.54×`** | **`2,530.7 MB` (`3.83%`)** | **`0.31`** | **`334.42`** |
| **`Qwen3.6-35B-A3B` · `Expert-AirMoL` ウェイク後** | **`100%`** | **`14.97%`** | **`2.57`** | **`1.477 GB`** | **`12.30×`** | **`2,530.7 MB` (`3.83%`)** | **`0.39`** | **`267.08`** |

`Qwen/Qwen3.6-35B-A3B` (`34.66B` パラメータ、FP16 で `66.11 GB`、4 ビットの `.experts.pack4` ファイル群に分割して `18.60 GB`、システム全体の macOS `PMU` 差分 `20,070.18 J`) において、ウェイク後の `Expert-AirMoL` は、アクティブ RAM `2,530.7 MB` (FP16 の `3.83%`) で、バッファなしの NVMe 転送量を **`12.30×`** (`18.159` から `1.477 GB/トークン`) に削減し、デコードを **`6.50×`** (`0.06` から `0.39 tok/s`) 高速化する。その際のトークン・パリティは `100.0%` の無損失である。

<div id="410-claim-la-10-sub-1-bit-latent-factorization-littlebit-1--littlebit-2-vs-zero-mac-sub1bit-lut6" class="anchor-alias" aria-hidden="true"></div>

### 4.10 主張 LA-10: サブ 1 ビット潜在因子分解（`LittleBit-1 / LittleBit-2`） vs. ゼロ MAC `Sub1Bit-LUT6`

| 因子分解手法 (`LFM2.5-8B-A1B` `w1 [1792, 2048]`) | ビット / 重み | 重み SNR | 余弦類似度 | `16K` Top-1 マッチ | バイナリ MAC / トークン | QAT エポック | エビデンスクラス |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` 未回転 `SVD` SVID (`LittleBit-1` PTQ スタイル) | `0.576` (`27.8×`) | `1.76 dB` | `0.5761` | `3.12%` | `1,981,440` | `0` (`5` in paper) | 測定 SW |
| `B` プロクルース `ITQ` SVID (`LittleBit-2` PTQ スタイル) | `0.576` (`27.8×`) | `2.42 dB` | `0.6487` | `10.94%` | `1,981,440` | `0` (`5` in paper) | 測定 SW |
| **`C` `Sub1Bit-LUT6` テーブル参照 (`0` MAC, Draft)** | **`0.576` (`27.8×`)** | **`2.42 dB`** | **`0.6487`** | **`10.94%`** | **`0`** | **`0`** | **測定 (`< 4e-6` vs. `B`)** |
| `D` `Expert-AirMoL` `INT4` ブロック-64 ターゲット | `4.500` (`3.56×`) | `20.77 dB` | `0.9958` | `82.81%` | `0` (`INT4`) | `0` | 測定 SW |
| **`E` `MoL`: `Sub1Bit-LUT6` Draft + ターゲット検証** | **`0.576` draft** | **`148.84 dB`** | **`1.0000`** | **`100.00%`** | **`0` draft MAC** | **`0`** | **測定 ロスレス パリティ** |

<div id="411-claim-la-11-48-task-16-specifications--3-waves-late-2026-frontier-coding-bakeoff" class="anchor-alias" aria-hidden="true"></div>

### 4.11 主張 LA-11: `48` タスク (`16` 仕様 × `3` 波) 2026 年後半フロンティア符号化ベイクオフ

| 2026 年後半システム群 (`48` タスク = `16` 仕様 × `3` 波) | W1 コールド | W2 アダプト | W3 ウォーム | 全体パス | 破損コミット | W3 `Rung 0/1` シェア | `35B` コール | 平均 W3 レイテンシ |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT (`1`-Shot) | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `19,946 ms` |
| `B` `LiquidAI/LFM3-1.7B` (2026 年 10 月 Tri-Hybrid, `1`-Shot) | `18.75%` | `6.25%` | `6.25%` | `10.42%` | `89.58%` | `0.00%` | `0.0%` | `3,561 ms` |
| `C` `google/gemma-4-E2B-it` (`2026` Hybrid, `1`-Shot) | `6.25%` | `0.00%` | `0.00%` | `2.08%` | `97.92%` | `0.00%` | `0.0%` | `8,886 ms` |
| `D` `LiquidAI/LFM2.5-8B-A1B` (`8.47B` MoE, `1`-Shot) | `18.75%` | `12.50%` | `12.50%` | `14.58%` | `85.42%` | `0.00%` | `0.0%` | `14,221 ms` |
| `E` `Qwen/Qwen3.6-35B-A3B` (`34.66B` `Expert-AirMoL`, `1`-Shot) | `37.50%` | `31.25%` | `31.25%` | `33.33%` | `66.67%` | `0.00%` | `100.0%` | `98,435 ms` |
| `F` `RouteLLM` 信頼性ルータ (`LFM3` $\to$ `Gemma4` $\to$ `8B`) | `18.75%` | `6.25%` | `6.25%` | `10.42%` | `89.58%` | `0.00%` | `0.0%` | `3,561 ms` |
| **`G` `MoL` `VerifiedCodeCascade` (参照)** | **`43.75%`** | **`43.75%`** | **`43.75%`** | **`43.75%`** | **`0.00%`** | **`43.75%`** | **`62.5%`** | **`143,649 ms` (`2.54 ms` 解決済み)** |

`48` タスクプロトコルおよびアルゴリズムベンチマーク (RFC 1982 直列算術, 重み付き区間スイープライン, サイクル安全辞書式トポロジカルソート, ナノ秒トークンバケット, CRC-8/ATM および変異 `0xFF` CRC-8, RFC 6901 JSON Pointer `~01` アンエスケープ, ホップ境界付き Bellman-Ford, `>2⁵³` 正確ウィンドウ中央値, 無制限 Damerau-Levenshtein, `4×4` Beneš ルーティング, SQL リテラルパラメータ化, 単調デック部分列和, DWARF SLEB128, SHA-256 一貫性ハッシュ, およびコンフォーマル分位数; 全体システム macOS `PMU` デルタ `126,947.30 J`) において, `VerifiedCodeCascade` はあらゆる単独モデルおよびルータを全波で上回り (`43.75%` 対 `35B` の `33.33%`), **`0.00%` の破損コミット** (対 `66.67%`-`100.00%`) を認め, $C(z)$ により全 `3` つの Wave-2/3 敵対的仕様ドリフト参照を安全に捕捉し, `7` つの結晶化スキルにわたる平均 Wave-3 レイテンシを **`90,324.2 ms`** から **`2.54 ms` (`35,590×` 高速化)** へ崩壊させる。

<div id="412-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.12 `xck26-sfvc784-2LV-c` 全サブシステムのプリミティブ内訳、トポロジカル深度、および `Vivado 2026.1` ハードウェアプローブ

本節では、独立型の `512` ページ投機的コア（`hw/kv260/rtl/clai_benes_hotswap_core.sv` 内の `clai_benes_paged_hotswap_core`）と、完全な Advanced Microcontroller Bus Architecture（`AMBA`）`AXI4-Lite` + `AXI4-Stream` Rung-0 サブシステムを監査する。後者は `hw/kv260/rtl/clai_kv260_axi_top.sv`、`clai_engram_streamer.sv`、`clai_rung0_hotswap_core.sv`、およびコミット `a5e9bc1de280` の `artifacts/clai_rung0_kv260.v` から構成される。これらを正確な AMD Kria KV260 デバイス（`xck26-sfvc784-2LV-c`：`117,120` 個の CLB LUT、`234,240` 個の CLB フリップフロップ、`144` 個の `RAMB36E2` ブロック、`64` 個の 288 Kbit UltraRAM（`URAM288`）ブロック、`1,248` 個の UltraScale+ デジタル信号処理（`DSP48E2`）スライス、`189` 個のユーザー入出力ブロック（`IOB`））と照合するため、`Intel Core i9-13900H`（`Linux 7.0.0-43-generic x86-64`）ワークステーション上で、三つのハードウェアおよび電子設計自動化（`EDA`）検査を実施した。

1. **Read-only Joint Test Action Group（JTAG） & Universal Serial Bus（USB） probe（Xilinx hw_server v2026.1 + Xilinx Software Command-Line Tool（XSDB））**: `lsusb` が接続された Future Technology Devices International（FTDI）`0403:6010`（FT2232C/D/H デュアル ユニバーサル非同期受信送信装置（UART）/ FIFO 統合回路（IC））ブリッジを報告したが、Linux `sysfs` の USB ベンダー/プロダクト文字列（`idVendor = 0403`、`idProduct = 6010`）を調査した結果、デバイスは Kria KV260 キャリアではなく `Manufacturer = "Particle"`、`Product = "tachyon-dbg-1.0"` と識別された。 `hw_server v2026.1`（Build May 29, 2026）を `xsdb`（`connect; jtag targets; targets`）で問い合わせた結果、**`0` Xilinx `JTAG` デバイスおよび `0` Debug Access Port（DAP）ターゲット** が返された（`board_metered = false`、`measured_j = None`）である。

2. **`Vivado 2026.1` batch synthesis and licensing gate（SW Build 6511674）**: 再現性のある低フットプリント非プロジェクトバッチスクリプト（`scripts/run_vivado_xck26.tcl`、`set_param general.maxThreads 4`、`xck26-sfvc784-2LV-c` を `250.0 MHz` / `4.000 ns` のコンテキスト外（OOC）モードで対象）を `/tools/Xilinx/2026.1/Vivado/bin/vivado` に配置した。`vivado v2026.1` をバッチモードで起動したところ、`synth_design` に到達する前に（`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`）終了した。これは AMD の `Vivado 2025.1+` / `2026.1` が、Standard 階層の `xck26` デバイスであっても、ユーザーが生成した Standard/Enterprise `.lic` ファイル（`~/.Xilinx/Xilinx.lic` または `XILINXD_LICENSE_FILE`）を明示的に必要とするためであり、ワークステーションには `.lic` ファイルが一つもインストールされていなかったためである。厳格な測定規則に従い、ポストルート `WNS`、配置配線後の最大クロック周波数、およびベクトルレス `report_power`（`est_j`）は Standard `.lic` ファイルが供給されるまで `not_available` と記録されたである。

3. **Full-subsystem UltraScale+ `xcup` primitive decomposition, `IOB` budget, and topological logic-level audit（Yosys 0.71+）**: `synth_xilinx -family xcup` および `ltp -noff` を用いて `clai_benes_paged_hotswap_core` と `clai_kv260_axi_top` の両方を合成し、ホスト `RAPL package-0` の `reported_j` を `x86-64` `EDA` コンパイルコスト $E_{\text{compile}}$ として厳密に記録（FPGA シリコン電力としては記録しない）した結果、正確なセル数とクリティカルパスの組み合わせ深さが確立されたである。

| `xck26-sfvc784-2LV-c` 対象モジュール | CLB LUT (`% xck26`) | 支配的 LUT プリミティブ | CLB レジスタ (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | トップポート (`IBUF`+`OBUF`) | 組合せ深さ (`ltp`) | ホスト合成 `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` ページ) | **`41,185`** (`35.17%`) | `19,982 LUT3`, `7,804 LUT6`, `7,714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36,464`** (`15.57%`) | **`81`** (`56.25%`) | **`0`** | `1,599` (`OOC` / 内部バス) | **`81` レベル** | `7,297.3 J` (`144.8 s`) |
| **`clai_kv260_axi_top`** (`AXI4` Rung-0 サブシステム) | **`67,366`** (`57.52%`) | `25,557 LUT6`, `25,333 LUT5`, `7,918 LUT3`, `569 CARRY4` | **`16,619`** (`7.09%`) | **`4`** (`2.78%`) | **`0`** | `126` (`<= 189` `IOB`; `PS-PL`) | **`73` レベル** | `10,089.4 J` (`214.8 s`) |

`xcup` プリミティブおよび `ltp` 監査から 2 つの具体的な物理設計制約が生じる。
- **ピンバジェット制約 (`OOC` 対 `PS-PL` `AXI` ラッパー)**: `clai_benes_paged_hotswap_core` が生の `512` ビット `CodeBitBus` および広いシャドウ構成ベクトル (`1,379` 個の入力バッファ (`IBUF`) + `220` 個の出力バッファ (`OBUF`) = `1,599` ポート対 `xck26-sfvc784-2LV-c` 上の `189` パッケージ `IOB`) を露出させるため, スタンドアロンなベンダ実装は `synth_design -mode out_of_context` で実行するか, `clai_kv260_axi_top` (`126` ポート, `57.52%` LUT 使用率) のような `AXI4-Stream` / `zynq_ultra_ps_e` ラッパ内部で実行しなければならない。
- **非パイプライン化組合せ深さ (`81` および `73` レベル) 対 `250 MHz` (`4.000 ns`) `-2LV` クロージャ**: Verilator `5.054` がサイクル正確な `CPI = 1.0` (`1` ルックアップ / クロックサイクル) を検証する一方で, `17` `Beneš-1` ステージ + `9` プレフィックスコピーステージ + `17` `Beneš-2` ステージ + 動的 `LUT6` 真理値表多重化 + `5` 投票多数決縮小を単一の組合せサイクルで横断することは **`81` プリミティブレベル** (`clai_kv260_axi_top` の組合せ `64` 入力ポップカウントおよび `8` クラスマージン比較器では `73` レベル) に及ぶ。低電圧 (`0.72 V`) `-2LV` シリコン上で `250 MHz` (`4.000 ns`) の配置配線後閉合を達成するためには, $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ 間に `2` から `3` のパイプラインレジスタステージを挿入し (`64` ワイヤポップカウントツリーとトップ `2` 比較器の間に `1` レジスタステージ), `CPI = 1.0` スループット (`1` コンテキスト / クロック) を `3`-`4` サイクルのパイプライン遅延で維持することが望ましい。

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. 関連研究と収束的知見

本節では、本研究の主要な構成要素である下方 LUT6 コンパイル、Beneš ルーティング・ブールファブリック、コンフォーマル起動ゲート、およびフロンティア疎 MoE NVMe ストリーミングに関連する先行研究を整理し、それらの間に観察される収束的知見を述べる。

| システム | ID / 会場 | 確立内容 | 報告されたコスト | 本参照における差異 |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets**（Umuroglu 他, 2020） | `arXiv:2004.03021` · FPL 2020 | FPGA LUT にコンパイルされたスパース量子化ニューラル層である。 | FPGA LUT および Fmax の合成である。 | シフト時に静的配線は Vivado の再PAR が必要であり、`1` サイクル Beneš + `RAMB36E2` と比較される。 |
| **DiffLogic**（Petersen 他, 2022） & **DWN**（Bacellar 他, 2024） | `arXiv:2210.08277` · `arXiv:2410.11112` | 微分可能なブールゲートおよび無重み LUT ネットワークである。 | ゲート数と精度である。 | VLAN シフト時に静的ルーティングは `52.34%` まで低下し、マージナルなビットプレーン異常が生じる。 |
| **T-MAC**（Wei 他, 2024） & **TeLLMe**（Qiao 他, 2025） | `arXiv:2407.00088` · `arXiv:2504.16266` | CPU/FPGA 上でテーブル参照により三値・低ビット行列積を実現する。 | レイテンシと FPGA 消費電力である。 | モデル内部の線形代数を高速化するが、モデル呼び出しをバイパスしない。 |
| **LittleBit**（Lee 他, 2025） & **LittleBit-2**（Lee と Kim, 2026） | `arXiv:2506.13771` · `arXiv:2603.00042` | `SVD`／`ITQ` と `5` エポック QAT により、`0.1-0.58` ビット/重みのサブ 1 ビットバイナリ潜在因子分解を行う。 | 圧縮率 (`11.6×-31×`)、PPL、及び QAT 精度である。 | ビットパックをデンスランタイムのバイナリ MAC に展開し、正確な符号化（`Claim LA-11`）で `0.00%` に低下する。`Sub1Bit-LUT6` は `0` バイナリ MAC を使用し、`MoL` が `0` エポック QAT で `100.0%` の同等性を回復する。 |
| **FrugalGPT**（Chen 他, 2023） & **RouteLLM**（Ong 他, 2024） | `arXiv:2305.05176` · `arXiv:2406.18665` | 弱から強への LLM カスケードとプリファレンスルーターである。 | API のドル価格と品質の比較である。 | 決定論的な $C(z)$ ゲートが欠如し（`Claim LA-11` の `89.58%` の破損コミット）、`LUT6` 下方コンパイラも存在しない。 |
| **GreenServ**（2026） & **VoltanaLLM**（2025） | `arXiv:2601.17551` · `arXiv:2509.04827` | マルチ LLM バンディットルーティングおよび周波数スケーリングされたサービスである。 | 著者の GPU Wh（`Zeus` / `pyNVML`）。 | GPU サービスを最適化し、本稿ではウェイクを `0` FLOP の `LUT6` ページ（`est_j`）にコンパイルする。 |
| **Medusa**（2024）、**EAGLE-2**（2024）、**HCSpec**（2026） | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | ニューラル MLP、ドラフトツリー、及びカスケード投機的ドラフターである。 | 実時間での速度向上である。 | ドラフト FLOP と重み読みが必要であり、`0` FLOP の `uint64` `LUT6` ページと比較される。 |
| **PLD**（Saxena, 2023） & **REST**（He 他, 2024） | GitHub · `arXiv:2311.08252` | `0` FLOP のプロンプト n-gram とデータストアサフィックストライのドラフターである。 | レイテンシの速度向上（`0` FLOP）。 | `PLD` はプロンプト外トークンを見逃し、`REST` は `RAMB36E2` ページに対し可変トライを使用する。 |
| **AirLLM**（lyogavin, 2023） | Open-source SSD streamer | 小容量 RAM におけるレイヤごとの SSD 重みストリーミングである。 | アクティブ RAM フットプリントである。 | 純粋な `T=1`（`1.0 tok/sweep`）＋ KV スピルと `AirMoL` の `2.74×-2.86×` スイープ削減を比較する。 |
| **Metered Commit Gates** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | コミットゲート（`11,428 pJ` KV260 `INA260` SOM 測定）、MoL $p_i/c_i$、および `RCE-JEPA`。 | KV260 SOM `measured_j` + `est_j`。 | 同一ハウスの基盤であり、ここでは Beneš `LUT6` 下方コンパイルと `AirMoL` を拡張している。 |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. 限界、有効性に対する脅威、非主張、および反証因子

**内部妥当性および構成妥当性。** 一様乱数ノイズまたはステップごとの敵対的チャーン ($\Delta T = 1$) の下では、命題 1 は下方コンパイルの節約をゼロとし、`1.00 tok/sweep` にフォールバックする。ロスレスパリティ (`100.0%`) は、貪欲目標デコーディングとのビット単位の完全一致を保証し、`350M` または `0.8B` ベースチェックポイントの能力上限を引き上げない。

**測定妥当性および非主張。** タスクごとのジュール数 (`est_j/VC`, `est_j/tok`, `est_mJ/Byte`) は解析的な `est_j` 値 (`measured_j = None`) であり、macOS `PMU` 累積デルタは、チップレールワット分離ではなく、システム全体のディスプレイ、SSD、および OS バックグラウンド負荷を含む。Yosys `0.71+` および Verilator `5.054` は、構造的な `xck26` ネットリスト合成および `CPI = 1` サイクルシミュレーションを確立するものであり、Vivado post-PAR `250 MHz` タイミングクロージャではなく、物理 KV260 レールワット (`board_metered = false`) でもない。シリコンエネルギー主導権、`ModelGenerated` 出力を `Deterministic` へ昇格、48 タスク契約ベンチマークを超える完全リポジトリ規模の `SWE-bench` 評価、および測定された `70B` 実行 (`air_mol_nvme_baselines.csv` は測定された `34.66B` `Qwen3.6-35B-A3B` 実行を超える解析的な `70B` 投影を報告) は主張しない。

| ID | 主張 | 正確な反証 / 偽証条件 |
| :--- | :--- | :--- |
| **`LA-F1`** | `主張 LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` が `5,120` パケット全体で `100.0%` Verilator パリティに失敗するか、パケット `2,500` における VLAN シフトを見逃す。 |
| **`LA-F2`** | `主張 LA-2` (Polyglot suite) | Zig がホットループで `> 0` ヒープバイトを割り当て、Go が `> 0 allocs/op` を報告するか、Julia Enzyme が `1e-7` FD 誤差を超える。 |
| **`LA-F3`** | `主張 LA-3` (KV260 paged RTL) | `scripts/verify_paged_bram_rtl.py` が `117,120` LUT、`144` `RAMB36E2`、`0` `DSP48` を超えるか、ページ切り替えあたり `1` サイクルを超える。 |
| **`LA-F4`** | `主張 LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` がシフトされたトラフィック上で目標偽リスク $\alpha = 0.02$ を超えるか、`Deterministic` と印を付ける。 |
| **`LA-F5`** | `主張 LA-5` (Byte speculation) | `scripts/run_code_corpus_benchmark.py` が `48` 個の未見プロンプト上で貪欲 `Mamba3CodeLM` に対して `< 100.0%` 正確バイトパリティを生成する。 |
| **`LA-F6`** | `主張 LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` が `F_NOCACHE` 下で `100%` パリティに失敗するか、`AirLLM` 4-Bit `T=1` よりも多くの NVMe バイトを読み込む。 |
| **`LA-F7`** | `主張 LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`、`scripts/run_hf_air_mol_pretrained.py`、または `scripts/run_hf_qwen35_air_mol.py` が貪欲目標から $\ge 1$ BPE トークン逸脱する。 |
| **`LA-F8`** | `主張 LA-8` (Regression suite) | `pytest -v` が `tests/` 内の `22` 個のテストのいずれかに失敗する。 |
| **`LA-F9`** | `主張 LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` が `100%` トークンパリティから逸脱するか、`AirLLM` または `Expert-AirLLM` よりも多くの NVMe バイトを読み込む。 |
| **`LA-F10`** | `主張 LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` が密 `ITQ` バイナリ行列乗算に対して `1e-3` 最大誤差を超えるか、`100%` 検証済みパリティに失敗する。 |
| **`LA-F11`** | `主張 LA-11` (`48`-Task Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` が `> 0%` 破損コミットを許容するか、Wave-2 仕様変異下で古い Wave-1 スキルを許容する。 |

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
<li>Google Gemma Team (2026). <code>google/gemma-4-E2B-it</code> On-Device Hybrid Instruction Model Card (2026). <a href="https://huggingface.co/google/gemma-4-E2B-it">huggingface.co/google/gemma-4-E2B-it</a>.</li>
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Lee, H., Kim, M., Baek, S., Kim, J., Hwang, S., Shin, J., Lee, J., and Kim, E. (2025). LittleBit: Ultra Low-Bit Quantization via Latent Matrix Factorization. <em>NeurIPS 2025</em>, <em>arXiv:2506.13771</em>.</li>
<li>Lee, H., and Kim, E. (2026). LittleBit-2: Pushing the Frontier of Extreme LLMs Quantization into 0.1-Bit (<code>SamsungLabs/LittleBit</code>). <em>ICML 2026</em>, <em>arXiv:2603.00042</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455-1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094-1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026a). <code>LiquidAI/LFM2.5-350M</code> and <code>LiquidAI/LFM2.5-8B-A1B</code> Hybrid and Sparse-MoE Open-Weights Model Cards. <a href="https://huggingface.co/LiquidAI/LFM2.5-8B-A1B">huggingface.co/LiquidAI/LFM2.5-8B-A1B</a>.</li>
<li>Liquid AI (2026b). <code>LiquidAI/LFM3-1.7B</code> Tri-Hybrid Open-Weights Model Card (October 23, 2026). <a href="https://huggingface.co/LiquidAI/LFM3-1.7B">huggingface.co/LiquidAI/LFM3-1.7B</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026a). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
<li>Qwen Team (2026b). <code>Qwen/Qwen3.6-35B-A3B</code> Sparse-MoE Hybrid Gated DeltaNet + Attention Model Card (2026). <a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B">huggingface.co/Qwen/Qwen3.6-35B-A3B</a>.</li>
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

[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit a5e9bc1`) のチェックアウトから：

```bash
PYTHONPATH=src .venv/bin/pytest -v
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_lfm3_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_moe_8b_35b_air_mol.py
PYTHONPATH=src .venv/bin/python scripts/run_sub1bit_lut_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
```
