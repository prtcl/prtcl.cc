import { Flex, styled, type HTMLStyledProps } from 'styled-system/jsx';

export enum Service {
  YOUTUBE = 'youtube',
  BANDCAMP = 'bandcamp',
  SOUNDCLOUD = 'soundcloud',
}

type Services = `${Service}`;

export type ServiceProps = HTMLStyledProps<'iframe'> & {
  allowtransparency?: string;
  referrerpolicy?: string;
  frameborder?: string;
};

const getServiceProps = (service: Services): ServiceProps => {
  switch (service) {
    case Service.BANDCAMP: {
      return {
        allowtransparency: 'true',
        minHeight: '435px',
      };
    }
    case Service.YOUTUBE: {
      return {
        allowtransparency: 'true',
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        referrerPolicy: 'strict-origin-when-cross-origin',
        minHeight: '315px',
      };
    }
    case Service.SOUNDCLOUD: {
      return {
        allow: 'autoplay',
        frameBorder: 'no',
        maxHeight: '300px',
        scrolling: 'no',
      };
    }
    default: {
      return {};
    }
  }
};

export interface MediaEmbedProps {
  src: string;
  service: Services;
  title?: string;
}

export const MediaEmbed = (props: MediaEmbedProps) => {
  const { src, service, title = 'Video' } = props;
  const serviceProps = getServiceProps(service);

  return (
    <Flex
      fontSize={0}
      height="100%"
      lineHeight={0}
      overflow="hidden"
      width="100%"
    >
      <styled.iframe
        allowFullScreen
        background="transparent"
        border={0}
        borderRadius={0}
        borderStyle="none"
        display="block"
        frameBorder={0}
        margin={0}
        outline="none"
        padding={0}
        seamless={true}
        src={src}
        title={title}
        width="100%"
        {...serviceProps}
      />
    </Flex>
  );
};
