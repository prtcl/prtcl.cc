import { useCallback, useMemo, useState } from 'react';
import { styled } from 'styled-system/jsx';
import type { JsxStyleProps } from 'styled-system/types';

export type ImageTransformOptions = {
  dpr?: number;
  format?: 'jpeg' | 'webp' | 'avif' | 'auto';
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

const Img = styled('img', {
  base: {
    height: 'auto',
    objectFit: 'cover',
    transition: 'opacity 275ms cubic-bezier(.79,.31,.59,.83)',
    width: '100%',
  },
});

export interface ImageProps extends JsxStyleProps {
  loading?: 'lazy' | 'eager';
  options?: ImageTransformOptions;
  src?: string;
  srcSet?: string;
  useHighRes?: boolean;
}

const Image = (props: ImageProps) => {
  const {
    src: initialSrc,
    options,
    loading = 'lazy',
    useHighRes,
    ...imgProps
  } = props;
  const [hasLoaded, setHasLoaded] = useState(false);
  const handleLoad = useCallback(() => setHasLoaded(true), []);
  const { src, srcSet } = useMemo<{
    src: string;
    srcSet: string | undefined;
  }>(() => {
    return {
      src: initialSrc ? createTransformUrl(initialSrc, options) : undefined,
      srcSet:
        useHighRes && initialSrc
          ? [
              `${createTransformUrl(initialSrc, options)} 1x`,
              `${createTransformUrl(initialSrc, { ...options, dpr: 2 })} 2x`,
            ].join(',')
          : undefined,
    };
  }, [initialSrc, options, useHighRes]);

  return (
    <Img
      {...imgProps}
      srcSet={srcSet}
      // NOTE: `src` must come after `srcSet` due to a Safari loading issue:
      //  https://bugs.webkit.org/show_bug.cgi?id=190031
      src={src}
      opacity={hasLoaded ? 1 : 0}
      onLoad={handleLoad}
      loading={loading}
    />
  );
};

export default Image;