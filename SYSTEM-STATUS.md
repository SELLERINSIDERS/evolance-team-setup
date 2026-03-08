# Evolance Claude Code — Complete System Reference

*Last updated: 2026-03-08*

---

## What This System Is

Every team member uses Claude Code inside VS Code. Claude knows the company, the products, the rules, and has tools connected to ClickUp and Supabase — the same shared memory the Mac Mini agents use. When Olga works on Meta Ads, Claude already knows Evolance's brand, compliance rules, and any past decisions logged by anyone on the team.

---

## Architecture Overview

```
Your Machine (VS Code + Claude Code)
  ~/evolance-team-setup/          Shared MCP servers + setup scripts
  ~/evolance/<project>/           Project repo
    CLAUDE.md                     Project instructions
    .mcp.json                     Points to MCP servers
    .claude/skills/               Project-specific skills (discoverable with /)
    .claude/rules/                Auto-loaded rules (compliance, protocols)
    shared/                       Git submodule → shared-company-brain
      brand/                      Brand guidelines
      products/                   Product knowledge
      skills/                     Universal shared skills
      copy/                       FDA/FTC compliance reference
      protocols/                  Company operating rules

~/.claude/CLAUDE.md               Personal identity (who you are, your role)
```

**Shared infrastructure (same as Mac Mini agents):**
- Supabase — shared memory (events, decisions, learnings) across all agents and all people
- ClickUp — single source of truth for tasks

---

## GitHub Repos (SELLERINSIDERS org, all private)

| Repo | URL | Purpose | Who has access |
|------|-----|---------|----------------|
| `evolance-team-setup` | github.com/SELLERINSIDERS/evolance-team-setup | MCP servers, setup script, role templates, onboarding | All team members |
| `evolance-meta-ads` | github.com/SELLERINSIDERS/evolance-meta-ads | Meta/Facebook/Instagram advertising | Andrei, Olga |
| `evolance-amazon` | github.com/SELLERINSIDERS/evolance-amazon | Amazon PPC, listings, FBA | Andrei, Vitalii |
| `evolance-operations` | github.com/SELLERINSIDERS/evolance-operations | Business ops, inventory, financials | Andrei, Xeniya, Vitalii |
| `evolance-influencers` | github.com/SELLERINSIDERS/evolance-influencers | Influencer outreach, partnerships | Andrei, Olga |
| `evolance-shopify` | github.com/SELLERINSIDERS/evolance-shopify | Shopify DTC, Klaviyo email | Andrei, Xeniya |
| `shared-company-brain` | github.com/SELLERINSIDERS/shared-company-brain | Universal knowledge, brand, products, shared skills | All team members |

**Note:** `evolance-shopify` has a pending PR #2 with Claude Code setup. Merge it before Xeniya onboards.

---

## Skills in Each Project

When you open a project in VS Code and type `/`, these skills are immediately available:

### evolance-meta-ads
- `/meta-ad-copy` — Create Meta ad copy
- `/meta-ads-monitor` — Monitor ad performance
- `/calm-rest-fb-ad-copy` — CADENCE-specific ad copy
- `/meta-andromeda-research` — Competitor research
- `/facebook-app-setup` — Facebook API setup
- `/video-ads-creative-brief` — Video ad briefs

### evolance-amazon
- `/amazon-ppc` — PPC campaign management
- `/amazon-ads-api` — Amazon Ads API
- `/amazon-bulk-upload` — Bulk listing operations
- `/amazon-fba-shipment` — FBA shipments
- `/fba-workflow` — End-to-end FBA
- `/ppc` — General PPC strategy
- `/ppc-api-optimization` — API-driven optimization

### evolance-operations
- `/inventory-monitor` — Track inventory levels
- `/competitor-monitor` — Monitor competitor activity

### evolance-shopify
- `/shopify` — Shopify storefront management
- `/klaviyo` — Email flows and campaigns

### evolance-influencers
- `/influencer-research-daily` — Daily influencer discovery
- `/influencer-spreadsheet` — Tracking spreadsheets
- `/instagram-influencer-pipeline` — Full outreach pipeline

### Universal skills (available via shared/ in every project)
- `copywriting-bible`, `humanizer`, `compliance-checker`, `quality-gate`, `ralph-loop`, `workflow-orchestrator`, and 80+ more

