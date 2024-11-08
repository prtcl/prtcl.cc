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
        style: { minHeight: '435px' },
      };
    }
    case Service.YOUTUBE: {
      return {
        allowtransparency: 'true',
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        referrerPolicy: 'strict-origin-when-cross-origin',
        style: { minHeight: '315px' },
      };
    }
    case Service.SOUNDCLOUD: {
      return {
        allow: 'autoplay',
        frameBorder: 'no',
        scrolling: 'no',
        style: { minHeight: '300px' },
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
    <Flex fontSize={0} height="100%" lineHeight={0} width="100%">
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
