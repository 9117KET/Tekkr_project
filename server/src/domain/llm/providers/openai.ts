/**
 * OpenAI Provider
 *
 * Responsibility:
 * - Implement LLMProvider for OpenAI chat-completions API.
 *
 * Notes:
 * - This is used by the bonus model selector (multi-provider support).
 * - Requires OPENAI_API_KEY in environment variables.
 */

import OpenAI from 'openai';
import { LLMProvider } from '../types';
import { Message } from '../../chat/types';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private defaultModel: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY environment variable is required');
    this.client = new OpenAI({ apiKey });
    this.defaultModel = process.env.OPENAI_DEFAULT_MODEL || 'gpt-4o-mini';
  }

  getName(): string {
    return 'OpenAI';
  }

  getModel(): string {
    return this.defaultModel;
  }

  async sendMessage(
    messages: Message[],
    options?: { systemPrompt?: string; model?: string }
  ): Promise<string> {
    const model = options?.model || this.defaultModel;

    // Convert to OpenAI message format
    const openAiMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
    if (options?.systemPrompt) {
      openAiMessages.push({ role: 'system', content: options.systemPrompt });
    }
    for (const m of messages) {
      openAiMessages.push({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      });
    }

    const response = await this.client.chat.completions.create({
      model,
      messages: openAiMessages,
    });

    const text = response.choices?.[0]?.message?.content;
    if (!text) throw new Error('No content in OpenAI response');
    return text;
  }
}
