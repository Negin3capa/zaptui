import { useState, useEffect } from "react";

/**
 * useWhatsApp hook
 * Manages WhatsApp client state and events
 */
export const useWhatsApp = (client) => {
  const [qr, setQr] = useState(null);
  const [ready, setReady] = useState(false);
  const [chats, setChats] = useState([]);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const handleQR = (qrData) => {
      setQr(qrData);
      setStatus("QR Code received - scan to login");
    };

    const handleReady = async () => {
      setReady(true);
      setQr(null);
      setStatus("WhatsApp Client is Ready!");

      // Load chats
      try {
        setStatus("Loading chats...");
        const loadedChats = await client.getChats();
        setChats(loadedChats);
        setStatus("Chats loaded.");
      } catch (error) {
        setStatus("Error loading chats: " + error.message);
      }
    };

    const handleAuthenticated = () => {
      setStatus("Authenticated successfully!");
    };

    const handleAuthFailure = (msg) => {
      setStatus(`Auth failure: ${msg}`);
    };

    client.on("qr", handleQR);
    client.on("ready", handleReady);
    client.on("authenticated", handleAuthenticated);
    client.on("auth_failure", handleAuthFailure);

    return () => {
      client.off("qr", handleQR);
      client.off("ready", handleReady);
      client.off("authenticated", handleAuthenticated);
      client.off("auth_failure", handleAuthFailure);
    };
  }, [client]);

  return { qr, ready, chats, status };
};
