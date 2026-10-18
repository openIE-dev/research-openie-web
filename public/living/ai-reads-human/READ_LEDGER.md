# READ LEDGER: "AI" Reads Human (rebuilt 2026-10-18, box clock ET)

Legend: FULL = every line of the retrieved text read in tool output. PARTIAL = only listed passages read; only those are cited. UNAVAILABLE = paywalled or not retrievable; listed, not cited.
Status for rows marked "dossier" is inherited from the earlier read ledger at the earlier project read ledger (rows S01..S85) and was NOT re-read in this rebuild. Rows marked "re-read" were read again on 2026-10-18 for the passages named.
HTML sources were read as tag-stripped text; figures in them were not read.

| Source | Identifier | Status | Passages cited | Basis |
|---|---|---|---|---|
| JSON, RFC 8259 | rfc-editor.org/rfc/rfc8259 | FULL | defn, sec 4, 6, 8.2, 9 | dossier S01 |
| I-JSON, RFC 7493 | rfc-editor.org/rfc/rfc7493 | FULL | abstract, sec 2.2 | dossier S02 |
| JCS, RFC 8785 | rfc-editor.org/rfc/rfc8785 | FULL | sec 3.2.3 | dossier S03 |
| CBOR, RFC 8949 | rfc-editor.org/rfc/rfc8949 | FULL (every section read across passes) | sec 4.2 | dossier S06 |
| CSV, RFC 4180 | rfc-editor.org/rfc/rfc4180 | FULL (IPR tail unread) | sec 1 | dossier S07 |
| CommonMark 0.31.2 | spec.commonmark.org/0.31.2 | FULL (text view) | sec 1.1, 1.2 | dossier S10 |
| YAML 1.2.2 | yaml.org/spec/1.2.2 | re-read PARTIAL (sec 1.1 Goals, line 199-201 of src text); dossier says FULL but its composite row S12.r5 lists bytes 0-51,145 as not verified at line level | sec 1.1 | re-read + dossier S12 |
| TOML 1.0.0 | toml.md + toml.abnf | FULL | integer range rule | dossier S13 |
| Protocol Buffers encoding guide | protobuf.dev/programming-guides/encoding | re-read PARTIAL (the "Implications" passage on stable byte output); dossier row S?? in local text extract | "Do not assume the byte output ... is stable" | re-read 2026-10-18 |
| OWASP CSV Injection | owasp.org/www-community/attacks/CSV_Injection | FULL | whole page | dossier S80 |
| tex.web (Knuth) | mirrors.ctan.org/systems/knuth/dist/tex/tex.web | PARTIAL: header (lines 1-154) and bytes 0-19,000 read; remainder read in dossier row S72.3.c1 but cited for nothing here | "Version 0 was released in September 1982" (line 12) | re-read + dossier |
| Samsi et al., From Words to Watts | arXiv:2310.03003 | re-read PARTIAL (abstract, intro, sec III setup, energy definitions, sec IV-C "about 3-4 Joules for a output token"); text lines 1-478 extracted, sections used read | energy def (DCGM, rank-0 x nodes), 3-4 J/token at length 512 | re-read 2026-10-18, local text extract |
| Luccioni, Jernite, Strubell, Power Hungry Processing | DOI 10.1145/3630106.3658542, arXiv:2311.16863 | re-read PARTIAL (setup, 8x A100-SXM4-80GB AWS node, CodeCarbon, Table 2) | Table 2: text classification 0.002, text generation 0.047 kWh per 1,000 | re-read 2026-10-18, local text extract (arXiv version only; the ACM page returned HTTP 403, so the ACM text is UNAVAILABLE and the match is unverified; DOI, title and venue confirmed through Crossref) |
| Physical constant k_B = 1.380649e-23 J/K | physics.nist.gov/cgi-bin/cuu/Value?k (CODATA 2022, exact) | FULL (page) | value of k_B | read 2026-10-18; the SI Brochure itself was not read; Landauer 1961 UNAVAILABLE (paywalled) |

## UNAVAILABLE / paywalled (listed, not cited for any claim)
| Item | Identifier |
|---|---|
| ISO 32000-1:2008 PDF | ISO catalogue (paywalled) |
| ISO/IEC 29500 Office Open XML | ISO/IEC 29500 (ECMA-376 free equivalent only partly read) |
| ISO/IEC 26300 OpenDocument | ISO/IEC 26300 (OASIS ODF 1.3 Part 1 read) |
| IEEE 754-2019 | DOI 10.1109/IEEESTD.2019.8766229 |
| Sennrich, Haddow, Birch, Neural Machine Translation of Rare Words with Subword Units | DOI 10.18653/v1/P16-1162 |
| Landauer, Irreversibility and heat generation in the computing process | DOI 10.1147/rd.53.0183 |
| Horowitz, Computing's energy problem (ISSCC 2014) | DOI 10.1109/ISSCC.2014.6757323; source of the quoted 640 pJ/32-bit DRAM read; NOT read, NOT used |
| Strubell et al. 2019; Patterson et al. 2021, 2022; Wu et al. 2021 | cited only inside Samsi and Luccioni; not read; no claim made |
| The TeXbook | ISBN 978-0-201-13447-6 |
| Unicode Standard / UAX #15; ECMA-262 | not fetched |

## Not measured here (so not claimed)
Joules of any kind (VM has no RAPL, perf cycles unsupported; data/ENV.txt). Model energy figures above are other authors' measurements on their hardware.
