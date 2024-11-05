import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const loadProjectPreview = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);

    if (!project) {
      throw new ConvexError({
        message: 'Project not found',
        code: 404,
      });
    }

    const preview = await ctx.db
      .query('previews')
      .withIndex('project', (q) => q.eq('projectId', project._id))
      .filter((q) => q.eq(q.field('deletedAt'), null))
      .unique();

    if (!preview) {
      throw new ConvexError({
        message: 'Preview not found',
        code: 404,
      });
    }

    const publicUrl = await ctx.storage.getUrl(preview.storageId);

    if (publicUrl) {
      return {
        ...preview,
        publicUrl,
      };
    }

    return null;
  },
});

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    if (token !== process.env.UPLOAD_TOKEN) {
      throw new Error('Unauthorized');
    }

    const uploadUrl = await ctx.storage.generateUploadUrl();

    return { uploadUrl };
  },
});

export const createPreview = mutation({
  args: {
    projectId: v.id('projects'),
    storageId: v.id('_storage'),
    token: v.string(),
  },
  handler: async (ctx, { projectId, storageId, token }) => {
    if (token !== process.env.UPLOAD_TOKEN) {
      throw new Error('Unauthorized');
    }

    const existingPreview = await ctx.db
      .query('previews')
      .withIndex('project', (q) => q.eq('projectId', projectId))
      .filter((q) => q.eq(q.field('deletedAt'), null))
      .unique();

    if (existingPreview) {
      return await ctx.db.patch(existingPreview._id, { storageId });
    }

    return await ctx.db.insert('previews', {
      deletedAt: null,
      projectId,
      storageId,
    });
  },
});
