# Blessed Rendering Optimizations Applied

## Date: December 4, 2025

## Changes Summary

Applied comprehensive blessed rendering optimizations to fix visual glitches, flickering, and tiling window manager compatibility issues.

---

## Optimizations Applied

### 1. Screen Configuration Enhancements

**File**: [`src/ui.js:22-38`](file:///home/edy/zap-cli-1/src/ui.js#L22-L38)

```javascript
this.screen = blessed.screen({
    smartCSR: true,
    fastCSR: true,        // ✅ NEW: Faster rendering optimization
    useBCE: true,         // ✅ NEW: Back-color-erase optimization
    resizeTimeout: 300,   // ✅ NEW: Debounce resize events (tiling WM)
    title: 'Zap CLI',
    fullUnicode: true,
    forceUnicode: true,   // ✅ NEW: Force unicode rendering
    dockBorders: true,
    cursor: {             // ✅ NEW: Explicit cursor configuration
        artificial: true,
        shape: 'line',
        blink: true,
        color: null
    }
});
```

**Benefits**:
- `fastCSR`: Faster Change Scroll Region rendering
- `useBCE`: Back-color-erase optimizations for better performance
- `resizeTimeout: 300ms`: Debounces resize events (critical for tiling WMs)
- `forceUnicode`: Ensures proper unicode character rendering
- `cursor` config: Explicit cursor behavior

---

### 2. Render Debouncing

**File**: [`src/ui.js:40-48`](file:///home/edy/zap-cli-1/src/ui.js#L40-L48)

**Added new method**:
```javascript
// Debounced render method to prevent flickering
render() {
    if (this.renderScheduled) return;
    
    this.renderScheduled = true;
    setImmediate(() => {
        this.screen.render();
        this.renderScheduled = false;
    });
}
```

**Replaced 10 instances** of `this.screen.render()` with `this.render()`:
- Line 37: Constructor
- Line 206: Message input
- Line 232: Log function
- Line 239: QR display
- Line 270: setChats
- Line 293: selectChat (loading)
- Line 309: selectChat (loaded)
- Line 383: appendMessage
- Line 430: refreshChatBox
- Line 452: viewMedia restore

**Benefits**:
- Prevents multiple rapid renders causing flickering
- Uses `setImmediate()` to batch render calls
- Reduces CPU usage from excessive redraws

---

### 3. listtable Configuration Improvements

**File**: [`src/ui.js:100-128`](file:///home/edy/zap-cli-1/src/ui.js#L100-L128)

```diff
  this.chatBox = blessed.listtable({
      // ... existing config
      noCellBorders: true,
+     interactive: false,    // ✅ NEW: Reduce interaction overhead
-     data: null
+     data: [['', '']]       // ✅ FIXED: Start with empty data, not null
  });
```

**Benefits**:
- `interactive: false`: Reduces rendering overhead
- `data: [['', '']]`: Prevents null initialization issues

---

### 4. Improved Resize Handler

**File**: [`src/ui.js:176-182`](file:///home/edy/zap-cli-1/src/ui.js#L176-L182)

```diff
  this.screen.on('resize', () => {
-     this.setChats(this.chats);
-     this.screen.render();
+     // resizeTimeout in screen config handles debouncing
+     if (this.chats && this.chats.length > 0) {
+         this.setChats(this.chats);
+     }
+     // Don't call render here - resizeTimeout handles it automatically
  });
```

**Benefits**:
- Relies on `resizeTimeout` for debouncing
- Adds safety check for chats existence
- Prevents double-rendering

---

## Expected Improvements

### Visual Stability
- ✅ Reduced flickering during updates
- ✅ Smoother rendering transitions
- ✅ Better border rendering
- ✅ Cleaner text display

### Tiling Window Manager Compatibility
- ✅ Proper resize event handling
- ✅ No rapid redraw flickering
- ✅ Stable rendering during window tiling/untiling
- ✅ Better handling of rapid dimension changes

### Performance
- ✅ Reduced CPU usage from fewer renders
- ✅ Batched render calls
- ✅ Optimized screen updates
- ✅ Faster overall responsiveness

---

## Testing Instructions

### 1. Basic Functionality Test
```bash
npm start
```
- Verify app launches without errors
- Check UI renders cleanly
- Verify borders are intact
- Check text alignment

### 2. Tiling Window Manager Test
- Tile/untile the window multiple times
- Resize rapidly
- Check for flickering or artifacts
- Verify content adapts properly

### 3. Message Flow Test
- Send/receive multiple messages
- Check for smooth rendering
- Verify no flickering during updates
- Test scrolling behavior

### 4. Terminal Size Test
- Test with small terminal (80x24)
- Test with large terminal (200x50)
- Resize while app is running
- Check responsiveness

---

## Changes Summary

| File | Lines Modified | Changes |
|------|----------------|---------|
| `src/ui.js` | ~30 lines | Screen config, render method, 10 render() replacements, listtable config, resize handler |

---

## Rollback Instructions

If issues arise:

```bash
# Revert changes
git checkout src/ui.js

# Or manually:
# 1. Remove new screen config flags
# 2. Remove render() method
# 3. Change all this.render() back to this.screen.render()
# 4. Revert listtable config
# 5. Revert resize handler
```

---

## Additional Tips for Tiling WMs

### Terminal Emulator Recommendations
1. **Kitty** - Best blessed support
2. **Alacritty** - Good performance
3. **Avoid** gnome-terminal (known blessed issues)

### Environment Variables
```bash
# Ensure proper TERM setting
export TERM=xterm-256color

# Or for kitty:
export TERM=xterm-kitty
```

### Compositor
If still experiencing issues, try temporarily disabling compositor:
```bash
killall picom  # or compton
```

---

## Next Steps

1. **Test thoroughly** with your tiling WM setup
2. **Report specific issues** if they persist
3. **Try different terminal emulators** if problems continue
4. **Consider Ink migration** if blessed issues are fundamental

---

## Summary

✅ **Optimizations Applied Successfully**

- Screen rendering optimized with 5 new flags
- Render debouncing implemented (10 replacements)
- listtable configuration improved
- Resize handler optimized for tiling WMs
- All syntax checks passed

The application should now have significantly better rendering stability, especially in tiling window manager environments like Pop OS.
