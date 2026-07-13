import React from 'react';
import Header from '../components/Header.jsx';
import Button from '../components/Button.jsx';
import FormContainer from '../components/FormContainer.jsx';
import AttendanceLock from '../components/AttendanceLock.jsx';
import { getUserContext, isAttendanceCompleted } from '../utils/storage.js';

export default function OperationPage() {
  const ctx = getUserContext();
  const attendanceDone = isAttendanceCompleted();

  if (!ctx) {
    window.location.assign('/login');
    return null;
  }

  const { employee, location } = ctx;
  const greeting = 'Good Morning';

  return (
    <div>
      <Header title={greeting + ' ' + (employee?.name || '')} />
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
            Maintainase
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

