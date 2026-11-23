---
title: "Satiation Benchmark: संदर्भ हार्नेस, एडाप्टर और टेलीमेट्री श्रेय-निर्धारण"
deck: "एक स्थिर अनुक्रमिक Rust संदर्भ हार्नेस (Lane B), एक प्रॉक्सी-प्रवर्तित एकल एडाप्टर सेतु (Shapes D, M, H, और I), एक बारह-जाँच अनुरूपता सूट (C1 से C12), और पाँच-स्तरीय रूटलेस टेलीमेट्री श्रेय-निर्धारण इंजन (L0 से L4, जो A1 से N लेबलों के साथ क्रॉस होते हैं)। इसे पाँच हार्डवेयर आर्कटाइप्स पर अनुभवजन्य रूप से सत्यापित किया गया है: Apple M5 Max (arm64 macOS IOReport और proc_pid_rusage के `reported_j` के साथ), Tegra aarch64 Jetson Thor (भौतिक संपूर्ण-बोर्ड और तीन-चैनल रेल-पृथक करंट-शंट `measured_j` के साथ), Framework Desktop Strix Halo (x86-64 Linux पर 0440 root:energy समूह-पृथक पैकेज-ऊर्जा `reported_j` के साथ, तथा ग्राफ़िक्स-पैकेज पावर ट्रैकिंग), Intel Core i9-13900H Raptor Lake (x86-64 Linux प्लेटफ़ॉर्म L1 और पैकेज-0 L2 `reported_j` के साथ), और Windows 11 पर Intel Core i7-1165G7 Tiger Lake तथा GeForce 2060 (x86-64 build 26300, रूटलेस संचयी डिस्क्रीट-ग्राफ़िक्स L2 `reported_j`, Win32 Job Object और चक्र लेखा, तथा प्रोसेसर-पैकेज लेबल N के साथ)। कच्चे `measured_j`, `reported_j`, और L4 तार्किक चैनल सख़्ती से अलग रखे जाते हैं और उन्हें कभी जोड़ा नहीं जाता। चूँकि सह-किरायेदार कार्यभार साझा होस्ट्स पर चले थे (dedicated_host is false), इसलिए Falsifier 6 के अनुसार A2 नेट प्लेसमेंट श्रेय-निर्धारण रोका गया है।"
lang: "hi"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*पुनरीक्षण af57f48, 22 नवंबर 2026. डेटा और डाइजेस्ट सारांश: [डेटा](/data/#satb-harness). इंटरैक्टिव जीवंत आकृतियाँ: [जीवंत आकृतियाँ](/living/satb-harness/). LaTeX अभिलेखीय संस्करण: [PDF](/pdfs/latex/satb-harness.pdf) ([स्रोत](/pdfs/latex/satb-harness.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. अवलोकन

जब दो एजेंट मूल्यांकन भिन्न कार्य-पूर्णता दर या भिन्न ऊर्जा आँकड़े रिपोर्ट करते हैं, तो अंतर प्रायः स्वयं मॉडल से नहीं, बल्कि इस बात से उत्पन्न होता है कि मॉडल को किस प्रकार लपेटा गया (wrap) और होस्ट काउंटरों का श्रेय किस प्रकार निर्धारित किया गया। केवल आसपास के हार्नेस को बदलने से `Terminal-Bench 2` पर `Gemini 2.5 Pro` का कार्य-समाधान `17` प्रतिशत अंक खिसक गया, जबकि किसी विचलित निष्क्रिय आधाररेखा (idle baseline) को घटाना या एक साझा सिलिकॉन रेल को प्रोसेसर समय के आधार पर विभाजित करना ऊर्जा-श्रेय निर्धारण को `30%` से अधिक विकृत कर सकता है।

यह अध्ययन **Satiation Benchmark (`SATB`)** मूल्यांकन अनुबंध को निर्दिष्ट करता है और अनुभवसापेक्ष रूप से सत्यापित करता है: एक स्थिर क्रमिक Rust संदर्भ हार्नेस (**`Lane B`**), शून्य-मॉडल नियंत्रण, कच्चे मॉडल अंतबिंदु, बाह्य कमांड-लाइन हार्नेस, और सार्वजनिक बेंचमार्क सॉल्वर के लिए एक प्रॉक्सी-अलगाव एडाप्टर ब्रिज (**`Shapes D, M, H, और I`**), एक पाँच-ब्लॉक सिस्टम-अंडर-टेस्ट (`SUT`) क्रिप्टोग्राफ़िक फिंगरप्रिंट, बारह अनिवार्य अनुरूपता जाँचें, और पाँच-स्तरीय रूटलेस टेलीमेट्री इंजन। डिजाइन को अपरिमापित न छोड़ते हुए, हम **पाँच हार्डवेयर आर्केटाइप** पर लाइव अनुरूपता और फाल्सिफ़ायर बेंचमार्क निष्पादित करते हैं, जो `macOS`, `Linux`, और `Windows 11` को कवर करते हैं: एक `Apple M5 Max` वर्कस्टेशन (`128` गीगाबाइट एकीकृत मेमोरी, `macOS 27.2.1`, ऑन-चिप `IOReport` और कर्नेल `proc_pid_rusage` `reported_j`), एक Tegra `aarch64` डेवलपर किट (`Jetson Thor`, `Linux 6.8.12-1021-tegra`, फिजिकल Texas Instruments पूर्ण-बोर्ड और तीन-चैनल रेल-विभक्त करंट-शंट `measured_j`), एक `Framework` डेस्कटॉप `Strix Halo` वर्कस्टेशन (`Ryzen Max+ 395`, `Linux 7.0.0-43-generic x86-64`, `0440 root:energy` ग्रुप-अलगाव पैकेज-एनेरजी `reported_j` प्लस `amdgpu` पैकेज-पावर ट्रैकिंग), एक `Raptor Lake` वर्कस्टेशन (`Intel Core i9-13900H`, `Linux 7.0.0-43-generic x86-64`, प्लेटफ़ॉर्म और पैकेज एनेरजी `reported_j`), और एक बियर-मेटल `Windows 11` वर्कस्टेशन (`Intel Core i7-1165G7` प्लस `GeForce 2060`, `Windows 11` बिल्ड `26300` `x86-64`, रूटलेस संचयी डिस्क्रीट-ग्राफिक्स `reported_j`, Win32 Job Object सीमाबद्धता, और अनअधिकारित प्रोसेसर-पैकेज एनेरजी स्पष्ट रूप से `not_available` द्वारा चिह्नित), साथ ही बंद क्लाउड सर्वर एनेरजी (`not_available`)।

**सरल शब्दों में**

1. एक एजेंट का प्रॉम्प्ट लूप, संदर्भ-छंटाई (context-trimming) का नियम और टूल सैंडबॉक्स बेंचमार्क स्कोर को उतना ही बदल सकते हैं जितना अंतर्निहित मॉडल बदलने से होता है। इसलिए `Lane B` उस रैपर को निर्धारक (deterministic) Rust में पूरी तरह स्थिर रखता है, जबकि `Lane O` बाहरी रैपरों को एक ही ऑडिट किए गए प्रॉक्सी प्लग के माध्यम से चलने के लिए बाध्य करता है।

2. ऊर्जा चैनल उनकी वास्तविक भौतिक सीमा पर कच्चे रूप में दर्ज किए जाते हैं: संपूर्ण दीवार-प्लग (whole wall plug), बोर्ड इनपुट, चिप पैकेज, ऑपरेटिंग-सिस्टम प्रोसेस अनुमान, या तार्किक टोकन खाता। इन्हें किसी एक बिना लेबल वाली संख्या में नहीं मिलाया जाता, साक्ष्य वर्गों (`measured_j` बनाम `reported_j` बनाम `est_j`) के बीच जोड़ा नहीं जाता, और न ही बेड़े (fleet) के स्थिरता औसतों से भरा जाता है।

3. पाँच सिलिकॉन और ऑपरेटिंग-सिस्टम प्लेटफ़ॉर्मों (`macOS`, `Linux`, और `Windows 11`) पर लाइव परीक्षण निम्नलिखित सत्यापित करते हैं: सटीक `Shape D` मिलियन-रिकॉर्ड मेमोरी-मैप्ड (`15027705736`) और `C9` रीप्ले (`149,747 B`, `0` न्यूलाइन या बाइट अंतर) का निर्धारणवाद; `0.87-9.54 ms` कर्नल प्रोसेस-ट्री क्लीनअप (`Windows 11` पर Win32 Job Objects के माध्यम से `2.46 ms`); तीन विक्रेताओं में क्लाउड `temperature = 0` की गैर-निर्धारकता; हार्डवेयर सेंसर की कैडेंस सीमाएँ: `Linux` काउंटर रीड्स `94-97 Hz` पर `24.3-45.4 µs`, `Windows` इन-प्रोसेस ग्राफ़िक्स-काउंटर रीड्स `64.6 Hz` पर `1.17 ms`, `Jetson Thor` पर सीरियल-बस शंट रीड्स `66.6 Hz` पर `2.95 ms`, और `macmon` `IOReport` `~8 Hz`; प्रोसेसर समय द्वारा अनुक्रमिक compute-plus-storage चरणों को विभाजित करते समय `32.59%-89.88%` त्रुटि (`Falsifier 3`); तथा भौतिक ग्राफ़िक्स-बनाम-प्रोसेसर शंट रेल पृथक्करण, साथ ही `Falsifier 6` साझा-होस्ट ड्रिफ्ट गेटिंग (`dedicated_host = false`)।

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. शब्द, संक्षेप और श्रेय-निर्धारण लेबल

<ul id="terms">
<li>SATB, SUT, PFRK, OQ, SPEC, BUNDLE, SUBMIT, REFUSE, STOP: Satiation Benchmark हार्नेस और श्रेय-निर्धारण विनिर्देश, परीक्षण के अधीन प्रणाली (system under test), चार-प्रकारीय प्रयास परिणाम (सफल, विफल, अस्वीकार, समाप्त), हल किया गया विनिर्देश प्रश्न, मानक विनिर्देश दस्तावेज़, कार्य बंडल फ़ाइल, अंतिम उत्तर प्रस्तुति कॉल, अंतिम अस्वीकृति कॉल, और अनुक्रमिक लूप रोकने वाला टोकन</li>
<li>ACI, SWE, CLI, MCP, SDK, ACP, ARC, AGI, GUI: Agent-Computer Interface (एजेंट-कंप्यूटर इंटरफ़ेस), सॉफ़्टवेयर इंजीनियरिंग बेंचमार्क उपसर्ग, command-line interface (कमांड-लाइन इंटरफ़ेस), Model Context Protocol, software development kit (सॉफ़्टवेयर विकास किट), Agent Client Protocol, Abstraction and Reasoning Corpus, artificial general intelligence बेंचमार्क सूट, और graphical user interface (ग्राफ़िकल यूज़र इंटरफ़ेस)</li>
<li>IO, JSON, JSONL, RPC, JCS, UTF, HTTP, SSE, URL: input/output प्रोटोकॉल, JavaScript Object Notation, पंक्ति-सीमांकित JSON (line-delimited JSON), remote procedure call (दूरस्थ प्रक्रिया कॉल), JSON Canonicalization Scheme (RFC 8785), Unicode Transformation Format, Hypertext Transfer Protocol, Server-Sent Events, और Uniform Resource Locator</li>
<li>POSIX, MMAP, DNULLMM1, SHA, SIGKILL, ESRCH, EACCES, EOF, NT, NTFS, CRLF, MSVC, UCRT, FFI, DLL: पोर्टेबल ऑपरेटिंग सिस्टम इंटरफेस, मेमोरी-मैप्ड फाइल इंटरफेस, द्विआधारी मेमोरी-मैप्ड डिटर्मिनिस्टिक नल इंडेक्स प्रारूप, सिक्योर हैश एल्गोरिदम (SHA-256), गैर-ग्रहणीय POSIX प्रक्रिया समाप्ति संकेत, कर्नेल नो-सच-प्रोसेस स्थिति, POSIX अनुमति-अस्वीकृत त्रुटि स्थिति, अंत-ऑफ-फाइल हियरडॉक डेलिमिटर, विंडोज न्यू टेक्नोलॉजी कर्नेल (`Windows NT`), न्यू टेक्नोलॉजी फाइल सिस्टम, कैरिज-रिटर्न लाइन-फीड (`\r\n`) न्यूलाइन अनुक्रम, माइक्रोसॉफ्ट विजुअल सी++ कंपाइलर (`cl.exe`), विंडोज यूनिवर्सल सी रनटाइम (`ucrtbase.dll`), विदेशी फंक्शन इंटरफेस, और डायनामिक-लिंक लाइब्रेरी</li>
<li>AI, ML, LLM, MLX, GGUF, KV, TP, ENERGY: कृत्रिम बुद्धिमत्ता, मशीन लर्निंग, बड़ा भाषा मॉडल (large language model), स्थानीय अनुमान के लिए Apple array फ़्रेमवर्क, GPT-Generated Unified Format क्वांटाइज़्ड वेट, की-वैल्यू कैश (key-value cache), टेंसर पैरेलेलिज़्म (tensor parallelism), और ML.ENERGY GPU पावर बेंचमार्क कंसोर्टियम</li>
<li>CPU, GPU, APU, ANE, SoC, ALU, ISA, IPC, PID, UID, GID, OS, VM, EC, GB, TGL, RTX: सेंट्रल प्रोसेसिंग यूनिट, ग्राफिक्स प्रोसेसिंग यूनिट, एक्सेलरेटेड प्रोसेसिंग यूनिट, एप्पल न्यूरल इंजन, सिस्टम-ऑन-चिप, अरिथमेटिक लॉजिक यूनिट, इंस्ट्रक्शन सेट आर्किटेक्चर, इंस्ट्रक्शंस पर साइकल, प्रोसेस आइडेंटिफायर, यूजर आइडेंटिफायर, ग्रुप आइडेंटिफायर, ऑपरेटिंग सिस्टम, वर्चुअल मशीन, एम्बेडेड कंट्रोलर, गीगाबाइट्स, इंटेल टाइगर लेक मोबाइल आर्किटेक्चर, और एनवीडिया जियोफोर्स RTX डिस्क्रीट जीपीयू परिवार</li>
<li>RAM, DRAM, SLC, NVMe, PSU, PDU, AC, DC, DVFS, MSR, MMIO, RDTSC, HVCI, WMI, EMI, SRUM: रैंडम-ऐक्सेस मेमोरी, डायनामिक RAM, सिस्टम-स्तरीय कैश, नॉन-वोलॅटाइल मेमोरी एक्सप्रेस, पावर सप्लाई यूनिट, पावर डिस्ट्रीब्यूशन यूनिट, अल्टरनेटिंग करंट, डायरेक्ट करंट, डायनामिक वोल्टेज एवं फ़्रीक्वेंसी स्केलिंग, मॉडल-स्पेसिफिक रजिस्टर, मेमोरी-मैप्ड इनपुट/आउटपुट, x86 रीड टाइम-स्टैम्प काउंटर इंस्ट्रक्शन, विंडोज़ हाइपरवाइज़र-प्रोटेक्टेड कोड इंटेग्रिटी, विंडोज़ मैनेजमेंट इंस्ट्रूमेंटेशन, विंडोज़ एनर्जी मीटरिंग इंटरफ़ेस (`\\.\EnergyMeter`), और विंडोज़ सिस्टम रिसोर्स उपयोग मॉनिटर</li>
<li>RAPL, NVML, PPT, TI, I2C, ADC, INA, INA238, INA3221, AGX, VDD, SOC, MSS, VIN, SYS, PLATYPUS: Intel/AMD Running Average Power Limit, NVIDIA Management Library, AMD Package Power Tracking, Texas Instruments, Inter-Integrated Circuit बस, analog-to-digital converter (एनालॉग-से-डिजिटल कनवर्टर), Texas Instruments धारा/शक्ति मॉनिटर परिवार (`INA238`, `INA3221`), NVIDIA Jetson AGX मॉड्यूल श्रेणी, drain supply voltage रेल, system-on-chip रेल, मेमोरी सबसिस्टम रेल, इनपुट सिस्टम वोल्टेज रेल, और Power Leakage Attacks: Targeting Your Processor Using Software</li>
<li>API, USD, CNCF, AISI, UK, AMD, NVIDIA: आवेदन प्रोग्रामिंग इंटरफ़ेस, संयुक्त राज्य डॉलर, क्लाउड नेटिव कंप्यूटिंग फाउंडेशन, एआई सुरक्षा संस्थान, यूनाइटेड किंगडम, एडवांस्ड माइक्रो डिवाइसेस, और NVIDIA कॉर्पोरेशन</li>
<li>RCE, MoL, WCA, LUT6: रियलिटी कोड इंजन [समान संस्थान], सीमाओं का मिश्रण [समान संस्थान], बुद्धिमान कंप्यूटर स्वचालन [समान संस्थान], और 6-इनपुट बूलियन लुक-अप तालिका</li>
</ul>

सभी टेलीमेट्री स्तरों L0 से L4 में, `SATB` रसीद में दर्ज प्रत्येक चैनल अपनी भौतिक सीमा और चार कठोर साक्ष्य वर्गों में से एक को साथ रखता है:

| साक्ष्य वर्ग | `SATB` रसीदों और तालिकाओं में व्याप्ति |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | कार्य बंडलों, पाँच-ब्लॉक `SUT` फिंगरप्रिंट और रिप्ले ट्रांसक्रिप्ट के लिए `SHA-256` और `JCS` (`RFC 8785`) कैनोनिकल डाइजेस्ट; प्रॉक्सी-लॉग्ड प्रॉम्प्ट, कैश, रीज़निंग और पूर्णता टोकन गणनाएँ; वॉल-क्लॉक अवधियाँ; और तिथि-अंकित `API` सूची-मूल्य `USD`। |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | केवल कैलिब्रेटेड बाहरी `AC` वॉल एनालाइज़र (`L0`) या भौतिक बोर्ड करंट-शंट मॉनिटर (`L1`/`L2`) से भरा जाता है। `NVIDIA Jetson AGX Thor` पर `TI` `INA238` (`hwmon6` `VIN`, `L1`) और `INA3221` (`hwmon5` `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS`, `ch3 VIN_SYS_5V0`, `L2`/`L1`; `board_metered = true`) के माध्यम से लाइव सत्यापित। चूँकि कैप्चर के दौरान एक सक्रिय सह-किरायेदार ने `VDD_GPU` को थामे रखा (`dedicated_host = false`), कच्चा रेल `measured_j` सुरक्षित रखा गया जबकि `A2` शुद्ध प्लेसमेंट श्रेय-निर्धारण रोका गया। `Apple M5 Max`, `AMD Strix Halo`, `Intel Raptor Lake` और `Windows 11` (`i7-1165G7` + `RTX 2060`) पर `measured_j` `None` रहता है, और पूरे में `L0` वॉल पावर अनसेट है। |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | रूटलेस ऑन-चिप टेलीमेट्री काउंटर (`Apple M5 Max` पर `macmon` के माध्यम से `L1` पर `IOReport` `sys_power` और `L2` पर `chip_power`/`cpu_power`/`gpu_power`; `Intel Raptor Lake` पर `L1` पर `RAPL` `psys` और `L2` पर `package-0`/`core`/`uncore`; `Framework AMD Strix Halo` पर `L2` पर `RAPL` `package-0`/`core` तथा `amdgpu` `PPT` वाट; `Windows 11` पर `NVIDIA GeForce RTX 2060` के लिए `L2` पर रूटलेस `NVML` `nvmlDeviceGetTotalEnergyConsumption` संचयी `mJ`) और `OS`-मॉडल्ड प्रति-प्रक्रिया अनुमान (`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` `L3` पर, लेबल `D`)। इन्हें कभी `measured_j` या `est_j` के साथ जोड़ा नहीं जाता। |
| **`Provider-Attested (P) vs. Not Available (N)`** | क्लोज़्ड `API` रिमोट सर्वर ऊर्जा (और Windows 11 यूज़र-मोड `CPU` पैकेज ऊर्जा, जहाँ ring-0 `RAPL` `MSR` ड्राइवर प्रतिबंधित हैं) केवल तभी `P` के रूप में लिखी जाती है जब कोई प्रदाता सत्यापित पद्धति के साथ प्रति-अनुरोध ऊर्जा आंकड़ा लौटाए। अन्यथा इसे शाब्दिक रूप से `"not_available"` (लेबल `N`) लिखा जाता है। व्युत्पन्न बेसलाइन घटाव जो `5.0%` ड्रिफ्ट सीमा (`Falsifier 6`) या `Step 7` योग जाँच में विफल रहते हैं, स्वतः हटा दिए जाते हैं, जबकि कच्चे चैनल अक्षुण्ण रहते हैं। |

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

## 2. एजेंट हार्नेस का सर्वेक्षण और संदर्भ नीति प्रणाली का हिस्सा क्यों है

आधुनिक कोडिंग, टर्मिनल और कंप्यूटर-उपयोग हार्नेस इस बात में काफ़ी भिन्न हैं कि वे टूल कैसे उपलब्ध कराते हैं, फ़ाइल संपादन को कैसे नियंत्रित करते हैं, और बढ़ते वार्तालाप इतिहास को कैसे संक्षिप्त करते हैं:

| हार्नेस | लूप और टूल सतह | संदर्भ और इतिहास नीति |
| :--- | :--- | :--- |
| **`mini-swe-agent`** | केवल `Bash`। हर क्रिया एक नया, अवस्था-रहित `subprocess.run` शुरू करती है। | सख़्ती से रैखिक, केवल-जोड़ने वाला संदेश इतिहास; कोई स्वचालित संक्षेपण नहीं। |
| **`SWE-agent` (`ACI`)** | 100-पंक्ति की विंडोयुक्त फ़ाइल व्यूअर, लिंटर-नियंत्रित संपादन कमांड, संक्षिप्त खोज। | इतिहास प्रोसेसर पुराने पर्यावरण अवलोकनों को सीमित सारांशों में समेटता है। |
| **`Inspect react()`** | `submit()` तक अनुक्रमिक टूल लूप: `bash()`, `text_editor()`, `MCP` टूल। | संपादन योग्य संदेश अवस्था, जिसमें प्लग-इन योग्य इतिहास छंटनी या संक्षेपण सॉल्वर होते हैं। |
| **`Inspect Agent Bridge`** | `Claude Code`, `Codex CLI`, `Gemini CLI` और कस्टम `SDK` एजेंटों को स्थानीय प्रॉक्सी के पीछे लपेटता है। | संदर्भ प्रबंधन पूरी तरह से लपेटे गए बाहरी हार्नेस को सौंपा जाता है। |
| **`Terminus-2` (`Harbor`)** | एकल टूल: कच्चे कीस्ट्रोक प्राप्त करने वाला स्थायी `tmux` टर्मिनल सत्र। | तीन-चरणीय संदर्भ सारांशन (`3-stage` क्रमिक प्रतिलेख संपीड़न)। |
| **`Codex CLI`** | सैंडबॉक्स्ड शेल (`Landlock`/`seccomp` या `seatbelt`), संरचित `apply_patch`, `MCP`। | मॉडल विंडो सीमा के निकट शुरू होने वाला मूल रोलिंग संदर्भ संक्षेपण। |
| **`Claude Code`** | `Bash`, संरचित फ़ाइल टूल (`Read`, `Write`, `Edit`, `Glob`, `Grep`), `MCP`। | स्वचालित LLM-आधारित वार्तालाप संक्षेपण (`auto-compact`) के साथ प्रॉम्प्ट कैशिंग। |
| **`OpenHands`** | कंटेनरों में किसी भी `ACP` या `CodeAct` कोडिंग एजेंट को चलाने वाला इवेंट-स्ट्रीम रनटाइम। | कॉन्फ़िगर करने योग्य संदर्भ कंडेंसर (`LLM` सारांशन या विंडो मास्किंग)। |
| **`ARC-AGI-3` रनर** | इंटरैक्टिव ग्रिड अवस्थाओं पर मानक हार्नेस बनाम प्रोवाइडर एडाप्टर हार्नेस। | प्रति एडाप्टर ट्रैक में घोषित सीमित दृश्य/ग्रिड अवस्था प्रक्षेप-पथ विंडो। |
| **`OSWorld run.py`** | VM स्क्रीनशॉट पर `pyautogui` माउस/कीबोर्ड क्रियाएँ उत्सर्जित करने वाला डेस्कटॉप `GUI` लूप। | स्लाइडिंग प्रक्षेप-पथ विंडो, जो केवल नवीनतम $K$ स्क्रीनशॉट और क्रियाएँ रखती है। |

`Terminal-Bench 2` पर, जब मॉडल चेकपॉइंट समान रखा गया, तब `Gemini 2.5 Pro` ने `Terminus-2` के साथ जोड़े जाने पर `OpenHands` के साथ जोड़े जाने की तुलना में **`17%` अधिक कार्य** सफलतापूर्वक हल किए। इसलिए संदर्भ प्रबंधन, आउटपुट छंटनी, संपादन लिंटिंग और पुनःप्रयास नियम तटस्थ प्लंबिंग न होकर मूल्यांकित प्रणाली के प्रथम-श्रेणी घटक हैं। `SATB` मूल्यांकन को दो स्पष्ट लेनों में विभाजित करके इस भ्रम को हल करता है और खुले प्रश्न `OQ-1` और `OQ-2` को बंद करता है:

1. **रैपर को स्थिर रखना (`Lane B`) बनाम बाहरी रैपरों का मूल्यांकन (`Lane O`)**: `Lane B` (`satb-agent`) सभी मॉडलों के लिए एकल ऑडिटेबल Rust लूप को स्थिर रखता है, जबकि `Lane O` पूर्ण तृतीय-पक्ष हार्नेस (`Claude Code`, `Codex CLI`, `OpenHands`, `Terminus-2`, `Inspect`) को ब्लैक-बॉक्स `SUT` के रूप में लपेटता है जिनके आंतरिक प्रॉम्प्ट और संकुचन कॉल `harness` फिंगरप्रिंट ब्लॉक में हैश किए जाते हैं और 100% `satb-proxy` के माध्यम से रूट किए जाते हैं।
2. **संदर्भ नीति समाधान (`OQ-1`: `ContextRule_v0`)**: शून्य एलीजन के साथ प्रयास को हार्ड-किल करना बहु-चरणीय तर्क को विस्तृत टूल आउटपुट के साथ मिला देता है, जबकि `LLM`-जनित सारांशण (`Claude Code` ऑटो-कॉम्पैक्ट) छिपे स्टोकेस्टिक मॉडल कॉल इंजेक्ट करता है जो निर्धारणात्मक हार्नेस रिप्ले को तोड़ता है। `Lane B` **`ContextRule_v0`** अपनाता है: जब भी संचित वार्तालाप आकार घोषित संदर्भ विंडो के **`80%`** से अधिक हो जाता है, तो हार्नेस पुराने टूल आउटपुट को निर्धारणात्मक रूप से `"[ELIDED_BY_CONTEXT_RULE_V0]"` से प्रतिस्थापित कर देता है जबकि `system(TEMPLATE_v0)`, प्रारंभिक `user(render(bundle))`, और **सबसे हाल के `8` टूल आउटपुट** को शाब्दिक रूप से बनाए रखता है, जिससे **शून्य मॉडल कॉल** होते हैं। कठोर `killed(context_ceiling)` केवल तभी सक्रिय होता है जब वे रखे गए संदेश अकेले विंडो के `100%` से अधिक हो जाते हैं।
3. **टूल सरफेस समाधान (`OQ-2`: `TOOLS_v0`)**: शुद्ध `exec`-केवल (`mini`-शैली) मॉडलों को मल्टी-लाइन स्रोत पैच और बीजगणितीय प्रमाणों (`cat << 'EOF'`) के लिए शेल-एस्केप करने के लिए बाध्य करता है, जिससे शेल-कोटिंग विफलताएँ उत्पन्न होती हैं जो कार्य तर्क से असंबद्ध हैं और `macOS`, `Linux`, तथा `Windows` पर पोर्टेबल रूटलेस सैंडबॉक्सिंग को जटिल बनाती हैं। `Lane B` **`TOOLS_v0`** को स्थिर करता है, जिसमें चार कार्यस्थान टूल (`exec`, `read_file`, `write_file`, `list_dir`) तथा दो टर्मिनल टूल (`submit`, `refuse`) शामिल हैं, जो `JCS` के माध्यम से `tools_hash` (`d5b102...`) में कैनोनिकलाइज्ड हैं।

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

### एक पर्यवेक्षक और प्रॉक्सी के पीछे चार एडाप्टर आकार

`Lane B` के बाहर की कोई भी प्रणाली `satb-supervisor` से चार एडाप्टर आकारों में से एक के माध्यम से जुड़ती है:

| एडाप्टर आकार | लक्षित प्रणाली | निष्पादन व पृथक्करण अनुबंध | पुन: उपयोग किए गए मानक |
| :--- | :--- | :--- | :--- |
| **`Shape D` (`dnull` नियंत्रण)** | निर्धारित शून्य (`N0` कठोर मॉडल-रहित और `N1` विकास-क्रिस्टलीकृत) फ्रोज़न `DNULLMM1` `mmap` स्टोर्स के ऊपर | `/work` के भीतर समान `TOOLS_v0` और `Verifier` नियमों के तहत निष्पादित होता है, निर्णय समय पर **`0` प्रॉक्सी मॉडल कॉल्स** के साथ। | `POSIX mmap` / Win32 `MapViewOfFile`, `SPEC v0.4` 64-बिट पूर्णांक लूप |
| **`Shape M` (मॉडल अंत-बिंदु)** | स्थानीय ओपन-वेट सर्वर और बंद क्लाउड `API`s | `Lane B` `satb-agent` को `Chat Completions` या `Messages` पर चलाता है, टूल कॉल्स और अनिवार्य `usage` के साथ, 100% `satb-proxy` के माध्यम से निर्देशित। | OpenAI-संगत `API` (`llama.cpp`, `mlx_lm`, `vLLM`); `Anthropic`, `Gemini`, `xAI` अनुवादक |
| **`Shape H` (बॉक्स में हार्नेस)** | `Claude Code`, `Codex CLI`, `Gemini CLI`, `OpenHands`, `Terminus-2` | कार्य को `/work/task/BUNDLE.md` में लिखा गया। आधार `URL` `satb-proxy` (`127.0.0.1:<port>`) की ओर संकेत करता है; वास्तविक `API` कुंजियाँ `/work` से अलग रखी गईं; समाप्ति `MCP` `submit` या `refuse` द्वारा; अन्य कोई निकास नहीं। | `Inspect` सैंडबॉक्स ब्रिज परिवेश चर; `--strict-mcp-config` `MCP`; वैकल्पिक `ACP` |
| **`Shape I` (`Inspect` एजेंट)** | मौजूदा सार्वजनिक बेंचमार्क `Inspect` समाधानकर्ता | `SATB` कार्य बंडल को `submit` और `refuse` टूल्स के साथ `attempts = 1` पर रैप करता है, मॉडल कॉल्स को `satb-proxy` के माध्यम से रूट करता है। | `UK AISI Inspect` `Task` और `Solver` इंटरफ़ेस |

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
| **`C1` Bundle round-trip** | एडाप्टर इनपुट कार्य बंडल के सटीक `JCS` `SHA-256` डाइजेस्ट को प्रतिध्वनित करता है। |
| **`C2` Submit path** | बाहरी `Verifier` को `satb-proxy` / `MCP` टर्मिनल कैप्चर पर लॉग किए गए सटीक बाइट अनुक्रम प्राप्त होते हैं। |
| **`C3` Refuse path** | एक अनुदेशित अस्वीकृति `refuse` (`sub_reason = "other"`, `completion_score = 0`) के रूप में स्वच्छ रूप से आती है। |
| **`C4` One terminal call** | पहले `submit` या `refuse` के बाद उत्सर्जित कोई भी टूल या टर्मिनल कॉल अनदेखी की जाती है और गिनी जाती है। |
| **`C5` No oracle** | `Verifier` और `satb-supervisor` निर्देशिकाएँ, सॉकेट, तथा पैरेंट पथ (`..`) `/work` से अप्राप्य हैं। |
| **`C6` Egress** | केवल `satb-proxy` (`127.0.0.1:<port>`) मॉडल ट्रैफिक के लिए पहुँच योग्य है; `/work` उपप्रक्रियाओं की बाहरी नेटवर्क पहुँच शून्य है और अपस्ट्रीम `API` कुंजियाँ शून्य हैं। |
| **`C7` Usage present** | प्रत्येक मॉडल कॉल `usage` (`missing -> killed(usage_missing)`) के साथ आती है; प्रॉक्सी टोकन योग अपस्ट्रीम इंजन गणनाओं से बिल्कुल मेल खाते हैं। |
| **`C8` Fingerprint stable** | पाँच-ब्लॉक `SUT` फिंगरप्रिंट `SHA-256` 3-प्रयास ड्राई रन से पहले और बाद में समान है। |
| **`C9` Harness replay** | रिकॉर्डेड `satb-proxy` प्रतिक्रियाओं को दोहराने से बाइट-समान ट्रांसक्रिप्ट पुनः उत्पन्न होता है (`0` बाइट या `CRLF` अंतर; `Lane B` के लिए अनिवार्य)। |
| **`C10` Kill path** | अनियंत्रित `/work` प्रक्रिया वृक्ष (`POSIX` प्रक्रिया समूह या Win32 Job Object, जिसमें अलग किए गए चाइल्ड प्रक्रियाएँ शामिल हैं) `< 2,000 ms` के भीतर काटा जाता है और `killed` के रूप में दर्ज किया जाता है। |
| **`C11` Telemetry handshake** | रूटलेस `L3` प्रक्रिया काउंटर (`cgroup v2`, `proc_pid_rusage`, या Win32 `GetProcessTimes`/`QueryProcessCycleTime`) पठनीय हैं, चरण चिह्न आते हैं, और मोनोटोनिक-से-वॉल क्लॉक ऑफसेट दर्ज किया जाता है। |
| **`C12` Determinism probe** | `8` समान अनुरोध निष्पादित किए जाते हैं और भिन्न आउटपुट की संख्या एक अनुभवजन्य `SUT` गुण के रूप में दर्ज की जाती है। |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. पाँच-स्तरीय टेलीमेट्री श्रेय-निर्धारण (L0-L4 × A1-N), प्लेटफ़ॉर्म चैनल मानचित्र, और जो नहीं निर्धारित किया जा सकता

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="पाँच-स्तरीय टेलीमेट्री श्रेय-निर्धारण सीमाएँ L0 से L4 तक लेबल A1 से N तक पार करती हुई और सात-कदम कच्चा-पहला योग-जाँच पाइपलाइन।" />
  <figcaption>चित्र 2. बाएँ: भौतिक और तर्कसंगत टेलीमेट्री स्तर <code>L0</code>-<code>L4</code> को श्रेय-लेबल <code>A1</code>-<code>N</code> के साथ मिलाया गया। दाएँ: सात-कदम कच्चा-पहला काउंटर अनुशासन जो पूर्व/पोस्ट बेसलाइन ड्रिफ्ट सीमाएँ (<code>Falsifier 6</code>) लागू करता है और <code>Step 7</code> योग-जाँच।</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 टेलिमेट्री सीमाएँ (`L0-L4`) और श्रेय-लेबल (`A1-N`)

ऊर्जा और गतिविधि सेंसर पाँच भिन्न सीमाओं पर स्थित होते हैं जो भौतिक रूप से अलग-अलग मात्राओं को मापते हैं और इन्हें कभी भी जोड़ा या मिलाया नहीं जाना चाहिए:

| स्तर | भौतिक / तार्किक सीमा | प्रतिनिधि सेंसर | चैनल ईमानदारी से किसका श्रेय दे सकता है |
| :--- | :--- | :--- | :--- |
| **`L0` दीवार** | दीवार के सॉकेट पर `AC` | स्मार्ट प्लग या `PDU` (`Shelly` `apower`, `aenergy`; `Yokogawa` analyzer) | `PSU` रूपांतरण ऊष्मा, पंखे, `DRAM` और `NVMe` सहित पूरी मशीन; लगभग `~1 s` अंतराल पर। |
| **`L1` प्लेटफ़ॉर्म** | बोर्ड का `DC` इनपुट रेल | `Jetson Thor INA238` carrier; `Mac sys_power`; `RAPL psys` | पावर ब्रिक या `PSU` के बाद के `DC` पक्ष पर पूरा कंप्यूटर। |
| **`L2` पैकेज / SoC** | `CPU` पैकेज, `GPU`, और `SoC` रेल | `RAPL pkg`; rootless `macmon IOReport`; `Thor INA3221`; `amdgpu hwmon`; `NVML` संचयी ऊर्जा (`mJ`) | `SoC` पर पूरा `SUT` (`A2`), या जब कोई रेल भौतिक रूप से अनन्य हो तो अकेला इन्फरेंस इंजन (`A1`)। |
| **`L3` प्रक्रिया / cgroup** | एकल `OS` प्रक्रिया वृक्ष | `Linux cgroup v2` (`cpu.stat`, `memory.peak`, `io.stat`), `perf`; `macOS proc_pid_rusage` `ri_energy_nj`; Win32 `GetProcessTimes` + `QueryProcessCycleTime` | संसाधन गतिविधि अंश (`C`), या `OS` कर्नेल का अपना आंतरिक प्रति-प्रक्रिया ऊर्जा मॉडल (`D`)। |
| **`L4` तार्किक** | मॉडल/टूल वार्तालाप | `satb-proxy` टोकन गणना और कॉल विलंबता; हार्नेस टर्न, टूल कॉल, और `ContextRule_v0` एलिजन | बंद क्लाउड `API` सहित हर `SUT` पर बिना किसी अपवाद के सटीक गणना। |

प्रत्येक रसीद में हर ऊर्जा मान सात श्रेय-निर्धारण लेबलों में से एक को धारण करता है:

- **`A1` (विशेष भौतिक रेल)**: वह हार्डवेयर रेल सेंसर जिसे मापन अवधि के दौरान केवल एक विभाजन ने छुआ हो (उदाहरण: `Jetson Thor INA3221 ch1 VDD_GPU`, जब केवल स्थानीय अनुमान इंजन के पास `GPU` डिवाइस तक पहुँच हो)।
- **`A2` (समर्पित संपूर्ण-प्रणाली सीमा)**: एक शांत (quiesced) समर्पित मशीन (`SUT` plus निष्क्रिय `OS` न्यूनतम स्तर) पर पूरी मशीन (`L0`/`L1`) या पूरे पैकेज (`L2`) का काउंटर। **`OQ-4` के अनुसार, `A2` पर संपूर्ण-`SUT` कच्ची विंडो ऊर्जा प्लेसमेंट के लिए प्राथमिक भौतिक ऊर्जा मेट्रिक है**, जो पतले मॉडलों को `/work` उप-प्रक्रियाओं में बिना गिने गए ब्रूट-फ़ोर्स खोज को बाहर धकेलने से रोकती है, और यह सुनिश्चित करती है कि `active - idle` घटाव धीमे रनों को बेहतर न दिखाए।
- **`B` (कालिक चरण विभाजन)**: क्रमिक चरण चिह्नकों (`Lane B` में `model_call` बनाम `tool_call`) द्वारा सीमांकित, गैर-अतिव्यापी कालिक विंडो में काउंटर अंतर।
- **`C` (आनुपातिक हिस्सेदारी, `Kepler` मॉडल)**: एक साझा हार्डवेयर काउंटर जिसे, जब समानांतर प्रक्रियाएँ अतिव्यापी हों, $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ द्वारा या `GPU` उपयोग द्वारा विभाजित किया जाता है (`Lane O` `Shape H`)।
- **`D` (`OS`-मॉडल्ड अनुमान)**: कर्नल का आंतरिक प्रति-प्रक्रिया ऊर्जा मॉडल (`macOS ri_energy_nj`)। यह एक प्रोसेस ट्री को `CPU` सह-किरायेदारों से अलग करता है, परंतु यह भौतिक शंट रीडिंग नहीं, बल्कि फ़र्मवेयर/कर्नल मॉडल ही रहता है।
- **`P` (प्रदाता-प्रमाणित)**: क्लाउड प्रदाता द्वारा उसकी शब्दशः मापन पद्धति के साथ लौटाई गई प्रति-अनुरोध सर्वर ऊर्जा संख्या।
- **`N` (`not_available`)**: अप्रेक्षित और **कभी अनुमानित नहीं**।

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 सात-चरणीय काउंटर अनुशासन, रूटलेस संग्रह (`OQ-5`), और प्लेटफ़ॉर्म मानचित्र

`satb-meter` प्रत्येक प्रयास (attempt) को सात क्रमबद्ध चरणों से संसाधित करता है:
1. **हर इवेंट सीमा पर संचयी काउंटर पढ़ें** (`attempt.start`, प्रत्येक `model_call` और `tool_call`, `attempt.close`, साथ ही एक `100 ms` संदर्भ टिक), ताकि विंडो ऊर्जा एक सटीक काउंटर अंतर बने: $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$.
2. **पहले कच्चे चैनल लिखें**: सीमा, सेंसर, प्रारंभ और अंत रीडिंग, काउंटर रैप्स, और नमूनों की संख्या दर्ज करें; `10` सेंसर अवधियों से छोटी विंडो को "below_resolution" और अनुपस्थित हार्डवेयर को "not_available" चिह्नित करें।
3. **अनुक्रमिक चरणों (`B`) को विभाजित करें**: `Lane B` में मॉडल अनुमान (inference) और `/work` टूल कॉल कभी अतिव्यापी नहीं होते; समानांतर `Lane O` हार्नेस चरण-विभाजन को `C` या `N` तक सीमित कर देते हैं।
4. **`engine_resident_during_tools` को अलग करें**: जब `/work` टूल चलता है, तब एक स्थानीय मॉडल सर्वर (`llama-server`, `vLLM`) `GPU`/`DRAM` पर भार (weights) को स्थायी रूप से रखता है। टूल विंडो के दौरान उसकी निष्क्रिय खपत (idle draw) `engine_resident_during_tools` में रखी जाती है और उसे न तो मॉडल के सक्रिय अनुमान में और न ही टूल निष्पादन में गिना जाता है।
5. **अनुपात (`C`) द्वारा विभाजन केवल वहाँ करें जहाँ खंड अतिव्यापी हों**: $\Delta \text{CPU}$ अनुपात को केवल एक लक्षणवर्णन विकल्प (characterisation fallback) के रूप में सख्ती से लागू करें, यह मानते हुए कि `C`-states, टर्बो `DVFS`, और `DRAM`/स्टोरेज स्टॉल आनुपातिकता (proportionality) का उल्लंघन करते हैं।
6. **आधारभूत मानों (baselines) को व्युत्पन्न चैनलों के रूप में संग्रहित करें**: सत्र को पूर्व और पश्चात निवासी (resident) आधारभूत मानों से घेरें; यदि पूर्व और पश्चात निष्क्रिय शक्ति `5.0%` से अधिक बहती है (`Falsifier 6`), तो व्युत्पन्न निवल-निष्क्रिय-ऊपर (net-above-idle) मान हटा दें, जबकि कच्चे चैनल अक्षुण्ण रखें।
7. **योग जाँच (`Falsifier 2`) चलाएँ**: सत्यापित करें कि व्युत्पन्न चरण-घटकों का योग एक सेंसर क्वांटम (`1 mJ`) की सीमा के भीतर कच्चे प्रयास काउंटर अंतर के बराबर है; यदि नहीं, तो व्युत्पन्न विभाजन को त्याग दें और केवल कच्चा चैनल रखें।

**रूटलेस संग्रह नियम (`OQ-5`).** बेंचमार्क को कभी भी `SUT` ऑर्केस्ट्रेशन को `root` के रूप में नहीं चलाना चाहिए या कस्टम रिंग-0 ड्राइवर लोड नहीं करना चाहिए। `macOS` पर, `satb-meter` रूटलेस `macmon` (`IOReport` सब्सक्रिप्शन) और `libSystem` `proc_pid_rusage(RUSAGE_INFO_V6)` का उपयोग करता है, कभी `sudo` या `powermetrics` का नहीं। `Linux` पर (जहाँ `/sys/class/powercap/intel-rapl` कर्नल `5.10` में `PLATYPUS` के बाद रूट-ओनली हो गया), एक बार का प्रशासकीय `udev` नियम एक समर्पित `satb-meter` समूह को पढ़ने की पहुँच प्रदान करता है जिसमें **केवल `satb-supervisor` का `UID`** होता है, जिससे `/work` सैंडबॉक्स प्रक्रियाएँ न तो `RAPL` का साइड-चैनल कर सकती हैं और न ही अपनी स्वयं की ऊर्जा मीटर पढ़ सकती हैं। `Windows 11` (`NT 10.0.26300`) पर, अप्रिविलेज्ड बेसिक यूजर टोकन (`0x20000`) `nvml.dll` (`nvmlDeviceGetTotalEnergyConsumption`) के माध्यम से डिस्क्रीट-`GPU` संचयी ऊर्जा (`mJ`) को सीधे पढ़ते हैं और Win32 `QueryProcessCycleTime` के माध्यम से `L3` प्रक्रिया चक्र पढ़ते हैं, जबकि Intel `RAPL` `MSR` `0x611` को एक रिंग-0 कर्नल ड्राइवर की आवश्यकता होती है जो `OQ-5` और `HVCI` द्वारा प्रतिबंधित है (विंडोज `CPU` पैकेज ऊर्जा को सख्ती से `"not_available"` में रखते हुए, लेबल `N`):

| लक्ष्य मंच | `L0` / `L1` सम्पूर्ण-प्रणाली चैनल | `L2` पैकेज / `SoC` चैनल | `L3` प्रक्रिया एवं `L4` तार्किक चैनल | प्रमुख सत्यापन स्थिति |
| :--- | :--- | :--- | :--- | :--- |
| **Apple Silicon Mac** (`M5 Max` पुष्ट) | `L0`: `Shelly` `PDU` (`not_available` यदि अनप्लग किया गया); `L1`: `macmon sys_power` (`reported_j`) | `macmon IOReport`: `chip_power`, `cpu_power`, `gpu_power`, `ane_power`, `ram_power` (`reported_j`) | `L3`: `proc_pid_rusage` `ri_energy_nj` (`D`), `ri_instructions`, `ri_diskio_*`; `L4`: `satb-proxy` | Rootless `L1`-`L4` पुष्ट लाइव `Apple M5 Max` पर; `L0` प्लग खुला. |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`, `Linux x86-64` पुष्ट) | `L0`: `Shelly` `PDU` (`not_available` यदि अनप्लग किया गया); `L1`: `cros_ec` (`0` power attrs) | `RAPL package-0` & `core` (`0440 root:energy` `udev`) `reported_j` + `amdgpu` `PPT` `power1_input` (`0444`; `energy1_input` absent) | `L3`: `cgroup v2` / `getrusage` (`C` activity shares); `L4`: `satb-proxy` | पुष्ट लाइव (`0440 root:energy` `PLATYPUS` isolation; `amdgpu PPT` `0444`). |
| **Intel Raptor Lake** (`Core i9-13900H`, `Linux x86-64` पुष्ट) | `L0`: `not_available`; `L1`: `RAPL psys` (`intel-rapl:1/energy_uj`, `0444` `reported_j`) | `RAPL package-0`, `core`, & `uncore` (`MSR` + `MMIO` `energy_uj`, `0444` `reported_j`) | `L3`: `cgroup v2` / `getrusage` (`C` activity shares); `L4`: `satb-proxy` | पुष्ट लाइव (`0 µJ` `Step 7` residual across `psys` `L1` and `package-0` `L2`). |
| **NVIDIA Jetson AGX Thor** (`Linux aarch64` Tegra पुष्ट) | `L1`: `TI INA238` (`hwmon6` `VIN`, `0444` `measured_j`) + `INA3221 ch3 VIN_SYS_5V0` (`0444` `measured_j`) | `INA3221 ch1 VDD_GPU` (`0444` `measured_j`, `A1` when exclusive); `ch2 VDD_CPU_SOC_MSS` (`0444` `measured_j`); `NVML` (`unverified`) | `L3`: `cgroup v2` / `getrusage` (`C` activity shares); `L4`: `satb-proxy` | पुष्ट लाइव (`INA238` + `INA3221 ch1-ch3` `0444` rootless; GPU `NVML` open under co-tenant lock). |
| **Windows 11 `x86-64` + Discrete `RTX`** (`i7-1165G7` + `RTX 2060`, `NT 26300` पुष्ट) | `L0`: `not_available`; `L1`: `WMI` `EMI` `PowerMeter` (`0` instances -> `not_available`) | `RTX 2060`: rootless `nvml.dll` cumulative `mJ` (`reported_j`); `CPU` `RAPL` `MSR 0x611`: **`N` (`not_available` without ring-0 driver)** | `L3`: Win32 `GetProcessTimes` + `QueryProcessCycleTime` (`C` shares; `SRUM` coarse `OS` background excluded); `L4`: `satb-proxy` | पुष्ट लाइव Basic User `0x20000` टोकन के तहत (`0 mJ` `Step 7` residual; `2.46 ms` Job Object kill). |
| **Closed Cloud `API`** (`Anthropic`, `xAI`, `Cerebras`, `OpenAI`, `Google`) | स्थानीय `L0`-`L1` माप क्लाइंट होस्ट केवल (सर्वर इनफ़र्न्स से बाहर) | रिमोट सर्वर `L2`: कड़ाई से **`N` (`not_available`)** या प्रति-अनुरोध **`P`** (`OQ-6`) | स्थानीय `/work` `L3` (`D`/`C`) सेंडबॉक्स टूल्स के लिए; `L4`: **सटीक** `satb-proxy` टोकन, कॉल, `USD` | पुष्ट लाइव `Anthropic`, `Cerebras`, और `xAI` के बीच `satb-proxy` द्वारा। |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 आठ हार्डवेयर मापन त्रुटियाँ और सात गैर-श्रेय-योग्य राशियाँ

आधुनिक `SoC`s और `GPU`s पर मानक पावर-मैपिंग शॉर्टकट व्यवस्थित रूप से विफल होते हैं:

| हार्डवेयर टेलीमेट्री की त्रुटि | `SATB` शमन |
| :--- | :--- |
| **निष्क्रिय (idle) शक्ति डाई तापमान, पंखों, `DVFS`, और टर्बो के साथ विचलित होती है** | `GPU` के ठंडा होने की प्रतीक्षा करें (`<= 1.5 W`), प्रत्येक विंडो को पूर्व और पश्चात आधाररेखा से घेरें, अधिकतम `GPU` तापमान दर्ज करें, और `5.0%` से अधिक विचलन होने पर व्युत्पन्न शुद्ध जूल को अमान्य करें (`Falsifier 6`)। |
| **ठंडी मशीन के निष्क्रिय और भार-युक्त (weights-resident) निष्क्रिय के बीच अस्पष्टता** | दोनों को `Step 6` में मापें और स्पष्ट रूप से लेबल करें, न कि चुपचाप एक को घटाएँ। |
| **`Active - idle` घटाव धीमे रनों को बेहतर दिखाता है** | संपूर्ण `SUT` की कच्ची विंडो ऊर्जा (`A2`) प्राथमिक स्थान-निर्धारण आंकड़ा बनी रहती है (`OQ-4`)। |
| **उप-अवधि विंडो शून्य, ऋणात्मक, या क्वांटाइज़ेशन शोर के रूप में पढ़ी जाती हैं** | `10` सेंसर अवधियों से छोटी किसी भी विंडो को `"below_resolution"` चिह्नित करें (जैसे, `~8 Hz` `macmon` पर `< 1.2 s` या `1 Hz` स्मार्ट प्लग पर `< 10 s`)। |
| **उच्च-दर टेलीमेट्री सैंपलर महत्वपूर्ण `CPU` शक्ति खर्च करते हैं** | संचयी काउंटर इवेंट सीमाओं पर (`0 Hz` पर `0.011 mW`) और `100 ms` टिक के साथ पढ़ें; `observer_only` आधाररेखा दर्ज करें। |
| **`A100`/`H100` पर `NVML` का तात्कालिक शक्ति गेज रनटाइम का केवल `~25%` नमूना लेता है** | इन-प्रोसेस `FFI` के माध्यम से संचयी `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) पढ़ें (`RTX 2060` पर `1.17 ms` बनाम `nvidia-smi` सबप्रोसेस पर `43.88 ms`), कभी भी तात्कालिक `nvmlDeviceGetPowerUsage` पोलिंग नहीं (Chung et al.; Yang et al.)। |
| **बाह्य `L0` वॉल प्लग रन एक असिंक्रोनाइज़्ड घड़ी पर चलते हैं** | `session.open` और `session.close` पर निर्धारक `50%`-ड्यूटी अंशांकन लोड पल्स उत्सर्जित करें और टाइमस्टैम्प को क्रॉस-सहसंबंधित करें। |
| **साझा-होस्ट पृष्ठभूमि डेमन या सह-किरायेदार जॉब्स** | प्रक्रिया सूची लॉग करें, साझा `L2` व्युत्पन्न घटावों को `Falsifier 6` द्वारा डाउनग्रेड करें, और कच्चे `L2` के साथ सह-किरायेदार-पृथक `L3` `ri_energy_nj` (`D`) दर्ज करें। |

