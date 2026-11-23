---
title: "メータード・コミット・ゲート: エージェントシステムにおける正確な完了までのエネルギー"
deck: "チェックが通過した後にのみエージェントが行動できるゲート、最も低コストな手法から順に試みるカスケード、およびその両方のエネルギー計測値を、各取得方法によってラベル付けしたもの。"
lang: "ja"
source: "gates"
complete: true
---

<div id="notational-intelligence-as-commit-law" class="anchor-alias" aria-hidden="true"></div>
<div id="metered-commit-gates-energy-to-correct-completion-for-agentic-systems" class="anchor-alias" aria-hidden="true"></div>

リビジョン db13599、2026年11月5日。 データとコード: [research.openie.dev/data/](/data/#gates). LaTeX PDF: [/pdfs/latex/gates.pdf](/pdfs/latex/gates.pdf) ([source](/pdfs/latex/gates.tex)).

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概要

この論文は、チェックが合格した後にのみ機械が動作するゲートと、最も安価な手段を最初に試す規則を定義し、ソフトウェアの結果とボードレベルのエネルギー測定をそれぞれ取得方法でラベル付けして報告する。

**平易な言葉で**

1. コンピュータは、単純なチェックで安全と判断されるまで、取り消し不可能な操作を行ってはならない。
2. 作業を完了させる最も安価な方法を最初に試し、より安価な手段がすべて失敗した場合にのみ大規模AIモデルを使用すべきである。
3. すべての決定は使用したエネルギーとともに記録され、誰でも後で検証できるようにする。

本稿は 1 つの規則を共有する 2 部構成である：正確性がゲートであり、ジュールが順位付けである。第 I 部はコミットゲートである。提案は自己承認できず、不可逆的な操作は証明書の背後でのみ実行され、コミットまたは拒否のすべての決定は領収書に記録される。第 II 部は制限の混合である：タスクは完了するために最小期待エネルギーを必要とし、タスク完了後に消費されたエネルギーは検証された進捗をもたらさない。その標準的な例は、最も安価なギアを最初に試すカスケードである：Lookup、次に Formula、次に Solver、最後に Model。カスケードはタスク完了述語 $C(z)$ が成立した時点で停止し、次のギアが予算を超える場合は領収書とともに拒否する。タスクを正しく完了するシステムの中で、使用ジュールが少ないものが上位にランク付けされる。

1 つのボード測定がゲートファブリックを基準付けする。AMD Kria KV260 上で、オンボード INA260 が WCA ゲートファブリックについて SOM レベルの A/B/A 差を 11,428 pJ/ゲートサイクル（標準誤差 129 pJ、N = 4）と測定し、シードファブリックについては 98.0 pJ/シードサイクル（標準誤差 30.8 pJ、N = 4）を示した。INA260 は `VCC_SOM` に接続されており、処理システム、プログラマブルロジック、DDR メモリ、モジュールレギュレータに電力を供給する（[KV260 device tree, `ina260@40`](https://gbmc.googlesource.com/linux/+/ccd1cdca5cd433c8a5dff78b69a79b31d9b77ee1/arch/arm64/boot/dts/xilinx/zynqmp-sck-kv-g-revB.dtso))。したがってこれらはコアレールや PL のみの数値ではなく、モジュール全体の差である（Section I.3.7）。Section I.4.9 の表にあるシードファブリック差は +0.0098 W（標準誤差 0.0031 W）で、これは 9.8 mW に相当し、約 100 MHz でのシードサイクルあたり 98.0 pJ と同等である。比較に用いられた 5 V 電源では 1.96 mA に相当し、部品の 1.25 mA 電流分解能に近いが、PL レールメータと少なくとも 10 回の測定が実施されるまで差は結論付けられない。

<div id="01-contributions" class="anchor-alias" aria-hidden="true"></div>

### 0.1 貢献

1. コミットエンベロープ：提案、次に証明書、そしてコミットまたは拒否、最後に領収書。証明書は結合的であり、lookup許可 と エネルギー述語 をANDで結び、オプションで制御バリア関数 をANDで結ぶ。拒否理由は型付けされている。Rust ソフトウェアの参照実装である Wise Computer Automation (WCA) がそれを実行する（Part I）。
2. 型付けされた証跡不変式。`ModelGenerated` とラベル付けされた出力は、決して `Deterministic` に昇格できない（Parts I and II）。
3. 名前付き拒否を持つカスケード、そして最も安価なものを最初に選択することが期待エネルギー（ジュール）で最適となる条件は、Simon と Kadane の逐次探索に関する順序結果に従う：$p_i / c_i$ の降順でギアを試す。ここで $p_i$ はギア $i$ がタスクを完了させる確率、$c_i$ はその期待エネルギー（ジュール）である（Simon and Kadane, 1975）（Part II）。
4. 完了を正すエネルギーは、セクション 0.2 で定義されたランキングである。
5. 領収書は計測手段である。各領収書は、行為前の予測ハッシュとそのタイムスタンプ、結果、マッチ、階層ごとのジュール（測定、報告、推定、合計しない）および拒否理由を保持する。

<div id="02-energy-to-correct-completion" class="anchor-alias" aria-hidden="true"></div>

### 0.2 正確な完了までのエネルギー

$C(z)$ をタスク完了述語とし、任意の期限をそこに書き込む。システム $S$ がポリシー $\pi$ と許容失敗率 $\delta$ を持つ場合，

$$
J^*(S) = \min_{\pi} \; \mathbb{E}[J_\pi] \quad \text{subject to} \quad \Pr[C(z) = 1] \ge 1 - \delta .
$$

正確性と期限は制約である。ゲートを通過したシステムの中では、エネルギー（ジュール）のみで順序付けられる。実数 $J^*$ によってシステムを順序付けることは全順序前序であり、任意の二つの実数は比較できる。各測定が最大 $\epsilon$ ジュールのメータ誤差を持つとき、$J^*$ が $2\epsilon$ 以上異なる二つのシステムはその順序を保つ。MLPerf Power はすべての電力結果を精度目標の背後にゲートする。$J^*$ も同様の形を持つ。

<div id="03-how-to-read-this-paper" class="anchor-alias" aria-hidden="true"></div>

### 0.3 本論文の読み方

パート I のセクションは I.n と番号付けされ、パート II のセクションは II.n と番号付けされる。各パートはそれぞれ独自の参考文献リストを持つ。主要なアイデアは二つの図によって示される: 図 1（セクション I.1）はコミットゲートを描き、図 2（セクション II.1）は Mixture of Limits のフロアとプラトーを描く。価格と需要についてはここでは論じない。

<div id="part-i" class="anchor-alias" aria-hidden="true"></div>
<div id="part-i-the-commit-gate" class="anchor-alias" aria-hidden="true"></div>

## Part I. コミット・ゲート

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="i-abstract" class="anchor-alias" aria-hidden="true"></div>

## I. 要旨

エージェントは行動を提案する。不可逆的な作業は、行動が実行許可されるときにのみ開始される。本稿ではその許可ステップを形式的対象として扱う。Linus Lee の記法的知性は、記号の変更がある考えを容易にし、他の考えを表現可能にするという観察である。本稿の主張はそれより狭い。物質を移動させるか不可逆的なツールを呼び出すことができる機械に対して、有用な記法は実行時法則である：提案はそれ自身を許可してはならない。ソフトウェア参照である Wise Computer Automation (WCA) は、この法則をスキーマ `wca.commit.v1` の下に四つの対象として記録する：提案、証明書、型付けされた拒否理由、そしてコミット決定である。参照で使用される証明書は合取的である。ルックアップテーブル (LUT) の許可ビットが保持され、エネルギー述語が保持されなければならない。任意の制御バリア関数 (CBF) を追加することができる。読み取り専用呼び出しはゲートをバイパスできるが、不可逆呼び出しはできない。

本稿のエネルギー数値は、操作回数と解析的エネルギー定数の積（OpCounter モデル）である。これは基板電力ではない。フィールドプログラマブルゲートアレイ (FPGA) の挙動はここでは三つのクラスに分けられる。Icarus Verilog シミュレーションは生成されたレジスタ転送ロジックを検証する。Alchitry Pt V2 は閉ループゲートを実行し、すべての決定についてソフトウェアと一致する。メータがないためエネルギーは未測定である。AMD Kria KV260 はオンボード INA260 電力モニタを用いてゲートファブリックを動作させる。停止状態と実行状態で同一ビットストリームを交互に A/B/A と実行すると、25 MHz で LUT 許可、エネルギー述語、バリアの八並列評価につき、ゲートサイクルあたり基板レベルで 11,428 pJ の測定差が得られる（標準誤差 129 pJ、N = 4）。小規模シードファブリックではシードサイクルあたり 98.0 pJ（標準誤差 30.8 pJ、N = 4）である。これらは基板レベルでの `` `measured_j` `` であり、コアレールの読取りでも閉ループプラントのジュールコスト（Section I.3.7）でもない。Stage B はブラウザ計測器として https://research.openie.dev/living/fpga-sim/ で利用可能である。これは同一の Rust ゲートを WebAssembly (WASM) にコンパイルし、WebGPU API を通じて LUT 状態とコミットトレースを表示する。その計測器はエミュレーションであり、デバイス・アンダー・テスト (DUT) の測定でも Alchitry 基板の電力測定でもない。

測定されたソフトウェア結果は上限がある。シード 1 の 16 ステップ振り子エピソードでは、参照は 1 ステップをコミットし、15 を拒否する。解析的エピソードエネルギーは 8.6795e-10 ジュールである。報告された Safe 固定小数点ポート・ハミルトニアンチェックにおいて、連続エネルギーオラクル `` `Vdot <= epsilon` `` に対する偽許可は示された格子上で 0 であり、価格は 209,261 回の決定中 79 回の偽拒否である（Section I.4.3）。これはそのテストセットにおける安全性と活性度のペアである（Section I.4.10）。Model Context Protocol (MCP) デモは、実行者を呼び出さずに不可逆ツール呼び出しを拒否する。エネルギー集合バリアと離散シールドを用いた玩具的比較は、安全性定義間で不一致を示す。これらの結果は、シリコンエネルギーのリーダーシップ、産業制御性能、またはコアレール測定を主張するものではない。

<div id="notation" class="anchor-alias" aria-hidden="true"></div>
<div id="i-notation" class="anchor-alias" aria-hidden="true"></div>

## I. 記法

用語は以下において初めて科学的に使用される時点で定義され、後続の節が短縮形を使用できるようにここに集約される。

| 用語 | 本論文における定義 |
|------|--------------------------|
| 記法的知性 | より優れた記法が、ツールの追加のみによる効果を超えて、人間またはシステムが確実に実行できることを高め得るというLeeの主張。 |
| コミットゲート | 提案されたアクションを適用するか拒否するかを決定するランタイムルール。提案者は第二の非公式なチャネルを持たない。 |
| Wise Computer Automation (WCA) | 提案と不可逆的な効果との境界においてコミットゲートを実装するソフトウェアリファレンス。 |
| Energy-First Architecture (EFA) | エネルギー述語を、後続のレポートのみではなく、許可レコード内に配置する設計上の選択。 |
| 提案 | 候補アクション `u`、状態、およびオプションの解析的エネルギーヒントからなる。コミットは行えない。 |
| 証明書 | ゲートレコード: LUT許可、エネルギー述語、オプションのCBF述語、理由、およびメトリクス。 |
| 拒否理由 | `lut_veto`、`energy_veto`、`cbf_veto`、`budget_exceeded`、または `policy` などの型付きコード。 |
| コミット決定 | プラントアクションを `u` またはゼロに設定するエンベロープ。 |
| ルックアップテーブル (LUT) | コンパクトなコードから許可または拒否への离散写像。 |
| 三値ルックアップ行列乗算器 (TLMM) | リファレンスにおける低コストな三値テーブルルックアップ提案パス。 |
| 制御バリア関数 (CBF) | その不等式が成立するときの集合不変性の証明書 (Ames et al., 2019)。 |
| Model Context Protocol (MCP) | ツール呼び出しトランスポート。本論文においては、プラント証明書ではなくテスト対象のアダプタとして位置づけられる。 |
| システムワン | ソフトウェア上で既知の選択肢の中から選択する型付き決定手続き (Laya / Jevクラス)。これらは提案者である。 |
| ポート・ハミルトニアン | トイプラントに対するパッシビティ型検証に用いられる構造化エネルギーモデル。 |
| ランタイム検証 (RV) | 実行中のトレースに対してプロパティを検査すること。コミットレコードと関連するが、同一ではない。 |
| 被試験デバイス (DUT) | 規定の負荷および規定のメータの下で計測されたハードウェア。セクション I.3.7 のKV260実行が、本論文における唯一のDUT計測である。 |
| フィールドプログラマブルゲートアレイ (FPGA) | 再構成可能なロジック。本論文では、Verilogシミュレーション、エネルギー未計測のAlchitry Pt V2へのプログラム、およびボードレベルのKV260メータ読み取り値 (セクション I.3.7) を報告する。 |
| WebAssembly (WASM) | ブラウザ向けのポータブルなコンパイルターゲット。Stage B WASM FPGAエミュレータは https://research.openie.dev/living/fpga-sim/ にて公開されている。 |
| WebGPU | そのエミュレータの表示およびグリッド評価パスとして指定されたブラウザGPU API。 |
| Alchitry Pt V2 | ベンダードキュメントはXilinx Artix-7 XC7A100Tを識別する。クローズドループコミットゲートをプログラム済み (SRAMロード) のFPGA; エネルギー未計測 (セクション I.3.7)。 |
| DiffLogic | ブール構造に向けて学習された微分可能論理ゲートネットワーク (Petersen et al., 2022)。 |
| 解析的エネルギー推定値 | 名前付き定数を用いた `J = sum_op count_op * E_op`。ボード電力ではない。 |
| モデル化 | 所定の数式または適合構造から得られる量。 |
| シミュレート | ソフトウェアまたは Verilog モデルを実行することで得られる量。 |
| ボード実測 | 所定のデバイスおよびワークロード上のメータから得られる量。このクラスに属するのは NI-9 の KV260 読み取り値のみである。 |
| オラクル安全 | 所定のプラントにおける連続エネルギーオラクル `Vdot <= epsilon` との一致。 |
| チェック安全 | ゲート内でそのオラクルを近似する離散 Safe 不動点および Q16.16 残差。 |
| 集合安全 | バリアまたはシールド述語（例えばエネルギー集合 CBF）のもとでの集合不変性であり、オラクル安全と一致しない場合がある。 |

<div id="terms-used-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i-terms-used-here" class="anchor-alias" aria-hidden="true"></div>

### I. 本稿で使用する用語

本論文はすでに3つの安全述語を区別している。**Oracle-safe**とは、連続的な `Vdot <= epsilon` オラクルを指す。**Check-safe**とは、ゲート内でそのオラクルを追跡する離散的なSafe Q16.16残差を指す。**Set-safe**とは、バリアまたはシールドの下での集合不変性を指す。NI-4は、check-safeとset-safeが不一致となりうることを示している。ソフトウェア参照は、本論文におけるすべてのシミュレーション結果を生成するRust実装である。証拠クラスは記法表において定義されている: モデル化、シミュレーション、ボード実測。ページフラグ `board_metered` は、KV260の測定値のみに基づいてtrueとなっている。

**解析定数。** `E_LUT_READ = 1e-12` Jおよびセクション I.3.4 に示されるその他のOpCounter定数は、本モデル内における相対比較のための工学的代替値である。これらはキャリブレーションされたボード実測値ではない。シリコン上のジュール値として解釈してはならない。指定されたオラクルに対するゼロ偽許可カウントは、報告された通りに維持される。

**リビング図。** コミットスタック: [/living/ni/#ni-diag-02](/living/ni/#ni-diag-02)。Seed-1ランナー: [/living/ni/#ni-run-01](/living/ni/#ni-run-01)。Safe偽許可=0: [/living/ni/#ni-run-02](/living/ni/#ni-run-02)。ステージBシミュレータ: [/living/fpga-sim/](/living/fpga-sim/)。

**パートIの範囲。** セクション I.2 は、コミット記録を記法研究、情報理論、スケーリング結果、LUTネットワーク、制御証明書、およびランタイム強制に対して位置づける。セクション I.3 は、対象オブジェクト、プラント、解析エネルギーモデル、ブラウザ計測器、およびボードを定義する。セクション I.4 は、ソフトウェア参照、ボード、または引用された外部ソースによって生成された量のみを報告する。セクション I.5 は、公刊された形式を持つ異議に回答する。セクション I.6 は、主張を反証しうる条件と、測定されなかった事項を述べる。

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>
<div id="i1-introduction" class="anchor-alias" aria-hidden="true"></div>

## I.1. はじめに

言語モデルは行動をランク付けできる。ランク付けは許可ではない。プラント、シェル、決済、または破壊的な実験ステップにおいて問題となる失敗モードはコミットである。すなわち、行動が実行されることだ。ソフトスコアは上流では依然として有用である。しかし、それらは不可逆的な分岐点において型が誤っている。なぜなら、確率はどの述語が失敗したかを示さず、アクチュエータコマンドをゼロに強制しないからである。

Lee (2022) は先行する主張を明確に述べている。記法は装飾ではない。ある演算を実行可能にする記法は、どのエラーが記述できてどのエラーが隠蔽されうるかを変える。Iverson (1980) は配列言語について同じ点を指摘した。記法は思考の道具である。Engelbart (1962) は言語、人工物、方法、および訓練を一つのシステムとして扱った。Kay (1972) および Victor (2013; 2012年講演) は、表現が編集中のアイデアの近くに結果を保持すべきであると論じた。Matuschak と Nielsen は、思考のためのツールがプロダクトとして停滞する理由を問うた。この文献群は認知とメディアに関するものである。それ自体は、機械が動作する前に従わなければならない記録を規定しない。

近年の人工知能の産業的中心はスケールである。Kaplan et al. (2020) および Hoffmann et al. (2022) はパラメータ、データ、および計算量に伴う損失スケーリングを報告している。Hooker (2021) は、アイデアが利用可能なハードウェアとカーネルに適合するときに普及すると論じている。これらの結果は、提案者の能力がそれに投じられるリソースとともにどのように成長するかを記述している。それらはコミット述語を定義しない。

本論文の貢献は、その述語に対するソフトウェアリファレンスと、そのリファレンスがトイプラント上で実際に何を行うかの報告である。この貢献は合成的である。ブールLUTシールド、エネルギー証明書、三値テーブルルックアップ、およびツールトランスポートはそれぞれ先行研究に存在する。本リファレンスはそれらを一つの監査可能な決定として結線する。すなわち、提案、次に証明書、次に型付きの拒否またはコミットである。主張はこのリファレンスの存在と挙動であり、優先権ではない。

三つの測定に関する記述が、以降のすべての数値を制約する。第一に、OpCounterによって計算されるジュールは解析的推定値である。第二に、Verilogの結果はシミュレーションである。第三に、ボード上のジュールは、セクション I.3.7 の KV260 ボードレベルの差分のみであり、メーター名を付して `measured_j` として記録されている。ボード結果フラグはそれらの KV260 実行のみに対して真である。Pt V2 は未計測のままである。読者は、数値に付属するメソッド節から、モデル化、シミュレーション、およびボード実測を区別できるべきである。

図 1. はコミットゲートを示す。

![フロー図：提案し、次に述語と証明書に対して認証し、その後世界に対して行動をコミットするか、行動なしに拒否する。両方の結果は、ハッシュ、ジュール、および理由を含む受領書を書き込む。](/figures/gates/commit-gate.svg)

*図 1. コミットゲート。セクション I.3 で定義された、提案、認証、コミットまたは拒否、および受領書の図。[PNG コピー](/figures/gates/commit-gate.png) が提供されている。*

<div id="i2-related-work" class="anchor-alias" aria-hidden="true"></div>

## I.2. 関連研究

<div id="21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>
<div id="i21-notation-and-tools-for-thought" class="anchor-alias" aria-hidden="true"></div>

### I.2.1 記法と思考のためのツール

Lee（2022）は、記法を発明することは追加の自動化ツールを発明することよりも重要である場合があると論じている。なぜなら、記法はコストの低い思考を変えるからである。The Gradientとのインタビュー記録はそのエッセイと整合しており、独立した実証的結果ではない。Iverson（1980）のチューリング賞講演は、古典的な計算機科学における命題を示している。すなわち、記法は思考のツールであり、実行可能性はその検証の一部をなすというものである。Engelbart（1962）は、知性を裸の脳ではなく、人間と人工物からなるシステムの中に位置づけている。Kay（1972）は、個人的な動的メディアを規定している。Victorの「Media for Thinking the Unthinkable」および「Inventing on Principle」は、創造者には、アイデアがまだ形成されている段階でその帰結が可視化される表現が必要であると論じている。MatuschakとNielsenの「How can we develop transformative tools for thought?」は、そのようなツールの普及と制度的な失敗様式を記録している。

本論文は、この系譜を用いて一つの限定的な推論を行う。記法が実行可能である場合、一部の失敗は表現されない偶発的事象としてではなく、通常のデータとなる。型付きの拒否理由はその一例である。これは、言語が思考を決定するという強いサピア＝ウォーフ仮説を支持するものではない。強い主張はセクション I.5 において否定される。弱い主張、すなわちIversonの主張は、実行可能な記法が操作のコストおよびエラーの表現可能性を変えるというものである。

Chollet（2019）は知性をスキル習得効率として定義し、その定義をアルゴリズム情報理論に基づかせている。この定義は新たなスキルの学習に関するものであり、コミットに関するものではない。

<div id="22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>
<div id="i22-information-description-length-and-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### I.2.2 情報、記述長、および物理的コスト

Shannon（1948）はエントロピーとチャネル容量を定義する。Shannon（1959）はレート歪み理論を定義する：所定の忠実度に対してどれだけの記述が必要かを示す。Kolmogorov（1965）はプログラムサイズによる記述長を定義する。Solomonoff（1964）はプログラム上の混合分布による帰納的推論を定義する。Chaitin（1977）はプログラムサイズ複雑性を発展させる。Cover and Thomas（2006）は教科書の基幹をなす。Jaynes（1957）は制約下の分布に対する規則として最大エントロピーを用いる。Brillouin（1956）はマクスウェルの悪魔の文脈において情報と物理的ネゲントロピーを結びつける。

言語モデルのクロスエントロピー学習は、データ分布に対する情報理論的目的関数である。Sutskeverによる2023年のSimons Institute講演は、論文ではなく講演であり、教師なし学習を圧縮として論じる。その事実は、特定の文字列に対するKolmogorov証明書をもたらすものではなく、コミットビットをもたらすものでもない。学習分布の統計的圧縮は、プラント制約下のランタイム許可集合と同一の対象ではない。

Landauer（1961）は下界を証明する：理想モデルにおいて、論理的に不可逆な消去は1ビットあたり少なくとも `kT ln 2` を散逸させる。Bennett（1973）は、論理的に可逆な計算が極限においてその消去コストを回避できることを示す。Horowitz（2014）は、演算およびメモリ移動に対してピコジュール規模の実用的なCMOSエネルギーを報告しており、これはLandauer限界をはるかに上回り、トランジスタ数ではなくエネルギーを制約として扱う。Mead（1990）はアナログ効率に関するニューロモーフィック論拠である。Sandberg（2016）は、脳の消費電力が約20ワットであることは、ゼロから学習された工学的システムのエネルギーを制限しないと警告する。皮質分割に関するプレプリント（arXiv:2102.06273）は、その生物学的電力のすべてを同等の計算量として扱うことに対してさらに警告する。本論文はLandauerおよびHorowitzを限界値および実用表として用いる。参照中のいかなるモデルも `kT ln 2` 近傍で動作すると主張するものではない。

<div id="23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-hardware-fit-and-price" class="anchor-alias" aria-hidden="true"></div>
<div id="i23-scale-and-hardware-fit" class="anchor-alias" aria-hidden="true"></div>

### I.2.3 スケールとハードウェア適合性

Hestness et al. (2017)、Kaplan et al. (2020)、およびHoffmann et al. (2022)は、深層学習の損失に関する経験的スケーリングを記録している。OpenAIのブログ投稿であるAmodei and Hernandez (2018)は、注目すべき成果に対する学習計算量の急速な増大を述べている。当該ページはベンダーによるエッセイである。本論文はそこに記載された特定の倍増時間に依存しない。Sutton (2019)は、計算を利用する汎用的な手法が、人間の知識の内容を固定的な特徴として符号化したシステムを凌駕してきたと論じている。当該エッセイはあらゆる制約に反対する議論ではない。コミット述語は行動に対する制約であり、手作りのチェス特徴ではない。Hooker (2021)は、チップおよびライブラリの導入済み基盤が密行列乗算を優遇することにより、代替手法がなぜ不利となるかを説明している。

本論文は正解完了までのジュール数によって順位付けを行い、提案コストと許可コストを分離する。価格はいずれの項にも含まれない。

<div id="24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>
<div id="i24-lut-networks-ternary-lookup-and-differentiable-logic" class="anchor-alias" aria-hidden="true"></div>

### I.2.4 `LUT6` ネットワーク、三値ルックアップ、および微分可能論理

Umuroglu et al. (2020) はスパースな低ビットネットワークをFPGAのルックアップテーブルにマッピングした (LogicNets)。Petersen et al. (2022) は微分可能な緩和を用いて論理ゲートのネットワークを学習した (DiffLogic)。Bacellar et al. (2024) はLUTの重みなしネットワークを学習した (微分可能重みなしニューラルネットワーク)。Ma et al. (2024) は三値重み言語モデルを研究した (BitNet b1.58)。Wei et al. (2024) はCPU上でのテーブル参照による低ビット行列乗算を実装した (T-MAC)。TeLLMeライン (arXiv:2504.16266) はFPGA実行を目的とした三値LUT行列乗算設計である。これらのシステムは、テーブルとゲートが実用的な計算基盤であることを示している。ただし、引用された論文においては、ポート・ハミルトニアンエネルギー拒否権および型付きコミットエンベロープをツールエグゼキュータに付与するものではない。

当該参照はDiffLogicをトイ特徴量上の薄い許可テーブルとして、またTLMMを提案パスとして用いている。これは、論理ネットワーク全体を分類器として使用するという通常のDiffLogic評価 (視覚ベンチマーク、大規模ゲート数) とは異なる役割である。セクション I.6 にその容量ギャップを記録する。

<div id="25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>
<div id="i25-certificates-shields-and-runtime-monitoring" class="anchor-alias" aria-hidden="true"></div>

### I.2.5 証明書、シールド、および実行時監視

Ames et al. (2019) は、集合不変性の証明書として制御バリア関数を調査し、通常はフィルタまたは二次計画法によって強制されることを示している。Alshiekh et al. (2018 プレプリント arXiv:1708.08611) は、安全でない行動を安全な行動で置き換えるシールドを導入しており、可能な限り最小限の変更にとどめる。Dawson、Gao、および Fan (2022) は、学習済みリャプノフ証明書およびバリア証明書と、ニューラルネットワークを検証なしに証明書として扱う場合の失敗モードを調査している。Manek と Kolter (2020) は、リャプノフ構造を持つ安定なダイナミクスを学習する。Greydanus、Dzamba、および Yosinski (2019) は、ハミルトニアンニューラルネットワークを学習する。Roth et al. (2025) は、安定なポート・ハミルトニアンニューラルネットワークを研究している。Yu、Zikelic、および Henzinger (2024) は、実行時モニタを用いてニューラル証明書を修復する。Leung と Paré (arXiv:2512.24493) は、学習済みエネルギー関数を持つポート・ハミルトニアンシステムに対するベイズ的安全保証を与えている。彼らのエネルギーとは、プラントの物理的ハミルトニアンである。それは計算のエネルギーではない。本参考文献の Safe パスは、エネルギーをその同じ物理的意味において用いている。計算のジュールは別個の勘定である (Section I.3.4)。Sanchez et al. (2018) は、実行時検証の分類体系を調査している。

**ゲートはシンプレックスである。** Sha のシンプレックスアーキテクチャは、未検証の高性能コントローラと検証済み安全コントローラを並置して動作させ、プラントが回復可能な領域を逸脱する前に、決定モジュールが制御を安全コントローラへ引き渡す (Sha 2001)。「提案はそれ自身を承認してはならない」というルールは、制御ループからツール呼び出しおよびアクチュエータへと引き継がれたものである。実行時保証 (runtime assurance) とは、航空電子工学およびロボティクスにおけるその名称である。三つの古典的な結果が、この形状の残りの部分を確定させる。Saltzer と Schroeder は完全な仲介 (complete mediation) を命名した。すなわち、すべてのアクセスは毎回権限に照らして検査される (1975)。参照モニタ (reference monitor) は、その検査を行う機構である。Gray の二相コミット (two-phase commit) は準備とコミットを分離し、いかなる参加者も単独でコミットできないようにする (1978)。Necula の証明付きコード (proof-carrying code) は、信頼されていないコードが実行される前にホストが検査する証明を付帯させる (1997)。ここでのコミットレコードは、不可逆的な作用の前に置かれた参照モニタであり、拒否へのシンプレックス切り替えと、証明付きコードと同様にホストが検査する証明書を備えている。本参考文献がその系譜に加えるものは、一つの連言項と一つの台帳である。すなわち、証明書内部のエネルギー述語と、決定と同一レコード上のジュールである。

本参考文献はその数学を置き換えるものではない。Safe パスは、振り子上の既知のエネルギー恒等式 `V = (1/2)(g theta^2 + omega^2)` および `Vdot = omega * u` に対する保守的な不動点テストである。おもちゃの比較実験で用いられる CBF は、同じ `V` に対するエネルギー集合不等式であり、マニピュレータ上で Ames の二次計画法を解いたという主張ではない。カートポール上での学習済みリャプノフ構造は第二のおもちゃの例であり、Section I.4 で報告されているが、任意のプラントに対する吸引領域定理ではない。

<div id="26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>
<div id="i26-world-models-typed-decisions-and-tool-transport" class="anchor-alias" aria-hidden="true"></div>

### I.2.6 世界モデル、型付き決定、およびツール転送

Ha と Schmidhuber (2018)、および Hafner ら (DreamerV3、arXiv:2301.04104) は、学習済みモデルが想像上の軌跡から行動を提案できることを示している。LeCun の JEPA に関するエッセイ (Meta research blog) は、予測的世界モデルの必要性を論じている。LeCun ら (2006) は、それ以前のエネルギーベース学習に関するチュートリアルである。これらのシステムにおいて、予測誤差は恒等的にゼロではない。予測器はゲートの上流に配置することができる。予測が完全であり、かつプラントモデルがプラントそのものである場合を除き、予測器はゲートを置き換えることはできない。本論文は、予測ベンチマークにおいてこれらのシステムと競合するものではない。

システム・ワン・モデルは、1 回の順伝播で、許容される各選択肢に対して型付きの回答と確率を返し、自由形式のテキストを生成しない。TypeSafe AI は、自社のホスト型 Jev モデル (2026 年 9 月 15 日) によってこのカテゴリに名称を付与した。オープンモデルもこれに続き、その中には Convai Innovations による決定ヘッド付きエンコーダである Laya が含まれる。選択肢集合が型付きかつ既知である場合、これらのモデルは生成コストを削減する。Anthropic の Model Context Protocol に関するアナウンスメントは、ツールのディスカバリとトランスポートを規定している。トランスポートは呼び出しを配送するが、`Vdot` を評価するものではない。参照実装の MCP アダプタにおいて、不可逆的なツールはエグゼキュータが実行される前に証明書を必要とする。これは本アダプタに関するエンジニアリング上の主張であり、セクション I.4 のデモによって検証されるものであって、本番環境におけるすべての MCP サーバに関する主張ではない。

<div id="27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>
<div id="i27-what-the-composition-adds" class="anchor-alias" aria-hidden="true"></div>

### I.2.7 合成が加えるもの

シールドは安全でない行動を拒否するが、引用論文においては、分析的ジュール勘定を伴う参照文献の4フィールドコミットレコードとしてエクスポートされるものではない。DiffLogicおよびLUTネットワークは関数を計算する。それらは当該論文において、独立したプロポーザーとツール実行器の前に置かれる拒否権、あるいはツール実行器そのものではない。エネルギー認識バリアフィルタは連続的である。参照文献のアローウビットはテーブルである。構成的主張は配線にある: LUTアロービットとエネルギー述語および任意のバリアを組み合わせ、型付き理由とともに記録し、不可逆的な効果の前に適用し、分析的エネルギーをボード電力と明確に区別して保持する。セクション I.4 は、その配線のどの部分が実行されたかを述べる。

<div id="28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-20252026" class="anchor-alias" aria-hidden="true"></div>
<div id="i28-certify--commit-peers-2025-to-2026" class="anchor-alias" aria-hidden="true"></div>

### I.2.8 認証・コミット・ピア (2025年から2026年)

近年のいくつかのシステムは、不可逆的なツールが実行される前に意思決定を強制する。

Shi らの **Progent**（arXiv:[2504.11703](https://arxiv.org/abs/2504.11703)）は、すべてのツール呼び出しをシンボリックな最小権限規則と照合し、SMT ソルバーを用いることで、承認なしには権限が縮小する方向にしか変化しないことを保証する（単調閉じ込め）。Chen、Kang、および Li による **ShieldAgent**（ICML 2025; [proceedings.mlr.press/v267/chen25ae.html](https://proceedings.mlr.press/v267/chen25ae.html)）は、シールド適用前にエージェントの行動軌跡に対して検証可能な安全ポリシー回路を強制する。Yu、Žikelić、および Henzinger（AAAI 2025; [doi:10.1609/aaai.v39i25.34840](https://doi.org/10.1609/aaai.v39i25.34840)）は、実行時モニタリングによってニューラル証明書を修復する。関連する研究系列として、先読み領域上でオンラインに ReLU 制御バリア証明書を検証する手法がある（arXiv:[2507.11987](https://arxiv.org/abs/2507.11987)）。

**第 I 部が追加するもの。** 上記の先行研究は、ポリシー、シールド、あるいは証明書修復のオブジェクトである。本リファレンスは、4 フィールドのコミットエンベロープ（`proposal` → `certificate` → `commit|refuse` → 受領）を提供し、連言 LUT 許可ビットとエネルギー述語、型付けされた拒否理由、および解析的ジュール値をボード電力とは明確に区別して保持する。トランスポート（MCP）は提案のままである。ボードジュール値は、第 I.3.7 節における KV260 の実行においてのみ、ボードレベルで存在する。

<div id="i29-runtime-enforcement" class="anchor-alias" aria-hidden="true"></div>

### I.2.9 実行時強制

ゲートはセキュリティオートマトンである。Schneiderは、実行モニタが安全性質を正確に強制することを示し [Schneider 2000](https://doi.org/10.1145/353323.353382)、Ligatti、BauerおよびWalkerは、アクションを抑制または挿入する編集オートマトンへとモニタを拡張した [Ligatti et al. 2005](https://doi.org/10.1007/s10207-004-0046-8)。Falconeは、検証するのではなくいつ強制すべきかを論じ [Falcone 2010](https://doi.org/10.1007/978-3-642-16612-9_9)、Bauer、LeuketおよびSchallhartは実行時判定に三値を与えた [Bauer et al. 2011](https://doi.org/10.1145/2000799.2000800)。この三値は、許可・拒否・`settle_refuse` にそれぞれ対応する。本論文がこの系譜に加えるのは、証明書および受領書におけるエネルギー述語である。2024年から2026年にかけてのエージェントガードは同一の形状を持ち、提案されたツール呼び出しとその効果との間の検査として構成される: GuardAgent [arXiv:2406.09187](https://arxiv.org/abs/2406.09187) および AgentSpec [arXiv:2503.18666](https://arxiv.org/abs/2503.18666)。PolicyGuideは、各アクションへの検査では多段階ワークフローを誘導できないと論じており [arXiv:2608.19861](https://arxiv.org/abs/2608.19861)、これが第II部においてタスク述語 $C(z)$ に停止条件を置く理由であり、個々のアクションに置くのではない。多段階の不可逆的作業には補償も必要であり、それをサガが提供する [Garcia-Molina and Salem 1987](https://doi.org/10.1145/38713.38742)。また、「提案はそれ自身を認可できない」という原則は、seL4 のようなケイパビリティカーネルが証明によって強制する参照モニタ原則である [Klein et al. 2009](https://doi.org/10.1145/1629575.1629596)。第I.4節における偽陽性許可ゼロのスキャンは、証明ではなくグリッド上のテストである。第I.6節はその限界を明示しており、この限界は結果のあらゆる要約に適用される。

<div id="i210-reference-points-for-the-board-figure" class="anchor-alias" aria-hidden="true"></div>

### I.2.10 ボード図の参照点

FPGAによる関数の実装は、ASICと比較してより多くのエネルギーを消費することが予想される。KuonとRoseは動的電力差を実測しており [Kuon and Rose 2007](https://doi.org/10.1109/TCAD.2006.884574)、Horowitzはそのようなデータを位置づけるための演算あたりのCMOSエネルギーを示している [Horowitz 2014](https://doi.org/10.1109/ISSCC.2014.6757323)。同一ビットストリームに対するベンダーの電力推定値をSOM読み取り値と並べて記録することは、PLレール計測プロトコルの一部をなす。

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>
<div id="i3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## I.3. 定義と手法

<div id="31-objects" class="anchor-alias" aria-hidden="true"></div>
<div id="i31-objects" class="anchor-alias" aria-hidden="true"></div>

### I.3.1 オブジェクト

状態 `x` と集合 `U` の候補アクション `u` を固定する。提案は次のタプルである

```text
Proposal = (u, x, hints)
```

`hints` には解析的エネルギー量が含まれることがある。提案は許可としての解釈を持たない。

証明書は次のタプルである

```text
Certificate = (lut_allow, energy_ok, cbf_ok, reasons, metrics)
```

`lut_allow` と `energy_ok` はブール値である。`cbf_ok` は選択された compose モードがそれを必要とする場合にブール値となり、そうでなければ存在しない。`reasons` は拒否理由のリストである。`metrics` には解析的エネルギーアカウントと board-result フラグが含まれる。

スキーマ README に記載された compose モードは次のとおりである

```text
lut_and_energy        : commit <=> lut_allow AND energy_ok
lut_and_safe          : commit <=> lut_allow AND safe_energy_ok
lut_and_safe_and_cbf  : commit <=> lut_allow AND safe_energy_ok AND cbf_ok
```

`energy_only` と `lut_only` のアブレーションが存在し、比較により一方の連言を除去できる。これらは不可逆ツールのデフォルトではない。

コミット決定は

```text
if commit then plant_action = u else plant_action = 0
```

であり、証明書が添付される。不可逆ツールの実行者は最初の分岐でのみ呼び出される。

作業記録。ファイル `artifacts/schemas/wca.commit.v1/examples/commit_decision_refuse.json` は、`lut_allow` が true で `energy_ok` が false の拒否を格納している。理由コードは `energy_veto` である。固定点詳細文字列は `Vdot_q=1461 > eps_q=13` である。`plant_action` は `[0.0]` である。記録は board-result フラグを false に設定する。真の連言が一つだけではコミットされない。

<div id="32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>
<div id="i32-plants-and-oracles" class="anchor-alias" aria-hidden="true"></div>

### I.3.2 プラントとオラクル

主要なプラントは振り子である。Safeチェックが使用する連続参照量は `g = 9.81`、`epsilon = 0.05`、`V = (1/2)(g theta^2 + omega^2)`、および `Vdot = omega * u` である。連続オラクルにおける `energy_ok` は `Vdot <= epsilon` を意味する。

レガシー離散チェックはQ8.8固定小数点近似であり、シミュレーション内のVerilogモジュール `wca_ph_energy.v` にビット単位で一致している。Safeチェック（`SafeFixedPointPHCertificate`）はQ16.16と厳密な整数残差を使用する。報告される述語は

```text
energy_ok <=> 4*omega_q*u_q + 2*(abs(omega_q)+abs(u_q)) + 1
              <= floor(4*epsilon*S^2)
```

であり、丸め引数は `artifacts/RESULTS.md` に記載されている。最下位ビットの半分以下の誤差を持つ最近接丸めのもとで、`Vdot` は `(prod + (1/2) abs + 1/4) / S^2` によって上界される。設計目標は片側である。Safeの述語が許可する場合、連続オラクルも許可する。逆は要求されない。余分な拒否は測定されたコストであり、安全方向の矛盾ではない。

第二のプラントであるカートポールは、学習済みリャプノフシミュレーションにおいてのみ使用される。状態は `[x, xdot, theta, thetadot]` であり、`g = 9.81`、カート質量1.0、ポール質量0.1、長さ0.5である。`V` は `xi^T P xi / 2` の二次形式であり、`P` はコレスキー構成に単位行列の定数倍を加えることにより正定値となる。フィッティングは、線形方策のもとで `Vdot + alpha V` のヒンジに対する確率的勾配降下法により行われ、シード42、400イテレーション、バッチサイズ32、`alpha = 0.15` であり、`RESULTS.md` に記録されている。連続ゲートは `Vdot <= 0.05` である。Safe離散規則はリプシッツマージンに最下位ビットの半分を乗じた値を加える。これは一つのボックス上における一つのフィッティング済み二次形式のシミュレーションである。他のプラントに対する証明ではない。

<div id="33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>
<div id="i33-lut-allow-and-proposal-path" class="anchor-alias" aria-hidden="true"></div>

### I.3.3 `LUT6` 許可および提案パス

報告されたエピソードにおける許可 LUT は、絶対シータ、絶対オメガ、絶対 `u`、およびエネルギービットの4特徴量に対してマスク `21887` を適用した DiffLogic エクスポートである（各節に別段の記載がある場合を除く）。TLMM は提案器として用いられるグループ化三値テーブルルックアップである。等正確性（Iso-correctness）とは、絶対許容誤差 1e-12 以内でナイーブな三値行列積と一致することを意味し、`RESULTS.md` はこれをソフトウェア上で測定した値として記録する。スケール挙動とは、`wca-tlmm-scale` が所定の解析的順伝播バジェットのもとで書き出す値である。結果において議論されるデフォルトバジェットは、順伝播あたり 2e-10 ジュールであり、解析的な値であって電気的な値ではない。

<div id="34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>
<div id="i34-analytical-energy-model" class="anchor-alias" aria-hidden="true"></div>

### I.3.4 解析的エネルギーモデル

`RESULTS.md` は二つの事実を分離している。演算カウントは OpCounter において厳密である。ジュールはカウントに定数を乗じたものである:

| 定数 | 値（ジュール） | 役割 |
|----------|----------------|------|
| `E_LUT_READ` | 1e-12 | LUT 読み出し |
| `E_BRAM_WORD` | 1e-11 | BRAM ワード |
| `E_BITMASK_OP` | 5e-14 | ビットマスク演算 |
| `E_ADD` | 5e-13 | 加算 |
| `E_PACK` | 2e-13 | パック |
| `E_COMMIT_BASE` | 2e-11 | コミットオーバーヘッド |
| `E_REFUSE_OVERHEAD` | 5e-12 | 拒否オーバーヘッド |

`J = sum count_op * E_op`。これらの定数は工学的な代替値であり、実測値ではない。共有 BRAM ヒットなどの構造カウンタは報告されるが、カウント済み読み出しを変化させない限り課金されない。定数を変更すると、すべての解析的ジュール値が連動して再スケーリングされる。これが、これらの数値をベンダーのトークン毎ジュール、MLPerf Tiny エネルギー、またはレール計測値と比較できない理由である。同一モデル内のモード間での比較は可能である。

内部テーブルにおけるユーティリティはコミットカウントである。コミットカウントはタスク報酬ではない。より多くコミットするポリシーは、エネルギーオラクルに違反しながらも、ジュール当たりのユーティリティにおいてより高いスコアを得る可能性がある。したがって、セクション I.4 ではジュール当たりのユーティリティを安全性指標として扱わない。

<div id="35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>
<div id="i35-tool-adapter" class="anchor-alias" aria-hidden="true"></div>

### I.3.5 ツール・アダプタ

`wca-mcp-gate` はツールを分類する。読み取り専用ツールはコミットレコードなしで実行できる。未知のツールは不可逆として扱われる。不可逆ツールは、設定されたコンポーズモード（デフォルトは `artifacts/mcp_gate_demo.json` における `lut_and_safe_and_cbf`）のもとで証明書を必要とする。拒否時には `executed` が false となり、`executor_calls` は 0 となる。デモエグゼキュータはコールを記録し、ホストの入出力は行わない。デモファイル内のメソッド文字列は `rust_mcp_commit_gate_v1` である。

<div id="36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>
<div id="i36-simulation-of-verilog" class="anchor-alias" aria-hidden="true"></div>

### I.3.6 Verilog のシミュレーション

リポジトリは、許可LUTおよびコミットゲート（`artifacts/fpga/`）向けにVerilogおよびメモリイメージを出力する。`wca-rtl-verify`およびIcarus Verilogは、それらのモデルのビット完全な動作をソフトウェアオラクルと照合して検証する。Icarusはシミュレーションを実行する。チップの配置、配線、または計測は行わない。Vivadoのレポートは、セクション I.3.7 のKV260実行に限り、利用率およびタイミングクロージャとして参照される。Vivadoの消費電力推定値は結果ではない。

<div id="37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>
<div id="i37-browser-instrument-and-boards" class="anchor-alias" aria-hidden="true"></div>

### I.3.7 ブラウザ計測器とボード

複製のための完全性パスには三つの段階がある。段階 A と段階 B が存在する。段階 C には二つのボードがある: 一つは決定合意のため、もう一つはジュール計測のためである。

段階 A、現在。`wca-commit` の Rust バイナリがエピソード、Safe チェック、ツールデモ、および解析的ジュール計算を実行する。Icarus はワークステーション上で出力された Verilog をシミュレートする。

段階 B、出荷済み。純粋な決定コア（提案入力、証明書出力、プラントステップ、解析的ジュール更新）は `wasm32`（`crates/wca-fpga-sim`）にコンパイルされる。https://research.openie.dev/living/fpga-sim/ の静的ページがモジュールを読み込む。WebGPU は LUT ワードと `(step, lut_allow, energy_ok, cbf_ok, decision)` のトレースバッファを表示用に保持する。WebGPU タイムスタンプはジュールではない。シード 1（16 ステップ、theta 1.5、omega 3.0）において、WASM エピソードはコミット 1、拒否 15、解析的ジュール 8.6795e-10 を報告し、段階 A と一致する。WASM モジュールは Rust クレートが実行する同一関数のエミュレーションである。Artix-7 のサイクル精度モデルではなく、スイッチング活性電力モデルでもなく、Verilog に対する Icarus の代替でもない。段階 B は Alchitry Pt V2 DUT を主張しない。

段階 C、ボードプログラム済み、エネルギー未計測。Alchitry Pt V2 が検出され、クローズドループ WCA コミットゲートビットストリームで（SRAM に）ロードされた: オンファブリックのシード 1 振り子プラントダイナミクス、TLMM 提案、allow LUT、Safe Q16.16 ポートハミルトニアン残差、および Ames スタイルのエネルギーセット制御バリア関数（CBF）残差。ファブリックコミットは `lut_allow ∧ energy_ok ∧ cbf_ok` である。115200 8N1 の UART は allow/refuse/commit（コミット 1、拒否 15、ステップ 6 での唯一のコミット）についてソフトウェア複合ゴールデンと合意した。そのシード 1 クローズドループエピソードにおいて、CBF 連言は LUT および Safe PH のみと比較して allow/refuse トレースを変化させなかった（唯一の PH コミットは u=0 であるため、CBF Lie チェックが成立する）。ここでの**クローズドループ**とは、プラント状態がファブリック上のゲートコミットおよび拒否から発展することを意味し、プラント/提案状態のストリーミング刺激 ROM ではない。Pt V2 には**オンボードジュールメーターが存在しない**。USB インラインメーターもシャントも接続されていない。Vivado / post-PAR 電力推定値は DUT の読み取り値ではない。SparkFun の製品ページは FPGA XC7A100T-2FGG84I を記載し、論理セル 101,440 個、DSP48E1 スライス 240 個、ブロック RAM 4,860 Kb、DDR3L 256 MB を列挙している（<https://www.sparkfun.com/alchitry-pt-v2.html>）; これらはベンダー仕様のままである。ビルダー計測方法: [/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy)。

ステージ C、ボード計測。AMD Kria KV260 はオンボード INA260 電力モニタ (`ina260_u14`) を搭載している。2026 年 9 月 30 日に 3 つのラングが実行され、それぞれ N = 4、整定 15 秒、約 4 Hz でのサンプリング 25 秒による A/B/A インターリーブパスとして実施された。ラング 1 は自由動作シードファブリック (439 LUT) をボードのベースラインビットストリームと比較する。ワット値のみを与え、演算カウントを持たないため、演算あたりのジュール値は得られない。ラング 2 はオンデバイス演算カウンタのもとで 1 つのシードビットストリーム (975 LUT) を約 100 MHz で停止・動作させる。差分は +0.0098 W (標準誤差 0.0031 W) であり、これはシードサイクルあたり 98.0 pJ (標準誤差 30.8 pJ) に相当する。ラング 3 はゲートビットストリームを停止・動作させる。すなわち、8 レーン、各レーンが allow LUT、Safe Q16.16 エネルギー残差、およびバリア残差の論理積であり、6,370 LUT と 128 DSP スライスを使用し、25 MHz でタイミングクローズされている。差分は +0.2857 W (標準誤差 0.0032 W) である。毎秒 2.4999 × 10⁷ ゲートサイクルにおいて、これはゲートサイクルあたり 11,428 pJ (標準誤差 129 pJ)、レーン判定あたり約 1.43 nJ に相当する。A2 マイナス A1 のドリフトは +0.0047 W (標準誤差 0.0040 W) であった。ビットストリームハッシュおよびログは参照先の `wca-kv260-meter` アーティファクトに収録されている。

メータが観測できるものとできないもの。INA260 は最大オフセット 5 mA、最大システムゲイン誤差 0.15%、電流ステップ 1.25 mA を仕様として規定している (TI INA260 データシート)。オフセットは同一ボード・同一レール上の A と B に共通であるため、停止対動作の差分によってキャンセルされる。ゲイン誤差は差分を最大 0.15% スケーリングする。メータはボード電力を検出するため、差分にはゲートロジック単体ではなく、イネーブルによってスイッチングされるクロックツリーおよびルーティングが含まれる。ラング 2 の差分はゼロから約 3 標準誤差の距離にある。ラング 3 のそれは約 90 である。次のプロトコルは確定している。すなわち、モジュールのレギュレータテレメトリまたはソース・メジャーユニットを通じてコアレール (VCCINT) を読み取ること、少なくとも 30 組のランダム化インターリーブ A/B ペアを用いること、ブロックあたり少なくとも 10⁹ 回のゲート評価を行うこと、各ブロック前にアイドルベースラインとともにダイ温度を記録すること、グロス値と減算値の両方を報告すること、Vivado 電力推定値を読み取り値と差異とともに並記して報告することである。ラング 3 は閉ループプラントのジュールコストではなく、セクション I.3.4 の解析定数はこれによって較正されるものではない。

ステージ B の科学的意義は、新たな物理的主張ではなく、複製と検査にある。ブラウザを持つ読者は同一のシード 1 エピソードをステップ実行し、クレートが出力するものと同一の allow ビットおよび理由コードを読み取ることができる。ステージ A との一致がステージ B の受け入れ試験であり、シード 1 においてこれは合格する。判定の一致が Pt V2 の受け入れ試験であり、シード 1 においてこれも合格する。所定のワークロードにおけるメータ読み取り値が KV260 の受け入れ試験であり、ラング 2 およびラング 3 はボードレベルでこれを満たす。

<div id="38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>
<div id="i38-what-is-not-a-method-of-this-paper" class="anchor-alias" aria-hidden="true"></div>

### I.3.8 本論文の手法に含まれないもの

人間被験者研究は行わない。言語相対性に関する主張は、セクション I.5 における否定を超えない。学習計算量の外挿は行わない。経済的飽和点の同定は行わない。Groq、Etched、または Taalas のスループットに対する最適化は行わない。世界モデルベンチマークは行わない。

<div id="4-results" class="anchor-alias" aria-hidden="true"></div>
<div id="i4-results" class="anchor-alias" aria-hidden="true"></div>

## I.4. 結果

本節におけるすべての量は、文中に外部論文の引用がない限り、ソフトウェアリファレンスにおいてシミュレートされたものである。解析的ジュールはセクション I.3.4 を使用する。NI-9 のみがボード実測値である。

<div id="41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>
<div id="i41-claim-ni-1-the-commit-record-exists-as-a-schema-and-a-rust-type" class="anchor-alias" aria-hidden="true"></div>

### I.4.1 主張 NI-1. コミット・レコードはスキーマおよび Rust 型として存在する

スキーマ `Proposal`、`Certificate`、`RefuseReason`、および `CommitDecision` は `artifacts/schemas/wca.commit.v1/` に収録されている。Rust 型は `crates/wca-commit/src/schema.rs` に定義されている。ラウンドトリップテストは `cargo test -p wca-commit` で実行する。これはリファレンス、バージョン `wca.commit.v1` に関する存在結果であり、一意性定理ではない。

<div id="42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>
<div id="i42-claim-ni-2-seed-1-pendulum-episode" class="anchor-alias" aria-hidden="true"></div>

### I.4.2 主張 NI-2. シード1振り子エピソード

`RESULTS.md` より、コマンド:

```text
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
```

報告された結果: committed = 1、refused = 15、分析エピソードエネルギー = 8.6795e-10 ジュール。同一シードにおける `--safe-ph` についても、committed および refused の件数ならびに分析エネルギーは同一の値が報告されている。`RESULTS.md` には、単一のコミットはステップ 6 であると記載されている。同ファイルにおけるツールチェーンの注記: Rust 1.98。バイナリを再実行することが再現手順である。このエネルギーはチップの計測値ではない。

<div id="43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>
<div id="i43-claim-ni-3-false-allows-of-the-safe-energy-check" class="anchor-alias" aria-hidden="true"></div>

### I.4.3 主張 NI-3. 安全エネルギー・チェックの誤許可

`wca-ph-tighten` は、離散的な決定を連続オラクル `Vdot <= epsilon` と比較する。21の3乗グリッドに200,000件の閾値近傍モンテカルロサンプルを加えた計209,261件の決定について、結果は以下のとおりである。

| パス | 誤許可 | 誤拒否 | 両者許可 | 両者拒否 |
|------|--------|--------|----------|----------|
| Legacy Q8.8 | 30836 | 105 | 104711 | 73609 |
| Safe v1 (Q8.8 過大近似) | 0 | 42430 | 62386 | 104445 |
| Safe v2 (Q16.16 残差) | 0 | 79 | 104737 | 104445 |

`RESULTS.md` にはさらに、41の3乗グリッドに50,000件のモンテカルロサンプルを加えたより高密度な条件下で `cargo test` により検証した結果、誤許可が0であることがアサートされると記載されている。Safe v2 は、誤許可を0に保ちつつ、Safe v1 に対して誤拒否を42,430件から79件へと削減する。Legacy Q8.8 はこの定義においては安全でなく、30,836件の誤許可を記録する。これらの計数値は数値テストの性質であり、物理的な振り子の性質ではない。

<div id="44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>
<div id="i44-claim-ni-4-toy-barrier-comparison-neither-definition-dominates" class="anchor-alias" aria-hidden="true"></div>

### I.4.4 主張 NI-4. トイ・バリア比較、いずれの定義も支配しない

`wca-cbf-bakeoff` はシード 0 から 4、40 ステップ、時間刻み 0.05、行動スケール 2.5、共有デモ TLMM および DiffLogic マスク `21887` で実行される。エネルギー集合バリアは `h = 18 - V` を用い、`h >= 0` かつ `omega * u <= kappa * h`（`kappa = 0.05`）のとき許可する。離散シールドは、絶対値でシータが最大 2、絶対値でオメガが最大 4 の範囲内に留まるステップを許可する。閉ループ平均値は軌道が発散するため異なる。ファイルはコミットのエピソードごとの平均値と違反カウントの総和を報告する。選択された行を以下に示す:

| フィルタ | コミット | 拒否 | 解析的 J | PH に対する誤許可 | `h < 0` | `Vdot > epsilon` |
|--------|--------|--------|--------------|-------------------|---------|------------------|
| `lut_and_safe_ph` | 1 | 38 | 2.153e-09 | 0 | 4 | 0 |
| `cbf_energy_set` | 1 | 38 | 2.056e-09 | 3 | 0 | 3 |
| `shield_discrete` | 18 | 21 | 2.306e-09 | 90 | 38 | 90 |
| `lut_only` | 40 | 0 | 2.544e-09 | 194 | 220 | 194 |

このプラントおよびこのオラクルにおいて、`lut_and_safe_ph` は `Vdot` 違反がゼロであり、`h < 0` イベントが 4 件発生する。エネルギー集合バリアは `h < 0` イベントがゼロであり、`Vdot` 違反が 3 件発生する。シールドはコミット数が多く、エネルギーオラクルに対して頻繁に違反する。`lut_only` は報告されたテーブルにおける違反数で `always_allow` と一致する。200 ステップの共有常時許可ストリームに対するオフライン一致検証では、`lut_and_safe_ph` と `cbf_energy_set` の間に 4 件の不一致が生じ、シールドに対しては 70 件の不一致が生じる。

テスト内の解釈: 受動性と集合不変性は異なる述語である。LUT-エネルギーゲートは Ames フィルタと等価ではなく、すべての列で優位に立つわけでもない。より豊富なプラントに対する完全な二次計画ベースラインはこのテーブルには含まれていない。その比較は未解決のままである。得られた結果は不一致であり、これは二つの証明書を一つの言葉に集約することに対する反証となる。

<div id="45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>
<div id="i45-claim-ni-5-cart-pole-safe-lyapunov-simulation" class="anchor-alias" aria-hidden="true"></div>

### I.4.5 主張 NI-5. カート・ポール安全リャプノフ・シミュレーション

第I.3.2節で説明した監査（グリッド n = 7 に境界サンプル20,000点をLipschitzボックス内に加えた計26,487件の決定）において、安全学習Lyapunov対連続 `Vdot` オラクルの記録は、誤許可0件、誤拒否3件、両者許可15,925件、両者拒否10,559件であった。5シードにわたるクローズドループ平均: `lut_and_safe_lyap` はコミット11件、拒否28件、解析的J 2.719e-09であり、当該オラクルに対して誤許可ゼロを記録する。同一 `V` 上のレベル集合バリアはコミット14件、エネルギーオラクル違反15件を記録する。離散シールドはコミット29件、違反95件を記録する。振り子と同一のパターンである: 安全連言子は自身のオラクルを追跡し、異なる証明書は異なるオラクルを追跡する。オラクルなしの許容性は安全性ではない。

これは追加のシミュレーション制御対象の1例である。産業ダイナミクスにおけるコミットゲートを確立するものではない。

<div id="46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>
<div id="i46-claim-ni-6-mcp-demo" class="anchor-alias" aria-hidden="true"></div>

### I.4.6 主張 NI-6. `MCP` デモ

`artifacts/mcp_gate_demo.json` には4つのケースが記録されている。ファイル内のboard-resultフラグはfalseである。

| ケース | クラス | 実行済み | エグゼキュータ呼び出し | コミット |
|------|-------|----------|----------------|--------|
| `read_only_bypass` | read-only | true | (コミット記録なし) | 不在 |
| `irreversible_refuse` | irreversible | false | 0 | false |
| `irreversible_allow` | irreversible | true | 1 | true |
| `shell_exec_gated` | irreversible | true | (ゲート済み) | true |

refuseケースには `energy_veto`（`eps` 0.05 に対して `vdot` 6.0）および `cbf_veto` が列挙されている。当該ケースにおけるプラント動作は `[0.0]` である。allowケースはコンポーズ `lut_and_safe_and_cbf` およびプラント動作 `[-0.02]` を使用する。ファイル内の注記には、refuseは決して実行されないと記されている。これはアダプタのデモであり、コンピュータ使用エージェントのフィールド研究ではない。

<div id="47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>
<div id="i47-claim-ni-7-tlmm-under-an-analytical-budget" class="anchor-alias" aria-hidden="true"></div>

### I.4.7 主張 NI-7. 解析的予算下における `TLMM`

`RESULTS.md` は、順方向バジェット以内において、解析的ジュール値 4.24e-11 付近で 2×4・グループ 2 構成のデモを報告している。2e-10 の順方向バジェット以内に収まる最大構成はパラメータ数 64 で頭打ちとなる。幅 8×16 以上の構成は、オプティマイザ適用後もそのバジェットを超過する。単純三値演算に対するアイソ正確性は、許容誤差 1e-12 におけるソフトウェア比較である。これらの記述は、当該設計が TeLLMe のスループットまたは任意のボードエネルギーと一致することを示すものではない。

<div id="48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>
<div id="i48-claim-ni-8-difflogic-allow-versus-an-energy-teacher-toy-only" class="anchor-alias" aria-hidden="true"></div>

### I.4.8 主張 NI-8. `DiffLogic` 許可対エネルギー教師、トイのみ

`RESULTS.md` に記載されたハードマルチシードゲートベンチマークにおいて、閾値キャリブレーションおよびより高密度なラベル付けの後、DiffLogic はエネルギー教師モデルと一致し、拒否率 50.0 ± 15.9 パーセント、閾値における適合率 0.890 ± 0.067、再現率 0.802 ± 0.076 を達成した。ビットマスク参照手法は拒否率がより高く (71.0 ± 14.9 パーセント)、再現率はより低い (0.454 ± 0.266)。キャリブレーション前、DiffLogic の拒否率は 57.5 ± 14.1 パーセント、再現率は 0.724 ± 0.163 であった。この一致は当該トイラベリング設定に基づくものであり、ImageNet やコントロールスイートの結果ではない。解析モデルの下では、キャリブレーション済みゲートにおけるジュール当たりの内部効用は向上している (キャリブレーション前の 3.212e9 に対し 3.570e9)。セクション I.3.4 に述べられているとおり、この比率はコミット数を効用として用いている。

<div id="49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>
<div id="i49-claim-ni-9-board-level-joules-of-the-gate-fabric" class="anchor-alias" aria-hidden="true"></div>

### I.4.9 主張 NI-9. ゲート・ファブリックのボード・レベル・ジュール

| ランク | ファブリック | クロック | 差分 (W) | 演算 | 演算あたりジュール数 | ラベル |
|---|---|---|---|---|---|---|
| 1 | シードフリーラン対ボードベースライン | 該当なし | −0.8212 (SE 0.0024) | なし | なし | `measured_j`、ワットのみ |
| 2 | シード、停止対実行 | 約 100 MHz | +0.0098 (SE 0.0031) | シードサイクル 1 回 | 98.0 pJ (SE 30.8) | `measured_j`、INA260、SOM レール (`VCC_SOM`) |
| 3 | ゲート、8 レーン、停止対実行 | 25 MHz | +0.2857 (SE 0.0032) | ゲートサイクル 1 回、8 決定 | 11,428 pJ (SE 129) | `measured_j`、INA260、SOM レール (`VCC_SOM`) |

N = 各ランクにつき 4 回のインターリーブ A/B/A パス。ランク 1 の負符号は、シードビットストリームがボードのベースラインビットストリームよりも消費電力が小さいことを意味する。シードが無償であることを意味するものではない。セクション I.3.7 にボードレベル読み取りの限界を示す。

<div id="410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>
<div id="i410-safety-and-liveness" class="anchor-alias" aria-hidden="true"></div>

### I.4.10 安全性と活性

ゼロの偽許可は安全である。すべてを拒否するゲートも安全だが、無用である。活性はもう一つの軸であり、偽は拒否し、ゲートされたエージェントが完了するタスクの割合である。NI-3 は安全グリッドの両方を報告する。Safe v2 は偽許可を 42,430 から 79 に削減し、ゼロの偽許可である。seed-1 エピソードは 16 のうち 1 ステップをコミットし、そのカウントだけでは植物が目標に到達したかどうかは示さない。必要な報告は植物ごとのフロンティアであり、偽許可率に対するタスク完了率を示す。NI-4 の各構成モード（`lut_only`、`shield_discrete`、`cbf_energy_set`、`lut_and_safe_ph`）につき 1 点ずつ、各点はそのシードと広がりを伴う。エージェントの負荷に対して同じフロンティアは、偽許可に対する攻撃スイートと、完了に対する良性タスクスイートを使用する。ゲートはフロンティア上で評価され、一つの軸だけで評価されない。

<div id="411-what-the-scan-supports" class="anchor-alias" aria-hidden="true"></div>
<div id="i411-what-the-literature-search-supports" class="anchor-alias" aria-hidden="true"></div>

### I.4.11 文献調査が支持するもの

2026年9月に行われた文献検索（セクション I.2.4 から I.2.9）では、学習済みブール許容 LUT、ポートハミルトニアンまたはリュウヴィルエネルギー述語、三元 LUT 提案を 1 つのコミット境界として組み合わせ、ビット正確な RTL シミュレーションと解析的ジュール計算を備えた公開システムは見つからなかった。最も近いものはシールド、エネルギー意識バリアフィルタ、全体モデルとしての論理ネットワーク、エネルギー証明書を伴わない TLMM 設計である。検索は、検索された文献に関するギャップステートメントを支持する。未公開の作業に対する優先権主張やエネルギーリーダーシップの主張は支持しない。

<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>
<div id="i5-discussion" class="anchor-alias" aria-hidden="true"></div>

## I.5. 考察

<div id="51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>
<div id="i51-scale-does-not-answer-the-commit-question" class="anchor-alias" aria-hidden="true"></div>

### I.5.1 スケールはコミット問題に答えない

Kaplan、Hoffmann、Hooker、Sutton は損失と提案能力がどのようにスケールするかを述べている。より大きな提案者でも `Vdot <= epsilon` を満たす失敗するアクションを放出できる。その提案者を証明書の後ろに置くことで、証拠がスケールが機能すると示すスケールを使用し、スケールが沈黙している場所で述語を使用する。Bitter Lesson は学習を阻む凍結された人間の特徴に反対する。それは安全性述語を削除することを意味しない。将来の結果が、制約のない方策が同じ偽許可テストをより低い解析コストで、かつ同等のタスク誤差で満たすことを示せば、NI-3 のゲートに対する工学的好みはそのプラント上で弱まるだろう。提案と許可の論理的区別は残る。

<div id="52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>
<div id="i52-natural-language-and-mcp-are-transport-and-proposal" class="anchor-alias" aria-hidden="true"></div>

### I.5.2 自然言語と `MCP` は転送および提案である

MCP は発見と呼び形状を解決する。System One は自由形式生成なしでいくつかの決定を解決する。どちらのオブジェクトも `energy_ok` ではない。NI-6 のデモは実行者を呼び出さないリファインを示す。生産展開ではアダプタをバイパスできる可能性がある。主張はプロトコルがバイパスを不可能にするということではない。主張は、不可逆的な効果を監査可能にするためには、許可を別個の記録としなければならないということである。

<div id="53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>
<div id="i53-strong-linguistic-determinism-is-not-the-claim" class="anchor-alias" aria-hidden="true"></div>

### I.5.3 強い言語決定論は本稿の主張ではない

言語が思考を決定するという強い仮説は前提ではない。操作的記述は局所的である。このスキーマでは、合格証明書なしのコミットは成功した記録とはみなされない。型付けされていない信頼文字列は成功フラグの横に保存でき、理由が明示されないままにできる。列挙型はその特定の曖昧さを除去する。それは人間の認知を記述しているわけではない。

<div id="54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>
<div id="i54-formalism-can-be-wasteful-this-predicate-is-small" class="anchor-alias" aria-hidden="true"></div>

### I.5.4 形式主義は非効率になりうる、この述語は小さい

全てのステップでエージェント全体の証明を要求すると予算が支配的になる。参照は一つの境界を形式化している。読み取り専用呼び出しはバイパスされる。Safe 残差は固定点不等式であり、一般的な SMT クエリではない。NI-2 の解析的エピソードエネルギーは、示された定数の下で 8.6795e-10 ジュールである。それは生成モデルの基板エネルギーの分数として表すことはできない、なぜならその比較は測定されていなかったからである。実際のエージェントワークロードにおける提案ジュールとゲートジュールの分割は結果に含まれていない。これが行われるまで、この玩具ゲートに対するコストの異議は解決されたとみなされ、大規模証明書に対しては依然として未解決である。

<div id="55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>
<div id="i55-a-wrong-model-with-a-green-light-is-a-real-failure" class="anchor-alias" aria-hidden="true"></div>

### I.5.5 青信号を持つ誤ったモデルは実際の失敗である

`V` が植物のエネルギーでない場合、`energy_ok` が真であっても植物は安全ではない可能性がある。参照文献に示された緩和策は、玩具上の連続的なツイン、分離された理由コード、および確率を証明書として扱わないことである。存在しない緩和策は、入力対状態安定性（Input-to-State Stability）の乱れ、検証された引き寄せ領域、あるいは Leung と Paré が研究したようなベイズ的信頼度予算である。NI-4 は、二つの尊敬すべき証明書が一致しないことを示す証拠である。その不一致は述語に名前を付ける理由であり、テスト外でいずれかを信頼する理由ではない。

<div id="56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>
<div id="i56-prior-certificate-theory-is-not-duplicated-here" class="anchor-alias" aria-hidden="true"></div>

### I.5.6 先行証明書理論はここで重複しない

Ames、Alshiekh、Dawson、およびランタイムモニタリングに関する論文はすでにフィルタとモニタを定義している。NI-1 の追加は製品レコードと LUT エクスポートおよびツール実行者との合成であり、1 つの参照にまとめられている。玩具バリアが集合不変性で勝つ場合、論文はそう述べている（NI-4、NI-5）。合成は `cbf_ok` が別の連言として現れ、その述語が必要とされる場合である。LUT が Ames の二次計画を計算するという主張ではない。

<div id="57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>
<div id="i57-predictors-and-specialized-inference-chips" class="anchor-alias" aria-hidden="true"></div>

### I.5.7 予測器と特化型推論チップ

世界モデルは予測誤差の一部を削減し、残差を残す。特殊な推論装置は提案のコストを変える。ベンダーのスループット数値は独立したメーターが再測定するまでベンダー報告にすぎない。ゲートの役割は不可逆的な分岐である。装置の唯一のインターフェースがトークンストリームである場合でも、コミット記録はアクチュエータや不可逆ツールが実行される前にどこかに存在しなければならない。

<div id="58-analytical-joules-are-not-a-costume-for-watts" class="anchor-alias" aria-hidden="true"></div>
<div id="i58-analytical-joules-are-not-watts" class="anchor-alias" aria-hidden="true"></div>

### I.5.8 解析的ジュールはワットではない

Section I.3.4 の定数は工学的な数値として選択されている。これらはリポジトリ内でカウントを比較可能にするためのものであり、Artix-7 のレールに較正されたものではない。これらをボードワットとして報告することは誤った測定報告になる。正しい報告は次のとおりである：動作カウントは計算され、解析的なジュールはモデル化され、ボードジュールは KV260 メーターからのみ取得され、別途記録される。Section I.3.7 の Stage B は、同じモデルをブラウザで検査可能にするものであり、 https://research.openie.dev/living/fpga-sim/ にて利用できる。これにより測定クラスは変更されない。KV260 のランは、実行されたファブリックに対してのみ影響を与える。

<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>
<div id="i6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## I.6. 限界と妥当性への脅威

内部妥当性。Seed-1 は一つの初期条件である。Safe グリッドは大きいが、依然として選択された箱と選択された ε である。モンテカルロは閾値付近でサンプルを取り、設計者がストレスをかけると定めた境界をストレスする。別の ε または別のプラント識別子は、数値的主張を破壊し、再実行が必要となる。ベイクオフにおける CBF は、同一クレート内で実装されたエネルギー集合不等式であり、Ames 参照実装から独立してコードされたソルバーではない。意見の相違は有益である。文献のコードに対する絶対的な順位付けは確立されていない。

構成妥当性。コミット数をユーティリティとみなすことはタスク成功を測定しない。偽陽性許容は名前付きオラクルに対して定義される。システムはオラクル安全かつチェック安全（`Vdot <= epsilon` に対して偽陽性許容がゼロ）であっても、集合安全（`h >= 0`）に失敗することがあり、これは NI-4 が示す。読者が「safe」を一語として扱うと表を誤読する。

外部妥当性。両プラントは玩具である。マニピュレータ、クアッドロータ、またはヒューマン・イン・ザ・ループの試験は存在しない。MCP デモはネットワークを呼び出さない。Verilog はシミュレートされている。ブラウザ計測器は Stage B シミュレーションとして出荷されている。Alchitry Pt V2 は決定に合意し、メータリングは行われていない。KV260 の読み取りはボードレベルでオープンループである。ベンダーのロジックセル数はここでは確認されていない。

測定妥当性。解析定数は任意のスケールに編集可能である。Horowitz のピコジュール表、Landauer の境界、またはベンダーのトークン/ジュールに対する比較は、これらの定数を用いる限り妥当でない。KV260 のランは、所定のワークロード下でのボードレベルメータである。閉ループエピソードにおけるコアレールの読み取りが欠落している測定である。配置後配線ツールの電力は第3クラスに相当し、依然としてメータではなく、結果として報告されていない。

統計報告。`RESULTS.md` が平均と標準偏差を示す場所では、本稿はそれらをコピーする。計算されていない信頼区間は追加しない。マルチシードカバレッジはベイクオフで五つのシード、ハードゲートベンチマークで報告された広がりである。これは大標本主張とは言えない。

主張されていないもの。以下は結果ではない：シリコンジュールリーダーシップ、Landauer 境界付近での動作、脳等価電力、System One に対するレイテンシの勝利、ワールドモデルベンチマークに対する勝利、強い言語決定論、「知性」をコミット数と同一視すること。

反証者。NI-2 は、記載されたクレートリビジョン上の記載コマンドがそれらのカウントを出力しない場合に偽である。NI-3 は、Safe v2 テストが記載されたグリッド上で偽陽性許容を報告した場合に偽である。NI-6 は、デモファイルの拒否ケースが実行された場合に偽である。NI-1 は、スキーマとランタイムが乖離した場合に偽である。ステージ B エミュレータがステージ A と seed 1 で意見が合わない場合は、自己受入テストに失敗する。将来のメータが校正研究なしにボードエネルギーを解析数値に割り当てても、解析モデルを確認することにはならない。

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>
<div id="i7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## I.7. 結論

本稿では、コミット決定をLUT許可ビット上の結合証明書とエネルギー述語、任意のバリアを組み合わせたものとして定義し、不可逆的効果の前に決定を出力するソフトウェア参照を示した。報告された振り子テストにおいて、Safe 固定小数点規則は、連続オラクル `Vdot <= epsilon` に対して、指定されたテスト集合で偽許可をゼロに抑えたが、209,261 件の決定のうち 79 件の偽拒否を伴った。報告された比較において、そのオラクルは集合不変性とは同一ではない。シード 1 の実行に対する解析的エピソードエネルギーは、公開された定数の下で 8.6795e-10 ジュールである。MCP デモにおけるツールの拒否は実行者を呼び出さない。Verilog のチェックはシミュレーションである。ブラウザ WASM および WebGPU 計測器は https://research.openie.dev/living/fpga-sim/ にあり、同じ決定をボードなしで検査できる。これは依然としてシミュレーションであり、DUT の結果ではない。Alchitry Pt V2 はシード 1 のすべての決定でソフトウェアと一致し、計測されていないままである。KV260 はボードレベルでゲートファブリックを計測し、25 MHz で八レーンゲートサイクルあたり 11,428 pJ を示す。参照は測定されたソフトウェアアーティファクトとボード計測ファブリックである。閉ループチップのジュールは次の測定対象である。

<div id="references" class="anchor-alias" aria-hidden="true"></div>
<div id="i-references" class="anchor-alias" aria-hidden="true"></div>

## I. 参考文献

Simon, H. A., and Kadane, J. B. Optimal problem-solving search: all-or-none solutions. Artificial Intelligence 6(3), 235-247, 1975. https://doi.org/10.1016/0004-3702(75)90002-8

Alshiekh, M., Bloem, R., Ehlers, R., Konighofer, B., Niekum, S., and Topcu, U. Safe reinforcement learning via shielding. arXiv:1708.08611.

Ames, A. D., Coogan, S., Egerstedt, M., Notomista, G., Sreenath, K., and Tabuada, P. Control barrier functions: theory and applications. European Control Conference, 2019. https://doi.org/10.23919/ECC.2019.8796030

Amodei, D., and Hernandez, D. AI and compute. OpenAI, 2018. https://openai.com/index/ai-and-compute/

Anthropic. Introducing the Model Context Protocol. https://www.anthropic.com/news/model-context-protocol

Bacellar, A., et al. Differentiable weightless neural networks. arXiv:2410.11112.

Bauer, A., Leucker, M., and Schallhart, C. Runtime verification for LTL and TLTL. ACM Transactions on Software Engineering and Methodology 20(4), 14, 2011. https://doi.org/10.1145/2000799.2000800

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Brillouin, L. Science and Information Theory. Academic Press, 1956.

Chaitin, G. J. Algorithmic information theory. IBM Journal of Research and Development, 1977. https://doi.org/10.1147/rd.214.0350

Chen, Z., Kang, M., and Li, B. ShieldAgent: Shielding Agents via Verifiable Safety Policy Reasoning. ICML 2025 (PMLR v267). arXiv:2503.22738. https://proceedings.mlr.press/v267/chen25ae.html

Chollet, F. On the measure of intelligence. arXiv:1911.01547.

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Dawson, C., Gao, S., and Fan, C. Safe control with learned certificates: a survey of neural Lyapunov, barrier, and contraction methods. arXiv:2202.11762.

Engelbart, D. C. Augmenting human intellect: a conceptual framework. 1962. https://www.dougengelbart.org/pubs/augment-3906-Framework.html

Falcone, Y. You should better enforce than verify. Runtime Verification (RV 2010), Lecture Notes in Computer Science 6418, 89-105. Springer, 2010. https://doi.org/10.1007/978-3-642-16612-9_9

Garcia-Molina, H., and Salem, K. Sagas. Proceedings of ACM SIGMOD 1987, 249-259. https://doi.org/10.1145/38713.38742

Gray, J. Notes on data base operating systems. In Operating Systems: An Advanced Course, Lecture Notes in Computer Science 60, 393-481. Springer, 1978. https://doi.org/10.1007/3-540-08755-9_9

Greydanus, S., Dzamba, M., and Yosinski, J. Hamiltonian neural networks. arXiv:1906.01563.

Ha, D., and Schmidhuber, J. World models. arXiv:1803.10122.

Hafner, D., Pasukonis, J., Ba, J., and Lillicrap, T. Mastering diverse domains through world models. arXiv:2301.04104.

Henzinger, T. A., Kueffner, K., and Yu, E. Formal verification of neural certificates done dynamically. arXiv:2507.11987. https://arxiv.org/abs/2507.11987

Hestness, J., et al. Deep learning scaling is predictable, empirically. arXiv:1712.00409.

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Hooker, S. The hardware lottery. arXiv:2009.06489. Communications of the ACM, 2021. https://doi.org/10.1145/3467017

Horowitz, M. Computing's energy problem (and what we can do about it). IEEE International Solid-State Circuits Conference, 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Iverson, K. E. Notation as a tool of thought. Communications of the ACM, 1980. https://dl.acm.org/doi/10.1145/358896.358899

Jaynes, E. T. Information theory and statistical mechanics. Physical Review 106, 620, 1957. https://doi.org/10.1103/PhysRev.106.620

Kang, S., Yu, T., and Hwang, S. J. PolicyGuide: from guarding one action to guiding the whole workflow for policy-compliant LLM agents. arXiv:2608.19861. https://arxiv.org/abs/2608.19861

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Kay, A. A personal computer for children of all ages. 1972. https://worrydream.com/refs/Kay_1972_-_A_Personal_Computer_for_Children_of_All_Ages.pdf

Klein, G., et al. seL4: formal verification of an OS kernel. Proceedings of SOSP 2009, 207-220. https://doi.org/10.1145/1629575.1629596

Kolmogorov, A. N. Three approaches to the quantitative definition of information. 1965. English: International Journal of Computer Mathematics, 1968. https://doi.org/10.1080/00207166808803030

Kuon, I., and Rose, J. Measuring the gap between FPGAs and ASICs. IEEE Transactions on Computer-Aided Design 26(2), 203-215, 2007. https://doi.org/10.1109/TCAD.2006.884574

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

LeCun, Y. Path towards autonomous machine intelligence / JEPA discussion. Meta AI blog. https://ai.meta.com/blog/yann-lecun-advances-in-ai-research/

LeCun, Y., Chopra, S., Hadsell, R., Ranzato, M., and Huang, F. J. A tutorial on energy-based learning. 2006. http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf

Lee, L. Notational intelligence. 2022. https://thesephist.com/posts/notation/

Leung, C. H., and Paré, P. E. Bayesian safety guarantees for port-Hamiltonian systems with learned energy functions. arXiv:2512.24493.

Levy, W. B., and Calvert, V. G. Cerebral cortical communication overshadows computational energy-use, but these combine to predict synapse number. arXiv:2102.06273.

Ligatti, J., Bauer, L., and Walker, D. Edit automata: enforcement mechanisms for run-time security policies. International Journal of Information Security 4, 2-16, 2005. https://doi.org/10.1007/s10207-004-0046-8

Ma, S., et al. The era of 1-bit LLMs: all large language models are in 1.58 bits. arXiv:2402.17764.

Manek, G., and Kolter, J. Z. Learning stable deep dynamics models. arXiv:2001.06116.

Matuschak, A., and Nielsen, M. How can we develop transformative tools for thought? https://numinous.productions/ttft/

Mead, C. Neuromorphic electronic systems. Proceedings of the IEEE, 1990. https://doi.org/10.1109/5.58356

Necula, G. C. Proof-carrying code. Proceedings of the 24th ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL '97), 106-119, 1997. https://doi.org/10.1145/263699.263712

Petersen, F., et al. Deep differentiable logic gate networks. arXiv:2210.08277.

Qiao, Y., Chen, Z., Zhang, Y., Wang, Y., et al. TeLLMe: an energy-efficient ternary LLM accelerator for prefilling and decoding on edge FPGAs. arXiv:2504.16266.

Roth, F., et al. Stable port-Hamiltonian neural networks. arXiv:2502.02480.

Saltzer, J. H., and Schroeder, M. D. The protection of information in computer systems. Proceedings of the IEEE 63(9), 1278-1308, 1975. https://doi.org/10.1109/PROC.1975.9939

Sanchez, C., et al. A survey of challenges for runtime verification from advanced application domains. arXiv:1811.06740.

Sandberg, A. Energetics of the brain and AI. arXiv:1602.04019.

Schneider, F. B. Enforceable security policies. ACM Transactions on Information and System Security 3(1), 30-50, 2000. https://doi.org/10.1145/353323.353382

Sha, L. Using simplicity to control complexity. IEEE Software 18(4), 20-28, 2001. https://doi.org/10.1109/MS.2001.936213

Shannon, C. E. A mathematical theory of communication. Bell System Technical Journal, 1948. https://doi.org/10.1002/j.1538-7305.1948.tb01338.x

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Shi, T., He, J., Wang, Z., et al. Progent: Securing AI Agents with Privilege Control. arXiv:2504.11703. https://arxiv.org/abs/2504.11703

Solomonoff, R. J. A formal theory of inductive inference, parts I and II. Information and Control, 1964.

SparkFun. Alchitry Pt V2 product page. https://www.sparkfun.com/alchitry-pt-v2.html

Sutskever, I. An observation on generalization. Simons Institute talk, 2023. https://www.youtube.com/watch?v=AKMuA_TVz3A

Sutton, R. The bitter lesson. 13 March 2019. http://www.incompleteideas.net/IncIdeas/BitterLesson.html

Texas Instruments. INA260 precision digital current and power monitor, data sheet. https://www.ti.com/lit/ds/symlink/ina260.pdf

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Umuroglu, Y., et al. LogicNets. arXiv:2004.03021.

Victor, B. Inventing on principle. 2012. https://www.youtube.com/watch?v=PUv66718DII

Victor, B. Media for thinking the unthinkable. https://worrydream.com/MediaForThinkingTheUnthinkable/

Wang, H., Poskitt, C. M., and Sun, J. AgentSpec: customizable runtime enforcement for safe and reliable LLM agents. arXiv:2503.18666. https://arxiv.org/abs/2503.18666

Wei, J., et al. T-MAC. arXiv:2407.00088.

Xiang, Z., Zheng, L., Li, Y., Hong, J., et al. GuardAgent: safeguard LLM agents by a guard agent via knowledge-enabled reasoning. arXiv:2406.09187. https://arxiv.org/abs/2406.09187

Yu, E., Žikelić, Đ., and Henzinger, T. A. Neural control and certificate repair via runtime monitoring. AAAI 2025. https://doi.org/10.1609/aaai.v39i25.34840 (arXiv:2412.12996).

Local measurement record: `artifacts/RESULTS.md` in the `wca-lut-edge` software reference. KV260 meter record: `artifacts/stage-c/wca-kv260-meter/` (protocol, claim status, A/B/A logs and summaries). Schema examples: `artifacts/schemas/wca.commit.v1/examples/`. Demo: `artifacts/mcp_gate_demo.json`.

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## I. 付録 A. 再現性

作業ステーションのパスは、`wca-lut-edge` ツリー、Rust 1.98 が `RESULTS.md` に記録されたものを使用した。日常的なコマンドは以下の通りである。

```text
cargo test -p wca-commit
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1
cargo run --release --bin wca-soc-loop -- \
  --steps 16 --init-theta 1.5 --init-omega 3.0 --seed 1 --safe-ph
cargo run --release --bin wca-ph-tighten -- --grid 21 --out artifacts/ph_tighten_report.json
cargo run --release --bin wca-cbf-bakeoff -- --out artifacts/cbf_bakeoff_report.json
cargo run --release --bin wca-lyap-plant -- --out artifacts/lyap_plant_report.json
cargo run --release --bin wca-mcp-gate -- --demo
cargo run --release --bin wca-tlmm-scale -- --out artifacts/tlmm_scale_report.json
```

Icarus Verilog は `RESULTS.md` の環境ノートに記載されたとおりバージョン 12.0 である。RTL のチェックはシミュレーションで行う。解析的なジュールを基板電力として読み取ってはならない。

基板結果フラグは KV260 Stage C のラン 1 から 3（セクション I.3.7）に限って真であり、基板レベルで適用される。本稿の他のすべての結果はシミュレーションまたは解析的である。

<div id="appendix-b-browser-fpga-emulator-architecture-to-build" class="anchor-alias" aria-hidden="true"></div>
<div id="i-appendix-b-browser-fpga-emulator-architecture" class="anchor-alias" aria-hidden="true"></div>

## I. 付録 B. ブラウザ `FPGA` エミュレータ: アーキテクチャ

この付録は、 https://research.openie.dev/living/fpga-sim/ で実行される Stage B エミュレータのアーキテクチャについて述べる。以下の Seed-1 合意番号は、 Stage A のゴールデンに対して実行された WASM から得られたものである。

モジュール。

1. `decision_core`。Rust 証明書、プラントステップ、ジュールアキュムレータで既に表現されている純粋関数。ファイルシステムもスレッドも不要。ターゲットは `wasm32-unknown-unknown`。
2. `lut_image`。Verilog パスがロードする同一メモリイメージ（`artifacts/fpga/wca_allow_lut.mem` およびその後継）。ブラウザ側のコピーは Icarus チェックで使用されたファイルとハッシュ一致する必要がある。
3. `trace`。固定スキーマ：ステップインデックス、状態、`u`、`lut_allow`、`energy_ok`、`cbf_ok`、理由コード、分析ジュール増分、プラントアクション。`wca.commit.v1` と同一のフィールド名であるため、クレートの JSON と比較できるダンプが可能である。
4. `webgpu_view`。デバイス、キュー、LUT とトレース用のストレージバッファ。シェーダが許可と拒否を描画する。第二のディスパッチは Safe 残差をグリッド上にマッピングできる。バッファは検査用であり、電力モデルではない。
5. `workstation_oracle`。Icarus が RTL オラクルとして残る。ブラウザはそれに取って代わらない。WASM と Rust バイナリの不一致はビルド失敗を招く。WASM と Icarus の共有 LUT イメージの不一致もビルド失敗を招く。いずれの比較もワット数には言及しない。

受入テスト。Seed-1 テストは合格する（Section I.3.7）。他はモジュールごとの指定チェックである。

- Seed-1、16 ステップ、初期 theta 1.5、omega 3.0：コミット 1、拒否 15、分析ジュール 8.6795e-10、NI-2 と一致。
- Safe グリッドスモーク：公開された 209,261‑decision テストのサブセットで false allow 0、NI-3 の方向と一致。
- MCP 拒否ベクトル：実行者呼び出し回数 0、NI-6 と一致。
- WebGPU バッファのリードバックが WASM トレースと等しいことを確認する単体テスト。リードバックが利用できない場合、ページは GPU パスがトレースを確認できなかったことを示し、CPU の WASM トレースが結果として残る。

ボード **joules** に関する物理的フォローオン。Stage C はすでに Alchitry Pt V2 上で UART 決定合意を用いた閉ループ・コミットゲートをプログラムしているが、ボードにはオンボードのジュールメータがない。5 V レール上の USB インライン電力メータまたはシャント＋オシロスコープを、所定のワークロードで使用することが、ボード測定ジュールをサポートする手段である。Vivado / ポスト‑PAR 推定はそのメータではない。ベンダーのロジックセルおよびメモリ数値はベンダーの数値のままである。[/living/fpga-sim/alchitry/#energy](/living/fpga-sim/alchitry/#energy) を参照。

エミュレータの範囲外：ブラウザ内で DiffLogic を訓練することおよびシェーダから Artix‑7 の動的電力を推定すること。

<div id="part-ii" class="anchor-alias" aria-hidden="true"></div>
<div id="mixture-of-limits-navigation-law-for-computer-intelligence" class="anchor-alias" aria-hidden="true"></div>
<div id="part-ii-the-cascade-mixture-of-limits" class="anchor-alias" aria-hidden="true"></div>

## Part II. カスケード (限界の混合)

<div id="mol-abstract" class="anchor-alias" aria-hidden="true"></div>
<div id="ii1-the-rule" class="anchor-alias" aria-hidden="true"></div>

## II.1. 規則

タスクは、その状態 $z$ に対する完全性述語 $C(z) \in \{0, 1\}$ によって与えられる。**ギア**とは、タスクを完了させうる機構であり、Lookup（保存・検証済みの値を読み出す）、Formula（閉じた形式を評価する）、Solver（探索・最適化を実行するか、証明書とともに決着させる）、Model（学習済み生成器を実行する）の4種類がある。ギア $i$ は通過確率 $p_i$（そのタスククラスにおいて $C(z) = 1$ に到達する確率）と、ジュール（J）単位の期待エネルギー $c_i$ を持つ。

タスクの**フロア**とは、ギアに対する何らかの方針が、失敗確率を高々 $\delta$ として $C(z) = 1$ に到達するための最小期待エネルギーである。これはセクション 0.2 の $J^*$ に等しい。**プラトー**とは、フロアを超えた支出の領域である。すなわち、$C(z) = 1$ となった後は、いかなる追加計算も $C$ を高めることができず、それ以上のジュールは所定の目的に対して何ももたらさない。

**Mixture of Limits** とは次の規則である。期待エネルギーが最初の完了に至るまで最小となる順序でギアを試み、$C(z)$ を完了させた最初のギアで停止し、次のギアが予算を超過するか決定を変えられない場合は受領書とともに拒否する。Lookup → Formula → Solver → Model が標準的な順序である。これが最適となるのは、セクション II.2 で導出される条件の下においてのみである。すべての完了は、パート I の記録（提案、認証、コミット、または拒否、受領書）を経由する。

**モデルの位置づけ。** Model を最後に置くことは、試行の順序であり、モデルが何をなしうるかについての判定ではない。Snell ら（2024）は、テスト時計算量の計算最適スケジュールが best-of-N を効率において4倍以上上回ること、また一部の問題ではテスト時計算量がより大きなモデルの代替となりうることを示した。この結果は Model ギア内部のスケジュールに関するものであり、他のギアと同様にジュール単位で価格付けされる。Model ギアは、より安価なギアが $C(z)$ を完了できない場合に開かれ、それらのギアの失敗コストを賄えないほど通過確率が低い場合には最初に開かれる。

図 2 は、あるタスクに対するフロアとプラトーを示す。

![あるタスクに対する支出に対する検証済み進捗の図。カスケードが Lookup から Formula、Solver へとエスカレートするにつれて進捗は段階的に上昇し、Solver がタスクを完了させてフロアを示す。フロアを過ぎると Model 段階は支出を増加させるが検証済み進捗はそれ以上得られず、情報の価値がゼロとなるプラトーとなる。](/figures/gates/mol-plateau.svg)

*図 2. あるタスクにおける Mixture of Limits。図は概念図であり、測定値ではない。[PNG コピー](/figures/gates/mol-plateau.png) も提供されている。*

**Mixture of Limits は Mixture of Experts ではない。** Mixture-of-Experts（MoE）ルーティングは、1つの生成モデル内部でパラメータを選択する（Shazeer ら、2017；Fedus ら、2022）。Mixture of Limits は、ギアをまたいで支出するかどうか、またどこで支出するかを選択するものであり、MoE モデルはその Model ギアとして機能しうる。

| | MoE | Mixture of Limits |
|---|---|---|
| 選択が行われる場所 | 1つのモデルの内部 | ギアをまたいで、いかなるモデルが実行される前に |
| 選択の対象 | どのパラメータを実行するか | どのギアが完了するか、または拒否 |
| 成功 | 次トークン尤度 | $C(z) = 1$、認証済みコミット、および受領書 |
| 拒否 | 本来の結果ではない | 受領書を伴う型付き結果 |

<div id="ii2-expected-energy-of-a-cascade-and-the-optimal-order" class="anchor-alias" aria-hidden="true"></div>

## II.2. カスケードの期待エネルギーと最適順序

**二つのギア。** 軽いギア L が通過確率 $q_L$ とエネルギー $c_L$ を持ち、常に通過する重いギア H がエネルギー $c_H$ を持つとする。L を先に試す期待コストは $c_L + (1 - q_L)\,c_H$ である。H を先に試すコストは $c_H$ である。したがって L を先にする方が安価であることと同値なのは

$$
c_L + (1 - q_L)\,c_H < c_H \iff c_L < q_L\, c_H .
$$

例えば、$c_L = 10^{-9}$ J のコストで検索を行い、タスクの $q_L = 0.3$ 前に通過すると、モデル呼び出しのコスト $c_H = 10$ J と比較して、期待値でタスクあたり $q_L c_H - c_L \approx 3$ J を節約できる。$q_L$ が $c_L / c_H = 10^{-10}$ 未満になると、順序が逆転する。

**多数のギア。** 独立した結果を持つ $n$ 個のギアを最初の通過まで順次試す場合、順序 $\sigma$ の期待エネルギーは

$$
\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j<k} \bigl(1 - p_{\sigma(j)}\bigr).
$$

隣接する二つのギア $a$ と $b$ を入れ替えると、両項に共通の係数が掛かり、$(c_a + (1-p_a)c_b) - (c_b + (1-p_b)c_a) = c_a p_b - c_b p_a$ が変化する。したがって $a$ は $b$ の前に置くべきであり、その条件は $p_a / c_a > p_b / c_b$ である。最適な順序は $p_i / c_i$ が減少する順にギアを並べる（Simon and Kadane, 1975）。最も安価なものを先に置くことが最適になるのは、安価なギアがジュール当たりの通過確率も高い場合に限られる。その条件が満たされないと、カスケードはより重いギアから始まる。予算が拘束される場合、失敗した軽い試行のジュールは消費されたままであるため、$p_i / c_i$ をタスクあたりで推定できるセレクタは固定順序では閉じられないタスクを閉じることができる。

**物理的下限。** 温度 $T$ で $n$ ビットを不可逆に消去する任意のギアは、少なくとも

$$
E_{\text{Landauer}}(n, T) = n\, k_B T \ln 2, \qquad k_B = 1.380649 \times 10^{-23}\ \text{J/K},
$$

を散逸させる。これは 300 K においてビット当たり $2.87 \times 10^{-21}$ J に相当する（Landauer, 1961; Bennett, 1973, 可逆限界）。測定された CMOS 動作は、45 nm の 32 ビット浮動小数点加算で約 0.9 pJ、DRAM アクセスで約 1〜2 nJ（Horowitz, 2014, 論文本文; 全体スライドでは 64 ビットアクセスで 1.3〜2.6 nJ）であり、下限より 8〜12 桁上回っている。しばしば引用される 640 pJ の 32 ビット DRAM 読み取りは、該当論文やスライドには記載されておらず、ここでも使用しない。したがって領収書上の Landauer 値は、測定値ではなくラベル付けされた下限である。

**カタログコストモデル。** ギアが実行される前に、ソフトウェアは次のように参照価格を設定する。

$$
E_{\text{est}}(x) = \theta(D)\,\mu(S, V),
$$

ここで $\theta(D)$（無次元）はアクション $x$ の難易度クラス $D$ に比例し、$\mu(S, V)$（J）はハードウェアビュー $V$ 上のプリミティブ $S$ に対するカタログエネルギーである。両者はカタログ定数として示されているため、$E_{\text{est}}$ はギアの順序付けに用いられる推定値である。これは物理から導出されたものではなく、測定値として報告されることはない。タスクを完了させるシステム間のランキングは、メータードジュール（セクション 0.2）を使用する。

<div id="ii3-stopping-conditions" class="anchor-alias" aria-hidden="true"></div>

## II.3. 停止条件

**情報価値。** $B$ を決定の報酬、$x$ を現在の情報状態、$y$ を追加の観測または計算、$c(y)$ をそのエネルギー、$\lambda$ を報酬とジュール間の交換レートとすると、純粋価値は

$$
\Delta(x, y) = \mathbb{E}[B \mid x, y] - \mathbb{E}[B \mid x] - \lambda\, c(y)
$$

(Howard, 1966; Russell and Wefald, 1991)。この規則は $\Delta \le 0$ の場合にエスカレーションを拒否する。$C(z) = 1$ になると、タスク上の任意の追加 $y$ に対して最初の二項が等しくなるので、$\Delta = -\lambda c(y) < 0$ となり停止が続く。

**文法カバレッジ。** $G$ を Lookup、Formula、Solver が利用できる検証済み導出集合とする。クエリ $q$ は導出 $q \vdash_G a$ が存在するときカバーされる。$q$ がカバーされる場合、Model ギアは開かれない。なぜならカバーされたギアは Model ギアより低エネルギーで確率 1 で通過するため、Section II.2 の二ギア不等式により最初に実行されタスクを閉じるからである。$q$ がカバーされずかつポリシーが Model ギアを禁止する場合、規則は拒否する。

**定着拒否。** 低エネルギー構成を探索する Solver ギアは、認証された固定点 (commit) に到達するか、予算内で定着しないことを報告して (refuse) になる。

ソフトウェア参照における命名された拒否理由:

| Reason | Condition |
|---|---|
| `voi` | $\Delta \le 0$ が利用可能な次のステップすべてに対して成り立つ |
| `grammar` | カバーされておらず Model ギアが許可されていない |
| `energy` | 次のギアの推定が残り予算を超える |
| `efa_certificate` | コミット前に証明書チェックが失敗する |
| `settle_refuse` | Solver が予算内で定着しない |
| `primitive_gap` | 必要なプリミティブがカタログに存在しない |
| `safety` | 能力チェックがアクションを拒否する |

<div id="ii4-provenance-and-receipts" class="anchor-alias" aria-hidden="true"></div>

## II.4. 出所と受領証

すべての回答には、生成方法を示すリプレイクラスが付与される：`Deterministic`（Lookup、Formula、または認定された Solver）、`RetrievedCited`、`Composed`、または `ModelGenerated`。型システムはクラスの強化を禁止しており、`ModelGenerated` を `Deterministic` に書き換えることはできない。領収書上のエネルギーは、**Estimated**（カタログ、Landauer または命令燃料数値）、**Unmetered**（測定なし）、**Metered**（名前付きメーターが測定値を返す）のいずれかのラベルが付く。ソフトウェア参照は、メーターが返さない限り `measured_j` を未設定のままにする。参照がナビゲートするプリミティブのカタログは、ファミリーごとにグループ化され、本稿では Periodic Stack と呼ばれる。各セルは Present（実装済み）または Gap（未実装）である。

<div id="ii5-software-reference" class="anchor-alias" aria-hidden="true"></div>

## II.5. ソフトウェア・リファレンス

ソフトウェア参照 `mixture-of-limits`（Apache-2.0 または MIT）にはハーネス `cargo run -p mol-cli -- prove` があり、各基準について `VERIFIED` と出力し、終了コード 0 で終了する。ワークスペースのテストスイート（`cargo test --workspace`）は合格（P0）し、ハーネスも終了コード 0 で終了する（P1）。`verified` とマークされた基準は、実装が存在し、記載された仕様を満たすことを意味する。これは定理でも独立した再現でもエネルギー測定でもない。2026 年 10 月 2 日の実行時点で、ハーネスは 43 件の `VERIFIED` 基準を出力する（以前の約 29 件から増加した）。以下の表は P2 から P24 までを項目化し、II.5.1 から II.5.3 は、後に追加された製品ギャップ基準 A11 から A14 を記述している。他の基準は本稿では項目化されておらず、ソフトウェア参照の `PLAN.md` および `product/ACCEPTANCE` に記載されている。

<div id="6-prove--claim-map" class="anchor-alias" aria-hidden="true"></div>

| 証明番号 | 基準 | 主張ID | 主張 | 範囲注記 | 測定 |
|---|---|---|---|---|---|
| 証明番号 | 基準 (PLAN) | 論文主張ID | 主張 (一文) | ソフトウェア参照 / スコープ注記 | 測定 |
|---|---|---|---|---|---|
| P2 | Deterministic close (double-run) | `claim.mol.deterministic_close` | 同一の問い合わせは同一の commit/refuse + limit id を生成する。 | none | 未計測 |
| P3 | Formula/lookup close without model | `claim.mol.formula_lookup_no_model` | Landauer / unit-convert が Lookup または Formula で COMMIT を閉じる; モデルは決して回答しない。 | none | 未計測 / 推定 (受領時の Landauer フロア) |
| P4 | VoI refuse when `!allow_model` | `claim.mol.voi_refuse` | 自由形式の問い合わせ → REFUSE `voi`。 | none | 未計測 |
| P5 | Settle commit + settle refuse | `claim.mol.settle_ternary` | 三項 settle → COMMIT; `will not settle` → REFUSE `settle_refuse`。 | Software-ref settle stub; no VM / FPGA | 未計測 |
| P6 | Certificate refuse on diverge | `claim.mol.efa_certificate_refuse` | Formula + `diverge` → REFUSE `efa_certificate`。 | In-tree certificate | 未計測 |
| P7 | Capability default-deny mutate | `claim.mol.capability_deny_mutate` | `AutomateGate::default().gate(Mutate)` → Refuse。 | none | 未計測 |
| P8 | Receipt labels | `claim.mol.receipt_honesty` | Software-ref: `measured_j=None`, 推定がラベル付け (`EstimateKind`)。 | Live RAPL/NVML default close OUT OF SCOPE | 未計測 / 推定 |
| P9 | `ModelGenerated` ↛ `Deterministic` | `claim.mol.replay_no_strengthen` | `TypedAnswer::weaken_to` は `ReplayCoercion` を返す。 | none | none |
| P10 | Periodic Stack live catalog navigation | `claim.mol.stack_live_catalog` | Family + present + scale → COMMIT at Lookup; 258 のライブ Lookup/Formula/Solver/Navigate 歯車。 | μ calib + silicon HW OUT OF SCOPE; software reference Gap sims in proof | 未計測 |
| P11 | `primitive_gap` via registry probe | `claim.mol.primitive_gap` | Gap マーカー `physical_settle` と名前欠如 → REFUSE `primitive_gap` (文字列のみではない)。 | none | 未計測 |
| P12 | μ / impedance catalog | `claim.mol.mu_catalog` | 領収書は `mu_source=catalog`、`mu`、`landauer_floor_ratio` をスタンプ; `E≈θ·μ` (カタログ推定、RAPL/`measured_j` ではない)。 | μ **calib corpus** OUT OF SCOPE | 推定 |
| P13 | Receipt transcript replay | `claim.mol.receipt_replay` | JSONL/インメモリ replay が commit/refuse + limit id を再現する; モデルは決して回答しない。 | none | 未計測 |
| P14 | Z2 retrieve+cite | `claim.mol.z2_retrieve_cite` | シードされた事実的ヒット → COMMIT `RetrievedCited` + citation ids; 不明 → REFUSE `claim_unknown` (捏造なし)。 | Seed corpus in-tree only | 未計測 |
| P15 | Z1 compose/synthesis | `claim.mol.z1_compose` | ≥2 の引用主張 → COMMIT `Composed` + `synthesis.composed_from`; 欠如 → REFUSE `compose_missing`; Deterministic/RetrievedCited のみとしては決して洗浄されない。 | none | 未計測 |
| P16 | エージェントメールボックスループ | `claim.mol.agent_mailbox` | Goal/Message/Act → close → commit\|refuse + 受領書 in transcript; demo hits formula/cite/compose COMMIT and voi/settle_refuse REFUSE; model cold; measurement flags hold. | none | 未計測 |
| P17 | 双時間状態 + メモリ | `claim.mol.bitemporal_memory` | Writes only on Mixture of Limits close COMMIT; Mutate deny / free-form remember → REFUSE; recall → `RetrievedCited` + `memory:` cite; unknown → `memory_unknown`. | none | 未計測 |
| P18 | ファブリックルーティング + ソフトウェア参照インベントリ | `claim.mol.fabric_soft_ref` | Offline inventory valid (`source=software_ref`, Cpu always); Lookup/Formula→Cpu; Settle→ThermoSettle\|Cpu; Model→Gpu* or REFUSE `fabric_unavailable`; detect ≠ measured joules. | Live wgpu の存在はオプション / 証明に必須ではない | 未計測 |
| P19 | デスクトップシェルヘッドレス | `claim.mol.desktop_headless` | `ShellSession` ask/close → receipt view (zone/fabric/limit/estimated_j/`measured_j=None`); joule ledger; VoI refuse; GUI not required. | egui GUI はオプション | 未計測 / 推定 |
| P20 | OS メーターラベル | `claim.mol.os_meter_honesty` | Feature off / VM / no permission → `measured_j=None`, empty components, `measure_source=unavailable`; fixtures stamp labeled sources; default close stays unmetered. | Live probe はオプション (`energy-meter`) | 未計測 (デフォルト) / プローブが返す場合のみ計測 |
| P21 | WASM カプセル認証 | `claim.mol.wasm_capsule` | `add.wasm` under stub runtime; fuel → estimated_j only; FS/net grant / fuel exceed / host-share → REFUSE; close stamps capsule. | オプション `wasmtime` 機能 | 未計測 / 推定 (fuel) |
| P22 | エージェントレーンセッションパス | `claim.mol.agent_lane` | Lane partitions; `host_invoke` without provenance refuses; keyword confirm insufficient; need `GrantReceipt`; allow stamps `AgentLaneReceipt`. | none | 未計測 |
| P23 | マルチファブリック計算受領書 | `claim.mol.fabric_compute_receipt` | Software reference inventory; `ComputeFabric` / `ScheduleDecision` / `ComputeStepReceipt` with `fabric_id`; cascade stamps `fabric:route`; CPU Formula COMMIT; Model residual may `fabric_unavailable`; `measured_j=None` on software reference path. | none | 未計測 |
| P23b | ライブファブリックソフト | `claim.mol.fabric_live_soft` | Feature off stays software_ref; mock/live Metal can stamp `gpu_metal`; Formula stays Cpu; missing Gpu* fail-closed; prove does not require a GPU; `measured_j=None` unless Metered. | ソフト / オプション検出 | 未計測 |
| P23c | wgpu / Metal 小規模カーネル | `claim.mol.kernel_vector_add` | クリーンルーム WGSL ベクトル加算; ソフトスタブ オフライン (同一チェックサム); Gpu* が `kernel:vector_add` と `execution_proof` をスタンプ; オプションの重複メーターはパッケージ `measured_j` に `energy_honesty=measured` (フィールド名) をスタンプする可能性がある; rail-sum パッケージ ジュールはなし。 | Live Metal オプション; フィクスチャは証明に対して OK | 未計測 (デフォルト) / メーターが返す場合のみ計測 |
| P24 | エコシステム e2e 認証 (1 件のレシート) | `claim.mol.ecosystem_e2e` | レーン → ファブリック (Cpu ソフトウェア参照) → WASM → エネルギーラベル (推定燃料; オプションの meter_sample) → ホストは `GrantReceipt` のみで呼び出し → **1** 件のレシートで commit\|refuse; grant なしで refuse → `grant_receipt_required`。 | なし | 未計測 / 推定 |

ハーネスの外部: デフォルトのクローズとしてのライブエネルギーカウンタ（RAPL、NVML）、ライブGPU検出、デバイス上の証明書ハードウェア、学習済みモデル重み、そしてGapセル用シリコンメータ。いずれも主張されていない。

<div id="ii51-phase-1-micro-perception-on-the-arena-a11-a14" class="anchor-alias" aria-hidden="true"></div>

### II.5.1 アリーナ上のフェーズ1マイクロ知覚 (A11, A14)

アリーナは、常にモデルベースラインと小さなリーフベースラインに対して、型付けされた作業（決定、チケットクローズ、リスク）に対するカスケードを評価する。型付けされたベースラインは `phase1=false` で実行される。`phase1=true` の場合、構造化されていないチケット、リスク、または決定文字列はまずツリー内規則AST変換器（`mol phase1`）を通過し、その後でカスケードに入る。認識されない入力は拒否されるため、変換器がモデルとして使用されることはなく、Model LAST は最後に残る。2026年10月2日のソフトウェア参照実行（n = 36、America/New_York）では、カスケードは 36 件中 36 件を正しく閉じ、5 件中 5 件の飽和ケースを拒否した。一方、常にモデルベースラインとリーフベースラインはそれぞれ 36 件中 28 件、飽和で 5 件中 0 件だった。平均推定ジュールは、カスケードが約 2.1e-11、常にモデルベースラインが 5.0e-1、リーフベースラインが 2.5e-4 であった。これらはカタログ推定であり、`measured_j` は設定されておらず、数値は参照元の公開テーブルからのもので、本稿のために再実行されたものではない。

<div id="ii52-tier-1-os-meters-a13" class="anchor-alias" aria-hidden="true"></div>

### II.5.2 ティア1 OS メータ (A13)

オプションのビルド機能はパッケージレベルのプローブを追加し、`measured_j` が実際の測定値からのみ入力されるようにする：Linux RAPL（powercap `energy_uj` のデルタ）、NVIDIA（`nvidia-smi` の電力にウィンドウを掛けたもの、またはデバイス全体の GPU エネルギーとしての消費エネルギーのデルタ）、macOS（SMC `PSTR` ワットにウィンドウを掛けたもの、sudo なし；Energy Model パッケージチャネルは使用せず、レールは決して合算されない）。ハーネスは機能をオフにした状態で実行されるため、`measured_j` はそこで設定されない。基準 A13 は RAPL、NVML、SMC のフィクスチャにスタンプを押し、利用率パーセンテージから値を捏造することを禁じている。Part II の図はこれらのプローブからの測定値ではない。

<div id="ii53-primitive-distillation-a12" class="anchor-alias" aria-hidden="true"></div>

### II.5.3 プリミティブ蒸留 (A12)

認証済みの Model LAST コミットの後、`mol distill` は決定的リプレイを伴うストアに Lookup または Formula エントリを付加する。認証されていない提案は決して蒸留されない。蒸留されたパターンに対する第2パスは、Model LAST (A12) を開かずに Lookup または Formula で閉じる。領収書は `estimated_j` を推定値としてラベル付けしたまま保持する。

再現方法: `cargo run -p mol-cli -- prove` (A1 から A14 までを含む 43 の基準)、`-- arena`、`-- phase1 "please close ticket as R-OK"`、`-- distill "ticket summary" --gear lookup --store product/fixtures/distill_store.json`。コード: [openIE-dev/mixture-of-limits](https://github.com/openIE-dev/mixture-of-limits)

<div id="ii6-related-work" class="anchor-alias" aria-hidden="true"></div>

## II.6. 関連研究

**カスケードとメタ推論。** Viola と Jones (2001) は、安価な段階が大多数の入力を除外するブースト分類器のカスケードを実行した。 Russell と Wefald (1991) は、各計算をそのコストと決定ネットへの期待価値で価格付けし、正の純価値を持つものがなくなるまで停止した。 Horvitz (1987) は、同様のトレードオフを有界推論に設定した。 Anytime アルゴリズムは、割り込み可能な停止で計算と品質を交換する (Dean と Boddy, 1988; Zilberstein, 1996)。 モデルカスケーディングは、より小さなモデルが不確かである場合にのみ入力をより大きなモデルへ送る (Varshney と Baral, 2022)、そして FrugalGPT は、学習されたスコアラが回答を受け入れたときに停止する (Chen, Zaharia, Zou, 2023)。 Mixture of Limits は三点で異なる：ギアは任意のモデルの前に非ニューラル機構を含む；停止は学習されたスコアではなく述語 $C(z)$ である；コストはドルやレイテンシではなくレシート上のジュールである。

**回答を超えて費やす。** 推論モデルは、最初の正しい回答後もトークンを消費し続け、回答を変更しない (Chen et al., 2024)、また調査はより早く停止する手法を収集している (Sui et al., 2025)。 投機的デコーディング (Leviathan et al., 2023)、Mixture-of-Depths (Raposo et al., 2024)、量子化 (Frantar et al., 2022; Lin et al., 2024) およびページングされた KV キャッシュ (Kwon et al., 2023) は、モデルギアが実行される際のエネルギーを低減する。 それらは実行するかどうかを決定しない。

**式の回復。** AI Feynman (Udrescu と Tegmark, 2020)、SINDy (Brunton et al., 2016) および PySR (Cranmer, 2023) はデータから閉形式を回復する； AlphaGeometry (Trinh et al., 2024) と AlphaProof (Hubert et al., 2025) は提案者と記号的または Lean 検証器を組み合わせる。 各々は、生成器よりも低エネルギーでカバーされたタスクを完了する Formula または認証済み Solver ギアを生成する。

**モデル間のルーティング。** これらのシステムはどのモデルが回答するかを選択する。 いずれも非ニューラルギアを最初に試すことも、型付けされた理由で拒否することもしない。

| System | Title | ID | Class | ルーティングまたは加速対象 | エネルギーまたはコスト（報告されたもの） | 差分 |
|---|---|---|---|---|---|---|
| **RouteLLM** | *RouteLLM: Learning to Route LLMs with Preference Data* (arXiv); ICLR 2025 venue title uses *from Preference Data* | arXiv:[2406.18665](https://arxiv.org/abs/2406.18665) · ICLR 2025 | Preference router (strong↔weak LLM) | クエリ → 強い LLM または 弱い LLM | コスト / 品質 (API \$); 著者が報告 | Model↔model; Lookup/Formula のフロアなし; 型付けされた refuse-to-commit なし |
| **PEARL** (routing) | *PEARL: Performance and energy aware routing for LLMs* | DOI:[10.1016/j.future.2025.108218](https://doi.org/10.1016/j.future.2025.108218) · FGCS 176:108218 | エネルギー意識型マルチLLM ルーター | クエリ → エネルギー上限下の LLM (EMM がエネルギーを予測) | 著者はエネルギー意識型ルーティング (GPU/インフラ) を報告 | 依然としてモデルを選択; Mixture of Limits は任意のモデルの前に拒否する可能性あり |
| **GreenServ** | *GreenServ: Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference* | arXiv:[2601.17551](https://arxiv.org/abs/2601.17551) · ICPE 2026 | コンテキストバンドit マルチLLM ルーター | クエリ特徴 → LLM; 正確性 vs **測定 GPU エネルギー** (Zeus) | **メータリング** (著者の GPU Wh を Zeus で取得) が LLM プール上で実施 | モデルプールルーティング; Mixture of Limits カスケードは非ニューラルが先行 |
| **VoltanaLLM** | *VoltanaLLM: Energy-Efficient and SLO-Aware Disaggregated LLM Serving via Adaptive Frequency Control and State-Space Routing* | arXiv:[2509.04827](https://arxiv.org/abs/2509.04827) | P/D‑disagg サービング + 周波数 + 状態空間ルート | Prefill/デコード インスタンス + GPU 周波数 を TTFT/ITL SLO 下で制御 | **メータリング** (著者; pyNVML on A100/GH200) により最大周波数ベースラインと比較して最大約36.3% の E2E GPU エネルギー削減 (フィールドサービング結果) | **同一生成スタックのインスタンス** をルーティング; Mixture of Limits はデコードを開かないことがある |
| **HCSpec** | *HCSpec: Two-Tier Horizontal Cascade Speculative Decoding for High-Efficiency Large Language Model Inference* | DOI:[10.18653/v1/2026.acl-long.353](https://doi.org/10.18653/v1/2026.acl-long.353) · ACL 2026 | 推測デコード (draft↔target) | ポジション特化型 draft カスケード → target 検証 | レイテンシ速度向上 (EAGLE-3 / AR と比較) | 生成を高速化; フロアで生成を拒否しない |
| **CAS-Spec** | *CAS-Spec: Cascade Adaptive Self-Speculative Decoding for On-the-Fly Lossless Inference Acceleration of LLMs* | arXiv:[2510.26843](https://arxiv.org/abs/2510.26843) · NeurIPS 2025 | 自己推測カスケード (DSIA drafts) | target からの draft ステージ (スパース/量子化) + DyTC | レイテンシ速度向上 約1.1×‑2.3× AR (著者); ロスレストークン | モデル内部の draft 階層は Mixture of Limits のフロアとは異なる |
| **GCD** | *Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning* | arXiv:[2305.13971](https://arxiv.org/abs/2305.13971) · DOI:[10.18653/v1/2023.emnlp-main.674](https://doi.org/10.18653/v1/2023.emnlp-main.674) · EMNLP 2023 | 文法制約 LLM デコード | ログits を CFG にマスク | メータリングなし / 品質指標 | **トークン** を制約; Mixture of Limits は **コミット** を制約 |

<div id="ii7-baselines-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## II.7. ベースラインと反証

カスケード主張は、タスクあたりのジュール数をクロージャ率に対するフロンティアとして、1つの型付けされたタスク集合でテストされる。腕は次のとおりである：常に大規模モデル、常に小規模モデル、学習されたルーター（Ong et al., 2024）、スコア付けされたカスケード（Chen, Zaharia and Zou, 2023）、タスクあたり$p_i / c_i$を推定するセレクタ、そして各タスクに対して最も安価で十分な装置を知っているオラクルである。固定された Lookup → Formula → Solver → Model の順序は、その曲線がすべての腕の下にある場合にのみフロンティアを主張する。その順序は、測定された$p_i / c_i$がそれに沿って減少しないタスククラスで、セクション II.2 の導出により偽とされる。ハーネスの主張は、`mol prove` が記載されたリビジョンで 0 で終了しない場合に偽とされる。

<div id="ii8-limits" class="anchor-alias" aria-hidden="true"></div>

## II.8. 限界

ハーネスはソフトウェアにおける構成的存在である。第II部の図はメータ読取ではなく、カタログとランドアウアーエネルギーは推定値であり、`measured_j` はハーネス経路上で未設定である。最適順序の結果は独立したギアの結果を前提としているが、相関した故障は期待エネルギーを変化させ、条件付き確率を用いた第II.2節の全和が必要になる。通過確率 $p_i$ はタスククラスごとに推定しなければならず、推定誤差が順序を変動させる。第II.7節のフロンティア比較は実行されていない。

<div id="ii-references" class="anchor-alias" aria-hidden="true"></div>

## II. 参考文献

Bennett, C. H. (1973). Logical reversibility of computation. *IBM Journal of Research and Development* 17(6):525-532. https://doi.org/10.1147/rd.176.0525

Brunton, S. L., Proctor, J. L., and Kutz, J. N. (2016). Discovering governing equations from data by sparse identification of nonlinear dynamical systems. *PNAS* 113(15):3932-3937. https://doi.org/10.1073/pnas.1517384113

Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. arXiv:2305.05176.

Chen, X., et al. (2024). Do NOT Think That Much for 2+3=? On the Overthinking of o1-Like LLMs. arXiv:2412.21187.

CAS-Spec (2025). Cascade Adaptive Self-Speculative Decoding. NeurIPS. arXiv:2510.26843.

Cranmer, M. (2023). Interpretable Machine Learning for Science with PySR and SymbolicRegression.jl. arXiv:2305.01582.

Dean, T., and Boddy, M. (1988). An analysis of time-dependent planning. AAAI-88, 49-54.

Fedus, W., Zoph, B., and Shazeer, N. (2022). Switch Transformers. *JMLR* 23(120).

Frantar, E., et al. (2022). GPTQ. arXiv:2210.17323.

Geng, S., et al. (2023). Grammar-Constrained Decoding for Structured NLP Tasks without Finetuning. EMNLP. https://doi.org/10.18653/v1/2023.emnlp-main.674

GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. ICPE. arXiv:2601.17551.

HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. ACL. https://doi.org/10.18653/v1/2026.acl-long.353

Horowitz, M. (2014). Computing's energy problem (and what we can do about it). ISSCC. https://doi.org/10.1109/ISSCC.2014.6757323

Horvitz, E. J. (1987). Reasoning about beliefs and actions under computational resource constraints. UAI. arXiv:1304.2759.

Howard, R. A. (1966). Information value theory. *IEEE Transactions on Systems Science and Cybernetics* 2(1):22-26. https://doi.org/10.1109/TSSC.1966.300074

Hubert, T., et al. (2025). Olympiad-level formal mathematical reasoning with reinforcement learning. *Nature*. https://doi.org/10.1038/s41586-025-09833-y

Kwon, W., et al. (2023). Efficient Memory Management for Large Language Model Serving with PagedAttention. arXiv:2309.06180.

Landauer, R. (1961). Irreversibility and heat generation in the computing process. *IBM Journal of Research and Development* 5(3):183-191. https://doi.org/10.1147/rd.53.0183

Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. ICML.

Lin, J., et al. (2024). AWQ. MLSys. arXiv:2306.00978.

Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. arXiv:2406.18665.

PEARL (2025). Performance and energy aware routing for LLMs. *Future Generation Computer Systems* 176:108218. https://doi.org/10.1016/j.future.2025.108218

Raposo, D., et al. (2024). Mixture-of-Depths. arXiv:2404.02258.

Russell, S., and Wefald, E. (1991). Principles of metareasoning. *Artificial Intelligence* 49:361-395. https://doi.org/10.1016/0004-3702(91)90015-C

Shazeer, N., et al. (2017). Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer. ICLR. arXiv:1701.06538.

Simon, H. A., and Kadane, J. B. (1975). Optimal problem-solving search: all-or-none solutions. *Artificial Intelligence* 6(3):235-247. https://doi.org/10.1016/0004-3702(75)90002-8

Snell, C., Lee, J., Xu, K., and Kumar, A. (2024). Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters. arXiv:2408.03314.

Sui, Y., et al. (2025). Stop Overthinking: A Survey on Efficient Reasoning for Large Language Models. arXiv:2503.16419.

Trinh, T. H., et al. (2024). Solving olympiad geometry without human demonstrations. *Nature* 625:476-482. https://doi.org/10.1038/s41586-023-06747-5

Udrescu, S.-M., and Tegmark, M. (2020). AI Feynman. *Science Advances* 6(16). https://doi.org/10.1126/sciadv.aay2631

Varshney, N., and Baral, C. (2022). Model cascading. EMNLP. https://doi.org/10.18653/v1/2022.emnlp-main.756

Viola, P., and Jones, M. (2001). Rapid object detection using a boosted cascade of simple features. CVPR. https://doi.org/10.1109/CVPR.2001.990517

VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. arXiv:2509.04827.

Zilberstein, S. (1996). Using anytime algorithms in intelligent systems. *AI Magazine* 17(3).

<div id="ii-appendix-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## II. 付録. 再現性

```bash
cargo test --workspace
cargo run -p mol-cli -- prove   # expect 43 VERIFIED lines (A1 to A14 included), exit 0
cargo run -p mol-cli -- arena   # refresh the arena table from a real run only
```
