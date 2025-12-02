import { create } from "zustand";
import { api } from "../mock/api";

export const useChatStore = create((set, get) => ({
  conversations: [],
  messages: [],
  activeConversationId: null,
  activeConversation: null,
  activeTab: "active",
  isDrawerOpen: true,
  isLoadingConversations: false,
  isLoadingMessages: false,
  filterKeyword: "",
  replyingTo: null, // Track message being replied to

  // Actions
  setTab: (tab) => {
    set({ activeTab: tab });
    get().fetchConversations();
  },

  setFilterKeyword: (keyword) => {
    set({ filterKeyword: keyword });
    get().fetchConversations();
  },

  fetchConversations: async () => {
    set({ isLoadingConversations: true });
    try {
      const { activeTab, filterKeyword } = get();
      const conversations = await api.getConversations(
        activeTab,
        filterKeyword
      );
      set({ conversations });
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  selectConversation: async (id) => {
    if (id) {
      // Find the conversation in the current list to store its full data
      const conversation = get().conversations.find((c) => c.uuid === id);
      // Check screen width to determine if drawer should be open by default
      // Tablet/Mobile breakpoint (md) is usually around 900px
      const isLargeScreen =
        typeof window !== "undefined" && window.innerWidth >= 900;

      set({
        activeConversationId: id,
        activeConversation: conversation || null,
        isDrawerOpen: isLargeScreen,
      });
      await get().fetchMessages(id);
    } else {
      set({
        activeConversationId: null,
        activeConversation: null,
        messages: [],
      });
    }
  },

  fetchMessages: async (id) => {
    set({ isLoadingMessages: true });
    try {
      const response = await api.getMessages(id);
      set({
        messages: response.data.messages,
        activeConversation: response.data.contact,
      });
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  sendMessage: async (content) => {
    const { activeConversationId, replyingTo } = get();
    if (!activeConversationId) return;

    // Optimistic update could go here, but for now we wait for API
    try {
      const newMessage = await api.sendMessage(
        activeConversationId,
        content,
        replyingTo
      );
      set((state) => ({
        messages: [...state.messages, newMessage],
        conversations: state.conversations.map((c) =>
          c.uuid === activeConversationId
            ? {
                ...c,
                last_message_text: content,
                last_message_timestamp: newMessage.created,
              }
            : c
        ),
        replyingTo: null, // Clear reply context after sending
      }));
    } catch (error) {
      console.error("Failed to send message", error);
    }
  },

  setReplyingTo: (message) => set({ replyingTo: message }),

  clearReplyingTo: () => set({ replyingTo: null }),

  addReaction: async (messageId, emoji) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    try {
      const updatedMessage = await api.addReaction(
        activeConversationId,
        messageId,
        emoji
      );
      if (updatedMessage) {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.uuid === messageId ? updatedMessage : m
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to add reaction", error);
    }
  },

  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
}));
