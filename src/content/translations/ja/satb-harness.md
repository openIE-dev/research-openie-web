---
title: "Satiation Benchmark：リファレンスハーネス、アダプタ、およびテレメトリ帰属"
deck: "Lane B（固定順次実行のRust参照ハーネス）、単一のプロキシ強制アダプタブリッジ（Shapes D、M、H、およびI）、12項目の適合性検査スイート（C1からC12）、および5段階のルートレス・テレメトリ帰属エンジン（L0からL4までのレベルとAからNまでのラベルの組み合わせ）を提示する。これらは5種類のハードウェア・アーキタイプにおいて実証的に検証した。対象は、Apple M5 Max（arm64 macOS の IOReport と proc_pid_rusage による reported_j）、Tegra aarch64 Jetson Thor（全ボードの物理計測値と、レール分離型の電流シャント3チャネルによる measured_j）、Framework Desktop Strix Halo（x86-64 Linux において 0440 root:energy のグループ分離により取得するパッケージエネルギーの reported_j と、グラフィックスパッケージ電力の追跡）、Intel Core i9-13900H Raptor Lake（x86-64 Linux のプラットフォームレベル L1 およびパッケージ0 の L2 による reported_j）、そして Windows 11 上の Intel Core i7-1165G7 Tiger Lake と GeForce 2060 の組み合わせ（x86-64 ビルド26300 におけるルートレスの累積型ディスクリートグラフィックス L2 reported_j、Win32 Job Object およびサイクル会計、ならびにプロセッサパッケージのラベル N）である。生の measured_j、reported_j、および L4 の論理チャネルは厳密に分離して保持し、決して合算しない。協調テナントのワークロードが共有ホスト上で稼働していたため（dedicated_host は false）、Falsifier 6 に従い A2 のネット配置帰属は保留とする。"
lang: "ja"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*Revision af57f48, 22 November 2026. データおよび要約ダイジェスト: [/data/#satb-harness](/data/#satb-harness). 対話型リビングフィギュア: [/living/satb-harness/](/living/satb-harness/). LaTeXアーカイブツイン: [/pdfs/latex/satb-harness.pdf](/pdfs/latex/satb-harness.pdf) ([ソース](/pdfs/latex/satb-harness.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概要

2つの agent 評価がタスク完了率やエネルギー値で異なる結果を報告する場合、その差異はモデル自体よりも、モデルをどのように包んだか(ラッピング)とホスト側カウンタをどのように帰属させたかに由来することが多い。`Terminal-Bench 2` において、周囲のハーネスのみを変更しただけで `Gemini 2.5 Pro` のタスク解決率が `17` パーセントポイント変動した。また、ドリフトしたアイドルベースラインを減算する処理や、共有シリコンレールをプロセッサ時間で按分する処理は、エネルギー帰属を `30%` 以上歪めうる。

本研究は、**Satiation Benchmark（`SATB`）**の評価契約を規定し、その有効性を実証的に検証する。本契約は、単一の固定逐次型Rustリファレンスハーネス（**`Lane B`**）、ゼロモデル統制実験、生のモデルエンドポイント、外部コマンドラインハーネス、公開ベンチマークソルバーを対象とするプロキシ隔離型アダプタブリッジ（**`Shapes D, M, H, and I`**）、5ブロックからなるシステム・アンダー・テスト（`SUT`）の暗号学的フィンガープリント、12項目の必須適合性検査、5段階のルートレス・テレメトリエンジンから構成される。設計を未測定のまま残すのではなく、`macOS`、`Linux`、`Windows 11`にまたがる5種類のハードウェア類型において、適合性検査と反証検査を実行した。対象は、`Apple M5 Max`ワークステーション（統合メモリ`128`ギガバイト、`macOS 27.2.1`、オンチップの`IOReport`およびカーネルの`proc_pid_rusage`による`reported_j`）、Tegra `aarch64`開発キット（`Jetson Thor`、`Linux 6.8.12-1021-tegra`、Texas Instruments製のボード全体および3チャネルのレール分離型電流シャントによる物理的な`measured_j`）、`Framework` Desktop `Strix Halo`ワークステーション（`Ryzen Max+ 395`、`Linux 7.0.0-43-generic x86-64`、`0440 root:energy`によるグループ隔離されたパッケージエネルギー`reported_j`と`amdgpu`のパッケージ電力追跡）、`Raptor Lake`ワークステーション（`Intel Core i9-13900H`、`Linux 7.0.0-43-generic x86-64`、プラットフォームおよびパッケージのエネルギー`reported_j`）、ベアメタルの`Windows 11`ワークステーション（`Intel Core i7-1165G7`と`GeForce 2060`、`Windows 11`ビルド`26300` `x86-64`、ルートレスな累積型ディスクリートグラフィックスの`reported_j`、Win32ジョブオブジェクトによる閉じ込め、および特権を要しないプロセッサパッケージのエネルギーであり、後者は厳密に`not_available`と明示）である。クローズドなクラウドサーバーのエネルギーは、これらとは別に`not_available`として扱った。

**平易に言えば**

1. エージェントのプロンプトループ、コンテキスト削減規則、およびツールサンドボックスは、基盤モデルの差し替えと同程度にベンチマークスコアを大きく変動させうる。そのため`Lane B`では、そのラッパー全体を決定論的なRustで実装して完全に固定する。一方、`Lane O`では外部ラッパーを、監査済みの単一プロキシプラグを経由させる。

2. エネルギーチャネルは、その真の物理的境界において生データとして記録される。すなわち、ウォールプラグ全体、ボード入力、チップパッケージ、オペレーティングシステムのプロセス推定値、または論理トークン台帳である。これらを単一のラベルなし数値に統合すること、証拠クラス（`measured_j` 対 `reported_j` 対 `est_j`）を横断して合算すること、およびフリート全体の持続可能性平均で欠損値を補完することは行わない。

3. 本研究では、五つのシリコンおよびオペレーティングシステムのプラットフォーム（`macOS`、`Linux`、および`Windows 11`）にまたがる実機試験により、以下の事項を検証する。第一に、厳密な`Shape D`の百万レコード規模メモリマップ（`15027705736`）および`C9`リプレイ（`149,747 B`、改行またはバイト差分`0`）の決定性である。第二に、`0.87-9.54 ms`のカーネルプロセスツリー清掃（`Windows 11`上のWin32 Job Objectsでは`2.46 ms`）である。第三に、三ベンダーにおけるクラウドの`temperature = 0`の非決定性である。第四に、ハードウェアセンサのサンプリング周期の上限である。具体的には、Linuxのカウンタ読み出し`24.3-45.4 µs`（`94-97 Hz`）、Windowsのインプロセスのグラフィックスカウンタ読み出し`1.17 ms`（`64.6 Hz`）、`Jetson Thor`上のシリアルバス分流器読み出し`2.95 ms`（`66.6 Hz`）、および`macmon`の`IOReport`（約`8 Hz`）の各値を比較する。第五に、逐次的な計算フェーズとストレージフェーズをプロセッサ時間で分割した際に生じる`32.59%-89.88%`の誤差（`Falsifier 3`）である。第六に、グラフィックスとプロセッサの物理的な分流器レールの分離、および`Falsifier 6`による共有ホストのドリフト・ゲーティング（`dedicated_host = false`）である。

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 用語、略語、および帰属ラベル

<ul id="terms">
<li>SATB, SUT, PFRK, OQ, SPEC, BUNDLE, SUBMIT, REFUSE, STOP: Satiation Benchmark ハーネスおよび帰属仕様、被験システム (system under test)、4 分類の試行結果 (合格、不合格、拒否、強制終了)、解決済みの仕様上の未決事項、規範的仕様文書、タスクバンドルファイル、終端的な解答提出呼び出し、終端的な拒否呼び出し、および逐次ループ停止トークン</li>
<li>ACI, SWE, CLI, MCP, SDK, ACP, ARC, AGI, GUI: Agent-Computer Interface (エージェント・計算機インタフェース)、ソフトウェア工学ベンチマークの接頭辞、コマンドラインインタフェース、Model Context Protocol、ソフトウェア開発キット、Agent Client Protocol、Abstraction and Reasoning Corpus、汎用人工知能ベンチマークスイート (artificial general intelligence benchmark suite)、およびグラフィカルユーザインタフェース</li>
<li>IO, JSON, JSONL, RPC, JCS, UTF, HTTP, SSE, URL: 入出力プロトコル、JavaScript Object Notation、行区切り JSON (line-delimited JSON)、リモートプロシージャコール、JSON Canonicalization Scheme (RFC 8785)、Unicode Transformation Format、Hypertext Transfer Protocol、Server-Sent Events、および Uniform Resource Locator</li>
<li>POSIX、MMAP、DNULLMM1、SHA、SIGKILL、ESRCH、EACCES、EOF、NT、NTFS、CRLF、MSVC、UCRT、FFI、DLL：Portable Operating System Interface、メモリマップドファイルインターフェイス、バイナリメモリマップド決定的ヌルインデックス形式、Secure Hash Algorithm（SHA-256）、捕捉不可のPOSIXプロセス終了シグナル、カーネルの「プロセスなし」ステータス、POSIXの権限拒否エラー状態、ファイル終端ヒアドック区切り子、Windows New Technology カーネル（Windows NT）、New Technology File System、キャリッジリターン・ラインフィード（\r\n）改行シーケンス、Microsoft Visual C++ コンパイラ（cl.exe）、Windows Universal C Runtime（ucrtbase.dll）、外部関数インターフェイス、動的リンクライブラリ</li>
<li>AI, ML, LLM, MLX, GGUF, KV, TP, ENERGY: 人工知能、機械学習、大規模言語モデル、ローカル推論向け Apple 配列フレームワーク (Apple array framework for local inference)、GPT-Generated Unified Format の量子化重み、キーバリューキャッシュ (key-value cache)、テンソル並列 (tensor parallelism)、および ML.ENERGY GPU 電力ベンチマークコンソーシアム</li>
<li>CPU、GPU、APU、ANE、SoC、ALU、ISA、IPC、PID、UID、GID、OS、VM、EC、GB、TGL、RTX：中央処理装置、グラフィックス処理装置、加速処理装置、Apple Neural Engine、システムオンチップ、算術論理装置、命令セットアーキテクチャ、サイクルあたり命令数、プロセス識別子、ユーザー識別子、グループ識別子、オペレーティングシステム、仮想マシン、組込コントローラ、ギガバイト、Intel Tiger Lake モバイルアーキテクチャ、NVIDIA GeForce RTX 離散 GPU ファミリ</li>
<li>RAM、DRAM、SLC、NVMe、PSU、PDU、AC、DC、DVFS、MSR、MMIO、RDTSC、HVCI、WMI、EMI、SRUM：ランダムアクセスメモリ、ダイナミックRAM、システムレベルキャッシュ、Non-Volatile Memory Express、電源ユニット、電源配電ユニット、交流、直流、動的電圧・周波数制御、モデル固有レジスタ、メモリマップド入出力、x86 Read Time-Stamp Counter命令、Windows Hypervisor-Protected Code Integrity、Windows Management Instrumentation、Windows Energy Metering Interface（`\\.\EnergyMeter`）、およびWindowsシステムリソース使用状況モニタ</li>
<li>RAPL, NVML, PPT, TI, I2C, ADC, INA, INA238, INA3221, AGX, VDD, SOC, MSS, VIN, SYS, PLATYPUS: Intel/AMD の Running Average Power Limit、NVIDIA Management Library、AMD Package Power Tracking、Texas Instruments (テキサス・インスツルメンツ)、Inter-Integrated Circuit バス、アナログデジタル変換器 (analog-to-digital converter)、Texas Instruments の電流・電力モニタファミリ (`INA238`、`INA3221`)、NVIDIA Jetson AGX モジュールの階層、ドレイン電源電圧レール (drain supply voltage rail)、システムオンチップ電圧レール (system-on-chip rail)、メモリサブシステム電圧レール (memory subsystem rail)、入力システム電圧レール (input system voltage rail)、およびソフトウェアによるプロセッサ標的型電力漏洩攻撃 (Power Leakage Attacks: Targeting Your Processor Using Software)</li>
<li>API, USD, CNCF, AISI, UK, AMD, NVIDIA: アプリケーションプログラミングインタフェース、米ドル、クラウドネイティブコンピューティング財団、AI安全性研究所、イギリス、アドバンスト・マイクロ・デバイス、NVIDIA社</li>
<li>RCE, MoL, WCA, LUT6: Reality Code Engine [同一組織]、Mixture of Limits [同一組織]、Wise Computer Automation [同一組織]、6入力ブール型ルックアップテーブル</li>
</ul>

テレメトリレベル L0 から L4 にわたり、`SATB` レシートに記録されるすべてのチャネルは、その物理的境界と、次の 4 つの厳格なエビデンスクラスのいずれかを併せ持つ。

| エビデンスクラス | `SATB` レシートおよび表における適用範囲 |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | タスクバンドル、5 ブロックの `SUT` フィンガープリント、およびリプレイトランスクリプトの `SHA-256` と `JCS` (`RFC 8785`) 正規化ダイジェスト。プロキシが記録したプロンプト、キャッシュ、推論、および補完のトークン数。実時間の所要時間。日付付きの `API` 定価 `USD`。 |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | 較正済みの外部 `AC` 壁面アナライザ (`L0`) または物理ボードの電流シャントモニタ (`L1`/`L2`) からのみ値が入力される。`NVIDIA Jetson AGX Thor` 上で、`TI` `INA238` (`hwmon6` `VIN`, `L1`) および `INA3221` (`hwmon5` `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS`, `ch3 VIN_SYS_5V0`, `L2`/`L1`; `board_metered = true`) を介して実機で検証した。取得中にアクティブな同居プロセスが `VDD_GPU` を占有していたため (`dedicated_host = false`)、レール生値の `measured_j` は保持する一方、`A2` の正味配置帰属は留保する。`Apple M5 Max`、`AMD Strix Halo`、`Intel Raptor Lake`、`Windows 11` (`i7-1165G7` + `RTX 2060`) では `measured_j` は `None` のままであり、`L0` の壁面電力は全体を通じて未設定である。 |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | ルート権限を要しないオンチップのテレメトリカウンタ (`Apple M5 Max` の `IOReport` `sys_power` (`L1`) および `macmon` 経由の `chip_power`/`cpu_power`/`gpu_power` (`L2`)。`Intel Raptor Lake` の `RAPL` `psys` (`L1`) および `package-0`/`core`/`uncore` (`L2`)。`Framework AMD Strix Halo` の `RAPL` `package-0`/`core` (`L2`) と `amdgpu` `PPT` のワット値。`Windows 11` の、ルート権限を要しない `NVML` `nvmlDeviceGetTotalEnergyConsumption` による `NVIDIA GeForce RTX 2060` 上の累積 `mJ` (`L2`)) と、`OS` がモデル化したプロセス単位の推定値 (`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3`)、ラベル `D`)。`measured_j` や `est_j` とは決して合算しない。 |
| **`Provider-Attested (P) vs. Not Available (N)`** | クローズドな `API` のリモートサーバエネルギー (およびリング 0 の `RAPL` `MSR` ドライバが禁止されている `Windows 11` のユーザモード `CPU` パッケージエネルギー) は、プロバイダがリクエスト単位のエネルギー値を方法論の原文とともに返す場合にのみ `P` として記録し、それ以外は文字どおり `"not_available"` (ラベル `N`) と記録する。`5.0%` のドリフト境界 (`Falsifier 6`) または `Step 7` の総和検査を満たさない、導出されたベースライン減算値は自動的に破棄され、生のチャネルはそのまま保持される。 |

