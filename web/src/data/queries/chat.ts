/**
 * Chat queries & mutations (React Query).
 *
 * Responsibility:
 * - Provide a small, typed client layer for chat endpoints exposed by the Fastify backend.
 * - Centralize query keys and cache invalidation for chat-related operations.
 *
 * Why this exists:
 * - Keeps UI components simple (SOLID: Single Responsibility) by moving data-fetching logic out of pages/components.
 * - Makes it easy to change API details without touching UI code (Open/Closed via stable hook contracts).
 */
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../client";
import type {AxiosError} from "axios";

export type ChatRole = "user" | "assistant";
export type LLMProviderType = "anthropic" | "openai" | "gemini";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  // Phase 3: may include projectPlan
  projectPlan?: unknown;
}

export interface Chat {
  id: string;
  name: string;
  messages: ChatMessage[];
  llmProvider: LLMProviderType;
  llmModel: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateChatRequest {
  name?: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  message: ChatMessage;
  response: ChatMessage;
}

export interface UpdateChatModelRequest {
  provider: LLMProviderType;
  model: string;
}

function chatsKey() {
  return ["chats"] as const;
}

function chatKey(chatId: string) {
  return ["chat", chatId] as const;
}

export function useChatsQuery() {
  return useQuery({
    queryKey: chatsKey(),
    queryFn: async () => {
      const response = await apiClient.get("/api/chats");
      if (response.status !== 200) {
        throw new Error("Failed to fetch chats");
      }
      return response.data as Chat[];
    },
  });
}

export function useChatQuery(chatId: string | null) {
  return useQuery({
    queryKey: chatId ? chatKey(chatId) : ["chat", "none"],
    enabled: Boolean(chatId),
    queryFn: async () => {
      if (!chatId) throw new Error("chatId is required");
      const response = await apiClient.get(`/api/chats/${chatId}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch chat");
      }
      return response.data as Chat;
    },
  });
}

export function useCreateChatMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateChatRequest = {}) => {
      const response = await apiClient.post("/api/chats", body);
      if (response.status !== 201) {
        throw new Error("Failed to create chat");
      }
      return response.data as Chat;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: chatsKey()});
    },
  });
}

export function useSendMessageMutation(chatId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: SendMessageRequest) => {
      if (!chatId) throw new Error("chatId is required");
      try {
        const response = await apiClient.post(`/api/chats/${chatId}/messages`, body);
        return response.data as SendMessageResponse;
      } catch (e) {
        const err = e as AxiosError<{error?: string; code?: string}>;
        const status = err.response?.status;
        const apiError = err.response?.data?.error;
        if (status && apiError) {
          throw new Error(`${apiError} (HTTP ${status})`);
        }
        throw new Error("Failed to send message");
      }
    },
    onSuccess: async () => {
      if (!chatId) return;
      await queryClient.invalidateQueries({queryKey: chatKey(chatId)});
      await queryClient.invalidateQueries({queryKey: chatsKey()});
    },
  });
}

export function useUpdateChatModelMutation(chatId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateChatModelRequest) => {
      if (!chatId) throw new Error("chatId is required");
      try {
        const response = await apiClient.patch(`/api/chats/${chatId}/model`, body);
        return response.data as Chat;
      } catch (e) {
        const err = e as AxiosError<{error?: string; code?: string}>;
        const status = err.response?.status;
        const apiError = err.response?.data?.error;
        if (status && apiError) {
          throw new Error(`${apiError} (HTTP ${status})`);
        }
        throw new Error("Failed to update chat model");
      }
    },
    onSuccess: async () => {
      if (!chatId) return;
      await queryClient.invalidateQueries({queryKey: chatKey(chatId)});
      await queryClient.invalidateQueries({queryKey: chatsKey()});
    },
  });
}

