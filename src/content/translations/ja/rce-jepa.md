---
title: "RCE-JEPA: 世界コーディング、JEPAを前提として"
deck: "RCE-JEPA（RCE は Reality Code Engine、JEPA は Joint Embedding Predictive Architecture の略）は、名称を保持することで本研究が検索可能であることを確保する。対象は World Coding である。JEPA が前提であり、学習されたモデルは次のテキストの word-piece を生成するのではなく、プログラムのコンパクトな要約を予測する。World of Code とは、標準的なプログラム Form と正確な遷移・受理規則（Coding の法則）からなる空間である。proposer スロットは任意の学習モデルであり、checker が判定を行う。仮説 H1-H15 が論文で示されている。測定結果は以下の通りである。    - H1：185 個の手書きプログラムに対し、中央値の記述長比率が 9.34。   - H2：checker-to-model エネルギー比率が 0.000582、または Apple M5 Max 上の on-chip `reported_j` において 1,718 倍低コスト。   - H5 および H11：FormEBM-v2（5.85M パラメータ）による未見の非重複 Form 形状に対し、受信者操作特性曲線下面積（AUROC）0.8922 ≥ 0.85、top-1 正解率 84.05%、checker 呼び出し回数 2.39 倍削減、厳密な 5-step 累積欠陥単調性 93.0% ≥ 80%（Spearman 0.9931）と、候補 core `reported_j` あたり 47.09 mJ を達成。   - span-正規化分解 FormEBM-v3（6.05M パラメータ）において、未見形状 H5 の AUROC が 0.9437 ≥ 0.85、defect-head 正解率 83.44%、複合 top-1 正解率 80.98%、H11 の strict 5-step 単調性が E_depth で 94.0%（Spearman 0.9966）、E_total で 92.0%（Spearman 0.9846）を示す。また、zero-shot out-of-distribution H15 のマルチ-proposer 統合 AUROC を 0.2585 から 0.5278 に、large-span 有効候補に対して 0.6018 に向上させ、候補 core `reported_j` あたり 232.45 mJ を消費した。   - H7：1,275 個のミュータントに対し不変式違反 0 件。   - H8：6 つのターゲットで 10,500 ストリーム全てにおいてリプレイ不一致 0 件。   - H14：deterministic ladder が 151 タスク中 111 件（73.5%）をモデル呼び出しなしで解決し、残り 40 タスクを残した。   - H15：残り 40 タスクに対する single-shot および bounded checker-feedback H15-Iterative（8.42M FormJEPA-v1）では、k=1 で 22/40、k=16 で 27/40 の成功を示し、Claude Opus 5.5 と Claude Sonnet 5.5 では矛盾なしで 40/40 を閉鎖、xAI Grok 4.20 Reasoning では 39/40、Gear-0 のリプレイは呼び出し 0 回、lookup あたり 0.325 µs で 40/40 を達成した。また、Zipf(0.85) 3-Gear ストリーム入場 200/200 において、フロンティアエピソードを 16.67 倍削減した。   - 151 タスクの rce repair rung f プロモーション監査では、3/119 = 2.5% > 2.0% で矛盾 0 件、rung f を observe モードで維持した。    完全な intent-to-Form 合成（H3）、モジュール間シグネチャ・トレースの out-of-distribution エネルギー較正（0.5278 超）および外部 wall-meter エネルギー（`measured_j`）については未解決のままである。"
lang: "ja"
source: "rce-jepa"
complete: true
---

<div id="rce-jepa-world-coding-with-jepa-as-premise" class="anchor-alias" aria-hidden="true"></div>

**状況。** 本論文は、一つのテーゼ、15の仮説(H1からH15)、6つの反証条件、および研究計画を提示する。これらは [/living/rce-jepa/](/living/rce-jepa/) にある対話型計測器とともに示される。現時点での測定結果は、Phase 0の決定論的下限値、すなわちFormコーパスおよびH1、H7の敵対的ファジング腕、H8の6ターゲットにおける決定論的ストリーム、H14の決定論的修復ラダーを対象とする。さらに、ローカルのApple M5 Maxにおける検査器対モデルの`reported_j`比 **H2** (`C_check / E_model = 0.000582 <= 0.05`、`1,718`倍安価)、40の未解決残余タスクを対象とした単発および有界な検査器フィードバックによる **H15** が含まれる。単発では`17/40`から`34/40`である。`H15-Iterative`において、`Claude Opus 5.5`および`Claude Sonnet 5.5`では、有界な`<= 5`ターンの検査器フィードバックと公開された標準ライブラリのシグネチャヘッダを与えた条件で`40/40` (`100.0%`)、矛盾は`0`である。`xAI Grok 4.20 Reasoning`では`39/40`である。メモリマップ化されたGear-0からのゼロ呼び出し再生では、`0.325 µs`/`1.77 µJ`で`40/40`を達成した。加えて、目的特化の潜在Form JEPA修復提案器 **`FormJEPA-v1`** (Form S式の互いに素なデータ上で学習された`8.42M`の訓練可能パラメータ)がある。これは`k = 16`において、合成欠陥`200`件中`177/200`および残余タスク`40`件中`27/40`を受理し、再帰的な`Zipf(0.85)`のGear-2エピソードを`200`から`12`へ削減した(`16.67×`)。`H15-Iterative`と併用した場合、ストリーム受理は`200/200`である。さらに、対照学習に基づく多段階マージンのエネルギーベースモデル(EBM)スコアラ **`FormEBM-v2`** (厳密に互いに素な`1,387`件のForm分割上で`5.85M`の訓練可能パラメータ)がある。これにより、未見形状における **H5** の受信者動作特性曲線下面積(AUROC)は`0.618`から **`0.8922 >= 0.85`** へ向上し、解決可能な上位1候補の正解率は`84.05%`、検査器呼び出しは`2.39×`削減された。また、未見連鎖における **H11** の厳密な5段階編集単調性は`36.0%`から **`93.0% >= 80%`** へ向上し、Spearman相関は`0.9931`、候補あたりのコア`reported_j`は`47.09 mJ`である。同一分割上で`6.05M`の訓練可能パラメータを持つ、スパン正規化された二頭分解型スコアラ **`FormEBM-v3`** も提示される。これにより、未見形状の **H5** AUROCは **`0.9437 >= 0.85`** に向上し、欠陥頭部の解決可能上位1候補正解率は`83.44%`、複合の正解率は`80.98%`となった。未見連鎖の **H11** では、`E_depth`における厳密な5段階単調性が **`94.0%`** (Spearman `0.9966`)、`E_total`において **`92.0%`** (Spearman `0.9846`)に向上した。さらに、ゼロショットの分布外(OOD)**H15** において、Wave-4のタスク横断的な編集スパン逆転を解消した。具体的には、複数提案器のプールされたAUROCを`0.2585`から`0.5278`へ、大規模スパンの有効対無効のAUROCを`0.6018`へ向上させ、候補あたりのコア`reported_j`は`232.45 mJ`である。最後に、事前登録された151タスクの **`rce repair` のrung `f`** 昇格監査がある。確率的な割合は`3/119 = 2.5% > 2.0%`、`W-MUT-1`の合格は`3/3`、矛盾は`0`であり、rung `f`が依然として`observe`モードにあることを確認した。率直な開示として、以下は未解決のままである。意図からFormへの完全な合成(H3)、エンドツーエンドのジュール同等性(H4)、複数モジュールのgit履歴書き換えにおける、シグネチャおよびトレースに関するOOD向けエネルギー較正の`0.5278`を超える水準、参照アプリケーションのエンコーディング(H6)、コスト表の予測(H9)、商データの節約(H10)、決定ヘッドの較正(H12)、離散対連続の長期計画(H13)、拡散およびエボリューション的なH15の腕、そして外部の壁電力計による`measured_j`である。JEPAは前提である。すなわち、表層テキストではなく、意味の要約を予測する。主題は World Coding であり、Form上で動作する任意の学習型提案器を対象とし、受理規則はCoding の法則である。意思決定を担う部分(コミットゲート、厳密な再生、射影、整数コスト単位)は [RCE論文](/papers/rce/) で記述されている。本論文は提案器、すなわちエンジンがすべてのターゲットを描画する一方で、Form上の探索を導く学習モデルを扱う。ループ内のいかなるモデル(ホスト型かローカル型かを問わず)も提案のみを行い、セキュリティはそれに依存しない。

平易に言えば

![提示された意図を任意の学習型提案器へ入力する処理の図。JEPAを具体例として示す。デコーダが固定形式の候補プログラムを生成し、エネルギースコア(低いほど適合度が高い)で順位付けする。決定論的チェッカーが各候補を受理するか、変更が必要であることを示して破られた規則を返し、その規則に基づいて再順位付けが行われる。点線枠内はすべて学習済みかつ信頼されない処理であり、受理されたプログラムのみがエンジンに到達する。ローカルのApple M5 Maxのカウンタは厳密に`reported_j`(`measured_j = None`、`board_metered = false`)として記録し、遠隔のクラウドサーバのエネルギーは`not_available`として記録する。](/figures/rce-jepa/pipeline.svg)

*図1. 提案されたパイプライン。任意の学習型提案器が、提示された意図を候補プログラムへと写像する。図に描かれているのは、潜在空間上で予測を行うJEPAという提案器の一例である。デコーダはその提案を固定形式の候補プログラムへと変換し、エネルギースコア(低いほど適合度が高いことを意味する)により順位付けする。決定論的チェッカーは各候補を受理するか、変更が必要であると判定し、再順位付けのために破られた規則を返す。点線枠内のすべては学習済みかつ信頼されない要素であり、受理されたプログラムのみがエンジンに到達する。ローカルのApple M5 Maxのカウンタは厳密に`reported_j`(`measured_j = None`、`board_metered = false`)として記録し、遠隔のクラウドサーバのエネルギーは`not_available`として記録する。*

1. 主題は世界コーディング（World Coding）である。World of Code とは、プログラムの Form の空間に、次状態および受理可否に関する厳密な規則（コーディングの法則、Laws of Coding）を加えたものである。JEPA は前提であり、方法の全体ではない。すなわち、コードの次の語を予測する代わりに、意味の要約を予測する。ここでいう AI（人工知能）は、単一のアーキテクチャではなく、学習された任意の提案器（learned proposer）を指す。

2. モデルが提案し、検査器が判定する。トレースで訓練されたデコーダ、拡散モデル、証明検査器内の強化学習、進化的探索、ライブラリ学習、制約付きデコーディングは、いずれもこの枠に位置づけうる。提案器が変わってもゲートは変わらない。安全性は、提案器が正しいことに依存しない。

3. 実測の下限値と残余ベンチマークは、厳密にラベルを付けて区別する。手書きプログラム185本に対する記述長比の中央値は9.34である（H1）。Apple M5 Max 上のコミット `1762fb4b` において、Form の検査は1回あたり `49.04 mJ` を要し、ローカルの35Bパラメータ候補生成1回あたりの `84.25 J` と比べて `1,718×` 安価である（H2を支持）。ファジングによる検査では、受理された変異体1,275件に不変条件違反は0件であった（H7）。6つの対象にわたる10,500本のストリームで再生は一致した（H8）。さらに、決定論的なラダーにより、151タスク中111件（73.5%）をモデル呼び出しなしで解決した。残りの40件は実履歴タスクとして残る（H14）。

この残余40タスク（H15）において、単発提案器の受理数は `17/40` から `34/40` にとどまる。一方、元の Form へのアクセスを一切持たず、公開標準ライブラリのヘッダを含む有界な検査器フィードバック（`H15-Iterative`）を用いると、`Claude Opus 5.5` と `Claude Sonnet 5.5` では **`40/40`（`100.0%`）** が閉じ、矛盾は0件である（`xAI Grok 4.20 Reasoning` では `39/40`）。さらに **`40/40` を Gear 0（`DNULLMM1`）に結晶化** し、呼び出しゼロでの再生を可能とする。用途特化で訓練された `FormJEPA-v1`（8.42M パラメータ）は、`k = 16` において `27/40` を受理する。対照学習で訓練された `FormEBM-v2`（5.85M パラメータ：AUROC `0.8922`、単調性 `93.0%`）と、スパン正規化を施した `FormEBM-v3`（6.05M パラメータ：H5における未見形状のAUROC `0.9437`、H11における `E_depth` の単調性 `94.0%` および `E_total` の単調性 `92.0%`、H15におけるゼロショットのプール済みAUROCは `0.2585` から `0.5278` に向上）は、いずれも検査器を呼び出すことなく Form 候補を順位付けする。さらに **3-Gear Cascade** は、反復的に到着する `Zipf(0.85)` の200件を `200/200` で受理し、フロンティアのエピソード数は `16.67×` 少ない（`12` 対 `200`）。`rce repair` の段 `f` は `observe` モードにとどまる（`3/119 = 2.5% > 2.0%`、矛盾0件）。また、外部の電力計による実測値（`measured_j`）は主張しない。

<div id="principles" class="anchor-alias" aria-hidden="true"></div>

## 原則

- モデルは提案のみを行う。
- チェッカーが決定する。
- セキュリティは決してモデルに依存しない。
- Reality Code Engine のツールチェーンループ内でモデルは実行されない。
- 受理されたすべてのプログラム形態はビット単位で再現可能である。
- ホスト型であれローカル型であれ、あらゆる決定モデルはゲート外の提案者に過ぎない。
- まず決定論的であること。自動化の第一の規則は、機能する手動プロセスを持つことである。正確かつ決定論的な提案者の階層があらゆるモデルの前に実行され、モデルはその階層が開放した部分に対してのみ作用する（以下の提案者セクションに記載）。

<div id="terms-heading" class="anchor-alias" aria-hidden="true"></div>

## このページで使用される用語と略語

ここに列挙するのは、それぞれが使用される前に定義されているためである。参考文献の項目内（会場、報告書シリーズなど）にのみ出現する略語は記載しない。

<ul id="terms">
<li>AGX: NVIDIAのJetson AGXシリーズの組み込みコンピュータ</li>
<li>AILANG: AIが生成したコード用のプログラミング言語（プロジェクト名）</li>
<li>AIME: American Invitational Mathematics Examination</li>
<li>AI: 人工知能</li>
<li>AIXI: Hutterの理論的モデルで、普遍的に知的なエージェントを表す</li>
<li>AMD: Advanced Micro Devices</li>
<li>ANDF: Architecture Neutral Distribution Format</li>
<li>API: アプリケーションプログラミングインタフェース</li>
<li>APU: CPUコアと統合GPUを1パッケージに統合したアクセラレート処理ユニット</li>
<li>ARC: Abstraction and Reasoning Corpus、Cholletの測度およびARC Prizeで使用されるタスク集合</li>
<li>AST: 抽象構文木</li>
<li>AUROC: 受信者操作特性曲線下面積</li>
<li>BLAKE3: 暗号学的ハッシュ関数</li>
<li>BLEU: bilingual evaluation understudy、テキスト重複スコア</li>
<li>CALM: consistency as logical monotonicity</li>
<li>CEGIS: 反例誘導型帰納合成</li>
<li>CPU: 中央処理装置</li>
<li>CUDA: NVIDIAのGPUプログラミングプラットフォーム</li>
<li>CWM: Code World Model、実行トレースの一部で学習されたオープンウェイトコードモデル</li>
<li>Dafny: 仕様と証明がコードと並んで記述できるプログラミング言語</li>
<li>DBOS: durable-execution system（プロジェクト名）</li>
<li>DIR: コマンドに与えられるディレクトリパス</li>
<li>DNULLMM1: オープンアドレス方式のバイナリメモリマップドハッシュテーブルストア形式（64バイトヘッダー＋48バイトスロット）</li>
<li>EB-JEPA: エネルギーベースのJEPAライブラリ（プロジェクト名）</li>
<li>EBM: エネルギーベースモデル</li>
<li>ECE: expected calibration error</li>
<li>e-graph: 等価グラフ、複数の等価プログラムを保持する構造</li>
<li>EMA: 指数移動平均</li>
<li>EWD: Edsger W. Dijkstra の番号付き原稿シリーズ</li>
<li>ESBMC: 効率的な SMT ベースの有界モデルチェッカー</li>
<li>FAIR: Meta の Fundamental AI Research グループ</li>
<li>FPR: 偽陽性率</li>
<li>GELU: Gaussian error linear unit 活性化関数</li>
<li>GPT: 生成的事前学習トランスフォーマー、OpenAI のモデルファミリー</li>
<li>GPU: グラフィックス処理装置</li>
<li>GRPO: DiffuCoder レポートで couped-GRPO と呼ばれる強化学習更新</li>
<li>GSM8K: LLM-JEPA が使用する小学校レベルの数学文章問題セット</li>
<li>HVM2: Higher Order Company のインタラクションコンビネータ計算モデル</li>
<li>IBM: International Business Machines</li>
<li>ICOT: 次世代コンピュータ技術研究所（日本）</li>
<li>IEEE: Institute of Electrical and Electronics Engineers</li>
<li>IQR: 四分位範囲</li>
<li>JACM: ACM（Association for Computing Machinery）ジャーナル</li>
<li>LCM: Large Concept Model、トークンではなく文埋め込み空間で予測を行うモデル</li>
<li>LHS: 例示的イベントトレースの左側</li>
<li>LLM: 大規模言語モデル</li>
<li>MBPP: type-constrained decoding レポートで名前が付けられた短い Python 問題セット</li>
<li>MDE: モデル駆動エンジニアリング</li>
<li>METR: 2025 年初頭の開発者生産性試験（Becker et al.）を報告したグループ</li>
<li>MLA: マルチヘッド潜在注意</li>
<li>MLIPS: 秒当たり百万論理推論</li>
<li>MLIR: マルチレベル中間表現</li>
<li>MLP: 多層パーセプトロン</li>
<li>MoE: エキスパートの混合</li>
<li>MPC: モデル予測制御、短いロールアウトを繰り返す計画手法</li>
<li>NAIL: 正規形プログラミング言語（プロジェクト名）</li>
<li>NVIDIA: GPU の製造メーカー</li>
<li>OMG: Object Management Group</li>
<li>OOD: 分布外</li>
<li>PAR: パターンベースの自動プログラム修復</li>
<li>PID: オペレーティングシステムにおけるプロセス識別子</li>
<li>POSIX: Portable Operating System Interface</li>
<li>PTX: NVIDIA の並列スレッド実行命令セット</li>
<li>RAND RM: RAND Corporation の研究メモランダム</li>
<li>RAPL: Intel のランニング平均電力制限エネルギーカウンタ</li>
<li>README: リポジトリのフロントページ文書ファイル</li>
<li>RF: RCE 仕様における外部提案ラング-f ルールのラベル</li>
<li>RFC: インターネット標準文書である request for comments</li>
<li>RISC-V: オープンな RISC アーキテクチャ</li>
<li>RJ-F: RCE-JEPA 前提の偽装器のラベル</li>
<li>RL: 強化学習</li>
<li>RMS: 二乗平均平方根</li>
<li>ROC: 受信者操作特性</li>
<li>ROCm: Radeon Open Compute プラットフォーム</li>
<li>SAT: ブール充足可能性問題</li>
<li>SATB: Satiation Benchmark のテレメトリとハーネス規律</li>
<li>SFT: 監督付きファインチューニング</li>
<li>SHA-256: 256 ビットダイジェストを持つ安全ハッシュアルゴリズム</li>
<li>SMC: System Management Controller</li>
<li>SoC: システムオンチップ</li>
<li>SONAR: 大規模概念モデルが使用する文埋め込み空間、200 言語をカバー</li>
<li>STAN-CS: Stanford computer science technical report series</li>
<li>STOP: 自己学習型オプティマイザ</li>
<li>SUT: テスト対象システム</li>
<li>SWE-bench: 実際のリポジトリ課題のベンチマーク。SWE-bench Verified は、いくつかのコードレポートが pass@1 指標を示すレビュー済みサブセットである</li>
<li>TOPLAS: ACM Transactions on Programming Languages and Systems（プログラミング言語とシステムに関する ACM 取引誌）</li>
<li>TPR: 真陽性率</li>
<li>UNCOL: 汎用コンピュータ指向言語</li>
<li>USD: 米ドル</li>
<li>VAX: Digital Equipment Corporation の仮想アドレス拡張コンピュータ</li>
<li>Verus: Rust のサブセット用検証器</li>
<li>VICReg: 分散-不変性-共分散正則化</li>
<li>XML: 拡張可能マークアップ言語</li>
</ul>

<div id="outline" class="anchor-alias" aria-hidden="true"></div>

## 本ページの構成

このページは上から下へ読むことを想定している。仮説と反証を一目で示した後、以下の順序で構成されている。

1. 既に存在するもの、そして本ページの対象であること（提案者セクション）
2. 論文の主張を五部に分けて提示する：第1部、有限情報系としての計算；第2部、形とテンプレートへの圧縮；第3部、運動学；第4部、物理が正確に既知である世界モデル；第5部、検証可能な予測としての帰結
3. コミットメントによる収束
4. 第1節　歴史：七十年にわたる「好きなことを言えばプログラムが得られる」運動
5. 第2節　なぜ以前の試みが停滞したのか
6. 第3節　コードの世界へ向かう三つの道筋：訓練、ハイブリッド、計算の再概念化
7. 第4節　なぜ今なのか
8. 第5節　JEPA を前提とし、そこが止まる地点
9. 第6節　提案者スロットはアーキテクチャに依存しない
10. 第7節　コードの世界
11. 第8節　具体的な実例：Reality Code Engine、仮説表と反証表を含む
12. 状態と参考文献

<div id="hypotheses-overview" class="anchor-alias" aria-hidden="true"></div>

## 仮説の概要

