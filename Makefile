
# ZapTUI Makefile

.PHONY: all build install install-global uninstall clean run

all: build

build:
	@echo "Building ZapTUI..."
	cargo build --release
	cd whatsapp-service && npm install --silent

install:
	@./install.sh

install-global:
	@./install.sh --global

uninstall:
	@./scripts/uninstall.sh

clean:
	cargo clean
	rm -rf whatsapp-service/node_modules

run:
	./zaptui
