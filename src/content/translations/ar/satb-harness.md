---
title: "معيار الإشباع (Satiation Benchmark): إطار الاختبار المرجعي والمحوّلات وإسناد القياسات"
deck: "إطار اختبار مرجعي تسلسلي ثابت بلغة Rust (Lane B)، وجسر محول واحد مفروض بالوكيل (Shapes D, M, H, and I)، ومجموعة مطابقة مكونة من اثني عشر اختبارا (C1 to C12)، ومحرك إسناد قياسات جذري من خمسة مستويات (L0 to L4 crossed with labels A1 to N). تم التحقق منه تجريبيا عبر خمسة أنماط أجهزة: Apple M5 Max (arm64 macOS IOReport and proc_pid_rusage `reported_j`)، Tegra aarch64 Jetson Thor (physical whole-board and three-channel rail-separated current-shunt `measured_j`)، Framework Desktop Strix Halo (x86-64 Linux 0440 root:energy group-isolated package-energy `reported_j` plus graphics-package power tracking)، Intel Core i9-13900H Raptor Lake (x86-64 Linux platform L1 and package-0 L2 `reported_j`)، و Intel Core i7-1165G7 Tiger Lake plus GeForce 2060 on Windows 11 (x86-64 build 26300 rootless cumulative discrete-graphics L2 `reported_j`, Win32 Job Object and cycle accounting, and processor-package Label N). تظل القنوات المنطقية `measured_j` و `reported_j` و L4 منفصلة تماما ولا يتم جمعها أبدا؛ وبسبب تشغيل أحمال العمل المشتركة على المضيفات المشتركة (dedicated_host is false)، يتم حجب إسناد الوضع الصافي A2 وفقا ل Falsifier 6."
lang: "ar"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*مراجعة af57f48، 22 نوفمبر 2026. ملخص البيانات والملخص المختصر: [/data/#satb-harness](/data/#satb-harness). الأشكال الحية التفاعلية: [/living/satb-harness/](/living/satb-harness/). النسخة المؤرشفة بلاتكس: [/pdfs/latex/satb-harness.pdf](/pdfs/latex/satb-harness.pdf) ([المصدر](/pdfs/latex/satb-harness.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. نظرة عامة

عندما تُبلغ تقييمات وكلاء مختلفة عن معدلات إنجاز مهام مختلفة أو أرقام طاقة متباينة، فإن الفجوة كثيرًا ما تنشأ من طريقة تغليف النموذج وطريقة إسناد عدّادات المضيف، لا من النموذج نفسه. فقد أدّى تغيير الإطار المحيط وحده إلى تحويل نسبة إنجاز المهام لنموذج `Gemini 2.5 Pro` على `Terminal-Bench 2` بمقدار `17` نقطة مئوية، بينما يمكن لطرح خط أساس خامل منجرف، أو لتقسيم سكة سيليكون مشتركة بحسب زمن المعالج، أن يشوّه إسناد الطاقة بأكثر من `30%`.

يحدد هذا البحث ويتحقق تجريبيًا من عقد تقييم **معيار الإشباع (`SATB`)**: إطار اختبار مرجعي تسلسلي ثابت واحد بلغة Rust (**`Lane B`**)، وجسر محول معزول بالوكيل (**`Shapes D, M, H, and I`**) لضوابط النماذج الصفرية، ونقاط نهاية النماذج الخام، وأطر اختبار سطر الأوامر الخارجية، وحلول المعايير العامة، وبصمة تشفيرية لنظام الاختبار المستهدف (`SUT`) مكونة من خمس كتل، واثنا عشر فحصًا إلزاميًا للمطابقة، ومحرك قياسات جذري من خمسة مستويات. بدلًا من ترك التصميم غير مقاس، نقوم بتنفيذ معايير مطابقة وتزييف حية عبر **خمسة أنماط أجهزة** تشمل `macOS` و`Linux` و`Windows 11`: محطة عمل `Apple M5 Max` (`128` غيغابايت من الذاكرة الموحدة، `macOS 27.2.1`، `IOReport` مدمج ونواة `proc_pid_rusage` `reported_j`)، ومجموعة مطورين Tegra `aarch64` (`Jetson Thor`، `Linux 6.8.12-1021-tegra`، مقياس تيار شانت فيزيائي من Texas Instruments للوحة الكاملة وثلاث قنوات منفصلة `measured_j`)، ومحطة عمل `Framework` Desktop `Strix Halo` (`Ryzen Max+ 395`، `Linux 7.0.0-43-generic x86-64`، حزمة طاقة معزولة بمجموعة `0440 root:energy` `reported_j` بالإضافة إلى تتبع طاقة الحزمة `amdgpu`)، ومحطة عمل `Raptor Lake` (`Intel Core i9-13900H`، `Linux 7.0.0-43-generic x86-64`، طاقة المنصة والحزمة `reported_j`)، ومحطة عمل bare-metal `Windows 11` (`Intel Core i7-1165G7` بالإضافة إلى `GeForce 2060`، بناء `Windows 11` `26300` `x86-64`، `reported_j` تراكمي للرسوميات المنفصلة بدون جذر، حبس Win32 Job Object، وطاقة حزمة المعالج غير المميزة بعلامة `not_available` بدقة)، إلى جانب طاقة خادم سحابي مغلق (`not_available`).

**بعبارة بسيطة**

1. يمكن أن يغيّر حلقة مطالبة الوكيل، قاعدة تقليم السياق، وصندوق أدوات الأدوات نتائج المعيار بقدرة تعادل تبديل النموذج الأساسي، لذا يُحافظ `Lane B` على تلك اللفافة ثابتة بالكامل في Rust حتمي بينما يجبر `Lane O` الأغلفة الخارجية عبر موصل وسيط مُدقق واحد.  
2. تُسجَّل قنوات الطاقة بصورة أولية عند حدها الفيزيائي الحقيقي, في مقبس الحائط الكامل، مدخل اللوحة، حزمة الشريحة، تقدير عملية نظام التشغيل، أو سجل الرموز المنطقي, ولا تُدمَج أبداً في رقم غير مُعنون واحد، تُجمَع عبر فئات الأدلة (`measured_j` مقابل `reported_j` مقابل `est_j`)، أو تُملَأ لاحقاً بمتوسطات استدامة الأسطول.  
3. تُثبت الاختبارات الحية عبر خمسة منصات من السيليكون وأنظمة التشغيل (`macOS`، `Linux`، و`Windows 11`) دقة `Shape D` للذاكرة المخبأة بعدد سجلات بالملايين (`15027705736`) وإعادة تشغيل `C9` (`149,747 B`، لا اختلاف في الأسطر أو البايتات) ، وتنظيف شجرة عمليات النواة خلال `0.87-9.54 ms` (`2.46 ms` عبر كائنات Win32 Job على `Windows 11`)، وعدم تحديد السحابة `temperature = 0` عبر ثلاثة موفرين، وحدود إيقاع حساسات الأجهزة (`24.3-45.4 µs` قراءات عدّاد Linux عند `94-97 Hz` مقابل `1.17 ms` قراءات عدّاد رسومي داخل العملية على Windows عند `64.6 Hz` مقابل `2.95 ms` قراءات شنت تسلسلي عند `66.6 Hz` على `Jetson Thor` مقابل `~8 Hz` `macmon` `IOReport`)، نسبة الخطأ `32.59%-89.88%` عند تقسيم مراحل الحوسبة-الذاتية المتسلسلة-التخزين حسب وقت المعالج (`Falsifier 3`)، وفصل شنت الرسومات الفيزيائي عن شنت المعالج إلى جانب تمكين `Falsifier 6` لتقليل الانجراف المشترك بين المضيفات (`dedicated_host = false`).

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. المصطلحات والاختصارات وتسميات الإسناد

<ul id="terms">
<li>SATB، SUT، PFRK، OQ، SPEC، BUNDLE، SUBMIT، REFUSE، STOP: إطار معيار الإشباع (Satiation Benchmark) ومواصفة الإسناد، والنظام قيد الاختبار، وحالات نتائج المحاولة الأربع (نجاح، فشل، رفض، إنهاء قسري)، وسؤال مفتوح محسوم في المواصفة، ووثيقة المواصفة المعيارية، وملف حزمة المهمة، واستدعاء تسليم الإجابة النهائية، واستدعاء الرفض النهائي، ورمز إيقاف الحلقة المتسلسلة</li>
<li>ACI، SWE، CLI، MCP، SDK، ACP، ARC، AGI، GUI: واجهة الوكيل الحاسوبية (Agent-Computer Interface)، وبادئة معايير هندسة البرمجيات، وواجهة سطر الأوامر، وبروتوكول سياق النموذج (Model Context Protocol)، وحزمة تطوير البرمجيات، وبروتوكول عميل الوكيل (Agent Client Protocol)، ومجموعة التجريد والاستدلال (Abstraction and Reasoning Corpus)، ومجموعة معايير الذكاء الاصطناعي العام، والواجهة الرسومية للمستخدم</li>
<li>IO، JSON، JSONL، RPC، JCS، UTF، HTTP، SSE، URL: بروتوكول الإدخال والإخراج، وصيغة تدوين الكائنات JavaScript (JavaScript Object Notation)، وصيغة JSON المفصولة بالأسطر، والاستدعاء الإجرائي عن بُعد، ومخطط تقنين JSON (JSON Canonicalization Scheme، RFC 8785)، وصيغة التحويل اليونيكودية (Unicode Transformation Format)، وبروتوكول نقل النص التشعبي (Hypertext Transfer Protocol)، وأحداث الخادم المرسلة (Server-Sent Events)، ومحدِّد الموارد الموحد (Uniform Resource Locator)</li>
<li>POSIX, MMAP, DNULLMM1, SHA, SIGKILL, ESRCH, EACCES, EOF, NT, NTFS, CRLF, MSVC, UCRT, FFI, DLL: واجهة نظام التشغيل المحمولة، وواجهة الملفات المعيّنة في الذاكرة، وصيغة الفهرس الثنائية المعيّنة في الذاكرة للعدم الحتمي (Deterministic Null)، وخوارزمية التجزئة الآمنة (SHA-256)، وإشارة إنهاء عملية في POSIX غير قابلة للاعتراض، وحالة النواة الدالّة على عدم وجود العملية، وحالة الخطأ في POSIX الدالّة على رفض الإذن، ومحدِّد نهاية الملف في وثيقة heredoc، ونواة Windows New Technology (`Windows NT`)، ونظام الملفات New Technology، وتسلسل السطر الجديد بحرفي الرجوع إلى بداية السطر والتغذية بالسطر (`\r\n`)، ومترجم Microsoft Visual C++ (`cl.exe`)، وبيئة التشغيل C الشاملة لنظام Windows (`ucrtbase.dll`)، وواجهة الدوال الخارجية، و​مكتبة الربط الديناميكي</li>
<li>AI، ML، LLM، MLX، GGUF، KV، TP، ENERGY: الذكاء الاصطناعي، والتعلم الآلي، ونموذج اللغة الكبير، وإطار مصفوفات Apple للاستدلال المحلي (MLX)، وأوزان الكمّيّة بصيغة GGUF (GPT-Generated Unified Format)، وذاكرة المفاتيح والقيم المؤقتة (KV cache)، والتوازي على مستوى المصفوفات (tensor parallelism)، وتحالف ML.ENERGY لقياس استهلاك طاقة معالجات الرسوميات</li>
<li>CPU, GPU, APU, ANE, SoC, ALU, ISA, IPC, PID, UID, GID, OS, VM, EC, GB, TGL, RTX: وحدة المعالجة المركزية، ووحدة معالجة الرسوميات، ووحدة المعالجة المسرّعة، ومحرك الشبكات العصبية من Apple، ونظام على شريحة، ووحدة المنطق الحسابي، وبنية مجموعة التعليمات، والتعليمات المنفذة لكل دورة، ومعرّف العملية، ومعرّف المستخدم، ومعرّف المجموعة، ونظام التشغيل، والآلة الافتراضية، والمتحكم المدمج، وغيغابايت، وبنية Intel Tiger Lake المحمولة، و​عائلة وحدات معالجة الرسوميات المنفصلة NVIDIA GeForce RTX</li>
<li>ذاكرة الوصول العشوائي، ذاكرة الوصول العشوائي الديناميكية، ذاكرة التخزين المؤقت على مستوى النظام، Non-Volatile Memory Express، وحدة إمداد الطاقة، وحدة توزيع الطاقة، تيار متردد، تيار مستمر، تغيير الجهد والتردد الديناميكي، سجل خاص بالنموذج، الإدخال/الإخراج المعين على الذاكرة، تعليمة x86 Read Time-Stamp Counter، سلامة الكود المحمية بواسطة المراقب الافتراضي في Windows، أدوات إدارة Windows، واجهة قياس الطاقة في Windows (`\\.\EnergyMeter`)، ومراقب استخدام موارد النظام في Windows</li>
<li>RAPL، NVML، PPT، TI، I2C، ADC، INA، INA238، INA3221، AGX، VDD، SOC، MSS، VIN، SYS، PLATYPUS: حد متوسط الطاقة المتحرك في Intel/AMD (Running Average Power Limit)، ومكتبة إدارة NVIDIA (NVIDIA Management Library)، وتتبّع طاقة الحزمة في AMD (AMD Package Power Tracking)، وشركة Texas Instruments، وناقل الدائرة المتكاملة (Inter-Integrated Circuit bus)، ومحوّل analog-to-digital (ADC)، وعائلة أجهزة قياس التيار والطاقة من Texas Instruments (`INA238`، `INA3221`)، وفئة وحدات NVIDIA Jetson AGX، وخط جهد التغذية للتصريف (drain supply voltage rail)، وخط جهد النظام على الشريحة (system-on-chip rail)، وخط جهد النظام الفرعي للذاكرة (memory subsystem rail)، وخط جهد النظام الداخل (input system voltage rail)، وهجمات تسريب الطاقة: الاستهداف البرمجي لمعالجك (Power Leakage Attacks: Targeting Your Processor Using Software)</li>
<li>API, USD, CNCF, AISI, UK, AMD, NVIDIA: واجهة برمجة التطبيقات، دولار أمريكي، مؤسسة الحوسبة السحابية الأصلية، معهد سلامة الذكاء الاصطناعي، المملكة المتحدة، أدفانسد مايكرو ديفايسز، وشركة إنفيديا</li>
<li>RCE, MoL, WCA, LUT6: محرك كود الواقع [نفس الجهة]، مزيج الحدود [نفس الجهة]، أتمتة الحاسوب الحكيم [نفس الجهة]، وجدول بحث بولياني بست مدخلات</li>
</ul>

عبر مستويات القياس عن بُعد من L0 إلى L4، تحمل كل قناة مسجّلة في إيصال `SATB` حدّها الفيزيائي وواحدة من أربع فئات أدلة صارمة:

| فئة الدليل | النطاق في إيصالات وجداول `SATB` |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | ملخصات `SHA-256` و`JCS` (`RFC 8785`) القانونية لحزم المهام وبصمات `SUT` ذات الكتل الخمس وسجلات إعادة التشغيل؛ وأعداد رموز المطالبة والذاكرة المؤقتة والاستدلال والإكمال المسجّلة عبر الوكيل؛ والمدد الزمنية بالساعة الجدارية؛ وأسعار قوائم `API` المؤرّخة بالـ`USD`. |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | لا تُملأ إلا من محلّل طاقة `AC` خارجي معايَر عند الجدار (`L0`) أو من مراقب تيار تحويلي (shunt) فيزيائي على اللوحة (`L1`/`L2`). جرى التحقق منها مباشرة على `NVIDIA Jetson AGX Thor` عبر `INA238` من `TI` (`hwmon6` `VIN`، `L1`) و`INA3221` (`hwmon5` `ch1 VDD_GPU` و`ch2 VDD_CPU_SOC_MSS` و`ch3 VIN_SYS_5V0`، `L2`/`L1`؛ `board_metered = true`). ولأن مستأجرًا مشاركًا نشطًا كان يشغل `VDD_GPU` أثناء الالتقاط (`dedicated_host = false`)، يُحفظ `measured_j` الخام للمسار بينما يُحجب إسناد التوزيع الصافي `A2`؛ ويبقى `measured_j` مساويًا لـ`None` على `Apple M5 Max` و`AMD Strix Halo` و`Intel Raptor Lake` و`Windows 11` (`i7-1165G7` مع `RTX 2060`)، وتبقى طاقة الجدار `L0` غير مضبوطة في جميع الحالات. |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | عدّادات قياس عن بُعد على الشريحة لا تتطلب صلاحيات الجذر (`IOReport` على `Apple M5 Max`: `sys_power` عند `L1` و`chip_power`/`cpu_power`/`gpu_power` عند `L2` عبر `macmon`؛ و`RAPL` على `Intel Raptor Lake`: `psys` عند `L1` و`package-0`/`core`/`uncore` عند `L2`؛ و`RAPL` على `Framework AMD Strix Halo`: `package-0`/`core` عند `L2` مع واط `PPT` من `amdgpu`؛ و`NVML` على `Windows 11` دون صلاحيات الجذر: `nvmlDeviceGetTotalEnergyConsumption` بالـ`mJ` التراكمي على `NVIDIA GeForce RTX 2060` عند `L2`)، وتقديرات لكل عملية يحاكيها نظام التشغيل (`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` عند `L3`، الوسم `D`). لا تُجمع أبدًا مع `measured_j` أو `est_j`. |
| **`Provider-Attested (P) vs. Not Available (N)`** | تُكتب طاقة الخادم البعيد في واجهات `API` المغلقة (وكذلك طاقة حزمة `CPU` في وضع المستخدم على `Windows 11` حيث تُمنع مشغّلات `RAPL` `MSR` في الحلقة 0) بالوسم `P` فقط حين يُرجع المزوّد رقم طاقة لكل طلب مع منهجية حرفية، وتُكتب خلاف ذلك حرفيًا `"not_available"` (الوسم `N`). وتُسقَط تلقائيًا عمليات طرح خط الأساس المشتقة التي تتجاوز حد الانجراف `5.0%` (`Falsifier 6`) أو تفشل في فحص المجموع في `Step 7`، بينما تبقى القنوات الخام سليمة. |

<div id="11-lineage-design-invariants-and-same-house-disclosure" class="anchor-alias" aria-hidden="true"></div>

### 1.1 السلالة، ثوابت التصميم، وإفصاح داخل المؤسسة

`SATB` يبني مباشرةً على أعمال تقييم الوكيل العامة وإسناد الطاقة بدلاً من اختراع بروتوكولات مخصصة حيث توجد معايير: تنفيذ صدفية لا حالة يتبع `mini-swe-agent`؛ الجسر بين الحلولات وCLI الخارجي يستند إلى `UK AISI Inspect` (`react()` و `Inspect Agent Bridge`) و`Terminal-Bench` (`Harbor` / `Terminus-2`); مخططات الأدوات تستخدم `MCP` التي تم تقنينها عبر `RFC 8785` (`JCS`); انضباط عداد GPU المتراكم يتبع Chung et al. (`ML.ENERGY` / `Zeus`) وYang et al. حول مخاطر أخذ عينات `nvidia-smi` الجزئية؛ توزيع `CPU` النسبي (`label C`) يتم تقييمه مقابل نموذج `CNCF Kepler`؛ وعزل أذونات Linux `RAPL` يتبع Lipp et al. (`PLATYPUS`). دراسات Open Interface Engineering المصاحبة، [البوابات المقيّدة للالتزام](/papers/gates/), [إشباع المهمة مقابل الارتداد التجميعي](/papers/satiation/), و[الصفر الحتمي](/papers/deterministic-null/), هي أعمال `[same house]` مُستشهد بها صراحةً لتعاريف معمارية مشتركة:

| محور العقد | الثابت المحفوظ عبر جميع المسارات |
| :--- | :--- |
| **بروتوكول المحاولة** | سلم مهمة ثابت؛ بحد أقصى `SUBMIT` أو `REFUSE` نهائي واحد لكل محاولة؛ إيصال `SHA-256` غير قابل للتغيير لكل محاولة؛ نتائج معيارية `pass`، `fail`، `refuse`، `killed`؛ لا توجد ملاحظات من المحقق أثناء محاولات الاختبار. |
| **هوية النظام** | بصمة `SUT` من पाँच كتل (`model` + `serving` + `sampling` + `harness` + `envelope`)، يتم تجزئتها عند `session.open` وإعادة تجزئتها عند `session.close`. |
| **الطاقة القابلة للإسناد** | الطاقة الخام للنوافذ لكامل `SUT` (`A2`) على مضيف مخصص في حالة راحة؛ طاقة محرك الاستدلال على سكة فعلية حصرية (`A1`); طاقة مرحلة النموذج مقابل الأدات المتسلسلة (`B`) تحت `Lane B`. |
| **غير القابلة للإسناد** | جوليات خادم `API` المغلق غير موثقة (`N`); حصص جول دقيقة لكل عملية من `SoC` المشترك أو سكة الذاكرة الموحدة (`C` و `D` نماذج، ليست عدادات سكة فعلية); أوزان النموذج مفصولة عن نوى المحرك والسيليكون. |

---

<div id="2-survey-of-agent-harnesses-and-why-context-policy-is-part-of-the-system" class="anchor-alias" aria-hidden="true"></div>

## 2. المسح الشامل لآليات الوكيل ولماذا سياسة السياق جزء من النظام

تختلف إطارات البرمجة والطرفية واستخدام الحاسوب الحديثة اختلافًا حادًا في كيفية تعريض الأدوات، وحماية تعديلات الملفات، وضغط محادثات التاريخ النامية:

| الإطار | حلقة السطح والأداة | سياسة السياق والتاريخ |
| :--- | :--- | :--- |
| **`mini-swe-agent`** | `Bash` فقط. كل إجراء يُنشئ `subprocess.run` جديدًا عديم الحالة. | سجل رسائل خطي صارم ملحق فقط؛ لا ضغط تلقائي. |
| **`SWE-agent` (`ACI`)** | عارض ملفات بنافذة 100 سطر، أمر تعديل محكوم بالمدقق، بحث موجز. | معالج التاريخ يطوي ملاحظات البيئة القديمة إلى ملخصات محدودة. |
| **`Inspect react()`** | حلقة أدوات تسلسلية حتى `submit()`: `bash()`، `text_editor()`، أدوات `MCP`. | حالة رسائل قابلة للتعديل مع محللات تقليم أو ضغط تاريخ قابلة للتوصيل. |
| **`Inspect Agent Bridge`** | يغلف `Claude Code`، `Codex CLI`، `Gemini CLI`، ووكلاء `SDK` مخصصين خلف وكيل محلي. | يفوض إدارة السياق بالكامل إلى الإطار الخارجي المغلف. |
| **`Terminus-2` (`Harbor`)** | أداة واحدة: جلسة طرفية `tmux` مستمرة تتلقى ضغطات مفاتيح خام. | تلخيص سياق من ثلاث مراحل (`3-stage` ضغط نصي تدريجي). |
| **`Codex CLI`** | صدفة معزولة (`Landlock`/`seccomp` أو `seatbelt`)، `apply_patch` منظم، `MCP`. | ضغط سياق متدحرج أصلي يُفعّل قرب حدود نافذة النموذج. |
| **`Claude Code`** | `Bash`، أدوات ملفات منظمة (`Read`، `Write`، `Edit`، `Glob`، `Grep`)، `MCP`. | ضغط محادثة تلقائي مدفوع بالنموذج اللغوي (`auto-compact`) بالإضافة إلى التخزين المؤقت للمطالبات. |
| **`OpenHands`** | زمن تشغيل تدفق أحداث ينفذ أي وكيل برمجة `ACP` أو `CodeAct` داخل حاويات. | مكثف سياق قابل للتهيئة (تلخيص `LLM` أو قناع النافذة). |
| **`ARC-AGI-3` runner** | إطار قياسي مقابل إطارات محولات المزود على حالات الشبكة التفاعلية. | نافذة مسار حالة بصرية/شبكية محدودة معلنة لكل مسار محول. |
| **`OSWorld run.py`** | حلقة `GUI` سطح مكتب تبعث إجراءات فأرة/لوحة مفاتيح `pyautogui` على لقطات شاشة آلة افتراضية. | نافذة مسار منزلقة تحتفظ فقط بأحدث $K$ لقطة شاشة وإجراء. |

على `Terminal-Bench 2`، حل `Gemini 2.5 Pro` **17%** من المهام أكثر عند اقترانه بـ`Terminus-2` مقارنة باقترانه بـ`OpenHands`، مع الاحتفاظ بنقطة تحقق النموذج الأساسي ثابتة. لذا فإن إدارة السياق، وتقليم المخرجات، وتدقيق التعديلات، وقواعد إعادة المحاولة هي مكونات من الدرجة الأولى للنظام المقيَّم وليست أنابيب محايدة. يحل `SATB` هذا الالتباس من خلال تقسيم التقييم إلى مسارين صريحين وإغلاق السؤالين المفتوحين `OQ-1` و`OQ-2`:

1. **تثبيت الغلاف البرمجي (`Lane B`) مقابل تقييم الأغلفة الخارجية (`Lane O`)**: يثبّت `Lane B` (`satb-agent`) حلقة Rust واحدة قابلة للتدقيق عبر جميع النماذج، بينما يغلّف `Lane O` أطر عمل كاملة من أطراف ثالثة (`Claude Code` و`Codex CLI` و`OpenHands` و`Terminus-2` و`Inspect`) بوصفها `SUT` صندوقًا أسود، إذ تُجزَّأ مطالباتها الداخلية واستدعاءات الضغط الخاصة بها إلى قيم تجزئة ضمن كتلة البصمة `harness`، وتُوجَّه كلها بنسبة 100% عبر `satb-proxy`.
2. **حل سياسة السياق (`OQ-1`: `ContextRule_v0`)**: إن إنهاء المحاولة فورًا عند عدم وجود أي حذف يخلط بين الاستدلال متعدد الخطوات وبين مخرجات الأدوات المطوّلة، في حين أن التلخيص المولَّد بواسطة `LLM` (مثل الضغط التلقائي في `Claude Code`) يُدخل استدعاءات نموذج stochastic خفية تكسر إعادة التشغيل الحتمية لإطار العمل. يعتمد `Lane B` قاعدة **`ContextRule_v0`**: عندما يتجاوز حجم المحادثة المتراكم **`80%`** من نافذة السياق المعلنة، يستبدل إطار العمل حتميًا أقدم مخرجات الأدوات بالنص `"[ELIDED_BY_CONTEXT_RULE_V0]"`، مع الإبقاء على `system(TEMPLATE_v0)` والرسالة الأولية `user(render(bundle))` وآخر `8` مخرجات أدوات كما هي دون تعديل، دون إجراء أي استدعاء للنموذج. لا يُفعَّل الإنهاء الصارم `killed(context_ceiling)` إلا إذا تجاوزت الرسائل المحتفَظ بها وحدها `100%` من النافذة.
3. **حل سطح الأدوات (`OQ-2`: `TOOLS_v0`)**: إن الاقتصار على `exec` وحده (على نمط `mini`) يُجبر النماذج على تمرير تصحيحات مصدرية متعددة الأسطر والبراهين الجبرية عبر الصدفة (`cat << 'EOF'`)، مما يُدخل أخطاء في تنسيق الاقتباس الخاصة بالصدفة لا علاقة لها باستدلال المهمة، ويعقّد العزل الخفيف غير المتطلب لصلاحيات الجذر عبر `macOS` و`Linux` و`Windows`. يثبّت `Lane B` **`TOOLS_v0`**: أربع أدوات لمساحة العمل (`exec` و`read_file` و`write_file` و`list_dir`) وأداتين طرفيتين (`submit` و`refuse`)، مُعيَّنة إلى قانون معياري عبر `JCS` لتُنتج `tools_hash` (`d5b102...`).

---

<div id="3-reference-harness-lane-b-contextrule_v0-and-satb-io-protocol" class="anchor-alias" aria-hidden="true"></div>

## 3. إطار الاختبار المرجعي (`Lane B`)، `ContextRule_v0`، وبروتوكول `SATB-IO`

<figure class="my-8">
  <img src="/figures/satb-harness/satb-lane-b-architecture.svg" alt="طوبولوجيا عزل مكوّنات معيار الإشباع Lane B ودورة حياة الجلسة الحتمية." />
  <figcaption>الشكل 1. اليسار: عزل مكوّن <code>Lane B</code> يفصل <code>satb-meter</code> غير جذري، <code>satb-supervisor</code>، <code>satb-agent</code>، <code>satb-sandbox</code> المحجوب بالشبكة، <code>satb-proxy</code> الحامل للبيانات الاعتمادية، والـ <code>Verifier</code> الخارجي غير القابل للوصول. اليمين: جلسة <code>SATB-IO</code> حتمية وتسلسل المحاولات.</figcaption>
</figure>

<div id="31-sequential-execution-loop-and-fixed-versus-configurable-split" class="anchor-alias" aria-hidden="true"></div>

### 3.1 حلقة التنفيذ المتسلسل والتقسيم الثابت مقابل القابل للتهيئة

داخل `satb-agent`، ينفذ كل محاولة حلقة وكيل فردي متسلسلة بشكل صارم بدون خيوط أدوات خلفية متداخلة، وبدون تصويت `best-of-k`، وبدون تغذية راجعة من محلل التحقق:

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

كل تشغيل من `Lane B` يفصل الثوابت الثابتة للمعيار (المُجَمَّعة في `harness_id`) عن معلمات `SUT` المُعلنة (المُجَمَّعة في `sut_fingerprint_sha256`):

| ثابت عبر جميع تشغيلات `Lane B` (`harness_id`) | قابل للتكوين لكل `SUT` (`sut_fingerprint_sha256`) |
| :--- | :--- |
| `TEMPLATE_v0` مطالبة، عارض الحزمة، و `CONTINUE_v0` تنبيه | `model_id`، تاريخ لقطة المزود، أو `GGUF`/safetensors محلي `SHA-256` |
| `TOOLS_v0` مخططات (`tools/list` `JCS` ملخص) و الإرسال المتسلسل | معلمات العينة: `temperature`، `top_p`، `top_k`، `seed`، `max_tokens`، `reasoning_effort` |
| `ContextRule_v0` (`80%` عتبة، احتفظ بآخر `8`) و `Truncate_v0` (`8 + 8 KiB`) | محرك الخدمة (`llama.cpp`، `MLX`، `vLLM`، سحابة `API`) وعلامات الدُفعة/الذاكرة المؤقتة |
| محاولة واحدة (`attempts = 1`)، لا رد فعل من المُتحقق، لا تصويت داخلي | حدود المغلف: `wall_ms`، `max_total_tokens`، `max_turns` |
| `satb-sandbox`: حصر `/work`، بيئة مُقشرة، لا خروج شبكة | حصص `CPU`/`RAM` في الحاوية، سيليكون المضيف، نواة `OS`، ومستوى العزل |

<div id="32-canonical-four-way-outcome-mapping-oq-3" class="anchor-alias" aria-hidden="true"></div>

### 3.2 التعيين المعياري لأربع نتائج (`OQ-3`)

لمنع إطارات القياس من إهمال عمليات الانهيار صمتًا أو دمج الإجابات الخاطئة الطوعية مع مهلات البنية التحتية، يقوم `SATB` بتحويل رموز الانتهاء الخمسة القديمة إلى **`{pass, fail, refuse, killed}`** (`PFRK`) بطريقة لا فقد فيها أي معلومات، مع الحفاظ على `sub_reason` الدقيق في كل إِيصال:

1. **`completed` $\to$ `pass` (`sub_reason: "verified"`, score `1`)**: استدعى `SUT` الدالة `submit(bytes)` قبل انتهاء السقف وجعل `Verifier` الخارجي يقبل `bytes` بعد `attempt.close`.
2. **`incorrect` $\to$ `fail` (`sub_reason: "incorrect"`, score `0`)**: استدعى `SUT` الدالة `submit(bytes)` بنظافة؛ رفض `Verifier` الخارجي المرشح.
3. **`malformed` $\to$ `fail` (`sub_reason: "malformed_submission"`, score `0`)**: استدعى `SUT` طواعيًا الدالة `submit(bytes)` بمحتوى غير قابل للتحليل أو غير صالح وفق المخطط. تقديم خاطئ من إنتاج `SUT` يعتبر فشلًا في الدقة، وليس قتلًا من البنية التحتية.
4. **`refused` $\to$ `refuse` (`sub_reason: "policy" | "capability" | "other"`, score `0`)**: استدعى `SUT` صراحةً الدالة `refuse(reason)`.
5. **`no_submission` $\to$ `killed` (`sub_reason: "wall_ceiling" | "token_ceiling" | "turn_ceiling" | "context_ceiling" | "usage_missing" | "exec_timeout_killed" | "process_crash"`, score `0`)**: أنهى `satb-supervisor` المحاولة قبل وصول أي استدعاء لأداة نهائية. تظل جميع النتائج الأربعة في البسط $n$.

---

<div id="4-adapter-bridge-shapes-d-m-h-i-five-block-sut-fingerprint-and-c1c12-conformance" class="anchor-alias" aria-hidden="true"></div>

## 4. جسر المحوّل (`Shapes D, M, H, I`)، وبصمة `SUT` ذات الخمس كتل، ومطابقة `C1-C12`

<div id="41-four-adapter-shapes-behind-one-supervisor-and-proxy" class="anchor-alias" aria-hidden="true"></div>

### 4.1 أربعة أشكال محوّلات خلف مشرف واحد ووكيل

تتصل أي منظومة خارج `Lane B` بـ `satb-supervisor` عبر واحد من أربعة أشكال للمحوّلات:

| شكل المحول | الأنظمة المستهدفة | عقد التنفيذ والعزل | المعايير المعاد استخدامها |
| :--- | :--- | :--- | :--- |
| **`Shape D` (`dnull` control)** | صفر حتمي (`N0` نموذج خالٍ من القيود الصارم و `N1` مُثبت تطويريًا) على مخازن `DNULLMM1` `mmap` المجمدة | يُنفّذ داخل `/work` وفق قواعد `TOOLS_v0` و `Verifier` المتطابقة مع **`0` مكالمات نموذج الوكيل** عند اتخاذ القرار. | `POSIX mmap` / Win32 `MapViewOfFile`، حلقة عدد صحيح 64-بت `SPEC v0.4` |
| **`Shape M` (Model endpoint)** | خوادم وزن مفتوح محلية و `API`s سحابية مغلقة | يشغّل `Lane B` `satb-agent` على `Chat Completions` أو `Messages` مع استدعاءات أدوات و `usage` إلزامية، يتم توجيهها بنسبة 100% عبر `satb-proxy`. | `API` متوافق مع OpenAI (`llama.cpp`، `mlx_lm`، `vLLM`); مترجمو `Anthropic`، `Gemini`، `xAI` |
| **`Shape H` (Harness in a box)** | `Claude Code`، `Codex CLI`، `Gemini CLI`، `OpenHands`، `Terminus-2` | المهمة مكتوبة في `/work/task/BUNDLE.md`. `URL` الأساسي موجه إلى `satb-proxy` (`127.0.0.1:<port>`); مفاتيح `API` الحقيقية محجوزة عن `/work`; تنتهي عبر `MCP` `submit` أو `refuse`; لا خروج آخر. | `Inspect` متغيرات بيئة جسر صندوق الرمل؛ `--strict-mcp-config` `MCP`; `ACP` اختياري |
| **`Shape I` (`Inspect` agent)** | محللات `Inspect` العامة الموجودة | يغلف حزمة مهمة `SATB` بأدوات `submit` و `refuse` عند `attempts = 1`، يوجه مكالمات النموذج عبر `satb-proxy`. | `UK AISI Inspect` `Task` وواجهة `Solver` |

<div id="42-five-block-sut-fingerprint-and-session-validity" class="anchor-alias" aria-hidden="true"></div>

### 4.2 خمس-كتل `SUT` بصمة وصلاحية الجلسة

قبل أن يتم إطلاق `attempt.start`، يُعيد المحوّل بنية JSON مكوّنة من خمس كتل يكون ملخّص `JCS` `SHA-256` الخاص بها هو تعريف `SUT`. يجب كتابة أي حقول غير معروفة أو غير قابلة للملاحظة حرفيًا كـ `"not_available"`، ولا يجوز حذفها أو تخمينها:

| كتلة البصمة | الحقول المطلوبة (القيم غير المتاحة تُكتب حرفيًا كـ `"not_available"`) |
| :--- | :--- |
| **`model`** | `provider`, `model_id`, `snapshot_date`, `weights_sha256`, `quantisation`, `tokenizer_hash`, `chat_template_hash`, `context_window`, `system_fingerprint` |
| **`serving`** | `engine`, `version`, `commit`, `binary_hash`, `flags_hash` (`cache_prompt`, `slots`, `batch_invariance`, `TP`), `drivers`, `devices` |
| **`sampling`** | `temperature`, `top_p`, `top_k`, `seed`, `max_tokens`, `stop`, `reasoning_effort`, `tool_choice` |
| **`harness`** | `name`, `version`, `commit`, `binary_hash`, `prompt_hash`, `tools_hash`, `context_policy`, `internal_voting`, `sub_agents`, `config_hash` |
| **`envelope`** | `hardware`, `os_kernel`, `isolation_tier`, `cgroup_limits`, `cpuset`, `network_policy`, `ceilings`, `telemetry_config_hash` |

**إبطال الجلسة وعلامات البدء/النهاية.** أي ملخّص كتلة متغيّر عند `session.close`، أو أي إشعار `MCP` `tools/list_changed`، أو إعادة تشغيل محرك الاستدلال، أو إعادة تعيين عدّاد `NVML`، أو تغيير صدى `model` أو `system_fingerprint` ضمن الجلسة، أو تحديث `OS`/المشغل يجعل **كل إيصال في الجلسة `void`**. تظل إيصالات الإبطال في الأرشيف العام لأغراض التدقيق ولكنها تُستبعد من وضع المعيار. وبما أن موفر السحابة قد يبدّل الأوزان أو الكوانتيزايشن خلف `model_id` ثابت دون تحديث `system_fingerprint`، فإن كل جلسة تُحدّد تقييمها بعلامة تحديد حتمية عند `session.open` و `session.close`.

<div id="43-mandatory-c1c12-adapter-conformance-suite" class="anchor-alias" aria-hidden="true"></div>

### مجموعة التوافق الإلزامية `C1-C12` للمحوّل

لا يدخل أي محوّل أو إطار اختبار مرحلة التقييم إلا بعد اجتيازه جميع التحققات الاثني عشر للامتثال (`C1` إلى `C12`):

| الفحص | شرط النجاح |
| :--- | :--- |
| **`C1` إعادة لفّ الحزمة** | يعيد المحوّل الملخّص `SHA-256` الدقيق لـ `JCS` للحزمة المُدخلة. |
| **`C2` مسار الإرسال** | يستلم `Verifier` الخارجي التسلسل البايتي الدقيق المسجَّل في التقاط الطرفية `satb-proxy` / `MCP`. |
| **`C3` مسار الرفض** | يصل الرفض المُوجَّه بنجاح بوصفه `refuse` (`sub_reason = "other"`, `completion_score = 0`). |
| **`C4` استدعاء طرفي واحد** | تُهمَل جميع استدعاءات الأدوات أو الطرفية الصادرة بعد أول `submit` أو `refuse` ويُحتسب عددها. |
| **`C5` عدم وجود مُحكِّم** | المجلدات والمآخذ (sockets) والمسارات الأصلية (`..`) الخاصة بـ `Verifier` و`satb-supervisor` غير قابلة للوصول من `/work`. |
| **`C6` المخرج الشبكي** | لا يمكن الوصول لحركة النماذج إلا عبر `satb-proxy` (`127.0.0.1:<port>`)؛ وتفتقر عمليات `/work` الفرعية إلى أي وصول شبكي خارجي وإلى أي مفاتيح `API` للمزوّد الأعلى. |
| **`C7` وجود الاستخدام** | يحمل كل استدعاء للنموذج الحقل `usage` (`missing -> killed(usage_missing)`)؛ وتطابق مجاميع الرموز في الوكيل أعداد المحرك الأعلى تطابقاً تاماً. |
| **`C8` ثبات البصمة** | تبقى بصمة `SUT` ذات الكتل الخمس بقيمة `SHA-256` مطابقة قبل تشغيل تجريبي من ثلاث محاولات وبعده. |
| **`C9` إعادة تشغيل الإطار** | تعيد إعادة تشغيل الاستجابات المسجَّلة من `satb-proxy` إنتاج نصٍّ مكتوب (transcript) مطابق بايتاً ببايت، بفروق `0` بايت أو `CRLF` (إلزامي لـ `Lane B`). |
| **`C10` مسار الإنهاء القسري** | تُحصد شجرة عمليات `/work` الجامحة (مجموعة عمليات `POSIX` أو Win32 Job Object، بما في ذلك العمليات الفرعية المنفصلة) خلال `< 2,000 ms` وتُسجَّل بوصفها `killed`. |
| **`C11` مصافحة القياسات** | تكون عدّادات العمليات على المستوى `L3` بدون صلاحيات الجذر (`cgroup v2`، أو `proc_pid_rusage`، أو Win32 `GetProcessTimes`/`QueryProcessCycleTime`) قابلةً للقراءة، وتصل علامات المراحل، ويُسجَّل فرق الإزاحة بين الساعة الأحادية الاتجاه والساعة الجدارية. |
| **`C12` مسبار الحتمية** | يُنفَّذ `8` طلبات متطابقة، ويُسجَّل عدد المخرجات المتمايزة بوصفه خاصيةً تجريبيةً لـ `SUT`. |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. إسناد القياسات بخمسة مستويات (`L0-L4 × A1-N`)، خرائط قنوات المنصة، وما لا يمكن إسناده

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="حدود إسناد القياسات بخمسة مستويات من L0 إلى L4 مع تسميات A1 إلى N وخط أنابيب الفحص المجمع ذي السبع خطوات raw-first." />
  <figcaption>الشكل 2. اليسار: مستويات القياسات الفيزيائية والمنطقية <code>L0</code>-<code>L4</code> المرتبطة بتسميات الإسناد <code>A1</code>-<code>N</code>. اليمين: نظام عداد من سبع خطوات raw-first يفرض حدود انحراف الخط الأساسي قبل/بعد (<code>Falsifier 6</code>) و<code>Step 7</code> فحص المجمع.</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 حدود القياسات (`L0-L4`) وتسميات الإسناد (`A1-N`)

تقع حساسات الطاقة والنشاط عند خمسة حدود متميزة تقيس كميات مادية مختلفة ولا يجوز جمعها أو الخلط بينها أبداً:

| المستوى | الحد الفزيائي / المنطقي | المستشعرات الممثلة | ما يمكن للقناة أن تنسبه بصراحة |
| :--- | :--- | :--- | :--- |
| **`L0` wall** | `AC` في مقبس الحائط | مقبس ذكي أو `PDU` (`Shelly` `apower`, `aenergy`; محلل `Yokogawa`) | الآلة بأكملها بما فيها حرارة تحويل `PSU`، المراوح، `DRAM`، و`NVMe`؛ إيقاع `~1 s`. |
| **`L1` platform** | خط إدخال `DC` للوحة | `Jetson Thor INA238` حامل; `Mac sys_power`; `RAPL psys` | الكمبيوتر الكامل على جانب `DC` أسفل وحدة الطاقة أو `PSU`. |
| **`L2` package / SoC** | `CPU` حزمة, `GPU`, و خطوط `SoC` | `RAPL pkg`; rootless `macmon IOReport`; `Thor INA3221`; `amdgpu hwmon`; `NVML` cumulative energy (`mJ`) | الـ `SUT` بالكامل على `SoC` (`A2`)، أو محرك الاستدلال وحده عندما يكون الخط حصريًا ماديًا (`A1`). |
| **`L3` process / cgroup** | شجرة عملية `OS` واحدة | `Linux cgroup v2` (`cpu.stat`, `memory.peak`, `io.stat`), `perf`; `macOS proc_pid_rusage` `ri_energy_nj`; Win32 `GetProcessTimes` + `QueryProcessCycleTime` | حصص نشاط الموارد (`C`)، أو نموذج الطاقة الداخلي لكل عملية في نواة `OS` (`D`). |
| **`L4` logical** | المحادثة بين النموذج/الأداة | `satb-proxy` عدد الرموز وتأخيرات الاستدعاء; دورات الحصان، استدعاءات الأداة، وإلغاءات `ContextRule_v0` | عدد دقيق لكل `SUT` دون استثناء، بما في ذلك `API`s السحابية المغلقة. |

كل قيمة طاقة في الإيصال تحمل واحدة من سبع علامات إسناد:

- **`A1` (Exclusive physical rail)**: مستشعر قضيب أجهزة فيزيائي يُلمس حصريًا بواسطة قسم واحد خلال نافذة القياس (مثل `Jetson Thor INA3221 ch1 VDD_GPU` عندما يكون محرك الاستدلال المحلي فقط لديه وصول إلى جهاز `GPU`).
- **`A2` (Dedicated whole-system boundary)**: عداد للآلة بأكملها (`L0`/`L1`) أو للحزمة بأكملها (`L2`) على آلة مخصصة هادئة (`SUT` بالإضافة إلى `OS` أرضية خاملة). **وفقًا لـ `OQ-4`، طاقة النافذة الخام لـ`SUT` بأكمله عند `A2` هي المقياس الفيزيائي الأساسي للطاقة في الوضع**، مما يمنع النماذج الرقيقة من تفريغ بحث قوي غير محسوب إلى عمليات فرعية في `/work` ويمنع طرح `active - idle` من تحسين الأداء في التشغيلات البطيئة.
- **`B` (Temporal phase split)**: فروق العدادات عبر نوافذ زمنية غير متداخلة يحدها علامات مراحل تسلسلية (`model_call` مقابل `tool_call` في `Lane B`).
- **`C` (Proportional share, the `Kepler` model)**: عداد أجهزة مشترك يُقسم حسب $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ أو استخدام `GPU` عند تداخل العمليات المتوازية (`Lane O` `Shape H`).
- **`D` (`OS`-modelled estimate)**: نموذج الطاقة الداخلي للنواة لكل عملية (`macOS ri_energy_nj`). يعزل شجرة عملية عن مستأجري `CPU` المشتركين، لكنه يظل نموذجًا للبرمجيات الثابتة/النواة بدلًا من قراءة تحويل فيزيائي.
- **`P` (Provider-attested)**: رقم طاقة خادم لكل طلب يُرجعه مزود سحابي إلى جانب منهجية قياسه الحرفية.
- **`N` (`not_available`)**: غير ملاحظ و**لا يُقدر أبدًا**.

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 الانضباط المتسلسل بسبع خطوات، الجمع بدون جذر (`OQ-5`)، وخرائط المنصات

يعالج `satb-meter` كل محاولة عبر سبع خطوات مرتبة:
1. **قراءة العدّادات التراكمية عند كل حدّ حدث** (`attempt.start`، وكل `model_call` و`tool_call`، و`attempt.close`، إضافةً إلى علامة مرجعية كل `100 ms`) بحيث تكون طاقة النافذة فرق عدّاد دقيق $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$.
2. **كتابة القنوات الخام أولاً**: تسجيل الحد، والمستشعر، والقراءتين الابتدائية والنهائية، وحالات التفاف العدّاد (counter wraps)، وعدد العينات. وتُوسَم النوافذ الأقصر من `10` دورات للمستشعر بالقيمة `"below_resolution"`، والعتاد الغائب بالقيمة `"not_available"`.
3. **تقسيم المراحل المتسلسلة (`B`)**: في `Lane B`، لا يتداخل الاستدلال النموذجي واستدعاءات أدوات `/work` زمنياً أبداً؛ أما أطر `Lane O` المتوازية فتُسقط تقسيم المراحل إلى `C` أو `N`.
4. **عزل `engine_resident_during_tools`**: أثناء تشغيل أداة `/work`، يحتفظ خادم نموذج محلي (`llama-server`، `vLLM`) بأوزان النموذج مقيمةً في `GPU`/`DRAM`. يُدرج استهلاكه في وضع الخمول خلال نافذة الأداة ضمن `engine_resident_during_tools`، ولا يُحمَّل لا على الاستدلال النشط للنموذج ولا على تنفيذ الأداة.
5. **التقسيم بالنسبة (`C`) فقط حيث تتداخل الأقسام**: تُطبَّق نسب $\Delta \text{CPU}$ بصرامة بوصفها خياراً احتياطياً للتوصيف، مع الإقرار بأن حالات `C`، وتردد `DVFS` التوربيني، وتوقفات `DRAM`/التخزين تخرق افتراض التناسب.
6. **تخزين خطوط الأساس كقنوات مشتقة**: تُحاط الجلسات بخطوط أساس مقيمة قبلية وبعدية؛ فإذا تجاوز انحراف استهلاك الخمول بين القياس القبلي والبعدي نسبة `5.0%` (`Falsifier 6`)، تُسقط القيم المشتقة للطاقة الصافية فوق الخمول مع إبقاء القنوات الخام سليمة.
7. **تشغيل فحص المجموع (`Falsifier 2`)**: التحقق من أن مكونات المراحل المشتقة تُجمع لتعطي فرق عدّاد المحاولة الخام ضمن كمّ مستشعر واحد (`1 mJ`)؛ فإن لم تفعل، يُverwerfen التقسيم المشتق ولا يُحتفظ إلا بالقناة الخام.

**قاعدة الجمع بدون صلاحيات الجذر (`OQ-5`).** يجب ألا تُشغَّل المعايير المرجعية تنسيق `SUT` أبدًا بصلاحيات `root`، ولا تُحمَّل مشغّلات (drivers) مخصصة تعمل في الحلقة 0 (ring-0). على `macOS`، يستخدم `satb-meter` الأداة `macmon` دون صلاحيات جذر (عبر اشتراك `IOReport`) والدالة `proc_pid_rusage(RUSAGE_INFO_V6)` من `libSystem`، ولا يستخدم أبدًا `sudo` أو `powermetrics`. على `Linux` (حيث أصبح المسار `/sys/class/powercap/intel-rapl` مقتصرًا على الجذر في النواة `5.10` بعد هجوم `PLATYPUS`)، تمنح قاعدة `udev` إدارية تُطبَّق مرة واحدة صلاحية القراءة لمجموعة مخصصة باسم `satb-meter` تضم **فقط `UID` الخاص بـ `satb-supervisor`**، بما يضمن أن عمليات صندوق الحماية `/work` لا تستطيع التنصت الجانبي على `RAPL` ولا قراءة عداد الطاقة الخاص بها. على `Windows 11` (`NT 10.0.26300`)، تقرأ الرموز غير المميزة لمستخدم أساسي (Basic User tokens) (`0x20000`) الطاقة التراكمية لوحدة معالجة الرسوميات المنفصلة (`mJ`) مباشرةً عبر `nvml.dll` (`nvmlDeviceGetTotalEnergyConsumption`)، وتقرأ دورات المعالجة `L3` للعمليات عبر `QueryProcessCycleTime` من Win32، في حين أن سجل `MSR` `0x611` في Intel `RAPL` يتطلب مشغّل نواة يعمل في الحلقة 0 تحظره `OQ-5` و`HVCI`، فتُضبط طاقة حزمة `CPU` على Windows حصرًا على `"not_available"` بالتسمية `N`:

| المنصة المستهدفة | قنوات النظام الكلي `L0` / `L1` | قنوات الحزمة / `SoC` `L2` | قنوات العملية والمنطقية `L3` و `L4` | حالة التحقق الرئيسية |
| :--- | :--- | :--- | :--- | :--- |
| **Apple Silicon Mac** (`M5 Max` verified) | `L0`: `Shelly` `PDU` (`not_available` if unplugged); `L1`: `macmon sys_power` (`reported_j`) | `macmon IOReport`: `chip_power`, `cpu_power`, `gpu_power`, `ane_power`, `ram_power` (`reported_j`) | `L3`: `proc_pid_rusage` `ri_energy_nj` (`D`), `ri_instructions`, `ri_diskio_*`; `L4`: `satb-proxy` | تم التحقق من `L1`-`L4` بدون صلاحيات جذرية مباشرة على `Apple M5 Max`; `L0` مفتوح عند التوصيل. |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`, `Linux x86-64` verified) | `L0`: `Shelly` `PDU` (`not_available` if unplugged); `L1`: `cros_ec` (`0` power attrs) | `RAPL package-0` & `core` (`0440 root:energy` `udev`) `reported_j` + `amdgpu` `PPT` `power1_input` (`0444`; `energy1_input` absent) | `L3`: `cgroup v2` / `getrusage` (`C` activity shares); `L4`: `satb-proxy` | تم التحقق مباشرة (`0440 root:energy` `PLATYPUS` isolation; `amdgpu PPT` `0444`). |
| **Intel Raptor Lake** (`Core i9-13900H`, `Linux x86-64` verified) | `L0`: `not_available`; `L1`: `RAPL psys` (`intel-rapl:1/energy_uj`, `0444` `reported_j`) | `RAPL package-0`, `core`, & `uncore` (`MSR` + `MMIO` `energy_uj`, `0444` `reported_j`) | `L3`: `cgroup v2` / `getrusage` (`C` activity shares); `L4`: `satb-proxy` | تم التحقق مباشرة (`0 µJ` `Step 7` residual across `psys` `L1` and `package-0` `L2`). |
| **NVIDIA Jetson AGX Thor** (`Linux aarch64` Tegra verified) | `L1`: `TI INA238` (`hwmon6` `VIN`, `0444` `measured_j`) + `INA3221 ch3 VIN_SYS_5V0` (`0444` `measured_j`) | `INA3221 ch1 VDD_GPU` (`0444` `measured_j`, `A1` when exclusive); `ch2 VDD_CPU_SOC_MSS` (`0444` `measured_j`); `NVML` (`unverified`) | `L3`: `cgroup v2` / `getrusage` (`C` activity shares); `L4`: `satb-proxy` | تم التحقق مباشرة (`INA238` + `INA3221 ch1-ch3` `0444` بدون صلاحيات جذرية; GPU `NVML` مفتوح تحت قفل المستأجر المشترك). |
| **Windows 11 `x86-64` + Discrete `RTX`** (`i7-1165G7` + `RTX 2060`, `NT 26300` verified) | `L0`: `not_available`; `L1`: `WMI` `EMI` `PowerMeter` (`0` instances -> `not_available`) | `RTX 2060`: rootless `nvml.dll` cumulative `mJ` (`reported_j`); `CPU` `RAPL` `MSR 0x611`: **`N` (`not_available` without ring-0 driver)** | `L3`: Win32 `GetProcessTimes` + `QueryProcessCycleTime` (`C` shares; `SRUM` coarse `OS` background excluded); `L4`: `satb-proxy` | تم التحقق مباشرة تحت رمز مستخدم أساسي `0x20000` (`0 mJ` `Step 7` residual; `2.46 ms` Job Object kill). |
| **Closed Cloud `API`** (`Anthropic`, `xAI`, `Cerebras`, `OpenAI`, `Google`) | Local `L0`-`L1` measure client host only (excluded from server inference) | Remote server `L2`: strictly **`N` (`not_available`)** or per-request **`P`** (`OQ-6`) | Local `/work` `L3` (`D`/`C`) for sandbox tools; `L4`: **exact** `satb-proxy` tokens, calls, `USD` | تم التحقق مباشرة عبر `Anthropic` و `Cerebras` و `xAI` بواسطة `satb-proxy`. |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 ثمانية مخاطر قياس العتاد وسبعة كميات غير قابلة للإسناد

تفشل إجراءات قياس القدرة المعيارية المختصرة بشكل منهجي على المعالجات أحادية الرقاقة (`SoC`) ووحدات معالجة الرسوميات (`GPU`) الحديثة:

| تحذير القياس الفيزيائي للعتاد | تخفيف `SATB` |
| :--- | :--- |
| **يتغير الاستهلاك الساكن للطاقة مع حرارة الشريحة والمراوح و`DVFS` و`turbo`** | انتظر تبرد `GPU` (`<= 1.5 W`)، وأحط كل نافذة قياس بخطي أساس قبل التشغيل وبعده، وسجّل أعلى حرارة لـ`GPU`، وأبطل الجول الصافي المشتق عند انحراف يتجاوز `5.0%` (`Falsifier 6`). |
| **الالتباس بين الخمول على جهاز بارد والخمول مع بقاء الأوزان محمّلة** | قِس كلتا الحالتين وأوضح تسميتهما صراحةً في `Step 6`، ولا تطرح إحداهما بصمت. |
| **طرح `Active - idle` يُحابي التشغيلات البطيئة** | تبقى طاقة النافذة الخام للنظام الكامل `SUT` (`A2`) هي رقم الإسناد الأساسي (`OQ-4`). |
| **النوافذ الأقصر من الدورة الزمنية للحساس تُقرأ صفرًا أو سالبة أو ضوضاء تكميم** | علِّم أي نافذة أقصر من `10` دورات للحساس بالوسم `"below_resolution"` (مثل `< 1.2 s` على `macmon` بتردد `~8 Hz` أو `< 10 s` على مقبس ذكي بتردد `1 Hz`). |
| **أجهزة أخذ العينات عالية التردد تستهلك قدرة `CPU` كبيرة** | اقرأ العدادات التراكمية عند حدود الأحداث (`0.011 mW` عند `0 Hz`) مع نبضة كل `100 ms`، وسجّل خط الأساس `observer_only`. |
| **مقياس القدرة اللحظية في `NVML` على `A100`/`H100` لا يأخذ عينات إلا من `~25%` من زمن التشغيل** | اقرأ العداد التراكمي `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) عبر `FFI` داخل العملية (`1.17 ms` على `RTX 2060` مقابل `43.88 ms` لعملية `nvidia-smi` الفرعية)، ولا تعتمد أبدًا على الاستطلاع اللحظي `nvmlDeviceGetPowerUsage` (Chung et al.; Yang et al.). |
| **مقياس المقبس الخارجي `L0` يعمل على ساعة غير متزامنة** | أصدر حمل معايرة حتميًا بدورة تشغيل `50%` عند `session.open` و`session.close`، ثم قارن أختام الزمن بالارتباط المتقاطع. |
| **خدمات الخلفية المشتركة على المضيف أو المهام المتجاورة** | سجّل قائمة العمليات، وخفّض موثوقية الطرح المشتق على المستوى `L2` عبر `Falsifier 6`، وسجّل طاقة `ri_energy_nj` (`D`) المعزولة عن المهام المتجاورة على المستوى `L3` إلى جانب القيمة الخام `L2`. |

