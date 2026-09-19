'use node';

import { Anthropic } from '@anthropic-ai/sdk';
import { invariantApiKey } from './invariants';

export const SONNET_MODEL_VERSION = 'claude-sonnet-5';

let client: Anthropic | null = null;

export function getAnthropicClient(): { client: Anthropic; model: string } {
  invariantApiKey(process.env.ANTHROPIC_API_KEY, 'ANTHROPIC_API_KEY');
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      maxRetries: 3,
      timeout: 30000,
    });
  }
  return { client, model: SONNET_MODEL_VERSION };
}
