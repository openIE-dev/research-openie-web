"""Build a numpy dtype from a PDS3 .FMT column file (UVVSSUMD.FMT / UVVSSCID.FMT).

Only the column types used by the MASCS UVVS atmosphere DDRs are supported:
CHARACTER, MSB_UNSIGNED_INTEGER, IEEE_REAL (big-endian), with ITEMS for vectors.
START_BYTE is 1-based; the dtype is built with explicit offsets.
"""
import re
import numpy as np


def parse_fmt(path):
    txt = open(path, encoding="latin-1").read()
    cols = []
    for block in re.findall(r"OBJECT\s*=\s*COLUMN(.*?)END_OBJECT", txt, re.S):
        d = {}
        for k in ("NAME", "BYTES", "DATA_TYPE", "START_BYTE", "ITEMS", "ITEM_BYTES"):
            m = re.search(r"\b%s\s*=\s*([^\s]+)" % k, block)
            if m:
                d[k] = m.group(1).strip('"')
        cols.append(d)
    return cols


def dtype_from_fmt(path, row_bytes):
    names, formats, offsets = [], [], []
    for c in parse_fmt(path):
        nb = int(c["BYTES"]); dt = c["DATA_TYPE"]; items = int(c.get("ITEMS", 1))
        ib = int(c.get("ITEM_BYTES", nb))
        if dt == "CHARACTER":
            f = "S%d" % nb
        elif dt == "MSB_UNSIGNED_INTEGER":
            f = ">u%d" % ib
        elif dt == "IEEE_REAL":
            f = ">f%d" % ib
        else:
            raise ValueError(dt)
        if items > 1:
            f = (f, (items,))
        names.append(c["NAME"]); formats.append(f); offsets.append(int(c["START_BYTE"]) - 1)
    return np.dtype({"names": names, "formats": formats, "offsets": offsets, "itemsize": row_bytes})


def read_table(dat_path, fmt_path, row_bytes):
    dt = dtype_from_fmt(fmt_path, row_bytes)
    raw = open(dat_path, "rb").read()
    if len(raw) % row_bytes:
        raise ValueError("size %d not multiple of %d" % (len(raw), row_bytes))
    return np.frombuffer(raw, dtype=dt)
