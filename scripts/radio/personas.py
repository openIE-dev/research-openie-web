#!/usr/bin/env python3
"""OpenIE Research Radio — 14-Persona Global Studio Ensemble & Phonetic Normalizer."""

from __future__ import annotations

import re
from typing import Any

PERSONAS: dict[str, dict[str, Any]] = {
    # Hosts (Architects / Moderators)
    "Elena": {
        "name": "Elena",
        "group": "host",
        "title": "Science Journalist · Hispanic/Spanish English",
        "voice_id": "uR6zbwkKmeecuupKV18k",
        "fallback_voice": "en-US-AvaMultilingualNeural",
        "color": "#00D4AA",
        "pan": [0.98, 0.98],
    },
    "Amara": {
        "name": "Amara",
        "group": "host",
        "title": "Systems Storyteller · West African English",
        "voice_id": "mzbNqbWwLuZObi7qEA67",
        "fallback_voice": "en-NG-EzinneNeural",
        "color": "#22D3EE",
        "pan": [0.98, 0.98],
    },
    "Priya": {
        "name": "Priya",
        "group": "host",
        "title": "Science Documentary Host · South Asian English",
        "voice_id": "QCzL5yD6UcwZgNMhRj6G",
        "fallback_voice": "en-IN-NeerjaNeural",
        "color": "#34D399",
        "pan": [0.98, 0.98],
    },
    "Mei": {
        "name": "Mei",
        "group": "host",
        "title": "Tech & Physics Host · East/SE Asian English",
        "voice_id": "7o3vIXfwm98KKuNfGmuY",
        "fallback_voice": "en-SG-LunaNeural",
        "color": "#38BDF8",
        "pan": [0.98, 0.98],
    },
    "Mateo": {
        "name": "Mateo",
        "group": "host",
        "title": "Foundry Host · Latino English",
        "voice_id": "Dn7kHvEWEQXbRGLGqWJV",
        "fallback_voice": "en-US-AndrewMultilingualNeural",
        "color": "#10B981",
        "pan": [0.98, 0.98],
    },
    # Skeptics (Critical Foils)
    "Marcus": {
        "name": "Marcus",
        "group": "skeptic",
        "title": "Empirical Foil · North American English",
        "voice_id": "iP95p4xoKVk53GoZ742B",
        "fallback_voice": "en-US-BrianMultilingualNeural",
        "color": "#F59E0B",
        "pan": [1.04, 0.90],
    },
    "Liam": {
        "name": "Liam",
        "group": "skeptic",
        "title": "Energetic Foil · Australian English",
        "voice_id": "IKne3meq5aSn9XLyUdCD",
        "fallback_voice": "en-AU-WilliamNeural",
        "color": "#FB923C",
        "pan": [1.04, 0.90],
    },
    "Sean": {
        "name": "Sean",
        "group": "skeptic",
        "title": "Auditor & Skeptic · Irish English",
        "voice_id": "tRqj2rLkZmeP61CMmIX4",
        "fallback_voice": "en-IE-ConnorNeural",
        "color": "#FBBF24",
        "pan": [1.04, 0.90],
    },
    # Bench Engineers & Domain Specialists
    "Rohan": {
        "name": "Rohan",
        "group": "specialist",
        "title": "Hardware & Compiler Specialist · South Asian English",
        "voice_id": "QtQiNi8LdZTzSJzhCvXT",
        "fallback_voice": "en-IN-PrabhatNeural",
        "color": "#818CF8",
        "pan": [0.90, 1.04],
    },
    "Kwame": {
        "name": "Kwame",
        "group": "specialist",
        "title": "Distributed Systems Engineer · Nigerian English",
        "voice_id": "PFnEp0d5QKq6baWI3azv",
        "fallback_voice": "en-NG-AbeoNeural",
        "color": "#A78BFA",
        "pan": [0.90, 1.04],
    },
    "Tariq": {
        "name": "Tariq",
        "group": "specialist",
        "title": "Telemetry & Physics Specialist · Middle Eastern English",
        "voice_id": "EzoxNTKsg4JNN7wxAgut",
        "fallback_voice": "en-GB-ThomasNeural",
        "color": "#C084FC",
        "pan": [0.90, 1.04],
    },
    "Claire": {
        "name": "Claire",
        "group": "specialist",
        "title": "Formal Verification & Silicon Architect · British English",
        "voice_id": "Xb7hH8MSUJpSbSDYk0k2",
        "fallback_voice": "en-GB-SoniaNeural",
        "color": "#60A5FA",
        "pan": [0.90, 1.04],
    },
    "Arthur": {
        "name": "Arthur",
        "group": "specialist",
        "title": "Senior Cryptography & Foundations Fellow · North American Senior",
        "voice_id": "pqHfZKP75CvOlQylNhV4",
        "fallback_voice": "en-US-ChristopherNeural",
        "color": "#93C5FD",
        "pan": [0.90, 1.04],
    },
    "Kenji": {
        "name": "Kenji",
        "group": "specialist",
        "title": "Orchestration & Runtime Engineer · Filipino/APAC English",
        "voice_id": "yWnF5eFXku7WqBV6sBto",
        "fallback_voice": "en-PH-JamesNeural",
        "color": "#6EE7B7",
        "pan": [0.90, 1.04],
    },
}

