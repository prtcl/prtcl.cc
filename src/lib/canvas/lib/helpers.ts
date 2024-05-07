import type { Color } from '../types';

export const colorToRgba = (color: Color): string => {
  const { r, g, b, a = 255 } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
