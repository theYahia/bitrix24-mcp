import { z } from "zod";
import { bitrix24Call } from "../client.js";

export const uploadFileSchema = z.object({
  folder_id: z.number().describe("Target folder ID in Bitrix24 disk"),
  filename: z.string().describe("Name of the file to upload"),
  content: z.string().describe("Base64-encoded file content"),
});

export async function handleUploadFile(params: z.infer<typeof uploadFileSchema>): Promise<string> {
  const result = await bitrix24Call("disk.folder.uploadfile", {
    id: params.folder_id,
    data: { NAME: params.filename },
    fileContent: [params.filename, params.content],
  });
  return JSON.stringify(result, null, 2);
}
