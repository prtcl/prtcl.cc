import * as RxHoverCard from '@radix-ui/react-hover-card';
import { animated, config, useTransition } from '@react-spring/web';
import {
  createContext,
  forwardRef,
  useContext,
  useMemo,
  useState,
} from 'react';
import { styled } from 'styled-system/jsx';

type HoverCardContextValue = {
  isOpen: boolean;
  isHovered: boolean;
  toggleOpen: (updates: boolean) => void;
  toggleHovered: (updates: boolean) => void;
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
    zIndex: 10,
    '&::selection': {
      backgroundColor: 'transparent',
    },
  },
});

export interface ContentProps extends RxHoverCard.HoverCardContentProps {}

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  function Content(props, innerRef) {
    const { children } = props;
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
            <InnerContent {...contentDefaults} ref={innerRef} style={styles}>
              {children}
            </InnerContent>
          ) : null,
        )}
      </RxHoverCard.Portal>
    );
  },
);

export interface HoverCardTriggerProps
  extends RxHoverCard.HoverCardTriggerProps {}

export const Trigger = (props: HoverCardTriggerProps) => {
  const { children } = props;
  const { toggleHovered } = useContext(HoverCardContext);
  const { enter, leave } = useMemo(
    () => ({
      enter: () => toggleHovered(true),
      leave: () => toggleHovered(false),
    }),
    [toggleHovered],
  );

  return (
    <RxHoverCard.Trigger asChild onMouseEnter={enter} onMouseLeave={leave}>
      {children}
    </RxHoverCard.Trigger>
  );
};

const rootDefaults: RxHoverCard.HoverCardProps = {
  closeDelay: 0,
  openDelay: 0,
};

export interface HoverCardProps extends RxHoverCard.HoverCardProps {}

export const Root = (props: HoverCardProps) => {
  const { children } = props;
  const [isOpen, toggleOpen] = useState(false);
  const [isHovered, toggleHovered] = useState(false);
  const context = useMemo<HoverCardContextValue>(
    () => ({
      isHovered,
      isOpen,
      toggleHovered,
      toggleOpen,
    }),
    [isHovered, isOpen],
  );

  return (
    <HoverCardContext.Provider value={context}>
      <RxHoverCard.Root
        {...rootDefaults}
        onOpenChange={toggleOpen}
        open={isOpen}
      >
        {children}
      </RxHoverCard.Root>
    </HoverCardContext.Provider>
  );
};
