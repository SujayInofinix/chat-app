import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import FilterVariant from 'mdi-material-ui/FilterVariant';
import Magnify from 'mdi-material-ui/Magnify';
import React from 'react';
import { useConversationsQuery } from '../../hooks/useWhatsapp';
import { useConversationStore } from '../../store/conversation.store';
import { useMessageStore } from '../../store/message.store';

import { alpha } from '@mui/material/styles';

const StyledList = styled(List)(({ theme }) => ({
  padding: 0,
  '& .MuiListItemButton-root': {
    paddingLeft: theme.spacing(2.5),
    paddingRight: theme.spacing(2.5),
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&.Mui-selected': {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      paddingLeft: `calc(${theme.spacing(2.5)} - 4px)`,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.16),
      },
    },
  },
}));

const ConversationList = () => {
  const {
    activeConversationId,
    activeTab,
    filterKeyword,
    setTab,
    setFilterKeyword,
    setActiveConversationId
  } = useConversationStore();

  const { isLoading: isLoadingConversations } = useConversationsQuery();
  
  // Get conversations from store (source of truth) - select the object, not the array
  const conversationsById = useMessageStore((state) => state.conversations.byId);
  
  // Convert to array and filter
  const allConversations = Object.values(conversationsById);
  let conversations = allConversations;
  
  if (filterKeyword) {
    const lowerKeyword = filterKeyword.toLowerCase();
    conversations = allConversations.filter(
      (c) =>
        c.contact_name?.toLowerCase().includes(lowerKeyword) ||
        c.whatsapp_number?.includes(lowerKeyword)
    );
  }
  
  console.log('[ConversationList] Rendering with', conversations.length, 'conversations from store');
  
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSearchChange = (event) => {
    setFilterKeyword(event.target.value);
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'hh:mm aaa');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRight: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
      {/* Header / User Profile could go here */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Avatar src="/broken-image.jpg" sx={{ mr: 2 }} />
        <Typography variant="h6">My Status</Typography>
      </Box>
      <Divider />

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name or phone number"
          value={filterKeyword}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Magnify fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <FilterVariant fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.default'
            }
          }}
        />
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Active" value="active" />
        <Tab label="Open" value="open" />
        <Tab label="Assigned" value="assigned" />
      </Tabs>

      {/* List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {isLoadingConversations ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <StyledList>
            {conversations.map((conversation) => (
              <ListItemButton
                key={conversation.id}
                selected={activeConversationId === conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                alignItems="flex-start"
                sx={{ cursor: 'pointer' }}
              >
                <ListItemAvatar>
                  <Avatar src={conversation.profile_picture} alt={conversation.contact_name} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" noWrap sx={{ fontWeight: 600 }}>
                        {conversation.contact_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(conversation.last_message_timestamp)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '70%', lineHeight: '20px', minHeight: '20px' }}>
                        {conversation.metadata?.last_message_preview || ' '}
                      </Typography>
                      {conversation.unread_count > 0 && (
                        <Badge
                          badgeContent={conversation.unread_count}
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.7rem',
                              height: 18,
                              minWidth: 18,
                              backgroundColor: '#1DAA61',
                              color: '#fff'
                            }
                          }}
                        />
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            ))}
            {conversations.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No conversations found</Typography>
              </Box>
            )}
          </StyledList>
        )}
      </Box>
    </Box>
  );
};

export default ConversationList;
