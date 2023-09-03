export type Color = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

export type PolyCoord = [number, number];

export type Polygon = {
  coords: PolyCoord[];
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
