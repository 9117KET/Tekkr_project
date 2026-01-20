/**
 * Gemini Provider (Stub)
 * 
 * Placeholder implementation for Google Gemini models.
 * This will be fully implemented when Gemini support is needed.
 * 
 * Design Decision: Stub allows structure to be in place for future implementation
 * without breaking the abstraction layer.
 */

import { LLMProvider } from '../types';
import { Message } from '../../chat/types';

export class GeminiProvider implements LLMProvider {
  getName(): string {
    return 'Google Gemini';
  }

  getModel(): string {
    return 'gemini-2.0-flash-exp';
  }

  async sendMessage(messages: Message[], options?: { systemPrompt?: string }): Promise<string> {
    throw new Error('Gemini provider is not yet implemented. Please use Anthropic or OpenAI.');
  }
}
