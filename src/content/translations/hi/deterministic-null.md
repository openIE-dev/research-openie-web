---
title: "नियतात्मक शून्य: न्यूरल और एजेंटिक आधारों के लिए एक पूर्व-पंजीकृत नियंत्रण प्रयोग"
deck: "बिना किसी मॉडल कॉल वाला 64-बिट पूर्णांक केस लूप (Shape D: कठोर N0 और dev-क्रिस्टलीकृत N1), जिसे Rust, Go, Python, C++20 और Julia में कार्यान्वित किया गया है, League of Entropy के drand यादृच्छिकता चक्रों से पूर्व OpenTimestamps Bitcoin Calendar प्रमाणों द्वारा लॉक किया गया है, तथा 4,030 अलग रखे गए उदाहरणों और 6 बहु-फ़ाइल रिपॉज़िटरी पर अग्रणी क्लाउड और स्थानीय खुले-भार वाले भाषा मॉडलों से तुलना की गई है। Apple Silicon के ऑन-चिप IOReport और कर्नेल rusage काउंटर reported_j के रूप में दर्ज किए गए हैं; कोई बाहरी दीवार-सॉकेट या रेल जूल मीटर संलग्न नहीं था (board_metered का मान false है; measured_j अनिर्धारित है)।"
lang: "hi"
source: "deterministic-null"
complete: true
---

<div id="deterministic-null-a-pre-registered-control-experiment-for-neural-and-agentic-substrates" class="anchor-alias" aria-hidden="true"></div>

