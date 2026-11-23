---
title: "Mixture of Limits カスケードにおける下方 LUT6 コンパイル：Beneš ルーティング・ブールファブリック、コンフォーマル起動ゲート、およびフロンティア疎 MoE NVMe ストリーミング"
deck: "Mixture of Limits カスケードは、まずゼロ浮動小数点演算（FLOP）のページング式 6 入力ルックアップテーブル（LUT6）回路を試行する。ミスが生じた場合にのみ、カスタム Apple Metal Shading Language（MSL）シェーダーを介して、最大 34.66B パラメータの 4 ビット Non-Volatile Memory Express（NVMe）ハイブリッドおよび疎 Mixture-of-Experts（MoE）の 2026 年後半モデルをストリーミングする。さらに決定論的検証器によりコミットを制御し、認証済みの起動結果を Beneš ルーティングされた 36 Kbit Block RAM（RAMB36E2）およびカノニカルなスキルページへ下方コンパイルする。壁時計時間、バッファなしの Darwin F_NOCACHE（バッファなしファイル読み出し）のバイト数、アクティブなランダムアクセスメモリ（RAM）の使用量（34.66B において 16 ビット浮動小数点重みの 1.47% にあたる 970.0 MB まで削減）、デュアルチャネル Apple M5 Max のオンチップ電力カウンタによる実測エネルギー（reported_j）、解析的エネルギー推定値（est_j）、および Yosys/Verilator による xck26 レジスタ転送レベル（RTL）シミュレーションの結果は、openIE-dev/lut-adapt-ai のコミット af152ba から報告される。ボード電源レールの電力は測定されておらず、measured_j は未設定である。"
lang: "ja"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*改訂 ff18890、2026年11月22日。参照実装および成果物：[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) の [`af152ba2e63b5c55bcfad9b2fa41e675e8e3946c`](https://github.com/openIE-dev/lut-adapt-ai/tree/af152ba2e63b5c55bcfad9b2fa41e675e8e3946c)。データ概要：[/data/#lut-adapt](/data/#lut-adapt)。LaTeX版PDF：[/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf)（[ソース](/pdfs/latex/lut-adapt.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概要

本研究は、反復的なニューラルモデル処理を、出力の厳密な一致性を損なうことなく、高速なブール表引きおよび認証済みの正準スキルへ下方コンパイルする計算システムの在り方を検討する。その際、検証されていない推定を信頼されたルールへ昇格させないことを前提とする。本研究では、ソフトウェアおよびバッファリングされていない入出力の計測、レジスタ転送レベル (RTL) の合成およびサイクル単位のシミュレーション、オペレーティングシステムおよびオンチップのエネルギーカウンタによる二系統の読取値 (Apple M5 Max のシステム計測値および Linux の Running Average Power Limit カウンタに由来する `reported_j`)、ならびに明示的にラベル付けされた解析的エネルギー推定値 (`est_j`) を報告する。本リポジトリにはウォールまたはレール系統の電力計は接続されていない。したがって `measured_j` は未設定であり、`board_metered` は偽である。

**平易な言い換え**

1. 展開されたシステムが目にする入力の大部分はすでに解決済みの繰り返しパターンであるため、すべてのステップで完全な浮動小数点ニューラルネットワークを実行することは計算量とメモリ帯域幅を浪費する。

2. 参照文献はストリーミング状態空間および基礎モデルに先行して再構成可能な6入力真理値表 (`LUT6`) ルックアップ階層を配置し、明示的な検査がそれらを認証した後にのみルックアップメモリページへ下方コンパイルする。

3. 2026年末のハイブリッドおよび疎混合専門家言語モデルが最大 `34.66B` パラメータ規模で4ビット重みをソリッドステートストレージからカスタム融合 Apple Metal シェーダ経由でストリーミングする場合、ルータ疎専門家読み出しとそのゼロFLOP `LUT6` ドラフタの組み合わせはディスク読み出しを最大 `12.30×` 削減し、`Qwen/Qwen3.6-35B-A3B` を `970.0` メガバイトのアクティブ重みメモリ (`66.11` ギガバイトの16ビット浮動小数点フットプリントの `1.47%`) に保持し、オンチップ `reported_j` で `6.773 J/tok` を達成するが、出力トークンに変化はない。決定論的 `pytest` 検査の背後にあるゲーティングコードおよびマルチファイル git リポジトリコミットは、48タスク (`16` 仕様 × `3` 波) のフロンティアコーディングベイクオフおよび16タスク (`8` git リポジトリ × `2` 波) のリポジトリパッチングベンチマークの両方で **`87.50%` 検証済み合格率** に達し、**`0.00%` の破損コミットが認められず**、結晶化された Wave-3 解決を **`15,401×`** (`2.89 ms`, `0.0424 J` `reported_j`) 加速する。

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 用語、略語、および測定ラベル

<ul id="terms">
<li>MoL: Mixture of Limits、カスケード規則（Metered Commit Gates Part II [same house]より）</li>
<li>LA: 本研究で用いる主張 (claim) および反証子 (falsifier) の接頭辞 (LA-1 から LA-14、LA-F1 から LA-F14)</li>
<li>LUT、LUT6、INIT: ルックアップテーブル、6入力Xilinx UltraScale+ブール原始子、およびその64ビット真理値表初期化マスク</li>
<li>BRAM、RAMB36E2、URAM: ブロックRAM、36-KbitデュアルポートUltraScale+ブロックRAM原始子（xck26では144個）、およびUltraRAM</li>
<li>CLB、FF、DSP、DSP48、KV260: 構成可能ロジックブロック、フリップフロップ、デジタル信号処理スライス、およびAMD Kria KV260ボード（xck26）</li>
<li>FPGA、ASIC、RTL、CPI、PAR、WNS、FPL: フィールドプログラマブルゲートアレイ、特定用途集積回路、レジスタ転送レベル、ルックアップあたりのサイクル数、配置配線、最悪負スラック、およびField-Programmable Logic会議</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU, SMC, L2, L3: Advanced eXtensible Interface (AXI)、Zynq 処理システム (PS)、プログラマブルロジック (PL)、システムオンモジュール (SOM)、オンボード電力監視 IC (INA260)、電源レール (VCC)、Intel Running Average Power Limit (RAPL)、NVIDIA Management Library (NVML)、macOS 電力管理ユニット (PMU)、Apple System Management Controller (SMC)、レベル 2 サブシステムのエネルギーカウンタ (Apple IOReport GPU Energy)、およびレベル 3 のプロセス単位 CPU エネルギーカウンタ (Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj)</li>
<li>SSD、SSM、MIMO、RoPE、SwiGLU、GQA、KV、BPE、LLM、LLMs、MoE、MLP、CFG: State Space Duality、状態空間モデル、多入力多出力、ロータリ位置埋め込み、ゲート付き線形ユニット活性化、グループ化クエリアテンション、キー・バリューキャッシュ、バイトペアエンコーディング、大規模言語モデル（群）、Mixture-of-Experts、多層パーセプトロン、および文脈自由文法</li>
<li>HC、SOINN、WNN、DWN: 階層文脈自己組織化増分ニューラルネットワーク、重みなしニューラルネットワーク、および微分可能重みなしニューラルネットワーク</li>
<li>JEPA、EBRM、ACI、OOD、AUROC、AUC、MSP、MC: Joint-Embedding Predictive Architecture、エネルギーベース推論モデル、適応型コンフォーマル推論、分布外、受信者動作特性曲線下面積、最大ソフトマックス確率、およびモンテカルロ</li>
<li>PLD、REST、EAGLE、LFM2、LFM3、HF: Prompt Lookup Decoding、検索ベース投機的デコーディング、Greater Language-model Efficiencyのための外挿アルゴリズム、Liquid Foundation Model 2.5（LFM2.5-350MおよびLFM2.5-8B-A1B）、Liquid Foundation Model 3（2026年10月LiquidAI/LFM3-1.7B）、およびHuggingFace</li>
<li>SVD、ITQ、SVID、QAT、PTQ、PPL、SNR: 特異値分解、Iterative Quantization Procrustes超立方体回転、符号値独立分解、量子化認識訓練、訓練後量子化、perplexity、および信号対雑音比</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB, GiB: Non-Volatile Memory Express (NVMe) ストレージ、Darwin の F_NOCACHE バッファなしファイルフラグ (NOCACHE)、Portable Operating System Interface (POSIX)、ランダムアクセスメモリ (RAM)、ダイナミック RAM (DRAM)、スタティック RAM (SRAM)、入出力 (IO)、キロバイト (KB)、メガバイト (MB)、ギガバイト (GB)、およびギビバイト (GiB)</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, BF16, FP16, FP32, INT4, ULP, MSL, MPS: 浮動小数点演算, 百万FLOPs, 乗算累積演算, 単一命令複数データ, 自動微分, 有限差分, バイトあたりビット数, ブレインフロート16, 16/32ビットIEEE浮動小数点, 4ビット整数, 最終桁単位, Apple Metal Shading Language, およびPyTorch Metal Performance Shaders</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [同一組織]、Wise Computer Automation [同一組織]、検証済み完了、ソフトウェア工学ベンチマークの接頭辞</li>
<li>CLI, HTTP, GET, POST, SSE, API, MCP, RPC, IDE, SDK, CORS, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW, TDP: コマンドラインインタフェース, Hypertext Transfer ProtocolおよびそのGET/POST要求メソッド, Server-Sent Events, アプリケーションプログラミングインタフェース, Model Context Protocol, リモートプロシージャコール(JSON-RPC 2.0), 統合開発環境, ソフトウェア開発キット, クロスオリジンリソース共有, 学術計算機科学・工学会場, オペレーティングシステム, 中央・グラフィックス処理装置, ソフトウェア, および熱設計電力</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XNOR, JWT, HMAC, DAG, CIDR, LRU, TTL, WAL, ETL: 仮想ローカルエリアネットワーク(IEEE 802.1Q), Transport Layer Security, ディープパケットインスペクション, 抽象構文木, JavaScript Object Notation, カンマ区切り値, Secure Hash Algorithm, 巡回冗長検査, Asynchronous Transfer Mode(CRC-8/ATM), Request for Comments, Structured Query Language, DWARF符号付きリトルエンディアンベース128符号化, 内容アドレス可能メモリ, 排他的NOR, JSON Web Token, ハッシュベースメッセージ認証コード, 有向非巡回グラフ, クラスレス域間ルーティング, 最近最少使用キャッシュ, 存続時間有効期限, 先行書き込みログ, および抽出変換ロードパイプライン</li>
<li>Joint Test Action Group デバッグポート、Xilinx Software Command-Line Tool デバッガ、Debug Access Port、Universal Serial Bus、Future Technology Devices International およびその FT2232C デュアル UART/FIFO ブリッジ IC、ユニバーサル非同期受信機-送信機、FIFO バッファ、集積回路、電子設計自動化、アウト・オブ・コンテキスト合成モード、Advanced Microcontroller Bus Architecture、AXI4-Lite/AXI4-Stream インターコネクト、IOB、IBUF、OBUF、同期リセット/セット D フリップフロップ、UltraScale+ 1〜5 入力 ルックアップテーブル、UltraScale+ 7/8 入力 マルチプレクサ、4/8 ビット高速キャリーチェーン、UltraScale+ DSP スライス、288 Kbit UltraRAM、内部コア供給レール (0.72 V on -2LV)、AMD Zynq UltraScale+ DC/AC スイッチング特性データシート DS925、Value Change Dump 波形トレース、シンプル デュアルポート ブロック RAM モード、同期クロックイネーブル、Xilinx Power Estimator、サブシステムレジスタ マジック識別子 ("CLAI")、および Advanced Micro Devices である。</li>
</ul>

本研究では、以下のすべての表にわたって4つの根拠クラスを相互に分離して扱う。

| 根拠ラベル | 本研究における意味 |
| :--- | :--- |
| **`Measured (SW / NVMe I/O / OS PMU)`** | `os.pread` により Darwin `F_NOCACHE` 下で読み書きされた正確なバイト数、常駐メモリ割り当て、実時間（wall-clock）秒数、Apple M5 Max 上の機体全体の macOS `PMU`（`AppleSmartBattery.PowerTelemetryData`）累積エネルギー差分、および正確なビット/トークン一致。`measured_j` は未設定（`None`）である。 |
| **`Reported (OS / On-Chip Counter, reported_j)`** | 非特権のオペレーティングシステムおよびオンチップのテレメトリカウンタ。Apple M5 Max 上（`joule_meter.py`）では、デュアルチャネルの `libIOReport.dylib` の `"Energy Model"` `'GPU Energy'`（`L2`、ナノ秒分解能の `nJ`）と `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（`L3`、プロセス単位の CPU `nJ`）を用いる。`x86-64` Linux 上（以下の `xck26` EDA 合成監査）では `RAPL` の `package-0` ジュールである。`measured_j`（`None`）と統合されることは決してない。 |
| **`Simulated (RTL)`** | Yosys `0.71+`（Kria KV260 `xck26` を対象とする `synth_xilinx -family xcup`）による構造的ネットリスト数、および Verilator `5.054` によるサイクル数（`CPI = 1`）。Vivado のタイミングクロージャではなく、基板電力でもない（`board_metered = false`）。 |
| **`Estimated (est_j)`** | 演算数、熱設計電力による時間の代理値（`joule_meter.py`）、あるいは AMD `DS925` `xck26-2LV`（`0.72 V`）のロジックおよび `RAMB36E2` の容量上限（§4.16）と組み合わせた Verilator VCD のトグルレート由来のスイッチング活動から算出された解析的ジュールである。同一の式内にある比較対象同士にのみ用い、実シリコンのワット数としては扱わない。 |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 アーキテクチャの背景と貢献

[Metered Commit Gates](/papers/gates/) `[same house]` において、Part II は **Mixture of Limits** を定義する：ジュールあたりの通過確率 $p_i / c_i$ の降順でギアを試し (Simon and Kadane, 1975)、タスク完了述語 $C(z) = 1$ が成立した時点で停止し、`ModelGenerated` 出力を `Deterministic` に強化することを禁じる。ただし静的な Lookup 階層は、展開前に書き込まれたエントリのみをカバーする。逆に、既存のルックアップテーブル型ニューラルネットワークである LogicNets (Umuroglu et al., 2020)、DiffLogic (Petersen et al., 2022)、および Differentiable Weightless Neural Networks (Bacellar et al., 2024) は、静的 FPGA ルーティング内部で配線接続を固定するため、入力分布が変化するたびにベンダーの配置配線を必要とする。

`lut-adapt-ai` 参照は、カスケードの頂点と底辺の間を **オンライン下方 `LUT6` コンパイル** によって閉じる：

- **Rung 0（ルックアップ、ページ化 Beneš + `LUT6`）**: 64 ビット真理値テーブルマスクを、ノンブロッキング $512 \times 512$ **Beneš-Copy-Beneš** マルチキャストスイッチを経由して評価し、$81 \times \texttt{RAMB36E2}$ デュアルポートブロックメモリ上にキャッシュする（浮動小数点演算 `0` 回、Verilator シミュレーションにおけるページ切替は 1 サイクル）。
- **Rung 1（ストリーム、`Mamba-3` 複素 MIMO 状態空間双対性）**: 系列履歴に依存するミスを、サイズ一定の $O(1)$ 再帰状態（参照実装 `14.3M` パラメータにおける `48 KB` 固定メモリ）により処理し、$O(L)$ のキー・バリューキャッシュ増大を回避する。
- **Rung 2（トポロジー、`HC-SOINN`）**: 潜在埋め込み上でオンラインのプロトタイプ位相を維持し、ラベルなし分布シフトが到来した際に regime 境界を特定して、回路遮断器（`Refuse` / エスカレーション）を作動させる。
- **Rung 3（最後にモデル、`JEPA-EBRM`、`AirMoL`、および Metal 融合 `Expert-AirMoL` 4 ビット NVMe ストリーミング）**: 潜在エネルギーベース検証を起動するか、事前学習済みの 2026 年後半のハイブリッドおよび疎 MoE 基盤モデル（`LiquidAI/LFM3-1.7B`、`google/gemma-4-E2B-it`、`LiquidAI/LFM2.5-8B-A1B`、`Qwen/Qwen3.6-35B-A3B`、ならびに `LiquidAI/LFM2.5-350M` および `Qwen/Qwen3.5-0.8B-Base`）を、カスタム Apple Metal `MSL` コンピュートシェーダを介してストリーミングする。これらは、より低コストの下位 Rung が棄権するか、厳密な目標検証を要する場合にのみ実行される。
- **下方 `SleepCrystallizer`**: Walsh-Hadamard スペクトル・ウォームスタート、共同モードのミンターム真理値テーブル、正準 AST スキル、および Waksman スイッチスケジュールを用いて、反復的なウェイク時トレースを抽出し、推論を停止することなく、また FPGA の配置配線を実行することなく、シャドウブロックメモリバンクを切り替える。

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 貢献

1. **償却下方コンパイル条件**: Simon-Kadane $p_i/c_i$ 順序付けを定常ホライズン $\Delta T$ 上の明示的コンパイルコスト $E_{\text{compile}}$ で拡張する。
2. **非ブロッキング $512 \times 512$ Beneš-Copy-Beneš および `81`-`RAMB36E2` RTL アーキテクチャ**: 平坦クロスバーの `102.0%` Kria KV260 ロジックオーバーフロー (`119,478` LUTs) およびフリップフロップページ多重化器の `926,619`-LUT 爆発の両方を排除し、`41,186` UltraScale+ CLB LUTs (`xck26` の `35.2%`)、`81` `RAMB36E2` ブロック (`56.2%`)、`0` `DSP48` スライスに合成され、シミュレーションにおいて `1` サイクル (`250 MHz` 公称で `4.0 ns`) のページ切り替えを実現する。
3. **普遍的 $\le 64$-bit ジョイントモード最小項合成**: ジョイントモード最小項ルックアップが相関分岐上の周辺ビットプレーン DiffLogic 丸めを支配し、$K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ 副単語トークンを 1 つの `uint64` ワードにパックする (`16b × 4 = 64b` for `|V| = 65,536`; `17b × 3 = 51b` for `|V| = 128,000`; `18b × 3 = 54b` for `|V| = 248,320`)。
4. **オラクルフリー Split-Conformal + Online ACI 結晶化ゲート**: 放射状正則化された潜在 `JEPA-EBRM` 非適合性スコアを Split Conformal 較正および Adaptive Conformal Inference (Gibbs and Candès, 2021) と組み合わせ、ソフトマックスおよび MC-Dropout ベースラインが `17.62%-24.28%` の偽リスクを記録したシフト交通において `0.00%` の偽結晶化リスクおよび `1.0000` OOD AUROC を記録する。
5. **カスタム Apple Metal `INT4` Sparse-MoE & `GatedDeltaNet` シェーダ + `AirMoL` / `Expert-AirMoL` 最大 `34.66B`**: Darwin `F_NOCACHE` `os.pread` 4 ビットシャーディング、カスタム `MSL` `q4_moe_*` (`43.45×` 高速) および `gated_delta_recurrent_k128` (`20.66×` 高速) コンピュートシェーダ、Queue-Depth-`8` 並列 `pread`、および `BenesLUT6` バースト推測を組み合わせ、2026 年 10 月の `LiquidAI/LFM3-1.7B` (`3.79%` FP32 RAM における `2.74×` NVMe 削減)、`LiquidAI/LFM2.5-8B-A1B` (`500.0 MB` RAM、`3.493 J/tok` `reported_j`)、および `Qwen/Qwen3.6-35B-A3B` (`34.66B`; **`12.30×` NVMe 削減**、**`970.0 MB` RAM = `1.47%` of FP16**、**`6.773 J/tok` `reported_j`**、**`15.7 tok/s`** Unified-Memory `Q4`) において `100.0%` の完全トークン等価性を達成する。
6. **ゼロ MAC `Sub1Bit-LUT6` vs. `LittleBit`、`87.50%` 検証器ゲート付きフロンティア符号化 & `SWE-Mini` git-repo カスケード、および OpenAI / `MCP` `mol-agent`**: `LittleBit-1 / LittleBit-2` (`0.576` ビット毎重み; Lee et al., 2025; Lee and Kim, 2026) の `1.98M` ランタイムバイナリ MAC をゼロ MAC `6` 入力 `LUT6` 部分和ルックアップ (`< 4 × 10⁻⁶` エラー、`MoL` 対象検証下で `0` QAT エポックにおける `100.0%` 等価性) で置き換え、2026 年後期の `48` タスク符号化ベイクオフにおいて **`87.50%` (`42 / 48`) 検証済みパス** (`0.00%` 破損コミット、`22.92%` `35B` 呼び出し、`2.89 ms` / `0.0424 J` `reported_j` Wave-3 結晶化リプレイ = `15,401×` 高速) および `16` タスク (`8` マルチファイル git リポジトリ × `2` 波) `SWE-Mini` `pytest` ベンチマークにおいて **`87.50%` (`14 / 16`)** (`0.00%` 破損パッチ) を達成し、ドロップイン OpenAI `/v1/chat/completions` + `MCP` (`JSON-RPC 2.0`) `mol-agent` サーバ (`26 / 26` `pytest` テスト合格) を公開する。

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

`scripts/mol_code_cli.py` は `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b,lfm3-1.7b,lfm2.5-8b-a1b,qwen3.6-35b-a3b}` と `--air-nvme` を CLI と SSE エンドポイント (`/v1/health`, `/v1/complete`, `/v1/crystallize`) で提供し、`RAMB36E2` スロットの在住率を `438/512` から `460/512` にライブで向上させ、`tests/` において `26/26` のテストが合格した。

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

### 4.11 主張 LA-11: `48`タスク（`16`仕様 × `3`ウェーブ）による2026年後期フロンティア・コーディング・ベイクオフ

| 2026年後期システム構成（`48`タスク = `16`仕様 × `3`ウェーブ） | W1 コールド | W2 適応 | W3 ウォーム | 全体合格率 | 壊れたコミット | W3 `Rung 0/1` 比率 | `35B` 呼び出し | 平均 W1 / W3 (`ms`) | `reported_j` / 解決 (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LittleBit-2` `Qwen3-8B` `0.55 bpw` QAT（`1`-Shot） | `0.00%` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.0%` | `22,413` / `22,708` | `8,020.13`（`32,558 est_j`） |
| `B` `LiquidAI/LFM3-1.7B`（2026年10月 トリハイブリッド、`1`-Shot） | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `8,460` / `9,791` | `152.77`（`957.21 est_j`） |
| `C` `google/gemma-4-E2B-it`（`2026` ハイブリッド、`1`-Shot） | `37.50%` | `18.75%` | `18.75%` | `25.00%` | `75.00%` | `0.00%` | `0.0%` | `18,924` / `23,578` | `5,800.68*`（`3,700.44 est_j`） |
| `D` `LiquidAI/LFM2.5-8B-A1B`（`8.47B` MoE、`1`-Shot） | `6.25%` | `6.25%` | `6.25%` | `6.25%` | `93.75%` | `0.00%` | `0.0%` | `53,123` / `53,885` | `33,415.04`（`47,196 est_j`） |
| `E` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL`（`1`-Shot） | `81.25%` | `75.00%` | `75.00%` | `77.08%` | `22.92%` | `0.00%` | `100.0%` | `49,887` / `44,447` | `1,069.65`（`5,701.32 est_j`） |
| `F` `RouteLLM` 信頼度ルーター（`LFM3` $\to$ `Gemma4` $\to$ `8B`） | `43.75%` | `25.00%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `0.0%` | `9,735` / `11,294` | `171.09`（`1,148.96 est_j`） |
| **`G` `MoL` `VerifiedCodeCascade`（参照）** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`87.50%`** | **`22.92%`** | **`116,626` / `44,052`（`2.89 ms` 解決）** | **`3,655.51*`（W3 において `0.0424 J`）** |

48 件のタスクからなるプロトコルおよびアルゴリズムのベンチマーク（RFC 1982 シリアル演算、重み付き区間スイープライン、循環安全な辞書式トポロジカルソート、ナノ秒単位のトークンバケット、CRC-8/ATM および変異させた `0xFF` の CRC-8、RFC 6901 JSON Pointer の `~01` アンエスケープ、ホップ数制限付き Bellman-Ford、`>2⁵³` 領域における厳密な窓中央値、制約なしの Damerau-Levenshtein 距離、`4×4` Beneš ルーティング、SQL リテラルのパラメータ化、単調デキューによる部分列和、DWARF SLEB128、SHA-256 一貫性ハッシング、コンフォーマル分位点；macOS の `PMU` によるシステム全体の差分 `117,166.40 J`、`6,646` ティック）において、`VerifiedCodeCascade` は全 3 ウェーブを通じて **`87.50%`（`42 / 48`）** に到達した。これは単体の `Qwen3.6-35B-A3B`（`77.08%`）を上回り、`35B` の呼び出しはタスクの **`22.92%`（`11 / 48`）** に限られた。（`LFM3-1.7B` は Wave-1 の仕様 `7` 件を直接解決し、`Gemma-4-E2B-it` と構造化された反例修復の組み合わせは `3` 件を解決し、`Metal-Qwen3.6-35B-A3B` は `4` 件に加えて変異させた `W2_01` を解決した。）破損コミットの受理率は **`0.00%`**（比較対象は `22.92%-100.00%`）であり、両 Wave-2 の敵対的仕様変異は $C(z)$ を介して両方とも検出された（`artifacts/.mol_verified_skills` に認証済みスキル `16` 件）。また、結晶化された `14` 件の解決（`87.50%`）における Wave-3 の平均リプレイは、**`2.89 ms`** および **`0.0424 J`（`reported_j`）** まで削減された（単体の `35B` と比べて `15,401×` 高速、`reported_j` は `25,227×` 低い）。

*（脚注 `*`: Wave-2 の `W2_10` における `Gemma-4` の呼び出し 1 回で、macOS の非特権 `IOReport` が報告する `'GPU Energy'` ハードウェアアキュムレータのロールオーバーに起因する `+59.2 kJ` のスパイクが観測された。これは編集を加えずに `frontier_ai_head_to_head_bakeoff.csv` に保存し、以降の実行では `joule_meter.py` の `> 450 W` ロールオーバーガードによって除外された。）*

<div id="412-claim-la-12-native-apple-metal-msl-fused-int4-sparse-moe--gateddeltanet-shaders--dual-channel-reported_j" class="anchor-alias" aria-hidden="true"></div>

### 4.12 主張 LA-12: ネイティブ Apple Metal (`MSL`) 融合 `INT4` 疎 MoE & `GatedDeltaNet` シェーダー + デュアルチャネル `reported_j`

`src/clai/frontier/metal_moe_kernels.py` と `scripts/run_metal_moe_benchmark.py` (`artifacts/metal_moe_air_mol_speedup.csv`, `artifacts/metal_moe_air_mol_meta.json`) は `torch.mps.compile_shader` を介して 3 つのカスタム `MSL` カーネルをコンパイルする: (i) `gated_delta_recurrent_k128` は再帰状態 $\mathbf{S}[b, h_v, :, v]$ の $v \in \{0, \dots, V_{\text{dim}}-1\}$ における列独立性を厳密に利用し、すべての $T$ トークンに対して `128` `FP32` 状態要素を GPU レジスタに保持する (**`20.66×` 高速**: `34.523` → `1.671 ms`, **`46.2×` 低い `reported_j`**: `1.4989` → `0.0325 J`, `1.19 × 10⁻⁷` 最大状態誤差); および (ii) `q4_moe_gate_up_silu` + `q4_moe_down_weighted` は `4.50 bpw` `INT4` ブロック-64 エキスパート重みを `simd_sum` レジスタ内で直接デ量子化し、`FP16`/`FP32` 重み割り当てをゼロにする (**`43.45×` 高速**: `22.408` → `0.516 ms` (アクティブエキスパート 28)、**`29.8×` 低い `reported_j`**: `0.3959` → `0.0133 J`, `7.2 × 10⁻⁷` 最大 `FP32` 誤差, `<= 1 ULP` `BF16`)、Queue-Depth-`8` 並列 `pread` と `BenesLUT6` 符号スケッチルーター先読みと組み合わせて実装する:

| Sparse-MoE チェックポイント & Cold-NVMe エンジン バリアント | パリティ | Tok / Sweep | NVMe 読み取り / Tok | ピーク アクティブ RAM | `tok/s` (`× PyTorch`) | On-Chip `reported_j / tok` (`GPU` + `CPU`) | `est_j / tok` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `LFM2.5-8B-A1B` · `1` PyTorch-Ref `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | `1,408.3 MB` | `0.394` (`1.00×`) | `10.978 J` (`5.25` + `5.73`) | `266.66` |
| `LFM2.5-8B-A1B` · `2` Metal-Fused `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `1.257 GB` | **`500.0 MB`** | `0.689` (`1.75×`) | `6.979 J` (`1.30` + `5.68`) | `152.42` |
| **`LFM2.5-8B-A1B` · `3` Metal-Fused + `BenesLUT6` (Reference)** | **`100%`** | **`2.67`** | **`0.791 GB`** | **`500.0 MB`** | **`1.671` (`4.24×`)** | **`3.493 J` (`1.22` + `2.28`)** | **`62.85`** |
| `Qwen3.6-35B-A3B` · `1` PyTorch-Ref `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | `2,434.7 MB` | `0.191` (`1.00×`) | `20.765 J` (`8.76` + `12.00`) | `549.49` |
| `Qwen3.6-35B-A3B` · `2` Metal-Fused `Expert-AirMoL` (`T=1`) | `100%` | `1.00` | `2.353 GB` | **`970.0 MB` (`1.47%`)** | `0.241` (`1.26×`) | `15.440 J` (`3.93` + `11.51`) | `436.26` |
| **`Qwen3.6-35B-A3B` · `3` Metal-Fused + `BenesLUT6` (Reference)** | **`100%`** | **`2.67`** | **`1.447 GB`** | **`970.0 MB` (`1.47%`)** | **`0.621` (`3.25×`)** | **`6.773 J` (`2.31` + `4.47`)** | **`169.03`** |

