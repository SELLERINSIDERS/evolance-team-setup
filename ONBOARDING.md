# Team Member Onboarding Guide

Step-by-step setup for new Evolance team members to start using Claude Code.

## Prerequisites

Before you start, you need:
1. A Mac or PC with VS Code installed
2. A GitHub account (create one at github.com if you don't have one)
3. API keys from Andrei (Supabase + ClickUp tokens, plus any role-specific keys)
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

Clone whichever repos you'll be working in. The `--recurse-submodules` flag is important — it pulls the shared knowledge base automatically.

**Andrei:**
```bash
mkdir -p ~/evolance
git clone --recurse-submodules https://github.com/SELLERINSIDERS/VSL-Video-Framework.git ~/evolance/vsl-video-framework
```

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

Replace `<your-name>` with: `andrei`, `olga`, `vitalii`, or `xeniya`

## Step 8: Open a project and start working

```bash
code ~/evolance/vsl-video-framework    # Andrei
code ~/evolance/meta-ads               # Olga
code ~/evolance/amazon                 # Vitalii
code ~/evolance/shopify                # Xeniya
```

In VS Code, Claude Code will automatically load:
- Your personal identity from `~/.claude/CLAUDE.md`
- The project instructions from `.claude/CLAUDE.md`
- Project-specific skills from `.claude/commands/`
- Shared knowledge and skills from `shared/` (products, brand, compliance, video skills)
- MCP tools (Supabase memory, ClickUp tasks)

## How to Use Skills

Type `/` in Claude Code to see available skills. Project-specific skills show up automatically.

**Examples:**
- In the meta-ads project: `/meta-ad-copy` to create Meta ad copy
- In the VSL Video Framework: `/vsl-production` to start or resume a video production
- In any project: `/compliance-checker` to check copy against FDA/FTC rules

## VSL Video Framework — Quick Start (Andrei)

Once you've opened `~/evolance/vsl-video-framework` in VS Code, just tell Claude what you want to make:

> "Start a new VSL for NightCap — magnesium glycinate sleep supplement, women 35-55, ancient Egypt angle, 3 min, 9:16"

Claude will automatically trigger `/vsl-production` and walk you through the full pipeline (intake → script → images → video → voiceover → sound design → final edit).

**To resume an interrupted production:**
> "Resume the NightCap VSL — we stopped at phase 8 image generation"

**Available video skills:**
- `/vsl-production` — Full pipeline orchestrator (start, resume, or crash recovery)
- `/cinematic-director` — Scene design and image prompts
- `/kling-video-workflow` — AI video generation via Kling
- `/nanobanana` — Image generation at scale
- `/sound-design` — SFX layer mapping
- `/video-editor` — EDL generation for Remotion
- `/remotion-audio` — Final audio mix

## How to Update Shared Knowledge

When the shared company brain gets updated, pull the latest:
```bash
cd ~/evolance/vsl-video-framework    # or any project
git submodule update --remote shared
git add shared && git commit -m "Update shared brain"
git push
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
- The skills live in `.claude/commands/` — check that folder exists in the project

**`/vsl-production` not triggering automatically?**
- Just type the command directly: `/vsl-production`
- Or describe what you want and Claude will pick it up

**Need help?**
- Ask Andrei or message in the team chat
