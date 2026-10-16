---
title: "سوق البرمجة بالذكاء الاصطناعي الموعود بتريليون دولار"
deck: "من يتوقع سوقًا بتريليون دولار للبرمجة بالذكاء الاصطناعي، وما الذي يحصيه كل توقع، وما الذي يفترضه كل توقع عن الطاقة والرموز وإعادة الاستخدام."
lang: "ar"
source: "ai-coding-market"
complete: true
---

<div id="the-one-path-error-the-economics-of-autonomous-coding" class="anchor-alias" aria-hidden="true"></div>

*الإصدار 1.1، 11 أكتوبر 2026. البيانات والشيفرة: [research.openie.dev/data/](/data/#economics). ملف LaTeX PDF: [/pdfs/latex/ai-coding-market.pdf](/pdfs/latex/ai-coding-market.pdf) ([المصدر](/pdfs/latex/ai-coding-market.tex)).*


<div id="abstract" class="anchor-alias" aria-hidden="true"></div>

## الملخص

تقول التوقعات إن البرمجة بالذكاء الاصطناعي ستساوي تريليونات الدولارات سنويًا. يسرد هذا المقال من يقول ذلك، ويسم كل رقم بحسب ما هو عليه، ويسمّي الافتراضات التي تشترك فيها التوقعات.

**بكلمات بسيطة**

1. الأرقام الكبيرة عن البرمجة بالذكاء الاصطناعي في معظمها تخمينات عن المستقبل، لا إحصاءات لأموال كُسبت بالفعل.
2. تفترض كلها تقريبًا أن كل قطعة جديدة من الشيفرة تحتاج إلى نموذج ذكاء اصطناعي كبير، يُدفع له بحسب الكلمة، إلى الأبد.
3. إذا أمكن حفظ الشيفرة العاملة وإعادة استخدامها، انخفضت تكلفة المهمة المتكررة نحو تكلفة الكهرباء اللازمة لتشغيلها، وكانت تلك التوقعات أعلى مما ينبغي.

<div id="1-projections-and-measurements-are-different-objects" class="anchor-alias" aria-hidden="true"></div>

## 1. التوقعات والقياسات شيئان مختلفان

يحمل كل رقم أدناه وسمًا من خمسة أوسمة.

| الوسم | المعنى |
|---|---|
| **توقع** | تنبؤ أو تقدير للقيمة مبني على افتراضات معلنة |
| **أعلنته الشركة** | رقم تعلنه شركة عن نفسها، مثل الإيراد السنوي المحسوب (الشهر الأخير مضروبًا في اثني عشر) أو تقييم جولة تمويل |
| **تقدير مسحي** | رقم لحجم السوق مستمد من مسح للمشترين |
| **مودَع** | رقم في وثيقة مودعة لدى جهة تنظيمية |
| **مقيس** | عدّ أو قراءة طاقة من تشغيل محفوظة مخرجاته. وتحمل قراءات الطاقة وسمًا من ثلاثة أوسمة: `est_j` للتقدير التحليلي، و`reported_j` لعداد نظام التشغيل أو العداد المدمج في الشريحة، و`measured_j` لعداد طاقة خارجي |

الصف الأخير وحده دليل على تكلفة نتيجة صحيحة. أما البقية فأدلة على ما تتوقعه السوق.

<div id="2-who-projects-what" class="anchor-alias" aria-hidden="true"></div>

## 2. من يتوقع ماذا

<div id="21-developer-value-the-trillion" class="anchor-alias" aria-hidden="true"></div>

### 2.1 قيمة المطورين: التريليون

| الادعاء | الرقم | الوسم | المصدر |
|---|---|---|---|
| مطورو البرمجيات في العالم | نحو 30 مليونًا (من 27 مليونًا إلى 47 مليونًا بحسب التقدير) | مدخل توقع | Appenzeller وLi [1] |
| القيمة لكل مطور في السنة | 100,000 دولار (مفترضة) | مدخل توقع | [1] |
| الإسهام الاقتصادي السنوي | نحو 3 تريليونات دولار | توقع | [1] |
| المطورون على GitHub | أكثر من 180 مليونًا؛ و518.7 مليون طلب دمج مدموج في السنة | أعلنته الشركة | GitHub Octoverse 2025 [17] |
| قيمة الذكاء الاصطناعي التوليدي عبر 63 حالة استخدام | من 2.6 تريليون إلى 4.4 تريليون دولار سنويًا؛ إنتاجية هندسة البرمجيات من 20% إلى 45% من الإنفاق السنوي الحالي للوظيفة | توقع | McKinsey [15] |
| أثر الذكاء الاصطناعي التوليدي في الناتج المحلي العالمي | 7% على مدى عشر سنوات | توقع | Goldman Sachs [16] |
| مكسب الإنتاجية من مساعد بسيط | نحو 20% | تقدير من مقابلات | [1] |
| مكسب الإنتاجية من نشر من الطراز الأول | "الضعف على الأقل" | تقدير "مبني على أدلة قصصية" | [1] |

عدد المطورين رقم رخو: 30 مليونًا تقدير للمحترفين، وGitHub وحده يعدّ ستة أضعاف ذلك من الحسابات التي تبني عليه [17]. والقيمة لكل مطور ومضاعف الإنتاجية رخوان كذلك (القسم 2.7). وتقدير McKinsey لعام 2023 هو التريليون الأصلي لهذه السوق، وهو تقدير للقيمة عبر كل الوظائف [15]. ويقول مقال رأس المال المغامر نفسه إن منظومة البرمجة بالذكاء الاصطناعي يمكن أن "تحمل عشرات الشركات المليارية وحتى عملاقًا بتريليون دولار" [1]. تلك الجملة هي التريليون. إنها تقدير للقيمة. وليست توقعًا للإيرادات.

<div id="22-tool-revenue-and-enterprise-spend" class="anchor-alias" aria-hidden="true"></div>

### 2.2 إيرادات الأدوات وإنفاق المؤسسات

| الادعاء | الرقم | الوسم | المصدر |
|---|---|---|---|
| إنفاق المؤسسات على أدوات البرمجة بالذكاء الاصطناعي، 2025 | 4.0 مليار دولار، أي 55% من إنفاق الأقسام على الذكاء الاصطناعي | تقدير مسحي | Menlo Ventures [2] |
| إنفاق المؤسسات على الذكاء الاصطناعي التوليدي، 2025 | 37 مليار دولار | تقدير مسحي | [2] |
| سوق أدوات الشيفرة بالذكاء الاصطناعي، 2026 | 9.35 مليار دولار، تصل إلى 29.96 مليار دولار بحلول 2031 | توقع | Mordor Intelligence [3] |

الإيرادات التي تعلنها السوق اليوم بالمليارات. والتريليون هو القيمة التي تأمل السوق أن تستحوذ عليها.

<div id="23-company-revenue-and-valuations" class="anchor-alias" aria-hidden="true"></div>

### 2.3 إيرادات الشركات وتقييماتها

| ادعاء الشركة | الرقم | التاريخ | الوسم | المصدر |
|---|---|---|---|---|
| الإيراد السنوي المحسوب لـ Cursor | أكثر من مليار دولار | 13 نوفمبر 2025 | أعلنته الشركة | Cursor [5] |
| إعادة تسعير Cursor Pro | من حدود الطلبات إلى "استخدام نماذج رائدة بقيمة 20 دولارًا شهريًا بأسعار API"، مع استرداد مقابل التغيير | يونيو إلى يوليو 2025 | أعلنته الشركة | Cursor [18] |
| جولة Cursor Series D | 2.3 مليار دولار بتقييم 29.3 مليار دولار بعد التمويل | 13 نوفمبر 2025 | أعلنته الشركة | [5] |
| الإيراد السنوي المحسوب لـ Anthropic | 14 مليار دولار | 12 فبراير 2026 | أعلنته الشركة | Anthropic [6] |
| الإيراد السنوي المحسوب لـ Claude Code | أكثر من 2.5 مليار دولار | 12 فبراير 2026 | أعلنته الشركة | [6] |
| جولة Anthropic Series G | 30 مليار دولار بتقييم 380 مليار دولار بعد التمويل | 12 فبراير 2026 | أعلنته الشركة | [6] |

تقول Anthropic إن الجولة تموّل "توسعات في البنية التحتية" [6]. فالإيراد والتقييم والحوسبة رهان واحد.

يضع الشكل 1 الأرقام الدولارية في الأقسام 2.1 إلى 2.3 و2.6 على محور واحد، معلَّمة بالوسم الذي يحمله كل مصدر.

![مخطط نقطي بمقياس لوغاريتمي للأرقام الدولارية من جداول المقال. توقعات: إسهام المطورين نحو 3 تريليونات دولار، وقيمة الذكاء الاصطناعي التوليدي من 2.6 إلى 4.4 تريليون، والإنفاق العالمي على الذكاء الاصطناعي 1.5 تريليون، وسوق أدوات الشيفرة بالذكاء الاصطناعي 9.35 مليار في 2026 و29.96 مليار في 2031. تقدير: إنفاق رأسمالي يزيد على 400 مليار. تقديرات مسحية: إنفاق الشركات على الذكاء الاصطناعي التوليدي 37 مليارًا وإنفاق أدوات البرمجة بالذكاء الاصطناعي 4.0 مليار. بحسب ما أعلنته الشركات: معدل الإيراد السنوي لـ Claude Code يزيد على 2.5 مليار ولـ Cursor يزيد على 1 مليار.](/figures/ai-coding-market/spend-by-label.svg)

*الشكل 1. الأرقام الدولارية بحسب الوسم. شكل بيانات، بمقياس لوغاريتمي. المصادر: Appenzeller وLi [1]، وMenlo Ventures [2]، وMordor Intelligence [3]، وCursor [5]، وAnthropic [6]، وIEA [10]، وMcKinsey [15]، وGartner [24]. تتوفر [نسخة PNG](/figures/ai-coding-market/spend-by-label.png).*

<div id="24-inference-tokens-and-unit-economics" class="anchor-alias" aria-hidden="true"></div>

### 2.4 الاستدلال والرموز واقتصاديات الوحدة

| الادعاء | الرقم | الوسم | المصدر |
|---|---|---|---|
| الرموز التي تعالجها Google شهريًا | 9.7 تريليون (2024)، ونحو 480 تريليونًا (2025)، وأكثر من 3.2 كوادريليون (مايو 2026) | أعلنته الشركة | Pichai [8] |
| أدوات Google الداخلية للمطورين بالذكاء الاصطناعي | نصف تريليون رمز يوميًا في مارس 2026، وأكثر من ثلاثة تريليونات يوميًا في مايو | أعلنته الشركة | [8] |
| تكلفة استعلام برمجي وكيلي واحد بأسعار القائمة | 2.50 دولار: سياق من 100,000 رمز و10,000 رمز مخرج بسعر 15 و75 دولارًا لكل مليون رمز | توضيح | Appenzeller وLi [1] |
| الأمر نفسه بمعدل 3 استعلامات في الساعة، 7 ساعات يوميًا، 200 يوم | نحو 10,000 دولار في السنة لكل مطور | توضيح | [1] |
| الرموز في البرمجة الوكيلية مقارنةً باستدلال الشيفرة ومحادثة الشيفرة | نحو 1,000 ضعف؛ تختلف تشغيلات المهمة الواحدة حتى 30 ضعفًا؛ وزيادة استهلاك الرموز "لا تترجم إلى دقة أعلى" | مقيس (ثمانية نماذج، SWE-bench Verified) | Bai وHuang وWang [9] |
| صافي الخسائر من استثمار Microsoft في OpenAI، الربع المنتهي في 30 سبتمبر 2025 | 4.1 مليار دولار قبل الضريبة، حصتها بطريقة حقوق الملكية، ضمن المصروفات الأخرى؛ وانخفاض صافي الدخل بمقدار 3.1 مليار دولار (0.41 دولار للسهم المخفف) | مودَع وأعلنته الشركة | Microsoft Form 10-Q [7]; Microsoft FY26 Q1 performance [19] |

سطران في المصادر يقولان الاقتصاد بوضوح. Pichai: "كثير من الشركات تستنفد بالفعل ميزانياتها السنوية للرموز، ولم نبلغ إلا مايو" [8]. Appenzeller وLi: "طوال عقود كانت تكلفة تطوير البرمجيات تكاد تكون تكلفة بشر خالصة، أما الآن فتضيف النماذج اللغوية الكبيرة مكوّنًا كبيرًا من النفقات التشغيلية" [1].

يرسم الشكل 2 سلسلة الرموز.

![مخطط خطي بمقياس لوغاريتمي للرموز التي عالجتها Google شهريًا: 9.7 تريليون في 2024، ونحو 480 تريليونًا في 2025، وأكثر من 3.2 كوادريليون في مايو 2026، بحسب ما أعلنته الشركة.](/figures/ai-coding-market/tokens.svg)

*الشكل 2. الرموز المعالجة شهريًا في Google. شكل بيانات، بحسب ما أعلنته الشركة، بمقياس لوغاريتمي. المصدر: Pichai [8]؛ والملاحظة عن استخدام الرموز من Bai وHuang وWang [9]. تتوفر [نسخة PNG](/figures/ai-coding-market/tokens.png).*

<div id="25-price-per-token" class="anchor-alias" aria-hidden="true"></div>

### 2.5 السعر لكل رمز

| الادعاء | الرقم | الوسم | المصدر |
|---|---|---|---|
| تكلفة مستوى ثابت من أداء الذكاء الاصطناعي | انخفاض بنحو 47% كل ربع سنة، أي نحو 13 مرة في السنة، منذ 2023 | سلسلة أسعار مقيسة (خمسة معايير) | Epoch AI [4] |
| سعر بلوغ درجة معيارية ثابتة | ينخفض من 9 إلى 900 مرة في السنة بحسب المعلم؛ وأسرع الانخفاضات أحدثها وأقلها يقينًا في الاستمرار | سلسلة أسعار مقيسة (ملاءمات لوغاريتمية خطية) | Epoch AI [34] |
| تكلفة الاستدلال عند أداء مكافئ | انخفاض بنحو 10 مرات في السنة: من 60 دولارًا لكل مليون رمز في 2021 إلى 0.06 دولار | تقدير | Appenzeller، a16z [20] |
| خفض سعر API لدى DeepSeek، 29 سبتمبر 2025 | تكلفة المطورين "خُفّضت بأكثر من 50%" | أعلنته الشركة | DeepSeek [21] |

الـ 13 مرة في السنة في [4] نقطة واحدة في نطاق واسع [34]. ويدفع هذا الانخفاضَ التنافسُ والأوزانُ المفتوحة، كما يبيّن خفض DeepSeek [21]. ولا يحتاج إلى أي محاسبة للطاقة. هذا هو الانخفاض الأول من الانخفاضين في القسم 5. وتضيف إعادة الاستخدام انخفاضًا مختلفًا: الاستدعاءات لكل مهمة.

يرسم الشكل 3 سلسلتي الأسعار.

![مخطط بمقياس لوغاريتمي لسعر المليون رمز عند قدرة ثابتة. ينخفض تقدير a16z من 60 دولارًا في 2021 إلى 0.06 دولار في 2024، أي نحو عشر مرات في السنة. ورُسم ميل متقطع لـ Epoch AI يبلغ نحو ثلاث عشرة مرة في السنة منذ 2023، مفهرسًا على عشرة دولارات في 2023.](/figures/ai-coding-market/price-trend.svg)

*الشكل 3. سعر مستوى ثابت من القدرة. شكل بيانات، بمقياس لوغاريتمي: نقطتا نهاية a16z كما طُبعتا [20]؛ وخط Epoch AI هو المعدل المعلن البالغ نحو 13 مرة في السنة منذ 2023 [4]، مفهرسًا على بداية اعتباطية لإظهار الميل فقط. والنطاق بحسب المعلم من Epoch AI [34]. تتوفر [نسخة PNG](/figures/ai-coding-market/price-trend.png).*

<div id="26-energy-and-capital" class="anchor-alias" aria-hidden="true"></div>

### 2.6 الطاقة ورأس المال

| الادعاء | الرقم | الوسم | المصدر |
|---|---|---|---|
| كهرباء مراكز البيانات، 2024 | نحو 415 TWh، أي نحو 1.5% من كهرباء العالم | تقدير | IEA, *Energy and AI* [11] |
| كهرباء مراكز البيانات، 2030 | نحو 945 TWh، السيناريو الأساسي | توقع | [11] |
| كهرباء مراكز البيانات، من 2025 إلى 2030 | من 485 TWh إلى 950 TWh، أي نحو 3% من الطلب العالمي | تقدير وتوقع | IEA, *Key Questions on Energy and AI* [10] |
| الإنفاق الرأسمالي لأكبر شركات التقنية | أكثر من 400 مليار دولار في 2025، مع زيادة متوقعة بنسبة 75% أخرى في 2026 | مُعلن ومتوقع | [10] |
| الإنفاق الرأسمالي لـ Alphabet | 31 مليار دولار في 2022؛ ونحو 180 إلى 190 مليار دولار متوقعة في 2026 | أعلنته الشركة وتوجيهاتها | Pichai [8] |
| الطاقة لكل مهمة | انخفاض بمرتبة عشرية واحدة على الأقل في السنة؛ ومهام التفكير والمهام الوكيلية تستهلك "مئات أو آلاف أضعاف الطاقة لكل استعلام مقارنة بتوليد النص البسيط" | تقدير | [10] |
| موجّه نصي وسيط واحد إلى مساعد في بيئة الإنتاج | 0.24 Wh | قاسه المشغّل | Elsworth et al. [12] |
| Stargate | 500 مليار دولار على أربع سنوات لبنية تحتية للذكاء الاصطناعي لمختبر واحد، و100 مليار دولار تُنشر فورًا | أعلنته الشركة | OpenAI [22] |
| الإنفاق العالمي على الذكاء الاصطناعي، 2025 | نحو 1.5 تريليون دولار | توقع | Gartner [24] |
| الإيراد الذي يجب أن يستردّ الإنفاق الرأسمالي | "AI's \$600B question" | تحليل | Sequoia Capital [23] |

الإيجار الذي يجب سداده إيجار عتاد. والإنفاق الرأسمالي والالتزامات بهذا الحجم تُسدَّد عبر استخدام مسعَّر فوق طاقته. وفي المهام التي يمكن إغلاقها بإعادة الاستخدام، يكون ذلك الأساس أصغر.

<div id="27-productivity-evidence" class="anchor-alias" aria-hidden="true"></div>

### 2.7 أدلة الإنتاجية

| الدراسة | n | التصميم | الأثر | المصدر |
|---|---|---|---|---|
| مقال a16z | مقابلات | تقدير | نحو 20% لمساعد بسيط؛ و"الضعف على الأقل" للطراز الأول | [1] |
| GitHub Copilot، مهمة خادم HTTP | مطورون مستقطبون | تجربة مضبوطة | أسرع بنسبة 55.8% في مهمة تجريبية واحدة | Peng et al. [27] |
| تجربة Google المؤسسية | 96 مهندسًا | تجربة معشاة مضبوطة | وقت أقل بنحو 21% في المهمة | Paradis et al. [28] |
| METR، مطلع 2025 | 16 مطورًا متمرسًا في المصادر المفتوحة، 246 مهمة | تجربة معشاة مضبوطة | أبطأ بنسبة 19% مع الذكاء الاصطناعي | Becker et al. [25] |
| METR، تحديث 2026 | فوج جديد | تجربة معشاة مضبوطة | يصف المؤلفون البيانات الجديدة بأنها "إشارة غير موثوقة" | METR [26] |

تتراوح الآثار المقيسة بين تباطؤ بنسبة 19% وتسارع بنسبة 56% في مهمة تجريبية. وكلا عاملي تقدير القيمة، عدد المطورين ومضاعف الإنتاجية، رخو. وهذا يضعف التريليون. ويعني أيضًا أن أي قيمة تحررها البرمجة الأرخص ليست رقمًا معروفًا.

<div id="3-what-the-projections-assume" class="anchor-alias" aria-hidden="true"></div>

## 3. ما تفترضه التوقعات

إذا قُرئت التوقعات معًا، فإنها تستند إلى أربعة افتراضات. وكل منها قول عن اتجاه واحد في فضاء التصميم، لا عن قيمة البرمجيات.

1. **اتجاه واحد: التوليد.** كل تغيير يكتبه نموذج. ويضاعف تقدير القيمة الإنتاجية بالنموذج، ويسعّر توضيح التكلفة كل استعلام [1].
2. **طاقة عالية وحوسبة عالية.** يُتوقع أن ينمو حجم الرموز وكهرباء مراكز البيانات والإنفاق الرأسمالي معًا [8, 10, 11]. وتنخفض الطاقة لكل استعلام، وترتفع الرموز لكل مهمة بأسرع من ذلك [9, 10].
3. **إيجار لكل رمز.** تُحتسب الإيرادات لكل رمز أو لكل مقعد تكلفته رموز. ويُتوقع أن تبلغ تكلفة الرموز السنوية لمطور واحد حجم راتب [1].
4. **الذكاء الاصطناعي في الحلقة إلى الأبد.** المهمة 10,000 تكلف ما تكلفه المهمة 1، لأن لا شيء مما تعلمه النموذج في المهمة 1 يعمل من غير النموذج في المهمة 10,000.

والمقال الذي يذكر التريليون يذكر حدّه أيضًا: "مع أن التسعير بالإحلال ينجح في الأسواق المبكرة، فإن تكلفة السلعة تتقارب في النهاية مع تكلفتها الحدية، وكذلك التسعير" [1]. وهذا المقال يوافق، ويسأل: ما التكلفة الحدية لمهمة برمجية صحيحة؟

<div id="4-what-a-correct-task-costs" class="anchor-alias" aria-hidden="true"></div>

## 4. ما تكلفه المهمة الصحيحة

عرّف، لمهمة برمجية واحدة، $C \in \{0, 1\}$ نتيجة فحص قبولها (تنجح الاختبارات، أو يُتحقق من برهان، أو يطابق مخرجٌ مرجعًا)، و$J$ الطاقة المستخدمة لبلوغ $C = 1$، بالجول، و$c_J$ سعر الطاقة، بالدولار لكل جول، و$c_{\text{check}}$ تكلفة تشغيل الفحص، بالدولار. يدفع المشتري مقابل $C = 1$، لا مقابل الرموز.

**الطاقة تحدّ التكلفة الحدية من الأسفل.** التكلفة الحدية للتشغيل لا تقل عن $c_J J$، لأن الكهرباء يجب أن تُشترى. وفي ظل التنافس، يميل السعر نحو التكلفة الحدية [1, 14].

**كثير من الشيفرة يُعاد استخدامه.** برهن Gurevich أن كل خوارزمية تسلسلية تلتقطها آلة حالات مجردة تسلسلية: مجموعة من الحالات وقاعدة انتقال [35]. وقاس Lopes وزملاؤه أن نحو 70% من الشيفرة على GitHub يتكون من نسخ لملفات أُنشئت سابقًا [36]. وحيث يوجد حل ناجح بالفعل، يمكن إغلاق المهمة باسترجاعه وفحصه بدلًا من توليده من جديد.

**القضية E0 (سعر المهمة المغطاة).** لنقل إن المهمة مغطاة حين يجتاز حلٌّ مخزَّن فحصها. ولتكن $J_{\text{floor}}$ الطاقة اللازمة لاسترجاع ذلك الحل وتطبيقه وفحصه. وفي ظل التنافس بين بائعين تجتاز نتائجهم الفحص نفسه، يميل سعر المهمة المغطاة نحو

$$p_{\text{covered}} \to c_J \, J_{\text{floor}} + c_{\text{check}}.$$

لا يلزم التوليد إلا في المهام غير المغطاة. ولتدفق مهام جزؤه المغطى $f \in [0, 1]$ ومتوسط تكلفة التوليد فيه على المهام غير المغطاة $p_{\text{gen}}$، يكون السعر المتوقع لكل مهمة $\bar p = f \, p_{\text{covered}} + (1 - f) \, p_{\text{gen}}$. والجزء $f$ لم يُقس بعد (القضية E4).

<div id="5-where-the-projections-are-fragile" class="anchor-alias" aria-hidden="true"></div>

## 5. أين تكون التوقعات هشة

**التسعير لكل رمز.** المهمة التي تُغلق بإعادة الاستخدام لا تحتاج إلى رموز، فخط الإيرادات المسعَّر لكل رمز لا يكسب منها شيئًا. وإجمالي إيرادات الرموز على تدفق مهام يتناسب مع $1 - f$.

**النموذج في كل حلقة.** إذا خُزّن حل وُجد مرة واحدة وفُحص، فإن المهام اللاحقة من النمط نفسه لا تحتاج إلى النموذج، فتنخفض استدعاءات النموذج لكل مهمة كلما ازداد $f$. أما هل يحدث ذلك في العمل الحقيقي فتقيسه القضية E3.

**الطاقة لكل مهمة.** يقيس مشغّل مساعد في بيئة الإنتاج موجّهًا نصيًا وسيطًا واحدًا إليه بـ 0.24 Wh، أي 864 J [12]، وتضع IEA استعلامات التفكير والاستعلامات الوكيلية عند مئات أو آلاف أضعاف طاقة الاستعلام البسيط [10]. ولا يوجد قياس منشور يقارن التوليد بالاسترجاع على المهام نفسها، فلا تُذكر هنا أي نسبة.

**انخفاضان يُضرب أحدهما في الآخر.** اكتب تكلفة المهمة على الصورة $p = n \cdot q$، حيث $n$ عدد استدعاءات النموذج لكل مهمة و$q$ الدولارات لكل استدعاء. ينخفض السعر لكل استدعاء عند أداء ثابت بعامل يتراوح من 9 إلى 900 في السنة، بحسب المهمة [4, 34]. وتخفّض إعادة الاستخدام $n$. والتوقع الذي يستقرئ حجم الرموز لا ينمذج إلا $q$.

**الحزم.** السلعة التي تقترب تكلفتها الحدية من الصفر، وتكمّل أداة يملكها الناس أصلًا، تميل إلى أن تُضمّ إلى تلك الأداة ضمن حزمة، فيختفي سعرها المستقل [13, 14]. وبيّن Nalebuff أن الحزمة قد تسد باب الدخول [32]، وبيّن Adams وYellen أنها قد تميّز في السعر [33]؛ ووصف Spolsky استراتيجية تحويل المكمّل إلى سلعة [31]. وتغيّرات التسعير ظاهرة: نقلت GitHub الخطط الفردية لـ Copilot إلى الفوترة بحسب الاستخدام ابتداءً من 1 يونيو 2026 [30]، ونقلت Cursor خطة Pro من حدود الطلبات إلى تمرير أسعار API في 2025 [18].

**ما يبقى.** قد يصمد تقدير القيمة في القسم 2.1. أما الهش فهو افتراض أن القيمة تُحصَّل رسمًا على التوليد، لأن ذلك الرسم لا ينطبق إلا على الجزء $1 - f$.

<div id="6-demand" class="anchor-alias" aria-hidden="true"></div>

## 6. الطلب

قد ترفع المهام الأرخص الطلب الكلي. ويتوقع ذلك مقال رأس المال المغامر: "نعتقد أن مفارقة جيفونز تصح في هذه الحالة" [1]. وينبغي الفصل بين أثرين. فالطلب على مهمة واحدة يتوقف بمجرد أن يصير $C = 1$. ومع ذلك قد ينمو الاستخدام الكلي، لأن العمل الأرخص يفتح مهام جديدة. والمرونة الوحيدة المنشورة صغيرة. فعبر المهام في عينة API لدى Anthropic، تقترن كل زيادة بنسبة 1% في التكلفة بانخفاض بنسبة 0.29% في تواتر الاستخدام، أي مرونة قدرها $\varepsilon \approx -0.29$ [29]. وهذا مقطع عرضي عبر المهام، لا تغيّر في السعر عبر الزمن. ومع $|\varepsilon| < 1$، يخفّض انخفاض السعر على مجموعة ثابتة من المهام الإيرادات، لأن الإيراد $R = pQ$ يتغير بمقدار $dR/R = (1 + \varepsilon)\, dp/p$.

<div id="7-propositions-and-protocols" class="anchor-alias" aria-hidden="true"></div>

## 7. القضايا والبروتوكولات

**القضية E1 (منحنيات التكلفة تتقاطع).** لتدفق من المهام في مستودع واحد، تنخفض التكلفة التراكمية لكل مهمة محلولة في طريقة تخزّن الحلول المفحوصة وتعيد استخدامها دون تكلفة طريقة تولّد كل تغيير، بعد عدد منتهٍ من المهام. *البروتوكول:* شغّل الطريقتين على تدفق المسائل نفسه تحت عداد طاقة خارجي. وأبلغ عن `measured_j` والدولارات لكل مهمة محلولة بحسب رقم المهمة، وعن رقم التقاطع.

**القضية E2 (السعر يتبع الأرضية).** حيث يمكن إغلاق قدرة برمجية بالاسترجاع والقواعد، ينخفض سعر قائمتها نحو $c_J J_{\text{floor}} + c_{\text{check}}$. *البروتوكول:* تتبّع أسعار القائمة لفئة قدرات من هذا النوع مقابل طاقة تشغيلها المقيسة عبر الزمن.

**القضية E3 (حصة الرموز من التكلفة).** في مستودع تنمو فيه إعادة الاستخدام، تنخفض حصة تكلفة المهمة المدفوعة رموزًا. *البروتوكول:* سجّل الرموز والجول والدولارات لكل مهمة مغلقة بحسب الجولة، وأبلغ عن حصة الرموز من التكلفة بحسب الجولة.

**القضية E4 (التغطية).** الجزء المغطى $f$ من الحجم الحقيقي لمهام البرمجة قابل للقياس. *البروتوكول:* اسحب عينة عشوائية من طلبات الدمج المدموجة في مستودعات عامة (تُبلغ GitHub عن 518.7 مليون طلب مدموج في سنة [17])، واختبر في كل منها وجود حل مسترجَع يجتاز اختبارات المستودع، وأبلغ عن $f$ مع فترة Wilson بنسبة 95%.

<div id="references" class="anchor-alias" aria-hidden="true"></div>

## المراجع

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
