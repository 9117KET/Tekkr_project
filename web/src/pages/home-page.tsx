import {ChatSidebar} from "../components/chat-sidebar";
import {useEffect, useMemo, useState} from "react";
import {ChatInputBox} from "../components/chat-input-box";
import {AssistantLoadingIndicator, MessageBody, MessageContainer} from "../components/message";
import {Button} from "../components/ui/button";
import {ModelSelector} from "../components/model-selector";
import {
    ChatMessage,
    useChatQuery,
    useChatsQuery,
    useCreateChatMutation,
    useSendMessageMutation
} from "../data/queries/chat";
import {loadSelectedChatId, saveCachedChats, saveSelectedChatId} from "../lib/persistence";

export function HomePage () {
    const [chatId, setChatId] = useState<string | null>(null);
    const [hasRestoredSelection, setHasRestoredSelection] = useState(false);

    const chatsQuery = useChatsQuery();
    const createChatMutation = useCreateChatMutation();

    // Restore selected chat on first load.
    useEffect(() => {
        const restored = loadSelectedChatId();
        setChatId(restored);
        setHasRestoredSelection(true);
    }, []);

    // Persist selected chat id whenever it changes.
    useEffect(() => {
        if (!hasRestoredSelection) return;
        saveSelectedChatId(chatId);
    }, [chatId, hasRestoredSelection]);

    // Best-effort cache for faster reloads; backend remains source of truth.
    useEffect(() => {
        if (chatsQuery.data) {
            saveCachedChats(chatsQuery.data);
        }
    }, [chatsQuery.data]);

    const chats = useMemo(() => {
        return (chatsQuery.data ?? []).map((c) => ({id: c.id, name: c.name}));
    }, [chatsQuery.data]);

    // If the backend restarted (in-memory store), a previously selected chatId may no longer exist.
    // Fail gracefully by clearing the selection (and persisted selection) instead of showing a permanent error.
    useEffect(() => {
        if (!hasRestoredSelection) return;
        if (!chatId) return;
        if (!chatsQuery.data) return;

        const exists = chatsQuery.data.some((c) => c.id === chatId);
        if (!exists) {
            // #region agent log
            fetch('http://127.0.0.1:7247/ingest/79235865-8dbf-4e02-b919-c180d9bfdcc1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3',location:'web/src/pages/home-page.tsx:HomePage:missingChat',message:'Selected chat missing from server list; clearing selection',data:{chatId,serverChatCount:chatsQuery.data.length},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            setChatId(null);
        }
    }, [chatId, chatsQuery.data, hasRestoredSelection]);

    const onCreateChat = async () => {
        const created = await createChatMutation.mutateAsync({});
        setChatId(created.id);
    };

    return <div className={"flex flex-col items-center"}>
        <ChatSidebar
            chats={chats}
            selectedChatId={chatId}
            onSelectChat={setChatId}
            onCreateChat={createChatMutation.isPending ? undefined : onCreateChat}
        />
        <div className={"flex flex-col pt-8 max-w-4xl ms-64 w-full"}>
            {(chatsQuery.isLoading || chatsQuery.isFetching) && chats.length === 0 && (
                <p className={"text-muted-foreground"}>Loading chats…</p>
            )}

            {chatsQuery.isError && (
                <div className={"flex w-full flex-col gap-2 rounded-lg border bg-background p-4"}>
                    <div className={"text-sm font-semibold text-destructive"}>Failed to load chats</div>
                    <div className={"text-sm text-muted-foreground"}>
                        Please check that the backend is running on <span className={"font-mono"}>http://localhost:8000</span>.
                    </div>
                    <div className={"flex gap-2"}>
                        <Button variant={"secondary"} onClick={() => chatsQuery.refetch()}>
                            Retry
                        </Button>
                    </div>
                </div>
            )}
            <ChatWindow chatId={chatId} />
        </div>
    </div>
}

function ChatWindow ({ chatId }: { chatId: string | null }) {
    const chatQuery = useChatQuery(chatId);
    const sendMessageMutation = useSendMessageMutation(chatId);

    const title = chatQuery.data?.name ?? "Chat";
    const messages: ChatMessage[] = chatQuery.data?.messages ?? [];

    const onSend = async (content: string) => {
        if (!chatId) return;
        await sendMessageMutation.mutateAsync({content});
    };

    if (!chatId) {
        return (
            <div className={"flex flex-col gap-4"}>
                <h2>Welcome</h2>
                <p className={"text-muted-foreground"}>Create a chat to start.</p>
            </div>
        );
    }

    return <div className={"flex flex-col gap-4"}>
        <h2>{title}</h2>

        {chatQuery.data && <ModelSelector chat={chatQuery.data} />}

        {(chatQuery.isLoading || chatQuery.isFetching) && messages.length === 0 && (
            <p className={"text-muted-foreground"}>Loading chat…</p>
        )}

        {chatQuery.isError && (
            <div className={"flex w-full flex-col gap-2 rounded-lg border bg-background p-4"}>
                <div className={"text-sm font-semibold text-destructive"}>Failed to load chat</div>
                <div className={"text-sm text-muted-foreground"}>
                    The selected chat could not be loaded. Try again.
                </div>
                <div className={"flex gap-2"}>
                    <Button variant={"secondary"} onClick={() => chatQuery.refetch()}>
                        Retry
                    </Button>
                </div>
            </div>
        )}

        {messages.map((message, index) => (
            <MessageContainer role={message.role} key={message.id ?? index}>
                <MessageBody message={message} />
            </MessageContainer>
        ))}

        {sendMessageMutation.isPending && <AssistantLoadingIndicator />}

        {sendMessageMutation.isError && (
            <div className={"rounded-lg border bg-background px-4 py-2 text-sm text-destructive"}>
                {(sendMessageMutation.error instanceof Error
                    ? sendMessageMutation.error.message
                    : "Failed to send message. Please try again.")}
            </div>
        )}

        <ChatInputBox onSend={onSend} />
    </div>
}