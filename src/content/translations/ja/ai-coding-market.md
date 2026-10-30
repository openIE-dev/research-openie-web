---
title: "約束された1兆ドルのAIコーディング市場"
deck: "AIコーディングに1兆ドル市場を予測しているのは誰か、各予測は何を数えているか、そしてどの予測もエネルギー、トークン、再利用について何を前提としているか。"
lang: "ja"
source: "ai-coding-market"
complete: true
---

<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*バージョン 1.1、2026年10月11日。データとコード：[research.openie.dev/data/](/data/#economics)。LaTeX PDF：[/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf)（[ソース](/pdfs/latex/ai-coding-market.tex)）。*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 要旨

予測によれば、AI コーディングは年に数兆ドルの価値をもつようになる。本エッセイは、誰がそう述べているかを列挙し、各数値にそれが何であるかのラベルを付け、予測に共通する前提を挙げる。

**平易な言葉で**

1. AI コーディングについての大きな数字の多くは将来についての推測であり、すでに稼がれたお金を数えたものではない。
2. そのほぼすべてが、新しいコードはどれも大きな AI モデルを必要とし、その代金は言葉ごとに、いつまでも支払われると前提している。
3. 動くコードを保存して再利用できるなら、繰り返される仕事のコストは、それを実行する電気のコストへと下がっていき、それらの予測は高すぎることになる。

<div id="1-projections-and-measurements-are-different-objects" class="anchor-alias" aria-hidden="true"></div>

## 1. 予測と測定は別の対象である

以下のすべての数値には、五つのラベルのいずれかが付く。

| ラベル | 意味 |
|---|---|
| **予測** | 明示された前提の上に立てた予測または価値の推計 |
| **企業発表** | 企業が自社について述べる数値。年換算ランレート収益（直近の月の12倍）や資金調達時の評価額など |
| **調査推計** | 購入者を対象とする調査に基づく市場規模の数値 |
| **提出書類** | 規制当局への提出書類にある数値 |
| **測定** | 成果物が保存されている実行から得た件数またはエネルギーの読み取り値。エネルギーの読み取り値には三つのラベルのいずれかが付く。`est_j` は分析的な推定値、`reported_j` はオペレーティングシステムまたはチップ上のカウンタ、`measured_j` は外部の電力計を表す |

正しい結果のコストについての証拠となるのは最後の行だけである。それ以外は、市場が何を期待しているかについての証拠である。

<div id="2-who-projects-what" class="anchor-alias" aria-hidden="true"></div>

## 2. 誰が何を予測しているか

<div id="21-developer-value-the-trillion" class="anchor-alias" aria-hidden="true"></div>

### 2.1 開発者の価値：1兆ドル

| 主張 | 数値 | ラベル | 出典 |
|---|---|---|---|
| 世界のソフトウェア開発者 | 約3,000万人（推計により2,700万人から4,700万人） | 予測の入力 | Appenzeller と Li [1] |
| 開発者1人あたり年間価値 | 10万ドル（仮定） | 予測の入力 | [1] |
| 年間の経済的貢献 | 約3兆ドル | 予測 | [1] |
| GitHub 上の開発者 | 1億8,000万人超。年間 5億1,870万件のプルリクエストがマージ | 企業発表 | GitHub Octoverse 2025 [17] |
| 63のユースケースにおける生成 AI の価値 | 年間2.6兆ドルから4.4兆ドル。ソフトウェア工学の生産性は、その職能の現在の年間支出の20%から45% | 予測 | McKinsey [15] |
| 生成 AI の世界 GDP への効果 | 10年間で7% | 予測 | Goldman Sachs [16] |
| 単純なアシスタントによる生産性向上 | 約20% | インタビューに基づく推計 | [1] |
| 最高水準の導入による生産性向上 | 「少なくとも2倍」 | 「逸話的な証拠に基づく」推計 | [1] |

開発者数は柔らかい数値である。3,000万人は専門職の推計であり、GitHub だけでもその6倍のアカウントがその上で開発している [17]。開発者1人あたりの価値と生産性の倍率も柔らかい（第2.7節）。McKinsey の2023年の推計がこの市場の最初の1兆ドルであり、それはすべての職能にわたる価値の推計である [15]。同じベンチャーキャピタルのエッセイは、AI コーディングのエコシステムが「数十社の10億ドル企業と、1兆ドル規模の巨人さえ支えうる」と述べる [1]。この一文が1兆ドルである。それは価値の推計である。収益の予測ではない。

<div id="22-tool-revenue-and-enterprise-spend" class="anchor-alias" aria-hidden="true"></div>

### 2.2 ツールの収益と企業支出

| 主張 | 数値 | ラベル | 出典 |
|---|---|---|---|
| AI コーディングツールへの企業支出、2025年 | 40億ドル、部門別 AI 支出の55% | 調査推計 | Menlo Ventures [2] |
| 生成 AI への企業支出、2025年 | 370億ドル | 調査推計 | [2] |
| AI コードツール市場、2026年 | 93.5億ドル、2031年までに299.6億ドル | 予測 | Mordor Intelligence [3] |

市場が今日報告している収益は数十億ドルの規模である。1兆ドルは、市場が獲得を望む価値である。

<div id="23-company-revenue-and-valuations" class="anchor-alias" aria-hidden="true"></div>

### 2.3 企業の収益と評価額

| 企業の主張 | 数値 | 日付 | ラベル | 出典 |
|---|---|---|---|---|
| Cursor の年換算収益 | 10億ドル超 | 2025年11月13日 | 企業発表 | Cursor [5] |
| Cursor Pro の価格改定 | リクエスト上限から「API 価格で月20ドル分のフロンティアモデル利用」へ。変更に伴う返金あり | 2025年6月から7月 | 企業発表 | Cursor [18] |
| Cursor シリーズ D | 23億ドル、ポストマネー評価額293億ドル | 2025年11月13日 | 企業発表 | [5] |
| Anthropic のランレート収益 | 140億ドル | 2026年2月12日 | 企業発表 | Anthropic [6] |
| Claude Code のランレート収益 | 25億ドル超 | 2026年2月12日 | 企業発表 | [6] |
| Anthropic シリーズ G | 300億ドル、ポストマネー評価額3,800億ドル | 2026年2月12日 | 企業発表 | [6] |

Anthropic は、この資金調達が「インフラの拡張」に充てられると述べている [6]。収益、評価額、計算資源は一つの賭けである。

図1は、第2.1節から第2.3節と第2.6節のドルの数値を一本の軸に置き、各出典が付けているラベルで区別する。

![本エッセイの表にあるドルの数値の対数目盛のドットチャート。予測：開発者の貢献は約 3 兆ドル、生成 AI の価値は 2.6 兆から 4.4 兆、世界の AI 支出は 1.5 兆、AI コードツール市場は 2026 年に 93.5 億、2031 年に 299.6 億。推計：設備投資は 4,000 億超。調査による推計：企業の生成 AI 支出は 370 億、AI コーディングツール支出は 40 億。企業の報告：Claude Code の年換算収益は 25 億超、Cursor は 10 億超。](/figures/ai-coding-market/spend-by-label.svg)

*図1. ラベル別のドルの数値。データ図、対数目盛。出典：Appenzeller と Li [1]、Menlo Ventures [2]、Mordor Intelligence [3]、Cursor [5]、Anthropic [6]、IEA [10]、McKinsey [15]、Gartner [24]。[PNG 版](/figures/ai-coding-market/spend-by-label.png)も用意している。*

<div id="24-inference-tokens-and-unit-economics" class="anchor-alias" aria-hidden="true"></div>

### 2.4 推論、トークン、単位経済性

| 主張 | 数値 | ラベル | 出典 |
|---|---|---|---|
| Google が月に処理するトークン | 9.7兆（2024年）、約480兆（2025年）、3.2京超（2026年5月） | 企業発表 | Pichai [8] |
| Google 社内の AI 開発者ツール | 2026年3月に1日5,000億トークン、5月には1日3兆超 | 企業発表 | [8] |
| 定価でのエージェント型コーディング問い合わせ1回のコスト | 2.50ドル：100,000 トークンのコンテキストと 10,000 出力トークン、100万トークンあたり15ドルと75ドル | 例示 | Appenzeller と Li [1] |
| 同じ条件で1時間3回、1日7時間、200日 | 開発者1人あたり年間約10,000ドル | 例示 | [1] |
| エージェント型コーディングのトークン量、コード推論とコードチャットとの比較 | 約1,000倍。同一タスクの実行間で最大30倍の差。トークン使用量の増加は「精度の向上にはつながらない」 | 測定（8モデル、SWE-bench Verified） | Bai、Huang、Wang [9] |
| Microsoft の OpenAI 投資による純損失、2025年9月30日終了四半期 | 税引前41億ドル、持分法による同社の持分、その他費用に計上。純利益の31億ドル減少（希薄化後1株あたり0.41ドル） | 提出書類および企業発表 | Microsoft Form 10-Q [7]; Microsoft FY26 Q1 performance [19] |

出典の中の二つの文が、経済性を率直に語っている。Pichai：「多くの企業がすでに年間のトークン予算を使い果たしつつあり、まだ5月だ」[8]。Appenzeller と Li：「何十年もの間、ソフトウェア開発のコストはほぼ純粋に人件費だったが、いまや LLM が相当な運用費の要素を加えている」[1]。

図2はトークンの系列を描く。

![Google が1か月に処理したトークン数の対数目盛の折れ線グラフ：2024 年に 9.7 兆、2025 年に約 480 兆、2026 年 5 月に 3.2 京超。いずれも企業の報告。](/figures/ai-coding-market/tokens.svg)

*図2. Google で1か月に処理されたトークン。データ図、企業の報告、対数目盛。出典：Pichai [8]。トークン使用についての注記は Bai、Huang、Wang [9] による。[PNG 版](/figures/ai-coding-market/tokens.png)も用意している。*

<div id="25-price-per-token" class="anchor-alias" aria-hidden="true"></div>

### 2.5 トークンあたりの価格

| 主張 | 数値 | ラベル | 出典 |
|---|---|---|---|
| 一定水準の AI 性能のコスト | 2023年以降、四半期ごとに約47%低下、年に約13分の1 | 測定された価格系列（5つのベンチマーク） | Epoch AI [4] |
| 一定のベンチマークスコアに到達する価格 | マイルストーンにより年に9分の1から900分の1へ低下。最も速い低下は最も新しく、持続するかは最も不確か | 測定された価格系列（対数線形のあてはめ） | Epoch AI [34] |
| 同等性能での推論コスト | 年に約10分の1：2021年の100万トークンあたり60ドルから0.06ドルへ | 推計 | Appenzeller、a16z [20] |
| DeepSeek API の値下げ、2025年9月29日 | 開発者のコストを「50%以上引き下げ」 | 企業発表 | DeepSeek [21] |

[4] の年13分の1は、広い範囲の中の一点である [34]。この低下は、DeepSeek の値下げが示すように、競争とオープンウェイトによって駆動されている [21]。それはエネルギーの会計を必要としない。これが第5節で述べる二つの低下のうちの第一である。再利用は、別の低下を加える。タスクあたりの呼び出し回数である。

図3は二つの価格系列を描く。

![一定の能力における100万トークンあたり価格の対数目盛のグラフ。a16z の推計は 2021 年の 60 ドルから 2024 年の 0.06 ドルへ下がり、年に約10分の1である。2023 年以来の年約13分の1という Epoch AI の傾きが、2023 年の10ドルを起点として破線で描かれている。](/figures/ai-coding-market/price-trend.svg)

*図3. 一定の能力水準の価格。データ図、対数目盛：a16z の端点は印刷されたとおり [20]。Epoch AI の線は 2023 年以来の年約13分の1という公表された速度 [4] で、傾きだけを示すために任意の起点に合わせている。マイルストーン別の範囲は Epoch AI [34] による。[PNG 版](/figures/ai-coding-market/price-trend.png)も用意している。*

<div id="26-energy-and-capital" class="anchor-alias" aria-hidden="true"></div>

### 2.6 エネルギーと資本

| 主張 | 数値 | ラベル | 出典 |
|---|---|---|---|
| データセンターの電力、2024年 | 約415 TWh、世界の電力の約1.5% | 推計 | IEA, *Energy and AI* [11] |
| データセンターの電力、2030年 | 約945 TWh、基本ケース | 予測 | [11] |
| データセンターの電力、2025年から2030年 | 485 TWh から 950 TWh、世界需要の約3% | 推計および予測 | IEA, *Key Questions on Energy and AI* [10] |
| 最大手テクノロジー企業の設備投資 | 2025年に4,000億ドル超、2026年にはさらに75%の増加見込み | 報告および予測 | [10] |
| Alphabet の設備投資 | 2022年に310億ドル。2026年は約1,800億から1,900億ドルの見込み | 企業発表およびガイダンス | Pichai [8] |
| タスクあたりのエネルギー | 年に少なくとも1桁の低下。推論型やエージェント型のタスクは「単純なテキスト生成より問い合わせあたり数百倍から数千倍のエネルギー」を使う | 推計 | [10] |
| 本番環境のアシスタントへの中央値のテキストプロンプト1回 | 0.24 Wh | 運営者による測定 | Elsworth et al. [12] |
| Stargate | 一つの研究所の AI インフラに4年間で5,000億ドル、うち1,000億ドルを即時投入 | 企業発表 | OpenAI [22] |
| 世界の AI 支出、2025年 | 約1.5兆ドル | 予測 | Gartner [24] |
| 設備投資が回収すべき収益 | 「AI's \$600B question」 | 分析 | Sequoia Capital [23] |

支払わねばならない賃料はハードウェアの賃料である。この規模の設備投資と契約は、エネルギーを上回る価格がつけられた利用を通じて回収される。再利用によって閉じることのできるタスクでは、その基盤はより小さい。

<div id="27-productivity-evidence" class="anchor-alias" aria-hidden="true"></div>

### 2.7 生産性の証拠

| 研究 | n | 設計 | 効果 | 出典 |
|---|---|---|---|---|
| a16z のエッセイ | インタビュー | 推計 | 単純なアシスタントで約20%。最高水準で「少なくとも2倍」 | [1] |
| GitHub Copilot、HTTP サーバーのタスク | 募集した開発者 | 対照実験 | 一つのおもちゃのタスクで55.8%速い | Peng et al. [27] |
| Google の企業内試験 | 96人のエンジニア | ランダム化比較試験 | タスクの所要時間が約21%短い | Paradis et al. [28] |
| METR、2025年初頭 | 経験豊富なオープンソース開発者16人、246タスク | ランダム化比較試験 | AI ありで19%遅い | Becker et al. [25] |
| METR、2026年の更新 | 新しいコホート | ランダム化比較試験 | 著者らは新しいデータを「信頼できない信号」と呼ぶ | METR [26] |

測定された効果は、19%の減速から、おもちゃのタスクでの56%の高速化まで幅がある。価値の推計の二つの因子、開発者数と生産性の倍率は、どちらも柔らかい。それは1兆ドルを弱める。また、より安いコーディングによって解き放たれる価値が、どれも既知の数ではないことも意味する。

<div id="3-what-the-projections-assume" class="anchor-alias" aria-hidden="true"></div>

## 3. 予測が前提としていること

まとめて読むと、予測は四つの前提に立っている。それぞれはソフトウェアの価値についてではなく、設計空間の一つの方向についての主張である。

1. **一つの方向：生成。** すべての変更はモデルが書く。価値の推計は生産性をモデルで拡大し、コストの例示はすべての問い合わせに価格をつける [1]。
2. **高エネルギーと高計算量。** トークン量、データセンターの電力、設備投資はともに伸びると予測される [8, 10, 11]。問い合わせあたりのエネルギーは下がり、タスクあたりのトークンはそれより速く増える [9, 10]。
3. **トークンごとの賃料。** 収益はトークンごと、またはコストがトークンであるシートごとに請求される。開発者1人の年間トークンコストは給与の規模になると予測される [1]。
4. **AI が永遠にループの中にいる。** タスク 10,000 のコストはタスク1と同じである。タスク1でモデルが学んだことは何一つ、タスク 10,000 でモデルなしには動かないからである。

1兆ドルを述べるエッセイは、その限界も述べている。「代替に基づく価格づけは初期の市場では機能するが、やがて財のコストはその限界費用に収束し、価格も同様である」[1]。本エッセイはこれに同意し、正しいコーディングタスクの限界費用はいくらかを問う。

<div id="4-what-a-correct-task-costs" class="anchor-alias" aria-hidden="true"></div>

## 4. 正しいタスクのコスト

一つのコーディングタスクについて、$C \in \{0, 1\}$ をその受け入れ検査（テストが通る、証明が検査を通る、あるいは出力が参照と一致する）の結果、$J$ を $C = 1$ に達するために使われるエネルギー（ジュール）、$c_J$ をエネルギーの価格（1ジュールあたりのドル）、$c_{\text{check}}$ を検査を実行するコスト（ドル）と定義する。購入者が支払うのは $C = 1$ に対してであり、トークンに対してではない。

**エネルギーが限界費用を下から押さえる。** 一回の実行の限界費用は少なくとも $c_J J$ である。電気を買わなければならないからである。競争の下では、価格は限界費用へと向かう [1, 14]。

**多くのコードは再利用される。** Gurevich は、すべての逐次アルゴリズムが逐次抽象状態機械、すなわち状態の集合と遷移規則によって捉えられることを証明した [35]。Lopes らは、GitHub 上のコードの約70%が以前に作成されたファイルのクローンからなることを測定した [36]。検査を通る解がすでに存在するところでは、タスクは解を再び生成するのではなく、それを取り出して検査することで閉じることができる。

**命題 E0（覆われたタスクの価格）。** 保存された解がその検査を通るとき、そのタスクは覆われているという。$J_{\text{floor}}$ を、その解を取り出し、適用し、検査するエネルギーとする。結果が同じ検査を通る売り手の間の競争の下で、覆われたタスクの価格は次の値へと向かう。

$$p_{\text{covered}} \to c_J \, J_{\text{floor}} + c_{\text{check}}.$$

生成が必要なのは覆われていないタスクだけである。覆われた割合が $f \in [0, 1]$ で、覆われていないタスクでの平均生成コストが $p_{\text{gen}}$ であるタスクの流れでは、タスクあたりの期待価格は $\bar p = f \, p_{\text{covered}} + (1 - f) \, p_{\text{gen}}$ である。割合 $f$ はまだ測定されていない（命題 E4）。

<div id="5-where-the-projections-are-fragile" class="anchor-alias" aria-hidden="true"></div>

## 5. 予測が脆いところ

**トークンごとの価格づけ。** 再利用によって閉じたタスクはトークンを必要としないので、トークンごとに価格づけされた収益の系統は、そのタスクでは何も稼がない。タスクの流れにおけるトークン収益の総額は $1 - f$ に比例する。

**あらゆるループの中のモデル。** 一度見つかった解が保存され検査されるなら、同じ形の後のタスクはモデルを必要としないので、タスクあたりのモデル呼び出しは $f$ が増えるにつれて減る。実際の仕事でそうなるかどうかは、命題 E3 によって測定される。

**タスクあたりのエネルギー。** 本番環境のアシスタントへの中央値のテキストプロンプト1回は、その運営者によって 0.24 Wh、すなわち 864 J と測定されており [12]、IEA は推論型やエージェント型の問い合わせを、単純な問い合わせの数百倍から数千倍のエネルギーとしている [10]。同じタスクで生成と検索を比較した公開の測定は存在しないので、ここでは比を示さない。

**二つの低下は掛け合わさる。** タスクあたりのコストを $p = n \cdot q$ と書く。$n$ はタスクあたりのモデル呼び出し回数、$q$ は呼び出しあたりのドルである。一定の性能における呼び出しあたりの価格は、タスクにより年に9分の1から900分の1へ下がる [4, 34]。再利用は $n$ を下げる。トークン量を外挿する予測は、$q$ しかモデル化していない。

**バンドル。** 限界費用がほぼゼロで、人々がすでに持っている道具を補完する財は、その道具にバンドルされる傾向があり、その独立した価格は消える [13, 14]。Nalebuff はバンドルが参入を阻みうることを示し [32]、Adams と Yellen はそれが価格差別を行いうることを示した [33]。Spolsky は補完財をコモディティ化する戦略を記述した [31]。価格づけの変化は目に見える。GitHub は2026年6月1日から Copilot の個人向けプランを利用量に基づく課金に移し [30]、Cursor は2025年に Pro をリクエスト上限から API 価格をそのまま転嫁する価格づけへ移した [18]。

**残るもの。** 第2.1節の価値の推計は成り立ちうる。脆いのは、その価値が生成への課金として回収されるという前提である。その課金は割合 $1 - f$ にしか適用されないからである。

<div id="6-demand" class="anchor-alias" aria-hidden="true"></div>

## 6. 需要

より安いタスクは総需要を押し上げうる。ベンチャーキャピタルのエッセイはそれを予期している。「この場合、ジェヴォンズのパラドックスは成り立つと我々は考える」[1]。二つの効果を分けるべきである。一つのタスクへの需要は $C = 1$ になった時点で止まる。それでも総利用は伸びうる。より安い仕事が新しいタスクを開くからである。公表されている唯一の弾力性は小さい。Anthropic の API 標本のタスク間では、コストが1%上がるごとに利用頻度が0.29%下がる関係があり、弾力性は $\varepsilon \approx -0.29$ である [29]。これはタスク間の横断的な関係であり、時間を通じた価格変化ではない。$|\varepsilon| < 1$ であれば、固定されたタスク集合での価格の低下は収益を下げる。収益 $R = pQ$ は $dR/R = (1 + \varepsilon)\, dp/p$ だけ変化するからである。

<div id="7-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 7. 命題とプロトコル

**命題 E1（コスト曲線は交差する）。** 一つのリポジトリにおけるタスクの流れについて、検査済みの解を保存して再利用する手法の解決タスクあたりの累積コストは、有限個のタスクの後に、すべての変更を生成する手法のそれを下回る。*プロトコル：* 両者を同じ課題の流れに対して外部の電力計の下で実行する。タスク番号ごとに解決タスクあたりの `measured_j` とドルを報告し、あわせて交差する番号を報告する。

**命題 E2（価格は下限に従う）。** あるコーディング能力が検索と規則によって閉じられるところでは、その定価は $c_J J_{\text{floor}} + c_{\text{check}}$ へと下がる。*プロトコル：* そのような能力クラスの定価を、測定された実行エネルギーと対比して時系列で追跡する。

**命題 E3（コストに占めるトークンの割合）。** 再利用が伸びるリポジトリでは、タスクのコストのうちトークンとして支払われる割合は下がる。*プロトコル：* 閉じたタスクあたりのトークン、ジュール、ドルをラウンドごとに記録し、ラウンドごとのコストに占めるトークンの割合を報告する。

**命題 E4（被覆率）。** 実際のコーディングタスク量のうち覆われた割合 $f$ は測定可能である。*プロトコル：* 公開リポジトリからマージ済みのプルリクエストを無作為に抽出し（GitHub は1年に5億1,870万件のマージを報告している [17]）、それぞれについて、リポジトリのテストを通る取り出された解があるかを検査し、$f$ を95%の Wilson 区間とともに報告する。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

[1] G. Appenzeller and Y. Li, "The Trillion Dollar AI Software Development Stack," 9 October 2025. https://a16z.com/the-trillion-dollar-ai-software-development-stack/

[2] Menlo Ventures, "2025: The State of Generative AI in the Enterprise," December 2025. https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/

[3] Mordor Intelligence, "AI Code Tools Market Size, Share and 2031 Growth Trends Report," fetched 11 October 2026. https://www.mordorintelligence.com/industry-reports/artificial-intelligence-code-tools-market

[4] B. Emberson and D. Roodman, "The plunging price of thought," Epoch AI, 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

[5] Cursor, "Past, Present, and Future" (Series D announcement), 13 November 2025. https://cursor.com/blog/series-d

[6] Anthropic, "Anthropic raises \$30 billion in Series G funding at \$380 billion post-money valuation," 12 February 2026. https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation

[7] Microsoft Corporation, Form 10-Q for the quarter ended 30 September 2025, Note 3 and Item 2. https://www.sec.gov/Archives/edgar/data/789019/000119312525256321/msft-20250930.htm

[8] S. Pichai, "I/O 2026: Welcome to the agentic Gemini era," 19 May 2026. https://blog.google/innovation-and-ai/sundar-pichai-io-2026/

[9] L. Bai, Z. Huang and X. Wang, "How Do AI Agents Spend Your Money? Analyzing and Predicting Token Consumption in Agentic Coding Tasks," 2026. arXiv:2604.22750. https://arxiv.org/abs/2604.22750

[10] International Energy Agency, *Key Questions on Energy and AI*, executive summary, 2026. https://www.iea.org/reports/key-questions-on-energy-and-ai/executive-summary

[11] International Energy Agency, *Energy and AI*, executive summary, April 2025. https://www.iea.org/reports/energy-and-ai/executive-summary

[12] C. Elsworth et al., "Measuring the environmental impact of delivering AI at Google Scale," 2025. arXiv:2508.15734. https://arxiv.org/abs/2508.15734

[13] Y. Bakos and E. Brynjolfsson, "Bundling Information Goods: Pricing, Profits, and Efficiency," *Management Science* 45(12), 1999. doi:10.1287/mnsc.45.12.1613

[14] C. Shapiro and H. R. Varian, *Information Rules: A Strategic Guide to the Network Economy*, Harvard Business School Press, 1998.

[15] McKinsey & Company, "The economic potential of generative AI: The next productivity frontier," June 2023. https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier

[16] Goldman Sachs, "Generative AI could raise global GDP by 7%," April 2023. https://www.goldmansachs.com/intelligence/pages/generative-ai-could-raise-global-gdp-by-7-percent.html

[17] GitHub, "Octoverse: A new developer joins GitHub every second as AI leads TypeScript to #1," 2025. https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/

[18] Cursor, "Clarifying our pricing," June 2025 pricing post. https://cursor.com/blog/june-2025-pricing

[19] Microsoft Investor Relations, FY26 Q1 Performance. https://www.microsoft.com/en-us/investor/earnings/fy-2026-q1/performance

[20] G. Appenzeller, "Welcome to LLMflation: LLM inference cost is going down fast," a16z, November 2024. https://a16z.com/llmflation-llm-inference-cost/

[21] DeepSeek, DeepSeek-V3.2-Exp release and API price reduction, 29 September 2025 (in Chinese). https://api-docs.deepseek.com/zh-cn/news/news250929

[22] OpenAI, "Announcing The Stargate Project," 21 January 2025. https://openai.com/index/announcing-the-stargate-project/

[23] D. Cahn, "AI's \$600B Question," Sequoia Capital, 2024. https://www.sequoiacap.com/article/ais-600b-question/

[24] Gartner, "Gartner Says Worldwide AI Spending Will Total \$1.5 Trillion in 2025," 17 September 2025. https://www.gartner.com/en/newsroom/press-releases/2025-09-17-gartner-says-worldwide-ai-spending-will-total-1-point-5-trillion-in-2025

[25] J. Becker, N. Rush, E. Barnes and D. Rein, "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity," METR, 2025. arXiv:2507.09089. https://arxiv.org/abs/2507.09089

[26] METR, uplift study update, 24 February 2026. https://metr.org/blog/2026-02-24-uplift-update/

[27] S. Peng, E. Kalliamvakou, P. Cihon and M. Demirer, "The Impact of AI on Developer Productivity: Evidence from GitHub Copilot," 2023. arXiv:2302.06590. https://arxiv.org/abs/2302.06590

[28] E. Paradis, K. Grey, Q. Madison et al., "How much does AI impact development speed? An enterprise-based randomized controlled trial," 2024. arXiv:2410.12944. https://arxiv.org/abs/2410.12944

[29] Anthropic, "Anthropic Economic Index report: Uneven geographic and enterprise AI adoption," September 2025. https://www.anthropic.com/research/anthropic-economic-index-september-2025-report

[30] GitHub Japan blog, "GitHub Copilotの個人向けプラン: ProとPro+へのフレックス枠追加と新しいMaxプランのご紹介," 15 May 2026 (in Japanese). https://github.blog/jp/2026-05-15-github-copilot-individual-plans-introducing-flex-allotments-in-pro-and-pro-and-a-new-max-plan/

[31] J. Spolsky, "Strategy Letter V," Joel on Software, 12 June 2002. https://www.joelonsoftware.com/2002/06/12/strategy-letter-v/

[32] B. Nalebuff, "Bundling as an Entry Barrier," *Quarterly Journal of Economics* 119(1), 2004. doi:10.1162/003355304772839551

[33] W. J. Adams and J. L. Yellen, "Commodity Bundling and the Burden of Monopoly," *Quarterly Journal of Economics* 90(3), 1976. doi:10.2307/1886045

[34] Epoch AI, "LLM inference prices have fallen rapidly but unequally across tasks," data insight. https://epoch.ai/data-insights/llm-inference-price-trends

[35] Y. Gurevich, "Sequential abstract-state machines capture sequential algorithms," *ACM Transactions on Computational Logic* 1(1), 2000, pp. 77 to 111. doi:10.1145/343369.343384

[36] C. V. Lopes, P. Maj, P. Martins, V. Saini, D. Yang, J. Zitny, H. Sajnani and J. Vitek, "DéjàVu: a map of code duplicates on GitHub," *Proceedings of the ACM on Programming Languages* 1(OOPSLA), 2017, article 84. doi:10.1145/3133908
