---
title: "Satiation Benchmark: संदर्भ हार्नेस, एडाप्टर और टेलीमेट्री श्रेय-निर्धारण"
deck: "एक स्थिर अनुक्रमिक रस्ट संदर्भ हार्नेस (Lane B), एक एकल प्रॉक्सी-प्रवर्तित एडाप्टर ब्रिज (Shapes D, M, H, और I), एक बारह-जाँच अनुरूपता सूट (C1 से C12), और एक पाँच-स्तरीय मूलरहित टेलीमेट्री श्रेय-निर्धारण इंजन (L0 से L4 को A1 से N लेबलों के साथ क्रॉस किया गया)। चार हार्डवेयर आर्किटाइप्स पर अनुभोगतः सत्यापित: Apple M5 Max (arm64 macOS IOReport और proc_pid_rusage reported_j), NVIDIA Jetson AGX Thor (aarch64 Tegra Linux physical INA238 whole-board और INA3221 rail-separated shunt measured_j), Framework Desktop AMD Ryzen AI Max+ 395 Strix Halo (x86-64 Linux 0440 root:energy PLATYPUS-isolated RAPL reported_j plus amdgpu PPT), और Intel Core i9-13900H Raptor Lake (x86-64 Linux RAPL psys L1 और package-0 L2 reported_j)। कच्चे measured_j, reported_j, और L4 तार्किक चैनल सख्ती से अलग रखे जाते हैं और कभी भी जोड़े नहीं जाते; क्योंकि सह-किरायेदार कार्यभार साझा होस्टों पर चलाए गए थे (dedicated_host is false), A2 नेट प्लेसमेंट श्रेय-निर्धारण Falsifier 6 के अनुसार रोका गया है।"
lang: "hi"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*पुनरीक्षण af57f48, 22 नवंबर 2026. डेटा और डाइजेस्ट सारांश: [डेटा](/data/#satb-harness). इंटरैक्टिव जीवंत आकृतियाँ: [जीवंत आकृतियाँ](/living/satb-harness/). LaTeX अभिलेखीय संस्करण: [PDF](/pdfs/latex/satb-harness.pdf) ([स्रोत](/pdfs/latex/satb-harness.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. अवलोकन

जब दो एजेंट मूल्यांकन भिन्न कार्य-पूर्णता दर या भिन्न ऊर्जा आँकड़े रिपोर्ट करते हैं, तो अंतर प्रायः स्वयं मॉडल से नहीं, बल्कि इस बात से उत्पन्न होता है कि मॉडल को किस प्रकार लपेटा गया (wrap) और होस्ट काउंटरों का श्रेय किस प्रकार निर्धारित किया गया। केवल आसपास के हार्नेस को बदलने से `Terminal-Bench 2` पर `Gemini 2.5 Pro` का कार्य-समाधान `17` प्रतिशत अंक खिसक गया, जबकि किसी विचलित निष्क्रिय आधाररेखा (idle baseline) को घटाना या एक साझा सिलिकॉन रेल को प्रोसेसर समय के आधार पर विभाजित करना ऊर्जा-श्रेय निर्धारण को `30%` से अधिक विकृत कर सकता है।

यह अध्ययन **Satiation Benchmark (`SATB`)** मूल्यांकन संविदा (contract) को विनिर्दिष्ट और अनुभवजन्य रूप से सत्यापित करता है: एक निश्चित अनुक्रमिक Rust संदर्भ हार्नेस (**`Lane B`**), शून्य-मॉडल नियंत्रणों के लिए एक प्रॉक्सी-पृथक एडाप्टर सेतु (**`Shapes D, M, H, and I`**), कच्चे मॉडल एंडपॉइंट, बाह्य कमांड-लाइन हार्नेस और सार्वजनिक बेंचमार्क सॉल्वर, एक पाँच-खंडीय सिस्टम-अंडर-टेस्ट (`SUT`) क्रिप्टोग्राफ़िक फ़िंगरप्रिंट, बारह अनिवार्य अनुरूपता जाँचें, और एक पाँच-स्तरीय रूटलेस टेलीमेट्री इंजन। डिज़ाइन को बिना मापे छोड़ने के बजाय, हम **चार हार्डवेयर आर्कटाइप** में जीवंत अनुरूपता और फ़ॉल्सिफ़ायर बेंचमार्क चलाते हैं: एक `Apple M5 Max` वर्कस्टेशन (`128` गीगाबाइट यूनिफ़ाइड मेमोरी, `macOS 27.2.1`, ऑन-चिप `IOReport` और कर्नेल `proc_pid_rusage` `reported_j`), एक Tegra `aarch64` डेवलपर किट (`Jetson Thor`, `Linux 6.8.12-1021-tegra`, भौतिक Texas Instruments संपूर्ण-बोर्ड और तीन-चैनल रेल-पृथक करंट-शंट `measured_j`), एक `Framework` Desktop `Strix Halo` वर्कस्टेशन (`Ryzen Max+ 395`, `Linux 7.0.0-43-generic x86-64`, `0440 root:energy` समूह-पृथक पैकेज-ऊर्जा `reported_j` के साथ `amdgpu` पैकेज-पावर ट्रैकिंग), और एक `Raptor Lake` वर्कस्टेशन (`Intel Core i9-13900H`, `Linux 7.0.0-43-generic x86-64`, प्लेटफ़ॉर्म और पैकेज ऊर्जा `reported_j`), जबकि बंद क्लाउड सर्वर ऊर्जा को कठोर रूप से `not_available` चिह्नित किया गया है।

**सरल शब्दों में**

1. एजेंट के प्रॉम्प्ट लूप, संदर्भ-छँटाई नियम, और टूल सैंडबॉक्स बेंचमार्क स्कोर को मूल मॉडल को बदलने जितना ही प्रभावित कर सकते हैं, इसलिए `Lane B` वह रैपर पूर्णतः निर्धारक रस्ट में स्थिर रखता है जबकि `Lane O` बाहरी रैपर्स को एक ऑडिटेड प्रॉक्सी प्लग के माध्यम से लागू करता है।  
2. ऊर्जा चैनलों को उनके वास्तविक भौतिक सीमा, पूरे वॉल प्लग, बोर्ड इनपुट, चिप पैकेज, ऑपरेटिंग-सिस्टम प्रक्रिया अनुमान, या तार्किक टोकन लेज़र पर कच्चे रूप में दर्ज किया जाता है, और उन्हें कभी भी एक बिना लेबल वाले एकल संख्या में मिश्रित नहीं किया जाता, न ही प्रमाण वर्गों (`measured_j` बनाम `reported_j` बनाम `est_j`) के बीच जोड़ते हैं, न ही फ़्लीट स्थिरता औसतों से पुनः-भरा जाता है।  
3. चार सिलिकॉन प्लेटफ़ॉर्म पर लाइव परीक्षण `Shape D` मिलियन-रिकॉर्ड मेमोरी-मैप्ड (`15027705736`) और `C9` पुनरावृत्ति (`149,747 B`, `0` बाइट अंतर) निर्धारकता को सत्यापित करते हैं, `0.87-9.54 ms` प्रक्रिया-वृक्ष समाप्ति सफ़ाई, क्लाउड `temperature = 0` गैर-निर्धारकता तीन विक्रेताओं में, हार्डवेयर सेंसर गति सीमा (`24.3-45.4 µs` `x86-64` काउंटर रीड `94-97 Hz` बनाम `2.95 ms` सीरियल-बस शंट रीड `66.6 Hz` `Jetson Thor` पर बनाम `~8 Hz` `macmon` `IOReport`), क्रमिक गणना-प्लस-संग्रह चरणों को प्रोसेसर समय से विभाजित करने पर `32.59%-72.89%` त्रुटि (`Falsifier 3`), तथा फिजिकल ग्राफ़िक्स-वर्सेज-प्रोसेसर शंट रेल विभाजन के साथ `Falsifier 6` साझा-होस्ट ड्रिफ्ट गेटिंग (`dedicated_host = false`).

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. शब्द, संक्षिप्तियां और श्रेय-निर्धारण लेबल

<ul id="terms">
<li>SATB, SUT, PFRK, OQ, SPEC, BUNDLE, SUBMIT, REFUSE, STOP: Satiation Benchmark हार्नेस और श्रेय-निर्धारण विनिर्देश, परीक्षण के अधीन प्रणाली (system under test), चार-प्रकारीय प्रयास परिणाम (सफल, विफल, अस्वीकार, समाप्त), हल किया गया विनिर्देश प्रश्न, मानक विनिर्देश दस्तावेज़, कार्य बंडल फ़ाइल, अंतिम उत्तर प्रस्तुति कॉल, अंतिम अस्वीकृति कॉल, और अनुक्रमिक लूप रोकने वाला टोकन</li>
<li>ACI, SWE, CLI, MCP, SDK, ACP, ARC, AGI, GUI: Agent-Computer Interface (एजेंट-कंप्यूटर इंटरफ़ेस), सॉफ़्टवेयर इंजीनियरिंग बेंचमार्क उपसर्ग, command-line interface (कमांड-लाइन इंटरफ़ेस), Model Context Protocol, software development kit (सॉफ़्टवेयर विकास किट), Agent Client Protocol, Abstraction and Reasoning Corpus, artificial general intelligence बेंचमार्क सूट, और graphical user interface (ग्राफ़िकल यूज़र इंटरफ़ेस)</li>
<li>IO, JSON, JSONL, RPC, JCS, UTF, HTTP, SSE, URL: input/output प्रोटोकॉल, JavaScript Object Notation, पंक्ति-सीमांकित JSON (line-delimited JSON), remote procedure call (दूरस्थ प्रक्रिया कॉल), JSON Canonicalization Scheme (RFC 8785), Unicode Transformation Format, Hypertext Transfer Protocol, Server-Sent Events, और Uniform Resource Locator</li>
<li>POSIX, MMAP, DNULLMM1, SHA, SIGKILL, ESRCH, EACCES, EOF: Portable Operating System Interface, memory-mapped file इंटरफ़ेस, बाइनरी memory-mapped Deterministic Null index प्रारूप, Secure Hash Algorithm (SHA-256), गैर-पकड़े जाने योग्य POSIX प्रक्रिया समाप्ति सिग्नल, कर्नल की "कोई ऐसी प्रक्रिया नहीं" स्थिति, POSIX अनुमति-अस्वीकृति त्रुटि स्थिति, और end-of-file heredoc सीमांकक</li>
<li>AI, ML, LLM, MLX, GGUF, KV, TP, ENERGY: कृत्रिम बुद्धिमत्ता, मशीन लर्निंग, बड़ा भाषा मॉडल (large language model), स्थानीय अनुमान के लिए Apple array फ़्रेमवर्क, GPT-Generated Unified Format क्वांटाइज़्ड वेट, की-वैल्यू कैश (key-value cache), टेंसर पैरेलेलिज़्म (tensor parallelism), और ML.ENERGY GPU पावर बेंचमार्क कंसोर्टियम</li>
<li>CPU, GPU, APU, ANE, SoC, ALU, ISA, IPC, PID, UID, GID, OS, VM, EC, GB: central processing unit (केंद्रीय प्रसंस्करण इकाई), graphics processing unit (ग्राफ़िक्स प्रसंस्करण इकाई), accelerated processing unit (त्वरित प्रसंस्करण इकाई), Apple Neural Engine, system-on-chip (सिस्टम-ऑन-चिप), arithmetic logic unit (अंकगणितीय तर्क इकाई), instruction set architecture (निर्देश सेट वास्तुकला), instructions per cycle (प्रति चक्र निर्देश), process identifier (प्रक्रिया पहचानकर्ता), user identifier (उपयोगकर्ता पहचानकर्ता), group identifier (समूह पहचानकर्ता), operating system (ऑपरेटिंग सिस्टम), virtual machine (आभासी मशीन), embedded controller (एम्बेडेड नियंत्रक), और gigabytes (गीगाबाइट)</li>
<li>RAM, DRAM, SLC, NVMe, PSU, PDU, AC, DC, DVFS, MSR, MMIO: random-access memory (रैंडम-एक्सेस मेमोरी), dynamic RAM (डायनामिक RAM), system-level cache (सिस्टम-स्तरीय कैश), Non-Volatile Memory Express, power supply unit (पावर सप्लाई यूनिट), power distribution unit (पावर वितरण इकाई), alternating current (प्रत्यावर्ती धारा), direct current (दिष्ट धारा), dynamic voltage and frequency scaling (गतिशील वोल्टेज और आवृत्ति स्केलिंग), model-specific register (मॉडल-विशिष्ट रजिस्टर), और memory-mapped input/output (मेमोरी-मैप्ड इनपुट/आउटपुट)</li>
<li>RAPL, NVML, PPT, TI, I2C, ADC, INA, INA238, INA3221, AGX, VDD, SOC, MSS, VIN, SYS, PLATYPUS: Intel/AMD Running Average Power Limit, NVIDIA Management Library, AMD Package Power Tracking, Texas Instruments, Inter-Integrated Circuit बस, analog-to-digital converter (एनालॉग-से-डिजिटल कनवर्टर), Texas Instruments धारा/शक्ति मॉनिटर परिवार (`INA238`, `INA3221`), NVIDIA Jetson AGX मॉड्यूल श्रेणी, drain supply voltage रेल, system-on-chip रेल, मेमोरी सबसिस्टम रेल, इनपुट सिस्टम वोल्टेज रेल, और Power Leakage Attacks: Targeting Your Processor Using Software</li>
<li>API, USD, CNCF, AISI, UK, AMD, NVIDIA: आवेदन प्रोग्रामिंग इंटरफ़ेस, संयुक्त राज्य डॉलर, क्लाउड नेटिव कंप्यूटिंग फाउंडेशन, एआई सुरक्षा संस्थान, यूनाइटेड किंगडम, एडवांस्ड माइक्रो डिवाइसेस, और NVIDIA कॉर्पोरेशन</li>
<li>RCE, MoL, WCA, LUT6: रियलिटी कोड इंजन [समान संस्थान], सीमाओं का मिश्रण [समान संस्थान], बुद्धिमान कंप्यूटर स्वचालन [समान संस्थान], और 6-इनपुट बूलियन लुक-अप तालिका</li>
</ul>

L0 से L4 तक के टेलीमेट्री स्तरों में, `SATB` रसीद में दर्ज प्रत्येक चैनल अपनी भौतिक सीमा (boundary) और चार कठोर साक्ष्य वर्गों में से किसी एक के साथ दर्ज होता है:

| साक्ष्य वर्ग | `SATB` रसीदों और तालिकाओं में दायरा |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | `SHA-256` और `JCS` (`RFC 8785`) कैननिकल डाइजेस्ट, जो कार्य बंडलों, पाँच-ब्लॉक `SUT` फ़िंगरप्रिंट और रीप्ले ट्रांसक्रिप्ट के लिए हैं; प्रॉक्सी द्वारा लॉग किए गए प्रॉम्प्ट, कैश, तर्क (reasoning) और पूर्णता (completion) टोकन गणनाएँ; वॉल-क्लॉक अवधियाँ; और तिथि-अंकित `API` सूची-मूल्य `USD` में। |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | केवल कैलिब्रेटेड बाहरी `AC` वॉल एनालाइज़र (`L0`) या भौतिक बोर्ड करंट-शंट मॉनिटर (`L1`/`L2`) से भरा जाता है। `NVIDIA Jetson AGX Thor` पर `TI` `INA238` (`hwmon6` `VIN`, `L1`) और `INA3221` (`hwmon5` `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS`, `ch3 VIN_SYS_5V0`, `L2`/`L1`; `board_metered = true`) के माध्यम से लाइव सत्यापित। चूँकि कैप्चर के दौरान एक सक्रिय सह-किरायेदार ने `VDD_GPU` को थामे रखा (`dedicated_host = false`), कच्चा रेल `measured_j` संरक्षित रहता है, जबकि `A2` शुद्ध प्लेसमेंट श्रेय-निर्धारण रोक दिया जाता है; `Apple M5 Max`, `AMD Strix Halo` और `Intel Raptor Lake` पर `measured_j` `None` रहता है, और पूरे में `L0` वॉल पावर अनसेट रहती है। |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | रूटलेस ऑन-चिप टेलीमेट्री काउंटर (`Apple M5 Max` `IOReport` `sys_power` L1 पर और `macmon` के माध्यम से L2 पर `chip_power`/`cpu_power`/`gpu_power`; `Intel Raptor Lake` `RAPL` `psys` L1 पर और `package-0`/`core`/`uncore` L2 पर; `Framework AMD Strix Halo` `RAPL` `package-0`/`core` L2 पर तथा `amdgpu` `PPT` वाट) और `OS` द्वारा मॉडल की गई प्रति-प्रक्रिया अनुमान (`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` L3 पर, लेबल `D`)। इन्हें कभी `measured_j` या `est_j` के साथ जोड़ा नहीं जाता। |
| **`Provider-Attested (P) vs. Not Available (N)`** | बंद `API` रिमोट सर्वर ऊर्जा को केवल तभी `P` लिखा जाता है जब प्रदाता प्रति-अनुरोध ऊर्जा आँकड़ा शब्दशः पद्धति के साथ लौटाए; अन्यथा इसे शाब्दिक रूप से `"not_available"` (लेबल `N`) लिखा जाता है। व्युत्पन्न आधार-रेखा घटाव जो `5.0%` ड्रिफ्ट सीमा (`Falsifier 6`) या `Step 7` योग जाँच में विफल होते हैं, स्वचालित रूप से हटा दिए जाते हैं, जबकि कच्चे चैनल अक्षुण्ण रहते हैं। |

<div id="11-lineage-design-invariants-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 वंशानुक्रम, डिज़ाइन अपरिवर्तनीयताएँ और सम-गृह प्रकटीकरण

`SATB` सार्वजनिक एजेंट-मूल्यांकन और शक्ति-श्रेय-निर्धारण कार्य पर सीधे आधारित है, न कि जहाँ मानक विद्यमान हों वहाँ स्वयं-निर्मित प्रोटोकॉल आविष्कार करने पर: न्यूनतम स्टेटलेस शेल निष्पादन `mini-swe-agent` का अनुसरण करता है; सॉल्वर और बाह्य-CLI ब्रिजिंग `UK AISI Inspect` (`react()` और `Inspect Agent Bridge`) तथा `Terminal-Bench` (`Harbor` / `Terminus-2`) पर आधारित है; टूल स्कीमा `MCP` का उपयोग करते हैं जो `RFC 8785` (`JCS`) द्वारा मानकीकृत है; GPU संचयी काउंटर अनुशासन Chung et al. (`ML.ENERGY` / `Zeus`) और Yang et al. द्वारा `nvidia-smi` आंशिक-समय सैंपलिंग की कमियों पर आधारित है; आनुपातिक `CPU` विभाजन (`label C`) का मूल्यांकन `CNCF Kepler` मॉडल के विरुद्ध किया गया है; और Linux `RAPL` अनुमति अलगाव Lipp et al. (`PLATYPUS`) का अनुसरण करता है। साथी Open Interface Engineering अध्ययन, [Metered Commit Gates](/papers/gates/), [Task Satiation vs. Aggregate Rebound](/papers/satiation/), और [Deterministic Null](/papers/deterministic-null/), `[same house]` कार्य हैं जिनका उल्लेख सख्ती से साझा वास्तुशिल्प परिभाषाओं के लिए किया गया है:

| अनुबंध अक्ष | सभी लेनों में संरक्षित अपरिवर्तनीयता |
| :--- | :--- |
| **प्रयास प्रोटोकॉल** | स्थिर कार्य सीढ़ी; प्रति प्रयास अधिकतम एक टर्मिनल `SUBMIT` या `REFUSE`; प्रति प्रयास एक अपरिवर्तनीय `SHA-256` रसीद; मानकीय परिणाम `pass`, `fail`, `refuse`, `killed`; परीक्षण प्रयासों के दौरान शून्य सत्यापनकर्ता प्रतिपुष्टि। |
| **तंत्र पहचान** | पाँच-ब्लॉक `SUT` फिंगरप्रिंट (`model` + `serving` + `sampling` + `harness` + `envelope`), `session.open` पर हैश किया गया और `session.close` पर पुनः हैश किया गया। |
| **श्रेय-योग्य ऊर्जा** | शांत समर्पित होस्ट पर पूर्ण-`SUT` कच्ची विंडो ऊर्जा (`A2`); अनन्य भौतिक रेल पर अनुमान-इंजन ऊर्जा (`A1`); `Lane B` के अंतर्गत अनुक्रमिक मॉडल-बनाम-टूल चरण ऊर्जा (`B`)। |
| **अश्रेय-योग्य** | अनसत्यापित बंद-`API` सर्वर जूल (`N`); साझा `SoC` या एकीकृत-स्मृति रेल के सटीक प्रति-प्रक्रिया जूल हिस्से (`C` और `D` मॉडल हैं, भौतिक रेल मीटर नहीं); मॉडल वेट्स इंजन कर्नलों और सिलिकॉन से अलग। |

---

<div id="2-survey-of-agent-harnesses-and-why-context-policy-is-part-of-the-system" class="anchor-alias" aria-hidden="true"></div>

## 2. आधुनिक एजेंट हार्नेस का सर्वेक्षण और संदर्भ नीति प्रणाली का हिस्सा क्यों है

आधुनिक कोडिंग, टर्मिनल और कंप्यूटर-उपयोग हार्नेस इस बात में काफ़ी भिन्न हैं कि वे टूल कैसे उपलब्ध कराते हैं, फ़ाइल संपादनों को कैसे नियंत्रित करते हैं, और बढ़ते वार्तालाप इतिहास को कैसे संक्षिप्त करते हैं:

| हार्नेस | लूप और टूल सतह | संदर्भ और इतिहास नीति |
| :--- | :--- | :--- |
| **`mini-swe-agent`** | केवल `Bash`। प्रत्येक क्रिया एक नया, स्टेटलेस `subprocess.run` आरंभ करती है। | कठोर रूप से रैखिक, केवल-जोड़ने वाला (append-only) संदेश इतिहास; कोई स्वचालित संक्षेपण नहीं। |
| **`SWE-agent` (`ACI`)** | 100-पंक्ति वाला विंडोयुक्त फ़ाइल दर्शक, linter द्वारा नियंत्रित संपादन कमांड, और संक्षिप्त खोज। | इतिहास प्रोसेसर पुराने परिवेश अवलोकनों को सीमित सारांशों में समेटता है। |
| **`Inspect react()`** | `submit()` तक अनुक्रमिक टूल लूप: `bash()`, `text_editor()`, `MCP` टूल। | संपादन योग्य संदेश स्थिति, जिसमें प्लग करने योग्य इतिहास छंटनी या संक्षेपण solvers हैं। |
| **`Inspect Agent Bridge`** | `Claude Code`, `Codex CLI`, `Gemini CLI` और कस्टम `SDK` एजेंटों को एक स्थानीय प्रॉक्सी के पीछे लपेटता है। | संदर्भ प्रबंधन पूरी तरह से लपेटे गए बाहरी हार्नेस को सौंपा जाता है। |
| **`Terminus-2` (`Harbor`)** | एकल टूल: कच्चे कीस्ट्रोक प्राप्त करने वाला स्थायी `tmux` टर्मिनल सत्र। | तीन-चरणीय संदर्भ सारांशन (`3-stage` प्रगामी प्रतिलेख संपीड़न)। |
| **`Codex CLI`** | सैंडबॉक्स्ड शेल (`Landlock`/`seccomp` या `seatbelt`), संरचित `apply_patch`, `MCP`। | मॉडल विंडो सीमा के निकट सक्रिय होने वाला मूल रोलिंग संदर्भ संपीड़न। |
| **`Claude Code`** | `Bash`, संरचित फ़ाइल टूल (`Read`, `Write`, `Edit`, `Glob`, `Grep`), `MCP`। | LLM-आधारित स्वचालित वार्तालाप संपीड़न (`auto-compact`) के साथ प्रॉम्प्ट कैशिंग। |
| **`OpenHands`** | कंटेनरों में किसी भी `ACP` या `CodeAct` कोडिंग एजेंट को चलाने वाला इवेंट-स्ट्रीम रनटाइम। | विन्यास योग्य संदर्भ कंडेन्सर (`LLM` सारांशन या विंडो मास्किंग)। |
| **`ARC-AGI-3` रनर** | इंटरैक्टिव ग्रिड स्थितियों पर मानक हार्नेस बनाम प्रोवाइडर एडाप्टर हार्नेस। | प्रत्येक एडाप्टर ट्रैक के लिए घोषित सीमित दृश्य/ग्रिड स्थिति प्रक्षेप-पथ विंडो। |
| **`OSWorld run.py`** | VM स्क्रीनशॉट पर `pyautogui` माउस/कीबोर्ड क्रियाएँ उत्सर्जित करने वाला डेस्कटॉप `GUI` लूप। | केवल सबसे हाल के $K$ स्क्रीनशॉट और क्रियाओं को रखने वाली स्लाइडिंग प्रक्षेप-पथ विंडो। |

`Terminal-Bench 2` पर, जब मॉडल चेकपॉइंट को स्थिर रखा गया, तब `Gemini 2.5 Pro` ने `OpenHands` के साथ जोड़े जाने की तुलना में `Terminus-2` के साथ जोड़े जाने पर **`17%` अधिक कार्य** हल किए। इसलिए संदर्भ प्रबंधन, आउटपुट छंटनी, संपादन linting और पुनःप्रयास नियम तटस्थ प्लंबिंग नहीं, बल्कि मूल्यांकित प्रणाली के प्रथम-श्रेणी घटक हैं। `SATB` मूल्यांकन को दो स्पष्ट लेनों में विभाजित करके इस भ्रम को हल करता है, और खुले प्रश्न `OQ-1` और `OQ-2` को बंद करता है:

1. **Holding the wrapper constant (`Lane B`) vs. evaluating external wrappers (`Lane O`)**: `Lane B` (`satb-agent`) सभी मॉडलों में एकल ऑडिटेबल Rust लूप को स्थिर करता है, जबकि `Lane O` पूर्ण थर्ड-पार्टी हार्नेस (`Claude Code`, `Codex CLI`, `OpenHands`, `Terminus-2`, `Inspect`) को ब्लैक-बॉक्स `SUT`s के रूप में रैप करता है, जिनके आंतरिक प्रॉम्प्ट और कम्पैक्शन कॉल `harness` फ़िंगरप्रिंट ब्लॉक में हैश किए जाते हैं और `satb-proxy` के माध्यम से 100% रूट होते हैं।

2. **Context policy resolution (`OQ-1`: `ContextRule_v0`)**: शून्य एलिज़न के साथ हार्ड-किलिंग प्रयास बहु-चरणीय तर्क को विस्तृत टूल आउटपुट के साथ मिलाता है, जबकि `LLM`-जनित सारांश (`Claude Code` ऑटो-कम्पैक्ट) छिपे हुए स्टोकेस्टिक मॉडल कॉल को इंजेक्ट करता है जो निर्धारित हार्नेस रिप्ले को तोड़ते हैं। `Lane B` **`ContextRule_v0`** को अपनाता है: जब जमा हुई बातचीत का आकार घोषित संदर्भ विंडो के **`80%`** से अधिक हो जाता है, तो हार्नेस निर्धारित रूप से सबसे पुराने टूल आउटपुट को `"[ELIDED_BY_CONTEXT_RULE_V0]"` से प्रतिस्थापित करता है जबकि `system(TEMPLATE_v0)`, प्रारंभिक `user(render(bundle))`, और **सबसे हालिया `8` टूल आउटपुट** को वैरबेट रखता है, जिससे **शून्य मॉडल कॉल** होते हैं। हार्ड `killed(context_ceiling)` केवल तब सक्रिय होता है जब उन संरक्षित संदेशों का कुल आकार विंडो के `100%` से अधिक हो जाता है।

3. **Tool surface resolution (`OQ-2`: `TOOLS_v0`)**: शुद्ध `exec`-only (`mini`-स्टाइल) मॉडल को मल्टि-लाइन स्रोत पैच और बीजगणितीय प्रमाण (`cat << 'EOF'`) को शेल-एस्केप करने के लिए मजबूर करता है, जिससे शेल-कोटिंग विफलताएँ उत्पन्न होती हैं जो टास्क तर्क के लम्बवत होती हैं और `macOS` व `Linux` में पोर्टेबल रूटलेस सैंडबॉक्सिंग को जटिल बनाती हैं। `Lane B` **`TOOLS_v0`** को सुधारता है, चार कार्यस्थल टूल (`exec`, `read_file`, `write_file`, `list_dir`) तथा दो टर्मिनल टूल (`submit`, `refuse`), जो `JCS` द्वारा `tools_hash` (`d5b102...`) में कैनॉनिकलाइज़ किए जाते हैं।

---

<div id="3-reference-harness-lane-b-contextrule_v0-and-satb-io-protocol" class="anchor-alias" aria-hidden="true"></div>

## 3. संदर्भ हार्नेस (`Lane B`), `ContextRule_v0`, और `SATB-IO` प्रोटोकॉल

<figure class="my-8">
  <img src="/figures/satb-harness/satb-lane-b-architecture.svg" alt="Satiation Benchmark Lane B घटक अलगाव टोपोलॉजी और निर्धारणात्मक सत्र जीवनचक्र।" />
  <figcaption>चित्र 1. बाएँ: <code>Lane B</code> घटक अलगाव जो रूटलेस <code>satb-meter</code>, <code>satb-supervisor</code>, <code>satb-agent</code>, नेटवर्क-ब्लॉक्ड <code>satb-sandbox</code>, क्रेडेंशियल-धारक <code>satb-proxy</code>, और अप्राप्य बाहरी <code>Verifier</code> को अलग करता है। दाएँ: निर्धारणात्मक <code>SATB-IO</code> सत्र और प्रयास अनुक्रम।</figcaption>
</figure>

<div id="31-sequential-execution-loop-and-fixed-versus-configurable-split" class="anchor-alias" aria-hidden="true"></div>

### 3.1 अनुक्रमिक निष्पादन लूप और स्थिर बनाम विन्यास-योग्य विभाजन

`satb-agent` के भीतर प्रत्येक प्रयास एक कठोर रूप से अनुक्रमिक एकल-एजेंट लूप में निष्पादित होता है, जिसमें कोई अतिव्यापी पृष्ठभूमि टूल थ्रेड नहीं होते, कोई `best-of-k` मतदान नहीं होता, और कोई verifier oracle फीडबैक नहीं होता:

```text
msgs <- [system(TEMPLATE_v0), user(render(bundle))]
loop:
  ContextRule_v0(msgs)        # >= 80% window -> elide oldest tool outputs; keep last 8; 0 model calls
  r <- proxy.chat(msgs, TOOLS_v0)   # missing usage -> immediate killed(usage_missing)
  if no tool calls: append CONTINUE_v0; continue
  for call in r.tool_calls (sequential):
    submit | refuse -> attempt.close; ignore trailing calls (C4); STOP
    exec | read_file | write_file | list_dir -> fresh sandboxed process in /work,
      Truncate_v0 (8 KiB head + 8 KiB tail), no network egress (C6)
  envelope ceiling reached -> killed(wall_ceiling | token_ceiling | turn_ceiling | context_ceiling)
```

प्रत्येक `Lane B` रन निश्चित बेंचमार्क स्थिरांक (जो `harness_id` में हैश किए गए) को घोषित `SUT` पैरामीटर (जो `sut_fingerprint_sha256` में हैश किए गए) से अलग करता है:

| सभी `Lane B` रन में स्थिर (`harness_id`) | प्रत्येक `SUT` के लिये कॉन्फ़िगर किया जा सकने वाला (`sut_fingerprint_sha256`) |
| :--- | :--- |
| `TEMPLATE_v0` प्रॉम्प्ट, बंडल रेंडरर, और `CONTINUE_v0` संकेत | `model_id`, प्रदाता स्नैपशॉट तिथि, या स्थानीय `GGUF`/safetensors `SHA-256` |
| `TOOLS_v0` स्कीमा (`tools/list` `JCS` डाइजेस्ट) और क्रमिक डिस्पैच | नमूना पैरामीटर: `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `reasoning_effort` |
| `ContextRule_v0` (`80%` सीमा, अंतिम `8` रखें) और `Truncate_v0` (`8 + 8 KiB`) | सेवा इंजन (`llama.cpp`, `MLX`, `vLLM`, क्लाउड `API`) और बैच/कैश फ़्लैग्स |
| एकल प्रयास (`attempts = 1`), शून्य सत्यापनकर्ता प्रतिक्रिया, शून्य आंतरिक मतदान | सीमा मान: `wall_ms`, `max_total_tokens`, `max_turns` |
| `satb-sandbox`: `/work` प्रतिबंध, हटाया गया वातावरण, शून्य नेटवर्क निकास | सैंडबॉक्स `CPU`/`RAM` कोटा, होस्ट सिलिकॉन, `OS` कर्नेल, और पृथक्करण स्तर |

<div id="32-canonical-four-way-outcome-mapping-oq-3" class="anchor-alias" aria-hidden="true"></div>

### 3.2 विहित चार-मार्गी परिणाम मानचित्रण (`OQ-3`)

बेंचमार्कों को चुपके से क्रैश्ड रनों को छोड़ने या स्वैच्छिक गलत उत्तरों को इंफ्रास्ट्रक्चर टाइमआउट्स के साथ मिलाने से रोकने के लिए, `SATB` पुरानी पाँच-स्थिति पूर्णता कोडों को हानिरहित रूप से **`{pass, fail, refuse, killed}`** (`PFRK`) पर मानचित्रित करता है, प्रत्येक रसीद में सटीक `sub_reason` को बनाए रखते हुए:

1. **`completed` $\to$ `pass` (`sub_reason: "verified"`, score `1`)**: `SUT` ने सीमा समाप्ति से पहले `submit(bytes)` को बुलाया और बाहरी `Verifier` ने `attempt.close` के बाद `bytes` को स्वीकार कर लिया।
2. **`incorrect` $\to$ `fail` (`sub_reason: "incorrect"`, score `0`)**: `SUT` ने स्वच्छ रूप से `submit(bytes)` को बुलाया; बाहरी `Verifier` ने उम्मीदवार को अस्वीकार कर दिया।
3. **`malformed` $\to$ `fail` (`sub_reason: "malformed_submission"`, score `0`)**: `SUT` ने स्वेच्छा से `submit(bytes)` को अपार्सेबल या स्कीमा-अमान्य सामग्री के साथ बुलाया। `SUT` द्वारा लिखित खराब सबमिशन एक सटीकता विफलता है, कभी भी इंफ्रास्ट्रक्चर किल नहीं।
4. **`refused` $\to$ `refuse` (`sub_reason: "policy" | "capability" | "other"`, score `0`)**: `SUT` ने स्पष्ट रूप से `refuse(reason)` को लागू किया।
5. **`no_submission` $\to$ `killed` (`sub_reason: "wall_ceiling" | "token_ceiling" | "turn_ceiling" | "context_ceiling" | "usage_missing" | "exec_timeout_killed" | "process_crash"`, score `0`)**: `satb-supervisor` ने किसी भी टर्मिनल टूल कॉल के आने से पहले प्रयास को समाप्त कर दिया। सभी चार परिणाम हर स्थिति में हर $n$ के हर डिनोमिनेटर में बने रहते हैं।

---

<div id="4-adapter-bridge-shapes-d-m-h-i-five-block-sut-fingerprint-and-c1c12-conformance" class="anchor-alias" aria-hidden="true"></div>

## 4. एडाप्टर सेतु (`Shapes D, M, H, I`), पाँच-खंड `SUT` फिंगरप्रिंट, और `C1-C12` अनुरूपता

<div id="41-four-adapter-shapes-behind-one-supervisor-and-proxy" class="anchor-alias" aria-hidden="true"></div>

### 4.1 एक पर्यवेक्षक और प्रॉक्सी के पीछे चार एडाप्टर आकार

`Lane B` के बाहर की कोई भी प्रणाली `satb-supervisor` से चार एडाप्टर आकारों में से एक के माध्यम से जुड़ती है:

| एडाप्टर आकार | लक्ष्य प्रणालियाँ | निष्पादन और अलगाव अनुबंध | पुनः उपयोग किए गए मानक |
| :--- | :--- | :--- | :--- |
| **`Shape D` (`dnull` नियंत्रण)** | निर्धारणात्मक शून्य (`N0` सख्त मॉडल-मुक्त और `N1` dev-क्रिस्टलाइज्ड) फ्रोजन `DNULLMM1` `mmap` स्टोर्स पर | `/work` के अंदर समान `TOOLS_v0` और `Verifier` नियमों के अंतर्गत निष्पादित होता है तथा निर्णय समय पर **`0` प्रॉक्सी मॉडल कॉल** के साथ। | `POSIX mmap`, `SPEC v0.4` 64-बिट पूर्णांक लूप |
| **`Shape M` (मॉडल एंडपॉइंट)** | स्थानीय ओपन-वेट सर्वर और बंद क्लाउड `API`s | `Chat Completions` या `Messages` पर `Lane B` `satb-agent` चलाता है जिसमें टूल कॉल और अनिवार्य `usage` शामिल हैं, जो 100% `satb-proxy` के माध्यम से रूट किए जाते हैं। | OpenAI-संगत `API` (`llama.cpp`, `mlx_lm`, `vLLM`); `Anthropic`, `Gemini`, `xAI` अनुवादक |
| **`Shape H` (हार्नेस इन ए बॉक्स)** | `Claude Code`, `Codex CLI`, `Gemini CLI`, `OpenHands`, `Terminus-2` | कार्य `/work/task/BUNDLE.md` में लिखा जाता है। आधार `URL` को `satb-proxy` (`127.0.0.1:<port>`) की ओर इंगित किया जाता है; `/work` से वास्तविक `API` कुंजियाँ रोकी जाती हैं; `MCP` `submit` या `refuse` के माध्यम से समाप्त होता है; शून्य अन्य एग्रेस। | `Inspect` सैंडबॉक्स ब्रिज env vars; `--strict-mcp-config` `MCP`; वैकल्पिक `ACP` |
| **`Shape I` (`Inspect` एजेंट)** | विद्यमान सार्वजनिक बेंचमार्क `Inspect` सॉल्वर्स | `SATB` कार्य बंडल को `submit` और `refuse` टूल्स के साथ `attempts = 1` पर लपेटता है, तथा मॉडल कॉल को `satb-proxy` के माध्यम से रूट करता है। | `UK AISI Inspect` `Task` और `Solver` इंटरफेस |

<div id="42-five-block-sut-fingerprint-and-session-validity" class="anchor-alias" aria-hidden="true"></div>

### 4.2 पाँच-ब्लॉक `SUT` फिंगरप्रिंट और सत्र वैधता

`attempt.start` के फायर होने से पहले, एडाप्टर एक पाँच-ब्लॉक JSON संरचना लौटाता है जिसका कैनोनिकल `JCS` `SHA-256` डाइजेस्ट `SUT` को परिभाषित करता है। अज्ञात या अप्रेक्षणीय क्षेत्रों को शाब्दिक रूप से `"not_available"` के रूप में लिखा जाना चाहिए, कभी भी छोड़ा या अनुमानित नहीं किया जाना चाहिए:

| फिंगरप्रिंट ब्लॉक | आवश्यक क्षेत्र (अनुपलब्ध मानों को शाब्दिक रूप से `"not_available"` के रूप में लिखा जाता है) |
| :--- | :--- |
| **`model`** | `provider`, `model_id`, `snapshot_date`, `weights_sha256`, `quantisation`, `tokenizer_hash`, `chat_template_hash`, `context_window`, `system_fingerprint` |
| **`serving`** | `engine`, `version`, `commit`, `binary_hash`, `flags_hash` (`cache_prompt`, `slots`, `batch_invariance`, `TP`), `drivers`, `devices` |
| **`sampling`** | `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `stop`, `reasoning_effort`, `tool_choice` |
| **`harness`** | `name`, `version`, `commit`, `binary_hash`, `prompt_hash`, `tools_hash`, `context_policy`, `internal_voting`, `sub_agents`, `config_hash` |
| **`envelope`** | `hardware`, `os_kernel`, `isolation_tier`, `cgroup_limits`, `cpuset`, `network_policy`, `ceilings`, `telemetry_config_hash` |

**सत्र अमान्यीकरण और प्रारंभ/समाप्ति कैनरी।** `session.close` पर कोई भी परिवर्तित ब्लॉक डाइजेस्ट, कोई भी `MCP` `tools/list_changed` अधिसूचना, एक अनुमान-इंजन पुनरारंभ, एक `NVML` काउंटर रीसेट, सत्र के बीच में परिवर्तित प्रतिध्वनित `model` या `system_fingerprint`, या कोई `OS`/ड्राइवर अद्यतन **सत्र के प्रत्येक रसीद को `void`** चिह्नित करता है। अमान्य रसीदें ऑडिटेबिलिटी के लिए सार्वजनिक अभिलेखागार में बनी रहती हैं लेकिन बेंचमार्क प्लेसमेंट से बाहर रखी जाती हैं। क्योंकि एक क्लाउड प्रदाता निश्चित `model_id` के पीछे वेट्स या क्वांटाइजेशन बदल सकता है बिना `system_fingerprint` को अद्यतन किए, प्रत्येक सत्र मूल्यांकन को `session.open` और `session.close` पर एक निर्धारणात्मक कैनरी रंग के साथ ब्रैकेट भी करता है।

<div id="43-mandatory-c1c12-adapter-conformance-suite" class="anchor-alias" aria-hidden="true"></div>

### 4.3 अनिवार्य `C1-C12` एडाप्टर अनुरूपता सूट

कोई भी एडाप्टर या हार्नेस मूल्यांकन में तब तक प्रवेश नहीं करता जब तक वह सभी बारह अनुरूपता जाँचों (`C1` से `C12`) में उत्तीर्ण नहीं होता:

| जाँच | उत्तीर्ण होने की आवश्यकता |
| :--- | :--- |
| **`C1` बंडल राउंड-ट्रिप** | एडाप्टर इनपुट टास्क बंडल के सटीक `JCS` `SHA-256` डाइजेस्ट को प्रतिध्वनित (echo) करता है. |
| **`C2` Submit पथ** | बाहरी `Verifier` को `satb-proxy` / `MCP` टर्मिनल कैप्चर में दर्ज सटीक बाइट अनुक्रम प्राप्त होता है. |
| **`C3` Refuse पथ** | निर्देशित इनकार बिना किसी त्रुटि के `refuse` (`sub_reason = "other"`, `completion_score = 0`) के रूप में पहुँचता है. |
| **`C4` एक टर्मिनल कॉल** | पहले `submit` या `refuse` के बाद उत्सर्जित कोई भी टूल या टर्मिनल कॉल अनदेखी की जाती है और गिनी जाती है. |
| **`C5` कोई ओरेकल नहीं** | `Verifier` और `satb-supervisor` की डायरेक्टरी, सॉकेट और पैरेंट पाथ (`..`) `/work` से अप्राप्य हैं. |
| **`C6` एग्रेस** | मॉडल ट्रैफ़िक के लिए केवल `satb-proxy` (`127.0.0.1:<port>`) पहुँच योग्य है; `/work` सबप्रोसेस की बाहरी नेटवर्क पहुँच शून्य है और upstream `API` कुंजियाँ शून्य हैं. |
| **`C7` उपयोग उपस्थित** | हर मॉडल कॉल में `usage` होता है (`missing -> killed(usage_missing)`); proxy टोकन योग upstream engine गणनाओं से सटीक मेल खाते हैं. |
| **`C8` फिंगरप्रिंट स्थिर** | पाँच-ब्लॉक `SUT` फिंगरप्रिंट `SHA-256`, 3-प्रयास ड्राई रन से पहले और बाद में समान रहता है. |
| **`C9` हार्नेस रिप्ले** | रिकॉर्ड किए गए `satb-proxy` प्रतिक्रियाओं का रिप्ले बाइट-समान ट्रांसक्रिप्ट उत्पन्न करता है (`0` बाइट अंतर; `Lane B` के लिए अनिवार्य). |
| **`C10` किल पथ** | `/work` की भटकी हुई प्रोसेस ट्री (अलग हुई चाइल्ड प्रोसेस सहित) `< 2,000 ms` के भीतर समाप्त कर दी जाती है और `killed` के रूप में दर्ज होती है. |
| **`C11` टेलीमेट्री हैंडशेक** | रूटलेस `L3` प्रोसेस काउंटर (`cgroup v2` या `proc_pid_rusage`) पठनीय हैं, फ़ेज़ मार्कर प्राप्त होते हैं, और मोनोटोनिक-से-वॉल क्लॉक ऑफ़सेट दर्ज होता है. |
| **`C12` निर्धारणवाद प्रोब** | `8` समान अनुरोध निष्पादित किए जाते हैं और विशिष्ट आउटपुट की संख्या `SUT` के अनुभवजन्य गुण के रूप में दर्ज की जाती है. |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. पाँच-स्तरीय टेलीमेट्री श्रेय-निर्धारण (L0-L4 × A1-N), प्लेटफ़ॉर्म चैनल मानचित्र, और जो नहीं निर्धारित किया जा सकता

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="पाँच-स्तरीय टेलीमेट्री श्रेय-निर्धारण सीमाएँ L0 से L4 तक लेबल A1 से N तक पार करती हुई और सात-कदम कच्चा-पहला योग-जाँच पाइपलाइन।" />
  <figcaption>चित्र 2. बाएँ: भौतिक और तर्कसंगत टेलीमेट्री स्तर <code>L0</code>-<code>L4</code> को श्रेय-लेबल <code>A1</code>-<code>N</code> के साथ मिलाया गया। दाएँ: सात-कदम कच्चा-पहला काउंटर अनुशासन जो पूर्व/पोस्ट बेसलाइन ड्रिफ्ट सीमाएँ (<code>Falsifier 6</code>) लागू करता है और <code>Step 7</code> योग-जाँच।</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 टेलीमेट्री सीमाएँ (`L0-L4`) और श्रेय-निर्धारण लेबल (`A1-N`)

ऊर्जा और गतिविधि सेंसर पाँच भिन्न सीमाओं पर स्थित होते हैं जो भौतिक रूप से अलग-अलग मात्राओं को मापते हैं और इन्हें कभी भी जोड़ा या मिलाया नहीं जाना चाहिए:

| स्तर | भौतिक / तार्किक सीमा | प्रतिनिधि सेंसर | चैनल क्या ईमानदारी से श्रेय दे सकता है |
| :--- | :--- | :--- | :--- |
| **`L0` wall** | `AC` at the wall receptacle | Smart plug or `PDU` (`Shelly` `apower`, `aenergy`; `Yokogawa` analyzer) | Whole machine including `PSU` conversion heat, fans, `DRAM`, and `NVMe`; `~1 s` cadence. |
| **`L1` platform** | Board `DC` input rail | `Jetson Thor INA238` carrier; `Mac sys_power`; `RAPL psys` | Whole computer on the `DC` side downstream of the power brick or `PSU`. |
| **`L2` package / SoC** | `CPU` package, `GPU`, and `SoC` rails | `RAPL pkg`; rootless `macmon IOReport`; `Thor INA3221`; `amdgpu hwmon`; `NVML` cumulative energy (`mJ`) | Whole `SUT` on `SoC` (`A2`), or inference engine alone when a rail is physically exclusive (`A1`). |
| **`L3` process / cgroup** | Single `OS` process tree | `Linux cgroup v2` (`cpu.stat`, `memory.peak`, `io.stat`), `perf`; `macOS proc_pid_rusage` `ri_energy_nj` | Resource activity shares (`C`), or the `OS` kernel's own internal per-process energy model (`D`). |
| **`L4` logical** | The model/tool conversation | `satb-proxy` token counts and call latencies; harness turns, tool calls, and `ContextRule_v0` elisions | Exact counts on every `SUT` without exception, including closed cloud `API`s. |

प्रत्येक रसीद में हर ऊर्जा मान सात श्रेय-निर्धारण लेबलों में से एक को धारण करता है:

- **`A1` (विशेष भौतिक रेल)**: वह हार्डवेयर रेल सेंसर जिसे मापन अवधि के दौरान केवल एक विभाजन ने छुआ हो (उदाहरण: `Jetson Thor INA3221 ch1 VDD_GPU`, जब केवल स्थानीय अनुमान इंजन के पास `GPU` डिवाइस तक पहुँच हो)।
- **`A2` (समर्पित संपूर्ण-प्रणाली सीमा)**: एक शांत (quiesced) समर्पित मशीन (`SUT` plus निष्क्रिय `OS` न्यूनतम स्तर) पर पूरी मशीन (`L0`/`L1`) या पूरे पैकेज (`L2`) का काउंटर। **`OQ-4` के अनुसार, `A2` पर संपूर्ण-`SUT` कच्ची विंडो ऊर्जा प्लेसमेंट के लिए प्राथमिक भौतिक ऊर्जा मेट्रिक है**, जो पतले मॉडलों को `/work` उप-प्रक्रियाओं में बिना गिने गए ब्रूट-फ़ोर्स खोज को बाहर धकेलने से रोकती है, और यह सुनिश्चित करती है कि `active - idle` घटाव धीमे रनों को बेहतर न दिखाए।
- **`B` (कालिक चरण विभाजन)**: क्रमिक चरण चिह्नकों (`Lane B` में `model_call` बनाम `tool_call`) द्वारा सीमांकित, गैर-अतिव्यापी कालिक विंडो में काउंटर अंतर।
- **`C` (आनुपातिक हिस्सेदारी, `Kepler` मॉडल)**: एक साझा हार्डवेयर काउंटर जिसे, जब समानांतर प्रक्रियाएँ अतिव्यापी हों, $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ द्वारा या `GPU` उपयोग द्वारा विभाजित किया जाता है (`Lane O` `Shape H`)।
- **`D` (`OS`-मॉडल्ड अनुमान)**: कर्नल का आंतरिक प्रति-प्रक्रिया ऊर्जा मॉडल (`macOS ri_energy_nj`)। यह एक प्रोसेस ट्री को `CPU` सह-किरायेदारों से अलग करता है, परंतु यह भौतिक शंट रीडिंग नहीं, बल्कि फ़र्मवेयर/कर्नल मॉडल ही रहता है।
- **`P` (प्रदाता-प्रमाणित)**: क्लाउड प्रदाता द्वारा उसकी शब्दशः मापन पद्धति के साथ लौटाई गई प्रति-अनुरोध सर्वर ऊर्जा संख्या।
- **`N` (`not_available`)**: अप्रेक्षित और **कभी अनुमानित नहीं**।

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 सात-चरणीय काउंटर अनुशासन, रूटलेस संग्रहण (`OQ-5`) और प्लेटफ़ॉर्म मानचित्र

`satb-meter` प्रत्येक प्रयास (attempt) को सात क्रमबद्ध चरणों से संसाधित करता है:
1. **हर इवेंट सीमा पर संचयी काउंटर पढ़ें** (`attempt.start`, प्रत्येक `model_call` और `tool_call`, `attempt.close`, साथ ही एक `100 ms` संदर्भ टिक), ताकि विंडो ऊर्जा एक सटीक काउंटर अंतर बने: $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$.
2. **पहले कच्चे चैनल लिखें**: सीमा, सेंसर, प्रारंभ और अंत रीडिंग, काउंटर रैप्स, और नमूनों की संख्या दर्ज करें; `10` सेंसर अवधियों से छोटी विंडो को "below_resolution" और अनुपस्थित हार्डवेयर को "not_available" चिह्नित करें।
3. **अनुक्रमिक चरणों (`B`) को विभाजित करें**: `Lane B` में मॉडल अनुमान (inference) और `/work` टूल कॉल कभी अतिव्यापी नहीं होते; समानांतर `Lane O` हार्नेस चरण-विभाजन को `C` या `N` तक सीमित कर देते हैं।
4. **`engine_resident_during_tools` को अलग करें**: जब `/work` टूल चलता है, तब एक स्थानीय मॉडल सर्वर (`llama-server`, `vLLM`) `GPU`/`DRAM` पर भार (weights) को स्थायी रूप से रखता है। टूल विंडो के दौरान उसकी निष्क्रिय खपत (idle draw) `engine_resident_during_tools` में रखी जाती है और उसे न तो मॉडल के सक्रिय अनुमान में और न ही टूल निष्पादन में गिना जाता है।
5. **अनुपात (`C`) द्वारा विभाजन केवल वहाँ करें जहाँ खंड अतिव्यापी हों**: $\Delta \text{CPU}$ अनुपात को केवल एक लक्षणवर्णन विकल्प (characterisation fallback) के रूप में सख्ती से लागू करें, यह मानते हुए कि `C`-states, टर्बो `DVFS`, और `DRAM`/स्टोरेज स्टॉल आनुपातिकता (proportionality) का उल्लंघन करते हैं।
6. **आधारभूत मानों (baselines) को व्युत्पन्न चैनलों के रूप में संग्रहित करें**: सत्र को पूर्व और पश्चात निवासी (resident) आधारभूत मानों से घेरें; यदि पूर्व और पश्चात निष्क्रिय शक्ति `5.0%` से अधिक बहती है (`Falsifier 6`), तो व्युत्पन्न निवल-निष्क्रिय-ऊपर (net-above-idle) मान हटा दें, जबकि कच्चे चैनल अक्षुण्ण रखें।
7. **योग जाँच (`Falsifier 2`) चलाएँ**: सत्यापित करें कि व्युत्पन्न चरण-घटकों का योग एक सेंसर क्वांटम (`1 mJ`) की सीमा के भीतर कच्चे प्रयास काउंटर अंतर के बराबर है; यदि नहीं, तो व्युत्पन्न विभाजन को त्याग दें और केवल कच्चा चैनल रखें।

**रूटलेस संग्रहण नियम (`OQ-5`)।** बेंचमार्क कभी भी `SUT` ऑर्केस्ट्रेशन को `root` के रूप में न चलाएँ। `macOS` पर, `satb-meter` रूटलेस `macmon` (`IOReport` सब्सक्रिप्शन) और `libSystem` का `proc_pid_rusage(RUSAGE_INFO_V6)` उपयोग करता है, और कभी `sudo` या `powermetrics` नहीं। `Linux` पर (जहाँ `PLATYPUS` के बाद कर्नल `5.10` में `/sys/class/powercap/intel-rapl` केवल root के लिए सुलभ हो गया), एक बार का प्रशासक `udev` नियम एक समर्पित `satb-meter` समूह को पढ़ने की अनुमति देता है, जिसमें **केवल `satb-supervisor` का `UID`** शामिल है। इससे `/work` सैंडबॉक्स प्रक्रियाएँ न तो `RAPL` पर साइड-चैनल हमला कर सकती हैं और न ही अपना ऊर्जा मीटर पढ़ सकती हैं:

| लक्ष्य प्लेटफॉर्म | `L0` / `L1` सम्पूर्ण-तंत्र चैनल | `L2` पैकेज / `SoC` चैनल | `L3` प्रक्रिया एवं `L4` तार्किक चैनल | मुख्य सत्यापन स्थिति |
| :--- | :--- | :--- | :--- | :--- |
| **Apple Silicon Mac** (`M5 Max` सत्यापित) | `L0`: `Shelly` `PDU` (`not_available` यदि अनप्लग्ड); `L1`: `macmon sys_power` (`reported_j`) | `macmon IOReport`: `chip_power`, `cpu_power`, `gpu_power`, `ane_power`, `ram_power` (`reported_j`) | `L3`: `proc_pid_rusage` `ri_energy_nj` (`D`), `ri_instructions`, `ri_diskio_*`; `L4`: `satb-proxy` | रूटलेस `L1`-`L4` `Apple M5 Max` पर लाइव सत्यापित; `L0` प्लग खुला। |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`, `Linux x86-64` सत्यापित) | `L0`: `Shelly` `PDU` (`not_available` यदि अनप्लग्ड); `L1`: `cros_ec` (`0` पावर विशेषताएँ) | `RAPL package-0` एवं `core` (`0440 root:energy` `udev`) `reported_j` + `amdgpu` `PPT` `power1_input` (`0444`; `energy1_input` अनुपस्थित) | `L3`: `cgroup v2` / `getrusage` (`C` सक्रियता हिस्से); `L4`: `satb-proxy` | लाइव सत्यापित (`0440 root:energy` `PLATYPUS` अलगाव; `amdgpu PPT` `0444`)। |
| **Intel Raptor Lake** (`Core i9-13900H`, `Linux x86-64` सत्यापित) | `L0`: `not_available`; `L1`: `RAPL psys` (`intel-rapl:1/energy_uj`, `0444` `reported_j`) | `RAPL package-0`, `core`, एवं `uncore` (`MSR` + `MMIO` `energy_uj`, `0444` `reported_j`) | `L3`: `cgroup v2` / `getrusage` (`C` सक्रियता हिस्से); `L4`: `satb-proxy` | लाइव सत्यापित (`0 µJ` `Step 7` अवशेष `psys` `L1` और `package-0` `L2` के बीच)। |
| **NVIDIA Jetson AGX Thor** (`Linux aarch64` Tegra सत्यापित) | `L1`: `TI INA238` (`hwmon6` `VIN`, `0444` `measured_j`) + `INA3221 ch3 VIN_SYS_5V0` (`0444` `measured_j`) | `INA3221 ch1 VDD_GPU` (`0444` `measured_j`, `A1` जब अनन्य); `ch2 VDD_CPU_SOC_MSS` (`0444` `measured_j`); `NVML` (`unverified`) | `L3`: `cgroup v2` / `getrusage` (`C` सक्रियता हिस्से); `L4`: `satb-proxy` | लाइव सत्यापित (`INA238` + `INA3221 ch1-ch3` `0444` रूटलेस; GPU `NVML` सह-किरायेदार लॉक के अंतर्गत खुला)। |
| **Closed Cloud `API`** (`Anthropic`, `xAI`, `Cerebras`, `OpenAI`, `Google`) | स्थानीय `L0`-`L1` केवल क्लाइंट होस्ट को मापता है (सर्वर अनुमान से बाहर) | दूरस्थ सर्वर `L2`: सख्ती से **`N` (`not_available`)** या प्रति-आवेदन **`P`** (`OQ-6`) | स्थानीय `/work` `L3` (`D`/`C`) सैंडबॉक्स उपकरणों के लिए; `L4`: **सटीक** `satb-proxy` टोकन, कॉल, `USD` | `Anthropic`, `Cerebras`, और `xAI` के पार `satb-proxy` द्वारा लाइव सत्यापित। |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 हार्डवेयर मापन की आठ सामान्य त्रुटियाँ और सात गैर-श्रेय-योग्य राशियाँ

आधुनिक `SoC`s और `GPU`s पर मानक पावर-मैपिंग शॉर्टकट व्यवस्थित रूप से विफल होते हैं:

| हार्डवेयर टेलीमेट्री जटिलता | `SATB` शमन |
| :--- | :--- |
| **डाई तापमान, फैन, `DVFS`, और टर्बो के साथ आइडल पावर में परिवर्तन** | `GPU` के ठंडा होने (`<= 1.5 W`) का इंतजार करें, प्रत्येक विंडो को पूर्व/पश्चात बेसलाइन से घेरें, शिखर `GPU` तापमान रिकॉर्ड करें, और `5.0%` परिवर्तन से अधिक व्युत्पन्न शुद्ध जूल्स को अमान्य करें (`Falsifier 6`). |
| **कोल्ड-मैशीन आइडल और वज़न-रहित आइडल के बीच अस्पष्टता** | `Step 6` में दोनों को स्पष्ट रूप से मापें और लेबल करें, बजाय चुपचाप एक को घटाने के। |
| **`Active - idle` घटाव धीमी रन को अनुकूल बनाता है** | पूरे `SUT` कच्ची विंडो ऊर्जा (`A2`) प्राथमिक प्लेसमेंट आकड़ा बनी रहती है (`OQ-4`). |
| **उप-अवधि विंडो शून्य, नकारात्मक, या क्वांटीज़ेशन शोर के रूप में पढ़ी जाती हैं** | जो भी विंडो `10` सेंसर अवधि से छोटी हो उसे `"below_resolution"` के रूप में चिह्नित करें (उदाहरण के लिये `< 1.2 s` पर `~8 Hz` `macmon` या `< 10 s` पर `1 Hz` स्मार्ट प्लग)। |
| **उच्च-आवृत्ति टेलीमेट्री सैंपलर महत्वपूर्ण `CPU` पावर खर्च करते हैं** | इवेंट सीमाओं पर संचयी काउंटर पढ़ें (`0.011 mW` पर `0 Hz`) साथ ही `100 ms` टिक; `observer_only` बेसलाइन रिकॉर्ड करें। |
| **`NVML` त्वरित पावर गेज `A100`/`H100` पर केवल `~25%` रनटाइम का नमूना लेता है** | संचयी `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) पढ़ें, कभी भी त्वरित `nvmlDeviceGetPowerUsage` पोलिंग न करें (Chung et al.; Yang et al.). |
| **बाहरी `L0` वॉल प्लग असिंक्रनाइज़्ड क्लॉक पर चलता है** | `session.open` और `session.close` पर नियतात्मक `50%`-ड्यूटी कैलिब्रेशन लोड पल्स उत्सर्जित करें और टाइमस्टैम्पों को क्रॉस-कोरिलेट करें। |
| **शेयर्ड-होस्ट बैकग्राउंड डेमॉन या सह-टेनेंट कार्य** | प्रॉसेस सूची लॉग करें, `Falsifier 6` के द्वारा शेयर्ड `L2` व्युत्पन्न घटाव को डाउनग्रेड करें, और शुद्ध `L2` के साथ को-टेनेंट-अलग `L3` `ri_energy_nj` (`D`) रिकॉर्ड करें। |