`FP16`/`FP32` エキスパートのアンパックを除去することで、`Qwen/Qwen3.6-35B-A3B` における Cold-NVMe ピーク アクティブ 重み RAM を **`2.51×`** 減少させ、**`970.0 MB` (`66.11 GB` FP16 の `1.47%`)** へと削減し、デュアルチャンネル `reported_j / tok` を **`3.07×`** 低減させた (`20.765` → **`6.773 J/tok`**)。トークン パリティが `100.0%` の正確さを保ちつつ、`>= 36 GiB` ワークステーション上で `16.8 GB` `INT4` エキスパート パックがユニファイドメモリに固定されている場合、**`15.7 tok/s`** を達成できる。

<div id="413-claim-la-13-16-task-8-multi-file-git-repositories--2-waves-swe-mini-pytest-patching-benchmark" class="anchor-alias" aria-hidden="true"></div>

### 4.13 主張 LA-13: `16` タスク（`8` 個のマルチファイル git リポジトリ × `2` ウェーブ）`SWE-Mini` `pytest` パッチ適用ベンチマーク

`src/clai/frontier/repo_patch_cascade.py` と `scripts/run_repo_patch_benchmark.py`（`artifacts/repo_patch_swebench_mini.csv`、`artifacts/repo_patch_swebench_mini_traces.json`）は、相互に隔離された `8` 個の git リポジトリ（`billing`、DAG 構造の `scheduler`、JWT/HMAC の `auth`、CRC32 の `wal`、CIDR の `http_client`、`semver`、LRU/TTL の `ttlcache`、CSV の `etl`）にまたがるモジュール横断的なリポジトリバグ修正を評価する。評価は `2` ウェーブ（計 `16` 件の評価であり、ウェーブ 2 では `R03_jwt_clock_skew` に対して未来の `iat` を拒否する安全性変異を追加する）で行われる。ここで $C(z)$ は `tests/` のバイト単位での同一性を強制し、サブプロセスで `pytest -q` を実行する。

