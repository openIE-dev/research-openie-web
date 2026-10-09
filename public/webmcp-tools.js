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
 * Keep STUDIES in step with src/content/papers/*.md frontmatter. The patch plan offers a
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
      id: 'mol',
      title: 'Mixture of Limits: Navigation Law for Computer Intelligence',
      short_title: 'Mixture of Limits',
      kind: 'Research study',
      summary: 'Mixture of Limits is the philosophy. It names floors past which more tokens, parameters, or joules stop buying verifiable progress on a task. Compression into predictive formulas beats excess enumeration. The neural network is a residual leaf, off by default. The reference path runs in software, and its energy figures are labeled estimates.',
      keywords: ['mixture of limits', 'floors', 'value of information', 'VoI', 'Landauer', 'compression', 'navigation law', 'cheapest sufficient', 'soft-ref']
    },
    {
      id: 'ni',
      title: 'Notational Intelligence as Commit Law',
      short_title: 'Notational Intelligence',
      kind: 'Research study',
      summary: 'Notational Intelligence treats permission to act as a formal object. A proposal may not authorize itself. The software reference, Wise Computer Automation (WCA), commits or refuses at irreversible actions and records each decision under a fixed schema. Energy is analytical accounting, not board power.',
      keywords: ['notational intelligence', 'commit law', 'refuse', 'certificate', 'receipt', 'Wise Computer Automation', 'WCA', 'irreversible action', 'MCP gate', 'FPGA simulation']
    },
    {
      id: 'satiation',
      title: 'Satiation and Scarcity after Free AI',
      short_title: 'Satiation',
      kind: 'Research study',
      summary: 'Satiation defines when a loop of work or care is done. Once a stated completeness test holds, further calls add no value, and calls that undo it are harm. Falling inference prices do not mean free energy, free actuation, or unbounded value after a chore is complete.',
      keywords: ['satiation', 'scarcity', 'bliss point', 'free AI', 'completeness', 'design to done', 'inference price']
    },
    {
      id: 'mei',
      title: 'Metabolic Intelligence: Budget-Native Compute from Tag to Campus',
      short_title: 'Metabolic Intelligence',
      kind: 'Research study',
      summary: 'Metabolic Intelligence is the AI product class. A fixed energy budget is the physical condition of the best answer, not a cheaper one. Work that would break the budget is refused or deferred. It spans coin-cell tags at the edge to a resource-optimized central datacenter. It runs on any compute fabric, and its product home is Klere (klere.ai), the maker of the Energy Processing Unit (EPU).',
      keywords: ['metabolic intelligence', 'MEI', 'Klere', 'EPU', 'energy processing unit', 'budget-native', 'edge', 'tags', 'digital enzymes', 'datacenter', 'OpenADR', 'joule envelope']
    },
    {
      id: 'jouleos',
      title: 'The Search for JouleOS',
      short_title: 'The Search for JouleOS',
      kind: 'Research study (review and design guide)',
      summary: 'Existing compute fabric treats the floor as fixed, and agents are wrapped on top of it. Energy to run is not yet the condition of a commit. Secure compute requires one law, one meter, and one refusal. That requirement is the search for a design like JouleOS, built on one intent stream and a WebAssembly runtime.',
      keywords: ['JouleOS', 'operating system', 'secure compute', 'WebAssembly', 'Wasm', 'meter', 'refusal', 'kernel', 'design guide']
    },
    {
      id: 'spellcheck',
      title: 'Spell Check is Global : The Future of Computer Intelligence in the hands of the many (7B+) and not the few (under 500M)',
      short_title: 'Spell Check is Global',
      kind: 'Economic opinion',
      summary: 'People used to pay a premium for spell check. Now it is free and bundled into the editor, the browser, and the phone. That is what happens when technology is built for global access, for more than 7 billion people, instead of priced by scarcity for fewer than 500 million. Energy to run is what remains.',
      keywords: ['spell check', 'global access', 'the many', 'pricing', 'commoditization', 'automation path', 'economics', 'local']
    },
    {
      id: 'agency',
      title: 'The Universal Law of Agency',
      short_title: 'The Universal Law of Agency',
      kind: 'Research track',
      summary: 'Law first, kinematics second. Nothing is an agent until the Universal Law of Agency is met. The kinematic laws bound how fast agency moves per joule. Intelligence is the calculus of agency: a derivative read in hindsight off a completed run, written as iota = dX/dJ. Energy to run is the only true metric of computer intelligence.',
      keywords: ['agency', 'universal law of agency', 'kinematics', 'calculus', 'intelligence', 'derivative', 'joules', 'Landauer', 'thermodynamics', 'acceptor', 'Anokhin', 'empowerment', 'experiment']
    }
  ];

  STUDIES.forEach(function (s) {
    s.author = AUTHOR;
    s.url = BASE + '/papers/' + s.id + '/';
    s.pdf = BASE + '/pdfs/' + s.id + '.pdf';
    s.about = BASE + '/about/' + s.id + '/';
  });

  var IDS = STUDIES.map(function (s) { return s.id; });
  var ID_INPUT = {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        enum: IDS,
        description: 'Study id. mol is Mixture of Limits, ni is Notational Intelligence, satiation is Satiation, mei is Metabolic Intelligence, jouleos is The Search for JouleOS, spellcheck is Spell Check is Global, agency is The Universal Law of Agency.'
      }
    },
    required: ['id'],
    additionalProperties: false
  };

  function find(id) {
    var key = String(id || '').trim().toLowerCase();
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
      description: 'Lists every study in the OpenIE research catalog with id, title, kind (research study, research track, or economic opinion), web URL, and PDF URL. Read-only.',
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
