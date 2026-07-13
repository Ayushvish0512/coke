import appConfig from '../config/appConfig.js';

export async function sendWebhookPayload(payload) {
  const res = await fetch(appConfig.webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let text = '';
    try {
      text = await res.text();
    } catch {
      // ignore
    }
    throw new Error(`Webhook failed: ${res.status} ${text}`.trim());
  }

  // n8n might return JSON or plain text. Be tolerant.
  try {
    return await res.json();
  } catch {
    return { ok: true };
  }
}

