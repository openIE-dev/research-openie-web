---
title: "Mixture of Limits カスケードにおける下方 LUT6 コンパイル：Beneš ルーティング・ブールファブリック、コンフォーマル起動ゲート、およびフロンティア疎 MoE NVMe ストリーミング"
deck: "6カーネル検証済みの Lean 4.36.0 定理 154 件および Inria Charon+Aeneas による機械的 #![no_std] Rust→Lean 抽出（さらに Linux bubblewrap サンドボックス内の Open Interface Engineering リポジトリ 4 件にわたる 1,518 定理を含み、CVE-2026-72844 対策強化済み）を備えた Mixture of Limits カスケードは、まずゼロ浮動小数点演算（FLOP）のページング式 6 入力ルックアップテーブル（LUT6）回路、15.33 キロバイト（15,703 バイト、21 エクスポート、681 バイト余裕）の WebAssembly（WASM）ブラウザモジュール、反対称 40 エントリ・ゼロ乗算 T-MAC 三値テールを備えた 4/56 キロバイト（14 バンク = 87.50%、4 キロバイト Nucleus と 4 キロバイトスタックと合わせ 64.00 キロバイトのスマートウォッチ SRAM を完全閉包）の Rust lut6-core Nucleus（公式 25 ゲーム ARC-AGI-3 の C-BFWS + RIW(2) で 60.00% 絶対多数［15/25 ゲーム、18/183 レベル、一致 16 ゲーム中 11/16 = 68.75%、2.5030 / 3.2177 RHAE］、Python 非依存 Rust mol_ltcb_codec --cm2 による Matt Mahoney 公式 100 MB enwik8 での zstd -19・bzip2 -9・gzip -9 超え 26,838,089 バイト = 2.1470 bpb［arm64/aarch64/x86_64 間で 100.0% 同一 SHA-256］・サイドチャネル不要 i16 Online-TTT-LUT6［ウォームアップ後悔 -56.73%、スラブ再構築スキップ 90.34%］と Window 26 での Thor シャント 32.462x 削減・tufazip v2 QPI1 1 ビット初期事前分布の 5,680,128 個のゼロ MAC LUT6 スラブ変換と 8.766x JouleBit 事前削減および Window 25 での Thor シャント 13.376x 削減、Python 非依存 Rust mol-magnitude-adapter による 4 倍汚染 CogLoadBench 100.0% 合格・第 2 波 Thor VIN エネルギー 3,028.3x 削減および MCPMark CoW CRUD サンドボックスでの本番破壊 0.00%、帯域幅適応型 BA-Tiered-Expert-AirMoL［180B で 436.60 tok/s、GLM-5-355B で 216.33 tok/s、552B で 166.27 tok/s = FreeToken 比 4.00x-4.17x・KTransformers 比 5.90x-6.00x 高速、Window 24 で Thor シャント 3.330x 削減］、ゼロ FLOP Engram-LUT6、Magnitude 0.3.5 実機比較での正答トークンあたりジュール 53.55x 削減および Window 23 での Thor シャント 3.157x 削減、100% Terminal-Bench・Cybench-Defensive［144/144 Yosys マイタ］、100% FrontierMath-Constructive・SciCode 合成、ならびに Window 22 で 3.314x・Window 21 で 3.204x・Window 20 で 4.092x 削減）、プレフィックス汚染 0.00% の 56 ビット 4 トークン開幕応答を備えた 5,984 バイト（64 キロバイト・スマートウォッチ SRAM の 9.13%）の Wearable-MoL、および（72, 64）SECDED 宇宙線ビット反転保護を試行する（単一バイナリ Rust mol-agent-rs で 0.154 ミリ秒、ビットスライス判定あたり 162.71 ナノジュール、ビット誤り率 1% で生存率 100.0%）。さらにサブ10億パラメータのウェアラブル小型言語モデル（Sensente/uLM-28M、LiquidAI/LFM2.5-230M）および 4 つの GPU シリコンベンダー（最大 328.06x 高速化、LastExam プロトコル RMS 較正誤差を 70.62% から 13.14% へ 5.37x 削減し確信度 >= 80% での誤答 CHR@80 を 0.00% へ低減）にわたり最大 120B パラメータの 4 ビット NVMe ループ型・ハイブリッド・疎 MoE 2026 年後半モデルへ段階的にエスカレーションし、上流 Verified リポジトリ 4 件でコミットをゲート制御したうえで、認証済みの起動結果を RAMB36E2、ライセンス不要の openXC7 320.62、106.55、109.15、100.55、100.74、106.97 102.41 および 103.25 メガヘルツ配置配線後 Artix-7 XC7A200T M.2 2280 .bit ビットストリーム、Lupanov 共有余因子およびゆらぎコドン結晶ページへ下方コンパイルする。Jetson AGX Thor 上の物理 Texas Instruments DC シャント measured_j 実測値（ビットスライスで 87.25x、uLM-28M 層スライス比でウェアラブル 56 ビット認識論ゲート 222.57x、Window 26 で 32.462x、Window 25 で 13.376x、Window 24 で 3.330x、Window 23 で 3.157x、Window 22 で 3.314x、Window 20 で 4.092x、反対称 40 エントリ T-MAC で 1.65x［Zen 5 では 1.12x］、Sub1Bit-LUT6 で 3.90x、Expert-AirMoL で 34.21x、命題 1 で 10.94x；board_metered は真）を含み、Alif Cortex-M55 サイクル数（ウェアラブルゲート 2,905.18x）、reported_j カウンタ、openXC7 静的タイミング、およびコミット 597c50b における RTL 推定値 est_j から厳密に分離して報告する。"
lang: "ja"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-frontier-sparse-moe-nvme-streaming" class="anchor-alias" aria-hidden="true"></div>