परिणामस्वरूप, **सात मात्राएँ ईमानदारी से अभिकथित नहीं की जा सकती** और `SATB` दावों से प्रतिबंधित हैं: (1) अनपुष्ट बंद-`API` सर्वर ऊर्जा (`N` या `P` केवल); (2) शेयर्ड `SoC` या युनिफाइड-मेमोरी रेल पर सटीक प्रति-प्रक्रिया भौतिक जूल्स (`C` और `D` मॉडल हैं); (3) मॉडल वज़न जो सर्विंग कर्नेल, क्वांटीज़ेशन, बैचिंग, और सिलिकॉन से अलग हैं; (4) `OS` आइडल फ़्लोर और `DRAM`-रहित वज़न पावर की स्वामित्व (स्वतंत्र चैनलों के रूप में रिपोर्ट किया गया); (5) सेंसर अवधि से छोटे व्यक्तिगत घटनाएँ (जैसे `1 s` प्लग के तहत `30 ms` टूल कॉल); (6) शेयर्ड क्लाउड `VM`s जिनमें होस्ट हार्डवेयर काउंटर नहीं होते; और (7) सत्र-के बीच प्रॉवाइडर वज़न स्वैप जो चुपचाप होते हैं (शुरू/समाप्ति कैनरी द्वारा चिह्नित, प्रारम्भ में कभी अस्वीकार नहीं)। विशेष रूप से (`OQ-6`), **प्रॉवाइडर सततता खुलासे फ़्लीट माध्य हैं, न कि प्रति-अनुरोध माप, और कभी `SATB` रसीद में प्रवेश नहीं करते**, जिसमें गूगल का `0.24 Wh` माध्य `Gemini Apps` प्रॉम्प्ट, OpenAI का `0.34 Wh` आंकड़ा (विधि के बिना प्रकाशित), और Mistral का `1.14 gCO2e` प्रति `400`-टोकन प्रतिक्रिया शामिल है।

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. मापा गया अनुरूपता, निर्धारणवाद, पर्यवेक्षक-प्रभाव और बहु-होस्ट श्रेय-निर्धारण परिणाम