ونتيجةً لذلك، **لا يمكن إسناد سبعة مقادير إسناداً أميناً**، ويُمنع إدراجها في ادعاءات `SATB`:
(1) استهلاك طاقة الخادم لواجهة `API` مغلقة غير موثّق (`N` أو `P` فقط)؛ (2) الجول الفيزيائي الدقيق لكل عملية على `SoC` مشترك أو على سكّة ذاكرة موحّدة (`C` و`D` نموذجان)؛ (3) أوزان النموذج معزولةً عن نوى التقديم والتكميم والتجميع الدفعي والسيليكون؛ (4) ملكية الحمل الخامل لنظام `OS` وطاقة أوزان النموذج المقيمة في `DRAM` (تُعرض كقنوات مستقلة)؛ (5) الأحداث المنفردة الأقصر من دورة أخذ العينات للمستشعر، مثل استدعاء أداة يستغرق `30 ms` تحت مرور مستشعر كل `1 s`؛ (6) آلات `VM` السحابية المشتركة ونطاقات `CPU` في Windows غير المميّزة التي تفتقر إلى عدّادات الأجهزة في وضع المستخدم؛ و(7) عمليات تبديل الأوزان الصامتة من المزوّد أثناء الجلسة (تُكشف بواسطة اختبارات البداية والنهاية المرجعية، ولا تُستبعد مسبقاً).
وعلى وجه الخصوص (`OQ-6`)، فإن **إفصاحات الاستدامة الصادرة عن المزوّدين هي متوسطات أسطول وليست قياسات لكل طلب، ولا تدخل إيصال `SATB` أبداً**، ويشمل ذلك متوسط Google البالغ `0.24 Wh` لموجه `Gemini Apps` الواحد، ورقم OpenAI البالغ `0.34 Wh` المنشور دون منهجية، وقيمة Mistral البالغة `1.14 gCO2e` لكل استجابة من `400` رمز.

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. نتائج التوافق المقاس والحتمية وتأثير المراقب وإسناد متعدد المضيفين

