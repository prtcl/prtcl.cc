import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';

export const collectAllProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('projects').order('asc').collect();
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

    return Array.from(updates.entries());
  },
});

export const archiveProject = internalMutation({
  args: {
    id: v.id('projects'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
      order: Number.MAX_SAFE_INTEGER,
    });
  },
});

export const unarchiveProject = internalMutation({
  args: {
    id: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query('projects')
      .withIndex('deletedByOrder', (q) => q.eq('deletedAt', null))
      .order('desc')
      .take(1);

    const lastOrder = projects[0].order;

    return await ctx.db.patch(args.id, {
      deletedAt: null,
      order: lastOrder + 1,
    });
  },
});

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    if (token !== process.env.UPLOAD_TOKEN) {
      throw new Error('Unauthorized');
    }

    const uploadUrl = await ctx.storage.generateUploadUrl();

    return { uploadUrl };
  },
});

export const createPreview = mutation({
  args: {
    projectId: v.id('projects'),
    storageId: v.id('_storage'),
    token: v.string(),
  },
  handler: async (
    ctx,
    { projectId, storageId, token },
  ): Promise<Id<'previews'>> => {
    if (token !== process.env.UPLOAD_TOKEN) {
      throw new Error('Unauthorized');
    }

    const existingPreview = await ctx.db
      .query('previews')
      .withIndex('project', (q) => q.eq('projectId', projectId))
      .filter((q) => q.eq(q.field('deletedAt'), null))
      .unique();

    if (existingPreview) {
      await ctx.db.patch(existingPreview._id, { storageId });
      await ctx.storage.delete(existingPreview.storageId);

      return existingPreview._id;
    }

    return await ctx.db.insert('previews', {
      deletedAt: null,
      projectId,
      storageId,
    });
  },
});