| 多ファイル git リポジトリ・アーム（`16` タスク = `8` リポジトリ × `2` ウェーブ） | W1 コールド | W2 ウォーム | 総合合格率 | 破損パッチ | W2 `.mol/` ヒット率 | 平均 W1 / W2（`ms`） | `reported_j` / 修正（`est_j`） |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B`（`1` ショット・リポジトリパッチ） | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `4,943` / `5,020` | `371.61 J`（`637.68 est_j`） |
| `B` `google/gemma-4-E2B-it`（`1` ショット・リポジトリパッチ） | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `6,865` / `7,117` | `133.48 J`（`469.79 est_j`） |
| `C` `LiquidAI/LFM2.5-8B-A1B`（`1` ショット・リポジトリパッチ） | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `61,430` / `61,416` | `17,882.33 J`（`54,052 est_j`） |
| `D` `Qwen/Qwen3.6-35B-A3B` Metal `AirMoL`（`1` ショット） | `62.50%` | `62.50%` | `62.50%` | `37.50%` | `0.00%` | `20,270` / `20,502` | `288.39 J`（`3,098.71 est_j`） |
| **`E` `MoL` `RepoPatchCascade`（参照）** | **`87.50%`** | **`87.50%`** | **`87.50%`** | **`0.00%`** | **`75.00%`** | **`59,341` / `30,663`（`594 ms` `.mol/`）** | **`692.38 J`（`1.10 J` `.mol/`）** |

`RepoPatchCascade` は、多ファイルリポジトリのバグのうち **`87.50%`（`14 / 16`）** を解決する（単独の `35B` および `Gemma 4` と比較して `+25.0` パーセントポイント高い）。破損パッチの提出は **`0.00%`** である。サブプロセス `pytest` による $C(z)$ を通じてウェーブ 2 の `R03` 仕様変異を検出し、`Patch#8`（`2,905 ms`）を再結晶化する。さらに、ウェーブ 2 で再生された `6` 件の再帰的な `.mol/` パッチを **`594.0 ms`（`reported_j` `1.10 J`、`git init` と `pytest` を含む）** で再生する。これはウェーブ 1 の `38,937.5 ms`（`reported_j` `590.38 J`）と比較して **`65.6×` 高速、`reported_j` `537×` 低減** である。