---

## MCP Tools Available to Everyone

| Tool | What it does |
|------|-------------|
| `supabase_search_learnings` | Search past learnings across all agents |
| `supabase_search_events` | Search past work across all agents |
| `supabase_search_decisions` | Search past decisions |
| `supabase_log_event` | Log task completions and milestones |
| `supabase_log_learning` | Share a learning with the whole team |
| `supabase_log_decision` | Log a significant decision |
| `clickup_list_tasks` | See active ClickUp tasks |
| `clickup_get_task` | Get task details and comments |
| `clickup_update_task` | Update task status |
| `clickup_add_comment` | Add deliverable comment to task |
| `clickup_create_task` | Create new task |

---

## API Keys Each Person Needs

| Key | Andrei | Xeniya | Vitalii | Olga |
|-----|--------|--------|---------|------|
| SUPABASE_URL | ✓ | ✓ | ✓ | ✓ |
| SUPABASE_SERVICE_KEY | ✓ | ✓ | ✓ | ✓ |
| CLICKUP_API_TOKEN | ✓ | ✓ | ✓ | ✓ |
| KLAVIYO_API_KEY | ✓ | ✓ | — | ✓ |
| Amazon Ads credentials | ✓ | — | ✓ | — |

---

## Onboarding a Team Member (Step by Step)

### Before they start — Andrei does this:

**1. Get their GitHub username**
They create a free account at github.com and send you their username.

**2. Invite to org**
```bash
gh org invite <their-username> --org SELLERINSIDERS
```

**3. Grant repo access** (replace `<username>` with their actual GitHub username)

*For Xeniya:*
```bash
gh api repos/SELLERINSIDERS/evolance-team-setup/collaborators/<username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-shopify/collaborators/<username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-operations/collaborators/<username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/shared-company-brain/collaborators/<username> -X PUT -f permission=push
```

*For Vitalii:*
```bash
gh api repos/SELLERINSIDERS/evolance-team-setup/collaborators/<username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-amazon/collaborators/<username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-operations/collaborators/<username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/shared-company-brain/collaborators/<username> -X PUT -f permission=pull
```

*For Olga:*
```bash
gh api repos/SELLERINSIDERS/evolance-team-setup/collaborators/<username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-meta-ads/collaborators/<username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/evolance-influencers/collaborators/<username> -X PUT -f permission=push
gh api repos/SELLERINSIDERS/shared-company-brain/collaborators/<username> -X PUT -f permission=pull
```

**4. Share their API keys securely** (Signal, 1Password shared vault, or in-person — not Telegram plain text)

---

### The person does this themselves:

**Step 1 — Install prerequisites**

*Mac:*
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install git node
```

*PC:* Download Git from git-scm.com and Node.js from nodejs.org (LTS version).

**Step 2 — Install Claude Code**
- Open VS Code
- Extensions (Cmd+Shift+X) → search "Claude Code" → Install
- Sign in with a Claude account (claude.ai)

**Step 3 — Configure Git**
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

**Step 4 — Clone team setup and run setup script**
```bash
git clone https://github.com/SELLERINSIDERS/evolance-team-setup.git ~/evolance-team-setup
cd ~/evolance-team-setup
bash setup.sh
```

**Step 5 — Add API keys**
```bash
nano ~/evolance-team-setup/.env
# Fill in the keys Andrei gave you

# Then add to shell profile:
echo 'set -a && source ~/evolance-team-setup/.env && set +a' >> ~/.zshrc
source ~/.zshrc
```

**Step 6 — Clone project repos** (with `--recurse-submodules` — this is important)

*Xeniya:*
```bash
mkdir -p ~/evolance
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-shopify.git ~/evolance/shopify
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-operations.git ~/evolance/operations
```

*Vitalii:*
```bash
mkdir -p ~/evolance
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-amazon.git ~/evolance/amazon
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-operations.git ~/evolance/operations
```

*Olga:*
```bash
mkdir -p ~/evolance
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-meta-ads.git ~/evolance/meta-ads
git clone --recurse-submodules https://github.com/SELLERINSIDERS/evolance-influencers.git ~/evolance/influencers
```

**Step 7 — Set up personal identity**
```bash
mkdir -p ~/.claude
# Replace <name> with: xeniya, vitalii, or olga
cp ~/evolance-team-setup/roles/<name>/CLAUDE.md ~/.claude/CLAUDE.md
```

**Step 8 — Open project in VS Code**
```bash
code ~/evolance/meta-ads    # or whichever project
```

Claude Code will load automatically with full context: identity, project instructions, rules, skills, and MCP tools.

---

## Adding a Brand New Team Member (Future)

When a new person joins the company and needs Claude Code:

**1. Create their project repo** (if it doesn't exist):
```bash
# Create the repo structure locally first
mkdir -p ~/evolance/<project>/.claude/skills ~/evolance/<project>/.claude/rules

