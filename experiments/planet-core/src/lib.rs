//! Rust reference of the planet exact core. A line-for-line port of
//! `public/living/planet/core.js`; see `docs/planet/BLUEPRINT.md`.
//!
//! Hashing uses explicit wrapping arithmetic (the JavaScript code uses
//! `Math.imul` and `>>> 0`). Everything else uses ordinary arithmetic with
//! overflow checks on, so any value that would leave the 32-bit range panics
//! here instead of silently diverging from JavaScript, whose numbers do not wrap.

pub const SEA: i32 = 520;

// ------------------------------------------------------------------ hashing

pub fn mix32(h0: u32) -> u32 {
    let mut h = h0;
    h ^= h >> 16;
    h = h.wrapping_mul(0x7feb352d);
    h ^= h >> 15;
    h = h.wrapping_mul(0x846ca68b);
    h ^= h >> 16;
    h
}

pub fn hash3(seed: u32, x: u32, y: u32) -> u32 {
    let h = mix32(seed ^ x.wrapping_mul(0x9e3779b1));
    mix32(h ^ y.wrapping_mul(0x85ebca77))
}

fn oct_seed(seed: u32, k: u32) -> u32 {
    mix32(seed ^ (k + 1).wrapping_mul(0x27d4eb2d))
}

// ------------------------------------------------------------------ generator G

fn smooth8(t: i32) -> i32 {
    (t * t * (768 - 2 * t)) >> 16
}

fn lerp8(a: i32, b: i32, s: i32) -> i32 {
    a + (((b - a) * s) >> 8)
}

pub fn value_noise(seed: u32, x: u32, y: u32, k: u32, w: u32) -> i32 {
    let nx = w >> k;
    let (lx, ly) = (x >> k, y >> k);
    let mask = (1u32 << k) - 1;
    let sx = smooth8((((x & mask) << 8) >> k) as i32);
    let sy = smooth8((((y & mask) << 8) >> k) as i32);
    let (ax, bx) = (lx % nx, (lx + 1) % nx);
    let v00 = (hash3(seed, ax, ly) & 0xffff) as i32;
    let v10 = (hash3(seed, bx, ly) & 0xffff) as i32;
    let v01 = (hash3(seed, ax, ly + 1) & 0xffff) as i32;
    let v11 = (hash3(seed, bx, ly + 1) & 0xffff) as i32;
    lerp8(lerp8(v00, v10, sx), lerp8(v01, v11, sx), sy)
}

const OCTAVES: [(u32, i32); 5] = [(6, 16), (5, 8), (4, 4), (3, 2), (2, 1)];

pub fn elevation(seed: u32, x: u32, y: u32, w: u32) -> i32 {
    let mut sum = 0i32;
    for (k, wt) in OCTAVES {
        sum += value_noise(oct_seed(seed, k), x, y, k, w) * wt;
    }
    sum / 31 // sum >= 0
}

pub fn material(seed: u32, x: u32, y: u32, e: i32, w: u32, h: u32) -> u8 {
    let g = e >> 6;
    let hm1 = h as i32 - 1;
    let lat = (2 * y as i32 - hm1).abs();
    let polar = lat * 6 >= hm1 * 5;
    if g < SEA - 40 {
        return if polar { 5 } else { 1 };
    }
    if polar {
        return 5;
    }
    if g < SEA + 6 {
        return 2;
    }
    let ore = hash3(oct_seed(seed, 20), x, y) & 0xffff;
    if ore < 20 {
        return 7;
    }
    if ore < 400 {
        return 6;
    }
    let rock = value_noise(oct_seed(seed, 21), x, y, 4, w);
    if rock > 32768 && g < SEA + 150 { 3 } else { 4 }
}

pub fn generate_packed(seed: u32, w: u32, h: u32, out: &mut [u32]) {
    for y in 0..h {
        for x in 0..w {
            let e = elevation(seed, x, y, w);
            out[(y * w + x) as usize] = (e as u32) | ((material(seed, x, y, e, w, h) as u32) << 16);
        }
    }
}

// ------------------------------------------------------------------ state

