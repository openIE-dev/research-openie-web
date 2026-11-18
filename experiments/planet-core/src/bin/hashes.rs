//! Native run of the Rust reference, for comparison with core.js and the Wasm build.
//!
//!   hashes <seed> <ticks> <log-file> [rot]
//!
//! The log file has one edit per line: `t x y op k` (op 0 dig, 1 raise, 2 scoop,
//! 3 pour). Prints one line per tick: `<tick> <hash>`, then `refused <n>`.
use planet_core::{advance, hash_hex, Edit, State};
use std::{env, fs};

fn main() {
    let a: Vec<String> = env::args().collect();
    assert!(a.len() == 4 || a.len() == 5, "usage: hashes <seed> <ticks> <log-file> [rot]");
    let seed: u32 = a[1].parse().unwrap();
    let ticks: u32 = a[2].parse().unwrap();
    let text = fs::read_to_string(&a[3]).unwrap();
    let log: Vec<Edit> = text
        .lines()
        .filter(|l| !l.trim().is_empty())
        .map(|l| {
            let v: Vec<i32> = l.split_whitespace().map(|x| x.parse().unwrap()).collect();
            Edit { t: v[0], x: v[1], y: v[2], op: v[3], k: v[4] }
        })
        .collect();
    let mut s = State::new(seed, 192, 96);
    if a.len() == 5 { s.rot = a[4].parse().unwrap(); }
    let mut refused = 0;
    let mut out = String::new();
    for _ in 0..ticks {
        refused += advance(&mut s, &log);
        out.push_str(&format!("{} {}\n", s.t, hash_hex(&s)));
    }
    print!("{}refused {}\n", out, refused);
}