لاستبدال الافتراضات التصميمية غير المقاسة بإيصالات قابلة للتدقيق، نفذنا مجموعة اختبار التوافق الكاملة لـ `SATB` وإطار المزيف (`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`, إجمالي وقت التشغيل `175.69 s`) على محطة عمل `Apple M5 Max` (`arm64`, `128 GB` ذاكرة موحدة، `macOS 27.2.1`, `macmon 0.12.0`)، إلى جانب تدقيق متقاطع لـ `188` نافذة وتشغيلات حية متعددة الرقائق عبر أنظمة التشغيل على `Linux` و`Windows 11`.

<div id="61-c1c12-conformance-c9-deterministic-replay-and-c10-process-tree-cleanup" class="anchor-alias" aria-hidden="true"></div>

### 6.1 توافق `C1-C12`، وإعادة التشغيل الحتمية لـ`C9`، وتنظيف شجرة العمليات لـ`C10`

نجحت **جميع فحوصات توافق الإطار المرجعي للغة Rust البالغ عددها `12 / 12`** (`dnull_cli satb-conformance`) وجميع فحوصات نظام التشغيل الموسعة:

- **فحوصات الحزمة والطرفية والحبس وبصمة الإصبع (`C1`-`C8`، `C11`)**: أعاد `C1` تلخيص بصمة الحزمة القانونية `455e941f51f8ffef`؛ سلّم `C2` حمولات `submit` مطابقة للبايت عبر `satb-proxy` إلى `Verifier`؛ ربط `C3` الرفض الفارغ/الموجه إلى `refuse:other`؛ تجاهل `C4` استدعاءات الأدوات اللاحقة بعد `submit` (`ignored_trailing_calls = 1`)؛ منع `C5` عمليات الهرب `../` و`/etc/passwd` و`verifier_oracle/*`؛ أزال `C6` متغيرات بيئة الوكيل/البيانات الاعتمادية داخل `/work` (`NP=*|HTTP=`) مع إرجاع `HTTP 404` على مسارات الوكيل غير المدرجة؛ أجهض `C7` الاستجابات الناقصة للاستخدام فورًا على شكل `killed(usage_missing)`؛ حافظ `C8` على بصمة الإصبع المكونة من خمس كتل مطابقة للبايت `8b741c27bf364e5d` عبر التشغيلات الجافة مع الإشارة إلى عمليات تبديل `system_fingerprint` المحاكاة بواسطة `session_void = true`؛ وتحقق `C11` من رؤية عداد `RUSAGE_INFO_V6` بدون صلاحيات جذر (`sudo_invoked = false`).
- **إعادة التشغيل الموسعة لـ`C9` متعددة الدورات `ContextRule_v0` + `Truncate_v0`**: عبر سجل تتبع مكون من `14` دورة يولد `24 KiB` من قراءات الملفات الخام لكل دورة (`14` مخرجًا مقصوصًا إلى `8,192 B + 8,192 B` بواسطة `Truncate_v0`) داخل نافذة `48,000` رمز (`80%` عتبة = `38,400` رمز)، قام `ContextRule_v0` بحذف **`5` من أقدم مخرجات الأدوات** بشكل حتمي مع **`0` استدعاءات نموذج إضافية**، مما أنتج نصًا قانونيًا مكونًا من `149,747` بايت (`SHA-256` `d697ed1476129939...`) مع **`0` اختلاف بايت** عبر عمليات إعادة التشغيل المستقلة داخل `/work`. تكرار السجل نفسه تحت نافذة `16,000` رمز ضيقة (حيث تتجاوز `8` مخرجات محتفظ بها بحجم `16 KiB` نسبة `100%`) أدى بشكل حتمي إلى تشغيل `killed(context_ceiling)`.
- **التنظيف الموسع لـ`C10` متعدد العمليات باستخدام `SIGKILL` (سقف المواصفة أقل من `2,000 ms`)**: عبر `5` تجارب أنتجت شجرة عمليات مكونة من `4` عمليات (`sh` أصلية بالإضافة إلى `3` عمليات Python نائمة خلفية منفصلة ضمن مجموعة عمليات معزولة)، اكتمل تسليم `SIGKILL` واسترداد النواة في **`2.073 ms` متوسط** (`1.429 ms` أدنى، `2.571 ms` أعلى، **`778×` أقل** من سقف `2,000 ms`) مع **`0` من معرّفات العمليات `PID` الباقية** ونتيجة `killed(wall_ceiling)`.

