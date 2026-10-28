// Generates spec.json for the RCE spec notebook pages on research.openie.dev.
// Usage: node gen.mjs <spec dir> <out.json>
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import katex from 'katex';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

const SPEC = path.resolve(process.argv[2]);
const OUT = process.argv[3];
const BOOK = path.join(SPEC, 'book');
const wasmPkg = path.join(SPEC, 'checker-wasm/pkg');
const { default: init, check_with } = await import(path.join(wasmPkg, 'rce_spec_check_wasm.js'));
await init({ module_or_path: fs.readFileSync(path.join(wasmPkg, 'rce_spec_check_wasm_bg.wasm')) });
const check = (src, known = '') => JSON.parse(check_with(src, known));
const commit = execSync('git rev-parse --short HEAD', { cwd: SPEC }).toString().trim();

// keywords come from the tree-sitter grammar (string literals that are identifiers);
// the grammar is in spec/tree-sitter/ up to draft 0.7 and in the repository root's tree-sitter/ from draft 0.9
const grammarJs = [path.join(SPEC, 'tree-sitter/grammar.js'), path.join(SPEC, '../tree-sitter/grammar.js')].find((p) => fs.existsSync(p));
const grammar = fs.readFileSync(grammarJs, 'utf8');
const KEYWORDS = [...new Set([...grammar.matchAll(/'([a-z][a-z_0-9]*)'/g)].map((m) => m[1]))].sort();
const TOP = /^(module|use|intent|example|check|pub|const|type|struct|kind|trait|fn|actor|state|event|error|step|impl|extern|linear|device|arena)\b/;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const TYPES = new Set(['bool','i8','i16','i32','i64','u8','u16','u32','u64','usize','f64','f32','text','List','Map','Set','Box']);
export function highlight(src) {
  const kw = new Set(KEYWORDS);
  const re = /(#[^\n]*)|("(?:\\.|[^"\\\n])*"?)|(\b0x[0-9a-fA-F_]+\b|\b0b[01_]+\b|\b\d[\d_]*(?:\.\d+)?(?:e[+-]?\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([^A-Za-z_0-9#"]+)/g;
  let out = '', m;
  while ((m = re.exec(src))) {
    if (m[1]) out += `<span class="t-com">${esc(m[1])}</span>`;
    else if (m[2]) out += `<span class="t-str">${esc(m[2])}</span>`;
    else if (m[3]) out += `<span class="t-num">${esc(m[3])}</span>`;
    else if (m[4]) {
      const w = m[4];
      if (kw.has(w)) out += `<span class="t-kw">${w}</span>`;
      else if (TYPES.has(w)) out += `<span class="t-ty">${w}</span>`;
      else if (/^[A-Z]/.test(w)) out += `<span class="t-name">${w}</span>`;
      else out += w;
    } else out += esc(m[5]);
  }
  return out;
}

function rule(e) { return (e && e.rule) || ''; }
function summarize(r) {
  if (r.ok) return { ok: true, text: 'accepted' };
  const e = r.errors[0] || {};
  return { ok: false, stage: r.stage, rule: rule(e), text: e.msg || r.stage };
}

let cellN = 0;
function cell(src, opts = {}) {
  const id = `cell-${++cellN}`;
  const res = check(src, opts.known || '');
  const exp = opts.expect ? summarize(res) : null;
  const attrs = [`id="${id}"`, `class="nb-cell nb-code"`];
  if (opts.known) attrs.push(`data-known="${esc(opts.known)}"`);
  if (exp) attrs.push(`data-expect="${exp.ok ? 'accepted' : 'refused'}"`, `data-expect-rule="${esc(exp.rule || '')}"`);
  const label = opts.label ? `<span class="nb-label">${esc(opts.label)}</span>` : '<span class="nb-label">RCE</span>';
  const expHtml = exp
    ? `<p class="nb-expect ${exp.ok ? 'is-ok' : 'is-bad'}"><strong>Expected:</strong> ${exp.ok ? 'accepted' : `refused at the ${esc(exp.stage)} stage${exp.rule ? ` by <code>${esc(exp.rule)}</code>` : ''}: ${esc(exp.text)}`}</p>`
    : '';
  const lines = src.split('\n').length;
  return `<div ${attrs.join(' ')}>
<div class="nb-head">${label}<span class="nb-spacer"></span><button type="button" class="nb-run" aria-describedby="${id}-out">Run</button><button type="button" class="nb-reset">Reset</button></div>
${expHtml}<div class="nb-editor" style="--lines:${lines}"><pre class="nb-hl" aria-hidden="true"><code>${highlight(src)}\n</code></pre><textarea class="nb-src" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Editable RCE code${opts.label ? ': ' + esc(opts.label) : ''}" rows="${lines}">${esc(src)}</textarea></div>
<div class="nb-out" id="${id}-out" role="status" aria-live="polite"></div>
</div>`;
}

// ---- KaTeX for grammar and inference rules ----
const tx = (s) => s.replace(/\\/g, '\\textbackslash ').replace(/([{}$&#%_])/g, '\\$1').replace(/\^/g, '\\textasciicircum ').replace(/~/g, '\\textasciitilde ');
const MESC = { '{': '\\{', '}': '\\}', '#': '\\#', '$': '\\$', '%': '\\%', '&': '\\&', '_': '\\_', '^': '\\hat{}', '~': '\\sim ', '\\': '\\backslash ' };
function mathify(s, mono) {
  const T = mono ? '\\texttt' : '\\text';
  const re = /("(?:[^"\\]|\\.)*")|([A-Za-z][A-Za-z0-9_']*[A-Za-z0-9_']|[A-Za-z]{2,})|( +)|([{}#$%&_^~\\])|(.)/gu;
  s = s.split(/("(?:[^"\\]|\\.)*")/).map((x, i) => (i % 2 ? x : x.replace(/->/g, '\u2192').replace(/=>/g, '\u21d2').replace(/<-/g, '\u2190'))).join('');
  let o = '', m;
  while ((m = re.exec(s))) {
    if (m[1]) o += `\\texttt{${tx(m[1])}}`;
    else if (m[2]) o += mono ? `\\texttt{${tx(m[2])}}` : `\\text{${tx(m[2])}}`;
    else if (m[3]) o += m[3].length > 2 ? '\\quad ' : '\\ ';
    else if (m[4]) o += MESC[m[4]];
    else o += m[5];
  }
  return o;
}
// grammar right-hand side: the first column is grammar, later columns (after 3+ spaces) are comments
const tt = (s) => {
  const segs = s.trim().split(/ {3,}/);
  return segs.map((x, i) => (i === 0 ? mathify(x, true) : `\\quad\\textcolor{gray}{${mathify(x, false)}}`)).join('');
};
let katexErrors = 0;
function kx(tex, plain) {
  try {
    const html = katex.renderToString(tex, { displayMode: true, throwOnError: true, strict: 'ignore', output: 'htmlAndMathml' });
    return html;
  } catch (e) {
    katexErrors++;
    console.error('katex fallback:', e.message.slice(0, 120));
    return `<pre class="nb-pre">${esc(plain)}</pre>`;
  }
}
const isRules = (s) => /─{5,}/.test(s);
function isGrammar(s) {
  const ls = s.split('\n').filter((l) => l.trim());
  if (ls.some((l) => /::=/.test(l))) return true;
  const prod = ls.filter((l) => /^\s*[A-Za-z_][\w]*\s+=\s/.test(l)).length;
  return prod >= 1 && ls.some((l) => /\s\.\s*(\(.*\))?\s*$/.test(l)) && !TOP.test(ls[0].trim());
}
function grammarBlock(s) {
  const rows = [];
  const names = [];
  for (const l of s.split('\n')) {
    if (!l.trim()) { rows.push('\\\\[-0.6em]'); continue; }
    const m = l.match(/^\s*(\S+)\s+(=|::=)\s+(.*)$/);
    if (m && !/^[|(]/.test(m[1])) { names.push(m[1]); rows.push(`\\textsf{${tx(m[1])}} & ${m[2] === '=' ? '=' : '::='} & ${tt(m[3])} \\\\`); }
    else rows.push(`& & ${tt(l)} \\\\`);
  }
  const tex = `\\begin{array}{rcl}${rows.join('\n')}\\end{array}`;
  return { html: kx(tex, s), names };
}
function rulesBlock(s) {
  const out = []; const names = [];
  const groups = s.split(/\n\s*\n/).filter((g) => g.trim());
  for (const g of groups) {
    const ls = g.split('\n').filter((l) => l.trim());
    const bar = ls.findIndex((l) => /─{5,}/.test(l));
    if (bar < 0) { out.push(`<pre class="nb-pre">${esc(g)}</pre>`); continue; }
    const nm = (ls[bar].match(/\[([^\]]+)\]/) || [])[1] || '';
    if (nm) names.push(nm);
    const prem = ls.slice(0, bar).map((l) => l.trim().split(/ {3,}/).map((p) => mathify(p, false)).join('\\qquad '));
    const concl = ls.slice(bar + 1).map((l) => mathify(l.trim(), false));
    const tex = `\\dfrac{\\begin{array}{c}${prem.join('\\\\') || '\\,'}\\end{array}}{\\begin{array}{c}${concl.join('\\\\')}\\end{array}}${nm ? `\\;\\textsf{[${tx(nm)}]}` : ''}`;
    out.push(kx(tex, g));
  }
  return { html: out.join('\n'), names };
}
function formal(kind, names, html, src) {
  const what = kind === 'grammar' ? 'Grammar' : 'Typing rules';
  const list = names.length ? `: ${names.slice(0, 8).join(', ')}${names.length > 8 ? `, and ${names.length - 8} more` : ''}` : '';
  return `<details class="nb-cell nb-formal"><summary><span class="nb-label">${what}</span> ${esc(list.replace(/^: /, ''))}</summary><div class="nb-math">${html}</div><details class="nb-plain"><summary>Plain text of this block</summary><pre class="nb-pre">${esc(src)}</pre></details></details>`;
}

function codeNode(lang, src) {
  if (isRules(src)) { const r = rulesBlock(src); return formal('rules', r.names, r.html, src); }
  if (isGrammar(src)) { const r = grammarBlock(src); return formal('grammar', r.names, r.html, src); }
  const first = (src.split('\n').find((l) => l.trim()) || '').trim();
  const res = check(src);
  if (res.stage !== 'parse') return cell(src);
  return `<pre class="nb-pre"><code>${esc(src)}</code></pre>`;
}

function remarkCells() {
  return (tree) => {
    const walk = (n) => {
      if (!n.children) return;
      n.children = n.children.map((c) => (c.type === 'code' ? { type: 'html', value: codeNode(c.lang, c.value) } : (walk(c), c)));
    };
    walk(tree);
  };
}
const md = unified().use(remarkParse).use(remarkGfm).use(remarkCells).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeStringify);
// the book's figures are served from this site: copy docs/figures/<name> of the checkout to public/figures/rce/spec/<name>
const figures = new Set();
const render = (s) => String(md.processSync(s)).replace(/https:\/\/raw\.githubusercontent\.com\/openIE-dev\/rce\/main\/docs\/figures\/([^"]+)/g, (_, f) => { figures.add(f); return '/figures/rce/spec/' + f; });

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function splitSections(body) {
  const lines = body.split('\n');
  const secs = [{ title: null, lines: [] }];
  let fence = false;
  for (const l of lines) {
    if (/^```/.test(l)) fence = !fence;
    if (!fence && /^### /.test(l)) { secs.push({ title: l.slice(4).trim(), lines: [] }); continue; }
    secs[secs.length - 1].lines.push(l);
  }
  return secs;
}

function chapter(file) {
  let text = fs.readFileSync(path.join(BOOK, file), 'utf8');
  const fm = text.match(/\n<!-- body-sha256: ([0-9a-f]{64}) -->\n?$/);
  const hash = fm ? fm[1] : '';
  text = fm ? text.slice(0, fm.index) : text;
  const qm = text.match(/\n\*\*Read receipt\.\*\* (.*)\n*$/);
  const question = qm ? qm[1].trim() : '';
  if (qm) text = text.slice(0, qm.index);
  const hm = text.match(/^#{1,2} (.*)\n/);
  const title = hm ? hm[1].trim() : file;
  if (hm) text = text.slice(hm[0].length);
  const secs = splitSections(text).map((s, i) => ({
    id: s.title ? slugify(s.title) : 'intro',
    title: s.title,
    html: render(s.lines.join('\n')),
  }));
  const stem = file.replace(/\.md$/, '');
  return { file, slug: stem.replace(/^\d\d-/, ''), num: stem.slice(0, 2), title, hash, question, sections: secs };
}

const files = fs.readdirSync(BOOK).filter((f) => /^\d\d-.*\.md$/.test(f)).sort();
const chapters = files.map(chapter);
const protocol = chapter('READ-PROTOCOL.md');

// example programs
const EX = path.join(SPEC, 'examples');
const groups = [
  { dir: '', id: 'accepted', title: 'Accepted programs', note: 'Each of these is accepted: it parses, type-checks, and every example and check inside it holds.' },
  { dir: 'reject', id: 'syntax', title: 'Syntax rejects', note: 'Each of these is not in the language of the grammar and is refused before type checking.' },
  { dir: 'ill_typed', id: 'ill-typed', title: 'Ill-typed programs', note: 'Each of these parses but breaks a typing, ownership or well-formedness rule.' },
  { dir: 'inadmissible', id: 'inadmissible', title: 'Inadmissible programs', note: 'Each of these type-checks but fails the admission gate: an example, a check, a comptime block or a constant does not hold when evaluated.' },
];
const examples = [];
const byRule = {};
for (const g of groups) {
  const d = path.join(EX, g.dir);
  const items = fs.readdirSync(d).filter((f) => f.endsWith('.rce')).sort().map((f) => {
    const src = fs.readFileSync(path.join(d, f), 'utf8').replace(/\n+$/, '');
    const known = /^use shop\.pricing/m.test(src) ? 'shop.pricing' : '';
    const p = path.join('spec/examples', g.dir, f);
    const r = summarize(check(src, known));
    const want = g.dir === '' ? r.ok : !r.ok;
    if (!want) throw new Error(`example ${p} does not give the expected result: ${JSON.stringify(r)}`);
    if (r.rule) (byRule[r.rule] ||= []).push(p);
    return { path: p, name: f, html: cell(src, { expect: true, known, label: p }) };
  });
  examples.push({ ...g, items });
}

const out = { commit, generated: new Date().toISOString(), keywords: KEYWORDS, chapters, protocol, examples, byRule, cells: cellN, katexErrors };
fs.writeFileSync(OUT, JSON.stringify(out));
console.log(`chapters ${chapters.length}, cells ${cellN}, examples ${examples.reduce((a, g) => a + g.items.length, 0)}, katex fallbacks ${katexErrors}, commit ${commit}`);
console.log(`figures to copy from docs/figures/ to public/figures/rce/spec/: ${[...figures].sort().join(', ')}`);
