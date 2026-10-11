---
title: "約束された1兆ドルのAIコーディング市場"
deck: "誰がAIコーディング市場を予測し、何を予測し、各予測が何を前提としているか。前提は、自律的なコンピュータ自動化が一つの方向にしか進まないこと、すなわち高エネルギー、高計算量、トークン単位の賃料、そしてモデルが永遠にループの中にいる方向へ進むことである。自律的コーディングはいくつもの連続的な軸をもつ設計空間であり、Reality Code Engine（RCE）はその中で軸を最適化する一つの点を測定する。それはネイティブなコードエコシステムであり、プログラムは意図から一度だけ可逆な形式として書かれ、すべての対象言語はその忠実な射影である。事前登録した 10,000 個の形式において、モデル呼び出し 0 回で、すべての形式は往復して同一のバイトに戻り、すべての不正な入力は入口で拒否される。ゲートを通過したすべての適合は再利用されるので、覆われたタスクの限界費用はそれを実行するエネルギーへと下がり、予測は基盤を失う。"
lang: "ja"
source: "ai-coding-market"
complete: true
---

<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*バージョン 1.1、2026年10月11日。データとコード：[research.openie.dev/data/](/data/#economics)。LaTeX PDF：[/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf)（[ソース](/pdfs/latex/ai-coding-market.tex)）。*

*[『Reality Code Engine：ネイティブで検証済み、低エネルギーなプログラミングのためのひとつの可逆な形式』](/papers/rce/) の経済学の姉妹編。研究論文は工学、理論、測定を扱う。本エッセイは理論と経済学が出会う場所である。*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 要旨

1兆ドルの AI コーディング市場は、David Charlot による根拠ある誇張的主張であり、実際の予測はその規模を裏づけている。あるベンチャーキャピタルの推計は、世界のソフトウェア開発者の価値を年間約3兆ドルとし、AI コーディングを「1兆ドル規模の巨人さえ」支えうる市場と呼ぶ [1]。AI コーディング企業2社は、1年の間を置いて、それぞれ10億ドル超と25億ドル超の年換算収益を報告した [5, 6]。あるフロンティア研究所の評価額は3,800億ドルで、そのコーディング製品が看板である [6]。ある提供者のトークン量は、2年で月9.7兆から月3.2京超へと増えた [8]。最大手テクノロジー企業の設備投資は2025年に4,000億ドルを超えた [10]。

これらの予測はどれも同じことを前提としている。自律的なコンピュータ自動化の空間には方向が一つしかない、ということである。その方向に沿って、エネルギー、計算量、エントロピーはそろって上がり、あらゆるタスクのループにモデルが座り、あらゆるタスクがトークンごとに賃料を払う。空間にはそれより多くの方向がある。手法は連続的な軸の上に置かれる。タスクあたりのエネルギー、エントロピーと決定性、検証の強さ、再利用と複利、そしてモデル依存である。多くの組み合わせがあり、実際のシステムはいくつかを混ぜている。この物語の誤りは、どれか一つの手法にあるのではない。空間に方向が一つしかないという前提にある。

[RCE 研究論文](/papers/rce/) は、その空間の一つの点を測定する。五つの軸すべてを同時に最適化するように選ばれた点である。RCE はネイティブなコードエコシステムである。プログラムは意図から一度だけ、形式として書かれる。形式とは状態、イベント、純粋な遷移の可逆な符号化であり、すべての対象言語はその忠実な射影である。形式が宣言していない状態は書くことができないので、誤ったプログラムは後で見つけて直されるのではなく、入口で拒否される。ゲートを通過したすべての適合は保存されて再利用されるので、エコシステムは複利的に積み上がる。事前登録した 10,000 個の形式において、エンジンを凍結しモデル呼び出し0回で、すべての形式は往復して同一のバイトに戻り、すべての射影は決定的であり、すべての不正な入力は入口で拒否され、Python への射影は 9,999 個で参照トレースを再現する（[RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n)）。他の言語のコードは持ち上げによって入り、持ち上げたコードでは、修復のギアがモデル呼び出し0回で1トークン障害 520,821 件中 520,541 件と、Java の単一文バグ 21,320 件の 63.7% を修復する（[RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)）。RCE がタスクを覆うところでは、そのタスクの限界費用はそれを実行するエネルギーへと下がり、生成に基づいて価格づけされた市場は、そのタスクでの基盤を失う。本エッセイは予測と測定を分け、各予測が何を前提としているかを示し、どこで破綻するかを述べる。

**全論文に共通の命題を一度だけ述べる。** 実行に要するエネルギーこそがコンピュータ知能の唯一の真の尺度である。他のすべての要因はゼロに崩れる。ゲートの形式がその意味を定める。タスクの完全性述語 $C(z)$ を、定められた予算と期限の中で満たす実行のうち、システムは完了までのジュール $J^*$ によって順位づけられる。正しさ、期限、タスクの大きさはゲートであって、スコアの項ではない。パラメータ、トークン、ベンチマークスコア、価格は順位づけにおいて重みゼロである（[エージェンシー、第1節](/papers/agency/#1-thesis)）。推定値は決して `measured_j` ではない。

**価格は、経済学の姉妹編のための別個の主張である。** 価格の傾向は別個の主張であり、そのように表示する。Epoch AI は、一定水準の AI 性能のコストが2023年以降、四半期ごとに約47パーセント、年に約13分の1へと下がったと報告している（Emberson と Roodman、*The plunging price of thought*、2026年9月22日）。この傾向が続けば、エネルギーが推論の支配的な限界費用になる。これは条件つきで引用された傾向であって、測定された崩壊ではない。[『スペルチェックはグローバルである』](/papers/spellcheck/) は、ある種のコンピュータ知能がバンドルされた価格ゼロのコモディティになることの存在証明である。これらの姉妹編が用いる理論は、[エージェンシー論文](/papers/agency/)、[『計量コミットゲート』](/papers/gates/)、[Reality Code Engine](/papers/rce/) にある。

<div id="1-projections-and-measurements-are-different-objects" class="anchor-alias" aria-hidden="true"></div>

## 1. 予測と測定は別の対象である

以下のすべての数値には、五つのラベルのいずれかが付く。

| ラベル | 意味 |
|---|---|
| **予測** | 明示された前提の上に立てた予測または価値の推計 |
| **企業発表** | 企業が自社について述べる数値。年換算ランレート収益（直近の月の12倍）や資金調達時の評価額など |
| **調査推計** | 購入者を対象とする調査に基づく市場規模の数値 |
| **提出書類** | 規制当局への提出書類にある数値 |
| **測定** | 成果物が保存されている実行から得た件数またはエネルギーの読み取り値。RCE では、エネルギーには独自のラベル `est_j`、`reported_j`、`measured_j` が付く |

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

図1は第2.1節から第2.3節と第2.6節のドル額を、各出典の区分ごとに一本の軸に並べる。

![対数目盛の点グラフ：ドル額は約10億から約3兆まで。予測、推定値、調査による推定、企業の自己申告で色分けしている。](/figures/ai-coding-market/spend-by-label.svg)

*図1. 区分別のドル額。データ図、対数目盛。出典：[1]、[2]、[3]、[5]、[6]、[10]、[15]、[24]。 [PNG 版](/figures/ai-coding-market/spend-by-label.png)も用意している。*

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

![Google が月に処理するトークンの対数目盛の折れ線：2024年に 9.7 兆、2025年に約 480 兆、2026年5月に 3.2 京超。](/figures/ai-coding-market/tokens.svg)

*図2. Google が月に処理するトークン。データ図、企業の自己申告、対数目盛。出典：Pichai [8]。トークン使用量に関する注記は Bai、Huang、Wang [9] による。 [PNG 版](/figures/ai-coding-market/tokens.png)も用意している。*

<div id="25-price-per-token" class="anchor-alias" aria-hidden="true"></div>

### 2.5 トークンあたりの価格

| 主張 | 数値 | ラベル | 出典 |
|---|---|---|---|
| 一定水準の AI 性能のコスト | 2023年以降、四半期ごとに約47%低下、年に約13分の1 | 測定された価格系列（5つのベンチマーク） | Epoch AI [4] |
| 一定のベンチマークスコアに到達する価格 | マイルストーンにより年に9分の1から900分の1へ低下。最も速い低下は最も新しく、持続するかは最も不確か | 測定された価格系列（対数線形のあてはめ） | Epoch AI [34] |
| 同等性能での推論コスト | 年に約10分の1：2021年の100万トークンあたり60ドルから0.06ドルへ | 推計 | Appenzeller、a16z [20] |
| DeepSeek API の値下げ、2025年9月29日 | 開発者のコストを「50%以上引き下げ」 | 企業発表 | DeepSeek [21] |

[4] の年13分の1は、広い範囲の中の一点である [34]。この低下は、DeepSeek の値下げが示すように、競争とオープンウェイトによって駆動されている [21]。それはエネルギーの会計を必要としない。これが第6節の第一の低下である。再利用は、別の低下を加える。タスクあたりの呼び出し回数である。

図3は二つの価格系列を描く。

![固定能力での100万トークンあたり価格の対数グラフ：2021年の 60 ドルから2024年の 0.06 ドルへ。2023年以降の年約13倍の傾きも示す。](/figures/ai-coding-market/price-trend.svg)

*図3. 一定水準の能力の価格。データ図、対数目盛：a16z の端点は公表どおり [20]。Epoch AI の直線は2023年以降の年約13倍という公表値 [4] で、傾きを示すためだけに指数化している。マイルストーン別の幅は Epoch AI [34] による。 [PNG 版](/figures/ai-coding-market/price-trend.png)も用意している。*

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
| 設備投資が回収すべき収益 | 「AI's $600B question」 | 分析 | Sequoia Capital [23] |

支払わねばならない賃料はハードウェアの賃料である。この規模の設備投資と契約は、エネルギーを上回る価格がつけられた利用を通じて回収される。それが、再利用が覆われたタスクで取り除く基盤である。

図4は送電網での予測電力と、タスクで測定したジュールを並べる。

![二つのパネル：データセンターの電力、2024年に 415 TWh、2030年予測 945 TWh。対数目盛で、中央値のテキスト要求一回 864 ジュールと、RCE が解いた修復タスク 0.026 から 0.40 ジュール。](/figures/ai-coding-market/energy.svg)

*図4. 送電網とタスクでのエネルギー。データ図。パネル a：IEA の推定値と予測 [10, 11]。パネル b、対数目盛：中央値のテキスト要求一回、運営者の測定で 0.24 Wh [12]。RCE が解いた修復タスク、`est_j` と `reported_j`。二つのパネルは単位が異なり、互いに換算しない。 [PNG 版](/figures/ai-coding-market/energy.png)も用意している。*

<div id="27-productivity-evidence" class="anchor-alias" aria-hidden="true"></div>

### 2.7 生産性の証拠

| 研究 | n | 設計 | 効果 | 出典 |
|---|---|---|---|---|
| a16z のエッセイ | インタビュー | 推計 | 単純なアシスタントで約20%。最高水準で「少なくとも2倍」 | [1] |
| GitHub Copilot、HTTP サーバーのタスク | 募集した開発者 | 対照実験 | 一つのおもちゃのタスクで55.8%速い | Peng et al. [27] |
| Google の企業内試験 | 96人のエンジニア | ランダム化比較試験 | タスクの所要時間が約21%短い | Paradis et al. [28] |
| METR、2025年初頭 | 経験豊富なオープンソース開発者16人、246タスク | ランダム化比較試験 | AI ありで19%遅い | Becker et al. [25] |
| METR、2026年の更新 | 新しいコホート | ランダム化比較試験 | 著者らは新しいデータを「信頼できない信号」と呼ぶ | METR [26] |

測定された効果は、19%の減速から、おもちゃのタスクでの56%の高速化まで幅がある。価値の推計の二つの因子、開発者数と生産性の倍率は、どちらも柔らかい。それは1兆ドルを弱める。また、再利用が解き放つ価値が既知の数であるというどんな主張も弱める。

<div id="3-what-the-projections-assume" class="anchor-alias" aria-hidden="true"></div>

## 3. 予測が前提としていること

まとめて読むと、予測は四つの前提に立っている。それぞれはソフトウェアの価値についてではなく、設計空間の一つの方向についての主張である。

1. **一つの方向：生成。** すべての変更はモデルが書く。価値の推計は生産性をモデルで拡大し、コストの例示はすべての問い合わせに価格をつける [1]。
2. **高エネルギーと高計算量。** トークン量、データセンターの電力、設備投資はともに伸びると予測される [8, 10, 11]。問い合わせあたりのエネルギーは下がり、タスクあたりのトークンはそれより速く増える [9, 10]。
3. **トークンごとの賃料。** 収益はトークンごと、またはコストがトークンであるシートごとに請求される。開発者1人の年間トークンコストは給与の規模になると予測される [1]。
4. **AI が永遠にループの中にいる。** タスク 10,000 のコストはタスク1と同じである。タスク1でモデルが学んだことは何一つ、タスク 10,000 でモデルなしには動かないからである。

1兆ドルを述べるエッセイは、その限界も述べている。「代替に基づく価格づけは初期の市場では機能するが、やがて財のコストはその限界費用に収束し、価格も同様である」[1]。本エッセイはこれに同意し、正しいコーディングタスクの限界費用はいくらかを問う。

<div id="4-the-theory-that-prices-the-task" class="anchor-alias" aria-hidden="true"></div>

## 4. タスクに価格をつける理論

[RCE 研究論文](/papers/rce/) は、問いを量に変える三つの結果を与える。

**正しさがゲートである。** タスクは、その完全性述語 $C(z)$ が成り立つときに完了する。すなわちテストが通る、証明が存在する、あるいは一致トレースが合致する場合である（[RCE §1](/papers/rce/#1-thesis)）。購入者が支払うのは $C(z) = 1$ に対してであり、トークンに対してではない。

**ジュールが順位である。** ゲートを通過するシステムのうち、完了までのジュール $J^*$ が最も少ないものが勝つ（[エージェンシー §1](/papers/agency/#1-thesis)）。競争的な市場では、同じゲートを通過する売り手はコストで競い、タスクのコストの下限は、それを完了するエネルギーに証明の価格を加えたものである。

**形式は一度書かれ、再利用される。** エコシステムのプログラムは意図から一度だけ形式として書かれ、すべての対象はその射影である。したがって適合の費用は一度だけ支払われ、以後のすべての使用はハンドラの下限で実行される（[RCE §1](/papers/rce/#1-thesis)）。**ほとんどの適合はすでに存在する。** プログラムは組 $P = (S, E, \delta, D, \lambda)$ であり、Gurevich の抽象状態機械の定理により、すべての逐次アルゴリズムはこの形をもつ（[RCE §3](/papers/rce/#3-the-form)）。プログラムは適合において異なり、ほとんどの適合はすでに存在する。「GitHub 上のコードの70%は、以前に作成されたファイルのクローンからなる」（[RCE §7](/papers/rce/#7-reuse-evidence)）。同等の適合は同じゲートを通過するので、抽出は最もジュールの少ないものを選ぶ（RCE 命題3）。

**命題 E0（覆われたタスクの価格）。** 保存された適合がゲートを通過するとき、そのタスクは覆われているとする。ゲートを通過する売り手の間では、競争によって覆われたタスクの価格は $c_J \cdot J^*_{\text{floor}} + c_{\text{proof}}$ へと向かう。ここで $c_J$ は1ジュールの価格、$J^*_{\text{floor}}$ は適合を取り出し、適用し、検査するエネルギー、$c_{\text{proof}}$ は検査のコストである。生成は覆われていないタスクでのみ入ってくる。

Mixture of Limits はこの命題の背後にある哲学である。タスクを成し遂げるには何であれ最小の量があり、それ以上はすべて浪費である（[『計量コミットゲート』第II部](/papers/gates/#part-ii-the-cascade-mixture-of-limits)）。下限を超えるトークンごとの賃料は、浪費に対して請求している。

<div id="5-the-measurements" class="anchor-alias" aria-hidden="true"></div>

## 5. 測定

これらは測定であり、RCE が付けるとおりにラベルを付けている。出典は [RCE 研究論文](/papers/rce/) である。最初の行はエコシステムそのものを測定し、続く行は他の言語から持ち上げたコードの修復を測定する（[RCE §6](/papers/rce/#6-lift-entering-the-ecosystem-from-other-languages)）。

| 測定 | 結果 | ラベル | 場所 |
|---|---|---|---|
| 形式エコシステム、事前登録した 10,000 個の形式、可逆な往復と決定的な射影 | 10,000 個中 10,000 個、モデル呼び出し0回 | 測定された件数 | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| 形式エコシステム、不正な入力と仕様を入口で拒否 | 10,000 個中 10,000 個、モデル呼び出し0回 | 測定された件数 | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| 形式エコシステム、Python への射影が参照トレースをバイト単位で再現 | 10,000 個中 9,999 個、モデル呼び出し0回 | 測定された件数 | [RCE §2.3](/papers/rce/#23-the-ecosystem-at-large-n) |
| 持ち上げたコード、L0 1トークン障害、9つの実在リポジトリ、保留テスト分割 | 520,821 件中 520,541 件（0.9995、95% CI 0.9994 から 0.9995）、モデル呼び出し0回 | 測定された件数 | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| 持ち上げたコード、L0、調整に一度も使っていない4つのリポジトリ | 23,015 件中 23,015 件（95% CI 0.9998 から 1.0000）、モデル呼び出し0回 | 測定された件数 | [RCE §6.1](/papers/rce/#61-l0-one-token-faults) |
| 持ち上げたコード、L1 Java、ManySStuBs4J 2.0、保留、ファイル全体 | 21,320 件中 13,586 件（0.637、0.631 から 0.644）、モデル呼び出し0回。ハンクのみでは 24,072 件中 9,288 件（0.386） | 測定された件数 | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| 持ち上げたコード、L1 Python、TSSB-3M v1.0.0、保留 | 157,089 件中 27,266 件（0.174、0.172 から 0.175）、モデル呼び出し0回 | 測定された件数 | [RCE §6.2](/papers/rce/#62-l1-one-statement-bugs-from-real-histories) |
| 解決タスクあたりのエネルギー、全段 | 0.10 J から 0.40 J | `est_j`（CPU 秒 × 10 W） | [RCE §6.3](/papers/rce/#63-energy) |
| 解決タスクあたりのエネルギー、RAPL 部分標本 | 0.056 J（L0、3,000 タスク）、0.026 J（L1、2,000 件中 690 件解決）。実行合計に ±10 J | `reported_j`（パッケージカウンタから明示したアイドル基準値を差し引いたもの） | [RCE §6.3](/papers/rce/#63-energy) |

`measured_j` は壁面電力計のために予約されており、どの行でも空である。

<div id="6-where-the-projections-break" class="anchor-alias" aria-hidden="true"></div>

## 6. 予測が破綻するところ

**トークンごとの賃料は、覆われたタスクで破綻する。** 形式として書かれたプログラムは、0トークンですべての対象にコンパイルされる。事前登録した 10,000 個の形式のうち 10,000 個が、モデル呼び出しを一度も行わずにコンパイルされ、射影され、ゲートを通過した [RCE §2.3]。持ち上げたコードでも、覆われた修復はどれも0トークンしか買わなかった。1トークンの修復 520,541 件と、実際の履歴に由来する単一文の修復 40,852 件である [RCE §6.1, §6.2]。トークンごとに価格づけされた収益の系統は、トークンを必要としないタスクでは何も稼がない。

**AI が永遠にループの中にいるという前提は、昇格で破綻する。** モデルには新しいケースに対して一度だけ支払われる。ゲートはその適合をハンドラとして受け入れ、同じ形の後のケースはモデルなしで閉じる（[RCE §4.2](/papers/rce/#42-the-gears)）。それが成り立つところでは、タスク 10,000 はタスク1のコストを要しない。実際の仕様にわたってラウンドあたりのモデル呼び出しがゼロに達するかどうかは、[RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n) により大きな N で測定される。

**正しい結果に高エネルギーは必要ない。** 保留した修復は、パッケージカウンタ上で解決タスクあたり 0.026 から 0.056 の報告ジュールで、モデルなしにゲートを通過した [RCE §6.3]。本番環境のアシスタントへの中央値のテキストプロンプト1回は 0.24 Wh、すなわち 864 J と測定されている [12]。エージェント型のコーディングタスクは多くのプロンプトを使い、IEA はエージェント型の問い合わせを単純な問い合わせの数百倍から数千倍のエネルギーとしている [10]。これらは異なる機械上の異なるタスクなので、比ではない。プロトコル E1 の下で検証すべき桁数である。

**被覆率はクラスごとに測る。** 各段はタスクのクラスの中での被覆率を与える。ほぼすべての1トークン障害と、単一文バグの 63.7%（Java、ファイル全体。ハンクのみでは 38.6%）および 17.4%（Python）であり、未解決のケースは意図ビットがハンクの外にあるか、新しいものである（[RCE §6.0](/papers/rce/#60-the-repair-ladder-on-lifted-code)）。実際のコーディング量全体のうち、覆われたクラスに入る割合が命題 E5 である。

**二つの低下は掛け合わさる。** 呼び出しあたりの価格は、一定の性能において、タスクにより年に9分の1から900分の1へ下がる [4, 34]。昇格は、覆われたケースでタスクあたりの呼び出しをゼロにする [RCE §8.6]。タスクあたりのコストは両者の積である。トークン量を外挿する予測は、最初の低下にしか価格をつけていない。

**スペルチェックの型。** [『スペルチェックはグローバルである』](/papers/spellcheck/) は、限界費用がほぼゼロに下がり、誰もがすでに持っていた道具を補完した能力を記録している。それはエディタにバンドルされ、独立した価格は消えた。バンドルの経済学が予測するとおりである [13, 14]。覆われたコーディングタスクも同じ二つの性質をもつ。限界費用はハンドラの下限まで下がり、人々がすでに持っているエディタとリポジトリを補完する。予測も同じである。覆われたタスクはバンドルされ、価格が残るのは覆われていないケースと証明である。

**プラットフォーム所有者によるバンドル。** スペルチェックの型には所有者がいる。バンドルを作るのは、エディタ、リポジトリ、クラウドを所有する者である。Spolsky はこの戦術を「補完財をコモディティ化せよ」と名づけた [31]。Nalebuff はバンドルが参入を阻みうることを示し [32]、Adams と Yellen はそれが価格差別を行うことを示した [33]。それは起きている。GitHub は2026年6月1日から Copilot の個人向けプランを利用量に基づく課金に移し [30]、Cursor は2025年に Pro をリクエスト上限から API 価格のそのままの転嫁に移した [18]。プラットフォームはモデル層を無償で提供し、賃料を IDE とクラウドに残すことができる。エネルギーで価格づけされたエンジンが価格ゼロのバンドルと競えるのは、ゲートがそれに開かれているところ、すなわちテスト、証明、レシートがプラットフォームではなく購入者のものであるところだけである。

**多くの言語に代わる一つの形式。** RCE 論文は、すべての言語を射影とし、すべてのプログラムを持ち上げとする普遍的な形式が、他のあらゆる言語の必要を置き換えるという命題を述べる（[RCE §3.6](/papers/rce/#36-one-ecosystem-lossless-and-the-universality-thesis)）。市場にとっての読み方はこうである。予測が数える支出の大部分は、言語、フレームワーク、およびそれらのバージョンの間の翻訳と、食い違う実装の調停である。プログラムが一度書かれ、すべての対象が出力されるエコシステムでは、その支出には買うべきタスクがない。普及の程度は未確定の量であり、それは市場の問題であって定理ではない。

**残るもの。** 第2.1節の価値の推計は成り立ちうる。開発者はより多くを生み出せる。破綻するのは、その価値が生成への賃料として獲得されるという主張である。結論は条件つきである。被覆率が高く、プラットフォームがバンドルしないところでは、下がっていく限界費用で生み出された価値は、ゲート、証明、低エントロピーの床を握る者へ行き、その多くは購入者へ行く。プラットフォームがバンドルするところでは、証拠はゲートを握るのがプラットフォームであることを示している。

<div id="7-demand" class="anchor-alias" aria-hidden="true"></div>

## 7. 需要

より安いタスクは総需要を押し上げうる。ベンチャーキャピタルのエッセイはそれを予期している。「この場合、ジェヴォンズのパラドックスは成り立つと我々は考える」[1]。[『AI需要におけるタスク飽和と総量リバウンド』](/papers/satiation/) は二つの効果を分ける。タスクあたりの欲求は完全性述語で止まる。それでも総利用は伸びうる。より安い合成が新しいタスクを開くからである。再利用は第一の効果を変え、第二の効果は開いたままにする。覆われたタスクのより大きな市場とは、限界費用がフロンティアではなく下限である市場である。公表されている唯一の弾力性は小さい。Anthropic の API 標本のタスク間では、コストが1%上がるごとに利用頻度が0.29%下がる関係がある [29]。これはタスク間の横断的な関係であり、時間を通じた価格変化ではない。そのまま読めば需要は非弾力的である。価格の低下は固定されたタスク集合での収益を縮め、それは賃料についての本エッセイの読みを支持し、価格の低下だけでコーディングがはるかに多く使われるようになるわけではない。

<div id="8-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 8. 命題とプロトコル

**命題 E1（コスト曲線は交差する）。** 一つのリポジトリにおけるタスクの流れについて、RCE の解決タスクあたりの累積コストは、有限個のタスクの後に生成エージェントのそれを下回る。*プロトコル：* [RCE プロトコル 8.3](/papers/rce/#83-a-wall-meter) と素朴な生成エージェントを、同じ課題の流れに対して壁面電力計の下で実行する。タスク番号ごとの解決タスクあたりの `measured_j` とドル、および交差する番号を報告する。

**命題 E2（価格は下限に従う）。** あるコーディング能力が検索と規則によって覆われるところでは、その市場価格は、それを実行するエネルギーに証明のコストを加えたものへと下がる。*プロトコル：* スペルチェックの価格系列にならい、覆われた能力クラスの定価を、測定された実行エネルギーと対比して時系列で追跡する。

**命題 E3（覆われたタスクでは計算規模は堀にならない）。** RCE が覆うタスクでは、解決率は最後のギアの計算量とともに上がらない。*プロトコル：* [RCE プロトコル 8.2](/papers/rce/#82-swe-bench-lite-offline) を、モデルなし、小さなローカルモデル、フロンティアモデルをそれぞれ最後のギアとして実行する。最後のギアより前に閉じたタスクで解決率を比較する。

**命題 E4（収益に占めるトークンの割合）。** 被覆率が伸びるリポジトリでは、タスクのコストのうちトークンとして支払われる割合は被覆率とともに下がる。*プロトコル：* 価格のついたモデルリゾルバを用いる RCE の収束プロトコルで、閉じたタスクあたりのトークン、ジュール、ドルをラウンドごとにラベルつきで記録し（[RCE §8.6](/papers/rce/#86-convergence-of-model-calls-at-large-n)）、ラウンドごとのコストに占めるトークンの割合を報告する。

**命題 E5（被覆率）。** 実際のコーディングタスク量のうち、RCE が覆うクラスに入る割合は測定可能である。*プロトコル：* 公開リポジトリからマージ済みのプルリクエストを無作為に抽出し（GitHub は1年に 5億1,870万件のマージを報告している [17]）、凍結した G0 から G2 のギアがゲートを通過するパッチを生成するかどうかでそれぞれを分類し、覆われた割合を95%区間とともに報告する。その数値が得られるまで、命題 E0 は測定されていない割合に適用される。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

[1] G. Appenzeller and Y. Li, "The Trillion Dollar AI Software Development Stack," 9 October 2025. https://a16z.com/the-trillion-dollar-ai-software-development-stack/

[2] Menlo Ventures, "2025: The State of Generative AI in the Enterprise," December 2025. https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/

[3] Mordor Intelligence, "AI Code Tools Market Size, Share and 2031 Growth Trends Report," fetched 11 October 2026. https://www.mordorintelligence.com/industry-reports/artificial-intelligence-code-tools-market

[4] B. Emberson and D. Roodman, "The plunging price of thought," Epoch AI, 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

[5] Cursor, "Past, Present, and Future" (Series D announcement), 13 November 2025. https://cursor.com/blog/series-d

[6] Anthropic, "Anthropic raises $30 billion in Series G funding at $380 billion post-money valuation," 12 February 2026. https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation

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

[23] D. Cahn, "AI's $600B Question," Sequoia Capital, 2024. https://www.sequoiacap.com/article/ais-600b-question/

[24] Gartner, "Gartner Says Worldwide AI Spending Will Total $1.5 Trillion in 2025," 17 September 2025. https://www.gartner.com/en/newsroom/press-releases/2025-09-17-gartner-says-worldwide-ai-spending-will-total-1-point-5-trillion-in-2025

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
