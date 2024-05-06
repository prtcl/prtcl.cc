import {
  defineConfig,
  defineGlobalStyles,
  defineSemanticTokens,
} from '@pandacss/dev';

const globalCss = defineGlobalStyles({
  html: {
    width: '100%',
    height: '100%',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  'html, body, #root': {
    fontSize: '16px',
    fontWeight: 400,
    height: '100%',
    lineHeight: '24px',
    width: '100%',
  },
});

const semanticTokens = defineSemanticTokens({
  colors: {
    primary: {
      value: '#0022d1',
    },
    text: {
      DEFAULT: { value: '#3c3c3c' },
      lighter: { value: '#b1b1b1' },
      darker: { value: '#818181' },
    },
  },
});

export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  include: ['./src/**/*.{js,jsx,ts,tsx}', './packages/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  globalCss,
  theme: {
    semanticTokens,
  },
});