परिणामस्वरूप, **सात मात्राएँ ईमानदारी से श्रेय-निर्धारित नहीं की जा सकतीं** और `SATB` दावों से प्रतिबंधित हैं: (1) अप्रमाणित बंद-`API` सर्वर ऊर्जा (`N` या `P` केवल); (2) साझा `SoC` या एकीकृत-मेमोरी रेल पर प्रति-प्रक्रिया भौतिक जूल (`C` और `D` मॉडल हैं); (3) सेवा कर्नलों, क्वांटाइजेशन, बैचिंग और सिलिकॉन से पृथक मॉडल वेट; (4) `OS` निष्क्रिय फ्लोर और `DRAM`-निवासी वेट पावर का स्वामित्व (स्टैंडअलोन चैनलों के रूप में रिपोर्ट किया गया); (5) सेंसर अवधि से छोटी व्यक्तिगत घटनाएँ (जैसे `1 s` प्लग के अंतर्गत `30 ms` टूल कॉल); (6) साझा क्लाउड `VM` या विशेषाधिकार-रहित विंडोज `CPU` डोमेन जिनमें यूजर-मोड हार्डवेयर काउंटरों का अभाव हो; और (7) मौन मध्य-सत्र प्रदाता वेट स्वैप (आरंभ/समाप्ति कैनरी द्वारा चिह्नित, पूर्व-निर्धारित रूप से कभी अस्वीकृत नहीं)। विशेष रूप से (`OQ-6`), **प्रदाता स्थिरता प्रकटीकरण बेड़े मध्यका हैं न कि प्रति-अनुरोध माप और कभी `SATB` रसीद में प्रवेश नहीं करते**, जिसमें गूगल का `0.24 Wh` मध्यका `Gemini Apps` प्रॉम्प्ट, ओपनएआई का `0.34 Wh` आंकड़ा (बिना पद्धति प्रकाशित) और मिस्ट्राल का `400`-टोकन प्रतिक्रिया प्रति `1.14 gCO2e` शामिल हैं।

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. मापी गई अनुरूपता, निर्धारणशीलता, निरीक्षक-प्रभाव, और बहु-होस्ट श्रेय-निर्धारण परिणाम

