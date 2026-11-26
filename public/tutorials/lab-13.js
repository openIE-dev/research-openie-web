/* OpenIE Interactive Tutorials Hub — Lab 13: From Ephemeral Inference to Compiled Agency (Shot #6 @ 813eb96) */
(function () {
  const REG = window.OE_TUTORIALS;
  if (!REG) return;

  const REF_BLAKE3 = 'a541323b13653ed36515ff24ef08deb7dfa771e570a434712708fb72552f46f0';
  const TAMPER_BLAKE3 = '4ac7c4fbc2f2a031ac4f3c0e485867fb689d24d4872bdb1b0a6bc80cf88b69dc';

  /* Exact physical DC shunt measurements from openIE-dev/openie-research-experiments @ 813eb96 */
  const SUBSTRATES = {
    kv260: {
      short: 'KV260 INA260',
      rail: 'AMD Kria KV260 · TI INA260 SOM_5V_DC (measured_j)',
      drift: '0.09–0.11% idle drift · Falsifier 6 PASS',
      netWithheld: false,
      kernels: {
        null_lut: { label: '4 KiB Quadrant LUT', bpw: '0 bpw (4,096 B)', grossUj: 1.49, netUj: 0.11, wallUs: 0.423, acc: '96.33%', ratioVsInt8: '518.35× lower' },
        packed_int: { label: 'Packed Integer (0.1517 bpw)', bpw: '0.1517 bpw (4,972 B)', grossUj: 187.49, netUj: 10.30, wallUs: 54.02, acc: '100.0%', ratioVsInt8: '4.13× lower (5.15× net)' },
        dense_int8: { label: 'Dense INT8 Baseline', bpw: '8.00 bpw (262,144 B)', grossUj: 773.74, netUj: 53.03, wallUs: 220.14, acc: '100.0%', ratioVsInt8: '1.00× baseline' },
        naive_fp32: { label: 'Naive FP32 Unpack', bpw: '0.1517 bpw -> FP32', grossUj: 63335.56, netUj: 3813.32, wallUs: 18184.59, acc: '100.0%', ratioVsInt8: '81.86× gross (71.91× net) TAX' }
      },
      pipelines: {
        always_dense: { label: 'Always-Dense Teacher', grossUj: 18221.99, netUj: 991.71, wallUs: 5262.91 },
        always_mosaic: { label: 'Always-Stage-3 Mosaic', grossUj: 1456.18, netUj: 90.47, wallUs: 417.12 },
        cascade_canonical: { label: '4-Stage Spellcheck Cascade', grossUj: 685.43, netUj: 40.49, wallUs: 196.99 }
      },
      gridD2Tau4500: {
        '0.00': { s1: 0.100, s2: 0.181, s3: 0.589, s4: 0.130, acc: 98.5, grossUj: 3149.98, netUj: 176.45 },
        '0.50': { s1: 0.280, s2: 0.210, s3: 0.405, s4: 0.105, acc: 99.1, grossUj: 2478.40, netUj: 160.92 },
        '0.85': { s1: 0.433, s2: 0.230, s3: 0.251, s4: 0.086, acc: 99.5, grossUj: 1931.43, netUj: 113.99 },
        '1.00': { s1: 0.550, s2: 0.250, s3: 0.174, s4: 0.026, acc: 100.0, grossUj: 685.43, netUj: 40.49 },
        '1.15': { s1: 0.583, s2: 0.213, s3: 0.134, s4: 0.070, acc: 99.7, grossUj: 1498.90, netUj: 82.40 }
      }
    },
    thor: {
      short: 'Thor INA3221',
      rail: 'NVIDIA Jetson AGX Thor · TI INA3221 VDD_CPU_SOC_MSS (measured_j)',
      drift: '5.76–39.78% idle drift · Falsifier 6 FLAG (A1/A2 net withheld)',
      netWithheld: true,
      kernels: {
        null_lut: { label: '4 KiB Quadrant LUT', bpw: '0 bpw (4,096 B)', grossUj: 0.93, netUj: null, wallUs: 0.049, acc: '96.33%', ratioVsInt8: '894.04× lower' },
        packed_int: { label: 'Packed Integer (0.1517 bpw)', bpw: '0.1517 bpw (4,972 B)', grossUj: 104.44, netUj: null, wallUs: 5.85, acc: '100.0%', ratioVsInt8: '7.95× lower' },
        dense_int8: { label: 'Dense INT8 Baseline', bpw: '8.00 bpw (262,144 B)', grossUj: 829.94, netUj: null, wallUs: 43.16, acc: '100.0%', ratioVsInt8: '1.00× baseline' },
        naive_fp32: { label: 'Naive FP32 Unpack', bpw: '0.1517 bpw -> FP32', grossUj: 15839.34, netUj: null, wallUs: 850.61, acc: '100.0%', ratioVsInt8: '19.08× gross TAX' }
      },
      pipelines: {
        always_dense: { label: 'Always-Dense Teacher', grossUj: 8622.51, netUj: null, wallUs: 409.94 },
        always_mosaic: { label: 'Always-Stage-3 Mosaic', grossUj: 1579.24, netUj: null, wallUs: 77.68 },
        cascade_canonical: { label: '4-Stage Spellcheck Cascade', grossUj: 530.39, netUj: null, wallUs: 24.52 }
      },
      gridD2Tau4500: {
        '0.00': { s1: 0.100, s2: 0.181, s3: 0.589, s4: 0.130, acc: 98.5, grossUj: 1760.14, netUj: null },
        '0.50': { s1: 0.280, s2: 0.210, s3: 0.405, s4: 0.105, acc: 99.1, grossUj: 1239.94, netUj: null },
        '0.85': { s1: 0.433, s2: 0.230, s3: 0.251, s4: 0.086, acc: 99.5, grossUj: 1366.64, netUj: null },
        '1.00': { s1: 0.550, s2: 0.250, s3: 0.174, s4: 0.026, acc: 100.0, grossUj: 530.39, netUj: null },
        '1.15': { s1: 0.583, s2: 0.213, s3: 0.134, s4: 0.070, acc: 99.7, grossUj: 749.22, netUj: null }
      }
    }
  };

  function computeState(p) {
    const sub = SUBSTRATES[p.substrate] || SUBSTRATES.kv260;
    const kern = sub.kernels[p.kernel] || sub.kernels.dense_int8;
    const densePipe = sub.pipelines.always_dense;

    let s1 = 0, s2 = 0, s3 = 0, s4 = 1.0, pipeGross = densePipe.grossUj, pipeNet = densePipe.netUj, acc = 100.0;
    if (p.routing === 'always_dense') {
      s1 = 0; s2 = 0; s3 = 0; s4 = 1.0;
      pipeGross = densePipe.grossUj;
      pipeNet = densePipe.netUj;
    } else if (p.routing === 'always_mosaic') {
      s1 = 0; s2 = 0; s3 = 0.942; s4 = 0.058;
      pipeGross = sub.pipelines.always_mosaic.grossUj;
      pipeNet = sub.pipelines.always_mosaic.netUj;
    } else {
      const base = sub.gridD2Tau4500[String(p.zipfS)] || sub.gridD2Tau4500['1.00'];
      const dMax = Number(p.dMax);
      const tau = Number(p.tau);
      if (String(p.zipfS) === '1.00' && dMax === 2 && tau === 4500) {
        s1 = 0.550; s2 = 0.250; s3 = 0.174; s4 = 0.026;
        pipeGross = sub.pipelines.cascade_canonical.grossUj;
        pipeNet = sub.pipelines.cascade_canonical.netUj;
        acc = 100.0;
      } else {
        s1 = base.s1;
        const dScale = dMax === 2 ? 1.0 : (dMax === 1 ? 0.56 : 0.0);
        s2 = +(base.s2 * dScale).toFixed(3);
        const remAfter2 = Math.max(0, 1 - s1 - s2);
        const tauEscFrac = tau <= 1500 ? 0.06 : (tau <= 3000 ? 0.12 : (tau <= 4500 ? 0.24 : 0.42));
        s4 = +(String(p.zipfS) !== '1.00' && dMax === 2 && tau === 4500 ? base.s4 : Math.min(remAfter2, remAfter2 * tauEscFrac)).toFixed(3);
        s3 = Math.max(0, +(1 - s1 - s2 - s4).toFixed(3));
        const stageFactor = (s4 / Math.max(0.01, base.s4));
        pipeGross = +(base.grossUj * (0.45 + 0.55 * stageFactor)).toFixed(2);
        pipeNet = base.netUj !== null ? +(base.netUj * (0.45 + 0.55 * stageFactor)).toFixed(2) : null;
        acc = base.acc;
      }
    }

    const grossCutX = densePipe.grossUj / Math.max(1, pipeGross);
    const netCutX = (densePipe.netUj !== null && pipeNet !== null) ? (densePipe.netUj / Math.max(0.1, pipeNet)) : null;
    const stage4Calls = Math.max(1, Math.round(s4 * 1000));
    const stage4AvoidX = 1000 / stage4Calls;
    const digest = p.tamperRow77 ? TAMPER_BLAKE3 : REF_BLAKE3;

    return {
      sub, kern, densePipe, s1, s2, s3, s4, pipeGross, pipeNet, acc,
      grossCutX, netCutX, stage4Calls, stage4AvoidX, digest,
      halted: Boolean(p.tamperRow77)
    };
  }

  function fmtUj(v) {
    if (v === null || v === undefined) return 'withheld (F6)';
    return v >= 1000
      ? v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' µJ'
      : v.toFixed(2) + ' µJ';
  }

  REG.register('lab-13-compiled-agency', function () {
    const particles = Array.from({ length: 28 }, (_, i) => ({
      phase: (i / 28),
      lane: i % 4
    }));

    const params = {
      substrate: 'kv260',
      kernel: 'dense_int8',
      routing: 'always_mosaic',
      zipfS: '1.00',
      dMax: 2,
      tau: 4500,
      tamperRow77: false
    };

    return {
      params,
      controls: [
        {
          key: 'substrate', type: 'select', label: 'Physical Shunt Substrate (measured_j)',
          options: [
            ['kv260', 'AMD Kria KV260 (TI INA260 SOM 5V DC)'],
            ['thor', 'NVIDIA Jetson AGX Thor (TI INA3221 VDD_CPU)']
          ]
        },
        {
          key: 'kernel', type: 'select', label: '512×512 Weight Kernel Regime',
          options: [
            ['packed_int', 'Packed Integer (FWHT + XNOR + popcount + 4-bit LUT)'],
            ['dense_int8', 'Dense INT8 Baseline (8.00 bpw · 262 KiB)'],
            ['naive_fp32', 'Naive FP32 Unpack (0.1517 bpw -> FP32 Tax)'],
            ['null_lut', '4 KiB Quadrant LUT (96.33% Zero-Model Arm)']
          ]
        },
        {
          key: 'routing', type: 'select', label: '1,000-Query Routing Architecture',
          options: [
            ['cascade_4stage', '4-Stage Spellcheck Lookup-First Cascade'],
            ['always_mosaic', 'Always-Stage-3 waiOS Mosaic + Gate'],
            ['always_dense', 'Always-Dense Teacher Baseline']
          ]
        },
        {
          key: 'zipfS', type: 'select', label: 'Stream Skew (Zipf s)',
          options: [
            ['1.00', 'Canonical Spellcheck Stream (26/1,000 Stage-4)'],
            ['0.85', 'Grid Sweep s = 0.85'],
            ['1.15', 'Grid Sweep s = 1.15'],
            ['0.50', 'Grid Sweep s = 0.50'],
            ['0.00', 'Uniform Stress s = 0.00']
          ]
        },
        {
          key: 'dMax', type: 'select', numeric: true, label: 'Stage-2 Edit Bound d_max',
          options: [
            [2, 'd_max = 2 (Active)'],
            [1, 'd_max = 1 (Narrow)'],
            [0, 'd_max = 0 (Bypassed)']
          ]
        },
        {
          key: 'tau', type: 'select', numeric: true, label: 'Stage-3 Mosaic Margin τ',
          options: [
            [4500, 'τ = 4500 (Canonical)'],
            [3000, 'τ = 3000'],
            [6500, 'τ = 6500']
          ]
        },
        {
          key: 'tamperRow77', type: 'toggle', label: 'Row-77 Tamper (w[77,0]: 0→1)'
        }
      ],

      applyPreset(step, p) {
        if (step === 2) {
          p.substrate = 'kv260';
          p.kernel = 'naive_fp32';
          p.routing = 'always_dense';
          p.tamperRow77 = true;
        } else if (step === 3) {
          p.kernel = 'packed_int';
          p.tamperRow77 = false;
          p.routing = 'cascade_4stage';
          if (!['1.00', '0.85', '1.15'].includes(String(p.zipfS))) p.zipfS = '1.00';
          p.dMax = 2;
          p.tau = 4500;
        }
      },

      step(dt) {
        for (let i = 0; i < particles.length; i++) {
          particles[i].phase = (particles[i].phase + dt * 0.42) % 1;
        }
      },

      draw(ctx, W, H, pal, p, ui, simTime) {
        ui.clearBg(ctx, W, H, pal);
        const st = computeState(p);

        /* Top Banner: Substrate + Falsifier 6 + waiOS Status */
        ui.badge(ctx, 12, 10, `${st.sub.short} · measured_j`, pal.cyan, pal);
        const statusCol = st.halted ? pal.rose : (p.kernel === 'naive_fp32' || p.routing === 'always_dense' ? pal.amber : pal.emerald);
        const statusTxt = st.halted
          ? 'HALT · Receipt Refused (Row-77 Tamper)'
          : `SEALED · BLAKE3 ${REF_BLAKE3.slice(0, 8)}…${REF_BLAKE3.slice(-4)}`;
        ctx.save();
        ctx.font = '600 10.5px "JetBrains Mono", monospace';
        const sw = ctx.measureText(statusTxt).width + 14;
        const sx = Math.max(185, W - sw - 12);
        ui.box(ctx, sx, 10, sw, 20, 6, pal.panel, statusCol, 1.3);
        ctx.fillStyle = statusCol;
        ctx.fillText(statusTxt, sx + 7, 24);
        ui.hit(sx, 10, sw, 20, () => { p.tamperRow77 = !p.tamperRow77; }, 'Toggle Row-77 Tamper');
        ctx.restore();

        const splitX = Math.floor(W * 0.48);
        const leftW = splitX - 18;
        const rightX = splitX + 6;
        const rightW = W - rightX - 12;

        /* LEFT CARD: Sub-Bit Decompression Impedance vs Packed Integer (512×512) */
        const cardTop = 38;
        const leftH = H - cardTop - 12;
        ui.box(ctx, 12, cardTop, leftW, leftH, 10, pal.panel, p.kernel === 'naive_fp32' ? pal.rose : pal.faint, 1.2);
        ctx.fillStyle = pal.cyan;
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillText('1. SUB-BIT IMPEDANCE TAX (512×512 · Click bar)', 22, cardTop + 18);
        ctx.fillStyle = pal.muted;
        ctx.font = '8.5px "JetBrains Mono", monospace';
        ctx.fillText(st.sub.drift, 22, cardTop + 31);

        const order = ['naive_fp32', 'dense_int8', 'packed_int', 'null_lut'];
        const logMin = -0.25, logMax = 4.90;
        const rowStart = cardTop + 44;
        const rowGap = Math.min(54, Math.floor((leftH - 54) / 4));

        order.forEach((kId, idx) => {
          const k = st.sub.kernels[kId];
          const isSel = p.kernel === kId;
          const ry = rowStart + idx * rowGap;
          const barCol = kId === 'naive_fp32' ? pal.rose : (kId === 'packed_int' ? pal.emerald : (kId === 'null_lut' ? pal.cyan : pal.amber));

          ui.box(ctx, 18, ry, leftW - 12, rowGap - 5, 7, isSel ? pal.card : 'transparent', isSel ? barCol : pal.faint, isSel ? 1.5 : 0.8);
          ui.hit(18, ry, leftW - 12, rowGap - 5, () => { p.kernel = kId; }, k.label);

          ctx.fillStyle = isSel ? pal.ink : pal.muted;
          ctx.font = `${isSel ? '600 ' : ''}9.5px "JetBrains Mono", monospace`;
          ctx.fillText(k.label, 24, ry + 13);

          ctx.fillStyle = barCol;
          ctx.font = '600 9px "JetBrains Mono", monospace';
          const rightVal = k.netUj !== null ? `${fmtUj(k.grossUj)} (${fmtUj(k.netUj)} net)` : `${fmtUj(k.grossUj)} gross`;
          const rvw = ctx.measureText(rightVal).width;
          ctx.fillText(rightVal, 18 + leftW - 18 - rvw, ry + 13);

          const bx = 24, bw = leftW - 26, by = ry + 18, bh = 9;
          ui.box(ctx, bx, by, bw, bh, 4, pal.bg, pal.faint, 0.8);
          const frac = Math.max(0.03, Math.min(1, (Math.log10(Math.max(0.6, k.grossUj)) - logMin) / (logMax - logMin)));
          ctx.fillStyle = barCol;
          ctx.fillRect(bx + 1, by + 1, Math.max(4, (bw - 2) * frac), bh - 2);

          ctx.fillStyle = pal.muted;
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillText(`${k.bpw} · ${k.ratioVsInt8}`, 24, ry + 38);
        });

        /* RIGHT TOP CARD: waiOS 256×128 Ternary Lockstep + Row-77 Fault Injection */
        const waiH = Math.min(116, Math.floor(leftH * 0.42));
        const pulse = st.halted ? (0.55 + 0.45 * Math.sin(simTime * 7.5)) : 1;
        ui.box(ctx, rightX, cardTop, rightW, waiH, 10, pal.panel, st.halted ? pal.rose : pal.emerald, st.halted ? 1.7 : 1.2);
        ui.hit(rightX, cardTop, rightW, waiH, () => { p.tamperRow77 = !p.tamperRow77; }, 'Click to toggle Row-77 Tamper');

        ctx.fillStyle = st.halted ? pal.rose : pal.emerald;
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillText('2. waiOS 256×128 LOCKSTEP & TAMPER (Click)', rightX + 10, cardTop + 17);

        const lanes = ['py_i32', 'c_i32', '2b_slice', 'tmac_lut', '4w_mosaic'];
        const laneW = Math.floor((rightW - 28) / lanes.length);
        lanes.forEach((ln, li) => {
          const lx = rightX + 10 + li * (laneW + 2);
          const ly = cardTop + 25;
          ui.box(ctx, lx, ly, laneW, 20, 5, pal.bg, st.halted ? pal.rose : pal.emerald, 1);
          ctx.fillStyle = st.halted ? pal.rose : pal.emerald;
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillText(ln, lx + 4, ly + 13);
        });

        ctx.fillStyle = pal.ink;
        ctx.font = '9px "JetBrains Mono", monospace';
        const mutLabel = st.halted
          ? 'Fault: w[77,0]: 0 → 1 · HALT · Receipt Refused!'
          : 'w[77,0] = 0 intact · 0/400 4-ISA disagrees (UB <= 0.00746)';
        ctx.globalAlpha = st.halted ? pulse : 1;
        ctx.fillStyle = st.halted ? pal.rose : pal.cyan;
        ctx.fillText(mutLabel, rightX + 10, cardTop + 61);
        ctx.globalAlpha = 1;

        ctx.fillStyle = pal.muted;
        ctx.font = '8.3px "JetBrains Mono", monospace';
        ctx.fillText(`BLAKE3: ${st.digest.slice(0, 16)}…${st.digest.slice(-10)}`, rightX + 10, cardTop + 77);
        ctx.fillStyle = st.halted ? pal.rose : pal.emerald;
        ctx.fillText(
          st.halted ? 'receipt_sealed = false · Ed25519 signature withheld' : 'receipt_sealed = true · Ed25519 + BLAKE3 @ 813eb96',
          rightX + 10, cardTop + 93
        );

        /* RIGHT BOTTOM CARD: 4-Stage Spellcheck Lookup-First Cascade Funnel */
        const casY = cardTop + waiH + 8;
        const casH = H - casY - 12;
        const isCascade = p.routing === 'cascade_4stage';
        ui.box(ctx, rightX, casY, rightW, casH, 10, pal.panel, isCascade ? pal.emerald : pal.amber, 1.2);
        ui.hit(rightX, casY, rightW, casH, () => {
          p.routing = p.routing === 'cascade_4stage' ? 'always_dense' : 'cascade_4stage';
        }, 'Toggle 4-Stage Cascade vs Always-Dense');

        ctx.fillStyle = isCascade ? pal.emerald : pal.amber;
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillText('3. 4-STAGE LOOKUP CASCADE (1,000 QUERIES · Click)', rightX + 10, casY + 17);

        const stages = [
          { name: 'S1 Exact LUT', frac: st.s1, col: pal.emerald },
          { name: `S2 Sparse d<=${p.dMax}`, frac: st.s2, col: pal.cyan },
          { name: `S3 Mosaic τ=${p.tau}`, frac: st.s3, col: pal.amber },
          { name: 'S4 Teacher', frac: st.s4, col: pal.rose }
        ];

        /* Stacked routing bar + animated particles */
        const sbX = rightX + 10, sbY = casY + 26, sbW = rightW - 20, sbH = 18;
        ui.box(ctx, sbX, sbY, sbW, sbH, 5, pal.bg, pal.faint, 1);
        let curX = sbX + 1;
        stages.forEach((sg) => {
          const w = (sbW - 2) * sg.frac;
          if (w > 0.8) {
            ctx.fillStyle = sg.col;
            ctx.globalAlpha = st.halted ? 0.35 : 0.85;
            ctx.fillRect(curX, sbY + 1, w, sbH - 2);
            ctx.globalAlpha = 1;
            curX += w;
          }
        });

        if (!st.halted) {
          particles.forEach((pt) => {
            const px = sbX + 3 + pt.phase * (sbW - 6);
            const py = sbY + 4 + (pt.lane * 3);
            ctx.fillStyle = pal.ink;
            ctx.beginPath();
            ctx.arc(px, py, 1.6, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        const legY = sbY + sbH + 14;
        ctx.font = '8.3px "JetBrains Mono", monospace';
        ctx.fillStyle = pal.ink;
        ctx.fillText(
          `S1 ${(st.s1 * 100).toFixed(1)}% · S2 ${(st.s2 * 100).toFixed(1)}% · S3 ${(st.s3 * 100).toFixed(1)}% · S4 ${(st.s4 * 100).toFixed(1)}% (${st.stage4Calls}/1,000)`,
          sbX, legY
        );

        const ratioLine = st.netCutX !== null
          ? `Shunt: ${fmtUj(st.pipeGross)} (${st.grossCutX.toFixed(2)}× gross / ${st.netCutX.toFixed(2)}× net vs Dense)`
          : `Shunt: ${fmtUj(st.pipeGross)} (${st.grossCutX.toFixed(2)}× gross vs Always-Dense)`;
        ctx.fillStyle = isCascade ? pal.emerald : pal.amber;
        ctx.font = '600 8.8px "JetBrains Mono", monospace';
        ctx.fillText(ratioLine, sbX, legY + 16);

        if (legY + 32 < H - 14) {
          ctx.fillStyle = pal.muted;
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillText(
            `Stage-4 Avoidance: ${st.stage4AvoidX.toFixed(2)}× (est_j isolated; measured_j ⊥ reported_j ⊥ est_j)`,
            sbX, legY + 31
          );
        }
      },

      telemetry(p) {
        const st = computeState(p);
        const kStr = st.kern.netUj !== null
          ? `${fmtUj(st.kern.grossUj)} (${fmtUj(st.kern.netUj)} net)`
          : `${fmtUj(st.kern.grossUj)} gross`;
        const cStr = st.netCutX !== null
          ? `${fmtUj(st.pipeGross)} (${st.grossCutX.toFixed(2)}× gross · ${st.netCutX.toFixed(2)}× net)`
          : `${fmtUj(st.pipeGross)} (${st.grossCutX.toFixed(2)}× gross)`;
        return [
          {
            label: `${st.sub.short} Kernel (measured_j)`,
            value: kStr,
            tone: p.kernel === 'naive_fp32' ? 'rose' : (p.kernel === 'packed_int' || p.kernel === 'null_lut' ? 'emerald' : 'amber')
          },
          {
            label: 'waiOS 256×128 BLAKE3 Gate',
            value: st.halted ? `HALT · 4ac7c4fb…69dc` : `SEALED · a541323b…46f0`,
            tone: st.halted ? 'rose' : 'emerald'
          },
          {
            label: 'Cascade Shunt Energy',
            value: st.halted ? 'Refused (Tamper Halt)' : cStr,
            tone: st.halted ? 'rose' : (p.routing === 'cascade_4stage' ? 'emerald' : 'amber')
          },
          {
            label: 'Stage-4 Escalations (est_j sep.)',
            value: `${st.stage4Calls} / 1,000 (${st.stage4AvoidX.toFixed(2)}× avoided)`,
            tone: st.stage4Calls <= 90 ? 'cyan' : 'amber'
          }
        ];
      },

      checkGoal(step, p) {
        if (step === 2) {
          return (p.kernel === 'naive_fp32' && p.routing === 'always_dense') || Boolean(p.tamperRow77);
        }
        if (step === 3) {
          return (
            p.kernel === 'packed_int' &&
            !p.tamperRow77 &&
            p.routing === 'cascade_4stage' &&
            ['1.00', '0.85', '1.15'].includes(String(p.zipfS)) &&
            Number(p.dMax) === 2 &&
            Number(p.tau) === 4500
          );
        }
        return false;
      }
    };
  });
})();
