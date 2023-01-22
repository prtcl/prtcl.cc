const debounce = (callback: () => void, time = 50) => {
  let timerId: NodeJS.Timeout;

  return () => {
    clearTimeout(timerId);
    timerId = setTimeout(callback, time);
  };
};

export default debounce;
