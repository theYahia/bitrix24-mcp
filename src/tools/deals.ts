import { z } from "zod";
import { bitrix24Call } from "../client.js";

export const listDealsSchema = z.object({
  filter_stage_id: z.string().optional().describe("Filter by stage ID (e.g. NEW, WON, LOSE)"),
  filter_assigned_by_id: z.number().optional().describe("Filter by responsible user ID"),
  select: z.array(z.string()).optional().describe("Fields to return"),
  order: z.record(z.enum(["ASC", "DESC"])).optional().describe("Sort order, e.g. {DATE_CREATE: 'DESC'}"),
  start: z.number().optional().describe("Offset for pagination (multiples of 50)"),
});

export async function handleListDeals(params: z.infer<typeof listDealsSchema>): Promise<string> {
  const filter: Record<string, unknown> = {};
  if (params.filter_stage_id) filter["STAGE_ID"] = params.filter_stage_id;
  if (params.filter_assigned_by_id) filter["ASSIGNED_BY_ID"] = params.filter_assigned_by_id;

  const result = await bitrix24Call("crm.deal.list", {
    filter,
    select: params.select ?? ["ID", "TITLE", "STAGE_ID", "OPPORTUNITY", "CURRENCY_ID", "CONTACT_ID", "COMPANY_ID", "ASSIGNED_BY_ID", "DATE_CREATE", "CLOSEDATE"],
    order: params.order ?? { ID: "DESC" },
    start: params.start ?? 0,
  });
  return JSON.stringify(result, null, 2);
}

export const getDealSchema = z.object({
  deal_id: z.number().describe("Deal ID to retrieve"),
});

export async function handleGetDeal(params: z.infer<typeof getDealSchema>): Promise<string> {
  const result = await bitrix24Call("crm.deal.get", { id: params.deal_id });
  return JSON.stringify(result, null, 2);
}

export const createDealSchema = z.object({
  title: z.string().describe("Deal title"),
  stage_id: z.string().default("NEW").describe("Stage ID (e.g. NEW, PREPARATION, PREPAYMENT_INVOICE)"),
  opportunity: z.number().optional().describe("Deal amount"),
  currency_id: z.string().default("RUB").describe("Currency code"),
  contact_id: z.number().optional().describe("Contact ID to link"),
  company_id: z.number().optional().describe("Company ID to link"),
  assigned_by_id: z.number().optional().describe("Responsible user ID"),
  comments: z.string().optional().describe("Comments"),
});

export async function handleCreateDeal(params: z.infer<typeof createDealSchema>): Promise<string> {
  const fields: Record<string, unknown> = {
    TITLE: params.title,
    STAGE_ID: params.stage_id,
    CURRENCY_ID: params.currency_id,
  };
  if (params.opportunity !== undefined) fields.OPPORTUNITY = params.opportunity;
  if (params.contact_id !== undefined) fields.CONTACT_ID = params.contact_id;
  if (params.company_id !== undefined) fields.COMPANY_ID = params.company_id;
  if (params.assigned_by_id !== undefined) fields.ASSIGNED_BY_ID = params.assigned_by_id;
  if (params.comments !== undefined) fields.COMMENTS = params.comments;

  const result = await bitrix24Call("crm.deal.add", { fields });
  return JSON.stringify(result, null, 2);
}

export const updateDealSchema = z.object({
  deal_id: z.number().describe("Deal ID to update"),
  title: z.string().optional().describe("New deal title"),
  stage_id: z.string().optional().describe("New stage ID"),
  opportunity: z.number().optional().describe("New deal amount"),
  contact_id: z.number().optional().describe("New contact ID"),
  company_id: z.number().optional().describe("New company ID"),
  assigned_by_id: z.number().optional().describe("New responsible user ID"),
  comments: z.string().optional().describe("New comments"),
});

export async function handleUpdateDeal(params: z.infer<typeof updateDealSchema>): Promise<string> {
  const fields: Record<string, unknown> = {};
  if (params.title !== undefined) fields.TITLE = params.title;
  if (params.stage_id !== undefined) fields.STAGE_ID = params.stage_id;
  if (params.opportunity !== undefined) fields.OPPORTUNITY = params.opportunity;
  if (params.contact_id !== undefined) fields.CONTACT_ID = params.contact_id;
  if (params.company_id !== undefined) fields.COMPANY_ID = params.company_id;
  if (params.assigned_by_id !== undefined) fields.ASSIGNED_BY_ID = params.assigned_by_id;
  if (params.comments !== undefined) fields.COMMENTS = params.comments;

  const result = await bitrix24Call("crm.deal.update", { id: params.deal_id, fields });
  return JSON.stringify(result, null, 2);
}
