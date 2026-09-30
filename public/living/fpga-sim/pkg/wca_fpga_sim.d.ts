/* tslint:disable */
/* eslint-disable */

export function allowMask(): number;

export function boardSynthClaimed(): boolean;

export function lutMemSha256(): string;

/**
 * Allow-LUT bits (length 16) matching the burned `.mem` image.
 */
export function lutTableBytes(): Uint8Array;

/**
 * Run a configurable episode (defaults match seed-1 when args omitted via JS defaults).
 */
export function runEpisode(steps: number, init_theta: number, init_omega: number, seed: bigint): any;

/**
 * Run the Stage A seed-1 golden episode inside WASM and return a JS object.
 */
export function runSeed1(): any;

/**
 * Compact JSON string of the seed-1 agreement fields (for text panels / tests).
 */
export function runSeed1Json(): string;

/**
 * Expected golden tuple as JSON: committed, refused, energy_only, joules.
 */
export function seed1GoldenJson(): string;

export function start(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly allowMask: () => number;
    readonly boardSynthClaimed: () => number;
    readonly lutMemSha256: () => [number, number];
    readonly lutTableBytes: () => [number, number];
    readonly runEpisode: (a: number, b: number, c: number, d: bigint) => [number, number, number];
    readonly runSeed1: () => [number, number, number];
    readonly runSeed1Json: () => [number, number];
    readonly seed1GoldenJson: () => [number, number];
    readonly start: () => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