अमापित डिज़ाइन धारणाओं को ऑडिटेबल रसीदों से प्रतिस्थापित करने के लिए, हमने पूर्ण `SATB` अनुरूपता सूट और फाल्सिफायर हार्नेस (`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`, कुल रनटाइम `175.69 s`) को `Apple M5 Max` वर्कस्टेशन (`arm64`, `128 GB` यूनिफाइड मेमोरी, `macOS 27.2.1`, `macmon 0.12.0`) पर निष्पादित किया, साथ ही एक `188`-विंडो क्रॉस-स्टडी ऑडिट भी किया।

<div id="61-c1c12-conformance-c9-deterministic-replay-and-c10-process-tree-cleanup" class="anchor-alias" aria-hidden="true"></div>

### 6.1 `C1-C12` अनुरूपता, `C9` नियतात्मक पुनर्चलन, और `C10` प्रक्रिया-वृक्ष सफ़ाई

सभी **`12 / 12` Rust संदर्भ अनुरूपता जाँचें** (`dnull_cli satb-conformance`) और सभी विस्तारित ऑपरेटिंग-सिस्टम जाँचें उत्तीर्ण हुईं:

- **बंडल, टर्मिनल, परिरोध और फ़िंगरप्रिंट जाँचें (`C1`-`C8`, `C11`)**: `C1` ने कैनोनिकल बंडल डाइजेस्ट `455e941f51f8ffef` को प्रतिध्वनित किया; `C2` ने `satb-proxy` के माध्यम से `Verifier` तक बाइट-सटीक `submit` पेलोड पहुँचाए; `C3` ने खाली/निर्देशित अस्वीकृतियों को `refuse:other` में मैप किया; `C4` ने `submit` के बाद आने वाली अनुवर्ती टूल कॉल्स को अनदेखा किया (`ignored_trailing_calls = 1`); `C5` ने `../`, `/etc/passwd`, और `verifier_oracle/*` से बचने के प्रयासों को अवरुद्ध किया; `C6` ने `/work` के भीतर प्रॉक्सी/क्रेडेंशियल एनवायरनमेंट वेरिएबल हटाए (`NP=*|HTTP=`), जबकि सूचीबद्ध न होने वाले प्रॉक्सी पथों पर `HTTP 404` लौटाया; `C7` ने उपयोग-जानकारी गायब होने वाली प्रतिक्रियाओं को तुरंत `killed(usage_missing)` के रूप में समाप्त किया; `C8` ने ड्राई रनों में पाँच-ब्लॉक फ़िंगरप्रिंट `8b741c27bf364e5d` को बाइट-समान बनाए रखा, जबकि सिमुलेटेड `system_fingerprint` अदला-बदली को `session_void = true` के साथ चिह्नित किया; और `C11` ने रूटलेस `RUSAGE_INFO_V6` काउंटर दृश्यता की पुष्टि की (`sudo_invoked = false`)।
- **विस्तारित `C9` बहु-टर्न `ContextRule_v0` + `Truncate_v0` पुनर्चलन**: `48,000` टोकन विंडो (`80%` सीमा = `38,400` टोकन) के भीतर, प्रति टर्न `24 KiB` कच्चा फ़ाइल-पठन उत्पन्न करने वाले `14`-टर्न ट्रेस में (`Truncate_v0` द्वारा `14` आउटपुट `8,192 B + 8,192 B` तक छोटे किए गए), `ContextRule_v0` ने **`0` अतिरिक्त मॉडल कॉल्स** के साथ **सबसे पुराने `5` टूल आउटपुट** नियतात्मक रूप से हटाए, और `149,747` बाइट का कैनोनिकल ट्रांसक्रिप्ट (`SHA-256` `d697ed1476129939...`) उत्पन्न किया, जिसमें स्वतंत्र `/work` पुनर्चलनों के बीच **`0` बाइट अंतर** था। उसी ट्रेस को कड़ी `16,000`-टोकन विंडो में दोहराने पर (जहाँ रखे गए `8` `16 KiB` आउटपुट `100%` से अधिक हो जाते हैं), नियतात्मक रूप से `killed(context_ceiling)` ट्रिगर हुआ।
- **विस्तारित `C10` बहु-प्रक्रिया `SIGKILL` सफ़ाई (`< 2,000 ms` विशिष्टता सीमा)**: `5` परीक्षणों में, जिनमें एक अलग प्रोसेस ग्रुप में `4`-प्रक्रिया वृक्ष (`sh` पैरेंट और `3` डिटैच्ड बैकग्राउंड Python sleeper) उत्पन्न किया गया, `SIGKILL` वितरण और कर्नल द्वारा रीपिंग **`2.073 ms` औसत** में पूरी हुई (न्यूनतम `1.429 ms`, अधिकतम `2.571 ms`, जो `2,000 ms` सीमा से **`778×` कम** है), जिसमें **`0` शेष `PID`** थे और परिणाम `killed(wall_ceiling)` रहा।

