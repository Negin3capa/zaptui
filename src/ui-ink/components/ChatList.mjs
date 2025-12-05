import React from "react";
import { Box, Text } from "ink";
import ChatListItem from "./ChatListItem.mjs";

/**
 * ChatList component
 * Sidebar displaying list of chats
 *
 * STRICT WIDTH: Container enforces exact width, no flex
 */
const ChatList = ({ chats, selectedIndex, onSelect }) => {
  // Fixed width for consistency - STRICT
  const CHAT_LIST_WIDTH = 30;
  const ITEM_MAX_WIDTH = CHAT_LIST_WIDTH - 2; // Account for borders

  if (!chats || chats.length === 0) {
    return React.createElement(
      Box,
      {
        flexDirection: "column",
        borderStyle: "single",
        borderColor: "green",
        width: CHAT_LIST_WIDTH,
        minWidth: CHAT_LIST_WIDTH,
        maxWidth: CHAT_LIST_WIDTH,
        flexShrink: 0,
        padding: 1,
      },
      React.createElement(Text, { color: "green", bold: true }, " Chats "),
      React.createElement(
        Text,
        { color: "gray", dimColor: true },
        "No chats yet...",
      ),
    );
  }

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "single",
      borderColor: "green",
      width: CHAT_LIST_WIDTH,
      minWidth: CHAT_LIST_WIDTH,
      maxWidth: CHAT_LIST_WIDTH,
      flexShrink: 0, // Never shrink
      overflowX: "hidden", // Hide any overflow
    },
    React.createElement(
      Box,
      { paddingLeft: 1 },
      React.createElement(
        Text,
        { color: "green", bold: true },
        "━━━ Chats ━━━",
      ),
    ),
    React.createElement(
      Box,
      {
        flexDirection: "column",
        width: ITEM_MAX_WIDTH,
      },
      chats.map((chat, index) =>
        React.createElement(ChatListItem, {
          key: chat.id?._serialized || index,
          chat: chat,
          isSelected: index === selectedIndex,
          onClick: () => onSelect && onSelect(chat, index),
          maxWidth: ITEM_MAX_WIDTH,
        }),
      ),
    ),
  );
};

export default ChatList;
