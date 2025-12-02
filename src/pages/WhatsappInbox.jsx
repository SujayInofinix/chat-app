import React, { useEffect } from "react";
import { Box, Paper } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ConversationList from "../components/ConversationList";
import ChatWindow from "../components/ChatWindow";
import ContactDrawer from "../components/ContactDrawer";
import { useChatStore } from "../store/useChatStore";

const WhatsappInbox = () => {
  const { id } = useParams();
  const { selectConversation, isDrawerOpen } = useChatStore();

  useEffect(() => {
    selectConversation(id || null);
  }, [id, selectConversation]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 1400,
          height: "calc(100vh - 32px)",
          display: "flex",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        {/* Left Panel: Conversation List */}
        <Box sx={{ width: 320, flexShrink: 0 }}>
          <ConversationList />
        </Box>

        {/* Center Panel: Chat Window */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <ChatWindow />
        </Box>

        {/* Right Panel: Contact Drawer */}
        <Box sx={{ flexShrink: 0 }}>
          <ContactDrawer />
        </Box>
      </Paper>
    </Box>
  );
};

export default WhatsappInbox;
