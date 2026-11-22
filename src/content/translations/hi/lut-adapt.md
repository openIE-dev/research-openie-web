---
title: "Mixture of Limits कैस्केड में अधोमुखी LUT6 संकलन: Beneš-रूट किए गए बूलियन फ़ैब्रिक, कन्फ़ॉर्मल वेक द्वार और 4-बिट NVMe परत स्ट्रीमिंग"
deck: "एक चार-पायदान वाला Mixture of Limits (सीमाओं का मिश्रण) कैस्केड जो पहले शून्य-फ़्लोटिंग-पॉइंट-ऑपरेशन (FLOP) वाले पृष्ठित 6-इनपुट लुक-अप टेबल (LUT6) परिपथों को आज़माता है, केवल चूक होने पर ही Mamba-3 और 4-बिट Non-Volatile Memory Express (NVMe) से स्ट्रीम किए गए 2026 के हाइब्रिड मॉडलों को जगाता है, और प्रमाणित वेक परिणामों को अधोमुखी रूप से Beneš-रूट किए गए 36-Kbit Block RAM (RAMB36E2) पृष्ठों में संकलित करता है। वॉल-क्लॉक समय, बिना बफ़र वाले Darwin F_NOCACHE (अबफ़रित फ़ाइल पठन) बाइट गणनाएँ, सक्रिय रैंडम-एक्सेस मेमोरी (RAM), और Yosys/Verilator xck26 रजिस्टर-ट्रांसफ़र-लेवल (RTL) सिमुलेशन openIE-dev/lut-adapt-ai के commit a5e9bc1 से रिपोर्ट किए गए हैं। ऊर्जा के आँकड़े विश्लेषणात्मक est_j अनुमान हैं; बोर्ड पर कोई शक्ति मापन नहीं किया गया।"
lang: "hi"
source: "lut-adapt"
complete: true
---

<div id="downward-lut6-compilation-in-a-mixture-of-limits-cascade-beneš-routed-boolean-fabrics-conformal-wake-gates-and-4-bit-nvme-layer-streaming" class="anchor-alias" aria-hidden="true"></div>

