declare module 'plonk' {
  export function drunk(min: number, max: number): () => number;
  export function exp(n: number): number;
  export function rand(min: number, max?: number): number;
  export function scale(n: number, a1: number, a2: number, b1: number, b2: number): number;
  export function ms(v: string | number): number;
}
