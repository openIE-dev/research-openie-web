---
title: "AGIの追求が計算における三体問題を解決する"
deck: "計算システムは、それを仕様化し、構築し、使用する人々の間の引き渡しにおいて最も頻繁に失敗する。あらゆる引き渡しにおいてあらゆる仮定をチェックすることで、修正がなされた場所に留まるスタックが得られる。"
lang: "ja"
source: "three-body"
complete: true
---

<div id="the-pursuit-of-agi-resolves-the-three-body-problem-in-computing" class="anchor-alias" aria-hidden="true"></div>

リビジョン 395f081、2026年11月4日。LaTeX PDF: [/pdfs/latex/three-body.pdf](/pdfs/latex/three-body.pdf) ([source](/pdfs/latex/three-body.tex)).

<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## 要旨

大規模なエンジニアリングの失敗は、あるグループが作業を別のグループに引き渡す際に、前提が文書化されていないことから始まることが多い。本稿ではその引き渡しを定義し、検証がシステムを安定化させる条件を示し、誤りを証明できるテストを提示する。

**平易な言葉で**

1. ほとんどの大規模なコンピュータ障害は、チーム間または部品間の引き渡し地点で発生し、内部で起こることは少ない。
2. 原因は通常、誰も文書化しなかった推測、例えば数値の単位が何であるかといったものに起因する。
3. そのような推測をすべて文書化し、機械によって検証すれば、一箇所で行われた修正はその場所に留まり、上位の構成要素を破壊することはない。

<div id="1-thesis" class="anchor-alias" aria-hidden="true"></div>

## 1. 論文

劉慈欣の小説『三体』[1]では、三つの太陽の周回軌道にある惑星に文明が存在する。その季節はリズムがなく、相互重力下にある三体がどこにあるか予測できないためである。本稿のタイトルはこのイメージを計算に借用し、さらに逆転させている。すなわち不安定性は実在するが、原因は特定でき、除去できるということである。

計算には三つの主体がある。**理論家**はシステムがすべきことを述べる：数学、仕様、アルゴリズム、物理モデル。**製作者**はそれを構築する：チップ設計者、コンパイラ・カーネル作者、ライブラリ作者、統合者。**利用者**はそれを実行する：オペレータ、下流プログラム、出力に依存する人間と機械。各主体は有能で内部的に一貫している。定理は成立する。チップはデータシートを満たす。利用者は文書に従う。

問題はそれらの間にある。ある主体から別の主体へのすべてのハンドオフは、単位、電圧、範囲、タイミング、メモリ、エンコーディング、バージョン、動作範囲、意図に関する仮定を伴う。各主体がハンドオフが存在しない、あるいは他者の仕事であると仮定すると、その仮定は書き記されず、書き記されない仮定は検証されない。

**核心的主張。** 計算システムの不安定性は主体そのものではなく、検証されていないインタフェースに位置する。人工汎用知能（AGI）を、すべての主体とスタックのすべての層で正しく動作すべきシステムとして真剣に追求することは、すべてのインタフェース仮定を明示し検証することを要求する。すべてのインタフェース仮定が明示かつ検証されたスタックは、厳密な意味で安定である。すなわち、ある層で行われた修正はその層で正しく保たれ、上位のすべての層に伝播する。これがタイトルが示す解決策である。

