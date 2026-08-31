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
  context: v.optional(v.string()),
  deletedAt: v.union(v.number(), v.null()),
  order: v.number(),
  publishedAt: v.union(v.number(), v.null()),
  releaseDate: v.optional(v.number()),
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

const summaryStatus = v.union(v.literal('draft'), v.literal('published'), v.literal('deleted'));

const summaries = defineTable({
  content: v.string(),
  inputs: v.array(v.id('projects')),
  model: v.optional(v.string()),
  status: summaryStatus,
  updatedAt: v.number(),
});

export default defineSchema({
  images,
  projects,
  summaries,
});
