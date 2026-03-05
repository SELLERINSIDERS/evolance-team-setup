# Evolance Supabase MCP Server

MCP server that gives Claude Code access to the shared agent memory database (Supabase).

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
| `SUPABASE_SERVICE_KEY` | ✅ | Service role key (not anon key) |

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
