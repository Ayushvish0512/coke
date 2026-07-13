import React from 'react';

export default function AttendanceLock({ disabled, message }) {
  if (!disabled) return null;
  return (
    <div
      style={{
        color: '#b45309',
        background: '#fff7ed',
        border: '1px solid #fed7aa',
        padding: 10,
        borderRadius: 6,
        marginBottom: 12,
      }}
    >
      {message}
    </div>
  );
}

