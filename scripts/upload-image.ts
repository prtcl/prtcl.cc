import { ConvexClient } from 'convex/browser';
import dotenv from 'dotenv';
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
  assertImageDimensions,
  assertUploadResponse,
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
  .option('image', {
    alias: 'i',
    type: 'string',
    description: 'Absolute image file path',
  })
  .required('image', 'Image file is required')
  .parse();

if (UPLOAD_TOKEN && (CONVEX_URL || argv.target) && argv.image) {
  main(argv.target || CONVEX_URL, UPLOAD_TOKEN, argv.image)
    .then(() => process.exit(1))
    .catch(console.error);
} else {
  console.error('Need CONVEX_URL and UPLOAD_TOKEN');
  process.exit(0);
}

async function main(
  deploymentUrl: string,
  uploadToken: string,
  sourceImagePath: string,
) {
  const client = new ConvexClient(deploymentUrl);

  try {
    const file = await loadImageFile('', sourceImagePath);
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
      alt: null,
      description: null,
      mimeType: file.type,
      naturalHeight: dimensions.width,
      naturalWidth: dimensions.height,
      size: file.size,
      storageId,
    };
    const uploadedImageId = await client.mutation(api.internal.createImage, {
      token: uploadToken,
      payload: imagePayload,
    });

    console.log(`Uploaded image: ${uploadedImageId}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.close();
  }
}
