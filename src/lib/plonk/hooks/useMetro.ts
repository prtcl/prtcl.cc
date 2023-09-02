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
    metro.run();
  }, [metro]);

  useEffect(() => {
    if (opts !== prevOpts) {
      const { time } = opts;

      metro.setTime(time);
    }
  }, [opts, prevOpts, metro]);

  return metro;
};

export default useMetro;
