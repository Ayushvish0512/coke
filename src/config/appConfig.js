export default {
  // n8n webhook endpoint
  // Priority:
  // 1) runtime override in localStorage (set by dev/test)
  // 2) Vite env (VITE_WEBHOOK_URL)
  // 3) fallback
  webhookUrl:
    (typeof window !== 'undefined' &&
      window.localStorage &&
      window.localStorage.getItem('VITE_WEBHOOK_URL_OVERRIDE')) ||
    (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_WEBHOOK_URL) ||
    (typeof process !== 'undefined' && process?.env?.VITE_WEBHOOK_URL) ||
    'https://n8n.laiqa.ai/webhook/3716789c-3899-4e7e-955f-cbcc378d8c59',
};



