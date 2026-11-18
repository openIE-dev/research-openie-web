"""Stream-and-reduce MESSENGER MASCS/UVVS Na atmosphere DDRs (PDS volume MESSMAS_2101).

Manifest: md5_na.txt = lines of index/md5.tab matching data\\ddr\\...\\*_na.dat
(2863 orbit-level summary files UVVSDNASUM + 54 geometry-classified files
UVVSDNALS/LD/NS).

For each file: curl into the download dir, verify MD5, parse with the PDS .FMT
(uvvssumd.fmt for summaries, uvvsscid.fmt for LS/LD/NS), keep only scalar
per-spectrum columns (drop 25-element spectra), save .npz in reduced/, delete raw.
Resumable: skips files whose .npz exists.

Usage: python3 -I fetch_reduce.py <workdir> [nthreads]
  workdir must contain md5_na.txt, uvvssumd.fmt, uvvsscid.fmt; creates raw/ and reduced/.
"""
import hashlib
import os
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
import pdsfmt

BASE = "https://atmos.nmsu.edu/PDS/data/messmas_2101/"
KEEP = ["OBSERVATION_TYPE", "CDR_NAME", "OBS_SEQUENCE_INDEX", "PLANET_SUN_VECTOR_TG",
        "PLANET_SC_VECTOR_TG", "BORESIGHT_UNIT_VECTOR_CENTER_TG", "TARGET_LATITUDE",
        "TARGET_LONGITUDE", "TARGET_ALTITUDE", "TARGET_LOCAL_TIME", "SUBSPACECRAFT_LATITUDE",
        "SUBSPACECRAFT_LONGITUDE", "SPACECRAFT_ALTITUDE", "SPACECRAFT_LOCAL_TIME",
        "SUBSOLAR_LATITUDE", "SUBSOLAR_LONGITUDE", "PLANET_TRUE_ANOMALY", "ORBIT_NUMBER",
        "MID_SPECTRUM_TIME", "UTC_TIME", "TOTAL_RADIANCE_KR", "TOTAL_RADIANCE_SNR", "SLIT_POS",
        "SPARE_1", "SPARE_2", "SPARE_3", "SPARE_4"]


def main():
    work = os.path.abspath(sys.argv[1])
    nthr = int(sys.argv[2]) if len(sys.argv) > 2 else 4
    raw = os.path.join(work, "raw"); red = os.path.join(work, "reduced")
    os.makedirs(raw, exist_ok=True); os.makedirs(red, exist_ok=True)
    man = []
    for line in open(os.path.join(work, "md5_na.txt")):
        md5, path = line.split()[:2]
        man.append((md5, path.replace("\\", "/")))
    fmt_sum = os.path.join(work, "uvvssumd.fmt"); fmt_geo = os.path.join(work, "uvvsscid.fmt")
    log = open(os.path.join(work, "fetch_log.tsv"), "a")

    def job(item):
        md5, rel = item
        name = os.path.basename(rel)
        out = os.path.join(red, name.replace(".dat", ".npz"))
        if os.path.exists(out):
            return name, "skip", 0, 0
        dst = os.path.join(raw, name)
        for attempt in range(4):
            r = subprocess.run(["curl", "-sS", "--fail", "-o", dst, BASE + rel], capture_output=True)
            if r.returncode == 0:
                h = hashlib.md5(open(dst, "rb").read()).hexdigest()
                if h == md5:
                    break
            time.sleep(3 * (attempt + 1))
        else:
            return name, "FAIL " + r.stderr.decode()[:200], 0, 0
        nbytes = os.path.getsize(dst)
        summary = "summary" in name
        t = pdsfmt.read_table(dst, fmt_sum if summary else fmt_geo, 908 if summary else 910)
        d = {k: np.array(t[k]) for k in KEEP if k in t.dtype.names}
        wl = np.array(t["WAVELENGTH"]); d["N_SPEC_POINTS"] = (wl != 0).sum(1).astype(np.int16)
        np.savez_compressed(out + ".tmp.npz", **d)
        os.replace(out + ".tmp.npz", out)
        os.remove(dst)
        return name, "ok", nbytes, len(t)

    tot = 0; n = 0; t0 = time.time()
    with ThreadPoolExecutor(nthr) as ex:
        for name, st, nb, nr in ex.map(job, man):
            tot += nb; n += 1
            log.write("%s\t%s\t%d\t%d\n" % (name, st, nb, nr)); log.flush()
            if n % 100 == 0 or st.startswith("FAIL"):
                print(n, len(man), name, st, "%.0f MB" % (tot / 1e6), "%.0fs" % (time.time() - t0), flush=True)
    print("done", n, "%.1f MB downloaded" % (tot / 1e6))


if __name__ == "__main__":
    main()
