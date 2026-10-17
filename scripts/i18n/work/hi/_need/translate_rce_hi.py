#!/usr/bin/env python3
"""Translate RCE English -> Hindi via gemma4; small chunks; resume-safe; anti-repetition."""
from pathlib import Path
import re, json, urllib.request, time, sys

ROOT = Path(__file__).resolve().parents[5]
WORK = Path(__file__).resolve().parent
OUT_SECS = WORK / 'secs'
OUT_SECS.mkdir(exist_ok=True)
MODEL = 'gemma4:latest'
MAX_CHUNK = 1100

HEAD_MAP = {}
for line in (WORK / 'heading_map.txt').read_text().splitlines():
    if not line.strip():
        continue
    e, h = line.split('\t', 1)
    HEAD_MAP[e] = h

GLOSS = (WORK / 'glossary_hi.txt').read_text()

SYSTEM = f"""You are a professional Hindi translator for OpenIE research papers.
Translate English markdown into Hindi (Devanagari).

RULES:
1. Faithful translation only. Same facts, same order, similar length. Do NOT add explanations, do NOT repeat words or phrases.
2. Keep unchanged: math ($...$), citations [n], backticks/code, numbers, commit hashes, URLs, link targets, image paths.
3. Never use em dash (—) or en dash (–); use comma or hyphen.
4. Keep English proper names: RCE, Reality Code Engine, Form, OpenIE, Defects4J, SWE-bench, System One, Software Heritage, Rosetta Code, Lean, Kani, Z3, WASM, XState, SCXML, MiniRust, WebAssembly, GitHub, Python, Rust, JavaScript, Java, and labels G0-G4, L0-L7, T1-T34, U1-U4, R1-R8, H1, H2, est_j, reported_j, measured_j.
5. Glossary stems (inflect as needed):
{GLOSS}
Also: Figure N=आकृति N; Section N=खंड N; Appendix=परिशिष्ट; Version=संस्करण; Specification=विनिर्देश; draft=मसौदा; source=स्रोत; Playground=Playground; reference checker=संदर्भ चेकर; Engine demo=इंजन डेमो; theorem=प्रमेय; proved=सिद्ध; tested=परीक्षित; module=मॉड्यूल; errata=शुद्धिपत्र; paper=शोधपत्र.
6. Output ONLY the Hindi markdown. No preface. Translate captions and alt text.
7. Use । for Hindi sentence ends in prose.
"""

def degenerate(text: str) -> bool:
    if len(text) < 5:
        return True
    # same word 12+ times in a row
    if re.search(r'(\S+)(?:\s+\1){11,}', text):
        return True
    # any token dominates
    toks = re.findall(r'[\u0900-\u097F]{2,}', text)
    if toks:
        from collections import Counter
        c = Counter(toks)
        w, n = c.most_common(1)[0]
        if n >= 25 and n > 0.15 * len(toks):
            return True
    return False

def ollama(prompt: str, attempt: int = 0) -> str:
    opts = {
        'temperature': 0.05 + 0.05 * attempt,
        'num_predict': 3072,
        'repeat_penalty': 1.25 + 0.05 * attempt,
        'top_p': 0.9,
    }
    body = {
        'model': MODEL,
        'prompt': prompt,
        'system': SYSTEM,
        'stream': False,
        'think': False,
        'options': opts,
    }
    req = urllib.request.Request(
        'http://127.0.0.1:11434/api/generate',
        data=json.dumps(body).encode(),
        headers={'Content-Type': 'application/json'},
    )
    with urllib.request.urlopen(req, timeout=600) as resp:
        data = json.loads(resp.read())
    text = data.get('response', '')
    text = re.sub(r'<think>[\s\S]*?</think>', '', text).strip()
    if text.startswith('```'):
        text = re.sub(r'^```(?:markdown|md)?\n', '', text)
        text = re.sub(r'\n```$', '', text)
    text = text.replace('\u2014', ', ').replace('\u2013', '-')
    return text.strip() + '\n'

def split_heads(text):
    parts = []
    lines = text.splitlines(keepends=True)
    cur_h = '__preamble__'
    cur = []
    for line in lines:
        m = re.match(r'^(#{2,4}) (.+)$', line)
        if m:
            parts.append((cur_h, ''.join(cur)))
            cur_h = m.group(0).rstrip()
            cur = []
        else:
            cur.append(line)
    parts.append((cur_h, ''.join(cur)))
    return parts

def load_en():
    t = (ROOT / 'src/content/papers/rce.md').read_text()
    t = t.split('---', 2)[2].lstrip('\n')
    t = re.sub(r'^# .+\n+', '', t, count=1)
    m = re.search(r'^## References\s*$', t, re.M)
    t = t[: m.end()] + '\n'
    return split_heads(t)

def chunk_paragraphs(body: str):
    if len(body) <= MAX_CHUNK:
        return [body]
    # Prefer blank-line splits; fall back to sentence for huge blocks
    blocks = re.split(r'(\n\n+)', body)
    units = []
    i = 0
    while i < len(blocks):
        if i + 1 < len(blocks) and blocks[i + 1].startswith('\n\n'):
            units.append(blocks[i] + blocks[i + 1])
            i += 2
        else:
            units.append(blocks[i])
            i += 1
    chunks, buf = [], ''
    for u in units:
        if len(u) > MAX_CHUNK * 1.5:
            if buf:
                chunks.append(buf)
                buf = ''
            # split long unit by lines
            lines = u.splitlines(keepends=True)
            for line in lines:
                if buf and len(buf) + len(line) > MAX_CHUNK:
                    chunks.append(buf)
                    buf = line
                else:
                    buf += line
            continue
        if buf and len(buf) + len(u) > MAX_CHUNK:
            chunks.append(buf)
            buf = u
        else:
            buf += u
    if buf:
        chunks.append(buf)
    return chunks or [body]

