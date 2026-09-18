import { Link as TsLinkBase } from '@tanstack/react-router';
import { styled } from 'styled-system/jsx';
import type { RecipeDefinition } from 'styled-system/types';

const linkStyles: RecipeDefinition['base'] = {
  color: 'text',
  cursor: 'pointer',
  textDecoration: 'none',
};

const variantStyles: RecipeDefinition['variants'] = {
  visual: {
    underline: {
      borderBottom: '1px solid currentColor',
      width: 'fit-content',
      _hover: {
        borderBottomColor: 'transparent',
      },
    },
    basic: {
      width: '100%',
      _active: {
        opacity: 0.75,
      },
    },
  },
};

export const Link = styled('a', {
  base: { ...linkStyles },
  variants: { ...variantStyles },
  defaultVariants: {
    visual: 'underline',
  },
});

export const TsLink = styled(TsLinkBase, {
  base: { ...linkStyles },
  variants: { ...variantStyles },
  defaultVariants: {
    visual: 'underline',
  },
});
