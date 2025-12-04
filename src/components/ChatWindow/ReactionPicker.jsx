import React from 'react';
import { Popover } from '@mui/material';
import EmojiPicker from 'emoji-picker-react';

const ReactionPicker = ({ anchorEl, onClose, onEmojiSelect, isDefaultReactionOpen = true }) => {
  const handleEmojiClick = (emojiObject) => {
    onEmojiSelect(emojiObject.emoji);
    onClose();
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        },
      }}
    >
      <EmojiPicker
        onEmojiClick={handleEmojiClick}
        width={350}
        height={400}
        previewConfig={{ showPreview: false }}
        skinTonesDisabled
        searchDisabled={false}
        reactionsDefaultOpen={isDefaultReactionOpen}
      />
    </Popover>
  );
};

export default ReactionPicker;
