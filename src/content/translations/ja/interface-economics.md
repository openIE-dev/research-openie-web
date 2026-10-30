---
title: "検証されないインターフェースの代償"
deck: "インターフェースの不具合がもたらす費用。一次資料が述べる数値のみを用い、それぞれを計上費用、モデル推定、調査推定のいずれかとして示す。"
lang: "ja"
source: "interface-economics"
complete: true
---

*バージョン 1.0、2026年10月11日。LaTeX PDF：[/pdfs/latex/interface-economics.pdf](/pdfs/latex/interface-economics.pdf)（[ソース](/pdfs/latex/interface-economics.tex)）。*

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 要旨

本エッセイは、システムの部分と部分のあいだの受け渡しで起きる不具合について公表された費用を集め、各数値にそれがどのように算出されたかのラベルを付ける。それらを合算してひとつの総額にすることはしない。

**平易な言葉で**

1. 受け渡しでの不具合のなかには、正確な値札がついたものがある。たとえば、数億ドルを費やして失われた火星探査機である。
2. より大きな国全体の数字は調査とモデルによる推定であり、そのどれも受け渡しの不具合だけを数えてはいない。
3. 各側が何を前提としているかを書き出して確認するのは安上がりだが、それを行う者が費用を払い、恩恵は全員が受けるため、行われないままになりがちである。

<div id="0-definitions-and-scope" class="anchor-alias" aria-hidden="true"></div>

## 0. 定義と範囲

**インターフェース**とは、ある当事者の出力が別の当事者の入力になる受け渡しのことである。システムが何をすべきかを述べる人々（理論家）から、それを構築する人々（作り手）へ、さらにそれを運用する人々（利用者）への受け渡しであり、あるいはソフトウェアとハードウェアのスタックの二つのレベルのあいだの受け渡しである。**インターフェースの前提**とは、受け渡しを越える値についての条件であって、受け取る側が自らの正しさのために依拠しているものをいう。単位、範囲、型、バージョン、運用包絡などがそれにあたる。前提が依拠されていながら、書き出されても確認されてもいないとき、その前提は**検証されていない**。Garlan、Allen、Ockerbloom によるアーキテクチャの不整合の研究から、事故を相互作用の不具合としてとらえる Leveson の研究にいたるまで、長い工学の文献が、多くのシステムの不具合の所在をこうした前提に見いだしている [19, 20]。本エッセイは、それらの不具合にどれだけの費用がかかるかを問い、一次資料が述べる数値だけで答える。各数値には種類のラベルを付ける。**計上費用**とは、機関や企業が実際に支出した、あるいは失ったと報告している額である。**モデル推定**とは、調査、聞き取り、二次データから、明示された方法によって算出された数値である。**予測**とは将来についての言明である。この三種類は合算しない。

単一のインターフェースの不具合の計上費用は大きく、具体的である。Mars Climate Orbiter を含む Mars Surveyor 1998 プロジェクトの費用は3億2,760万ドルであり [1]、ESA は最初の Ariane 5 とともに失われた Cluster ミッションを回復するために2億1,400万 ECU を承認した [4]。モデル推定はより大きく、より広い。NIST は、米国におけるソフトウェアテスト基盤の不備による年間費用を595億ドルとし [6]、米国の資本施設産業における相互運用性の不備による費用を年158億ドルとした [7]。CISQ は、2022年の米国における低品質ソフトウェアの費用を2兆4,100億ドル以上、累積した技術的負債を約1兆5,200億ドルと推定した [8]。これらのどれも、インターフェースの不具合だけを測ってはいない。どれもそれを含んでいる。

<div id="1-kinds-of-number" class="anchor-alias" aria-hidden="true"></div>

## 1. 数値の種類

ソフトウェアの不具合についての経済的な主張は、似て見えるが実は異なる三つの形で流通している。プロジェクト予算は会計記録である。国全体の費用推定は、調査、事例研究、規模についての仮定を入力とするモデルの出力である。予想はそのどちらでもない。本エッセイはひとつの規則に従う。すべての数値は、その種類、出典、そして実際に何を数えているかを伴う。

「インターフェースの不具合」の費用を単一の年間総額として示す数値は、方法を明示しないまま出回っている。第3節の一次推定のどれもインターフェースを切り分けていないので、本エッセイはそれらをいかなる単一の総額にも対応づけない。

