// Draft for src/pages/sitemap.xml.ts. Derived from the content collection and the page files,
// so a new study appears here without a hand edit. No <lastmod>, matching the klere.ai rule.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { studies, isDraft } from '../data/studyList';

const STATIC = ['/', '/about/', '/glossary/', '/living/', '/opportunity-map/', '/about/rce-jepa/'];

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://research.openie.dev');
  const papers = (await getCollection('papers')).filter((p) => !isDraft(p.data.id));
  const products = (await getCollection('products')).filter((p) => !isDraft(p.data.id));
  const translations = (await getCollection('translations')).filter((t) => !isDraft(t.data.source));
  const routes = [
    ...STATIC,
    ...studies.flatMap((s) => [s.path, s.aboutPath, s.pdfPath]),
    ...papers.flatMap((p) => [`/papers/${p.data.id}/`, `/about/${p.data.id}/`, p.data.pdf]),
    ...translations.map((t) => `/${t.data.lang}/papers/${t.data.source}/`),
    ...products.flatMap((p) => [`/products/${p.data.id}/`, `/about/${p.data.id}/`, p.data.pdf]),
  ];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...new Set(routes)].map((r) => `  <url><loc>${new URL(r, base).href}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
