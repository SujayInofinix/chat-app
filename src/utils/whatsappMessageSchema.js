import { z } from 'zod';

/**
 * @typedef {Object} TextMessage
 * @property {boolean} [preview_url]
 * @property {string} body
 */

/**
 * @typedef {Object} MediaMessage
 * @property {string} [link]
 * @property {string} [id]
 * @property {string} [caption]
 * @property {string} [filename]
 */

/**
 * @typedef {Object} LocationMessage
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} [name]
 * @property {string} [address]
 */

/**
 * @typedef {Object} Contact
 * @property {Array<{street?: string, city?: string, state?: string, zip?: string, country?: string, country_code?: string, type?: string}>} [addresses]
 * @property {string} [birthday]
 * @property {Array<{email?: string, type?: string}>} [emails]
 * @property {{formatted_name: string, first_name?: string, last_name?: string}} name
 * @property {{company?: string, department?: string, title?: string}} [org]
 * @property {Array<{phone?: string, type?: string}>} [phones]
 * @property {Array<{url?: string, type?: string}>} [urls]
 */

/**
 * @typedef {Object} InteractiveMessage
 * @property {'list' | 'button' | 'product' | 'product_list'} type
 * @property {{type: 'text' | 'image' | 'video' | 'document', text?: string, image?: MediaMessage, video?: MediaMessage, document?: MediaMessage}} [header]
 * @property {{text: string}} body
 * @property {{text: string}} [footer]
 * @property {{button?: string, buttons?: Array<{type: 'reply', reply: {id: string, title: string}}>, sections?: Array<{title?: string, rows?: Array<{id: string, title: string, description?: string}>, product_items?: Array<{product_retailer_id: string}>}>, catalog_id?: string, product_retailer_id?: string}} action
 */

/**
 * @typedef {Object} TemplateMessage
 * @property {string} name
 * @property {{code: string}} language
 * @property {Array<{type: 'header' | 'body' | 'footer' | 'button', sub_type?: 'url' | 'quick_reply', index?: string, parameters: Array<{type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video' | 'payload', text?: string, currency?: {fallback_value: string, code: string, amount_1000: number}, date_time?: {fallback_value: string}, image?: MediaMessage, document?: MediaMessage, video?: MediaMessage, payload?: string}>}>} [components]
 */

/**
 * @typedef {Object} WhatsAppMessage
 * @property {'whatsapp'} messaging_product
 * @property {'individual'} recipient_type
 * @property {string} to
 * @property {'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contacts' | 'interactive' | 'template'} type
 * @property {TextMessage} [text]
 * @property {MediaMessage} [image]
 * @property {MediaMessage} [video]
 * @property {MediaMessage} [audio]
 * @property {MediaMessage} [document]
 * @property {LocationMessage} [location]
 * @property {Array<Contact>} [contacts]
 * @property {InteractiveMessage} [interactive]
 * @property {TemplateMessage} [template]
 */

// --- Zod Schemas ---

export const TextMessageSchema = z.object({
    preview_url: z.boolean().optional(),
    body: z.string(),
});

export const MediaMessageSchema = z.object({
    link: z.string().url().optional(),
    id: z.string().optional(), // For uploaded media
    caption: z.string().optional(),
    filename: z.string().optional(),
});

export const LocationMessageSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    name: z.string().optional(),
    address: z.string().optional(),
});

export const ContactSchema = z.object({
    addresses: z.array(z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zip: z.string().optional(),
        country: z.string().optional(),
        country_code: z.string().optional(),
        type: z.string().optional(),
    })).optional(),
    birthday: z.string().optional(),
    emails: z.array(z.object({
        email: z.string().email().optional(),
        type: z.string().optional(),
    })).optional(),
    name: z.object({
        formatted_name: z.string(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
    }),
    org: z.object({
        company: z.string().optional(),
        department: z.string().optional(),
        title: z.string().optional(),
    }).optional(),
    phones: z.array(z.object({
        phone: z.string().optional(),
        type: z.string().optional(),
    })).optional(),
    urls: z.array(z.object({
        url: z.string().url().optional(),
        type: z.string().optional(),
    })).optional(),
});

