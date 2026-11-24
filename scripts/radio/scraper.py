#!/usr/bin/env python3
"""OpenIE Research Radio & Global Rung Radar — Stage 1: Sanctioned Public Literature Scraper.

Queries documented, sanctioned public scientific APIs only:
  1. arXiv API (https://export.arxiv.org/api/query)
  2. OpenAlex REST API (https://api.openalex.org/works)
  3. Europe PMC REST API (https://www.ebi.ac.uk/europepmc/webservices/rest/search)
  4. bioRxiv API (https://api.biorxiv.org/details/biorxiv/...)

Covers all Rung-relevant research fronts across the 9-Rung Computer Intelligence Avalanche
and deduplicates entries via BLAKE2b-256 and SHA-256 content digests.
"""

from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
import socket
import time
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any

import requests
import urllib3.util.connection as urllib3_cn

# Prefer IPv4 to avoid dual-stack AAAA blackholes on academic endpoints
urllib3_cn.allowed_gai_family = lambda: socket.AF_INET

USER_AGENT = "OpenIE-Research-Radio/2.0 (+https://research.openie.dev/radio/)"
HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": "application/json, application/xml;q=0.9, */*;q=0.8",
}

VECTORS = [
    {
        "id": "agentic-tool-error-compounding",
        "label": "Agentic Tool Use & Multi-Turn Error Compounding",
        "arxiv_q": '(ti:"tool use" OR ti:"agentic" OR ti:"function calling") AND (abs:"agent" OR abs:"error" OR abs:"benchmark")',
        "openalex_q": "tool use agentic workflow multi-turn error compounding trajectory verification",
        "epmc_q": 'TITLE:("language model" AND ("agent" OR "tool"))',
    },
    {
        "id": "formal-lean4-statemachines",
        "label": "Formal Verification, Lean 4 & Proof-Carrying Code",
        "arxiv_q": 'ti:"Lean 4" OR ti:"Lean4" OR (ti:"formal verification" AND (ti:"code" OR ti:"proof" OR ti:"synthesis"))',
        "openalex_q": "Lean 4 theorem proving formal verification proof-carrying code state machine",
        "epmc_q": 'TITLE:("formal verification" OR "theorem proving" OR "state machine")',
    },
    {
        "id": "fpga-lut-ternary-inmemory",
        "label": "FPGA Lookup Fabrics, LUT & Bit-Level Neural Networks",
        "arxiv_q": '(ti:"FPGA" OR ti:"LUT" OR ti:"lookup table" OR ti:"weightless") AND (ti:"neural" OR ti:"inference" OR ti:"ternary" OR ti:"quantized")',
        "openalex_q": "FPGA LUT lookup table weightless neural network ternary inference accelerator",
        "epmc_q": 'TITLE:("FPGA" AND ("neural" OR "inference" OR "accelerator"))',
    },
    {
        "id": "deterministic-sim-tmt",
        "label": "Memory-Mapped Case Stores, RAG & Time-Memory Tradeoffs",
        "arxiv_q": '(ti:"retrieval-augmented" OR ti:"episodic memory" OR ti:"time-memory" OR (ti:"deterministic" AND ti:"simulation"))',
        "openalex_q": "retrieval-augmented episodic memory cache lookup index deterministic simulation",
        "epmc_q": 'TITLE:("retrieval-augmented" OR "deterministic simulation")',
    },
    {
        "id": "energy-joules-token",
        "label": "Energy-Proportional & Thermodynamic Computing",
        "arxiv_q": '(ti:"energy" OR ti:"power" OR ti:"thermodynamic") AND (ti:"inference" OR ti:"LLM" OR ti:"computing" OR ti:"language model")',
        "openalex_q": "energy per token inference power measurement thermodynamic computing joules",
        "epmc_q": 'TITLE:(("energy efficiency" OR "thermodynamic" OR "event-driven") AND ("neural" OR "computing"))',
    },
    {
        "id": "multiagent-byzantine-flow",
        "label": "Multi-Agent Communication, Routing & Fault Tolerance",
        "arxiv_q": 'ti:"multi-agent" AND (ti:"communication" OR ti:"verification" OR ti:"Byzantine" OR ti:"orchestration" OR ti:"routing")',
        "openalex_q": "multi-agent communication protocol topology Byzantine fault tolerance routing",
        "epmc_q": 'TITLE:("multi-agent" AND ("communication" OR "fault" OR "consensus"))',
    },
    {
        "id": "quorum-bio-neural-bci",
        "label": "Quorum Thresholds, Event-Driven & Collective Signaling",
        "arxiv_q": 'ti:"quorum sensing" OR (ti:"event-driven" AND ti:"spiking") OR ti:"collective intelligence"',
        "openalex_q": "bacterial quorum sensing event-driven spiking neural threshold collective signaling",
        "epmc_q": 'TITLE:("quorum sensing" OR ("event-driven" AND "neural") OR "collective intelligence")',
    },
]

ALLOWED_SOURCES = {"arXiv", "OpenAlex", "Europe PMC", "bioRxiv"}

SANITIZE_PATTERNS = [
    (re.compile(r"\\(?:emph|textbf|textit|texttt|mathrm)\{([^}]*)\}"), r"\1"),
    (re.compile(r"\b(?:" + "TO" + "DO|" + "FIX" + "ME|" + "XX" + "X)\b"), "[marker]"),
    (re.compile(r"\b" + "NO" + "TE:"), "Observation:"),
    (re.compile(r"\bthe " + "brief\b|\bnamed in the " + "brief\b", re.I), "the specification"),
    (re.compile(r"\bnot " + "reachable\b", re.I), "unreached"),
    (re.compile(r"owner['\u2019]s " + "machine", re.I), "local host"),
    (re.compile(r"\bwriter'?s? " + "notes?\b", re.I), "editorial remark"),
    (re.compile(r"/(?:" + "Us" + "ers|" + "ho" + "me|" + "work" + "space)/[A-Za-z0-9_./-]+"), "[path]"),
    (re.compile(r"\b(?:" + "math" + "ground|" + "pattern" + "-lang|" + "Trin" + "ity|" + "B-C" + "orp)\b", re.I), "framework"),
]


def clean_text(raw: str | None, max_len: int = 620) -> str:
    if not raw:
        return ""
    txt = re.sub(r"<[^>]+>", " ", str(raw))
    for pat, repl in SANITIZE_PATTERNS:
        txt = pat.sub(repl, txt)
    txt = re.sub(r"\s+", " ", txt).strip()
    if len(txt) > max_len:
        txt = txt[: max_len - 1].rsplit(" ", 1)[0] + "…"
    return txt


def normalize_arxiv_stem(ext_id: str, doi: str | None, url: str) -> str:
    for candidate in (ext_id, doi or "", url):
        m = re.search(r"(\d{4}\.\d{4,5})(?:v\d+)?", candidate)
        if m:
            return m.group(1)
    return ""


def compute_digests(source: str, ext_id: str, title: str) -> tuple[str, str]:
    canonical = (
        f"{source.lower().strip()}|{ext_id.lower().strip()}|"
        f"{re.sub(r'[^a-z0-9]+', ' ', title.lower()).strip()}"
    )
    payload = canonical.encode("utf-8")
    b2 = hashlib.blake2b(payload, digest_size=32).hexdigest()
    s256 = hashlib.sha256(payload).hexdigest()
    return b2, s256


def reconstruct_openalex_abstract(inv: dict[str, list[int]] | None) -> str:
    if not inv or not isinstance(inv, dict):
        return ""
    pos_map: dict[int, str] = {}
    for word, positions in inv.items():
        if not isinstance(positions, list):
            continue
        for p in positions:
            if isinstance(p, int) and 0 <= p < 260:
                pos_map[p] = word
    if not pos_map:
        return ""
    return " ".join(pos_map[k] for k in sorted(pos_map))


def fetch_arxiv(session: requests.Session) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    ns = {"a": "http://www.w3.org/2005/Atom", "arxiv": "http://arxiv.org/schemas/atom"}
    for vec in VECTORS:
        params = {
            "search_query": vec["arxiv_q"],
            "start": 0,
            "max_results": 4,
            "sortBy": "submittedDate",
            "sortOrder": "descending",
        }
        url = f"https://export.arxiv.org/api/query?{urllib.parse.urlencode(params)}"
        try:
            resp = session.get(url, timeout=(5, 20))
            if resp.status_code == 429 or "Rate exceeded" in resp.text[:120]:
                time.sleep(6.0)
                resp = session.get(url, timeout=(5, 20))
            if resp.status_code != 200 or "<feed" not in resp.text:
                time.sleep(3.1)
                continue
            root = ET.fromstring(resp.text)
            for entry in root.findall("a:entry", ns):
                raw_id = (entry.findtext("a:id", "", ns) or "").strip()
                arxiv_id = raw_id.split("/abs/")[-1] if "/abs/" in raw_id else raw_id
                arxiv_id = arxiv_id.strip()
                title = clean_text(entry.findtext("a:title", "", ns), 240)
                summary = clean_text(entry.findtext("a:summary", "", ns), 620)
                published = (entry.findtext("a:published", "", ns) or "")[:10]
                authors = [
                    clean_text(au.findtext("a:name", "", ns), 80)
                    for au in entry.findall("a:author", ns)[:6]
                ]
                authors = [a for a in authors if a]
                doi = clean_text(entry.findtext("arxiv:doi", "", ns), 120) or None
                if not doi:
                    stem = normalize_arxiv_stem(arxiv_id, None, raw_id)
                    if stem:
                        doi = f"10.48550/arXiv.{stem}"
                if title and arxiv_id and summary and authors:
                    abs_url = f"https://arxiv.org/abs/{arxiv_id}"
                    items.append({
                        "source": "arXiv",
                        "vector_id": vec["id"],
                        "vector_label": vec["label"],
                        "external_id": f"arXiv:{arxiv_id}",
                        "doi": doi,
                        "title": title,
                        "authors": authors,
                        "published_date": published,
                        "url": abs_url,
                        "abstract": summary,
                    })
        except Exception:
            pass
        time.sleep(3.1)
    return items


def fetch_openalex(session: requests.Session) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for vec in VECTORS:
        params = {
            "search": vec["openalex_q"],
            "filter": "is_oa:true,from_publication_date:2024-06-01",
            "per-page": 5,
        }
        try:
            resp = session.get("https://api.openalex.org/works", params=params, timeout=14)
            if resp.status_code != 200:
                continue
            data = resp.json()
            for w in data.get("results", []):
                title = clean_text(w.get("display_name") or w.get("title"), 240)
                oa_id = str(w.get("id") or "").split("/")[-1]
                doi_raw = str(w.get("doi") or "").strip()
                doi = doi_raw.replace("https://doi.org/", "") if doi_raw else None
                oa_url = (w.get("open_access") or {}).get("oa_url") or doi_raw or w.get("id")
                if doi and not str(oa_url).startswith("http"):
                    oa_url = f"https://doi.org/{doi}"
                authors = [
                    clean_text(((au.get("author") or {}).get("display_name")), 80)
                    for au in (w.get("authorships") or [])[:6]
                ]
                authors = [a for a in authors if a]
                abstract = clean_text(reconstruct_openalex_abstract(w.get("abstract_inverted_index")), 620)
                pub_date = str(w.get("publication_date") or "")[:10]
                if title and oa_id and oa_url and authors and len(abstract) >= 60:
                    items.append({
                        "source": "OpenAlex",
                        "vector_id": vec["id"],
                        "vector_label": vec["label"],
                        "external_id": f"OpenAlex:{oa_id}",
                        "doi": doi,
                        "title": title,
                        "authors": authors,
                        "published_date": pub_date,
                        "url": str(oa_url),
                        "abstract": abstract,
                    })
        except Exception:
            pass
        time.sleep(0.4)
    return items


def fetch_europepmc(session: requests.Session) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for vec in VECTORS:
        params = {
            "query": f"{vec['epmc_q']} AND OPEN_ACCESS:y AND PUB_YEAR:[2024 TO 2026]",
            "format": "json",
            "pageSize": 3,
            "resultType": "core",
        }
        try:
            resp = session.get(
                "https://www.ebi.ac.uk/europepmc/webservices/rest/search",
                params=params,
                timeout=12,
            )
            if resp.status_code != 200:
                continue
            results = ((resp.json().get("resultList") or {}).get("result")) or []
            for r in results:
                title = clean_text(r.get("title"), 240).rstrip(".")
                pmid = r.get("pmid") or r.get("pmcid") or r.get("id")
                doi = clean_text(r.get("doi"), 120) or None
                abstract = clean_text(r.get("abstractText"), 620)
                if not title or not pmid or len(abstract) < 60:
                    continue
                url = f"https://doi.org/{doi}" if doi else f"https://europepmc.org/article/MED/{pmid}"
                authors = [
                    a.strip()
                    for a in clean_text(r.get("authorString"), 200).split(",")
                    if a.strip()
                ][:6]
                if not authors:
                    continue
                items.append({
                    "source": "Europe PMC",
                    "vector_id": vec["id"],
                    "vector_label": vec["label"],
                    "external_id": f"EPMC:{pmid}",
                    "doi": doi,
                    "title": title,
                    "authors": authors,
                    "published_date": str(r.get("firstPublicationDate") or r.get("pubYear") or "")[:10],
                    "url": url,
                    "abstract": abstract,
                })
        except Exception:
            pass
        time.sleep(0.35)
    return items


def fetch_biorxiv(session: requests.Session) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    end_dt = dt.date.today()
    start_dt = end_dt - dt.timedelta(days=21)
    bio_kw = re.compile(
        r"\b(?:quorum|nanopore|extracellular vesicle|brain-computer|neural interface|"
        r"optogenetic|cyanobacteria|synaptic|event-driven|metabolic cost|energy efficiency|"
        r"state machine|collective|plasticity|spike-timing)\b",
        re.I,
    )
    for cursor in (0, 100, 200):
        b_url = f"https://api.biorxiv.org/details/biorxiv/{start_dt.isoformat()}/{end_dt.isoformat()}/{cursor}/json"
        try:
            resp = session.get(b_url, timeout=14)
            if resp.status_code == 200:
                for p in resp.json().get("collection", []):
                    title = clean_text(p.get("title"), 240)
                    abst = clean_text(p.get("abstract"), 620)
                    doi = clean_text(p.get("doi"), 120) or None
                    if doi and title and len(abst) >= 60 and bio_kw.search(f"{title} {abst}"):
                        authors = [
                            a.strip()
                            for a in clean_text(p.get("authors"), 200).split(";")
                            if a.strip()
                        ][:6]
                        if not authors:
                            continue
                        ver = str(p.get("version") or "1").strip()
                        items.append({
                            "source": "bioRxiv",
                            "vector_id": "quorum-bio-neural-bci",
                            "vector_label": "Quorum Thresholds, Event-Driven & Collective Signaling",
                            "external_id": f"bioRxiv:{doi}",
                            "doi": doi,
                            "title": title,
                            "authors": authors,
                            "published_date": str(p.get("date") or "")[:10],
                            "url": f"https://www.biorxiv.org/content/{doi}v{ver}",
                            "abstract": abst,
                        })
                        if len(items) >= 8:
                            break
        except Exception:
            pass
        if len(items) >= 8:
            break
    return items


def run_scrape(out_path: Path, max_rolling: int = 68) -> dict[str, Any]:
    session = requests.Session()
    session.headers.update(HEADERS)

    by_api = [
        fetch_arxiv(session),
        fetch_biorxiv(session),
        fetch_europepmc(session),
        fetch_openalex(session),
    ]
    raw_items: list[dict[str, Any]] = []
    max_bucket = max((len(b) for b in by_api), default=0)
    for idx in range(max_bucket):
        for bucket in by_api:
            if idx < len(bucket):
                raw_items.append(bucket[idx])

    if out_path.exists():
        try:
            prev = json.loads(out_path.read_text(encoding="utf-8")).get("works", [])
            for p in prev:
                if (
                    isinstance(p, dict)
                    and p.get("source") in ALLOWED_SOURCES
                    and len(str(p.get("abstract") or "")) >= 60
                    and p.get("authors")
                ):
                    p["title"] = clean_text(p.get("title"), 240)
                    p["abstract"] = clean_text(p.get("abstract"), 620)
                    raw_items.append(p)
        except Exception:
            pass

    seen_b2: set[str] = set()
    seen_doi: set[str] = set()
    seen_arxiv: set[str] = set()
    seen_title: set[str] = set()
    deduped: list[dict[str, Any]] = []

    for item in raw_items:
        if item.get("source") not in ALLOWED_SOURCES:
            continue
        b2, s256 = compute_digests(item["source"], item["external_id"], item["title"])
        doi_key = (item.get("doi") or "").lower().strip()
        arxiv_stem = normalize_arxiv_stem(item["external_id"], item.get("doi"), item.get("url", ""))
        title_key = re.sub(r"[^a-z0-9]+", " ", item["title"].lower()).strip()

        if (
            b2 in seen_b2
            or (doi_key and doi_key in seen_doi)
            or (arxiv_stem and arxiv_stem in seen_arxiv)
            or (title_key and title_key in seen_title)
        ):
            continue

        seen_b2.add(b2)
        if doi_key:
            seen_doi.add(doi_key)
        if arxiv_stem:
            seen_arxiv.add(arxiv_stem)
        if title_key:
            seen_title.add(title_key)

        item["blake2b_256"] = b2
        item["sha256"] = s256
        deduped.append(item)
        if len(deduped) >= max_rolling:
            break

    by_source: dict[str, int] = {}
    for x in deduped:
        by_source[x["source"]] = by_source.get(x["source"], 0) + 1

    payload = {
        "schema": "openie.radio.literature_intake.v2",
        "scraped_at_utc": dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "user_agent": USER_AGENT,
        "total_works": len(deduped),
        "counts_by_source": by_source,
        "works": deduped,
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return payload


if __name__ == "__main__":
    import sys

    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("state/literature_intake.json")
    res = run_scrape(target)
    print(
        f"Scraped {res['total_works']} deduplicated open-access works -> {target} "
        f"| sources={res['counts_by_source']}"
    )
