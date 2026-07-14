import React, { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import FormContainer from '../components/FormContainer.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import { getUserContext, isAttendanceCompleted } from '../utils/storage.js';
import { sendOperationWebhookPayload } from '../services/webhook.js';
import { validateRequiredFields } from '../services/validation.js';
import stockRequestFields from '../config/stockRequestFields.json';

export default function StockRequestPage() {
  const ctx = getUserContext();
  const attendanceDone = isAttendanceCompleted();

  const fieldEntries = useMemo(() => Object.entries(stockRequestFields), []);

  const [formData, setFormData] = useState({
    cups: '',
    co2: '',
    bibSyrup: '',
    waterGallons: '',
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

    const nextErrors = validateRequiredFields(formData, stockRequestFields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      const loginDateTime = new Date().toISOString();

await sendOperationWebhookPayload({
        location: location?.name,
        employee: employee?.name,
        operation: 'StockRequest',
        formData: {
          cups: formData.cups === '' ? undefined : Number(formData.cups),
          co2: formData.co2 === '' ? undefined : Number(formData.co2),
          bibSyrup: formData.bibSyrup === '' ? undefined : Number(formData.bibSyrup),
          waterGallons: formData.waterGallons === '' ? undefined : Number(formData.waterGallons),
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
      <Header title="Stock Request" onBack={() => window.location.assign('/operation')} />
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

        <div style={{ marginBottom: 12, color: '#888', fontSize: 12 }}>
          Attendance status: {attendanceDone ? 'Completed' : 'Pending'}
        </div>

        <form onSubmit={onSubmit}>
          {fieldEntries.map(([key, meta]) => (
            <InputField
              key={key}
              label={meta.label}
              value={formData[key]}
              onChange={(v) => setFormData((p) => ({ ...p, [key]: v }))}
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

