import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { styled, type HTMLStyledProps } from 'styled-system/jsx';

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

export type CanvasRef = RefObject<HTMLCanvasElement>;

export class CanvasApi {
  ref: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  size: Size;

  constructor(ref: HTMLCanvasElement) {
    const initialRect = ref.getBoundingClientRect();
    const context = ref.getContext('2d');
    invariantRenderingContext(context);
    this.ref = ref;
    this.context = context;
    this.size = { width: 0, height: 0 };
    this.resize(initialRect);
  }

  resize = (updatedBounds: DOMRect) => {
    const { width, height } = updatedBounds;
    const dpr = window.devicePixelRatio || 1;
    this.size = { width, height };
    this.ref.style.width = `${width}px`;
    this.ref.style.height = `${height}px`;
    this.ref.width = width * dpr;
    this.ref.height = height * dpr;
    this.scale(dpr, dpr);
  };

  scale = (x: number, y: number) => {
    this.context.scale(x, y);
  };

  clear = (width = this.size.width, height = this.size.height) => {
    this.context.clearRect(0, 0, width, height);
  };

  alpha = (alpha: number) => {
    this.context.globalAlpha = alpha;
  };

  fill = (color: Color) => {
    this.context.fillStyle = colorToRgba(color);
  };

  stroke = (color: Color) => {
    this.context.strokeStyle = colorToRgba(color);
  };

  strokeWeight = (width: number) => {
    this.context.lineWidth = Math.max(width, 0.000001);
  };

  drawRect = (rect: Rect) => {
    const { x, y, width, height } = rect;
    this.context.fillRect(x, y, width, height);
  };

  drawPolygon = (poly: Polygon, opts?: { shouldFill?: boolean }) => {
    const { coords } = poly;
    this.context.beginPath();
    for (const [index, coord] of coords.entries()) {
      if (index === 0) {
        this.context.moveTo(...coord);
      } else {
        this.context.lineTo(...coord);
      }
    }
    if (opts?.shouldFill) {
      this.context.fill();
    }
    this.context.closePath();
    this.context.stroke();
  };

  toDataURL = (type?: string, quality?: number) => {
    return this.ref.toDataURL(type, quality);
  };
}

export interface CanvasProps extends HTMLStyledProps<'canvas'> {
  onReady: () => void;
}

type CanvasState = {
  isReady: boolean;
  canvas: CanvasApi | null;
};

export const useCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<CanvasState>(() => ({
    isReady: false,
    canvas: null,
  }));
  const canvasProps = useMemo<CanvasProps>(
    () => ({
      ref: canvasRef,
      onReady: () => {
        if (!canvasRef.current) return;
        setState({
          canvas: new CanvasApi(canvasRef.current),
          isReady: canvasRef.current !== null,
        });
      },
    }),
    [],
  );

  return {
    ...state,
    props: canvasProps,
  };
};

const InnerCanvas = styled('canvas', {
  base: {
    height: '100vh',
    minHeight: '100lvh',
    width: '100vw',
  },
});

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
  function Canvas(props, innerRef) {
    const { onReady, ...canvasProps } = props;
    const hasInitialized = useRef(false);
    useEffect(() => {
      if (isCanvasMutableRef(innerRef)) {
        hasInitialized.current = true;
        onReady();
      }
    }, [innerRef, onReady]);

    return <InnerCanvas ref={innerRef} {...canvasProps} />;
  },
);

export function colorToRgba(color: Color): string {
  const { r, g, b, a = 255 } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

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
    value !== null &&
    'current' in value &&
    value.current instanceof HTMLCanvasElement
  );
}

export function invariantCanvasRef(value: unknown): asserts value is CanvasRef {
  if (!isCanvasMutableRef(value)) {
    throw new Error('Invalid canvas ref');
  }
}
