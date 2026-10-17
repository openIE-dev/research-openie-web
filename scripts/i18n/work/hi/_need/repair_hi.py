#!/usr/bin/env python3
"""Re-translate contaminated chunk files with a minimal prompt; reassemble work/hi/rce.md."""
from pathlib import Path
import re, json, urllib.request, time
from collections import Counter

ROOT = Path(__file__).resolve().parents[5]
WORK = Path(__file__).resolve().parent
OUT_SECS = WORK / 'secs'
MODEL = 'gemma4:latest'
MAX_CHUNK = 1100

HEAD_MAP = {}
for line in (WORK / 'heading_map.txt').read_text().splitlines():
    if not line.strip():
        continue
    e, h = line.split('\t', 1)
    HEAD_MAP[e] = h

GLOSS = (WORK / 'glossary_hi.txt').read_text()
SYSTEM = f"""Translate English technical markdown to Hindi (Devanagari).
Faithful only; do not expand; do not repeat words.
Keep math, [n] citations, backticks, numbers, hashes, URLs, image paths unchanged.
No em dash or en dash (use comma or hyphen).
Keep names: RCE, Form, OpenIE, Defects4J, SWE-bench, System One, Software Heritage, Rosetta Code, Lean, Kani, Z3, and labels G0-G4, L0-L7, T1-T34, U1-U4, est_j, reported_j, measured_j.
Glossary: {GLOSS}
Figure N→आकृति N; Section N→खंड N; Appendix→परिशिष्ट; Version→संस्करण; Specification→विनिर्देश; draft→मसौदा; source→स्रोत; Playground→Playground; Engine demo→इंजन डेमो; theorem→प्रमेय; module→मॉड्यूल; paper→शोधपत्र.
Output ONLY Hindi markdown. No labels, no English echo, no commentary."""

def degenerate(text: str) -> bool:
    if len(text) < 3:
        return True
    if re.search(r'(\S+)(?:\s+\1){11,}', text):
        return True
    toks = re.findall(r'[\u0900-\u097F]{2,}', text)
    if toks:
        w, n = Counter(toks).most_common(1)[0]
        if n >= 25 and n > 0.15 * len(toks):
            return True
    return False

def contaminated(text: str) -> bool:
    if re.search(r'चंक\s|Chunk\s|ENGLISH:|अंग्रेजी:|Prior Hindi|पूर्व हिंदी|Translate this|of \d+_|\d+/\d+ ऑफ', text):
        return True
    # mostly English paragraph at start
    head = text[:400]
    latin = len(re.findall(r'[A-Za-z]', head))
    deva = len(re.findall(r'[\u0900-\u097F]', head))
    if latin > 80 and latin > 2 * (deva + 1):
        return True
    return False

