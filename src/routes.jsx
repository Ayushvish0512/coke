import React from 'react';
import LoginPage from './pages/Login.jsx';
import OperationPage from './pages/Operation.jsx';
import AttendancePage from './pages/Attendance.jsx';
import OpeningPage from './pages/Opening.jsx';
import ClosingPage from './pages/Closing.jsx';

export default [
  { path: '/login', element: <LoginPage /> },
  { path: '/operation', element: <OperationPage /> },
  { path: '/attendance', element: <AttendancePage /> },
  { path: '/opening', element: <OpeningPage /> },
  { path: '/closing', element: <ClosingPage /> },
];

