
import { frames } from 'plonk';
import debounce from 'lodash/debounce';

import Canvas from '../lib/canvas';
import store from '../store';

export default class Visualization {

  constructor (args = {}) {
    this.isRunning = false;
    this.el = args.el;
    this.canvas = new Canvas(this.el);

    window.addEventListener('resize', debounce(() => {
      this.canvas.resize();
    }, 150));

    this.canvas.resize();
  }

  _frameHandler (interval, i, elapsed, stop) {
    if (!this.isRunning) {
      return stop();
    }

    this.canvas.clear();
    this.canvas.stroke(0, 0, 0);
    this.canvas.fill(0, 0, 0);

    const w = this.canvas.width,
          h = this.canvas.height;

    store.state.polygons.forEach((polygon) => {

      this.canvas.alpha(polygon.strength);

      const points = polygon.points.map((p) => [p[0] * w, p[1] * h]);
      this.canvas.drawPolygon(points, { fill: true });

    });
  }

  run () {
    if (this.isRunning) return this;

    frames((...args) => {
      this._frameHandler(...args);
    });
    this.isRunning = true;

    return this;
  }

  stop () {
    this.isRunning = false;

    return this;
  }

}
