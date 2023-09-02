import type { IconType } from 'react-icons';
import { Flex, Link } from 'theme-ui';

export type LinkConfig = {
  title: string;
  url: string;
  icon?: IconType;
};

const ListItem = (props: { link: LinkConfig }) => {
  const { link } = props;
  const Icon = link.icon;

  return (
    <Link href={link.url} sx={{ textDecoration: 'none' }}>
      <Flex sx={{ alignItems: 'center' }}>
        {Icon && (
          <Flex sx={{ marginRight: 1 }}>
            <Icon size="1em" />
          </Flex>
        )}
        <Flex>{link.title}</Flex>
      </Flex>
    </Link>
  );
};

export default ListItem;
