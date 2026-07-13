import React from 'react';

export default function Header({ title }) {
  return (
    <div style={{ padding: 16, borderBottom: '1px solid #eee', marginBottom: 16 }}>
      <h1 style={{ margin: 0, fontSize: 18 }}>{title}</h1>
    </div>
  );
}