<div id="62-live-c12-eight-request-determinism-probes-across-four-model-substrates" class="anchor-alias" aria-hidden="true"></div>

### 6.2 مسابير الحتمية `C12` بثماني طلبات حيّة عبر أربعة أنماط نماذج

أدّى توجيه `8` طلبات جبرية متطابقة لكل نموذج (أي `32` استدعاءً سحابياً حياً إضافةً إلى `8` تشغيلات محلية من النوع `Shape D`) عبر `satb-proxy` إلى التحقق من تطابق عدد الرموز `C7` بنسبة `100%` (`32/32` استدعاءً)، وكشف عن ثلاثة أنظمة حتمية متمايزة.

| `SUT` / نقطة النهاية عبر `satb-proxy` | فحص `temperature = 0` المسبق | `sampling.temperature` المسجّل | المخرجات الخام المتمايزة (`/ 8`) | الصيغ الجبرية المتمايزة (`/ 8`) | `system_fingerprint` | متوسط زمن الاستجابة |
| :--- | :---: | :--- | :---: | :---: | :--- | ---: |
| **`Shape D`: `dnull N1`** (محلي بلغة Rust) | `Exact i64` | `0 (exact_i64_q1e6)` | **`1 / 8`** | **`1 / 8`** | `0da4df8d9ccbce1e…` | `1,474.0 ms` |
| **`Anthropic claude-opus-5-5`** | **`HTTP 400`** | `not_available` (مهجور) | **`8 / 8`** | **`4 / 8`** | `not_available` | `3,389.1 ms` |
| **`Anthropic claude-sonnet-5-5`** | **`HTTP 400`** | `not_available` (مهجور) | **`8 / 8`** | **`2 / 8`** | `not_available` | `2,914.3 ms` |
| **`Cerebras gpt-oss-120b`** | `HTTP 200` | `0.0 (seed=42)` | **`2 / 8`** | **`2 / 8`** | `fp_fd4dff7eed92aaf38281` | `484.2 ms` |
| **`xAI grok-4.20-0309-non-reasoning`** | `HTTP 200` | `0.0 (seed=42)` | **`8 / 8`** | **`1 / 8`** | `fp_9974b11849` | `942.7 ms` |

