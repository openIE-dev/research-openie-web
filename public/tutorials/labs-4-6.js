/* OpenIE Interactive Tutorials — Labs 4–6 (DES-10 Digital Enzyme, BCI Consent Firewall, RCE World Coding) */
(function () {
  const Reg = window.OE_TUTORIALS;

  /* ─────────────────────────── LAB 04: DIGITAL ENZYMATIC (DES-10) ─────────────────────────── */
  Reg.register('lab-04-digital-enzymatic', function () {
    const CAMPS = [['C1', 'LLM'], ['C2', 'SMT'], ['C3', 'JEPA'], ['C4', 'MCTS'], ['C5', 'ShapeD'], ['C6', 'Evo'], ['C7', 'Causal'], ['C8', 'LUT6'], ['C9', 'Debate'], ['C10', 'Sandbox']];
    const params = { mode: 'des10', arrivals: 1000, crystallize: true };

    function calcDes(p) {
      const M = p.arrivals;
      if (p.mode === 'solo_c1') return { valid: false, lift: '-10.75% (Simpson Trap!)', joules: M * 15.0, cpjMult: 0.0, barrier: 1.0, marginal: '15.00 J' };
      if (p.mode === 'solo_c2' || p.mode === 'solo_c5') return { valid: false, lift: '0.00% (Abstained)', joules: M * 0.002, cpjMult: 0.0, barrier: 0.88, marginal: 'Abstain' };
      if (!p.crystallize) {
        const j = M * 0.01944 + 22 * 15.0;
        return { valid: true, lift: '+5.29% (+295/5,580)', joules: j, cpjMult: (M * 15.0) / j, barrier: 0.34, marginal: '19.44 mJ' };
      }
      const kClasses = Math.min(22, Math.max(1, Math.round(M * 0.022)));
      const novelJ = kClasses * 15.452, tier2J = Math.min(M, kClasses * 3) * 0.0157 + kClasses * 0.045;
      const tier1Hits = Math.max(0, Math.round((M - kClasses * 4) * 0.6315));
      const totJ = Math.min(M * 15.0, novelJ + tier2J + tier1Hits * 0.0006448 + (M >= 500 ? 1.0 : 0));
      return { valid: true, lift: '+5.29% (+295/5,580)', joules: totJ, cpjMult: (M * 15.0) / totJ, barrier: 0.16, marginal: M >= 500 ? '12 pJ (LUT6)' : '1.77 uJ (DNULLMM1)' };
    }

    return {
      params,
      controls: [
        { type: 'select', key: 'mode', label: 'Synthesis Architecture', options: [['solo_c1', 'Solo C1 (Monolithic LLM)'], ['solo_c2', 'Solo C2 (Symbolic / SMT)'], ['solo_c5', 'Solo C5 (Cold Shape D)'], ['des10', 'DES-10 Digital Enzyme']] },
        { type: 'range', key: 'arrivals', label: 'Zipfian Task Arrivals M', min: 50, max: 1000, step: 50, fmt: (v) => `${v} tasks` },
        { type: 'toggle', key: 'crystallize', label: 'Downward Crystallization' }
      ],
      applyPreset(step, p) {
        if (step === 2) { p.mode = 'solo_c1'; p.arrivals = 1000; p.crystallize = false; }
        if (step === 3) { p.mode = 'des10'; p.arrivals = 1000; p.crystallize = true; }
      },
      draw(ctx, W, H, pal, p, ui, t) {
        ui.clearBg(ctx, W, H, pal);
        const st = calcDes(p), lx = 16, ly = 16, lw = Math.floor(W * 0.48) - 20, lh = H - 32;
        ui.box(ctx, lx, ly, lw, lh, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.amber; ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText('CATALYTIC BARRIER ΔE‡ (15.0 J -> 643 uJ -> 12 pJ)', lx + 12, ly + 20);
        const ox = lx + 24, oy = ly + lh - 32, pw = lw - 44, ph = lh - 72;
        ctx.strokeStyle = pal.faint; ctx.beginPath(); ctx.moveTo(ox, oy - ph); ctx.lineTo(ox, oy); ctx.lineTo(ox + pw, oy); ctx.stroke();
        [1.0, st.barrier].forEach((peak, idx) => {
          ctx.beginPath(); ctx.strokeStyle = idx === 0 ? pal.rose : (st.valid ? pal.emerald : pal.amber);
          ctx.lineWidth = idx === 0 ? 1.5 : 2.8; if (idx === 0) ctx.setLineDash([5, 4]); else ctx.setLineDash([]);
          for (let k = 0; k <= 60; k++) {
            const u = k / 60, bell = Math.exp(-Math.pow((u - 0.42) / 0.18, 2)) * peak;
            const well = (idx === 1 && p.mode === 'des10' && p.crystallize) ? -0.18 * Math.max(0, (u - 0.55) / 0.45) : 0;
            const px = ox + u * pw, py = oy - Math.max(0.04, 0.22 + bell * 0.72 + well) * ph;
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke(); ctx.setLineDash([]);
        });
        ctx.fillStyle = pal.muted; ctx.font = '10px "JetBrains Mono", monospace'; ctx.fillText('Logs -> Typed IR -> do(X=1) -> Verified -> LUT6', ox, oy + 18);

        const rx0 = Math.floor(W * 0.50), rw = W - rx0 - 16;
        ui.box(ctx, rx0, ly, rw, lh, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.cyan; ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText('10 AI CAMPS RING (CLICK CAMP TO SOLO / INSPECT)', rx0 + 12, ly + 20);
        const cx = rx0 + rw / 2, cy = ly + lh * 0.54, rad = Math.min(rw * 0.36, lh * 0.34);
        const pts = CAMPS.map(([code, nm], i) => {
          const a = -Math.PI / 2 + (i * Math.PI * 2) / 10;
          return { x: cx + Math.cos(a) * rad, y: cy + Math.sin(a) * rad, code, nm, i };
        });
        if (p.mode === 'des10') {
          const chain = [0, 6, 1, 9, 4, 7];
          for (let s = 0; s < chain.length - 1; s++) {
            if (s >= 3 && !p.crystallize) continue;
            ui.arrow(ctx, pts[chain[s]].x, pts[chain[s]].y, pts[chain[s + 1]].x, pts[chain[s + 1]].y, s >= 3 ? pal.cyan : pal.emerald, 2.1);
          }
          const pulseIdx = Math.floor(t * 2.5) % (p.crystallize ? 5 : 3), frac = (t * 2.5) % 1;
          const pa = pts[chain[pulseIdx]], pb = pts[chain[pulseIdx + 1]];
          ctx.fillStyle = pal.amber; ctx.beginPath(); ctx.arc(pa.x + (pb.x - pa.x) * frac, pa.y + (pb.y - pa.y) * frac, 5, 0, Math.PI * 2); ctx.fill();
        }
        pts.forEach((pt) => {
          const activeInDes = p.mode === 'des10' && [0, 6, 1, 9, 4, 7].includes(pt.i);
          const soloSel = (p.mode === 'solo_c1' && pt.i === 0) || (p.mode === 'solo_c2' && pt.i === 1) || (p.mode === 'solo_c5' && pt.i === 4);
          const col = activeInDes ? pal.emerald : (soloSel ? pal.rose : pal.faint);
          ui.box(ctx, pt.x - 28, pt.y - 14, 56, 28, 7, pal.bg, col, activeInDes || soloSel ? 1.9 : 1);
          ctx.fillStyle = activeInDes ? pal.emerald : (soloSel ? pal.rose : pal.ink);
          ctx.font = '600 9.5px "JetBrains Mono", monospace'; ctx.fillText(`${pt.code} ${pt.nm.slice(0, 4)}`, pt.x - 23, pt.y + 3);
          ui.hit(pt.x - 28, pt.y - 14, 56, 28, () => { p.mode = pt.i === 0 ? 'solo_c1' : (pt.i === 1 ? 'solo_c2' : (pt.i === 4 ? 'solo_c5' : 'des10')); }, pt.code);
        });
      },
      telemetry(p) {
        const st = calcDes(p);
        return [
          { label: 'Causal Lift do(X=1)', value: st.lift, tone: st.valid ? 'emerald' : 'rose' },
          { label: `${p.arrivals}-Task Total Energy`, value: `${st.joules.toFixed(2)} J`, tone: st.joules < 600 && st.valid ? 'emerald' : 'amber' },
          { label: 'Hot-Path Marginal Cost', value: st.marginal, tone: st.valid ? 'cyan' : 'rose' },
          { label: 'Cumulative CpJ Multiplier', value: st.valid ? `${st.cpjMult.toFixed(2)}x vs LLM` : '0.00x (Failed)', tone: st.cpjMult > 35 ? 'emerald' : 'rose' }
        ];
      },
      checkGoal(step, p) {
        const st = calcDes(p);
        if (step === 2) return p.arrivals >= 500 && !st.valid;
        if (step === 3) return p.mode === 'des10' && p.crystallize && p.arrivals >= 500 && st.cpjMult >= 40;
        return false;
      }
    };
  });

  /* ─────────────────────────── LAB 05: BCI CONSENT FIREWALL (CTA-T29) ─────────────────────────── */
  Reg.register('lab-05-bci-consent-firewall', function () {
    const params = { gate: 'ungated', qStim: 11.5, advDrift: false, optIn: true, violations: 0, admitted: 0, blocked: 0 };
    let pktX = 0.84;

    return {
      params,
      controls: [
        { type: 'select', key: 'gate', label: 'Neural Bridge Architecture', options: [['ungated', 'Ungated Broadcast (forcedStep)'], ['cta_t29', 'CTA-T29 Hardware Consent Gate']] },
        { type: 'range', key: 'qStim', label: 'Pulse Charge Density q_stim', min: 5, max: 55, step: 0.5, fmt: (v) => `${v.toFixed(1)} uC/cm2` },
        { type: 'toggle', key: 'advDrift', label: 'Adversarial Volitional Drift (Δg≠0)' },
        { type: 'toggle', key: 'optIn', label: 'Hardware Opt-In Switch' },
        { type: 'action', label: '↺ Reset Ledger', onClick: (p) => { p.violations = 0; p.admitted = 0; p.blocked = 0; pktX = 0.84; } }
      ],
      applyPreset(step, p) {
        if (step === 2) { p.gate = 'ungated'; p.qStim = 44.0; p.advDrift = true; p.optIn = true; pktX = 0.60; }
        if (step === 3) { p.gate = 'cta_t29'; p.qStim = 44.0; p.advDrift = true; p.optIn = true; p.violations = 0; pktX = 0.62; }
      },
      step(dt, _t, p) {
        pktX -= dt * 0.48;
        const unsafe = p.advDrift || p.qStim > 30.0 || !p.optIn;
        if (p.gate === 'cta_t29' && unsafe && pktX <= 0.50) { p.blocked++; pktX = 0.84; return; }
        if (pktX < 0.22) {
          if (unsafe) p.violations++; else p.admitted++;
          pktX = 0.84;
        }
      },
      draw(ctx, W, H, pal, p, ui, t) {
        ui.clearBg(ctx, W, H, pal);
        const unsafe = p.advDrift || p.qStim > 30.0 || !p.optIn, breached = p.gate === 'ungated' && unsafe;
        ui.box(ctx, 16, 18, W * 0.34, H - 36, 10, pal.panel, breached ? pal.rose : pal.emerald, 1.8);
        ctx.fillStyle = pal.ink; ctx.font = '600 11px "JetBrains Mono", monospace'; ctx.fillText('OPERATOR CORTICAL STATE s_1', 28, 38);
        ctx.fillStyle = breached ? pal.rose : pal.emerald;
        ctx.fillText(`Volition g_1: ${breached && p.advDrift ? '(1, 1, 1, 1) BREACHED!' : '(1, 0, 1, 1) INVARIANT'}`, 28, 60);
        ctx.fillStyle = pal.cyan; ctx.fillText('Workspace w_1: (+0.42N, -15 deg)', 28, 80);

        ctx.beginPath(); ctx.strokeStyle = breached ? pal.rose : pal.cyan; ctx.lineWidth = 2;
        const waveY = H * 0.56, waveW = W * 0.34 - 28;
        for (let i = 0; i <= 60; i++) {
          const wx = 28 + (i / 60) * waveW, amp = breached ? 28 : 11;
          const wy = waveY + Math.sin(t * 7 + i * 0.35) * amp + Math.cos(t * 13 + i) * (breached ? 10 : 3);
          if (i === 0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
        }
        ctx.stroke();

        const effQ = (p.gate === 'cta_t29' && unsafe) ? 0.0 : p.qStim;
        ctx.fillStyle = pal.muted; ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`Delivered Charge: ${effQ.toFixed(1)} / 30.0 uC/cm2`, 28, H - 44);
        ui.box(ctx, 28, H - 36, waveW, 10, 5, pal.bg, pal.faint);
        ctx.fillStyle = effQ > 30 ? pal.rose : pal.emerald; ctx.fillRect(28, H - 36, Math.min(1, effQ / 55) * waveW, 10);

        const fx = W * 0.48, fy = H * 0.50, gateOn = p.gate === 'cta_t29';
        ui.box(ctx, fx - 58, fy - 54, 116, 108, 12, pal.panel, gateOn ? pal.emerald : pal.rose, 2.2);
        ctx.fillStyle = gateOn ? pal.emerald : pal.rose; ctx.font = '700 11px "JetBrains Mono", monospace';
        ctx.fillText(gateOn ? 'CTA-T29 GATE' : 'NO FIREWALL', fx - 44, fy - 26);
        ctx.fillStyle = pal.ink; ctx.font = '9.5px "JetBrains Mono", monospace';
        ctx.fillText('Ed25519 + Δg=0', fx - 44, fy - 6); ctx.fillText('|q| <= 30 uC/cm2', fx - 44, fy + 12);
        ctx.fillStyle = pal.cyan; ctx.fillText('[Click to Toggle]', fx - 46, fy + 34);
        ui.hit(fx - 58, fy - 54, 116, 108, () => { p.gate = gateOn ? 'ungated' : 'cta_t29'; if (p.gate === 'cta_t29') p.violations = 0; }, 'Toggle CTA-T29');

        const rx = W * 0.66;
        ui.box(ctx, rx, 36, W - rx - 16, H - 72, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.amber; ctx.font = '600 11px "JetBrains Mono", monospace'; ctx.fillText('SYNTHETIC CO-PROCESSOR', rx + 14, 62);
        ctx.fillStyle = unsafe ? pal.rose : pal.cyan;
        ctx.fillText(p.advDrift ? 'Packet m_2: Δg=(0,+1,0,0)' : 'Packet m_1: Δg=(0,0,0,0)', rx + 14, 88);
        ctx.fillText(`Stimulus q = ${p.qStim.toFixed(1)} uC/cm2`, rx + 14, 108);
        ctx.fillStyle = unsafe ? pal.rose : pal.cyan; ctx.beginPath(); ctx.arc(W * pktX, fy, 8, 0, Math.PI * 2); ctx.fill();
      },
      telemetry(p) {
        const unsafe = p.advDrift || p.qStim > 30.0 || !p.optIn;
        return [
          { label: 'Local Hardware Gate g_1', value: p.gate === 'cta_t29' ? (unsafe ? '0 (CLAMPED)' : '1 (ADMITTED)') : 'BYPASSED', tone: p.gate === 'cta_t29' ? 'emerald' : 'rose' },
          { label: 'Volitional Invariant I_1', value: p.violations === 0 ? 'INTACT (1,0,1,1)' : `VIOLATED (${p.violations}x)`, tone: p.violations === 0 ? 'emerald' : 'rose' },
          { label: 'Blocked Unsafe Pulses', value: `${p.blocked} clamped · ${p.admitted} safe`, tone: 'cyan' },
          { label: 'Lean 4 Axiom Footprint', value: '0 axioms (CTA-T29..T31)', tone: 'emerald' }
        ];
      },
      checkGoal(step, p) {
        if (step === 2) return p.gate === 'ungated' && p.violations >= 1;
        if (step === 3) return p.gate === 'cta_t29' && (p.advDrift || p.qStim > 30) && p.blocked >= 1 && p.violations === 0;
        return false;
      }
    };
  });

  /* ─────────────────────────── LAB 06: RCE WORLD CODING & FORMEBM ─────────────────────────── */
  Reg.register('lab-06-rce-world-coding', function () {
    const EDITS = [
      { id: 'none', label: 'None (Missing Timeout Edge)', ebm: 6.40, total: false },
      { id: 'cand_a', label: 'Cand A: Armed->Active (Unchecked)', ebm: 4.12, total: false },
      { id: 'cand_b', label: 'Cand B: Type Mismatch (E=2.85)', ebm: 2.85, total: false },
      { id: 'formebm_d', label: 'FormEBM Top-1: Armed->FaultSafe (E=0.19)', ebm: 0.19, total: true }
    ];
    const params = { checker: false, edit: 'none', curState: 'Armed', crashed: false, safeTransitions: 0 };

    function fireEvent(ev, p) {
      if (ev === 'Reset') { p.curState = 'Armed'; p.crashed = false; return; }
      if (p.curState === 'Armed' && ev === 'Timeout') {
        if (p.edit === 'formebm_d') { p.crashed = false; p.curState = 'FaultSafe'; p.safeTransitions++; }
        else if (!p.checker) { p.crashed = true; p.curState = 'PANIC!'; }
      }
    }

    return {
      params,
      controls: [
        { type: 'toggle', key: 'checker', label: 'rce check Gate (49.04 mJ)' },
        { type: 'select', key: 'edit', label: 'Candidate Form Repair', options: EDITS.map((e) => [e.id, e.label]) },
        { type: 'action', label: '⚡ Fire Timeout in Armed', onClick: (p) => { p.curState = 'Armed'; fireEvent('Timeout', p); } },
        { type: 'action', label: '↺ Reset State', onClick: (p) => fireEvent('Reset', p) }
      ],
      onParamChange() { if (params.checker && params.edit === 'formebm_d') { params.crashed = false; params.curState = 'FaultSafe'; params.safeTransitions++; } },
      applyPreset(step, p) {
        if (step === 2) { p.checker = false; p.edit = 'none'; p.curState = 'Armed'; fireEvent('Timeout', p); }
        if (step === 3) { p.checker = true; p.edit = 'formebm_d'; p.crashed = false; p.curState = 'Armed'; fireEvent('Timeout', p); }
      },
      draw(ctx, W, H, pal, p, ui) {
        ui.clearBg(ctx, W, H, pal);
        const curEdit = EDITS.find((e) => e.id === p.edit) || EDITS[0], admitted = p.checker && curEdit.total;
        const lx = 14, lw = Math.floor(W * 0.52) - 18;
        ui.box(ctx, lx, 14, lw, H - 28, 10, pal.panel, p.crashed ? pal.rose : (admitted ? pal.emerald : pal.faint), 1.6);
        ctx.fillStyle = pal.ink; ctx.font = '600 11px "JetBrains Mono", monospace';
        ctx.fillText('RCE STATE MACHINE (CLICK ARMED TO FIRE TIMEOUT)', lx + 12, 34);

        const stPos = { Idle: [lx + lw * 0.24, H * 0.34], Armed: [lx + lw * 0.74, H * 0.34], Active: [lx + lw * 0.24, H * 0.72], FaultSafe: [lx + lw * 0.74, H * 0.72] };
        ui.arrow(ctx, stPos.Idle[0] + 38, stPos.Idle[1], stPos.Armed[0] - 42, stPos.Armed[1], pal.cyan, 2);
        ui.arrow(ctx, stPos.Armed[0] - 28, stPos.Armed[1] + 20, stPos.Active[0] + 28, stPos.Active[1] - 20, pal.cyan, 2);
        if (curEdit.total) ui.arrow(ctx, stPos.Armed[0], stPos.Armed[1] + 22, stPos.FaultSafe[0], stPos.FaultSafe[1] - 24, pal.emerald, 2.5);
        else {
          ui.arrow(ctx, stPos.Armed[0], stPos.Armed[1] + 22, stPos.Armed[0] + 18, stPos.Armed[1] + 64, pal.rose, 2, true);
          ctx.fillStyle = pal.rose; ctx.font = '9.5px "JetBrains Mono", monospace'; ctx.fillText('Timeout -> ???', stPos.Armed[0] - 28, stPos.Armed[1] + 78);
        }
        Object.entries(stPos).forEach(([name, [sx, sy]]) => {
          const isCur = p.curState === name || (name === 'Armed' && p.crashed);
          const col = (name === 'Armed' && p.crashed) ? pal.rose : (isCur ? pal.emerald : pal.faint);
          ui.box(ctx, sx - 42, sy - 19, 84, 38, 8, pal.bg, col, isCur ? 2.2 : 1.2);
          ctx.fillStyle = col === pal.faint ? pal.ink : col; ctx.font = '600 10.5px "JetBrains Mono", monospace';
          ctx.fillText(name === 'Armed' && p.crashed ? 'CRASH!' : name, sx - 30, sy + 4);
          if (name === 'Armed') ui.hit(sx - 42, sy - 19, 84, 38, () => { p.curState = 'Armed'; fireEvent('Timeout', p); }, 'Fire Timeout');
        });

        const rx = Math.floor(W * 0.53), rw = W - rx - 14;
        ui.box(ctx, rx, 14, rw, H - 28, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.cyan; ctx.font = '600 11px "JetBrains Mono", monospace'; ctx.fillText('FORMEBM-v2 SCORER (47.09 mJ · CLICK BAR)', rx + 12, 34);
        EDITS.forEach((ed, i) => {
          const by = 52 + i * 44, bw = rw - 28, sel = p.edit === ed.id;
          ui.box(ctx, rx + 14, by, bw, 36, 7, pal.bg, sel ? (ed.total ? pal.emerald : pal.amber) : pal.faint, sel ? 1.8 : 1);
          ctx.fillStyle = ed.total ? pal.emerald : pal.rose; ctx.globalAlpha = 0.25; ctx.fillRect(rx + 18, by + 20, (ed.ebm / 7.0) * (bw - 12), 10); ctx.globalAlpha = 1;
          ctx.fillStyle = pal.ink; ctx.font = '500 9.5px "JetBrains Mono", monospace'; ctx.fillText(`${ed.label.slice(0, 34)} · E=${ed.ebm.toFixed(2)}`, rx + 20, by + 15);
          ui.hit(rx + 14, by, bw, 36, () => { p.edit = ed.id; p.crashed = false; if (p.checker && ed.total) { p.curState = 'FaultSafe'; p.safeTransitions++; } }, ed.id);
        });
        ['Rust', 'C++20', 'Wasm', 'WGSL'].forEach((tg, i) => ui.badge(ctx, rx + 14 + i * 66, H - 56, tg, admitted ? pal.emerald : pal.muted, pal));
      },
      telemetry(p) {
        const curEdit = EDITS.find((e) => e.id === p.edit) || EDITS[0];
        return [
          { label: 'rce check Admission', value: p.checker ? (curEdit.total ? 'ADMITTED (49.04 mJ)' : 'REFUSED (Partial Form)') : (p.crashed ? 'RUNTIME PANIC!' : 'UNCHECKED'), tone: p.checker && curEdit.total ? 'emerald' : 'rose' },
          { label: 'FormEBM-v3 Energy Score', value: `E = ${curEdit.ebm.toFixed(2)} (AUROC 0.9437)`, tone: curEdit.total ? 'emerald' : 'amber' },
          { label: 'Checker / 35B Ratio (H2)', value: '49.04 mJ / 84.25 J (1,718x)', tone: 'cyan' },
          { label: 'Emitted Targets Parity', value: p.checker && curEdit.total ? '4/4 Active (0 diffs)' : 'Blocked until Total', tone: p.checker && curEdit.total ? 'emerald' : 'amber' }
        ];
      },
      checkGoal(step, p) {
        if (step === 2) return !p.checker && p.crashed;
        if (step === 3) return p.checker && p.edit === 'formebm_d' && !p.crashed;
        return false;
      }
    };
  });
})();
