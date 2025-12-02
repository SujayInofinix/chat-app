import React from 'react';
import { Box } from '@mui/material';
import { aggregateReactions } from '../../utils/messageUtils';

const ReactionDisplay = ({ reactions, onReactionClick, messageDirection, currentUserId = 'currentUser' }) => {
  if (!reactions || reactions.length === 0) return null;

  const aggregated = aggregateReactions(reactions);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: messageDirection === 'outbound' ? 'flex-end' : 'flex-start',
        position: 'relative',
        gap: 0.5,
        zIndex: 10,
        mt: '-20px',
        p: '8px 12px',
      }}
    >
      {aggregated.map(({ emoji, count, users }) => {
        const isUserReacted = users.includes(currentUserId);
        
        return (
          <Box
            key={emoji}
            onClick={() => onReactionClick(emoji)}
            sx={{
              backgroundColor: isUserReacted ? '#E8F5FE' : '#f0f0f0',
              borderRadius: '12px',
              padding: '4px 8px',
              border: `1px solid ${isUserReacted ? '#1976d2' : 'rgba(0,0,0,0.08)'}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isUserReacted ? '#D0EBFF' : '#e8e8e8',
                transform: 'scale(1.05)',
              },
            }}
          >
            <span>{emoji}</span>
            {count > 1 && <span style={{ fontWeight: 500 }}>{count}</span>}
          </Box>
        );
      })}
    </Box>
  );
};

export default ReactionDisplay;
