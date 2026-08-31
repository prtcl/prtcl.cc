import { ConvexError, v } from 'convex/values';
import { internalMutation, query } from './_generated/server';

export const getActiveSummary = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('summaries')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .order('desc')
      .first();
  },
});

export const publishSummary = internalMutation({
  args: { id: v.id('summaries') },
  handler: async (ctx, { id }) => {
    const target = await ctx.db.get(id);
    if (!target) {
      throw new ConvexError({ message: 'Summary not found', code: 404 });
    }

    const currentlyPublished = await ctx.db
      .query('summaries')
      .filter((q) => q.eq(q.field('status'), 'published'))
      .collect();

    const now = Date.now();
    for (const summary of currentlyPublished) {
      if (summary._id !== id) {
        await ctx.db.patch(summary._id, { status: 'draft', updatedAt: now });
      }
    }

    await ctx.db.patch(id, { status: 'published', updatedAt: now });
    return id;
  },
});

export const insertSummary = internalMutation({
  args: {
    content: v.string(),
    inputs: v.array(v.id('projects')),
    model: v.string(),
  },
  handler: async (ctx, { content, inputs, model }) => {
    return await ctx.db.insert('summaries', {
      content,
      inputs,
      model,
      status: 'draft',
      updatedAt: Date.now(),
    });
  },
});