このページでは、H1 から H15 までの十五の仮説を、いずれも議論に入る前に完全に列挙する。各仮説は、指標と閾値を併せて [Section 8](#hypotheses) の表に示し、その後に反証 RJ-F1 から RJ-F6 が続く。

1. H1. 同一のプログラム群に対して、Form空間は源空間よりはるかに小さい。(手書きプログラム185件で支持。中央値 rho 9.34。)
2. H2. チェッカーは生成に比べて低コストである。(Apple M5 Max上の `reported_j` で支持。`C_check / E_model = 0.000582 <= 0.05` であり、`1,718×` 安価。)
3. H3. 表現空間における予測は、有用な受理率に到達する。
4. H4. 受理されたプログラム1件あたりのエネルギーは低下する。
5. H5. エネルギーによるランキングは、有効なFormに質量を集中させる。(対照学習型の `FormEBM-v2` は AUROC `0.8922 >= 0.85` と `84.05%` の解決可能top-1精度に到達した。スパン正規化型の `FormEBM-v3` は未見形状でのAUROCを `0.9437 >= 0.85` に引き上げ、欠陥ヘッドで `83.44%`、複合の解決可能top-1精度で `80.98%` を得た。キャリブレーションを行わない `FormJEPA-v1` の `0.618` を上回る。ゼロショットOODのH15におけるプールAUROCは `0.2585` から `0.5278` に上昇したが、`0.5278` を超えるモジュール横断のシグネチャ/トレースのキャリブレーションは未解決である。)
6. H6. 参照アプリケーションはFormとして符号化可能である。
7. H7. セキュリティはモデルに依存しない。(ファジングを行った腕での測定では、1,275件の変異体に対して違反0件。)
8. H8. 受理された各Formは決定論的に再生される。(6つのターゲットにわたる10,500本のストリームで支持。不一致0件。)
9. H9. コストは実行前に予測される。
10. H10. 商空間(正準Form)上での学習は、訓練データを節約する。
11. H11. エネルギーは編集距離に対して単調である。(対照学習型の `FormEBM-v2` は厳密な5ステップ単調性で `93.0% >= 80%` に到達した。分解型の `FormEBM-v3` は、未見の累積欠陥連鎖100本において、`E_depth` で `94.0%`(Spearman `0.9966`)、`E_total` で `92.0%`(Spearman `0.9846`)に到達した。`FormJEPA-v1` は `36.0%` であった。制約のない同一線上のランダムウォーク切片では、依然として `80%` を下回る。)
12. H12. 決定ヘッドは、ゲートの結果に対してキャリブレーションされている。
13. H13. 長い編集系列にわたる計画では、離散潜在変数が連続潜在変数より優れている。
14. H14. 公開された決定論的な厳密提案器の階梯は、登録されたタスク集合のうち計測可能な割合を、モデル呼び出しゼロで解決する。この割合は、学習済み提案器が残差上で上回るべきベースラインである。(支持。151タスク中111件、73.5%を解決し、40件のタスクが未解決のまま残る。)
15. H15. 提案器の各クラスは、Gear-0 結晶化および3-Gear Cascadeと並べて、マッチさせた予算の下で40タスクの残差上で比較される。単発の6つのクラウド/ローカル提案器(`17/40` から `34/40`)、目的学習済みの `FormJEPA-v1`(`k = 1` で `22/40`、`k = 16` で `27/40`、`FormEBM-v2` による再ランキングを伴う型付き `k = 1` で `25/40`、`FormEBM-v3` の `E_def` 下での型付き `k = 1` で `24/40`、複数提案器による `k = 1` で `27/40`)、公開標準ライブラリのヘッダを用いる有界なチェッカーフィードバック型 `H15-Iterative`(`Opus 5.5` と `Sonnet 5.5` で `40/40`、矛盾0件、`Grok 4.20` で `39/40`)、および Shape D(`DNULLMM1`)の Gear-0 リプレイ(呼び出し0件で `40/40`、`Zipf(0.85)` 上で `16.67×` の3-Gear エピソード削減と `200/200` の受理)を対象として比較する。拡散型およびevolutionary型の腕は未解決のままである。

<div id="falsifiers-overview" class="anchor-alias" aria-hidden="true"></div>

## 反証条件の概観

六つの観測は、仮説が検証された後の第8節で完全に述べられ、前提の一部を覆す。

1. RJ-F1. 任意の五つの対象言語において、リフトカバレッジは80%未満で頭打ちになる。
2. RJ-F2. 参照アプリケーションの意図仕様を書き起こすコストは、手作業で Forms を作成するコストを上回る。
3. RJ-F3. H3 が失敗する一方で、トークンアームは同じゲートで合格する。
4. RJ-F4. H11 が失敗し、検索はビーム予算内で受容可能な Forms に到達しない。
5. RJ-F5. 決定ヘッドのキャリブレーションは、形状ハッシュ上の頻度表に勝ることがない。
6. RJ-F6. トレースで学習されたトークンスペースモデルは、Form 商を使用せずに、等エネルギーかつ等ゲート受容で40タスクの残差を閉じる。

<div id="proposer" class="anchor-alias" aria-hidden="true"></div>

## 既に存在するもの、及び本ページの目的

Reality Code Engine は、その公開リファレンスチェッカーおよびエンジンの設計において、決定を左右する問題の半分を保持している。その公開論文、[The Reality Code Engine](/papers/rce/) は、その半分の設計を記述している：エントリ時にすべての候補をチェックするコミットゲート、正確なリプレイ（実行時状態はログ上の遷移関数の左畳みである）、ある Form から他言語への射影、整数コスト会計（`est_j`）を、OS/オンチップカウンタ読み取り（`reported_j`、Apple M5 Max でコミット `1762fb4b` に初めて記録）や外部壁メータ読み取り（`measured_j`、RCE には存在しない）から厳密に分離して保持する。コア定理は証明支援系である Lean 4.36.0（`f87d6af2` における `64` モジュールにまたがる `1,264` 個のソース宣言から生成された `5,393` 個のカーネル定理定数、`lake check --paranoid` の6つの独立した証明チェッカーすべてで検証済み）で検査されており、仕様と Lean ライブラリは公開されている。このページはその論文からモデル提案者実行の公開記録のみを引用し、残りを設計コンテキストとして扱う。

**本ページは提案器（proposer）を対象とする。** 提案器とは、どの Form を試行すべきかを提示する学習済みの構成要素である。検査器（checker）、リプレイ、および他言語への投影は公開コードであり、エンジンのゲートと `est_j` の会計は仕様化された設計である。第8節では、6つの既製モデルによるベンチマークと、メモリマップ方式の Gear-0 結晶化の結果を報告する。また、目的学習された初の潜在 Form JEPA 修復提案器である `FormJEPA-v1`（学習可能パラメータ `8.42M`、互いに素な正準 Form S式で学習）は、保留された合成 Form 欠陥 `177/200` を受理し、未解決の残差タスク `27/40` を、サブジュール規模のコア `reported_j` で処理した。さらに、対照的な多段マージンエネルギー採点器 `FormEBM-v2`（パラメータ `5.85M`、同一の互いに素な `1,387` 件の Form 分割で学習）は、未見形状の H5 AUROC `0.8922` と、H11 における厳密な5段階編集単調性 `93.0%` に到達し、解決可能な検査呼び出しを `2.39×` 削減した。スパン正規化された二頭分解型採点器 `FormEBM-v3`（パラメータ `6.05M`、同一分割）は、未見形状の H5 AUROC を `0.9437` に、H11 の厳密な5段階単調性を `E_depth` で `94.0%`、`E_total` で `92.0%` に引き上げた。加えて、分布外 H15 の複数提案器プールド AUROC は、ゼロショットで `0.2585` から `0.5278` に改善し、大規模スパンの有効な書き換えと短い無効な書き換えの識別では `0.6018` に達した。公開標準ライブラリヘッダを用いた有界な検査器フィードバック残差閉包（`H15-Iterative`）は、残差タスク `40/40` を閉じ、矛盾 `0` 件、ゼロ呼び出しの Gear-0 リプレイ `40/40` を達成した。対話型の計測器は [対話型計測器](/living/rce-jepa/) で公開している。一方、意図から Form への完全な合成、モジュール横断のシグネチャおよびトレースに関する分布外エネルギー較正、ならびにゲート受領決定ヘッドは、依然として未解決の課題である。

<div id="ladder" class="anchor-alias" aria-hidden="true"></div>

### 決定論を優先する - 提案者の下にあるラダー

自動化の第一の原則は、手動プロセスが機能していることである。RCE-JEPA が提案するものは、手動バリアントまたはすでに機能している決定的自動バリアントの上にのみ意味を持ち、学習された提案者はそれに追加されるものであり、置き換えるものではない。したがって設計は提案者をはしご状に順序付け、正確な提案者が最初に実行される。

1. **再利用。** 内容ハッシュ（正規テキストのハッシュ）または名前なし形状（すべての名前を位置に置き換えた Form、名前の変更で変わらない）と一致する保存された Form は、そのまま再利用される。
2. **型による検索。** `rce search` は、タスクが必要とする型と一致する保存されたハンドラを見つける。
3. **決定的書き換え。** `rce fmt` が仕様の規則表で「変更」されたメソッドを持つ規則に対して書き込む書き換えであり、各規則は一つの結果を持ち、二度目の実行では書き換えるものが見つからない。
4. **有界列挙。** 名前なし正規射影で列挙された、固定上限までのすべての小規模編集が、チェッカによって評価される。
5. **名前変更。** あるスコープ内で値名が別の値名になる、またはバインディングがチェッカのレポートが名前付けする名前になるケースが、固定上限まで列挙され、各候補がチェッカによって評価される。

学習された提案者は、はしごが閉じない残余タスクのみに作用する。提案は正規 Form 編集空間で行われ、同じチェッカがはしごの候補と同様にすべての提案を評価する。確率的モデルが行うべきことを削減することで、行動空間が小さくなり、より習得しやすくなる。これが H10（商集合上の学習はデータを節約する）が成立すると期待できる理由であり、H14 が学習提案者が残余で上回るべきベースラインとしてはしごのシェアを設定する理由である。はしごは `rce repair`（openIE-dev/rce）として公開されており、openie-research-experiments の `rce/bench/ladder` に三つの実行が登録されている。これらのファイルははしご 1〜5 を文字 a〜e でラベル付けし、はしご 5 は三番目の実行のために追加された。結果は下記 Section 8 の H14 と共に報告されており、はしごが逆転させる変異クラスと実際の履歴からの 41 件の変更のうち 1 件を閉じ、残余はほぼすべての実際の欠陥となっている。

<div id="rung-f" class="anchor-alias" aria-hidden="true"></div>

`rce repair` の openIE-dev/rce のメインブランチには第六のはしご f があり、はしご 1〜5 が何も閉じなかった場合にのみ実行される。はしご f はモデルを直接呼び出さない。RCE の外部で、ホストサービス上またはローカルマシン上のモデル、あるいは人間が書いたプログラムは、入力ファイルとしてのみ到達し、各ファイルは起源を示すラベルと SHA-256 ダイジェストで記録される。チェッカはそれらをはしごの候補と同様に評価し、変異ゲートを含む。変異ゲートは、プログラムの例やチェックが単一の小規模編集で失敗し得ないことを示す場合、プログラムを拒否する。例、チェック、法則を変更する提案は、評価される前に拒否される。はしごのモードは仕様内のデータで決まり、`off`、`observe`、`auto` のいずれかで、`observe` のままである：すべての提案が評価され、チェッカが受理した提案は差分、ダイジェスト、起源と共に報告され、プログラムは開いたままで、ソースファイルは上書きされない。`auto` では、最初に受理された提案がプログラムを閉じ、レポートはその閉鎖を確率的とラベル付けする。

仕様は、記録された評価に対して昇格基準が成立している場合にのみ `observe` から `auto` への変更を許可する。この基準は、いかなる観測が行われる前に openIE-dev/rce に登録されており（`rce-repair-rung-f-promotion-2026-11-03`、`sha256: abf7f131f240e3f9...`）、その SHA-256 が横に固定されている。基準は、クローズの少なくとも 98% が決定的ランクから、最大 2% が確率的ランクから来ること、各確率的出力はゲートで制御されること、という規則に従う。ラン 2 と 3 の 151 タスクについては、各ランがタスクの元のプログラムを既知の良好バージョンとして与え、クローズの最大 2% がラン f から来ることが許容される。観測されたすべての提案は、許可されたものとして受理される際に変異ゲートを通過しなければならず、元のプログラムと矛盾してはならない。すなわち、ある一連のイベントの後で元のプログラムと異なる振る舞いをしてはならない。決定的コマンド `rce repair criterion` は観測記録から基準を評価し、記録された評価が基準を満たさない限り `auto` モードを拒否する。コミット `1762fb4b` における登録済み 151 タスクの評価（以下セクション 8 に報告）では、各タスクの既知の良好な元のクローズ `116` 件が `0` 回のモデル呼び出しで実行され、`35` 件のタスクが未解決のまま残った（`25` 件はラン f によってスキップされた構文エラー `W-SYN-1` ファイル、`10` 件は未解決の構文タスク）。外部提案（`FormJEPA-v1` と記録された残余修復の組み合わせ、`91` 件の提案が評価）を投入した結果、観測されたラン f の受理は `3` 件であり、`3/3`（`100.0%`）が変異ゲートを通過し、元と矛盾するものは `0` 件（`3/3` が復元）であった。しかし、クローズ `119` 件中 `3` 件は `2.5%` であり、許容上限 `2.0%` を超えているため、`rce repair criterion` は決定的に `holds: false` を返し、ラン f を `observe` モードに保つ。

<div id="steer" class="anchor-alias" aria-hidden="true"></div>

### モデルが操舵し、エンジンが描画する

ロボティクスはすでにこの方式で機能している。V-JEPA 2-AC、すなわち V-JEPA 2 ビデオモデルのアクション条件付きバージョンにおいて、プランナはロボットのアクションを探索し、予測された将来表現と目標画像の表現との距離を最小化することで最適化を行う; 画像ピクセルを生成することは決してない [B1]。エンコーダは 100 万時間以上のビデオで事前学習され、アクション条件付き予測器は 62 時間未満のラベルなしロボットビデオで学習された [B1, abstract]。RCE-JEPA はコードに対して同様の分割を提案する: 学習されたモデルが Form への編集を選択し、エンジンが受理された Form からすべてのターゲット言語をレンダリングする。コードを出力するモデルは存在しない。

コードはロボティクスと決定的に異なる点がある。ロボットの世界モデルは *世界がどのように動くか* を学習しなければならない $z_{t+1}=g_\phi(z_t,a_t)$。RCE では遷移関数 $\delta$ が与えられ、証明されているため、前方ダイナミクスを学習する必要は全くない。残る学習課題は逆問題であり、どの編集が候補を意図が要求する方向へ動かすかである。MuZero がモデルを学習するのは、著者らが述べているように、プランニング手法が「環境のダイナミクスに関する知識に依存する」からである [T1, Sec. 1]; ここではそのダイナミクスが書き下ろされている。

<div id="one-form" class="anchor-alias" aria-hidden="true"></div>

### 一つの実際のForm

アーキテクチャの前に、対象がある。これは公開リポジトリ（`examples/surface/counter.rce` in openIE-dev/rce, at commit `1762fb4b`）からの完全なプログラムであり、RCE のサーフェス構文で 14 行からなるもので、編集されていない形で示す。

```text
intent "a counter that never goes negative"
    example Inc, Inc, Dec -> 1
    example Dec -> kept: Underflow

state Counter
    n: u64 = 0

event Inc
event Dec

error Underflow

step Counter on Inc -> n + 1
step Counter on Dec -> try n.checked_sub(1) else Underflow
```

それを $P=(S,E,\delta,D,\lambda)$ と読む。`state` ブロックは S で、ゼロから開始する符号なし 64 ビット整数である。二つの `event` 行は E である。二つの `step` 行は $\delta$ である。`intent` ブロックはこのページ上で $\sigma(I)$ と書かれた小さな意図の仕様であり、必須のトレースが二つ、うち一つは保持されたステップで終了しなければならない。ゼロでのデクリメントは適用されず、ステップは `Underflow` とともに状態を保持し、定理 T8 により状態は変わらない。提案者の課題は、この例で述べられているように、`intent` ブロックだけが与えられたときに、ゲートが受理する `state`、`event`、`step` 行を見つけることである。

<div id="architecture" class="anchor-alias" aria-hidden="true"></div>

### アーキテクチャ

ここに描かれた箱は提案者インタフェースである。これは単一のアーキテクチャではない。提案者は意図と現在のFormを読み取り、候補編集または候補Formを返す。ゲートはインタフェースの外側にある。潜在空間で予測するJEPAエンコーダはその一例である。トレース学習デコーダ、拡散コードモデル、形式環境内の強化学習、進化的探索、ライブラリ学習および制約付きデコーディングは他の例である。以下のセクション6ではそれぞれを名前付けし、チェッカーから必要とするもの、既知の失敗モード、そしてどの仮説を移動させるかを示す。決定ヘッドは同一インタフェースの小型型付けインスタンスである。いかなるインスタンスも提案のみを行い、コーディングの法則はそれに依存しない。

![Inside a dashed region labelled learned and untrusted: an intent encoder, a proposer acting as an inverse model, an exact rollout by the transition function, a Form encoder with energy, a tree search, and a decision head. Outside it: the gate, which alone admits programs, and the checker and engine, which replay and project. A requires-change arrow returns the broken rule to the search](/figures/rce-jepa/architecture.svg)

*図 2. モデルが制御し、エンジンが描画する。橙色の箱は学習済みかつ信頼できない部分を示し、青色の箱は検索中にシミュレータとして使用される遷移関数による正確なロールアウトを示す。緑色の箱はRCE論文が記述する部分、公開コードまたは指定設計（その論文参照）である。ゲートのみが受け入れる。設計図であり、データではない。*

| コンポーネント | 役割 | 初期設計 | 理由 |
| --- | --- | --- | --- |
| Form encoder $E_f$ | Form とその例イベント上のトレースを潜在 $z_f$ に写像する | 正規化に SIGReg（等方性ガウス正則化の概略）を用いた Form の正規 JSON（JavaScript Object Notation）とトレーストークン上の小規模トランスフォーマー [B2]；離散またはソフトコードブックボトルネックを持つ第2アーム [B3, B4, B5]（SC-JEPA のソフトコードブックは EMA（指数移動平均）教師と再構成アンカー [B5, Sec. 4.4.1 and App. B.1] と共に安定化） | トレースは同値性を定義し、$\delta$ が厳密であるためトレースは自由である。離散トークンは連続潜在が誤差を蓄積する長期予測を安定化させる [B3]；ブール潜在はビット単位の等価性により正確な状態再識別を可能にし、これは [B4] が先行研究への言及と共に示す動機である |
| Intent encoder $E_I$ | $\sigma(I)$（必須トレース、コントラクト、テスト、文章）を同一空間に写像する | 共有アーキテクチャで、既知の受容フィット $f^\star$ に対して $E_I(\sigma(I))$ が $E_f(f^\star)$ の近傍になるように学習する | 目標と候補を同一メトリックに置くことで、V-JEPA 2-AC が目標画像と共に行うようにする [B1] |
| Proposer $\Pi_\theta$ | $z_I$ と現在の $z_f$ を受け取り、型付き Form 編集を提案する | 目標条件付き逆モデルで、LeWAM が GC-IDM（goal-conditioned inverse dynamics model）として比較する形で、Nguyen ら (2026) のベースラインを評価するが、LeWAM の著者が提案したモデルではない [B6, Sec. 4.2 and App. A.2] | $\delta$ が厳密であるため、逆モデルが学習可能な対象になる |
| Energy $\mathcal{E}$ | ゲート前に候補を順位付けする | $\alpha V(f)+\beta\,d(z_{\tau(f)},z_{\sigma(I)})+\gamma\,C(f)$、`est_j` から取得した $C(f)$ を用いる | 別途学習されたエネルギーは比較可能でない [T2, Sec. 1.3]；$\alpha,\beta,\gamma$ は保持スライス上で受容と変更要求を区別する AUROC を最大化するように適合され、すべての実行で報告される |
| Planner | 編集を探索する | 提案編集に対するビーム探索または木探索を行い、$\mathcal{E}$ でスコア付けし、各ノードで厳密ロールアウトを実施する | V-JEPA 2-AC は連続アクション上でクロスエントロピー法（CEM）を用いて計画する [B1]；Form 編集は離散かつ組合せ的であるため、CEM は適用できない |
| Decision head | 校正された確率で有界選択を行う：各穴の値、順位、同値性判定 | RCE プロジェクトが構築し、ゲート受領（次節）で学習した小規模決定モデル | 校正された確率 $p_i$ が最も安価な順にカスケードを並べ替える |

**決して学習されないもの:** $\delta$, $\lambda$, フォールド, ハッシュチェーン, プロジェクション, ゲート, プロモーションパス。これらは固定かつ認証済みであり、プロモーションは決して再学習しない。

<div id="decision-head" class="anchor-alias" aria-hidden="true"></div>

### 決定ヘッドは提案者であり、ゲートの外部に位置する

2026年に小規模でエネルギー意識のある決定モデルのクラスが登場した。決定モデルは状態の一部と固定された質問を受け取り、テキストを生成せずに各選択肢に対する確率付きの型付けされた回答を返す。ある状態に関するすべての質問は単一のリクエストで回答される [B7; B8]。回答は制限されており、はいまたはいいえ、呼び出し側が提供した選択肢集合（Jevでは最大255、Layaの精度は約20を超えると低下）からの選択、または宣言されたスケール上のスコアである [B8]。本節では概念の収束例としてクラスのメンバーを挙げ、RCE の構成要素としては扱わない。

- **Laya** は約4億2100万パラメータを持ち、ModernBERT-large エンコーダ上に二層の決定ヘッドを備えたオープンウェイトモデルで、Apache 2.0 の下でリリースされている [B8, B9]。
- **Kev** は Qwen バックボーン上に構築された 0.8 から 270 億パラメータまでのオープン決定モデル群で、各チェックポイントには較正用の温度が付与されている [B10]。
- **Liquid AI のオープン d1 モデル**、d1-3B と d1-omni-600M は 2026年10月7日にエッジおよび物理システム向けにリリースされた。d1-3B は NVIDIA Jetson AGX Thor 上で 16 ms、Jetson Orin Nano 上で 50 ms で 1 質問に回答し、カメラフレームを読み取り、モデルを Jetson 上でハードウェア・イン・ザ・ループ構成の Isaac Sim ロボットシミュレータで環境ナビゲーションに使用したことが示されている [B11]。

クラスに属するあるホストメンバーを独立ベンチマークした結果、選択確率は良好に較正されており、22 の選択データセットと 279,925 件の回答を合計した期待較正誤差 (ECE) は 0.028 であった [B7]。二値（はいまたはいいえ）確率はやや較正が不十分で、単一ラベルで ECE 0.052、マルチラベルで 0.168 であり、しきい値の調整が必要であった [B7, Sec. 4.3]。クラスの文書化された弱点として、数え上げ、算術および日付比較、そして状態が無関係な内容でパディングされる場合の精度低下が挙げられる [B8, B12]。

決定ヘッドは上記のプロポーザーインタフェースのプラグインの一つである。JEPA エンコーダは別のプラグインである。ホストでもローカルでも、ヘッドは単に提案を行う。

**RCE プロジェクトの計画** プロジェクトは独自の決定ヘッドを構築し、独自のゲート受領書で訓練・較正する。エンジンの設計では、すべてのゲート決定が候補、結果、破られた規則、`est_j` を含む受領書を書き込むため、較正データにラベリングコストはかからない。ヘッドに渡される状態は Form の正規化された JSON とそのトレースであり、構造上小規模であるため、文書化されたパディング状態の弱点に直接対処できる。ヘッドはプロポーザーである。プロジェクトまたは他者が構築した任意の決定モデル（ホストでもローカルでも）は提案のみを行い、Form を受理することはなく、RCE のセキュリティはそれに依存しない。

<div id="data" class="anchor-alias" aria-hidden="true"></div>

### データ

V-JEPA 2 ペアは、非常に大規模な受動的事前学習を小規模な行動条件付きセット [B1] と組み合わせる。RCE アナログは四層構造を持つ。

| Tier | Source | Size target | Trains |
| --- | --- | --- | --- |
| Passive: Forms and traces | ピン留めされた公開コーパスから RCE 論文 (Sec. 6) の公開コード化に伴い持ち上げられた Forms、当該論文のエコシステムプロトコル (Sec. 2.3) のシードジェネレータからの Forms、そしてすべての昇格ハンドラ | $10^5$ から $10^6$ の Forms と traces | Form エンコーダは、潜在空間におけるマスクされた規則とマスクされた trace セグメントを予測することにより学習する |
| Paired: intent and fit | 持ち上げられたプログラムに付随するテストとコントラクト；Form の自身の trace を自己生成仕様として利用；事前登録されたブラウンフィールドアプリケーション；Forms として記述されたベンチマーク仕様 | $10^4$ ペアから開始 | Intent エンコーダとプロポーザ |
| Decision receipts | すべてのゲート決定 | 無制限、ラベリングコストなし | 決定ヘッドのキャリブレーション |
| Hard negatives | 名前付き破損規則を伴う変更要求判定；ゲートが受理しなかったモデル提案等価性 (公開記録における 15 件の提案のうち 18 件、12 件の異なる書き換え、RCE 論文 Sec. 5.5) | 実行ごとに増加 | コントラスト信号：有効対無効、等価対非等価 |

近似重複フォームは、分割前に形状ハッシュで除去され、保持された分割は形状ハッシュによって行われ、表層テキストによっては行われない。最初のコーパスは存在する：Form コーパスのバージョン 1（2026 年 10 月 23 日）は、公開リポジトリ（バージョン 4、2026 年 10 月 24 日）からの手書きプログラム 192 種類の形状を保持し、そのうち 55 件にインテントブロックがあり、3,456 件のネガティブ（変更が必要な適合プログラム 343 件、各々に診断コードが付与され、31 種類の診断コードに跨る変更が必要なチェックサーバー検証ミュータント 3,113 件、空白トークンと型付き）を含む。データセットカードと形状ハッシュによる分割が付与されており、そのジェネレータはリポジトリ内の `scripts/corpus.py` で、行は [research.openie.dev/data/](/data/#rce-jepa) にある。これは、最小規模のペアおよびハードネガティブ層であり、受動層（リフトされたプログラム）はリフトパイプラインが公開されるまで空である。これに対して、H1 は実行前に事前登録された最初の測定を持ち、185 プログラムに対する rho = b(code)/b(P) の中央値は 9.34 であり、生成された Python に対して（四分位範囲 8.45 から 10.81；バージョン 1 は 173 件で 9.31、Rust は 17.33、JavaScript は 11.06、Scala は 13.66）しきい値 5 を上回っている。最初の 173 件のうち 171 件が 5 を上回っており（Wilson 95% 区間 0.96 から 1.00）。圧縮記述長（gzip）において比率は Python が 3.57、Rust が 5.73 であり、これは主たる指標の横に報告され、情報量に関する主張として解釈されないようにしている：H1 は提案者が探索する空間、すなわち語彙下のトークン数に関するものである。生成されたソースは参照チェッカー自身のもので、共有ランタイムは除外され、リフトされたプログラムやモデル生成プログラムは母集団に含まれない。Apple M5 Max 上でコミット `1762fb4b` の場合、H2 はオペレーティングシステム/オンチップ `reported_j` において測定され、`rce check` はフォームチェックあたり中央値 `7.32 ms` と `0.04904 J`（カーネル `ri_energy_nj`）を要し、ローカル `Qwen 3.6 35B-A3B` の候補あたり `84.25 J` と比較される（`C_check / E_model = 0.000582 <= 0.05`；詳細は下記第 8 節）。さらに、インテントブロックがもたらす効果の測定があり、RJ-F2 と H7 の両方がそれに依拠する：プログラムの振る舞いを変えるミュータントのうち、独自の例示行は 392 件中 317 件（0.81、Wilson 95% 区間 0.77 から 0.85）を捕捉し（54 件のプログラムのうち 24 件はすべて捕捉）、捕捉されなかった変更はほぼすべて、例示が運用しない定数が 1 だけ移動したものとなっている。

<div id="training" class="anchor-alias" aria-hidden="true"></div>

### 訓練の概要

- **エンコーダの目的。** 潜在予測と SIGReg の組み合わせである LeJEPA のレシピは、単一のトレードオフハイパーパラメータのみを必要とし、ストップグラデーションや教師-学生スキームを用いない [B2, abstract]、および二つの損失項でエンドツーエンドに学習する LeWorldModel のレシピである [B13, abstract]。同一系列の研究からの二つの注意点: LeWorldModel の著者は、低次元固有次元の環境において等方性ガウスターゲットが制限になる可能性があると指摘している [B13, Sec. 4.2 and Sec. 6]、そして分布フリーな代替として対照的逆動力学が提示されているが、これは連続制御のみで評価され、離散状態変化がどの行動によっても同様に見える組み合わせパズルタスクでは SIGReg より明らかに劣っていた [B14, Appendix D]。さらに SIGReg と VISReg は「学習された潜在表現が計画に必要なすべての重要情報を保持することを保証しない」 [B15, Sec. 4.1]。両方の手法は並行して走り、Form の正確で低コストな属性（単調タグ、燃料上限、規則数）を予測する補助ヘッドを持つ。
- **マルチステップ予測。** k ステップの再帰的予測で学習すると、EB-JEPA のアブレーションで露出バイアスが減少し、k = 4 付近でパレート最適が得られるなど、著しく良い結果が得られる [B16, Fig. 3]。RoboJEPA は長期クールダウンで自己回帰的トレーニングロールアウトを K = 2 から K = 10 ステップに拡張し、これは大規模計算（約 10<sup>21</sup> FLOPs 以上）でのみ効果を発揮する [B17, Sec. 3.3 and App. C.2]。プランナーホライズンに合わせたロールアウト一貫性項は Temporal-Distance JEPA から導入される [B18, abstract]。
- **単調エネルギー。** 単調コスト順位付けは、ゴール到達軌道からさらに逸脱した計画に対して高いコストを課す。これがないと、コスト表面の局所最小値がプランナーを劣った計画へ導く可能性がある [B19]。単調性はタスクによって保証されない: EB-JEPA のナビゲーションタスクは非単調であり、最適経路はまずゴールから離れるからである [B16]。ここでは事前登録された診断 (H11) であり、仮定ではない。
- **プロポーザー。** ペア階層からの意図、Form、編集トリプルで教師あり学習し、その後自身のゲート受容軌道で改善する。ゲートは報酬である。
- **潜在を直接デコードしてはならない。** MoRAE は、凍結された JEPA 潜在で直接モーションを生成すると「劇的に失敗する」ことを報告し、失敗の原因を潜在スペクトルの条件が悪いことと、潜在誤差がデコード後に大きなアーティファクトへ増幅されることに帰す [B20, abstract and Sec. 3]。プロポーザーは型付けされた編集を出力し、潜在は順位付けされるだけで、レンダリングは行わない。

<div id="convergence" class="anchor-alias" aria-hidden="true"></div>

### 収束 - 各要素がすでに存在する場所

単一の RCE-JEPA の要素はすべて新規ではない。各要素は既存の場所を持ち、以下に収束として列挙されており、優先度ではない。測定されていないのは結合システムであり、これが仮説の対象である。

| 部品 | 存在場所 | 確立したこと | RCE-JEPA との違い |
| --- | --- | --- | --- |
| コンパクトな計画を予測し、プログラムをデコードする | Latent Programmer [B21] | 仕様から予測された離散潜在コード、その後プログラム；文字列変換精度がベストベースラインより5〜7ポイント（相対10%超）向上し、docstring からの Python コード生成において BLEU が高い [B21, Sec. 5.1 and 5.3] | 対象言語がオープンで、標準形がなく、チェッカーもない |
| 実行を学習し、テキストだけにとどまらない | LaSynth [B22]; Code World Model (CWM) [B23]; analysis of CWMs [B24] | 制限された C ドメインにおいて潜在実行が合成を改善する；CWM は Python インタプリタと Docker 環境からの観測-行動軌跡で中間訓練されている | ダイナミクスが学習される；RCE ではそれらは正確である |
| 同値類を学習目標とする | EqNet, Allamanis et al. [B25] | 同値類上で訓練された記号式の連続表現 | 式であり、プログラム全体ではない |
| エージェントが提案し、ソルバーが検証する | Agentic model checking [B26]; verified synthesis for concept design driven by a large language model (LLM) [B27]; AlphaProof, Clover, AutoVerus (Section 3 below) | 「エージェントが提案し、ソルバーが検証する」は原則として述べられている；Alloy 不変条件と正負シナリオに対する CEGIS 形式の合成（反例誘導帰納合成） | 提案者はトークンを生成する；潜在計画もジュール計算も行わない |
| JEPA を潜在推論器として | JEPA-Reasoner [B28] | 潜在推論がトークン生成から切り離されている | テキスト領域 |
| 実行前にコストを予測する | Compiler world models [B29] | 遷移モデルが潜在空間でスケジューリングアクションをロールアウトし、終端状態表現を予測する。ランカーはこれを用いてハードウェア測定回数を減らした後に候補を順位付けする；スコアはワークロード内順位であり、較正されたコストではない [B29, Sec. 3.2 and Sec. 6] | テンソルプログラムのスケジュールのみ |
| 離散潜在表現 | Discrete-JEPA [B3]; discrete world models via regularization [B4]; SC-JEPA [B5] | 長期的記号予測を安定させる離散トークン [B3]；再構成なしで学習されたブール潜在（計画は将来の課題） [B4]；EMA 教師と再構成アンカーを備えたソフトコードブックボトルネックにより、1ステップ潜在予測を安定化させ、長期ロールアウトは安定化しない [B5] | 合成画像、パズル、時系列データ；プログラムではない |
| 安定した JEPA 訓練 | LeJEPA [B2]; LeWorldModel [B13] | ストップグラデント、教師ネットワーク、ハイパーパラメータスケジューラなしで崩壊のない訓練；標準的な学習率ウォームアップとコサインスケジュールは依然使用される [B2, abstract and Sec. 6.1]；ストップグラデント、EMA、事前学習エンコーダなしで、2 つの損失項を使用 [B13, Sec. 3.1] | 目的として再利用可能；画像 [B2] とピクセル [B13] のみで検証され、プログラムデータでは未テスト |
| 小規模校正決定モデル | Laya [B9]; Kev [B10]; Liquid AI open d1 [B11]; benchmark [B7] | オプションごとの確率を伴う型付き回答。Kev はチェックポイントごとに適合した温度を提供する [B10]；Laya は過信的で（平均 ECE 0.466）であり、タイプ別温度再適合後にのみ 0.081 に到達する [B9]。レイテンシは、Laya が T4 GPU 上で質問あたり約 33〜40 ms、Kev が H100 上で 6 質問で 18.1 ms であるが、CPU や Mac では数百ミリ秒になる（Laya は CPU 上で 193〜464 ms、Kev-4B は M5 Mac で 721 ms）[B9, B10]；d1-3B は Jetson AGX Thor で 16 ms、Jetson Orin Nano で 50 ms で 1 質問に回答する [B11]；1 名のホストメンバーが校正のために独立してベンチマークを実施した [B7] | 世界モデルがない；RCE-JEPA では決定ヘッドが複数の提案者のうちの一つである |
| トレース訓練された提案者 | Code World Model [B23], Section 3 below | Python 実行トレースとエージェント軌跡に対する中間訓練。SWE-bench で pass@1 がベース 53.9% 、ベスト 16 サンプルで 65.8% と報告されている [該当レポート] | 動的が学習される。Form において遷移は正確である。著者らはトレース予測を「第一段階」と呼んでいる |
| 評価者ゲート付き進化的探索 | AlphaEvolve (Novikov et al., Section 3 below) | モデルが編集を提案し、自動評価者が決定する。ここで使用されるカーネル図は、48 個のスカラー乗算で 4×4 の複素行列乗算である | 評価者が存在する場合に機能する。そのレポートは Form の商を使用していない |
| サンプリング時の制約 | Type-constrained decoding (Mündler et al., the Swiss Federal Institute of Technology Zurich and the University of California, Berkeley, Section 3 below) | HumanEval でコンパイルエラーが 75.3% 減少し、MBPP で 52.1% 減少。構文のみの場合はそれぞれ 9.0% と 4.9% | TypeScript スケール。型は受容規則全体を構成するものではない |
| 検証済みコードへの仕様 | Vericoding (Bursuc et al., Section 3 below) | 12,504 件の仕様。成功率は Dafny が 82.2%、Verus が 44.2%、Lean が 26.8%。要旨はそれらをそれぞれ 82%、44%、27% に丸めている | 仕様は依然として記述が必要である。自然言語の説明はほとんど効果がない |

<div id="specification-cost" class="anchor-alias" aria-hidden="true"></div>

### 仕様コストの命名

チェッカーは Form が有効であることを保証するが、意図された Form であることは保証しない。概念設計のための検証済み LLM 主導合成において、不変式のみの合成は「検証済み設計を迅速に得られたが、実行ごとに一貫性のない設計がしばしば生成された」ことを示し、これは「不変式だけでは設計課題が過度に制約されていない」ことを示す。シナリオ指向合成は、自然言語プロンプトに比べて意図した設計をより一貫して回復したが、最小限のシナリオは過適合する可能性がある [B27, abstract]。この結果は、3 つの応用と 12 種類のバリエーション、1 つの LLM 構成で得られた [B27, Sec. 5]。支配的な失敗は「有界検証の失敗ではなく、仕様カバレッジの失敗」であった [B27, Sec. 5.6]。seL4 において抽象仕様は約 4 人月、証明は約 20 人年を要した（Klein et al. 2009, Section 2 below）。閉じたプログラム世界は受容を正確にし、探索を扱いやすくする。意図の不確実性は $\sigma(I)$ に移されるが、除去はされない。下記の偽証者 RJ-F2 はそのコストを公開し、測定可能にする。

<div id="h11-h13" class="anchor-alias" aria-hidden="true"></div>

### 提案者に関する仮説

提案者は H11（単調エネルギー）、H12（決定ヘッド較正）および H13（離散対連続潜在変数）によってテストされ、決定的ラダー上の残差（H14、H15）でスコア付けされる。全十五の仮説、H1 から H15 は、数値順に並べられ、閾値は下記セクション 8 の表に同一の慣例で示される：実行前に事前登録、エンジンのコミットを凍結しバイナリハッシュを記録、すべてのアームで同一ゲートを使用。

H3 のコントロールは現在固定されている：同一ゲートと同一コスト会計で、Qwen2.5-Coder-1.5B が表面コードを提案し、RCE 論文（Sec. 5.5）ですでに実行されたアームである。このときゲートは提案された 18 個の等価性のうち 15 個を受け入れず、唯一の異なる書き換えのみを受け入れた。この規則はエンジンがすでに保持していた。

<div id="falsifiers-moved" class="anchor-alias" aria-hidden="true"></div>

**Falsifiers.** 前提そのものに対する反証者 RJ-F1 から RJ-F6 は、テストする仮説に続き、[Section 8 below](#falsifiers) の H1 から H15 の表の直後に配置される。

<div id="risks" class="anchor-alias" aria-hidden="true"></div>

### リスクと軽減策

| Risk | Evidence | Mitigation |
| --- | --- | --- |
| 潜在表現のデコードは小さな誤差を増幅する | 凍結されたJEPA潜在表現での直接生成は、スペクトルの条件不良とデコーダの増幅により、動きに対して劇的に失敗する [B20] | 潜在表現を決してデコードしない; 提案者は型付けされた編集を出力し、ゲートがそれらを検査する |
| 崩壊しないが誤ったことを学習する表現 | SIGReg下の「物理的表現の怠惰」 [B15] | 補助的な正確属性ヘッド; 逆動力学正則化子 |
| 等方性事前分布が低次元Form空間に不適合である | [B13]; [B14] | SIGRegと対照的な逆動力学アームを並列に配置し、逆動力学アームが離散パズル状態で弱かったことを覚えておく [B14] |
| エネルギー項が整合しない | [T2, Sec. 1.3] | $\alpha,\beta,\gamma$ を実験ごとに適合させ、公開する |
| パディングされた状態で決定ヘッドが劣化する | クラスの既知の弱点 [B8, B12] | 正規のForm JSONとトレースのみを入力する |
| 表現力の上限 | Riceの定理 [T3]; 制限された言語 | リフトカバレッジが測定指標であり、RJ-F1が反証器である |
| 仕様コストが支配的である | seL4の努力（以下セクション2）; 不変の過小制約 [B27] | RJ-F2; 実行中プログラムからトレースを取得し契約を推論するツールで、独立した成果物として提供する |
| ベンチマークオラクルの弱点 | PatchDiff（Wang, Pradel, Liu、以下セクション3）: 正しいとカウントされたパッチの7.8%が開発者テストに失敗し、解決率は約6.4ポイント過大評価されている。早期2025年ツールのMETR試験（Beckerら、以下セクション3）: 16人の開発者、246件のタスクで、測定された完了時間は19%増加した。予測は24%低く、事後推定は20%低い | 受理はゲートとリプレイであり、テストスイートではない。セクション8（H15）はすべての候補に対し `rce check` と義務保持を強制する |
| 学習された計画レイテンシ | V-JEPA 2のモデル予測制御は1アクションあたり約16秒かかった [B1] | 正確なチェッカー（Apple M5 Max上で `7.32 ms` / `49.04 mJ`）を用いたForms上の探索と、Gear-0結晶化（検索ごとに `0.325 µs` / `1.77 µJ`）で繰り返しロールアウトを制限する |

フェーズドパイロット計画は、データエンジンから収束まで、各フェーズの事前登録と退出基準を含めてプロジェクトの作業ノートに保管され、ここに要約されている。Phase 0 はリフトコーパスと受領データセットを構築し、学習提案者を必要としない H14 の決定的ラダーを測定する。Phase 1 は Form エンコーダを訓練し、H1、H5、H11 をテストする。Phase 2 は決定ヘッド（H12）を構築・較正する。Phase 3 はトークン制御に対して専用 JEPA 提案者とプランナを訓練し（H3、H4、H10、H13）、Section 8 で報告された単発オフ・ザ・シェルフ H15 ベースラインを拡張する。Phase 4 はオンチップ `reported_j`（H2）を外部壁メータ `measured_j`（H8、H9）へ拡張する。Phase 5 は収束プロトコルを実行し、Gear-0 の昇格が各閉曲線についてモデルをループから除外する。Phase 0 と並行して、Convergence by commitment 以下に列挙されたソース C34 の vericoding ベンチマークの一部を、Dafny、Verus、Lean の状態機械形タスクとして選択し、Forms にリフトし、公開された vericoding 結果の横に RCE のゲートでスコア付けする。これにより、仕様から Form へのステップに対する外部ベンチマーク（H6、H7、H8）を提供する。

<div id="proposer-references" class="anchor-alias" aria-hidden="true"></div>

### 提案者参照文献

[T] でマークされた参照文献は以下の学位論文参照文献に記載されている。2節、3節および5節への参照は、このページ下部の各節を指す。ラベルは以下の主参照文献の慣例に従う。ここで**全文**とは、参照文献および付録を含む全文を読んだことを意味する。B9およびB10については、2026年10月14日にライブモデルカードおよびREADMEを読んだ。

1. [B1] M. Assran et al., "V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning", 2025. [arXiv:2506.09985](https://arxiv.org/abs/2506.09985). Full.
2. [B2] R. Balestriero and Y. LeCun, "LeJEPA: Provable and Scalable Self-Supervised Learning Without the Heuristics", 2025. [arXiv:2511.08544](https://arxiv.org/abs/2511.08544). Full.
3. [B3] J. Baek et al., "Discrete JEPA: Learning Discrete Token Representations without Reconstruction", 2025. [arXiv:2506.14373](https://arxiv.org/abs/2506.14373). Full.
4. [B4] D. Bizzaro and L. Serafini, "Discrete World Models via Regularization", 2026. [arXiv:2603.01748](https://arxiv.org/abs/2603.01748). Full.
5. [B5] Y. He et al., "SC-JEPA: Stabilizing Latent Predictive Learning for Time-Series Anomaly Prediction", 2026. [arXiv:2602.04643](https://arxiv.org/abs/2602.04643). Full.
6. [B6] M. Fu et al., "LeWAM: End-to-End World and Action Modeling with JEPAs", 2026. [arXiv:2610.12818](https://arxiv.org/abs/2610.12818). Full.
7. [B7] T. Deußer, L. Sparrenberg and R. Sifa, "Evaluating and Benchmarking the System One Model Jev", 2026. [arXiv:2609.37647](https://arxiv.org/abs/2609.37647). Full.
8. [B8] W. Wu, "Jev vs Laya: Comparing and Choosing Between Closed-Source and Open-Source System One Decision Models", 23 September 2026. [wilsonwu.me](https://wilsonwu.me/en/blog/2026/jev-vs-laya/). Full.
9. [B9] Nandakishor M (Convai Innovations), Laya model card. [Hugging Face](https://huggingface.co/convaiinnovations/laya). Full (read live 14 October 2026).
10. [B10] J. Palmer, Kev. [GitHub](https://github.com/jaredpalmer/kev). Full (README, read live 14 October 2026).
11. [B11] Liquid AI, "Open d1: Edge decision models for text, vision, and audio", 7 October 2026. [liquid.ai](https://www.liquid.ai/blog/d1-open). Full.
12. [B12] Sanity, "Decision model" (glossary). [sanity.io](https://www.sanity.io/glossary/decision-model). Full.
13. [B13] L. Maes, Q. Le Lidec, D. Scieur, Y. LeCun and R. Balestriero, "LeWorldModel: Stable End-to-End Joint-Embedding Predictive Architecture from Pixels", 2026. [arXiv:2603.19312](https://arxiv.org/abs/2603.19312). Full.
14. [B14] J. Boylan and C. Hokamp, "No Gaussian Required: Contrastive Inverse Dynamics for JEPA World Models", 2026. [arXiv:2608.17542](https://arxiv.org/abs/2608.17542). Full.
15. [B15] P. Zhu et al., "Spectral-Target Physical Latent Structuring for JEPA-Style World Models", 2026. [arXiv:2609.04264](https://arxiv.org/abs/2609.04264). Full.
16. [B16] B. Terver et al., "A Lightweight Library for Energy-Based Joint-Embedding Predictive Architectures", 2026. [arXiv:2602.03604](https://arxiv.org/abs/2602.03604). Full.
17. [B17] A. Zholus et al., "RoboJEPA: Scaling Robotic Latent World Models", 2026. [arXiv:2610.10515](https://arxiv.org/abs/2610.10515). Full.
18. [B18] J. Bai and J. Xiong, "Temporal-Distance JEPA: Plan-Aware Representation Learning for Latent World Model Predictive Control", 2026. [arXiv:2607.25337](https://arxiv.org/abs/2607.25337). Full.
19. [B19] A. Chahe, S. Cai and L. Zhou, "Latent World Models with Monotone Planning Costs for Image-Goal Navigation", 2026. [arXiv:2608.09073](https://arxiv.org/abs/2608.09073). Full.
20. [B20] Y. Zhu et al., "MoRAE: Flow-Friendly Self-Supervised Latents for Text-to-Motion Generation", 2026. [arXiv:2607.29180](https://arxiv.org/abs/2607.29180). Full.
21. [B21] J. Hong, D. Dohan, R. Singh, C. Sutton and M. Zaheer, "Latent Programmer: Discrete Latent Codes for Program Synthesis", ICML 2021. [PMLR PDF](https://proceedings.mlr.press/v139/hong21a/hong21a.pdf). Full.
22. [B22] X. Chen, D. Song and Y. Tian, "Latent Execution for Neural Program Synthesis", NeurIPS 2021. [arXiv:2107.00101](https://arxiv.org/abs/2107.00101). Full.
23. [B23] Meta FAIR CodeGen Team, "CWM: An Open-Weights LLM for Research on Code Generation with World Models", 2025. [arXiv:2510.02387](https://arxiv.org/abs/2510.02387). Full.
24. [B24] B. Rahmani, "Debugging Code World Models", 2026. [arXiv:2602.07672](https://arxiv.org/abs/2602.07672). Full.
25. [B25] M. Allamanis, P. Chanthirasegaran, P. Kohli and C. Sutton, "Learning Continuous Semantic Representations of Symbolic Expressions", ICML 2017. [arXiv:1611.01423](https://arxiv.org/abs/1611.01423). Full.
26. [B26] Y. Sun, J. Liu, D. Kroening and J. Xue, "Agentic Model Checking", 2026. [arXiv:2605.21434](https://arxiv.org/abs/2605.21434). Full.
27. [B27] A. Cunha, "Verified LLM-Driven Synthesis for Concept Design", 2026. [arXiv:2607.15718](https://arxiv.org/abs/2607.15718). Full.
28. [B28] B. K. Liu, Z. P. Chen and D. P. Woodruff, "JEPA-Reasoner: Decoupling Latent Reasoning from Token Generation", 2025. [arXiv:2512.19171](https://arxiv.org/abs/2512.19171). Full.
29. [B29] H. Pan et al., "Toward Compiler World Models: Learning Latent Dynamics for Efficient Tensor Program Search", 2026. [arXiv:2606.09312](https://arxiv.org/abs/2606.09312). Full.
30. [B30] Open Interface Engineering, "Exact-proposer ladder: registered run", openIE-dev/openie-research-experiments, `rce/bench/ladder/exact-proposers/`: registration committed before the run at `3030469d`, results at `70a0a776` (pull request #21); ladder openIE-dev/rce `6d04a096`. [GitHub](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/exact-proposers). Full.
31. [B31] Open Interface Engineering, "Exact-proposer ladder on real defects: registered run", openIE-dev/openie-research-experiments, `rce/bench/ladder/real-defects/`: registration committed before the run at `64e70389`, results at `00e3b005` (pull request #22); ladder openIE-dev/rce `7dc4eded`. [GitHub](https://github.com/openIE-dev/openie-research-experiments/tree/main/rce/bench/ladder/real-defects). Full.
32. [B32] Open Interface Engineering, "Exact-proposer ladder with renames: registered run", openIE-dev/openie-research-experiments, `rce/bench/ladder/rung-e/`: registration committed before the run at `be5f370d`, results at `3a5227c2`, merged at `f76ba9d8` (pull request #23); ladder openIE-dev/rce `8a5d90ea`. [GitHub](https://github.com/openIE-dev/openie-research-experiments/tree/f76ba9d8d02d57b773afbf105333417d55f72e2c/rce/bench/ladder/rung-e). Full.
33. [B33] Open Interface Engineering, "RCE-JEPA H2, single-shot H15, and Shape D (DNULLMM1) Gear-0 on the 40 open residual tasks", registered 22 November 2026 (`rce-jepa-h15-and-shape-d-gear0-2026-11-22`, `sha256: b64c4c671ae85755...`) on `openIE-dev/rce` at commit `1762fb4b` (20 November 2026, binary `sha256: 1d3b0d07ff5b2e8f...`), Apple M5 Max dual-channel `reported_j` receipts (`measured_j = None`, `board_metered = false`). [research.openie.dev/data/](/data/#rce-jepa). Full.
34. [B34] Open Interface Engineering, "FormJEPA-v1 latent Form repair proposer, 3-Gear Cascade, and rce repair rung f criterion evaluation on the 151-task ladder and 40 residual tasks", registered 22 November 2026 (`rce-jepa-form-jepa-v1-2026-11-22`, `sha256: 22682e6e936ec120...`; `rce-repair-rung-f-wave3-eval-2026-11-22`, `sha256: 04aff4b2b44cdbea...`) on `openIE-dev/rce` at commit `1762fb4b` (Linux x86_64 binary `sha256: 5ef9931ff23a310f...`), AMD Ryzen AI Max+ 395 Linux powercap RAPL `reported_j` receipts (`measured_j = None`, `board_metered = false`). [research.openie.dev/data/](/data/#rce-jepa). Full.
35. [B35] Open Interface Engineering, "FormEBM-v2 contrastive multi-step margin latent energy scorer (H5, H11) and H15-Iterative bounded checker-feedback residual closure (40/40) with DNULLMM1 Gear-0 v2 crystallization", registered 23 November 2026 (`rce-jepa-form-ebm-v2-2026-11-23`, `sha256: 128f17e69361ea89...`; `rce-jepa-h15-iterative-2026-11-23`, `sha256: a7774d3bd03ae450...`) on `openIE-dev/rce` at commit `1762fb4b` (Linux x86_64 binary `sha256: 331464496009d98a...`), AMD Ryzen AI Max+ 395 / Radeon 8060S Linux powercap RAPL `reported_j` receipts (`measured_j = None`, `board_metered = false`). [research.openie.dev/living/rce-jepa/](/living/rce-jepa/) · [research.openie.dev/data/](/data/#rce-jepa). Full.
36. [B36] Open Interface Engineering, "FormEBM-v3 span-normalized two-head decomposed contrastive energy scorer (H5, H11, and zero-shot OOD H15 cross-span transfer)", registered 23 November 2026 (`rce-jepa-form-ebm-v3-2026-11-23`, `sha256: cb7ee1ac8dc5c594...`) on `openIE-dev/rce` at commit `1762fb4b` (Linux x86_64 binary `sha256: 386be0c26389550e...`; checkpoint `sha256: 71e642f1bb0b9c06...`), AMD Ryzen AI Max+ 395 / Radeon 8060S Linux powercap RAPL `reported_j` receipts (`measured_j = None`, `board_metered = false`). [research.openie.dev/living/rce-jepa/](/living/rce-jepa/) · [research.openie.dev/data/](/data/#rce-jepa). Full.

<div id="thesis" class="anchor-alias" aria-hidden="true"></div>

## 論題 - ソフトウェア構築は「コーディングの法則」以前の段階にある

1660年代のヨーロッパを想像せよ。ケプラーは *Astronomia nova* (1609) において惑星運動の二つの規則を、*Harmonice mundi* (1619) において三つ目の規則を公表した [T4]。ガリレオとホイヘンスは運動に関する仮説から検証可能な結論を導いた [T5, Sec. 1]。砲手、製粉工、造船工は経験則と長期の徒弟制度により技術を習得した。天空は二千年にわたり細心の注意を払って観測されてきたが、予測はまだパッチワークであった。ジョージ・スミスの記述によれば、ニュートンは「惑星軌道を計算する七つの異なる手法に概ね同等の精度で精通していた」そして計算された位置は「時に月の幅の四分の一ほどずれることがあった」 [T5, Sec. 2]。多くの優れた表が存在したが、なぜそれらが機能するのかを説明する単一の説明はなかった。

そして1687年に *Principia* が登場した。運動の公理数個と逆二乗の力一つから、事前に計算可能な軌道、砲が鋳造される前に算出できる費用、そして誤差が不運ではなく新たな天体を指し示すような結果が得られた。スミスは変化を次のように要約している：*Principia* の後、「物理理論が観測に対して優位性を獲得し、世界に関する具体的な質問に答える手段となった」 [T5, Sec. 1]。ガリレオの等重力に関する結果は消えなかった；それらは逆二乗重力の極限ケースとなり、理論はケプラーの法則からの惑星の偏差を説明し続けた [T5, Secs. 1 and 2]。

前提、平易な言葉で言えば：**ソフトウェア構築の実践、すなわち現在の大規模言語モデルによる AI 支援コーディングを含むものは、"コーディングの法則"以前の段階にある**。ここで「ソフトウェア構築の実践」とは、経験的試行、テスト、レビューによってコードを生成する人間の開発者とコード生成モデルの両者を指し、形式的な規則集合からの導出によるものではない。その実践は今日でも 1660 年代に生きている。観測が慎重に行われている例として、Section 4 で使用される pass@k（k 個のサンプルプログラムのうち少なくとも一つがテストに合格する確率）や、Section 3 で使用される SWE-bench Verified（レビュー済みリポジトリ課題の集合）がある。実践は技巧を伴う：プロンプトの文言、リトライ、試行錯誤である。コード生成モデルの出力は確率分布からのサンプルであるため、同じ要求でも翌日には異なるプログラムが得られる。ChatGPT（デフォルト温度の gpt-3.5-turbo）に同じコーディング質問を 5 回尋ねたところ、3 つのデータセットにわたる問題の 47.56% から 75.76% で、すべての 5 つの回答が同一の出力を示すテストは存在しなかった。また「温度を 0 に設定してもコード生成の決定性は保証されない」（Ouyang et al., 2023, abstract）。人間側が示す規則性は、Lehman の言葉を借りれば「人や組織の習慣と実践から生じる」もの[ T6, Sec. V-A, p. 1069 ]である。Hoare と同僚は 1987 年に同じギャップを指摘している：「プログラミングの法則とは何か、すなわちソフトウェア工学という職業の形式的基盤を提供するものは何か？ 多くのプログラマは単一の法則すら引用できない」[ T7, p. 673 ]。Dijkstra はすでに実践が依拠する経験的手法の限界を指摘している：「プログラムテストはバグの存在を示す非常に効果的な手段だが、その不在を示すには全く不十分である」[ T8, Argument three ]。プログラムに対して合意された保存量は存在せず、コード生成器が従う運動方程式もなく、コストは作業開始前に計算されるのではなく、トークン数や電力消費という事後的な指標で測定される。

「コーディングの法則」は、以下の他の三層とともに定義される技巧層の名称である。ここで示す RCE-JEPA 提案は、仮説として、この技巧層が下位層から借用することで、生成するコードの振る舞いとコストを実行前に計算可能な少数の規則を獲得できるとするものである。候補は (L1) 決定的遷移規則、(L2) 遷移あたりの情報とエネルギーの記述、(L3) すべてのプログラムに対する標準形、すなわち圧縮、そして (L4) プログラムが結合されたときに L1 から L3 が保持される合成規則である。[Reality Code Engine (RCE)](/about/rce/) は各候補を提案し、仮説 H1 から H15 はテストであり、Section 8 以下の 1 つの表に数値順で示されている。本節の記述は、数値と出典が付いていない限り、測定結果を示すものではない。

類推には限界があることをここに示す。ニュートンは誰も設計しなかった世界を記述したが、プログラムは人間によって作られるため、その規則は発見されたものではなく、部分的に選択されたものである。力学は連続量とエネルギーの厳密な保存を持つが、プログラムの状態は離散的かつ有限であり、チップが消費するエネルギーはハードウェアに依存し、プログラムだけで決まるわけではない。Rice の定理 [T3] は、任意のプログラムが計算する内容に対する非自明な性質を決定する一般手続きは存在しないことを述べており、停止問題 [T9] はその最もよく知られた例である。RCE は、プログラムが終了境界を持つ制限された言語で動作することによりこれらの限界を回避するが、その制限は表現可能な範囲に代償を伴う。最後に、*Principia* でさえ「時計仕掛けの宇宙」ではなかったことが指摘されている。Smith はその側面が「ラプラスによって付加された」ことを述べている [T5, Sec. 1]。運動の公理だけでは機械論のすべての問題を解決できず、点質量でない物体については「さらに原理を補足しなければならない」ことが示されている [T5, Sec. 5]。また「ニュートン理論は限定された状況において高い近似でしか成り立たない」ことが現在では認識されている [T5, Sec. 1]。したがって、この主張は類推であり、同等性ではない。

<div id="not-yet" class="anchor-alias" aria-hidden="true"></div>

### 理論から技芸に至る四層の法則

四つのフレーズはぼやけやすく、このページではそれらを分離して示す。各フレーズは理論から科学、芸術へと続く異なる層を指し、現在はそれぞれ異なる程度に形式化されている。ここでは決して互換的に使用しない。

![A spectrum from theory to art with four separate layers: "Laws of Computation", "Laws of Programming Languages", "Laws of Programming" and "Laws of Coding", each with its question, its representative work and how formalized it is today, and RCE-JEPA drawn as a bridge across the layers rather than a merger](/figures/rce-jepa/layers.svg)

*Figure 3. The spectrum. Left to right: "Laws of Computation" (theory), "Laws of Programming Languages" and "Laws of Programming" (science), "Laws of Coding" (art). The bar under each layer shows how formalized it is today, a qualitative judgement explained in the table below. RCE-JEPA is drawn as a bridge that carries evidence between layers; it does not merge them. A qualitative diagram, not data..*

| Layer | Definition | Who works on it | How formalized today |
| --- | --- | --- | --- |
| "Laws of Computation" | 物理的・情報的限界：何が計算可能であるか、情報・時間・エネルギーのコストはどれだけか。 | Shannon [T10]; Landauer [T11]; Bennett and Landauer [T12, T13]; Turing [T9] and Rice [T3]; Lloyd [T14]; Wolpert [T15]; Carette, James and Sabry [T16]. | 限界に関する正確な定理：ビット単位の情報、消去限界 $k_BT\ln 2$、非決定性。特定のプログラムが特定の機械上で要するコストを予測する統一的説明は未だなく、Bennett と Landauer はその限界が「現代技術の実際の限界からは途方もなく遠い」[T13, p. 48] と指摘している。 |
| "Laws of Programming Languages" | セマンティクスと型理論：言語のプログラムが何を意味するかを決定する規則。 | Hoare の公理的セマンティクス [T17]; Milner [T18]; Harel [T19]; Lamport [T20]; Berry and Gonthier [T21]; Halbwachs et al. [T22]; Leroy の検証コンパイラと Letouzey の抽出（以下セクション1）。 | 一部の言語とコンパイラについては完全に形式化され、CompCert で機械検証されている（以下セクション1）。形式的意味は言語が設計上持つべき性質であり、すべての言語が持つわけではない。 |
| "Laws of Programming" | 正しいプログラム構築の代数的法則：プログラムを変換・導出するための方程式。 | Hoare, Hayes, He, Morgan, Roscoe, Sanders, Sorensen, Spivey and Sufrin [T7]; Dijkstra のプログラム導出と Bird のリスト演算（以下セクション1）。 | 小規模言語に対して約百の法則が存在する [T7]; しかし著者自身は「現代技術が要求する規模の正しく効率的なプログラム設計に直接適用するにはまだ遠い」[T7, p. 686] と述べている。 |
| "Laws of Coding" | 人間またはモデルが動作するコードを生成する経験的な技術。現在 AI コーディングが位置する領域。 | Brooks [T23]; Lehman [T6]; Hindle et al. [T24]; 以下セクション3 の報告。 | 経験的な規則性とベンチマークはあるが法則は存在しない。AI コーダの出力はサンプルであるため、同一の要求でも異なるプログラムが生成され得る（上記 Ouyang et al., 2023）。 |

**RCE-JEPA と層の関係**。RCE-JEPA は統合ではなく橋渡しである。これは「符号化の法則」層で動作し、学習モデルがコードを提案し、各提案を下位層に結びつける：Form は固定された意味（「プログラミング言語の法則」）を持ち、受容された Form は明示された規則（「プログラミングの法則」）によって変換可能であり、そのコストは物理的限界（「計算の法則」）に対して会計される；RCE はそのコストを今日、整数単位でカウントするが、単位はジュールではない。以下の各仮説はテスト対象となる層を名前で示す。橋が成立すれば、技術は科学と理論から借用した規則を得るが、層は依然として区別されたままである。

力学にはその *Principia* がある。計算にはまだない。上記の「計算の法則」の項目は正確であるが、ケプラーとガリレオの規則性を結びつけた *Principia* のように、振る舞いとコストを同時に予測する単一の形式的説明にはまだ統合されていない。これは未解決の問題として提示されており、解決済みではない。

そのギャップにあるものは、先人たちの失敗ではない。各時代はその機械、情報理論、そしてプログラムの構築と最適化の技術が許す範囲で最善を尽くした。以下のタイムラインは、各時代が利用できたものを示し、出典からの数値と達成した成果を記す。

![Timeline in five eras from the 1940s to today, each with three lanes: hardware, information theory, and applied computer science for building and optimizing algorithms, showing sourced hardware figures and landmark results, ending with the open question of "Laws of Computation"](/figures/rce-jepa/eras.svg)

*図 4. 「計算の法則」へ向かう道の上の五つの時代。上段：ハードウェア、下の表の出典からの数値。中段：情報理論。下段：アルゴリズムの開発と最適化のための応用コンピュータ科学（コンパイラ、計算複雑性、合成、検証）。右側のボックスは未解決の質問である：統一された「計算の法則」。歴史的図であり、データではない。*

| 時代 | ハードウェア（メモリ、演算、エネルギー） | 情報理論 | アルゴリズムのための応用コンピュータ科学 | 可能にしたこと、そして止まった点 |
| --- | --- | --- | --- | --- |
| 1940年代から1950年代 | メモリが「通常は小さすぎる」そして「通常は遅すぎる」単一コピー機 [T8]。IBM 704 上では、47文の FORTRAN (FORmula TRANslation) プログラムが「6 分でコンパイルされ、約 1000 命令を生成した」[T25, PDF p. 2]。 | Shannon (1948) は情報を測定可能な量とし、"通信の根本的問題は、ある点で別の点で選択されたメッセージを正確にあるいは近似的に再現することである" と述べた [T10, Introduction, p. 1]。 | 最初の最適化コンパイラ [T25]。 | 数式から機械語への変換が自動化された。すべての命令とメモリワードが高価であったため、プログラムを機械に詰め込む努力が行われた、と Dijkstra が回想している [T8]。 |
| 1960年代 | IBM System/360 の 4 つのモデル (1964) は、メモリ容量が 16 倍、性能が 50 倍の差がありながら、同一の命令セットを共有した [T26]。 | Landauer (1961) は情報の消去を熱に結び付けた [T11]。Solomonoff、Kolmogorov、Chaitin は複雑性を最短記述として定義した [T27, T28, T29]。 | Hoare の公理的基礎によりプログラムの正当性を証明 (1969) [T17]。 | 正当性と情報は紙上で正確な定義を得た。Dijkstra (1972) は「利用可能な機械の性能が千倍以上に向上したのに比例して、社会のこれらの機械を適用しようとする野望も拡大した」[T8] と述べ、ソフトウェア危機が続いた。 |
| 1970年代から1980年代 | Alto (1973): 4,096 ワード・32 ビットの書き換え可能制御ストア; VAX-11/780 (1977): 5,120 ワード・96 ビットの制御ストア; Moore の 1975 年の予測はトランジスタ密度が 2 年ごとに倍増すると示した [T26]。 | Bennett (1973) は汎用計算機が「各ステップで論理的に可逆にでき、かつその単純さと汎用計算能力を保持できる」ことを示した [T30, abstract, p. 525]。Bennett と Landauer (1985) は物理的限界を提示した [T13]。 | Brooks (1986) は本質的複雑性と偶発的複雑性を分離した [T23]。Hoare と 8 人の共著者はプログラミング言語に対してほぼ百の代数的法則を示した [T7]。Lehman はソフトウェア進化の経験的法則を述べた [T6]。 | プログラムは代数的対象となった。Hoare らは残された距離について率直に述べている。「我々は依然として、現代技術が要求する規模で正しく効率的なプログラム設計にそれらを直接適用する方法を知るには遠い」[T7, p. 686]。 |
| 1990年代から2000年代 | 命令レベルの並列性と高速トランジスタにより、1986年から約2002年まで年率約50%の性能向上が得られた[T26]。 | Lloyd (2000) はエネルギーで秒当たりの演算数に上限を設定した[T14]。 | McKee (1995) は計算の基本法則を提案した[T31]；機械検証されたコンパイラとカーネル、CompCert と seL4（以下セクション1） | 証明は実システムに到達したが、代償が伴った：seL4 の証明には約20人年を要した（以下セクション1）。 |
| 2010年代から現在 | Dennard scaling は 2012 年までにほぼ消滅した；32KB キャッシュアクセスは 32ビット加算の約200倍のエネルギーを要し、オフチップ DRAM（動的ランダムアクセスメモリ）は最終レベルキャッシュアクセスの約10倍である；Google の TPU（Tensor Processing Unit）v1 は 24 メガバイトのローカルメモリを備え、1 サイクルあたり 256×256 の乗算累積を実行し、ワークロードに対して CPU のエネルギー効率の 80 倍以上を達成した[T26]。65 億パラメータの言語モデルは出力トークンあたり約 3〜4 ジュールを使用した（Samsi et al., 以下セクション4）。 | Wolpert の計算の確率的熱力学[T15]；予測が言語モデルに対して圧縮と等価であることが示された[T32]；Carette、James、Sabry は情報保存に基づく計算モデルを再構築した[T16]。 | 学習されたコードジェネレータ；モデルと検証者のループ；決定論的シミュレーションテスト（以下の見解者を参照）。 | 提案者が安価で多数存在する領域では検証は低コストかつ正確である。ハードウェア向けに書き換えられた Python 行列乗算は「62,000 倍以上高速」だった[T26]：プログラムと機械の距離は現在大きく、測定可能で、縮める価値がある。 |

**なぜ現在進歩が可能なのか（意見、検証予定）**　三つの要素が同時に揃っていなかった過去とは異なり、今日ではそれらがすべて利用可能である。実システムに対する機械検証器が存在するため、規則は期待に留まらず実際に強制できる。学習済みモデルは数千件の候補プログラムを提案できるため、規則を満たすプログラムの探索が実行可能である。また、エネルギーは一般的なハードウェア上のカウンタから測定できるため、コストは予測に対して測定でき、推測に頼る必要がない。各過去の時代はこの三つのうち少なくとも一つを欠いていた。これらが「計算の法則」を必然的にするわけではなく、むしろそれらを検証可能にし、以下の仮説の目的となる。

<div id="symbols-used-in-this-section" class="anchor-alias" aria-hidden="true"></div>

### 本節で使用される記号

- $P=(S,E,\delta,D,\lambda)$: 関数的状態機械としてのプログラム。$S$ は有限の状態集合；$E$ は有限のイベント（入力）集合；$\delta: S\times E\to S$ は遷移関数；$D$ は純粋関数によって状態から計算される導出値の集合；$\lambda: S\times E\to O$ は有限出力集合 $O$ への出力関数。
- $\Omega_n$: サイズが $n$ 記号以下の正規形集合。正規形は RCE（第8節）においてチェッカーが受理するプログラムの正規表現である。
- $X$: 表層プログラム（人間やモデルが記述するテキスト）の集合。$\kappa: X\to\Omega$: 表層プログラムから正規形への正規化写像。
- $H(\cdot)$: ビット単位のシャノンエントロピー [T10]。$K(x)$: コルモゴロフ複雑度、固定された汎用機上で $x$ を出力する最短プログラムのビット長 [T27, T28]。
- $k_B=1.380649\times10^{-23}\ \mathrm{J\,K^{-1}}$: ボルツマン定数。$T$: ケルビン (K) 単位の温度。J: ジュール。
- JEPA: Joint Embedding Predictive Architecture [LeCun 2022, cited above]。MDL: 最小記述長 [T33]。EBM: エネルギーベースモデル。

<div id="part-1-computation-as-a-finite-information-system" class="anchor-alias" aria-hidden="true"></div>

### Part 1. 有限情報システムとしての計算

プログラムから構文、コメント、インデント、作者の習慣を取り除くと、残るのは一度に一つのイベントで次の状態へ遷移する機械である。その機械は有限であり、有限なものは数えることができる。

**定義.** プログラムは決定的関数的状態機械 $P=(S,E,\delta,D,\lambda)$ であり、$S$ と $E$ が有限で、$\delta$ が全関数である。決定性とは $\delta$ が関係ではなく関数であることを意味し、すなわち一つの状態と一つのイベントがちょうど一つの次状態を与える。

**情報量の上限.** 任意の分布によって $\Omega_n$ から Form が抽出される場合、そのエントロピーは一様分布のエントロピー以下である。すなわち $n$ の結果について「すべての p<sub>i</sub> が等しいとき H は最大となり log n に等しい」[T10, Sec. 6, property 2, p. 11]：

$$H(P)\;\le\;\log_2\lvert\Omega_n\rvert\ \text{bits}.$$

アルファベットが $a$ 記号からなるとき、$\lvert\Omega_n\rvert\le\sum_{k\le n}a^k$ であり、したがって $H(P)\le n\log_2 a+1$ ビットである。いかに長い振る舞いであっても、すべての Form は有限なメッセージである。

**圧縮と理解.** Kolmogorov 複雑度 $K(x)$ [T27, T28] は対象の最短記述長を測る。Kolmogorov は対象 y の「相対的複雑度」を「x から y を得るための ‘プログラム’ p の長さ l(p) の最小値」[T28, Sec. 3, p. 165] と定義し、Solomonoff の帰納 [T27] と Rissanen の MDL [T33] は「最短記述を好む」ことを予測とモデル選択の規則に変換する。学習への橋渡しは Shannon の情報源符号定理 [T10, Sec. 9, Theorem 9, p. 16] である：良い符号は $-\log_2 p(x)$ ビットを $x$ に費やす（Shannon の第二の証明は確率 $p_s$ のメッセージに対し $m_s$ バイナリ桁の符号を $\log_2(1/p_s)\le m_s<1+\log_2(1/p_s)$ で与える [T10, Sec. 9, p. 17]）ので、より良い予測器はより良い圧縮器である。Delétang らは直接次のように述べている。「データの対数尤度を最大化することは、メッセージあたりに必要なビット数を最小化することに等価である」[T32, Sec. 1]。$K$ 自体は計算不可能である：Kolmogorov は条件付き複雑度は「すべての x と y に対して有限であることが知られていても、（一般に再帰的に）有効に計算できない」ことを指摘し [T28, Sec. 3, p. 165]、Schmidhuber は「任意のデータを計算する最短プログラムを見つける一般的な方法は存在しない」ことを述べている [T34, Sec. 1]。標準的な Form を持つ制限された言語では、Form の長さは $K$ の計算可能な上界であり、定数項を加えた形で与えられる。

<div id="part-2-compression-into-form-and-template" class="anchor-alias" aria-hidden="true"></div>

### Part 2. FormおよびテンプレートへのFormへの圧縮

百人のプログラマにショッピングカートを書かせれば、百通りのプログラムが得られるだろう。その背後には、三、四程度のアイデアが潜んでいるかもしれない。表層は群衆であり、Form はそれが共有する顔である。

**Equivalence classes.** $x\sim y \iff \kappa(x)=\kappa(y)$ を定義する。各 Form $f\in\Omega$ は、$[f]=\kappa^{-1}(f)$ の代表であり、$m_f=\lvert[f]\rvert$ 表層プログラムのクラスである。$\kappa$ が関数であるため、エントロピーの連鎖律、$H(x,y)=H(x)+H_x(y)$ [T10, Sec. 6, property 5, p. 12] により

$$H(X)\;=\;H(\kappa(X))\;+\;H\big(X\mid\kappa(X)\big).$$

Form を表層テキストではなく出力する予測器は第二項を省くことができる。クラス内の表層変種が等確率である場合、1 つの Form あたりの節約は

$$\Delta H_f=\log_2 m_f\ \text{bits},\qquad \rho_f=\frac{\lvert x\rvert}{\lvert f\rvert}\quad(\text{bytes of surface code per byte of Form}).$$

このため、予測器は商空間 $X/\!\sim\;\cong\;\Omega$ 上で動作する。すなわち、より小さく、よりクリーンなターゲットを学習し、その中のすべての点はチェッカが判定できる対象となる。

**Templates as low-dimensional manifolds.** テンプレートまたはノーコードスキーマは、穴を持つ Form である。テンプレートが $h$ 個の穴を持ち、各穴が $v$ 個の値のいずれかを取る場合、$v^h$ 個の Form をカバーし、通常は $\log_2\lvert\Omega_n\rvert$ よりはるかに少ない $h\log_2 v$ ビットで表現できる。プログラム空間は広大であるが、実際に人々が欲するプログラムはその中の薄いシート上に存在する。このことは、コードが自然言語よりも予測しやすいという観測 [T24] および「意味的に類似したオブジェクトが近いベクトルにマッピングされる」ことを示す学習済みコード埋め込み [T35, Sec. 1] と整合する仮説である。

**Corpus measurements.** H1 は手書きプログラム集合に対して下限を公表している。185 個のプログラムに対する $\rho$ = b(code)/b(P) の中央値は 9.34 であり、生成された Python に対して 5 の閾値を上回っている。実行は測定前に登録された。上記提案者のデータ節では四分位範囲、バージョン 1 の図として 173 個のプログラムに対する 9.31、圧縮記述チェックが示されている。リフトコーパスに対する節約 $\Delta H$ はまだ計画中である。そのコーパスはリフトパイプラインが公開されるまで空である。9.34 の数値は手書きプログラムに対する測定下限であり、リフトまたはモデル生成プログラムの測定値ではない。

<div id="part-3-kinematics-a-newtonian-form-of-computing" class="anchor-alias" aria-hidden="true"></div>

### Part 3. 運動学 - 計算のニュートン的形式

石を投げると、開始位置、速度、加わる力が分かれば、ニュートンは着地点を教えてくれる。決定論的プログラムも同様の性質を持ち、より厳密に言えば、空気も風もなく、世界の丸めがない。開始位置と到来するイベントが分かれば、その全未来は固定される。

**Trajectory.** 初期状態 $s_0$ とイベントストリーム $e_0,e_1,\dots,e_{T-1}$ に対して，

$$s_{t+1}=\delta(s_t,e_t),\qquad t=0,\dots,T-1.$$

本稿で提案する対応は、以下の類推である。

- 状態 $s_t$ は位置の役割を果たす；
- イベント $e_t$ は加えられたインパルスの役割を果たす；
- $\delta$ は運動方程式の役割を果たす；
- イベントログは軌道を正確に再生できる記録であり、$\delta$ が情報を破棄しても記録内での可逆性を示す；ベネットは「入力のコピーを保存できる限り、任意の決定論的計算を論理的に可逆なステップの列として再プログラムすることが可能である」ことを示した [T12]；
- ステップ数または燃料 $t$ は時間の役割を果たす；
- ジュール単位の遷移あたりエネルギーがコストである。

**Energy floor.** ランドアウアは、論理的不可逆性は「物理的不可逆性に結びつき、機械サイクルあたり最小の熱生成を必要とし、通常は各不可逆関数につき kT 程度である」[T11, abstract, p. 183] と論じた；ビットをリセットするとエントロピーが k logₑ 2 だけ減少し、周囲に「0.6931 kT per restored bit」を供給する [T11, Sec. 4, p. 187]。ベネットが後に再表現したランドアウアの原理は、消去のような論理的不可逆操作は「環境に対応するエントロピー増加を伴わなければならない」ことを示す [T12, abstract]。消去されたビットあたりの下限は

$$E_{\min}=k_B T\ln 2\approx 2.87\times10^{-21}\ \mathrm{J}\quad\text{at } T=300\ \mathrm{K}.$$

遷移 $t$ が $b_t$ ビットを消去するなら、$E_{\text{total}}\ge k_B T\ln 2\sum_t b_t$。ロイドは速度の上限を付加し、「物理装置が情報を処理できる速度はエネルギーによって制限される」[T14, abstract] とし、エネルギー $E$ に対して最大 $2E/\pi\hbar$ 操作/秒であり、$\hbar=1.0546\times10^{-34}\ \mathrm{J\,s}$ は縮小プランク定数である。実際のチップは操作あたりのランドアウア下限より何桁も上回るエネルギーを消費している；RCE プロジェクトは執筆時点で測定されたジュール/操作の数値を持たず、H9（以下第 8 節）は計測計画である。コルモゴロフは 1965 年にコスト次元の欠如を指摘し、彼の複雑性測度は「対象 x から対象 y へ移行するプログラム p の ‘困難さ’ を考慮しない」[T28, Sec. 4, p. 167] とした。ウルフェルトはボイドを引用し、「同一計算（入力から出力）でも実装が異なれば熱力学的結果が根本的に異なる」ことを警告している [T15, Sec. I.B]：エネルギーはプログラムと機械の両方に属する。

**Definition (kinematic program).** $P$ は、すべての $s_0$ とすべての有限イベントストリームに対して

$$\text{(i)}\ \operatorname{Var}[s_T]=0,\qquad \text{(ii)}\ E_{\text{total}}=\sum_{t=0}^{T-1}c(s_t,e_t)\ \le\ c_{\max}\,F$$

機械が示すエネルギー表が $c: S\times E\to\mathbb{R}_{\ge0}$ であり、$c_{\max}$ がその最大項目、$F$ が終了証明から得られる燃料上限（最大ステップ数）である。条件 (i) は軌道の分散がゼロであることを示し、条件 (ii) はそのコストが実行前に計算可能、あるいは少なくとも上界が求められることを示す。RCE の独自コスト表は仕様書の付録 C.6.4 にあり、単位は整数でありジュールではない。ジュール単位で機械ごとの表を示すものは仕様リポジトリ内の提案であり、H9 がそのテストである。

**対照.** 確率的生成器はパラメータ $\theta$ を持つモデルからサンプル $x\sim p_\theta(x\mid\text{prompt})$ を返す。その出力は分布であり、正確性は確率で表され、コストはサンプリング後にのみ判明する。RCE-JEPA は生成器を確率的に保ちつつ、生成物を運動学的にし、両者の間に決定的チェッカーを配置する。

<div id="part-4-a-world-model-whose-physics-is-known-exactly" class="anchor-alias" aria-hidden="true"></div>

### Part 4. 物理法則が正確に既知である世界モデル

ほとんどの世界モデルは霧の中で構築されている。ロボットはぼやけたカメラから物理を学習し、ゲームエージェントは読めない規則を推測する。コードは規則が書き下ろされている稀少な世界である。

**World model.** JEPA の意味において [LeCun 2022, cited above]、世界モデルは現在の潜在表現 $z_{t+1}=\mathrm{enc}(s_{t+1})$ と行動 $a_t$ から次の潜在表現 $\hat z_{t+1}=g_\phi(z_t,a_t)$ を予測する予測器であり、学習されたパラメータ $\phi$ を持つ。コードにおいて世界は Form の状態空間であり、行動はイベントであるので、ターゲットは $\delta$ によって正確に計算される。

$$\mathcal{L}(\phi)=\mathbb{E}\,\big\lVert g_\phi\big(\mathrm{enc}(s_t),e_t\big)-\mathrm{enc}\big(\delta(s_t,e_t)\big)\big\rVert^2 .$$

ターゲットには aleatoric（不可減）ノイズが存在しない。MuZero は「先読み計画アルゴリズムはすべて環境のダイナミクス、例えばゲームの規則や正確なシミュレータの知識に依存している」という観察から出発し、代わりにモデルを学習する [T1, Sec. 1]。コードに対しては、その規則は $\delta$ であり、完全に利用可能である。

**Contrast with models that learn the physics.** CWM、すなわち Code World Model [B23] は、Python 実行トレースとエージェント軌跡上で中間訓練されたデコーダである。その報告におけるトレース予測は学習されたインタプリタであり、著者らはそれを「第一歩」と呼び、ニューラルデバッガは将来の課題として残している。V-JEPA 2 [B1] はビデオから物理を学習し、報告された要約では 62 時間のロボットビデオを含み、行動条件付き予測器は 62 時間未満のラベルなしロボットビデオを使用する。そのモデル予測制御は行動あたり約 16 秒かかった。Form において $\delta$ は物理であり、正確であるため、適合すべき aleatoric ノイズは存在しない。提案者がまだ学習しなければならないことは以下のセクション 7 に示されている：Form への意図、探索ガイダンス、およびはしごが閉じない残差である。

**Intent decoding as an inverse problem.** 意図 $I$ が制約として与えられたとき、その意図を満たす軌跡を持つ Form を見つける。これはエネルギーベースモデルの意味でエネルギー最小化として記述される [T36, T2]：

$$\mathcal{E}(I,f)=\alpha\,V(f)+\beta\,d\big(\tau(f),\sigma(I)\big)+\gamma\,C(f),\qquad z^\star=\arg\min_{z}\ \mathcal{E}\big(I,\mathrm{dec}(z)\big).$$

ここで $V(f)$ はチェッカー違反の数（次元なし）; $\tau(f)$ は意図の例示イベント上の $f$ の軌跡集合; $\sigma(I)$ は意図が要求する軌跡; $d$ はそれらの間の距離（次元なしの不一致状態数）; $C(f)$ は走行あたりの予測エネルギー（ジュール）; $\alpha,\beta\ge0$ は次元なしの重みであり $\gamma\ge0$ は $\mathrm{J}^{-1}$ にある; $\mathrm{dec}$ は潜在点から Form へのデコーダである。最小化子はデコードされ、次にチェックされる。チェッカーは $\mathcal{E}$ ではなく、受容を決定する。Du と Mordatch は「二つ以上のエネルギーの総和はそれらすべての目標または制約を満たすことに対応する」[T36, Sec. 1] と観察し、これが三つの項を加えることができる理由である。LeCun らは注意を付け加える：「二つの、別々に訓練されたエネルギーベースモデルを組み合わせることは簡単ではない。エネルギー尺度が事前に一致する保証はない」[T2, Sec. 1.3, p. 6]。したがって重み $\alpha,\beta,\gamma$ は校正される必要があり、実験ごとに報告される。

<div id="part-5-consequences-as-testable-predictions" class="anchor-alias" aria-hidden="true"></div>

### Part 5. 検証可能な予測としての帰結

勝てない論文は論文ではない。上記の各部分は、それが誤りであることを証明できるテストに対応している。

- 部分 1 と T2（Form への圧縮）は H1、H3、H10 によってテストされる。
- 部分 3（運動学、エネルギー会計）は H2、H4、H8、H9 によってテストされる。
- 部分 4（世界モデル、逆問題）は H5 から H7 によってテストされる。
- 提案者は H11 から H13 によって、H14 が測定する決定的ラダーの残差上でテストされる。H15 はその残差上で提案者クラスを比較し、未完了である。すべての十五の仮説は、指標と閾値とともに、数値順に Section 8 以下の 1 つの表にまとめられている。

![Three panels: a large cloud of surface programs; arrows collapse it onto a thin curved sheet of canonical Forms with the entropy saving log2 m bits; a trajectory of states s0 to s4 under the transition function delta, each step annotated with energy in joules and a total bounded by the fuel bound](/figures/rce-jepa/thesis.svg)

*図 5. 情報と運動学。左: プログラム空間で、多くの表層プログラム X が同一の振る舞いを表す。中: 正準化 κ が各クラスを低次元多様体 Ω 上の 1 つの Form に収束させ、m 個の等確率変種からなるクラスで ΔH = log2 m ビットを節約する。右: Form が決定的に移動し、s(t+1) = δ(s(t), e(t))、各遷移はエネルギー c（ジュール）を伴い、総エネルギーは実行前に c_max·F で上限付けられる。概念図であり、データではない。*

<div id="chain" class="anchor-alias" aria-hidden="true"></div>

### 証明可能な連鎖 - 仮説、層、証拠

「Laws of Coding」に関する主張は、最も弱いリンクの強さに等しい。各仮説について、法則の四層のうちどれをテストするかを示す表名が続き、実装の三層、すなわちアルゴリズム（Form の数学と予測子）、ソフトウェア環境（チェッカー、コーパス、ハーネス）およびハードウェア（機械とそのメーター）へと引き継がれる。各リンクは四つのラベルのいずれかを持つ。**[C] 引用文献:** 公開された結果で、台帳に記載されたとおりに読む。**[M] 測定データ:** OpenIE の著者が実行前に登録した実行で測定した数値で、公開リポジトリにソースがある。**[X] 測定、しかし支持なし:** 登録された測定で、結果が仮説を意図したとおりに支持しない。**[P] 計画実験:** まだ実行されていないテスト。部分的に測定されたリンクは [M] と [P] の両方を持つ。測定リンクを持つ仮説は四つであり、ページ末尾の Status セクションで報告されている。H15 には測定リンクがない。四つは、Form コーパスの手書きプログラムに対する H1（提案者上部のデータセクション参照）、その fuzzed アームのみを対象とする H7、六つのターゲットに対する H8、そして登録されたルール（以下第 8 節）により [B30, B31, B32] の三つの登録実行が支持する H14 である。測定リンクは、登録実行が存在し何を見つけたかを記録するものであり、単独で支持の判定を行うものではない。チェーンは残りのすべての [P] を [M] または [X] に変換する計画であり、任意の [P] が依然としてそれを破壊し得る。

![Grid of fourteen hypotheses H1 to H14 against three layers, algorithm, software environment and hardware; each cell coloured by evidence type: cited literature, measured data, measured but not supported, planned experiment, or not applicable. At the software layer H1 and H7 carry measured data alongside planned experiments, H8 and H14 carry measured data; at the hardware layer H8 carries cited literature and measured data](/figures/rce-jepa/chain.svg)

*Figure 6. 「Laws of Coding」の証明可能なチェーン。行: 仮説 H1 から H14、各々がテストする法則の層でタグ付けされる。H15 は図に描かれていない。表は計画作業として追加され、測定リンクはない。列: 実装層、アルゴリズム、ソフトウェア環境、ハードウェア。青: 引用文献。緑: 測定データ。朱: 測定、しかし支持なし。橙: 計画実験。灰: 該当なし。以下の表は各セルの内容とソースを示す。*

| ID | 仮説 | 試験された法則層 | アルゴリズム | ソフトウェア環境 | ハードウェア |
| --- | --- | --- | --- | --- | --- |
| H1 | Form がソースよりはるかに小さい | "Laws of Programming Languages" (canonical meaning) and "Laws of Coding" | [C] チェーン則: Form を予測することで $H(X\mid\kappa(X))$ ビット節約 [T10] | [M] 185 の手書きプログラムからなる Form コーパスに対し、発行された Python と比較した 9.34 の中央値 $\rho$、閾値 5 を上回り、実行前に登録された（提案者上部のデータセクション）。 [P] $\rho$ は lift コーパス上の標準シリアライズに対して、lift パイプラインが公開されるまで空である | 該当なし（ビット数のカウント） |
| H2 | 生成に比べてチェッカーが低コスト | "Laws of Programming Languages" | [C] 結果の検証はジェネレータの証明よりも容易である場合がある: CompCert のレジスタ割り当て (Leroy, Section 4 below) | [P] チェッカーの実時間と候補ごとのサイクル数 | [P] $C_{\text{check}}/E_{\text{model}}$ ジュール（特定メーター上） |
| H3 | 潜在的予測が有用な受容に達する | "Laws of Coding" | [C] 表現空間における予測 (I-JEPA と V-JEPA 2, Section 4 below; LLM-JEPA, Huang, LeCun and Balestriero, Section 5 below) | [P] 未使用の intent-to-Form タスクに対する pass@1 | 該当なし |
| H4 | 受理されたプログラムあたりのエネルギーが低下する | "Laws of Computation" | [C] ランドアウアの下限 $k_BT\ln 2$ ビット削除あたり [T11, T12] | [P] $J_{\text{acc}}$ 両アームを単一ハーネスで | [C] 65B モデルでトークンあたり約 3〜4 J (Samsi et al.)；メモリアクセスが演算を支配する [T26]。 [P] デバイスメーター、アイドル分を差し引く |
| H5 | エネルギー順位は有効な Form を優先する | "Laws of Coding" | [C] エネルギーは制約を組み合わせるために加算される [T36] | [P] 受理されたものに対するエネルギーの AUROC、変更が必要なものと比較 | 該当なし |
| H6 | リファレンスアプリはエンコード可能である | "Laws of Programming Languages" | [C] 非自明なセマンティック特性を決定する一般手続きは存在しない [T9, T3]、したがって制限言語である | [P] 7/7 のリファレンスアプリがチェックされた Form として | [P] 同一 Form を複数マシンでリプレイ（H8 と共に） |
| H7 | セキュリティはモデルに依存しない | "Laws of Programming Languages" | [C] 約 6 CPU 年後、Csmith は CompCert において誤コードエラーを検出しなかった (Yang et al., Section 4 below) | [M] ファズされたアーム: 2 回の実行で 1,275 のチェッカー受理ミュータントに対し、5 つの規定不変条件の違反は 0 件、各実行は実行前に登録された (`rce/bench/adversarial/`)。 [P] モデル生成の敵対的 Form、まだ存在しないアーム | [C] 投機的実行のサイドチャネルは命令セットのセマンティクスの範囲外である [T26]；Form の範囲外であると明記 |
| H8 | 決定性 | 「プログラミング言語の法則」および「計算の法則」 | [C] 任意の決定的計算は、入力のコピーがあれば論理的に可逆にできる [T12] | [M] ビット同一のリプレイ、10,500 のシード付きイベントストリーム、参照と0 行の不一致、実行前に登録、(`rce/bench/determinism/`) | [C] 割り込みは「予測不可能かつ再現不可能な瞬間」に到来する [T8]. [M] 同一の実行を6つのターゲットで実施：4つの命令セット（x86_64、aarch64、s390x ビッグエンディアン、wasm32）と3つのOS（Linux、macOS、Windows） |
| H9 | 実行前にコストを予測 | 「計算の法則」 | [C] エネルギーは速度の上限 [T14]; コスト境界 $c_{\max}F$ （上記パート3） | [P] フォームごとのコスト表予測 | [C] 同一計算の実装は熱力学的コストが異なる [T15]. [P] 中央値誤差は測定ジャouleの20%以内 |
| H10 | 商上の学習はデータを節約 | 「符号化の法則」 | [C] より良い予測はより良い圧縮 [T32]; 最小記述長 [T33] | [P] 訓練例の最大半数で同等の受容 | [P] 両予測器の訓練エネルギーを測定 |
| H11 | エネルギーは編集距離に対して単調 | 「符号化の法則」 | [C] 単調なコスト順位付けは、目標から離れる計画のコストを高くする (Chahe et al., [B19] in the proposer section) | [P] エネルギーが編集距離とともに上昇するファミリの割合 | 該当なし |
| H12 | ゲート結果に校正された決定ヘッド | 「符号化の法則」および「計算の法則」 | [C] 校正された型付き決定は測定可能：あるホスト決定モデルのプールされたChoice ECE 0.028 ([B7]) | [P] 10<sup>4</sup> 件の受領後の決定タイプ別ECE、頻度表と比較 | [P] 特定デバイス上の決定あたりのレイテンシとジュール |
| H13 | 離散対連続潜在変数 | 「符号化の法則」 | [C] 離散トークンは、連続潜在が誤差を蓄積する場合に長期予測を安定させた ([B3]) | [P] 編集長さ1、5、20での計画成功率 | 該当なし |
| H14 | 決定的ラダーシェア | 「符号化の法則」 | [C] 正確なギア（ルックアップ、規則、合成）はRCE論文のカスケードで任意のモデルより先に実行され、偽装器RCE-F1がモデル呼び出しなしで閉じるシェアに適用される | [M] 公開ラダーがモデル呼び出しゼロで閉じた登録タスク集合のシェア：3つの登録実行 [B30, B31, B32]; 実行3は151 中の111 を閉じ (73.5%)、登録10%以上であるため H14 は登録規則で支持され、実履歴からの変更は41 中1 件 (2.4%) (Section 8 below) | 該当なし |
| H15 | 残差上の提案者クラス。未完了 | 「符号化の法則」 | [P] 40 の残差タスクに対し4 クラス、エネルギー等価、ゲート受容。実行なし | [P] 比較は実行されていない | [P] 特定メーターが存在する場合はエネルギー等価。ジュール数は示されていない |

<div id="who-holds" class="anchor-alias" aria-hidden="true"></div>

### これらの見解を持つ者とその理由

アイデアはめったに単独で現れない。論文の各部分は、RCE を知らない人々がそれぞれの理由で述べた議論を呼び起こす。これらは収束観測として列挙されている：方向性の一致であり、RCE プロジェクトの主張の確認ではない。OpenIE の著者が全文を読んだ情報源はその節とともに引用され、読んでいない場合はその旨が記され、何も引用されていない。

**すでにこの考えを持つ者たち。** プログラミングと計算に独自の法則があるべきだという考えは RCE プロジェクトから生まれたものではなく、分野の大部分よりも古い。このページは少なくとも四十年続く議論に参加し、優先度ではなく収束として列挙している。

- **Hoare と同僚, 「Laws of Programming」 (1987)。** 9 人の著者は「従来の手続き型プログラムは数学的表現であり、他のあらゆる数学、工学、自然科学の分野と同様に豊かで優雅な法則の集合に従う」ことを主張し、ほぼ百項目の法則を提示した [T7, p. 672]。また、上記のタイムラインで引用されたギャップについても言及した [T7, p. 686]。
- **Bennett と Landauer, 「The Fundamental Physical Limits of Computation」 (1985)。** 「我々は情報処理がどのように実現されようとも支配すべき一般的な法則を求めている」[T13, p. 48]。このページが共有する注意点として「我々が見出した限界は、現代技術の実際の限界からは甚だ遠く離れている」ことを付記している [T13, p. 48]。可逆機械に関する彼らの結果は「したがって、任意の計算を実行するために費やさなければならない最小エネルギー量は存在しない」[T13, p. 51]。一方、消去と誤り訂正はエネルギーを散逸させる。彼らの言葉を借りれば「任意の訂正装置はしたがって何らかのエネルギーを散逸しなければならない」[T13, p. 51]。
- **McKee, 「A few (proposed) fundamental laws of computation」 (1995)。** IEEE Computer に掲載された短いエッセイで、計算分野の法則を提案している [T31]。OpenIE の著者は本文を取得できていないため、タイトル以外の引用や要約は行っていない。
- **Carette, James と Sabry, 「Embracing the laws of physics」 (2022)。** 量子論と熱力学が「情報は物理過程および原始的な計算操作の保存量である」ことを示唆し、「情報保存の原理を取り入れた基礎的計算モデルの再構築」を目指すと述べている [T16, abstract, PDF p. 2]。彼らの結論的要約は「コンピュータサイエンス全体、すなわち主流の計算モデル、プログラミング言語、論理は古典物理学に基づいている」ことを指摘している [T16, Sec. 5.5, p. 45]。
- **Lehman (1980)** は、実世界に組み込まれたプログラムに対するソフトウェア進化の 5 つの経験的規則性を示す [T6]。最初の規則「Continuing Change」では、仕様の実装として使用され、他の現実を反映するプログラムは「継続的に変化するか、次第に有用性が低下する」[T6, Table I, p. 1068] と述べている。これらは物理法則ではなく、「しかしながら、物理的・化学的規則性のように不変ではない」ことを明言している。なぜならそれらは「人々や組織の習慣と実践から生じる」からであり、同ページが「Laws of Coding」と「Laws of Computation」の間に置く距離と同様である [T6, Sec. V-A, p. 1069]。**Brooks** は「本質的タスク、すなわち抽象的ソフトウェア実体を構成する複雑な概念構造の形成」を偶発的タスクと区別した [T23, PDF p. 1]。**Dijkstra** はコンピュータが「10<sup>10</sup> 以上」の時間粒度の比率を跨ぐことを観測し、これにより「高度に階層的な人工物が可能であり必要となる最初の環境を提供する」ことになると指摘した [T8]。

以下の各グループは、同一の考えの異なる側面を保持している。

**圧縮としての理解（第1部、T2）。** ソロモノフ、コルモゴロフ、チャイティンは複雑性を最短記述として定義した[T27, T28, T29]；リッサーネはそれをモデル選択規則にした[T33]；ハッターの賞とAIXI、サツケヴァーの講演はそれを知能へと拡張した（ここでは読まない、引用なし）。 ディレタンらDeepMindの研究者は「圧縮がうまくいくモデルは一般化もうまくいく」[T32, Sec. 1] と主張し、大規模言語モデルが画像や音声を圧縮できることを示した。 シュミドゥーバーは宇宙の歴史が計算可能であるならば、その最も単純な説明は「それを計算する最短プログラム」になるだろうと論じた[T34, Sec. 1]。 不一致点として、ディレタンらは「ある点を超えてスケールすると、モデルパラメータを考慮しなければならないため圧縮性能が劣化する」[T32, Sec. 1] と警告し、コレットは「特定タスクでのスキル測定だけでは知能測定には不十分」[T37, abstract] と主張する。 固定コーパスの圧縮は新しいスキルの効率的学習とは同じではない。

**計算としての物理学（第3部）。** ランダウアー[T11]、ベネット[T12, T30]、ロイド[T14]は情報処理がエネルギーコストと限界を伴う物理過程であると主張する。 ロイドは「エネルギーは速度を制限し、エントロピーは記憶を制限する」[T14, Sec. 1.5] と述べる。 ウォルパートの確率的熱力学は計算、特に有限オートマトンを非平衡物理として扱い、「コンピュータの最も顕著な側面の一つは、そもそも非平衡系であること」[T15, abstract] と指摘する；有限オートマトンはSec. XIIで取り上げられる[T15]。 フレドキンとトフォリの保守論理[T38]、ファインマンの計算に関する講義、ホイーラーの「it from bit」およびウルフラムの計算宇宙は同じ方向を示す（ここでは読まない）。 不一致点として、ベネットはランダウアー原理が誤りである、あるいは熱力学第二法則の結果として不要またはマクスウェルの悪魔を追い払うには不十分であるという異議を記録し、それに答えている[T12]；議論は基礎に関するもので、床面積の大きさについてではない。 第二の不一致は歴史的で、ランダウアーは「論理的不可逆性を示す装置は計算に不可欠であると考えている」[T11, Sec. 3, p. 186] と述べ、ベネットの1973年の構成はそれが不要であることを示したが、ステップ数が約2倍になり大きな一時的履歴が必要となった[T30, pp. 525, 529]。 ベネットはさらに「kT ln 2 は、ランダウアーが主張したように[1]、1ステップあたり約1ビットを捨てる機械に対する近似的下限である」だけと推定した[T30, p. 532]。

**状態機械と決定的セマンティクス（パート 1、T3）。** チューリングの機械 [T9]、ミルナーのカルキュラス [T18]、ハレルのステートチャート [T19]、プログラムを状態上の振る舞いの集合として扱う TLA [T20]、同期言語 Esterel と Lustre（Berry, Halbwachs）[T21, T22]、エリオットの関数型リアクティブプログラミング [T39]、Elm アーキテクチャ、FoundationDB と TigerBeetle の決定的シミュレーションテスト、そしてプログラムを述語として見る Hoare と Dijkstra の見解 [T17] はすべて、プログラムを正確なセマンティクスを持つ状態機械として扱う。ここでは歴史として引用する。FoundationDB と TigerBeetle のページおよび Elm ガイドは、下記の収束セクション（その FoundationDB、TigerBeetle、Elm Architecture 行）で全文読んだが、他はこの節で全文読んでいないため引用はない。制限事項: チューリング [T9] と Rice [T3] は任意のプログラムについて決定可能なことを境界付ける; 決定的セマンティクスは閉じた言語では述べやすいが、実ハードウェア、スレッド、ネットワークを跨ぐと保つのが困難である。

**プログラムを低次元多様体上のデータとして扱う（パート 2）。** Hindle らはソフトウェアが「自然」であり、英語よりも反復的であることを発見した [T24]（ここでは全文読んでいない）。Alon らの code2vec はコードをベクトルにマッピングし、「意味的に類似したオブジェクトは近いベクトルにマッピングされる」ことを示す [T35, Sec. 1]。Sketch ベースの合成（Solar-Lezama）、DreamCoder のライブラリ学習（Ellis et al. 2021、下記セクション 2 で引用; 補足は「自動リファクタリング」[Ellis et al. 2021, supplement S3.2, p. 39] と記述）および Allamanis のコード上の機械学習に関する調査は同様の方向を指す（Solar-Lezama と Allamanis はここでは読んでいない）。不一致点: code2vec の著者は「情報が乏しい、難読化された、あるいは敵対的な変数名が与えられた場合、ラベルの予測精度は通常低下する」ことを報告している [T35, Sec. 7]。学習された埋め込みは意味よりも名前を追跡しがちであり、これは正規形が埋めようとするギャップである。

**ワールドモデルと潜在予測（パート 4）。** Meta FAIR の LeCun の JEPA プログラム（上記参照）、Ha と Schmidhuber が「環境の圧縮された空間的・時間的表現を学習する」こと [T40, abstract]、MuZero [T1]、物理情報を組み込んだニューラルネットワークで、事前の物理知識が「許容可能な解の空間を管理可能なサイズに制約する正則化エージェントとして機能する」こと [T41, Sec. 1]、およびシミュレーションが「時間とともにエネルギーが高いまたは低い状態へと漂う」ことに動機付けられたハミルトニアンニューラルネットワーク [T42, Sec. 1] は、すべて学習されたダイナミクスに構造を組み込む。Lagrangian ネットワーク（Cranmer）、Dreamer（Hafner）および Koopman 演算子学習も同様の目的を共有する（ここでは読んでいない）。不一致点: Ha と Schmidhuber は、学習されたワールドモデルは「実際の環境にそのようなエクスプロイトが存在しなくても、コントローラによってエクスプロイト可能になる」ことを発見した [T40, Sec. 4.5]。Greydanus らは、彼らの手法が保存量を前提としているため摩擦をモデル化できないと指摘している [T42, Sec. 3.2]。コードにおいては、チェッカーがモデルの誤りを利用することへの防御手段となる。

**エネルギーベースモデル（第4部）。** Hopfield [T43] と Hinton [T44] は学習をエネルギー表面の形成として位置付けた（ここでは省略）；Du と Mordatch [T36] は学習されたエネルギーを下降させることで暗黙的生成を示し、上記で引用された LeCun は JEPA 推論の中心にエネルギー最小化を置く。分野内の意見の相違は訓練の安定性とサンプリングコストに関するものであり、Du と Mordatch が [T36] で議論している。

<div id="lane-3-views" class="anchor-alias" aria-hidden="true"></div>

### レーン3、プロジェクト外部からの視点

Section 3 では、計算、プログラミング、コーディングを再構築するプログラムが記録されている。これらは収束観測である。以下のコミットメント節では、同じ名前のいくつかを七つのコミットメントに一対一で対応付けている。

- **Unison.** 定義はその構文木のハッシュである。名前はビューに過ぎない。同一の木を持つ二つのテキストは同一の定義である。これは正規形の同一性の半分に相当する。
- **egg.** e-graph は同等のプログラム集合を一つの構造として保持する（Willsey et al., Section 3 below）。コーディングの法則は同じ商を用いる：多数の表層プログラム、ひとつの正規形。
- **Interaction nets.** HVM2（Higher Order Company のインタラクションコンビネータモデル）は計算を局所的書換えとして扱い、並列性をモデルに組み込んでいる。Section 3 はこのモデルを引用しているが、当該論文の図は含まれていない。
- **Proof assistants.** Lean、Dafny、Verus は正確性を検査可能なオブジェクトにする。vericoding ベンチマークは Section 3 で引用された測定フロアである。AlphaProof、DeepSeek-Prover-V2、Kimina-Prover Preview、Goedel-Prover は Lean カーネルをゲートとして使用する。ここで読まれる報告書の領域は数学である。
- **Elliott, denotational design.** 「インスタンスの意味は意味のインスタンスである。」セマンティックモデルは正確性を定義し、実装へと伝搬させる（Elliott, 2009, revised 2016）。これは手動の規律である。正規形がひとつの意味を持つという要求と同じである。
- **Propagators.** Radul と Sussman（2009）は計算を共有セルに情報を付加する自律機械として記述し、式と制約を統合する。報告書は理論と Scheme 実装を含む。
- **Lean, as an engineering programme.** Lean FRO（Focused Research Organization） Year 1 ロードマップ（2023年8月〜2024年7月）は標準ライブラリ、モジュールシステム、Lake と Reservoir、証明自動化、機械学習統合、そして新しいコードジェネレータを列挙している。以降の年はここでは使用しない。
- **Chollet.** 知能をスキル取得効率とみなし、Abstraction and Reasoning Corpus（ARC）を測定指標とする [T37]。Section 3 の ARC Prize の結果はそのプログラムの後続測定である。2019 年以降の講演は単独で引用されていない。

![Grid mapping six research communities, compression, computation as physics, state machines, programs as data, world models and energy-based models, to thesis parts T1 to T4, with filled dots where a community's argument bears on a part](/figures/rce-jepa/groups.svg)

*Figure 7. Which communities bear on which part of the thesis. A filled dot marks a convergence observation, not confirmation. Part 1: finite information system; T2: compression into Form; T3: kinematics and energy; T4: world model and inverse problem..*

<div id="thesis-references" class="anchor-alias" aria-hidden="true"></div>

### 論題の参考文献

Ledger: Full = 完全に読んだ; Partial = 部分的に読んだ; Unavailable = 読んでいない（ペイウォールまたは取得できなかった）、識別子のみでリストされ、決して引用されない。

1. [T1] J. Schrittwieser et al., "Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model", Nature 588 (2020). [arXiv:1911.08265](https://arxiv.org/abs/1911.08265). Full.
2. [T2] Y. LeCun et al., "A tutorial on energy-based learning", 2006. [PDF](http://yann.lecun.com/exdb/publis/pdf/lecun-06.pdf). Full.
3. [T3] H. G. Rice, "Classes of recursively enumerable sets and their decision problems", Trans. AMS 74 (1953). [doi:10.1090/S0002-9947-1953-0053041-6](https://doi.org/10.1090/S0002-9947-1953-0053041-6). Unavailable.
4. [T4] M. A. Di Liscia, "Johannes Kepler", Stanford Encyclopedia of Philosophy. [plato.stanford.edu](https://plato.stanford.edu/entries/kepler/). Full.
5. [T5] G. E. Smith, "Newton's Philosophiae Naturalis Principia Mathematica", Stanford Encyclopedia of Philosophy. [plato.stanford.edu](https://plato.stanford.edu/entries/newton-principia/). Full.
6. [T6] M. M. Lehman, "Programs, life cycles, and laws of software evolution", Proceedings of the IEEE 68(9) (1980). [doi:10.1109/PROC.1980.11805](https://doi.org/10.1109/PROC.1980.11805). Full.
7. [T7] C. A. R. Hoare, I. J. Hayes, He Jifeng, C. C. Morgan, A. W. Roscoe, J. W. Sanders, I. H. Sorensen, J. M. Spivey and B. A. Sufrin, "Laws of Programming", Communications of the ACM 30(8), 672-686 (1987). [doi:10.1145/27651.27653](https://doi.org/10.1145/27651.27653); [PDF copy](https://www.cs.ox.ac.uk/bill.roscoe/publications/20.pdf). Full.
8. [T8] E. W. Dijkstra, "The Humble Programmer", ACM Turing Lecture 1972, EWD 340. [Transcription](https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/EWD340.html); [doi:10.1145/355604.361591](https://doi.org/10.1145/355604.361591). Full.
9. [T9] A. M. Turing, "On computable numbers", Proc. London Math. Soc. 42 (1936). [doi:10.1112/plms/s2-42.1.230](https://doi.org/10.1112/plms/s2-42.1.230). Unavailable.
10. [T10] C. E. Shannon, "A mathematical theory of communication", Bell System Technical Journal 27 (1948). [doi:10.1002/j.1538-7305.1948.tb01338.x](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x); [reprint](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf) (page numbers refer to this reprint). Full (all 55 pp. of the reprint, Parts I to V and Appendices 1 to 7).
11. [T11] R. Landauer, "Irreversibility and heat generation in the computing process", IBM J. Res. Dev. 5 (1961). [doi:10.1147/rd.53.0183](https://doi.org/10.1147/rd.53.0183). Full.
12. [T12] C. H. Bennett, "Notes on Landauer's principle, reversible computation, and Maxwell's Demon", 2003. [arXiv:physics/0210005](https://arxiv.org/abs/physics/0210005). Full.
13. [T13] C. H. Bennett and R. Landauer, "The Fundamental Physical Limits of Computation", Scientific American 253(1), 48-57 (1985). [doi:10.1038/scientificamerican0785-48](https://doi.org/10.1038/scientificamerican0785-48); [PDF copy](http://physics.bu.edu/~pankajm/PY541/Bennett-Landauer.pdf). Full (all text pages of the linked copy, pp. 48-56).
14. [T14] S. Lloyd, "Ultimate physical limits to computation", Nature 406 (2000). [arXiv:quant-ph/9908043](https://arxiv.org/abs/quant-ph/9908043). Full.
15. [T15] D. H. Wolpert, "The stochastic thermodynamics of computation", J. Phys. A 52 (2019). [arXiv:1905.05669](https://arxiv.org/abs/1905.05669). Full.
16. [T16] J. Carette, R. P. James and A. Sabry, "Embracing the laws of physics: Three reversible models of computation", Advances in Computers (2022). [doi:10.1016/bs.adcom.2021.11.009](https://doi.org/10.1016/bs.adcom.2021.11.009); [author copy](https://www.cas.mcmaster.ca/~carette/publications/EmbracingTheLaws.pdf). Full.
17. [T17] C. A. R. Hoare, "An axiomatic basis for computer programming", CACM 12 (1969). [doi:10.1145/363235.363259](https://doi.org/10.1145/363235.363259). Unavailable.
18. [T18] R. Milner, A Calculus of Communicating Systems, LNCS 92 (1980). [doi:10.1007/3-540-10235-3](https://doi.org/10.1007/3-540-10235-3). Unavailable.
19. [T19] D. Harel, "Statecharts: a visual formalism for complex systems", Sci. Comput. Program. 8 (1987). [doi:10.1016/0167-6423(87)90035-9](https://doi.org/10.1016/0167-6423(87)90035-9). Unavailable.
20. [T20] L. Lamport, "The temporal logic of actions", ACM TOPLAS 16 (1994). [doi:10.1145/177492.177726](https://doi.org/10.1145/177492.177726). Unavailable.
21. [T21] G. Berry and G. Gonthier, "The Esterel synchronous programming language", Sci. Comput. Program. 19 (1992). [doi:10.1016/0167-6423(92)90005-V](https://doi.org/10.1016/0167-6423(92)90005-V). Unavailable.
22. [T22] N. Halbwachs et al., "The synchronous data flow programming language LUSTRE", Proc. IEEE 79 (1991). [doi:10.1109/5.97300](https://doi.org/10.1109/5.97300). Unavailable.
23. [T23] F. P. Brooks, "No Silver Bullet: Essence and Accidents of Software Engineering", IEEE Computer 20(4) (1987; first presented 1986). [doi:10.1109/MC.1987.1663532](https://doi.org/10.1109/MC.1987.1663532); [PDF copy](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf). Full.
24. [T24] A. Hindle et al., "On the naturalness of software", ICSE (International Conference on Software Engineering) 2012. [doi:10.1109/ICSE.2012.6227135](https://doi.org/10.1109/ICSE.2012.6227135). Unavailable.
25. [T25] J. W. Backus et al., "The FORTRAN Automatic Coding System", Western Joint Computer Conference (1957). [Computer History Museum copy](https://archive.computerhistory.org/resources/text/Fortran/102663113.05.01.acc.pdf). Full.
26. [T26] J. L. Hennessy and D. A. Patterson, "A New Golden Age for Computer Architecture", Communications of the ACM 62(2) (2019). [doi:10.1145/3282307](https://doi.org/10.1145/3282307); [CACM web text](https://cacm.acm.org/research/a-new-golden-age-for-computer-architecture/). Full.
27. [T27] R. J. Solomonoff, "A formal theory of inductive inference, Part I", Information and Control 7 (1964). [doi:10.1016/S0019-9958(64)90223-2](https://doi.org/10.1016/S0019-9958(64)90223-2). Unavailable.
28. [T28] A. N. Kolmogorov, "Three approaches to the quantitative definition of information", Problems of Information Transmission 1 (1965); English reprint, International Journal of Computer Mathematics 2 (1968), [doi:10.1080/00207166808803030](https://doi.org/10.1080/00207166808803030). Full (page numbers from the 1968 reprint).
29. [T29] G. J. Chaitin, "On the length of programs for computing finite binary sequences", J. ACM 13 (1966). [doi:10.1145/321356.321363](https://doi.org/10.1145/321356.321363). Unavailable.
30. [T30] C. H. Bennett, "Logical Reversibility of Computation", IBM J. Res. Dev. 17(6), 525-532 (1973). [doi:10.1147/rd.176.0525](https://doi.org/10.1147/rd.176.0525). Full.
31. [T31] G. McKee, "A Few (Proposed) Fundamental Laws of Computation", IEEE Computer 28(1), 120 (1995), Open Channel. No DOI located; [DBLP table of contents](https://vldb.org/dblp/db/journals/computer/computer28.html). Unavailable.
32. [T32] G. Delétang et al., "Language Modeling Is Compression", ICLR 2024. [arXiv:2309.10668](https://arxiv.org/abs/2309.10668). Full.
33. [T33] J. Rissanen, "Modeling by shortest data description", Automatica 14 (1978). [doi:10.1016/0005-1098(78)90005-5](https://doi.org/10.1016/0005-1098(78)90005-5). Unavailable.
34. [T34] J. Schmidhuber, "Driven by Compression Progress", 2009. [arXiv:0812.4360](https://arxiv.org/abs/0812.4360). Full.
35. [T35] U. Alon et al., "code2vec: Learning Distributed Representations of Code", POPL 2019. [arXiv:1803.09473](https://arxiv.org/abs/1803.09473). Full.
36. [T36] Y. Du and I. Mordatch, "Implicit Generation and Modeling with Energy-Based Models", NeurIPS 2019. [arXiv:1903.08689](https://arxiv.org/abs/1903.08689). Full.
37. [T37] F. Chollet, "On the Measure of Intelligence", 2019. [arXiv:1911.01547](https://arxiv.org/abs/1911.01547). Full.
38. [T38] E. Fredkin and T. Toffoli, "Conservative logic", Int. J. Theor. Phys. 21 (1982). [doi:10.1007/BF01857727](https://doi.org/10.1007/BF01857727). Unavailable.
39. [T39] C. Elliott and P. Hudak, "Functional reactive animation", ICFP 1997. [doi:10.1145/258948.258973](https://doi.org/10.1145/258948.258973). Unavailable.
40. [T40] D. Ha and J. Schmidhuber, "World Models", 2018. [arXiv:1803.10122](https://arxiv.org/abs/1803.10122). Full.
41. [T41] M. Raissi, P. Perdikaris and G. E. Karniadakis, "Physics Informed Deep Learning (Part I)", 2017. [arXiv:1711.10561](https://arxiv.org/abs/1711.10561). Full.
42. [T42] S. Greydanus, M. Dzamba and J. Yosinski, "Hamiltonian Neural Networks", NeurIPS 2019. [arXiv:1906.01563](https://arxiv.org/abs/1906.01563). Full.
43. [T43] J. J. Hopfield, "Neural networks and physical systems with emergent collective computational abilities", PNAS 79 (1982). [doi:10.1073/pnas.79.8.2554](https://doi.org/10.1073/pnas.79.8.2554). Unavailable.
44. [T44] G. E. Hinton, "Training products of experts by minimizing contrastive divergence", Neural Computation 14 (2002). [doi:10.1162/089976602760128018](https://doi.org/10.1162/089976602760128018). Unavailable.

<div id="convergence-commitments" class="anchor-alias" aria-hidden="true"></div>

## コミットメントによる収束

RCE 論文は七つのコミットメントに基づく。それぞれは独立に、しばしば複数回にわたり、各自の理由で作業する人々によって達成された。下の表は、一次情報源（論文、公式文書またはリポジトリ）が公開され、ここに記された文と照合されたプロジェクトを列挙している。各行はプロジェクトが何を確立したか、そしてそのコミットメントに対してどこで止まるかを示す。これらは収束観測であり、方向の一致を示すものであって、RCE の主張の確認や順位付けではない。RCE の背後にある組織 OpenIE の項目は *same house* とマークされ、証拠としては使用されない。

本節で使用される略語: RCE、Reality Code Engine; AST、抽象構文木; IR、中間表現; LLM、大規模言語モデル; JSON、JavaScript Object Notation; WASM、WebAssembly; SMT、satisfiability modulo theories（Z3 は SMT ソルバー）; DST、決定的シミュレーションテスト; CEGIS、counterexample-guided inductive synthesis。

![Grid of seven commitments, canonical form, log and replay, projection, stored intent, deterministic gate, promotion and reuse, and energy or cost, against verified outside projects; a filled dot marks a commitment that the project's own primary source states](/figures/rce-jepa/convergence.svg)

*Figure 8. Which commitment each verified outside project reaches, according to its own primary source. A dot is a convergence observation, not a score; RCE is not drawn. Select the figure to enlarge it..*

<div id="cc1" class="anchor-alias" aria-hidden="true"></div>

### 1. 一つの正準形式 - 表面テキストはビューである

| Project | What it established | Where it stops |
| --- | --- | --- |
| Intentional Programming, Simonyi, 1995 [C1] | プログラムはノードの木であり、各ノードは意図のインスタンスである；ユーザーは木を編集し、任意の記法で閲覧できる；計算意図は実装から分離して保持できる | Microsoft の研究システム；報告書には決定論やリプレイモデルは記述されていない（トランザクションファイルがバージョン管理に供給されるが、リプレイセマンティクスは示されていない） |
| Unison [C2] | 各定義は構文木のハッシュで識別され、名前は別途保存されたメタデータで管理される | ハッシュは構造に基づく：同一の振る舞いで構造が異なる二つの定義は異なるハッシュを持つ |
| Equality saturation and egg [C3; C4] | e-graph はプログラムの多数の等価バージョンを同時に保持し、コストモデルが一つを選択する（Tate et al.: 静的コストモデル上の擬似ブールソルバー；egg: ユーザー提供のコスト関数を持つ抽出器） | 関数単位（Tate et al. の場合はイントラプロシージャル）またはユーザー定義言語の項全体（egg はバインディングの組み込みサポートを持たない）に適用される最適化・合成手法；飽和は終了しない場合に限り有界であり、e-graph はプログラムの保存形態として保持されない |
| Tacit, 2026 [C5] | AST が唯一の真実の情報源であり、すべての有効な AST は 1 バイト単位で正確な正規テキストを持つ；定義は BLAKE3 ハッシュで参照され、異常なコードは型付けされた Hole ノードになる | 1 つのターゲット（LLVM）；状態機械セマンティクスは明示されていない |
| X07, 2026 [C6] | 正規ソースは JSON AST であり、JSON Patch により編集される；646 種類の診断コードカタログがあり、クイックフィックスの網羅が強制される | 正規バイトであり、正規振る舞いではない |
| Codifide, 2026 [C7] | 正規形は決定的なバイト形態と SHA-256 ハッシュを持つ型付きハイパーグラフであり、表層構文はその射影である；意図は定義の同一性の一部である | 著者らはこれを「契約とディスパッチ」言語と説明しており、汎用計算とはみなされていない |
| NAIL [C8] | `nail canonicalize` は任意のプログラムを正規化し、`nail check --strict` は非正規入力を拒否する | RFC 8785 に触発された JSON サブセットであり、著者自身の言葉では完全な RFC 8785 準拠を主張していない；バイト正規化のみを行う |
| EqNet, Allamanis et al., 2017 [C9] | 既知の等価クラス上で訓練されたニューラル表現により、等価な式は同一または高度に類似したベクトルを得る | ブール式および多項式式（教師あり）であり、プログラム全体ではない |

<div id="cc2" class="anchor-alias" aria-hidden="true"></div>

### 2. プログラムはログ上の決定論的状態機械である

| Project | What it established | Where it stops |
| --- | --- | --- |
| Abstract State Machines, Gurevich, 2000 [C10] | 論文のタイトルは結果を示している：順次抽象状態機械は順次アルゴリズムを捉える | 定理であり、システムではない：3 つの公理（順次時間、抽象状態、有限探索；Def. 6.1）で定義されるすべての順次アルゴリズムは、ステップごとに等価な順次抽象状態機械と一致する（Main Theorem 6.13）。公理がすべての順次アルゴリズムを網羅することは議論されているが、証明はされていない |
| Event sourcing, Fowler, 2005 [C11] | 「アプリケーション状態へのすべての変更をイベントの列として捕捉する」 | パターンであり、ドラフトとして公開されている；リプレイはゲートウェイが外部クエリの応答を記録し、リプレイ中に外部更新を抑制する場合にのみ整合性を保つ |
| The Elm Architecture [C12] | Model, View, Update：状態、状態のビュー、メッセージからの更新 | 1 つの言語と 1 つのターゲット（ブラウザ）に限定される |
| Dedalus and the CALM theorem, Hellerstein, Alvaro et al. [C13; C14] | Dedalus：明示的時間を持つ Datalog、可変状態と非同期メッセージングをモデル化。CALM：プログラムが単調であることと同値に、整合性があり協調不要な分散実装が存在することが示されている（Ameloot et al. による証明；[C14] は証明概略） | Dedalus と Bloom は研究言語であり、CALM は定理である。いずれも他言語への出力を行わない |
| Durable execution: Temporal, Restate [C15; C16] | Temporal：ワークフローコードは「リプレイを支えるために決定的でなければならない」。Restate：すべてのステップとその結果がジャーナルに記録される | リプレイはレジリエンスを提供するものであり、プログラムの同一性を保証するものではない |
| TigerBeetle deterministic simulation testing, 2026 [C17] | 論理的決定性（FoundationDB と同様）に加えて物理的決定性を実現：レプリカはバイト単位で同一の状態に収束する；実コードはシミュレータ上で実行される | 1 つのデータベースであり、この規律に従って手作業で構築された |
| FoundationDB simulation testing [C18] | 「単一スレッドプロセス内で全体の FoundationDB クラスタを決定的にシミュレートする」；決定性により「シミュレート実行の完全な再現性が可能」 | 1 つのデータベースに対するテスト規律であり、プログラム形態ではない |
| musil [C19] | Python ライブラリとしての明示的状態モデルチェッカー；simulate モードはシードされた再現可能なシミュレートネットワーク上で実ノードコードを実行する | 有界状態空間；モデルを検証し、シミュレーションは欠陥を発見するものであり、欠陥不在を証明するものではない |
| AILANG; agent-scroll [C20; C21] | AILANG：すべての構成要素が決定的セマンティクスを持ち、リプレイ可能な実行と構造化トレースを提供する。agent-scroll：正規化されたバイト決定的ハッシュ連鎖トランスクリプトで、単一バイトの変更を検出する検証器を備える | AILANG は関数型であり、状態機械形態ではない；agent-scroll はプログラムではなく会話をログに記録する |

<div id="cc3" class="anchor-alias" aria-hidden="true"></div>

### 3. すべてのターゲットは射影である - 一度書き、多数に出力する

| プロジェクト | 確立した内容 | 限界 |
| --- | --- | --- |
| MLIR [C22] | 抽象化レベル、ハードウェアターゲット、ドメインにまたがる再利用可能なコンパイラ基盤 | ソースの下位から始まる: パーサ生成やAST構築を持たず（第7節）、その論文では拡張可能な方言エコシステム全体にわたる翻訳検証を未解決問題として挙げている（第2節） |
| Model Driven Architecture、OMG、2003年 [C23] | 計算独立、プラットフォーム独立、プラットフォーム固有の各視点 | PetreはForwardおよびLethbridgeの報告として、モデルをコードと同期させ続けることが最大の問題として認識されていたと述べている（68%の同意）[C24] |
| Protocol Buffers; Lumos [C25; C26] | スキーマを一度定義し、多数の言語向けバインディングを生成する（Lumos: Solana向けRustおよびTypeScript） | データの形状のみであり、振る舞いは対象外である; 同一のProtocol Buffersメッセージが複数のバイナリシリアライゼーションを持ちうる（「完全にパースせずに2つのメッセージを等値比較することはできない」） |
| Forge、2026年 [C27] | 「多数のフロントエンドが1つの検証済み中間表現に供給し、その表現が多数のバックエンドに供給される」 | ボードおよび周辺機器の記述に限定され、汎用プログラムは対象外である |
| Faber Romanus、2026年 [C28] | 1つの高レベルIRをRust、Go、TypeScript、Swift、Faberに射影し、さらに低レベルIRを通じてLLVMおよびWASMテキスト、MetalおよびCUDAカーネルへと射影する; サポートはターゲットごとに測定・明示される | ターゲット間の一致はコーパスカバレッジによって測定されるものであり、証明されてはいない |
| Intent、2026年 [C29] | 1つのソースファイルがRust、JavaScript、WASMにコンパイルされる; 契約はすべてのターゲットで実行時に強制され、Z3による検査もオプションで行われる | ターゲットは3つのみ |
| NanoLang [C30] | コア意味論がCoqにより公理なしで証明されており、Cが本番ターゲットである | PTXおよびRISC-Vは実験的であり、LLVMおよびWASMは計画段階にある |

<div id="cc4" class="anchor-alias" aria-hidden="true"></div>

### 4. 意図を格納し、実装を導出する

| プロジェクト | 確立した内容 | 停止する地点 |
| --- | --- | --- |
| FORTRAN、Backus ら、1957年；演繹的合成、Manna および Waldinger、1980年 [C31; C32] | 数式からの自動コーディング；構成的証明から抽出されたプログラム | FORTRANはコンパイラとなった；演繹的合成は当時実装を持たなかった |
| Böckeler によって分類された仕様駆動開発 [C33] | 三つの水準：仕様優先、仕様固定、および仕様をソースとする（「人間が編集するのは仕様のみであり、人間はコードに一切触れない」）；Kiro、spec-kit、Tessl のうち、仕様をソースとする水準を探求するのは Tessl のみである | 仕様は自然言語であり、Böckeler は一つの仕様から繰り返し生成されたコードが異なることを観察した；コードが仕様であることを検証する手段は存在しない |
| Vericoding ベンチマーク、2025年 [C34] | Dafny、Verus および Lean による 12,504 件の形式仕様；9 つの既製 LLM のうち少なくとも一つが、各 5 回の試行により、タスクの 82%（Dafny）、44%（Verus）、27%（Lean）を解決し、最良の単一モデルは 67.5%、30.9%、17.9% に到達した（表 3）；自然言語による記述の追加は、検証された一つのサブセット（Verina、157 タスク；Sec. 4.1）において統計的に有意な改善をもたらさなかった | 仕様言語は証明言語であり、実行時形式や複数ターゲットへの出力は存在しない；成功例のうち約 9% の仕様は意図を捉えるには不十分であった（Sec. 4） |
| Codifide [C7] | すべての定義はコンパイルが決して破棄しない意図を持つ | コントラクトおよびディスパッチのスコープ |

**推奨事項.** Vericoding ベンチマーク [C34] は、仕様から Form への変換ステップに対する外部ベンチマークとして使用される。すなわち、状態機械の形状を持つ Dafny、Verus および Lean 仕様のスライスを Form へと持ち上げ、RCE ゲートが受理する割合を、公開済みの Vericoding 結果と並べて報告する。

<div id="cc5" class="anchor-alias" aria-hidden="true"></div>

### 5. モデルが提案し、決定論的ゲートが決定する

| プロジェクト | 確立した内容 | 停止する地点 |
| --- | --- | --- |
| CompCert; seL4 [C35; C36] | 機械検証済みコンパイラおよびカーネル。CompCert は未検証のヒューリスティックの出力を検証済みチェッカーで確認し、seL4 の証明には約 20 人年のコストを要した | 成果物ごとの証明労力 |
| スケッチング、Solar-Lezama ら、2006年 (後に CEGIS と命名された反例駆動ループ) [C37] | 人間が記述した部分プログラム (スケッチ) と実行可能仕様に対して、合成器が提案を行い、チェッカーが反例を返し、ループを繰り返す | 提案器は SAT ソルバーであり学習済みモデルではない。有限プログラム (有界入力、終了保証) に限定され、保証は有界インスタンスに対してのみ有効である |
| AlphaProof; Clover; AutoVerus [C38; C39; C40] | モデルが提案し、Lean、Dafny または Verus が検査する | 証明またはコードテキストに対するゲート。正準プログラム形式は存在しない |
| エージェント型モデル検査、2026年; 概念設計向け LLM 駆動検証合成、2026年 [C41; C42] | 「エージェントが提案し、ソルバーが検証する」 (LLM が依然として反例の現実性をトリアージする)。後者では、不変条件のみでは設計が過少拘束となり、実行ごとに結果が異なり、一部は非現実的であった | [C41] は LLM が推論した仕様を用いて既存コードを検証する。検査は有界 (デフォルトのアンワインド 4) かつ仕様相対的であり、著者らは「バグが暗黙裡に見逃される原因となる」過度に弱い仕様を主要な失敗モードとして挙げている。[C42] は設計モデル (コードではない) に対する協調ルールを合成し、有界 Alloy スコープ内でのみ検査される。LLM が設計を Alloy に変換する。両者とも妥当性は意図と同一ではないと警告している |
| Vera、2026年; Vow; Thermite [C43; C44; C45] | Vera: 決定可能な場合は Z3 SMT ソルバーによって証明され、それ以外は実行時に検査される必須契約。「モデルは正しい必要はなく、検査可能である必要がある」。Vow: ESBMC 有界モデル検査によって静的に検証される契約。Thermite: 失敗時に反例を伴い、保証レベル (Verus/Z3、Lean、Kani 有界、実行時) が記録される契約 | 関数レベルでのゲート。リプレイおよびプロモーションは存在しない |
| 決定モデル、概念クラス [C46] | モデルの出力全体が型付き回答 (閉じた選択肢集合からの一選択肢、有界スコア、または yes/no 確率) であり、すべての選択肢に対して確率を持ち、較正のために訓練されたモデル | 閉じた選択肢集合が必要である。RCE プロジェクトは独自の決定ヘッドを構築しており、外部の決定モデルは使用しない |

<div id="cc6" class="anchor-alias" aria-hidden="true"></div>

### 6. 受理された作業は昇格され再利用される

| プロジェクト | 確立した内容 | 停止する地点 |
| --- | --- | --- |
| Gödelマシン（Schmidhuber）、Löb障壁（YudkowskyおよびHerreshoff）[C47; C48] | 自己書き換えは、その書き換えが探索を継続するよりも高い効用を持つという証明が、自身の公理系のもとで得られた場合にのみ実行される。直接的な形式主義においては、証明に基づくエージェントは自身の証明系を用いる後継者を信頼できない（Löbの定理）ため、書き換えのたびに信頼度は低下し、論文における技術的な回避策は部分的なものにとどまる | 理論段階 |
| Voyager、STOP、Darwin Gödelマシン、AlphaEvolve [C49; C50; C51; C52] | 実行可能なスキルの増大するライブラリ、自己改善するスキャフォールド（モデルの重みは変更されない）、自己修正エージェントのアーカイブ（コンパイル可能かつコード編集が可能な場合に保持され、親はベンチマークスコアにより選択される）、自動評価器のもとで進化するコード | スコアまたは評価器による選択であり、インターフェースにおける証明による選択ではない。VoyagerのはGPT-4批評器であり、AlphaEvolveのスコアにはLLMによる採点フィードバックが含まれる場合があり、その正確性はループ外での構成、ランダム化テスト、あるいは人手による検証レビューに由来する |
| Getafix、Sorald、TBar [C53; C54; C55] | 過去の修正から採掘された、またはテンプレートとして記述された修正パターンを、モデルを用いずに新たなケースに再利用する。完全な障害局所化のもとでTBarはDefects4Jの395件のバグのうち74件を正確に修正し（101件については妥当なパッチを生成）、標準的な障害局所化では43件を修正する | パターンはバグクラスごとであり、単一言語向けに学習または記述される（Getafix自体の手法は言語非依存である）。Getafixは静的解析器を再実行することにより、上位の修正候補のみを検証する |

<div id="cc7" class="anchor-alias" aria-hidden="true"></div>

### 7. エネルギーまたはコストが目的関数である

| プロジェクト | 確立した内容 | 停止する地点 |
| --- | --- | --- |
| Landauer, 1961; Bennett, 1973 [C56; C57] | 1ビットの消去には熱力学的下限が存在し、計算は原理的に論理可逆にできる | 物理学であり、ソフトウェアの目標ではない |
| FrugalGPT, 2023 [C58] | モデルのカスケードが、対象タスクにおいて最良の単一モデルと同等の性能を最大98%のコスト削減で達成した | ドルコストのみ; モデル以下の決定論的階層は存在しない |
| Cost-of-pass, 2025; AI Agents That Matter, 2024 [C59; C60] | 正解を得るための期待金銭コスト; コストと精度を報告し、同時に最適化する | ドルおよびトークンであり、ジュールではない; Cost-of-Passの著者らはエネルギーがドルに代替できると指摘しているが、実測は行っていない |
| Compiler world models, 2026 [C61] | テンソルプログラムの状態を潜在空間におけるスケジューリング行動を通じて前方展開し、ハードウェア実測前にワークロード内の候補スケジュールを順位付けする (絶対的なレイテンシ予測ではなく相対スコア) | テンソルスケジュールのみ (TVM AutoScheduler); 候補の順位付けを行うが、生成は行わない |
| Codifide [C7] | 宣言されたコストに基づいて充足済み候補の中から選択する | 宣言コストであり、実測エネルギーではない |
| JouleOS (OpenIE) [same house] | エネルギー予算および `est_j`、`reported_j`、`measured_j` ラベル | 同一組織内: 開示目的で列挙しており、根拠としては位置づけない |

<div id="cc-lanes" class="anchor-alias" aria-hidden="true"></div>

### 四つのコミットメントが後続レーンと交わる方法

以下の第3節では3つのレーンを記録する。図 8 は変更なし。ここでの注記は、すでに表に含まれる出典の収束読み取りおよびレーン報告であり、スコアではない。

- **一つの正規形。** Unison [C2] は構文木のハッシュによって定義を識別し、名前はビューである。egg [C4] は等価なプログラムを一つのe-グラフとして格納する。いずれも表層テキストではなく構造を対象とする。
- **モデルが提案し、決定論的ゲートが決定する。** AlphaEvolve [C52] および AlphaProof [C38] はハイブリッドの事例であり、vericoding ベンチマーク [C34] とともにその例を構成する。第3節では、Lean カーネルをゲートとする Lean 証明器 DeepSeek-Prover-V2、Kimina-Prover Preview、Goedel-Prover、およびモデルがサンプリングを行う際に型システムが作用する型制約付きデコーディングを追加する。
- **昇格と再利用。** DreamCoder (Ellis ら、以下の第2節) は圧縮によってライブラリを学習する。LILO (Grand ら、以下の第3節) は大規模言語モデルと記号的リファクタリングを組み合わせる。ライブラリはそれらのシステムにおける再利用ステップである。報告されているドメインは小規模である。
- **コスト。** CWM 報告では、テスト時に16サンプルのベストを用いることで、SWE-bench Verified の pass@1 が 53.9% から 65.8% に向上する [B23]。これは一つのベンチマークにおける計算コストであり、ジュール測定値ではない。Mercury は H100 上でそれぞれ 1,109 および 737 トークン毎秒のスループットを報告する (Inception Labs、以下の第3節)。スループットはジュールではない。本ページでは引き続きコストを電気エネルギーとして計上し、メーター読み取り値が存在する場合はアイドル分を差し引くものとし、それらの数値をジュールに換算しない。

<div id="cc-rce" class="anchor-alias" aria-hidden="true"></div>

### RCE論文が述べること（OpenIEの独自研究）

以下は[RCE論文](/papers/rce/)（リビジョン df38742、2026年11月6日）からの引用である。これらは上記プロジェクトとの比較としてではなく、当該プロジェクト自身の成果として列挙する。

- **正準形式。** 正準シリアライゼーションはForm上で単射であり、異なる2つのFormは異なる形状ハッシュを持つ。振る舞いの同値性は別途定義され（適合同値）、エンジンの設計では同値なバリアントがeグラフ内の健全な書き換えによってグループ化される。同値な振る舞いが常に一つの正準形式をもたらすとは、論文は主張していない。
- **証明。** 決定論性、全域性、ログの畳み込みとしての再実行、および保持ステップのアトミック性（適用されないイベントは状態を保持する）は、コア計算体系上でLean 4により証明されている。Rustプログラムエミッタは、出力されるRustサブセットの深い埋め込みであるMiniRustへの検証済み変換としてコア上で証明されている。RustコンパイラがMiniRustを実装するという点は信頼されており、テストによって確認されている。この証明はプログラムエミッタを対象としており、Form射影は対象外である。
- **ゲート。** エンジンの設計では、候補は記録された入力の再実行、カバレッジ境界を伴うシャドウ実行、出力スキーマ検査、およびKani証明証明書を通過する必要があり、提案された書き換えにはさらにZ3証明も必要となる。ある実行の公開記録において、15億パラメータのローカルモデルが18件の提案を行い、そのうち13件が相異なるものであった。ゲートは15件を受理せず、受理した3件はエンジンがすでに保持していたルールを繰り返す、三つの名称を持つ一つの書き換えであった。
- **エネルギー。** エンジンの設計では、すべてのレシートが `est_j` を保持し、価格未設定のモデル呼び出しがゼロとして読み取られることはない。`measured_j`（壁面メータ）は、これまでのすべての結果において空である。

<div id="cc-refs" class="anchor-alias" aria-hidden="true"></div>

### 本節の情報源

台帳における表記と同様: Full = 一次資料（論文、ドキュメントページ、READMEまたはプロジェクト説明）の全体を、参考文献および付録が存在する場合はそれらを含めて通読したことを示す。ここに列挙されたすべての資料は2026年10月14日以前に全文を通読済みである; [C46]は決定ヘッドセクションに列挙された資料を指す。

1. [C1] C. Simonyi, "The Death of Computer Languages, the Birth of Intentional Programming", Microsoft Research MSR-TR-95-52, September 1995. [Microsoft Research](https://www.microsoft.com/en-us/research/publication/the-death-of-computer-languages-the-birth-of-intentional-programming/); [PDF copy](https://uni.r-brause.de/seminare/SemSS07/simonyi95death.pdf). Full.
2. [C2] Unison, "The big idea". [unison-lang.org](https://www.unison-lang.org/docs/the-big-idea/). Full.
3. [C3] R. Tate, M. Stepp, Z. Tatlock and S. Lerner, "Equality Saturation: A New Approach to Optimization", Logical Methods in Computer Science 7(1:10), 2011 (extended version of POPL 2009). [arXiv:1012.1802](https://arxiv.org/abs/1012.1802). Full.
4. [C4] M. Willsey, C. Nandi, Y. R. Wang, O. Flatt, Z. Tatlock and P. Panchekha, "egg: Fast and Extensible Equality Saturation", POPL 2021. [arXiv:2004.03082](https://arxiv.org/abs/2004.03082). Full.
5. [C5] Tacit. [github.com/weetster/tacit](https://github.com/weetster/tacit). Full (README).
6. [C6] X07. [github.com/x07lang/x07](https://github.com/x07lang/x07). Full (README).
7. [C7] Codifide. [github.com/codifide/codifide-programming-language](https://github.com/codifide/codifide-programming-language). Full (README).
8. [C8] NAIL. [pypi.org/project/nail-lang](https://pypi.org/project/nail-lang/). Full (project description).
9. [C9] M. Allamanis, P. Chanthirasegaran, P. Kohli and C. Sutton, "Learning Continuous Semantic Representations of Symbolic Expressions", ICML 2017 (PMLR 70). [arXiv:1611.01423](https://arxiv.org/abs/1611.01423). Full.
10. [C10] Y. Gurevich, "Sequential Abstract State Machines Capture Sequential Algorithms", ACM TOCL 1(1), 2000. [doi:10.1145/343369.343384](https://doi.org/10.1145/343369.343384); [PDF copy](https://www.cs.tau.ac.il/~nachumd/models/gurevich.pdf). Full.
11. [C11] M. Fowler, "Event Sourcing", 2005. [martinfowler.com](https://martinfowler.com/eaaDev/EventSourcing.html). Full.
12. [C12] The Elm Architecture. [guide.elm-lang.org](https://guide.elm-lang.org/architecture/). Full.
13. [C13] P. Alvaro, W. R. Marczak, N. Conway, J. M. Hellerstein, D. Maier and R. Sears, "Dedalus: Datalog in Time and Space", UC Berkeley EECS-2009-173, December 2009. [PDF](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2009/EECS-2009-173.pdf). Full.
14. [C14] J. M. Hellerstein and P. Alvaro, "Keeping CALM: When Distributed Consistency is Easy", 2019. [arXiv:1901.01930](https://arxiv.org/abs/1901.01930). Full. The formal proof is T. J. Ameloot, F. Neven and J. Van den Bussche, "Relational transducers for declarative networking", JACM 60(2), 2013.
15. [C15] Temporal, "Workflow Definition". [docs.temporal.io](https://docs.temporal.io/workflow-definition). Full.
16. [C16] Restate, "Key Concepts: Durable Execution". [docs.restate.dev](https://docs.restate.dev/foundations/key-concepts#durable-execution). Full.
17. [C17] C. Bhandari, "Protocol-Aware Deterministic Simulation Testing", TigerBeetle, 20 August 2026. [tigerbeetle.com](https://tigerbeetle.com/blog/2026-08-20-protocol-aware-dst/). Full.
18. [C18] FoundationDB, "Simulation and Testing". [apple.github.io/foundationdb](https://apple.github.io/foundationdb/testing.html). Full.
19. [C19] musil (project description, version 0.35.6). [pypi.org/project/musil](https://pypi.org/project/musil/). Full.
20. [C20] AILANG. [github.com/sunholo-data/ailang](https://github.com/sunholo-data/ailang). Full (README).
21. [C21] agent-scroll. [github.com/p-vbordei/agent-scroll](https://github.com/p-vbordei/agent-scroll). Full (README).
22. [C22] C. Lattner et al., "MLIR: A Compiler Infrastructure for the End of Moore's Law", 2020. [arXiv:2002.11054](https://arxiv.org/abs/2002.11054). Full.
23. [C23] OMG, MDA Guide Version 1.0, 2003. [PDF](https://www.omg.org/mda/mda_files/MDA_Guide_Version1-0.pdf). Full.
24. [C24] M. Petre, "UML in practice", ICSE 2013. [author copy](https://oro.open.ac.uk/35805/). Full.
25. [C25] Protocol Buffers overview. [protobuf.dev](https://protobuf.dev/overview/). Full.
26. [C26] Lumos introduction. [docs.lumos-lang.org](https://docs.lumos-lang.org/getting-started/introduction). Full.
27. [C27] Forge. [github.com/Sanjith-Shan/Forge](https://github.com/Sanjith-Shan/Forge). Full (README).
28. [C28] Faber Romanus. [github.com/faberlang/faber](https://github.com/faberlang/faber). Full (README).
29. [C29] Intent. [github.com/lhaig/intent](https://github.com/lhaig/intent). Full (README).
30. [C30] NanoLang. [github.com/jordanhubbard/nanolang](https://github.com/jordanhubbard/nanolang). Full (README).
31. [C31] J. W. Backus et al., "The FORTRAN Automatic Coding System", 1957. [Computer History Museum copy](https://archive.computerhistory.org/resources/text/Fortran/102663113.05.01.acc.pdf). Full.
32. [C32] Z. Manna and R. Waldinger, "A Deductive Approach to Program Synthesis", ACM TOPLAS 2(1), 1980. [doi:10.1145/357084.357090](https://doi.org/10.1145/357084.357090). Full.
33. [C33] B. Böckeler, "Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl", martinfowler.com, 15 October 2025. [martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html). Full.
34. [C34] S. Bursuc, T. Ehrenborg, S. Lin et al., "A benchmark for vericoding: formally verified program synthesis", 2025. [arXiv:2509.22908](https://arxiv.org/abs/2509.22908). Full.
35. [C35] X. Leroy, "Formal verification of a realistic compiler", CACM, 2009. [PDF](https://xavierleroy.org/publi/compcert-CACM.pdf). Full.
36. [C36] G. Klein et al., "seL4: Formal Verification of an OS Kernel", SOSP 2009. [PDF](https://www.sigops.org/s/conferences/sosp/2009/papers/klein-sosp09.pdf). Full.
37. [C37] A. Solar-Lezama, L. Tancau, R. Bodik, V. Saraswat and S. Seshia, "Combinatorial Sketching for Finite Programs", ASPLOS 2006. [PDF](https://people.csail.mit.edu/asolar/papers/asplos06-final.pdf). Full.
38. [C38] T. Hubert et al., "Olympiad-level formal mathematical reasoning with reinforcement learning", Nature, 2025. [Nature](https://www.nature.com/articles/s41586-025-09833-y). Full.
39. [C39] C. Sun et al., "Clover: Closed-Loop Verifiable Code Generation". [arXiv:2310.17807](https://arxiv.org/abs/2310.17807). Full.
40. [C40] C. Yang et al., "AutoVerus". [arXiv:2409.13082](https://arxiv.org/abs/2409.13082). Full.
41. [C41] Y. Sun, J. Liu, D. Kroening and J. Xue, "Agentic Model Checking", 2026. [arXiv:2605.21434](https://arxiv.org/abs/2605.21434). Full.
42. [C42] A. Cunha, "Verified LLM-Driven Synthesis for Concept Design", 2026. [arXiv:2607.15718](https://arxiv.org/abs/2607.15718). Full.
43. [C43] Vera. [github.com/aallan/vera](https://github.com/aallan/vera). Full (README).
44. [C44] Vow. [github.com/vow-lang/vow](https://github.com/vow-lang/vow). Full (README).
45. [C45] Thermite. [github.com/dollspace-gay/Thermite](https://github.com/dollspace-gay/Thermite). Full (README).
46. [C46] Decision models as a class: see the decision-head section above and its sources [B7; B8; B12].
47. [C47] J. Schmidhuber, "Goedel Machines: Self-Referential Universal Problem Solvers Making Provably Optimal Self-Improvements", TR IDSIA-19-03 (v5, 2006). [arXiv:cs/0309048](https://arxiv.org/abs/cs/0309048). Full.
48. [C48] E. Yudkowsky and M. Herreshoff, "Tiling Agents for Self-Modifying AI, and the Löbian Obstacle", MIRI early draft, 7 October 2013. [PDF](https://intelligence.org/files/TilingAgentsDraft.pdf). Full.
49. [C49] G. Wang et al., "Voyager: An Open-Ended Embodied Agent with Large Language Models", 2023. [arXiv:2305.16291](https://arxiv.org/abs/2305.16291). Full.
50. [C50] E. Zelikman, E. Lorch, L. Mackey and A. T. Kalai, "Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation", COLM 2024. [arXiv:2310.02304](https://arxiv.org/abs/2310.02304). Full.
51. [C51] J. Zhang, S. Hu, C. Lu, R. Lange and J. Clune, "Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents", ICLR 2026. [arXiv:2505.22954](https://arxiv.org/abs/2505.22954). Full.
52. [C52] A. Novikov et al., "AlphaEvolve: A coding agent for scientific and algorithmic discovery", Google DeepMind white paper, 2025. [arXiv:2506.13131](https://arxiv.org/abs/2506.13131). Full.
53. [C53] J. Bader, A. Scott, M. Pradel and S. Chandra, "Getafix: Learning to Fix Bugs Automatically", OOPSLA 2019. [arXiv:1902.06111](https://arxiv.org/abs/1902.06111). Full.
54. [C54] K. Etemadi et al., "Sorald: Automatic Patch Suggestions for SonarQube Static Analysis Violations", 2021 (v2 2022). [arXiv:2103.12033](https://arxiv.org/abs/2103.12033). Full.
55. [C55] K. Liu et al., "TBar: Revisiting Template-based Automated Program Repair", 2019. [arXiv:1903.08409](https://arxiv.org/abs/1903.08409). Full.
56. [C56] R. Landauer, "Irreversibility and heat generation in the computing process", 1961. [doi:10.1147/rd.53.0183](https://doi.org/10.1147/rd.53.0183). Full.
57. [C57] C. H. Bennett, "Logical Reversibility of Computation", 1973. [doi:10.1147/rd.176.0525](https://doi.org/10.1147/rd.176.0525). Full.
58. [C58] L. Chen, M. Zaharia and J. Zou, "FrugalGPT", 2023. [arXiv:2305.05176](https://arxiv.org/abs/2305.05176). Full.
59. [C59] M. H. Erol, B. El, M. Suzgun, M. Yüksekgönül and J. Zou, "Cost-of-Pass: An Economic Framework for Evaluating Language Models", ICLR 2026. [arXiv:2504.13359](https://arxiv.org/abs/2504.13359). Full.
60. [C60] S. Kapoor, B. Stroebl, Z. S. Siegel, N. Nadgir and A. Narayanan, "AI Agents That Matter", 2024. [arXiv:2407.01502](https://arxiv.org/abs/2407.01502). Full.
61. [C61] H. Pan, L. Huang, X. Zhou, M. Xing and Y. Wu, "Toward Compiler World Models: Learning Latent Dynamics for Efficient Tensor Program Search", 2026. [arXiv:2606.09312](https://arxiv.org/abs/2606.09312). Full.

**Not carried over from the survey**, because the primary source was not obtained or did not support the claim: Smalltalk image claims, Darklang hashing, Pantograph and Grove, Codong, Lume, Magpie, Codex (Tedrow), Spec IR, Boruna, d-raft, Sockudo, DBOS, P language compilation to C, UNCOL and ANDF, Thrift and OpenAPI, Pact, Aver, Prove, reqlan, translation validation (Pnueli), SyGuS, Futamura and Turchin, PAR, DéjàVu and Gabel and Su, Simon and Kadane, and the comparative scoreboard.

<div id="1-history-seventy-years-of-say-what-you-want-get-the-program" class="anchor-alias" aria-hidden="true"></div>

## 1. 歴史 - 「望むものを述べ、プログラムを得る」という七十年

本テーマの背後にある願望は古くからあるものである。変化したのは、その構成要素のうちどの部分が現在では低コストで実現できるかという点である。以下のタイムラインは主要な試みを列挙し、その後の本文では各試みが達成したことと、どこで行き詰まったかを述べる。

![1954年のFORTRANから始まり、演繹的合成、プログラム導出、第四世代言語とCASEツール、第五世代プロジェクト、「銀の弾などない」、精錬手法とモデル駆動アーキテクチャ、検証済みシステムであるCompCertおよびseL4、大規模言語モデルによるコード生成、制約付きデコーディングと検証器ループを経て、決定論的チェッカーを伴う学習済み提案器という未解決問題に至るタイムライン](/figures/rce-jepa/timeline.svg)

*図 9. 意図の記述から動作するプログラムへの変換を試みた取り組み。CASEはコンピュータ支援ソフトウェアエンジニアリング、UMLは統一モデリング言語、Z・B・VDM（ウィーン開発手法）は数学的仕様記述手法、Coqは証明支援系を指す。緑：機械検証済みシステム。琥珀：学習済みモデル。青：本テーマが研究する問い。*

- **自動プログラミング、1950年代。** FORTRAN（FORmula TRANslation）は「FORTRANオートマティック・コーディング・システム」として発表された。その著者らは、その目的はIBM 704が「自ら問題をコード化し、人間のコーダーと同等の優れたプログラムを（ただしエラーなしに）生成できるようにすること」であると記した（Backus et al., 1957, p. 188; PDF p. 2）。例として、科学者が数式を記述し、システムが機械語コードを生成した。今日これはコンパイラと呼ばれており、自動プログラミングとは呼ばれない。
- **演繹的合成、1960年代-80年代。** Simonのヒューリスティック・コンパイラ（1963年）は、プログラミングをヒューリスティックな問題解決として扱った。すなわち、汎用問題解決器（GPS）上に構築された手段-目的探索であり、「選択的試行錯誤探索」によって事前・事後の状態記述からルーティンを記述するものである（Simon, RAND RM-3588-PR, 1963, Summary, p. vii）。MannaとWaldinger（1980年）は、プログラムを仕様が充足可能であるという構成的証明から抽出されるものとして扱った。「そのような証明から、zを計算するプログラムを抽出できる」（Manna and Waldinger, STAN-CS-78-690, 1978, Specification section; 同一の文がTOPLAS論文, 1980, p. 92にも現れる）。両バージョンとも「実装は存在しない」と注記している（report, Motivation, p. 2; TOPLAS, p. 91）。JACM論文はSimonの結論を直接述べている。「コンパイルタスク、少なくとも単純なコンパイルタスクは、問題解決タスクとして有益に捉えることができる」（Simon, 1963, Summary, p. 505）。また、実用的な主張は一切行っていない。「ここで述べるヒューリスティック・プログラミング手続きについて、コンパイラ構築への実用的アプローチとしての主張は一切行わない」（Introduction, p. 493）。MannaとWaldingerは、定理証明が「十分に強力な自動定理証明器の開発が行き詰まったように見えたとき、プログラム合成へのアプローチとして放棄された」と観察した（TOPLAS, 1980, p. 120）。4つのテキストはすべて全文を読んだ。
- **プログラム導出、1975年-86年。** Dijkstraはガード付きコマンドをプログラムの「構成要素として」導入し、最終状態の条件からの「プログラムの形式的導出」を提示した（Dijkstra, EWD 472, abstract）。Birdのリストの計算体系（Bird-Meertens形式主義）は、代数的恒等式による書き換えによって「効率的な解を導出するために用いられる」（Bird, 1986, PDF p. 3）。例として、Griesの問題「リストのすべてのセグメントの和の最小値を計算する」に対して、直接的なプログラムはO(n^3)ステップを要するが、この計算体系による書き換えによって「線形時間アルゴリズム」が得られる（Sec. 4.2, PDF p. 34）。
- **第4世代言語、CASEツールおよびエキスパートシステム、1980年代。** レポートジェネレータ、フォームビルダー、ダイアグラムツールは、画面と図からプログラムを生成することを約束した。Brooksは1986年にグラフィカルプログラミング、自動プログラミング、エキスパートシステムを検討し、それらのいずれも「1桁の改善すら約束しない」と論じた（Brooks, 1986, PDF pp. 1, 8-11）。Kemererは先行研究を引用しつつ、「導入から1年後、CASEツールおよび技法の70パーセントは一切使用されない」こと、および「統合CASEツールを用いて書かれた最初のプロジェクトは、改善された結果を提供することに典型的に失敗する」と報告した。彼はこの放棄の一因を、旧技術を下回った後に上昇する学習曲線に帰している（Kemerer, 1992, pp. 23-24, Fig. 1）。
- **日本の第五世代コンピュータシステムプロジェクト、1982年-92年。** 論理プログラミング（Prologファミリー）に基づく国家的取り組みであり、ICOTは10年間にわたり「約540億円、すなわち約4億5000万米ドル」を費やした（van de Riet, 1993, Sec. 1, p. 83）。1981年の計画における目標の一つは、「ソフトウェア生成の負担を軽減し、高水準の要件仕様が自動処理に十分となるようにすること」であった（Sec. 3, p. 85）。並列推論マシンは100 MLIPSの目標を達成したが、van de Rietは「アーキテクチャにおけるブレークスルー」および「ソフトウェアにおけるブレークスルー」を失敗と評価し、技術的影響は「小さい」と判断した（Sec. 6, p. 103）。システムのプログラミングに要する労力については、「ほとんど証拠がない」（Sec. 4.1, p. 86）。
- **精錬およびモデル駆動手法、1980年代-2000年代。** Z、B、VDMは数学的仕様をコードへと段階的に精錬する。Object Management GroupのModel Driven Architectureガイドは「システムに対して3つの視点、すなわち計算独立視点、プラットフォーム独立視点、プラットフォーム依存視点を規定する」（OMG, 2003, Sec. 2.2.5, PDF p. 13）。例として、クラス図を一度描くことでJavaおよびSQL（Structured Query Language）を生成する。Hutchinson et al.は、MDEが「実証的データの支援をほとんど受けずに開発されてきた」と指摘した（2011, Sec. 1, p. 471）。250名以上の実務者を対象とした調査では、74%がMDEは「大幅な追加訓練を必要とする」と回答し（Sec. 4.3.1, p. 475）、ある回答者は内部では4倍から8倍の生産性を報告しながら、外部には「1.5倍から2倍」と伝えていると述べた（Sec. 5.2.6, p. 478）。著者らは自らの結果を「結論的というよりも興味深く示唆的なもの」と呼んでいる（Sec. 3.1, p. 473）。
- **機械検証システム、2008年-09年。** CompCertは、「意味論的保存の証明」がCoq証明支援系において実施されたCコンパイラである（Leroy, 2009, abstract, PDF p. 1）。seL4は「8,700行のCコード」からなるマイクロカーネルであり、機械検証された「機能的正当性の証明」を持つ（abstract, PDF p. 1）。その証明には「約20人年」のコストを要した（Klein et al., 2009, Sec. 5.2, PDF p. 13）。Coqは証明済み関数を「OcamlやHaskell、Schemeなどの関数型言語」の通常のコードへと抽出できる（Letouzey, 2008, Sec. 1, PDF p. 1）。ただし、抽出ステップ自体はまだ機械的に検証されておらず、その正当性は紙上の証明に依拠していた（Sec. 6, PDF p. 10）。

<div id="2-why-the-earlier-attempts-stalled" class="anchor-alias" aria-hidden="true"></div>

## 2. 以前の試みが停滞した理由

- **本質的複雑性と偶発的複雑性。** Brooksは「抽象的なソフトウェア実体を構成する複雑な概念構造を形成するという本質的タスク」と「これらの抽象的実体をプログラミング言語で表現するという偶発的タスク」を区別した（要旨、PDF p. 1）。彼はParnasを引用し、「自動プログラミングとは、プログラマが当時利用可能であったよりも高水準の言語でプログラミングすることの婉曲表現に過ぎなかった」と述べ（PDF p. 9）、「完全なプログラム検証でさえ、プログラムが仕様を満たすことを確立できるに過ぎない」と記した（PDF p. 11）（Brooks, 1986）。例として、給与計算規則のより優れた記法は、その規則がいかにあるべきかを決定しない。
- **自然言語は曖昧である。** Dijkstraは、形式的テキストとは「よく考えてみると、母国語を使用する際にはほぼ回避不可能なあらゆる種類のナンセンスを排除するための、驚くほど効果的な道具である」と論じた（Dijkstra, EWD 667, para. 6）。例として、「ユーザを名前と日付でソートせよ」という文には少なくとも二通りの解釈がある。
- **仕様の作成コストはプログラムと同等である。** seL4においては、抽象仕様の作成に「約4人月」を要し、証明には約20人年を要したのに対し、カーネル自体の構築には「Haskellの取り組みを含む合計2.2人年」が費やされた（Klein et al., 2009, Sec. 5.2, PDF pp. 12-13）。この20人年には約9人年の研究および再利用可能な証明ツールの開発が含まれており、seL4固有の証明は「11人年であった」（PDF p. 13）。
- **組み合わせ探索。** すべてのプログラムを探索することは、プログラムの長さに対して指数的に増大する。DreamCoderはこの問題に対し、再利用可能な部品のライブラリと、「ウェイク-スリープ」ループにおいて「プログラムの探索を誘導する」ニューラルネットワークを学習することで対処する（Ellis et al., 2021, 要旨, PDF p. 1）。同論文はこのような探索を「探索空間の組み合わせ的性質のため、汎用アルゴリズムには扱いきれない」と表現し（序論, PDF p. 2）、補足資料においてもプログラムの発見は「無限に大きく組み合わせ的な探索空間のために困難である」と繰り返している（supplement S4.1, PDF p. 42 of the version with supplement）。これは演繹的合成を制限したものと同種の探索問題である。
- **脆弱性と普及。** 図からコードへの変換ツールが生成したコードはその後手動で編集され、モデルとコードの間に乖離が生じた。Petreは先行調査から、「モデル中心アプローチの最大の問題として認識されているのは、モデルをコードと同期させ続けることである（68%の同意）」と報告している（Forward and Lethbridge, as reported by Petre, 2013, author copy p. 3）。Petre自身の50名の情報提供者のうち、35名はUML（統一モデリング言語）を使用しておらず、3名が自動コード生成を使用していた（pp. 4-5）。CASEおよびモデル駆動工学の普及に関する研究は台帳上で未読として記録されており、それらからの数値は引用しない。
- **見解。** 共通する問題は、各アプローチが一つのコスト（記法、証明、生成）を解決する一方で、別のコスト、すなわち仕様の記述、プログラムの探索、または結果の検証が手動のまま残されたという点である。

<div id="3-three-lanes" class="anchor-alias" aria-hidden="true"></div>

## 3. コードの世界に向けた三つのレーン

第1節で述べた願望は古くからあるものである。2026年11月までに変化したのは、それぞれ独自の理由のもとで研究を進めてきた複数の研究プログラムが、学習済み提案器を「可否を判定できる何か」と組み合わせるようになったという点である。本節では三つのレーンを記録する。レーンとは収束観測であり、方向性における一致を意味するものであって、順位付けではなく、あるプログラムが別のプログラムを代替するという主張でもない。以下に示す数値はすべて引用元の報告値そのままである。第3.3節の最終行を除き、いずれもReality Code Engineの実測値ではない。

<div id="lane-training" class="anchor-alias" aria-hidden="true"></div>

### 3.1 一般的なアーキテクチャによる訓練

このレーンは広く使用されているモデル形状を維持する。通常は次のトークン（単語片）を予測するデコーダであり、学習データまたは報酬を変更する。

| 主体 | 報告内容 | その情報源における未解決事項 |
| --- | --- | --- |
| Meta FAIR CodeGen。CWM、320億パラメータの密なデコーダ [B23] | モデルがテキストのみでなく実行を参照する場合、コードの学習効果が高まる。中間学習ではPythonトレースおよびエージェント軌跡を使用する。SWE-bench Verifiedにおけるベースモデルのpass@1は53.9%、テスト時に16サンプルのベストを用いると65.8%。LiveCodeBench 68.6%。CruxEval-O 94.3%。1億2,000万件のトレース済み関数。1万200枚の画像から得られた300万件のForagerAgent軌跡。80億パラメータのアブレーション: トレースによりCruxEval-Oが44.6から73.9へ向上し、ForagerによりSWE-bench Verifiedが18.4から22.1へ向上する。 | 著者らはトレース予測を「第一歩」と呼ぶ。ニューラルデバッガおよび検証への応用は、同報告書における将来課題である。 |
| SWE-RL、Wei et al. | プルリクエスト履歴に対する強化学習。報酬はオラクルパッチとの類似度であり、意味的同一性ではない。Llama3-SWE-RL-70BはSWE-bench Verifiedにおいて41.0%と報告されている。 | 報酬は意味的同一性ではない。 |
| SWE-smith、Yang et al. | リポジトリごとの合成タスク: 5万インスタンス、128リポジトリ。SWE-agent-LM-32BはSWE-bench Verifiedにおいてpass@1 40.2%。 | 論文内では教師あり微調整のみ。強化学習はSkyRLという外部システムである。 |
| DiffuCoder、Gong et al. Mercury、Inception Labs | 非自己回帰型（マスク拡散）コード生成。DiffuCoderは1,300億トークンで学習した70億パラメータモデルであり、coupled-GRPOはEvalPlusにおいて追加で4.4%の改善と報告されている。MercuryはH100上で毎秒1,109および737トークンと報告されている。 | 自己回帰モデルとの品質同等性は、ここで参照した情報源では確立されていない。 |
| PatchDiff、Wang、PradelおよびLiu。METR、Becker et al. | ベンチマークは成功を過大評価し、現場の生産性は低下しうる。PatchDiff: 正解とカウントされたパッチの7.8%が開発者テストに失敗し、解決率は約6.4ポイント過大評価されている。METRによる2025年初頭のツール評価: 開発者16名、タスク246件、測定された完了時間は19%高い。24%低下という予測および20%低下という事後推定は、その測定結果と一致しなかった。 | いずれの検証も2025年初頭から中頃のツールを対象としている。 |
| SWE-Bench Pro、Scale AI。2026年11月6日取得の公開リーダーボード | 汚染への耐性（コピーレフトおよびプライベートリポジトリ）と長い変更の要求を目的として構築されている: 4.1ファイルにわたる平均107.4行。1,865タスク、41リポジトリ（公開731、プライベート276、保留858）。当日の公開ボード: Muse Spark 1.1が61.50 +/- 3.10、gpt-5.4 (xHigh)が59.10、Muse Sparkが55.00、claude-opus-4-6 (thinking)が51.90、gemini-3.1-proが46.10。上位4件はmini-swe-agentで実行された。同ページの公開テキスト: GPT-5が23.3%、Opus 4.1が23.1%であり、SWE-bench Verifiedにおける70%超と対比される。プライベートセット: Opus 4.1が17.8%、GPT-5が14.9%。ページには更新日が記載されていない。 | オラクルは依然としてfail-to-passおよびpass-to-passテストである。 |
| Multi-SWE-bench、ByteDance Seed | Java、TypeScript、JavaScript、Go、Rust、CおよびC++にわたる課題解決。68名のアノテータによる2,456件の候補から1,632インスタンス。 | 2026年11月のリーダーボード数値は取得されなかった。このページには記載がない。 |

**レーン読解。** 上記の訓練レポートはセマンティクスへと向かっている：チェッカーが観測可能な実行トレース、環境ダイナミクス、および報酬である。テストスイートは依然としてオラクルであり、PatchDiff はテストスイートが不完全であることの証拠である。SWE-Bench Pro のボードはその公開時のテキストよりも高く、依然としてテストによってパッチを採点している。それが Laws of Coding の名が指し示す開口部である。厳密なチェッカーは「テスト通過」を受理済みフォームへと置き換える。受理は世界の一部であり、事後的に適合されたスコアではない。

<div id="lane-hybrids" class="anchor-alias" aria-hidden="true"></div>

### 3.2 創造的なハイブリッド手法

このレーンは、学習済みの提案器と、既に存在するゲート（評価器、証明カーネル、型システム、またはサンプル集合）とを組み合わせるものである。

| 誰が | 報告された内容 | その出典において未完了のもの |
| --- | --- | --- |
| AlphaEvolve、Google DeepMind [C52] | 大規模言語モデルがコード編集を提案する。進化的ループがそれを包む。自動評価器が判定する。4×4複素行列乗算を48回のスカラー乗算で実現。また、データセンタースケジューリング、回路簡略化、および自身の学習の高速化も達成しており、ここでは追加の数値は用いない。 | 評価器が存在する場合にのみ機能する。 |
| AlphaProof、Google DeepMind [C38] | Lean内でAlphaZero方式の強化学習を行う。形式的環境が推論を基礎づける。8000万件の自動形式化された命題。2024年国際数学オリンピックにおいて、幾何以外の5問中3問を解き、AlphaGeometry 2との組み合わせで銀メダル相当の成績を達成した。計算には複数日を要した。 | 計算コスト。報告は数学に関するものであり、ソフトウェアではない。 |
| DeepSeek-Prover-V2-671B | DeepSeek-V3による部分目標分解、部分目標の証明を連鎖的思考のコールドスタートに結合し、その後強化学習を行う。Lean 4カーネルがゲートとして機能する。miniF2F-testの通過率88.9%。PutnamBench 658問中49問。新たに325問からなるProverBenchを構築。形式的設定において2024年および2025年のAIME（アメリカ招待数学試験）15問中6問を解き、非形式的多数決によるDeepSeek-V3の8問に対する結果と比較される。 | 数学に関するものであり、ソフトウェアではない。形式的手法と非形式的手法の間のギャップは依然としてゼロではない。 |
| Kimina-Prover Preview、MoonshotおよびNumina | Qwen2.5-72Bを基盤とする。Lean 4における形式的推論パターンを用いた大規模強化学習。miniF2F pass@8192で80.7%。15億パラメータおよび70億パラメータの蒸留モデルが公開された。 | プレビューリリースである。 |
| Goedel-Prover、Princeton | 自然言語問題をLeanに自動形式化（164万件の命題）。専門家反復により80万件以上の証明を構築。教師あり微調整のみ。miniF2F pass@32で57.6%。PutnamBench pass@512で7問。 | バージョン1では強化学習を用いない。 |
| Vericodingベンチマーク、Beneficial AI Foundation [C34] | 形式仕様からコードと証明を生成する。12,504件の仕様。成功率はDafny 82.2%、Verus 44.2%、Lean 26.8%。要旨ではこれらをそれぞれ82%、44%、27%に丸めており、これは以下のコミットメント節における丸め処理と一致する。内訳はDafny 3,029件、Verus 2,334件、Lean 7,141件である。この研究系列におけるDafny検証は1年間で68%から96%に向上した。自然言語による記述の追加効果は小さい。 | 仕様を記述するコストは依然として残る。 |
| 型制約付きデコーディング、Mündler et al. | 型システムがトークンサンプリングを制約する。著者はスイス連邦工科大学チューリッヒ校およびカリフォルニア大学バークレー校に所属する。HumanEvalでコンパイルエラーが75.3%、MBPP（同報告で言及された短いPythonセット）で52.1%減少。構文のみの制約では両セットでそれぞれ9.0%および4.9%の改善にとどまる。 | TypeScriptの規模のみ。型は動作の完全な受理を意味しない。 |
| DreamCoder（Ellis ら）、LILO（Grand ら） | 圧縮によるライブラリ学習。LILOは大規模言語モデルと記号的リファクタリング（Stitch）を追加する。DreamCoderは第2節の本文中から引用されている。LILOはこのパスでは抽象レベルにある。 | 当該レーンのために読んだ文献における小規模なドメイン固有言語。 |
| egg（Willsey ら）[C4] | 等価飽和: 等価なプログラムの集合を一つのe-グラフとして格納する手法。Principles of Programming Languages、2021年。 | 書き換え規則は依然として人手で記述する必要がある。 |
| ARC Prize 2024（Chollet、Knoop、Kamradt、Landers）、Akyurek ら | 深層学習に誘導されたプログラム合成とテスト時訓練の組み合わせ。ARC-AGI-1のプライベートスコア（Abstraction and Reasoning Corpus）は2024年中に33%から55.5%へ向上した。85%という目標は達成されなかった。Akyurek らはタスクの例に対して推論時に重みを更新し、80億パラメータモデルでARCパブリック検証セットにおいて53.0%、プログラム合成とのアンサンブルで61.9%を達成した。 | 85%の目標は達成されなかった。Akyurek の手法は少数ショット方式である。 |
| ARC Prize 2025 結果ページ | ARC-AGI-2プライベートにおける上位入賞者（タスクあたりのコスト上限0.20ドル）。同ページに記載の優勝エントリであるNVARCは24.0%を達成し、合成データ、テスト時訓練、および小規模な再帰的ネットワークを用いた。ARChitectsは16.5%で、再帰的精緻化を伴う二次元マスク拡散言語モデルである。MindsAIは12.6%。同ページの論文賞: 約700万パラメータの小規模再帰的ネットワークがARC-AGI-1で約45%、ARC-AGI-2で約8%を達成; SOAR（同ページが命名する、自己ファインチューニングを伴う進化的プログラム合成）がARC-AGI-1で最大52%を達成; CompressARC（事前学習なしの最小記述長手法）がARC-AGI-1で約20%から34%、ARC-AGI-2で約4%を達成。 | グランプリは受賞者なしに終わった。インタラクティブトラックであるARC-AGI-3は開発中である。 |
| Large Concept Models（Meta FAIR） | トークンではなく、文埋め込み空間SONAR（同報告書に記載の文埋め込み空間、200言語）における自己回帰予測。平均二乗誤差、拡散、および量子化バリアントを含む。約1.3兆トークンで訓練された16億パラメータモデル群。一つのアーキテクチャは約2.7兆トークンで70億パラメータへスケールされた。 | 要旨においてコンセプトは文であり、代理表現にとどまる。コード固有の結果は示されていない。 |

**レーン読解。** これらのハイブリッドはいずれも、上述の原理に示された形状を持つ: モデルが提案し、決定論的ゲートが判定する。AlphaEvolve と AlphaProof は明確な接点である。Lean の証明器も同じ形状であり、カーネルがゲートとして機能する。それらが報告する成果は、そのカーネルに対して生成されたデータから得られたものである。ARC Prize 2025 のページは、プログラム探索、テスト時訓練、拡散、および小規模再帰ネットを一つのループ上に示している: 提案し、例と照合し、精緻化する。共有される限界もまた共有されている。それらは評価器、カーネル、または例の集合を必要とする。Laws of Coding とは、そのような種類の環境が、数学やベンチマークカーネルに限らず、一般的なコーディングにも存在するという主張である。Large Concept Models は、言語における JEPA のトークンフリーの最近縁種であり: 概念空間における予測を行うが、依然として厳密な受理ステップを持たない。

<div id="lane-formula" class="anchor-alias" aria-hidden="true"></div>

### 3.3 計算・プログラミング・コーディングの再概念化

このレーンはベンチマークスコアから始まるのではない。プログラムとは何かという質問から始まる。

| 対象 | 報告内容 | 当該出典で未完了の事項 |
| --- | --- | --- |
| HVM2, Higher Order Company | 計算モデルとしての相互作用コンビネータであり、並列性がモデルに内在する。本ページはこのモデルを引用する。 | 当該論文の図表は本ページでは用いない。実運用における採用は未解決である。 |
| Unison [C2] | 定義は構文木のハッシュである。名前はそのハッシュ上のビューである。本言語は実運用に供されている。 | エコシステムの規模。 |
| Lean、Dafny、Verus の各コミュニティ（ベンチマーク vericoding [C34] を経由） | 証明は、カーネルが検査可能なプログラムである。正しさは検査可能な対象である。本ページで用いる測定上の下限は上記の vericoding の行である。 | 仕様を記述するコストは依然として残る。 |
| egg [C4] | プログラムの同値類をデータとして扱う。プログラムは商集合の中に存在する。 | 書換え規則の完全性。 |
| Lean FRO（Focused Research Organization）、Year 1 ロードマップ、2023年8月から2024年7月 | 数学、およびソフトウェアとハードウェアの検証のための言語兼証明支援系としての Lean。当該ページが挙げる成果物には、標準ライブラリ、モジュールシステム、Lake と Reservoir、証明自動化、機械学習との統合、新しいコード生成器が含まれる。 | 後続年度のロードマップは本ページでは用いない。 |
| Conal Elliott、表示的設計 | 「インスタンスの意味は、意味のインスタンスである」。意味論的モデルが正しさを定義し、それを実装へと伝達する。当該ノートは2009年のものであり、2016年に改訂された。 | 手作業による設計規律。 |
| Radul と Sussman、プロパゲータ | 計算を、共有セルに情報を付加する自律的な機械として捉える。本枠組みは、式指向プログラミングと制約プログラミングを、増分的な分散探索を含めて統一する。2009年の技術報告であり、Scheme による実装を伴う。 | 採用状況。 |
| Chollet、知能の測定について [T37] | 知能を技能獲得の効率として捉える。ARC が測定手段であり、プログラム合成が枠組みである。2019年の論文を引用根拠とする。課題遂行の時点で行う合成に関する後の講演は、単独では引用しない。ARC Prize 2024 報告が深層学習に導かれたプログラム合成に言及する箇所では、当該報告を引用根拠とする。 | 形式的な測定法は、本レーンで読んだ抄録の範囲では ARC を超えて操作化されていない。 |
| 本プロジェクト、Laws of Coding | 正準形式が対象である。表層テキストは射影である。コストは計数される。測定結果は次のとおりである。H1: 185 プログラムにわたる中央値 rho 9.34。H2: `C_check / E_model = 0.000582 <= 0.05`（M5 Max 上で `1,718×` 安価）。H5 と H11: `FormEBM-v2`（AUROC `0.8922`、5段階単調性 `93.0%`）、およびスパン正規化を施した `FormEBM-v3`（`6.05M` パラメータ、AUROC `0.9437`、`E_depth` の単調性 `94.0%`、`E_total` の単調性 `92.0%`。ゼロショット OOD の H15 プール AUROC は `0.2585` から `0.5278` へ改善）を用い、未見の互いに素な Form 形状を対象とする。H7: 1,275 個の変異体、ファズ化された腕で違反 0 件。H8: 10,500 ストリーム、6 ターゲット、不一致 0 件。H14 run 3: 151 件のうち 111 件（73.5%）がモデル呼出し 0 回で完了。H15: 残存する 40 課題にわたり、単発では 17/40 から 34/40 へ。`FormJEPA-v1`（`8.42M` パラメータ、`474.76 mJ` RAPL コア `reported_j`）では `27/40`（`k = 16`）。`Opus 5.5` と `Sonnet 5.5` 上の `H15-Iterative` では `40/40`（矛盾 `0` 件）。`40/40` の 0 呼出し Gear-0 リプレイ（`0.325 µs`、プローブあたり `1.77 µJ`）。`Zipf(0.85)` において `16.67×` の 3-Gear エピソード削減（`200/200` 採用）。151 課題の `rce repair` の段階 `f` 監査（`3/119 = 2.5% > 2.0%`、矛盾 `0` 件、`observe` に留まる）。 | 完全な意図から Form への合成（H3）、`0.5278` を超えるモジュール横断のシグネチャとトレースに対する OOD エネルギー較正、H4、H6、H9、H10、H12、H13、H15 の拡散腕および進化腕、そして壁面電力計による `measured_j` は未解決のままである。 |

**レーン読解。** Unison（同一性は構造のハッシュである）、egg（等価クラスとしてのプログラム）、インタラクションネット（局所書き換えとしての計算）、および証明支援系（オブジェクトとしての正しさ）は、コーディングの法則が一体として述べることの一断片をそれぞれ保持している: 一つの正準形式、厳密な再現、ターゲットへの射影、そして検査可能な受理である。Elliottのデノテーショナル設計とプロパゲータによる説明は、同一の要求のより早い表明である: 意味が実装を定義し、計算はテキストを出力するだけでなく情報を付加する。これらは独立した収束であり、それぞれ異なる出発点から生じている。Cholletの尺度は、計数すべき対象がシステムがスキルを獲得する効率であると述べており、それゆえ提案者比較は呼び出し予算と物理的エネルギーの両方を追跡する（セクション 8）。

<div id="4-why-now-the-case-for-closed-form-deterministic-ai-proposed-code" class="anchor-alias" aria-hidden="true"></div>

## 4. 今なぜか - 閉形式・決定論的・AI提案コードの根拠

**この節は意見であり、上記の歴史と第3節の3つのレーンから構築されたものである。テストすべきケースであり、結果ではない。**

- **チェッカーは安価で信頼できる。** 以前の試みがそれらを欠いていたのに対し、Csmithというランダムプログラム生成器を用いて、著者らはCompCertが「Csmithが誤コードエラーを見つけられなかった唯一のコンパイラ」であることを「約6 CPU年」の試行の後に確認した（Yang et al., 2011, Sec. 3.1, PDF p. 6）。機械検証された規則は、生成器が持たない信頼性を提供できる。CompCert自体もこのパターンを使用している。レジスタ割り当ては検証されていないグラフ彩色ヒューリスティックを実行し、各結果をCoqで証明された検証器でチェックする。なぜならグラフ彩色は「直接正しさを証明するよりも事後的に検証する方が容易」だからである（Leroy, 2009, Sec. 4.2, PDF p. 7）。
- **決定的セマンティクスが非決定性問題に答える。** 生成器が変化できても、受理された成果物が正確にチェックされ再現されるなら、モデルの実行間変動は結果に影響しなくなる。
- **ループ内検証者の証拠が存在する。** AlphaCodeの行動フィルタリング、Codex-Sのオラクルテスト選択（77.5% 対 44.5% の対数確率順位付け）、Clover、AutoVerus、AlphaProofはすべて、チェックが提案の中から選択する際に大幅な利得を示す。第3節は後続システムでも同様の形状を記録している。すなわち、モデルが提案し、評価者、証明カーネル、または型システムが決定する。
- **学習予測子は潜在空間で機能するようになった。** I-JEPA と V-JEPA 2 は、対象の詳細すべてを予測するのではなく要約を予測することで、これらのタスクでうまく機能することを示した。V-JEPA 2 は5つのロボットタスクのうち4つで成功率が高く（1つは同率）、比較対象の生成ビデオモデルに対して約15倍高速に計画した（Table 3, PDF p. 15）。プログラムでは、識別子の綴り、フォーマット、ターゲット言語などの詳細は、構造が選択された後に決定的に埋め込むことができる。第5節は前提と、Forms と Laws of Coding が存在した時点で止まる場所を述べている。
- **トークン単位生成はコストが高い。** LLaMA 65B は 8 から 32 台の V100 GPU に分散され、512 トークン出力制限の下で「出力トークン1個あたり約3-4ジュール」のエネルギーを消費した（GPUエネルギーのみカウント）（Samsi et al., 2023, Secs. III-C and IV-C, PDF pp. 4-6）。88モデルの研究では、テキスト生成モデルは1,000クエリあたり平均0.047 kWh（キロワット時）を消費し、各クエリは10トークンのみ生成した（Table 2）。さらに「汎用的生成アーキテクチャはタスク固有システムに比べて桁違いに高コスト」であることが示された。これは生成器が「全語彙全体」から選択するためである（Luccioni et al., 2024, abstract, PDF p. 1; Sec. 4.1 and Table 2, PDF p. 6; Sec. 4.2.1, PDF p. 8）。
- **同一ホストでのチェック対モデル比較（Section 8, H2）。** 外部 V100 の数値とローカルノートブックの計測を混在させるのではなく、第8節は同一 Apple M5 Max ホスト上で両方を測定した。Form チェックは `0.04904 J`、ローカル `Qwen 3.6 35B-A3B` の候補は `84.25 J`（許容された残差修正は `124.81 J`）である。

<div id="what-could-still-fail" class="anchor-alias" aria-hidden="true"></div>

### 依然として失敗しうる要因

- **Expressiveness ceiling (H6).** 実際のプログラムが Form が表明できない副作用や非決定性を必要とする場合、"すべてのコード" 前提が失敗する。  
- **Intent may be the bottleneck.** 出力空間が小さくても、未指定の意図は解消されない。シグナル: H1 と H2 は成立するが H3 が失敗する。  
- **Spec gaming.** チェッカーは Form が形式的に正しく、宣言された性質を満たすことを証明するが、ユーザーの意図と合致しているかは保証しない。ベンチマークタスクは再生によって検証される行動トレースを含み、残存リスクはラベル付けされ、解決されない。  
- **Corpus scarcity.** シグナル: コーパスが増大しても H3 が平坦になる。  
- **Collapse.** JEPAs は I-JEPA と V-JEPA 2 の EMA（指数移動平均）ターゲットエンコーダのようなアンチコラプス手段を必要とする。LeCun (2022) は VICReg スタイルの情報最大化を提案している（Sec. 4.5）。コラプスした Form 埋め込みは H5 を失敗させる。Section 5 はこの制限を他と並べて述べている。  
- **Measurement error.** ルートレスカウンタ（macmon `IOReport` L2、カーネル `ri_energy_nj` L3、RAPL）は SoC またはプロセスカウンタ（`reported_j`）をカバーするが、交流（AC）壁電力（`measured_j`）はカバーしない。  
- **Baseline drift.** 共有ホスト上の共同テナントプロセスが L2 アイドルベースラインをドリフトさせる（Falsifier 6）、そのためプロセス識別子（PID）ごとの L3 カウンタまたは専用アイドルホストが必要になる。

<div id="5-jepa-as-premise" class="anchor-alias" aria-hidden="true"></div>

## 5. 前提としてのJEPA、およびその限界

前提は変わらない。JEPA は生の入力空間ではなく埋め込み空間で予測を行う。論文は LeCun の 2022 年のその考えの声明を引用している。V-JEPA 2 は 62 時間のロボット動画と、65 % から 80 % へのゼロショットピックアンドプレイス成功率を報告している [B1]。同じ報告書の提案者セクションが述べるように、アクション条件付き予測器は 62 時間未満のラベルなしロボット動画で訓練された。LLM-JEPA は、自然言語から正規表現へのタスク、GSM8K（小学校レベルの数学セット）および Spider（テキストからデータベースクエリへのセット）において、1 億パラメータ規模で埋め込み空間損失がトークン損失を上回ることを報告している（Huang, LeCun and Balestriero, 2025）。コードに関しては、有用な対象はトークンではなく意味であるという直感と一致する。

Form が存在し、Coding の法則が同値性と受容性を固定すれば、前提は手法全体ではなくなる。以下の 6 つの制限が続く。これらは提案者を広げる理由であり、前提を放棄する理由ではない。

1. **近似的な幾何学で、正確なものが計算できる場合。** JEPA は近似的な潜在幾何学を学習する。Coding の法則は正確なものを提供する：標準 Form とチェッカーがすでに決定する同値性である。自己教師ありでそれらを学習すると、計算可能なマップにデータを費やすことになる。H10 は、商集合上で学習することでデータが節約できるかどうかのテストであるが、実行されていない。

2. **崩壊。** 表現の崩壊とそれに対する正則化子の必要性は JEPA 訓練における未解決問題である。正確な標準化器は崩壊し得ない。損失ではなく規則により、各表層プログラムを一つの Form に写像する。

3. **ネイティブな受容がない。** JEPA にはネイティブデコーダも受容ステップもない。コードは離散的で検証可能な出力を必要とする。エネルギースコアは候補を順位付けするが、決定はしない。決定はチェッカーが行う。

4. **点であり、商集合ではない。** 代替 Form は商集合である。多くの表層プログラムが一つの Form に対応し、一つの Form が多数のターゲットに射影できる。JEPA は点を埋め込むが、二つの点が同一 Form であることを保証しない。e-graph は保証する。構造のハッシュも同様である。第 8 節では、`rce fmt nameless` が `9` 個のアルファリネームされたローカル変数ミュータントのうち `7` を、モデル呼び出しゼロで同一のメモリマップド Gear-0（`DNULLMM1`）スロットにマッピングしている。

5. **証拠の規模。** LLM-JEPA の証拠は 1 億から 2 億パラメータ規模で、小規模データセット上で得られている。このページの参照元では、リポジトリ規模のコードに対する JEPA 訓練は示されていない。

6. **学習された計画のコスト。** V-JEPA 2 のモデル予測制御（MPC）は、1 アクションあたり約 16 秒かかっている [B1]。安価な正確チェッカー（`7.32 ms`, `49.04 mJ` L3 `reported_j` on M5 Max）と Gear-0 ルックアップ（`0.325 µs`, `1.77 µJ`）による Form の探索は、学習されたプランナーが訓練される前に繰り返しロールアウトコストを抑える。

**結果。** JEPA は前提として残る：意味を予測し、テキストを予測しない。提案者スロットは Form 上の任意の学習提案者へ一般化できる。第 3 節で名前が挙げられた例は、訓練途中で実行される自己回帰モデル（CWM）、拡散コードモデル、形式環境での強化学習（AlphaProof と Lean プローバー）、進化的探索（AlphaEvolve）、ライブラリ学習（DreamCoder と LILO）、制約付きデコードである。大規模概念モデルは言語において前提の隣に位置し、コードではまだ実現されていない。ゲートはそれらすべてに共通である。第 6 節が分類体系であり、第 7 節が提案先の世界を示す。

<div id="6-proposer-slot" class="anchor-alias" aria-hidden="true"></div>

## 6. 提案者スロットはアーキテクチャ中立である

図 1 は 1 本のパイプラインを描く。学習されたボックスはスロットであり、単一のアーキテクチャではない。JEPA は図中のインスタンスである。ボックスの外側に描かれたゲートは、別のプロポーザーが接続されても変わらない。表は、セクション 3 で読み取る各種プロポーザーについて、何を学習し、Coding の法則（正規化器、チェッカー、コストメータ）から何を必要とし、ソースがすでに名前付けしている失敗モード、そしてどの仮説を移動させるか、あるいは移動させる可能性があるかを示す。セクション 8 では、最初の目的訓練された潜在 Form JEPA 修復プロポーザー（`FormJEPA-v1`、`8.42M` 学習可能パラメータ）と、40 の残差タスクに対する 6 つの市販の自己回帰型、推論型、ハイブリッド Gated-DeltaNet / MoE モデルの両方を報告する。

| 提案者 | 学習する内容 | 検証者から必要なもの | 既知の失敗モード | 移動する・移動するであろう仮説 |
| --- | --- | --- | --- | --- |
| JEPA、埋め込み予測器（Section 8 の `FormJEPA-v1`） | Form の構造と編集の近似潜在幾何学（EMA ターゲットエンコーダ + VICReg + 潜在条件付き型編集デコーダ） | 正規化器、チェッカー、コストメータ、離散編集ヘッドが必要。エネルギースコアは受理しない | ネイティブな受理がない。校正されていない潜在距離だけでは AUROC `0.618` を示し、コンパクトな非事前学習モデルは Gear-2 フォールバックなしでオープンなマルチモジュール API 移行（H15 で `0/9`）を見逃す | `FormJEPA-v1` は H15 で測定され（`k = 1` で `22/40`、`k = 16` で `27/40`）、非重複合成欠陥（`177/200`）でも評価された。完全な intent-to-Form H3、校正済み H5/H11、H10、H13 は未解決のままである |
| 自己回帰 / 推論 / トレース学習デコーダ（Claude、Grok、オープンウェイトの生成事前学習トランスフォーマー（GPT-OSS）、DeepSeek、Qwen 3.6、CWM クラス） | 次トークン予測、チェーン・オブ・ソート推論、ハイブリッド Gated-DeltaNet / MoE、または実行トレース | 受理としてのチェッカー、加えて Gear-0 結晶化により再帰形状がモデルを再呼び出ししないようにする | トークン空間でのリトライはローカル候補ごとに `84.25 J` を消費（`Qwen 3.6`）、長い推論トレースは固定完了上限を使い切る可能性がある（`DeepSeek V4.1` `17/40`） | Section 8 で測定された最初の単発（`k = 1`） H15 アームは `17/40` から `34/40` の範囲である。RJ-F6 はトレース学習トークンモデルが等エネルギーで Form-quotient 学習と一致するかをテストする |
| 拡散コードモデル | 左から右へのトークンストリームではなく、マスクまたはノイズ除去されたプログラム | 受理時のチェッカーが必要。制約はサンプリング中にも機能し得る | 自己回帰モデルとの品質同等性はここで参照された資料では確立されていない | H15 の拡散アーム（オープン） |
| 形式環境における強化学習 | AlphaProof および Section 3 の Lean プローバーのようにカーネルが受理するステップ | カーネルが環境である。ソフトウェアにおいてはその役割はチェッカーである | ここで読まれた報告ではドメインは数学であり、ソフトウェアではない。計算コストは AlphaProof の結果の一部である。Goedel-Prover バージョン 1 には強化学習がない | 同一ループを Forms 上で実行した場合の H3 と H12（オープン） |
| 進化的探索 | AlphaEvolve および ARC Prize 2025 ページの SOAR のように、評価者によって保持または除外される編集 | 評価者が必要。ここでは評価者はチェッカーであり、単なるテストスイートではない | 評価者が存在する場所でループは機能する。ARC のような例示的チェックはソフトウェアの一般的な受理規則ではない | H15 の進化的アーム、H14 の残差上（オープン） |
| ライブラリ学習（DreamCoder、LILO） | 圧縮による再利用可能ライブラリで、ループに大規模言語モデルの有無に関わらず | ライブラリが生成するプログラムに対するチェッカー | この分野で参照されたソースのドメインは小規模である | H10（オープン） |
| 制約付きデコード | 重みには新しい情報はない。制約は不正なトークンをマスクし、型制約レポートと同様である | サンプリング時の文法または型システム、そして振る舞いを検証するチェッカー | 主な結果は TypeScript スケールである。構文と型は完全に受理されていない。コンパイルエラーは HumanEval で 75.3%、MBPP で 52.1% であり、構文のみの場合の 9.0% と 4.9% に対して大幅に減少した | H3、失敗のうち型失敗である部分のみ |
| 大規模概念モデル | 次のトークンではなく、次の文の埋め込み | 抽象にはない正確な受理ステップ | 概念は文である。抽象にはコード固有の結果がない | コード結果が存在するまで H1 から H15 のいずれも該当しない |

提案者セクションの決定的ラダーは、これらのいずれよりも先に実行される（H14: `111/151` が `0` 呼び出しで閉じられ、残り `40` のタスクが残る）。第 8 節では、6 つのモデルからなる市販 H15 ベースラインと Shape D（`DNULLMM1`）Gear-0 結晶化、そして目的別に訓練された `FormJEPA-v1` アームと 3-Gear カスケードをこれら 40 のタスクに対して報告すると同時に、拡散および進化的アーム、Form H3 への意図、wall-meter サーバーのジュール等価性を明示的に開いたままにしている。

<div id="7-world-of-code" class="anchor-alias" aria-hidden="true"></div>

## 7. コードの世界

**定義.** コードの世界は、形態（Forms）の状態空間に、正確な遷移と正確な受理規則を加えたものである。論文の記法では、状態空間は S、遷移は関数 δ、受理は形態に対するチェッカーの判定である。「世界モデル」は、コードに対してこの空間のモデルを意味する。物理的な世界モデルとは異なり、物理は正確に知られている。論文の第 4 部では JEPA スタイルの予測器について述べられている。同じ物理が第 6 節のすべての提案者を制限する。CWM はトレースからインタプリタを学習する。V-JEPA 2 はビデオから物理を学習する。形態においては遷移が与えられており、次状態に不可分なノイズは存在しない。

**学習が除去され、残る場所.** 正規化、同値性、リプレイは計算である。コーディングの法則がそれらを固定すれば、モデルはそれらを学習する必要がない。残って学習すべきは、明示された意図から形態への写像、探索の指導、そして決定的な階段が残す余地（`40` の実歴タスク、H14 ラン 3 後）をランク付けすることである。任意の提案者が残余タスクのいずれかを解決しゲートを通過すると、Gear-0 の結晶化によりすべての再帰（および `7/9` の alpha-renaming が `rce fmt nameless` 下で行われる）を `0.325 µs` の決定的ルックアップに変換する。

**評価.** テストスイートはコーディングの法則ではない。PatchDiff は、正しくカウントされたパッチの 7.8% が開発者テストに失敗し、解決率が約 6.4 ポイント過大評価されていることを報告している。METR 試験は 16 人の開発者、246 タスク、早期 2025 ツール使用時の測定完了時間が 19% 高いことを報告している。SWE-Bench Pro は、2026 年 11 月 6 日取得のボード上で、依然として fail-to-pass と pass-to-pass テストをオラクルとして使用している。Multi-SWE-bench は言語セットを Java、TypeScript、JavaScript、Go、Rust、C、C++ に拡大する。このページの受理はゲート（`rce check` が終了コード `0` で、義務保存があること）であり、`rce hash` と `rce equiv` による歴史的オリジナルとの更なる検証が行われている。

**拡張された主張の反証者.** 第 8 節で他と共に述べられた RJ-F6 は、形態商を提案者の助けとする観測を指す。すなわち、トークン空間モデルが残余 40 タスクを等エネルギーかつ等ゲート受理で閉じても、形態商がない場合に敗北するという観測である。単発フロンティアトークンモデルは初回遭遇で最大 `34/40`（`85.0%`）を閉じるが、`FormJEPA-v1`（商正規化された形態 S-式上の `8.42M` パラメータ）は、`27/40`（`k = 16`）でローカル 35B トークン空間修復に匹敵し、報告された `reported_j` が一桁オーダー低く、`rce fmt nameless` が alpha-renaming 下で `7/9` のゼロコール商ヒットを供給する。等サイズ商対表面サンプル効率テスト（H10）と意図から形態への H3 は依然として未解決である。

<div id="8-one-concrete-instance-the-reality-code-engine" class="anchor-alias" aria-hidden="true"></div>

## 8. 一つの具体的な実例 - Reality Code Engine

RCE は可能な他の形態のうちの一つの閉じたプログラム形であり，上記の質問は小さく検査可能なプログラム形を持つ任意の言語に適用できる。RCE においてすべてのプログラムは Form P = (S, E, δ, D, λ) で表される。

- **S, state:** プログラムが保持する型付けされたデータで，例としてエディタのカーソル位置やテキストバッファがある。
- **E, events:** プログラムが受け取ることのできる入力で，例として「キーが押された」や「ファイルが開かれた」などがある。
- **δ (delta), transition function:** 現在の状態とイベントから次の状態を導く規則である。
- **D, derivations:** 手順のハッシュ連鎖された記録で，すべての実行をビット単位で再現可能にする。
- **λ (lambda), output:** 与えられた状態に対してプログラムが表示または出力するもので，例として可視化されたテキスト行がある。

チェッカーは Form を受理するか，破る規則の名前を返す。コミット `f87d6af2`（2026年11月23日；Rust チェッカーバイナリは `1762fb4b` から変更なし）において，公開リファレンスチェッカーは受理された Form を正確に再生し，`2,236` 件の適合性テストのうち `2,221` 件を失敗 `0` 件で通過（`837` 件の Rust ユニットテスト），Rust，Python，JavaScript，Scala を出力し，`64` モジュールにまたがる `1,264` 個のソース宣言から生成された `5,393` 個の Lean 4.36.0 カーネル定理定数（定理 T1 から T63，Linux `bubblewrap` 内で `lake check --paranoid` の6つの独立した証明チェッカーすべてにより検証済み）に裏付けられている。Apple M5 Max 上では，デュアルチャネル `reported_j` レシートが Form チェックあたり `49.04 mJ`（L3 `ri_energy_nj`，`7.32 ms`/Form）を記録し，62 Form の完全チェック，トレース実行，五対象出力スイートでは `15.44 J`（`2.32 s`/パス；`measured_j = None`，`board_metered = false`）となる。完全な説明は [RCE topic page](/about/rce/) および [github.com/openIE-dev/rce](https://github.com/openIE-dev/rce) にある。

**RCE-JEPA** はスレッドが検索可能であるように保たれた作業名である。対象は World Coding である。JEPA（joint embedding predictor）は前提であり，意味を予測し，表層テキストを予測しない。提案者スロットは Form 上の任意の学習済み提案者である。チェック、証明，導出，出力，配置は RCE に残る。目的はクロックサイクルあたりおよびジュールあたりの最高性能を達成することである。*作業仮説:* すべてのコードが Form にエンコードできるなら，すべてのコードはそれに対する joint embedding またはエネルギーベースモデルによって生成できる。以下の仮説は証拠がこれを反証できるように設計されている。

<div id="defined-quantities" class="anchor-alias" aria-hidden="true"></div>

### 定義された量

- **出力空間。** 語彙 V 上の長さ L の自由形式生成の生の空間は |V|<sup>L</sup> である。Ω<sub>n</sub>（オメガ）はサイズ n（Form ノード）の有効な Form の集合であり、Ω<sub>n</sub><sup>✓</sup> ⊆ Ω<sub>n</sub> はチェッカーが受理する部分集合である。log<sub>2</sub>|Ω<sub>n</sub>| ビットとして報告され、文法のカウントとサンプリングにより推定される。
- **記述長さ。** b(P) は Form P を正準的にエンコードするビット数であり、b(code) = トークン数 × log<sub>2</sub>|V| は同等の出力ソースに対して得られるビット数である。比率 ρ（ロー）は b(code) / b(P) である。
- **検証コスト。** C<sub>check</sub>(P): チェッカーが P を判定する際の実時間、サイクル数、ジュール数。ユニットテストは C<sub>test</sub> を与え、合格テストは証拠であり、証明ではない。
- **受理確率。** a = P(チェッカーが受理しタスク仕様が満たされる | 意図) であり、ベンチマーク上の pass@1 として測定される。
- **受理プログラムあたりのジュール数。** J<sub>acc</sub> = (E<sub>model</sub> + E<sub>check</sub> + E<sub>retry</sub>) / N<sub>accepted</sub>、ベンチマーク実行全体で合計される（L2/L3 カウンタ用に `reported_j` としてラベル付けされ、外部ハードウェア電力計が接続された場合にのみ `measured_j` として測定される）。
- **受理プログラムあたりのサイクル数。** K<sub>acc</sub>、CPU（中央処理装置）または GPU のサイクル数で、カウンタが読み取れる場合に同様に測定される。
- **AUROC**（受信者操作特性曲線下面積）: ランダムに選択された受理された Form が、変更が必要なランダムに選択された Form よりも低エネルギーである確率であり、0.5 が偶然、1.0 が完全を示す。

**議論（意見、検証すべき点）。** Form には固定された構成規則を持つ 5 つの型付きスロットがある。出力を Ω<sub>n</sub> に制約することで、モデルが参照される前に |V|<sup>L</sup> の大部分が除去され、プログラムあたり予測されるビット数が減少する（ρ > 1）。チェッカーは確率的テストの代わりに明確な判定、すなわち受理または変更要求を行い、変更要求の判定は安価で構造化されており、規則名が示されるため、再試行は盲目的ではなく指示に従って行われる。

<div id="hypotheses" class="anchor-alias" aria-hidden="true"></div>

### 反証可能な仮説H1からH15

すべての十五の仮説を数値順に示す。H1 から H7 は RCE-JEPA 論文を直接検証し、H8 から H10 は上記の「コーディングの法則」論文を検証し、H11 から H13 は提案者を検証し、H14 はその下にある決定論的ラダーを測定し、H15 は Shape D (`DNULLMM1`) Gear-0 結晶化における 40 タスク残差に対する提案者クラスを比較する。

| ID | 仮説 | 指標 | 支持条件 | 反証条件 |
| --- | --- | --- | --- | --- |
| H1 | Form 空間は、同一のプログラムについてソース空間よりはるかに小さい。**手書きコーパスにおいて支持される**(185 プログラムにわたる中央値 ρ = 9.34) | ρ = b(code)/b(P)、コーパス全体の中央値 | ρ ≥ 5 | ρ < 2 |
| H2 | 検査器は生成に比べて安価である。**Apple M5 Max 上の `reported_j` において支持される**: `C_check / E_model = 0.04904 J / 84.25 J = 0.000582`(`1,718×` 安価; `measured_j = None`) | 候補ごとの C<sub>check</sub> / E<sub>model</sub>(ジュール) | ≤ 0.05 | ≥ 0.5 |
| H3 | 表現空間上の予測は有用な受理率に到達する | 未見の intent-to-Form タスクにおいて受理された Form の pass@1 | 同一タスクにおけるベースライン pass@1 以上 | ベースラインの 0.5 倍未満 |
| H4 | 受理されたプログラムあたりのエネルギーが低下する | J<sub>acc</sub>(RCE-JEPA) / J<sub>acc</sub>(ベースライン) | ≤ 0.1 | ≥ 1 |
| H5 | エネルギーの順位付けは有効な Form に質量を集中させる。**未見のテスト Form 形状において AUROC 閾値を達成**: 対照学習型 `FormEBM-v2`(`5.85M` パラメータ)は未見形状において AUROC **`0.8922 >= 0.85`**(解決可能な top-1 精度 `84.05%`)に到達した。スパン正規化された分解型 `FormEBM-v3`(`6.05M` パラメータ)は、未見形状の AUROC を **`0.9437 >= 0.85`**(`E_def` 単独では `0.9386`)へ引き上げた。これは `200` の未見テストビームにわたる `3,064` 候補に対するものであり、較正されていない `FormJEPA-v1` の `0.618` と比較される。解決可能な top-1 精度は `E_def` で `83.44%`、`E_total` で `80.98%` である(全 `200` ビームに対する生の値はそれぞれ `68.0%` / `66.0%`)。`rce check` の呼び出し回数は `2.23×` / `2.14×` 少ない。ゼロショットの OOD H15 プール AUROC は `0.2585` から `0.5278` へ上昇した(大スパンの有効例と短スパンの無効例の比較では `0.6018`)。一方、モジュール横断の署名・トレース OOD 較正は未解決のままである | 受理された候補と変更を要する候補に対する E の top-1 型検査合格率; AUROC | top-1 の有効率 ≥ 0.8; AUROC ≥ 0.85 | AUROC ≤ 0.6 |
| H6 | 参照アプリケーションは符号化可能である | 6 つの参照アプリケーションと RCEdb のうち、検査器を通過し、ビット同一に再生される Form として完全に表現されるものの割合 | 7 件中 7 件 | いずれかのアプリが Form 外の脱出ハッチを必要とする |
| H7 | セキュリティはモデルに依存しない(ファジングアーム: 1,275 個の変異体で違反 0 件; モデルアームは未決) | 検査器が受理した敵対的 Form(ファジングおよびモデル生成)のうち、明示された不変条件に違反するもの | 0 | 1 件以上の確認された違反 |
| H8 | 決定性: 受理されたすべての Form は、ビット同一の軌跡および出力に再生される。**支持される**(6 ターゲットにわたる 10,500 ストリームで不一致 0 件) | 少なくとも 3 つの異なるマシンおよびオペレーティングシステム上で記録された、少なくとも 10,000 件のイベントストリームにわたる不一致数 | 0 | 単一の不一致 |
| H9 | コストは実行前に予測される | 指定されたマシン上で、名前付き計測器(J 単位)により測定されたエネルギーに対する、テストファミリーにわたるコストテーブル予測の中央誤差 | ≤ 20% | > 50% |
| H10 | 商空間上の学習はデータを節約する | 正準 Form の予測器が、表面コードで同サイズのデータを学習した予測器と同じテスト受理率に到達するために必要な学習例数 | 高々半分(2 倍以上の節約) | 1.25 倍未満の節約 |
| H11 | エネルギーは編集距離に対して単調である。**未見の 5 段階累積欠陥連鎖において支持される**: 対照学習型 `FormEBM-v2` は厳密な 5 段階単調性として `93.0% >= 80%`(Spearman `ρ = 0.9931`)に到達した。2 ヘッド型 `FormEBM-v3` は、`E_depth` で **`94.0% >= 80%`**(`94/100`、Spearman `ρ = 0.9966`)、複合 `E_total` で **`92.0% >= 80%`**(`92/100`、Spearman `ρ = 0.9846`; 較正されていない `FormJEPA-v1` は `36.0%`)に到達した。同一系列に限定した制約なしのランダムウォーク区間では、`v2` が `38.0%`、`v3` の `E_depth` / `E_total` がそれぞれ `32.0%` / `18.0%` に達した | 受理された適合点から編集距離 1 から k まで増加するにつれて、エネルギー E が上昇するテストファミリーの割合 | ファミリーの ≥ 80% | ファミリーの < 80% |
| H12 | 決定ヘッドはゲート結果に対して較正されている | 10<sup>4</sup> 件の受領記録の後、決定種別ごとの ECE | ECE ≤ 0.1 かつ形状ハッシュに対する頻度表より良好 | ECE > 0.2、または頻度表より良好でない |
| H13 | 離散潜在表現は、長い編集系列において連続表現より良く計画する | 編集系列長 1, 5, 20 における計画成功率(離散アームと連続 SIGReg アームの比較) | 長さ 20 において離散アームが高い | いずれのアームも H3 の閾値に到達しない |
| H14 | 決定論的な階段は、モデル呼び出しなしでタスクの一部を完了する。**登録された規則により支持される**: 3 回の登録実行 [B30, B31, B32] の結果を表の下に報告する | 公開の決定論的階段(再利用、型による検索、確定的書き換え、有界列挙)が、登録タスク集合のうちモデル呼び出し 0 回で完了させる割合。すべての完了は検査器により受理され、階段のコミットは凍結されている | 登録タスクの ≥ 10%。完了させた各規則の段階を併せて報告する(登録閾値、変更なし)。実測: 実行 1 では 120 件中 118 件(98.3%)で、規則が構造上反転させる変異に対するものである。実行 2 では 151 件中 31 件(20.5%)で、うち 27 件はガード否定である。実行 3(プレーンアーム)では 151 件中 111 件(73.5%)で、うち 110 件はガード否定と改名である | 登録タスクの < 10%(RCE 論文の反証 RCE-F1 と同じ下限)。いずれの実行でも未達。実際の履歴から得た 41 タスク(規則が特に取り上げないもの)では、実行 2 と 3 がそれぞれ 41 件中 1 件(2.4%)を完了させた |
| H15 | 提案器クラスは 40 タスクの残余において異なる。**単発提案器 [B33]、`FormJEPA-v1` [B34]、有界な検査器フィードバック付きの `H15-Iterative` + `FormEBM-v2` [B35]、スパン正規化された `FormEBM-v3` [B36] にわたって測定される**: 単発モデルは `17/40` から `34/40` を受理した。`FormJEPA-v1` は `22/40`(`k = 1`; `FormEBM-v2` 併用で `25/40`、`FormEBM-v3` の `E_def` を用いると型付きで `24/40`、複数提案器で `27/40`)および `27/40`(`k = 16`)を受理した。`H15-Iterative` は `Opus 5.5` と `Sonnet 5.5` において矛盾 `0` 件で `40/40`(`100.0%`)を完了した(`Grok 4.20` では `39/40`)。ウォームな `DNULLMM1` Gear-0 は呼び出し `0` 回で `40/40` を再生した。3 段の Cascade は `Zipf(0.85)` 到着の `200/200` を受理し、Gear-2 エピソードは `16.67×` 少なかった。拡散型、進化型、およびウォール計測器アームは未決である | H14 実行 3 のプレーンアームに由来する 40 件の残余タスクのうち、ゲートが受理した割合(`C(z) = 1`)。`rce check`、義務保存、`rce hash`、`rce equiv` により監査する | 登録実行がアームごとの割合と局所的な `reported_j` [B33, B34, B35, B36] を報告する。拡散型・進化型アームおよびサーバーのウォール計測器との一致は未決のまま | 異なるタスクで採点された、または未検証の出力に基づくクラス分類 |

<div id="h14-result" class="anchor-alias" aria-hidden="true"></div>

**H14、測定済み。** このラダーは openIE-dev/rce の `rce repair` であり、提案者セクション上部の段と 2000 候補の列挙上限を持つ。3 つの実行があり、各実行は実行前に登録され、現在の結果はそれらの総合である。実行 1 [B30] は 120 タスクのうち 118 をモデル呼び出しなしで閉じたが、120 タスクのうち 119 は演算子および整数リテラルの変異であり、構成上列挙の反転を制限し、118 の閉鎖のうち 9 は例とチェックを通過したが元のプログラムではなかった。実行 2 [B31] には演算子またはリテラル変異がなく、openIE-dev/rce の git 履歴から 41 の変更、27 のガード否定、83 の名前変更、計 151 タスクがある。モデル呼び出しなしで 31 件 (20.5%) を閉じた：41 の履歴タスクのうち 1 件、すべての 27 のガード否定は `not` を除去する列挙編集により構成上変異が反転し、83 の名前変更のうち 3 件は元に戻されていない。41 の履歴タスクのうち 39 は言語変更によるプログラム更新であり欠陥ではなく、2 件だけがプログラムの欠陥であり、ラダーはそのうち 1 件を閉じた。ガード否定がなければ 124 タスク中 4 件が閉じる (3.2%)。実行 2 の予測 P3、すなわち名前変更の 10% から 40% が閉じるという予測は失敗し、偽証子 F1 が満たされた：実行 1 の閉鎖率は実際の履歴からの変更には引き継がれない。実行 3 [B32] は実行 2 の 151 タスクを変更せずに、openIE-dev/rce `8a5d90ea`、段 5、名前変更、段 4 の後に実行した。その登録記録は、名前変更が段 5 のクラス用に構築されたことを示す。平易な腕、すなわちタスクのみが与えられたラダーは、モデル呼び出しなしで 151 のうち 111 を閉じた (73.5%)、そのうち 103 は元に戻された：すべての 83 の名前変更 (段 5 が 80、段 4 が 3)、そのうち 77 が元に戻された；すべての 27 のガード否定、各々は実行 2 の結果と同じ；そして 41 の履歴タスクのうち 1 件は実行 2 と同じである。ガード否定がなければ 124 タスク中 84 が閉じる (67.7%)。既知の良好な腕は各タスクの元プログラムも提供し、151 のうち 116 を閉じ、114 を元に戻した：すべての 83 の名前変更が元に戻され、41 の履歴タスクのうち 6 件が含まれる。実行 3 の予測 P6、すなわち既知の良好な腕ではすべてのガードと履歴タスクが平易な腕の結果を保持するという予測は失敗した：履歴タスクが 5 件余分に閉じ、平易な腕で閉じたものが段 5 で閉じられ、段 3 ではなかった。実行 3 の 6 つの偽証子のいずれも満たされず、ラダーは両腕でモデル呼び出しゼロを報告した。H14 の登録規則は、登録タスクの 10% 以上がサポートされ、偽証が 10% 未満であること、すなわち公開決定的ラダーがモデル呼び出しなしで閉じる共有率、チェッカーが認めたすべての閉鎖、凍結ラダーコミットである。平易な腕はこれらの条件を満たす。規則により、H14 は支持される：実行 3 の平易な腕は 151 のうち 111 を閉じ (73.5%)、git 履歴からの残り 40 タスクが未解決のままである。

<div id="h15-result" class="anchor-alias" aria-hidden="true"></div>

**H2、シングルショット H15、そして Shape D（`DNULLMM1`）Gear-0 の 40 件のオープン残差タスク、測定 [B33]。** 実行前に登録（`rce-jepa-h15-and-shape-d-gear0-2026-11-22`、`sha256: b64c4c671ae85755...`）し、`openIE-dev/rce` コミット `1762fb4b`（`2026-11-20`、バイナリ `sha256: 1d3b0d07ff5b2e8f...`）に対して、40 件の残差タスク（`sha256: 3ca3a32769145e9b...`；`25` `W-SYN-1`、`5` `W-LEN-1`、`4` `W-NAME-1,W-TY-1`、`3` `W-NAME-1`、`1` `W-WORLD-1`、`1` `W-CAP-3,W-WORLD-1`、`1` `W-INT-1`）は厳格なゲート述語 `C(z) = 1` の下で評価された：（1）`rce check candidate.rce` が `0` で終了（`W-UI-1` と `W-MUT-1` の非空性を強制）、（2）`no_spec_deletion` がすべての宣言された `state`、`event`、`error`、`struct`、`kind`、`fn`、`extern`、`step` ヘッダーと、すべての `example` 左辺トレースおよびミュータントの `check` カウントを保持、（3）`rce hash`（`restored`）、`rce equiv fuel 2000`（`behaviour-equal`）、`rce repair` ラン `f` `observe` モードによる二次等価監査。

| アーム / アーキテクチャ ファミリー | モデル | 呼び出し回数 | 許可 (`C(z)=1`) | 復元 + 行動等価 | 入力 / 出力 トークン | コスト (\$) | チップ上 `reported_j` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Arm 0**: 形状 D コールド スタティック ギア-0 | `DNULLMM1` (0 records) + `a..e` | 0 | 0 / 40 (0.0%) | 0 | 0 / 0 | \$0.0000 | < 0.001 J (37.7 µs) |
| **Arm 1a**: クラウド 自己回帰 + 適応的 思考 | `claude-opus-5-5` | 40 | **34 / 40 (85.0%)** | 33 (30 + 3) | 114,855 / 32,159 | \$1.3783 | `not_available` (N) |
| **Arm 1b**: クラウド 自己回帰 + 適応的 思考 | `claude-sonnet-5-5` | 40 | **32 / 40 (80.0%)** | 32 (30 + 2) | 114,855 / 30,764 | \$0.8060 | `not_available` (N) |
| **Arm 2c**: クラウド 推論 トランスフォーマー | `xai:grok-4.20-0309-reasoning` | 40 | **31 / 40 (77.5%)** | 30 (28 + 2) | 76,546 / 18,474 | \$0.2747 | `not_available` (N) |
| **Arm 2a**: クラウド 推論 MoE (Cerebras) | `cerebras:gpt-oss-120b` | 40 | **29 / 40 (72.5%)** | 27 (25 + 2) | 78,825 / 43,596 | \$0.1340 | `not_available` (N) |
| **Arm 3**: ローカル ハイブリッド ゲート付きデルタネット + スパース MoE | `Qwen3.6-35B-A3B` (quantized `Q5_K_M`) | 40 | **27 / 40 (67.5%)** | 26 (25 + 1) | 82,330 / 18,411 | \$0.0000 | **3,369.89 J** system-under-test (`124.81 J/adm`) |
| **Arm 2b**: クラウド 多頭潜在注意 (MLA) スパース MoE (Fireworks) | `deepseek-v4p1-flash` | 40 | **17 / 40 (42.5%)** | 16 (15 + 1) | 63,446 / 64,215 | \$0.0930 | `not_available` (N) |
| **Arm 5a**: 目的特化 潜在形態 JEPA (`k = 1`) [B34] | `FormJEPA-v1` (`8.42M` params, greedy) | 40 | **22 / 40 (55.0%)** | 22 (20 + 2) | Form S-expr | \$0.0000 | **58.65 mJ** core / **1.19 J** pkg RAPL/prop |
| **Arm 5b**: 目的特化 潜在形態 JEPA (`k = 16`) [B34] | `FormJEPA-v1` (`8.42M` params, latent beam) | 40 | **27 / 40 (67.5%)** | 27 (25 + 2) | Form S-expr | \$0.0000 | **474.76 mJ** core / **6.74 J** pkg RAPL/prop |
| **Arm 6**: 3-ギア カスケード v1 (`t = 1` コールド Gear-0 → `FormJEPA-v1` → シングルショット `Opus 5.5`) [B34] | `DNULLMM1` + `FormJEPA-v1` + `Opus 5.5` | 13 G2 | **34 / 40 (85.0%)** | 33 | Form + 13 cloud | **\$0.8108** | `FormJEPA` RAPL + 13 cloud (N) |
| **Arm 4a**: 形状 D ウォーム Gear-0 v1 (`t = 2` リプレイ) [B33] | `DNULLMM1` (34 crystallized) | **0** | **34 / 40 (85.0%)** | 33 | 0 / 0 | **\$0.0000** | **0.325 µs / 1.77 µJ** probe + `rce check` |
| **Arm 7a**: 有界 チェッカー フィードバック + 標準ライブラリ ヘッダー (`<= 5` ターン) [B35] | `claude-opus-5-5` (`H15-Iterative`) | 42 | **40 / 40 (100.0%)** | 39 (34 + 5) | 133,527 / 45,711 | \$1.8104 | `not_available` (N) |
| **Arm 7b**: 有界 チェッカー フィードバック + 標準ライブラリ ヘッダー (`<= 5` ターン) [B35] | `claude-sonnet-5-5` (`H15-Iterative`) | 43 | **40 / 40 (100.0%)** | 39 (35 + 4) | 137,385 / 46,668 | **\$1.1122** | `not_available` (N) |
| **Arm 7c**: 有界 チェッカー フィードバック + 標準ライブラリ ヘッダー (`<= 5` ターン) [B35] | `xai:grok-4.20-0309-reasoning` (`H15-Iterative`) | 50 | **39 / 40 (97.5%)** | 37 (30 + 7) | 269,930 / 28,903 | \$4.0555 | `not_available` (N) |
| **Arm 4b**: 形状 D ウォーム Gear-0 v2 (`t = 2` フルリプレイ) [B35] | `DNULLMM1` (40 crystallized) | **0** | **40 / 40 (100.0%)** | 39 (34 + 5) | 0 / 0 | **\$0.0000** | **0.325 µs / 1.77 µJ** probe + `rce check` |

- **仮説 H2 が支持される（`1,718×` のローカルチェック対モデルエネルギー優位性）:** Apple M5 Max 上で、Form チェックのコストは `C_check = 0.049038 J`（L3 `ri_energy_nj`、`7.32 ms`）であり、ローカル `Qwen 3.6 35B-A3B` 候補生成のコストは `E_model = 84.247 J`（`3,303.62 J` L2 GPU + `66.26 J` L3 `llama-server` PID、40 候補に対して; `14,476.18 J` の総 L2 SoC、`derived_marginal_j` は Falsifier 6 により `68.31%` のアイドルドリフトで無効化）であり、**`C_check / E_model = 0.000582 <= 0.05`**（`measured_j = None`、`board_metered = false`）となる。
- **形状 D（`DNULLMM1`） ギア-0 のレイテンシ、エネルギー、無名不変性、そして `Zipf(0.85)` の償却:** 凍結された 34 レコードストア（`sha256: d92a57b40de0b0ec...`、再生前後でバイト単位で同一）に対する `40,000` 件のポータブルオペレーティングシステムインターフェース（POSIX） `mmap` 参照の平均プローブレイテンシは **`0.3246 µs`**（`324.6 ns`、`9,516.5` 命令）であり、**`1.771 µJ`**（`1,771.3 nJ` L3 `ri_energy_nj`）である。`rce fmt nameless`（定理 T7）でスロットをキー付けすると、ローカル変数がアルファリネームされた場合に **`7 / 9`（`77.8%`）** のゼロコールヒットが得られる。検証のみの結晶化下で `Zipf(s = 0.85)` の 200 到着ストリームを使用した場合、2-ギア `DNULLMM1` はモデル呼び出しを `200` から **`48`（`4.17×` 減少）** に削減し、`Opus 5.5`（`$6.81` から `$2.63`、`5.41×` / `37` 呼び出しでミス重複除去）、`Sonnet 5.5` で `56`（`3.57×`）、`Grok 4.20` で `57`（`3.51×`）、`GPT-OSS-120B` で `66`（`3.03×`）、ローカル `Qwen 3.6` で `94`（`2.13×` 呼び出し、**`1.56×` ローカルエネルギー削減**：`16,457.9 J` から `10,553.5 J`）となる。
- **H15 に関するスコープ開示:** 40 件の歴史的オリジナルのうち 2 件は `W-MUT-1` の空虚例規則（`spec/examples/57_float_vectors.rce@b2b932da` および `programs/multi/washer.rce@2cc82de7`）よりも前に作成されており、`34/40` 付近の上限の一部を占めている。拡散コードモデル、進化的 Form 探索、ハードウェア壁メータ `measured_j` は依然としてオープンである。

<div id="form-jepa-and-rung-f-result" class="anchor-alias" aria-hidden="true"></div>

**`FormJEPA-v1` 潜在Form修復提案器、3ギア・カスケード、および151タスクの`rce repair` rung `f`昇格監査、計測 [B34]。** 事前登録は、データセット生成、重み初期化、rung-f実行の前に行われた(`rce-jepa-form-jepa-v1-2026-11-22`, `sha256: 22682e6e936ec120...`; `rce-repair-rung-f-wave3-eval-2026-11-22`, `sha256: 04aff4b2b44cdbea...`)。対象は`openIE-dev/rce`のコミット`1762fb4b`(Linux x86_64バイナリ `sha256: 5ef9931ff23a310f...`)である。`FormJEPA-v1`(学習可能パラメータ `8,424,073`、EMAターゲットバッファを含めると `13,917,577`、チェックポイント `sha256: cbfbf2274175c737...`)は、ランダム初期化(`seed = 20261122`)から学習された。学習には、`1,387`個の一意なForm形状から、4層のパス、スラグ、宣言名、および`458`個のダイジェストに基づく`rce fmt nameless`による除外を経て抽出された`1,106`個の互いに素な有効Form形状にわたる、チェッカーで検証済みの`6,329`組の欠陥ペアが用いられた。除外後の形状は、151タスクのラダーおよび40個の残差タスクのいずれとも重なりが`0`である。

本モデルは、準正規化されたForm AST S式トークン上の6層Pre-LN Transformer文脈エンコーダ(`d = 256`)と、EMAターゲットエンコーダ(`τ = 0.996`)を組み合わせる。さらに、Smooth-L<sub>1</sub>とVICRegの分散-共分散による崩壊防止正則化の下で学習される3層残差MLP潜在予測器と、`||z_hat_y - E_ema(y_cand)||_2^2`によって再順位付けされる2層の潜在条件付き型付き編集デコーダから構成される。学習後、文脈の実効ランクはエポック0の`32.90`から**`85.24`**へ上昇し、座標標準偏差は`0.1038`から`0.3830`へ変化した。正例ペアの潜在L<sub>2</sub>エネルギーは`149.25`から`10.57`へ低下し、ランダムペアの`13.02`を下回った。

- **不整合合成、151-ラダー、および40-残差精度とモデル規模の関係：** `200`個の保持された不整合合成Form欠陥（未見の`shape_hash`）において、`FormJEPA-v1`は`k = 1`で**`156/200`（`78.0%`）**、`k = 16`で**`177/200`（`88.5%`）**を許容する。151-タスク・ラダー（plain arm）では、スタンドアロンの`FormJEPA-v1`が`27/151`（`k = 1`）および`57/151`（`k = 16`）を許容し、結合された決定論的ラダー（`111/151`）と`FormJEPA-v1 (k = 16)`を加えることで**`138/151`（`91.4%`）**に引き上げ、フロンティア呼び出しをゼロとする。40のオープン残差タスク（H15）では、`FormJEPA-v1`が`k = 1`で**`22/40`（`55.0%`）**、`k = 16`で**`27/40`（`67.5%`）**を許容する（`25`復元＋`2`挙動等価＝`27/27` behaves-the-same、平均`5.33`回の`rce check`呼び出し/タスク）。これは構造化文法、長さメソッド、および能力修復においてローカルの`Qwen 3.6 35B-A3B`（`27/40`）と一致し（`24/25` `W-SYN-1`、`2/5` `W-LEN-1`、`1/1` `W-WORLD-1`）、一方で`0/9`のマルチモジュール暗号化stdlib移行（`hpke`、`mls`、`pq`、`pqxdh`、`energy`にわたる`W-NAME-1` / `W-TY-1`）、複合`W-CAP-3,W-WORLD-1`、および空虚例合成タスクを閉じることができず、Gear-2フロンティア提案者が依然として必要である。

- **推論`reported_j`、3-Gearカスケード、および正直なH5/H11診断：** AMD Ryzen AI Max+ 395 Linuxの`powercap` RAPLカウンタ（`measured_j = None`、`board_metered = false`、`derived_marginal_pkg_reported_j = None`、Falsifier 6下で`33.38%`のco-tenantパッケージドリフト）において、提案ごとのCPU推論コストは`k = 1`で**`58.65 mJ`** RAPLコア（`1.194 J`総パッケージ、`10.15 ms`）、`k = 16`で**`474.76 mJ`** RAPLコア（`6.736 J`総パッケージ、`67.51 ms`）であり、`k = 1`ではローカル35B候補（`84.25 J`）より`70.6×`から`1,436×`低く（`k = 16`では`12.5×`から`177.5×`）、`FormJEPA-v1 (k = 16)`をGear 1として`DNULLMM1` Gear 0と`Claude Opus 5.5` Gear 2の間に挿入することで単一パス閉包を`34/40`に保ちつつ`Opus 5.5`呼び出しを`40`から`13`（`$1.38`から`$0.81`）に削減する。また200到着`Zipf(0.85)`ストリームではGear-2フロンティア呼び出しを`200`（ステートレス）および`48`（2-Gear）から**`23`呼び出し（`8.70×`削減；`152` Gear-0ヒット、`25` Gear-1許容、`7` Gear-2許容）**に削減する。ローカル`Qwen 3.6`をGear 2として用いると、`Zipf(0.85)`における35B呼び出しは`49`（`4.08×`削減）に低下し、許容到着数は`141/200`から`154/200`に上昇する。較正されていない負の潜在L<sub>2</sub>距離のみでは`925`ビーム候補全体でAUROC **0.618**を達成する（H5は未決：`0.60`超の反証フロア以上、`0.85`未満の支持閾値以下）であり、累積編集距離`0..4`（`0.00, 0.99, 2.26, 3.27, 3.89`、その後`d = 5`で`3.72`；H11における厳格5ステップ単調性の`18/50 = 36.0% < 80%`）で上昇する。これは修復精度が滑らかな未較正潜在エネルギーではなく`(z_x, z_hat_y)`上で型付き編集デコーダを条件付けすることに由来することを示す。

- **151-タスク`rce repair` rung `f`昇格判定：** すべての151ラダータスクに対して`rce repair`を`observe`モード（`bound 2000`、各タスクの既知良好オリジナルおよび外部提案ファイルを与える）で実行し、`rce repair criterion`を2026年11月3日固定登録（`sha256: abf7f131f240e3f9...`）に対して評価すると、rung `a..e`による正確閉包が`116/151`、オープン・タスクが`35`（`25`の解析不能`W-SYN-1`ファイルを規則RF-2下でスキップ、`10`のオープン解析タスクを`0`欠落カバレッジで判定）である。結合外部提案（`FormJEPA-v1`＋記録されたH15修復、`91`提案を判定）下ではrung `f`が**`3`許容タスク**（`hpke`、`mls_key_schedule`、`energy`）を観測し、**`3/3`（`100.0%`）**が`W-MUT-1`変異ゲートを通過し、**`0`が既知良好オリジナルと矛盾する**（`3/3`復元）。`3 / 119 = 2.5% > 2.0%`であるため、`rce repair criterion`は**`holds: false`**（`exit = 1`）を返し、rung `f`を`observe`モードに留める。

![左：正確なラダー段aからeを通る3歯車残差カスケード、Gear 0 DNULLMM1（40/40 warm replay）、Gear 1 FormJEPA-v1 + FormEBM-v2、およびGear 2 H15-Iterativeを決定論的コミットゲートの背後に配置し、200/200のZipf(0.85)到着を許容する。右：測定されたFormEBM-v2 H5 ROC曲線（AUROC 0.8922 vs Siamese L2 0.7208）およびH11 5ステップ編集距離エネルギー地形（93.0%厳密単調性、Spearman rho 0.9931）](/figures/rce-jepa/three-gear-and-ebm.svg)

図10. 測定された3歯車残差カスケードおよび`FormEBM-v2`潜在エネルギー診断（`openIE-dev/rce`コミット`1762fb4b` [B35]）。左：決定論的ラダー段`a..e`（`111/151`）、Gear 0 `DNULLMM1`（`40/40` warm zero-call replay）、Gear 1 `FormJEPA-v1` + `FormEBM-v2`、およびGear 2 `H15-Iterative`を`rce check` + `W-MUT-1` + `no_spec_deletion`でゲート（`Zipf(0.85)`上で`200/200`許容、`16.67×`少ないGear-2エピソード）。右：未見形状H5 ROC曲線（`AUROC = 0.8922`）および未見連鎖H11 5ステップ累積欠陥エネルギー曲線（`93.0%`厳密単調性、IQRシェード）。対話型エクスプローラ：[ /living/rce-jepa/ ](/living/rce-jepa/)。

<div id="form-ebm-and-h15-iterative-result" class="anchor-alias" aria-hidden="true"></div>

**コントラスト的マルチステップマージンエナジースコアラー（`FormEBM-v2`、H5 と H11）および `40/40` 有界チェッカーフィードバック残差閉鎖（`H15-Iterative` + Gear-0 v2）、測定済み [B35]。** コーパス生成、重み初期化、および API 実行の前に事前登録（`rce-jepa-form-ebm-v2-2026-11-23`、`sha256: 128f17e69361ea89...`；`rce-jepa-h15-iterative-2026-11-23`、`sha256: a7774d3bd03ae450...`）は、`openIE-dev/rce` コミット `1762fb4b`（Linux x86_64 バイナリ `sha256: 331464496009d98a...`）に対して実施された。二つの対象評価では、(A) 校正されていない座標距離をコントラスト的かつペアワイズ edit-depth マージンエネルギーヘッドに置換し、同一の厳密に分離された `1,387`-Form 分割で H5 と H11 を閉じられるか、(B) 公開 `stdlib/lib` モジュールヘッダーと有界決定論的チェッカーダイアグノスティックス（`max_turns = 5`、`original` へのアクセスなし）を供給し、単一ショット H15 の残り六つのタスクを閉じられるかをテストした。

- **`FormEBM-v2` のアーキテクチャ、トークナイザ修正、および未見形状に対する H5 / H11 の結果（未見のテスト Form 形状 `137` 件、重複 `0` 件）:** `FormJEPA-v1` が H5 で `0.618` AUROC、H11 で `36.0%` の厳密な 5 段階単調性にとどまった理由は、二つの構造的原因により説明された。第一に、単一ファイルの S 式トークナイザが、生存する未使用束縛（`let x`、`W-UNUSED-1` により拒否）とアンダースコア接頭辞付きの束縛（`let _x`、受理）を同一の `<ID:k>` スロットに対応づけ、さらに未束縛の識別子が現れるたびに後続の `<ID:j>` 添字をずらしていた。第二に、座標系の Smooth-L<sub>1</sub> 損失は、契約的妥当性や編集深度に関するマージンを持たなかった。`FormEBM-v2`（学習可能パラメータ `5,851,649` 個、チェックポイント `sha256: 2204a0b9cbd0d96c...`、AMD Ryzen AI Max+ 395 / Radeon 8060S APU 上での学習時間 `857.2 s`、コア RAPL `5,375.0 J`、APU パッケージ RAPL `40,602.4 J`）は、これらの問題に対処するために次の構成を導入した。参照を基点とする `PairFormTokenizer`（有効トークン `504` 個。アンダースコア接頭辞付き束縛、新たに導入された識別子スロット、および純粋に構文的な差分タグと検査器呼び出しを伴わない、法 32 の整数クラスを区別する）、5 層の共有 Siamese Transformer、1 層のクロスアテンション RMS 差分ブロック、そして softplus エネルギーヘッドである。エネルギーヘッドは、`1,106` 件の学習用 Form に限定して構築された `5,955` 個の妥当性マージン三つ組（`m = 1.0`）と `600` 本の 5 段階累積破損連鎖（`γ = 0.50(j − i)`）により学習された。VICReg の実効ランクは、`z_ref` では `26.48` から `55.70` へ、`z_cand` では `46.44` から `74.72` へと拡大した。未見の保持テスト Form 形状 `137` 件に対する結果は以下のとおりである。
  - **H5（未見テストビーム `N = 200` 件、候補 `3,064` 件）:** スカラーエネルギーは AUROC **`0.8922 >= 0.85`** に到達した（`FormJEPA-v1` の `0.6180`、較正されていない Siamese L<sub>2</sub> の `0.7208` と比較）。ビーム項目に対して `rce check` を呼び出さない上位 1 件（`k = 1`）の妥当な選択率は、再順位付けなしの `22.5%`（`45/200`）および Siamese L<sub>2</sub> の `25.0%`（`50/200`）から、解決可能なビーム `163` 件に対する **`84.05%`**（`137/163`。全 `200` ビームに対する生の値は `68.50%`）へ向上した。また、最初の妥当な Form に到達するまでの `rce check` の平均呼び出し回数は **`2.39×`** 削減された（ビームあたり `3.577` 回から `1.497` 回へ）。10 スレッドの CPU スコアリングに要するコストは、候補 1 件あたりコア RAPL で **`47.09 mJ`**（`6.30 ms`）、16 項目のビームあたりコア `752.03 mJ`、パッケージ総計 `11.88 J` であった。なお、Falsifier 6 のもとで空転ドリフトが `13.7%` あったため、`derived_marginal_pkg_reported_j = None` と報告した。
  - **H11（未見の 5 段階累積欠陥連鎖 `N = 100` 本）:** 厳密な 5 段階単調性（`E_0 < E_1 < E_2 < E_3 < E_4 < E_5`）は、`FormJEPA-v1` の `36.0%` および Siamese L<sub>2</sub> の `18.0%` から、**`93.0%`（`93/100 >= 80%`）** へ上昇した。平均スピアマン順位相関は **`ρ = 0.9931`**（中央値 `1.0000`）であり、`d = 0..5` にわたる平均エネルギーは `[0.0007, 2.36, 5.16, 7.99, 12.21, 17.25]` であった（`d = 5` における巻き戻りはゼロ）。
  - **率直な領域境界:** 既に壊れた行を新たな AST 欠陥を加えずに二度上書きしてもよい無制約の 5 段階ランダムウォーク（`N = 50`）では、平均エネルギーは依然として `0.0007 → 7.07` と上昇した（平均 `ρ = 0.8513`、中央値 `0.9429`）。一方、ステップごとの厳密な不等式は `38.0%` にとどまり（非減少は `46.0%`）、その差は残存する編集深度の仮定に起因する。OOD である `40` 件の git 履歴残差タスクへのゼロショット転移では、タスク内 `k = 1` の型付き編集の受理数が `FormJEPA-v1` の `22/40` から `25/40` へ向上した（ビーム容量は `30/40`）。しかし、タスク横断のプールされた AUROC は `0.2630`（`332` 件の多提案者候補では `0.2585`）へ反転した。これは、単一行の編集深度による学習が、1 トークンの構文編集よりも、大規模で妥当な複数行の標準ライブラリ移行に対して高い生のエネルギーを割り当てることに起因する。
- **`H15-Iterative` 有界な検査器フィードバックと公開 `stdlib/lib` ヘッダ（`40 / 40` 件が閉鎖、矛盾 `0` 件、`40 / 40` の Gear-0 再生）:** インポートされた `stdlib/lib` モジュール（`crypto.cat`、`crypto.unhex`、`crypto.tohex`、`core.bytes`、`pq`）について、本体を除去した公開宣言シグネチャ（`pub const`、`pub struct`、`pub kind`、`pub fn`。タスクファイル自体は厳密に除外）を与え、さらに決定論的な `rce check` と `W-MUT-1` の診断を `max_turns = 5` まで逐語的に返した（`original` へのアクセスは一切与えない）。これにより、単発で `34/40` であった受理数は、次のように向上した。**`Claude Opus 5.5`** では **`40/40`（`100.0%`）**（ターン 1 で `38` 件、ターン 2 で `2` 件。呼び出し `42` 回、`$1.8104`、`34` 件が復元、`5` 件が動作同値で、動作が同じと判定されたものは `39` 件、**矛盾 `0` 件**）、**`Claude Sonnet 5.5`** でも **`40/40`（`100.0%`）**（ターン 1 で `38` 件、ターン 2 で `1` 件、ターン 3 で `1` 件。呼び出し `43` 回、**`$1.1122`**、`35` 件が復元、`4` 件が動作同値、**矛盾 `0` 件**）、**`xAI Grok 4.20 Reasoning`** では **`39/40`（`97.5%`）**（ターン 1 で `35` 件、ターン 2 で `2` 件、ターン 3 で `2` 件。呼び出し `50` 回、`$4.0555`、**矛盾 `0` 件**）であった。従来未解決であった暗号移行 4 件（`stdlib/lib/hpke.rce`、`stdlib/lib/mls.rce`、`stdlib/lib/pq.rce`、`programs/ecosystem/pqxdh.rce`）は、いずれも**完全ハッシュ一致による `restored`**（`Opus 5.5` と `Sonnet 5.5` ではターン 1、`Grok 4.20` ではターン 1 から 3）となった。また、`W-MUT-1` 導入以前の空虚な例を含んでいた歴史的タスク 2 件（`57_float_vectors.rce`、`washer.rce`）は、`rce equiv fuel 2000` のもとで `behaviour-equal` により閉鎖された（`Grok 4.20` では `washer.rce` のみが 5 ターン後も未閉鎖のまま残った）。検証済みの修復 40 件すべてを `DNULLMM1` Gear-0 v2（`sha256: 80cf265038bcd5eb...`）へ結晶化したところ、モデル呼び出し `0` 回で **`40/40`（`100.0%`）** が再生された。さらに、更新された 3 段階 Gear の `Zipf(0.85)` ストリーム（到着 `M = 200` 件）では、到着の **`200/200`（`100.0%`）** を受理した（Gear-0 ヒット `163` 件、ローカル Gear-1 受理 `25` 件、Gear-2 エピソード `12` 件、API ターン `14` 回、費用 `$0.9822`）。これは、ステートレスな `200` 回の呼び出しと比べて、エピソード数を **`16.67×`** 削減したことを意味する。

<div id="form-ebm-v3-result" class="anchor-alias" aria-hidden="true"></div>

**スパン正規化二頭部分解スコアラー（`FormEBM-v3`、H5、H11、およびゼロショットOOD H15 クロススパン転移）、[B36]により測定。** 合成マルチスパンペア生成、重み初期化、および評価（`rce-jepa-form-ebm-v3-2026-11-23`、`sha256: cb7ee1ac8dc5c594...`）に対して事前登録済みであり、`openIE-dev/rce`コミット`1762fb4b`（Linux x86_64バイナリ`sha256: 386be0c26389550e...`）に対するものである。`FormEBM-v3`（`6,052,802`個の訓練可能パラメータ、純`float32` ROCm `Radeon 8060S`チェックポイント`sha256: 71e642f1bb0b9c06...`；`2,528.3 s`の訓練時間、`13,312.3 J`のコアRAPLおよび`48,422.2 J`のAPUパッケージRAPL）は、同一の厳密に互いに素な`1,387`フォーム分割（`1,106`訓練、`144`検証、`137`未見テスト形状；151個のはしごまたは40個のH15タスクとの`0`重複、およびスコアリング中の`0`回の`rce check`呼び出し）上で欠陥妥当性を累積編集深度から分離することが、`FormEBM-v2`のクロスタスクOOD編集サイズ逆転（`0.2585`）を解決するかどうか、かつH5またはH11を劣化させないかどうかを検証するものである。

- **アラインメント対応トークン化と二頭分解:** `PairFormTokenizerv3` (`max_seq_len = 384`, `560` アクティブトークン) は、生の行インデックス比較を行シフト不変シーケンスアラインメントに置き換え、文字列結合された新規識別子 (`<BOUND_NEW_ID:0..31>`) と未束縛フリーシンボル (`<UNBOUND_NEW_ID:0..15>`) を分離し、明示的正規化差分分数 `ρ_diff = Δ_tok / max(1, L_cand)` を算出する。共有 5 層 Siamese エンコーダとクロス差分ブロック上で、スパン不変欠陥ヘッド `E_def(x, y, r) = softplus(g_def(feats_def))` (ビーム内および全対クロスタスクバッチマージン `m = 2.5` と L<sub>2</sub> 正アンカーで `4,983` ペア、うち `219` `k = 2..10` 多スパン有効書き換えはすべて `train_forms` から) を累積破損深度ヘッド `E_depth(y_0, y_d) = softplus(g_depth(feats_depth))` と分離し、`E_total = E_def + 0.15 · E_depth / log2(2 + Δ_tok)` で結合する（VICReg 有効ランク `42.79` が `z_ref`、`57.93` が `z_cand`、座標標準偏差 `0.3332 / 0.3113 >= 0.25`）。
- **未見形状 H5 (`0.9437`) と未見チェーン H11 (`94.0%` / `92.0%`) の強化:** `200` 未見ホールドアウトテストビーム (`3,064` 候補) に対し、`FormEBM-v3` は **H5 AUROC を `0.8922` (`FormEBM-v2`) から `0.9437 >= 0.85`** に上げる（`E_def` のみで `0.9386`、`FPR = 4.6%` における `TPR = 78.9%` を達成）、**`83.44%` (`136/163`, `E_def`) と `80.98%` (`132/163`, `E_total`) のトップ-1 正解率** を実現（いずれも `>= 80.0%`; `1.601` / `1.669` 平均 `rce check` 呼び出し回数 vs `3.577` 未再ランク）、そして **H11 の厳格 5 ステップ単調性を `100` 未見破損チェーンで `E_depth` が `94.0%`（Spearman `ρ = 0.9966`、中央値 `1.0000`）、`E_total` が `92.0%`（`ρ = 0.9846`、中央値 `1.0000`）に向上** させる。10 スレッド CPU スコアリング（`max_seq_len = 384`）は候補あたり `232.45 mJ` コア RAPL（`32.55 ms`、ローカル 35B 生成の `362×` 低減）を消費し、`derived_marginal_pkg_reported_j = None` は `37.7%` 共テナントパッケージドリフトである。
- **ゼロショット OOD H15 逆転解決 (`0.2585 → 0.5278`) と候補モジュール境界:** `40` タスク git 履歴残差（`303` 多提案者候補、すべての `40/40` 閉鎖多百行 `hpke`、`mls`、`pq`、`pqxdh` 移行を含む）にゼロショット転移した際、`FormEBM-v3` はプールされたクロスタスク AUROC を `0.2585` (`FormEBM-v2`) から **`0.5278`**（`+0.2693`、Falsifier F4 `> 0.50` をクリア）に上げ、`Δ_tok >= 10` の大スパン有効書き換えで **`0.6018`**、短い `0/1`-トークン無効候補で **`0.2630 → 0.4985`**（`286` アイテムの型編集プール）を達成する。一方、`E_def` の下で **`27/40` 多提案者と `24/40` 型編集がタスク内 `k = 1` 入場**（`E_total` では `25/40` と `22/40`、平均型ビームチェックは `5.55` から `5.10` に削減）する。279 行の `stdlib/lib/hpke.rce` 移行（`Δ_tok = 146`）では有効エネルギーが `E_total = 0.9645`（`E_def = 0.8826`）に低下するが、未見多モジュール暗号 API（`mls.rce`、`pq.rce`、`pqxdh.rce`）および虚無例義務（`washer.rce`）に対しては、単一ファイル構文が `stdlib/lib` の型シグネチャや正確な `rce trace` ロールアウトをインポートできないため、ゼロショットプール校正は `0.53` 前後で停滞する。

<div id="falsifiers" class="anchor-alias" aria-hidden="true"></div>

### 前提そのものに対する反証条件 RJ-F1 から RJ-F6

各反証条件は、前提の一部を覆し得る観測である。このうちいくつかは上記の仮説を直接参照する (RJ-F3 は H3、RJ-F4 は H11、RJ-F6 は H3 と H10 に関わる)。

| ID | 観測 | 覆される対象 |
| --- | --- | --- |
| RJ-F1 | 構成子リストを使い切った後も、5つの対象言語のいずれかにおいてリフト・カバレッジが80%を下回って頭打ちになる | RCE からすべてのコードを生成できるという主張、およびそれに伴う Forms 上の自律的コーディングの適用範囲 |
| RJ-F2 | 7つの参照アプリケーションについて σ(I) を記述するのに要する人時が、それらの Form を手作業で記述する場合より大きい | クロージャが仕様化コストを除去するのではなく、移動させるにすぎないという主張 |
| RJ-F3 | 同一のゲートにおいて、トークン系アームが合格する一方で H3 が不合格となる | Form 空間上の潜在的提案。ゲートは依然として成立するが、JEPA の部分は成立しない |
| RJ-F4 | H11 が不合格となり、かつ探索がビーム予算内で受理済みの Form に到達しない | Form 空間におけるエネルギー誘導型計画 (未見の累積1から5欠陥連鎖に対しては発動していない。`FormEBM-v2` は93.0%、`FormEBM-v3` は `E_depth` で94.0%、`E_total` で92.0%の厳密な単調性を達成し、H5 の AUROC は0.9437である。モジュール横断のシグネチャ/トレース OOD エネルギーの較正については、`0.5278` を超える水準が未解決のまま残る) |
| RJ-F5 | 決定ヘッドの較正が、shape ハッシュ上の頻度表を一度も上回らない | 決定モデルの側の論点であり、昇格済みハンドラの統計を超える寄与を加えない |
| RJ-F6 | H14 の run 3 の plain アームに残る40タスクの残差を、実行トレースを用いて学習した CWM クラスのトークン空間モデルが、同一のエネルギーかつ受理規則と同一のゲートで解消する | 学習時および提案時において Form の商が提案器に寄与するという主張 (注: Gear-0 の再利用では、`rce fmt nameless` が呼び出し0回で9件中7件の α 改名を既に回復している。学習済み提案器における H3 および H10 との同等性は、学習済み JEPA アームの結果を待つ必要がある) |

本論題は、H4 が不成立の場合 (受理プログラム1件あたりのジュール利得が存在しない場合) または H6 が不成立の場合 (Form が参照アプリケーションを表現できない場合) に、全体として反証される。いずれか一方のみで十分である。

<div id="what-will-be-delivered" class="anchor-alias" aria-hidden="true"></div>

### 提供される成果物

Scope, parallel workstreamsとして組織され、評価ハーネスで交差する。すべての成果物はFormsを生成するか、Formsを提案するモデルを生成するか、結果を測定するかのいずれかである。

- **W1. Formコーパスとデータセットカード。** 手書きForm、参照アプリForm、チェッカ検証変異から得られた意図文とチェッカ判定とペアになったForms; カードは出所、ライセンス、サイズ分布、負例生成、既知のギャップと汚染制御をカバーし、H1向けの標準シリアライズを提供する。
- **W2. エンコーダと予測器。** 意図エンコーダ、EMA Formターゲットエンコーダ、表現空間における予測器およびエネルギーヘッド E(intent, P)、崩壊防止策、埋め込み空間対トークン空間の損失除去実験、測定された学習エネルギーを含むモデルカードを備える。
- **W3. チェッカ制約デコーダ。** 文法制約された候補Formsをエネルギーで順位付けしチェッカに提出、変更要求診断を各ルール名で付与し、固定リトライ予算の下でフィードバックする; チェッカはエンジンへのバイパス経路を持たない唯一の受理権限である。
- **W4. Intent-to-Formベンチマーク。** ユニットおよび複合タスク、参照アプリ（ゲームエンジン、テキストエディタ、ビデオプレーヤ、チャットアプリ、ブラウザ、ターミナル）とRCEdb; 各タスクは意図、参照Form、リプレイトレース、ベースライン用の同等なソース言語タスクを持ち、ホールドアウト分割が用意される。
- **W5. エネルギーをジュールで測定する評価ハーネス。** 両腕が同一ハードウェアとタスクで実行; pass@1、pass@k、ρ、C<sub>check</sub>、J<sub>acc</sub>、K<sub>acc</sub>、受理あたりのリトライ回数、エネルギー順位付けAUROC; ルートレスカウンタ（`reported_j`）、アイドルドリフトFalsifier 6ゲーティング、未加工ログ保持、利用不可クラウドカウンタは`not_available`として報告し推定は行わない。
- **W6. 研究論文。** 本ケースはH1からH15までの結果を拡張し、負の結果、図表、テーブルおよび再現性手順を含む。
- **W7. オープンアーティファクト。** 公開: Form仕様、参照チェッカとそのエミッタ、ベンチマークタスクとトレース、ハーネス、データセットとモデルカード、ライセンスが許す限りの重み。すべてが公開されている場合にのみ数値が報告される。
- **W8. デモ。** 意図から予測Formへのチェッカ判定（変更要求判定を示す）を示し、参照チェッカによって2言語のコードを生成し、画面上にジュール読取を表示する。

<div id="status" class="anchor-alias" aria-hidden="true"></div>

## 状態

研究課題はオープンであり、`openIE-dev/rce` コミット `f87d6af2`（2026年11月23日；`64` モジュールにわたる `1,264` 個のソース宣言から生成された `5,393` 個の Lean 4.36.0 定理定数、定理 T1 から T63、`lake check --paranoid` の6つの独立した証明チェッカーすべてで検証済み、`2,221/2,236` 適合性テストが `0` 失敗でパス、`837` Rust チェッカーユニットテスト；実証ベンチマークは `1762fb4b` に対して登録；対話型観測所は [/living/rce-jepa/](/living/rce-jepa/)）に対して 2026 年 11 月 23 日に更新された。位相 0 決定論的フロアは測定済みである：H1 は 185 プログラムにおける中央 rho `9.34` で手書き母集団上で支持される（W1 バージョン 1 は 173 件で `9.31` を与えた）；H8 は 6 対象における `10,500` シード済みイベントストリーム全体で `0` 不整合で支持される（`rce/bench/determinism/`）；H7 のファズドアームは `1,275` チェッカー受理変異体全体で `0` 不変量違反を発見した（`rce/bench/adversarial/`）；そして H14 は `rce repair` の 3 登録実行全体で支持され [B30, B31, B32]、`151` タスクのうち `111` を閉鎖した（実行 3 のプレーンアームでモデル呼び出しゼロで `73.5%`）`40` のオープン git-history 残余タスクを残した。2026 年 11 月 22-23 日 [B33, B34, B35, B36] において、Apple M5 Max および AMD Ryzen AI Max+ 395 / Radeon 8060S `reported_j` 領収書（`measured_j = None`、`board_metered = false`）は **H2 supported** を確立した（`C_check / E_model = 0.04904 J / 84.25 J = 0.000582 <= 0.05`、`1,718×` 安価；完全な 62-Form check+run+emit スイート `15.44 J`）、訓練および評価された **`FormJEPA-v1`**（`8.42M` パラメータ：`177/200` 未見合成欠陥、`22/40` at `k = 1` および `27/40` at `k = 16` on H15 at `58.65-474.76 mJ` RAPL コア `reported_j`）、対照的な **`FormEBM-v2`**（`5.85M` パラメータ：**H5 AUROC `0.8922 >= 0.85`**、`84.05%` 解決可能 top-1 正確度、**H11 `93.0% >= 80%`** Spearman `0.9931` における厳格 5 ステップ単調性、`47.09 mJ`/cand コア `reported_j`）、およびスパン正規化分解された **`FormEBM-v3`**（同一の分離 `1,387`-Form 分割上の `6.05M` パラメータ：**H5 AUROC `0.9437 >= 0.85`** with `83.44%` `E_def` および `80.98%` `E_total` 解決可能 top-1 正確度、**H11 `94.0%`** Spearman `0.9966` における `E_depth` 上の厳格 5 ステップ単調性および Spearman `0.9846` における `E_total` 上の **`92.0%`**、およびゼロショット OOD H15 マルチプロポーザプール AUROC が `0.2585` から **`0.5278`** に引き上げられ、大スパン有効対短無効書き換え上で `0.6018`、`232.45 mJ`/cand コア `reported_j`）、**`H15-Iterative`** において有界 `<= 5` ターン チェッカーフィードバック + 公開 `stdlib/lib` シグネチャヘッダ上で `Claude Opus 5.5`（`$1.81`）および `Claude Sonnet 5.5`（`$1.11`）でオープン残余タスク **`40/40` (`100.0%`)** を閉鎖し（`xAI Grok 4.20 Reasoning` 上で `39/40`）、**`0` 矛盾**、すべて **`40/40`** を **`DNULLMM1` Gear-0 v2** に結晶化（`0` モデル呼び出し、`0.325 µs` / `1.77 µJ` プローブ；`16.67×` 少ない Gear-2 エピソードで `200/200` `Zipf(0.85)` 3-Gear ストリーム入場）、および 151 タスク **`rce repair` rung `f`** 昇格を監査（`3/119 = 2.5% > 2.0%`、`3/3` passing `W-MUT-1`、`0` 矛盾、rung `f` が `observe` モードに留まることを確認）。依然としてオープン：完全意図-to-Form 合成（H3）、エンドツーエンドジュールパリティ（H4）、`0.5278` を超えるマルチモジュール git-history 書き換えにわたるクロスモジュールシグネチャおよびトレース OOD エネルギー較正、参照アプリエンコーディング（H6）、コストテーブル予測（H9）、商標本効率（H10）、ゲート領収決定ヘッド較正（H12）、離散対連続長期間計画（H13）、拡散/進化的 H15 アーム、および外部ハードウェアレール電力計測（`measured_j`）。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

各情報源には読み取りラベルが付与されている。**Full:** 全文を読んだ。**Partial:** 全文を取得し、引用箇所を検索したが、周囲のテキストで確認しただけで、全体は読んでいない。**Unavailable:** 入手できなかった。 "PDF p." はリンク先のコピーのページ番号を示す; Sec. はセクションを示す。

- Assran et al. 2023. Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture. CVPR. [arXiv:2301.08243](https://arxiv.org/abs/2301.08243). Full.
- Assran et al. 2025. V-JEPA 2. [arXiv:2506.09985](https://arxiv.org/abs/2506.09985). Full.
- Backus et al. 1957. The FORTRAN Automatic Coding System. Western Joint Computer Conference. [Computer History Museum copy](https://archive.computerhistory.org/resources/text/Fortran/102663113.05.01.acc.pdf). Full.
- Bird 1986. An Introduction to the Theory of Lists. Oxford PRG-56. [PDF](https://www.cs.ox.ac.uk/files/3378/PRG56.pdf). Full.
- Brooks 1986. No Silver Bullet: Essence and Accident in Software Engineering. [PDF](https://worrydream.com/refs/Brooks_1986_-_No_Silver_Bullet.pdf) (page numbers refer to this copy). Full.
- Chen et al. 2021. Evaluating Large Language Models Trained on Code. [arXiv:2107.03374](https://arxiv.org/abs/2107.03374). Full.
- Dijkstra. EWD 472, Guarded commands, non-determinacy and formal derivation of programs. [Transcription](https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD472.html). Full.
- Dijkstra. EWD 667, On the foolishness of "natural language programming". [Transcription](https://www.cs.utexas.edu/~EWD/transcriptions/EWD06xx/EWD667.html). Full.
- Ellis et al. 2021. DreamCoder. PLDI. [arXiv:2006.08381](https://arxiv.org/abs/2006.08381); [version with supplement](https://www.cs.cornell.edu/~ellisk/documents/dreamcoder_with_supplement.pdf). Full (main text and supplement S1 to S4.8, PDF pp. 23-68, read in full).
- Hubert et al. 2025. Olympiad-level formal mathematical reasoning with reinforcement learning (AlphaProof). Nature. [Nature](https://www.nature.com/articles/s41586-025-09833-y). Full.
- Klein et al. 2009. seL4: Formal Verification of an OS Kernel. SOSP. [PDF](https://www.sigops.org/s/conferences/sosp/2009/papers/klein-sosp09.pdf). Full.
- Leroy 2009. Formal verification of a realistic compiler. CACM. [PDF](https://xavierleroy.org/publi/compcert-CACM.pdf). Full.
- Letouzey 2008. Extraction in Coq: an Overview. CiE. [PDF](https://www.irif.fr/~letouzey/download/letouzey_extr_cie08.pdf). Full.
- Li et al. 2022. Competition-Level Code Generation with AlphaCode. [arXiv:2203.07814](https://arxiv.org/abs/2203.07814). Full.
- Luccioni, Jernite, Strubell 2024. Power Hungry Processing. FAccT. [arXiv:2311.16863](https://arxiv.org/abs/2311.16863). Full.
- OMG 2003. MDA Guide Version 1.0. [PDF](https://www.omg.org/mda/mda_files/MDA_Guide_Version1-0.pdf). Full.
- Ouyang et al. 2023. An Empirical Study of the Non-determinism of ChatGPT in Code Generation (v1 title: LLM is Like a Box of Chocolates). [arXiv:2308.02828](https://arxiv.org/abs/2308.02828). Full.
- Samsi et al. 2023. From Words to Watts. IEEE HPEC. [arXiv:2310.03003](https://arxiv.org/abs/2310.03003). Full.
- Sun et al. 2024. Clover: Closed-Loop Verifiable Code Generation. [arXiv:2310.17807](https://arxiv.org/abs/2310.17807). Full.
- Yang et al. 2011. Finding and Understanding Bugs in C Compilers (Csmith). PLDI. [PDF](https://users.cs.utah.edu/~regehr/papers/pldi11-preprint.pdf). Full.
- Yang et al. 2024. AutoVerus. [arXiv:2409.13082](https://arxiv.org/abs/2409.13082). Full.
- LeCun 2022. A Path Towards Autonomous Machine Intelligence, version 0.9.2. [OpenReview](https://openreview.net/forum?id=BZ5a1r-kVsf). Full.
- Simon 1963. Experiments with a Heuristic Compiler. Journal of the ACM 10(4), 493-506. [DOI 10.1145/321186.321192](https://doi.org/10.1145/321186.321192). Full.
- Manna and Waldinger 1980. A Deductive Approach to Program Synthesis. ACM TOPLAS 2(1), 90-121. [DOI 10.1145/357084.357090](https://doi.org/10.1145/357084.357090). Full.
- van de Riet 1993. An overview and appraisal of the Fifth Generation Computer System project. Future Generation Computer Systems 9, 83-103. [DOI 10.1016/0167-739X(93)90002-7](https://doi.org/10.1016/0167-739X(93)90002-7). Full.
- Kemerer 1992. How the Learning Curve Affects CASE Tool Adoption. IEEE Software 9(3), 23-28. [DOI 10.1109/52.136161](https://doi.org/10.1109/52.136161). Full.
- Hutchinson, Whittle, Rouncefield and Kristoffersen 2011. Empirical Assessment of MDE in Industry. ICSE, 471-480. [DOI 10.1145/1985793.1985858](https://doi.org/10.1145/1985793.1985858). Full.
- Petre 2013. UML in practice. ICSE. [DOI 10.1109/ICSE.2013.6606618](https://doi.org/10.1109/ICSE.2013.6606618); [author copy, Open Research Online](https://oro.open.ac.uk/35805/) (page numbers refer to this copy). Full.
- Simon 1963. Experiments with a Heuristic Compiler. RAND RM-3588-PR. [Internet Archive](https://archive.org/details/bitsavers_randiplRM3mpilerMay63_4935437); a memorandum related to but distinct from the JACM article. Full (prose pp. iii-63; program listings in Appendices A and B scanned).
- Manna and Waldinger 1978. A Deductive Approach to Program Synthesis. Stanford STAN-CS-78-690. [Report version](http://i.stanford.edu/TR/CS-TR-78-690.html), which predates the TOPLAS article. Full.
- Huang, LeCun and Balestriero 2025. LLM-JEPA. [arXiv:2509.14252](https://arxiv.org/abs/2509.14252). Partial (abstract, repository README and run script).
- Wei et al. 2025. SWE-RL. [arXiv:2502.18449](https://arxiv.org/abs/2502.18449). Partial (abstract and method summary).
- Yang et al. 2025. SWE-smith. [arXiv:2504.21798](https://arxiv.org/abs/2504.21798). Partial (abstract and repository README).
- Shansan Gong, Ruixiang Zhang, Huangjie Zheng, Jiatao Gu, Navdeep Jaitly, Lingpeng Kong and Yizhe Zhang 2025. DiffuCoder. [arXiv:2506.20639](https://arxiv.org/abs/2506.20639). Partial (abstract). Author list from arXiv metadata, not a PDF title page.
- Inception Labs 2025. Mercury. [arXiv:2506.17298](https://arxiv.org/abs/2506.17298). Partial (abstract).
- Wang, Pradel and Liu 2025. Are "Solved Issues" in SWE-bench Really Solved Correctly? [arXiv:2503.15223](https://arxiv.org/abs/2503.15223). ICSE (International Conference on Software Engineering) 2026. Partial (findings summary).
- Becker, Rush, Barnes and Rein 2025. Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity. [arXiv:2507.09089](https://arxiv.org/abs/2507.09089). Partial (summary, and the abstract via arXiv metadata). Author list from arXiv metadata, not a PDF title page.
- Niels Mündler, Jingxuan He, Hao Wang, Koushik Sen, Dawn Song and Martin Vechev 2025. Type-Constrained Code Generation with Language Models. [arXiv:2504.09246](https://arxiv.org/abs/2504.09246). Partial (headline result). Affiliation: the Swiss Federal Institute of Technology Zurich and the University of California, Berkeley, from the author list, not a PDF title page.
- Grand et al. 2023. LILO. [arXiv:2310.19791](https://arxiv.org/abs/2310.19791). Partial (abstract).
- Higher Order Company. HVM2. [PDF](https://raw.githubusercontent.com/HigherOrderCO/HVM/main/paper/HVM2.pdf). Partial (summary). The model is cited. Figures from that paper are not used.
- DeepSeek 2025. DeepSeek-Prover-V2. [arXiv:2504.21801](https://arxiv.org/abs/2504.21801). Partial (arXiv metadata and abstract).
- Moonshot and Numina 2025. Kimina-Prover Preview. [arXiv:2504.11354](https://arxiv.org/abs/2504.11354). Partial (abstract).
- Princeton 2025. Goedel-Prover. [arXiv:2502.07640](https://arxiv.org/abs/2502.07640). Partial (abstract).
- Scale AI. SWE-Bench Pro public leaderboard, page text fetched 6 November 2026. [scale.com/leaderboard/swe_bench_pro_public](https://scale.com/leaderboard/swe_bench_pro_public). Full (page text). The page prints no update date.
- ByteDance Seed 2025. Multi-SWE-bench. [arXiv:2504.02605](https://arxiv.org/abs/2504.02605). Partial (abstract). No November 2026 leaderboard figure was retrieved, and none is stated.
- Meta FAIR 2024. Large Concept Models. [arXiv:2412.08821](https://arxiv.org/abs/2412.08821). Partial (abstract).
- Chollet, Knoop, Kamradt and Landers 2024. ARC Prize 2024 Technical Report. [arXiv:2412.04604](https://arxiv.org/abs/2412.04604). Partial (abstract).
- Akyurek et al. 2024. Test-time training on ARC. [arXiv:2411.07279](https://arxiv.org/abs/2411.07279). Partial (abstract).
- ARC Prize 2025 results page. [arcprize.org/competitions/2025/](https://arcprize.org/competitions/2025/). Full (page).
- Lean FRO (Focused Research Organization). Year 1 roadmap, August 2023 to July 2024. [lean-fro.org/about/roadmap/](https://lean-fro.org/about/roadmap/). Partial (deliverables list). Later-year roadmaps are not used.
- Conal Elliott 2009, revised 2016. Denotational design with type class morphisms. [conal.net/papers/type-class-morphisms/](https://conal.net/papers/type-class-morphisms/). Partial (abstract page).
- Radul and Sussman 2009. The Art of the Propagator. MIT-CSAIL-TR-2009-002. [dspace.mit.edu/handle/1721.1/44215](https://dspace.mit.edu/handle/1721.1/44215). Partial (abstract).
