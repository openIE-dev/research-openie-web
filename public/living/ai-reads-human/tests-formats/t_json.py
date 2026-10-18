import json,sys,subprocess
print("python",sys.version.split()[0])
# T1 duplicate keys
print("T1 dup keys python:", json.loads('{"a":1,"a":2}'))
# T2 big int / float precision
print("T2 python int 2**53+1:", json.loads('9007199254740993'), "as float:", json.loads('9007199254740993.0'))
print("T3 1e400 python:", json.loads('1e400'))
print("T4 -0 python:", repr(json.loads('-0')), repr(json.loads('-0.0')))
print("T5 lone surrogate python:", ascii(json.loads('"\\uDEAD"')))
try: json.loads('"\\uDEAD"').encode('utf-8')
except Exception as e: print("   encode utf-8 ->", type(e).__name__)
print("T6 NaN accepted by python json.loads:", json.loads('NaN'), json.loads('Infinity'))
print("T7 dumps default NaN:", json.dumps(float('nan')))
print("T8 non-canon: equal values, different text:", json.dumps({"b":1,"a":2}), json.dumps({"a":2,"b":1}), json.loads('{"a":1.0}')=={"a":1})
try: json.loads('['*100000+']'*100000)
except RecursionError as e: print("T9 deep nesting python: RecursionError (non-total unless caught)")
print("T10 escaped vs literal key equal:", json.loads('{"a\\\\b":1}')==json.loads('{"a\\u005cb":1}'))