export const ContactsMessageSchema = z.array(ContactSchema);

export const InteractiveMessageSchema = z.object({
    type: z.enum(['list', 'button', 'product', 'product_list']),
    header: z.object({
        type: z.enum(['text', 'image', 'video', 'document']),
        text: z.string().optional(),
        image: MediaMessageSchema.optional(),
        video: MediaMessageSchema.optional(),
        document: MediaMessageSchema.optional(),
    }).optional(),
    body: z.object({
        text: z.string(),
    }),
    footer: z.object({
        text: z.string(),
    }).optional(),
    action: z.object({
        button: z.string().optional(), // For list
        buttons: z.array(z.object({
            type: z.literal('reply'),
            reply: z.object({
                id: z.string(),
                title: z.string(),
            }),
        })).optional(), // For button
        sections: z.array(z.object({
            title: z.string().optional(),
            rows: z.array(z.object({
                id: z.string(),
                title: z.string(),
                description: z.string().optional(),
            })).optional(), // For list
            product_items: z.array(z.object({
                product_retailer_id: z.string(),
            })).optional(), // For product_list
        })).optional(),
        catalog_id: z.string().optional(), // For product/product_list
        product_retailer_id: z.string().optional(), // For product
    }),
});

export const TemplateMessageSchema = z.object({
    name: z.string(),
    language: z.object({
        code: z.string(),
    }),
    components: z.array(z.object({
        type: z.enum(['header', 'body', 'footer', 'button']),
        sub_type: z.enum(['url', 'quick_reply']).optional(),
        index: z.string().optional(),
        parameters: z.array(z.object({
            type: z.enum(['text', 'currency', 'date_time', 'image', 'document', 'video', 'payload']),
            text: z.string().optional(),
            currency: z.object({
                fallback_value: z.string(),
                code: z.string(),
                amount_1000: z.number(),
            }).optional(),
            date_time: z.object({
                fallback_value: z.string(),
            }).optional(),
            image: MediaMessageSchema.optional(),
            document: MediaMessageSchema.optional(),
            video: MediaMessageSchema.optional(),
            payload: z.string().optional(),
        })),
    })).optional(),
});

export const WhatsAppMessageSchema = z.object({
    messaging_product: z.literal('whatsapp').default('whatsapp'),
    recipient_type: z.literal('individual').default('individual'),
    to: z.string(),
    type: z.enum(['text', 'image', 'video', 'audio', 'document', 'location', 'contacts', 'interactive', 'template']),
    text: TextMessageSchema.optional(),
    image: MediaMessageSchema.optional(),
    video: MediaMessageSchema.optional(),
    audio: MediaMessageSchema.optional(),
    document: MediaMessageSchema.optional(),
    location: LocationMessageSchema.optional(),
    contacts: ContactsMessageSchema.optional(),
    interactive: InteractiveMessageSchema.optional(),
    template: TemplateMessageSchema.optional(),
});

// --- Builder Utility ---

export const buildWhatsAppMessage = (to, type, content) => {
    const base = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type,
    };

    // Validate content based on type
    let validatedContent;
    try {
        switch (type) {
            case 'text':
                validatedContent = TextMessageSchema.parse(content);
                break;
            case 'image':
            case 'video':
            case 'audio':
            case 'document':
                validatedContent = MediaMessageSchema.parse(content);
                break;
            case 'location':
                validatedContent = LocationMessageSchema.parse(content);
                break;
            case 'contacts':
                validatedContent = ContactsMessageSchema.parse(content);
                break;
            case 'interactive':
                validatedContent = InteractiveMessageSchema.parse(content);
                break;
            case 'template':
                validatedContent = TemplateMessageSchema.parse(content);
                break;
            default:
                throw new Error(`Unsupported message type: ${type}`);
        }
    } catch (error) {
        console.error(`Validation failed for message type ${type}:`, error);
        throw error;
    }

    return {
        ...base,
        [type]: validatedContent,
    };
};