# Write CLAUDE.md, .mcp.json, .gitignore
# Copy relevant skills from shared-company-brain
# Copy rules from an existing project

# Init git and add shared brain submodule
cd ~/evolance/<project>
git init && git branch -m main
git submodule add https://github.com/SELLERINSIDERS/shared-company-brain.git shared
git add -A && git commit -m "Initial project setup"

# Create GitHub repo and push
gh repo create SELLERINSIDERS/evolance-<project> --private --source=. --push
```

**2. Create their role template** in `~/evolance-team-setup/roles/<name>/CLAUDE.md`:
```markdown
# Identity
You are assisting [Name], [Role] at Evolance Wellness.
[2-3 sentences about their focus areas and scope]

## Agent ID
When logging to Supabase, use `agent_id="<name>"`.

## Scope
- [Domain 1]
- [Domain 2]
- Escalate strategy decisions to Andrei
```

**3. Commit and push the role template:**
```bash
cd ~/evolance-team-setup
git add roles/<name>/CLAUDE.md
git commit -m "Add role template for <name>"
git push
```

**4. Grant GitHub and API access** (same steps as above, scoped to their repos).

**5. Send them this link:** https://github.com/SELLERINSIDERS/evolance-team-setup/blob/main/ONBOARDING.md

---

## Keeping the System Updated

**When shared knowledge changes** (new product, updated compliance rules, brand change):
- Update the file in `shared-company-brain` repo
- Commit and push
- Each person pulls the update: `git submodule update --remote shared` in any project

**When a project gets new skills:**
- Add the skill folder to `.claude/skills/` in the project repo
- Commit and push — everyone gets it on next `git pull`

**When someone learns something important:**
- Log to Supabase: `supabase_log_learning(agent_id="<name>", ...)`
- The whole team can search it: `supabase_search_learnings(query="topic")`

---

## Troubleshooting

**MCP tools not responding?**
- Check `~/evolance-team-setup/.env` has real keys (not placeholder text)
- Run `source ~/.zshrc` to reload env vars
- Restart VS Code

**Can't clone repos?**
- Make sure Andrei sent the GitHub org invitation and you accepted it
- Invitation URL: github.com/orgs/SELLERINSIDERS/invitation

**Skills not showing up when typing /?**
- Make sure you opened the project FOLDER in VS Code, not a single file
- The folder must contain a `.claude/skills/` directory

**Shared brain empty?**
- You forgot `--recurse-submodules` when cloning
- Fix: `git submodule update --init --recursive` inside the project folder

---

## Local File Paths (Andrei's machine)

| Path | What it is |
|------|-----------|
| `~/evolance-team-setup/` | MCP servers, setup, role templates |
| `~/evolance/meta-ads/` | Meta Ads project repo |
| `~/evolance/amazon/` | Amazon project repo |
| `~/evolance/operations/` | Operations project repo |
| `~/evolance/shopify/` | Shopify project repo |
| `~/evolance/influencers/` | Influencers project repo |
| `~/evolance-agents/agents/evan/` | Evan AI agent workspace |
| `~/evolance-agents/agents/maya/` | Maya AI agent workspace |
| `~/evolance-agents/agents/max/` | Max AI agent workspace |
| `~/.claude/CLAUDE.md` | Andrei's personal identity |
| `~/.claude/projects/.../memory/MEMORY.md` | Per-project memory files |
| `~/Documents/Evan's Workspace/shared-company-brain/` | Shared brain (original location) |
