---
title: "決定論的ヌル：ニューラルおよびエージェント型基盤のための事前登録対照実験"
deck: "Rust、Go、Python、C++20、Julia にわたり実装されたモデル呼び出しゼロの 64 ビット整数事例ループ（Shape D：厳格な N0 および dev 結晶化された N1）を、League of Entropy の drand 乱数ラウンドに先立ち OpenTimestamps Bitcoin Calendar 証明の下でロックし、4,030 件の保留インスタンスと 6 個の複数ファイルリポジトリにわたってフロンティア・クラウド言語モデルおよびローカル公開重み言語モデルと比較する。オンチップの Apple Silicon IOReport およびカーネル rusage カウンタは reported_j として記録され、外部の壁コンセントや電源レールのジュール計測器は接続されていない（board_metered は false、measured_j は未設定）。"
lang: "ja"
source: "deterministic-null"
complete: true
---

<div id="deterministic-null-a-pre-registered-control-experiment-for-neural-and-agentic-substrates" class="anchor-alias" aria-hidden="true"></div>

*リビジョン 7eb0ad5、2026年11月22日。データおよびダイジェスト要約：[/data/#deterministic-null](/data/#deterministic-null)。インタラクティブな動的図表：[/living/deterministic-null/](/living/deterministic-null/)。LaTeX アーカイブ対版：[/pdfs/latex/deterministic-null.pdf](/pdfs/latex/deterministic-null.pdf)（[ソース](/pdfs/latex/deterministic-null.tex)）。*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概要

エージェント型人工知能の実証評価は、日常的にある確率的言語モデルを別の確率的言語モデルと比較する一方で、タスク完了のうちどれだけが意思決定時におけるニューラル基盤を本当に必要とし、どれだけが検証済み先行事例の明示的ストア上の固定整数手続きで達成できるのかを未測定のままにしている。本研究は、その欠落していた対照群である **決定論的ヌル（Deterministic Null、`Shape D`）** を構築・凍結・監査し、暗号学的に事前登録された 2 つの確証実験（ビーコン後の保留インスタンス計 `4,030` 件）および複数ターンのリポジトリ不具合修復研究（複数ファイル構成の Python リポジトリ `6` 個）にわたり、マージン $\delta = 0.05$（`5.0` パーセントポイント）においてクラス別の帰無仮説 $H_{0,k}: \Delta_k = p_{\text{model},k} - p_{\text{null},k} \le \delta$ を検定する。ローカルの Apple M5 Max エネルギーカウンタ（`IOReport` および `proc_pid_rusage`）はオペレーティングシステム／オンチップの `reported_j` 値として記録され、クローズドモデルのリモートサーバーエネルギーは厳格に `not_available` として記録される。物理的なハードウェア電源レールや壁コンセントの電力計は接続されていない（`board_metered = false`、`measured_j = None`）。

**平易な言葉で**

1. ほとんどのエージェントベンチマークはモデル A とモデル B を比較するだけで、検証済みの過去事例に対するモデル呼び出しゼロの検索ループがすでにどれだけの問題を解けるかを問わない。
2. 有界な代数、形式証明、および構造化トランザクションの族から抽出された `2,840` 件のインスタンス（`exp-001`、Track-A）において、凍結された整数事例テーブル（意思決定時のモデル呼び出し `0` 回）は `10` 個の「クラス × ティア」セルのうち `9` 個でフロンティア・クラウドモデルと同等の性能を示し、索引化されていない `12` 種類の自由記述の顧客慣用表現においてのみ後れを取った（`Claude Opus 5.5` が `+36.40` パーセントポイント優位）。
3. 外部の著者によって作成された公開ベンチマークから抽出された `1,190` 件の固有インスタンス（`exp-002`、Track-B：Berkeley Function-Calling Leaderboard `v3`、Sierra `tau-bench` Retail、`BigCodeBench v0.1.3`、および `SWE`（ソフトウェア工学）-bench Verified）と未見の複数ファイルリポジトリ `6` 個においては、未見キー質量が高く保たれる領域すべてでニューラル合成が `+52.80` から `+95.00` パーセントポイントの利得をもたらす。しかし、固有の相転移領域 `3-satisfiability`（3-充足可能性）論理式においては、単一ターンの言語モデルはほぼ完全に崩壊し（`0.0%-5.2%`）、有界整数テーブル（`69.6%`）と節証明検査を備えた単独の競合駆動節学習ソルバー（`100.0%`）の双方を下回る。さらに、反復的に到来する Zipf 分布ストリームの下では、オンライン結晶化がタスク完了率を損なうことなくモデル呼び出し回数とエネルギー消費をともに `3.59×` 削減する。

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. 用語、頭字語、および測定ラベル

<ul id="terms">
<li>AI, ML, LLM, LLMs, MoE, E4B, A3B: 人工知能、機械学習、大規模言語モデル（単数・複数）、Mixture-of-Experts（混合エキスパート）、実効 40 億パラメータ構造、および活性 30 億パラメータルーティング</li>
<li>OBSERVE, REDUCE, FUZZ, LOOKUP, ACT, VERIFY, MUTATE, WRITE: 決定論的ヌル（Deterministic Null）整数意思決定ループの 8 つの逐次ステップ（観測、簡約、ファジング、検索、行動、検証、変異、書込）</li>
<li>SATB, SUT, SUTs, PFRK, TH2, DOSSIER: 飽和ベンチマーク（Satiation Benchmark）ハーネス契約、被試験システム（単数・複数）、4 区分の試行結果（合格 pass、不合格 fail、拒否 refuse、強制終了 killed）、レッドチーム脅威 2（行動プリミティブ内部への隠れたソルバー埋め込み禁止）、およびプロジェクトの先行技術・レッドチーム監査文書</li>
<li>DNULLMM1, FT, LCB: バイナリ・メモリマップド・ストア索引形式、クラス別関数テーブル、および Hoeffding 下側信頼限界</li>
<li>DRAT, RUP, CDCL, CNF, SAT, UNSAT: 削除解決非対称恒真式、逆単位伝播、競合駆動節学習、連言標準形、充足可能、および充足不能</li>
<li>BV, AST, XOR, IEEE, UC: 固定幅モジュラビットベクタ、抽象構文木、ビット単位排他的論理和、米国電気電子学会（IEEE-754 浮動小数点規格）、およびカリフォルニア大学</li>
<li>BFCL, BCB, SWE, SQL, DB, SAVEPOINT: Berkeley 関数呼び出しリーダーボード、BigCodeBench、ソフトウェア工学ベンチマーク接頭辞、構造化問い合わせ言語、リレーショナルデータベース、およびトランザクションロールバック保存点</li>
<li>API, CLI, MCP, HTTP, JSON, JSONL, UTF: アプリケーションプログラミングインターフェース、コマンドラインインターフェース、Model Context Protocol、ハイパーテキスト転送プロトコル、JavaScript Object Notation、行区切り JSON、および Unicode 変換形式</li>
<li>POSIX, MMAP, SHA, OTS: 可搬オペレーティングシステムインターフェース、メモリマップドファイル I/O、セキュアハッシュアルゴリズム（SHA-256）、および OpenTimestamps Bitcoin Calendar 証明</li>
<li>BCa, CI, CIs, UCL: バイアス補正・加速ブートストラップ、信頼区間（単数・複数）、および Wilson 上側信頼限界</li>
<li>CPU, GPU, ANE, SoC, PID, OS, RAM, DRAM, NVMe, PSU, AC: 中央演算処理装置、グラフィックス処理装置、Apple Neural Engine、システムオンチップ、プロセス識別子、オペレーティングシステム、ランダムアクセスメモリ、ダイナミック RAM、Non-Volatile Memory Express、電源ユニット、および交流壁コンセント電源</li>
<li>RAPL, NVML, KV, GGUF, RPM, RPD, USD, EDA: Intel Running Average Power Limit、NVIDIA Management Library、キー・バリューキャッシュ、GPT-Generated Unified Format 量子化重み、毎分リクエスト数、日次リクエスト数、米ドル、および電子設計自動化</li>
<li>RCE, MoL, WCA, JEPA, LUT6: Reality Code Engine [同一機関]、Mixture of Limits（限界の混合）[同一機関]、Wise Computer Automation [同一機関]、Joint-Embedding Predictive Architecture（共同埋め込み予測アーキテクチャ）、および 6 入力ブールルックアップテーブル</li>
</ul>

テレメトリレベル L0 から L4 にわたり、本研究のすべての表および図では以下の 4 つの測定クラスを厳格に区別して扱う。

| 測定ラベル | 本研究における意味 |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`**（厳密値：L4 論理・暗号レベル） | ビット単位で同一の 64 ビット固定小数点ストアダイジェスト（`SHA-256`）、OpenTimestamps `.ots` カレンダー証明、League of Entropy `drand` ビーコンラウンド、`satb-proxy` が捕捉したトークン数および呼び出し回数、ならびに日付つきの API 定価米ドル金額（`USD`）。 |
| **`Reported (reported_j: L2 & L3 Counters)`**（報告値：L2・L3 カウンタ） | root 権限不要の Apple Silicon オンチップ `IOReport` 時間窓ジュール値（`macmon`、テレメトリレベル `L2`、共有ホストラベル `A2`）および macOS カーネルの PID 別 `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj`（`L3`、ラベル `D`）。物理的なハードウェア電源レール計測器ではない（`measured_j = None`、`board_metered = false`）。 |
| **`Not Available (label N)`**（取得不能：ラベル N） | クローズド API のリモートサーバーエネルギー（`Claude Opus 5.5`、`Claude Sonnet 5.5`、`Gemini 2.5 Flash`）および `L0` 交流壁コンセントエネルギー。フリート中央値や文献上の乗数をレシートへ代入することは決して行わない。 |
| **`Invalidated Derived (Falsifier 6)`**（無効化された派生値：反証条件 6） | 共有ホスト上の共存テナントプロセスによりテレメトリレベル L0 から L4 にわたって実行前後のアイドルベースラインに `> 5.0%` のドリフトが生じた場合、アイドル差し引き純増エネルギー（`derived_marginal_j`）を自動的に破棄し、生の `reported_j` カウンタ値のみをそのまま保持する。 |

<div id="11-lineage-prior-art-boundaries-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 系譜、先行技術との境界、および同一機関開示

意思決定ループ自体についての新規性は一切主張しない。事例ベースの「検索-再利用-改訂-保持」サイクルは Stanfill と Waltz（1986）および Aamodt と Plaza（1994）に遡り、表形式の倒立振子制御は Michie と Chambers（1968）に、ファジィ規則表は Mamdani と Assilian（1975）および Wang と Mendel（1992）に、`RUP/DRAT` による充足可能性証明ロギングは Goldberg と Novikov（2003）および Wetzler、Heule、Hunt（2014）にそれぞれ遡る。Open Interface Engineering の先行研究である [計量コミットゲート](/papers/gates/)、[AI需要におけるタスク飽和と総量リバウンド](/papers/satiation/)、[Reality Code Engine](/papers/rce/)、および [下方 LUT6 コンパイル](/papers/lut-adapt/) は、アーキテクチャ上の文脈を示すために引用される同一機関（`[same house]`）の姉妹研究であり、独立した確証として扱われることは決してない。

69 件の先行技術監査と 36 項目のレッドチーム検証（`docs/DOSSIER.md`）により、2024-2026 年のエージェント評価文献における 1 つの明確な空白が特定された。すなわち、既存のエージェントベンチマークは圧倒的多数が非ニューラル対照群を欠き、既存の非ニューラルベースラインは事前登録された保留ストア凍結を持たず、言語モデルエージェントに関する既存のエネルギー研究は同一ホスト上のモデル呼び出しゼロ対照群を含んでいない。

<figure class="my-8">
  <img src="/figures/deterministic-null/dnull-control-protocol.svg" alt="決定論的ヌル（Deterministic Null）の4段階ビーコン前ロックおよび対評価プロトコル。" />
  <figcaption>図 1. <code>Shape D</code>（<code>N0</code>、<code>N1</code>）とニューラル基盤（<code>B3</code>、<code>B6</code>、<code>Shape H</code>）にわたるビーコン前登録（<code>Gate G1</code> + OpenTimestamps + <code>drand</code>）および対評価プロトコル。プロトコル図であり、ハードウェア電源レールの実測値ではない。</figcaption>
</figure>

---

<div id="2-machine-specification-arms-and-five-language-conformance" class="anchor-alias" aria-hidden="true"></div>

## 2. 機械仕様、比較群、および 5 言語適合性

<div id="21-the-eight-step-integer-loop-and-complexity-caps" class="anchor-alias" aria-hidden="true"></div>

### 2.1 8 ステップ整数ループと計算量上限

すべての `Shape D` ヌル比較群は、8 ステップの 64 ビット符号付き整数ループ（`Q = 1,000,000` 固定小数点スケーリング、IEEE-754 浮動小数点命令ゼロ、意思決定時のニューラル呼び出しゼロ）を実行する。

$$\texttt{OBSERVE} \;\to\; \texttt{REDUCE} \;\to\; \texttt{FUZZ} \;\to\; \texttt{LOOKUP} \;\to\; \texttt{ACT} \;\to\; \texttt{VERIFY} \;\to\; \texttt{MUTATE} \;\to\; \texttt{WRITE}.$$

`dev` 構築段階では、`WRITE` が検証済みレコード（`src` に `lit:`、`human:`、`mut:`、または `llm:` の由来タグを付与）を正規化された `JSONL` ログに追記し、ゼロコピー `POSIX mmap` オープンアドレス方式のバイナリハッシュテーブル（`DNULLMM1`：64 バイトヘッダ + 48 バイトスロット）をコンパイルする。`test` 評価の前に、ストアは `SHA-256` ダイジェストによって読み取り専用に凍結される。テスト時には `VERIFY`、`MUTATE`、`WRITE` は更新を一切実行せず、実行前後のストアダイジェストがバイト単位で一致することがアサートされる。クラス別コードへ汎用ソルバーを密輸する脅威（`TH2`）を防ぐため、各クラスの関数テーブル（`REDUCE` + `ACT`）は gzip 圧縮後 `<= 4,096` バイトかつ 1 回の呼び出しあたり基本演算 `<= 50,000` 回に制限され（`S-3`）、学習済みの自然言語簡約器は一切禁止される（`S-4`）。

<div id="22-operational-permutations-under-comparison" class="anchor-alias" aria-hidden="true"></div>

### 2.2 比較対象となる運用構成群

| 比較群（Arm） | 定義 | 意思決定時の LLM 呼び出し回数 | 構築時の由来（Provenance） |
| :--- | :--- | :--- | :--- |
| **`B0`（フロア群）** | クラスのデフォルト行動を無条件に出力する。テスト時の $> 2\delta$（`10.0` パーセントポイント）検出感度ゲートを強制する。 | `0` | なし |
| **`B1`（古典ソルバー群）** | 事例ストアを持たない単独の演繹ソルバー（`CDCL+DRAT`、トレース零空間 Houdini、有理数 Buchberger Gröbner 基底）。 | `0` | 古典アルゴリズム |
| **`B2`（シードのみ群）** | `dev` 変異を無効化した文献シードのみのストア。 | `0` | `lit:` のみ |
| **`N0`（厳格ヌル群）** | モデル由来レコード、修復、クラス別コードを一切含めずに `dev` 上で充填された固定整数ループ（`llm:` 由来エントリ `0` 件）。 | `0` | `lit:`、`human:`、`mut:` |
| **`N1`（主ヌル群）** | 由来の種類を問わず検証済みエントリを受け入れて `dev` 上で充填された固定整数ループ。すべての `dev` モデル呼び出しは $C_{N1}$ に計上される。 | `0` | 任意の検証済み由来（`C_N1` 計上） |
| **`B5`（`code-once` 群）** | フロンティア LLM が `dev` 仕様から決定論的 Python 方策を 1 度だけ作成し、`test_seed` 生成前に凍結する。 | `0` | クラスあたり `dev` LLM 呼び出し `1` 回 |
| **`B3`（クラウド・フロンティア群）** | インスタンスごとのクラウドモデル評価（主モデル `Claude Opus 5.5`、副モデル `Claude Sonnet 5.5`、プローブ `Gemini 2.5 Flash`）。 | `>= 1` / インスタンス | 事前学習済みクラウド API |
| **`B6`（ローカル公開重み群）** | 同一ホスト上のローカル推論（Apple M5 Max Metal GPU 上の `llama-server` 経由で `Alibaba Qwen 3.6 35B-A3B` および `Google Gemma 4 E4B-it` を実行）。 | `>= 1` / インスタンス | ローカル `reported_j` |
| **`Shape H`（ハーネスボックス群）** | `/work` 内で `--strict-mcp-config` を指定した外部 `Claude Code 2.1.330` CLI を実行し、通信の 100% を `satb-proxy` 経由でルーティングする。 | 複数ターン | `Lane B` 下限を検証（反証条件 8） |

<div id="23-gate-g2-five-language-conformance-and-positive-controls" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Gate G2 における 5 言語適合性と陽性対照

`/usr/bin/bc` および `openssl` を用いて独立に生成されたゴールデンベクタにより、5 つの言語実装すべてにわたるビット単位の完全一致（`Gate G2`）が検証された。あわせて、エージェントに関するあらゆる主張から除外された 3 つの隔離済み陽性対照（`ctl.setpoint`：`B0 = 0.110 -> N0 = 1.000`、`ctl.mamdani`：`B0 = 0.525 -> N0 = 1.000`、`ctl.cartpole`：`B0 = 0.000 -> N0 = 0.805`）も検証された。

| 言語実装 | 凍結ストア `SHA-256` ダイジェスト | `1M` レコード `DNULLMM1` マウント時間 | 平均プローブ遅延 | `10k` プローブチェックサム |
| :--- | :--- | ---: | ---: | ---: |
| **Rust**（参照実装 + `SATB`） | `0da4df8d9ccbce1e...4485781` | `44.67 µs` | `582.57 ns` | `15027705736` |
| **C++20**（`clang++ -O3`） | `0da4df8d9ccbce1e...4485781` | `41.58 µs` | `388.43 ns` | `15027705736` |
| **Go `1.25`** | `0da4df8d9ccbce1e...4485781` | `60.63 µs` | `417.05 ns` | `15027705736` |
| **Julia `1.12`** | `0da4df8d9ccbce1e...4485781` | `125.92 µs` | `350.07 ns` | `15027705736` |
| **Python `3.13`**（`mmap`） | `0da4df8d9ccbce1e...4485781` | `8,655.58 µs` | `633.87 ns` | `15027705736` |

---

<div id="3-confirmatory-experiment-1-exp-001-track-a-bounded-template-stratum" class="anchor-alias" aria-hidden="true"></div>

## 3. 確証実験 1（`exp-001`、Track-A 有界テンプレート層）

<div id="31-pre-beacon-registration-reg-exp-001" class="anchor-alias" aria-hidden="true"></div>

### 3.1 ビーコン前事前登録（`reg-exp-001`）

5 つのクラス（`m = 5`：`formal.bv_superopt`、`formal.hoare_inv`、`formal.poly_ideal`、`formal.open_drat_synth`、および `tool.tau2_sqlite`）を $J = 5$ 通りの `dev` エピソード順列にわたって充填した（すべての形式系充填試行の合計で `L2` `reported_j` は `966.2 J`、`tool.tau2_sqlite` における `Opus 5.5` の `dev` 費用 `$0.00955` を `N1` に計上）。標本サイズ（各ティア `n = [420, 250, 250, 250, 250] = 1,420`、合計 `2,840`）は、多重性調整済みの `99.0%`（$1 - 0.05/5$）、`10,000` 回リサンプリング対 `BCa` 信頼区間に対して検出力 `90%` となるよう設計された。マニフェスト `cffb564cd9ad...` および OpenTimestamps 証明 `suite/manifest.json.ots`（`172 B`）は、目標ラウンド `6663734`（`test_seed_u64 = 5861262844585529273`）より厳密に前の `drand` ラウンド `6663731` において `git tag reg-exp-001`（`e5007a4`）としてコミットされた。抽出された全 `750/750` 件の軌跡は、独立した `DRAT` および `SQLite SAVEPOINT` スコアラ監査に合格した（不正攻略 `0` 件）。

<div id="32-track-a-confirmatory-results-2840-instances" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Track-A 確証実験結果（`2,840` インスタンス）

| ティアおよびタスククラス | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Qwen36}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | `99.0%` BCa CI | `Qwen` 合格あたり `reported_j` | 判定（$\delta = +0.05$） |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | ---: | :--- |
| **Tier 1** `formal.bv_superopt` | `420` | `0.000` | `1.000` | `1.000` | `0.998` | `0.836` | `-0.24 pts` | `[-1.43, +0.00]` | `14.17 J` | **関連性除外** |
| **Tier 1** `formal.hoare_inv` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.508` | `+0.00 pts` | `[+0.00, +0.00]` | `23.32 J` | **関連性除外** |
| **Tier 1** `formal.poly_ideal` | `250` | `0.348` | `1.000` | `1.000` | `0.996` | `1.000` | `-0.40 pts` | `[-2.80, +0.00]` | `7.26 J` | **関連性除外** |
| **Tier 1** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.352` | `+0.00 pts` | `[+0.00, +0.00]` | `69.00 J` | **関連性除外** |
| **Tier 1** `tool.tau2_sqlite` | `250` | `0.188` | `0.624` | `1.000` | `1.000` | `0.940` | `+0.00 pts` | `[+0.00, +0.00]` | `7.11 J` | **関連性除外** |
| **Tier 2** `formal.bv_superopt` (`16b`) | `420` | `0.000` | `1.000` | `1.000` | `0.983` | `1.000` | `-1.67 pts` | `[-3.81, -0.48]` | `7.87 J` | **関連性除外** |
| **Tier 2** `formal.hoare_inv` (`6b`) | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.600` | `+0.00 pts` | `[+0.00, +0.00]` | `16.41 J` | **関連性除外** |
| **Tier 2** `formal.poly_ideal` ($k\in[7,15]$) | `250` | `0.376` | `1.000` | `1.000` | `1.000` | `1.000` | `+0.00 pts` | `[+0.00, +0.00]` | `6.74 J` | **関連性除外** |
| **Tier 2** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.376` | `+0.00 pts` | `[+0.00, +0.00]` | `53.59 J` | **関連性除外** |
| **Tier 2** `tool.tau2_sqlite`（言い換え） | `250` | `0.224` | `0.516` | `0.636` | `1.000` | `0.916` | **`+36.40 pts`** | **`[+28.80, +44.80]`** | `7.15 J` | **関連性確認**（未充填 `12` 件） |

**Track-A の適用範囲監査。** `exp-001` は正規化可能な形式検証（`9/9` セルで関連性を除外し、API 支出 `$27.25` またはローカル `reported_j` `31,619.9 J` を節約）と未見の表層的言い換え（Tier 2 `tool.tau2_sqlite` で `+36.40` ポイント、`Qwen 3.6` では追加合格 1 件あたり `23.38 J` を消費）を明確に切り分けたものの、実行後監査によって重要な構造的制約が特定された。すなわち、Track-A の生成器は法 `6` から法 `12` のテンプレート族（$K_{\text{eff}} = 6\text{-}12$）から標本抽出していたため、`120` エピソードの `dev` 予算だけで特徴セルが完全に飽和していたのである。

---

<div id="4-confirmatory-experiment-2-exp-002-track-b-external-public-benchmarks-keffn" class="anchor-alias" aria-hidden="true"></div>

## 4. 確証実験 2（`exp-002`、Track-B 外部公開ベンチマーク、$K_{\text{eff}} = n$）

<div id="41-course-corrected-unique-instance-design-and-registration-reg-exp-002" class="anchor-alias" aria-hidden="true"></div>

### 4.1 軌道修正された固有インスタンス設計と事前登録（`reg-exp-002`）

合成テンプレートメニューを排して `Shape D` を検証するため、Track-B（`exp-002`）では外部の著者による 4 つの公開ベンチマーク（上流アーティファクトを `SHA-256` で固定）と、構造的に固有なランダム相転移 `3-SAT` インスタンス（`12` 変数、`50` 節、節・変数比 `4.17`）を取り込み、`1,190` 件の固有な保留 `test` インスタンス（$K_{\text{eff}} = n = 1,190$）を構成した。

1. **`formal.unique_3sat_drat`（`n = 250`）**：固有な `12` 変数・`50` 節の `3-CNF` 論理式。`Shape D` は多項式時間の 1 段失敗リテラル伝播と `45` 反転の局所ウォーク（gzip 圧縮後 FT `3,108 B`）を用い、2 監視リテラル方式の `RUP/DRAT` 証明検査を備えた単独の `CDCL` が古典ソルバー群 `B1` を務める。
2. **`external.bfcl_v3_live`（`1,292` 件のプールから `n = 250`）**：UC Berkeley Gorilla Function-Calling Leaderboard `v3`（ユーザー提供の `live_multiple` 複数ツールスキーマと `irrelevance` 棄却タスクを交互配置、gzip 圧縮後 FT `1,381 B`）。
3. **`external.tau_bench_retail`（`635` 件のプールから `n = 220`）**：Sierra Research `tau-bench` 小売ポリシーおよびリレーショナルデータベース変更スイート（`500` ユーザー、`1,000` 注文、`50` 商品、gzip 圧縮後 FT `1,298 B`）。
4. **`external.bigcodebench_exec`（ローカルで実行検証済みの `487` 件のプールから `n = 220`）**：隔離された `unittest` 実行によって採点される `BigCodeBench v0.1.3` マルチライブラリ Python コーディング仕様（gzip 圧縮後 FT `286 B`、プール内の全タスク `100%` について正規解が合格し `return None` が却下されることをオフラインで検証済み）。
5. **`external.swebench_verified`（`500` 件のプールから `n = 250`）**：`princeton-nlp/SWE-bench_Verified` の人手検証済み GitHub Issue であり、リポジトリ内の `12` 択 `(file_path :: symbol)` 障害箇所特定として評価される（gzip 圧縮後 FT `718 B`）。

マニフェスト `5fe640f00298...`（`Opus 5.5` の `dev` 呼び出し `355` 回 = `$7.1902` を $C_{N1}$ に計上）および OpenTimestamps レシート `suite_exp002/manifest.json.ots`（`207 B`）は、目標ラウンド `6664089`（`test_seed_u64 = 9069507899917430179`）より厳密に前の `drand` ラウンド `6664086` において `git tag reg-exp-002`（`d6bfae5`）としてコミットされた。1 件の機械的なハーネス修正（`amendment_01_b6_slot_ctx.json`）により、`llama-server` の総コンテキスト長を `-c 16384`（`4` スロット分割で 1 スロットあたり `4,096` トークンとなり、`10k-13.7k` トークンの `BFCL`/`tau-bench` スキーマで `HTTP 400` を返していた）から `-c 81920`（1 スロットあたり `20,480` トークン）へと引き上げたが、凍結ストア、プロンプト、検証器、標本サイズ、および `drand` ラウンド `6664089` は一切変更していない。抽出された全 `515/515` 件の軌跡は、独立したスコアラによる再検証に合格した（不正攻略 `0` 件）。

<div id="42-track-b-multi-vendor-confirmatory-results-1190-unique-instances" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Track-B マルチベンダー確証実験結果（`1,190` 固有インスタンス）

全 `1,190` 件に対する `Shape D`（`N0`、`N1`）、`B0`、および `B1`（`CDCL+DRAT`）の評価は **`0.9213 s`** で完了した（`L2` `reported_j` `35.72 J`、`GPU` `0.36 J`、`L3` `ri_energy_nj` `2.58 J`、`6.57 × 10^9` 命令、実行前後のアイドルドリフト `3.09% <= 5.0%`）。

| 固有インスタンスクラス | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Sonnet}}$ | $p_{\text{Qwen36}}$ | $p_{\text{Gemma4}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | `99.0%` BCa CI | 判定（$\delta = +0.05$） |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | :--- |
| `formal.unique_3sat_drat` ($p_{B1}=1.000$) | `250` | `0.000` | **`0.696`** | **`0.696`** | `0.052` | `0.008` | `0.000` | `0.000` | **`-64.40 pts`** | `[-72.00, -56.00]` | **評価不能**（$p_{\text{LLM}} < 2\delta$） |
| `external.bfcl_v3_live` | `250` | `0.180` | `0.200` | `0.228` | `0.828` | **`0.840`** | `0.804` | `0.720` | **`+60.00 pts`** | `[+51.20, +68.40]` | **関連性確認**（未充填 `28` 件） |
| `external.tau_bench_retail` | `220` | `0.005` | `0.396` | `0.259` | **`0.864`** | `0.805` | `0.755` | `0.623` | **`+60.45 pts`** | `[+51.82, +68.64]` | **関連性確認**（未充填 `14` 件） |
| `external.bigcodebench_exec` | `220` | `0.000` | `0.000` | `0.000` | **`0.950`** | `0.836` | `0.473` | `0.391` | **`+95.00 pts`** | `[+90.00, +97.73]` | **関連性確認**（未充填 `218` 件） |
| `external.swebench_verified` | `250` | `0.096` | **`0.460`** | `0.456` | **`0.984`** | `0.952` | `0.900` | `0.812` | **`+52.80 pts`** | `[+44.40, +60.40]` | **関連性確認**（未充填 `4` 件） |

*（AI Studio の無料枠上限 `20 RPD` 内で実施した `Google Gemini 2.5 Flash` に対する 15 回のライブクラウドプローブでは、上記 5 クラスと同じ順序で `0/3`、`3/3`、`2/3`、`1/3`、`3/3` を記録した。）*

第4.2節からは 3 つの実証的知見が際立っている。

1. **演繹的組合せの崖（`formal.unique_3sat_drat`）**：形式充足可能性問題からテンプレートメニューを取り除くと（`K_eff = 250` 個の固有な相転移 `3-CNF` 論理式）、単一ターンのニューラルモデルはほぼ完全に失敗する（`Opus 5.5` は `$13.55` で `5.2%`、`Sonnet 5.5` は `$8.17` で `0.8%`、`Qwen 3.6` は `7,588 J` で `0.0%`、`Gemma 4` は `4,698 J` で `0.0%`）。これに対し、モデル呼び出しゼロの多項式事例テーブルは `69.6%`（`174/250`）を解き、単独の古典ソルバー `CDCL+DRAT`（`B1`）は **`100.0%`（`250/250`）** を解く。`Opus 5.5` 自体がフロア群 `B0` を $2\delta = 10.0$ パーセントポイント上回ることができなかったため（`95%` `BCa` 区間 `[+2.80, +8.40]` ポイント）、事前登録された決定規則により `"Relevance excluded"`（関連性除外）の判定は留保され、このセルは厳格に **`Not assessable`**（評価不能）と分類される。
2. **無視できないゼロモデル・ベースラインと正味のニューラル増分の共存**：ニューラルパラメータを一切持たない場合（`N0`）であっても、語彙およびスキーマに基づく事例規則だけで `SWE-bench Verified` の `12` 択障害箇所特定の **`46.0%`**（フロア `9.6%`）および `tau-bench` 小売ポリシー変更の **`39.6%`**（フロア `0.5%`）を解決できる。`tau-bench` においては、`N1` における貪欲な `dev` バイグラム抽出がノイズの多い顧客表現に過適合し（`N0` の `39.6%` に対し `25.9%`）、厳格な `N0` を `N1` と併記することの重要性が裏付けられた（`S4`）。それにもかかわらず、4 つの公開ベンチマークすべてにおいて、フロンティアモデルおよびローカル公開重みモデルは `N0` と `N1` の双方に対して大きく統計的に決定的な増分（`+46.82` から `+95.00` パーセントポイント）を達成している。
3. **ローカル増分（`B6`）の 2 チャネル `reported_j` エネルギーコスト**：共有 Apple M5 Max ホスト上では、並行稼働していた `yosys-abc` 論理合成によって `5` 個の数分間ウィンドウのうち `4` 個で反証条件 6 が発動し、`derived_marginal_j` が適切に無効化される一方で生の `L2` `IOReport` および PID 別の `L3` `ri_energy_nj` カウンタが保全された。この環境において、`Qwen 3.6 35B-A3B` が `N1` を上回って追加完了したタスク 1 件あたりの生の `L2` `reported_j` コストは、**`49.90 J`**（`SWE-bench`）、**`70.33 J`**（`BFCL v3`）、**`238.80 J`**（`BigCodeBench`）、および **`407.12 J`**（`tau-bench` Retail）であった。

---

<div id="5-goodturing-unseen-mass-multi-turn-work-repair-and-online-crystallization" class="anchor-alias" aria-hidden="true"></div>

## 5. Good-Turing 未見質量、複数ターン `/work` 修復、およびオンライン結晶化

<figure class="my-8">
  <img src="/figures/deterministic-null/s3-good-turing-regimes.svg" alt="Good-Turing 未見キー質量 N1(t)/t と Zipf オンライン結晶化によって分離される 2 つの領域。" />
  <figcaption>図 2. Good-Turing 未見キー質量 <em>N</em><sub>1</sub>(<em>t</em>) / <em>t</em> は、凍結された <code>Shape D</code> が飽和する領域と、ニューラル合成またはオンライン結晶化が必要となる領域を予測する（<code>measured_j = None</code>）。</figcaption>
</figure>

<div id="51-goodturing-unseen-mass-n1tt-across-the-five-track-b-streams" class="anchor-alias" aria-hidden="true"></div>

### 5.1 5 つの Track-B ストリームにわたる Good-Turing 未見質量（$N_1(t)/t$）

各 `dev + cal` タスクストリーム $t = 1 \dots T$ に沿って、Good-Turing シングルトン比 $N_1(t)/t$ は次に到来するキーが未見である確率を推定する。

| タスククラス（`dev + cal` ストリーム） | ストリーム長 $T$ | 粗視化セル $N_1(T)/T$ | 詳細スキーマ／インスタンス $N_1(T)/T$ | 保留セット `N0` / `N1` 完了率 |
| :--- | ---: | ---: | ---: | ---: |
| `formal.unique_3sat_drat` | `270` | `0.0000` | `1.0000` | `69.6%` / `69.6%` |
| `external.swebench_verified` | `250` | `0.0080` | `0.5960` | `46.0%` / `45.6%` |
| `external.tau_bench_retail` | `285` | `0.0035` | `0.6386` | `39.6%` / `25.9%` |
| `external.bfcl_v3_live` | `300` | `0.0233` | `0.4033` | `20.0%` / `22.8%` |
| `external.bigcodebench_exec` | `240` | **`0.9917`** | **`0.9917`** | **`0.0%` / `0.0%`** |

`N1` が `BigCodeBench` の `dev` セット上で単体テストに合格した `Claude Opus 5.5` の Python 解 `108` 件を結晶化した後でさえ、$N_1(T)/T = 0.9917$ は未見の合成的コーディング仕様におけるキー重複がほぼゼロであることを予測しており、これは保留 `test` セットで観測された完了率 `0.0%`（未充填キー `218` 件）と完全に一致した。

<div id="52-multi-turn-work-software-engineering-repair-6-multi-file-repositories" class="anchor-alias" aria-hidden="true"></div>

### 5.2 複数ターン `/work` ソフトウェア工学修復（複数ファイルリポジトリ `6` 個）

第4節の単一ターンプロンプトが多段階コーディングハーネスに不利な制約や歪みを与えていないことを検証するため、複数関数・複数ファイルから成る Python バグ修正リポジトリ 6 個（`loader.py` + `schema.py` にまたがる `config-defaults`、`interval-merge`、`pagination`、`calc.py` + `lexer.py` にまたがる `precedence`、`window.py` + `limiter.py` にまたがる `rate-window`、および `retry-backoff`）を、隔離された `/work` サンドボックス（`max_turns = 10`）内で評価した。採点時には `pytest -q` の実行直前に上流の無改変コピーで `test_*.py` を上書きした。

| 複数ターン `/work` ハーネスレーン | 合格リポジトリ数 | `SATB` `P/F/R/K` | モデル呼び出し回数 | ツール呼び出し回数 | API `USD` / ローカル `reported_j` |
| :--- | ---: | :---: | ---: | ---: | :--- |
| **`Shape D` コールド未見（`t = 1`）** | `0 / 6`（`0.0%`） | `0/6/0/0` | `0` | `0` | `$0.0000` / `< 1 J` |
| **`Lane B`（`Claude Opus 5.5`）** | **`6 / 6`（`100.0%`）** | `6/0/0/0` | `28` | `29` | `$0.3613`（`not_available`） |
| **`Lane B`（`Claude Sonnet 5.5`）** | **`6 / 6`（`100.0%`）** | `6/0/0/0` | `31` | `34` | `$0.2080`（`not_available`） |
| **`Shape H`（`Claude Code 2.1.330` + `Opus 5.5`）** | **`6 / 6`（`100.0%`）** | `6/0/0/0` | `30` | `MCP` | `$0.2646`（`not_available`、反証条件 8 合格） |
| **`Lane B` ローカル（`Qwen 3.6 35B-A3B`）** | **`6 / 6`（`100.0%`）** | `6/0/0/0` | `42` | `42` | **`2,342.0 J`** `L2`（`390.3 J` / リポジトリ） |
| **`Shape D` オンライン再生（`t = 2` ストリーム）** | **`6 / 6`（`100.0%`）** | `6/0/0/0` | `0` | `0` | `$0.0000`（検証済みパッチ再生） |

<div id="53-online-crystallization-on-recurring-zipfian-traffic-bigcodebench" class="anchor-alias" aria-hidden="true"></div>

### 5.3 反復的な Zipf トラフィックにおけるオンライン結晶化（`BigCodeBench`）

副次的なオンライントラック（固有な `BigCodeBench` テストタスク `220` 件上の Zipf-$0.85$ 分布から抽出した `600` リクエストにおいて、`Shape D` は未見キーのミス時にのみ `B3`/`B6` を呼び出し、`unittest` に合格した解をキャッシュする設定）では、リクエストごとに毎回 `Opus 5.5` を呼び出す純粋方式と同等のタスク完了率（**`98.0%` 対 `98.0%`**）を維持しながら、`155` 個の検証済み関数がストアへ結晶化され、累積 LLM 呼び出し回数を **`72.17%`（`167` 回 対 `600` 回）** 削減し、API 支出を **`$7.33` から `$2.04`（`3.59×`）** へ、ローカル `Qwen 3.6` の `reported_j` 消費を **`67,729.6 J` から `18,851.4 J`（`3.59×`）** へと削減した。

---

<div id="6-limitations-falsifiers-and-unfinished-work" class="anchor-alias" aria-hidden="true"></div>

## 6. 限界、反証条件、および未完の課題

1. **物理的な電源レールおよび交流壁コンセント電力計の不在（`board_metered = false`、`measured_j = None`）**：本研究におけるすべてのエネルギー数値は、並行ジョブが稼働するホスト上の Apple Silicon オンチップ `IOReport`（`L2`）およびカーネル `ri_energy_nj`（`L3`）による `reported_j` カウンタ値である。静止させた対象マシン上で PSU、DRAM、NVMe の損失まで捉える `L0` 交流壁コンセント計測（`Shelly`／`Yokogawa` 等）は今後の課題として残されている。
2. **自己管理下のベンチマーク選定と外部第三者による Tier 3**：Track-B（`exp-002`）では合成テンプレートを廃し、`drand` ラウンド `6664089` 以前にロックされた外部著者による 4 つの公開ベンチマークへと置き換えたが、独立した人間の第三者が作成しエスクロー保管する封印済み Tier-3 ベンチマークはまだ実施されていない。
3. **有限予算下における非必然性**：すべての `"Relevance shown"`（関連性確認）判定は、宣言された `dev` 標本（`100-150` インスタンス）および `4,096 B` の関数テーブル上限に対して厳密に相対的なものである。未充填キーはその予算内でカバレッジに到達しなかったことを示すものであり、非ニューラル手続きの数学的不可能性を示すものでは決してない。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

<ol data-refs>
<li>Aamodt, A., &amp; Plaza, E. (1994). Case-based reasoning: Foundational issues, methodological variations, and system approaches. <em>AI Communications</em>, 7(1), 39-59.</li>
<li>Efron, B. (1987). Better bootstrap confidence intervals. <em>Journal of the American Statistical Association</em>, 82(397), 171-185.</li>
<li>Goldberg, E., &amp; Novikov, Y. (2003). Verification of proofs of unsatisfiability for CNF formulas. <em>DATE 2003</em>, 886-891.</li>
<li>Good, I. J. (1953). The population frequencies of species and the estimation of population parameters. <em>Biometrika</em>, 40(3-4), 237-264.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., &amp; Narasimhan, K. (2024). SWE-bench: Can language models resolve real-world GitHub issues? <em>ICLR 2024</em>.</li>
<li>Mamdani, E. H., &amp; Assilian, S. (1975). An experiment in linguistic synthesis with a fuzzy logic controller. <em>International Journal of Man-Machine Studies</em>, 7(1), 1-13.</li>
<li>Michie, D., &amp; Chambers, R. A. (1968). BOXES: An experiment in adaptive control. <em>Machine Intelligence</em>, 2, 137-152.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Patil, S. G., Mao, H., Cheng-Jie Ji, C., Yan, F., Suresh, V., Stoica, I., &amp; Gonzalez, J. E. (2024). Gorilla: Large language model connected with massive APIs (Berkeley Function-Calling Leaderboard). <em>NeurIPS 2024</em>.</li>
<li>Simon, H. A., &amp; Kadane, J. B. (1975). Optimal problem-solving search: All-or-none solutions. <em>Artificial Intelligence</em>, 6(3), 235-247.</li>
<li>Stanfill, C., &amp; Waltz, D. (1986). Toward memory-based reasoning. <em>Communications of the ACM</em>, 29(12), 1213-1228.</li>
<li>Wang, L.-X., &amp; Mendel, J. M. (1992). Generating fuzzy rules by learning from examples. <em>IEEE Transactions on Systems, Man, and Cybernetics</em>, 22(6), 1414-1427.</li>
<li>Wetzler, N., Heule, M. J. H., &amp; Hunt, W. A. (2014). DRAT-trim: Efficient checking and trimming using expressive clausal proofs. <em>SAT 2014</em>, 422-429.</li>
<li>Yao, S., Shinn, N., Razavi, P., &amp; Narasimhan, K. (2024). tau-bench: A benchmark for tool-agent-user interaction in real-world domains. <em>arXiv:2406.12045</em>.</li>
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2025). BigCodeBench: Benchmarking code generation with diverse function calls and complex instructions. <em>ICLR 2025</em>.</li>
</ol>
