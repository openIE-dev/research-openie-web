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
> OpenIE Chronicle (57 entries): https://blog.openie.dev (index: https://blog.openie.dev/llms.txt · JSON: https://blog.openie.dev/live/blog-corpus.json · verification & replication: https://blog.openie.dev/verification/ · syndication: https://blog.openie.dev/syndication/ & https://blog.openie.dev/medium/<slug>/)
> Multimodal Live Voice, Vision & Co-Pilot: https://research.openie.dev/live/ · corpus: https://research.openie.dev/live/hmi-corpus.json · cross-origin SDK: https://research.openie.dev/live/openie-ecosystem-dock.js · broadcast co-pilots: https://research.openie.dev/tv/ , https://research.openie.dev/radio/ , https://research.openie.dev/syndication/medium/<slug>/ , https://research.openie.dev/living/<slug>/
> Epistemic & energy contract: Signed Provenance · Self-Checked (BLAKE3 + Ed25519; not external peer review) | measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered (strictly orthogonal, never summed across classes) | Clopper-Pearson binomial bounds
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
