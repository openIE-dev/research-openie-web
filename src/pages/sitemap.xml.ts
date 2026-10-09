// Draft for src/pages/sitemap.xml.ts. Derived from the content collection and the page files,
// so a new study appears here without a hand edit. No <lastmod>, matching the klere.ai rule.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const STATIC = ['/', '/about/', '/glossary/', '/living/'];

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://research.openie.dev');
  const papers = await getCollection('papers');
  const routes = [
    ...STATIC,
    ...papers.flatMap((p) => [`/papers/${p.data.id}/`, `/about/${p.data.id}/`, p.data.pdf]),
  ];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    [...new Set(routes)].map((r) => `  <url><loc>${new URL(r, base).href}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
