export const mod = (n: number, m: number) => ((n % m) + m) % m
export const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max)
