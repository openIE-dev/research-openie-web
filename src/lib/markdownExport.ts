import fs from 'node:fs';
import path from 'node:path';
import { getCollection } from 'astro:content';
import { studies, isDraft } from '../data/studyList';
import { revisionOf } from './revision.mjs';
import { HEADINGS as RCE_JEPA_HEADINGS } from '../components/RceJepaPaper.astro';
import rceSpecData from '../../spec-src/rce/spec.json';

const BASE = 'https://research.openie.dev';
const INCLUDE_RE = /^<!--\s*include:\s*([a-z0-9-]+)\s*-->$/gm;

function stripFrontmatter(raw: string): { fm: Record<string, string>; body: string } {
  const fm: Record<string, string> = {};
  if (!raw.startsWith('---')) return { fm, body: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { fm, body: raw };
  const block = raw.slice(3, end);
  for (const line of block.split('\n')) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(?:"(.*)"|'(.*)'|(.*))$/);
    if (m) fm[m[1]] = (m[2] ?? m[3] ?? m[4] ?? '').replace(/\\"/g, '"').trim();
  }
  return { fm, body: raw.slice(end + 4).trimStart() };
}

function expandIncludesAndRevision(body: string, relSourcePath: string): string {
  const rev = revisionOf(relSourcePath);
  const expanded = body.replace(INCLUDE_RE, (_m, name) => {
    const incFile = path.resolve(process.cwd(), 'src/includes', `${name}.md`);
    return fs.existsSync(incFile) ? fs.readFileSync(incFile, 'utf8').trim() : '';
  });
  return expanded.replace(/\{\{revision\}\}/g, (_match, offset, full) => {
    const lineStart = full.lastIndexOf('\n', offset) + 1;
    const prefix = full.slice(lineStart, offset);
    const word = prefix.trim() ? 'revision' : 'Revision';
    return `${word} [\`${rev.hash}\`](${rev.history}), ${rev.date}`;
  });
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&times;/g, '×')
    .replace(/&le;/g, '≤')
    .replace(/&ge;/g, '≥')
    .replace(/&rarr;/g, '→');
}

function astroHtmlToMarkdown(rawAstro: string): string {
  let s = rawAstro.replace(/^---[\s\S]*?---\s*/, '');
  // Strip JSX comments and inline style/script blocks if any
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Convert inline formatting first
  s = s.replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, inner) => {
    const cleanInner = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!cleanInner) return '';
    const fullHref = href.startsWith('/') ? `${BASE}${href}` : href;
    return `[${cleanInner}](${fullHref})`;
  });
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_m, c) => `\`${c.replace(/<[^>]+>/g, '').trim()}\``);
  s = s.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, (_m, c) => `**${c.trim()}**`);
  s = s.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, (_m, c) => `*${c.trim()}*`);
  // Headings
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_m, c) => `\n\n## ${c.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()}\n\n`);
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_m, c) => `\n\n### ${c.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()}\n\n`);
  s = s.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_m, c) => `\n\n#### ${c.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()}\n\n`);
  // Tables
  s = s.replace(/<table[\s\S]*?<\/table>/gi, (tbl) => {
    const rows: string[][] = [];
    for (const tr of tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cells: string[] = [];
      for (const td of tr[1].matchAll(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi)) {
        cells.push(decodeHtmlEntities(td[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).replace(/\|/g, '\\|'));
      }
      if (cells.length) rows.push(cells);
    }
    if (!rows.length) return '';
    const width = Math.max(...rows.map((r) => r.length));
    const pad = (r: string[]) => [...r, ...Array(Math.max(0, width - r.length)).fill('')];
    const head = `| ${pad(rows[0]).join(' | ')} |`;
    const sep = `| ${Array(width).fill('---').join(' | ')} |`;
    const rest = rows.slice(1).map((r) => `| ${pad(r).join(' | ')} |`).join('\n');
    return `\n\n${head}\n${sep}${rest ? '\n' + rest : ''}\n\n`;
  });
  // Lists & paragraphs & figcaptions
  s = s.replace(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi, (_m, c) => `\n\n> ${c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}\n\n`);
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, c) => `\n- ${c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`);
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_m, c) => `\n\n${c.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}\n\n`);
  s = s.replace(/<[^>]+>/g, '');
  s = decodeHtmlEntities(s);
  return s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function buildRceJepaMarkdown(): string {
  const root = process.cwd();
  const main = fs.readFileSync(path.join(root, 'src/components/RceJepaPaper.astro'), 'utf8');
  const thesis = fs.readFileSync(path.join(root, 'src/components/RceJepaThesis.astro'), 'utf8');
  const proposer = fs.readFileSync(path.join(root, 'src/components/RceJepaProposer.astro'), 'utf8');
  const conv = fs.readFileSync(path.join(root, 'src/components/RceJepaConvergence.astro'), 'utf8');
  const inlined = main
    .replace(/<RceJepaThesis\s*\/>/g, thesis.replace(/^---[\s\S]*?---\s*/, ''))
    .replace(/<RceJepaProposer\s*\/>/g, proposer.replace(/^---[\s\S]*?---\s*/, ''))
    .replace(/<RceJepaConvergence\s*\/>/g, conv.replace(/^---[\s\S]*?---\s*/, ''));
  return astroHtmlToMarkdown(inlined);
}

