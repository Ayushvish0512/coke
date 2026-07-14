import React from 'react';

export default function Button({ children, onClick, disabled, type = 'button', style = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '10px 14px',
        borderRadius: 6,
        border: '1px solid #ddd',
        background: disabled ? '#f5f5f5' : '#fff',
        color: '#111827',
        cursor: disabled ? 'not-allowed' : 'pointer',
        WebkitTextFillColor: '#111827',
        ...style,
      }}
    >
      {children}
    </button>
  );
}


