/**
 * localStorage persistence helpers.
 *
 * Responsibility:
 * - Persist and restore small UI state for the chat app (selected chat id, optional cached chat list).
 *
 * Why this exists:
 * - Keeps persistence concerns out of UI components (SOLID: Single Responsibility).
 * - Makes the persistence mechanism easy to swap later (e.g., server-driven session) without rewriting UI logic.
 */

const STORAGE_KEYS = {
  selectedChatId: "tekkr.selectedChatId",
  chatsCache: "tekkr.chatsCache",
} as const;

export function loadSelectedChatId(): string | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEYS.selectedChatId);
    return value && value.trim().length > 0 ? value : null;
  } catch {
    return null;
  }
}

export function saveSelectedChatId(chatId: string | null) {
  try {
    if (!chatId) {
      window.localStorage.removeItem(STORAGE_KEYS.selectedChatId);
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.selectedChatId, chatId);
  } catch {
    // ignore (e.g., privacy mode / storage disabled)
  }
}

/**
 * Optional: cache chat list as a fast first paint fallback.
 * Backend remains the source of truth; cache is best-effort only.
 */
export function loadCachedChats<T>(): T | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.chatsCache);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveCachedChats<T>(chats: T) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.chatsCache, JSON.stringify(chats));
  } catch {
    // ignore
  }
}

