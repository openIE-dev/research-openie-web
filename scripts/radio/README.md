# OpenIE Research Radio — Autonomous 6h Scrape, Pilot & Broadcast Engine

`scripts/radio/` implements the four-stage autonomous loop backing `/radio/` and `/radio/rss.xml`:

1. **`scraper.py` — Sanctioned Open-Access Literature Intake**
   Polls five documented public APIs (`arXiv`, `Europe PMC`, `OpenAlex`, `bioRxiv`, and `ClinicalTrials.gov`) with polite `User-Agent: OpenIE-Research-Radio/1.0 (+https://research.openie.dev/radio/)` headers, deduplicating works via `BLAKE2b-256` and `SHA-256` content digests.
2. **`reviewer.py` — Epistemic & Telemetry Cross-Examiner**
   Cross-examines external works against all 21 OpenIE studies (`src/data/studies.json`), assigning `[T]` / `[E]` / `[M]` / `[S]` epistemic badges, auditing inline shunt (`measured_j`) vs hardware counter (`reported_j`) disclosure and `Shape D` deterministic controls, and classifying entries into `CORROBORATES`, `CHALLENGES_ASSUMPTION`, or `NEW_FRONTIER_GAP`.
3. **`foundry_pilots.py` & `foundry_runner.py` — Candidate Topic Foundry & `<60s` Pilot Loop**
   Synthesizes six candidate research topics with pre-declared `Shape D` null baselines and hard kill criteria, executes deterministic Python pilots under 60 seconds with wrap-safe Linux `powercap` `intel-rapl:0` `reported_j` telemetry (`board_metered=false`), and classifies outcomes into `PROMOTED_CANDIDATE`, `HOLD_NEEDS_HARDWARE`, or `KILLED_BY_NULL`.
4. **`personas.py`, `studio_synth.py` & `render_launch_pack.py` — 14-Persona Global Studio Ensemble (`ElevenLabs eleven_v4`)**
   Voices rotating 3-person roundtables across 14 explicitly disclosed AI-synthesized OpenIE research personas (`Elena`, `Amara`, `Priya`, `Mei`, `Mateo`, `Marcus`, `Liam`, `Sean`, `Rohan`, `Kwame`, `Tariq`, `Claire`, `Arthur`, `Kenji`) using `ElevenLabs eleven_v4` (`mp3_44100_192`, SHA-256 cached in `state/eleven_cache/`) with multicultural Microsoft `edge-tts` neural voices as a zero-key fallback. Masters `44.1 kHz`, `128 kbps` Stereo AAC `.m4a` (`-16 LUFS`, `+faststart`) alongside turn-synced `.vtt` WebVTT captions and `.json` transcripts with pop-up citation and falsifier cards.
5. **`radio_daemon.py` & `systemd/` — 6-Hour Autonomous Linux Scheduler**
   Protected by non-blocking `fcntl.flock`, scheduled every 6 hours via `systemd --user` (`openie-research-radio.timer`, `Persistent=true`) and user `crontab`. Reads `ELEVENLABS_API_KEY`, runtime paths, and `OPENIE_RADIO_SYNC_TARGET` strictly from `~/.config/openie-radio/env` (`chmod 600`) outside version control.
