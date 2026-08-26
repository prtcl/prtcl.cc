import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import { invariantUploadToken } from './lib/invariants';

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
  handler: async (ctx, args) => {
    invariantUploadToken(args.token);

    return {
      uploadUrl: await ctx.storage.generateUploadUrl(),
    };
  },
});

const imagePayload = v.object({
  alt: v.union(v.string(), v.null()),
  description: v.union(v.string(), v.null()),
  mimeType: v.string(),
  naturalHeight: v.number(),
  naturalWidth: v.number(),
  size: v.number(),
  storageId: v.id('_storage'),
});

export const createImage = mutation({
  args: {
    payload: imagePayload,
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const {
      payload: { naturalHeight, naturalWidth, ...restPayload },
      token,
    } = args;
    invariantUploadToken(token);

    return await ctx.db.insert('images', {
      ...restPayload,
      aspectRatio: naturalWidth / naturalHeight,
      deletedAt: null,
      naturalHeight,
      naturalWidth,
      updatedAt: Date.now(),
    });
  },
});