1. **إهمال المزوّد لقيمة `temperature = 0`**: رفض كلٌّ من `claude-opus-5-5` و`claude-sonnet-5-5` القيمة `"temperature": 0.0` بالاستجابة **`HTTP 400` (`"`temperature` is deprecated for this model."`)**، مما يؤكد تجريبياً قاعدة `SATB` القاضية بتطبيع عناصر التحكم في أخذ العينات غير المتاحة إلى `"not_available"` بدلاً من افتراض تساويها تلقائياً مع الصفر. وعبر `8` استدعاءات متطابقة، أصدر `claude-opus-5-5` (بعدد `1,047` رمزاً من رموز التفكير التكيفي) `8` نصوص خام متمايزة، امتدت على `4` هويات بتية جبرية مختلفة جبرياً، وهي `(x | y) - (x & y)` و`(x | y) & ~(x & y)` و`(x & ~y) | (~x & y)` و`(x + y) - ((x & y) + (x & y))`.
2. **بقاء عدم الحتمية تحت `temperature = 0, seed = 42`**: حتى حين قُبلت القيمتان `temperature = 0.0` و`seed = 42` (`HTTP 200`) مع `system_fingerprint` مستقر، أنتج `Cerebras gpt-oss-120b` (بعدد `2,976` رمزاً من رموز الاستدلال) مخرجين متمايزين عبر `8` استدعاءات متطابقة، بينما استقر `xAI grok-4.20-0309-non-reasoning` على صيغة جبرية واحدة (`(x | y) & ~(x & y)`) عبر جميع الاستدعاءات الثمانية، غير أنه تنوّعت جملة البرهان النثرية لديه في `8/8` من الاستجابات. ولذلك فإن الفصل بين **الحتمية الإطارية بالنظر إلى الاستجابات المسجّلة (`C9`)** و**تشتت مخرجات `SUT` المقاسة (`C12`)** أمرٌ جوهري.

