import fs from 'fs/promises';
import sizeOf from 'image-size';
import path from 'path';
import {
  type ImageDimensions,
  type UploadResponse,
  isImageDimensions,
  isUploadResponse,
} from './types';

export const uploadImageFile = async (
  uploadUrl: string,
  file: File | Blob,
): Promise<UploadResponse | void> => {
  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Content-Type': file!.type },
    body: file,
  });
  const payload = await res.json();

  if (isUploadResponse(payload)) {
    return payload;
  }
};

export const getImageDimensions = async (
  file: File,
): Promise<ImageDimensions | void> => {
  const buffer = await file.arrayBuffer();
  const dimensions = sizeOf(Buffer.from(buffer));

  if (isImageDimensions(dimensions)) {
    return dimensions;
  } else {
    throw new Error(`Could not calculate dimensions for ${file.name}`);
  }
};

export const loadImageFile = async (basePath: string, filename: string) => {
  const filepath = path.join(basePath, filename);
  const fileContent = await fs.readFile(filepath);
  let type = 'image/png';

  if (filename.endsWith('.webp')) {
    type = 'image/webp';
  } else if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
    type = 'image/jpeg';
  }

  return new File([fileContent], filename, { type });
};
