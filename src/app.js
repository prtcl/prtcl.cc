import { dust, frames, rand } from 'plonk';
import './app.less';
import * as NN from './lib/NN';

const state = {
  height: 0,
  nn: null,
  posX: 0,
  posY: 0,
  speedX: 0,
  speedY: 0,
  width: 0
};

const debounce = (fn, time) => {
  let t;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, time);
  };
};

const getSpeed = () => rand(0.0001, 0.1);

const color = (r, g, b, a = 255) => `rgba(${r}, ${g}, ${b}, ${a})`;

const run = () => {
  const canvas = document.getElementById('visualization');
  const context = canvas.getContext('2d');

  const resize = () => {
    canvas.width = state.width = canvas.clientWidth;
    canvas.height = state.height = canvas.clientHeight;
  };

  const alpha = (alpha) => {
    context.globalAlpha = alpha;
  };

  const clear = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const stroke = (r, b, g, a) => {
    context.strokeStyle = color(r, g, b, a);
  };

  const strokeWeight = (width) => {
    context.lineWidth = Math.max(width, 0.0001);
  };

  const fill = (r, g, b, a) => {
    context.fillStyle = color(r, g, b, a);
  };

  const drawPolygon = (points, fill = false) => {
    const len = points.length;
    let i = 0;

    context.beginPath();

    while (i < len) {
      const x = points[i] * state.width;
      const y = points[i + 1] * state.height;

      if (i === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }

      i += 2;
    }

    if (fill === true) {
      context.fill();
    }

    context.closePath();
    context.stroke();
  };

  const reset = () => {
    state.nn = NN.create(2, 6, 8);
    state.speedX = getSpeed();
    state.speedY = getSpeed();
    state.posX = 0;
    state.posY = 0;
    clear();
  };

  const draw = () => {
    state.posX += state.speedX;
    state.posY += state.speedY;
    const poly = NN.process(state.nn, [state.posX, state.posY]);

    alpha(0.035);
    fill(255, 255, 255);
    stroke(255, 255, 255);
    strokeWeight(1);
    drawPolygon(poly, true);
  };

  frames(draw)
    .catch(console.error);

  dust(2200, 10000, reset)
    .catch(console.error);

  reset();
  resize();
  window.addEventListener('resize', debounce(resize, 250));
};

window.addEventListener('load', run);
