import { ConvexClient } from 'convex/browser';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { api } from '../convex/_generated/api';
import {
  getImageDimensions,
  loadImageFile,
  uploadImageFile,
} from './lib/helpers';
import {
  type ImagePayload,
  type ProjectId,
  invariantImageDimensions,
  invariantProjectEntity,
  invariantProjectId,
  invariantUploadResponse,
} from './lib/types';

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
      const projectId = path.parse(filename).name as ProjectId;
      const project = fromProjectId.get(projectId);
      invariantProjectId(projectId);
      invariantProjectEntity(project);

      console.log(`Uploading ${filename}`);

      const file = await loadImageFile(previewsDir, filename);
      const { uploadUrl } = await client.mutation(
        api.internal.generateUploadUrl,
        { token: uploadToken },
      );

      const uploadResponse = await uploadImageFile(uploadUrl, file);
      invariantUploadResponse(uploadResponse);

      const { storageId } = uploadResponse;
      const dimensions = await getImageDimensions(file);
      invariantImageDimensions(dimensions);

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