def load_old_hi_map():
    t = (ROOT / 'scripts/i18n/work/hi/rce.md').read_text()
    m = re.search(r'^## संदर्भ\s*$', t, re.M)
    if m:
        t = t[: m.end()] + '\n'
    def key(h):
        if h == '__preamble__':
            return 'pre'
        mm = re.match(r'^#{2,4} ([\d.]+)', h)
        if mm:
            return mm.group(1)
        if 'सार' in h:
            return 'abs'
        if 'संदर्भ' in h:
            return 'ref'
        return h
    return {key(h): c for h, c in split_heads(t)}

def en_key(h):
    if h == '__preamble__':
        return 'pre'
    mm = re.match(r'^#{2,4} ([\d.]+)', h)
    if mm:
        return mm.group(1)
    if 'Abstract' in h:
        return 'abs'
    if 'References' in h:
        return 'ref'
    return h

def translate_body(sec_id: str, en_body: str, hi_hint: str | None):
    out_path = OUT_SECS / f'{sec_id}.md'
    if out_path.exists() and out_path.stat().st_size > 20 and not degenerate(out_path.read_text()):
        return out_path.read_text()
    # empty body (e.g. ## 3. The Form)
    if not en_body.strip():
        out_path.write_text('\n')
        return '\n'
    chunks = chunk_paragraphs(en_body)
    translated = []
    for ci, ch in enumerate(chunks):
        if not ch.strip():
            translated.append(ch)
            continue
        part_path = OUT_SECS / f'{sec_id}.p{ci}.md'
        if part_path.exists() and part_path.stat().st_size > 8 and not degenerate(part_path.read_text()):
            translated.append(part_path.read_text())
            continue
        hint = ''
        if hi_hint and ci == 0:
            hint = (
                '\nPrior Hindi (outdated possible; prefer English; reuse good phrasing):\n'
                + hi_hint[:1800]
                + '\n'
            )
        prompt = (
            f'Translate this English markdown block into Hindi.\n'
            f'Chunk {ci+1}/{len(chunks)} of {sec_id}.\n{hint}\nENGLISH:\n{ch}\n'
        )
        print(f'  {sec_id} {ci+1}/{len(chunks)} ({len(ch)}c)...', flush=True)
        hi = None
        for attempt in range(3):
            t0 = time.time()
            cand = ollama(prompt, attempt)
            # expansion guard: Hindi usually <= 2.5x english for Devanagari bytes ~2x chars
            if degenerate(cand) or len(cand) > max(80, int(len(ch) * 3.5)):
                print(f'    retry {attempt}: deg/long len={len(cand)}', flush=True)
                continue
            hi = cand
            print(f'    ok {time.time()-t0:.1f}s -> {len(hi)}', flush=True)
            break
        if hi is None:
            # last attempt keep even if imperfect
            hi = ollama(prompt + '\nIMPORTANT: do not repeat any word. Be concise.\n', 2)
            print(f'    fallback len={len(hi)} deg={degenerate(hi)}', flush=True)
        part_path.write_text(hi)
        translated.append(hi)
    text = ''.join(translated)
    text = re.sub(r'\n{3,}', '\n\n', text)
    if not text.endswith('\n'):
        text += '\n'
    out_path.write_text(text)
    return text

def main():
    en_parts = load_en()
    old_hi = load_old_hi_map()
    print(f'Sections {len(en_parts)} model={MODEL}', flush=True)
    assembled = []
    for idx, (h, body) in enumerate(en_parts):
        k = en_key(h)
        sec_id = f'{idx:02d}_{k}'
        print(f'[{idx}] {h[:70]}', flush=True)
        if k == 'ref' or 'References' in h:
            assembled.append(HEAD_MAP[h] + '\n')
            continue
        hi_body = translate_body(sec_id, body, old_hi.get(k))
        if h == '__preamble__':
            # ensure italic version line
            b = hi_body.strip()
            if not b.startswith('*'):
                b = '*' + b.strip('*') + '*'
            assembled.append(b + '\n\n')
        else:
            assembled.append(HEAD_MAP[h] + '\n\n')
            b = hi_body.lstrip('\n')
            if b.startswith('#'):
                b = re.sub(r'^#{2,4} .+\n+', '', b, count=1)
            assembled.append(b if b.endswith('\n') else b + '\n')
            if idx < len(en_parts) - 1 and not assembled[-1].endswith('\n\n'):
                assembled.append('\n')
    out = ''.join(assembled).replace('\u2014', ', ').replace('\u2013', '-')
    staging = WORK / 'rce_new.md'
    staging.write_text(out)
    heads = re.findall(r'^(#{2,4}) (.+)$', out, re.M)
    print('heading count', len(heads), 'chars', len(out))
    print('first', heads[0] if heads else None)
    print('last', heads[-1] if heads else None)
    # copy to work/hi/rce.md only if 47
    if len(heads) == 47:
        final = WORK.parent / 'rce.md'
        final.write_text(out)
        print('wrote', final)
    else:
        print('NOT copying: heading mismatch')
    print('wrote staging', staging)

if __name__ == '__main__':
    main()
