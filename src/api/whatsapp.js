import { api as mockApi } from "../mock/api";

export const fetchConversations = async ({ tab, filter }) => {
  // Simulate network delay if needed, but mockApi has it.
  return mockApi.getConversations(tab, filter);
};

export const fetchMessages = async (conversationId) => {
  return mockApi.getMessages(conversationId);
};

export const sendMessage = async (payload) => {
  return mockApi.sendMessage(payload);
};

export const addReaction = async ({ conversationId, messageId, emoji }) => {
  return mockApi.addReaction(conversationId, messageId, emoji);
};
