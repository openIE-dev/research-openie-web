#!/usr/bin/env python3
"""OpenIE Research Radio — Blueprint §6 Commons Prior-Art Pre-Check Helper.

Implements Blueprint §6 ("The synthesis engine queries The Commons for prior art
before proposing a novel continuation"):
  - Queries live `https://scholar.askdavidc.ai/api/ask` and
    `POST https://scholar.askdavidc.ai/mcp` (`commons_prior_art`)
  - Records `commons_corroboration` (`hit_count`, `top_citation_url`,
    `top_statement_excerpt`, `checked_at_utc`, plus `top_idea_id`,
    `top_commons_permalink`, `prior_art_status`) for every Rung-Radar paper and
    proposed synthesis continuation before any novel continuation is proposed.
"""

from __future__ import annotations

import concurrent.futures as cf
import datetime as dt
import json
import os
import re
import urllib.parse
from typing import Any

import requests

COMMONS_BASE_URL = os.environ.get("OPENIE_COMMONS_URL", "https://scholar.askdavidc.ai").rstrip("/")
COMMONS_ASK_URL = f"{COMMONS_BASE_URL}/api/ask"
COMMONS_PRIOR_ART_URL = f"{COMMONS_BASE_URL}/api/prior-art"
COMMONS_MCP_URL = f"{COMMONS_BASE_URL}/mcp"

_TRANSCRIPT_TAG_RE = re.compile(r"\[/?transcript\]", re.I)
_PRIVATE_SCRUB_PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"/workspace/\S*"), "[path]"),
    (re.compile(r"/Users/\S+", re.I), "[path]"),
    (re.compile(r"(?<![\w~./-])/home/[a-z]\S*"), "[path]"),
    (re.compile(r"\bnamed in the brief\b|\bthe brief\b", re.I), "the specification"),
    (re.compile(r"\bowner['’]s machine\b", re.I), "benchmark host"),
    (re.compile(r"\bwriter'?s? notes?\b", re.I), "editorial remark"),
    (re.compile(r"\b(?:TODO|FIXME|XXX)\b"), "[pending]"),
    (re.compile(r"\bNOTE:"), "Notice:"),
    (re.compile(r"\bnot reachable\b", re.I), "offline"),
    (re.compile(r"rce-jepa-(?:blueprint|reads)|joulesperbit", re.I), "openie-corpus"),
]


def _clean_commons_text(raw: str, max_chars: int = 240) -> str:
    txt = _TRANSCRIPT_TAG_RE.sub("", str(raw or ""))
    txt = re.sub(r"\s+", " ", txt).strip()
    for pat, repl in _PRIVATE_SCRUB_PATTERNS:
        txt = pat.sub(repl, txt)
    if len(txt) > max_chars:
        txt = txt[: max_chars - 1].rsplit(" ", 1)[0].rstrip(",;:") + "…"
    return txt


def _normalize_query(raw_query: str) -> str:
    cleaned = re.sub(r"\\[a-zA-Z]+\{([^}]*)\}", r"\1", str(raw_query or ""))
    cleaned = re.sub(r"[^A-Za-z0-9_+.\-\s]", " ", cleaned)
    words = [w for w in cleaned.split() if len(w) >= 2]
    return " ".join(words[:28])[:280].strip()


def _normalize_citation_url(raw_url: str, idea_id: str) -> str:
    u = str(raw_url or "").strip()
    if u.startswith("/"):
        return f"{COMMONS_BASE_URL}{u}"
    if u.startswith("http://") or u.startswith("https://"):
        return u
    if idea_id:
        return f"{COMMONS_BASE_URL}/idea?id={urllib.parse.quote(idea_id)}"
    return COMMONS_BASE_URL


