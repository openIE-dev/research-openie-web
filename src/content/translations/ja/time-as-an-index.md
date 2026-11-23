---
title: "時間をインデックスとして：明日を検索するために必要なこと"
deck: "計算複雑性理論、量子基礎論、アナログ緩和ハードウェア、暗号理論、Lean 4 カーネル検証済み地平線モデル（C1 から C4、M1 から M8）、および 195 件の目録化された異常とパラドックスにわたり、時間を問い合わせ可能な次元として扱うことの形式的・数値的・実証的な監査である。外部の壁面電源または分岐電力モニターは接続されていない（`board_metered` は false である）。"
lang: "ja"
source: "time-as-an-index"
complete: true
---

<div id="time-as-an-index-what-it-would-take-to-look-up-tomorrow" class="anchor-alias" aria-hidden="true"></div>

リビジョン af57f48、2026年11月22日。データと要約: [/data/#time-as-an-index](/data/#time-as-an-index). インタラクティブなライブ図: [/living/time-as-an-index/](/living/time-as-an-index/). LaTeX アーカイブ版: [/pdfs/latex/time-as-an-index.pdf](/pdfs/latex/time-as-an-index.pdf) ([source](/pdfs/latex/time-as-an-index.tex)).

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. 概要

将来的に物理的または計算的システムの状態を、リレーショナルテーブルのインデックス付き行のように直接問い合わせることができるとすれば、順次的な総当たり探索――暗号鍵の復元、ハッシュの先行像逆算、プルーフ・オブ・ワークパズルの解決――は秘密を保護する機能を失うであろう。なぜなら、対象となる証拠は決して欠如しているわけではなく、単にインデックスが付与されていないだけである。本研究は、その前提を計算複雑性理論、量子レトロ因果性、物理的緩和ハードウェア、暗号ゲームの還元、Lean 4 における形式的検証（`31` 個のカーネル検査済み定理、`sorry` 公理はゼロ）、決定的数値および記号モデル（`seed = 20261122`）、および合計 `195` エントリ（`81` 件の報告された時間的異常、`40` 件の物理的周波数領域エッジケース、`74` 件の基礎的パラドックス）からなる三つの構造化公開カタログにわたって検証した。ハードウェアレールや交流壁電源メータは接続されていない（`board_metered = false`）。

判定は、形式的閉時間曲線（CTC）と既知の実験室物理学との境界に沿って明確に分かれる。Deutsch の固定点閉時間曲線モデルの内部では、多項式時間の古典コンピュータと量子コンピュータの双方が完全な多項式空間計算能力に到達し、楕円曲線署名、対称ブロック暗号、暗号ハッシュ、プルーフ・オブ・ワークパズル、そして準備測定型量子鍵配布（QKD）を単一の固定点問い合わせで崩壊させるが、情報理論的スキームであるワンタイムパッドのみが例外である。形式的時間ループの外側では、既知の物理プロセスが早期参照を提供することはなく、量子レトロ因果的解釈はノーシグナリング定理を継承し、事後選択テレポーテーションループは逆確率的繰り返しコスト（$\sim 1/p$、$1/d^2$ が $d$ 状態証拠回路で到達）を支払う。アナログ動的ソルバーはステップ数を指数的エネルギー揺らぎまたは指数的周波数精度と交換し、すべての実現可能な「未来インデックス」は、Hellman の $T \cdot M^2 = N^2$ トレードオフにより事前計算に帰着し、$N$ ステップのフィルで塩と新しいチャレンジが構築開始前に質問を阻止する。

**平易な言葉で**

1. **数学的時間ループの内部では、ほぼすべての数学的ロックが同時に開く。** ハードウェアが自身の過去に送られたレジスタを変更せずに戻すことを強制できれば、一貫性だけで非決定的かつ多項式空間の解が多項式ゲート数で現れ、ワンタイムパッドのような情報理論的秘密だけが残る。
2. **既知の物理学では、何も可読な答えを時間逆行させて送ることはできない。** 量子遅延選択およびレトロ因果モデルは正確な周辺ノーシグナリングを遵守し、事後選択は一貫した実行を保つためにおよそ $1/p$ 回の失敗実行を破棄し、`81` 件の監査済み時間的異常報告と `40` 件の周波数アトラス異常のうち、ゼロ件の Grade A または Grade B ケースが未来からの未解明受信として残る。
3. **今日の「明日の参照」すべては、事前に支払われた事前計算である。** テーブルを構築することで検索を早期に移行できるが、フィルコストは $N$、$T \cdot M^2 = N^2$ を遵守し、削除されたビットあたり少なくとも $k_B T \ln 2$ を散逸させ、そして新しい塩や前ブロックハッシュが質問を使用時点まで保持すると完全に失敗する。

本研究全体の実質的な記述は、四つの明示的認識ラベルのうちいずれかを必ず付与している。

| Claim label | Operational meaning in this study |
| :--- | :--- |
| **`Established`** | その定式化された形式モデル内で数学的に証明された、または査読付き実験物理学で再現された。 |
| **`Kernel-checked`** | `Lean 4.36.0`（`code_and_proofs/lean/Horizon.lean` と `Paradox.lean`、目録化された `31` 定理、`sorry` `0`、カスタム公理 `0`、`opaque` `0`、`Lean.ofReduceBool` `0`）で機械的に検証され、さらに Linux `bubblewrap`（`bwrap`）名前空間サンドボックス内で `lake check --paranoid` の**6つの独立した証明チェッカー**すべてによって全会一致で受理された（`con-leche --verified` および `con-ron --verified`：`58,796` 宣言；`lean4lean`、`nanoda`、`leanchecker --paranoid`、および `Lean v4.36.0`：`58,798` 宣言）。形式構造上の数学的一貫性を確立するものであり、自然に関する物理的主張を示すものではない。 |
| **`Conjecture`** | 明確な仮定と明示的な反証手段を伴う整合的な理論的提案、または争点となっている経験的異常であり、証明も反証もされていない。 |
| **`Speculation`** | 再現測定によって裏付けられておらず、既知の上限と矛盾する（新たな物理が介入しない限り）、あるいは誤報・虚構に起因する（出典の捏造が記録されている場合は `Debunked` とする）。 |

<div id="1-terms-and-acronyms" class="anchor-alias" aria-hidden="true"></div>

## 1. 用語および略語

<ul id="terms">
<li>CTC, CTCs, D-CTC, D-CTCs, P-CTC, P-CTCs: 閉じた時間的曲線、Deutsch 固定点閉じた時間的曲線、そして事後選択テレポーテーション閉じた時間的曲線</li>
<li>CR, CV, CNOT, SWAP: 時間順序を尊重するレジスタ、因果性違反レジスタ、制御 NOT ゲート、そして二量子ビット状態交換ゲート</li>
<li>PSPACE, NP, coNP, BQP, PP, PostBQP, HALT: 多項式空間計算複雑性クラス、非決定性多項式時間、NP の補集合、誤差境界付き量子多項式時間、確率的多項式時間、事後選択誤差境界付き量子多項式時間、そしてチューリング停止オラクル</li>
<li>SAT, CNF, QKD, BB84, B92, OTP: ブール充足可能性、合取標準形、量子鍵配布、Bennett‑Brassard 1984 プロトコル、Bennett 1992 二状態プロトコル、そしてワンタイムパッド</li>
<li>IND-CPA, IND-CCA, UUF-CMA, EUF-CMA: 選択平文攻撃下での識別不能性、選択暗号文攻撃下での識別不能性、選択メッセージ攻撃下での普遍的偽造耐性、そして選択メッセージ攻撃下での存在的偽造耐性</li>
<li>ECDSA, RSA, AES, SHA, PoW, ASIC, ASICs, IACR: 楕円曲線デジタル署名アルゴリズム、Rivest‑Shamir‑Adleman 暗号系、Advanced Encryption Standard、Secure Hash Algorithm（SHA‑256 と二重ハッシュ SHA‑256d）、プルーフ・オブ・ワーク、特定用途集積回路、特定用途集積回路、International Association for Cryptologic Research</li>
<li>SQL, TSQL2, DAG, DFT, FFT, DPSS: 構造化問い合わせ言語、Temporal SQL2 仕様、有向非巡回グラフ、離散フーリエ変換、快速フーリエ変換、離散プロレート球面波列</li>
<li>TOPS, ARIA, BCI, BCIs, LLM, RL, IMO: テラオペレーション毎秒、Advanced Research and Invention Agency、脳―コンピュータインタフェース、脳―コンピュータインタフェース、大規模言語モデル、強化学習、International Mathematical Olympiad</li>
<li>DRM, AUC, QRNG, VLF, SEP, KJV, ZFC: Deese‑Roediger‑McDermott 偽記憶パラダイム、受信者操作特性曲線下面積、量子乱数生成器、超低周波、スタンフォード哲学百科事典、キング・ジェームズ版、選択公理付きツェルメロ‑フレンケル集合論</li>
<li>MOND, RAR, CDM, LIGO, EHT, FRB, CMB, GRB, AGN, PTA, JWST, ALMA: 修正ニュートン力学、放射加速度関係、冷たい暗黒物質（フラット Lambda‑CDM における）、レーザー干渉計重力波観測所、イベントホライズン望遠鏡、速い電波バースト、宇宙マイクロ波背景、ガンマ線バースト、活動銀河核、パルサータイミングアレイ、ジェームズ・ウェッブ宇宙望遠鏡、アタカマ大型ミリ波／サブミリ波アレイ</li>
<li>HVP, QCD, QED, EFT, AMPS, DESI, SH0ES: ハドロン真空分極、量子色力学、量子電磁力学、効果的場理論、Almheiri‑Marolf‑Polchinski‑Sully ファイアウォール議論、Dark Energy Spectroscopic Instrument、超新星と $H_0$ for the Equation of State</li>
<li>OPERA, LSND, BEST, MICROSCOPE, GPS, RTG: Oscillation Project with Emulsion‑tRacking Apparatus、液体シンチレータニュートリノ検出器、Baksan Sterile Transition 実験、Micro‑Satellite a trainee Compensee pour l'Observation du Principe d'Equivalence、全地球測位システム、放射性同位体熱電発電機</li>
<li>AIR, SPR, DNA, NRC, TSVF, EPR, SNR, QNM, ULP, CODATA, DOI: American Institutes for Research、Society for Psychical Research、デオキシリボ核酸、National Research Council、二状態ベクトル形式、Einstein‑Podolsky‑Rosen、信号対雑音比、準正準モード、最下位ビット、Committee on Data of the International Science Council、Digital Object Identifier</li>
<li>TA, TA001, TA007, TA008, TA009, TA011, TA012, TA014, TA015, TA016, TA017, TA025, TA030, TA031, TA032, TA033, TA036, TA053, TA062, TA063, TA064, TA065, TA066, TA067, TA070, TA077, TA081: Temporal Anomaly カタログエントリ識別子 (`data/temporal-anomaly-catalog.csv`)</li>
<li>AA, AA01, AA02, AA03, AA04, AA05, AA06, AA07, AA08, AA09, AA10, AA11, AA12, AA17, AA18, AA19, AA26, AA31, AA32, AA34, AA37, AA38, AA40: Frequency Anomaly Atlas エントリ識別子 (`data/anomaly-atlas.csv`)</li>
<li>CSV, JSON, NDJSON, API, PyPI, AGPL, GPL, IP, CD, PROJEKT, WebMCP, RCE, LUT6: カンマ区切り値、JavaScript Object Notation、改行区切り JavaScript Object Notation、アプリケーションプログラミングインタフェース、Python Package Index、GNU Affero General Public License、GNU General Public License、知的財産、CD PROJEKT 社の商標保有者、Web Model Context Protocol、Reality Code Engine（同一ハウス）、および 6 入力ブールルックアップテーブル（同一ハウス）</li>
<li>CVE, CWE, FRO, GMP, WHNF, CIC, FFI, RAPL: 共通脆弱性識別子（Common Vulnerabilities and Exposures）、共通脆弱性タイプ一覧（Common Weakness Enumeration）、Lean Focused Research Organization、GNU 多倍長演算ライブラリ（GNU Multiple Precision Arithmetic Library）、弱頭部正規形、帰納的構成計算（Calculus of Inductive Constructions）、外部関数インタフェース、および Running Average Power Limit</li>
</ul>

上から下へ前方参照を明確に保つため、セクション 1 では記法を定義し、セクション 2 では時間ループの複雑性を概観し、セクション 3 では時間的インデックス付けと Hellman 事前計算を取り上げ、セクション 4 では逆因果性と物理的緩和を分析し、セクション 5 では暗号的生存性を写像し、セクション 6 では候補公理 `A1 to A8` と零点条件 `Z1 to Z6` を評価し、セクション 7 では Horizon 条件 `C1 to C4` を証明しモデル `M1 to M8` を実行し、セクション 8 では三つの実証台帳（`TA001` から `TA081`、`AA01` から `AA40`、および `P01` から `P74`）を監査し、セクション 9 では偽証者 `F1 to F19` とゲームメカニクスを統合する。以前の Open Interface Engineering の研究 - [Thermodynamic Bounds and an Optimal Tempo](/papers/agency/)、[Metered Commit Gates](/papers/gates/)、[Deterministic Null](/papers/deterministic-null/)、および [Downward LUT6 Compilation](/papers/lut-adapt/) - は `[same house]` の仲間として、建築的文脈のためにのみ引用されている。

<div id="2-formal-models-of-time-loops-in-computation-d-ctc--pspace-p-ctc--pp-unbounded-δ2" class="anchor-alias" aria-hidden="true"></div>

## 2. 計算における時間ループの形式モデル（`D-CTC = PSPACE`、`P-CTC = PP`、非有界 $\Delta_2$）

Deutsch (1991) は、閉じた時間曲線の境界で運動学的自己整合性を要求することにより、有限量子レジスタ上の古典的な祖父矛盾を解決した。時間順序を尊重する入力状態 $\rho_{\text{in}}$ が $\mathcal{H}_{\text{CR}}$ 上で、因果律を破るレジスタ $\rho_{\text{CTC}}$ が $\mathcal{H}_{\text{CV}}$ 上で自身の過去に再入するという共同ユニタリ $U$ を通して相互作用するとする。整合性は、誘導された量子チャネル（モデル内部で `Established`）の固定点であることを $\rho_{\text{CTC}}$ に要求する。

$$\rho_{\text{CTC}} = \mathrm{Tr}_{\text{CR}}\!\left[\, U \left(\rho_{\text{in}} \otimes \rho_{\text{CTC}}\right) U^\dagger \,\right], \qquad \rho_{\text{out}} = \mathrm{Tr}_{\text{CV}}\!\left[\, U \left(\rho_{\text{in}} \otimes \rho_{\text{CTC}}\right) U^\dagger \,\right].$$

有限次元のコンパクト凸状態空間上のすべての完全正値トレース保存チャネルは少なくとも一つの Schauder-Brouwer 固定点を持つため、回路が論理的矛盾を引き起こすことはなく、決定的パラドックスは混合状態になる。重要なのは、$\rho_{\text{CTC}}$ が $\rho_{\text{in}}$ に依存するため、実効的な入力から出力への写像 $\rho_{\text{in}} \mapsto \rho_{\text{out}}$ が $\rho_{\text{in}}$ に対して **非線形** になることである。その非線形性：量子重ね合わせだけでなく：が、すべての形式的 CTC モデルにおける計算的飛躍を駆動する。

| Formal result | Mathematical statement | Venue / status | Epistemic label |
| :--- | :--- | :--- | :--- |
| **Brun (2003)** | 将来から候補因子をチェックし、そうでなければ総当たりのフォールバック探索を実行する古典的固定点レジスタは、因子が探索を実行せずに現れる場合にのみ整合的である。 | *Found. Phys. Lett.* 16:245 | **`Established`** (古典モデル) |
| **Bacon (2004)** | 多項式ゲート量子回路を `D-CTC` 量子ビットに結合すると、ループパスごとに微小な状態分離を指数的に増幅し、`NP` 完全 `SAT` を解くことができる。 | *Phys. Rev. A* 70:032309 | **`Established`** (`D-CTC` モデルにおいて) |
| **Aaronson & Watrous (2009)** | 古典および量子多項式時間 `D-CTC` マシンは同一の計算力を持つ: $\mathrm{P}_{\text{CTC}} = \mathrm{BQP}_{\text{CTC}} = \mathrm{PSPACE}$。 敵対的固定点選択は $\mathrm{PSPACE}$ の範囲に留まる。 | *Proc. R. Soc. A* 465:631 | **`Established`** (`D-CTC` モデルにおいて) |
| **Bennett, Leung, Smith & Smolin (2009)** | *ラベル付けされた* 統計的集合に対して、`D-CTC` 進化は凸線形性を破る。 ラベル付け混合上で計算を定義すると、状態判別の抜け道が除去される。 | *Phys. Rev. Lett.* 103:170502 | **`Established`** 批判; 解釈は争点 |
| **Lloyd et al. (2011)** | `P-CTC` はベル状態事後選択に条件付けた量子テレポーテーションにより時間ループをモデル化し、矛盾する枝に重み0を割り当てる。 計算力は $\mathrm{PostBQP} = \mathrm{PP}$ に等しい。 | *Phys. Rev. Lett.* 106:040403; *Phys. Rev. D* 84:025007 | **`Established`** (回路モデルおよび光子回路テスト、時空CTCではない) |
| **Brun, Wilde & Winter (2013)** | 多項式 `D-CTC` 回路は任意の量子状態を任意の忠実度でクローンし、`D-CTC` 状態空間を実質的に古典的にアクセス可能にする。 | *Phys. Rev. Lett.* 111:190401 | **`Established`** (`D-CTC` モデルにおいて) |
| **Aaronson, Bavarian, Gueltrini et al. (2024 v2)** | 無限幅 `D-CTC` チューリング機械は正確に $\Delta_2 = \mathrm{P}^{\mathrm{HALT}}$（停止問題にチューリング還元可能な言語）を決定し、Raat (2023) によって指摘された 2016 年プレプリントの誤りを訂正した。 | `arXiv:1609.05507v2` (Oct 2024) | **`Established`** (訂正済みプレプリント) |

固定点アルゴリズムを支配する二つの構造的微妙さがある。第一に、Brun (2003) の知識創成構成では、フォールバックの総当たりループは整合的な歴史上決して実行されないが、**回路記述内で物理的に存在し、終了できなければならない**。 フォールバックを削除すると、`0` のような自明な非解決固定点が復元される。第二に、固定点は一意である必要はない（`polchinski_multiplicity`）。 Bishop の `Qhronology`（`arXiv:2601.17459`, `v1.2.1`, AGPL-3.0-or-later 非商用）祖先回路 ― `CV` 制御の `CNOT` が `CR` を対象とし、続いて `SWAP`、入力は $|0\rangle\langle 0|_{\text{CR}}$ ― を正確なシンボリック SymPy（`M2`, `code_and_proofs/run_models_m1_m8.py`）で再現すると、`D-CTC` 下で全パラメータの対角ファミリー $\rho_{\text{CR}} = \rho_{\text{CV}} = g|0\rangle\langle 0| + (1-g)|1\rangle\langle 1|$（$g \in [0,1]$）が得られる。一方、`P-CTC` は `CR` を唯一 $|+\rangle\langle +|$ に射影し、最大混合 $\rho_{\text{CV}} = I/2$ を与える。

<figure class="my-8">
  <img src="/figures/time-as-an-index/ctc-vs-physics-hierarchy.svg" alt="無制限 D-CTC、Polynomial D-CTC、事後選択 P-CTC、標準量子 BQP、既知の物理インデックスを暗号的生存性と比較した五層階層" />
  <figcaption>図 1. 正式な閉じた時間ループ (<code>Δ₂</code> と <code>PSPACE</code>) から事後選択回路 (<code>PP</code>)、標準量子アルゴリズム (<code>BQP</code>)、そして物理的に実現可能な事前計算 (<code>Hellman T·M² = N²</code>) までの複雑性上限と暗号的生存性。合成図であり、ハードウェアの電力測定ではない。</figcaption>
</figure>

<div id="3-time-as-an-index-in-known-physics-temporal-databases-retroactive-lower-bounds-and-hellmans-tm2n2" class="anchor-alias" aria-hidden="true"></div>

## 3. 既知の物理学における時間のインデックス化：時間的データベース、遡及的下界、およびヘルマンの $T \cdot M^2 = N^2$

コンピュータ科学はすでに記録された過去時間を明示的なインデックス（`Established`）として扱っている。

1. **時間的リレーショナルテーブルとイベントログ**: `SQL:2011` は Snodgrass の `TSQL2` 設計（Kulkarni と Michels 2012）に従い、アプリケーション時間とシステムバージョン管理テーブルを標準化した。一方、`rr`（O'Callahan ら 2017）などの決定的レコード・アンド・リプレイデバッガは、非決定的入力をログに取り、前方遷移を再実行することで過去のプログラム状態を再構築する。

2. **永続的データ構造と遡及的データ構造**: Driscoll, Sarnak, Sleator, および Tarjan（1989）は、完全永続性：過去の任意のバージョンを問い合わせまたは分岐し、履歴を変更しない：はステップあたり $O(\log n)$ のオーバーヘッドしか付加しないことを証明した。対照的に、Demaine, Iacono, および Langerman（2007）は、*遡及的* データ構造：過去のタイムスタンプ $t_0$ に操作を挿入または削除し、以降の $r$ 操作全体にわたって更新された現在を問い合わせる：は一般に $\Omega(r / \log r)$ の乗法的オーバーヘッドを必要とすることを示した（`Established`）。以前のステップを書き換えることは、それに続くチェーンの因果的再評価を強制する。

3. **前計算が唯一の物理的未来インデックスであること**: $N$ 状態の決定的写像 $f : \{0,\dots,N-1\} \to \{0,\dots,N-1\}$ の未記録の未来状態をインデックス付けするには、$f$ を事前に評価する必要がある。Hellman（1980）は、長さ $t$ の $m$ ハッシュチェーンを用いたトレードオフを定量化した。$(x_{\text{start}}, x_{\text{end}})$ ペアを保存するとメモリは $M = m$ ワードを消費し、オンラインでの逆算には $T = t^2$ 評価が必要で、$t$ テーブルを跨いで $m t^2 = N$ 状態をカバーし、総メモリ $M_{\text{tot}} = m t$ が（`Established`）を満たす：

$$T \cdot M_{\text{tot}}^2 = N^2 \qquad \text{after a one-time table fill of } \Theta(N) \text{ evaluations.}$$

バランスの取れた動作点 $M_{\text{tot}} = T = N^{2/3}$（$N = 2^{16} = 65{,}536$、$N^{2/3} \approx 1{,}625.5$ の場合）では、オンライン検索は高速であるが、これはフィラーが事前に完全な $N$ ステップの総当たり探索を支払っているためであり、Oechslin（2003）のレインボーテーブルにより定数因子で改善され、Fiat と Naor（2000）が一般的なランダム関数に対して最適であることを証明し、Bennett（1989）の可逆ペブルリング境界と合わせて説明できる。$s$ ランダムビットでソルトを付加すると、フィル作業は $2^s$ 倍になる。クエリを新しいチャレンジ（ポストリクエストノンスまたは前ブロックヘッダハッシュ）に結び付けることで、前計算テーブルの再利用はゼロになる（`M7` における `200` 回の新ブロック試行で `0.0%`、単一テーブルのソルトなし回復で `34.0%`）。

<div id="4-retrocausality-no-signalling-physical-settling-and-the-gabor-frequency-window" class="anchor-alias" aria-hidden="true"></div>

## 4. 遡及因果性、非シグナリング、物理的収束、およびガボール周波数窓

<div id="41-quantum-retrocausality-and-the-postselection-bill" class="anchor-alias" aria-hidden="true"></div>

### 4.1 量子遡及因果性と後選択のコスト

いくつかの基礎的プログラムは、未来の境界条件を用いて量子相関を記述する: Aharonov-Bergmann-Lebowitz (1964) の二状態ベクトル形式 (`TSVF`, `Established` として同等の再定式化) 、Leifer と Pusey (2017) の定理で、任意の $\lambda$ を媒介とする時間対称的実体論がエンタングルメントを再現するにはレトロカジュアル相関を許容しなければならないことが `Established` として示されている、Price と Wharton (2015) のジグザグ解釈が `Speculation` として新物理を提案、Castagnoli (2009-2025) の解釈規則で、量子クエリ数を半分の解ビットを与えられた古典的学習者と比較する `Conjecture` 、そして Aharonov と Elitzur の (`arXiv:2611.12971`, 2026年11月) 二枝時間平行移動モデルでは、事後選択された原子の再励起が環境の放射記憶時間：自由空間でおおよそ $1\text{ fs}$ ：内にのみ存続し、指数的に減衰する事後選択確率を要求する `Conjecture` が示されている。同様に、Ji, Lloyd, Wilde (*Phys. Rev. Lett.* 136:230801, 2026) は、最大情報と正則化ドエブリン情報から雑音付き `P-CTC` レトロカジュアル容量を導出し、標準量子力学が逆方向シグナリングをゼロに許容することを明示的に指摘している `Established` in `P-CTC`。

これらの枠組みはいずれも早期検索オラクルを提供しない。標準量子力学は **no-signalling theorem** を満たすためである: 任意の二分割または二時間状態 $\rho_{12}$ と、任意の未来/遠隔装置 $\{E_b^y\}$ が設定 $y$ を自由に選択し、$\sum_b E_b^y = I_2$ を満たすとき、早期の周辺結果分布は $y$ に対して厳密に独立する:

$$P(a \mid x, y) = \mathrm{Tr}\!\left[(M_a^x \otimes I_2)\,\rho_{12}\right] = P(a \mid x).$$

望ましい事後選択結果 $b = b^*$ を確率 $p$ で条件付けるには、準備をおよそ $1/p$ 回繰り返す必要がある（「anthropic computing」、Aaronson 2005）。明示的ユニタリ証人探索モデル `M2b`（`3` から `6` ビット、ヒルベルト次元 $d = 2^n \in \{8, 16, 32, 64\}$）では、`P-CTC` ベル射影は正確な確率 $P_{\text{post}} = 1/d^2$ で成功し、期待繰り返し回数は `64`, `256`, `1,024`, `4,096` となり、古典的 $d/2$ の全探索的推測（`4` から `32` クエリ）よりも必ずコストが高い。

<div id="42-analog-settling-hardware-and-the-gabor-uncertainty-barrier" class="anchor-alias" aria-hidden="true"></div>

### 4.2 アナログ収束ハードウェアとガボール不確定性障壁

Physical relaxation machines は離散的なクロックティックを連続的なダイナミクスに置き換えるが、解析されたすべての基底は指数的組み合わせ困難性を別の物理資源へと移す（`Established` パターン、Aaronson 2005）:

| Physical substrate | Mechanism | Limiting resource barrier | Status |
| :--- | :--- | :--- | :--- |
| **Physical reservoir computing** | Fixed nonlinear medium projects past input streams; linear readout trained (Tanaka et al. 2019). | Causal filter over past arrivals; zero lookahead into future inputs. | **`Established`** |
| **Coherent Ising machines** | Degenerate optical parametric oscillators relax toward low-loss spin states (Inagaki et al. 2016; McMahon et al. 2016). | Heuristic approximation; connectivity, calibration, and hard-instance time-to-solution remain open (*Nat. Rev. Phys.* Nov 2026). | **`Established`** (heuristic) |
| **Continuous-time analog `SAT`** | Deterministic ordinary differential equations with solution attractors (Ercsey-Ravasz & Toroczkai 2011). | Polynomial continuous coordinate time requires **exponential auxiliary variable / energy fluctuations** across fractal chaotic basins. | **`Established`** |
| **Frequency-multiplexed memcomputing** | Encodes $2^n$ subset sums into harmonic frequencies (Traversa & Di Ventra 2015). | Resolving $2^n$ frequencies in finite bandwidth requires $\delta f \sim 2^{-n}$, hence observation window $\Delta t \gtrsim 2^n$ and $2^{-n}$ amplitude per line (Aaronson 2015). | **`Speculation`** (polynomial scale contested) |
| **Thermodynamic & `p-bit` silicon** | Normal Computing `CN101` (2025 tape-out; ARIA 2026 bring-up) and Extropic `Z1` (`269,568` `p-bits` projected, `arXiv:2510.23972`). | Targets linear-algebra/Monte Carlo sampling; `1,000x`-`10,000x` efficiency figures are vendor targets/projections, not hardware-rail `NP` proofs. | **`Speculation`** (vendor targets) |

Representing a trajectory $x(t)$ in the frequency domain via $X(f) = \int x(t) e^{-2\pi i f t}\,dt$ - whether digitally in $O(N \log N)$ operations (Cooley and Tukey 1965) or optically in a single propagation pass across silicon metalens `DFT` arrays (Tanuwijaya et al. 2025, `arXiv:2502.08770`) and photonic joint-transform correlators (Yang et al. 2025, `arXiv:2504.01117`, projecting `305 TOPS/W`) - requires the entire sample window to exist before transformation and obeys Gabor's (1946) root-mean-square uncertainty product (`Established`):

$$\Delta t \cdot \Delta f \;\ge\; \frac{1}{4\pi}.$$

Frequency transformation trades temporal localization for spectral resolution; it never deletes the observation duration required to separate closely spaced modes.

<div id="5-cryptographic-consequences-ecdsa-sha-256d-proof-of-work-symmetric-ciphers-qkd-stateful-rewinding" class="anchor-alias" aria-hidden="true"></div>

## 5. 暗号論的帰結（`ECDSA`、`SHA-256d` プルーフ・オブ・ワーク、対称暗号、`QKD`、状態付き巻き戻し）

すべての標準的な公開鍵、共通鍵、ハッシュパズルは多項式時間で候補証人を検証するため、鍵回復とノンス探索は $\mathrm{NP}$ (または $\mathrm{NP} \cap \mathrm{coNP}$) $\subseteq \mathrm{PSPACE}$ に位置付けられる。したがって、多項式 `D-CTC` オラクルは 1 回の固定点評価で全ての計算暗号を破壊し、実世界の量子および古典的インデックス攻撃は代数的構造と入力の新鮮さにより鋭く分離する。

| 暗号対象 | 形式的 `D-CTC` (`PSPACE`) | 標準量子 (`BQP`) | 物理的事前計算 (`Known Physics`) |
| :--- | :--- | :--- | :--- |
| **`ECDSA` / `secp256k1`** | **破られる** (`1` 固定点クエリ) | **破られる** $\mathrm{poly}(\log N)$ において Shor の群周期アルゴリズム (Aggarwal et al. 2018) | **安全** 256 ビットランダム曲線鍵に対する汎用テーブルに対して |
| **`SHA-256d` Proof of Work** | **破られる** (`M7`: `1` クエリで `8, 12, 16` ビットパズルを解く) | 二次 Grover $\frac{\pi}{4}\sqrt{N}$; 近い将来の特殊 `ASIC` クロックレートに対して **純利益なし** | **安全**: ヘッダーが `prev_block_hash` にコミットし、事前ブロックテーブルの埋め込みを防止 (`M7` における再利用 `0.0%`) |
| **静的ハッシュ事前像** | **破られる** | $2^n \to 2^{n/2}$ クエリ (Grover 最適) | **塩なしパスワードは** Hellman / レインボーテーブルに陥る; ユーザーごとのソルトが $2^s$ 倍の埋め込みを増加させる |
| **共通鍵 `AES-256`** | **破られる** (既知平文鍵探索) | $\sim 2^{128}$ Grover クエリ ($\approx 128$ ビットのポスト量子安全性が保持) | 固定平文 Hellman テーブルは $N = 2^{256}$ で実現不可能 (Landauer 埋め込み下限 $\approx 3.32 \times 10^{56}\text{ J}$) |
| **準備・測定型 `QKD` (`BB84`, `B92`)** | **`D-CTC` で破られる** 非線形状態クローン/判別により (Brun, Harrington & Wilde 2009; Bennett et al. 2009 によるラベル付混合の議論) | **安全** Hilbert 空間のノークローンと単独性により | 該当なし (オンライン物理チャネル) |
| **状態保持型 vs 無状態ゲーム** | 鍵が計算的であれば破られる | 基礎プリミティブに依存 | **Meier (2022)** (`IACR ePrint 2022/1148`): 多項式境界の状態巻き戻しが状態保持 `IND-CCA` と `EUF-CMA` の帳簿管理を破壊し、無状態 `IND-CPA` と `UUF-CMA` は保持 |
| **ワンタイムパッド (`OTP`) と秘密分散** | **無条件に安全** | **無条件に安全** | **無条件に安全** (全平文が同等確率を保つ) |

<div id="6-candidate-searchable-time-axioms-a1a8-zero-point-ledger-z1z6-reconstruction-memory-and-bci-bits-per-joule" class="anchor-alias" aria-hidden="true"></div>

## 6. 候補となる時間検索可能公理（`A1`-`A8`）、ゼロ点台帳（`Z1`-`Z6`）、再構成記憶、および `BCI` ビット毎ジュール

<div id="61-testing-candidate-axioms-a1-to-a8-and-zero-point-ledger-z1-to-z6" class="anchor-alias" aria-hidden="true"></div>

### 6.1 候補公理 `A1 to A8` およびゼロ点台帳 `Z1 to Z6` の検証

| 候補公理 | 確立された物理学との評価 | ラベル |
| :--- | :--- | :--- |
| **`A1`** (時間 = 不可逆遷移の正味カウント；復元された遷移はゼロを加える) | Connes-Rovelli (1994) の熱的時間および Barbour (2009) の関係的配置と概念的に関連するが、光学時計は刻みの散逸とは独立した相対論的固有時 $d\tau/dt = 1 + \Phi/c^2$ を確認している (`F1`)。 | **`Conjecture`** |
| **`A2`** (各ビット復元は $k_B T \ln 2$ のコストを要する) | *盲目的* 2対1リセット (`300 K` において `2.87e-21 J`、Landauer 1961) の下限として厳密に成立する；情報を利用した可逆的アンコンピュテーションは熱力学的下限がゼロである (Bennett 1973、`F2`)。 | **`Established`** (盲目的リセット)；可逆の場合は矛盾 |
| **`A3`** (復元が成功する局所的な矢印の反転) | 閉じた系のエントロピーが第二法則のもとで非減少に保たれるよう熱浴への熱が輸出される一方、サブシステムのエントロピーは局所的に減少しうる。 | 局所的に **`Established`** |
| **`A4`** (非同期な細胞イベントが事後約 80 ms で統合される) | 成人の人体は $\sim 3.0 \times 10^{13}$ 個のヒト細胞と $\sim 3.8 \times 10^{13}$ 個の細菌から構成され、1日あたり $\sim 3.3 \times 10^{11}$ 個の細胞が入れ替わり (Sender、Fuchs & Milo 2016)、フラッシュラグ知覚はその後の $\sim 80\text{ ms}$ を統合する (Eagleman & Sejnowski 2000；`F7`)。 | 生物学・知覚として **`Established`**；基礎物理学としては **`Speculation`** |
| **`A5`** (同一元素の原子が先行・遅延する；平均ではなく分布を保持する) | 光学時計は $33\text{ cm}$ における重力的時間伸張を $(4.1 \pm 1.6)\times 10^{-17}$ の精度で分解し (Chou et al. 2010)、ストロンチウムの $1\text{ mm}$ にわたる測定では $-9.8(2.3)\times 10^{-20}\text{ mm}^{-1}$ が $g/c^2 = 1.09\times 10^{-19}\text{ mm}^{-1}$ と一致する (Bothwell et al. 2022)。これは将来へのアクセスではなく、レート勾配を測定するものである (`F3`)。 | レートとして **`Established`**；追加情報については **`Conjecture`** |
| **`A6`** (時間的共存は空間的共存と同様に検索可能である) | ミンコフスキー計量 $(-,+,+,+)$ は空間的な参照を過去光円錐 $J^-(o)$ に沿って到着する信号に制限し、$J^-(o)$ の外部の記録を読み取ることは非信号伝達条件に違反する (`F4`、`F6`)。 | (未来光円錐に対して) **`Speculation`** |
| **`A7`** (サイクルは可逆フーリエ・コンプトン基底で照会可能である) | プランシュレルの等式 $E = h\nu$、および $\nu_C = 2.993 \times 10^{25}\text{ Hz}$ 付近の Cs-133 物質波時計 (Lan et al. 2013) は確立されており、ガボールの $\Delta t \cdot \Delta f \ge 1/(4\pi)$ 窓境界に従う (`F5`)。 | 数学として **`Established`**；生きられた枠組みとしては **`Speculation`** |
| **`A8`** (時間を照会することは真空エネルギーを照会することである) | 時間並進ネーターの共役性はエネルギーを**保存**するのであって、自由仕事を供給するものではなく、ゼロ点台帳 `Z1 to Z6` によって支配される (`F8`)。 | 共役性として **`Established`**；正味収穫については **`Speculation`** |

研究プログラムの第 12 節および第 13 節は、非同期な局所遷移と周波数インデックス付き記録から巨視的な時間がボトムアップで出現する提唱者モデルを評価する。上記の表は各候補公理を確立された物理学と照合した結果をまとめたものである。

真空エネルギー抽出（`Z1` から `Z6`）において、六つの会計規則が既知のすべての実験サイクル（`Established`）を閉じる：(`Z1`) 静止基底状態は受動的である、$\mathrm{Tr}(U \rho_0 U^\dagger H) \ge E_0$（`500/500` のハール乱択ユニタリが `M6` で検証され、最小 $\Delta E = +0.347 > 0$）；(`Z2`) 動的カシミール光子対 $\omega_1 + \omega_2 = \omega_d$ はエネルギーを境界ポンプから直接引き出す（Wilson ら 2011; `M6` のパラメトリック圧縮が $r = 5.0$ で $\sinh^2(5) = 5.51 \times 10^3$ 光子を生成し、ポンプ作業によって支払われる）；(`Z3`) 静的鏡引力 $P = \pi^2 \hbar c / (240 a^4)$（`1.30e-3 Pa` が $1\,\mu\text{m}$、Lamoreaux 1997; `1.30e5 Pa` が $10\text{ nm}$）は一回限りの作業 $\pi^2 \hbar c / (720 a^3) = 4.33 \times 10^{-10}\text{ J/m}^2$ を $1\,\mu\text{m}$ で生成し、リセット時に同一に返済される（$W_{\text{net}} = 0$）；(`Z4`) フィードバックソーティングは消去されたビットあたり $\ge k_B T \ln 2$ を支払う；(`Z5`) 実験フレームは CTC や非静止計量ポンプを欠く；そして (`Z6`) 任意の主張は $5\sigma$（`F8`）を上回る閉サイクル熱量測定の余剰を必要とする。

<div id="62-constructive-memory-provenance-fidelity-textual-timelessness-and-bci-throughput" class="anchor-alias" aria-hidden="true"></div>

### 6.2 構成的記憶、出所忠実性、テキスト的無時間性、および `BCI` スループット

神経科学および認知心理学は、人間の記憶を **allowed past-light-cone reconstruction** ブランチ (`C4`) にしっかりと位置付ける。その結合失敗モードは *provenance* であり、逆因果性 (`Established`) ではない。

* **構成的再想起とエンコード後歪曲**: 再活性化された記憶はタンパク質合成阻害下で可塑的になる（Nader, Schafe & LeDoux 2000）; Bartlett（1932）の構成的再想起と Schacter（1999）の情報源誤帰属は、Loftus と Palmer（1974）で定量的に示されており、動詞を *"smashed"* から *"hit"* に変えることで、1 週間後の偽の割れガラス想起が `14%` から `32%` にシフトした。また、Roediger と McDermott（1995）の `DRM` パラダイムでは、提示されなかった重要な誘導語が `40%`（実験 1）および `55%`（実験 2）で想起された（`F10`）。海馬の逆再生（Foster & Wilson 2006）、シータ-ガンマ位相符号化（Lisman & Jensen 2013）、予測処理（Friston 2010; Clark 2013）、および未踏トラック前の `14.2%` の適格イベントの休息前再生（Dragoi & Tonegawa 2011）は、将来の信号ではなく内部生成的事前分布を反映している。起源忠実度は、再構築 $R$ とエンコードされた過去記録 $E$ との間の $I(R; E) / H(R)$ によって定量化される。

* **メディア密度、目撃者リレー減衰、そしてデジャヴ**: 以前の草稿で用語が入れ替わっていた点を訂正し、McLuhan の *Understanding Media*（1964）は *hot* メディア（アルファベット印刷など）を高解像度/低参加型、*cool* メディアを低解像度/高参加型と定義している。中立的に述べると、チャネル再構築需要 $D = 1 - I(X; C)/H(C)$ は内部生成的事前分布（`Conjecture`）を行使する。人間のチェーン（Wells & Olson 2003; NRC 2014）において、ホップごとの保持率 $f$ は $f^k$（$0.9^{10} = 0.35$）として減衰する。調査によれば、成人の約三分の二がデジャヴを経験すると報告されている（Brown 2004）。しかし、仮想ナビゲーション実験は、次のターン予測が知覚的な確信感が高まっても偶然レベルにとどまることを確認している（Cleary & Claxton 2018; `F12`）。Bem（2011）の $d = 0.22$ 逆行的促進は、大規模な再現実験で失敗した（Ritchie et al. 2012, $p = 0.83$; Galak et al. 2012, $N = 3{,}289$, $d = 0.04$; `F11`）。

* **聖典的・哲学的永遠性の因果円錐へのマッピング**: 古典テキスト - `2 Samuel 23:2`（*「主の霊が私を通して語った」*）、`Psalm 90:4`（*「千年はあなたの目には昨日のようだ」*）、アウグスティヌス『告白』 XI.18-20（過去のものの現在は記憶、現在は視覚、未来は期待として、現在の兆候と原因を読む）、ボエティウス『慰め』 V.6（永遠は時間的連続の外側で同時的に所有される）、Weyl（1949）、Barbour のタイムカプセル - 時空外の非時間的視点（神学的/形而上学的、実験物理学の外部）と、時空内の具現化された観測者を区別し、後者にとっては過去光円錐の星光とアーカイブから広い「今」を組み立てることが `Established` であるが、$J^-(o)$ の外部から特定の未来結果を受け取ることは時空的信号送信（`F4`, `F6`, `F11`, `Speculation`）に該当する。

* **人間の出力帯域幅と `BCI` ビット/ジュール**: $\sim 20\text{ W}$ 全脳代謝パワー（Balasubramanian 2021）と $\sim 10^9\text{ bit/s}$ 感覚入力に対抗し、人間の行動スループットは平均 $\sim 10\text{ bit/s}$（Zheng & Meister 2025）であり、`17` 言語にわたる跨言語スピーチは平均 `39 bit/s`（Coupé et al. 2019）である。これにより $\eta = R/P \approx 0.5$ から $1.95\text{ bit/J}$ が得られ、概算で $1.7 \times 10^{20}$ 倍、$310\text{ K}$ ランダウア上限 $1/(k_B T \ln 2) = 3.37 \times 10^{20}\text{ bit/J}$（`M5`）の下に位置する。皮質内スピーチ `BCI` は `78` 語/分（$\approx 19\text{ bit/s}$, Metzger et al. 2023）、`62` 語/分（$\approx 15\text{ bit/s}$, Willett et al. 2023）、`31.6` 語/分（$\approx 7.7\text{ bit/s}$, Card et al. 2024）であり、自然スピーチよりも低く、言語モデル事前分布に依存している。その著者シェアは監査が必要である（`F13a`, `F13b`）。

<figure class="my-8">
  <img src="/figures/time-as-an-index/past-cone-provenance-dag.svg" alt="Causal directed acyclic graph comparing solid past-light-cone record reconstruction edges against the dashed speculative timelike signalling edge." />
  <figcaption>図 2. 許容された過去光円錐再構成（実線エッジ：ロスィエンコーディング、保存されたレコード、スキーマ/デコーダ事前分布、及び証跡ゲート <code>I(R;E)/H(R)</code>）は、外部 <code>J⁻(o)</code> からの投機的時間様受信（破線エッジ、<code>5σ</code> で <code>F4, F6, F11, F12, F19</code> により検証）と対照的である。</figcaption>
</figure>

<div id="7-the-horizon-theorem-c1c4-explicit-models-m1m8-and-lean-4-kernel-checked-proofs" class="anchor-alias" aria-hidden="true"></div>

## 7. 地平線定理（`C1`-`C4`）、明示的モデル（`M1`-`M8`）、および Lean 4 カーネル検証済み証明

<div id="71-formal-horizon-and-consistency-theorems-code_and_proofsleanhorizonlean" class="anchor-alias" aria-hidden="true"></div>

### 7.1 形式的地平線定理および整合性定理（`code_and_proofs/lean/Horizon.lean`）

相対性理論や量子力学に違反することなく、任意の時刻 $t$ におけるシステムの状態が、現在の記録 $R$ の well-defined な数学的関数となるのはいつか。第7節では、粗い記録の地平線 (`H-coarse`) とともに、4つの同時に整合する十分条件 (`C1 to C4`) を形式化し、自己完結した `Lean 4.36.0` において `17` 個の地平線定理と `14` 個のパラドックス定理 (合計 `31` 個、`sorry` はゼロ) を検証する (AlphaProof、Hubert et al. 2025 などのカーネル検証ワークフローに着想を得た):

| 地平線条項 | 形式的数学的命題 | 検証済み Lean 4 定理 (`TQ`) | 状態 |
| :--- | :--- | :--- | :--- |
| **`C1` 忠実な添字** | 有限な狭義非巡回因果順序はすべて、因果的先行関係 ($u \prec v \implies \mathrm{idx}(u) < \mathrm{idx}(v)$) を保存する $\mathbb{N}$ への単射的線形拡張を持つ。 | `M1.exists_time_index`、`M1.dag_irrefl`、`M1.dag_asymm` | **`Kernel-checked`** (`propext`、`Quot.sound`) |
| **`C2` 無損失ダイナミクス** | 単射/全単射なステップ発展 $T$ (有限ユニタリ性) の下で、$T^t(R)$ は一意に決定され、異なる現在は異なる未来に写像され、`16` 状態上で $I(R; X_t) = H(X_t) = 4.000\text{ bits}$ を伴う $T^{-t}(T^t(R)) = R$ が成立する。 | `future_determined`、`iterate_injective`、`past_recovered` | **`Kernel-checked`** (`0` 公理 / `propext`) |
| **`C3` 帯域制限構造** | $d$ モードの多項式/三角関数信号 ($z = e^{i\omega t}$) はすべて、任意の $d$ 個の互いに異なる過去サンプルによって将来のすべての点で一意に確定される; $\mathbb{Z}/4\mathbb{Z}$ 上の `DFT` は厳密な Plancherel ノルム保存 $\sum |X_k|^2 = 4 \sum |x_n|^2$ を満たす。 | `M3.future_from_past_samples`、`M3.plancherel_z4` | **`Kernel-checked`** (標準 3) |
| **`C4` 過去光円錐局所性** | $1+1$ ミンコフスキー空間において、$(\Delta t)^2 - (\Delta x)^2 = du \cdot dv$、時系列的先行関係は非反射的かつ推移的であり、$I^+(o)$ は $J^-(o)$ と厳密に素である (`past_cone_no_future_access`)。 | `M4.interval_lightcone`、`M4.future_timelike`、`M4.future_irrefl`、`M4.future_trans`、`M4.past_cone_no_future_access` | **`Kernel-checked`** (標準 3) |
| **`H-coarse` 地平線境界** | 非単射な粗い記録 (2原子平均 `(-1, 1)` 対 `(0, 0)` や 4ビット状態の 2ビットビニングなど) はすべて、厳密なデコーダを**持たない**; ノイズおよび有限 Slepian 窓は、窓の地平線を超えると外挿誤差を爆発させる。 | `M1.coarse_record_horizon`、`M1.mean_not_injective`、`M5.erase_not_injective` | **`Kernel-checked`** (`0` 公理) |
| **同時充足可能性** | 基底状態の受動性 (`M6.ground_state_passive_two_level`) とともに `C1`、`C2`、`C3`、および `C4` を同時に満たす明示的な非空の証人。 | `horizon_conditions_consistent`、`M6.ground_state_passive_two_level` | **`Kernel-checked`** (`propext`、`Quot.sound`) |

**6カーネル `bubblewrap` サンドボックス化 `lake check --paranoid` 監査（`CVE-2026-72844`、`CVE-2026-72711`、`#16688`、および `#16693` 対策強化済み）。** 2026年の Lean 4 健全性に関する脆弱性開示（`CVE-2026-72844`［`leanprover/lean4#14576`、`<= v4.31.0` における幽霊パラメータ付き入れ子帰納型 `.proj` の型混同 `CWE-843`］、`CVE-2026-72711`［`#14484`、`add_opaque` における自由変数閉包検査の欠落］、`Kernel.Environment.replay` における偽造 `.inductInfo` のスキップ［`#16688`］、`.olean.server` サイドカー／リプレイキーの不整合［`#16674`、`#16675`］、`Prop` 構造体フィールド射影の厳格化［`#14977`］、およびコンパイラ信頼に依存する `native_decide`［`Lean.ofReduceBool` `FFI`、`#16693`］）を受け、`openie-research-experiments/time-as-an-index/lean/verify_six_kernels.py`（`six_kernel_paranoid_audit.json`、`six_kernel_paranoid_audit.csv`、コミット `1f50db59`）は、`sorry` ゼロ、カスタム `axiom` ゼロ、`opaque` ゼロ、入れ子帰納型ゼロ、非 `Prop` フィールドを持つ `Prop` 構造体ゼロ、および `Lean.ofReduceBool` ゼロ（無公理定理 `10 / 31`、選択公理不使用 `23 / 31`）を強制し、`Lean v4.36.0` でクリーンにビルドしたうえで（`1,129.83 ms`、Linux `RAPL` パッケージ `reported_j` が `61.66 J`）、非特権 Linux `bubblewrap 0.11.1`（`bwrap`）読み取り専用・ネットワーク隔離名前空間内でテキスト形式の `NDJSON` 宣言をエクスポートし（`283,210.00 ms`、コア `1,632.08 J`／パッケージ `27,217.18 J` `reported_j`、`measured_j = None`、`board_metered = false`）、6つの独立したチェッカーすべてによって全会一致で検証されている：

| 独立証明チェッカー（`bwrap` 内の `lake check --paranoid`） | 実装と健全性の根拠 | 検証済み宣言数 | 判定 | 緩和される脆弱性クラス |
| :--- | :--- | :---: | :---: | :--- |
| **`con-leche --verified`** | `ZFC` 集合論で無矛盾性が形式的に証明された最小参照カーネル（Breitner；`False` を受理し得ない） | `58,796` | **`Accepts`** | `CVE-2026-72844`（入れ子帰納型 `.proj`）、`CVE-2026-72711`（`add_opaque`）、`WHNF` キャッシュバグ |
| **`con-ron --verified`** | *Aeneas* により検証された `con-leche` の Rust 精緻化実装 | `58,796` | **`Accepts`** | `CVE-2026-72844`、`CVE-2026-72711`、C++ メモリおよび `GMP` 多倍長整数バグ（`#14833`） |
| **`lean4lean`** | 独立した Lean-in-Lean `CIC` 型チェッカー（Carneiro） | `58,798` | **`Accepts`** | C++ カーネル実装の乖離および `#14977` 射影型付け |
| **`nanoda`** | Lean ランタイム非依存のスタンドアロン Rust エクスポート検証器（`sorryAx` 遮断） | `58,798` | **`Accepts`** | `.olean` リプレイ改ざん（`#16674`、`#16688`）および不許可の `sorryAx` |
| **`leanchecker --paranoid`** | タクティクおよびコンパイラへの信頼ゼロの新規環境 C++ カーネルリプレイ | `58,798` | **`Accepts`** | メタプログラミングによる環境書換え、`skipKernelTC`、および `Lean.ofReduceBool`（`#16693`） |
| **`Lean v4.36.0`（デフォルト）** | `CVE` 修正後の2026年11月版 C++ カーネル（`#print axioms` 強制） | `58,798` | **`Accepts`** | 2026年の全カーネル `CVE` 修正済み；`sorry` `0`、`opaque` `0`、`ofReduceBool` `0` |

<div id="72-numerical--symbolic-verification-across-m1-to-m8-and-f5-seed--20261122" class="anchor-alias" aria-hidden="true"></div>

### 7.2 `M1 to M8` および `F5` にわたる数値的・記号的検証（`seed = 20261122`）

`code_and_proofs/run_models_m1_m8.py` を実行すると、すべての8つのモデルと事前に登録された `F5` スペクトルテストに対して、決定的な JSON 検証 (`code_and_proofs/models_m1_m8_results.json`) が生成される:

| モデル | 検証計算 (`seed = 20261122`) | 定量的出力 | 物理的偽装子 |
| :--- | :--- | :--- | :--- |
| **`M1` Indexed dataset** | `n = 1,000,000` 個の順序付けられたレコード; 直接インデックス vs 二分探索 vs `777,777` への線形走査; 4ビット世界での2ビット粗いレコード; 2対1ロスステップ at $t=5$. | `1` ステップ vs `20` ステップ ($\lfloor \log_2 10^6 \rfloor + 1$) vs `777,778` ステップ; 粗い相互情報 `2.000` vs `4.000` ビット; `8/16` 未来が $t=5$ で存続. | `F3` |
| **`M2` & `M2b` Loops** | マルコフ固定点; `Qhronology` CNOT+SWAP 記号チェック; `3..6`-ビット (`d = 8..64`) ユニタリ証人ループ under `D-CTC` vs `P-CTC`. | `D-CTC` が証人に収束 (`residual = 0.0`) し `1` クエリで; `P-CTC` が $P = 1/d^2$ (`64, 256, 1,024, 4,096` 試行) で成功. | `F4`, `F6` |
| **`M3` Frequency index** | `N = 128` Plancherel チェック; 正確な $d = 8$ Vandermonde 復元; `128`-サンプルのサブナイキスト外挿 (`W = 0.035`, `20` 回). | Plancherel 誤差 `2.34e-16`; `DPSS` 固有値 `[0.991, 0.928, 0.681, 0.289, 0.063, 0.008]`; `cond = 1.94e9`; 先頭 `1..8` 誤差 `2.5e-5` (ノイズレス) $\to$ `5.3e-3` (`80 dB`) $\to$ `0.470` (`20 dB`), 先頭 `57..64` で `0.600`-`1.294` に上昇. | `F5` |
| **`M4` Gödel spacetime** | $ds^2 = -dt^2 - 2e^{\sqrt{2}\omega x} dt\,dy - \frac{1}{2}e^{2\sqrt{2}\omega x} dy^2 + dx^2 + dz^2$ に対する正確な SymPy Christoffel, Ricci, Einstein テンソル評価. | $\det g = -\frac{1}{2}e^{2\sqrt{2}\omega x} < 0$; $R = -2\omega^2$; $g_{yy} < 0$ が全領域で成立 ($\partial_y$ 時間様); $G_{\mu\nu} + (-\omega^2)g_{\mu\nu} - 2\omega^2 u_\mu u_\nu \equiv \mathbf{0}$ (`4x4` 零行列). | `F4`, `F6` |
| **`M5` Count time** | `16`-状態置換のシャノンエントロピー保存 vs ビットリセット; ランドアウアー部屋/本体フロア. | 双射 $\Delta H = 4.44 \times 10^{-16}\text{ nats}$; `300 K` フロア `2.871e-21 J/bit` (`0.0179 eV`); $2^{128}$ ビット $= 9.77 \times 10^{17}\text{ J}$; $2^{256}$ ビット $= 3.32 \times 10^{56}\text{ J}$. | `F1`, `F2` |
| **`M6` Energy query** | 基底状態上の `500` Haar乱択 $4\times 4$ ユニタリ; $r = 5.0$ での圧縮; 静的カシミア板. | $\min \Delta E = +0.347 > 0$ (受動的); $\sinh^2(5) = 5,506.1$ 光子 (Monte Carlo `5,558.4`) がポンプにより支払われる; 閉ループ $W_{\text{net}} = 0.0\text{ J}$. | `F8` |
| **`M7` Crypto PoW** | 実際の `SHA-256d` `8, 12, 16`-ビットパズル (`10` 回) + `16`-ビット Hellman 鎖 (`m = 256, t = 64`) が無塩と新ブロック課題で比較. | 有効 nonce `392, 4245, 9459` (`1` `D-CTC` クエリ vs 平均 `243.9, 5,294.2, 27,078.9` 事後選択試行); Hellman 再利用で `34.0%` $\to$ **`0.0%`** が新ブロックハッシュで減少. | `F5` |
| **`M8` Compton bridge** | CODATA `e⁻` と `Cs-133` コンプトン周波数 $\nu_C = mc^2/h$ と `1 mm` 垂直赤方偏移 over `1` ユリウス年. | $\nu_{C,e} = 1.235590 \times 10^{20}\text{ Hz}$; $\nu_{C,\text{Cs}} = 2.993486 \times 10^{25}\text{ Hz}$; $\Delta\tau = 3.443 \times 10^{-12}\text{ s/yr}$ (`6.48e14 rad` コンプトン, `0.199 rad` 超微細構造). | `F3` |
| **`F5` `SHA-256` FFT test** | 事前登録された `rfft` 周波数スペクトル across `N = 65,536` 連続 `SHA-256` ダイジェスト (`32,767` 内部ビン) + `k = 1, 2, 4, 8`-ビットプレフィックス予測子. | 最大ビン `10.5368` vs Gumbel 中央値 `10.7637` (Šidák $p = 0.5809$; **`0` ビン** $< 10^{-6}$); プレフィックス $z = -0.32, -0.50, +0.11, +1.82$ (全て $\pm 5\sigma$ 内; null が保持). | `F5` (実行済み, null が保持) |

<div id="8-empirical-ledgers-81-temporal-anomalies-40-entry-frequency-atlas-and-74-paradox-constraint-accounting" class="anchor-alias" aria-hidden="true"></div>

## 8. 実証的台帳：`81` 件の時間的異常、`40` 項目の周波数アトラス、および `74` 件のパラドックス制約会計

<div id="81-temporal-anomaly-catalog-ta001-to-ta081-datatemporal-anomaly-catalogcsv" class="anchor-alias" aria-hidden="true"></div>

### 8.1 時間的異常カタログ（`TA001` から `TA081`、`data/temporal-anomaly-catalog.csv`）

人間（`65`）および非人間（`16`）の時間的異常報告を、カテゴリ `H1`（タイムスリップ、`7`）、`H2`（場違いな人物/人工物、`17`）、`H3`（予知/予感、`8`）、`H4`（デジャヴ/夢、`4`）、`H5`（宗教・文化的睡眠膨張テキストの実証例、`8`）、`H6`（臨床/知覚歪曲、`8`）、`H7`（物理/時計測定、`13`）の人間カテゴリと、`N1`（動物災害前兆、`3`）、`N2`（伴侶動物、`2`）、`N3`（機械的概日/一次予測、`6`）、`N4`（千年休眠/クリプトビオシス、`4`）、`N5`（非平衡緩和、`1`）の非人間カテゴリを対象に監査した結果、`33` 件の Grade A ピアレビュー測定、`20` 件の Grade B 同時/テキスト記録、`11` 件の Grade C 後期再話、`17` 件の Grade D いたずら/フィクション/誤認が得られた。

* **未解決の Grade A または Grade B の未来信号事例はゼロである。** 有名なバイラル「タイムトラベラー」は一次情報の検証で崩壊する。Rudolph Fentz（`TA012`）は Jack Finney の 1951 年短編小説 *"I'm Scared"* に由来し、John Titor（`TA014`）、Andrew Carlssin（`TA015`）、Håkan Nordkvist（`TA017`）、Sergei Ponomarenko（`TA016`）はそれぞれフォーラムのフィクション、*Weekly World News* の風刺、スウェーデンの年金広告、2012 年ウクライナのテレビドラマに遡る。1928 年のチャップリン初演クリップ（`TA009`）、1941 年のサウスフォーク橋写真（`TA008`）、1860 年の Waldmüller 絵画（`TA011`）はそれぞれ当時の補聴器、サングラス/カメラ、祈祷書を示す。`OPERA` の超光速ニュートリノ（`TA053`）は `73 ns` の緩んだ光ファイバーコネクタに起因する。
* **カタログに含まれる実在の再現可能な時間旅行は、厳密に一方向の相対論的膨張または代謝停止である。** Hafele‑Keating の時計（`TA062`）、`GPS` の `+38.6 µs/day` の純時計進み（`TA063`）、Sergei Krikalev の軌道運動オフセット `~0.02 s`（`TA064`）、`1 mm` のストロンチウム光時計赤方偏移（`TA065`）、および `46,000` 年のシベリア線虫クリプトビオシス（`TA077`、Shatilovich et al. 2023）。未解決の Grade A/B 報告：Versailles 1901（`TA001`）、回顧的 Aberfan 手紙（`TA025`）、予感メタ分析（`TA031`）、地震前カエル（`TA067`）：は、将来の封印プロトコル `F11`、`F12`、`F14`、`F15` に直接対応する。

<div id="82-frequency-anomaly-atlas-aa01-to-aa40-dataanomaly-atlascsv" class="anchor-alias" aria-hidden="true"></div>

### 8.2 周波数異常アトラス（`AA01` から `AA40`、`data/anomaly-atlas.csv`）

`40` の空(`21`) と地球実験室(`19`) のフロンティア異常を周波数形(`16` `resolved`、`17` `open`、`7` `contested`)で記述すると、最も鋭い物理的境界はブラックホールと宇宙論的ホライズンに位置する(`Figure 3`):

1. **ブラックホールホライズンリングダウンとスクランブリング遅延 (`AA01`-`AA08`)**: すべての Kerr-Schwarzschild ホライズンスケールは $c^3/(GM)$ として変化する。$62\,M_\odot$ 残存体 (`GW150914`、`AA04`) に対して、基本的なリングダウン $f_{\text{QNM}} \approx 195\text{ Hz}$ は $9.39 \times \nu_H$ に位置し ($\nu_H = 20.7\text{ Hz}$、`AA03`)、`GW250114` (`AA05`) はホライズン角速度 $2\Omega_H$ と表面重力減衰 $\kappa$ (`F16`) を探査する。2 次元重力アイランドモデル (Penington 2019; Almheiri et al. 2019) では、内部情報がページ時間後にホーキング放射で戻り、スクランブリング遅延は $t_{\text{scr}} = (4GM/c^3)\ln S \approx 0.23\text{ s}$ で $62\,M_\odot$ に一致する ($1/t_{\text{scr}} \approx 4.35\text{ Hz}$、`AA06` で主張された `4.4 Hz` プランクエコー間隔と一致し無効化された; `F17`)。
2. **宇宙膨張率と銀河加速 (`AA09`-`AA12`)**: Milgrom の `MOND` スケール $a_0 \approx 1.2 \times 10^{-10}\text{ m/s}^2$ を周波数に変換すると $a_0/c = 4.00 \times 10^{-19}\text{ Hz}$ となり、`6%`-`15%` の範囲で $H_0 / (2\pi) = 3.48 \times 10^{-19}$ から $3.77 \times 10^{-19}\text{ Hz}$ へとプランクと `SH0ES` (`AA09`) の間で一致する。$a_0(z)$ が $H(z)$ を追跡するか (`~3.0x` 高い $z = 2$ の平坦 $\Lambda\text{CDM}$ において) あるいは一定のままであるかは、高赤方偏移の運動回転曲線を通じて直接検証可能である(`F18`)。

<figure class="my-8">
  <img src="/figures/time-as-an-index/frequency-anomaly-atlas.svg" alt="Logarithmic frequency map of 28 single-frequency entries from AA01 to AA40 across open, contested, and resolved lanes." />
  <figcaption>Figure 3. Frequency Anomaly Atlas (<code>AA01</code> to <code>AA40</code>): <code>28</code> single-frequency sky and laboratory edge cases plotted across <code>61</code> decades from <code>MOND a₀/c = 4.0×10⁻¹⁹ Hz</code> to <code>ν_Planck = 2.95×10⁴² Hz</code> (<code>12</code> multi-scale entries tabulated in <code>data/anomaly-atlas.csv</code>).</figcaption>
</figure>

<div id="83-paradox-ledger-p01-to-p74-dataparadox-ledgercsv-and-code_and_proofsleanparadoxlean" class="anchor-alias" aria-hidden="true"></div>

### 8.3 パラドックス台帳（`P01` から `P74`、`data/paradox-ledger.csv` および `code_and_proofs/lean/Paradox.lean`）

理論物理学（`36`）・数学と論理学（`20`）・情報と計算（`9`）・確率と意思決定理論（`7`）・ネットワーク/資源経済学（`2`）にわたる `74` のパラドックスをカタログ化し（`45` が解決、`15` が部分解、`14` が未解決）し、`TQ.Paradox` の `14` 個の Lean 定理と `run_models_m1_m8.py` による数値チェックで検証された **十一の明示的価格タグ** に変換する:

| Lean 4 定理（`TQ.Paradox`） | パラドックス制約の証明 | 公理フットプリント |
| :--- | :--- | :--- |
| `no_total_self_oracle` | 任意の全ブールオラクル $O : Q \to \mathrm{Bool}$ がその否定対角 $d$ と一致しないこと（`Liar` `P45`、`Halting` `P48`、`F19`）。 | **なし**（`0` 公理） |
| `no_universal_answer_table` | 全射 $Q \to (Q \to \mathrm{Bool})$ が存在しないこと（`Cantor` `P41`、`Russell` `P40`）。 | **なし**（`0` 公理） |
| `mixed_answer_unique` | $\mathbb{Q}$ 上で、$p = 1 - p$ が唯一の不動点 $p = 1/2 \in [0, 1]$ を持つ（Deutsch の混合回避 `P01`、`P45`）。 | 標準 3 |
| `grandfather_no_pure` & `polchinski_multiplicity` | `!b ≠ b` が純粋な NOT ループ不動点を禁じ（`P01`）、一方 `id` が複数の異なる不動点を許容（`Polchinski` `P06`、`Novikov` `P05`）。 | **なし**（`0` 公理） |
| `no_injection_gt` & `incompressible` | 有限の鳩巣原理が全射 $\mathrm{Fin}(2^n - 1) \to \mathrm{Fin}(2^n)$ を禁じる（`Bootstrap` `P02`、`Kolmogorov` `P66`）。 | 標準 3 |
| `recurrence` | $\mathrm{Fin}\,n$ 上の任意の全単射は $x$ を $1 \le d \le n$ ステップ以内にすべての状態に戻す（`Poincaré` `P25`、有料の過去仮説 `P28` を強制）。 | 標準 3 |
| `zeno_dichotomy`, `instant_measure_zero`, `countable_instants_null` | 正確にスケーリングされた幾何学的部分和 $2^n - 1$、ゼロ単位区間の長さ、有限前置カバーの有界性（`Zeno` `P51`、`P52`、`Skolem` `P50`）。 | 標準 3 |
| `hilbert_hotel`, `galileo_squares`, `monty_hall` | `Nat.succ` と $n \mapsto n^2$ は無限 $\mathbb{N}$ 上で全射なしの単射である（`P60`、`P61`、有限ベケンシュタイン領域 `2.58e43 bits`（`1 m, 1 kg`）で阻止 `P69`）；情報に基づくドア選択は `2/3` の勝率を得る（`P64`）。 | 標準 3 |

十一の結果として得られる会計規則 - (1) 全ブール自己オラクルの不存在、(2) 有料の不動点選択、(3) 不可圧縮ビットあたりの $\mathrm{PSPACE}$ 債務、(4) 測度ゼロ瞬間は近傍積分を要する、(5) フレームラベル付世界線固有時間、(6) 有料の低エントロピー過去仮説境界、(7) ランドアウアー $k_B T \ln 2$ リセット下限とゼノ測定の逆作用、(8) ベケンシュタイン ($2.58 \times 10^{43}\text{ bits}$) と全息 ($1.38 \times 10^{69}\text{ bits/m}^2$) 容量上限、(9) 量子相関は古典的記録と区別される、(10) 適切な事前分布と有界効用（`Two Envelopes` `P56`、`St Petersburg` `P57`、`Bertrand` `P59`）、(11) 観測者宣言の記録（`Wigner's Friend` `P15`、`Firewall` `P37`） - は `14` の真の未解決債務（`P03, P04, P07, P14, P15, P28, P29, P32..P37, P39`）を残す。

<div id="9-falsifiers-f1f19-and-energy-native-game-design-translation" class="anchor-alias" aria-hidden="true"></div>

## 9. 反証条件（`F1`-`F19`）およびエネルギー固有ゲーム設計への変換

<div id="91-consolidated-falsifier-registry-f1-to-f19" class="anchor-alias" aria-hidden="true"></div>

### 9.1 統合反証条件登録簿（`F1 to F19`）

本研究におけるすべての推測的または仮説的主張は、具体的な決定規則と対になっている。

| ID | 対象主張 | プロトコルと $5\sigma$ / 正式な決定閾値 | 現在のステータス |
| :--- | :--- | :--- | :--- |
| **`F1`** | `A1` 消散カウント固有時間 | 同位置にある光時計が $\ge 10^6\times$ の消散差を持ち、$10^6\text{ s}$ にわたって: `A1` を物理的固有時間とみなすと、経過比率が $10^{-15}$ 内で `1` に等しい場合に失敗する。 | 直接的に未検証; 標準相対性理論は `1` を予測する |
| **`F2`** | `A2` 可逆対盲リセット熱 | 情報を伴う可逆的なアンコンピュテーションが $< 0.5\,k_B T \ln 2$ を $5\sigma$ で消散させることは `A2` の普遍的コストを否定し、盲目的リセット $< 0.9\,k_B T \ln 2$ はランダウアーを否定する。 | 盲目的ランダウアー基底が確認された; `A2` は制限される |
| **`F3`** | `A5` 原子分解時計残差 | $t$ における原子ごとの光時計残差と $t + \tau$ の `QRNG` ビット間の相互情報量: $10^7$ サンプルにわたり $10^{-3}\text{ bit/sample}$ 未満で失敗する。 | 未解決（`Conjecture`） |
| **`F4`** | 時間様信号 (`A6`、逆因果性) | $10^7$ の `QRNG` 切替試行にわたる二時点周辺シフト $|P(a \mid x, y) - P(a \mid x, y')|$ ( $\sigma \approx 3\times 10^{-4}$ ): $5\sigma$ 内で失敗する。 | 非信号性が成立（`0` 違反） |
| **`F5`** | `A7` スペクトル `SHA-256` / `PoW` ショートカット | `FFT` 周波数スペクトルと $k$ ビットプレフィックステストを連続する `SHA-256` ダイジェストに適用 ( $p < 10^{-6}$ 系統的; $2^{-k} \pm 5\sigma$ )。 | **ここで実行 (`N = 65,536`)**: `0` ビン $< 10^{-6}$, 無効が成立 |
| **`F6`** | `A6` 超光速 / 早期到達 | $10^9$ のタイミングイベント (`NANOGrav`, `GRB`, ニュートリノ基線) にわたり、到達が $t_{\text{emit}} + L/c$ より $> 5\times$ のタイミングジッターで早い。 | 因果性が成立 (`OPERA` コネクタ修正) |
| **`F7`** | `A4` 体全体のグローバル位相ロック | $\ge 3$ の独立した体細胞系統にわたる $\ge 7\text{ days}$ 上の位相ロック値 $> 0.9$ は非同期 `A4` を否定する。 | `A4` はターンオーバーデータで支持される |
| **`F8`** | `A8` / `Z6` 閉サイクル真空作業 | 外部駆動の枯渇なしに閉じたリセットサイクルで、シールドされた熱計測的正味仕事 $W_{\text{net}} > 0$ が $5\sigma$ を上回る。 | 正の値はゼロ; 受動性が成立 |
| **`F9`** | `A1`-`A8` の形式的不整合 | 形式化された `A1`-`A8` と有限次元量子チャネルおよびミンコフスキー因果性から `False` を導くカーネル検査済み Lean 4 証明。 | 弱体化された `C1`-`C4` が一貫性を示した (`Horizon.lean`) |
| **`F10`** | 構成的記憶起源 | 事前登録された `DRM` と誤情報テスト ($n \ge 200$)：`AUC >= 0.95` で、誘導リコールが無関係な侵入を $< 0.05$ 上回る場合に偽と判定。 | 生存 (`40-55%` `DRM`, `32% vs 14%` Loftus) |
| **`F11`** | 人間の予知 (`TA025, TA030..TA032`) | `SHA-256` にコミットされた応答が $t_1$ で、`QRNG` ビットが $t_2 \ge t_1 + 24\text{ h}$ で抽出された場合 ( $N \ge 10^5$, $\sigma \approx 1.58\times 10^{-3}$ ): $> 0.5 + 5\sigma \approx 0.508$ の再現と `F4` が必要。 | 以前の再現は偶然レベル (`d = 0.04`) |
| **`F12`** | デジャヴ / 夢ナビゲーション (`TA033, TA036`) | `QRNG`選択迷路ターン前の事前コミット報告（$N \ge 10^4$ タグ付け試行、$5\sigma$ 閾値）。 | Cleary & Claxton (2018) により偽造された |
| **`F13`** | より密な `BCI` プロトコルおよび著者性 | (a) 意図されたコンテンツの相互情報量 $> 39\text{ bit/s}$ を $\ge 10\text{ h}$ 上で; (b) 盲目的ユーザー対デコーダの著者性判別 $\ge 0.90$。 | 現在の `BCI` は `7.7`‑`19 bit/s` |
| **`F14`** | 動物災害前兆 (`TA066..TA070`) | 除群化された地震カタログに対する継続的な数年モニタリング + 並行 `VLF`/ラドン/地震ログ（$\ge 20$ イベント、$p < 10^{-3}$ でゲイン $> 2$）。 | 物理的前兆に対してオープン |
| **`F15`** | 封印アーカイブ逆認識 (`TA001..TA007`) | 第三者エスクローされた未公開過去状態と照合コントロールに対する、現場での事前ハッシュ証言報告（$\ge 500$ 訪問、$5\sigma$）。 | エスクロー下で未検証 |
| **`F16`** | ホライズン直接波読み出し (`AA04, AA05`) | $\ge 10$ 後合体イベント（`SNR >= 30`）で、インスパイラル Kerr パラメータの `10%` 範囲内で $2\Omega_H$ と $\kappa$ をテストし、ベイズ因子が上昇する。 | `Conjecture`（`GW250114` が動機） |
| **`F17`** | スクランブルエコーコンブと回路遅延 (`AA01, AA06`) | (a) $\ge 20$ 合体をスタックし、$5\sigma$ で $t_{\text{scr}} = (4GM/c^3)\ln S$ コンブを生成; (b) $S = 4..10$ キュービットスクランブルデコード遅延 $\propto \log S$ と線形との比較。 | `O1`‑`O3` エコーはノイズと一致 |
| **`F18`** | `MOND` の宇宙スケーリング $a_0(z)$ (`AA09, AA12`) | $1 \le z \le 2.5$ にわたる運動学的 `RAR`（$\ge 30$ 銀河/ビン）：$z=2$ で $a_0(z)/a_0(0) = H(z)/H_0 \approx 3.0$ と、$5\sigma$ で一定 $1 \pm 0.2$ を比較。 | `Conjecture`（JWST/ALMA で検証可能） |
| **`F19`** | Novikov 対角陰謀監査 (`P01, P05, P45`) | $t_1$ で予測をコミット; 自動ハードウェアが $t_2$ で予測を否定。ハードウェア作動過剰失敗率をコントロールと比較し、逆方向の一貫性をテスト。 | `Speculation`（ベースラインは `0` の過剰を予測） |

<div id="92-translating-time-indexing-physics-into-honest-energy-native-game-mechanics" class="anchor-alias" aria-hidden="true"></div>

### 9.2 時間インデックス化物理学を誠実なエネルギー固有ゲームメカニクスへ変換すること

戦略とパズル設計において（[/living/time-as-an-index/](/living/time-as-an-index/) のインストァルメント 4 で対話的に探求されるように）、空想的な自由時間旅行を明示的なジュール、熱、メモリ、鮮度予算に置き換えることで、セクション 2 から 8 の定理は四つの時代にわたる触覚的なプレイヤーのトレードオフへと変換される。

* **Era 1 - Sweep（`Sequential Brute Search`）**: 逐次的な推測はハッシュごとに決定的なジュールを消費し、インデックスされていない金庫に対して破滅的なテール分散を露呈する。一方、検証済みの決定的スクリプトは予測可能なエネルギーエンベロープを持つ。
* **Era 2 - Ledger vs Salt Storms & Freshness Seals（`Hellman T·M² = N²`）**: Hellman 元帳を事前に埋めるには $N$ のジュールを前払いで支払い、安価な $N^{2/3}$ のオンライン検索を購入する。防御側が *Salt Storms*（$2^s$ 倍に埋め込みコストを増大させ、`stale ledger` 失敗を引き起こす）または *Freshness Seals*（最新ブロックハッシュに挑戦を連結し、事前計算を早期に開始できなくする）を展開するまでである。*Rewind Charms* は状態保持型ガード（`IND-CCA` / `EUF-CMA`）を打破し、無状態ガード（`Meier 2022`）に跳ね返す。
* **Era 3 - Fourier Lens & Settling Basin（`Gabor & Analog Relaxation`）**: *Fourier Lens* は観測窓が $\Delta t \ge 1/(4\pi\,\Delta f)$ を満たす場合にのみ $O(N \log N)$ のコストで周期的な金庫スケジュールを明らかにし（満たさない場合は `smear` により失敗する）、*Settling Basin* は容易なインスタンスを迅速に緩和するが、相転移インスタンスでは指数的な熱変動（`Ercsey-Ravasz & Toroczkai 2011`）をスパイクさせる。さらに *Landauer Counter* は消去されたビットごとに $k_B T \ln 2$ を課すが、時間を可逆的に逆計算に費やす場合は例外となる。
* **Era 4 - Postselection Gamble & Consistency Loop（`PP` と `PSPACE` エンドゲーム）**: *Postselection Gamble* は $1/p$ のエネルギー消費で証人を保証する（`PP` 上限）。*Consistency Loop* は単一クエリの `PSPACE` 固定点を解放するが、敵対的な固定点選択（`paradox lockout`）やコーシー地平線の熱排出（`chronology collapse`）のリスクを伴う。一方、*One-Time Pad* のセットピース金庫はすべての時代において数学的に破壊不可能である。物語的コミットメントメカニクス（`Surprise Pact`、後に非シグナリング下で明らかになるハッシュ化された現在状態にプレイヤーを拘束する）は、古典的な民話と Andrzej Sapkowski の 1993 年の短編「A Question of Price」（*The Last Wish*）に見られるサプライズ・デット・モチーフから遠くテーマ的にインスピレーションを受けている。*The Witcher* は CD PROJEKT S.A. の登録商標であり、本独立研究およびシミュレーション作業はそれらの作品から名前、キャラクター、テキスト、資産を一切使用せず、CD PROJEKT S.A. または Andrzej Sapkowski との関係や承認を受けていない。

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## 参考文献

*透明性に関する注記：一次情報は arXiv のプレプリント、オープンアクセスの会議録、Lean 4 / SymPy / Python のコード、そして `Qhronology v1.2.1` を直接実行または検査したもの；有料の歴史的モノグラフや学術誌記事（`Deutsch 1991`、`Gödel 1949`、`Landauer 1961`、`Cooley & Tukey 1965`、`Gabor 1946`、`Hellman 1980`、`Hawking 1992`、`Friedman et al. 1990`、`Bennett 1973/1989`、`Fiat & Naor 2000`、`Oechslin 2003`、`Bartlett 1932`、`McLuhan 1964`、`Weyl 1949`）は、検証済みの Digital Object Identifier（`DOI`）およびオープンアクセス文献における二次的な数学的再表現を通じて引用されている。*

<ol data-refs>
<li>Aaronson, S. (2005). NP-complete problems and physical reality. <em>ACM SIGACT News</em>, 36(1), 30-52. <code>arXiv:quant-ph/0502072</code>.</li>
<li>Aaronson, S. (2005). Quantum computing, postselection, and probabilistic polynomial-time. <em>Proceedings of the Royal Society A</em>, 461(2063), 3473-3482. doi:10.1098/rspa.2005.1546.</li>
<li>Aaronson, S. (2015). Memrefuting (technical critique of polynomial-resource memcomputing claims). <em>Shtetl-Optimized</em>.</li>
<li>Aaronson, S., &amp; Watrous, J. (2009). Closed timelike curves make quantum and classical computing equivalent. <em>Proceedings of the Royal Society A</em>, 465(2102), 631-647. doi:10.1098/rspa.2008.0350; <code>arXiv:0808.2669</code>.</li>
<li>Aaronson, S., Bavarian, M., Gueltrini, G., Cubitt, T., O'Donnell, R., Grewal, S., &amp; Raat, F. (2024). Computability theory of closed timelike curves (v2 correction). <code>arXiv:1609.05507v2</code>.</li>
<li>Aggarwal, D., Brennen, G. K., Lee, T., Santha, M., &amp; Tomamichel, M. (2018). Quantum attacks on Bitcoin, and how to protect against them. <em>Ledger</em>, 3, 41-62. <code>arXiv:1710.10377</code>.</li>
<li>Aharonov, Y., Bergmann, P. G., &amp; Lebowitz, J. L. (1964). Time symmetry in the quantum process of measurement. <em>Physical Review</em>, 134(6B), B1410-B1416. doi:10.1103/PhysRev.134.B1410.</li>
<li>Aharonov, Y., &amp; Elitzur, A. C. (2026). Time running backwards, and where it stops (preprint). <code>arXiv:2611.12971</code>.</li>
<li>Almheiri, A., Engelhardt, N., Marolf, D., &amp; Maxfield, H. (2019). The entropy of bulk quantum fields and the entanglement wedge of an evaporating black hole. <em>Journal of High Energy Physics</em>, 2019(12), 063.</li>
<li>Almheiri, A., Marolf, D., Polchinski, J., &amp; Sully, J. (2013). Black holes: Complementarity or firewalls? <em>Journal of High Energy Physics</em>, 2013(2), 062.</li>
<li>Bacon, D. (2004). Quantum computational complexity in the presence of closed timelike curves. <em>Physical Review A</em>, 70(3), 032309. doi:10.1103/PhysRevA.70.032309; <code>arXiv:quant-ph/0309189</code>.</li>
<li>Balasubramanian, V. (2021). Brain power. <em>Proceedings of the National Academy of Sciences</em>, 118(32), e2107022118.</li>
<li>Bekenstein, J. D. (1981). Universal upper bound on the entropy-to-energy ratio for bounded systems. <em>Physical Review D</em>, 23(2), 287-298.</li>
<li>Bem, D. J. (2011). Feeling the future: Experimental evidence for anomalous retroactive influences on cognition and affect. <em>Journal of Personality and Social Psychology</em>, 100(3), 407-425; failed replications in Ritchie, Wiseman &amp; French (2012), <em>PLOS ONE</em> 7(3):e32719, and Galak et al. (2012), <em>JPSP</em> 103(6):933-948.</li>
<li>Bennett, C. H. (1973). Logical reversibility of computation. <em>IBM Journal of Research and Development</em>, 17(6), 525-532; and Bennett, C. H. (1989). Time/space trade-offs for reversible computation. <em>SIAM Journal on Computing</em>, 18(4), 766-776. doi:10.1137/0218053.</li>
<li>Bennett, C. H., Leung, D., Smith, G., &amp; Smolin, J. A. (2009). Can closed timelike curves or nonlinear quantum mechanics improve quantum state discrimination or help solve hard problems? <em>Physical Review Letters</em>, 103(17), 170502. <code>arXiv:0908.3023</code>.</li>
<li>Bishop, L. G. (2026). Qhronology: Simulating quantum mechanics with closed timelike curves in Python. <code>arXiv:2601.17459</code> (software package <code>qhronology</code> v1.0.0-v1.2.1).</li>
<li>Bothwell, T., Kennedy, C. J., Aeppli, A., Kedar, D., Robinson, J. M., Oelker, E., Staron, A., &amp; Ye, J. (2022). Resolving the gravitational redshift across a millimetre-scale atomic sample. <em>Nature</em>, 602, 420-424.</li>
<li>Brown, A. S. (2004). <em>The Déjà Vu Experience</em>. Psychology Press; and Cleary, A. M., &amp; Claxton, A. B. (2018). Déjà vu: An illusion of prediction. <em>Psychological Science</em>, 29(4), 635-644.</li>
<li>Brun, T. A. (2003). Computers with closed timelike curves can solve hard problems. <em>Foundations of Physics Letters</em>, 16(3), 245-253. <code>arXiv:gr-qc/0209061</code>.</li>
<li>Brun, T. A., Harrington, J., &amp; Wilde, M. M. (2009). Localized closed timelike curves can perfectly distinguish quantum states. <em>Physical Review Letters</em>, 102(21), 210402. <code>arXiv:0811.1209</code>.</li>
<li>Brun, T. A., Wilde, M. M., &amp; Winter, A. (2013). Quantum state cloning using Deutschian closed timelike curves. <em>Physical Review Letters</em>, 111(19), 190401. <code>arXiv:1306.1795</code>.</li>
<li>Card, N. S., Wairagkar, M., Iacobacci, C., et al. (2024). An accurate and rapidly calibrating speech neuroprosthesis. <em>New England Journal of Medicine</em>, 391(7), 609-618.</li>
<li>Castagnoli, G. (2025). Quantum computational speedup and retrocausality. <code>arXiv:2505.08346</code> (extending <em>Int. J. Theor. Phys.</em> 2009 and <code>arXiv:1603.02246</code>).</li>
<li>Chou, C. W., Hume, D. B., Rosenband, T., &amp; Wineland, D. J. (2010). Optical clocks and relativity. <em>Science</em>, 329(5999), 1630-1633.</li>
<li>Connes, A., &amp; Rovelli, C. (1994). Von Neumann algebra automorphisms and time-thermodynamics relation in generally covariant quantum theories. <em>Classical and Quantum Gravity</em>, 11(12), 2899-2917.</li>
<li>Cooley, J. W., &amp; Tukey, J. W. (1965). An algorithm for the machine calculation of complex Fourier series. <em>Mathematics of Computation</em>, 19(90), 297-301. doi:10.1090/S0025-5718-1965-0178586-1.</li>
<li>Coupé, C., Oh, Y. M., Dediu, D., &amp; Pellegrino, F. (2019). Different languages, similar encoding efficiency: Comparable information rates across the human communicative niche. <em>Science Advances</em>, 5(9), eaaw2594.</li>
<li>Demaine, E. D., Iacono, J., &amp; Langerman, S. (2007). Retroactive data structures. <em>ACM Transactions on Algorithms</em>, 3(2), Article 13.</li>
<li>Deutsch, D. (1991). Quantum mechanics near closed timelike lines. <em>Physical Review D</em>, 44(10), 3197-3217. doi:10.1103/PhysRevD.44.3197.</li>
<li>Dragoi, G., &amp; Tonegawa, S. (2011). Preplay of future place cell sequences by hippocampal cellular assemblies. <em>Nature</em>, 469, 397-401; and Foster, D. J., &amp; Wilson, M. A. (2006). Reverse replay of behavioural sequences in hippocampal place cells during the awake state. <em>Nature</em>, 440, 680-683.</li>
<li>Driscoll, J. R., Sarnak, N., Sleator, D. D., &amp; Tarjan, R. E. (1989). Making data structures persistent. <em>Journal of Computer and System Sciences</em>, 38(1), 86-124.</li>
<li>Eagleman, D. M., &amp; Sejnowski, T. J. (2000). Motion integration and postdiction in visual awareness. <em>Science</em>, 287(5460), 2036-2038.</li>
<li>Echeverria, F., Klinkhammer, G., &amp; Thorne, K. S. (1991). Billiard balls in wormhole spacetimes with closed timelike curves: Classical theory. <em>Physical Review D</em>, 44(4), 1077-1099; and Friedman, J., Morris, M. S., Novikov, I. D., Echeverria, F., Klinkhammer, G., Thorne, K. S., &amp; Yurtsever, U. (1990). Cauchy problem in spacetimes with closed timelike curves. <em>Physical Review D</em>, 42(6), 1915-1930. doi:10.1103/PhysRevD.42.1915.</li>
<li>Ercsey-Ravasz, M., &amp; Toroczkai, Z. (2011). Optimization hardness as transient chaos in an analog approach to constraint satisfaction. <em>Nature Physics</em>, 7, 966-970. <code>arXiv:1208.0526</code>.</li>
<li>Fiat, A., &amp; Naor, M. (2000). Rigorous time-space trade-offs for inverting functions. <em>SIAM Journal on Computing</em>, 29(3), 790-803. doi:10.1137/S0097539795280512.</li>
<li>Gabor, D. (1946). Theory of communication. <em>Journal of the Institution of Electrical Engineers - Part III</em>, 93(26), 429-457. doi:10.1049/ji-3-2.1946.0074.</li>
<li>Gödel, K. (1949). An example of a new type of cosmological solutions of Einstein's field equations of gravitation. <em>Reviews of Modern Physics</em>, 21(3), 447-450. doi:10.1103/RevModPhys.21.447.</li>
<li>Grover, L. K. (1996). A fast quantum mechanical algorithm for database search. <em>Proceedings of the 28th Annual ACM Symposium on Theory of Computing (STOC)</em>, 212-219.</li>
<li>Hawking, S. W. (1992). Chronology protection conjecture. <em>Physical Review D</em>, 46(2), 603-611. doi:10.1103/PhysRevD.46.603.</li>
<li>Hellman, M. E. (1980). A cryptanalytic time-memory trade-off. <em>IEEE Transactions on Information Theory</em>, 26(4), 401-406.</li>
<li>Hubert, T., Mehta, R., Sartran, L., et al. (2025). Olympiad-level formal mathematical reasoning with reinforcement learning (AlphaProof). <em>Nature</em>.</li>
<li>Inagaki, T., Haribara, Y., Igarashi, K., et al. (2016). A coherent Ising machine for 2000-node optimization problems. <em>Science</em>, 354(6312), 603-606. doi:10.1126/science.aah4243; and McMahon, P. L., et al. (2016). A fully programmable 100-spin coherent Ising machine. <em>Science</em>, 354(6312), 614-617. doi:10.1126/science.aah5178.</li>
<li>Ji, Z., Lloyd, S., &amp; Wilde, M. M. (2026). Retrocausal quantum and classical capacities of noisy closed timelike curves. <em>Physical Review Letters</em>, 136, 230801. <code>arXiv:2509.08965</code>.</li>
<li>Kulkarni, K., &amp; Michels, J.-E. (2012). Temporal features in SQL:2011. <em>ACM SIGMOD Record</em>, 41(3), 34-43. doi:10.1145/2380776.2380786.</li>
<li>Lamoreaux, S. K. (1997). Demonstration of the Casimir force in the 0.6 to 6 µm range. <em>Physical Review Letters</em>, 78(1), 5-8; and Wilson, C. M., Johansson, G., Pourkabirian, A., et al. (2011). Observation of the dynamical Casimir effect in a superconducting circuit. <em>Nature</em>, 479, 376-379.</li>
<li>Lan, S.-Y., Kuan, P.-C., Estey, B., English, D., Brown, J. M., Hohensee, M. A., &amp; Müller, H. (2013). A clock directly linking time to a particle's mass. <em>Science</em>, 339(6119), 554-557.</li>
<li>Landauer, R. (1961). Irreversibility and heat generation in the computing process. <em>IBM Journal of Research and Development</em>, 5(3), 183-191. doi:10.1147/rd.53.0183.</li>
<li>Leifer, M. S., &amp; Pusey, M. F. (2017). Is a time symmetric interpretation of quantum theory possible without retrocausality? <em>Proceedings of the Royal Society A</em>, 473(2202), 20160607. <code>arXiv:1607.07871</code>.</li>
<li>Lloyd, S., Maccone, L., Garcia-Patron, R., Giovannetti, V., Shikano, Y., Pirandola, S., Rozema, L. A., Darabi, A., Soudagar, Y., Shalm, L. K., &amp; Steinberg, A. M. (2011). Closed timelike curves via postselection: Theory and experimental test of consistency. <em>Physical Review Letters</em>, 106(4), 040403; <em>Physical Review D</em>, 84(2), 025007. <code>arXiv:1005.2219</code>.</li>
<li>Loftus, E. F., &amp; Palmer, J. C. (1974). Reconstruction of automobile destruction: An example of the interaction between language and memory. <em>Journal of Verbal Learning and Verbal Behavior</em>, 13(5), 585-589; and Roediger, H. L., &amp; McDermott, K. B. (1995). Creating false memories: Remembering words not presented in lists. <em>JEP: Learning, Memory, and Cognition</em>, 21(4), 803-814.</li>
<li>Meier, R. (2022). Security against time-traveling adversaries. <em>IACR Cryptology ePrint Archive</em>, Paper 2022/1148.</li>
<li>Metzger, S. L., Littlejohn, K. T., Silva, A. B., et al. (2023). A high-performance neuroprosthesis for speech decoding and avatar control. <em>Nature</em>, 620, 1037-1046; and Willett, F. R., Kunz, E. M., Fan, C., et al. (2023). A high-performance speech neuroprosthesis. <em>Nature</em>, 620, 1031-1036.</li>
<li>Nader, K., Schafe, G. E., &amp; LeDoux, J. E. (2000). Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval. <em>Nature</em>, 406, 722-726. doi:10.1038/35021052; and Schacter, D. L. (1999). The seven sins of memory. <em>American Psychologist</em>, 54(3), 182-203.</li>
<li>O'Callahan, R., Jones, C., Froyd, N., Huey, K., Noll, A., &amp; Partush, N. (2017). Engineering record and replay for deployability (<code>rr</code>). <em>USENIX ATC 2017</em>, 377-389.</li>
<li>Oechslin, P. (2003). Making a faster cryptanalytic time-memory trade-off. <em>Advances in Cryptology - CRYPTO 2003</em>, LNCS 2729, 617-630. doi:10.1007/978-3-540-45146-4_36.</li>
<li>Open Interface Engineering (2026). Thermodynamic Bounds and an Optimal Tempo; Metered Commit Gates; Deterministic Null; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Penington, G. (2020). Entanglement wedge reconstruction and the information paradox. <em>Journal of High Energy Physics</em>, 2020(9), 002 (preprint 2019).</li>
<li>Sender, R., Fuchs, S., &amp; Milo, R. (2016). Revised estimates for the number of human and bacteria cells in the body. <em>PLOS Biology</em>, 14(8), e1002533; and Shatilovich, A., Gade, V. R., Pippel, M., et al. (2023). A novel nematode species from the Siberian permafrost shares adaptive mechanisms for cryptobiotic survival with C. elegans dauer larva. <em>PLOS Genetics</em>, 19(7), e1010798.</li>
<li>Tanuwijaya, R., et al. (2025). Complex discrete Fourier transform on a metalens array. <code>arXiv:2502.08770</code>; and Yang, Y., et al. (2025). Photonic joint-transform correlator for high-efficiency convolution. <code>arXiv:2504.01117</code>.</li>
<li>Woith, H., Petersen, G. M., Hainzl, S., &amp; Dahm, T. (2018). Review: Can animals predict earthquakes? <em>Bulletin of the Seismological Society of America</em>, 108(3A), 1031-1045.</li>
<li>Zheng, J., &amp; Meister, M. (2025). The unbearable slowness of being: Why do we live at 10 bits/s? <em>Neuron</em>, 113(2), 192-204.</li>
</ol>
