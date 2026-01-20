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

function isProjectPlanRequest(text: string): boolean {
  return /project\s+plan/i.test(text);
}

function buildProjectPlanSystemPrompt(): string {
  return [
    'When (and only when) the user is requesting a project plan, you MUST include exactly one <project_plan>...</project_plan> block inside your response.',
    'The content inside <project_plan> must be valid JSON (no markdown fences) with this schema:',
    '{"workstreams":[{"title":string,"description":string,"deliverables":[{"title":string,"description":string}]}]}',
    'Outside the <project_plan> block, respond normally with helpful natural language.',
    'The <project_plan> block MAY appear in the middle of your message (include 1-2 sentences before and after it).',
    'Do not include any other <project_plan> blocks. Do not put any extra text inside the tags besides JSON.',
  ].join('\n');
}

function extractProjectPlanJson(content: string): string | null {
  const open = '<project_plan>';
  const close = '</project_plan>';
  const start = content.indexOf(open);
  const end = content.indexOf(close);
  if (start === -1 || end === -1 || end <= start) return null;
  return content.slice(start + open.length, end).trim();
}

const chat: FastifyPluginAsync = async (fastify): Promise<void> => {
  // LLM provider is selected per-chat (bonus model selector)

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
   * PATCH /api/chats/:chatId/model
   * Update a chat's LLM provider/model selection (bonus).
   */
  fastify.patch<{
    Params: { chatId: string };
    Body: { provider: 'anthropic' | 'openai' | 'gemini'; model: string };
  }>('/:chatId/model', async (request, reply) => {
    try {
      const { chatId } = request.params;
      const { provider, model } = request.body || ({} as any);

      if (!provider || (provider !== 'anthropic' && provider !== 'openai' && provider !== 'gemini')) {
        reply.code(400).send({ error: 'provider must be one of: anthropic, openai, gemini', code: 'INVALID_REQUEST' });
        return;
      }
      if (!model || typeof model !== 'string' || model.trim().length === 0) {
        reply.code(400).send({ error: 'model is required', code: 'INVALID_REQUEST' });
        return;
      }

      const chat = chatStore.getChat(chatId);
      if (!chat) {
        reply.code(404).send({ error: `Chat with id ${chatId} not found`, code: 'CHAT_NOT_FOUND' });
        return;
      }

      chatStore.updateChat(chatId, { llmProvider: provider, llmModel: model.trim() });
      const updated = chatStore.getChat(chatId);
      reply.send(updated);
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to update chat model', code: 'CHAT_UPDATE_ERROR' });
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

        // Call LLM provider (per-chat provider/model)
        let assistantResponse: string;
        try {
          const wantsProjectPlan = isProjectPlanRequest(content);
          const provider = LLMProviderFactory.create(chat.llmProvider);
          assistantResponse = await provider.sendMessage(conversationHistory, {
            systemPrompt: wantsProjectPlan ? buildProjectPlanSystemPrompt() : undefined,
            model: chat.llmModel,
          });
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

        // If the response contains a project plan block, attach the parsed plan for reliable rendering.
        const planJson = extractProjectPlanJson(assistantResponse);
        if (planJson) {
          try {
            assistantMessage.projectPlan = JSON.parse(planJson);
          } catch {
            // Fail closed: keep message text; skip attaching invalid plan JSON.
          }
        }

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
