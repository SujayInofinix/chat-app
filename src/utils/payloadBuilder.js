/**
 * Message Payload Builder Utility
 *
 * Centralizes the creation of structured message payloads for different message types.
 * All outgoing messages must follow the specification:
 * { conversationId, type, content }
 */

/**
 * Build a structured message payload
 * @param {string} conversationId - The conversation ID
 * @param {string} type - Message type (text, media, template, etc.)
 * @param {object} data - Type-specific data
 * @returns {object} Structured payload
 */
export const buildSendPayload = (conversationId, type, data) => {
  if (!conversationId) {
    throw new Error("conversationId is required");
  }

  const payload = {
    conversationId,
    type,
    content: null,
  };

  switch (type) {
    case "text":
      payload.content = buildTextContent(data);
      break;
    case "media":
      payload.content = buildMediaContent(data);
      break;
    case "template":
      payload.content = buildTemplateContent(data);
      break;
    case "interactive_buttons":
      payload.content = buildInteractiveButtonsContent(data);
      break;
    case "interactive_list":
      payload.content = buildInteractiveListContent(data);
      break;
    case "contact":
      payload.content = buildContactContent(data);
      break;
    case "location":
      payload.content = buildLocationContent(data);
      break;
    case "reaction":
      payload.content = buildReactionContent(data);
      break;
    case "product":
      payload.content = buildProductContent(data);
      break;
    default:
      payload.type = "unknown";
      payload.content = { raw: data };
  }

  console.log("[PayloadBuilder] Built payload:", payload);
  return payload;
};

/**
 * Build text message content
 * @param {object} data - { text, replyTo? }
 */
const buildTextContent = (data) => {
  if (!data.text || typeof data.text !== "string") {
    throw new Error("Text content requires a valid text string");
  }

  return {
    text: data.text,
    // replyTo is handled separately in metadata
  };
};

/**
 * Build reply message content
 * @param {object} data - { replyTo, messageType, text?, mediaId?, url? }
 */
const buildReplyContent = (data) => {
  if (!data.replyTo) {
    throw new Error("Reply content requires replyTo message ID");
  }

  if (!data.messageType) {
    throw new Error(
      "Reply content requires messageType (text, media, sticker)"
    );
  }

  const validMessageTypes = ["text", "media", "sticker"];
  if (!validMessageTypes.includes(data.messageType)) {
    throw new Error(
      `Invalid messageType for reply. Must be one of: ${validMessageTypes.join(
        ", "
      )}`
    );
  }

  const content = {
    replyTo: data.replyTo,
    messageType: data.messageType,
  };

  // Add type-specific fields
  if (data.messageType === "text" && data.text) {
    content.text = data.text;
  } else if (data.messageType === "media" || data.messageType === "sticker") {
    if (data.mediaId) content.mediaId = data.mediaId;
    if (data.url) content.url = data.url;
    if (data.text) content.text = data.text; // Caption for media replies
  }

  return content;
};

/**
 * Build media message content
 * @param {object} data - { mediaType, mediaId?, url?, caption?, mimeType?, filename? }
 */
const buildMediaContent = (data) => {
  const validMediaTypes = [
    "image",
    "video",
    "audio",
    "document",
    "file",
    "sticker",
  ];

  if (!data.mediaType || !validMediaTypes.includes(data.mediaType)) {
    throw new Error(
      `Invalid mediaType. Must be one of: ${validMediaTypes.join(", ")}`
    );
  }

  const content = {
    mediaType: data.mediaType,
  };

  // At least one of mediaId or url must be present
  if (data.mediaId) content.mediaId = data.mediaId;
  if (data.url) content.url = data.url;

  if (!content.mediaId && !content.url) {
    throw new Error("Media content requires either mediaId or url");
  }

  // Optional fields
  if (data.caption) content.caption = data.caption;
  if (data.mimeType) content.mimeType = data.mimeType;
  if (data.filename) content.filename = data.filename;

  return content;
};

/**
 * Build template message content
 * @param {object} data - { name, language, components, parameters? }
 */
const buildTemplateContent = (data) => {
  if (!data.name || !data.language || !Array.isArray(data.components)) {
    throw new Error(
      "Template content requires name, language, and components array"
    );
  }

  return {
    name: data.name,
    language: data.language,
    components: data.components,
    parameters: data.parameters || [],
  };
};

/**
 * Build interactive buttons content
 * @param {object} data - { header?, body, action }
 */
const buildInteractiveButtonsContent = (data) => {
  if (!data.body || !data.action || !Array.isArray(data.action.buttons)) {
    throw new Error(
      "Interactive buttons requires body and action.buttons array"
    );
  }

  const content = {
    interactiveType: "buttons",
    body: data.body,
    action: data.action,
  };

  if (data.header) content.header = data.header;

  return content;
};

/**
 * Build interactive list content
 * @param {object} data - { header?, body, action }
 */
const buildInteractiveListContent = (data) => {
  if (!data.body || !data.action || !Array.isArray(data.action.sections)) {
    throw new Error("Interactive list requires body and action.sections array");
  }

  const content = {
    interactiveType: "list",
    body: data.body,
    action: data.action,
  };

  if (data.header) content.header = data.header;

  return content;
};

/**
 * Build contact message content
 * @param {object} data - { contacts }
 */
const buildContactContent = (data) => {
  if (!Array.isArray(data.contacts) || data.contacts.length === 0) {
    throw new Error(
      "Contact content requires a contacts array with at least one contact"
    );
  }

  return {
    contacts: data.contacts,
  };
};

/**
 * Build location message content
 * @param {object} data - { latitude, longitude, name?, address? }
 */
const buildLocationContent = (data) => {
  if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
    throw new Error(
      "Location content requires valid latitude and longitude numbers"
    );
  }

  const content = {
    latitude: data.latitude,
    longitude: data.longitude,
  };

  if (data.name) content.name = data.name;
  if (data.address) content.address = data.address;

  return content;
};

/**
 * Build reaction message content
 * @param {object} data - { message_id, emoji }
 */
const buildReactionContent = (data) => {
  if (!data.message_id || !data.emoji) {
    throw new Error("Reaction content requires message_id and emoji");
  }

  return {
    message_id: data.message_id,
    emoji: data.emoji,
  };
};

/**
 * Build product message content
 * @param {object} data - { productId, catalogId, title, price, currency }
 */
const buildProductContent = (data) => {
  if (!data.productId || !data.catalogId || !data.title) {
    throw new Error("Product content requires productId, catalogId, and title");
  }

  return {
    productId: data.productId,
    catalogId: data.catalogId,
    title: data.title,
    price: data.price,
    currency: data.currency || "INR",
  };
};

/**
 * Helper to validate and sanitize text input
 * @param {string} text - Input text
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text) => {
  if (typeof text !== "string") return "";
  return text.trim();
};
