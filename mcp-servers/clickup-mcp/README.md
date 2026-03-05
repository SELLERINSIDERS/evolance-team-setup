# Evolance ClickUp MCP Server

MCP server that gives Claude Code access to the Evolance ClickUp workspace for task management.

## Tools Provided

| Tool | Description |
|------|-------------|
| `clickup_list_tasks` | List active tasks with status/assignee filters |
| `clickup_get_task` | Get full task details + comments |
| `clickup_update_task` | Update task status and priority |
| `clickup_add_comment` | Add a comment to a task |
| `clickup_create_task` | Create a new task |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CLICKUP_API_TOKEN` | ✅ | ClickUp personal API token |

## Configuration

- **Workspace:** Evolance
- **Default List ID:** 901324765063
- **Base URL:** https://api.clickup.com

## Features

- Automatic retry with exponential backoff on 500 errors
- Rate limit handling (429 responses)
- Jitter on retries to avoid thundering herd

## Setup

```bash
npm install
node index.js  # Runs on stdio (for MCP)
```

## Used By

All Evolance agents (Evan, Maya, Max) via Claude Code `.mcp.json` configuration.
