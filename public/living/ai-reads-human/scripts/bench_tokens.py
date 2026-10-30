#!/usr/bin/env python3
"""Bytes per token and tokens per record for each encoding, with open tokenizers.
Binary files are tokenized as latin-1 text only for the base64 and hex views (binary is not LLM-readable directly)."""
import os, sys, json, base64, time
import tiktoken
from tokenizers import Tokenizer
D = os.path.join(os.path.dirname(__file__), '..', 'data')
N = len(json.load(open(os.path.join(D, 'recs.json'))))
S = int(sys.argv[1]) if len(sys.argv) > 1 else 2000   # records-worth prefix sample (full file is N records)
toks = {}
for n in ['cl100k_base', 'o200k_base']:
    e = tiktoken.get_encoding(n); toks[n] = lambda s, e=e: len(e.encode(s, disallowed_special=()))
for n, r in [('gpt2', 'gpt2'), ('mistral-7b', 'mistralai/Mistral-7B-v0.1'), ('qwen2.5', 'Qwen/Qwen2.5-0.5B')]:
    t = Tokenizer.from_pretrained(r); toks[n] = lambda s, t=t: len(t.encode(s, add_special_tokens=False).ids)
files = ['recs.json', 'recs_pretty.json', 'recs.jsonl', 'recs.yaml', 'recs.xml', 'recs.csv', 'recs.toml', 'recs_table.md', 'recs_list.md']
def prefix(b, k):
    if b[:2] == b"[{":  # single-line JSON array: cut at record boundary
        i = b.find(b'},{', 0); cnt = 0
        for _ in range(k):
            i = b.find(b'},{', i + 1)
        return b[:i + 1] + b']'
    if False: pass  # first k records' worth of bytes, cut at line boundary proportional to size
    cut = int(len(b) * k / N); i = b.find(b'\n', cut); return b[:i if i > 0 else len(b)]
print('# sample = first %d of %d records; tokens per record = tokens / %d (prefix is cut at a line end, so per-record is approximate to <1 record)' % (S, N, S))
print('view\tsrc_bytes\tbytes_per_record\t' + '\t'.join('%s:B/tok\t%s:tok/rec' % (k, k) for k in toks))
rows = [(f, prefix(open(os.path.join(D, f), 'rb').read(), S).decode()) for f in files]
bin_ = open(os.path.join(D, 'recs.bin'), 'rb').read()[:S * 23]
rows.append(('recs.bin as base64', base64.b64encode(bin_).decode())); rows.append(('recs.bin as hex', bin_.hex()))
rows.append(('recs.msgpack as base64', base64.b64encode(open(os.path.join(D, 'recs.msgpack'), 'rb').read()[:int(1660773 * S / N)]).decode()))
for name, s in rows:
    nb = len(s.encode()); out = []
    for k, f in toks.items():
        nt = f(s); out.append('%.3f\t%.1f' % (nb / nt, nt / S))
    print('%s\t%d\t%.1f\t%s' % (name, nb, nb / S, '\t'.join(out)))
