import { supabase } from './supabaseClient.js';

function toYMD(date = new Date()) {
  // YYYY-MM-DD (local)
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// NOTE: This assumes you will create these tables in Supabase:
// 1) login_activities
//    - id (uuid)
//    - employee_id (text)
//    - device_id (text)
//    - login_date (date) OR login_day (text YYYY-MM-DD)
//    - created_at (timestamptz)
// 2) attendance_completions
//    - id (uuid)
//    - employee_id (text)
//    - device_id (text)
//    - attendance_date (date) OR attendance_day (text YYYY-MM-DD)
//    - created_at (timestamptz)
//
// And optionally unique constraints on (employee_id, device_id, login_date)
// and (employee_id, device_id, attendance_date).

export async function upsertLoginActivity({ employeeId, deviceId, day } = {}) {
  if (!employeeId || !deviceId) throw new Error('employeeId and deviceId are required');
  const attendance_day = day || toYMD();

  // If your schema uses a different column name, adjust here.
  const { error } = await supabase.from('login_activities').upsert(
    {
      employee_id: String(employeeId),
      device_id: String(deviceId),
      login_day: attendance_day,
    },
    { onConflict: 'employee_id,device_id,login_day' },
  );

  if (error) throw error;
  return { ok: true };
}

export async function upsertAttendanceCompletion({ employeeId, deviceId, day } = {}) {
  if (!employeeId || !deviceId) throw new Error('employeeId and deviceId are required');
  const attendance_day = day || toYMD();

  const { error } = await supabase.from('attendance_completions').upsert(
    {
      employee_id: String(employeeId),
      device_id: String(deviceId),
      attendance_day: attendance_day,
    },
    { onConflict: 'employee_id,device_id,attendance_day' },
  );

  if (error) throw error;
  return { ok: true };
}

export async function isAttendanceCompletedForDevice({ employeeId, deviceId, day } = {}) {
  if (!employeeId || !deviceId) throw new Error('employeeId and deviceId are required');
  const attendance_day = day || toYMD();

  const { data, error } = await supabase
    .from('attendance_completions')
    .select('id')
    .eq('employee_id', String(employeeId))
    .eq('device_id', String(deviceId))
    .eq('attendance_day', attendance_day)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

