import { ConvexReactClient, ConvexProvider } from 'convex/react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './main.css';

const convex = new ConvexReactClient(process.env.CONVEX_URL);
const root = createRoot(document.getElementById('root'));

root.render(
  <ConvexProvider client={convex}>
    <App />
  </ConvexProvider>,
);
