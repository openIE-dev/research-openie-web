// Serves /webmcp-tools.js. The base tool catalog lives in src/data/webmcp-tools.template.js;
// study metadata, living instruments, Canonical Blueprint WAI1 artifacts, W3C SKOS AAC concepts,
// and the Universal AI Agent Bus bridge to The Commons (scholar.askdavidc.ai) are injected here.
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { getExportedStudies, LIVING_INSTRUMENTS } from '../lib/markdownExport';

function readJsonIfExists(relPath: string): any {
  const full = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(full)) return null;
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

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

  const unsiloeing = readJsonIfExists('src/data/planetary-unsiloeing.json') || {};
  const aacDoc = readJsonIfExists('public/glossary/concepts.json') || {};
  const radioFeed = readJsonIfExists('src/data/radio-feed.json') || {};

  const blueprintPack = {
    url: 'https://research.openie.dev/blueprint/',
    schema: unsiloeing.schema || 'openie.planetary_unsiloeing.v1',
    blueprint_artifact: unsiloeing.blueprint_artifact || null,
    summary_metrics: unsiloeing.summary_metrics || {},
    ecosystem_surfaces: unsiloeing.ecosystem_surfaces || [],
    gate_thresholds: (unsiloeing.gate_specification && unsiloeing.gate_specification.thresholds) || {},
    tier1_languages: (unsiloeing.tier1_languages || []).map((l: any) => ({
      code: l.code,
      name: l.name,
      native: l.native,
      speakers_m: l.speakers_m,
    })),
    canonical_artifacts: (unsiloeing.canonical_artifacts || []).map((a: any) => ({
      slug: a.slug,
      canonical_id: a.canonical_id,
      title: a.title,
      difficulty_rung: a.difficulty_rung,
      energy_cost_j: a.energy_cost_j,
      verification_status: a.verification_status,
      license: a.license,
      modality_variants: a.modality_variants,
      interchange_envelope: a.interchange_envelope,
    })),
    radio_wai_envelopes: ((radioFeed && radioFeed.episodes) || []).map((ep: any) => ({
      id: ep.id,
      number: ep.number,
      title: ep.title,
      canonical_id: ep.canonical_id || null,
      audio_url: ep.audio_url,
      wai_envelope_url: ep.wai_envelope_url || `/media/radio/wai/${ep.id}.wai`,
      wai_content_blake3: ep.wai_content_blake3 || null,
      commons_citation_url: ep.commons_citation_url || null,
    })),
    wai_receipts_url: radioFeed.wai_receipts_url || '/media/radio/wai/receipts.json',
    wai_merkle_root_blake3: radioFeed.wai_merkle_root_blake3 || null,
  };

  const aacConcepts = ((aacDoc && aacDoc.hasDefinedTerm) || []).map((c: any) => ({
    id: c.id,
    canonical_id: c.canonical_id,
    prefLabel: c.prefLabel,
    plainDefinition: c.plainDefinition,
    plainWordCount: c.plainWordCount,
    easyReadSentences: c.easyReadSentences || [],
    symbolHint: c.symbolHint || {},
    relatedStudies: c.relatedStudies || [],
    url: c['@id'] || 'https://research.openie.dev/glossary/',
  }));

  let body = tpl.replace('/*STUDIES*/[]', JSON.stringify(list, null, 2));
  if (body === tpl) throw new Error('webmcp template has no /*STUDIES*/ marker');
  body = body.replace('/*LIVING*/[]', JSON.stringify(LIVING_INSTRUMENTS, null, 2));

  const busBridgeJs = `
// Universal AI Agent Bus Bridge: Canonical Blueprint WAI1 Artifacts, SKOS AAC Concepts & The Commons
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var COMMONS_BASE = 'https://scholar.askdavidc.ai';
  var COMMONS_MCP = COMMONS_BASE + '/mcp';
  var COMMONS_ASK = COMMONS_BASE + '/api/ask';
  var COMMONS_PRIOR_ART = COMMONS_BASE + '/api/prior-art';
  var BLUEPRINT_PACK = ${JSON.stringify(blueprintPack)};
  var AAC_CONCEPTS = ${JSON.stringify(aacConcepts)};

  function getBlueprintArtifacts(input) {
    var slug = input && input.slug ? String(input.slug).trim().toLowerCase() : '';
    var includeRadio = !input || input.include_radio_wai !== false;
    var arts = BLUEPRINT_PACK.canonical_artifacts || [];
    if (slug) {
      arts = arts.filter(function (a) {
        return a.slug.toLowerCase() === slug || String(a.canonical_id || '').toLowerCase().indexOf(slug) !== -1 || a.title.toLowerCase().indexOf(slug) !== -1;
      });
    }
    return {
      blueprint_url: BLUEPRINT_PACK.url,
      schema: 'openie-artifact-v1',
      blueprint_artifact: BLUEPRINT_PACK.blueprint_artifact,
      summary_metrics: BLUEPRINT_PACK.summary_metrics,
      gate_thresholds: BLUEPRINT_PACK.gate_thresholds,
      tier1_languages: BLUEPRINT_PACK.tier1_languages,
      ecosystem_surfaces: BLUEPRINT_PACK.ecosystem_surfaces,
      canonical_artifacts: arts,
      radio_wai_receipts_url: 'https://research.openie.dev' + BLUEPRINT_PACK.wai_receipts_url,
      radio_wai_merkle_root_blake3: BLUEPRINT_PACK.wai_merkle_root_blake3,
      radio_wai_envelopes: includeRadio ? BLUEPRINT_PACK.radio_wai_envelopes : [],
      universal_agent_bus: {
        commons_mcp_url: COMMONS_MCP,
        commons_ask_url: COMMONS_ASK,
        commons_prior_art_url: COMMONS_PRIOR_ART,
        research_agent_card: 'https://research.openie.dev/.well-known/agent-card.json',
        aac_skos_url: 'https://research.openie.dev/glossary/concepts.json',
        easy_read_guide_url: 'https://research.openie.dev/media/tv/accessibility/easy-read-index.html'
      }
    };
  }

  function lookupAacConcept(input) {
    var q = String((input && input.query) || '').toLowerCase().trim();
    if (!q) {
      return {
        source_url: 'https://research.openie.dev/glossary/concepts.json',
        license: 'CC0-1.0',
        wcag_conformance: 'WCAG 2.2 Level AA',
        concept_count: AAC_CONCEPTS.length,
        concepts: AAC_CONCEPTS
      };
    }
    var terms = q.split(/[^a-z0-9-]+/).filter(function (t) { return t.length > 1; });
    var scored = [];
    AAC_CONCEPTS.forEach(function (c) {
      var core = ((c.symbolHint && c.symbolHint.aacCoreWords) || []).join(' ');
      var hay = (c.id + ' ' + c.prefLabel + ' ' + c.plainDefinition + ' ' + (c.easyReadSentences || []).join(' ') + ' ' + core + ' ' + ((c.symbolHint && c.symbolHint.arasaacKeyword) || '')).toLowerCase();
      var score = 0;
      if (c.prefLabel.toLowerCase() === q || c.id.toLowerCase() === 'concept:' + q) score += 10;
      else if (c.prefLabel.toLowerCase().indexOf(q) !== -1) score += 6;
      terms.forEach(function (t) {
        if (c.prefLabel.toLowerCase().indexOf(t) !== -1) score += 3;
        else if (hay.indexOf(t) !== -1) score += 1;
      });
      if (score > 0) scored.push({ score: score, concept: c });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    return {
      query: q,
      source_url: 'https://research.openie.dev/glossary/concepts.json',
      license: 'CC0-1.0',
      matched_count: scored.length,
      results: scored.map(function (s) { return s.concept; })
    };
  }

  function queryCommonsPriorArt(input) {
    var q = String((input && input.query) || '').trim().slice(0, 512);
    var mode = (input && input.mode === 'prior_art') ? 'prior_art' : 'ask';
    var top = Math.max(1, Math.min(25, Number((input && input.top) || 8)));
    var busMeta = {
      commons_url: COMMONS_BASE,
      mcp_endpoint: COMMONS_MCP,
      rest_ask_endpoint: COMMONS_ASK,
      rest_prior_art_endpoint: COMMONS_PRIOR_ART,
      mcp_jsonrpc_example: {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: mode === 'prior_art' ? 'commons_prior_art' : 'commons_ask',
          arguments: mode === 'prior_art' ? { query: q, n: top } : { query: q, top: top }
        }
      }
    };
    if (!q) {
      return Promise.resolve({ error: 'query is required', agent_bus: busMeta });
    }
    var targetUrl = mode === 'prior_art'
      ? (COMMONS_PRIOR_ART + '?q=' + encodeURIComponent(q) + '&n=' + top)
      : (COMMONS_ASK + '?q=' + encodeURIComponent(q) + '&top=' + top);
    return fetch(targetUrl, { headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        return {
          query: q,
          mode: mode,
          agent_bus: busMeta,
          commons_response: data
        };
      })
      .catch(function (err) {
        return {
          query: q,
          mode: mode,
          note: 'Cross-origin fetch restricted in this browser context; connect directly via MCP POST ' + COMMONS_MCP + ' or GET ' + targetUrl,
          error: String((err && err.message) || err),
          agent_bus: busMeta
        };
      });
  }

  if (window.openieResearchCatalog) {
    window.openieResearchCatalog.endpoints.blueprint = 'https://research.openie.dev/blueprint/';
    window.openieResearchCatalog.endpoints.aac_concepts_json = 'https://research.openie.dev/glossary/concepts.json';
    window.openieResearchCatalog.endpoints.radio_wai_receipts = 'https://research.openie.dev' + BLUEPRINT_PACK.wai_receipts_url;
    window.openieResearchCatalog.endpoints.commons_mcp = COMMONS_MCP;
    window.openieResearchCatalog.endpoints.commons_ask = COMMONS_ASK;
    window.openieResearchCatalog.endpoints.commons_prior_art = COMMONS_PRIOR_ART;
    window.openieResearchCatalog.blueprint = BLUEPRINT_PACK;
    window.openieResearchCatalog.aac_concepts = AAC_CONCEPTS;
    window.openieResearchCatalog.getBlueprintArtifacts = getBlueprintArtifacts;
    window.openieResearchCatalog.lookupAacConcept = lookupAacConcept;
    window.openieResearchCatalog.queryCommonsPriorArt = queryCommonsPriorArt;
  }

  if (!window.isSecureContext) return;
  var mc = document.modelContext || navigator.modelContext;
  if (!mc || typeof mc.registerTool !== 'function') return;
  if (window.__openieAgentBusWebmcpRegistered) return;
  window.__openieAgentBusWebmcpRegistered = true;

  var READ_ONLY = { readOnlyHint: true };
  var busTools = [
    {
      name: 'openie_get_blueprint_artifacts',
      title: 'Get Canonical Blueprint WAI1 Artifacts & 50-Language Dissemination Matrix',
      description: 'Returns the OpenIE Canonical Artifact Substrate (openie-artifact-v1), WAI1 binary envelope digests (Research TV & all 16 Research Radio .wai envelopes), Tier-1 20-language + Tier-2 30-language neural verification metrics, WCAG 2.2 AA accessibility links, and Universal AI Agent Bus endpoints. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          slug: { type: 'string', maxLength: 120, description: 'Optional artifact slug or keyword filter (omit to list all flagship canonical artifacts).' },
          include_radio_wai: { type: 'boolean', description: 'Include all 16 Research Radio WAI1 binary envelope URLs and BLAKE3 digests (default true).' }
        },
        additionalProperties: false
      },
      execute: function (input) {
        return getBlueprintArtifacts(input || {});
      },
      annotations: READ_ONLY
    },
    {
      name: 'openie_lookup_aac_concept',
      title: 'Look up W3C SKOS & Schema.org AAC Plain-Language Concepts',
      description: 'Searches all 36 CC0-1.0 W3C SKOS DefinedTerm concepts (/glossary/concepts.json) designed for screen readers, switch users, and Augmentative and Alternative Communication (AAC) devices, returning <=16-word plain definitions, Easy-Read sentences, and ARASAAC symbol hints. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', maxLength: 120, description: 'Concept label, core switch word, or topic to search (omit or empty string to return all 36 SKOS AAC concepts).' }
        },
        additionalProperties: false
      },
      execute: function (input) {
        return lookupAacConcept(input || {});
      },
      annotations: READ_ONLY
    },
    {
      name: 'openie_query_commons_prior_art',
      title: 'Query The Commons (scholar.askdavidc.ai) Prior Art & Universal AI Agent Bus',
      description: 'Queries live https://scholar.askdavidc.ai/api/ask or /api/prior-art (and returns exact MCP JSON-RPC descriptors for POST https://scholar.askdavidc.ai/mcp commons_prior_art / commons_ask) across 1,991 CC0 hardware disclosures (Humanoid, Phone, Wearable, eVTOL), Research TV, Research Radio, and open literature with seekable citations and JCR-1 COSE_Sign1 provenance. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 512, description: 'Plain-language claim, mechanism, or research continuation to check against The Commons prior art.' },
          mode: { type: 'string', enum: ['ask', 'prior_art'], description: 'Use "prior_art" for chronological public-disclosure priority search or "ask" (default) for cross-modal Adaptive-RAG.' },
          top: { type: 'integer', minimum: 1, maximum: 25, description: 'Maximum number of grounded disclosures or hits to return (default 8).' }
        },
        required: ['query'],
        additionalProperties: false
      },
      execute: function (input) {
        return queryCommonsPriorArt(input || {});
      },
      annotations: READ_ONLY
    }
  ];

  var controller = typeof AbortController === 'function' ? new AbortController() : null;
  busTools.forEach(function (tool) {
    try {
      var opts = controller ? { signal: controller.signal } : undefined;
      Promise.resolve(mc.registerTool(tool, opts)).catch(function (err) {
        if (window.console) console.warn('[openie agent-bus webmcp] ' + tool.name + ' not registered:', err && err.name);
      });
    } catch (err) {
      if (window.console) console.warn('[openie agent-bus webmcp] ' + tool.name + ' not registered:', err && err.name);
    }
  });
})();
`;

  return new Response(body + '\n' + busBridgeJs, {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
  });
};
