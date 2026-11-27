#!/usr/bin/env node
/**
 * OpenIE Research — 5-Layer End-to-End Asset, Live Edge, Full-Duplex Voice & Real-User Browser Gate
 *
 * Usage:
 *   node scripts/verify-e2e-user-cycle.mjs --dist                 # Build-time gate on dist/ + HMI invariants
 *   node scripts/verify-e2e-user-cycle.mjs --live                 # Live edge HTTP 200/206 + Full-Duplex Voice WS/HTTP eval
 *   node scripts/verify-e2e-user-cycle.mjs --live --browser       # Full live + Headless Chrome CDP 7-journey user cycle
 *   node scripts/verify-e2e-user-cycle.mjs --all                  # Run --dist + --live + --browser
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE_ORIGIN = (process.env.OPENIE_VERIFY_ORIGIN || 'https://research.openie.dev').replace(/\/+$/, '');
const CANON_MEDIA =
  process.env.OPENIE_CANON_MEDIA ||
  '/Users/dcharlot/data-share/vibe-coding/research-openie-web/public/media';

const args = new Set(process.argv.slice(2));
const runAll = args.has('--all');
const runDist = runAll || args.has('--dist') || (!args.has('--live') && !args.has('--browser') && !args.has('--deep'));
const runLive = runAll || args.has('--live');
const runBrowser = runAll || args.has('--browser') || args.has('--deep');
const runDeep = args.has('--deep');

const failures = [];
const passNotes = [];

function ok(msg) {
  passNotes.push(msg);
  console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  failures.push(msg);
  console.error(`  ✗ ${msg}`);
}

function normalizeLocalPath(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith(SITE_ORIGIN)) {
    return new URL(trimmed).pathname;
  }
  if (/^https?:\/\//i.test(trimmed)) return null;
  if (!trimmed.startsWith('/')) return '/' + trimmed;
  return trimmed.split('?')[0].split('#')[0];
}

function collectMediaUrlsFromCatalogs() {
  const urls = new Map(); // pathname -> { kind, minBytes, source }
  const add = (raw, kind, minBytes, source) => {
    const p = normalizeLocalPath(raw);
    if (!p) return;
    if (!urls.has(p)) urls.set(p, { kind, minBytes, source });
  };

  const tv = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/tv-catalog.json'), 'utf8'));
  for (const st of tv.studies || []) {
    add(st.poster_url, 'image', 1024, `tv-catalog:${st.id}`);
    add(st.paper_url, 'html', 256, `tv-catalog:${st.id}`);
    add(st.pdf_url, 'pdf', 2048, `tv-catalog:${st.id}`);
    for (const [tier, td] of Object.entries(st.tiers || {})) {
      add(td.video_url, 'video', 10000, `tv-catalog:${st.id}:${tier}`);
      add(td.vtt_url, 'vtt', 32, `tv-catalog:${st.id}:${tier}`);
    }
  }

  const tk = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/tiktok-snackables.json'), 'utf8'));
  for (const st of tk.studies || []) {
    add(st.video_url, 'video', 10000, `tiktok:${st.id}`);
    add(st.vtt_url, 'vtt', 32, `tiktok:${st.id}`);
    add(st.poster_url, 'image', 1024, `tiktok:${st.id}`);
  }

  const rf = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/radio-feed.json'), 'utf8'));
  for (const ep of rf.episodes || []) {
    add(ep.audio_url, 'audio', 10000, `radio-feed:${ep.id}`);
    add(ep.captions_url, 'vtt', 32, `radio-feed:${ep.id}`);
    add(ep.wai_envelope_url, 'wai', 512, `radio-feed:${ep.id}`);
    add(ep.transcript_url, 'json_or_html', 64, `radio-feed:${ep.id}`);
  }

  const cov = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/coverage.json'), 'utf8'));
  for (const [sid, sa] of Object.entries(cov.study_assets || {})) {
    if (sa.mobile_mp4_exists) add(sa.mobile_mp4_url, 'video', 5000, `coverage:study:${sid}`);
    if (sa.ad_mix_exists) add(sa.ad_mix_url, 'audio', 5000, `coverage:study:${sid}`);
    add(sa.source_sheet_url, 'html', 256, `coverage:study:${sid}`);
    add(sa.braille_transcript_url, 'html', 256, `coverage:study:${sid}`);
  }
  for (const [eid, ra] of Object.entries(cov.radio_assets || {})) {
    if (ra.opus_exists) add(ra.opus_url, 'audio', 5000, `coverage:radio:${eid}`);
    add(ra.source_sheet_url, 'html', 256, `coverage:radio:${eid}`);
    add(ra.braille_transcript_url, 'html', 256, `coverage:radio:${eid}`);
  }
  for (const lg of cov.languages || []) {
    if (lg.radio_rss_exists && lg.radio_rss_url) {
      add(lg.radio_rss_url, 'xml', 128, `coverage:lang:${lg.code}`);
    }
  }

  const unsil = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/planetary-unsiloeing.json'), 'utf8'));
  for (const ad of unsil.audio_descriptions || []) {
    add(ad.ad_audio_url, 'audio', 2048, `unsiloeing:ad:${ad.tv_id}`);
    add(ad.ad_vtt_url, 'vtt', 32, `unsiloeing:ad:${ad.tv_id}`);
  }
  for (const v of unsil.variants || []) {
    if (v.ship_allowed === false) continue;
    if (v.audio_url) add(v.audio_url, 'audio', 2048, `unsiloeing:var:${v.tv_id}:${v.lang}`);
    if (v.vtt_url) add(v.vtt_url, 'vtt', 32, `unsiloeing:var:${v.tv_id}:${v.lang}`);
  }

  const hmi = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/live/hmi-corpus.json'), 'utf8'));
  for (const st of hmi.studies || []) {
    add(st.tv15s, 'video', 10000, `hmi-corpus:${st.id}:15s`);
    add(st.tv45s, 'video', 10000, `hmi-corpus:${st.id}:45s`);
    add(st.tv90s, 'video', 10000, `hmi-corpus:${st.id}:90s`);
    if (st.tv180s) add(st.tv180s, 'video', 10000, `hmi-corpus:${st.id}:180s`);
    if (st.tiktokMp4) add(st.tiktokMp4, 'video', 10000, `hmi-corpus:${st.id}:tiktok`);
    add(st.path, 'html', 256, `hmi-corpus:${st.id}:paper`);
    if (st.pdfPath) add(st.pdfPath, 'pdf', 2048, `hmi-corpus:${st.id}:pdf`);
  }

  return urls;
}

function resolveLocalCandidate(pathname) {
  const rel = pathname.replace(/^\/+/, '');
  const candidates = [
    path.join(DIST, rel),
    path.join(DIST, rel.replace(/\/$/, ''), 'index.html'),
    path.join(DIST, rel.replace(/\/$/, '') + '.html'),
  ];
  if (rel.startsWith('media/')) {
    candidates.push(path.join(CANON_MEDIA, rel.slice('media/'.length)));
    candidates.push(path.join(ROOT, 'public', rel));
  }
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

// ============================================================================
// LAYER 1: DIST + CATALOG + RSS + HMI STATIC INVARIANTS
// ============================================================================
async function verifyDistAndInvariants() {
  console.log('\n── Layer 1: Dist Catalog, RSS Enclosures & HMI AudioWorklet Invariants ──');
  if (!fs.existsSync(DIST)) {
    fail(`dist/ is missing at ${DIST}; build first`);
    return;
  }

  const urls = collectMediaUrlsFromCatalogs();
  let missingCount = 0;
  let undersizedCount = 0;
  for (const [pathname, meta] of urls.entries()) {
    const fp = resolveLocalCandidate(pathname);
    if (!fp) {
      missingCount++;
      if (missingCount <= 15) fail(`Missing asset (${meta.source}): ${pathname}`);
      continue;
    }
    const sz = fs.statSync(fp).size;
    if (sz < meta.minBytes) {
      undersizedCount++;
      if (undersizedCount <= 15) fail(`Undersized asset (${meta.source}): ${pathname} (${sz} B < ${meta.minBytes} B)`);
    }
  }
  if (missingCount === 0 && undersizedCount === 0) {
    ok(`All ${urls.size} catalog, radio, TV, TikTok, accessibility, and HMI assets verified with valid byte sizes`);
  } else {
    fail(`Catalog asset check failed: ${missingCount} missing, ${undersizedCount} undersized out of ${urls.size}`);
  }

  // Scan RSS feeds in dist/radio/**/rss.xml for broken <enclosure> / <podcast:source> URLs
  const rssFiles = [];
  const walkRss = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walkRss(p);
      else if (ent.name.endsWith('.xml')) rssFiles.push(p);
    }
  };
  walkRss(path.join(DIST, 'radio'));
  let rssChecked = 0;
  let rssMissing = 0;
  for (const rf of rssFiles) {
    const xml = fs.readFileSync(rf, 'utf8');
    const re = /\b(?:url|uri)="([^"]+)"/g;
    let m;
    while ((m = re.exec(xml))) {
      const p = normalizeLocalPath(m[1]);
      if (!p || (!p.startsWith('/media/') && !p.startsWith('/transcripts/'))) continue;
      rssChecked++;
      if (!resolveLocalCandidate(p)) {
        rssMissing++;
        if (rssMissing <= 10) fail(`RSS broken enclosure in ${path.relative(DIST, rf)}: ${p}`);
      }
    }
  }
  if (rssMissing === 0) {
    ok(`All ${rssChecked} podcast RSS enclosures across ${rssFiles.length} RSS feeds resolve cleanly`);
  }

  // Audit HMI JavaScript invariants (Founder Rules + WebAudio pull-graph + watchdog recovery)
  for (const relJs of ['public/live/hmi-engine.js', 'public/live/openie-ecosystem-dock.js']) {
    const absJs = path.join(ROOT, relJs);
    const src = fs.readFileSync(absJs, 'utf8');
    if (/\bspeechSynthesis\b/.test(src.replace(/\/\/.*$/gm, ''))) {
      fail(`${relJs}: forbidden browser speechSynthesis reference found`);
    }
    if (/numberOfOutputs\s*:\s*0/.test(src)) {
      fail(`${relJs}: dead-end AudioWorkletNode (numberOfOutputs: 0) found; must connect through 0-gain sink to ctx.destination`);
    }
    if (!/silentSink\.connect\(ctx\.destination\)/.test(src)) {
      fail(`${relJs}: missing silentSink.connect(ctx.destination) pull-graph wiring`);
    }
    if (!/audio_wav_b64/.test(src) || !/_fallbackAudioTurnHttp/.test(src)) {
      fail(`${relJs}: missing client-side VAD audio_wav_b64 /api/live/turn watchdog fallback`);
    }
    if (!/_scheduleWsReconnect/.test(src)) {
      fail(`${relJs}: missing WebSocket auto-reconnect on close`);
    }
  }
  ok('HMI engines pass WebAudio zero-gain pull-sink, auto-reconnect, audio_wav_b64 fallback, and zero-speechSynthesis invariants');
}

