import { createRoot } from 'react-dom/client';
import { ThemeUIProvider } from 'theme-ui';
import App from './App';
import { theme } from './lib/theme';

const container = document.getElementById('root') as Element;
const root = createRoot(container);

root.render(
  <ThemeUIProvider theme={theme}>
    <App />
  </ThemeUIProvider>,
);
