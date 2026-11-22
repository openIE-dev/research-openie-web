import type { APIRoute } from 'astro';
import { getExportedStudies } from '../../lib/markdownExport';

const BASE = 'https://research.openie.dev';

export const GET: APIRoute = async () => {
  const exported = await getExportedStudies();
  const card = {
    name: 'OpenIE Research',
    aliases: ['research.openie.dev', 'Open Interface Engineering Research'],
    version: '1.1.0',
    description:
      'Open-access research catalog, full-text Markdown twins, stamped PDFs, archival LaTeX sources, reproducibility digests, RCE language specification chapters, and interactive browser instruments from Open Interface Engineering, Inc.',
    documentationUrl: `${BASE}/llms.txt`,
    provider: {
      organization: 'Open Interface Engineering, Inc.',
      url: 'https://openie.dev',
    },
    capabilities: {
      extendedAgentCard: false,
      pushNotifications: false,
      streaming: false,
    },
    defaultInputModes: ['text/plain', 'application/json'],
    defaultOutputModes: ['text/markdown', 'application/json', 'text/html', 'application/pdf'],
    skills: [
      {
        id: 'discover_and_search_catalog',
        name: 'Search and browse all studies, sections, and keywords',
        description:
          'Fetch /catalog.json for the structured study index (including section anchors, keywords, revisions, and twin URLs), /llms.txt for a compact Markdown index, or /?q=<query> for interactive filtered search.',
        inputModes: ['text/plain'],
        outputModes: ['application/json', 'text/markdown', 'text/html'],
        tags: ['search', 'catalog', 'research', 'json', 'llms-txt'],
        examples: [
          `${BASE}/catalog.json`,
          `${BASE}/llms.txt`,
          `${BASE}/?q=deterministic+null`,
          `${BASE}/?q=LUT6`,
        ],
      },
      {
        id: 'read_fulltext_markdown',
        name: 'Read clean full-text Markdown of any paper or the entire corpus',
        description:
          'Every paper and white paper exposes a resolved zero-HTML Markdown twin at /papers/<id>.md or /products/<id>.md, and the full combined corpus is available at /llms-full.txt.',
        inputModes: ['text/plain'],
        outputModes: ['text/markdown', 'text/plain'],
        tags: ['markdown', 'papers', 'llms-full', 'rag', 'citations'],
        examples: [
          `${BASE}/papers/deterministic-null.md`,
          `${BASE}/papers/lut-adapt.md`,
          `${BASE}/papers/rce.md`,
          `${BASE}/products/mei.md`,
          `${BASE}/llms-full.txt`,
        ],
      },
      {
        id: 'interact_with_living_instruments',
        name: 'Drive interactive living figures via URL parameters or WebMCP tools',
        description:
          'Interactive instruments under /living/ accept URL query parameters for deterministic state deep-linking and expose browser WebMCP tools (document.modelContext) plus window.openieLivingLab methods.',
        inputModes: ['text/plain', 'application/json'],
        outputModes: ['text/html', 'application/json'],
        tags: ['interactive', 'living-figures', 'webmcp', 'simulators', 'wasm'],
        examples: [
          `${BASE}/living/deterministic-null/?track=exp002&T=600&hit=0.72`,
          `${BASE}/living/lut-adapt/?p0=0.75&dt=1500&model=lfm&arm=wake`,
          `${BASE}/living/fpga-sim/`,
          `${BASE}/rce/spec/`,
        ],
      },
      {
        id: 'verify_data_and_reproducibility',
        name: 'Inspect cryptographic pre-registrations, PDF stamps, and energy labels',
        description:
          'Read /data/ for repository paths, SHA-256 digests, OpenTimestamps and drand pre-registrations, and energy measurement class separation (est_j, reported_j, measured_j), and /pdfs/stamps.json for page-to-PDF hashes.',
        inputModes: ['text/plain'],
        outputModes: ['text/html', 'application/json'],
        tags: ['reproducibility', 'preregistration', 'drand', 'opentimestamps', 'energy'],
        examples: [
          `${BASE}/data/`,
          `${BASE}/data/#deterministic-null`,
          `${BASE}/pdfs/stamps.json`,
          `${BASE}/changelog/`,
        ],
      },
    ],
    supportedInterfaces: [
      { protocolBinding: 'https://llmstxt.org', protocolVersion: '1.0', url: `${BASE}/llms.txt` },
      { protocolBinding: 'https://llmstxt.org/full', protocolVersion: '1.0', url: `${BASE}/llms-full.txt` },
      { protocolBinding: 'https://schema.org/DataCatalog', protocolVersion: '1.1.0', url: `${BASE}/catalog.json` },
      { protocolBinding: 'https://webmachinelearning.github.io/webmcp', protocolVersion: 'draft', url: `${BASE}/webmcp-tools.js` },
      { protocolBinding: 'https://www.rfc-editor.org/rfc/rfc4287', protocolVersion: '1.0', url: `${BASE}/feed.xml` },
    ],
    studyCount: exported.length,
    studyIds: exported.map((s) => s.id),
  };

  return new Response(JSON.stringify(card, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
