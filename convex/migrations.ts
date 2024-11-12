import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { internalMutation, internalQuery } from './_generated/server';

export const collectAllDetails = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('details').collect();
  },
});

export const collectAllPreviews = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('previews').collect();
  },
});

export const createImage = internalMutation({
  args: {
    alt: v.optional(v.string()),
    description: v.optional(v.string()),
    mimeType: v.string(),
    naturalHeight: v.number(),
    naturalWidth: v.number(),
    size: v.number(),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const {
      alt = null,
      description = null,
      mimeType,
      naturalHeight,
      naturalWidth,
      size,
      storageId,
    } = args;

    return await ctx.db.insert('images', {
      alt,
      aspectRatio: naturalWidth / naturalHeight,
      deletedAt: null,
      description,
      mimeType,
      naturalHeight,
      naturalWidth,
      size,
      storageId,
      updatedAt: Date.now(),
    });
  },
});

export const updateProjectImages = internalMutation({
  args: {
    projectId: v.id('projects'),
    coverImageId: v.union(v.id('images'), v.null()),
    previewImageId: v.union(v.id('images'), v.null()),
  },
  handler: async (ctx, args) => {
    const { projectId, coverImageId, previewImageId } = args;
    const project = await ctx.db.get(projectId);

    if (!project) {
      throw new Error(`Cannot find project: ${projectId}`);
    }

    const {
      coverImageId: existingCoverImageId,
      previewImageId: existingPreviewImageId,
    } = project;

    if (existingCoverImageId) {
      const existingCoverImage = await ctx.db.get(existingCoverImageId);

      if (existingCoverImage) {
        await ctx.db.patch(existingCoverImage._id, {
          deletedAt: Date.now(),
        });
      }
    }

    if (existingPreviewImageId) {
      const existingPreviewImage = await ctx.db.get(existingPreviewImageId);

      if (existingPreviewImage) {
        await ctx.db.patch(existingPreviewImage._id, {
          deletedAt: Date.now(),
        });
      }
    }

    return await ctx.db.patch(projectId, {
      coverImageId,
      previewImageId,
      updatedAt: Date.now(),
    });
  },
});

export const migrateProjectEmbeds = internalMutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect();
    const details = await ctx.db.query('details').collect();
    const projectToEmbed = new Map(
      details.filter((d) => !!d.embedId).map((d) => [d.projectId, d.embedId]),
    );
    const res: Id<'projects'>[] = [];

    for (const project of projects) {
      if (!projectToEmbed.has(project._id)) {
        continue;
      }

      const embedId = projectToEmbed.get(project._id);

      if (!embedId) {
        throw new Error(`Cannot find embed: ${project.embedId}`);
      }

      await ctx.db.patch(embedId, { updatedAt: Date.now() });
      await ctx.db.patch(project._id, {
        embedId,
        updatedAt: Date.now(),
      });

      res.push(project._id);
    }

    return res;
  },
});
