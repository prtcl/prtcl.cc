import React, { useCallback } from 'react';
import Canvas from '../Canvas';

const Visualization = () => {
  const handleTick = useCallback(() => {
    console.log(Date.now());
  }, []);

  return <Canvas draw={handleTick} />;
};

export default Visualization;
