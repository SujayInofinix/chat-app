import React from 'react';
import { Box, Typography, Divider, Button, IconButton } from '@mui/material';
import FileDocument from 'mdi-material-ui/FileDocument';

const RenderedMessageContent = ({ message }) => {
  // Format text for WhatsApp styling (bold, italic, strikethrough)
  const formatText = (text) => {
    if (!text) return '';
    return text
      .replace(/\*(.*?)\*/g, '<b>$1</b>')
      .replace(/_(.*?)_/g, '<i>$1</i>')
      .replace(/~(.*?)~/g, '<s>$1</s>');
  };

  if (message.type === 'text') {
    return (
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
        {message.rendered_payload}
      </Typography>
    );
  } else if (message.type === 'template') {
    const components = message.rendered_payload?.rendered_components || [];
    
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
            // Handle other header formats (IMAGE, VIDEO, etc.) if needed
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
                  '& b': {
                    fontWeight: 'bold',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  },
                  '& i': {
                    fontStyle: 'italic',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  },
                  '& s': {
                    textDecoration: 'line-through',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                  }
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
  } else if (message.type === 'image') {
    return (
      <Box sx={{ maxWidth: '100%' }}>
        <img
          src={message.rendered_payload.url}
          alt="Shared image"
          style={{ maxWidth: '100%', borderRadius: 8, display: 'block' }}
        />
        {message.rendered_payload.caption && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {message.rendered_payload.caption}
          </Typography>
        )}
      </Box>
    );
  } else if (message.type === 'video') {
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
            src={message.rendered_payload.url}
            style={{ 
              width: '100%', 
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain',
            }}
          />
        </Box>
        {message.rendered_payload.caption && (
          <Typography variant="body2" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
            {message.rendered_payload.caption}
          </Typography>
        )}
      </Box>
    );
  } else if (message.type === 'audio') {
    return (
      <Box sx={{ 
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
      }}>
        <audio 
          controls 
          src={message.rendered_payload.url} 
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
    const { filename = 'Document', pages, size } = message.rendered_payload;
    
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
          {/* PDF Preview Placeholder */}
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
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {pages ? `${pages} pages` : ''}{pages && size ? ' • ' : ''} PDF{size ? ` • ${size}` : ''}
            </Typography>
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
            onClick={() => window.open(message.rendered_payload.url, '_blank')}
          >
            <Box component="span" sx={{ fontSize: 20 }}>⬇</Box>
          </IconButton>
        </Box>
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
