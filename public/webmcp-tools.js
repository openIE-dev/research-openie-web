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
 * Keep STUDIES in step with src/content/papers/*.md and src/content/products/*.md frontmatter. The patch plan offers a
 * build-time variant that generates this index from the content collection instead.
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

  var STUDIES = [
    {
      "id": "agency",
      "title": "Thermodynamic Bounds and an Optimal Tempo for Goal-Holding Agents",
      "short_title": "Thermodynamic Bounds and an Optimal Tempo",
      "kind": "Research paper",
      "path": "/papers/agency/",
      "pdf_path": "/pdfs/agency.pdf",
      "about_path": "/about/agency/",
      "summary": "The proposed Universal Law of Agency, stated as a definition plus a gate. Agency comes first: a prediction fixed before the act, coupling to the world through intervention, consequence borne, and a joule budget with refusal on a receipt. Kinematic bounds say how fast agency moves per second and per joule. Intelligence is the derivative of agency in joules, read in hindsight off a completed run. Prediction 1 gives an optimal act time for an agent that holds a goal, with a lab protocol to test it. Energy to run is the only true metric of computer intelligence.",
      "keywords": [
        "Universal Law of Agency",
        "agency",
        "kinematic bounds",
        "optimal tempo",
        "intelligence as a derivative",
        "thermodynamics of computation",
        "joules",
        "Landauer",
        "experiment"
      ]
    },
    {
      "id": "gates",
      "title": "Metered Commit Gates: Energy-to-Correct-Completion for Agentic Systems",
      "short_title": "Metered Commit Gates",
      "kind": "Research paper",
      "path": "/papers/gates/",
      "pdf_path": "/pdfs/gates.pdf",
      "about_path": "/about/gates/",
      "summary": "Notational Intelligence and Mixture of Limits in one systems paper. A proposal may not authorize itself: an irreversible act runs only behind a certificate, and every decision is written to a receipt. The cheapest sufficient gear runs first, Lookup, then Formula, then Solver, then Model, and the cascade stops when the task completion predicate holds. Systems are ranked by the joules needed to reach a correct completion. A KV260 board reading gives 11,428 pJ per gate cycle at board level.",
      "keywords": [
        "commit gate",
        "energy to correct completion",
        "Notational Intelligence",
        "Mixture of Limits",
        "cascade",
        "receipts",
        "refusal",
        "Wise Computer Automation",
        "KV260"
      ]
    },
    {
      "id": "satiation",
      "title": "Task Satiation vs. Aggregate Rebound in AI Demand",
      "short_title": "Task Satiation vs. Aggregate Rebound",
      "kind": "Research paper",
      "path": "/papers/satiation/",
      "pdf_path": "/pdfs/satiation.pdf",
      "about_path": "/about/satiation/",
      "summary": "Task-level satiation holds by definition once a task completion predicate is true: more synthesis on that task buys nothing. Aggregate demand can still grow, because cheaper synthesis opens new tasks and raises total use. The paper separates the two, states hypotheses H1 (spend after completion) and H2 (Jevons in tasks), and gives the data design that would identify them. Capability scales. Appetite per task does not.",
      "keywords": [
        "satiation",
        "task completion",
        "rebound",
        "Jevons",
        "inference pricing",
        "economics of AI"
      ]
    },
    {
      "id": "spellcheck",
      "title": "Spell Check is Global : The Future of Computer Intelligence in the hands of the many (7B+) and not the few (under 500M)",
      "short_title": "Spell Check is Global",
      "kind": "History essay",
      "path": "/papers/spellcheck/",
      "pdf_path": "/pdfs/spellcheck.pdf",
      "about_path": "/about/spellcheck/",
      "summary": "People used to pay a premium for spell check. Now it is free and bundled into the editor, the browser, and the phone. A history of that path, from dated prices to the local library in every editor. Technology built for global access reaches more than 7 billion people. Scarcity pricing keeps a capability with fewer than 500 million. Energy to run is what remains.",
      "keywords": [
        "spell check",
        "history of computing",
        "bundling",
        "global access",
        "economics of AI"
      ]
    },
    {
      "id": "mei",
      "title": "Metabolic Intelligence: Budget-Native Compute from Tag to Campus",
      "short_title": "Metabolic Intelligence",
      "kind": "Product white paper",
      "path": "/products/mei/",
      "pdf_path": "/pdfs/mei.pdf",
      "about_path": "/products/mei/",
      "summary": "Metabolic Intelligence is the AI product. A fixed energy budget is the physical condition of the best answer. Work that would break the budget is refused or deferred. It spans coin-cell tags at the edge to a resource-optimized central datacenter and runs on any compute fabric. Klere (klere.ai) is the hardware that builds the Energy Processing Unit (EPU).",
      "keywords": [
        "Metabolic Intelligence",
        "energy budget",
        "edge AI",
        "Klere",
        "Energy Processing Unit"
      ]
    },
    {
      "id": "jouleos",
      "title": "The Search for JouleOS",
      "short_title": "The Search for JouleOS",
      "kind": "Product white paper (review and design guide)",
      "path": "/products/jouleos/",
      "pdf_path": "/pdfs/jouleos.pdf",
      "about_path": "/products/jouleos/",
      "summary": "A review of how secure compute is composed today and a design guide for what a machine must speak if an agent is to be scheduled, metered, and refused. It places the energy-as-resource operating systems that came before, names what they lack, and describes JouleOS: one intent stream lowered onto the coordinate the runtime measured.",
      "keywords": [
        "JouleOS",
        "secure compute",
        "WebAssembly",
        "energy metering",
        "operating systems"
      ]
    }
  ];

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
        description: 'Paper id. agency is Thermodynamic Bounds and an Optimal Tempo for Goal-Holding Agents, gates is Metered Commit Gates, satiation is Task Satiation vs. Aggregate Rebound in AI Demand, spellcheck is the Spell Check is Global essay, mei and jouleos are product white papers.'
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
      description: 'Lists every study in the OpenIE research catalog with id, title, kind (research paper, history essay, or product white paper), web URL, and PDF URL. Read-only.',
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
      description: 'Searches the titles, summaries, and keywords of the OpenIE research catalog for a word or phrase, such as energy, agency, Klere, or refusal. Returns matching studies ranked by match count. Read-only.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', minLength: 1, maxLength: 200, description: 'Words to look for, for example "joules per decision" or "Klere".' }
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