def ollama(en: str, attempt=0) -> str:
    body = {
        'model': MODEL,
        'prompt': en,
        'system': SYSTEM,
        'stream': False,
        'think': False,
        'options': {
            'temperature': 0.05 + 0.05 * attempt,
            'num_predict': 3072,
            'repeat_penalty': 1.3,
            'top_p': 0.9,
        },
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
    # strip accidental meta if any
    text = re.sub(r'^(चंक|Chunk|ENGLISH:|अंग्रेजी:|हिंदी:).*\n+', '', text)
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

def chunk_paragraphs(body: str):
    if len(body) <= MAX_CHUNK:
        return [body]
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
            for line in u.splitlines(keepends=True):
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

def load_en():
    t = (ROOT / 'src/content/papers/rce.md').read_text()
    t = t.split('---', 2)[2].lstrip('\n')
    t = re.sub(r'^# .+\n+', '', t, count=1)
    m = re.search(r'^## References\s*$', t, re.M)
    t = t[: m.end()] + '\n'
    return split_heads(t)

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

def main():
    en_parts = load_en()
    repaired = 0
    for idx, (h, body) in enumerate(en_parts):
        k = en_key(h)
        sec_id = f'{idx:02d}_{k}'
        if k == 'ref':
            continue
        if not body.strip():
            (OUT_SECS / f'{sec_id}.md').write_text('\n')
            continue
        chunks = chunk_paragraphs(body)
        translated = []
        for ci, ch in enumerate(chunks):
            if not ch.strip():
                translated.append(ch)
                continue
            part = OUT_SECS / f'{sec_id}.p{ci}.md'
            need = True
            if part.exists():
                old = part.read_text()
                if not contaminated(old) and not degenerate(old) and len(old) <= max(100, int(len(ch) * 3.5)):
                    need = False
                    translated.append(old)
            if need:
                print(f'repair {sec_id}.p{ci} ({len(ch)}c)...', flush=True)
                hi = None
                for attempt in range(4):
                    t0 = time.time()
                    cand = ollama(ch, attempt)
                    if contaminated(cand) or degenerate(cand) or len(cand) > max(80, int(len(ch) * 3.5)):
                        print(f'  retry {attempt} len={len(cand)} cont={contaminated(cand)} deg={degenerate(cand)}', flush=True)
                        continue
                    hi = cand
                    print(f'  ok {time.time()-t0:.1f}s -> {len(hi)}', flush=True)
                    break
                if hi is None:
                    hi = ollama(ch + '\n', 3)
                    # hard strip meta lines
                    hi = '\n'.join(
                        ln for ln in hi.splitlines()
                        if not re.search(r'चंक|Chunk |ENGLISH:|अंग्रेजी:|पूर्व हिंदी|Prior Hindi', ln)
                    ) + '\n'
                    print(f'  forced len={len(hi)}', flush=True)
                part.write_text(hi)
                translated.append(hi)
                repaired += 1
        text = re.sub(r'\n{3,}', '\n\n', ''.join(translated))
        if not text.endswith('\n'):
            text += '\n'
        (OUT_SECS / f'{sec_id}.md').write_text(text)

    # assemble
    assembled = []
    for idx, (h, body) in enumerate(en_parts):
        k = en_key(h)
        sec_id = f'{idx:02d}_{k}'
        if k == 'ref' or 'References' in h:
            assembled.append(HEAD_MAP[h] + '\n')
            continue
        hi_body = (OUT_SECS / f'{sec_id}.md').read_text()
        if h == '__preamble__':
            b = hi_body.strip()
            if not b.startswith('*'):
                # wrap first line if needed
                if b.startswith('संस्करण') or 'संस्करण' in b[:30]:
                    b = '*' + b.strip('*') + '*'
            assembled.append(b + '\n\n')
        else:
            assembled.append(HEAD_MAP[h] + '\n\n')
            b = hi_body.lstrip('\n')
            if b.startswith('#'):
                b = re.sub(r'^#{2,4} .+\n+', '', b, count=1)
            assembled.append(b if b.endswith('\n') else b + '\n')
            assembled.append('\n')
    out = ''.join(assembled).replace('\u2014', ', ').replace('\u2013', '-')
    # final contamination scrub on whole file
    out = re.sub(r'^.*(?:चंक\s|Chunk\s\d|ENGLISH:|अंग्रेजी:|पूर्व हिंदी|Prior Hindi).*\n', '', out, flags=re.M)
    heads = re.findall(r'^(#{2,4}) (.+)$', out, re.M)
    print('repaired_chunks', repaired, 'headings', len(heads), 'chars', len(out))
    staging = WORK / 'rce_new.md'
    staging.write_text(out)
    if len(heads) == 47 and '\u2014' not in out and '\u2013' not in out:
        (WORK.parent / 'rce.md').write_text(out)
        print('wrote work/hi/rce.md')
    else:
        print('NOT writing final; check headings/dashes')
    # report leftover contamination
    for p in ['चंक ', 'ENGLISH:', 'अंग्रेजी:', 'पूर्व हिंदी']:
        print(p, out.count(p))

if __name__ == '__main__':
    main()
