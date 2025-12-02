import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import Close from 'mdi-material-ui/Close';
import { getReplyPreviewContent } from '../../utils/messageUtils';

const ReplyInputPreview = ({ replyingTo, onCancel }) => {
  if (!replyingTo) return null;

  const { text: previewText, isTextMessage } = getReplyPreviewContent(replyingTo);
  const senderName = replyingTo.direction === 'outbound' ? 'You' : 
    (replyingTo.conversation?.contact_name || 'Unknown');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1.5,
        backgroundColor: '#F0F2F5',
        borderTop: '1px solid',
        borderColor: 'divider',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 4,
          height: 40,
          backgroundColor: '#00a5f4',
          borderRadius: 1,
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: '#00a5f4',
            display: 'block',
          }}
        >
          Replying to {senderName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.85rem',
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
      <IconButton size="small" onClick={onCancel}>
        <Close fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default ReplyInputPreview;
