import type { Color, Polygon, Rect } from '../types';
import { colorToRgba } from './helpers';

export default class CanvasApi {
  ref: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  size: { width: number; height: number };

  constructor(ref: HTMLCanvasElement) {
    this.ref = ref;
    this.context = ref.getContext('2d');
    const rect = ref.getBoundingClientRect();

    this.resize(rect);
  }

  resize = (updatedBounds: DOMRect) => {
    const { width, height } = updatedBounds;

    this.ref.style.width = `${width}px`;
    this.ref.style.height = `${height}px`;
    this.ref.width = width;
    this.ref.height = height;

    this.size = {
      width,
      height,
    };
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

    for (let i = 0; i < coords.length; i += 1) {
      const coord = coords[i];

      if (i === 0) {
        this.context.moveTo(...coord);
      } else {
        this.context.lineTo(...coord);
      }
    }

    if (opts?.shouldFill === true) {
      this.context.fill();
    }

    this.context.closePath();
    this.context.stroke();
  };
}
