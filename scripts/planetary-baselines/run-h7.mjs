#!/usr/bin/env node
// BL-H7, registered after BL-H1 was killed and before this script was first run.
//
// BL-H1 missed the westerly drift on all 8 seeds although withholding it changes
// about 47% of cells per tick: the drift moves vapour and heat east, so its effect on
// a cell follows the difference between the cell and its western neighbour, and the
// local candidates of BL-H1 average it away. BL-H7 asks whether adding transport
// candidates fixes that, on seeds not used before.
//
// Protocol: exactly BL-H1's (scripts/planetary-baselines/protocol.mjs), with
// - seeds 208 to 215;
// - two extra candidates: dqWest = q(west neighbour) - q, dTWest = T(west neighbour) - T;
// - accepted pairs for the westerly drift extended with (q, dqWest) and (T, dTWest);
//   other processes' accepted pairs unchanged.
// Kill: westerly found in fewer than 6 of 8 seeds; or structure in more than 1 of 8 null
// seeds; or altitude cooling found in fewer than 75% of its eligible seeds (a check that
// the new candidates do not break what worked). Orographic condensation and erosion are
// reported and not scored here.
//
//   node scripts/planetary-baselines/run-h7.mjs   # writes docs/planetary-baselines/results/h7.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runProtocol, BASE_ACCEPT } from './protocol.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const accept = { ...BASE_ACCEPT, westerly: [...BASE_ACCEPT.westerly, ['q', 'dqWest'], ['T', 'dTWest']] };
const r = runProtocol({ seeds: [208, 209, 210, 211, 212, 213, 214, 215], extraCands: ['dqWest', 'dTWest'], accept, label: 'BL-H7' });

const rows = (p) => r.rows.filter((x) => x.process === p);
const west = rows('westerly').filter((x) => x.found).length;
const alt = rows('altitudeCooling').filter((x) => x.eligible), altFound = alt.filter((x) => x.found).length;
const nullStruct = r.nulls.filter((n) => n.structure).length;
const killed = west < 6 || nullStruct > 1 || altFound < 0.75 * alt.length;
r.verdict = { hypothesis: 'BL-H7', westerlyFound: west, of: 8, nullSeedsWithStructure: nullStruct, altitudeCoolingFound: `${altFound} of ${alt.length} eligible`, result: killed ? 'killed' : 'survives this test' };
console.log(JSON.stringify(r.verdict));
const out = path.join(ROOT, 'docs/planetary-baselines/results');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'h7.json'), JSON.stringify(r, null, 1) + '\n');
