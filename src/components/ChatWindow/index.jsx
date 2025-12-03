import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Paper,
  CircularProgress,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Send from 'mdi-material-ui/Send';
import Phone from 'mdi-material-ui/Phone';
import Video from 'mdi-material-ui/Video';
import Magnify from 'mdi-material-ui/Magnify';
import DotsVertical from 'mdi-material-ui/DotsVertical';
import PageLayoutSidebarRight from 'mdi-material-ui/PageLayoutSidebarRight'; // For drawer toggle
import EmoticonOutline from 'mdi-material-ui/EmoticonOutline';
import Paperclip from 'mdi-material-ui/Paperclip';
import Check from 'mdi-material-ui/Check';
import CheckAll from 'mdi-material-ui/CheckAll';
import ChevronDown from 'mdi-material-ui/ChevronDown';
import { useConversationStore } from '../../store/conversation.store';
import { useMessageStore } from '../../store/message.store';
import { useShallow } from 'zustand/react/shallow';
import { useMessagesQuery, useSendMessageMutation, useAddReactionMutation } from '../../hooks/useWhatsapp';
import { format } from 'date-fns';
import { Virtuoso } from 'react-virtuoso';
import RenderedMessageContent from './RenderedMessageContent';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Fab, Zoom } from '@mui/material';
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

const MessageList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  overflowY: 'auto',
  backgroundColor: '#EFE7DE', // WhatsApp-like background color
  backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', // Optional: WhatsApp doodle pattern
  backgroundRepeat: 'repeat',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1), // Reduced gap for tighter grouping
}));

const MessageBubble = styled(Box)(({ theme, type }) => ({

  padding: theme.spacing(1, 1.5), // Tighter padding
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  alignSelf: type === 'outbound' ? 'flex-end' : 'flex-start',
  backgroundColor: type === 'outbound' ? '#D9FDD3' : '#FFFFFF',
  color: theme.palette.text.primary,
  boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)',
  borderTopRightRadius: type === 'outbound' ? 0 : theme.shape.borderRadius,
  borderTopLeftRadius: type === 'incoming' ? 0 : theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),

  // Bubble Tail
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
  <Box
    component="span"
    className="message-tail"
    aria-hidden="true"
    data-icon="tail-out"
    sx={{ display: 'block', lineHeight: 0 }}
  >
    <svg
      viewBox="0 0 8 13"
      height="13"
      width="8"
      preserveAspectRatio="xMidYMid meet"
      version="1.1"
      x="0px"
      y="0px"
      enableBackground="new 0 0 8 13"
      style={{ display: 'block' }} // Ensure no extra space
    >
      <title>tail-out</title>
      <path
        opacity="0.13"
        d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"
      ></path>
      <path
        fill="currentColor"
        d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"
      ></path>
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
    return <CheckAll fontSize="small" sx={{ fontSize: 18, color: '#53bdeb' }} />; // Blue ticks
  } else if (status === 'delivered') {
    return <CheckAll fontSize="small" sx={{ fontSize: 18, color: 'text.disabled' }} />; // Double grey
  }
  return <Check fontSize="small" sx={{ fontSize: 18, color: 'text.disabled' }} />; // Single grey (Sent/Queued)
};

