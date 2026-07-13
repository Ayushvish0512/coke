import React, { useState } from 'react';

import Button from './Button.jsx';
import { clearSessionForEmployee } from '../utils/storage.js';

export default function Header({ title, onBack, showLogout = true }) {
  const [showConfirm, setShowConfirm] = useState(false);

  function doLogout() {
    // MVP: clear session and go to login
    try {
      const raw = localStorage.getItem('softy.user');
      const ctx = raw ? JSON.parse(raw) : null;
      clearSessionForEmployee({
        employee: ctx?.employee ?? null,
        location: ctx?.location ?? null,
      });
    } catch {
      // ignore
    }

    localStorage.removeItem('softy.user');
    localStorage.removeItem('softy.attendanceCompleted');

    setShowConfirm(false);
    window.location.assign('/login');
  }

  return (
    <div
      style={{
        padding: 16,
        borderBottom: '1px solid #eee',
        marginBottom: 16,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onBack ? (
          <Button onClick={onBack} style={{ padding: '8px 12px' }}>
            Back
          </Button>
        ) : null}
        <h1 style={{ margin: 0, fontSize: 18 }}>{title}</h1>
      </div>

      {showLogout ? (
        <div style={{ position: 'absolute', right: 16, top: 16 }}>
          <Button
            onClick={() => setShowConfirm(true)}
            style={{ background: '#fff', border: '1px solid #ddd' }}
          >
            Logout
          </Button>
        </div>
      ) : null}

      {showConfirm ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div style={{ background: '#fff', padding: 18, borderRadius: 10, width: 320 }}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>Confirm Logout?</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Button onClick={() => setShowConfirm(false)} style={{ background: '#f5f5f5' }}>
                No
              </Button>
              <Button onClick={doLogout}>Yes</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