<div id="2-single-failures-accounted" class="anchor-alias" aria-hidden="true"></div>

## 2. 単一の不具合、計上されたもの

**Mars Climate Orbiter。** インターフェースは単位であった。ポンド重秒で表されたスラスタのインパルスデータが、ニュートン秒として読まれたのである [2]。NASA のプロジェクトファクトシートは、Mars Surveyor 1998 プロジェクトの費用を、オービターと Mars Polar Lander を合わせて3億2,760万ドルとしている。内訳は、宇宙機の開発に1億9,310万ドル、打ち上げに9,170万ドル、運用に4,280万ドルである [1]。当時の報道は、オービター単体を1億2,500万ドルの宇宙機としていた [3]。種類：プロジェクトの計上費用。一機の宇宙機については報道された数値がある。

**Ariane 501 と Cluster。** インターフェースは運用包絡であった。Ariane 4 から再利用されたソフトウェアは水平速度のある範囲を前提としていたが、新しいロケットはその範囲を超えた [5]。4機の Cluster 衛星が失われた。ESA による回復の記録には、同機関の科学プログラム委員会が1996年に見積もった選択肢が記されており、その中には4機の衛星を当初の設計どおりに再製作する3億5,100万計算単位の案が含まれている。そして ESA は1997年、回復ミッション Cluster II を2億1,400万 ECU で承認した [4, 17]。種類：ESA が選んだ回復の計上費用。これは損失の下限であり、衛星の価値や、遅れた科学の価値ではない。

この二つの事例が問題の形を定める。どちらの事例でも、各組織はそれぞれ自分の仕事をこなし、費用はインターフェースで生じた。どちらの事例でも、不整合を捉えたはずの確認は、損失に比べれば安価であった。どちらの事例も国全体の数値に拡大することはできない。単発の事故は標本ではないからである。

<div id="3-national-estimates-modeled" class="anchor-alias" aria-hidden="true"></div>

## 3. 国全体の推定、モデルによるもの

![本エッセイで引用する一次推定を、対数のドル軸上に種類別に色分けして示した棒グラフ。計上費用：Mars Surveyor 1998 プロジェクトの3億2,760万ドルと、Cluster II 回復の2億1,400万 ECU。モデル推定：NIST 2004 による米国の資本施設における相互運用性の不備、年158億ドル。NIST 2002 によるソフトウェアテスト基盤の不備、年595億ドル。Stripe 2018 による不良コードに費やされる開発者の時間、年約850億ドル。CISQ 2022 による技術的負債、累積約1兆5,200億ドル。CISQ 2022 による米国における低品質ソフトウェアの費用、2022年に少なくとも2兆4,100億ドル。](/figures/interface-economics/estimates-by-kind.svg)

*図1. 種類別の推定。データ図、対数軸。値は出典に印刷されたとおりである [1, 4, 6, 7, 8, 9]。棒は加算できない。CISQ の総額には NIST と Stripe の数値と重なる区分が含まれており、ストック（技術的負債）が年間のフローと並べて描かれている。[PNG 版](/figures/interface-economics/estimates-by-kind.png)も用意している。*

**ソフトウェアテスト、NIST 2002。** RTI International は NIST のために、ソフトウェアテスト基盤の不備が米国経済に年222億ドルから595億ドルの費用を生じさせていると推定した。上の数値が総費用であり、下の数値は実現可能な改善によって取り除ける部分である [6]。方法は、輸送機器製造と金融サービスという二つの部門の開発者と利用者への調査と、国全体の経済への外挿とを組み合わせたものである。種類：モデル推定。

**相互運用性、NIST 2004。** Gallaher らは NIST のために、所有者、運用者、建築家、エンジニア、施工業者への聞き取りと調査から、米国の資本施設産業における相互運用性の不備による費用を年158億ドルと推定した [7]。ここでいう相互運用性とは、設計データと運用データをソフトウェアシステムのあいだで交換し利用できる能力であり、要旨で定義した意味でのインターフェースにあたる。報告書は、その数値が定量化できなかった費用を除外していると述べている。種類：モデル推定。一つの産業についてのもので、控えめな値として示されている。

