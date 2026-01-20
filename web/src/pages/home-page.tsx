import {ChatSidebar} from "../components/chat-sidebar";
import {useEffect, useMemo, useState} from "react";
import {ChatInputBox} from "../components/chat-input-box";
import {AssistantLoadingIndicator, MessageContainer} from "../components/message";
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

    const chatsQuery = useChatsQuery();
    const createChatMutation = useCreateChatMutation();

    // Restore selected chat on first load.
    useEffect(() => {
        setChatId(loadSelectedChatId());
    }, []);

    // Persist selected chat id whenever it changes.
    useEffect(() => {
        saveSelectedChatId(chatId);
    }, [chatId]);

    // Best-effort cache for faster reloads; backend remains source of truth.
    useEffect(() => {
        if (chatsQuery.data) {
            saveCachedChats(chatsQuery.data);
        }
    }, [chatsQuery.data]);

    const chats = useMemo(() => {
        return (chatsQuery.data ?? []).map((c) => ({id: c.id, name: c.name}));
    }, [chatsQuery.data]);

    const onCreateChat = async () => {
        const created = await createChatMutation.mutateAsync({});
        setChatId(created.id);
    };

    return <div className={"flex flex-col items-center"}>
        <ChatSidebar
            chats={chats}
            selectedChatId={chatId}
            onSelectChat={setChatId}
            onCreateChat={onCreateChat}
        />
        <div className={"flex flex-col pt-8 max-w-4xl ms-64 w-full"}>
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

        {(chatQuery.isLoading || chatQuery.isFetching) && messages.length === 0 && (
            <p className={"text-muted-foreground"}>Loading chat…</p>
        )}

        {chatQuery.isError && (
            <p className={"text-destructive"}>
                Failed to load chat.
            </p>
        )}

        {messages.map((message, index) => (
            <MessageContainer role={message.role} key={index}>
                {message.content}
            </MessageContainer>
        ))}

        {sendMessageMutation.isPending && <AssistantLoadingIndicator />}

        {sendMessageMutation.isError && (
            <p className={"text-destructive"}>
                Failed to send message.
            </p>
        )}

        <ChatInputBox onSend={onSend} />
    </div>
}