<div id="62-live-c12-eight-request-determinism-probes-across-four-model-substrates" class="anchor-alias" aria-hidden="true"></div>

### 6.2 चार मॉडल सब्सट्रेट्स पर लाइव `C12` आठ-रिक्वेस्ट निर्धारक प्रोब्स

Routing `8` identical algebraic-synthesis requests per model (`32` live cloud calls plus `8` local `Shape D` runs) through `satb-proxy` verified `100%` exact `C7` token-count parity (`32/32` calls) and exposed three distinct determinism regimes:

| `SUT` / `satb-proxy` के माध्यम से endpoint | `temperature = 0` प्री-फ्लाइट | रिकॉर्ड किया गया `sampling.temperature` | भिन्न प्रारम्भिक आउटपुट (`/ 8`) | भिन्न बीजीय रूप (`/ 8`) | `system_fingerprint` | औसत विलंबता |
| :--- | :---: | :--- | :---: | :---: | :--- | ---: |
| **`Shape D`: `dnull N1`** (Rust स्थानीय) | `Exact i64` | `0 (exact_i64_q1e6)` | **`1 / 8`** | **`1 / 8`** | `0da4df8d9ccbce1e…` | `1,474.0 ms` |
| **`Anthropic claude-opus-5-5`** | `HTTP 400` | `not_available` (अवकाशित) | **`8 / 8`** | **`4 / 8`** | `not_available` | `3,389.1 ms` |
| **`Anthropic claude-sonnet-5-5`** | `HTTP 400` | `not_available` (अवकाशित) | **`8 / 8`** | **`2 / 8`** | `not_available` | `2,914.3 ms` |
| **`Cerebras gpt-oss-120b`** | `HTTP 200` | `0.0 (seed=42)` | **`2 / 8`** | **`2 / 8`** | `fp_fd4dff7eed92aaf38281` | `484.2 ms` |
| **`xAI grok-4.20-0309-non-reasoning`** | `HTTP 200` | `0.0 (seed=42)` | **`8 / 8`** | **`1 / 8`** | `fp_9974b11849` | `942.7 ms` |

