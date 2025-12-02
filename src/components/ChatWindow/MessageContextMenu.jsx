import React from 'react';
import { Menu, MenuItem } from '@mui/material';

const MessageContextMenu = ({ message, anchorEl, onClose, onReply, onCopy, onReact }) => {
  const handleReply = () => {
    onReply(message);
    onClose();
  };

  const handleCopy = () => {
    onCopy(message);
    onClose();
  };

  const handleReact = (event) => {
    onReact(message, event.currentTarget);
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          minWidth: 150,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        },
      }}
    >
      <MenuItem 
        onClick={handleReply}
        sx={{ 
          fontSize: '0.9rem',
          padding: '8px 16px',
        }}
      >
        Reply
      </MenuItem>
      
      <MenuItem 
        onClick={handleCopy}
        sx={{ 
          fontSize: '0.9rem',
          padding: '8px 16px',
        }}
      >
        Copy
      </MenuItem>
      
      <MenuItem 
        onClick={handleReact}
        sx={{ 
          fontSize: '0.9rem',
          padding: '8px 16px',
        }}
      >
        React
      </MenuItem>
    </Menu>
  );
};

export default MessageContextMenu;