अपरिणामी डिजाइन अनुमानों को ऑडिट योग्य रसीदों से बदलने के लिए, हमने पूर्ण `SATB` अनुरूपता सूट और फाल्सिफ़ायर हार्नेस (`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`, कुल रन-टाइम `175.69 s`) को `Apple M5 Max` कार्यस्टेशन (`arm64`, `128 GB` एकीकृत स्मृति, `macOS 27.2.1`, `macmon 0.12.0`) पर चलाया, साथ ही `188`-विंडो क्रॉस-स्टडी ऑडिट और `Linux` एवं `Windows 11` पर लाइव क्रॉस-OS बहु-सिलिकॉन रन भी किए।

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

<div id="66-multi-platform-hardware-attribution-across-five-silicon-and-os-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 पाँच सिलिकॉन और OS आर्कीटाइप में बहु-प्लेटफ़ॉर्म हार्डवेयर श्रेय-निर्धारण

यह सत्यापित करने के लिए कि `SATB` अनुरूपता, `Shape D` का फ़िक्स्ड-पॉइंट नियतत्व, रूटलेस `PLATYPUS` / `HVCI` अनुमति सीमाएँ, और भौतिक शंट या संचयी `NVML` श्रेय-निर्धारण `macOS`, `Linux` और `Windows 11` पर लागू रहते हैं, हमने `run_multi_host_satb.py` (`multi_host_satb_receipts.json`) और `run_windows_suite.py` (`windows_satb_receipts.json`) को `Apple M5 Max` के साथ-साथ चार अतिरिक्त `Linux` और `Windows 11` हार्डवेयर आर्कीटाइप पर चलाया।

