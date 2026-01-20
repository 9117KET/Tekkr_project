/**
 * ModelSelector (Bonus).
 *
 * Responsibility:
 * - Allow selecting provider + model for the currently selected chat.
 * - Keep the UI intentionally simple (KISS): provider dropdown + model text input.
 *
 * Why this exists:
 * - Demonstrates multi-provider architecture: switching models/providers without changing chat UI logic.
 */

import {useEffect, useMemo, useState} from "react";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import {Chat, LLMProviderType, useUpdateChatModelMutation} from "../data/queries/chat";

const PROVIDERS: Array<{value: LLMProviderType; label: string; defaultModel: string}> = [
  {value: "anthropic", label: "Anthropic", defaultModel: "claude-sonnet-4-20250514"},
  {value: "openai", label: "OpenAI", defaultModel: "gpt-4o-mini"},
  {value: "gemini", label: "Gemini", defaultModel: "gemini-2.0-flash"},
];

export function ModelSelector({chat}: {chat: Chat}) {
  const mutation = useUpdateChatModelMutation(chat.id);

  const initialProvider = chat.llmProvider;
  const initialModel = chat.llmModel;

  const [provider, setProvider] = useState<LLMProviderType>(initialProvider);
  const [model, setModel] = useState<string>(initialModel);

  // Keep local inputs in sync when switching chats.
  useEffect(() => {
    setProvider(chat.llmProvider);
    setModel(chat.llmModel);
  }, [chat.id, chat.llmProvider, chat.llmModel]);

  const providerMeta = useMemo(
    () => PROVIDERS.find((p) => p.value === provider) ?? PROVIDERS[0],
    [provider]
  );

  const hasChanges = provider !== chat.llmProvider || model !== chat.llmModel;

  const apply = async () => {
    await mutation.mutateAsync({provider, model});
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border bg-background p-4">
      <div className="text-sm font-semibold">Model</div>
      <div className="text-xs text-muted-foreground">
        Select an LLM provider + model for this chat. If the API key for the selected provider is missing, sending will fail with a helpful error.
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-muted-foreground">Provider</span>
          <select
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={provider}
            onChange={(e) => {
              const next = e.target.value as LLMProviderType;
              setProvider(next);
              const nextMeta = PROVIDERS.find((p) => p.value === next);
              if (nextMeta) setModel(nextMeta.defaultModel);
            }}
            disabled={mutation.isPending}
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 md:col-span-2">
          <span className="text-xs font-semibold text-muted-foreground">Model</span>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={mutation.isPending}
            placeholder={providerMeta.defaultModel}
          />
        </label>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <Button onClick={apply} disabled={mutation.isPending || !hasChanges || model.trim().length === 0}>
          Apply
        </Button>
        {mutation.isPending && <span className="text-xs text-muted-foreground">Applying…</span>}
        {mutation.isError && (
          <span className="text-xs text-destructive">Failed to update model. Please try again.</span>
        )}
      </div>
    </div>
  );
}

