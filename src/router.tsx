import { createRouter } from '@tanstack/react-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ConvexHttpClient } from 'convex/browser';
import { Fallback } from '~/lib/errors';
import { routeTree } from './routeTree.gen';

export interface RouterContext {
  convex: ConvexHttpClient;
}

export function getRouter() {
  invariantConvexUrl(import.meta.env.VITE_CONVEX_URL);
  const client = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
  const convex = new ConvexHttpClient(import.meta.env.VITE_CONVEX_URL);

  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: { convex },
    defaultErrorComponent: ({ error }) => <Fallback title="Error" error={error} />,
    defaultNotFoundComponent: () => <Fallback title="Not Found" />,
    Wrap: ({ children }) => <ConvexProvider client={client}>{children}</ConvexProvider>,
  });
}

function invariantConvexUrl(value: unknown): asserts value is string {
  if (!value || typeof value !== 'string') {
    throw new Error('Invariant VITE_CONVEX_URL');
  }
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
