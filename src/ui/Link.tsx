import { styled } from 'styled-system/jsx';

export const Link = styled('a', {
  base: {
    color: 'text',
    textDecoration: 'none',
    width: 'fit-content',
    _hover: {
      textDecoration: 'underline',
    },
  },
});
