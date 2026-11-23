// Generated from src/lib/markdownExport.ts and src/i18n.ts. Do not list studies or languages by hand.
import type { APIRoute } from 'astro';
import { groupLabel, groupOrder } from '../data/studyList';
import { getExportedStudies, getRceSpecChapters, LIVING_INSTRUMENTS } from '../lib/markdownExport';
import { LANGS } from '../i18n';

export const GET: APIRoute = async () => {
  const exported = await getExportedStudies();
  const specChapters = getRceSpecChapters();
  const sections = groupOrder
    .map(
      (g) =>
        `## ${groupLabel(g)}\n\n` +
        exported
          .filter((s) => s.group === g)
          .map((s) => {
            const extras = [
              `[Markdown](${s.markdownUrl})`,
              `[PDF](${s.pdf})`,
              ...(s.latexPdfUrl ? [`[LaTeX PDF](${s.latexPdfUrl})`] : []),
              `[Figures](${s.figuresUrl})`,
              `[About](${s.about})`,
            ].join(' · ');
            return `- [${s.title}](${s.url}): ${s.summary} (${extras})`;
          })
          .join('\n'),
    )
    .join('\n\n');
  const langs = Object.entries(LANGS)
    .map(([k, v]) => `${k} (${v.name})`)
    .join(', ');
  const body = `# OpenIE Research

> Research by David Charlot at Open Interface Engineering, Inc., published free so that anyone can read, reproduce and reuse it. Each paper stands alone, defines its own terms, and opens with three plain-language points. Energy figures are labeled as estimates, operating-system or on-chip readings, or external-meter measurements.

## Machine-Readable Endpoints for Agents and Search

- [Full Corpus Text (llms-full.txt)](https://research.openie.dev/llms-full.txt): Complete resolved Markdown text of all ${exported.length} studies on this site in one file.
- [Structured Catalog JSON](https://research.openie.dev/catalog.json): Machine-readable index of all studies, section anchors, keywords, revisions, RCE spec chapters, and interactive instruments.
- [A2A Agent Card](https://research.openie.dev/.well-known/agent-card.json): Agent capabilities, skills, and protocol bindings (llms.txt, JSON catalog, WebMCP, Atom).
- [Atom Feed](https://research.openie.dev/feed.xml): Syndication feed of published studies and revisions.
- [OpenIE Research TV](https://research.openie.dev/tv/): 84 snackable research films (${exported.length} studies x 4 depth tiers: 5s, 30s, 60s, and 90s) with synchronized WebVTT captions and Schema.org VideoObject metadata.
- [OpenIE Research Radio](https://research.openie.dev/radio/): Multi-voice conversational research radio, active open-access literature radar, autonomous topic idea foundry with deterministic pilot receipts, and [Podcast RSS 2.0 Feed](https://research.openie.dev/radio/rss.xml).
- [Interactive Tutorials Hub](https://research.openie.dev/tutorials/): 10 guided multi-step interactive simulations (Predict -> Break -> Repair -> Verify) with chromeless embed support (\`?embed=1&lab=<id>\`).
- [Interactive Search](https://research.openie.dev/?q=deterministic+null): Filterable web catalog supporting \`?q=<query>\` and \`?group=<research|essay|product|living>\`.

${sections}

## Interactive Living Instruments (/living/)

${LIVING_INSTRUMENTS.map((i) => `- [${i.title}](${i.url}): ${i.description} URL-controllable parameters: ${i.controls.join('; ')}.`).join('\n')}

## RCE Language Specification & Toolchain (/rce/)

- [RCE Download & Releases](https://research.openie.dev/rce/download/): Prebuilt checker binaries and archives.
${specChapters.map((c) => `- [${c.title}](${c.url})`).join('\n')}

## Earlier addresses

- /papers/ni/ and /papers/mol/ open the matching part of [Metered Commit Gates](https://research.openie.dev/papers/gates/), with section anchors. /papers/mei/ and /papers/jouleos/ open the white papers under /products/.

## Reference

- [Data and code](https://research.openie.dev/data/): Reproducibility paths, SHA-256 digests, OpenTimestamps and drand pre-registrations, and energy labels (\`est_j\`, \`reported_j\`, \`measured_j\`).
- [Changelog](https://research.openie.dev/changelog/): Dated record of published studies and revisions.
- [Glossary](https://research.openie.dev/glossary/): Terms used on the site. Each paper also defines its own terms.
- [RCE FAQ](https://research.openie.dev/faq/): what the Reality Code Engine is, why it is needed now, what is built, proposed and measured, how energy is labelled, and ten hard questions, each with its current answer and falsifier. Every number is cited.
- [About the papers](https://research.openie.dev/about/): One page per paper on what it claims and what it does not.
- [Opportunity Map](https://research.openie.dev/opportunity-map/): Interface-by-interface stack overview.
- [Figures](https://research.openie.dev/living/): Interactive figures for the papers.
- [RCE Playground](https://openie-dev.github.io/rce/): the reference checker (checker-wasm) in the browser: write, check and run RCE programs, with the specification examples and shareable links.

## Optional

- [OpenIE](https://openie.dev/): Open Interface Engineering, Inc., publisher of this site.

## Translations

Papers have translated editions, marked as translations of the English version, which prevails. Pages with only a translated title and abstract say so and link the English full text. URL pattern: https://research.openie.dev/<lang>/papers/<slug>/ with lang in ${langs}. Example: https://research.openie.dev/ja/papers/rce/
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
