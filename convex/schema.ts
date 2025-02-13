import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const categories = v.union(
  v.literal('code'),
  v.literal('sound'),
  v.literal('text'),
  v.literal('video'),
);

const services = v.union(
  v.literal('bandcamp'),
  v.literal('youtube'),
  v.literal('soundcloud'),
);

const projects = defineTable({
  category: categories,
  contentId: v.union(v.id('content'), v.null()),
  coverImageId: v.union(v.id('images'), v.null()),
  deletedAt: v.union(v.number(), v.null()),
  embedId: v.union(v.id('embeds'), v.null()),
  order: v.number(),
  previewImageId: v.union(v.id('images'), v.null()),
  publishedAt: v.union(v.number(), v.null()),
  title: v.string(),
  updatedAt: v.union(v.number(), v.null()),
  url: v.string(),
}).index('deletedByOrder', ['deletedAt', 'order']);

const embeds = defineTable({
  deletedAt: v.union(v.number(), v.null()),
  service: services,
  src: v.string(),
  updatedAt: v.union(v.number(), v.null()),
});

const content = defineTable({
  content: v.union(v.string(), v.null()),
  deletedAt: v.union(v.number(), v.null()),
  updatedAt: v.union(v.number(), v.null()),
});

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

export const features = defineTable({
  description: v.union(v.string(), v.null()),
  key: v.string(),
  value: v.boolean(),
});

export default defineSchema({
  content,
  embeds,
  features,
  images,
  projects,
});
