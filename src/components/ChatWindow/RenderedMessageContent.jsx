import React from 'react';
import { Box, Typography, Divider, Button, IconButton, Link } from '@mui/material';
import FileDocument from 'mdi-material-ui/FileDocument';
import MapMarker from 'mdi-material-ui/MapMarker';
import AccountBox from 'mdi-material-ui/AccountBox';

const RenderedMessageContent = ({ message }) => {
  // Format text for WhatsApp styling (bold, italic, strikethrough)
  const formatText = (text) => {
    if (!text) return '';
    return text
      .replace(/\*(.*?)\*/g, '<b>$1</b>')
      .replace(/_(.*?)_/g, '<i>$1</i>')
      .replace(/~(.*?)~/g, '<s>$1</s>');
  };

  // Helper to get content based on type, supporting both new schema and legacy rendered_payload
  const getContent = () => {
    switch (message.type) {
      case 'text':
        return message.text?.body || message.rendered_payload;
      case 'image':
        return message.image || message.rendered_payload;
      case 'video':
        return message.video || message.rendered_payload;
      case 'audio':
        return message.audio || message.rendered_payload;
      case 'document':
        return message.document || message.rendered_payload;
      case 'location':
        return message.location || message.rendered_payload;
      case 'contacts':
        return message.contacts || message.rendered_payload;
      case 'interactive':
        return message.interactive || message.rendered_payload;
      case 'template':
        // Template usually has a complex structure, often pre-rendered in rendered_payload
        // But if we have the raw template object, we might need to render it differently or just show fallback
        return message.template || message.rendered_payload;
      default:
        return message.rendered_payload;
    }
  };

  const content = getContent();

  if (message.type === 'text') {
    const textBody = typeof content === 'string' ? content : content?.body;
    return (
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
        {textBody}
      </Typography>
    );
  } else if (message.type === 'template') {
    // ... existing template logic ...
    // Assuming rendered_payload structure for templates is still dominant for now
    // or we adapt to the new schema if present
    const components = message.rendered_payload?.rendered_components || [];

    if (components.length > 0) {
      return (
        <Box>
          {components.map((comp, index) => {
            if (comp.type === 'HEADER') {
              if (comp.format === 'TEXT') {
                return (
                  <Typography
                    key={index}
                    sx={{
                      fontWeight: 'bold',
                      mb: 1.5,
                      color: '#3e4242',
                      fontSize: '0.9rem',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      lineHeight: 1.3
                    }}
                  >
                    {comp.text}
                  </Typography>
                );
              }
              return null;
            }

            if (comp.type === 'BODY') {
              return (
                <Box
                  key={index}
                  sx={{
                    color: '#3e4242',
                    fontSize: '0.875rem',
                    lineHeight: 1.4,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    '& b': { fontWeight: 'bold' },
                    '& i': { fontStyle: 'italic' },
                    '& s': { textDecoration: 'line-through' }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formatText(comp.text)
                  }}
                />
              );
            }

            if (comp.type === 'FOOTER') {
              return (
                <Typography
                  key={index}
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1.5,
                    color: '#6B7280',
                    fontStyle: 'italic',
                    fontSize: '0.75rem',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    lineHeight: 1.2
                  }}
                >
                  {comp.text}
                </Typography>
              );
            }

            if (comp.type === 'BUTTONS' && comp.buttons && comp.buttons.length > 0) {
              return (
                <Box key={index} sx={{ width: '100%', display: 'flex', flexDirection: 'column', mt: 1.5 }}>
                  {comp.buttons.map((button, btnIndex) => (
                    <React.Fragment key={btnIndex}>
                      <Divider sx={{ width: '100%', my: 1, borderColor: 'rgba(0,0,0,0.1)' }} />
                      <Button
                        fullWidth
                        sx={{
                          textTransform: 'none',
                          color: '#00a5f4',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          justifyContent: 'center',
                          py: 0.5,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 165, 244, 0.04)'
                          }
                        }}
                      >
                        {button.text}
                      </Button>
                    </React.Fragment>
                  ))}
                </Box>
              );
            }

            return null;
          })}
        </Box>
      );
    }
    // Fallback if no rendered components but we have a template object
    if (content?.name) {
      return <Typography variant="body2">Template: {content.name}</Typography>;
    }
    return null;

  } else if (message.type === 'image') {
    const url = content?.link || content?.url;
    const caption = content?.caption;
    return (
      <Box sx={{ maxWidth: '100%' }}>
        <img
          src={url}
          alt="Shared image"
          style={{ maxWidth: '100%', borderRadius: 8, display: 'block' }}
        />
        {caption && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {caption}
          </Typography>
        )}
      </Box>
    );
  } else if (message.type === 'video') {
    const url = content?.link || content?.url;
    const caption = content?.caption;
    return (
      <Box>
        <Box sx={{
          maxWidth: '100%',
          overflow: 'hidden',
          borderRadius: 2,
          backgroundColor: '#000',
        }}>
          <video
            controls
            src={url}
            style={{
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
            }}
          />
        </Box>
        {caption && (
          <Typography variant="body2" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
            {caption}
          </Typography>
        )}
      </Box>
    );
  } else if (message.type === 'audio') {
    const url = content?.link || content?.url;
    return (
      <Box sx={{
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
      }}>
        <audio
          controls
          src={url}
          style={{
            width: '100%',
            maxWidth: '100%',
            display: 'block',
            outline: 'none',
          }}
        />
      </Box>
    );
  } else if (message.type === 'document') {
    const url = content?.link || content?.url;
    const filename = content?.filename || 'Document';
    const caption = content?.caption;

    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#FFFFFF',
        borderRadius: 2,
        overflow: 'hidden',
        maxWidth: '100%',
        boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
      }}>
        {/* Document Preview/Thumbnail */}
        <Box sx={{
          width: '100%',
          height: 200,
          bgcolor: '#f0f2f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}>
          <Box sx={{
            width: '80%',
            height: '80%',
            bgcolor: 'white',
            border: '1px solid #ddd',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <FileDocument sx={{ fontSize: 48, color: '#d32f2f', mb: 1 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase' }}>
              PDF
            </Typography>
          </Box>
        </Box>

        {/* Document Info */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          gap: 1.5,
        }}>
          <FileDocument fontSize="large" sx={{ color: 'error.main', flexShrink: 0 }} />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mb: 0.25,
              }}
            >
              {filename}
            </Typography>
            {caption && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{caption}</Typography>}
          </Box>

          {/* Download Button */}
          <IconButton
            size="small"
            sx={{
              bgcolor: '#e9edef',
              '&:hover': { bgcolor: '#d9dee0' },
              width: 36,
              height: 36,
            }}
            onClick={() => window.open(url, '_blank')}
          >
            <Box component="span" sx={{ fontSize: 20 }}>⬇</Box>
          </IconButton>
        </Box>
      </Box>
    );
  } else if (message.type === 'location') {
    const { latitude, longitude, name, address } = content || {};
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

    return (
      <Box sx={{ width: '100%', minWidth: 200 }}>
        <Box sx={{ height: 150, bgcolor: '#eee', mb: 1, borderRadius: 1, overflow: 'hidden' }}>
          {/* Placeholder for map or actual iframe if allowed */}
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src={mapUrl}
            allowFullScreen
          ></iframe>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <MapMarker sx={{ color: 'error.main', mt: 0.5 }} />
          <Box>
            {name && <Typography variant="subtitle2">{name}</Typography>}
            {address && <Typography variant="body2" color="text.secondary">{address}</Typography>}
          </Box>
        </Box>
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
          target="_blank"
          rel="noopener"
          sx={{ display: 'block', mt: 1, fontSize: '0.875rem' }}
        >
          View on Google Maps
        </Link>
      </Box>
    );
  } else if (message.type === 'contacts') {
    const contacts = Array.isArray(content) ? content : [content];
    return (
      <Box>
        {contacts.map((contact, idx) => (
          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, border: '1px solid #eee', borderRadius: 1, mb: 1 }}>
            <AccountBox sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="subtitle1">{contact.name?.formatted_name}</Typography>
              {contact.phones?.[0]?.phone && (
                <Typography variant="body2" color="text.secondary">{contact.phones[0].phone}</Typography>
              )}
            </Box>
          </Box>
        ))}
        <Button fullWidth variant="outlined" size="small">View Contact</Button>
      </Box>
    );
  } else if (message.type === 'interactive') {
    // Handle interactive messages (list, button, product)
    const interactiveType = content?.type;
    const header = content?.header?.text;
    const body = content?.body?.text;
    const footer = content?.footer?.text;

    return (
      <Box>
        {header && <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>{header}</Typography>}
        {body && <Typography variant="body1" sx={{ mb: 1 }}>{body}</Typography>}
        {footer && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>{footer}</Typography>}

        {interactiveType === 'button' && content.action?.buttons?.map((btn, idx) => (
          <Button key={idx} fullWidth variant="contained" sx={{ mt: 0.5, bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f5f5f5' } }}>
            {btn.reply?.title}
          </Button>
        ))}

        {interactiveType === 'list' && (
          <Button fullWidth variant="contained" sx={{ mt: 0.5 }}>
            {content.action?.button || 'View List'}
          </Button>
        )}
      </Box>
    );
  }

  // Fallback for other types or unknown types
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        Unsupported message type: {message.type}
      </Typography>
      {/* Render text content if available as fallback */}
      {typeof message.rendered_payload === 'string' && (
        <Typography variant="body1" sx={{ mt: 0.5 }}>
          {message.rendered_payload}
        </Typography>
      )}
    </Box>
  );
};

export default RenderedMessageContent;
