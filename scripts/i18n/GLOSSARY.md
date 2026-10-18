# Translation glossary

One standard term per language for every recurring technical term in the research papers (src/content/papers/*.md). Every translation (titles and decks in abstracts.py, and every full body in work/<lang>/<slug>.md) uses these terms. Inflection follows the grammar of the target language (plural, case, construct state); the stem does not change. When a sentence needs a term that is not listed here, choose one, use it consistently, and add a row.

## Proper names kept in English in every language

OpenIE, Open Interface Engineering, Klere, EPU (Energy Processing Unit), flowG, RCE, Reality Code Engine, Mixture of Limits, Metabolic Intelligence (MEI), Notational Intelligence, Wise Computer Automation (WCA), Energy-First Architecture (EFA), System One, JouleOS, OpCounter, Epoch AI, Alchitry Pt V2, Defects4J, SWE-bench, tree-sitter, Language Server Protocol, and all product, dataset, model and company names. The first mention of Mixture of Limits or Metabolic Intelligence may carry the gloss in parentheses given in the table. Labels stay as written: gears G0 to G4, rungs L0 to L7, claims S-1 and so on, hypotheses H1 and H2, U1 to U4, R1 to R8. Code identifiers, file paths, reason codes (`policy`, `budget_exceeded`, `energy_veto`), energy labels (`est_j`, `reported_j`, `measured_j`), math, citation numbers [n], numbers, link targets and anchors are never translated.

## Sister-paper titles in cross-references

Link texts that name a sister paper use the translated title (or its short form before the colon) from abstracts.py; "Part I" and "Part II" and "Section n" are translated with the words in the table below. Short forms: rce = Reality Code Engine; ai-coding-market = full translated title; gates = translated short title (row "Metered Commit Gates"); satiation = row "task satiation" or the full translated title; spellcheck = translated short title; agency = row "agency" (as a paper name: "the agency paper").

## Terms

| English | zh-Hans | es | fr | de | ja | pt | hi | ar |
|---|---|---|---|---|---|---|---|---|
| Form (RCE program object) | 形式 | Forma | Forme | Form | 形式 | Forma | Form | شكل (أشكال) |
| fit | 契合 | ajuste | ajustement | Passung | 適合 | ajuste | फ़िट | ملاءمة (ملاءمات) |
| One Form, many fits | 一个形式、多种契合 | una Forma, muchos ajustes | une Forme, de nombreux ajustements | eine Form, viele Passungen | ひとつの形式、多くの適合 | uma Forma, muitos ajustes | एक Form, अनेक फ़िट | شكل واحد، ملاءمات كثيرة |
| gate | 门槛 | compuerta | porte | Tor | ゲート | porta | द्वार | بوابة |
| commit gate | 提交门槛 | compuerta de confirmación | porte de validation | Commit-Tor | コミットゲート | porta de confirmação | कमिट द्वार | بوابة الالتزام |
| Metered Commit Gates (paper) | 计量提交门槛 | Compuertas de confirmación medidas | Portes de validation mesurées | Gemessene Commit-Tore | 計量コミットゲート | Portas de confirmação medidas | मापित कमिट द्वार | بوابات الالتزام المقيسة |
| commit (noun) | 提交 | confirmación | validation | Commit | コミット | confirmação | कमिट | الالتزام |
| refuse (decision) | 拒绝 | rechazo | refus | Ablehnung | 拒否 | recusa | अस्वीकार | الرفض |
| reason code | 原因码 | código de motivo | code de motif | Begründungscode | 理由コード | código de motivo | कारण कोड | شيفرة السبب |
| certificate | 证书 | certificado | certificat | Zertifikat | 証明書 | certificado | प्रमाणपत्र | شهادة |
| receipt | 收据 | recibo | reçu | Beleg | レシート | recibo | रसीद | إيصال |
| proposer / proposal | 提议者 / 提议 | proponente / propuesta | proposant / proposition | Vorschlagender / Vorschlag | 提案者 / 提案 | proponente / proposta | प्रस्तावक / प्रस्ताव | المقترِح / المقترح |
| gear | 档位 | engranaje | engrenage | Gang (Gänge) | ギア | engrenagem | गियर | ترس (تروس) |
| cascade | 级联 | cascada | cascade | Kaskade | カスケード | cascata | कैस्केड | التسلسل |
| token | 词元 | token | token | Token | トークン | token | टोकन | رمز (رموز) |
| joule | 焦耳 | julio | joule | Joule | ジュール | joule | जूल | جول |
| energy to run | 运行所需的能量 | energía para ejecutar | énergie d'exécution | Energie zum Ausführen | 実行に要するエネルギー | energia para executar | चलाने की ऊर्जा | طاقة التشغيل |
| energy to correct completion | 正确完成所需能量 | energía hasta la finalización correcta | énergie jusqu'à l'achèvement correct | Energie bis zur korrekten Fertigstellung | 正しい完了までのエネルギー | energia até a conclusão correta | सही पूर्णता तक ऊर्जा | الطاقة حتى الإنجاز الصحيح |
| correct completion | 正确完成 | finalización correcta | achèvement correct | korrekte Fertigstellung | 正しい完了 | conclusão correta | सही पूर्णता | الإنجاز الصحيح |
| Mixture of Limits (gloss) | Mixture of Limits（极限混合） | Mixture of Limits (mezcla de límites) | Mixture of Limits (mélange de limites) | Mixture of Limits (Mischung der Grenzen) | Mixture of Limits（限界の混合） | Mixture of Limits (mistura de limites) | Mixture of Limits (सीमाओं का मिश्रण) | Mixture of Limits (مزيج الحدود) |
| Metabolic Intelligence (gloss) | Metabolic Intelligence（代谢智能） | Metabolic Intelligence (inteligencia metabólica) | Metabolic Intelligence (intelligence métabolique) | Metabolic Intelligence (metabolische Intelligenz) | Metabolic Intelligence（代謝知能） | Metabolic Intelligence (inteligência metabólica) | Metabolic Intelligence (चयापचयी बुद्धि) | Metabolic Intelligence (الذكاء الأيضي) |
| projection | 投影 | proyección | projection | Projektion | 射影 | projeção | प्रक्षेपण | إسقاط |
| lift (import from another language) | 提升 | elevación | élévation | Hebung | 持ち上げ | elevação | लिफ़्ट | الرفع |
| intent | 意图 | intención | intention | Absicht | 意図 | intenção | मंशा | النية |
| entropy | 熵 | entropía | entropie | Entropie | エントロピー | entropia | एंट्रॉपी | الإنتروبيا |
| lossless | 无损 | sin pérdida | sans perte | verlustfrei | 可逆 | sem perdas | हानिरहित | بلا فقد |
| round trip | 往返 | ida y vuelta | aller-retour | Rundreise | 往復 | ida e volta | राउंड ट्रिप | الذهاب والإياب |
| handler | 处理器 | manejador | gestionnaire | Handler | ハンドラ | manipulador | हैंडलर | معالج |
| held-out | 留出 | reservado | réservé | zurückgehalten | 保留 | reservado | अलग रखा गया | محجوز |
| frozen engine | 冻结的引擎 | motor congelado | moteur figé | eingefrorene Engine | 凍結したエンジン | motor congelado | स्थिर इंजन | محرك مجمّد |
| model call | 模型调用 | llamada a modelo | appel de modèle | Modellaufruf | モデル呼び出し | chamada a modelo | मॉडल कॉल | استدعاء النموذج |
| rung | 级 | peldaño | échelon | Sprosse | 段 | degrau | पायदान | درجة |
| complexity ladder | 复杂度阶梯 | escalera de complejidad | échelle de complexité | Komplexitätsleiter | 複雑性のラダー | escada de complexidade | जटिलता की सीढ़ी | سلّم التعقيد |
| ladder | 阶梯 | escalera | échelle | Leiter | ラダー | escada | सीढ़ी | السلّم |
| satiation | 饱和 | saciedad | satiété | Sättigung | 飽和 | saciedade | तृप्ति | الإشباع |
| task satiation | 任务饱和 | saciedad de la tarea | satiété de la tâche | Aufgabensättigung | タスク飽和 | saciedade da tarefa | कार्य-तृप्ति | إشباع المهمة |
| aggregate rebound | 总体反弹 | rebote agregado | effet rebond agrégé | aggregierter Rebound | 総量リバウンド | rebote agregado | समग्र रिबाउंड | الارتداد الكلي |
| rebound (direct / indirect / economy-wide) | 反弹（直接 / 间接 / 全经济） | rebote (directo / indirecto / de toda la economía) | effet rebond (direct / indirect / à l'échelle de l'économie) | Rebound (direkt / indirekt / gesamtwirtschaftlich) | リバウンド（直接 / 間接 / 経済全体） | rebote (direto / indireto / em toda a economia) | रिबाउंड (प्रत्यक्ष / अप्रत्यक्ष / अर्थव्यवस्था-व्यापी) | الارتداد (المباشر / غير المباشر / على مستوى الاقتصاد) |
| bliss point | 极乐点 | punto de dicha | point de félicité | Bliss-Punkt | 至福点 | ponto de êxtase | परमानंद बिंदु | نقطة النعيم |
| chore | 杂务 | quehacer | corvée | Routineaufgabe | 雑務 | afazer | काम | عمل روتيني |
| completeness predicate | 完成性谓词 | predicado de completitud | prédicat de complétude | Vollständigkeitsprädikat | 完了述語 | predicado de completude | पूर्णता विधेय | محمول الاكتمال |
| task completion | 任务完成 | finalización de la tarea | achèvement de la tâche | Aufgabenabschluss | タスク完了 | conclusão da tarefa | कार्य-पूर्णता | إنجاز المهمة |
| done detector | 完成检测器 | detector de terminado | détecteur de fin | Fertig-Detektor | 完了検出器 | detector de conclusão | पूर्णता डिटेक्टर | كاشف الإنجاز |
| false done / false continue | 误判完成 / 误判继续 | falso terminado / falso continuar | faux terminé / faux continuer | falsches Fertig / falsches Weiter | 偽の完了 / 偽の継続 | falso concluído / falso continuar | झूठा पूर्ण / झूठा जारी | إنجاز زائف / استمرار زائف |
| free at the margin | 边际免费 | gratuito en el margen | gratuit à la marge | an der Grenze kostenlos | 限界において無料 | gratuito na margem | सीमांत पर मुफ़्त | مجاني عند الهامش |
| actuation / actuator | 执行 / 执行器 | actuación / actuador | actionnement / actionneur | Aktuierung / Aktor | 作動 / アクチュエータ | atuação / atuador | क्रियान्वयन / एक्चुएटर | التحريك / المشغّل |
| inference | 推理 | inferencia | inférence | Inferenz | 推論 | inferência | इन्फ़रेंस | الاستدلال |
| estimate | 估计值 | estimación | estimation | Schätzung | 推定値 | estimativa | अनुमान | تقدير |
| budget | 预算 | presupuesto | budget | Budget | 予算 | orçamento | बजट | ميزانية |
| energy envelope | 能量包络 | envolvente de energía | enveloppe d'énergie | Energiehülle | エネルギー包絡 | envelope de energia | ऊर्जा आवरण | غلاف الطاقة |
| value of information (VoI) | 信息价值 | valor de la información | valeur de l'information | Informationswert | 情報の価値 | valor da informação | सूचना का मूल्य | قيمة المعلومات |
| device under test (DUT) | 被测设备 | dispositivo bajo prueba | dispositif sous test | Prüfling | 被試験デバイス | dispositivo sob teste | परीक्षणाधीन उपकरण | الجهاز قيد الاختبار |
| board-measured | 板上实测 | medido en placa | mesuré sur carte | auf der Platine gemessen | ボード実測 | medido na placa | बोर्ड पर मापा गया | مَقيس على اللوحة |
| agency | 能动性 | agencia | agentivité | Handlungsfähigkeit | エージェンシー | agência | एजेंसी | الفاعلية |
| agent | 智能体 | agente | agent | Agent | エージェント | agente | एजेंट | وكيل |
| Universal Law of Agency | 能动性普遍定律 | Ley Universal de la Agencia | Loi universelle de l'agentivité | Universelles Gesetz der Handlungsfähigkeit | エージェンシーの普遍法則 | Lei Universal da Agência | एजेंसी का सार्वभौमिक नियम | القانون الكوني للفاعلية |
| goal-holding agent | 目标保持型智能体 | agente que sostiene metas | agent qui tient un but | zielhaltender Agent | 目標を保持するエージェント | agente que mantém metas | लक्ष्य-धारी एजेंट | الوكيل الحامل للهدف |
| kinematic bounds | 运动学界限 | cotas cinemáticas | bornes cinématiques | kinematische Schranken | 運動学的限界 | limites cinemáticos | गतिकीय सीमाएँ | الحدود الحركية |
| bound (upper / lower) | 界 | cota | borne | Schranke | 限界 | limite | सीमा | حدّ |
| threshold | 阈值 | umbral | seuil | Schwelle | 閾値 | limiar | दहलीज़ | عتبة |
| tempo | 节奏 | tempo | tempo | Tempo | テンポ | tempo | गति | إيقاع |
| spell check | 拼写检查 | corrección ortográfica | correction orthographique | Rechtschreibprüfung | スペルチェック | correção ortográfica | वर्तनी जाँच | التدقيق الإملائي |
| Spell Check is Global (paper) | 拼写检查是全球性的 | La corrección ortográfica es global | La correction orthographique est mondiale | Rechtschreibprüfung ist global | スペルチェックはグローバルである | A correção ortográfica é global | वर्तनी जाँच वैश्विक है | التدقيق الإملائي عالمي |
| scarcity | 稀缺 | escasez | rareté | Knappheit | 希少性 | escassez | कमी | الندرة |
| base layer | 基础层 | capa base | couche de base | Basisschicht | 基本層 | camada básica | आधार परत | الطبقة الأساسية |
| stack | 栈 | pila | pile | Stack | スタック | pilha | स्टैक | المكدس |
| verifier | 验证器 | verificador | vérificateur | Verifizierer | 検証器 | verificador | सत्यापक | المتحقِّق |
| Part I / Part II | 第一部分 / 第二部分 | Parte I / Parte II | Partie I / Partie II | Teil I / Teil II | 第I部 / 第II部 | Parte I / Parte II | भाग I / भाग II | الجزء الأول / الجزء الثاني |
| Section n | 第 n 节 | Sección n | Section n | Abschnitt n | 第n節 | Seção n | खंड n | القسم n |
| engine demo (/demos/rce-engine/) | 引擎演示 | demo del motor | démo du moteur | Engine-Demo | エンジンデモ | demo do motor | इंजन डेमो | العرض التوضيحي للمحرك |
| reference checker | 参考检查器 | comprobador de referencia | vérificateur de référence | Referenzprüfer | 参照チェッカー | verificador de referência | संदर्भ चेकर | المدقق المرجعي |
| References | 参考文献 | Referencias | Références | Literatur | 参考文献 | Referências | संदर्भ | المراجع |
| empowerment (channel capacity from actions to observations) | 赋能 | empoderamiento | empowerment | Empowerment | エンパワーメント | empoderamento | एम्पावरमेंट | التمكين |
| epiplexity | epiplexity（表观复杂度） | epiplejidad | épiplexité | Epiplexität | エピプレキシティ | epiplexidade | एपिप्लेक्सिटी | الإبيبلكسية |
| derivation depth / derivation entropy | 推导深度 / 推导熵 | profundidad de derivación / entropía de derivación | profondeur de dérivation / entropie de dérivation | Ableitungstiefe / Ableitungsentropie | 導出深さ / 導出エントロピー | profundidade de derivação / entropia de derivação | व्युत्पत्ति गहराई / व्युत्पत्ति एन्ट्रॉपी | عمق الاشتقاق / إنتروبيا الاشتقاق |
| watts per intelligence | 每单位智能瓦特数 | vatios por inteligencia | watts par intelligence | Watt pro Intelligenz | 知能あたりワット | watts por inteligência | प्रति बुद्धि वाट | واط لكل وحدة ذكاء |
