import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchConversations, fetchMessages, sendMessage, addReaction } from '../api/whatsapp';
import { useMessageStore } from '../store/message.store';
import { useConversationStore } from '../store/conversation.store';
import { useEffect } from 'react';

export const useConversationsQuery = () => {
    const { activeTab, filterKeyword } = useConversationStore();
    return useQuery({
        queryKey: ['conversations', activeTab, filterKeyword],
        queryFn: () => fetchConversations({ tab: activeTab, filter: filterKeyword }),
        staleTime: 30000,
    });
};

export const useMessagesQuery = (conversationId) => {
    const setMessages = useMessageStore((state) => state.setMessages);
    const setActiveConversation = useConversationStore((state) => state.setActiveConversation);

    const query = useQuery({
        queryKey: ['messages', conversationId],
        queryFn: async () => {
            const data = await fetchMessages(conversationId);
            return data;
        },
        enabled: !!conversationId,
        staleTime: 60000, // Long stale time, rely on WS for updates
    });

    // Sync with Zustand
    useEffect(() => {
        if (query.data?.data?.messages) {
            setMessages(query.data.data.messages, conversationId);
        }
        if (query.data?.data?.contact) {
            setActiveConversation(query.data.data.contact);
        }
    }, [query.data, setMessages, setActiveConversation, conversationId]);

    return query;
};

export const useSendMessageMutation = () => {
    const queryClient = useQueryClient();
    const addMessage = useMessageStore((state) => state.addMessage);
    const activeConversationId = useConversationStore((state) => state.activeConversationId);

    return useMutation({
        mutationFn: sendMessage,
        onSuccess: (newMessage, variables) => {
            // Optimistic update or just add to store
            addMessage(newMessage, activeConversationId);
            // Invalidate conversations to update last message
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
};

export const useAddReactionMutation = () => {
    const addMessage = useMessageStore((state) => state.addMessage);
    const activeConversationId = useConversationStore((state) => state.activeConversationId);

    return useMutation({
        mutationFn: addReaction,
        onSuccess: (updatedMessage) => {
            if (updatedMessage) {
                addMessage(updatedMessage, activeConversationId);
            }
        },
    });
};
