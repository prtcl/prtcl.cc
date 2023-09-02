import { type PropsWithChildren } from 'react';
import { Box } from 'theme-ui';

type Link = {
  title: string;
  url: string;
};

const links: Link[] = [
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

const ListItem = (props: PropsWithChildren<Link>) => (
  <li>
    <a href={props.url}>{props.title}</a>
  </li>
);

const Bio = () => {
  return (
    <div>
      <Box>
        <p>
          Cory O&apos;Brien is a software engineer and sound artist who lives in
          NYC
        </p>
      </Box>
      <Box>
        <ul>
          {links.map((link) => (
            <ListItem key={link.title} {...link} />
          ))}
        </ul>
      </Box>
    </div>
  );
};

export default Bio;