この主張は工学的かつ理論的である。定義は[Section 5](#5-definitions-and-propositions)に示し、インタフェース文献は[Section 4](#4-the-interface-literature)でレビューし、証拠は独立にテストされた検証済みシステムから得た（[Section 6](#6-the-stabilized-configuration)）。さらに、主張を打ち負かすプロトコルと反証手段は[Section 8](#8-protocols)および[Section 9](#9-falsifiers)に示す。

<div id="2-the-three-body-problem-and-what-the-analogy-carries" class="anchor-alias" aria-hidden="true"></div>

## 2. 三体問題、およびその類推がもたらすもの

<div id="21-what-the-physics-says" class="anchor-alias" aria-hidden="true"></div>

### 2.1 物理学が示すもの

ニュートンは相互重力下にある二体の運動を閉形式で解いた：各体は共通質量中心の周りを円錐曲線上で運動する。第三の体を加えると問題の性格が変わる。ポアンカレのオスカー二世王賞に対する論文は、1890年に *Acta Mathematica* に掲載され、古典的積分以外に、三体問題を積分可能にするような追加の積分は存在しないことを示した。また、最初の提出での誤りを訂正する過程で、周期軌道付近の軌道が絡み合う様子を見出し、これは決定的カオスの最初の出現と現在認識されている [2, 3]。Barrow-Green の歴史は、賞から訂正された論文までのエピソードをたどっている [3]。

「一般的な閉形式は存在しない」という表現は注意が必要である。しばしば過大評価されるからである。スンドマンは 1912 年と 1913 年に発表した研究で、全角運動量がゼロでない限り、三体問題が全時間にわたる収束級数解を持つことを示した [4]。そして、Wang は 1991 年に n 体問題へと全局的級数解を拡張した [5]。この級数は収束が極めて遅く、予測には実用的でない。ポアンカレの結果の実質的内容は残っている：単純な式は存在せず、近傍の初期条件は指数的に分離し得るため、一般的な配置の長期予測は不可能である。ローレンツは 1963 年に対流の三変数モデルで同様の感度を発見した [6]。Stone と Leigh は 2019 年に、個々の軌道は予測できなくても、結果の分布という統計的記述によってカオス的で非階層的な三体問題を記述できることを示した [7]。

<div id="22-the-special-stable-configurations" class="anchor-alias" aria-hidden="true"></div>

### 2.2 特殊な安定配置

カオスは一般的なケースであり、唯一のケースではない。ラグランジュは 1772 年に、三体が相対位置を保ちながら一緒に回転できることを見出した：一直線上、あるいは正三角形の頂点において [3]。第三体が軽い制限問題において、これらは五つのラグランジュ点である。三角形の点は、一次的に安定であるが、これは主要な質量が二次の質量に対して十分に大きい場合に限られ、ロースが 1874 年に述べた条件（質量比が約 25 以上）[8] による。現在、宇宙機はそのために太陽と地球のラグランジュ点付近に停泊している。さらに周期的解が存在する：ムーアは 1993 年に数値的にフィギュアエイト軌道を発見し [9]、チェンシナーとモンゴメリーは 2000 年に等質量の場合の存在を証明し [10]、そして Šuvakov と Dmitrašinović は 2013 年に新しい族を見つけた [11]。

本稿の教訓は、これらの解の形状にある。各安定構成は、体間の力がそれらと共に移動する座標系において釣り合っている特別な配置である。安定性は任意の単一体の性質ではない。体間の関係性、そしてその関係性が固定されたままである座標系の性質である。

<div id="23-analogy-and-mechanism" class="anchor-alias" aria-hidden="true"></div>

### 2.3 類推とメカニズム

物理学から借用した比喩は誤解を招く恐れがある。表は本稿がアナロジーとして用いるものと、メカニズムとして主張するものを区別している。

| 三体問題 | 計算における対応 | 本稿における位置付け |
|---|---|---|
| 各々は単純な三つの質量 | 理論家、製作者、利用者はそれぞれ単独で整合的 | アナロジー |
| 不安定性は任意の質点からではなく相互作用から生じる | 失敗は内部ではなくインターフェースで起こる | メカニズム、セクション 3 の失敗研究およびセクション 4 の文献に裏付けられる |
| 初期条件への感度が高い | あるインターフェースでの小さな未チェックの不一致がレベルを伝搬しながら増大する | メカニズム、命題 2 として述べられる |
| 有用な一般的閉形式が存在しない | 単一の主体が自らのモデルから全体システムの挙動を予測できない | アナロジー；計算には運動方程式が存在しない |
| 共回転座標系に安定構成が存在する | すべてのインターフェース仮定が検証されたスタックは、修正が行われた箇所で安定する | メカニズム、命題 3 として述べられる |
| カオス的結果の統計的記述 [7] | 個々の失敗が予測できなくても、大規模 N において失敗率を測定できる | 手法、セクション 8 のプロトコルで使用 |

本稿は計算がニュートン力学に従う、インターフェースが力を及ぼす、あるいは組織に対してリャプノフ指数が計算できる、といった主張は一切行わない。物理学は語彙と構造的教訓を提供する：安定性は関係性から生じ、特別な構成において見出され、一般的なケースでは現れない。

<div id="3-the-three-bodies-of-computing-and-their-interfaces" class="anchor-alias" aria-hidden="true"></div>

## 3. 計算の三体とそのインターフェース

![Diagram of three bodies, theorists, makers and users, drawn as circles at the corners of a triangle. Each edge between two bodies is an interface drawn as a band, labeled with the assumptions that cross it: theorist to maker carries the specification, its units and its operating envelope; maker to user carries the API, the version and the voltage and timing limits; user to theorist carries the actual use, the observed failures and the intent that was never written. Dashed portions of each band mark assumptions that no body writes down or checks.](/figures/three-body/three-bodies.svg)

*図 1. 三つの主体とその三つのインタフェース。図。各主体は単独で整合的であるため実線で描かれる。破線のバンドは検証されない仮定であり、失敗が生じる場所である。[PNG コピー](/figures/three-body/three-bodies.png) が提供されている。*

<div id="31-theorist-to-maker" class="anchor-alias" aria-hidden="true"></div>

### 3.1 理論家から製作者へ

理論家の主張は、領域を前提としている：単位、範囲、作動エンベロープ、理想化された機械である。実装者は、その主張が完全であることを前提としている。両者がエンベロープを書き留めなければ、実装は実際に動作する世界とは異なる世界に対して正しいことになる。

1999 年のマーズ・クライメート・オービターの喪失は、教科書的事例である。事故調査委員会は、地上ソフトウェアがスラスターインパルスデータを英単位（ポンド力秒）で提供し、航法ソフトウェアがメートル単位（ニュートン秒）を期待していたため、誤差が巡航中に蓄積し、宇宙船が計画高度よりはるかに低い大気圏に突入したことを指摘した [12]。各主体はそれぞれの作業を行った。単位は、誰も検証しなかったインタフェース仮定であった。

<div id="32-maker-to-user" class="anchor-alias" aria-hidden="true"></div>

### 3.2 製作者から利用者へ

メーカーがインタフェースを公開し、ユーザーがそれに依存する。文書には契約の一部が記載されているが、残りは実装が何を行うかに任されている。Hyrum の観察は次の結果を示す：API の利用者が十分に多ければ、システムのあらゆる観測可能な振る舞いが誰かに依存されることになる、契約が何を約束しようとも [13]。Spolsky の「漏れる抽象化」に関するエッセイは補完的な点を指摘する：非自明な抽象化は、ある程度それが隠すことを意図したものを露呈する [14]。

1996 年の Ariane 5 の初飛行は、メーカーの前提が新たなユーザーにどのように波及するかを示す例である。調査委員会は、Ariane 4 から再利用された慣性基準ソフトウェアが、水平速度に関する 64 ビット浮動小数点値を 16 ビット符号付き整数に変換したことを指摘した。Ariane 5 の高速軌道ではその値が範囲を超え、変換時に例外が発生し、両基準ユニットが停止、そして打上げは飛行シーケンス開始から約 40 秒後に破裂した [15]。このソフトウェアは、書かれた範囲（エンベロープ）に対しては正しかった。エンベロープはコードとともに搬送されたインタフェース前提であり、再記述も検証もされていなかった [15, 16]。

同様のパターンはハードウェア境界でも見られる。命令セットはベンダーが改訂する契約である。RISC‑V の非特権仕様は、いくつかの正式に承認されたベースと、長く増大し続ける正式に承認された拡張のリストを列挙している [17]。Apple は 2020 年に Intel プロセッサから Apple シリコンへ Mac を移行し、以前の契約向けに構築されたアプリケーション用の翻訳層 Rosetta を提供した。Apple のページは、macOS 28 以降は Rosetta が特定の古いゲームに対してのみ残ると述べている [18]。翻訳層自体が公開された終端を持つインタフェースである。命令契約が固定されているかのように書かれたソフトウェアは、予期しない改訂に直面し、対策として別のインタフェース層が必要となる。

<div id="33-user-to-theorist" class="anchor-alias" aria-hidden="true"></div>

### 3.3 利用者から理論家へ

リターンパスは最も検討が少ない。ユーザーはシステムが実際に何を行い、どこで失敗し、何を求めていたかを学ぶ。もしその知識が理論家に修正された声明として戻らなければ、次の仕様は古い前提を繰り返すだけである。Zave と Jackson の要求に関する記述はそのギャップを正確に示す：要求は環境に関する声明であり、仕様はインタフェースに関する声明であり、両者を結びつける領域知識はしばしば書かれていない [19]。Hooker の「ハードウェアロッタリー」はリターンパスが逆方向に機能することを示す：研究アイデアは利用可能なハードウェアとソフトウェアによって成功または失敗し、その価値だけで決まるわけではない。そのため、製作者が構築したものが理論家の考えられる範囲を形作る [20]。

<div id="34-why-the-instability-looks-irreducible" class="anchor-alias" aria-hidden="true"></div>

### 3.4 なぜ不安定性が還元不可能に見えるのか

各主体は自らの一貫したモデルしか認識できない。任意の主体の内部から見ると、上記の失敗は不運や他者のミスのように見える。なぜなら原因はどの主体も所有しない境界に存在するからである。これは、三つの主体が単純な式で表せないという主張の計算論的対応物であり、単一の参加者のモデルが全体を予測できないことを示す。Sculleyらは機械学習システム内でも同様の構造を発見した。そこではモデルコードはシステムのごく一部に過ぎず、保守コストの大部分は接着コード、設定、データ依存性、未宣言のコンシューマ、すなわちインタフェース[21]に存在する。

<div id="4-the-interface-literature" class="anchor-alias" aria-hidden="true"></div>

## 4. インターフェース文献

この論文はその構成要素が新しいわけではない。その貢献はそれらを一つの命題にまとめ、安定化構成とテストを付加することである。

**構造はコミュニケーションに従う。** Conway は 1968 年に、システムを設計する組織は組織のコミュニケーション構造をコピーした設計を生み出すと指摘した [22]。 MacCormack、Baldwin、Rusnak は、緊密に結合された組織と緩く結合された組織が構築した製品のペアを比較し、製品アーキテクチャが予測された方向に異なることを実証した [23]。 もし構成要素がエッジを越えて通信しなければ、システムはそのエッジに未検証のインタフェースを持つことになる。

**インタフェースは設計知識が位置する場所である。** Parnas は 1972 年に、システムは各モジュールが隠す決定によって分割すべきであり、ある決定の変更は一つのモジュールに限定されるべきだと主張した [24]。 Baldwin と Clark はこれを設計規則へ一般化し、事前に固定された可視インタフェース決定の背後で隠れたモジュールが変化できるとした [25]。 Henderson と Clark は、既存企業が既知のコンポーネントの結合方法を変えるアーキテクチャイノベーションに失敗するのは、インタフェースに関する知識が組織に埋め込まれ、検証されないままであるためだと示した [26]。

**正確性は端点で検証されなければならない。** Saltzer、Reed、Clark のエンドツーエンド議論は、機能はエンドポイントにおけるアプリケーションの知識だけで完全かつ正確に実装できるとし、下位層のチェックは性能向上の補助に過ぎないと主張した [27]。 この議論は中間インタフェースがチェック不要であるとは言わない。 重要な性質はその意味が知られている場所で検証されなければならない。

**契約は仮定を明示する。** Hoare は 1969 年にプログラムに前条件と後条件を付与した [28]。 Meyer はそれをデザイン・バイ・コントラクトへと拡張し、各ルーチンが要求するものと保証するものを明示した [29]。 Liskov と Wing は、あるコンポーネントが別のコンポーネントに置き換えられる条件を、利用者が依存する振る舞いを保持することと定義した [30]。 これらはインタフェース仮定を書き下す手段であり、検証可能にする。

**再利用は仮定の不一致で失敗する。** Garlan、Allen、Ockerbloom は 1995 年に、既存部品からシステムを構築すると各部品が他部品に対して暗黙の仮定（制御、データ、プロトコル、環境）を持ち、これらが衝突するため失敗することを発見した [31]。 2009 年に同問題を再検討し、依然として存在することを確認した [32]。

**事故は相互作用の失敗である。** Leveson のシステム理論的説明は安全性を制御問題と捉え、各コンポーネントが自らの仕様を満たしていても、コンポーネント間の安全でない相互作用が事故を招くと論じた [33]。 Cook の短い論考は運用面から同様に、災害は複数の失敗が重なり、システムは通常劣化モードで動作すると述べている [34]。 Lehman のソフトウェア進化に関する観察は時間を加え、実世界で使用されるプログラムは変化し続けなければならず、削減策を講じなければ複雑性が増大すると指摘した [35]。

**検証済みカーネルは境界が証明になり得ることを示す。** seL4 は、実装が仕様を満たすことを機械検証された証明で初めて示した汎用 OS カーネルである [36]。 その証明はインタフェースチェックを全体的に行い、仕様とコードの間で何も仮定しないことを示している。

<div id="5-definitions-and-propositions" class="anchor-alias" aria-hidden="true"></div>

## 5. 定義と命題

<div id="51-definitions" class="anchor-alias" aria-hidden="true"></div>

### 5.1 定義

**定義 1 (body).** body とは、システムについて内部的に一貫したモデルを持つ主体であり、理論家、製作者、あるいは利用者を指す。body は個人、チーム、組織、またはプログラムであり得る。

**定義 2 (interface).** interface とは、二つの body 間、あるいはスタックの二層間におけるハンドオフであり、一方の出力が他方の入力となる境界である。

**定義 3 (interface assumption).** interface assumption とは、interface を横断する値に対する述語 $a$ であり、受信側がその正しさのために依拠するものである。例としては、単位、範囲、型、電圧、タイミング上限、バージョン、エンベロープなどがある。

**定義 4 (checked and unexamined).** 仮定が checked であるとは、メカニズムが $a$ を各横断で評価し、$a$ が失敗した場合に横断を拒否することを指す。unexamined であるとは、依拠はされるが書き下ろされず評価も行われない状態を指す。

**定義 5 (stack).** stack とは、各レベルが下位レベルをそれらの間の interface を通じてのみ消費するレベルの列 $L_0, \dots, L_n$ である。ある body が複数のレベルを所有することができ、interface は二つの body または同一 body の二つのレベルを結合することができる。

**定義 6 (general agent).** Legg と Hutter に従い、general agent とは、単一タスクではなく広範な環境クラスにわたって性能が測定されるエージェントである[37]。Morris らは AGI のレベルを性能と一般性の両面で操作化した[38]。本稿で関係する性質は body を横断した一般性であり、エージェントは理論家、製作者、利用者として、かつスタックのすべてのレベルにわたって行動しなければならない。

<div id="52-propositions" class="anchor-alias" aria-hidden="true"></div>

### 5.2 命題

**命題 1（失敗は未検査のインターフェースから生じる）。** 各部品がその自身のモデルに対して正しい場合、合成システムのすべての失敗は少なくとも一つのインターフェース仮定に違反し、すべての仮定が検査されていれば、最初に違反した仮定はその発生したインターフェースで拒否される。

*証明概略。* 各部品が入力に対して正しく、かつすべての入力が部品が依拠する仮定を満たすならば、スタック上の帰納法により合成は正しい。したがって失敗は、ある仮定が失敗する交差点を必要とする。その仮定が検査されていれば、交差点はそこで拒否されるので、失敗はそのインターフェースに位置し、伝播しない。 ∎

**命題 2（未検査の不一致は伝播する）。** $L_k$ と $L_{k+1}$ の間のインターフェースにおける仮定が未検査である場合、そのインターフェースでの違反は $k$ 以上のすべてのレベルで誤った値を生成し、$k$ 以上のレベルでそのレベル固有の用語だけで表現されたチェックではそれを特定できない。

*概略。* $k$ 以上のレベルは $L_{k+1}$ の出力のみを見るが、これは $L_{k+1}$ の自身のモデルに対して整形式である。Mars Climate Orbiter がその例である：ナビゲーション解は内部的に一貫していたが誤っていた [12]。

**命題 3（安定化された構成）。** すべてのインターフェース仮定が明示的かつ検査されているスタックにおいて、$k$ のレベルで行われ、自己境界のチェックを通過した修正は、他の境界のチェックによって確立されたすべての性質を保持し、$k$ 以上のすべてのレベルは修正を変更なしに継承する。

*概略。* 他の境界のチェックは、これらの境界を越える値に対して述語を評価する。修正された $L_k$ は $L_k$ の境界を越える値のみを変更し、上位境界のチェックされた仮定を満たす出力を生成する。$k$ 以上の各レベルは、チェックされたインターフェースを通じてのみ $L_k$ を消費するので、修正された $L_k$ がそのインターフェースを満たせば、コンシューマは正しい入力を受け取る。 ∎

**命題 4（AGI の追求は明示性を強いる）。** 定義 6 の意味での一般エージェントが、スタックのすべての三つの部品とすべてのレベルにわたるタスクに対して正確性ゲートを通過することを要求されるとする。このとき、インターフェースがタスク分布を横切るすべての場合において、エージェントはインターフェース仮定を明示し検査するか、あるいはその仮定に関する未検査の推測に成功が依存するタスクが存在する。

*議論。* 狭義のシステムは単一の環境の慣習：固定単位系、固定命令セット、固定バージョン：に依存できる。一般エージェントは、汎用性の構成上、これらの慣習が異なる環境に直面する。ある環境で成立し別の環境で失敗する仮定は、取り扱うために検出されなければならず、検出することは検査することに等しい。正確性ゲートは、実行が合格または不合格のいずれかであり、部分点は与えない。そのようなゲートの下で、偶然に誤っている推測は失敗したタスクとなり、部分点は得られない。したがって、ゲート下での汎用性の追求は、エージェントが触れるすべての境界において明示的かつ検査されたインターフェースへの圧力となる。命題は現在のシステムがこの基準を満たすと述べているわけではなく、目標が要求することを示している。

**命題 5 (ジュールが安定構成を順位付けする).** ゲートを通過するスタックのうち、各インタフェースを最小エネルギーで完了させるものが好まれ、インタフェースで一度だけ実行される明示的なチェックは、上位レベルで毎回再発見される失敗よりも負荷が軽い。

*概略.* 順序はゲートその後順位付けである: 正確性はすべての候補が満たすべき制約であり、完了までのエネルギー（ジュール）はそれを満たす候補のみを順序付ける。これは、目的関数が実行可能集合上でのみ比較される制約付き最適化に相当する。境界でのチェックは、横断ごとに固定コストがかかる。検査されていない不一致は到達するすべてのレベルでコストが発生し、そのコストは不一致が検出されるまで各実行で繰り返される。

<div id="6-the-stabilized-configuration" class="anchor-alias" aria-hidden="true"></div>

## 6. 安定化された配置

![Diagram of the same three bodies, now arranged at the corners of an equilateral triangle inside a rotating frame, in the manner of the Lagrange configuration. Each interface band is solid and carries a check mark and a short label: the specification written once, the gate at entry, and the trace and receipt that return to the theorist. At the centre sits a shared frame labeled one specification, one gate, joules as the ranking.](/figures/three-body/stabilized.svg)

*図 2. 安定化された構成。図。物理学では、三つの物体が回転フレーム内で相対位置を保つ。計算科学では、共有フレームが明示的で機械検査可能な意図の記述となり、すべてのインタフェース仮定が検証されるため、三つの物体はシステムが変化しても関係を保つ。[PNG コピー](/figures/three-body/stabilized.png) が提供されている。*

<div id="61-the-shared-frame" class="anchor-alias" aria-hidden="true"></div>

### 6.1 共有フレーム

ラグランジュの配置は、物体と共に移動する座標系内でのみ安定である。計算上の対応物は、3 つの物体すべてが読み書きする共有表現であり、そこではすべてのインターフェース仮定が検査可能な文となる：形式的仕様、機械検査された契約、あるいは型である。理論家の主張、製作者の実装、利用者の観測された振る舞いが、いずれかの表現に対する検査によって関連付けられるとき、これらの間のハンドオフは翻訳ではなく検査である。

<div id="62-every-interface-assumption-explicit" class="anchor-alias" aria-hidden="true"></div>

### 6.2 すべてのインターフェース仮定の明示

![Diagram of a stack with six levels from intent at the top through specification, gate, projections and runtime to hardware and energy. Between each pair of adjacent levels sits an interface drawn as a small gate with its assumption and its check written beside it. A correction made at the runtime level is drawn with arrows rising through each checked interface to the levels above.](/figures/three-body/stack-checks.svg)

*Figure 3. The stack with every interface checked. Diagram. A [PNG copy](/figures/three-body/stack-checks.png) is provided.*

この手法は三つのステップからなる。スタックのすべての境界を列挙せよ。各境界について、受信側が依拠する仮定を述語として記述し、その仮定を各通過時に評価するメカニズムに名前を付けよ。チェックが失敗した場合、その破綻は該当境界に位置し、修正はそのレベルで行われ、該当境界のチェックを通過して上位レベルへ継承される。

<div id="63-evidence-from-verified-systems" class="anchor-alias" aria-hidden="true"></div>

### 6.3 検証済みシステムからの証拠

安定化された構成が命題3の意味で存在することは、独立したグループによって構築・テストされたシステムにより裏付けられている。

- **ランダムテストによる検証済みコンパイラ。** CompCert は C コンパイラであり、その最適化中間部とバックエンドは、生成されたコードがソースの意味論を保持することを機械検証された証明で裏付けている[39]。 Yang、Chen、Eide、Regehr は Csmith というランダムプログラム生成器を CompCert および他の多くのコンパイラに対して実行した。 彼らは他のコンパイラにおいて数百件の未知のバグを報告した。 CompCert では検証済み中間部において誤コードエラーは見つからなかった。 発見された欠陥は、証明の外部にあるフロントエンドやターゲットに関する未検証の仮定など、証明外の部分に位置していた[40]。 仮定がチェックされないまま残された箇所で失敗が現れ、これは命題1および命題2が予測するところであり、チェックされた境界を越えては現れなかった。
- **検証済みカーネル境界。** seL4 の証明はその C 実装を抽象仕様に結び付けており、仕様とコードの間に何も仮定しない[36]。 証明はコンパイラ、アセンブリコード、ハードウェアに関する明示的仮定に対して相対的に述べられており、これは第6.2節の手法が実際に適用された例である：残存する仮定は残りのインタフェースとして記述される。
- **産業実務における仕様。** Newcombe らは Amazon Web Services のエンジニアがコア分散システムのために TLA+ 仕様を書き、モデルチェックが長いイベントシーケンスを必要とする微妙な設計バグを発見したことを報告している[41]。 これらのバグはレビューやテストでは見逃されていた。
- **単位をチェックされたインタフェースとする。** Kennedy の次元型は量の単位を型の一部とし、したがってポンド‑フォース‑秒の値は明示的変換なしにニュートン‑秒の値が期待される場所に渡すことができない[42]。 火星気候オービタの喪失[12]の背後にあるインタフェース仮定は、コンパイル時に拒否されることになる。

この証拠は、チェックを前提に構築された単一システムから得られたものである。 安定化された構成が存在し、維持可能であることを示しているが、構成が複数組織にまたがるスタックに拡張できることは示していない。 第8節のプロトコルはそれをテストするために記述されている。

<div id="7-the-hardware-side" class="anchor-alias" aria-hidden="true"></div>

## 7. ハードウェア側

ハードウェア境界は、インタフェースの仮定が物理的になる場所であり、供給電圧、熱的エンベロープ、メモリモデル、命令契約が含まれる。第3.2節では、命令契約をメーカーのインタフェースの例として示し、時間とともに改訂されることを述べた[17, 18]。ハードウェアを固定とみなすスタックは、最下位レベルで未検証のインタフェースを持ち、命題2はそこに不一致があると上位すべてのレベルに影響を及ぼすと述べている。

本稿では、ハードウェア側を明示すべきインタフェースの集合とし、ハードウェアの結果はソフトウェアと同じゲートおよび同じエネルギー順位で扱われる。

<div id="8-protocols" class="anchor-alias" aria-hidden="true"></div>

## 8. プロトコル

各プロトコルは実行前に固定される。エネルギー数値は三つのラベルのいずれかを持つ：`est_j` は解析的推定を、`reported_j` はオペレーティングシステムまたはオンチップカウンタからの読み取りを、`measured_j` は外部電力計からの読み取りを表す。

<div id="81-interface-inventory" class="anchor-alias" aria-hidden="true"></div>

### 8.1 インターフェース目録

対象システムについて、構体間および階層間のすべてのインタフェースを列挙せよ。各インタフェースについて、仮定を述語として記録し、その所有者と機構がチェックするかどうかを示す。チェックされている仮定の割合と、所有者が存在しない仮定の割合を報告せよ。二人の独立した監査者が同一システムをインベントリし、その一致度を報告せよ。

<div id="82-break-and-catch" class="anchor-alias" aria-hidden="true"></div>

### 8.2 破壊と捕捉

各記録された仮定について、固定されたシード集合上でそのインタフェースに違反を注入する。その違反がそのインタフェースで拒否されるか、後続のレベルで検出されるか、検出されないかを記録する。命題 1 は、チェックされた仮定はそれ自身のインタフェースで拒否されることを予測する。命題 2 は、検査されていない仮定は、検出される場合はすべて後で検出され、位置が特定されないことを予測する。

<div id="83-compounding" class="anchor-alias" aria-hidden="true"></div>

### 8.3 複合化

固定されたワークロードを $R$ ラウンド実行し、選択されたレベルで 1 つの補正を適用した場合としない場合とを比較する。各ラウンドのエスカレーション数、失敗数、エネルギー消費を記録する。命題 3 は、補正を伴う累積エスカレーションがいかなるラウンドにおいても高くならず、補正前に検証された性質が補正後に失敗しないことを予測している。

<div id="84-cross-body-handoff" class="anchor-alias" aria-hidden="true"></div>

### 8.4 身体間の引き渡し

実際の組織間ハンドオフを選択せよ：実装者に渡す仕様、下流ユーザーに渡すライブラリ、またはソフトウェアに渡すハードウェアリビジョンである。ハンドオフを明示的な仮定を含む共有表現として表現し、ブレーク・アンド・キャッチプロトコルをそれに対して実行し、同じハンドオフを散文ドキュメントで行った場合と比較せよ。各側面でインタフェースに位置する失敗を報告し、Wilson 95% 区間を示す。

<div id="85-generality-under-the-gate" class="anchor-alias" aria-hidden="true"></div>

### 8.5 ゲート下の一般性

インタフェースにおける規約（単位、命令契約、ライブラリバージョン、エンコーディング）を変化させたタスク集合を構築する。正確性ゲートの下でエージェントを評価する。命題4は、変化した集合全体での成功には規約の検出が必要であると予測しており、したがってインタフェース仮定を明示的にチェックするエージェントは、デフォルトを想定するエージェントよりも、デフォルトタスクでの成功率が同等である場合に、変化したタスクのより大きな割合を通過すべきである。合格したエージェントを、完了までに要したエネルギー（ジュール）でランク付けする。

<div id="9-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 9. 反証者

Fixed before the runs they test.

| ID | Observation | Defeats |
|---|---|---|
| TBP-F1 | break and catch プロトコルにおいて、検査された仮定の違反がそのインタフェース上で受容される | テスト対象システムに対して述べられた命題 1 |
| TBP-F2 | compounding プロトコルにおいて、自己の境界チェックを通過した修正が、別の境界で以前は合格していたチェックを失敗させる | 命題 3 |
| TBP-F3 | cross-body プロトコルにおいて、共有表現は区間内で文書記述と同程度のインタフェース失敗しか特定しない | 明示的に検査されたインタフェースが主体間のハンドオフを安定化させるという主張 |
| TBP-F4 | generality プロトコルにおいて、デフォルトを仮定するエージェントは、チェックを行うエージェントと同等のデフォルト性能で、様々なタスクを同等以上の成功率で通過する | 命題 4 |
| TBP-F5 | 稼働中システムのインタフェースインベントリは、原因をいかなるインタフェース仮定にも帰属できない失敗を検出し、各主体は自身のモデルに対して正しい | インタフェースによる不安定性の説明 |

<div id="10-limits-of-the-argument" class="anchor-alias" aria-hidden="true"></div>
<div id="10-scope-and-method" class="anchor-alias" aria-hidden="true"></div>

## 10. 範囲と方法

物理は構造として介入する。 それは対象、関係、安定構成の語彙を提供し、すべての命題は計算機自身の用語で述べられ、検証される。 感度に関する主張は、結果が検証されていない不一致にどのように依存するかに関する主張であり、Stone と Leigh [7] の方法に従って大規模 N で統計的に測定される。

明示性は宣言されるのではなく維持される。 仮定はシステムが新しい環境に適合すると表面化し、プログラムがサービスする世界は変化し続ける [35]。 したがって手法は、発見された各仮定を閉じるべき新たなインタフェースとして扱う：述語として記述し、チェックを与え、命題 3 の下でチェックされたままにする。 安定化された構成は、ラグランジュ点付近の宇宙船が軌道維持を継続することで保持されるのと同様に保持される。

分析単位は役割間のハンドオフである。 1 人が午後に理論家、製作者、利用者を兼ねることができるため、手法はハンドオフが発生する場所、すなわちチーム内部でも組織間でも適用できる。 形式手法からテスト付き大規模モデル、レビュー付き手書きコードに至るまで、システム構築へのすべてのアプローチは同一の尺度で位置付けられる：インタフェース仮定のうち明示的かつチェックされたものの割合であり、セクション 8.1 のインベントリプロトコルから読み取られる。

<div id="11-conclusion" class="anchor-alias" aria-hidden="true"></div>

## 11. 結論

三体問題は、単純な部品間の関係から不安定性が生じ得ること、そして安定性が存在する場合は、共有フレーム内でそれらの関係が特別に配置されていることを物理学に教えている。計算機科学にも理論家、製作者、利用者という三つの主体があり、その不安定性はこれらの間のインターフェースから生じ、仮定が暗黙のうちに、検証されずに交差するところにある。汎用知能を目指すシステムは、三つの主体すべてとスタックのすべての層にまたがって動作しなければならず、したがってその仮定を暗黙のままにしておくことはできない。その目的を真剣に追求することは、すべてのインターフェース仮定を書き留め、すべての交差点で検証することを意味する。そのように構築されたスタックでは、修正は行われた場所に留まり上方へ伝播し、システムは変化しながら形状を保つ。これが、AGI の追求が計算機における三体問題を解決する方法である。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

[1] Liu Cixin, *The Three-Body Problem*, translated by Ken Liu. Tor Books, 2014. Original Chinese edition 三体, Chongqing Publishing House, 2008. ISBN 978-0-7653-7706-7.

[2] H. Poincaré, "Sur le problème des trois corps et les équations de la dynamique," *Acta Mathematica* 13, 1890, pp. 1 to 270. Introduction: doi:10.1007/BF02392506

[3] J. Barrow-Green, *Poincaré and the Three Body Problem*. History of Mathematics 11, American Mathematical Society, 1997. doi:10.1090/hmath/011

[4] K. F. Sundman, "Mémoire sur le problème des trois corps," *Acta Mathematica* 36, 1913, pp. 105 to 179. doi:10.1007/BF02422379

[5] Q. Wang, "The global solution of the N-body problem," *Celestial Mechanics and Dynamical Astronomy* 50, 1991, pp. 73 to 88. doi:10.1007/BF00048987

[6] E. N. Lorenz, "Deterministic Nonperiodic Flow," *Journal of the Atmospheric Sciences* 20(2), 1963, pp. 130 to 141. doi:10.1175/1520-0469(1963)020<0130:DNF>2.0.CO;2

[7] N. C. Stone and N. W. C. Leigh, "A statistical solution to the chaotic, non-hierarchical three-body problem," *Nature* 576, 2019, pp. 406 to 410. doi:10.1038/s41586-019-1833-8

[8] E. J. Routh, "On Laplace's Three Particles, with a Supplement on the Stability of Steady Motion," *Proceedings of the London Mathematical Society* s1-6, 1874, pp. 86 to 97. doi:10.1112/plms/s1-6.1.86

[9] C. Moore, "Braids in classical dynamics," *Physical Review Letters* 70, 1993, pp. 3675 to 3679. doi:10.1103/PhysRevLett.70.3675

[10] A. Chenciner and R. Montgomery, "A Remarkable Periodic Solution of the Three-Body Problem in the Case of Equal Masses," *Annals of Mathematics* 152(3), 2000, pp. 881 to 901. doi:10.2307/2661357

[11] M. Šuvakov and V. Dmitrašinović, "Three Classes of Newtonian Three-Body Planar Periodic Orbits," *Physical Review Letters* 110, 114301, 2013. doi:10.1103/PhysRevLett.110.114301

[12] Mars Climate Orbiter Mishap Investigation Board, *Phase I Report*. NASA, 10 November 1999. https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf

[13] H. Wright, "Hyrum's Law." https://www.hyrumslaw.com/

[14] J. Spolsky, "The Law of Leaky Abstractions," *Joel on Software*, 11 November 2002. https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/

[15] J. L. Lions (chair), *Ariane 5 Flight 501 Failure: Report by the Inquiry Board*. European Space Agency, 19 July 1996. https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf

[16] G. Le Lann, "An analysis of the Ariane 5 flight 501 failure: a system engineering perspective," *Proceedings of the IEEE International Conference on the Engineering of Computer-Based Systems*, 1997, pp. 339 to 346. doi:10.1109/ECBS.1997.581900

[17] RISC-V International, *The RISC-V Instruction Set Manual, Volume I: Unprivileged Architecture*, version 20250508, preface. https://docs.riscv.org/reference/isa/v20250508/unpriv/colophon.html

[18] Apple, "Using Intel-based apps on a Mac with Apple silicon," Apple Support, article 102527, published 21 September 2026. https://support.apple.com/en-us/102527

[19] P. Zave and M. Jackson, "Four Dark Corners of Requirements Engineering," *ACM Transactions on Software Engineering and Methodology* 6(1), 1997, pp. 1 to 30. doi:10.1145/237432.237434

[20] S. Hooker, "The Hardware Lottery," *Communications of the ACM* 64(12), 2021, pp. 58 to 65. doi:10.1145/3467017

[21] D. Sculley, G. Holt, D. Golovin, E. Davydov, T. Phillips, D. Ebner, V. Chaudhary, M. Young, J.-F. Crespo and D. Dennison, "Hidden Technical Debt in Machine Learning Systems," *Advances in Neural Information Processing Systems* 28, 2015. https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html

[22] M. E. Conway, "How Do Committees Invent?" *Datamation* 14(4), April 1968, pp. 28 to 31. https://www.melconway.com/Home/Committees_Paper.html

[23] A. MacCormack, C. Baldwin and J. Rusnak, "Exploring the duality between product and organizational architectures: A test of the 'mirroring' hypothesis," *Research Policy* 41(8), 2012, pp. 1309 to 1324. doi:10.1016/j.respol.2012.04.011

[24] D. L. Parnas, "On the criteria to be used in decomposing systems into modules," *Communications of the ACM* 15(12), 1972, pp. 1053 to 1058. doi:10.1145/361598.361623

[25] C. Y. Baldwin and K. B. Clark, *Design Rules, Volume 1: The Power of Modularity*. MIT Press, 2000. doi:10.7551/mitpress/2366.001.0001

[26] R. M. Henderson and K. B. Clark, "Architectural Innovation: The Reconfiguration of Existing Product Technologies and the Failure of Established Firms," *Administrative Science Quarterly* 35(1), 1990, pp. 9 to 30. doi:10.2307/2393549

[27] J. H. Saltzer, D. P. Reed and D. D. Clark, "End-to-end arguments in system design," *ACM Transactions on Computer Systems* 2(4), 1984, pp. 277 to 288. doi:10.1145/357401.357402

[28] C. A. R. Hoare, "An axiomatic basis for computer programming," *Communications of the ACM* 12(10), 1969, pp. 576 to 580. doi:10.1145/363235.363259

[29] B. Meyer, "Applying 'design by contract'," *Computer* 25(10), 1992, pp. 40 to 51. doi:10.1109/2.161279

[30] B. H. Liskov and J. M. Wing, "A behavioral notion of subtyping," *ACM Transactions on Programming Languages and Systems* 16(6), 1994, pp. 1811 to 1841. doi:10.1145/197320.197383

[31] D. Garlan, R. Allen and J. Ockerbloom, "Architectural mismatch: why reuse is so hard," *IEEE Software* 12(6), 1995, pp. 17 to 26. doi:10.1109/52.469757

[32] D. Garlan, R. Allen and J. Ockerbloom, "Architectural Mismatch: Why Reuse Is Still So Hard," *IEEE Software* 26(4), 2009, pp. 66 to 69. doi:10.1109/MS.2009.86

[33] N. G. Leveson, *Engineering a Safer World: Systems Thinking Applied to Safety*. MIT Press, 2012. doi:10.7551/mitpress/8179.001.0001

[34] R. I. Cook, "How Complex Systems Fail," Cognitive Technologies Laboratory, University of Chicago, 1998. https://how.complexsystems.fail/

[35] M. M. Lehman, "Programs, life cycles, and laws of software evolution," *Proceedings of the IEEE* 68(9), 1980, pp. 1060 to 1076. doi:10.1109/PROC.1980.11805

[36] G. Klein, K. Elphinstone, G. Heiser, J. Andronick, D. Cock, P. Derrin, D. Elkaduwe, K. Engelhardt, R. Kolanski, M. Norrish, T. Sewell, H. Tuch and S. Winwood, "seL4: Formal Verification of an OS Kernel," *Proceedings of the 22nd ACM Symposium on Operating Systems Principles*, 2009, pp. 207 to 220. doi:10.1145/1629575.1629596

[37] S. Legg and M. Hutter, "Universal Intelligence: A Definition of Machine Intelligence," *Minds and Machines* 17(4), 2007, pp. 391 to 444. doi:10.1007/s11023-007-9079-x

[38] M. R. Morris, J. Sohl-Dickstein, N. Fiedel, T. Warkentin, A. Dafoe, A. Faust, C. Farabet and S. Legg, "Levels of AGI for Operationalizing Progress on the Path to AGI," *Proceedings of the 41st International Conference on Machine Learning*, 2024. arXiv:2311.02462

[39] X. Leroy, "Formal verification of a realistic compiler," *Communications of the ACM* 52(7), 2009, pp. 107 to 115. doi:10.1145/1538788.1538814

[40] X. Yang, Y. Chen, E. Eide and J. Regehr, "Finding and understanding bugs in C compilers," *Proceedings of the 32nd ACM SIGPLAN Conference on Programming Language Design and Implementation*, 2011, pp. 283 to 294. doi:10.1145/1993498.1993532

[41] C. Newcombe, T. Rath, F. Zhang, B. Munteanu, M. Brooker and M. Deardeuff, "How Amazon Web Services uses formal methods," *Communications of the ACM* 58(4), 2015, pp. 66 to 73. doi:10.1145/2699417

[42] A. Kennedy, "Types for Units-of-Measure: Theory and Practice," in *Central European Functional Programming School*, Lecture Notes in Computer Science 6299, Springer, 2010, pp. 268 to 305. doi:10.1007/978-3-642-17685-2_8
