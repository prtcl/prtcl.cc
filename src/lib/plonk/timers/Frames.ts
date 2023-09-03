import ms, { TimeFormat, type FPS } from '../maths/ms';
import Metro, { type TimerCallback, type MetroOptions } from './Metro';

export type FramesOptions = {
  fps: FPS;
};

export const DEFAULT_FPS: FPS = 60;

export const parseOptions = (opts?: FramesOptions): MetroOptions => {
  const { fps } = {
    fps: DEFAULT_FPS,
    ...opts,
  };

  return {
    time: ms(fps, TimeFormat.FPS),
  };
};

export default class Frames extends Metro {
  protected _timerId: ReturnType<typeof requestAnimationFrame>;

  constructor(callback: TimerCallback, opts?: FramesOptions) {
    super(callback, parseOptions(opts));
  }

  asyncHandler(callback: () => void) {
    this._timerId = requestAnimationFrame(callback);
  }

  clearAsyncHandler() {
    cancelAnimationFrame(this._timerId);
  }

  setFPS = (opts: Pick<FramesOptions, 'fps'>) => {
    const { fps = DEFAULT_FPS } = opts;
    this.setTime(ms(fps, TimeFormat.FPS));
  };
}
