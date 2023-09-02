const clamp = (n: number, min: number, max?: number) => {
  let a = min;
  let b = max;

  if (typeof max !== 'number') {
    b = min;
    a = 0;
  }

  return Math.min(Math.max(n, a), b);
};

export default clamp;
