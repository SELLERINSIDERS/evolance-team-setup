# Evolance Supabase MCP Server

MCP server that gives Claude Code access to the shared agent memory database (Supabase).

**Andrei's Mac only.** It needs the owner's Supabase secret key. Teammates use their own shared-memory token (shared-company-brain `tools/evolance-memory`) instead.

## Tools Provided

| Tool | Description |
|------|-------------|
| `supabase_log_event` | Log agent events (task completions, milestones, errors) |
| `supabase_query_events` | Query recent events with time/agent/type filters |
| `supabase_log_decision` | Log significant decisions with reasoning |
| `supabase_query_decisions` | Query past decisions by domain/agent |
| `supabase_log_learning` | Log learnings for cross-agent knowledge sharing |
| `supabase_search_learnings` | Search learnings by keyword |
| `supabase_search_events` | Full-text search across all events |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SECRET_KEY` | ✅ | Secret API key (`sb_secret_…`). Read from the brain .env first (`$BRAIN_DIR/.env`, default `~/code/shared-company-brain/.env`), else from the environment |
| `SUPABASE_SERVICE_KEY` | legacy | Old service-role key; used only when no secret key is found. Being retired |

The URL always comes from the same place as the key, and must be the Evolance Brain project (`pjgifbclxlvvtczctlgp.supabase.co`) unless `EVOLANCE_MEMORY_ALLOW_OTHER_HOST=1`.

## Database Tables

- `agent_events` — Event log (task completions, actions, errors)
- `decisions` — Decision log with reasoning and outcomes
- `learnings` — Cross-agent knowledge base

## Setup

```bash
npm install
node index.js  # Runs on stdio (for MCP)
```

## Used By

All Evolance agents (Evan, Maya, Max) via Claude Code `.mcp.json` configuration.
