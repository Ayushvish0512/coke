// Generates a stable device ID stored in localStorage.
// This helps identify devices across sessions.

const DEVICE_ID_KEY = 'softy.deviceId';

function generateUuidV4() {
  // Simple UUID v4 generation (no external deps)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getDeviceId() {
  try {
    let deviceId = globalThis?.localStorage?.getItem?.(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = generateUuidV4();
      globalThis?.localStorage?.setItem?.(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  } catch {
    // Fallback if localStorage is unavailable
    return 'unknown-device';
  }
}

