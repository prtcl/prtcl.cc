import type { Drunk, Env, Rand } from 'plonk';

export type Pos = {
  x: Drunk;
  y: Drunk;
};

export type PolyPoint = {
  x: Drunk;
  y: Drunk;
};

export type ColorRand = {
  r: Rand;
  g: Rand;
  b: Rand;
};

export type Drift = {
  x: Env;
  y: Env;
};

export type Shape = {
  pos: Pos;
  points: PolyPoint[];
  color: ColorRand;
  drift: Drift;
};
