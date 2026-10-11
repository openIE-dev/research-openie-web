// RCE Playground. Every result on this page is computed by the RCE core
// compiled to wasm32 (pkg/rce_core, pkg/rce_repair); this file only renders.
import initCore, * as C from './pkg/rce_core.js';
const J = s => JSON.parse(s);
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = (x, d = 3) => (x === null || x === undefined) ? '–' : (Math.abs(x) < 1e-3 && x !== 0 ? x.toExponential(2) : (+x).toFixed(d).replace(/\.?0+$/, ''));
const get = async p => (await fetch(p)).text();
let R = null; // repair module, loaded on first use
async function repair() { if (!R) { const m = await import('./pkg/rce_repair.js'); await m.default('./pkg/rce_repair_bg.wasm'); R = m; } return R; }
const D = {}; // data
// The ladder sample (1.8 MB) and its native reference load on first use.
let SAMPLE = null;
async function sample() { if (!SAMPLE) SAMPLE = Promise.all(['data/ladder-sample.json', 'data/native-ref.json'].map(async p => JSON.parse(await get(p)))).then(([s, r]) => { D.sample = s; D.ref = r; }); await SAMPLE; return D.sample; }
const LOG2 = Math.log2;

// Wilson score interval (95%).
function wilson(k, n, z = 1.96) { if (!n) return [0, 0]; const p = k / n, d = 1 + z*z/n, c = (p + z*z/(2*n)) / d, h = z*Math.sqrt(p*(1-p)/n + z*z/(4*n*n)) / d; return [c - h, c + h]; }

// Tiny SVG line chart: series = [{name, color, ys}]
function chart(series, {w = 520, h = 200, xl = 'round', yl = ''} = {}) {
  const n = Math.max(...series.map(s => s.ys.length)); const ymax = Math.max(1e-30, ...series.flatMap(s => s.ys));
  const X = i => 40 + (w - 60) * (n <= 1 ? 0 : i / (n - 1)), Y = y => h - 28 - (h - 48) * (y / ymax);
  let g = `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img"><line x1="40" y1="${h-28}" x2="${w-20}" y2="${h-28}" stroke="#999"/><line x1="40" y1="20" x2="40" y2="${h-28}" stroke="#999"/>`;
  g += `<text x="${w/2}" y="${h-6}" text-anchor="middle">${esc(xl)}</text><text x="4" y="14">${esc(yl)} (max ${fmt(ymax)})</text>`;
  series.forEach((s, k) => { g += `<polyline fill="none" stroke="${s.color}" stroke-width="2" points="${s.ys.map((y, i) => X(i)+','+Y(y)).join(' ')}"/>`;
    s.ys.forEach((y, i) => g += `<circle cx="${X(i)}" cy="${Y(y)}" r="2.5" fill="${s.color}"/>`);
    g += `<text x="${w-200}" y="${20+14*k}" fill="${s.color}">● ${esc(s.name)}</text>`; });
  return g + '</svg>';
}

// ── Layers ────────────────────────────────────────────────────────────
const L = [];
const layer = (id, title, render) => L.push({id, title, render});

layer('lesson', 'Lesson path', el => {
  el.innerHTML = `<section><h2>The stack is not fixed</h2>
  <p>A program is a stack of levels: tokens and statements, handlers, the state machine they form, the proofs that bind them, and the energy that runs them. Each level rests on assumptions about the one below it. RCE evaluates the whole stack, makes every one of those interface assumptions explicit, and checks it. When a check fails, the correction is made at the level where the assumption broke, proven, and promoted. Every level above inherits it.</p>
  <p>Repeat that and the corrections compound. That is recursive self-improvement under a gate: the system improves itself only through changes it can prove, so model calls and joules fall while correctness holds. Follow the path below; each step links to the section of the paper that states it as theory.</p>
  <ol class="lesson">${[
   ['code','Break a program and repair it with gears: 0 model calls, the search bits and the gate.','#'],
   ['theory','See the two entropic regimes: how many bits of intent you supply, and how many are found in code already written.','#21-programming-is-coding-theory'],
   ['concept','A program as a database state machine: fold the log, watch the statechart, replay byte for byte.',''],
   ['proof','Replay the Z3 certificates and the Kani harnesses that gate every rewrite and handler.',''],
   ['interfaces','Break an assumption at a boundary, watch RCE detect it, correct it, and carry the correction upward.',''],
   ['compounding','Repeat corrections and watch the cumulative curves: model calls and joules fall, correctness holds.',''],
   ['energy','Estimated joules for every step and the Mixture of Limits escalation ladder.',''],
   ['evidence','Run hundreds of held-out ladder tasks in your browser and compare with the paper\'s large-N figure.','#23-per-rung-ladder-results'],
   ['translation','One Form emitted to Rust, Python, XState and WASM, and existing code lifted back into a Form.',''],
  ].map(([id, t]) => `<li><a href="#${id}">${esc(L.find(x => x.id === id)?.title || id)}</a>: ${esc(t)}</li>`).join('')}</ol>
  <p class="why">The path closes where it opened: after the last layer, return to <a href="#compounding">Compounding</a> and make one more correction anywhere in the stack. It will carry upward again.</p></section>`;
});

