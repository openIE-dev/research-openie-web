console.log("node",process.version);
console.log("N1 dup keys:",JSON.stringify(JSON.parse('{"a":1,"a":2}')));
console.log("N2 2^53+1:",JSON.parse('9007199254740993'));
console.log("N3 1e400:",JSON.parse('1e400'));
console.log("N4 -0:",Object.is(JSON.parse('-0'),-0), "stringify(-0):",JSON.stringify(-0));
console.log("N5 lone surrogate:",JSON.stringify(JSON.parse('"\\uDEAD"')), "len",JSON.parse('"\\uDEAD"').length);
console.log("N6 key order integer-like keys:",JSON.stringify(JSON.parse('{"b":1,"2":1,"a":1,"1":1}')));
console.log("N7 __proto__ key:",Object.keys(JSON.parse('{"__proto__":{"x":1}}')),JSON.parse('{"__proto__":{"x":1}}').x);
try{JSON.parse('['.repeat(200000)+']'.repeat(200000))}catch(e){console.log("N8 deep:",e.constructor.name)}
console.log("N9 3.141592653589793238462643383279:",JSON.parse('3.141592653589793238462643383279'));
console.log("N10 0.1+0.2 stringify:",JSON.stringify(0.1+0.2));
