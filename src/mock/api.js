// import { subMinutes, subHours, subDays } from "date-fns"; // Unused

const MOCK_DELAY = 800;

// Simulated current user ID
const CURRENT_USER_ID = "currentUser";

const mockConversationsResponse = {
  // Pagination fields removed as per requirement
  results: [
    {
      id: "e5d7d687-eefd-4d10-bd21-100afac21aeb",
      whatsapp_number: "+9921536127",
      profile_picture: "https://i.pravatar.cc/150?u=1",
      contact_name: "Shreyas",
      assigned_agent: {
        id: "agent-12",
        type: "agent",
        display_name: "Support Agent",
      },
      last_message_id: "shreyas-bulk-msg-99",
      unread_count: 1,
      created_at: "2025-11-20T10:00:00.000Z",
      updated_at: "2025-12-01T14:39:00.000Z",
      last_message_timestamp: "2025-12-01T14:39:00.000Z",
      metadata: {
        type: "SUPPORT",
        status: "ACTIVE",
        last_message_preview:
          "Message 100: This is a test message for virtualization.",
      },
      outgoing: false,
    },
    {
      id: "013c952d-b70e-4d7e-b9e7-4e2dd4b2fe51",
      whatsapp_number: "+8235174356",
      profile_picture: "https://i.pravatar.cc/150?u=2",
      contact_name: "Ningappa",
      assigned_agent: {
        id: "agent-12",
        type: "agent",
        display_name: "Support Agent",
      },
      last_message_id: "ningappa-msg-6",
      unread_count: 0,
      created_at: "2025-11-21T09:00:00.000Z",
      updated_at: "2025-12-01T10:25:00.000Z",
      last_message_timestamp: "2025-12-01T10:25:00.000Z",
      metadata: {
        type: "MARKETING",
        status: "ACTIVE",
        last_message_preview: "📄 replacement_order.pdf",
      },
      outgoing: true,
    },
    {
      id: "80c256ce-490f-4171-9cab-1b53f3d852cc",
      whatsapp_number: "+9876543210",
      profile_picture: "https://i.pravatar.cc/150?u=3",
      contact_name: "Sujay",
      assigned_agent: {
        id: "agent-12",
        type: "agent",
        display_name: "Support Agent",
      },
      last_message_id: "sujay-msg-5",
      unread_count: 0,
      created_at: "2025-11-22T08:00:00.000Z",
      updated_at: "2025-12-01T11:20:00.000Z",
      last_message_timestamp: "2025-12-01T11:20:00.000Z",
      metadata: {
        type: "SUPPORT",
        status: "ACTIVE",
        last_message_preview:
          "Thanks for the voice note! I'll review your feedback and get back to you.",
      },
      outgoing: true,
    },
    {
      id: "2d0bce68-cadd-4b47-8e2b-8bbfc6846d64",
      whatsapp_number: "+1234567894",
      profile_picture: "https://i.pravatar.cc/150?u=4",
      contact_name: "Sourabh",
      assigned_agent: {
        id: "agent-12",
        type: "agent",
        display_name: "Support Agent",
      },
      last_message_id: "sourabh-msg-6",
      unread_count: 0,
      created_at: "2025-11-23T07:00:00.000Z",
      updated_at: "2025-12-01T08:25:00.000Z",
      last_message_timestamp: "2025-12-01T08:25:00.000Z",
      metadata: {
        type: "MARKETING",
        status: "ACTIVE",
        last_message_preview:
          "How about tomorrow at 2 PM? I'll send a calendar invite.",
      },
      outgoing: true,
    },
  ],
};

