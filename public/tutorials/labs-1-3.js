/* OpenIE Interactive Tutorials — Track A Labs 1–3 (Quorum/SepJ, Attested Orchestrator, AI Winters Ratchet) */
(function () {
  const Reg = window.OE_TUTORIALS;

  /* ─────────────────────────── LAB 01: QUORUM & SEPJ ─────────────────────────── */
  Reg.register('lab-01-quorum-sepj', function () {
    const N = 20, m = new Float64Array(N).fill(1.0), g = new Float64Array(N - 1).fill(1.0);
    const params = { n: 2, ratio: 0.20, sepj: 'fast005', lysed: false, elapsed: 0 };

    function resetFilament(lyseNow) {
      m.fill(1.0); g.fill(1.0);
      params.lysed = Boolean(lyseNow); params.elapsed = 0;
      if (params.lysed) m[0] = 0.0;
    }
    function hillStats(p) {
      const x = p.ratio, n = Number(p.n), hn = Math.pow(x, n) / (1 + Math.pow(x, n));
      const regAtp = 12.0 + 1800.0 * hn, savedPct = Math.max(0, ((1800.0 - regAtp) / 1800.0) * 100);
      const falseWake = n === 1 ? 51.90 : (n === 2 ? 17.75 : 4.45);
      const viable = Array.from(m).filter((v, idx) => idx > 0 && v >= 0.50).length + (m[0] >= 0.5 ? 1 : 0);
      return { hn, regAtp, savedPct, falseWake, viable };
    }

    return {
      params,
      controls: [
        { type: 'select', key: 'n', numeric: true, label: 'Hill Cooperativity n', options: [[1, 'n = 1 (Monomer)'], [2, 'n = 2 (LuxR Dimer)'], [4, 'n = 4 (Tetramer)']] },
        { type: 'range', key: 'ratio', label: 'Autoinducer Density A/K', min: 0.05, max: 1.60, step: 0.05, fmt: (v) => v.toFixed(2) },
        { type: 'select', key: 'sepj', label: 'SepJ Nanopore Gate', options: [['ungated', 'Ungated Lock-Open'], ['slow120', 'Slow Closure (1.20 s)'], ['mid030', 'Boundary (0.30 s)'], ['fast005', 'Fast Ca2+ Plug (0.05 s)']] },
        { type: 'action', label: '⚡ Trigger Cell-0 Lysis', onClick: () => resetFilament(true) },
        { type: 'action', label: '↺ Heal Filament', onClick: () => resetFilament(false) }
      ],
      onParamChange(k) { if (k === 'sepj' && params.lysed) resetFilament(true); },
      applyPreset(step) {
        if (step === 2) { params.n = 1; params.ratio = 0.20; params.sepj = 'ungated'; resetFilament(true); }
        if (step === 3) { params.n = 4; params.ratio = 0.20; params.sepj = 'fast005'; resetFilament(true); }
      },
      step(dt) {
        if (!params.lysed) return;
        const sub = 8, h = (dt * 2.2) / sub;
        const tau = ({ ungated: 1e9, slow120: 1.20, mid030: 0.30, fast005: 0.05 })[params.sepj] || 0.05;
        const D = params.sepj === 'ungated' ? 28.0 : 14.5;
        for (let s = 0; s < sub; s++) {
          params.elapsed += h; m[0] = 0.0;
          for (let j = 0; j < N - 1; j++) {
            if (tau < 1e6 && (j === 0 || Math.abs(m[j + 1] - m[j]) > 0.22)) {
              g[j] = Math.max(0, g[j] - (h / tau) * (j === 0 ? 1.0 : 0.65));
            }
          }
          const dm = new Float64Array(N);
          for (let i = 1; i < N; i++) {
            dm[i] = D * g[i - 1] * (m[i - 1] - m[i]) + (i < N - 1 ? D * g[i] * (m[i + 1] - m[i]) : 0);
          }
          for (let i = 1; i < N; i++) m[i] = Math.max(0, Math.min(1, m[i] + h * dm[i]));
        }
      },
      draw(ctx, W, H, pal, p, ui, t) {
        ui.clearBg(ctx, W, H, pal);
        const st = hillStats(p), topH = Math.floor(H * 0.50);
        const gx = 42, gy = 26, gw = Math.floor(W * 0.44) - 56, gh = topH - 46;
        ui.box(ctx, gx - 28, gy - 14, gw + 44, gh + 34, 10, pal.panel, pal.faint);
        ctx.font = '600 11px "JetBrains Mono", monospace'; ctx.fillStyle = pal.cyan;
        ctx.fillText(`CA-M1 HILL GATE H_${p.n}(A/K) · ATP SAVED ${st.savedPct.toFixed(1)}%`, gx - 16, gy + 2);

        const ox = gx + 10, oy = gy + gh + 4, pw = gw - 16, ph = gh - 26;
        ctx.strokeStyle = pal.faint; ctx.beginPath(); ctx.moveTo(ox, oy - ph); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
        [1, 2, 4].forEach((nVal) => {
          ctx.beginPath(); ctx.strokeStyle = nVal === Number(p.n) ? pal.cyan : pal.faint; ctx.lineWidth = nVal === Number(p.n) ? 2.6 : 1.1;
          for (let k = 0; k <= 50; k++) {
            const u = (k / 50) * 1.6, yv = Math.pow(u, nVal) / (1 + Math.pow(u, nVal));
            const px = ox + (u / 1.6) * pw, py = oy - yv * ph;
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        });
        ctx.fillStyle = st.regAtp > 250 ? pal.rose : pal.emerald;
        ctx.beginPath(); ctx.arc(ox + (Math.min(1.6, p.ratio) / 1.6) * pw, oy - st.hn * ph, 5.5, 0, Math.PI * 2); ctx.fill();

        const cx0 = Math.floor(W * 0.46), cw0 = W - cx0 - 16;
        ui.box(ctx, cx0, gy - 14, cw0, gh + 34, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.amber; ctx.fillText(`COLONY SECRETOME SPEND: ${st.regAtp.toFixed(1)} / 1800 ATP`, cx0 + 12, gy + 2);
        for (let b = 0; b < 12; b++) {
          const bx = cx0 + 34 + (b % 4) * ((cw0 - 68) / 3), by = gy + 32 + Math.floor(b / 4) * ((gh - 34) / 2.2) + Math.sin(t * 2.2 + b) * 3;
          const firing = st.hn > 0.14 || (Number(p.n) === 1 && Math.sin(t * 4 + b * 1.7) > 0);
          ctx.fillStyle = firing ? 'rgba(244,63,94,0.22)' : 'rgba(16,185,129,0.18)';
          ctx.strokeStyle = firing ? pal.rose : pal.emerald; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.ellipse(bx, by, 15, 8, 0.2 * Math.sin(b), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          if (firing) {
            ctx.fillStyle = pal.amber;
            for (let q = 0; q < 3; q++) ctx.fillRect(bx + Math.cos(t * 2.5 + q * 2.1 + b) * 20, by + Math.sin(t * 2.5 + q * 2.1 + b) * 12, 2.5, 2.5);
          }
        }

        const fy = topH + 14, fh = H - fy - 14;
        ui.box(ctx, 14, fy, W - 28, fh, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.ink; ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText(`CA-M2 20-CELL ANABAENA FILAMENT (CLICK CELL 0 TO LYSE) · VIABLE: ${st.viable}/20`, 26, fy + 19);
        const padX = 28, stepX = (W - padX * 2) / N, cellW = Math.max(12, stepX - 7), cellH = Math.min(54, fh - 54), cy = fy + Math.floor((fh + 16) / 2);
        for (let i = 0; i < N; i++) {
          const x = padX + i * stepX, pool = m[i];
          const col = (i === 0 && p.lysed) || pool < 0.50 ? pal.rose : (pool > 0.82 ? pal.emerald : pal.amber);
          ui.box(ctx, x, cy - cellH / 2, cellW, cellH, 7, pal.bg, col, 1.8);
          const fillH = Math.max(0, (cellH - 4) * pool);
          ctx.fillStyle = col; ctx.globalAlpha = 0.35; ctx.fillRect(x + 2, cy + cellH / 2 - 2 - fillH, cellW - 4, fillH); ctx.globalAlpha = 1;
          ctx.fillStyle = pal.ink; ctx.font = '500 9px "JetBrains Mono", monospace'; ctx.fillText(String(i), x + cellW * 0.28, cy + 3);
          ui.hit(x, cy - cellH / 2, cellW, cellH, () => resetFilament(true), `Cell ${i}`);
          if (i < N - 1) {
            const open = g[i];
            ctx.fillStyle = open < 0.08 ? pal.emerald : (p.lysed ? pal.rose : pal.cyan);
            ctx.fillRect(x + cellW + 1, cy - (open < 0.08 ? 9 : 3), Math.max(3, stepX - cellW - 2), open < 0.08 ? 18 : 6);
          }
        }
        ctx.fillStyle = pal.muted; ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(p.lysed ? (g[0] < 0.05 ? `✓ SepJ junction (0,1) sealed (${g[0].toFixed(3)}) -> ${st.viable}/20 cells saved!` : `⚠ SepJ junction (0,1) open (${g[0].toFixed(2)}) -> cytoplasmic sink draining filament!`) : 'Click Cell 0 (leftmost) or "Trigger Cell-0 Lysis" to rupture membrane at t = 0.', 26, fy + fh - 11);
      },
      telemetry(p) {
        const st = hillStats(p);
        return [
          { label: 'Regulon ATP / Cycle', value: `${st.regAtp.toFixed(2)} ATP (${st.savedPct.toFixed(2)}% saved)`, tone: st.savedPct >= 95 ? 'emerald' : 'amber' },
          { label: 'Sub-Quorum False Wakes', value: `${st.falseWake.toFixed(2)}%`, tone: st.falseWake < 10 ? 'emerald' : 'rose' },
          { label: 'Junction (0,1) Conductance', value: `${(g[0] * 100).toFixed(1)}% open`, tone: p.lysed && g[0] > 0.1 ? 'rose' : 'cyan' },
          { label: 'Filament Viability (CA-M2)', value: `${st.viable} / 20 (${((st.viable / N) * 100).toFixed(1)}%)`, tone: st.viable >= 18 ? 'emerald' : 'rose' }
        ];
      },
      checkGoal(step, p) {
        const st = hillStats(p);
        if (step === 2) return Number(p.n) === 1 && p.lysed && st.viable <= 3;
        if (step === 3) return Number(p.n) === 4 && st.savedPct >= 95 && p.lysed && st.viable >= 18 && g[0] < 0.05;
        return false;
      }
    };
  });

  /* ─────────────────────────── LAB 02: ATTESTED ORCHESTRATOR ─────────────────────────── */
  Reg.register('lab-02-attested-orchestrator', function () {
    const packets = [];
    const params = { wakeup: 'poll1khz', arch: 'unattested', poison: false, quarantined: 0, falseCommits: 0, cleanCommits: 0 };
    let spawnTimer = 0;

    return {
      params,
      controls: [
        { type: 'select', key: 'wakeup', label: 'Socket Wakeup (CTA-E1)', options: [['poll1khz', '1,000 Hz Busy Poll (300.73 J)'], ['eventfd', 'Zero-Clock eventfd (136.32 J)']] },
        { type: 'select', key: 'arch', label: 'Orchestration Envelope (CTA-E2)', options: [['unattested', 'Unattested 4-Agent Chat (Arm C)'], ['attested', 'BLAKE3 + Ed25519 + SSP (Arm D)']] },
        { type: 'toggle', key: 'poison', label: 'Byzantine Poison Edge' },
        { type: 'action', label: '↺ Reset Counters', onClick: (p) => { p.quarantined = 0; p.falseCommits = 0; p.cleanCommits = 0; packets.length = 0; } }
      ],
      applyPreset(step, p) {
        if (step === 2) { p.wakeup = 'poll1khz'; p.arch = 'unattested'; p.poison = true; }
        if (step === 3) { p.wakeup = 'eventfd'; p.arch = 'attested'; p.poison = true; p.falseCommits = 0; }
      },
      step(dt, _t, p) {
        spawnTimer += dt;
        if (spawnTimer > 0.50) { spawnTimer = 0; packets.push({ hop: 0, prog: 0, bad: p.poison, rerouted: false }); }
        for (let i = packets.length - 1; i >= 0; i--) {
          const pk = packets[i]; pk.prog += dt * 1.65;
          if (pk.prog >= 1) {
            pk.prog = 0;
            if (pk.hop === 1 && pk.bad && p.arch === 'attested') { p.quarantined++; pk.bad = false; pk.rerouted = true; }
            pk.hop++;
            if (pk.hop >= 3) {
              if (pk.bad || (p.arch === 'unattested' && (p.cleanCommits % 7 === 5))) p.falseCommits++;
              else p.cleanCommits++;
              packets.splice(i, 1);
            }
          }
        }
      },
      draw(ctx, W, H, pal, p, ui, t) {
        ui.clearBg(ctx, W, H, pal);
        const nodes = [
          { x: W * 0.13, y: H * 0.48, title: p.arch === 'attested' ? 'parse_kernel' : '1. Planner', sub: p.arch === 'attested' ? '0.21 ms · 331 tok' : '331 tok in' },
          { x: W * 0.38, y: H * 0.48, title: p.arch === 'attested' ? 'det_patch + eventfd' : '2. Coder', sub: p.arch === 'attested' ? '18.6 mJ gate' : '600 tok (1.8x)' },
          { x: W * 0.64, y: H * 0.28, title: p.arch === 'attested' ? 'Primary Edge' : '3. Reviewer', sub: p.poison ? '⚡ BYZANTINE' : (p.arch === 'attested' ? 'Ed25519 26 us' : '1,011 tok (3.1x)') },
          { x: W * 0.64, y: H * 0.72, title: 'SSP Clean Reroute', sub: 'Min-cost standby' },
          { x: W * 0.88, y: H * 0.48, title: p.arch === 'attested' ? 'diff_verifier' : '4. Summarizer', sub: p.arch === 'attested' ? '0/60 false' : '1,225 tok (3.71x)' }
        ];
        ui.badge(ctx, 16, 14, p.wakeup === 'eventfd' ? 'ZERO-CLOCK EVENTFD: 136.32 J (2.21x SAVED)' : '1,000 HZ POLLING: 300.73 J IDLE BURN', p.wakeup === 'eventfd' ? pal.emerald : pal.amber, pal);
        ui.badge(ctx, W - 285, 14, 'CLICK PRIMARY EDGE TO TOGGLE POISON', pal.cyan, pal);

        [[0, 1], [1, 2], [2, 4], [1, 3], [3, 4]].forEach(([a, b], idx) => {
          if (idx >= 3 && p.arch === 'unattested') return;
          const col = (idx === 1 && p.poison) ? pal.rose : (idx >= 3 ? pal.emerald : pal.cyan);
          ui.arrow(ctx, nodes[a].x + 52, nodes[a].y, nodes[b].x - 54, nodes[b].y, col, idx >= 3 ? 1.8 : 2.2, idx >= 3 && !p.poison);
        });
        ui.hit(nodes[1].x + 30, nodes[2].y - 24, nodes[2].x - nodes[1].x + 20, 90, () => { p.poison = !p.poison; }, 'Toggle Poison');

        packets.forEach((pk) => {
          const path = pk.rerouted ? [0, 1, 3, 4] : [0, 1, 2, 4];
          const a = nodes[path[pk.hop]], b = nodes[path[pk.hop + 1]];
          ctx.fillStyle = pk.bad ? pal.rose : (pk.rerouted ? pal.emerald : pal.cyan);
          ctx.beginPath(); ctx.arc(a.x + (b.x - a.x) * pk.prog, a.y + (b.y - a.y) * pk.prog, p.arch === 'unattested' ? 5 + pk.hop * 3.5 : 5.5, 0, Math.PI * 2); ctx.fill();
        });
        nodes.forEach((nd, i) => {
          if (i === 3 && p.arch === 'unattested') return;
          if (p.wakeup === 'poll1khz') {
            ctx.strokeStyle = pal.amber; ctx.globalAlpha = 0.35 + 0.25 * Math.sin(t * 18 + i);
            ctx.beginPath(); ctx.arc(nd.x, nd.y, 44, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
          }
          const border = (i === 2 && p.poison) ? pal.rose : (p.arch === 'attested' ? pal.emerald : pal.faint);
          ui.box(ctx, nd.x - 54, nd.y - 26, 108, 52, 9, pal.panel, border, 1.6);
          ctx.fillStyle = pal.ink; ctx.font = '600 10.5px "JetBrains Mono", monospace'; ctx.fillText(nd.title, nd.x - 46, nd.y - 4);
          ctx.fillStyle = (i === 2 && p.poison) ? pal.rose : pal.muted; ctx.font = '9.5px "JetBrains Mono", monospace'; ctx.fillText(nd.sub, nd.x - 46, nd.y + 14);
        });
      },
      telemetry(p) {
        return [
          { label: '1%-Duty Socket Energy', value: p.wakeup === 'eventfd' ? '136.32 J (2.21x cut)' : '300.73 J (1 kHz poll)', tone: p.wakeup === 'eventfd' ? 'emerald' : 'amber' },
          { label: 'Suite Accuracy & Safety', value: p.arch === 'attested' ? '98.33% (59/60, 0 false)' : (p.poison ? '0.00% (Poisoned!)' : '86.67% (8/60 false)'), tone: p.arch === 'attested' ? 'emerald' : 'rose' },
          { label: 'Byzantine Quarantined', value: `${p.quarantined} blocked · ${p.falseCommits} false commits`, tone: p.falseCommits === 0 ? 'emerald' : 'rose' },
          { label: 'Coherence per Joule (CpJ)', value: p.arch === 'attested' ? '14.97x vs Arm C' : '1.00x (5,710.77 J)', tone: p.arch === 'attested' ? 'cyan' : 'amber' }
        ];
      },
      checkGoal(step, p) {
        if (step === 2) return p.arch === 'unattested' && p.poison && p.falseCommits >= 1;
        if (step === 3) return p.wakeup === 'eventfd' && p.arch === 'attested' && p.poison && p.quarantined >= 1;
        return false;
      }
    };
  });

  /* ─────────────────────────── LAB 03: AI WINTERS RATCHET ─────────────────────────── */
  Reg.register('lab-03-ai-ratchet-winters', function () {
    const ERAS = {
      e1969: { year: '1969', name: 'Perceptron Bottleneck', f: 0.78, extOk: false, note: 'Linear feature limit stalls Phase E' },
      e1987: { year: '1987', name: 'MYCIN / Hearsay-II', f: 0.92, extOk: true, note: 'CF drift f^k & O(K*|B|) blackboard stall' },
      e2020: { year: '2017–24', name: 'Transformer Boom', f: 0.94, extOk: true, note: 'Massive Phase E, unverified multi-hop decay' },
      e2026: { year: '2026', name: 'Agent Token Blizzard', f: 0.92, extOk: true, note: 'Needs Sound Gate G + Downward Distill T' }
    };
    const params = { era: 'e1987', depth: 12, gateG: false, distillT: false };

    return {
      params,
      controls: [
        { type: 'select', key: 'era', label: 'Historical Regime (Click Cards)', options: [['e1969', '1969 · Perceptron'], ['e1987', '1987 · MYCIN / Blackboard'], ['e2020', '2017–24 · Transformer Boom'], ['e2026', '2026 · Multi-Agent Blizzard']] },
        { type: 'range', key: 'depth', label: 'Inference Chain Hops k', min: 1, max: 20, step: 1, fmt: (v) => `${v} hops` },
        { type: 'toggle', key: 'gateG', label: 'Sound Verifier Gate (G)' },
        { type: 'toggle', key: 'distillT', label: 'Downward Distillation (T)' }
      ],
      applyPreset(step, p) {
        if (step === 2) { p.era = 'e1987'; p.depth = 12; p.gateG = false; p.distillT = false; }
        if (step === 3) { p.era = 'e2026'; p.depth = 12; p.gateG = true; p.distillT = true; }
      },
      draw(ctx, W, H, pal, p, ui, t) {
        ui.clearBg(ctx, W, H, pal);
        const keys = Object.keys(ERAS), cw = (W - 44) / 4;
        keys.forEach((k, i) => {
          const e = ERAS[k], x = 14 + i * (cw + 5), act = p.era === k;
          ui.box(ctx, x, 12, cw, 48, 8, pal.panel, act ? pal.cyan : pal.faint, act ? 2 : 1);
          ctx.fillStyle = act ? pal.cyan : pal.amber; ctx.font = '700 11px "JetBrains Mono", monospace'; ctx.fillText(e.year, x + 9, 30);
          ctx.fillStyle = pal.ink; ctx.font = '500 10px "JetBrains Mono", monospace'; ctx.fillText(e.name.slice(0, 18), x + 9, 48);
          ui.hit(x, 12, cw, 48, () => { p.era = k; }, e.year);
        });
        const cur = ERAS[p.era], unlocked = cur.extOk && p.gateG && p.distillT;
        const rx = W * 0.23, ry = H * 0.58, rad = Math.min(72, H * 0.23), spin = unlocked ? t * 1.4 : Math.sin(t * 2) * 0.06;
        ctx.strokeStyle = unlocked ? pal.emerald : pal.rose; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(rx, ry, rad, 0, Math.PI * 2); ctx.stroke();
        [[-Math.PI / 2, 'E · Externalize', cur.extOk, pal.cyan], [Math.PI / 6, 'G · Sound Gate', p.gateG, pal.emerald], [(5 * Math.PI) / 6, 'T · Distill', p.distillT, pal.amber]].forEach(([ang, lbl, on, col]) => {
          const px = rx + Math.cos(ang + spin * 0.25) * rad, py = ry + Math.sin(ang + spin * 0.25) * rad;
          ui.box(ctx, px - 48, py - 15, 96, 30, 8, pal.panel, on ? col : pal.rose, 1.8);
          ctx.fillStyle = on ? col : pal.rose; ctx.font = '600 9.5px "JetBrains Mono", monospace'; ctx.fillText(lbl, px - 41, py + 4);
        });

        const gx = Math.floor(W * 0.46), gy = 74, gw = W - gx - 18, gh = H - 92;
        ui.box(ctx, gx, gy, gw, gh, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.ink; ctx.font = '600 11px "JetBrains Mono", monospace'; ctx.fillText(`CHAIN VALIDITY ACROSS k = ${p.depth} HOPS (${cur.note})`, gx + 14, gy + 20);
        const ox = gx + 34, oy = gy + gh - 26, pw = gw - 52, ph = gh - 62;
        ctx.strokeStyle = pal.faint; ctx.beginPath(); ctx.moveTo(ox, oy - ph); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
        ['unv', 'act'].forEach((mode) => {
          ctx.beginPath(); ctx.strokeStyle = mode === 'unv' ? pal.rose : (unlocked ? pal.emerald : pal.amber);
          ctx.lineWidth = mode === 'unv' ? 1.5 : 2.8; if (mode === 'unv') ctx.setLineDash([4, 4]); else ctx.setLineDash([]);
          for (let s = 0; s <= p.depth; s++) {
            let val = Math.pow(cur.f, s);
            if (mode === 'act') val = !cur.extOk ? 0.32 : (unlocked ? Math.min(0.995, 0.72 + 0.275 * (1 - Math.exp(-s * 0.28))) : (p.gateG ? 0.88 : val));
            const px = ox + (s / Math.max(1, p.depth)) * pw, py = oy - val * ph;
            if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke(); ctx.setLineDash([]);
        });
      },
      telemetry(p) {
        const cur = ERAS[p.era], fk = Math.pow(cur.f, p.depth) * 100, unlocked = cur.extOk && p.gateG && p.distillT;
        const liveVal = !cur.extOk ? 32.0 : (unlocked ? 99.2 : (p.gateG ? 88.0 : fk));
        return [
          { label: 'Unverified f^k Baseline', value: `${fk.toFixed(2)}% (f=${cur.f})`, tone: fk < 50 ? 'rose' : 'amber' },
          { label: 'Active Architecture Validity', value: `${liveVal.toFixed(2)}%`, tone: liveVal >= 95 ? 'emerald' : 'rose' },
          { label: 'Marginal Joule Trajectory', value: p.distillT && p.gateG ? 'Falling (Amortized)' : 'Linear / Blowup', tone: p.distillT && p.gateG ? 'emerald' : 'amber' },
          { label: 'Ratchet State (CTA-T5)', value: unlocked ? 'IGNITED Q(t+1)>=Q(t)' : 'WINTER STALL', tone: unlocked ? 'emerald' : 'rose' }
        ];
      },
      checkGoal(step, p) {
        const fk = Math.pow(ERAS[p.era].f, p.depth) * 100;
        if (step === 2) return !p.gateG && p.depth >= 12 && fk < 40;
        if (step === 3) return p.era === 'e2026' && p.gateG && p.distillT;
        return false;
      }
    };
  });
})();
