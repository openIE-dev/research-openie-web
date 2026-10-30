---
title: "वादा किया गया खरबों डॉलर का एआई-कोडिंग बाज़ार"
deck: "एआई कोडिंग के लिए खरबों डॉलर के बाज़ार का अनुमान कौन लगाता है, हर अनुमान क्या गिनता है, और हर अनुमान ऊर्जा, टोकन और पुनः उपयोग के बारे में क्या मानता है।"
lang: "hi"
source: "ai-coding-market"
complete: true
---

<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*संस्करण 1.1, 11 अक्टूबर 2026। डेटा और कोड: [research.openie.dev/data/](/data/#economics)। LaTeX PDF: [/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf) ([स्रोत](/pdfs/latex/ai-coding-market.tex))।*


<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## सारांश

पूर्वानुमान कहते हैं कि एआई कोडिंग का मूल्य हर वर्ष खरबों डॉलर होगा। यह निबंध बताता है कि ऐसा कौन कहता है, हर संख्या पर वह लेबल लगाता है जो वह वास्तव में है, और उन धारणाओं के नाम बताता है जो ये पूर्वानुमान साझा करते हैं।

**सरल शब्दों में**

1. एआई कोडिंग के बारे में बड़ी संख्याएँ ज़्यादातर भविष्य के बारे में अटकलें हैं, पहले से कमाए गए पैसे की गिनती नहीं।
2. लगभग सभी यह मानती हैं कि कोड के हर नए टुकड़े के लिए एक बड़ा एआई मॉडल चाहिए, जिसका भुगतान शब्द के हिसाब से होता है, हमेशा के लिए।
3. यदि काम करने वाले कोड को सहेजकर दोबारा उपयोग किया जा सके, तो किसी दोहराए गए काम की लागत उसे चलाने की बिजली की लागत की ओर गिरती है, और तब वे पूर्वानुमान बहुत ऊँचे निकलेंगे।

<div id="1-projections-and-measurements-are-different-objects" class="anchor-alias" aria-hidden="true"></div>

## 1. अनुमान और माप अलग वस्तुएँ हैं

नीचे की हर संख्या पाँच लेबलों में से एक रखती है।

| लेबल | अर्थ |
|---|---|
| **अनुमान** | घोषित धारणाओं पर बना पूर्वानुमान या मूल्य आकलन |
| **कंपनी द्वारा बताया गया** | वह आँकड़ा जो कोई कंपनी अपने बारे में बताती है, जैसे वार्षिकीकृत run rate राजस्व (नवीनतम माह गुणा बारह) या फ़ंडिंग मूल्यांकन |
| **सर्वेक्षण आकलन** | खरीदारों के सर्वेक्षण से बाज़ार आकार का आँकड़ा |
| **दाखिल** | किसी नियामक दाखिले में दिया गया आँकड़ा |
| **मापा गया** | ऐसे run की गणना या ऊर्जा रीडिंग जिसके artifacts रखे गए हैं। ऊर्जा रीडिंग तीन लेबलों में से एक रखती हैं: विश्लेषणात्मक आकलन के लिए `est_j`, ऑपरेटिंग सिस्टम या चिप पर लगे काउंटर के लिए `reported_j`, बाहरी पावर मीटर के लिए `measured_j` |

केवल अंतिम पंक्ति किसी सही परिणाम की लागत का प्रमाण है। बाकी इस बात के प्रमाण हैं कि बाज़ार क्या अपेक्षा करता है।

<div id="2-who-projects-what" class="anchor-alias" aria-hidden="true"></div>

## 2. कौन क्या अनुमान लगाता है

<div id="21-developer-value-the-trillion" class="anchor-alias" aria-hidden="true"></div>

### 2.1 डेवलपर मूल्य: ट्रिलियन

| दावा | संख्या | लेबल | स्रोत |
|---|---|---|---|
| दुनिया भर के सॉफ़्टवेयर डेवलपर | लगभग 30 मिलियन (आकलन के अनुसार 27 मिलियन से 47 मिलियन) | अनुमान इनपुट | Appenzeller और Li [1] |
| प्रति डेवलपर प्रति वर्ष मूल्य | \$100,000 (माना गया) | अनुमान इनपुट | [1] |
| वार्षिक आर्थिक योगदान | लगभग \$3 ट्रिलियन | अनुमान | [1] |
| GitHub पर डेवलपर | 180 मिलियन से अधिक; वर्ष में 518.7 मिलियन pull requests merge हुए | कंपनी द्वारा बताया गया | GitHub Octoverse 2025 [17] |
| 63 उपयोग मामलों में जनरेटिव एआई का मूल्य | \$2.6 ट्रिलियन से \$4.4 ट्रिलियन प्रति वर्ष; सॉफ़्टवेयर इंजीनियरिंग उत्पादकता उस कार्य के वर्तमान वार्षिक व्यय का 20% से 45% | अनुमान | McKinsey [15] |
| जनरेटिव एआई का वैश्विक GDP पर प्रभाव | दस वर्ष की अवधि में 7% | अनुमान | Goldman Sachs [16] |
| एक सरल सहायक से उत्पादकता लाभ | लगभग 20% | साक्षात्कारों से आकलन | [1] |
| सर्वश्रेष्ठ श्रेणी के परिनियोजन से उत्पादकता लाभ | "कम से कम दोगुना" | "उपाख्यानात्मक प्रमाण पर आधारित" आकलन | [1] |

डेवलपरों की गिनती कच्ची है: 30 मिलियन पेशेवरों का आकलन है, और अकेला GitHub उससे छह गुना खाते गिनता है जो उस पर निर्माण करते हैं [17]। प्रति डेवलपर मूल्य और उत्पादकता गुणक भी कच्चे हैं (खंड 2.7)। McKinsey का 2023 का आकलन इस बाज़ार का मूल ट्रिलियन है, और यह सभी कार्यों में फैला मूल्य आकलन है [15]। वही वेंचर निबंध कहता है कि एआई कोडिंग पारिस्थितिकी तंत्र "दर्जनों बिलियन डॉलर की कंपनियों और एक ट्रिलियन डॉलर के दिग्गज तक को सँभाल सकता है" [1]। वही वाक्य ट्रिलियन है। वह एक मूल्य आकलन है। वह राजस्व पूर्वानुमान नहीं है।

<div id="22-tool-revenue-and-enterprise-spend" class="anchor-alias" aria-hidden="true"></div>

### 2.2 टूल राजस्व और उद्यम व्यय

| दावा | संख्या | लेबल | स्रोत |
|---|---|---|---|
| एआई कोडिंग टूल पर उद्यम व्यय, 2025 | \$4.0 बिलियन, विभागीय एआई व्यय का 55% | सर्वेक्षण आकलन | Menlo Ventures [2] |
| जनरेटिव एआई पर उद्यम व्यय, 2025 | \$37 बिलियन | सर्वेक्षण आकलन | [2] |
| एआई कोड टूल बाज़ार, 2026 | \$9.35 बिलियन, 2031 तक \$29.96 बिलियन | अनुमान | Mordor Intelligence [3] |

बाज़ार आज जो राजस्व बताता है वह बिलियनों में है। ट्रिलियन वह मूल्य है जिसे बाज़ार हासिल करने की आशा करता है।

<div id="23-company-revenue-and-valuations" class="anchor-alias" aria-hidden="true"></div>

### 2.3 कंपनी राजस्व और मूल्यांकन

| कंपनी का दावा | संख्या | तिथि | लेबल | स्रोत |
|---|---|---|---|---|
| Cursor का वार्षिकीकृत राजस्व | \$1 बिलियन से अधिक | 13 नवंबर 2025 | कंपनी द्वारा बताया गया | Cursor [5] |
| Cursor Pro का नया मूल्य | request सीमाओं से "API मूल्य पर प्रति माह \$20 का frontier मॉडल उपयोग" तक, बदलाव के लिए धनवापसी के साथ | जून से जुलाई 2025 | कंपनी द्वारा बताया गया | Cursor [18] |
| Cursor Series D | \$29.3 बिलियन post-money पर \$2.3 बिलियन | 13 नवंबर 2025 | कंपनी द्वारा बताया गया | [5] |
| Anthropic का run rate राजस्व | \$14 बिलियन | 12 फ़रवरी 2026 | कंपनी द्वारा बताया गया | Anthropic [6] |
| Claude Code का run rate राजस्व | \$2.5 बिलियन से अधिक | 12 फ़रवरी 2026 | कंपनी द्वारा बताया गया | [6] |
| Anthropic Series G | \$380 बिलियन post-money पर \$30 बिलियन | 12 फ़रवरी 2026 | कंपनी द्वारा बताया गया | [6] |

Anthropic कहता है कि यह दौर "बुनियादी ढाँचे के विस्तार" का वित्तपोषण करता है [6]। राजस्व, मूल्यांकन और कंप्यूट एक ही दाँव हैं।

चित्र 1 खंड 2.1 से 2.3 और 2.6 के डॉलर आँकड़ों को एक अक्ष पर रखता है, और हर स्रोत के लेबल से उन्हें चिह्नित करता है।

![निबंध की तालिकाओं के डॉलर आँकड़ों का लॉग स्केल डॉट चार्ट। अनुमान: डेवलपरों का योगदान लगभग 3 ट्रिलियन डॉलर, जनरेटिव एआई का मूल्य 2.6 से 4.4 ट्रिलियन, विश्वव्यापी एआई खर्च 1.5 ट्रिलियन, एआई कोड टूल बाज़ार 2026 में 9.35 बिलियन और 2031 में 29.96 बिलियन। आकलन: पूँजीगत व्यय 400 बिलियन से अधिक। सर्वेक्षण आकलन: उद्यमों का जनरेटिव एआई खर्च 37 बिलियन और एआई कोडिंग टूल खर्च 4.0 बिलियन। कंपनी द्वारा बताया गया: Claude Code की run rate 2.5 बिलियन से अधिक और Cursor की 1 बिलियन से अधिक।](/figures/ai-coding-market/spend-by-label.svg)

*चित्र 1. लेबल के अनुसार डॉलर आँकड़े। डेटा चित्र, लॉग स्केल। स्रोत: Appenzeller और Li [1], Menlo Ventures [2], Mordor Intelligence [3], Cursor [5], Anthropic [6], IEA [10], McKinsey [15], Gartner [24]। एक [PNG प्रति](/figures/ai-coding-market/spend-by-label.png) उपलब्ध है।*

<div id="24-inference-tokens-and-unit-economics" class="anchor-alias" aria-hidden="true"></div>

### 2.4 इन्फ़रेंस, टोकन और इकाई अर्थशास्त्र

| दावा | संख्या | लेबल | स्रोत |
|---|---|---|---|
| Google द्वारा प्रति माह संसाधित टोकन | 9.7 ट्रिलियन (2024), लगभग 480 ट्रिलियन (2025), 3.2 क्वाड्रिलियन से अधिक (मई 2026) | कंपनी द्वारा बताया गया | Pichai [8] |
| Google के आंतरिक एआई डेवलपर टूल | मार्च 2026 में प्रति दिन आधा ट्रिलियन टोकन, मई में प्रति दिन तीन ट्रिलियन से अधिक | कंपनी द्वारा बताया गया | [8] |
| सूची मूल्यों पर एक agentic कोडिंग query की लागत | \$2.50: 100,000 टोकन का context और 10,000 output टोकन, प्रति मिलियन टोकन \$15 और \$75 पर | उदाहरण | Appenzeller और Li [1] |
| वही, प्रति घंटा 3 queries, प्रति दिन 7 घंटे, 200 दिन | प्रति डेवलपर प्रति वर्ष लगभग \$10,000 | उदाहरण | [1] |
| agentic कोडिंग में टोकन, code reasoning और code chat की तुलना में | लगभग 1,000 गुना अधिक; एक ही कार्य के runs में 30 गुना तक का अंतर; अधिक टोकन उपयोग "अधिक सटीकता में नहीं बदलता" | मापा गया (आठ मॉडल, SWE-bench Verified) | Bai, Huang और Wang [9] |
| OpenAI में Microsoft के निवेश से शुद्ध हानि, 30 सितंबर 2025 को समाप्त तिमाही | कर पूर्व \$4.1 बिलियन, equity method से उसका हिस्सा, अन्य व्यय में; शुद्ध आय में \$3.1 बिलियन की कमी (प्रति diluted share \$0.41) | दाखिल और कंपनी द्वारा बताया गया | Microsoft Form 10-Q [7]; Microsoft FY26 Q1 performance [19] |

स्रोतों की दो पंक्तियाँ अर्थशास्त्र को साफ़ साफ़ कहती हैं। Pichai: "कई कंपनियाँ पहले ही अपने वार्षिक टोकन बजट खर्च कर चुकी हैं, और अभी केवल मई है" [8]। Appenzeller और Li: "दशकों तक सॉफ़्टवेयर विकास की लागत लगभग पूरी तरह लोगों की लागत थी, पर अब LLMs एक बड़ा परिचालन व्यय घटक जोड़ते हैं" [1]।

चित्र 2 टोकन श्रृंखला दिखाता है।

![Google द्वारा प्रति माह संसाधित टोकनों का लॉग स्केल लाइन चार्ट: 2024 में 9.7 ट्रिलियन, 2025 में लगभग 480 ट्रिलियन और मई 2026 में 3.2 क्वाड्रिलियन से अधिक, कंपनी द्वारा बताया गया।](/figures/ai-coding-market/tokens.svg)

*चित्र 2. Google पर प्रति माह संसाधित टोकन। डेटा चित्र, कंपनी द्वारा बताया गया, लॉग स्केल। स्रोत: Pichai [8]; टोकन उपयोग पर टिप्पणी Bai, Huang और Wang [9] से है। एक [PNG प्रति](/figures/ai-coding-market/tokens.png) उपलब्ध है।*

<div id="25-price-per-token" class="anchor-alias" aria-hidden="true"></div>

### 2.5 प्रति टोकन कीमत

| दावा | संख्या | लेबल | स्रोत |
|---|---|---|---|
| एआई प्रदर्शन के एक निश्चित स्तर की लागत | 2023 से हर तिमाही लगभग 47% कम, हर वर्ष लगभग 13 गुना | मापी गई मूल्य श्रृंखला (पाँच benchmarks) | Epoch AI [4] |
| किसी निश्चित benchmark स्कोर तक पहुँचने की कीमत | पड़ाव के अनुसार हर वर्ष 9 से 900 गुना गिरती है; सबसे तेज़ गिरावटें सबसे हाल की हैं और उनके टिके रहने की निश्चितता सबसे कम है | मापी गई मूल्य श्रृंखला (लॉग-रैखिक फ़िटिंग) | Epoch AI [34] |
| समतुल्य प्रदर्शन पर इन्फ़रेंस लागत | हर वर्ष लगभग 10 गुना कम: 2021 में प्रति मिलियन टोकन \$60 से \$0.06 तक | आकलन | Appenzeller, a16z [20] |
| DeepSeek API मूल्य कटौती, 29 सितंबर 2025 | डेवलपरों की लागत "50% से अधिक घटाई गई" | कंपनी द्वारा बताया गया | DeepSeek [21] |

[4] का प्रति वर्ष 13 गुना एक व्यापक दायरे का एक बिंदु है [34]। यह गिरावट प्रतिस्पर्धा और open weights से प्रेरित है, जैसा DeepSeek की कटौती दिखाती है [21]। इसे किसी ऊर्जा लेखांकन की आवश्यकता नहीं है। यह खंड 5 की दो गिरावटों में से पहली है। पुनः उपयोग एक भिन्न गिरावट जोड़ता है: प्रति कार्य कॉल।

चित्र 3 दोनों मूल्य श्रृंखलाएँ खींचता है।

![निश्चित क्षमता पर प्रति मिलियन टोकन मूल्य का लॉग स्केल चार्ट। a16z का एक आकलन 2021 में 60 डॉलर से 2024 में 0.06 डॉलर तक गिरता है, लगभग प्रति वर्ष दस गुना। 2023 से लगभग प्रति वर्ष तेरह गुना की Epoch AI की ढलान एक बिंदुदार रेखा के रूप में, 2023 में दस डॉलर पर सूचकांकित करके, खींची गई है।](/figures/ai-coding-market/price-trend.svg)

*चित्र 3. क्षमता के एक निश्चित स्तर का मूल्य। डेटा चित्र, लॉग स्केल: a16z के अंतिम बिंदु जैसे छपे हैं वैसे ही हैं [20]; Epoch AI की रेखा 2023 से लगभग प्रति वर्ष 13 गुना की बताई गई दर है [4], जिसे केवल ढलान दिखाने के लिए एक मनमाने आरंभ पर सूचकांकित किया गया है। पड़ाव के अनुसार दायरा Epoch AI [34] से है। एक [PNG प्रति](/figures/ai-coding-market/price-trend.png) उपलब्ध है।*

<div id="26-energy-and-capital" class="anchor-alias" aria-hidden="true"></div>

### 2.6 ऊर्जा और पूँजी

| दावा | संख्या | लेबल | स्रोत |
|---|---|---|---|
| डेटा सेंटर बिजली, 2024 | लगभग 415 TWh, विश्व बिजली का लगभग 1.5% | आकलन | IEA, *Energy and AI* [11] |
| डेटा सेंटर बिजली, 2030 | लगभग 945 TWh, आधार परिदृश्य | अनुमान | [11] |
| डेटा सेंटर बिजली, 2025 से 2030 | 485 TWh से 950 TWh, विश्व माँग का लगभग 3% | आकलन और अनुमान | IEA, *Key Questions on Energy and AI* [10] |
| सबसे बड़ी तकनीकी कंपनियों का पूँजीगत व्यय | 2025 में \$400 बिलियन से अधिक, 2026 में और 75% वृद्धि अपेक्षित | बताया गया और अनुमानित | [10] |
| Alphabet का पूँजीगत व्यय | 2022 में \$31 बिलियन; 2026 में लगभग \$180 से \$190 बिलियन अपेक्षित | कंपनी द्वारा बताया गया और मार्गदर्शन | Pichai [8] |
| प्रति कार्य ऊर्जा | हर वर्ष कम से कम एक परिमाण कोटि कम; reasoning और agentic कार्य "सरल पाठ निर्माण की तुलना में प्रति query सैकड़ों या हज़ारों गुना अधिक ऊर्जा" लेते हैं | आकलन | [10] |
| किसी production सहायक को एक माध्यिका पाठ prompt | 0.24 Wh | संचालक द्वारा मापा गया | Elsworth et al. [12] |
| Stargate | एक लैब के एआई बुनियादी ढाँचे के लिए चार वर्षों में \$500 बिलियन, \$100 बिलियन तुरंत लगाए गए | कंपनी द्वारा घोषित | OpenAI [22] |
| विश्वव्यापी एआई व्यय, 2025 | लगभग \$1.5 ट्रिलियन | अनुमान | Gartner [24] |
| वह राजस्व जो पूँजीगत व्यय को वापस कमाना है | "AI's \$600B question" | विश्लेषण | Sequoia Capital [23] |

जो किराया चुकाना है वह हार्डवेयर का किराया है। इस आकार के पूँजीगत व्यय और प्रतिबद्धताएँ ऐसे उपयोग से चुकाई जाती हैं जिसकी कीमत उसकी ऊर्जा से ऊपर रखी गई है। जिन कार्यों को पुनः उपयोग से बंद किया जा सकता है, उन पर वह आधार छोटा है।

<div id="27-productivity-evidence" class="anchor-alias" aria-hidden="true"></div>

### 2.7 उत्पादकता के प्रमाण

| अध्ययन | n | रचना | प्रभाव | स्रोत |
|---|---|---|---|---|
| a16z निबंध | साक्षात्कार | आकलन | सरल सहायक के लिए लगभग 20%; सर्वश्रेष्ठ श्रेणी के लिए "कम से कम दोगुना" | [1] |
| GitHub Copilot, HTTP server कार्य | भर्ती किए गए डेवलपर | नियंत्रित प्रयोग | एक खिलौना कार्य पर 55.8% तेज़ | Peng et al. [27] |
| Google उद्यम परीक्षण | 96 इंजीनियर | यादृच्छिक नियंत्रित परीक्षण | कार्य पर लगभग 21% कम समय | Paradis et al. [28] |
| METR, 2025 का आरंभ | 16 अनुभवी open source डेवलपर, 246 कार्य | यादृच्छिक नियंत्रित परीक्षण | एआई के साथ 19% धीमे | Becker et al. [25] |
| METR, 2026 अद्यतन | नया समूह | यादृच्छिक नियंत्रित परीक्षण | लेखक नए डेटा को "एक अविश्वसनीय संकेत" कहते हैं | METR [26] |

मापे गए प्रभाव 19% की मंदी से लेकर एक खिलौना कार्य पर 56% की तेज़ी तक फैले हैं। मूल्य आकलन के दोनों कारक, डेवलपरों की गिनती और उत्पादकता गुणक, कच्चे हैं। इससे ट्रिलियन कमज़ोर होता है। इसका यह भी अर्थ है कि सस्ती कोडिंग से जो भी मूल्य मुक्त होता है, वह कोई ज्ञात संख्या नहीं है।

<div id="3-what-the-projections-assume" class="anchor-alias" aria-hidden="true"></div>

## 3. अनुमान क्या मानकर चलते हैं

साथ पढ़ने पर अनुमान चार धारणाओं पर टिके हैं। हर एक डिज़ाइन क्षेत्र की एक दिशा के बारे में कथन है, सॉफ़्टवेयर के मूल्य के बारे में नहीं।

1. **एक दिशा: उत्पादन।** हर परिवर्तन एक मॉडल लिखता है। मूल्य आकलन उत्पादकता को मॉडल से गुणा करता है, और लागत का उदाहरण हर query की कीमत लगाता है [1]।
2. **उच्च ऊर्जा और उच्च कंप्यूट।** टोकन आयतन, डेटा सेंटर बिजली और पूँजीगत व्यय के साथ साथ बढ़ने का अनुमान है [8, 10, 11]। प्रति query ऊर्जा गिरती है, और प्रति कार्य टोकन उससे तेज़ बढ़ते हैं [9, 10]।
3. **प्रति टोकन किराया।** राजस्व प्रति टोकन या ऐसी प्रति seat के हिसाब से लिया जाता है जिसकी लागत टोकन हैं। एक डेवलपर की वार्षिक टोकन लागत का अनुमान वेतन के पैमाने पर है [1]।
4. **एआई सदा लूप में।** कार्य 10,000 की लागत उतनी ही है जितनी कार्य 1 की, क्योंकि मॉडल ने कार्य 1 पर जो सीखा, उसमें से कुछ भी कार्य 10,000 पर मॉडल के बिना नहीं चलता।

जो निबंध ट्रिलियन कहता है, वही उसकी सीमा भी कहता है: "प्रतिस्थापन मूल्य निर्धारण शुरुआती बाज़ारों में काम करता है, पर अंततः किसी वस्तु की लागत उसकी सीमांत लागत की ओर अभिसरित होती है, और कीमत भी" [1]। यह निबंध सहमत है, और पूछता है कि किसी सही कोडिंग कार्य की सीमांत लागत क्या है।

<div id="4-what-a-correct-task-costs" class="anchor-alias" aria-hidden="true"></div>

## 4. एक सही कार्य की लागत क्या है

किसी एक कोडिंग कार्य के लिए परिभाषित करें: $C \in \{0, 1\}$ उसकी स्वीकृति जाँच का परिणाम (tests पास होते हैं, कोई प्रमाण जाँच में खरा उतरता है, या कोई आउटपुट किसी संदर्भ से मेल खाता है), $J$ वह ऊर्जा जो $C = 1$ तक पहुँचने में लगी, जूल में, $c_J$ ऊर्जा की कीमत, डॉलर प्रति जूल में, और $c_{\text{check}}$ जाँच चलाने की लागत, डॉलर में। खरीदार $C = 1$ के लिए भुगतान करता है, टोकनों के लिए नहीं।

**ऊर्जा सीमांत लागत को सीमित करती है।** किसी run की सीमांत लागत कम से कम $c_J J$ है, क्योंकि बिजली खरीदनी पड़ती है। प्रतिस्पर्धा में कीमत सीमांत लागत की ओर जाती है [1, 14]।

**बहुत सा कोड पुनः उपयोग होता है।** Gurevich ने सिद्ध किया कि हर अनुक्रमिक एल्गोरिदम को एक अनुक्रमिक अमूर्त अवस्था मशीन पकड़ लेती है: अवस्थाओं का एक समुच्चय और एक संक्रमण नियम [35]। Lopes और सहयोगियों ने मापा कि GitHub पर लगभग 70% कोड पहले बनाई गई फ़ाइलों के clones से बना है [36]। जहाँ पास होने वाला समाधान पहले से मौजूद है, वहाँ कार्य को फिर से उत्पन्न करने के बजाय उस समाधान को पुनः प्राप्त करके और जाँचकर बंद किया जा सकता है।

**प्रस्ताव E0 (ढके गए कार्य की कीमत)।** किसी कार्य को ढका हुआ कहें जब कोई संग्रहीत समाधान उसकी जाँच पास करता है। मान लें कि $J_{\text{floor}}$ उस समाधान को पुनः प्राप्त करने, लागू करने और जाँचने की ऊर्जा है। ऐसे विक्रेताओं के बीच प्रतिस्पर्धा में, जिनके परिणाम एक ही जाँच पास करते हैं, ढके गए कार्य की कीमत इस ओर जाती है

$$p_{\text{covered}} \to c_J \, J_{\text{floor}} + c_{\text{check}}.$$

उत्पादन की आवश्यकता केवल न ढके गए कार्यों पर होती है। ढके गए अंश $f \in [0, 1]$ वाली कार्य धारा के लिए, जहाँ न ढके गए कार्यों पर औसत उत्पादन लागत $p_{\text{gen}}$ है, प्रति कार्य अपेक्षित कीमत $\bar p = f \, p_{\text{covered}} + (1 - f) \, p_{\text{gen}}$ है। अंश $f$ अभी मापा नहीं गया है (प्रस्ताव E4)।

<div id="5-where-the-projections-are-fragile" class="anchor-alias" aria-hidden="true"></div>

## 5. अनुमान कहाँ नाज़ुक हैं

**प्रति टोकन मूल्य निर्धारण।** पुनः उपयोग से बंद हुए कार्य को किसी टोकन की आवश्यकता नहीं होती, इसलिए प्रति टोकन कीमत वाली राजस्व पंक्ति उस पर कुछ नहीं कमाती। किसी कार्य धारा पर कुल टोकन राजस्व $1 - f$ के अनुपात में होता है।

**हर लूप में मॉडल।** यदि एक बार मिला समाधान संग्रहीत और जाँचा जाता है, तो उसी आकार के बाद के कार्यों को मॉडल की आवश्यकता नहीं होती, इसलिए $f$ बढ़ने के साथ प्रति कार्य मॉडल कॉल घटते हैं। वास्तविक काम पर ऐसा होता है या नहीं, यह प्रस्ताव E3 मापता है।

**प्रति कार्य ऊर्जा।** किसी production सहायक को एक माध्यिका पाठ prompt को उसका संचालक 0.24 Wh, यानी 864 J, मापता है [12], और IEA reasoning और agentic queries को एक सरल query की ऊर्जा के सैकड़ों या हज़ारों गुना पर रखता है [10]। कोई सार्वजनिक माप एक ही कार्यों पर उत्पादन और पुनः प्राप्ति की तुलना नहीं करता, इसलिए यहाँ कोई अनुपात नहीं बताया गया है।

**दो गिरावटें गुणा होती हैं।** प्रति कार्य लागत को $p = n \cdot q$ लिखें, जहाँ $n$ प्रति कार्य मॉडल कॉल हैं और $q$ प्रति कॉल डॉलर। निश्चित प्रदर्शन पर प्रति कॉल कीमत कार्य के अनुसार हर वर्ष 9 से 900 गुना गिरती है [4, 34]। पुनः उपयोग $n$ घटाता है। जो अनुमान टोकन आयतन का बहिर्वेशन करता है, वह केवल $q$ को मॉडल करता है।

**बंडलिंग।** जिस वस्तु की सीमांत लागत शून्य के निकट है, और जो लोगों के पास पहले से मौजूद किसी टूल की पूरक है, वह उस टूल में बंडल हो जाती है, और उसकी अलग कीमत गायब हो जाती है [13, 14]। Nalebuff ने दिखाया कि बंडल प्रवेश को रोक सकता है [32], और Adams और Yellen ने दिखाया कि वह कीमत में भेदभाव कर सकता है [33]; Spolsky ने किसी पूरक वस्तु को कमोडिटी बना देने की रणनीति का वर्णन किया [31]। मूल्य निर्धारण में बदलाव दिखाई देते हैं: GitHub ने 1 जून 2026 से Copilot की व्यक्तिगत योजनाओं को उपयोग आधारित बिलिंग पर कर दिया [30], और Cursor ने 2025 में Pro को request सीमाओं से सीधे आगे बढ़ाए गए API मूल्य निर्धारण पर कर दिया [18]।

**क्या बचता है।** खंड 2.1 का मूल्य आकलन टिक सकता है। नाज़ुक वह धारणा है कि मूल्य उत्पादन पर लगने वाले शुल्क के रूप में वसूला जाता है, क्योंकि वह शुल्क केवल अंश $1 - f$ पर लागू होता है।

<div id="6-demand" class="anchor-alias" aria-hidden="true"></div>

## 6. माँग

सस्ते कार्य कुल माँग बढ़ा सकते हैं। वेंचर निबंध इसकी अपेक्षा करता है: "हमारा मानना है कि इस मामले में Jevon's Paradox लागू होता है" [1]। दो प्रभावों को अलग करना चाहिए। किसी एक कार्य की माँग $C = 1$ होते ही रुक जाती है। कुल उपयोग फिर भी बढ़ सकता है, क्योंकि सस्ता काम नए कार्य खोलता है। एकमात्र प्रकाशित लोच छोटी है। Anthropic के API नमूने के कार्यों में, लागत में हर 1% वृद्धि उपयोग की आवृत्ति में 0.29% कमी से जुड़ी है, यानी लोच $\varepsilon \approx -0.29$ [29]। यह कार्यों के बीच का अनुप्रस्थ संबंध है, समय के साथ कीमत में बदलाव नहीं। $|\varepsilon| < 1$ होने पर, कार्यों के एक निश्चित समुच्चय पर कीमत में गिरावट राजस्व घटाती है, क्योंकि राजस्व $R = pQ$ में बदलाव $dR/R = (1 + \varepsilon)\, dp/p$ होता है।

<div id="7-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 7. प्रस्ताव और प्रोटोकॉल

**प्रस्ताव E1 (लागत वक्र एक दूसरे को काटते हैं)।** किसी एक रिपॉज़िटरी में कार्यों की धारा के लिए, जाँचे गए समाधानों को संग्रहीत और पुनः उपयोग करने वाली विधि की प्रति हल कार्य संचयी लागत सीमित संख्या के कार्यों के बाद हर परिवर्तन उत्पन्न करने वाली विधि की लागत से नीचे आ जाती है। *प्रोटोकॉल:* दोनों को एक ही issue धारा पर बाहरी पावर मीटर के अंतर्गत चलाएँ। कार्य सूचकांक के अनुसार `measured_j` और प्रति हल कार्य डॉलर, और कटान सूचकांक रिपोर्ट करें।

**प्रस्ताव E2 (कीमत तल का अनुसरण करती है)।** जहाँ किसी कोडिंग क्षमता को retrieval और नियमों से बंद किया जा सकता है, वहाँ उसकी सूची कीमत $c_J J_{\text{floor}} + c_{\text{check}}$ की ओर गिरती है। *प्रोटोकॉल:* ऐसे किसी क्षमता वर्ग की सूची कीमतों को समय के साथ उसकी मापी गई run ऊर्जा के सामने ट्रैक करें।

**प्रस्ताव E3 (लागत में टोकन का हिस्सा)।** जिस रिपॉज़िटरी में पुनः उपयोग बढ़ता है, वहाँ कार्य लागत का वह हिस्सा जो टोकन के रूप में चुकाया जाता है, गिरता है। *प्रोटोकॉल:* प्रति दौर प्रति बंद कार्य टोकन, जूल और डॉलर दर्ज करें, और प्रति दौर लागत में टोकन का हिस्सा रिपोर्ट करें।

**प्रस्ताव E4 (कवरेज)।** वास्तविक कोडिंग कार्य आयतन का ढका हुआ अंश $f$ मापने योग्य है। *प्रोटोकॉल:* सार्वजनिक रिपॉज़िटरियों से merge हुए pull requests का एक यादृच्छिक नमूना लें (GitHub एक वर्ष में 518.7 मिलियन merge होने की रिपोर्ट करता है [17]), हर एक के लिए जाँचें कि क्या कोई पुनः प्राप्त समाधान रिपॉज़िटरी के tests पास करता है, और $f$ को 95% Wilson अंतराल के साथ रिपोर्ट करें।

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## संदर्भ

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