1. **`temperature = 0` का प्रदाता अवकाशन**: दोनों `claude-opus-5-5` और `claude-sonnet-5-5` ने `"temperature": 0.0` को **`HTTP 400` (`"`temperature` is deprecated for this model."`)** के साथ अस्वीकार किया, जो प्रयोगात्मक रूप से `SAT` के नियम की पुष्टि करता है कि अनुपलब्ध सैंपलिंग नियंत्रणों को `"not_available"` में सामान्यीकृत किया जाना चाहिए न कि चुपचाप शून्य माना जाए। `8` समान कॉल्स में, `claude-opus-5-5` (`1,047` अनुकूलनशील सोच टोकन) ने `8` भिन्न प्रारम्भिक पाठ उत्पन्न किए जो `4` बीजीय रूप से भिन्न बिटवेक्टर पहचान (`(x | y) - (x & y)`, `(x | y) & ~(x & y)`, `(x & ~y) | (~x & y)`, तथा `(x + y) - ((x & y) + (x & y))`) को कवर करते हैं।

2. **`temperature = 0, seed = 42` के तहत शेष गैर-निर्धारितता**: जबकि `temperature = 0.0` और `seed = 42` को (`HTTP 200`) के साथ स्थिर `system_fingerprint` के साथ स्वीकार किया गया, `Cerebras gpt-oss-120b` (`2,976` तर्क टोकन) ने `8` समान कॉल्स में `2` भिन्न आउटपुट उत्पन्न किए, जबकि `xAI grok-4.20-0309-non-reasoning` ने सभी `8` कॉल्स में `1` बीजीय सूत्र (`(x | y) & ~(x & y)`) को स्थिर रखा लेकिन सभी `8/8` प्रतिक्रियाओं में अपने गद्य प्रमाण वाक्य को बदलते रहे। इसलिए रिकॉर्ड किए गए प्रतिक्रियाओं (`C9`) के आधार पर हार्नेस निर्धारकता को **मापे गए `SUT` आउटपुट प्रसार (`C12`)** से अलग करना आवश्यक है।

