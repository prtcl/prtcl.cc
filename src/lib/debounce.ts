export interface Debounced<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): void;
  readonly delay: number;
  cancel: () => void;
  flush: () => void;
}

export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 0,
): Debounced<T> => {
  let timerId: ReturnType<typeof setTimeout>;
  let lastArgs: Parameters<T>;
  const cancel = () => clearTimeout(timerId);
  const flush = () => {
    cancel();
    if (timerId && lastArgs) {
      fn(...lastArgs);
    }
  };
  const debounced = (...args: Parameters<T>) => {
    cancel();
    lastArgs = args;
    timerId = setTimeout(() => fn(...args), delay);
  };
  debounced.delay = delay;
  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced;
};
