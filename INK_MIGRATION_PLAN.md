# Future Ink Migration Guide

This document outlines the plan for migrating from neo-blessed to Ink when ready.

## When to Start Ink Migration

Consider starting when:
- neo-blessed has been stable for 1+ month
- You want to add complex new UI features
- You're comfortable with React patterns
- You have 2-4 weeks for migration work

## Phase 2 Preparation Checklist

### 1. Learning Phase (1 week)
- [ ] Study Ink documentation: https://github.com/vadimdemedes/ink
- [ ] Review Ink examples: https://github.com/vadimdemedes/ink/tree/master/examples
- [ ] Study real-time chat example: https://nico.fyi/blog/building-a-real-time-chat-app-with-ink-and-supabase
- [ ] Understand React basics (if needed)
- [ ] Play with Ink playground: https://ink-playground.netlify.app/

### 2. Prototype Phase (1 week)
- [ ] Set up parallel Ink development
- [ ] Create basic component structure
- [ ] Prototype ChatList component
- [ ] Prototype MessageList component
- [ ] Test Kitty graphics integration with Ink

### 3. Migration Phase (2 weeks)
- [ ] Migrate ChatList sidebar
- [ ] Migrate MessageInput
- [ ] Migrate MessageLog/Display
- [ ] Migrate StatusBar and QR display
- [ ] Integrate with existing WhatsApp client
- [ ] Full testing

### 4. Optimization Phase (1 week)
- [ ] Add React.memo optimizations
- [ ] Implement proper state management
- [ ] Performance profiling
- [ ] Final testing and deployment

## Ink Installation

When ready to start:

```bash
npm install ink react
npm install --save-dev @types/react  # If using TypeScript
```

## Proposed Component Structure

```
src/
├── components/
│   ├── App.jsx                  # Main app container
│   ├── ChatList.jsx             # Left sidebar with chats
│   ├── ChatWindow.jsx           # Main chat view container
│   ├── MessageList.jsx          # Message display area
│   ├── MessageItem.jsx          # Individual message
│   ├── MessageInput.jsx         # Input box at bottom
│   ├── StatusBar.jsx            # Status/notification bar
│   ├── QRCodeView.jsx           # QR code authentication
│   └── MediaViewer.jsx          # Image viewer component
├── hooks/
│   ├── useWhatsApp.js           # WhatsApp client hook
│   ├── useMessages.js           # Message state management
│   ├── useChats.js              # Chat list management
│   └── useKeyboard.js           # Keyboard shortcut handling
├── utils/
│   ├── formatters.js            # Time, text formatting
│   └── constants.js             # Theme, colors
├── client.js                    # WhatsApp client (unchanged)
└── image-viewer.js              # Kitty graphics (unchanged)
```

## Quick Start Example

```javascript
// src/components/App.jsx
import React from 'react';
import { Box } from 'ink';
import ChatList from './ChatList.jsx';
import ChatWindow from './ChatWindow.jsx';
import useWhatsApp from '../hooks/useWhatsApp.js';

const App = () => {
  const { chats, messages, currentChat, selectChat } = useWhatsApp();
  
  return (
    <Box flexDirection="row" height="100%">
      <ChatList 
        chats={chats}
        onSelect={selectChat}
        width="30%"
      />
      <ChatWindow
        chat={currentChat}
        messages={messages}
        width="70%"
      />
    </Box>
  );
};

export default App;
```

## Migration Strategy

### Approach: Incremental Component Migration

1. **Keep neo-blessed running** - Don't remove until Ink is fully tested
2. **Migrate one component at a time** - Start simple (StatusBar, ChatList)
3. **Test each component** before moving to next
4. **Use feature flags** to switch between neo-blessed and Ink
5. **Final cutover** only when all features working

### Example: Parallel Development

```javascript
// src/ui.js (existing)
// Keep this file for now

// src/ui-ink.jsx (new)
// Build Ink version separately

// index.js (modified)
const USE_INK = process.env.USE_INK === 'true';

if (USE_INK) {
  const InkUI = require('./src/ui-ink');
  // Use Ink version
} else {
  const TUI = require('./src/ui');
  // Use neo-blessed version
}
```

## Resources for Ink Migration