<div id="63-falsifier-5-observer-effect-benchmark-across-telemetry-cadences-10-s-windows" class="anchor-alias" aria-hidden="true"></div>

### 6.3 फाल्सिफायर 5: टेलीमेट्री कैडेंस में ऑब्जर्वर-प्रभाव बेंचमार्क (`10 s` विंडो)

संयुक्त सैंपलर (`Python` + चाइल्ड `macmon` `IOReport` पाइप) के `CPU` समय, `L3` `ri_energy_nj` (`observer_only` `reported_j`), तथा पूरे-`SoC` `L2` `reported_j` को `Apple M5 Max` पर इंटरलीव्ड `10.0 s` विंडो में मापने से सटीक ऑब्जर्वर ओवरहेड की मात्रा निर्धारित हुई:

| सैंपलिंग कैडेंस | प्राप्त दर | सैंपलर `CPU` समय / `10 s` | ऑब्जर्वर `L3` `reported_j` | ऑब्जर्वर पावर (`mW`) | `L2` विंडो का हिस्सा | पूरे-`SoC` `L2` विंडो (`reported_j`) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`0 Hz` सीमा-मात्र** (`2` `rusage` सिस्टम कॉल) | `0.20 Hz` | **`0.004 ms`** | **`0.000108 J`** | **`0.011 mW`** | **`0.0000%`** | `-` (शून्य `IOReport` डेमॉन) |
| **`1 Hz` (`1,000 ms` टिक)** | `0.90 Hz` | `9.323 ms` | `0.194237 J` | `19.371 mW` | `0.0521%` | `372.769 J` (`37.17 W`) |
| **`10 Hz` (`100 ms` `SATB` संदर्भ टिक)** | `8.12 Hz` | `36.434 ms` | `0.666596 J` | **`66.439 mW`** | **`0.1770%`** | `376.603 J` (`37.53 W`) |
| **`100 Hz` (`10 ms` स्ट्रेस फाल्सिफायर)** | `7.44 Hz` | `35.636 ms` | `0.598721 J` | `58.971 mW` | `0.1618%` | `369.926 J` (`36.44 W`) |

इस मापन से दो हार्डवेयर तथ्य सीधे उभरते हैं:
1. **नगण्य व्यतिक्रम (`< 0.18%`)**: सीमा-मात्र `proc_pid_rusage` रीड `108 µJ` (`0.011 mW`) की खपत करती है, जो `10 Hz` `IOReport` पोलिंग (`66.44 mW`) से **`6,040×` कम पावर** है, तथा `100 ms` संदर्भ टिक पूरे-`SoC` विंडो ऊर्जा का मात्र **`0.177%`** दर्शाता है (`-i 10` और `-i 1000` के बीच `0.76%` कुल `L2` विंडो अंतर, फाल्सिफायर 5 को क्लियर करता है)।
2. **`IOReport` सब्सक्रिप्शन कैडेंस सीमा (`~8 Hz`)**: `macmon 0.12.0` से `-i 10` (`100 Hz`) का अनुरोध **`7.44 Hz`** (`10.15 s` में `75.5` सैंपल) प्राप्त करता है क्योंकि प्रत्येक रूटलेस `IOReport` सब्सक्रिप्शन चक्र macOS यूजर स्पेस में `~120 ms` तक ब्लॉक करता है। परिणामस्वरूप, चरण 2 का `10`-पीरियड `below_resolution` फ्लोर भौतिक रूप से `macmon` `L2` विंडो पर **`~1.2 s`** के अनुरूप है, जबकि सब-सेकंड संचालन को `0 Hz` सीमा `L3` `ri_energy_nj` काउंटर या बैच्ड विंडो पर निर्भर रहना चाहिए।

<div id="64-falsifier-3--step-7-b-temporal-boundary-vs-c-proportional-kepler-attribution" class="anchor-alias" aria-hidden="true"></div>

### 6.4 मिथ्याकारक 3 और चरण 7: `B` अस्थायी सीमा बनाम `C` आनुपातिक (`Kepler`) श्रेय-निर्धारण

`Apple M5 Max` पर `3` प्रतिकृतियों में, एक एकल `SUT` ने **चरण 1** (`2.50 s` ALU-सघन `SHA-256` डाइजेस्ट विस्फोट: औसत `CPU` समय `29.27 ms`, प्रति `CPU`-ms `38.63 mJ`) का निष्पादन किया, जिसके बाद क्रमिक रूप से **चरण 2** (`2.51 s` `192 MiB` `DRAM` कैश-मिस स्वीप और सिंक्रोनस `fsync` डिस्क फ्लश तथा `8 ms` `I/O` प्रतीक्षा: औसत `CPU` समय `15.94 ms`, प्रति `CPU`-ms `27.73 mJ`) चला। इसी दौरान एक स्थिर ड्यूटी-साइकिल वाला पृष्ठभूमि कार्यकर्ता भी चलता रहा।

| श्रेय-निर्धारण जाँच (`n = 3` क्रमिक दो-चरणीय + सह-किरायेदार प्रतिकृतियाँ) | चरण 1 (`Compute` `2.50 s`) | चरण 2 (`DRAM + fsync I/O` `2.51 s`) | मिथ्याकारक / चरण-7 निर्णय |
| :--- | ---: | ---: | :--- |
| **सटीक `B` अस्थायी सीमा `L3` अंतर (`reported_j`)** | `1.1272 J` (`1,127,172 µJ`) | `0.4433 J` (`443,317 µJ`) | **`Step 7` अवशेष `<= 1 µJ` (`3/3` उत्तीर्ण)** |
| **`C` (`Kepler` $\Delta\text{CPU}$ हिस्सा: `64.58%` बनाम `35.42%`) `L3` पर** | `1.0145 J` (`-10.00%`) | `0.5560 J` (**`+25.21%` औसत त्रुटि**) | `DRAM`/स्टॉल ऊर्जा/ms $\ne$ `ALU` ऊर्जा/ms |
| **सटीक `B` अस्थायी `L2` पूर्ण-`SoC` विंडो (`reported_j`)** | `82.246 J` | `90.975 J` | `DRAM`, `NVMe`, और होस्ट ड्रॉ `I/O` प्रतीक्षा में बना रहता है |
| **`C` (`Kepler` $\Delta\text{CPU}$ हिस्सा) `L2` विंडो पर लागू** | `111.758 J` (**`+35.86%` त्रुटि**) | `61.464 J` (**`-32.59%` त्रुटि**) | **`Falsifier 3` सक्रिय (`> 20%` त्रुटि)** |

