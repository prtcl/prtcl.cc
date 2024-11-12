import { ConvexError, v } from 'convex/values';
import { query } from './_generated/server';

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