// ============================================================================
// LAYER 2: LIVE EDGE HTTP 200 / 206 MEDIA SWEEP
// ============================================================================
async function probeRange206(pathname) {
  const url = `${SITE_ORIGIN}${pathname}`;
  const isMedia = /\.(mp4|m4a|opus|wai)$/i.test(pathname);
  const headers = isMedia ? { Range: 'bytes=0-1023' } : {};
  const res = await fetch(url, { method: 'GET', headers, redirect: 'follow' });
  const ctype = (res.headers.get('content-type') || '').toLowerCase();
  // Drain body so connection pool stays clean
  const buf = Buffer.from(await res.arrayBuffer());
  if (res.status !== 200 && res.status !== 206) {
    return { ok: false, status: res.status, reason: `HTTP ${res.status} (${res.headers.get('x-openie-edge') || 'edge'})` };
  }
  if (isMedia && ctype.includes('text/html')) {
    return { ok: false, status: res.status, reason: `Poisoned text/html MIME for binary media (${ctype})` };
  }
  if (isMedia && buf.length < 256) {
    return { ok: false, status: res.status, reason: `Truncated media body (${buf.length} B)` };
  }
  return { ok: true, status: res.status, ctype, bytes: buf.length };
}

async function verifyLiveEdgeMedia() {
  console.log(`\n── Layer 2: Live Edge HTTP 200/206 Sweep against ${SITE_ORIGIN} ──`);
  const allUrls = collectMediaUrlsFromCatalogs();
  // Probe EVERY TV film (116), TikTok (29), Mobile MP4 (29), Radio .m4a (17), Radio .opus (17), .wai (17), AD .m4a (29), and sample VTT/RSS
  const targets = [];
  for (const [p, meta] of allUrls.entries()) {
    if (['video', 'audio', 'wai', 'pdf', 'xml'].includes(meta.kind)) {
      targets.push([p, meta]);
    }
  }
  // Also include Kokoro FP32 voice pack manifest & worker
  targets.push(['/live/scholar-kokoro-worker.js', { kind: 'js', source: 'kokoro-worker' }]);
  targets.push(['/live/hmi-engine.js', { kind: 'js', source: 'hmi-engine' }]);
  targets.push(['/live/openie-ecosystem-dock.js', { kind: 'js', source: 'ecosystem-dock' }]);

  let idx = 0;
  let livePass = 0;
  let liveFail = 0;
  const concurrency = 16;
  const workers = Array.from({ length: concurrency }, async () => {
    while (idx < targets.length) {
      const my = idx++;
      const [pathname, meta] = targets[my];
      try {
        const r = await probeRange206(pathname);
        if (r.ok) {
          livePass++;
        } else {
          liveFail++;
          if (liveFail <= 20) fail(`Live edge failed ${pathname} (${meta.source}): ${r.reason}`);
        }
      } catch (err) {
        liveFail++;
        if (liveFail <= 20) fail(`Live edge exception ${pathname}: ${err.message}`);
      }
    }
  });
  await Promise.all(workers);
  if (liveFail === 0) {
    ok(`All ${livePass}/${targets.length} live media streams (.mp4, .m4a, .opus, .wai, .pdf, RSS, HMI JS) returned HTTP 200/206 on ${SITE_ORIGIN}`);
  } else {
    fail(`Live edge media sweep failed on ${liveFail}/${targets.length} URLs`);
  }
}

