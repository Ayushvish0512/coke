import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import Button from '../components/Button.jsx';
import FormContainer from '../components/FormContainer.jsx';
import InputField from '../components/InputField.jsx';
import SelectField from '../components/SelectField.jsx';
import { getUserContext, isAttendanceCompleted, setAttendanceCompleted } from '../utils/storage.js';
import { sendWebhookPayload } from '../services/webhook.js';
import { validateRequiredFields } from '../services/validation.js';

const STATUS_OPTIONS = [
  { value: 'Present', label: 'Present' },
  { value: 'Leave', label: 'Leave' },
  { value: 'Half Day', label: 'Half Day' },
];

export default function AttendancePage() {
  const ctx = getUserContext();
  const [status, setStatus] = useState('Present');
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const already = isAttendanceCompleted();

  if (!ctx) {
    window.location.assign('/login');
    return null;
  }

  const { employee, location } = ctx;

  async function onSubmit(e) {
    e.preventDefault();
    const fieldMap = {
      status: { label: 'Attendance Status', type: 'text', required: true },
    };

    const nextErrors = validateRequiredFields({ status }, fieldMap);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      await sendWebhookPayload({
        location: location?.name,
        employee: employee?.name,
        operation: 'Attendance',
        formData: {
          status,
          remarks,
        },
      });

      setAttendanceCompleted(true);
      window.location.assign('/operation');
    } catch (err) {
      alert(String(err?.message || err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Header title="Attendance" />
      <FormContainer>
        {already ? (
          <div style={{ marginBottom: 12, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 10, borderRadius: 6 }}>
            Attendance already completed.
          </div>
        ) : null}

        <form onSubmit={onSubmit}>
          <SelectField label="Attendance Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          <InputField label="Remarks" value={remarks} onChange={setRemarks} placeholder="" type="text" />

          <div style={{ marginTop: 8 }}>
            <Button disabled={isLoading} type="submit">
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </FormContainer>
    </div>
  );
}

