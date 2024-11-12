'use node';

import sizeOf from 'image-size';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { internalAction } from './_generated/server';

type UpdatePayload = {
  coverImageId: Id<'images'> | null;
  previewImageId: Id<'images'> | null;
  projectId: Id<'projects'>;
};

export const calculateImageDimensions = internalAction({
  args: {},
  handler: async (ctx) => {
    const details = await ctx.runQuery(internal.migrations.collectAllDetails);
    const previews = await ctx.runQuery(internal.migrations.collectAllPreviews);
    const projectIds = new Set<Id<'projects'>>([
      ...details.map((d) => d.projectId),
      ...previews.map((p) => p.projectId),
    ]);
    const updates: Map<Id<'projects'>, UpdatePayload> = new Map();
    const res: Id<'projects'>[] = [];

    for (const projectId of projectIds) {
      updates.set(projectId, {
        coverImageId: null,
        previewImageId: null,
        projectId,
      });
    }

    for (const detail of details) {
      const { coverImageId: initialStorageId, projectId } = detail;

      if (!initialStorageId) {
        continue;
      }

      const storageItem = await ctx.storage.get(initialStorageId);
      const payload = updates.get(detail.projectId);

      if (!storageItem || !payload) {
        throw new Error(`Cannot find storage item: ${initialStorageId}`);
      }

      const buffer = await storageItem.arrayBuffer();
      const dimensions = sizeOf(Buffer.from(buffer));

      console.log({ dimensions, storageItem, detail });

      if (!dimensions.width || !dimensions.height) {
        throw new Error(`Cannot calculate dimensions: ${initialStorageId}`);
      }

      const insertedImageId = await ctx.runMutation(
        internal.migrations.createImage,
        {
          mimeType: storageItem.type,
          naturalHeight: dimensions.width,
          naturalWidth: dimensions.height,
          size: storageItem.size,
          storageId: initialStorageId,
        },
      );

      updates.set(projectId, {
        ...payload,
        coverImageId: insertedImageId,
      });
    }

    for (const preview of previews) {
      const { storageId: initialStorageId, projectId } = preview;
      const payload = updates.get(projectId);
      const storageItem = await ctx.storage.get(initialStorageId);

      if (!storageItem || !payload) {
        throw new Error(`Cannot find storage item: ${initialStorageId}`);
      }

      const buffer = await storageItem.arrayBuffer();
      const dimensions = sizeOf(Buffer.from(buffer));

      console.log({ dimensions, storageItem, preview });

      if (!dimensions.width || !dimensions.height) {
        throw new Error(`Cannot calculate dimensions: ${initialStorageId}`);
      }

      const insertedImageId = await ctx.runMutation(
        internal.migrations.createImage,
        {
          mimeType: storageItem.type,
          naturalHeight: dimensions.width,
          naturalWidth: dimensions.height,
          size: storageItem.size,
          storageId: initialStorageId,
        },
      );

      updates.set(projectId, {
        ...payload,
        previewImageId: insertedImageId,
      });
    }

    for (const [projectId, payload] of updates.entries()) {
      await ctx.runMutation(internal.migrations.updateProjectImages, {
        ...payload,
      });

      res.push(projectId);
    }

    return res;
  },
});
