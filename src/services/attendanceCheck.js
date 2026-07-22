import { getUserContext, clearSession } from '../utils/storage.js';
import { checkTodayAttendance } from './deviceAttendance.js';

/**
 * Centralized attendance verification service.
 * Orchestrates: auth check → Supabase attendance query → result.
 *
 * Per PRD v2.0:
 * - Check authentication first
 * - Query attendance_completions table by Employee Name + Today's Date (IST)
 * - The attendance_completions table is the single source of truth
 * - Queries should always return a maximum of one record (LIMIT 1)
 */

/**
 * Verify if the current user has completed today's attendance.
 * Handles the full flow: auth check → Supabase query.
 *
 * @returns {Promise<{ok: boolean, attendanceCompleted: boolean, error?: string}>}
 *   - ok: true if the check succeeded (even if no attendance found)
 *   - attendanceCompleted: true if attendance exists for today
 *   - error: description if something went wrong
 */
export async function verifyAttendance() {
  try {
    const ctx = getUserContext();
    if (!ctx || !ctx.employee) {
      clearSession();
      return { ok: false, attendanceCompleted: false, error: 'not_authenticated' };
    }

    const employeeName = ctx.employee.name;
    if (!employeeName) {
      return { ok: false, attendanceCompleted: false, error: 'employee_name_missing' };
    }

    const hasAttendance = await checkTodayAttendance({ employeeName });

    return {
      ok: true,
      attendanceCompleted: hasAttendance,
    };
  } catch (err) {
    console.error('[AttendanceCheck] Error verifying attendance:', err);
    return {
      ok: false,
      attendanceCompleted: false,
      error: String(err?.message || err),
    };
  }
}

/**
 * Requires attendance to be completed.
 * Returns redirect path if attendance is missing or auth is invalid.
 *
 * @returns {Promise<{requiresRedirect: boolean, redirectTo: string}|null>}
 *   - null if attendance is completed (OK to proceed)
 *   - { requiresRedirect: true, redirectTo: '/login' } if not authenticated
 *   - { requiresRedirect: true, redirectTo: '/attendance' } if attendance not done
 */
export async function requireAttendance() {
  const result = await verifyAttendance();

  if (!result.ok && result.error === 'not_authenticated') {
    return { requiresRedirect: true, redirectTo: '/login' };
  }

  if (!result.attendanceCompleted) {
    return { requiresRedirect: true, redirectTo: '/attendance' };
  }

  return null;
}

