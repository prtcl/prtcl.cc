import * as RxDialog from '@radix-ui/react-dialog';
import {
  useTransition,
  animated,
  config,
  type UseTransitionProps,
  type SpringConfig,
} from '@react-spring/web';
import { createContext, forwardRef, useCallback, useContext } from 'react';
import { type RecipeVariantProps, cva } from 'styled-system/css';
import { styled } from 'styled-system/jsx';
import type { HTMLStyledProps } from 'styled-system/types';

export type Presets = 'slide-up' | 'scale' | 'subtle';

type DialogContextValue = {
  isOpen: boolean;
  preset: Presets;
};

const DialogContext = createContext<DialogContextValue>(
  {} as DialogContextValue,
);

const InnerOverlay = styled(animated.div, {
  base: {
    background: 'rgba(255, 255, 255, 0.68)',
    backdropFilter: 'blur(0.125rem)',
    position: 'fixed',
    inset: 0,
    zIndex: 2,
  },
});

export type OverlayProps = HTMLStyledProps<'div'>;

export const Overlay = forwardRef<HTMLDivElement, OverlayProps>(
  function Overlay(props, ref) {
    const { children, ...overlayProps } = props;
    const { isOpen } = useContext(DialogContext);
    const transitions = useTransition(isOpen, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      config: config.default,
    });

    return transitions((styles, shouldRender) => {
      if (shouldRender) {
        return (
          <RxDialog.Overlay forceMount asChild>
            <InnerOverlay {...overlayProps} ref={ref} style={styles}>
              {children}
            </InnerOverlay>
          </RxDialog.Overlay>
        );
      }

      return null;
    });
  },
);

const contentStyle = cva({
  base: {
    borderRadius: [0, 8],
    left: '50%',
    maxHeight: ['100%', '95vh'],
    minHeight: 'fit-content',
    outline: 'none !important',
    overflow: 'hidden',
    position: 'fixed',
    shadow: ['none', '2xl'],
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: ['100%', '95vw'],
    zIndex: 10,
  },
  variants: {
    size: {
      sm: { maxWidth: '16rem' },
      md: { maxWidth: '28rem' },
      lg: {},
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const getPresetTransitionConfig = (
  preset: Presets,
): Required<
  Pick<UseTransitionProps<boolean>, 'from' | 'enter' | 'leave' | 'config'>
> => {
  const presetConfig: SpringConfig = {
    ...config.default,
    clamp: true,
    mass: 1,
  };

  switch (preset) {
    case 'slide-up': {
      return {
        from: { opacity: 0.34, transform: 'translate3d(-50%, -35%, 0)' },
        enter: { opacity: 1, transform: 'translate3d(-50%, -50%, 0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%, -48%, 0)' },
        config: {
          ...presetConfig,
          friction: 28,
          tension: 220,
        },
      };
    }
    case 'scale': {
      return {
        from: {
          opacity: 0.84,
          transform: 'translate3d(-50%, -49%, 0) scale(0.88)',
        },
        enter: { opacity: 1, transform: 'translate3d(-50%, -50%, 0) scale(1)' },
        leave: {
          opacity: 0,
          transform: 'translate3d(-50%, -47%, 0) scale(0.92)',
        },
        config: {
          ...presetConfig,
          friction: 32,
          tension: 200,
        },
      };
    }
    case 'subtle':
    default: {
      return {
        from: { opacity: 0.68, transform: 'translate3d(-50%, -49%, 0)' },
        enter: { opacity: 1, transform: 'translate3d(-50%, -50%, 0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%, -48%, 0)' },
        config: config.default,
      };
    }
  }
};

const InnerContent = styled(animated.div, contentStyle);

export type ContentVariantProps = RecipeVariantProps<typeof contentStyle>;

export type DialogContentProps = Pick<
  RxDialog.DialogContentProps,
  'children' | 'onOpenAutoFocus'
> &
  RecipeVariantProps<typeof contentStyle> &
  HTMLStyledProps<'div'>;

export const Content = forwardRef<HTMLDivElement, DialogContentProps>(
  function Content(props, ref) {
    const { children, onOpenAutoFocus, ...contentProps } = props;
    const { isOpen, preset } = useContext(DialogContext);
    const transitions = useTransition(isOpen, {
      ...getPresetTransitionConfig(preset),
      expires: true,
    });

    return (
      <RxDialog.Portal forceMount>
        {transitions((styles, shouldRender) => {
          if (shouldRender) {
            return (
              <RxDialog.Content
                ref={ref}
                aria-describedby={undefined}
                asChild
                forceMount
                onOpenAutoFocus={onOpenAutoFocus}
              >
                <InnerContent {...contentProps} style={styles}>
                  {children}
                </InnerContent>
              </RxDialog.Content>
            );
          }

          return null;
        })}
      </RxDialog.Portal>
    );
  },
);

export const Title = styled(RxDialog.Title);

export type DialogRootProps = Pick<
  RxDialog.DialogProps,
  'children' | 'onOpenChange'
> & {
  isOpen: boolean;
  onClose: () => void;
  preset?: Presets;
};

export const Root = (props: DialogRootProps) => {
  const { children, isOpen, onClose, onOpenChange, preset = 'subtle' } = props;
  const handleOpenChange = useCallback(
    (changes: boolean) => {
      if (!changes) {
        onClose();
      }

      if (onOpenChange) {
        onOpenChange(changes);
      }
    },
    [onClose, onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ isOpen, preset }}>
      <RxDialog.Root modal open={isOpen} onOpenChange={handleOpenChange}>
        {children}
      </RxDialog.Root>
    </DialogContext.Provider>
  );
};
