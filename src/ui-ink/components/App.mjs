import React from "react";
import { Box, useApp, useInput } from "ink";
import QRCodeView from "./QRCodeView.mjs";
import ChatList from "./ChatList.mjs";
import MessageList from "./MessageList.mjs";
import MessageInput from "./MessageInput.mjs";
import StatusBar from "./StatusBar.mjs";
import { useWhatsApp } from "../hooks/useWhatsApp.mjs";
import { useMessages } from "../hooks/useMessages.mjs";

/**
 * Main Ink application component
 * Replaces the neo-blessed TUI class
 */
const App = ({ client }) => {
  const { exit } = useApp();
  const { qr, ready, chats, status } = useWhatsApp(client);
  const [selectedChatIndex, setSelectedChatIndex] = React.useState(0);
  const [currentChat, setCurrentChat] = React.useState(null);
  const { messages, loading, contactCache } = useMessages(client, currentChat);

  // Handle Ctrl+C to exit
  useInput((input, key) => {
    if (key.ctrl && input === "c") {
      exit();
    }
  });

  // Handle chat selection
  const handleSelectChat = React.useCallback((chat, index) => {
    setSelectedChatIndex(index);
    setCurrentChat(chat);
  }, []);

  // Handle message send
  const handleSendMessage = React.useCallback(
    async (text) => {
      if (currentChat && text.trim()) {
        try {
          await client.sendMessage(currentChat.id._serialized, text);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    },
    [client, currentChat],
  );

  // Show QR code view if not ready
  if (!ready && qr) {
    return React.createElement(
      Box,
      { flexDirection: "column", height: "100%" },
      React.createElement(QRCodeView, { qrCode: qr }),
      React.createElement(StatusBar, { message: status, type: "info" }),
    );
  }

  // Show main chat interface
  return React.createElement(
    Box,
    { flexDirection: "column", height: "100%" },
    React.createElement(
      Box,
      { flexDirection: "row", flexGrow: 1 },
      React.createElement(ChatList, {
        chats: chats,
        selectedIndex: selectedChatIndex,
        onSelect: handleSelectChat,
      }),
      React.createElement(
        Box,
        { flexDirection: "column", flexGrow: 1 },
        React.createElement(MessageList, {
          messages: messages,
          currentChat: currentChat,
          contactCache: contactCache,
        }),
        React.createElement(MessageInput, {
          onSubmit: handleSendMessage,
          disabled: !currentChat,
        }),
      ),
    ),
    React.createElement(StatusBar, { message: status, type: "success" }),
  );
};

export default App;
