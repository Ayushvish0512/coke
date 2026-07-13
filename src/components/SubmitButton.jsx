import React from 'react';
import Button from './Button.jsx';

export default function SubmitButton({ children, disabled, isLoading, onClick }) {
  return (
    <Button type="submit" disabled={disabled || isLoading} onClick={onClick}>
      {isLoading ? 'Submitting...' : children}
    </Button>
  );
}

