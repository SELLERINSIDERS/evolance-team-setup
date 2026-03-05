# Evolance Team Setup

Shared infrastructure for Claude Code across the Evolance team. Contains MCP servers and setup scripts that every team member needs.

## Quick Start

```bash
# 1. Clone this repo
git clone git@github.com:SELLERINSIDERS/evolance-team-setup.git ~/evolance-team-setup

# 2. Run setup
cd ~/evolance-team-setup && bash setup.sh

# 3. Add your API keys
nano .env

# 4. Source env vars in your shell
echo 'set -a && source ~/evolance-team-setup/.env && set +a' >> ~/.zshrc
source ~/.zshrc

# 5. Clone your project repos
git clone --recurse-submodules git@github.com:SELLERINSIDERS/evolance-meta-ads.git ~/evolance/meta-ads
# (or whichever repos you need)

# 6. Open in VS Code
code ~/evolance/meta-ads
```

## What's Here

```
evolance-team-setup/
  mcp-servers/
    supabase-mcp/     MCP server for shared memory (events, decisions, learnings)
    clickup-mcp/      MCP server for task management
  setup.sh            One-time setup script
  .env.template       API key template
```

## MCP Servers

These servers connect Claude Code to shared infrastructure. Every project repo's `.mcp.json` points to these servers.

| Server | Tools | Purpose |
|--------|-------|---------|
| supabase-mcp | log_event, search_learnings, log_decision, etc. | Shared agent memory |
| clickup-mcp | list_tasks, get_task, update_task, add_comment, create_task | Task management |

## Team Members

| Name | Role | Project Repos |
|------|------|--------------|
| Andrei | Founder/CEO | All repos |
| Xeniya | Co-owner | evolance-shopify, evolance-operations |
| Vitalii | Admin/Ops | evolance-amazon, evolance-operations |
| Olga | Marketing | evolance-meta-ads, evolance-influencers |

## How It All Fits Together

```
Your Machine
  ~/evolance-team-setup/          This repo (MCP servers + .env)
  ~/evolance/meta-ads/            Project repo (has CLAUDE.md + skills)
    shared/                       Git submodule -> shared-company-brain
    .claude/skills/               Project-specific skills
    .mcp.json                     Points to ~/evolance-team-setup/mcp-servers/
```

## Updating Shared Knowledge

Each project repo includes `shared-company-brain` as a git submodule at `shared/`. To get latest:

```bash
cd ~/evolance/meta-ads
git submodule update --remote shared
git add shared && git commit -m "Update shared brain"
```
