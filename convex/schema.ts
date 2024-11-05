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
  url: v.string(),
}).index('deletedByOrder', ['deletedAt', 'order']);

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
  features,
  previews,
  projects,
});
