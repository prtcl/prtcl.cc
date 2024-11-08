import { ConvexError } from 'convex/values';

export const isNotFoundError = (error: unknown) =>
  error instanceof ConvexError && error.data.code === 404;
