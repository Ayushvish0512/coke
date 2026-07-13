import React from 'react';
import LoginPage from './pages/Login.jsx';
import OperationPage from './pages/Operation.jsx';
import AttendancePage from './pages/Attendance.jsx';
import OpeningPage from './pages/Opening.jsx';
import ClosingPage from './pages/Closing.jsx';
import StockRequestPage from './pages/StockRequest.jsx';
import MaintenancePage from './pages/Maintenance.jsx';
import ChallengesPage from './pages/Challenges.jsx';

export default [
  { path: '/login', element: <LoginPage /> },
  { path: '/operation', element: <OperationPage /> },
  { path: '/attendance', element: <AttendancePage /> },
  { path: '/opening', element: <OpeningPage /> },
  { path: '/closing', element: <ClosingPage /> },
  { path: '/stock-request', element: <StockRequestPage /> },
  { path: '/maintenance', element: <MaintenancePage /> },
  { path: '/challenges', element: <ChallengesPage /> },
];