<div id="414-claim-la-14-drop-in-openai-v1chatcompletions-and-mcp-json-rpc-20-local-coding-agent-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.14 主張 LA-14: OpenAI (`/v1/chat/completions`) 互換および `MCP` (`JSON-RPC 2.0`) に対応したローカル・コーディングエージェント (`mol-agent`)

`src/clai/service/openai_mcp_agent.py` と `scripts/mol_agent_server.py`（`mol-agent` CLI エントリポイント）は、第三者 Web 依存をゼロに保ったまま、カスケードを `IDE` およびターミナル型コーディングツール（`Cursor`、`Continue.dev`、`Claude Code`、`Antigravity`、OpenAI `SDK`）に公開する。公開される機能は次の二系統である。(i) OpenAI 互換の `GET /v1/models` と `POST /v1/chat/completions`。ここでは `stream: true/false` の `SSE`、CORS ヘッダ、任意指定の決定論的検証器 `x_mol_contract`、および階級（rung）、`skill_id`、`est_j`、`reported_j`、`measured_j: null` を報告する `x_mol_receipt` を備える。(ii) Model Context Protocol（`--mcp-stdio` 経由および `POST /mcp` による `MCP` `JSON-RPC 2.0`）。これは `mol_synthesize_verified_function`、`mol_repair_repo_pytest`、`mol_lookup_crystallized_skill`、`mol_energy_telemetry` の四つのツールを公開し、永続化された `.mol/skills_v1.json` と `.mol/benes_lut6_router.npz` によって支えられる。`pytest` の全 `26 / 26` 件のテストが合格している。

