import React, { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import FormContainer from '../components/FormContainer.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import AttendanceLock from '../components/AttendanceLock.jsx';
import { getUserContext, isAttendanceCompleted } from '../utils/storage.js';
import { sendWebhookPayload } from '../services/webhook.js';
import { validateRequiredFields } from '../services/validation.js';
import openingFields from '../config/openingFields.json';

export default function OpeningPage() {
  const ctx = getUserContext();
  const attendanceDone = isAttendanceCompleted();

  const fieldEntries = useMemo(() => Object.entries(openingFields), []);

  const [formData, setFormData] = useState({
    openingStock: '',
    openingCash: '',
    remarks: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!ctx) {
    window.location.assign('/login');
    return null;
  }

  const { employee, location } = ctx;

  async function onSubmit(e) {
    e.preventDefault();

    const nextErrors = validateRequiredFields(formData, openingFields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      const loginDateTime = new Date().toISOString();

      await sendWebhookPayload({
        location: location?.name,
        employee: employee?.name,
        operation: 'Opening',
        formData: {
          openingStock: Number(formData.openingStock),
          openingCash: Number(formData.openingCash),
          remarks: formData.remarks || '',
          loginDateTime,
        },
      });

      window.location.assign('/operation');
    } catch (err) {
      alert(String(err?.message || err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Header title="Opening Entry" onBack={() => window.location.assign('/operation')} />
      <FormContainer>
        <div style={{ marginBottom: 12, color: '#555' }}>
          <div>
            <b>Current User</b>
          </div>
          <div>{employee?.name}</div>
          <div style={{ marginTop: 8 }}>
            <b>Location</b>
          </div>
          <div>{location?.name}</div>
        </div>

        {!attendanceDone ? (
          <AttendanceLock
            disabled={true}
            message="Please complete Attendance first."
          />
        ) : null}


        <form onSubmit={onSubmit}>
          {fieldEntries.map(([key, meta]) => (
            <InputField
              key={key}
              label={meta.label}
              value={formData[key]}
              onChange={(v) => setFormData((p) => ({ ...p, [key]: meta.type === 'number' ? v : v }))}
              placeholder=""
              type={meta.type === 'number' ? 'number' : 'text'}
              error={errors[key]}
            />
          ))}

          <div style={{ marginTop: 6 }}>
            <Button disabled={!attendanceDone || isLoading} type="submit">
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </FormContainer>
    </div>
  );
}

