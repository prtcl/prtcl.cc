import { internalMutation } from './_generated/server';

export const backfillReleaseDate = internalMutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect();
    let updated = 0;
    for (const project of projects) {
      if (project.releaseDate === undefined && typeof project.publishedAt === 'number') {
        await ctx.db.patch(project._id, { releaseDate: project.publishedAt });
        updated += 1;
      }
    }
    return { updated, total: projects.length };
  },
});
