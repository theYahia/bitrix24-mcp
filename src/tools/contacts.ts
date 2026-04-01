import { z } from "zod";
import { bitrix24Call } from "../client.js";

export const listContactsSchema = z.object({
  filter_name: z.string().optional().describe("Filter by name (partial match)"),
  filter_phone: z.string().optional().describe("Filter by phone number"),
  filter_email: z.string().optional().describe("Filter by email"),
  select: z.array(z.string()).optional().describe("Fields to return"),
  start: z.number().optional().describe("Offset for pagination (multiples of 50)"),
});

export async function handleListContacts(params: z.infer<typeof listContactsSchema>): Promise<string> {
  const filter: Record<string, unknown> = {};
  if (params.filter_name) filter["%NAME"] = params.filter_name;
  if (params.filter_phone) filter["PHONE"] = params.filter_phone;
  if (params.filter_email) filter["EMAIL"] = params.filter_email;

  const result = await bitrix24Call("crm.contact.list", {
    filter,
    select: params.select ?? ["ID", "NAME", "LAST_NAME", "PHONE", "EMAIL", "COMPANY_ID", "ASSIGNED_BY_ID", "DATE_CREATE"],
    start: params.start ?? 0,
  });
  return JSON.stringify(result, null, 2);
}

export const createContactSchema = z.object({
  name: z.string().describe("First name"),
  last_name: z.string().describe("Last name"),
  phone: z.string().optional().describe("Phone number"),
  email: z.string().optional().describe("Email address"),
  company_id: z.number().optional().describe("Company ID to link"),
  assigned_by_id: z.number().optional().describe("Responsible user ID"),
});

export async function handleCreateContact(params: z.infer<typeof createContactSchema>): Promise<string> {
  const fields: Record<string, unknown> = {
    NAME: params.name,
    LAST_NAME: params.last_name,
  };
  if (params.phone) fields.PHONE = [{ VALUE: params.phone, VALUE_TYPE: "WORK" }];
  if (params.email) fields.EMAIL = [{ VALUE: params.email, VALUE_TYPE: "WORK" }];
  if (params.company_id !== undefined) fields.COMPANY_ID = params.company_id;
  if (params.assigned_by_id !== undefined) fields.ASSIGNED_BY_ID = params.assigned_by_id;

  const result = await bitrix24Call("crm.contact.add", { fields });
  return JSON.stringify(result, null, 2);
}
