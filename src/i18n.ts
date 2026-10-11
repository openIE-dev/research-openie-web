// Languages for translated editions. English is the source; every other edition is a translation of it.
export const LANGS = {
  'zh-Hans': { name: '简体中文', dir: 'ltr', banner: '本文是英文原版的译本。如有出入，以英文版为准。', partial: '全文翻译正在进行中。以下为摘要的译文；全文请见英文原版：', original: '英文原版', languages: '语言' },
  es: { name: 'Español', dir: 'ltr', banner: 'Esta es una traducción de la versión en inglés. Si hay diferencias, prevalece la versión en inglés.', partial: 'La traducción completa está en curso. Abajo se traduce el resumen; el texto completo está en la versión original en inglés:', original: 'Original en inglés', languages: 'Idiomas' },
  fr: { name: 'Français', dir: 'ltr', banner: 'Ceci est une traduction de la version anglaise. En cas de divergence, la version anglaise fait foi.', partial: 'La traduction intégrale est en cours. Le résumé est traduit ci-dessous ; le texte complet est dans la version originale anglaise :', original: 'Original anglais', languages: 'Langues' },
  de: { name: 'Deutsch', dir: 'ltr', banner: 'Dies ist eine Übersetzung der englischen Fassung. Bei Abweichungen gilt die englische Fassung.', partial: 'Die vollständige Übersetzung ist in Arbeit. Unten ist die Zusammenfassung übersetzt; der vollständige Text steht im englischen Original:', original: 'Englisches Original', languages: 'Sprachen' },
  ja: { name: '日本語', dir: 'ltr', banner: '本稿は英語版の翻訳です。相違がある場合は英語版が優先します。', partial: '全文の翻訳は進行中です。以下は要旨の翻訳です。全文は英語の原文をご覧ください：', original: '英語の原文', languages: '言語' },
  pt: { name: 'Português', dir: 'ltr', banner: 'Esta é uma tradução da versão em inglês. Em caso de divergência, prevalece a versão em inglês.', partial: 'A tradução completa está em andamento. Abaixo está traduzido o resumo; o texto completo está na versão original em inglês:', original: 'Original em inglês', languages: 'Idiomas' },
  hi: { name: 'हिन्दी', dir: 'ltr', banner: 'यह अंग्रेज़ी संस्करण का अनुवाद है। किसी भी अंतर की स्थिति में अंग्रेज़ी संस्करण मान्य होगा।', partial: 'पूरे पाठ का अनुवाद जारी है। नीचे सारांश का अनुवाद है; पूरा पाठ मूल अंग्रेज़ी संस्करण में है:', original: 'मूल अंग्रेज़ी', languages: 'भाषाएँ' },
  ar: { name: 'العربية', dir: 'rtl', banner: 'هذه ترجمة للنسخة الإنجليزية. عند أي اختلاف، تكون النسخة الإنجليزية هي المرجع.', partial: 'الترجمة الكاملة قيد الإنجاز. أدناه ترجمة الملخص؛ والنص الكامل في النسخة الإنجليزية الأصلية:', original: 'الأصل الإنجليزي', languages: 'اللغات' },
} as const;
export type Lang = keyof typeof LANGS;
export const LANG_CODES = Object.keys(LANGS) as Lang[];
