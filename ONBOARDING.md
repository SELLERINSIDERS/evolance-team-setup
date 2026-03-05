# Team Member Onboarding Guide

Step-by-step setup for new Evolance team members to start using Claude Code.

## Prerequisites

Before you start, you need:
1. A Mac or PC with VS Code installed
2. A GitHub account (create one at github.com if you don't have one)
3. API keys from Andrei (Supabase + ClickUp tokens)
4. Invitation to the SELLERINSIDERS GitHub organization (Andrei will send this)

## Step 1: Install Claude Code

1. Open VS Code
2. Go to Extensions (Cmd+Shift+X on Mac)
3. Search for "Claude Code"
4. Install the extension by Anthropic
5. Restart VS Code
6. You'll need a Claude account — sign up at claude.ai if you don't have one

## Step 2: Install Git and Node.js

**Mac:**
```bash
# Install Homebrew (if you don't have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Git and Node.js
brew install git node
```

**PC:**
- Git: download from https://git-scm.com
- Node.js: download from https://nodejs.org (LTS version)

## Step 3: Configure Git with your GitHub account

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

## Step 4: Clone the team setup repo

```bash
git clone https://github.com/SELLERINSIDERS/evolance-team-setup.git ~/evolance-team-setup
cd ~/evolance-team-setup
bash setup.sh
```

This installs the MCP server dependencies.

## Step 5: Add your API keys

Edit `~/evolance-team-setup/.env` with the keys Andrei gave you:
```bash
nano ~/evolance-team-setup/.env
```

Then add them to your shell so they load automatically:
```bash
echo 'set -a && source ~/evolance-team-setup/.env && set +a' >> ~/.zshrc
source ~/.zshrc
```

## Step 6: Clone your project repos

Clone whichever repos you'll be working in. The `--recurse-submodules` flag is important — it pulls the shared knowledge base.

**Olga:**
```bash
mkdir -p ~/evolance
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-meta-ads.git ~/evolance/meta-ads
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-influencers.git ~/evolance/influencers
```

**Vitalii:**
```bash
mkdir -p ~/evolance
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-amazon.git ~/evolance/amazon
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-operations.git ~/evolance/operations
```

**Xeniya:**
```bash
mkdir -p ~/evolance
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-shopify.git ~/evolance/shopify
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-operations.git ~/evolance/operations
```

## Step 7: Set up your personal identity

Copy your role template to your Claude Code config:
```bash
mkdir -p ~/.claude
cp ~/evolance-team-setup/roles/<your-name>/CLAUDE.md ~/.claude/CLAUDE.md
```

Replace `<your-name>` with: `olga`, `vitalii`, or `xeniya`

## Step 8: Open a project and start working

```bash
code ~/evolance/meta-ads    # or whichever project
```

In VS Code, Claude Code will automatically load:
- Your personal identity from `~/.claude/CLAUDE.md`
- The project instructions from `CLAUDE.md`
- Company rules from `.claude/rules/`
- Project-specific skills from `.claude/skills/`
- Shared knowledge from `shared/` (products, brand, compliance)
- MCP tools (Supabase memory, ClickUp tasks)

## How to Use Skills

Type `/` in Claude Code to see available skills. Project-specific skills show up automatically.

Example: In the meta-ads project, type `/meta-ad-copy` to use the Meta ad copy skill.

## How to Update Shared Knowledge

When the shared company brain gets updated, pull the latest:
```bash
cd ~/evolance/meta-ads     # or any project
git submodule update --remote shared
```

## Troubleshooting

**MCP tools not working?**
- Check that your `.env` has real API keys (not placeholder values)
- Run `source ~/.zshrc` to reload env vars
- Restart VS Code

**Can't clone repos?**
- Make sure Andrei has invited you to the SELLERINSIDERS GitHub org
- Accept the invitation in your email or at github.com/orgs/SELLERINSIDERS/invitation

**Skills not showing up?**
- Make sure you opened the project FOLDER in VS Code (File > Open Folder), not a single file
- Check that `.claude/skills/` exists in the project directory

**Need help?**
- Ask Andrei or message in the team chat
