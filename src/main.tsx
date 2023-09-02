import { ThemeUIProvider } from 'theme-ui';
import { createRoot } from 'react-dom/client';
import { theme } from './utils/theme';
import App from './App';

const container = document.getElementById('root') as Element;
const root = createRoot(container);

root.render(
  <ThemeUIProvider theme={theme}>
    <App />
  </ThemeUIProvider>,
);
