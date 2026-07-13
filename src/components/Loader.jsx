import React from 'react';

export default function Loader({ text = 'Submitting...' }) {
  return (
    <div style={{ padding: 12 }}>
      <span>{text}</span>
    </div>
  );
}

