import { ConvexClient } from 'convex/browser';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import sizeOf from 'image-size';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { api } from '../convex/_generated/api';
import type { Doc, Id } from '../convex/_generated/dataModel';

dotenv.config({ path: '.env.local' });

const CONVEX_URL = process.env.VITE_CONVEX_URL;
const UPLOAD_TOKEN = process.env.UPLOAD_TOKEN;

const argv = yargs(hideBin(process.argv))
  .option('target', {
    alias: 't',
    type: 'string',
    description: 'Convex deployment URL',
  })
  .parse();

if (UPLOAD_TOKEN && (CONVEX_URL || argv.target)) {
  main(argv.target || CONVEX_URL, UPLOAD_TOKEN)
    .then(() => process.exit(1))
    .catch(console.error);
} else {
  console.error('Need CONVEX_URL and UPLOAD_TOKEN');
  process.exit(0);
}

type ImagePayload = Omit<
  Doc<'images'>,
  '_id' | '_creationTime' | 'deletedAt' | 'updatedAt' | 'aspectRatio'
>;

type UploadResponse = { storageId: Id<'_storage'> };

type ImageDimensions = { width: number; height: number };

const uploadImageFile = async (
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

const getImageDimensions = async (
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

const prepareImageFile = async (basePath: string, filename: string) => {
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

async function main(deploymentUrl: string, uploadToken: string) {
  const client = new ConvexClient(deploymentUrl);
  const previewsDir = path.join(process.cwd(), 'previews');

  try {
    const projects = await client.query(api.internal.collectAllProjects, {});
    const fromProjectId = new Map(projects.map((p) => [p._id, p]));
    const files = await fs.readdir(previewsDir);
    const imageFiles = files.filter(
      (f) => f.endsWith('.webp') || f.endsWith('.jpg'),
    );

    if (!imageFiles || !imageFiles.length) {
      throw new Error(
        'No image files, did you forget to `npm run generate-screenshots`?',
      );
    }

    for (const filename of imageFiles) {
      const projectId = path.parse(filename).name as Id<'projects'>;
      const project = fromProjectId.get(projectId);
      assertProjectId(projectId);
      assertProjectEntity(project);

      console.log(`Uploading ${filename}`);

      const file = await prepareImageFile(previewsDir, filename);
      const { uploadUrl } = await client.mutation(
        api.internal.generateUploadUrl,
        { token: uploadToken },
      );

      const uploadResponse = await uploadImageFile(uploadUrl, file);
      assertUploadResponse(uploadResponse);

      const { storageId } = uploadResponse;
      const dimensions = await getImageDimensions(file);
      assertImageDimensions(dimensions);

      const imagePayload: ImagePayload = {
        alt: project.title,
        description: null,
        mimeType: file.type,
        naturalHeight: dimensions.width,
        naturalWidth: dimensions.height,
        size: file.size,
        storageId,
      };
      const previewImageId = await client.mutation(api.internal.createImage, {
        token: uploadToken,
        payload: imagePayload,
      });

      console.log(`Uploaded with previewImageId: ${previewImageId}`);

      await client.mutation(api.internal.attachImagePreview, {
        previewImageId,
        projectId,
        token: uploadToken,
      });
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

function isImageDimensions(payload: unknown): payload is ImageDimensions {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'width' in payload &&
    'height' in payload &&
    typeof payload.width === 'number' &&
    typeof payload.height === 'number'
  );
}

function assertImageDimensions(
  payload: unknown,
): asserts payload is ImageDimensions {
  if (!isImageDimensions(payload)) {
    throw new Error('Payload is not an image dimensions object');
  }
}

function isUploadResponse(res: unknown): res is UploadResponse {
  return typeof res === 'object' && res !== null && 'storageId' in res;
}

function assertUploadResponse(res: unknown): asserts res is UploadResponse {
  if (!isUploadResponse(res)) {
    throw new Error('Response is not an upload response');
  }
}

function assertProjectId(value: unknown): asserts value is Id<'projects'> {
  if (typeof value !== 'string') {
    throw new Error('Value is not a product ID');
  }
}

function assertProjectEntity(value: unknown): asserts value is Doc<'projects'> {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('url' in value) ||
    !('title' in value)
  ) {
    throw new Error('Value is not a project');
  }
}
