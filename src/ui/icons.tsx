import { FiChevronsLeft } from 'react-icons/fi';
import { RxArchive, RxChevronLeft, RxCross2 } from 'react-icons/rx';
import { cva } from 'styled-system/css';
import { styled } from 'styled-system/jsx';

export type IconType = typeof RxArchive;

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
        fontSize: '1.75rem',
        width: '1.75rem',
        height: '1.75rem',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const makeIcon = (icon: IconType) => styled(icon, iconStyles);

export const BackIcon = makeIcon(FiChevronsLeft);
export const ChevronLeftIcon = makeIcon(RxChevronLeft);
export const CloseIcon = makeIcon(RxCross2);
