import type { Doc, Id } from '~/convex/dataModel';

export type ProjectId = Id<'projects'>;
export type ProjectEntity = Doc<'projects'>;
export type CoverImageEntity = Doc<'images'> & { publicUrl: string };
export type EmbedCodeEntity = Doc<'embeds'> & { title: string };
export type ContentEntity = Doc<'content'>;
