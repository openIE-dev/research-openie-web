/* OpenIE Interactive Tutorials Hub — Lab 14: Goodhart Spec-Fidelity Barrier & Wasm Fuel vs. Physical Joules (@ d036b64) */
(function () {
  const REG = window.OE_TUTORIALS;
  if (!REG) return;

  const KIT8_BLAKE3 = '41514ee6147d636d6bcb27f4ee392e4c9c3ce4ffd2bce2fd88a1afd48e9d1e0a';
  const KIT9_BLAKE3 = '6ee27b1de540199d9dce9c46b452f0b60faf7eb1f403319de01e9e97976fa5c0';
  const REP_SNIPPET = './kits/spec-fidelity-barrier/run_kit.sh && ./kits/standards-bridge/run_kit.sh';

  /* Exact empirical measurements from kits/spec-fidelity-barrier & kits/standards-bridge @ d036b64 */
  const SPEC_ARMS = {
    arm_a: {
      id: 'arm_a',
      short: 'Arm A · Shared-Context Goodhart Spec',
      rule: 'assert len(out) == len(inp)',
      falseAccepts: 199,
      totalMutants: 200,
      pct: '99.50%',
      ci95: '[0.9725, 0.9999]',
      vacuityStatus: '31/40 tautological (SPEC_VACUOUS_REFUSED if audited)',
      killRate: '72.5% audit (0.5% live)',
      defects: [
        { code: 'M1 Zero/Const Stub', escaped: 40, total: 40 },
        { code: 'M2 Boundary Off-by-1', escaped: 40, total: 40 },
        { code: 'M3 Sign / BitOp Flip', escaped: 39, total: 40 },
        { code: 'M4 Branch Drop', escaped: 40, total: 40 },
        { code: 'M5 Invariant Bypass', escaped: 40, total: 40 }
      ]
    },
    arm_b: {
      id: 'arm_b',
      short: 'Arm B · Isolated Partial Spec (Spec ⊥ Impl)',
      rule: 'Spec ⊥ Impl (no AST mutant gate)',
      falseAccepts: 146,
      totalMutants: 200,
      pct: '73.00%',
      ci95: '[0.6628, 0.7902]',
      vacuityStatus: '40/40 partial (SPEC_VACUOUS_REFUSED if audited)',
      killRate: '49.5% mutant kill',
      defects: [
        { code: 'M1 Zero/Const Stub', escaped: 22, total: 40 },
        { code: 'M2 Boundary Off-by-1', escaped: 22, total: 40 },
        { code: 'M3 Sign / BitOp Flip', escaped: 39, total: 40 },
        { code: 'M4 Branch Drop', escaped: 34, total: 40 },
        { code: 'M5 Invariant Bypass', escaped: 29, total: 40 }
      ]
    },
    arm_c: {
      id: 'arm_c',
      short: 'Arm C · Spec ⊥ Impl + 100% AST Mutant Gate',
      rule: 'Spec ⊥ Impl ∧ ¬Vacuous ∧ 100% Mutant Kill',
      falseAccepts: 0,
      totalMutants: 200,
      pct: '0.00%',
      ci95: '[0.0000, 0.0183]',
      vacuityStatus: '40/40 hardened specs admitted (40/40 valid pass)',
      killRate: '100.0% (200/200 killed)',
      defects: [
        { code: 'M1 Zero/Const Stub', escaped: 0, total: 40 },
        { code: 'M2 Boundary Off-by-1', escaped: 0, total: 40 },
        { code: 'M3 Sign / BitOp Flip', escaped: 0, total: 40 },
        { code: 'M4 Branch Drop', escaped: 0, total: 40 },
        { code: 'M5 Invariant Bypass', escaped: 0, total: 40 }
      ]
    }
  };

  const GRAMMAR_MODES = {
    unconstrained: {
      label: 'Post-Hoc Unconstrained Retries',
      wastedTokens: 298175,
      totalTokens: 298865,
      syntaxRejects: '985 / 1,000',
      wallUs: 570.541,
      raplUj: 55337.409
    },
    masked: {
      label: 'Arm D · In-Loop CFG+Type Token Mask',
      wastedTokens: 0,
      totalTokens: 4576,
      syntaxRejects: '0 / 1,000',
      wallUs: 12.912,
      raplUj: 1223.711
    }
  };

  const WASM_KERNELS = {
    l1_alu: {
      id: 'l1_alu',
      label: 'L1 Register ALU (10M iter)',
      fuel: 330000004,
      cliRaplJ: 1.351675,
      cliWallMs: 12.859,
      steadyRaplJ: 0.820636,
      steadyWallMs: 8.239,
      trapped: false
    },
    dram_64m: {
      id: 'dram_64m',
      label: '64 MiB DRAM Thrash (16,384 pages)',
      fuel: 330000004,
      cliRaplJ: 14.002923,
      cliWallMs: 146.578,
      steadyRaplJ: 8.043687,
      steadyWallMs: 84.127,
      trapped: false
    },
    trap_minus1: {
      id: 'trap_minus1',
      label: 'Fuel - 1 Trap Proof (330,000,003)',
      fuel: 330000003,
      cliRaplJ: 1.351,
      cliWallMs: 12.85,
      steadyRaplJ: 0.820,
      steadyWallMs: 8.23,
      trapped: true
    }
  };

  const WIRE_CODECS = {
    cose_cbor: { label: 'RFC 9052 COSE_Sign1', bytes: 144.7, us: 86.189, raplUj: 7938.9, vsJson: '-61.1%' },
    flatbuf: { label: 'Zero-Copy FlatBuffers', bytes: 161.0, us: 83.134, raplUj: 8746.7, vsJson: '-56.7% (<1.0 µs read)' },
    wai1: { label: 'Clean-Room WAI1 (64B+Sig)', bytes: 128.0, us: 76.771, raplUj: 8363.9, vsJson: '-65.6%' },
    json_utf8: { label: 'Signed UTF-8 JSON', bytes: 371.6, us: 86.458, raplUj: 7925.4, vsJson: 'baseline' }
  };

  function computeState(p) {
    const arm = SPEC_ARMS[p.specArm] || SPEC_ARMS.arm_a;
    const gram = p.grammarMask ? GRAMMAR_MODES.masked : GRAMMAR_MODES.unconstrained;
    const wk = WASM_KERNELS[p.wasmKernel] || WASM_KERNELS.l1_alu;
    const wire = WIRE_CODECS[p.wireCodec] || WIRE_CODECS.cose_cbor;
    const cliJouleRatio = WASM_KERNELS.dram_64m.cliRaplJ / WASM_KERNELS.l1_alu.cliRaplJ; // 10.36x
    const steadyJouleRatio = WASM_KERNELS.dram_64m.steadyRaplJ / WASM_KERNELS.l1_alu.steadyRaplJ; // 9.80x
    const gramSpeedup = GRAMMAR_MODES.unconstrained.wallUs / GRAMMAR_MODES.masked.wallUs; // 44.19x
    const gramJouleCut = GRAMMAR_MODES.unconstrained.raplUj / GRAMMAR_MODES.masked.raplUj; // 45.22x
    return {
      arm, gram, wk, wire,
      cliJouleRatio, steadyJouleRatio,
      gramSpeedup, gramJouleCut,
      otelOk: Boolean(p.otelGuard)
    };
  }

  REG.register('lab-14-standards-spec-barrier', function () {
    let copiedFlashUntil = 0;
    const params = {
      specArm: 'arm_b',
      grammarMask: false,
      wasmKernel: 'l1_alu',
      otelGuard: false,
      wireCodec: 'cose_cbor'
    };

    return {
      params,
      controls: [
        {
          key: 'specArm', type: 'select', label: 'Commit Gate Specification Arm (Kit #8)',
          options: [
            ['arm_a', 'Arm A · Shared-Context Goodhart Spec (199/200 false)'],
            ['arm_b', 'Arm B · Isolated Spec Only — Spec ⊥ Impl (146/200 false)'],
            ['arm_c', 'Arm C · Spec ⊥ Impl + 100% AST Mutant Kill (0/200 false)']
          ]
        },
        {
          key: 'grammarMask', type: 'toggle', label: 'Arm D · In-Loop Grammar Mask'
        },
        {
          key: 'wasmKernel', type: 'select', label: 'Wasmtime 50.0.1 Kernel @ 330,000,004 Fuel',
          options: [
            ['l1_alu', 'L1 Register ALU (330,000,004 fuel -> 1.35 J)'],
            ['dram_64m', '64 MiB DRAM Thrash (330,000,004 fuel -> 14.00 J)'],
            ['trap_minus1', 'Fuel Budget - 1 (330,000,003 -> Trap!)']
          ]
        },
        {
          key: 'otelGuard', type: 'toggle', label: 'OTel reported_j Guard + COSE_Sign1'
        },
        {
          key: 'wireCodec', type: 'select', label: '10k Signed Receipt Wire Envelope (Kit #9)',
          options: [
            ['cose_cbor', 'IETF RFC 9052 COSE_Sign1 (144.7 B · -61.1%)'],
            ['flatbuf', 'Zero-Copy FlatBuffers (161.0 B · <1.0 µs read)'],
            ['wai1', 'Clean-Room WAI1 (128.0 B · 76.8 µs)'],
            ['json_utf8', 'Signed UTF-8 JSON Baseline (371.6 B)']
          ]
        }
      ],

      applyPreset(step, p) {
        if (step === 2) {
          p.specArm = 'arm_a';
          p.grammarMask = false;
          p.wasmKernel = 'dram_64m';
          p.otelGuard = false;
        } else if (step === 3) {
          p.specArm = 'arm_c';
          p.grammarMask = true;
          p.otelGuard = true;
          if (p.wasmKernel === 'trap_minus1') p.wasmKernel = 'dram_64m';
          p.wireCodec = 'cose_cbor';
        }
      },

      step() {},

      draw(ctx, W, H, pal, p, ui, simTime) {
        ui.clearBg(ctx, W, H, pal);
        const st = computeState(p);

        /* Top Provenance & Receipt Header */
        ui.badge(ctx, 12, 9, 'Kits #8 & #9 @ d036b64 · reported_j', pal.cyan, pal);
        const topOk = p.specArm === 'arm_c' && p.grammarMask && p.otelGuard;
        const topCol = topOk ? pal.emerald : (p.specArm === 'arm_a' || !p.otelGuard ? pal.rose : pal.amber);
        const topTxt = topOk
          ? `SEALED · 0/200 False Accepts · OTel + ${st.wire.bytes}B COSE`
          : `UNSEALED · ${st.arm.falseAccepts}/200 Escapes · ${p.otelGuard ? 'OTel Guard ON' : 'Fuel!=Joules Unguarded'}`;
        ctx.save();
        ctx.font = '600 10px "JetBrains Mono", monospace';
        const tw = ctx.measureText(topTxt).width + 14;
        const tx = Math.max(210, W - tw - 12);
        ui.box(ctx, tx, 9, tw, 20, 6, pal.panel, topCol, 1.3);
        ctx.fillStyle = topCol;
        ctx.fillText(topTxt, tx + 7, 23);
        ctx.restore();

        const splitX = Math.floor(W * 0.49);
        const leftW = splitX - 16;
        const rightX = splitX + 6;
        const rightW = W - rightX - 12;
        const cardTop = 36;
        const leftH = H - cardTop - 10;

        /* PANEL 1 (LEFT): Goodhart Spec-Fidelity Barrier (5 AST Mutant Classes + Arm D Mask) */
        const p1Col = p.specArm === 'arm_c' ? pal.emerald : (p.specArm === 'arm_a' ? pal.rose : pal.amber);
        ui.box(ctx, 12, cardTop, leftW, leftH, 10, pal.panel, p1Col, 1.3);
        ui.hit(12, cardTop, leftW, 38, () => {
          p.specArm = p.specArm === 'arm_a' ? 'arm_c' : (p.specArm === 'arm_c' ? 'arm_b' : 'arm_a');
        }, 'Cycle Spec Arm A / B / C');

        ctx.fillStyle = p1Col;
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillText('1. SPEC-FIDELITY BARRIER (200 AST MUTANTS · Click)', 20, cardTop + 16);
        ctx.fillStyle = pal.muted;
        ctx.font = '8.5px "JetBrains Mono", monospace';
        ctx.fillText(`${st.arm.rule} -> ${st.arm.falseAccepts}/200 (${st.arm.pct}) CI ${st.arm.ci95}`, 20, cardTop + 30);

        const defStart = cardTop + 40;
        const defH = Math.min(28, Math.floor((leftH - 118) / 5));
        st.arm.defects.forEach((d, idx) => {
          const ry = defStart + idx * defH;
          const frac = d.escaped / d.total;
          const barCol = d.escaped === 0 ? pal.emerald : (d.escaped >= 35 ? pal.rose : pal.amber);
          ctx.fillStyle = pal.ink;
          ctx.font = '8.5px "JetBrains Mono", monospace';
          ctx.fillText(d.code, 20, ry + 10);

          const valTxt = d.escaped === 0 ? '0/40 KILLED' : `${d.escaped}/40 ESCAPED`;
          ctx.fillStyle = barCol;
          ctx.font = '600 8.5px "JetBrains Mono", monospace';
          const vw = ctx.measureText(valTxt).width;
          ctx.fillText(valTxt, 12 + leftW - 10 - vw, ry + 10);

          const bx = 20, bw = leftW - 20, by = ry + 14, bh = 7;
          ui.box(ctx, bx, by, bw, bh, 3, pal.bg, pal.faint, 0.8);
          if (frac > 0) {
            ctx.fillStyle = barCol;
            ctx.fillRect(bx + 1, by + 1, Math.max(3, (bw - 2) * frac), bh - 2);
          } else {
            ctx.fillStyle = pal.emerald;
            ctx.globalAlpha = 0.35;
            ctx.fillRect(bx + 1, by + 1, bw - 2, bh - 2);
            ctx.globalAlpha = 1;
          }
        });

        /* Arm D Grammar Mask Sub-box inside Left Panel */
        const gmY = cardTop + leftH - 72;
        const gmCol = p.grammarMask ? pal.emerald : pal.amber;
        ui.box(ctx, 18, gmY, leftW - 12, 64, 8, pal.card, gmCol, 1.2);
        ui.hit(18, gmY, leftW - 12, 64, () => { p.grammarMask = !p.grammarMask; }, 'Toggle Arm D In-Loop Grammar Mask');

        ctx.fillStyle = gmCol;
        ctx.font = '600 9px "JetBrains Mono", monospace';
        ctx.fillText(
          p.grammarMask
            ? 'ARM D MASK ON: 0 Wasted Tokens (-100.0% · 0/800 False)'
            : 'UNCONSTRAINED POST-HOC: 298,175 Wasted Syntax Tokens!',
          25, gmY + 15
        );
        ctx.fillStyle = pal.ink;
        ctx.font = '8.5px "JetBrains Mono", monospace';
        ctx.fillText(
          `Zen 5 RAPL: ${st.gram.raplUj.toLocaleString('en-US', { maximumFractionDigits: 1 })} µJ/draw · Wall: ${st.gram.wallUs.toFixed(1)} µs`,
          25, gmY + 31
        );
        ctx.fillStyle = pal.muted;
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(
          `45.22× lower RAPL reported_j · 44.19× faster · BLAKE3 ${KIT8_BLAKE3.slice(0, 8)}…`,
          25, gmY + 47
        );

        /* PANEL 2 (TOP RIGHT): Wasmtime 50.0.1 Exact Fuel vs. Physical RAPL Joules */
        const p2H = Math.floor(leftH * 0.48);
        const isDram = p.wasmKernel === 'dram_64m';
        const isTrap = p.wasmKernel === 'trap_minus1';
        const p2Col = isTrap ? pal.cyan : (isDram && !p.otelGuard ? pal.rose : (p.otelGuard ? pal.emerald : pal.amber));
        ui.box(ctx, rightX, cardTop, rightW, p2H, 10, pal.panel, p2Col, 1.3);
        ui.hit(rightX, cardTop, rightW, p2H, () => {
          p.wasmKernel = p.wasmKernel === 'l1_alu' ? 'dram_64m' : 'l1_alu';
        }, 'Toggle L1 ALU vs 64 MiB DRAM Thrash');

        ctx.fillStyle = p2Col;
        ctx.font = '600 9.8px "JetBrains Mono", monospace';
        ctx.fillText('2. WASMTIME 50.0.1 FUEL VS. RAPL JOULES (Click)', rightX + 10, cardTop + 16);

        ctx.fillStyle = pal.muted;
        ctx.font = '8.3px "JetBrains Mono", monospace';
        ctx.fillText(
          isTrap
            ? 'Budget = 330,000,003 (-1 fuel) -> Deterministic OutOfFuel Trap!'
            : 'Identical 330,000,004 fuel (1.000000×) -> 10.36× CLI / 9.80× In-Proc J Gap!',
          rightX + 10, cardTop + 30
        );

        const barsY = cardTop + 40;
        const barW = rightW - 22;
        /* Fuel parity bar vs RAPL bars */
        const rows = [
          {
            lbl: 'L1 ALU (330,000,004 fuel)',
            val: '1.35 J CLI · 0.82 J in-proc',
            frac: 1.351675 / 14.002923,
            col: pal.cyan,
            active: p.wasmKernel === 'l1_alu'
          },
          {
            lbl: '64 MiB DRAM (330,000,004 fuel)',
            val: '14.00 J CLI (10.36×) · 8.04 J (9.80×)',
            frac: 1.0,
            col: isDram && !p.otelGuard ? pal.rose : pal.amber,
            active: p.wasmKernel === 'dram_64m'
          }
        ];
        rows.forEach((r, ri) => {
          const ry = barsY + ri * 34;
          ctx.fillStyle = r.active ? pal.ink : pal.muted;
          ctx.font = `${r.active ? '600 ' : ''}8.4px "JetBrains Mono", monospace`;
          ctx.fillText(r.lbl, rightX + 11, ry + 9);
          ctx.fillStyle = r.col;
          const rw = ctx.measureText(r.val).width;
          ctx.fillText(r.val, rightX + rightW - 11 - rw, ry + 9);
          ui.box(ctx, rightX + 11, ry + 13, barW, 9, 4, pal.bg, r.active ? r.col : pal.faint, r.active ? 1.3 : 0.8);
          ctx.fillStyle = r.col;
          ctx.fillRect(rightX + 12, ry + 14, Math.max(6, (barW - 2) * r.frac), 7);
        });

        /* PANEL 3 (BOTTOM RIGHT): Live COSE_Sign1 / OTLP Receipt & 1-Cmd Replication */
        const p3Y = cardTop + p2H + 8;
        const p3H = H - p3Y - 10;
        const p3Col = p.otelGuard ? pal.emerald : pal.amber;
        ui.box(ctx, rightX, p3Y, rightW, p3H, 10, pal.panel, p3Col, 1.3);
        ui.hit(rightX, p3Y, rightW, Math.max(36, p3H - 28), () => { p.otelGuard = !p.otelGuard; }, 'Toggle OTel reported_j Span Guard');

        ctx.fillStyle = p3Col;
        ctx.font = '600 9.8px "JetBrains Mono", monospace';
        ctx.fillText('3. COSE_SIGN1 / OTLP RECEIPT & CIRCT (Click)', rightX + 10, p3Y + 16);

        const activeJ = isDram ? '14.0029' : '1.3517';
        ctx.fillStyle = pal.ink;
        ctx.font = '8.3px "JetBrains Mono", monospace';
        ctx.fillText(
          p.otelGuard
            ? `OTLP: reported_j=${activeJ}J, measured_j=null (3/3 cross-sum BLOCKED)`
            : 'WARNING: OTel Orthogonality Guard OFF — fuel/class mix unguarded!',
          rightX + 10, p3Y + 32
        );
        ctx.fillStyle = pal.cyan;
        ctx.fillText(
          `Wire (10k, 0 err): ${st.wire.label} = ${st.wire.bytes} B (${st.wire.vsJson})`,
          rightX + 10, p3Y + 47
        );
        ctx.fillStyle = pal.muted;
        ctx.fillText(
          `CIRCT hw+comb -> iverilog 13.0: 0/64 & 0/1,024 diffs · BLAKE3 ${KIT9_BLAKE3.slice(0, 8)}…`,
          rightX + 10, p3Y + 62
        );

        /* Copyable 1-command snippet bar */
        if (p3H >= 88) {
          const cmdY = p3Y + p3H - 24;
          const copied = simTime < copiedFlashUntil;
          ui.box(ctx, rightX + 8, cmdY, rightW - 16, 18, 5, pal.bg, copied ? pal.emerald : pal.faint, 1);
          ui.hit(rightX + 8, cmdY, rightW - 16, 18, () => {
            navigator.clipboard?.writeText(REP_SNIPPET);
            copiedFlashUntil = simTime + 1.8;
          }, 'Copy 1-Command Kit #8 & #9 Replication Snippet');
          ctx.fillStyle = copied ? pal.emerald : pal.amber;
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillText(
            copied ? '✓ Copied: ./kits/spec-fidelity-barrier/run_kit.sh && ./kits/standards-bridge/run_kit.sh' : '$ ./kits/spec-fidelity-barrier/run_kit.sh && ./kits/standards-bridge/run_kit.sh',
            rightX + 13, cmdY + 12
          );
        }
      },

      telemetry(p) {
        const st = computeState(p);
        return [
          {
            label: 'Ast Mutant False Accepts',
            value: `${st.arm.falseAccepts} / 200 (${st.arm.pct})`,
            tone: st.arm.falseAccepts === 0 ? 'emerald' : (st.arm.falseAccepts >= 190 ? 'rose' : 'amber')
          },
          {
            label: 'Grammar Mask RAPL (Arm D)',
            value: p.grammarMask ? '1,223.7 µJ (45.22× cut)' : '55,337.4 µJ (298k waste)',
            tone: p.grammarMask ? 'emerald' : 'amber'
          },
          {
            label: 'Wasmtime 330M Fuel vs RAPL',
            value: st.wk.trapped
              ? 'TRAP @ 330,000,003'
              : (p.wasmKernel === 'dram_64m' ? '14.00 J DRAM (10.36× L1)' : '1.35 J L1 ALU (1.00× fuel)'),
            tone: st.wk.trapped ? 'cyan' : (p.wasmKernel === 'dram_64m' && !p.otelGuard ? 'rose' : 'amber')
          },
          {
            label: 'OTel + Wire Receipt (10k)',
            value: p.otelGuard ? `${st.wire.bytes} B · 3/3 Guard PASS` : `Unguarded (${st.wire.bytes} B)`,
            tone: p.otelGuard ? 'emerald' : 'rose'
          }
        ];
      },

      checkGoal(step, p) {
        if (step === 2) {
          return p.specArm === 'arm_a' && p.wasmKernel === 'dram_64m';
        }
        if (step === 3) {
          return p.specArm === 'arm_c' && Boolean(p.grammarMask) && Boolean(p.otelGuard);
        }
        return false;
      }
    };
  });
})();