जबकि `Step 7` की योग जाँच `B` काउंटर अंतरों के तहत `0-1 µJ` (परीक्षणों का `100.0%`) तक सीमित रही, `CPU`-समय आनुपातिक श्रेय-निर्धारण (`C`) ने साझा `L2` पर कम्प्यूट विस्फोट को **`+35.86%`** अधिक श्रेय दिया और मेमोरी-और-`fsync` चरण को **`-32.59%`** कम श्रेय दिया (और प्रति-प्रक्रिया `L3` पर भी **`25.21%`** की त्रुटि दी)। इससे अनुभवजन्य रूप से पुष्टि होती है कि `SATB` `C` को अतिव्यापी समानांतर हार्नेस (`Shape H`) तक सीमित क्यों रखता है, और `Falsifier 3` के माध्यम से `> 20%` क्रमिक विचलन को क्यों चिह्नित करता है।

<div id="65-multi-session-falsifier-6-audit-188-windows-and-falsifier-8-harness-floor-check" class="anchor-alias" aria-hidden="true"></div>

### 6.5 मल्टी-सेशन `Falsifier 6` ऑडिट (`188` विंडो) और `Falsifier 8` हार्नेस-फ्लोर जाँच

तीन प्रयोगात्मक अभियानों में साझा `Apple M5 Max` होस्ट पर एकत्रित **`188` वास्तविक `L2` `IOReport` विंडो** और दो युग्मित `Lane B` बनाम `Shape H` (`Claude Code 2.1.330`) मूल्यांकनों के ऑडिट से दोनों सत्र-स्तरीय सुरक्षा उपाय पुष्ट होते हैं:

1. **`Falsifier 6` बेसलाइन-ड्रिफ्ट ऑडिट (`188` विंडो)**: `exp-001` (`11` विंडो: `1` `5.0%` के भीतर, `10` ऊपर की ओर `44.5%` तक ड्रिफ्ट), `exp-002` + मल्टी-टर्न (`7` विंडो: `2` `5.0%` के भीतर, `dnull` `1,190`-इंस्टेंस बैच `3.09%` ड्रिफ्ट पर और `BigCodeBench` `Qwen 3.6` `1.02%` ड्रिफ्ट पर, तथा `5` समवर्ती `yosys-abc` संश्लेषण के अंतर्गत `12.16%-65.11%` ड्रिफ्ट), और `ai-reads-human` (`loadavg_1m = 12.92` पर `170` विंडो: `61` `5.0%` के भीतर, `109` ड्रिफ्ट)। **`188` में से `64` विंडो (`34.04%`)** ने वैध `derived_marginal_j` बनाए रखा, जबकि **`188` में से `124` (`65.96%`)** ने एक भी कच्चा `L2` या प्रति-`PID` `L3` `reported_j` रीडिंग खोए बिना नेट-एबव-आइडल घटाव को स्वचालित रूप से अमान्य कर दिया (`188 / 188 = 100.0%` कच्चा उत्तरजीविता)।
2. **`Falsifier 8` (`Lane B` बनाम `Shape H` `Claude Code 2.1.330`)**: `/work` के औपचारिक और `SQLite` नीति बंडलों की `24` युग्मित जोड़ियों में, `Lane B` ने `Claude Opus 5.5` (`44` मॉडल कॉल, `63,568` प्रॉम्प्ट+कैश टोकन, `\$0.5477`) और `Claude Sonnet 5.5` (`43` कॉल, `60,284` टोकन, `\$0.3413`) दोनों पर **`24 / 24` (`100.0%`)** हासिल किया। यह `Shape H` (`Claude Code 2.1.330`: `Opus 5.5` पर **`24 / 24`**, `89` कॉल / `218,449` टोकन; `Sonnet 5.5` पर `83` कॉल / `196,128` टोकन) से मेल खाता है, और साथ ही प्रॉम्प्ट+कैश टोकन ट्रैफ़िक को **`3.44×` और `3.25×`** घटाता है। `6` अनदेखे मल्टी-फ़ाइल Python बग-रिपेयर रिपॉज़िटरी (`config-defaults`, `interval-merge`, `pagination`, `precedence`, `rate-window`, `retry-backoff`) पर, `Lane B` (`Opus 5.5` `28` कॉल / `52,045` टोकन; `Sonnet 5.5` `31` कॉल; स्थानीय `Qwen 3.6 35B-A3B` `42` कॉल / `2,342.05 J` `L2`) ने फिर से `Shape H` (`Claude Code 2.1.330` + `Opus 5.5`: **`6 / 6`**, `30` कॉल / `86,744` टोकन, `1.67×` अधिक टोकन) से मेल खाया। इससे पुष्टि होती है कि `Lane B` **कोई अपंग हार्नेस-फ्लोर नहीं** है।

<div id="66-multi-platform-hardware-attribution-across-four-silicon-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 चार सिलिकॉन आर्किटाइप्स में बहु-मंच हार्डवेयर श्रेय-निर्धारण

यह सत्यापित करने के लिए कि `SATB` अनुरूपता, `Shape D` फिक्स्ड-पॉइंट निर्धारिता, रूटलेस `PLATYPUS` अनुमति सीमाएँ, और भौतिक शंट रेल पृथक्करण `macOS` और `Apple Silicon` के बाहर भी कायम हैं, हमने `run_multi_host_satb.py` (`multi_host_satb_receipts.json`) को `Apple M5 Max` के साथ तीन अतिरिक्त `Linux` हार्डवेयर आर्किटाइप्स पर चलाया:

