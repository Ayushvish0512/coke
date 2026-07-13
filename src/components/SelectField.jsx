import React from 'react';

export default function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 13, marginBottom: 6 }}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