const ChatWindow = () => {
  const {
    activeConversationId,
    activeConversation,
    toggleDrawer,
  } = useConversationStore();

  const { isLoading: isLoadingMessages } = useMessagesQuery(activeConversationId);
  const messages = useMessageStore(useShallow(state => state.getMessagesForConversation(activeConversationId)));
  const { mutateAsync: sendMessage } = useSendMessageMutation();
  const { mutateAsync: addReaction } = useAddReactionMutation();

  const [replyingTo, setReplyingTo] = useState(null);
  const clearReplyingTo = () => setReplyingTo(null);

  const [inputValue, setInputValue] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [contextMenu, setContextMenu] = useState({ anchorEl: null, message: null });
  const [reactionPicker, setReactionPicker] = useState({ anchorEl: null, message: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // Show button if we are not at the bottom (with some buffer)
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isAtBottom);
  };

  useEffect(() => {
    if (activeConversationId) {
      // fetchMessages is already called in selectConversation
    }
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    await sendMessage({
      conversationId: activeConversationId,
      content: inputValue,
      replyingTo
    });
    setInputValue('');
    clearReplyingTo();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Context menu handlers
  const handleContextMenu = (e, message) => {
    e.preventDefault();
    setContextMenu({ anchorEl: e.currentTarget, message });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ anchorEl: null, message: null });
  };

  const handleReply = (message) => {
    const senderName = message.direction === 'outbound' ? 'You' :
      (message.conversation?.contact_name || activeConversation?.contact_name || 'Unknown');

    setReplyingTo({
      uuid: message.uuid,
      preview_text: getMessagePreviewText(message),
      sender_name: senderName,
      message_type: message.type,
      direction: message.direction,
      conversation: message.conversation,
    });
  };

  const handleCopy = async (message) => {
    const success = await copyMessageToClipboard(message);
    if (success) {
      setSnackbar({ open: true, message: 'Message copied to clipboard' });
    } else {
      setSnackbar({ open: true, message: 'Failed to copy message' });
    }
  };

  const handleReact = (message, anchorEl) => {
    setReactionPicker({ anchorEl, message });
  };

  const handleCloseReactionPicker = () => {
    setReactionPicker({ anchorEl: null, message: null });
  };

  const handleEmojiSelect = (emoji) => {
    if (reactionPicker.message) {
      addReaction({
        conversationId: activeConversationId,
        messageId: reactionPicker.message.uuid,
        emoji
      });
    }
  };

  const handleReactionClick = (messageId, emoji) => {
    addReaction({
      conversationId: activeConversationId,
      messageId,
      emoji
    });
  };

  const handleReplyPreviewClick = (messageId) => {
    scrollToMessage(messageId);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!activeConversationId) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', bgcolor: '#F0F2F5', borderBottom: '6px solid #43c453' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 300 }}>
            Live Chat
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a chat to continue!
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <ChatHeader>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={activeConversation?.avatar} sx={{ mr: 2 }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {activeConversation?.contact_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {activeConversation?.whatsapp_number}
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton size="small"><Magnify /></IconButton>
          <IconButton size="small" onClick={toggleDrawer}><PageLayoutSidebarRight /></IconButton>
          <IconButton size="small"><DotsVertical /></IconButton>
        </Box>
      </ChatHeader>

      {/* Messages */}
      <Box sx={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <MessageList ref={messageListRef} onScroll={handleScroll}>
          {isLoadingMessages ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            messages.map((msg) => (
              <Box
                key={msg.uuid}
                id={`message-${msg.uuid}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.direction === 'outbound' ? 'flex-end' : 'flex-start',
                  position: 'relative',
                  // Show smiley button on message line hover
                  '&:hover .smiley-action': {
                    opacity: 1,
                  }
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
                  {/* Smiley Button - Shows on message line hover */}
                  <IconButton
                    className="smiley-action"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReactionPicker({ anchorEl: e.currentTarget, message: msg });
                    }}
                    sx={{
                      opacity: 0,
                      transition: 'opacity 0.15s ease',
                      width: 26,
                      height: 26,
                      backgroundColor: '#f0f2f5',
                      color: '#54656f',
                      flexShrink: 0,
                      '&:hover': {
                        backgroundColor: '#e9edef',
                      }
                    }}
                  >
                    <EmoticonOutline sx={{ fontSize: 20 }} />
                  </IconButton>

                  {/* Message Bubble */}
                  <Box
                    sx={{
                      position: 'relative',
                      maxWidth: '65%',
                      // Show chevron on bubble hover
                      '&:hover .chevron-action': {
                        opacity: 1,
                      }
                    }}
                  >
                    <MessageBubble type={msg.direction}>
                      {msg.reply_to && (
                        <ReplyPreview
                          replyTo={msg.reply_to}
                          onPreviewClick={handleReplyPreviewClick}
                          messageDirection={msg.direction}
                        />
                      )}
                      <RenderedMessageContent message={msg} />
                      <MessageTail />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
                        <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                          {format(new Date(msg.created), 'hh:mm aaa')}
                        </Typography>
                        {msg.direction === 'outbound' && <MessageStatus status={msg.status || (msg.read ? 'read' : msg.delivered ? 'delivered' : 'sent')} />}
                      </Box>
                    </MessageBubble>

                    {/* Chevron Button - Shows on bubble hover, positioned at top-right corner */}
                    <IconButton
                      className="chevron-action"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenu({ anchorEl: e.currentTarget, message: msg });
                      }}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: msg.direction === 'incoming' ? 2 : undefined,
                        left: msg.direction === 'outbound' ? 2 : undefined,
                        opacity: 0,
                        transition: 'opacity 0.15s ease',
                        width: 20,
                        height: 20,
                        padding: 0,
                        minWidth: 20,
                        backgroundColor: msg.direction === 'outbound' ? 'rgba(217, 253, 211, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        color: '#54656f',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.08)',
                        '&:hover': {
                          backgroundColor: msg.direction === 'outbound' ? '#D9FDD3' : '#FFFFFF',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                        }
                      }}
                    >
                      <ChevronDown sx={{ fontSize: 16 }} />
                    </IconButton>

                    {/* Reactions Display - Absolutely positioned to overlap */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <ReactionDisplay
                        reactions={msg.reactions}
                        onReactionClick={(emoji) => handleReactionClick(msg.uuid, emoji)}
                        messageDirection={msg.direction}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </MessageList>

        <Zoom in={showScrollButton}>
          <Fab
            size="small"
            color="secondary"
            aria-label="scroll down"
            onClick={scrollToBottom}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 32,
              bgcolor: 'background.paper',
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <ArrowDownwardIcon />
          </Fab>
        </Zoom>
      </Box>

      {/* Input */}
      <ReplyInputPreview replyingTo={replyingTo} onCancel={clearReplyingTo} />
      <ChatInputContainer>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="medium"><EmoticonOutline /></IconButton>
          <IconButton size="medium"><Paperclip /></IconButton>
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
              },
              '& .MuiInputBase-input': {
                padding: 0
              }
            }}
            variant="outlined"
            size="small"
          />
          {inputValue.trim() ? (
            <IconButton color="primary" onClick={handleSend}>
              <Send />
            </IconButton>
          ) : (
            <IconButton>
              <Phone /> {/* Placeholder for Mic icon usually */}
            </IconButton>
          )}
        </Box>
      </ChatInputContainer>

      {/* Context Menu */}
      <MessageContextMenu
        message={contextMenu.message}
        anchorEl={contextMenu.anchorEl}
        onClose={handleCloseContextMenu}
        onReply={handleReply}
        onCopy={handleCopy}
        onReact={handleReact}
      />

      {/* Reaction Picker */}
      <ReactionPicker
        anchorEl={reactionPicker.anchorEl}
        onClose={handleCloseReactionPicker}
        onEmojiSelect={handleEmojiSelect}
      />

      {/* Snackbar for copy feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatWindow;
