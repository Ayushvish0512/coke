import { LS_KEYS } from './constants.js';

export function setUserContext({ employee, location }) {
  localStorage.setItem(LS_KEYS.user, JSON.stringify({ employee, location }));
}

export function getUserContext() {
  const raw = localStorage.getItem(LS_KEYS.user);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAttendanceCompleted(value) {
  localStorage.setItem(LS_KEYS.attendanceCompleted, JSON.stringify(!!value));
}

export function isAttendanceCompleted() {
  const raw = localStorage.getItem(LS_KEYS.attendanceCompleted);
  if (raw === null) return false;
  try {
    return JSON.parse(raw) === true;
  } catch {
    return false;
  }
}

export function clearSessionForEmployee({ employee, location }) {
  // Optional helper for future phases.
  // Keeping MVP minimal: do not clear by default.
  setUserContext({ employee, location });
  setAttendanceCompleted(false);
}

