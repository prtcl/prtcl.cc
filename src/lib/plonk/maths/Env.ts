import Scale from './Scale';

export type EnvOptions = {
  from?: number;
  time: number;
  to?: number;
};

export type EnvState = {
  from: number;
  prevNow: number;
  prevValue: number | undefined;
  time: number;
  to: number;
  totalElapsed: number;
};

export const parseOptions = (opts?: EnvOptions): EnvOptions => {
  return {
    from: 0,
    to: 1,
    ...opts,
  };
};

export const getDerivedStateFromOptions = (
  opts: EnvOptions | undefined,
  prevState: EnvState,
): EnvState => {
  const { from, to, time } = {
    ...prevState,
    ...opts,
  };

  return {
    ...prevState,
    from,
    time,
    to,
    totalElapsed: 0,
  };
};

export default class Env {
  state: EnvState;
  protected _interpolator: Scale;

  constructor(opts?: EnvOptions) {
    const { from, to, time } = parseOptions(opts);

    this._interpolator = new Scale({
      from: {
        min: 0,
        max: time,
      },
      to: {
        min: from,
        max: to,
      },
    });
    this.state = {
      from,
      prevValue: from,
      prevNow: performance.now(),
      time,
      to,
      totalElapsed: 0,
    };
  }

  setTime(time: number) {
    const { to, totalElapsed } = this.state;

    this.state = {
      ...this.state,
      ...(time <= totalElapsed
        ? {
            time,
            prev: to,
          }
        : { time }),
    };
  }

  reset(opts?: EnvOptions) {
    const updates = getDerivedStateFromOptions(opts, this.state);

    this.state = {
      ...updates,
      prevNow: performance.now(),
      prevValue: updates.from,
    };
    this._interpolator.setRanges({
      from: {
        min: 0,
        max: updates.time,
      },
      to: {
        min: updates.from,
        max: updates.to,
      },
    });
  }

  hasEnded() {
    const { time, totalElapsed } = this.state;

    return time <= totalElapsed;
  }

  value() {
    return this.state.prevValue;
  }

  next() {
    const { from, prevNow, to, totalElapsed: prevTotalElapsed } = this.state;

    if (this.hasEnded()) {
      return to;
    }

    const tickInterval = performance.now() - prevNow;
    const totalElapsed = prevTotalElapsed + tickInterval;
    const updates = this._interpolator.scale(totalElapsed);
    const value = from > to ? Math.min(updates, from) : Math.min(updates, to);

    this.state = {
      ...this.state,
      prevNow: performance.now(),
      prevValue: value,
      totalElapsed,
    };

    return value;
  }
}
