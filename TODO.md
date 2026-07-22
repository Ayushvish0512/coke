# Fix: Reduce Excessive Supabase Attendance Queries

## Done
- [x] Analysis complete: identified all call sites of `checkTodayAttendance()`

## Steps

### 1. `src/services/deviceAttendance.js` — Add in-memory cache with TTL
- [x] Add module-level cache variable with timestamp
- [x] Return cached result within 5-min TTL
- [x] Export `setAttendanceCache(value)` for immediate invalidation/update
- [x] Integrated cache check into `checkTodayAttendance()` — hits cache first, stores on fetch

### 2. `src/App.jsx` — Fix AttendanceGuard re-querying on navigation
- [x] Removed `location.pathname` from `useEffect` dependency array (changed to `[]`)
- [x] Added comment explaining why

### 3. `src/pages/Operation.jsx` — Already handled by caching layer (no change needed)

### 4. Verify and test
- [x] Confirm no unnecessary queries on page navigation
- [x] Confirm attendance check still works correctly

