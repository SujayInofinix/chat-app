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

  const { type, content } = message;

  switch (type) {
    case "text":
      return content?.text || "";

    case "template":
      // Extract body text from template components
      const components = content?.components || [];
      const bodyComponent = components.find(
        (c) => c.type === "BODY" || c.type === "body"
      );
      return bodyComponent?.text || "Template message";

    case "image":
      return content?.caption || "📷 Image";

    case "video":
      return content?.caption || "🎥 Video";

    case "audio":
      return "🎵 Audio";

    case "document":
      return content?.filename || "📄 Document";

    case "location":
      return "📍 Location";

    case "contact":
      return "👤 Contact";

    case "reaction":
      return `Reacted ${content?.emoji} to message`;

    default:
      return "Message";
  }
};

/**
 * Get enhanced preview content for reply previews
 * Shows actual text content for text messages, type indicators for others
 * @param {Object} message - The message object or replyTo object
 * @returns {Object} - { text: string, isTextMessage: boolean }
 */
export const getReplyPreviewContent = (message) => {
  if (!message) return { text: "", isTextMessage: false };

  // Handle simplified replyTo object from metadata
  if (message.text && !message.type && !message.content) {
    return { text: message.text, isTextMessage: true };
  }

  const type = message.type || "text";
  const content = message.content || {};

  switch (type) {
    case "text":
      return {
        text: content.text || "",
        isTextMessage: true,
      };

    case "template":
      const components = content.components || [];
      const bodyComponent = components.find(
        (c) => c.type === "BODY" || c.type === "body"
      );
      return {
        text: bodyComponent?.text || "Template message",
        isTextMessage: true,
      };

    case "image":
      const imageCaption = content.caption;
      return {
        text: imageCaption ? `📷 Photo: ${imageCaption}` : "📷 Photo",
        isTextMessage: false,
      };

    case "video":
      const videoCaption = content.caption;
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
      const filename = content.filename;
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
  // Virtuoso handles scrolling, but for highlighting we might need to access the DOM node if rendered.
  // With Virtuoso, the node might not exist if not in view.
  // This function might need to be adapted or used in conjunction with Virtuoso's scrollToIndex.
  // For now, we assume the caller handles scrolling (which ChatWindow does via Virtuoso)
  // and this function just highlights if found.

  const element = document.getElementById(`message-${messageId}`);
  if (element) {
    // element.scrollIntoView({ behavior: "smooth", block: "center" }); // Let Virtuoso handle scroll

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
