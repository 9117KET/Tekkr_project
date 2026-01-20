/**
 * Chat API Routes
 * 
 * RESTful endpoints for chat functionality:
 * - POST /api/chats - Create new chat
 * - GET /api/chats - List all chats
 * - GET /api/chats/:chatId - Get specific chat
 * - POST /api/chats/:chatId/messages - Send message to chat
 * 
 * Design Decision: Follows existing Fastify route pattern from user/index.ts
 * Auto-loaded by Fastify's autoload plugin system.
 * Folder structure: routes/api/chats/index.ts creates routes at /api/chats/*
 */

import { FastifyPluginAsync } from 'fastify';
import { chatStore } from '../../../domain/chat/store';
import { Message, CreateChatRequest, SendMessageRequest } from '../../../domain/chat/types';
import { LLMProviderFactory } from '../../../domain/llm/factory';
import { randomUUID } from 'crypto';

const chat: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Initialize LLM provider (singleton pattern via factory)
  const llmProvider = LLMProviderFactory.create();

  /**
   * POST /api/chats
   * Create a new chat session
   */
  fastify.post<{ Body: CreateChatRequest }>('/', async (request, reply) => {
    try {
      const { name } = request.body || {};
      const chat = chatStore.createChat(name);
      reply.code(201).send(chat);
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        error: 'Failed to create chat',
        code: 'CHAT_CREATION_ERROR',
      });
    }
  });

  /**
   * GET /api/chats
   * Get all chats
   */
  fastify.get('/', async (request, reply) => {
    try {
      const chats = chatStore.getAllChats();
      reply.send(chats);
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        error: 'Failed to retrieve chats',
        code: 'CHAT_RETRIEVAL_ERROR',
      });
    }
  });

  /**
   * GET /api/chats/:chatId
   * Get a specific chat with all messages
   */
  fastify.get<{ Params: { chatId: string } }>('/:chatId', async (request, reply) => {
    try {
      const { chatId } = request.params;
      const chat = chatStore.getChat(chatId);

      if (!chat) {
        reply.code(404).send({
          error: `Chat with id ${chatId} not found`,
          code: 'CHAT_NOT_FOUND',
        });
        return;
      }

      reply.send(chat);
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({
        error: 'Failed to retrieve chat',
        code: 'CHAT_RETRIEVAL_ERROR',
      });
    }
  });

  /**
   * POST /api/chats/:chatId/messages
   * Send a message to a chat and get LLM response
   */
  fastify.post<{ Params: { chatId: string }; Body: SendMessageRequest }>(
    '/:chatId/messages',
    async (request, reply) => {
      try {
        const { chatId } = request.params;
        const { content } = request.body;

        // Validate request
        if (!content || typeof content !== 'string' || content.trim().length === 0) {
          reply.code(400).send({
            error: 'Message content is required and cannot be empty',
            code: 'INVALID_REQUEST',
          });
          return;
        }

        // Get chat
        const chat = chatStore.getChat(chatId);
        if (!chat) {
          reply.code(404).send({
            error: `Chat with id ${chatId} not found`,
            code: 'CHAT_NOT_FOUND',
          });
          return;
        }

        // Create user message
        const userMessage: Message = {
          id: randomUUID(),
          role: 'user',
          content: content.trim(),
          timestamp: Date.now(),
        };

        // Add user message to chat
        chatStore.addMessage(chatId, userMessage);

        // Refresh chat reference to get updated messages (including the new user message)
        const updatedChat = chatStore.getChat(chatId);
        if (!updatedChat) {
          reply.code(404).send({
            error: `Chat with id ${chatId} not found`,
            code: 'CHAT_NOT_FOUND',
          });
          return;
        }

        // Get conversation history for LLM (includes the new user message)
        const conversationHistory = updatedChat.messages;

        // Call LLM provider
        let assistantResponse: string;
        try {
          assistantResponse = await llmProvider.sendMessage(conversationHistory);
        } catch (llmError: unknown) {
          fastify.log.error({ err: llmError }, 'LLM error');
          // Remove the user message if LLM call failed
          const chatToUpdate = chatStore.getChat(chatId);
          if (chatToUpdate) {
            chatToUpdate.messages = chatToUpdate.messages.filter((msg) => msg.id !== userMessage.id);
          }
          reply.code(500).send({
            error: 'Failed to get response from LLM',
            code: 'LLM_ERROR',
          });
          return;
        }

        // Create assistant message
        const assistantMessage: Message = {
          id: randomUUID(),
          role: 'assistant',
          content: assistantResponse,
          timestamp: Date.now(),
        };

        // Add assistant message to chat
        chatStore.addMessage(chatId, assistantMessage);

        // Return both messages
        reply.send({
          message: userMessage,
          response: assistantMessage,
        });
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({
          error: 'Failed to send message',
          code: 'MESSAGE_SEND_ERROR',
        });
      }
    }
  );
};

export default chat;
