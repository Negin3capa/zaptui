# Chat Loading Timeout Fix

## Problem

The application was experiencing **very long load times** (often resulting in timeouts) when trying to load chats immediately after authentication. However, quitting and restarting the application would work fine.

## Root Cause

After authentication, WhatsApp Web needs to perform an **initial sync** of all chats and contacts. This sync can take a very long time (3-5+ minutes) when you have many contacts/groups. The issue was:

1. **Timeout too short**: The `get_chats()` request had a 120-second (2 minute) timeout
2. **Poor user feedback**: The loading message didn't explain the potential long wait
3. **Silent failures**: When the timeout occurred, errors weren't properly communicated to the user
4. **No recovery**: The app would get stuck in loading state with no way to retry

## Why It Worked on Second Launch

When you quit and restart the application:

- WhatsApp Web session is already initialized
- Chat data is cached locally by the WhatsApp backend
- The `getChats()` call is much faster (seconds instead of minutes)

## The Fix

### 1. **Increased Timeout** (`src/whatsapp/client.rs`)

```rust
// Changed from 120 to 300 seconds (5 minutes)
pub async fn get_chats(&self) -> Result<Vec<Chat>> {
    let result = self.request_with_timeout("getChats", json!({}), 300).await?;
    // ...
}
```

### 2. **Better User Feedback** (`src/ui/app.rs`)

```rust
WhatsAppEvent::Ready => {
    // Clearer message about the potential wait time
    self.status_message = "Syncing chats... First sync after login can take 3-5 minutes with many contacts".to_string();
    // ...
}
```

### 3. **Proper Error Handling**

- Added new `WhatsAppEvent::Error(String)` event type
- Errors from chat loading are now properly displayed to the user
- App no longer gets stuck in loading state on failure

### 4. **Diagnostic Logging** (`whatsapp-service/server.js`)

```javascript
async getChats() {
    console.log("getChats called - starting chat sync...");
    const startTime = Date.now();
    const chats = await this.client.getChats();
    const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`Found ${chats.length} chats (took ${elapsedSeconds}s)`);
    // ...
}
```

## Expected Behavior Now

### First Login (After QR Code Scan)

1. You scan the QR code
2. Authentication completes
3. Status shows: "Syncing chats... First sync after login can take 3-5 minutes with many contacts"
4. **Wait patiently** - this WILL take several minutes on first sync
5. Once complete, chats will load and you can use the app normally

### Second Launch (Already Authenticated)

1. App starts up
2. Connects to WhatsApp service
3. Chats load quickly (within seconds) because they're already synced

## Additional Notes

- The 5-minute timeout should be sufficient for most users
- If you have an extremely large number of chats (1000+), you might still hit the timeout
- In that case, simply restart the app - it will work on the second try
- The backend service logs now show exactly how long chat loading takes, which helps diagnose issues

## Testing Recommendations

1. **Clean test**: Remove authentication data and test from scratch:

   ```bash
   rm -rf ~/.wwebjs_auth
   ./zaptui
   ```

2. **Monitor logs**: Watch the backend service logs to see timing:

   ```bash
   # In one terminal
   cd whatsapp-service && npm start

   # Watch for messages like:
   # "getChats called - starting chat sync..."
   # "Found 234 chats (took 187.4s)"
   ```

3. **Be patient**: The first sync really does take several minutes - this is normal WhatsApp Web behavior, not a bug!