*संशोधन 11dbc8c, 22 नवंबर 2026। संदर्भ कार्यान्वयन और कलाकृतियाँ: [openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai), commit [`a5e9bc1de280f973bc9051b4cc58942820a67eeb`](https://github.com/openIE-dev/lut-adapt-ai/tree/a5e9bc1de280f973bc9051b4cc58942820a67eeb) पर। डेटा सारांश: [/data/#lut-adapt](/data/#lut-adapt)। LaTeX PDF: [/pdfs/latex/lut-adapt.pdf](/pdfs/latex/lut-adapt.pdf) ([स्रोत](/pdfs/latex/lut-adapt.tex))।*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. सिंहावलोकन

यह अध्ययन जाँचता है कि कोई कंप्यूटिंग प्रणाली तंत्रिका-मॉडल (न्यूरल मॉडल) के बार-बार दोहराए जाने वाले कार्य को आउटपुट की सटीक समानता खोए बिना या अपरीक्षित अनुमानों को विश्वसनीय नियमों का दर्जा दिए बिना तेज़ बूलियन तालिका लुकअप में अधोमुखी रूप से कैसे संकलित कर सकती है। इसमें सॉफ़्टवेयर मापन, रजिस्टर-ट्रांसफ़र-लेवल संश्लेषण व चक्र सिमुलेशन, और स्पष्ट रूप से चिह्नित विश्लेषणात्मक ऊर्जा अनुमान (`est_j`) प्रस्तुत किए गए हैं। इस रिपॉज़िटरी में कोई वॉल या रेल जूल मॉनिटर संलग्न नहीं किया गया था (`measured_j` अपरिभाषित है; `board_metered` का मान `false` है)।

**सरल शब्दों में**

1. तैनात प्रणाली जिन इनपुटों को देखती है, उनमें से अधिकांश उन पैटर्नों को दोहराते हैं जिन्हें वह पहले ही हल कर चुकी होती है; इसलिए हर चरण पर पूर्ण फ़्लोटिंग-पॉइंट तंत्रिका नेटवर्क चलाना संगणना और मेमोरी बैंडविड्थ की बर्बादी करता है।
2. संदर्भ कार्यान्वयन स्ट्रीमिंग स्टेट-स्पेस और फ़ाउंडेशन मॉडलों के आगे पुनर्विन्यास-योग्य 6-इनपुट सत्यता-तालिका (`LUT6`) लुकअप का एक पायदान रखता है, और उत्तरों को लुकअप मेमोरी पृष्ठों में अधोमुखी रूप से तभी संकलित करता है जब कोई स्पष्ट जाँच उन्हें प्रमाणित कर दे।
3. जब 2026 का कोई हाइब्रिड भाषा मॉडल सॉलिड-स्टेट ड्राइव से अपने भार (वेट्स) परत-दर-परत स्ट्रीम करता है, तब शून्य-FLOP वाला यह `LUT6` ड्राफ़्टर बहु-टोकन समूह प्रस्तावित करता है जिन्हें लक्ष्य मॉडल डिस्क के एक ही स्वीप में सत्यापित कर लेता है; इससे आउटपुट टोकनों में शून्य परिवर्तन के साथ डिस्क पठन लगभग `3×` घट जाता है।

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. शब्दावली, संक्षिप्ताक्षर और मापन लेबल

<ul id="terms">
<li>MoL: Mixture of Limits (सीमाओं का मिश्रण), मापित कमिट द्वार भाग II से लिया गया कैस्केड नियम [same house]</li>
<li>LA: इस अध्ययन में प्रयुक्त दावों और खंडन-कसौटियों का उपसर्ग (LA-1 से LA-8, LA-F1 से LA-F8)</li>
<li>LUT, LUT6, INIT: लुक-अप टेबल, 6-इनपुट Xilinx UltraScale+ बूलियन प्रिमिटिव, और उसका 64-बिट सत्यता-तालिका आरंभीकरण मास्क</li>
<li>BRAM, RAMB36E2, URAM: Block RAM, 36-Kbit द्वि-पोर्ट UltraScale+ Block RAM प्रिमिटिव (xck26 पर 144), और UltraRAM</li>
<li>CLB, FF, DSP, DSP48, KV260: विन्यास-योग्य लॉजिक ब्लॉक, फ़्लिप-फ़्लॉप, डिजिटल सिग्नल प्रोसेसिंग स्लाइस, और AMD Kria KV260 बोर्ड (xck26)</li>
<li>FPGA, ASIC, RTL, CPI, PAR, WNS, FPL: फ़ील्ड-प्रोग्रामेबल गेट अरे, अनुप्रयोग-विशिष्ट एकीकृत परिपथ, रजिस्टर-ट्रांसफ़र लेवल, प्रति लुकअप चक्र, प्लेस-एंड-रूट, निकृष्टतम ऋणात्मक स्लैक, और Field-Programmable Logic सम्मेलन</li>
<li>AXI, PS, PL, SOM, INA260, VCC, RAPL, NVML: Advanced eXtensible Interface, Zynq प्रोसेसिंग सिस्टम, प्रोग्रामेबल लॉजिक, सिस्टम-ऑन-मॉड्यूल, ऑनबोर्ड पावर मॉनिटर IC, आपूर्ति रेल, Intel Running Average Power Limit, और NVIDIA Management Library</li>
<li>SSD, SSM, MIMO, RoPE, SwiGLU, GQA, KV, BPE, LLM, LLMs, MoE, MLP, CFG: स्टेट स्पेस द्वैत (State Space Duality), स्टेट-स्पेस मॉडल, बहु-इनपुट बहु-आउटपुट, घूर्णी स्थिति एम्बेडिंग, गेटेड रैखिक इकाई सक्रियण, समूहीकृत-क्वेरी अटेंशन, कुंजी-मान कैश, बाइट-पेयर एनकोडिंग, विशाल भाषा मॉडल, विशेषज्ञों का मिश्रण (Mixture-of-Experts), बहुपरत परसेप्ट्रॉन, और संदर्भ-मुक्त व्याकरण</li>
<li>HC, SOINN, WNN, DWN: पदानुक्रम-संदर्भ स्व-संगठित वृद्धिशील तंत्रिका नेटवर्क (hierarchy-context Self-Organizing Incremental Neural Network), भारहीन तंत्रिका नेटवर्क, और अवकलनीय भारहीन तंत्रिका नेटवर्क (Differentiable Weightless Neural Network)</li>
<li>JEPA, EBRM, ACI, OOD, AUROC, AUC, MSP, MC: संयुक्त-एम्बेडिंग पूर्वानुमानी स्थापत्य (Joint-Embedding Predictive Architecture), ऊर्जा-आधारित तर्क मॉडल (Energy-Based Reasoning Model), अनुकूली कन्फ़ॉर्मल इन्फ़रेंस (Adaptive Conformal Inference), वितरण-बाह्य, रिसीवर ऑपरेटिंग अभिलक्षण वक्र के नीचे का क्षेत्रफल, अधिकतम सॉफ़्टमैक्स प्रायिकता, और Monte Carlo</li>
<li>PLD, REST, EAGLE, LFM2, HF: Prompt Lookup Decoding, पुनर्प्राप्ति-आधारित सट्टा डिकोडिंग (Retrieval-Based Speculative Decoding), Extrapolation Algorithm for Greater Language-model Efficiency, Liquid Foundation Model 2.5 (LiquidAI/LFM2.5-350M), और HuggingFace</li>
<li>NVMe, NOCACHE, POSIX, RAM, DRAM, SRAM, IO, KB, MB, GB: Non-Volatile Memory Express भंडारण, Darwin F_NOCACHE अबफ़रित फ़ाइल ध्वज, Portable Operating System Interface, रैंडम-एक्सेस मेमोरी, डायनेमिक RAM, स्टैटिक RAM, इनपुट/आउटपुट, किलोबाइट, मेगाबाइट, और गीगाबाइट</li>
<li>FLOP, FLOPs, MFLOP, MFLOPs, MAC, SIMD, AD, FD, BPB, FP16, FP32, INT4: फ़्लोटिंग-पॉइंट संक्रिया(एँ), दस लाख FLOPs, गुणा-संचय (multiply-accumulate), एकल-अनुदेश बहु-डेटा, स्वचालित अवकलन, परिमित अंतर, प्रति बाइट बिट, 16/32-बिट फ़्लोटिंग पॉइंट, और 4-बिट पूर्णांक</li>
<li>RCE, WCA, VC, SWE: Reality Code Engine [same house], Wise Computer Automation [same house], सत्यापित पूर्णता (verified completion), और सॉफ़्टवेयर-इंजीनियरिंग बेंचमार्क उपसर्ग</li>
<li>CLI, HTTP, SSE, API, ACL, OS, CPU, GPU, SW: कमांड-लाइन इंटरफ़ेस, Hypertext Transfer Protocol, Server-Sent Events, एप्लिकेशन प्रोग्रामिंग इंटरफ़ेस, Association for Computational Linguistics, ऑपरेटिंग सिस्टम, केंद्रीय/ग्राफ़िक्स प्रोसेसिंग इकाई, और सॉफ़्टवेयर</li>
<li>VLAN, IEEE, TLS, DPI, AST, JSON, CSV, SHA, CAM, XNOR: आभासी स्थानीय-क्षेत्र नेटवर्क (IEEE 802.1Q), Transport Layer Security, गहन पैकेट निरीक्षण, अमूर्त सिंटैक्स वृक्ष, JavaScript Object Notation, अल्पविराम-पृथक्कृत मान, Secure Hash Algorithm, सामग्री-पता-योग्य मेमोरी, और अनन्य-NOR</li>
</ul>

नीचे दी गई हर तालिका में साक्ष्य के तीन वर्ग पूरी तरह अलग रखे गए हैं:

| साक्ष्य लेबल | इस अध्ययन में अर्थ |
| :--- | :--- |
| **`Measured (SW / NVMe I/O)`** | Darwin `F_NOCACHE` के अंतर्गत `os.pread` द्वारा पढ़े या लिखे गए सटीक बाइट, निवासी मेमोरी आवंटन, Apple M5 Max पर वॉल-क्लॉक सेकंड, और सटीक बिट/टोकन सहमति। `measured_j` अपरिभाषित (`None`) है। |
| **`Simulated (RTL)`** | Yosys `0.71+` (`synth_xilinx -family xcup`, Kria KV260 `xck26` को लक्षित करते हुए) से प्राप्त संरचनात्मक नेटलिस्ट गणनाएँ और Verilator `5.054` से प्राप्त चक्र गणनाएँ (`CPI = 1`)। यह न तो Vivado टाइमिंग क्लोज़र है और न ही बोर्ड पर मापी गई शक्ति (`board_metered = false`)। |
| **`Estimated (est_j)`** | संक्रिया गणनाओं या थर्मल-डिज़ाइन-पावर समय प्रतिस्थापनों से परिकलित विश्लेषणात्मक जूल (जब macOS पर `RAPL`/`NVML` हार्डवेयर काउंटर अनुपस्थित हों तब `joule_meter.py` का फ़ॉलबैक)। केवल एक ही सूत्र के भीतर विभिन्न शाखाओं के बीच तुलनीय; कभी भी सिलिकॉन वाट नहीं। |

<div id="11-architectural-background-and-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.1 स्थापत्य पृष्ठभूमि और योगदान

[मापित कमिट द्वार](/papers/gates/) `[same house]` के भाग II में **Mixture of Limits (सीमाओं का मिश्रण)** को परिभाषित किया गया है: गियरों को प्रति जूल उत्तीर्णता प्रायिकता $p_i / c_i$ के घटते क्रम में आज़माना (Simon और Kadane, 1975), कार्य-पूर्णता विधेय $C(z) = 1$ सत्य होते ही रुक जाना, और `ModelGenerated` आउटपुट को `Deterministic` में सुदृढ़ करने का निषेध करना। किंतु एक स्थिर लुकअप पायदान केवल उन्हीं प्रविष्टियों को समेटता है जो तैनाती से पहले उसमें लिखी गई हों। इसके विपरीत, मौजूदा लुकअप-टेबल तंत्रिका नेटवर्क, जैसे LogicNets (Umuroglu et al., 2020), DiffLogic (Petersen et al., 2022), और Differentiable Weightless Neural Networks (Bacellar et al., 2024), तार संयोजकता को स्थिर FPGA रूटिंग के भीतर जड़ देते हैं, जिससे इनपुट वितरण बदलते ही विक्रेता प्लेस-एंड-रूट दोबारा चलाना पड़ता है।

`lut-adapt-ai` संदर्भ **ऑनलाइन अधोमुखी `LUT6` संकलन** के माध्यम से कैस्केड के शीर्ष और तल के बीच का चक्र पूरा करता है:

- **पायदान 0 (लुकअप - पृष्ठित Beneš + `LUT6`)**: अवरोध-रहित $512 \times 512$ **Beneš-Copy-Beneš** मल्टीकास्ट स्विच से रूट किए गए और $81 \times \texttt{RAMB36E2}$ द्वि-पोर्ट ब्लॉक मेमोरी में कैश किए गए 64-बिट सत्यता-तालिका मास्कों का मूल्यांकन करता है (`0` फ़्लोटिंग-पॉइंट संक्रियाएँ, Verilator सिमुलेशन में एकल-चक्र पृष्ठ स्विचिंग)।
- **पायदान 1 (स्ट्रीम - `Mamba-3` सम्मिश्र MIMO स्टेट स्पेस द्वैत)**: अनुक्रम इतिहास पर निर्भर चूकों को स्थिर आकार $O(1)$ की आवर्ती अवस्था (`14.3M`-पैरामीटर संदर्भ में `48 KB` पिन की गई मेमोरी) से सँभालता है, जिससे $O(L)$ कुंजी-मान कैश वृद्धि से बचाव होता है।
- **पायदान 2 (टोपोलॉजी - `HC-SOINN`)**: अव्यक्त (लेटेंट) एम्बेडिंग पर ऑनलाइन प्रोटोटाइप टोपोलॉजी बनाए रखता है, शासन-सीमाओं को अलग करता है, और अलेबलित वितरण विस्थापन आने पर सर्किट ब्रेकर (`Refuse` / आरोहण) सक्रिय करता है।
- **पायदान 3 (अंत में मॉडल - `JEPA-EBRM` और `AirMoL` 4-बिट NVMe स्ट्रीमिंग)**: अव्यक्त ऊर्जा-आधारित सत्यापन या परत-दर-परत स्ट्रीम किए गए 2026 के पूर्व-प्रशिक्षित फ़ाउंडेशन मॉडलों (`LiquidAI/LFM2.5-350M` और `Qwen/Qwen3.5-0.8B-Base`) का आह्वान केवल तभी करता है जब सस्ते पायदान विरत रहते हैं या सटीक लक्ष्य सत्यापन माँगते हैं।
- **अधोमुखी `SleepCrystallizer`**: Walsh-Hadamard वर्णक्रमीय वार्म-स्टार्ट, संयुक्त-मोड मिनर्टम सत्यता तालिकाओं और Waksman स्विच अनुसूचियों की सहायता से आवर्ती वेक ट्रेस निकालता है, तथा इन्फ़रेंस को रोके बिना और FPGA प्लेस-एंड-रूट चलाए बिना छाया ब्लॉक-मेमोरी बैंकों को पलट देता है।

<div id="12-contributions" class="anchor-alias" aria-hidden="true"></div>

### 1.2 योगदान

1. **परिशोधित अधोमुखी संकलन शर्त**: Simon-Kadane के $p_i/c_i$ क्रम को स्थिर क्षितिज $\Delta T$ पर स्पष्ट संकलन लागत $E_{\text{compile}}$ के साथ विस्तारित करती है।
2. **अवरोध-रहित $512 \times 512$ Beneš-Copy-Beneš और `81`-`RAMB36E2` RTL स्थापत्य**: सपाट क्रॉसबार के `102.0%` Kria KV260 लॉजिक अतिप्रवाह (`119,478` LUTs) और फ़्लिप-फ़्लॉप पृष्ठ मल्टीप्लेक्सर के `926,619`-LUT विस्फोट दोनों को समाप्त करता है; सिमुलेशन में `1`-चक्र (`250 MHz` नाममात्र पर `4.0 ns`) पृष्ठ स्विचिंग के साथ `41,186` UltraScale+ CLB LUTs (`xck26` का `35.2%`), `81` `RAMB36E2` ब्लॉकों (`56.2%`), और `0` `DSP48` स्लाइसों में संश्लेषित होता है।
3. **सार्वभौमिक $\le 64$-बिट संयुक्त-मोड मिनर्टम संश्लेषण**: दर्शाता है कि सहसंबंधित शाखाओं पर संयुक्त-मोड मिनर्टम लुकअप सीमांत बिट-प्लेन DiffLogic पूर्णांकन पर श्रेष्ठ रहता है और एक `uint64` शब्द में $K = \lfloor 64 / \lceil \log_2 |V| \rceil \rfloor$ उपशब्द टोकन समेटता है (`|V| = 65,536` के लिए `16b × 4 = 64b`; `|V| = 248,320` के लिए `18b × 3 = 54b`)।
4. **ओरेकल-मुक्त Split-Conformal + Online ACI क्रिस्टलीकरण द्वार**: त्रिज्यीय रूप से नियमितीकृत अव्यक्त `JEPA-EBRM` असंगति स्कोर को Split Conformal अंशांकन और अनुकूली कन्फ़ॉर्मल इन्फ़रेंस (Gibbs और Candès, 2021) के साथ जोड़ता है, और विस्थापित ट्रैफ़िक पर `0.00%` मिथ्या क्रिस्टलीकरण जोखिम तथा `1.0000` OOD AUROC दर्ज करता है जहाँ सॉफ़्टमैक्स और MC-Dropout आधार-रेखाएँ `17.62%-24.28%` मिथ्या जोखिम दर्ज करती हैं।
5. **2026 के हाइब्रिड मॉडलों पर `AirMoL` शून्य-अतिरिक्त-स्वीप 4-बिट NVMe स्ट्रीमिंग**: `LiquidAI/LFM2.5-350M` (मार्च 2026) और `Qwen/Qwen3.5-0.8B-Base` (फ़रवरी 2026) पर Darwin `F_NOCACHE` `os.pread` 4-बिट समूह-क्वांटाइज़्ड परत स्ट्रीमिंग को इन-RAM हाइब्रिड अवस्था रोलबैक और ऑनलाइन टोकन-`LUT6` बर्स्ट सट्टा डिकोडिंग के साथ जोड़ती है, और सक्रिय भार RAM को FP32 मॉडल आकार के `8.45%-9.47%` पर रखते हुए `100.0%` सटीक टोकन समानता पर NVMe डिस्क पठन को क्रमशः `2.86×` और `2.74×` घटाती है।
6. **बहुभाषी (पॉलीग्लॉट) सिस्टम सूट और लाइव HTTP/SSE सर्वर**: Python/PyTorch/Triton, Rust `Burn 0.22.1 / CubeCL` Metal, Zig `0.17.1`, Go `1.27.4` SIMD, Julia `1.13.4` Enzyme, और `mol_code_cli.py` में कैस्केड का प्रति-सत्यापन करता है।

<div id="13-same-house-disclosure-and-provenance-boundaries" class="anchor-alias" aria-hidden="true"></div>

### 1.3 समान-संस्थान प्रकटीकरण और उद्गम सीमाएँ

Open Interface Engineering के पूर्व अध्ययन, यथा [मापित कमिट द्वार](/papers/gates/), [एआई माँग में कार्य-तृप्ति बनाम समग्र रिबाउंड](/papers/satiation/), [Reality Code Engine](/papers/rce/), [RCE-JEPA](/papers/rce-jepa/), और [RCE Compile](/papers/rce-compile/), प्रकटीकरण और स्थापत्य निरंतरता के लिए उद्धृत `[same house]` कार्य हैं, कभी भी बाह्य पुष्टि के रूप में नहीं। दो अपरिवर्तनीय नियम सर्वत्र बाध्यकारी हैं:

- **उद्गम असुदृढ़ीकरण (`ModelGenerated ↛ Deterministic`)**: किसी निर्धारणात्मक `RCE` विनिर्देश जाँच से संकलित तालिकाएँ सत्यापित अलग रखे गए समुच्चयों पर `Check-safe` होती हैं (ऑनलाइन `HC-SOINN` / `RCE` सर्किट ब्रेकर द्वारा रक्षित)। ओरेकल-मुक्त `JEPA-EBRM` कन्फ़ॉर्मल द्वार के अधीन क्रिस्टलीकृत तालिकाएँ परिमित-नमूना सांख्यिकीय सीमा (`Conformal-bounded`, $1-\alpha$) वहन करती हैं और उन्हें कभी भी `Deterministic` में पदोन्नत नहीं किया जाता।
- **प्रस्तावक बनाम प्राधिकार (`The drafter proposes; the target decides`)**: सट्टा डिकोडिंग में `PagedBenesLUT6` विशुद्ध रूप से शून्य-FLOP प्रस्तावक के रूप में कार्य करता है; उत्सर्जित प्रत्येक बाइट या टोकन का सत्यापन लक्ष्य मॉडल की लालची (ग्रीडी) डिकोडिंग के विरुद्ध किया जाता है (`100.0%` हानिरहित समानता)।

---

<div id="2-mathematical-formulations-and-four-results" class="anchor-alias" aria-hidden="true"></div>

## 2. गणितीय सूत्रीकरण और चार परिणाम

<div id="21-result-1-cascade-ordering-with-amortized-downward-compilation" class="anchor-alias" aria-hidden="true"></div>

### 2.1 परिणाम 1: परिशोधित अधोमुखी संकलन के साथ कैस्केड क्रम-निर्धारण

मान लीजिए कि इनपुट $x$ पर गियर $i \in \{0, 1, 2, 3\}$ क्रमिक रूप से आज़माए जाते हैं। गियर $i$ अपेक्षित विश्लेषणात्मक ऊर्जा $c_i > 0$ पर प्रायिकता $p_i$ के साथ $C(z) = 1$ को पूर्ण करता है। Simon और Kadane (1975) के अनुसार अपेक्षित व्यय

$$\mathbb{E}[J_\sigma] = \sum_{k=1}^{n} c_{\sigma(k)} \prod_{j < k} \bigl(1 - p_{\sigma(j)}\bigr)$$

तभी और केवल तभी न्यूनतम होता है जब गियर $p_{\sigma(k)} / c_{\sigma(k)}$ के अवरोही (अवर्धमान) क्रम में चलाए जाएँ। मान लीजिए कि कोई स्थिर शासन $\mathcal{D}_r$ शेष $\Delta T$ प्रश्नों तक बना रहता है जहाँ वेक पथ लागत $c_{\text{wake}}$ पर $p_{\text{wake}} = 1$ के साथ कार्य पूरा करता है। $N_{\text{wake}}$ प्रमाणित वेक के बाद एकबारगी संकलन ऊर्जा $E_{\text{compile}}$ खर्च करने से प्रमाणित हिट दर $p_0' \in (0, 1]$ और लुकअप लागत $c_0 \ll c_{\text{wake}}$ वाला पायदान 0 `LUT6` पृष्ठ प्राप्त होता है।

**प्रस्ताव 1 (अधोमुखी क्रिस्टलीकरण के लिए शुद्ध ऊर्जा शर्त)।** *अधोमुखी संकलन क्षितिज $\Delta T$ पर अपेक्षित संचयी विश्लेषणात्मक व्यय को तभी और केवल तभी घटाता है जब*

$$\Delta T \cdot \bigl(p_0' c_{\text{wake}} - c_0\bigr) > E_{\text{compile}}, \qquad \text{and} \qquad \frac{p_0'}{c_0} > \frac{1}{c_{\text{wake}}}.$$

*उपपत्ति।* क्रिस्टलीकरण के बिना $\Delta T$ प्रश्नों की लागत $\Delta T \cdot c_{\text{wake}}$ होती है। लागत $E_{\text{compile}}$ पर क्रिस्टलीकरण के साथ, जब भी $p_0'/c_0 > 1/c_{\text{wake}} \iff c_0 < p_0' c_{\text{wake}}$ होता है, पायदान 0 वेक पथ से पहले आता है, और प्रत्येक प्रश्न की लागत $c_0 + (1 - p_0') c_{\text{wake}}$ होती है, जिससे प्रति चरण $p_0' c_{\text{wake}} - c_0 > 0$ की बचत होती है। $\Delta T$ चरणों का योग करने पर शुद्ध बचत $\Delta T(p_0' c_{\text{wake}} - c_0) - E_{\text{compile}} > 0$ मिलती है। तीव्र परिवर्तनशीलता ($\Delta T \le \Delta T^*$) में संकलन से ऊर्जा की हानि होती है, जो `SleepCrystallizer` के न्यूनतम वेक बफ़र $N_{\text{wake}}$ और अलग रखे गए समुच्चय के द्वार $\tau_{\text{agree}} = 0.985$ को प्रेरित करता है। $\blacksquare$

<div id="22-result-2-non-blocking-512512-benešcopybeneš-multicast-routing" class="anchor-alias" aria-hidden="true"></div>

### 2.2 परिणाम 2: अवरोध-रहित $512 \times 512$ Beneš-Copy-Beneš मल्टीकास्ट रूटिंग

$G = 80$ गतिशील `LUT6` कोशिकाओं वाले पायदान 0 बैंक को मनमाने फ़ैन-आउट के साथ $N = 512$-बिट बस से चुने गए $M = 6G = 480$ इनपुट पिनों की आवश्यकता होती है। एकैकैकी (बाइजेक्टिव) Beneš क्रमचय नेटवर्क उच्च फ़ैन-आउट वाले तारों की प्रतिकृति नहीं बना सकता, जबकि सपाट $512:1$ मल्टीप्लेक्सर क्रॉसबार KV260 की क्षमता से बाहर निकल जाते हैं (`384` पोर्ट पर ही `119,478` CLB LUTs)।

**प्रमेय 2 (Beneš-Copy-Beneš द्वारा प्रतिस्पर्धा-मुक्त मल्टीकास्ट)।** *$N = 2^n$ ($n=9, N=512$) और $M \le N$ ($M=480$) के लिए, कोई भी अनेक-से-एक मल्टीकास्ट प्रतिचित्रण $\phi: \{0, \dots, M-1\} \to \{0, \dots, N-1\}$, $\mathcal{B}_1 \to \mathcal{C} \to \mathcal{B}_2$ से होकर बिना किसी लिंक प्रतिस्पर्धा के*

$$D(N) = 2(2\log_2 N - 1) + \log_2 N = 5\log_2 N - 2 = 43 \text{ stages}$$

*में रूट होता है, जिनमें $N/2 = 256$ SRAM-विन्यासित $2 \times 2$ स्विच ($11,008$ विन्यास बिट) होते हैं और जिनकी गणना शून्य FPGA प्लेस-एंड-रूट के साथ $O(N \log N)$ समय में होती है।*

*उपपत्ति।* मान लीजिए $U = \{s_1, \dots, s_r\}$ भिन्न सक्रिय इनपुट हैं जिनके फ़ैन-आउट $\sum_{j=1}^r m_j = M \le N$ और आंशिक योग $S_0 = 0, S_j = \sum_{i=1}^j m_i$ हैं। सांद्रण नेटवर्क $\mathcal{B}_1$ ($17$ चरण) Waksman के द्विखंडीय 2-रंगण द्वारा $\pi_1(s_j) = S_{j-1}$ प्रतिचित्रित करता है (Beneš, 1965; Waksman, 1968)। प्रतिलिपि नेटवर्क $\mathcal{C}$ ($9$ बटरफ़्लाई चरण) Thompson की एकदिष्ट प्रतिलिपि रचना से बिना लिंक प्रतिस्पर्धा के प्रत्येक $S_{j-1}$ को असंयुक्त एकदिष्ट अंतराल $[S_{j-1}, S_j - 1]$ पर दोहराता है (Thompson, 1978; Lee, 1988)। आउटपुट Beneš नेटवर्क $\mathcal{B}_2$ ($17$ चरण) अंतराल $[S_{j-1}, S_j - 1]$ को एकैकैकी रूप से $\phi^{-1}(s_j)$ पर क्रमचयित करता है। $\blacksquare$

<div id="23-result-3-joint-mode-minterm-synthesis-vs-marginal-coordinate-argmax" class="anchor-alias" aria-hidden="true"></div>

### 2.3 परिणाम 3: संयुक्त-मोड मिनर्टम संश्लेषण बनाम सीमांत निर्देशांक argmax

स्वतंत्र बिट-प्लेन DiffLogic परतें निर्देशांक-वार पूर्णांकन $\hat{y}_b(c) = \mathbb{I}[\Pr(Y_b = 1 \mid c) > 1/2]$ के माध्यम से बहु-बिट बर्स्ट $\mathbf{Y} = (Y_1, \dots, Y_B)$ का पूर्वानुमान लगाती हैं, जो सहसंबंधित शाखाओं को मिलाकर अमान्य **काइमेरा (chimera)** टोकन बना देता है।

**प्रस्ताव 3 (संयुक्त-मोड मिनर्टम की श्रेष्ठता और शून्य-काइमेरा गुण)।** *विविक्त संदर्भ $\psi(X) = c$ और $B \le 64$-बिट बर्स्ट समष्टि $\mathcal{Y}$ के लिए संयुक्त-मोड तालिका $T^*(c) = \arg\max_{\mathbf{y} \in \mathcal{Y}} \Pr(\mathbf{Y} = \mathbf{y} \mid c)$, $\Pr[\mathbf{Y} = T^*(\psi(X))] \ge \Pr[\mathbf{Y} = \hat{\mathbf{y}}^{\text{marg}}(\psi(X))]$ को संतुष्ट करती है, $\operatorname{supp}(\mathbf{Y} \mid c)$ के भीतर रहती है, और सीमांत काइमेरा से बचती है (जहाँ $(1,1,0), (1,0,1), (0,1,1)$ पर प्रायिकता भार $0.40, 0.35, 0.25$ सीमांत रूप से अमान्य $(1,1,1)$ में पूर्णांकित होकर $T^*$ के `40%` के मुक़ाबले `0%` सटीक मिलान देता है)। $b_V = \lceil \log_2 |V| \rceil$ वाली शब्दावली $|V|$ के लिए एक `uint64` शब्द $K = \lfloor 64 / b_V \rfloor$ BPE टोकन समेटता है (`LFM2.5-350M` पर `16b × 4 = 64b`; `Qwen3.5-0.8B-Base` पर `18b × 3 = 54b`)।* $\blacksquare$

<div id="24-result-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 2.4 परिणाम 4: ओरेकल-मुक्त अव्यक्त `JEPA-EBRM` Split-Conformal + Online ACI द्वार

जब कोई निर्धारणात्मक `RCE` जाँच उपलब्ध न हो तब मतिभ्रम-जनित स्व-आसवन (सेल्फ़-डिस्टिलेशन) को रोकने के लिए, संदर्भ कार्यान्वयन त्रिज्यीय रूप से नियमितीकृत अव्यक्त ऊर्जा से उम्मीदवार युग्मों को अंक देता है:

$$E_\phi(x, y) = \frac{1}{2}\|f_\theta(x) - \mu_y\|_2^2 + \frac{\lambda_r}{2}\|f_\theta(x)\|_2^2 + \psi_\phi(f_\theta(x), y), \qquad \lambda_r > 0, \quad |\psi_\phi| \le C_\psi.$$

अलग रखे गए समुच्चय पर Split Conformal अंशांकन $\hat{Q}_{1-\alpha}$ निर्धारित करता है, और ऑनलाइन अनुकूली कन्फ़ॉर्मल इन्फ़रेंस $\alpha_{t+1} = \alpha_t + \gamma(\alpha - \text{err}_t)$ को अद्यतन करता है (Gibbs और Candès, 2021), तथा $(x, \hat{y})$ को `SleepCrystallizer` में केवल तभी प्रवेश देता है जब $|\mathcal{C}_t(x)| = |\{y : E_\phi(x,y) \le \hat{Q}_{1-\alpha_t}\}| = 1$ (`Conformal-bounded`) हो। Vovk et al. (2005) और Gibbs तथा Candès (2021) के अनुसार विनिमेय सीमांत आच्छादन कम-से-कम $1-\alpha$ रहता है, दीर्घकालिक विस्थापित अनाच्छादन $\alpha$ की ओर अभिसरित होता है, और त्रिज्या $R(\alpha_t) = \sqrt{2(\hat{Q}_{1-\alpha_t} + C_\psi)/\lambda_r}$ से बाहर जाने वाली प्रत्येक ऑफ़-मैनिफ़ोल्ड किरण $\mathcal{C}_t(x) = \emptyset$ (`Refuse` / विरति) देती है।

---

<div id="3-reference-architecture-polyglot-suite-and-kv260-rtl" class="anchor-alias" aria-hidden="true"></div>

## 3. संदर्भ स्थापत्य, बहुभाषी सूट और KV260 RTL

चित्र 1 `src/clai/` में चार-पायदान कैस्केड और अधोमुखी `SleepCrystallizer` चक्र को दर्शाता है।

![चित्र 1. चार-पायदान Mixture of Limits कैस्केड में अधोमुखी संकलन।](/figures/lut-adapt/mol-downward-cascade.svg)

*चित्र 1. चार-पायदान Mixture of Limits कैस्केड में अधोमुखी संकलन। यह डिज़ाइन आरेख है, बोर्ड पर शक्ति मापन नहीं। [PNG](/figures/lut-adapt/mol-downward-cascade.png) · [इंटरैक्टिव एक्सप्लोरर](/living/lut-adapt/#la-diag-01)।*

`openIE-dev/lut-adapt-ai` में पाँच सिस्टम कार्यान्वयन कैस्केड का प्रति-सत्यापन करते हैं: Python/PyTorch/Triton (`src/clai/`), Rust `Burn 0.22.1 / CubeCL` Metal (`sys/rust/`), Zig `0.17.1` (`sys/zig/`), Go `1.27.4` SIMD (`sys/go/`), और Julia `1.13.4` Enzyme (`sys/julia/`)।

चित्र 2 `hw/kv260/rtl/clai_benes_hotswap_core.sv` में Kria KV260 (`xck26`) RTL डेटापाथ को दर्शाता है, जो एकल-चक्र (`250 MHz` नाममात्र पर `4.0 ns`, `CPI = 1.0`) संदर्भ स्विचिंग के लिए `512` निवासी `LUT6` पृष्ठों (`5,120` `INIT` बिट + `48`-बिट संदर्भ टैग + वैध बिट) को `81` समांतर `RAMB36E2` द्वि-पोर्ट मेमोरी में प्रतिचित्रित करता है।

![चित्र 2. Beneš-Copy-Beneš मल्टीकास्ट फ़ैब्रिक और एकल-चक्र BRAM LUT6 पृष्ठ कैश।](/figures/lut-adapt/benes-paged-silicon.svg)

*चित्र 2. Yosys `0.71+` और Verilator `5.054` सिमुलेशन (`board_metered = false`) में AMD Kria KV260 (`xck26`) को लक्षित करने वाला `512×512` Beneš-Copy-Beneš मल्टीकास्ट फ़ैब्रिक और `81 × RAMB36E2` एकल-चक्र `LUT6` पृष्ठ कैश। [PNG](/figures/lut-adapt/benes-paged-silicon.png) · [इंटरैक्टिव एक्सप्लोरर](/living/lut-adapt/#la-diag-02)।*

चित्र 3 `AirMoL` (`src/clai/frontier/air_mol_streamer.py` और `hf_air_mol_pretrained.py`) को दिखाता है, जो Darwin `F_NOCACHE` `os.pread` के माध्यम से 4-बिट समूह-क्वांटाइज़्ड शार्ड स्ट्रीम करता है, एक ही स्वीप में `[last_tok, d_1..d_K]` का सत्यापन करता है, और संक्षिप्त हाइब्रिड अवस्थाओं (`Short-Conv/SSM` या `Gated DeltaNet` + विरल `6`-परत `GQA` KV काट) का स्नैपशॉट RAM में रखता है ताकि आंशिक ड्राफ़्ट अस्वीकृतियों के लिए **शून्य अतिरिक्त NVMe स्वीप** लगें।

![चित्र 3. सार्वभौमिक 64-बिट टोकन LUT6 सट्टा डिकोडिंग के साथ AirMoL 4-बिट NVMe परत स्ट्रीमिंग।](/figures/lut-adapt/airmol-nvme-speculation.svg)

*चित्र 3. `LiquidAI/LFM2.5-350M` और `Qwen/Qwen3.5-0.8B-Base` पर सार्वभौमिक `≤64`-बिट टोकन `LUT6` सट्टा डिकोडिंग के साथ `AirMoL` शून्य-अतिरिक्त-स्वीप 4-बिट NVMe परत स्ट्रीमिंग। [PNG](/figures/lut-adapt/airmol-nvme-speculation.png) · [इंटरैक्टिव एक्सप्लोरर](/living/lut-adapt/#la-run-01)।*

---

<div id="4-claims-and-results" class="anchor-alias" aria-hidden="true"></div>

## 4. दावे और परिणाम

<div id="41-claim-la-1-analytical-est_jvc-reduction-on-synthetic-tasks-and-real-pcap-traffic" class="anchor-alias" aria-hidden="true"></div>

### 4.1 दावा LA-1: कृत्रिम कार्यों और वास्तविक `.pcap` ट्रैफ़िक पर विश्लेषणात्मक `est_j/VC` में कमी

| कार्यभार व विंडो | पायदान 0 हिस्सा | उत्तीर्णता दर | विश्लेषणात्मक `est_j / VC` | Verilator समानता | साक्ष्य वर्ग |
| :--- | :---: | :---: | :---: | :---: | :--- |
| कृत्रिम एपिसोड `1-512` (ठंडा वेक) | `0.00%` | `0.0% → 52.0%` | `2,323.18 est_j` | - | SW + `est_j` |
| कृत्रिम एपिसोड `3,073-3,584` (क्रिस्टलीकृत) | `52.73%` | `60.55%` | `2.59 est_j` (`895×`) | `100.0%` | Verilator + `est_j` |
| `.pcap` पैकेट `1-512` (ठंडा IPv4) | `0.00%` | `73.05%` | `3.3351 est_j` | `100.0%` | Verilator + `est_j` |
| `.pcap` पैकेट `1,537-2,048` (क्रिस्टलीकृत) | `100.00%` | `100.00%` | `0.000140 est_j` | `100.0%` | Verilator + `est_j` |
| `.pcap` पैकेट `2,049-2,560` (VLAN `0x8100` विस्थापन) | `2.73%` | `68.55%` | `3.0485 est_j` | `100.0%` | ब्रेकर + `est_j` |
| **`.pcap` पैकेट `2,561-3,072` (पुनः क्रिस्टलीकृत)** | **`100.00%`** | **`100.00%`** | **`0.000131 est_j` (`25,458×`)** | **`100.0%` (`5,120/5,120`)** | **Verilator + `est_j`** |

<div id="42-claim-la-2-five-language-polyglot-parity-and-zero-allocation-dataplanes" class="anchor-alias" aria-hidden="true"></div>

### 4.2 दावा LA-2: पाँच-भाषाई पॉलीग्लॉट समानता और शून्य-आवंटन डेटाप्लेन

| कार्यान्वयन | लक्ष्य / बैकएंड | मुख्य परिणाम | साक्ष्य वर्ग |
| :--- | :--- | :--- | :--- |
| **Rust (`sys/rust/`)** | `Burn 0.22.1` + `CubeCL` Metal GPU | `2,331.42 → 0.19 est_j/VC`, `95.31%` पायदान 0 हिस्सा, KV260 `.v` उत्सर्जित करता है | मापित SW + `est_j` |
| **Zig `0.17.1` (`sys/zig/`)** | `@Vector(8, f32)` SIMD + `@popCount` | हॉट लूप में `0` हीप बाइट; `87 ns/pkt` (`11.49M pkts/s`) | मापित SW (M5 Max) |
| **Go `1.27.4` (`sys/go/`)** | वर्कर पूल + `OnesCount64` | `0 B/op`, `0 allocs/op`; `31.86 ns/op` (`31.39M evals/s`) | मापित (`go test`) |
| **Julia `1.13.4` (`sys/julia/`)** | `Enzyme.jl` पश्च-मोड AD | केंद्रीय FD की तुलना में अधिकतम ग्रेडिएंट अंतर: `6.11 × 10⁻¹⁰` | मापित संख्यात्मक जाँच |

<div id="43-claim-la-3-kv260-xck26-benešcopybeneš-and-ramb36e2-paged-synthesis" class="anchor-alias" aria-hidden="true"></div>

### 4.3 दावा LA-3: KV260 (`xck26`) Beneš-Copy-Beneš और `RAMB36E2` पृष्ठित संश्लेषण

| RTL स्थापत्य | पृष्ठ | स्विच विलंबता | `xcup` CLB LUTs (`% xck26`) | `RAMB36E2` | `DSP48` | विस्थापन-पश्च सटीकता | साक्ष्य वर्ग |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `2A` सपाट `512:1` क्रॉसबार (`64` LUT6) | `1` | `82 cyc` | `119,478` (**`102.0%` अतिप्रवाह**) | `0` | `0` | `98.44%` | सिमुलेटेड (Yosys) |
| `2B` संक्षिप्त क्रॉसबार (`32` LUT6) | `1` | `82 cyc` | `59,739` (`51.0%`) | `0` | `0` | `95.94%` | सिमुलेटेड (Yosys) |
| `2C` स्थिर-तार DiffLogic / WNN | `1` | Vivado पुनः-PAR | `160` (`0.14%`) | `0` | `0` | **`52.34%`** | सिमुलेटेड (Yosys) |
| `2D` एकल-पृष्ठ Beneš-Copy-Beneš | `1` | `82 cyc` | `40,155` (`34.3%`) | `0` | `0` | `98.44%` | सिमुलेटेड (Yosys + Verilator) |
| `P2` वितरित FF + `512:1` Mux | `512` | `1 cyc` | `926,619` (**`791.2%` अतिप्रवाह**) | `0` | `0` | `98.44%` | सिमुलेटेड |
| **`P3` Beneš + `81` `RAMB36E2` (संदर्भ)** | **`512`** | **`1 cyc` (`4.0 ns`)** | **`41,186` (`35.2%`)** | **`81` (`56.2%`)** | **`0`** | **`98.44%`** | **सिमुलेटेड (Yosys + Verilator)** |

<div id="44-claim-la-4-oracle-free-latent-jepa-ebrm-split-conformal--online-aci-gate" class="anchor-alias" aria-hidden="true"></div>

### 4.4 दावा LA-4: ओरेकल-मुक्त अव्यक्त `JEPA-EBRM` Split-Conformal + Online ACI द्वार

| क्रिस्टलीकरण द्वार | पास | मिथ्या क्रिस्टलीकरण जोखिम | OOD AUROC | सुरक्षित ID आच्छादन | शुद्ध `LUT6` सटीकता | विस्थापन पकड़ा? | साक्ष्य वर्ग |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `3A` सॉफ़्टमैक्स MSP ($\max p \ge 0.95$) | `1` | `17.62%` | `0.8552` | `90.93%` | `99.22%` | `False` | मापित SW |
| `3B` तापमान-स्केल्ड मार्जिन | `1` | `17.66%` | `0.8422` | `91.12%` | `98.83%` | `False` | मापित SW |
| `3C` Helmholtz लॉजिट ऊर्जा | `1` | `24.28%` | `0.8045` | `97.17%` | `99.80%` | `False` | मापित SW |
| `3D` MC-Dropout (`5` पास) | `5` | `18.24%` | `0.8494` | `91.03%` | `99.61%` | `False` | मापित SW |
| **`3E` अव्यक्त `JEPA-EBRM` + कन्फ़ॉर्मल ACI** | **`1`** | **`0.00%`** | **`1.0000`** | **`95.66%`** | **`99.02%`** | **`True`** | **मापित SW** |

<div id="45-claim-la-5-lossless-byte-level-speculative-decoding-on-520-kb-polyglot-source-code" class="anchor-alias" aria-hidden="true"></div>

### 4.5 दावा LA-5: `520 KB` बहुभाषी स्रोत कोड पर बाइट-स्तरीय हानिरहित सट्टा डिकोडिंग

| स्थापत्य | सटीक समानता | बाइट / पास | पास (`64 B`) | ड्राफ़्ट FLOPs | MFLOPs / बाइट | `est_mJ / Byte` | साक्ष्य वर्ग |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `A` कारणिक ट्रांसफ़ॉर्मर (`RoPE+SwiGLU`) | `100.0%` | `1.00` | `64.00` | `0` | `7.209` | `58.94` | मापित SW + `est_j` |
| `B` `Mamba-3` सम्मिश्र MIMO (`T=1`) | `100.0%` | `1.00` | `64.00` | `0` | `2.257` | `20.84` | मापित SW + `est_j` |
| `C` `PLD` प्रॉम्प्ट-भीतर लुकअप | `100.0%` | `2.13` | `29.98` | `0` | `1.322` | `11.52` | मापित SW + `est_j` |
| `D` `REST` कॉर्पस प्रत्यय-ट्राई | `100.0%` | `3.84` | `16.65` | `0` | `0.734` | `6.40` | मापित SW + `est_j` |
| `E` `Medusa` समांतर MLP शीर्ष | `100.0%` | `2.62` | `24.44` | `428,288` | `1.241` | `9.46` | मापित SW + `est_j` |
| `F` `EAGLE-2` तंत्रिका ड्राफ़्ट वृक्ष | `100.0%` | `2.75` | `23.29` | `1,122,560` | `1.435` | `9.07` | मापित SW + `est_j` |
| **`G` `MoL` पृष्ठित Beneš `LUT6` (संदर्भ)** | **`100.0%`** | **`3.84`** | **`16.69`** | **`0`** | **`0.736`** | **`6.41`** | **मापित SW + `est_j`** |

<div id="46-claim-la-6-controlled-airmol-4-bit-nvme-streaming-143m-matched-pair" class="anchor-alias" aria-hidden="true"></div>

### 4.6 दावा LA-6: नियंत्रित `AirMoL` 4-बिट NVMe स्ट्रीमिंग (`14.3M` सुमेलित युग्म)

| ऑफ़लोडेड स्ट्रीमिंग स्थापत्य | समानता | बाइट / स्वीप | स्वीप | NVMe पठन | NVMe लेखन | शीर्ष RAM | `ms / Byte` | साक्ष्य वर्ग |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `1` `AirLLM` ट्रांसफ़ॉर्मर FP16 + KV स्पिल | `100%` | `1.00` | `64.00` | `2,130.0 MB` | `407.6 MB` | `8.81 MB` | `60.64` | मापित (`F_NOCACHE`) |
| `2` `AirLLM` ट्रांसफ़ॉर्मर 4-बिट + KV स्पिल | `100%` | `1.00` | `64.00` | `887.6 MB` | `407.6 MB` | `8.81 MB` | `64.87` | मापित (`F_NOCACHE`) |
| `3` `AirMamba-3` 4-बिट + स्वैप किया गया `EAGLE-2` | `100%` | `2.86` | `22.38` | `175.3 MB` | `0.0 MB` | `7.20 MB` | `19.20` | मापित (`F_NOCACHE`) |
| `4` `AirMamba-3` 4-बिट + पिन किया गया $O(1)$ (`T=1`) | `100%` | `1.00` | `64.00` | `488.3 MB` | `0.0 MB` | `7.20 MB` | `37.72` | मापित (`F_NOCACHE`) |
| **`5` `AirMoL` 4-बिट + ठंडा `LUT6` (संदर्भ)** | **`100%`** | **`3.74`** | **`17.12`** | **`130.7 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.18`** | **मापित (`F_NOCACHE`)** |
| **`6` `AirMoL` 4-बिट + वेक-पश्च (संदर्भ)** | **`100%`** | **`4.27`** | **`15.00`** | **`114.4 MB`** | **`0.0 MB`** | **`7.51 MB`** | **`11.09`** | **मापित (`F_NOCACHE`)** |

<div id="47-claim-la-7-pretrained-2026-hybrid-models-under-airmol-lfm25-350m--qwen35-08b-base" class="anchor-alias" aria-hidden="true"></div>

### 4.7 दावा LA-7: `AirMoL` के अंतर्गत 2026 के पूर्व-प्रशिक्षित हाइब्रिड मॉडल (`LFM2.5-350M` व `Qwen3.5-0.8B-Base`)

| 2026 चेकपॉइंट व शाखा | समानता | टोकन / स्वीप | अक्षर / स्वीप | स्वीप | NVMe पठन | शीर्ष सक्रिय RAM (`% FP32`) | `tok/s` | साक्ष्य वर्ग |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `LFM2.5-350M` · `AirLLM` FP16 (`T=1`) | `100%` | `1.00` | `3.11` | `32.00` | `25.129 GB` | `128.0 MB` (`9.47%`) | `2.21` | मापित (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-बिट (`T=1`) | `100%` | `1.00` | `2.73` | `32.00` | `7.071 GB` | `128.0 MB` (`9.47%`) | `2.21` | मापित (`F_NOCACHE`) |
| `LFM2.5-350M` · `AirLLM` 4-बिट + `PLD` | `100%` | `1.13` | `3.10` | `28.20` | `6.231 GB` | `128.0 MB` (`9.47%`) | `2.71` | मापित (`F_NOCACHE`) |
| **`LFM2.5-350M` · `AirMoL` ठंडा `LUT6`** | **`100%`** | **`1.32`** | **`3.61`** | **`24.20`** | **`5.347 GB`** | **`128.0 MB` (`9.47%`)** | **`2.74`** | **मापित (`F_NOCACHE`)** |
| **`LFM2.5-350M` · `AirMoL` वेक-पश्च** | **`100%`** | **`2.86`** | **`7.80`** | **`11.20`** | **`2.475 GB`** | **`128.0 MB` (`9.47%`)** | **`6.26`** | **मापित (`F_NOCACHE`)** |
| `Qwen3.5-0.8B` · `AirLLM` 4-बिट (`T=1`) | `100%` | `1.00` | `2.72` | `24.00` | `12.674 GB` | `242.5 MB` (`8.45%`) | `0.53` | मापित (`F_NOCACHE`) |
| `Qwen3.5-0.8B` · `AirLLM` 4-बिट + `PLD` | `100%` | `1.32` | `3.58` | `18.25` | `9.637 GB` | `242.5 MB` (`8.45%`) | `0.50` | मापित (`F_NOCACHE`) |
| **`Qwen3.5-0.8B` · `AirMoL` ठंडा `LUT6`** | **`100%`** | **`1.48`** | **`4.02`** | **`16.25`** | **`8.581 GB`** | **`242.5 MB` (`8.45%`)** | **`0.32`** | **मापित (`F_NOCACHE`)** |
| **`Qwen3.5-0.8B` · `AirMoL` वेक-पश्च** | **`100%`** | **`2.74`** | **`7.46`** | **`8.75`** | **`4.621 GB`** | **`242.5 MB` (`8.45%`)** | **`1.11`** | **मापित (`F_NOCACHE`)** |

`Qwen3.5-0.8B-Base` के ठंडे अनदेखे प्रॉम्प्टों पर सुरक्षित रखे गए समंजन (ट्रेड-ऑफ़) पर ध्यान दें: `AirMoL` NVMe डिस्क पठन को `12.674 GB` से घटाकर `8.581 GB` कर देता है, फिर भी CPU पर Gated DeltaNet में `4` टोकनों का बैच सत्यापन वॉल-क्लॉक थ्रूपुट को (`0.53 tok/s` की तुलना में `0.32`) घटा देता है, जब तक कि ऑनलाइन वेक-से-`LUT6` क्रिस्टलीकरण स्वीकृति दर को बढ़ाकर `2.74 tok/sweep` (`4.621 GB` पठन, `1.11 tok/s`) नहीं कर देता।

<div id="48-claim-la-8-live-cli-and-httpsse-streaming-server-mol_code_clipy" class="anchor-alias" aria-hidden="true"></div>

### 4.8 दावा LA-8: लाइव CLI और HTTP/SSE स्ट्रीमिंग सर्वर (`mol_code_cli.py`)

`scripts/mol_code_cli.py` CLI और SSE एंडपॉइंटों (`/v1/health`, `/v1/complete`, `/v1/crystallize`) पर `--backend {mamba3,lfm2.5-350m,qwen3.5-0.8b}` तथा `--air-nvme` परोसता है, और `18/18` उत्तीर्ण `pytest` सूटों के साथ लाइव अवस्था में `RAMB36E2` स्लॉट अधिवास को `438/512` से `460/512` तक बढ़ाता है।

---

<div id="5-related-work-and-convergence-observations" class="anchor-alias" aria-hidden="true"></div>

## 5. संबंधित कार्य और अभिसरण प्रेक्षण

| प्रणाली | पहचान / मंच | क्या स्थापित करती है | रिपोर्ट की गई लागत | इस संदर्भ में अंतर |
| :--- | :--- | :--- | :--- | :--- |
| **LogicNets** (Umuroglu et al., 2020) | `arXiv:2004.03021` · FPL 2020 | FPGA LUTs में संकलित विरल क्वांटाइज़्ड तंत्रिका परतें। | FPGA LUT और Fmax संश्लेषण। | स्थिर तारों को विस्थापन पर Vivado पुनः-PAR चाहिए, जबकि यहाँ `1`-चक्र Beneš + `RAMB36E2` है। |
| **DiffLogic** (Petersen et al., 2022) व **DWN** (Bacellar et al., 2024) | `arXiv:2210.08277` · `arXiv:2410.11112` | अवकलनीय बूलियन गेट और भारहीन LUT नेटवर्क। | गेट गणनाएँ और सटीकता। | VLAN विस्थापन पर स्थिर रूटिंग `52.34%` पर गिर जाती है और सीमांत बिट-प्लेन काइमेरा से ग्रस्त होती है। |
| **T-MAC** (Wei et al., 2024) व **TeLLMe** (Qiao et al., 2025) | `arXiv:2407.00088` · `arXiv:2504.16266` | CPU/FPGA पर तालिका लुकअप द्वारा त्रिआधारी / न्यून-बिट आव्यूह गुणन। | विलंबता और FPGA शक्ति। | मॉडल गियर के भीतर रैखिक बीजगणित को त्वरित करता है; मॉडल कॉल को बायपास नहीं करता। |
| **FrugalGPT** (Chen et al., 2023) व **RouteLLM** (Ong et al., 2024) | `arXiv:2305.05176` · `arXiv:2406.18665` | दुर्बल-से-प्रबल LLM कैस्केड और वरीयता राउटर। | API डॉलर मूल्य बनाम गुणवत्ता। | केवल मॉडल-से-मॉडल रूटिंग; कोई `LUT6` लुकअप तल या अधोमुखी संकलन नहीं। |
| **GreenServ** (2026) व **VoltanaLLM** (2025) | `arXiv:2601.17551` · `arXiv:2509.04827` | बहु-LLM बैंडिट रूटिंग और आवृत्ति-स्केल्ड सर्विंग। | लेखकों के GPU Wh (`Zeus` / `pyNVML`)। | GPU सर्विंग का अनुकूलन करता है; यह संदर्भ वेक को `0`-FLOP `LUT6` पृष्ठों (`est_j`) में संकलित करता है। |
| **Medusa** (2024), **EAGLE-2** (2024), **HCSpec** (2026) | `arXiv:2401.10774` · `arXiv:2406.16858` · ACL 2026 | तंत्रिका MLP, ड्राफ़्ट-वृक्ष और कैस्केड सट्टा ड्राफ़्टर। | वॉल-क्लॉक गति-वृद्धि। | `0`-FLOP `uint64` `LUT6` पृष्ठों के विपरीत ड्राफ़्ट FLOPs और भार पठन माँगते हैं। |
| **PLD** (Saxena, 2023) व **REST** (He et al., 2024) | GitHub · `arXiv:2311.08252` | शून्य-FLOP प्रॉम्प्ट n-ग्राम और डेटास्टोर प्रत्यय-ट्राई ड्राफ़्टर। | विलंबता गति-वृद्धि (`0` FLOPs)। | `PLD` प्रॉम्प्ट-बाह्य टोकन चूक जाता है; `REST` `RAMB36E2` पृष्ठों के बजाय परिवर्ती ट्राई उपयोग करता है। |
| **AirLLM** (lyogavin, 2023) | मुक्त-स्रोत SSD स्ट्रीमर | कम RAM में परत-दर-परत SSD भार स्ट्रीमिंग। | सक्रिय RAM पदचिह्न। | शुद्ध `T=1` (`1.0 tok/sweep`) + KV स्पिल, जबकि `AirMoL` में `2.74×-2.86×` स्वीप कटौती है। |
| **मापित कमिट द्वार** व **RCE-JEPA** `[same house]` | `/papers/gates/` · `/papers/rce-jepa/` | कमिट द्वार (`11,428 pJ` KV260 `INA260` SOM पाठ्यांक), MoL $p_i/c_i$, और `RCE-JEPA`। | KV260 SOM `measured_j` + `est_j`। | समान-संस्थान आधार; यहाँ Beneš `LUT6` अधोमुखी संकलन और `AirMoL` द्वारा विस्तारित। |

---

<div id="6-limits-threats-to-validity-not-claimed-and-falsifiers" class="anchor-alias" aria-hidden="true"></div>

## 6. सीमाएँ, वैधता के लिए ख़तरे, अदावाकृत बिंदु और खंडन-कसौटियाँ

**आंतरिक और रचना वैधता।** एकसमान यादृच्छिक रव (नॉइज़) या प्रति-चरण प्रतिकूल परिवर्तनशीलता ($\Delta T = 1$) के अंतर्गत प्रस्ताव 1 शून्य अधोमुखी संकलन बचत देता है और प्रणाली `1.00 tok/sweep` पर लौट आती है। हानिरहित समानता (`100.0%`) किसी `350M` या `0.8B` आधार चेकपॉइंट की क्षमता सीमा को ऊपर उठाए बिना लक्ष्य मॉडल की लालची डिकोडिंग के साथ बिट-दर-बिट सहमति की गारंटी देती है।

**मापन वैधता और अदावाकृत बिंदु।** इस अध्ययन की प्रत्येक जूल संख्या एक विश्लेषणात्मक `est_j` अनुमान है (`measured_j = None`)। Yosys `0.71+` और Verilator `5.054` संरचनात्मक `xck26` नेटलिस्ट संश्लेषण और `CPI = 1` चक्र सिमुलेशन स्थापित करते हैं, न कि Vivado पोस्ट-PAR `250 MHz` टाइमिंग क्लोज़र और न ही भौतिक KV260 रेल वाट (`board_metered = false`)। सिलिकॉन ऊर्जा नेतृत्व, `ModelGenerated` आउटपुटों की `Deterministic` में पदोन्नति, और मापित `70B` रन (`air_mol_nvme_baselines.csv` केवल विश्लेषणात्मक `70B` प्रक्षेपण रिपोर्ट करता है) का कोई दावा नहीं किया गया है।

| ID | दावा | सटीक खंडन / मिथ्याकरण शर्त |
| :--- | :--- | :--- |
| **`LA-F1`** | `Claim LA-1` (`.pcap` + RTL) | `scripts/run_realworld_domain.py` `5,120` पैकेटों पर `100.0%` Verilator समानता में विफल हो या पैकेट-`2,500` के VLAN विस्थापन को चूक जाए। |
| **`LA-F2`** | `Claim LA-2` (बहुभाषी सूट) | Zig हॉट-लूप में `> 0` हीप बाइट आवंटित करे, Go `> 0 allocs/op` रिपोर्ट करे, या Julia Enzyme `1e-7` FD त्रुटि पार करे। |
| **`LA-F3`** | `Claim LA-3` (KV260 पृष्ठित RTL) | `scripts/verify_paged_bram_rtl.py` `117,120` LUTs, `144` `RAMB36E2`s, `0` `DSP48`s, या प्रति पृष्ठ स्विच `1` चक्र से अधिक ले। |
| **`LA-F4`** | `Claim LA-4` (कन्फ़ॉर्मल ACI) | `scripts/run_frontier_benchmarks.py` विस्थापित ट्रैफ़िक पर लक्ष्य मिथ्या जोखिम $\alpha = 0.02$ को पार करे या `Deterministic` की मुहर लगाए। |
| **`LA-F5`** | `Claim LA-5` (बाइट सट्टा डिकोडिंग) | `scripts/run_code_corpus_benchmark.py` `48` अनदेखे प्रॉम्प्टों पर लालची `Mamba3CodeLM` के विरुद्ध `< 100.0%` सटीक बाइट समानता दे। |
| **`LA-F6`** | `Claim LA-6` (`AirMoL` 14.3M) | `F_NOCACHE` के अंतर्गत `scripts/run_air_mol_benchmark.py` `100%` समानता में विफल हो या `AirLLM` 4-बिट `T=1` से अधिक NVMe बाइट पढ़े। |
| **`LA-F7`** | `Claim LA-7` (2026 HF `AirMoL`) | `scripts/run_hf_air_mol_pretrained.py` या `scripts/run_hf_qwen35_air_mol.py` लालची लक्ष्य मॉडल से $\ge 1$ BPE टोकन का विचलन दिखाए। |
| **`LA-F8`** | `Claim LA-8` (प्रतिगमन सूट) | `pytest -v`, `tests/` के `18` परीक्षण सूटों में से किसी एक में भी विफल हो। |

---

<div id="7-references" class="anchor-alias" aria-hidden="true"></div>

## 7. संदर्भ

<ol data-refs>
<li>Bacellar, A., et al. (2024). Differentiable Weightless Neural Networks. <em>arXiv:2410.11112</em>.</li>
<li>Beneš, V. E. (1965). <em>Mathematical Theory of Connecting Networks and Telephone Traffic</em>. Academic Press.</li>
<li>Cai, T., Li, Y., Geng, Z., Peng, H., Lee, J. D., Chen, D., and Dao, T. (2024). Medusa: Simple LLM Inference Acceleration Framework with Multiple Decoding Heads. <em>ICML 2024</em>, <em>arXiv:2401.10774</em>.</li>
<li>Chen, L., Zaharia, M., and Zou, J. (2023). FrugalGPT. <em>arXiv:2305.05176</em>.</li>
<li>Dao, T., and Gu, A. (2024). Transformers are SSMs: Generalized Models and Efficient Algorithms Through Structured State Space Duality. <em>ICML 2024</em>, <em>arXiv:2405.21060</em>.</li>
<li>Furao, S., and Hasegawa, O. (2006). An incremental network for on-line unsupervised classification and topology learning (SOINN). <em>Neural Networks</em>, 19(1):90-106.</li>
<li>Gibbs, I., and Candès, E. (2021). Adaptive Conformal Inference Under Distribution Shift. <em>NeurIPS 2021</em>, <em>arXiv:2106.00170</em>.</li>
<li>GreenServ (2026). Energy-Efficient Context-Aware Dynamic Routing for Multi-Model LLM Inference. <em>ICPE 2026</em>, <em>arXiv:2601.17551</em>.</li>
<li>HCSpec (2026). Two-Tier Horizontal Cascade Speculative Decoding. <em>ACL 2026</em>, <a href="https://doi.org/10.18653/v1/2026.acl-long.353">doi:10.18653/v1/2026.acl-long.353</a>.</li>
<li>He, Z., Zhong, Z., Cai, T., Lee, J. D., and He, D. (2024). REST: Retrieval-Based Speculative Decoding. <em>NAACL 2024</em>, <em>arXiv:2311.08252</em>.</li>
<li>Hein, M., Andriushchenko, M., and Bitterwolf, J. (2019). Why ReLU Networks Yield High-Confidence Predictions Far Away From the Training Data. <em>CVPR 2019</em>, <em>arXiv:1812.05720</em>.</li>
<li>Horowitz, M. (2014). Computing's Energy Problem (and What We Can Do About It). <em>IEEE ISSCC 2014</em>.</li>
<li>Lee, T. T. (1988). Nonblocking Copy Networks for Multicast Packet Switching. <em>IEEE JSAC</em>, 6(9):1455-1467.</li>
<li>Lei, J., G'Sell, M., Rinaldo, A., Tibshirani, R. J., and Wasserman, L. (2018). Distribution-Free Predictive Inference for Regression. <em>JASA</em>, 113(523):1094-1111.</li>
<li>Leviathan, Y., Kalman, M., and Matias, Y. (2023). Fast Inference from Transformers via Speculative Decoding. <em>ICML 2023</em>, <em>arXiv:2211.17192</em>.</li>
<li>Li, Y., Wei, F., Zhang, C., and Zhang, H. (2024). EAGLE-2: Faster Inference of Language Models with Dynamic Draft Trees. <em>EMNLP 2024</em>, <em>arXiv:2406.16858</em>.</li>
<li>Liquid AI (2026). <code>LiquidAI/LFM2.5-350M</code> Open-Weights Hybrid Model Card (March 2026). <a href="https://huggingface.co/LiquidAI/LFM2.5-350M">huggingface.co/LiquidAI/LFM2.5-350M</a>.</li>
<li>Liu, W., Wang, X., Owens, J., and Li, Y. (2020). Energy-based Out-of-distribution Detection. <em>NeurIPS 2020</em>, <em>arXiv:2010.03759</em>.</li>
<li>lyogavin (2023). AirLLM: Layer-wise LLM Inference on Memory-Constrained Hardware. <a href="https://github.com/lyogavin/airllm">github.com/lyogavin/airllm</a>.</li>
<li>Ong, I., et al. (2024). RouteLLM: Learning to Route LLMs with Preference Data. <em>ICLR 2025</em>, <em>arXiv:2406.18665</em>.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; RCE-JEPA; RCE Compile. <a href="https://research.openie.dev/">research.openie.dev</a> <code>[same house]</code>.</li>
<li>Petersen, F., Borgelt, C., Kuehne, H., and Deussen, O. (2022). Deep Differentiable Logic Gate Networks. <em>NeurIPS 2022</em>, <em>arXiv:2210.08277</em>.</li>
<li>Qiao, Y., et al. (2025). TeLLMe: An Energy-Efficient Ternary LLM Accelerator on Edge FPGAs. <em>arXiv:2504.16266</em>.</li>
<li>Qwen Team (2026). <code>Qwen/Qwen3.5-0.8B-Base</code> Hybrid Gated DeltaNet + Attention Model Card (February 2026). <a href="https://huggingface.co/Qwen/Qwen3.5-0.8B-Base">huggingface.co/Qwen/Qwen3.5-0.8B-Base</a>.</li>
<li>Saxena, A. (2023). Prompt Lookup Decoding. <a href="https://github.com/apoorvumang/prompt-lookup-decoding">github.com/apoorvumang/prompt-lookup-decoding</a>.</li>
<li>Simon, H. A., and Kadane, J. B. (1975). Optimal Problem-Solving Search: All-or-None Solutions. <em>Artificial Intelligence</em>, 6(3):235-247.</li>
<li>Thompson, C. D. (1978). Generalized Connection Networks for Parallel Processor Intercommunication. <em>IEEE Trans. Comput.</em>, C-27(12):1119-1125.</li>
<li>Umuroglu, Y., Akhauri, Y., Fraser, N. J., and Blott, M. (2020). LogicNets. <em>FPL 2020</em>, <em>arXiv:2004.03021</em>.</li>
<li>VoltanaLLM (2025). Energy-Efficient and SLO-Aware Disaggregated LLM Serving. <em>arXiv:2509.04827</em>.</li>
<li>Vovk, V., Gammerman, A., and Shafer, G. (2005). <em>Algorithmic Learning in a Random World</em>. Springer.</li>
<li>Waksman, A. (1968). A Permutation Network. <em>Journal of the ACM</em>, 15(1):159-163.</li>
<li>Wei, J., et al. (2024). T-MAC: CPU Renaissance via Table Lookup for Low-Bit LLM Deployment. <em>arXiv:2407.00088</em>.</li>
</ol>

---

<div id="appendix-a-reproducibility" class="anchor-alias" aria-hidden="true"></div>

## परिशिष्ट A. पुनरुत्पादनीयता

[openIE-dev/lut-adapt-ai](https://github.com/openIE-dev/lut-adapt-ai) (`commit a5e9bc1`) के चेकआउट से:

```bash
PYTHONPATH=src .venv/bin/pytest -v
PYTHONPATH=src .venv/bin/python scripts/run_collapse_curve.py
PYTHONPATH=src .venv/bin/python scripts/run_realworld_domain.py
PYTHONPATH=src .venv/bin/python scripts/run_frontier_benchmarks.py
PYTHONPATH=src .venv/bin/python scripts/verify_paged_bram_rtl.py
PYTHONPATH=src .venv/bin/python scripts/run_code_corpus_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_air_mol_benchmark.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_air_mol_pretrained.py
PYTHONPATH=src .venv/bin/python scripts/run_hf_qwen35_air_mol.py
```
