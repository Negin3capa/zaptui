# Real-Time Chat Synchronization

## Overview

ZapTUI now features **real-time chat synchronization** that keeps your conversations constantly updated as you use the application. This ensures you never miss a message and always see the most recent activity.

## Features Implemented

### 1. **Automatic Chat List Sorting** 📊

- Chats are automatically sorted by timestamp (most recent first)
- When a new message arrives, the chat jumps to the top of the list
- Your cursor selection is preserved when chats reorder
- Works exactly like WhatsApp Web/Desktop

**Implementation:**

- Initial sort when chats load (`ChatsLoaded` event)
- Real-time re-sort when new messages arrive (`MessageReceived` event)
- Smart selection preservation after sorting

### 2. **Real-Time Message Updates** ⚡

When a new message is received (either from you or someone else):

- Message is immediately added to the chat
- Chat's "last message" is updated
- Timestamp is updated to current time
- Unread count increments for incoming messages
- Chat list re-sorts to bring active chat to the top

**Code Location:** `src/ui/app.rs` - `MessageReceived` event handler

### 3. **Periodic Background Sync** 🔄

A background task runs every **30 seconds** to refresh messages in the currently active chat:

- Ensures we catch any messages missed by real-time events
- Happens silently in the background
- Only syncs the current chat (efficient)
- Logs any sync failures for debugging

**Why this is needed:**

- Network issues might cause missed real-time events
- WhatsApp Web sometimes has sync delays
- Provides a safety net for 100% message reliability

**Code Location:** `src/main.rs` - Main event loop with `sync_interval`

### 4. **Smart Message Caching** 💾

- Messages are cached per-chat in memory
- First load fetches from server
- Subsequent views use cache (instant)
- Cache is updated with new messages
- Periodic sync refreshes the active chat

## How It Works

### Event Flow

```text
1. User receives message
   ↓
2. WhatsApp service broadcasts MessageReceived event
   ↓
3. TUI receives event and:
   - Adds message to cache
   - Updates chat metadata (last message, timestamp)
   - Increments unread count if not from user
   - Re-sorts chat list
   - Preserves user's cursor selection
   ↓
4. UI automatically re-renders with updates
```

### Periodic Sync Flow

```text
Every 30 seconds:
   ↓
1. Check if we have an active chat
   ↓
2. Fetch latest 50 messages for that chat
   ↓
3. Compare with cached messages
   ↓
4. Update cache if there are new messages
   ↓
5. Log the number of new messages (if any)
```

## User Experience

### What You'll See

1. **Active Conversations Rise:** When you send or receive a message, that chat immediately moves to the top
2. **Always Up-to-Date:** Messages appear in real-time without manual refresh
3. **Unread Counts:** Automatically incremented when new messages arrive
4. **Smooth Operation:** All updates happen seamlessly in the background

### Keyboard Behavior

- Chat list navigation (j/k or arrows) works normally during updates
- Your selection is preserved when chats reorder
- Fast typing is never interrupted by sync operations

## Performance Considerations

### Optimizations

1. **Efficient Sorting:** Only sorts when needed (new message or initial load)
2. **Targeted Sync:** Only refreshes the current chat, not all chats
3. **Smart Caching:** Messages are fetched once and cached
4. **Background Operations:** All sync happens async, never blocks UI

### Resource Usage

- **Memory:** O(n) for messages, where n = number of messages cached
- **Network:** Initial chat load + periodic sync (1 request per 30s)
- **CPU:** Minimal - just sorting chat list (typically < 100 items)

## Configuration

### Sync Interval

Default: 30 seconds

To change, edit `src/main.rs`:

```rust
// Change the duration here
let mut sync_interval = tokio::time::interval(tokio::time::Duration::from_secs(30));
```

Recommended values:

- **10-30 seconds:** More responsive, higher bandwidth
- **30-60 seconds:** Balanced (default)
- **60-120 seconds:** Lower bandwidth, slightly less responsive

### Message Fetch Limit

Default: 50 messages per chat

To change, edit `src/whatsapp/client.rs` or `src/ui/app.rs` where `get_messages` is called:

```rust
// Change limit here
client.get_messages(&chat_id, 50).await
```

## Debugging

### Logs to Watch

```bash
# Messages received in real-time
"Received message in chat <chat_id>"

# Periodic sync activity
"Refreshing messages for current chat: <chat_id>"
"Refreshed X new messages"

# Warnings if something fails
"Periodic sync failed: <error>"
"Failed to refresh messages: <error>"
```

### Testing Real-Time Updates

1. Open ZapTUI
2. Send yourself a message from another device
3. Watch it appear instantly in the TUI
4. Notice the chat moves to the top
5. Check logs for "Received message" entry

### Testing Periodic Sync

1. Open ZapTUI and select a chat
2. Send a message from another device
3. Wait up to 30 seconds
4. Check logs for "Refreshing messages" entry
5. Message should appear even if real-time event was missed

## Future Enhancements

### Potential Additions

- [ ] Visual indicator for "syncing" state
- [ ] Configurable sync interval via config file
- [ ] Sync all chats periodically (not just current)
- [ ] Typing indicators
- [ ] Online/offline status
- [ ] Message read receipts
- [ ] Group chat participant updates

## Technical Details

### Modified Files

1. **src/ui/app.rs**
   - Added chat sorting in `ChatsLoaded` handler
   - Enhanced `MessageReceived` handler with re-sorting and selection preservation
   - Added `refresh_current_chat_messages()` method

2. **src/main.rs**
   - Added periodic sync timer to main event loop
   - Integrated sync with tokio::select! macro

3. **src/whatsapp/types.rs**
   - Added `Error` event type for better error handling

4. **src/whatsapp/client.rs**
   - Increased timeout for `get_chats()` to 300 seconds

### Dependencies

- `tokio::time::interval` for periodic sync
- `tokio::select!` for concurrent event handling
- Standard Rust sorting algorithms

## Conclusion

Your chats now stay synchronized in real-time! The combination of event-driven updates and periodic syncing ensures you never miss a message, while smart caching and efficient sorting keep the app responsive and smooth.