<div id="415-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.15 `xck26-sfvc784-2LV-c` 完全サブシステム原始分解、位相的深さ、および `Vivado 2026.1` ハードウェアプローブ

単独の `512` ページ投機的コア (`hw/kv260/rtl/clai_benes_hotswap_core.sv` 内の `clai_benes_paged_hotswap_core`) および完全な Advanced Microcontroller Bus Architecture (`AMBA`) `AXI4-Lite` + `AXI4-Stream` Rung-0 サブシステム (`hw/kv260/rtl/clai_kv260_axi_top.sv` 内の `clai_kv260_axi_top`、`clai_engram_streamer.sv`、`clai_rung0_hotswap_core.sv`、およびコミット `a5e9bc1de280` における `artifacts/clai_rung0_kv260.v`、`af152ba` において変更なし) を、正確な AMD Kria KV260 部品 (`xck26-sfvc784-2LV-c`: `117,120` CLB LUT、`234,240` CLB フリップフロップ、`144` `RAMB36E2` ブロック、`64` 288-Kbit UltraRAM (`URAM288`) ブロック、`1,248` UltraScale+ デジタル信号処理 (`DSP48E2`) スライス、および `189` ユーザ入出力ブロック (`IOB`)) に対して監査するため、`Intel Core i9-13900H` (`Linux 7.0.0-43-generic x86-64`) ワークステーション上で 3 つのハードウェアおよび電子設計自動化 (`EDA`) 検査が実行された:

1. **読み出し専用 Joint Test Action Group (`JTAG`) と Universal Serial Bus (`USB`) プローブ (`Xilinx hw_server v2026.1` + Xilinx Software Command-Line Tool (`XSDB`))**: `lsusb` が将来技術デバイス国際 (`FTDI`) `0403:6010` (`FT2232C/D/H` デュアル汎用非同期受信機-送信機 (`UART`) / ファーストイン・ファーストアウト (`FIFO`) 集積回路 (`IC`)) ブリッジを検出したにもかかわらず、Linux `sysfs` USB ベンダー/プロダクト文字列 (`idVendor = 0403`, `idProduct = 6010`) を調査したところ、デバイスは `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"` として識別され、Kria KV260 キャリアではなかった。`hw_server v2026.1` (ビルド 2026 年 5 月 29 日) を `xsdb` (`connect; jtag targets; targets`) でクエリした結果、**`0` Xilinx `JTAG` デバイスおよび `0` Debug Access Port (`DAP`) ターゲット** が返された (`board_metered = false`, `measured_j = None`)。

2. **`Vivado 2026.1` バッチ合成およびライセンスゲート (`SW Build 6511674`)**: 再現性のある低フットプリント・非プロジェクトバッチスクリプト (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, `xck26-sfvc784-2LV-c` を `250.0 MHz` / `4.000 ns` のアウト・オブ・コンテキスト (`OOC`) モードで対象) を `/tools/Xilinx/2026.1/Vivado/bin/vivado` に対してステージングした。`vivado v2026.1` をバッチモードで起動すると `synth_design` に入る前に終了し (**`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`**)、AMD `Vivado 2025.1+` / `2026.1` が Standard/Enterprise `.lic` ファイル (`~/.Xilinx/Xilinx.lic` または `XILINXD_LICENSE_FILE`) を明示的に要求するためである。Standard 階層の `xck26` デバイスでも `.lic` ファイルが無いと、測定ルールに従い、ポストルート `WNS`、配置配線後の最大クロック周波数、ベクトルレス `report_power` (`est_j`) はすべて `not_available` のままである。

3. **フルサブシステム UltraScale+ `xcup` プリミティブ分解、`IOB` 予算、トポロジーレベル論理監査 (`Yosys 0.71+`)**: `clai_benes_paged_hotswap_core` と `clai_kv260_axi_top` を `synth_xilinx -family xcup` と `ltp -noff` で合成しつつ、ホスト `RAPL package-0` `reported_j` を厳密に `x86-64` `EDA` コンパイルコスト $E_{\text{compile}}$ として記録し、FPGA シリコン電力としては記録しなかった結果、正確なセル数および臨界経路の組み合わせ深さが確定した。

