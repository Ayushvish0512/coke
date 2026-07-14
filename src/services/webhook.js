import appConfig from '../config/appConfig.js';

async function postWebhook(url, payload) {
  const res = await fetch(url, {
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

export async function sendLoginWebhookPayload(payload) {
  return postWebhook(appConfig.loginWebhookUrl, payload);
}

export async function sendOperationWebhookPayload(payload) {
  return postWebhook(appConfig.operationWebhookUrl, payload);
}


