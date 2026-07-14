import { LS_KEYS } from './constants.js';

const FIFTEEN_HOURS_MS = 15 * 60 * 60 * 1000;

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

export function setSession({ authenticated, location, expiresAt }) {
  localStorage.setItem(
    LS_KEYS.session,
    JSON.stringify({ authenticated: !!authenticated, location, expiresAt }),
  );
}

export function getSession() {
  const raw = localStorage.getItem(LS_KEYS.session);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isSessionValid() {
  const s = getSession();
  if (!s || s.authenticated !== true) return false;
  if (typeof s.expiresAt !== 'number') return false;
  return Date.now() < s.expiresAt;
}

export function clearSession() {
  localStorage.removeItem(LS_KEYS.session);
  localStorage.removeItem(LS_KEYS.user);
  localStorage.setItem(LS_KEYS.attendanceCompleted, JSON.stringify(false));
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

export function setFifteenHourSession({ authenticated, location }) {
  setSession({
    authenticated,
    location,
    expiresAt: Date.now() + FIFTEEN_HOURS_MS,
  });
}


export function clearSessionForEmployee({ employee, location }) {
  // Keeping MVP minimal: do not clear by default.
  setUserContext({ employee, location });
  setAttendanceCompleted(false);
}


