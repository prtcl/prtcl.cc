import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { query } from './_generated/server';

export const loadProjects = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    return await ctx.db
      .query('projects')
      .withIndex('deletedByOrder', (q) => q.eq('deletedAt', null))
      .filter((q) => q.neq(q.field('publishedAt'), null))
      .order('asc')
      .paginate(paginationOpts);
  },
});

export const loadProjectIds = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query('projects')
      .withIndex('deletedByOrder', (q) => q.eq('deletedAt', null))
      .filter((q) => q.neq(q.field('publishedAt'), null))
      .order('asc')
      .collect();

    return projects?.map((p) => p._id);
  },
});

export const loadProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);

    if (!project || project.deletedAt !== null) {
      throw new ConvexError({
        message: 'Project not found',
        code: 404,
      });
    }

    return project;
  },
});
