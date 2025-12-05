import React from "react";
import { Box, Text } from "ink";
import { formatToWidth } from "../utils/formatters.mjs";

/**
 * ChatListItem component
 * Individual chat item in the sidebar
 *
 * STRICT WIDTH ENFORCEMENT: Uses Text wrap="truncate-end" and Box width
 */
const ChatListItem = ({ chat, isSelected, onClick, maxWidth = 20 }) => {
  const rawName = chat.name || chat.id?.user || "Unknown";

  // Format name to exact width to prevent border shifting
  // Reserve 2 chars for indicator ("▶" or " ")
  const indicatorWidth = 2;
  const nameWidth = maxWidth - indicatorWidth;
  const formattedName = formatToWidth(rawName, nameWidth);

  const bgColor = isSelected ? "green" : undefined;
  const fgColor = isSelected ? "black" : "white";
  const indicator = isSelected ? "▶" : " ";

  return React.createElement(
    Box,
    {
      width: maxWidth,
      flexShrink: 0, // Prevent shrinking
    },
    React.createElement(
      Text,
      {
        color: fgColor,
        bold: isSelected,
        wrap: "truncate-end", // Force truncation
      },
      indicator + " " + formattedName,
    ),
  );
};

export default ChatListItem;
