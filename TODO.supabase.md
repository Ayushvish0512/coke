# Supabase integration notes (ERP MVP)

## Implemented in repo
- Added `@supabase/supabase-js` dependency
- Added `src/services/supabaseClient.js`
- Added `src/services/deviceAttendance.js` (Supabase table calls)

## You must create Supabase tables
This code currently expects:

### Table: `login_activities`
Columns:
- `id` (uuid, primary)
- `employee_id` (text)
- `device_id` (text)
- `login_day` (text, YYYY-MM-DD)
- `created_at` (timestamptz)
Unique constraint:
- `(employee_id, device_id, login_day)`

### Table: `attendance_completions`
Columns:
- `id` (uuid, primary)
- `employee_id` (text)
- `device_id` (text)
- `attendance_day` (text, YYYY-MM-DD)
- `created_at` (timestamptz)
Unique constraint:
- `(employee_id, device_id, attendance_day)`

## Next step (not done yet)
- Generate a stable `device_id` on the browser (localStorage) and
  call these services:
  - `upsertLoginActivity` on login
  - `upsertAttendanceCompletion` when attendance is submitted
  - `isAttendanceCompletedForDevice` to gate UI instead of localStorage.