**低品質ソフトウェア、CISQ 2022。** Consortium for Information and Software Quality は、米国における低品質ソフトウェアの費用が2022年に少なくとも2兆4,100億ドルにまで増え、累積した技術的負債が約1兆5,200億ドルにまで増えたと推定した [8]。報告書は総額を区分から組み立てている。運用上の不具合、失敗したプロジェクト、レガシーシステムの問題、そしてソフトウェアの脆弱性に起因するとされるサイバー犯罪の損失である。入力の多くは二次資料から得ており、サイバー犯罪の構成要素は世界全体の予想を米国に按分したものである [8]。種類：部分的に他の推定の上に築かれたモデル推定。この分野で文書化された最大の数値であり、インターフェースではなく、ソフトウェア品質全体についての数値である。

**開発者の時間、Stripe 2018。** Stripe が Harris Poll とともに実施した調査は、開発者がデバッグやリファクタリングなどの保守作業に週約17.3時間を、「不良コード」に週約4時間を費やしていると報告した。報告書は後者を世界全体で年間850億ドル近くと評価している [9]。種類：調査に基づく推定。

これらの数値が共有しているのは、総額ではなく構造である。いずれも、依拠されながら確認されなかった前提の費用を数えている。テストされていない経路、引き継がれないデータ形式、境界にある脆弱性、誰もその契約を言い直せないレガシーシステムである。不整合が生じた場所で確認されないと、それは正しい形式の入力として上位のすべてのレベルへ渡されるため、その費用は原因から遠く離れた所に現れる。Mars Climate Orbiter の航法解がその例であり、それは内部では整合していながら誤っていた [2]。国全体の推定を数えるのではなくモデル化しなければならない理由も、そこにある。

<div id="4-technical-debt-is-an-interface-account" class="anchor-alias" aria-hidden="true"></div>

## 4. 技術的負債はインターフェースの勘定である

Cunningham は1992年、技術的負債を、構造がまだチームの学んだことに合っていないコードを出荷する費用として導入した。負債が返済されるまで、その後のあらゆる変更に利子が支払われる [10]。Sculley らは、機械学習システムではその負債の大部分がモデルの外、すなわちグルーコード、設定、データ依存、宣言されていない利用者の中にあることを示した [11]。上で定義した用語でいえば、技術的負債の多くは帳簿に載せられた検証されていないインターフェースの前提の残高であり、その利子は、確認されなかった不整合が上位のすべてのレベルに、実行のたびに課す費用である。

米国で累積した約1兆5,200億ドルの技術的負債という CISQ の推定は、修正にかかる費用で測ったストックである [8]。第3節の年間の数値はフローである。その経済的な帰結は仮説であり、第7節で検証する。境界で一度だけ支払われる確認は、ある作業負荷全体で見れば、到達するあらゆるレベルで繰り返し支払われる不具合よりも費用が少なくて済む可能性がある。

<div id="5-standards-are-how-markets-close-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 5. 標準は市場がインターフェースを閉じる方法である

経済学者は数十年にわたり、インターフェースの問題を別の名前、すなわち互換性という名のもとで研究してきた。Katz と Shapiro は、製品の価値がともに使える利用者の数とともに上がるとき、互換性をもとうとする企業の誘因はその規模と地位に依存し、市場が提供する互換性は過少になりうることを示した [12]。Farrell と Saloner は、各利用者の選択が他者の選択に依存するために、市場が古い標準にとどまり続けることも、新しい標準へ速すぎる速さで移ることもありうることを示した [13]。David による QWERTY キーボードの歴史は、経路依存性を具体的なものにした [14]。Baldwin と Clark は、設計ルール、すなわち事前に固定された可視のインターフェースこそが、モジュール型の産業の形成をそもそも可能にすることを示した [15]。Swann は英国政府のためのレビューで、標準が生産性と貿易に寄与するという証拠をまとめた [16]。

共通する筋道は、インターフェースは私的な費用を伴う公共財だということである。前提を書き出して確認することは、境界を越えるすべての当事者に利益をもたらすが、その費用は書き出す者が負担する。どの当事者にも、受け渡しを誰か他の者の仕事とみなす理由がある。標準化団体、規制当局、プラットフォームの所有者は、歴史的にその費用を負担してきた制度である。測定単位を伴う型や、モデル検査器で検査される形式仕様のような機械検査される表現は [21, 22]、インターフェースを閉じる私的な費用を、その確認を実行する費用に向けて引き下げる。

