import React from "react";
import { Box, Text } from "ink";

/**
 * StatusBar component
 * Displays system messages and connection status
 */
const StatusBar = ({ message, type = "info" }) => {
  const colors = {
    info: "white",
    success: "green",
    warning: "yellow",
    error: "red",
  };

  const color = colors[type] || colors.info;

  return React.createElement(
    Box,
    {
      borderStyle: "single",
      borderColor: color,
      padding: 1,
    },
    React.createElement(Text, { color: color, bold: true }, message || "Ready"),
  );
};

export default StatusBar;
