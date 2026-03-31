# @theyahia/bitrix24-mcp

MCP server for **Bitrix24 CRM** via webhook API. Provides tools for managing deals, contacts, and tasks.

## Tools

| Tool | Description |
|------|------------|
| `get_deals` | List CRM deals with filters by stage and responsible user |
| `create_deal` | Create a new CRM deal with title, amount, stage |
| `get_contacts` | List contacts with filters by name, phone, email |
| `create_task` | Create a task with title, description, deadline |

## Setup

1. In Bitrix24, go to **Developer resources > Other > Inbound webhook**
2. Create a webhook with required permissions: `crm`, `task`
3. Copy the full webhook URL (e.g. `https://company.bitrix24.ru/rest/1/abc123xyz/`)

## Usage with Claude Desktop

Add to your Claude Desktop config:

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

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BITRIX24_WEBHOOK_URL` | Yes | Full Bitrix24 webhook URL including auth key |

## License

MIT
