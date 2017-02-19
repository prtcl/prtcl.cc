
import { frames, rand } from 'plonk';
import debounce from 'lodash/debounce';
import times from 'lodash/times';

import Canvas from '../lib/canvas';

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

    const w = this.canvas.width,
          h = this.canvas.height;

    // this.canvas.clear();

    const c = rand(0, 255);
    this.canvas.stroke(c, c, c);
    this.canvas.fill(c, c, c);

    const points = [];
    times(3, () => {
      const x = rand(0, w),
            y = rand(0, h);
      points.push([x, y]);
    });

    this.canvas.alpha(rand(0.01, 0.025));
    this.canvas.drawPolygon(points, { fill: true });
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
