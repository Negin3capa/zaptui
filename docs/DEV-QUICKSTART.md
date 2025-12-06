# 🚀 Quick Start: Development Workflow

## TL;DR

```bash
# RECOMMENDED: Multi-pane development mode
make dev-tmux

# Or simple 2-terminal mode
make dev              # Terminal 1: watch + build
./target/release/zaptui   # Terminal 2: run manually
```

---

## Why Can't I Auto-Run the TUI?

**TUI apps need direct terminal control.** When run through build watchers like cargo-watch, the terminal is already controlled, so the TUI can't:

- Capture keyboard input
- Render the interface properly
- Enter "raw mode"

This is a **fundamental limitation** of how TUI apps work, not a bug.

**Solution:** You must run the TUI manually after each build.

---

## Two Workflows

### 1. Quick & Simple (2 Terminals)

```bash
# Terminal 1
make dev
# Wait for: ━━━━ ✅ BUILD COMPLETE! ━━━━

# Terminal 2
./target/release/zaptui
```

### 2. Professional (Recommended)

```bash
make dev-tmux
```

You get:

```
┌─────────────────────────────────┐
│  Service Logs (top pane)        │
├─────────────────────────────────┤
│  Build Output (middle)          │
├─────────────────────────────────┤
│  Run App Here (bottom)          │
│  ./target/release/zaptui        │
└─────────────────────────────────┘
```

**Tmux controls:**

- `Ctrl+B` → arrows = Switch panes
- `Ctrl+B` → `d` = Detach (keeps running)
- `tmux attach -t zaptui-dev` = Reattach

---

## Full Documentation

- **Detailed guide:** `docs/development-workflow.md`
- **Mode comparison:** `docs/dev-modes-explained.md`
- **Quick reference:** `docs/dev-quick-ref.md`

---

## All Make Commands

```bash
make help          # Show all commands
make build         # Build release
make restart       # Quick rebuild
make dev           # Watch + build
make dev-tmux      # Multi-pane (recommended)
make watch-check   # Fast checking
```

---

**Most people should use: `make dev-tmux`** ⭐
