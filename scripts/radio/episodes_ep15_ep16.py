#!/usr/bin/env python3
"""OpenIE Research Radio — Flagship Episode 16 Specification (`ep16-unsiloeing-planetary-wai-commons`).

Covers the Canonical Artifact Substrate + Planetary Research Dissemination Blueprint:
  1. 8-field `openie-artifact-v1` schema + `WAI1` (`BLAKE3` + `Ed25519`) binary container
  2. Highest-leverage `15s` Plain-Words cuts across Tier-1 (`20`) & Tier-2 (`30` -> `50` languages, ~7.95B speakers)
     guarded by zero-human `COMET` / `LaBSE` / `chrF++` gates (`flagged_do_not_ship` on 2 consecutive strikes)
  3. First-class `CC0-1.0` `WCAG 2.2 AA` Accessibility projections: `28`-study Easy Read, `28`-study Extended Audio
     Description, and `36` W3C SKOS AAC concepts (`/glossary/concepts.json`)
  4. Unifying `1,991` CC0 prior-art disclosures (`Humanoid`, `Phone`, `Wearable`, `eVTOL`) + Research TV/Radio inside
     `scholar.askdavidc.ai` (`JCR-1` `COSE_Sign1` receipts) and closing Blueprint §6 prior-art pre-checks.
"""

from __future__ import annotations

from typing import Any

