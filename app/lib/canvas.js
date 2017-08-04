
import isArray from 'lodash-es/isArray';

export default class Canvas {

  constructor (el) {
    if (!el || !(el.tagName && el.tagName === 'CANVAS')) {
      throw new Error('Canvas needs a canvas');
    }
    this.el = el;
    this.context = this.el.getContext('2d');
    this.width = 0;
    this.height = 0;
  }

  resize () {
    this.el.width = this.width = this.el.clientWidth;
    this.el.height = this.height = this.el.clientHeight;
  }

  clear () {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  alpha (a = 0) {
    this.context.globalAlpha = a;
  }

  fill (...args) {
    this.context.fillStyle = color(...args);
  }

  strokeWidth (w = 0) {
    this.context.lineWidth = Math.max(w, 0.0001);
  }

  stroke (...args) {
    this.context.strokeStyle = color(...args);
  }

  drawPolygon (points = [], args = {}) {
    if (!isArray(points)) {
      throw new Error('points[] needs to be an array');
    }

    this.context.beginPath();

    points.forEach((point, i) => {
      if (!isArray(point) || point.length !== 2) {
        return;
      }
      const method = (i === 0 ? 'moveTo' : 'lineTo');
      this.context[method](point[0], point[1]);
    });

    if (args.fill === false) {
      this.context.closePath();
      this.context.stroke();
    } else {
      this.context.fill();
    }
  }

}

function color (r = 255, g = 255, b = 255) {
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  return `rgb(${r}, ${g}, ${b})`;
}