#[derive(Clone)]
pub struct State {
    pub seed: u32,
    pub w: usize,
    pub h: usize,
    pub t: i32,
    pub rock: i32,  // R in core.js
    pub water: i32, // V in core.js
    pub g: Vec<i32>,
    pub wv: Vec<i32>, // w in core.js
    pub q: Vec<i32>,
    pub temp: Vec<i32>, // T in core.js
    pub m: Vec<u8>,
}

pub fn sun(y: i32, t: i32, h: i32) -> i32 {
    let p = 720;
    let a2 = h >> 1;
    let pp = t % p;
    let v = if pp < p / 2 { pp } else { p - pp };
    let offset = (v * 2 * a2) / (p / 2) - a2;
    let d = 2 * y - (h - 1) - offset;
    let s = 64 - (d * d * 64) / (h * h);
    if s > 0 { s } else { 0 }
}

impl State {
    pub fn new(seed: u32, w: usize, h: usize) -> State {
        let n = w * h;
        let mut s = State {
            seed, w, h, t: 0, rock: 0, water: 0,
            g: vec![0; n], wv: vec![0; n], q: vec![0; n], temp: vec![0; n], m: vec![0; n],
        };
        for y in 0..h {
            for x in 0..w {
                let i = y * w + x;
                let e = elevation(seed, x as u32, y as u32, w as u32);
                s.g[i] = e >> 6;
                s.m[i] = material(seed, x as u32, y as u32, e, w as u32, h as u32);
                s.wv[i] = if s.g[i] < SEA { SEA - s.g[i] } else { 0 };
                s.temp[i] = 16 * sun(y as i32, 0, h as i32);
            }
        }
        s
    }
}

// ------------------------------------------------------------------ edits

#[derive(Clone, Copy, Debug)]
pub struct Edit {
    pub t: i32,
    pub x: i32,
    pub y: i32,
    pub op: i32, // 0 dig, 1 raise, 2 scoop, 3 pour (core.OPS order)
    pub k: i32,
}

pub fn edit_admissible(s: &State, e: &Edit) -> bool {
    if !(0..=3).contains(&e.op) { return false; }
    if !(e.x >= 0 && (e.x as usize) < s.w && e.y >= 0 && (e.y as usize) < s.h) { return false; }
    if !(e.k > 0 && e.k <= 1000) { return false; }
    let i = e.y as usize * s.w + e.x as usize;
    match e.op {
        0 => s.g[i] >= e.k,
        1 => s.rock >= e.k,
        2 => s.wv[i] >= e.k,
        _ => s.water >= e.k,
    }
}

pub fn apply_edit(s: &mut State, e: &Edit) {
    let i = e.y as usize * s.w + e.x as usize;
    match e.op {
        0 => { s.g[i] -= e.k; s.rock += e.k; }
        1 => { s.g[i] += e.k; s.rock -= e.k; }
        2 => { s.wv[i] -= e.k; s.water += e.k; }
        _ => { s.wv[i] += e.k; s.water -= e.k; }
    }
}

// ------------------------------------------------------------------ step

