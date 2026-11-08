/**
 * Deterministic pseudo-random number generator (Mulberry32)
 * Ensures that given the same seed and index, variations are 100% reproducible.
 */
export function createPRNG(seed: number) {
  let s = Math.floor(seed) >>> 0;
  return function next(): number {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Return a pseudo-random float in [min, max]
 */
export function seededRandomRange(prng: () => number, min: number, max: number): number {
  return min + prng() * (max - min);
}

/**
 * Approximate normal (Gaussian) distribution using Box-Muller transform
 */
export function seededGaussian(prng: () => number, mean = 0, stdev = 1): number {
  const u1 = Math.max(1e-7, prng());
  const u2 = prng();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdev + mean;
}
