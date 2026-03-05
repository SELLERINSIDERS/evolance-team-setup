#!/usr/bin/env node

/**
 * Evolance Supabase MCP Server
 * 
 * Provides Claude Code with access to the shared agent memory database.
 * Tables: agent_events, decisions, learnings
 * 
 * Env vars required:
 *   SUPABASE_URL - Project URL
 *   SUPABASE_SERVICE_KEY - Service role key (not anon)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// --- Init Supabase ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// --- Init MCP Server ---
const server = new McpServer({
  name: "evolance-supabase",
  version: "1.0.0",
});

// ============================================================
// Tool 1: supabase_log_event
// ============================================================
server.tool(
  "supabase_log_event",
  "Log an agent event to the shared memory database. Use for task completions, milestones, errors, and significant actions.",
  {
    agent_id: z.string().describe("Agent identifier (evan, maya, max, andrei, xeniya, vitalii, olga)"),
    event_type: z.string().describe("Event type (task_completed, error, milestone, action, note)"),
    title: z.string().describe("Short title of the event"),
    detail: z.string().optional().describe("Detailed description"),
    category: z.string().optional().describe("Category (operations, marketing, ppc, technical, brand)"),
    source: z.string().optional().default("claude-code").describe("Source interface (claude-code, openclaw)"),
  },
  async ({ agent_id, event_type, title, detail, category, source }) => {
    try {
      const { data, error } = await supabase
        .from("agent_events")
        .insert({
          agent_id,
          event_type,
          title,
          detail: detail || null,
          category: category || null,
          metadata: { source: source || "claude-code" },
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        content: [
          {
            type: "text",
            text: `✅ Event logged: "${title}" (${event_type}) — ID: ${data.id}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `❌ Failed to log event: ${err.message}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ============================================================
// Tool 2: supabase_query_events
// ============================================================
server.tool(
  "supabase_query_events",
  "Query recent agent events from memory. Use to understand what's been done recently.",
  {
    agent_id: z.string().optional().describe("Filter by agent (evan, maya, max). Omit for all agents."),
    event_type: z.string().optional().describe("Filter by event type"),
    hours: z.number().optional().default(24).describe("Look back N hours (default 24)"),
    limit: z.number().optional().default(20).describe("Max results (default 20)"),
  },
  async ({ agent_id, event_type, hours, limit }) => {
    try {
      const since = new Date(Date.now() - (hours || 24) * 60 * 60 * 1000).toISOString();

      let query = supabase
        .from("agent_events")
        .select("id, agent_id, event_type, title, detail, category, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(limit || 20);

      if (agent_id) query = query.eq("agent_id", agent_id);
      if (event_type) query = query.eq("event_type", event_type);

      const { data, error } = await query;
      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No events found in the last ${hours || 24} hours.` }],
        };
      }

      const formatted = data
        .map(
          (e) =>
            `[${e.created_at}] ${e.agent_id}/${e.event_type}: ${e.title}${e.detail ? "\n  → " + e.detail.slice(0, 200) : ""}`
        )
        .join("\n\n");

      return {
        content: [{ type: "text", text: `Found ${data.length} events:\n\n${formatted}` }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Query failed: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ============================================================
// Tool 3: supabase_log_decision
// ============================================================
server.tool(
  "supabase_log_decision",
  "Log a significant decision to the shared memory. Use when making choices that affect strategy, architecture, or direction.",
  {
    agent_id: z.string().describe("Agent identifier (evan, maya, max, andrei, xeniya, vitalii, olga)"),
    decision: z.string().describe("What was decided"),
    reasoning: z.string().describe("Why this decision was made"),
    domain: z.string().describe("Domain (strategy, marketing, ppc, technical, brand, operations)"),
    context: z.string().optional().describe("Additional context or constraints"),
  },
  async ({ agent_id, decision, reasoning, domain, context }) => {
    try {
      const { data, error } = await supabase
        .from("decisions")
        .insert({
          agent_id,
          decision,
          reasoning,
          domain,
          context: context || null,
          made_by: `${agent_id}-claude-code`,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        content: [
          {
            type: "text",
            text: `✅ Decision logged: "${decision}" (${domain}) — ID: ${data.id}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Failed to log decision: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ============================================================
// Tool 4: supabase_query_decisions
// ============================================================
server.tool(
  "supabase_query_decisions",
  "Query past decisions. Use before making new decisions to check for precedent.",
  {
    agent_id: z.string().optional().describe("Filter by agent"),
    domain: z.string().optional().describe("Filter by domain"),
    hours: z.number().optional().default(168).describe("Look back N hours (default 168 = 1 week)"),
    limit: z.number().optional().default(10).describe("Max results (default 10)"),
  },
  async ({ agent_id, domain, hours, limit }) => {
    try {
      const since = new Date(Date.now() - (hours || 168) * 60 * 60 * 1000).toISOString();

      let query = supabase
        .from("decisions")
        .select("id, agent_id, decision, reasoning, domain, context, outcome, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(limit || 10);

      if (agent_id) query = query.eq("agent_id", agent_id);
      if (domain) query = query.eq("domain", domain);

      const { data, error } = await query;
      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No decisions found in the last ${hours || 168} hours.` }],
        };
      }

      const formatted = data
        .map(
          (d) =>
            `[${d.created_at}] ${d.agent_id} — ${d.domain}\n  Decision: ${d.decision}\n  Reasoning: ${d.reasoning}${d.outcome ? "\n  Outcome: " + d.outcome : ""}`
        )
        .join("\n\n");

      return {
        content: [{ type: "text", text: `Found ${data.length} decisions:\n\n${formatted}` }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Query failed: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ============================================================
// Tool 5: supabase_log_learning
// ============================================================
server.tool(
  "supabase_log_learning",
  "Log a learning to shared memory. Use when you discover something useful that other agents should know.",
  {
    agent_id: z.string().describe("Agent identifier (evan, maya, max, andrei, xeniya, vitalii, olga)"),
    category: z.string().describe("Category (api, marketing, ppc, technical, brand, compliance, tool)"),
    topic: z.string().describe("Short topic name"),
    summary: z.string().describe("One-line summary of the learning"),
    impact: z.string().describe("Impact level (critical, high, medium, low)"),
    detail: z.string().optional().describe("Detailed explanation"),
  },
  async ({ agent_id, category, topic, summary, impact, detail }) => {
    try {
      const { data, error } = await supabase
        .from("learnings")
        .insert({
          agent_id,
          category,
          topic,
          summary,
          impact,
          detail: detail || null,
          applies_to: "all",
          source_file: "claude-code",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        content: [
          {
            type: "text",
            text: `✅ Learning logged: "${summary}" (${impact}) — ID: ${data.id}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Failed to log learning: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ============================================================
// Tool 6: supabase_search_learnings
// ============================================================
server.tool(
  "supabase_search_learnings",
  "Search past learnings by keyword. Use before starting any task to avoid repeating mistakes.",
  {
    query: z.string().describe("Search keywords"),
    agent_id: z.string().optional().describe("Filter by agent"),
    limit: z.number().optional().default(10).describe("Max results (default 10)"),
  },
  async ({ query, agent_id, limit }) => {
    try {
      // Use ilike for text matching on topic and summary
      let dbQuery = supabase
        .from("learnings")
        .select("id, agent_id, category, topic, summary, detail, impact, created_at")
        .or(`topic.ilike.%${query}%,summary.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .limit(limit || 10);

      if (agent_id) dbQuery = dbQuery.eq("agent_id", agent_id);

      const { data, error } = await dbQuery;
      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No learnings found matching "${query}".` }],
        };
      }

      const formatted = data
        .map(
          (l) =>
            `[${l.impact?.toUpperCase()}] ${l.topic}\n  ${l.summary}${l.detail ? "\n  Detail: " + l.detail.slice(0, 300) : ""}\n  (by ${l.agent_id}, ${l.created_at})`
        )
        .join("\n\n");

      return {
        content: [{ type: "text", text: `Found ${data.length} learnings:\n\n${formatted}` }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Search failed: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// ============================================================
// Tool 7: supabase_search_events
// ============================================================
server.tool(
  "supabase_search_events",
  "Full-text search across agent events. Use to find past work on a topic.",
  {
    query: z.string().describe("Search keywords"),
    agent_id: z.string().optional().describe("Filter by agent"),
    limit: z.number().optional().default(20).describe("Max results (default 20)"),
  },
  async ({ query, agent_id, limit }) => {
    try {
      let dbQuery = supabase
        .from("agent_events")
        .select("id, agent_id, event_type, title, detail, category, created_at")
        .or(`title.ilike.%${query}%,detail.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .limit(limit || 20);

      if (agent_id) dbQuery = dbQuery.eq("agent_id", agent_id);

      const { data, error } = await dbQuery;
      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          content: [{ type: "text", text: `No events found matching "${query}".` }],
        };
      }

      const formatted = data
        .map(
          (e) =>
            `[${e.created_at}] ${e.agent_id}/${e.event_type}: ${e.title}${e.detail ? "\n  → " + e.detail.slice(0, 200) : ""}`
        )
        .join("\n\n");

      return {
        content: [{ type: "text", text: `Found ${data.length} events:\n\n${formatted}` }],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `❌ Search failed: ${err.message}` }],
        isError: true,
      };
    }
  }
);

// --- Start Server ---
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Evolance Supabase MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
