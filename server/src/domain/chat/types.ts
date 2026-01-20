/**
 * Chat Domain Types
 * 
 * Defines the data structures for chat functionality.
 * These types are used throughout the chat domain (storage, API, etc.)
 */

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  // ProjectPlan will be added in Phase 3
  projectPlan?: unknown;
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

/**
 * Request types for API endpoints
 */
export interface CreateChatRequest {
  name?: string;
}

export interface SendMessageRequest {
  content: string;
}
