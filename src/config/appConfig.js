export default {
  // n8n webhook endpoint (set via env in real deployments)
  webhookUrl: (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_WEBHOOK_URL) ||
    (typeof process !== 'undefined' && process?.env?.VITE_WEBHOOK_URL) ||
    'http://localhost:5678/webhook',
};


