#!/usr/bin/env bash

# ZapTUI Launcher
# Simple wrapper to run the Rust binary from project root

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BINARY="$SCRIPT_DIR/zaptui-rust/target/release/zaptui"

if [ ! -f "$BINARY" ]; then
    echo "Error: ZapTUI binary not found at $BINARY"
    echo "Please build it first:"
    echo "  cd zaptui-rust && cargo build --release"
    exit 1
fi

# Run the binary
exec "$BINARY" "$@"
