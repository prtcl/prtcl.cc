import { ConvexError } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import { Service, type Services } from './types';

export function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isNotDeleted(value: Record<string, unknown>): boolean {
  return 'deletedAt' in value && value.deletedAt !== null;
}

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

export function invariantActiveEmbed(
  value: unknown,
): asserts value is Doc<'embeds'> {
  if (!isActiveEmbed(value)) {
    throw new ConvexError({
      message: 'Embed not found',
      code: 404,
    });
  }
}

export function isActiveEmbed(value: unknown): value is Doc<'embeds'> {
  return isObjectLike(value) && isNotDeleted(value) && 'src' in value;
}

export function invariantActiveContent(
  value: unknown,
): asserts value is Doc<'content'> {
  if (!isActiveContent(value)) {
    throw new ConvexError({
      message: 'Content not found',
      code: 404,
    });
  }
}

export function isActiveContent(value: unknown): value is Doc<'content'> {
  return (
    isObjectLike(value) &&
    isNotDeleted(value) &&
    'content' in value &&
    'deletedAt' in value
  );
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

export function isEmbedService(value: unknown): value is Service {
  const services = new Set<Services>(Object.values(Service));
  return typeof value === 'string' && services.has(value as Services);
}

export function invariantEmbedService(
  value: unknown,
): asserts value is Service {
  if (!isEmbedService(value)) {
    throw new Error('Invalid service type');
  }
}
