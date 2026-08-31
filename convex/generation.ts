'use node';

import { ConvexError } from 'convex/values';
import { internal } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { internalAction } from './_generated/server';
import { getAnthropicClient } from './lib/anthropic';
import { buildProjectsPrompt } from './lib/prompts';

const MAX_TOKENS = 1024;

export const generateProjectsSummary = internalAction({
  args: {},
  handler: async (ctx): Promise<Id<'summaries'>> => {
    const projects = await ctx.runQuery(internal.projects.getRecentProjects, {});
    if (projects.length === 0) {
      throw new ConvexError({ message: 'No published projects to summarize', code: 400 });
    }

    const { client, model } = getAnthropicClient();
    const { prompt, system } = buildProjectsPrompt(projects);

    const res = await client.messages.create({
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
      model,
      system,
    });

    const textBlock = res.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new ConvexError({ message: 'No text content in Anthropic response', code: 500 });
    }

    const content = textBlock.text.trim();
    return await ctx.runMutation(internal.summaries.insertSummary, {
      content,
      inputs: projects.map((p) => p._id),
      model,
    });
  },
});
