import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import syndicationCatalog from '../../data/syndication-catalog.json';

const SITE = 'https://research.openie.dev';

function escXml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function inlineMdToHtml(text: string): string {
  let out = escXml(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)/g,
    (_m, label, url) => {
      const full = String(url).startsWith('/') ? `${SITE}${url}` : String(url);
      return `<a href="${full}">${label}</a>`;
    }
  );
  return out;
}

function markdownToMediumHtml(md: string, canonicalUrl: string): string {
  const lines = md.split('\n');
  const blocks: string[] = [];
  let inList: 'ol' | 'ul' | null = null;

  const closeList = () => {
    if (inList) {
      blocks.push(`</${inList}>`);
      inList = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('<!--')) {
      closeList();
      continue;
    }
    if (line.startsWith('# ')) {
      closeList();
      continue;
    }
    if (line.startsWith('## ')) {
      closeList();
      blocks.push(`<h2>${inlineMdToHtml(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      closeList();
      blocks.push(`<h3>${inlineMdToHtml(line.slice(4))}</h3>`);
      continue;
    }
    if (line === '---') {
      closeList();
      blocks.push('<hr />');
      continue;
    }
    if (line.startsWith('![')) {
      closeList();
      const m = line.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (m) {
        blocks.push(
          `<figure><img src="${escXml(m[2])}" alt="${escXml(m[1])}" /><figcaption>${escXml(m[1])}</figcaption></figure>`
        );
      }
      continue;
    }
    if (line.startsWith('> ')) {
      closeList();
      blocks.push(`<blockquote><p>${inlineMdToHtml(line.slice(2))}</p></blockquote>`);
      continue;
    }
    const olMatch = line.match(/^\d+\.\s+(.*)$/);
    if (olMatch) {
      if (inList !== 'ol') {
        closeList();
        blocks.push('<ol>');
        inList = 'ol';
      }
      blocks.push(`<li>${inlineMdToHtml(olMatch[1])}</li>`);
      continue;
    }
    if (line.startsWith('- ')) {
      if (inList !== 'ul') {
        closeList();
        blocks.push('<ul>');
        inList = 'ul';
      }
      blocks.push(`<li>${inlineMdToHtml(line.slice(2))}</li>`);
      continue;
    }
    closeList();
    blocks.push(`<p>${inlineMdToHtml(line)}</p>`);
  }
  closeList();
  blocks.push(
    `<p><em>Originally published at <a href="${escXml(canonicalUrl)}">${escXml(canonicalUrl)}</a> (CC0-1.0 Public Domain).</em></p>`
  );
  return blocks.join('\n');
}

export const GET: APIRoute = async () => {
  const studies = (syndicationCatalog.studies ?? []) as any[];
  const pubDate = 'Tue, 24 Nov 2026 22:00:00 GMT';

  const itemsXml = studies
    .map((s) => {
      const mdPath = path.resolve(process.cwd(), 'public', 'syndication', 'medium', `${s.id}.md`);
      const mdRaw = fs.existsSync(mdPath) ? fs.readFileSync(mdPath, 'utf-8') : s.medium?.subtitle ?? '';
      const canonSource = s.medium?.canonical_source_url ?? `${SITE}${s.paper_url}`;
      const importPageUrl = `${SITE}/syndication/medium/${s.id}/`;
      const htmlBody = markdownToMediumHtml(mdRaw, canonSource);
      const cats = ((s.medium?.tags ?? ['open-science']) as string[])
        .map((t) => `      <category>${escXml(t)}</category>`)
        .join('\n');

      return `    <item>
      <title>${escXml(s.title)}</title>
      <link>${escXml(importPageUrl)}</link>
      <guid isPermaLink="true">${escXml(importPageUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>Open Interface Engineering</dc:creator>
      <atom:link rel="canonical" href="${escXml(canonSource)}" />
      <description>${escXml(s.medium?.subtitle ?? s.headline_metric)}</description>
${cats}
      <content:encoded><![CDATA[${htmlBody}]]></content:encoded>
    </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenIE Research — Canonical Medium &amp; Long-Form Syndication Feed</title>
    <link>${SITE}/syndication/</link>
    <atom:link href="${SITE}/feeds/medium.xml" rel="self" type="application/rss+xml" />
    <description>Public-domain (CC0-1.0) plain-language illustrated research essays synchronized bidirectionally between OpenIE Research, Medium, X (Twitter), and 9:16 TikTok snackable films.</description>
    <language>en-us</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <copyright>CC0-1.0 Public Domain Dedication (summaries &amp; essays)</copyright>
${itemsXml}
  </channel>
</rss>
`;

  return new Response(rss, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
