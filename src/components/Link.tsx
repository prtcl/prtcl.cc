import { styled } from 'styled-system/jsx';

const Link = styled('a', {
  base: {
    color: 'text',
    textDecoration: 'none',
    width: 'fit-content',
    _hover: {
      textDecoration: 'underline',
    },
  },
});

export default Link;