// Code layer: break, repair with gears.
const CODE_EX = [
  {name: 'off-by-one comparison', lang: 'java', good: 'int clamp(int a, int max) {\n  if (a >= max) return max;\n  return a;\n}', line: 2, from: '>=', to: '>'},
  {name: 'wrong boolean operator', lang: 'java', good: 'boolean valid(String s) {\n  return s != null && !s.isEmpty();\n}', line: 2, from: '&&', to: '||'},
  {name: 'swapped literal', lang: 'java', good: 'boolean done(int left) {\n  return left == 0;\n}', line: 2, from: '0', to: '1'},
  {name: 'Python comparison', lang: 'python', good: 'def last(xs):\n    if len(xs) > 0:\n        return xs[-1]\n    return None', line: 2, from: '>', to: '<'},
];
layer('code', 'Code', el => {
  el.innerHTML = `<section><h2>Code: break it, then repair it with gears</h2>
  <p class="why">A gear is a deterministic generator of candidate edits at one site (G0: one-token edits drawn from the grammar and the project's vocabulary). Candidates are ranked; the <b>gate</b> admits a candidate only if the patched code equals the intended program (here the program before you broke it, whitespace ignored). The <b>search bits</b> are log₂ of the rank: the information the gate had to supply to pick the fix. No model is called.</p>
  <label>Example <select id="cx">${CODE_EX.map((e, i) => `<option value="${i}">${esc(e.name)}</option>`)}</select></label>
  <div class="row"><div><b>Intended program</b><textarea id="cgood"></textarea></div><div><b>Broken program</b><textarea id="cbad"></textarea></div></div>
  <label>Bug line <input id="cline" type="number" min="1" size="3"></label> <label>Language <select id="clang"><option>java</option><option>python</option></select></label>
  <button class="act" id="cbreak">Break it</button><button class="act" id="crepair">Repair with gears</button>
  <div id="cout"></div></section>`;
  const set = i => { const e = CODE_EX[i]; $('#cgood').value = e.good; $('#cline').value = e.line; $('#clang').value = e.lang; $('#cbad').value = ''; $('#cout').innerHTML = ''; };
  $('#cx').onchange = e => set(+e.target.value); set(0);
  $('#cbreak').onclick = () => { const e = CODE_EX[+$('#cx').value]; const ls = $('#cgood').value.split('\n'); const i = +$('#cline').value - 1; ls[i] = ls[i].replace(e.from, e.to); $('#cbad').value = ls.join('\n'); };
  $('#crepair').onclick = async () => {
    if (!$('#cbad').value) $('#cbreak').onclick();
    $('#cout').innerHTML = 'loading the repair gears…'; const M = await repair();
    const t0 = performance.now(); const r = J(M.repair_task($('#cbad').value, $('#cgood').value, +$('#cline').value, $('#clang').value, '[]')); const ms = performance.now() - t0;
    if (!r.ok) { $('#cout').innerHTML = `<p class="bad">${esc(r.error)}</p>`; return; }
    const v = r.value;
    $('#cout').innerHTML = `<div class="kpi"><div><b class="${v.solved ? 'ok' : 'bad'}">${v.solved ? 'repaired' : 'not repaired'}</b><span>gate verdict</span></div>
     <div><b>${v.solved ? v.rank : '–'}</b><span>rank of the admitted candidate</span></div><div><b>${v.solved ? fmt(v.search_bits, 2) : '–'}</b><span>search bits (log₂ rank)</span></div>
     <div><b>${v.n_cands}</b><span>candidates generated</span></div><div><b>${v.llm_calls}</b><span>model calls</span></div><div><b>${fmt(ms, 1)} ms</b><span>in your browser</span></div></div>
     ${v.solved ? `<p>Gear <code>${esc(v.gear)}</code>, pattern <code>${esc(v.pattern)}</code>.</p><pre>${esc(v.patched)}</pre>` : ''}
     <details><summary>Candidate trail (first ${v.trail.length})</summary><table><tr><th>rank</th><th>gear</th><th>pattern</th><th>from</th><th>to</th><th>gate</th></tr>${v.trail.map(t => `<tr><td>${t.rank}</td><td>${t.view}</td><td>${esc(t.pattern)}</td><td><code>${esc(t.from)}</code></td><td><code>${esc(t.to)}</code></td><td>${t.accepted ? '<span class=ok>admitted</span>' : 'refused'}</td></tr>`).join('')}</table></details>`;
    THEORY.push({name: CODE_EX[+$('#cx').value].name, ...v});
  };
});

