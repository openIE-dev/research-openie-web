// Derived from the content collection, RCE spec chapters, and living instruments,
// so a new study appears here without a hand edit. No <lastmod>, matching the klere.ai rule.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isDraft } from '../data/studyList';
import { getExportedStudies, getRceSpecChapters, LIVING_INSTRUMENTS } from '../lib/markdownExport';

const STATIC = [
  '/',
  '/about/',
  '/data/',
  '/changelog/',
  '/glossary/',
  '/faq/',
  '/standards/',
  '/replication/',
  '/living/',
  '/living/fpga-sim/alchitry/',
  '/opportunity-map/',
  '/rce/download/',
  '/tv/',
  '/radio/',
  '/tutorials/',
  '/blueprint/',
  '/sourcesheets/',
  '/transcripts/',
  '/coverage.json',
  '/syndication/',
  '/llms.txt',
  '/llms-full.txt',
  '/catalog.json',
  '/feed.xml',
  '/feeds/medium.xml',
];

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://research.openie.dev');
  const exported = await getExportedStudies();
  const specChapters = getRceSpecChapters();
  const translations = (await getCollection('translations')).filter((t) => !isDraft(t.data.source));

  const routes = [
    ...STATIC,
    ...specChapters.map((c) => c.path),
    ...LIVING_INSTRUMENTS.map((i) => i.path),
    ...exported.flatMap((s) => [
      s.path,
      s.markdownPath,
      s.aboutPath,
      s.pdfPath,
      ...(s.latexPdfUrl ? [new URL(s.latexPdfUrl).pathname] : []),
    ]),
    ...translations.map((t) => `/${t.data.lang}/papers/${t.data.source}/`),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...new Set(routes)].map((r) => `  <url><loc>${new URL(r, base).href}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
