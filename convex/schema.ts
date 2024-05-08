import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const projects = defineTable({
  category: v.union(v.literal('code'), v.literal('sound'), v.literal('press')),
  deletedAt: v.union(v.number(), v.null()),
  label: v.string(),
  order: v.number(),
  url: v.string(),
});

export default defineSchema({
  projects,
});
