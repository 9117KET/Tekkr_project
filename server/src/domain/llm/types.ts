/**
 * LLM Provider Types
 * 
 * Defines the interface for LLM providers and shared types.
 * This abstraction allows easy swapping between different LLM providers
 * (Anthropic, OpenAI, Gemini) without changing route code.
 */

import { Message } from '../chat/types';

/**
 * Supported LLM provider types
 */
export type LLMProviderType = 'anthropic' | 'openai' | 'gemini';

/**
 * LLM Provider Interface
 * 
 * All LLM providers must implement this interface.
 * This follows the Strategy Pattern for easy provider swapping.
 */
export interface LLMProvider {
  /**
   * Send messages to the LLM and get a response
   * @param messages - Array of messages (conversation history)
   * @returns The LLM's text response
   */
  sendMessage(messages: Message[]): Promise<string>;

  /**
   * Get the provider's display name
   * @returns Provider name (e.g., "Anthropic Claude")
   */
  getName(): string;

  /**
   * Get the current model being used
   * @returns Model identifier (e.g., "claude-3-5-sonnet-20241022")
   */
  getModel(): string;
}

/**
 * LLM API Message Format
 * 
 * Different LLM providers use different message formats.
 * This type represents the common structure we'll convert to/from.
 */
export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}
