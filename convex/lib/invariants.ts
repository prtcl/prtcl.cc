import { ConvexError } from 'convex/values';
import type { Doc } from '../_generated/dataModel';

export function invariantProject(value: unknown): asserts value is Doc<'projects'> {
  if (!isProject(value)) {
    throw new ConvexError({ message: 'Project not found', code: 404 });
  }
}

export function isProject(value: unknown): value is Doc<'projects'> {
  return isObjectLike(value) && 'title' in value && 'url' in value && 'category' in value;
}

export function invariantNotDeleted(value: { deletedAt: number | null }): void {
  if (value.deletedAt !== null) {
    throw new ConvexError({ message: 'Not found', code: 404 });
  }
}

export function invariantUploadToken(token: unknown): asserts token is string {
  if (!process.env.UPLOAD_TOKEN) {
    throw new ConvexError({ message: 'No upload token set', code: 500 });
  }
  if (typeof token !== 'string' || token !== process.env.UPLOAD_TOKEN) {
    throw new ConvexError({ message: 'Unauthorized', code: 401 });
  }
}

export function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