// Generate 100 messages for Shreyas conversation
const generateShreyasMessages = () => {
  const messages = [];
  const baseTime = new Date("2025-12-01T09:00:00.000Z").getTime();

  for (let i = 0; i < 100; i++) {
    const isOutbound = i % 3 === 0;
    const msgTime = new Date(baseTime + i * 60000);
    messages.push({
      id: `shreyas-bulk-msg-${i}`,
      conversationId: "e5d7d687-eefd-4d10-bd21-100afac21aeb",
      direction: isOutbound ? "outbound" : "inbound",
      from: {
        id: isOutbound ? "agent-12" : "wa:+9921536127",
        display_name: isOutbound ? "Support Agent" : "Shreyas",
        userName: isOutbound ? "agent_12" : "shreyas",
        email: isOutbound ? "agent@example.com" : "",
        type: isOutbound ? "agent" : "customer",
      },
      type: "text",
      content: {
        text: `Message ${
          i + 1
        }: This is a test message for virtualization. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      },
      status: "read",
      createdAt: msgTime.toISOString(),
      updatedAt: msgTime.toISOString(),
    });
  }

  return messages;
};

// Helper to simulate message storage for different conversations
// Each conversation gets a unique set of messages
let mockMessagesStore = {
  // Shreyas: 100 messages for virtualization testing
  "e5d7d687-eefd-4d10-bd21-100afac21aeb": generateShreyasMessages(),

  // Ningappa: Text, videos, documents
  "013c952d-b70e-4d7e-b9e7-4e2dd4b2fe51": [
    {
      id: "ningappa-msg-1",
      conversationId: "013c952d-b70e-4d7e-b9e7-4e2dd4b2fe51",
      direction: "inbound",
      from: {
        id: "wa:+8235174356",
        display_name: "Ningappa",
        userName: "ningappa",
        email: "",
        type: "customer",
      },
      type: "text",
      content: {
        text: "Hi! I need help with the product I ordered last week.",
      },
      status: "read",
      createdAt: "2025-12-01T10:00:00.000Z",
      updatedAt: "2025-12-01T10:00:00.000Z",
    },
    {
      id: "ningappa-msg-2",
      conversationId: "013c952d-b70e-4d7e-b9e7-4e2dd4b2fe51",
      direction: "outbound",
      from: {
        id: "agent-12",
        display_name: "Support Agent",
        userName: "agent_12",
        email: "agent@example.com",
        type: "agent",
      },
      type: "text",
      content: {
        text: "Of course! I'd be happy to help. Could you please provide me with your order number?",
      },
      status: "read",
      createdAt: "2025-12-01T10:05:00.000Z",
      updatedAt: "2025-12-01T10:05:00.000Z",
    },
    {
      id: "ningappa-msg-3",
      conversationId: "013c952d-b70e-4d7e-b9e7-4e2dd4b2fe51",
      direction: "inbound",
      from: {
        id: "wa:+8235174356",
        display_name: "Ningappa",
        userName: "ningappa",
        email: "",
        type: "customer",
      },
      type: "text",
      content: {
        text: "It's ORD-2024-5678. The package arrived damaged.",
      },
      status: "read",
      createdAt: "2025-12-01T10:10:00.000Z",
      updatedAt: "2025-12-01T10:10:00.000Z",
    },
    {
      id: "ningappa-msg-4",
      conversationId: "013c952d-b70e-4d7e-b9e7-4e2dd4b2fe51",
      direction: "inbound",
      from: {
        id: "wa:+8235174356",
        display_name: "Ningappa",
        userName: "ningappa",
        email: "",
        type: "customer",
      },
      type: "media",
      content: {
        mediaType: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        caption: "Here's a video showing the damage",
      },
      status: "read",
      createdAt: "2025-12-01T10:15:00.000Z",
      updatedAt: "2025-12-01T10:15:00.000Z",
    },
    {
      id: "ningappa-msg-5",
      conversationId: "013c952d-b70e-4d7e-b9e7-4e2dd4b2fe51",
      direction: "outbound",
      from: {
        id: "agent-12",
        display_name: "Support Agent",
        userName: "agent_12",
        email: "agent@example.com",
        type: "agent",
      },
      type: "text",
      content: {
        text: "I'm sorry to see that! Let me process a replacement for you right away. You should receive it within 2-3 business days.",
      },
      status: "read",
      createdAt: "2025-12-01T10:20:00.000Z",
      updatedAt: "2025-12-01T10:20:00.000Z",
    },
    {
      id: "ningappa-msg-6",
      conversationId: "013c952d-b70e-4d7e-b9e7-4e2dd4b2fe51",
      direction: "outbound",
      from: {
        id: "agent-12",
        display_name: "Support Agent",
        userName: "agent_12",
        email: "agent@example.com",
        type: "agent",
      },
      type: "media",
      content: {
        mediaType: "document",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "replacement_order.pdf",
        size: 342016, // bytes
      },
      status: "sent",
      createdAt: "2025-12-01T10:25:00.000Z",
      updatedAt: "2025-12-01T10:25:00.000Z",
    },
  ],

  // Sujay: Text, audio, images
  "80c256ce-490f-4171-9cab-1b53f3d852cc": [
    {
      id: "sujay-msg-1",
      conversationId: "80c256ce-490f-4171-9cab-1b53f3d852cc",
      direction: "inbound",
      from: {
        id: "wa:+9876543210",
        display_name: "Sujay",
        userName: "sujay",
        email: "",
        type: "customer",
      },
      type: "text",
      content: {
        text: "Hey! Do you have the specifications for the new model?",
      },
      status: "read",
      createdAt: "2025-12-01T11:00:00.000Z",
      updatedAt: "2025-12-01T11:00:00.000Z",
    },
    {
      id: "sujay-msg-2",
      conversationId: "80c256ce-490f-4171-9cab-1b53f3d852cc",
      direction: "outbound",
      from: {
        id: "agent-12",
        display_name: "Support Agent",
        userName: "agent_12",
        email: "agent@example.com",
        type: "agent",
      },
      type: "text",
      content: {
        text: "Yes, I'll send them over right now.",
      },
      status: "read",
      createdAt: "2025-12-01T11:05:00.000Z",
      updatedAt: "2025-12-01T11:05:00.000Z",
    },
    {
      id: "sujay-msg-3",
      conversationId: "80c256ce-490f-4171-9cab-1b53f3d852cc",
      direction: "outbound",
      from: {
        id: "agent-12",
        display_name: "Support Agent",
        userName: "agent_12",
        email: "agent@example.com",
        type: "agent",
      },
      type: "media",
      content: {
        mediaType: "document",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "specs.pdf",
        size: 1048576,
      },
      status: "read",
      createdAt: "2025-12-01T11:06:00.000Z",
      updatedAt: "2025-12-01T11:06:00.000Z",
    },
    {
      id: "sujay-msg-4",
      conversationId: "80c256ce-490f-4171-9cab-1b53f3d852cc",
      direction: "inbound",
      from: {
        id: "wa:+9876543210",
        display_name: "Sujay",
        userName: "sujay",
        email: "",
        type: "customer",
      },
      type: "media",
      content: {
        mediaType: "audio",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      status: "read",
      createdAt: "2025-12-01T11:15:00.000Z",
      updatedAt: "2025-12-01T11:15:00.000Z",
      metadata: {
        replyTo: {
          id: "sujay-msg-3",
          text: "specs.pdf",
        },
      },
    },
    {
      id: "sujay-msg-5",
      conversationId: "80c256ce-490f-4171-9cab-1b53f3d852cc",
      direction: "outbound",
      from: {
        id: "agent-12",
        display_name: "Support Agent",
        userName: "agent_12",
        email: "agent@example.com",
        type: "agent",
      },
      type: "text",
      content: {
        text: "Thanks for the voice note! I'll review your feedback and get back to you.",
      },
      status: "delivered",
      createdAt: "2025-12-01T11:20:00.000Z",
      updatedAt: "2025-12-01T11:20:00.000Z",
    },
  ],

  // Sourabh: Mixed types with replies
  "2d0bce68-cadd-4b47-8e2b-8bbfc6846d64": [
    {
      id: "sourabh-msg-1",
      conversationId: "2d0bce68-cadd-4b47-8e2b-8bbfc6846d64",
      direction: "inbound",
      from: {
        id: "wa:+1234567894",
        display_name: "Sourabh",
        userName: "sourabh",
        email: "",
        type: "customer",
      },
      type: "text",
      content: {
        text: "Good morning! I wanted to discuss the project timeline.",
      },
      status: "read",
      createdAt: "2025-12-01T08:00:00.000Z",
      updatedAt: "2025-12-01T08:00:00.000Z",
    },
    {
      id: "sourabh-msg-2",
      conversationId: "2d0bce68-cadd-4b47-8e2b-8bbfc6846d64",
      direction: "outbound",
      from: {
        id: "agent-12",
        display_name: "Support Agent",
        userName: "agent_12",
        email: "agent@example.com",
        type: "agent",
      },
      type: "text",
      content: {
        text: "Good morning! Sure, let's go over it. What specific aspects would you like to discuss?",
      },
      status: "read",
      createdAt: "2025-12-01T08:05:00.000Z",
      updatedAt: "2025-12-01T08:05:00.000Z",
    },
    {
      id: "sourabh-msg-3",
      conversationId: "2d0bce68-cadd-4b47-8e2b-8bbfc6846d64",
      direction: "inbound",
      from: {
        id: "wa:+1234567894",
        display_name: "Sourabh",
        userName: "sourabh",
        email: "",
        type: "customer",
      },
      type: "text",
      content: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      },
      status: "read",
      createdAt: "2025-12-01T08:10:00.000Z",
      updatedAt: "2025-12-01T08:10:00.000Z",
      metadata: {
        replyTo: {
          id: "sourabh-msg-2",
          text: "Good morning! Sure, let's go over it. What specific aspects would you like to discuss?",
        },
      },
    },
    {
      id: "sourabh-msg-4",
      conversationId: "2d0bce68-cadd-4b47-8e2b-8bbfc6846d64",
      direction: "outbound",
      from: {
        id: "agent-12",
        display_name: "Support Agent",
        userName: "agent_12",
        email: "agent@example.com",
        type: "agent",
      },
      type: "media",
      content: {
        mediaType: "image",
        url: "https://picsum.photos/500/400?random=2",
        caption: "Here's the updated timeline chart",
      },
      status: "read",
      createdAt: "2025-12-01T08:15:00.000Z",
      updatedAt: "2025-12-01T08:15:00.000Z",
    },
    {
      id: "sourabh-msg-5",
      conversationId: "2d0bce68-cadd-4b47-8e2b-8bbfc6846d64",
      direction: "inbound",
      from: {
        id: "wa:+1234567894",
        display_name: "Sourabh",
        userName: "sourabh",
        email: "",
        type: "customer",
      },
      type: "text",
      content: {
        text: "Perfect! This works great. When can we schedule a call to finalize the details?",
      },
      status: "read",
      createdAt: "2025-12-01T08:20:00.000Z",
      updatedAt: "2025-12-01T08:20:00.000Z",
      metadata: {
        replyTo: {
          id: "sourabh-msg-4",
          text: "Here's the updated timeline chart",
        },
      },
    },
    {
      id: "sourabh-msg-6",
      conversationId: "2d0bce68-cadd-4b47-8e2b-8bbfc6846d64",
      direction: "outbound",
      from: {
        id: "agent-12",
        display_name: "Support Agent",
        userName: "agent_12",
        email: "agent@example.com",
        type: "agent",
      },
      type: "text",
      content: {
        text: "How about tomorrow at 2 PM? I'll send a calendar invite.",
      },
      status: "sent",
      createdAt: "2025-12-01T08:25:00.000Z",
      updatedAt: "2025-12-01T08:25:00.000Z",
    },
  ],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  getConversations: async (tab, keyword) => {
    await delay(MOCK_DELAY);
    let filtered = [...mockConversationsResponse.results];

    // Filter by tab (Mock logic)
    if (tab === "open") {
      // filtered = filtered.filter((c) => !c.assigned_agent);
    } else if (tab === "assigned") {
      // filtered = filtered.filter((c) => c.assigned_agent);
    }

    // Filter by keyword
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.contact_name.toLowerCase().includes(lowerKeyword) ||
          c.whatsapp_number.includes(lowerKeyword)
      );
    }

    return {
      results: filtered,
    };
  },

  getMessages: async (conversationId) => {
    await delay(MOCK_DELAY);
    const conversation = mockConversationsResponse.results.find(
      (c) => c.id === conversationId
    );
    const messages = mockMessagesStore[conversationId] || [];

    return {
      data: {
        contact: conversation || null,
        messages: messages,
      },
    };
  },

  sendMessage: async (payload) => {
    await delay(MOCK_DELAY);

    console.log("[MockAPI] sendMessage received payload:", payload);

    const { conversationId, type, content } = payload;

    if (!conversationId || !type || !content) {
      throw new Error(
        "Invalid payload: conversationId, type, and content are required"
      );
    }

    // Build base message object
    const newMessage = {
      id: `m${Date.now()}`,
      conversationId,
      direction: "outbound",
      from: {
        id: "agent-12",
        display_name: "Support Agent",
        userName: "agent_12",
        email: "agent@example.com",
        type: "agent",
      },
      type,
      content,
      status: "sent",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {},
    };

    // Handle reply type specifically (store replyTo in metadata for UI compatibility)
    if (type === "reply" && content.replyTo) {
      newMessage.metadata.replyTo = {
        id: content.replyTo,
        preview_text: content.text || "",
        sender_name: "Previous Message",
        message_type: content.messageType || "text",
        direction: "inbound",
      };
    }

    // Store message
    if (!mockMessagesStore[conversationId]) {
      mockMessagesStore[conversationId] = [];
    }
    mockMessagesStore[conversationId].push(newMessage);

    // Update last message in conversation
    const conversation = mockConversationsResponse.results.find(
      (c) => c.id === conversationId
    );

    if (conversation) {
      conversation.last_message_id = newMessage.id;
      conversation.last_message_timestamp = newMessage.createdAt;
      conversation.outgoing = true;

      // Set preview based on message type
      let preview = "";
      switch (type) {
        case "text":
          preview = content.text;
          break;
        case "reply":
          preview = content.text || "";
          break;
        case "media":
          preview = content.caption || `📎 ${content.mediaType}`;
          break;
        case "location":
          preview = "📍 Location";
          break;
        case "contact":
          preview = "👤 Contact";
          break;
        default:
          preview = `Message (${type})`;
      }

      conversation.metadata.last_message_preview = preview;
    }

    console.log("[MockAPI] sendMessage created:", newMessage);
    return newMessage;
  },

  addReaction: async (conversationId, messageId, emoji) => {
    await delay(300);
    const messages = mockMessagesStore[conversationId];
    if (!messages) return null;

    // Find the target message
    const targetMessage = messages.find((m) => m.id === messageId);
    if (!targetMessage) {
      console.error("[MockAPI] addReaction - Message not found:", messageId);
      return null;
    }

    // Initialize metadata if needed
    if (!targetMessage.metadata) targetMessage.metadata = {};
    if (!targetMessage.metadata.reactions)
      targetMessage.metadata.reactions = [];

    // Toggle reaction (add or remove)
    const existingIdx = targetMessage.metadata.reactions.findIndex(
      (r) => r.user_id === CURRENT_USER_ID && r.emoji === emoji
    );

    if (existingIdx > -1) {
      // Remove existing reaction (toggle off)
      targetMessage.metadata.reactions.splice(existingIdx, 1);
      console.log("[MockAPI] addReaction - Removed reaction:", {
        messageId,
        emoji,
      });
    } else {
      // Add new reaction
      targetMessage.metadata.reactions.push({
        emoji,
        user_id: CURRENT_USER_ID,
        timestamp: new Date().toISOString(),
      });
      console.log("[MockAPI] addReaction - Added reaction:", {
        messageId,
        emoji,
      });
    }

    // Update the message timestamp
    targetMessage.updatedAt = new Date().toISOString();

    // Return the updated message (not a new reaction message)
    return targetMessage;
  },
};
