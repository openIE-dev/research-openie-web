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
      "summary": "Notational Intelligence and Mixture of Limits in one systems paper. A proposal may not authorize itself: an irreversible act runs only behind a certificate, and every decision is written to a receipt. Mixture of Limits is the philosophy: use the cheapest gear that is sufficient, because past the floor additional tokens, parameters, or joules do not purchase verifiable progress. Lookup, then Formula, then Solver, then Model is one instance. Systems are ranked by the joules needed to reach a correct completion. A KV260 board reading gives 11,428 pJ per gate cycle at board level.",
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
      "kind": "Economics companion paper",
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
      "id": "rce",
      "title": "The Reality Code Engine: One Lossless Form for Native, Verified, Low-Energy Programming",
      "short_title": "The Reality Code Engine",
      "kind": "Research paper",
      "path": "/papers/rce/",
      "pdf_path": "/pdfs/rce.pdf",
      "about_path": "/about/rce/",
      "playground_path": "/playground/rce/",
      "summary": "Engineering and theory. Autonomous coding is a design space: approaches sit along continuous axes of energy per task, entropy and determinism, verification strength, reuse and compounding, and model reliance, and RCE is one point that optimizes them. A program is a database functional state machine: one Form, P = (S, E, δ, D, λ), and many fits, grounded in Gurevich's Abstract State Machine theorem. The Reality Code Engine (RCE) retrieves, adapts and proves fits, cheapest gear first, as one Mixture of Limits instance. Correctness is the gate and joules are the ranking. RCE is one uniform code ecosystem: intent is written once as a Form, a lossless encoding, and every target is a faithful projection, so invalid states cannot be written and the gate refuses errors at entry. On 10,000 preregistered Forms with a frozen engine and 0 model calls, every Form round trips to identical bytes, every projection is deterministic, every malformed input is refused at entry, and the Python projection replays the reference trace on 9,999. Code from other languages enters by lift, with repair as that entry path (63.7% of 21,320 single-statement Java bugs). The universality thesis, one Form in place of any other language, is stated as propositions with a large N coverage protocol.",
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
      "summary": "Engineering and theory. Computing has three bodies: theorists, makers and users. Each is coherent alone; the instability lives in the unexamined interfaces between them, where assumptions about units, voltages, versions, envelopes and intent cross unwritten and unchecked. The paper uses the three-body problem of celestial mechanics carefully, separating analogy from mechanism, states the interface thesis as definitions, five propositions, protocols and falsifiers, and argues that pursuing AGI seriously forces every interface assumption to be made explicit and checked. A stack whose interfaces are all checked holds a correction where it is made and carries it upward, like the special stable configurations of the three-body problem. RCE's whole-stack interface checks are the first evidence.",
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
      "summary": "People used to pay a premium for spell check. Now it is free and bundled into the editor, the browser, and the phone. A history of that path, from dated prices to the local library in every editor. Technology built for global access reaches more than 7 billion people. Scarcity pricing keeps a capability with the few who can pay. Energy to run is what remains.",
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
      "summary": "The economics companion to the RCE research paper, where the theory and the economics meet. It sets out who projects the AI coding market and what they project: about $3 trillion a year in developer value, company-reported revenue and valuations, token volume, losses, capex and data-centre energy, each with its source and its label. Every projection assumes the space of autonomous coding has one direction: high energy, high compute, per-token rent and the model in the loop forever. With correctness as the gate and joules as the ranking, RCE measured, on held-out test splits with 0 model calls, 520,541 of 520,821 one-token repairs and 63.7% of 21,320 real single-statement Java bugs with the whole file, at hundredths of a reported joule per solved task. Where RCE covers a task, its price falls toward the energy to run it, as Spell Check fell to a bundled zero price.",
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
      "summary": "The economics companion to The Pursuit of AGI Resolves the Three-Body Problem in Computing. It gathers the primary estimates of what unexamined interfaces cost and labels each by kind: accounted costs of single failures such as Mars Climate Orbiter and the Cluster payload lost on Ariane 501, NIST model estimates of inadequate software testing ($59.5 billion a year) and inadequate interoperability in capital facilities ($15.8 billion a year), and CISQ's estimate of the cost of poor software quality in the United States (at least $2.41 trillion in 2022, with about $1.52 trillion of technical debt). No primary source isolates interface failure as one total, and the essay does not invent one. It reads the costs through technical debt and standards economics and ties them to the AI coding market, which prices generation and leaves interfaces unpriced.",
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
