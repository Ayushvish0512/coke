export function formatNumberInput(value) {
  // Keep very lightweight: treat empty as ''
  if (value === '' || value === null || value === undefined) return '';
  const n = Number(value);
  return Number.isFinite(n) ? n : '';
}

export function toStringOrEmpty(v) {
  if (v === null || v === undefined) return '';
  return String(v);
}

