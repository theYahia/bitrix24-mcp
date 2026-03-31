#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getDealsSchema, handleGetDeals, createDealSchema, handleCreateDeal } from "./tools/deals.js";
import { getContactsSchema, handleGetContacts } from "./tools/contacts.js";
import { createTaskSchema, handleCreateTask } from "./tools/tasks.js";

const server = new McpServer({
  name: "bitrix24-mcp",
  version: "1.0.0",
});

server.tool(
  "get_deals",
  "List CRM deals from Bitrix24 with optional filters by stage and responsible user.",
  getDealsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetDeals(params) }] }),
);

server.tool(
  "create_deal",
  "Create a new CRM deal in Bitrix24 with title, amount, stage, and linked contact/company.",
  createDealSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateDeal(params) }] }),
);

server.tool(
  "get_contacts",
  "List CRM contacts from Bitrix24 with optional filters by name, phone, or email.",
  getContactsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetContacts(params) }] }),
);

server.tool(
  "create_task",
  "Create a new task in Bitrix24 with title, description, responsible user, and deadline.",
  createTaskSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateTask(params) }] }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[bitrix24-mcp] Server started. 4 tools available.");
}

main().catch((error) => {
  console.error("[bitrix24-mcp] Error:", error);
  process.exit(1);
});
