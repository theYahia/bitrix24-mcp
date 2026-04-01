import { z } from "zod";
import { bitrix24Call } from "../client.js";

export const listTasksSchema = z.object({
  filter_status: z.string().optional().describe("Filter by status (e.g. 2=pending, 3=in progress, 5=completed)"),
  filter_responsible_id: z.number().optional().describe("Filter by responsible user ID"),
  filter_group_id: z.number().optional().describe("Filter by project/group ID"),
  start: z.number().optional().describe("Offset for pagination"),
});

export async function handleListTasks(params: z.infer<typeof listTasksSchema>): Promise<string> {
  const filter: Record<string, unknown> = {};
  if (params.filter_status) filter["STATUS"] = params.filter_status;
  if (params.filter_responsible_id) filter["RESPONSIBLE_ID"] = params.filter_responsible_id;
  if (params.filter_group_id) filter["GROUP_ID"] = params.filter_group_id;

  const result = await bitrix24Call("tasks.task.list", {
    filter,
    select: ["ID", "TITLE", "STATUS", "RESPONSIBLE_ID", "CREATED_BY", "DEADLINE", "PRIORITY", "GROUP_ID", "CREATED_DATE"],
    start: params.start ?? 0,
  });
  return JSON.stringify(result, null, 2);
}

export const createTaskSchema = z.object({
  title: z.string().describe("Task title"),
  description: z.string().optional().describe("Task description"),
  responsible_id: z.number().describe("Responsible user ID"),
  deadline: z.string().optional().describe("Deadline in ISO format (e.g. 2025-12-31T23:59:59+03:00)"),
  priority: z.enum(["0", "1", "2"]).default("1").describe("Priority: 0=low, 1=normal, 2=high"),
  group_id: z.number().optional().describe("Project/group ID"),
});

export async function handleCreateTask(params: z.infer<typeof createTaskSchema>): Promise<string> {
  const fields: Record<string, unknown> = {
    TITLE: params.title,
    RESPONSIBLE_ID: params.responsible_id,
    PRIORITY: params.priority,
  };
  if (params.description !== undefined) fields.DESCRIPTION = params.description;
  if (params.deadline !== undefined) fields.DEADLINE = params.deadline;
  if (params.group_id !== undefined) fields.GROUP_ID = params.group_id;

  const result = await bitrix24Call("tasks.task.add", { fields });
  return JSON.stringify(result, null, 2);
}

export const completeTaskSchema = z.object({
  task_id: z.number().describe("Task ID to complete"),
});

export async function handleCompleteTask(params: z.infer<typeof completeTaskSchema>): Promise<string> {
  const result = await bitrix24Call("tasks.task.complete", { taskId: params.task_id });
  return JSON.stringify(result, null, 2);
}
