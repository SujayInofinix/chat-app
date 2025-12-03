import { z } from "zod";

// --- Enums ---

export const ParticipantType = z.enum(["agent", "chat-bot"]);
export const ActorType = z.enum(["customer", "business", "agent", "chat-bot"]);
export const MessageDirection = z.enum(["inbound", "system", "outbound"]);
export const MessageStatus = z.enum([
  "pending",
  "sent",
  "delivered",
  "read",
  "failed",
]);
export const MessageType = z.enum([
  "text",
  "media",
  "template",
  "interactive",
  "contact",
  "location",
  "reaction",
  "sticker",
  "product",
  "unknown",
]);
export const MediaType = z.enum([
  "image",
  "video",
  "audio",
  "document",
  "file",
  "sticker",
]);

// --- Sub-schemas ---

export const ParticipantSchema = z.object({
  id: z.string(),
  type: ParticipantType,
  display_name: z.string().optional(),
});

export const ActorSchema = z.object({
  id: z.string(),
  display_name: z.string(),
  userName: z.string(),
  email: z.string().email().or(z.literal("")),
  type: ActorType,
});

// --- Content Schemas ---

export const TextContentSchema = z.object({
  text: z.string(),
  previewUrl: z.string().nullable().optional(),
});

export const MediaContentSchema = z.object({
  mediaType: MediaType,
  mediaId: z.string().optional(),
  url: z.string(),
  mimeType: z.string().optional(),
  filename: z.string().optional(),
  caption: z.string().optional(),
  size: z.number().optional(),
  sha256: z.string().optional(),
  meta: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
      duration: z.number().optional(),
    })
    .optional(),
});

export const TemplateComponentSchema = z.object({
  type: z
    .enum([
      "header",
      "body",
      "button",
      "footer",
      "HEADER",
      "BODY",
      "BUTTONS",
      "FOOTER",
    ])
    .transform((val) => val.toLowerCase()),
  format: z
    .enum([
      "text",
      "image",
      "document",
      "video",
      "TEXT",
      "IMAGE",
      "DOCUMENT",
      "VIDEO",
    ])
    .optional()
    .transform((val) => val?.toLowerCase()),
  payload: z.any().optional(),
  text: z.string().optional(),
  buttons: z.array(z.any()).optional(), // Simplified for now
});

export const TemplateContentSchema = z.object({
  templateName: z.string(),
  language: z.string(),
  components: z.array(TemplateComponentSchema),
  params: z.array(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export const InteractiveContentSchema = z.object({
  interactiveType: z.enum([
    "buttons",
    "list",
    "product_list",
    "address_request",
  ]),
  header: z
    .object({
      type: z.enum(["text", "image"]),
      text: z.string().optional(),
      mediaUrl: z.string().optional(),
    })
    .optional(),
  body: z.object({
    text: z.string(),
  }),
  action: z.object({
    buttons: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
        })
      )
      .optional(),
    sections: z
      .array(
        z.object({
          title: z.string().optional(),
          rows: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string().optional(),
            })
          ),
        })
      )
      .optional(),
    products: z
      .object({
        catalogId: z.string(),
        productRetailerIds: z.array(z.string()),
      })
      .optional(),
  }),
});

export const ContactContentSchema = z.object({
  contacts: z.array(
    z.object({
      name: z.object({
        formattedName: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      }),
      phones: z
        .array(z.object({ phone: z.string(), type: z.string().optional() }))
        .optional(),
      emails: z
        .array(z.object({ email: z.string(), type: z.string().optional() }))
        .optional(),
      org: z
        .object({
          company: z.string().optional(),
          department: z.string().optional(),
        })
        .optional(),
      addresses: z
        .array(
          z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            country: z.string().optional(),
          })
        )
        .optional(),
    })
  ),
});

export const LocationContentSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  name: z.string().optional(),
  address: z.string().optional(),
});

export const ReactionContentSchema = z.object({
  reactionToMessageId: z.string(),
  emoji: z.string(),
  actor: z.string().optional(),
});

export const StickerContentSchema = z.object({
  stickerId: z.string().optional(),
  url: z.string(),
  mimeType: z.string().optional(),
  sha256: z.string().optional(),
});

export const ProductContentSchema = z.object({
  productId: z.string(),
  catalogId: z.string().optional(),
  title: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().optional(),
});

export const UnknownContentSchema = z.object({
  raw: z.any(),
});

// Union of all content types
export const MessageContentSchema = z.union([
  TextContentSchema,
  MediaContentSchema,
  TemplateContentSchema,
  InteractiveContentSchema,
  ContactContentSchema,
  LocationContentSchema,
  ReactionContentSchema,
  StickerContentSchema,
  ProductContentSchema,
  UnknownContentSchema,
]);

// --- Main Schemas ---

export const ConversationSchema = z.object({
  id: z.string(),
  whatsapp_number: z.string().nullable(),
  profile_picture: z.string(),
  contact_name: z.string(),
  assigned_agent: ParticipantSchema.nullable(),
  last_message_id: z.string().nullable(),
  unread_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  last_message_timestamp: z.string().optional(), // Made optional as it might be missing if no messages
  metadata: z.record(z.any()).optional(),
  outgoing: z.boolean(),
});

export const MessageSchema = z.object({
  id: z.string(),
  messageId: z.string().optional(),
  conversationId: z.string(),
  direction: MessageDirection,
  from: ActorSchema.nullable(),
  type: MessageType,
  content: MessageContentSchema,
  status: MessageStatus,
  deliveredAt: z.string().optional(),
  readAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  metadata: z.record(z.any()).optional(),
});

export const ConversationListSchema = z.array(ConversationSchema);
export const MessageListSchema = z.array(MessageSchema);
