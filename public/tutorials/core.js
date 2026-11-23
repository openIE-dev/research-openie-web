/* OpenIE Interactive Tutorials Hub — Core Engine, 4-Step Pedagogy & WebMCP API */
(function () {
  const STORAGE_KEY = 'oe-tutorials-v1', registry = new Map();
  let catalog = [], activeTrack = 'all', activeId = 'lab-01-quorum-sepj', activeStep = 1;
  let activeInstance = null, paused = false, hitBoxes = [], lastTs = 0, simTime = 0, lastTelemAt = 0;

  function loadProgress() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { mastered: Array.isArray(raw.mastered) ? raw.mastered : [], steps: raw.steps || {}, choices: raw.choices || {} };
    } catch (_) { return { mastered: [], steps: {}, choices: {} }; }
  }
  function saveProgress(p) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (_) {} }
  let progress = loadProgress();

  function markStepDone(labId, stepNum) {
    if (!progress.steps[labId]) progress.steps[labId] = [];
    if (!progress.steps[labId].includes(stepNum)) { progress.steps[labId].push(stepNum); saveProgress(progress); renderStepper(); }
  }
  function markLabMastered(labId) {
    markStepDone(labId, 4);
    if (!progress.mastered.includes(labId)) { progress.mastered.push(labId); saveProgress(progress); renderProgressHeader(); renderRail(); }
  }
  function getPalette() {
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? { isLight: true, bg: '#f8fafc', panel: 'rgba(255,255,255,0.94)', card: 'rgba(241,245,249,0.92)', ink: '#0f172a', muted: '#475569', faint: 'rgba(15,23,42,0.12)', grid: 'rgba(15,23,42,0.045)', amber: '#d97706', cyan: '#0891b2', emerald: '#059669', rose: '#e11d48' }
      : { isLight: false, bg: '#0b1020', panel: 'rgba(15,23,42,0.88)', card: 'rgba(19,28,52,0.86)', ink: '#f1f5f9', muted: '#94a3b8', faint: 'rgba(148,163,184,0.18)', grid: 'rgba(34,211,238,0.05)', amber: '#f59e0b', cyan: '#22d3ee', emerald: '#10b981', rose: '#f43f5e' };
  }

  const drawHelpers = {
    hit(x, y, w, h, fn, label) { hitBoxes.push({ x, y, w, h, fn, label }); },
    clearBg(ctx, W, H, pal) {
      ctx.fillStyle = pal.bg; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = pal.grid; ctx.lineWidth = 1;
      for (let x = 28; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 28; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    },
    box(ctx, x, y, w, h, r, fill, stroke, lw = 1.2) {
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
    },
    arrow(ctx, x1, y1, x2, y2, color, lw = 2, dashed = false) {
      const ang = Math.atan2(y2 - y1, x2 - x1);
      ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
      if (dashed) ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 8 * Math.cos(ang - 0.42), y2 - 8 * Math.sin(ang - 0.42));
      ctx.lineTo(x2 - 8 * Math.cos(ang + 0.42), y2 - 8 * Math.sin(ang + 0.42));
      ctx.closePath(); ctx.fill(); ctx.restore();
    },
    badge(ctx, x, y, text, color, pal) {
      ctx.save(); ctx.font = '600 11px "JetBrains Mono", monospace';
      const w = ctx.measureText(text).width + 14;
      drawHelpers.box(ctx, x, y, w, 20, 6, pal.panel, color, 1);
      ctx.fillStyle = color; ctx.fillText(text, x + 7, y + 14); ctx.restore();
      return w;
    }
  };

  function currentMeta() { return catalog.find((l) => l.id === activeId) || catalog[0]; }
  function renderProgressHeader() {
    const count = progress.mastered.length;
    const countEl = document.getElementById('tut-mastery-count'), fillEl = document.getElementById('tut-mastery-fill');
    if (countEl) countEl.textContent = `${count} / ${catalog.length} Labs Mastered`;
    if (fillEl && catalog.length) fillEl.style.width = `${(count / catalog.length) * 100}%`;
  }

  function renderRail() {
    const listEl = document.getElementById('tut-rail-list');
    if (!listEl) return;
    listEl.innerHTML = catalog.filter((l) => activeTrack === 'all' || l.track === activeTrack).map((l) => {
      const done = progress.mastered.includes(l.id), isAct = l.id === activeId;
      return `<button type="button" class="tut-lab-item ${isAct ? 'active' : ''} ${done ? 'done' : ''}" data-lab-id="${l.id}">
        <span class="tut-lab-num">${done ? '✓' : String(l.number).padStart(2, '0')}</span>
        <span style="flex:1;min-width:0"><span style="display:block;font-weight:600;font-size:0.83rem;line-height:1.3">${l.title}</span>
        <span style="display:block;font-family:var(--font-mono);font-size:0.66rem;color:var(--tut-muted);margin-top:3px">${l.estimated_minutes} min · ${l.study_id}</span></span></button>`;
    }).join('');
    listEl.querySelectorAll('[data-lab-id]').forEach((btn) => btn.addEventListener('click', () => openLab(btn.getAttribute('data-lab-id'), 1)));
  }

  function renderControls() {
    const wrap = document.getElementById('tut-controls');
    if (!wrap || !activeInstance) return;
    wrap.innerHTML = '';
    (activeInstance.controls || []).forEach((c) => {
      const div = document.createElement('div'); div.className = 'tut-ctrl';
      if (c.type === 'range') {
        const val = activeInstance.params[c.key], fmt = c.fmt ? c.fmt(val) : String(val);
        div.innerHTML = `<label><span>${c.label}</span><strong id="val-${c.key}">${fmt}</strong></label><input type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${val}" />`;
        const inp = div.querySelector('input');
        inp.addEventListener('input', () => {
          const nv = Number(inp.value); activeInstance.params[c.key] = nv;
          div.querySelector(`#val-${c.key}`).textContent = c.fmt ? c.fmt(nv) : String(nv);
          if (activeInstance.onParamChange) activeInstance.onParamChange(c.key, nv);
          evaluateGoal();
        });
      } else if (c.type === 'select') {
        const cur = String(activeInstance.params[c.key]);
        div.innerHTML = `<label><span>${c.label}</span></label><select>${c.options.map(([v, t]) => `<option value="${v}" ${String(v) === cur ? 'selected' : ''}>${t}</option>`).join('')}</select>`;
        const sel = div.querySelector('select');
        sel.addEventListener('change', () => {
          const parsed = c.numeric ? Number(sel.value) : sel.value; activeInstance.params[c.key] = parsed;
          if (activeInstance.onParamChange) activeInstance.onParamChange(c.key, parsed);
          evaluateGoal();
        });
      } else if (c.type === 'toggle') {
        const on = Boolean(activeInstance.params[c.key]); div.style.minWidth = 'auto'; div.style.flex = '0 0 auto';
        div.innerHTML = `<button type="button" class="tut-btn ${on ? 'tut-btn-primary' : ''}">${c.label}: ${on ? 'ON' : 'OFF'}</button>`;
        div.querySelector('button').addEventListener('click', () => {
          activeInstance.params[c.key] = !activeInstance.params[c.key];
          if (activeInstance.onParamChange) activeInstance.onParamChange(c.key, activeInstance.params[c.key]);
          renderControls(); evaluateGoal();
        });
      } else if (c.type === 'action') {
        div.style.minWidth = 'auto'; div.style.flex = '0 0 auto';
        div.innerHTML = `<button type="button" class="tut-btn tut-btn-action">${c.label}</button>`;
        div.querySelector('button').addEventListener('click', () => { c.onClick(activeInstance.params); renderControls(); evaluateGoal(); });
      }
      wrap.appendChild(div);
    });
  }

  function renderStepper() {
    const meta = currentMeta(), el = document.getElementById('tut-stepper');
    if (!el || !meta) return;
    const doneSteps = progress.steps[meta.id] || [];
    el.innerHTML = meta.steps.map((s) => `<button type="button" class="tut-step-btn ${s.step === activeStep ? 'active' : ''} ${doneSteps.includes(s.step) ? 'completed' : ''}" data-step="${s.step}"><div style="opacity:0.75;font-size:0.64rem;text-transform:uppercase">Step ${s.step} · ${s.kind}</div><div style="font-weight:600;margin-top:2px">${s.title}</div></button>`).join('');
    el.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => setStep(Number(b.getAttribute('data-step')))));
  }

  function evaluateGoal() {
    if (!activeInstance || (activeStep !== 2 && activeStep !== 3)) return;
    if (activeInstance.checkGoal && activeInstance.checkGoal(activeStep, activeInstance.params)) {
      markStepDone(activeId, activeStep);
      const badge = document.getElementById('tut-goal-status');
      if (badge) { badge.className = 'tone-emerald'; badge.textContent = '✓ Step Objective Verified Live! Ready to advance →'; }
    }
  }

  function renderLessonBox() {
    const meta = currentMeta(), box = document.getElementById('tut-lesson-box');
    if (!meta || !box) return;
    const stepObj = meta.steps[activeStep - 1];
    if (activeStep === 1) {
      const picked = progress.choices[meta.id];
      box.innerHTML = `<div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--tut-cyan);text-transform:uppercase">Step 1 · Quantitative Intuition</div>
        <h3 style="font-size:1.05rem;margin:0.35rem 0 0.5rem">${meta.predict.question}</h3>
        <div>${meta.predict.choices.map((ch, idx) => `<button type="button" class="tut-choice ${picked === idx ? (ch.ok ? 'right' : 'wrong') : ''}" data-choice="${idx}"><strong>${String.fromCharCode(65 + idx)}.</strong> ${ch.label}</button>`).join('')}</div>
        <div id="tut-choice-why" style="margin-top:0.75rem;font-size:0.86rem;line-height:1.55"></div>`;
      if (typeof picked === 'number') {
        const ch = meta.predict.choices[picked];
        document.getElementById('tut-choice-why').innerHTML = `<div style="padding:0.7rem 0.9rem;border-radius:9px;border:1px solid ${ch.ok ? 'var(--tut-emerald)' : 'var(--tut-amber)'}"><strong class="${ch.ok ? 'tone-emerald' : 'tone-amber'}">${ch.ok ? '✓ Spot-on intuition!' : '↺ Inspect why:'}</strong> ${ch.why}<div style="margin-top:0.6rem"><button type="button" class="tut-btn tut-btn-primary" id="tut-next-step">Continue to Step 2: Break It →</button></div></div>`;
        document.getElementById('tut-next-step')?.addEventListener('click', () => setStep(2));
      }
      box.querySelectorAll('[data-choice]').forEach((btn) => btn.addEventListener('click', () => {
        progress.choices[meta.id] = Number(btn.getAttribute('data-choice')); saveProgress(progress); markStepDone(meta.id, 1); renderLessonBox();
      }));
    } else if (activeStep === 2 || activeStep === 3) {
      const done = (progress.steps[meta.id] || []).includes(activeStep);
      box.innerHTML = `<div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:0.5rem;align-items:center"><span style="font-family:var(--font-mono);font-size:0.7rem;text-transform:uppercase" class="${activeStep === 2 ? 'tone-rose' : 'tone-emerald'}">Step ${activeStep} · ${stepObj.title}</span><span id="tut-goal-status" style="font-family:var(--font-mono);font-size:0.74rem" class="${done ? 'tone-emerald' : 'tone-amber'}">${done ? '✓ Objective Verified!' : '⚡ Mission: ' + stepObj.goal}</span></div>
        <p style="margin:0.55rem 0 0.85rem;font-size:0.92rem;line-height:1.6;color:var(--tut-text)">${stepObj.prompt}</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.6rem;align-items:center"><button type="button" class="tut-btn tut-btn-action" id="tut-preset-btn">⚡ Configure Step ${activeStep} Setup</button><button type="button" class="tut-btn tut-btn-primary" id="tut-adv-btn">${activeStep === 2 ? 'Step 3: Engage Verified Mechanism →' : 'Step 4: Verify Receipt & Claim Badge →'}</button></div>`;
      document.getElementById('tut-preset-btn')?.addEventListener('click', () => { if (activeInstance?.applyPreset) activeInstance.applyPreset(activeStep, activeInstance.params); renderControls(); evaluateGoal(); });
      document.getElementById('tut-adv-btn')?.addEventListener('click', () => setStep(activeStep + 1));
      evaluateGoal();
    } else {
      markLabMastered(meta.id);
      const liveRows = (activeInstance?.telemetry ? activeInstance.telemetry(activeInstance.params) : []).map((m) => `<div style="display:flex;justify-content:space-between;padding:0.32rem 0;border-bottom:1px solid var(--tut-border);font-size:0.78rem"><span style="color:var(--tut-muted)">${m.label}</span><strong class="tone-${m.tone}">${m.value}</strong></div>`).join('');
      const paperRows = meta.verified_receipt.metrics.map(([k, v]) => `<div style="display:flex;justify-content:space-between;gap:0.6rem;padding:0.32rem 0;border-bottom:1px solid var(--tut-border);font-size:0.78rem"><span style="color:var(--tut-muted)">${k}</span><strong style="text-align:right;color:var(--tut-emerald)">${v}</strong></div>`).join('');
      const nextLab = catalog[(catalog.findIndex((x) => x.id === meta.id) + 1) % catalog.length];
      box.innerHTML = `<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.5rem"><span class="tone-emerald" style="font-family:var(--font-mono);font-size:0.74rem;font-weight:600">★ LAB ${String(meta.number).padStart(2, '0')} MASTERY BADGE UNLOCKED · ${meta.verified_receipt.suite}</span><span style="font-family:var(--font-mono);font-size:0.72rem;color:var(--tut-muted)">${meta.verified_receipt.headline}</span></div>
        <div class="tut-receipt-grid"><div style="padding:0.75rem;border-radius:10px;border:1px solid var(--tut-border)"><div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--tut-cyan);margin-bottom:0.35rem">LIVE SIMULATION RECEIPT</div>${liveRows}</div><div style="padding:0.75rem;border-radius:10px;border:1px solid rgba(16,185,129,0.35)"><div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--tut-emerald);margin-bottom:0.35rem">OPENIE EMPIRICAL PAPER RECEIPT</div>${paperRows}</div></div>
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.65rem;margin-top:0.9rem"><div style="display:flex;flex-wrap:wrap;gap:0.5rem"><a href="${meta.paper_url}" class="tut-btn" style="text-decoration:none">Read Paper ↗</a><a href="${meta.figures_url}" class="tut-btn" style="text-decoration:none">Living Figures ↗</a><a href="${meta.tv_url}" class="tut-btn" style="text-decoration:none">Research TV Film ↗</a></div><button type="button" class="tut-btn tut-btn-primary" id="tut-next-lab">Next Lab: ${String(nextLab.number).padStart(2, '0')} · ${nextLab.title.split(':')[0]} →</button></div>`;
      document.getElementById('tut-next-lab')?.addEventListener('click', () => openLab(nextLab.id, 1));
    }
  }

  function renderTelemetry() {
    const wrap = document.getElementById('tut-telemetry');
    if (!wrap || !activeInstance?.telemetry) return;
    wrap.innerHTML = activeInstance.telemetry(activeInstance.params).map((m) => `<div class="tut-metric"><div class="tut-metric-label">${m.label}</div><div class="tut-metric-val tone-${m.tone}">${m.value}</div></div>`).join('');
  }
  function syncUrl() {
    if (!window.history?.replaceState) return;
    const u = new URL(window.location.href); u.searchParams.set('lab', activeId); u.searchParams.set('step', String(activeStep));
    window.history.replaceState({}, '', u.pathname + u.search);
  }
  function setStep(stepNum) { activeStep = Math.max(1, Math.min(4, stepNum)); renderStepper(); renderLessonBox(); syncUrl(); }

  function openLab(id, step = 1) {
    const meta = catalog.find((l) => l.id === id) || catalog[0];
    if (!meta) return null;
    activeId = meta.id; activeStep = Math.max(1, Math.min(4, Number(step) || 1));
    const factory = registry.get(activeId);
    activeInstance = factory ? factory(drawHelpers) : null; simTime = 0;
    const setTxt = (eid, v) => { const el = document.getElementById(eid); if (el) el.textContent = v; };
    setTxt('tut-track-tag', `${meta.track_label} · Lab ${String(meta.number).padStart(2, '0')}/10`);
    setTxt('tut-title', meta.title); setTxt('tut-subtitle', meta.subtitle); setTxt('tut-concept', meta.key_concept);
    const fullLink = document.getElementById('tut-embed-open-full'); if (fullLink) fullLink.href = `/tutorials/?lab=${meta.id}`;
    renderRail(); renderControls(); renderStepper(); renderLessonBox(); renderTelemetry(); syncUrl();
    return { id: meta.id, title: meta.title, step: activeStep };
  }

  function frame(ts) {
    const dt = lastTs ? Math.min(0.05, (ts - lastTs) / 1000) : 0.016; lastTs = ts;
    const canvas = document.getElementById('tut-canvas');
    if (canvas && activeInstance) {
      const rect = canvas.parentElement.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = Math.max(300, Math.floor(rect.width)), ch = Math.max(240, Math.floor(rect.height));
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) { canvas.width = cw * dpr; canvas.height = ch * dpr; }
      const ctx = canvas.getContext('2d'); ctx.save(); ctx.scale(dpr, dpr);
      if (!paused && activeInstance.step) { simTime += dt; activeInstance.step(dt, simTime, activeInstance.params); }
      hitBoxes = []; activeInstance.draw(ctx, cw, ch, getPalette(), activeInstance.params, drawHelpers, simTime); ctx.restore();
      if (ts - lastTelemAt > 120) { lastTelemAt = ts; renderTelemetry(); evaluateGoal(); }
    }
    requestAnimationFrame(frame);
  }

  function resetAllProgress() { progress = { mastered: [], steps: {}, choices: {} }; saveProgress(progress); renderProgressHeader(); renderRail(); renderStepper(); renderLessonBox(); }

  function init() {
    const catEl = document.getElementById('oe-tutorials-catalog'); if (!catEl) return;
    catalog = JSON.parse(catEl.textContent).labs || [];
    const params = new URLSearchParams(window.location.search);
    if (params.get('embed') === '1') document.documentElement.classList.add('oe-embed-mode');
    renderProgressHeader();
    document.querySelectorAll('[data-track-filter]').forEach((btn) => btn.addEventListener('click', () => {
      activeTrack = btn.getAttribute('data-track-filter');
      document.querySelectorAll('[data-track-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn))); renderRail();
    }));
    document.getElementById('tut-reset-progress')?.addEventListener('click', resetAllProgress);
    document.getElementById('tut-pause-btn')?.addEventListener('click', (e) => { paused = !paused; e.currentTarget.textContent = paused ? '▶ Resume' : '⏸ Pause'; });
    document.getElementById('tut-copy-embed')?.addEventListener('click', (e) => {
      navigator.clipboard?.writeText(`<iframe src="https://research.openie.dev/tutorials/?embed=1&lab=${activeId}" width="100%" height="680" style="border:0;border-radius:14px" loading="lazy" title="OpenIE Interactive Lab"></iframe>`);
      const btn = e.currentTarget; btn.textContent = '✓ Copied <iframe>'; setTimeout(() => { btn.textContent = '</> Embed Lab'; }, 1800);
    });
    const canvas = document.getElementById('tut-canvas');
    canvas?.addEventListener('click', (e) => {
      const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      for (let i = hitBoxes.length - 1; i >= 0; i--) { const b = hitBoxes[i]; if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) { b.fn(); renderControls(); renderTelemetry(); evaluateGoal(); break; } }
    });
    canvas?.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      canvas.style.cursor = hitBoxes.some((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) ? 'pointer' : 'default';
    });
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key >= '1' && e.key <= '4') setStep(Number(e.key));
      else if (e.key === '[' || e.key === ']') openLab(catalog[(catalog.findIndex((x) => x.id === activeId) + (e.key === ']' ? 1 : catalog.length - 1)) % catalog.length].id, 1);
    });
    openLab(params.get('lab') || catalog[0]?.id, Number(params.get('step')) || 1);
    requestAnimationFrame(frame);
  }

  window.OE_TUTORIALS = { register(id, factory) { registry.set(id, factory); }, _registry: registry, _helpers: drawHelpers, boot: init };
  window.openieTutorials = {
    listLabs: () => catalog.map((l) => ({ id: l.id, number: l.number, track: l.track, title: l.title, study_id: l.study_id, mastered: progress.mastered.includes(l.id) })),
    openLab: (id, step = 1) => openLab(id, step),
    getProgress: () => ({ masteredCount: progress.mastered.length, total: catalog.length, masteredIds: [...progress.mastered], steps: { ...progress.steps } }),
    resetProgress: () => resetAllProgress(),
    setParam: (k, v) => { if (activeInstance) { activeInstance.params[k] = v; if (activeInstance.onParamChange) activeInstance.onParamChange(k, v); renderControls(); evaluateGoal(); } }
  };
})();