<div id="63-falsifier-5-observer-effect-benchmark-across-telemetry-cadences-10-s-windows" class="anchor-alias" aria-hidden="true"></div>

### ٦.٣ المخالف ٥: معيار تأثير المراقب عبر إيقاعات القياسات (`10 s` نافذة)

قياس الوقت `CPU` لعينة المجمّع (`Python` + child `macmon` `IOReport` pipe)، `ri_energy_nj` للـ `L3` (`observer_only` `reported_j`)، و`reported_j` للـ `L2` على مستوى الـ `SoC` الكامل عبر نوافذ `10.0 s` متداخلة على `Apple M5 Max`، حُدّد بدقة عبء المراقب:

| إيقاع العينة | المعدل المحقق | وقت `CPU` للعينة / `10 s` | المراقب `L3` `reported_j` | طاقة المراقب (`mW`) | نسبة نافذة `L2` | الـ `SoC` الكامل نافذة `L2` (`reported_j`) |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| **`0 Hz` حدّي فقط** (`2` `rusage` استدعاءات النظام) | `0.20 Hz` | **`0.004 ms`** | **`0.000108 J`** | **`0.011 mW`** | **`0.0000%`** | `-` (صفر `IOReport` daemon) |
| **`1 Hz` (`1,000 ms` إشارة)** | `0.90 Hz` | `9.323 ms` | `0.194237 J` | `19.371 mW` | `0.0521%` | `372.769 J` (`37.17 W`) |
| **`10 Hz` (`100 ms` `SATB` إشارة مرجعية)** | `8.12 Hz` | `36.434 ms` | `0.666596 J` | **`66.439 mW`** | **`0.1770%`** | `376.603 J` (`37.53 W`) |
| **`100 Hz` (`10 ms` مخالف الضغط)** | `7.44 Hz` | `35.636 ms` | `0.598721 J` | `58.971 mW` | `0.1618%` | `369.926 J` (`36.44 W`) |

1. **اضطراب ضئيل (`< 0.18%`)**: قراءات `proc_pid_rusage` الحدّي فقط تستهلك `108 µJ` (`0.011 mW`), **`6,040×` أقل طاقة** من استقطاب `IOReport` بـ `10 Hz` (`66.44 mW`), وحتى إشارة المرجع `100 ms` تمثّل فقط **`0.177%`** من طاقة نافذة الـ `SoC` الكاملة (`0.76%` فرق إجمالي نافذة `L2` بين `-i 10` و `-i 1000`، مما يمسح `Falsifier 5`).

2. **حد إيقاع اشتراك `IOReport` (`~8 Hz`)**: طلب `-i 10` (`100 Hz`) من `macmon 0.12.0` حقق **`7.44 Hz`** (`75.5` عينة في `10.15 s`) لأن كل دورة اشتراك `IOReport` غير جذرية تحجب لمدة `~120 ms` في مساحة المستخدم في macOS. ولذلك، الأرضية `below_resolution` ذات الـ `10` فترات في `Step 2` تعادل فعليًا **`~1.2 s`** على نوافذ `macmon` `L2`, بينما يجب على العمليات تحت الثانية الاعتماد على `0 Hz` حدّ `L3` `ri_energy_nj` أو النوافذ المجمعة.

<div id="64-falsifier-3--step-7-b-temporal-boundary-vs-c-proportional-kepler-attribution" class="anchor-alias" aria-hidden="true"></div>

### 6.4 المزيف 3 والخطوة 7: الحد الزمني `B` مقابل الإسناد النسبي (`Kepler`) لـ `C`

عبر `3` تكرارات على `Apple M5 Max`، نفذ `SUT` واحد **المرحلة 1** (`2.50 s` اندفاع هضم `SHA-256` كثيف `ALU`: `29.27 ms` متوسط زمن `CPU`، `38.63 mJ` لكل `CPU`-ms) متبوعًا تسلسليًا بـ **المرحلة 2** (`2.51 s` مسح `192 MiB` `DRAM` يفوت الذاكرة المخبأة + عمليات `fsync` متزامنة لمسح القرص و`8 ms` انتظار `I/O`: `15.94 ms` متوسط زمن `CPU`، `27.73 mJ` لكل `CPU`-ms) إلى جانب عامل خلفي دوري ثابت:

| فحص الإسناد (`n = 3` تكرارات تسلسلية ثنائية المرحلة + مشاركة المستأجر) | المرحلة 1 (`Compute` `2.50 s`) | المرحلة 2 (`DRAM + fsync I/O` `2.51 s`) | حكم المزيف / الخطوة-7 |
| :--- | ---: | ---: | :--- |
| **الحد الزمني الدقيق `B` لـ `L3` delta (`reported_j`)** | `1.1272 J` (`1,127,172 µJ`) | `0.4433 J` (`443,317 µJ`) | **`الخطوة 7` الباقي `<= 1 µJ` (`3/3` نجح)** |
| **`C` (حصة `Kepler` $\Delta\text{CPU}$: `64.58%` مقابل `35.42%`) على `L3`** | `1.0145 J` (`-10.00%`) | `0.5560 J` (**`+25.21%` متوسط الخطأ**) | طاقة `DRAM`/التباطؤ لكل ms $\ne$ طاقة `ALU` لكل ms |
| **النافذة الزمنية الدقيقة `B` لـ `L2` لكامل `SoC` (`reported_j`)** | `82.246 J` | `90.975 J` | تستمر استهلاكات `DRAM` و`NVMe` والمضيف أثناء انتظار `I/O` |
| **تطبيق `C` (حصة `Kepler` $\Delta\text{CPU}$) على نافذة `L2`** | `111.758 J` (**`+35.86%` خطأ**) | `61.464 J` (**`-32.59%` خطأ**) | **`المزيف 3` مفعّل (`> 20%` خطأ)** |

