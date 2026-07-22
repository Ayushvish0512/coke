import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import routes from './routes.jsx';
import { getUserContext, clearSession } from './utils/storage.js';
import { checkTodayAttendance } from './services/deviceAttendance.js';

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ['/login'];

// Routes that do NOT require attendance (login is already public)
const ATTENDANCE_EXEMPT_ROUTES = ['/login', '/attendance'];

function AuthGuard({ children }) {
  const location = useLocation();
  const ctx = getUserContext();

  // Allow public routes without auth
  if (PUBLIC_ROUTES.includes(location.pathname)) {
    return children;
  }

  // Not authenticated → redirect to login
  if (!ctx || !ctx.employee) {
    clearSession();
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AttendanceGuard({ children }) {
  const location = useLocation();
  const [checkState, setCheckState] = useState({
    loading: true,
    attendanceCompleted: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const ctx = getUserContext();
      if (!ctx || !ctx.employee) {
        if (!cancelled) setCheckState({ loading: false, attendanceCompleted: false });
        return;
      }

      try {
        const hasAttendance = await checkTodayAttendance({ employeeName: ctx.employee.name });
        if (!cancelled) {
          setCheckState({ loading: false, attendanceCompleted: hasAttendance });
        }
      } catch (err) {
        console.error('[App] Attendance check failed:', err);
        // On error, fall back to localStorage for resilience
        if (!cancelled) {
          setCheckState({ loading: false, attendanceCompleted: false });
        }
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  // Allow public routes and attendance page through
  if (ATTENDANCE_EXEMPT_ROUTES.includes(location.pathname)) {
    return children;
  }

  if (checkState.loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: 16,
          color: '#555',
        }}
      >
        Checking attendance...
      </div>
    );
  }

  // Attendance not completed → block and redirect
  if (!checkState.attendanceCompleted) {
    return <Navigate to="/attendance" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public route: login */}
      <Route path="/login" element={<LoginRoute />} />

      {/* Protected routes: require auth + attendance */}
      {routes
        .filter((r) => r.path !== '/login')
        .map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={
              <AuthGuard>
                <AttendanceGuard>{r.element}</AttendanceGuard>
              </AuthGuard>
            }
          />
        ))}

      {/* Default redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

/**
 * Login route wrapper that redirects to /operation if already authenticated
 * and attendance is completed, or to /attendance if not.
 */
function LoginRoute() {
  const ctx = getUserContext();

  // If not authenticated at all, show login
  if (!ctx || !ctx.employee) {
    return routes.find((r) => r.path === '/login')?.element || <Navigate to="/login" replace />;
  }

  // Authenticated — check attendance status
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const hasAttendance = await checkTodayAttendance({ employeeName: ctx.employee.name });
        if (!cancelled) {
          setRedirect(hasAttendance ? '/operation' : '/attendance');
        }
      } catch {
        // On error, default to attendance page to be safe
        if (!cancelled) setRedirect('/attendance');
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [ctx.employee.name]);

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  // Show a brief loading state while checking attendance
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: 16,
        color: '#555',
      }}
    >
      Checking session...
    </div>
  );
}