export interface StudyHeading {
  depth: number;
  slug: string;
  text: string;
}

export interface ExportedStudy {
  id: string;
  title: string;
  short_title: string;
  kind: string;
  group: string;
  collectionDir: 'papers' | 'products';
  url: string;
  path: string;
  markdownPath: string;
  markdownUrl: string;
  pdf: string;
  pdfPath: string;
  latexPdfUrl: string | null;
  latexTexUrl: string | null;
  figures: string;
  figuresUrl: string;
  about: string;
  aboutPath: string;
  dataUrl: string;
  summary: string;
  keywords: string[];
  revisionHash: string;
  revisionDate: string;
  revisionIso: string;
  headings: StudyHeading[];
  markdownDocument: string;
}

let cachedStudies: ExportedStudy[] | null = null;

export async function getExportedStudies(): Promise<ExportedStudy[]> {
  if (cachedStudies) return cachedStudies;
  const root = process.cwd();
  const papersCol = await getCollection('papers');
  const productsCol = await getCollection('products');
  const headingMap = new Map<string, StudyHeading[]>();

  for (const entry of [...papersCol, ...productsCol]) {
    const metaHeadings = ((entry as any).rendered?.metadata?.headings ?? []) as StudyHeading[];
    headingMap.set(entry.data.id, metaHeadings.filter((h) => h.depth === 2 || h.depth === 3));
  }
  headingMap.set('rce-jepa', RCE_JEPA_HEADINGS as StudyHeading[]);

  const out: ExportedStudy[] = [];
  for (const s of studies) {
    if (isDraft(s.id)) continue;
    const isProduct = s.group === 'product' || s.path.startsWith('/products/');
    const collectionDir: 'papers' | 'products' = isProduct ? 'products' : 'papers';
    const relSrc = `src/content/${collectionDir}/${s.id}.md`;
    const absSrc = path.join(root, relSrc);
    const revSource = s.id === 'rce-jepa' ? 'src/components/RceJepaPaper.astro' : relSrc;
    const rev = revisionOf(revSource);

    let rawBody = '';
    let statusLine = s.kind;
    if (fs.existsSync(absSrc)) {
      const parsed = stripFrontmatter(fs.readFileSync(absSrc, 'utf8'));
      if (parsed.fm.status) statusLine = parsed.fm.status;
      rawBody = s.id === 'rce-jepa'
        ? buildRceJepaMarkdown()
        : expandIncludesAndRevision(parsed.body, relSrc);
    }
    // Strip leading duplicate `# Title` if present in body
    rawBody = rawBody.replace(/^#\s+[^\n]+\n+/, '').trim();
    // Rewrite root-relative links in Markdown to full URLs so standalone .md / llms-full.txt readers resolve every link
    rawBody = rawBody.replace(/\]\(\/(?!\/)/g, `](${BASE}/`);

    const markdownPath = `/${collectionDir}/${s.id}.md`;
    const markdownUrl = `${BASE}${markdownPath}`;
    const latexPdfRel = `pdfs/latex/${s.id}.pdf`;
    const latexTexRel = `pdfs/latex/${s.id}.tex`;
    const hasLatexPdf = fs.existsSync(path.join(root, 'public', latexPdfRel));
    const hasLatexTex = fs.existsSync(path.join(root, 'public', latexTexRel));
    const latexPdfUrl = hasLatexPdf ? `${BASE}/${latexPdfRel}` : null;
    const latexTexUrl = hasLatexTex ? `${BASE}/${latexTexRel}` : null;
    const figRaw = s.figures || '/living/';
    const figuresUrl = figRaw.startsWith('http') ? figRaw : `${BASE}${figRaw}`;
    const dataUrl = `${BASE}/data/#${s.id}`;

    const headerLines = [
      `# ${s.title}`,
      '',
      `- **Study ID:** \`${s.id}\``,
      `- **Kind / Status:** ${statusLine}`,
      `- **Revision:** \`${rev.hash}\` (${rev.date})`,
      `- **Web Edition:** ${s.url}`,
      `- **Markdown Twin:** ${markdownUrl}`,
      `- **PDF Edition:** ${s.pdf}`,
      ...(latexPdfUrl ? [`- **LaTeX Archival PDF:** ${latexPdfUrl}`] : []),
      ...(latexTexUrl ? [`- **LaTeX Source (.tex):** ${latexTexUrl}`] : []),
      `- **Interactive Figures:** ${figuresUrl}`,
      `- **Claim Scope & About:** ${s.about}`,
      `- **Data & Reproducibility:** ${dataUrl}`,
      `- **Keywords:** ${s.keywords.join(', ')}`,
      '',
      `> ${s.summary}`,
      '',
      '---',
      '',
    ];

    const months: Record<string, string> = {
      January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
      July: '07', August: '08', September: '09', October: '10', November: '11', December: '12',
    };
    const dm = rev.date.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    const revisionIso = dm ? `${dm[3]}-${months[dm[2]] ?? '01'}-${dm[1].padStart(2, '0')}T00:00:00Z` : '2026-11-22T00:00:00Z';

    out.push({
      id: s.id,
      title: s.title,
      short_title: s.short_title,
      kind: s.kind,
      group: s.group,
      collectionDir,
      url: s.url,
      path: s.path,
      markdownPath,
      markdownUrl,
      pdf: s.pdf,
      pdfPath: s.pdfPath,
      latexPdfUrl,
      latexTexUrl,
      figures: figRaw,
      figuresUrl,
      about: s.about,
      aboutPath: s.aboutPath,
      dataUrl,
      summary: s.summary,
      keywords: s.keywords,
      revisionHash: rev.hash,
      revisionDate: rev.date,
      revisionIso,
      headings: headingMap.get(s.id) ?? [],
      markdownDocument: headerLines.join('\n') + rawBody + '\n',
    });
  }

  cachedStudies = out;
  return out;
}

export function getRceSpecChapters() {
  const base = '/rce/spec/';
  return [
    { slug: '', path: base, url: `${BASE}${base}`, title: 'RCE Language Specification — Index' },
    ...(rceSpecData.chapters as any[]).map((c) => ({
      slug: c.slug,
      path: `${base}${c.slug}/`,
      url: `${BASE}${base}${c.slug}/`,
      title: `RCE Spec ${c.num ? c.num + ' ' : ''}${c.title}`,
    })),
    { slug: 'examples', path: `${base}examples/`, url: `${BASE}${base}examples/`, title: 'RCE Spec — All Example Programs' },
    { slug: 'read-protocol', path: `${base}read-protocol/`, url: `${BASE}${base}read-protocol/`, title: 'RCE Spec — Read Protocol' },
  ];
}

export const LIVING_INSTRUMENTS = [
  {
    id: 'deterministic-null',
    title: 'Deterministic Null Control Observatory (dn-diag-01..03)',
    path: '/living/deterministic-null/',
    url: `${BASE}/living/deterministic-null/`,
    paper_id: 'deterministic-null',
    controls: ['track (exp002, exp001_t2, exp001_t1, multiturn)', 'T (50..2000)', 'hit (0.00..0.95)', 'usd (0.0020..0.0600)', 'joule (10..400)'],
    description: 'Interactive confirmatory track switcher (4,030 held-out instances + 6 multi-file repositories), Zipfian online crystallization simulator, and OpenTimestamps + drand proof cards.',
  },
  {
    id: 'lut-adapt',
    title: 'Downward LUT6 Compilation & AirMoL Instruments (la-diag-01..03)',
    path: '/living/lut-adapt/',
    url: `${BASE}/living/lut-adapt/`,
    paper_id: 'lut-adapt',
    controls: ['p0 (0.05..1.00)', 'dt (20..5000)', 'cw (0.20..10.0)', 'ec (20..2000)', 'rtl (ours, benes1, flat64, ff512, wnn)', 'model (lfm, qwen)', 'arm (t1, pld, cold, wake)'],
    description: 'Interactive Simon-Kadane crystallization horizon calculator, xck26 Beneš + RAMB36E2 RTL synthesis table, and Darwin F_NOCACHE 4-bit NVMe streaming explorer.',
  },
  {
    id: 'fpga-sim',
    title: 'Stage B FPGA / LUT Commit-Gate Simulator (WASM + WebGPU)',
    path: '/living/fpga-sim/',
    url: `${BASE}/living/fpga-sim/`,
    paper_id: 'gates',
    controls: ['seed-1 golden trace playback', 'WASM commit-gate step', 'Alchitry Pt V2 Stage C builder guide (/living/fpga-sim/alchitry/)'],
    description: 'Browser WebAssembly + WebGPU simulator for the seed-1 commit gate and LUT fabric.',
  },
  {
    id: 'ni',
    title: 'Notational Intelligence Commit Gate Figures (ni-3d-01)',
    path: '/living/ni/',
    url: `${BASE}/living/ni/`,
    paper_id: 'gates',
    controls: ['3D orbit canvas', 'commit/refuse JSON inspection'],
    description: 'Interactive commit-gate trajectories and refusal receipts.',
  },
  {
    id: 'satiation',
    title: 'Task Satiation & Aggregate Rebound Surface (sat-3d-01)',
    path: '/living/satiation/',
    url: `${BASE}/living/satiation/`,
    paper_id: 'satiation',
    controls: ['3D bliss/satiation surface explorer'],
    description: 'Interactive task-satiation threshold vs aggregate demand rebound explorer.',
  },
  {
    id: 'mol',
    title: 'Mixture of Limits Cascade Explorer',
    path: '/living/mol/',
    url: `${BASE}/living/mol/`,
    paper_id: 'gates',
    controls: ['Cascade rung inspection'],
    description: 'Cheapest-first cascade rung figures and analytical floor shells.',
  },
  {
    id: 'ai-reads-human',
    title: 'Impedance Tax & Format Parse-Time Figures',
    path: '/living/ai-reads-human/',
    url: `${BASE}/living/ai-reads-human/`,
    paper_id: 'ai-reads-human',
    controls: ['20,000-record format comparison'],
    description: 'Interactive comparison of human-readable formats vs fixed binary layouts across parse time and token count.',
  },
  {
    id: 'mei',
    title: 'Metabolic Intelligence Figures',
    path: '/living/mei/',
    url: `${BASE}/living/mei/`,
    paper_id: 'mei',
    controls: ['Energy-envelope figures'],
    description: 'Companion interactive figures for the Metabolic Intelligence white paper.',
  },
  {
    id: 'spellcheck',
    title: 'Spell Check Commoditization Timeline',
    path: '/living/spellcheck/',
    url: `${BASE}/living/spellcheck/`,
    paper_id: 'spellcheck',
    controls: ['Historical price-to-bundling timeline'],
    description: 'Dated historical price and bundling figures for Spell Check is Global.',
  },
];
