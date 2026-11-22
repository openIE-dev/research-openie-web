/*
 * research.openie.dev WebMCP & Agent Discovery Tools.
 *
 * WebMCP lets a page hand an AI agent named tools instead of making it scrape.
 * Spec: https://webmachinelearning.github.io/webmcp (Draft Community Group Report).
 *
 * Progressive enhancement:
 * - Exposes window.openieResearchCatalog for direct DOM / Playwright / browser-agent scripts.
 * - Registers named tools on document.modelContext / navigator.modelContext when available.
 *
 * STUDIES and LIVING are filled in at build time by src/pages/webmcp-tools.js.ts.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var BASE = 'https://research.openie.dev';
  var READ_ONLY = { readOnlyHint: true };
  var AUTHOR = 'David Charlot, Open Interface Engineering';

  var STUDIES = /*STUDIES*/[];
  var LIVING = /*LIVING*/[];

  STUDIES.forEach(function (s) {
    s.author = AUTHOR;
    s.url = BASE + s.path;
    s.markdown = BASE + s.markdown_path;
    s.pdf = BASE + s.pdf_path;
    s.about = BASE + s.about_path;
    var fp = s.figures_path || '/living/';
    s.figures = fp.indexOf('http') === 0 ? fp : BASE + fp;
    s.data_url = BASE + '/data/#' + s.id;
  });

  var IDS = STUDIES.map(function (s) { return s.id; });
  var ID_INPUT = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        enum: IDS,
        description: 'Study id, one of the ids returned by list_studies.'
      }
    },
    required: ['id'],
    additionalProperties: false
  };

  function find(id) {
    var key = String(id || '').trim().toLowerCase();
    var OLD = { ni: 'gates', mol: 'gates' };
    if (OLD[key]) key = OLD[key];
    for (var i = 0; i < STUDIES.length; i++) {
      var s = STUDIES[i];
      if (s.id === key || s.short_title.toLowerCase() === key || s.title.toLowerCase() === key) return s;
    }
    return null;
  }

  function notFound(id) {
    return { error: 'Unknown study id: ' + String(id) + '. Valid ids: ' + IDS.join(', ') + '.' };
  }

  function card(s) {
    return {
      id: s.id,
      title: s.title,
      kind: s.kind,
      group: s.group,
      revision: s.revision,
      url: s.url,
      markdown: s.markdown,
      pdf: s.pdf,
      latex_pdf: s.latex_pdf || null,
      figures: s.figures,
      about: s.about,
      data_url: s.data_url
    };
  }

  function searchCatalog(queryStr) {
    var q = String(queryStr || '').toLowerCase().trim().slice(0, 200);
    var terms = q.split(/[^a-z0-9_+.-]+/).filter(function (t) { return t.length > 1; });
    if (!terms.length) return { query: q, results: [] };
    var results = [];
    STUDIES.forEach(function (s) {
      var secText = (s.sections || []).map(function (sec) { return sec.text; }).join(' ');
      var hay = (s.id + ' ' + s.title + ' ' + s.short_title + ' ' + s.summary + ' ' + s.keywords.join(' ') + ' ' + secText).toLowerCase();
      var score = 0;
      terms.forEach(function (t) {
        if (s.id.toLowerCase().indexOf(t) !== -1 || s.title.toLowerCase().indexOf(t) !== -1) score += 3;
        else if (hay.indexOf(t) !== -1) score += 1;
      });
      if (hay.indexOf(q) !== -1) score += terms.length * 2;
      if (score > 0) {
        var matchedSections = (s.sections || []).filter(function (sec) {
          var st = sec.text.toLowerCase();
          return st.indexOf(q) !== -1 || terms.some(function (t) { return st.indexOf(t) !== -1; });
        }).slice(0, 6).map(function (sec) {
          return { text: sec.text, url: s.url + '#' + sec.slug };
        });
        var r = card(s);
        r.summary = s.summary;
        r.matching_sections = matchedSections;
        r.score = score;
        results.push(r);
      }
    });
    results.sort(function (a, b) { return b.score - a.score; });
    return { query: q, results: results };
  }

  function readStudyMarkdown(id, sectionQuery) {
    var s = find(id);
    if (!s) return Promise.resolve(notFound(id));
    return fetch(s.markdown_path, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (md) {
        if (!sectionQuery) {
          return { id: s.id, title: s.title, markdown_url: s.markdown, length_chars: md.length, content: md };
        }
        var sq = String(sectionQuery).toLowerCase().trim();
        var blocks = md.split(/\n(?=##\s+)/);
        var hits = blocks.filter(function (b) { return b.toLowerCase().indexOf(sq) !== -1; });
        return {
          id: s.id,
          title: s.title,
          markdown_url: s.markdown,
          section_query: sectionQuery,
          matched_blocks: hits.length,
          content: hits.length ? hits.join('\n\n---\n\n') : md.slice(0, 6000)
        };
      })
      .catch(function (err) {
        return { error: 'Could not fetch ' + s.markdown + ': ' + String(err && err.message || err) };
      });
  }

  // Expose synchronous/Promise JS helper on window for Playwright, CDP, and browser-use agents
  window.openieResearchCatalog = {
    endpoints: {
      llms_txt: BASE + '/llms.txt',
      llms_full_txt: BASE + '/llms-full.txt',
      catalog_json: BASE + '/catalog.json',
      agent_card: BASE + '/.well-known/agent-card.json',
      feed_xml: BASE + '/feed.xml'
    },
    studies: STUDIES,
    living_instruments: LIVING,
    search: searchCatalog,
    find: find,
    readMarkdown: readStudyMarkdown
  };

  if (!window.isSecureContext) return;
  var mc = document.modelContext || navigator.modelContext;
  if (!mc || typeof mc.registerTool !== 'function') return;
  if (window.__openieResearchWebmcpRegistered) return;
  window.__openieResearchWebmcpRegistered = true;

  var tools = [
    {
      name: 'list_studies',
      title: 'List research studies',
      description: 'Lists every study in the OpenIE research catalog with id, title, kind, revision, web URL, clean Markdown URL, PDF URL, interactive figures URL, and data digest URL. Read-only.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        return {
          catalog: BASE + '/',
          llms_txt: BASE + '/llms.txt',
          llms_full_txt: BASE + '/llms-full.txt',
          catalog_json: BASE + '/catalog.json',
          glossary: BASE + '/glossary/',
          data: BASE + '/data/',
          studies: STUDIES.map(card)
        };
      },
      annotations: READ_ONLY
    },
    {
      name: 'get_study_summary',
      title: 'Summarize a study and list its sections',
      description: 'Returns the summary, keywords, section table of contents (with #anchor links), web URL, Markdown URL, PDF URL, interactive figures URL, and about page of one OpenIE study. Read-only.',
      inputSchema: ID_INPUT,
      execute: function (input) {
        var s = find(input && input.id);
        if (!s) return notFound(input && input.id);
        return {
          id: s.id,
          title: s.title,
          author: s.author,
          kind: s.kind,
          revision: s.revision,
          revision_date: s.revision_date,
          summary: s.summary,
          keywords: s.keywords,
          url: s.url,
          markdown: s.markdown,
          pdf: s.pdf,
          latex_pdf: s.latex_pdf || null,
          figures: s.figures,
          about: s.about,
          data_url: s.data_url,
          sections: (s.sections || []).map(function (sec) {
            return { depth: sec.depth, text: sec.text, url: s.url + '#' + sec.slug };
          })
        };
      },
      annotations: READ_ONLY
    },
    {
      name: 'read_study_markdown',
      title: 'Read full Markdown or a specific section of a study',
      description: 'Fetches the clean, resolved Markdown twin (/papers/<id>.md or /products/<id>.md) of an OpenIE study, optionally filtered to sections matching a query phrase. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', enum: IDS, description: 'Study id from list_studies.' },
          section: { type: 'string', maxLength: 120, description: 'Optional heading or topic keyword to filter sections (omit for full paper Markdown).' }
        },
        required: ['id'],
        additionalProperties: false
      },
      execute: function (input) {
        return readStudyMarkdown(input && input.id, input && input.section);
      },
      annotations: READ_ONLY
    },
    {
      name: 'get_study_url',
      title: 'Get a study web URL',
      description: 'Returns the web URL and clean Markdown URL of one OpenIE study. Read-only.',
      inputSchema: ID_INPUT,
      execute: function (input) {
        var s = find(input && input.id);
        if (!s) return notFound(input && input.id);
        return { id: s.id, title: s.title, url: s.url, markdown: s.markdown };
      },
      annotations: READ_ONLY
    },
    {
      name: 'get_pdf_url',
      title: 'Get a study PDF URL',
      description: 'Returns the stamped PDF download URL (and archival LaTeX PDF URL when present) of one OpenIE study. Read-only.',
      inputSchema: ID_INPUT,
      execute: function (input) {
        var s = find(input && input.id);
        if (!s) return notFound(input && input.id);
        return { id: s.id, title: s.title, pdf: s.pdf, latex_pdf: s.latex_pdf || null };
      },
      annotations: READ_ONLY
    },
    {
      name: 'search_studies',
      title: 'Search research studies and paper sections',
      description: 'Searches titles, summaries, keywords, and section headings across the OpenIE research catalog, returning ranked studies and deep-links to matching sections. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 200, description: 'Words to look for, e.g. "deterministic null", "Good-Turing", "LUT6", "drand", or "joules".' }
        },
        required: ['query'],
        additionalProperties: false
      },
      execute: function (input) {
        return searchCatalog(input && input.query);
      },
      annotations: READ_ONLY
    },
    {
      name: 'list_living_figures',
      title: 'List interactive living figures and simulators',
      description: 'Lists all interactive instruments under /living/ with their URLs, associated paper ids, and controllable parameters. Read-only.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        return { hub: BASE + '/living/', instruments: LIVING };
      },
      annotations: READ_ONLY
    },
    {
      name: 'filter_catalog_ui',
      title: 'Filter the visible catalog on the home page',
      description: 'When on the catalog home page (/), updates the live search input and group filter in the page UI and returns the visible study count.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', maxLength: 200, description: 'Search query to apply to the catalog UI (empty string clears search).' },
          group: { type: 'string', enum: ['all', 'research', 'essay', 'product', 'living'], description: 'Optional category filter.' }
        },
        additionalProperties: false
      },
      execute: function (input) {
        if (typeof window.__openieApplyCatalogFilter === 'function') {
          return window.__openieApplyCatalogFilter((input && input.query) || '', (input && input.group) || 'all');
        }
        return { note: 'Not currently on the catalog home page (/). Use search_studies or navigate to ' + BASE + '/?q=' + encodeURIComponent((input && input.query) || '') };
      },
      annotations: READ_ONLY
    }
  ];

  var controller = typeof AbortController === 'function' ? new AbortController() : null;
  tools.forEach(function (tool) {
    try {
      var opts = controller ? { signal: controller.signal } : undefined;
      Promise.resolve(mc.registerTool(tool, opts)).catch(function (err) {
        if (window.console) console.warn('[openie research webmcp] ' + tool.name + ' not registered:', err && err.name);
      });
    } catch (err) {
      if (window.console) console.warn('[openie research webmcp] ' + tool.name + ' not registered:', err && err.name);
    }
  });
})();
