import type { Doc, Id } from '../../convex/_generated/dataModel';

export type ImagePayload = Omit<
  Doc<'images'>,
  '_id' | '_creationTime' | 'deletedAt' | 'updatedAt' | 'aspectRatio'
>;

export type UploadResponse = { storageId: Id<'_storage'> };

export type ImageDimensions = { width: number; height: number };

export function isImageDimensions(value: unknown): value is ImageDimensions {
  return (
    typeof value === 'object' &&
    value !== null &&
    'width' in value &&
    'height' in value &&
    typeof value.width === 'number' &&
    typeof value.height === 'number'
  );
}

export function invariantImageDimensions(value: unknown): asserts value is ImageDimensions {
  if (!isImageDimensions(value)) {
    throw new Error('Payload is not an image dimensions object');
  }
}

export function isUploadResponse(value: unknown): value is UploadResponse {
  return typeof value === 'object' && value !== null && 'storageId' in value;
}

export function invariantUploadResponse(value: unknown): asserts value is UploadResponse {
  if (!isUploadResponse(value)) {
    throw new Error('Response is not an upload response');
  }
}
