import { cva, type RecipeVariantProps } from 'styled-system/css';
import { Box, styled, type BoxProps } from 'styled-system/jsx';
import type { SystemStyleObject } from 'styled-system/types';

const makeVariantStyles = (size: string): SystemStyleObject => ({
  width: size,
  height: size,
  '& div': {
    width: `calc(${size} * 0.8)`,
    height: `calc(${size} * 0.8)`,
    margin: `calc(${size} * 0.1)`,
    borderWidth: `calc(${size} * 0.1)`,
  },
});

export const loaderStyle = cva({
  base: {
    display: 'inline-block',
    position: 'relative',
    '& div': {
      animation: 'rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
      borderColor: 'currentColor transparent transparent transparent',
      borderRadius: '50%',
      borderStyle: 'solid',
      boxSizing: 'border-box',
      display: 'block',
      position: 'absolute',
    },
    '& div:nth-child(1)': {
      animationDelay: '-0.45s',
    },
    '& div:nth-child(2)': {
      animationDelay: '-0.3s',
    },
    '& div:nth-child(3)': {
      animationDelay: '-0.15s',
    },
  },
  variants: {
    size: {
      sm: makeVariantStyles('1.5rem'),
      md: makeVariantStyles('2.5rem'),
      lg: makeVariantStyles('3.5rem'),
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const InnerLoader = styled(Box, loaderStyle);

export type LoaderVariantProps = RecipeVariantProps<typeof loaderStyle>;
export type LoaderProps = BoxProps & LoaderVariantProps;

export const Loader = (props: LoaderProps) => {
  const { color = 'zinc.900', size = 'md', ...loaderProps } = props;

  return (
    <InnerLoader color={color} size={size} {...loaderProps}>
      {new Array(4).fill(null).map((_, i) => (
        <styled.div key={i} />
      ))}
    </InnerLoader>
  );
};
