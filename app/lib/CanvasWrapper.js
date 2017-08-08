
import toNumber from 'lodash-es/toNumber';


export function rgbColor (r = 255, g = 255, b = 255) {
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  return `rgb(${r}, ${g}, ${b})`;
}

export default class CanvasWrapper {

  constructor (el) {
    if (!el || !(el.tagName && el.tagName === 'CANVAS')) {
      throw new TypeError('CanvasWrapper needs a canvas element');
    }

    this.el = el;
    this.context = this.el.getContext('2d');
    this.width = 0;
    this.height = 0;
  }

  resize () {
    this.el.width = this.width = this.el.clientWidth;
    this.el.height = this.height = this.el.clientHeight;

    return this;
  }

  clear () {
    this.context.clearRect(0, 0, this.width, this.height);

    return this;
  }

  alpha (a) {
    const alpha = toNumber(a) || 0;

    this.context.globalAlpha = alpha;

    return this;
  }

  fill (...args) {
    this.context.fillStyle = rgbColor(...args);

    return this;
  }

  strokeWidth (w) {
    const width = Math.max(toNumber(w) || 0, 0.0001);

    this.context.lineWidth = width;

    return this;
  }

  stroke (...args) {
    const color = rgbColor(...args);

    this.context.strokeStyle = color;

    return this;
  }

  drawPolygon (points = [], fill = false) {
    this.context.beginPath();

    for (var i = 0; i < points.length; i++) {
      let point = points[i];

      if (i === 0) {
        this.context.moveTo(...point);
      } else {
        this.context.lineTo(...point);
      }
    }

    if (fill === true) {
      this.context.fill();
    }

    this.context.closePath();
    this.context.stroke();

    return this;
  }

}
