import React from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";

/**
 * MessageInput component
 * Text input for sending messages
 */
const MessageInput = ({ onSubmit, disabled }) => {
  const [value, setValue] = React.useState("");

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
      setValue("");
    }
  };

  // Listen for Enter key
  useInput((input, key) => {
    if (key.return && !disabled) {
      handleSubmit();
    }
  });

  return React.createElement(
    Box,
    {
      borderStyle: "single",
      borderColor: disabled ? "gray" : "yellow",
      paddingLeft: 1,
    },
    React.createElement(Text, { color: "yellow", bold: true }, "Type: "),
    React.createElement(TextInput, {
      value: value,
      onChange: setValue,
      placeholder: disabled ? "Select a chat first..." : "Type a message...",
      showCursor: !disabled,
    }),
  );
};

export default MessageInput;
