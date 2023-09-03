import { clamp } from 'lodash';

export type RandOptions = {
  min?: number;
  max?: number;
};

export type RandState = {
  min: number;
  max: number;
  prev: number | undefined;
};

export const parseOptions = (opts?: RandOptions): RandOptions => {
  return {
    min: 0,
    max: 1,
    ...opts,
  };
};

export default class Rand {
  state: RandState;

  constructor(opts?: RandOptions) {
    const { min, max } = parseOptions(opts);

    this.state = { max, min, prev: undefined };
    this.next();
  }

  setRange(partialOpts: RandOptions) {
    const { min, max } = {
      ...this.state,
      ...partialOpts,
    };

    this.state = {
      ...this.state,
      max,
      min,
      prev: clamp(this.state.prev, min, max),
    };
  }

  value() {
    return this.state.prev;
  }

  next() {
    const { min, max } = this.state;
    const value = Math.random() * (max - min) + min;
    this.state.prev = value;

    return value;
  }
}
