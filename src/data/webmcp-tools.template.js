/*
 * research.openie.dev WebMCP tools (draft, read-only).
 *
 * WebMCP lets a page hand an AI agent named tools instead of making it scrape.
 * Spec: https://webmachinelearning.github.io/webmcp (Draft Community Group Report).
 *
 * Progressive enhancement. If the browser has no model context API, this file does nothing.
 * Current spec and Chrome 150+ expose it as document.modelContext. Earlier Chromium builds
 * used navigator.modelContext, now deprecated, so both are checked.
 *
 * Every tool is read-only. It searches a static index of the catalog that ships in this file
 * and returns text and URLs. No network request, no navigation, no form, no visitor data.
 *
 * STUDIES is filled in at build time from src/data/studies.json by src/pages/webmcp-tools.js.ts.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!window.isSecureContext) return;
  var mc = document.modelContext || navigator.modelContext;
  if (!mc || typeof mc.registerTool !== 'function') return;
  if (window.__openieResearchWebmcpRegistered) return;
  window.__openieResearchWebmcpRegistered = true;

  var BASE = 'https://research.openie.dev';
  var READ_ONLY = { readOnlyHint: true };
  var AUTHOR = 'David Charlot, Open Interface Engineering';

  var STUDIES = /*STUDIES*/[];

  STUDIES.forEach(function (s) {
    s.author = AUTHOR;
    s.url = BASE + s.path;
    s.pdf = BASE + s.pdf_path;
    s.about = BASE + s.about_path;
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
    return { id: s.id, title: s.title, kind: s.kind, url: s.url, pdf: s.pdf };
  }

  var tools = [
    {
      name: 'list_studies',
      title: 'List research studies',
      description: 'Lists every study in the OpenIE research catalog with id, title, kind, web URL, and PDF URL. Read-only.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        return { catalog: BASE + '/', glossary: BASE + '/glossary/', studies: STUDIES.map(card) };
      },
      annotations: READ_ONLY
    },
    {
      name: 'get_study_summary',
      title: 'Summarize a study',
      description: 'Returns a plain-language summary of one OpenIE study, with its author, kind, web URL, PDF URL, and about page. Read-only.',
      inputSchema: ID_INPUT,
      execute: function (input) {
        var s = find(input && input.id);
        if (!s) return notFound(input && input.id);
        return { id: s.id, title: s.title, author: s.author, kind: s.kind, summary: s.summary, url: s.url, pdf: s.pdf, about: s.about };
      },
      annotations: READ_ONLY
    },
    {
      name: 'get_study_url',
      title: 'Get a study web URL',
      description: 'Returns the web URL of one OpenIE study. Returns the link only and does not navigate. Read-only.',
      inputSchema: ID_INPUT,
      execute: function (input) {
        var s = find(input && input.id);
        if (!s) return notFound(input && input.id);
        return { id: s.id, title: s.title, url: s.url };
      },
      annotations: READ_ONLY
    },
    {
      name: 'get_pdf_url',
      title: 'Get a study PDF URL',
      description: 'Returns the PDF download URL of one OpenIE study. Returns the link only and does not download or navigate. Read-only.',
      inputSchema: ID_INPUT,
      execute: function (input) {
        var s = find(input && input.id);
        if (!s) return notFound(input && input.id);
        return { id: s.id, title: s.title, pdf: s.pdf };
      },
      annotations: READ_ONLY
    },
    {
      name: 'search_studies',
      title: 'Search research studies',
      description: 'Searches the titles, summaries, and keywords of the OpenIE research catalog for a word or phrase, such as energy, agency, or refusal. Returns matching studies ranked by match count. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 200, description: 'Words to look for, for example "joules per decision" or "refusal".' }
        },
        required: ['query'],
        additionalProperties: false
      },
      execute: function (input) {
        var q = String((input && input.query) || '').toLowerCase().slice(0, 200);
        var terms = q.split(/[^a-z0-9]+/).filter(function (t) { return t.length > 1; });
        if (!terms.length) return { query: q, results: [] };
        var results = [];
        STUDIES.forEach(function (s) {
          var hay = (s.title + ' ' + s.short_title + ' ' + s.summary + ' ' + s.keywords.join(' ')).toLowerCase();
          var score = 0;
          terms.forEach(function (t) { if (hay.indexOf(t) !== -1) score += 1; });
          if (hay.indexOf(q) !== -1) score += terms.length;
          if (score > 0) {
            var r = card(s);
            r.summary = s.summary;
            r.score = score;
            results.push(r);
          }
        });
        results.sort(function (a, b) { return b.score - a.score; });
        return { query: q, results: results };
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