EPISODE_16_SPEC: dict[str, Any] = {
    "id": "ep16-unsiloeing-planetary-wai-commons",
    "number": 16,
    "desk": "avalanche",
    "desk_domain": "avalanche.openie.dev",
    "desks": ["avalanche", "stack", "communication"],
    "title": "Ep 16 · Unsiloeing Science: One Canonical WAI1 Artifact Across 50 Languages, Accessibility, & The Commons",
    "subtitle": "Cecily, Marcus, Amara, and Kwame unpack the 8-field openie-artifact-v1 schema, WAI1 BLAKE3/Ed25519 envelopes, 50-language COMET/LaBSE/chrF++ gates, CC0 WCAG 2.2 AA Easy-Read/AD/SKOS AAC projections, and 1,991 prior-art disclosures in The Commons",
    "summary": (
        "Cecily, Marcus, Amara, and Kwame examine how Open Interface Engineering eliminates manual curation drift across web pages, "
        "112 Research TV films, 16 Research Radio broadcasts, and defensive prior-art repositories through one 8-field openie-artifact-v1 "
        "record sealed inside a byte-conforming WAI1 (BLAKE3 + Ed25519) container; why translating 15-second three-point Plain-Words cuts "
        "reaches 20 Tier-1 and 30 Tier-2 languages (50 languages, ~7.95B speakers) behind zero-human COMET, LaBSE, mE5, and NLLB-200 chrF++ "
        "gates (auto-regenerating on strike 1 and halting as flagged_do_not_ship on strike 2); how CC0-1.0 WCAG 2.2 AA projections ship "
        "28-study Easy Read, 28-study Extended Audio Description, and 36 W3C SKOS AAC concepts (/glossary/concepts.json); and how 1,991 CC0 "
        "prior-art disclosures (Humanoid, Phone, Wearable, eVTOL) with JCR-1 COSE_Sign1 receipts unite inside scholar.askdavidc.ai so the "
        "autonomous synthesis loop checks The Commons before proposing novel continuations."
    ),
    "topic_tags": [
        "unsiloeing-blueprint",
        "wai1-envelope",
        "planetary-50-languages",
        "wcag-skos-aac",
        "commons-prior-art",
    ],
    "studies": [
        "communication-avalanche",
        "ai-reads-human",
        "gates",
        "deterministic-null",
        "interface-economics",
    ],
    "pan_overrides": {
        "Cecily": [0.99, 0.99],
        "Marcus": [1.05, 0.89],
        "Amara": [0.95, 1.02],
        "Kwame": [0.89, 1.05],
    },
    "published_utc": "2026-11-24T19:00:00Z",
    "turns": [
        {
            "speaker": "Cecily",
            "text": (
                "Welcome to Episode Sixteen of OpenIE Research Radio! I'm Cecily, and today we have a four-chair flagship roundtable in the studio: "
                "empirical skeptic Marcus, systems and accessibility storyteller Amara, and distributed WAI envelope engineer Kwame. "
                "Full studio disclosure up front: all four of us are AI-synthesized OpenIE research personas voiced via ElevenLabs eleven_v4 neural speech "
                "and grounded strictly in verified Open Interface Engineering artifacts and live Commons receipts."
            ),
            "tts_text": (
                "Welcome to Episode Sixteen of Open I E Research Radio! I'm Cecily, and today we have a four-chair flagship roundtable in the studio: "
                "empirical skeptic Marcus, systems and accessibility storyteller Amara, and distributed W A I envelope engineer Kwame. "
                "Full studio disclosure up front: all four of us are A I synthesized Open I E research personas voiced via ElevenLabs eleven V four neural speech "
                "and grounded strictly in verified Open Interface Engineering artifacts and live Commons receipts."
            ),
            "cards": [
                {
                    "kind": "ecosystem",
                    "badge": "BLUEPRINT · CC0",
                    "title": "Unsiloeing the OpenIE Ecosystem (/blueprint/)",
                    "detail": "One canonical 8-field openie-artifact-v1 record projecting TV, Radio, 50-language Plain-Words cuts, WCAG 2.2 AA accessibility, and The Commons.",
                    "href": "/blueprint/",
                }
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "Let's start with the embarrassing confession every research lab in the world recognizes, Kwame. "
                "Normally, a team writes a paper, exports a PDF, renders a video folder, hand-edits a podcast RSS XML file, and pushes a separate GitHub repo. "
                "Six weeks later, five copies disagree on revision hashes, captions are missing, and human curators spend all day babysitting glue scripts!"
            ),
        },
        {
            "speaker": "Kwame",
            "text": (
                "That fragmentation is pure unverified multi-hop drift, Marcus! Unsiloeing fixes the root cause by making every web page, video cut, "
                "podcast enclosure, and agent endpoint a deterministic projection of one eight-field schema called openie-artifact-v1: "
                "canonical_id, provenance_chain, energy_cost_j, difficulty_rung, verification_status, modality_variants, license, and interchange_envelope."
            ),
            "tts_text": (
                "That fragmentation is pure unverified multi-hop drift, Marcus! Un-siloeing fixes the root cause by making every web page, video cut, "
                "podcast enclosure, and agent endpoint a deterministic projection of one eight-field schema called open I E artifact V one: "
                "canonical I D, provenance chain, energy cost J, difficulty rung, verification status, modality variants, license, and interchange envelope."
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "WAI1 · BLAKE3",
                    "title": "Byte-Conforming WAI1 Envelope & Ed25519 Receipt",
                    "detail": "4-byte ASCII 'WAI1' + u32 LE man_len + compact JSON manifest + u32 LE payload_len + Zstandard payload + moq-jwp BLAKE3 Merkle & Ed25519 signature.",
                    "href": "/media/radio/wai/ep16-unsiloeing-planetary-wai-commons.wai",
                }
            ],
        },
        {
            "speaker": "Cecily",
            "text": (
                "Walk listeners right down to the wire bytes of that interchange_envelope, Kwame — because as of today, all sixteen Research Radio episodes "
                "ship live dot-wai binary envelopes under /media/radio/wai/!"
            ),
            "tts_text": (
                "Walk listeners right down to the wire bytes of that interchange envelope, Kwame — because as of today, all sixteen Research Radio episodes "
                "ship live dot W A I binary envelopes under slash media slash radio slash W A I!"
            ),
        },
        {
            "speaker": "Kwame",
            "text": (
                "Every file begins with the exact four-byte ASCII magic WAI1 — hex 57 41 49 31 — followed by a thirty-two-bit little-endian manifest length, "
                "a whitespace-free UTF-8 JSON manifest declaring capability wai.text.zstd with intent replicate, a thirty-two-bit little-endian payload length, "
                "and a single-segment RFC 8878 Zstandard payload bundling the canonical eight-field artifact, turn-synced transcript, citation cards, and audio SHA-256 and BLAKE3 digests. "
                "Above the container, a domain-separated moq-jwp BLAKE3 Merkle tree and RFC 8032 Ed25519 group signature seal all sixteen episodes in receipts.json."
            ),
            "tts_text": (
                "Every file begins with the exact four-byte ASCII magic W A I one — hex fifty-seven, forty-one, forty-nine, thirty-one — followed by a thirty-two-bit little-endian manifest length, "
                "a whitespace-free U T F eight JSON manifest declaring capability W A I dot text dot z-standard with intent replicate, a thirty-two-bit little-endian payload length, "
                "and a single-segment R F C eighty-eight seventy-eight Z-standard payload bundling the canonical eight-field artifact, turn-synced transcript, citation cards, and audio SHA two fifty-six and Blake three digests. "
                "Above the container, a domain-separated M O Q, J W P Blake three Merkle tree and R F C eighty thirty-two E D twenty-five five nineteen group signature seal all sixteen episodes in receipts dot JSON."
            ),
        },
        {
            "speaker": "Amara",
            "text": (
                "Now once an artifact is sealed cleanly once, ask who on Earth can actually understand it! "
                "If a breakthrough stays locked inside dense English academic jargon, over six billion people who speak Mandarin, Hindi, Spanish, Arabic, Swahili, Bengali, Hausa, or Amharic are shut out on day one."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "Hold on, Amara — let me push back with the classic translation trap! If you auto-translate forty pages of math and hardware telemetry into fifty languages without human translators, "
                "you're guaranteed to ship hallucinated numbers or mangled negations. Why doesn't our pipeline fall into that trap?"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "2-STRIKE HALT",
                    "title": "Zero-Human Gate: flagged_do_not_ship on Strike 2",
                    "detail": "Checks COMET >= 0.78, LaBSE >= 0.74, mE5 >= 0.79, NLLB-200 chrF++ >= 38.0, 3 bullets, 0 unexplained acronyms, and exact numbers; halts on 2 strikes.",
                    "href": "/blueprint/#gate-scoreboard",
                }
            ],
        },
        {
            "speaker": "Amara",
            "text": (
                "Two reasons, Marcus! First, we translate the highest-leverage artifact first: the fifteen-second, three-bullet Plain-Words cut — zero unexplained acronyms, "
                "covering what problem is solved, how the mechanism works, and what falsifies it. Tier One ships twenty languages reaching six point five four billion speakers — "
                "one hundred sixty out of one hundred sixty live variants across eight flagship films in a thirty-five-megabyte minus-sixteen LUFS stereo bundle — "
                "and Tier Two adds the next thirty languages to reach fifty languages and roughly seven point nine five billion speakers!"
            ),
            "tts_text": (
                "Two reasons, Marcus! First, we translate the highest-leverage artifact first: the fifteen-second, three-bullet Plain-Words cut — zero unexplained acronyms, "
                "covering what problem is solved, how the mechanism works, and what falsifies it. Tier One ships twenty languages reaching six point five four billion speakers — "
                "one hundred sixty out of one hundred sixty live variants across eight flagship films in a thirty-five-megabyte minus-sixteen L U F S stereo bundle — "
                "and Tier Two adds the next thirty languages to reach fifty languages and roughly seven point nine five billion speakers!"
            ),
            "cards": [
                {
                    "kind": "receipt",
                    "badge": "160/160 PASS",
                    "title": "Tier-1 20-Language + Tier-2 30-Language Matrix (~7.95B)",
                    "detail": "Fleet mean COMET 0.850, LaBSE cosine 0.866, mE5 0.867, and NLLB-200 back-translation chrF++ 58.0 across 160 Stereo -16 LUFS variants.",
                    "href": "/media/tv/planetary-15s/manifest.json",
                }
            ],
        },
        {
            "speaker": "Kwame",
            "text": (
                "And second is our zero-human deterministic verification gate! Every translated script must clear neural semantic alignment via LaBSE and multilingual-E5, "
                "calibrated COMET at or above zero point seven eight — our fleet mean is zero point eight five zero — plus independent NLLB-200 neural back-translation into English "
                "scoring chrF++ at or above thirty-eight, where our fleet averages fifty-eight point zero, alongside structural checks for three plain bullets, zero leaked acronyms, and exact number preservation! "
                "Strike one triggers automatic regeneration — rescuing two variants cleanly — and strike two halts immediately as flagged_do_not_ship. In adversarial red-teaming, sign inversions and dropped negations were blocked one hundred percent of the time."
            ),
            "tts_text": (
                "And second is our zero-human deterministic verification gate! Every translated script must clear neural semantic alignment via Lab-see and multilingual E five, "
                "calibrated COMET at or above zero point seven eight — our fleet mean is zero point eight five zero — plus independent N L L B two hundred neural back-translation into English "
                "scoring character F plus plus at or above thirty-eight, where our fleet averages fifty-eight point zero, alongside structural checks for three plain bullets, zero leaked acronyms, and exact number preservation! "
                "Strike one triggers automatic regeneration — rescuing two variants cleanly — and strike two halts immediately as flagged do not ship. In adversarial red-teaming, sign inversions and dropped negations were blocked one hundred percent of the time."
            ),
        },
        {
            "speaker": "Cecily",
            "text": (
                "That brings us to Pillar Three, Amara: first-class CC0-1.0 accessibility projections! "
                "Why did we release Easy Read, Extended Audio Descriptions, and AAC concept boards into the public domain under CC0?"
            ),
        },
        {
            "speaker": "Amara",
            "text": (
                "Because assistive technology builders, schools, disability advocates, and screen-reader users should never hit copyright friction or visual-only walls! "
                "Every Canonical Artifact automatically emits WCAG 2.2 Level AA companions under CC0-1.0: standalone Easy-Read editions across all twenty-eight Research TV studies "
                "built with one-idea sentences and visual symbol cues; twenty-eight study Extended Audio Description scripts plus narrated stereo AD tracks describing 3D scenes and charts; "
                "and thirty-six W3C SKOS and Schema.org DefinedTerm concepts at /glossary/concepts.json!"
            ),
            "tts_text": (
                "Because assistive technology builders, schools, disability advocates, and screen-reader users should never hit copyright friction or visual-only walls! "
                "Every Canonical Artifact automatically emits W CAG two point two Level double-A companions under C C zero one dot zero: standalone Easy-Read editions across all twenty-eight Research T V studies "
                "built with one-idea sentences and visual symbol cues; twenty-eight study Extended Audio Description scripts plus narrated stereo A D tracks describing three-D scenes and charts; "
                "and thirty-six W three C SKOSS and Schema dot org DefinedTerm concepts at slash glossary slash concepts dot JSON!"
            ),
            "cards": [
                {
                    "kind": "study",
                    "badge": "36 SKOS AAC",
                    "title": "WCAG 2.2 AA Easy Read (28) + SKOS AAC (/glossary/concepts.json)",
                    "detail": "CC0-1.0 W3C SKOS DefinedTermSet with <=16-word plain definitions, one-idea Easy-Read sentences, ARASAAC pictograms, and switch core words.",
                    "href": "/glossary/concepts.json",
                },
                {
                    "kind": "study",
                    "badge": "28 EASY READ",
                    "title": "Standalone 28-Study Easy-Read & Audio Description Guide",
                    "detail": "Accessible HTML and JSON projections covering all 28 Research TV studies with zero-jargon summaries and extended visual descriptions.",
                    "href": "/media/tv/accessibility/easy-read-index.html",
                },
            ],
        },
        {
            "speaker": "Marcus",
            "text": (
                "I inspected /glossary/concepts.json earlier — every single one of those thirty-six concepts defines ideas like a commit gate, a receipt, or a lookup table "
                "in sixteen plain words or fewer, paired with ARASAAC symbol keywords and three core switch words like stop, check, safe! "
                "Now connect Pillar Four, Kwame: how does all of this plug into scholar.askdavidc.ai — The Commons?"
            ),
            "tts_text": (
                "I inspected slash glossary slash concepts dot JSON earlier — every single one of those thirty-six concepts defines ideas like a commit gate, a receipt, or a lookup table "
                "in sixteen plain words or fewer, paired with Ara-sack symbol keywords and three core switch words like stop, check, safe! "
                "Now connect Pillar Four, Kwame: how does all of this plug into scholar dot ask david C dot A I — The Commons?"
            ),
        },
        {
            "speaker": "Kwame",
            "text": (
                "Inside scholar.askdavidc.ai, we unified one thousand nine hundred ninety-one CC0-1.0 defensive prior-art disclosures spanning four open hardware domains — "
                "Humanoid, Phone, Wearable, and eVTOL — right alongside all twenty-eight Research TV studies and all sixteen Research Radio broadcasts! "
                "Every ingested claim carries seven-axis provenance and JCR-1 COSE_Sign1 cryptographic receipts, searchable by humans and AI agents over REST /api/ask and the MCP endpoint at /mcp."
            ),
            "tts_text": (
                "Inside scholar dot ask david C dot A I, we unified one thousand nine hundred ninety-one C C zero one dot zero defensive prior-art disclosures spanning four open hardware domains — "
                "Humanoid, Phone, Wearable, and E V-tall — right alongside all twenty-eight Research T V studies and all sixteen Research Radio broadcasts! "
                "Every ingested claim carries seven-axis provenance and J C R one, C O S E Sign one cryptographic receipts, searchable by humans and A I agents over REST slash A P I slash ask and the M C P endpoint at slash M C P."
            ),
            "cards": [
                {
                    "kind": "ecosystem",
                    "badge": "1,991 CC0 + JCR-1",
                    "title": "The Commons: 1,991 Prior-Art Disclosures + TV & Radio",
                    "detail": "Unifies Humanoid, Phone, Wearable, and eVTOL CC0 disclosures with Research TV/Radio under JCR-1 COSE_Sign1 receipts at scholar.askdavidc.ai.",
                    "href": "https://scholar.askdavidc.ai",
                }
            ],
        },
        {
            "speaker": "Cecily",
            "text": (
                "And that closes Blueprint Section Six right inside our own autonomous six-hour Research Radio daemon! "
                "Marcus, tell us what happens now before our Topic Foundry proposes any candidate continuation."
            ),
        },
        {
            "speaker": "Marcus",
            "text": (
                "No more blind brainstorming! Before our six-hour Linux loop proposes or runs a single candidate pilot, commons_prior_art_check queries live scholar.askdavidc.ai "
                "across those one thousand nine hundred ninety-one prior-art disclosures, Research TV, Research Radio, and open literature — recording hit_count, the top seekable citation URL, "
                "and statement excerpt directly into radio-radar.json! Plus, any browser or MCP agent visiting research.openie.dev can call our new WebMCP tools — "
                "openie_get_blueprint_artifacts, openie_lookup_aac_concept, and openie_query_commons_prior_art — to join the Universal AI Agent Bus in one hop!"
            ),
            "tts_text": (
                "No more blind brainstorming! Before our six-hour Linux loop proposes or runs a single candidate pilot, commons prior art check queries live scholar dot ask david C dot A I "
                "across those one thousand nine hundred ninety-one prior-art disclosures, Research T V, Research Radio, and open literature — recording hit count, the top seekable citation U R L, "
                "and statement excerpt directly into radio-radar dot JSON! Plus, any browser or M C P agent visiting research dot open I E dot dev can call our new Web M C P tools — "
                "open I E get blueprint artifacts, open I E lookup A A C concept, and open I E query commons prior art — to join the Universal A I Agent Bus in one hop!"
            ),
            "cards": [
                {
                    "kind": "falsifier",
                    "badge": "§6 PRE-CHECK",
                    "title": "Ungrounded Continuation Refusal (commons_prior_art_check)",
                    "detail": "Every Rung-Radar paper and Topic Foundry continuation logs live scholar.askdavidc.ai corroboration before proposing novel experiments.",
                    "href": "https://scholar.askdavidc.ai/mcp",
                },
                {
                    "kind": "ecosystem",
                    "badge": "WEBMCP BUS",
                    "title": "Universal AI Agent Bus (/webmcp-tools.js)",
                    "detail": "Exposes openie_get_blueprint_artifacts, openie_lookup_aac_concept, and openie_query_commons_prior_art to browser & MCP agents.",
                    "href": "/webmcp-tools.js",
                },
            ],
        },
        {
            "speaker": "Cecily",
            "text": (
                "One canonical eight-field artifact, sixteen WAI1 binary envelopes with BLAKE3 and Ed25519 receipts, fifty languages guarded by zero-human neural gates, "
                "CC0 WCAG 2.2 AA accessibility, and live prior-art grounding across The Commons! Inspect the live blueprint at research.openie.dev/blueprint, "
                "download any episode's dot-wai envelope right from the Studio Deck, and catch our next autonomous pulse in six hours on OpenIE Research Radio!"
            ),
            "tts_text": (
                "One canonical eight-field artifact, sixteen W A I one binary envelopes with Blake three and E D twenty-five five nineteen receipts, fifty languages guarded by zero-human neural gates, "
                "C C zero W CAG two point two double-A accessibility, and live prior-art grounding across The Commons! Inspect the live blueprint at research dot open I E dot dev slash blueprint, "
                "download any episode's dot W A I envelope right from the Studio Deck, and catch our next autonomous pulse in six hours on Open I E Research Radio!"
            ),
        },
    ],
}
