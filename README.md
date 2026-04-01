# @theyahia/bitrix24-mcp

MCP server for **Bitrix24 CRM** via webhook API. **12 tools** for deals, contacts, tasks, users, files, and messaging.

[![npm](https://img.shields.io/npm/v/@theyahia/bitrix24-mcp)](https://www.npmjs.com/package/@theyahia/bitrix24-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Part of the [Russian API MCP](https://github.com/theYahia/russian-mcp) series by [@theYahia](https://github.com/theYahia).

## Setup

1. In Bitrix24, go to **Developer resources > Other > Inbound webhook**
2. Create a webhook with permissions: `crm`, `task`, `user`, `disk`, `im`
3. Copy the full webhook URL

## Usage with Claude Desktop

```json
{
  "mcpServers": {
    "bitrix24": {
      "command": "npx",
      "args": ["-y", "@theyahia/bitrix24-mcp"],
      "env": {
        "BITRIX24_WEBHOOK_URL": "https://your-company.bitrix24.ru/rest/1/your-webhook-key/"
      }
    }
  }
}
```

### Claude Code

```bash
claude mcp add bitrix24 -e BITRIX24_WEBHOOK_URL=https://your.bitrix24.ru/rest/1/key/ -- npx -y @theyahia/bitrix24-mcp
```

## Tools (12)

| Tool | Description |
|------|-------------|
| `list_deals` | List CRM deals with filters by stage, user, sort order |
| `get_deal` | Get a single deal by ID |
| `create_deal` | Create a deal with title, amount, stage, contacts |
| `update_deal` | Update deal fields |
| `list_contacts` | List contacts with filters by name, phone, email |
| `create_contact` | Create a contact with name, phone, email |
| `list_tasks` | List tasks with filters by status, user, group |
| `create_task` | Create a task with title, deadline, priority |
| `complete_task` | Mark a task as completed |
| `list_users` | List users with filters by active status, department |
| `upload_file` | Upload a file to Bitrix24 disk |
| `send_message` | Send an IM message to a user or chat |

## Demo Prompts

```
Show me all open deals in Bitrix24
Create a deal "Website redesign" for 500000 RUB
List all contacts with email containing "@gmail.com"
Create a task "Prepare presentation" for user 5, deadline tomorrow
Complete task 123
Who are the active users in department 2?
Send a message to user 1: "Meeting in 15 minutes"
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BITRIX24_WEBHOOK_URL` | Yes | Full Bitrix24 webhook URL including auth key |

## License

MIT
