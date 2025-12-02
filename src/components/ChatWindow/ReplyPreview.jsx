import React from 'react';
import { Box, Typography } from '@mui/material';
import { getReplyPreviewContent } from '../../utils/messageUtils';

const ReplyPreview = ({ replyTo, onPreviewClick, messageDirection }) => {
  if (!replyTo) return null;

  const { text: previewText, isTextMessage } = getReplyPreviewContent({
    type: replyTo.message_type || 'text',
    rendered_payload: replyTo.preview_text,
    message_type: replyTo.message_type,
    preview_text: replyTo.preview_text,
  });

  const accentColor = messageDirection === 'outbound' ? '#065e54' : '#00a5f4';

  return (
    <Box
      onClick={() => onPreviewClick && onPreviewClick(replyTo.uuid)}
      sx={{
        display: 'flex',
        mb: 1,
        p: 1,
        borderLeft: `4px solid ${accentColor}`,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: '4px',
        cursor: onPreviewClick ? 'pointer' : 'default',
        '&:hover': onPreviewClick ? {
          backgroundColor: 'rgba(0,0,0,0.08)',
        } : {},
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: accentColor,
            display: 'block',
            mb: 0.25,
          }}
        >
          {replyTo.sender_name || 'Unknown'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.8rem',
            color: 'text.secondary',
            // For text messages: 2 lines with ellipsis
            // For other types: single line
            ...(isTextMessage ? {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            } : {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            })
          }}
        >
          {previewText}
        </Typography>
      </Box>
    </Box>
  );
};

export default ReplyPreview;
