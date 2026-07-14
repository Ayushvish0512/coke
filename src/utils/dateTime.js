// Date/time helpers

/**
 * Returns a clean India-local datetime string (no timezone suffix).
 * Format example: "2026-07-14 10:04:27"
 */
export function getIndiaDateTimeString() {
  const d = new Date();

  // Use en-IN locale to get India time components.
  // Note: We build the output ourselves to guarantee "YYYY-MM-DD HH:mm:ss".
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(d);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  const year = map.year;
  const month = map.month;
  const day = map.day;
  const hour = map.hour;
  const minute = map.minute;
  const second = map.second;

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

