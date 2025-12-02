// import { subMinutes, subHours, subDays } from "date-fns"; // Unused

const MOCK_DELAY = 800;

// Simulated current user ID
const CURRENT_USER_ID = "currentUser";

const mockConversationsResponse = {
  count: 4,
  total_pages: 1,
  current_page: 1,
  page_size: 50,
  results: [
    {
      uuid: "e5d7d687-eefd-4d10-bd21-100afac21aeb",
      title: "Conversation 2",
      type: "SUPPORT",
      conversation_status: "ACTIVE",
      agent: 12,
      metadata: {},
      contact_name: "shreyas",
      whatsapp_number: "+9921536127",
      last_message_text: null,
      unread_count: 1,
      last_message_timestamp: "2025-11-25T12:53:29.824450Z",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      uuid: "013c952d-b70e-4d7e-b9e7-4e2dd4b2fe51",
      title: "Conversation 3",
      type: "MARKETING",
      conversation_status: "ACTIVE",
      agent: 12,
      metadata: {},
      contact_name: "ningappa",
      whatsapp_number: "+8235174356",
      last_message_text: null,
      unread_count: 1,
      last_message_timestamp: "2025-11-25T12:53:29.824450Z",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      uuid: "80c256ce-490f-4171-9cab-1b53f3d852cc",
      title: "Conversation 4",
      type: "SUPPORT",
      conversation_status: "ACTIVE",
      agent: 12,
      metadata: {},
      contact_name: "sujay",
      whatsapp_number: "+9876543210",
      last_message_text: null,
      unread_count: 1,
      last_message_timestamp: "2025-11-25T12:53:29.823450Z",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
      uuid: "2d0bce68-cadd-4b47-8e2b-8bbfc6846d64",
      title: "Conversation 5",
      type: "MARKETING",
      conversation_status: "ACTIVE",
      agent: 12,
      metadata: {},
      contact_name: "Sourabh",
      whatsapp_number: "+1234567894",
      last_message_text: null,
      unread_count: 1,
      last_message_timestamp: "2025-11-25T12:53:29.823450Z",
      avatar: "https://i.pravatar.cc/150?u=4",
    },
  ],
};

