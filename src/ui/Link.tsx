import { styled } from 'styled-system/jsx';

export const Link = styled('a', {
  base: {
    color: 'text',
    textDecoration: 'underline',
    width: 'fit-content',
    _hover: {
      textDecoration: 'none',
    },
  },
});
