import { ContentOverlay, Layout, VizContainer } from '~/components/Layout';
import Bio from './components/Bio';
import Visualization from './components/Visualization';

const App = () => {
  return (
    <Layout>
      <VizContainer>
        <Visualization />
      </VizContainer>
      <ContentOverlay>
        <Bio />
      </ContentOverlay>
    </Layout>
  );
};

export default App;
