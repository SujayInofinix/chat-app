import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useMessageStore = create(
  devtools(
    (set, get) => ({
      messages: {
        byId: {},
        allIds: [],
      },
      conversations: {
        byId: {},
      },

      // Actions
      addMessage: (message, conversationId) => {
        console.log("[MessageStore] addMessage called:", {
          messageId: message.id,
          conversationId,
        });

        set((state) => {
          const { id } = message;
          // Update messages.byId
          const newMessagesById = { ...state.messages.byId, [id]: message };
          const newMessagesAllIds = state.messages.byId[id]
            ? state.messages.allIds
            : [...state.messages.allIds, id];

          // Update conversation message list
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

            console.log(
              "[MessageStore] addMessage - Updated conversation:",
              targetConvId,
              "messages:",
              newConvMessages.length
            );
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
        console.log("[MessageStore] setMessages called:", {
          messagesCount: messagesList?.length,
          conversationId,
        });

        if (!Array.isArray(messagesList)) {
          console.warn(
            "[MessageStore] setMessages - messagesList is not an array"
          );
          return;
        }

        if (!conversationId) {
          console.error(
            "[MessageStore] setMessages - conversationId is required!"
          );
          return;
        }

        const byId = {};
        const allIds = [];
        const messageIds = [];

        messagesList.forEach((msg) => {
          byId[msg.id] = msg;
          allIds.push(msg.id);
          messageIds.push(msg.id);
        });

        set((state) => {
          const result = {
            messages: {
              byId: { ...state.messages.byId, ...byId },
              allIds: [...new Set([...state.messages.allIds, ...allIds])],
            },
            conversations: {
              byId: {
                ...state.conversations.byId,
                [conversationId]: {
                  ...state.conversations.byId[conversationId],
                  messages: messageIds,
                },
              },
            },
          };

          console.log("[MessageStore] setMessages - Result:", {
            totalMessages: Object.keys(result.messages.byId).length,
            conversationMessages:
              result.conversations.byId[conversationId]?.messages.length,
            conversationId,
          });

          return result;
        });
      },

      setConversations: (conversationsList) => {
        console.log(
          "[MessageStore] setConversations called with",
          conversationsList?.length,
          "conversations"
        );

        if (!Array.isArray(conversationsList)) {
          console.warn(
            "[MessageStore] setConversations - conversationsList is not an array"
          );
          return;
        }

        set((state) => {
          const existing = state.conversations.byId || {};
          const mapped = {};

          conversationsList.forEach((c) => {
            const id = c.id;
            const existingEntry = existing[id] || {};
            // Preserve messages array if present on existing mapping
            // Don't copy messages from the API response, only preserve what's in store
            mapped[id] = {
              ...existingEntry,
              ...c,
              messages: existingEntry.messages || [],
            };
          });

          const result = {
            conversations: {
              byId: {
                ...existing,
                ...mapped,
              },
            },
          };

          console.log("[MessageStore] setConversations - Result:", {
            totalConversations: Object.keys(result.conversations.byId).length,
            conversationIds: Object.keys(result.conversations.byId),
          });

          return result;
        });
      },

      getMessage: (id) => get().messages.byId[id],

      getMessagesForConversation: (conversationId) => {
        const state = get();
        const conv = state.conversations.byId[conversationId];

        console.log("[MessageStore] getMessagesForConversation:", {
          conversationId,
          conversationExists: !!conv,
          messageIds: conv?.messages || [],
          messagesCount: conv?.messages?.length || 0,
        });

        if (!conv) {
          console.warn(
            "[MessageStore] getMessagesForConversation - Conversation not found:",
            conversationId
          );
          return [];
        }

        if (!conv.messages || conv.messages.length === 0) {
          console.warn(
            "[MessageStore] getMessagesForConversation - No messages in conversation:",
            conversationId
          );
          return [];
        }

        const messages = conv.messages
          .map((id) => state.messages.byId[id])
          .filter(Boolean);

        console.log(
          "[MessageStore] getMessagesForConversation - Returning",
          messages.length,
          "messages"
        );

        return messages;
      },

      getAllConversations: () => {
        const state = get();
        const conversations = Object.values(state.conversations.byId);
        console.log(
          "[MessageStore] getAllConversations - Returning",
          conversations.length,
          "conversations"
        );
        return conversations;
      },
    }),
    {
      name: "MessageStore",
    }
  )
);
