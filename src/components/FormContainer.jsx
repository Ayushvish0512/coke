import React from 'react';

export default function FormContainer({ children }) {
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: 16 }}>
      {children}
    </div>
  );
}

