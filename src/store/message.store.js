import { create } from "zustand";

export const useMessageStore = create((set, get) => ({
  messages: {
    byId: {},
    allIds: [],
  },
  conversations: {
    byId: {},
  },

  // Actions
  addMessage: (message, conversationId) => {
    set((state) => {
      const { id } = message;
      // Update messages.byId
      const newMessagesById = { ...state.messages.byId, [id]: message };
      const newMessagesAllIds = state.messages.byId[id]
        ? state.messages.allIds
        : [...state.messages.allIds, id];

      // Update conversation message list
      // If conversationId is not provided, we might not be able to link it unless message has it
      const targetConvId = conversationId || message.conversationId;

      let newConversationsById = state.conversations.byId;

      if (targetConvId) {
        const currentConv = state.conversations.byId[targetConvId] || {
          messages: [],
        };
        const newConvMessages = currentConv.messages.includes(id)
          ? currentConv.messages
          : [...currentConv.messages, id];

        newConversationsById = {
          ...state.conversations.byId,
          [targetConvId]: { ...currentConv, messages: newConvMessages },
        };
      }

      return {
        messages: {
          byId: newMessagesById,
          allIds: newMessagesAllIds,
        },
        conversations: {
          byId: newConversationsById,
        },
      };
    });
  },

  setMessages: (messagesList, conversationId) => {
    const byId = {};
    const allIds = [];
    const messageIds = [];

    if (Array.isArray(messagesList)) {
      messagesList.forEach((msg) => {
        byId[msg.id] = msg;
        allIds.push(msg.id);
        messageIds.push(msg.id);
      });
    }

    set((state) => ({
      messages: {
        byId: { ...state.messages.byId, ...byId },
        allIds: [...new Set([...state.messages.allIds, ...allIds])],
      },
      conversations: {
        byId: {
          ...state.conversations.byId,
          [conversationId]: { messages: messageIds },
        },
      },
    }));
  },

  setConversations: (conversationsList) => {
    if (!Array.isArray(conversationsList)) return;
    set((state) => {
      const existing = state.conversations.byId || {};
      const mapped = {};

      conversationsList.forEach((c) => {
        const id = c.id;
        const existingEntry = existing[id] || {};
        // preserve messages array if present on existing mapping
        mapped[id] = {
          ...existingEntry,
          ...c,
          messages: existingEntry.messages || [],
        };
      });

      return {
        conversations: {
          byId: {
            ...existing,
            ...mapped,
          },
        },
      };
    });
  },

  getMessage: (id) => get().messages.byId[id],

  getMessagesForConversation: (conversationId) => {
    const state = get();
    const conv = state.conversations.byId[conversationId];
    if (!conv) return [];
    return conv.messages.map((id) => state.messages.byId[id]).filter(Boolean);
  },

  getAllConversations: () => {
    const state = get();
    return Object.values(state.conversations.byId);
  },
}));
