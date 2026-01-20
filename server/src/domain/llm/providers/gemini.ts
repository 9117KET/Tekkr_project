/**
 * Gemini Provider
 *
 * Responsibility:
 * - Implement LLMProvider for Google Gemini via `@google/generative-ai`.
 *
 * Notes:
 * - This is used by the bonus model selector (multi-provider support).
 * - Requires GEMINI_API_KEY in environment variables.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMProvider } from '../types';
import { Message } from '../../chat/types';

export class GeminiProvider implements LLMProvider {
  private client: GoogleGenerativeAI;
  private defaultModel: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is required');
    this.client = new GoogleGenerativeAI(apiKey);
    this.defaultModel = process.env.GEMINI_DEFAULT_MODEL || 'gemini-2.0-flash';
  }

  getName(): string {
    return 'Google Gemini';
  }

  getModel(): string {
    return this.defaultModel;
  }

  async sendMessage(
    messages: Message[],
    options?: { systemPrompt?: string; model?: string }
  ): Promise<string> {
    const modelName = options?.model || this.defaultModel;
    const model = this.client.getGenerativeModel({ model: modelName });

    // Simple, boring conversion: flatten conversation into a prompt.
    // This keeps the integration minimal (YAGNI) while still supporting multi-turn context.
    const parts: string[] = [];
    if (options?.systemPrompt) parts.push(`System: ${options.systemPrompt}`);
    for (const m of messages) {
      parts.push(`${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`);
    }
    parts.push('Assistant:');
    const prompt = parts.join('\n\n');

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    if (!text) throw new Error('No content in Gemini response');
    return text;
  }
}