pub fn step(s: &State) -> State {
    let (w, h) = (s.w, s.h);
    let n = w * h;
    let (wi, hi) = (w as i32, h as i32);
    let mut g = s.g.clone();
    let mut wv = s.wv.clone();
    let mut q = s.q.clone();
    let mut t1 = vec![0i32; n];
    let mut temp = vec![0i32; n];
    let idx = |x: i32, y: i32| -> usize { (y * wi + (x + wi) % wi) as usize };

    // 1. sun, radiative loss, cooling with altitude
    for y in 0..hi {
        let sy = sun(y, s.t, hi);
        for x in 0..wi {
            let i = (y * wi + x) as usize;
            let heat = if s.wv[i] > 16 { sy >> 1 } else { sy };
            let alt = if s.g[i] > SEA { (s.g[i] - SEA) >> 3 } else { 0 };
            t1[i] = s.temp[i] + heat - (s.temp[i] >> 4) - alt;
            if t1[i] < 0 { t1[i] = 0; }
        }
    }
    // 2. heat diffusion (closed at the poles)
    for y in 0..hi {
        for x in 0..wi {
            let i = (y * wi + x) as usize;
            let n_ = if y > 0 { t1[idx(x, y - 1)] } else { t1[i] };
            let s_ = if y < hi - 1 { t1[idx(x, y + 1)] } else { t1[i] };
            let lap = n_ + s_ + t1[idx(x - 1, y)] + t1[idx(x + 1, y)] - 4 * t1[i];
            temp[i] = t1[i] + (lap >> 3);
        }
    }
    // 3. evaporation
    for i in 0..n {
        let mut ev = if temp[i] > 400 { (temp[i] - 400) >> 5 } else { 0 };
        if ev > wv[i] { ev = wv[i]; }
        wv[i] -= ev;
        q[i] += ev;
    }
    // 4. moving air, carrying vapour and heat, plus the westerly drift
    let mut dq = vec![0i32; n];
    let mut dt = vec![0i32; n];
    for y in 0..hi {
        let lat = (2 * y - (hi - 1)).abs();
        let band = lat * 6 >= hi - 1 && lat * 3 <= (hi - 1) * 2;
        for x in 0..wi {
            let i = (y * wi + x) as usize;
            let (qi, ti) = (q[i], temp[i]);
            let mut nb = [usize::MAX; 4];
            nb[0] = idx(x + 1, y);
            nb[1] = idx(x - 1, y);
            let mut c = 2;
            if y > 0 { nb[c] = idx(x, y - 1); c += 1; }
            if y < hi - 1 { nb[c] = idx(x, y + 1); c += 1; }
            for &j in &nb[..c] {
                if temp[j] > temp[i] {
                    let d = temp[j] - temp[i];
                    let f = if d < 64 { d } else { 64 };
                    let amt = (qi * f) >> 9;
                    let heat = (ti * f) >> 10;
                    dq[i] -= amt; dq[j] += amt;
                    dt[i] -= heat; dt[j] += heat;
                }
            }
            if band {
                let j = idx(x + 1, y);
                let (amt, heat) = (qi >> 3, ti >> 4);
                dq[i] -= amt; dq[j] += amt;
                dt[i] -= heat; dt[j] += heat;
            }
        }
    }
    for i in 0..n { q[i] += dq[i]; temp[i] += dt[i]; }
    // 5. condensation, lower over high ground
    for i in 0..n {
        let oro = if g[i] > SEA { (g[i] - SEA) >> 3 } else { 0 };
        let mut sat = 16 + (temp[i] >> 2) - oro;
        if sat < 4 { sat = 4; }
        if q[i] > sat {
            let c = (q[i] - sat + 1) >> 1;
            q[i] -= c;
            wv[i] += c;
        }
    }
    // 6. water to the lowest neighbour; strong flow carries one unit of ground
    let mut dw = vec![0i32; n];
    let mut dg = vec![0i32; n];
    for y in 0..hi {
        for x in 0..wi {
            let i = (y * wi + x) as usize;
            if wv[i] == 0 { continue; }
            let hgt = g[i] + wv[i];
            let mut nb = [usize::MAX; 4];
            nb[0] = idx(x + 1, y);
            nb[1] = idx(x - 1, y);
            let mut c = 2;
            if y < hi - 1 { nb[c] = idx(x, y + 1); c += 1; }
            if y > 0 { nb[c] = idx(x, y - 1); c += 1; }
            let (mut j, mut hj) = (usize::MAX, hgt);
            for &k in &nb[..c] {
                let hk = g[k] + wv[k];
                if hk < hj { hj = hk; j = k; }
            }
            if j == usize::MAX { continue; }
            let mut d = (hgt - hj) >> 1;
            if d > wv[i] { d = wv[i]; }
            if d == 0 { continue; }
            dw[i] -= d; dw[j] += d;
            if d >= 24 && g[i] > 0 { dg[i] -= 1; dg[j] += 1; }
        }
    }
    for i in 0..n { wv[i] += dw[i]; g[i] += dg[i]; }

    State { t: s.t + 1, g, wv, q, temp, ..s.clone() }
}

/// Apply this tick's admissible edits in log order, then step. Returns the number refused.
pub fn advance(s: &mut State, log: &[Edit]) -> usize {
    let mut refused = 0;
    let t = s.t;
    for e in log.iter().filter(|e| e.t == t) {
        if edit_admissible(s, e) { apply_edit(s, e); } else { refused += 1; }
    }
    *s = step(s);
    refused
}

