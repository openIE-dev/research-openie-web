// Generated from src/data/studies.json and src/i18n.ts. Do not list studies or languages by hand.
import type { APIRoute } from 'astro';
import { studies, groupLabel, groupOrder } from '../data/studyList';
import { LANGS } from '../i18n';

export const GET: APIRoute = () => {
  const sections = groupOrder.map((g) =>
    `## ${groupLabel(g)}\n\n` +
    studies.filter((s) => s.group === g).map((s) => `- [${s.title}](${s.url}): ${s.summary} [PDF](${s.pdf})`).join('\n'),
  ).join('\n\n');
  const langs = Object.entries(LANGS).map(([k, v]) => `${k} (${v.name})`).join(', ');
  const body = `# OpenIE Research

> Research by David Charlot at Open Interface Engineering, Inc., published free so that anyone can read, reproduce and reuse it. Each paper stands alone, defines its own terms, and opens with three plain-language points. Energy figures are labeled as estimates, operating-system or on-chip readings, or external-meter measurements.

${sections}

## Earlier addresses

- /papers/ni/ and /papers/mol/ open the matching part of [Metered Commit Gates](https://research.openie.dev/papers/gates/), with section anchors. /papers/mei/ and /papers/jouleos/ open the white papers under /products/.

## Reference

- [Glossary](https://research.openie.dev/glossary/): Terms used on the site. Each paper also defines its own terms.
- [About the papers](https://research.openie.dev/about/): One page per paper on what it claims and what it does not.
- [Figures](https://research.openie.dev/living/): Interactive figures for the papers.
- [RCE Playground](https://openie-dev.github.io/rce/): the reference checker (checker-wasm) in the browser: write, check and run RCE programs, with the specification examples and shareable links.
- [RCE engine demo](https://research.openie.dev/demos/rce-engine/): Browser-only demo running the RCE core compiled to WebAssembly, with no server and no model calls. Layers cover code, the state machine view, proof replay, interface checks, compounding, energy estimates, held-out results and translation to Rust, Python, XState and SCXML.

## Optional

- [OpenIE](https://openie.dev/): Open Interface Engineering, Inc., publisher of this site.

## Translations

Papers have translated editions, marked as translations of the English version, which prevails. Pages with only a translated title and abstract say so and link the English full text. URL pattern: https://research.openie.dev/<lang>/papers/<slug>/ with lang in ${langs}. Example: https://research.openie.dev/ja/papers/rce/
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
