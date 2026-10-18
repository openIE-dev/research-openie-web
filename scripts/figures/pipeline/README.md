# AI race data pipeline

Replicates the data files in `scripts/figures/latency_data/` from public sources.

1. `fetch.py key=url ...` downloads a source into `src/<key>.raw` and extracts text to `src/<key>.txt`. Send a descriptive User-Agent with a contact address to sec.gov.
2. `xbrl_fetch.py` and `xbrl_annual.py` pull annual capital expenditure and operating cash flow from the SEC XBRL company concept API into `capex_ocf.csv`.
3. `build_data.py` reads the Epoch AI CC BY datasets (notable models, data centers, ML hardware) and writes the small CSV and JSON files used by the figures.
4. `model_airace.py` computes the model outputs (bounds, break-even shares, accelerator-hour costs, price decomposition) into `model_outputs.json`.
5. `python3 scripts/figures/latency_figures.py` draws every figure from those files.

The paths in these scripts are relative to a working folder that holds `src/` and `data/`. Sources and the evidence class of each are in `docs/latency-study/SOURCE_LEDGER.csv`.
