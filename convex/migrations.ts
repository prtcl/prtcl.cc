import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';
import { internalMutation } from './_generated/server';

export const updateProjectImages = internalMutation({
  args: {
    projectId: v.id('projects'),
    coverImageId: v.union(v.id('images'), v.null()),
    previewImageId: v.union(v.id('images'), v.null()),
  },
  handler: async (ctx, args) => {
    const { projectId, coverImageId = null, previewImageId = null } = args;
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

type OptionalProjectFields = Pick<
  Doc<'projects'>,
  'contentId' | 'coverImageId' | 'embedId' | 'previewImageId' | 'updatedAt'
>;

type OptionalEmbedFields = Pick<Doc<'embeds'>, 'updatedAt'>;

type OptionalFeatureFields = Pick<Doc<'features'>, 'description'>;

export const populateOptionalFields = internalMutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect();
    const embeds = await ctx.db.query('embeds').collect();
    const features = await ctx.db.query('features').collect();

    for (const project of projects) {
      const payload: OptionalProjectFields = {
        contentId: project.contentId || null,
        coverImageId: project.coverImageId || null,
        embedId: project.embedId || null,
        previewImageId: project.previewImageId || null,
        updatedAt: project.updatedAt
          ? project.updatedAt
          : project._creationTime,
      };

      await ctx.db.patch(project._id, payload);
    }

    for (const embed of embeds) {
      const payload: OptionalEmbedFields = {
        updatedAt: embed.updatedAt ? embed.updatedAt : embed._creationTime,
      };

      await ctx.db.patch(embed._id, payload);
    }

    for (const feature of features) {
      const payload: OptionalFeatureFields = {
        description: feature.description || null,
      };

      await ctx.db.patch(feature._id, payload);
    }
  },
});