| `xck26-sfvc784-2LV-c` 対象モジュール | CLB LUT (`% xck26`) | 主要 LUT プリミティブ | CLB レジスタ (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | トップポート (`IBUF`+`OBUF`) | 組合せ深度 (`ltp`) | ホスト合成 `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` ページ) | **`41,185`** (`35.17%`) | `19,982 LUT3`, `7,804 LUT6`, `7,714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36,464`** (`15.57%`) | **`81`** (`56.25%`) | **`0`** | `1,599` (`OOC` / 内部バス) | **`81` 段** | `7,297.3 J` (`144.8 s`) |
| **`clai_kv260_axi_top`** (`AXI4` Rung-0 サブシステム) | **`67,366`** (`57.52%`) | `25,557 LUT6`, `25,333 LUT5`, `7,918 LUT3`, `569 CARRY4` | **`16,619`** (`7.09%`) | **`4`** (`2.78%`) | **`0`** | `126` (`<= 189` `IOB`; `PS-PL`) | **`73` 段** | `10,089.4 J` (`214.8 s`) |

`xcup` プリミティブおよび `ltp` 監査から、物理設計上の制約が二つ導かれる。

- **ピン予算の制約 (`OOC` 対 `PS-PL` `AXI` ラッパ)**: `clai_benes_paged_hotswap_core` は生の `512` ビット `CodeBitBus` と広幅のシャドウ構成ベクタを外部に公開するため (入力バッファ (`IBUF`) `1,379` 個 + 出力バッファ (`OBUF`) `220` 個 = `1,599` ポート, 対して `xck26-sfvc784-2LV-c` のパッケージ `IOB` は `189` 個)、単独でのベンダー実装は `synth_design -mode out_of_context` で実行するか、`clai_kv260_axi_top` (`126` ポート, LUT 使用率 `57.52%`) のような `AXI4-Stream` / `zynq_ultra_ps_e` ラッパ内で行う必要がある。
- **パイプライン化されていない組合せ深度 (`81` 段および `73` 段) 対 `250 MHz` (`4.000 ns`) の `-2LV` タイミング収束**: Verilator `5.054` により、サイクル精度の `CPI = 1.0` (クロックサイクルあたり `1` 回のルックアップ) は検証されているものの、`17` 段の `Beneš-1` ステージ、`9` 段のプレフィックスコピーステージ、`17` 段の `Beneš-2` ステージ、動的 `LUT6` 真理値表の多重化、および `5` 票の多数決縮約を単一の組合せサイクルで伝搬させると、**`81` 段のプリミティブ論理段**に及ぶ (`clai_kv260_axi_top` の組合せ型 `64` 入力ポップカウントおよび `8` クラスのマージン比較器の階層モジュールごとには `73` 段)。低電圧 (`0.72 V`) の `-2LV` シリコン上で配置配線後に `250 MHz` (`4.000 ns`) を収束させるには、$\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ の間にパイプラインレジスタ段を挿入し、`64` 本のワイヤによるポップカウント縮約を圧縮することが有利であり、その定量的評価は §4.16 で解析的に示す。

<div id="416-gate-level-xcup-primitive--verilator-vcd-switching-activity-datasheet-audit-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.16 ゲートレベル `xcup` プリミティブおよび `Verilator` `VCD` 切替活動データシート監査 (`est_j`)

AMD `Vivado 2026.1` が欠落した `.lic` ファイルによりブロックされ、物理 `xck26` ボードが `0` 枚接続されていなかったため (§4.15)、事前登録された `Verilator 5.054` `--trace` 波形および `Yosys 0.71+` 平坦化 `synth_xilinx -family xcup` 監査 (`PREREG_xck26_vcd.json`、SHA-256 `c64505d177515c47…`) は、`openIE-dev/lut-adapt-ai` (`af152ba`) から 4 つの動作フェーズ (`idle_quiescent`、`steady_lut6_eval_2048_cycles`、`single_cycle_page_switch_512_burst`、および `shadow_page_stream_write`、`3,072` ページルックアップ全体およびすべての `AXI4-Lite`/`AXI4-Stream` パケットバーストにわたる `0` 個のコシミュレーションエラー) における正確なサイクルごとの信号遷移を抽出した。本小節のすべての電力およびエネルギー数は、厳密に分析的な動的切替推定 (**`est_j` / `est_pJ/cycle` / `est_mW`**、**`measured_j = None`**、**`reported_j = None`**、**`board_metered = false`**) であり、静的シリコンリークを除外し、配置配線済み `Vivado report_power` または KV260 `INA260` レール読み値の代用を一切行わない。

平坦化 `xcup` 合成は `clai_benes_paged_hotswap_core` (`512` ページ) を **`41,623` CLB LUT** (`xck26` の `35.54%`、§4.15 の階層的 `41,185` に対し、`19,982 LUT3`、`7,853 LUT6`、`7,738 LUT5`、`3,380 LUT4`、`2,670 LUT2`、`36 MUXF7`、`18 MUXF8`)、`36,464` `FDRE` (`15.57%`)、および `81` `RAMB36E2` (`56.25%`) に、`27,157` 個のユニーク `VCD` ネット (`90,124` 内部ビット：`64,218` 組合せ、`20,767` 逐次) 全体にわたってマッピングし、`clai_kv260_axi_top` を **`66,881` CLB LUT** (`xck26` の `57.10%`、§4.15 の階層的 `67,366` に対し、`25,402 LUT6`、`25,313 LUT5`、`7,909 LUT3`、`5,303 LUT4`、`2,879 LUT2`、`75 LUT1`、`569 CARRY4` $\equiv$ `285 CARRY8`)、`16,619` `FDRE`/`FDSE` (`7.09%`)、および `4` `RAMB36E2` (`2.78%`) に、`3,825` 個のユニーク `VCD` ネット (`128,486` 内部ビット：`108,582` 組合せ、`19,901` 逐次) 全体にわたってマッピングする。`VCCINT = 0.72 V` (`xck26-sfvc784-2LV-c`、`250.0 MHz`、`AMD DS925` / `XPE` 16 nm FinFET 境界 `[low, nom, high]`) における動的切替エネルギーは、切替論理 + 局所相互接続ノードを $C_{\text{node}} = [2.6, 4.5, 7.2]\text{ fF}$ ($\frac{1}{2} C V^2 = [0.674, 1.166, 1.866]\text{ fJ/transition}$、`Beneš` コア内の `VCD` 組合せビットあたり `2.02` `xcup` プリミティブで重み付け) でモデル化し、`FDRE`/`FDSE` クロックリーフピンを `[1.5, 2.2, 3.0] fF` (`2` エッジ/サイクル = 公称 `1.141 fJ/FF/cycle`) + `Q` 遷移あたり `[3.5, 5.5, 8.0] fF` でモデル化し、`RAMB36E2` (`SDP` `64b`/`72b`) を可変アドレス読み出しあたり `[2.90, 3.80, 4.80] pJ`、定アドレスイネーブルサイクル (`ENARDEN = 1`、$\alpha_{\text{addr}} = 0$) あたり `[1.90, 2.47, 3.12] pJ`、書き込みあたり `[3.30, 4.30, 5.40] pJ`、および無効時 (`EN = 0`) に `[0.04, 0.08, 0.14] pJ/cycle` でモデル化する：

