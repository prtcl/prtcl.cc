import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const categories = v.union(
  v.literal('code'),
  v.literal('sound'),
  v.literal('text'),
  v.literal('video'),
);

const projects = defineTable({
  category: categories,
  coverImageId: v.optional(v.union(v.id('images'), v.null())),
  deletedAt: v.union(v.number(), v.null()),
  embedId: v.optional(v.union(v.id('embeds'), v.null())),
  order: v.number(),
  previewImageId: v.optional(v.union(v.id('images'), v.null())),
  publishedAt: v.union(v.number(), v.null()),
  title: v.string(),
  updatedAt: v.optional(v.union(v.number(), v.null())),
  url: v.string(),
}).index('deletedByOrder', ['deletedAt', 'order']);

const images = defineTable({
  alt: v.union(v.string(), v.null()),
  aspectRatio: v.number(),
  deletedAt: v.union(v.number(), v.null()),
  description: v.union(v.string(), v.null()),
  mimeType: v.string(),
  naturalHeight: v.number(),
  naturalWidth: v.number(),
  size: v.number(),
  storageId: v.id('_storage'),
  updatedAt: v.number(),
});

const details = defineTable({
  content: v.union(v.string(), v.null()),
  coverImageId: v.union(v.id('_storage'), v.null()),
  deletedAt: v.union(v.number(), v.null()),
  embedId: v.union(v.id('embeds'), v.null()),
  projectId: v.id('projects'),
}).index('project', ['projectId']);

const services = v.union(
  v.literal('bandcamp'),
  v.literal('youtube'),
  v.literal('soundcloud'),
);

const embeds = defineTable({
  deletedAt: v.union(v.number(), v.null()),
  service: services,
  src: v.string(),
  updatedAt: v.optional(v.union(v.number(), v.null())),
});

const previews = defineTable({
  deletedAt: v.union(v.number(), v.null()),
  projectId: v.id('projects'),
  storageId: v.id('_storage'),
}).index('project', ['projectId']);

export const features = defineTable({
  description: v.optional(v.string()),
  key: v.string(),
  value: v.boolean(),
});

export default defineSchema({
  details,
  embeds,
  features,
  images,
  previews,
  projects,
});
