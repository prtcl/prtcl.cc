import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

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
