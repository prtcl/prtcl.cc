import { useSpring, animated } from '@react-spring/web';
import { forwardRef, useCallback, useState, type PointerEvent } from 'react';
import { cva } from 'styled-system/css';
import { type HTMLStyledProps, styled } from 'styled-system/jsx';

export const iconButtonStyles = cva({
  base: {
    alignItems: 'center',
    background: 'transparent',
    borderRadius: 8,
    color: 'text',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    WebkitTouchCallout: 'none',
    _disabled: {
      cursor: 'not-allowed',
      opacity: 0.35,
      _hover: { opacity: 0.35 },
    },
    '@media (hover: none)': {
      _hover: { opacity: 1 },
    },
    '@media (hover: hover)': {
      _hover: { opacity: 0.95 },
    },
  },
  variants: {
    size: {
      sm: {
        height: 9,
        minHeight: 9,
        minWidth: 9,
        width: 9,
      },
      md: {
        height: 10,
        minHeight: 10,
        minWidth: 10,
        width: 10,
      },
      lg: {
        height: 12,
        minHeight: 12,
        minWidth: 12,
        width: 12,
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const InnerIconButton = styled(animated.button, iconButtonStyles);

export type IconButtonProps = HTMLStyledProps<typeof InnerIconButton> & {
  isDisabled?: boolean;
  onPress: () => void;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, innerRef) {
    const { children, isDisabled = false, onPress, ...rest } = props;
    const [isPressed, setPressed] = useState(false);
    const initialOpacity = isDisabled ? 0.35 : 1;
    const styles = useSpring({
      from: { opacity: initialOpacity },
      to: { opacity: isPressed && !isDisabled ? 0.35 : initialOpacity },
    });
    const handleDown = useCallback((e: PointerEvent) => {
      e.preventDefault();
      setPressed(true);
    }, []);
    const handleUp = useCallback(
      (e: PointerEvent) => {
        e.preventDefault();
        setPressed(false);
        onPress();
      },
      [onPress],
    );

    return (
      <InnerIconButton
        {...rest}
        ref={innerRef}
        onClick={(e) => e.preventDefault()}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        style={styles}
      >
        {children}
      </InnerIconButton>
    );
  },
);

export default IconButton;
