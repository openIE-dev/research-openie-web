from markdown_it import MarkdownIt
import mistune, cbor2, msgpack
cm=MarkdownIt('commonmark'); gf=MarkdownIt('gfm-like') if False else MarkdownIt('commonmark').enable('table')
cases={"emph":"*a **b* c**","html":"<script>alert(1)</script>\n\ntext","link js":"[x](javascript:alert(1))","autolink":"<https://a.b/\"onmouseover=x>","setext":"a\n---","indent":"    code\n","nested":"> "*50+"x","tabs":"-\ta\n\t- b","entity":"&#0; &#x110000;","bq_lazy":"> a\nb"}
for k,v in cases.items():
    print("M",k,repr(v[:30]),"-> cm:",repr(cm.render(v)[:90]),"| mistune:",repr(mistune.html(v)[:90]))
# CommonMark default of markdown-it: html allowed? 
print("M markdown-it(commonmark) html passthrough:",MarkdownIt('commonmark').render("<img src=x onerror=alert(1)>"))
print("M markdown-it(default) html:",MarkdownIt().render("<img src=x onerror=alert(1)>"))
print("M link js in default:",MarkdownIt().render("[x](javascript:alert(1))"))
# CBOR
print("B cbor2 dup map keys: ", cbor2.loads(bytes.fromhex("a2616101616102")))
print("B cbor2 non-shortest int 1 as 0x1801:", cbor2.loads(bytes.fromhex("1801")), "canonical 0x01 differs:", bytes.fromhex("1801")!=cbor2.dumps(1))
print("B cbor2 indefinite array:", cbor2.loads(bytes.fromhex("9f0102ff")), "vs definite", cbor2.dumps([1,2]).hex())
print("B cbor2 canonical dumps {b:1,a:2}:", cbor2.dumps({"b":1,"a":2},canonical=True).hex(), "default:",cbor2.dumps({"b":1,"a":2}).hex())
print("B cbor2 NaN encodings:", cbor2.dumps(float('nan')).hex())
# msgpack
print("B msgpack dup keys:", msgpack.unpackb(bytes.fromhex("82a16101a16102"),strict_map_key=False))
print("B msgpack int 1 as uint64:", msgpack.unpackb(bytes.fromhex("cf0000000000000001")), "vs", msgpack.packb(1).hex())
print("B msgpack float32 vs 64 for 1.0:", msgpack.packb(1.0).hex(), msgpack.packb(1.0,use_single_float=True).hex())
