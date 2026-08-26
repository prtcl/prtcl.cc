import { ConvexError } from 'convex/values';
import type { Doc } from '../_generated/dataModel';

export function invariantActiveProject(
  value: unknown,
): asserts value is Doc<'projects'> {
  if (!isActiveProject(value)) {
    throw new ConvexError({
      message: 'Project not found',
      code: 404,
    });
  }
}

export function isActiveProject(value: unknown): value is Doc<'projects'> {
  return (
    isObjectLike(value) &&
    isNotDeleted(value) &&
    'title' in value &&
    'url' in value &&
    'category' in value
  );
}

export function invariantActiveImage(
  value: unknown,
): asserts value is Doc<'images'> {
  if (!isActiveImage(value)) {
    throw new ConvexError({
      message: 'Image not found',
      code: 404,
    });
  }
}

export function isActiveImage(value: unknown): value is Doc<'images'> {
  return isObjectLike(value) && isNotDeleted(value) && 'storageId' in value;
}

export function isImage(value: unknown): value is Doc<'images'> {
  return isObjectLike(value) && 'storageId' in value;
}

export function invariantImage(value: unknown): asserts value is Doc<'images'> {
  if (!isImage(value)) {
    throw new ConvexError({
      message: 'Image not found',
      code: 404,
    });
  }
}

export function invariantPublicUrl(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new ConvexError({
      message: 'Storage item not found',
      code: 404,
    });
  }
}

export function invariantUploadToken(token: unknown): asserts token is string {
  if (!process.env.UPLOAD_TOKEN) {
    throw new ConvexError({
      message: 'No upload token set',
      code: 500,
    });
  }
  if (typeof token !== 'string' || token !== process.env.UPLOAD_TOKEN) {
    throw new ConvexError({
      message: 'Unauthorized',
      code: 401,
    });
  }
}

export function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isNotDeleted(value: Record<string, unknown>): boolean {
  return 'deletedAt' in value && value.deletedAt === null;
}
