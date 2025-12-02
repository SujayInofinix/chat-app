import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import Close from 'mdi-material-ui/Close';
import Phone from 'mdi-material-ui/Phone';
import Email from 'mdi-material-ui/Email';
import BlockHelper from 'mdi-material-ui/BlockHelper';
import DeleteOutline from 'mdi-material-ui/DeleteOutline';
import { useChatStore } from '../../store/useChatStore';

const ContactDrawer = () => {
  const { isDrawerOpen, toggleDrawer, activeConversation } = useChatStore();
  
  if (!isDrawerOpen) return null;

  return (
    <Box sx={{ width: 350, height: '100%', borderLeft: 1, borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        <IconButton onClick={toggleDrawer} sx={{ mr: 1 }}>
          <Close />
        </IconButton>
        <Typography variant="h6">Contact Info</Typography>
      </Box>
      <Divider />

      {activeConversation ? (
        <>
          {/* Profile */}
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Avatar src={activeConversation.avatar} sx={{ width: 100, height: 100, mb: 2 }} />
            <Typography variant="h6">{activeConversation.contact_name}</Typography>
            <Typography variant="body2" color="text.secondary">{activeConversation.whatsapp_number}</Typography>
          </Box>
          <Divider />

          {/* Details */}
          <List>
            <ListItem>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5, display: 'block', width: '100%' }}>
                About
              </Typography>
            </ListItem>
            <ListItem sx={{ pt: 0 }}>
              <Typography variant="body2">
                Hey there! I am using WhatsApp.
              </Typography>
            </ListItem>
            
            <Divider component="li" />

            <ListItem>
              <ListItemIcon><Phone /></ListItemIcon>
              <ListItemText primary={activeConversation.whatsapp_number} secondary="Mobile" />
            </ListItem>
            <ListItem>
              <ListItemIcon><Email /></ListItemIcon>
              <ListItemText primary="user@example.com" secondary="Email" />
            </ListItem>
          </List>

          <Box sx={{ flexGrow: 1 }} />

          {/* Actions */}
          <Box sx={{ p: 2 }}>
            <Button 
              fullWidth 
              variant="outlined" 
              color="error" 
              startIcon={<BlockHelper />} 
              sx={{ mb: 1 }}
            >
              Block Contact
            </Button>
            <Button 
              fullWidth 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteOutline />}
            >
              Delete Chat
            </Button>
          </Box>
        </>
      ) : (
        <>
          {/* Default state when no conversation is selected */}
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Avatar sx={{ width: 75, height: 75, mb: 2, bgcolor: 'action.hover', color: 'text.secondary' }} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ContactDrawer;
