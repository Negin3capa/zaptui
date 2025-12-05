import React from "react";
import { Box, Text } from "ink";
import MessageItem from "./MessageItem.mjs";

/**
 * MessageList component
 * Displays message history for current chat
 */
const MessageList = ({ messages, currentChat, contactCache }) => {
  const chatName = currentChat?.name || "Select a chat";

  if (!currentChat) {
    return React.createElement(
      Box,
      {
        flexDirection: "column",
        borderStyle: "single",
        borderColor: "white",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      React.createElement(
        Text,
        { color: "gray" },
        "← Select a chat to start messaging",
      ),
    );
  }

  if (!messages || messages.length === 0) {
    return React.createElement(
      Box,
      {
        flexDirection: "column",
        borderStyle: "single",
        borderColor: "white",
        flexGrow: 1,
      },
      React.createElement(
        Box,
        { borderStyle: "bold", paddingLeft: 1 },
        React.createElement(
          Text,
          { color: "white", bold: true },
          ` ${chatName} `,
        ),
      ),
      React.createElement(
        Box,
        { flexGrow: 1, justifyContent: "center", alignItems: "center" },
        React.createElement(Text, { color: "gray" }, "Loading messages..."),
      ),
    );
  }

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "single",
      borderColor: "white",
      flexGrow: 1,
    },
    React.createElement(
      Box,
      { borderStyle: "bold", paddingLeft: 1 },
      React.createElement(
        Text,
        { color: "white", bold: true },
        ` ${chatName} `,
      ),
    ),
    React.createElement(
      Box,
      {
        flexDirection: "column",
        paddingLeft: 1,
        paddingRight: 1,
        overflowY: "auto",
      },
      messages.map((message, index) =>
        React.createElement(MessageItem, {
          key: message.id?._serialized || index,
          message: message,
          contactCache: contactCache,
        }),
      ),
    ),
  );
};

export default MessageList;
