import React, { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import FormContainer from '../components/FormContainer.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import AttendanceLock from '../components/AttendanceLock.jsx';
import { getUserContext, isAttendanceCompleted } from '../utils/storage.js';
import { sendWebhookPayload } from '../services/webhook.js';
import { validateRequiredFields } from '../services/validation.js';
import closingFields from '../config/closingFields.json';

export default function ClosingPage() {
  const ctx = getUserContext();
  const attendanceDone = isAttendanceCompleted();

  const fieldEntries = useMemo(() => Object.entries(closingFields), []);

  const [formData, setFormData] = useState({
    closingStock: '',
    closingCash: '',
    damagedQty: '',
    remarks: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!ctx) {
    window.location.assign('/login');
    return null;
  }

  const { employee, location } = ctx;

  // closing image upload (backend will upload to imgbb)
  const [stallImageFile, setStallImageFile] = useState(null);
  const [stallImageError, setStallImageError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();

    const nextErrors = validateRequiredFields(formData, closingFields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const stallValidation = (() => {
      if (!stallImageFile) return { ok: false, error: 'Stall image is required' };
      if (stallImageFile.size > 10 * 1024 * 1024) return { ok: false, error: 'Stall image must be less than 10 MB' };
      if (!stallImageFile.type?.startsWith('image/')) return { ok: false, error: 'Stall must be an image' };
      return { ok: true };
    })();

    setStallImageError(stallValidation.ok ? '' : stallValidation.error);
    if (!stallValidation.ok) return;

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

    setIsLoading(true);
    try {
      const closingImageBase64 = await toBase64(stallImageFile);

      const loginDateTime = new Date().toISOString();

      await sendWebhookPayload({
        location: location?.name,
        employee: employee?.name,
        operation: 'Closing',
        formData: {
          closingStock: Number(formData.closingStock),
          closingCash: Number(formData.closingCash),
          damagedQty: formData.damagedQty === '' ? undefined : Number(formData.damagedQty),
          remarks: formData.remarks || '',
          loginDateTime,
          closingImage: {
            key: 'selfieWithStall',
            value: String(closingImageBase64).split(',')[1] || closingImageBase64,
          },
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
      <Header title="Closing Entry" onBack={() => window.location.assign('/operation')} />
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
          <div style={{ marginBottom: 12 }}>
            <AttendanceLock disabled={true} message="Please complete Attendance first." />
          </div>
        ) : null}


        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Selfie with Stall Image</div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setStallImageFile(f);
                setStallImageError('');
              }}
            />
            {stallImageError ? (
              <div style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>{stallImageError}</div>
            ) : null}
          </div>

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

