import { ConvexError, v } from 'convex/values';
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
  handler: async (ctx, args) => {
    assertUploadToken(args.token);

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
    assertUploadToken(token);

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
    assertUploadToken(token);

    const project = await ctx.db.get(projectId);

    if (!project) {
      throw new ConvexError({
        message: 'Project not found',
        code: 404,
      });
    }

    if (project.previewImageId) {
      const existingPreviewImage = await ctx.db.get(project.previewImageId);

      if (existingPreviewImage) {
        await ctx.db.patch(existingPreviewImage._id, {
          deletedAt: Date.now(),
        });
      }
    }

    return await ctx.db.patch(project._id, {
      previewImageId,
      updatedAt: Date.now(),
    });
  },
});

function assertUploadToken(token: unknown): asserts token is string {
  if (!process.env.UPLOAD_TOKEN) {
    throw new Error('No upload token set!');
  }
  if (typeof token !== 'string' || token !== process.env.UPLOAD_TOKEN) {
    throw new Error('Unauthorized');
  }
}

// const services = v.union(
//   v.literal('bandcamp'),
//   v.literal('youtube'),
//   v.literal('soundcloud'),
// );

// const getOrInsertProjectDetails = async (
//   ctx: MutationCtx,
//   projectId: Id<'projects'>,
// ) => {
//   let details = await ctx.db
//     .query('details')
//     .withIndex('project', (q) => q.eq('projectId', projectId))
//     .filter((q) => q.eq(q.field('deletedAt'), null))
//     .unique();

//   if (!details) {
//     const insertedId = await ctx.db.insert('details', {
//       content: null,
//       coverImageId: null,
//       deletedAt: null,
//       embedId: null,
//       projectId,
//     });
//     details = await ctx.db.get(insertedId);
//   }

//   if (!details) {
//     throw new ConvexError({
//       message: 'Details not found',
//       code: 500,
//     });
//   }

//   return details;
// };

// export const attachProjectEmbed = internalMutation({
//   args: {
//     projectId: v.id('projects'),
//     service: services,
//     src: v.string(),
//   },
//   handler: async (ctx, { projectId, service, src }) => {
//     const project = await ctx.db.get(projectId);

//     if (!project) {
//       throw new ConvexError({
//         message: 'Project not found',
//         code: 500,
//       });
//     }

//     const existingDetails = await getOrInsertProjectDetails(ctx, projectId);
//     const existingEmbed = existingDetails?.embedId
//       ? await ctx.db.get(existingDetails?.embedId)
//       : null;

//     if (existingEmbed) {
//       await ctx.db.delete(existingEmbed._id);
//     }

//     const embedId = await ctx.db.insert('embeds', {
//       deletedAt: null,
//       service,
//       src,
//     });

//     return await ctx.db.patch(existingDetails._id, {
//       embedId,
//     });
//   },
// });

// export const attachProjectCoverImage = internalMutation({
//   args: {
//     coverImageId: v.id('_storage'),
//     projectId: v.id('projects'),
//   },
//   handler: async (ctx, { coverImageId, projectId }) => {
//     const project = await ctx.db.get(projectId);

//     if (!project) {
//       throw new ConvexError({
//         message: 'Project not found',
//         code: 500,
//       });
//     }

//     const existingCoverImage = await ctx.storage.getUrl(coverImageId);

//     if (!existingCoverImage) {
//       throw new ConvexError({
//         message: 'Cover image does not exist',
//         code: 500,
//       });
//     }

//     const existingDetails = await getOrInsertProjectDetails(ctx, projectId);

//     return await ctx.db.patch(existingDetails._id, {
//       coverImageId,
//     });
//   },
// });