| हार्डवेयर आर्कीटाइप और `OS` कर्नेल | रूटलेस सेंसर सीमा और साक्ष्य वर्ग | `Shape D` `1M` `DNULLMM1` (`10k` probes) | `C9` रीप्ले और `C10` ट्री-किल का औसत | एकल-पठन विलंबता और प्राप्त `100 Hz` | `Step 7` अवशेष और `Falsifier 3` (`C` बनाम `B`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`** (`arm64`, `128 GB`, `macOS 27.2.1`) | `IOReport` `L1`/`L2` + `rusage` `L3` (`reported_j`; `measured_j = None`) | `15027705736` (`388.43 ns` `C++`, `582.57 ns` Rust) | `149,747 B` (`0` अंतर) · `2.073 ms` (`0` `PID`s) | `~120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`** चरण 2 (`+35.86%` चरण 1) |
| **`NVIDIA Jetson AGX Thor`** (`aarch64`, `122.9 GiB`, `Linux 6.8.12-1021-tegra`) | `TI INA238` (`hwmon6` `VIN` `L1`) + `INA3221` (`hwmon5` `ch1-ch3` `L2`/`L1`, `0444` **`measured_j`**) | `15027705736` (`984.86 ns` `C -O3`, `2,489.4 ns` Py) | `149,747 B` (`0` अंतर) · `9.544 ms` (`0` `PID`s) | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2` (`-67.02%` `VIN`) |
| **`Framework AMD Ryzen AI Max+ 395`** (`x86-64`, `122.8 GiB`, `Linux 7.0.0-43`) | `RAPL package-0` और `core` (`0440 root:energy` **`reported_j`**) + `amdgpu PPT` (`0444`; `measured_j = None`) | `15027705736` (`376.61 ns` `C -O3`, `1,341.7 ns` Py) | `149,747 B` (`0` अंतर) · `0.868 ms` (`0` `PID`s) | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0` (`-63.34%` `core`) |
| **`Intel Core i9-13900H`** (`x86-64`, `14.7 GiB`, `Linux 7.0.0-43`) | `RAPL psys` (`L1`) + `package-0`, `core`, `uncore` (`L2`, `0444` **`reported_j`**; `measured_j = None`) | `15027705736` (`420.93 ns` `C -O3`, `863.6 ns` Py) | `149,747 B` (`0` अंतर) · `1.120 ms` (`0` `PID`s) | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0` (`-73.62%` `psys`) |
| **`Intel Core i7-1165G7 + RTX 2060`** (`x86-64`, `63.7 GiB`, `Windows 11 26300`) | `nvml.dll` `RTX 2060` संचयी `mJ` (`L2` **`reported_j`**) + Win32 `L3`; `CPU RAPL` = `N` (`measured_j = None`) | `15027705736` (`1,474.22 ns` `MSVC /O2`, `2,885.6 ns` Py) | `149,747 B` (`0` `CRLF`) · `2.458 ms` JobObj (`0` `PID`s) | `1,174.2 µs` `NVML` · **`64.64 Hz`** (`NT` टिक) | `0 mJ` · **`-89.88%`** समय (`-77.05%` `RDTSC`) |

इन जीवंत रसीदों से पाँच क्रॉस-प्लेटफ़ॉर्म हार्डवेयर और ऑपरेटिंग-सिस्टम निष्कर्ष उभरते हैं:

1. **`macOS`, `Linux`, और `Windows 11` (`arm64`/`aarch64` और `x86-64`) में बिट-सटीक `Shape D` और `Lane B` रीप्ले अपरिवर्तनीयता**: Win32 `CreateFileMappingA` + `MapViewOfFile` (जो `MSVC 19.44 /O2` से संकलित हुआ) और `Windows 11` (`NT 10.0.26300`) पर `NTFS` फ़ाइल I/O सहित सभी पाँचों होस्टों ने `10,000`-प्रोब `DNULLMM1` चेकसम **`15027705736`**, `test.setpoint` के जमे हुए डाइजेस्ट `0da4df8d9ccbce1e...4485781` और `149,747`-बाइट `C9` ट्रांसक्रिप्ट (`SHA-256` `d697ed1476129939...`, **`0` `NTFS` `CRLF` बाइट विचलन** के साथ) का सटीक उत्पादन किया। इसी दौरान `4`-`PID` वाले अनियंत्रित प्रोसेस ट्री कर्नेल प्रिमिटिव्स के माध्यम से `0.868 ms` से `9.544 ms` के बीच समाप्त किए गए। `macOS`/`Linux` पर `SIGKILL` और `Windows 11` पर Win32 `TerminateJobObject` का औसत समय **`2.458 ms`** रहा, जो `taskkill.exe /F /T /PID` चलाने (औसत `122.817 ms`) से **`50.0×` तेज़** है और `2,000 ms` की विनिर्देश सीमा से `> 200×` कम है।
2. **लाइव `GPU` सह-किरायेदारी के अंतर्गत `NVIDIA Jetson AGX Thor` पर भौतिक `INA238` / `INA3221` शंट पृथक्करण और `Falsifier 6`**: `Linux 6.8.12-1021-tegra` पर `hwmon6` (`ti,ina238`, `i2c@c600000/ina238@44`, `VIN` पूरे-बोर्ड `DC` इनपुट, लगभग `27.97 V`) और `hwmon5` (`ina3221@40`) के तीनों चैनल, यानी `ch1 VDD_GPU`, `ch2 VDD_CPU_SOC_MSS` और `ch3 VIN_SYS_5V0`, बिना `sudo` के विश्व-पठनीय (`0444`) हैं। हमारी सख्ती से केवल-`CPU` प्रोब (`dedicated_host = false`) के दौरान एक स्वतंत्र सह-किरायेदार `llama-server` ने होस्ट `GPU` लॉक धारण किया हुआ था:

| `Jetson AGX Thor` भौतिक शंट चैनल (`0444` रूटलेस `sysfs`) | सीमा | पूर्व-आधार रेखा (`W`) | चरण 1 गणना (`measured_j` / `W`) | चरण 2 `DRAM+fsync` (`measured_j` / `W`) | पश्चात-आधार रेखा (`W`) | विचलन (`F6`) और `Kepler` `C` चरण-2 त्रुटि |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`** (मॉड्यूल + कैरियर इनपुट) | **`L1`** | `100.70 W` | `122.12 J` (`101.66 W`) | `99.02 J` (`81.94 W`) | `97.21 W` | `3.47%` (`A2` रोका गया: सह-किरायेदार) · **`-67.02%`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`** (सह-किरायेदार `LLM`) | **`L2`** | `29.26 W` | `40.29 J` (`33.54 W`) | `26.00 J` (`21.52 W`) | `28.13 W` | बाह्य `GPU` सह-किरायेदार (`F5` में `-36.1%` उतार-चढ़ाव) |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36.68 W` | `45.73 J` (`38.07 W`) | `44.37 J` (`36.71 W`) | `36.08 W` | `1.64%` (`CPU`/`SoC`/`MSS` डोमेन) · **`-70.01%`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`** (`5.08 V` रेल) | **`L1`** | `14.89 W` | `18.66 J` (`15.53 W`) | `16.82 J` (`13.92 W`) | `13.98 W` | **`6.13% > 5.0%` (`F6` सक्रिय)** · **`-68.85%`** |

चार `Falsifier 5` कैडेंस विंडो के दौरान, उतार-चढ़ाव वाले सह-टेनेंट `LLM` अनुरोधों ने `ch1 VDD_GPU` को `35.36 J` से घटाकर `22.60 J` (`-36.1%`) कर दिया, जिससे सम्पूर्ण-बोर्ड `INA238 VIN` (`L1`) `107.48 J` से घटकर `81.73 J` (`-24.0%`) हो गया, भले ही `ch2 VDD_CPU_SOC_MSS` `35.76-39.31 J` के बीच स्थिर रहा। चूँकि `dedicated_host = false` (और `ch3 VIN_SYS_5V0` ने `5.0%` ड्रिफ्ट को `6.13%` पर पार कर लिया), `SATB` पूरे-`SUT` नेट प्लेसमेंट दावों को रोकता है जबकि रेल-पृथक सटीक `measured_j` (`L1` और `L2` चैनल कभी भी जोड़े नहीं गए) को बनाए रखता है।

3. **`PLATYPUS` `0440 root:energy` आइसोलेशन और `Strix Halo` `APU` डोमेन सत्यापन `Framework` `AMD` पर**: `Framework` डेस्कटॉप (`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`, `Linux 7.0.0-43-generic`) पर, `udev` नियम `90-energy-read.rules` `/sys/class/powercap/intel-rapl:0/energy_uj` (`package-0`) और `intel-rapl:0:0/energy_uj` (`core`) को मोड **`0440` (`root:energy`, `world_readable = false`)** पर सेट करता है: अनग्रुप्ड `/work` सैंडबॉक्स `UID` को `EACCES` प्राप्त होता है (`PLATYPUS` साइड-चैनल को अवरुद्ध करते हुए), जबकि पर्यवेक्षक `GID` (`energy`)  `24.34 µs` मध्यान latency पर रूटलेस रूप से संचयी माइक्रोजूल पढ़ता है (`0 µJ` `Step 7` अवशेष)। `hwmon9` (`amdgpu`) का निरीक्षण एक खुली विशिष्टता विवरण को और स्पष्ट करता है: `Strix Halo` का एकीकृत `Radeon 8060S` विश्व-पठनीय (`0444`) `PPT` पावर (`power1_input` / `power1_average` in `µW`, `75.38 W` Phase 1 / `69.72 W` Phase 2) को उजागर करता है न कि अलग `energy1_input` काउंटर, जबकि `cros_ec` (`hwmon8`) केवल पंखे और बोर्ड थर्मल को उजागर करता है।

4. **Bare-metal `Windows 11` रूटलेस सीमा (`0x20000` Basic User `NVML` बनाम ring-0 `RAPL` ब्लॉक) और `15.625 ms` `NT` क्लॉक-टिक एलियासिंग**: स्पष्ट रूप से डी-एलिवेटेड Basic User टोकन (`runas.exe /trustlevel:0x20000`, `IsUserAnAdmin() == false`) के अंतर्गत `Windows 11 Pro` (`NT 10.0.26300`, `Intel Core i7-1165G7` + `NVIDIA GeForce RTX 2060`) पर, इन-प्रोसेस `FFI` कॉल `nvml.dll` `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) और `nvmlDeviceGetPowerUsage` (`mW`) को रूटलेस रूप से सफलता प्राप्त होती है **`1,174.15 µs` मध्यान** (**`37.4×` तेज** `nvidia-smi.exe` को `43.88 ms` प्रति कॉल पर स्पॉन करने की तुलना में), `Step 7` को **`0 mJ` अवशेष** (`8.769 J + 8.816 J = 17.585 J`, `3.0%` पूर्व/उत्तर ड्रिफ्ट) के साथ साफ करता है। इसके विपरीत, Intel `RAPL` `MSR 0x611` के अनाधिकृत यूजर-मोड रीड को `Windows NT` कर्नेल द्वारा साइन किए गए ring-0 ड्राइवर के बिना अवरुद्ध कर दिया जाता है (`OQ-5` और `HVCI` द्वारा प्रतिबंधित), और `WMI` `EMI` (`\\.\EnergyMeter` / `Win32_PerfRawData_Counters_PowerMeter`) `0` इंस्टैंस को उजागर करता है, जिससे Windows `CPU` पैकेज `L2` को सख्ती से `Label N` (`"not_available"`) में रखा जाता है। इसके अलावा, क्योंकि अनसमायोजित `Windows NT` `GetProcessTimes` को `~15.625 ms` क्लॉक इंटरप्ट पर अपडेट करता है, Phase 2 में `8 ms` स्लीप-प्लस-`FlushFileBuffers` बर्स्ट `62.5 ms` तक एलियास हो गए (`5.06%` `CPU` हिस्सा बनाम Phase 1 में `1,171.9 ms`), जिससे `Kepler` `C` श्रेय-निर्धारण **`-89.88%`** से त्रुटिपूर्ण हो गया (sub-tick `RDTSC` `QueryProcessCycleTime` साइकल का उपयोग करने पर भी `-77.05%` `11.48%` हिस्से पर)।

5. **सेंसर बस और `OS` टाइमर कॅडेंस भौतिकी सभी पाँच प्लेटफ़ॉर्मों में**: जहाँ Linux `x86-64` `powercap` `sysfs` पढ़ना `24.34-45.37 µs` में पूरा होता है (`94.28-97.12 Hz` `100 Hz` पर प्राप्त), `Windows NT` का डिफ़ॉल्ट `15.625 ms` स्लीप क्वांटम अपरिवर्तित `10 ms` `NVML` लूप को **`64.64 Hz`** तक सीमित करता है जबकि **`9.45 Hz`** को स्पष्ट रूप से `SATB` के `100 ms` (`10 Hz`) संदर्भ टिक पर प्रदान करता है, जो `Jetson AGX Thor` के `66.55 Hz` `I2C` शंट सीमांकन (`9.49 Hz` `100 ms` रेफ) से मेल खाता है और `macmon` के `7.44 Hz` `IOReport` सीमा के साथ विपरीत है। **`5 / 5`** सिलिकॉन और `OS` आर्किटेक्चर में, `CPU`-प्रोपोर्शनल विभाजन (`C`) ने `192 MiB` `DRAM` + डिस्क-सिंक चरण को **`32.59%` से `89.88%`** तक कम अंकित किया, जिससे यह सार्वभौमिक रूप से पुष्टि होती है कि `SATB` `C` को ओवरलैपिंग समानांतर रन तक सीमित करता है।

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. खुला हार्डवेयर सत्यापन और सीमाएँ

| सत्र फाल्सिफायर | ट्रिगर होने पर परिणाम | इस अध्ययन में अनुभवजन्य स्थिति |
| :--- | :--- | :--- |
| **`F1` रीप्ले बेमेल (`C9`)** | संदर्भ हार्नेस नॉन-डिटरमिनिस्टिक है | **`5/5` होस्ट पर साफ़ (`149,747 B` और `14` टर्न में `0` बाइट/`CRLF` अंतर)** |
| **`F2` `> 5%` प्रयासों पर योग जाँच विफल** | होस्ट पर श्रेय-विभाजन टूटा | **`5/5` होस्ट पर साफ़ (`0 µJ` Linux; `0 mJ` Win11 `NVML`; `<= 1 µJ` `M5 Max`)** |
| **`F3` `B` और `C` क्रमिक रूप से `> 20%` से असहमत** | होस्ट पर `C` (`Kepler`) अविश्वसनीय चिह्नित | **`5/5` होस्ट पर ट्रिगर (`32.59%-89.88%` त्रुटि); `C` सीमित** |
| **`F4` ज्ञात पल्स लोड सेंसर सटीकता से बाहर** | सत्र के लिए सेंसर का स्तर घटाया गया | **खुला (`L0` स्मार्ट-प्लग सिंक-पल्स रिग अभी संलग्न नहीं)** |
| **`F5` `10 ms` बनाम `1 s` टिक विंडो ऊर्जा बदलता है** | टेलीमेट्री पर्यवेक्षक प्रभाव | **साफ़ (`M5 Max` `L2` अंतर `0.76%`; `100 ms` संदर्भ पर `9.45-10.48 Hz` प्राप्त)** |
| **`F6` पूर्व/पश्चात resident बेसलाइन `> 5.0%` बहते हैं** | व्युत्पन्न शुद्ध चैनल अमान्य | **सक्रिय (`M5 Max` की `124/188` विंडो और Linux को-टेनेंट ड्रिफ्ट साफ़ तौर पर गेट किए गए)** |
| **`F7` एडाप्टर `C1`-`C12` पास करता है, कैनरी फेल** | अनुरूपता अपर्याप्त; सत्र `void` | **सिमुलेशन में सत्यापित (स्वैप पर `session_void = true`)** |
| **`F8` `Lane B` मज़बूत `Lane O` हार्नेस से नीचे रहता है** | `Lane B` को सख्ती से न्यूनतम सीमा के रूप में रिपोर्ट किया गया | **साफ़ (`Claude Code 2.1.330` के विरुद्ध `24/24` और `6/6` समता)** |

तीन ठोस हार्डवेयर और एडाप्टर मद अभी खुले हैं (`OQ-5`):

1. **समर्पित शांत (quiesced) `A2` सत्र और `L0` `AC` वॉल-प्लग कैलिब्रेशन**: यद्यपि भौतिक `TI INA238` (`L1`) और `INA3221` (`L2`/`L1`) शंट `measured_j` रेल अब `NVIDIA Jetson AGX Thor` पर सजीव सत्यापित हैं, और `Apple M5 Max`, `Framework AMD Strix Halo`, `Intel Raptor Lake` तथा `Windows 11` (`RTX 2060` `NVML`) पर रूटलेस `reported_j` काउंटर भी चल रहे हैं, फिर भी पाँचों बेंच मशीनें साझा सेवाएँ या को-टेनेंट वर्कलोड चला रही थीं (`dedicated_host = false`)। इसलिए पूरे `SUT` स्थापन के `A2` दावे रोके गए हैं। अगला कदम शांत समर्पित होस्ट पर सिंक-पल्स्ड `L0` `AC` मीटर (`Shelly` / `Yokogawa`) लगाना है।
2. **`Jetson AGX Thor` पर इंटीग्रेटेड-`GPU` `NVML` काउंटर जाँच**: डिस्क्रीट-`GPU` `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) अब `NVIDIA GeForce RTX 2060` (`Windows 11`) पर `nvml.dll` के माध्यम से रूटलेस सत्यापित है। परंतु `Jetson AGX Thor` के एकीकृत Tegra `GPU` पर `NVML` संचयी ऊर्जा की जाँच, उसके सत्यापित `0444` `INA3221 ch1 VDD_GPU` शंट के साथ, तब तक प्रतीक्षा में है जब तक साझा `GPU` लॉक मुक्त न हो।
3. **व्यापक `Shape H` और `Shape I` लाइव रोस्टर**: इस अध्ययन में लाइव बाहरी-हार्नेस रनों में `Lane B` और `Shape D` के साथ `Claude Code 2.1.330` पर `Shape H` का अभ्यास हुआ। `Codex CLI`, `OpenHands`, `Terminus-2` और `Shape I` `Inspect` सॉल्वरों पर लाइव `C1-C12` प्रमाणन चलाना अगला कदम है।

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
