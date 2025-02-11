import type { MutableRefObject } from 'react';

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

export type Size = {
  width: number;
  height: number;
};

export type CanvasRef = MutableRefObject<HTMLCanvasElement>;

export function isRenderingContext(
  value: unknown,
): value is CanvasRenderingContext2D {
  return typeof value === 'object' && value !== null && 'canvas' in value;
}

export function invariantRenderingContext(
  value: unknown,
): asserts value is CanvasRenderingContext2D {
  if (!isRenderingContext(value)) {
    throw new Error('Invalid rendering context');
  }
}

export function isCanvasMutableRef(value: unknown): value is CanvasRef {
  return (
    typeof value === 'object' &&
    'current' in value &&
    value.current instanceof HTMLCanvasElement
  );
}

export function invariantCanvasRef(value: unknown): asserts value is CanvasRef {
  if (!isCanvasMutableRef(value)) {
    throw new Error('Invalid canvas ref');
  }
}