بينما نجح فحص المجموع في **الخطوة 7** حتى `0-1 µJ` (`100.0%` من التجارب) تحت فروق عدادات الحدود (`B`)، أفرط الإسناد النسبي لزمن `CPU` (`C`) في إسناد اندفاع الحوسبة بنسبة **`+35.86%`** وقلل من إسناد مرحلة الذاكرة و`fsync` بنسبة **`-32.59%`** على `L2` المشترك (وأخطأ بنسبة **`25.21%`** حتى على `L3` لكل عملية)، مما يؤكد تجريبيًا سبب تقييد `SATB` لـ `C` على أدوات الاختبار المتداخلة المتوازية (`Shape H`) ورفع علم `> 20%` انحراف تسلسلي عبر `المزيف 3`.

<div id="65-multi-session-falsifier-6-audit-188-windows-and-falsifier-8-harness-floor-check" class="anchor-alias" aria-hidden="true"></div>

### 6.5 تدقيق `Falsifier 6` متعدد الجلسات (`188` نافذة) وفحص أرضية الإطار `Falsifier 8`

يؤكد تدقيق **`188` نافذة `L2` حقيقية من `IOReport`** جُمعت عبر ثلاث حملات تجريبية على المضيف المشترك `Apple M5 Max`، إلى جانب تقييمين مزدوجين لـ `Lane B` مقابل `Shape H` (`Claude Code 2.1.330`)، كلا الضمانتين على مستوى الجلسات:

1. **تدقيق انجراف خط الأساس في `Falsifier 6` (`188` نافذة)**: عبر `exp-001` (`11` نافذة: نافذة واحدة ضمن `5.0%`، و`10` نوافذ انجرفت صعودًا بنسبة تصل إلى `44.5%`)، و`exp-002` مع الحوار متعدد الأدوار (`7` نوافذ: نافذتان ضمن `5.0%`، ودفعة `dnull` البالغة `1,190` مثيلًا بانجراف `3.09%`، واختبار `BigCodeBench` على `Qwen 3.6` بانجراف `1.02%`، و`5` نوافذ انجرفت بنسبة تتراوح بين `12.16%` و`65.11%` تحت تركيب `yosys-abc` متزامن)، و`ai-reads-human` (`170` نافذة عند `loadavg_1m = 12.92`: `61` ضمن `5.0%`، و`109` منجرفة)، احتفظت **`64 / 188` نافذة (`34.04%`)** بقيمة `derived_marginal_j` صالحة، بينما أُبطل تلقائيًا طرح الاستهلاك الصافي فوق الخمول في **`124 / 188` نافذة (`65.96%`)** دون فقدان أي قراءة خام واحدة من `L2` أو قراءة `reported_j` لكل `PID` من `L3` (بنسبة بقاء خام `188 / 188 = 100.0%`).
2. **`Falsifier 8` (`Lane B` مقابل `Shape H` لـ `Claude Code 2.1.330`)**: عبر `24` حزمة سياسات مزدوجة لـ `/work` الرسمية و`SQLite`، حقق `Lane B` نسبة **`24 / 24` (`100.0%`)** على كل من `Claude Opus 5.5` (`44` استدعاءً للنموذج، و`63,568` رمزًا للمطالبة مع الذاكرة المؤقتة، و`\$0.5477`) و`Claude Sonnet 5.5` (`43` استدعاءً، و`60,284` رمزًا، و`\$0.3413`)، مطابقًا لـ `Shape H` (`Claude Code 2.1.330`: **`24 / 24`**، و`89` استدعاءً / `218,449` رمزًا على `Opus 5.5`؛ و`83` استدعاءً / `196,128` رمزًا على `Sonnet 5.5`)، مع خفض حركة الرموز للمطالبة مع الذاكرة المؤقتة بمقدار **`3.44×` و`3.25×`** على التوالي. وفي `6` مستودعات إصلاح أخطاء بايثون متعددة الملفات لم تُستخدم من قبل (`config-defaults`، و`interval-merge`، و`pagination`، و`precedence`، و`rate-window`، و`retry-backoff`)، طابق `Lane B` (`Opus 5.5`: `28` استدعاءً / `52,045` رمزًا؛ و`Sonnet 5.5`: `31` استدعاءً؛ والنموذج المحلي `Qwen 3.6 35B-A3B`: `42` استدعاءً / `2,342.05 J` من `L2`) نتيجة `Shape H` مرة أخرى (`Claude Code 2.1.330` مع `Opus 5.5`: **`6 / 6`**، و`30` استدعاءً / `86,744` رمزًا، أي `1.67×` رموز أكثر)، مؤكدًا أن `Lane B` **ليس** أرضية إطار مقيّدة.

<div id="66-multi-platform-hardware-attribution-across-five-silicon-and-os-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 الإسناد الهاردوير متعدد المنصات عبر خمسة نماذج من السيليكون وأنظمة التشغيل

للتحقق من أن الامتثال لـ `SATB`، والحتمية ذات النقطة الثابتة لـ `Shape D`، وحدود الأذونات دون صلاحيات الجذر في `PLATYPUS` / `HVCI`، وإسناد القياس المادي عبر المقاومة الشنتية أو التراكمي في `NVML`، تتحقق عبر `macOS` و`Linux` و`Windows 11`، نفّذنا `run_multi_host_satb.py` (`multi_host_satb_receipts.json`) و`run_windows_suite.py` (`windows_satb_receipts.json`) على أربعة نماذج إضافية من عتاد `Linux` و`Windows 11`، إلى جانب `Apple M5 Max`.

