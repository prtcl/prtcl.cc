import clamp from './clamp';

export type ScaleRange = {
  min?: number;
  max: number;
};

export type ScaleOptions = {
  from?: ScaleRange;
  to: ScaleRange;
};

export type ScaleState = {
  from: ScaleRange;
  to: ScaleRange;
  prev: number | undefined;
};

export const parseOptions = (opts?: ScaleOptions): ScaleOptions => {
  const { from, to } = {
    ...opts,
    from: {
      min: 0,
      max: 1,
      ...opts?.from,
    },
    to: {
      min: 0,
      max: 1,
      ...opts?.to,
    },
  };

  return {
    from,
    to,
  };
};

export const getDerivedStateFromOptions = (
  opts: ScaleOptions,
  prevState: ScaleState,
): ScaleState => {
  const { from, to } = opts;

  return {
    ...prevState,
    from: {
      ...prevState.from,
      ...from,
    },
    to: {
      ...prevState.to,
      ...to,
    },
  };
};

export default class Scale {
  state: ScaleState;

  constructor(opts?: ScaleOptions) {
    const { from, to } = parseOptions(opts);
    this.state = { from, to, prev: undefined };
  }

  setRanges(opts: ScaleOptions) {
    this.state = getDerivedStateFromOptions(opts, this.state);
  }

  reset(opts: ScaleOptions) {
    const { from, to } = parseOptions(opts);
    this.state = { from, to, prev: undefined };
  }

  value() {
    return this.state.prev;
  }

  scale(n: number) {
    const { from, to } = this.state;
    const value =
      to.min +
      ((clamp(n, from.min, from.max) - from.min) * (to.max - to.min)) /
        (from.max - from.min);

    this.state.prev = value;

    return value;
  }
}
