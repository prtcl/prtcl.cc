import { SIXTY_FPS } from '../constants';

export type MetroOptions = {
  time?: number;
};

export type TimerState = {
  initialTime: number;
  isRunning: boolean;
  iterations: number;
  offset: number;
  prev: number;
  tickInterval: number;
  time: number;
  totalElapsed: number;
};

export type TimerCallback = (metro: Metro) => void;

export const getInitialState = (initialTime: number): TimerState => ({
  initialTime,
  isRunning: false,
  iterations: -1,
  offset: 0,
  prev: 0,
  tickInterval: 0,
  time: initialTime,
  totalElapsed: 0,
});

export const parseOptions = (opts?: MetroOptions): MetroOptions => {
  return {
    time: SIXTY_FPS,
    ...opts,
  };
};

export default class Metro {
  state: TimerState;
  protected _listeners: TimerCallback[];
  protected _timerId: ReturnType<typeof setTimeout> | number;

  static processTimerState = (
    state: TimerState,
    callback: (state: TimerState) => void,
  ): TimerState => {
    if (state.iterations === -1) {
      const updates: TimerState = {
        ...state,
        prev: performance.now(),
        iterations: 0,
      };

      callback(updates);

      return updates;
    }

    const { time, prev, offset, totalElapsed, iterations } = state;
    const tickInterval = performance.now() - prev;

    if (tickInterval <= time + offset) {
      return state;
    }

    const updates = {
      ...state,
      iterations: iterations + 1,
      prev: performance.now(),
      tickInterval,
      totalElapsed: totalElapsed + tickInterval,
    };

    callback(updates);

    return updates;
  };

  constructor(callback: TimerCallback, opts?: MetroOptions) {
    const { time } = parseOptions(opts);

    this.state = getInitialState(time);
    this._listeners = [callback];
  }

  asyncHandler(callback: () => void) {
    this._timerId = setTimeout(callback, SIXTY_FPS);
  }

  clearAsyncHandler() {
    clearTimeout(this._timerId as ReturnType<typeof setTimeout>);
  }

  stop = () => {
    const { totalElapsed } = this.state;
    this.reset();
    this.clearAsyncHandler();

    return totalElapsed;
  };

  reset = () => {
    const { initialTime } = this.state;
    this.state = getInitialState(initialTime);
  };

  setTime = (updatedTime = this.state.time) => {
    const time = Math.max(updatedTime, 0);

    this.state = {
      ...this.state,
      time,
      initialTime: time,
    };
  };

  run = () => {
    const { isRunning } = this.state;

    if (isRunning) {
      return;
    }

    this.state = {
      ...this.state,
      isRunning: true,
      prev: performance.now(),
    };

    const tick = () => {
      this.clearAsyncHandler();

      Metro.processTimerState(this.state, (updates) => {
        this.state = updates;
        this._listeners.forEach((listener) => {
          listener(this);
        });
      });

      if (this.state.isRunning) {
        this.asyncHandler(tick);
      }
    };

    tick();
  };
}
