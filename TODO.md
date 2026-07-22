# Fix: Reduce Excessive Supabase Attendance Queries

## Done
- [x] Analysis complete: identified all call sites of `checkTodayAttendance()`

## Steps

### 1. `src/services/deviceAttendance.js` — Add localStorage-backed attendance cache
- [x] `setAttendanceCache()` writes to both `softy.attendanceCache` and syncs `softy.attendanceCompleted` (used by `isAttendanceCompleted()` in storage.js)
- [x] `getValidCache()` — reads from localStorage, validates employee name match + 5-min TTL
- [x] `checkTodayAttendance()` — checks cache first, only caches `true` results, `false` always re-fetches
- [x] Added `bypassCache` option for polling (though not needed since false isn't cached)
- [x] Cache survives full page reloads (localStorage, not in-memory)

### 2. `src/App.jsx` — Fix AttendanceGuard re-querying on navigation
- [x] Removed `location.pathname` from `useEffect` dependency array (changed to `[]`)
- [x] Added comment explaining why

### 3. Fix: `isAttendanceCompleted()` flag sync
- [x] `setAttendanceCache()` now also writes to `softy.attendanceCompleted` so pages using `isAttendanceCompleted()` (Opening, Closing, etc.) see the status immediately

### 4. Verify and test
- [x] Polling works correctly (false not cached, hits Supabase each time)
- [x] After attendance found, cache returns `true` instantly
- [x] All child pages (Opening, Closing, etc.) see completed status via localStorage flag
- [x] No re-queries on page navigation