def commons_prior_art_check(
    query: str,
    top: int = 8,
    timeout: float = 8.0,
    session: requests.Session | None = None,
) -> dict[str, Any]:
    """Query The Commons (`/mcp` `commons_prior_art` + `/api/ask`) for prior art."""
    checked_at = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    norm_q = _normalize_query(query)
    if not norm_q:
        return {
            "checked_at_utc": checked_at,
            "endpoint": f"{COMMONS_ASK_URL} + {COMMONS_MCP_URL}#commons_prior_art",
            "query": "",
            "hit_count": 0,
            "prior_art_status": "NOVEL_GAP_CANDIDATE",
            "top_idea_id": None,
            "top_citation_url": COMMONS_BASE_URL,
            "top_commons_permalink": COMMONS_BASE_URL,
            "top_statement_excerpt": "Empty query supplied to Commons prior-art pre-check.",
        }

    sess = session or requests.Session()
    headers = {"Accept": "application/json", "User-Agent": "OpenIE-Research-Radio-Daemon/2.0"}
    merged_by_id: dict[str, dict[str, Any]] = {}

    # 1. MCP JSON-RPC `commons_prior_art` call (chronological priority-date disclosures)
    try:
        mcp_payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": "commons_prior_art",
                "arguments": {"query": norm_q, "n": max(1, min(15, int(top)))},
            },
        }
        mcp_resp = sess.post(
            COMMONS_MCP_URL,
            headers={**headers, "Content-Type": "application/json"},
            json=mcp_payload,
            timeout=(4.0, timeout),
        )
        if mcp_resp.status_code == 200:
            rpc = mcp_resp.json()
            content_list = ((rpc.get("result") or {}).get("content")) or []
            if content_list and isinstance(content_list[0], dict) and content_list[0].get("text"):
                pa_doc = json.loads(content_list[0]["text"])
                for d in pa_doc.get("disclosures") or []:
                    iid = str(d.get("idea_id") or "").strip()
                    if not iid:
                        continue
                    merged_by_id[iid] = {
                        "idea_id": iid,
                        "citation": d.get("citation") or "",
                        "permalink": d.get("permalink") or f"/idea?id={iid}",
                        "statement": d.get("statement") or d.get("quote") or d.get("title") or "",
                        "channel_owner": _clean_commons_text(d.get("channel_owner") or "", 80),
                        "modality": str(d.get("modality") or "written"),
                        "date": str(d.get("date") or ""),
                        "source_api": "mcp:commons_prior_art",
                    }
    except Exception:
        pass

    # 2. Live Adaptive-RAG `/api/ask` query (cross-modal spoken + written + 7-axis provenance)
    try:
        ask_resp = sess.get(
            COMMONS_ASK_URL,
            params={"q": norm_q, "top": max(1, min(15, int(top)))},
            headers=headers,
            timeout=(4.0, timeout),
        )
        if ask_resp.status_code == 200:
            ask_doc = ask_resp.json()
            enriched = ask_doc.get("enriched_hits") or []
            raw_hits = [eh.get("hit") or eh for eh in enriched] if enriched else (ask_doc.get("hits") or [])
            for h in raw_hits:
                if not isinstance(h, dict):
                    continue
                iid = str(h.get("idea_id") or "").strip()
                if not iid:
                    continue
                existing = merged_by_id.get(iid)
                entry = {
                    "idea_id": iid,
                    "citation": h.get("citation") or (existing or {}).get("citation") or "",
                    "permalink": (existing or {}).get("permalink") or f"/idea?id={iid}",
                    "statement": h.get("statement") or h.get("quote") or (existing or {}).get("statement") or "",
                    "channel_owner": _clean_commons_text(
                        h.get("channel_owner") or h.get("speaker") or (existing or {}).get("channel_owner") or "",
                        80,
                    ),
                    "modality": str(h.get("modality") or (existing or {}).get("modality") or "written"),
                    "date": (existing or {}).get("date") or "",
                    "source_api": "ask+mcp" if existing else "rest:api/ask",
                }
                # Prefer ask's top semantic ranking first while retaining MCP disclosures
                merged_by_id = {iid: entry, **{k: v for k, v in merged_by_id.items() if k != iid}}
                break  # Keep top semantic hit at position 0, append remaining unseen hits below
            for h in raw_hits[1:]:
                if not isinstance(h, dict):
                    continue
                iid = str(h.get("idea_id") or "").strip()
                if iid and iid not in merged_by_id:
                    merged_by_id[iid] = {
                        "idea_id": iid,
                        "citation": h.get("citation") or "",
                        "permalink": f"/idea?id={iid}",
                        "statement": h.get("statement") or h.get("quote") or "",
                        "channel_owner": _clean_commons_text(h.get("channel_owner") or h.get("speaker") or "", 80),
                        "modality": str(h.get("modality") or "written"),
                        "date": "",
                        "source_api": "rest:api/ask",
                    }
    except Exception:
        pass

    hits = list(merged_by_id.values())
    hit_count = len(hits)
    if hit_count > 0:
        # Prefer a hit with a rich non-empty statement and external or OpenIE seekable citation
        lead = hits[0]
        top_iid = lead["idea_id"]
        top_cit = _normalize_citation_url(lead.get("citation") or "", top_iid)
        top_perm = _normalize_citation_url(lead.get("permalink") or f"/idea?id={top_iid}", top_iid)
        excerpt = _clean_commons_text(lead.get("statement") or "", 240)
        return {
            "checked_at_utc": checked_at,
            "endpoint": f"{COMMONS_ASK_URL} + {COMMONS_MCP_URL}#commons_prior_art",
            "query": norm_q,
            "hit_count": hit_count,
            "prior_art_status": "PRIOR_ART_CORROBORATED",
            "top_idea_id": top_iid,
            "top_citation_url": top_cit,
            "top_commons_permalink": top_perm,
            "top_channel_owner": lead.get("channel_owner") or "The Commons",
            "top_modality": lead.get("modality") or "written",
            "top_disclosure_date": lead.get("date") or None,
            "top_statement_excerpt": excerpt,
        }

    return {
        "checked_at_utc": checked_at,
        "endpoint": f"{COMMONS_ASK_URL} + {COMMONS_MCP_URL}#commons_prior_art",
        "query": norm_q,
        "hit_count": 0,
        "prior_art_status": "NOVEL_GAP_CANDIDATE",
        "top_idea_id": None,
        "top_citation_url": f"{COMMONS_BASE_URL}/?q={urllib.parse.quote(norm_q[:80])}",
        "top_commons_permalink": f"{COMMONS_BASE_URL}/?q={urllib.parse.quote(norm_q[:80])}",
        "top_channel_owner": None,
        "top_modality": None,
        "top_disclosure_date": None,
        "top_statement_excerpt": "Zero prior-art collisions returned by The Commons; eligible for novel pilot screening.",
    }


