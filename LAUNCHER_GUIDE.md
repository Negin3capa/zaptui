# Easy Launch Methods for ZapTUI

## Quick Start

You now have **3 ways** to launch ZapTUI:

### Method 1: Global Command (Recommended)
After installing globally, run from anywhere:
```bash
zaptui
```

### Method 2: NPM Script
From the project directory:
```bash
npm run zaptui
```

### Method 3: Direct Execution
From the project directory:
```bash
./bin/zaptui
```

---

## Installation

### Option A: Global Installation (Like spotify_player)

Install globally to run `zaptui` from anywhere:

```bash
# From the project directory
npm link

# Or install globally
npm install -g .
```

Now you can run from any directory:
```bash
zaptui
```

### Option B: Local Usage (Like ./discordo)

Just use the executable directly:
```bash
cd /home/edy/zap-cli-1
./bin/zaptui
```

Or create a symlink in your PATH:
```bash
# Create symlink in ~/.local/bin (make sure it's in your PATH)
ln -s /home/edy/zap-cli-1/bin/zaptui ~/.local/bin/zaptui

# Now run from anywhere
zaptui
```

---

## Uninstallation

### If installed globally with npm link:
```bash
npm unlink -g zaptui
```

### If installed globally with npm install:
```bash
npm uninstall -g zap-cli
```

### If using symlink:
```bash
rm ~/.local/bin/zaptui
```

---

## Configuration

Make sure you have `config.json` in the project directory:
```bash
cd /home/edy/zap-cli-1
cp config.example.json config.json
```

---

## Troubleshooting

### "zaptui: command not found"

**If using npm link:**
```bash
# Check if npm global bin is in PATH
npm config get prefix
# Should show something like /usr/local or ~/.npm-global

# Add to PATH if needed (add to ~/.bashrc or ~/.zshrc)
export PATH="$(npm config get prefix)/bin:$PATH"
```

**If using symlink:**
```bash
# Make sure ~/.local/bin is in PATH
echo $PATH | grep ".local/bin"

# If not, add to ~/.bashrc or ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

### Permission Denied

```bash
chmod +x /home/edy/zap-cli-1/bin/zaptui
```

---

## Usage Examples

### Launch ZapTUI
```bash
zaptui
```

### Check if command is available
```bash
which zaptui
```

### Run with specific Node version
```bash
node /home/edy/zap-cli-1/bin/zaptui
```

---

## What Was Added

### 1. Executable Script
**File**: `bin/zaptui`
- Shebang for direct execution
- Spawns Node.js process
- Inherits stdio for proper terminal interaction

### 2. Package.json Updates
- Added `bin` entry for global command
- Added `zaptui` npm script

### 3. File Permissions
- Made `bin/zaptui` executable

---

## Comparison with Similar Tools

| Tool | Command | Method |
|------|---------|--------|
| **spotify_player** | `spotify_player` | Global install |
| **discordo** | `./discordo` | Local executable |
| **ZapTUI** | `zaptui` | Both supported! |

---

## Recommended Setup

For the best experience (like spotify_player):

```bash
# 1. Install globally
cd /home/edy/zap-cli-1
npm link

# 2. Create config
cp config.example.json config.json

# 3. Run from anywhere
cd ~
zaptui
```

---

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `bin/zaptui` | Created | Executable launcher script |
| `package.json` | Modified | Added bin entry and script |

---

Enjoy your easy-to-launch ZapTUI! 🚀