// Theory layer: two entropic regimes.
const THEORY = [];
layer('theory', 'Theory', el => {
  el.innerHTML = `<section><h2>Theory: two entropic regimes</h2>
  <p>Programming moves intent from a high-entropy regime (what a person means, open-ended) to a low-entropy regime (code, which is highly repetitive and predictable). The question at every level is how many bits of intent must be <b>supplied</b>, and how many are already <b>found</b> in code people have written: the grammar, the project's vocabulary, the corpus of earlier fixes. See <a href="/papers/rce/#21-programming-is-coding-theory">RCE paper §2.1</a>.</p>
  <p class="why">Definitions used here. <b>Unprimed bits</b> = 8 × the length of the fix text in bytes: the cost of writing the fix with no model of code at all. <b>Supplied bits</b> = log₂(rank): what the gate had to contribute to choose the fix among the gear's ranked candidates. <b>Found bits</b> = unprimed minus supplied: what the structure of existing code contributed. These are illustrative upper-bound encodings, not entropy estimates of the source.</p>
  <button class="act" id="trun">Measure on 60 held-out ladder tasks</button><span id="tstat"></span><div id="tout"></div></section>`;
  const draw = rows => {
    const s = rows.filter(r => r.solved);
    const sup = s.map(r => LOG2(r.rank)), un = s.map(r => 8 * Math.max(1, new TextEncoder().encode(r.to || r.patchText || '').length));
    const mean = a => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length);
    $('#tout').innerHTML = `<div class="kpi"><div><b>${s.length}</b><span>solved tasks measured</span></div><div><b>${fmt(mean(un), 1)}</b><span>mean unprimed bits</span></div><div><b>${fmt(mean(sup), 2)}</b><span>mean supplied bits</span></div><div><b>${fmt(mean(un) - mean(sup), 1)}</b><span>mean found bits</span></div></div>
    ${chart([{name: 'unprimed bits', color: '#b3261e', ys: un}, {name: 'supplied bits (log₂ rank)', color: '#1f5fbf', ys: sup}], {xl: 'solved task', yl: 'bits'})}`;
  };
  $('#trun').onclick = async () => { const M = await repair(); await sample(); const ts = D.sample.java.slice(0, 60); const rows = [];
    for (const t of ts) { const v = J(M.repair_task(t.before, t.after, t.line, t.lang, JSON.stringify(t.vocab))).value; if (v.solved) { const tr = v.trail.find(x => x.accepted); v.to = tr ? tr.to : ''; } rows.push(v); }
    $('#tstat').textContent = ` ${rows.filter(r => r.solved).length} of ${rows.length} solved, 0 model calls`; draw(rows); };
});

