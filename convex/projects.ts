import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';
import { internalQuery, query } from './_generated/server';
import { invariantNotDeleted, invariantProject } from './lib/invariants';

export const loadProjects = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    return await ctx.db
      .query('projects')
      .withIndex('byReleaseDate')
      .filter((q) => q.neq(q.field('publishedAt'), null))
      .order('desc')
      .paginate(paginationOpts);
  },
});

export const loadProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    invariantProject(project);
    invariantNotDeleted(project);

    return project;
  },
});

export const getRecentProjects = internalQuery({
  args: {},
  handler: async (ctx): Promise<Doc<'projects'>[]> => {
    return await ctx.db
      .query('projects')
      .withIndex('deletedByOrder', (q) => q.eq('deletedAt', null))
      .filter((q) => q.neq(q.field('publishedAt'), null))
      .order('asc')
      .take(3);
  },
});
