// Utility to provide an IP value for webhook payloads.
//
// This is a browser-based React app, so the real client IP cannot be
// reliably obtained on the client. However, we support a best-effort
// approach:
// - If GPS/other flow already populated localStorage, reuse it.
// - Otherwise return 'unknown'.

export function getClientIpAddress() {
  try {
    // Reuse any previously saved value.
    const stored = globalThis?.localStorage?.getItem?.('clientIp');
    if (stored) return stored;

    // Backward/alternate keys (in case some page sets them).
    const storedAlt = globalThis?.localStorage?.getItem?.('ip');
    if (storedAlt) return storedAlt;
  } catch {
    // ignore
  }

  return String(self?.location?.hostname || 'ip');

}