// Concept layer: program as a database state machine.
function flows(spec) { return [...spec.matchAll(/^flow \S+ from (\S+) to (\S+)/gm)].map(m => [m[1], m[2]]); }
const nodeId = s => s.startsWith('DEP') ? 'dep_' + s : s.startsWith('R') ? 'role_' + s : s.startsWith('D') ? 'del_' + s : s;
function statechart(spec, active = new Set(), ctrl = {}) {
  const fs = flows(spec).map(([a, b]) => [nodeId(a), nodeId(b)]); const nodes = [...new Set(fs.flat())];
  const col = n => n.startsWith('dep_') ? 0 : n.startsWith('del_') ? 3 : (fs.some(([a, b]) => b === n && a.startsWith('dep_')) ? 1 : 2);
  const pos = {}; [0, 1, 2, 3].forEach(c => nodes.filter(n => col(n) === c).forEach((n, i) => pos[n] = [20 + c * 160, 20 + i * 54]));
  let g = `<svg viewBox="0 0 640 ${Math.max(...Object.values(pos).map(p => p[1])) + 50}" width="100%">`;
  fs.forEach(([a, b]) => g += `<line x1="${pos[a][0]+120}" y1="${pos[a][1]+16}" x2="${pos[b][0]}" y2="${pos[b][1]+16}" stroke="#999" marker-end="url(#ar)"/>`);
  g += `<defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6" fill="#999"/></marker></defs>`;
  nodes.forEach(n => g += `<rect x="${pos[n][0]}" y="${pos[n][1]}" width="120" height="32" rx="6" fill="${active.has(n) ? '#dce8fb' : '#fff'}" stroke="${active.has(n) ? '#1f5fbf' : '#bbb'}"/><text x="${pos[n][0]+6}" y="${pos[n][1]+14}">${n}</text><text x="${pos[n][0]+6}" y="${pos[n][1]+27}" fill="#5b5f6a">${esc(ctrl[n] || '')}</text>`);
  return g + '</svg>';
}
layer('concept', 'Concept', el => {
  el.innerHTML = `<section><h2>Concept: a program is a database state machine</h2>
  <p>The Form is one step function δ over a database state: typed relations, control regions and a clock. Every event is appended to a log with the hash of the state it produced. The kernel's <code>fold</code> replays the log and refuses any entry whose state hash does not match, so the current state is a fold of the log, and a replay is byte-identical. Edit the spec or the fit below and recompile.</p>
  <div class="row"><div><b>Spec</b><textarea id="kspec" style="min-height:220px"></textarea></div><div><b>Fit (handlers)</b><textarea id="kfit" style="min-height:220px"></textarea></div></div>
  <button class="act" id="kcomp">Compile and run the sample events</button><label> tamper with log entry <input id="ktam" type="number" value="1" min="-1" size="3"></label>
  <div id="kout"></div></section>`;
  $('#kspec').value = D.spec; $('#kfit').value = D.fit;
  $('#kcomp').onclick = () => {
    const f = J(C.form_compile($('#kspec').value, $('#kfit').value, '')); if (!f.ok) { $('#kout').innerHTML = `<p class="bad">${esc(f.error)}</p>`; return; }
    const r = J(C.form_run(f.value.ir_json, f.value.sample_events_json, +$('#ktam').value)).value; let i = 0;
    $('#kout').innerHTML = `<div class="kpi"><div><b class="${r.fold_ok ? 'ok' : 'bad'}">${r.fold_ok ? 'fold = run' : 'fold failed'}</b><span>kernel fold</span></div><div><b class="${r.replay_byte_identical ? 'ok' : 'bad'}">${r.replay_byte_identical}</b><span>replay byte-identical</span></div><div><b class="${r.tamper ? 'ok' : ''}">${esc(r.tamper ?? 'not tampered')}</b><span>tampered log</span></div><div><b>${r.steps.length}</b><span>events</span></div></div>
    <p>Final state hash <code>${r.final_hash.slice(0, 16)}…</code> · fold hash <code>${(r.fold_hash || '').slice(0, 16)}…</code> · est. energy of the extracted Form ${fmt(f.value.ir.cost?.est_j_extracted)} J<span class="est">estimate</span></p>
    <div id="kchart"></div><button class="act alt" id="kprev">◀ event</button><button class="act alt" id="knext">event ▶</button><span id="kidx"></span><pre id="kstep"></pre>`;
    const show = () => { const s = r.steps[i]; const node = s.event.type.replace(/^IN_|^RESOLVE_/, ''); const act = new Set([node, ...s.outputs.map(o => o.sink).filter(Boolean)]);
      $('#kchart').innerHTML = statechart($('#kspec').value, act, s.state.control); $('#kidx').textContent = ` event ${i + 1} of ${r.steps.length}: ${s.event.type}`;
      $('#kstep').textContent = JSON.stringify({event: s.event, outputs: s.outputs, state_hash: s.state_hash}, null, 1); };
    $('#kprev').onclick = () => { i = Math.max(0, i - 1); show(); }; $('#knext').onclick = () => { i = Math.min(r.steps.length - 1, i + 1); show(); }; show();
  };
  $('#kcomp').onclick();
});

