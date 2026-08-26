import { internalMutation } from './_generated/server';

export const deleteLegacyProjectData = internalMutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query('projects').collect();
    for (const project of projects) {
      await ctx.db.patch(project._id, {
        contentId: undefined,
        coverImageId: undefined,
        embedId: undefined,
        previewImageId: undefined,
        updatedAt: Date.now(),
      });
    }

    const embeds = await ctx.db.query('embeds').collect();
    for (const embed of embeds) {
      await ctx.db.delete(embed._id);
    }

    const contents = await ctx.db.query('content').collect();
    for (const content of contents) {
      await ctx.db.delete(content._id);
    }

    const features = await ctx.db.query('features').collect();
    for (const feature of features) {
      await ctx.db.delete(feature._id);
    }
  },
});
