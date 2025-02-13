import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import type { Doc, Id } from './_generated/dataModel';
import { query, type QueryCtx } from './_generated/server';

export const loadProjects = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    return await ctx.db
      .query('projects')
      .withIndex('deletedByOrder', (q) => q.eq('deletedAt', null))
      .filter((q) => q.neq(q.field('publishedAt'), null))
      .order('asc')
      .paginate(paginationOpts);
  },
});

const getProjectOrNotFound = async (
  ctx: QueryCtx,
  projectId: Id<'projects'>,
): Promise<Doc<'projects'>> => {
  const project = await ctx.db.get(projectId);

  if (!project || project.deletedAt !== null) {
    throw new ConvexError({
      message: 'Project not found',
      code: 404,
    });
  }

  return project;
};

export const loadProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    return await getProjectOrNotFound(ctx, projectId);
  },
});

export const loadProjectPreview = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const project = await getProjectOrNotFound(ctx, projectId);

    if (project.previewImageId) {
      const previewImage = await ctx.db.get(project.previewImageId);

      if (!previewImage || previewImage.deletedAt !== null) {
        throw new ConvexError({
          message: 'Preview not found',
          code: 404,
        });
      }

      const publicUrl = await ctx.storage.getUrl(previewImage.storageId);

      if (publicUrl) {
        return {
          ...previewImage,
          alt: previewImage.alt || project.title,
          publicUrl,
        };
      }
    }

    return null;
  },
});

export const loadProjectCoverImage = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const project = await getProjectOrNotFound(ctx, projectId);

    if (project.coverImageId) {
      const coverImage = await ctx.db.get(project.coverImageId);

      if (!coverImage || coverImage.deletedAt !== null) {
        throw new ConvexError({
          message: 'Cover image not found',
          code: 404,
        });
      }

      const publicUrl = await ctx.storage.getUrl(coverImage.storageId);

      if (publicUrl) {
        return {
          ...coverImage,
          alt: coverImage.alt || project.title,
          publicUrl,
        };
      }
    }

    return null;
  },
});

export const loadProjectEmbed = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const project = await getProjectOrNotFound(ctx, projectId);

    if (project.embedId) {
      const embed = await ctx.db.get(project.embedId);

      if (!embed || embed.deletedAt !== null) {
        throw new ConvexError({
          message: 'Embed not found',
          code: 404,
        });
      }

      return {
        ...embed,
        title: project.title,
      };
    }

    return null;
  },
});

export const loadProjectContent = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const project = await getProjectOrNotFound(ctx, projectId);

    if (project.contentId) {
      const content = await ctx.db.get(project.contentId);

      if (!content || content.deletedAt !== null) {
        throw new ConvexError({
          message: 'Content not found',
          code: 404,
        });
      }

      return content;
    }

    return null;
  },
});
