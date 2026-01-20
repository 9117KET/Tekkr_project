/**
 * LLM Provider Factory
 * 
 * Creates LLM provider instances based on configuration.
 * Uses environment variable LLM_PROVIDER to determine which provider to use.
 * 
 * Design Pattern: Factory Pattern - centralizes provider creation logic
 * Design Decision: Makes swapping providers trivial (change one env var)
 */

import { LLMProvider, LLMProviderType } from './types';
import { AnthropicProvider } from './providers/anthropic';
import { OpenAIProvider } from './providers/openai';
import { GeminiProvider } from './providers/gemini';

export class LLMProviderFactory {
  /**
   * Create an LLM provider instance based on configuration
   * @param providerType - Optional provider type (defaults to env var or 'anthropic')
   * @returns LLM provider instance
   * @throws Error if provider type is invalid
   */
  static create(providerType?: LLMProviderType): LLMProvider {
    // Get provider type from parameter, env var, or default to anthropic
    const type = providerType || (process.env.LLM_PROVIDER as LLMProviderType) || 'anthropic';

    switch (type) {
      case 'anthropic':
        return new AnthropicProvider();
      case 'openai':
        return new OpenAIProvider();
      case 'gemini':
        return new GeminiProvider();
      default:
        throw new Error(
          `Invalid LLM provider type: ${type}. Must be one of: anthropic, openai, gemini`
        );
    }
  }

  /**
   * Get the currently configured provider type
   * @returns The provider type from env var or default
   */
  static getProviderType(): LLMProviderType {
    return (process.env.LLM_PROVIDER as LLMProviderType) || 'anthropic';
  }
}
