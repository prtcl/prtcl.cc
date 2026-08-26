import {
  defineConfig,
  defineGlobalStyles,
  defineKeyframes,
  defineSemanticTokens,
} from '@pandacss/dev';

const globalCss = defineGlobalStyles({
  ':root': {
    fontSize: '16px',
    fontFamily:
      "-apple-system-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    fontWeight: 400,
    lineHeight: '24px',
    fontFeatureSettings: '"kern" 1',
    fontKerning: 'normal',
    textRendering: 'optimizeLegibility',
    WebkitFontSmoothing: 'subpixel-antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  html: {
    width: '100%',
    height: '100%',
    touchAction: 'manipulation',
  },
  body: {
    bg: 'white',
  },
  'html, body, #root': {
    height: '100%',
    touchAction: 'pan-y',
    width: '100%',
  },
  '*': {
    WebkitTapHighlightColor: 'transparent',
  },
  '*::selection': {
    backgroundColor: 'rgba(84, 253, 255, 0.5)',
    color: 'text',
  },
  'h1, h2, h3': {
    fontFamily:
      "-apple-system-headline, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  },
  button: {
    fontFamily:
      "-apple-system-short-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  },
});

const semanticTokens = defineSemanticTokens({
  colors: {
    text: {
      DEFAULT: { value: '#0c0c0c' },
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
  presets: ['@pandacss/preset-panda'],
  preflight: true,
  jsxFramework: 'react',
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  globalCss,
  outdir: 'styled-system',
  theme: {
    keyframes,
    semanticTokens,
  },
});
