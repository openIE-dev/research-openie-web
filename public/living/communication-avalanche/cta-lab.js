/* Interactive Observatory for The Communication Tool Avalanche (/living/communication-avalanche/) */
(function () {
  'use strict';

  var D = window.CTA_ORCH_DATA;
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

  var pinEl = document.getElementById('prereg-pin');
  if (pinEl && D.prereg_sha256) {
    pinEl.textContent = D.prereg_sha256.slice(0, 16) + '…';
  }

  // URL query-param synchronization
  function syncUrl() {
    if (!window.history || !window.history.replaceState) return;
    var u = new URL(window.location.href);
    u.searchParams.set('bio', document.getElementById('sel-bio').value);
    u.searchParams.set('stim', document.getElementById('s-stim').value);
    u.searchParams.set('coop', document.getElementById('s-coop').value);
    u.searchParams.set('noise', document.getElementById('s-noise').value);
    u.searchParams.set('duty', document.getElementById('sel-duty').value);
    u.searchParams.set('cat', document.getElementById('sel-cat').value);
    u.searchParams.set('topo', document.getElementById('sel-topo').value);
    u.searchParams.set('fault', document.getElementById('sel-fault').value);
    u.searchParams.set('bci', document.getElementById('sel-bci').value);
    u.searchParams.set('minds', document.getElementById('s-minds').value);
    u.searchParams.set('gate', document.getElementById('s-gate').value);
    u.searchParams.set('fid', document.getElementById('s-fid').value);
    window.history.replaceState(null, '', u.pathname + u.search + u.hash);
  }

  // -------------------------------------------------------------------------
  // Panel 1 (ca-diag-01): Biological Threshold & Stigmergic Channel Simulator
  // -------------------------------------------------------------------------
  var BIO_META = {
    hill_quorum: {
      desc: 'Vibrio fischeri LuxI/LuxR quorum sensing: autoinducer [A]^n / (K_d^n + [A]^n) gates ~600 genes only above cooperative density threshold.',
      isoTitle: 'Integrate-and-Fire (V_u ≥ θ_u)',
      isoSub: 'Zero OS wakeups below threshold (eventfd)',
      curveLabel: 'Cooperative Hill Activation f(S/K₀)'
    },
    sepj_nanopore: {
      desc: 'Cyanobacterial SepJ/SepI septal nanopores: elevated injury [Ca²⁺] seals intercellular pore conductance 1 / (1 + (S/K_Ca)^n), isolating damaged cells.',
      isoTitle: 'BLAKE3 + Ed25519 Channel Gate',
      isoSub: '0 / 200 corrupt cascades in CTA-E3',
      curveLabel: 'Septal Conductance Gate G/G_max'
    },
    starling_topo: {
      desc: 'Starling murmurations (Cavagna et al. 2010): fixed topological degree k ≈ 7 yields scale-free correlation at O(k) cost vs O(N²) all-to-all chat.',
      isoTitle: 'Sparse Typed DAG vs Chat Avalanche',
      isoSub: 'Cuts multi-agent token amplification >10×',
      curveLabel: 'Scale-Free Coherence per Edge'
    },
    physarum_flow: {
      desc: 'Physarum polycephalum tube adaptation (Nakagaki et al. 2000): nonlinear flux reinforcement |Q|^γ / (1 + |Q|^γ) prunes idle links onto min-cost paths.',
      isoTitle: 'SSP Min-Cost Flow + cost_lut.json',
      isoSub: '0 per-tick scheduler overhead; <30 µs reroute',
      curveLabel: 'Tube Conductance D(Q) Reinforcement'
    }
  };

  var selBio = document.getElementById('sel-bio');
  var sStim = document.getElementById('s-stim');
  var sCoop = document.getElementById('s-coop');
  var sNoise = document.getElementById('s-noise');

  function evalBioCurve(mode, x, n) {
    var xn = Math.pow(Math.max(1e-6, x), n);
    if (mode === 'sepj_nanopore') {
      return 1.0 / (1.0 + xn);
    }
    if (mode === 'starling_topo') {
      return (xn / (1.0 + xn)) * Math.exp(-0.04 * Math.max(0, x - 2.2));
    }
    return xn / (1.0 + xn);
  }

  function renderBio(updateUrl) {
    var mode = selBio.value;
    var stim = parseFloat(sStim.value);
    var coop = parseFloat(sCoop.value);
    var noise = parseFloat(sNoise.value);
    var meta = BIO_META[mode] || BIO_META.hill_quorum;

    document.getElementById('v-stim').textContent = stim.toFixed(2);
    document.getElementById('v-coop').textContent = coop.toFixed(1);
    document.getElementById('v-noise').textContent = noise.toFixed(2);
    document.getElementById('bio-desc').textContent = meta.desc;

    var resp = evalBioCurve(mode, stim, coop);
    var noiseLeakGated = evalBioCurve(mode, Math.max(0.02, noise), coop);
    if (mode === 'sepj_nanopore') {
      noiseLeakGated = 1.0 - evalBioCurve(mode, Math.max(0.02, 1.0 / Math.max(0.15, noise)), coop);
    }
    var unthreshNoise = Math.min(1.0, noise / 1.0);
    var noiseRejPct = Math.max(0, (1.0 - noiseLeakGated / Math.max(0.01, unthreshNoise)) * 100.0);
    var metabolicSavingsPct = (1.0 - (0.12 + 0.88 * Math.pow(noise, coop))) * 84.0;

    var stateLabel = mode === 'sepj_nanopore'
      ? (stim >= 1.0 ? 'SEALED (' + (resp * 100).toFixed(1) + '% open)' : 'OPEN (' + (resp * 100).toFixed(1) + '% cond)')
      : (stim >= 1.0 ? 'FIRED (' + (resp * 100).toFixed(1) + '%)' : 'QUIESCENT (' + (resp * 100).toFixed(1) + '%)');

    document.getElementById('m-bio-act').textContent = stateLabel;
    document.getElementById('m-bio-act-sub').textContent = 'S/K₀ = ' + stim.toFixed(2) + ' · exponent = ' + coop.toFixed(1);
    document.getElementById('m-bio-rej').textContent = noiseRejPct.toFixed(1) + '%';
    document.getElementById('m-bio-rej-sub').textContent = 'False wake leak: ' + (noiseLeakGated * 100).toFixed(2) + '% vs ' + (unthreshNoise * 100).toFixed(1) + '% linear';
    document.getElementById('m-bio-save').textContent = metabolicSavingsPct.toFixed(1) + '% saved';
    document.getElementById('m-bio-save-sub').textContent = 'Idle channels draw near-zero flux below K₀';
    document.getElementById('m-bio-iso').textContent = meta.isoTitle;
    document.getElementById('m-bio-iso-sub').textContent = meta.isoSub;

    var svg = document.getElementById('bio-live-svg');
    if (svg) {
      var px = 54, py = 18, pw = 600, ph = 162;
      function sx(x) { return px + (x / 4.0) * pw; }
      function sy(y) { return py + ph - Math.max(0, Math.min(1, y)) * ph; }
      var ptsGated = [], ptsLin = [];
      for (var i = 0; i <= 120; i++) {
        var xv = (i / 120.0) * 4.0;
        ptsGated.push(sx(xv).toFixed(1) + ',' + sy(evalBioCurve(mode, xv, coop)).toFixed(1));
        var linY = mode === 'sepj_nanopore' ? Math.max(0, 1.0 - xv / 4.0) : Math.min(1.0, xv / 2.0);
        ptsLin.push(sx(xv).toFixed(1) + ',' + sy(linY).toFixed(1));
      }
      var thX = sx(1.0);
      var curX = sx(stim);
      var curY = sy(resp);
      var noiseW = (noise / 4.0) * pw;
      svg.innerHTML =
        '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" fill="rgba(15,23,42,0.32)" stroke="rgba(148,163,184,0.25)"/>' +
        '<rect x="' + px + '" y="' + py + '" width="' + noiseW.toFixed(1) + '" height="' + ph + '" fill="rgba(239,68,68,0.12)"/>' +
        '<line x1="' + thX.toFixed(1) + '" y1="' + py + '" x2="' + thX.toFixed(1) + '" y2="' + (py + ph) + '" stroke="#f59e0b" stroke-dasharray="4,3"/>' +
        '<text x="' + (thX + 5).toFixed(1) + '" y="' + (py + 14) + '" font-size="10" fill="#f59e0b" font-family="monospace">Threshold K₀ = 1.0</text>' +
        '<polyline fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5,3" points="' + ptsLin.join(' ') + '"/>' +
        '<polyline fill="none" stroke="#00d4aa" stroke-width="2.6" points="' + ptsGated.join(' ') + '"/>' +
        '<circle cx="' + curX.toFixed(1) + '" cy="' + curY.toFixed(1) + '" r="5.5" fill="#00d4aa" stroke="#fff" stroke-width="1.5"/>' +
        '<text x="' + px + '" y="' + (py + ph + 16) + '" font-size="10" fill="#94a3b8" font-family="monospace">0.0 (Noise Band σ=' + noise.toFixed(2) + ')</text>' +
        '<text x="' + (px + pw) + '" y="' + (py + ph + 16) + '" text-anchor="end" font-size="10" fill="#94a3b8" font-family="monospace">S / K₀ = 4.0</text>' +
        '<text x="' + (px + pw - 8) + '" y="' + (py + 15) + '" text-anchor="end" font-size="10.5" fill="#00d4aa" font-family="monospace">' + meta.curveLabel + ' (solid) vs Ungated (dashed)</text>';
    }

    if (updateUrl) syncUrl();
    return {
      rung: mode,
      stimulus_ratio: stim,
      cooperativity: coop,
      noise_sigma: noise,
      gated_response: +resp.toFixed(4),
      noise_rejection_pct: +noiseRejPct.toFixed(2),
      metabolic_savings_pct: +metabolicSavingsPct.toFixed(2),
      cta_isomorphism: meta.isoTitle
    };
  }

  [selBio, sStim, sCoop, sNoise].forEach(function (el) {
    el.addEventListener('input', function () { renderBio(true); });
    el.addEventListener('change', function () { renderBio(true); });
  });

  // -------------------------------------------------------------------------
  // Panel 2 (ca-diag-02): Live Attested Orchestration DAG & CTA-E1..E3 Explorer
  // -------------------------------------------------------------------------
  var selDuty = document.getElementById('sel-duty');
  var selCat = document.getElementById('sel-cat');
  var selTopo = document.getElementById('sel-topo');
  var selFault = document.getElementById('sel-fault');

  function renderOrchestration(updateUrl) {
    var dutyKey = selDuty.value;
    var catKey = selCat.value;
    var topoKey = selTopo.value;
    var faultKey = selFault.value;

    // 1. CTA-E1 Table & Comparison Metric
    var e1Slice = (D.e1 && D.e1.summary_by_duty_and_regime && D.e1.summary_by_duty_and_regime[dutyKey]) || {};
    var evRow = e1Slice.event_threshold || { mean_pkg_reported_j: 0, mean_node_wakeups: 0, mean_latency_p50_ms: 0, mean_latency_p99_ms: 0 };
    var p1kRow = e1Slice.poll_1000hz || { mean_pkg_reported_j: 1, mean_node_wakeups: 1, mean_latency_p50_ms: 0, mean_latency_p99_ms: 0 };
    var p10Row = e1Slice.poll_10hz || { mean_latency_p50_ms: 0 };

    var wakeRatio = p1kRow.mean_node_wakeups / Math.max(1, evRow.mean_node_wakeups);
    var pkgSavingPct = ((p1kRow.mean_pkg_reported_j - evRow.mean_pkg_reported_j) / Math.max(1e-6, p1kRow.mean_pkg_reported_j)) * 100.0;
    document.getElementById('m-e1-cmp').textContent =
      (pkgSavingPct >= 0 ? '−' : '+') + Math.abs(pkgSavingPct).toFixed(1) + '% Pkg J · ' + wakeRatio.toFixed(1) + '× fewer wakes';
    document.getElementById('m-e1-sub').textContent =
      'p50 lat ' + evRow.mean_latency_p50_ms.toFixed(2) + ' ms (vs ' + p10Row.mean_latency_p50_ms.toFixed(1) + ' ms @ 10 Hz)';

    var regLabels = [
      ['event_threshold', 'Zero-Clock Eventfd (V≥θ)'],
      ['poll_10hz', '10 Hz Clocked Poll'],
      ['poll_100hz', '100 Hz Clocked Poll'],
      ['poll_1000hz', '1,000 Hz Clocked Poll']
    ];
    document.getElementById('e1-tbody').innerHTML = regLabels.map(function (pair, i) {
      var r = e1Slice[pair[0]] || {};
      var col = i === 0 ? 'var(--color-brand-cyan)' : 'var(--color-brand-light)';
      return '<tr style="border-bottom:1px solid rgba(148,163,184,0.14);color:' + col + ';">' +
        '<td style="padding:0.36rem;font-weight:' + (i === 0 ? '700' : '500') + ';">' + pair[1] + '</td>' +
        '<td style="padding:0.36rem;font-family:var(--font-mono);">' + (r.mean_pkg_reported_j || 0).toFixed(2) + ' J</td>' +
        '<td style="padding:0.36rem;font-family:var(--font-mono);">' + Math.round(r.mean_node_wakeups || 0).toLocaleString() + '</td>' +
        '<td style="padding:0.36rem;font-family:var(--font-mono);">' + (r.mean_latency_p50_ms || 0).toFixed(2) + ' / ' + (r.mean_latency_p99_ms || 0).toFixed(2) + ' ms</td>' +
        '</tr>';
    }).join('');

    // 2. CTA-E2 4-Arm Summary (All or Category Slice)
    var armsOrder = [
      ['arm_a_det_only', 'A · Det-Only Pool'],
      ['arm_b_monolithic_llm', 'B · Monolithic LLM'],
      ['arm_c_unattested_4agent', 'C · 4-Agent Avalanche'],
      ['arm_d_cta_orchestrator', 'D · CTA-Orchestrator']
    ];
    var e2Arms = (D.e2 && D.e2.arms) || {};
    function sliceArm(armId) {
      var a = e2Arms[armId] || {};
      if (catKey === 'all') {
        return {
          tasks: a.tasks_total || 60,
          pass: a.verified_correct || 0,
          falseC: a.false_commits || 0,
          pkgJ: a.pkg_reported_j || 0.001,
          calls: a.llm_calls || 0,
          usd: a.api_cost_usd || 0,
          tokens: a.total_tokens || 0
        };
      }
      var c = (a.by_category && a.by_category[catKey]) || {};
      return {
        tasks: c.tasks || 20,
        pass: c.verified_correct || 0,
        falseC: c.false_commits || 0,
        pkgJ: c.pkg_reported_j || 0.001,
        calls: c.llm_calls || 0,
        usd: c.cost_usd || 0,
        tokens: 0
      };
    }

    var sB = sliceArm('arm_b_monolithic_llm');
    var sC = sliceArm('arm_c_unattested_4agent');
    var sD = sliceArm('arm_d_cta_orchestrator');
    var cpjD = sD.pass / Math.max(1e-6, sD.pkgJ);
    var cpjC = sC.pass / Math.max(1e-6, sC.pkgJ);

    document.getElementById('m-e2-cpj').textContent = cpjD.toFixed(3) + ' tasks/J';
    document.getElementById('m-e2-sub').textContent =
      sD.pass + '/' + sD.tasks + ' verified (' + (100 * sD.pass / sD.tasks).toFixed(1) + '%) · ' + sD.falseC + ' false commits';

    var callReductionVsC = sC.calls / Math.max(1, sD.calls || 1);
    document.getElementById('m-e2-tok').textContent =
      (sD.calls === 0 ? '0 LLM calls ($0.00)' : sD.calls + ' calls ($' + sD.usd.toFixed(2) + ')');
    document.getElementById('m-e2-tok-sub').textContent =
      sD.calls === 0
        ? '100% deterministic closure vs ' + sC.calls + ' calls in Arm C'
        : callReductionVsC.toFixed(1) + '× fewer LLM calls than 4-Agent (' + sC.calls + ' calls, $' + sC.usd.toFixed(2) + ')';

    document.getElementById('e2-tbody').innerHTML = armsOrder.map(function (pair) {
      var s = sliceArm(pair[0]);
      var isD = pair[0] === 'arm_d_cta_orchestrator';
      var cpj = s.pass / Math.max(1e-6, s.pkgJ);
      var fCol = s.falseC > 0 ? '#ef4444' : 'var(--color-brand-cyan)';
      return '<tr style="border-bottom:1px solid rgba(148,163,184,0.14);' + (isD ? 'background:rgba(0,212,170,0.07);' : '') + '">' +
        '<td style="padding:0.36rem;font-weight:' + (isD ? '700' : '500') + ';">' + pair[1] + '</td>' +
        '<td style="padding:0.36rem;font-family:var(--font-mono);">' + s.pass + '/' + s.tasks + ' · <span style="color:' + fCol + ';">' + s.falseC + ' bad</span></td>' +
        '<td style="padding:0.36rem;font-family:var(--font-mono);">' + s.pkgJ.toFixed(2) + ' J · ' + s.calls + 'c</td>' +
        '<td style="padding:0.36rem;font-family:var(--font-mono);">' + cpj.toFixed(3) + '/J · $' + s.usd.toFixed(2) + '</td>' +
        '</tr>';
    }).join('');

    // 3. CTA-E3 Fault & SSP Topology State
    var e3 = D.e3 || {};
    var reroute = e3.ssp_topology_rerouting_20 || {};
    if (faultKey === 'none') {
      document.getElementById('m-e3-verdict').textContent =
        '0 / 200 Corrupt (0.00%)';
      document.getElementById('m-e3-verdict').style.color = 'var(--color-brand-cyan)';
      document.getElementById('m-e3-sub').textContent =
        'SSP 20-dropout reroute p50 = ' + (reroute.reroute_p50_us || 0).toFixed(2) + ' µs (vs ' + (e3.unattested_chain_corrupt_rate_pct || 0).toFixed(1) + '% unattested)';
    } else {
      var fc = (e3.fault_classes && e3.fault_classes[faultKey]) || {};
      document.getElementById('m-e3-verdict').textContent =
        'REJECTED (' + (fc.rejected || 50) + '/50 blocked)';
      document.getElementById('m-e3-verdict').style.color = '#f59e0b';
      document.getElementById('m-e3-sub').textContent =
        (fc.defense_layer || '') + ' · p50 = ' + (fc.reject_p50_us || 0).toFixed(2) + ' µs (Unattested leaked ' + (fc.unattested_cascades || 0) + '/50)';
    }

    // 4. Render Live Attested DAG SVG
    var dagSvg = document.getElementById('dag-live-svg');
    if (dagSvg) {
      var dropDet = topoKey === 'drop_det' || topoKey === 'drop_multi';
      var dropMulti = topoKey === 'drop_multi';
      var useEsc = topoKey === 'escalated';
      var hasFault = faultKey !== 'none';

      var nodes = [
        { id: 'parse', x: 30, y: 78, w: 92, h: 42, lbl: 'Parse AST', sub: dropMulti ? 'DROPPED' : '0.18 mJ', dead: dropMulti },
        { id: 'parse_b', x: 30, y: 148, w: 92, h: 38, lbl: 'Parse Bak', sub: 'Standby', dead: false, active: dropMulti },
        { id: 'static', x: 152, y: 78, w: 102, h: 42, lbl: 'Static Scope', sub: dropMulti ? 'DROPPED' : '0.32 mJ', dead: dropMulti },
        { id: 'static_b', x: 152, y: 148, w: 102, h: 38, lbl: 'Static Bak', sub: 'Standby', dead: false, active: dropMulti },
        { id: 'testgen', x: 284, y: 78, w: 98, h: 42, lbl: 'Test & Prop', sub: '0.45 mJ', dead: false },
        { id: 'detpatch', x: 412, y: 42, w: 108, h: 44, lbl: 'Det Patch', sub: dropDet ? 'DROPPED' : 'V_esc < θ', dead: dropDet },
        { id: 'det_b', x: 412, y: 104, w: 108, h: 38, lbl: 'Det Standby', sub: 'SSP Reroute', dead: false, active: dropDet && !useEsc },
        { id: 'llm', x: 412, y: 162, w: 108, h: 46, lbl: 'LLM Proposer', sub: useEsc ? 'FIRED (V≥θ)' : 'ASLEEP (0 W)', dead: false, esc: useEsc },
        { id: 'verifier', x: 556, y: 78, w: 106, h: 52, lbl: 'Diff Verifier', sub: dropMulti ? 'DROPPED' : 'Commit Gate', dead: dropMulti },
        { id: 'ver_b', x: 556, y: 148, w: 106, h: 38, lbl: 'Verifier Bak', sub: 'Standby Gate', dead: false, active: dropMulti },
        { id: 'commit', x: 686, y: 84, w: 62, h: 40, lbl: 'Commit', sub: hasFault ? 'REFUSED' : 'Admit', dead: false, fault: hasFault }
      ];

      var edgesSvg = '';
      function drawEdge(x1, y1, x2, y2, color, dashed, thick) {
        edgesSvg += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + color + '" stroke-width="' + (thick || 2.2) + '"' + (dashed ? ' stroke-dasharray="5,3"' : '') + '/>';
      }
      var cAct = '#00d4aa', cIdle = 'rgba(148,163,184,0.28)', cEsc = '#f59e0b', cErr = '#ef4444';
      drawEdge(122, 99, 152, 99, dropMulti ? cIdle : cAct, dropMulti);
      drawEdge(122, 167, 152, 167, dropMulti ? cAct : cIdle, !dropMulti);
      drawEdge(254, 99, 284, 99, dropMulti ? cIdle : cAct, dropMulti);
      drawEdge(254, 167, 284, 99, dropMulti ? cAct : cIdle, !dropMulti);
      drawEdge(382, 99, 412, 64, dropDet ? cIdle : cAct, dropDet);
      drawEdge(382, 99, 412, 123, dropDet ? cAct : cIdle, !dropDet);
      drawEdge(466, 86, 466, 162, useEsc ? cEsc : cIdle, !useEsc, useEsc ? 2.6 : 1.8);
      var verY = dropMulti ? 167 : 104;
      drawEdge(520, 64, 556, verY, (!dropDet && !useEsc) ? (hasFault ? cErr : cAct) : cIdle, dropDet || useEsc);
      drawEdge(520, 123, 556, verY, (dropDet && !useEsc) ? (hasFault ? cErr : cAct) : cIdle, !(dropDet && !useEsc));
      drawEdge(520, 185, 556, verY, useEsc ? (hasFault ? cErr : cEsc) : cIdle, !useEsc, 2.5);
      drawEdge(662, verY, 686, 104, hasFault ? cErr : cAct, hasFault, 2.6);

      var nodesSvg = nodes.map(function (nd) {
        var stroke = nd.dead ? '#64748b' : nd.fault ? '#ef4444' : nd.esc ? '#f59e0b' : (nd.active || (!nd.id.endsWith('_b') && nd.id !== 'llm')) ? '#00d4aa' : 'rgba(148,163,184,0.4)';
        var fill = nd.dead ? 'rgba(30,41,59,0.35)' : nd.fault ? 'rgba(239,68,68,0.16)' : nd.esc ? 'rgba(245,158,11,0.16)' : 'rgba(15,23,42,0.78)';
        return '<g>' +
          '<rect x="' + nd.x + '" y="' + nd.y + '" width="' + nd.w + '" height="' + nd.h + '" rx="7" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.8"/>' +
          '<text x="' + (nd.x + nd.w / 2) + '" y="' + (nd.y + 17) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="#e2e8f0" font-family="sans-serif">' + nd.lbl + '</text>' +
          '<text x="' + (nd.x + nd.w / 2) + '" y="' + (nd.y + 31) + '" text-anchor="middle" font-size="9.2" fill="' + stroke + '" font-family="monospace">' + nd.sub + '</text>' +
          '</g>';
      }).join('');

      var banner = hasFault
        ? 'BYZANTINE PROBE (' + faultKey + '): Rejected before commit — 0 downstream state corruption'
        : 'BLAKE3 (256-bit) + Ed25519 (64-byte) Attested Channels · SSP Epoch Schedule (0 per-tick recomputes)';

      dagSvg.innerHTML =
        '<rect x="6" y="8" width="748" height="224" rx="10" fill="rgba(15,23,42,0.32)" stroke="rgba(148,163,184,0.22)"/>' +
        '<text x="20" y="27" font-size="10.5" fill="' + (hasFault ? '#f59e0b' : '#94a3b8') + '" font-family="monospace">' + banner + '</text>' +
        edgesSvg + nodesSvg;
    }

    // 5. Render Sample Firing Ledger Rows
    var sampleRows = (D.ledger_samples || []).slice(0, 8);
    document.getElementById('ledger-tbody').innerHTML = sampleRows.map(function (r) {
      var isLlm = r.node_id === 'llm_patch_proposer';
      return '<tr style="border-bottom:1px solid rgba(148,163,184,0.12);' + (isLlm ? 'color:var(--color-brand-amber);' : '') + '">' +
        '<td style="padding:0.32rem;">' + r.trace_id + '#' + r.step_idx + '</td>' +
        '<td style="padding:0.32rem;font-weight:600;">' + r.node_id + '</td>' +
        '<td style="padding:0.32rem;">' + r.input_blake3.slice(0, 10) + '…→' + r.output_blake3.slice(0, 10) + '…</td>' +
        '<td style="padding:0.32rem;">' + r.ed25519_sig_prefix.slice(0, 12) + '…</td>' +
        '<td style="padding:0.32rem;">' + (r.verify_ns / 1000.0).toFixed(2) + ' µs</td>' +
        '<td style="padding:0.32rem;">' + (r.pkg_reported_j * 1000.0).toFixed(2) + ' mJ · ' + r.latency_ms.toFixed(2) + ' ms</td>' +
        '<td style="padding:0.32rem;">' + r.potential_v.toFixed(1) + '/' + r.threshold_theta.toFixed(1) + '</td>' +
        '</tr>';
    }).join('');

    if (updateUrl) syncUrl();
    return {
      duty_cycle: dutyKey,
      e1_event_driven_pkg_j: evRow.mean_pkg_reported_j,
      e1_poll_1khz_pkg_j: p1kRow.mean_pkg_reported_j,
      e2_category: catKey,
      arm_d_pass: sD.pass,
      arm_d_tasks: sD.tasks,
      arm_d_coherence_per_j: +cpjD.toFixed(5),
      arm_c_coherence_per_j: +cpjC.toFixed(5),
      topology_mode: topoKey,
      fault_probe: faultKey
    };
  }

  [selDuty, selCat, selTopo, selFault].forEach(function (el) {
    el.addEventListener('change', function () { renderOrchestration(true); });
  });

  // -------------------------------------------------------------------------
  // Panel 3 (ca-diag-03): BCI Sensing-to-Modulation & Agency-Preserving N-Mind
  // -------------------------------------------------------------------------
  var selBci = document.getElementById('sel-bci');
  var sMinds = document.getElementById('s-minds');
  var sGate = document.getElementById('s-gate');
  var sFid = document.getElementById('s-fid');

  function evalBciMetrics(mode, nMinds, gateTheta, fid) {
    var agency, gain, risk, ratchet;
    if (mode === 'read_only') {
      agency = 0.99;
      gain = 1.0 + 0.18 * fid * Math.log2(Math.max(1, nMinds));
      risk = 0.02 * (1.0 - fid);
      ratchet = 1.15 + 0.25 * fid;
    } else if (mode === 'supp_dyad') {
      var effN = Math.min(2, nMinds);
      agency = 0.88 + 0.11 * gateTheta;
      gain = 1.0 + 1.35 * fid * effN * (0.6 + 0.4 * gateTheta);
      risk = (1.0 - gateTheta) * 0.22;
      ratchet = 2.4 * fid;
    } else if (mode === 'gated_nmind') {
      agency = Math.max(0.55, 1.0 - (1.0 - gateTheta) * 0.28 * Math.log2(Math.max(1, nMinds)) / 5.0);
      gain = 1.0 + fid * Math.pow(nMinds, 0.72) * (0.55 + 0.45 * gateTheta);
      risk = Math.max(0.005, (1.0 - gateTheta) * (1.0 - fid) * Math.log2(Math.max(1, nMinds)) * 0.35);
      ratchet = 1.0 + 3.8 * fid * Math.log2(Math.max(1, nMinds) + 1) * gateTheta;
    } else {
      // Ungated broadcast assimilation: individual sovereignty collapses as 1 / sqrt(N)
      agency = 1.0 / Math.sqrt(Math.max(1, nMinds));
      gain = 1.0 + 0.45 * fid * Math.sqrt(nMinds);
      risk = Math.min(0.99, 0.25 + 0.14 * Math.log2(Math.max(1, nMinds)) + 0.3 * (1.0 - fid));
      ratchet = Math.max(0.6, 1.4 * fid * (1.0 - 0.5 * risk));
    }
    return { agency: agency, gain: gain, risk: risk, ratchet: ratchet };
  }

  function renderBci(updateUrl) {
    var mode = selBci.value;
    var nMinds = parseInt(sMinds.value, 10);
    var gate = parseFloat(sGate.value);
    var fid = parseFloat(sFid.value);

    document.getElementById('v-minds').textContent = nMinds + (nMinds === 1 ? ' mind' : ' minds');
    document.getElementById('v-gate').textContent = gate.toFixed(2);
    document.getElementById('v-fid').textContent = fid.toFixed(2);

    var m = evalBciMetrics(mode, nMinds, gate, fid);
    var aEl = document.getElementById('m-bci-agency');
    aEl.textContent = (m.agency * 100).toFixed(1) + '%';
    aEl.style.color = m.agency >= 0.80 ? 'var(--color-brand-cyan)' : '#ef4444';
    document.getElementById('m-bci-agency-sub').textContent =
      mode === 'ungated_assim' ? 'Sovereignty erodes without θ_agency gate!' : 'Protected by local consent threshold θ_agency';

    document.getElementById('m-bci-gain').textContent = m.gain.toFixed(2) + '×';
    document.getElementById('m-bci-gain-sub').textContent = 'Effective collective capability multiplier';
    document.getElementById('m-bci-risk').textContent = (m.risk * 100).toFixed(1) + '%';
    document.getElementById('m-bci-risk-sub').textContent = mode === 'gated_nmind' ? 'Bounded by attested modulation envelope' : 'Unchecked cross-mind noise cascade';
    document.getElementById('m-bci-ratchet').textContent = m.ratchet.toFixed(2) + '×';
    document.getElementById('m-bci-ratchet-sub').textContent = 'Lower-loss transmission vs ~40 bit/s speech';

    var bciSvg = document.getElementById('bci-live-svg');
    if (bciSvg) {
      var px = 54, py = 18, pw = 600, ph = 152;
      function sx(n) { return px + ((n - 1) / 31.0) * pw; }
      function sy(y) { return py + ph - Math.max(0, Math.min(1, y)) * ph; }
      var pGated = [], pUngated = [];
      for (var k = 1; k <= 32; k++) {
        pGated.push(sx(k).toFixed(1) + ',' + sy(evalBciMetrics('gated_nmind', k, gate, fid).agency).toFixed(1));
        pUngated.push(sx(k).toFixed(1) + ',' + sy(evalBciMetrics('ungated_assim', k, gate, fid).agency).toFixed(1));
      }
      var curX = sx(nMinds);
      var curY = sy(m.agency);
      bciSvg.innerHTML =
        '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" fill="rgba(15,23,42,0.32)" stroke="rgba(148,163,184,0.25)"/>' +
        '<line x1="' + curX.toFixed(1) + '" y1="' + py + '" x2="' + curX.toFixed(1) + '" y2="' + (py + ph) + '" stroke="#f59e0b" stroke-dasharray="3,3"/>' +
        '<polyline fill="none" stroke="#ef4444" stroke-width="2.1" stroke-dasharray="5,3" points="' + pUngated.join(' ') + '"/>' +
        '<polyline fill="none" stroke="#00d4aa" stroke-width="2.6" points="' + pGated.join(' ') + '"/>' +
        '<circle cx="' + curX.toFixed(1) + '" cy="' + curY.toFixed(1) + '" r="5.5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>' +
        '<text x="' + px + '" y="' + (py + ph + 16) + '" font-size="10" fill="#94a3b8" font-family="monospace">N = 1</text>' +
        '<text x="' + (px + pw) + '" y="' + (py + ph + 16) + '" text-anchor="end" font-size="10" fill="#94a3b8" font-family="monospace">N = 32 Bridged Minds</text>' +
        '<text x="' + (px + pw - 8) + '" y="' + (py + 15) + '" text-anchor="end" font-size="10.5" fill="#00d4aa" font-family="monospace">Consent-Gated Agency (cyan) vs Ungated Assimilation (red dashed)</text>';
    }

    if (updateUrl) syncUrl();
    return {
      mode: mode,
      participants_N: nMinds,
      consent_threshold: gate,
      channel_fidelity: fid,
      retained_agency_pct: +(m.agency * 100).toFixed(2),
      collective_gain_x: +m.gain.toFixed(3),
      cascade_risk_pct: +(m.risk * 100).toFixed(2)
    };
  }

  [selBci, sMinds, sGate, sFid].forEach(function (el) {
    el.addEventListener('input', function () { renderBci(true); });
    el.addEventListener('change', function () { renderBci(true); });
  });

  // Hydrate initial state from URL query params
  var qs = new URLSearchParams(window.location.search);
  if (qs.get('bio') && BIO_META[qs.get('bio')]) selBio.value = qs.get('bio');
  if (qs.get('stim')) sStim.value = qs.get('stim');
  if (qs.get('coop')) sCoop.value = qs.get('coop');
  if (qs.get('noise')) sNoise.value = qs.get('noise');
  if (qs.get('duty')) selDuty.value = qs.get('duty');
  if (qs.get('cat')) selCat.value = qs.get('cat');
  if (qs.get('topo')) selTopo.value = qs.get('topo');
  if (qs.get('fault')) selFault.value = qs.get('fault');
  if (qs.get('bci')) selBci.value = qs.get('bci');
  if (qs.get('minds')) sMinds.value = qs.get('minds');
  if (qs.get('gate')) sGate.value = qs.get('gate');
  if (qs.get('fid')) sFid.value = qs.get('fid');

  renderBio(false);
  renderOrchestration(false);
  renderBci(false);

  // -------------------------------------------------------------------------
  // Panel 4 (ca-diag-04): 10-Camp DES-10 Synthesizer, 1950-2026 History & Horizon
  // -------------------------------------------------------------------------
  var selHost = document.getElementById('sel-host');
  var selHor = document.getElementById('sel-horizon');
  var sArr = document.getElementById('s-arrivals');
  var sZipf = document.getElementById('s-zipf');
  var sEnz = document.getElementById('s-enz');
  var campChecks = Array.from(document.querySelectorAll('#camp-toggles input[data-camp]'));

  function getEnabledCamps() {
    var map = {};
    campChecks.forEach(function (cb) { map[cb.getAttribute('data-camp')] = !!cb.checked; });
    return map;
  }

  function renderDes10(updateUrl) {
    if (!selHost || !D.des10_synthesis) return null;
    var syn = D.des10_synthesis;
    var hostKey = selHost.value;
    var horKey = selHor.value;
    var N = parseInt(sArr.value, 10) || 1000;
    var skew = parseFloat(sZipf.value) || 1.15;
    var enzMj = parseFloat(sEnz.value) || 0.65;
    var enzJ = enzMj * 0.001;
    var enabled = getEnabledCamps();

    var h = (syn.hosts && syn.hosts[hostKey]) || syn.hosts.intel_core_i9_13900h_rapl;
    var hor = (syn.horizons && syn.horizons[horKey]) || syn.horizons.quarters_1_4;

    document.getElementById('v-arrivals').textContent = N.toLocaleString();
    document.getElementById('v-zipf').textContent = skew.toFixed(2);
    document.getElementById('v-enz').textContent = enzMj.toFixed(2) + ' mJ';

    var chipEl = document.getElementById('des-basis-chip');
    if (chipEl) {
      chipEl.textContent = h.board_metered
        ? 'Inline Shunt Telemetry (Thor INA238 / INA3221 measured_j)'
        : 'On-Chip Counter (' + hostKey.split('_')[0].toUpperCase() + ' reported_j · board_metered = false)';
      chipEl.className = h.board_metered ? 'chip chip-meas' : 'chip chip-sim';
    }

    // Build Zipfian arrival sequence over K = 24 structural equivalence classes
    var K = 24;
    var weights = [], wSum = 0;
    for (var r = 1; r <= K; r++) {
      var w = 1.0 / Math.pow(r, skew);
      weights.push(w);
      wSum += w;
    }

    // Capability flags from C1..C10 toggles
    var hasTier2 = !!(enabled.C2 || enabled.C7);
    var hasTier1 = !!enabled.C5;
    var hasTier0 = !!enabled.C8;
    var hasEbm = !!enabled.C3;
    var hasSearch = !!(enabled.C4 || enabled.C6 || enabled.C1);
    var hasGate = !!(enabled.C2 || enabled.C10);
    var chatAvalanche = !!enabled.C9 && !hasGate;

    // Effective tier invocation costs (in Joules)
    var c3 = h.tier3_llm_j * (hasEbm ? 0.72 : 1.0) * (enabled.C9 ? (hasGate ? 1.35 : 3.71) : 1.0);
    if (!hasSearch) c3 = h.tier3_llm_j * 1.15;
    var c2 = h.tier2_sym_j + enzJ;
    var c1 = h.tier1_case_j + enzJ * 0.5;
    var c0 = h.tier0_lut6_est_j + enzJ * 0.02;

    // Deterministic step-by-step simulation across N arrivals
    var classHits = new Array(K).fill(0);
    var cumDes = 0, cumMono = 0, cumChat = 0;
    var cntT0 = 0, cntT1 = 0, cntT2 = 0, cntT3 = 0;
    var ptsDes = [], ptsMono = [], ptsChat = [];
    var stride = Math.max(1, Math.floor(N / 80));
    var breakEvenStep = 1;
    var crossed = false;

    for (var step = 1; step <= N; step++) {
      // Deterministic low-discrepancy rank draw matching Zipf weights
      var u = ((step * 0.61803398875) % 1.0) * wSum;
      var acc = 0, cls = K - 1;
      for (var j = 0; j < K; j++) {
        acc += weights[j];
        if (u <= acc) { cls = j; break; }
      }
      classHits[cls] += 1;
      var hits = classHits[cls];
      var eStep = 0;

      if (hits === 1) {
        cntT3++;
        eStep = c3 + enzJ + (hasTier2 ? h.synth_3to2_j : (hasTier1 ? h.synth_2to1_j : 0));
      } else if (hits <= 4) {
        if (hasTier2) {
          cntT2++;
          eStep = c2 + (hits === 4 && hasTier1 ? h.synth_2to1_j : 0);
        } else if (hasTier1) {
          cntT1++;
          eStep = c1;
        } else {
          cntT3++;
          eStep = c3 + enzJ;
        }
      } else if (hits <= 45 || cls >= 6 || !hasTier0) {
        if (hasTier1) {
          cntT1++;
          eStep = c1 + (hits === 45 && cls < 6 && hasTier0 ? h.synth_1to0_j : 0);
        } else if (hasTier2) {
          cntT2++;
          eStep = c2;
        } else {
          cntT3++;
          eStep = c3 + enzJ;
        }
      } else {
        cntT0++;
        eStep = c0;
      }

      cumDes += eStep;
      cumMono += h.tier3_llm_j;
      cumChat += h.tier3_llm_j * 3.71;
      if (!crossed && cumDes < cumMono) {
        crossed = true;
        breakEvenStep = step;
      }
      if (step === 1 || step % stride === 0 || step === N) {
        ptsDes.push([step, cumDes]);
        ptsMono.push([step, cumMono]);
        ptsChat.push([step, cumChat]);
      }
    }

    var falseCommitPct = hasGate ? 0.0 : (chatAvalanche ? 13.33 : 4.20);
    var verifiedTasks = Math.round(N * (hasSearch || hasTier2 ? 0.9833 : 0.6667) * (1.0 - falseCommitPct / 100.0));
    if (!enabled.C7 && verifiedTasks > 0) verifiedTasks = Math.max(1, Math.round(verifiedTasks * 0.94));
    var cpjDes = verifiedTasks / Math.max(1e-6, cumDes);
    var cpjMono = (N * 0.9833) / Math.max(1e-6, cumMono);
    var cpjGain = cpjDes / Math.max(1e-9, cpjMono);
    var nStar3to2 = Math.max(1, Math.ceil(h.synth_3to2_j / Math.max(0.01, h.tier3_llm_j - c2)));

    var jBasisTag = h.board_metered ? 'measured_j' : 'reported_j';
    document.getElementById('m-des-j').textContent = cumDes.toFixed(1) + ' J (' + jBasisTag + ')';
    document.getElementById('m-des-j-sub').textContent =
      'vs ' + cumMono.toFixed(0) + ' J monolithic & ' + cumChat.toFixed(0) + ' J 4-agent chat';

    document.getElementById('m-des-cpj').textContent = cpjGain.toFixed(1) + '× CpJ (' + cpjDes.toFixed(2) + '/J)';
    document.getElementById('m-des-cpj-sub').textContent =
      'Rule break-even N* = ' + nStar3to2 + ' repeat · Horizon crossover step ' + breakEvenStep;

    var gateEl = document.getElementById('m-des-gate');
    gateEl.textContent = falseCommitPct === 0 ? '0.00% False Commits' : falseCommitPct.toFixed(2) + '% FALSE COMMITS';
    gateEl.style.color = falseCommitPct === 0 ? 'var(--color-brand-cyan)' : '#f43f5e';
    var lowShare = (((cntT0 + cntT1 + cntT2) / N) * 100.0).toFixed(1);
    document.getElementById('m-des-gate-sub').textContent =
      lowShare + '% crystallized (T0:' + cntT0 + ' · T1:' + cntT1 + ' · T2:' + cntT2 + ' · T3:' + cntT3 + ')';

    document.getElementById('m-des-hor').textContent = hor.theorems + ' · ' + hor.target_cpj;
    document.getElementById('m-des-hor-sub').textContent = hor.kill;

    // Render interactive dual-panel SVG (#des10-live-svg)
    var svg = document.getElementById('des10-live-svg');
    if (svg) {
      var lx = 54, ly = 24, lw = 420, lh = 186;
      var maxLog = Math.log10(Math.max(10, cumChat * 1.15));
      var minLog = -0.5;
      function sx(st) { return lx + ((st - 1) / Math.max(1, N - 1)) * lw; }
      function sy(valJ) {
        var lg = Math.log10(Math.max(0.35, valJ));
        var f = (lg - minLog) / (maxLog - minLog);
        return ly + lh - Math.max(0, Math.min(1, f)) * lh;
      }
      var polyChat = ptsChat.map(function (p) { return sx(p[0]).toFixed(1) + ',' + sy(p[1]).toFixed(1); }).join(' ');
      var polyMono = ptsMono.map(function (p) { return sx(p[0]).toFixed(1) + ',' + sy(p[1]).toFixed(1); }).join(' ');
      var polyDes = ptsDes.map(function (p) { return sx(p[0]).toFixed(1) + ',' + sy(p[1]).toFixed(1); }).join(' ');

      // Right subpanel: Tier distribution horizontal bars x=506..744
      var rx = 506, rw = 236;
      var tiersBar = [
        ['Tier 0 LUT6 (~12 pJ)', cntT0, '#10b981', 50],
        ['Tier 1 Shape-D (1.8 µJ)', cntT1, '#22d3ee', 96],
        ['Tier 2 Sym/Causal (mJ)', cntT2, '#a78bfa', 142],
        ['Tier 3 EBM/LLM (~15 J)', cntT3, '#f59e0b', 188]
      ];
      var barsXml = tiersBar.map(function (tb) {
        var pct = (tb[1] / N) * 100.0;
        var bw = Math.max(2, (pct / 100.0) * (rw - 16));
        return '<text x="' + rx + '" y="' + (tb[3] - 6) + '" font-size="9.6" fill="#cbd5e1" font-family="monospace">' + tb[0] + ' · ' + pct.toFixed(1) + '%</text>' +
          '<rect x="' + rx + '" y="' + tb[3] + '" width="' + (rw - 16) + '" height="13" rx="3" fill="rgba(15,23,42,0.7)" stroke="rgba(148,163,184,0.2)"/>' +
          '<rect x="' + rx + '" y="' + tb[3] + '" width="' + bw.toFixed(1) + '" height="13" rx="3" fill="' + tb[2] + '"/>';
      }).join('');

      svg.innerHTML =
        '<rect x="6" y="6" width="748" height="232" rx="10" fill="rgba(15,23,42,0.34)" stroke="rgba(148,163,184,0.24)"/>' +
        '<rect x="' + lx + '" y="' + ly + '" width="' + lw + '" height="' + lh + '" fill="rgba(11,17,32,0.75)" stroke="rgba(148,163,184,0.22)"/>' +
        '<polyline fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="5,3" points="' + polyChat + '"/>' +
        '<polyline fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" points="' + polyMono + '"/>' +
        '<polyline fill="none" stroke="#10b981" stroke-width="2.8" points="' + polyDes + '"/>' +
        '<text x="' + (lx + 8) + '" y="' + (ly + 15) + '" font-size="9.8" fill="#10b981" font-family="monospace">DES-10 Cascade (solid) vs Monolithic (amber) &amp; 4-Agent Chat (rose)</text>' +
        '<text x="' + lx + '" y="' + (ly + lh + 16) + '" font-size="9.5" fill="#94a3b8" font-family="monospace">Arrival 1</text>' +
        '<text x="' + (lx + lw / 2) + '" y="' + (ly + lh + 16) + '" text-anchor="middle" font-size="9.5" fill="#cbd5e1" font-family="monospace">Log10 Cumulative Energy (' + jBasisTag + ')</text>' +
        '<text x="' + (lx + lw) + '" y="' + (ly + lh + 16) + '" text-anchor="end" font-size="9.5" fill="#94a3b8" font-family="monospace">Arrival ' + N + '</text>' +
        '<text x="' + rx + '" y="26" font-size="10.2" font-weight="700" fill="#f8fafc" font-family="sans-serif">Execution Tier Share (N=' + N + ')</text>' +
        barsXml;
    }

    // Populate 1950-2026 History Table & C1..C10 Table
    var eraTbody = document.getElementById('ai-era-tbody');
    if (eraTbody && syn.ai_eras_1950_2026) {
      eraTbody.innerHTML = syn.ai_eras_1950_2026.map(function (e, i) {
        var is2026 = i === syn.ai_eras_1950_2026.length - 1;
        return '<tr style="border-bottom:1px solid rgba(148,163,184,0.13);' + (is2026 ? 'background:rgba(16,185,129,0.08);' : '') + '">' +
          '<td style="padding:0.32rem;font-family:var(--font-mono);font-weight:700;color:' + (is2026 ? '#10b981' : '#f8fafc') + ';">' + e.era + '<div style="font-weight:400;color:#94a3b8;font-size:0.72rem;">' + e.milestones + '</div></td>' +
          '<td style="padding:0.32rem;">' + e.externalized + '<div style="color:#22d3ee;font-size:0.72rem;font-family:var(--font-mono);">Gate: ' + e.gate + '</div></td>' +
          '<td style="padding:0.32rem;color:' + (is2026 ? '#10b981' : '#cbd5e1') + ';">' + e.stall + '</td></tr>';
      }).join('');
    }

    var campsTbody = document.getElementById('camps-tbody');
    if (campsTbody && syn.camps) {
      campsTbody.innerHTML = syn.camps.map(function (c) {
        var on = !!enabled[c.id];
        return '<tr style="border-bottom:1px solid rgba(148,163,184,0.13);opacity:' + (on ? '1' : '0.48') + ';">' +
          '<td style="padding:0.3rem;font-family:var(--font-mono);font-weight:700;">' + c.id + ' · ' + c.name + '</td>' +
          '<td style="padding:0.3rem;font-family:var(--font-mono);color:' + (on ? '#10b981' : '#f43f5e') + ';">' + (on ? 'ACTIVE' : 'OFF') + '</td>' +
          '<td style="padding:0.3rem;"><span style="color:#10b981;">+ ' + c.superpower + '</span><br><span style="color:#94a3b8;">− ' + c.blindspot + '</span></td></tr>';
      }).join('');
    }

    if (updateUrl && window.history && window.history.replaceState) {
      syncUrl();
      var u2 = new URL(window.location.href);
      u2.searchParams.set('host', hostKey);
      u2.searchParams.set('hor', horKey);
      u2.searchParams.set('arr', String(N));
      u2.searchParams.set('zipf', skew.toFixed(2));
      u2.searchParams.set('enz', enzMj.toFixed(2));
      var activeList = Object.keys(enabled).filter(function (k) { return enabled[k]; }).join(',');
      u2.searchParams.set('camps', activeList);
      window.history.replaceState(null, '', u2.pathname + u2.search + u2.hash);
    }

    return {
      host: hostKey,
      board_metered: h.board_metered,
      energy_basis: jBasisTag,
      horizon: horKey,
      arrivals_N: N,
      zipf_skew: skew,
      enzyme_overhead_mj: enzMj,
      des10_total_j: +cumDes.toFixed(3),
      monolithic_total_j: +cumMono.toFixed(3),
      cpj_multiplier_vs_mono: +cpjGain.toFixed(3),
      false_commit_rate_pct: falseCommitPct,
      tier_counts: { tier0_lut6: cntT0, tier1_shape_d: cntT1, tier2_symbolic: cntT2, tier3_llm: cntT3 }
    };
  }

  if (selHost) {
    [selHost, selHor, sArr, sZipf, sEnz].forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', function () { renderDes10(true); });
      el.addEventListener('change', function () { renderDes10(true); });
    });
    campChecks.forEach(function (cb) {
      cb.addEventListener('change', function () { renderDes10(true); });
    });
    if (qs.get('host') && D.des10_synthesis && D.des10_synthesis.hosts[qs.get('host')]) selHost.value = qs.get('host');
    if (qs.get('hor') && D.des10_synthesis && D.des10_synthesis.horizons[qs.get('hor')]) selHor.value = qs.get('hor');
    if (qs.get('arr')) sArr.value = qs.get('arr');
    if (qs.get('zipf')) sZipf.value = qs.get('zipf');
    if (qs.get('enz')) sEnz.value = qs.get('enz');
    if (qs.get('camps')) {
      var setC = new Set(qs.get('camps').split(','));
      campChecks.forEach(function (cb) { cb.checked = setC.has(cb.getAttribute('data-camp')); });
    }
    renderDes10(false);
  }


  // Lightbox for publication SVG figure
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

  // Expose programmatic API on window.openieLivingLab + WebMCP registration
  window.openieLivingLab = {
    studyId: 'communication-avalanche',
    data: D,
    simulateBiologicalThreshold: function (opts) {
      if (opts && opts.rung && BIO_META[opts.rung]) selBio.value = opts.rung;
      if (opts && opts.stimulus_ratio != null) sStim.value = String(opts.stimulus_ratio);
      if (opts && opts.cooperativity != null) sCoop.value = String(opts.cooperativity);
      if (opts && opts.noise_sigma != null) sNoise.value = String(opts.noise_sigma);
      return renderBio(true);
    },
    exploreCtaOrchestration: function (opts) {
      if (opts && opts.duty_cycle) selDuty.value = opts.duty_cycle;
      if (opts && opts.category) selCat.value = opts.category;
      if (opts && opts.topology) selTopo.value = opts.topology;
      if (opts && opts.fault_probe) selFault.value = opts.fault_probe;
      return renderOrchestration(true);
    },
    exploreBciAgencyBridge: function (opts) {
      if (opts && opts.mode) selBci.value = opts.mode;
      if (opts && opts.participants_N != null) sMinds.value = String(opts.participants_N);
      if (opts && opts.consent_threshold != null) sGate.value = String(opts.consent_threshold);
      if (opts && opts.channel_fidelity != null) sFid.value = String(opts.channel_fidelity);
      return renderBci(true);
    },
    simulateDes10ForcingHorizon: function (opts) {
      if (opts && opts.host && selHost) selHost.value = opts.host;
      if (opts && opts.horizon && selHor) selHor.value = opts.horizon;
      if (opts && opts.arrivals_N != null && sArr) sArr.value = String(opts.arrivals_N);
      if (opts && opts.zipf_skew != null && sZipf) sZipf.value = String(opts.zipf_skew);
      if (opts && opts.enzyme_overhead_mj != null && sEnz) sEnz.value = String(opts.enzyme_overhead_mj);
      if (opts && Array.isArray(opts.enabled_camps)) {
        var cset = new Set(opts.enabled_camps);
        campChecks.forEach(function (cb) { cb.checked = cset.has(cb.getAttribute('data-camp')); });
      }
      return renderDes10(true);
    }
  };

  var mc = document.modelContext || navigator.modelContext;
  if (window.isSecureContext && mc && typeof mc.registerTool === 'function') {
    [
      {
        name: 'simulate_cta_biological_threshold',
        title: 'Simulate biological quorum/SepJ/murmuration/Physarum threshold gating',
        description: 'Evaluates biological signal externalization and sub-threshold noise rejection in /living/communication-avalanche/ Panel 1.',
        inputSchema: {
          type: 'object',
          properties: {
            rung: { type: 'string', enum: ['hill_quorum', 'sepj_nanopore', 'starling_topo', 'physarum_flow'] },
            stimulus_ratio: { type: 'number', minimum: 0.05, maximum: 4.0 },
            cooperativity: { type: 'number', minimum: 1.0, maximum: 6.0 },
            noise_sigma: { type: 'number', minimum: 0.0, maximum: 0.5 }
          },
          additionalProperties: false
        },
        execute: function (inp) { return window.openieLivingLab.simulateBiologicalThreshold(inp || {}); },
        annotations: { readOnlyHint: true }
      },
      {
        name: 'explore_cta_orchestration_receipts',
        title: 'Inspect CTA-E1..E3 Linux RAPL reported_j, Coherence per Joule, and BLAKE3+Ed25519 receipts',
        description: 'Queries empirical hardware results across CTA-E1 polling vs eventfd, CTA-E2 60-task code repair, and CTA-E3 Byzantine fault isolation.',
        inputSchema: {
          type: 'object',
          properties: {
            duty_cycle: { type: 'string', enum: ['duty_01pct', 'duty_05pct', 'duty_20pct'] },
            category: { type: 'string', enum: ['all', 'cat1_syntax_import', 'cat2_scope_type_api', 'cat3_algo_state_logic'] },
            topology: { type: 'string', enum: ['nominal', 'escalated', 'drop_det', 'drop_multi'] },
            fault_probe: { type: 'string', enum: ['none', 'payload_bitflip_50', 'spoofed_sender_50', 'truncated_frame_50', 'semantic_regression_50'] }
          },
          additionalProperties: false
        },
        execute: function (inp) { return window.openieLivingLab.exploreCtaOrchestration(inp || {}); },
        annotations: { readOnlyHint: true }
      },
      {
        name: 'explore_cta_bci_agency_bridge',
        title: 'Evaluate BCI sensing-to-modulation and consent-gated N-mind agency retention',
        description: 'Compares retained individual sovereignty and collective gain across read-only, dyadic supplementation, consent-gated N-mind, and ungated broadcast modes.',
        inputSchema: {
          type: 'object',
          properties: {
            mode: { type: 'string', enum: ['read_only', 'supp_dyad', 'gated_nmind', 'ungated_assim'] },
            participants_N: { type: 'integer', minimum: 1, maximum: 32 },
            consent_threshold: { type: 'number', minimum: 0.05, maximum: 0.95 },
            channel_fidelity: { type: 'number', minimum: 0.1, maximum: 0.98 }
          },
          additionalProperties: false
        },
        execute: function (inp) { return window.openieLivingLab.exploreBciAgencyBridge(inp || {}); },
        annotations: { readOnlyHint: true }
      },
      {
        name: 'simulate_cta_des10_forcing_horizon',
        title: 'Simulate 10-camp DES-10 enzymatic synthesis and downward crystallization across 5 hosts',
        description: 'Evaluates Coherence per Joule, N* break-even amortization, and false-commit gating across 5 hosts (including Jetson AGX Thor INA238/INA3221 measured_j) and C1..C10 camp ablations.',
        inputSchema: {
          type: 'object',
          properties: {
            host: { type: 'string', enum: ['intel_core_i9_13900h_rapl', 'nvidia_jetson_agx_thor_ina238', 'apple_m5_max_ioreport', 'amd_strix_halo_rapl', 'win11_rtx2060_nvml'] },
            horizon: { type: 'string', enum: ['months_1_3', 'quarters_1_4', 'years_1_5', 'decade_1'] },
            arrivals_N: { type: 'integer', minimum: 50, maximum: 5000 },
            zipf_skew: { type: 'number', minimum: 0.4, maximum: 1.8 },
            enzyme_overhead_mj: { type: 'number', minimum: 0.1, maximum: 5.0 },
            enabled_camps: { type: 'array', items: { type: 'string' } }
          },
          additionalProperties: false
        },
        execute: function (inp) { return window.openieLivingLab.simulateDes10ForcingHorizon(inp || {}); },
        annotations: { readOnlyHint: true }
      }
    ].forEach(function (t) { try { Promise.resolve(mc.registerTool(t)).catch(function () {}); } catch (_e) {} });
  }
})();
