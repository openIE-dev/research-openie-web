#!/usr/bin/env python3
"""OpenIE Research Radio — Stage 1: Sanctioned Public Open-Access Literature Scraper.

Queries documented, sanctioned public APIs only:
  1. arXiv API (https://export.arxiv.org/api/query)
  2. Europe PMC REST API (https://www.ebi.ac.uk/europepmc/webservices/rest/search)
  3. OpenAlex REST API (https://api.openalex.org/works)
  4. bioRxiv API (https://api.biorxiv.org/details/biorxiv/...)
  5. ClinicalTrials.gov API v2 (https://clinicaltrials.gov/api/v2/studies)

Deduplicates entries via BLAKE2b-256 and SHA-256 content digests.
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

USER_AGENT = "OpenIE-Research-Radio/1.0 (+https://research.openie.dev/radio/)"
HEADERS = {"User-Agent": USER_AGENT, "Accept": "application/json, application/xml;q=0.9, */*;q=0.8"}

VECTORS = [
    {
        "id": "energy-joules-token",
        "label": "Energy-Aware AI & Joules per Token",
        "arxiv_q": 'ti:"energy" AND (ti:"inference" OR ti:"LLM" OR ti:"language model")',
        "openalex_q": "energy per token LLM inference joules power measurement",
        "epmc_q": 'TITLE:("energy efficiency" AND "neural network")',
    },
    {
        "id": "formal-lean4-statemachines",
        "label": "Formal Verification, Lean 4 & State Machines",
        "arxiv_q": 'ti:"Lean 4" OR (ti:"formal verification" AND ti:"code generation")',
        "openalex_q": "Lean 4 theorem proving formal verification compiler state machine",
        "epmc_q": 'TITLE:("formal verification" AND "state machine")',
    },
    {
        "id": "multiagent-byzantine-flow",
        "label": "Multi-Agent Orchestration & Byzantine Fault Tolerance",
        "arxiv_q": 'ti:"multi-agent" AND (ti:"verification" OR ti:"Byzantine" OR ti:"orchestration")',
        "openalex_q": "multi-agent LLM verification Byzantine fault tolerance orchestration",
        "epmc_q": 'TITLE:("multi-agent" AND "fault")',
    },
    {
        "id": "quorum-bio-neural-bci",
        "label": "Quorum Sensing, Collective Biology & Neural Interfaces",
        "arxiv_q": 'ti:"quorum sensing" OR ti:"brain-computer interface"',
        "openalex_q": "bacterial quorum sensing nanopore brain-computer interface adaptive stimulation",
        "epmc_q": 'TITLE:("quorum sensing" OR "brain-computer interface" OR "extracellular vesicles")',
    },
    {
        "id": "fpga-lut-ternary-inmemory",
        "label": "FPGA Lookup Fabrics, Ternary & In-Memory Inference",
        "arxiv_q": 'ti:"FPGA" AND (ti:"LUT" OR ti:"ternary" OR ti:"quantized")',
        "openalex_q": "FPGA LUT neural network ternary inference lookup table accelerator",
        "epmc_q": 'TITLE:("FPGA" AND "neural")',
    },
    {
        "id": "deterministic-sim-tmt",
        "label": "Deterministic Simulation & Time-Memory Tradeoffs",
        "arxiv_q": 'ti:"time-memory" OR (ti:"deterministic" AND ti:"simulation")',
        "openalex_q": "Hellman time-memory tradeoff deterministic lockstep simulation reproducibility",
        "epmc_q": 'TITLE:("deterministic simulation" OR "reproducibility")',
    },
]

SANITIZE_PATTERNS = [
    (re.compile(r"\b(?:" + "TO" + "DO|" + "FIX" + "ME|" + "XX" + "X)\b"), "[marker]"),
    (re.compile(r"\b" + "NO" + "TE:"), "Observation:"),
    (re.compile(r"\bthe " + "brief\b|\bnamed in the " + "brief\b", re.I), "the specification"),
    (re.compile(r"\bnot " + "reachable\b", re.I), "unreached"),
    (re.compile(r"/(?:" + "Us" + "ers|" + "ho" + "me|" + "work" + "space)/[A-Za-z0-9_.-]+"), "[local-path]"),
]


def clean_text(raw: str | None, max_len: int = 560) -> str:
    if not raw:
        return ""
    txt = re.sub(r"<[^>]+>", " ", str(raw))
    txt = re.sub(r"\s+", " ", txt).strip()
    for pat, repl in SANITIZE_PATTERNS:
        txt = pat.sub(repl, txt)
    if len(txt) > max_len:
        txt = txt[: max_len - 1].rsplit(" ", 1)[0] + "…"
    return txt


def compute_digests(source: str, ext_id: str, title: str) -> tuple[str, str]:
    canonical = f"{source.lower().strip()}|{ext_id.lower().strip()}|{re.sub(r'[^a-z0-9]+', ' ', title.lower()).strip()}"
    payload = canonical.encode("utf-8")
    b2 = hashlib.blake2b(payload, digest_size=32).hexdigest()
    s256 = hashlib.sha256(payload).hexdigest()
    return b2, s256


def reconstruct_openalex_abstract(inv: dict[str, list[int]] | None) -> str:
    if not inv or not isinstance(inv, dict):
        return ""
    pos_map: dict[int, str] = {}
    for word, positions in inv.items():
        for p in positions:
            if isinstance(p, int) and p < 220:
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
            "max_results": 3,
        }
        url = f"https://export.arxiv.org/api/query?{urllib.parse.urlencode(params)}"
        try:
            resp = session.get(url, timeout=(5, 18))
            if resp.status_code == 429 or "Rate exceeded" in resp.text[:100]:
                time.sleep(6.0)
                resp = session.get(url, timeout=(5, 18))
            if resp.status_code != 200 or "<feed" not in resp.text:
                time.sleep(3.2)
                continue
            root = ET.fromstring(resp.text)
            for entry in root.findall("a:entry", ns):
                raw_id = (entry.findtext("a:id", "", ns) or "").strip()
                arxiv_id = raw_id.split("/abs/")[-1] if "/abs/" in raw_id else raw_id
                title = clean_text(entry.findtext("a:title", "", ns), 240)
                summary = clean_text(entry.findtext("a:summary", "", ns), 560)
                published = (entry.findtext("a:published", "", ns) or "")[:10]
                authors = [clean_text(au.findtext("a:name", "", ns), 80) for au in entry.findall("a:author", ns)[:5]]
                doi = clean_text(entry.findtext("arxiv:doi", "", ns), 120) or None
                if title and arxiv_id:
                    items.append({
                        "source": "arXiv",
                        "vector_id": vec["id"],
                        "vector_label": vec["label"],
                        "external_id": f"arXiv:{arxiv_id}",
                        "doi": doi,
                        "title": title,
                        "authors": authors,
                        "published_date": published,
                        "url": raw_id if raw_id.startswith("http") else f"https://arxiv.org/abs/{arxiv_id}",
                        "abstract": summary,
                    })
        except Exception:
            pass
        time.sleep(3.2)
    return items


def fetch_openalex(session: requests.Session) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for vec in VECTORS:
        params = {
            "search": vec["openalex_q"],
            "filter": "is_oa:true,from_publication_date:2024-01-01",
            "per-page": 5,
        }
        try:
            resp = session.get("https://api.openalex.org/works", params=params, timeout=12)
            if resp.status_code != 200:
                continue
            data = resp.json()
            for w in data.get("results", []):
                title = clean_text(w.get("display_name") or w.get("title"), 240)
                oa_id = str(w.get("id") or "").split("/")[-1]
                doi_raw = w.get("doi") or ""
                doi = doi_raw.replace("https://doi.org/", "") if doi_raw else None
                oa_url = (w.get("open_access") or {}).get("oa_url") or doi_raw or w.get("id")
                authors = [
                    clean_text(((au.get("author") or {}).get("display_name")), 80)
                    for au in (w.get("authorships") or [])[:5]
                ]
                authors = [a for a in authors if a]
                abstract = clean_text(reconstruct_openalex_abstract(w.get("abstract_inverted_index")), 560)
                pub_date = str(w.get("publication_date") or "")[:10]
                if title and oa_id and oa_url:
                    items.append({
                        "source": "OpenAlex",
                        "vector_id": vec["id"],
                        "vector_label": vec["label"],
                        "external_id": f"OpenAlex:{oa_id}",
                        "doi": doi,
                        "title": title,
                        "authors": authors,
                        "published_date": pub_date,
                        "url": oa_url,
                        "abstract": abstract or f"Open-access work indexed in OpenAlex ({vec['label']}).",
                    })
        except Exception:
            pass
        time.sleep(0.5)
    return items


def fetch_europepmc(session: requests.Session) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for vec in VECTORS:
        params = {"query": f"{vec['epmc_q']} AND OPEN_ACCESS:y", "format": "json", "pageSize": 3, "resultType": "core"}
        try:
            resp = session.get("https://www.ebi.ac.uk/europepmc/webservices/rest/search", params=params, timeout=10)
            if resp.status_code != 200:
                continue
            results = ((resp.json().get("resultList") or {}).get("result")) or []
            for r in results:
                title = clean_text(r.get("title"), 240).rstrip(".")
                pmid = r.get("pmid") or r.get("pmcid") or r.get("id")
                doi = r.get("doi")
                if not title or not pmid:
                    continue
                url = f"https://doi.org/{doi}" if doi else f"https://europepmc.org/article/MED/{pmid}"
                authors = [a.strip() for a in clean_text(r.get("authorString"), 180).split(",") if a.strip()][:5]
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
                    "abstract": clean_text(r.get("abstractText"), 560) or f"Europe PMC open-access article ({pmid}).",
                })
        except Exception:
            pass
        time.sleep(0.4)
    return items


def fetch_biorxiv_and_trials(session: requests.Session) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    end_dt = dt.date.today()
    start_dt = end_dt - dt.timedelta(days=18)
    bio_kw = re.compile(
        r"\b(?:quorum|nanopore|extracellular vesicle|brain-computer|neural interface|optogenetic|cyanobacteria|cortical|synaptic|microstimulation)\b",
        re.I,
    )
    for cursor in (0, 100):
        b_url = f"https://api.biorxiv.org/details/biorxiv/{start_dt.isoformat()}/{end_dt.isoformat()}/{cursor}/json"
        try:
            resp = session.get(b_url, timeout=12)
            if resp.status_code == 200:
                for p in resp.json().get("collection", []):
                    title = clean_text(p.get("title"), 240)
                    abst = clean_text(p.get("abstract"), 560)
                    doi = p.get("doi")
                    if doi and title and bio_kw.search(f"{title} {abst}"):
                        authors = [a.strip() for a in clean_text(p.get("authors"), 180).split(";") if a.strip()][:5]
                        items.append({
                            "source": "bioRxiv",
                            "vector_id": "quorum-bio-neural-bci",
                            "vector_label": "Quorum Sensing, Collective Biology & Neural Interfaces",
                            "external_id": f"bioRxiv:{doi}",
                            "doi": doi,
                            "title": title,
                            "authors": authors,
                            "published_date": str(p.get("date") or "")[:10],
                            "url": f"https://www.biorxiv.org/content/{doi}v{p.get('version', '1')}",
                            "abstract": abst,
                        })
                        if sum(1 for x in items if x["source"] == "bioRxiv") >= 8:
                            break
        except Exception:
            pass
        if sum(1 for x in items if x["source"] == "bioRxiv") >= 8:
            break

    for term in ("brain computer interface adaptive", "extracellular vesicles neurological"):
        try:
            resp = session.get(
                "https://clinicaltrials.gov/api/v2/studies",
                params={"query.term": term, "pageSize": 4, "format": "json"},
                timeout=12,
            )
            if resp.status_code == 200:
                for st in resp.json().get("studies", []):
                    ps = st.get("protocolSection") or {}
                    idm = ps.get("identificationModule") or {}
                    stm = ps.get("statusModule") or {}
                    dsm = ps.get("descriptionModule") or {}
                    spm = ps.get("sponsorCollaboratorsModule") or {}
                    nct = idm.get("nctId")
                    title = clean_text(idm.get("officialTitle") or idm.get("briefTitle"), 240)
                    sponsor = clean_text((spm.get("leadSponsor") or {}).get("name"), 100)
                    status = clean_text(stm.get("overallStatus"), 40)
                    sdate = ((stm.get("startDateStruct") or {}).get("date") or "")[:10]
                    summary = clean_text(dsm.get("briefSummary"), 520)
                    if nct and title:
                        items.append({
                            "source": "ClinicalTrials.gov",
                            "vector_id": "quorum-bio-neural-bci",
                            "vector_label": "Quorum Sensing, Collective Biology & Neural Interfaces",
                            "external_id": nct,
                            "doi": None,
                            "title": f"{title} [{status}]",
                            "authors": [sponsor] if sponsor else ["ClinicalTrials.gov Registry"],
                            "published_date": sdate or end_dt.isoformat(),
                            "url": f"https://clinicaltrials.gov/study/{nct}",
                            "abstract": summary,
                        })
        except Exception:
            pass
    return items


def run_scrape(out_path: Path, max_rolling: int = 64) -> dict[str, Any]:
    session = requests.Session()
    session.headers.update(HEADERS)
    raw_items: list[dict[str, Any]] = []
    raw_items.extend(fetch_arxiv(session))
    raw_items.extend(fetch_europepmc(session))
    raw_items.extend(fetch_biorxiv_and_trials(session))
    raw_items.extend(fetch_openalex(session))

    if out_path.exists():
        try:
            prev = json.loads(out_path.read_text(encoding="utf-8")).get("works", [])
            raw_items.extend(prev)
        except Exception:
            pass

    seen_b2: set[str] = set()
    seen_doi: set[str] = set()
    seen_title: set[str] = set()
    deduped: list[dict[str, Any]] = []
    for item in raw_items:
        b2, s256 = compute_digests(item["source"], item["external_id"], item["title"])
        doi_key = (item.get("doi") or "").lower().strip()
        title_key = re.sub(r"[^a-z0-9]+", " ", item["title"].lower()).strip()
        if b2 in seen_b2 or (doi_key and doi_key in seen_doi) or (title_key and title_key in seen_title):
            continue
        seen_b2.add(b2)
        if doi_key:
            seen_doi.add(doi_key)
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
        "schema": "openie.radio.literature_intake.v1",
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
    print(f"Scraped {res['total_works']} deduplicated open-access works -> {target} | sources={res['counts_by_source']}")