// Proof layer.
layer('proof', 'Proof', el => {
  const k = J(C.kernel_certified()).value;
  el.innerHTML = `<section><h2>Proof: certificates, replayed</h2>
  <p>Two provers gate RCE. <b>Kani</b> model-checks the kernel (fold equals replay, tamper detection, the handler core). <b>Z3</b> proves each proposed rewrite of the Form sound over every input. The browser has neither binary, so this page replays their certificates: the Kani certificate is compiled into the module and checked against the kernel source hash; the Z3 certificate maps the SHA-256 of every query RCE writes to the answer the native Z3 gave. RCE writes the same queries here as natively (see the differential tests), so a query without an entry has no proof.</p>
  <div class="kpi"><div><b class="${k.certified ? 'ok' : 'bad'}">${k.certified ? 'certified' : 'not certified'}</b><span>kernel (Kani)</span></div><div><b>${k.successful} / ${k.harnesses.length}</b><span>harnesses successful</span></div><div><b><code>${k.source_sha256.slice(0, 12)}</code></b><span>kernel source sha256</span></div></div>
  <details><summary>Kani harnesses</summary><pre>${esc(k.harnesses.join('\n'))}</pre></details>
  <button class="act" id="prun">Replay Z3 on all ${D.rules.length} rewrites</button><div id="pout"></div>
  <h3>Try your own rewrite</h3><label>lhs <input id="plhs" value="(pipe pass ?x)" size="30"></label> <label>rhs <input id="prhs" value="?x" size="20"></label> <button class="act alt" id="pone">Check, then prove</button><pre id="pone-out"></pre></section>`;
  J(C.load_certificate(D.cert));
  const one = (name, l, r) => ({name, l, r, chk: J(C.check_rewrite(name, l, r, 7n)).value, pr: J(C.prove_rewrite(l, r)).value});
  $('#prun').onclick = () => { const rows = D.rules.map(x => one(x.name, x.lhs, x.rhs));
    $('#pout').innerHTML = `<table><tr><th>rewrite</th><th>randomized check</th><th>Z3</th><th>queries</th></tr>${rows.map(x => `<tr><td><code>${esc(x.l)} ⇒ ${esc(x.r)}</code></td><td>${x.chk.counterexample ? '<span class=bad>counterexample</span>' : `<span class=ok>${x.chk.trials_without_counterexample} trials</span>`}</td><td>${x.pr.proven ? `<span class=ok>proven (${x.pr.cases} case)</span>` : `<span class=bad>${esc(x.pr.why)}</span>`}</td><td>${x.pr.queries.map(q => `<code title="${esc(q.smt.slice(0, 400))}">${q.sha256.slice(0, 8)}=${q.answer}</code>`).join(' ')}</td></tr>`).join('')}</table>
    <p>${rows.filter(x => x.pr.proven).length} proven, ${rows.filter(x => !x.pr.proven).length} refused. Only proven rewrites may be promoted into the engine.</p>`; };
  $('#pone').onclick = () => { const x = one('yours', $('#plhs').value, $('#prhs').value); $('#pone-out').textContent = JSON.stringify({check: x.chk, proof: {...x.pr, queries: x.pr.queries.map(q => ({sha256: q.sha256, answer: q.answer}))}}, null, 1); };
});

// Interfaces layer.
const IN_SCHEMA = {type: 'object', properties: {id: {type: 'integer'}, amount: {type: 'number'}}};
const OUT_SCHEMA = {type: 'object', properties: {id: {type: 'integer'}, amount: {type: 'number'}}, required: ['id', 'amount']};
layer('interfaces', 'Interfaces', el => {
  el.innerHTML = `<section><h2>Interfaces: every assumption explicit and checked</h2>
  <p>Each boundary in the stack carries an assumption. RCE writes each one down and checks it, so a break is detected at the boundary where it happens instead of surfacing far above it. Break one, see it detected, then apply the correction and watch it carry upward into the engine.</p>
  <table id="itab"></table><div id="iout"></div></section>`;
  const B = [
    {b: 'source → validator', a: 'every order reaching the ledger writer has id and amount', break: 'drop amount from the validator\'s required fields',
     run: broken => J(C.prove_handler(JSON.stringify({kind: 'validate', required_fields: broken ? ['id'] : ['id', 'amount'], on_success: {kind: 'passthrough'}}), JSON.stringify(IN_SCHEMA), JSON.stringify(OUT_SCHEMA))).value,
     verdict: v => [v.proven, v.detail]},
    {b: 'log → state', a: 'every log entry carries the hash of the state it produced', break: 'overwrite one entry\'s state hash',
     run: broken => { const f = J(C.form_compile(D.spec, D.fit, '')).value; return J(C.form_run(f.ir_json, f.sample_events_json, broken ? 2 : -1)).value; },
     verdict: v => [v.tamper === null, v.tamper === null ? 'fold accepted the untampered log' : 'kernel fold ' + v.tamper]},
    {b: 'rewrite → Form', a: 'a rewrite preserves the output for every input', break: 'propose (add ?a ?b) ⇒ (add ?b ?a) over non-numbers',
     run: broken => { J(C.load_certificate(D.cert)); const r = D.rules.find(x => x.name === (broken ? 'add-commutes' : 'pipe-pass-l')); return J(C.prove_rewrite(r.lhs, r.rhs)).value; },
     verdict: v => [v.proven, v.proven ? 'Z3: unsat (proven)' : v.why]},
    {b: 'handler → sink', a: 'a stub handler escalates instead of guessing', break: 'leave the deliverable sinks as stubs',
     run: broken => J(C.engine_rounds(D.spec, JSON.stringify(WORK), 6, broken ? '' : JSON.stringify(CORR))).value,
     verdict: v => { const c = v.rounds.reduce((s, r) => s + r.foreman_calls, 0), last = v.rounds.at(-1).foreman_calls; return [c <= 15, `${c} escalations over 6 rounds (stubs escalate instead of guessing); ${last} in the last round`]; }},
  ];
  $('#itab').innerHTML = `<tr><th>boundary</th><th>assumption</th><th></th><th>result</th></tr>` + B.map((x, i) => `<tr><td>${esc(x.b)}</td><td>${esc(x.a)}</td><td><button class="act alt" data-i="${i}" data-k="1">${esc(x.break)}</button><button class="act" data-i="${i}" data-k="0">correct</button></td><td id="iv${i}"></td></tr>`).join('');
  el.querySelectorAll('button[data-i]').forEach(btn => btn.onclick = () => { const x = B[+btn.dataset.i], broken = btn.dataset.k === '1'; const [ok, d] = x.verdict(x.run(broken));
    $('#iv' + btn.dataset.i).innerHTML = `<span class="${ok ? 'ok' : 'bad'}">${ok ? 'holds' : 'detected'}</span>: ${esc(d)}`;
    if (!broken) $('#iout').innerHTML = `<p class="why">Correction applied at <b>${esc(x.b)}</b>. Open <a href="#compounding">Compounding</a> to watch it carry into every later round.</p>`; });
});

