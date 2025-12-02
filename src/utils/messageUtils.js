/**
 * Utility functions for message operations
 */

/**
 * Extract plain text preview from any message type
 * @param {Object} message - The message object
 * @returns {string} - Plain text preview
 */
export const getMessagePreviewText = (message) => {
  if (!message) return "";

  switch (message.type) {
    case "text":
      return message.rendered_payload || "";

    case "template":
      // Extract body text from template components
      const components = message.rendered_payload?.rendered_components || [];
      const bodyComponent = components.find((c) => c.type === "BODY");
      return bodyComponent?.text || "Template message";

    case "image":
      return message.rendered_payload?.caption || "📷 Image";

    case "video":
      return message.rendered_payload?.caption || "🎥 Video";

    case "audio":
      return "🎵 Audio";

    case "document":
      return message.rendered_payload?.filename || "📄 Document";

    default:
      return "Message";
  }
};

/**
 * Get enhanced preview content for reply previews
 * Shows actual text content for text messages, type indicators for others
 * @param {Object} message - The message object
 * @returns {Object} - { text: string, isTextMessage: boolean }
 */
export const getReplyPreviewContent = (message) => {
  if (!message) return { text: "", isTextMessage: false };

  const type = message.type || message.message_type || "text";

  switch (type) {
    case "text":
      return {
        text: message.rendered_payload || message.preview_text || "",
        isTextMessage: true,
      };

    case "template":
      const components = message.rendered_payload?.rendered_components || [];
      const bodyComponent = components.find((c) => c.type === "BODY");
      return {
        text: bodyComponent?.text || "Template message",
        isTextMessage: true,
      };

    case "image":
      const imageCaption = message.rendered_payload?.caption;
      return {
        text: imageCaption ? `📷 Photo: ${imageCaption}` : "📷 Photo",
        isTextMessage: false,
      };

    case "video":
      const videoCaption = message.rendered_payload?.caption;
      return {
        text: videoCaption ? `🎥 Video: ${videoCaption}` : "🎥 Video",
        isTextMessage: false,
      };

    case "audio":
      return {
        text: "🎵 Audio",
        isTextMessage: false,
      };

    case "document":
      const filename = message.rendered_payload?.filename;
      return {
        text: filename ? `📄 ${filename}` : "📄 Document",
        isTextMessage: false,
      };

    case "location":
      return {
        text: "📍 Location",
        isTextMessage: false,
      };

    case "contact":
      return {
        text: "👤 Contact",
        isTextMessage: false,
      };

    default:
      return {
        text: "Message",
        isTextMessage: false,
      };
  }
};

/**
 * Copy message text to clipboard
 * @param {Object} message - The message object
 * @returns {Promise<boolean>} - True if successful
 */
export const copyMessageToClipboard = async (message) => {
  const text = getMessagePreviewText(message);

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text:", err);
    return false;
  }
};

/**
 * Scroll to a message by ID with highlight effect
 * @param {string} messageId - The message UUID
 */
export const scrollToMessage = (messageId) => {
  const element = document.getElementById(`message-${messageId}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });

    // Add highlight effect
    element.style.backgroundColor = "rgba(255, 255, 0, 0.2)";
    setTimeout(() => {
      element.style.transition = "background-color 1s ease";
      element.style.backgroundColor = "transparent";
    }, 100);

    setTimeout(() => {
      element.style.transition = "";
      element.style.backgroundColor = "";
    }, 1100);
  }
};

/**
 * Aggregate reactions by emoji and count
 * @param {Array} reactions - Array of reaction objects
 * @returns {Array} - Aggregated reactions with counts
 */
export const aggregateReactions = (reactions) => {
  if (!reactions || reactions.length === 0) return [];

  const grouped = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = {
        emoji: reaction.emoji,
        count: 0,
        users: [],
      };
    }
    acc[reaction.emoji].count++;
    acc[reaction.emoji].users.push(reaction.user_id);
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => b.count - a.count);
};
