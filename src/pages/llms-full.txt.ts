import type { APIRoute } from 'astro';
import { getExportedStudies, getRceSpecChapters, LIVING_INSTRUMENTS } from '../lib/markdownExport';

export const GET: APIRoute = async () => {
  const exported = await getExportedStudies();
  const specChapters = getRceSpecChapters();

  const header = `# OpenIE Research — Full Corpus (llms-full.txt)

> Research by David Charlot at Open Interface Engineering, Inc., published free so that anyone can read, reproduce and reuse it.
> Compact index: https://research.openie.dev/llms.txt
> Structured JSON catalog: https://research.openie.dev/catalog.json
> Agent card: https://research.openie.dev/.well-known/agent-card.json
> Atom feed: https://research.openie.dev/feed.xml
> Data and reproducibility digests: https://research.openie.dev/data/
> Glossary: https://research.openie.dev/glossary/

## Table of Included Studies (${exported.length})

${exported.map((s, i) => `${i + 1}. **${s.title}** (\`${s.id}\`, revision \`${s.revisionHash}\`, ${s.revisionDate}) — Web: ${s.url} · Markdown: ${s.markdownUrl} · PDF: ${s.pdf}`).join('\n')}

## Interactive Living Instruments (/living/)

${LIVING_INSTRUMENTS.map((inst) => `- **${inst.title}**: ${inst.url} — ${inst.description} Controls: ${inst.controls.join('; ')}.`).join('\n')}

## RCE Specification Chapters (/rce/spec/)

${specChapters.map((c) => `- [${c.title}](${c.url})`).join('\n')}

================================================================================
`;

  const fullCorpus = exported
    .map((s) => `\n<!-- BEGIN STUDY: ${s.id} -->\n${s.markdownDocument}\n<!-- END STUDY: ${s.id} -->\n`)
    .join('\n================================================================================\n');

  return new Response(header + fullCorpus, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
