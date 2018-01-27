import { drunk } from 'plonk';

const createDrunk = (...args) => {
  const d = drunk(...args);
  return () => d();
};

const sigmoid = (n) => 1 / (1 + Math.exp(-n));

export const create = (...size) => {
  const weights = new Array(size.length).fill(null);
  const biases = new Array(size.length).fill(null);
  const end = size.length - 1;
  let index = 0;

  while (index++ < end) {
    const layerSize = size[index];
    const prevSize = size[index - 1];
    biases[index] = new Float32Array(layerSize)
      .map(createDrunk(-0.4, 0.4, 0.5));
    weights[index] = new Array(layerSize).fill(null)
      .map(() => new Float32Array(prevSize)
        .map(createDrunk(-0.8, 0.8, 0.5)));
  }

  return { biases, size, weights };
};

export const process = ({
  biases,
  size,
  weights
}, input = []) => {
  const values = size.map((s) => new Float32Array(s));

  for (let i = 1; i < size.length; i++) {
    const layerSize = size[i];
    const layerWeights = weights[i];
    const layerBiases = biases[i];
    const layerValues = values[i];

    for (let j = 0; j < layerSize; j++) {
      const nodeWeights = layerWeights[j];
      const nodeBias = layerBiases[j];
      const nodeLen = nodeWeights.length;
      let sum = nodeBias;

      for (var k = 0; k < nodeLen; k++) {
        sum += nodeWeights[k] * input[k];
      }

      layerValues[j] = sigmoid(sum);
    }

    input = layerValues;
  }

  return values[values.length - 1];
};