const mockMessagesResponse = {
  messages: "Successfully fetched the message",
  data: {
    contact: null,
    messages: [
      {
        uuid: "75b1ba09-e0a5-4809-9a32-f56080454953",
        conversation: {
          uuid: "80c256ce-490f-4171-9cab-1b53f3d852cc",
          title: "Conversation 4",
          type: "SUPPORT",
          conversation_status: "ACTIVE",
          agent: 12,
          metadata: {},
          contact_name: "sujay",
          whatsapp_number: "+9876543210",
          last_message_text: null,
          unread_count: 1,
          last_message_timestamp: "2025-11-25T12:53:29.823450Z",
        },
        model_name: "WhatsappMessages",
        created: "2025-11-25T12:53:29.823450Z",
        updated: "2025-11-25T12:53:32.390089Z",
        direction: "outbound",
        type: "template",
        body: null,
        inbound_body: null,
        external_msg_id: null,
        client_msg_id: null,
        status: "queued",
        reason: null,
        rendered_payload: {
          name: "whatsapp_temp",
          language: "en",
          rendered_components: [
            {
              text: "Product restocked!",
              type: "HEADER",
              format: "TEXT",
            },
            {
              text: "Hey there, \\nWe are please to announce that the product you were looking for and which was out of stock has been restocked. Act fast",
              type: "BODY",
            },
            {
              text: "Don't stop for less keep moving up",
              type: "FOOTER",
            },
            {
              type: "BUTTONS",
              buttons: [
                {
                  text: "Buy now",
                  type: "QUICK_REPLY",
                },
                {
                  text: "Unsubscribe",
                  type: "QUICK_REPLY",
                },
              ],
            },
          ],
        },
        sent: false,
        sent_at: null,
        delivered: false,
        delivered_at: null,
        read: false,
        read_at: null,
        failed: false,
        failed_at: null,
        rejected: false,
        rejected_at: null,
        cost_micros: null,
        attempts: 0,
        queued: false,
        audience_type: "WHATSAPP_CAMPAIGN_AUDIENCE",
        clicked: false,
        clicked_at: null,
        unsubscribed: false,
        unsubscribed_at: null,
        workspace: 11,
        phone_number: "d1d81580-3593-4900-9a5a-ae4a8cf88eb2",
        whatsapp_contact: 31,
        whatsapp_campaign_audience: "f7c41c15-59d2-4655-925f-cd14559f5210",
        workflow_audience: null,
        template: null,
        reactions: [
          {
            emoji: "👍",
            user_id: "user1",
            timestamp: "2025-11-25T12:54:00.000Z",
          },
          {
            emoji: "👍",
            user_id: "user2",
            timestamp: "2025-11-25T12:55:00.000Z",
          },
          {
            emoji: "❤️",
            user_id: "user3",
            timestamp: "2025-11-25T12:56:00.000Z",
          },
        ],
        reply_to: null,
      },
      {
        uuid: "245bcae8-57c3-4801-981a-b7034b5db933",
        conversation: null,
        model_name: "WhatsappMessages",
        created: "2025-11-26T07:31:38.128514Z",
        updated: "2025-11-26T07:31:39.174101Z",
        direction: "outbound",
        type: "text",
        body: null,
        inbound_body: null,
        external_msg_id: null,
        client_msg_id: null,
        status: "sent",
        reason: null,
        rendered_payload: "hello sir, how are you?",
        sent: true,
        sent_at: "2025-11-26T07:31:39.174101Z",
        delivered: false,
        delivered_at: null,
        read: false,
        read_at: null,
        failed: false,
        failed_at: null,
        rejected: false,
        rejected_at: null,
        cost_micros: null,
        attempts: 0,
        queued: false,
        audience_type: null,
        clicked: false,
        clicked_at: null,
        unsubscribed: false,
        unsubscribed_at: null,
        workspace: 11,
        phone_number: "d1d81580-3593-4900-9a5a-ae4a8cf88eb2",
        whatsapp_contact: 31,
        whatsapp_campaign_audience: null,
        workflow_audience: null,
        template: null,
        reactions: [],
        reply_to: null,
      },
      {
        uuid: "img1",
        conversation: null,
        created: "2025-11-26T08:00:00.000000Z",
        direction: "outbound",
        type: "image",
        status: "read",
        rendered_payload: {
          url: "https://picsum.photos/300/200",
          caption: "Check this out!",
        },
        sent: true,
        delivered: true,
        read: true,
        reactions: [
          {
            emoji: "😂",
            user_id: "user1",
            timestamp: "2025-11-26T08:01:00.000Z",
          },
        ],
        reply_to: null,
      },
      {
        uuid: "vid1",
        conversation: null,
        created: "2025-11-26T08:05:00.000000Z",
        direction: "incoming",
        type: "video",
        status: "read",
        rendered_payload: {
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
          caption: "Funny video",
        },
        reactions: [],
        reply_to: {
          uuid: "img1",
          preview_text: "Check this out!",
          sender_name: "You",
          message_type: "image",
        },
      },
      {
        uuid: "aud1",
        conversation: null,
        created: "2025-11-26T08:10:00.000000Z",
        direction: "incoming",
        type: "audio",
        status: "read",
        rendered_payload: {
          url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        reactions: [],
        reply_to: null,
      },
      {
        uuid: "doc1",
        conversation: null,
        created: "2025-11-26T08:15:00.000000Z",
        direction: "outbound",
        type: "document",
        status: "sent",
        rendered_payload: {
          url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          caption: "Project Specs",
          filename: "specs.pdf",
        },
        sent: true,
        delivered: false,
        read: false,
        reactions: [],
        reply_to: null,
      },
    ],
  },
};

// Helper to simulate message storage for different conversations
// Each conversation gets a unique set of messages
let mockMessagesStore = {
  // Shreyas: 18 messages - mix of templates, text, images, reactions
  "e5d7d687-eefd-4d10-bd21-100afac21aeb": [
    {
      uuid: "shreyas-msg-1",
      created: "2025-12-01T09:00:00.000Z",
      direction: "outbound",
      type: "template",
      status: "read",
      rendered_payload: {
        rendered_components: [
          { text: "Product restocked!", type: "HEADER", format: "TEXT" },
          {
            text: "Hey there, \\nWe are please to announce that the product you were looking for and which was out of stock has been restocked. Act fast",
            type: "BODY",
          },
          { text: "Don't stop for less keep moving up", type: "FOOTER" },
          {
            type: "BUTTONS",
            buttons: [
              { text: "Buy now", type: "QUICK_REPLY" },
              { text: "Unsubscribe", type: "QUICK_REPLY" },
            ],
          },
        ],
      },
      sent: true,
      delivered: true,
      read: true,
      reactions: [
        {
          emoji: "👍",
          user_id: "user1",
          timestamp: "2025-12-01T09:01:00.000Z",
        },
        {
          emoji: "👍",
          user_id: "user2",
          timestamp: "2025-12-01T09:02:00.000Z",
        },
        {
          emoji: "❤️",
          user_id: "user3",
          timestamp: "2025-12-01T09:03:00.000Z",
        },
      ],
      reply_to: null,
    },
    {
      uuid: "shreyas-msg-2",
      created: "2025-12-01T13:01:00.000Z",
      direction: "outbound",
      type: "text",
      status: "read",
      rendered_payload: "hello sir, how are you?",
      sent: true,
      delivered: true,
      read: true,
      reactions: [],
      reply_to: null,
    },
    {
      uuid: "shreyas-msg-3",
      created: "2025-12-01T13:30:00.000Z",
      direction: "incoming",
      type: "image",
      status: "read",
      rendered_payload: {
        url: "https://picsum.photos/400/300?random=1",
        caption: "Check this out!",
      },
      reactions: [
        {
          emoji: "😮",
          user_id: "user1",
          timestamp: "2025-12-01T13:31:00.000Z",
        },
      ],
      reply_to: {
        uuid: "shreyas-msg-2",
        preview_text: "hello sir, how are you?",
        sender_name: "You",
        message_type: "text",
      },
    },
  ],

  // Ningappa: 12 messages - text, videos, documents
  "013c952d-b70e-4d7e-b9e7-4e2dd4b2fe51": [
    {
      uuid: "ningappa-msg-1",
      created: "2025-12-01T10:00:00.000Z",
      direction: "incoming",
      type: "text",
      status: "read",
      rendered_payload: "Hi! I need help with the product I ordered last week.",
      reactions: [],
      reply_to: null,
    },
    {
      uuid: "ningappa-msg-2",
      created: "2025-12-01T10:05:00.000Z",
      direction: "outbound",
      type: "text",
      status: "read",
      rendered_payload:
        "Of course! I'd be happy to help. Could you please provide me with your order number?",
      sent: true,
      delivered: true,
      read: true,
      reactions: [],
      reply_to: null,
    },
    {
      uuid: "ningappa-msg-3",
      created: "2025-12-01T10:10:00.000Z",
      direction: "incoming",
      type: "text",
      status: "read",
      rendered_payload: "It's ORD-2024-5678. The package arrived damaged.",
      reactions: [],
      reply_to: null,
    },
    {
      uuid: "ningappa-msg-4",
      created: "2025-12-01T10:15:00.000Z",
      direction: "incoming",
      type: "video",
      status: "read",
      rendered_payload: {
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        caption: "Here's a video showing the damage",
      },
      reactions: [],
      reply_to: null,
    },
    {
      uuid: "ningappa-msg-5",
      created: "2025-12-01T10:20:00.000Z",
      direction: "outbound",
      type: "text",
      status: "read",
      rendered_payload:
        "I'm sorry to see that! Let me process a replacement for you right away. You should receive it within 2-3 business days.",
      sent: true,
      delivered: true,
      read: true,
      reactions: [
        {
          emoji: "👍",
          user_id: "ningappa",
          timestamp: "2025-12-01T10:21:00.000Z",
        },
      ],
      reply_to: null,
    },
    {
      uuid: "ningappa-msg-6",
      created: "2025-12-01T10:25:00.000Z",
      direction: "outbound",
      type: "document",
      status: "sent",
      rendered_payload: {
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "replacement_order.pdf",
        pages: 12,
        size: "334 kB",
      },
      sent: true,
      delivered: false,
      read: false,
      reactions: [],
      reply_to: null,
    },
  ],

  // Sujay: 10 messages - text, audio, images
  "80c256ce-490f-4171-9cab-1b53f3d852cc": [
    {
      uuid: "sujay-msg-1",
      created: "2025-12-01T11:00:00.000Z",
      direction: "incoming",
      type: "text",
      status: "read",
      rendered_payload:
        "Hey! Do you have the specifications for the new model?",
      reactions: [],
      reply_to: null,
    },
    {
      uuid: "sujay-msg-2",
      created: "2025-12-01T11:05:00.000Z",
      direction: "outbound",
      type: "text",
      status: "read",
      rendered_payload: "Yes, I'll send them over right now.",
      sent: true,
      delivered: true,
      read: true,
      reactions: [],
      reply_to: null,
    },
    {
      uuid: "sujay-msg-3",
      created: "2025-12-01T11:06:00.000Z",
      direction: "outbound",
      type: "document",
      status: "read",
      rendered_payload: {
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "specs.pdf",
        pages: 13,
        size: "1 MB",
      },
      sent: true,
      delivered: true,
      read: true,
      reactions: [],
      reply_to: null,
    },
    {
      uuid: "sujay-msg-4",
      created: "2025-12-01T11:15:00.000Z",
      direction: "incoming",
      type: "audio",
      status: "read",
      rendered_payload: {
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      reactions: [],
      reply_to: {
        uuid: "sujay-msg-3",
        preview_text: "specs.pdf",
        sender_name: "You",
        message_type: "document",
      },
    },
    {
      uuid: "sujay-msg-5",
      created: "2025-12-01T11:20:00.000Z",
      direction: "outbound",
      type: "text",
      status: "delivered",
      rendered_payload:
        "Thanks for the voice note! I'll review your feedback and get back to you.",
      sent: true,
      delivered: true,
      read: false,
      reactions: [],
      reply_to: null,
    },
  ],

  // Sourabh: 15 messages - mixed types with replies
  "2d0bce68-cadd-4b47-8e2b-8bbfc6846d64": [
    {
      uuid: "sourabh-msg-1",
      created: "2025-12-01T08:00:00.000Z",
      direction: "incoming",
      type: "text",
      status: "read",
      rendered_payload:
        "Good morning! I wanted to discuss the project timeline.",
      reactions: [],
      reply_to: null,
    },
    {
      uuid: "sourabh-msg-2",
      created: "2025-12-01T08:05:00.000Z",
      direction: "outbound",
      type: "text",
      status: "read",
      rendered_payload:
        "Good morning! Sure, let's go over it. What specific aspects would you like to discuss?",
      sent: true,
      delivered: true,
      read: true,
      reactions: [],
      reply_to: null,
    },
    {
      uuid: "sourabh-msg-3",
      created: "2025-12-01T08:10:00.000Z",
      direction: "incoming",
      type: "text",
      status: "read",
      rendered_payload:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque non vulputate leo, sit amet vestibulum velit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus consequat sapien at lorem ultricies cursus. Mauris sed purus velit. Suspendisse eros lorem, feugiat a venenatis nec, tempus ut purus. Morbi facilisis elementum dolor, laoreet cursus dolor sit amet.",
      reactions: [],
      reply_to: {
        uuid: "sourabh-msg-2",
        preview_text:
          "Good morning! Sure, let's go over it. What specific aspects would you like to discuss?",
        sender_name: "You",
        message_type: "text",
      },
    },
    {
      uuid: "sourabh-msg-4",
      created: "2025-12-01T08:15:00.000Z",
      direction: "outbound",
      type: "image",
      status: "read",
      rendered_payload: {
        url: "https://picsum.photos/500/400?random=2",
        caption: "Here's the updated timeline chart",
      },
      sent: true,
      delivered: true,
      read: true,
      reactions: [
        {
          emoji: "👍",
          user_id: "sourabh",
          timestamp: "2025-12-01T08:16:00.000Z",
        },
        {
          emoji: "❤️",
          user_id: "sourabh",
          timestamp: "2025-12-01T08:17:00.000Z",
        },
      ],
      reply_to: null,
    },
    {
      uuid: "sourabh-msg-5",
      created: "2025-12-01T08:20:00.000Z",
      direction: "incoming",
      type: "text",
      status: "read",
      rendered_payload:
        "Perfect! This works great. When can we schedule a call to finalize the details?",
      reactions: [],
      reply_to: {
        uuid: "sourabh-msg-4",
        preview_text: "Here's the updated timeline chart",
        sender_name: "You",
        message_type: "image",
      },
    },
    {
      uuid: "sourabh-msg-6",
      created: "2025-12-01T08:25:00.000Z",
      direction: "outbound",
      type: "text",
      status: "sent",
      rendered_payload:
        "How about tomorrow at 2 PM? I'll send a calendar invite.",
      sent: true,
      delivered: false,
      read: false,
      reactions: [],
      reply_to: null,
    },
  ],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  getConversations: async (tab, keyword) => {
    await delay(MOCK_DELAY);
    let filtered = [...mockConversationsResponse.results];

    // Filter by tab (Mock logic based on status or type if needed, currently just returning all for 'active')
    // In a real scenario, you'd filter based on conversation_status or agent assignment
    if (tab === "open") {
      // Example: Filter where agent is null (if that was the logic)
      // filtered = filtered.filter((c) => !c.agent);
    } else if (tab === "assigned") {
      // filtered = filtered.filter((c) => c.agent);
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

    return filtered;
  },

  getMessages: async (conversationId) => {
    await delay(MOCK_DELAY);
    const conversation = mockConversationsResponse.results.find(
      (c) => c.uuid === conversationId
    );
    const messages = mockMessagesStore[conversationId] || [];

    return {
      messages: "Successfully fetched the message",
      data: {
        contact: conversation || null,
        messages: messages,
      },
    };
  },

  sendMessage: async (conversationId, content, replyTo = null) => {
    await delay(MOCK_DELAY);
    const newMessage = {
      uuid: `m${Date.now()}`,
      conversation: { uuid: conversationId },
      created: new Date().toISOString(),
      direction: "outbound",
      type: "text",
      status: "sent",
      rendered_payload: content,
      sent: true,
      delivered: false,
      read: false,
      reactions: [],
      reply_to: replyTo,
    };

    if (!mockMessagesStore[conversationId]) {
      mockMessagesStore[conversationId] = [];
    }
    mockMessagesStore[conversationId].push(newMessage);

    // Update last message in conversation
    const conversation = mockConversationsResponse.results.find(
      (c) => c.uuid === conversationId
    );
    if (conversation) {
      conversation.last_message_text = content;
      conversation.last_message_timestamp = newMessage.created;
    }

    return newMessage;
  },

  addReaction: async (conversationId, messageId, emoji) => {
    await delay(300); // Shorter delay for reactions
    const messages = mockMessagesStore[conversationId];
    if (!messages) return null;

    const message = messages.find((m) => m.uuid === messageId);
    if (!message) return null;

    if (!message.reactions) {
      message.reactions = [];
    }

    // Check if user already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.user_id === CURRENT_USER_ID && r.emoji === emoji
    );

    if (existingReactionIndex >= 0) {
      // Remove reaction if it exists
      message.reactions.splice(existingReactionIndex, 1);
    } else {
      // Add new reaction
      message.reactions.push({
        emoji,
        user_id: CURRENT_USER_ID,
        timestamp: new Date().toISOString(),
      });
    }

    return message;
  },
};