<div id="6-generated-code-crosses-the-same-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 6. 生成されたコードは同じインターフェースを越える

自動生成器が作るコードは、手書きのコードと同じ境界を越える。仕様と実装のあいだ、ライブラリとその利用者のあいだ、ソフトウェアとその下にある命令の契約のあいだである。それぞれの越境は前提を伴い、生成器は、それを確認するように作られていない限り、それを確認しない。したがって第3節の数値は、自動コード生成にも関係する。低品質ソフトウェアの費用の大きな割合が境界における未確認の前提の費用であるなら、インターフェースを閉じることの価値は、コードをより速く書くことの価値を上回るかもしれない。これは価値がどこにあるかについての仮説であり、測定ではない。第7節のプロトコルが、それを測定する方法である。

<div id="7-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 7. 命題とプロトコル

**命題 E1（インターフェースの割合）。** 計上費用をもつソフトウェアの不具合の母集団において、要旨で定義した意味でのインターフェースの前提の違反を原因とする費用の割合は、原因が一つの組織の内部だけにある費用の割合を上回る。

*プロトコル。* 機関の事故報告書や規制当局への提出書類など、費用の欄をもつ公開のインシデントコーパスを用いる。二人のコーダーが、費用を知らされない状態で、要旨の定義を用いて各原因をインターフェースか内部かに分類する。費用で重み付けしたインターフェースの割合をブートストラップ区間とともに報告し、コーダー間の一致度も報告する。

**命題 E2（確認は割に合う）。** 固定された作業負荷について、インターフェースに明示的な確認を加える費用は、それが拒否する不具合の期待費用を、確認がなければその不具合が到達したはずのすべてのレベルにわたって合計したものよりも低い。形式的には、$N$ 回越えられるインターフェースについて、$c$ を一回の確認のドル建て費用、$\pi$ を一回の越境が前提に違反する確率、$L_m$ を捕捉されなかった違反が到達する $M$ 個のレベルのうちレベル $m$ に課すドル建て費用とする。確認が割に合うのは $N c < N \pi \sum_{m=1}^{M} L_m$ のとき、すなわち $c < \pi \sum_m L_m$ のときである。第2節の二つの計上事例では $\sum_m L_m$ は $10^8$ ドルのオーダーであるから、この条件は、越境一回あたりの費用が $10^8 \pi$ ドル未満のあらゆる確認について成り立つ。

*プロトコル。* 各レベルの運用費用がわかっているシステム上で、記録された各インターフェースの前提の違反を固定のシード集合で注入し、各確認の費用と、捕捉されなかった各違反がたどり着いた所での費用を記録する。両方を、ジュールで、また明示した価格でのドルで報告する。

**命題 E3（インターフェースを閉じるとその私的費用が下がる）。** インターフェースの前提が共有された表現の一部であり、構成によって確認されるとき、単一の当事者がそれを閉じる費用は、その確認を実行する費用に向かって下がる。

*プロトコル。* 実装者に渡される仕様のような、組織間の実際の受け渡しを一つ選ぶ。一方の群ではそれを散文の文書として、もう一方の群では機械検査される表現として運ぶ。受け渡しの両側の労働時間と、各群でインターフェースに所在する不具合を、Wilson 95% 区間とともに記録する。

<div id="8-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 8. 結論

検証されないインターフェースの費用は現実のものであり、大きく、しかも測定が不十分である。単一の不具合は正確に値付けでき、それらは、各組織が誰か他の者の持ち分だと考えていた境界で損失が生じることを示している。国全体の推定はモデルであり、そのうち最大のものはソフトウェア品質全体を記述している。インターフェースの不具合だけの費用を述べている一次資料はなく、本エッセイもそれを提供しない。証拠が支持するのはひとつの構造である。それは、境界で生じ、上位へ伝播し、負債として複利的に積み上がる費用であり、確認されたインターフェースという公共財を過少にしか供給しない市場の中で生じる。第7節の命題は、その構造をどのように検証できるかを述べている。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

[1] NASA Jet Propulsion Laboratory, "Mars Climate Orbiter Fact Sheet," Mars Surveyor 1998 project. Archived copy: https://web.archive.org/web/20121003073752/http://mars.jpl.nasa.gov/msp98/orbiter/fact.html

[2] Mars Climate Orbiter Mishap Investigation Board, *Phase I Report*. NASA, 10 November 1999. https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf

