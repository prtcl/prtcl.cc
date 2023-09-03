import { useEffect, useMemo, useRef } from 'react';
import { type TimerCallback } from '../timers/Metro';
import Frames, { type FramesOptions } from '../timers/Frames';
import usePrevious from './usePrevious';
import ms, { TimeFormat } from '../maths/ms';

const useFrames = (callback: TimerCallback, opts?: FramesOptions) => {
  const callbackRef = useRef<TimerCallback>(callback);
  const optsRef = useRef<FramesOptions>(opts);
  const prevOpts = usePrevious(opts);

  callbackRef.current = callback;

  const frames = useMemo<Frames>(() => {
    return new Frames((m: Frames) => {
      callbackRef.current(m);
    }, optsRef.current);
  }, []);

  useEffect(() => {
    if (opts && prevOpts && opts.fps !== prevOpts.fps) {
      const { fps } = opts;
      frames.setFPS({ fps });
    }
  }, [opts, prevOpts, frames]);

  useEffect(() => {
    frames.run();
  }, [frames]);

  return frames;
};

export default useFrames;
