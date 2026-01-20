/**
 * OpenAI Provider (Stub)
 * 
 * Placeholder implementation for OpenAI GPT models.
 * This will be fully implemented when OpenAI support is needed.
 * 
 * Design Decision: Stub allows structure to be in place for future implementation
 * without breaking the abstraction layer.
 */

import { LLMProvider } from '../types';
import { Message } from '../../chat/types';

export class OpenAIProvider implements LLMProvider {
  getName(): string {
    return 'OpenAI GPT';
  }

  getModel(): string {
    return 'gpt-4';
  }

  async sendMessage(messages: Message[]): Promise<string> {
    throw new Error('OpenAI provider is not yet implemented. Please use Anthropic or Gemini.');
  }
}
