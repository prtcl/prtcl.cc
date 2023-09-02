import { Layout } from '~/components/Layout';
import { Box } from 'theme-ui';
import Bio from './components/Bio';
import Visualization from './components/Visualization';

const App = () => {
  return (
    <Layout>
      <Box
        sx={{
          height: '100%',
          left: 0,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 0,
        }}
      >
        <Visualization />
      </Box>
      <Box sx={{ position: 'fixed', zIndex: 9999 }}>
        <Bio />
      </Box>
    </Layout>
  );
};

export default App;