AI_DISCLOSURE = (
    "AI Persona Disclosure: All OpenIE Research Radio hosts, skeptics, and bench specialists "
    "(Elena, Amara, Priya, Mei, Mateo, Marcus, Liam, Sean, Rohan, Kwame, Tariq, Claire, Arthur, and Kenji) "
    "are AI-synthesized OpenIE research personas voiced via ElevenLabs eleven_v4 studio neural voices "
    "(with multicultural neural fallback) and grounded strictly in verified Open Interface Engineering "
    "artifacts, deterministic pilot receipts, and live open-access literature feeds."
)

SPOKEN_SUBS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bbioRxiv\b", re.I), "bio-archive"),
    (re.compile(r"\bmedRxiv\b", re.I), "med-archive"),
    (re.compile(r"\barXiv\b", re.I), "archive"),
    (re.compile(r"\bQ32\.32\b"), "Q thirty-two dot thirty-two"),
    (re.compile(r"\bLUT6\b"), "L U T six"),
    (re.compile(r"\bKV260\b"), "K V two sixty"),
    (re.compile(r"\bINA238\b"), "I N A two thirty-eight"),
    (re.compile(r"\bINA260\b"), "I N A two sixty"),
    (re.compile(r"\bINA3221\b"), "I N A thirty-two twenty-one"),
    (re.compile(r"\bEd25519\b"), "E D twenty-five five nineteen"),
    (re.compile(r"\bBLAKE3\b"), "Blake three"),
    (re.compile(r"\bBLAKE2b\b", re.I), "Blake two B"),
    (re.compile(r"\bSHA-256\b"), "SHA two fifty-six"),
    (re.compile(r"\bDES-10\b"), "D E S ten"),
    (re.compile(r"\bJouleOS\b"), "Joule O S"),
    (re.compile(r"\bMEI-JCP\b"), "M E I, J C P"),
    (re.compile(r"\bRCE-JEPA\b"), "R C E Jeppa"),
    (re.compile(r"\bFormJEPA\b"), "Form Jeppa"),
    (re.compile(r"\bFormEBM\b"), "Form E B M"),
    (re.compile(r"\bJEPA\b"), "Jeppa"),
    (re.compile(r"\bRCE-VC\b"), "R C E, V C"),
    (re.compile(r"\bRCE\b"), "R C E"),
    (re.compile(r"\bSATB\b"), "S A T B"),
    (re.compile(r"\bRAPL\b"), "rapple"),
    (re.compile(r"\baDBS\b"), "adaptive D B S"),
    (re.compile(r"\bcDBS\b"), "continuous D B S"),
    (re.compile(r"\bCpJ\b"), "coherence per joule"),
    (re.compile(r"\breported_j\b"), "reported joules"),
    (re.compile(r"\bmeasured_j\b"), "measured joules"),
    (re.compile(r"\bboard_metered\b"), "board metered"),
    (re.compile(r"(\d)\s*J/tok\b"), r"\1 joules per token"),
    (re.compile(r"(\d)\s*pJ\b"), r"\1 picojoules"),
    (re.compile(r"(\d)\s*nJ\b"), r"\1 nanojoules"),
    (re.compile(r"(\d)\s*(?:uJ|μJ)\b"), r"\1 microjoules"),
    (re.compile(r"(\d)\s*mJ\b"), r"\1 millijoules"),
    (re.compile(r"(\d)\s*(?:us|μs)\b"), r"\1 microseconds"),
    (re.compile(r"(\d)\s*ms\b"), r"\1 milliseconds"),
]


def to_spoken_english(text: str) -> str:
    out = text
    for pat, repl in SPOKEN_SUBS:
        out = pat.sub(repl, out)
    return out