// Compounding / RSI.
const WORK = [{to: 'dep_DEP1', payload: {id: 1, amount: 2.5}}, {to: 'dep_DEP2', payload: {id: 2, amount: 1}}, {to: 'dep_DEP1', payload: {id: 3}}];
const CORR = {del_D1: {kind: 'passthrough'}, del_D2: {kind: 'passthrough'}};
layer('compounding', 'Compounding / RSI', el => {
  el.innerHTML = `<section><h2>Compounding: recursive self-improvement under a gate</h2>
  <p>The engine starts with every handler a stub. Each round the workload runs; whatever a stub cannot handle escalates. An escalation is a call that would go to a model; here it is answered by RCE's recorded deterministic foreman, so the page makes no model calls. A resolution is promoted only through RCE's promotion path, which proves it first. Promoted handlers serve every later round, so escalations fall to zero while every task still closes correctly. Add a correction yourself at any level and the curve drops earlier.</p>
  <label>Rounds <input id="mr" type="number" value="8" min="1" max="40" size="3"></label>
  <label><input type="checkbox" id="mc"> apply the correction at the sinks before round 1 (<code>del_D1</code>, <code>del_D2</code>: passthrough)</label>
  <button class="act" id="mrun">Run</button><div id="mout"></div></section>`;
  $('#mrun').onclick = () => { const n = +$('#mr').value;
    const a = J(C.engine_rounds(D.spec, JSON.stringify(WORK), n, '')).value, b = J(C.engine_rounds(D.spec, JSON.stringify(WORK), n, JSON.stringify(CORR))).value;
    const cum = xs => xs.reduce((o, x) => (o.push((o.at(-1) || 0) + x), o), []);
    const fa = a.rounds.map(r => r.foreman_calls), fb = b.rounds.map(r => r.foreman_calls); const use = $('#mc').checked ? b : a;
    $('#mout').innerHTML = `<div class="kpi"><div><b>${cum(fa).at(-1)}</b><span>cumulative escalations, no correction</span></div><div><b>${cum(fb).at(-1)}</b><span>with the correction</span></div><div><b>${use.rounds.reduce((s, r) => s + r.promoted, 0)}</b><span>handlers promoted</span></div><div><b>${use.rounds.reduce((s, r) => s + r.promotions_blocked, 0)}</b><span>promotions blocked by the gate</span></div><div><b>0</b><span>model calls</span></div></div>
    <div class="row"><div>${chart([{name: 'no correction', color: '#b3261e', ys: cum(fa)}, {name: 'with correction', color: '#1d7a3e', ys: cum(fb)}], {yl: 'cumulative escalations'})}</div>
    <div>${chart([{name: 'escalations per round', color: '#b3261e', ys: use.rounds.map(r => r.foreman_calls)}, {name: 'tasks closed ok', color: '#1d7a3e', ys: use.rounds.map(r => r.tasks_closed_ok)}], {yl: 'count'})}</div></div>
    <table><tr><th>round</th><th>escalations</th><th>promoted</th><th>proven handlers</th><th>closed ok</th><th>handler energy<span class="est">estimate</span></th><th>state hash</th></tr>${use.rounds.map(r => `<tr><td>${r.round}</td><td>${r.foreman_calls}</td><td>${r.promoted}</td><td>${r.handlers_spec}</td><td>${r.tasks_closed_ok}</td><td>${fmt(r.handler_est_j)} J</td><td><code>${r.state_hash.slice(0, 10)}</code></td></tr>`).join('')}</table>
    <p class="why">${esc(a.energy_label)}</p>`; };
  $('#mrun').onclick();
});

