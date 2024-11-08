import { internalMutation, query } from './_generated/server';

export const loadFeatureFlags = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('features').collect();
  },
});

export const populateFeatureFlags = internalMutation({
  args: {},
  handler: async (ctx) => {
    const initialFlags = ['isProjectPreviewsEnabled', 'isProjectViewerEnabled'];
    const existingFeatures = await ctx.db.query('features').collect();
    const existingKeys = new Set(existingFeatures.map((f) => f.key));
    const res: string[] = [];

    for (const flag of initialFlags) {
      if (!existingKeys.has(flag)) {
        const insertedId = await ctx.db.insert('features', {
          key: flag,
          value: false,
        });
        res.push(insertedId);
      }
    }

    return res;
  },
});
