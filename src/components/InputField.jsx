import React from 'react';

export default function InputField({ label, value, onChange, placeholder, type = 'text', error }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 13, marginBottom: 6 }}>{label}</div>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
      />
      {error ? <div style={{ color: 'crimson', marginTop: 6, fontSize: 12 }}>{error}</div> : null}
    </div>
  );
}

