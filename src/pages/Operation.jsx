import React, { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import Button from '../components/Button.jsx';
import FormContainer from '../components/FormContainer.jsx';
import AttendanceLock from '../components/AttendanceLock.jsx';
import { clearSession, getUserContext, isSessionValid } from '../utils/storage.js';
import { checkTodayAttendance } from '../services/deviceAttendance.js';

export default function OperationPage() {
  const ctx = getUserContext();
  const [attendanceDone, setAttendanceDone] = useState(null); // null = loading, true/false = result

  useEffect(() => {
    let cancelled = false;

    async function checkAttendance() {
      if (!ctx || !ctx.employee) {
        if (!cancelled) setAttendanceDone(false);
        return;
      }

      try {
        // PRD v2.0: Check attendance from Supabase (single source of truth)
        const hasAttendance = await checkTodayAttendance({ employeeName: ctx.employee.name });
        if (!cancelled) {
          setAttendanceDone(hasAttendance);
        }
      } catch (err) {
        console.error('[Operation] Attendance check failed, falling back to localStorage:', err);
        // Fall back to localStorage for resilience
        const stored = localStorage.getItem('softy.attendanceCompleted');
        if (!cancelled) {
          setAttendanceDone(stored === 'true');
        }
      }
    }

    // If attendance guard in App.jsx already verified, localStorage flag can serve as fast cache
    const stored = localStorage.getItem('softy.attendanceCompleted');
    if (stored === 'true') {
      // Optimistically show as done, but verify async
      setAttendanceDone(true);
    }

    checkAttendance();

    return () => {
      cancelled = true;
    };
  }, [ctx?.employee?.name]);

  if (!ctx || !isSessionValid()) {
    clearSession();
    window.location.assign('/login');
    return null;
  }

  const { employee, location } = ctx;
  const greeting = 'Good Morning';

  // Show loading state while checking attendance
  if (attendanceDone === null) {
    return (
      <div>
        <Header title={"Operation" ,greeting + ' ' + (employee?.name || '')}/>
        <FormContainer>
          <div style={{ textAlign: 'center', color: '#555', fontSize: 14, padding: 20 }}>
            Loading...
          </div>
        </FormContainer>
      </div>
    );
  }

  return (
    <div>
      <Header title={"Operation" ,greeting + ' ' + (employee?.name || '')}/>

      <FormContainer>
        <div style={{ marginBottom: 16, color: '#555' }}>
          <div>
            <b>Location</b>
          </div>
          <div>{location?.name}</div>
        </div>

        <AttendanceLock disabled={!attendanceDone} message="Please complete Attendance first." />

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button onClick={() => (window.location.assign('/attendance'))}>Attendance</Button>
          <Button
            disabled={!attendanceDone}
            onClick={() => (window.location.assign('/opening'))}
          >
            Opening
          </Button>
          <Button
            disabled={!attendanceDone}
            onClick={() => (window.location.assign('/closing'))}
          >
            Closing
          </Button>
          <Button
            disabled={!attendanceDone}
            onClick={() => (window.location.assign('/stock-request'))}
          >
            Stock Request
          </Button>
          <Button
            disabled={!attendanceDone}
            onClick={() => (window.location.assign('/maintenance'))}
          >
            Maintenance
          </Button>
          <Button
            disabled={!attendanceDone}
            onClick={() => (window.location.assign('/challenges'))}
          >
            Challenges
          </Button>
        </div>

      </FormContainer>

    </div>
  );
}



