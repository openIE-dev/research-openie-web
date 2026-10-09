#!/bin/bash
# v2 on jetson-hub (PREREGISTRATION_v2_jetson.md). Run as root: sudo -n bash jetson_run.sh
# 1 save frequency settings, pin (turbo off, min = max = base on every CPU), trap restores on exit
# 2 load sampler as its own process on CPU 19; probes for a quiet window (others <= 0.5 cores),
#   every 90 s, at most MAXP probes, then runs anyway with quiet_window=no
# 3 pilot on CPU 4; waits for pilot_jetson/COMMITTED (written after the pilot is committed in git)
# 4 main run on CPU 4; analysis; frequency restored; files chowned to dcharlot
# Never stops, pauses or renices another process.
set -u
cd "$(dirname "$0")"
OWNER=${OWNER:-dcharlot}
MAXP=${MAXP:-40}
mkdir -p results_jetson pilot_jetson
[ -f results_jetson/freq_orig.json ] || python3 run2_jetson.py freqsave results_jetson/freq_orig.json
restore() {
  python3 run2_jetson.py freqrestore results_jetson/freq_orig.json > results_jetson/freq_restored.json
  touch results_jetson/STOP_PS; sleep 1; kill "${PSPID:-0}" 2>/dev/null
  chown -R "$OWNER": results_jetson pilot_jetson
  echo "RESTORED $(date '+%H:%M:%S')"
}
trap restore EXIT
python3 run2_jetson.py freqpin > results_jetson/freq_pinned.json
echo "PINNED $(date '+%H:%M:%S')"
rm -f results_jetson/STOP_PS
taskset -c 19 python3 run2_jetson.py ps & PSPID=$!
QUIET=no
for i in $(seq 1 "$MAXP"); do
  if taskset -c 18 python3 run2_jetson.py probe >> results_jetson/load_probe.jsonl; then QUIET=yes; break; fi
  echo "probe $i not quiet $(date '+%H:%M:%S')"
  [ "$i" -lt "$MAXP" ] && sleep 90
done
echo "QUIET=$QUIET start $(date '+%Y-%m-%d %H:%M:%S')"
echo "$QUIET" > results_jetson/quiet_window.txt
if [ ! -f pilot_jetson/locked.json ]; then
  taskset -c 4 python3 run2_jetson.py pilot > results_jetson/pilot.log 2>&1 || { echo PILOT_FAILED; exit 1; }
fi
chown -R "$OWNER": pilot_jetson
echo "PILOT_DONE $(date '+%H:%M:%S')"
for i in $(seq 1 180); do [ -f pilot_jetson/COMMITTED ] && break; sleep 10; done
[ -f pilot_jetson/COMMITTED ] || { echo NO_PILOT_COMMIT; exit 1; }
echo "PILOT_COMMIT $(cat pilot_jetson/COMMITTED)"
taskset -c 4 python3 run2_jetson.py main "$QUIET" > results_jetson/main.log 2>&1 || { echo MAIN_FAILED; exit 1; }
echo "MAIN_DONE $(date '+%H:%M:%S')"
taskset -c 19 python3 analyze2_jetson.py > results_jetson/analyze.log 2>&1 || echo ANALYZE_FAILED
echo "DONE QUIET=$QUIET $(date '+%Y-%m-%d %H:%M:%S')"
