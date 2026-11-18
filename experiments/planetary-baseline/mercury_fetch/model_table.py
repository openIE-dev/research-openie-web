"""Convert UVVS Na atmospheric model DDR (UD_NA_MOD.TAB, UVVSDNAMOD) to CSV. Usage: python3 -I model_table.py in.tab out.csv"""
import sys
cols = ["taa_bin_center_deg", "local_time_h", "n0_cm3", "n0_sigma_cm3", "T_K", "T_sigma_K", "scale_height_km"]
with open(sys.argv[2], "w") as f:
    f.write(",".join(cols) + "\n")
    for line in open(sys.argv[1]):
        v = [x.strip() for x in line.split(",")]
        if len(v) >= 7:
            f.write(",".join(v[:7]) + "\n")