<div id="11-lineage-design-invariants-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 系譜、設計不変量、および同一機関開示

`SATB` は、標準が存在する場合には独自のプロトコルを考案するのではなく、公的エージェント評価および電力帰属研究に直接依拠する。最小ステートレスシェル実行は `mini-swe-agent` に従い、ソルバおよび外部 CLI ブリッジングは `UK AISI Inspect` (`react()` および `Inspect Agent Bridge`) および `Terminal-Bench` (`Harbor` / `Terminus-2`) に依拠する。ツールスキーマは `RFC 8785` (`JCS`) により正規化された `MCP` を使用し、GPU 累積カウンタ規律は Chung ら (`ML.ENERGY` / `Zeus`) および Yang らによる `nvidia-smi` 部分時間サンプリングの落とし穴に関する研究に従う。比例 `CPU` 分割 (`label C`) は `CNCF Kepler` モデルに対して評価され、Linux `RAPL` 権限分離は Lipp ら (`PLATYPUS`) に従う。伴う Open Interface Engineering 研究、[計測コミットゲート](/papers/gates/)、[タスク飽和対総リバウンド](/papers/satiation/)、および [決定論的ヌル](/papers/deterministic-null/) は、共有アーキテクチャ定義のために厳密に引用される `[same house]` 研究である。

| 契約軸 | 全レーンで保存される不変量 |
| :--- | :--- |
| **試行プロトコル** | 固定タスクラダー。試行あたり最大 1 回の終端 `SUBMIT` または `REFUSE`。試行あたり 1 つの不変 `SHA-256` 領収書。正規化された結果 `pass`, `fail`, `refuse`, `killed`。テスト試行中の検証器フィードバックはゼロ。 |
| **システムアイデンティティ** | 5 ブロック `SUT` フィンガープリント (`model` + `serving` + `sampling` + `harness` + `envelope`)。`session.open` でハッシュ化され、`session.close` で再ハッシュ化される。 |
| **帰属可能エネルギー** | 静止専用ホスト上の全 `SUT` 生ウィンドウエネルギー (`A2`)。専用物理レール上の推論エンジンエネルギー (`A1`)。`Lane B` 下での逐次モデル対ツール位相エネルギー (`B`)。 |
| **非帰属可能** | 未証明閉鎖 `API` サーバジュール (`N`)。共有 `SoC` または統一メモリレールの正確なプロセスごとジュールシェア (`C` および `D` はモデルであり、物理レールメータではない)。モデル重みをエンジンカーネルおよびシリコンから分離。 |

---

<div id="2-survey-of-agent-harnesses-and-why-context-policy-is-part-of-the-system" class="anchor-alias" aria-hidden="true"></div>

## 2. エージェントハーネスの調査およびコンテキストポリシがシステムの一部である理由

現代のコーディング、ターミナル、およびコンピュータ利用ハーネスは、ツールの公開方法、ファイル編集のゲート制御、および拡大する会話履歴の圧縮方法において著しく異なる：

| ハーネス | ループおよびツール表面 | コンテキストおよび履歴ポリシ |
| :--- | :--- | :--- |
| **`mini-swe-agent`** | `Bash` のみ。すべてのアクションが新しいステートレスな `subprocess.run` を生成する。 | 厳密に線形な追記のみのメッセージ履歴。自動圧縮なし。 |
| **`SWE-agent` (`ACI`)** | 100行のウィンドウ付きファイルビューア、リンタゲート付き編集コマンド、簡潔な検索。 | 履歴プロセッサが古い環境観測を有界な要約に折り畳む。 |
| **`Inspect react()`** | `submit()` までの逐次ツールループ：`bash()`、`text_editor()`、`MCP` ツール。 | 編集可能なメッセージ状態と、プラグ可能な履歴切り詰めまたは圧縮ソルバ。 |
| **`Inspect Agent Bridge`** | `Claude Code`、`Codex CLI`、`Gemini CLI`、およびカスタム `SDK` エージェントをローカルプロキシの背後にラップする。 | コンテキスト管理を完全にラップされた外部ハーネスに委譲する。 |
| **`Terminus-2` (`Harbor`)** | 単一ツール：生のキーストロークを受信する永続的 `tmux` ターミナルセッション。 | 3段階のコンテキスト要約（`3-stage` 漸進的トランスクリプト圧縮）。 |
| **`Codex CLI`** | サンドボックス化されたシェル（`Landlock`/`seccomp` または `seatbelt`）、構造化された `apply_patch`、`MCP`。 | モデルウィンドウ制限付近でトリガされるネイティブなローリングコンテキスト圧縮。 |
| **`Claude Code`** | `Bash`、構造化ファイルツール（`Read`、`Write`、`Edit`、`Glob`、`Grep`）、`MCP`。 | 自動的な LLM 主導の会話圧縮（`auto-compact`）およびプロンプトキャッシング。 |
| **`OpenHands`** | コンテナ内で任意の `ACP` または `CodeAct` コーディングエージェントを実行するイベントストリームランタイム。 | 設定可能なコンテキスト凝縮器（`LLM` 要約またはウィンドウマスキング）。 |
| **`ARC-AGI-3` runner** | 標準ハーネス対プロバイダアダプタハーネス（対話型グリッド状態上）。 | アダプタトラックごとに宣言される有界な視覚/グリッド状態軌跡ウィンドウ。 |
| **`OSWorld run.py`** | デスクトップ `GUI` ループが VM スクリーンショット上で `pyautogui` マウス/キーボードアクションを発行する。 | 直近の $K$ 個のスクリーンショットおよびアクションのみを保持するスライド式軌跡ウィンドウ。 |

`Terminal-Bench 2` において、`Gemini 2.5 Pro` は `OpenHands` とペアリングした場合に比べて `Terminus-2` とペアリングした場合に **`17%` 多くのタスク**を解決した（基礎となるモデルチェックポイントを一定に保った場合）。したがって、コンテキスト管理、出力切り詰め、編集リンティング、および再試行ルールは、評価されるシステムの一等級の構成要素であり、中立的な配管ではない。`SATB` はこの交絡を、評価を2つの明示的なレーンに分割し、未解決の質問 `OQ-1` および `OQ-2` を閉じることで解決する：

1. **ラッパーを固定した状態（`Lane B`）と外部ラッパーを評価する場合（`Lane O`）**：`Lane B`（`satb-agent`）はすべてのモデルに対して単一の監査可能な Rust ループを固定する。一方、`Lane O` はサードパーティハーネス（`Claude Code`、`Codex CLI`、`OpenHands`、`Terminus-2`、`Inspect`）をブラックボックス `SUT` としてラップし、その内部プロンプトとコンパクション呼び出しを `harness` の指紋ブロックにハッシュ化し、`satb-proxy` を介して 100% ルーティングする。  
2. **コンテキストポリシー解決（`OQ-1`：`ContextRule_v0`）**：ゼロ省略で試行をハードキルすることは、マルチステップ推論と冗長なツール出力を同一視し、`LLM` 生成要約（`Claude Code` の自動コンパクト）が隠れた確率的モデル呼び出しを注入し、決定的ハーネスのリプレイを破壊する。`Lane B` は **`ContextRule_v0`** を採用する：蓄積された会話サイズが宣言されたコンテキストウィンドウの **`80%`** を超えるたびに、ハーネスは決定的に最も古いツール出力を `"[ELIDED_BY_CONTEXT_RULE_V0]"` に置換し、`system(TEMPLATE_v0)`、初期 `user(render(bundle))`、および **直近の `8` 件のツール出力** をそのまま保持し、**モデル呼び出しをゼロにする**。`hard killed(context_ceiling)` は、保持されたメッセージだけでウィンドウの **`100%`** を超える場合にのみ発火する。  
3. **ツール表面解決（`OQ-2`：`TOOLS_v0`）**：純粋な `exec` のみ（`mini` スタイル）は、モデルに対してマルチラインソースパッチや代数的証明（`cat << 'EOF'`）をシェルエスケープさせ、シェル引用の失敗をタスク推論とは無関係に導入し、`macOS`、`Linux`、`Windows` 間でのポータブルなルートレスサンドボックス化を複雑にする。`Lane B` は **`TOOLS_v0`** を固定し、4 つのワークスペースツール（`exec`、`read_file`、`write_file`、`list_dir`）と 2 つのターミナルツール（`submit`、`refuse`）を提供し、`JCS` によって正規化された `tools_hash`（`d5b102...`）を使用する。

