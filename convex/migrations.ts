import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

export const updateProjectImages = internalMutation({
  args: {
    projectId: v.id('projects'),
    coverImageId: v.union(v.id('images'), v.null()),
    previewImageId: v.union(v.id('images'), v.null()),
  },
  handler: async (ctx, args) => {
    const { projectId, coverImageId = null, previewImageId = null } = args;
    const project = await ctx.db.get(projectId);

    if (!project) {
      throw new Error(`Cannot find project: ${projectId}`);
    }

    const {
      coverImageId: existingCoverImageId,
      previewImageId: existingPreviewImageId,
    } = project;

    if (existingCoverImageId) {
      const existingCoverImage = await ctx.db.get(existingCoverImageId);

      if (existingCoverImage) {
        await ctx.db.patch(existingCoverImage._id, {
          deletedAt: Date.now(),
        });
      }
    }

    if (existingPreviewImageId) {
      const existingPreviewImage = await ctx.db.get(existingPreviewImageId);

      if (existingPreviewImage) {
        await ctx.db.patch(existingPreviewImage._id, {
          deletedAt: Date.now(),
        });
      }
    }

    return await ctx.db.patch(projectId, {
      coverImageId,
      previewImageId,
      updatedAt: Date.now(),
    });
  },
});

// export const migrateProjectEmbeds = internalMutation({
//   args: {},
//   handler: async (ctx) => {
//     const projects = await ctx.db.query('projects').collect();
//     const details = await ctx.db.query('details').collect();
//     const projectToEmbed = new Map(
//       details.filter((d) => !!d.embedId).map((d) => [d.projectId, d.embedId]),
//     );
//     const res: Id<'projects'>[] = [];

//     for (const project of projects) {
//       const embedId = projectToEmbed.get(project._id);

//       if (embedId) {
//         await ctx.db.patch(embedId, { updatedAt: Date.now() });
//         await ctx.db.patch(project._id, {
//           embedId,
//           updatedAt: Date.now(),
//         });
//       } else {
//         await ctx.db.patch(project._id, {
//           embedId: null,
//           updatedAt: Date.now(),
//         });
//       }

//       res.push(project._id);
//     }

//     return res;
//   },
// });

// export const migrateProjectContent = internalMutation({
//   args: {},
//   handler: async (ctx) => {
//     const projects = await ctx.db.query('projects').collect();
//     const details = await ctx.db.query('details').collect();
//     const projectToContent = new Map(
//       details
//         .filter((d) => d.content !== null)
//         .map((d) => [d.projectId, d.content]),
//     );
//     const res: Id<'projects'>[] = [];

//     for (const project of projects) {
//       const content = projectToContent.get(project._id);

//       if (content) {
//         const contentId = await ctx.db.insert('content', {
//           content,
//           deletedAt: null,
//           updatedAt: Date.now(),
//         });
//         await ctx.db.patch(project._id, {
//           contentId,
//           updatedAt: Date.now(),
//         });
//       } else {
//         await ctx.db.patch(project._id, {
//           contentId: null,
//           updatedAt: Date.now(),
//         });
//       }

//       res.push(project._id);
//     }

//     return res;
//   },
// });