| 対象モジュールおよび `VCD` ワークロード（`250 MHz`、`0.72 V`） | サイクル数 | 組合せ遷移数 / サイクル（$\alpha_{\text{comb}}$） | 順序回路遷移数 / サイクル（$\alpha_{\text{seq}}$） | `RAMB36E2` 稼働率（`Rd` / `Wr`） | 動的 `est_pJ / cycle` | 動的 `est_mW`（`[low, high]`） |
| :--- | ---: | ---: | ---: | :---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** · `idle_quiescent` | `256` | `0.00`（`0.0000`） | `0.00`（`0.0000`） | `100.0%`（定数アドレス）/ `0%` | **`241.66`**（`53.74` CE ゲート時） | **`60.41`**（`[47.25, 76.21]`；`13.43` CE ゲート時） |
| **`clai_benes_paged_hotswap_core`** · `steady_lut6_eval_2048_cycles` | `2,048` | `5,010.21`（`0.0780`） | `90.97`（`0.0044`） | `100.0%`（動作中）/ `0%` | **`361.68`** | **`90.42`**（`[69.29, 116.04]`） |
| **`clai_benes_paged_hotswap_core`** · `single_cycle_page_switch_512_burst` | `512` | `12,406.84`（`0.1932`） | `269.46`（`0.0130`） | `100.0%`（動作中）/ `0%` | **`380.07`** | **`95.02`**（`[72.58, 122.60]`） |
| **`clai_benes_paged_hotswap_core`** · `shadow_page_stream_write` | `512` | `1,987.31`（`0.0310`） | `74.47`（`0.0036`） | `100.0%` 読出 / `1.23%` 書込（`1/81`） | **`358.86`** | **`89.72`**（`[68.82, 114.89]`） |
| **`clai_kv260_axi_top`** · `idle_quiescent` | `256` | `0.00`（`0.0000`） | `0.00`（`0.0000`） | `0.0%`（`EN = 0`）/ `0%` | **`19.55`** | **`4.89`**（`[3.26, 6.66]`） |
| **`clai_kv260_axi_top`** · `steady_lut6_eval_2048_cycles` | `2,048` | `120.31`（`0.0011`） | `15.27`（`0.0008`） | `3.12%` 読出 / `0%` | **`20.40`** | **`5.10`**（`[5.04, 5.18]`） |
| **`clai_kv260_axi_top`** · `single_cycle_page_switch_512_burst` | `512` | `325.21`（`0.0030`） | `25.56`（`0.0013`） | `11.13%` 読出 / `0%` | **`22.07`** | **`5.52`**（`[5.34, 5.75]`） |
| **`clai_kv260_axi_top`** · `shadow_page_stream_write` | `512` | `31.95`（`0.0003`） | `71.92`（`0.0036`） | `0.0%` 読出 / `8.20%` 書込 | **`21.80`** | **`5.45`**（`[5.30, 5.64]`） |

上記の `VCD` 活動度分解および `DS925` 遅延モデルから、以下の 3 点のハードウェア設計上の知見が直接導かれる:

1. **無条件 `RAMB36E2` `ENARDEN` アイドル事前充電（クワイエントコア電力の 82.8%）と `4.50×` `CE`-ゲーティング削減**: `clai_benes_paged_hotswap_core` はアイドル時にデータ遷移が `0.00` /サイクル であるのに対し、`clai_uram_lut6_page_cache` は全 `81` 個の `RAMB36E2` ブロックで `ENARDEN = 1'b1` を連続的に保持し、ビットライン事前充電に `200.07 est_pJ/cycle`（`50.02 est_mW`）と `FDRE` クロックリーフに `41.59 est_pJ/cycle`（`10.40 est_mW`）を消費し（**`60.41 est_mW`** クワイエント）、合計で消費する。対照的に `clai_kv260_axi_top` 内の `clai_engram_streamer` は `4` 個の `RAMB36E2` ブロックを `accept_byte && s_axis_tlast` でゲートし、**`4.89 est_mW`**（`19.55 est_pJ/cycle`）でアイドルし、`31` バイト `AXI4-Stream` パケット推論を安定して実行し（`core_bus_reg` がパケットごとにラッチされ、$\alpha_{\text{comb}} = 0.0011$）、**`5.10 est_mW`** を消費する。`clai_uram_lut6_page_cache` の `ENARDEN` を `bus_valid` でゲートすれば、レイテンシペナルティゼロでクワイエントページコア動的電力を **`4.50×`** 削減し **`13.43 est_mW`**（`53.74 est_pJ/cycle`）になる。

2. **Beneš 組合せトグル増幅（`2.48×`）対 `RAMB36E2` 主導のアクティブ電力（`+5.1%`）**: 連続クロックサイクルで全 `512` スロットの `page_id` を切り替える（`single_cycle_page_switch_512_burst`）と、`81 × 64 = 5,184` 個の `LUT6` `INIT` ビットラインが同時にセレクタツリーへ駆動され、組合せ遷移が `2.48×`（`5,010.2` から `12,406.8` 遷移/サイクル、`11.80` から `29.22 est_pJ/cycle`）に増大するが、ページコアの総動的電力は `+4.60 est_mW`（`90.42` から `95.02 est_mW`、`+5.1%`）に留まる。これは `81 × RAMB36E2` のセンスアンプ読み出し（`307.80 est_pJ/cycle`）がアクティブ動的エネルギー（`358.86 est_pJ/cycle` / `89.72 est_mW`）の `85.1%`-`80.9%` を占めるためである（`shadow_page_stream_write` 同時実行中）。

3. **平坦化されたクリティカルパス監査（`81` および `162` `ltp` レベル）と `DS925` `-2LV` 解析的ステージ遅延予算**: `AMD DS925`（`xck26-2LV`、`0.72 V`）のプリミティブ遅延（`T_ILO = 0.068 ns`、`T_CKO = 0.148 ns`、パイプラインなし `RAMB36E2` `T_RCKO_DO = 1.390 ns` 対 `DOA_REG = 1` `0.610 ns`、レベル当たり `[0.140, 0.220] ns` の配線予算）を適用すると、パイプラインなし `81` レベル `clai_benes_paged_hotswap_core` の経路は **`18.76-24.83 est_ns`**（`40.3-53.3 MHz` 解析的 `est_Fmax`）になる。`clai_kv260_axi_top` をモジュール境界で平坦化（`-flatten` 後 `ltp -noff`、§4.15 の階層モジュールで `73` レベル）すると、**`162` レベル** の経路（**`34.77-46.92 est_ns`**、`21.3-28.8 MHz`）が `core_bus_reg` から `clai_rung0_core`（`artifacts/clai_rung0_kv260.v`）へ、そして展開された `64` ステップシリアル `pop_acc` 加算チェーンを跨いで露出する。`RAMB36E2` の `DOA_REG = 1` を有効化し、`4`-`5` 段パイプラインレジスタカット（`<= 18` 論理レベル/ステージ）を挿入し、シリアル `64` 入力ポップカウントループを `6` レベル `LUT6`/Wallace 圧縮器に置換すれば、ステージ当たりの解析遅延は **`3.7 est_ns`**（`250 MHz` で `<= 4.000 ns`）以下に抑えられ、`CPI = 1.0` を実現できる（Vivado 後 PAR タイミングクロージャではない）。

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. 関連研究と収束に関する観察

