/* OpenIE Interactive Tutorials — Track B Silicon & Nucleus Labs 11–12 (64-Codon LUT6 Wobble FWHT, Aller A7 XC7A200T Thermal Envelope) */
(function () {
  const Reg = window.OE_TUTORIALS;

  /* ─────────────────────────── LAB 11: 64-CODON LUT6 (u64) NUCLEUS & WALSH-HADAMARD WOBBLE FILTER ─────────────────────────── */
  Reg.register('lab-11-lut6-codon-wobble', function () {
    const JITTER_LABELS = ['0 · Exact Seed (0-bit)', '1 · 1-bit LSB Jitter', '2 · 2-bit Wobble Jitter', '3 · OOD Stem Shift'];
    const params = { mode: 'dwn', jitter: 2, target: 28, lo: 0xf0000000 >>> 0, hi: 0, customEdited: false };
    const fwhtBuf = new Int32Array(64), normE = new Int32Array(64);
    let probePhase = 0;

    function pop6(u) {
      return (u & 1) + ((u >> 1) & 1) + ((u >> 2) & 1) + ((u >> 3) & 1) + ((u >> 4) & 1) + ((u >> 5) & 1);
    }
    const DEG_ORDER = Array.from({ length: 64 }, (_, u) => u).sort((a, b) => (pop6(a) - pop6(b)) || (a - b));

    function getBit(p, idx) {
      return idx < 32 ? ((p.lo >>> idx) & 1) : ((p.hi >>> (idx - 32)) & 1);
    }
    function toggleBit(p, idx) {
      if (idx < 32) p.lo = (p.lo ^ (1 << idx)) >>> 0;
      else p.hi = (p.hi ^ (1 << (idx - 32))) >>> 0;
      p.customEdited = true;
    }
    function setSingleBit(p, idx) {
      if (idx < 32) p.lo = (p.lo | (1 << idx)) >>> 0;
      else p.hi = (p.hi | (1 << (idx - 32))) >>> 0;
    }
    function snapMaskForMode(p) {
      p.lo = 0; p.hi = 0; p.customEdited = false;
      const stemBase = p.target & 0x3C;
      if (p.mode === 'onehot') {
        setSingleBit(p, p.target & 63);
      } else if (p.mode === 'dwn') {
        for (let w = 0; w < 4; w++) setSingleBit(p, stemBase + w);
        const secBase = (stemBase + 16) & 0x3C;
        for (let w = 0; w < 4; w++) setSingleBit(p, secBase + w);
      } else {
        for (let w = 0; w < 4; w++) setSingleBit(p, stemBase + w);
      }
    }

    /* Exact 64-point unipolar integer Fast Walsh-Hadamard Transform (0 floats, matches lut6-core/src/lib.rs) */
    function computeIntegerFwht(p) {
      let wt = 0;
      for (let x = 0; x < 64; x++) {
        const b = getBit(p, x);
        fwhtBuf[x] = b;
        wt = (wt + b) | 0;
      }
      for (let step = 1; step < 64; step <<= 1) {
        const jump = step << 1;
        for (let base = 0; base < 64; base += jump) {
          for (let j = 0; j < step; j++) {
            const a = fwhtBuf[base + j], b = fwhtBuf[base + j + step];
            fwhtBuf[base + j] = (a + b) | 0;
            fwhtBuf[base + j + step] = (a - b) | 0;
          }
        }
      }
      let deg5Sq = 0, totSq = 0;
      for (let u = 0; u < 64; u++) {
        const sq = Math.imul(fwhtBuf[u], fwhtBuf[u]);
        totSq = (totSq + sq) | 0;
        if (pop6(u) >= 5) deg5Sq = (deg5Sq + sq) | 0;
        normE[u] = wt > 0 ? (((64 * sq) / wt) | 0) : 0;
      }
      const deg5Energy = wt > 0 ? (((64 * deg5Sq) / wt) | 0) : 0;
      const parsevalTotal = wt > 0 ? (((64 * totSq) / wt) | 0) : 0;
      return { wt, deg5Energy, parsevalTotal };
    }

    function hexU64(p) {
      return '0x' + (p.hi >>> 0).toString(16).padStart(8, '0') + (p.lo >>> 0).toString(16).padStart(8, '0');
    }

    function evalProbeStats(p, spec) {
      const stem = p.target & 0x3C;
      let wobHits = 0;
      for (let w = 0; w < 4; w++) wobHits += getBit(p, (p.target ^ w) & 63);
      const lsb1Hit = getBit(p, p.target ^ 1);
      const exactHit = getBit(p, p.target);
      const gates = p.mode === 'difflut_wobble' ? '16–23 (-64%..-75%)' : '64 (0% pruned)';
      const slots = p.mode === 'difflut_wobble' ? '690–992 slots' : '248 slots';
      let hitText = '95.00% wake supp.', verdict = 'PASSES RUNG-6', corrupt = '0.00%', tone = 'emerald';
      if (p.jitter === 3) {
        hitText = '100.00% OOD Abstain'; verdict = 'CONFORMAL ESCALATE'; tone = 'cyan';
      } else if (spec.deg5Energy > 0 && p.jitter >= 1) {
        const rate = p.jitter === 1 ? (lsb1Hit ? 50.0 : 0.0) : ((wobHits === 4 ? 95.0 : 0.0));
        if (rate < 50) {
          hitText = '0.00% noisy hit'; verdict = 'KILLED (<50% rule)'; corrupt = '39.37% if unsmoothed'; tone = 'rose';
        } else {
          hitText = `${rate.toFixed(2)}% hit`; verdict = 'HIGH-DEG LEAK'; tone = 'amber';
        }
      } else if (spec.wt === 0 || !exactHit) {
        hitText = '0.00% hit (empty)'; verdict = 'NO MATCH'; tone = 'amber';
      } else if (p.mode === 'dwn' && !p.customEdited) {
        hitText = '95.00% hit (64g)'; verdict = 'UNPRUNED DWN'; tone = 'amber';
      } else if (spec.deg5Energy === 0) {
        hitText = '87.00%–95.00% supp.'; verdict = 'WOBBLE CLEAN'; tone = 'emerald';
      }
      return { stem, wobHits, gates, slots, hitText, verdict, corrupt, tone };
    }

    snapMaskForMode(params);

    return {
      params,
      controls: [
        {
          type: 'select', key: 'mode', label: 'Compilation Regime',
          options: [
            ['onehot', '1-Hot Point Match (64 gates)'],
            ['dwn', 'Unpruned DWN (64 gates)'],
            ['difflut_wobble', 'DiffLUT-Net + 2-Bit Wobble (16–23 gates)']
          ]
        },
        {
          type: 'range', key: 'jitter', label: 'Sensor / Paraphrase Jitter',
          min: 0, max: 3, step: 1, fmt: (v) => JITTER_LABELS[v] || String(v)
        },
        {
          type: 'action', label: '⇄ Cycle Codon Stem',
          onClick: (p) => { p.target = (p.target + 9) & 63; snapMaskForMode(p); }
        },
        {
          type: 'action', label: '↺ Snap Mode Mask',
          onClick: (p) => snapMaskForMode(p)
        }
      ],
      onParamChange(k) {
        if (k === 'mode') snapMaskForMode(params);
      },
      applyPreset(step, p) {
        if (step === 2) { p.mode = 'onehot'; p.jitter = 2; p.target = 28; snapMaskForMode(p); }
        if (step === 3) { p.mode = 'difflut_wobble'; p.jitter = 2; p.target = 28; snapMaskForMode(p); }
      },
      step(dt) {
        probePhase = (probePhase + dt * 3.6) % 4;
      },
      draw(ctx, W, H, pal, p, ui) {
        ui.clearBg(ctx, W, H, pal);
        const spec = computeIntegerFwht(p), st = evalProbeStats(p, spec);
        const cyc = Math.floor(probePhase) & 3;
        const probeAddr = p.jitter === 0 ? p.target : (p.jitter === 1 ? (p.target ^ (cyc & 1 || 1)) : (p.jitter === 2 ? ((p.target & 0x3C) | cyc) : ((p.target + 37) & 63)));
        const probeBit = getBit(p, probeAddr);

        /* Left Panel: Interactive 8x8 64-Codon u64 Bitboard */
        const lx = 14, lw = Math.floor(W * 0.45) - 18, lh = H - 28;
        ui.box(ctx, lx, 14, lw, lh, 10, pal.panel, spec.deg5Energy === 0 ? pal.emerald : pal.rose, 1.6);
        ctx.fillStyle = pal.cyan; ctx.font = '600 10.5px "JetBrains Mono", monospace';
        ctx.fillText('8×8 LUT6 u64 BITBOARD (CLICK CELLS)', lx + 12, 33);
        ctx.fillStyle = pal.muted; ctx.font = '9.5px "JetBrains Mono", monospace';
        ctx.fillText(`INIT=${hexU64(p)} · wt=${spec.wt}`, lx + 12, 48);

        const padX = lx + 14, padY = 56, availW = lw - 28, availH = lh - 82;
        const cellS = Math.floor(Math.min((availW - 8) / 8, availH / 8));
        const gridW = cellS * 8 + 6;
        const gx0 = padX + Math.max(0, Math.floor((availW - gridW) / 2));

        for (let idx = 0; idx < 64; idx++) {
          const r = idx >> 3, c = idx & 7;
          const x = gx0 + c * cellS + (c >= 4 ? 6 : 0), y = padY + r * cellS;
          const on = getBit(p, idx) === 1;
          const inTargetStem = (idx & 0x3C) === (p.target & 0x3C);
          const isProbe = idx === probeAddr;
          const fill = on ? (spec.deg5Energy === 0 ? 'rgba(16,185,129,0.28)' : 'rgba(244,63,94,0.28)') : pal.bg;
          const stroke = isProbe ? (p.jitter === 3 ? pal.cyan : (probeBit ? pal.emerald : pal.rose)) : (on ? (spec.deg5Energy === 0 ? pal.emerald : pal.amber) : (inTargetStem ? pal.cyan : pal.faint));
          ui.box(ctx, x + 1, y + 1, cellS - 2, cellS - 2, 4, fill, stroke, isProbe ? 2.3 : (on || inTargetStem ? 1.5 : 1));
          ctx.fillStyle = on ? (spec.deg5Energy === 0 ? pal.emerald : pal.rose) : pal.muted;
          ctx.font = '600 8.5px "JetBrains Mono", monospace';
          ctx.fillText(String(on ? 1 : 0), x + cellS * 0.34, y + cellS * 0.64);
          ui.hit(x, y, cellS, cellS, () => toggleBit(p, idx), `codon-${idx}`);
        }

        const footY = padY + cellS * 8 + 15;
        ctx.fillStyle = p.jitter === 3 ? pal.cyan : (probeBit ? pal.emerald : pal.rose);
        ctx.font = '600 9.5px "JetBrains Mono", monospace';
        ctx.fillText(
          p.jitter === 3
            ? `Probe 0x${probeAddr.toString(16).padStart(2, '0')} [OOD] -> Conformal Abstain (100%)`
            : `Probe 0x${probeAddr.toString(16).padStart(2, '0')} (stem q=${probeAddr >> 2}, w=${probeAddr & 3}) -> ${probeBit ? 'HIT (1)' : 'MISS (0)'}`,
          lx + 12, Math.min(H - 20, footY)
        );

        /* Right Panel: 64-Bar Integer FWHT Spectrum (0 Floats) + Dual-Reality Summary */
        const rx = Math.floor(W * 0.46), rw = W - rx - 14;
        ui.box(ctx, rx, 14, rw, lh, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.amber; ctx.font = '600 10.5px "JetBrains Mono", monospace';
        ctx.fillText('64-BAR INTEGER FWHT SPECTRUM (0 FLOATS · ORDERED BY |S|)', rx + 12, 33);
        ctx.fillStyle = spec.deg5Energy === 0 ? pal.emerald : pal.rose;
        ctx.font = '600 9.5px "JetBrains Mono", monospace';
        ctx.fillText(`Parseval ∑ E_norm = ${spec.parsevalTotal} / 4,096 · |S|>=5 Noise = ${spec.deg5Energy} / 4,096`, rx + 12, 49);

        const sx0 = rx + 16, sy0 = 60, sw = rw - 32, sh = Math.max(105, Math.floor(lh * 0.50));
        const deg5StartIdx = 57; // 64 - 7 modes with |S| >= 5
        const barStep = sw / 64;
        const zoneX = sx0 + deg5StartIdx * barStep;
        ui.box(ctx, zoneX - 2, sy0, sx0 + sw - zoneX + 4, sh, 6, spec.deg5Energy > 0 ? 'rgba(244,63,94,0.12)' : 'rgba(16,185,129,0.08)', spec.deg5Energy > 0 ? pal.rose : pal.emerald, 1.2);
        ctx.fillStyle = spec.deg5Energy > 0 ? pal.rose : pal.emerald;
        ctx.font = '600 8.5px "JetBrains Mono", monospace';
        ctx.fillText('|S|>=5 (7)', Math.max(rx + 18, zoneX - 18), sy0 + 12);

        ctx.strokeStyle = pal.faint; ctx.beginPath(); ctx.moveTo(sx0, sy0 + sh); ctx.lineTo(sx0 + sw, sy0 + sh); ctx.stroke();

        const maxScale = 260;
        for (let k = 0; k < 64; k++) {
          const u = DEG_ORDER[k], deg = pop6(u), eVal = normE[u];
          const bh = eVal > 0 ? Math.max(3, Math.min(sh - 16, (Math.min(eVal, maxScale) / maxScale) * (sh - 18))) : 0;
          const bx = sx0 + k * barStep;
          ctx.fillStyle = deg >= 5 ? pal.rose : (deg === 0 ? pal.cyan : pal.emerald);
          if (bh > 0) ctx.fillRect(bx + 0.5, sy0 + sh - bh, Math.max(1.5, barStep - 1.2), bh);
        }
        ctx.fillStyle = pal.muted; ctx.font = '8.5px "JetBrains Mono", monospace';
        ctx.fillText('DC(|S|=0)', sx0, sy0 + sh + 12);
        ctx.fillText('Structural Stems (1<=|S|<=4)', sx0 + sw * 0.27, sy0 + sh + 12);
        ctx.fillStyle = spec.deg5Energy > 0 ? pal.rose : pal.emerald;
        ctx.fillText(spec.deg5Energy > 0 ? '448 LEAK!' : '0 NOISE!', sx0 + sw - 54, sy0 + sh + 12);

        /* Bottom-right Dual-Reality & Bare-Metal Card */
        const cy = sy0 + sh + 22, ch = H - 14 - cy - 10;
        if (ch >= 54) {
          ui.box(ctx, sx0, cy, sw, ch, 8, pal.bg, st.tone === 'rose' ? pal.rose : (st.tone === 'emerald' ? pal.emerald : pal.cyan), 1.3);
          ctx.font = '600 9.5px "JetBrains Mono", monospace';
          ctx.fillStyle = st.tone === 'rose' ? pal.rose : (st.tone === 'emerald' ? pal.emerald : pal.amber);
          ctx.fillText(`Dual-Reality Verdict: ${st.verdict} · ${st.hitText}`, sx0 + 10, cy + 17);
          ctx.fillStyle = pal.ink; ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(`Active LUT6: ${st.gates} -> RP2040 264KB: ${st.slots}`, sx0 + 10, cy + 34);
          ctx.fillStyle = pal.cyan;
          ctx.fillText(`Thor INA3221: 125.23–176 nJ/op · Alif E3 M55: 12.18 cyc (38.1 ns) · Corruption: ${st.corrupt}`, sx0 + 10, Math.min(cy + ch - 7, cy + 50));
        }
      },
      telemetry(p) {
        const spec = computeIntegerFwht(p), st = evalProbeStats(p, spec);
        return [
          { label: '|S| >= 5 FWHT Parity Noise', value: `${spec.deg5Energy} / 4,096`, tone: spec.deg5Energy === 0 ? 'emerald' : 'rose' },
          { label: 'Active Gates & RP2040 Slots', value: p.mode === 'difflut_wobble' ? '16–23g · 690–992 slots' : '64g · 248 slots', tone: p.mode === 'difflut_wobble' ? 'emerald' : 'amber' },
          { label: 'Noisy Wake Suppression', value: `${st.hitText} (${st.corrupt === '0.00%' ? '0% err' : '39.37% err'})`, tone: st.tone },
          { label: 'Thor Shunt & Alif E3 DWT', value: '125.23–176 nJ · 12.18 cyc', tone: spec.deg5Energy === 0 && p.mode === 'difflut_wobble' ? 'emerald' : 'cyan' }
        ];
      },
      checkGoal(step, p) {
        const spec = computeIntegerFwht(p);
        if (step === 2) return p.mode === 'onehot' && (p.jitter === 1 || p.jitter === 2) && spec.deg5Energy === 448;
        if (step === 3) return p.mode === 'difflut_wobble' && p.jitter >= 1 && p.jitter <= 2 && spec.deg5Energy === 0;
        return false;
      }
    };
  });

  /* ─────────────────────────── LAB 12: ALLER A7 XC7A200T M.2 + TACHYON ELECTRO-THERMAL ENVELOPE ─────────────────────────── */
  Reg.register('lab-12-aller-m2-thermal', function () {
    const params = {
      ddr3: 'active',
      pcie: 'x1',
      ceGating: 'always_on',
      cooling: 'heatsink',
      ambient: 45
    };

    /* Exact AMD DS181 28nm HPL temperature-dependent static power (486.9 mW @ 85 °C) */
    function xc7a200tStaticMw(tjC) {
      const tc = Math.max(-40.0, Math.min(125.0, tjC));
      return 339.0 * Math.exp(0.0215 * (tc - 85.0)) + 147.9 * (1.0 + 0.003 * (tc - 85.0));
    }

    /* Coupled electro-thermal fixed point: T_J = T_A + theta_JA * (P_non_leak + P_static(T_J)) */
    function solveJunctionTemp(tAmb, thetaJa, pNonLeakMw) {
      let tj = tAmb + thetaJa * ((pNonLeakMw + 350.0) * 1e-3);
      for (let i = 0; i < 40; i++) {
        const nxt = tAmb + thetaJa * ((pNonLeakMw + xc7a200tStaticMw(tj)) * 1e-3);
        if (Math.abs(nxt - tj) < 1e-5) { tj = nxt; break; }
        tj = nxt;
      }
      return { tj, pStat: xc7a200tStaticMw(tj) };
    }

    function computeEnvelope(p) {
      const tAmb = Number(p.ambient), fMhz = 250.0;
      if (p.pcie === 'cold_off') {
        return {
          coldOff: true, tj: tAmb, tjLo: tAmb, tjHi: tAmb, margin: 85.0 - tAmb,
          gwMw: 0, mmcmMw: 0, pcieMw: 0, migMw: 0, dramMw: 0, pStatMw: 0, dieMw: 0,
          m2W: 0, m2mA: 0, t5W: 0, t5mA: 0, t5Pct: 0, theta: 23.5, safe: tAmb < 85.0
        };
      }
      const pjNom = p.ceGating === 'ce_gated' ? 245.24 : 711.83;
      const pjLo = p.ceGating === 'ce_gated' ? 178.60 : 518.40;
      const pjHi = p.ceGating === 'ce_gated' ? 322.84 : 936.20;
      const gwMw = pjNom * fMhz * 1e-3;
      const mmcmMw = 55.0 + 0.12 * fMhz; // 85.0 mW @ 250 MHz
      const pcieMw = p.pcie === 'x4' ? 640.0 : 255.0;
      const migMw = p.ddr3 === 'active' ? 680.0 : 0.0;
      const dramMw = p.ddr3 === 'active' ? 330.0 : 5.0;
      const dramCoupledMw = 0.35 * dramMw;
      const theta = p.cooling === 'bare_0lfm' ? 23.5 : (p.cooling === 'heatsink' ? 14.2 : 9.4);

      const pNonLeakNom = gwMw + mmcmMw + pcieMw + migMw + dramCoupledMw;
      const pNonLeakLo = (pjLo * fMhz * 1e-3) + mmcmMw + 0.88 * pcieMw + 0.88 * migMw + dramCoupledMw;
      const pNonLeakHi = (pjHi * fMhz * 1e-3) + mmcmMw + 1.12 * pcieMw + 1.12 * migMw + dramCoupledMw;

      const sol = solveJunctionTemp(tAmb, theta, pNonLeakNom);
      const solLo = solveJunctionTemp(tAmb, theta * 0.92, pNonLeakLo);
      const solHi = solveJunctionTemp(tAmb, theta * 1.08, pNonLeakHi);
      const refStat = solveJunctionTemp(tAmb, 14.2, pNonLeakNom).pStat;

      const dieMw = gwMw + mmcmMw + pcieMw + migMw + refStat;
      const m2Mw = (dieMw + dramMw) / 0.88 + 45.0;
      const m2mA = m2Mw / 3.30;
      const t5Mw = m2Mw / 0.92 + 30.0;
      const t5mA = t5Mw / 5.00;

      return {
        coldOff: false, tj: sol.tj, tjLo: solLo.tj, tjHi: solHi.tj, margin: 85.0 - sol.tj,
        gwMw, mmcmMw, pcieMw, migMw, dramMw, pStatMw: sol.pStat, dieMw,
        m2W: m2Mw * 1e-3, m2mA, t5W: t5Mw * 1e-3, t5mA, t5Pct: (t5mA / 2000.0) * 100.0,
        theta, safe: sol.tj < 85.0
      };
    }

    return {
      params,
      controls: [
        {
          type: 'select', key: 'ddr3', label: 'Onboard DDR3 State',
          options: [
            ['active', 'DDR3 800 MT/s Active (+1,010 mW)'],
            ['reset', 'CMOS Reset (ddr3_cke=0 · 5 mW)']
          ]
        },
        {
          type: 'select', key: 'pcie', label: 'PCIe / Tachyon 5V Link',
          options: [
            ['x4', 'PCIe Gen2 x4 (4 GTP · 640 mW)'],
            ['x1', 'PCIe Gen2 x1 (1 GTP · 255 mW)'],
            ['cold_off', 'Tachyon 5V GPIO Cold-Off (0 W)']
          ]
        },
        {
          type: 'select', key: 'ceGating', label: 'RAMB36E1 CE Gating',
          options: [
            ['always_on', 'Always-On ENARDEN (Ungated)'],
            ['ce_gated', 'CE-Gated 3.51x Cut (ENARDEN)']
          ]
        },
        {
          type: 'select', key: 'cooling', label: 'M.2 Cooling Regime',
          options: [
            ['bare_0lfm', 'Bare 0 LFM Slot (23.5 °C/W)'],
            ['heatsink', 'Passive Heatsink (14.2 °C/W)'],
            ['airflow', '100–200 LFM Airflow (9.4 °C/W)']
          ]
        },
        {
          type: 'range', key: 'ambient', label: 'Slot Ambient T_A',
          min: 25, max: 55, step: 5, fmt: (v) => `${v} °C`
        }
      ],
      applyPreset(step, p) {
        if (step === 2) {
          p.ddr3 = 'active'; p.pcie = 'x4'; p.ceGating = 'ce_gated'; p.cooling = 'bare_0lfm'; p.ambient = 45;
        }
        if (step === 3) {
          p.ddr3 = 'reset'; p.pcie = 'x1'; p.ceGating = 'ce_gated'; p.cooling = 'heatsink'; p.ambient = 45;
        }
      },
      draw(ctx, W, H, pal, p, ui, t) {
        ui.clearBg(ctx, W, H, pal);
        const st = computeEnvelope(p);
        const over85 = st.tj >= 85.0, warn75 = !over85 && st.tj >= 72.0;
        const tjCol = st.coldOff ? pal.cyan : (over85 ? pal.rose : (warn75 ? pal.amber : pal.emerald));

        /* Left Panel: M.2 2280 + Particle Tachyon 5V @ 2A FPC Cutaway */
        const lx = 14, lw = Math.floor(W * 0.54) - 18, lh = H - 28;
        ui.box(ctx, lx, 14, lw, lh, 10, pal.panel, over85 ? pal.rose : (st.coldOff ? pal.cyan : pal.emerald), 1.7);
        ctx.fillStyle = pal.cyan; ctx.font = '600 10.5px "JetBrains Mono", monospace';
        ctx.fillText('NUMATO ALLER A7 M.2 2280 + TACHYON 5V FPC (CLICK BLOCKS)', lx + 12, 33);

        ui.badge(
          ctx, lx + 12, 42,
          st.coldOff
            ? `COLD-OFF SLEEP: T_J = ${st.tj.toFixed(1)} est_C (0.00 W)`
            : (over85
              ? `⚠ THERMAL BREACH: T_J = ${st.tj.toFixed(1)} est_C (> 85 °C LIMIT!)`
              : `✓ SAFE ENVELOPE: T_J = ${st.tj.toFixed(1)} est_C (${st.margin >= 0 ? '+' : ''}${st.margin.toFixed(1)} °C margin)`),
          tjCol, pal
        );

        /* Cooling / Heatsink / Airflow Visual above PCB */
        const pcbX = lx + 86, pcbY = Math.floor(H * 0.45), pcbW = lw - 102, pcbH = Math.min(132, Math.floor(lh * 0.44));
        const dieX = pcbX + 18, dieY = pcbY + 14, dieW = Math.floor(pcbW * 0.54), dieH = pcbH - 28;
        const hsY = pcbY - 34;

        if (p.cooling !== 'bare_0lfm') {
          ui.box(ctx, dieX - 4, hsY, dieW + 8, 28, 5, pal.bg, p.cooling === 'airflow' ? pal.cyan : pal.emerald, 1.4);
          const fins = 9;
          for (let f = 0; f < fins; f++) {
            const fx = dieX + 4 + f * ((dieW - 8) / (fins - 1));
            ctx.strokeStyle = p.cooling === 'airflow' ? pal.cyan : pal.emerald;
            ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(fx, hsY + 3); ctx.lineTo(fx, hsY + 25); ctx.stroke();
          }
          if (p.cooling === 'airflow') {
            ctx.strokeStyle = pal.cyan; ctx.lineWidth = 1.4;
            for (let s = 0; s < 3; s++) {
              const sy = hsY + 6 + s * 8, off = ((t * 90 + s * 28) % (pcbW - 20));
              ctx.beginPath(); ctx.moveTo(pcbX + off, sy); ctx.lineTo(pcbX + Math.min(pcbW - 8, off + 26), sy); ctx.stroke();
            }
          }
        } else if (!st.coldOff) {
          ctx.strokeStyle = over85 ? pal.rose : pal.amber; ctx.lineWidth = 1.5;
          for (let wv = 0; wv < 5; wv++) {
            const wx = dieX + 14 + wv * ((dieW - 28) / 4);
            ctx.beginPath();
            for (let dy = 0; dy <= 24; dy += 4) {
              const px = wx + Math.sin(t * 6 + wv + dy * 0.25) * (over85 ? 5 : 2.5);
              if (dy === 0) ctx.moveTo(px, pcbY - 4 - dy); else ctx.lineTo(px, pcbY - 4 - dy);
            }
            ctx.stroke();
          }
          ctx.fillStyle = over85 ? pal.rose : pal.muted; ctx.font = '8.5px "JetBrains Mono", monospace';
          ctx.fillText('0 LFM Still Air (23.5 °C/W)', dieX + 4, hsY + 14);
        }
        ui.hit(dieX - 6, hsY - 4, dieW + 12, 36, () => {
          p.cooling = p.cooling === 'bare_0lfm' ? 'heatsink' : (p.cooling === 'heatsink' ? 'airflow' : 'bare_0lfm');
        }, 'Toggle Cooling');

        /* Particle Tachyon 5V @ 2A FPC Block on Left */
        const fpcX = lx + 12, fpcY = pcbY + 10, fpcW = 64, fpcH = pcbH - 20;
        ui.box(ctx, fpcX, fpcY, fpcW, fpcH, 7, pal.bg, st.coldOff ? pal.cyan : pal.amber, 1.5);
        ctx.fillStyle = pal.amber; ctx.font = '600 8.5px "JetBrains Mono", monospace';
        ctx.fillText('TACHYON', fpcX + 7, fpcY + 16);
        ctx.fillStyle = pal.ink; ctx.fillText('5V @ 2A', fpcX + 7, fpcY + 30);
        ctx.fillStyle = st.coldOff ? pal.cyan : pal.emerald;
        ctx.fillText(st.coldOff ? 'GPIO OFF' : (p.pcie === 'x4' ? 'Gen2 x4' : 'Gen2 x1'), fpcX + 7, fpcY + 46);
        ctx.fillStyle = pal.muted; ctx.fillText(`${st.t5W.toFixed(2)}W`, fpcX + 7, Math.min(fpcY + fpcH - 8, fpcY + 62));
        ui.hit(fpcX, fpcY, fpcW + 10, fpcH, () => {
          p.pcie = p.pcie === 'x4' ? 'x1' : (p.pcie === 'x1' ? 'cold_off' : 'x4');
        }, 'Cycle PCIe');

        /* M.2 M-Key Edge Fingers & PCIe Lanes */
        const lanes = st.coldOff ? 0 : (p.pcie === 'x4' ? 4 : 1);
        for (let l = 0; l < 4; l++) {
          const ly = fpcY + 16 + l * ((fpcH - 32) / 3);
          const activeLane = l < lanes;
          ctx.strokeStyle = activeLane ? (p.pcie === 'x4' ? pal.amber : pal.emerald) : pal.faint;
          ctx.lineWidth = activeLane ? 2.2 : 1;
          ctx.beginPath(); ctx.moveTo(fpcX + fpcW, ly); ctx.lineTo(pcbX, ly); ctx.stroke();
          if (activeLane) {
            const dotX = fpcX + fpcW + ((t * 48 + l * 7) % (pcbX - fpcX - fpcW));
            ctx.fillStyle = pal.cyan; ctx.beginPath(); ctx.arc(dotX, ly, 2.5, 0, Math.PI * 2); ctx.fill();
          }
        }

        /* M.2 2280 Board Substrate */
        ui.box(ctx, pcbX, pcbY, pcbW, pcbH, 9, pal.bg, pal.faint, 1.5);

        /* XC7A200T-2FBG484C Die + 365 RAMB36E1 Crystal Vault */
        const dieFill = st.coldOff ? pal.bg : (over85 ? 'rgba(244,63,94,0.22)' : (warn75 ? 'rgba(245,158,11,0.16)' : 'rgba(16,185,129,0.14)'));
        ui.box(ctx, dieX, dieY, dieW, dieH, 7, dieFill, tjCol, 2.0);
        ctx.fillStyle = pal.ink; ctx.font = '600 9.5px "JetBrains Mono", monospace';
        ctx.fillText('XC7A200T (250 MHz)', dieX + 8, dieY + 15);
        ctx.fillStyle = p.ceGating === 'ce_gated' ? pal.emerald : pal.amber;
        ctx.font = '8.5px "JetBrains Mono", monospace';
        ctx.fillText(p.ceGating === 'ce_gated' ? '365 BRAM · CE-Gated' : '365 BRAM · Ungated!', dieX + 8, dieY + 29);

        /* Mini 365-Crystal BRAM Matrix inside Die */
        const bCols = 8, bRows = 3, bx0 = dieX + 8, by0 = dieY + 36;
        const bwCell = Math.max(8, Math.floor((dieW - 18) / bCols)), bhCell = Math.max(7, Math.floor((dieH - 46) / bRows));
        for (let r = 0; r < bRows; r++) {
          for (let c = 0; c < bCols; c++) {
            const idx = r * bCols + c;
            const activeLook = !st.coldOff && ((Math.floor(t * 8) + idx * 5) % 11 === 0);
            const ungatedGlow = !st.coldOff && p.ceGating === 'always_on';
            ctx.fillStyle = activeLook ? pal.cyan : (ungatedGlow ? 'rgba(245,158,11,0.45)' : 'rgba(16,185,129,0.28)');
            ctx.fillRect(bx0 + c * bwCell, by0 + r * bhCell, bwCell - 2, bhCell - 2);
          }
        }
        ui.hit(dieX, dieY, dieW, dieH, () => {
          p.ceGating = p.ceGating === 'ce_gated' ? 'always_on' : 'ce_gated';
        }, 'Toggle BRAM CE');

        /* Onboard Micron MT41J128M16 DDR3 Chip */
        const ddrX = dieX + dieW + 10, ddrW = Math.max(54, pcbX + pcbW - ddrX - 10), ddrY = dieY + 6, ddrH = dieH - 12;
        const ddrOn = !st.coldOff && p.ddr3 === 'active';
        ui.box(ctx, ddrX, ddrY, ddrW, ddrH, 6, ddrOn ? 'rgba(244,63,94,0.20)' : pal.panel, ddrOn ? pal.rose : pal.emerald, 1.6);
        ctx.fillStyle = ddrOn ? pal.rose : pal.emerald;
        ctx.font = '600 9px "JetBrains Mono", monospace';
        ctx.fillText('DDR3', ddrX + 7, ddrY + 16);
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = pal.ink;
        ctx.fillText(ddrOn ? '800 MT/s' : 'CKE = 0', ddrX + 7, ddrY + 30);
        ctx.fillStyle = ddrOn ? pal.rose : pal.muted;
        ctx.fillText(ddrOn ? '+1.01 W!' : '5 mW Rst', ddrX + 7, Math.min(ddrY + ddrH - 7, ddrY + 45));
        ui.hit(ddrX, ddrY, ddrW, ddrH, () => {
          p.ddr3 = p.ddr3 === 'active' ? 'reset' : 'active';
        }, 'Toggle DDR3');

        ctx.fillStyle = pal.muted; ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('62,211 LUTs (46.2%) · 83/365 RAMB36E1 · 0 DSPs · 2.53x KV260 BRAM', lx + 12, H - 24);

        /* Right Panel: Rail Power Gauges & Coupled DS181/UG475 Breakdown */
        const rx = Math.floor(W * 0.55), rw = W - rx - 14;
        ui.box(ctx, rx, 14, rw, lh, 10, pal.panel, pal.faint);
        ctx.fillStyle = pal.amber; ctx.font = '600 10.5px "JetBrains Mono", monospace';
        ctx.fillText('DS181 + UG475 RAIL & JUNCTION GAUGES (est_W / est_C)', rx + 12, 33);

        const gx = rx + 14, gw = rw - 28;
        const gauges = [
          {
            title: `XC7A200T Junction T_J (Limit 85.0 °C)`,
            valText: `${st.tj.toFixed(1)} est_C [${st.tjLo.toFixed(1)}, ${st.tjHi.toFixed(1)}]`,
            frac: Math.min(1, st.tj / 110.0), limitFrac: 85.0 / 110.0, col: tjCol
          },
          {
            title: `M.2 3.3V Slot Rail (88% PMIC)`,
            valText: `${st.m2W.toFixed(2)} est_W (${Math.round(st.m2mA)} mA)`,
            frac: Math.min(1, st.m2W / 3.30), limitFrac: null, col: st.m2W <= 1.05 ? pal.emerald : (st.m2W >= 2.2 ? pal.rose : pal.amber)
          },
          {
            title: `Particle Tachyon 5V @ 2A FPC Boost`,
            valText: `${st.t5W.toFixed(2)} est_W (${st.t5Pct.toFixed(1)}% of 2A)`,
            frac: Math.min(1, st.t5W / 3.50), limitFrac: null, col: st.t5Pct <= 12.0 ? pal.emerald : pal.amber
          }
        ];

        gauges.forEach((g, idx) => {
          const y = 52 + idx * 58;
          ctx.fillStyle = pal.muted; ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillText(g.title, gx, y);
          ctx.fillStyle = g.col; ctx.font = '600 9.5px "JetBrains Mono", monospace';
          ctx.fillText(g.valText, gx, y + 14);
          ui.box(ctx, gx, y + 20, gw, 12, 6, pal.bg, pal.faint, 1);
          if (g.frac > 0) {
            ctx.fillStyle = g.col;
            ctx.fillRect(gx + 1, y + 21, Math.max(3, (gw - 2) * g.frac), 10);
          }
          if (g.limitFrac !== null) {
            const lxMark = gx + gw * g.limitFrac;
            ctx.strokeStyle = pal.rose; ctx.lineWidth = 1.8; ctx.setLineDash([3, 2]);
            ctx.beginPath(); ctx.moveTo(lxMark, y + 17); ctx.lineTo(lxMark, y + 36); ctx.stroke(); ctx.setLineDash([]);
          }
        });

        /* Stacked Component Heat Bar at Bottom Right */
        const sy = 232, shBar = 18;
        if (sy + 68 < H - 14) {
          ctx.fillStyle = pal.cyan; ctx.font = '600 9.5px "JetBrains Mono", monospace';
          ctx.fillText('DIE + DRAM HEAT DECOMPOSITION (MAX ~2,400 est_mW)', gx, sy);
          ui.box(ctx, gx, sy + 8, gw, shBar, 5, pal.bg, pal.faint, 1);
          const parts = [
            [st.gwMw, pal.cyan, 'LUT6/BRAM'],
            [st.mmcmMw + st.pcieMw, pal.amber, 'MMCM+GTP'],
            [st.migMw + st.dramMw, pal.rose, 'MIG+DDR3'],
            [st.pStatMw, over85 ? pal.rose : pal.emerald, 'Leak(T_J)']
          ];
          let curX = gx + 1;
          parts.forEach(([mw, col]) => {
            const segW = ((mw / 2450.0) * (gw - 2));
            if (segW > 0.8) { ctx.fillStyle = col; ctx.fillRect(curX, sy + 9, segW, shBar - 2); curX += segW; }
          });
          ctx.font = '8.5px "JetBrains Mono", monospace';
          ctx.fillStyle = pal.muted;
          ctx.fillText(
            `Gateware ${Math.round(st.gwMw)}mW · PCIe/Clk ${Math.round(st.mmcmMw + st.pcieMw)}mW · DDR3 ${Math.round(st.migMw + st.dramMw)}mW · Leak ${Math.round(st.pStatMw)}mW`,
            gx, sy + 40
          );
          ctx.fillStyle = pal.emerald;
          ctx.fillText('board_metered = false (est_mW / est_C) · 10,500/10,500 KV260 Verilator eqv.', gx, sy + 56);
        }
      },
      telemetry(p) {
        const st = computeEnvelope(p);
        return [
          {
            label: 'Junction Temp T_J (DS181)',
            value: `${st.tj.toFixed(1)} est_C (${st.margin >= 0 ? '+' : ''}${st.margin.toFixed(1)} °C vs 85°C)`,
            tone: st.coldOff ? 'cyan' : (st.tj < 65 ? 'emerald' : (st.tj < 85 ? 'amber' : 'rose'))
          },
          {
            label: 'M.2 3.3V Slot Power',
            value: `${st.m2W.toFixed(2)} est_W (${Math.round(st.m2mA)} mA)`,
            tone: st.m2W <= 0.95 ? 'emerald' : (st.m2W >= 2.2 ? 'rose' : 'amber')
          },
          {
            label: 'Tachyon 5V @ 2A FPC',
            value: `${st.t5W.toFixed(2)} est_W (${st.t5Pct.toFixed(1)}% of 2A)`,
            tone: st.t5Pct <= 11.0 ? 'emerald' : 'amber'
          },
          {
            label: 'Zero-Wait BRAM Vault',
            value: st.coldOff ? '0 W Cold-Off (MRAM/Host)' : '365 x 4 KB (2.53x KV260)',
            tone: st.coldOff ? 'cyan' : 'emerald'
          }
        ];
      },
      checkGoal(step, p) {
        const st = computeEnvelope(p);
        if (step === 2) return p.ddr3 === 'active' && p.pcie === 'x4' && p.cooling === 'bare_0lfm' && st.tj >= 85.0 && st.m2W >= 2.50;
        if (step === 3) return p.ddr3 === 'reset' && p.pcie === 'x1' && p.ceGating === 'ce_gated' && p.cooling === 'heatsink' && st.tj <= 56.0 && st.m2W <= 0.90;
        return false;
      }
    };
  });
})();
