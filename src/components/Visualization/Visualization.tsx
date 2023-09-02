import { Flex } from 'theme-ui';
import { Canvas, useCanvasApi } from '~/lib/canvas';

const Visualization = () => {
  const { canvas, props: canvasProps } = useCanvasApi();

  console.log(canvas);

  return (
    <Flex sx={{ width: '100%', height: '100%' }}>
      <Canvas {...canvasProps} />
    </Flex>
  );
};

export default Visualization;
