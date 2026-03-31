const TIMEOUT = 15_000;
const MAX_RETRIES = 3;

function getWebhookUrl(): string {
  const url = process.env.BITRIX24_WEBHOOK_URL;
  if (!url) throw new Error("BITRIX24_WEBHOOK_URL is not set");
  return url.endsWith("/") ? url : url + "/";
}

export async function bitrix24Call(method: string, params?: Record<string, unknown>): Promise<unknown> {
  const baseUrl = getWebhookUrl();

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const url = `${baseUrl}${method}.json`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: params ? JSON.stringify(params) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) return response.json();

      if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 8000);
        console.error(`[bitrix24-mcp] ${response.status}, retry in ${delay}ms (${attempt}/${MAX_RETRIES})`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }

      const body = await response.text();
      throw new Error(`Bitrix24 HTTP ${response.status}: ${body}`);
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError" && attempt < MAX_RETRIES) {
        console.error(`[bitrix24-mcp] Timeout, retry (${attempt}/${MAX_RETRIES})`);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Bitrix24: all retries exhausted");
}