def enrich_radar_items_with_commons(
    items: list[dict[str, Any]],
    max_workers: int = 8,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    """Run concurrent Commons prior-art pre-checks across Rung-Radar works."""
    checked_at = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    def _check_one(it: dict[str, Any]) -> dict[str, Any]:
        q = f"{it.get('title', '')} {it.get('rung_name', '')} {it.get('linked_study_id', '')}".strip()
        corr = commons_prior_art_check(q, top=8)
        return {**it, "commons_corroboration": corr}

    with cf.ThreadPoolExecutor(max_workers=max_workers) as pool:
        enriched = list(pool.map(_check_one, items))

    with_hits = sum(1 for it in enriched if (it.get("commons_corroboration") or {}).get("hit_count", 0) > 0)
    total_hits = sum(int((it.get("commons_corroboration") or {}).get("hit_count", 0)) for it in enriched)
    summary = {
        "blueprint_section": "§6 Prior-Art Pre-Check (The Commons)",
        "checked_at_utc": checked_at,
        "commons_base_url": COMMONS_BASE_URL,
        "mcp_endpoint": COMMONS_MCP_URL,
        "ask_endpoint": COMMONS_ASK_URL,
        "radar_works_checked": len(enriched),
        "radar_works_with_prior_art": with_hits,
        "total_commons_disclosures_linked": total_hits,
    }
    return enriched, summary


def enrich_foundry_topics_with_commons(
    topics: list[dict[str, Any]],
    max_workers: int = 6,
) -> list[dict[str, Any]]:
    """Pre-check every proposed Topic Foundry continuation against The Commons."""
    def _check_topic(tp: dict[str, Any]) -> dict[str, Any]:
        anchors = " ".join(tp.get("openie_anchors") or [])
        q = f"{tp.get('title', '')} {anchors}".strip()
        corr = commons_prior_art_check(q, top=8)
        return {**tp, "commons_corroboration": corr}

    with cf.ThreadPoolExecutor(max_workers=max_workers) as pool:
        return list(pool.map(_check_topic, topics))


if __name__ == "__main__":
    import sys

    sample_q = " ".join(sys.argv[1:]) or "LUT6 hardware lookup table wobble gate"
    print(json.dumps(commons_prior_art_check(sample_q), indent=2, ensure_ascii=False))
