import { v } from 'convex/values';
import { type Id } from './_generated/dataModel';
import { internalMutation, query } from './_generated/server';

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

export const reorderProjects = internalMutation({
  args: {
    id: v.id('projects'),
    order: v.number(),
  },
  handler: async (ctx, { id: targetId, order: targetOrder }) => {
    const projects = await ctx.db.query('projects').collect();
    const { updates } = projects
      .sort((a, b) => a.order - b.order)
      .reduce<{ updates: Map<Id<'projects'>, number>; prev: number }>(
        (res, project) => {
          let updatedOrder;

          if (project._id === targetId) {
            updatedOrder = targetOrder;
          } else if (project.deletedAt) {
            updatedOrder = Number.MAX_SAFE_INTEGER;
          } else {
            const next = res.prev + 1;
            updatedOrder = next === targetOrder ? next + 1 : next;
            res.prev = updatedOrder;
          }

          res.updates.set(project._id, updatedOrder);

          return res;
        },
        { updates: new Map(), prev: -1 },
      );

    for (const [id, order] of updates.entries()) {
      await ctx.db.patch(id, { order });
    }

    return updates.entries();
  },
});