// Energy layer.
layer('energy', 'Energy', el => {
  el.innerHTML = `<section><h2>Energy: correctness is the gate, joules are the ranking</h2>
  <p>RCE prices every step it takes. The <b>Mixture of Limits</b> is the escalation ladder: a task goes to the cheapest rung first and climbs only when that rung cannot close it under the gate. Here: G0 one-token gears, then G1 fix patterns, then a model, then a person. Every task that closes on a low rung never reaches the expensive ones.</p>
  <label>Assumed browser power <input id="ew" type="number" value="15" min="1" size="4"> W</label> <button class="act" id="erun">Run 100 held-out Java tasks up the ladder</button><div id="eout"></div>
  <p class="why">Measured reference (RCE paper §6): one-token ladder tasks at 0.056 J per solve on jetson-hub, RAPL-class package counter. The browser figure below is time × the power you assume: an <em>estimate</em>.</p></section>`;
  $('#erun').onclick = async () => { const M = await repair(); const W = +$('#ew').value; let g0 = 0, up = 0, ms = 0;
    await sample(); for (const t of D.sample.java.slice(0, 100)) { const t0 = performance.now(); const v = J(M.repair_task(t.before, t.after, t.line, t.lang, JSON.stringify(t.vocab))).value; ms += performance.now() - t0; v.solved ? g0++ : up++; }
    const J0 = ms / 1000 * W;
    $('#eout').innerHTML = `<table><tr><th>rung</th><th>closed here</th><th>passed upward</th><th>energy</th></tr>
    <tr><td>G0 one-token gears</td><td>${g0}</td><td>${up}</td><td>${fmt(J0 / Math.max(1, g0), 3)} J per solve<span class="est">estimate</span> (${fmt(ms, 0)} ms total)</td></tr>
    <tr><td>G1 fix patterns, full file</td><td colspan="3">runs natively on the whole file and project index; the paper reports it at large N (§6)</td></tr>
    <tr><td>model</td><td>0</td><td>–</td><td>not called on this page</td></tr><tr><td>person</td><td colspan="3">receives only what every rung below refused</td></tr></table>`; };
});

// Evidence layer.
layer('evidence', 'Evidence', async el => {
  const s = {java: {length: 300}, python: {length: 200}, test_sizes: {java: 24072}};
  el.innerHTML = `<section><h2>Evidence: held-out ladder tasks, run in your browser</h2>
  <p>A seeded sample from the held-out test split of the one-statement rung: ${s.java.length} Java tasks from ManySStuBs4J (test split ${s.test_sizes.java.toLocaleString()} tasks) and ${s.python.length} Python tasks from TSSB-3M. The engine here is the frozen G0 snippet engine; the gate is token-for-token equality with the developer's fix, whitespace ignored. Each result is also compared with the native run of the same task. The browser runs the hunk-only engine, so its figure is compared with the paper's hunk-only row; with the whole parent file and the project's method and guard indexes, the frozen native engine resolves 63.7% of 21,320 Java test tasks (<a href="/papers/rce/#62-l1-one-statement-bugs-from-real-histories">paper §6.2</a>).</p>
  <button class="act" id="vrun">Run all ${s.java.length + s.python.length}</button><span id="vprog"></span><div id="vout"></div></section>`;
  const PAPER = {java: [0.386, 24072], python: [0.174, 157089]};
  $('#vrun').onclick = async () => { const M = await repair(); const s = await sample(); const res = {java: [0, 0], python: [0, 0]}; let agree = 0, n = 0; const curve = {java: [], python: []};
    for (const lang of ['java', 'python']) for (const t of s[lang]) { const v = J(M.repair_task(t.before, t.after, t.line, t.lang, JSON.stringify(t.vocab))).value; n++;
      res[lang][1]++; if (v.solved) res[lang][0]++; curve[lang].push(res[lang][0] / res[lang][1]);
      const nat = D.ref[t.id]; if (nat && nat.solved === v.solved && (nat.rank ?? null) === (v.solved ? v.rank : null) && nat.n_cands === v.n_cands) agree++;
      if (n % 25 === 0) { $('#vprog').textContent = ` ${n} tasks…`; await new Promise(r => setTimeout(r)); } }
    $('#vprog').textContent = ` ${n} tasks, 0 model calls`;
    $('#vout').innerHTML = `<table><tr><th>set</th><th>solved in browser</th><th>95% Wilson CI</th><th>paper, hunk only, large N (§2.3)</th></tr>${['java', 'python'].map(l => { const [k, m] = res[l], [lo, hi] = wilson(k, m), [p, N] = PAPER[l]; const inside = p >= lo && p <= hi;
      return `<tr><td>${l}</td><td>${k} / ${m} = ${(100 * k / m).toFixed(1)}%</td><td>${(100 * lo).toFixed(1)}% to ${(100 * hi).toFixed(1)}%</td><td>${(100 * p).toFixed(1)}% of ${N.toLocaleString()} <span class="${inside ? 'ok' : 'warn'}">${inside ? 'inside the CI' : 'outside the CI'}</span></td></tr>`; }).join('')}</table>
    <p>Browser and native agree on <b>${agree} of ${n}</b> tasks (solved, rank and candidate count).</p>
    ${chart([{name: 'Java running solve rate', color: '#1f5fbf', ys: curve.java}, {name: 'Python running solve rate', color: '#9a6700', ys: curve.python}], {xl: 'tasks run', yl: 'solve rate'})}`; };
});

