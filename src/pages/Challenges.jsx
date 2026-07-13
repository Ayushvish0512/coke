import React, { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import FormContainer from '../components/FormContainer.jsx';
import InputField from '../components/InputField.jsx';
import Button from '../components/Button.jsx';
import SelectField from '../components/SelectField.jsx';
import { getUserContext, isAttendanceCompleted } from '../utils/storage.js';
import { sendWebhookPayload } from '../services/webhook.js';
import { validateRequiredFields } from '../services/validation.js';
import challengesFields from '../config/challengesFields.json';

const CHALLENGE_TYPE_OPTIONS = [
  { value: '', label: '-- Select --' },
  { value: 'less cround', label: 'Less Cround' },
  { value: 'missing raw material', label: 'Missing raw material' },
  { value: 'other', label: 'Other' },
];

export default function ChallengesPage() {
  const ctx = getUserContext();
  const attendanceDone = isAttendanceCompleted();

  const fieldEntries = useMemo(() => Object.entries(challengesFields), []);

  const [formData, setFormData] = useState({
    challengeType: '',
    other: '',
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

    const nextErrors = validateRequiredFields(formData, challengesFields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      await sendWebhookPayload({
        location: location?.name,
        employee: employee?.name,
        operation: 'Challenges',
        formData: {
          challengeType: formData.challengeType,
          other: formData.challengeType === 'other' ? (formData.other || '') : undefined,
          remarks: formData.remarks || '',
          // keep old keys for backend compatibility
          lessCround: formData.challengeType === 'less cround' ? true : undefined,
          rawMaterialUnavailable: formData.challengeType === 'missing raw material' ? true : undefined,
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
      <Header title="Challenges" onBack={() => window.location.assign('/operation')} />
      <FormContainer>
        <form onSubmit={onSubmit}>
          <SelectField
            label={challengesFields.challengeType.label}
            value={formData.challengeType}
            onChange={(v) => setFormData((p) => ({ ...p, challengeType: v }))}
            options={CHALLENGE_TYPE_OPTIONS}
          />

          {formData.challengeType === 'other' ? (
            <InputField
              label={challengesFields.other.label}
              value={formData.other}
              onChange={(v) => setFormData((p) => ({ ...p, other: v }))}
              placeholder=""
              type="text"
              error={errors.other}
            />
          ) : null}

          <InputField
            label={challengesFields.remarks.label}
            value={formData.remarks}
            onChange={(v) => setFormData((p) => ({ ...p, remarks: v }))}
            placeholder=""
            type="text"
            error={errors.remarks}
          />

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


