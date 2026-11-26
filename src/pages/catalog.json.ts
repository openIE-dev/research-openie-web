import type { APIRoute } from 'astro';
import { getExportedStudies, getRceSpecChapters, LIVING_INSTRUMENTS } from '../lib/markdownExport';
import { LANGS } from '../i18n';

const BASE = 'https://research.openie.dev';

export const GET: APIRoute = async () => {
  const exported = await getExportedStudies();
  const payload = {
    schema_version: '1.1.0',
    site: `${BASE}/`,
    name: 'OpenIE Research',
    publisher: 'Open Interface Engineering, Inc.',
    endpoints: {
      catalog_html: `${BASE}/`,
      search_url_template: `${BASE}/?q={query}`,
      catalog_json: `${BASE}/catalog.json`,
      llms_txt: `${BASE}/llms.txt`,
      llms_full_txt: `${BASE}/llms-full.txt`,
      agent_card: `${BASE}/.well-known/agent-card.json`,
      webmcp_script: `${BASE}/webmcp-tools.js`,
      atom_feed: `${BASE}/feed.xml`,
      sitemap_xml: `${BASE}/sitemap.xml`,
      data_and_code: `${BASE}/data/`,
      changelog: `${BASE}/changelog/`,
      glossary: `${BASE}/glossary/`,
      faq: `${BASE}/faq/`,
      living_hub: `${BASE}/living/`,
      research_tv: `${BASE}/tv/`,
      research_radio: `${BASE}/radio/`,
      radio_podcast_rss: `${BASE}/radio/rss.xml`,
      planetary_blueprint: `${BASE}/blueprint/`,
      coverage_json: `${BASE}/coverage.json`,
      source_sheets: `${BASE}/sourcesheets/`,
      braille_transcripts: `${BASE}/transcripts/`,
      aac_concepts_json: `${BASE}/glossary/concepts.json`,
      interactive_tutorials: `${BASE}/tutorials/`,
      rce_spec: `${BASE}/rce/spec/`,
      rce_download: `${BASE}/rce/download/`,
    },
    languages: Object.entries(LANGS).map(([code, meta]) => ({ code, name: meta.name, dir: meta.dir })),
    studies: exported.map((s) => ({
      id: s.id,
      title: s.title,
      short_title: s.short_title,
      kind: s.kind,
      group: s.group,
      revision: s.revisionHash,
      revision_date: s.revisionDate,
      url: s.url,
      markdown_url: s.markdownUrl,
      pdf: s.pdf,
      latex_pdf: s.latexPdfUrl,
      latex_tex: s.latexTexUrl,
      figures_url: s.figuresUrl,
      about: s.about,
      data_url: s.dataUrl,
      summary: s.summary,
      keywords: s.keywords,
      sections: s.headings.map((h) => ({
        depth: h.depth,
        slug: h.slug,
        text: h.text,
        url: `${s.url}#${h.slug}`,
      })),
    })),
    living_instruments: LIVING_INSTRUMENTS,
    rce_spec_chapters: getRceSpecChapters(),
  };

  return new Response(JSON.stringify(payload, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
