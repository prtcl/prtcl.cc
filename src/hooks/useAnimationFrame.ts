import { useEffect } from 'react';

type AnimationFrameProps = {
  onTick: () => void;
  shouldLoop?: boolean;
}

const useAnimationFrame = (props: AnimationFrameProps) => {
  const { onTick, shouldLoop = true } = props;

  useEffect(() => {
    let frameId: number;

    const tick = () => {
      frameId = requestAnimationFrame(() => {
        onTick();

        if (shouldLoop) {
          tick();
        }
      });
    };

    tick();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [onTick, shouldLoop]);
};

export default useAnimationFrame;
