import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import type { LinkProps } from 'theme-ui';
import { Flex, Link } from 'theme-ui';

export type LinkConfig = {
  title: string;
  url: string;
  icon?: IconType | (() => ReactNode);
};

const ListItem = (props: Omit<LinkProps, 'href'> & { link: LinkConfig }) => {
  const { link, ...linkProps } = props;
  const Icon = link.icon;

  return (
    <Link
      {...linkProps}
      href={link.url}
      sx={{ ...linkProps.sx, textDecoration: 'none', width: 'fit-content' }}
    >
      <Flex sx={{ alignItems: 'center' }}>
        {Icon && (
          <Flex sx={{ marginRight: 1 }}>
            <Icon size="1.5em" />
          </Flex>
        )}
        <Flex>{link.title}</Flex>
      </Flex>
    </Link>
  );
};

export default ListItem;
