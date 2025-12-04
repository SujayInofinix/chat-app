import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  Fab,
  Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Send from 'mdi-material-ui/Send';
import Phone from 'mdi-material-ui/Phone';
import Microphone from 'mdi-material-ui/Microphone';
import Magnify from 'mdi-material-ui/Magnify';
import DotsVertical from 'mdi-material-ui/DotsVertical';
import PageLayoutSidebarRight from 'mdi-material-ui/PageLayoutSidebarRight';
import EmoticonOutline from 'mdi-material-ui/EmoticonOutline';
import Paperclip from 'mdi-material-ui/Paperclip';
import Check from 'mdi-material-ui/Check';
import CheckAll from 'mdi-material-ui/CheckAll';
import ChevronDown from 'mdi-material-ui/ChevronDown';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useConversationStore } from '../../store/conversation.store';
import { useMessageStore } from '../../store/message.store';
import { useShallow } from 'zustand/react/shallow';
import { useMessagesQuery, useSendMessageMutation, useAddReactionMutation } from '../../hooks/useWhatsapp';
import { format } from 'date-fns';
import { Virtuoso } from 'react-virtuoso';

import RenderedMessageContent from './RenderedMessageContent';
import MessageContextMenu from './MessageContextMenu';
import ReactionPicker from './ReactionPicker';
import ReactionDisplay from './ReactionDisplay';
import ReplyPreview from './ReplyPreview';
import ReplyInputPreview from './ReplyInputPreview';
import { copyMessageToClipboard, scrollToMessage, getMessagePreviewText } from '../../utils/messageUtils';

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.paper,
}));

const MessageListContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: '#EFE7DE',
  backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
  backgroundRepeat: 'repeat',
  position: 'relative',
}));

const MessageBubble = styled(Box)(({ theme, type }) => ({
  padding: theme.spacing(1, 1.5),
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  alignSelf: type === 'outbound' ? 'flex-end' : 'flex-start',
  backgroundColor: type === 'outbound' ? '#D9FDD3' : '#FFFFFF',
  color: theme.palette.text.primary,
  boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
  borderTopRightRadius: type === 'outbound' ? 0 : theme.shape.borderRadius,
  borderTopLeftRadius: type === 'inbound' ? 0 : theme.shape.borderRadius, // 'inbound' not 'incoming'
  marginBottom: theme.spacing(0.5),

  '& > .message-tail': {
    position: 'absolute',
    top: 0,
    [type === 'outbound' ? 'right' : 'left']: -8,
    width: 8,
    height: 13,
    color: type === 'outbound' ? '#D9FDD3' : '#FFFFFF',
    transform: type === 'outbound' ? 'none' : 'scaleX(-1)',
  }
}));

const MessageTail = () => (
  <Box component="span" className="message-tail" aria-hidden="true" sx={{ display: 'block', lineHeight: 0 }}>
    <svg viewBox="0 0 8 13" height="13" width="8" preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      <path opacity="0.13" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path>
      <path fill="currentColor" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path>
    </svg>
  </Box>
);

const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  backgroundColor: '#F0F2F5',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const MessageStatus = ({ status }) => {
  if (status === 'read') {
    return <CheckAll fontSize="small" sx={{ fontSize: 18, color: '#53bdeb' }} />;
  } else if (status === 'delivered') {
    return <CheckAll fontSize="small" sx={{ fontSize: 18, color: 'text.disabled' }} />;
  }
  return <Check fontSize="small" sx={{ fontSize: 18, color: 'text.disabled' }} />;
};

