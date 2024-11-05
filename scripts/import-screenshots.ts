import { ConvexClient } from 'convex/browser';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

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
    const projects = await client.query(api.projects.loadAllProjects, {});
    const projectIds = new Set(projects.map((p) => p._id));
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

      if (!projectId || !projectIds.has(projectId)) {
        console.error(`No valid projectId for ${filename}`);
        continue;
      }

      const filepath = path.join(previewsDir, filename);
      const fileContent = await fs.readFile(filepath);

      const file = new File([fileContent], filename, {
        type: filename.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
      });

      const { uploadUrl } = await client.mutation(
        api.previews.generateUploadUrl,
        { token: uploadToken },
      );

      const payload = await uploadFile(uploadUrl, file);

      if (payload) {
        console.log(
          `Uploaded ${filename} with storageId: ${payload.storageId}`,
        );

        // Update your project record with the storageId
        await client.mutation(api.previews.createPreview, {
          projectId: projectId as Id<'projects'>,
          storageId: payload.storageId as Id<'_storage'>,
          token: uploadToken,
        });
      }
    }
  } finally {
    await client.close();
  }
}

type UploadPayload = { storageId: string };

async function uploadFile(
  uploadUrl: string,
  file: File | Blob,
): Promise<UploadPayload | void> {
  try {
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': file!.type },
      body: file,
    });
    const payload = await res.json();

    if (payload && 'storageId' in payload) {
      return payload as UploadPayload;
    }
  } catch {
    throw new Error('Could not upload');
  }
}
