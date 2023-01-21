import React, { PropsWithChildren } from 'react';
import styles from './Bio.less';

type Link = {
  title: string;
  url: string;
}

const links: Link[] = [
  {
    title: 'Bandcamp',
    url: 'https://coryobrien.bandcamp.com',
  },
  {
    title: 'Github',
    url: 'https://github.com/prtcl'
  },
  {
    title: 'cory@prtcl.cc',
    url: 'mailto:cory@prtcl.cc'
  }
];

const Box = (props: PropsWithChildren) => (
  <div className={styles.box}>{props.children}</div>
);

const ListItem = (props: PropsWithChildren<Link>) => (
  <li className={styles.listItem}>
    <a href={props.url}>{props.title}</a>
  </li>
);

const Bio = () => {
  return (
    <div className={styles.container}>
      <Box>
        <p>Cory O'Brien is a software engineer and sound artist who lives in NYC</p>
      </Box>
      <Box>
        <ul>
          {links.map(link => (
            <ListItem key={link.title} {...link} />
          ))}
        </ul>
      </Box>
    </div>
  );
};

export default Bio;
