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

function stripHtmlTags(x: string): string {
  return x.replace(/<\/?[a-zA-Z!][^>]*>/g, ' ');
}

function astroHtmlToMarkdown(rawAstro: string): string {
  let s = rawAstro.replace(/^---[\s\S]*?---\s*/, '');
  // Strip JSX comments and inline style/script blocks if any
  s = s.replace(/<!--[\s\S]*?-->/g, '');
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Preserve <img> figures before converting <a> wrappers
  s = s.replace(/<img\b[^>]*src="([^"]+)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, (_m, src, alt) => {
    const fullSrc = src.startsWith('/') ? `${BASE}${src}` : src;
    return `\n\n![${decodeHtmlEntities(alt.trim())}](${fullSrc})\n\n`;
  });
  // Convert inline formatting first
  s = s.replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href, inner) => {
    if (inner.includes('![')) return inner;
    const cleanInner = stripHtmlTags(inner).replace(/\s+/g, ' ').trim();
    if (!cleanInner) return '';
    const fullHref = href.startsWith('/') ? `${BASE}${href}` : href;
    return `[${cleanInner}](${fullHref})`;
  });
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_m, c) => `\`${stripHtmlTags(c).trim()}\``);
  s = s.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, (_m, c) => `**${c.trim()}**`);
  s = s.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, (_m, c) => `*${c.trim()}*`);
  // Headings
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_m, c) => `\n\n## ${stripHtmlTags(c).replace(/\s+/g, ' ').trim()}\n\n`);
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_m, c) => `\n\n### ${stripHtmlTags(c).replace(/\s+/g, ' ').trim()}\n\n`);
  s = s.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_m, c) => `\n\n#### ${stripHtmlTags(c).replace(/\s+/g, ' ').trim()}\n\n`);
  // Tables
  s = s.replace(/<table[\s\S]*?<\/table>/gi, (tbl) => {
    const rows: string[][] = [];
    for (const tr of tbl.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const cells: string[] = [];
      for (const td of tr[1].matchAll(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi)) {
        cells.push(decodeHtmlEntities(stripHtmlTags(td[1]).replace(/\s+/g, ' ').trim()).replace(/\|/g, '\\|'));
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
  s = s.replace(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi, (_m, c) => `\n\n> ${stripHtmlTags(c).replace(/\s+/g, ' ').trim()}\n\n`);
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, c) => `\n- ${stripHtmlTags(c).replace(/\s+/g, ' ').trim()}`);
  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_m, c) => `\n\n${stripHtmlTags(c).replace(/\s+/g, ' ').trim()}\n\n`);
  s = stripHtmlTags(s);
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
    id: 'constellation',
    title: 'The Language Constellation · 12,117-Language Ontology & Tree-Sitter Construct Map',
    path: '/constellation/',
    url: `${BASE}/constellation/`,
    paper_id: 'rce-compile',
    controls: [
      'view (ontology, search, translate, info, lineage, landscape, sources, standards, immersion, tooling, stack, compilers, collapse, unlock)',
      '#lang=<Name> (e.g. #lang=Rust, #lang=Python, #lang=TypeScript, #lang=Lean)',
      'depth (plain, visual, builder, formal)',
    ],
    description:
      'Interactive ontology and grammar-derived information-theory explorer across 12,117 catalogued programming languages and 75 benchmarked tree-sitter grammars (expanded to 267 measured grammars in the live dataset) mapped onto 113 universal constructs—measuring cross-language surface-per-construct (N/C) ratios, Shannon structural entropy, syntactic redundancy, construct-by-construct translation bridges, lineage, and editor LSP/DAP tooling maintenance.',
  },
  {
    id: 'compiled-agency',
    title: 'Compiled Agency · Sub-Bit Tax, 4-Stage Cascade & Shot #6 Multi-Substrate Observatory (ca-sim-01..03)',
    path: '/living/compiled-agency/',
    url: `${BASE}/living/compiled-agency/`,
    paper_id: 'lut-adapt',
    controls: ['board (kv260, thor, i9_rapl, ryzen_rapl)', 'mode (gross, net, vin, core)', 'point (0.0000..8.0000 bpw)', 'kernel (packed, naive)', 'zipf (0.00..1.40)', 'dmax (0..2)', 'tau (1500..9000)', 'dt (100..50000)'],
    description: 'Interactive 4-substrate hardware observatory (AMD Kria KV260 TI INA260 & NVIDIA Jetson AGX Thor TI INA3221/INA238 physical DC shunt measured_j + Intel Core i9-13900H & AMD Ryzen AI Max+ 395 Linux RAPL reported_j @ 813eb96): 14-point sub-bit SVD + Walsh-Hadamard decompression impedance curve, 75-cell (Zipf s x d_max x tau) 4-stage lookup-first cascade simulator, and live in-browser waiOS 256x128 BLAKE3 (a541323b...) & row-77 tamper-halt verifier.',
  },
  {
    id: 'deterministic-null',
    title: 'Deterministic Null Control Observatory (dn-diag-01..03)',
    path: '/living/deterministic-null/',
    url: `${BASE}/living/deterministic-null/`,
    paper_id: 'deterministic-null',
    controls: ['track (exp002, exp003, exp001_t2, exp001_t1, multiturn)', 'T (50..2000)', 'hit (0.00..0.95)', 'usd (0.0020..0.0600)', 'joule (10..400)'],
    description: 'Interactive confirmatory track switcher (4,030 held-out instances + exp-003 multi-vendor/3-SAT DRAT + 6 upstream SWE-bench Verified repositories), Zipfian online crystallization simulator, and OpenTimestamps + drand proof cards.',
  },
  {
    id: 'satb-harness',
    title: 'Satiation Benchmark Harness & Telemetry Attribution Observatory',
    path: '/living/satb-harness/',
    url: `${BASE}/living/satb-harness/`,
    paper_id: 'satb-harness',
    controls: ['ContextRule_v0 & Truncate_v0 window simulator', '5-host L0..L4 x A1..N attribution inspector (macOS, Tegra INA238/INA3221, Linux RAPL, Windows 11 NVML/JobObject)', 'Falsifier 3/5/6/8 & C1..C12 conformance explorer'],
    description: 'Interactive Lane B context-elision simulator, 5-archetype telemetry explorer (including Jetson Thor INA238/INA3221 measured_j and bare-metal Windows 11 NVML/GetProcessTimes), Kepler proportional vs boundary comparator, and C12 determinism receipts.',
  },
  {
    id: 'rce-jepa',
    title: 'RCE-JEPA World Coding, FormEBM-v3 & 40/40 3-Gear Observatory (rj-diag-01..03)',
    path: '/living/rce-jepa/',
    url: `${BASE}/living/rce-jepa/`,
    paper_id: 'rce-jepa',
    controls: ['H1-H15 & RJ-F1-RJ-F6 scoreboards + 40-task residual filter', 'FormJEPA-v1 vs FormEBM-v2 vs span-normalized FormEBM-v3 (H5 AUROC 0.9437, H11 94.0% strict, OOD H15 0.5278)', '3-Gear Zipf(s) stream & rce repair rung-f (<= 2.0%) simulator'],
    description: 'Interactive H1-H15 hypothesis explorer, FormEBM-v3 contrastive OOD edit-size and 5-step energy landscape, H15-Iterative 40/40 residual repair inspector, and 3-Gear Zipfian crystallization simulator.',
  },
  {
    id: 'rce-compile',
    title: 'RCE Compile Payback Horizon, .rlib Prelude, H4 Regime-B & De Bruijn Reuse Observatory (rc-diag-01..03)',
    path: '/living/rce-compile/',
    url: `${BASE}/living/rce-compile/`,
    paper_id: 'rce-compile',
    controls: ['kernel (k01..k20 or median)', 'base/target compiler tier (15 tiers across Python, GCC, Clang, rustc, Wasm32, RCE + shared librce_rt.rlib)', 'call horizon N (1..10^7)', 'mutant/key soundness & warm-cache reported_j inspector'],
    description: 'Interactive 20-kernel x 15-tier Linux RAPL compilation vs execution energy payback calculator (N*, including 20.07x lower librce_rt.rlib compile energy), H4 Regime-B regression explorer, and 245-program / 500-mutant De Bruijn nameless cache soundness simulator.',
  },
  {
    id: 'time-as-an-index',
    title: 'Time as an Index Observatory & 195-Entry Unified Catalog',
    path: '/living/time-as-an-index/',
    url: `${BASE}/living/time-as-an-index/`,
    paper_id: 'time-as-an-index',
    controls: ['D-CTC vs P-CTC vs Hellman T*M^2=N^2 calculator', 'DPSS band-limited extrapolation horizon', 'Landauer & Compton clock ledger', '195-entry searchable catalog (TA001-TA081, AA01-AA40, P01-P74)'],
    description: 'Four URL-addressable physics/complexity instruments plus a unified searchable explorer across 81 temporal anomalies, 40 frequency edge cases, and 74 paradoxes.',
  },
  {
    id: 'communication-avalanche',
    title: 'Communication Tool Avalanche, 5-Host Shunts, DES-10 & BCI Observatory (ca-diag-01..04)',
    path: '/living/communication-avalanche/',
    url: `${BASE}/living/communication-avalanche/`,
    paper_id: 'communication-avalanche',
    controls: ['Hill quorum / SepJ nanopore / Starling k=7 / Physarum conductance simulator', 'Event-driven BLAKE3+Ed25519+SSP orchestration DAG & CTA-E1..E3 RAPL receipt explorer', 'BCI sensing-to-modulation & consent-gated N-mind agency matrix', '5-host fleet energy (Thor INA238/INA3221 measured_j) + DES-10 10-camp forcing horizon + 10-figure gallery (ca-diag-04)'],
    description: 'Four URL-addressable simulators + 10-figure gallery spanning biophysical threshold switches, 5-host physical shunt/counter orchestration, 10-camp Digital Enzymatic Synthesis (DES-10, 98/100 verified pass), 1950-2026 AI history, and 18-modality neural interface bounds.',
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
    id: 'game-engines',
    title: 'Game-Engine 9/9 Determinism, DX12/Vulkan/Metal Tolerance, Actor/Godot Parity & Chrono-Budget Arena (GE-H1..H9)',
    path: '/living/game-engines/',
    url: `${BASE}/living/game-engines/`,
    paper_id: 'game-engines',
    controls: ['30-cell 3-OS x 3-ISA Q32.32 100,000-tick SHA-256 inspector', 'GE-H2 UCRT/glibc/libSystem & MSVC/Clang FMA divergence explorer', 'GE-H3 8-endpoint DirectX 12 / Metal / Vulkan PSNR & SSIM matrix', 'GE-H4..H9 SLOC, 10,000-actor scaling, 26-pattern fault F1, Lyapunov slope, 1h 3-OS replay & Godot 4 parity', 'Playable 60 Hz Q32.32 Chrono-Budget Arena'],
    description: 'Interactive 9/9 GE-H1..H9 observatory spanning 3-OS Q32.32 replay, 28-pair DX12/Vulkan/Metal tolerance, 10,000-actor RAPL scaling, 260-module interface fault F1, 1-hour 3-OS input-log replay, Godot 4.7.2 headless parity, and playable arena.',
  },
  {
    id: 'latency',
    title: 'Publication-to-Deployment Cadence & Task-Cost Explorer',
    path: '/living/latency/',
    url: `${BASE}/living/latency/`,
    paper_id: 'latency',
    controls: ['Quarterly reporting quantization cadence', 'Hardware capex vs electricity task-cost breakdown'],
    description: 'Interactive cadence-quantization and dollars-and-joules task-cost simulator accompanying The Gap Between Possible and Deployed.',
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
    title: 'Impedance Tax & 34-Workload reported_j Explorer',
    path: '/living/ai-reads-human/',
    url: `${BASE}/living/ai-reads-human/`,
    paper_id: 'ai-reads-human',
    controls: ['34-workload parse + tiktoken L3/L2 reported_j explorer', '20,000-record format comparison'],
    description: 'Interactive explorer of parse time, token count, and Apple M5 Max L3/L2 reported_j across 34 binary and human-readable workloads.',
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
