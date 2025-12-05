import React from "react";
import { Box, Text } from "ink";

/**
 * QRCodeView component
 * Displays QR code for WhatsApp authentication with enhanced styling
 */
const QRCodeView = ({ qrCode }) => {
  if (!qrCode) {
    return React.createElement(
      Box,
      { flexDirection: "column", alignItems: "center", padding: 2 },
      React.createElement(Text, { color: "yellow" }, "Waiting for QR code..."),
    );
  }

  return React.createElement(
    Box,
    { flexDirection: "column", alignItems: "center", padding: 1 },
    React.createElement(
      Box,
      {
        borderStyle: "round",
        borderColor: "green",
        padding: 1,
        flexDirection: "column",
      },
      React.createElement(
        Text,
        { color: "green", bold: true },
        "Scan QR Code to Login",
      ),
      React.createElement(
        Box,
        { marginTop: 1 },
        React.createElement(Text, null, qrCode),
      ),
    ),
    React.createElement(
      Box,
      { marginTop: 1, flexDirection: "column", alignItems: "center" },
      React.createElement(
        Text,
        { color: "cyan" },
        "📱 Open WhatsApp on your phone",
      ),
      React.createElement(
        Text,
        { color: "cyan" },
        "⚙️  Go to Settings > Linked Devices",
      ),
      React.createElement(Text, { color: "cyan" }, "📷 Scan this QR code"),
    ),
  );
};

export default QRCodeView;
