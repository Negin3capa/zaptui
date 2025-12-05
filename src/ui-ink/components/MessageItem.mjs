import React from "react";
import { Box, Text } from "ink";
import { formatTimestamp } from "../utils/formatters.mjs";

/**
 * MessageItem component
 * Individual message display
 *
 * Updated to use formatTimestamp utility
 */
const MessageItem = ({ message, contactCache }) => {
  const timestamp = formatTimestamp(message.timestamp);

  let sender = "User";
  let senderColor = "green";

  if (message.fromMe) {
    sender = "Me";
    senderColor = "white";
  } else {
    const senderId = message.author || message.from;
    if (contactCache && contactCache.has(senderId)) {
      sender = contactCache.get(senderId);
    }
  }

  let content = message.body || "";

  // Escape and strip zero-width characters
  if (content) {
    content = content.replace(/[\u200B-\u200D\uFEFF]/g, "");
  }

  if (message.hasMedia) {
    content = `[MEDIA: ${message.type}] (Right-click to view)`;
  }

  return React.createElement(
    Box,
    { flexDirection: "row", marginBottom: 0 },
    React.createElement(Text, { color: "gray" }, `${timestamp} `),
    React.createElement(
      Text,
      { color: senderColor, bold: true },
      `${sender}: `,
    ),
    React.createElement(Text, { color: "white" }, content),
  );
};

export default MessageItem;