---

<div id="3-reference-harness-lane-b-contextrule_v0-and-satb-io-protocol" class="anchor-alias" aria-hidden="true"></div>

## 3. リファレンスハーネス（`Lane B`）、`ContextRule_v0`、および `SATB-IO` プロトコル

<figure class="my-8">
  <img src="/figures/satb-harness/satb-lane-b-architecture.svg" alt="Satiation Benchmark Lane B コンポーネント分離トポロジーと決定的セッションライフサイクル。" />
  <figcaption>Figure 1. 左: <code>Lane B</code> コンポーネント分離により、ルートレス <code>satb-meter</code>、<code>satb-supervisor</code>、<code>satb-agent</code>、ネットワーク遮断された <code>satb-sandbox</code>、認証情報保持 <code>satb-proxy</code>、および到達不能な外部 <code>Verifier</code> が分離される。右: 決定的 <code>SATB-IO</code> セッションと試行シーケンスである。</figcaption>
</figure>

<div id="31-sequential-execution-loop-and-fixed-versus-configurable-split" class="anchor-alias" aria-hidden="true"></div>

### 3.1 逐次実行ループおよび固定対可変分割

`satb-agent` 内部では、すべての試行が、重複するバックグラウンドツールスレッドも、`best-of-k` 投票も、検証オラクルフィードバックもない、厳密に逐次的な単一エージェントループとして実行される：

```text
msgs <- [system(TEMPLATE_v0), user(render(bundle))]
loop:
  ContextRule_v0(msgs)        # >= 80% window -> elide oldest tool outputs; keep last 8; 0 model calls
  r <- proxy.chat(msgs, TOOLS_v0)   # missing usage -> immediate killed(usage_missing)
  if no tool calls: append CONTINUE_v0; continue
  for call in r.tool_calls (sequential):
    submit | refuse -> attempt.close; ignore trailing calls (C4); STOP
    exec | read_file | write_file | list_dir -> fresh sandboxed process in /work,
      Truncate_v0 (8 KiB head + 8 KiB tail), no network egress (C6)
  envelope ceiling reached -> killed(wall_ceiling | token_ceiling | turn_ceiling | context_ceiling)
```

`Lane B` の各実行では、固定されるベンチマーク定数(`harness_id` にハッシュ化)と、宣言された `SUT` パラメータ(`sut_fingerprint_sha256` にハッシュ化)を区別する。

| 全 `Lane B` 実行で固定されるもの(`harness_id`) | SUT ごとに設定可能なもの(`sut_fingerprint_sha256`) |
| :--- | :--- |
| `TEMPLATE_v0` プロンプト、バンドル描画器、および `CONTINUE_v0` ナッジ | `model_id`、プロバイダのスナップショット日付、またはローカルの `GGUF`/safetensors の `SHA-256` |
| `TOOLS_v0` スキーマ(`tools/list` の `JCS` ダイジェスト)と逐次ディスパッチ | サンプリングパラメータ：`temperature`、`top_p`、`top_k`、`seed`、`max_tokens`、`reasoning_effort` |
| `ContextRule_v0`(`80%` 閾値、直近 `8` 件の保持)および `Truncate_v0`(`8 + 8 KiB`) | 推論エンジン(`llama.cpp`、`MLX`、`vLLM`、クラウド `API`)およびバッチ/キャッシュフラグ |
| 単一試行(`attempts = 1`)、検証器フィードバックゼロ、内部投票ゼロ | エンベロープの上限：`wall_ms`、`max_total_tokens`、`max_turns` |
| `satb-sandbox`：`/work` への閉じ込め、環境変数の除去、ネットワーク送出ゼロ | サンドボックスの `CPU`/`RAM` クォータ、ホストのシリコン、`OS` カーネル、および隔離階層 |

<div id="32-canonical-four-way-outcome-mapping-oq-3" class="anchor-alias" aria-hidden="true"></div>

### 3.2 四値アウトカム写像の正準化（`OQ-3`）

ベンチマークが、クラッシュした実行を黙って除外することや、自発的な誤答とインフラストラクチャのタイムアウトを混同することを防ぐため、`SATB` はレガシーな5状態の完了コードを、`{pass, fail, refuse, killed}`（`PFRK`）へ情報損失なく写像し、各受領記録において正確な `sub_reason` を保持する。

1. **`completed` $\to$ `pass`（`sub_reason: "verified"`、スコア `1`）**: `SUT` が上限時間の満了前に `submit(bytes)` を呼び出し、`attempt.close` の後に外部の `Verifier` が `bytes` を受理した場合である。
2. **`incorrect` $\to$ `fail`（`sub_reason: "incorrect"`、スコア `0`）**: `SUT` が `submit(bytes)` を正常に呼び出したが、外部の `Verifier` が候補を棄却した場合である。
3. **`malformed` $\to$ `fail`（`sub_reason: "malformed_submission"`、スコア `0`）**: `SUT` が解析不能または スキーマに適合しない内容を伴って自発的に `submit(bytes)` を呼び出した場合である。`SUT` が作成した不正な提出は正答率上の失敗であり、インフラストラクチャによる強制終了ではない。
4. **`refused` $\to$ `refuse`（`sub_reason: "policy" | "capability" | "other"`、スコア `0`）**: `SUT` が `refuse(reason)` を明示的に呼び出した場合である。
5. **`no_submission` $\to$ `killed`（`sub_reason: "wall_ceiling" | "token_ceiling" | "turn_ceiling" | "context_ceiling" | "usage_missing" | "exec_timeout_killed" | "process_crash"`、スコア `0`）**: `satb-supervisor` が、いかなる終端ツール呼び出しも到着する前に試行を終了させた場合である。4つのアウトカムはすべて分母 $n$ に残る。

---

<div id="4-adapter-bridge-shapes-d-m-h-i-five-block-sut-fingerprint-and-c1c12-conformance" class="anchor-alias" aria-hidden="true"></div>

## 4. アダプタブリッジ (`Shapes D, M, H, I`)、5ブロック `SUT` フィンガープリント、および `C1-C12` 適合性

<div id="41-four-adapter-shapes-behind-one-supervisor-and-proxy" class="anchor-alias" aria-hidden="true"></div>

### 4.1 単一のスーパーバイザおよびプロキシの背後にある4種類のアダプタ形態

`Lane B` の外部にあるすべてのシステムは、以下の4つのアダプタ形態のいずれかを介して `satb-supervisor` に接続する。

| アダプタ形態 | 対象システム | 実行および隔離の規約 | 再利用される標準 |
| :--- | :--- | :--- | :--- |
| **`Shape D`（`dnull` 対照）** | 凍結済み `DNULLMM1` `mmap` ストア上の決定論的ヌル（`N0` 厳密なモデル非依存型および `N1` 開発時結晶化型） | `TOOLS_v0` および `Verifier` の規則を同一に適用しつつ、`/work` 内で実行される。意思決定時のプロキシモデル呼び出しは **`0` 回** である。 | `POSIX mmap` / Win32 `MapViewOfFile`、`SPEC v0.4` の 64 ビット整数ループ |
| **`Shape M`（モデルエンドポイント）** | ローカルのオープンウェイトサーバおよびクローズドなクラウド `API` | `Chat Completions` または `Messages` 上でツール呼び出しと必須の `usage` を伴い `Lane B` の `satb-agent` を実行し、全トラフィックを `satb-proxy` 経由で 100% 経路指定する。 | OpenAI 互換 `API`（`llama.cpp`、`mlx_lm`、`vLLM`）、`Anthropic`、`Gemini`、`xAI` の変換器 |
| **`Shape H`（箱入りハーネス）** | `Claude Code`、`Codex CLI`、`Gemini CLI`、`OpenHands`、`Terminus-2` | タスクは `/work/task/BUNDLE.md` に記述される。ベース `URL` は `satb-proxy`（`127.0.0.1:<port>`）へ向けられ、実際の `API` キーは `/work` から秘匿される。終了は `MCP` の `submit` または `refuse` による。それ以外の外部通信は一切行わない。 | `Inspect` サンドボックスのブリッジ環境変数、`--strict-mcp-config` の `MCP`、任意の `ACP` |
| **`Shape I`（`Inspect` エージェント）** | 既存の公開ベンチマーク `Inspect` ソルバ | `attempts = 1` の下で `submit` および `refuse` ツールを備えた `SATB` タスクバンドルを包み、モデル呼び出しを `satb-proxy` 経由で経路指定する。 | `UK AISI Inspect` の `Task` および `Solver` インタフェース |

<div id="42-five-block-sut-fingerprint-and-session-validity" class="anchor-alias" aria-hidden="true"></div>

### 4.2 5ブロック `SUT` フィンガープリントとセッション有効性

``attempt.start`` が起動できる前に、アダプタは5ブロックの JSON 構造体を返し、その正規化された `JCS` `SHA-256` ダイジェストが `SUT` を定義する。未知または観測不可能なフィールドは文字列 `"not_available"` としてそのまま記述し、省略または推測してはならない：

