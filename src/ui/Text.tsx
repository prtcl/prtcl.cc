import { styled } from 'styled-system/jsx';

export const Text = styled('span', {
  base: {
    color: 'text',
  },
  variants: {
    visual: {
      inline: {},
      paragraph: {
        display: 'block',
        mb: 4,
      },
    },
    size: {
      sm: { fontSize: 'sm' },
      md: { fontSize: 'md' },
      lg: { fontSize: 'lg' },
    },
  },
  defaultVariants: {
    size: 'md',
    visual: 'inline',
  },
});