pub fn hash_state(s: &State) -> (u32, u32) {
    let (mut h1, mut h2) = (0x811c9dc5u32, 0x9747b28cu32);
    let mut feed = |v: i32| {
        let v = v as u32;
        h1 = mix32(h1 ^ v);
        h2 = mix32(h2.wrapping_add(v.wrapping_mul(0x9e3779b1)));
    };
    feed(s.t);
    feed(s.rock);
    feed(s.water);
    for a in [&s.g, &s.wv, &s.q, &s.temp] {
        for &v in a.iter() { feed(v); }
    }
    (h1, h2)
}

pub fn hash_hex(s: &State) -> String {
    let (a, b) = hash_state(s);
    format!("{:08x}{:08x}", a, b)
}

// ------------------------------------------------------------------ WebAssembly interface
//
// Plain exported functions over one world held in a global, so the module needs
// no binding generator. Edits are passed as 5 consecutive i32 per edit
// (t, x, y, op, k) in memory obtained from `alloc`.

pub mod wasm {
    use super::*;
    use std::cell::RefCell;

    thread_local! {
        static WORLD: RefCell<Option<State>> = const { RefCell::new(None) };
        static LOG: RefCell<Vec<Edit>> = const { RefCell::new(Vec::new()) };
    }

    #[no_mangle]
    pub extern "C" fn alloc(bytes: usize) -> *mut u8 {
        let mut v = Vec::<u8>::with_capacity(bytes);
        let p = v.as_mut_ptr();
        std::mem::forget(v);
        p
    }

    #[no_mangle]
    pub extern "C" fn world_init(seed: u32, w: u32, h: u32) {
        WORLD.with(|c| *c.borrow_mut() = Some(State::new(seed, w as usize, h as usize)));
        LOG.with(|l| l.borrow_mut().clear());
    }

    /// # Safety
    /// `ptr` must point to `n * 5` readable i32 values.
    #[no_mangle]
    pub unsafe extern "C" fn world_set_log(ptr: *const i32, n: usize) {
        let raw = std::slice::from_raw_parts(ptr, n * 5);
        let log: Vec<Edit> = raw.chunks(5).map(|c| Edit { t: c[0], x: c[1], y: c[2], op: c[3], k: c[4] }).collect();
        LOG.with(|l| *l.borrow_mut() = log);
    }

    #[no_mangle]
    pub extern "C" fn world_advance(ticks: u32) -> u32 {
        let mut refused = 0;
        WORLD.with(|c| LOG.with(|l| {
            let mut wb = c.borrow_mut();
            let s = wb.as_mut().expect("world_init first");
            let log = l.borrow();
            for _ in 0..ticks { refused += advance(s, &log) as u32; }
        }));
        refused
    }

    fn with_world<T>(f: impl FnOnce(&State) -> T) -> T {
        WORLD.with(|c| f(c.borrow().as_ref().expect("world_init first")))
    }

    #[no_mangle] pub extern "C" fn world_hash_hi() -> u32 { with_world(|s| hash_state(s).0) }
    #[no_mangle] pub extern "C" fn world_hash_lo() -> u32 { with_world(|s| hash_state(s).1) }
    #[no_mangle] pub extern "C" fn world_tick() -> i32 { with_world(|s| s.t) }

    /// # Safety
    /// `out` must point to `w * h` writable u32 values.
    #[no_mangle]
    pub unsafe extern "C" fn gen_packed(seed: u32, w: u32, h: u32, out: *mut u32) {
        let o = std::slice::from_raw_parts_mut(out, (w * h) as usize);
        generate_packed(seed, w, h, o);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn replay_is_deterministic() {
        let log = vec![Edit { t: 3, x: 10, y: 40, op: 0, k: 5 }];
        let mut a = State::new(1234, 192, 96);
        let mut b = State::new(1234, 192, 96);
        for _ in 0..50 { advance(&mut a, &log); advance(&mut b, &log); }
        assert_eq!(hash_state(&a), hash_state(&b));
    }
}
