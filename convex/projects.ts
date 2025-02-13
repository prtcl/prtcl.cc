import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { query } from './_generated/server';
import {
  invariantActiveContent,
  invariantActiveEmbed,
  invariantActiveImage,
  invariantActiveProject,
  invariantPublicUrl,
} from './lib/invariants';

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

export const loadProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    invariantActiveProject(project);

    return project;
  },
});

export const loadProjectPreview = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    invariantActiveProject(project);

    if (project.previewImageId) {
      const previewImage = await ctx.db.get(project.previewImageId);
      invariantActiveImage(previewImage);

      const publicUrl = await ctx.storage.getUrl(previewImage.storageId);
      invariantPublicUrl(publicUrl);

      return {
        ...previewImage,
        alt: previewImage.alt || project.title,
        publicUrl,
      };
    }

    return null;
  },
});

export const loadProjectCoverImage = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    invariantActiveProject(project);

    if (project.coverImageId) {
      const coverImage = await ctx.db.get(project.coverImageId);
      invariantActiveImage(coverImage);

      const publicUrl = await ctx.storage.getUrl(coverImage.storageId);
      invariantPublicUrl(publicUrl);

      return {
        ...coverImage,
        alt: coverImage.alt || project.title,
        publicUrl,
      };
    }

    return null;
  },
});

export const loadProjectEmbed = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    const project = await ctx.db.get(projectId);
    invariantActiveProject(project);

    if (project.embedId) {
      const embed = await ctx.db.get(project.embedId);
      invariantActiveEmbed(embed);

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
    const project = await ctx.db.get(projectId);
    invariantActiveProject(project);

    if (project.contentId) {
      const content = await ctx.db.get(project.contentId);
      invariantActiveContent(content);

      return content;
    }

    return null;
  },
});
