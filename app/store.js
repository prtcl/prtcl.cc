
import {
  drunk,
  env,
  exp,
  metro,
  ms,
  rand,
  scale
} from 'plonk';

export const state = {
  triangles: []
};

export default {
  state,
  run
};

// var stepAmount = 0;

const stepAmounts = [0.1, 0.1, 0.1, 0.1];

const positionDrunks = [
  { x: drunk(0.45, 0.8, 0.1), y: drunk(0.05, 0.4, 0.1) },
  { x: drunk(0.7, 0.8, 0.1), y: drunk(0.7, 0.8, 0.1) },
  { x: drunk(0.05, 0.4, 0.1), y: drunk(0.6, 0.8, 0.1) },
  { x: drunk(0.05, 0.4, 0.1), y: drunk(0.6, 0.8, 0.1) }
];

function run () {
  metro(ms('60fps'), tick);
  // runStepEnvelope(0);
  // runStepEnvelope(1);
  // runStepEnvelope(2);
  // runStepEnvelope(3);
}

function tick () {

  const points = positionDrunks.map((d, i) => {
    const x = d.x(stepAmounts[i]),
          y = d.y(stepAmounts[i]);
    return [x, y];
  });

  const tri = {
    color: [rand(0, 255), rand(0, 255), rand(0, 255)],
    fill: true,
    points,
    strength: 0.5
  };

  addTriangle(tri);

}

function addTriangle (tri) {

  if (state.triangles.length > 20) {
    state.triangles = state.triangles.slice(1);
  }

  state.triangles.forEach((t, i) => {
    t.strength = exp(scale(i, 0, state.triangles.length - 1, 0, 1)) * 0.25;
  });

  state.triangles.push(tri);
}

function runStepEnvelope (i) {
  const time = rand(100, 3400);

  env(0, 0.05, time * 0.8)
    .progress(setStepAmount)
    .then((val) => {
      setStepAmount(val);
      return env(0.05, 1, time * 0.025);
    })
    .progress(setStepAmount)
    .then((val) => {
      setStepAmount(val);
      return env(1, 0.25, time * 0.025);
    })
    .progress(setStepAmount)
    .then((val) => {
      setStepAmount(val);
      return env(0.25, 0, time * 0.15);
    })
    .progress(setStepAmount)
    .then((val) => {
      setStepAmount(val);
      runStepEnvelope(i);
    });

  function setStepAmount (val) {
    // const amt = scale(val, 0, 1, 0, 1);
    stepAmounts[i] = val;
  }
}