| हार्डवेयर आर्किटाइप & `OS` कर्नेल | रूटलेस सेंसर सीमा & साक्ष्य वर्ग | `Shape D` `1M` `DNULLMM1` (`10k` प्रोब्स) | `C9` पुनः प्लेबैक & `C10` `SIGKILL` औसत | सिंगल-रीड लेटेंसी & `100 Hz` प्राप्त | `Step 7` शेष & `Falsifier 3` (`C` बनाम `B`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`** (`arm64`, `128 GB`, `macOS 27.2.1`) | `IOReport` `L1`/`L2` + `rusage` `L3` (`reported_j`; `measured_j = None`) | `15027705736` (`388.43 ns` `C++`, `582.57 ns` Rust) | `149,747 B` (`0` diffs) · `2.073 ms` (`0` `PID`s) | `~120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`** चरण 2 (`+35.86%` चरण 1) |
| **`NVIDIA Jetson AGX Thor`** (`aarch64`, `122.9 GiB`, `Linux 6.8.12-1021-tegra`) | `TI INA238` (`hwmon6` `VIN` `L1`) + `INA3221` (`hwmon5` `ch1-ch3` `L2`/`L1`, `0444` **`measured_j`**) | `15027705736` (`984.86 ns` `C -O3`, `2,489.4 ns` Py) | `149,747 B` (`0` diffs) · `9.544 ms` (`0` `PID`s) | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2` (`-67.02%` `VIN`) |
| **`Framework AMD Ryzen AI Max+ 395`** (`x86-64`, `122.8 GiB`, `Linux 7.0.0-43`) | `RAPL package-0` & `core` (`0440 root:energy` **`reported_j`**) + `amdgpu PPT` (`0444`; `measured_j = None`) | `15027705736` (`376.61 ns` `C -O3`, `1,341.7 ns` Py) | `149,747 B` (`0` diffs) · `0.868 ms` (`0` `PID`s) | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0` (`-63.34%` `core`) |
| **`Intel Core i9-13900H`** (`x86-64`, `14.7 GiB`, `Linux 7.0.0-43`) | `RAPL psys` (`L1`) + `package-0`, `core`, `uncore` (`L2`, `0444` **`reported_j`**; `measured_j = None`) | `15027705736` (`420.93 ns` `C -O3`, `863.6 ns` Py) | `149,747 B` (`0` diffs) · `1.120 ms` (`0` `PID`s) | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0` (`-73.62%` `psys`) |

इन लाइव रसीदों से चार क्रॉस-प्लेटफ़ॉर्म हार्डवेयर निष्कर्ष उभरते हैं:

1. **बिट-सटीक `Shape D` और `Lane B` पुनरावृत्ति-अपरिवर्तनीयता `arm64`/`aarch64` तथा `x86-64` के बीच**: सभी चार होस्टों ने सटीक `10,000`-प्रोब `DNULLMM1` चेकसम **`15027705736`** उत्पन्न किया, सटीक `test.setpoint` फ्रोजन डाइजेस्ट `0da4df8d9ccbce1e...4485781`, तथा सटीक `149,747`-बाइट `C9` ट्रांसक्रिप्ट (`SHA-256` `d697ed1476129939...`, `0` बाइट अंतर), जबकि `SIGKILL` द्वारा `4`-`PID` रनअवे प्रक्रिया समूहों को `0.868 ms` से `9.544 ms` में काटा (`2,000 ms` विनिर्देश सीमा से `> 200×` कम, `Jetson AGX Thor` पर `loadavg_1m = 52.39` पर भी)।

2. **भौतिक `INA238` / `INA3221` शंट पृथक्करण तथा `Falsifier 6` जीवंत `GPU` सह-आवासिता पर `NVIDIA Jetson AGX Thor` पर**: `Linux 6.8.12-1021-tegra` पर, `hwmon6` (`ti,ina238` at `i2c@c600000/ina238@44`, `VIN` पूर्ण-बोर्ड `DC` इनपुट `~27.97 V` पर) तथा `hwmon5` के सभी तीन चैनल (`ina3221@40`: `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS`, तथा `ch3 VIN_SYS_5V0`) विश्व-पठनीय (`0444`) हैं बिना `sudo` के। हमारे सख्ती से `CPU`-केवल प्रोब (`dedicated_host = false`) के दौरान, एक स्वतंत्र सह-आवासी `llama-server` ने होस्ट `GPU` लॉक धारण किया:

| `Jetson AGX Thor` भौतिक शंट चैनल (`0444` रूट-रहित `sysfs`) | सीमा | पूर्व-आधाररेखा (`W`) | चरण 1 गणना (`measured_j` / `W`) | चरण 2 `DRAM+fsync` (`measured_j` / `W`) | पश्च-आधाररेखा (`W`) | विचलन (`F6`) एवं `Kepler` `C` चरण-2 त्रुटि |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`** (मॉड्यूल + कैरियर इनपुट) | **`L1`** | `100.70 W` | `122.12 J` (`101.66 W`) | `99.02 J` (`81.94 W`) | `97.21 W` | `3.47%` (`A2` रोका गया: सह-आवासी) · **`-67.02%`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`** (सह-आवासी `LLM`) | **`L2`** | `29.26 W` | `40.29 J` (`33.54 W`) | `26.00 J` (`21.52 W`) | `28.13 W` | बाह्य `GPU` सह-आवासी (`-36.1%` झूलन `F5` में) |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36.68 W` | `45.73 J` (`38.07 W`) | `44.37 J` (`36.71 W`) | `36.08 W` | `1.64%` (`CPU`/`SoC`/`MSS` डोमेन) · **`-70.01%`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`** (`5.08 V` रेल) | **`L1`** | `14.89 W` | `18.66 J` (`15.53 W`) | `16.82 J` (`13.92 W`) | `13.98 W` | **`6.13% > 5.0%` (`F6` सक्रिय)** · **`-68.85%`** |

चार `Falsifier 5` कैडेंस विंडो में, उतार-चढ़ाव वाले सह-किरायेदार `LLM` अनुरोधों ने `ch1 VDD_GPU` को `35.36 J` से घटाकर `22.60 J` (`-36.1%`) कर दिया, और पूरे-बोर्ड `INA238 VIN` (`L1`) को `107.48 J` से घटाकर `81.73 J` (`-24.0%`) तक ले गए, जबकि `ch2 VDD_CPU_SOC_MSS` `35.76-39.31 J` की सीमा के भीतर बना रहा। क्योंकि `dedicated_host = false` है (और `ch3 VIN_SYS_5V0` ने `6.13%` का विचलन दिखाया, जो `5.0%` से अधिक है), `SATB` पूरे-`SUT` के शुद्ध स्थापन दावों `A2` को रोक देता है, जबकि सटीक रेल-पृथक `measured_j` को सुरक्षित रखता है (`L1` और `L2` चैनलों का कभी योग नहीं किया जाता)।

3. **`Framework` `AMD` पर `PLATYPUS` `0440 root:energy` पृथक्करण और `Strix Halo` `APU` डोमेन सत्यापन**: `Framework` Desktop (`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`, `Linux 7.0.0-43-generic`) पर, `udev` नियम `90-energy-read.rules` `/sys/class/powercap/intel-rapl:0/energy_uj` (`package-0`) और `intel-rapl:0:0/energy_uj` (`core`) को मोड **`0440` (`root:energy`, `world_readable = false`)** पर सेट करता है: समूह-रहित `/work` सैंडबॉक्स `UID` को `EACCES` मिलता है (`PLATYPUS` साइड-चैनल को रोकते हुए), जबकि सुपरवाइज़र `GID` (`energy`) संचयी माइक्रोजूल को `24.34 µs` माध्यिका विलंबता पर बिना रूट अधिकार के पढ़ता है (`Step 7` में `0 µJ` अवशेष)। `hwmon9` (`amdgpu`) के निरीक्षण से एक खुला विनिर्देश विवरण और स्पष्ट हुआ: `Strix Halo` का एकीकृत `Radeon 8060S` विश्व-पठनीय (`0444`) `PPT` शक्ति (`µW` में `power1_input` / `power1_average`, चरण 1 में `75.38 W` / चरण 2 में `69.72 W`) प्रदर्शित करता है, न कि अलग `energy1_input` काउंटर; जबकि `cros_ec` (`hwmon8`) केवल पंखे और बोर्ड तापमान प्रदर्शित करता है।

4. **सेंसर बस कैडेंस भौतिकी (`I2C` बनाम `MSR`/`MMIO` बनाम `IOReport`) और सार्वभौमिक `Falsifier 3` ट्रिगर**: जहाँ `x86-64` `powercap` `sysfs` रीड `24.34-45.37 µs` में पूरे होते हैं (`100 Hz` नाममात्र पर `94.28-97.12 Hz` प्राप्त), वहीं `Jetson AGX Thor` पर प्रत्येक नौ-रजिस्टर `INA238`+`INA3221` स्नैपशॉट भौतिक `i2c@c600000` से **`2,948.8 µs` माध्यिका** (`4.48 ms` माध्य) में गुजरता है, जिससे `100 Hz` पोलिंग **`66.55 Hz`** तक सीमित हो जाती है (`macmon` की `7.44 Hz` `IOReport` सीमा से `8.9×` अधिक), जबकि `SATB` के `100 ms` (`10 Hz`) संदर्भ टिक पर यह **`9.49 Hz`** साफ़ रूप से प्राप्त करता है। सभी तीनों `Linux` होस्ट पर, `Kepler`-शैली `CPU`-समय आनुपातिक विभाजन (`C`) ने `192 MiB` `DRAM` + `fsync` चरण को **`67.02%` से `73.62%`** तक कम श्रेय दिया, जो चार सिलिकॉन आर्किटेक्चर में पुष्टि करता है कि `SATB` `C` को अतिव्यापी समानांतर रनों तक सीमित क्यों रखता है।

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. ओपन हार्डवेयर सत्यापन और सीमाएँ

| सत्र फ़ाल्सिफ़ायर | ट्रिगर होने पर परिणाम | इस अध्ययन में अनुभवात्मक स्थिति |
| :--- | :--- | :--- |
| **`F1` रीप्ले मिलान त्रुटि (`C9`)** | संदर्भ हार्नेस गैर-निर्धारित है | **सभी `4/4` होस्ट पर साफ़ किया गया (`0` बाइट अंतर `149,747 B`, `14` टर्न)** |
| **`F2` योग जाँच `> 5%` प्रयासों पर विफल** | होस्ट पर श्रेय विभाजन टूट गया | **सभी `4/4` होस्ट पर साफ़ किया गया (`0 µJ` Linux `RAPL`/shunt; `<= 1 µJ` `M5 Max`)** |
| **`F3` `B` और `C` क्रमिक रूप से `> 20%` असहमति** | `C` (`Kepler`) को होस्ट पर अविश्वसनीय चिह्नित किया गया | **`4/4` होस्ट पर ट्रिगर हुआ (`32.59%-73.62%` त्रुटि); `C` प्रतिबंधित** |
| **`F4` ज्ञात पल्स लोड सेंसर सटीकता के बाहर** | सत्र के लिए सेंसर को डाउनग्रेड किया गया | **खुला (`L0` स्मार्ट-प्लग सिंक-पल्स रिग अभी तक जुड़ा नहीं है)** |
| **`F5` `10 ms` बनाम `1 s` टिक विंडो ऊर्जा को शिफ्ट करता है** | टेलीमेट्री पर्यवेक्षक प्रभाव | **सफ़ाई की गई (`0.76%` `M5 Max` `L2` डेल्टा; `9.49-10.48 Hz` `100 ms` रेफ़ पर प्राप्त)** |
| **`F6` प्री/पोस्ट निवासी बेसलाइन `> 5.0%` ड्रिफ्ट** | व्युत्पन्न शुद्ध चैनल अमान्य किए गए | **सक्रिय (`124/188` `M5 Max` विंडोज + Linux को-टेनेंट ड्रिफ्टस साफ़ गेटेड)** |
| **`F7` एडाप्टर `C1`-`C12` पास करता है, कैनरी विफल** | अनुपालन अपर्याप्त; सत्र `void` | **सिमुलेशन में सत्यापित (`session_void = true` स्वैप पर)** |
| **`F8` `Lane B` मजबूत `Lane O` हार्नेस के नीचे रखता है** | `Lane B` को सख़्ती से फ़्लोर के रूप में रिपोर्ट किया गया | **सफ़ाई की गई (`24/24` एवं `6/6` समरूपता `Claude Code 2.1.330` के विरुद्ध)** |

तीन ठोस हार्डवेयर और एडाप्टर वस्तुएँ अभी भी खुली हैं (`OQ-5`):

1. **निर्धारित क्विश्ड `A2` सत्र और `L0` `AC` वॉल-प्लग कैलिब्रेशन**: भले ही भौतिक `TI INA238` (`L1`) और `INA3221` (`L2`/`L1`) शंट `measured_j` रेल अब `NVIDIA Jetson AGX Thor` पर प्रत्यक्ष रूप से सत्यापित हैं, साथ ही `Apple M5 Max`, `Framework AMD Strix Halo`, और `Intel Raptor Lake` पर रूटलेस `reported_j` काउंटर हैं, सभी चार बेंच मशीनें समानांतर को-टेनेंट वर्कलोड्स (`dedicated_host = false`) चलाती रही हैं, जिससे `A2` संपूर्ण-`SUT` प्लेसमेंट दावों को रोक दिया गया; अगले चरण में क्विश्ड समर्पित होस्ट पर सिंक-पल्स्ड `L0` `AC` मीटर (`Shelly` / `Yokogawa`) संलग्न करना है।

2. **एकीकृत-`GPU` `NVML` काउंटर जाँच `Jetson AGX Thor` पर**: `INA238` और `INA3221 ch1-ch3` (`VDD_GPU`, `VDD_CPU_SOC_MSS`, `VIN_SYS_5V0`) के लिए रूटलेस `sysfs` अनुमतियाँ (`0444`) और `Framework AMD Strix Halo` के `0440 root:energy` `RAPL` + `amdgpu PPT` (`energy1_input` अनुपस्थित) अब डिवाइस पर सत्यापित हैं; `Jetson AGX Thor` पर `nvmlDeviceGetTotalEnergyConsumption` को प्रोब करने के लिए साझा `GPU` लॉक के मुक्त होने पर एक निष्क्रिय विंडो का इंतजार है।

3. **व्यापक `Shape H` और `Shape I` लाइव रोस्टर**: इस अध्ययन में लाइव बाहरी-हार्नेस रन ने `Claude Code 2.1.330` पर `Shape H` को `Lane B` और `Shape D` के साथ प्रयुक्त किया; अगले चरण में `Codex CLI`, `OpenHands`, `Terminus-2`, और `Shape I` `Inspect` सॉल्वर पर लाइव `C1-C12` प्रमाणन चलाना है।

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## संदर्भ

<ol data-refs>
<li>Anthropic (2026). Claude Code sandboxing and MCP configuration documentation. <a href="https://docs.anthropic.com/en/docs/claude-code/security">https://docs.anthropic.com/en/docs/claude-code/security</a></li>
<li>ARC Prize Foundation (2026). ARC-AGI-3 interactive benchmarking and adapter harness specification. <a href="https://github.com/arcprize/">https://github.com/arcprize/</a></li>
<li>Chung, J.-W., Gu, Y., Jang, I., Meng, L., Bansal, N., &amp; Chowdhury, M. (2024). Zeus / ML.ENERGY: Understanding and optimizing GPU energy consumption of DNN training and inference. <em>NSDI 2023 / ML.ENERGY</em>. <a href="https://ml.energy/">https://ml.energy/</a></li>
<li>Cloud Native Computing Foundation (2025). Kepler (Kubernetes-based Efficient Power Level Exporter): Proportional CPU/GPU power attribution model. <a href="https://github.com/sustainable-computing-io/kepler">https://github.com/sustainable-computing-io/kepler</a></li>
<li>gerganov, g., &amp; contributors (2026). <code>llama.cpp</code> HTTP server and prompt-cache determinism documentation. <a href="https://github.com/ggml-org/llama.cpp">https://github.com/ggml-org/llama.cpp</a></li>
<li>Kwon, W., Li, Z., Zhuang, S., Sheng, Y., Zheng, L., Yu, C. H., et al. (2023/2026). Efficient memory management for large language model serving with PagedAttention and vLLM batch invariance notes. <em>SOSP 2023 / vLLM Docs</em>. <a href="https://docs.vllm.ai/">https://docs.vllm.ai/</a></li>
<li>Lipp, M., Kogler, A., Oswald, D., Schwarz, M., Easdon, C., Canella, C., &amp; Gruss, D. (2021). PLATYPUS: Software-based power side-channel attacks on x86. <em>IEEE Symposium on Security and Privacy (SP)</em>, 355-371. <a href="https://platypusattack.com/">https://platypusattack.com/</a></li>
<li>Luccioni, A. S., Jernite, Y., &amp; Strubell, E. (2024/2026). Power hungry processing and comparative disclosures of commercial AI energy figures. <em>FAccT / Hugging Face Blog</em>. <a href="https://huggingface.co/blog">https://huggingface.co/blog</a></li>
<li>Model Context Protocol (2025). MCP specification: Tools (`tools/list`, `tools/call`, and `tools/list_changed`). <a href="https://modelcontextprotocol.io/specification">https://modelcontextprotocol.io/specification</a></li>
<li>NVIDIA Corporation (2025/2026). Jetson Thor series power management, INA238 carrier, and INA3221 rail monitoring guide. <a href="https://docs.nvidia.com/jetson/">https://docs.nvidia.com/jetson/</a></li>
<li>Open Interface Engineering (2026). Metered Commit Gates; Task Satiation vs. Aggregate Rebound; Deterministic Null [same house]. <a href="https://research.openie.dev/">https://research.openie.dev/</a></li>
<li>OpenAI (2025/2026). Codex CLI Linux Landlock/seccomp and macOS Seatbelt sandboxing architecture. <a href="https://github.com/openai/codex">https://github.com/openai/codex</a></li>
<li>Rundgren, A., Jordan, B., &amp; Erdtman, S. (2020). JSON Canonicalization Scheme (JCS). <em>IETF RFC 8785</em>. <a href="https://www.rfc-editor.org/rfc/rfc8785">https://www.rfc-editor.org/rfc/rfc8785</a></li>
<li>Terminal-Bench Team (2025/2026). Terminal-Bench 2 and Terminus-2 (Harbor) terminal agent evaluation benchmark. <em>arXiv / GitHub</em>. <a href="https://github.com/laude-institute/terminal-bench">https://github.com/laude-institute/terminal-bench</a></li>
<li>UK AI Safety Institute (2025/2026). Inspect Evals: ReAct solver (`react()`) and Inspect Agent Bridge documentation. <a href="https://inspect.aisi.org.uk/">https://inspect.aisi.org.uk/</a></li>
<li>vladkens (2025/2026). <code>macmon</code>: Sudoless Apple Silicon power and performance monitoring CLI over <code>IOReport</code>. <a href="https://github.com/vladkens/macmon">https://github.com/vladkens/macmon</a></li>
<li>Wang, X., Li, B., Song, Y., Xu, F. F., Tang, X., Zhuge, M., et al. (2025). OpenHands: An open platform for AI software developers as generalist agents. <em>ICLR 2025</em>.</li>
<li>Xie, T., Zhang, D., Chen, J., Li, X., Zhao, S., Cao, R., et al. (2024). OSWorld: Benchmarking multimodal agents for open-ended tasks in real computer environments. <em>NeurIPS 2024</em>.</li>
<li>Yang, J., Jimenez, C. E., Wettig, A., Lieret, K., Yao, S., Narasimhan, K., &amp; Press, O. (2024/2025). SWE-agent: Agent-computer interfaces enable automated software engineering, and <code>mini-swe-agent</code> reference implementation. <em>NeurIPS 2024 / GitHub</em>. <a href="https://github.com/SWE-agent/mini-swe-agent">https://github.com/SWE-agent/mini-swe-agent</a></li>
<li>Yang, Z., Adamek, K., &amp; Armour, W. (2024). Accurate and convenient energy measurements for GPUs: Detailed study of <code>nvidia-smi</code> part-time power sampling. <em>arXiv:2312.12741</em>.</li>
</ol>
