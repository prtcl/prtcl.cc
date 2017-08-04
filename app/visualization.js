
import { frames } from 'plonk';
import debounce from 'lodash-es/debounce';

import CanvasWrapper from './lib/CanvasWrapper';
import store from './store';

export default {

  attach (el) {
    this.el = el;
    this.canvas = new CanvasWrapper(this.el);

    window.addEventListener('resize', debounce(() => this.canvas.resize(), 150));

    return this;
  },

  run () {
    const canvas = this.canvas.resize();

    const tickHandler = () => {
      canvas.clear();
      canvas.stroke(255, 255, 255);
      canvas.fill(255, 255, 255);

      const w = canvas.width,
            h = canvas.height;

      const polygons = store.state.polygons;

      for (let j = 0; j < polygons.length; j++) {
        const polygon = polygons[j],
              points = polygon.points.map((p) => [p[0] * w, p[1] * h]);

        canvas.alpha(polygon.strength);
        canvas.drawPolygon(points, true);
      }
    };

    frames(tickHandler)
      .catch(console.error);

    return this;
  }

};
