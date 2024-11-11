import {
  defineConfig,
  defineGlobalStyles,
  defineKeyframes,
  defineSemanticTokens,
} from '@pandacss/dev';

const globalCss = defineGlobalStyles({
  'html, body, #root': {
    height: '100%',
    width: '100%',
  },
  ':root': {
    fontSize: '16px',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
    fontWeight: 400,
    lineHeight: '1.42em',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'antialiased',
  },
  '@media (max-width: 640px)': {
    ':root': {
      fontSize: '18px',
    },
  },
  '*::selection': {
    backgroundColor: 'rgba(84, 253, 255, 0.5)',
    color: 'text',
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

export const keyframes = defineKeyframes({
  'fade-in': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  rotate: {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
});

export default defineConfig({
  globalCss,
  include: ['./src/**/*.{js,jsx,ts,tsx}', './packages/**/*.{js,jsx,ts,tsx}'],
  jsxFramework: 'react',
  outdir: 'styled-system',
  prefix: 'prtcl',
  preflight: true,
  separator: '-',
  theme: {
    keyframes,
    semanticTokens,
  },
});
