import {
  PureComponent,
  type ErrorInfo,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { ConvexError } from 'convex/values';
import { Flex } from 'styled-system/jsx';
import { Text } from '~/ui/Text';

export type ErrorState = {
  hasError: boolean;
  error: Error | null;
};

export type ErrorBoundaryProps = PropsWithChildren<{
  fallback: (state: ErrorState) => ReactNode;
}>;

export const Fallback = (props: { title: string }) => {
  const { title } = props;

  return (
    <Flex alignItems="center" justifyContent="center" flex={1} width="100%">
      <Text>{title}</Text>
    </Flex>
  );
};

export class ErrorBoundary extends PureComponent<
  ErrorBoundaryProps,
  ErrorState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: !!error, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { children, fallback } = this.props;
    const { hasError } = this.state;

    if (hasError && fallback) {
      return fallback(this.state);
    }

    return children;
  }
}

export function isNotFoundError(error: unknown) {
  return error instanceof ConvexError && error.data.code === 404;
}
