import { system } from '@theme-ui/presets';
import {
  type Theme,
  type ThemeStyles,
  type ThemeUIStyleObject,
} from 'theme-ui';

const breakpoints: Theme['breakpoints'] = [
  '620px', // Just flip to mobile asap
  '840px', // Nav/content max width
  '1080px',
  '1280px',
];

const colors: Theme['colors'] = {
  ...system.colors,
  text: '#3c3c3c',
  primary: '#0022d1',
  lighter: '#b1b1b1',
  darker: '#818181',
  highlight: 'rgb(245 245 245 / 15%)',
};

const radii: Theme['radii'] = {
  default: '6px',
  sm: '2px',
  lg: '12px',
};

const styles: ThemeStyles = {
  ...system.styles,
  root: {
    ...system.styles.root,
    fontSize: ['18px', '16px'],
    height: '100%',
    lineHeight: '1.42em',
    overflow: 'hidden',
    textRendering: 'optimizeLegibility',
    width: '100%',
    MozOsxFontSmoothing: 'grayscale',
    WebkitFontSmoothing: 'antialiased',
    '*': {
      margin: 0,
      padding: 0,
    },
    '> body': {
      width: '100%',
      height: '100%',
    },
    '#root': {
      width: '100%',
      height: '100%',
    },
    '*::selection': {
      backgroundColor: 'rgba(84, 253, 255, 0.5)',
      color: 'text',
    },
  },
  a: {
    color: 'primary',
    transition: 'all linear 250ms',
    '&:active': { color: 'inherit', backgroundColor: 'highlight' },
    '&:hover': {
      backgroundColor: 'highlight',
    },
  },
};

const buttons: Record<string, ThemeUIStyleObject> = {
  primary: {
    cursor: 'pointer',
    backgroundColor: 'primary',
    borderRadius: 'default',
    transition: 'all linear 250ms',
    '&:active': { backgroundColor: 'secondary' },
    '&:disabled': { cursor: 'not-allowed' },
  },
};

const forms: Theme['forms'] = {
  input: {
    backgroundColor: 'rgba(255, 255, 255, 50%)',
    borderColor: 'rgb(166 166 166 / 72%)',
    borderRadius: 'default',
    '&::placeholder': { color: 'lighter' },
    '&:focus-within': { outline: '1px solid rgb(182 182 182 / 40%)' },
  },
};

export const theme: Theme = {
  ...system,
  breakpoints,
  buttons,
  colors,
  forms,
  radii,
  styles,
};
