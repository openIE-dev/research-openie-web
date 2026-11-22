import type { APIRoute } from 'astro';
import { getExportedStudies } from '../lib/markdownExport';

const BASE = 'https://research.openie.dev';

function escXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const exported = await getExportedStudies();
  const sorted = [...exported].sort((a, b) => b.revisionIso.localeCompare(a.revisionIso));
  const updated = sorted[0]?.revisionIso ?? '2026-11-22T00:00:00Z';

  const entries = sorted
    .map(
      (s) => `  <entry>
    <id>${escXml(s.url)}</id>
    <title>${escXml(s.title)}</title>
    <updated>${escXml(s.revisionIso)}</updated>
    <link rel="alternate" type="text/html" href="${escXml(s.url)}" />
    <link rel="alternate" type="text/markdown" href="${escXml(s.markdownUrl)}" />
    <link rel="related" type="application/pdf" href="${escXml(s.pdf)}" />
    <summary>${escXml(s.summary)}</summary>
${s.keywords.map((k) => `    <category term="${escXml(k)}" />`).join('\n')}
  </entry>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${BASE}/</id>
  <title>OpenIE Research</title>
  <subtitle>Open-access research papers, essays, white papers, and interactive figures from Open Interface Engineering, Inc.</subtitle>
  <updated>${escXml(updated)}</updated>
  <link rel="self" type="application/atom+xml" href="${BASE}/feed.xml" />
  <link rel="alternate" type="text/html" href="${BASE}/" />
${entries}
</feed>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
};
