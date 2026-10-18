import json,unicodedata,sys
a="\u00e9"; b="e\u0301"
d=json.loads(json.dumps({a:1,b:2},ensure_ascii=False))
print("U1 NFC vs NFD keys remain distinct (2 members):",len(d),"; NFC(a)==NFC(b):",unicodedata.normalize('NFC',a)==unicodedata.normalize('NFC',b))
k=["\uffee","\U0001F600"]  # U+FFEE vs U+1F600
print("U2 sort by code point:",[hex(ord(x[0])) for x in sorted(k)])
print("U2 sort by UTF-16 code units (JCS):",[hex(ord(x[0])) for x in sorted(k,key=lambda s:s.encode('utf-16-be'))])
print("U3 same value, different texts:",[json.loads(x) for x in ["1","1.0","1e0","10E-1","0.1e1"]])
print("U3 python types:",[type(json.loads(x)).__name__ for x in ["1","1.0","1e0"]])
print("U4 \\u0000 in key accepted:",json.loads('{"a\\u0000b":1}'))
print("U5 homoglyph keys Latin a vs Cyrillic a distinct:",len({"a":1,"\u0430":2}))
print("U6 BOM: json.loads str with BOM:",end=' ')
try: json.loads('\ufeff{}')
except Exception as e: print(type(e).__name__)
print("U6 json.loads bytes with BOM:",json.loads(b'\xef\xbb\xbf{}'))
