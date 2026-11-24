#!/usr/bin/env python3
"""
OpenIE Research TV — 27-Study Global Studio Ensemble & Tutorial Lab Map.
Maps each of the 21 published OpenIE research studies + 6 flagship *.openie.dev
ecosystem channel openers (27 studies total = 108 films) to:
  1. A distinct ElevenLabs eleven_v4 studio voice (name, voice_id, edge-tts neural fallback, profile)
  2. Its canonical /tutorials/?lab=<id> interactive tutorial lab identifier
"""

# (narrator_name, elevenlabs_voice_id, edge_tts_fallback, narrator_profile)
VOICE_ENSEMBLE = {
    "agency": ("Joy", "mzbNqbWwLuZObi7qEA67", "en-NG-EzinneNeural", "Warm Contralto · West African English"),
    "gates": ("George", "JBFqnCBsd6RMkjVDRZzb", "en-GB-RyanNeural", "Warm Storyteller · British English"),
    "deterministic-null": ("Hari", "QtQiNi8LdZTzSJzhCvXT", "en-IN-PrabhatNeural", "Engaging Educator · South Asian English"),
    "satb-harness": ("Mia", "uR6zbwkKmeecuupKV18k", "en-US-AvaMultilingualNeural", "Science Journalist · Hispanic/Spanish English"),
    "time-as-an-index": ("Hakim", "EzoxNTKsg4JNN7wxAgut", "en-GB-ThomasNeural", "Confident Narrator · Middle Eastern English"),
    "communication-avalanche": ("Cecily", "NQMJRVvPew6HsaebYnZj", "en-US-EmmaMultilingualNeural", "Documentary Host · African American English"),
    "lut-adapt": ("Jenny", "7o3vIXfwm98KKuNfGmuY", "en-SG-LunaNeural", "Documentary Narrator · East/SE Asian English"),
    "satiation": ("Gabriel", "Dn7kHvEWEQXbRGLGqWJV", "en-US-AndrewMultilingualNeural", "Charismatic Host · Latino English"),
    "rce": ("Alice", "Xb7hH8MSUJpSbSDYk0k2", "en-GB-SoniaNeural", "Clear Educator · British English"),
    "rce-jepa": ("Jyothi", "QCzL5yD6UcwZgNMhRj6G", "en-IN-NeerjaNeural", "Warm Science Educator · South Asian English"),
    "rce-compile": ("Lem", "yWnF5eFXku7WqBV6sBto", "en-PH-JamesNeural", "Systems Engineer · Filipino English"),
    "rce-vc": ("River", "SAz9YHcvj6GT2YYXdXww", "en-US-AriaNeural", "Calm Informative · Gender-Neutral English"),
    "game-engines": ("Charlie", "IKne3meq5aSn9XLyUdCD", "en-AU-WilliamNeural", "Energetic Creator · Australian English"),
    "three-body": ("Bill", "pqHfZKP75CvOlQylNhV4", "en-US-ChristopherNeural", "Senior Narrator · North American English"),
    "ai-reads-human": ("Sean", "tRqj2rLkZmeP61CMmIX4", "en-IE-ConnorNeural", "Clear Educator · Irish English"),
    "spellcheck": ("Misha", "DXX4Q5Bh1vqK8CciYVPf", "en-US-AriaNeural", "Storytelling Narrator · African American English"),
    "ai-coding-market": ("Osato", "PFnEp0d5QKq6baWI3azv", "en-NG-AbeoNeural", "Smooth Narrator · Nigerian English"),
    "interface-economics": ("Edwin", "CMUEYyUNA4TrldQy4HLM", "en-US-GuyNeural", "Warm Storyteller · African American English"),
    "mei": ("Nylo", "GbDIo39THauInuigCmPM", "en-US-JennyNeural", "Systems Educator · African American English"),
    "jouleos": ("Bobby", "lGMJWfnL2SVUwU7i6zQ7", "en-US-BrianMultilingualNeural", "Commanding Baritone · African American English"),
    "latency": ("Julius", "VlUmeC1Uzj3NnwiVR9K9", "en-US-ChristopherNeural", "Conversational Host · African American English"),
    # 6 Flagship *.openie.dev Ecosystem Channel Openers
    "eco-avalanche": ("Cecily", "NQMJRVvPew6HsaebYnZj", "en-US-EmmaMultilingualNeural", "Documentary Host · African American English"),
    "eco-stack": ("Hakim", "EzoxNTKsg4JNN7wxAgut", "en-GB-ThomasNeural", "Confident Narrator · Middle Eastern English"),
    "eco-compute": ("Nylo", "GbDIo39THauInuigCmPM", "en-US-JennyNeural", "Systems Educator · African American English"),
    "eco-synthesis": ("Joy", "mzbNqbWwLuZObi7qEA67", "en-NG-EzinneNeural", "Warm Contralto · West African English"),
    "eco-knowledge": ("Julius", "VlUmeC1Uzj3NnwiVR9K9", "en-US-ChristopherNeural", "Conversational Host · African American English"),
    "eco-database": ("Osato", "PFnEp0d5QKq6baWI3azv", "en-NG-AbeoNeural", "Smooth Narrator · Nigerian English"),
}

TUTORIAL_LAB_MAP = {
    "agency": "lab-01-quorum-sepj",
    "gates": "lab-02-attested-orchestrator",
    "deterministic-null": "lab-07-deterministic-null",
    "satb-harness": "lab-07-deterministic-null",
    "time-as-an-index": "lab-10-time-index",
    "communication-avalanche": "lab-04-digital-enzymatic",
    "lut-adapt": "lab-09-lut6-benes",
    "satiation": "lab-07-deterministic-null",
    "rce": "lab-06-rce-world-coding",
    "rce-jepa": "lab-06-rce-world-coding",
    "rce-compile": "lab-06-rce-world-coding",
    "rce-vc": "lab-06-rce-world-coding",
    "game-engines": "lab-08-game-lockstep",
    "three-body": "lab-06-rce-world-coding",
    "ai-reads-human": "lab-02-attested-orchestrator",
    "spellcheck": "lab-03-ai-ratchet-winters",
    "ai-coding-market": "lab-04-digital-enzymatic",
    "interface-economics": "lab-02-attested-orchestrator",
    "mei": "lab-09-lut6-benes",
    "jouleos": "lab-09-lut6-benes",
    "latency": "lab-03-ai-ratchet-winters",
    # 6 Flagship *.openie.dev Ecosystem Channel Openers
    "eco-avalanche": "lab-04-digital-enzymatic",
    "eco-stack": "lab-01-quorum-sepj",
    "eco-compute": "lab-09-lut6-benes",
    "eco-synthesis": "lab-06-rce-world-coding",
    "eco-knowledge": "lab-10-time-index",
    "eco-database": "lab-08-game-lockstep",
}
