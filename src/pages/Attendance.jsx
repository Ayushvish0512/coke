import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import Button from '../components/Button.jsx';
import FormContainer from '../components/FormContainer.jsx';
import InputField from '../components/InputField.jsx';
import SelectField from '../components/SelectField.jsx';
import { getUserContext, isAttendanceCompleted, setAttendanceCompleted } from '../utils/storage.js';
import { sendOperationWebhookPayload } from '../services/webhook.js';
import { validateRequiredFields } from '../services/validation.js';
import { getIndiaDateTimeString } from '../utils/dateTime.js';

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

  // base64 image fields (backend will upload to imgbb)
  const [selfieImageFile, setSelfieImageFile] = useState(null);
  const [stallImageFile, setStallImageFile] = useState(null);
  const [selfieImageError, setSelfieImageError] = useState('');
  const [stallImageError, setStallImageError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();

    const fieldMap = {
      status: { label: 'Attendance Status', type: 'text', required: true },
    };

    const nextErrors = validateRequiredFields({ status }, fieldMap);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    // validate images (required + size < 10MB)
    const selfieValidation = (() => {
      if (!selfieImageFile) return { ok: false, error: 'Selfie image is required' };
      if (selfieImageFile.size > 10 * 1024 * 1024) return { ok: false, error: 'Selfie image must be less than 10 MB' };
      if (!selfieImageFile.type?.startsWith('image/')) return { ok: false, error: 'Selfie must be an image' };
      return { ok: true };
    })();

    const stallValidation = (() => {
      if (!stallImageFile) return { ok: false, error: 'Stall image is required' };
      if (stallImageFile.size > 10 * 1024 * 1024) return { ok: false, error: 'Stall image must be less than 10 MB' };
      if (!stallImageFile.type?.startsWith('image/')) return { ok: false, error: 'Stall must be an image' };
      return { ok: true };
    })();

    setSelfieImageError(selfieValidation.ok ? '' : selfieValidation.error);
    setStallImageError(stallValidation.ok ? '' : stallValidation.error);
    if (!selfieValidation.ok || !stallValidation.ok) return;

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

    setIsLoading(true);
    try {
      const [selfieImageBase64, stallImageBase64] = await Promise.all([
        toBase64(selfieImageFile),
        toBase64(stallImageFile),
      ]);

      const loginDateTime = getIndiaDateTimeString();


      await sendOperationWebhookPayload({
        location: location?.name,
        employee: employee?.name,
        operation: 'Attendance',
        formData: {
          status,
          remarks,
          loginDateTime,
          selfieImage: { key: 'selfieImage', value: String(selfieImageBase64).split(',')[1] || selfieImageBase64 },
          stallImage: { key: 'stallImage', value: String(stallImageBase64).split(',')[1] || stallImageBase64 },
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
      <Header title="Attendance" onBack={() => window.location.assign('/operation')} />
      <FormContainer>
        {already ? (
          <div style={{ marginBottom: 12, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 10, borderRadius: 6 }}>
            Attendance already completed.
          </div>
        ) : null}

        <form onSubmit={onSubmit}>
          <SelectField label="Attendance Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
          <InputField label="Remarks" value={remarks} onChange={setRemarks} placeholder="" type="text" />

          {/* Image uploads (backend uploads to imgbb). Mandatory. */}
          <div style={{ marginTop: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Selfie (Branded T-Shirt)</div>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setSelfieImageFile(f);
                setSelfieImageError('');
              }}
            />
            {selfieImageError ? (
              <div style={{ marginTop: 4, color: '#dc2626', fontSize: 12 }}>{selfieImageError}</div>
            ) : null}
          </div>

          <div style={{ marginTop: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 13, marginBottom: 6 }}>Stall Image (Hygiene + Promoter)</div>
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

