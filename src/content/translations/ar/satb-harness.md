---
title: "معيار الإشباع (Satiation Benchmark): إطار الاختبار المرجعي والمحوّلات وإسناد القياسات"
deck: "معيار الإشباع (Satiation Benchmark): إطار الاختبار المرجعي والمحوّلات وإسناد القياسات  إطار اختبار مرجعي تسلسلي ثابت بلغة Rust (Lane B)، وجسر محوّل واحد مفروض بالوكيل (Shapes D, M, H, and I)، ومجموعة مطابقة مكونة من اثني عشر اختبارًا (C1 to C12)، ومحرك إسناد قياسات جذري من خمسة مستويات (L0 to L4 crossed with labels A1 to N). تم التحقق منه تجريبيًا عبر أربعة أنماط أجهزة: Apple M5 Max (arm64 macOS IOReport and proc_pid_rusage reported_j)، NVIDIA Jetson AGX Thor (aarch64 Tegra Linux physical INA238 whole-board and INA3221 rail-separated shunt measured_j)، Framework Desktop AMD Ryzen AI Max+ 395 Strix Halo (x86-64 Linux 0440 root:energy PLATYPUS-isolated RAPL reported_j plus amdgpu PPT)، وIntel Core i9-13900H Raptor Lake (x86-64 Linux RAPL psys L1 and package-0 L2 reported_j). تظل القنوات المنطقية `measured_j` و`reported_j` وL4 منفصلة تمامًا ولا يتم جمعها أبدًا؛ وبسبب تشغيل أحمال العمل المشتركة على المضيفات المشتركة (dedicated_host is false)، يتم حجب إسناد الوضع الصافي A2 وفقًا لـ Falsifier 6."
lang: "ar"
source: "satb-harness"
complete: true
---

<div id="satiation-benchmark-reference-harness-adapters-and-telemetry-attribution" class="anchor-alias" aria-hidden="true"></div>

