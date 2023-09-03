import { useEffect, useMemo, useRef } from 'react';
import Metro, { type TimerCallback, type MetroOptions } from '../timers/Metro';
import usePrevious from './usePrevious';

const useMetro = (callback: TimerCallback, opts?: MetroOptions) => {
  const callbackRef = useRef<TimerCallback>(callback);
  const optsRef = useRef<MetroOptions>(opts);
  const prevOpts = usePrevious(opts);

  callbackRef.current = callback;

  const metro = useMemo<Metro>(() => {
    return new Metro((m: Metro) => {
      callbackRef.current(m);
    }, optsRef.current);
  }, []);

  useEffect(() => {
    if (opts && prevOpts && opts.time !== prevOpts.time) {
      const { time } = opts;

      metro.setTime(time);
    }
  }, [opts, prevOpts, metro]);

  useEffect(() => {
    metro.run();
  }, [metro]);

  return metro;
};

export default useMetro;
