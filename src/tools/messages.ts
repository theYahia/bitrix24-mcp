import { z } from "zod";
import { bitrix24Call } from "../client.js";

export const sendMessageSchema = z.object({
  dialog_id: z.string().describe("Dialog ID: user ID (e.g. '1') or chat ID (e.g. 'chat123')"),
  message: z.string().describe("Message text (supports BB-code formatting)"),
});

export async function handleSendMessage(params: z.infer<typeof sendMessageSchema>): Promise<string> {
  const result = await bitrix24Call("im.message.add", {
    DIALOG_ID: params.dialog_id,
    MESSAGE: params.message,
  });
  return JSON.stringify(result, null, 2);
}
