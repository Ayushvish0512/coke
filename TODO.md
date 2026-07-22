# PRD v2.0 Implementation - Daily Attendance Validation Flow

## Status: In Progress

## Implementation Steps

### Step 1: Add `checkTodayAttendance()` to Supabase service
- [x] File: `src/services/deviceAttendance.js`
- Add function to query `attendance_completions` table by Employee Name + Today's Date (IST)
- Returns boolean if attendance exists for today

### Step 2: Create centralized attendance check service
- [x] File: `src/services/attendanceCheck.js` (NEW)
- Orchestrates auth check + attendance verification
- Provides `requireAttendance()` utility

### Step 3: Update `App.jsx` with route guards
- [x] File: `src/App.jsx`
- Add AppGuard component for auth + attendance validation
- Handle loading state during Supabase query
- Redirect unauthenticated users to /login
- Redirect users without attendance to /attendance

### Step 4: Update `Login.jsx` post-login flow
- [x] File: `src/pages/Login.jsx`
- After successful login, check attendance via Supabase
- If attendance exists → redirect to /operation
- If not → redirect to /attendance

### Step 5: Update `Attendance.jsx` Supabase integration
- [x] File: `src/pages/Attendance.jsx`
- Check Supabase attendance status on page load
- Save attendance record to Supabase after webhook success
- Use Supabase as source of truth

### Step 6: Update `Operation.jsx` attendance check
- [x] File: `src/pages/Operation.jsx`
- Replace localStorage attendance check with Supabase query