// Translation layer.
const LIFT_EX = 'class Order:\n    def __init__(self, id):\n        self.id = id\n        self.state = "open"\n\n    def pay(self):\n        if self.state == "open":\n            self.state = "paid"\n\n    def ship(self):\n        if self.state == "paid":\n            self.state = "shipped"\n';
layer('translation', 'Translation', el => {
  const f = J(C.form_compile(D.spec, D.fit, '')).value;
  el.innerHTML = `<section><h2>Translation: one Form, many fits</h2>
  <p>The Form is the program; languages are fits of it. The same δ is emitted as a Rust crate, a Python module, an XState machine and SCXML, each carrying the same reference trace. The Rust crate builds to WASM, which is how this page runs RCE itself. Going the other way, brownfield lift reads existing code back into Form relations, events and transitions, each labeled with how it was obtained.</p>
  <label>Target <select id="tt">${[...Object.keys(f.rust).map(k => 'rust/' + k), ...Object.keys(f.python).map(k => 'python/' + k), 'xstate', 'scxml'].map(k => `<option>${k}</option>`).join('')}</select></label>
  <pre id="tsrc"></pre><p>Reference trace sha256: <code id="ttr"></code></p>
  <h3>Brownfield lift</h3><label>Language <select id="ll"><option>python</option><option>rust</option><option>typescript</option><option>go</option></select></label><textarea id="lsrc"></textarea><button class="act" id="lrun">Lift into a Form</button><pre id="lout"></pre></section>`;
  const show = () => { const k = $('#tt').value; $('#tsrc').textContent = k === 'xstate' ? JSON.stringify(f.xstate, null, 1) : k === 'scxml' ? f.scxml : k.startsWith('rust/') ? f.rust[k.slice(5)] : f.python[k.slice(7)]; };
  $('#tt').onchange = show; $('#tt').value = 'rust/src/step.rs'; show(); $('#ttr').textContent = C.sha256(JSON.stringify(f.reference_trace));
  $('#lsrc').value = LIFT_EX;
  $('#lrun').onclick = async () => { const M = await repair(); const r = J(M.lift(JSON.stringify([['input.' + {python: 'py', rust: 'rs', typescript: 'ts', go: 'go'}[$('#ll').value], $('#ll').value, $('#lsrc').value]])));
    $('#lout').textContent = r.ok ? JSON.stringify({schema: r.value.schema, events: r.value.events, regions: r.value.regions, transitions: r.value.transitions, parse_errors: r.value.parse_errors}, null, 1) : r.error; };
});

// ── Boot ──────────────────────────────────────────────────────────────
await initCore('./pkg/rce_core_bg.wasm');
[D.spec, D.fit, D.cert] = await Promise.all(['data/form-demo.rce', 'data/form-demo.fit.json', 'data/z3-cert.json'].map(get));
D.rules = JSON.parse(await get('data/rules.json'));
const bi = J(C.build_info()).value; $('#build').textContent = `RCE commit ${bi.rce_commit}, ${bi.target}.`;
const ORDER = ['lesson', 'code', 'concept', 'compounding', 'theory', 'proof', 'interfaces', 'energy', 'evidence', 'translation'];
$('#tabs').innerHTML = ORDER.map(id => `<button data-id="${id}">${esc(L.find(x => x.id === id).title)}</button>`).join('');
const rendered = {};
function go(id) { if (!L.find(x => x.id === id)) id = 'lesson';
  $('#tabs').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.id === id));
  $('#main').querySelectorAll(':scope > div').forEach(d => d.hidden = d.id !== 'L-' + id);
  if (!rendered[id]) { const d = document.createElement('div'); d.id = 'L-' + id; $('#main').append(d); rendered[id] = 1; L.find(x => x.id === id).render(d); } }
$('#tabs').onclick = e => { if (e.target.dataset.id) location.hash = e.target.dataset.id; };
addEventListener('hashchange', () => go(location.hash.slice(1)));
go(location.hash.slice(1) || 'lesson');
window.__rce_ready = true;
