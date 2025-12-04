import { Box, Paper } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import ContactDrawer from "../components/ContactDrawer";
import ConversationList from "../components/ConversationList";
import { useConversationStore } from "../store/conversation.store";

const WhatsappInbox = () => {
  const { id } = useParams();
  const { setActiveConversationId } = useConversationStore();

  useEffect(() => {
    setActiveConversationId(id || null);
  }, [id, setActiveConversationId]);

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
