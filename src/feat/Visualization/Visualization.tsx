import { useEffect, useRef } from 'react';
import { useFrames } from '@prtcl/plonk-hooks';
import { Flex } from 'styled-system/jsx';
import { Canvas, useCanvas } from '~/lib/canvas';
import { debounce } from '~/lib/debounce';
import { useBreakpoints } from '~/lib/viewport';
import useVisualization from './hooks/useVisualization';

export const Visualization = () => {
  const { isMobile } = useBreakpoints();
  const containerRef = useRef<HTMLDivElement>(null);
  const { canvas, props: canvasProps, isReady } = useCanvas();
  const { shapes } = useVisualization();

  useEffect(() => {
    const resize = debounce(() => {
      const rect = containerRef.current.getBoundingClientRect();
      canvas.resize(rect);
    }, 500);

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      resize.cancel();
    };
  }, [canvas]);

  useFrames(() => {
    if (!isReady) {
      return;
    }

    const { width, height } = canvas.size;

    canvas.alpha(0.05);
    canvas.fill({ r: 255, g: 255, b: 255 });
    canvas.drawRect({
      x: 0,
      y: 0,
      width,
      height,
    });

    shapes.forEach((shape) => {
      const driftX = shape.drift.x.next() * (width / (isMobile ? 2 : 4));
      const driftY = shape.drift.y.next() * (height / 4);
      const posX = shape.pos.x.next() * (width / 2) + driftX;
      const posY = shape.pos.y.next() * (height / 2) + driftY;

      canvas.alpha(0.01);
      canvas.strokeWeight(0);
      canvas.fill({
        r: shape.color.r.value(),
        g: shape.color.g.value(),
        b: shape.color.b.value(),
      });

      canvas.drawPolygon(
        {
          coords: shape.points.map((point) => {
            const x = posX + point.x.next() * (width / 2);
            const y = posY + point.y.next() * (height / 2);

            return [x, y];
          }),
        },
        { shouldFill: true },
      );
    });
  });

  return (
    <Flex ref={containerRef} width="100%" height="100%">
      <Canvas {...canvasProps} />
    </Flex>
  );
};
