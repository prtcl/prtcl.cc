import * as RxHoverCard from '@radix-ui/react-hover-card';
import { animated, config, useTransition } from '@react-spring/web';
import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
} from 'react';
import { styled, type HTMLStyledProps } from 'styled-system/jsx';

type HoverCardContextValue = {
  isOpen: boolean;
  toggleOpen: (updates: boolean) => void;
};

const HoverCardContext = createContext<HoverCardContextValue>(
  {} as HoverCardContextValue,
);

const contentDefaults: RxHoverCard.HoverCardContentProps = {
  align: 'center',
  alignOffset: 0,
  forceMount: true,
  side: 'right',
  sideOffset: 24,
};

export const InnerContent = styled(animated(RxHoverCard.Content), {
  base: {
    height: '180px',
    width: '256px',
    zIndex: 3,
    '&::selection': {
      backgroundColor: 'transparent',
    },
  },
});

export type ContentProps = RxHoverCard.HoverCardContentProps &
  HTMLStyledProps<'div'>;

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  function Content(props, innerRef) {
    const { children, ...contentProps } = props;
    const { isOpen } = useContext(HoverCardContext);
    const transitions = useTransition(isOpen, {
      from: { opacity: 0.84, y: 4 },
      enter: { opacity: 1, y: 0 },
      leave: { opacity: 0, y: 6 },
      config: {
        ...config.default,
        mass: 1,
        tension: 200,
        friction: 26,
      },
      expires: true,
    });

    return (
      <RxHoverCard.Portal forceMount>
        {transitions((styles, shouldRender) =>
          shouldRender ? (
            <InnerContent
              {...contentDefaults}
              {...contentProps}
              ref={innerRef}
              style={styles}
            >
              {children}
            </InnerContent>
          ) : null,
        )}
      </RxHoverCard.Portal>
    );
  },
);

export type HoverCardTriggerProps = RxHoverCard.HoverCardTriggerProps;

export const Trigger = (props: HoverCardTriggerProps) => {
  const { children, asChild = true, ...triggerProps } = props;

  return (
    <RxHoverCard.Trigger {...triggerProps} asChild={asChild}>
      {children}
    </RxHoverCard.Trigger>
  );
};

const rootDefaults: RxHoverCard.HoverCardProps = {
  closeDelay: 0,
  openDelay: 0,
};

export type HoverCardProps = Omit<
  RxHoverCard.HoverCardProps,
  'open' | 'onOpenChange'
>;

export const Root = (props: HoverCardProps) => {
  const {
    children,
    closeDelay = 0,
    defaultOpen = false,
    openDelay = 0,
    ...rootProps
  } = props;
  const [isOpen, toggleOpen] = useState(() => defaultOpen);
  const context = useMemo<HoverCardContextValue>(
    () => ({
      isOpen,
      toggleOpen,
    }),
    [isOpen],
  );

  return (
    <HoverCardContext.Provider value={context}>
      <RxHoverCard.Root
        {...rootDefaults}
        {...rootProps}
        closeDelay={closeDelay}
        onOpenChange={toggleOpen}
        open={isOpen}
        openDelay={openDelay}
      >
        {children}
      </RxHoverCard.Root>
    </HoverCardContext.Provider>
  );
};
