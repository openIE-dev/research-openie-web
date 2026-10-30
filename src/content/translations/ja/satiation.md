---
title: "AI需要におけるタスク飽和と総量リバウンド"
deck: "公表されたデジタル推論の価格崩壊は、雑務が完了した後の無料のエネルギー、無料の作動、あるいは無限の価値を示すものではない。"
lang: "ja"
source: "satiation"
complete: true
---

<div id="satiation-and-scarcity-after-free-ai" class="anchor-alias" aria-hidden="true"></div>

*バージョン 1.1、2026年10月11日。データとコード：[research.openie.dev/data/](/data/#economics)。LaTeX PDF：[/pdfs/latex/satiation.pdf](/pdfs/latex/satiation.pdf)（[ソース](/pdfs/latex/satiation.tex)）。*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 要旨

一度タスクが完了すれば、そのタスクにそれ以上の機械の労力を注いでも何も加わらない。本稿はその停止を精密に定義し、機械の仕事に対する総需要が伸び続けるかどうかという別の問いから切り分ける。

**平易な言葉で**

1. どの仕事にもゴールラインがある。それを越えた後、その仕事にさらにコンピュータの作業を費やすのは無駄である。
2. それでも、より安いコンピュータの作業は人々にずっと多くの仕事を始めさせうるので、総使用量は増え続けうる。
3. AI の金銭価格は急速に下がっているが、AI が使う電気は決して無料ではない。

多くの計画モデルは、機械知能への需要をゴールのないものとして扱う。消費者理論はすでにその反対の対象を含んでいる。飽和、およびそれに関連する至福点とは、ある財をさらに追加しても効用が上がらず、むしろ下がりうる領域である（Andersen, 2001）。本稿は仕事とケアのための操作的な近縁概念を定義する。明示された完了述語が成り立ち、その後の呼び出しがその述語のどの節も偽から真へ反転させず、かつ述語を取り消す呼び出しが価値ではなく害であるとき、ループはタスク完了に達する。エンゲージメント時間、トークン数、シート数は別の変数である。これらは完了の後にも増えうる。

二つの主張を切り分けておかなければならない。タスク単位の飽和は定義によって成り立つ。あるタスクの完了述語がいったん真になれば、そのタスクに対する合成をさらに重ねても何も得られない。総量としての飽和は総需要についての主張であり、前者からは導かれない。より安価な合成は新しいタスクを生み出し（Acemoglu and Restrepo, 2019）、総使用量を押し上げうる。より安価な石炭が石炭の総使用量を押し上げたのと同じである（Jevons, 1865）。個々の雑務はそれぞれ飽和しうるが、雑務に対する総需要は際限なく増えうる。このリバウンドこそが本稿の中心的な識別問題である。第5.1節は検証可能な二つの仮説と、それらを識別するデータを述べる。

第二の事実は物理ではなく価格に関するものである。Epoch AI は、一定の推論性能の価格が大きく下落したと報告している（Epoch AI, 2025; Emberson and Roodman, 2026）。出力が情報であり完了テストが有限であるデジタルな雑務について、本稿はその結果生じる状況を限界において無料と呼ぶ。この言い回しは、ジュールが無料であること、プラントが証明書なしに動いてよいこと、あるいはケア労働が自動化によって不要になったことを意味しない。Landauer の限界は消去に関する下限であって、現在のアクセラレータを記述したものではない（Landauer, 1961; Horowitz, 2014）。

本稿は、ランダム化比較試験も、完了検出器の誤り率も、完了前に費やされたエネルギーと完了後に費やされたエネルギーの区分も報告しない。これらの測定は第3.3節で仕様が定められているが、まだ存在しない。

<div id="notation" class="anchor-alias" aria-hidden="true"></div>

## 記法

| 用語 | 本稿における定義 |
|------|--------------------------|
| 飽和 | 引用した理論では、限界効用がゼロ以下に落ちること。本稿の操作的な条項では、完了の後、それ以上の呼び出しが `C` のどの節も偽から真へ反転させないこと。`C` を取り消す呼び出しは価値ではなく害である（第3.1節）。 |
| 至福点 | その財を追加すると効用が下がる財の組み合わせ。教科書的な対象。本稿では推定しない。 |
| タスク完了 | 完了述語が真になる事象。モデルの規模とは直交する。 |
| 仕事の完了性 | 明示された仕事の停止点。チケットのクローズ、パッチのマージ、報告書の提出、帳簿の照合、またはそれと同等の書面のテスト。 |
| ケアの完了性 | 明示されたケアの停止点。評価の終了、服薬の照合、受け手への通知、本人が安全な状態にあること、またはそれと同等の書面のテスト。 |
| 限界において無料 | デジタルな合成ステップの限界価格が、バンドル価格または無視できる金銭価格に向かうこと。ジュールとコミットは依然として費用がかかる。 |
| 汎用人工知能（AGI） | 広い能力目標。価格の観測でもなく、本稿の結果でもない。 |
| 直接リバウンド | あるサービスの実効価格が下がったときの、同じサービスの追加的な使用（Gillingham, Rapson, and Wagner）。 |
| モデル化 / シミュレーション / ボード実測 | 式、プログラムの実行、または計器。本稿の新しい数値はこの三つのいずれでもない。その経験的内容は、公表された系列と文書の引用である。 |

範囲。第2節は飽和の理論、タスクの自動化、アテンション市場、技術サイクルの証拠、推論価格を概観する。第3節は述語を書き下し、どれが推定されていないかを述べる。第4節は引用に依拠する主張を列挙し、それらを設計規則から切り分ける。第5節はリバウンド、ケアの費用、軍事需要に答える。第6節は妥当性への脅威を列挙する。

<div id="1-introduction" class="anchor-alias" aria-hidden="true"></div>

## 1. 序論

「知能」に対して一定の正の傾きをもつ需要曲線は、仕事が終わった後にも、より多くのシート、より多くのトークン、より多くのエージェントを推奨する。その推奨はモデル化上の選択である。仕事についての定理ではない。標準的な消費者理論は、限界効用が減少し、ゼロを横切ることを許している。ある雑務に完了述語があるなら、問うべきは、モデルの出力を増やすことがその述語を変えるかどうかである。変えないなら、追加の出力は、書き下された目的に何の増分ももたらさない費用である。

最近の価格の証拠は、合成の希少性とは逆の方向を指している。Epoch の系列は、あるベンチマーク性能を得るための金銭価格が急速に下がっていることを示す。オープンウェイトと、System One を含む型付きの意思決定手続きは、以前は希少だった生成ステップが安価になる別の経路である。クローズした雑務を、合成がまだ希少であるかのように値付けするチームは、古くなった制約を使っている。

価格系列から導かれない制約は、物理的なものと制度的なものである。計算はエネルギーを散逸させる。Horowitz（2014）は、実際の CMOS のエネルギーではデータ移動とメモリが支配的であり、その規模は Landauer の理想的な消去の限界をはるかに上回ることを記録している。アクチュエータはトークンではない。署名、臨床の引き継ぎ、支払いは、別の段落をサンプリングしても元に戻らない。Baumol（1967）は、生産性の伸びが弱い部門が支出のうち増大する割合を吸収しうることを示した。Acemoglu and Restrepo（2019）は、自動化をタスクの置き換えと、新しいタスクが生まれる可能性の和としてモデル化している。これらの結果のどれも、言語モデルがコスト病を終わらせるとは言っていない。それらが言っているのは、「より多くの能力」は価値の記述として十分ではないということである。

本稿の肯定的な主張は、定義的かつ書誌的なものである。飽和は首尾一貫した対象である。公表されている推論の価格は急落した。エンゲージメントの指標は完了の指標ではない。「支出するな」という停止と「動かすな」という停止は、異なる述語である。否定的な主張も同じくらい重要である。本稿は構造的な需要体系を識別せず、リバウンドを推定せず、測定されたエネルギーを報告しない。

<div id="2-related-work" class="anchor-alias" aria-hidden="true"></div>

## 2. 関連研究

<div id="21-satiation-and-bliss-points" class="anchor-alias" aria-hidden="true"></div>

### 2.1 飽和と至福点

Andersen（2001）は飽和を、言葉の上での選好としてではなく、構造変化の進化モデルの中で扱っている。本稿にとって持続的な要素は経済的なものである。財の限界的な評価はゼロに達しうる。教科書の至福点はその幾何を明示する。財の組み合わせ `x*` に対して、ある座標で `x*` を越えると効用は増えず、滑らかな表現ではそこで限界効用が負になりうる。二次関数の例 `U(x) = -a (x - x*)^2`（`a > 0`）は `x*` で最大となり、その先では導関数が負になる。この関数は定義を教えるためのモデルである。本研究ではエージェントのログに当てはめていない。係数 `a` は報告しない。

操作的な翻訳には、誰かが明示しない限りモデルが知りえない述語が必要である。エピソード `z` の書面の完了テストが成り立つとき `C(z) = 1`、そうでなければ 0 とする。そのエピソードで飽和するとは、`C` が `t*` で 1 であり、それ以降のすべての呼び出しについて `C` のどの節も偽から真へ反転しないような時刻 `t*` が存在することをいう。`C` を取り消す呼び出しは価値ではなく害である。第3.1節も同じ規則を述べている。内部事象である**経済的完了**は `C` が 1 になる時点であり、本稿はこの事象をタスク完了と呼ぶ。これは定義である。ラベル付きのエピソード集合と、誤りが数えられた検出器があって初めて、経験的な主張になる。第4節にはその集計は含まれていない。

Keynes は1930年に同じ線を引いた。彼は欲求を、他人が何を持っていようと感じる絶対的な欲求と、それを満たすことで他人より上に立てるから感じる相対的な欲求とに分けた。そして絶対的な欲求は満たしうると論じた。完了述語とは、一つのタスクの絶対的な欲求を書き下したものである。相対的で際限のない欲望にはそのような述語がなく、第5.2節はそれらを主張の外に置く。

<div id="22-tasks-displacement-and-cost-disease" class="anchor-alias" aria-hidden="true"></div>

### 2.2 タスク、置き換え、コスト病

Baumol（1967）は不均衡成長を分析している。ある部門の生産性が上がり、別の部門の生産性が上がらなければ、停滞した部門の相対的な費用は上がり、その量がゆっくりとしか増えなくても支出を支配しうる。医療、教育、ライブの舞台芸術が通常の例である。その後の医療経済学の論文は、その大きさと仕組みについて議論している。本稿は Baumol を否定的な指示のために用いる。トークン価格の下落から、ケアがソフトウェアの財になったと推論してはならない。通常の制度的な意味で、ケアは時間、信頼、法的責任に依存し続ける。文書作成のモデルは記録される活動を増やしうるが、これは Baumol に関わる曖昧さである。測定される産出は動きうるが、ケアの述語は動かない。

David Autor に関連する労働経済学の文献は、仕事を、機械が担いうるタスクと担いえないタスクに分解する。本稿が拠り所とする記述は Acemoglu and Restrepo（2019）, "Automation and New Tasks: How Technology Displaces and Reinstates Labor", Journal of Economic Perspectives 33(2), <https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3> である。彼らは、置き換えは労働のタスクシェアを減らし、新しいタスクはそれを回復させうると論じている。完了を志向する停止は、新しいエンゲージメントのタスクを作ることよりも、タスクを終えることに近い。停止のないエージェントループは、生産性の向上なしに活動指標を引き上げうる。その可能性は、弱い自動化についての彼らの警告と整合的である。

<div id="23-attention-and-engagement" class="anchor-alias" aria-hidden="true"></div>

### 2.3 アテンションとエンゲージメント

Wu の著書 "The Attention Merchants"（出版社のページ：<https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/>）は、注意を刈り取って転売する事業を描いている。Center for Humane Technology によるアテンション経済の概要（<https://www.humanetech.com/youth/the-attention-economy>）は、同じパターンの提言的な要約であって、試験ではない。ここで用いる推論は限定的である。製品の目的がタスクに費やす時間であれば、`C = 1` の後も続くセッションは成功に見えうる。目的が `C` であれば、同じセッションは無駄か害である。二つの目的は、トークンのログの上では観察上同値ではない。本稿のどの実験も厚生の差を推定していない。

<div id="24-historical-cycles" class="anchor-alias" aria-hidden="true"></div>

### 2.4 歴史的なサイクル

技術の市場はしばしば、投機の局面、利用の局面、そして後のコモディティの局面を示す。証拠はまちまちである。

Quinn（2019）, "Technological revolutions and speculative finance: evidence from the British Bicycle Mania", Cambridge Journal of Economics 43(2), 271-294, <https://doi.org/10.1093/cje/bey029> は、1895年から1900年までの自転車会社の株価を研究している。株価は200パーセント以上上昇し、その後75パーセント以上下落した。この論文の結果は投機的な金融とファンダメンタルズについてのものであり、家計にとって測定された「自転車はもう十分」という述語についてのものではない。これを競争局面の金融の描写として用いることは支持される。交通の飽和の証明として用いることは支持されない。

自動車、定期航空便、テレビには、日常的な意味でコモディティに近い市場がある。中古車、イールドマネジメントで管理される座席、コンテンツの投入物として売られるパネルである。これらの行は歴史的な見取り図である。回帰ではない。規制緩和後の航空会社のイールドマネジメントは座席に対する価格付けの制度であり、座席のコモディティ市場の証拠ではあるが、旅客の旅行需要が世界的に飽和していることの証拠ではない。

Pew Research Center のモバイルに関するファクトシート（<https://www.pewresearch.org/internet/fact-sheet/mobile/>）が、電話について用いる普及飽和の出典である。プロジェクトのアーカイブは、2024年と2025年のファクトシートの読み取りで、米国のスマートフォン保有率が91パーセント近くであったと記録している。この数値を引用する読者は、ファクトシートは改訂されるので、最新のシートを開くべきである。高い保有率は普及の証拠である。それだけでは、もう一台の電話のカメラの限界価値がゼロであることの証拠にはならない。

デジタルな雑務の行は、本稿が類推ではなく価格系列によって擁護する行である。第4.2節を参照。

<div id="25-inference-prices-and-open-weights" class="anchor-alias" aria-hidden="true"></div>

### 2.5 推論価格とオープンウェイト

Epoch AI（2025）, "LLM inference price trends", <https://epoch.ai/data-insights/llm-inference-price-trends> は、その記事のベンチマーク全体で、一定性能での価格が年に9倍から900倍程度下落していると報告している。Epoch AI のための Emberson and Roodman（2026）, "The plunging price of thought", <https://epoch.ai/publications/the-plunging-price-of-thought> は、およそ2023年以降、所与の性能の費用が四半期あたり約47パーセント下落しており、年に約13倍とまとめられ、最前線の近くではより速いと報告している。これらは著者による自らのデータの要約である。本稿は指数を推定し直してはいない。経済学的な読み方は狭い。一定の測定性能に対する合成の金銭価格は急速に下がってきた。供給価格の下落は、需要が弾力的であれば需要量を動かす。それは新しい完了述語を作らず、エネルギーの価格をゼロにもしない。

System One 型のツールは、既知の選択肢集合をもつ意思決定問題においてさらに価格を引き下げる仕組みとして関係がある。System One モデルは、一回の順伝播で、許された各選択肢について型付きの答えと確率を返し、自由形式のテキストは返さない。TypeSafe AI は、ホスト型の Jev モデルによってこのカテゴリーに名前を与えた（2026年9月15日）。その後オープンなモデルが続き、その中には Convai Innovations の Laya がある。System One モデルは提案する。それは完了の評価ではない。

最前線の能力がおよそ6か月でより安価なデバイスに届くという計画上の経験則は、ここで引用したどの資料においても測定された定数ではない。蒸留、量子化、テーブル参照による推論（Ma et al., 2024; Wei et al., 2024）は、所与の能力がより安価なハードウェアへ移りうる公表済みの仕組みである。その速さはモデルの組ごとの経験的な問題である。

<div id="26-physical-cost" class="anchor-alias" aria-hidden="true"></div>

### 2.6 物理的な費用

Landauer（1961）は消去に限界を与える。Bennett（1973）は、可逆計算が理論上その限界を回避しうることを示している。Horowitz（2014）は CMOS についての実践的な記述である。演算あたりのエネルギーとデータ移動のエネルギーが設計上の制約を決め、不可逆な CMOS 論理では `kT ln 2` を何桁も上回る。$T = 300$ K において、この限界は消去される1ビットあたり $k_B T \ln 2 \approx 2.87 \times 10^{-21}$ J であり、ここで $k_B = 1.380649 \times 10^{-23}$ J/K である。

Goldman Sachs は "Gen AI: Too Much Spend, Too Little Benefit?" と題する調査ノートを公表している（<https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit>）。インフラ支出を便益と比べて問い直す大手セルサイドのノートが存在することは、文書上の事実である。ノートの中のドル建ての数値はここでは引用しない。セルサイドの推定値は科学的なエネルギー会計ではないからである。

<div id="3-definitions-and-methods" class="anchor-alias" aria-hidden="true"></div>

## 3. 定義と方法

<div id="31-predicates" class="anchor-alias" aria-hidden="true"></div>

### 3.1 述語

エピソードを、モデルまたはツールの呼び出しの列 `z_1, ..., z_T` と、人に向けた状態の組とする。完了述語 `C` は、エピソードの接頭部を `{0, 1}` に写す。モデルのスコアなしに書ける例を挙げる。

- 仕事：テストが通り、変更がマージされている。または帳簿の不一致がゼロである。または報告書の必須項目が埋まり、報告書が提出されている。
- ケア：服薬リストが元の記録と一致し、受け手の臨床担当者が記録を受け取り、施設が重要と指定した安全チェックリストの項目が真である。

`C` は確率ではない。スコアを出力する検出器は、第4節で欠けている実験の意味での述語となる前に、なお閾値と誤りの表を必要とする。

時刻 `t*` における内部事象**経済的完了**とは、選んだテストについて、`t*` より前の接頭部では `C = 0` であり、`t*` で `C = 1` となることをいう。本稿はカタログのこの層を**タスク完了**と呼ぶ。モデル呼び出しに関する飽和とは、すべての `t > t*` について、追加の呼び出しが `C` のどの節も偽から真へ反転させないことをいう。`C` を取り消す呼び出しは価値ではなく害である。この定義は、人が常に `t*` を知っているとは言っていない。言っているのは、`C` が一つも書かれていなければ、飽和の主張はまだその製品についての言明になっていないということである。

限界において無料とは、金銭価格についての言明である。日付 `t` における合成サービス `q` の価格を `p_t(q)` とする。アーカイブにある価格の証拠は、一定のベンチマーク性能に対する `p_t` が Epoch の報告する速さで下落してきたということである。限界において無料とは、`p_t` が十分に低く、シートライセンスではその雑務の費用をほとんど説明できないことを意味する。電力の時間積分がゼロであることを意味するのではない。

したがって停止規則には二種類の理由がありうる。経済的な理由（述語が成り立つ、または予算やポリシーの上限に達する）と、物理的な理由（安全やエネルギーの上限に達する）である。この二種類は異なる述語であり、異なる理由として記録すべきである。

<div id="32-what-was-done-in-this-study" class="anchor-alias" aria-hidden="true"></div>

### 3.2 本研究で行ったこと

本研究は構造化された読解である。資料は、2026年9月29日から30日にプロジェクトで確認した引用の骨格と、飽和に関するノートである。第3.3節は、操作的な定義を経験的なものにする測定を挙げる。

第4.10節の設計規則は、定義を条件とする推奨である。推定された処置効果ではない。読者は Epoch の価格系列を退けずにある規則を退けることができ、製品上の推奨を受け入れずに価格系列を受け入れることもできる。

<div id="33-measurements-specified-and-not-taken" class="anchor-alias" aria-hidden="true"></div>

### 3.3 仕様を定めたが実施していない測定

**述語は内生的である。** Witt（2001）は、欲求は学習されるものであり、したがって完了述語 $C(z)$ は価格が下がるにつれて段階的に引き上げられうると論じている。価格変化をまたぐ飽和の研究は、それゆえ変化の前に事前登録の中で $C(z)$ を凍結し、述語のいかなる変更も別の処置として報告しなければならない。

**H1 は公開データからいますぐ読み取れる。** Chen ら（2024）は、最初の正答の後に費やされたトークンを測定している。Cuadron ら（2025）は、エージェントの軌跡における考えすぎを採点している。Bai, Huang and Wang（2026）は、エージェント型コーディングにおいて同じタスクのトークン使用量が実行ごとに最大30倍異なることを見いだしている。本稿の $C(z)$ をそれらの軌跡に事後的に適用すれば、探索的な H1 の推定値が得られ、探索的であると明記される。これが次の測定である。

**トークンとジュール。** H1 と H2 はトークンで述べられ、本稿の論旨はジュールで述べられている。Masanet ら（2020）は、2010年から2018年にかけてデータセンターの計算量が約6倍に増えた一方で、エネルギーの増加ははるかに小さかったことを見いだした。したがって、トークンの弾力性はエネルギーの弾力性ではない。各仮説は両方の単位で報告し、データが識別する単位を明記する。

1. 分割勘定。各エピソードについて、`t <= t*` の呼び出しと `t > t*` の呼び出しのそれぞれで、解析的なエネルギー、あるいは後にはボード実測のエネルギーを合計する。その雑務での直接リバウンドは、完了後の積分が推定されて初めて見える。リポジトリにはこの分割は含まれていない。
2. 検出器の誤り。ラベル付きコーパスにおける、偽の完了（ある節が偽なのに述語が真と宣言される）と偽の継続（`C` が真なのにシステムが呼び出しを続ける）。ここでは率を公表しない。
3. ケアの引き継ぎ。安全な状態に至るまでの時間と引き継ぎチェックリストを、セッションの長さと対比する。測定していない。
4. セグメント表。どの製品が短い `C` をもち、どれが際限のない研究や敵対的な競争であるか。推定していない。軍事の事例は、無理に飽和の主張に組み込むのではなく、第5節でその主張から除外する。
5. 測定されたエネルギー。明示されたワークロードに対する外部の電力計。実施していない。

それらが存在するまでは、「過剰なジュール」についての文は仮説である。Epoch の価格についての文は引用である。

<div id="34-illustrative-episodes-not-data" class="anchor-alias" aria-hidden="true"></div>

### 3.4 データではなく説明のためのエピソード

サポートデスク。完了性：顧客の問題が解決し、返信が送られ、チケットの状態が Done である。それ以上の下書きは `C` を変えない。それでもトークンカウンタは増え続けうる。このエピソードは変数を示すために構成した例である。ヘルプデスクからの標本ではない。

ケアの引き継ぎ。完了性：重要な項目が埋まり、服薬リストが照合され、受け手が確認し、本人が安全な状態にある。セッションの長さは別の変数である。このエピソードは構成したものである。病院のデータセットは分析していない。

コーディングの雑務。完了性：成果物が書面のオラクル（テスト、またはビット単位で一致するかの検査）と一致する。すでに合格している成果物を再生成しても `C` は上がらない。

<div id="28-fidelity-criteria-and-stop-rules" class="anchor-alias" aria-hidden="true"></div>

<div id="36-fidelity-criteria-and-stop-rules" class="anchor-alias" aria-hidden="true"></div>

### 3.6 忠実度の基準と停止規則

Shannon（1959）はレート歪み関数を定義している。期待歪みを選んだ忠実度以下に保つ最小の記述レートである。対象は、利用者が明示する制約の下での通信である。知能の需要曲線ではない。本稿との類似は構造上のものにすぎない。完了述語 `C` は厳格な忠実度である。明示された節は成り立つか、成り立たないかのどちらかである。言語モデルの損失は、訓練分布上の平均的な歪みに近い。損失の低下と、一定のベンチマークでの価格の低下は、Kaplan et al.（2020）や Hoffmann et al.（2022）が訓練について推定する種類のレートと資源の曲線に沿った移動として読める。その移動は、特定の雑務に対して `C` を選ぶわけではない。ベンチマークの歪みと雑務の完了性を混同することが、クローズした仕事に対して無制限のシートを想定する計画の背後にあるカテゴリーの誤りである。

形式的な展開を求める読者にとって、Cover and Thomas（2006）はレート歪みへの教科書的な入口である。本稿は忠実度という概念の存在を用いて、二つの数を切り分ける。常にわずかずつ改善できるスコアと、すでに真である述語である。

<div id="29-rebound-taxonomy-without-a-new-estimate" class="anchor-alias" aria-hidden="true"></div>

<div id="37-rebound-taxonomy-without-a-new-estimate" class="anchor-alias" aria-hidden="true"></div>

### 3.7 リバウンドの分類、新たな推定なしで

リバウンドの古典的文献が H2 の枠組みである。Khazzoom（1980）は、義務化された効率がそのサービスの使用を増やしうることを示し、Brookes（1990）は経済全体の水準で同じことを論じ、Saunders（1992）は新古典派成長の中でその条件を導いた。Sorrell and Dimitropoulos（2008）はミクロ経済学的な定義とその限界を示した。Brockway, Sorrell, Semieniuk, Heun and Court（2021）は証拠を概観し、経済全体のリバウンドが期待される省エネルギーの半分以上を打ち消しうることを見いだした。タスク飽和はこの発見と矛盾しない。それはタスクごとの停止であり、古典的文献の証拠が当てはまるのは H2 の総量リバウンドである。照明は、それを検証するための歴史的な事例である。Fouquet and Pearson（2006）は英国における光の価格と使用の7世紀をたどり、Tsao ら（2010）は光の使用が効率とともに増えたことを見いだしている。飽和しうるサービスでありながら、大きなリバウンドを示したのである。

Gillingham, Rapson, and Wagner によるリバウンドのサーベイは、一つのスローガンが一緒くたにしてしまう経路を切り分けている。直接リバウンドとは、同じサービスの実効費用が下がったときのそのサービスの追加的な使用である。間接リバウンドとは、節約された資源を他のサービスに支出することである。経済全体のリバウンドは価格と成長を通じて生じる。このサーベイの政策領域はエネルギー効率であって、トークンではない。それでもこの分類は、識別についての警告として転用できる。`p_t` の下落が測定されても（主張 S-2）、それだけでは三つの経路のどれも識別されない。`C` がすでに真である雑務での直接リバウンドには、買い手が `C` を変えない呼び出しになお支払いを続けていることが必要である。新しいタスクが現れると、間接の経路と経済全体の経路は大きくなりうる（Acemoglu and Restrepo, 2019）。一つの弾力性を報告してそれを「リバウンド」と呼ぶ論文は、仕様が不十分であろう。本稿は弾力性を報告しない。

このパターンは古い。Jevons は1865年に、より効率的な蒸気機関はブリテンの石炭の総使用量を減らすのではなく増やすと論じた。Alcott はその議論とその後の論争をたどっている（*Ecological Economics* 54(1), 2005）。Nordhaus は1世紀以上にわたる計算の価格を測定し、計算の総量が増える一方でその価格が何桁も下がったことを見いだした（*Journal of Economic History* 67(1), 2007）。エージェントのワークロードはすでに使用の側を示している。Anthropic のエンジニアリングチームは、自社のシステムについて、エージェントはチャットのやりとりの約4倍、マルチエージェントシステムは約15倍のトークンを使うと報告した（2025年6月13日）。この数値は運営者による報告であり、監査されていない。それは、タスクの形が変わるにつれてタスクあたりの需要が増えることと整合的であり、まさにそれこそ、第3.3節の分割勘定が完了後の無駄から切り分けなければならないものである。

<div id="210-scarce-joules-and-the-economic-stop-20252026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="210-scarce-joules-and-the-economic-stop-2025-to-2026-peers" class="anchor-alias" aria-hidden="true"></div>

<div id="38-scarce-joules-and-the-economic-stop-2025-to-2026-peers" class="anchor-alias" aria-hidden="true"></div>

### 3.8 希少なジュールと経済的な停止（2025年から2026年の関連研究）

Epoch の価格系列（S-2）は、合成が金銭的に安くなっていることを示している。最近のエネルギーに関する出版物は、ジュールが依然として希少であり、総量ではしばしば増えていることを示している。

Chung, Wu, Ma, and Chowdhury（arXiv:[2601.22076](https://arxiv.org/abs/2601.22076), 2026）は、1,858 の構成にわたって推論のエネルギーを診断している。タスクの種類だけで、応答あたりの LLM のエネルギーが約25×変わりうる。動画生成は画像のエネルギーを2桁上回りうる。*Joule* の論文 "Energy use of AI inference, efficiency pathways, and test-time scaling"（[cell.com/joule/fulltext/S2542-4351(26)00114-5](https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5)、2026年4月22日オンライン公開）は、最適化された最前線規模のクエリの中央値を1ワット時未満の範囲と推定する一方で、長い推論やエージェント型のクエリがエネルギーを1桁以上引き上げうると報告している。8から20×の効率向上は見通しの範囲内にあるが、無料のジュールではない。Luccioni, Strubell, and Crawford（FAccT 2025）（[doi:10.1145/3715275.3732007](https://doi.org/10.1145/3715275.3732007)）は、停止のない効率は総支出を増幅しうると警告している（Jevons）。Epoch AI のエネルギーの概観（[epoch.ai/publications/ai-energy](https://epoch.ai/publications/ai-energy)、2026年7月更新）は、控えめなクエリあたりの費用と、急速に倍増するデータセンターの総電力とを切り分けている。

**本稿にとっての読み方。** 限界において無料であることは金銭価格についての言明である。希少なジュールは物理的な言明である。操作的な停止はタスク完了である。`C(z) = 1` のとき、それ以上の合成は書面の目的を高めず、予算やポリシーを理由とする停止は成功である。推定値は測定されたエネルギーではない。

<div id="36-protocol-for-a-done-detector-study-not-executed" class="anchor-alias" aria-hidden="true"></div>

<div id="39-protocol-for-a-done-detector-study-not-executed" class="anchor-alias" aria-hidden="true"></div>

### 3.9 完了検出器の研究のためのプロトコル（未実施）

以下のプロトコルは将来の測定のための方法である。どのステップも実施されていない。欠けている結果が、スローガンではなく終了基準をもつように書かれている。

母集団。エピソードは一つの製品の画面から抽出し、際限のない研究とチケットのクローズを混ぜない。各エピソードには有限個の節からなる書面の `C` があり、各節はモデルを操作しなかった人が観察できる。目標とする規模は設計上の選択である。本稿は検出力の計算を行ったふりはしない。最初に使える表には、率が単なる一つの逸話にならないだけの陽性と陰性が必要である。アーカイブにはその表は含まれていない。

ラベル。二人のアノテータが、システムが最初に完了を宣言した時点と、セッションの終了時点で、それぞれ各節を真または偽と記録する。不一致は裁定され、数えられる。検出器の判断はラベルとは別に記録される。

主要な率。

- 偽の完了：いずれかの重要な節が偽であるのに、システムが `C = 1` を宣言する。
- 偽の継続：すべての重要な節が真であるのに、システムがさらにモデルまたはツールの呼び出しを発行する。
- セッションの長さと呼び出し回数は共変量であり、評価項目ではない。

副次的な分割は、エネルギー勘定が存在する場合に限る。裁定された `t*` の前と後の呼び出しについて、解析的またはボード実測のエネルギーを合計する。数値と同じ文の中で測定のクラスを明記する。OpCounter の解析的な合計は計器の代わりにはならず、Horowitz の表とは比較できない。

除外。書面の `C` のないエピソードは「未飽和」とはラベル付けされない。範囲外である。敵対的なエピソードは飽和の評価項目の範囲外であり、証明書があれば物理的な拒否について採点することはできる。

プロトコルの失敗。アノテータが節について合意できなければ、述語は書かれていなかったということである。システムに完了を宣言する事象がなければ、偽の継続は識別されない。二つの率の代わりにモデルのリーダーボードを公表しても、このプロトコルを実施したことにはならない。

<div id="37-a-numerical-illustration-of-a-bliss-point-model-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

<div id="310-a-numerical-illustration-of-a-bliss-point-model-not-a-fit" class="anchor-alias" aria-hidden="true"></div>

### 3.10 至福点の数値例（当てはめではなくモデル）

一つの座標 `x` を、一つの雑務でのモデル呼び出しの回数とし、

```text
U(x) = -(x - 4)^2
```

とおく。これは、構成上の最大値が4回の呼び出しにある雑務である。すると `U(0) = -16`、`U(4) = 0`、`U(8) = -16` である。限界効用は `dU/dx = -2(x - 4)` であり、4より前では正、4ではゼロ、その後は負である。この例は整数を用いており、当てはめなしに符号の変化が見えるようにしてある。4を選ぶのにデータセットは用いていない。4を別の整数に置き換えると山の位置は動くが、定義は変わらない。`x` に等しい製品指標は、`x = 8` を `x = 4` より上位に置く。`U` に等しい製品指標はその逆である。主張 S-3 とはこの非同一性であり、ここでは完全に指定されたおもちゃの関数で、第3.4節では構成したエピソードで示している。どちらも企業についての厚生の推定ではない。

単位を混同せずにトークン価格を付け加えることができる。一回の呼び出しが金銭で `p` かかり、価値が `U` に従う一方で買い手は `p * x` を支払うとする。買い手の余剰の代理指標 `U(x) - p x` は、任意の `p >= 0` について有限の最大化点をもつ。`p` が下がると最大化点は動き、これがこのおもちゃの上でのリバウンドの論理であるが、最大化点は有限のままである。このおもちゃは、現実の買い手にとって最大化点がどこにあるかを語らない。それが阻むのは、より低い `p` が最大値を消し去るという推論である。

図1は、このおもちゃと、それとは別の総量の主張を描いている。

![左：至福点のモデル図。価値 U(x) は x から4を引いたものの2乗の符号を反転させたもので、価格0、2、4のときの余剰 U から p と x の積を引いたものとともに描いている。最大化点は呼び出し4回、3回、2回で、どの価格でも有限である。右：総量リバウンドの概念図。価格が下がるとより多くのタスクが開かれるが、各タスクはなお自らの述語で停止する。](/figures/satiation/satiation-rebound.svg)

*図1. タスク飽和と総量リバウンド。本節のおもちゃのモデル図であり、当てはめではない。$U(x) - p\,x$ の最大化点は $x = 4 - p/2$ であり、どの価格でも有限である。右のパネルは概念図であり、本稿はリバウンドを推定しない。[PNG 版](/figures/satiation/satiation-rebound.png)も用意している。*

<div id="38-reason-codes-as-a-partition-not-a-welfare-function" class="anchor-alias" aria-hidden="true"></div>

<div id="311-reason-codes-as-a-partition-not-a-welfare-function" class="anchor-alias" aria-hidden="true"></div>

### 3.11 厚生関数ではなく分割としての理由コード

トレース上の拒否コードの集合を `R` とする。スキーマの分類法に合わせて、`R` を `R_econ = {policy, budget_exceeded}` と `R_phys = {lut_veto, energy_veto, cbf_veto}` に分割する。後に他のコードを加える場合は、数える前に書面で割り当てなければならない。トレースのある区間が完了後の経済的な拒否に寄与するのは、`C` がすでに 1 であり、かつコードが `R_econ` に属する場合に限る。コードが `R_phys` に属していれば、`C` が 1 かどうかにかかわらず、物理的な拒否に寄与する。完了後の安全でない行為は両方の話に属し、平均するのではなく両方の列で数えるべきである。MCP デモの不可逆な拒否は物理的な例である。エネルギーとバリアのコードがあり、実行器の呼び出しは 0 である。それは `R_econ` の例ではない。パッチのマージ後に `policy` が現れる将来のエピソードが、経済的な例となるだろう。リポジトリにはそのエピソードは含まれていない。この分割は、それがどう採点されるかを示している。

<div id="4-evidence" class="anchor-alias" aria-hidden="true"></div>

## 4. 証拠

<div id="41-claim-s-1-satiation-is-a-defined-economic-object" class="anchor-alias" aria-hidden="true"></div>

### 4.1 主張 S-1. 飽和は定義された経済的対象である

Andersen（2001）, <https://doi.org/10.1007/PL00003852> と、第2.1節の教科書的な至福点の構成が S-1 を支持する。この主張は理論的なものである。本研究における、いかなる利用者集団についての測定された効用関数でもない。

<div id="42-claim-s-2-published-inference-prices-fell-sharply-at-fixed-performance" class="anchor-alias" aria-hidden="true"></div>

### 4.2 主張 S-2. 一定性能での公表推論価格は急落した

Epoch AI（2025）と Emberson and Roodman（2026）によって、それらの記事が述べる大きさで支持される（第2.5節）。この主張は、それらの著者が公表している価格指数についてのものである。あらゆる組織の請求額が13分の1になったという主張ではなく、ワットについての主張でもない。

<div id="43-claim-s-3-engagement-variables-are-not-the-completeness-predicate" class="anchor-alias" aria-hidden="true"></div>

### 4.3 主張 S-3. エンゲージメントの変数は完了述語ではない

第3.1節の定義と、アテンションの文献によるタスク時間の目的の記述（Wu; Center for Humane Technology の概要）によって支持される。厚生損失の因果的な推定は主張しない。論理的な主張は変数の非同一性である。`C` が一定のままでもトークン数は増えうる。第3.4節の構成したエピソードは非同一性の例示であって、データセットではない。

<div id="44-claim-s-4-bicycle-mania-prices-detached-from-a-simple-fundamental-story" class="anchor-alias" aria-hidden="true"></div>

### 4.4 主張 S-4. 自転車マニアの株価は単純なファンダメンタルズの説明から乖離した

Quinn（2019）によって支持される。1895年から1900年にかけて、自転車株は200パーセントを超えて上昇し、その後75パーセントを超えて下落した。この論文の検定では、それはファンダメンタルズによっても単純なリスクの変化によっても十分には説明されない。主張はそこで止まる。家計の自転車に対する飽和を定量化するものではない。

<div id="45-claim-s-5-us-smartphone-ownership-is-high-in-the-cited-fact-sheet" class="anchor-alias" aria-hidden="true"></div>

### 4.5 主張 S-5. 引用したファクトシートでは米国のスマートフォン保有率が高い

プロジェクトのアーカイブによる Pew のモバイルのファクトシートの読み取りは、2024年と2025年の行で保有率が91パーセント近くというものである。本稿で用いる主張は、最新のシートがアーカイブと一致することを条件とした、その程度の普及である。それは保有についての普及飽和の事実であって、至福点の推定ではない。

<div id="46-claim-s-6-care-is-not-priced-as-a-pure-software-good-by-the-baumol-framework" class="anchor-alias" aria-hidden="true"></div>

### 4.6 主張 S-6. Baumol の枠組みでは、ケアは純粋なソフトウェアの財として価格付けされない

Baumol（1967）が枠組みを与える。Acemoglu and Restrepo（2019）がタスクの言葉を与える。主張は、トークン価格が下がっても、これらの枠組みはケアの労働、信頼、法的責任の要件の終わりを含意しないということである。この主張は医療支出の予測ではない。

<div id="47-claim-s-7-a-sell-side-note-questions-spend-versus-benefit" class="anchor-alias" aria-hidden="true"></div>

### 4.7 主張 S-7. セルサイドのノートが支出と便益を問い直している

第2.6節で挙げた Goldman Sachs のページは存在し、その表題で問いを立てている。

<div id="49-claim-s-9-physical-law-is-not-priced-to-zero-by-epoch" class="anchor-alias" aria-hidden="true"></div>

### 4.9 主張 S-9. Epoch によって物理法則の価格がゼロになるわけではない

Landauer（1961）と Horowitz（2014）は、理想的な消去の限界と CMOS の実践との間に恒久的な隔たりがあることを支持する。S-9 が言うのは、Epoch を引用しても Landauer の引用が免除されるわけではないということだけである。

<div id="410-design-rules-marked-as-design" class="anchor-alias" aria-hidden="true"></div>

### 4.10 設計規則、設計として明示する

これらの規則は、定義を受け入れ、トークンではなく `C` を最適化する製品を望むなら導かれる。効果ではない。

1. モデルの容量を加える前に `C` を書く。
2. Epoch 型の系列とオープンウェイトがその雑務に当てはまるときは、合成価格のプレミアムを一時的なものとして扱う。
3. モデル化またはシミュレーションによるエネルギーを、測定されたエネルギーとして記述しない。
4. 雑務そのものが製品になったら、ラベルのないモデルサイズの拡大よりも、誤りの表を備えた `C` の検出器を優先する。
5. 不可逆な行為の前には必ず、別個の物理的な安全検査を求める。
6. 分割が存在するときは、完了前と完了後のエネルギーを別々に報告する。分割はまだ存在しない。
7. 飽和の述語を敵対的な競争や軍事的な競争に適用しない（第5.3節）。
8. 製品の目的がアテンションであるなら、そう述べる。その場合、完了についての主張は当てはまらない。

ロードマップのための却下テストも、設計である。短い `C` をもつ雑務に際限のない需要を想定する計画。合成の恒久的な希少性を必要とし、物理的あるいは法的責任のくさびをもたない価格。確信度の文字列だけを用いる安全性の説明。ジュールを消し去る「無料」の主張。`C` のないエージェントループ。

<div id="411-what-would-be-a-result-and-is-not" class="anchor-alias" aria-hidden="true"></div>

### 4.11 結果となるはずのもので、本稿にないもの

偽の完了と偽の継続の率の表。`t*` 以後の呼び出しの時系列。明示されたワークロードに対するエネルギーの計器の読み取り。構造的なリバウンドの推定。飽和した雑務の上で推定された AGI の価格プレミアム。これらのどれも、第4節で支持された主張には現れない。

<div id="412-non-identity-stated-as-a-comparison-of-objectives" class="anchor-alias" aria-hidden="true"></div>

### 4.12 目的の比較として述べた非同一性

呼び出し回数を `x`、セッションの長さを `s`、裁定された完了の前と後のエネルギーを `J_pre` と `J_post`、述語を `C` とする。以下の含意関係は定義的なものである。

| 観察 | 含意しないもの |
|-------------|----------------|
| `x` が増えた | `C` が増えた |
| `s` が増えた | 厚生が増えた |
| `p` が下がった（S-2） | `J_post = 0` |
| `C = 1` | 検出器の誤り率がわかっている |
| 電話の保有率が高い（S-5） | もう一回のモデル呼び出しの限界価値がゼロである |
| 自転車株が高騰し暴落した（S-4） | 家計が交通の至福点に達した |

右の列は、本稿が拒む推論の一覧である。左の各観察は、第4節の引用か、第3節の変数のいずれかである。この表は議論を一つの点検に圧縮したものである。右側の主張を断言する文は、証拠から離れている。

<div id="5-discussion" class="anchor-alias" aria-hidden="true"></div>

## 5. 考察

<div id="51-rebound-the-central-identification-problem" class="anchor-alias" aria-hidden="true"></div>

### 5.1 リバウンド：中心的な識別問題

三つの結果が自然実験を制約する。Gundlach ら（2025）は、一定のベンチマーク性能での価格は速く下がる一方で最前線の価格は下がらないことを見いだし、Du（2026）は価格の推移に構造変化と推論プレミアムを見いだしている。したがって値下げはモデルの変更と抱き合わせで到来する。Anthropic の Economic Index（2025年9月）は、タスク間で費用が 1% 上がるごとに利用頻度が 0.29% 下がることを報告している。これは非弾力的な横断面の数値であって、時間を通じた価格変化ではない。提供者レベルの設計では市場レベルのリバウンドを識別できない。その設計には市場レベルの価格と数量が必要である。

Gillingham, Rapson, and Wagner は、エネルギー効率政策から生じるリバウンドをサーベイしている。その仕組みは残余の需要弾力性である。合成の金銭価格が下がれば、買い手がもう一単位になお価値を認めるところでは使用が増える。クローズした雑務の至福点では、その雑務でのさらなる合成に対する価値の直接の導関数は正ではないので、その雑務での直接リバウンドは含意されない。間接リバウンド、新しいタスク、アテンションの移動は残りうる。Acemoglu and Restrepo の新しいタスクという余地は、数量が再び現れうる一つの場所である。したがって主張 S-2 は、計算に対する全体的な上限を含意しない。含意するのは、明示された `C` に相対的な上限だけである。全体的なリバウンドを否定するには、第3.3節の分割と需要体系が必要になる。本稿は全体的なリバウンドを否定しない。本稿が拒むのは、「Jevons」を `C` を書かない理由として扱うことである。

二つの仮説が、この問いを検証可能にする。

- **H1. 完了後の支出。** `C(z) = 1` の後に費やされたエージェントの計算の割合、すなわちエピソード内のすべてのジュールまたは呼び出しに対する `t > t*` のジュールまたは呼び出しの割合は、測定可能な程度にゼロを上回る。H1 は完了の停止が取り除く直接の無駄である。エピソードごとにラベル付けされた `t*` があれば、エージェントのログから推定できる（第3.3節、項目1）。
- **H2. タスクにおける Jevons。** H2 は Khazzoom（1980）の直接リバウンドの弾力性を、タスクについて述べたものである。合成の価格が下がるとき、実行されるタスク数の弾力性が、タスクあたりの支出の下落を上回る。そうなると、各タスクが飽和していても総支出は増える。H2 は総量リバウンドである。

**識別。** H1 には価格の変動は要らない。必要なのは、ラベル付きコーパス、第3.3節の項目2にある検出器の誤り率、そして分割勘定である。H2 には外生的な価格変化が必要である。既知の日付に発表される、一定のモデル品質での提供者の値下げは自然実験である。設計は、支払った価格、開いたタスク、タスクあたりの呼び出し、エピソードごとの完了ラベルを、各値下げの前後で記録したアカウントのパネルである。価格改定されたモデルを使うアカウントと、価格が動かなかったモデルを使うアカウントを比べれば、タスク数の弾力性とタスクあたりの支出の反応とを、それぞれ差分の差分で推定できる。タスクあたりの支出が下がりながらタスク数が上がることもある。両方の数値が必要である。完了の停止は前者についての主張である。Jevons は後者についての主張である。本稿ではどちらも推定していない。

<div id="52-status-and-creative-goods" class="anchor-alias" aria-hidden="true"></div>

### 5.2 地位財と創造的な財

ある種の財は、終わっていないからこそ価値をもつ。地位、際限のない芸術、`C` が有限のチェックリストではない研究である。第3.1節の定義は、それらの財に至福点を押しつけはしない。押しつけるのはセグメント化である。有限の雑務と際限のない営みは同じ企業が売ることができるが、需要の仮定を共有すべきではない。有限の雑務を際限のない能力競争であるかのように値付けするのはカテゴリーの誤りであって、AGI についての発見ではない。

<div id="53-adversarial-demand" class="anchor-alias" aria-hidden="true"></div>

### 5.3 敵対的な需要

相手の利得がこちらの損失であるなら、「十分」は局所的なチェックリストでは定義されない。軍拡競争や一部のセキュリティ上の競い合いがこの類に入る。物理的なコミットの制約はなお適用できる。戦略的な需要が開いたままでも、安全でない行為は拒否できる。範囲は主張の一部であって、主張を打ち消す脚注ではない。

<div id="54-incomplete-knowledge-of-done" class="anchor-alias" aria-hidden="true"></div>

### 5.4 完了についての不完全な知識

人は完了を見誤る。検出器は偽の完了と偽の継続を起こすだろう。それは検出器の誤りを測定すべき理由であり、第3.3節はその測定を欠けているものとして挙げている。引き継ぎの見落としに責任を負う当事者がいる領域で、セッションの長さが `C` の代わりになるという理由にはならない。述語を書けないところでは、本稿の操作的な主張は何も語らない。

<div id="55-baumol-is-not-solved" class="anchor-alias" aria-hidden="true"></div>

### 5.5 Baumol の問題は解決していない

記録をより速く起草するモデルは、記録の処理量を引き上げつつ、診察、判断、責任を人の手に残しうる。人の残差が速くならなければ、支出シェアは Baumol が述べたとおりに動き続けうる。そうでないと言うことは、この参考文献が含んでいない予測になる。許される言明は S-6 である。

<div id="56-free-synthesis-is-not-free-actuation" class="anchor-alias" aria-hidden="true"></div>

### 5.6 無料の合成は無料の作動ではない

推論の金銭価格が下がっても、物理的なシステムを動かすエネルギーについては何もわからない。質量 $m$ を静止状態から速度変化 $\Delta v$ だけ動かすには、それを命じた指令の価格がいくらであれ、少なくとも $\tfrac12 m (\Delta v)^2$ ジュールの仕事が必要である。Epoch の価格は、その仕事とは異なる軸の上にある。それらを「無料の AI」にまとめると、測定のクラスが消し去られる。

<div id="57-confidence-is-not-a-certificate" class="anchor-alias" aria-hidden="true"></div>

### 5.7 確信度は証明書ではない

高いモデルのスコアは提案を順序づけることができる。それは完了述語ではない。スコアが `C` を決めるには、その前に閾値と誤りの表（ラベル付きの集合に対する偽陽性率と真陽性率）が必要である。

<div id="58-sell-side-skepticism-is-not-a-measurement" class="anchor-alias" aria-hidden="true"></div>

### 5.8 セルサイドの懐疑は測定ではない

S-7 は、文献レビューが支出と便益についての大きな公的な疑念を無視することを防ぐ。それは調査ノートが計器や需要の推定に取って代わることを許さない。後にノートの数値を引用するなら、一次資料の PDF を出典としなければならず、ラベルはセルサイドの推定値である。

<div id="59-what-a-structural-demand-estimate-would-require" class="anchor-alias" aria-hidden="true"></div>

### 5.9 構造的な需要推定に必要なもの

S-2 は、二次的に公表された系列から得られる供給価格の事実である。需要の推定は別の回帰である。少なくとも、数量（呼び出し、クローズしたタスク、またはその両方）、価格、そして需要曲線に沿った移動と曲線そのものの移動とを切り分ける方法が必要である。Epoch のベンチマーク価格は企業レベルの請求額ではなく、企業の請求額は `C` ではない。これらを結びつけるには、本研究にないパネルが必要である。同じエピソードについて、支払った価格、行った呼び出し、裁定された完了ラベルを記録したアカウントである。そのパネルがなければ、`t*` 以後の需要の傾きは識別されない。第3.10節のおもちゃの余剰が示すのは、二次の至福点が `p` の下落に対して有限の最適点を保つということだけである。それは欠けている回帰ではない。

セグメント化は同じ設計に属する。プールする前に、各製品を有限の `C` か際限のないものかに符号化する。チケットデスクと際限のない研究ツールをプールすると、二つの需要の体制が平均され、際限のない需要があるかのような外観が作り出されうる。第5.3節の軍事の除外は、相手の目的が局所的な至福点を妨げる領域に同じ規則を適用したものである。それらのコードを付けた表は、たとえまだ価格がなくても、単一の獲得可能な最大市場規模の数値より多くの情報をもたらすだろう。その表は作られていない。

<div id="510-why-no-multiple-of-kt-ln-2-is-stated" class="anchor-alias" aria-hidden="true"></div>

### 5.10 `kT ln 2` の倍数を述べない理由

Landauer の結果は、温度 `T` における理想化された消去についての不等式である。Horowitz（2014）は、そのチュートリアルの仮定の下で、特定の CMOS 演算とメモリのトラフィックについてのエネルギーをピコジュール単位で報告している。一方を他方で割って数が得られるのは、誰かが演算、活性化率、温度、デバイスを選んだ後だけである。それらの選択のどれも、本稿では測定していない。Landauer の限界の何倍上にあるかを述べれば、それらの選択がなされたかのように装うことになる。科学的な言明は不等式の向きである。Horowitz の記述における実際の不可逆な CMOS は限界のはるか上にあり、価格指数がデバイスを限界の上へ移すことはない。

<div id="6-limits-and-threats-to-validity" class="anchor-alias" aria-hidden="true"></div>

## 6. 限界と妥当性への脅威

構成概念妥当性。操作的な飽和は `C` に依存する。悪意のある、あるいは曖昧な `C` は述語を恣意的なものにする。本稿の防御は、`C` を観察可能な節で書くことを求めることである。多くの現実の製品には、まだそのような書面がない。それらの製品については、理論はまだ経験的に適用されない。

価格の主張の内的妥当性。S-2 は、Epoch が用いた識別のあり方（品質調整、ベンチマークの選択、掲示価格と実際の請求額の違い）をそのまま引き継いでいる。本稿はミクロデータを監査していない。Epoch の系列が改訂されれば S-2 の大きさは改訂されるが、方向は改訂されないかもしれない。S-2 は、経営向けの数値として用いる前に、一次資料のページと照らして読み直すべきである。

外的妥当性。定義された仕事とケアは軍事的な対抗関係を除外し、研究を除外することもありうる。電話の保有はエージェントの製品には移転しない。自転車株の価格はソフトウェアの利幅には移転しない。構成したエピソードは標本ではない。

測定の妥当性。分割したジュールも、検出器の混同行列もなく、どのデバイスにもエネルギー計がない。ベンダーのハードウェアの仕様はエネルギーの測定ではない。

欠落変数。新しいタスクは、安価な合成によって解放された支出を吸収しうる。第5.1節はこのことを述べている。雑務ごとの飽和を総量の計算需要の予測として扱うロードマップは、本稿によって正当化されない。

出版バイアスと文書の種類。Wu は書籍である。Humane Technology のページは提言である。Goldman Sachs はセルサイドである。Quinn、Epoch、Baumol、Acemoglu and Restrepo、Landauer、Horowitz が論証の重みを担う引用であり、それらは異なる文を支持している。本稿の構成は、それらの文が平均されて一つの気分になってしまうのを防ぐための試みである。

反証条件。引用した理論が限界効用ゼロの領域を含まなければ、S-1 は成り立たない。それは含んでいる。Epoch の一次資料のページがその種の下落を報告していなければ、S-2 は成り立たない。正しい `C` の後の追加の呼び出しが、独立に規定された価値を系統的に高めるようなラベル付きコーパスが将来現れれば、そのコーパスについて飽和は反証されるだろう。そのようなコーパスが一つあっても、定義は反証されない。それは定義の適用範囲を画定することになる。

ベンダーのハードウェアの仕様が挙げるのは容量であって、スイッチング活動、静的電力、あるいはワークロードのエネルギーではない。エネルギーの報告は、ハードウェア、クロック、ワークロード、計器、継続時間を明記しなければならない。

<div id="7-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 7. 結論

飽和は引用した理論における標準的な対象であり、狭い操作的な形をもつ。追加の合成が前進させない、書面の完了述語である。Epoch の公表系列は、一定性能の推論の金銭価格の急落を記録している。その下落はデジタルな雑務を限界において無料と記述することを支持するが、無料のジュール、無料のプラントの動作、ケアの費用構造の終わりを支持するものではない。自転車株の価格、スマートフォンの普及、アテンション市場は、第4節が述べる具体的な点で、それぞれ弱くも強くもある。欠けている科学的な対象は、ラベル付きの完了検出器、完了前と完了後のエネルギーの分割、そしてリバウンドを捉えられる需要の推定である。それらが存在するまで、本稿の経験的な内容は引用した記録であり、その形式的な内容は述語である。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. https://doi.org/10.1002/047174882X

Hoffmann, J., et al. Training compute-optimal large language models. arXiv:2203.15556.

Kaplan, J., et al. Scaling laws for neural language models. arXiv:2001.08361.

Shannon, C. E. Coding theorems for a discrete source with a fidelity criterion. IRE National Convention Record, 1959.

Acemoglu, D., and Restrepo, P. Automation and new tasks: how technology displaces and reinstates labor. Journal of Economic Perspectives 33(2), 2019. https://www.aeaweb.org/articles?id=10.1257/jep.33.2.3

Ames, A. D., et al. Control barrier functions: theory and applications. ECC 2019. https://doi.org/10.23919/ECC.2019.8796030

Andersen, E. S. Satiation in an evolutionary model of structural economic dynamics. Journal of Evolutionary Economics, 2001. https://doi.org/10.1007/PL00003852

Baumol, W. J. Macroeconomics of unbalanced growth: the anatomy of urban crisis. American Economic Review 57, 415-426, 1967.

Bennett, C. H. Logical reversibility of computation. IBM Journal of Research and Development, 1973. https://doi.org/10.1147/rd.176.0525

Center for Humane Technology. The attention economy. https://www.humanetech.com/youth/the-attention-economy

Emberson, L., and Roodman, D. / Epoch AI. The plunging price of thought. 22 September 2026. https://epoch.ai/publications/the-plunging-price-of-thought

Epoch AI. LLM inference price trends. 12 March 2025. https://epoch.ai/data-insights/llm-inference-price-trends

Gillingham, K., Rapson, D., and Wagner, G. The rebound effect and energy efficiency policy. Review of Environmental Economics and Policy 10(1), 68-88, 2016. https://doi.org/10.1093/reep/rev017 Working text: https://gwagner.com/wp-content/uploads/Gillingham-Rapson-Wagner-2015-Rebound-Effect.pdf

Alcott, B. Jevons' paradox. Ecological Economics 54(1), 9-21, 2005. https://doi.org/10.1016/j.ecolecon.2005.03.020

Anthropic. How we built our multi-agent research system. 13 June 2025. https://www.anthropic.com/engineering/multi-agent-research-system

Jevons, W. S. The Coal Question. London: Macmillan, 1865.

Keynes, J. M. Economic possibilities for our grandchildren. 1930. Reprinted in Essays in Persuasion, 1931.

Nordhaus, W. D. Two centuries of productivity growth in computing. Journal of Economic History 67(1), 128-159, 2007. https://doi.org/10.1017/S0022050707000058

Goldman Sachs. Gen AI: too much spend, too little benefit? https://www.goldmansachs.com/insights/top-of-mind/gen-ai-too-much-spend-too-little-benefit

Horowitz, M. Computing's energy problem (and what we can do about it). ISSCC 2014. https://doi.org/10.1109/ISSCC.2014.6757323

Landauer, R. Irreversibility and heat generation in the computing process. IBM Journal of Research and Development, 1961. https://doi.org/10.1147/rd.53.0183

Laya. System One models and typed decision engines (comparison table, checked 2 October 2026). https://laya-ai.com/system-one-models

Convai Innovations. Laya model card. https://huggingface.co/convaiinnovations/laya

TypeSafe AI. Introducing System One Models and Jev. 15 September 2026. https://typesafe.ai/blog/introducing-system-one-models-and-jev

Ma, S., et al. The era of 1-bit LLMs. arXiv:2402.17764.

Pew Research Center. Mobile fact sheet. https://www.pewresearch.org/internet/fact-sheet/mobile/

Quinn, W. Technological revolutions and speculative finance: evidence from the British Bicycle Mania. Cambridge Journal of Economics 43(2), 271-294, 2019. https://doi.org/10.1093/cje/bey029

Wei, J., et al. T-MAC. arXiv:2407.00088.

Wu, T. The Attention Merchants. Knopf. https://www.penguinrandomhouse.com/books/234876/the-attention-merchants-by-tim-wu/

Chung, J.-W., Wu, R., Ma, J. J., and Chowdhury, M. Where Do the Joules Go? Diagnosing Inference Energy Consumption. arXiv:2601.22076. https://arxiv.org/abs/2601.22076

Energy use of AI inference, efficiency pathways, and test-time scaling. *Joule*, 2026. https://www.cell.com/joule/fulltext/S2542-4351(26)00114-5

Luccioni, A. S., Strubell, E., and Crawford, K. From efficiency gains to rebound effects: the problem of Jevons' Paradox in AI's polarized environmental debate. *FAccT* 2025. https://doi.org/10.1145/3715275.3732007

Ostrovsky, N. / Epoch AI. What you need to know about AI energy use. Updated 14 July 2026. https://epoch.ai/publications/ai-energy

Anthropic. Anthropic Economic Index report: uneven geographic and enterprise AI adoption. September 2025. https://www.anthropic.com/research/anthropic-economic-index-september-2025-report

Bai, L., Huang, Z., Wang, X., et al. How do AI agents spend your money? Analyzing and predicting token consumption in agentic coding. arXiv:2604.22750, 2026. https://arxiv.org/abs/2604.22750

Brockway, P. E., Sorrell, S., Semieniuk, G., Heun, M. K., and Court, V. Energy efficiency and economy-wide rebound effects: a review of the evidence and its implications. Renewable and Sustainable Energy Reviews 141, 110781, 2021. https://doi.org/10.1016/j.rser.2021.110781

Brookes, L. The greenhouse effect: the fallacies in the energy efficiency solution. Energy Policy 18(2), 199-201, 1990. https://doi.org/10.1016/0301-4215(90)90145-T

Chen, X., Xu, J., Liang, T., et al. Do NOT think that much for 2+3=? On the overthinking of o1-like LLMs. arXiv:2412.21187, 2024. https://arxiv.org/abs/2412.21187

Cuadron, A., Li, D., Ma, W., et al. The danger of overthinking: examining the reasoning-action dilemma in agentic tasks. arXiv:2502.08235, 2025. https://arxiv.org/abs/2502.08235

Du, M. Tiered super-Moore's law: price evolution, production frontiers, and market competition in large language models. arXiv:2603.28576, 2026. https://arxiv.org/abs/2603.28576

Fouquet, R., and Pearson, P. J. G. Seven centuries of energy services: the price and use of light in the United Kingdom (1300-2000). The Energy Journal 27(1), 2006. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol27-No1-8

Gundlach, H., Lynch, J., Mertens, M., et al. The price of progress: price performance and the future of AI. arXiv:2511.23455, 2025. https://arxiv.org/abs/2511.23455

Khazzoom, J. D. Economic implications of mandated efficiency in standards for household appliances. The Energy Journal 1(4), 1980. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol1-No4-2

Masanet, E., Shehabi, A., Lei, N., Smith, S., and Koomey, J. Recalibrating global data center energy-use estimates. Science 367(6481), 984-986, 2020. https://doi.org/10.1126/science.aba3758

Saunders, H. D. The Khazzoom-Brookes postulate and neoclassical growth. The Energy Journal 13(4), 1992. https://doi.org/10.5547/ISSN0195-6574-EJ-Vol13-No4-7

Sorrell, S., and Dimitropoulos, J. The rebound effect: microeconomic definitions, limitations and extensions. Ecological Economics 65(3), 636-649, 2008. https://doi.org/10.1016/j.ecolecon.2007.08.013

Tsao, J. Y., Saunders, H. D., Creighton, J. R., Coltrin, M. E., and Simmons, J. A. Solid-state lighting: an energy-economics perspective. Journal of Physics D: Applied Physics 43(35), 354001, 2010. https://doi.org/10.1088/0022-3727/43/35/354001

Witt, U. Learning to consume: a theory of wants and the growth of demand. Journal of Evolutionary Economics 11(1), 23-36, 2001. https://doi.org/10.1007/PL00003851

<div id="appendix-a-decision-rules-and-non-results" class="anchor-alias" aria-hidden="true"></div>

## 付録A. 判断規則と非結果

| Id | 言明 | クラス |
|----|-----------|-------|
| R1 | 容量を加える前に完了述語を書く。 | 設計 |
| R2 | Epoch 型の証拠が当てはまるところでは、合成価格のプレミアムが侵食されることを予期する。 | 設計、S-2 を条件とする |
| R3 | 無料のエネルギーや無料の作動を主張しない。 | S-9 からの制約 |
| R4 | 経済的な停止の理由を物理的な停止の理由から切り分ける。 | 設計 |
| R5 | 停止を正確なものとして扱う前に、検出器の誤り率を公表する。 | まだ結果ではない |
| R6 | 完了の前と後でエネルギーを分割する。 | まだ結果ではない |
| R7 | 敵対的な競争を飽和の主張の外に置く。 | 範囲 |
| R8 | より細かい大きさを引用する前に、Pew と Epoch の一次資料を読み直す。 | 方法 |

<div id="appendix-c-claim-map" class="anchor-alias" aria-hidden="true"></div>

## 付録C. 主張の地図

現時点で支持されるもの：S-1 から S-9 まで、第4節の範囲の文とともに。

支持されないもの：Baumol のコスト病の終わり。無料のプラントの動作。軍事需要の飽和。数値としてゼロの全体的なリバウンド。Landauer の規模での言語モデルの動作。ボードのワット数。飽和した雑務についての事実としての AGI の価格。普遍的な蒸留の遅れ。シリコンの性能上の優位。

未実施の測定：第3.3節。
