#!/bin/bash
# Evolance Team Setup
# Run this once on each team member's machine

set -e

echo "=== Evolance Team Setup ==="
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "Git is required. Install from https://git-scm.com"; exit 1; }

NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "Node.js 18+ required. You have $(node -v)."
  exit 1
fi

echo "Prerequisites OK (Node $(node -v), Git $(git --version | cut -d' ' -f3))"

# Install MCP server dependencies
echo ""
echo "Installing MCP server dependencies..."
cd "$(dirname "$0")"
npm install --prefix mcp-servers/supabase-mcp
npm install --prefix mcp-servers/clickup-mcp

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.template .env
  echo ""
  echo "Created .env from template."
  echo "IMPORTANT: Edit .env with your API keys before using Claude Code."
  echo "  open .env"
else
  echo ""
  echo ".env already exists, skipping."
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Edit .env with your API keys (ask Andrei for keys)"
echo "  2. Add env vars to your shell profile:"
echo "     echo 'source ~/evolance-team-setup/.env' >> ~/.zshrc"
echo "  3. Clone your project repos:"
echo "     git clone --recurse-submodules git@github.com:SELLERINSIDERS/<repo>.git ~/evolance/<repo>"
echo "  4. Open a project folder in VS Code and start working!"
