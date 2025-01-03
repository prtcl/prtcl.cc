import { useState } from 'react';
import { Rand } from '@prtcl/plonk';
import { useMetro } from '@prtcl/plonk-hooks';
import {
  Box,
  Flex,
  styled,
  type FlexProps,
  type HTMLStyledProps,
} from 'styled-system/jsx';
import { Loader } from './Loader';

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

const getServiceProps = (service: Services, embedUrl: string): ServiceProps => {
  switch (service) {
    case Service.BANDCAMP: {
      return {
        allowtransparency: 'true',
        style: {
          minHeight: embedUrl.includes('VideoEmbed') ? '380px' : '120px',
        },
      };
    }
    case Service.YOUTUBE: {
      return {
        allowtransparency: 'true',
        allow:
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        referrerPolicy: 'strict-origin-when-cross-origin',
        style: { minHeight: '300px' },
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

const Container = (props: FlexProps) => {
  const { children, ...flexProps } = props;
  return (
    <Flex
      bg="#0c0c0c"
      fontSize={0}
      height="100%"
      lineHeight={0}
      overflow="hidden"
      position="relative"
      width="100%"
      {...flexProps}
    >
      {children}
    </Flex>
  );
};

export const Iframe = styled('iframe', {
  base: {
    background: 'black',
    border: 0,
    borderRadius: 0,
    borderStyle: 'none',
    display: 'block',
    margin: 0,
    outline: 'none',
    padding: 0,
    width: '100%',
  },
});

// Because iframe's and CORS and inner content loading flicker
const useFauxLoader = () => {
  const [isLoading, toggleLoading] = useState(true);
  const [delay] = useState(() => new Rand({ min: 300, max: 500 }));
  useMetro(
    (timer) => {
      if (timer.state.totalElapsed >= delay.value()) {
        timer.stop();
        toggleLoading(false);
      }
    },
    { time: 50 },
  );

  return { isLoading };
};

export interface MediaEmbedProps {
  src: string;
  service: Services;
  title?: string;
}

export const MediaEmbed = (props: MediaEmbedProps) => {
  const { src, service, title = 'Video' } = props;
  const { isLoading } = useFauxLoader();
  const serviceProps = getServiceProps(service, src);

  return (
    <Container>
      <Iframe
        allowFullScreen
        seamless={true}
        src={src}
        title={title}
        transition="opacity 168ms cubic-bezier(.79,.31,.59,.83)"
        opacity={isLoading ? 0 : 1}
        {...serviceProps}
      />
      {isLoading && (
        <Box position="absolute" inset={0}>
          <Loader
            color="zinc.300/50"
            left="50%"
            position="absolute"
            size="md"
            top="50%"
            transform="translate(-50%, -50%)"
          />
        </Box>
      )}
    </Container>
  );
};