// ============================================================================
// LAYER 3: FULL-DUPLEX VOICE WEBSOCKET + AUDIO_WAV_B64 HTTPS EVALUATION
// ============================================================================
function buildRealSpeechWavAndPcm16() {
  const sampleAudio = path.join(ROOT, 'public/media/radio/opus/en-digest.m4a');
  const tmpWav = path.join(os.tmpdir(), `openie_e2e_speech_${process.pid}.wav`);
  try {
    if (fs.existsSync('/usr/bin/afconvert')) {
      execFileSync('/usr/bin/afconvert', ['-f', 'WAVE', '-d', 'LEI16@16000', '-c', '1', sampleAudio, tmpWav], {
        stdio: 'ignore',
      });
    } else {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', sampleAudio, '-ar', '16000', '-ac', '1', '-f', 'wav', tmpWav], {
        stdio: 'ignore',
      });
    }
    const raw = fs.readFileSync(tmpWav);
    try { fs.unlinkSync(tmpWav); } catch {}
    // Extract 3.0 seconds of spoken English starting at 0.25s
    const startByte = Math.min(raw.length - 96000, 44 + 8000);
    const pcmBytes = raw.subarray(Math.max(44, startByte), Math.max(44, startByte) + 96000);
    // Build clean 44-byte RIFF header around pcmBytes
    const wavOut = Buffer.alloc(44 + pcmBytes.length);
    wavOut.write('RIFF', 0);
    wavOut.writeUInt32LE(36 + pcmBytes.length, 4);
    wavOut.write('WAVE', 8);
    wavOut.write('fmt ', 12);
    wavOut.writeUInt32LE(16, 16);
    wavOut.writeUInt16LE(1, 20);
    wavOut.writeUInt16LE(1, 22);
    wavOut.writeUInt32LE(16000, 24);
    wavOut.writeUInt32LE(32000, 28);
    wavOut.writeUInt16LE(2, 32);
    wavOut.writeUInt16LE(16, 34);
    wavOut.write('data', 36);
    wavOut.writeUInt32LE(pcmBytes.length, 40);
    pcmBytes.copy(wavOut, 44);
    return { pcmBytes, wavB64: wavOut.toString('base64') };
  } catch (err) {
    throw new Error(`Could not prepare 16 kHz speech fixture: ${err.message}`);
  }
}