const ChatWindow = () => {
  const { activeConversationId, activeConversation, toggleDrawer } = useConversationStore();
  const { isLoading: isLoadingMessages } = useMessagesQuery(activeConversationId);
  const messages = useMessageStore(useShallow(state => state.getMessagesForConversation(activeConversationId)));
  
  console.log('[ChatWindow] Rendering with store data:', messages.length, 'messages for conversation:', activeConversationId);
  console.log('[ChatWindow] Active conversation from store:', activeConversation);
  
  const { mutateAsync: sendMessage } = useSendMessageMutation();
  const { mutateAsync: addReaction } = useAddReactionMutation();

  const [replyingTo, setReplyingTo] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [contextMenu, setContextMenu] = useState({ anchorEl: null, message: null });
  const [reactionPicker, setReactionPicker] = useState({ anchorEl: null, message: null });
  const [isDefaultReactionOpen, setIsDefaultReactionOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  
  const virtuosoRef = useRef(null);

  const clearReplyingTo = () => setReplyingTo(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    await sendMessage({
      conversationId: activeConversationId,
      content: inputValue,
      replyingTo
    });
    setInputValue('');
    clearReplyingTo();
    virtuosoRef.current?.scrollToIndex({ index: messages.length, align: 'end', behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleContextMenu = (e, message) => {
    e.preventDefault();
    setContextMenu({ anchorEl: e.currentTarget, message });
  };

  const handleReply = (message) => {
    const senderName = message.direction === 'outbound' ? 'You' : (activeConversation?.contact_name || 'Unknown');
    setReplyingTo({
      id: message.id,
      preview_text: getMessagePreviewText(message),
      sender_name: senderName,
      message_type: message.type,
      direction: message.direction,
    });
  };

  const handleCopy = async (message) => {
    const success = await copyMessageToClipboard(message);
    setSnackbar({ open: true, message: success ? 'Message copied' : 'Failed to copy' });
  };

  const handleReact = (message, anchorEl) => {
    setReactionPicker({ anchorEl, message });
  };

  const handleEmojiSelect = (emoji) => {
    if (reactionPicker.message) {
      addReaction({ conversationId: activeConversationId, messageId: reactionPicker.message.id, emoji });
    }
  };

  const handleReactionClick = (messageId, emoji) => {
    addReaction({ conversationId: activeConversationId, messageId, emoji });
  };

  const handleReplyPreviewClick = (messageId) => {
     // Find index of message
     const index = messages.findIndex(m => m.id === messageId);
     if (index !== -1) {
       virtuosoRef.current?.scrollToIndex({ index, align: 'center', behavior: 'smooth' });
     }
  };

  if (!activeConversationId) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', bgcolor: '#F0F2F5', borderBottom: '6px solid #43c453' }}>
        <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 300 }}>Live Chat</Typography>
        <Typography variant="body2" color="text.secondary">Select a chat to continue!</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ChatHeader>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={activeConversation?.profile_picture} sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{activeConversation?.contact_name}</Typography>
            <Typography variant="caption" color="text.secondary">{activeConversation?.whatsapp_number}</Typography>
          </Box>
        </Box>
        <Box>
          <IconButton size="small"><Magnify /></IconButton>
          <IconButton size="small" onClick={toggleDrawer}><PageLayoutSidebarRight /></IconButton>
          <IconButton size="small"><DotsVertical /></IconButton>
        </Box>
      </ChatHeader>

      <MessageListContainer>
        {isLoadingMessages ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
        ) : (
          <Virtuoso
            ref={virtuosoRef}
            style={{ height: '100%' }}
            data={messages}
            initialTopMostItemIndex={messages.length - 1}
            followOutput="smooth"
            atBottomStateChange={(atBottom) => setShowScrollButton(!atBottom)}
            itemContent={(index, msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.direction === 'outbound' ? 'flex-end' : 'flex-start',
                  px: 3,
                  py: 0.5,
                  '&:hover .smiley-action': { opacity: 1 }
                }}
              >
                <Box sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  flexDirection: msg.direction === 'outbound' ? 'row' : 'row-reverse',
                  maxWidth: '70%',
                  justifyContent: 'flex-end'
                }}>
                  <IconButton
                    className="smiley-action"
                    size="small"
                    onClick={(e) => { e.stopPropagation(); setReactionPicker({ anchorEl: e.currentTarget, message: msg }); }}
                    sx={{ opacity: 0, transition: 'opacity 0.15s', width: 26, height: 26, bgcolor: '#f0f2f5', '&:hover': { bgcolor: '#e9edef' } }}
                  >
                    <EmoticonOutline sx={{ fontSize: 20 }} />
                  </IconButton>

                  <Box sx={{ position: 'relative', maxWidth: '100%', '&:hover .chevron-action': { opacity: 1 } }}>
                    <MessageBubble type={msg.direction}>
                      {msg.metadata?.replyTo && (
                        <ReplyPreview
                          replyTo={msg.metadata.replyTo}
                          onPreviewClick={handleReplyPreviewClick}
                          messageDirection={msg.direction}
                        />
                      )}
                      <RenderedMessageContent message={msg} />
                      <MessageTail />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                          {format(new Date(msg.createdAt), 'hh:mm aaa')}
                        </Typography>
                        {msg.direction === 'outbound' && <MessageStatus status={msg.status} />}
                      </Box>
                    </MessageBubble>

                    <IconButton
                      className="chevron-action"
                      size="small"
                      onClick={(e) => { e.stopPropagation(); setContextMenu({ anchorEl: e.currentTarget, message: msg }); }}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: msg.direction === 'inbound' ? 2 : undefined,
                        left: msg.direction === 'outbound' ? 2 : undefined,
                        opacity: 0,
                        transition: 'opacity 0.15s',
                        width: 20,
                        height: 20,
                        bgcolor: msg.direction === 'outbound' ? 'rgba(217, 253, 211, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        '&:hover': { bgcolor: msg.direction === 'outbound' ? '#D9FDD3' : '#FFFFFF' }
                      }}
                    >
                      <ChevronDown sx={{ fontSize: 16 }} />
                    </IconButton>

                    {msg.metadata?.reactions && msg.metadata.reactions.length > 0 && (
                      <ReactionDisplay
                        reactions={msg.metadata.reactions}
                        onReactionClick={(emoji) => handleReactionClick(msg.id, emoji)}
                        messageDirection={msg.direction}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          />
        )}

        <Zoom in={showScrollButton}>
          <Fab
            size="small"
            color="secondary"
            onClick={() => virtuosoRef.current?.scrollToIndex({ index: messages.length - 1, behavior: 'smooth' })}
            sx={{ position: 'absolute', bottom: 16, right: 32 }}
          >
            <ArrowDownwardIcon />
          </Fab>
        </Zoom>
      </MessageListContainer>

      <ReplyInputPreview replyingTo={replyingTo} onCancel={clearReplyingTo} />
      <ChatInputContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            size="medium"
            onClick={(e) => {
              // Open reaction picker without a specific message (for input emoji)
              setReactionPicker({ anchorEl: e.currentTarget, message: null });
              setIsDefaultReactionOpen(false);
            }}
          >
            <EmoticonOutline />
          </IconButton>
          <IconButton 
            size="medium"
            onClick={() => {
              // TODO: Implement attachment functionality
              setSnackbar({ open: true, message: 'Attachment feature coming soon!' });
            }}
          >
            <Paperclip />
          </IconButton>
          <TextField
            fullWidth
            placeholder="Type a message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#FFFFFF',
                borderRadius: 2,
                '& fieldset': { border: 'none' },
                padding: '8px 12px'
              }
            }}
            variant="outlined"
            size="small"
          />
          {inputValue.trim() ? (
            <IconButton color="primary" onClick={handleSend}><Send /></IconButton>
          ) : (
            <IconButton><Microphone /></IconButton>
          )}
        </Box>
      </ChatInputContainer>

      <MessageContextMenu
        message={contextMenu.message}
        anchorEl={contextMenu.anchorEl}
        onClose={() => setContextMenu({ anchorEl: null, message: null })}
        onReply={handleReply}
        onCopy={handleCopy}
        onReact={handleReact}
      />

      <ReactionPicker
        anchorEl={reactionPicker.anchorEl}
        onClose={() => setReactionPicker({ anchorEl: null, message: null })}
        onEmojiSelect={handleEmojiSelect}
        isDefaultReactionOpen={isDefaultReactionOpen}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatWindow;
