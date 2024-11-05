import { styled } from 'styled-system/jsx';

const Button = styled('button', {
  base: {
    alignItems: 'center',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    transition: 'background 226ms linear',
    width: 'fit-content',
    _disabled: {
      cursor: 'not-allowed',
    },
  },
  variants: {
    visual: {
      solid: {
        color: 'white',
        background: 'zinc.700',
        outline: '1px solid {colors.zinc.700}',
        _active: {
          bg: 'zinc.600',
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'text',
      },
      _active: {
        bg: 'zinc.600',
      },
    },
  },
  defaultVariants: {
    visual: 'solid',
  },
});

export default Button;
