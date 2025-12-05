import { useState, useEffect, useRef } from "react";

/**
 * useMessages hook
 * Manages messages for the current chat
 */
export const useMessages = (client, currentChat) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const contactCacheRef = useRef(new Map());

  // Load messages when chat changes
  useEffect(() => {
    if (!currentChat) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      setLoading(true);
      try {
        const msgs = await currentChat.fetchMessages({ limit: 20 });

        // Pre-resolve contact names
        for (const msg of msgs) {
          if (!msg.fromMe) {
            const senderId = msg.author || msg.from;
            if (!contactCacheRef.current.has(senderId)) {
              try {
                const contact = await msg.getContact();
                const name =
                  contact.pushname || contact.name || contact.number || "User";
                contactCacheRef.current.set(senderId, name);
              } catch (e) {
                // Fallback
                const name = msg._data?.notifyName || senderId.split("@")[0];
                contactCacheRef.current.set(senderId, name);
              }
            }
          }
        }

        setMessages(msgs);
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [currentChat]);

  // Listen for new messages
  useEffect(() => {
    if (!currentChat || !client) return;

    const handleMessage = (msg) => {
      if (
        msg.id.remote === currentChat.id._serialized ||
        (msg.fromMe && msg.to === currentChat.id._serialized)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    client.on("message", handleMessage);
    client.on("message_create", handleMessage);

    return () => {
      client.off("message", handleMessage);
      client.off("message_create", handleMessage);
    };
  }, [client, currentChat]);

  return { messages, loading, contactCache: contactCacheRef.current };
};
