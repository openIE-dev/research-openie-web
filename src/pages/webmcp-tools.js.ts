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
  var BLOG_CORPUS_URL = 'https://blog.openie.dev/live/blog-corpus.json';
  var VERIFICATION_URL = 'https://blog.openie.dev/verification/';
  var ED25519_PUBKEY = '1fa743eb5abeae11d37f11d17c19b2744e3213fa0ba7ae69f624d8a3e5214110';
  var BLUEPRINT_PACK = ${JSON.stringify(blueprintPack)};
  var AAC_CONCEPTS = ${JSON.stringify(aacConcepts)};

  var REPLICATION_KITS = [
    {
      id: 'deterministic-null',
      title: 'Deterministic Null (Shape D Zero-Model Control Arm)',
      license: 'Apache-2.0',
      repo_url: 'https://github.com/openIE-dev/deterministic-null',
      runner_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate',
      paper_url: 'https://research.openie.dev/papers/deterministic-null/',
      chronicle_url: 'https://blog.openie.dev/posts/deterministic-null/',
      hardware_requirements: 'Commodity Linux or macOS (zero special hardware)',
      scope: 'Reproduces bit-identical BLAKE3 digests across Rust, C++20, Go, Julia, and Python Shape D N0/N1 implementations, checks OpenTimestamps and drand rounds 6663734/6664089 receipts, and evaluates 4,030 Track-A/Track-B instances plus 6 SWE-bench Verified repositories.'
    },
    {
      id: 'ai-reads-human',
      title: 'Text-vs-Binary Agent Wire Parsing (ai-reads-human)',
      license: 'Apache-2.0',
      repo_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate',
      runner_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate',
      paper_url: 'https://research.openie.dev/papers/ai-reads-human/',
      chronicle_url: 'https://blog.openie.dev/posts/ai-reads-human/',
      hardware_requirements: 'Commodity x86_64 or ARM64 Linux/macOS',
      scope: 'Reproduces 20,000-record UTF-8 JSON/Markdown vs typed binary WAI1, Protobuf, FlatBuffers, CapnProto, and simdjson parse + 5-tokenizer benchmarks, including the 109/170 shared-host IOReport drift rejection logs.'
    },
    {
      id: 'satb-harness',
      title: 'Satiation Benchmark (SATB) & Non-Mixing Provenance Harness',
      license: 'Apache-2.0',
      repo_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate',
      runner_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate',
      paper_url: 'https://research.openie.dev/papers/satb-harness/',
      chronicle_url: 'https://blog.openie.dev/posts/satb-harness/',
      hardware_requirements: 'Commodity x86_64 or ARM64 (Rust toolchain)',
      scope: 'Re-runs the 12/12 C1-C12 deterministic replay checks, 280x280 provenance-lattice non-mixing suite, Clopper-Pearson confidence bounds, and Kepler CPU-proportional attribution error checks (32.59%-89.88%).'
    },
    {
      id: 'littlebit-joule',
      title: 'Sub-Bit SVD + Walsh-Hadamard Decompression Impedance Benchmark (Shot #2 & Shot #6)',
      license: 'Apache-2.0',
      repo_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/cb5b6410ebd460f677ba7f57119b96554ab876c3/kits/littlebit-joule',
      runner_url: 'https://github.com/openIE-dev/openie-research-experiments/blob/cb5b6410ebd460f677ba7f57119b96554ab876c3/kits/littlebit-joule/run_kit.sh',
      observatory_url: 'https://research.openie.dev/living/compiled-agency/#ca-sim-01',
      paper_url: 'https://research.openie.dev/papers/lut-adapt/',
      chronicle_url: 'https://blog.openie.dev/posts/from-ephemeral-inference-to-compiled-agency/',
      hardware_requirements: 'Standard Linux/macOS C + Python (optional TI INA260/INA3221 sysfs shunts or Linux RAPL)',
      scope: 'Reproduces the 14-point bitwidth_curve (0.0000 bpw 4 KiB Deterministic Null LUT at 96.33% through 0.1517 bpw r=22 packed integer vs naive FP32 unpack to 8.00 bpw INT8) with Shot #6 KV260 INA260 (81.86x unpack penalty vs 4.13x gross / 5.15x net packed-int gain) and Jetson AGX Thor INA3221 (19.08x penalty vs 7.95x gain) measured_j receipts.'
    },
    {
      id: 'waios-mosaic-cascade',
      title: '6-Fabric / 10-Lane waiOS 256x128 Invariance & 75-Cell 4-Stage Cascade Kit (Shots #3, #5 & #6)',
      license: 'Apache-2.0',
      repo_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/cb5b6410ebd460f677ba7f57119b96554ab876c3/kits/waios-mosaic-cascade',
      runner_url: 'https://github.com/openIE-dev/openie-research-experiments/blob/cb5b6410ebd460f677ba7f57119b96554ab876c3/kits/waios-mosaic-cascade/run_kit.sh',
      observatory_url: 'https://research.openie.dev/living/compiled-agency/#ca-sim-02',
      paper_url: 'https://research.openie.dev/papers/lut-adapt/',
      chronicle_url: 'https://blog.openie.dev/posts/from-ephemeral-inference-to-compiled-agency/',
      hardware_requirements: 'Standard Linux/macOS pthreads C + Python (optional Vulkan GPU, Wasm, Icarus Verilog, qemu-riscv32, or TI INA260/INA3221/RAPL)',
      scope: 'Verifies 10-lane / 6-fabric waiOS 256x128 BLAKE3 == a541323b... across x86_64/ARMv9/Cortex-A53 CPU, Radeon 8060S gpu_vulkan_compute SPIR-V, hetero_cpu_gpu_split (0/20 cut disagreements), 1,041 B wasm32_simd128, 16x parallel Icarus Verilog RTL (0 multipliers, 2,048 cycles), and 1,444 B #![no_std] rv32imac_baremetal_mcu_elf in qemu-riscv32 (0 FPU ops), plus w[77,0] tamper -> 4ac7c4fb... halt and the 75-cell 4-stage cascade (26.58x KV260 INA260 & 16.26x Thor INA3221 measured_j).'
    },
    {
      id: 'deterministic-null-suite',
      title: '5-Arm Classical Automation Control Suite & External Adapter Harness (Shot #1)',
      license: 'Apache-2.0',
      repo_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/cb5b6410ebd460f677ba7f57119b96554ab876c3/kits/deterministic-null-suite',
      runner_url: 'https://github.com/openIE-dev/openie-research-experiments/blob/cb5b6410ebd460f677ba7f57119b96554ab876c3/kits/deterministic-null-suite/run_kit.sh',
      observatory_url: 'https://research.openie.dev/living/compiled-agency/#ca-sim-03',
      paper_url: 'https://research.openie.dev/papers/deterministic-null/',
      chronicle_url: 'https://blog.openie.dev/posts/from-ephemeral-inference-to-compiled-agency/',
      hardware_requirements: 'Standard Linux/macOS Python + C (optional --candidate-cmd or --openai-compatible-url)',
      scope: 'Runs all 5 classical control arms (arm1_lookup_table, arm2_if_else_guards [0.20 uJ KV260 / 0.037 uJ Thor], arm3_bounded_for_loop, arm4_decision_tree [0.37 uJ KV260 / 0.175 uJ Thor], arm5_compiled_solver_rules + shape_d_classical_best [85.80% @ 28.28 uJ KV260 F6 PASS / 13.34 uJ Thor F6 PASS]) vs candidate_dense_mlp_int16 (62.60%, +12.80 pp on open_compositional_patch_triage).'
    }
  ];

  function startStudioVoiceCall(input) {
    var allowedVoices = ['Aoede', 'Charon', 'Puck', 'Kore', 'Fenrir'];
    var rawVoice = input && input.voice ? String(input.voice).trim() : 'Aoede';
    var voice = allowedVoices.indexOf(rawVoice) !== -1 ? rawVoice : 'Aoede';
    var studyId = input && input.study_id ? String(input.study_id).trim() : '';
    if (studyId === 'from-ephemeral-inference-to-compiled-agency') studyId = 'agency';
    var prompt = input && input.prompt ? String(input.prompt).trim().slice(0, 500) : '';
    var detail = {
      studyId: studyId || undefined,
      voice: voice,
      prompt: prompt || undefined,
      autoStartCall: true
    };
    window.dispatchEvent(new CustomEvent('openie:live-open', { detail: detail }));
    return {
      status: 'dispatched',
      event: 'openie:live-open',
      engine: 'studio_s2s_24khz',
      voice: voice,
      study_id: studyId || null,
      prompt: prompt || null,
      auto_start_call: true,
      provenance_status: 'Signed Provenance · Self-Checked',
      studio_url: 'https://research.openie.dev/live/'
    };
  }

  function searchChronicle57(input) {
    var q = String((input && input.query) || '').toLowerCase().trim().slice(0, 240);
    var eraFilter = String((input && input.era) || 'all').toLowerCase().trim();
    var energyFilter = String((input && input.energy_class) || 'all').toLowerCase().trim();
    var limit = Math.max(1, Math.min(64, Number((input && input.limit) || 12)));
    var terms = q ? q.split(/[^a-z0-9_+.-]+/).filter(function (t) { return t.length > 1; }) : [];

    var loadPromise = window.__openieChronicle57Cache
      ? Promise.resolve(window.__openieChronicle57Cache)
      : fetch(BLOG_CORPUS_URL, { headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
          })
          .then(function (doc) {
            window.__openieChronicle57Cache = doc;
            return doc;
          });

    return loadPromise
      .then(function (doc) {
        var entries = (doc && doc.entries) || [];
        var scored = [];
        entries.forEach(function (e) {
          var slug = String(e.id || '').trim();
          var eraRaw = String(e.era || '');
          var eraNorm = eraRaw.indexOf('era-0') !== -1 || String(e.eraLabel || '').indexOf('Era 0') !== -1
            ? 'era0'
            : eraRaw.indexOf('era-1') !== -1 || String(e.eraLabel || '').indexOf('Era I ') !== -1
            ? 'era1'
            : 'era2';
          if (eraFilter !== 'all' && eraFilter !== eraNorm && eraRaw.toLowerCase().indexOf(eraFilter) === -1) return;
          if (energyFilter !== 'all' && String(e.energyClass || '').toLowerCase() !== energyFilter) return;

          var score = terms.length === 0 ? 1 : 0;
          if (terms.length > 0) {
            var hay = [
              slug,
              e.title || '',
              e.shortTitle || '',
              e.description || '',
              e.headlineMetric || '',
              e.primaryClaim || '',
              e.errataSummary || '',
              e.limitationsSummary || '',
              (e.tags || []).join(' ')
            ].join(' ').toLowerCase();
            if (slug.toLowerCase() === q) score += 20;
            if (hay.indexOf(q) !== -1) score += 8;
            terms.forEach(function (t) {
              if (slug.toLowerCase().indexOf(t) !== -1 || String(e.title || '').toLowerCase().indexOf(t) !== -1) score += 4;
              else if (hay.indexOf(t) !== -1) score += 1;
            });
          }
          if (score > 0) {
            var canonicalUrl = e.canonicalUrl || ('https://blog.openie.dev/posts/' + slug + '/');
            var caveats = [];
            if (e.errataSummary) caveats.push(String(e.errataSummary));
            if (e.limitationsSummary && caveats.indexOf(String(e.limitationsSummary)) === -1) {
              caveats.push(String(e.limitationsSummary));
            }
            scored.push({
              score: score,
              item: {
                id: slug,
                title: e.title,
                short_title: e.shortTitle || e.title,
                era: eraNorm,
                era_label: e.eraLabel || e.era,
                date: e.date || null,
                refreshed_date: e.refreshedDate || '2026-11-25',
                canonical_url: canonicalUrl,
                medium_import_url: 'https://blog.openie.dev/medium/' + slug + '/',
                energy_class: e.energyClass || 'unmetered',
                claim_tags: e.claimTags || [],
                headline_metric: e.headlineMetric || null,
                nov25_errata_and_caveats: caveats.join(' | ') || 'Signed Provenance · Self-Checked; not externally peer-reviewed.',
                addendum_url: e.addendumAnchor ? (canonicalUrl.replace(/#.*$/, '') + e.addendumAnchor) : null
              }
            });
          }
        });
        scored.sort(function (a, b) { return b.score - a.score; });
        return {
          query: q,
          source_url: BLOG_CORPUS_URL,
          syndication_hub_url: 'https://blog.openie.dev/syndication/',
          verification_url: VERIFICATION_URL,
          provenance_status: 'Signed Provenance · Self-Checked',
          orthogonality_rule: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
          total_chronicle_entries: entries.length,
          matched_count: scored.length,
          results: scored.slice(0, limit).map(function (s) { return s.item; })
        };
      })
      .catch(function (err) {
        return {
          query: q,
          source_url: BLOG_CORPUS_URL,
          error: 'Could not fetch ' + BLOG_CORPUS_URL + ': ' + String((err && err.message) || err)
        };
      });
  }

  function getReplicationKits(input) {
    var kitFilter = input && input.kit_id ? String(input.kit_id).trim().toLowerCase() : 'all';
    var kits = kitFilter && kitFilter !== 'all'
      ? REPLICATION_KITS.filter(function (k) { return k.id === kitFilter; })
      : REPLICATION_KITS;
    return {
      provenance_status: 'Signed Provenance · Self-Checked',
      ed25519_public_key: ED25519_PUBKEY,
      verification_url: VERIFICATION_URL,
      independent_replication_url: VERIFICATION_URL + '#independent-replication',
      orthogonality_rule: 'measured_j ⊥ reported_j ⊥ est_j ⊥ unmetered',
      one_command_runner: 'git clone https://github.com/openIE-dev/openie-research-experiments.git && cd openie-research-experiments && ./replicate/run_replication.sh && ./kits/deterministic-null-suite/run_kit.sh && ./kits/littlebit-joule/run_kit.sh && ./kits/waios-mosaic-cascade/run_kit.sh',
      replicate_tree_url: 'https://github.com/openIE-dev/openie-research-experiments/tree/main/replicate',
      latest_experiments_commit: 'cb5b6410ebd460f677ba7f57119b96554ab876c3',
      shot6_commit: '813eb9698ff179fd34d6877c5247bb2b9125ca86',
      compiled_agency_observatory_url: 'https://research.openie.dev/living/compiled-agency/',
      kit_count: kits.length,
      kits: kits
    };
  }

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
    window.openieResearchCatalog.endpoints.chronicle_57_corpus = BLOG_CORPUS_URL;
    window.openieResearchCatalog.endpoints.chronicle_syndication_hub = 'https://blog.openie.dev/syndication/';
    window.openieResearchCatalog.endpoints.verification = VERIFICATION_URL;
    window.openieResearchCatalog.ed25519_public_key = ED25519_PUBKEY;
    window.openieResearchCatalog.blueprint = BLUEPRINT_PACK;
    window.openieResearchCatalog.aac_concepts = AAC_CONCEPTS;
    window.openieResearchCatalog.replication_kits = REPLICATION_KITS;
    window.openieResearchCatalog.getBlueprintArtifacts = getBlueprintArtifacts;
    window.openieResearchCatalog.lookupAacConcept = lookupAacConcept;
    window.openieResearchCatalog.queryCommonsPriorArt = queryCommonsPriorArt;
    window.openieResearchCatalog.startStudioVoiceCall = startStudioVoiceCall;
    window.openieResearchCatalog.searchChronicle57 = searchChronicle57;
    window.openieResearchCatalog.getReplicationKits = getReplicationKits;
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
    },
    {
      name: 'openie_start_studio_voice_call',
      title: 'Start OpenIE 24 kHz Studio Native S2S Voice & Vision Call',
      description: 'Opens the full-duplex 24 kHz Studio Native Speech-to-Speech voice and vision co-pilot on the current page or observatory via the openie:live-open event, optionally targeting a study_id, one of the 5 studio voices (Aoede, Charon, Puck, Kore, Fenrir), and a starter prompt.',
      inputSchema: {
        type: 'object',
        properties: {
          study_id: { type: 'string', maxLength: 80, description: 'Optional OpenIE study slug (e.g. "deterministic-null", "rce-compile", "ai-reads-human").' },
          voice: { type: 'string', enum: ['Aoede', 'Charon', 'Puck', 'Kore', 'Fenrir'], description: 'Optional 24 kHz studio voice persona (default "Aoede").' },
          prompt: { type: 'string', maxLength: 500, description: 'Optional spoken or grounded question to ask immediately once connected.' }
        },
        additionalProperties: false
      },
      execute: function (input) {
        return startStudioVoiceCall(input || {});
      }
    },
    {
      name: 'openie_search_chronicle_57',
      title: 'Search All 58 Era 0 / Era I / Era II OpenIE Chronicle Entries',
      description: 'Fetches and searches https://blog.openie.dev/live/blog-corpus.json across all 58 Chronicle entries (20 Era 0 whitepapers + 9 Era I founding essays + 28 Era II studies + Capstone Compiled Agency synthesis), returning title, era, canonical URL (https://blog.openie.dev/posts/<slug>/), clean Medium importer URL, energy evidence class, and November 25, 2026 errata/caveats. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', maxLength: 240, description: 'Keyword, slug, metric, or topic to search across all 58 entries (omit or empty string to list entries).' },
          era: { type: 'string', enum: ['all', 'era0', 'era1', 'era2'], description: 'Optional era filter: era0 (20 whitepapers), era1 (9 founding essays), era2 (28 Nov 2026 studies + capstone), or all.' },
          energy_class: { type: 'string', enum: ['all', 'measured_j', 'reported_j', 'est_j', 'unmetered'], description: 'Optional orthogonal energy class filter.' },
          limit: { type: 'integer', minimum: 1, maximum: 64, description: 'Maximum entries to return (default 12).' }
        },
        additionalProperties: false
      },
      execute: function (input) {
        return searchChronicle57(input || {});
      },
      annotations: READ_ONLY
    },
    {
      name: 'openie_get_replication_kits',
      title: 'Get Standalone Apache-2.0 External Replication Kits (6 Kits @ cb5b641) & Ed25519 Key',
      description: 'Returns all 6 standalone Apache-2.0 external replication kits (replicate/ suites deterministic-null, ai-reads-human, satb-harness plus kits/deterministic-null-suite, kits/littlebit-joule, and 6-fabric kits/waios-mosaic-cascade @ cb5b641 / 813eb96 with Thor INA3221 & KV260 INA260 measured_j), https://research.openie.dev/living/compiled-agency/, the OpenIE Ed25519 publisher public key (1fa743eb5abeae11d37f11d17c19b2744e3213fa0ba7ae69f624d8a3e5214110), and https://blog.openie.dev/verification/. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          kit_id: { type: 'string', enum: ['all', 'ai-reads-human', 'deterministic-null', 'satb-harness', 'deterministic-null-suite', 'littlebit-joule', 'waios-mosaic-cascade'], description: 'Optional kit filter (default "all").' }
        },
        additionalProperties: false
      },
      execute: function (input) {
        return getReplicationKits(input || {});
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