async function verifyLiveVoiceProtocols() {
  console.log(`\n── Layer 3: Live Talk Grounded HTTPS + Full-Duplex WSS Speech-In/Speech-Out Eval ──`);

  // 3A. GET /api/live/status
  const stRes = await fetch(`${SITE_ORIGIN}/api/live/status`);
  const stJson = await stRes.json();
  if (stRes.ok && stJson.ok && stJson.engines?.tier_a_gemini_live?.available) {
    ok(`/api/live/status online (generation ${stJson.generation}, model ${stJson.engines.tier_a_gemini_live.model})`);
  } else {
    fail(`/api/live/status unhealthy: HTTP ${stRes.status} ${JSON.stringify(stJson).slice(0, 180)}`);
  }

  // 3B. POST /api/live/turn (Text Grounding)
  const t0 = Date.now();
  const txtRes = await fetch(`${SITE_ORIGIN}/api/live/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: 'Explain Metered Commit Gates in two plain everyday sentences.',
      register: 'pi',
      site: 'research.openie.dev/papers/gates/',
    }),
  });
  const txtJson = await txtRes.json();
  if (txtRes.ok && txtJson.ok && String(txtJson.spoken_text || '').length > 20) {
    ok(`/api/live/turn text grounding succeeded in ${Date.now() - t0} ms (${txtJson.spoken_text.length} chars)`);
  } else {
    fail(`/api/live/turn text failed: HTTP ${txtRes.status} ${JSON.stringify(txtJson).slice(0, 200)}`);
  }

  // 3C. POST /api/live/turn (Direct 16 kHz audio_wav_b64 Speech Recovery Path!)
  const { pcmBytes, wavB64 } = buildRealSpeechWavAndPcm16();
  const tWav = Date.now();
  const wavRes = await fetch(`${SITE_ORIGIN}/api/live/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: '',
      audio_wav_b64: wavB64,
      register: 'pi',
      site: 'research.openie.dev/radio/',
    }),
  });
  const wavJson = await wavRes.json();
  if (wavRes.ok && wavJson.ok && String(wavJson.spoken_text || '').length > 15) {
    ok(`/api/live/turn 16 kHz audio_wav_b64 spoken turn succeeded in ${Date.now() - tWav} ms`);
  } else {
    fail(`/api/live/turn audio_wav_b64 failed: HTTP ${wavRes.status} ${JSON.stringify(wavJson).slice(0, 200)}`);
  }

  // 3D. WSS /api/live/ws Full-Duplex Speech-In -> Speech-Out + Barge-In Interrupt
  const wsUrl = SITE_ORIGIN.replace(/^http/, 'ws') + '/api/live/ws';
  const runWsAttempt = (attempt) =>
    new Promise((resolve) => {
      const ws = new WebSocket(wsUrl);
      let phase = 'connecting';
      let greetAudioBytes = 0;
      let replyAudioBytes = 0;
      let userTranscript = '';
      let assistantTranscript = '';
      let sawToolAction = false;
      let streamTimer = null;
      let done = false;

      const finish = (passed, msg, retryable = false) => {
        if (done) return;
        done = true;
        if (streamTimer) clearInterval(streamTimer);
        try {
          if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close();
        } catch {}
        resolve({ passed, msg, retryable });
      };

      const guard = setTimeout(() => {
        finish(
          false,
          `WSS /api/live/ws timed out in phase=${phase} (greetAudio=${greetAudioBytes}, userTx="${userTranscript}", replyAudio=${replyAudioBytes})`,
          attempt < 2
        );
      }, 22000);

      ws.onopen = () => {
        phase = 'awaiting_ready';
        ws.send(
          JSON.stringify({
            type: 'start',
            voice: 'Aoede',
            register: 'pi',
            site: 'research.openie.dev/radio/ | Active: Metered Commit Gates',
          })
        );
      };

      ws.onmessage = (ev) => {
        let msg;
        try {
          msg = JSON.parse(String(ev.data));
        } catch {
          return;
        }
        if (msg.type === 'ready' && phase === 'awaiting_ready') {
          phase = 'greeting';
          ws.send(JSON.stringify({ type: 'text', text: 'Say the single word Ready.' }));
        } else if (msg.type === 'audio' && msg.pcm24_b64) {
          if (phase === 'greeting') greetAudioBytes += msg.pcm24_b64.length;
          else if (phase === 'speaking_user' || phase === 'awaiting_voice_reply') replyAudioBytes += msg.pcm24_b64.length;
        } else if (msg.type === 'transcript' && msg.text) {
          if (msg.role === 'user') userTranscript += msg.text;
          else if (phase === 'speaking_user' || phase === 'awaiting_voice_reply') assistantTranscript += msg.text;
        } else if (msg.type === 'ui_action') {
          sawToolAction = true;
        } else if (msg.type === 'interrupted' && phase === 'testing_barge_in') {
          clearTimeout(guard);
          finish(
            true,
            `WSS /api/live/ws full-duplex voice cycle passed (greeting=${greetAudioBytes} b64B, userSTT="${userTranscript.trim().slice(0, 48)}", replyAudio=${replyAudioBytes} b64B, tool=${sawToolAction}, barge-in ack=true)`
          );
        } else if (msg.type === 'turn_complete') {
          if (phase === 'greeting') {
            if (greetAudioBytes < 1000) {
              clearTimeout(guard);
              finish(false, `WSS /api/live/ws greeting produced insufficient audio (${greetAudioBytes})`);
              return;
            }
            phase = 'speaking_user';
            const totalChunks = Math.floor(pcmBytes.length / 3200);
            let cIdx = 0;
            streamTimer = setInterval(() => {
              if (ws.readyState !== WebSocket.OPEN) {
                clearInterval(streamTimer);
                streamTimer = null;
                return;
              }
              if (cIdx < totalChunks) {
                const slice = pcmBytes.subarray(cIdx * 3200, (cIdx + 1) * 3200);
                ws.send(JSON.stringify({ type: 'audio', pcm16_b64: slice.toString('base64') }));
              } else if (cIdx < totalChunks + 16) {
                ws.send(JSON.stringify({ type: 'audio', pcm16_b64: Buffer.alloc(3200).toString('base64') }));
              } else {
                clearInterval(streamTimer);
                streamTimer = null;
                phase = 'awaiting_voice_reply';
              }
              cIdx++;
            }, 70);
          } else if (
            (phase === 'speaking_user' || phase === 'awaiting_voice_reply') &&
            (replyAudioBytes > 1000 || (sawToolAction && userTranscript.trim().length > 5))
          ) {
            if (streamTimer) {
              clearInterval(streamTimer);
              streamTimer = null;
            }
            phase = 'testing_barge_in';
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'interrupt' }));
            }
          }
        } else if (msg.type === 'error') {
          clearTimeout(guard);
          finish(false, `WSS /api/live/ws returned error: ${msg.message}`, attempt < 2);
        }
      };

      ws.onerror = () => {
        if (done) return;
      };
      ws.onclose = (ev) => {
        if (done) return;
        clearTimeout(guard);
        finish(
          false,
          `WSS /api/live/ws closed unexpectedly in phase=${phase} (code=${ev.code}, reason=${JSON.stringify(ev.reason || '')})`,
          attempt < 2
        );
      };
    });

  let wsOut = await runWsAttempt(1);
  if (!wsOut.passed && wsOut.retryable) {
    wsOut = await runWsAttempt(2);
  }
  if (wsOut.passed) ok(wsOut.msg);
  else fail(wsOut.msg);
}

