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

export default defineSchema({
  projects,
});
