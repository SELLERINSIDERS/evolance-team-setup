#!/usr/bin/env node

/**
 * Evolance ClickUp MCP Server
 *
 * Provides Claude Code with access to ClickUp task management.
 * List ID: 901324765063
 *
 * Env vars required:
 *   CLICKUP_API_TOKEN - ClickUp personal API token
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const BASE_URL = "https://api.clickup.com";
const DEFAULT_LIST_ID = "901324765063";

if (!CLICKUP_API_TOKEN) {
  console.error("Missing CLICKUP_API_TOKEN environment variable");
  process.exit(1);
}

// --- HTTP helper with retry ---
async function clickupFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  const headers = {
    Authorization: CLICKUP_API_TOKEN,
    "Content-Type": "application/json",
    ...options.headers,
  };

  let lastError;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { ...options, headers });

      if (res.status === 429) {
        // Rate limited — wait and retry
        const retryAfter = parseInt(res.headers.get("retry-after") || "2", 10);
        const waitMs = (retryAfter * 1000) + Math.random() * 500;
        console.error(`Rate limited, waiting ${waitMs}ms...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }

      if (res.status >= 500) {
        // Server error — retry with backoff
        const waitMs = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.error(`Server error ${res.status}, retrying in ${waitMs}ms...`);
        await new Promise((r) => setTimeout(r, waitMs));
        lastError = new Error(`ClickUp API ${res.status}: ${await res.text()}`);
        continue;
      }

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`ClickUp API ${res.status}: ${body}`);
      }

      return await res.json();
    } catch (err) {
      lastError = err;
      if (attempt < 2) {
        const waitMs = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await new Promise((r) => setTimeout(r, waitMs));
      }
    }
  }

  throw lastError;
}

// --- Init MCP Server ---
const server = new McpServer({
  name: "evolance-clickup",
  version: "1.0.0",
});

// ============================================================
// Tool 1: clickup_list_tasks
// ============================================================
server.tool(
  "clickup_list_tasks",
  "List active tasks from the Evolance ClickUp workspace. Returns task names, statuses, priorities, and assignees.",
  {
    statuses: z
      .array(z.string())
      .optional()
      .default(["to do", "in progress", "at risk"])
      .describe('Task statuses to filter (default: ["to do", "in progress", "at risk"])'),
    assignee: z.string().optional().describe("Filter by assignee name (optional)"),
  },
  async ({ statuses, assignee }) => {
    try {
      const statusParams = (statuses || ["to do", "in progress", "at risk"])
        .map((s) => `statuses[]=${encodeURIComponent(s)}`)
        .join("&");

      const data = await clickupFetch(
        `/api/v2/list/${DEFAULT_LIST_ID}/task?${statusParams}&include_closed=false&subtasks=true`
      );

      let tasks = data.tasks || [];

      // Filter by assignee if specified
      if (assignee) {
        const lowerAssignee = assignee.toLowerCase();
        tasks = tasks.filter((t) =>
          t.assignees?.some((a) => a.username?.toLowerCase().includes(lowerAssignee) || a.email?.toLowerCase().includes(lowerAssignee))
        );
      }

      if (tasks.length === 0) {
        return {
          content: [{ type: "text", text: "No tasks found matching the filters." }],
        };
      }

      const formatted = tasks
        .map((t) => {
          const assignees = t.assignees?.map((a) => a.username || a.email).join(", ") || "unassigned";
          const priority = t.priority?.priority || "none";
          const due = t.due_date ? new Date(parseInt(t.due_date)).toISOString().split("T")[0] : "no due date";
          return `• [${t.status?.status?.toUpperCase()}] ${t.name}\n  ID: ${t.id} | Priority: ${priority} | Due: ${due} | Assignee: ${assignees}`;
        })
        .join("\n\n");

      return {
        content: [{ type: "text", text: `Found ${tasks.length} tasks:\n\n${formatted}` }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Failed to list tasks: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ============================================================
// Tool 2: clickup_get_task
// ============================================================
server.tool(
  "clickup_get_task",
  "Get full task details including description, comments, and custom fields. Use to understand task context before working.",
  {
    task_id: z.string().describe("ClickUp task ID"),
  },
  async ({ task_id }) => {
    try {
      // Fetch task and comments in parallel
      const [task, commentsData] = await Promise.all([
        clickupFetch(`/api/v2/task/${task_id}`),
        clickupFetch(`/api/v2/task/${task_id}/comment`).catch(() => ({ comments: [] })),
      ]);

      const assignees = task.assignees?.map((a) => a.username || a.email).join(", ") || "unassigned";
      const priority = task.priority?.priority || "none";
      const due = task.due_date ? new Date(parseInt(task.due_date)).toISOString().split("T")[0] : "no due date";
      const status = task.status?.status || "unknown";

      let result = `# ${task.name}\n\n`;
      result += `**Status:** ${status} | **Priority:** ${priority} | **Due:** ${due}\n`;
      result += `**Assignee:** ${assignees}\n`;
      result += `**ID:** ${task.id}\n`;
      result += `**URL:** ${task.url}\n\n`;

      if (task.description) {
        result += `## Description\n${task.description}\n\n`;
      }

      if (task.tags?.length > 0) {
        result += `**Tags:** ${task.tags.map((t) => t.name).join(", ")}\n\n`;
      }

      const comments = commentsData.comments || [];
      if (comments.length > 0) {
        result += `## Comments (${comments.length})\n\n`;
        for (const c of comments.slice(-10)) {
          const author = c.user?.username || c.user?.email || "unknown";
          const date = new Date(parseInt(c.date)).toISOString().split("T")[0];
          const text = c.comment_text || c.comment?.map((seg) => seg.text).join("") || "(no text)";
          result += `**${author}** (${date}):\n${text}\n\n`;
        }
      }

      return {
        content: [{ type: "text", text: result }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Failed to get task: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ============================================================
// Tool 3: clickup_update_task
// ============================================================
server.tool(
  "clickup_update_task",
  "Update a task's status and/or priority. Use when completing tasks or changing priority.",
  {
    task_id: z.string().describe("ClickUp task ID"),
    status: z.string().optional().describe("New status (e.g. 'complete', 'in progress', 'to do', 'at risk')"),
    priority: z.number().optional().describe("Priority: 1=urgent, 2=high, 3=normal, 4=low"),
  },
  async ({ task_id, status, priority }) => {
    try {
      const body = {};
      if (status) body.status = status;
      if (priority !== undefined) body.priority = priority;

      if (Object.keys(body).length === 0) {
        return {
          content: [{ type: "text", text: "Nothing to update — provide status or priority." }],
        };
      }

      const task = await clickupFetch(`/api/v2/task/${task_id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ Task "${task.name}" updated.${status ? " Status → " + status : ""}${priority !== undefined ? " Priority → " + priority : ""}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Failed to update task: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ============================================================
// Tool 4: clickup_add_comment
// ============================================================
server.tool(
  "clickup_add_comment",
  "Add a comment to a task. Use for deliverables, status updates, and notes.",
  {
    task_id: z.string().describe("ClickUp task ID"),
    comment_text: z.string().describe("Comment text to add"),
  },
  async ({ task_id, comment_text }) => {
    try {
      await clickupFetch(`/api/v2/task/${task_id}/comment`, {
        method: "POST",
        body: JSON.stringify({ comment_text }),
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ Comment added to task ${task_id}.`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Failed to add comment: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ============================================================
// Tool 5: clickup_create_task
// ============================================================
server.tool(
  "clickup_create_task",
  "Create a new task in the Evolance workspace.",
  {
    name: z.string().describe("Task name"),
    description: z.string().optional().describe("Task description (markdown supported)"),
    priority: z.number().optional().describe("Priority: 1=urgent, 2=high, 3=normal, 4=low"),
    due_date: z.string().optional().describe("Due date (ISO 8601 string, e.g. 2026-02-15)"),
  },
  async ({ name, description, priority, due_date }) => {
    try {
      const body = { name };
      if (description) body.description = description;
      if (priority !== undefined) body.priority = priority;
      if (due_date) body.due_date = new Date(due_date).getTime();

      const task = await clickupFetch(`/api/v2/list/${DEFAULT_LIST_ID}/task`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      return {
        content: [
          {
            type: "text",
            text: `✅ Task created: "${task.name}"\n  ID: ${task.id}\n  URL: ${task.url}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Failed to create task: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// --- Start Server ---
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Evolance ClickUp MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