| システム | ID / 会場 | 確立する内容 | 報告されたコスト | 本参照における差異 |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | スパース量子化ニューラル層を FPGA LUT にコンパイルしたもの。 | FPGA LUT および Fmax 合成。 | 静的ワイヤは Vivado 再 PAR をシフトに対して必要とするが、`1` サイクル Beneš + `RAMB36E2` である。 |
| **DiffLogic** (Petersen et al., 2022) & **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | 微分可能ブールゲートおよび重みなし LUT ネットワーク。 | ゲート数および精度。 | 静的ルーティングは VLAN シフト上で `52.34%` に低下し、周辺ビットプレーン・キメラにわずかに影響を受ける。 |
| **T-MAC** (Wei et al., 2024) & **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | 三値 / 低ビット行列積を CPU/FPGA 上のテーブル参照により実現。 | レイテンシおよび FPGA 電力。 | モデル歯車内部の線形代数を加速するが、モデル呼び出しをバイパスしない。 |
| **LittleBit** (Lee et al., 2025) & **LittleBit-2** (Lee and Kim, 2026) | `arXiv:2506.13771` · `arXiv:2603.00042` | `SVD` / `ITQ` + `5` エポック QAT によるサブ 1 ビット (`0.1-0.58` ビット/重み) バイナリ潜在因子分解。 | 圧縮 (`11.6×-31×`)、PPL、および QAT 精度。 | ビットパックを展開して密ランタイムバイナリ MAC とするため、正確な符号化 (`Claim LA-11`) で `0.00%` に低下する。`Sub1Bit-LUT6` は `0` 個のバイナリ MAC を使用し、`MoL` は `0` QAT エポックで `100.0%` のパリティを回復する。 |
| **FrugalGPT** (Chen et al., 2023) & **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | 弱から強への LLM カスケードおよび選好ルータ。 | API ドル価格対品質。 | 決定論的 $C(z)$ ゲート (`Claim LA-11` において `68.75%` の破損コミット) が欠如しており、`LUT6` 下方コンパイラを持たない。 |
| **GreenServ** (2026) & **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | マルチ LLM バンディットルーティングおよび周波数スケーリングサービング。 | 著者らの GPU Wh (`Zeus` / `pyNVML`)。 | GPU サービングを最適化するが、本参照は起動を `0` FLOP `LUT6` および正準スキルページ (`reported_j` / `est_j`) にコンパイルする。 |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | ニューラル MLP、ドラフトツリー、およびカスケード投機的ドラフタ。 | 壁時計速度向上。 | ドラフト FLOP および重み読み出しを必要とするが、`0` FLOP `uint64` `LUT6` ページに対しては不要である。 |
| **PLD** (Saxena, 2023) & **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | ゼロ FLOP プロンプト n-gram およびデータストア接尾辞トライドラフタ。 | レイテンシ速度向上 (`0` FLOP)。 | `PLD` はプロンプト外トークンを欠落させ、`REST` は可変トライを使用するが、`RAMB36E2` ページに対しては不要である。 |
| **AirLLM** (lyogavin, 2023) | オープンソース SSD ストリーマ | 小容量 RAM におけるレイヤごとの SSD 重みストリーミング。 | アクティブ RAM フットプリント。 | 純粋 `T=1` (`1.0 tok/sweep`) + KV スピルに対し、`AirMoL` は `2.74×-12.30×` の I/O 削減および `970 MB` Metal `INT4` RAM を実現する。 |
| **Metered Commit Gates** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | コミットゲート (`11,428 pJ` KV260 `INA260` SOM 読み出し)、MoL $p_i/c_i$、および `RCE-JEPA`。 | KV260 SOM `measured_j` + `reported_j` / `est_j`。 | 同家基礎。本稿では Beneš `LUT6` 下方コンパイル、Metal `Expert-AirMoL`、および `mol-agent` により拡張される。 |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 限界、妥当性への脅威、主張されない点、そして反証可能性

**内部妥当性および構成妥当性。** 一様乱数ノイズまたはステップごとの敵対的チャーン ($\Delta T = 1$) の下では、命題 1 は下方コンパイルの節約をゼロとし、`1.00 tok/sweep` にフォールバックする。ロスレスパリティ (`100.0%`) は、貪欲目標デコーディングとのビット単位の完全一致を保証し、`350M` または `0.8B` ベースチェックポイントの能力上限を引き上げない。

**測定の妥当性と主張しない事項。** 解析的なジュール値およびスイッチング電力値（`est_j/VC`、`est_j/tok`、`est_mJ/Byte`、ならびに §4.16 における `Verilator` の `VCD` と `AMD DS925` の `0.72 V` に基づく `est_pJ/cycle` および `est_mW` の上下限）、オペレーティングシステムおよびオンチップカウンタの読み取り値（Apple Silicon の `L2` `libIOReport` `'GPU Energy'` と `L3` `proc_pid_rusage` `ri_energy_nj` に由来する `reported_j`、ならびに `Claim LA-11` に記載された `> 450 W` の狭幅レジスタ桁あふれフィルタ）、および macOS の `PMU` による機械全体の累積差分は、物理的な電源レール測定（`measured_j = None`）から厳密に分離して扱う。Yosys `0.71+` と Verilator `5.054` が確立するのは、`xck26` に対する構造的なネットリスト合成、`CPI = 1` のサイクルシミュレーション、および `VCD` によるトグル率に基づく動的スイッチングの `est_mW`（静的リークを除く）であり、Vivado の配置配線後 `250 MHz` タイミングクロージャや、物理的な KV260 のレール電力ワット数（`board_metered = false`）を示すものではない。シリコンにおけるエネルギー優位性、`ModelGenerated` 出力の `Deterministic` への昇格、`Claim LA-11` の `48` タスク契約ベンチマークを超える `500` タスクの完全な `SWE-bench Verified` コンテナ評価、`Claim LA-13` の `16` タスクからなる複数ファイル git リポジトリ `SWE-Mini` の `pytest` ベンチマーク、ならびに `air_mol_nvme_baselines.csv` が測定済みの `34.66B` `Qwen3.6-35B-A3B` 実行を超えて報告する解析的な `70B` 推定値（測定済みの `70B` 実行ではない）は、いずれも主張しない。

| ID | 主張 | 正確な反証 / 偽証条件 |
| :--- | :--- | :--- |
| **`LA-F1`** | `主張 LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` が `5,120` パケット全体で `100.0%` の Verilator パリティに失敗するか、パケット `2,500` の VLAN シフトを見逃す。 |
| **`LA-F2`** | `主張 LA-2` (Polyglot スイート) | Zig がホットループで `> 0` のヒープバイトを割り当て、Go が `> 0 allocs/op` を報告するか、Julia Enzyme が `1e-7` を超える FD エラーを示す。 |
| **`LA-F3`** | `主張 LA-3` (KV260 ページド RTL) | `scripts/verify_paged_bram_rtl.py` が `117,120` LUT、`144` `RAMB36E2`、`0` `DSP48` を超えるか、ページ切り替えあたり `1` サイクルを超える。 |
| **`LA-F4`** | `主張 LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` がシフトされたトラフィック上で目標偽リスク $\alpha = 0.02$ を超えるか、`Deterministic` と印を付ける。 |
| **`LA-F5`** | `主張 LA-5` (バイト投機) | `scripts/run_code_corpus_benchmark.py` が `48` の未見プロンプト上で貪欲 `Mamba3CodeLM` に対して `< 100.0%` の正確なバイトパリティを生成する。 |
| **`LA-F6`** | `主張 LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` が `F_NOCACHE` 下で `100%` パリティに失敗するか、`AirLLM` 4-Bit `T=1` よりも多くの NVMe バイトを読み込む。 |
| **`LA-F7`** | `主張 LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`、`scripts/run_hf_air_mol_pretrained.py`、または `scripts/run_hf_qwen35_air_mol.py` が貪欲目標から $\ge 1$ BPE トークン逸脱する。 |
| **`LA-F8`** | `主張 LA-8` (回帰スイート) | `pytest -v` が `tests/` 内の `26` 個のテストのいずれかに失敗する。 |
| **`LA-F9`** | `主張 LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` が `100%` トークンパリティから逸脱するか、`AirLLM` または `Expert-AirLLM` よりも多くの NVMe バイトを読み込む。 |
| **`LA-F10`** | `主張 LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` が密 `ITQ` バイナリ行列乗算に対して `1e-3` を超える最大誤差を示すか、`100%` 検証済みパリティに失敗する。 |
| **`LA-F11`** | `主張 LA-11` (`48` タスク Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` が `> 0%` の破損コミットを許容するか、Wave-2 仕様変異下で Wave-1 スキルの陳腐化を許容する。 |
| **`LA-F12`** | `主張 LA-12` (Metal `INT4` MoE) | `scripts/run_metal_moe_benchmark.py` が `1e-4` の `FP32` シェーダー誤差を超えるか、`8.5B` または `35B` 上で `100%` 貪欲トークンパリティから逸脱する。 |
| **`LA-F13`** | `主張 LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` が `> 0%` の破損パッチを許容するか、`tests/` を変更するか、Wave-2 `R03` 仕様変異を見逃す。 |
| **`LA-F14`** | `主張 LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` が OpenAI REST/SSE、`MCP` `JSON-RPC 2.0`、`.mol/` リロードに失敗するか、`measured_j` と印を付ける。 |

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

## 付録A. 再現性

[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) のチェックアウト（コミット `af152ba`）から以下を実行する。

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
PYTHONPATH=src .venv/bin/python scripts/run_metal_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_ai_bakeoff.py
PYTHONPATH=src .venv/bin/python scripts/run_repo_patch_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/mol_agent_server.py --host 127.0.0.1 --port 8090 --mol-dir .mol
```
