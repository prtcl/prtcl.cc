import { useState, type SyntheticEvent } from 'react';
import { styled } from 'styled-system/jsx';
import type { HTMLStyledProps } from 'styled-system/types';

export type ImageTransformOptions = {
  blur?: number;
  brightness?: number;
  compression?: 'lossless';
  dpr?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  format?: 'jpeg' | 'webp' | 'avif' | 'auto';
  height?: number;
  quality?: number;
  sharpen?: number;
  width: number;
};

const defaultOptions: ImageTransformOptions = {
  dpr: 1,
  format: 'auto', // auto will serve avif with webp as a fallback, or jpeg for ancient browsers.
  width: 1024,
};

const serializeOptions = (options: ImageTransformOptions): string =>
  Object.entries({ ...defaultOptions, ...options })
    .filter(([_, val]) => val !== undefined)
    .map(([key, val]) => `${key}=${val}`)
    .join(',');

const createTransformUrl = (src: string, options: ImageTransformOptions) =>
  `https://prtcl.cc/cdn-cgi/image/${serializeOptions(options)}/${src}`;

export const Img = styled('img', {
  base: {
    backgroundColor: 'transparent',
    border: 'none',
    display: 'block',
    height: '100%',
    imageRendering: '-webkit-optimize-contrast',
    objectFit: 'cover',
    outline: 'none',
    printColorAdjust: 'exact',
    transition: 'opacity 275ms cubic-bezier(.79,.31,.59,.83)',
    width: '100%',
  },
});

export type ImageProps = HTMLStyledProps<'img'> & {
  alt?: string;
  loading?: 'lazy' | 'eager';
  options?: ImageTransformOptions;
  src: string;
  srcSet?: string;
  useAnimation?: boolean;
  useHighRes?: boolean;
};

export const Image = (props: ImageProps) => {
  const {
    loading = 'lazy',
    options = defaultOptions,
    src: initialSrc,
    useAnimation = false,
    useHighRes,
    onLoad,
    ...imgProps
  } = props;
  const [hasLoaded, setHasLoaded] = useState(false);
  const src = initialSrc ? createTransformUrl(initialSrc, options) : '';
  const srcSet =
    useHighRes && initialSrc
      ? [
          `${createTransformUrl(initialSrc, options)} 1x`,
          `${createTransformUrl(initialSrc, { ...options, dpr: 2 })} 2x`,
        ].join(',')
      : undefined;

  return (
    <Img
      {...imgProps}
      srcSet={srcSet}
      // NOTE: `src` must come after `srcSet` due to a Safari loading issue:
      //  https://bugs.webkit.org/show_bug.cgi?id=190031
      src={src}
      loading={loading}
      onLoad={(e: SyntheticEvent<HTMLImageElement>) => {
        setHasLoaded(true);
        onLoad?.(e);
      }}
      {...(useAnimation
        ? {
            opacity: hasLoaded ? 1 : 0,
          }
        : {
            opacity: 1,
          })}
    />
  );
};
