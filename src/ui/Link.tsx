import { styled } from 'styled-system/jsx';

export const Link = styled('a', {
  base: {
    borderBottom: '1px solid currentColor',
    color: 'text',
    textDecoration: 'none',
    width: 'fit-content',
    _hover: {
      borderBottomColor: 'transparent',
    },
  },
});
