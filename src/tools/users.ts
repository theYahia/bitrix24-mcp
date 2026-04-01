import { z } from "zod";
import { bitrix24Call } from "../client.js";

export const listUsersSchema = z.object({
  filter_active: z.boolean().optional().describe("Filter by active status"),
  filter_department_id: z.number().optional().describe("Filter by department ID"),
  start: z.number().optional().describe("Offset for pagination"),
});

export async function handleListUsers(params: z.infer<typeof listUsersSchema>): Promise<string> {
  const filter: Record<string, unknown> = {};
  if (params.filter_active !== undefined) filter["ACTIVE"] = params.filter_active;
  if (params.filter_department_id) filter["UF_DEPARTMENT"] = params.filter_department_id;

  const result = await bitrix24Call("user.get", { filter, start: params.start ?? 0 });
  return JSON.stringify(result, null, 2);
}
