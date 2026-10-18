// Serves /webmcp-tools.js. The tool code lives in src/data/webmcp-tools.template.js; the study
// index inside it is generated here from studies.json, so a new study needs no edit to the script.
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { studies } from '../data/studyList';

export const GET: APIRoute = () => {
  const tpl = fs.readFileSync(path.resolve(process.cwd(), 'src/data/webmcp-tools.template.js'), 'utf8');
  const list = studies.map((s) => ({
    id: s.id, title: s.title, short_title: s.short_title, kind: s.kind,
    path: s.path, pdf_path: s.pdfPath, about_path: s.aboutPath,
    summary: s.summary, keywords: s.keywords,
  }));
  const body = tpl.replace('/*STUDIES*/[]', JSON.stringify(list, null, 2));
  if (body === tpl) throw new Error('webmcp template has no /*STUDIES*/ marker');
  return new Response(body, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
};
