/* Interactive Observatory for RCE Compile (/living/rce-compile/) */
(function () {
  'use strict';

  var D = window.RCE_COMPILE_DATA;
  if (!D) return;

  // Theme toggle matching OpenIE Living Labs
  var themeBtn = document.getElementById('theme-toggle');
  var themeLbl = document.getElementById('theme-label');
  var modes = ['auto', 'dark', 'light'];
  function applyTheme(m) {
    localStorage.setItem('oe-theme', m);
    var res = m === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : m;
    document.documentElement.setAttribute('data-theme', res);
    document.documentElement.style.colorScheme = res;
    if (themeLbl) themeLbl.textContent = m.charAt(0).toUpperCase() + m.slice(1);
  }
  applyTheme(localStorage.getItem('oe-theme') || 'auto');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = localStorage.getItem('oe-theme') || 'auto';
      applyTheme(modes[(modes.indexOf(cur) + 1) % modes.length]);
    });
  }

  // Standard synchronous SHA-256 (FIPS 180-4 constants derived from prime roots)
  var H_INIT = [], K_ROUND = [];
  (function initSha256Tables() {
    function isPrime(n) {
      for (var d = 2; d * d <= n; d++) if (n % d === 0) return false;
      return true;
    }
    function frac32(x) { return ((x - Math.floor(x)) * 0x100000000) >>> 0; }
    var p = 2, count = 0;
    while (count < 64) {
      if (isPrime(p)) {
        if (count < 8) H_INIT.push(frac32(Math.pow(p, 1 / 2)));
        K_ROUND.push(frac32(Math.pow(p, 1 / 3)));
        count++;
      }
      p++;
    }
  })();

  function rotr(x, n) { return ((x >>> n) | (x << (32 - n))) >>> 0; }

  function sha256Hex(str) {
    var bytes = new TextEncoder().encode(str);
    var bitLen = bytes.length * 8;
    var padLen = ((bytes.length + 9 + 63) & ~63);
    var buf = new Uint8Array(padLen);
    buf.set(bytes);
    buf[bytes.length] = 0x80;
    var dv = new DataView(buf.buffer);
    dv.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000), false);
    dv.setUint32(padLen - 4, bitLen >>> 0, false);

    var h = H_INIT.slice();
    var w = new Uint32Array(64);
    for (var off = 0; off < padLen; off += 64) {
      for (var i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4, false);
      for (var j = 16; j < 64; j++) {
        var s0 = rotr(w[j - 15], 7) ^ rotr(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        var s1 = rotr(w[j - 2], 17) ^ rotr(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) >>> 0;
      }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (var r = 0; r < 64; r++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        var ch = (e & f) ^ ((~e) & g);
        var t1 = (hh + S1 + ch + K_ROUND[r] + w[r]) >>> 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) >>> 0;
        hh = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
      h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0; h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
    }
    return h.map(function (v) { return ('00000000' + v.toString(16)).slice(-8); }).join('');
  }

  // URL synchronization helper
  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    var u = new URL(window.location.href);
    u.searchParams.set('kernel', document.getElementById('sel-kernel').value);
    u.searchParams.set('low', document.getElementById('sel-low').value);
    u.searchParams.set('high', document.getElementById('sel-high').value);
    u.searchParams.set('logN', document.getElementById('s-logn').value);
    u.searchParams.set('rail', document.getElementById('sel-rail').value);
    u.searchParams.set('snippet', document.getElementById('sel-snippet').value);
    u.searchParams.set('family', document.getElementById('sel-family').value);
    window.history.replaceState(null, '', u.pathname + u.search + u.hash);
  }

  // -------------------------------------------------------------------------
  // Panel 1 (rc-diag-01): E4-Energy Payback Horizon Explorer
  // -------------------------------------------------------------------------
  var selKernel = document.getElementById('sel-kernel');
  var selLow = document.getElementById('sel-low');
  var selHigh = document.getElementById('sel-high');
  var selRail = document.getElementById('sel-rail');
  var sLogN = document.getElementById('s-logn');

  var kKeys = Object.keys(D.kernels);
  kKeys.forEach(function (k) {
    var opt = document.createElement('option');
    opt.value = k;
    opt.textContent = (k === 'median_20_kernels' ? '★ 20-Kernel Median Aggregate' : k + ' (' + D.kernels[k].domain + ')');
    selKernel.appendChild(opt);
  });

  var tierNames = Object.keys(D.kernels.median_20_kernels.tiers);
  tierNames.forEach(function (tn) {
    var o1 = document.createElement('option');
    o1.value = tn; o1.textContent = tn;
    selLow.appendChild(o1);
    var o2 = document.createElement('option');
    o2.value = tn; o2.textContent = tn;
    selHigh.appendChild(o2);
  });
  selLow.value = 'clang -O0';
  selHigh.value = 'clang -O3';

  function fmtJ(j) {
    if (j < 1e-3) return (j * 1e6).toFixed(2) + ' µJ';
    if (j < 1) return (j * 1e3).toFixed(2) + ' mJ';
    if (j < 1000) return j.toFixed(3) + ' J';
    return (j / 1000).toFixed(2) + ' kJ';
  }

  function fmtN(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return Math.round(n).toLocaleString();
    return String(Math.round(n));
  }

  function renderPayback(updateUrl) {
    var kId = selKernel.value;
    var kObj = D.kernels[kId] || D.kernels.median_20_kernels;
    var tLow = kObj.tiers[selLow.value];
    var tHigh = kObj.tiers[selHigh.value];
    var rail = selRail.value; // 'core' or 'pkg'
    var logN = parseFloat(sLogN.value);
    var N = Math.round(Math.pow(10, logN));

    document.getElementById('v-logn').textContent = N.toLocaleString() + ' (10^' + logN.toFixed(2) + ')';
    document.getElementById('k-desc').textContent = kObj.desc + ' · Checksum (2,000 seeds): ' + kObj.csum;

    var ecLow = rail === 'core' ? tLow.cc : tLow.cp;
    var erLow = rail === 'core' ? tLow.rc : tLow.rp;
    var ecHigh = rail === 'core' ? tHigh.cc : tHigh.cp;
    var erHigh = rail === 'core' ? tHigh.rc : tHigh.rp;

    var totLow = ecLow + N * erLow;
    var totHigh = ecHigh + N * erHigh;
    var dComp = ecHigh - ecLow;
    var dRun = erLow - erHigh;

    var nStar, statusText;
    if (dRun <= 0) {
      nStar = Infinity;
      statusText = dComp <= 0 ? 'Cheaper build, slower run' : 'NEVER PAYS BACK (ΔE_run ≤ 0)';
    } else if (dComp <= 0) {
      nStar = 0;
      statusText = 'DOMINATES AT N = 1 (ΔE_compile ≤ 0)';
    } else {
      nStar = Math.ceil(dComp / dRun);
      statusText = N >= nStar ? 'AMORTIZED (N ≥ N*)' : 'PRE-PAYBACK (N < N*)';
    }

    document.getElementById('m-low-tot').textContent = fmtJ(totLow);
    document.getElementById('m-low-sub').textContent = 'Build ' + fmtJ(ecLow) + ' + ' + fmtJ(erLow) + '/call';
    document.getElementById('m-high-tot').textContent = fmtJ(totHigh);
    document.getElementById('m-high-sub').textContent = 'Build ' + fmtJ(ecHigh) + ' + ' + fmtJ(erHigh) + '/call';
    document.getElementById('m-nstar').textContent = nStar === Infinity ? '∞ (Never)' : (nStar === 0 ? '0 (Immediate)' : nStar.toLocaleString() + ' runs');
    document.getElementById('m-nstar-sub').textContent = 'ΔE_comp = ' + (dComp >= 0 ? '+' : '−') + fmtJ(Math.abs(dComp));

    var vEl = document.getElementById('m-verdict');
    vEl.textContent = totHigh < totLow ? ('CANDIDATE WINS (' + (totLow / Math.max(1e-12, totHigh)).toFixed(2) + '×)') : 'BASELINE WINS';
    vEl.style.color = totHigh < totLow ? 'var(--color-brand-cyan)' : 'var(--color-brand-amber)';
    document.getElementById('m-verdict-sub').textContent = statusText;

    // Render live inline SVG chart
    var chart = document.getElementById('payback-live-svg');
    if (chart) {
      var W = 680, H = 210, px = 56, py = 18, pw = 596, ph = 158;
      var ymin = -3, ymax = rail === 'core' ? 4 : 5;
      function sx(lx) { return px + (lx / 9.0) * pw; }
      function sy(ly) { return py + ph - ((Math.max(ymin, Math.min(ymax, ly)) - ymin) / (ymax - ymin)) * ph; }
      var pLow = [], pHigh = [];
      for (var st = 0; st <= 90; st++) {
        var lx = st / 10.0;
        var nn = Math.pow(10, lx);
        pLow.push(sx(lx).toFixed(1) + ',' + sy(Math.log10(Math.max(1e-6, ecLow + nn * erLow))).toFixed(1));
        pHigh.push(sx(lx).toFixed(1) + ',' + sy(Math.log10(Math.max(1e-6, ecHigh + nn * erHigh))).toFixed(1));
      }
      var curX = sx(logN);
      var crossSvg = '';
      if (isFinite(nStar) && nStar > 0 && Math.log10(nStar) <= 9) {
        var cx = sx(Math.log10(nStar));
        var cy = sy(Math.log10(ecHigh + nStar * erHigh));
        crossSvg = '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>' +
          '<text x="' + Math.min(px + pw - 95, cx + 7).toFixed(1) + '" y="' + Math.max(py + 14, cy - 8).toFixed(1) + '" font-size="10.5" fill="#f59e0b" font-family="monospace">N*=' + fmtN(nStar) + '</text>';
      }
      var grid = '';
      for (var gx = 0; gx <= 9; gx += 3) {
        var xx = sx(gx);
        grid += '<line x1="' + xx.toFixed(1) + '" y1="' + py + '" x2="' + xx.toFixed(1) + '" y2="' + (py + ph) + '" stroke="rgba(148,163,184,0.18)"/>' +
          '<text x="' + xx.toFixed(1) + '" y="' + (py + ph + 15) + '" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="monospace">' + (gx === 0 ? '1' : '10^' + gx) + '</text>';
      }
      chart.innerHTML =
        '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" fill="rgba(15,23,42,0.28)" stroke="rgba(148,163,184,0.25)"/>' +
        grid +
        '<line x1="' + curX.toFixed(1) + '" y1="' + py + '" x2="' + curX.toFixed(1) + '" y2="' + (py + ph) + '" stroke="#f59e0b" stroke-dasharray="3,3"/>' +
        '<polyline fill="none" stroke="#94a3b8" stroke-width="2.2" stroke-dasharray="5,3" points="' + pLow.join(' ') + '"/>' +
        '<polyline fill="none" stroke="#00d4aa" stroke-width="2.4" points="' + pHigh.join(' ') + '"/>' +
        crossSvg +
        '<text x="' + (px + 8) + '" y="' + (py + 15) + '" font-size="10.5" fill="#94a3b8" font-family="monospace">Dashed: ' + selLow.value + ' | Solid cyan: ' + selHigh.value + '</text>';
    }

    if (updateUrl) syncUrl();
    return {
      kernel: kId,
      rail: rail + '_reported_j',
      low_tier: selLow.value,
      high_tier: selHigh.value,
      invocations_N: N,
      low_lifecycle_j: +totLow.toFixed(6),
      high_lifecycle_j: +totHigh.toFixed(6),
      n_star: isFinite(nStar) ? nStar : 'never',
      status: statusText
    };
  }

  [selKernel, selLow, selHigh, selRail].forEach(function (el) {
    el.addEventListener('change', function () { renderPayback(true); });
  });
  sLogN.addEventListener('input', function () { renderPayback(true); });

  // -------------------------------------------------------------------------
  // Panel 2 (rc-diag-02): Live E5 De Bruijn vs Naive Identifier-Strip Comparator
  // -------------------------------------------------------------------------
  var SNIPPETS = {
    rce_bank: {
      lang: 'rce',
      label: 'RCE Form · 04_bank_account.rce (Overdraft Gate)',
      orig: 'state Account\n    balance: i64 = 0\n\nevent Withdraw(amount: i64)\nerror Insufficient(need: i64)\n\nstep Account on Withdraw(amount: req)\n    if req > balance\n        fail Insufficient(need: req - balance)\n    balance = balance - req\n',
      alpha: 'state VaultRegion\n    ledger_funds: i64 = 0\n\nevent DebitCmd(amount: i64)\nerror ShortfallErr(need: i64)\n\nstep VaultRegion on DebitCmd(amount: delta)\n    if delta > ledger_funds\n        fail ShortfallErr(need: delta - ledger_funds)\n    ledger_funds = ledger_funds - delta\n',
      fmt: '# Added audit comment header\n\nstate Account\n    balance: i64 = 0\n\n# Event & error declarations\nevent Withdraw(amount: i64)\nerror Insufficient(need: i64)\n\nstep Account on Withdraw(amount: req)\n    if req > balance\n        fail Insufficient(need: req - balance)\n    balance = balance - req\n',
      swap: 'state Account\n    balance: i64 = 0\n\nevent Withdraw(amount: i64)\nerror Insufficient(need: i64)\n\nstep Account on Withdraw(amount: req)\n    if req > balance\n        fail Insufficient(need: balance - req)\n    balance = req - balance\n',
      opbug: 'state Account\n    balance: i64 = 0\n\nevent Withdraw(amount: i64)\nerror Insufficient(need: i64)\n\nstep Account on Withdraw(amount: req)\n    if req >= balance\n        fail Insufficient(need: req - balance)\n    balance = balance + req\n'
    },
    rust_orbital: {
      lang: 'rust',
      label: 'Rust Kernel · k03_q32_orbital (Fixed-Point Step)',
      orig: 'pub fn step_orbit(pos_x: u64, vel_x: u64, accel_x: u64) -> u64 {\n    let mask: u64 = 4294967295;\n    let next_v = (vel_x + mask + 1 - accel_x) & mask;\n    let next_p = (pos_x + (next_v >> 4)) & 1048575;\n    (next_p ^ next_v) & mask\n}\n',
      alpha: 'pub fn step_orbit(x0: u64, v0: u64, ax: u64) -> u64 {\n    let m32: u64 = 4294967295;\n    let v1 = (v0 + m32 + 1 - ax) & m32;\n    let x1 = (x0 + (v1 >> 4)) & 1048575;\n    (x1 ^ v1) & m32\n}\n',
      fmt: '// Symplectic Q16.16 step\npub fn step_orbit( pos_x : u64 , vel_x : u64 , accel_x : u64 ) -> u64 {\n    let mask: u64 = 4294967295; // 32-bit mask\n    let next_v = (vel_x + mask + 1 - accel_x) & mask;\n\n    let next_p = (pos_x + (next_v >> 4)) & 1048575;\n    (next_p ^ next_v) & mask\n}\n',
      swap: 'pub fn step_orbit(pos_x: u64, vel_x: u64, accel_x: u64) -> u64 {\n    let mask: u64 = 4294967295;\n    let next_v = (accel_x + mask + 1 - vel_x) & mask;\n    let next_p = (pos_x + (next_v >> 4)) & 1048575;\n    (next_p ^ next_v) & mask\n}\n',
      opbug: 'pub fn step_orbit(pos_x: u64, vel_x: u64, accel_x: u64) -> u64 {\n    let mask: u64 = 4294967295;\n    let next_v = (vel_x + mask + 1 + accel_x) & mask;\n    let next_p = (pos_x + (next_v >> 4)) & 1048575;\n    (next_p ^ next_v) & mask\n}\n'
    },
    c_token_bucket: {
      lang: 'c',
      label: 'C Kernel · k12_token_bucket (Rate Limiter)',
      orig: 'uint64_t admit_packet(uint64_t tokens, uint64_t cost, uint64_t cap) {\n    uint64_t refilled = tokens + 6ULL;\n    if (refilled > cap) refilled = cap;\n    if (cost <= refilled) {\n        return refilled - cost;\n    }\n    return refilled;\n}\n',
      alpha: 'uint64_t admit_packet(uint64_t bucket_lvl, uint64_t pkt_weight, uint64_t burst_max) {\n    uint64_t updated = bucket_lvl + 6ULL;\n    if (updated > burst_max) updated = burst_max;\n    if (pkt_weight <= updated) {\n        return updated - pkt_weight;\n    }\n    return updated;\n}\n',
      fmt: '/* Token bucket admission */\nuint64_t admit_packet(uint64_t tokens, uint64_t cost, uint64_t cap) {\n    uint64_t refilled = tokens + 6ULL;\n    if (refilled > cap) refilled = cap;\n    if (cost <= refilled) { return refilled - cost; }\n    return refilled;\n}\n',
      swap: 'uint64_t admit_packet(uint64_t tokens, uint64_t cost, uint64_t cap) {\n    uint64_t refilled = tokens + 6ULL;\n    if (refilled > cap) refilled = cap;\n    if (cost <= refilled) {\n        return cost - refilled;\n    }\n    return refilled;\n}\n',
      opbug: 'uint64_t admit_packet(uint64_t tokens, uint64_t cost, uint64_t cap) {\n    uint64_t refilled = tokens + 7ULL;\n    if (refilled > cap) refilled = cap;\n    if (cost < refilled) {\n        return refilled - cost;\n    }\n    return refilled;\n}\n'
    }
  };

  var RESERVED = new Set([
    'state', 'event', 'error', 'step', 'on', 'if', 'then', 'else', 'fail', 'emit', 'return',
    'let', 'var', 'mut', 'pub', 'fn', 'for', 'in', 'while', 'u64', 'i64', 'u32', 'usize',
    'uint64_t', 'int', 'def', 'amount', 'need', 'step_orbit', 'admit_packet'
  ]);

  var TOK_RE = /"(?:\\.|[^"\\])*"|\d+(?:ULL|u64)?|[A-Za-z_][A-Za-z0-9_]*|==|!=|<=|>=|<<|>>|->|\S/g;

  function stripCommentsJs(code) {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/\/\/[^\n]*/g, '')
      .replace(/#[^\n]*/g, '');
  }

  function computeFourHashes(code) {
    var raw = sha256Hex(code);
    var clean = stripCommentsJs(code);
    var toks = clean.match(TOK_RE) || [];
    var wsNorm = toks.join(' ');
    var wsHash = sha256Hex(wsNorm);

    var naiveToks = toks.map(function (t) {
      return (/^[A-Za-z_][A-Za-z0-9_]*$/.test(t) && !RESERVED.has(t)) ? 'ID' : t;
    });
    var naiveHash = sha256Hex(naiveToks.join(' '));

    var binderMap = Object.create(null);
    var idx = 0;
    var dbToks = toks.map(function (t) {
      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(t) && !RESERVED.has(t)) {
        if (binderMap[t] === undefined) {
          binderMap[t] = 'v' + (idx++);
        }
        return binderMap[t];
      }
      return t;
    });
    var dbText = dbToks.join(' ');
    var dbHash = sha256Hex(dbText);
    return { raw: raw, ws: wsHash, naive: naiveHash, debruijn: dbHash, projection: dbText };
  }

  var selSnippet = document.getElementById('sel-snippet');
  var txtA = document.getElementById('code-a');
  var txtB = document.getElementById('code-b');
  var currentMode = 'swap';

  Object.keys(SNIPPETS).forEach(function (k) {
    var o = document.createElement('option');
    o.value = k; o.textContent = SNIPPETS[k].label;
    selSnippet.appendChild(o);
  });

  function loadSnippet(mode) {
    var sn = SNIPPETS[selSnippet.value] || SNIPPETS.rce_bank;
    if (mode) currentMode = mode;
    txtA.value = sn.orig;
    txtB.value = sn[currentMode] || sn.alpha;
    document.querySelectorAll('.mut-btn').forEach(function (b) {
      var on = b.getAttribute('data-mut') === currentMode;
      b.style.borderColor = on ? 'var(--color-brand-amber)' : '';
      b.style.color = on ? 'var(--color-brand-amber)' : '';
    });
    updateComparator(true);
  }

  function updateComparator(updateUrl) {
    var ha = computeFourHashes(txtA.value);
    var hb = computeFourHashes(txtB.value);
    document.getElementById('db-proj-a').textContent = ha.projection;
    document.getElementById('db-proj-b').textContent = hb.projection;

    var rows = [
      ['Raw UTF-8 Bytes SHA-256', ha.raw, hb.raw, 'misses on comments & renames'],
      ['Comment/WS-Stripped SHA-256', ha.ws, hb.ws, 'hits on formatting, misses on renames'],
      ['Naive AST Token-Kind SHA-256 (ID-Strip)', ha.naive, hb.naive, 'UNSOUND on variable-binding swaps!'],
      ['De Bruijn / Positional Binder SHA-256', ha.debruijn, hb.debruijn, '100% sound (0/500 false hits in E5-Scale)']
    ];

    var tbody = document.getElementById('hash-cmp-tbody');
    tbody.innerHTML = rows.map(function (r, idx) {
      var eq = r[1] === r[2];
      var badgeColor = eq ? 'var(--color-brand-cyan)' : 'var(--color-brand-slate)';
      var verdict = eq ? 'EQUAL (CACHE HIT)' : 'DISTINCT (MISS)';
      if (idx === 2 && eq && ha.debruijn !== hb.debruijn) {
        badgeColor = '#ef4444';
        verdict = 'FALSE HIT (UNSOUND COLLISION!)';
      }
      return '<tr style="border-bottom:1px solid rgba(148,163,184,0.15);">' +
        '<td style="padding:0.48rem;font-weight:600;">' + r[0] + '<div style="font-size:0.75rem;color:var(--color-brand-gray);font-weight:400;">' + r[3] + '</div></td>' +
        '<td style="padding:0.48rem;font-family:var(--font-mono);font-size:0.78rem;">' + r[1].slice(0, 16) + '…</td>' +
        '<td style="padding:0.48rem;font-family:var(--font-mono);font-size:0.78rem;">' + r[2].slice(0, 16) + '…</td>' +
        '<td style="padding:0.48rem;font-family:var(--font-mono);font-weight:700;color:' + badgeColor + ';">' + verdict + '</td>' +
        '</tr>';
    }).join('');

    if (updateUrl) syncUrl();
    return {
      raw_equal: ha.raw === hb.raw,
      ws_equal: ha.ws === hb.ws,
      naive_ast_equal: ha.naive === hb.naive,
      debruijn_equal: ha.debruijn === hb.debruijn,
      unsound_naive_collision: (ha.naive === hb.naive && ha.debruijn !== hb.debruijn),
      hash_a: ha,
      hash_b: hb
    };
  }

  selSnippet.addEventListener('change', function () { loadSnippet(currentMode); });
  document.querySelectorAll('.mut-btn').forEach(function (b) {
    b.addEventListener('click', function () { loadSnippet(b.getAttribute('data-mut')); });
  });
  txtA.addEventListener('input', function () { updateComparator(false); });
  txtB.addEventListener('input', function () { updateComparator(false); });

  // -------------------------------------------------------------------------
  // Panel 3 (rc-diag-03): 12-Compiler Normal-Form Audit Matrix
  // -------------------------------------------------------------------------
  var FAMILIES = [
    { id: 'all', name: 'All 12 Surveyed Compiler Families + RCE Reference', scores: null, note: 'Select any family above to inspect part-by-part R..G status and empirical E1/E4/E5 notes.' },
    { id: 'zig', name: 'Zig (AST → ZIR → AIR → MIR)', scores: ['half', 'half', 'half', 'full', 'full', 'empty', 'half'], note: 'Self-hosted x86-64 debug backend differed in E1 (1.49 MB on Linux CI, 402 B on macOS); ReleaseSmall was byte-identical. Fails 24/2,008 behaviour tests [3].' },
    { id: 'rust', name: 'Rust (rustc: HIR → THIR → MIR → LLVM/CLIF)', scores: ['half', 'half', 'half', 'full', 'full', 'empty', 'full'], note: 'Strong borrow/type gate (emits nothing on error). E4-Energy: opt-level=3 achieves lowest median E_run (0.789 µJ core) at 1.153 J compile cost; opt 2→3 never pays back on 6/20 kernels.' },
    { id: 'go', name: 'Go (syntax → IR → SSA)', scores: ['half', 'half', 'half', 'full', 'full', 'empty', 'full'], note: 'Action-ID build cache hashes names and import paths. E1 traced 58–60 differing GOPATH bytes to `_DIR` import-path derivation; byte-identical once declared.' },
    { id: 'gcc_clang', name: 'GCC 15 & Clang/LLVM 21', scores: ['half', 'half', 'half', 'full', 'half', 'empty', 'half'], note: 'E4-Energy: gcc -O0 builds in 0.290 J core; clang -O3 runs at 1.103 µJ/call; -O2→-O3 never pays back on 4/20 (GCC) and 6/20 (Clang) kernels. Warm De Bruijn cache cuts clang -O3 compile joules 167.8×.' },
    { id: 'swift', name: 'Swift (SIL → LLVM IR)', scores: ['half', 'half', 'half', 'full', 'full', 'empty', 'half'], note: 'Ownership/type checking in SIL; incremental module hashes include symbol names and paths; no energy model.' },
    { id: 'cranelift_wasm', name: 'Cranelift & WebAssembly', scores: ['half', 'half', 'full', 'full', 'full', 'empty', 'full'], note: 'Acyclic e-graph mid-end extracts minimum-cost form within budget; Wasm binary is name-free outside custom sections. E4-Energy: 1.6 KB wasm32 module runs at 1.639 µJ/call in Node.' },
    { id: 'julia', name: 'Julia (typed IR → LLVM JIT)', scores: ['half', 'half', 'half', 'half', 'full', 'empty', 'empty'], note: 'Dynamic dispatch with no static gate; E1 observed 114–168 differing bytes in emitted LLVM IR even in the same directory.' },
    { id: 'fortran', name: 'Fortran (gfortran, ifx, Flang, LFortran)', scores: ['half', 'half', 'half', 'full', 'half', 'empty', 'half'], note: 'LFortran ASR and Flang HLFIR/FIR provide structured IRs; gfortran -O2 was byte-identical across Linux machines with -ffile-prefix-map.' },
    { id: 'cobol', name: 'COBOL (gcobol, GnuCOBOL)', scores: ['half', 'half', 'half', 'half', 'empty', 'empty', 'half'], note: 'GnuCOBOL cobc -x differed in 28 build-id bytes on Linux CI and 50 clock-dependent bytes on macOS when SOURCE_DATE_EPOCH was unset.' },
    { id: 'ada_spark', name: 'Ada & SPARK (gnatmake, GNATprove)', scores: ['half', 'half', 'half', 'full', 'half', 'empty', 'half'], note: 'GNATprove SMT proof levels certify absence of run-time errors when gated by CI; gnatmake -O2 -g retained build-path bytes in .ali outputs in E1.' },
    { id: 'ghc_func', name: 'GHC & Functional (Lean 4, OCaml, Erlang, Futhark)', scores: ['half', 'half', 'half', 'full', 'full', 'empty', 'half'], note: 'GHC Core, Lean LCNF, and Erlang bytecode validator provide strong K/R structure, but interface fingerprints still hash user names.' },
    { id: 'ml_compilers', name: 'ML Compilers (XLA, TorchInductor, TVM, Triton)', scores: ['half', 'half', 'full', 'half', 'full', 'empty', 'half'], note: 'Autotuned cost models and tolerance-based sample checks (float32 rtol 1.3e-6); graph breaks fall back to eager execution unless fullgraph=True.' },
    { id: 'rce_ref', name: 'RCE Reference (`openIE-dev/rce` @ 1762fb4b)', scores: ['full', 'half', 'half', 'full', 'full', 'half', 'full'], note: 'Admits or refuses before emit; `rce fmt nameless` projects declared names to positional indices (0/500 false hits in E5-Scale; 78.7 mJ core check+5-target emit; host.Energy RAPL counter in D.11).' }
  ];

  var selFam = document.getElementById('sel-family');
  FAMILIES.forEach(function (f) {
    var o = document.createElement('option');
    o.value = f.id; o.textContent = f.name;
    selFam.appendChild(o);
  });

  function badgeMark(st) {
    if (st === 'full') return '<span style="color:var(--color-brand-cyan);font-weight:700;">● Present</span>';
    if (st === 'half') return '<span style="color:var(--color-brand-amber);font-weight:600;">◐ Partial</span>';
    return '<span style="color:var(--color-brand-gray);">○ Absent</span>';
  }

  function renderMatrix(updateUrl) {
    var chosen = selFam.value;
    var rows = chosen === 'all' ? FAMILIES.slice(1) : FAMILIES.filter(function (f) { return f.id === chosen; });
    var noteObj = FAMILIES.find(function (f) { return f.id === chosen; }) || FAMILIES[0];
    document.getElementById('fam-note').textContent = noteObj.note;
    document.getElementById('audit-tbody').innerHTML = rows.map(function (r) {
      return '<tr style="border-bottom:1px solid rgba(148,163,184,0.14);">' +
        '<td style="padding:0.45rem;font-weight:600;">' + r.name + '</td>' +
        r.scores.map(function (s) { return '<td style="padding:0.45rem;font-family:var(--font-mono);font-size:0.78rem;">' + badgeMark(s) + '</td>'; }).join('') +
        '</tr>';
    }).join('');
    if (updateUrl) syncUrl();
    return { selected: chosen, note: noteObj.note, rows: rows };
  }

  selFam.addEventListener('change', function () { renderMatrix(true); });

  // Hydrate initial state from URL query params
  var qs = new URLSearchParams(window.location.search);
  if (qs.get('kernel') && D.kernels[qs.get('kernel')]) selKernel.value = qs.get('kernel');
  if (qs.get('low') && D.kernels.median_20_kernels.tiers[qs.get('low')]) selLow.value = qs.get('low');
  if (qs.get('high') && D.kernels.median_20_kernels.tiers[qs.get('high')]) selHigh.value = qs.get('high');
  if (qs.get('rail') && (qs.get('rail') === 'core' || qs.get('rail') === 'pkg')) selRail.value = qs.get('rail');
  if (qs.get('logN')) sLogN.value = qs.get('logN');
  if (qs.get('snippet') && SNIPPETS[qs.get('snippet')]) selSnippet.value = qs.get('snippet');
  if (qs.get('family')) selFam.value = qs.get('family');

  renderPayback(false);
  loadSnippet(qs.get('mut') || 'swap');
  renderMatrix(false);

  // Lightbox for SVG figures
  var imgs = Array.from(document.querySelectorAll('figure.fig img'));
  if (imgs.length) {
    var dlg = document.createElement('dialog');
    dlg.className = 'lb';
    dlg.innerHTML = '<div class="lb-stage"><img class="lb-img" alt=""></div><div class="lb-bar"><p class="lb-cap"></p><div class="lb-btns"><button class="lb-btn" data-z="out">−</button><button class="lb-btn" data-z="reset">1:1</button><button class="lb-btn" data-z="in">+</button><button class="lb-btn" data-z="close">Close ×</button></div></div>';
    document.body.appendChild(dlg);
    var lbImg = dlg.querySelector('.lb-img'), lbCap = dlg.querySelector('.lb-cap'), scale = 1;
    imgs.forEach(function (img) {
      img.addEventListener('click', function () {
        lbImg.src = img.src;
        var cap = img.closest('figure').querySelector('figcaption');
        lbCap.textContent = cap ? cap.textContent : img.alt;
        scale = 1; lbImg.style.transform = 'scale(1)';
        dlg.showModal();
      });
    });
    dlg.querySelectorAll('[data-z]').forEach(function (b) {
      b.addEventListener('click', function () {
        var z = b.dataset.z;
        if (z === 'close') dlg.close();
        else {
          scale = z === 'in' ? Math.min(5, scale * 1.35) : z === 'out' ? Math.max(1, scale / 1.35) : 1;
          lbImg.style.transform = 'scale(' + scale + ')';
        }
      });
    });
  }

  // Expose programmatic API on window.openieLivingLab + WebMCP
  window.openieLivingLab = {
    studyId: 'rce-compile',
    data: D,
    explorePaybackHorizon: function (opts) {
      if (opts && opts.kernel && D.kernels[opts.kernel]) selKernel.value = opts.kernel;
      if (opts && opts.low_tier && D.kernels.median_20_kernels.tiers[opts.low_tier]) selLow.value = opts.low_tier;
      if (opts && opts.high_tier && D.kernels.median_20_kernels.tiers[opts.high_tier]) selHigh.value = opts.high_tier;
      if (opts && opts.rail) selRail.value = opts.rail;
      if (opts && opts.log10_N != null) sLogN.value = String(opts.log10_N);
      return renderPayback(true);
    },
    compareNamelessHashes: function (codeA, codeB) {
      if (typeof codeA === 'string') txtA.value = codeA;
      if (typeof codeB === 'string') txtB.value = codeB;
      return updateComparator(false);
    },
    inspectCompilerFamily: function (famId) {
      if (famId) selFam.value = famId;
      return renderMatrix(true);
    }
  };

  var mc = document.modelContext || navigator.modelContext;
  if (window.isSecureContext && mc && typeof mc.registerTool === 'function') {
    [
      {
        name: 'explore_rce_compile_payback',
        title: 'Explore RCE Compile E4-Energy payback horizon N*',
        description: 'Computes lifecycle reported_j (E_compile + N * E_run) and crossover N* across 20 kernels and 14 compiler tiers on /living/rce-compile/.',
        inputSchema: {
          type: 'object',
          properties: {
            kernel: { type: 'string', enum: kKeys },
            low_tier: { type: 'string', enum: tierNames },
            high_tier: { type: 'string', enum: tierNames },
            log10_N: { type: 'number', minimum: 0, maximum: 9 },
            rail: { type: 'string', enum: ['core', 'pkg'] }
          },
          additionalProperties: false
        },
        execute: function (inp) { return window.openieLivingLab.explorePaybackHorizon(inp || {}); },
        annotations: { readOnlyHint: true }
      },
      {
        name: 'compare_rce_compile_nameless_hashes',
        title: 'Compare raw, whitespace-stripped, naive ID-strip, and De Bruijn nameless SHA-256 hashes',
        description: 'Evaluates two code snippets in /living/rce-compile/ Panel 2 and detects unsound binding-swap collisions in naive AST token-kind hashing.',
        inputSchema: {
          type: 'object',
          properties: {
            code_a: { type: 'string' },
            code_b: { type: 'string' }
          },
          required: ['code_a', 'code_b'],
          additionalProperties: false
        },
        execute: function (inp) { return window.openieLivingLab.compareNamelessHashes(inp.code_a, inp.code_b); },
        annotations: { readOnlyHint: true }
      }
    ].forEach(function (t) { try { Promise.resolve(mc.registerTool(t)).catch(function () {}); } catch (_e) {} });
  }
})();