| フィンガープリントブロック | 必須フィールド（利用不可の値は文字列 `"not_available"` として記述） |
| :--- | :--- |
| **`model`** | `provider`, `model_id`, `snapshot_date`, `weights_sha256`, `quantisation`, `tokenizer_hash`, `chat_template_hash`, `context_window`, `system_fingerprint` |
| **`serving`** | `engine`, `version`, `commit`, `binary_hash`, `flags_hash` (`cache_prompt`, `slots`, `batch_invariance`, `TP`), `drivers`, `devices` |
| **`sampling`** | `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `stop`, `reasoning_effort`, `tool_choice` |
| **`harness`** | `name`, `version`, `commit`, `binary_hash`, `prompt_hash`, `tools_hash`, `context_policy`, `internal_voting`, `sub_agents`, `config_hash` |
| **`envelope`** | `hardware`, `os_kernel`, `isolation_tier`, `cgroup_limits`, `cpuset`, `network_policy`, `ceilings`, `telemetry_config_hash` |

**セッション無効化と開始/終了カナリー。** 任意のブロックのダイジェストが `session.close` で変更された場合、`MCP` の `tools/list_changed` 通知、推論エンジンの再起動、`NVML` カウンタのリセット、セッション中にエコーされた `model` または `system_fingerprint` が変更された場合、あるいは `OS` / ドライバの更新が行われた場合、セッション内の **すべての** 受領書は **無効 (`void`)** とみなされる。無効とされた受領書は監査可能性のために公開アーカイブに残されるが、ベンチマーク配置からは除外される。クラウドプロバイダーが固定された `model_id` の背後で重みや量子化を変更し、`system_fingerprint` を更新しない可能性があるため、各セッションは `session.open` と `session.close` において決定論的なカナリー段階で評価を区切る。

<div id="43-mandatory-c1c12-adapter-conformance-suite" class="anchor-alias" aria-hidden="true"></div>

### 4.3 必須 `C1-C12` アダプタ適合性スイート

アダプタもハーネスも、12個の適合性チェック（`C1`から`C12`）をすべて通過するまで評価に入らない：

| 検査項目 | 合格要件 |
| :--- | :--- |
| **`C1` バンドル往復** | アダプタが、入力タスクバンドルの `JCS` の `SHA-256` ダイジェストを正確にエコーバックすること。 |
| **`C2` 提出経路** | 外部 `Verifier` が、`satb-proxy` / `MCP` のターミナルキャプチャに記録されたバイト列と完全に同一のバイト列を受信すること。 |
| **`C3` 拒否経路** | 指示された拒否が、`refuse`(`sub_reason = "other"`、`completion_score = 0`)として正しく到着すること。 |
| **`C4` 終端呼び出しの一回性** | 最初の `submit` または `refuse` の後に発行されたツール呼び出しやターミナル呼び出しはすべて無視され、計数されること。 |
| **`C5` オラクル不在** | `Verifier` および `satb-supervisor` のディレクトリ、ソケット、親パス(`..`)が `/work` から到達不能であること。 |
| **`C6` 外向き通信** | モデル通信に到達可能なのは `satb-proxy`(`127.0.0.1:<port>`)のみであり、`/work` のサブプロセスは外部ネットワークアクセスおよび上流 `API` キーを一切持たないこと。 |
| **`C7` usage の存在** | すべてのモデル呼び出しが `usage` を伴うこと(欠落時は `missing -> killed(usage_missing)`)、および proxy のトークン合計が上流エンジンの計数と厳密に一致すること。 |
| **`C8` フィンガープリントの安定性** | 3 回の試行によるドライラン前後で、五ブロック構成の `SUT` フィンガープリントの `SHA-256` が同一であること。 |
| **`C9` ハーネス再生** | 記録された `satb-proxy` の応答を再生した際、バイト単位で同一のトランスクリプトが再現されること(`0` バイトまたは `CRLF` の差分のみ許容。`Lane B` では必須)。 |
| **`C10` 強制終了経路** | `/work` の暴走プロセスツリー(`POSIX` のプロセスグループまたは Win32 Job Object。デタッチされた子プロセスを含む)が `< 2,000 ms` 以内に回収され、`killed` として記録されること。 |
| **`C11` テレメトリのハンドシェイク** | ルートレスの `L3` プロセスカウンタ(`cgroup v2`、`proc_pid_rusage`、または Win32 の `GetProcessTimes` / `QueryProcessCycleTime`)が読み取り可能であり、フェーズマーカーが到着し、単調時計と壁時計の差分が記録されること。 |
| **`C12` 決定性プローブ** | 同一のリクエストを `8` 回実行し、異なる出力の数を `SUT` の経験的性質として記録すること。 |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. 5段階テレメトリ帰属（`L0-L4 × A1-N`）、プラットフォームチャネルマップ、および帰属不能な事項

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="L0からL4までの5段階テレメトリ境界とA1からNまでの帰属ラベルの対応、および7段階のraw-first総和検査パイプラインを示す図。" />
  <figcaption>図2. 左：物理および論理テレメトリレベル<code>L0</code>-<code>L4</code>を帰属ラベル<code>A1</code>-<code>N</code>に対応づけたもの。右：事前・事後のベースラインドリフト上限（<code>Falsifier 6</code>）および<code>Step 7</code>の総和検査を強制する7段階raw-first計数規律。</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 テレメトリ境界（`L0-L4`）と帰属ラベル（`A1-N`）

エネルギーおよび活動センサは、物理的に異なる量を測定する5つの明確な境界に位置しており、これらを合計したり混同したりしてはならない：

| レベル | 物理的/論理的境界 | 代表的なセンサ | チャネルが誠実に帰属できる対象 |
| :--- | :--- | :--- | :--- |
| **`L0` 壁** | 壁面コンセントにおける `AC` | スマートプラグまたは `PDU`（`Shelly` の `apower`、`aenergy`；`Yokogawa` アナライザ） | `PSU` の変換損失、ファン、`DRAM`、`NVMe` を含む機械全体；`~1 s` 周期。 |
| **`L1` プラットフォーム** | ボードの `DC` 入力レール | `Jetson Thor INA238` キャリア；`Mac sys_power`；`RAPL psys` | 電源ブリックまたは `PSU` の下流にある `DC` 側で見た計算機全体。 |
| **`L2` パッケージ/SoC** | `CPU` パッケージ、`GPU`、`SoC` レール | `RAPL pkg`；ルートレスの `macmon IOReport`；`Thor INA3221`；`amdgpu hwmon`；`NVML` の累積エネルギー（`mJ`） | `SoC` 上の `SUT` 全体（`A2`）、またはレールが物理的に排他的である場合は推論エンジン単独（`A1`）。 |
| **`L3` プロセス/cgroup** | 単一の `OS` プロセスツリー | `Linux cgroup v2`（`cpu.stat`、`memory.peak`、`io.stat`）、`perf`；`macOS proc_pid_rusage` の `ri_energy_nj`；Win32 の `GetProcessTimes` と `QueryProcessCycleTime` | リソース活動の比率（`C`）、または `OS` カーネル自身のプロセス別内部エネルギーモデル（`D`）。 |
| **`L4` 論理** | モデルおよびツールとの対話 | `satb-proxy` のトークン数とコール遅延；ハーネスのターン、ツール呼び出し、`ContextRule_v0` による省略 | クラウド `API` を含め、すべての `SUT` について例外なく正確なカウント。 |

レシート内のすべてのエネルギー値は、7つの帰属ラベルのいずれかを持つ：

- **`A1` (排他的物理レール)**: 測定ウィンドウ中に1つのパーティションのみが触れるハードウェアレールセンサ（例：`Jetson Thor INA3221 ch1 VDD_GPU`で、ローカル推論エンジンが`GPU`デバイスアクセスのみを有する場合）。
- **`A2` (専用全システム境界)**: 静止した専用マシン（`SUT`に加えてアイドル`OS`フロア）上の全マシン（`L0`/`L1`）または全パッケージ（`L2`）カウンタである。**`OQ-4`に従い、全`SUT`生ウィンドウエネルギー（`A2`）が配置のための主要物理エネルギーメトリックであり**、薄いモデルが`/work`サブプロセスに計測されないブルートフォース探索をオフロードすることを防ぎ、`active - idle`減算が低速実行を美化することを防ぐ。
- **`B` (時間的フェーズ分割)**: 逐次フェーズマーカ（`Lane B`における`model_call`対`tool_call`）により区切られた非重複時間ウィンドウ間のカウンタ差分。
- **`C` (比例配分、`Kepler`モデル)**: 並列プロセスが重複する場合（`Lane O` `Shape H`）に、`GPU`利用率または$\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$により分割された共有ハードウェアカウンタ。
- **`D` (`OS`モデル化推定値)**: カーネルの内部プロセスごとエネルギーモデル（`macOS ri_energy_nj`）。`CPU`共同テナントからプロセスツリーを分離するが、物理シャント読み取りではなくファームウェア/カーネルモデルである。
- **`P` (プロバイダ証明)**: クラウドプロバイダが逐語的測定方法論とともに返すリクエストごとのサーバエネルギー数。
- **`N` (`not_available`)**: 未観測であり**決して推定されない**。

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 7段階カウンタ規律、無根収集（`OQ-5`）、およびプラットフォームマップ

`satb-meter` は各試行を、順序付けられた七つの段階で処理する。
1. **すべてのイベント境界で累積カウンタを読み取る**（`attempt.start`、各 `model_call` および `tool_call`、`attempt.close`、ならびに `100 ms` の参照ティック）。これにより、ウィンドウ内エネルギーを厳密なカウンタ差分 $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$ として得る。
2. **生のチャネルを先に書き出す**：境界、センサ、開始・終了時の読み取り値、カウンタのラップ、およびサンプル数を記録する。`10` 個のセンサ周期より短いウィンドウは `"below_resolution"` とし、ハードウェアが存在しない場合は `"not_available"` とする。
3. **逐次フェーズ（`B`）への分割**：`Lane B` では、モデル推論と `/work` ツール呼び出しは決して重ならない。並列の `Lane O` ハーネスでは、フェーズ分割を `C` または `N` に落とす。
4. **`engine_resident_during_tools` の分離**：`/work` ツールの実行中、ローカルのモデルサーバ（`llama-server`、`vLLM`）は重みを `GPU`／`DRAM` 上に常駐させている。ツール区間におけるその待機時消費電力は `engine_resident_during_tools` に配置し、モデルの能動的推論にもツール実行にも計上しない。
5. **重なりが生じる場合にのみ比例配分（`C`）で分割する**：$\Delta \text{CPU}$ の比率は、特性評価のための代替手段としてのみ厳密に適用する。ただし、`C` 状態、ターボ `DVFS`、および `DRAM`／ストレージのストールは比例性を破ることを認識しておく。
6. **ベースラインを導出チャネルとして保存する**：セッションの前後に常駐ベースラインを置いて挟む。前後のアイドル電力のドリフトが `5.0%`（`Falsifier 6`）を超える場合は、導出された正味のアイドル超過値を破棄し、生のチャネルはそのまま保持する。
7. **総和検査（`Falsifier 2`）を実行する**：導出されたフェーズ成分の和が、生の試行カウンタ差分に一つのセンサ量子（`1 mJ`）の範囲内で一致することを検証する。一致しない場合は導出された分割を破棄し、生のチャネルのみを保持する。

**ルートレス収集ルール (`OQ-5`).** ベンチマークは決して `SUT` のオーケストレーションを `root` で実行したり、カスタムリング0ドライバをロードしたりしてはならない。`macOS` では `satb-meter` がルートレス `macmon` (`IOReport` サブスクリプション) と `libSystem` の `proc_pid_rusage(RUSAGE_INFO_V6)` を使用し、`sudo` や `powermetrics` は一切用いない。`Linux` (カーネル `5.10` で `/sys/class/powercap/intel-rapl` が `PLATYPUS` に続いて root のみとなった環境) では、一度だけ管理者が設定する `udev` ルールが専用の `satb-meter` グループへ読み取り権限を付与し、そのグループには **`satb-supervisor` の `UID` のみ** が含まれる。これにより `/work` サンドボックスプロセスは `RAPL` をサイドチャネルで利用したり、自身のエネルギーメータを読み取ったりできない。`Windows 11` (`NT 10.0.26300`) では、権限の低い Basic User トークン (`0x20000`) が `nvml.dll` (`nvmlDeviceGetTotalEnergyConsumption`) を介して離散 `GPU` の累積エネルギー (`mJ`) を直接取得し、Win32 の `QueryProcessCycleTime` を用いて `L3` プロセスサイクルを取得する。一方、Intel `RAPL` `MSR` `0x611` はリング0 カーネルドライバを必要とし、`OQ-5` と `HVCI` により禁止されているため、Windows の `CPU` パッケージエネルギーは `"not_available"` として厳格にラベル `N` が付与される。

| 対象プラットフォーム | `L0` / `L1` システム全体チャネル | `L2` パッケージ / `SoC` チャネル | `L3` プロセスおよび `L4` 論理チャネル | 主要な検証状況 |
| :--- | :--- | :--- | :--- | :--- |
| **Apple Silicon Mac**（`M5 Max` で検証） | `L0`: `Shelly` `PDU`（未接続時は `not_available`）; `L1`: `macmon sys_power`（`reported_j`） | `macmon IOReport`: `chip_power`, `cpu_power`, `gpu_power`, `ane_power`, `ram_power`（`reported_j`） | `L3`: `proc_pid_rusage` `ri_energy_nj`（`D`），`ri_instructions`，`ri_diskio_*`; `L4`: `satb-proxy` | `Apple M5 Max` 上で `L1`-`L4` をルートレス権限にて実機検証済み。`L0` のプラグ接続は未完了。 |
| **Framework AMD Strix Halo**（`Ryzen AI Max+ 395`，`Linux x86-64` で検証） | `L0`: `Shelly` `PDU`（未接続時は `not_available`）; `L1`: `cros_ec`（電力属性 `0` 件） | `RAPL package-0` および `core`（`udev` による `0440 root:energy`）`reported_j` ならびに `amdgpu` `PPT` `power1_input`（`0444`；`energy1_input` は存在せず） | `L3`: `cgroup v2` / `getrusage`（`C` 活動シェア）; `L4`: `satb-proxy` | 実機検証済み（`0440 root:energy` による `PLATYPUS` 隔離；`amdgpu PPT` `0444`）。 |
| **Intel Raptor Lake**（`Core i9-13900H`，`Linux x86-64` で検証） | `L0`: `not_available`; `L1`: `RAPL psys`（`intel-rapl:1/energy_uj`，`0444` `reported_j`） | `RAPL package-0`，`core`，および `uncore`（`MSR` および `MMIO` の `energy_uj`，`0444` `reported_j`） | `L3`: `cgroup v2` / `getrusage`（`C` 活動シェア）; `L4`: `satb-proxy` | 実機検証済み（`psys` の `L1` および `package-0` の `L2` にわたり `Step 7` 残差 `0 µJ`）。 |
| **NVIDIA Jetson AGX Thor**（`Linux aarch64` Tegra で検証） | `L1`: `TI INA238`（`hwmon6` `VIN`，`0444` `measured_j`）＋ `INA3221 ch3 VIN_SYS_5V0`（`0444` `measured_j`） | `INA3221 ch1 VDD_GPU`（`0444` `measured_j`，排他実行時は `A1`）; `ch2 VDD_CPU_SOC_MSS`（`0444` `measured_j`）; `NVML`（`unverified`） | `L3`: `cgroup v2` / `getrusage`（`C` 活動シェア）; `L4`: `satb-proxy` | 実機検証済み（`INA238` および `INA3221 ch1-ch3` を `0444` によりルートレスで計測；GPU の `NVML` は共有テナントロック下で未完了）。 |
| **Windows 11 `x86-64` ＋ 外付け `RTX`**（`i7-1165G7` ＋ `RTX 2060`，`NT 26300` で検証） | `L0`: `not_available`; `L1`: `WMI` `EMI` `PowerMeter`（`0` 件 → `not_available`） | `RTX 2060`: ルートレス `nvml.dll` の累積 `mJ`（`reported_j`）; `CPU` `RAPL` `MSR 0x611`: **`N`（リングゼロドライバなしでは `not_available`）** | `L3`: Win32 `GetProcessTimes` ＋ `QueryProcessCycleTime`（`C` シェア；粗粒度の `SRUM` による `OS` バックグラウンドは除外）; `L4`: `satb-proxy` | Basic User `0x20000` トークンの下で実機検証済み（`Step 7` 残差 `0 mJ`；Job Object による `2.46 ms` での強制終了）。 |
| **クローズドクラウド `API`**（`Anthropic`，`xAI`，`Cerebras`，`OpenAI`，`Google`） | ローカルの `L0`-`L1` はクライアントホストのみを計測（サーバ推論からは除外） | リモートサーバの `L2`: 厳密には **`N`（`not_available`）** または要求ごとの **`P`**（`OQ-6`） | ローカルの `/work` における `L3`（`D`/`C`）をサンドボックスツールに適用; `L4`: **厳密な** `satb-proxy` トークン数、呼び出し回数、`USD` | `satb-proxy` を介して `Anthropic`，`Cerebras`，`xAI` にわたり実機検証済み。 |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 ハードウェア計測上の8つの落とし穴と7つの帰属不能な量

標準的な電力測定の近道は、現代の`SoC`および`GPU`において体系的に失敗する：

| ハードウェアテレメトリの落とし穴 | `SATB` 緩和策 |
| :--- | :--- |
| **アイドル電力がダイ温度、ファン、`DVFS`、およびターボとともにドリフトする** | `GPU` 冷却待ち（`<= 1.5 W`）を行い、すべての測定窓を前後ベースラインで挟み、ピーク `GPU` 温度を記録し、5.0% 以上のドリフトが生じた導出正味ジュールは無効化する（`Falsifier 6`）。 |
| **コールドマシンアイドルと重み常駐アイドルの曖昧性** | `Step 6` において両者を明示的に測定・ラベル付けし、一方を暗黙的に減算しない。 |
| **`Active - idle` 減算は低速実行を美化する** | 全体 `SUT` 生窓エネルギー（`A2`）が主要配置指標のままとする（`OQ-4`）。 |
| **サブ期間窓がゼロ、負、または量子化ノイズとして読み取られる** | センサ期間の 10 未満の窓をすべて `"below_resolution"` とマークする（例：`~8 Hz` `macmon` では `< 1.2 s`、`1 Hz` スマートプラグでは `< 10 s`）。 |
| **高レートテレメトリサンプラが大きな `CPU` 電力を消費する** | イベント境界で累積カウンタを読み取り（`0 Hz` で `0.011 mW`）、`100 ms` ティックを加え、`observer_only` ベースラインを記録する。 |
| **`A100`/`H100` 上の `NVML` 瞬時電力ゲージはランタイムの `~25%` のみサンプリングする** | プロセス内 `FFI` 経由で累積 `nvmlDeviceGetTotalEnergyConsumption`（`mJ`）を読み取り（`RTX 2060` で `1.17 ms`、`43.88 ms` の `nvidia-smi` サブプロセスに対し）、瞬時 `nvmlDeviceGetPowerUsage` ポーリングは決して用いない（Chung et al.; Yang et al.）。 |
| **外部 `L0` 壁コンセントは非同期クロックで動作する** | `session.open` および `session.close` で決定論的 `50%` デューティ較正負荷パルスを発し、タイムスタンプを相互相関する。 |
| **共有ホストのバックグラウンドデーモンまたは同時テナントジョブ** | プロセスリストをログし、`Falsifier 6` により共有 `L2` 導出減算を降格させ、同時テナント隔離 `L3` `ri_energy_nj`（`D`）を生 `L2` とともに記録する。 |

その結果、以下の7つの量は誠実に帰属させることができず、`SATB` の主張から除外される。

1. 検証されていないクローズドな`API`サーバーのエネルギー（`N` または `P` のみが得られる場合）
2. 共有`SoC`または統合メモリ電源レール上における、プロセス単位の正確な物理ジュール値（`C` と `D` はモデルによる推定値である）
3. サービング用カーネル、量子化、バッチ処理、シリコンから分離されたモデル重みの寄与
4. `OS`のアイドル床および`DRAM`常駐の重み電力の帰属（独立したチャネルとして報告される）
5. センサー周期より短い個別イベント（`1 s` のプラグ下での `30 ms` のツール呼び出しなど）
6. ユーザーモードのハードウェアカウンタを欠く共有クラウド`VM`、または非特権Windows `CPU`ドメイン
7. セッション途中における無通告のプロバイダ側での重み差し替え（開始時と終了時のカナリアによって検出されるが、事前に排除されるものではない）

特に（`OQ-6`）、プロバイダの持続可能性に関する開示は、リクエスト単位の測定値ではなく機群（フリート）の中央値であり、いかなる場合も `SATB` の受領記録（receipt）には含まれない。これには、Googleの `Gemini Apps` プロンプトにおける `0.24 Wh` の中央値、OpenAIの（方法論が公表されていない）`0.34 Wh` という数値、およびMistralの `400` トークン応答あたり `1.14 gCO2e` が含まれる。

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. 測定による適合性、決定性、観測者効果、およびマルチホスト帰属の結果

設計上の未検証の仮定を、監査可能な証跡によって置き換えるため、完全な `SATB` 適合性スイートおよび反証ハーネス(`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`、総実行時間 `175.69 s`)を実行した。実行環境は `Apple M5 Max` ワークステーション(`arm64`、`128 GB` ユニファイドメモリ、`macOS 27.2.1`、`macmon 0.12.0`)であり、これに加えて `188` ウィンドウの横断的監査、および `Linux` と `Windows 11` にまたがる実機の複数 OS・多種シリコンでの実行を行った。

<div id="61-c1c12-conformance-c9-deterministic-replay-and-c10-process-tree-cleanup" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `C1-C12` 適合性、`C9` 決定論的リプレイ、および `C10` プロセスツリークリーンアップ

すべての **`12 / 12` Rust リファレンス適合性チェック** (`dnull_cli satb-conformance`) およびすべての拡張オペレーティングシステムチェックが合格した：

- **バンドル、ターミナル、隔離、およびフィンガープリントチェック (`C1`-`C8`, `C11`)**: `C1` は正規バンドルダイジェスト `455e941f51f8ffef` をエコーした; `C2` は `satb-proxy` から `Verifier` へバイト完全な `submit` ペイロードを配信した; `C3` は空または指示された拒否を `refuse:other` にマッピングした; `C4` は `submit` 後の末尾ツール呼び出しを無視した (`ignored_trailing_calls = 1`); `C5` は `../`, `/etc/passwd`, および `verifier_oracle/*` のエスケープをブロックした; `C6` は `/work` 内のプロキシ/資格情報環境変数 (`NP=*|HTTP=`) を除去しつつ、リスト外プロキシパスに対して `HTTP 404` を返した; `C7` は使用法欠落応答を即座に `killed(usage_missing)` として中止した; `C8` はドライラン全体でバイト同一の5ブロックフィンガープリント `8b741c27bf364e5d` を保持しつつ、シミュレートされた `system_fingerprint` スワップを `session_void = true` でフラグ付けした; および `C11` はルートレス `RUSAGE_INFO_V6` カウンタの可視性を検証した (`sudo_invoked = false`)。
- **拡張 `C9` マルチターン `ContextRule_v0` + `Truncate_v0` リプレイ**: `14` ターンからなるトレースにおいて、各ターンあたり `24 KiB` の生ファイル読み出しを生成し (`Truncate_v0` により `14` 個の出力が `8,192 B + 8,192 B` に切り詰められる)、`48,000` トークンウィンドウ (`80%` 閾値 = `38,400` トークン) 内で、`ContextRule_v0` は **`5` 個の最古ツール出力を決定論的に省略**し、**余分なモデル呼び出しは `0`** であった。これにより `149,747` バイトの正規トランスクリプト (`SHA-256` `d697ed1476129939...`) が生成され、独立した `/work` リプレイ間で **`0` バイトの差異**を生じた。同一トレースを厳格な `16,000` トークンウィンドウ下で繰り返したところ (`8` 個の保持された `16 KiB` 出力が `100%` を超過)、決定論的に `killed(context_ceiling)` が発火した。
- **拡張 `C10` マルチプロセス `SIGKILL` クリーンアップ (`< 2,000 ms` 仕様上限)**: `5` 回の実験において、`4` プロセスツリー (`sh` 親プロセスに加え、隔離されたプロセスグループ内の `3` 個のデタッチされたバックグラウンド Python スリーパー) を生成したところ、`SIGKILL` の配信およびカーネルによる回収は **`2.073 ms` 平均** (`1.429 ms` 最小、`2.571 ms` 最大、**`2,000 ms` 上限の `778×` 下**) で完了し、生存 `PID` は **`0`** であり、結果は `killed(wall_ceiling)` であった。

<div id="62-live-c12-eight-request-determinism-probes-across-four-model-substrates" class="anchor-alias" aria-hidden="true"></div>

### 6.2 `C12` による8リクエスト反復決定性プローブのライブ検証：4つのモデル基盤

`satb-proxy` を経由して各モデルに同一の代数的合成リクエストを8回ずつ送信した（クラウド呼び出し計32回と `Shape D` によるローカル実行8回）。その結果、全32回の呼び出しにおいて `C7` のトークン数が100%一致（32/32）することを検証するとともに、3種類の異なる決定性の様式を観測した。

| `SUT` / `satb-proxy` 経由のエンドポイント | `temperature = 0` 事前検査 | 記録された `sampling.temperature` | 相異なる生出力数（`/ 8`） | 相異なる代数形式数（`/ 8`） | `system_fingerprint` | 平均レイテンシ |
| :--- | :---: | :--- | :---: | :---: | :--- | ---: |
| **`Shape D`: `dnull N1`**（Rust ローカル） | `Exact i64` | `0 (exact_i64_q1e6)` | **`1 / 8`** | **`1 / 8`** | `0da4df8d9ccbce1e…` | `1,474.0 ms` |
| **`Anthropic claude-opus-5-5`** | **`HTTP 400`** | `not_available`（非推奨） | **`8 / 8`** | **`4 / 8`** | `not_available` | `3,389.1 ms` |
| **`Anthropic claude-sonnet-5-5`** | **`HTTP 400`** | `not_available`（非推奨） | **`8 / 8`** | **`2 / 8`** | `not_available` | `2,914.3 ms` |
| **`Cerebras gpt-oss-120b`** | `HTTP 200` | `0.0 (seed=42)` | **`2 / 8`** | **`2 / 8`** | `fp_fd4dff7eed92aaf38281` | `484.2 ms` |
| **`xAI grok-4.20-0309-non-reasoning`** | `HTTP 200` | `0.0 (seed=42)` | **`8 / 8`** | **`1 / 8`** | `fp_9974b11849` | `942.7 ms` |

1. **`temperature = 0` の提供者による非推奨化**: `claude-opus-5-5` および `claude-sonnet-5-5` は、`"temperature": 0.0` を **`HTTP 400`（`"`temperature` is deprecated for this model."`）** により拒否した。この結果は、利用不能なサンプリング制御を暗黙に0とみなすことなく `"not_available"` に正規化するという `SATB` の規則を経験的に裏付けるものである。同一の呼び出しを8回行ったところ、`claude-opus-5-5`（適応的思考トークン `1,047`）は8種類の異なる生テキストを出力し、その内容は代数的に相違する4種類のビットベクトル恒等式（`(x | y) - (x & y)`、`(x | y) & ~(x & y)`、`(x & ~y) | (~x & y)`、`(x + y) - ((x & y) + (x & y))`）にまたがっていた。
2. **`temperature = 0, seed = 42` 下での残存的な非決定性**: `temperature = 0.0` と `seed = 42` が受理され（`HTTP 200`）、`system_fingerprint` が安定している場合であっても、`Cerebras gpt-oss-120b`（推論トークン `2,976`）は同一の呼び出し8回に対して2種類の出力を生成した。一方、`xAI grok-4.20-0309-non-reasoning` は8回すべてにおいて1つの代数式（`(x | y) & ~(x & y)`）に収束したものの、散文による証明文は8/8の応答すべてにおいて変動した。したがって、**記録された応答に対するハーネスの決定性（`C9`）**と**測定された `SUT` の出力分散（`C12`）**を分離して扱うことが不可欠である。

<div id="63-falsifier-5-observer-effect-benchmark-across-telemetry-cadences-10-s-windows" class="anchor-alias" aria-hidden="true"></div>

### 6.3 偽造器5：テレメトリ・ケイデンス (`10 s` 窓) におけるオブザーバ効果ベンチマーク

結合サンプラ (`Python` + 子 `macmon` `IOReport` パイプ) の `CPU` 時間、`L3` `ri_energy_nj` (`observer_only` `reported_j`)、および全体 `SoC` `L2` `reported_j` を `Apple M5 Max` 上のインターリーブされた `10.0 s` 窓で測定した結果、正確なオブザーバ・オーバヘッドが定量化された：

| サンプリング・ケイデンス | 達成レート | サンプラ `CPU` 時間 / `10 s` | オプザーバ `L3` `reported_j` | オプザーバ電力 (`mW`) | `L2` 窓のシェア | 全体 `SoC` `L2` 窓 (`reported_j`) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`0 Hz` 境界のみ** (`2` `rusage` システムコール) | `0.20 Hz` | **`0.004 ms`** | **`0.000108 J`** | **`0.011 mW`** | **`0.0000%`** | `-` (ゼロ `IOReport` デーモン) |
| **`1 Hz` (`1,000 ms` ティック)** | `0.90 Hz` | `9.323 ms` | `0.194237 J` | `19.371 mW` | `0.0521%` | `372.769 J` (`37.17 W`) |
| **`10 Hz` (`100 ms` `SATB` リファレンス・ティック)** | `8.12 Hz` | `36.434 ms` | `0.666596 J` | **`66.439 mW`** | **`0.1770%`** | `376.603 J` (`37.53 W`) |
| **`100 Hz` (`10 ms` ストレス偽造器)** | `7.44 Hz` | `35.636 ms` | `0.598721 J` | `58.971 mW` | `0.1618%` | `369.926 J` (`36.44 W`) |

この測定から2つのハードウェア的事実が直接浮かび上がる：
1. **無視できる摂動 (`< 0.18%`)**：境界のみの `proc_pid_rusage` 読み出しは `108 µJ` (`0.011 mW`) を消費し、`10 Hz` `IOReport` ポーリング (`66.44 mW`) よりも **`6,040×` 少ない電力**であり、`100 ms` リファレンス・ティックは全体 `SoC` 窓エネルギーのわずか **`0.177%`** に過ぎない (`-i 10` と `-i 1000` の `L2` 窓全体の差は `0.76%` であり、偽造器5をクリアする)。
2. **`IOReport` サブスクリプション・ケイデンスの上限 (`~8 Hz`)**：`macmon 0.12.0` から `-i 10` (`100 Hz`) を要求した場合 **`7.44 Hz`** (`10.15 s` 内で `75.5` サンプル) しか達成できなかった。これは各ルートレス `IOReport` サブスクリプション・サイクルが macOS ユーザ空間で `~120 ms` ブロックするためである。したがって、ステップ2の `10` 周期 `below_resolution` フロアは物理的に `macmon` `L2` 窓上で **`~1.2 s`** に対応し、サブ秒操作は `0 Hz` 境界 `L3` `ri_energy_nj` カウンタまたはバッチ窓に依存せざるを得ない。

<div id="64-falsifier-3--step-7-b-temporal-boundary-vs-c-proportional-kepler-attribution" class="anchor-alias" aria-hidden="true"></div>

### 6.4 偽造器 3 およびステップ 7：`B` 時間的境界対 `C` 比例（`Kepler`）帰属

`Apple M5 Max` 上の `3` 回のレプリケートにおいて、単一の `SUT` が **フェーズ 1**（`2.50 s` ALU 密集型 `SHA-256` ダイジェストバースト：平均 `CPU` 時間 `29.27 ms`、`CPU`-ms あたり `38.63 mJ`）を順次実行した後、**フェーズ 2**（`2.51 s` の `192 MiB` `DRAM` キャッシュミス掃引 + 同期 `fsync` ディスクフラッシュおよび `8 ms` の `I/O` 待機：平均 `CPU` 時間 `15.94 ms`、`CPU`-ms あたり `27.73 mJ`）を、定常なデューティサイクル背景ワーカと並行して実行した：

| 帰属検査（`n = 3` 逐次二相 + 共テナント レプリケート） | フェーズ 1（`Compute` `2.50 s`） | フェーズ 2（`DRAM + fsync I/O` `2.51 s`） | 偽造器 / ステップ-7 判定 |
| :--- | ---: | ---: | :--- |
| **正確な `B` 時間的境界 `L3` 差分（`reported_j`）** | `1.1272 J`（`1,127,172 µJ`） | `0.4433 J`（`443,317 µJ`） | **`ステップ 7` 残差 `<= 1 µJ`（`3/3` 合格）** |
| **`C`（`Kepler` $\Delta\text{CPU}$ 共有率：`64.58%` 対 `35.42%`）を `L3` に適用** | `1.0145 J`（`-10.00%`） | `0.5560 J`（**`+25.21%` 平均誤差**） | `DRAM`/ストールエネルギー/ms $\ne$ `ALU` エネルギー/ms |
| **正確な `B` 時間的 `L2` 全体 `SoC` 窓（`reported_j`）** | `82.246 J` | `90.975 J` | `DRAM`、`NVMe`、およびホスト描画が `I/O` 待機中に持続 |
| **`C`（`Kepler` $\Delta\text{CPU}$ 共有率）を `L2` 窓に適用** | `111.758 J`（**`+35.86%` 誤差**） | `61.464 J`（**`-32.59%` 誤差**） | **`偽造器 3` 発動（`> 20%` 誤差）** |

`ステップ 7` の合計検査は境界カウンタ差分（`B`）の下で `0-1 µJ`（`100.0%` の試行）に保持された一方、`CPU` 時間比例帰属（`C`）は共有 `L2` 上で計算バーストを **`+35.86%`** 過剰帰属し、メモリおよび `fsync` フェーズを **`-32.59%`** 過少帰属した（プロセスごとの `L3` においてさえ **`25.21%`** の誤差を生じた）。これは `SATB` が `C` を重複並列ハーネス（`Shape H`）に制限し、`Falsifier 3` により `> 20%` の逐次乖離をフラグする理由を実証的に確認するものである。

<div id="65-multi-session-falsifier-6-audit-188-windows-and-falsifier-8-harness-floor-check" class="anchor-alias" aria-hidden="true"></div>

### 6.5 マルチセッションにおける `Falsifier 6` 監査（`188` ウィンドウ）と `Falsifier 8` ハーネス下限検証

共有ホスト `Apple M5 Max` 上で、3 つの実験キャンペーンから収集した **`188` 個の実 `L2` `IOReport` ウィンドウ**、ならびに `Claude Code 2.1.330` を用いた 2 組の `Lane B` 対 `Shape H` 評価を監査した結果、セッション単位の 2 つの安全機構が確認された。

1. **`Falsifier 6` ベースラインドリフト監査（`188` ウィンドウ）**: `exp-001` の `11` ウィンドウ（`5.0%` 以内が `1`、最大 `44.5%` までドリフトしたものが `10`）、`exp-002` と multi-turn の `7` ウィンドウ（`5.0%` 以内が `2`。`1,190` インスタンスの `dnull` バッチは `3.09%`、`Qwen 3.6` による `BigCodeBench` は `1.02%` のドリフトにとどまった。残る `5` ウィンドウは、並行実行された `yosys-abc` 合成の影響下で `12.16%-65.11%` ドリフトした）、および `ai-reads-human` の `170` ウィンドウ（`loadavg_1m = 12.92`。`5.0%` 以内が `61`、ドリフトしたものが `109`）を対象とした。その結果、`188` 中 `64` ウィンドウ（`34.04%`）は有効な `derived_marginal_j` を保持し、`124` ウィンドウ（`65.96%`）はアイドル超過分の減算を自動的に無効化された。この過程で、生の `L2` 読み取り値およびプロセス単位 `L3` の `reported_j` 読み取り値は 1 件も失われなかった（`188 / 188 = 100.0%` の生データ保持）。
2. **`Falsifier 8`（`Lane B` 対 `Shape H`、`Claude Code 2.1.330`）**: `/work` の形式的ポリシーバンドルと `SQLite` のポリシーバンドルからなる `24` 組の対応評価において、`Lane B` は `Claude Opus 5.5`（`44` 回のモデル呼び出し、`63,568` 個のプロンプトおよびキャッシュトークン、`\$0.5477`）と `Claude Sonnet 5.5`（`43` 回、`60,284` トークン、`\$0.3413`) の双方で **`24 / 24`（`100.0%`）** を達成した。これは `Shape H`（`Claude Code 2.1.330`: `Opus 5.5` では `89` 回・`218,449` トークン、`Sonnet 5.5` では `83` 回・`196,128` トークン、いずれも **`24 / 24`**）と同等であり、プロンプトおよびキャッシュのトークン量はそれぞれ **`3.44×` と `3.25×`** 削減された。未見の多ファイル Python バグ修正リポジトリ `6` 件（`config-defaults`、`interval-merge`、`pagination`、`precedence`、`rate-window`、`retry-backoff`）においても、`Lane B` は `Shape H`（`Claude Code 2.1.330` + `Opus 5.5`: **`6 / 6`**、`30` 回・`86,744` トークン、トークン量は `1.67×` 多い）と再び同等の成功率を示した。具体的には、`Lane B` の `Opus 5.5` は `28` 回・`52,045` トークン、`Sonnet 5.5` は `31` 回、ローカルの `Qwen 3.6 35B-A3B` は `42` 回・`2,342.05 J` の `L2` を記録した。これにより、`Lane B` が機能を制限された下限ハーネスではないことが確認された。

<div id="66-multi-platform-hardware-attribution-across-five-silicon-and-os-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 5つのシリコンおよびOSアーキタイプにわたるマルチプラットフォームのハードウェア帰属

`SATB` 適合性、`Shape D` の固定小数点決定性、ルートレスな `PLATYPUS` / `HVCI` の権限境界、ならびに物理シャントまたは累積 `NVML` による帰属が `macOS`、`Linux`、`Windows 11` の全体で成立することを検証するため、`run_multi_host_satb.py`（`multi_host_satb_receipts.json`）および `run_windows_suite.py`（`windows_satb_receipts.json`）を実行した。対象は `Apple M5 Max` に加えて、追加の `Linux` および `Windows 11` のハードウェアアーキタイプ4種である。

| ハードウェアアーキタイプと`OS`カーネル | ルートレス センサ境界と証拠クラス | `Shape D` `1M` `DNULLMM1`（`10k`プローブ） | `C9`リプレイと`C10`ツリー強制終了の平均 | 単一読み出し遅延と`100 Hz`達成値 | `Step 7`残差と`Falsifier 3`（`C`対`B`） |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`**（`arm64`、`128 GB`、`macOS 27.2.1`） | `IOReport` `L1`/`L2` + `rusage` `L3`（`reported_j`；`measured_j = None`） | `15027705736`（`388.43 ns` `C++`、`582.57 ns` Rust） | `149,747 B`（差分`0`）· `2.073 ms`（`0`個の`PID`） | 約`120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`**（フェーズ2）（フェーズ1では`+35.86%`） |
| **`NVIDIA Jetson AGX Thor`**（`aarch64`、`122.9 GiB`、`Linux 6.8.12-1021-tegra`） | `TI INA238`（`hwmon6` `VIN` `L1`）+ `INA3221`（`hwmon5` `ch1-ch3` `L2`/`L1`、`0444` **`measured_j`**） | `15027705736`（`984.86 ns` `C -O3`、`2,489.4 ns` Py） | `149,747 B`（差分`0`）· `9.544 ms`（`0`個の`PID`） | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`**（`ch2`）（`VIN`では`-67.02%`） |
| **`Framework AMD Ryzen AI Max+ 395`**（`x86-64`、`122.8 GiB`、`Linux 7.0.0-43`） | `RAPL package-0` および `core`（`0440 root:energy` **`reported_j`**）+ `amdgpu PPT`（`0444`；`measured_j = None`） | `15027705736`（`376.61 ns` `C -O3`、`1,341.7 ns` Py） | `149,747 B`（差分`0`）· `0.868 ms`（`0`個の`PID`） | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`**（`pkg-0`）（`core`では`-63.34%`） |
| **`Intel Core i9-13900H`**（`x86-64`、`14.7 GiB`、`Linux 7.0.0-43`） | `RAPL psys`（`L1`）+ `package-0`、`core`、`uncore`（`L2`、`0444` **`reported_j`**；`measured_j = None`） | `15027705736`（`420.93 ns` `C -O3`、`863.6 ns` Py） | `149,747 B`（差分`0`）· `1.120 ms`（`0`個の`PID`） | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`**（`pkg-0`）（`psys`では`-73.62%`） |
| **`Intel Core i7-1165G7 + RTX 2060`**（`x86-64`、`63.7 GiB`、`Windows 11 26300`） | `nvml.dll` `RTX 2060` 累積`mJ`（`L2` **`reported_j`**）+ Win32 `L3`；`CPU RAPL` = `N`（`measured_j = None`） | `15027705736`（`1,474.22 ns` `MSVC /O2`、`2,885.6 ns` Py） | `149,747 B`（`0` `CRLF`）· `2.458 ms` JobObj（`0`個の`PID`） | `1,174.2 µs` `NVML` · **`64.64 Hz`**（`NT` ティック） | `0 mJ` · **`-89.88%`**（時間）（`RDTSC`では`-77.05%`） |

これらのライブ受領記録から、以下5つのクロスプラットフォームにおけるハードウェアおよびオペレーティングシステムの知見が得られた:

1. **ビット単位で厳密な `Shape D` および `Lane B` リプレイ不変性（`macOS`、`Linux`、`Windows 11`（`arm64`/`aarch64` および `x86-64`）横断）**: 5台の全ホスト（`MSVC 19.44 /O2` でコンパイルされた Win32 `CreateFileMappingA` + `MapViewOfFile` および `Windows 11`（`NT 10.0.26300`）上の `NTFS` ファイル I/O を含む）は、厳密に同一の `10,000` プローブ `DNULLMM1` チェックサム **`15027705736`**、厳密に同一の `test.setpoint` 凍結ダイジェスト `0da4df8d9ccbce1e...4485781`、および厳密に同一の `149,747` バイト `C9` トランスクリプト（`SHA-256` `d697ed1476129939...`、**`0`** 個の `NTFS` `CRLF` バイトドリフト）を生成した。同時に、カーネルプリミティブ（`macOS`/`Linux` では `SIGKILL`、`Windows 11` では Win32 `TerminateJobObject`）により `4` 個の PID 暴走プロセスツリーを `0.868 ms` から `9.544 ms` で刈り取り、`Windows 11` では **`2.458 ms` 平均**（`taskkill.exe /F /T /PID` の `122.817 ms` 平均より **`50.0×` 高速**、仕様上限 `2,000 ms` の `> 200×` 以内）であった。

2. **物理 `INA238` / `INA3221` シャント分離およびライブ `GPU` 同時占有下での `Falsifier 6`（`NVIDIA Jetson AGX Thor` 上）**: `Linux 6.8.12-1021-tegra` 上で、`hwmon6`（`ti,ina238` at `i2c@c600000/ina238@44`、`VIN` 全体ボード `DC` 入力 `~27.97 V`）および `hwmon5` の全 3 チャネル（`ina3221@40`: `ch1 VDD_GPU`、`ch2 VDD_CPU_SOC_MSS`、`ch3 VIN_SYS_5V0`）は `sudo` なしでワールドリーダブル（`0444`）である。厳密に `CPU` のみによるプローブ（`dedicated_host = false`）の間、独立した同時占有プロセス `llama-server` がホスト `GPU` ロックを保持していた：

| `Jetson AGX Thor` 物理シャントチャネル（`0444` rootless `sysfs`） | 境界 | 事前ベースライン（`W`） | フェーズ 1 計算（`measured_j` / `W`） | フェーズ 2 `DRAM+fsync`（`measured_j` / `W`） | 事後ベースライン（`W`） | ドリフト（`F6`）および `Kepler` `C` フェーズ 2 誤差 |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`**（モジュール + キャリア入力） | **`L1`** | `100.70 W` | `122.12 J`（`101.66 W`） | `99.02 J`（`81.94 W`） | `97.21 W` | `3.47%`（`A2` 保留：同時占有）・**-67.02%** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`**（同時占有 `LLM`） | **`L2`** | `29.26 W` | `40.29 J`（`33.54 W`） | `26.00 J`（`21.52 W`） | `28.13 W` | 外部 `GPU` 同時占有（`F5` での `-36.1%` 振幅） |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36.68 W` | `45.73 J`（`38.07 W`） | `44.37 J`（`36.71 W`） | `36.08 W` | `1.64%`（`CPU`/`SoC`/`MSS` ドメイン）・**-70.01%** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`**（`5.08 V` レール） | **`L1`** | `14.89 W` | `18.66 J`（`15.53 W`） | `16.82 J`（`13.92 W`） | `13.98 W` | **`6.13% > 5.0%`（`F6` トリガ）**・**-68.85%** |

4つの`Falsifier 5`ケイデンスウィンドウ全体にわたって、変動する共同テナント`LLM`要求は`ch1 VDD_GPU`を`35.36 J`から`22.60 J`（`-36.1%`）へシフトさせ、全体ボードの`INA238 VIN`（`L1`）を`107.48 J`から`81.73 J`（`-24.0%`）へ引き下げたが、`ch2 VDD_CPU_SOC_MSS`は`35.76-39.31 J`の範囲内に留まったままであった。`dedicated_host = false`（および`ch3 VIN_SYS_5V0`が`6.13%`で`5.0%`ドリフトを超過した）ため、`SATB`は`A2`全体`SUT`ネット配置主張を保留する一方で、レール分離された正確な`measured_j`（`L1`および`L2`チャネルは決して合計されない）を保持する。

3. **`PLATYPUS` `0440 root:energy`分離および`Strix Halo` `APU`ドメイン検証（`Framework` `AMD`上）**: `Framework` Desktop（`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`、`Linux 7.0.0-43-generic`）において、`udev`ルール`90-energy-read.rules`は`/sys/class/powercap/intel-rapl:0/energy_uj`（`package-0`）および`intel-rapl:0:0/energy_uj`（`core`）をモード **`0440`（`root:energy`、`world_readable = false`）** に設定する: グループ化されていない`/work`サンドボックス`UID`は`EACCES`を受け取り（`PLATYPUS`サイドチャネルをブロック）、一方でスーパーバイザ`GID`（`energy`）は累積マイクロジュールをルートレスに`24.34 µs`中央値レイテンシ（`0 µJ` `Step 7`残差）で読み取る。`hwmon9`（`amdgpu`）をさらに検査した結果、未解決の仕様詳細が明らかになった: `Strix Halo`の統合`Radeon 8060S`は世界読み取り可能（`0444`）な`PPT`電力（`power1_input` / `power1_average`、`µW`単位、`75.38 W` Phase 1 / `69.72 W` Phase 2）を公開するが、別個の`energy1_input`カウンタではなく、`cros_ec`（`hwmon8`）はファンおよびボード温度のみを公開する。

4. **ベアメタル`Windows 11`ルートレス境界（`0x20000` Basic User `NVML`対ring-0 `RAPL`ブロック）および`15.625 ms` `NT`クロックティックエイリアシング**: 明示的に降格されたBasic Userトークン（`runas.exe /trustlevel:0x20000`、`IsUserAnAdmin() == false`）下の`Windows 11 Pro`（`NT 10.0.26300`、`Intel Core i7-1165G7` + `NVIDIA GeForce RTX 2060`）において、プロセス内`FFI`呼び出しによる`nvml.dll` `nvmlDeviceGetTotalEnergyConsumption`（`mJ`）および`nvmlDeviceGetPowerUsage`（`mW`）はルートレスに **`1,174.15 µs`中央値** で成功し（`nvidia-smi.exe`を呼び出す場合の`43.88 ms`呼び出しあたりより**`37.4×`高速**）、`Step 7`を **`0 mJ`残差** でクリアした（`8.769 J + 8.816 J = 17.585 J`、`3.0%`前後ドリフト）。対照的に、Intel `RAPL` `MSR 0x611`の非特権ユーザモード読み取りは署名付きring-0ドライバなしでは`Windows NT`カーネルによりブロックされ（`OQ-5`および`HVCI`により禁止）、`WMI` `EMI`（`\\.\EnergyMeter` / `Win32_PerfRawData_Counters_PowerMeter`）は`0`インスタンスを公開するため、Windows `CPU`パッケージ`L2`を厳密に`Label N`（`"not_available"`）に置く。さらに、未調整の`Windows NT`が`~15.625 ms`クロック割り込みで`GetProcessTimes`を更新するため、Phase 2の`8 ms`スリーププラス`FlushFileBuffers`バーストは`62.5 ms`へエイリアスされ（`5.06%` `CPU`シェア対Phase 1の`1,171.9 ms`）、`Kepler` `C`帰属を**-89.88%** 誤差とする（サブティック`RDTSC` `QueryProcessCycleTime`サイクルを`11.48%`シェアで使用した場合でも`-77.05%`）。

5. **全5プラットフォームにおけるセンサバスおよび `OS` タイマー周期の物理特性**: Linux `x86-64` の `powercap` `sysfs` 読み出しは `24.34-45.37 µs` で完了し(`100 Hz` 設定で `94.28-97.12 Hz` を達成)、一方で `Windows NT` の既定の `15.625 ms` スリープ量子は、無調整の `10 ms` `NVML` ループを **`64.64 Hz`** に制限する。`SATB` の `100 ms` (`10 Hz`) 参照周期では **`9.45 Hz`** を安定して提供する。これは `Jetson AGX Thor` の `66.55 Hz` の `I2C` シャント上限(`100 ms` 参照で `9.49 Hz`)と一致し、`macmon` の `7.44 Hz` の `IOReport` 上限とは対照的である。**`5 / 5` のシリコンおよび `OS` アーキテクチャ全体**にわたり、`CPU` 比例配分(`C`)は `192 MiB` の `DRAM` およびディスク同期フェーズを **`32.59%` から `89.88%`** 過小評価していた。このことは、`SATB` が `C` を重複する並列実行に限定する理由が普遍的に成立することを裏付ける。

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. オープンハードウェアによる検証と限界

| セッション反証条件 | トリガー時の帰結 | 本研究における実証的状態 |
| :--- | :--- | :--- |
| **`F1` リプレイ不一致（`C9`）** | リファレンスハーネスが非決定的である | **`5/5` ホストで反証不成立（`149,747 B`、`14` ターンにわたり `0` バイト/`CRLF` 差分）** |
| **`F2` 試行の `> 5%` で総和検査が失敗** | ホスト上で帰属分割が破綻する | **`5/5` ホストで反証不成立（Linux では `0 µJ`、Win11 `NVML` では `0 mJ`、`M5 Max` では `<= 1 µJ`）** |
| **`F3` `B` と `C` が逐次的に `> 20%` 乖離する** | `C`（`Kepler`）をホスト上で信頼性なしと判定 | **`5/5` ホストで発火（誤差 `32.59%-89.88%`）; `C` は利用制限** |
| **`F4` 既知のパルス負荷がセンサ精度の範囲外** | セッション中センサを格下げ | **未決（`L0` スマートプラグ同期パルス装置は未接続）** |
| **`F5` `10 ms` 対 `1 s` のティックがウィンドウエネルギーを変化させる** | テレメトリの観測者効果 | **反証不成立（`M5 Max` の `L2` 差分 `0.76%`; `100 ms` 基準で `9.45-10.48 Hz` を達成）** |
| **`F6` 常駐ベースラインの前後変動が `> 5.0%`** | 導出された正味チャネルが無効化される | **発火中（`M5 Max` の `124/188` ウィンドウ、および Linux 同居ワークロードによる変動は明確にゲートされた）** |
| **`F7` アダプタは `C1`-`C12` を通過するがカナリアに失敗** | 適合性検査では不十分; セッションは `void`（無効） | **シミュレーションで検証済み（入替時に `session_void = true`）** |
| **`F8` `Lane B` が強力な `Lane O` ハーネスを下回る** | `Lane B` は厳密に下限として報告 | **反証不成立（`Claude Code 2.1.330` に対し `24/24` および `6/6` で同等）** |

未解決のハードウェアおよびアダプタ項目が3件残存する（`OQ-5`）:
1. **静穏化された専用 `A2` セッションおよび `L0` `AC` コンセントプラグ校正**: 物理的な `TI INA238`（`L1`）および `INA3221`（`L2`/`L1`）のシャント `measured_j` レールは、`NVIDIA Jetson AGX Thor` 上で稼働検証済みであり、`Apple M5 Max`、`Framework AMD Strix Halo`、`Intel Raptor Lake`、`Windows 11`（`RTX 2060` `NVML`）上の rootless `reported_j` カウンタと併用されている。しかし、5台すべてのベンチマーク機が共有サービスまたは同居ワークロードを実行しており（`dedicated_host = false`）、`A2` の SUT 全体配置に関する主張は保留されている。次段階は、静穏化された専用ホスト上で同期パルス付き `L0` `AC` メータ（`Shelly` / `Yokogawa`）を接続することである。
2. **`Jetson AGX Thor` 上の統合型 `GPU` に対する `NVML` カウンタ検査**: 離散型 `GPU` については `nvmlDeviceGetTotalEnergyConsumption`（`mJ`）が `Windows 11` 上の `NVIDIA GeForce RTX 2060` において `nvml.dll` 経由で rootless に検証済みである。一方、`Jetson AGX Thor` の統合型 Tegra `GPU` に対する `NVML` 累積エネルギーの探索は、検証済みの `0444` `INA3221 ch1 VDD_GPU` シャントと併せて、共有 `GPU` ロックが解放された際のアイドル時間帯を待機している。
3. **`Shape H` および `Shape I` のライブ構成の拡充**: 本研究における外部ハーネスのライブ実行では、`Lane B` および `Shape D` とともに `Claude Code 2.1.330` 上で `Shape H` を検証した。次段階は、`Codex CLI`、`OpenHands`、`Terminus-2`、および `Shape I` の `Inspect` ソルバに対してライブの `C1-C12` 適合認定を実行することである。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

<ol data-refs>
<li>Anthropic (2026). Claude Code sandboxing and MCP configuration documentation. <a href="https://docs.anthropic.com/en/docs/claude-code/security">https://docs.anthropic.com/en/docs/claude-code/security</a></li>
<li>ARC Prize Foundation (2026). ARC-AGI-3 interactive benchmarking and adapter harness specification. <a href="https://github.com/arcprize/">https://github.com/arcprize/</a></li>
<li>Chung, J.-W., Gu, Y., Jang, I., Meng, L., Bansal, N., &amp; Chowdhury, M. (2024). Zeus / ML.ENERGY: Understanding and optimizing GPU energy consumption of DNN training and inference. <em>NSDI 2023 / ML.ENERGY</em>. <a href="https://ml.energy/">https://ml.energy/</a></li>
<li>Cloud Native Computing Foundation (2025). Kepler (Kubernetes-based Efficient Power Level Exporter): Proportional CPU/GPU power attribution model. <a href="https://github.com/sustainable-computing-io/kepler">https://github.com/sustainable-computing-io/kepler</a></li>
<li>gerganov, g., &amp; contributors (2026). <code>llama.cpp</code> HTTP server and prompt-cache determinism documentation. <a href="https://github.com/ggml-org/llama.cpp">https://github.com/ggml-org/llama.cpp</a></li>
<li>Kwon, W., Li, Z., Zhuang, S., Sheng, Y., Zheng, L., Yu, C. H., et al. (2023/2026). Efficient memory management for large language model serving with PagedAttention and vLLM batch invariance notes. <em>SOSP 2023 / vLLM Docs</em>. <a href="https://docs.vllm.ai/">https://docs.vllm.ai/</a></li>
<li>Lipp, M., Kogler, A., Oswald, D., Schwarz, M., Easdon, C., Canella, C., &amp; Gruss, D. (2021). PLATYPUS: Software-based power side-channel attacks on x86. <em>IEEE Symposium on Security and Privacy (SP)</em>, 355-371. <a href="https://platypusattack.com/">https://platypusattack.com/</a></li>
<li>Luccioni, A. S., Jernite, Y., &amp; Strubell, E. (2024/2026). Power hungry processing and comparative disclosures of commercial AI energy figures. <em>FAccT / Hugging Face Blog</em>. <a href="https://huggingface.co/blog">https://huggingface.co/blog</a></li>
<li>Model Context Protocol (2025). MCP specification: Tools (`tools/list`, `tools/call`, and `tools/list_changed`). <a href="https://modelcontextprotocol.io/specification">https://modelcontextprotocol.io/specification</a></li>
<li>NVIDIA Corporation (2025/2026). Jetson Thor series power management, INA238 carrier, and INA3221 rail monitoring guide. <a href="https://docs.nvidia.com/jetson/">https://docs.nvidia.com/jetson/</a></li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; Deterministic Null [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>OpenAI (2025/2026). Codex CLI Linux Landlock/seccomp and macOS Seatbelt sandboxing architecture. <a href="https://github.com/openai/codex">https://github.com/openai/codex</a></li>
<li>Rundgren, A., Jordan, B., &amp; Erdtman, S. (2020). JSON Canonicalization Scheme (JCS). <em>IETF RFC 8785</em>. <a href="https://www.rfc-editor.org/rfc/rfc8785">https://www.rfc-editor.org/rfc/rfc8785</a></li>
<li>Terminal-Bench Team (2025/2026). Terminal-Bench 2 and Terminus-2 (Harbor) terminal agent evaluation benchmark. <em>arXiv / GitHub</em>. <a href="https://github.com/laude-institute/terminal-bench">https://github.com/laude-institute/terminal-bench</a></li>
<li>UK AI Safety Institute (2025/2026). Inspect Evals: ReAct solver (`react()`) and Inspect Agent Bridge documentation. <a href="https://inspect.aisi.org.uk/">https://inspect.aisi.org.uk/</a></li>
<li>vladkens (2025/2026). <code>macmon</code>: Sudoless Apple Silicon power and performance monitoring CLI over <code>IOReport</code>. <a href="https://github.com/vladkens/macmon">https://github.com/vladkens/macmon</a></li>
<li>Wang, X., Li, B., Song, Y., Xu, F. F., Tang, X., Zhuge, M., et al. (2025). OpenHands: An open platform for AI software developers as generalist agents. <em>ICLR 2025</em>.</li>
<li>Xie, T., Zhang, D., Chen, J., Li, X., Zhao, S., Cao, R., et al. (2024). OSWorld: Benchmarking multimodal agents for open-ended tasks in real computer environments. <em>NeurIPS 2024</em>.</li>
<li>Yang, J., Jimenez, C. E., Wettig, A., Lieret, K., Yao, S., Narasimhan, K., &amp; Press, O. (2024/2025). SWE-agent: Agent-computer interfaces enable automated software engineering, and <code>mini-swe-agent</code> reference implementation. <em>NeurIPS 2024 / GitHub</em>. <a href="https://github.com/SWE-agent/mini-swe-agent">https://github.com/SWE-agent/mini-swe-agent</a></li>
<li>Yang, Z., Adamek, K., &amp; Armour, W. (2024). Accurate and convenient energy measurements for GPUs: Detailed study of <code>nvidia-smi</code> part-time power sampling. <em>arXiv:2312.12741</em>.</li>
</ol>
