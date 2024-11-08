/* eslint-disable @typescript-eslint/no-explicit-any */
import { PureComponent, type PropsWithChildren, type ReactNode } from 'react';

export type ErrorState = {
  hasError: boolean;
  error: Error | any | null;
};

export type ErrorBoundaryProps = PropsWithChildren<{
  fallback: (state: ErrorState) => ReactNode;
}>;

export class ErrorBoundary extends PureComponent<
  ErrorBoundaryProps,
  ErrorState
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: !!error, error };
  }

  componentDidCatch(error, errorInfo) {
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
