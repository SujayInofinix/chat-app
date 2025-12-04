import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  addReaction,
} from "../api/whatsapp";
import { useMessageStore } from "../store/message.store";
import { useConversationStore } from "../store/conversation.store";
import { useEffect, useRef } from "react";

export const useConversationsQuery = () => {
  const { activeTab, filterKeyword } = useConversationStore();
  const setConversations = useMessageStore((state) => state.setConversations);
  const lastDataRef = useRef(null);

  const query = useQuery({
    queryKey: ["conversations", activeTab, filterKeyword],
    queryFn: () =>
      fetchConversations({ tab: activeTab, filter: filterKeyword }),
    staleTime: 30000,
  });

  useEffect(() => {
    // Only update if data actually changed
    if (query.data?.results && query.data !== lastDataRef.current) {
      console.log(
        "[useConversationsQuery] Updating store with",
        query.data.results.length,
        "conversations"
      );
      lastDataRef.current = query.data;
      setConversations(query.data.results);
    }
  }, [query.data]);

  return query;
};

export const useMessagesQuery = (conversationId) => {
  const setMessages = useMessageStore((state) => state.setMessages);
  const setActiveConversation = useConversationStore(
    (state) => state.setActiveConversation
  );
  const lastConversationIdRef = useRef(null);
  const lastDataRef = useRef(null);

  const query = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const data = await fetchMessages(conversationId);
      return data;
    },
    enabled: !!conversationId,
    staleTime: 60000,
  });

  useEffect(() => {
    // Only update if data or conversation changed
    if (
      query.data?.data?.messages &&
      (query.data !== lastDataRef.current ||
        conversationId !== lastConversationIdRef.current)
    ) {
      console.log(
        "[useMessagesQuery] Updating store with",
        query.data.data.messages.length,
        "messages"
      );
      lastDataRef.current = query.data;
      lastConversationIdRef.current = conversationId;
      setMessages(query.data.data.messages, conversationId);

      if (query.data.data.contact) {
        setActiveConversation(query.data.data.contact);
      }
    }
  }, [query.data, conversationId]);

  return query;
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  const addMessage = useMessageStore((state) => state.addMessage);
  const activeConversationId = useConversationStore(
    (state) => state.activeConversationId
  );

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (newMessage) => {
      addMessage(newMessage, activeConversationId);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useAddReactionMutation = () => {
  const updateMessage = useMessageStore((state) => state.updateMessage);

  return useMutation({
    mutationFn: addReaction,
    onSuccess: (updatedMessage) => {
      if (updatedMessage) {
        console.log(
          "[useAddReactionMutation] Updating message with reaction:",
          updatedMessage.id
        );
        updateMessage(updatedMessage);
      }
    },
  });
};
