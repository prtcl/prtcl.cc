import { ConvexQueryCacheProvider } from 'convex-helpers/react/cache';
import { ConvexReactClient, ConvexProvider } from 'convex/react';
import { createRoot } from 'react-dom/client';
import { ProjectProvider } from '~/feat/Projects';
import { ErrorBoundary, Fallback } from '~/lib/errors';
import App from './App';
import './main.css';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const root = createRoot(document.getElementById('root'));

root.render(
  <ErrorBoundary fallback={() => <Fallback title="Error" />}>
    <ConvexProvider client={convex}>
      <ConvexQueryCacheProvider>
        <ProjectProvider>
          <App />
        </ProjectProvider>
      </ConvexQueryCacheProvider>
    </ConvexProvider>
  </ErrorBoundary>,
);
