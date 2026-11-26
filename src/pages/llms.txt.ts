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
- [OpenIE Chronicle (57 Entries)](https://blog.openie.dev): Companion engineering and research chronicle with post-review scoping addenda, [Chronicle llms.txt](https://blog.openie.dev/llms.txt), [Chronicle JSON Corpus](https://blog.openie.dev/live/blog-corpus.json), [Verification, Licensing & Replication Scope](https://blog.openie.dev/verification/), [Chronicle Syndication](https://blog.openie.dev/syndication/), and canonical Medium projections (\`https://blog.openie.dev/medium/<slug>/\` and \`https://research.openie.dev/syndication/medium/<slug>/\`).
- [Sovereign Multimodal Live Voice, Video & Co-Pilot Studio](https://research.openie.dev/live/): Zero-paid-API in-browser voice, camera/screen vision, guided Co-Pilot, and Dual-Host Skeptic Debate grounded in [hmi-corpus.json](https://research.openie.dev/live/hmi-corpus.json), plus the cross-origin SDK [openie-ecosystem-dock.js](https://research.openie.dev/live/openie-ecosystem-dock.js) mounted across \`*.openie.dev\` and every \`/living/<slug>/\` observatory.
- [OpenIE Research TV](https://research.openie.dev/tv/): 140 plain-language research films (28 topics x 4 horizontal slots from 15s to 180s + 9:16 vertical cuts, 50-language 15s tracks, Extended Audio Description, Easy Read, and interactive Voice + Video film co-pilot).
- [OpenIE Research Radio](https://research.openie.dev/radio/): 17 multi-voice WAI1 broadcasts with live studio call-in and auto-ducking, active open-access literature radar, autonomous topic idea foundry, and [Podcast RSS 2.0 Feed](https://research.openie.dev/radio/rss.xml).
- [Syndication Studio (X, Medium & 9:16 Vertical)](https://research.openie.dev/syndication/): Thread packs, canonical Medium editions (\`/syndication/medium/<slug>/\`), and [Medium Canonical RSS](https://research.openie.dev/feeds/medium.xml).
- [Interactive Tutorials Hub](https://research.openie.dev/tutorials/): 13 guided multi-step interactive simulations (Predict -> Break -> Repair -> Verify) with chromeless embed support (\`?embed=1&lab=<id>\`).
- [Interactive Search](https://research.openie.dev/?q=deterministic+null): Filterable web catalog supporting \`?q=<query>\` and \`?group=<research|essay|product|living>\`.

## Post-Review Epistemic & Energy Honesty Contract

- **Provenance Status (\`Signed Provenance · Self-Checked\`)**: Artifacts carry BLAKE3 digests, Ed25519 publisher signatures, and automated non-mixing checks. All studies and Chronicle entries are self-checked by Open Interface Engineering, Inc. and have not yet undergone external journal peer review or independent outside-lab replication; see [Verification & Replication Kits](https://blog.openie.dev/verification/).
- **Orthogonal Energy Evidence Classes (\`measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered\`)**: Physical DC current-shunt readings (\`measured_j\`, such as TI INA260 on AMD Kria KV260 and TI INA3221/INA238 on NVIDIA Jetson AGX Thor), built-in chip/OS counters (\`reported_j\`, such as Apple \`ri_energy_nj\`, Linux RAPL, and NVML), analytical or datasheet models (\`est_j\`), and formal/archival works (\`unmetered\`, \`joules = null\`) are strictly orthogonal and never summed or directly ratioed across classes.
- **Statistical & Replication Reporting**: Proportions report exact Clopper–Pearson binomial confidence intervals alongside fired falsifiers and negative replications.

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