[3] A. Pollack, "Two Teams, Two Measures Equaled One Lost Spacecraft," *The New York Times*, 1 October 1999. https://archive.nytimes.com/www.nytimes.com/library/national/science/100199sci-nasa-mars.html

[4] European Space Agency, "Cluster will fly again!," press release N° 12 1997, 26 March 1997. https://www.esa.int/Newsroom/Press_Releases/Cluster_will_fly_again

[5] J. L. Lions (chair), *Ariane 5 Flight 501 Failure: Report by the Inquiry Board*. European Space Agency, 19 July 1996. https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf

[6] RTI International for the National Institute of Standards and Technology, *The Economic Impacts of Inadequate Infrastructure for Software Testing*, Planning Report 02-3, May 2002. https://www.nist.gov/system/files/documents/director/planning/report02-3.pdf

[7] M. P. Gallaher, A. C. O'Connor, J. L. Dettbarn and L. T. Gilday, *Cost Analysis of Inadequate Interoperability in the U.S. Capital Facilities Industry*, NIST GCR 04-867, 2004. doi:10.6028/NIST.GCR.04-867

[8] H. Krasner, *The Cost of Poor Software Quality in the US: A 2022 Report*. Consortium for Information and Software Quality, 2022. https://www.it-cisq.org/the-cost-of-poor-quality-software-in-the-us-a-2022-report/

[9] Stripe, *The Developer Coefficient*, with Harris Poll, September 2018. https://stripe.com/files/reports/the-developer-coefficient.pdf

[10] W. Cunningham, "The WyCash portfolio management system," *OOPSLA 1992 Addendum*, *ACM SIGPLAN OOPS Messenger* 4(2), 1993, pp. 29 to 30. doi:10.1145/157710.157715

[11] D. Sculley, G. Holt, D. Golovin, E. Davydov, T. Phillips, D. Ebner, V. Chaudhary, M. Young, J.-F. Crespo and D. Dennison, "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems* 28, 2015. https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

[12] M. L. Katz and C. Shapiro, "Network Externalities, Competition, and Compatibility," *American Economic Review* 75(3), June 1985, pp. 424 to 440. RePEc:aea:aecrev:v:75:y:1985:i:3:p:424-40. https://www.jstor.org/stable/1814809

[13] J. Farrell and G. Saloner, "Standardization, Compatibility, and Innovation," *RAND Journal of Economics* 16(1), 1985, pp. 70 to 83. doi:10.2307/2555589

[14] P. A. David, "Clio and the Economics of QWERTY," *American Economic Review* 75(2), Papers and Proceedings, May 1985, pp. 332 to 337. RePEc:aea:aecrev:v:75:y:1985:i:2:p:332-37. https://www.jstor.org/stable/1805621

[15] C. Y. Baldwin and K. B. Clark, *Design Rules, Volume 1: The Power of Modularity*. MIT Press, 2000. doi:10.7551/mitpress/2366.001.0001

[16] G. M. P. Swann, *The Economics of Standardization: An Update*. Report for the UK Department for Business, Innovation and Skills, 2010. https://www.gov.uk/government/publications/economics-of-standardisation-update-to-report

[17] European Space Agency, "The Resurrection of the Cluster Scientific Mission," *ESA Bulletin* 91, 1997. https://www.esa.int/esapub/bulletin/bullet91/b91cred.htm

[19] D. Garlan, R. Allen and J. Ockerbloom, "Architectural mismatch: why reuse is so hard," *IEEE Software* 12(6), 1995, pp. 17 to 26. doi:10.1109/52.469757

[20] N. G. Leveson, *Engineering a Safer World: Systems Thinking Applied to Safety*. MIT Press, 2012. doi:10.7551/mitpress/8179.001.0001

[21] A. Kennedy, "Types for Units-of-Measure: Theory and Practice," in *Central European Functional Programming School*, Lecture Notes in Computer Science 6299, Springer, 2010, pp. 268 to 305. doi:10.1007/978-3-642-17685-2_8

[22] C. Newcombe, T. Rath, F. Zhang, B. Munteanu, M. Brooker and M. Deardeuff, "How Amazon Web Services uses formal methods," *Communications of the ACM* 58(4), 2015, pp. 66 to 73. doi:10.1145/2699417
