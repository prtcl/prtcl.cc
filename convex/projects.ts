import { query } from './_generated/server';

export const loadProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db
      .query('projects')
      .filter((q) => q.eq(q.field('deletedAt'), null))
      .collect();

    return projects.sort((a, b) => a.order - b.order);
  },
});
