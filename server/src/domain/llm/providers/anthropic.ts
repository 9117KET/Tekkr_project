/**
 * Anthropic Claude Provider
 * 
 * Implementation of LLMProvider for Anthropic's Claude API.
 * Uses @anthropic-ai/sdk for API communication.
 * 
 * Design Decision: Implements LLMProvider interface, allowing easy swapping
 * with other providers without changing route code.
 */

import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider } from '../types';
import { Message } from '../../chat/types';

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;
  private model: string;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is required');
    }

    this.client = new Anthropic({ apiKey });
    // Default to a currently-supported model. Older snapshot model IDs may 404 depending on account access/deprecations.
    // You can override via ANTHROPIC_MODEL environment variable.
    this.model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514';
  }

  getName(): string {
    return 'Anthropic Claude';
  }

  getModel(): string {
    return this.model;
  }

  /**
   * Convert our Message format to Anthropic's message format
   */
  private convertMessages(messages: Message[]): Anthropic.MessageParam[] {
    return messages.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));
  }

  /**
   * Send messages to Claude and get response
   */
  async sendMessage(
    messages: Message[],
    options?: { systemPrompt?: string; model?: string }
  ): Promise<string> {
    try {
      // Convert our message format to Anthropic format
      const anthropicMessages = this.convertMessages(messages);

      // Call Anthropic API
      const response = await this.client.messages.create({
        model: options?.model || this.model,
        max_tokens: 4096,
        ...(options?.systemPrompt ? { system: options.systemPrompt } : {}),
        messages: anthropicMessages,
      });

      // Extract text content from response
      // Anthropic returns content as an array, we need the first text block
      // Response content can be TextBlock, ThinkingBlock, etc.
      const textBlock = response.content.find(
        (block) => block.type === 'text'
      );

      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text content in Anthropic response');
      }

      return textBlock.text;
    } catch (error: unknown) {
      // Handle API errors gracefully
      if (error instanceof Anthropic.APIError) {
        throw new Error(`Anthropic API error: ${error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Failed to get response from Anthropic: ${error.message}`);
      }
      throw new Error('Unknown error occurred while calling Anthropic API');
    }
  }
}