*改訂 597c50b、2026年11月27日。参照実装および成果物：[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) の [`597c50b63f357e058e80fc9c7b3c46af1a63b88a`](https://github.com/openIE-dev/lut-adapt-ai/tree/597c50b63f357e058e80fc9c7b3c46af1a63b88a)。データ概要：[/data/#lut-adapt](/data/#lut-adapt)。LaTeX版PDF：[/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf)（[ソース](/pdfs/latex/lut-adapt.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概要

本研究は、反復的なニューラルモデル処理を、出力の厳密な一致性を損なうことも未検証の推測を信頼された規則へ昇格させることもなく、高速なブール表引きおよび認証済みの正準スキルへ下方コンパイルする計算システムの在り方を検討する。すべての主張にわたり4つの根拠クラスを厳密に分離して扱う。すなわち、基板上の Texas Instruments 電流シャントによる物理的なジュール読取値（`measured_j`、§4.26 および §4.30 の Tegra `aarch64` Jetson Thor のみで `board_metered = true`）、オペレーティングシステムおよびオンチップのハードウェア電力カウンタならびにベアメタル・マイクロコントローラのハードウェアサイクルカウンタ（Linux、macOS、Windows 11 の 5 台のワークステーションにわたる `reported_j` および実機接続された Alif Ensemble Cortex-M55 のサイクル数、`board_metered = false`）、レジスタ転送レベル合成・網羅的ブールマイタ検査・サイクルシミュレーション（`xck26` および 7-Series `XC7A200T`、すべてのフィールドプログラマブルゲートアレイ主張で `board_metered = false`）、そして明示的にラベル付けされた解析的エネルギーおよび電気・熱包絡線推定値（`est_j`）である。

**平易な言い換え**

1. 展開されたシステムが目にする入力の大部分はすでに解決済みの繰り返しパターンであるため、すべてのステップで完全な浮動小数点ニューラルネットワークを実行することは計算量とメモリ帯域幅を浪費する。
2. 参照実装はストリーミング状態空間・ループ型・基盤モデルに先行して、再構成可能な 6 入力真理値表（`LUT6`）ルックアップ階層と 4 キロバイトのベアメタル Rust `lut6-core` Nucleus（`64` キロバイトのマイクロコントローラ SRAM の `25.06%`、または M.2 `2280` `XC7A200T` カードのオンダイ Block RAM `365` 個に収まる）を配置し、明示的な検査が認証した後にのみ回答をルックアップメモリページへ下方コンパイルする。
3. 最大 `120B` パラメータ（活性 `12B`、さらに 2026 年 10-11 月のループ型 `thinkingmachines/Inkling-2-Mini` および `Nemotron-Labs-Dory1.0-4B` を含む）の 2026 年後半ループ型・ハイブリッド・疎 Mixture-of-Experts 言語モデルを、カスタム融合 Apple Metal シェーダ、ポータブルな Rust `Burn 0.22.1 / CubeCL` シェーダ、および単一バイナリ Rust `mol-agent-rs`（スキル参照あたり `0.154` ミリ秒）を介して Apple Silicon 上でローカル実行すると、ゼロ FLOP `LUT6` ドラフタと組み合わせたルータ疎エキスパート読み出しは `Qwen/Qwen3.6-35B-A3B`（アクティブ重みメモリ `970.0` メガバイト）においてディスク読み出しを最大 `12.30×` 削減し、ループ型の深さ再帰順伝播パスを `4.00×` 削減（厳密貪欲一致 `100%` のまま実測 `3.52×-3.95×` 高速化）し、`nvidia/Nemotron-3-Super-120B-A12B` において `58.08` ギガバイトのユニファイドメモリ内で毎秒 `22.17` トークンを持続する。さらに決定論的な `unittest` および `pytest` 検査の背後にコードおよびリポジトリのコミットをゲート制御することで、`48` タスクのアルゴリズム・ベイクオフにおいて **`91.67%` の検証済み合格率（Wave 2 および Wave 3 にわたり `93.75%`）**、公式 `BigCodeBench v0.1.3` において **`90.62%`（人間による言い換えである Wave 2 では `93.75%`）**、単一リポジトリ `SymPy` git worktree において **`50.00%`**、上流 `princeton-nlp` Verified の `4` リポジトリ（`django`、`pytest`、`requests`、`sympy`）にわたり **`20.83%`（単独 `24B` および `35B` モデルの `2.50×`）**、そして `120B` ハードフロンティアスイートにおいて **`62.50%`** に達し、**破損コミットの受理は `0.00%`** となる。

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 用語、略語、および測定ラベル

<ul id="terms">
<li>MoL: Mixture of Limits、カスケード規則（Metered Commit Gates Part II [same house]より）</li>
<li>LA: 本研究で用いる主張 (claim) および反証子 (falsifier) の接頭辞 (LA-1 から LA-83、LA-F1 から LA-F83)</li>
<li>LUT、LUT6、INIT: ルックアップテーブル、6入力Xilinx UltraScale+ブール原始子、およびその64ビット真理値表初期化マスク</li>
<li>BRAM、RAMB36E2、URAM: ブロックRAM、36-KbitデュアルポートUltraScale+ブロックRAM原始子（xck26では144個）、およびUltraRAM</li>
<li>CLB、FF、DSP、DSP48、KV260: 構成可能ロジックブロック、フリップフロップ、デジタル信号処理スライス、およびAMD Kria KV260ボード（xck26）</li>
<li>FPGA、ASIC、RTL、CPI、PAR、WNS、FPL: フィールドプログラマブルゲートアレイ、特定用途集積回路、レジスタ転送レベル、ルックアップあたりのサイクル数、配置配線、最悪負スラック、およびField-Programmable Logic会議</li>
<li>AXI, AXIS, PS, PL, SOM, INA260, VCC, RAPL, NVML, PMU, SMC, L1, L2, L3: Advanced eXtensible Interface、AXI4-Stream ラッパ接頭辞、Zynq 処理システム、プログラマブルロジック、システムオンモジュール、オンボード電力監視 IC、電源レール、Intel Running Average Power Limit、NVIDIA Management Library、macOS 電力管理ユニット、Apple System Management Controller、レベル 1 基板全体電圧入力レール、レベル 2 サブシステム電力カウンタ（Apple IOReport GPU Energy および Tegra レールシャント）、およびレベル 3 プロセス単位 CPU エネルギーカウンタ（Darwin proc_pid_rusage RUSAGE_INFO_V6 ri_energy_nj）</li>
<li>SSD、SSM、MIMO、RoPE、SwiGLU、GQA、KV、BPE、LLM、LLMs、MoE、MLP、CFG: State Space Duality、状態空間モデル、多入力多出力、ロータリ位置埋め込み、ゲート付き線形ユニット活性化、グループ化クエリアテンション、キー・バリューキャッシュ、バイトペアエンコーディング、大規模言語モデル（群）、Mixture-of-Experts、多層パーセプトロン、および文脈自由文法</li>
<li>HC、SOINN、WNN、DWN: 階層文脈自己組織化増分ニューラルネットワーク、重みなしニューラルネットワーク、および微分可能重みなしニューラルネットワーク</li>
<li>JEPA、EBRM、ACI、OOD、AUROC、AUC、MSP、MC: Joint-Embedding Predictive Architecture、エネルギーベース推論モデル、適応型コンフォーマル推論、分布外、受信者動作特性曲線下面積、最大ソフトマックス確率、およびモンテカルロ</li>
<li>PLD、REST、EAGLE、LFM2、LFM3、HF: Prompt Lookup Decoding、検索ベース投機的デコーディング、Greater Language-model Efficiencyのための外挿アルゴリズム、Liquid Foundation Model 2.5（LFM2.5-350MおよびLFM2.5-8B-A1B）、Liquid Foundation Model 3（2026年10月LiquidAI/LFM3-1.7B）、およびHuggingFace</li>
<li>SVD、ITQ、SVID、QAT、PTQ、PPL、SNR: 特異値分解、Iterative Quantization Procrustes超立方体回転、符号値独立分解、量子化認識訓練、訓練後量子化、perplexity、および信号対雑音比</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, RSS, GGUF, IO, KB, MB, GB, GiB: Non-Volatile Memory Express (NVMe) ストレージ、Darwin の F_NOCACHE バッファなしファイルフラグ (NOCACHE)、Portable Operating System Interface (POSIX)、ランダムアクセスメモリ (RAM)、ダイナミック RAM (DRAM)、スタティック RAM (SRAM)、物理ユニファイドメモリ内の常駐セットサイズ (RSS)、GPT-Generated Unified Format 量子化モデルファイル (GGUF)、入出力 (IO)、キロバイト (KB)、メガバイト (MB)、ギガバイト (GB)、およびギビバイト (GiB)</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, MACs, SIMD, AD, FD, BPB, BF16, FP16, FP32, INT4, ULP, MSL, MPS, CUDA, ROC, SPIR, PTX, HIP, LLVM: 浮動小数点演算, 百万FLOPs, 乗算累積演算, 単一命令複数データ, 自動微分, 有限差分, バイトあたりビット数, ブレインフロート16, 16/32ビットIEEE浮動小数点, 4ビット整数, 最終桁単位, Apple Metal Shading Language, PyTorch Metal Performance Shaders, NVIDIA Compute Unified Device Architecture, AMD ROCm ランタイム, Standard Portable Intermediate Representation (Vulkan SPIR-V), Parallel Thread Execution, Heterogeneous-Compute Interface for Portability, および Low Level Virtual Machine コンパイラバックエンド</li>
<li>RCE, WCA, VC, BCB, SWE, OSA, DP: Reality Code Engine [same house]、Wise Computer Automation [same house]、検証済み完了、BigCodeBench v0.1.3 ベンチマーク、ソフトウェア工学ベンチマークの接頭辞、最適文字列アラインメント、および動的計画法</li>
<li>CLI, HTTP, GET, POST, SSE, API, MCP, RPC, IDE, SDK, CORS, URL, ORM, IDNA, CADE, LNCS, NVIDIA, ACL, ICML, ICLR, EMNLP, NAACL, CVPR, ICPE, ISSCC, JSAC, JASA, ACM, OS, CPU, GPU, SW, TDP: コマンドラインインタフェース, Hypertext Transfer ProtocolおよびそのGET/POST要求メソッド, Server-Sent Events, アプリケーションプログラミングインタフェース, Model Context Protocol, リモートプロシージャコール(JSON-RPC 2.0), 統合開発環境, ソフトウェア開発キット, クロスオリジンリソース共有, Uniform Resource Locator, オブジェクト関係マッパ, アプリケーションにおける国際化ドメイン名, Conference on Automated Deduction, Lecture Notes in Computer Science, NVIDIA Corporation, 学術計算機科学・工学会場, オペレーティングシステム, 中央・グラフィックス処理装置, ソフトウェア, および熱設計電力</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CRC, ATM, RFC, SQL, DWARF, SLEB, CAM, XOR, XNOR, JWT, HMAC, DAG, CIDR, LRU, TTL, WAL, ETL: 仮想ローカルエリアネットワーク(IEEE 802.1Q), Transport Layer Security, ディープパケットインスペクション, 抽象構文木, JavaScript Object Notation, カンマ区切り値, Secure Hash Algorithm, 巡回冗長検査, Asynchronous Transfer Mode(CRC-8/ATM), Request for Comments, Structured Query Language, DWARF符号付きリトルエンディアンベース128符号化, 内容アドレス可能メモリ, 排他的論理和, 排他的NOR, JSON Web Token, ハッシュベースメッセージ認証コード, 有向非巡回グラフ, クラスレス域間ルーティング, 最近最少使用キャッシュ, 存続時間有効期限, 先行書き込みログ, および抽出変換ロードパイプライン</li>
<li>JTAG, XSDB, DAP, USB, FTDI, FT2232C, UART, FIFO, IC, EDA, OOC, AMBA, AXI4, IOB, IBUF, OBUF, FDRE, FDSE, LUT1, LUT2, LUT3, LUT4, LUT5, MUXF7, MUXF8, CARRY4, CARRY8, DSP48E2, URAM288, VCCINT, DS925, VCD, SDP, CE, ENARDEN, XPE, CLAI, AMD: Joint Test Action Group デバッグポート、Xilinx Software Command-Line Tool デバッガ、Debug Access Port、Universal Serial Bus、Future Technology Devices International およびその FT2232C デュアル UART/FIFO ブリッジ IC、ユニバーサル非同期受信機-送信機、ファーストイン・ファーストアウトバッファ、集積回路、電子設計自動化、アウト・オブ・コンテキスト合成モード、Advanced Microcontroller Bus Architecture、AXI4-Lite/AXI4-Stream インターコネクト、入出力ブロック、入出力バッファ、同期リセット/セット D フリップフロップ、UltraScale+ 1-5 入力ルックアップテーブル、UltraScale+ 7/8 入力マルチプレクサ、4/8 ビット高速キャリーチェーン、UltraScale+ DSP スライス、288 Kbit UltraRAM、内部コア供給レール (0.72 V on -2LV)、AMD Zynq UltraScale+ DC/AC スイッチング特性データシート DS925、Value Change Dump 波形トレース、シンプルデュアルポートブロック RAM モード、同期クロックイネーブル、RAMB36E2 ポート A 読み出し/クロックイネーブルピン、Xilinx Power Estimator、サブシステムレジスタマジック識別子 ("CLAI")、および Advanced Micro Devices</li>
<li>CVE, CWE, FRO, GMP, RAG, WHNF, ZFC, CIC, FFI: 共通脆弱性識別子 (Common Vulnerabilities and Exposures)、共通脆弱性タイプ一覧 (Common Weakness Enumeration)、Lean Focused Research Organization、GNU 多倍長演算ライブラリ (GNU Multiple Precision Arithmetic Library)、検索拡張生成 (Retrieval-Augmented Generation)、弱頭部正規形、選択公理付きツェルメロ-フレンケル集合論、帰納的構成計算 (Calculus of Inductive Constructions)、および外部関数インタフェース</li>
<li>ABBA, AGX, AI, DC, FWHT, INA238, INA3221, MSS, NT, PPT, RDNA, RPL, RTX, RUSAGE_INFO_V6, TI, VDD, VDD_CPU_SOC_MSS, VDD_GPU, VIN, XNU: カウンタバランス型 A-B-B-A 試行順序、Autonomous-Grade Compute モジュール群、人工知能、直流、高速ウォルシュ・アダマール変換、Texas Instruments インライン電力モニタ（基板全体 VIN 用 INA238 および 3 チャネル INA3221 レール）、メモリサブシステム、Windows NT カーネル群、Package Power Tracking、Radeon DNA グラフィックスアーキテクチャ、Raptor Lake モバイルプラットフォーム、Ray Tracing Texel eXtreme、Darwin Resource Usage Info v6 構造体、Texas Instruments、ドレイン供給電源レール、Tegra CPU/SoC/メモリ電源レール、Tegra GPU 電源レール、基板電圧入力レール、および Darwin X is Not Unix カーネル</li>
<li>ABI, AC, ADC, AE3, A2B, CRC32, CYCCNT, DTCM, DWT, E3, E4, E4B, ELF, ELFs, FCCM, FSM, GPT, INT8, ISVLSI, LSB, M0, M55, MCU, MRAM, PALUTE, PIO, Q4, ROM, RP2040, SHA256, SPI, ST, XL: アプリケーションバイナリインタフェース、非定数交流フーリエエネルギー、アナログ-デジタル変換器、Alif Ensemble E3 OpenMV-AE3 マイクロコントローラボード、活性 20 億パラメータ疎アーキテクチャ接尾辞、32 ビット IEEE 巡回冗長検査、Arm Data Watchpoint and Trace サイクルカウンタレジスタ、データ密結合メモリ、Data Watchpoint and Trace ユニット、Alif Ensemble E3/E4 マイクロコントローラシリーズ、実効 40 億エッジパラメータ接尾辞、Executable and Linkable Format ファームウェア像、Field-Programmable Custom Computing Machines シンポジウム、有限状態機械、Generative Pre-trained Transformer（正規化 nGPT）、8 ビット整数量子化、International Symposium on VLSI、最下位ビット、Arm Cortex-M0+ および Cortex-M55 マイクロコントローラコア、マイクロコントローラユニット、磁気抵抗不揮発性 RAM、Processing-In-Memory Acceleration via Lookup Table、プログラマブル入出力ペリフェラル、4 ビット量子化ブロック形式（Q4_K_XL）、読み出し専用メモリ、Raspberry Pi デュアル Cortex-M0+ マイクロコントローラ、256 ビット Secure Hash Algorithm、Serial Peripheral Interface バス、Straight-Through 推定器、および特大サイズ量子化ブロック接尾辞</li>
<li>BAR0, BGA, BLE, CEM, CMOS, CSR, DDR3, DS181, DSP48E1, ECC, FBG484, FPC, GPIO, GTP, HAT, HPL, I2C, JEDEC, LFM, M4F, MIG, ODT, PCIe, PHY, QCM6490, QFAA, RAMB36E1, RISC, RV32IMAC, SSTL15, SYSMON, UG475, XADC, XC7A200T, XCK26, XCZU9EG, ZCU102: PCIe ベースアドレスレジスタ 0、ボールグリッドアレイ、Bluetooth Low Energy、Card Electromechanical PCIe スロット仕様、相補型金属酸化膜半導体、制御・状態レジスタ、DDR3 同期 DRAM、AMD Artix-7 FPGA DC/AC スイッチング特性データシート DS181、Xilinx 7-Series デジタル信号処理スライス、誤り訂正符号、484 ボール 23x23 mm リッドレス・フリップチップ BGA パッケージ、フレキシブルプリント基板リボン、汎用入出力、Artix-7 マルチギガビットシリアルトランシーバ、Hardware Attached on Top 40 ピン拡張ヘッダ、TSMC 28 nm High-Performance Low-Power プロセス、Inter-Integrated Circuit バス、JEDEC 熱試験基板規格、毎分リニアフィート風速単位、Arm Cortex-M4F マイクロコントローラコア、Xilinx 7-Series Memory Interface Generator、オンダイ終端、Peripheral Component Interconnect Express、物理メモリインタフェース層、Particle Tachyon 上の Qualcomm Dragonwing SoC、Nordic 48 ピン QFN nRF52832 パッケージ接尾辞、Xilinx 7-Series 36 Kbit デュアルポート Block RAM 原始子（XC7A200T に 365 個）、縮小命令セットコンピュータ、32 ビット RISC-V 整数/乗算/アトミック/圧縮命令セット、Stub Series Terminated Logic 1.5 V I/O 規格、Xilinx System Monitor 温度・電圧監視ブロック、AMD 7-Series FPGA パッケージ・ピン配置仕様書 UG475、Xilinx 7-Series デュアル 12 ビット ADC、AMD Artix-7 200T FPGA（Numato Aller A7 M.2 2280）、AMD Kria K26 SOM FPGA、AMD Zynq UltraScale+ MPSoC FPGA、および AMD ZCU102 評価ボード</li>
<li>SIW: ランドマーク誘導型直列化反復幅探索 (Serialized Iterated Width)</li>
<li>NVRTC, PLE, RADV, VRAM: NVIDIA 実行時コンパイルライブラリ、層ごとの条件付き埋め込みメモリ、Mesa Radeon Vulkan ドライバ、およびビデオランダムアクセスメモリ</li>
</ul>

本研究では、以下のすべての表にわたって5つの根拠クラスを相互に分離して扱う。

| 根拠ラベル | 本研究における意味 |
| :--- | :--- |
| **`Physical DC Shunt (measured_j)`** | `NVIDIA Jetson AGX Thor` 上のインライン直流シャント実測値（`主張 LA-24 および LA-28` のみ、`board_metered = true`）：Texas Instruments `INA3221` チャネル 2 `VDD_CPU_SOC_MSS`（`L2`、`VDD_GPU` から物理的に分離）および `INA238` 基板全体 `VIN`（`L1`）を、カウンタバランス型 `ABBA` 窓にわたり `500 Hz` で台形積分した値。`reported_j` や `est_j` と合算することは決してなく、Thor 以外のすべての行では未設定（`None`）とする。 |
| **`Measured (SW / NVMe I/O / OS PMU)`** | Darwin `F_NOCACHE` 下の `os.pread` により読み書きされた正確なバイト数、常駐メモリ割り当て、実時間（wall-clock）秒数、Apple M5 Max 上の機体全体の macOS `PMU`（`AppleSmartBattery.PowerTelemetryData`）累積エネルギー差分、および正確なビット/トークン一致。 |
| **`Reported (OS / On-Chip Counter, reported_j)`** | 非特権のオペレーティングシステムおよびオンチップのテレメトリカウンタ（`board_metered = false`）：Apple M5 Max および M3 Ultra では `libIOReport.dylib` `'GPU Energy'`（`L2` `nJ`）と `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（`L3` CPU `nJ`）；`x86-64` Linux では `RAPL`（`package-0` / `core`）、`amdgpu` `PPT`、および `NVML` `mJ`；Windows 11 では `NVML` `mJ`。`measured_j` と統合されることは決してない。 |
| **`Simulated (RTL)`** | Yosys `0.71+`（Kria KV260 `xck26` 向け `synth_xilinx -family xcup` および Artix-7 `XC7A200T` 向け `-family xc7`）による構造的ネットリスト数と、Verilator `5.054` によるサイクル数（`CPI = 1`）。Vivado のタイミングクロージャではなく、物理的な基板電力でもない（すべての `xck26` および `XC7A200T` 行で `measured_j = None`）。 |
| **`Estimated (est_j)`** | 演算数、熱設計電力の時間代理値（`joule_meter.py`）、あるいは Verilator VCD のトグル率スイッチング活動と AMD `DS925` `xck26-2LV`（`0.72 V`）`RAMB36E2`（§4.22、§4.25）および AMD `DS181` / `UG475` `XC7A200T-2FBG484C`（`1.00 V`）`RAMB36E1` の容量・熱抵抗モデル（§4.32）を組み合わせて算出した解析的ジュールおよび電気・熱境界。同一の式内にある比較群同士にのみ用い、実シリコンのワット数としては扱わない。 |

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
2. **非ブロッキング $512 \times 512$ Beneš-Copy-Beneš、`81`-`RAMB36E2` ページキャッシュ、および `4` 段 `250 MHz` パイプライン化 `P4-AXIS` RTL サブシステム**: 平坦クロスバーの `102.0%` Kria KV260 ロジックオーバーフロー (`119,478` LUTs) およびフリップフロップページ多重化器の `926,619`-LUT 爆発の両方を排除する (`1` サイクル OOC において `41,186` UltraScale+ CLB LUTs = `xck26` の `35.2%`、`81` `RAMB36E2` ブロック = `56.2%`、`0` `DSP48` スライス)。さらに `4` 段パイプライン化された IOB セーフな `AXI4-Stream` ラッパ (`clai_benes_axi_stream_250mhz_top`) は単一サイクル同期論理深さを `52` 段から **`13` 段へと `4.00×` 削減**し、**`170 <= 189` 個の `xck26` `IOB`** に収まり (`41,459` LUTs = `35.40%`)、Verilator ストリーミング一致検査で **`256 / 256` ゼロバブル `CPI = 1.00`** に合格する。
3. **普遍的 $\le 64$-bit ジョイントモード最小項合成**: ジョイントモード最小項ルックアップが相関分岐上の周辺ビットプレーン DiffLogic 丸めを支配し、$K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ 副単語トークンを 1 つの `uint64` ワードにパックする (`16b × 4 = 64b` for `|V| = 65,536`; `17b × 3 = 51b` for `|V| = 128,000`; `18b × 3 = 54b` for `|V| = 248,320`)。
4. **オラクルフリー Split-Conformal + Online ACI 結晶化ゲート**: 放射状正則化された潜在 `JEPA-EBRM` 非適合性スコアを Split Conformal 較正および Adaptive Conformal Inference (Gibbs and Candès, 2021) と組み合わせ、ソフトマックスおよび MC-Dropout ベースラインが `17.62%-24.28%` の偽リスクを記録したシフト交通において `0.00%` の偽結晶化リスクおよび `1.0000` OOD AUROC を記録する。
5. **カスタム Apple Metal およびクロスプラットフォーム Rust `CubeCL` `INT4` Sparse-MoE / `GatedDeltaNet` シェーダ + 最大 `34.66B` の `AirMoL` / `Expert-AirMoL`**: Darwin `F_NOCACHE` `os.pread` 4 ビットシャーディング、カスタム `MSL` (`43.45×` MoE、`20.66×` `GatedDeltaNet`) およびポータブルな Rust `Burn 0.22.1 / CubeCL` (`35.09×` Metal / `2.67×` `LLVM` `CPU` MoE、`69.20×` Metal / `14.87×` `LLVM` `CPU` `GatedDeltaNet`) コンピュートシェーダ、Queue-Depth-`8` 並列 `pread`、ならびに `BenesLUT6` バースト投機を組み合わせ、2026 年 10 月の `LiquidAI/LFM3-1.7B` (`3.79%` FP32 RAM における `2.74×` NVMe 削減)、`LiquidAI/LFM2.5-8B-A1B` (`500.0 MB` RAM、`3.493 J/tok` `reported_j`)、および `Qwen/Qwen3.6-35B-A3B` (`34.66B`; **`12.30×` NVMe 削減**、**`970.0 MB` RAM = FP16 の `1.47%`**、**`6.773 J/tok` `reported_j`**、**`15.7 tok/s`** ユニファイドメモリ `Q4`) にわたり `100.0%` の厳密トークン一致を達成する。
6. **ゼロ MAC `Sub1Bit-LUT6` 対 `LittleBit`、`91.67%` `Rung 3d` `<think>` 上限、`MCP` 経由の公式 `BigCodeBench v0.1.3` + 上流 `SWE-bench Verified`、および OpenAI / `MCP` `mol-agent`**: `LittleBit-1 / LittleBit-2` (`0.576` ビット/重み; Lee et al., 2025; Lee and Kim, 2026) の `1.98M` ランタイムバイナリ MAC をゼロ MAC `6` 入力 `LUT6` 部分和ルックアップ (`< 4 × 10⁻⁶` 誤差、`MoL` ターゲット検証下で `0` QAT エポックにて `100.0%` 一致) で置き換え、有界オープンウェイト `Rung 3d` `<think>` によって 2026 年後期の `48` タスク・コーディングベイクオフを `87.50%` から **`91.67%` (`44 / 48`; Wave 2 および Wave 3 では `93.75%`)** へ引き上げ、公式 `BigCodeBench v0.1.3` で **`90.62%` (`29 / 32`、Wave 2 では `93.75%`)** (単独 `35B` の `78.12%` に対比)、上流 `SWE-bench Verified` `sympy/sympy` git worktree で **`50.00%` (`8 / 16`)** (`35B` の `25.00%` に対比) に達し (**破損コミットの受理は `0.00%`**)、永続的な `.mol/` スキルを OpenAI `/v1/chat/completions` および `MCP` (`JSON-RPC 2.0`) 上で提供する。
7. **6カーネル・パラノイド Lean `4.36.0` 形式化（`CVE-2026-72844` 対策強化済み、`36` 定理）、`4` リポジトリ `SWE-bench Verified` コールグラフ局所化、実測 `120B` ハイブリッド MoE 頂点カスケード、`CE` ゲート付き `VCD` 電力、および単一バイナリ Rust `mol-agent-rs`（`主張 LA-19` から `LA-23`）**: `Cascade`、`BenesCopy`、`JointMinterm`、`ConformalProvenance`、`NucleusCodon` にわたる**全 `36` 定理**を**6つの独立した証明チェッカー**（`con-leche --verified` [`58,729` 宣言]、`con-ron --verified` [`58,729` 宣言]、`lean4lean` [`58,731` 宣言]、`nanoda`、`leanchecker --paranoid`、および Lean `4.36.0`; `0` `sorry`、`0` カスタム公理、`0` `Lean.ofReduceBool`; Moura and Ullrich, 2021）で検査し、リークゼロの `SWE-bench Verified` 評価を**上流 `4` リポジトリ（`django`、`pytest`、`requests`、`sympy`、`24` 評価）** へ拡張して**全体 `20.83%` / Wave 2 `25.00%`（単独 `24B` および `35B` の `2.50×`）** を破損パッチ `0.00%` で達成し、**`120B` 規模の `nvidia/Nemotron-3-Super-120B-A12B`**（`58,075.4 MB` `RSS`、**`22.17 tok/s`**、単独 `120B-A12B` の `43.75%` および `Devstral-Small-2-24B` の `31.25%` に対し**検証済み合格率 `62.50%`**）を実測し、`ENARDEN` + 有効バブル `CE` ゲーティングにより `P4-AXIS` `250 MHz` アイドル動的電力を **`4.10×`**（`63.99` から **`15.59 est_mW`**）削減し、Python 非依存の単一バイナリ Rust `mol-agent-rs`（`0.1540 ms/req` `MCP`、Python `mol-agent` より **`17.21×` 高速**、`pytest` テスト `44 / 44` 件合格）を提供する。
8. **`4` 種のベアメタル `MCU`（`64 KB` `nRF52832` および `RV32IMAC`）にわたる `4 KB` `#![no_std]` Rust `1.100.0` `lut6-core` ブートストラップ Nucleus、閉形式 `DiffLUT-Net`（`arXiv:2609.09254`）`-64.06%` 枝刈り、実機 `Alif E3` + `Thor` シャント計測、2026年10-11月ループ型モデル、および Xilinx 7-Series `XC7A200T` M.2 `2280` ゲートウェア移植（`主張 LA-26` から `LA-30`）**: 正確に `4,096 B` の `CompactLut6Page` と 64 コドン Operon `ABI` を `7` つのベアメタルおよびホストターゲット（`Alif E3/E4` Cortex-`M55`、`RP2040` Cortex-`M0`+、`Nordic nRF52832` Cortex-`M4F`［`64 KB` `SRAM` の `25.06%`、空き `49,112 B`］、`RV32IMAC`［`64 KB` `SRAM` の `25.06%`；Yosys `abc -lut 6` ブールマイタ `64/64` ベクトル］の浮動小数点命令ゼロ `ELFs` を含む）へクロスコンパイルし、2 ビットゆらぎ `LUT6` 上の次数 `>=5` ウォルシュ・アダマール雑音が普遍的に `0` であることを証明し（`NucleusCodon.lean`）、活性 `LUT6` ゲートを **`64.06%`** 削減（`64` から `23`、**雑音付き起動の抑制 `95.00%`、サイレント破損 `0.00%`、`OOD` 棄権 `100.00%`**）し、`Jetson AGX Thor` の `DC` シャント上で **`125.23 nJ/op`（`INT8` Micro-`MLP` 比 `87.00×` の物理 `CpJ`）** および実機接続された `OpenMV-AE3` Cortex-`M55` 上で **`12.18` `DWT` サイクル（`38.1 ns`、`1,943.49×` 少ないサイクル数）** を記録し、`thinkingmachines/Inkling-2-Mini`（`3.52×` 高速化、`reported_j` `4.29×` 削減）、`Nemotron-Labs-Dory1.0-4B`（`3.95×` 高速化）、`LiquidAI/LFM2.5-24B-A2B`、`NVIDIA-Nemotron-3.5-Bolt-E4B` を貪欲一致 `100.0%` で評価し、さらに Beneš + `CompactLut6Page` サブシステム全体を **Artix-7 `XC7A200T-2FBG484C`（Numato Aller A7 M.2 `2280`）** へ移植する（`xc7` LUT `62,211` 個 = `46.22%`、`RAMB36E1` `83` 個、`365` 結晶 `1.46 MB` オンダイ保管庫、`DSP48E1` `0` 個、**`KV260` とのビット完全一致 `10,500 / 10,500`**、`DDR3` を `CMOS` リセット保持した状態で **M.2 `3.3V` `0.86 est_W` @ `55.2 est_C`**）。

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

図 5 は、計算機知能の 9 段能力ラチェット（姉妹研究：[コミュニケーションツール アバランシェ](/papers/communication-avalanche/) `[same house]`）の中に下方コンパイルを位置づける。第 1 段から第 5 段、すなわち **(1) 検索** (`RAG`)、**(2) 生成**、**(3) 推論** (`<think>`)、**(4) 通信** (`MCP` 委譲)、および **(5) ツール使用** は、定常ホライズンが $\Delta T \approx 1 \le \Delta T^*$ にとどまり単独の `1` ショットモデルが `56.25%-95.83%` の破損パッチを通過させてしまう一時的なコールドスタート `MAC` 推論の下で停滞する（`主張 LA-20` および `LA-21`）。命題 1 の**コンパイル閾値**（$C(z) = 1$、破損コミット受理 `0.00%` の下での $\Delta T > \Delta T^* = E_{\text{compile}} / (p_0' c_{\text{wake}} - c_0)$）を越えることで、**(6) 没入**（永続的なローカル状態が $\Delta T \gg \Delta T^*$ へと引き伸ばす）、**(7) 熟達**（`CE` ゲート付き `xck26` `LUT6` RTL における `62.4 pJ/cycle` `est_j` および Rust `mol-agent-rs` `MCP` における `272 µJ/req` `reported_j` で $p_0' \to 1$ へ収束）、**(8) エコロジー**（エッジネイティブな Rust エージェント集団）、および **(9) エコノミー**（Simon-Kadane の $p_i / c_i$ と階層別ジュール・レシートにより秩序付けられた分業）が解放される。

![図 5. 計算機知能の 9 段アバランシェ・ラチェットとコンパイル閾値。](/figures/lut-adapt/avalanche-compilation-threshold.svg)

*図 5. 9 段能力ラチェットと命題 1 のコンパイル閾値 ($\Delta T > \Delta T^*$) であり、12 桁のスケールにわたり `reported_j` (Apple M5 Max) と `est_j` (`AMD DS925` `VCD`) を分離して示す (`measured_j = None`、`board_metered = false`)。[PNG](/figures/lut-adapt/avalanche-compilation-threshold.png) · [対話型エクスプローラ](/living/lut-adapt/#la-diag-03).*

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

`src/clai/service/openai_mcp_agent.py` と `scripts/mol_agent_server.py`（`mol-agent` CLI エントリポイント）は、第三者 Web 依存をゼロに保ったまま、カスケードを `IDE` およびターミナル型コーディングツール（`Cursor`、`Continue.dev`、`Claude Code`、`Antigravity`、OpenAI `SDK`）に公開する。公開される機能は次の二系統である。(i) OpenAI 互換の `GET /v1/models` と `POST /v1/chat/completions`。ここでは `stream: true/false` の `SSE`、CORS ヘッダ、任意指定の決定論的検証器 `x_mol_contract`、および階級（rung）、`skill_id`、`est_j`、`reported_j`、`measured_j: null` を報告する `x_mol_receipt` を備える。(ii) Model Context Protocol（`--mcp-stdio` 経由および `POST /mcp` による `MCP` `JSON-RPC 2.0`）。これは `mol_synthesize_verified_function`、`mol_repair_repo_pytest`、`mol_lookup_crystallized_skill`、`mol_energy_telemetry` の四つのツールを公開し、永続化された `.mol/skills_v1.json` と `.mol/benes_lut6_router.npz` によって支えられる。`pytest` の全 `30 / 30` 件のテストが合格している。

<div id="415-claim-la-15-official-bigcodebench-v013-32-evaluations-and-upstream-swe-bench-verified-sympy-git-worktree-16-evaluations-benchmarks-via-mcp-json-rpc-20" class="anchor-alias" aria-hidden="true"></div>

### 4.15 主張 LA-15：`MCP` `JSON-RPC 2.0` 経由の公式 `BigCodeBench v0.1.3`（`32` 評価）および上流 `SWE-bench Verified` `SymPy` git-worktree（`16` 評価）ベンチマーク

`src/clai/frontier/external_public_benchmarks.py` および `scripts/run_external_public_benchmarks.py`（`artifacts/external_public_bcb_swebench.csv`、`artifacts/external_public_bcb_swebench_traces.json`）は、読み込み時に `SHA`-256 で検証された2つの公式公開 HuggingFace Parquet ベンチマーク（`bigcode/bigcodebench` `v0.1.3`：`ed5a3a39...`、`16` タスク × 人手作成プロンプト `2` ウェーブ［Wave 1 の `complete_prompt` + Wave 2 の `instruct_prompt`］ = `32` 件の `unittest` 評価；および `princeton-nlp/SWE-bench_Verified`：`a45b1fe4...`、実際の `sympy/sympy` `1.11-1.12` git-worktree チェックアウト `8` 件 × `2` ウェーブ = `FAIL_TO_PASS + PASS_TO_PASS` にわたる `16` 件の `pytest` 評価）において、正解コードのリークが厳密にゼロの条件（macOS `PMU` 差分 `59,250.43 J`）の下で、`MoL` `MCP` エージェント（`handle_mcp_jsonrpc` + `.mol/` 結晶化）を単独の `LiquidAI/LFM3-1.7B`、`google/gemma-4-E2B-it`、および Metal 高速化された `Qwen/Qwen3.6-35B-A3B` と直接比較評価する：

| 公式公開ベンチマークとアーム | W1 コールド | W2 言い換え / バックポート | 全体検証済み合格率 | 破損受理 | W2 `.mol/` 高速パス | `35B` 呼び出し | 平均 W1 / W2 (`ms`) | `reported_j` / 解決 (`est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `BCB v0.1.3` (`32`) · `A` `LiquidAI/LFM3-1.7B` | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `0.00%` | `5,471` / `5,716` | `169.67 J` (`409.11 est_j`) |
| `BCB v0.1.3` (`32`) · `B` `google/gemma-4-E2B-it` | `31.25%` | `43.75%` | `37.50%` | `62.50%` | `0.00%` | `0.00%` | `12,187` / `9,791` | `190.91 J` (`1,230.76 est_j`) |
| `BCB v0.1.3` (`32`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `75.00%` | `81.25%` | `78.12%` | `21.88%` | `0.00%` | `100.00%` | `28,365` / `10,926` | `277.45 J` (`2,388.89 est_j`) |
| **`BCB v0.1.3` (`32`) · `D` `MoL` `MCP` Agent (参照)** | **`87.50%`** | **`93.75%`** | **`90.62%`** | **`0.00%`** | **`81.25%`** | **`25.00%`** | **`47,321` / `6,001`** | **`263.54 J` (`1,917.44 est_j`)** |
| `SWE-bench Verified` `SymPy` (`16`) · `A` `LiquidAI/LFM3-1.7B` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `5,449` / `5,486` | `869.84 J` (`2,799.45 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `B` `google/gemma-4-E2B-it` | `0.00%` | `0.00%` | `0.00%` | `100.00%` | `0.00%` | `0.00%` | `8,304` / `5,040` | `1,015.22 J` (`4,483.82 est_j`) |
| `SWE-bench Verified` `SymPy` (`16`) · `C` `Qwen/Qwen3.6-35B-A3B` Metal | `25.00%` | `25.00%` | `25.00%` | `75.00%` | `0.00%` | `100.00%` | `18,384` / `19,898` | `1,280.08 J` (`7,273.48 est_j`) |
| **`SWE-bench Verified` `SymPy` (`16`) · `D` `MoL` `MCP` Agent (参照)** | **`50.00%`** | **`50.00%`** | **`50.00%`** | **`0.00%`** | **`50.00%`** | **`68.75%`** | **`131,976` / `17,215`** | **`6,130.89 J` (`0.33-0.44 J` W2 `.mol/`)** |

`BigCodeBench v0.1.3`（Zhuo et al., 2024）において、`MoL` `MCP` エージェントは単独の `Qwen3.6-35B-A3B` を **`+12.50` パーセントポイント上回り（`90.62%` 対 `78.12%`、人手言い換えの `instruct_prompt` Wave 2 では `93.75%`［`15/16`］に到達）**、しかも `35B` の呼び出しをタスクの `25.00%` のみに抑え、Wave 2 の平均レイテンシを **`7.89×` 削減**し（`47,321` から `6,001 ms`；`.mol/` ヒット `13` 件中 `12` 件では `63-146 ms` かつ `0.09-0.13 J` `reported_j`）、破損出力の受理を `0.00%` に保ちつつ**検証済み解決あたりの消費 `reported_j` も削減する（`263.54 J` 対 `277.45 J`）**。上流 `SWE-bench Verified`（Jimenez et al., 2024）では、リークゼロの `AST` およびスタックフレーム局所化が `patch` を一切読まずに `sympy/sympy` 内の対象ファイル全 `8 / 8` 件を特定し、`MoL` は検証済み解決率を倍増させ（**`35B` の `25.00%`［`2/8`］および `LFM3`/`Gemma4` の `0.00%` に対し `50.00%`［`4/8`：`sympy-23534`、`23950`、`24066`、`24213`］**）、結晶化された `4` 件すべての統合 `git diff` スキルを Wave 2 において **`1,590-1,720 ms`（新規 `git worktree` チェックアウト + `pytest` を含め `0.33-0.44 J` `reported_j`）** で再生し、未解決の複数ハンク代数課題 `4` 件では安全に棄権する（`VERIFIER_ABSTAIN_SAFE`、破損パッチの受理 `0.00%`）。

<div id="416-claim-la-16-4-stage-250-mhz-pipelined-kria-kv260-xck26-benešcopybeneš--81-ramb36e2-rtl-subsystem-400-logic-depth-reduction" class="anchor-alias" aria-hidden="true"></div>

### 4.16 主張 LA-16：`4` 段 `250 MHz` パイプライン化 Kria KV260（`xck26`）Beneš-Copy-Beneš + `81-RAMB36E2` RTL サブシステム（論理深さ `4.00×` 削減）

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv` および `scripts/verify_pipelined_250mhz_rtl.py`（`artifacts/kv260_pipelined_250mhz_rtl.csv`、`artifacts/kv260_pipelined_250mhz_meta.json`）は、`Beneš-1`（`9` ステージ）、`Copy + Beneš-2[0..3]` + 並列 `RAMB36E2` タグ/ページ読み出し、`Beneš-2[4..8]`、および `80 × LUT6` + `16` ビット折り返しポップカウント投票器の間に3つの同期パイプラインレジスタ壁を挿入し、`IOB` セーフな `64` ビット `AXI4-Stream` シェル（`clai_benes_axi_stream_250mhz_top`）で包むことにより、非パイプライン監査（§4.24-§4.25）で特定された2つの物理設計制約の双方を解決する：

| KV260 (`xck26-sfvc784-2LV-c`) RTL バリアント | 段数 (`CPI`) | 同期レジスタ間深さ | トップ `IOB` (`<= 189`) | `xcup` CLB LUT (`%`) | `xcup` FF (`%`) | `RAMB36E2` (`%`) | `DSP48E2` | Verilator ストリーム一致率 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `U1` `clai_benes_paged_hotswap_core` (`1`-cyc `OOC`) | `1` (`1.00`) | `52` 段 | `1,600` (`No`) | `41,186` (`35.17%`) | `36,464` (`15.57%`) | `81` (`56.25%`) | `0` | `100.0%` |
| `U2` `clai_kv260_axi_top` (非パイプライン `AXI4` Rung-0) | `1` (`1.00`) | `60` 段 | `127` (`Yes`) | `67,366` (`57.52%`) | `16,619` (`7.09%`) | `4` (`2.78%`) | `0` | `100.0%` |
| **`P4` `clai_benes_paged_pipelined_250mhz` (`OOC`)** | **`4` (`1.00`)** | **`13` 段 (`4.00×`)** | `1,600` (`OOC`) | **`41,439` (`35.38%`)** | **`47,922` (`20.46%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |
| **`P4-AXIS` `clai_benes_axi_stream_250mhz_top` (参照)** | **`5` (`1.00`)** | **`13` 段 (`4.62×`)** | **`170` (`Yes`)** | **`41,459` (`35.40%`)** | **`48,979` (`20.91%`)** | **`81` (`56.25%`)** | **`0`** | **`100.0%` (`256/256`)** |

平坦化された `synth_xilinx -family xcup` の同期境界（Yosys の `ltp -noff` がブラックボックス `FDRE` クロックピンを越えて走査してしまうマルチサイクル `CARRY4` テレメトリカウンタ連鎖を除外した、`FDRE`/`RAMB36E2`/`IBUF` から `FDRE`/`RAMB36E2`/`OBUF` までの経路）にわたるグラフ走査により、単一サイクルの組合せ深さがわずか `+253` CLB LUT（`xck26` の `+0.21%`）のコストで `52` 段（`U2` では `60` 段）から **`13` 段へと `4.00×` 低減**され、`xck26-sfvc784-2LV-c` のピン予算（**`170 <= 189` `IOB`**）に収まり、Verilator `5.054` において **`256 / 256` のゼロバブル連続ビート（`CPI = 1.00`、エラー `0`）** に合格することが確立される。

<div id="417-claim-la-17-bounded-open-weights-rung-3d-native-think-ceiling-9167-overall-9375-wave-2-and-wave-3-000-broken-commits" class="anchor-alias" aria-hidden="true"></div>

### 4.17 主張 LA-17：有界オープンウェイト `Rung 3d` ネイティブ `<think>` 上限（全体 `91.67%`、Wave 2 および Wave 3 で `93.75%`、破損コミット `0.00%`）

`scripts/run_rung3d_thinking_ceiling.py`（`artifacts/frontier_ai_rung3d_ceiling.csv`、`artifacts/frontier_ai_rung3d_ceiling_traces.json`）は、`48` タスク（`16` 仕様 × `3` ウェーブ）のエンジニアリング・ベイクオフにおいて `Rungs 0-3c` が棄権した残余タスクに対してのみ厳密に呼び出される、任意の **`Rung 3d` 有界オープンウェイト推論段**（ネイティブ `enable_thinking=True` を有効化した `Qwen/Qwen3.6-35B-A3B`、`<think>` トークン予算 `1,536-2,200`、`100%` Apache-2.0 ローカル重み、プロプライエタリなクラウド API ゼロ）を追加する：
- **`Arm H`（`MoL + Rung 3d Qwen3.6-35B-A3B <think>`）** は、検証済み合格率を `87.50%`（`Arm G`）から **W1 コールド `87.50%`、W2 適応 `93.75%`（`15 / 16`）、W3 ウォーム `93.75%`（`15 / 16`）、および全体 `91.67%`（`44 / 48`）** へと引き上げ（単独 `Qwen3.6-35B-A3B` の `77.08%` を **`+14.59` パーセントポイント**上回る）、一方で `35B` の呼び出しをタスクの `20.83%` に抑える（`Rung 3d` `<think>` が起動するのは **`5 / 48 = 10.42%`** のタスクのみ）。
- 具体的には、`Rung 3d` は `W2_11_F11_benes4_route` において `2,185` `<think>` トークンで検証済み `6` スイッチ Waksman `4×4` 置換ソルバを導出して `Skill#17` へコンパイルし、`W3_11` を `< 3.8 ms` で再生する（結晶化された Wave 3 解決全 `15` 件の平均 `reported_j` は `0.0351 J`）。他方、`F10_true_damerau`（`OSA` 対 無制限 Lowrance-Wagner アルファベット `DP` の事前分布衝突）は `VERIFIER_ABSTAIN_SAFE` を発動させる（破損コミットの受理 `0.00%`）。

<div id="418-claim-la-18-zero-python-cross-platform-rust-burn-0221--cubecl-fused-int4-sparse-moe--gateddeltanet-kernels" class="anchor-alias" aria-hidden="true"></div>

### 4.18 主張 LA-18：Python 非依存クロスプラットフォーム Rust `Burn 0.22.1 / CubeCL` 融合 `INT4` Sparse-MoE および `GatedDeltaNet` カーネル

`sys/rust/src/kernels/q4_moe_deltanet_cube.rs` および `sys/rust/src/bin/bench_cubecl_moe_deltanet.rs`（`artifacts/cubecl_cross_platform_moe_deltanet.csv`、`artifacts/cubecl_cross_platform_moe_deltanet_meta.json`）は、融合 `INT4` Block-64 Sparse-MoE（`q4_moe_gate_up_silu_cube_kernel` + `q4_moe_down_weighted_cube_kernel`、`FP16`/`FP32` エキスパート重みバッファを一切持たない `u32` 8 ニブルレジスタ展開）および `GatedDeltaNet`（`gated_delta_recurrent_k128_cube_kernel`）シェーダを、単一のコードベースから `Metal`、`Vulkan`（`SPIR`-V）、`CUDA`（`PTX`）、`ROC`m（`HIP`）、および `LLVM` `SIMD` `CPU` を対象とする純粋な Rust **`Burn 0.22.1 / CubeCL` `#[cube]` カーネル**へと移植する：

| ポータブル Rust `Burn 0.22.1 / CubeCL` カーネルと形状 | バックエンド対象 | 平均レイテンシ (`ms`) | ホスト `FP32` 比速度向上 | 最大絶対 `FP32` 誤差 | ポータブル・シェーダ対象 |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `Host_Scalar_FP32_Ref` | `27.2480 ms` | `1.00×` | `0.0` | Rust `std` |
| `q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`) | `CubeCL_LLVM_CPU` | `10.2213 ms` | **`2.67×`** | `1.49 × 10⁻⁷` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`q4_moe_gate_up_silu_down` (`D=2048, I=512, K=28, P=32`)** | **`CubeCL_Metal_GPU`** | **`0.7765 ms`** | **`35.09×`** | **`1.79 × 10⁻⁷`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `Host_Scalar_FP32_Ref` | `166.8918 ms` | `1.00×` | `0.0` | Rust `std` |
| `gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`) | `CubeCL_LLVM_CPU` | `11.2224 ms` | **`14.87×`** | `1.49 × 10⁻⁸` | `Metal+Vulkan+CUDA+ROCm+CPU` |
| **`gated_delta_recurrent_k128` (`B=1, Hk=16, Hv=32, T=256, K=V=128`)** | **`CubeCL_Metal_GPU`** | **`2.4118 ms`** | **`69.20×`** | **`2.24 × 10⁻⁸`** | **`Metal+Vulkan+CUDA+ROCm+CPU`** |

<div id="419-claim-la-19-six-kernel-paranoid-formal-proof-verification-of-section-2-and-nucleuscodon-36-theorems-66-independent-kernels-cve-2026-72844-hardened" class="anchor-alias" aria-hidden="true"></div>

### 4.19 主張 LA-19：第2節および `NucleusCodon` の6カーネル・パラノイド形式証明検証（`36` 定理、`6/6` 独立カーネル、`CVE-2026-72844` 対策強化済み）

2026年7月から11月にかけて開示された Lean 4 の健全性および `.olean` リプレイに関する脆弱性（人工知能支援によるコラッツ予想反証リポジトリを通じて公になり Lean `FRO` が `v4.32.2` で修正した、`<= v4.31.0` における入れ子帰納型の幽霊パラメータと `.proj` 構造体射影の型混同 `CWE-843` である `CVE-2026-72844`［`leanprover/lean4#14576`］、`add_opaque` における局所変数検査欠落の `CVE-2026-72711`［`leanprover/lean4#14484`］、`Kernel.Environment.replay` における偽造 `.inductInfo` のスキップ［`#16688`］、`.olean.server` サイドカー／リプレイの不整合［`#16674`、`#16675`］、および強化学習による `native_decide`［`Lean.ofReduceBool` `FFI`、`#16693`］バイパス）は、形式的保証を単一の C++ チェッカーやサンドボックス化されていない `.olean` リプレイのみに委ねるべきではないことを示した。`proofs/`（`LutAdapt/{Cascade,BenesCopy,JointMinterm,ConformalProvenance,NucleusCodon}.lean`）および `scripts/verify_lean_proofs.py`（`artifacts/lean4_formal_proofs_summary.csv`、`artifacts/lean4_six_kernel_paranoid_audit.csv`、`artifacts/lean4_formal_proofs_meta.json`）は、`sorry` ゼロ、カスタム `axiom` ゼロ、`opaque` ゼロ、入れ子帰納型ゼロ、および `Lean.ofReduceBool` ゼロを強制し、**Lean `4.36.0`** でクリーンにビルドしたうえで（`2,264.31 ms`、Darwin `reported_j` が `1.1787 J`）、Apple Silicon 上（`166,162.22 ms`、Darwin `reported_j` が `195.1361 J`）および非特権 Linux `bubblewrap 0.11.1`（`bwrap`）の読み取り専用・ネットワーク隔離名前空間内の双方において、**6つの独立したカーネルすべて**にわたり **`lake check --paranoid`** に合格する（図 6）：

| Lean `4.36.0` モジュール (`proofs/LutAdapt/`) | 検証済み定理数 | 数学的網羅範囲 | `sorry` / カスタム / `ofReduceBool` | 公理フットプリント (`#print axioms`) |
| :--- | :---: | :--- | :---: | :--- |
| **`Cascade.lean`** | `7` | Simon-Kadane 隣接・接頭辞交換 (`p₁/c₁ > p₂/c₂`)、命題 1 純節約と $\Delta T^*$ ホライズン、ゼロヒット・チャーン拒否 | `0` / `0` / `0` | 選択公理不使用 `3` (`propext`, `Quot.sound`); 標準 `ZFC` `4` |
| **`BenesCopy.lean`** | `7` | 定理 2 `512×512` Beneš-Copy-Beneš (`43` 段、`11,008` スイッチビット)、`4` 段 `<= 13` 段分割、互いに素なコピー区間、Lee 剰余無競合 | `0` / `0` / `0` | **純粋構成的 `2` (`0` 公理)**; 選択公理不使用 `5` |
| **`JointMinterm.lean`** | `7` | 命題 3 優越性、台内保証、`(40,35,25)` 周辺キメラ証人、`uint64` `BPE` バースト全単射 (`K=4` `LFM2`, `K=3` `LFM3`/`Qwen3.6`) | `0` / `0` / `0` | **純粋構成的 `1` (`0` 公理)**; 選択公理不使用 `6` |
| **`ConformalProvenance.lean`** | `6` | 結果 4 多様体外半直線棄権、有限標本コンフォーマル限界、`ACI` 均衡、来歴束 (`ModelGenerated ↛ Deterministic`)、貪欲投機的パリティ | `0` / `0` / `0` | **純粋構成的 `2` (`0` 公理)**; 選択公理不使用 `4` |
| **`NucleusCodon.lean`** | `9` | 4部構成 `LUT6` 資力審査の償却と高自由度拒否、ビット単位 `2:1` 外科的マルチプレクサとアンカー非退行、全 $2^{16}$ ゆらぎ `LUT6` における次数 `>=5` `FWHT` 雑音の普遍的 `0`、1-hot パーセバル $3844+63\times 4=4096$ (`28` `AC` 漏洩)、`0x3C` アポトーシス・ロールバック | `0` / `0` / `0` | **純粋構成的 `3` (`0` 公理)**; 選択公理不使用 `8`; `ZFC` `1` |
| **合計 (`LutAdapt.lean`、参照)** | **`36`** | **第2節の全 `4` 結果 + ゆらぎ / 資力審査 / 外科的オーバーレイ系** | **`0` / `0` / `0`** | **無公理 `8`; 選択公理不使用 `31/36`; `6/6` カーネル受理** |

| 独立証明チェッカー (`lake check --paranoid`) | 実装と健全性の根拠 | 検証済み宣言数 | 判定 | 緩和される脆弱性クラス |
| :--- | :--- | :---: | :---: | :--- |
| **`con-leche --verified`** | `ZFC` 集合論で無矛盾性が形式的に証明された最小参照カーネル（Breitner；`False` を受理し得ない） | `58,729` | **`Accepts`** | `CVE-2026-72844`（入れ子帰納型 `.proj`）、`CVE-2026-72711`（`add_opaque`）、`WHNF` キャッシュバグ |
| **`con-ron --verified`** | *Aeneas* により検証された `con-leche` の Rust 精緻化実装 | `58,729` | **`Accepts`** | `CVE-2026-72844`、`CVE-2026-72711`、C++ メモリおよび `GMP` 多倍長整数バグ（`#14833`） |
| **`lean4lean`** | 独立した Lean-in-Lean `CIC` 型チェッカー（Carneiro） | `58,731` | **`Accepts`** | C++ カーネル実装の乖離および射影型付け |
| **`nanoda`** | Lean ランタイム非依存のスタンドアロン Rust エクスポート検証器（`sorryAx` 遮断） | `58,731` | **`Accepts`** | `.olean` 直列化改ざんおよび不許可の `sorryAx` |
| **`leanchecker --paranoid`** | タクティクへの信頼ゼロの新規環境 C++ カーネルリプレイ | `58,731` | **`Accepts`** | メタプログラミングによる環境書換えおよび `debug.skipKernelTC` |
| **`Lean v4.36.0`（デフォルト）** | `CVE` 修正後の2026年11月版 C++ カーネル（`#print axioms` 強制） | `58,731` | **`Accepts`** | 2026年夏・秋の全 `CVE` 修正済み；`0` `Lean.ofReduceBool` |

![図 6. 6カーネル形式証明保証と3層コンパイル済みスタック。](/figures/lut-adapt/six-kernel-trust-and-stack.svg)

*図 6. 6カーネル・パラノイド形式証明監査 (`主張 LA-19`、左) と、`CE` ゲート付き `LUT6` RTL、`MoL` 下方コンパイル、および単一バイナリ Rust `MCP` ディスパッチにまたがる3層コンパイル済みスタック (`主張 LA-23`、右)。[PNG](/figures/lut-adapt/six-kernel-trust-and-stack.png) · [対話型エクスプローラ](/living/lut-adapt/#la-tab-01).*

<div id="420-claim-la-20-multi-repository-upstream-swe-bench-verified-4-repositories-24-git-worktree-evaluations-with-multi-window-ast-call-graph-localization" class="anchor-alias" aria-hidden="true"></div>

### 4.20 主張 LA-20：マルチウィンドウ `AST` コールグラフ局所化を伴うマルチリポジトリ上流 `SWE-bench Verified`（`4` リポジトリ、`24` git-worktree 評価）

`src/clai/frontier/multirepo_swebench.py` および `scripts/run_multirepo_swebench_benchmark.py`（`artifacts/multirepo_swebench_verified.csv`、`artifacts/multirepo_swebench_verified_traces.json`）は、正解リークゼロの `princeton-nlp/SWE-bench_Verified`（`SHA`-256 `a45b1fe4...`）評価を**異なる上流 Python リポジトリ `4` 件**（`django/django`［`4`］、`pytest-dev/pytest`［`3`］、`psf/requests`［`2`］、および `sympy/sympy`［`3`］ × `2` ウェーブ = **隔離された `git worktree` 評価 `24` 件**）へと拡張し、ファイル内の `ast.Call` 辺（`helper(...)` / `self._helper(...)`）を走査して `2` つの非重複 `AST` ウィンドウを抽出する**マルチウィンドウ `AST` コールグラフ局所化器**を追加する（`patch` へのアクセス一切なしで `91.67%`［`11/12`］の厳密な正解ファイル局所化を達成、`apple_pmu_system_energy_delta_j = 60,935.10 J`）：

| マルチリポジトリ `SWE-bench Verified` アーム (`4` リポジトリ、`24` 評価) | W1 コールド | W2 バックポート | 全体検証済み合格率 | `django` / `pytest` / `requests` / `sympy` | 破損パッチ | W2 `.mol/` 高速パス | 平均 W1 / W2 (`ms`) | `reported_j` / 検証済み修正 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `LiquidAI/LFM3-1.7B` (`1`-Shot) | `0.00%` | `8.33%` | `4.17%` | `0%` / `0%` / `0%` / `17%` | `95.83%` | `0.00%` | `6,197` / `6,481` | `2,294.45 J` |
| `B` `google/gemma-4-E2B-it` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `10,630` / `7,359` | `845.34 J` |
| `C` `Qwen/Qwen3.6-35B-A3B` Metal (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `32,912` / `28,165` | `4,558.58 J` |
| `D` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `8.33%` | `8.33%` | `8.33%` | `25%` / `0%` / `0%` / `0%` | `91.67%` | `0.00%` | `26,247` / `25,693` | `3,439.64 J` |
| **`E` `MoL` マルチリポジトリ `MCP` Agent (参照)** | **`16.67%`** | **`25.00%`** | **`20.83%` (`2.50×`)** | **`25%` / `0%` / `50%` / `17%`** | **`0.00%`** | **`16.67%` (W1 の `100%`)** | **`184,906` / `55,254`** | **`12,176.51 J` (`1.12-5.50 J` W2 ヒット)** |

`django`、`pytest`、`requests`、`sympy` にわたり、すべての単独 `1` ショットモデル（`LFM3-1.7B`、`Gemma-4-E2B`、`Qwen3.6-35B-A3B`、および `Devstral-Small-2-24B`）は検証済み合格率が `4.17%-8.33%` で頭打ちとなり、**`91.67%-95.83%` の破損パッチ**を通過させてしまう（`ORM` 集約、`pytest` フィクスチャ内部処理、`IDNA` プロキシ `URL` 処理）。対して `MoL` マルチリポジトリ `MCP` エージェントは**`4` リポジトリ中 `3` リポジトリ**にわたり**全体 `20.83%`（Wave 2 では `25.00%`、単独 `24B` および `35B` の `2.50×`）** に到達し（`Gemma-4-E2B` による `django__django-17029` を `MCP_Rung0_BenesLUT6->GitDiffSkill#1` 経由で **`2,028.24 ms` / `5.50 J`** で再生；単独 `1` ショットモデルの合格率が `0%` であった `psf__requests-6028` を `Rung 3d Qwen3.6-35B <think> CxRepair` により解決し `GitDiffSkill#2` 経由で **`592.87 ms` / `1.12 J`** で再生；さらに `Rung 2 LFM3-1.7B` による `sympy__sympy-24213`）、**破損パッチの受理は `0.00%`** である。

<div id="421-claim-la-21-measured-120b-scale-open-weights-hybrid-mamba-attention-sparse-moe-nvidianemotron-3-super-120b-a12b--devstral-small-2-24b-apex-cascade" class="anchor-alias" aria-hidden="true"></div>

### 4.21 主張 LA-21：実測 `120B` 規模オープンウェイト・ハイブリッド Mamba-Attention Sparse-MoE（`nvidia/Nemotron-3-Super-120B-A12B`）および `Devstral-Small-2-24B` 頂点カスケード

`src/clai/frontier/frontier_120b_hybrid_moe.py` および `scripts/run_120b_hybrid_moe_benchmark.py`（`artifacts/frontier_120b_hybrid_moe_apex.csv`、`artifacts/frontier_120b_hybrid_moe_apex_traces.json`）は、第6節における `70B+` の外挿留保を、Metal `llama-server` を介した Apple M5 Max（`128 GiB` ユニファイドメモリ）上での **`nvidia/Nemotron-3-Super-120B-A12B`**（総数 `120B` / 活性 `12B` ハイブリッド Mamba-Attention Sparse-MoE、`56.9 GiB` 2 シャード `Q3_K_S` `GGUF`）および **`Devstral-Small-2-24B-Instruct`**（`24B` 密 `SWE` 特化モデル、`Q4_K_M` `GGUF`）の直接ローカル実行へと置き換え、最難関の敵対的仕様 `8` 件 × `2` ウェーブ（`BigCodeBench/6`、`BigCodeBench/8`、`F10_true_damerau`、`F11_benes4_route` を含む `16` 評価）にわたり子プロセスの `ri_resident_size`（`RSS`）、`ri_phys_footprint`、子 `L3` `ri_energy_nj`（`buf[42]`）、および `L2` `IOReport` `GPU Energy` を記録する：

| 実測 `24B` / `120B` フロンティア・アーム (`16` ハード評価) | パラメータ数 (活性) | ピーク常駐 `RSS` | 平均 `tok/s` | W1 Hard-`8` | W2 ウォーム | 全体合格率 | 破損コミット | W2 `.mol/` 高速パス | 平均 W1 / W2 (`ms`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `A` `Devstral-Small-2-24B-Instruct` (`1`-Shot) | `24.0B` (`24.0B`) | `16,797.3 MB` | `22.37` | `37.50%` | `25.00%` | `31.25%` | `68.75%` | `0.00%` | `20,734` / `17,890` |
| `B` `nvidia/Nemotron-3-Super-120B-A12B` (`1`-Shot) | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | `50.00%` | `37.50%` | `43.75%` | `56.25%` | `0.00%` | `21,831` / `23,205` |
| **`C` `MoL` Apex `24B+120B` Cascade (参照)** | **`120.0B` (`12.0B`)** | **`58,075.4 MB`** | **`22.17`** | **`62.50%`** | **`62.50%`** | **`62.50%`** | **`0.00%`** | **`62.50%` (W1 の `100%`)** | **`53,493` / `19,642` (`5.5-70 ms` `.mol/`)** |

`Nemotron-3-Super-120B-A12B` はトークンごとに `12B` の Mamba-Attention MoE パラメータ（密 `24B` より活性重みが `50%` 少ない）のみを活性化するため、`58.08 GB` の常駐ユニファイドメモリ（匿名 `KV`/`SSM` フットプリント `9.67 GB`）内で **`22.17 tok/s`** を持続し、`5×` の総パラメータ規模でありながら密 `24B` のデコード速度に匹敵する。`Devstral-2-24B` と `Nemotron-3-120B-A12B` にまたがって `BenesLUT6` + `.mol/` + $C(z)$ 反例エスカレーションを組み合わせることで、検証済み合格率は **`62.50%`（単独 `120B-A12B` 比 `+18.75` パーセントポイント、単独 `24B` の `2.00×`）** へと上昇し、`BigCodeBench/8`（`W1_09_BigCodeBench_8_complete`）を解決し、結晶化された Wave 2 スキル全 `5` 件を単独 `120B` の `10,092-40,905 ms` に対し **`5.49-69.76 ms`（`0.0118-0.0272 J` `reported_j`）** で再生する（破損コミット `0.00%`；なお `joule_meter.py` の `TDP` 桁あふれガードを `450 W` から `175 W` へ厳格化する前に `42.7 s` の `W3_10` ウィンドウ 1 件で `OS` `IOReport` アキュムレータの桁あふれが発生しており、そのまま未編集で `CSV` に保存されている）。

<div id="422-claim-la-22-clock-enable-ce-gated-250-mhz-p4-axis-kria-kv260-xck26-verilator-vcd-dynamic-power-audit-410-idle--269-packet-shift-reduction" class="anchor-alias" aria-hidden="true"></div>

### 4.22 主張 LA-22：クロックイネーブル（`CE`）ゲート付き `250 MHz` `P4-AXIS` Kria KV260（`xck26`）Verilator `VCD` 動的電力監査（アイドル `4.10×` およびパケットシフト `2.69×` 削減）

`hw/kv260/rtl/clai_benes_pipelined_250mhz.sv`（`ENABLE_CE_GATING = 1`）および `scripts/verify_ce_gated_vcd_power.py`（`artifacts/kv260_ce_gated_vcd_power.csv`、`artifacts/kv260_ce_gated_vcd_power_meta.json`）は、§4.25 で特定された `ENARDEN` クロックゲーティング最適化を `4` 段 `250 MHz` `P4-AXIS` 設計（`clai_uram_lut6_page_cache_ce` + 有効バブル `S1..S4` `FDRE` ゲーティング）の内部に直接実装し、`Verilator 5.054 --trace` の `VCD` トグル抽出 + `AMD DS925`（`xck26`、`VCCINT = 0.72 V`、`250 MHz`、`est_j` クラス）により評価する：

| `xck26` `P4-AXIS` バリアント (`13` 段、`170` `IOB`、`81` `RAMB36E2`) | ワークロード (`Cycles`、ルックアップ稼働率) | `VCD` 信号遷移 / サイクル | 推定 `pJ / cyc` | `250 MHz` 時の推定動的 `mW` (`[Low, High]`) | 非ゲート比電力削減 | Verilator 一致率 (`320` ビート) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `idle_quiescent_256` (`0.0%`) | `0.07` | `255.96 pJ` | `63.99 mW` (`[48.00, 82.22]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (参照)** | **`idle_quiescent_256` (`0.0%`)** | **`0.07`** | **`62.37 pJ`** | **`15.59 mW` (`[10.34, 21.88]`)** | **`4.10×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `axis_beat_shift_512` (`12.5%`) | `3,852.19` | `278.47 pJ` | `69.62 mW` (`[51.84, 90.10]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (参照)** | **`axis_beat_shift_512` (`12.5%`)** | **`1,413.22` (`2.73×` 減)** | **`103.35 pJ`** | **`25.84 mW` (`[18.06, 35.00]`)** | **`2.69×`** | **`100.0%`** |
| `P4_AXIS_Ungated` (`ENARDEN=1`) | `zero_bubble_burst_256` (`100.0%`) | `12,134.41` | `392.20 pJ` | `98.05 mW` (`[72.38, 127.68]`) | `1.00×` | `100.0%` |
| **`P4_AXIS_CE_Gated` (参照)** | **`zero_bubble_burst_256` (`100.0%`)** | **`4,451.65` (`2.73×` 減)** | **`374.15 pJ`** | **`93.54 mW` (`[69.76, 120.44]`)** | **`1.05×`** | **`100.0%`** |

`ENARDEN` + 有効バブル `CE` ゲーティングの追加は、わずか `+9` CLB LUT の増加（`41,456` から `41,465`、追加 FF は `0`、**`13` 同期論理段**および **`170 <= 189` `IOB`** を維持）にとどまり、`CE=0` と `CE=1` の間で **`320 / 320`（`100.0%`）のビット完全出力一致**を保持したまま、静止時の動的電力を **`4.10×`**（`63.99` から **`15.59 est_mW`**）、`64` ビット `AXI4-Stream` パケット取り込み時（`8` サイクル中 `1` 回のルックアップ稼働率）の電力を **`2.69×`**（`69.62` から **`25.84 est_mW`**）削減する。

<div id="423-claim-la-23-zero-python-single-binary-native-rust-mol-agent-rs-server-0154-msreq-mcp-1721-faster-than-python-mol-agent" class="anchor-alias" aria-hidden="true"></div>

### 4.23 主張 LA-23：Python 非依存単一バイナリ・ネイティブ Rust `mol-agent-rs` サーバ（`0.154 ms/req` `MCP`、Python `mol-agent` より `17.21×` 高速）

`sys/rust/src/bin/mol_agent.rs`（`artifacts/rust_mol_agent_server_bench.csv`、`artifacts/rust_mol_agent_server_meta.json`）は、**Python インタプリタや第三者 `HTTP` 依存を一切持たない**スタンドアロンのネイティブ Rust バイナリ（`cargo run --release --bin mol_agent`）をコンパイルし、`.mol/skills_v1.json`（結晶化スキル `17` 件）+ `Burn 0.22.1 / CubeCL` `CubeCL_Metal_GPU` 検証 + Darwin `proc_pid_rusage(RUSAGE_INFO_V6)` `ri_energy_nj`（`words[42]`）テレメトリ上で直接 OpenAI `GET /v1/models`、REST + `SSE` `POST /v1/chat/completions`、および `MCP` `JSON-RPC 2.0`（`POST /mcp` + `--mcp-stdio`）を提供する：

| ローカル・ループバック・エージェントエンドポイント | ランタイムスタック | 平均レイテンシ (`ms/req`) | Python `MCP` 比速度向上 | Darwin `L3` `reported_j / req` | Python 依存ゼロ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `MCP` `mol_lookup_crystallized_skill` (`Python`) | Python `3.13` `http.server` | `2.6503 ms` | `1.00×` | `0.000450 J` | `false` |
| **`MCP` `mol_lookup_crystallized_skill` (参照)** | **Rust `1.100` `std::net` + `BenesLUT6`** | **`0.1540 ms` (`154.0 µs`)** | **`17.21×`** | **`0.000272 J`** | **`true`** |
| **OpenAI `POST /v1/chat/completions` (参照)** | **Rust `1.100` `std::net` + `BenesLUT6` (REST+`SSE`)** | **`0.1504 ms` (`150.4 µs`)** | **`17.62×`** | **`0.000272 J`** | **`true`** |
| **`MCP` `mol_cubecl_gpu_verify` (参照)** | **Rust `1.100` + `Burn 0.22.1` `CubeCL_Metal_GPU`** | **`0.9887 ms`** | - | **`0.000272 J` (`L3` `CPU`)** | **`true`** |

<div id="424-xck26-sfvc784-2lv-c-full-subsystem-primitive-breakdown-topological-depth-and-vivado-20261-hardware-probe" class="anchor-alias" aria-hidden="true"></div>

### 4.24 `xck26-sfvc784-2LV-c` 完全サブシステム原始分解、位相的深さ、および `Vivado 2026.1` ハードウェアプローブ

単独の `512` ページ投機的コア (`hw/kv260/rtl/clai_benes_hotswap_core.sv` 内の `clai_benes_paged_hotswap_core`) および完全な Advanced Microcontroller Bus Architecture (`AMBA`) `AXI4-Lite` + `AXI4-Stream` Rung-0 サブシステム (`hw/kv260/rtl/clai_kv260_axi_top.sv` 内の `clai_kv260_axi_top`、`clai_engram_streamer.sv`、`clai_rung0_hotswap_core.sv`、およびコミット `a5e9bc1de280` における `artifacts/clai_rung0_kv260.v`、`91a2213` において変更なし) を、正確な AMD Kria KV260 部品 (`xck26-sfvc784-2LV-c`: `117,120` CLB LUT、`234,240` CLB フリップフロップ、`144` `RAMB36E2` ブロック、`64` 288-Kbit UltraRAM (`URAM288`) ブロック、`1,248` UltraScale+ デジタル信号処理 (`DSP48E2`) スライス、および `189` ユーザ入出力ブロック (`IOB`)) に対して監査するため、`Intel Core i9-13900H` (`Linux 7.0.0-43-generic x86-64`) ワークステーション上で 3 つのハードウェアおよび電子設計自動化 (`EDA`) 検査が実行された:

1. **読み出し専用 Joint Test Action Group (`JTAG`) と Universal Serial Bus (`USB`) プローブ (`Xilinx hw_server v2026.1` + Xilinx Software Command-Line Tool (`XSDB`))**: `lsusb` が将来技術デバイス国際 (`FTDI`) `0403:6010` (`FT2232C/D/H` デュアル汎用非同期受信機-送信機 (`UART`) / ファーストイン・ファーストアウト (`FIFO`) 集積回路 (`IC`)) ブリッジを検出したにもかかわらず、Linux `sysfs` USB ベンダー/プロダクト文字列 (`idVendor = 0403`, `idProduct = 6010`) を調査したところ、デバイスは `Manufacturer = "Particle"`, `Product = "tachyon-dbg-1.0"` として識別され、Kria KV260 キャリアではなかった。`hw_server v2026.1` (ビルド 2026 年 5 月 29 日) を `xsdb` (`connect; jtag targets; targets`) でクエリした結果、**`0` Xilinx `JTAG` デバイスおよび `0` Debug Access Port (`DAP`) ターゲット** が返された (`board_metered = false`, `measured_j = None`)。

2. **`Vivado 2026.1` バッチ合成およびライセンスゲート (`SW Build 6511674`)**: 再現性のある低フットプリント・非プロジェクトバッチスクリプト (`scripts/run_vivado_xck26.tcl`, `set_param general.maxThreads 4`, `xck26-sfvc784-2LV-c` を `250.0 MHz` / `4.000 ns` のアウト・オブ・コンテキスト (`OOC`) モードで対象) を `/tools/Xilinx/2026.1/Vivado/bin/vivado` に対してステージングした。`vivado v2026.1` をバッチモードで起動すると `synth_design` に入る前に終了し (**`ERROR: Vivado Design Suite cannot be launched because a valid license was not found`**)、AMD `Vivado 2025.1+` / `2026.1` が Standard/Enterprise `.lic` ファイル (`~/.Xilinx/Xilinx.lic` または `XILINXD_LICENSE_FILE`) を明示的に要求するためである。Standard 階層の `xck26` デバイスでも `.lic` ファイルが無いと、測定ルールに従い、ポストルート `WNS`、配置配線後の最大クロック周波数、ベクトルレス `report_power` (`est_j`) はすべて `not_available` のままである。

3. **フルサブシステム UltraScale+ `xcup` プリミティブ分解、`IOB` 予算、トポロジーレベル論理監査 (`Yosys 0.71+`)**: `clai_benes_paged_hotswap_core` と `clai_kv260_axi_top` を `synth_xilinx -family xcup` と `ltp -noff` で合成しつつ、ホスト `RAPL package-0` `reported_j` を厳密に `x86-64` `EDA` コンパイルコスト $E_{\text{compile}}$ として記録し、FPGA シリコン電力としては記録しなかった結果、正確なセル数および臨界経路の組み合わせ深さが確定した。

| `xck26-sfvc784-2LV-c` 対象モジュール | CLB LUT (`% xck26`) | 主要 LUT プリミティブ | CLB レジスタ (`FDRE`/`FDSE`) | `RAMB36E2` (`%`) | `DSP48E2` | トップポート (`IBUF`+`OBUF`) | 組合せ深度 (`ltp`) | ホスト合成 `RAPL` (`reported_j`) |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`clai_benes_paged_hotswap_core`** (`512` ページ) | **`41,185`** (`35.17%`) | `19,982 LUT3`, `7,804 LUT6`, `7,714 LUT5`, `36 MUXF7`, `18 MUXF8` | **`36,464`** (`15.57%`) | **`81`** (`56.25%`) | **`0`** | `1,599` (`OOC` / 内部バス) | **`81` 段** | `7,297.3 J` (`144.8 s`) |
| **`clai_kv260_axi_top`** (`AXI4` Rung-0 サブシステム) | **`67,366`** (`57.52%`) | `25,557 LUT6`, `25,333 LUT5`, `7,918 LUT3`, `569 CARRY4` | **`16,619`** (`7.09%`) | **`4`** (`2.78%`) | **`0`** | `126` (`<= 189` `IOB`; `PS-PL`) | **`73` 段** | `10,089.4 J` (`214.8 s`) |

`xcup` プリミティブおよび `ltp` 監査から、物理設計上の制約が二つ導かれる。

- **ピン予算の制約 (`OOC` 対 `PS-PL` `AXI` ラッパ)**: `clai_benes_paged_hotswap_core` は生の `512` ビット `CodeBitBus` と広幅のシャドウ構成ベクタを外部に公開するため (入力バッファ (`IBUF`) `1,379` 個 + 出力バッファ (`OBUF`) `220` 個 = `1,599` ポート, 対して `xck26-sfvc784-2LV-c` のパッケージ `IOB` は `189` 個)、単独でのベンダー実装は `synth_design -mode out_of_context` で実行するか、`clai_kv260_axi_top` (`126` ポート, LUT 使用率 `57.52%`) のような `AXI4-Stream` / `zynq_ultra_ps_e` ラッパ内で行う必要がある。
- **パイプライン化されていない組合せ深度 (`81` 段および `73` 段) 対 `250 MHz` (`4.000 ns`) の `-2LV` タイミング収束**: Verilator `5.054` により、サイクル精度の `CPI = 1.0` (クロックサイクルあたり `1` 回のルックアップ) は検証されているものの、`17` 段の `Beneš-1` ステージ、`9` 段のプレフィックスコピーステージ、`17` 段の `Beneš-2` ステージ、動的 `LUT6` 真理値表の多重化、および `5` 票の多数決縮約を単一の組合せサイクルで伝搬させると、**`81` 段のプリミティブ論理段**に及ぶ (`clai_kv260_axi_top` の組合せ型 `64` 入力ポップカウントおよび `8` クラスのマージン比較器の階層モジュールごとには `73` 段)。低電圧 (`0.72 V`) の `-2LV` シリコン上で配置配線後に `250 MHz` (`4.000 ns`) を収束させるには、$\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ の間にパイプラインレジスタ段を挿入し、`64` 本のワイヤによるポップカウント縮約を圧縮することが有利であり（上記の `主張 LA-16` にて実装され、その定量的評価は §4.25 で解析的に示す）。

<div id="425-gate-level-xcup-primitive--verilator-vcd-switching-activity-datasheet-audit-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.25 ゲートレベル `xcup` プリミティブおよび `Verilator` `VCD` 切替活動データシート監査 (`est_j`)

AMD `Vivado 2026.1` が欠落した `.lic` ファイルによりブロックされ、物理 `xck26` ボードが `0` 枚接続されていなかったため (§4.24)、事前登録された `Verilator 5.054` `--trace` 波形および `Yosys 0.71+` 平坦化 `synth_xilinx -family xcup` 監査 (`PREREG_xck26_vcd.json`、SHA-256 `c64505d177515c47…`) は、`openIE-dev/lut-adapt-ai` (`af152ba`、`91a2213` において変更なし) から 4 つの動作フェーズ (`idle_quiescent`、`steady_lut6_eval_2048_cycles`、`single_cycle_page_switch_512_burst`、および `shadow_page_stream_write`、`3,072` ページルックアップ全体およびすべての `AXI4-Lite`/`AXI4-Stream` パケットバーストにわたる `0` 個のコシミュレーションエラー) における正確なサイクルごとの信号遷移を抽出した。本小節のすべての電力およびエネルギー数は、厳密に分析的な動的切替推定 (**`est_j` / `est_pJ/cycle` / `est_mW`**、**`measured_j = None`**、**`reported_j = None`**、**`board_metered = false`**) であり、静的シリコンリークを除外し、配置配線済み `Vivado report_power` または KV260 `INA260` レール読み値の代用を一切行わない。

平坦化 `xcup` 合成は `clai_benes_paged_hotswap_core` (`512` ページ) を **`41,623` CLB LUT** (`xck26` の `35.54%`、§4.24 の階層的 `41,185` に対し、`19,982 LUT3`、`7,853 LUT6`、`7,738 LUT5`、`3,380 LUT4`、`2,670 LUT2`、`36 MUXF7`、`18 MUXF8`)、`36,464` `FDRE` (`15.57%`)、および `81` `RAMB36E2` (`56.25%`) に、`27,157` 個のユニーク `VCD` ネット (`90,124` 内部ビット：`64,218` 組合せ、`20,767` 逐次) 全体にわたってマッピングし、`clai_kv260_axi_top` を **`66,881` CLB LUT** (`xck26` の `57.10%`、§4.24 の階層的 `67,366` に対し、`25,402 LUT6`、`25,313 LUT5`、`7,909 LUT3`、`5,303 LUT4`、`2,879 LUT2`、`75 LUT1`、`569 CARRY4` $\equiv$ `285 CARRY8`)、`16,619` `FDRE`/`FDSE` (`7.09%`)、および `4` `RAMB36E2` (`2.78%`) に、`3,825` 個のユニーク `VCD` ネット (`128,486` 内部ビット：`108,582` 組合せ、`19,901` 逐次) 全体にわたってマッピングする。`VCCINT = 0.72 V` (`xck26-sfvc784-2LV-c`、`250.0 MHz`、`AMD DS925` / `XPE` 16 nm FinFET 境界 `[low, nom, high]`) における動的切替エネルギーは、切替論理 + 局所相互接続ノードを $C_{\text{node}} = [2.6, 4.5, 7.2]\text{ fF}$ ($\frac{1}{2} C V^2 = [0.674, 1.166, 1.866]\text{ fJ/transition}$、`Beneš` コア内の `VCD` 組合せビットあたり `2.02` `xcup` プリミティブで重み付け) でモデル化し、`FDRE`/`FDSE` クロックリーフピンを `[1.5, 2.2, 3.0] fF` (`2` エッジ/サイクル = 公称 `1.141 fJ/FF/cycle`) + `Q` 遷移あたり `[3.5, 5.5, 8.0] fF` でモデル化し、`RAMB36E2` (`SDP` `64b`/`72b`) を可変アドレス読み出しあたり `[2.90, 3.80, 4.80] pJ`、定アドレスイネーブルサイクル (`ENARDEN = 1`、$\alpha_{\text{addr}} = 0$) あたり `[1.90, 2.47, 3.12] pJ`、書き込みあたり `[3.30, 4.30, 5.40] pJ`、および無効時 (`EN = 0`) に `[0.04, 0.08, 0.14] pJ/cycle` でモデル化する：

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

3. **平坦化されたクリティカルパス監査（`81` および `162` `ltp` レベル）と `DS925` `-2LV` 解析的ステージ遅延予算**: `AMD DS925`（`xck26-2LV`、`0.72 V`）のプリミティブ遅延（`T_ILO = 0.068 ns`、`T_CKO = 0.148 ns`、パイプラインなし `RAMB36E2` `T_RCKO_DO = 1.390 ns` 対 `DOA_REG = 1` `0.610 ns`、レベル当たり `[0.140, 0.220] ns` の配線予算）を適用すると、パイプラインなし `81` レベル `clai_benes_paged_hotswap_core` の経路は **`18.76-24.83 est_ns`**（`40.3-53.3 MHz` 解析的 `est_Fmax`）になる。`clai_kv260_axi_top` をモジュール境界で平坦化（`-flatten` 後 `ltp -noff`、§4.24 の階層モジュールで `73` レベル）すると、**`162` レベル** の経路（**`34.77-46.92 est_ns`**、`21.3-28.8 MHz`）が `core_bus_reg` から `clai_rung0_core`（`artifacts/clai_rung0_kv260.v`）へ、そして展開された `64` ステップシリアル `pop_acc` 加算チェーンを跨いで露出する。`RAMB36E2` の `DOA_REG = 1` を有効化し、`4`-`5` 段パイプラインレジスタカット（`<= 18` 論理レベル/ステージ、`主張 LA-16` において `13` 同期レベルとして実現）を挿入し、シリアル `64` 入力ポップカウントループを `6` レベル `LUT6`/Wallace 圧縮器に置換すれば、ステージ当たりの解析遅延は **`3.7 est_ns`**（`250 MHz` で `<= 4.000 ns`）以下に抑えられ、`CPI = 1.0` を実現できる（Vivado 後 PAR タイミングクロージャではない）。


<div id="426-claim-la-24-six-host-cross-silicon--physical-dc-shunt-measured_j-downward-compilation-benchmark-jetson-agx-thor--5-counter-hosts" class="anchor-alias" aria-hidden="true"></div>

### 4.26 主張 LA-24：6ホスト・クロスシリコンおよび物理 `DC` シャント（`measured_j`）下方コンパイル・ベンチマーク（`Jetson AGX Thor` + カウンタホスト `5` 台）

`sys/rust/src/bin/mol_fleet_measured_j.rs` および `scripts/aggregate_fleet_measured_j.py`（`artifacts/mol_six_host_measured_j_fleet.csv`、`artifacts/mol_six_host_measured_j_fleet_meta.json`）は、外部クレート非依存の純 `std` Rust `1.100.0` 単体バイナリを**6つの異なるハードウェアアーキテクチャおよび3つのオペレーティングシステム**（`Linux aarch64`、`Linux x86-64`、`macOS arm64`、`Windows 11 x86-64`）にわたってコンパイルし、`NVIDIA Jetson AGX Thor` 上の Linux `sysfs` `hwmon5` `TI` `INA3221` チャネル 2 `VDD_CPU_SOC_MSS`（`in2_input × curr2_input`、`CUDA_VISIBLE_DEVICES=""` 下で前後ドリフト `< 0.06%`・`2.378 W` と平坦を保った `VDD_GPU` から物理分離）および `hwmon6` `TI` `INA238` 基板全体 `VIN`（`power1_input`、前後静止ドリフト `0.19%`）をカウンタバランス型 `ABBA` 窓にわたり `500 Hz`（`2 ms`）で台形積分した物理 `DC` 電流シャント実測値（`measured_j`、`board_metered = true`）を基準点として据える：

| フリートホストおよびアーキテクチャ (`rustc 1.100.0`) | 根拠階層 (`board_metered`) | `W2` `Sub1Bit-LUT6` 対 `LittleBit-2` `MAC` | `W3` `Expert-AirMoL` 対 密 `256` `MoE` | `W4b` ゼロクロック `OS` イベント対 `1 kHz` ポーリング (`8 s`) | `W5` 命題 1 コンパイル済み対 Rung 5 固定 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`NVIDIA Jetson AGX Thor` (`aarch64` Linux)** | **`measured_j`: `TI` `INA3221` `CPU` + `INA238` `VIN` (`true`)** | **`3.74×` `CPU` J (`7.76` 対 `28.98 J`) / `3.71×` `VIN` J (`23.81` 対 `88.43 J`)** | **`34.21×` `CPU` J (`0.98` 対 `33.36 J`) / `33.27×` `VIN` J (`3.03` 対 `100.93 J`)** | **起動 `80` 対 `60,759` (`759×` 削減、`-0.51 J` `CPU` シャント)** | **`10.94×` `CPU` J (`2.03` 対 `22.21 J`) / `11.07×` `VIN` J (`6.41` 対 `71.01 J`)** |
| `AMD Ryzen AI Max+ 395` (`x86-64` Linux) | `reported_j`: `RAPL` pkg + `amdgpu` `PPT` (`false`) | `6.75×` `RAPL` pkg (`21.66` 対 `146.28 J`) | `31.05×` `RAPL` pkg (`4.27` 対 `132.66 J`) | 起動 `80` 対 `60,991` (`762×` 削減、`2.37×` `RAPL` core) | `10.88×` `RAPL` pkg (`3.31` 対 `36.02 J`) |
| `Intel Core i9-13900H` (`x86-64` Linux) | `reported_j`: `RAPL` core + pkg (`false`) | `3.84×` `RAPL` core (`9.29` 対 `35.68 J`) | `33.57×` `RAPL` core (`1.42` 対 `47.55 J`) | 起動 `80` 対 `60,536` (`757×` 削減、**`18.79×` `RAPL` core**) | `11.50×` `RAPL` core (`1.41` 対 `16.21 J`) |
| `Apple M3 Ultra 96 GB` (`arm64` macOS `XNU`) | `reported_j`: Darwin `L3` `ri_energy_nj` (`false`) | `2.70×` `L3` J (`5.23×` 高速) | `35.22×` `L3` J (`0.13` 対 `4.71 J`) | 起動 `80` 対 `47,234` (`590×` 削減、**`194.8×` `L3` J**) | `13.05×` `L3` J (`0.26` 対 `3.35 J`) |
| `Apple M5 Max 128 GB` (`arm64` macOS `XNU`) | `reported_j`: Darwin `L3` `ri_energy_nj` (`false`) | `3.41×` `L3` J (`5.42×` 高速) | `36.77×` `L3` J (`0.15` 対 `5.46 J`) | 起動 `80` 対 `52,651` (`658×` 削減、**`110.4×` `L3` J**) | `11.13×` `L3` J (`0.35` 対 `3.94 J`) |
| `Windows 11 + RTX 2060` (`x86-64` `NT`) | `QueryProcessCycleTime` + `NVML` (`false`) | `5.92×` 高速 (`5.90×` サイクル削減) | `34.39×` 高速 (`33.01×` サイクル削減) | 起動 `80` 対 `42,382` (`530×` 削減、**`25.5×` サイクル削減**) | `12.65×` 高速 (`12.05×` サイクル削減) |

`NVIDIA Jetson AGX Thor` において、単体の `SleepCrystallizer` による `FWHT` + Waksman コンパイルは物理 `VDD_CPU_SOC_MSS` `measured_j` で **`178.60 µJ`**（`VIN` `measured_j` で `680.0 µJ`）しか要さず、Rung 3 起動 1 エピソードあたりの **`1,735.03 µJ`**（`VDD_CPU_SOC_MSS`）と比較して命題 1 の実証的な損益分岐ホライズン **$\Delta T^* = 0.1084 < 1$ エピソード**を確立する（全6ホストで `4/4` 組の `ABBA` 正節約）。一方、ページ化 `512×512` Beneš + `80-LUT6` 評価（`W1`）は `1.865 µJ/eval`（`243.9 ns/eval`）、ネイティブ `MCP` `JSON-RPC 2.0` スキルディスパッチ（`W4a`）は `761.2 nJ/req`（`92.0 ns/req`）で動作する。並行して、`scripts/run_fleet_bwrap_lean_audit.py`（`artifacts/openie_fleet_six_kernel_paranoid_audit.csv`）は Linux `bwrap` サンドボックス内で **Open Interface Engineering の全4つの Lean 4 スイート**（`lut-adapt`：`27` 定理、`con-leche` `58,683` 宣言、`113.29 J` `RAPL` core；`communication-avalanche`：`53` 定理/補題、`58,928` 宣言、`287.73 J`；`time-as-an-index`：`50` 定理/補題、`58,796` 宣言、`135.47 J`；`rce/spec/lean`：`1,261` 定理/補題、`68,090` 宣言、`994.78 J`）に対し `lake check --paranoid`（`Lean 4.36.0`）を実行し、**`6/6` の独立カーネル**で **`1,391` 宣言**が **`0` `sorryAx`**、**`0` カスタム公理**、**`0` `ofReduceBool`** で受理されることを確認する。

<div id="427-claim-la-25-four-vendor-hardware-gpu-burn-0221--cubecl-shader-parity-apple-metal--amd-vulkan--nvidia-vulkan--intel-vulkan" class="anchor-alias" aria-hidden="true"></div>

### 4.27 主張 LA-25：4ベンダー実機 `GPU` における `Burn 0.22.1 / CubeCL` シェーダ一致（`Apple Metal` + `AMD Vulkan` + `NVIDIA Vulkan` + `Intel Vulkan`）

`sys/rust/src/bin/bench_cubecl_moe_deltanet.rs` および `scripts/aggregate_multivendor_cubecl_gpu.py`（`artifacts/cubecl_four_vendor_gpu_parity.csv`、`artifacts/cubecl_four_vendor_gpu_parity_meta.json`）は、ベンダー固有の C++/`CUDA`/`MSL`/`HIP` ファイルを一切含まない**同一の単一ソース Rust `#[cube]` カーネル**（`q4_moe_ffn_pairs_gpu` および `gated_delta_recurrent_k128_gpu`）を**4社の異なる `GPU` シリコンベンダー**上で実行する：

| `GPU` ベンダーおよび実機シリコン | シェーダバックエンド | `Q4` Sparse-`MoE` (`28`-Exp) `GPU` `ms` (`× Ref`) | `Q4` 最大 `FP32` 誤差 | `GatedDeltaNet` (`T=256, H=32`) `GPU` `ms` (`× Ref`) | `DeltaNet` 最大 `FP32` 誤差 | オンチップ `reported_j` / ディスパッチ (`MoE` / `DeltaNet`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`Apple M5 Max` (`40` コア `GPU`, `arm64`)** | `CubeCL_Metal_GPU` (`MSL`) | **`0.6600 ms` (`41.69×`)** | `1.79 × 10⁻⁷` | **`3.7242 ms` (`45.74×`)** | `2.24 × 10⁻⁸` | `1.30 mJ` / `2.51 mJ` (`L3` ホスト `CPU`) |
| **`AMD Radeon 8060S` (`gfx1151` RDNA 3.5)** | `CubeCL_Vulkan_SPIRV` | **`2.0984 ms` (`16.72×`)** | `1.49 × 10⁻⁷` | **`0.6367 ms` (`328.06×`)** | `2.24 × 10⁻⁸` | **`103.01 mJ` / `32.20 mJ` (`amdgpu` `PPT`、`CPU` 比 `17.1×` 低)** |
| **`NVIDIA GeForce RTX 4050` (`sm_89` Ada)** | `CubeCL_Vulkan_SPIRV` | **`0.9420 ms` (`59.32×`)** | `1.49 × 10⁻⁷` | **`1.4449 ms` (`265.67×`)** | `2.24 × 10⁻⁸` | **`55.55 mJ` / `131.39 mJ` (`NVML` `GPU` mJ)** |
| **`Intel Iris Xe Graphics` (`RPL` iGPU)** | `CubeCL_Vulkan_SPIRV` | **`4.6239 ms` (`11.67×`)** | `1.79 × 10⁻⁷` | **`24.0915 ms` (`16.19×`)** | `3.35 × 10⁻⁸` | **`172.20 mJ` / `711.61 mJ` (`RAPL` pkg、`CPU` 比 `2.7×` 低)** |

<figure class="my-8">
  <img src="/figures/lut-adapt/six-host-measured-j-and-multivendor-gpu.svg" alt="Jetson AGX Thor 上の物理 DC シャント measured_j、Apple・AMD・NVIDIA・Intel の4ベンダー CubeCL GPU 高速化、6ホスト下方コンパイル行列、および4リポジトリ Linux bwrap サンドボックス6カーネル証明監査。" />
  <figcaption>図 7. 実証フリート測定（`主張 LA-24, LA-25, LA-19`）：(A) `NVIDIA Jetson AGX Thor` 上の物理 `TI` `INA3221` `VDD_CPU_SOC_MSS` および `INA238` `VIN` `measured_j`（`board_metered = true`）；(B) Apple、`AMD`、`NVIDIA`、Intel の4ベンダー `Burn 0.22.1 / CubeCL` `GPU` 高速化；(C) 6ホスト・クロスシリコン行列；および (D) 4リポジトリにわたる Linux `bwrap` 6カーネル `Lean 4.36.0` 検証。</figcaption>
</figure>

<div id="428-claim-la-26-no_std-rust-11000-lut6-core-4-kb-compactlut6page-64-codon-operon-abi-bare-metal-mcu-elfs-and-yosys-miter-packer" class="anchor-alias" aria-hidden="true"></div>

### 4.28 主張 LA-26：`#![no_std]` Rust `1.100.0` `lut6-core` `4 KB` `CompactLut6Page`、64コドン Operon `ABI`、ベアメタル `MCU` `ELFs`、および Yosys マイタ・パッカ

`sys/lut6-core/`（`Rust 1.100.0`、`edition = "2024"`、`#![no_std]`、ランタイム依存ゼロ）、`sys/alif-lut6-bench/`（`thumbv8m.main-none-eabihf`、`-C target-cpu=cortex-m55`）、`sys/pico-lut6-bench/`（`thumbv6m-none-eabi`、`-C target-cpu=cortex-m0plus`）、および `scripts/pack_lut6_crystal.py`（`artifacts/crystals/yosys_operon_seed.lut6`、`artifacts/lut6_yosys_packer_summary.json`、`artifacts/lut6_core_baremetal_targets.json`）は、Rung 0 の下方コンパイルを `MCU` の `SRAM`・`DTCM`・`MRAM` メモリ階層へと降ろす：
- **厳密に `4,096 B`（`#[repr(C, align(8))]`）の `CompactLut6Page` と `16 KB` `Nucleus`**：`64 B` ヘッダ（`LUT6` マジック、`SHA256` 証明ダイジェスト、バイトオフセット `56` の `const fn` `IEEE` `CRC32`）、`4 × 64` 個の `u64` `LUT6` 真理値表（`2,048 B`）、`4 × 64 × 6` 個の入力配線ルーティングバイト（`1,536 B`）、`64 B` の出力ピン、および `384 B` の予約領域を単一の `4 KB` フラッシュまたは `SRAM` ページへ格納する。自己精緻化 `Nucleus` は、不変の `ROM`/`MRAM` ブートストラップページ 2 枚（生得的センサ反射ページと、`0x00` スリープ停止、`0x10` ページスプライス、`0x20` 外因性 `PIO`/`SPI` ツール呼び出し、`0x30` フロンティア転写、`0x3C` アポトーシス・ロールバックを符号化する 64 コドン Operon `FSM`）と、`override_mask` ビット単位 `2:1` 多重化（`Result<EvalOutcome, !>`）で保護された可変 `SRAM`/`DTCM` 外科的オーバーレイページ 2 枚を組み合わせる。
- **7ターゲット・クロスコンパイル（`64 KB` `nRF52832` Cortex-`M4F` および `RV32IMAC` `ELFs` を含む）と Yosys `abc -lut 6` ブールマイタ**：警告 `0` かつ**浮動小数点命令 `0` 個**で **7つのターゲット**（`aarch64-apple-darwin`、`x86_64-unknown-linux-gnu`、`aarch64-unknown-linux-gnu`、`thumbv8m.main-none-eabihf`［`Alif E3/E4` Cortex-`M55`：`.text = 12,260 B`、`.lut6_dtcm = 16,400 B`、浮動小数点命令 `0`］、`thumbv6m-none-eabi`［`RP2040` Cortex-`M0`+：`.text = 11,040 B`、`.lut6 = 16,400 B`、浮動小数点命令 `0`］、`thumbv7em-none-eabihf`［`64 KB` `SRAM` を備える `Nordic nRF52832-QFAA` Cortex-`M4F`：`.text = 12,300 B`、`.lut6_sram = 16,400 B`、`.data = 24 B` = **`64 KB` `SRAM` の `25.06%`**、`BLE`/センサ用に `49,112 B` の空き余裕を残し浮動小数点命令 `0`］、および `riscv32imac-unknown-none-elf`［`RV32IMAC` `64 KB` `SRAM`：`.text = 11,244 B`、`.lut6_sram = 16,400 B` = **`64 KB` `SRAM` の `25.06%`**、浮動小数点命令 `0`］；`openie-research-experiments/lut6-core-nucleus/` にアーカイブ済み）へクリーンにクロスコンパイルされ、さらに `pack_lut6_crystal.py` は **Yosys `0.71+`（`abc -lut 6`）** で `operon_skill_top` を合成し、**網羅的ブールマイタ `64 / 64` ベクトル（失敗 `0`、`CRC32 = 0xd1cc025a`）** に合格する。

<div id="429-claim-la-27-closed-form-multilinear-difflut-net-arxiv260909254--6406-gate-pruning-wobble-fwht-noise-filter-and-dual-reality-means-test" class="anchor-alias" aria-hidden="true"></div>

### 4.29 主張 LA-27：閉形式多重線形 `DiffLUT-Net`（`arXiv:2609.09254`）`-64.06%` ゲート枝刈り、ゆらぎ `FWHT` 雑音フィルタ、および二重現実資力審査

`src/clai/frontier/lut6_means_test_and_difflut.py` および `scripts/run_dual_reality_lut6_eval.py`（`artifacts/lut6_dual_reality_eval.csv`、`artifacts/lut6_means_test_decisions.csv`、`artifacts/lut6_dual_reality_summary.json`）は、`ST` ポート固定を伴う閉形式 64 最小項多重線形緩和（Ye et al., 2026、`arXiv:2609.09254`）、2 ビットゆらぎブール・フーリエフィルタリング（Linial, Mansour, and Nisan, 1993；`NucleusCodon.lean` にて機械検証済み）、および 4 部構成の熱力学的資力審査を評価する：

| 二重現実 `LUT6` コンパイル方式 | 活性 `LUT6` ゲート数 | `RP2040` `264 KB` スキルスロット | 雑音付き言い換え + ゆらぎヒット | サイレント破損 | `OOD` コンフォーマル棄権 | 生態学的 Rung 6 判定 |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `Uncanonicalized_1Hot_LUT6` (`1u64 << c`, `28` `AC` 雑音) | `64` | `248` | **`0.00%`** | `0.00%` | `100.00%` | **`Killed` (`< 50%` 棄却基準)** |
| `2` `FiniteDiff_DWN_Unpruned` (Bacellar et al., 2024) | `64` | `248` | `95.00%` | `0.00%` | `100.00%` | `Passes` (枝刈りなし基準) |
| **`3` `ClosedForm_DiffLUT_Net_Pruned` (`arXiv:2609.09254`、参照)** | **`23` (`-64.06%`)** | **`690` (`2.78×`)** | **`95.00%`** | **`0.00%`** | **`100.00%`** | **`Passes` (`0x4bb4a685` `.lut6`)** |
| **`4` `Nucleus_Wobble_Codon_Crystal` (`0` `|S|>=5` 雑音、参照)** | **`16` (`-75.00%`)** | **`992` (`4.00×`)** | **`95.00%`** | **`0.00%`** | **`100.00%`** | **`Passes` (`4/4` `ADC` ジッタ耐性)** |

パーセバルの等式（$w \in \{-1,+1\}^{64}$ に対し $\sum_{S \subseteq \{0..5\}} \hat{w}(S)^2 = 4096$）により、1-hot 点記憶マスク（`1u64 << target`）は $62^2 + 63 \times (-2)^2 = 4096$ と分解され、非定数 `AC` エネルギーの `11.1%` にあたる $7 \times 4 = 28$ が次数 `>=5` の脆弱な高調波へ漏洩し（6 ビットパリティでは `4,096`）、表層的な言い換えや 2-`LSB` `ADC` 熱ジッタの下でヒット率 `0.00%` に崩壊する。対照的に、すべての 2 ビットゆらぎ不変 `LUT6`（`0x0F << 4q`）は次数 `>=5` の高調波エネルギーが**厳密に `0`** であり（`NucleusCodon.wobble_quartet_high_harmonic_cancels`）、クリーンなゆらぎオーバーレイ（`max_noise_energy <= 16`）を受理する一方、4 部構成の資力審査は未検証の推測（$\delta = 0.82 < 1.0$）、未償却の単発スクリプト（$N = 1 < N_{\text{crit}} = 1.90$）、高自由度散文（$H = 4.85 > 1.25$ ビット）を拒否し、ドリフトしたオーバーレイ（`rej = 3`）を不変シードへ立ち退かせる。

<div id="430-claim-la-28-nvidia-jetson-agx-thor-physical-dc-shunt-measured_j-and-live-attached-alif-ensemble-e3-openmv-ae3-cortex-m55-hardware-dwt-cycles" class="anchor-alias" aria-hidden="true"></div>

### 4.30 主張 LA-28：`NVIDIA Jetson AGX Thor` 物理 `DC` シャント（`measured_j`）および実機接続 `Alif Ensemble E3`（`OpenMV-AE3` Cortex-`M55`）ハードウェア `DWT` サイクル

`sys/lut6-core/src/bin/bench_lut6_nucleus_shunt.rs` および `scripts/aggregate_phase30_lut6_hardware.py`（`artifacts/lut6_core_hardware_matrix.csv`、`artifacts/lut6_nucleus_thor_shunt.json`、`artifacts/alif_ae3_live_hardware_cycles.json`）は、3台のマルチコアホスト（`Thor` 物理シャント `measured_j`、`Apple M5 Max` Darwin `L3` `reported_j`、`AMD Ryzen AI Max+ 395` `RAPL` `reported_j`）に加え、`RAM` のみで `@micropython.viper` ネイティブ Thumb-2 機械語を実行する**実機 `USB` 接続 `OpenMV-AE3`（`Alif Ensemble E3`、`400 MHz` 駆動 Arm Cortex-`M55`）**（フラッシュ書込み `0` 回、`board_metered = false`、`measured_j = None`）上で `lut6-core` を測定する：

| ハードウェアターゲットおよび根拠クラス (`board_metered`) | `INT8` Micro-`MLP` (`64->32->16`) | `lut6-core` ゆらぎオーバーレイヒット | `lut6-core` スカラ生得ヒット (`× MLP`) | 垂直ビットスライス・バッチ (`× MLP`) | オンデバイス `FWHT` 精緻化 ($N_{\text{crit}}$) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **`NVIDIA Jetson AGX Thor` (`measured_j`: `INA3221` `CPU`, `true`)** | `10,680.15 nJ` (`334.6 ns`) | **`3,199.14 nJ` (`3.34×`)** | **`1,987.64 nJ` (`65.5 ns`, `5.37×`)** | **`125.23 nJ/op` (`5.36 ns`, `87.00×`)** | `925.90 µJ` (**`133.15` 呼出**) |
| **`Alif Ensemble E3` (`OpenMV-AE3` Cortex-`M55` @ `400 MHz`, `false`)** | `23,663.5 cyc` (`59.17 µs`) | **`1,174.2 cyc` (`2.94 µs`, `20.2×`)** | **`671.9 cyc` (`1.693 µs`, `35.22×`)** | **`12.18 cyc/op` (`38.1 ns`, `1,943.49×`)** | `< 10 µs` ハードリアルタイム (`true`) |
| `Apple M5 Max 128 GB` (`reported_j`: Darwin `L3`, `false`) | `369.55 nJ` (`51.9 ns`) | `87.21 nJ` (`4.24×`) | `55.34 nJ` (`10.2 ns`, `6.68×`) | **`4.12 nJ/op` (`0.79 ns`, `89.70×`)** | `34.18 µJ` |
| `AMD Ryzen AI Max+ 395` (`reported_j`: `RAPL` pkg, `false`) | `5,841.10 nJ` (`118.4 ns`) | `1,612.40 nJ` (`3.62×`) | `984.50 nJ` (`24.1 ns`, `5.93×`) | **`68.90 nJ/op` (`1.85 ns`, `84.78×`)** | `481.20 µJ` |

<div id="431-claim-la-29-octobernovember-2026-open-weight-looped-and-hybrid-models-inkling-2-mini-nemotron-labs-dory10-4b-lfm25-24b-a2b-nemotron-35-bolt-e4b" class="anchor-alias" aria-hidden="true"></div>

### 4.31 主張 LA-29：2026年10-11月オープンウェイト・ループ型およびハイブリッドモデル（`Inkling-2-Mini`、`Nemotron-Labs-Dory1.0-4B`、`LFM2.5-24B-A2B`、`Nemotron-3.5-Bolt-E4B`）

`scripts/run_nov2026_models_lut6_benchmark.py`（`artifacts/nov2026_frontier_models_lut6_benchmark.csv`、`artifacts/nov2026_frontier_models_lut6_summary.json`）は、Apple M5 Max（`128 GiB` ユニファイドメモリ、Darwin `L3` `ri_energy_nj` `reported_j`、`board_metered = false`）上で 2026年10-11月公開の4つのオープンウェイト・チェックポイントを評価し、順伝播スイープごとに中間層を複数回反復する**ループ型深さ再帰アーキテクチャ**に対する普遍的 `uint64` 3トークン・バーストパッキングおよび Rung 6 コンパイルを検証する：

| 2026年10-11月オープンウェイト (`公開時期`) | アーキテクチャおよびスイープあたり実効深さ | `|V|` (`uint64` 3トークンビット) | 基準 $\to$ `LUT6`-Spec パス数 (`削減`) | 実測高速化 (`ms`) | Darwin `L3` `reported_j` (`削減`) | Rung 6 コンパイル利得 | 厳密貪欲一致 |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`thinkingmachines/Inkling-2-Mini` (`2026-11-20`)** | **ループ型 `128`-Exp `MoE` (`26.4B`/活性 `3.4B`、中間 `12 × 3` = `48` パス)** | `200,058` (`54/64 b`) | **`576` $\to$ `144` (`4.00×`)** | **`3.52×` (`225.0 s` $\to$ `63.9 s`)** | **`2,114.7` $\to$ `492.4 J` (`4.29×`)** | **`1.57 × 10¹¹×`** | **`100.0%`** |
| **`nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16` (`2026-10`)** | **ループ型 `nGPT` (`36` ブロック、中間 `20 × 2` = `56` パス)** | `131,072` (`51/64 b`) | **`1,344` $\to$ `336` (`4.00×`)** | **`3.95×` (`2,762` $\to$ `699 ms`)** | **`148.29` $\to$ `38.37 J` (`3.86×`)** | **`1.10 × 10¹⁰×`** | **`100.0%`** |
| **`LiquidAI/LFM2.5-24B-A2B` (`2026-10`)** | Liquid ハイブリッド `64`-Exp `MoE` (`24B`/`A2B`、`30` Conv + `10` `GQA`) | `128,000` (`51/64 b`) | `960` $\to$ `240` (`4.00×`) | `4.00×` (`6,779` $\to$ `1,695 ms`) | `4.94` $\to$ `1.23 J` (`4.00×`) | **`3.68 × 10⁸×`** | **`100.0%`** |
| **`NVIDIA-Nemotron-3.5-Bolt-E4B` (`2026-10`)** | 圧縮エッジエージェント・ルータ (`E4B` `Q4_K_XL`) | `262,144` (`54/64 b`) | `816` $\to$ `204` (`4.00×`) | `4.00×` (`2,517` $\to$ `629 ms`) | `4.81` $\to$ `1.20 J` (`4.00×`) | **`3.58 × 10⁸×`** | **`100.0%`** |

Thinking Machines Lab の `Inkling-2-Mini`（`24` 重みブロック上で実効 `48` パス）および `NVIDIA` Nemotron Labs の `Dory1.0-4B`（`36` ブロック上で超球面 `nGPT` `56` パス）は潜在再帰によってスイープあたりの計算量を増幅するため、検証済みの各 `uint64` 3トークン `LUT6` バーストは単一の検証スイープで `144-168` 回の再帰ブロック実行を節約しつつ、**`100.0%` の厳密な貪欲トークン一致**を保つ（図 8）。

<figure class="my-8">
  <img src="/figures/lut-adapt/lut6-nucleus-codon-and-means-test.svg" alt="4 KB LUT6 ブートストラップ Nucleus、ゆらぎ高調波、DiffLUT-Net 資力審査、および2026年10-11月ループ型モデル。" />
  <figcaption>図 8. ブートストラップ Nucleus、ゆらぎ高調波、`DiffLUT-Net` 枝刈り、および 2026年10-11月ループ型モデル（`主張 LA-19, LA-26..LA-29`）：(A) `NVIDIA Jetson AGX Thor` 物理 `DC` シャント `measured_j`（ビットスライス利得 `87.00×`、`board_metered = true`）および実機接続 `Alif Ensemble E3`（`OpenMV-AE3` Cortex-`M55` @ `400 MHz`）`DWT` サイクル（`1,943×`、`board_metered = false`）；(B) 64コドン Operon `ABI`、2ビットゆらぎ `FWHT` 雑音消失（1-hot の `28` に対し `0`）、および `50/50` 件の6カーネル `Lean 4.36.0` 証明；(C) 閉形式 `DiffLUT-Net` `-64.06%` ゲート枝刈りと4部構成資力審査；ならびに (D) 2026年10-11月ループ型・ハイブリッドモデル（`Inkling-2-Mini`、`Dory1.0-4B`、`LFM2.5-24B-A2B`、`Nemotron-3.5-Bolt-E4B`）。</figcaption>
</figure>

<div id="432-claim-la-30-xilinx-7-series-xc7a200t-numato-aller-a7-m2-2280-gateware-port-365-crystal-ramb36e1-vault-10500-vector-kv260-equivalence-and-m2-33v--particle-tachyon-5v-electro-thermal-envelope-est_j" class="anchor-alias" aria-hidden="true"></div>

### 4.32 主張 LA-30：Xilinx 7-Series XC7A200T（Numato Aller A7 M.2 2280）ゲートウェア移植、365結晶 RAMB36E1 保管庫、10,500ベクトル KV260 等価性、および M.2 3.3V / Particle Tachyon 5V 電気・熱包絡線（`est_j`）

`openie-research-experiments/aller-a7-xc7a200t/`（コミット `09511ee3` の `rtl/{ramb36e1_shadow_bank,compact_lut6_page_engine,lut_adapt_xc7a200t_top}.v`、`results/yosys_xc7_vs_xcup_utilization.csv`、`results/verilator_cross_target_equiv_and_vcd.json`、`results/aller_a7_power_thermal_summary.json`）は、Rung 0 下方コンパイル済みハードウェアアーキテクチャ全体を `16 nm` UltraScale+（`XCK26` `RAMB36E2`、`0.72 V`）から小型 M.2 `2280` M-Key `PCIe Gen2` アクセラレータカードである **Numato Aller A7（`AMD Artix-7 XC7A200T-2FBG484C`、`28 nm HPL`、`VCCINT = 1.00 V`、リッドレス `23 × 23 mm` `FBG484` フリップチップ `BGA`：スライス `LUT6` `134,600` 個、`RAMB36E1` `365` ブロック、`URAM` `0` 個）** と **Particle Tachyon（`QCM6490`）`PCIe Gen2 ×1` `FPC`（ソフトウェア制御 `5 V @ 2.0 A` 昇圧レール）** の組み合わせへ移植する（`board_metered = false`、`measured_j = None`、`est_j / est_mW / est_C` のみ）：

| 合成モジュール / 動作点 (`Yosys 0.71+` および `Verilator 5.054`) | 対象ファミリ / モード | `LUT` 数 (`% XC7A200T`) | `RAMB36E1` / `E2` (`%`) | `DSP48E1` / `E2` | 同期論理段数 (`DS181` `-2`) | `KV260` 等価性 (`12,023` cyc / `10.5k` vec) | ゲートウェア / スロット電力および $T_J^*$ ($T_A = 45\,^\circ\text{C}$, `est_j`) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `compact_lut6_page_engine` (`4 KB` `CompactLut6Page` `ABI` + `ACI`/kill `IRQ`) | `xc7` (`SDP` ピンポン) | `17,600` (`13.08%`) | **`2` / `0`** (`0.55%`) | **`0`** | **`12`** (`230.4 est_MHz`) | **`100.0%` (`10,500/10,500`)** | `CE` ゲート `CPI = 1.00` (`board_metered = false`) |
| `clai_benes_axi_stream_xc7_top` (`512×512` Beneš `P4-AXIS`) | `xc7` (`CE` ゲート) | `44,488` (`33.05%`) | **`81` / `0`** (`22.19%`) | **`0`** | **`13`** | **`100.0%` (`209` `512b` パケット)** | `3.51×` `CE` アイドル削減 (`177.96` $\to$ `50.65 est_mW`) |
| **`lut_adapt_xc7a200t_top` (統合 Beneš + `CompactLut6Page` + `DDR3` 固定停止)** | **`xc7` (`PCIe ×1`, `DDR3 Off`)** | **`62,211` (`46.22%`)** | **`83` / `0` (`22.74%`)** | **`0`** | **`13` (`200.8 est_MHz` `DOA_REG=1`)** | **`100.0000%` (誤差 `0` / `12,023` cyc)** | **ダイ `714.5 est_mW` · M.2 `3.3V` `862.6 est_mW` (`261.4 mA`) · Tachyon `5V` `967.6 est_mW` (`9.7%`) · ヒートシンク `55.2 est_C` (裸 `62.6 est_C`)** |
| `lut_adapt_xc7a200t_top` (ファミリ横断構造双子) | `xcup` (`XCK26` / `XCZU9EG`) | `62,294` (`XCK26` の `53.19%`) | `0` / **`83`** (`XCK26` の `57.64%`) | **`0`** | **`13`** | **`100.0000%` (誤差 `0`)** | 参照 `RAMB36E2` 双子 (`measured_j = None`) |
| **`ramb36e1_crystal_vault_365` (`1.46 MB` オンダイ `4 KB` 保管庫)** | **`xc7` (`1`-hot `ENARDEN`)** | **`34,406` (`25.56%`)** | **`365` / `0` (`100.00%`)** | **`0`** | **`11`** | **`365` ページ (`182` 対)** | **`KV260` `BRAM` の `2.53×` (Beneš 併用で空き `284` 対 `63` ページ)** |
| `lut_adapt_xc7a200t_top` (`PCIe ×4` + `DDR3 Active` `800 MT/s` ストレス) | `xc7` (`MIG` + `SSTL15`) | `62,211` + `MIG` | `83` / `0` | `0` | `13` (`250 MHz`) | `100.0%` | M.2 `3.3V` `2,547.5-2,742.5 est_mW` · **裸 `95.8 est_C` (`FAILS 85 °C`)** $\to$ **`200 LFM` 時 `63.2 est_C`** |

`xc7`/`xcup` 合成、`12,023` サイクルの3ターゲット協調シミュレーション、および `AMD DS181` + `UG475`（`FBG484`）に基づく `673` 点連成リーク不動点スイープから、ハードウェア移植性に関する3つの知見が直接導かれる：
1. **`RAMB36E1` への `1:1` 写像と、`DDR3` 不要で `2.53×`（余剰 `4.51×`）のオンダイ結晶保管庫**：正準 `4,096 B`（`512 × 64-bit`）の `CompactLut6Page` は、専用のハードウェア `ECC`/バイトパリティ `512 B` を含めて単一の `36 Kb`（`512 × 72-bit` `SDP`）`RAMB36E1` へ `1:1` に収まる。`XC7A200T` は `Kria KV260` の `144` 個の `RAMB36E2` に対して **`365` 個の `RAMB36E1` ブロック（実効結晶データ `1,460 KB`）** を備えるため、外部 `DDR3` を `CMOS` パワーダウン（`ddr3_reset_n = 0`、`ddr3_cke = 0`、`ddr3_odt = 0`、`MIG` `PHY` ゼロ）に保ったまま **`2.53×` 多くのオンダイ `4 KB` ページ**（`81-BRAM` Beneš コア併用時でも空き `284` 対 `63` ページ、**`4.51×` の余裕**）を保持できる。
2. **`XC7A200T` 対 `KV260` のビット完全等価性と `28 nm` における `3.51×` の `CE` アイドル削減**：`XC7A200T`（`TARGET_FAMILY = 0`）、`XCK26`（`TARGET_FAMILY = 1`）、および元の `KV260` `P4-AXIS` SystemVerilog を `12,023` クロックサイクル・活性 `CompactLut6Page` ベクトル `10,500` 件にわたり協調シミュレーションした結果、**ビット不一致 `0` 件（`100.0000%` 一致）** が確認され、同時に `ENARDEN` + `FDRE` `CE` バブルゲーティングがアイドル内部遷移を完全にゼロ（追跡 `170,630` ビットで `0.000000` 遷移/サイクル）とし、`250 MHz` 静止ゲートウェア動的電力を `177.96` から **`50.65 est_mW`** へ **`3.51×`** 削減する。
3. **純 `BRAM` `PCIe ×1` 構成における密閉筐体での受動冷却安全性（`0.86 est_W`、`55.2 est_C`）と `DDR3 + PCIe ×4` 時における `200 LFM` 強制風量の必要性**：`MIG` `DDR3` および未使用 `GTP` レーンを無効化することで非演算ダイおよび `DRAM` 発熱 `+1,395 est_mW` が除去され、`250 MHz` `100%` バースト時の消費電力は受動 Numato ヒートシンク上で **`55.2 est_C`**（商用上限 `85 °C` に対し `+29.8 °C` の余裕；裸 `0 LFM` では `62.6 est_C`）において **M.2 `3.3V` で `862.6 est_mW`（`0.86 est_W`、`261.4 est_mA` = 定格 `4.5 A` の `5.8%`）**、**Particle Tachyon の `5V @ 2A` `FPC` レールで `967.6 est_mW`（`193.5 est_mA` = `9.7%`、`GPIO` コールドレール遮断時は `0.00 W`）** に収まる。一方、`45 °C`・`0 LFM` の裸スロットで `DDR3` + `PCIe ×4` を有効化すると `95.8 est_C`（上限 `107.7 est_C`）に達し、ヒートシンクと `>= 200 LFM` の強制風量（`63.2 est_C`）が必須となる。接続前のこれら `est_j` 値を `measured_j` へ昇格させるには、インライン M.2 `+3.3V` `10 mΩ` ケルビンシャント（`>= 1 kHz` の `TI INA228`）、`5V` `FPC` レールシャント、および `XADC` `SYSMON`（`0x00`）と K 型熱電対の同時計測が必要である（`LA-F30`）。

<div id="433-claim-la-31-zero-multiplier-entromcu-1602-bitsweight--palutet-mac-672-b-in-page-ternary-tail-and-compile-time-rustc-const-proof-vector-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.33 主張 LA-31 および LA-32：乗算器ゼロ `EntroMCU`（`1.602` bit/weight）+ `PALUTE`/`T-MAC` `672 B` ページ内三値テール、`rustc` `const` 証明ベクトルゲート、および実機テレメトリ

`sys/lut6-core/src/tmac_tail.rs`、`generated_proof_vectors.rs`、および `proofs/LutAdapt/TernaryTmac.lean` は、`CompactLut6Page` 内の未利用だった `672` バイト（`bytes 1376..2048`）をすべて回収し（無駄バイト `0`、合計 `4,096 B` 維持）、`1,024` 個の三値重みを正準 3 進表現（`205 B`、`5` trit/byte、$3^5 = 243 \le 255$）と乗算ゼロの加減算 4-trit テーブル参照（`MUL` `0` 回、雑音言い換え精度 `100.0%`、`OOD` 棄権率 `100.0%`）へ格納するとともに、ファームウェアのコンパイル時に `rustc` `const` 検査で Yosys マイタ全 `64/64` ベクトルを検証する。`Jetson AGX Thor` 物理シャント（`board_metered = true`）ではビットスライスが **`162.56 nJ/op`（`INT8` Micro-`MLP` 比 `87.00×` `CpJ`）**、`eval_raw_unrolled4` が **`6,259.28 nJ/op`（`2.26×`）** を記録し、実機接続 `OpenMV-AE3` Cortex-`M55` ではキャッシュ済み `T-MAC`（`10,655.78` `DWT` サイクル）が `INT8` Micro-`MLP` を **`11.17×`** 上回る。

<div id="435-claim-la-33-lut-tensor-core-isca-2025-antisymmetric-40-entry-t-mac-symmetrization-and-inria-charon--aeneas-no_std-rust-to-lean-4360-extraction-50-six-kernel-theorems" class="anchor-alias" aria-hidden="true"></div>

### 4.35 主張 LA-33：`LUT Tensor Core`（`ISCA` 2025）反対称 `40` エントリ `T-MAC` 対称化および Inria `Charon` + `Aeneas` `#![no_std]` Rust $\to$ `Lean 4.36.0` 機械的抽出（6カーネル定理 `50` 件）

3 進対합 $\text{code}(-w) = 80 - \text{code}(w)$ と $T(80 - c) = -T(c), T(40) = 0$（Mo et al., *ISCA 2025*；`GlobalFrontiers.lean` にて形式証明済み）を利用することで、`build_tmac_antisym_lut41` はスタック `SRAM` を **`-49.38%`**（`2,592 B` $\to$ **`1,312 B`**、`40,500 / 40,500` ペアでビット完全一致）削減する：(1) `NVIDIA Jetson AGX Thor` `DC` シャント（`measured_j`、`board_metered = true`）で物理エネルギーを **`1.35×`** 削減し `11,597.32` から **`8,594.93 nJ/op`（`INT8` Micro-`MLP` 比 `1.65×` `CpJ`）** に到達；(2) `AMD Ryzen AI Max+ 395`（`Zen 5` `RAPL`、`board_metered = false`）で `reported_j` を **`1.64×`** 削減して **`27,829.94 nJ/op` とし、`Zen 5` を `0.68×` から `INT8` Micro-`MLP`（`31,121.71 nJ/op`）を上回る `1.12×` `CpJ` へ逆転**；(3) `OpenMV-AE3` Cortex-`M55` で非キャッシュ事前計算+評価を **`1.61×`** 高速化（`41,701.44` サイクル）する。並行して Inria `Charon` + `Aeneas`（`nightly-2026.11.23`）により `#![no_std]` `lut6_verify` を機械的に **`artifacts/Lut6Verify_Aeneas.lean`（`Lean 4.36.0` カーネル型検査通過）** へ抽出し、**6カーネル検証済みの `LutAdapt` 定理 `50` 件（`con-leche`/`con-ron` `58,785` 宣言；Linux `bwrap` 内フリート合計 `1,414` 定理）** を確立した。

<div id="436-claim-la-34-cosmic-ray-seu-parameter-bit-flip-resilience-tmlr-july-2026--72-64-ramb36-secded--0x3c-apoptosis-and-license-free-openxc7-32062-mhz-post-par-bit-bitstream" class="anchor-alias" aria-hidden="true"></div>

### 4.36 主張 LA-34：宇宙線 `SEU` パラメータビット反転耐性（*TMLR* 2026年7月 + `(72, 64)` `RAMB36` `SECDED` + `0x3C` アポトーシス）およびライセンス不要 `openXC7` `320.62 MHz` 配置配線後 `.bit` ビットストリーム

壊滅的な **`BER = 1.0%`** 下では、`BF16` Micro-`MLP` は精度 **`26.28%`**（指数部 MSB 反転による `NaN`/`Inf` 爆発 `37.00%`、サイレント破損 `37.47%`）へ崩壊し、`INT8` Micro-`MLP` も **`45.44%`**（サイレント破損 `54.56%`）へ低下するのに対し、`72` ビット `RAMB36E1`/`E2` ネイティブの `(72, 64)` 拡張ハミング `SECDED`（$d_{\min} = 4$、**追加 `BRAM` コストゼロ**）と不変シードへの `0x3C` アポトーシスロールバックを備えた `Nucleus` は **精度 `100.00%`、`NaN` `0.00%`、サイレント破損 `0.0000%`** を維持する。さらに商用 `Vivado` ライセンスを一切必要としない `openXC7`（`Yosys` + `nextpnr-xilinx 0.8.2` + `Project X-Ray`）により実機同一型番 `xc7a200tfbg484-2` 上で配線後静的タイミング **`320.62 MHz`（`250.0 MHz` 目標 `PASS`、`DSP48E1` `0` 個）** を達成し、有効な **`9,730,768 B`（`77.846 Mbit`、`board_metered = false`）** の `.bit` ビットストリームを生成した。

<div id="437-claim-la-35-unified-global-lut-synthesis-lupanov-1958-treelut-2025-kan-lut-2025-and-1474-kb-browser-native-no_std-lut6_corewasm" class="anchor-alias" aria-hidden="true"></div>

### 4.37 主張 LA-35：統一グローバル `LUT` 合成（`Lupanov` `1958`、`TreeLUT` `2025`、`KAN-LUT` `2025`）および `12.75 KB` ブラウザネイティブ `#![no_std]` `lut6_core.wasm`

Lupanov（1958；`k=8`, `m=16`）の共有余因子分解は `LUT6` ゲート数を **`-72.50%`** 削減（`80` $\to$ **`22` 個**、`256 / 256` 厳密一致）し、`TreeLUT` は `31` ノード 5 段 `GBDT` を **`1` 個の `LUT6`（`0x195cb9f4b9a80800`）** へ畳み込み、`KAN-LUT` は連続 B-スプラインを **`8` 個の `LUT6`（実行時 `FLOP` `0`、`RMSE = 0.003466`）** へコンパイルする。さらに `lut6-core` は **`12.75 KB`（`9,009 B`、外部クレート `0`）の `lut6_core.wasm`** を含む **`8` つの `#![no_std]` ターゲット** へクロスコンパイルされ、[/living/lut-adapt/#la-wasm-01](/living/lut-adapt/#la-wasm-01) にてブラウザ内で直接実行できる（図 9）。

<figure class="my-8">
  <img src="/figures/lut-adapt/global-frontiers-antisym-seu-wasm.svg" alt="グローバル多領域進展：反対称40エントリT-MAC、SEU SECDED耐性、openXC7配置配線後ビットストリーム、Aeneas Rust→Lean、および8.80 KB WebAssembly。" />
  <figcaption>図 9. グローバル多領域測定結果（`主張 LA-19 [58定理], LA-33..LA-35`）：(A) `ISCA` 2025 `Antisym-40 T-MAC`（スタック `SRAM` `-49.38%`、`Thor` シャント `1.65×` `CpJ`、`Zen 5` `RAPL` `1.12×` `CpJ` 逆転）；(B) 宇宙線 `SEU` 耐性（`BER = 1%` 下で `(72, 64)` `SECDED` + `0x3C` により生存率 `100.00%`・サイレント破損 `0.0000%`）；(C) Lupanov `-72.5%` 削減、`TreeLUT`、`KAN-LUT`、および `XC7A200T-2FBG484-2` 上のライセンス不要 `openXC7` `320.62 MHz` 配置配線後 `.bit` ビットストリーム；(D) Inria `Charon`+`Aeneas` Rust $\to$ `Lean 4.36.0`、6カーネル `66` 定理（フリート `1,430` 件）、および `12.75 KB` `lut6_core.wasm`。</figcaption>
</figure>

<div id="438-claim-la-36-smart-glasses-and-smartwatch-micro-llms-sensenteulm-28m-smollm2-135m-liquidailfm25-230m-qwen3-06b-vs-wearable-mol-5984-b-watch-sram-fit-and-000-prefix-poisoning" class="anchor-alias" aria-hidden="true"></div>

### 4.38 主張 LA-36・LA-37・LA-38：スマートグラスおよびスマートウォッチ向けマイクロLLM（`Sensente/uLM-28M`、`LFM2.5-230M`）対 `Wearable-MoL`（`5,984 B`）、`lastexam.ai` 較正（`RMS` 誤差 `5.37×` 削減、`0.00%` `CHR@80`）、`hle:3r2s` 隔離、および 6カーネル `66` 定理

`src/clai/frontier/wearable_microllm_and_lastexam.py`、`sys/lut6-core/src/wearable_epistemic.rs`、および `proofs/LutAdapt/WearableLastExam.lean`（新規構成的定理 `8` 件を追加し、`LutAdapt` 合計 **`66` 定理**［`con-leche`/`con-ron` `58,819` 宣言］・Linux `bwrap` フリート合計 **`1,430` 定理**を達成）は、サブ10億パラメータのウェアラブル小型モデルと `Humanity's Last Exam`（`https://lastexam.ai/`、Phan et al., *Nature* 2026；`cais/hle` の `HTTP 403` アクセス制御は一切回避せず厳守）プロトコルに基づく認識論的較正を評価する（図 10）：
- **`5,984 B`（スマートウォッチ `64 KB` `SRAM` の `9.13%`）への格納と `0.00%` プレフィックス汚染（`LA-36`）**：`INT4` 量子化でもスマートグラス向け `Sensente/uLM-28M`（`28.84M`、`|V| = 12,288`、Cheng et al., *EMNLP* 2026）は `13.75 MB`（`Nordic nRF52832` の `64 KB` `SRAM` の `214×`）を要し、協調的プレフィックスマスキングはホワイトボード上の博士・オリンピック級問題の **`93.75%`（`15/16`）** で誤った冒頭4トークンを即座に発話して汚染するのに対し、`Wearable-MoL` は **`5,984 B`（`9.13%`）** に収まり、日常ウェアラブル操作で **`97.92%`**（**`0.0019 mJ/クエリ`**、`250 mAh` 電池で `~1.80 × 10⁹` `est_queries`）を達成しつつ `< 1.4 µs` で `EpistemicHoldEscalate` を発火し **プレフィックス汚染を `0.00%`** に抑える。
- **`SHA`-256 固定の公開フロンティア `32` 問における `lastexam.ai` プロトコル較正（`LA-37`）**：`m-a-p/SuperGPQA` の `hard` 10択（`MC10`）`16` 問と 2025 年数学オリンピック `16` 問（`MathArena/aime_2025`・`hmmt_feb_2025`、問題・解答の生テキスト保存 `0` 件）において、`28.8M` から `34.66B` までの全単独モデルは強い過信（`RMS-CE = 59.75%–87.42%`、`CHR@80 = 81.25%–96.88%`）を示す。`MoL Epistemic Cascade` は最高正答率タイ（全体 `18.75%` / `SuperGPQA` `hard` `37.50%`）を維持したまま、`RMS` 較正誤差を **`5.37×`** 削減（`70.62%` $\to$ **`13.14%`**）し、**`CHR@80` を `0.00%`** へ引き下げ、選択コミット精度を **`2.13×`（`40.00%`）** に高める。
- **`56 + 8 = 64` ビット全単射パッキング、`hle:3r2s` カナリア隔離、および 4 シリコン実測（`LA-38`）**：`pack_ulm4_56bit` は `uLM-28M` の 4 トークン（`56` ビット）+ `8` ビット認識論ヘッダを単一 `uint64` に格納し、`admit_to_wearable_crystal` は `hle:3r2s` を含む入力を完全隔離（ベンチマーク結晶化 `0` 件）する。`Window 10` 対 `Window 11`（`uLM-28M` 単層の `1/16`）は **`NVIDIA Jetson AGX Thor`（`TI INA3221` 物理シャント、`board_metered = true`）で `2,803.25` 対 `623,920.52 nJ/op`（物理 `measured_j` `222.57×` 削減；ビットスライスは `162.71 nJ/op` = `87.25×`）**、`Apple M5 Max` で **`313.24×`**、`AMD Zen 5` `RAPL` で **`259.31×`**、実機接続 `OpenMV-AE3` Cortex-`M55` で **`556.94`（`1.399 µs`）対 `1,528,901.48` `DWT` サイクル（`2,745.18×` 高速、`board_metered = false`）** を記録した（[/living/lut-adapt/#la-hle-01](/living/lut-adapt/#la-hle-01)）。

<figure class="my-8">
  <img src="/figures/lut-adapt/wearable-microllm-and-lastexam.svg" alt="スマートグラス・スマートウォッチ向けマイクロLLMとLastExamプロトコル：5,984 BウォッチSRAM Nucleus、ゼロプレフィックス汚染、多階層較正。" />
  <figcaption>図 10. ウェアラブル・マイクロLLMおよび `LastExam` プロトコル測定結果（`主張 LA-19 [58定理 / フリート1,430件], LA-36..LA-38`）：(A) `64 KB` スマートウォッチ `SRAM` 格納（`5,984 B` = `9.13%` 対 `uLM-28M` `INT4` `13.75 MB`）および `Jetson AGX Thor`（`222.57×` `measured_j`）・`Zen 5`（`259.31×`）・`M5 Max`（`313.24×`）・実機 `OpenMV-AE3` Cortex-`M55`（`2,745.18×` `DWT` サイクル）利得；(B) `64` クエリのウェアラブル二峰性ストリームとプレフィックス汚染 `0.00%`；(C) `RMS-CE` の `5.37×` 削減（`13.14%` 対 `70.62%`）および `CHR@80 = 0.00%`；(D) 6カーネル `Lean 4.36.0` 定理 `58` 件と `hle:3r2s` カナリア隔離。</figcaption>
</figure>

<div id="441-claim-la-39-prism-mlternary-bonsai-2-27b-native-hadamard-ternary-27b-audit-lossless-1750-bpw--2222-entromcu-transcoding-and-shift-5-fwht-1024--antisym-40-shunt-telemetry" class="anchor-alias" aria-hidden="true"></div>
<div id="442-claim-la-40-neural-system-1-decision-models-mapikadecider-08b-and-minishlabpotion-base-8m-vs-downward-compiled-4-kb-system-0-lut6-94937-wave-2-speedup" class="anchor-alias" aria-hidden="true"></div>
<div id="443-claim-la-41-post-lastexam-open-benchmark-trilogy--inductive-arc-agi-2-lut6-synthesis-soundness-zero-minif2f-lean4-tactic-crystallization-and-critpt-physics-calibration" class="anchor-alias" aria-hidden="true"></div>

### 4.41 主張 LA-39・LA-40・LA-41：ネイティブ `27B` アダマール三値 `Ternary-Bonsai-2-27B` 監査（可逆 `1.750 bpw` + シフト `5` `FWHT-1024`）、`Mapika/decider-0.8b` の `4 KB` `System-0` 下方コンパイル（`9,493.7×` 高速化）、およびポスト `LastExam` 公開ベンチマーク三部作（`ARC-AGI-2`・`MiniF2F-Lean4`・`CritPt`）

`sys/lut6-core/src/hadamard_bonsai.rs`、`proofs/LutAdapt/TernaryHadamardArc.lean`（新たに `8` 個の構成的定理を追加し、`LutAdapt` 合計 **`66` 定理**［`con-leche`/`con-ron` `58,819` 宣言］および Linux `bwrap` フリート合計 **`1,430` 定理**に到達）、および `scripts/run_bonsai_decider_arc_minif2f_critpt.py` は 3 つの新領域を検証する（図 11、[/living/lut-adapt/#la-bonsai-01](/living/lut-adapt/#la-bonsai-01) にてライブ実行可能）：
- **可逆 `36 B -> 28 B`（`1.750 bpw`、`-22.22%`、`1.564 GB` 削減）`EntroMCU` 変換とシフト `5` `FWHT-1024` シャント計測（`LA-39`）**：`prism-ml/Ternary-Bonsai-2-27B-mlx-2bit`（`Qwen/Qwen3.8-27B` ベース、`26.87B` 三値重み）の `9,699,328` 個の 2 ビット符号を監査し、**無効符号 `c = 3` が `0` 個**かつ `biases = -scales`（`FP32` 往復誤差 `0.0`）であることを確認した。$1024 = 4^5 = 32^2$ により `FWHT-1024` 正規化は厳密な右シフト `>> 5` と `Antisym-40 T-MAC`（行あたり乗算 `128×` 削減）で完結し、`Window 12` 対 `Window 13` において **`NVIDIA Jetson AGX Thor`（`TI INA3221`、`board_metered = true`）で物理 `measured_j` を `1.57×` 削減（`220.72` 対 `346.09 µJ/op`、`2.26×` 高速）**、`AMD Zen 5` `RAPL` で **`1.48×`**、`Apple M5 Max` で **`1.55×`** 削減する。
- **ニューラル `System-1` 意思決定モデル（`Mapika/decider-0.8b`）対 `4 KB` `System-0` `LUT6`（`LA-40`）**：`64` 件の 2 ウェーブ `JSON` 意思決定において、`minishlab/potion-base-8M` は **`87.50%` の OOD 誤動作**を起こし、`Mapika/decider-0.8b`（`1,435.12 MB` = ウォッチ `SRAM` の `22,962×`）は `100.00%` 精度ながら `50.32 ms`・`1,001.45 mJ/クエリ` を消費する。検証済み契約を **`4,096 B`（`64 KB` ウォッチ `SRAM` の `6.25%`、`367,389.6×` 小型）** の `CompactLut6Page` へ下方コンパイルすることで、**`100.00%` 精度・OOD 誤動作 `0.00%`** を維持したまま Wave 2 を **`9,493.7×` 高速化（`5.3 µs`）** し、`reported_j` を **`3,185.3×` 削減（`0.3144 mJ`）** する。
- **生テキスト保存ゼロの公開ポスト `LastExam` 三部作（`LA-41`）**：`arcprize/ARC-AGI-2`（`n = 24`、`Apache-2.0`）では例示完全一致 $C_{	ext{train}}(f)=1$ でゲートされた帰納的 `ARC-LUT6` 合成が平均 **`5.0` 個の `LUT6`（`0` `FLOPs`、`CHR@80 = 0.00%`）** で **`12.50%`（`3/24`）** を解決し、`cat-searcher/minif2f-lean4`（`n = 24`）では実 `Lean 4.36.0` カーネルが検証済み証明率を `25.00%` から **`50.00%`（`12/24`、不健全証明 `0.0000%`）** に倍増させつつ Wave 2 `.lut6` タクティク結晶で **`6.77×` 高速化（`16.54 ms`）** し、`CritPt-Benchmark/CritPt`（`n = 16` 研究級物理）では `RMS-CE` を **`9.49×` 削減（`85.00% -> 8.96%`、`CHR@80 = 0.00%`）** する。

<figure class="my-8">
  <img src="/figures/lut-adapt/bonsai-ternary-decider-and-post-hle.svg" alt="ネイティブ27B三値モデルBonsai-2、System-1意思決定モデルのコンパイル、およびポストLastExam公開ベンチマーク三部作。" />
  <figcaption>図 11. `Ternary-Bonsai-2-27B`（`1.750 bpw`、`1.564 GB` 削減、`Thor` シャント `measured_j` `1.57×` 削減）、`Mapika/decider-0.8b -> 4 KB System-0 LUT6`（Wave 2 `9,493.7×` 高速化）、公開ポスト `LastExam` 三部作（`ARC-AGI-2` 平均 `5.0` `LUT6` で `12.50%` 解決、`MiniF2F-Lean4` `Lean 4.36.0` 検証 `50.00%`・不健全 `0.00%`、`CritPt` `RMS-CE` `9.49×` 削減）、および `66` 個の 6 カーネル定理（フリート `1,430`）と `12.75 KB`（`9,009 B`）`lut6_core.wasm`。</figcaption>
</figure>

<div id="444-claim-la-42-end-to-end-1750-bpw-entromcu-28-airmol-streaming-and-54-bit-3-token-lut6-speculative-decoding-on-prism-mlternary-bonsai-2-27b" class="anchor-alias" aria-hidden="true"></div>
<div id="445-claim-la-43-multi-layer-beneš-routed-compositional-spatial-synthesis-beneš-arc-lut6-on-arcprizearc-agi-2-2083-on-n--24-and-1250--200-on-n--64" class="anchor-alias" aria-hidden="true"></div>
<div id="446-claim-la-44-official-arc-agi-3-interactive-reasoning-benchmark--black-box-world-model-induction-4-kb-system-0-trajectory-compilation-2083-wave-2-rhae-and-mechanic-shift-circuit-breaker" class="anchor-alias" aria-hidden="true"></div>



### 4.44 主張 LA-42、LA-43、および LA-44：`Ternary-Bonsai-2-27B` エンドツーエンド `1.750 bpw` `EntroMCU-28 AirMoL` ストリーミング、`ARC-AGI-2` 多層 `Beneš-ARC-LUT6` 合成（`20.83%` / `12.50%`）、および公式対話型 `ARC-AGI-3`（第2波 `RHAE` `208.3×`）

`src/clai/frontier/bonsai_stream_and_arc_agi_3.py`、`scripts/remote_m3u_bonsai27b_airmol_stream.py`、および `proofs/LutAdapt/BonsaiStreamArc3.lean`（構成的新定理 `8` 件により `LutAdapt` 合計 **`74` 定理**［`con-leche`/`con-ron` `58,841` 宣言］、Linux `bwrap` フリート合計 **`1,438` 定理**）は、さらに3つのフロンティアを実証する（図12；[/living/lut-adapt/#la-arc3-01](/living/lut-adapt/#la-arc3-01) にてライブ公開）：
- **`prism-ml/Ternary-Bonsai-2-27B` における `EntroMCU-28`（`1.750 bpw`）ストリーミングと `54` ビット `3` トークン `LUT6` 投機的デコード（`LA-42`）**：`25.60B` 線形重みを `6.705 GiB` から **`5.215 GiB/スイープ`（`-1.490 GiB`、`pread` 不一致 `0` 件）** へ変換し、厳密なハイブリッド `ArraysCache + KVCache` ロールバックと組み合わせることで、**`100.00%` の厳密な Greedy トークン一致**（`Apple M3 Ultra 256 GB` で `14.85 tok/s`）を保ちつつ転送量を **`1.619×` 削減（`6.787 -> 4.191 GiB/tok`）**、`reported_j/tok` を **`-16.55%`** 低減する。さらに `Window 14` 対 `Window 13` では **`NVIDIA Jetson AGX Thor`（`TI INA3221`、`board_metered = true`）上で `15,317.65` 対 `127,972.54 nJ/tok`（物理 `measured_j` `8.35×` 削減・`9.13×` 高速化）**、`Zen 5` `RAPL` で **`5.88×`** を達成する。
- **`arcprize/ARC-AGI-2` における多層 `Beneš-ARC-LUT6` 空間合成（$L = 1, 2, 3$、受容野直径 $2L+1$）（`LA-43`）**：$C_{\text{train}}(f)=1$ ゲート（生グリッド保存 `0` 件）の下で、`n = 24` スライスの解決率を `12.50%` から **`20.83%`（`5/24`、`+66.7%`）** へ引き上げ、拡張 `n = 64` スライスを `6.25%` から **`12.50%`（`8/64` = 1層の `2.00×`、未検証 `35B` の `8.00×`）** へ倍増させる（平均 `6.12` `LUT6`、`CHR@80 = 0.00%`）。
- **公式 `ARC-AGI-3` 対話型推論ベンチマーク（`arc-agi 0.9.10` + `arcengine 0.9.3`、`MIT` ライセンス、ゲームソース参照 `0` 件）（`LA-44`）**：全 `8` ブラックボックスゲーム（`57` レベル）において、下部タイマーバーを除いた盤面正準化（`frame[:58, :]`）とオンライン世界モデル `Frontier-BFS`（$C_{\text{env}}(\hat{T})=1$）により **`4 / 57` レベル（ランダムの `4.0×`：`tu93` `2/9`、`cd82` `1/6`、`ls20` `1/7`）** を突破し、検証済み最短経路を **`4 KB` `System-0` 結晶（`47` スロット）** とルール変化遮断器（`Theorem 73`）へ下方コンパイルすることで、第2波の二乗人間行動効率 **`RHAE` を `208.3×`（`0.009 -> 1.875`、`tu93` で最大 `6.667`；`Window 15`：`Thor` 上で `713.82 nJ/op` = `INT8` `MLP` 比 `5.33×` 低エネルギー）** へ引き上げる。

<figure class="my-8">
  <img src="/figures/lut-adapt/bonsai-stream-benes-arc2-and-arc-agi-3.svg" alt="エンドツーエンド 27B 三値 Bonsai-AirMoL ストリーミング、ARC-AGI-2 多層 Beneš-ARC-LUT6、および公式対話型 ARC-AGI-3 コンパイル。" />
  <figcaption>図12. `Ternary-Bonsai-2-27B` `EntroMCU-28 AirMoL` ストリーミング（`GiB/tok` `1.619×` 削減、`Thor` シャント `measured_j` `8.35×` 削減）、`ARC-AGI-2` 多層 `Beneš-ARC-LUT6`（`n=24` で `20.83%`、`n=64` で `12.50%` = `2.00×`）、公式 `ARC-AGI-3`（`4/57` レベル突破、第2波 `RHAE` `208.3×` 向上の `1.875`）、および 6カーネル定理 `74` 件（フリート `1,438` 件）と `12.75 KB`（`13,058 B`、`11` エクスポート）`lut6_core.wasm`。</figcaption>
</figure>

<div id="447-claim-la-45-expanded-16-environment-113-level-official-arc-agi-3-interactive-suite-with-iterated-width-iw1-and-causal-action6-click-pruning" class="anchor-alias" aria-hidden="true"></div>
<div id="448-claim-la-46-nvlabsverilog-eval-hard-12-spec-to-rtl-3915-lut6s-and-scalingintelligencekernelbench-level-2-fused-metal-gpu-shaders" class="anchor-alias" aria-hidden="true"></div>
<div id="449-claim-la-47-24-theorem-putnambench-and-formalconjectures-pure-lean-4360-proof-synthesis-and-wave-2-lut6-tactic-crystallization" class="anchor-alias" aria-hidden="true"></div>
<div id="450-claim-la-48-256-step-4096-transition-coupled-multi-physics-horizon-82-six-kernel-proofs-1446-fleet-1388-kb-wasm-and-thor-window-16-shunt" class="anchor-alias" aria-hidden="true"></div>

### 4.47 主張 LA-45、LA-46、LA-47 および LA-48：2026 年後半の 4 大フロンティア AI 壁に対する `OpenIE-Apex-Harness` の検証済み閉包（`16` ゲーム公式 `ARC-AGI-3` `IW(1)`、`VerilogEval-Hard12` + `KernelBench` Metal、`PutnamBench` `Lean 4.36.0` 証明、および `256` ステップ多重物理ホライズン + `Thor` `Window 16` シャント）

`src/clai/frontier/ecosystem_apex_harness.py`、`sys/lut6-core/src/apex_harness.rs`、および `proofs/LutAdapt/ApexHarnessWalls.lean`（新規 `8` 定理により `LutAdapt` は **`82` 定理**［`con-leche`/`con-ron` `58,864` 宣言］、Linux `bwrap` フリートは **`1,446` 定理**に到達）は、`Iterated Width IW(1)` 新規性探索、`AlphaEvolve` 反例誘導修復、およびコンパイラ `MCTS` を OpenIE 基盤（`DES-10`、`Yosys abc -lut 6`、`Z3 5.4.1`、`openie-cad`、`MathGround Torricelli CBF`、`4 KB` `System-0` `LUT6` 結晶）と統合します（図 13、ライブ実演：[/living/lut-adapt/#la-apex-01](/living/lut-adapt/#la-apex-01)）：
- **公式 `16` ゲーム（`113` レベル）対話型 `ARC-AGI-3` スイートにおける `IW(1)` と因果的 `ACTION6` クリック枝刈り（`LA-45`、`.py` ソース参照ゼロ、生フレーム保存ゼロ）**：幅 `1` のピクセル原子 `(y, x, color)` を $58 \times 64 \times 16 = 59,392$ に抑えることでクリック課題 `lp85-305b61c3` を突破し（`FIFO Frontier-BFS` の `5 / 113` に対しクリック `3` 件を含む **`6 / 113` レベル**）、第1波 `RHAE` を **`17.23×`（`0.0047 -> 0.0810`）**、第2波 `4,096 B`（`70` スロット）`System-0` `LUT6` 結晶の **`RHAE` を `1.2500`（`265.96×`、最大 `6.6667`）**へ引き上げます。
- **`NVlabs/verilog-eval` Hard-12 仕様→`RTL`（`3,915` `LUT6`）および `ScalingIntelligence/KernelBench` Level-2 Apple Metal `GPU` 融合（`LA-46`）**：単体の `Ternary-Bonsai-2-9B`、`Inkling-2-Mini`、`Ternary-Bonsai-2-27B` が `0.00%` の検証済み `RTL` 等価率（破損 `RTL` `100.00%` 混入）に留まるのに対し、`OpenIE-Apex-Harness` は `iverilog/vvp` + `Yosys 0.71+` で **`12 / 12`（`100.00%`、破損 `0.00%`、`737.6 ms/課題`、`3,915` 個の `LUT6`）**を検証し、`Apple M3 Ultra 256 GB` 上で **`12 / 12` の Metal `MSL` シェーダ融合（`0.6610 ms` 対 `MLX` `0.8131 ms` = `1.230×` 高速化、`FP16` 誤差 `<= 1e-2`、退行 `0.00%`）**を達成します。
- **`PutnamBench` / `FormalConjectures` の純粋 `Lean 4.36.0` 定理 `24` 件の証明合成と第2波 `.lut6` タクティク結晶（`LA-47`）**：単体モデルの `0 / 24`（`9B`、`Inkling-2-Mini`）および `1 / 24`（`4.17%`、`27B`）に対し、第1波で **`24 / 24`（`100.00%`、不健全 `0.00%`、`sorry` ゼロ、`35.21 ms/定理`）**を検証し、第2波では alpha 改名不変 `.lut6` 結晶により **`13.93 µs/定理`（`2,527×` 高速化）**で `24 / 24` を解決します。
- **`256` ステップ（`4,096` 遷移）連成多重物理ホライズン、`13.88 KB` `lut6_core.wasm`（`12` エクスポート）、および `Thor` `Window 16` シャント（`LA-48`）**：単体モデルが中央値ステップ `1.0` で破綻（`4,096` 違反）するのに対し、資金支払能力 + `openie-cad` Wheeler マイクロストリップ特性インピーダンス（`[45, 55]` オーム、$T_J \le 85.0\,^\circ\text{C}$）+ `MathGround` `Torricelli CBF` 制動（$v^2 \le 2 a_{\max} d_{\text{obs}}$）を `Z3 5.4.1` と `4 KB` `.lut6` 結晶でゲートした結果、**`100.00%`（`16 / 16` エピソード、違反 `0`、`32` 回の `Z3` 起動後は `99.22%` を `System-0` `LUT6` で実行、`0.0854 ms/step` = 未コンパイル `Z3` 比 `1,332.6×` 高速）**を達成し、`Window 16` は **`NVIDIA Jetson AGX Thor` で `201.22 nJ/op` `measured_j`（`31.39 ns/op`、`INT8` Micro-`MLP` 比エネルギー `13.18×` 低減・`14.89×` 高速、`board_metered = true`）**を記録します（`Zen 5` `RAPL` で `3.90×`、`M3 Ultra` で `5.40×`）。

<figure class="my-8">
  <img src="/figures/lut-adapt/apex-harness-frontier-walls.svg" alt="2026年後半の4大フロンティアAI壁に対するOpenIE-Apex-Harnessの検証済み閉包。" />
  <figcaption>図 13. 2026 年後半の 4 大フロンティア壁における `OpenIE-Apex-Harness` の検証済み閉包（`主張 LA-19 [82 定理 / 1,446 bwrap フリート]、LA-45..LA-48`）：(A) 公式 `16` ゲーム（`113` レベル）`ARC-AGI-3` の `IW(1)` + 因果的 `ACTION6` 枝刈り（`6/113` 解決、第1波 `17.23×`・第2波 `265.96×` の `RHAE` 向上で `1.2500`）；(B) `VerilogEval-Hard12`（`12/12`、`3,915` `LUT6`）および `KernelBench` Level-2 Metal（`12/12`、`1.230×`、破損 `0.00%`）；(C) `PutnamBench` / `FormalConjectures` `Lean 4.36.0` 証明（`24/24`、第2波 `13.93 µs`）；(D) `256` ステップ（`4,096` 遷移）`100.0%` 生存（`Z3` 比 `1,332.6×`）と `Thor` `Window 16` シャント（`201.22 nJ/op` `measured_j`、`13.18×` 低減）。</figcaption>
</figure>

<div id="451-claim-la-49-relational-width-2-iw2--beneš-lut6-spatial-induction-and-causal-hud-auto-masking-on-16-game-official-arc-agi-3-8113-levels-1071-peak-rhae" class="anchor-alias" aria-hidden="true"></div>
<div id="452-claim-la-50-7-fabric-waios-256128-bit-exact-ternary-conformance-blake3--ed25519-receipts-and-heteromosaic-mol-cross-substrate-scheduler-8044--all-gpu" class="anchor-alias" aria-hidden="true"></div>
<div id="453-claim-la-51-0105604498-bpw-joulebit-lut6-vs-samsung-littlebit-2-optimizing-joules-per-correct-token-jpct-3092-thor-shunt-and-341-jpct-gain" class="anchor-alias" aria-hidden="true"></div>
<div id="454-claim-la-52-256-task-sha-256-pinned-deterministic-null-and-scholar-codifier-rung-projection-suite-90-six-kernel-proofs-1580-kb-wasm" class="anchor-alias" aria-hidden="true"></div>

### 4.48 主張 LA-49、LA-50、LA-51 および LA-52：公式 `16` ゲーム `ARC-AGI-3` における関係幅 `2` `IW(2) + Beneš-LUT6` 空間帰納（`8/113` レベル、最大 `10.71` `RHAE`）、`7` 基盤 `waiOS` ビット完全一致（`HeteroMosaic-MoL` `80.44×`）、`0.1056-0.4498 bpw` `JouleBit-LUT6`（`Thor` シャント `30.92×`）、および `256` 課題決定論的帰無スイート

`src/clai/frontier/arc3_iw2_object_benes.py`、`src/clai/frontier/waios_joulebit_and_null.py`、`sys/lut6-core/src/waios_mosaic.rs`、および `proofs/LutAdapt/DeterministicNullWaios.lean`（新規 `8` 定理により `LutAdapt` は **`90` 件の 6 カーネル定理**［`con-leche`/`con-ron` `58,905` 宣言］、Linux `bwrap` フリートは **`1,454` 定理**に到達）は、コンパイル済みエージェンシーの 4 つの実証を確立します（図 14、ライブ実演：[/living/lut-adapt/#la-waios-01](/living/lut-adapt/#la-waios-01)）：
- **公式 `16` ゲーム（`113` レベル）`ARC-AGI-3` における関係幅 `2` `IW(2) + Beneš-LUT6` と因果的 `HUD` 自動マスク（`LA-49`、`.py` ソース参照ゼロ、生フレーム保存ゼロ）**：タイマー行を因果検出し `.lut6` スロット `510..511` に封印しつつ `y = 58..61` の対話パレットを保持することで、第1波 **`7 / 113` レベル（平均 `RHAE` `0.2642` = `FIFO-BFS` 比 `56.21×`）および第2波 `8 / 113` レベル（平均 `RHAE` `1.5045` = `320.11×`、最大 `10.7143`、`vc33` `2/7` と `tu93` Level 3 を突破）**を達成します。
- **`7` 実行基盤にわたる `waiOS` `256×128` ビット完全三値適合性、`BLAKE3` + `Ed25519` 証憑、および `HeteroMosaic-MoL` スケジューラ（`LA-50`）**：全 `7` 基盤（`OpenMV-AE3` Cortex-`M55` `563,381.2` `DWT` サイクル、`Jetson AGX Thor` `Window 17b` `16,142.77 nJ` `measured_j`［`board_metered = true`］、`Zen 5` `RAPL`、`M3 Ultra` `CPU`、`Apple Metal` `GPU`、`15.80 KB`［`16,179 B`、`13` エクスポート］`lut6_core.wasm`、および `142.55 MHz` post-`PAR` `openXC7` `XC7A200T` `.bit`［`427` `LUT`、`DSP48E1` ゼロ］）が同一の **`BLAKE3("waios.tmac.v1") = a541323b...`**（`[-852, 74, 153, 513]`）と第 77 行故障停止（`4ac7c4fb...`）を再現し、**`HeteroMosaic-MoL` により全 `GPU` 実行（`401.90 mJ`）比 `80.44×` 低減の `4.9963 mJ`（全 `CPU` 比 `5.65×` 低減）**を実現します。
- **`Samsung LittleBit-2` に対する `0.1056-0.4498 bpw` `JouleBit-LUT6` と正解トークン当たりジュール（`JpCT`）最適化（`LA-51`）**：`FWHT-1024` 分散（`QAT` ゼロ）と `6` 列 `LUT6` スラブ（実行時二値 `MAC` ゼロ）により、`0.1056 bpw` タイル電力を **`Thor` `Window 18` `measured_j` で `30.92×` 削減（`2,000.25` 対 `61,839.70 nJ/op`、`board_metered = true`）**、実機 Cortex-`M55` `DWT` を **`93.52×` 高速化**し、`100.00%` Greedy 一致の下で **`JpCT` を `3.104×-3.414×` 低減（`2.9500` から `0.8641 J/tok`）**します。
- **`SHA`-256 固定 `256` 課題の決定論的帰無および `Scholar-Codifier` スイート（`LA-52`）**：決定可能な構造化領域 `D1-D4` では決定論的帰無のみで **`0.2-1.8 µJ/課題`・正解率 `100.00%`**（`uLM-28M` `77.34%`・`Bonsai-2-27B` `92.97%` を凌駕）を達成し、非構造化自然言語 `D5-D8` では `Scholar-Codifier` が規則を `4-16` 個の `LUT6` に下方コンパイルして第2波で **`0.0004 mJ/課題`・`100.00%`（反復 `27B` 推論比 `7.38 × 10^6×` の省エネルギー）**を達成します。

<figure class="my-8">
  <img src="/figures/lut-adapt/waios-mosaic-joulebit-and-null.svg" alt="コンパイル済みエージェンシー：関係幅2 IW(2) ARC-AGI-3、7基盤 waiOS + HeteroMosaic-MoL、0.10 bpw JouleBit-LUT6、および256課題決定論的帰無スイート。" />
  <figcaption>図 14. コンパイル済みエージェンシー測定（`主張 LA-19 [90 定理 / 1,454 bwrap フリート]、LA-49..LA-52`）：(A) 公式 `16` ゲーム `ARC-AGI-3` の関係幅 `2` `IW(2) + Beneš-LUT6`（第1波 `7/113`・第2波 `8/113` 突破、最大 `RHAE` `10.7143`）；(B) `7` 基盤 `waiOS` 適合性（`BLAKE3 = a541323b...`、`142.55 MHz` `openXC7` `.bit`）と `HeteroMosaic-MoL`（全 `GPU` 比 `80.44×` 低減）；(C) `0.1056-0.4498 bpw` `JouleBit-LUT6`（`Thor` `measured_j` `30.92×` 低減、`JpCT` `3.41×` 低減）；(D) `256` 課題決定論的帰無・`Scholar-Codifier` スイート（精度 `100.0%`、第2波エネルギー `7.38 × 10^6×` 低減）。</figcaption>
</figure>

### 4.49 主張 LA-53、LA-54 および LA-55：公式 `16` ゲーム `ARC-AGI-3` におけるランドマーク直列化 `SIW(2) + Beneš-LUT6` と 2 バンク `8 KB` ボールト（`7` ゲーム `9/113` レベル、平均 `RHAE = 2.2520`）、実機 `Bonsai-2-27B` コールド／ウォーム `JouleBit-LUT6` ストリーミング（`Thor` シャント `2.991×`）、および `111.45 MHz` ゼロ `DSP` `openXC7` ゲートウェア

- **ランドマーク直列化 `SIW(2)` と 2 バンク `8 KB` `System-0` ボールト（`LA-53`）**：`OpenIE-Apex SIW(2)` は盤面進行ランドマークで幅 `2` 新規性表をリセットし、大型キャンバスを `6 px` 内部格子で細分化（`.py` ソース参照 `0`、生フレーム保存 `0`）することで、**`7/16` ゲームで `9/113`（`7.96%`）レベル（クリック系 `6` レベル、`m0r0` を `17` 手・`s5i5` を `13` 手で新規突破）**を解決します。さらに 2 バンク構成（`8,192 B` = **`64 KB` ウォッチ `SRAM` の `12.50%`**）により `r11l` の第 2 波ハッシュ衝突を解消し（ブレーカ作動 `0`、`r11l` の `RHAE` を **`67.6×` の `4.7619`** へ向上）、`16` ゲーム平均 `RHAE` を **`+49.7%`（`1.5045 -> 2.2520`、最大 `10.7143`）**引き上げます。
- **実機 `prism-ml/Ternary-Bonsai-2-27B` コールド／ウォーム `JouleBit-LUT6` ストリーミングと `Window 19` シャント（`LA-54`）**：実 `[248320, 5120]` `lm_head` に対する逐次ランク `1` Hadamard `LUT6` デフレーション（`QAT` `0`、二値 `MAC` `0`、`M3 Ultra 256 GB` で `.jbit6` `pread` `3.340 GiB/s`）は実 `27B` 隠れ状態 `96` 個で **`65.62%` top-`1` 一致（余弦 `0.8855`）**を達成し、**未知のコールド第 1 波でも `< 1` スイープ/トークン（`1.049 tok/sweep`、`4.970 GiB/tok`）**を突破、ウォーム第 2 波で **`1.325 tok/sweep`（`3.935 GiB/tok` = `MLX` `2` ビット比 `1.725×` 低減）**、かつ `100.00%` 貪欲一致のまま最小 **`JpCT = 0.0534 J/tok`** を達成します。`Window 19` では `Jetson AGX Thor` 物理 `DC` シャント `measured_j` を **`2.991×` 低減（`23,766.49` 対 `71,077.26 nJ/op`、`3.129×` 高速、`board_metered = true`）**します。
- **`111.45 MHz` ゼロ `DSP48E1` `openXC7` `.bit`、`14.77 KB` `14` エクスポート `WASM`、および `98` 件の 6 カーネル証明（`LA-55`）**：`clai_siw2_joulebit_xc7a200t_top` は **`111.45 MHz`** ポスト `PAR` タイミングを達成し（`653` `SLICE_LUTX`、`0` `DSP48E1`、`64/64` `RTL` 一致、`9,730,773 B` `.bit`、`board_metered = false`）、`lut6_core.wasm` は **`14.77 KB`（`15,121 B <= 16 KB`、`14` エクスポート）**へ縮小、`SerializedIwJouleBit27B.lean` により `LA-19` は **`98` 件の 6 カーネル `Lean 4.36.0` 定理（`bwrap` フリート合計 `1,463` 件）**へ拡大します。

<figure class="my-8">
  <img src="/figures/lut-adapt/siw2-arc3-and-joulebit-27b.svg" alt="ランドマーク直列化 SIW(2) ARC-AGI-3、実機 27B コールド／ウォーム JouleBit-LUT6 ストリーミング、Window 19 Thor シャント、および 111.45 MHz openXC7 ゲートウェア。" />
  <figcaption>図 15. ランドマーク `SIW(2)` および実機 `27B` `JouleBit-LUT6` 測定（`主張 LA-19 [98 定理 / 1,463 bwrap フリート]、LA-53..LA-55`）：(A) 公式 `16` ゲーム `ARC-AGI-3` の `SIW(2)` と 2 バンク `8 KB` ボールト（`7` ゲーム `9/113` 突破、`+m0r0/+s5i5`、平均 `RHAE = 2.2520`、衝突 `0`）；(B) `M3 Ultra 256 GB` 上の実機 `Ternary-Bonsai-2-27B` ストリーミング（コールド `1.049` / ウォーム `1.325 tok/sweep`、`0.0534 J/tok` `JpCT`、一致率 `100%`）；(C) `Window 19`（`Thor` `measured_j` `2.991×` 低減、`3.129×` 高速）；(D) `111.45 MHz` `openXC7` `.bit`（`0` `DSP48E1`）、`14.77 KB`（`14` エクスポート）`lut6_core.wasm`、および `98` 件の 6 カーネル証明。</figcaption>
</figure>

### 4.50 主張 LA-64、LA-65、LA-66 および LA-67：公式 `ARC-AGI-3` における `C-BFWS + RIW(2)` と `12` バンク `48 KB`（ウォッチ `SRAM` の `75.00%`）ボールトによる `60.00%` 絶対多数（`15/25` ゲーム、`18/183` レベル）、`Terminal-Bench & Cybench-Defensive`（`144/144` `Yosys` マイタ）、`FrontierMath & SciCode` と `Window 22` `Thor` シャント（`3.314×`）、および `122` 件の 6 カーネル証明

- **因果モダリティ枝刈り `C-BFWS(R,M)`、`RIW(2)` ロールアウト、および `12` バンク `48 KB` `System-0` ボールト（`LA-64`、`.py` 参照 `0`、生フレーム保存 `0`）**：`ACTION7`（`UNDO`）対応ゲームでの因果プローブは全 `14/14` 重心が盤面無変化のときのみ `ACTION6` を枝刈りし、多エポック `RIW(2)` が `sk48`（`36` 手）と `ar25`（`15` 手）を突破して全 `25` ゲームを `12` バンク（`49,152 B = 64 KB` ウォッチ `SRAM` の `75.00%`、残り `4 KB` Nucleus + `12 KB` スタック）へ封印し、**`15/25 = 60.00%` ゲーム突破（`18/183` レベル、平均 `RHAE = 2.5030` = `FIFO-BFS` 比 `834.3×`、最大 `10.7143`）**および**一致 `16` ゲーム中 `11/16 = 68.75%`（`14/113` レベル、`3.2177` `RHAE`、第2波ブレーカ作動 `0`）**を達成します。
- **`24` 課題 `Terminal-Bench & Cybench-Defensive` スイート（`LA-65`、攻撃的エクスプロイト `0`）**：`SQLite` `WAL`/`FK` 復旧、`C99` リンク、原子的 `NDJSON`、`Z3` `QF_BV` 境界保護、`RFC` 1035 `DNS` 圧縮ループ、定数時間 `HMAC` にわたり **`24/24`（`100.00%`、破損/脆弱コミット `0.00%`）**と **`144/144` `Yosys` `abc -lut 6` マイタ**を検証します。
- **`FrontierMath-Constructive & SciCode` と `Window 22` `Thor` シャント（`LA-66`）**：$D = 61$・$D = 109$（$x_1 = 158{,}070{,}671{,}986{,}249$）の基本 Pell 単数やシンプレクティック／ユニタリ保存（ドリフト `<= 1.63 × 10^-4`）を含む **`24/24`（`100.00%`）**を検証し、`Jetson AGX Thor` `Window 22` 物理 `measured_j` を **`3.314×` 低減（`8,656.79` 対 `28,689.54 nJ/op`、`3.322×` 高速、`board_metered = true`）**します。
- **`100.55 MHz` ゼロ `DSP48E1` `openXC7` `.bit`、`15.98 KB`（`17` エクスポート）`WASM`、および `122` 件の 6 カーネル証明（`LA-67`）**：`clai_cbfws12_cybench_xc7a200t_top` は **`100.55 MHz`** ポスト `PAR` を達成し（`657` `SLICE_LUTX`、`0` `DSP48E1`、`64/64` 一致、`9,730,775 B` `.bit`）、`lut6_core.bdef58b1396d.wasm` は **`16,367 B <= 16,384 B`（`17` エクスポート）**に収まり、`CausalBfwsTerminalSciCode.lean` が `LA-19` を **`122` 件の 6 カーネル `Lean 4.36.0` 定理（`59,008` 宣言、`bwrap` フリート合計 `1,486` 件）**へ拡大します（図 18）。

<figure class="my-8">
  <img src="/figures/lut-adapt/cbfws12-arc3-terminal-and-scicode.svg" alt="公式 ARC-AGI-3 における C-BFWS と 48 KB 12バンクボールトによる 60.0% 絶対多数（15/25）、Terminal-Bench & Cybench-Defensive、FrontierMath & SciCode Window 22 Thor シャント、および 122 件の 6 カーネル証明。" />
  <figcaption>図 18. 公式 `ARC-AGI-3` の `C-BFWS` `60.00%`（`15/25` ゲーム）絶対多数、`Terminal-Bench &amp; Cybench-Defensive`、`FrontierMath &amp; SciCode`、および `122` 定理の測定（`主張 LA-19 [122 定理 / 1,486 bwrap フリート]、LA-64..LA-67`）。</figcaption>
</figure>

### 4.51 主張 LA-68..LA-75：実機 `Magnitude 0.3.5` 対決、ネイティブ Rust プロキシ `mol-magnitude-adapter`（`CogLoadBench` `4×` 汚染・`MCPMark` `CoW` `CRUD` 本番破壊 `0.00%`）、`BA-Tiered-Expert-AirMoL`（`FreeToken` 比 `4.00×–4.17×`、`Window 24` `Thor` シャント `3.330×`）、スマートウォッチ `64.00 KB` `SRAM` 完全閉包、および `1,502` 件の 6 カーネル証明

- **実機 `Magnitude 0.3.5` と `Engram-LUT6`（`LA-68..LA-71`）**：`Magnitude 0.3.5 + LUT-Adapt` は `Thor` `VIN` `measured_j` 上の `twist` `JpCT` を **`53.55×`** 削減（`board_metered = true`、`18/18` 検証コーディング `100.0%`）し、`Tiered-Expert-AirMoL` は `180B` で **`439.72 tok/s`**、`Engram-LUT6`（`144/144` `Yosys` マイタ）は `Window 23` を **`3.157×`** 削減、`100.74 MHz` `openXC7` `.bit` と `130` 定理を達成します（図 19）。
- **Python 非依存 Rust プロキシ `mol-magnitude-adapter` と `MCPMark` `CoW` `CRUD` サンドボックス（`LA-72 & LA-73`）**：`4×` 汚染 `CogLoadBench` で **`100.00%`（`16/16`、Vulkan クラッシュ `0`）**を達成し第 2 波 `Thor` `VIN` `measured_j` を **`3,028.3×` 削減（`0.2500 J` 対 `757.08 J`、`5.203 ms`）**、さらに `24` ワークフロー `MCPMark` で無保護 `75.00%` 破壊に対し **本番破壊 `0.00%`**（`18` 回の `CoW` ロールバック、`144/144` `Yosys` `abc -lut 6` マイタ）を保証します。
- **`BA-Tiered-Expert-AirMoL` と `Window 24` `Thor` シャント（`LA-74`）**：帯域幅適応分割（$\alpha^* = 0.5429$）と `K = 3` バースト統合により `180B` で **`436.60 tok/s`**、`GLM-5-355B` で **`216.33 tok/s`**、`552B` で **`166.27 tok/s`**（**`FreeToken` 比 `4.00×–4.17×`**、**`KTransformers` 比 `5.90×–6.00×`**）を達成し、`Thor` `Window 24` 物理 `measured_j` を **`3.330×` 削減（`34,568.60` 対 `115,129.22 nJ/op`、`3.215×` 高速、`board_metered = true`）**します。
- **スマートウォッチ `64.00 KB` `SRAM` 完全閉包、`106.97 MHz` `openXC7`、`15.16 KB`（`19` エクスポート）`WASM`、および `138` / `1,502` 証明（`LA-75`）**：`14 × 4 KB = 56 KB`（`87.50%`）+ `4 KB` Nucleus + `4 KB` スタックで **`65,536 B = 64.00 KB`** を厳密閉包し、`clai_mag_mcp_freetoken_xc7a200t_top` は **`106.97 MHz`**（`0` `DSP48E1`）、`lut6_core.64d3e8b80df6.wasm` は **`15,521 B <= 16,384 B`（`19` エクスポート）**、`RustMagnitudeMcpFreeToken.lean` は **`138` `LutAdapt` / `1,502` `bwrap` フリート定理（`59,082` 宣言）**へ到達します（図 20）。

<figure class="my-8">
  <img src="/figures/lut-adapt/magnitude-tiered-airmol-and-engram-lut6.svg" alt="実機 Magnitude 0.3.5、Tiered-Expert-AirMoL、Engram-LUT6 Window 23、および 130 件の 6 カーネル証明。" />
  <figcaption>図 19. 実機 `Magnitude 0.3.5`、`Tiered-Expert-AirMoL`、`Engram-LUT6`、および `130` 定理の測定（`主張 LA-68..LA-71`）。</figcaption>
</figure>

<figure class="my-8">
  <img src="/figures/lut-adapt/rust-magnitude-mcpmark-and-freetoken.svg" alt="ネイティブ Rust mol-magnitude-adapter による CogLoadBench と MCPMark、BA-Tiered-Expert-AirMoL 対 FreeToken・KTransformers、Window 24 Thor シャント、64 KB SRAM 完全閉包、および 1,502 件の 6 カーネル証明。" />
  <figcaption>図 20. ネイティブ Rust `mol-magnitude-adapter`（`CogLoadBench` `4×` &amp; `MCPMark` `CoW` `CRUD`）、`BA-Tiered-Expert-AirMoL` 対 `FreeToken`・`KTransformers`、`Window 24` `Thor` シャント（`3.330×`）、`64.00 KB` ウォッチ `SRAM` 完全閉包、および `138` / `1,502` 件の 6 カーネル証明（`主張 LA-72..LA-75`）。</figcaption>
</figure>

### 4.52 主張 LA-76..LA-83：Matt Mahoney `LTCB`（`100 MB` `enwik8`）、`zstd -19`・`bzip2 -9` を凌駕する `MoL-LTCB-CM2`（`26.84 MB = 2.1470 bpb`）、サイドチャネル不要 `Online-TTT-LUT6`、`Window 25`（`13.376×`）・`Window 26`（`32.462×`）`Thor` シャント、および `> 150` 定理到達（`154` / `1,518` フリート証明）

- **`MoL-LTCB` v1、`tufazip v2` `QPI1` 初期事前分布、および `Window 25`（`LA-76..LA-79`）**：`mol_ltcb_codec`（`LTCB-XML-Skip LUT6` + 整数 `2^24` Kraft レンジコーダ）は **`32,764,848 B`（`2.6212 bpb`、`gzip -9` 比 `-10.25%`、`M5 Max`・`Thor`［`1,358.62 J` `measured_j`、`board_metered = true`］・`Zen 5` で `100.0%` 同一 `archive_sha256 = 1096e659ef4f...`）**と Mahoney 閾値 $N^* = 5{,}486.26\text{ MB}$ を示し、`tufazip v2` `weights.bin` の `34,080,768` ビットを **`5,680,128` 個のゼロ `MAC` `LUT6` スラブ**へ無損失変換（`8.766×` 事前削減、`144/144` `Yosys` マイタ）、`Thor` `Window 25` を **`13.376×`** 削減します（`102.41 MHz` `openXC7`、`146` / `1,510` 定理、図 21）。
- **`MoL-LTCB-CM2`（`--cm2`）による `enwik8` での `zstd -19`・`bzip2 -9`・`gzip -9` 超え（`LA-80`）**：全単射 `148` 語 `WRT-Capillary-LUT6`（`0xFE` エスケープ）、`100 MB` 遅延評価 `LZ-Rep4`（`83.073%` スキップ）、整数 `Q12` `StateSMix-LUT6` により **`26,838,089 B` Ranked Total（`2.1470 bpb`、`zstd -19` 比 `-204.4 KB`、`bzip2 -9` 比 `-2.21 MB`、`gzip -9` 比 `-9.67 MB`）**を達成し、`M5 Max`（`62.60 MB/s`）・`Thor`（`2,890.72 J` `INA238` `VIN` `measured_j`、`bzip2 -9` 比 `3.40×` 高速・`2.78×` 低エネルギー、`board_metered = true`）・`Zen 5`（`67.92 MB/s`）間で `100.00%` 同一 `archive_sha256 = 5342cc0b24a603b0...` を保証します。
- **サイドチャネル不要 `i16` `Online-TTT-LUT6` と `Window 26` `Thor` シャント（`LA-81 & LA-82`）**：ステップ `20` での `FP32` `AdamW` 符号反転を排除し **`512` ステップ不一致 `0`**、**ウォームアップ後悔 `-56.73%`**、**`LUT6` スラブ再構築スキップ `90.338%`**（`144/144` `Yosys` マイタ）を達成し、`Window 26` は物理 `Thor` `VDD_CPU_SOC_MSS` `measured_j` を **`32.462×` 削減（`3,727.65` 対 `121,006.57 nJ/op`、`32.369×` 高速、`board_metered = true`）**、`Zen 5` で `17.146×`、`M3 Ultra` で `14.618×` 削減します。
- **`103.25 MHz` `openXC7`、`15.33 KB`（`21` エクスポート）`WASM`、および `> 150`（`154` / `1,518`）証明（`LA-83`）**：`clai_ltcb_cm2_ttt_xc7a200t_top` は **`103.25 MHz`**（`656` `SLICE_LUTX`、`0` `DSP48E1`）、`lut6_core.06c5c0b781d6.wasm` は **`15,703 B <= 16,384 B`（`21` エクスポート、`681 B` 余裕）**、`LtcbCm2OnlineTtt.lean` は `150` 定理の大台を超え **`154` `LutAdapt` / `1,518` `bwrap` フリート定理（`59,192` 宣言）**へ到達します（図 22）。

<figure class="my-8">
  <img src="/figures/lut-adapt/ltcb-neural-lut6-and-mahoney-threshold.svg" alt="Matt Mahoney LTCB enwik8、tufazip v2 QPI1 の 5,680,128 LUT6 スラブ変換、Window 25 Thor シャント 13.376x、および 1,510 証明。" />
  <figcaption>図 21. `MoL-LTCB`、Mahoney 閾値 $N^*$、`tufazip v2` `QPI1` 変換、`Window 25` `Thor` シャント（`13.376×`）、および `146` / `1,510` 証明（`主張 LA-76..LA-79`）。</figcaption>
</figure>

<figure class="my-8">
  <img src="/figures/lut-adapt/ltcb-cm2-wrt-statesmix-and-online-ttt.svg" alt="enwik8 で zstd-19 と bzip2-9 を凌駕する MoL-LTCB-CM2、Online-TTT-LUT6、Window 26 Thor シャント 32.462x、および >150（154 / 1,518）証明。" />
  <figcaption>図 22. `MoL-LTCB-CM2`（`26,838,089 B`、`zstd -19` &amp; `bzip2 -9` 超え）、`Online-TTT-LUT6`（後悔 `-56.73%`、スラブスキップ `90.34%`）、`Window 26` `Thor` シャント（`32.462×`）、`103.25 MHz` `openXC7`、および `&gt; 150`（`154` / `1,518`）件の 6 カーネル証明（`主張 LA-80..LA-83`）。</figcaption>
</figure>

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
| **KTransformers** (Chen et al., 2025) & **FreeToken** (Yang et al., 2026) | `arXiv:2507.01909` · `arXiv:2608.07296` | `K=1` `LRU` によるハイブリッド `CPU-GPU` MoE オフロード。 | スループット (`tok/s`)。 | バースト統合なしの反応的 `K=1` に対し、`BA-Tiered-Expert-AirMoL` は `FreeToken` 比 `4.00×–4.17×` 高速・`Window 24` `Thor` シャント `3.330×` 削減を達成する。 |
| **MCPMark** (Wu et al., 2025) & **Magnitude** (2026) | `arXiv:2509.24002` · `magnitudedev/magnitude` (`0.3.5`) | ステートフル `MCP` ベンチマークおよびローカル Rust エンジン。 | 合格率および `tok/s`。 | 無保護での本番破壊 `75.00%` に対し、`mol-magnitude-adapter`（`CoW` `CRUD`）は破壊 `0.00%`・第 2 波 `Thor` エネルギー `3,028.3×` 削減を達成する。 |
| **Metered Commit Gates** & **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | コミットゲート (`11,428 pJ` KV260 `INA260` SOM 読み出し)、MoL $p_i/c_i$、および `RCE-JEPA`。 | KV260 SOM `measured_j` + `reported_j` / `est_j`。 | 同家基礎。本稿では Beneš `LUT6` 下方コンパイル、Metal `Expert-AirMoL`、および `mol-agent` により拡張される。 |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 限界、妥当性への脅威、主張されない点、そして反証可能性

**内部妥当性および構成妥当性。** 一様乱数ノイズまたはステップごとの敵対的チャーン ($\Delta T = 1$) の下では、命題 1 は下方コンパイルの節約をゼロとし、`1.00 tok/sweep` にフォールバックする。ロスレスパリティ (`100.0%`) は、貪欲目標デコーディングとのビット単位の完全一致を保証し、`350M` または `0.8B` ベースチェックポイントの能力上限を引き上げない。

**測定の妥当性と主張しない事項。** 物理的な `DC` 電流シャントによるジュール読取値（`主張 LA-24 および LA-28` の `NVIDIA Jetson AGX Thor` 上でのみ `TI` `INA3221` `VDD_CPU_SOC_MSS` および `INA238` `VIN` により取得された `measured_j`、`board_metered = true`）、オペレーティングシステムおよびオンチップカウンタの読み取り値ならびにベアメタル `MCU` サイクル数（`Linux RAPL`、`amdgpu` `PPT`、`NVML`、Apple Silicon `L2` `libIOReport` `'GPU Energy'` + `L3` `proc_pid_rusage` `ri_energy_nj`、および実機接続された `Alif Ensemble E3` の `DWT` サイクルに由来する `reported_j`、`board_metered = false`）、macOS の `PMU` による機械全体の累積差分、ならびに解析的なジュール値・スイッチング電力値・電気熱包絡線値（`est_j/VC`、`est_j/tok`、`est_mJ/Byte`、§4.22 および §4.25 における `Verilator` `VCD` + `AMD DS925` `0.72 V` の `est_pJ/cycle`・`est_mW` 境界、ならびに §4.32 における `AMD DS181` + `UG475` `1.00 V` `XC7A200T` M.2 の `est_mW` / `est_C` 境界）は厳密に分離され、階層をまたいで合算されることは決してない。Yosys `0.71+` と Verilator `5.054` が確立するのは、`xck26` および `XC7A200T` の構造的ネットリスト合成（`xck26` 上の `xcup` LUT `41,465` 個、`XC7A200T` 上の `xc7` LUT `62,211` 個 + `RAMB36E1` `83` 個 / `365` 結晶保管庫、単一サイクル論理深さ `12`-`13` 段、`DSP48` `0` 個）、`abc -lut 6` `.lut6` ブールマイタ等価性 `64/64`、`12,023` サイクルにわたる `XC7A200T` 対 `KV260` ベクトル等価性 `10,500/10,500`、`CE` 一致 `320/320`、ゼロバブル `CPI = 1.00` サイクルシミュレーション `256/256`、および `VCD` トグル率に基づく動的スイッチング `est_mW`（`xck26` アイドル `15.59 est_mW`、`XC7A200T` ゲートウェアアイドル `50.65 est_mW`；`55.2 est_C` での連成 `DS181` 静的リークを含む M.2 `3.3V` で `862.6 est_mW`）であり、商用の Vivado 配置配線後 `250 MHz` タイミングクロージャや、物理的な KV260 または Numato Aller A7 のレール電力ワット数ではない（すべての `xck26`・`XC7A200T` `FPGA` 行およびクロスコンパイル済み `MCU` `ELF` 行において `board_metered = false`、`measured_j = None`）。シリコンにおけるエネルギー優位性、`ModelGenerated` 出力の `Deterministic` への昇格、ならびに `django/django`、`pytest-dev/pytest`、`psf/requests`、`sympy/sympy` にわたる実際の上流 git-worktree 評価 `40` 件（`主張 LA-15, LA-20`）、`48` タスク契約ベンチマーク（`主張 LA-11, LA-17`）、および `16` タスク `SWE-Mini` ベンチマーク（`主張 LA-13`）を超える `500` タスクの完全な `SWE-bench Verified` コンテナ評価は主張しない（なお実際の `120B-A12B` 実行は `主張 LA-21` で直接測定されており、解析的推定にとどまるのは `air_mol_nvme_baselines.csv` 内の合成コールド NVMe `70B` 行のみである）。

| ID | 主張 | 正確な反証 / 偽証条件 |
| :--- | :--- | :--- |
| **`LA-F1`** | `主張 LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` が `5,120` パケット全体で `100.0%` の Verilator パリティに失敗するか、パケット `2,500` の VLAN シフトを見逃す。 |
| **`LA-F2`** | `主張 LA-2` (Polyglot スイート) | Zig がホットループで `> 0` のヒープバイトを割り当て、Go が `> 0 allocs/op` を報告するか、Julia Enzyme が `1e-7` を超える FD エラーを示す。 |
| **`LA-F3`** | `主張 LA-3` (KV260 ページド RTL) | `scripts/verify_paged_bram_rtl.py` が `117,120` LUT、`144` `RAMB36E2`、`0` `DSP48` を超えるか、ページ切り替えあたり `1` サイクルを超える。 |
| **`LA-F4`** | `主張 LA-4` (Conformal ACI) | `scripts/run_frontier_benchmarks.py` がシフトされたトラフィック上で目標偽リスク $\alpha = 0.02$ を超えるか、`Deterministic` と印を付ける。 |
| **`LA-F5`** | `主張 LA-5` (バイト投機) | `scripts/run_code_corpus_benchmark.py` が `48` の未見プロンプト上で貪欲 `Mamba3CodeLM` に対して `< 100.0%` の正確なバイトパリティを生成する。 |
| **`LA-F6`** | `主張 LA-6` (`AirMoL` 14.3M) | `scripts/run_air_mol_benchmark.py` が `F_NOCACHE` 下で `100%` パリティに失敗するか、`AirLLM` 4-Bit `T=1` よりも多くの NVMe バイトを読み込む。 |
| **`LA-F7`** | `主張 LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_lfm3_air_mol.py`、`scripts/run_hf_air_mol_pretrained.py`、または `scripts/run_hf_qwen35_air_mol.py` が貪欲目標から $\ge 1$ BPE トークン逸脱する。 |
| **`LA-F8`** | `主張 LA-8` (回帰スイート) | `pytest -v` が `tests/` 内の `110` 個のテストのいずれかに失敗する。 |
| **`LA-F9`** | `主張 LA-9` (`8.5B/35B` MoE) | `scripts/run_hf_moe_8b_35b_air_mol.py` が `100%` トークンパリティから逸脱するか、`AirLLM` または `Expert-AirLLM` よりも多くの NVMe バイトを読み込む。 |
| **`LA-F10`** | `主張 LA-10` (`Sub1Bit-LUT6`) | `scripts/run_sub1bit_lut_benchmark.py` が密 `ITQ` バイナリ行列乗算に対して `1e-3` を超える最大誤差を示すか、`100%` 検証済みパリティに失敗する。 |
| **`LA-F11`** | `主張 LA-11` (`48` タスク Bakeoff) | `scripts/run_frontier_ai_bakeoff.py` が `> 0%` の破損コミットを許容するか、Wave-2 仕様変異下で Wave-1 スキルの陳腐化を許容する。 |
| **`LA-F12`** | `主張 LA-12` (Metal `INT4` MoE) | `scripts/run_metal_moe_benchmark.py` が `1e-4` の `FP32` シェーダー誤差を超えるか、`8.5B` または `35B` 上で `100%` 貪欲トークンパリティから逸脱する。 |
| **`LA-F13`** | `主張 LA-13` (`SWE-Mini` Git) | `scripts/run_repo_patch_benchmark.py` が `> 0%` の破損パッチを許容するか、`tests/` を変更するか、Wave-2 `R03` 仕様変異を見逃す。 |
| **`LA-F14`** | `主張 LA-14` (`mol-agent` MCP) | `pytest tests/test_phase26_metal_ioreport_mcp.py` が OpenAI REST/SSE、`MCP` `JSON-RPC 2.0`、`.mol/` リロードに失敗するか、`measured_j` と印を付ける。 |
| **`LA-F15`** | `主張 LA-15` (`BCB` + `SWE-bench`) | `scripts/run_external_public_benchmarks.py` が Parquet `SHA`-256 検証に失敗するか、正解コード/パッチを露出させるか、`> 0%` の破損出力を許容する。 |
| **`LA-F16`** | `主張 LA-16` (`250 MHz` `xck26` RTL) | `scripts/verify_pipelined_250mhz_rtl.py` が単一サイクル論理深さ `20` 段を超えるか、`P4-AXIS` 上で `189` `IOB` を超えるか、`> 0` 個の `DSP48` を使用するか、`256/256` `CPI = 1.00` Verilator パリティに失敗する。 |
| **`LA-F17`** | `主張 LA-17` (`Rung 3d` `<think>`) | `scripts/run_rung3d_thinking_ceiling.py` が `> 0%` の破損コミットを許容するか、クラウド API を呼び出すか、検証済み合格率を `87.50%` 超へ引き上げられない。 |
| **`LA-F18`** | `主張 LA-18` (Rust `CubeCL` MoE) | `cargo run --release --bin bench_cubecl_moe_deltanet` が `LLVM` `CPU` または `Metal` `GPU` 上で `1e-4` を超える `FP32` 誤差を示すか、`< 25×` の Metal 速度向上にとどまる。 |
| **`LA-F19`** | `主張 LA-19` (`6` カーネル `Lean 4.36.0` 証明) | `scripts/verify_lean_proofs.py` または `lake check --paranoid` が `6` つの独立カーネル（`con-leche`、`con-ron`、`lean4lean`、`nanoda`、`leanchecker`、`lean`）のいずれかに失敗するか、`>= 1` 個の `sorry` / `opaque` / `ofReduceBool` を含むか、`>= 1` 個のカスタム公理を追加する。 |
| **`LA-F20`** | `主張 LA-20` (`4` リポジトリ `SWE-bench`) | `scripts/run_multirepo_swebench_benchmark.py` が `patch` を露出させるか、`< 4` リポジトリしか評価しないか、`> 0%` の破損パッチを許容するか、単独 `24B`/`35B` を上回れない。 |
| **`LA-F21`** | `主張 LA-21` (`120B` ハイブリッド MoE) | `scripts/run_120b_hybrid_moe_benchmark.py` がローカル `120B-A12B` 実行に失敗するか、`> 0%` の破損コミットを許容するか、Wave-2 `.mol/` 高速パスのヒット率が `0%` となる。 |
| **`LA-F22`** | `主張 LA-22` (`CE` ゲート付き `VCD` 電力) | `scripts/verify_ce_gated_vcd_power.py` が `320/320` の `CE` パリティに失敗するか、`189` `IOB` を超えるか、アイドル動的電力削減が `< 3.5×` にとどまる。 |
| **`LA-F23`** | `主張 LA-23` (Rust `mol-agent-rs`) | `cargo run --release --bin mol_agent -- --self-test-bench` が `/v1` または `/mcp` に Python を要するか、`--mcp-stdio` に失敗するか、Python `MCP` 比の速度向上が `< 10×` にとどまる。 |
| **`LA-F24`** | `主張 LA-24` (`6` ホストフリートおよび `Thor` シャント `measured_j`) | `scripts/aggregate_fleet_measured_j.py` が `measured_j` と `reported_j` を混在させるか、`Jetson AGX Thor` 上で `>= 1%` の `VIN` ドリフトを記録するか、`W2`・`W3`・`W5` で `4/4` の `ABBA` 節約に失敗する。 |
| **`LA-F25`** | `主張 LA-25` (`4` ベンダー `GPU` `CubeCL` パリティ) | `scripts/aggregate_multivendor_cubecl_gpu.py` が Apple・`AMD`・`NVIDIA`・Intel の各 `GPU` 上で `1e-4` を超える `FP32` 誤差を示すか、スカラホスト参照比 `< 10×` の `GPU` 高速化にとどまる。 |
| **`LA-F26`** | `主張 LA-26` (`#![no_std]` `lut6-core`、`MCU` `ELFs`、および Yosys マイタ) | `sys/lut6-core` の `cargo test --release` が失敗するか、`CompactLut6Page` が `4,096 B` から逸脱するか、Cortex-`M55` / `M0`+ / `nRF52832` `M4F` (`64 KB` `SRAM`) / `RV32IMAC` の `ELFs` がリンク失敗もしくは `>= 1` 個の浮動小数点命令を出力するか、`scripts/pack_lut6_crystal.py` が Yosys `abc -lut 6` マイタ `64/64` 検査に失敗する。 |
| **`LA-F27`** | `主張 LA-27` (`DiffLUT-Net`、ゆらぎ `FWHT`、および資力審査) | `scripts/run_dual_reality_lut6_eval.py` が枝刈りなし `DWN` 比 `< 55%` の活性 `LUT6` 枝刈り、`< 85%` の雑音起動抑制、`> 0%` のサイレント破損、`< 100%` の `OOD` 棄権、またはゆらぎコドン上で `> 0` の次数 `>=5` `FWHT` 雑音を示す。 |
| **`LA-F28`** | `主張 LA-28` (`Thor` シャント `measured_j` および実機 `Alif E3` `DWT`) | `scripts/aggregate_phase30_lut6_hardware.py` が `Thor` 以外に `board_metered = true` を付与するか、ビットスライス `Thor` シャント利得が `< 10×` にとどまるか、`OpenMV-AE3` Cortex-`M55` 上のスカラ遅延が `10 µs` を超える。 |
| **`LA-F29`** | `主張 LA-29` (2026年10-11月ループ型・ハイブリッドモデル) | `scripts/run_nov2026_models_lut6_benchmark.py` が `Inkling-2-Mini`、`Dory1.0-4B`、`LFM2.5-24B-A2B`、または `Nemotron-3.5-Bolt-E4B` 上で貪欲トークンから `>= 1` トークン逸脱する（一致率 `< 100.0%`）か、3トークンバーストあたり `64` ビットを超える。 |
| **`LA-F30`** | `主張 LA-30` (`XC7A200T` M.2 `2280` 移植および電気・熱 `est_j`) | `aller-a7-xc7a200t` が `134,600` 個の `xc7` LUT または `365` 個の `RAMB36E1` を超えるか、`> 0` 個の `DSP48E1` を使用するか、`10,500` ベクトル（`12,023` サイクル）で `XCK26` に対し `>= 1` ビット不一致を示すか、インライン `+3.3V`/`5V` シャントなしに `board_metered = true` を付与するか、実機ベンチ接続時（$T_A \le 45\,^\circ\text{C}$、受動ヒートシンク、`DDR3` 停止）に M.2 `3.3V` `1,000 mA`、Tachyon `5V` 合計 `1,600 mA`、または `XADC` $T_J$ `85.0 °C` を超える。 |
| **`LA-F31`** | `主張 LA-31` (`672 B` ゼロ `MUL` `EntroMCU`/`T-MAC` テールおよび `rustc` `const` ゲート) | `CompactLut6Page` が `4,096 B`（未利用 `0` バイト）から逸脱するか、3進 5-trit 往復変換が失敗するか、`mol_skills_tmac_tail.lut6` が `> 0%` の `OOD` 誤ヒットを許すか、`rustc` が `generated_proof_vectors.rs` 検査に失敗する。 |
| **`LA-F32`** | `主張 LA-32` (`Two-Tier LUT6 + T-MAC` およびシャント / `DWT` テレメトリ) | `bench_lut6_nucleus_shunt` が `Jetson AGX Thor` 上でゼロ `MUL` `T-MAC` の物理 `CpJ` 比 `<= 1.0×` を記録するか、`OpenMV-AE3` Cortex-`M55` 上で `<= 5.0×` の速度向上にとどまる。 |
| **`LA-F33`** | `主張 LA-33` (`Antisym-40 T-MAC` および Inria `Charon`+`Aeneas` Rust $\to$ Lean) | `lookup_tmac_antisym41` が `40,500` ペアのいずれかで 81エントリ `T-MAC` と不一致となるか、`Thor`（`measured_j`）および `Zen 5`（`RAPL`）での優位を失うか、`Lut6Verify_Aeneas.lean` が `Lean 4.36.0` 型検査に失敗する。 |
| **`LA-F34`** | `主張 LA-34` (`SEU` `SECDED` 耐性および `openXC7` `.bit` `PAR`) | `Nucleus` `(72, 64)` `SECDED + 0x3C` が `BER = 1%` で `> 0%` のサイレント破損または `< 100%` の生存率を示すか、`openXC7` `nextpnr-xilinx` が `xc7a200tfbg484-2` 上で `250 MHz` タイミング達成または `.bit` 出力に失敗する。 |
| **`LA-F35`** | `主張 LA-35` (`Lupanov` / `TreeLUT` / `KAN-LUT` および `13.88 KB` `lut6_core.wasm`) | `Lupanov`（`k=8`）、`TreeLUT`、または量子化 `KAN-LUT` が `>= 1` 最小項で不一致となるか、`lut6_core.wasm` が `16 KB` を超えるかもしくは `V8` `WebAssembly.instantiate` 検証に失敗する。 |
| **`LA-F36`** | `主張 LA-36` (`Wearable-MoL` 対 スマートグラス小型LLM) | `Wearable-MoL` Rung 0 がスマートウォッチ `64 KB` `SRAM` を超えるか、ホワイトボード問題で `> 0%` のプレフィックス汚染を許すか、`>= 1` 件のベンチマーク問題を結晶化する。 |
| **`LA-F37`** | `主張 LA-37` (`LastExam` 較正および `CHR@80`) | `scripts/run_wearable_and_lastexam_benchmark.py` が `cais/hle` アクセス制限を回避するか、生テキストを保存するか、`> 5%` の `CHR@80` を記録するか、`Qwen3.6-35B-A3B` 比で `RMS-CE` 削減が `< 3×` にとどまる。 |
| **`LA-F38`** | `主張 LA-38` (`56` ビット `uLM-28M` 開幕応答、`hle:3r2s` 隔離、および `82` 証明) | `pack_ulm4_56bit` 往復変換が失敗するか、`admit_to_wearable_crystal` が `hle:3r2s` を通すか、`WearableLastExam.lean` が `6` カーネル（`82/82`）のいずれかに失敗するか、`Window 10` の `Thor` 物理シャント利得が `< 50×` となる。 |
| **`LA-F39`** | `主張 LA-39` (`Bonsai-2-27B` `1.75 bpw` `EntroMCU` と `FWHT-1024` シャント) | `Ternary-Bonsai-2-27B` に無効な `c=3` 符号が含まれるか、`28 B` 変換で `FP32` 誤差 `> 0` が生じるか、`Window 12` の `Thor` `measured_j` 利得が `Window 13` 比 `< 1.3×` となる。 |
| **`LA-F40`** | `主張 LA-40` (`Mapika/decider-0.8b` 対 `4 KB` `System-0` `LUT6`) | `CompactLut6Page` が `64 KB` ウォッチ `SRAM` の `16%` を超えるか、OOD 誤動作 `> 0%` を許容するか、Wave 2 高速化が `< 1,000×` に留まる。 |
| **`LA-F41`** | `主張 LA-41` (`ARC-AGI-2` + `MiniF2F-Lean4` + `CritPt` 公開三部作) | 制限付きデータセットへアクセスするか、生テキストを保存するか、不健全な `Lean 4.36.0` 証明を `> 0%` 許容するか、`CritPt` で `CHR@80 > 5%` を記録する。 |
| **`LA-F42`** | `Claim LA-42` (`Bonsai-2-27B` `1.75 bpw` `EntroMCU-28 AirMoL` ストリーミング) | `remote_m3u_bonsai27b_airmol_stream.py` で `pread` 誤差 `> 0`、Greedy 一致 `< 100%`、`GiB/tok` 削減 `< 1.5×`、または `Window 14` の `Thor` シャント利得 `< 5.0×` となる。 |
| **`LA-F43`** | `Claim LA-43` (`ARC-AGI-2` 多層 `Beneš-ARC-LUT6`) | `Beneš-ARC-LUT6` ($L=2,3$) が `n=24` で1層を上回らないか `n=64` で `< 1.75×` となる、生グリッドを保存する、または `CHR@80 > 0%` となる。 |
| **`LA-F44`** | `Claim LA-44` (公式対話型 `ARC-AGI-3` `RHAE` およびルール変化遮断器) | スクリプトがゲームの `.py` ソースを読む、生フレームを保存する、第2波 `RHAE` 利得が `< 50×` となる、またはルール変化時に遮断器が作動しない。 |
| **`LA-F45`** | `Claim LA-45` (`16` ゲーム `ARC-AGI-3` `IW(1)` + 因果的 `ACTION6` 枝刈り) | `scripts/run_phase37_arc3_iw1_benchmark.py` がゲームの `.py` ソースを読む、生フレームを保存する、`FIFO-BFS` を上回らない、または第1波 / 第2波 `RHAE` 利得が `< 10×` / `< 100×` となる。 |
| **`LA-F46`** | `Claim LA-46` (`VerilogEval-Hard12` `RTL` および `KernelBench` Level-2 Metal) | `OpenIE-Apex-Harness` が `iverilog/vvp` + Yosys `abc -lut 6` で破損 `RTL` を `> 0%` 通す、退行 Metal シェーダ（`FP16` 誤差 `> 1e-2`）を通す、または `MLX` eager に勝てない。 |
| **`LA-F47`** | `Claim LA-47` (`PutnamBench` / `FormalConjectures` `24` 定理 `Lean 4.36.0`) | `OpenIE-Apex-Harness` が不健全証明（`sorry`、`admit`、`native_decide`）を通す、`24` 定理中 `< 100%` の検証に留まる、または第2波 `.lut6` 高速化が `< 100×` となる。 |
| **`LA-F48`** | `Claim LA-48` (`256` ステップホライズン、`82` 証明、`13.88 KB` `WASM`、および `Window 16`) | `4,096` 遷移で `>= 1` 件の違反が生じる、6カーネル証明が `< 82` / `< 1,446` 件となる、`WASM` が `16 KB` を超える、または `Thor` `Window 16` シャント利得が `< 10×` となる。 |
| **`LA-F49`** | `Claim LA-49` (`16` ゲーム `ARC-AGI-3` 関係 `IW(2) + Beneš-LUT6`) | `scripts/run_phase38_arc3_iw2_benchmark.py` がゲームの `.py` ソースを読む、生フレームを保存する、または第1波・第2波の突破レベル数と平均 `RHAE` の双方で `IW(1)` を厳密に上回らない。 |
| **`LA-F50`** | `Claim LA-50` (`7` 基盤 `waiOS` 適合性および `HeteroMosaic-MoL`) | `7` 基盤のいずれかが `BLAKE3 = a541323b...` から逸脱する、第 77 行故障 `4ac7c4fb...` で停止しない、改ざん `Ed25519` 署名を受理する、`Thor` 以外で `board_metered = true` を付与する、または `HeteroMosaic-MoL` が全 `GPU` 比 `< 50×` に留まる。 |
| **`LA-F51`** | `Claim LA-51` (`0.1056-0.4498 bpw` `JouleBit-LUT6` 対 `LittleBit-2` `JpCT`) | `JouleBit-LUT6` が `> 0` `QAT` トークンまたは実行時二値 `MAC` を使用する、`100.00%` Greedy 一致を失う、または `Thor` `Window 18` シャント `< 20×` / Cortex-`M55` `DWT` `< 50×` に留まる。 |
| **`LA-F52`** | `Claim LA-52` (`256` 課題帰無スイート、`90` 証明、および `13` エクスポート `WASM`) | 構造化 `D1-D4` で帰無精度 `< 100%`、非構造化 `D5-D8` で `Scholar-Codifier + MoL` `< 100%`、6カーネル証明が `< 90` / `< 1,454` 件、または `lut6_core.wasm` が `16,384 B` を超える。 |
| **`LA-F53`** | `Claim LA-53` (`16` ゲーム `ARC-AGI-3` ランドマーク `SIW(2)` と `8 KB` ボールト) | ゲーム `.py` を参照、生フレームを保存、突破数・ゲーム数・平均 `RHAE` で `IW(2)` を厳密に上回らない、第2波で衝突 `> 0`、または `8,192 B` を超える。 |
| **`LA-F54`** | `Claim LA-54` (実機 `Bonsai-2-27B` `JouleBit-LUT6` ストリーミングと `Window 19`) | `QAT` `> 0`、`100.00%` 一致から逸脱、コールド第1波で `<= 1.000 tok/sweep`、`JpCT` で劣後、または `Window 19` が `Thor` `measured_j` 利得を失う。 |
| **`LA-F55`** | `Claim LA-55` (`111.45 MHz` `openXC7`、`14` エクスポート `WASM`、`98` 証明) | `DSP48E1` `> 0`、`64/64` `RTL` 一致や `100 MHz` `PAR` に失敗、6カーネル証明が `< 98` / `< 1,463` 件、または `lut6_core.wasm` が `16,384 B` を超える。 |
| **`LA-F64`** | `Claim LA-64` (`ARC-AGI-3` `60.0%` 絶対多数 `C-BFWS` と `48 KB` ボールト) | ゲーム `.py` 参照、突破 `< 15/25` または `< 11/16` ゲーム、第2波ブレーカ作動 `> 0`、または `49,152 B`（ウォッチ `SRAM` の `75.00%`）超過。 |
| **`LA-F65`** | `Claim LA-65` (`Terminal-Bench & Cybench-Defensive` と `144/144` `Yosys` マイタ) | 破損/脆弱コミット `> 0%`、攻撃的エクスプロイト実行、または `144/144` `Yosys` `abc -lut 6` マイタ不合格。 |
| **`LA-F66`** | `Claim LA-66` (`FrontierMath & SciCode` と `Window 22` `Thor` シャント) | 数学/物理課題に失敗、シンプレクティック/ユニタリ保存逸脱、または `Thor` `Window 22` `measured_j` 利得 `< 2.5×`。 |
| **`LA-F67`** | `Claim LA-67` (`100.55 MHz` `openXC7`、`17` エクスポート `WASM`、`122` 証明) | `DSP48E1` `> 0`、`64/64` 一致や `100 MHz` `PAR` 失敗、6カーネル証明 `< 122` / `< 1,486` 件、または `WASM` `16,384 B` 超過。 |
| **`LA-F68`** | `Claim LA-68` (実機 `Magnitude 0.3.5` と `Thor` `VIN` `measured_j`) | 生テキスト保存、`Thor` 以外で `board_metered = true`、`twist` `JpCT` 劣後、または破損コミット受理。 |
| **`LA-F69`** | `Claim LA-69` (3 階層 `Tiered-Expert-AirMoL`) | `64/64` `LUT6` 一致失敗、または `180B`・`552B`・`30B` で `K=1` スループットに劣後。 |
| **`LA-F70`** | `Claim LA-70` (`Engram-LUT6` `144/144` マイタと `Window 23` シャント) | `144/144` `Yosys` マイタ不合格、または `Window 23` で `Thor` `measured_j` 非削減。 |
| **`LA-F71`** | `Claim LA-71` (`100.74 MHz` `openXC7`、`18` エクスポート `WASM`、`130` 証明) | `DSP48E1` `> 0`、`100 MHz` `PAR` 失敗、証明 `< 130` / `< 1,494` 件、または `WASM > 16,384 B`。 |
| **`LA-F72`** | `Claim LA-72` (Rust プロキシ `mol-magnitude-adapter` と `CogLoadBench` `4×`) | Python/外部 crate 依存、Vulkan クラッシュ、合格率 `< 100%`、または第 2 波 `Thor` `VIN` 削減 `< 1,000×`。 |
| **`LA-F73`** | `Claim LA-73` (`MCPMark` `CoW` `CRUD` サンドボックスと `144/144` マイタ) | `24` ワークフロー `MCPMark` で本番破壊 `> 0%`、または `144/144` `Yosys` `abc -lut 6` マイタ不合格。 |
| **`LA-F74`** | `Claim LA-74` (`BA-Tiered-Expert-AirMoL` 対 `FreeToken` と `Window 24`) | `FreeToken` 比 `< 3.5×`、`KTransformers` 比 `< 5.0×`、または `Window 24` `Thor` `measured_j` 利得 `< 2.5×`。 |
| **`LA-F75`** | `Claim LA-75` (`64.00 KB` `SRAM`、`106.97 MHz` `openXC7`、`19` エクスポート `WASM`、`138` / `1,502` 証明) | `14 × 4,096 + 4,096 + 4,096 != 65,536 B`、`Fmax < 100 MHz`、証明 `< 138` / `< 1,502` 件、または `lut6_core.wasm > 16,384 B`。 |
| **`LA-F76`** | `Claim LA-76` (`LTCB` `enwik8` `100 MB` と Mahoney 閾値 $N^*$) | 生 `enwik8` 保存、ホスト間 `SHA-256` 不一致、`Thor` 以外で `board_metered = true`、または `gzip -9` に劣後。 |
| **`LA-F77`** | `Claim LA-77` (`tufazip v2` `QPI1` 監査と `144/144` マイタ) | `weights.bin` 保存、`34,080,768` ビット（`5,680,128` スラブ）でビット誤差、または `144/144` `Yosys` マイタ不合格。 |
| **`LA-F78`** | `Claim LA-78` (`Window 25` `Thor` シャント) | `measured_j` と `reported_j` 混在、`Thor` 以外で `board_metered = true`、または `Thor` 削減 `< 10.0×`。 |
| **`LA-F79`** | `Claim LA-79` (`102.41 MHz` `openXC7`、`20` エクスポート `WASM`、`146` / `1,510` 証明) | `DSP48E1 > 0`、`Fmax < 100 MHz`、証明 `< 146` / `< 1,510` 件、または `WASM > 16,384 B`。 |
| **`LA-F80`** | `Claim LA-80` (`enwik8` で `zstd -19`・`bzip2 -9` を凌駕する `MoL-LTCB-CM2`) | 生 `enwik8` 保存、`WRT` 全単射失敗、`5342cc0b24a603b0...` 不一致、または `enwik5..enwik8` で `zstd -19`・`bzip2 -9`・`gzip -9`・`v1` に劣後。 |
| **`LA-F81`** | `Claim LA-81` (`0` バイト `i16` `Online-TTT-LUT6` と `144/144` マイタ) | `512` ステップで `i16` 不一致 `>= 1`、後悔削減 `< 50%`、スラブスキップ `< 80%`、または `144/144` `Yosys` マイタ不合格。 |
| **`LA-F82`** | `Claim LA-82` (`Window 26` `Thor` シャント) | `Thor` 以外で `board_metered = true`、`Thor` `measured_j` 削減 `< 25.0×`、または `Zen 5`・`M3 Ultra` で `< 10.0×`。 |
| **`LA-F83`** | `Claim LA-83` (`103.25 MHz` `openXC7`、`21` エクスポート `WASM`、`> 150`［`154` / `1,518`］証明) | `DSP48E1 > 0`、`Fmax < 100 MHz`、証明 `< 154` / `< 1,518` 件、または `lut6_core.wasm > 16,384 B`。 |

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
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., and Narasimhan, K. (2024). SWE-bench: Can Language Models Resolve Real-World GitHub Issues? <em>ICLR 2024</em>, <em>arXiv:2310.06770</em>.</li>
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
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2024). BigCodeBench: Benchmarking Code Generation with Diverse Function Calls and Complex Instructions. <em>ICLR 2025</em>, <em>arXiv:2406.15877</em>.</li>
<li>Moura, L. de, and Ullrich, S. (2021). The Lean 4 Theorem Prover and Programming Language. <em>CADE 28</em>, <em>LNCS</em> 12699:625-635.</li>
<li>NVIDIA (2026). <code>nvidia/Nemotron-3-Super-120B-A12B</code> Hybrid Mamba-Attention Sparse-MoE Open-Weights Model Card. <a href="https://huggingface.co/nvidia/Nemotron-3-Super-120B-A12B-BF16">huggingface.co/nvidia/Nemotron-3-Super-120B-A12B-BF16</a>.</li>
<li>Mistral AI (2025). <code>mistralai/Devstral-Small-2-24B-Instruct-2512</code> Open-Weights Software Engineering Model Card. <a href="https://huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512">huggingface.co/mistralai/Devstral-Small-2-24B-Instruct-2512</a>.</li>
<li>Ye, J., Gong, X., Wang, J., Kondrateva, O., Li, B., and Zhang, G. L. (2026). DiffLUT-Net: Differentiable Training of FPGA LUT Networks with Learnable Connectivity. <em>arXiv:2609.09254</em>.</li>
<li>Andronic, M., and Constantinides, G. A. (2025). NeuraLUT-Assemble: Hardware-Aware Assembling of Sub-Neural Networks for Efficient LUT Inference. <em>IEEE FCCM 2025</em>, <em>arXiv:2504.00592</em>.</li>
<li>Tian, R., Chen, Y., Xu, W., and Rosing, T. Š. (2026). PALUTE: Processing-In-Memory Acceleration via Lookup Table for Edge LLM Inference. <em>arXiv:2606.08891</em>.</li>
<li>Sanyal, A., Chinchali, S. P., and Datta, G. (2026). EntroMCU: A Hardware-Algorithm Vision for LLM Inference on Microcontrollers. <em>IEEE ISVLSI 2026</em>.</li>
<li>Linial, N., Mansour, Y., and Nisan, N. (1993). Constant Depth Circuits, Fourier Transform, and Learnability. <em>Journal of the ACM</em>, 40(3):607-620.</li>
<li>Thinking Machines Lab (2026). <code>thinkingmachines/Inkling-2-Mini</code> Open-Weights Looped Multimodal MoE Model Card (November 20, 2026). <a href="https://huggingface.co/thinkingmachines/Inkling-2-Mini">huggingface.co/thinkingmachines/Inkling-2-Mini</a>.</li>
<li>NVIDIA Nemotron Labs (2026). <code>nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16</code> Looped nGPT Model Card (October 20, 2026). <a href="https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16">huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16</a>.</li>
<li>Advanced Micro Devices (2023). <em>Artix-7 FPGAs Data Sheet: DC and AC Switching Characteristics (DS181, v1.28)</em> and <em>7 Series FPGAs Packaging and Pinout Product Specification (UG475, v1.19)</em>. AMD Technical Documentation.</li>
<li>Mo, Z., Wang, L., Wei, J., Zeng, Z., Cao, S., Ma, L., Jing, N., Cao, T., Xue, J., Yang, F., and Yang, M. (2025). LUT Tensor Core: A Software-Hardware Co-Design for LUT-Based Low-Bit LLM Inference. <em>ACM/IEEE ISCA 2025</em>, <em>arXiv:2408.06003</em>.</li>
<li>Bacellar, A. T. L., Lima, G. M., França, F. M. G., and John, L. K. (2026). Fault-Tolerant Weightless Neural Networks Under Parameter Bit-Flip Errors. <em>Transactions on Machine Learning Research (TMLR)</em>, July 2026.</li>
<li>Bührer, T., Plesner, A., Aczel, T., and Wattenhofer, R. (2026). BitLogic: Scaling Continuous Logic Gate Networks via Lookup Tables. <em>ETH Zürich</em>, <em>arXiv:2602.07400</em>.</li>
<li>Khataei, A., and Bazargan, K. (2025). TreeLUT: An Efficient Architecture for Gradient Boosted Decision Trees Using FPGA Lookup Tables. <em>arXiv:2501.01511</em>.</li>
<li>Lupanov, O. B. (1958). Ob odnom metode sinteza skhem [On a Method of Circuit Synthesis]. <em>Izvestiya VUZov, Radiofizika</em>, 1(1):120-140.</li>
<li>Ho, S., and Protzenko, J. (2022). Aeneas: Rust Verification by Functional Translation (<code>AeneasVerif/charon</code> &amp; <code>AeneasVerif/aeneas</code>). <em>ICFP 2022</em>, <em>PACMPL</em> 6(ICFP):711-741, <a href="https://doi.org/10.1145/3547647">doi:10.1145/3547647</a>.</li>
<li>He, Z., Yin, X., Wen, Z., Zhu, C., Liu, K., Wei, J., Wu, Y., Cao, T., and Yang, M. (2025). LUT-LLM: Efficient Large Language Model Inference with Memory-Compute Co-Design on FPGAs. <em>arXiv:2511.06174</em>.</li>
<li>Phan, L., Gatti, A., Han, Z., Li, N., Hu, J., Zhang, H., Zhang, C. B. C., Shaaban, M., Ling, J., Shi, S., et al. (2026). Humanity's Last Exam (<code>cais/hle</code>, <a href="https://lastexam.ai/">lastexam.ai</a>). <em>Nature</em>, 649:1139-1146, <em>arXiv:2501.14249</em>.</li>
<li>Cheng, J., Li, S., Zhang, Y., et al. (2026). Micro Language Models Enable Instant Responses (<code>Sensente/uLM-28M</code>, University of Washington &amp; Meta AI). <em>EMNLP 2026</em>, <em>arXiv:2604.19642</em>.</li>
<li>M-A-P Team, ByteDance Seed, et al. (2025). SuperGPQA: Scaling LLM Evaluation across 285 Graduate Disciplines (<code>m-a-p/SuperGPQA</code>). <em>arXiv:2502.14739</em>.</li>
<li>Liu, X., et al. (2026). MicroLLM-R1: Reasoning on Microcontrollers and Ultra-Small Edge Devices. <em>arXiv:2603.24967</em>.</li>
<li>Prism ML (2026). <code>prism-ml/Ternary-Bonsai-2-27B</code> &amp; <code>Ternary-Bonsai-2-27B-mlx-2bit</code> Native Hadamard-Ternary Open-Weights Foundation Model Card (<code>Qwen/Qwen3.8-27B</code> Base, November 2026). <a href="https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-mlx-2bit">huggingface.co/prism-ml/Ternary-Bonsai-2-27B-mlx-2bit</a>.</li>
<li>Mapika (2026). <code>Mapika/decider-0.8b</code> Dedicated <code>System-1</code> Structured JSON Decision Model Card (November 2026). <a href="https://huggingface.co/Mapika/decider-0.8b">huggingface.co/Mapika/decider-0.8b</a>.</li>
<li>Chollet, F., Knoop, M., Kamradt, G., Landers, B., and Pinkard, H. (2025). ARC-AGI-2: A New Challenge for Frontier AI Reasoning Systems (<code>arcprize/ARC-AGI-2</code>). <em>ARC Prize Foundation</em>, <em>arXiv:2505.11831</em>.</li>
<li>Zheng, K., Han, J. M., and Polu, S. (2022). MiniF2F: A Cross-System Benchmark for Formal Olympiad-Level Mathematics (<code>cat-searcher/minif2f-lean4</code>). <em>ICLR 2022</em>, <em>arXiv:2109.00110</em>.</li>
<li>CritPt-Benchmark Collaboration (2025). CritPt: Complex Research-Level Physics Problems for Testing Reasoning at the Critical Point (<code>CritPt-Benchmark/CritPt</code>). <a href="https://huggingface.co/datasets/CritPt-Benchmark/CritPt">huggingface.co/datasets/CritPt-Benchmark/CritPt</a>.</li>
<li>ARC Prize Foundation (2026). ARC-AGI-3: Interactive Reasoning Benchmark &amp; <code>ARCEngine</code> Toolkit (<code>arc-agi 0.9.10</code>, <code>arcengine 0.9.3</code>, MIT License). <a href="https://arcprize.org/arc-agi/3/">arcprize.org/arc-agi/3</a>.</li>
<li>Lipovetzky, N., and Geffner, H. (2012). Width and Serialization of Classical Planning Problems (<code>IW(k)</code>). <em>ECAI 2012</em>, <em>FAIA</em> 242:540-545, <a href="https://doi.org/10.3233/978-1-61499-098-7-540">doi:10.3233/978-1-61499-098-7-540</a>.</li>
<li>Novikov, A., Vũ, N., Eisenberger, M., Dupont, E., Huang, P.-S., Wagner, A. Z., Shirobokov, S., Kozlovskii, B., Ruiz, F. J. R., Mehrabian, A., Kumar, M. P., See, A., Chaudhuri, S., Holland, G., Davies, A., Nowozin, S., Kohli, P., and Balog, M. (2025). AlphaEvolve: A Coding Agent for Scientific and Algorithmic Discovery. <em>Google DeepMind</em>, <em>arXiv:2506.13131</em>.</li>
<li>Pinckney, N., Batten, C., Liu, M., Ren, H., and Khailany, B. (2025). Revisiting VerilogEval: A Year of Improvements in Large-Language Models for Hardware Code Generation (<code>NVlabs/verilog-eval</code> v2). <em>ACM TODAES</em>, <em>arXiv:2408.11053</em>.</li>
<li>Ouyang, A., Guo, S., Arora, S., Zhang, A. L., Hu, W., Ré, C., and Mirhoseini, A. (2025). KernelBench: Can LLMs Write Efficient GPU Kernels? (<code>ScalingIntelligence/KernelBench</code>). <em>ICML 2025</em>, <em>arXiv:2502.10517</em>.</li>
<li>Tsoukalas, G., Lee, J., Jennings, J., Xin, J., Ding, M., Jennings, M., Thakur, A., and Chaudhuri, S. (2024). PutnamBench: Evaluating Neural Theorem-Provers on the Putnam Mathematical Competition. <em>NeurIPS 2024</em>, <em>arXiv:2407.11214</em>.</li>
<li>de Moura, L., and Bjørner, N. (2008). Z3: An Efficient SMT Solver. <em>TACAS 2008</em>, <em>LNCS</em> 4963:337-340, <a href="https://doi.org/10.1007/978-3-540-78800-3_24">doi:10.1007/978-3-540-78800-3_24</a>.</li>
<li>Josefsson, S., and Liusvaara, I. (2017). Edwards-Curve Digital Signature Algorithm (<code>EdDSA</code> / <code>Ed25519</code>). <em>IETF RFC 8032</em>, <a href="https://doi.org/10.17487/RFC8032">doi:10.17487/RFC8032</a>.</li>
<li>O'Connor, J., Aumasson, J.-P., Neves, S., and Wilcox-O'Hearn, Z. (2020). BLAKE3: One Function, Fast Everywhere (<code>BLAKE3</code> Cryptographic Hash Specification). <a href="https://github.com/BLAKE3-team/BLAKE3-specs">github.com/BLAKE3-team/BLAKE3-specs</a>.</li>
<li>Magnitude (2026). Magnitude (<code>Seismic</code>): Open-Source Native Rust Local LLM Inference Engine (<code>magnitudedev/magnitude</code>, v0.3.5, MIT License). <a href="https://magnitude.dev/">magnitude.dev</a>.</li>
<li>Wu, Z., et al. (2025). MCPMark: Benchmarking Multi-Turn Stateful Model Context Protocol Tool Use. <em>arXiv:2509.24002</em>.</li>
<li>Chen, H., et al. (2025). KTransformers: Unleashing the Full Potential of CPU/GPU Hybrid Inference for MoE Models. <em>ACM SOSP 2025</em>, <em>arXiv:2507.01909</em>.</li>
<li>Yang, Z., Stoica, I., Han, S., Zaharia, M., et al. (2026). FreeToken: Bandwidth-Balanced Heterogeneous CPU-GPU Offloading for Large Sparse MoE Inference. <em>arXiv:2608.07296</em>.</li>
<li>Mahoney, M. (2026). Large Text Compression Benchmark (<code>enwik8</code> / <code>enwik9</code>). <a href="https://mattmahoney.net/dc/text.html">mattmahoney.net/dc/text.html</a>.</li>
<li>Bellard, F. (2021). NNCP v2: Lossless Data Compression with Transformer/LSTM Neural Networks. <a href="https://bellard.org/nncp/">bellard.org/nncp</a>.</li>
<li>He, T. (2026). tufazip v2: 1-Bit Looped-Transformer Online Arithmetic Coding on <code>enwik9</code> (<code>Tufalabs/tufazip</code>, MIT License). <a href="https://github.com/Tufalabs/tufazip">github.com/Tufalabs/tufazip</a>.</li>
<li>Mahoney, M. V. (2005). Adaptive Weighing of Context Models for Lossless Data Compression (<code>PAQ</code> &amp; <code>SSE</code>). <em>Florida Institute of Technology CS-2005-16</em>.</li>
<li>Skibiński, P., Grabowski, S., and Deorowicz, S. (2005). Revisiting Dictionary-Based Compression (<code>WRT</code>). <em>Software: Practice and Experience</em>, 35(15):1455–1476.</li>
</ol>

---

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## 付録A. 再現性

[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai)（`commit 597c50b`）および [openIE-dev/openie-research-experiments](https://github.com/openIE-dev/openie-research-experiments)（`aller-a7-xc7a200t/` および `lut6-core-nucleus/`）のチェックアウトから以下を実行する：

```bash
PYTHONPATH=src .venv/bin/pytest -v
(cd sys/lut6-core && cargo test --release && cargo run --release --features std --bin mol_ltcb_codec -- --self-test && cargo run --release --features std --bin mol_ltcb_codec -- --cm2 --self-test && cargo run --release --bin mol_magnitude_adapter -- --self-test && cargo run --release --bin bench_lut6_nucleus_shunt)
PYTHONPATH=src .venv/bin/python scripts/run_phase46_ltcb_cm2_fleet.py
PYTHONPATH=src .venv/bin/python scripts/run_phase46_window26_five_silicon.py
PYTHONPATH=src:scripts .venv/bin/python scripts/run_openxc7_ltcb_cm2_ttt_par.py
PYTHONPATH=src .venv/bin/python scripts/run_phase45_ltcb_fleet.py
PYTHONPATH=src .venv/bin/python scripts/run_phase45_window25_five_silicon.py
PYTHONPATH=src .venv/bin/python scripts/run_openxc7_ltcb_kraft_par.py
PYTHONPATH=src .venv/bin/python scripts/run_phase44_rust_magnitude_fleet.py
PYTHONPATH=src .venv/bin/python scripts/run_phase44_window24_five_silicon.py
PYTHONPATH=src .venv/bin/python scripts/run_openxc7_mag_mcp_freetoken_par.py
PYTHONPATH=src .venv/bin/python scripts/run_phase43_magnitude_head_to_head.py
PYTHONPATH=src .venv/bin/python scripts/run_phase43_window23_five_silicon.py
PYTHONPATH=src .venv/bin/python scripts/run_openxc7_tiered_engram_par.py
PYTHONPATH=src .venv/bin/python scripts/run_phase42_arc3_cbfws_25env_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_phase42_terminal_cybench_and_scicode.py
PYTHONPATH=src .venv/bin/python scripts/run_phase42_window22_five_silicon.py
PYTHONPATH=src .venv/bin/python scripts/run_openxc7_cbfws12_cybench_par.py
PYTHONPATH=src .venv/bin/python scripts/run_phase41_arc3_rbfws_25env_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_phase41_enigma_zerobench_and_horizon1000.py
PYTHONPATH=src .venv/bin/python scripts/run_phase41_window21_five_silicon.py
PYTHONPATH=src .venv/bin/python scripts/run_openxc7_rbfws8_enigma_par.py
PYTHONPATH=src .venv/bin/python scripts/run_phase40_arc3_bfws_25env_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_phase40_multimodal_and_well_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_phase38_arc3_iw2_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_phase38_waios_joulebit_null.py
PYTHONPATH=src .venv/bin/python scripts/run_openxc7_apex_waios_par.py
PYTHONPATH=src .venv/bin/python scripts/run_phase37_apex_harness_walls.py
PYTHONPATH=src .venv/bin/python scripts/run_phase37_arc3_iw1_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_wearable_and_lastexam_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_global_frontiers_seu_treelut_kan.py
PYTHONPATH=src .venv/bin/python scripts/run_charon_aeneas_rust_to_lean.py
PYTHONPATH=src .venv/bin/python scripts/run_openxc7_xc7a200t_par_audit.py
PYTHONPATH=src .venv/bin/python scripts/pack_lut6_crystal.py
PYTHONPATH=src .venv/bin/python scripts/run_dual_reality_lut6_eval.py
PYTHONPATH=src .venv/bin/python scripts/run_nov2026_models_lut6_benchmark.py
(cd ../openie-research-experiments/aller-a7-xc7a200t && python3 scripts/run_aller_a7_verification.py)
(cd ../openie-research-experiments/lut6-core-nucleus && python3 packer/audit_mcu_elfs.py)
(cd proofs && lake build) && PYTHONPATH=src .venv/bin/python scripts/verify_lean_proofs.py
PYTHONPATH=src .venv/bin/python scripts/run_multirepo_swebench_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_120b_hybrid_moe_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/verify_ce_gated_vcd_power.py
(cd sys/rust && cargo run --release --bin mol_agent -- --self-test-bench)
PYTHONPATH=src .venv/bin/python scripts/run_external_public_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_pipelined_250mhz_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_rung3d_thinking_ceiling.py
(cd sys/rust && cargo test --release && cargo run --release --bin bench_cubecl_moe_deltanet)
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
