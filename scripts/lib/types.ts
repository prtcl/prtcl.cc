import type { Doc, Id } from '../../convex/_generated/dataModel';

export type ProjectId = Id<'projects'>;
export type ProjectEntity = Id<'projects'>;

export type ImagePayload = Omit<
  Doc<'images'>,
  '_id' | '_creationTime' | 'deletedAt' | 'updatedAt' | 'aspectRatio'
>;

export type UploadResponse = { storageId: Id<'_storage'> };

export type ImageDimensions = { width: number; height: number };

export function isImageDimensions(
  payload: unknown,
): payload is ImageDimensions {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'width' in payload &&
    'height' in payload &&
    typeof payload.width === 'number' &&
    typeof payload.height === 'number'
  );
}

export function invariantImageDimensions(
  payload: unknown,
): asserts payload is ImageDimensions {
  if (!isImageDimensions(payload)) {
    throw new Error('Payload is not an image dimensions object');
  }
}

export function isUploadResponse(res: unknown): res is UploadResponse {
  return typeof res === 'object' && res !== null && 'storageId' in res;
}

export function invariantUploadResponse(
  res: unknown,
): asserts res is UploadResponse {
  if (!isUploadResponse(res)) {
    throw new Error('Response is not an upload response');
  }
}

export function invariantProjectId(value: unknown): asserts value is ProjectId {
  if (typeof value !== 'string') {
    throw new Error('Value is not a product ID');
  }
}

export function invariantProjectEntity(
  value: unknown,
): asserts value is ProjectEntity {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('url' in value) ||
    !('title' in value)
  ) {
    throw new Error('Value is not a project');
  }
}