*مراجعة af57f48، 22 نوفمبر 2026. ملخص البيانات والملخص المختصر: [/data/#satb-harness](/data/#satb-harness). الأشكال الحية التفاعلية: [/living/satb-harness/](/living/satb-harness/). النسخة المؤرشفة بلاتكس: [/pdfs/latex/satb-harness.pdf](/pdfs/latex/satb-harness.pdf) ([المصدر](/pdfs/latex/satb-harness.tex)).*

<div id="0-overview" class="anchor-alias" aria-hidden="true"></div>

## 0. نظرة عامة

عندما تُبلغ تقييمات وكلاء مختلفة عن معدلات إنجاز مهام مختلفة أو أرقام طاقة متباينة، فإن الفجوة كثيرًا ما تنشأ من طريقة تغليف النموذج وطريقة إسناد عدّادات المضيف، لا من النموذج نفسه. فقد أدّى تغيير الإطار المحيط وحده إلى تحويل نسبة إنجاز المهام لنموذج `Gemini 2.5 Pro` على `Terminal-Bench 2` بمقدار `17` نقطة مئوية، بينما يمكن لطرح خط أساس خامل منجرف، أو لتقسيم سكة سيليكون مشتركة بحسب زمن المعالج، أن يشوّه إسناد الطاقة بأكثر من `30%`.

تحدد هذه الدراسة عقد التقييم لـ**معيار الإشباع (Satiation Benchmark، ويُرمز له `SATB`)** وتتحقق منه تجريبيًا: إطار اختبار مرجعي متسلسل ثابت مكتوب بلغة Rust (**`Lane B`**)، وجسر محوّلات معزول بالوكيل (**`Shapes D, M, H, and I`**) لضوابط الصفر-نموذج، ولنقاط النهاية النموذجية الخام، ولأطر سطر الأوامر الخارجية، ولحلّالات المعايير العامة، وبصمة تشفيرية لنظام الاختبار (`SUT`) مكوّنة من خمس كتل، و**اثنا عشر** فحصًا إلزاميًا للمطابقة، ومحرك قياس عن بُعد بدون صلاحيات جذر من خمسة مستويات. ولا نترك التصميم دون قياس، بل ننفّذ فحوصات مطابقة حية واختبارات تكذيب عبر **أربع فئات عتادية**: محطة عمل `Apple M5 Max` (بذاكرة موحدة سعتها `128` غيغابايت، ونظام `macOS 27.2.1`، وعدّاد `IOReport` على الشريحة و`proc_pid_rusage` في النواة للقيمة `reported_j`)، وحاسوب تطوير Tegra من نوع `aarch64` (`Jetson Thor`، ونظام `Linux 6.8.12-1021-tegra`، مع قياس `measured_j` فعلي بمجسات تيار بمقاومة تحويل على مستوى اللوحة كاملة وعلى ثلاث قنوات سكك منفصلة من شركة Texas Instruments)، ومحطة عمل `Framework` Desktop من نوع `Strix Halo` (`Ryzen Max+ 395`، ونظام `Linux 7.0.0-43-generic x86-64`، مع طاقة الحزمة `reported_j` المعزولة بمجموعة `0440 root:energy` إضافةً إلى تتبع قدرة حزمة `amdgpu`)، ومحطة عمل `Raptor Lake` (`Intel Core i9-13900H`، ونظام `Linux 7.0.0-43-generic x86-64`، مع طاقة المنصة والحزمة `reported_j`)، مع وضع علامة `not_available` صراحةً على طاقة خوادم السحابة المغلقة.

**بعبارة بسيطة**

1. يمكن لحلقة موجه الوكيل، وقاعدة تقليم السياق، وصندوق أدوات الأدوات أن تغير درجات معيار الاختبار بمقدار تبديل النموذج الأساسي، لذا فإن `Lane B` يحافظ على تثبيت ذلك الغلاف تمامًا بلغة Rust الحتمية، بينما `Lane O` يجبر الأغلفة الخارجية عبر وصلة وسيط واحدة مُراجَعة.  
2. يُسجَّل قنوات الطاقة بصورة خام عند حدودها الفيزيائية الحقيقية، سواء كان ذلك في القابس الكامل للجدار، أو مدخل اللوحة، أو حزمة الشريحة، أو تقدير عملية نظام التشغيل، أو سجل الرموز المنطقي، ولا تُدمَج أبدًا في رقم واحد غير مُسمّى، تُجمَّع عبر فئات الأدلة (`measured_j` مقابل `reported_j` مقابل `est_j`)، أو تُملأ لاحقًا بمتوسطات استدامة الأسطول.  
3. تُثبت الاختبارات الحية عبر أربع منصات سيليكونية دقة `Shape D` للمليون سجل مُخزَّن بالذاكرة (`15027705736`) وإعادة تشغيل `C9` (`149,747 B`، `0` بايت اختلاف) الحتمية، وكذلك تنظيف شجرة العمليات `0.87-9.54 ms`، وعدم الحتمية في سحابة `temperature = 0` عبر ثلاثة موزعين، وسقوف إيقاع مستشعرات الأجهزة (`24.3-45.4 µs` قراءات عدّاد `x86-64` بمعدل `94-97 Hz` مقابل قراءات شنت الحافلة المتسلسلة `2.95 ms` بمعدل `66.6 Hz` على `Jetson Thor` مقابل `~8 Hz` `macmon` `IOReport`)، وخطأ بنسبة `32.59%-72.89%` عند تقسيم مراحل الحوسبة-التخزين المتسلسلة حسب وقت المعالج (`Falsifier 3`)، وكذلك فصل سكة شنت الرسوميات الفعلية عن المعالج إلى جانب تحكُّم انحراف المضيف المشترك `Falsifier 6` (`dedicated_host = false`).

<div id="1-terms-acronyms-and-attribution-labels" class="anchor-alias" aria-hidden="true"></div>

## 1. المصطلحات والاختصارات وتسميات الإسناد

<ul id="terms">
<li>SATB، SUT، PFRK، OQ، SPEC، BUNDLE، SUBMIT، REFUSE، STOP: إطار معيار الإشباع (Satiation Benchmark) ومواصفة الإسناد، والنظام قيد الاختبار، وحالات نتائج المحاولة الأربع (نجاح، فشل، رفض، إنهاء قسري)، وسؤال مفتوح محسوم في المواصفة، ووثيقة المواصفة المعيارية، وملف حزمة المهمة، واستدعاء تسليم الإجابة النهائية، واستدعاء الرفض النهائي، ورمز إيقاف الحلقة المتسلسلة</li>
<li>ACI، SWE، CLI، MCP، SDK، ACP، ARC، AGI، GUI: واجهة الوكيل الحاسوبية (Agent-Computer Interface)، وبادئة معايير هندسة البرمجيات، وواجهة سطر الأوامر، وبروتوكول سياق النموذج (Model Context Protocol)، وحزمة تطوير البرمجيات، وبروتوكول عميل الوكيل (Agent Client Protocol)، ومجموعة التجريد والاستدلال (Abstraction and Reasoning Corpus)، ومجموعة معايير الذكاء الاصطناعي العام، والواجهة الرسومية للمستخدم</li>
<li>IO، JSON، JSONL، RPC، JCS، UTF، HTTP، SSE، URL: بروتوكول الإدخال والإخراج، وصيغة تدوين الكائنات JavaScript (JavaScript Object Notation)، وصيغة JSON المفصولة بالأسطر، والاستدعاء الإجرائي عن بُعد، ومخطط تقنين JSON (JSON Canonicalization Scheme، RFC 8785)، وصيغة التحويل اليونيكودية (Unicode Transformation Format)، وبروتوكول نقل النص التشعبي (Hypertext Transfer Protocol)، وأحداث الخادم المرسلة (Server-Sent Events)، ومحدِّد الموارد الموحد (Uniform Resource Locator)</li>
<li>POSIX، MMAP، DNULLMM1، SHA، SIGKILL، ESRCH، EACCES، EOF: واجهة نظام التشغيل المحمولة (Portable Operating System Interface)، وواجهة الملفات المُسقطة في الذاكرة (memory-mapped file interface)، وصيغة الفهرس الحتمي الصفري الثنائية المُسقطة في الذاكرة (binary memory-mapped Deterministic Null index format)، وخوارزمية التجزئة الآمنة (SHA-256)، وإشارة إنهاء العمليات في POSIX غير القابلة للاعتراض، وحالة الكيان غير الموجود في النواة، وحالة خطأ رفض الإذن في POSIX، ومحدِّد نهاية الملف في وثيقة heredoc (end-of-file heredoc delimiter)</li>
<li>AI، ML، LLM، MLX، GGUF، KV، TP، ENERGY: الذكاء الاصطناعي، والتعلم الآلي، ونموذج اللغة الكبير، وإطار مصفوفات Apple للاستدلال المحلي (MLX)، وأوزان الكمّيّة بصيغة GGUF (GPT-Generated Unified Format)، وذاكرة المفاتيح والقيم المؤقتة (KV cache)، والتوازي على مستوى المصفوفات (tensor parallelism)، وتحالف ML.ENERGY لقياس استهلاك طاقة معالجات الرسوميات</li>
<li>CPU، GPU، APU، ANE، SoC، ALU، ISA، IPC، PID، UID، GID، OS، VM، EC، GB: وحدة المعالجة المركزية، ووحدة معالجة الرسوميات، والمعالج المسرَّع المدمج، ومحرك Apple العصبي (Apple Neural Engine)، ونظام على شريحة (System-on-chip)، ووحدة المنطق الحسابي، ومعمارية مجموعة التعليمات (instruction set architecture)، والتعليمات المنفذة في الدورة الواحدة (instructions per cycle)، ومعرّف العملية (process identifier)، ومعرّف المستخدم (user identifier)، ومعرّف المجموعة (group identifier)، ونظام التشغيل، وآلة افتراضية، ووحدة التحكم المدمجة (embedded controller)، وجيجابايت</li>
<li>RAM، DRAM، SLC، NVMe، PSU، PDU، AC، DC، DVFS، MSR، MMIO: ذاكرة الوصول العشوائي، وذاكرة الوصول العشوائي الديناميكية، وذاكرة التخزين المؤقت على مستوى النظام (system-level cache)، وبروتوكول الذاكرة غير المتطايرة السريعة (Non-Volatile Memory Express)، ووحدة إمداد الطاقة، ووحدة توزيع الطاقة، والتيار المتردد، والتيار المستمر، وتغيير الجهد والتردد ديناميكيًا (dynamic voltage and frequency scaling)، والسجل الخاص بالنموذج (model-specific register)، وإدخال/إخراج مُسقَط في الذاكرة (memory-mapped input/output)</li>
<li>RAPL، NVML، PPT، TI، I2C، ADC، INA، INA238، INA3221، AGX، VDD، SOC، MSS، VIN، SYS، PLATYPUS: حد متوسط الطاقة المتحرك في Intel/AMD (Running Average Power Limit)، ومكتبة إدارة NVIDIA (NVIDIA Management Library)، وتتبّع طاقة الحزمة في AMD (AMD Package Power Tracking)، وشركة Texas Instruments، وناقل الدائرة المتكاملة (Inter-Integrated Circuit bus)، ومحوّل analog-to-digital (ADC)، وعائلة أجهزة قياس التيار والطاقة من Texas Instruments (`INA238`، `INA3221`)، وفئة وحدات NVIDIA Jetson AGX، وخط جهد التغذية للتصريف (drain supply voltage rail)، وخط جهد النظام على الشريحة (system-on-chip rail)، وخط جهد النظام الفرعي للذاكرة (memory subsystem rail)، وخط جهد النظام الداخل (input system voltage rail)، وهجمات تسريب الطاقة: الاستهداف البرمجي لمعالجك (Power Leakage Attacks: Targeting Your Processor Using Software)</li>
<li>API, USD, CNCF, AISI, UK, AMD, NVIDIA: واجهة برمجة التطبيقات، دولار أمريكي، مؤسسة الحوسبة السحابية الأصلية، معهد سلامة الذكاء الاصطناعي، المملكة المتحدة، أدفانسد مايكرو ديفايسز، وشركة إنفيديا</li>
<li>RCE, MoL, WCA, LUT6: محرك كود الواقع [نفس الجهة]، مزيج الحدود [نفس الجهة]، أتمتة الحاسوب الحكيم [نفس الجهة]، وجدول بحث بولياني بست مدخلات</li>
</ul>

عبر مستويات القياس من L0 إلى L4، يحمل كل قناة مسجلة في إيصال `SATB` حدَّها المادي وواحدة من أربع فئات صارمة للأدلة:

| فئة الدليل | النطاق في إيصالات `SATB` والجداول |
| :--- | :--- |
| **`Exact (L4 Logical & Cryptographic)`** | تجزئات `SHA-256` و`JCS` (`RFC 8785`) القانونية لحزم المهام، وبصمات `SUT` ذات الكتل الخمس، ونصوص إعادة التشغيل؛ وعدد رموز الوكيل المسجلة للمطالبة والذاكرة المؤقتة والاستدلال والإكمال؛ ومدد الساعة الجدارية؛ وأسعار القائمة المؤرخة لواجهة `API` بالدولار `USD`. |
| **`Measured Hardware Rail (measured_j: L0, L1, L2)`** | تُملأ فقط من محلل جداري `AC` معاير خارجي (`L0`) أو من مراقب تيار مقاوم على اللوحة الفيزيائية (`L1`/`L2`). جرى التحقق منه مباشرة على `NVIDIA Jetson AGX Thor` عبر `TI` `INA238` (`hwmon6` `VIN`، `L1`) و`INA3221` (`hwmon5` `ch1 VDD_GPU`، `ch2 VDD_CPU_SOC_MSS`، `ch3 VIN_SYS_5V0`، `L2`/`L1`؛ `board_metered = true`). ولأن مستأجرًا مشاركًا نشطًا احتجز `VDD_GPU` أثناء الالتقاط (`dedicated_host = false`)، يُحفظ `measured_j` الخام للسكة بينما تُحجب سمة إسناد صافي التموضع `A2`. ويبقى `measured_j` بقيمة `None` على `Apple M5 Max` و`AMD Strix Halo` و`Intel Raptor Lake`، وتبقى طاقة الجدار `L0` غير مضبوطة في كل الحالات. |
| **`Reported Counter (reported_j: L1, L2 & L3)`** | عدادات الطاقة المدمجة في الشريحة التي لا تتطلب صلاحيات الجذر (`IOReport` على `Apple M5 Max` عبر `sys_power` عند `L1`، و`chip_power`/`cpu_power`/`gpu_power` عند `L2` عبر `macmon`؛ و`RAPL` على `Intel Raptor Lake` عبر `psys` عند `L1` و`package-0`/`core`/`uncore` عند `L2`؛ و`RAPL` على `Framework AMD Strix Halo` عبر `package-0`/`core` عند `L2` إضافة إلى وات `PPT` من `amdgpu`)، والتقديرات لكل عملية المنمذجة من نظام التشغيل (`macOS proc_pid_rusage(RUSAGE_INFO_V6).ri_energy_nj` عند `L3`، بالوسم `D`). لا تُجمع هذه القيم أبدًا مع `measured_j` أو `est_j`. |
| **`Provider-Attested (P) vs. Not Available (N)`** | تُكتب طاقة الخادم البعيد المغلق عبر `API` بالقيمة `P` فقط عندما يُرجع المزوّد رقم طاقة لكل طلب مع منهجية حرفية، وإلا تُكتب حرفيًا بالقيمة `"not_available"` (الوسم `N`). تُسقط تلقائيًا الطروحات المشتقة للخط الأساسي التي تفشل في حد الانحراف `5.0%` (`Falsifier 6`) أو في فحص المجموع `Step 7`، بينما تبقى القنوات الخام سليمة. |

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

## 2. مسح لإطارات الوكلاء وسبب كون سياسة السياق جزءًا من النظام

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

1. **تثبيت الغلاف البرمجي (`Lane B`) مقابل تقييم الأغلفة الخارجية (`Lane O`)**: يثبّت `Lane B` (`satb-agent`) حلقة Rust واحدة قابلة للتدقيق عبر جميع النماذج، في حين يغلّف `Lane O` أطر عمل كاملة من أطراف ثالثة (`Claude Code`، و`Codex CLI`، و`OpenHands`، و`Terminus-2`، و`Inspect`) بوصفها `SUT` صندوقًا أسود، إذ تُجزّأ مطالباتها الداخلية واستدعاءات الضغط الخاصة بها إلى كتلة بصمة `harness`، وتُوجَّه بنسبة 100% عبر `satb-proxy`.
2. **حلّ سياسة السياق (`OQ-1`: `ContextRule_v0`)**: إن إنهاء المحاولة فورًا عند عدم وجود أي حذف يخلط بين الاستدلال متعدد الخطوات ومخرجات الأدوات المطوّلة، في حين أن التلخيص المولَّد بواسطة `LLM` (الضغط التلقائي في `Claude Code`) يُدخل استدعاءات نموذج stochastic خفية تكسر إعادة تشغيل الإطار الحتمية. يعتمد `Lane B` القاعدة **`ContextRule_v0`**: كلما تجاوز حجم المحادثة المتراكم **`80%`** من نافذة السياق المعلنة، يستبدل الإطار حتمياً أقدم مخرجات الأدوات بالنص `"[ELIDED_BY_CONTEXT_RULE_V0]"`، مع الإبقاء على `system(TEMPLATE_v0)` و`user(render(bundle))` الأولية و**آخر `8` مخرجات أدوات** كما هي حرفيًا، دون إجراء **أي استدعاء للنموذج**. ولا يُطلق الإنهاء الصارم `killed(context_ceiling)` إلا إذا تجاوزت الرسائل المحتفظ بها وحدها نسبة `100%` من النافذة.
3. **حلّ سطح الأدوات (`OQ-2`: `TOOLS_v0`)**: إن الاقتصار على `exec` وحده (على نمط `mini`) يُجبر النماذج على الهروب من محارف الصدفة عند كتابة تصحيحات مصدرية متعددة الأسطر وبراهين جبرية (`cat << 'EOF'`)، مما يُدخل أخطاء في تنصيص الصدفة مستقلة عن استدلال المهمة، ويعقّد عزل البيئة (sandboxing) المحمولة وغير المتطلبة لصلاحيات الجذر عبر `macOS` و`Linux`. يثبّت `Lane B` **`TOOLS_v0`**، وهي أربع أدوات لمساحة العمل (`exec`، و`read_file`، و`write_file`، و`list_dir`) وأداتان طرفيتان (`submit`، و`refuse`)، تُقانَن عبر `JCS` لتشكيل `tools_hash` (`d5b102...`).

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

### 4.1 أشكال المحوّلات الأربعة خلف المشرف والوكيل الموحّد

تتصل أي منظومة خارج `Lane B` بـ `satb-supervisor` عبر واحد من أربعة أشكال للمحوّلات:

| شكل المحوّل | الأنظمة المستهدفة | عقد التنفيذ والعزل | المعايير المُعاد استخدامها |
| :--- | :--- | :--- | :--- |
| **`Shape D` (ضابط `dnull`)** | Deterministic Null (`N0` الخالي من النماذج بصرامة و`N1` المتبلور للتطوير) فوق متاجر `mmap` مجمدة من نوع `DNULLMM1` | يُنفَّذ داخل `/work` وفق القواعد نفسها `TOOLS_v0` و`Verifier`، مع **`0` استدعاءات لنموذج الوكيل** وقت اتخاذ القرار. | `POSIX mmap`، وحلقة الأعداد الصحيحة 64-bit في `SPEC v0.4` |
| **`Shape M` (نقطة نهاية النموذج)** | خوادم النماذج المفتوحة الأوزان المحلية و`API`s السحابية المغلقة | يشغّل `satb-agent` من `Lane B` عبر `Chat Completions` أو `Messages` مع استدعاءات الأدوات و`usage` إلزامي، ويُوجَّه بنسبة `100%` عبر `satb-proxy`. | `API` متوافقة مع OpenAI (`llama.cpp` و`mlx_lm` و`vLLM`)؛ ومترجمات `Anthropic` و`Gemini` و`xAI` |
| **`Shape H` (الإطار المغلف في صندوق)** | `Claude Code` و`Codex CLI` و`Gemini CLI` و`OpenHands` و`Terminus-2` | تُكتب المهمة في `/work/task/BUNDLE.md`. يُوجَّه عنوان `URL` الأساسي إلى `satb-proxy` (`127.0.0.1:<port>`)؛ تُحجب مفاتيح `API` الحقيقية عن `/work`؛ وينتهي التنفيذ عبر `submit` أو `refuse` في `MCP`؛ ولا يُسمح بأي خروج آخر. | متغيرات بيئة جسر صندوق `Inspect`؛ وخادم `MCP` عبر `--strict-mcp-config`؛ و`ACP` اختياريًا |
| **`Shape I` (وكيل `Inspect`)** | محلّلات `Inspect` للمعايير العامة القائمة | يغلّف حزمة مهمة `SATB` بأدوات `submit` و`refuse` عند `attempts = 1`، مع توجيه استدعاءات النموذج عبر `satb-proxy`. | واجهة `Task` و`Solver` في `UK AISI Inspect` |

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

### 4.3 مجموعة اختبارات الامتثال الإلزامية للمحوّلات `C1-C12`

لا يدخل أي محوّل أو إطار اختبار مرحلة التقييم إلا بعد اجتيازه جميع التحققات الاثني عشر للامتثال (`C1` إلى `C12`):

| التحقق | المتطلب للاجتياز |
| :--- | :--- |
| **`C1` الجولة الكاملة للحزمة** | يعيد المحوّل إنتاج ملخص `JCS` `SHA-256` الدقيق للحزمة المهمة المدخلة. |
| **`C2` مسار التقديم** | يتلقى `Verifier` الخارجي تسلسل البايتات الدقيق المسجل في `satb-proxy` / `MCP` terminal capture. |
| **`C3` مسار الرفض** | يصل رفض موجَّه بطريقة نظيفة على شكل `refuse` (`sub_reason = "other"`, `completion_score = 0`). |
| **`C4` استدعاء طرفية واحد** | يتم تجاهل أي استدعاءات للأدوات أو الطرفية تصدر بعد أول `submit` أو `refuse` ويتم عدها. |
| **`C5` عدم وجود oracle** | يتعذر الوصول إلى أدلة `Verifier` و `satb-supervisor` ومقابسها ومسارات الأصل (`..`) من `/work`. |
| **`C6` الخروج** | لا يمكن الوصول إلا إلى `satb-proxy` (`127.0.0.1:<port>`) لحركة مرور النموذج؛ تتمتع العمليات الفرعية في `/work` بعدم الوصول إلى أي شبكة خارجية وبعدم وجود مفاتيح `API` علوية. |
| **`C7` وجود الاستخدام** | تحمل كل استدعاء للنموذج `usage` (`missing -> killed(usage_missing)`)؛ تتطابق إجماليات الرموز في الوكيل تمامًا مع إحصاءات المحرك العلوي. |
| **`C8` استقرار بصمة الإصبع** | تكون بصمة `SUT` المكونة من خمس كتل `SHA-256` متطابقة قبل وبعد تشغيل جاف لثلاث محاولات. |
| **`C9` إعادة تشغيل الإطار** | يؤدي إعادة تشغيل الاستجابات المسجلة في `satb-proxy` إلى إعادة إنتاج نص مكتوب متطابق في البايتات (`0` اختلاف في البايتات؛ إلزامي لـ `Lane B`). |
| **`C10` مسار الإنهاء** | يتم حصاد شجرة عمليات `/work` المتسارعة (بما في ذلك العمليات الفرعية المنفصلة) خلال أقل من `2,000` ملي ثانية وتُسجل على أنها `killed`. |
| **`C11` مصافحة القياسات** | تكون عدادات العمليات `L3` بدون جذر (`cgroup v2` أو `proc_pid_rusage`) قابلة للقراءة، وتصل علامات المراحل، ويُسجل الإزاحة بين ساعة أحادية الاتجاه وساعة الحائط. |
| **`C12` اختبار الحتمية** | يتم تنفيذ `8` طلبات متطابقة وتُسجل عدد المخرجات المتميزة كخاصية تجريبية لـ `SUT`. |

---

<div id="5-five-level-telemetry-attribution-l0l4--a1n-platform-channel-maps-and-what-cannot-be-attributed" class="anchor-alias" aria-hidden="true"></div>

## 5. إسناد القياسات بخمسة مستويات (`L0-L4 × A1-N`)، خرائط قنوات المنصة، وما لا يمكن إسناده

<figure class="my-8">
  <img src="/figures/satb-harness/satb-telemetry-attribution.svg" alt="حدود إسناد القياسات بخمسة مستويات من L0 إلى L4 مع تسميات A1 إلى N وخط أنابيب الفحص المجمع ذي السبع خطوات raw-first." />
  <figcaption>الشكل 2. اليسار: مستويات القياسات الفيزيائية والمنطقية <code>L0</code>-<code>L4</code> المرتبطة بتسميات الإسناد <code>A1</code>-<code>N</code>. اليمين: نظام عداد من سبع خطوات raw-first يفرض حدود انحراف الخط الأساسي قبل/بعد (<code>Falsifier 6</code>) و<code>Step 7</code> فحص المجمع.</figcaption>
</figure>

<div id="51-telemetry-boundaries-l0l4-and-attribution-labels-a1n" class="anchor-alias" aria-hidden="true"></div>

### 5.1 حدود القياس التتبعي (`L0-L4`) وعلامات الإسناد (`A1-N`)

تقع حساسات الطاقة والنشاط عند خمسة حدود متميزة تقيس كميات مادية مختلفة ولا يجوز جمعها أو الخلط بينها أبداً:

| المستوى | الحد المادي / المنطقي | الحساسات النموذجية | ما يمكن للقناة إسناده بصدق |
| :--- | :--- | :--- | :--- |
| **`L0` الحائط** | `AC` في مقبس الحائط | مقبس ذكي أو `PDU` (`Shelly` `apower`, `aenergy`; `Yokogawa` analyzer) | الآلة بأكملها بما فيها حرارة التحويل من `PSU`، المراوح، `DRAM`، و`NVMe`؛ إيقاع `~1 s`. |
| **`L1` المنصة** | سكة إدخال `DC` للوحة | حامل `Jetson Thor INA238`؛ `Mac sys_power`؛ `RAPL psys` | الكمبيوتر بأكمله على جانب `DC` أسفل وحدة الطاقة أو `PSU`. |
| **`L2` الحزمة / SoC** | مسارات حزمة `CPU`، `GPU`، و`SoC` | `RAPL pkg`؛ `macmon IOReport` بدون جذر؛ `Thor INA3221`؛ `amdgpu hwmon`؛ الطاقة التراكمية `NVML` (`mJ`) | الـ `SUT` بالكامل على `SoC` (`A2`)، أو محرك الاستدلال وحده عندما تكون السكة حصرية ماديًا (`A1`). |
| **`L3` العملية / cgroup** | شجرة عملية `OS` واحدة | `Linux cgroup v2` (`cpu.stat`, `memory.peak`, `io.stat`)، `perf`؛ `macOS proc_pid_rusage` `ri_energy_nj` | نصيب نشاط الموارد (`C`)، أو نموذج الطاقة الداخلي لكل عملية في نواة `OS` (`D`). |
| **`L4` المنطقي** | محادثة النموذج/الأداة | `satb-proxy` عدد الرموز وتأخيرات الاستدعاء؛ دورات الاختبار، نداءات الأدوات، وإغلاقات `ContextRule_v0` | عددات دقيقة على كل `SUT` دون استثناء، بما فيها `API`s السحابية المغلقة. |

كل قيمة طاقة في الإيصال تحمل واحدة من سبع علامات إسناد:

- **`A1` (Exclusive physical rail)**: مستشعر قضيب أجهزة فيزيائي يُلمس حصريًا بواسطة قسم واحد خلال نافذة القياس (مثل `Jetson Thor INA3221 ch1 VDD_GPU` عندما يكون محرك الاستدلال المحلي فقط لديه وصول إلى جهاز `GPU`).
- **`A2` (Dedicated whole-system boundary)**: عداد للآلة بأكملها (`L0`/`L1`) أو للحزمة بأكملها (`L2`) على آلة مخصصة هادئة (`SUT` بالإضافة إلى `OS` أرضية خاملة). **وفقًا لـ `OQ-4`، طاقة النافذة الخام لـ`SUT` بأكمله عند `A2` هي المقياس الفيزيائي الأساسي للطاقة في الوضع**، مما يمنع النماذج الرقيقة من تفريغ بحث قوي غير محسوب إلى عمليات فرعية في `/work` ويمنع طرح `active - idle` من تحسين الأداء في التشغيلات البطيئة.
- **`B` (Temporal phase split)**: فروق العدادات عبر نوافذ زمنية غير متداخلة يحدها علامات مراحل تسلسلية (`model_call` مقابل `tool_call` في `Lane B`).
- **`C` (Proportional share, the `Kepler` model)**: عداد أجهزة مشترك يُقسم حسب $\Delta \text{CPU}_{\text{partition}} / \Delta \text{CPU}_{\text{total}}$ أو استخدام `GPU` عند تداخل العمليات المتوازية (`Lane O` `Shape H`).
- **`D` (`OS`-modelled estimate)**: نموذج الطاقة الداخلي للنواة لكل عملية (`macOS ri_energy_nj`). يعزل شجرة عملية عن مستأجري `CPU` المشتركين، لكنه يظل نموذجًا للبرمجيات الثابتة/النواة بدلًا من قراءة تحويل فيزيائي.
- **`P` (Provider-attested)**: رقم طاقة خادم لكل طلب يُرجعه مزود سحابي إلى جانب منهجية قياسه الحرفية.
- **`N` (`not_available`)**: غير ملاحظ و**لا يُقدر أبدًا**.

<div id="52-seven-step-counter-discipline-rootless-collection-oq-5-and-platform-maps" class="anchor-alias" aria-hidden="true"></div>

### 5.2 إجراءات عدّ المؤشرات المكوَّنة من سبع خطوات، والجمع دون صلاحيات الجذر (`OQ-5`)، وخرائط المنصات

يعالج `satb-meter` كل محاولة عبر سبع خطوات مرتبة:
1. **قراءة العدّادات التراكمية عند كل حدّ حدث** (`attempt.start`، وكل `model_call` و`tool_call`، و`attempt.close`، إضافةً إلى علامة مرجعية كل `100 ms`) بحيث تكون طاقة النافذة فرق عدّاد دقيق $\Delta E = E(t_{\text{end}}) - E(t_{\text{start}})$.
2. **كتابة القنوات الخام أولاً**: تسجيل الحد، والمستشعر، والقراءتين الابتدائية والنهائية، وحالات التفاف العدّاد (counter wraps)، وعدد العينات. وتُوسَم النوافذ الأقصر من `10` دورات للمستشعر بالقيمة `"below_resolution"`، والعتاد الغائب بالقيمة `"not_available"`.
3. **تقسيم المراحل المتسلسلة (`B`)**: في `Lane B`، لا يتداخل الاستدلال النموذجي واستدعاءات أدوات `/work` زمنياً أبداً؛ أما أطر `Lane O` المتوازية فتُسقط تقسيم المراحل إلى `C` أو `N`.
4. **عزل `engine_resident_during_tools`**: أثناء تشغيل أداة `/work`، يحتفظ خادم نموذج محلي (`llama-server`، `vLLM`) بأوزان النموذج مقيمةً في `GPU`/`DRAM`. يُدرج استهلاكه في وضع الخمول خلال نافذة الأداة ضمن `engine_resident_during_tools`، ولا يُحمَّل لا على الاستدلال النشط للنموذج ولا على تنفيذ الأداة.
5. **التقسيم بالنسبة (`C`) فقط حيث تتداخل الأقسام**: تُطبَّق نسب $\Delta \text{CPU}$ بصرامة بوصفها خياراً احتياطياً للتوصيف، مع الإقرار بأن حالات `C`، وتردد `DVFS` التوربيني، وتوقفات `DRAM`/التخزين تخرق افتراض التناسب.
6. **تخزين خطوط الأساس كقنوات مشتقة**: تُحاط الجلسات بخطوط أساس مقيمة قبلية وبعدية؛ فإذا تجاوز انحراف استهلاك الخمول بين القياس القبلي والبعدي نسبة `5.0%` (`Falsifier 6`)، تُسقط القيم المشتقة للطاقة الصافية فوق الخمول مع إبقاء القنوات الخام سليمة.
7. **تشغيل فحص المجموع (`Falsifier 2`)**: التحقق من أن مكونات المراحل المشتقة تُجمع لتعطي فرق عدّاد المحاولة الخام ضمن كمّ مستشعر واحد (`1 mJ`)؛ فإن لم تفعل، يُverwerfen التقسيم المشتق ولا يُحتفظ إلا بالقناة الخام.

**قاعدة الجمع دون صلاحيات الجذر (`OQ-5`).** يجب ألا تُشغَّل تنسيقات `SUT` في المعايير أبداً بصلاحيات `root`. على `macOS`، يستخدم `satb-meter` الأداة `macmon` دون صلاحيات جذر (باشتراك `IOReport`) مع `libSystem` عبر `proc_pid_rusage(RUSAGE_INFO_V6)`، ولا يستخدم أبداً `sudo` ولا `powermetrics`. أما على `Linux` (حيث أصبح `/sys/class/powercap/intel-rapl` مقتصراً على الجذر في النواة `5.10` بعد هجوم `PLATYPUS`)، فإن قاعدة `udev` تُفعَّل مرة واحدة من قِبل المسؤول تمنح صلاحية القراءة لمجموعة مخصصة باسم `satb-meter` تحتوي **على معرّف `UID` الخاص بـ`satb-supervisor` فقط**، مما يضمن أن عمليات بيئة `/work` المعزولة لا تستطيع اعتراض `RAPL` عبر القنوات الجانبية (side-channel)، ولا قراءة عدّاد طاقتها الخاص.

| المنصة المستهدفة | `L0` / `L1` قنوات النظام كامل | `L2` قنوات الحزمة / SoC | `L3` عملية & `L4` قنوات منطقية | حالة التحقق الأساسية |
| :--- | :--- | :--- | :--- | :--- |
| **ماك بأبل سيليكون** (`M5 Max` موثّق) | `L0`: `Shelly` `PDU` (`not_available` إذا تم فصله); `L1`: `macmon sys_power` (`reported_j`) | `macmon IOReport`: `chip_power`, `cpu_power`, `gpu_power`, `ane_power`, `ram_power` (`reported_j`) | `L3`: `proc_pid_rusage` `ri_energy_nj` (`D`), `ri_instructions`, `ri_diskio_*`; `L4`: `satb-proxy` | تم التحقق من `L1`-`L4` بدون صلاحيات الجذر مباشرة على `Apple M5 Max`; توصيل `L0` مفتوح. |
| **Framework AMD Strix Halo** (`Ryzen AI Max+ 395`, `Linux x86-64` موثّق) | `L0`: `Shelly` `PDU` (`not_available` إذا تم فصله); `L1`: `cros_ec` (`0` power attrs) | `RAPL package-0` & `core` (`0440 root:energy` `udev`) `reported_j` + `amdgpu` `PPT` `power1_input` (`0444`; `energy1_input` غائب) | `L3`: `cgroup v2` / `getrusage` (`C` حصص النشاط); `L4`: `satb-proxy` | تم التحقق مباشرة (`0440 root:energy` عزل `PLATYPUS`; `amdgpu PPT` `0444`). |
| **Intel Raptor Lake** (`Core i9-13900H`, `Linux x86-64` موثّق) | `L0`: `not_available`; `L1`: `RAPL psys` (`intel-rapl:1/energy_uj`, `0444` `reported_j`) | `RAPL package-0`, `core`, & `uncore` (`MSR` + `MMIO` `energy_uj`, `0444` `reported_j`) | `L3`: `cgroup v2` / `getrusage` (`C` حصص النشاط); `L4`: `satb-proxy` | تم التحقق مباشرة (`0 µJ` بقايا `Step 7` عبر `psys` `L1` و `package-0` `L2`). |
| **NVIDIA Jetson AGX Thor** (`Linux aarch64` Tegra موثّق) | `L1`: `TI INA238` (`hwmon6` `VIN`, `0444` `measured_j`) + `INA3221 ch3 VIN_SYS_5V0` (`0444` `measured_j`) | `INA3221 ch1 VDD_GPU` (`0444` `measured_j`, `A1` عند الحصرية); `ch2 VDD_CPU_SOC_MSS` (`0444` `measured_j`); `NVML` (`unverified`) | `L3`: `cgroup v2` / `getrusage` (`C` حصص النشاط); `L4`: `satb-proxy` | تم التحقق مباشرة (`INA238` + `INA3221 ch1-ch3` `0444` بدون صلاحيات الجذر; GPU `NVML` مفتوح تحت قفل المشترك). |
| **Closed Cloud `API`** (`Anthropic`, `xAI`, `Cerebras`, `OpenAI`, `Google`) | قياس محلي `L0`-`L1` لمضيف العميل فقط (مستبعد من استدلال الخادم) | الخادم البعيد `L2`: إما **`N` (`not_available`)** صرامًا أو لكل طلب **`P`** (`OQ-6`) | محلي `/work` `L3` (`D`/`C`) لأدوات الـ sandbox؛ `L4`: **دقيق** `satb-proxy` الرموز، الاستدعاءات، `USD` | تم التحقق مباشرة عبر `Anthropic`, `Cerebras`, و `xAI` عبر `satb-proxy`. |

<div id="53-eight-hardware-measurement-pitfalls-and-seven-non-attributable-quantities" class="anchor-alias" aria-hidden="true"></div>

### 5.3 ثمانية مخاطر قياس الأجهزة وسبع كميات غير قابلة للإسناد

تفشل إجراءات قياس القدرة المعيارية المختصرة بشكل منهجي على المعالجات أحادية الرقاقة (`SoC`) ووحدات معالجة الرسوميات (`GPU`) الحديثة:

| مصدر خطأ في القياس على الأجهزة | معالجة `SATB` |
| :--- | :--- |
| **تنجرف قدرة الخمول مع حرارة الرقاقة والمراوح و`DVFS` والتسارع التوربيني** | انتظر تبرّد `GPU` (`<= 1.5 W`)، وحاصر كل نافذة قياس بخطوط أساس قبل القياس وبعده، وسجّل أعلى حرارة لـ`GPU`، وأبطل الجول الصافي المشتق عند انجراف يتجاوز `5.0%` (`Falsifier 6`). |
| **الالتباس بين خمول الجهاز البارد وخمول الأوزان المقيمة في الذاكرة** | قِس وسمِّ الحالتين صراحةً في `Step 6` بدلاً من طرح إحداهما بصمت. |
| **طرح `Active - idle` يُحابي التشغيلات البطيئة** | تبقى طاقة النافذة الخام للنظام الكامل (`A2`) هي رقم التموضع الأساسي (`OQ-4`). |
| **نوافذ أقصر من الفترة الزمنية للمستشعر تُقرأ كصفر أو كقيمة سالبة أو كضوضاء تكميم** | علّم أي نافذة أقصر من `10` فترات للمستشعر بالقيمة `"below_resolution"` (مثل `< 1.2 s` مع `macmon` بتردد `~8 Hz` أو `< 10 s` مع مقبس ذكي بتردد `1 Hz`). |
| **أدوات أخذ العينات عالية التردد تستهلك قدرة `CPU` كبيرة** | اقرأ العدادات التراكمية عند حدود الأحداث (`0.011 mW` عند `0 Hz`) مع نبضة كل `100 ms`، وسجّل خط الأساس `observer_only`. |
| **عداد القدرة اللحظي `NVML` على `A100`/`H100` يأخذ عينات من `~25%` فقط من زمن التشغيل** | اقرأ الطاقة التراكمية `nvmlDeviceGetTotalEnergyConsumption` (`mJ`)، ولا تستخدم أبداً استطلاع القدرة اللحظية `nvmlDeviceGetPowerUsage` (Chung et al.; Yang et al.). |
| **مقياس القابس الخارجي `L0` يعمل على ساعة غير متزامنة** | أصدر نبضة حمل معايرة حتمية بدورة تشغيل `50%` عند `session.open` و`session.close`، وقارن الطوابع الزمنية بالارتباط المتقاطع. |
| **خدمات الخلفية المشتركة على المضيف أو مهام المستأجرين المشاركين** | سجّل قائمة العمليات، وخفّض الطرحات المشتقة المشتركة لـ`L2` عبر `Falsifier 6`، وسجّل `ri_energy_nj` (`D`) للمستوى `L3` المعزول عن المستأجرين المشاركين إلى جانب `L2` الخام. |

وبناءً على ذلك، لا يمكن إسناد سبعة أمور إسناداً أميناً، ولا يجوز أن تدخل في ادعاءات `SATB`: (1) طاقة خادم `API` مغلق غير مصدّق (`N` أو `P` فقط)؛ (2) جول فيزيائي دقيق لكل عملية على رقاقة مشتركة أو سكة ذاكرة موحدة (`C` و`D` نماذج)؛ (3) أوزان نموذج معزولة عن نواة الخدمة والتكميم والتجميع الدفعي والسيليكون؛ (4) ملكية قاع خمول نظام التشغيل `OS` وقدرة الأوزان المقيمة في `DRAM` (وتُعرض كقنوات مستقلة)؛ (5) أحداث فردية أقصر من فترة المستشعر (كاستدعاء أداة مدته `30 ms` تحت قابس مدته `1 s`)؛ (6) أجهزة `VM` سحابية مشتركة تفتقر إلى عدادات الأجهزة المضيفة؛ و(7) تبديلات صامتة لأوزان المزوّد أثناء الجلسة (تُكشف بشواهد البداية والنهاية، ولا تُستبعد مسبقاً). وعلى وجه الخصوص (`OQ-6`)، فإن إفصاحات استدامة المزوّدين هي متوسطات أسطول وليست قياسات لكل طلب، ولا تدخل أبداً في إيصال `SATB`، ويشمل ذلك متوسط Google البالغ `0.24 Wh` لموجه `Gemini Apps`، ورقم OpenAI البالغ `0.34 Wh` المنشور دون منهجية، ورقم Mistral البالغ `1.14 gCO2e` لكل استجابة من `400` رمز.

---

<div id="6-measured-conformance-determinism-observer-effect-and-multi-host-attribution-results" class="anchor-alias" aria-hidden="true"></div>

## 6. نتائج التوافق المقاس والحتمية وتأثير المراقب وإسناد متعدد المضيفين

لاستبدال الافتراضات التصميمية غير المقاسة بإيصالات قابلة للتدقيق، نفذنا مجموعة اختبار التوافق الكاملة لـ `SATB` وإطار المزيف (`bench_satb_falsifiers.py` $\to$ `satb_empirical_receipts.json`, إجمالي وقت التشغيل `175.69 s`) على محطة عمل `Apple M5 Max` (`arm64`, `128 GB` ذاكرة موحدة، `macOS 27.2.1`, `macmon 0.12.0`)، إلى جانب تدقيق متقاطع لـ `188` نافذة.

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

<div id="66-multi-platform-hardware-attribution-across-four-silicon-archetypes" class="anchor-alias" aria-hidden="true"></div>

### 6.6 إسناد الأجهزة متعددة المنصات عبر أربعة نماذج سيليكون

للتحقق من توافق `SATB`، وتحديدية النقطة الثابتة `Shape D`، وحدود أذونات `PLATYPUS` غير الجذرية، وفصل السكة الفعلية خارج `macOS` وسيليكون Apple، تم تنفيذ `run_multi_host_satb.py` (`multi_host_satb_receipts.json`) عبر ثلاثة نماذج أجهزة `Linux` إضافية إلى جانب `Apple M5 Max`:

| نموذج الجهاز & نواة `OS` kernel | حدود المستشعر غير الجذرية & فئة الأدلة | `Shape D` `1M` `DNULLMM1` (`10k` مجسات) | `C9` إعادة تشغيل & متوسط `C10` `SIGKILL` | كمون القراءة المفردة & تحقيق `100 Hz` | `Step 7` المتبقي & `Falsifier 3` (`C` مقابل `B`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Apple M5 Max`** (`arm64`, `128 GB`, `macOS 27.2.1`) | `IOReport` `L1`/`L2` + `rusage` `L3` (`reported_j`; `measured_j = None`) | `15027705736` (`388.43 ns` `C++`, `582.57 ns` Rust) | `149,747 B` (`0` diffs) · `2.073 ms` (`0` `PID`s) | `~120 ms` `IOReport` · **`7.44 Hz`** | `<= 1 µJ` · **`-32.59%`** Phase 2 (`+35.86%` Ph. 1) |
| **`NVIDIA Jetson AGX Thor`** (`aarch64`, `122.9 GiB`, `Linux 6.8.12-1021-tegra`) | `TI INA238` (`hwmon6` `VIN` `L1`) + `INA3221` (`hwmon5` `ch1-ch3` `L2`/`L1`, `0444` **`measured_j`**) | `15027705736` (`984.86 ns` `C -O3`, `2,489.4 ns` Py) | `149,747 B` (`0` diffs) · `9.544 ms` (`0` `PID`s) | `2,948.8 µs` `I2C` · **`66.55 Hz`** | `0.0 µJ` · **`-70.01%`** `ch2` (`-67.02%` `VIN`) |
| **`Framework AMD Ryzen AI Max+ 395`** (`x86-64`, `122.8 GiB`, `Linux 7.0.0-43`) | `RAPL package-0` & `core` (`0440 root:energy` **`reported_j`**) + `amdgpu PPT` (`0444`; `measured_j = None`) | `15027705736` (`376.61 ns` `C -O3`, `1,341.7 ns` Py) | `149,747 B` (`0` diffs) · `0.868 ms` (`0` `PID`s) | `24.34 µs` `sysfs` · **`94.28 Hz`** | `0 µJ` · **`-71.61%`** `pkg-0` (`-63.34%` `core`) |
| **`Intel Core i9-13900H`** (`x86-64`, `14.7 GiB`, `Linux 7.0.0-43`) | `RAPL psys` (`L1`) + `package-0`, `core`, `uncore` (`L2`, `0444` **`reported_j`**; `measured_j = None`) | `15027705736` (`420.93 ns` `C -O3`, `863.6 ns` Py) | `149,747 B` (`0` diffs) · `1.120 ms` (`0` `PID`s) | `45.37 µs` `sysfs` · **`97.12 Hz`** | `0 µJ` · **`-72.89%`** `pkg-0` (`-73.62%` `psys`) |

تنشأ أربع نتائج مادية متعددة المنصات من هذه الإيصالات الحية:

1. **تكرارية البت-الدقيقة لـ `Shape D` و `Lane B` عبر `arm64`/`aarch64` و `x86-64`**: أنتجت جميع المضيفات الأربعة مجموع التحقق الدقيق `DNULLMM1` لـ `10,000` مسبار **`15027705736`**، وملخص `test.setpoint` المجمد الدقيق `0da4df8d9ccbce1e...4485781`، ونسخة `C9` الدقيقة ذات `149,747` بايت (`SHA-256` `d697ed1476129939...`، `0` بايت اختلاف)، مع حصاد `4`-`PID` لمجموعات العمليات الهاربة عبر `SIGKILL` في `0.868 ms` إلى `9.544 ms` (`> 200×` تحت سقف المواصفة `2,000 ms` حتى عند `loadavg_1m = 52.39` على `Jetson AGX Thor`).
2. **فصل المقاومات المادية `INA238` / `INA3221` و `Falsifier 6` تحت الاشتراك الحي لـ `GPU` على `NVIDIA Jetson AGX Thor`**: على `Linux 6.8.12-1021-tegra`، كل من `hwmon6` (`ti,ina238` عند `i2c@c600000/ina238@44`، `VIN` مدخل `DC` للوحة الكاملة عند `~27.97 V`) وجميع القنوات الثلاث لـ `hwmon5` (`ina3221@40`: `ch1 VDD_GPU`، `ch2 VDD_CPU_SOC_MSS`، و `ch3 VIN_SYS_5V0`) قابلة للقراءة عالميًا (`0444`) بدون `sudo`. أثناء مسبارنا المقتصر على `CPU`-فقط (`dedicated_host = false`)، احتفظ مستأجر مشارك مستقل `llama-server` بقفل `GPU` للمضيف:

| قناة المقاومة المادية لـ `Jetson AGX Thor` (`0444` `sysfs` بدون جذر) | الحد | قبل الخط الأساسي (`W`) | مرحلة 1 الحوسبة (`measured_j` / `W`) | مرحلة 2 `DRAM+fsync` (`measured_j` / `W`) | بعد الخط الأساسي (`W`) | الانحراف (`F6`) وخطأ `Kepler` `C` في المرحلة-2 |
| :--- | :---: | ---: | ---: | ---: | ---: | :--- |
| **`hwmon6` `INA238` `VIN`** (الوحدة + مدخل الحامل) | **`L1`** | `100.70 W` | `122.12 J` (`101.66 W`) | `99.02 J` (`81.94 W`) | `97.21 W` | `3.47%` (`A2` محجوب: مستأجر مشارك) · **`-67.02%`** |
| **`hwmon5` `INA3221 ch1` `VDD_GPU`** (مستأجر `LLM` المشارك) | **`L2`** | `29.26 W` | `40.29 J` (`33.54 W`) | `26.00 J` (`21.52 W`) | `28.13 W` | مستأجر `GPU` خارجي (`-36.1%` تأرجح في `F5`) |
| **`hwmon5` `INA3221 ch2` `VDD_CPU_SOC_MSS`** | **`L2`** | `36.68 W` | `45.73 J` (`38.07 W`) | `44.37 J` (`36.71 W`) | `36.08 W` | `1.64%` (نطاق `CPU`/`SoC`/`MSS`) · **`-70.01%`** |
| **`hwmon5` `INA3221 ch3` `VIN_SYS_5V0`** (سكة `5.08 V`) | **`L1`** | `14.89 W` | `18.66 J` (`15.53 W`) | `16.82 J` (`13.92 W`) | `13.98 W` | **`6.13% > 5.0%` (`F6` مفعّل)** · **`-68.85%`** |

عبر نوافذ التكرار الأربع لـ`Falsifier 5`، خفّضت طلبات `LLM` المتقلبة الصادرة عن المستأجرين المشاركين في الجهاز `ch1 VDD_GPU` من `35.36 J` إلى `22.60 J` (`-36.1%`)، فدفعت قراءة اللوحة الكاملة `INA238 VIN` (`L1`) من `107.48 J` إلى `81.73 J` (`-24.0%`)، بينما بقيت `ch2 VDD_CPU_SOC_MSS` ضمن النطاق `35.76-39.31 J`. ولأنّ `dedicated_host = false` (وتجاوزت `ch3 VIN_SYS_5V0` انحراف `5.0%` بمقدار `6.13%`)، يمتنع `SATB` عن إصدار ادعاءات الإسناد الصافي على مستوى `SUT` كاملًا في `A2`، مع الإبقاء على `measured_j` الدقيقة مفصولةً لكل سكة طاقة (إذ لا تُجمع قنوات `L1` و`L2` أبدًا).

3. **عزل `PLATYPUS` بالصلاحية `0440 root:energy` والتحقق من نطاق `APU` في `Strix Halo` على جهاز `Framework` `AMD`**: على جهاز `Framework` Desktop (`AMD Ryzen AI Max+ 395 w/ Radeon 8060S`، و`Linux 7.0.0-43-generic`)، تضبط قاعدة `udev` باسم `90-energy-read.rules` الملفين `/sys/class/powercap/intel-rapl:0/energy_uj` (`package-0`) و`intel-rapl:0:0/energy_uj` (`core`) على الوضع **`0440` (`root:energy`، و`world_readable = false`)**. فيتلقى معرّفو `UID` غير المنتمين إلى المجموعة داخل بيئة `/work` المعزولة الخطأ `EACCES`، فيُحجب بذلك هجمات القنوات الجانبية من نوع `PLATYPUS`، بينما يقرأ معرّف المجموعة المشرف (`energy`) العدادات التراكمية بالميكروجول دون صلاحيات جذر، بزمن كمون وسيط قدره `24.34 µs` (وببقايا `0 µJ` في `Step 7`). وبفحص `hwmon9` (`amdgpu`) حُسمت تفصيلة مواصفات مفتوحة أخرى: تُظهر وحدة `Radeon 8060S` المدمجة في `Strix Halo` قدرة `PPT` متاحة للقراءة للجميع (`0444`) عبر `power1_input` و`power1_average` بوحدة `µW`، بقيمة `75.38 W` في المرحلة الأولى و`69.72 W` في المرحلة الثانية، بدلًا من عداد مستقل باسم `energy1_input`. أمّا `cros_ec` (`hwmon8`) فلا يعرض سوى المراوح وحرارة اللوحة.

4. **فيزياء إيقاع ناقل الحساسات (`I2C` مقابل `MSR`/`MMIO` مقابل `IOReport`) ومُحفِّز `Falsifier 3` الشامل**: بينما تكتمل قراءات `sysfs` لـ`powercap` على معماريات `x86-64` خلال `24.34-45.37 µs` (أي `94.28-97.12 Hz` محققًا من أصل `100 Hz` اسمية)، فإن كل لقطة من تسعة سجلات لـ`INA238`+`INA3221` على `Jetson AGX Thor` تمرّ عبر `i2c@c600000` المادي في **`2,948.8 µs` وسيطًا** (و`4.48 ms` متوسطًا)، مما يحدّ الاستطلاع بتردد `100 Hz` عند **`66.55 Hz`** (أي بما يعادل `8.9` أضعاف سقف `IOReport` لدى `macmon` البالغ `7.44 Hz`)، بينما يبلغ التحقيق النظيف عند نبضة المرجع في `SATB` البالغة `100 ms` (أي `10 Hz`) نحو **`9.49 Hz`**. وفي الحواسيب الثلاثة كلها التي تعمل بنظام `Linux`، أدّى تقسيم الطاقة بنمط `Kepler` المتناسب مع زمن `CPU` (`C`) إلى نقص التقدير لمرحلة `DRAM` بسعة `192 MiB` مع `fsync` بنسبة **`67.02%` إلى `73.62%`**، وهو ما يؤكد عبر أربع معماريات سيليكونية السببَ الذي يقصر `SATB` استخدام `C` على التشغيلات المتوازية المتداخلة.

---

<div id="7-open-hardware-verification-and-limitations" class="anchor-alias" aria-hidden="true"></div>

## 7. التحقق من الأجهزة المفتوحة والقيود

| مُزِيف الجلسة | العاقبة عند التفعيل | الحالة التجريبية في هذه الدراسة |
| :--- | :--- | :--- |
| **`F1` عدم تطابق الإعادة (`C9`)** | إطار الاختبار المرجعي غير حتمي | **تم التصفية على `4/4` مضيفات (`0` فروق بايت عبر `149,747 B`, `14` دورات)** |
| **`F2` فشل فحص المجموع عند `> 5%` من المحاولات** | انقسام الإسناد مكسور على المضيف | **تم التصفية على `4/4` مضيفات (`0 µJ` Linux `RAPL`/shunt; `<= 1 µJ` `M5 Max`)** |
| **`F3` `B` و `C` غير متوافقين بـ `> 20%` تسلسليًا** | `C` (`Kepler`) مُوسم بأنه غير موثوق على المضيف | **تم التفعيل على `4/4` مضيفات (`32.59%-73.62%` خطأ); `C` مُقيد** |
| **`F4` حمل نبضي معروف خارج دقة المستشعر** | تم تخفيض دقة المستشعر للجلسة | **مفتوح (`L0` smart-plug sync-pulse rig لم يُثبت بعد)** |
| **`F5` `10 ms` مقابل `1 s` نقل إشارة الوقت يغيّر طاقة النافذة** | تأثير مراقب القياسات | **تم التصفية (`0.76%` `M5 Max` `L2` دلتا; `9.49-10.48 Hz` تم تحقيقها عند `100 ms` مرجع)** |
| **`F6` انحراف الأسس قبل/بعد الإقامة بـ `> 5.0%`** | القنوات الصافية المشتقة أصبحت غير صالحة | **نشط (`124/188` نوافذ `M5 Max` + انحرافات مستأجر لينكس تم حجزها بوضوح)** |
| **`F7` المحوّل يجتاز `C1`-`C12`، يفشل في اختبار الطائر** | المطابقة غير كافية؛ الجلسة `void` | **تم التحقق في المحاكاة (`session_void = true` على التبديل)** |
| **`F8` `Lane B` يُوضع تحت أطر `Lane O` القوية** | `Lane B` تم الإبلاغ عنها كأدنى مستوى صريح | **تم التصفية (`24/24` و `6/6` تماثل مقابل `Claude Code 2.1.330`)** |

ثلاثة عناصر ملموسة من الأجهزة والمحوّلات لا تزال مفتوحة (`OQ-5`):
1. جلسات `A2` مخصصة في حالة سكون ومعايرة مقبس الجدار `L0` `AC`: رغم أن مسارات `TI INA238` (`L1`) و `INA3221` (`L2`/`L1`) الشنط `measured_j` تم التحقق منها الآن مباشرة على `NVIDIA Jetson AGX Thor` جنبًا إلى جنب مع عدادات `reported_j` غير الجذرية على `Apple M5 Max`, `Framework AMD Strix Halo`, و `Intel Raptor Lake`, جميع آلات الاختبار الأربعة شغّلت أحمال مشتركة (`dedicated_host = false`), مما يمنع ادعاءات وضع `A2` لكامل الـ`SUT`; ربط عداد `L0` `AC` بتزامن النبض (`Shelly` / `Yokogawa`) على مضيف مخصص ساكن هو التالي.
2. فحص عداد `NVML` المتكامل لـ`GPU` على `Jetson AGX Thor`: صلاحيات `sysfs` غير جذرية (`0444`) لـ`INA238` و `INA3221 ch1-ch3` (`VDD_GPU`, `VDD_CPU_SOC_MSS`, `VIN_SYS_5V0`) و`Framework AMD Strix Halo` `0440 root:energy` `RAPL` + `amdgpu PPT` (`energy1_input` غير موجود) تم التحقق منها الآن على الجهاز؛ استكشاف `nvmlDeviceGetTotalEnergyConsumption` على `Jetson AGX Thor` ينتظر نافذة خالية عندما يكون قفل `GPU` المشترك متاحًا.
3. توسيع قائمة `Shape H` و `Shape I` الحية: تشغيل الأطر الخارجية الحية في هذه الدراسة استُخدم `Shape H` على `Claude Code 2.1.330` بجانب `Lane B` و `Shape D`; تنفيذ شهادة `C1-C12` الحية على `Codex CLI`, `OpenHands`, `Terminus-2`, و `Shape I` `Inspect` هو التالي.

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
