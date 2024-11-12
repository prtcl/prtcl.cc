import BaseMarkdown from 'react-markdown';
import { styled } from 'styled-system/jsx';

export const Markdown = styled(BaseMarkdown, {
  base: {
    color: 'text',
    fontSize: ['0.96rem', '0.93rem'],
    '& h1': {
      fontSize: '1.35em',
      lineHeight: '1.35em',
    },
    '& h2, & h3': {
      fontSize: '1.125em',
      lineHeight: '1.125em',
    },
    '& p': {
      fontSize: '1em',
      lineHeight: '1.35em',
    },
    '& h1, & h2, & h3, & p': {
      marginBottom: 3,
    },
    '& p:last-child': {
      marginBottom: 1,
    },
  },
});
