import type { IconType } from 'react-icons';
import { PiWaves } from 'react-icons/pi';
import { RxChevronDown, RxCross2, RxLink1, RxArrowLeft } from 'react-icons/rx';
import { cva, type RecipeVariantProps } from 'styled-system/css';
import { styled, type HTMLStyledProps } from 'styled-system/jsx';

export const iconStyles = cva({
  base: {
    color: 'inherit',
  },
  variants: {
    size: {
      sm: {
        fontSize: '1rem',
        width: '1rem',
        height: '1rem',
      },
      md: {
        fontSize: '1.25rem',
        width: '1.25rem',
        height: '1.25rem',
      },
      lg: {
        fontSize: '1.35rem',
        width: '1.35rem',
        height: '1.35rem',
      },
      xl: {
        fontSize: '1.5rem',
        width: '1.5rem',
        height: '1.5rem',
      },
      '2xl': {
        fontSize: '2rem',
        width: '2rem',
        height: '2rem',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const makeIcon = (icon: IconType) => styled(icon, iconStyles);

export type IconVariantProps = RecipeVariantProps<typeof iconStyles>;
export type IconProps = HTMLStyledProps<'svg'> & IconVariantProps;

export const ArrowLeftIcon = makeIcon(RxArrowLeft);
export const ChevronDownIcon = makeIcon(RxChevronDown);
export const CloseIcon = makeIcon(RxCross2);
export const LinkIcon = makeIcon(RxLink1);
export const WaveIcon = makeIcon(PiWaves);
