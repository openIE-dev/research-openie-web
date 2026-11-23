/* OpenIE Interactive Tutorials — Track B Labs 7–10 (Shape D Zipf, Q32.32 Lockstep, LUT6 Beneš, Time as an Index) */
(function () {
  const Reg = window.OE_TUTORIALS;

  /* ─────────────────────────── LAB 07: DETERMINISTIC NULL & ZIPF ─────────────────────────── */
  Reg.register('lab-07-deterministic-null', function () {
    const SLOTS = 12, slotState = new Array(SLOTS).fill(0);
    const params = { skew: 0.85, arch: 'crystallize', verifier: 'sound', seen: 0, llmCalls: 0, hits: 0, poisonedHits: 0 };
    let tickAcc = 0;

    function resetStream(p) { slotState.fill(0); p.seen = 0; p.llmCalls = 0; p.hits = 0; p.poisonedHits = 0; }
    function sampleZipf(s, idx) {
      let tot = 0; const w = [];
      for (let r = 1; r <= SLOTS; r++) { const v = 1 / Math.pow(r, s); w.push(v); tot += v; }
      let u = (((idx * 2654435761) >>> 0) / 4294967296) * tot;
      for (let i = 0; i < SLOTS; i++) { u -= w[i]; if (u <= 0) return i; }
      return 0;
    }

    return {
      params,
      controls: [
        { type: 'range', key: 'skew', label: 'Zipf Skew Exponent s', min: 0.10, max: 1.35, step: 0.05, fmt: (v) => v.toFixed(2) },
        { type: 'select', key: 'arch', label: 'Substrate Mode', options: [['frontier', 'Frontier Every Time (No Reuse)'], ['crystallize', 'Shape D + Online Crystallization']] },
        { type: 'select', key: 'verifier', label: 'Admission Gate', options: [['sound', 'Sound Deterministic Verifier'], ['unverified', 'Unverified Raw Cache']] },
        { type: 'action', label: '↺ Replay 200-Task Stream', onClick: (p) => resetStream(p) }
      ],
      onParamChange() { resetStream(params); },
      applyPreset(step, p) {
        if (step === 2) { p.skew = 0.85; p.arch = 'crystallize'; p.verifier = 'unverified'; resetStream(p); }
        if (step === 3) { p.skew = 0.85; p.arch = 'crystallize'; p.verifier = 'sound'; resetStream(p); }
      },
      step(dt, _t, p) {
        if (p.seen >= 200) return;
        tickAcc += dt * 55;
        while (tickAcc >= 1 && p.seen < 200) {
          tickAcc -= 1;
          const cls = sampleZipf(p.skew, p.seen + 1); p.seen++;
          if (p.arch === 'frontier') p.llmCalls++;
          else if (slotState[cls] === 1) p.hits++;
          else if (slotState[cls] === -1) { p.hits++; p.poisonedHits++; }
          else { p.llmCalls++; slotState[cls] = (p.verifier === 'sound' || cls % 3 !== 1) ? 1 : -1; }
        }
      },
      draw(ctx, W, H, pal, p, ui) {
        ui.clearBg(ctx, W, H, pal);
        ui.box(ctx, 14, 14, W * 0.50 - 18, H - 28, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.cyan; ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText(`DNULLMM1 12-CLASS CASE STORE (${p.seen}/200 ARRIVALS)`, 26, 34);
        const gx = 26, gy = 52, cw = (W * 0.50 - 54) / 4, ch = (H - 104) / 3;
        for (let i = 0; i < SLOTS; i++) {
          const x = gx + (i % 4) * cw, y = gy + Math.floor(i / 4) * ch, st = slotState[i];
          const col = st === 1 ? pal.emerald : (st === -1 ? pal.rose : pal.faint);
          ui.box(ctx, x + 2, y + 2, cw - 6, ch - 6, 7, pal.bg, col, st !== 0 ? 1.9 : 1);
          ctx.fillStyle = st === 0 ? pal.muted : col; ctx.font = '600 9.5px "JetBrains Mono", monospace';
          ctx.fillText(`C${i} ${st === 1 ? '1.77uJ' : (st === -1 ? 'POISON' : 'EMPTY')}`, x + 7, y + ch * 0.54);
        }

        const rx = Math.floor(W * 0.52), rw = W - rx - 14;
        ui.box(ctx, rx, 14, rw, H - 28, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.amber; ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText('CUMULATIVE FRONTIER JOULES (15 J/CALL VS DNULLMM1)', rx + 12, 34);
        const ox = rx + 26, oy = H - 38, pw = rw - 44, ph = H - 96;
        ctx.strokeStyle = pal.faint; ctx.beginPath(); ctx.moveTo(ox, oy - ph); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
        ctx.strokeStyle = pal.rose; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + (p.seen / 200) * pw, oy - (p.seen / 200) * ph); ctx.stroke();
        ctx.setLineDash([]); ctx.strokeStyle = p.poisonedHits > 0 ? pal.rose : pal.emerald; ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + (p.seen / 200) * pw, oy - (p.llmCalls / 200) * ph); ctx.stroke();
      },
      telemetry(p) {
        const red = p.llmCalls > 0 ? (Math.max(1, p.seen) / p.llmCalls) : 1;
        const jSpend = p.llmCalls * 15.0 + p.hits * 0.00000177;
        return [
          { label: 'Stream Progress', value: `${p.seen} / 200 tasks`, tone: 'cyan' },
          { label: 'Frontier Call Reduction', value: `${red.toFixed(2)}x (${p.llmCalls} calls)`, tone: red >= 3.59 ? 'emerald' : 'amber' },
          { label: 'Poisoned Cache Hits', value: `${p.poisonedHits} corrupted`, tone: p.poisonedHits === 0 ? 'emerald' : 'rose' },
          { label: 'Cumulative Spend', value: `${jSpend.toFixed(1)} J vs ${(p.seen * 15).toFixed(0)} J`, tone: red >= 3.59 && p.poisonedHits === 0 ? 'emerald' : 'amber' }
        ];
      },
      checkGoal(step, p) {
        const red = p.llmCalls > 0 ? p.seen / p.llmCalls : 1;
        if (step === 2) return (p.arch === 'frontier' && p.seen >= 100) || p.poisonedHits >= 5;
        if (step === 3) return p.arch === 'crystallize' && p.verifier === 'sound' && p.seen >= 120 && red >= 3.59 && p.poisonedHits === 0;
        return false;
      }
    };
  });

  /* ─────────────────────────── LAB 08: Q32.32 GAME LOCKSTEP VS 3-OS FLOAT ─────────────────────────── */
  Reg.register('lab-08-game-lockstep', function () {
    const params = { mode: 'float64_sin', lambda: 0.18, fma: true, tick: 0 };
    let hist = [];
    function resetOrbit(p) { p.tick = 0; hist = []; }

    return {
      params,
      controls: [
        { type: 'select', key: 'mode', label: 'Simulation Arithmetic', options: [['float64_sin', 'IEEE-754 float64 + OS std::sin'], ['q32_32', 'Q32.32 Fixed-Point RCE Form']] },
        { type: 'range', key: 'lambda', label: 'Chaotic Coupling lambda', min: 0.08, max: 0.30, step: 0.02, fmt: (v) => v.toFixed(2) },
        { type: 'toggle', key: 'fma', label: 'MSVC vs Clang FMA Contraction' },
        { type: 'action', label: '↺ Reset Tick 0', onClick: (p) => resetOrbit(p) }
      ],
      onParamChange() { resetOrbit(params); },
      applyPreset(step, p) {
        if (step === 2) { p.mode = 'float64_sin'; p.lambda = 0.20; resetOrbit(p); }
        if (step === 3) { p.mode = 'q32_32'; p.lambda = 0.20; resetOrbit(p); }
      },
      step(dt, _t, p) {
        if (p.tick < 240) {
          p.tick += dt * 34;
          const tk = Math.floor(p.tick);
          while (hist.length < tk && hist.length < 240) {
            const k = hist.length;
            hist.push(p.mode === 'q32_32' || k < 14 ? 0 : Math.min(1.8, 1e-6 * Math.exp(p.lambda * (k - 14) + (p.fma && k > 90 ? 1.2 : 0))));
          }
        }
      },
      draw(ctx, W, H, pal, p, ui) {
        ui.clearBg(ctx, W, H, pal);
        const tk = Math.floor(p.tick), div = hist[hist.length - 1] || 0;
        const ax = 14, aw = Math.floor(W * 0.48) - 18, ah = H - 28;
        ui.box(ctx, ax, 14, aw, ah, 10, pal.panel, div > 0 ? pal.rose : pal.emerald, 1.6);
        ctx.fillStyle = pal.ink; ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText(`3-OS ARENA · TICK ${tk} (CLICK TO RESET)`, ax + 12, 34);
        ui.hit(ax, 14, aw, ah, () => resetOrbit(p), 'Reset Arena');

        const cx = ax + aw / 2, cy = 18 + ah * 0.54, r = Math.min(aw, ah) * 0.31, baseAng = tk * 0.085;
        ctx.strokeStyle = pal.faint; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        [['macOS libSystem', 0, pal.cyan], ['Linux glibc', div * 0.85, pal.amber], ['Win11 UCRT', -div * 1.15, pal.rose]].forEach(([nm, off, col], i) => {
          const a = baseAng + off;
          ctx.fillStyle = col; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r * (1 - 0.12 * Math.sin(a * 2)), cy + Math.sin(a) * r, i === 0 ? 7.5 : 5.5, 0, Math.PI * 2); ctx.fill();
          ctx.font = '9.5px "JetBrains Mono", monospace'; ctx.fillText(nm, ax + 12, H - 48 + i * 13);
        });

        const rx = Math.floor(W * 0.50), rw = W - rx - 14;
        ui.box(ctx, rx, 14, rw, ah, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.cyan; ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText('LYAPUNOV LOG-SEPARATION ln|Δx(t)| (GE-H2 / GE-H7)', rx + 12, 34);
        const ox = rx + 26, oy = H - 36, pw = rw - 44, ph = ah - 76;
        ctx.strokeStyle = pal.faint; ctx.beginPath(); ctx.moveTo(ox, oy - ph); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
        ctx.beginPath(); ctx.strokeStyle = p.mode === 'q32_32' ? pal.emerald : pal.rose; ctx.lineWidth = 2.5;
        for (let i = 0; i < hist.length; i++) {
          const yNorm = hist[i] <= 0 ? 0.02 : Math.min(1, (Math.log10(hist[i]) + 6.2) / 6.5);
          const px = ox + (i / 240) * pw, py = oy - Math.max(0.02, yNorm) * ph;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      },
      telemetry(p) {
        const tk = Math.floor(p.tick), split = p.mode === 'float64_sin' && tk >= 14;
        return [
          { label: 'Simulation Tick', value: `Tick ${tk}`, tone: 'cyan' },
          { label: 'First OS Split (GE-H2)', value: p.mode === 'q32_32' ? 'NONE (Bit-Exact)' : (tk >= 14 ? 'Tick 14 (1-ULP sin)' : 'Pending...'), tone: split ? 'rose' : 'emerald' },
          { label: '3-OS SHA-256 Digest', value: split ? 'MISMATCH (3/3 diverged)' : '0/25,500 diffs (MATCH)', tone: split ? 'rose' : 'emerald' },
          { label: '1-Hr Log Replay (GE-H8)', value: p.mode === 'q32_32' ? '44.6 KB -> 0/6,480 diffs' : 'Desynced', tone: p.mode === 'q32_32' ? 'emerald' : 'amber' }
        ];
      },
      checkGoal(step, p) {
        if (step === 2) return p.mode === 'float64_sin' && p.tick >= 40;
        if (step === 3) return p.mode === 'q32_32' && p.tick >= 60;
        return false;
      }
    };
  });

  /* ─────────────────────────── LAB 09: LUT6 & BENES SWITCH ─────────────────────────── */
  Reg.register('lab-09-lut6-benes', function () {
    const params = { tau: 0.35, compile: true, bits: 21 };
    function lutStats(p) {
      const wakeFrac = p.compile ? Math.min(0.96, Math.max(0.12, 0.2292 + (p.tau - 0.35) * 0.92)) : Math.min(0.98, Math.max(0.45, 0.58 + (p.tau - 0.35) * 0.65));
      const waveJ = p.compile ? (0.0424 + Math.max(0, p.tau - 0.35) * 1.8) : (wakeFrac * 38.4);
      return { wakePct: wakeFrac * 100, lutSolved: (1 - wakeFrac) * 100, waveJ };
    }

    return {
      params,
      controls: [
        { type: 'range', key: 'tau', label: 'Conformal Wake Gate tau', min: 0.10, max: 0.95, step: 0.05, fmt: (v) => v.toFixed(2) },
        { type: 'toggle', key: 'compile', label: 'Downward 81-RAMB36E2 Compile' },
        { type: 'action', label: '⇄ Flip Input Bits (x0..x5)', onClick: (p) => { p.bits = (p.bits + 13) & 63; } }
      ],
      applyPreset(step, p) {
        if (step === 2) { p.tau = 0.90; p.compile = false; }
        if (step === 3) { p.tau = 0.35; p.compile = true; }
      },
      draw(ctx, W, H, pal, p, ui) {
        ui.clearBg(ctx, W, H, pal);
        const st = lutStats(p), perm = [2, 5, 0, 4, 1, 3];
        ui.box(ctx, 14, 14, W * 0.30, H - 28, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.cyan; ctx.font = '600 10.5px "JetBrains Mono", monospace'; ctx.fillText('BENEŠ 6-WIRE SWITCH (CLICK)', 24, 34);
        for (let i = 0; i < 6; i++) {
          const bitOn = (p.bits >> i) & 1, y1 = 56 + i * ((H - 92) / 5), y2 = 56 + perm[i] * ((H - 92) / 5);
          ui.box(ctx, 24, y1 - 11, 38, 22, 6, pal.bg, bitOn ? pal.emerald : pal.faint, 1.5);
          ctx.fillStyle = bitOn ? pal.emerald : pal.muted; ctx.font = '600 10px "JetBrains Mono", monospace'; ctx.fillText(`x${i}=${bitOn}`, 28, y1 + 4);
          ui.hit(24, y1 - 11, 44, 22, () => { p.bits ^= (1 << i); }, `x${i}`);
          ctx.strokeStyle = bitOn ? pal.cyan : pal.faint; ctx.lineWidth = bitOn ? 2 : 1;
          ctx.beginPath(); ctx.moveTo(64, y1); ctx.bezierCurveTo(W * 0.16, y1, W * 0.20, y2, W * 0.29, y2); ctx.stroke();
        }

        const mx = Math.floor(W * 0.33), mw = Math.floor(W * 0.33), cellS = Math.min((mw - 28) / 8, (H - 76) / 8);
        ui.box(ctx, mx, 14, mw, H - 28, 10, pal.panel, p.compile ? pal.emerald : pal.faint);
        ctx.fillStyle = pal.emerald; ctx.font = '600 10.5px "JetBrains Mono", monospace'; ctx.fillText(`LUT6 PAGE [ADDR ${p.bits}] · ZERO-MAC`, mx + 12, 34);
        for (let idx = 0; idx < 64; idx++) {
          const cx = mx + 14 + (idx % 8) * cellS, cy = 48 + Math.floor(idx / 8) * cellS, isAddr = idx === p.bits, bitVal = ((idx * 37 + 11) >> 2) & 1;
          ui.box(ctx, cx + 1, cy + 1, cellS - 3, cellS - 3, 4, isAddr ? pal.emerald : pal.bg, isAddr ? pal.amber : pal.faint, isAddr ? 2 : 1);
          ctx.fillStyle = isAddr ? pal.bg : (bitVal ? pal.cyan : pal.muted); ctx.font = '600 8.5px "JetBrains Mono", monospace';
          ctx.fillText(String(bitVal), cx + cellS * 0.34, cy + cellS * 0.64);
        }

        const rx = Math.floor(W * 0.68), rw = W - rx - 14;
        ui.box(ctx, rx, 14, rw, H - 28, 10, pal.panel, st.wakePct > 50 ? pal.amber : pal.emerald);
        ctx.fillStyle = pal.amber; ctx.font = '600 10.5px "JetBrains Mono", monospace'; ctx.fillText('CONFORMAL GATE & 35B MoE', rx + 12, 34);
        ctx.fillStyle = pal.emerald; ctx.fillText(`Fast LUT6 Resolved: ${st.lutSolved.toFixed(1)}%`, rx + 12, 66);
        ctx.fillStyle = st.wakePct <= 25 ? pal.cyan : pal.rose; ctx.fillText(`35B Wakes: ${st.wakePct.toFixed(2)}%`, rx + 12, 90);
        ctx.fillStyle = pal.muted; ctx.font = '9.5px "JetBrains Mono", monospace';
        ctx.fillText('Metal INT4: 970 MB RAM', rx + 12, 120); ctx.fillText('6.773 J/tok -> Verifier', rx + 12, 138);
        ctx.fillText(p.compile ? '✓ Compiled -> 81-RAMB36E2' : '✗ No Downward Compile', rx + 12, 162);
      },
      telemetry(p) {
        const st = lutStats(p);
        return [
          { label: 'Zero-MAC LUT6 Resolved', value: `${st.lutSolved.toFixed(2)}%`, tone: st.lutSolved >= 75 ? 'emerald' : 'amber' },
          { label: '35B Sparse-MoE Wakes', value: `${st.wakePct.toFixed(2)}%`, tone: st.wakePct <= 25 ? 'emerald' : 'rose' },
          { label: 'Wave-3 Replay Energy', value: `${st.waveJ.toFixed(4)} J`, tone: p.compile ? 'emerald' : 'amber' },
          { label: 'Broken Commits', value: '0.00% (42/48 verified)', tone: 'emerald' }
        ];
      },
      checkGoal(step, p) {
        const st = lutStats(p);
        if (step === 2) return !p.compile && st.wakePct >= 80;
        if (step === 3) return p.compile && st.wakePct <= 25;
        return false;
      }
    };
  });

  /* ─────────────────────────── LAB 10: TIME AS AN INDEX (HELLMAN & SALT) ─────────────────────────── */
  Reg.register('lab-10-time-index', function () {
    const params = { logM: 12, salt: 'unsalted', probeStep: 1 };

    return {
      params,
      controls: [
        { type: 'range', key: 'logM', label: 'Table Memory log2(M)', min: 6, max: 14, step: 1, fmt: (v) => `2^${v} rows` },
        { type: 'select', key: 'salt', label: 'Horizon Salt (Horizon.lean)', options: [['unsalted', '0-bit Unsalted (Static H)'], ['salt128', '128-bit Fresh Salt H_s(x)']] },
        { type: 'action', label: '⚡ Launch Rainbow Lookup', onClick: (p) => { p.probeStep = 1; } }
      ],
      onParamChange() { params.probeStep = 1; },
      applyPreset(step, p) {
        if (step === 2) { p.logM = 12; p.salt = 'unsalted'; p.probeStep = 1; }
        if (step === 3) { p.logM = 12; p.salt = 'salt128'; p.probeStep = 1; }
      },
      step(dt, _t, p) { if (p.probeStep > 0 && p.probeStep < 10) p.probeStep = Math.min(10, p.probeStep + dt * 6.5); },
      draw(ctx, W, H, pal, p, ui) {
        ui.clearBg(ctx, W, H, pal);
        const salted = p.salt === 'salt128', logT = Math.max(2, 32 - 2 * p.logM);
        const lx = 14, lw = Math.floor(W * 0.54) - 18;
        ui.box(ctx, lx, 14, lw, H - 28, 10, pal.panel, salted ? pal.emerald : pal.amber, 1.6);
        ctx.fillStyle = pal.cyan; ctx.font = '600 10.5px "JetBrains Mono", monospace';
        ctx.fillText('PRECOMPUTED RAINBOW CHAINS (PAID YESTERDAY: O(N))', lx + 12, 34);
        for (let r = 0; r < 7; r++) {
          const ry = 60 + r * ((H - 96) / 6);
          for (let c = 0; c < 6; c++) {
            const cx = lx + 20 + c * ((lw - 56) / 5), hitNode = !salted && p.probeStep >= c + 1 && r === 3;
            ctx.fillStyle = hitNode ? pal.rose : (salted ? pal.faint : pal.cyan);
            ctx.beginPath(); ctx.arc(cx, ry, hitNode ? 5.5 : 3.8, 0, Math.PI * 2); ctx.fill();
            if (c < 5) { ctx.strokeStyle = hitNode ? pal.rose : pal.faint; ctx.beginPath(); ctx.moveTo(cx + 5, ry); ctx.lineTo(cx + ((lw - 56) / 5) - 5, ry); ctx.stroke(); }
          }
        }
        if (salted && p.probeStep > 0) ui.badge(ctx, lx + 24, H - 44, '✓ 128-BIT SALT HORIZON: 0.0% TABLE OVERLAP', pal.emerald, pal);
        else if (!salted && p.probeStep >= 5) ui.badge(ctx, lx + 24, H - 44, '⚠ UNSALTED CHAIN INTERCEPTED -> INVERTED!', pal.rose, pal);

        const rx = Math.floor(W * 0.55), rw = W - rx - 14;
        ui.box(ctx, rx, 14, rw, H - 28, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.amber; ctx.font = '600 10.5px "JetBrains Mono", monospace'; ctx.fillText('HELLMAN TRADEOFF T * M^2 = N^2', rx + 12, 34);
        const ox = rx + 24, oy = H - 40, pw = rw - 44, ph = H - 98;
        ctx.strokeStyle = pal.faint; ctx.beginPath(); ctx.moveTo(ox, oy - ph); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
        ctx.beginPath(); ctx.strokeStyle = pal.amber; ctx.lineWidth = 2.4;
        for (let mExp = 6; mExp <= 14; mExp += 0.25) {
          const px = ox + ((mExp - 6) / 8) * pw, py = oy - (Math.max(2, 32 - 2 * mExp) / 20) * ph;
          if (mExp === 6) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.fillStyle = salted ? pal.emerald : pal.rose;
        ctx.beginPath(); ctx.arc(ox + ((p.logM - 6) / 8) * pw, oy - (logT / 20) * ph, 6, 0, Math.PI * 2); ctx.fill();
      },
      telemetry(p) {
        const salted = p.salt === 'salt128', logT = Math.max(2, 32 - 2 * p.logM);
        return [
          { label: 'Offline Precomputation', value: '65,536 hashes (O(N) paid)', tone: 'amber' },
          { label: 'Online Steps T (Unsalted)', value: salted ? '2^16 (Full Brute Force)' : `2^${logT} steps`, tone: salted ? 'emerald' : 'rose' },
          { label: 'Pre-Table Hit Rate', value: salted ? '0.00% (< 2^-128)' : '99.2% (Unsalted)', tone: salted ? 'emerald' : 'rose' },
          { label: 'Kernel Proof Status', value: '31 Lean 4 thms (0 sorry)', tone: 'emerald' }
        ];
      },
      checkGoal(step, p) {
        if (step === 2) return p.salt === 'unsalted' && p.logM >= 11 && p.probeStep >= 5;
        if (step === 3) return p.salt === 'salt128' && p.probeStep >= 2;
        return false;
      }
    };
  });
})();