### Official Resources
- **GitHub**: https://github.com/vadimdemedes/ink
- **Documentation**: https://github.com/vadimdemedes/ink#readme
- **Examples**: https://github.com/vadimdemedes/ink/tree/master/examples
- **Testing Guide**: https://github.com/vadimdemedes/ink#testing

### Community Examples
- **Chat App**: https://nico.fyi/blog/building-a-real-time-chat-app-with-ink-and-supabase
- **GitHub Copilot CLI**: Uses Ink for interactive CLI
- **Gatsby CLI**: Uses Ink for build output
- **Cloudflare Wrangler**: Uses Ink for dev experience

### Helpful Ink Components
- **ink-text-input**: Input boxes - https://github.com/vadimdemedes/ink-text-input
- **ink-select-input**: Selection lists - https://github.com/vadimdemedes/ink-select-input
- **ink-spinner**: Loading indicators - https://github.com/vadimdemedes/ink-spinner
- **ink-box**: Enhanced boxes - https://github.com/sindresorhus/ink-box
- **ink-gradient**: Gradient text - https://github.com/sindresorhus/ink-gradient

## Key Differences to Plan For

### State Management
**neo-blessed**: Manual state tracking
```javascript
this.currentChat = chat;
this.currentMessages = [];
```

**Ink**: React hooks
```javascript
const [currentChat, setCurrentChat] = useState(null);
const [messages, setMessages] = useState([]);
```

### Rendering
**neo-blessed**: Imperative updates
```javascript
this.chatBox.setContent('New content');
this.screen.render();
```

**Ink**: Declarative JSX
```javascript
<Text>{content}</Text>
// React handles rendering automatically
```

### Layout
**neo-blessed**: Manual positioning
```javascript
box({ left: '30%', width: '70%', height: '100%' })
```

**Ink**: Flexbox
```javascript
<Box flexDirection="row" flexGrow={1}>
  <Box width="30%">...</Box>
  <Box flexGrow={1}>...</Box>
</Box>
```

## Performance Considerations

### Optimization Techniques for Ink

1. **Memoization**:
```javascript
const MessageItem = React.memo(({ message }) => {
  // Component won't re-render unless message changes
});
```

2. **useMemo for expensive calculations**:
```javascript
const formattedMessages = useMemo(
  () => messages.map(formatMessage),
  [messages]
);
```

3. **useCallback for event handlers**:
```javascript
const handleSelect = useCallback((chat) => {
  selectChat(chat);
}, [selectChat]);
```

## Testing Strategy

### Manual Testing
- Compare side-by-side with neo-blessed version
- Verify all keyboard shortcuts work
- Check mouse interaction
- Test with many messages (100+)
- Test with many chats (50+)

### Automated Testing
```javascript
import { render } from 'ink-testing-library';
import App from './components/App';

test('renders chat list', () => {
  const { lastFrame } = render(<App chats={mockChats} />);
  expect(lastFrame()).toContain('Chats');
});
```

## Timeline Estimate

| Phase | Duration | Effort Level |
|-------|----------|--------------|
| Learning | 1 week | Low |
| Prototype | 1 week | Medium |
| Migration | 2 weeks | High |
| Optimization | 1 week | Medium |
| **Total** | **4-5 weeks** | **Medium-High** |

*Can be done incrementally over longer period if working part-time*

## Decision Checklist

Start Ink migration when you can answer YES to:

- [ ] neo-blessed has been stable for 1+ month
- [ ] You understand React basics (components, hooks, state)
- [ ] You have 2-4 weeks (or equivalent) to dedicate
- [ ] Current features are working well
- [ ] You want to add complex new features that would benefit from components
- [ ] You're comfortable with potential bugs during migration

## Notes

- **Don't rush**: neo-blessed is stable, take time to learn Ink properly
- **Prototype first**: Build small proof-of-concept before full migration
- **Ask for help**: Ink community is helpful on GitHub discussions
- **Keep it simple**: Don't over-engineer, Ink makes things easier not harder

## Contact & Support

When you're ready to start:
1. Review this guide
2. Study Ink documentation
3. Build small prototype
4. Ask questions in Ink GitHub discussions
5. Start incremental migration

Good luck! The neo-blessed version will serve you well until you're ready.
