/**
 * Chat Store - In-Memory Storage
 * 
 * Singleton pattern for managing chat data in memory.
 * Provides CRUD operations for chats and messages.
 * 
 * Design Decision: Singleton ensures single source of truth for in-memory storage.
 */

import { Chat, Message } from './types';
import { randomUUID } from 'crypto';

class ChatStore {
  private chats: Map<string, Chat> = new Map();
  private chatCounter = 0;

  /**
   * Create a new chat
   * @param name - Optional chat name (auto-generated if not provided)
   * @returns The newly created chat
   */
  createChat(name?: string): Chat {
    const id = randomUUID();
    const now = Date.now();
    const chatName = name || `Chat ${++this.chatCounter}`;

    const chat: Chat = {
      id,
      name: chatName,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    this.chats.set(id, chat);
    return chat;
  }

  /**
   * Get a chat by ID
   * @param chatId - The chat identifier
   * @returns The chat or undefined if not found
   */
  getChat(chatId: string): Chat | undefined {
    return this.chats.get(chatId);
  }

  /**
   * Get all chats
   * @returns Array of all chats
   */
  getAllChats(): Chat[] {
    return Array.from(this.chats.values());
  }

  /**
   * Add a message to a chat
   * @param chatId - The chat identifier
   * @param message - The message to add
   * @throws Error if chat not found
   */
  addMessage(chatId: string, message: Message): void {
    const chat = this.chats.get(chatId);
    if (!chat) {
      throw new Error(`Chat with id ${chatId} not found`);
    }

    chat.messages.push(message);
    chat.updatedAt = Date.now();
  }

  /**
   * Update chat properties
   * @param chatId - The chat identifier
   * @param updates - Partial chat object with fields to update
   * @throws Error if chat not found
   */
  updateChat(chatId: string, updates: Partial<Chat>): void {
    const chat = this.chats.get(chatId);
    if (!chat) {
      throw new Error(`Chat with id ${chatId} not found`);
    }

    Object.assign(chat, updates);
    chat.updatedAt = Date.now();
  }
}

// Singleton instance
export const chatStore = new ChatStore();
