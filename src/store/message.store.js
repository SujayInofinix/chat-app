import { create } from 'zustand';

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
            const { uuid } = message;
            // Update messages.byId
            const newMessagesById = { ...state.messages.byId, [uuid]: message };
            const newMessagesAllIds = state.messages.byId[uuid]
                ? state.messages.allIds
                : [...state.messages.allIds, uuid];

            // Update conversation message list
            // If conversationId is not provided, we might not be able to link it unless message has it
            // Assuming message might have conversation_uuid or we pass it
            const targetConvId = conversationId || message.conversation_uuid;

            let newConversationsById = state.conversations.byId;

            if (targetConvId) {
                const currentConv = state.conversations.byId[targetConvId] || { messages: [] };
                const newConvMessages = currentConv.messages.includes(uuid)
                    ? currentConv.messages
                    : [...currentConv.messages, uuid];

                newConversationsById = {
                    ...state.conversations.byId,
                    [targetConvId]: { ...currentConv, messages: newConvMessages }
                };
            }

            return {
                messages: {
                    byId: newMessagesById,
                    allIds: newMessagesAllIds,
                },
                conversations: {
                    byId: newConversationsById
                }
            };
        });
    },

    setMessages: (messagesList, conversationId) => {
        const byId = {};
        const allIds = [];
        const messageIds = [];

        if (Array.isArray(messagesList)) {
            messagesList.forEach((msg) => {
                byId[msg.uuid] = msg;
                allIds.push(msg.uuid);
                messageIds.push(msg.uuid);
            });
        }

        set((state) => ({
            messages: {
                byId: { ...state.messages.byId, ...byId },
                allIds: [...new Set([...state.messages.allIds, ...allIds])]
            },
            conversations: {
                byId: {
                    ...state.conversations.byId,
                    [conversationId]: { messages: messageIds }
                }
            }
        }));
    },

    setConversations: (conversationsList) => {
        if (!Array.isArray(conversationsList)) return;
        set((state, getState) => {
            const existing = getState().conversations.byId || {};
            const mapped = {};

            conversationsList.forEach((c) => {
                const id = c.uuid;
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
        return conv.messages.map(id => state.messages.byId[id]).filter(Boolean);
    }
}));
