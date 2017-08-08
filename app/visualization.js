
import { frames } from 'plonk';
import debounce from 'lodash-es/debounce';
import times from 'lodash-es/times';

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
    const polygons = store.state.polygons,
          nPolygons = polygons.length,
          nPoints = polygons[0].points.length;

    this._scaledPolygons = times(polygons.length, () => times(nPoints, () => [0, 0]));

    const canvas = this.canvas.resize();

    const tickHandler = () => {
      canvas.clear();
      canvas.stroke(255, 255, 255);
      canvas.strokeWidth(1);

      const w = canvas.width,
            h = canvas.height;

      for (let i = 0; i < nPolygons; i++) {
        const polygon = polygons[i],
              polyPoints = polygon.points,
              scaledPolygon = this._scaledPolygons[i];

        for (let k = 0; k < nPoints; k++) {
          const point = polyPoints[k],
                scaledPoint = scaledPolygon[k];

          scaledPoint[0] = point[0] * w;
          scaledPoint[1] = point[1] * h;
        }

        canvas.alpha(polygon.strength);
        canvas.drawPolygon(scaledPolygon, false);
      }
    };

    frames(tickHandler)
      .catch(console.error);

    return this;
  }

};
