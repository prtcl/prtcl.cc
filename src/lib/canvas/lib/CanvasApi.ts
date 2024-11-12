import {
  type Color,
  type Polygon,
  type Rect,
  type Size,
  invariantRenderingContext,
} from '../types';
import { colorToRgba } from './helpers';

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
