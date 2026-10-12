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
      "summary": "Defines an agent as a system that holds a goal under an energy budget, derives physical bounds on how fast it can act per second and per joule, and reads intelligence as progress per joule on a completed run. Plain words: to count as an agent, a system must aim at a goal, act, and stay within an energy budget; physics sets a minimum energy cost for every decision; among systems that finish a job correctly, the one that used less energy ranks higher.",
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
      "summary": "A gate that lets a machine act only after a check passes, and a cascade that tries the cheapest method first, with software results and one board-level energy reading (11,428 pJ per gate cycle, whole module, KV260). Plain words: do not take an action that cannot be undone until a check says it is safe; try the cheapest way first; write every decision down with its energy.",
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
      "kind": "Economics paper",
      "path": "/papers/satiation/",
      "pdf_path": "/pdfs/satiation.pdf",
      "about_path": "/about/satiation/",
      "summary": "Defines the stop at which more machine work on a finished task adds nothing, and separates it from growth in total demand. Plain words: every job has a finish line; cheaper work can still create more jobs; AI prices fall but its electricity is never free.",
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
      "id": "rce",
      "title": "The Reality Code Engine: One Lossless Form for Native, Verified, Low-Energy Programming",
      "short_title": "The Reality Code Engine",
      "kind": "Research paper",
      "path": "/papers/rce/",
      "pdf_path": "/pdfs/rce.pdf",
      "about_path": "/about/rce/",
      "playground_path": "/playground/rce/",
      "summary": "A system in which a program is written once as a state machine and code in other languages is generated from it, with measurements on 10,000 Forms and public bug datasets and falsifiers fixed in advance. Plain words: write a program once and generate it in many languages; reject broken input at the door; save checked fixes so the same problem is not paid for twice.",
      "keywords": [
        "Reality Code Engine",
        "RCE",
        "program form and fit",
        "Abstract State Machine",
        "e-graph",
        "formal verification",
        "Kani",
        "Z3",
        "program repair",
        "Mixture of Limits",
        "joules per solved task"
      ]
    },
    {
      "id": "three-body",
      "title": "The Pursuit of AGI Resolves the Three-Body Problem in Computing",
      "short_title": "The Three-Body Problem in Computing",
      "kind": "Research paper",
      "path": "/papers/three-body/",
      "pdf_path": "/pdfs/three-body.pdf",
      "about_path": "/about/three-body/",
      "summary": "Locates many computing failures at handoffs between the people who specify, build and use systems, states when checking every handoff assumption makes a stack stable, and supports it with independently tested verified systems (CompCert, seL4, TLA+ at AWS, unit types). Plain words: most big failures happen at handoffs; the cause is usually an unwritten guess; if every guess is written down and machine-checked, a fix stays fixed.",
      "keywords": [
        "three-body problem",
        "interfaces",
        "interface assumptions",
        "systems integration",
        "Conway's thesis",
        "information hiding",
        "end-to-end argument",
        "AGI",
        "Reality Code Engine"
      ]
    },
    {
      "id": "spellcheck",
      "title": "Spell Check is Global: The Future of Computer Intelligence in the Hands of the Many (7B+), Not the Few",
      "short_title": "Spell Check is Global",
      "kind": "History essay",
      "path": "/papers/spellcheck/",
      "pdf_path": "/pdfs/spellcheck.pdf",
      "about_path": "/about/spellcheck/",
      "summary": "Documents with dated prices how spell check went from a premium product to a free built-in feature, and explains it by marginal cost and bundling. Plain words: spell check used to cost a lot and is now free; it became free because it costs almost nothing to run and is most useful inside tools people have; other computer skills can follow.",
      "keywords": [
        "spell check",
        "history of computing",
        "bundling",
        "global access",
        "economics of AI"
      ]
    },
    {
      "id": "ai-coding-market",
      "title": "The Promised Trillion Dollar AI-Coding Market",
      "short_title": "The Promised Trillion Dollar AI-Coding Market",
      "kind": "Economics essay",
      "path": "/papers/ai-coding-market/",
      "pdf_path": "/pdfs/ai-coding-market.pdf",
      "about_path": "/about/ai-coding-market/",
      "summary": "Lists who projects a trillion-dollar AI coding market, labels each number by kind, and names the shared assumptions about energy, tokens and reuse, with testable propositions. Plain words: the big numbers are mostly forecasts; they assume a large model is paid for every piece of code forever; reuse would lower the cost of repeated work toward the cost of electricity.",
      "keywords": [
        "economics of AI",
        "AI coding",
        "one-direction assumption",
        "marginal cost",
        "pricing",
        "code reuse",
        "Mixture of Limits"
      ]
    },
    {
      "id": "interface-economics",
      "title": "The Price of the Unexamined Interface",
      "short_title": "The Price of the Unexamined Interface",
      "kind": "Economics essay",
      "path": "/papers/interface-economics/",
      "pdf_path": "/pdfs/interface-economics.pdf",
      "about_path": "/about/interface-economics/",
      "summary": "Published costs of failures at handoffs, labeled as accounted costs, model estimates or survey estimates and never added into one total. Plain words: some handoff failures have exact price tags; national totals are estimates; checking assumptions is cheap but the one who does it pays while everyone benefits.",
      "keywords": [
        "economics of interfaces",
        "integration failure",
        "technical debt",
        "interoperability",
        "standards economics",
        "cost of poor software quality",
        "Mars Climate Orbiter",
        "Ariane 501"
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
      "summary": "Computer intelligence designed to run inside a fixed energy budget, with emulator and datasheet results on a cold-chain sensor tag and a protocol test of a grid-following data center. Plain words: give a computer a fixed energy budget and design it for the best answer inside it; a food sensor tag can then run about eight years on a coin battery; a data center can cut power when the grid asks without giving wrong answers.",
      "keywords": [
        "Metabolic Intelligence",
        "energy budget",
        "edge AI",
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
      "summary": "A review of how operating systems, instruction sets and agent sandboxes are composed today, and checkable requirements for a machine that schedules, meters and refuses an agent under an energy budget. Plain words: AI agents are added on top of old layers; none of them checks energy before an agent acts; a machine for agents should measure energy, budget it, and refuse what breaks the budget.",
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
        description: 'Paper id. agency is Thermodynamic Bounds and an Optimal Tempo for Goal-Holding Agents, gates is Metered Commit Gates, satiation is Task Satiation vs. Aggregate Rebound in AI Demand, rce is The Reality Code Engine research paper, three-body is The Pursuit of AGI Resolves the Three-Body Problem in Computing, interface-economics is its economics companion essay, The Price of the Unexamined Interface, ai-coding-market is its economics companion essay, The Promised Trillion Dollar AI-Coding Market, spellcheck is the Spell Check is Global essay, mei and jouleos are product white papers.'
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