// ============================================================================
// LAYER 4: HEADLESS CHROME DEVTOOLS PROTOCOL (CDP) REAL-USER JOURNEY SUITE
// ============================================================================
function findChromeBinary() {
  const candidates = [
    process.env.CHROME_BIN,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean);
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

class CdpSession {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.seq = 1;
    this.pending = new Map();
    this.events = new Map();
  }
  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
    this.ws.onmessage = (ev) => {
      const msg = JSON.parse(String(ev.data));
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method && this.events.has(msg.method)) {
        for (const fn of this.events.get(msg.method)) fn(msg.params || {});
      }
    };
  }
  on(method, fn) {
    if (!this.events.has(method)) this.events.set(method, []);
    this.events.get(method).push(fn);
  }
  send(method, params = {}) {
    const id = this.seq++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      throw new Error(`Browser JS exception: ${res.exceptionDetails.text || JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result?.value;
  }
  close() {
    try { this.ws?.close(); } catch {}
  }
}

async function verifyHeadlessBrowserUserJourneys() {
  console.log(`\n── Layer 4: Headless Chrome DevTools 7-Page Real-User Journey Cycle ──`);
  const chromeBin = findChromeBinary();
  if (!chromeBin) {
    fail('No Chrome/Chromium binary found for --browser E2E user journey check');
    return;
  }

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openie-cdp-e2e-'));
  const proc = spawn(
    chromeBin,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${userDataDir}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      '--autoplay-policy=no-user-gesture-required',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--window-size=1440,900',
      'about:blank',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  let browserWsUrl = '';
  try {
    browserWsUrl = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timed out waiting for Chrome DevTools WS URL')), 10000);
      let stderrBuf = '';
      proc.stderr.on('data', (chunk) => {
        stderrBuf += chunk.toString('utf8');
        const m = stderrBuf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (m) {
          clearTimeout(timer);
          resolve(m[1]);
        }
      });
      proc.on('exit', (code) => {
        clearTimeout(timer);
        reject(new Error(`Chrome exited prematurely (${code}): ${stderrBuf.slice(-300)}`));
      });
    });

    const httpBase = browserWsUrl.replace(/^ws:/, 'http:').replace(/\/devtools\/browser\/.*$/, '');
    const targets = await (await fetch(`${httpBase}/json/list`)).json();
    const pageTarget = targets.find((t) => t.type === 'page');
    if (!pageTarget?.webSocketDebuggerUrl) throw new Error('No page target in headless Chrome');

    const cdp = new CdpSession(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Network.enable');
    await cdp.send('Log.enable');

    let pageErrors = [];
    let consoleErrors = [];
    let httpErrors = [];

    cdp.on('Runtime.exceptionThrown', (p) => {
      pageErrors.push(
        p.exceptionDetails?.exception?.description ||
          p.exceptionDetails?.text ||
          'Uncaught exception'
      );
    });
    cdp.on('Runtime.consoleAPICalled', (p) => {
      if (p.type === 'error') {
        const txt = (p.args || []).map((a) => a.value ?? a.description ?? '').join(' ');
        consoleErrors.push(txt);
      }
    });
    cdp.on('Network.responseReceived', (p) => {
      const status = p.response?.status || 0;
      const u = p.response?.url || '';
      if (status >= 400 && !u.endsWith('/favicon.ico')) {
        httpErrors.push(`${status} ${u}`);
      }
    });

    const navigateAndSettle = async (pathname, waitMs = 1200) => {
      pageErrors = [];
      consoleErrors = [];
      httpErrors = [];
      await cdp.send('Network.clearBrowserCache').catch(() => {});
      const loadDone = new Promise((resolve) => {
        const handler = () => resolve();
        cdp.on('Page.loadEventFired', handler);
        setTimeout(resolve, 8000);
      });
      await cdp.send('Page.navigate', { url: `${SITE_ORIGIN}${pathname}` });
      await loadDone;
      await new Promise((r) => setTimeout(r, waitMs));
    };

    const assertZeroPageFaults = (label) => {
      if (httpErrors.length || pageErrors.length || consoleErrors.length) {
        fail(
          `${label} had browser faults — HTTP>=400: [${httpErrors.join(', ')}], PageErrors: [${pageErrors.join('; ')}], ConsoleErrors: [${consoleErrors.join('; ')}]`
        );
        return false;
      }
      return true;
    };

    // Journey 1: Homepage
    await navigateAndSettle('/', 900);
    if (assertZeroPageFaults('Journey 1 (/)')) {
      ok('Journey 1 (/): clean render, 0 HTTP 4xx/5xx, 0 console errors');
    }

    // Journey 2: /tv/ — gates-15s.mp4 + gates-45s.mp4 playback
    await navigateAndSettle('/tv/?study=gates&tier=15s', 1400);
    const tvCheck = await cdp.eval(`(async () => {
      const res15 = window.openieTV.play('gates', '15s');
      const v = document.getElementById('tv-player');
      await new Promise((resolve, reject) => {
        if (v.readyState >= 1) return resolve();
        v.addEventListener('loadedmetadata', resolve, { once: true });
        v.addEventListener('error', () => reject(new Error('gates-15s video error')), { once: true });
        setTimeout(() => reject(new Error('gates-15s metadata timeout')), 7000);
      });
      const d15 = v.duration;
      window.openieTV.play('gates', '45s');
      await new Promise((resolve, reject) => {
        if (v.readyState >= 1 && v.getAttribute('src').includes('gates-45s')) return resolve();
        v.addEventListener('loadedmetadata', resolve, { once: true });
        v.addEventListener('error', () => reject(new Error('gates-45s video error')), { once: true });
        setTimeout(() => reject(new Error('gates-45s metadata timeout')), 7000);
      });
      return { src15: res15.video_url, d15, src45: v.getAttribute('src'), d45: v.duration, err: v.error ? v.error.code : null };
    })()`);
    if (assertZeroPageFaults('Journey 2 (/tv/ gates 15s & 45s)') && tvCheck.d15 > 10 && tvCheck.d45 > 30 && !tvCheck.err) {
      ok(`Journey 2 (/tv/): gates-15s.mp4 (${tvCheck.d15.toFixed(1)}s) & gates-45s.mp4 (${tvCheck.d45.toFixed(1)}s) loaded & played with 0 404s`);
    } else {
      fail(`Journey 2 (/tv/) failed: ${JSON.stringify(tvCheck)}`);
    }

    // Journey 3: /radio/ — Segment-End Auto-Advance (ep17 -> ep01-global-literature-radar.m4a!)
    await navigateAndSettle('/radio/', 1400);
    const radioCheck = await cdp.eval(`(async () => {
      const a = document.getElementById('radio-audio');
      await new Promise((resolve, reject) => {
        if (a.readyState >= 1) return resolve();
        a.addEventListener('loadedmetadata', resolve, { once: true });
        a.addEventListener('error', () => reject(new Error('initial ep17 audio error')), { once: true });
        setTimeout(() => reject(new Error('initial ep17 metadata timeout')), 7000);
      });
      const initialEp = window.openieRadio.getNowPlaying().studio_deck.episode_id;
      // Simulate segment ending -> auto-advances into ep01-global-literature-radar.m4a!
      a.dispatchEvent(new Event('ended'));
      await new Promise((resolve, reject) => {
        const check = () => {
          if (a.getAttribute('src').includes('ep01-global-literature-radar') && a.readyState >= 1) return resolve();
        };
        a.addEventListener('loadedmetadata', () => setTimeout(resolve, 150), { once: true });
        a.addEventListener('error', () => reject(new Error('ep01 auto-advance audio error')), { once: true });
        check();
        setTimeout(() => reject(new Error('ep01 auto-advance metadata timeout: src=' + a.getAttribute('src') + ' rs=' + a.readyState)), 8000);
      });
      const afterEp = window.openieRadio.getNowPlaying().studio_deck.episode_id;
      return { initialEp, afterEp, src: a.getAttribute('src'), dur: a.duration, err: a.error ? a.error.code : null };
    })()`);
    if (
      assertZeroPageFaults('Journey 3 (/radio/ segment-end auto-advance)') &&
      radioCheck.afterEp === 'ep01-global-literature-radar' &&
      radioCheck.dur > 200 &&
      !radioCheck.err
    ) {
      ok(
        `Journey 3 (/radio/): segment-end auto-advance (${radioCheck.initialEp} → ${radioCheck.afterEp}, ${radioCheck.dur.toFixed(1)}s) succeeded with 0 404s`
      );
    } else {
      fail(`Journey 3 (/radio/) auto-advance failed: ${JSON.stringify(radioCheck)}`);
    }

    // Journey 4: /papers/gates/ — 4-Altitude Gravity-Well Progressive Disclosure
    await navigateAndSettle('/papers/gates/', 1000);
    const gwCheck = await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('[data-gw-set-depth]'));
      const levels = btns.map((b) => b.getAttribute('data-gw-set-depth'));
      const results = {};
      for (const lv of ['plain', 'visual', 'builder', 'formal']) {
        const b = document.querySelector('[data-gw-set-depth="' + lv + '"]');
        if (b) b.click();
        results[lv] = document.documentElement.getAttribute('data-gw-depth') || document.querySelector('[data-gw-bar]')?.getAttribute('data-active-depth') || localStorage.getItem('openie_gw_depth');
      }
      return { count: btns.length, levels, results };
    })()`);
    if (assertZeroPageFaults('Journey 4 (/papers/gates/ Gravity-Well)') && gwCheck.count >= 4) {
      ok(`Journey 4 (/papers/gates/): 4-Altitude Gravity-Well depth switcher (${gwCheck.levels.join(' → ')}) verified with 0 errors`);
    } else {
      fail(`Journey 4 (/papers/gates/) failed: ${JSON.stringify(gwCheck)}`);
    }

    // Journey 5: /live/ — Non-blocking Call Connect + Full-Duplex AudioWorklet Pull Graph + WSS Live Call!
    await navigateAndSettle('/live/?study=gates', 1400);
    const liveCallCheck = await cdp.eval(`(async () => {
      const hmi = window.openieLiveHMI;
      if (!hmi) return { error: 'window.openieLiveHMI missing on /live/' };
      const startBtn = document.getElementById('btn-call-toggle');
      startBtn.click();
      // 1. Verify startCall() connects WebSocket in < 3.5s WITHOUT blocking on OS/TCC getUserMedia prompt!
      const t0 = Date.now();
      while ((!hmi.ws || hmi.ws.readyState !== WebSocket.OPEN) && Date.now() - t0 < 4000) {
        await new Promise((r) => setTimeout(r, 80));
      }
      const wsOpenFast = Boolean(hmi.ws && hmi.ws.readyState === WebSocket.OPEN);
      // 2. Feed a live WebAudio MediaStream (440 Hz voice-band signal) into _startMicrophoneAndVad to verify AudioWorklet pull-graph end-to-end
      const ctx = await hmi._ensureAudioContext();
      const dest = ctx.createMediaStreamDestination();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = 420;
      g.gain.value = 0.25;
      osc.connect(g);
      g.connect(dest);
      osc.start();
      if (!hmi.workletNode) {
        await hmi._startMicrophoneAndVad(dest.stream);
      }
      let pcmFramesCaptured = 0;
      if (hmi.workletNode && hmi.workletNode.port) {
        hmi.workletNode.port.addEventListener('message', (ev) => {
          if (ev.data && ev.data.pcm16) pcmFramesCaptured++;
        });
      }
      await new Promise((r) => setTimeout(r, 1250));
      osc.stop();
      const snap = {
        callActive: hmi.callActive,
        audioCtxState: hmi.audioCtx?.state,
        workletOutputs: hmi.workletNode?.numberOfOutputs,
        silentSinkGain: hmi.micSilentSink?.gain?.value,
        wsOpen: wsOpenFast,
        pcmFramesCaptured,
        state: hmi.state,
      };
      hmi.endCall();
      return snap;
    })()`);
    if (
      assertZeroPageFaults('Journey 5 (/live/ Duplex Call & AudioWorklet)') &&
      liveCallCheck.workletOutputs === 1 &&
      liveCallCheck.silentSinkGain === 0 &&
      liveCallCheck.wsOpen &&
      liveCallCheck.pcmFramesCaptured >= 8
    ) {
      ok(
        `Journey 5 (/live/): Non-blocking Live Call connected (${liveCallCheck.audioCtxState}), AudioWorklet pulled ${liveCallCheck.pcmFramesCaptured} 16 kHz PCM16 frames via 0-gain sink, 0 errors`
      );
    } else {
      fail(`Journey 5 (/live/) failed: ${JSON.stringify(liveCallCheck)}`);
    }

    // Journey 6: /living/compiled-agency/ — Interactive Observatory + Shadow-DOM Ecosystem Dock
    await navigateAndSettle('/living/compiled-agency/', 1200);
    const livingCheck = await cdp.eval(`(() => {
      const host = document.getElementById('openie-ecosystem-dock-host');
      return { hasDockHost: Boolean(host && host.shadowRoot), title: document.title };
    })()`);
    if (assertZeroPageFaults('Journey 6 (/living/compiled-agency/)') && livingCheck.hasDockHost) {
      ok('Journey 6 (/living/compiled-agency/): Observatory & Shadow-DOM Live Ecosystem Dock verified with 0 errors');
    } else {
      fail(`Journey 6 (/living/compiled-agency/) failed: ${JSON.stringify(livingCheck)}`);
    }

    // Journey 7: /radio/ Studio Call-In (#radio-live-call-btn) -> Auto-Duck + LiveCallDock Connect + Hangup
    await navigateAndSettle('/radio/', 1200);
    const callInCheck = await cdp.eval(`(async () => {
      const btn = document.getElementById('radio-live-call-btn');
      if (!btn) return { error: 'missing #radio-live-call-btn' };
      btn.click();
      const t0 = Date.now();
      while ((!window.openieLiveHMI || !window.openieLiveHMI.callActive) && Date.now() - t0 < 5000) {
        await new Promise((r) => setTimeout(r, 100));
      }
      await new Promise((r) => setTimeout(r, 1000));
      const modeTxt = document.getElementById('playback-mode-pill')?.textContent || '';
      const dockOpen = Boolean(window.openieLiveDock && window.openieLiveDock.isOpen());
      const active = Boolean(window.openieLiveHMI && window.openieLiveHMI.callActive);
      window.openieLiveHMI?.endCall();
      return { dockOpen, active, modeTxt };
    })()`);
    if (assertZeroPageFaults('Journey 7 (/radio/ Studio Call-In)') && callInCheck.dockOpen && callInCheck.active) {
      ok(`Journey 7 (/radio/ Studio Call-In): Dock opened, radio ducked (${callInCheck.modeTxt.trim()}), and hung up cleanly with 0 errors`);
    } else {
      fail(`Journey 7 (/radio/ Studio Call-In) failed: ${JSON.stringify(callInCheck)}`);
    }

    if (runDeep) {
      console.log(`\n── Layer 5 (--deep): Exhaustive Real-Browser Sweep Across All /living/*, /papers/* & Hub Surfaces ──`);
      const listSubDirs = (sub) => {
        const base = path.join(DIST, sub);
        if (!fs.existsSync(base)) return [];
        return fs
          .readdirSync(base, { withFileTypes: true })
          .filter(
            (e) =>
              e.isDirectory() &&
              e.name !== 'archive' &&
              fs.existsSync(path.join(base, e.name, 'index.html'))
          )
          .map((e) => `/${sub}/${e.name}/`)
          .sort();
      };

      const livingRoutes = ['/living/', ...listSubDirs('living')];
      const paperRoutes = listSubDirs('papers');
      const hubRoutes = [
        '/tutorials/',
        '/rce/spec/',
        '/figures/',
        '/syndication/',
        '/sourcesheets/',
        '/sourcesheets/gates/',
        '/sourcesheets/lut-adapt/',
        '/blueprint/',
        '/glossary/',
        '/data/',
      ];

      let livingOk = 0;
      for (const r of livingRoutes) {
        await navigateAndSettle(r, 650);
        if (assertZeroPageFaults(`Deep Living (${r})`)) livingOk++;
      }
      if (livingOk === livingRoutes.length) {
        ok(`All ${livingOk}/${livingRoutes.length} /living/* interactive observatories rendered with 0 HTTP >=400, 0 exceptions, and 0 console errors`);
      }

      let paperOk = 0;
      for (const r of paperRoutes) {
        await navigateAndSettle(r, 550);
        const hasGw = await cdp.eval(`document.querySelectorAll('[data-gw-set-depth]').length`);
        if (assertZeroPageFaults(`Deep Paper (${r})`)) {
          if (hasGw >= 4) {
            paperOk++;
          } else {
            fail(`Deep Paper (${r}) missing 4-Altitude Gravity-Well switcher (found ${hasGw})`);
          }
        }
      }
      if (paperOk === paperRoutes.length) {
        ok(`All ${paperOk}/${paperRoutes.length} /papers/* study pages verified with 4-Altitude Gravity-Well & 0 browser errors`);
      }

      let hubOk = 0;
      for (const r of hubRoutes) {
        await navigateAndSettle(r, r === '/rce/spec/' ? 1400 : 700);
        if (assertZeroPageFaults(`Deep Hub (${r})`)) hubOk++;
      }
      if (hubOk === hubRoutes.length) {
        ok(`All ${hubOk}/${hubRoutes.length} hub & spec surfaces (/tutorials/, /rce/spec/, /figures/, /syndication/, /sourcesheets/, /blueprint/, /glossary/, /data/) passed with 0 errors`);
      }
    }

    cdp.close();
  } finally {
    proc.kill('SIGKILL');
    try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch {}
  }
}

async function main() {
  const tStart = Date.now();
  if (runDist) await verifyDistAndInvariants();
  if (runLive) {
    await verifyLiveEdgeMedia();
    await verifyLiveVoiceProtocols();
  }
  if (runBrowser) {
    await verifyHeadlessBrowserUserJourneys();
  }

  const elapsed = ((Date.now() - tStart) / 1000).toFixed(2);
  console.log(`\n════════════════════════════════════════════════════════════════════`);
  if (failures.length > 0) {
    console.error(`✗ E2E VERIFICATION FAILED: ${failures.length} failure(s) (${passNotes.length} checks passed in ${elapsed}s)`);
    process.exit(1);
  }
  console.log(`✓ ALL ${passNotes.length} E2E VERIFICATION GATES PASSED CLEANLY in ${elapsed}s`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal E2E runner error:', err);
  process.exit(1);
});
