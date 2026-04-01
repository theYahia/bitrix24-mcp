#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { listDealsSchema, handleListDeals, getDealSchema, handleGetDeal, createDealSchema, handleCreateDeal, updateDealSchema, handleUpdateDeal } from "./tools/deals.js";
import { listContactsSchema, handleListContacts, createContactSchema, handleCreateContact } from "./tools/contacts.js";
import { listTasksSchema, handleListTasks, createTaskSchema, handleCreateTask, completeTaskSchema, handleCompleteTask } from "./tools/tasks.js";
import { listUsersSchema, handleListUsers } from "./tools/users.js";
import { uploadFileSchema, handleUploadFile } from "./tools/files.js";
import { sendMessageSchema, handleSendMessage } from "./tools/messages.js";

const server = new McpServer({
  name: "bitrix24-mcp",
  version: "2.0.0",
});

server.tool(
  "list_deals",
  "List CRM deals from Bitrix24 with optional filters by stage, responsible user, and sort order.",
  listDealsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListDeals(params) }] }),
);

server.tool(
  "get_deal",
  "Get a single CRM deal by ID with all fields.",
  getDealSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetDeal(params) }] }),
);

server.tool(
  "create_deal",
  "Create a new CRM deal in Bitrix24 with title, amount, stage, and linked contact/company.",
  createDealSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateDeal(params) }] }),
);

server.tool(
  "update_deal",
  "Update an existing CRM deal fields: title, stage, amount, contacts, etc.",
  updateDealSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleUpdateDeal(params) }] }),
);

server.tool(
  "list_contacts",
  "List CRM contacts from Bitrix24 with optional filters by name, phone, or email.",
  listContactsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListContacts(params) }] }),
);

server.tool(
  "create_contact",
  "Create a new CRM contact with name, last name, phone, and email.",
  createContactSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateContact(params) }] }),
);

server.tool(
  "list_tasks",
  "List tasks from Bitrix24 with optional filters by status, responsible user, and group.",
  listTasksSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListTasks(params) }] }),
);

server.tool(
  "create_task",
  "Create a new task in Bitrix24 with title, description, responsible user, and deadline.",
  createTaskSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCreateTask(params) }] }),
);

server.tool(
  "complete_task",
  "Mark a Bitrix24 task as completed by task ID.",
  completeTaskSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleCompleteTask(params) }] }),
);

server.tool(
  "list_users",
  "List Bitrix24 users with optional filters by active status and department.",
  listUsersSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleListUsers(params) }] }),
);

server.tool(
  "upload_file",
  "Upload a file to Bitrix24 disk folder (base64-encoded content).",
  uploadFileSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleUploadFile(params) }] }),
);

server.tool(
  "send_message",
  "Send an instant message via Bitrix24 IM to a user or chat.",
  sendMessageSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleSendMessage(params) }] }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[bitrix24-mcp] Server started. 12 tools available.");
}

main().catch((error) => {
  console.error("[bitrix24-mcp] Error:", error);
  process.exit(1);
});
