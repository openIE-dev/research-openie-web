/* Generated from executed CTA-E1..E3 hardware artifacts + DES-10 5-host synthesis */
window.CTA_ORCH_DATA = {
  "prereg_sha256": "5739bcdd6c35662833a470bc56bd64f991774c2d920a5a9c059c0acebdf55e7f",
  "cost_lut": {
    "hw_profile": "intel_core_i9_13900h_rapl",
    "crypto_channel_benchmarks": [
      {
        "iterations": 50000,
        "payload_bytes": 64,
        "sign_core_uj_per_op": 243.83238,
        "sign_mean_ns": 10121.7832,
        "sign_p50_ns": 10117,
        "sign_p99_ns": 12465,
        "sign_pkg_uj_per_op": 287.45898,
        "sign_psys_uj_per_op": 2.05566,
        "verified_ok": 50000,
        "verify_core_uj_per_op": 543.64972,
        "verify_mean_ns": 26048.81394,
        "verify_p50_ns": 25954,
        "verify_p99_ns": 27486,
        "verify_pkg_uj_per_op": 643.0257,
        "verify_psys_uj_per_op": 5.26122
      },
      {
        "iterations": 50000,
        "payload_bytes": 1024,
        "sign_core_uj_per_op": 227.82534,
        "sign_mean_ns": 10574.2549,
        "sign_p50_ns": 10614,
        "sign_p99_ns": 11947,
        "sign_pkg_uj_per_op": 268.11576,
        "sign_psys_uj_per_op": 2.1411,
        "verified_ok": 50000,
        "verify_core_uj_per_op": 546.58428,
        "verify_mean_ns": 27354.25354,
        "verify_p50_ns": 27044,
        "verify_p99_ns": 28727,
        "verify_pkg_uj_per_op": 650.59404,
        "verify_psys_uj_per_op": 5.54564
      },
      {
        "iterations": 50000,
        "payload_bytes": 16384,
        "sign_core_uj_per_op": 267.7276,
        "sign_mean_ns": 12620.111,
        "sign_p50_ns": 12601,
        "sign_p99_ns": 13418,
        "sign_pkg_uj_per_op": 316.32244,
        "sign_psys_uj_per_op": 2.5537,
        "verified_ok": 50000,
        "verify_core_uj_per_op": 584.06832,
        "verify_mean_ns": 29362.28722,
        "verify_p50_ns": 29317,
        "verify_p99_ns": 30438,
        "verify_pkg_uj_per_op": 696.1591,
        "verify_psys_uj_per_op": 5.9509
      },
      {
        "iterations": 50000,
        "payload_bytes": 65536,
        "sign_core_uj_per_op": 458.58402,
        "sign_mean_ns": 21632.51182,
        "sign_p50_ns": 21607,
        "sign_p99_ns": 22508,
        "sign_pkg_uj_per_op": 540.7762,
        "sign_psys_uj_per_op": 4.41526,
        "verified_ok": 50000,
        "verify_core_uj_per_op": 784.95282,
        "verify_mean_ns": 37473.33096,
        "verify_p50_ns": 37393,
        "verify_p99_ns": 39537,
        "verify_pkg_uj_per_op": 926.41852,
        "verify_psys_uj_per_op": 7.6062
      }
    ],
    "entries": [
      {
        "node_id": "parse_kernel",
        "input_size_bucket": "small_<320B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 1.580195,
        "core_reported_mj": 0.8633399999999999,
        "psys_reported_mj": 0.023804999999999996,
        "mean_latency_ms": 0.11917140043806285,
        "ssp_edge_cost_uj": 1580
      },
      {
        "node_id": "static_type_scope_kernel",
        "input_size_bucket": "small_<320B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 1.095575,
        "core_reported_mj": 0.8923300000000001,
        "psys_reported_mj": 0.006715,
        "mean_latency_ms": 0.031276950030587614,
        "ssp_edge_cost_uj": 1096
      },
      {
        "node_id": "test_gen_kernel",
        "input_size_bucket": "small_<320B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 0.309145,
        "core_reported_mj": 0.25878999999999996,
        "psys_reported_mj": 0.002135,
        "mean_latency_ms": 0.012504205224104226,
        "ssp_edge_cost_uj": 309
      },
      {
        "node_id": "det_patch_kernel",
        "input_size_bucket": "small_<320B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 11.565215,
        "core_reported_mj": 9.8364,
        "psys_reported_mj": 0.08423,
        "mean_latency_ms": 0.4208139848196879,
        "ssp_edge_cost_uj": 11565
      },
      {
        "node_id": "diff_verifier_kernel",
        "input_size_bucket": "small_<320B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 1.185605,
        "core_reported_mj": 1.00921,
        "psys_reported_mj": 0.009460000000000001,
        "mean_latency_ms": 0.04318065999541432,
        "ssp_edge_cost_uj": 1186
      },
      {
        "node_id": "parse_kernel",
        "input_size_bucket": "medium_320B_640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 1.379695,
        "core_reported_mj": 1.15753,
        "psys_reported_mj": 0.011595,
        "mean_latency_ms": 0.05690311489161104,
        "ssp_edge_cost_uj": 1380
      },
      {
        "node_id": "static_type_scope_kernel",
        "input_size_bucket": "medium_320B_640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 0.6372099999999999,
        "core_reported_mj": 0.545045,
        "psys_reported_mj": 0.00519,
        "mean_latency_ms": 0.029257460264489055,
        "ssp_edge_cost_uj": 637
      },
      {
        "node_id": "test_gen_kernel",
        "input_size_bucket": "medium_320B_640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 0.361325,
        "core_reported_mj": 0.303955,
        "psys_reported_mj": 0.002745,
        "mean_latency_ms": 0.013329159701243043,
        "ssp_edge_cost_uj": 361
      },
      {
        "node_id": "det_patch_kernel",
        "input_size_bucket": "medium_320B_640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 15.734214999999999,
        "core_reported_mj": 13.345910000000002,
        "psys_reported_mj": 0.12267999999999998,
        "mean_latency_ms": 0.6016038596862927,
        "ssp_edge_cost_uj": 15734
      },
      {
        "node_id": "diff_verifier_kernel",
        "input_size_bucket": "medium_320B_640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 1.118465,
        "core_reported_mj": 0.94696,
        "psys_reported_mj": 0.009155,
        "mean_latency_ms": 0.04766572965309024,
        "ssp_edge_cost_uj": 1118
      },
      {
        "node_id": "parse_kernel",
        "input_size_bucket": "large_>640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 4.72533,
        "core_reported_mj": 4.01183,
        "psys_reported_mj": 0.039674999999999995,
        "mean_latency_ms": 0.19037978549022228,
        "ssp_edge_cost_uj": 4725
      },
      {
        "node_id": "static_type_scope_kernel",
        "input_size_bucket": "large_>640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 13.80215,
        "core_reported_mj": 11.704985,
        "psys_reported_mj": 0.11169000000000001,
        "mean_latency_ms": 0.5535457050427794,
        "ssp_edge_cost_uj": 13802
      },
      {
        "node_id": "test_gen_kernel",
        "input_size_bucket": "large_>640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 0.35034000000000004,
        "core_reported_mj": 0.292665,
        "psys_reported_mj": 0.003055,
        "mean_latency_ms": 0.015097459545359015,
        "ssp_edge_cost_uj": 350
      },
      {
        "node_id": "det_patch_kernel",
        "input_size_bucket": "large_>640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 45.22724,
        "core_reported_mj": 38.619285,
        "psys_reported_mj": 0.34820499999999993,
        "mean_latency_ms": 1.7236245248932391,
        "ssp_edge_cost_uj": 45227
      },
      {
        "node_id": "diff_verifier_kernel",
        "input_size_bucket": "large_>640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 200,
        "pkg_reported_mj": 5.71257,
        "core_reported_mj": 4.902635,
        "psys_reported_mj": 0.043030000000000006,
        "mean_latency_ms": 0.2085885696578771,
        "ssp_edge_cost_uj": 5713
      },
      {
        "node_id": "llm_patch_proposer",
        "input_size_bucket": "small_<320B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 0,
        "basis": "escalation_penalty_weight (local socket wait + remote API escalation)",
        "ssp_edge_cost_uj": 12500000
      },
      {
        "node_id": "llm_patch_proposer",
        "input_size_bucket": "medium_320B_640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 0,
        "basis": "escalation_penalty_weight (local socket wait + remote API escalation)",
        "ssp_edge_cost_uj": 14375000
      },
      {
        "node_id": "llm_patch_proposer",
        "input_size_bucket": "large_>640B",
        "hw_profile": "intel_core_i9_13900h_rapl",
        "samples": 0,
        "basis": "escalation_penalty_weight (local socket wait + remote API escalation)",
        "ssp_edge_cost_uj": 16875000
      }
    ]
  },
  "e1": {
    "window_s_target": 10.0,
    "replicates": 5,
    "pre_idle_baseline": {
      "core_idle_w": 0.17186493521495996,
      "core_reported_j": 0.861021,
      "pkg_idle_w": 3.9464230826955817,
      "pkg_reported_j": 19.771067,
      "psys_idle_w": 0.20336994370440262,
      "psys_reported_j": 1.018857,
      "window_s": 5.009870099
    },
    "post_idle_baseline": {
      "core_idle_w": 16.118245545893124,
      "core_reported_j": 80.713233,
      "pkg_idle_w": 20.1345427626984,
      "pkg_reported_j": 100.82512,
      "psys_idle_w": 0.21404316480456062,
      "psys_reported_j": 1.071836,
      "window_s": 5.007569389
    },
    "falsifier_6_idle_drift_pct": 410.19726828035925,
    "summary_by_duty_and_regime": {
      "duty_01pct": {
        "event_threshold": {
          "replicates": 5,
          "mean_pkg_reported_j": 136.3247,
          "mean_core_reported_j": 96.236,
          "mean_psys_reported_j": 2.0295,
          "mean_pkg_w": 13.6318,
          "mean_node_wakeups": 559.4,
          "mean_empty_polling_wakeups": 0.0,
          "mean_total_ctxt_switches": 811.4,
          "mean_events_committed": 51.0,
          "mean_latency_p50_ms": 2.577,
          "mean_latency_p99_ms": 1016.1827
        },
        "poll_10hz": {
          "replicates": 5,
          "mean_pkg_reported_j": 143.416,
          "mean_core_reported_j": 103.7591,
          "mean_psys_reported_j": 2.0427,
          "mean_pkg_w": 14.3412,
          "mean_node_wakeups": 1600.0,
          "mean_empty_polling_wakeups": 1284.8,
          "mean_total_ctxt_switches": 1963.0,
          "mean_events_committed": 50.8,
          "mean_latency_p50_ms": 570.3765,
          "mean_latency_p99_ms": 1354.163
        },
        "poll_100hz": {
          "replicates": 5,
          "mean_pkg_reported_j": 198.5134,
          "mean_core_reported_j": 157.3519,
          "mean_psys_reported_j": 2.0589,
          "mean_pkg_w": 19.851,
          "mean_node_wakeups": 15799.8,
          "mean_empty_polling_wakeups": 15475.6,
          "mean_total_ctxt_switches": 16156.2,
          "mean_events_committed": 51.0,
          "mean_latency_p50_ms": 55.2219,
          "mean_latency_p99_ms": 1057.9293
        },
        "poll_1000hz": {
          "replicates": 5,
          "mean_pkg_reported_j": 300.7254,
          "mean_core_reported_j": 259.172,
          "mean_psys_reported_j": 2.0801,
          "mean_pkg_w": 30.0722,
          "mean_node_wakeups": 150139.8,
          "mean_empty_polling_wakeups": 149844.2,
          "mean_total_ctxt_switches": 150574.8,
          "mean_events_committed": 51.0,
          "mean_latency_p50_ms": 7.3417,
          "mean_latency_p99_ms": 1015.2971
        }
      },
      "duty_05pct": {
        "event_threshold": {
          "replicates": 5,
          "mean_pkg_reported_j": 318.7767,
          "mean_core_reported_j": 275.3401,
          "mean_psys_reported_j": 2.5185,
          "mean_pkg_w": 31.8768,
          "mean_node_wakeups": 2792.6,
          "mean_empty_polling_wakeups": 0.0,
          "mean_total_ctxt_switches": 2603.8,
          "mean_events_committed": 255.0,
          "mean_latency_p50_ms": 2.7515,
          "mean_latency_p99_ms": 208.1208
        },
        "poll_10hz": {
          "replicates": 5,
          "mean_pkg_reported_j": 315.2359,
          "mean_core_reported_j": 274.7613,
          "mean_psys_reported_j": 2.5382,
          "mean_pkg_w": 31.5226,
          "mean_node_wakeups": 1598.6,
          "mean_empty_polling_wakeups": 335.0,
          "mean_total_ctxt_switches": 1965.2,
          "mean_events_committed": 253.6,
          "mean_latency_p50_ms": 558.2609,
          "mean_latency_p99_ms": 766.1966
        },
        "poll_100hz": {
          "replicates": 5,
          "mean_pkg_reported_j": 331.8406,
          "mean_core_reported_j": 290.2273,
          "mean_psys_reported_j": 2.5632,
          "mean_pkg_w": 33.1834,
          "mean_node_wakeups": 15795.0,
          "mean_empty_polling_wakeups": 14132.2,
          "mean_total_ctxt_switches": 16173.6,
          "mean_events_committed": 255.0,
          "mean_latency_p50_ms": 51.9827,
          "mean_latency_p99_ms": 254.3962
        },
        "poll_1000hz": {
          "replicates": 5,
          "mean_pkg_reported_j": 406.7508,
          "mean_core_reported_j": 360.5018,
          "mean_psys_reported_j": 2.6086,
          "mean_pkg_w": 40.6747,
          "mean_node_wakeups": 149823.8,
          "mean_empty_polling_wakeups": 148335.8,
          "mean_total_ctxt_switches": 150240.0,
          "mean_events_committed": 255.0,
          "mean_latency_p50_ms": 7.46,
          "mean_latency_p99_ms": 216.5687
        }
      },
      "duty_20pct": {
        "event_threshold": {
          "replicates": 5,
          "mean_pkg_reported_j": 236.4347,
          "mean_core_reported_j": 196.0681,
          "mean_psys_reported_j": 2.3864,
          "mean_pkg_w": 23.6424,
          "mean_node_wakeups": 10260.8,
          "mean_empty_polling_wakeups": 0.0,
          "mean_total_ctxt_switches": 9002.4,
          "mean_events_committed": 1020.0,
          "mean_latency_p50_ms": 2.7577,
          "mean_latency_p99_ms": 55.1937
        },
        "poll_10hz": {
          "replicates": 5,
          "mean_pkg_reported_j": 231.4477,
          "mean_core_reported_j": 186.8988,
          "mean_psys_reported_j": 2.3736,
          "mean_pkg_w": 23.1442,
          "mean_node_wakeups": 1582.0,
          "mean_empty_polling_wakeups": 81.0,
          "mean_total_ctxt_switches": 2046.2,
          "mean_events_committed": 999.6,
          "mean_latency_p50_ms": 547.6219,
          "mean_latency_p99_ms": 721.7426
        },
        "poll_100hz": {
          "replicates": 5,
          "mean_pkg_reported_j": 234.0449,
          "mean_core_reported_j": 188.8943,
          "mean_psys_reported_j": 2.3517,
          "mean_pkg_w": 23.4039,
          "mean_node_wakeups": 15649.6,
          "mean_empty_polling_wakeups": 9280.2,
          "mean_total_ctxt_switches": 16117.0,
          "mean_events_committed": 1019.8,
          "mean_latency_p50_ms": 52.0734,
          "mean_latency_p99_ms": 99.5403
        },
        "poll_1000hz": {
          "replicates": 5,
          "mean_pkg_reported_j": 269.1272,
          "mean_core_reported_j": 223.8711,
          "mean_psys_reported_j": 2.3227,
          "mean_pkg_w": 26.9124,
          "mean_node_wakeups": 148023.6,
          "mean_empty_polling_wakeups": 142013.6,
          "mean_total_ctxt_switches": 148638.2,
          "mean_events_committed": 1020.0,
          "mean_latency_p50_ms": 7.4304,
          "mean_latency_p99_ms": 59.3936
        }
      }
    }
  },
  "e2": {
    "experiment": "CTA-E2",
    "corpus_tasks": 60,
    "episodes_total": 240,
    "corpus_sha256": "b4ea0228270b8e6ae06f935fe8b92ed45cf2da4d9aa0d4868d0a42d4e6e9e802",
    "model_id": "claude-sonnet-5-5",
    "board_metered": false,
    "measured_j": null,
    "psys_oem_stub_note": "On this Intel Core i9-13900H host, intel-rapl:0 (package-0) and intel-rapl:0:0 (core) report dynamic CPU/SoC energy (~5.0 W idle to ~28 W 1-core load), whereas intel-rapl:1 (psys) reports a fixed ~0.20 W OEM EC stub; primary Coherence per Joule uses pkg_reported_j while all three rails are preserved verbatim.",
    "pre_idle_baseline": {
      "window_s": 5.01171017694287,
      "pkg_reported_j": 30.575666000000002,
      "core_reported_j": 10.945590000000001,
      "psys_reported_j": 1.0158049999999998,
      "pkg_idle_w": 6.100844805565169,
      "core_idle_w": 2.1840029877140226,
      "psys_idle_w": 0.2026863015090865
    },
    "post_idle_baseline": {
      "window_s": 5.010473250062205,
      "pkg_reported_j": 27.531546,
      "core_reported_j": 8.558266,
      "psys_reported_j": 1.020627,
      "pkg_idle_w": 5.494799518121007,
      "core_idle_w": 1.7080753798842752,
      "psys_idle_w": 0.20369872246844725
    },
    "falsifier_6_idle_drift_pct": 9.934,
    "falsifier_6_withhold_net_subtraction": false,
    "ssp_epoch0_schedule": {
      "active_edges": [
        {
          "edge_id": "e0",
          "flow": 60,
          "from": "source",
          "to": "parse_kernel",
          "unit_cost": 1380
        },
        {
          "edge_id": "e1",
          "flow": 60,
          "from": "parse_kernel",
          "to": "static_type_scope_kernel",
          "unit_cost": 637
        },
        {
          "edge_id": "e2",
          "flow": 60,
          "from": "static_type_scope_kernel",
          "to": "test_gen_kernel",
          "unit_cost": 361
        },
        {
          "edge_id": "e3",
          "flow": 60,
          "from": "test_gen_kernel",
          "to": "det_patch_kernel",
          "unit_cost": 15734
        },
        {
          "edge_id": "e4_det",
          "flow": 60,
          "from": "det_patch_kernel",
          "to": "diff_verifier_kernel",
          "unit_cost": 1118
        },
        {
          "edge_id": "e6",
          "flow": 60,
          "from": "diff_verifier_kernel",
          "to": "commit_gate",
          "unit_cost": 100
        }
      ],
      "flow": 60,
      "ok": true,
      "solve_ns": 2106,
      "total_cost": 1159800
    },
    "firing_ledger_entries": 322,
    "arms": {
      "arm_a_det_only": {
        "tasks_total": 60,
        "committed_count": 40,
        "refused_count": 20,
        "verified_correct": 40,
        "pass_rate_pct": 66.67,
        "false_commits": 0,
        "false_commit_rate_pct": 0.0,
        "llm_calls": 0,
        "input_tokens": 0,
        "output_tokens": 0,
        "total_tokens": 0,
        "api_cost_usd": 0.0,
        "remote_api_server_energy": "not_available",
        "pkg_reported_j": 1.5072,
        "core_reported_j": 1.2834,
        "psys_reported_j": 0.012,
        "wall_latency_s": 0.057,
        "coherence_per_pkg_joule": 26.539313,
        "coherence_per_core_joule": 31.167625,
        "pkg_joules_per_verified_task": 0.0377,
        "by_category": {
          "cat1_syntax_import": {
            "tasks": 20,
            "verified_correct": 20,
            "false_commits": 0,
            "llm_calls": 0,
            "pkg_reported_j": 0.3986,
            "cost_usd": 0.0
          },
          "cat2_scope_type_api": {
            "tasks": 20,
            "verified_correct": 20,
            "false_commits": 0,
            "llm_calls": 0,
            "pkg_reported_j": 0.3427,
            "cost_usd": 0.0
          },
          "cat3_algo_state_logic": {
            "tasks": 20,
            "verified_correct": 0,
            "false_commits": 0,
            "llm_calls": 0,
            "pkg_reported_j": 0.7659,
            "cost_usd": 0.0
          }
        }
      },
      "arm_b_monolithic_llm": {
        "tasks_total": 60,
        "committed_count": 60,
        "refused_count": 0,
        "verified_correct": 59,
        "pass_rate_pct": 98.33,
        "false_commits": 1,
        "false_commit_rate_pct": 1.67,
        "llm_calls": 60,
        "input_tokens": 21033,
        "output_tokens": 23810,
        "total_tokens": 44843,
        "api_cost_usd": 0.420249,
        "remote_api_server_energy": "not_available",
        "pkg_reported_j": 902.5098,
        "core_reported_j": 160.9307,
        "psys_reported_j": 39.2091,
        "wall_latency_s": 193.881,
        "coherence_per_pkg_joule": 0.065373,
        "coherence_per_core_joule": 0.366617,
        "pkg_joules_per_verified_task": 15.2968,
        "by_category": {
          "cat1_syntax_import": {
            "tasks": 20,
            "verified_correct": 20,
            "false_commits": 0,
            "llm_calls": 20,
            "pkg_reported_j": 175.946,
            "cost_usd": 0.086358
          },
          "cat2_scope_type_api": {
            "tasks": 20,
            "verified_correct": 20,
            "false_commits": 0,
            "llm_calls": 20,
            "pkg_reported_j": 219.508,
            "cost_usd": 0.084267
          },
          "cat3_algo_state_logic": {
            "tasks": 20,
            "verified_correct": 19,
            "false_commits": 1,
            "llm_calls": 20,
            "pkg_reported_j": 507.0557,
            "cost_usd": 0.249624
          }
        }
      },
      "arm_c_unattested_4agent": {
        "tasks_total": 60,
        "committed_count": 60,
        "refused_count": 0,
        "verified_correct": 52,
        "pass_rate_pct": 86.67,
        "false_commits": 8,
        "false_commit_rate_pct": 13.33,
        "llm_calls": 240,
        "input_tokens": 190015,
        "output_tokens": 98568,
        "total_tokens": 288583,
        "api_cost_usd": 2.048565,
        "remote_api_server_energy": "not_available",
        "pkg_reported_j": 5710.7714,
        "core_reported_j": 1043.3957,
        "psys_reported_j": 248.3422,
        "wall_latency_s": 1229.148,
        "coherence_per_pkg_joule": 0.009106,
        "coherence_per_core_joule": 0.049837,
        "pkg_joules_per_verified_task": 109.8225,
        "by_category": {
          "cat1_syntax_import": {
            "tasks": 20,
            "verified_correct": 20,
            "false_commits": 0,
            "llm_calls": 80,
            "pkg_reported_j": 1745.6576,
            "cost_usd": 0.54699
          },
          "cat2_scope_type_api": {
            "tasks": 20,
            "verified_correct": 20,
            "false_commits": 0,
            "llm_calls": 80,
            "pkg_reported_j": 2163.9382,
            "cost_usd": 0.582921
          },
          "cat3_algo_state_logic": {
            "tasks": 20,
            "verified_correct": 12,
            "false_commits": 8,
            "llm_calls": 80,
            "pkg_reported_j": 1801.1756,
            "cost_usd": 0.918654
          }
        }
      },
      "arm_d_cta_orchestrator": {
        "tasks_total": 60,
        "committed_count": 59,
        "refused_count": 1,
        "verified_correct": 59,
        "pass_rate_pct": 98.33,
        "false_commits": 0,
        "false_commit_rate_pct": 0.0,
        "llm_calls": 21,
        "input_tokens": 14084,
        "output_tokens": 14368,
        "total_tokens": 28452,
        "api_cost_usd": 0.257772,
        "remote_api_server_energy": "not_available",
        "pkg_reported_j": 432.7478,
        "core_reported_j": 74.0815,
        "psys_reported_j": 19.3347,
        "wall_latency_s": 95.119,
        "coherence_per_pkg_joule": 0.136338,
        "coherence_per_core_joule": 0.79642,
        "pkg_joules_per_verified_task": 7.3347,
        "by_category": {
          "cat1_syntax_import": {
            "tasks": 20,
            "verified_correct": 20,
            "false_commits": 0,
            "llm_calls": 0,
            "pkg_reported_j": 0.7905,
            "cost_usd": 0.0
          },
          "cat2_scope_type_api": {
            "tasks": 20,
            "verified_correct": 20,
            "false_commits": 0,
            "llm_calls": 0,
            "pkg_reported_j": 0.7064,
            "cost_usd": 0.0
          },
          "cat3_algo_state_logic": {
            "tasks": 20,
            "verified_correct": 19,
            "false_commits": 0,
            "llm_calls": 21,
            "pkg_reported_j": 431.2509,
            "cost_usd": 0.257772
          }
        }
      }
    },
    "prereg_sha256": "5739bcdd6c35662833a470bc56bd64f991774c2d920a5a9c059c0acebdf55e7f"
  },
  "e3": {
    "experiment": "CTA-E3",
    "board_metered": false,
    "measured_j": null,
    "total_corrupted_events": 200,
    "cta_orchestrator_corrupt_commits": 0,
    "cta_orchestrator_corrupt_rate_pct": 0.0,
    "unattested_chain_corrupt_cascades": 169,
    "unattested_chain_corrupt_rate_pct": 84.5,
    "fault_classes": {
      "payload_bitflip_50": {
        "corrupt_commits": 0,
        "injected": 50,
        "reject_mean_us": 0.1885,
        "reject_p50_us": 0.186,
        "reject_p99_us": 0.23,
        "rejected": 50,
        "defense_layer": "BLAKE3 256-bit constant-time digest check",
        "unattested_cascades": 43
      },
      "spoofed_sender_50": {
        "corrupt_commits": 0,
        "injected": 50,
        "reject_mean_us": 27.694580000000002,
        "reject_p50_us": 27.561,
        "reject_p99_us": 32.443,
        "rejected": 50,
        "defense_layer": "Ed25519 RFC 8032 strict signature verification",
        "unattested_cascades": 50
      },
      "truncated_frame_50": {
        "corrupt_commits": 0,
        "injected": 50,
        "reject_mean_us": 27.628220000000002,
        "reject_p50_us": 27.551,
        "reject_p99_us": 30.956,
        "rejected": 50,
        "defense_layer": "Typed channel JSON/AST envelope schema guard",
        "unattested_cascades": 26
      },
      "semantic_regression_50": {
        "injected": 50,
        "rejected": 50,
        "corrupt_commits": 0,
        "reject_mean_us": 375.37,
        "reject_p50_us": 332.43,
        "reject_p99_us": 1941.25,
        "pkg_reported_mj_per_gate": 21.1169,
        "defense_layer": "Differential Verifier Commit Gate (doctest + repeat + property)",
        "unattested_cascades": 50
      }
    },
    "control_valid_200": {
      "accepted": 200,
      "total": 200,
      "verify_mean_us": 31.800915,
      "verify_p50_us": 27.513,
      "verify_p99_us": 78.087
    },
    "ssp_topology_rerouting_20": {
      "all_demands_satisfied": true,
      "baseline_cost_uj_scaled": 93000,
      "baseline_flow": 8,
      "baseline_solve_us": 7.214,
      "dropouts_tested": 20,
      "events": [
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "parse_primary"
          ],
          "dropout_idx": 0,
          "min_cost_uj_scaled": 97800,
          "reroute_latency_us": 3.583,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "static_primary"
          ],
          "dropout_idx": 1,
          "min_cost_uj_scaled": 97400,
          "reroute_latency_us": 2.958,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "testgen_primary"
          ],
          "dropout_idx": 2,
          "min_cost_uj_scaled": 98500,
          "reroute_latency_us": 2.579,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "detpatch_primary"
          ],
          "dropout_idx": 3,
          "min_cost_uj_scaled": 192600,
          "reroute_latency_us": 2.637,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "proposer_primary"
          ],
          "dropout_idx": 4,
          "min_cost_uj_scaled": 93000,
          "reroute_latency_us": 2.622,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "verifier_primary"
          ],
          "dropout_idx": 5,
          "min_cost_uj_scaled": 189700,
          "reroute_latency_us": 2.53,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "parse_primary",
            "static_primary"
          ],
          "dropout_idx": 6,
          "min_cost_uj_scaled": 101800,
          "reroute_latency_us": 2.398,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "static_primary",
            "testgen_primary"
          ],
          "dropout_idx": 7,
          "min_cost_uj_scaled": 102500,
          "reroute_latency_us": 2.307,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "testgen_primary",
            "detpatch_primary"
          ],
          "dropout_idx": 8,
          "min_cost_uj_scaled": 197800,
          "reroute_latency_us": 2.123,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "detpatch_primary",
            "proposer_primary"
          ],
          "dropout_idx": 9,
          "min_cost_uj_scaled": 205900,
          "reroute_latency_us": 2.274,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "proposer_primary",
            "verifier_primary"
          ],
          "dropout_idx": 10,
          "min_cost_uj_scaled": 203900,
          "reroute_latency_us": 2.126,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "parse_primary",
            "detpatch_primary"
          ],
          "dropout_idx": 11,
          "min_cost_uj_scaled": 197400,
          "reroute_latency_us": 2.185,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "static_primary",
            "verifier_primary"
          ],
          "dropout_idx": 12,
          "min_cost_uj_scaled": 194100,
          "reroute_latency_us": 2.403,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "parse_standby",
            "testgen_primary"
          ],
          "dropout_idx": 13,
          "min_cost_uj_scaled": 98500,
          "reroute_latency_us": 2.416,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "static_standby",
            "detpatch_primary"
          ],
          "dropout_idx": 14,
          "min_cost_uj_scaled": 192600,
          "reroute_latency_us": 2.582,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "parse_primary",
            "static_primary",
            "testgen_primary"
          ],
          "dropout_idx": 15,
          "min_cost_uj_scaled": 106900,
          "reroute_latency_us": 2.027,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 8,
          "demand": 8,
          "disabled_nodes": [
            "testgen_primary",
            "detpatch_primary",
            "verifier_primary"
          ],
          "dropout_idx": 16,
          "min_cost_uj_scaled": 199100,
          "reroute_latency_us": 2.247,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "parse_primary",
            "proposer_primary",
            "verifier_primary"
          ],
          "dropout_idx": 17,
          "min_cost_uj_scaled": 208700,
          "reroute_latency_us": 2.336,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 9,
          "demand": 8,
          "disabled_nodes": [
            "static_primary",
            "detpatch_primary",
            "proposer_primary"
          ],
          "dropout_idx": 18,
          "min_cost_uj_scaled": 210300,
          "reroute_latency_us": 1.923,
          "satisfied_flow": 8
        },
        {
          "active_edge_count": 8,
          "demand": 8,
          "disabled_nodes": [
            "parse_primary",
            "static_primary",
            "detpatch_primary",
            "verifier_primary"
          ],
          "dropout_idx": 19,
          "min_cost_uj_scaled": 202700,
          "reroute_latency_us": 1.917,
          "satisfied_flow": 8
        }
      ],
      "reroute_max_us": 3.583,
      "reroute_mean_us": 2.40865,
      "reroute_p50_us": 2.398,
      "reroute_p99_us": 3.583
    },
    "prereg_sha256": "5739bcdd6c35662833a470bc56bd64f991774c2d920a5a9c059c0acebdf55e7f"
  },
  "ledger_samples": [
    {
      "core_reported_j": 0.0,
      "ed25519_sig_prefix": "231810deda4269a3fb54ce561abfdf01",
      "input_blake3": "959e14f4d587c82dcabf0c7ffcafafee9545f581da4858319f35b3319e9e1d37",
      "latency_ms": 0.1284,
      "node_id": "parse_kernel",
      "output_blake3": "33f1664da887a25f86015d270b0796e53f30b1276eb58bf58fc8beaa99967ffd",
      "pkg_reported_j": 0.0,
      "potential_v": 1.0,
      "psys_reported_j": 0.0,
      "step_idx": 0,
      "threshold_theta": 1.0,
      "trace_id": "cta_e2_C1_01",
      "verify_ns": 60935
    },
    {
      "core_reported_j": 0.0,
      "ed25519_sig_prefix": "419790bd7c0313af0b12f59c810b4204",
      "input_blake3": "33f1664da887a25f86015d270b0796e53f30b1276eb58bf58fc8beaa99967ffd",
      "latency_ms": 0.0621,
      "node_id": "static_type_scope_kernel",
      "output_blake3": "6ae134063700e9de1404e6979df2bcb588638bf7d01772029985ea51294415f4",
      "pkg_reported_j": 0.0,
      "potential_v": 1.0,
      "psys_reported_j": 0.0,
      "step_idx": 1,
      "threshold_theta": 1.0,
      "trace_id": "cta_e2_C1_01",
      "verify_ns": 34966
    },
    {
      "core_reported_j": 0.0,
      "ed25519_sig_prefix": "dfd2fe3fefde6c4925da664239d00794",
      "input_blake3": "6ae134063700e9de1404e6979df2bcb588638bf7d01772029985ea51294415f4",
      "latency_ms": 0.0789,
      "node_id": "test_gen_kernel",
      "output_blake3": "bc21f8ffd4f07966664f666b0d8e0561902c52bb6f15ac42cffffe72656e310d",
      "pkg_reported_j": 0.0,
      "potential_v": 1.0,
      "psys_reported_j": 0.0,
      "step_idx": 2,
      "threshold_theta": 1.0,
      "trace_id": "cta_e2_C1_01",
      "verify_ns": 30708
    },
    {
      "core_reported_j": 0.0,
      "ed25519_sig_prefix": "1d98b5c43f3c319fdef3284503135fda",
      "input_blake3": "bc21f8ffd4f07966664f666b0d8e0561902c52bb6f15ac42cffffe72656e310d",
      "latency_ms": 0.5281,
      "node_id": "det_patch_kernel",
      "output_blake3": "f3166f3b3611c95d14ff01c37fdd4dcaf9638be0ad641ed4720e4588e96e11f6",
      "pkg_reported_j": 0.0,
      "potential_v": 1.0,
      "psys_reported_j": 0.0,
      "step_idx": 3,
      "threshold_theta": 1.0,
      "trace_id": "cta_e2_C1_01",
      "verify_ns": 26345
    },
    {
      "core_reported_j": 3.657218,
      "ed25519_sig_prefix": "3599e62aade09fe268262b76eea791c1",
      "input_blake3": "7cf07540843552a3ceffe8315d3562dd5bcb895092a485c95ee9ee5b4c37ddcf",
      "latency_ms": 3479.3002,
      "node_id": "llm_patch_proposer",
      "output_blake3": "0083dff3478cbe6e760302d308d2716a10f18a29c8dfb0a93d5a1071774b44bd",
      "pkg_reported_j": 17.357133,
      "potential_v": 1.0,
      "psys_reported_j": 0.705564,
      "step_idx": 4,
      "threshold_theta": 1.0,
      "trace_id": "cta_e2_C3_01",
      "verify_ns": 44931
    },
    {
      "core_reported_j": 0.481017,
      "ed25519_sig_prefix": "a7dbb3da3b52fb3adcb9711686a96129",
      "input_blake3": "c795a025150bb7f33e1e76aa033ccf352c4cf24b9df31143d67290e82db2fbd5",
      "latency_ms": 4156.1959,
      "node_id": "llm_patch_proposer",
      "output_blake3": "816a59f8495d86c9ec1937b5b35d617b08ff5cde51ae7d55b3ecd509bea38617",
      "pkg_reported_j": 16.224811,
      "potential_v": 1.0,
      "psys_reported_j": 0.841551,
      "step_idx": 4,
      "threshold_theta": 1.0,
      "trace_id": "cta_e2_C3_02",
      "verify_ns": 48183
    },
    {
      "core_reported_j": 0.016601,
      "ed25519_sig_prefix": "5c7a17aafe9969567e6f3987a300adf2",
      "input_blake3": "79330970e8a243c4a5c6431eb7e92b1c88765ad5af049b07df435ce337e80303",
      "latency_ms": 0.6191,
      "node_id": "diff_verifier_kernel",
      "output_blake3": "62ccce23989ad8a55984007dcdc5a4f7bfed17306a2bdd87ff5cbf3f8edf2041",
      "pkg_reported_j": 0.021423,
      "potential_v": 1.0,
      "psys_reported_j": 0.000245,
      "step_idx": 5,
      "threshold_theta": 1.0,
      "trace_id": "cta_e2_C3_01",
      "verify_ns": 28582
    },
    {
      "core_reported_j": 0.0,
      "ed25519_sig_prefix": "c712090f581789d5f0bd539e5872a1f8",
      "input_blake3": "855debf6ba02acd221136b5ac63112ac5e9e5bee52e5e64550013c66a5612aa0",
      "latency_ms": 0.5488,
      "node_id": "diff_verifier_kernel",
      "output_blake3": "62ccce23989ad8a55984007dcdc5a4f7bfed17306a2bdd87ff5cbf3f8edf2041",
      "pkg_reported_j": 0.0,
      "potential_v": 1.0,
      "psys_reported_j": 0.0,
      "step_idx": 5,
      "threshold_theta": 1.0,
      "trace_id": "cta_e2_C3_02",
      "verify_ns": 30948
    }
  ],
  "des10_synthesis": {
    "hosts": {
      "intel_core_i9_13900h_rapl": {
        "label": "Intel Core i9-13900H (Raptor Lake \u00b7 Linux RAPL reported_j)",
        "evidence_basis": "reported_j (Linux powercap intel-rapl:0 package-0, board_metered = false)",
        "board_metered": false,
        "verify_1kib_uj": 650.59,
        "tier3_llm_j": 15.2968,
        "tier2_sym_j": 0.01573,
        "tier1_case_j": 1.77e-06,
        "tier0_lut6_est_j": 1.2e-11,
        "synth_3to2_j": 0.45,
        "synth_2to1_j": 0.045,
        "synth_1to0_j": 0.25
      },
      "nvidia_jetson_agx_thor_ina238": {
        "label": "NVIDIA Jetson AGX Thor (Armv9-A \u00b7 TI INA238 / INA3221 measured_j)",
        "evidence_basis": "measured_j (hwmon6 TI INA238 VIN L1 + hwmon5 INA3221 ch2 VDD_CPU_SOC_MSS inline rail shunts)",
        "board_metered": true,
        "verify_1kib_uj": 518.4,
        "tier3_llm_j": 18.42,
        "tier2_sym_j": 0.0124,
        "tier1_case_j": 1.42e-06,
        "tier0_lut6_est_j": 1.2e-11,
        "synth_3to2_j": 0.39,
        "synth_2to1_j": 0.038,
        "synth_1to0_j": 0.22
      },
      "apple_m5_max_ioreport": {
        "label": "Apple M5 Max (macOS \u00b7 IOReport + proc_pid_rusage reported_j)",
        "evidence_basis": "reported_j (macOS libIOReport Energy Model + RUSAGE_INFO_V6, board_metered = false)",
        "board_metered": false,
        "verify_1kib_uj": 412.0,
        "tier3_llm_j": 11.85,
        "tier2_sym_j": 0.0098,
        "tier1_case_j": 1.15e-06,
        "tier0_lut6_est_j": 1.2e-11,
        "synth_3to2_j": 0.32,
        "synth_2to1_j": 0.031,
        "synth_1to0_j": 0.19
      },
      "amd_strix_halo_rapl": {
        "label": "AMD Ryzen AI Max+ 395 (Strix Halo \u00b7 Linux RAPL reported_j)",
        "evidence_basis": "reported_j (Linux powercap socket counter, board_metered = false)",
        "board_metered": false,
        "verify_1kib_uj": 588.2,
        "tier3_llm_j": 14.1,
        "tier2_sym_j": 0.0139,
        "tier1_case_j": 1.6e-06,
        "tier0_lut6_est_j": 1.2e-11,
        "synth_3to2_j": 0.41,
        "synth_2to1_j": 0.04,
        "synth_1to0_j": 0.23
      },
      "win11_rtx2060_nvml": {
        "label": "Windows 11 + GeForce RTX 2060 (Discrete GPU NVML reported_j)",
        "evidence_basis": "reported_j (NVML nvmlDeviceGetTotalEnergyConsumption mJ, board_metered = false)",
        "board_metered": false,
        "verify_1kib_uj": 790.0,
        "tier3_llm_j": 21.6,
        "tier2_sym_j": 0.0192,
        "tier1_case_j": 2.1e-06,
        "tier0_lut6_est_j": 1.2e-11,
        "synth_3to2_j": 0.54,
        "synth_2to1_j": 0.052,
        "synth_1to0_j": 0.29
      }
    },
    "camps": [
      {
        "id": "C1",
        "name": "Autoregressive LLMs",
        "tier": 3,
        "superpower": "Broad NL schema parsing & open-world synthesis",
        "blindspot": "~15 J/call; Simpson & f^k drift solo"
      },
      {
        "id": "C2",
        "name": "Deductive Symbolic (SMT/Lean)",
        "tier": 2,
        "superpower": "Sound 0-false-commit formal proof & AST repair",
        "blindspot": "Cannot parse unformalized raw prose solo"
      },
      {
        "id": "C3",
        "name": "Latent World / JEPA / FormEBM",
        "tier": 3,
        "superpower": "47 mJ pre-filter cutting checker calls 2.39x",
        "blindspot": "Requires exact downstream proof/sandbox gate"
      },
      {
        "id": "C4",
        "name": "RL / MCTS Tree Search",
        "tier": 3,
        "superpower": "Non-myopic horizon planning over traps",
        "blindspot": "High rollout cost without EBM prior"
      },
      {
        "id": "C5",
        "name": "Episodic RAG / Shape-D",
        "tier": 1,
        "superpower": "O(1) 1.77 uJ DNULLMM1 binary mmap recall",
        "blindspot": "Misses on unseen variable topologies"
      },
      {
        "id": "C6",
        "name": "Evolutionary Program Search",
        "tier": 3,
        "superpower": "Escapes local valleys via island mutation",
        "blindspot": "Wastes evaluations without sub-ms gate"
      },
      {
        "id": "C7",
        "name": "Causal Do-Calculus / Bayes DAG",
        "tier": 2,
        "superpower": "Exact P(Y|do(X)) backdoor deconfounding",
        "blindspot": "Needs typed causal graph from upstream"
      },
      {
        "id": "C8",
        "name": "Sub-Symbolic / SSM / LUT6",
        "tier": 0,
        "superpower": "~12 pJ est_j 4 ns zero-FLOP hardware reflex",
        "blindspot": "Bounded combinational page capacity"
      },
      {
        "id": "C9",
        "name": "Multi-Agent NL Debate",
        "tier": 3,
        "superpower": "Diverse candidate hypothesis framing",
        "blindspot": "3.71x token bloat & 13.3% false commits"
      },
      {
        "id": "C10",
        "name": "Embodied Sandbox / Control",
        "tier": 2,
        "superpower": "Grounded repeat-call execution oracle",
        "blindspot": "Unsafe or slow without upstream filter"
      }
    ],
    "ai_eras_1950_2026": [
      {
        "era": "1950\u20131965",
        "milestones": "Turing \u00b7 IPL \u00b7 Perceptron \u00b7 Lisp",
        "externalized": "Symbolic list trees & linear weights",
        "gate": "Exact recursion & margin step",
        "stall": "Single-layer XOR limit & combinatorial search blowup"
      },
      {
        "era": "1969\u20131981",
        "milestones": "MYCIN \u00b7 Actors \u00b7 Hearsay-II [Winter I]",
        "externalized": "IF-THEN rules & shared blackboard",
        "gate": "Heuristic certainty factors (CF)",
        "stall": "O(N^2) blackboard contention & non-Bayesian f^k CF drift"
      },
      {
        "era": "1982\u20131998",
        "milestones": "Backprop \u00b7 Bayes DAGs \u00b7 ConvNet \u00b7 LSTM [Winter II]",
        "externalized": "Differentiable gradients & d-sep DAGs",
        "gate": "Chain-rule credit & memory cell gates",
        "stall": "LISP-machine collapse, tiny datasets & CPU vanishing gradients"
      },
      {
        "era": "2006\u20132016",
        "milestones": "MCTS \u00b7 ImageNet \u00b7 Attention \u00b7 ResNet \u00b7 AlphaGo",
        "externalized": "GPU tensor activations, skip paths & rollouts",
        "gate": "Identity residual path + MCTS value gate",
        "stall": "Narrow task-specific silos & dense per-token compute"
      },
      {
        "era": "2017\u20132022",
        "milestones": "Transformer \u00b7 Sparse MoE \u00b7 AlphaFold 2 \u00b7 CoT",
        "externalized": "All-pairs KV cache, top-k MoE & CoT tokens",
        "gate": "Softmax router + MSA geometry + RLHF",
        "stall": "O(L^2) context joules & unverified scratchpad drift"
      },
      {
        "era": "2023\u20132025",
        "milestones": "JEPA \u00b7 FunSearch \u00b7 AlphaGeometry \u00b7 MCP \u00b7 POLIS",
        "externalized": "Latent world embeddings, code islands & tool schemas",
        "gate": "Sandbox evaluator, deductive engine & peer gate",
        "stall": "Ad-hoc pairwise glue; ~15 J LLM re-run on repeat shapes"
      },
      {
        "era": "2026",
        "milestones": "Shape-D \u00b7 LUT6 \u00b7 RCE \u00b7 DES-10 Enzymatic Synthesis",
        "externalized": "BLAKE3+Ed25519 canonical IR across C1..C10",
        "gate": "<1 mJ crypto + eventfd + SSP + exact verifier",
        "stall": "Unlocked downward crystallization: 15 J -> 15 mJ -> 1.77 uJ -> ~12 pJ"
      }
    ],
    "horizons": {
      "months_1_3": {
        "title": "Months 1\u20133 \u00b7 Attested Bus & DNULLMM1 Crystallizer",
        "theorems": "CTA-T16..T23",
        "target_cpj": "2.1x\u201315.0x vs Monolithic / Chat",
        "kill": "Killed if edge verify >100 us / >5 mJ, false commits >0%, or Arm D CpJ <= 1.0x monolithic (CA-H6)."
      },
      "quarters_1_4": {
        "title": "Quarters 1\u20134 \u00b7 10-Camp DES-10 + FormEBM + xck26 LUT6",
        "theorems": "CTA-T23..T28, CTA-T41..T45",
        "target_cpj": "25x\u201360x over 1,000 Zipfian arrivals",
        "kill": "Killed if downward tier fails to amortize by N* or xck26 post-PAR breaks 250 MHz / INA260 budget."
      },
      "years_1_5": {
        "title": "Years 1\u20135 \u00b7 Self-Maintaining Stack, Event Silicon & Gated BCI",
        "theorems": "CTA-T7..T10, CTA-T29..T31",
        "target_cpj": "100x\u2013500x digital + >39 bit/s BCI [S]",
        "kill": "Killed as semantic bridge if g_i=0 leaks >0 state writes, authorship <0.90, or ITR <= 39 bit/s (CA-H7)."
      },
      "decade_1": {
        "title": "Decade 1 (2026\u20132036) \u00b7 Planetary Fabric & Phase-III Neuro RCTs",
        "theorems": "CTA-T5..T6, CTA-T29..T31",
        "target_cpj": ">1,000x digital + Phase-III CNS RCT [S]",
        "kill": "Killed clinically if double-blind GMP Phase-III EV RCT fails sham vehicle at p < 0.01 (CA-H8)."
      }
    }
  }
};
