import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { internalMutation, mutation, query } from './_generated/server';
import {
  invariantActiveProject,
  invariantEmbedService,
  invariantImage,
  invariantUploadToken,
} from './lib/invariants';
import { Service, type Services } from './lib/types';

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

export const attachImagePreview = mutation({
  args: {
    previewImageId: v.id('images'),
    projectId: v.id('projects'),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const { previewImageId, projectId, token } = args;
    invariantUploadToken(token);

    const project = await ctx.db.get(projectId);
    invariantActiveProject(project);

    if (project.previewImageId) {
      const existingPreviewImage = await ctx.db.get(project.previewImageId);
      if (existingPreviewImage) {
        await ctx.db.patch(existingPreviewImage._id, {
          deletedAt: Date.now(),
        });
      }
    }

    const targetPreviewImage = await ctx.db.get(previewImageId);
    invariantImage(targetPreviewImage);

    return await ctx.db.patch(project._id, {
      previewImageId,
      updatedAt: Date.now(),
    });
  },
});

const detectEmbedService = (embedCode: string): Services | void => {
  if (embedCode.includes('bandcamp.com')) {
    return Service.BANDCAMP;
  }
  if (embedCode.includes('soundcloud.com')) {
    return Service.SOUNDCLOUD;
  }
  if (embedCode.includes('youtube.com')) {
    return Service.YOUTUBE;
  }
};

export const attachProjectEmbed = internalMutation({
  args: {
    projectId: v.id('projects'),
    src: v.string(),
  },
  handler: async (ctx, args) => {
    const { projectId, src } = args;
    const project = await ctx.db.get(projectId);
    invariantActiveProject(project);

    if (project.embedId) {
      const existingEmbed = await ctx.db.get(project.embedId);
      if (existingEmbed) {
        await ctx.db.patch(existingEmbed._id, {
          deletedAt: Date.now(),
        });
      }
    }

    const service = detectEmbedService(src);
    invariantEmbedService(service);

    const embedId = await ctx.db.insert('embeds', {
      deletedAt: null,
      service,
      src,
      updatedAt: Date.now(),
    });

    return await ctx.db.patch(project._id, {
      embedId,
      updatedAt: Date.now(),
    });
  },
});

export const attachProjectCoverImage = internalMutation({
  args: {
    coverImageId: v.id('images'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, { coverImageId, projectId }) => {
    const project = await ctx.db.get(projectId);
    invariantActiveProject(project);

    if (project.coverImageId) {
      const existingCoverImage = await ctx.db.get(project.coverImageId);
      if (existingCoverImage) {
        await ctx.db.patch(existingCoverImage._id, {
          deletedAt: Date.now(),
        });
      }
    }

    const targetCoverImage = await ctx.db.get(coverImageId);
    invariantImage(targetCoverImage);

    return await ctx.db.patch(projectId, {
      coverImageId: targetCoverImage._id,
      updatedAt: Date.now(),
    });
  },
});
