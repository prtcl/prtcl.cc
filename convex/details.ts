import { ConvexError, v } from 'convex/values';
import type { Doc, Id } from './_generated/dataModel';
import { internalMutation, type MutationCtx, query } from './_generated/server';

export const loadProjectDetails = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);

    if (!project || project.deletedAt !== null) {
      throw new ConvexError({
        message: 'Project not found',
        code: 404,
      });
    }

    const details = await ctx.db
      .query('details')
      .withIndex('project', (q) => q.eq('projectId', projectId))
      .filter((q) => q.eq(q.field('deletedAt'), null))
      .unique();

    if (!details) {
      throw new ConvexError({
        message: 'Project details not found',
        code: 404,
      });
    }

    const { title } = project;
    const { coverImageId, embedId } = details;
    const coverImageUrl: string | null = coverImageId
      ? await ctx.storage.getUrl(coverImageId)
      : null;
    const embed: Doc<'embeds'> | null = embedId
      ? await ctx.db.get(embedId)
      : null;

    return {
      ...details,
      coverImage: coverImageUrl
        ? {
            alt: title,
            url: coverImageUrl,
          }
        : null,
      embed: embed
        ? {
            ...embed,
            title,
          }
        : null,
    };
  },
});

const services = v.union(
  v.literal('bandcamp'),
  v.literal('youtube'),
  v.literal('soundcloud'),
);

const getOrInsertProjectDetails = async (
  ctx: MutationCtx,
  projectId: Id<'projects'>,
) => {
  let details = await ctx.db
    .query('details')
    .withIndex('project', (q) => q.eq('projectId', projectId))
    .filter((q) => q.eq(q.field('deletedAt'), null))
    .unique();

  if (!details) {
    const insertedId = await ctx.db.insert('details', {
      projectId,
      coverImageId: null,
      deletedAt: null,
      embedId: null,
    });
    details = await ctx.db.get(insertedId);
  }

  if (!details) {
    throw new ConvexError({
      message: 'Details not found',
      code: 500,
    });
  }

  return details;
};

export const attachProjectEmbed = internalMutation({
  args: {
    projectId: v.id('projects'),
    service: services,
    src: v.string(),
  },
  handler: async (ctx, { projectId, service, src }) => {
    const project = await ctx.db.get(projectId);

    if (!project) {
      throw new ConvexError({
        message: 'Project not found',
        code: 500,
      });
    }

    const existingDetails = await getOrInsertProjectDetails(ctx, projectId);
    const existingEmbed = existingDetails?.embedId
      ? await ctx.db.get(existingDetails?.embedId)
      : null;

    if (existingEmbed) {
      await ctx.db.delete(existingEmbed._id);
    }

    const embedId = await ctx.db.insert('embeds', {
      deletedAt: null,
      service,
      src,
    });

    return await ctx.db.patch(existingDetails._id, {
      embedId,
    });
  },
});

export const attachProjectCoverImage = internalMutation({
  args: {
    coverImageId: v.id('_storage'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, { coverImageId, projectId }) => {
    const project = await ctx.db.get(projectId);

    if (!project) {
      throw new ConvexError({
        message: 'Project not found',
        code: 500,
      });
    }

    const existingCoverImage = await ctx.storage.getUrl(coverImageId);

    if (!existingCoverImage) {
      throw new ConvexError({
        message: 'Cover image does not exist',
        code: 500,
      });
    }

    const existingDetails = await getOrInsertProjectDetails(ctx, projectId);

    return await ctx.db.patch(existingDetails._id, {
      coverImageId,
    });
  },
});