*संशोधन 7eb0ad5, 22 नवंबर 2026। डेटा और डाइजेस्ट सारांश: [/data/#deterministic-null](/data/#deterministic-null)। इंटरैक्टिव जीवंत चित्र: [/living/deterministic-null/](/living/deterministic-null/)। LaTeX अभिलेखीय प्रतिरूप: [/pdfs/latex/deterministic-null.pdf](/pdfs/latex/deterministic-null.pdf) ([स्रोत](/pdfs/latex/deterministic-null.tex))।*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. अवलोकन

एजेंटिक कृत्रिम बुद्धिमत्ता के अनुभवजन्य मूल्यांकन प्रायः एक प्रसंभाव्य भाषा मॉडल की तुलना दूसरे से करते हैं, जिससे यह बिना मापे रह जाता है कि कार्य-पूर्णता के कितने भाग के लिए निर्णय के समय वास्तव में न्यूरल आधार आवश्यक है, न कि सत्यापित पूर्व प्रकरणों के स्पष्ट भंडार पर चलने वाली एक स्थिर पूर्णांक प्रक्रिया। यह अध्ययन उसी अनुपस्थित नियंत्रण आधार, **नियतात्मक शून्य (`Shape D`)**, का निर्माण, स्थिरीकरण और लेखा-परीक्षण करता है, तथा दो क्रिप्टोग्राफ़िक रूप से पूर्व-पंजीकृत पुष्टिकारक प्रयोगों (कुल `4,030` बीकन-पश्चात अलग रखे गए उदाहरण) और एक बहु-चरणीय रिपॉज़िटरी बग-मरम्मत अध्ययन (`6` बहु-फ़ाइल Python रिपॉज़िटरी) पर प्रति-वर्ग शून्य परिकल्पना $H_{0,k}: \Delta_k = p_{\text{model},k} - p_{\text{null},k} \le \delta$ का $\delta = 0.05$ (`5.0` प्रतिशत अंक) के अंतराल पर परीक्षण करता है। स्थानीय Apple M5 Max ऊर्जा काउंटर (`IOReport` और `proc_pid_rusage`) ऑपरेटिंग-सिस्टम तथा ऑन-चिप `reported_j` मानों के रूप में दर्ज किए गए हैं; बंद मॉडलों के दूरस्थ सर्वरों की ऊर्जा कठोरता से `not_available` के रूप में दर्ज की गई है; और कोई भौतिक हार्डवेयर रेल या दीवार-प्लग शक्ति मापक संलग्न नहीं था (`board_metered = false`, `measured_j = None`)।

**सरल शब्दों में**

1. अधिकांश एजेंट बेंचमार्क मॉडल A की तुलना मॉडल B से करते हैं, बिना यह पूछे कि सत्यापित पूर्व उदाहरणों पर बिना मॉडल कॉल वाला एक खोजी लूप पहले से ही कितना कार्य हल कर देता है।
2. परिबद्ध बीजीय, औपचारिक-प्रमाण और संरचित लेनदेन परिवारों से लिए गए `2,840` उदाहरणों (`exp-001`, Track-A) में, एक स्थिर पूर्णांक केस तालिका (निर्णय के समय `0` मॉडल कॉल) `10` में से `9` वर्ग-स्तर प्रकोष्ठों में अग्रणी क्लाउड मॉडलों की बराबरी करती है और केवल `12` असूचीबद्ध मुक्त-पाठ ग्राहक मुहावरों पर पीछे रहती है (`Claude Opus 5.5` के पक्ष में `+36.40` प्रतिशत अंक)।
3. बाहरी रूप से निर्मित सार्वजनिक बेंचमार्कों (`exp-002`, Track-B: Berkeley Function-Calling Leaderboard `v3`, Sierra `tau-bench` Retail, `BigCodeBench v0.1.3` और `SWE` (सॉफ़्टवेयर-इंजीनियरिंग)-bench Verified) के `1,190` अद्वितीय उदाहरणों तथा `6` अनदेखी बहु-फ़ाइल रिपॉज़िटरी में, जहाँ भी अनदेखे कुंजी द्रव्यमान का अनुपात उच्च रहता है वहाँ न्यूरल संश्लेषण `+52.80` से `+95.00` प्रतिशत अंक जोड़ता है; किंतु कला-संक्रमण वाले अद्वितीय त्रि-संतोषणीयता (`3-satisfiability`) सूत्रों पर एकल-चरण भाषा मॉडल ढह जाते हैं (`0.0%-5.2%`) और परिबद्ध पूर्णांक तालिका (`69.6%`) तथा उपवाक्य-प्रमाण जाँच सहित स्वतंत्र संघर्ष-संचालित उपवाक्य अधिगम (`100.0%`) दोनों से नीचे रह जाते हैं, जबकि आवर्ती Zipf धाराओं के अंतर्गत ऑनलाइन क्रिस्टलीकरण कार्य-पूर्णता खोए बिना मॉडल कॉल और ऊर्जा दोनों में `3.59×` की कटौती करता है।

<div id="1-terms-acronyms-and-measurement-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. शब्दावली, संक्षिप्ताक्षर और मापन लेबल

<ul id="terms">
<li>AI, ML, LLM, LLMs, MoE, E4B, A3B: कृत्रिम बुद्धिमत्ता, मशीन अधिगम, विशाल भाषा मॉडल, विशेषज्ञों का मिश्रण (Mixture-of-Experts), प्रभावी 4-अरब-पैरामीटर स्थापत्य और सक्रिय 3-अरब-पैरामीटर रूटिंग</li>
<li>OBSERVE, REDUCE, FUZZ, LOOKUP, ACT, VERIFY, MUTATE, WRITE: नियतात्मक शून्य पूर्णांक निर्णय लूप के आठ क्रमिक चरण</li>
<li>SATB, SUT, SUTs, PFRK, TH2, DOSSIER: Satiation Benchmark हार्नेस अनुबंध, परीक्षणाधीन प्रणाली (प्रणालियाँ), चार-मार्गी प्रयास परिणाम (उत्तीर्ण, विफल, अस्वीकार, समाप्त), रेड-टीम जोखिम 2 (क्रिया आदिमों के भीतर कोई छिपा हुआ सॉल्वर नहीं) और परियोजना का पूर्व-कला एवं रेड-टीम दस्तावेज़</li>
<li>DNULLMM1, FT, LCB: बाइनरी मेमोरी-मैप्ड भंडार अनुक्रमणिका प्रारूप, प्रति-वर्ग फलन तालिका और Hoeffding निचली विश्वास सीमा</li>
<li>DRAT, RUP, CDCL, CNF, SAT, UNSAT: Deletion Resolution Asymmetric Tautology, Reverse Unit Propagation, Conflict-Driven Clause Learning, संयोजी प्रसामान्य रूप (conjunctive normal form), संतोषणीय और असंतोषणीय</li>
<li>BV, AST, XOR, IEEE, UC: नियत-चौड़ाई मॉड्यूलर बिटवेक्टर, अमूर्त वाक्य-विन्यास वृक्ष, बिटवाइज़ अनन्य-OR, Institute of Electrical and Electronics Engineers (IEEE-754 फ़्लोटिंग-पॉइंट मानक) और University of California</li>
<li>BFCL, BCB, SWE, SQL, DB, SAVEPOINT: Berkeley Function-Calling Leaderboard, BigCodeBench, सॉफ़्टवेयर-इंजीनियरिंग बेंचमार्क उपसर्ग, Structured Query Language, संबंधपरक डेटाबेस और लेनदेन रोलबैक जाँच-बिंदु</li>
<li>API, CLI, MCP, HTTP, JSON, JSONL, UTF: एप्लिकेशन प्रोग्रामिंग इंटरफ़ेस, कमांड-लाइन इंटरफ़ेस, Model Context Protocol, Hypertext Transfer Protocol, JavaScript Object Notation, पंक्ति-विभाजित JSON और Unicode Transformation Format</li>
<li>POSIX, MMAP, SHA, OTS: Portable Operating System Interface, मेमोरी-मैप्ड फ़ाइल इनपुट/आउटपुट, Secure Hash Algorithm (SHA-256) और OpenTimestamps Bitcoin Calendar प्रमाण</li>
<li>BCa, CI, CIs, UCL: पूर्वाग्रह-संशोधित और त्वरित बूटस्ट्रैप, विश्वास अंतराल और Wilson ऊपरी विश्वास सीमा</li>
<li>CPU, GPU, ANE, SoC, PID, OS, RAM, DRAM, NVMe, PSU, AC: केंद्रीय प्रसंस्करण इकाई, ग्राफ़िक्स प्रसंस्करण इकाई, Apple Neural Engine, चिप-पर-प्रणाली, प्रक्रिया पहचानकर्ता, ऑपरेटिंग सिस्टम, यादृच्छिक-अभिगम स्मृति, गतिशील RAM, Non-Volatile Memory Express, बिजली आपूर्ति इकाई और प्रत्यावर्ती-धारा दीवार विद्युत</li>
<li>RAPL, NVML, KV, GGUF, RPM, RPD, USD, EDA: Intel Running Average Power Limit, NVIDIA Management Library, कुंजी-मान कैश, GPT-Generated Unified Format परिमाणित भार, प्रति मिनट अनुरोध, प्रति दिन अनुरोध, संयुक्त राज्य डॉलर और इलेक्ट्रॉनिक डिज़ाइन स्वचालन</li>
<li>RCE, MoL, WCA, JEPA, LUT6: Reality Code Engine [एक ही संस्था], Mixture of Limits (सीमाओं का मिश्रण) [एक ही संस्था], Wise Computer Automation [एक ही संस्था], Joint-Embedding Predictive Architecture और 6-इनपुट बूलीय लुक-अप तालिका</li>
</ul>

टेलीमेट्री स्तर L0 से L4 तक, इस अध्ययन की सभी तालिकाओं और चित्रों में चार मापन वर्ग कठोरता से अलग रखे गए हैं:

| मापन लेबल | इस अध्ययन में अर्थ |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | बिट-समान 64-बिट नियत-बिंदु भंडार डाइजेस्ट (`SHA-256`), OpenTimestamps `.ots` कैलेंडर प्रमाण, League of Entropy के `drand` बीकन चक्र, `satb-proxy` द्वारा पकड़े गए टोकन/कॉल गणनाएँ और दिनांकित API सूची-मूल्य डॉलर (`USD`)। |
| **`Reported (reported_j: L2 & L3 Counters)`** | बिना root अधिकार वाले Apple Silicon ऑन-चिप `IOReport` विंडो जूल (`macmon`, टेलीमेट्री स्तर `L2`, साझा-होस्ट लेबल `A2`) तथा macOS कर्नेल प्रति-PID `proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` (`L3`, लेबल `D`)। यह भौतिक हार्डवेयर रेल मीटर नहीं है (`measured_j = None`, `board_metered = false`)। |
| **`Not Available (label N)`** | बंद-API दूरस्थ सर्वर ऊर्जा (`Claude Opus 5.5`, `Claude Sonnet 5.5`, `Gemini 2.5 Flash`) और `L0` प्रत्यावर्ती-धारा दीवार-प्लग ऊर्जा। रसीदों में बेड़े के माध्यकों या साहित्य के गुणकों को कभी प्रतिस्थापित नहीं किया जाता। |
| **`Invalidated Derived (Falsifier 6)`** | जब भी साझा होस्ट पर सह-चलित प्रक्रियाएँ टेलीमेट्री स्तर L0 से L4 के बीच पूर्व/पश्चात निष्क्रिय आधार-रेखा में `> 5.0%` का विचलन उत्पन्न करती हैं, तो निष्क्रिय-से-ऊपर शुद्ध घटाव (`derived_marginal_j`) स्वतः हटा दिया जाता है, जबकि कच्चे `reported_j` काउंटर अक्षुण्ण रखे जाते हैं। |

<div id="11-lineage-prior-art-boundaries-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 वंश-परंपरा, पूर्व-कला की सीमाएँ और एक ही संस्था का प्रकटीकरण

स्वयं निर्णय लूप के लिए किसी नवीनता का दावा नहीं किया गया है। प्रकरण-आधारित पुनर्प्राप्ति-पुनःउपयोग-संशोधन-धारण चक्र Stanfill और Waltz (1986) तथा Aamodt और Plaza (1994) से चले आ रहे हैं; सारणीबद्ध दंड-संतुलन Michie और Chambers (1968) से; फ़ज़ी नियम तालिकाएँ Mamdani और Assilian (1975) तथा Wang और Mendel (1992) से; और `RUP/DRAT` द्वारा संतोषणीयता प्रमाण लॉगिंग Goldberg और Novikov (2003) तथा Wetzler, Heule और Hunt (2014) से स्थापित हैं। Open Interface Engineering की पूर्व कृतियाँ ([मापित कमिट द्वार](/papers/gates/), [कार्य-तृप्ति बनाम समग्र रिबाउंड](/papers/satiation/), [Reality Code Engine](/papers/rce/) और [नीचे की ओर LUT6 संकलन](/papers/lut-adapt/)) `[same house]` सहचर अध्ययन हैं जिन्हें केवल स्थापत्य संदर्भ हेतु उद्धृत किया गया है, स्वतंत्र पुष्टि के रूप में कभी नहीं।

69 स्रोतों के पूर्व-कला लेखा-परीक्षण और 36 निष्कर्षों वाली रेड-टीम समीक्षा (`docs/DOSSIER.md`) ने 2024-2026 के एजेंट मूल्यांकन साहित्य में एक स्पष्ट अंतराल चिह्नित किया: मौजूदा एजेंट बेंचमार्क लगभग पूरी तरह गैर-न्यूरल नियंत्रणों को छोड़ देते हैं, मौजूदा गैर-न्यूरल आधार-रेखाओं में अलग रखे गए भंडारों का पूर्व-पंजीकृत स्थिरीकरण नहीं होता, और भाषा-मॉडल एजेंटों के मौजूदा ऊर्जा अध्ययनों में उसी होस्ट पर बिना मॉडल कॉल वाली कोई नियंत्रण भुजा शामिल नहीं होती।

<figure class="my-8">
  <img src="/figures/deterministic-null/dnull-control-protocol.svg" alt="चार-चरणीय नियतात्मक शून्य पूर्व-बीकन लॉक और युग्मित मूल्यांकन प्रोटोकॉल।" />
  <figcaption>Figure 1. पूर्व-बीकन पंजीकरण (<code>Gate G1</code> + OpenTimestamps + <code>drand</code>) तथा <code>Shape D</code> (<code>N0</code>, <code>N1</code>) और न्यूरल आधारों (<code>B3</code>, <code>B6</code>, <code>Shape H</code>) के बीच युग्मित मूल्यांकन प्रोटोकॉल। यह प्रोटोकॉल आरेख है, हार्डवेयर रेल पठन नहीं।</figcaption>
</figure>

---

<div id="2-machine-specification-arms-and-five-language-conformance" class="anchor-alias" aria-hidden="true"></div>

## 2. मशीन विनिर्देश, प्रायोगिक भुजाएँ और पाँच-भाषा अनुरूपता

<div id="21-the-eight-step-integer-loop-and-complexity-caps" class="anchor-alias" aria-hidden="true"></div>

### 2.1 आठ-चरणीय पूर्णांक लूप और जटिलता सीमाएँ

प्रत्येक `Shape D` शून्य भुजा आठ-चरणीय 64-बिट चिह्नित पूर्णांक लूप चलाती है (`Q = 1,000,000` नियत-बिंदु मापन, शून्य IEEE-754 फ़्लोटिंग-पॉइंट अनुदेश, निर्णय के समय शून्य न्यूरल कॉल):

$$\texttt{OBSERVE} \;\to\; \texttt{REDUCE} \;\to\; \texttt{FUZZ} \;\to\; \texttt{LOOKUP} \;\to\; \texttt{ACT} \;\to\; \texttt{VERIFY} \;\to\; \texttt{MUTATE} \;\to\; \texttt{WRITE}.$$

`dev` निर्माण के दौरान, `WRITE` सत्यापित अभिलेखों (`src` पर `lit:`, `human:`, `mut:` या `llm:` अंकित) को एक मानक `JSONL` लॉग में जोड़ता है और शून्य-प्रतिलिपि `POSIX mmap` खुली-संबोधन बाइनरी हैश तालिका (`DNULLMM1`: 64-बाइट शीर्षिका तथा 48-बाइट स्लॉट) संकलित करता है। `test` मूल्यांकन से पहले भंडार को `SHA-256` डाइजेस्ट द्वारा केवल-पठन रूप में स्थिर कर दिया जाता है; `VERIFY`, `MUTATE` और `WRITE` परीक्षण समय पर शून्य अद्यतन करते हैं, तथा पूर्व और पश्चात भंडार डाइजेस्ट का बाइट-समान होना सत्यापित किया जाता है। प्रति-वर्ग कोड के भीतर किसी सामान्य सॉल्वर की गुप्त घुसपैठ रोकने के लिए (`TH2`), प्रत्येक वर्ग की फलन तालिका (`REDUCE` + `ACT`) प्रति कॉल `<= 4,096` gzip-संपीड़ित बाइट और `<= 50,000` आदिम संक्रियाओं तक सीमित है (`S-3`), और किसी भी सीखे हुए प्राकृतिक-भाषा रिड्यूसर की अनुमति नहीं है (`S-4`)।

<div id="22-operational-permutations-under-comparison" class="anchor-alias" aria-hidden="true"></div>

### 2.2 तुलना के अंतर्गत परिचालन क्रमचय

| भुजा | परिभाषा | निर्णय-समय LLM कॉल | निर्माण उद्गम |
| :--- | :--- | :--- | :--- |
| **`B0` (आधार-तल)** | बिना शर्त वर्ग की डिफ़ॉल्ट क्रिया उत्सर्जित करता है; $> 2\delta$ (`10.0` प्रतिशत अंक) परीक्षण-समय परख-संवेदनशीलता द्वार लागू करता है। | `0` | कोई नहीं |
| **`B1` (शास्त्रीय)** | प्रकरण भंडार के बिना स्वतंत्र निगमनात्मक सॉल्वर (`CDCL+DRAT`, ट्रेस-नलस्पेस Houdini, परिमेय Buchberger Gröbner)। | `0` | शास्त्रीय एल्गोरिथ्म |
| **`B2` (केवल बीज)** | साहित्य-बीजित भंडार जिसमें `dev` उत्परिवर्तन निष्क्रिय है। | `0` | केवल `lit:` |
| **`N0` (कठोर शून्य)** | `dev` पर बिना किसी मॉडल-जनित अभिलेख, सुधार या प्रति-वर्ग कोड के भरा गया स्थिर पूर्णांक लूप (`0` `llm:` उद्गम प्रविष्टियाँ)। | `0` | `lit:`, `human:`, `mut:` |
| **`N1` (प्राथमिक शून्य)** | किसी भी उद्गम की सत्यापित प्रविष्टियों को स्वीकार करते हुए `dev` पर भरा गया स्थिर पूर्णांक लूप, जिसमें सभी `dev` मॉडल कॉल $C_{N1}$ पर भारित हैं। | `0` | कोई भी सत्यापित (`C_N1` भारित) |
| **`B5` (`code-once`)** | अग्रणी LLM `dev` विनिर्देशों से एक बार नियतात्मक Python नीति लिखता है; `test_seed` बनने से पहले स्थिर। | `0` | `1` `dev` LLM कॉल / वर्ग |
| **`B3` (अग्रणी क्लाउड)** | प्रति-उदाहरण क्लाउड मॉडल मूल्यांकन (`Claude Opus 5.5` प्राथमिक, `Claude Sonnet 5.5` द्वितीयक, `Gemini 2.5 Flash` प्रोब)। | `>= 1` / उदाहरण | पूर्व-प्रशिक्षित क्लाउड API |
| **`B6` (स्थानीय खुले-भार)** | उसी होस्ट पर स्थानीय इन्फ़रेंस (Apple M5 Max Metal GPU पर `llama-server` के माध्यम से `Alibaba Qwen 3.6 35B-A3B` और `Google Gemma 4 E4B-it`)। | `>= 1` / उदाहरण | स्थानीय `reported_j` |
| **`Shape H` (हार्नेस बॉक्स)** | `/work` के भीतर बाहरी `Claude Code 2.1.330` CLI, `--strict-mcp-config` सहित 100% `satb-proxy` से होकर संचालित। | बहु-चरणीय | `Lane B` तल की जाँच (खंडन कसौटी 8) |

<div id="23-gate-g2-five-language-conformance-and-positive-controls" class="anchor-alias" aria-hidden="true"></div>

### 2.3 Gate G2 पाँच-भाषा अनुरूपता और धनात्मक नियंत्रण

`/usr/bin/bc` और `openssl` से उत्पन्न स्वतंत्र स्वर्ण सदिश पाँच भाषाओं में बिट-सटीक सहमति (`Gate G2`) सत्यापित करते हैं, साथ ही तीन पृथक धनात्मक नियंत्रण (`ctl.setpoint`: `B0 = 0.110 -> N0 = 1.000`; `ctl.mamdani`: `B0 = 0.525 -> N0 = 1.000`; `ctl.cartpole`: `B0 = 0.000 -> N0 = 0.805`, जिन्हें एजेंटों संबंधी सभी कथनों से बाहर रखा गया है):

| कार्यान्वयन | स्थिर भंडार `SHA-256` डाइजेस्ट | `1M`-अभिलेख `DNULLMM1` माउंट | माध्य प्रोब विलंबता | `10k`-प्रोब चेकसम |
| :--- | :--- | ---: | ---: | ---: |
| **Rust** (संदर्भ + `SATB`) | `0da4df8d9ccbce1e...4485781` | `44.67 µs` | `582.57 ns` | `15027705736` |
| **C++20** (`clang++ -O3`) | `0da4df8d9ccbce1e...4485781` | `41.58 µs` | `388.43 ns` | `15027705736` |
| **Go `1.25`** | `0da4df8d9ccbce1e...4485781` | `60.63 µs` | `417.05 ns` | `15027705736` |
| **Julia `1.12`** | `0da4df8d9ccbce1e...4485781` | `125.92 µs` | `350.07 ns` | `15027705736` |
| **Python `3.13`** (`mmap`) | `0da4df8d9ccbce1e...4485781` | `8,655.58 µs` | `633.87 ns` | `15027705736` |

---

<div id="3-confirmatory-experiment-1-exp-001-track-a-bounded-template-stratum" class="anchor-alias" aria-hidden="true"></div>

## 3. पुष्टिकारक प्रयोग 1 (`exp-001`, Track-A परिबद्ध टेम्पलेट स्तर)

<div id="31-pre-beacon-registration-reg-exp-001" class="anchor-alias" aria-hidden="true"></div>

### 3.1 पूर्व-बीकन पंजीकरण (`reg-exp-001`)

पाँच वर्गों (`m = 5`: `formal.bv_superopt`, `formal.hoare_inv`, `formal.poly_ideal`, `formal.open_drat_synth` और `tool.tau2_sqlite`) को $J = 5$ `dev` एपिसोड क्रमचयों में भरा गया (सभी औपचारिक भरण प्रयासों में कुल `966.2 J` `L2` `reported_j`; `tool.tau2_sqlite` पर `N1` पर भारित `$0.00955` `Opus 5.5` `dev` लागत)। नमूना आकार (`n = [420, 250, 250, 250, 250] = 1,420` प्रति स्तर; कुल `2,840`) `99.0%` ($1 - 0.05/5$) बहुलता-समायोजित `10,000`-पुनःप्रतिचयन युग्मित `BCa` अंतरालों हेतु `90%` सांख्यिकीय शक्ति पर निर्धारित किए गए। मेनिफ़ेस्ट `cffb564cd9ad...` और OpenTimestamps प्रमाण `suite/manifest.json.ots` (`172 B`) को लक्ष्य चक्र `6663734` (`test_seed_u64 = 5861262844585529273`) से कठोरता से पूर्व `drand` चक्र `6663731` पर `git tag reg-exp-001` (`e5007a4`) के अंतर्गत प्रतिबद्ध किया गया। सभी `750/750` प्रतिचयित प्रक्षेप-पथ स्वतंत्र `DRAT` और `SQLite SAVEPOINT` सत्यापक लेखा-परीक्षणों में उत्तीर्ण रहे (`0` दुरुपयोग)।

<div id="32-track-a-confirmatory-results-2840-instances" class="anchor-alias" aria-hidden="true"></div>

### 3.2 Track-A पुष्टिकारक परिणाम (`2,840` उदाहरण)

| स्तर और कार्य वर्ग | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Qwen36}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | `99.0%` BCa CI | `Qwen` `reported_j`/उत्तीर्ण | निर्णय ($\delta = +0.05$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | ---: | :--- |
| **स्तर 1** `formal.bv_superopt` | `420` | `0.000` | `1.000` | `1.000` | `0.998` | `0.836` | `-0.24 pts` | `[-1.43, +0.00]` | `14.17 J` | **प्रासंगिकता अपवर्जित** |
| **स्तर 1** `formal.hoare_inv` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.508` | `+0.00 pts` | `[+0.00, +0.00]` | `23.32 J` | **प्रासंगिकता अपवर्जित** |
| **स्तर 1** `formal.poly_ideal` | `250` | `0.348` | `1.000` | `1.000` | `0.996` | `1.000` | `-0.40 pts` | `[-2.80, +0.00]` | `7.26 J` | **प्रासंगिकता अपवर्जित** |
| **स्तर 1** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.352` | `+0.00 pts` | `[+0.00, +0.00]` | `69.00 J` | **प्रासंगिकता अपवर्जित** |
| **स्तर 1** `tool.tau2_sqlite` | `250` | `0.188` | `0.624` | `1.000` | `1.000` | `0.940` | `+0.00 pts` | `[+0.00, +0.00]` | `7.11 J` | **प्रासंगिकता अपवर्जित** |
| **स्तर 2** `formal.bv_superopt` (`16b`) | `420` | `0.000` | `1.000` | `1.000` | `0.983` | `1.000` | `-1.67 pts` | `[-3.81, -0.48]` | `7.87 J` | **प्रासंगिकता अपवर्जित** |
| **स्तर 2** `formal.hoare_inv` (`6b`) | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.600` | `+0.00 pts` | `[+0.00, +0.00]` | `16.41 J` | **प्रासंगिकता अपवर्जित** |
| **स्तर 2** `formal.poly_ideal` ($k\in[7,15]$) | `250` | `0.376` | `1.000` | `1.000` | `1.000` | `1.000` | `+0.00 pts` | `[+0.00, +0.00]` | `6.74 J` | **प्रासंगिकता अपवर्जित** |
| **स्तर 2** `formal.open_drat_synth` | `250` | `0.000` | `1.000` | `1.000` | `1.000` | `0.376` | `+0.00 pts` | `[+0.00, +0.00]` | `53.59 J` | **प्रासंगिकता अपवर्जित** |
| **स्तर 2** `tool.tau2_sqlite` (पुनर्कथन) | `250` | `0.224` | `0.516` | `0.636` | `1.000` | `0.916` | **`+36.40 pts`** | **`[+28.80, +44.80]`** | `7.15 J` | **प्रासंगिकता प्रदर्शित** (`12` अपूरित) |

**Track-A के दायरे का लेखा-परीक्षण।** यद्यपि `exp-001` ने मानकीकृत औपचारिक सत्यापन (`9/9` प्रकोष्ठ अपवर्जित, जिससे `$27.25` API व्यय या `31,619.9 J` स्थानीय `reported_j` की बचत हुई) को अनदेखे सतही पुनर्कथनों (स्तर 2 `tool.tau2_sqlite` पर `+36.40` अंक, `Qwen 3.6` पर प्रति अतिरिक्त उत्तीर्ण `23.38 J` की लागत) से स्पष्टतः अलग किया, तथापि निष्पादन-पश्चात लेखा-परीक्षण ने एक प्रमुख संरचनात्मक सीमा पहचानी: Track-A के जनित्र मॉड्यूलो-`6` से मॉड्यूलो-`12` टेम्पलेट परिवारों ($K_{\text{eff}} = 6\text{-}12$) से नमूने लेते थे, जिससे `120`-एपिसोड का `dev` बजट लक्षण प्रकोष्ठों को पूर्णतः तृप्त कर सका।

---

<div id="4-confirmatory-experiment-2-exp-002-track-b-external-public-benchmarks-keffn" class="anchor-alias" aria-hidden="true"></div>

## 4. पुष्टिकारक प्रयोग 2 (`exp-002`, Track-B बाहरी सार्वजनिक बेंचमार्क, $K_{\text{eff}} = n$)

<div id="41-course-corrected-unique-instance-design-and-registration-reg-exp-002" class="anchor-alias" aria-hidden="true"></div>

### 4.1 दिशा-संशोधित अद्वितीय-उदाहरण अभिकल्प और पंजीकरण (`reg-exp-002`)

कृत्रिम टेम्पलेट सूचियों के बिना `Shape D` का परीक्षण करने के लिए, Track-B (`exp-002`) ने चार बाहरी रूप से रचित सार्वजनिक बेंचमार्कों (`SHA-256`-पिनित अपस्ट्रीम कलाकृतियाँ) को संरचनात्मक रूप से अद्वितीय यादृच्छिक कला-संक्रमण `3-SAT` उदाहरणों (`12` चर, `50` उपवाक्य, उपवाक्य-से-चर अनुपात `4.17`) के साथ समाहित किया, जिससे `1,190` अद्वितीय अलग रखे गए `test` उदाहरण प्राप्त हुए ($K_{\text{eff}} = n = 1,190$):

1. **`formal.unique_3sat_drat` (`n = 250`)**: अद्वितीय `12`-चर, `50`-उपवाक्य वाले `3-CNF` सूत्र; `Shape D` बहुपदीय 1-स्तरीय विफल-अक्षर संचरण और `45`-फ़्लिप स्थानीय भ्रमण (`3,108 B` gzip-संपीड़ित FT) का उपयोग करता है, जबकि 2-निगरानी-अक्षर `RUP/DRAT` प्रमाण जाँच वाला स्वतंत्र `CDCL` शास्त्रीय `B1` के रूप में कार्य करता है।
2. **`external.bfcl_v3_live` (`1,292` पूल से `n = 250`)**: UC Berkeley Gorilla Function-Calling Leaderboard `v3` (उपयोगकर्ता-प्रदत्त `live_multiple` बहु-उपकरण स्कीमा, `irrelevance` विरति कार्यों के साथ अंतर्ग्रथित; `1,381 B` gzip-संपीड़ित FT)।
3. **`external.tau_bench_retail` (`635` पूल से `n = 220`)**: Sierra Research का `tau-bench` खुदरा नीति और संबंधपरक डेटाबेस उत्परिवर्तन सूट (`500` उपयोगकर्ता, `1,000` आदेश, `50` उत्पाद; `1,298 B` gzip-संपीड़ित FT)।
4. **`external.bigcodebench_exec` (`487` स्थानीय रूप से सत्यापित निष्पादनीय पूल से `n = 220`)**: `BigCodeBench v0.1.3` बहु-लाइब्रेरी Python कोडिंग विनिर्देश, जिनका मूल्यांकन पृथक `unittest` निष्पादन द्वारा किया गया (`286 B` gzip-संपीड़ित FT; पूल के `100%` कार्यों को मानक समाधान उत्तीर्ण करने और `return None` अस्वीकार करने हेतु ऑफ़लाइन सत्यापित किया गया)।
5. **`external.swebench_verified` (`500` पूल से `n = 250`)**: `princeton-nlp/SWE-bench_Verified` मानव-सत्यापित GitHub मुद्दे, जिनका मूल्यांकन `12`-विकल्पीय रिपॉज़िटरी `(file_path :: symbol)` दोष स्थान-निर्धारण पर किया गया (`718 B` gzip-संपीड़ित FT)।

मेनिफ़ेस्ट `5fe640f00298...` (`355` `Opus 5.5` `dev` कॉल = `$7.1902`, $C_{N1}$ पर भारित) और OpenTimestamps रसीद `suite_exp002/manifest.json.ots` (`207 B`) को लक्ष्य चक्र `6664089` (`test_seed_u64 = 9069507899917430179`) से कठोरता से पूर्व `drand` चक्र `6664086` पर `git tag reg-exp-002` (`d6bfae5`) के अंतर्गत प्रतिबद्ध किया गया। एक यांत्रिक हार्नेस संशोधन (`amendment_01_b6_slot_ctx.json`) ने `llama-server` के कुल संदर्भ को `-c 16384` (`4` स्लॉटों में बँटे `4,096` टोकन, जो `10k-13.7k` टोकन वाले `BFCL`/`tau-bench` स्कीमा पर `HTTP 400` लौटाता था) से बढ़ाकर `-c 81920` (प्रति स्लॉट `20,480` टोकन) किया, जबकि सभी स्थिर भंडार, प्रॉम्प्ट, सत्यापक, नमूना आकार और `drand` चक्र `6664089` अपरिवर्तित रहे। सभी `515/515` प्रतिचयित प्रक्षेप-पथ स्वतंत्र स्कोरर पुनःसत्यापन में उत्तीर्ण रहे (`0` दुरुपयोग)।

<div id="42-track-b-multi-vendor-confirmatory-results-1190-unique-instances" class="anchor-alias" aria-hidden="true"></div>

### 4.2 Track-B बहु-विक्रेता पुष्टिकारक परिणाम (`1,190` अद्वितीय उदाहरण)

सभी `1,190` `Shape D` (`N0`, `N1`), `B0` और `B1` (`CDCL+DRAT`) मूल्यांकन **`0.9213 s`** में पूर्ण हुए (`35.72 J` `L2` `reported_j`, `0.36 J` `GPU`, `2.58 J` `L3` `ri_energy_nj`, `6.57 × 10^9` अनुदेश, पूर्व/पश्चात निष्क्रिय विचलन `3.09% <= 5.0%`)।

| अद्वितीय-उदाहरण वर्ग | $n$ | $p_{B0}$ | $p_{N0}$ | $p_{N1}$ | $p_{\text{Opus}}$ | $p_{\text{Sonnet}}$ | $p_{\text{Qwen36}}$ | $p_{\text{Gemma4}}$ | $\hat{\Delta}(\text{Opus}-\text{N1})$ | `99.0%` BCa CI | निर्णय ($\delta = +0.05$) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | :---: | :--- |
| `formal.unique_3sat_drat` ($p_{B1}=1.000$) | `250` | `0.000` | **`0.696`** | **`0.696`** | `0.052` | `0.008` | `0.000` | `0.000` | **`-64.40 pts`** | `[-72.00, -56.00]` | **आकलन-अयोग्य** ($p_{\text{LLM}} < 2\delta$) |
| `external.bfcl_v3_live` | `250` | `0.180` | `0.200` | `0.228` | `0.828` | **`0.840`** | `0.804` | `0.720` | **`+60.00 pts`** | `[+51.20, +68.40]` | **प्रासंगिकता प्रदर्शित** (`28` अपूरित) |
| `external.tau_bench_retail` | `220` | `0.005` | `0.396` | `0.259` | **`0.864`** | `0.805` | `0.755` | `0.623` | **`+60.45 pts`** | `[+51.82, +68.64]` | **प्रासंगिकता प्रदर्शित** (`14` अपूरित) |
| `external.bigcodebench_exec` | `220` | `0.000` | `0.000` | `0.000` | **`0.950`** | `0.836` | `0.473` | `0.391` | **`+95.00 pts`** | `[+90.00, +97.73]` | **प्रासंगिकता प्रदर्शित** (`218` अपूरित) |
| `external.swebench_verified` | `250` | `0.096` | **`0.460`** | `0.456` | **`0.984`** | `0.952` | `0.900` | `0.812` | **`+52.80 pts`** | `[+44.40, +60.40]` | **प्रासंगिकता प्रदर्शित** (`4` अपूरित) |

*(AI Studio की `20 RPD` निःशुल्क सीमा के भीतर `Google Gemini 2.5 Flash` पर किए गए 15-कॉल लाइव क्लाउड प्रोब ने इसी क्रम में पाँचों वर्गों पर `0/3`, `3/3`, `2/3`, `1/3` और `3/3` दर्ज किया।)*

खंड 4.2 में तीन अनुभवजन्य निष्कर्ष प्रमुखता से उभरते हैं:

1. **निगमनात्मक संयोजी कगार (`formal.unique_3sat_drat`)**: जब औपचारिक संतोषणीयता से टेम्पलेट सूचियाँ हटा दी जाती हैं (`K_eff = 250` अद्वितीय कला-संक्रमण `3-CNF` सूत्र), तो एकल-चरण न्यूरल मॉडल लगभग पूरी तरह विफल हो जाते हैं (`Opus 5.5` `$13.55` पर `5.2%`, `Sonnet 5.5` `$8.17` पर `0.8%`, `Qwen 3.6` `7,588 J` पर `0.0%`, `Gemma 4` `4,698 J` पर `0.0%`), जबकि बिना मॉडल कॉल वाली बहुपदीय केस तालिका `69.6%` (`174/250`) हल करती है और स्वतंत्र शास्त्रीय `CDCL+DRAT` (`B1`) **`100.0%` (`250/250`)** हल करता है। चूँकि स्वयं `Opus 5.5` भी `B0` को $2\delta = 10.0$ प्रतिशत अंकों से पार नहीं कर पाया (`95%` `BCa` `[+2.80, +8.40]` अंक), इसलिए पूर्व-पंजीकृत निर्णय नियम प्रासंगिकता अपवर्जित (`"Relevance excluded"`) घोषित करने से रुकता है और इस प्रकोष्ठ को कठोरता से आकलन-अयोग्य (**`Not assessable`**) के रूप में वर्गीकृत करता है।
2. **वास्तविक न्यूरल बढ़त के साथ-साथ गैर-तुच्छ शून्य-मॉडल आधार-रेखाएँ**: शून्य न्यूरल पैरामीटर (`N0`) के साथ भी शाब्दिक और स्कीमा केस नियम `SWE-bench Verified` के `12`-विकल्पीय दोष स्थान-निर्धारण का **`46.0%`** (`9.6%` आधार-तल के विरुद्ध) तथा `tau-bench` खुदरा नीति उत्परिवर्तनों का **`39.6%`** (`0.5%` आधार-तल के विरुद्ध) हल करते हैं। `tau-bench` पर `N1` में लालची `dev` बाइग्राम निष्कर्षण वास्तव में शोरयुक्त ग्राहक शब्दावली पर अति-अनुरूपित हो गया (`N0` के `39.6%` की तुलना में `25.9%`), जो `N1` के साथ कठोर `N0` रिपोर्ट करने के महत्व की पुष्टि करता है (`S4`)। फिर भी, चारों सार्वजनिक बेंचमार्कों पर अग्रणी क्लाउड और स्थानीय खुले-भार वाले मॉडल बड़ी और सांख्यिकीय रूप से निर्णायक बढ़त प्रदान करते हैं (`N0` और `N1` दोनों के ऊपर `+46.82` से `+95.00` प्रतिशत अंक)।
3. **स्थानीय बढ़त की द्वि-चैनल `reported_j` लागत (`B6`)**: साझा Apple M5 Max होस्ट पर (जहाँ समवर्ती `yosys-abc` संश्लेषण ने `5` में से `4` बहु-मिनट विंडो में खंडन कसौटी 6 को सक्रिय किया, जिससे कच्चे `L2` `IOReport` और प्रति-PID `L3` `ri_energy_nj` काउंटरों को सुरक्षित रखते हुए `derived_marginal_j` स्पष्टतः अमान्य हो गया), `N1` से ऊपर `Qwen 3.6 35B-A3B` द्वारा पूर्ण किए गए प्रत्येक अतिरिक्त कार्य की लागत कच्चे `L2` `reported_j` में **`49.90 J`** (`SWE-bench`), **`70.33 J`** (`BFCL v3`), **`238.80 J`** (`BigCodeBench`) और **`407.12 J`** (`tau-bench` Retail) रही।

---

<div id="5-goodturing-unseen-mass-multi-turn-work-repair-and-online-crystallization" class="anchor-alias" aria-hidden="true"></div>

## 5. Good-Turing अनदेखा द्रव्यमान, बहु-चरणीय `/work` मरम्मत और ऑनलाइन क्रिस्टलीकरण

<figure class="my-8">
  <img src="/figures/deterministic-null/s3-good-turing-regimes.svg" alt="Good-Turing अनदेखे कुंजी द्रव्यमान N1(t)/t और Zipf ऑनलाइन क्रिस्टलीकरण द्वारा विभाजित दो शासन-क्षेत्र।" />
  <figcaption>Figure 2. Good-Turing अनदेखा कुंजी द्रव्यमान <em>N</em><sub>1</sub>(<em>t</em>) / <em>t</em> यह पूर्वानुमानित करता है कि स्थिर <code>Shape D</code> कहाँ तृप्त होता है बनाम कहाँ न्यूरल संश्लेषण या ऑनलाइन क्रिस्टलीकरण आवश्यक है (<code>measured_j = None</code>)।</figcaption>
</figure>

<div id="51-goodturing-unseen-mass-n1tt-across-the-five-track-b-streams" class="anchor-alias" aria-hidden="true"></div>

### 5.1 पाँचों Track-B धाराओं में Good-Turing अनदेखा द्रव्यमान ($N_1(t)/t$)

प्रत्येक `dev + cal` कार्य धारा $t = 1 \dots T$ के अनुदिश, Good-Turing एकल-आवृत्ति अनुपात $N_1(t)/t$ इस प्रायिकता का आकलन करता है कि अगली आने वाली कुंजी अनदेखी होगी:

| कार्य वर्ग (`dev + cal` धारा) | धारा लंबाई $T$ | स्थूल प्रकोष्ठ $N_1(T)/T$ | सूक्ष्म स्कीमा/उदाहरण $N_1(T)/T$ | अलग रखी गई `N0` / `N1` कार्य-पूर्णता |
| :--- | ---: | ---: | ---: | ---: |
| `formal.unique_3sat_drat` | `270` | `0.0000` | `1.0000` | `69.6%` / `69.6%` |
| `external.swebench_verified` | `250` | `0.0080` | `0.5960` | `46.0%` / `45.6%` |
| `external.tau_bench_retail` | `285` | `0.0035` | `0.6386` | `39.6%` / `25.9%` |
| `external.bfcl_v3_live` | `300` | `0.0233` | `0.4033` | `20.0%` / `22.8%` |
| `external.bigcodebench_exec` | `240` | **`0.9917`** | **`0.9917`** | **`0.0%` / `0.0%`** |

`BigCodeBench` `dev` पर `N1` द्वारा इकाई-परीक्षित `108` `Claude Opus 5.5` Python समाधानों को क्रिस्टलीकृत करने के बाद भी, $N_1(T)/T = 0.9917$ ने अनदेखे संयोजनात्मक कोडिंग विनिर्देशों पर लगभग शून्य कुंजी अतिव्यापन का पूर्वानुमान लगाया, जो अलग रखे गए `test` समुच्चय पर प्रेक्षित `0.0%` कार्य-पूर्णता (`218` अपूरित कुंजियाँ) से पूर्णतः मेल खाता है।

<div id="52-multi-turn-work-software-engineering-repair-6-multi-file-repositories" class="anchor-alias" aria-hidden="true"></div>

### 5.2 बहु-चरणीय `/work` सॉफ़्टवेयर-इंजीनियरिंग मरम्मत (`6` बहु-फ़ाइल रिपॉज़िटरी)

यह सत्यापित करने के लिए कि खंड 4 के एकल-चरण प्रॉम्प्टों ने बहु-चरणीय कोडिंग हार्नेस को बाधित या विकृत नहीं किया, छह बहु-फलन और बहु-फ़ाइल Python बग-सुधार रिपॉज़िटरी (`loader.py` + `schema.py` में विस्तृत `config-defaults`, `interval-merge`, `pagination`, `calc.py` + `lexer.py` में विस्तृत `precedence`, `window.py` + `limiter.py` में विस्तृत `rate-window` तथा `retry-backoff`) का मूल्यांकन पृथक `/work` सैंडबॉक्स (`max_turns = 10`) में किया गया, जहाँ `pytest -q` मूल्यांकन से पूर्व स्वच्छ अपस्ट्रीम प्रतियों से `test_*.py` को अधिलेखित किया गया:

| बहु-चरणीय `/work` हार्नेस लेन | उत्तीर्ण रिपॉज़िटरी | `SATB` `P/F/R/K` | मॉडल कॉल | उपकरण कॉल | API `USD` / स्थानीय `reported_j` |
| :--- | ---: | :---: | ---: | ---: | :--- |
| **`Shape D` शीत अनदेखा (`t = 1`)** | `0 / 6` (`0.0%`) | `0/6/0/0` | `0` | `0` | `$0.0000` / `< 1 J` |
| **`Lane B` (`Claude Opus 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `28` | `29` | `$0.3613` (`not_available`) |
| **`Lane B` (`Claude Sonnet 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `31` | `34` | `$0.2080` (`not_available`) |
| **`Shape H` (`Claude Code 2.1.330` + `Opus 5.5`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `30` | `MCP` | `$0.2646` (`not_available`; खंडन कसौटी 8 उत्तीर्ण) |
| **`Lane B` स्थानीय (`Qwen 3.6 35B-A3B`)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `42` | `42` | **`2,342.0 J`** `L2` (`390.3 J`/रिपॉज़िटरी) |
| **`Shape D` ऑनलाइन पुनरावृत्ति (`t = 2` धारा)** | **`6 / 6` (`100.0%`)** | `6/0/0/0` | `0` | `0` | `$0.0000` (सत्यापित पैच पुनरावृत्ति) |

<div id="53-online-crystallization-on-recurring-zipfian-traffic-bigcodebench" class="anchor-alias" aria-hidden="true"></div>

### 5.3 आवर्ती Zipf ट्रैफ़िक पर ऑनलाइन क्रिस्टलीकरण (`BigCodeBench`)

द्वितीयक ऑनलाइन ट्रैक पर (`BigCodeBench` के `220` अद्वितीय परीक्षण कार्यों पर Zipf-$0.85$ बंटन से निकाले गए `600` अनुरोध, जहाँ `Shape D` केवल अनदेखी कुंजी चूक होने पर `B3`/`B6` को बुलाता है और `unittest` उत्तीर्ण करने वाले समाधानों को कैश करता है), कार्य-पूर्णता शुद्ध प्रति-अनुरोध `Opus 5.5` (**`98.0%` बनाम `98.0%`**) के बराबर रहती है जबकि `155` सत्यापित फलन भंडार में क्रिस्टलीकृत हो जाते हैं; इससे संचयी LLM कॉल में **`72.17%` (`167` बनाम `600`)**, API व्यय में **`$7.33` से `$2.04` (`3.59×`)** और स्थानीय `Qwen 3.6` `reported_j` व्यय में **`67,729.6 J` से `18,851.4 J` (`3.59×`)** की कमी आती है।

---

<div id="6-limitations-falsifiers-and-unfinished-work" class="anchor-alias" aria-hidden="true"></div>

## 6. सीमाएँ, खंडन कसौटियाँ और अपूर्ण कार्य

1. **भौतिक रेल या प्रत्यावर्ती-धारा दीवार-प्लग शक्ति मापक का अभाव (`board_metered = false`, `measured_j = None`)**: इस अध्ययन के सभी ऊर्जा आँकड़े समवर्ती कार्य चला रहे होस्ट पर Apple Silicon के ऑन-चिप `IOReport` (`L2`) और कर्नेल `ri_energy_nj` (`L3`) `reported_j` काउंटर हैं; शांत किए गए लक्ष्य मशीन पर `L0` प्रत्यावर्ती-धारा दीवार-प्लग मापन (`Shelly`/`Yokogawa`, जो PSU, DRAM और NVMe हानियों को पकड़ते हैं) अभी शेष हैं।
2. **स्व-प्रशासित बेंचमार्क चयन बनाम बाहरी मानवीय तृतीय-पक्ष स्तर 3**: यद्यपि Track-B (`exp-002`) ने कृत्रिम टेम्पलेटों के स्थान पर `drand` चक्र `6664089` से पूर्व लॉक किए गए चार बाहरी सार्वजनिक बेंचमार्क अपनाए, तथापि किसी स्वतंत्र मानवीय तृतीय पक्ष द्वारा रचित और एस्क्रो में सीलबंद स्तर-3 बेंचमार्क अभी चलाया जाना शेष है।
3. **परिमित-बजट गैर-अनिवार्यता**: प्रत्येक प्रासंगिकता प्रदर्शित (`"Relevance shown"`) निर्णय कठोरता से घोषित `dev` नमूने (`100-150` उदाहरण) और `4,096 B` फलन-तालिका सीमा के सापेक्ष है; कोई अपूरित कुंजी उस बजट के भीतर अप्राप्त कवरेज दर्शाती है, किसी गैर-न्यूरल प्रक्रिया की गणितीय असंभवता कदापि नहीं।

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## संदर्भ

<ol data-refs>
<li>Aamodt, A., &amp; Plaza, E. (1994). Case-based reasoning: Foundational issues, methodological variations, and system approaches. <em>AI Communications</em>, 7(1), 39-59.</li>
<li>Efron, B. (1987). Better bootstrap confidence intervals. <em>Journal of the American Statistical Association</em>, 82(397), 171-185.</li>
<li>Goldberg, E., &amp; Novikov, Y. (2003). Verification of proofs of unsatisfiability for CNF formulas. <em>DATE 2003</em>, 886-891.</li>
<li>Good, I. J. (1953). The population frequencies of species and the estimation of population parameters. <em>Biometrika</em>, 40(3-4), 237-264.</li>
<li>Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., &amp; Narasimhan, K. (2024). SWE-bench: Can language models resolve real-world GitHub issues? <em>ICLR 2024</em>.</li>
<li>Mamdani, E. H., &amp; Assilian, S. (1975). An experiment in linguistic synthesis with a fuzzy logic controller. <em>International Journal of Man-Machine Studies</em>, 7(1), 1-13.</li>
<li>Michie, D., &amp; Chambers, R. A. (1968). BOXES: An experiment in adaptive control. <em>Machine Intelligence</em>, 2, 137-152.</li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; The Reality Code Engine; Downward LUT6 Compilation [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>Patil, S. G., Mao, H., Cheng-Jie Ji, C., Yan, F., Suresh, V., Stoica, I., &amp; Gonzalez, J. E. (2024). Gorilla: Large language model connected with massive APIs (Berkeley Function-Calling Leaderboard). <em>NeurIPS 2024</em>.</li>
<li>Simon, H. A., &amp; Kadane, J. B. (1975). Optimal problem-solving search: All-or-none solutions. <em>Artificial Intelligence</em>, 6(3), 235-247.</li>
<li>Stanfill, C., &amp; Waltz, D. (1986). Toward memory-based reasoning. <em>Communications of the ACM</em>, 29(12), 1213-1228.</li>
<li>Wang, L.-X., &amp; Mendel, J. M. (1992). Generating fuzzy rules by learning from examples. <em>IEEE Transactions on Systems, Man, and Cybernetics</em>, 22(6), 1414-1427.</li>
<li>Wetzler, N., Heule, M. J. H., &amp; Hunt, W. A. (2014). DRAT-trim: Efficient checking and trimming using expressive clausal proofs. <em>SAT 2014</em>, 422-429.</li>
<li>Yao, S., Shinn, N., Razavi, P., &amp; Narasimhan, K. (2024). tau-bench: A benchmark for tool-agent-user interaction in real-world domains. <em>arXiv:2406.12045</em>.</li>
<li>Zhuo, T. Y., Vu, M. C., Chim, J., Hu, H., Yu, W., Widyasari, R., et al. (2025). BigCodeBench: Benchmarking code generation with diverse function calls and complex instructions. <em>ICLR 2025</em>.</li>
</ol>
