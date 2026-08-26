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
  deletedAt: v.union(v.number(), v.null()),
  order: v.number(),
  publishedAt: v.union(v.number(), v.null()),
  title: v.string(),
  updatedAt: v.union(v.number(), v.null()),
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

export default defineSchema({
  images,
  projects,
});
