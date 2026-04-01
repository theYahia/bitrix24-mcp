import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Set env before importing modules
process.env.BITRIX24_WEBHOOK_URL = "https://test.bitrix24.ru/rest/1/testkey/";

describe("bitrix24-mcp tools", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: [] }),
      text: () => Promise.resolve(JSON.stringify({ result: [] })),
    });
  });

  describe("deals", () => {
    it("handleListDeals calls crm.deal.list", async () => {
      const { handleListDeals } = await import("../tools/deals.js");
      const result = await handleListDeals({});
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("crm.deal.list.json");
      expect(JSON.parse(result)).toEqual({ result: [] });
    });

    it("handleGetDeal calls crm.deal.get with id", async () => {
      const { handleGetDeal } = await import("../tools/deals.js");
      await handleGetDeal({ deal_id: 42 });
      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(body.id).toBe(42);
    });

    it("handleCreateDeal sends fields", async () => {
      const { handleCreateDeal } = await import("../tools/deals.js");
      await handleCreateDeal({ title: "Test Deal", stage_id: "NEW", currency_id: "RUB" });
      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(body.fields.TITLE).toBe("Test Deal");
    });

    it("handleUpdateDeal sends update fields", async () => {
      const { handleUpdateDeal } = await import("../tools/deals.js");
      await handleUpdateDeal({ deal_id: 1, title: "Updated" });
      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(body.id).toBe(1);
      expect(body.fields.TITLE).toBe("Updated");
    });
  });

  describe("contacts", () => {
    it("handleListContacts calls crm.contact.list", async () => {
      const { handleListContacts } = await import("../tools/contacts.js");
      await handleListContacts({});
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("crm.contact.list.json");
    });

    it("handleCreateContact sends name and phone", async () => {
      const { handleCreateContact } = await import("../tools/contacts.js");
      await handleCreateContact({ name: "John", last_name: "Doe", phone: "+79001234567" });
      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(body.fields.NAME).toBe("John");
      expect(body.fields.PHONE[0].VALUE).toBe("+79001234567");
    });
  });

  describe("tasks", () => {
    it("handleListTasks calls tasks.task.list", async () => {
      const { handleListTasks } = await import("../tools/tasks.js");
      await handleListTasks({});
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("tasks.task.list.json");
    });

    it("handleCreateTask sends fields", async () => {
      const { handleCreateTask } = await import("../tools/tasks.js");
      await handleCreateTask({ title: "Test Task", responsible_id: 1, priority: "1" });
      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(body.fields.TITLE).toBe("Test Task");
      expect(body.fields.RESPONSIBLE_ID).toBe(1);
    });

    it("handleCompleteTask sends task ID", async () => {
      const { handleCompleteTask } = await import("../tools/tasks.js");
      await handleCompleteTask({ task_id: 99 });
      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(body.taskId).toBe(99);
    });
  });

  describe("users", () => {
    it("handleListUsers calls user.get", async () => {
      const { handleListUsers } = await import("../tools/users.js");
      await handleListUsers({});
      const url = mockFetch.mock.calls[0][0] as string;
      expect(url).toContain("user.get.json");
    });
  });

  describe("messages", () => {
    it("handleSendMessage sends message", async () => {
      const { handleSendMessage } = await import("../tools/messages.js");
      await handleSendMessage({ dialog_id: "1", message: "Hello" });
      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
      expect(body.DIALOG_ID).toBe("1");
      expect(body.MESSAGE).toBe("Hello");
    });
  });

  describe("error handling", () => {
    it("throws on missing BITRIX24_WEBHOOK_URL", async () => {
      const origUrl = process.env.BITRIX24_WEBHOOK_URL;
      delete process.env.BITRIX24_WEBHOOK_URL;
      const { bitrix24Call } = await import("../client.js");
      await expect(bitrix24Call("test")).rejects.toThrow("BITRIX24_WEBHOOK_URL");
      process.env.BITRIX24_WEBHOOK_URL = origUrl;
    });
  });
});
