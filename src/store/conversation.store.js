import { create } from "zustand";

export const useConversationStore = create((set) => ({
  activeConversationId: null,
  activeConversation: null, // Full Conversation object
  activeTab: "active", // 'active', 'closed', etc.
  filterKeyword: "",
  isDrawerOpen: true,

  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),
  setTab: (tab) => set({ activeTab: tab }),
  setFilterKeyword: (keyword) => set({ filterKeyword: keyword }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
}));
