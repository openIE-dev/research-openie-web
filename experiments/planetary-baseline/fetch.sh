#!/usr/bin/env bash
# Download the public series used by Study 1 into data/ and record SHA-256 sums.
# The committed copies in data/ are the ones the committed results were computed from.
set -euo pipefail
cd "$(dirname "$0")/data"
get() { curl -sSfL --retry 3 --max-time 120 -o "$1" "$2"; echo "$2" > "$1.url"; }
get hadcrut5.csv  "https://www.metoffice.gov.uk/hadobs/hadcrut5/data/HadCRUT.5.0.2.0/analysis/diagnostics/HadCRUT.5.0.2.0.analysis.summary_series.global.monthly.csv"
get gistemp.csv   "https://data.giss.nasa.gov/gistemp/tabledata_v4/GLB.Ts+dSST.csv"
get noaa.csv      "https://www.ncei.noaa.gov/access/monitoring/climate-at-a-glance/global/time-series/globe/land_ocean/1/0/1850-2026/data.csv"
get berkeley.txt  "https://berkeley-earth-temperature.s3.us-west-1.amazonaws.com/Global/Land_and_Ocean_complete.txt"
get co2_mlo.txt   "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.txt"
get nino34.txt    "https://psl.noaa.gov/data/correlation/nina34.anom.data"
date -u +%Y-%m-%dT%H:%M:%SZ > FETCHED_AT
sha256sum *.csv *.txt > SHA256SUMS
