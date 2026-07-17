// Utility to provide an IP value for webhook payloads.
//
// Browser-based apps cannot reliably obtain the *true* public IP directly.
// So we use a lightweight best-effort strategy:
// - Cache the detected IP in localStorage with a TTL.
// - Lazily fetch from a small public IP endpoint when cache is missing/expired.
// - Validate the response strictly as IPv4/IPv6.
// - IMPORTANT: never fall back to hostname/site-name.

const LS_KEY_IP = 'clientIp';
const LS_KEY_EXPIRES_AT = 'clientIpExpiresAt';

// Keep it modest to avoid repeated calls.
const DEFAULT_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function isValidIp(ip) {
  if (!ip || typeof ip !== 'string') return false;
  const s = ip.trim();

  // IPv4
  const ipv4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
  if (ipv4.test(s)) return true;

  // IPv6 (simple but practical)
  const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
  return ipv6.test(s);
}

function getCachedIp() {
  try {
    const ip = globalThis?.localStorage?.getItem?.(LS_KEY_IP);
    const expiresAtRaw = globalThis?.localStorage?.getItem?.(LS_KEY_EXPIRES_AT);
    const expiresAt = expiresAtRaw ? Number(expiresAtRaw) : NaN;

    if (!ip || !Number.isFinite(expiresAt)) return null;
    if (Date.now() >= expiresAt) return null;
    if (!isValidIp(ip)) return null;

    return ip.trim();
  } catch {
    return null;
  }
}

function setCachedIp(ip, ttlMs = DEFAULT_TTL_MS) {
  try {
    globalThis?.localStorage?.setItem?.(LS_KEY_IP, ip);
    globalThis?.localStorage?.setItem?.(LS_KEY_EXPIRES_AT, String(Date.now() + ttlMs));
  } catch {
    // ignore
  }
}

export function getClientIpAddress() {
  // Fast path: cached IP only.
  return getCachedIp();
}

export async function ensureClientIpAddress({ ttlMs = DEFAULT_TTL_MS } = {}) {
  // 1) Try cached first.
  const cached = getCachedIp();
  if (cached) return cached;

  // 2) Fetch lazily from a lightweight public endpoint.
  // Use ipify (returns plain text IP).
  try {
    const res = await fetch('https://api.ipify.org?format=text', { cache: 'no-store' });
    if (!res.ok) return null;

    const text = (await res.text()).trim();
    if (!isValidIp(text)) return null;

    setCachedIp(text, ttlMs);
    return text;
  } catch {
    return null;
  }
}



