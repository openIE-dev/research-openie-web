// Serves /webmcp-tools.js. The tool code lives in src/data/webmcp-tools.template.js; the study
// index, section headings, and living instrument manifest are injected here at build time.
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { getExportedStudies, LIVING_INSTRUMENTS } from '../lib/markdownExport';

export const GET: APIRoute = async () => {
  const tpl = fs.readFileSync(path.resolve(process.cwd(), 'src/data/webmcp-tools.template.js'), 'utf8');
  const exported = await getExportedStudies();
  const list = exported.map((s) => ({
    id: s.id,
    title: s.title,
    short_title: s.short_title,
    kind: s.kind,
    group: s.group,
    revision: s.revisionHash,
    revision_date: s.revisionDate,
    path: s.path,
    markdown_path: s.markdownPath,
    pdf_path: s.pdfPath,
    latex_pdf: s.latexPdfUrl,
    figures_path: s.figures,
    about_path: s.aboutPath,
    summary: s.summary,
    keywords: s.keywords,
    sections: s.headings.map((h) => ({ slug: h.slug, text: h.text, depth: h.depth })),
  }));
  let body = tpl.replace('/*STUDIES*/[]', JSON.stringify(list, null, 2));
  if (body === tpl) throw new Error('webmcp template has no /*STUDIES*/ marker');
  body = body.replace('/*LIVING*/[]', JSON.stringify(LIVING_INSTRUMENTS, null, 2));
  return new Response(body, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
};