| النمط المرجعي للعتاد و نواة `OS` | حدود المستشعرات دون صلاحيات الجذر وفئة الأدلة | `Shape D` `1M` `DNULLMM1` (`10k` مسبارًا) | متوسط إعادة التشغيل `C9` وإنهاء الشجرة `C10` | زمن القراءة الواحدة و`100 Hz` المحقق | البقايا في `Step 7` و`Falsifier 3` (`C` مقابل `B`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`** (`arm64`، `128 GB`، `macOS 27.2.1`) | `IOReport` `L1`/`L2` + `rusage` `L3` (`reported_j`؛ `measured_j = None`) | `15027705736` (`388.43 ns` `C++`، `582.57 ns` Rust) | `149,747 B` (`0` فروقات) · `2.073 ms` (`0` من `PID`s) | `~120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`** المرحلة 2 (`+35.86%` المرحلة 1) |
| **`NVIDIA Jetson AGX Thor`** (`aarch64`، `122.9 GiB`، `Linux 6.8.12-1021-tegra`) | `TI INA238` (`hwmon6` `VIN` `L1`) + `INA3221` (`hwmon5` `ch1-ch3` `L2`/`L1`، `0444` **`measured_j`**) | `15027705736` (`984.86 ns` `C -O3`، `2,489.4 ns` Py) | `149,747 B` (`0` فروقات) · `9.544 ms` (`0` من `PID`s) | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2` (`-67.02%` `VIN`) |
| **`Framework AMD Ryzen AI Max+ 395`** (`x86-64`، `122.8 GiB`، `Linux 7.0.0-43`) | `RAPL package-0` و`core` (`0440 root:energy` **`reported_j`**) + `amdgpu PPT` (`0444`؛ `measured_j = None`) | `15027705736` (`376.61 ns` `C -O3`، `1,341.7 ns` Py) | `149,747 B` (`0` فروقات) · `0.868 ms` (`0` من `PID`s) | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0` (`-63.34%` `core`) |
| **`Intel Core i9-13900H`** (`x86-64`، `14.7 GiB`، `Linux 7.0.0-43`) | `RAPL psys` (`L1`) + `package-0` و`core` و`uncore` (`L2`، `0444` **`reported_j`**؛ `measured_j = None`) | `15027705736` (`420.93 ns` `C -O3`، `863.6 ns` Py) | `149,747 B` (`0` فروقات) · `1.120 ms` (`0` من `PID`s) | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0` (`-73.62%` `psys`) |
| **`Intel Core i7-1165G7 + RTX 2060`** (`x86-64`، `63.7 GiB`، `Windows 11 26300`) | `nvml.dll` `RTX 2060` التراكمي بوحدة `mJ` (`L2` **`reported_j`**) + Win32 `L3`؛ `CPU RAPL` = `N` (`measured_j = None`) | `15027705736` (`1,474.22 ns` `MSVC /O2`، `2,885.6 ns` Py) | `149,747 B` (`0` `CRLF`) · `2.458 ms` JobObj (`0` من `PID`s) | `1,174.2 µs` `NVML` · **`64.64 Hz`** (تكّة `NT`) | `0 mJ` · **`-89.88%`** زمن (`-77.05%` `RDTSC`) |

تبرز من هذه الإيصالات الحية خمسة نتائج عابرة للمنصات وأنظمة التشغيل المتعلقة بالعتاد:

1. **تطابق بت-بت لإعادة تشغيل `Shape D` و `Lane B` عبر `macOS` و `Linux` و `Windows 11` (`arm64`/`aarch64` و `x86-64`)**: أنتجت المضيفات الخمسة، بما فيها `CreateFileMappingA` + `MapViewOfFile` من Win32 المُترجَم بـ `MSVC 19.44 /O2` وعمليات إدخال/إخراج الملفات على `NTFS` في `Windows 11` (`NT 10.0.26300`)، المجموع الاختباري `DNULLMM1` الدقيق لـ `10,000` مسبار وهو **`15027705736`**، والبصمة المجمدة الدقيقة لـ `test.setpoint` وهي `0da4df8d9ccbce1e...4485781`، وسجل `C9` الدقيق بحجم `149,747` بايت (`SHA-256` هو `d697ed1476129939...`) مع **`0` بايت انحراف `CRLF` على `NTFS`**. وفي الوقت نفسه، أُنهيت شجرات العمليات الهاربة المكوّنة من `4` معرّفات `PID` خلال `0.868 ms` إلى `9.544 ms` عبر البدائيات النواتية (`SIGKILL` على `macOS`/`Linux` و `TerminateJobObject` من Win32 على `Windows 11` بمتوسط **`2.458 ms`**)، وهو أسرع بمقدار **`50.0×`** من تشغيل `taskkill.exe /F /T /PID` الذي بلغ متوسطه `122.817 ms`، ويتجاوز سقف المواصفة البالغ `2,000 ms` بأكثر من `200×`.
2. **فصل المقاومات الشنتية الفيزيائية `INA238` / `INA3221` وتحقق `Falsifier 6` تحت التشارك الحي لوحدة `GPU` على `NVIDIA Jetson AGX Thor`**: على `Linux 6.8.12-1021-tegra`، تكون كل من `hwmon6` (`ti,ina238` عند `i2c@c600000/ina238@44`، مع مدخل التيار المستمر `DC` لكامل اللوحة `VIN` عند `~27.97 V`) والقنوات الثلاث كاملة في `hwmon5` (`ina3221@40`: `ch1 VDD_GPU` و `ch2 VDD_CPU_SOC_MSS` و `ch3 VIN_SYS_5V0`) قابلة للقراءة من جميع المستخدمين (`0444`) دون الحاجة إلى `sudo`. وخلال مسبار `CPU` فقط الصارم لدينا (`dedicated_host = false`)، احتفظ `llama-server` مستقل ومشارك بقفل `GPU` للمضيف:

| قناة المقاومة الشنتية الفيزيائية على `Jetson AGX Thor` (`sysfs` بدون صلاحيات جذر `0444`) | الحد | القدرة قبل الخط الأساسي (`W`) | حوسبة المرحلة 1 (`measured_j` / `W`) | المرحلة 2 `DRAM+fsync` (`measured_j` / `W`) | القدرة بعد الخط الأساسي (`W`) | الانحراف (`F6`) وخطأ المرحلة 2 لـ `Kepler` و `C` |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`** (الوحدة + مدخل الحامل) | **`L1`** | `100.70 W` | `122.12 J` (`101.66 W`) | `99.02 J` (`81.94 W`) | `97.21 W` | `3.47%` (`A2` مستبعد: مشارك) · **`-67.02%`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`** (`LLM` مشارك) | **`L2`** | `29.26 W` | `40.29 J` (`33.54 W`) | `26.00 J` (`21.52 W`) | `28.13 W` | معالج رسومات خارجي مشارك (تذبذب `-36.1%` في `F5`) |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36.68 W` | `45.73 J` (`38.07 W`) | `44.37 J` (`36.71 W`) | `36.08 W` | `1.64%` (نطاق `CPU`/`SoC`/`MSS`) · **`-70.01%`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`** (خط `5.08 V`) | **`L1`** | `14.89 W` | `18.66 J` (`15.53 W`) | `16.82 J` (`13.92 W`) | `13.98 W` | **`6.13% > 5.0%` (تم تفعيل `F6`)** · **`-68.85%`** |

1. **حدود الصلاحيات المنخفضة (`Windows 11` على العتاد المباشر) وعدّ `Falsifier 5` الذي تتحكم فيه الطلبات المتزامنة**: عبر نوافذ الإيقاع الأربع لـ `Falsifier 5`، خفّضت طلبات `LLM` المتذبذبة الصادرة من المستأجرين المشتركين القناة `ch1 VDD_GPU` من `35.36 J` إلى `22.60 J` (`-36.1%`)، وخفّضت `INA238 VIN` (`L1`) على مستوى اللوحة الكاملة من `107.48 J` إلى `81.73 J` (`-24.0%`)، في حين بقيت `ch2 VDD_CPU_SOC_MSS` ضمن النطاق `35.76-39.31 J`. ولأن `dedicated_host = false` (وتجاوز انحراف `ch3 VIN_SYS_5V0` نسبة `5.0%` عند `6.13%`)، يمتنع `SATB` عن إصدار ادعاءات الصافي على مستوى النظام الكامل `A2`، مع الحفاظ على قيم `measured_j` الدقيقة مفصولةً حسب القناة (لا تُجمع القناتان `L1` و`L2` معاً أبداً).

3. **عزل `PLATYPUS` عبر `0440 root:energy` والتحقق من نطاق `APU` في `Strix Halo` على منصة `Framework` `AMD`**: على جهاز `Framework` Desktop (`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`، `Linux 7.0.0-43-generic`)، تضبط قاعدة `udev` المسماة `90-energy-read.rules` الملفين `/sys/class/powercap/intel-rapl:0/energy_uj` (`package-0`) و`intel-rapl:0:0/energy_uj` (`core`) على الوضع **`0440` (`root:energy`، `world_readable = false`)**. فتتلقى معرّفات `UID` غير المنتمية إلى المجموعة في بيئة `/work` المعزولة الخطأ `EACCES`، فتُحجب بذلك قنوات `PLATYPUS` الجانبية، بينما يقرأ معرّف المجموعة المشرف (`energy`) العدّاد التراكمي بالميكروجول دون صلاحيات جذر، بزمن كمون وسيط قدره `24.34 µs` (وبقيمة متبقية `0 µJ` في `Step 7`). وبفحص `hwmon9` (`amdgpu`) تبيّن حلّ تفصيلة مواصفات كانت مفتوحة: تعرض وحدة `Radeon 8060S` المدمجة في `Strix Halo` قدرة `PPT` القابلة للقراءة للجميع (`0444`) عبر الملفين `power1_input` و`power1_average` بوحدة `µW`، بقيمة `75.38 W` في المرحلة 1 و`69.72 W` في المرحلة 2، دون وجود عدّاد منفصل باسم `energy1_input`. أما `cros_ec` (`hwmon8`) فيعرض المراوح ودرجات حرارة اللوحة فقط.

4. **حدود الصلاحيات المنخفضة على `Windows 11` في العتاد المباشر (`0x20000` Basic User `NVML` مقابل كتلة `RAPL` في حلقة الصلاحية 0) وتداخل تردد ساعة `NT` البالغ `15.625 ms`**: ضمن رمز وصول `Basic User` مخفَّض الصلاحيات صراحةً (`runas.exe /trustlevel:0x20000`، و`IsUserAnAdmin() == false`) على `Windows 11 Pro` (`NT 10.0.26300`، `Intel Core i7-1165G7` + `NVIDIA GeForce RTX 2060`)، تنجح استدعاءات `FFI` داخل العملية إلى `nvml.dll`، أي `nvmlDeviceGetTotalEnergyConsumption` (بوحدة `mJ`) و`nvmlDeviceGetPowerUsage` (بوحدة `mW`)، دون صلاحيات جذر، بزمن كمون وسيط قدره **`1,174.15 µs`** (أسرع بمقدار **`37.4×`** من تشغيل `nvidia-smi.exe` الذي يستغرق `43.88 ms` لكل استدعاء)، فتجتاز `Step 7` بقيمة متبقية **`0 mJ`** (`8.769 J + 8.816 J = 17.585 J`، وانحراف قبل القياس وبعده `3.0%`). في المقابل، تحجب نواة `Windows NT` القراءات المباشرة من وضع المستخدم لسجل `MSR 0x611` الخاص بـ `RAPL` في `Intel` ما لم يوجد برنامج تعريف موقّع يعمل في حلقة الصلاحية 0 (وهو ما يحظره `OQ-5` و`HVCI`). كما أن واجهة `WMI` للعدّادات الكهربائية `EMI` (`\\.\EnergyMeter` / `Win32_PerfRawData_Counters_PowerMeter`) لا تعرض أي نسخة (`0` instances)، ومن ثم تُصنَّف الحزمة المعالجة `CPU` على `Windows` في القناة `L2` ضمن التسمية `Label N` (`"not_available"`) حصراً. وعلاوةً على ذلك، فلأن `Windows NT` غير المعدَّل يحدّث `GetProcessTimes` عبر مقاطعات الساعة البالغة `~15.625 ms`، فقد تم تداخل دفعات النوم `8 ms` مع `FlushFileBuffers` في المرحلة 2 حتى تقلصت إلى `62.5 ms` (بحصة `CPU` قدرها `5.06%` مقابل `1,171.9 ms` في المرحلة 1)، مما تسبب في خطأ إسناد `Kepler` للقناة `C` بمقدار **`-89.88%`** (و`-77.05%` حتى عند استخدام دورات `RDTSC` عبر `QueryProcessCycleTime` دون دقة الساعة، بحصة `11.48%`).

5. **فيزياء ناقل المستشعر وإيقاع مؤقت `OS` عبر جميع المنصات الخمس**: بينما تكتمل قراءات `powercap` `sysfs` في Linux `x86-64` في `24.34-45.37 µs` (يتم تحقيق `94.28-97.12 Hz` عند `100 Hz`)، فإن كمية النوم الافتراضية `15.625 ms` في `Windows NT` تحد من حلقات `NVML` غير المعدلة عند `10 ms` عند **`64.64 Hz`** بينما توفر **`9.45 Hz`** بشكل نظيف عند نبضة المرجع `100 ms` (`10 Hz`) الخاصة بـ`SATB`، مطابقة لسقف `I2C` shunt الخاص بـ`Jetson AGX Thor` عند `66.55 Hz` (`9.49 Hz` عند مرجع `100 ms`) ومتناقضة مع سقف `IOReport` الخاص بـ`macmon` عند `7.44 Hz`. عبر **`5 / 5`** من معماريات السيليكون و`OS`، أدى التقسيم التناسبي مع `CPU` (`C`) إلى نقص في الإسناد لمرحلة `192 MiB` `DRAM` + مزامنة القرص بنسبة **`32.59%` إلى `89.88%`**، مما يؤكد عالميًا سبب تقييد `SATB` لـ`C` على عمليات التشغيل المتداخلة المتوازية.

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. التحقق من العتاد المفتوح والقيود

| مُزيف الجلسة | العاقبة عند التفعيل | الحالة التجريبية في هذه الدراسة |
| :--- | :--- | :--- |
| **`F1` عدم تطابق الإعادة (`C9`)** | إطار الاختبار المرجعي غير حتمي | **تمت المطابقة على `5/5` مضيفات (`0` بايت/`CRLF` اختلاف عبر `149,747 B`, `14` جولات)** |
| **`F2` فشل فحص المجموع عند `> 5%` من المحاولات** | انقسام الإسناد مكسور على المضيف | **تمت المطابقة على `5/5` مضيفات (`0 µJ` لينكس; `0 mJ` ويندوز 11 `NVML`; `<= 1 µJ` `M5 Max`)** |
| **`F3` `B` و `C` لا يتطابقان بأكثر من `> 20%` تسلسليًا** | `C` (`Kepler`) علامته غير موثوقة على المضيف | **تم التفعيل على `5/5` مضيفات (`32.59%-89.88%` خطأ); تم تقييد `C`** |
| **`F4` حمل نبضي معروف خارج دقة المستشعر** | تم تخفيض درجة المستشعر للجلسة | **مفتوح (`L0` جهاز توصيل ذكي بنظام نبضات المزامنة غير موصول بعد)** |
| **`F5` `10 ms` مقابل `1 s` يغير طاقة النافذة** | تأثير مراقب القياسات | **تمت المطابقة (`0.76%` فرق `M5 Max` `L2`; تم تحقيق `9.45-10.48 Hz` عند مرجع `100 ms`)** |
| **`F6` انحراف أسس المقيم قبل/بعد `> 5.0%`** | قنوات الصافي المستخرجة غير صالحة | **نشط (`124/188` نوافذ `M5 Max` + انحرافات المستضيف المشترك لينكس مُقيدة نظيفًا)** |
| **`F7` المحول ينجح `C1`-`C12`، يفشل الاختبار الأولي** | الامتثال غير كاف؛ الجلسة `void` | **تم التحقق في المحاكاة (`session_void = true` عند التبديل)** |
| **`F8` `Lane B` يُوضع أدنى من أطر `Lane O` القوية** | `Lane B` مُبلّغ عنه كحد أدنى فقط | **تمت المطابقة (`24/24` و `6/6` تماثل مقابل `Claude Code 2.1.330`)** |

1. **جلسات `A2` مُهدَّأة مخصّصة ومعايرة `L0` لمقياس `AC` عند مأخذ الحائط**: على الرغم من أن قنوات الشنت المادية `TI INA238` (`L1`) و`INA3221` (`L2`/`L1`) لمقاييس `measured_j` أصبحت مُتحقَّقاً منها بشكل حي على `NVIDIA Jetson AGX Thor`، جنباً إلى جنب مع عدادات `reported_j` التي تعمل بدون صلاحيات الجذر على `Apple M5 Max` و`Framework AMD Strix Halo` و`Intel Raptor Lake` و`Windows 11` (`RTX 2060` `NVML`)، فإن الأجهزة الخمسة كلها شغّلت خدمات مشتركة أو أحمال عمل لمستأجرين مشاركين (`dedicated_host = false`)، وهو ما يحجب ادعاءات وضع `A2` على مستوى `SUT` بالكامل. والخطوة التالية هي توصيل مقياس `L0` لـ`AC` (`Shelly` / `Yokogawa`) مع نبضات مزامنة على مضيف مخصّص ومُهدَّأ.

2. **فحص عدّاد `NVML` للمعالج الرسومي المدمج على `Jetson AGX Thor`**: بينما تم الآن التحقق بدون صلاحيات جذر من `nvmlDeviceGetTotalEnergyConsumption` (`mJ`) للمعالج الرسومي المنفصل على `NVIDIA GeForce RTX 2060` (`Windows 11`) عبر `nvml.dll`، فإن فحص عدّاد الطاقة التراكمي لـ`NVML` على معالج Tegra الرسومي الموحّد في `Jetson AGX Thor`، جنباً إلى جنب مع قناة الشنت `0444` `INA3221 ch1 VDD_GPU` المُتحقَّق منها، ينتظر نافذة خمول عندما يكون قفل `GPU` المشترك متاحاً.

3. **القائمة الحية الأوسع لـ`Shape H` و`Shape I`**: شملت التشغيلات الحية للأدوات الخارجية في هذه الدراسة `Shape H` على `Claude Code 2.1.330` إلى جانب `Lane B` و`Shape D`، والخطوة التالية هي تنفيذ شهادة `C1-C12` الحية على `Codex CLI` و`OpenHands` و`Terminus-2` ومحلّلات `Inspect` في `Shape I`.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## المراجع

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
