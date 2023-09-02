import type { LinkConfig } from '~/components/ListItem';

export const name = "Cory O'Brien";

export const tagline = `${name} is a software engineer and sound artist who lives in NYC`;

const links: LinkConfig[] = [
  {
    title: 'Bandcamp',
    url: 'https://coryobrien.bandcamp.com',
  },
  {
    title: 'Github',
    url: 'https://github.com/prtcl',
  },
  {
    title: 'cory@prtcl.cc',
    url: 'mailto:cory@prtcl.cc',
  },
];

export default {
  links,
  name,
  tagline,
};
